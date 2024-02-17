const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js'); 
const fs = require('fs');
const multer = require('multer');
const path = require("path");

async function getBoardList(sortSCaseNum, sortNCaseNum, keyword) {
  let search = "";

  if (keyword != "none") {
    if (sortSCaseNum == 0) {
      search = ' WHERE BOD_TITLE Like "%'  + keyword + '%"';
    } else if (sortSCaseNum == 1) {
      search = ' WHERE BOD_CONTENT Like "%' + keyword + '%"';
    } else if (sortSCaseNum == 2) {
      search = ' WHERE BOD_TITLE OR BOD_CONTENT Like "%' + keyword + '%"';
    } else if (sortSCaseNum == 3) {
      search = ' WHERE U.USER_NICK Like "%' + keyword + '%"';
    }
  }

  const narrange = sortBCaseReplace(sortNCaseNum);
  // const sarrange = sortSCaseReplace(sortSCaseNum);

  return new Promise((resolve, reject) => {
    const query = search !== "" ? sql.board + search + narrange : sql.board + narrange;
    //console.log(query);
    db.query(query, function (error, results, fields) {
      if (error) {
        console.error(error);
        reject(error);
      }
      resolve(results);
    });
  });
}

function sortBCaseReplace(sortBCase) {
  let order = ` ORDER BY BOD_DATE DESC, BOD_NO DESC`; // 최근 순
  if (sortBCase == 1) { // 오래된 순
    order = ` ORDER BY BOD_DATE, BOD_NO DESC`;
  }
  if (sortBCase == 2) { // 조회수 높은 순
    order = ` ORDER BY BOD_COUNT DESC, BOD_NO DESC`;
  }
  if (sortBCase == 3) { // 조회수 낮은 순
    order = ` ORDER BY BOD_COUNT, BOD_NO DESC`;
  }
  return order;
}



router.get('/board_list/:sortSCase/:sortBCase/:keyword', async function (request, response, next) {
  const sortSCase = request.params.sortSCase;
  const sortBCase = request.params.sortBCase;
  const keyword = request.params.keyword;

  try {
    const results = await getBoardList(sortSCase, sortBCase, keyword);
    response.json(results);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "목록에러" });
  }
});

router.get('/main_board_list', function (request, response, next) {

  db.query(sql.mainBoard, function (err, results, fields) {
    if (err) {
      console.error(err);
      return response.status(500).json({ error: '에러' });
    }
    response.json(results);
  }); 
});

router.get('/boardDetail/:board_No', (request, response) => {
  const boardNo = request.params.board_No;

  db.query(sql.boarddetail, [boardNo, boardNo], function (error, results) {
    if (error) {
      console.error(error);
      return response.status(500).json({ error: '내용로드에러' });
    } 
    response.json(results);
  });
});

router.post('/freemodify', function (request, response, next)  {
  const board = request.body;

 db.query(sql.bod_update, [board.bod_title, board.bod_content, board.bod_no], function (error, result, fields) { //다른 값을 먼저 저장해서 rvw_no 자동생성
   if (error) {
     console.error(error);
     return response.status(500).json({ error: 'error' });
   }
   return response.status(200).json({ message: 'success' });
 });
});

router.post('/addBCount', (req, res) => {
  const bodNo = req.body.bod_no;

  db.query(sql.boardCadd, [bodNo], function (error, comments) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'error'});
    } else {
      return res.status(200).json({ message: 'complete'});
    }
  })
})



router.post('/addComment/:BOD_NO/:user_no', (req, res) => {
  const boardno = req.params.BOD_NO;
  const user_no = req.params.user_no;
  const commentContent = req.body.commentContent; // 댓글 내용을 요청에서 가져옴

  // 댓글 생성 SQL 쿼리 실행
  db.query(sql.createComment, [user_no, boardno, commentContent], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(200).json({ message: 'error' });
    } else {
      //console.log('새로운 댓글이 성공적으로 생성되었습니다.');
      // 댓글이 생성되면 댓글 목록을 다시 불러옵니다.
      db.query(sql.getcomment, [boardno], function (error, comments) {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: '댓글을 불러오는 중 오류가 발생했습니다.' });
        } else {
          res.status(200).json({ message: 'success', comments: comments });
        }
      });
    }
  });
});

// GET /comments/:board_no - 게시글의 댓글 목록 가져오기
router.get('/loadComment/:BOD_NO', (req, res) => {
  const board_no = req.params.BOD_NO;

  db.query(sql.getcomment, [board_no], function (error, comments) {
      if (error) {
          console.error(error);
          return res.status(500).json({ error: '댓글을 불러오는 중 오류가 발생했습니다.' });
      } else {
          res.json(comments);
      }
  });
});


router.post('/deleteComment', (req, res) => {
const com_no = req.body.com_no;

  db.query(sql.deleteComment, [com_no], function (error, result) {
      if (error) {
          console.error(error);
          return res.status(500).json({ error: '예약취소에러' });
      } else {
      res.send(result);
      }
  });
});

router.post('/deleteBoard', (req, res) => {
  const bod_no = req.body.bod_no;
  
    db.query(sql.deleteBoard, [bod_no], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: '글 삭제에러' });
        } 
        
        db.query(sql.deleteBComment, [bod_no], function (errorb, resultb) {
          if (errorb) {
            console.error(error);
            return res.status(500).json({ error: '글 댓글 삭제에러' });
          }

          return res.status(200).json({
            message: 'success'
          });

        })
    });
  });


router.post('/boardWrite', function (request, response) {

  const boards = request.body;

    db.query(sql.board_add, [boards.title, boards.content, boards.user_no], function (error, data) {
      if (error) {
        return response.status(500).json({
          message: 'DB_error'
        })
      }
        return response.status(200).json({
          message: 'join_complete'
        });
    })
       
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post('/reportWrite', upload.array('rep_img', 3), async (req, res) => {
  const { title, content, category, user_no } = req.body;
  const rep_imgs = req.files.map((file) => file.buffer);
  console.log(req.files);

  try {
    // 이미지를 제외한 다른 데이터를 먼저 저장
    const insertQuery = `INSERT INTO TB_REPORT (REP_TITLE, REP_CONTENT, REP_CATEGORY, USER_NO) VALUES (?,?,?,?)`;
    let result; // result 변수를 선언

    await new Promise((resolve, reject) => {
      db.query(insertQuery, [title, content, category, user_no], (err, queryResult) => {
        if (err) reject(err);
        console.log("1번 쿼리 통과중");
        result = queryResult; // result 변수에 queryResult 할당
        resolve();
      });
    });

    // 이미지를 첨부했다면
    if (rep_imgs.length > 0) {
      const rep_no = result.insertId;
      await Promise.all(rep_imgs.map(async (img, index) => {
        const randomSixDigitNumber = Math.floor(Math.random() * 900000) + 100000;
        const ext = req.files[index].originalname.split('.').pop();
        const filename = `${rep_no}_${user_no}_${randomSixDigitNumber}_${index}.${ext}`;
        const filePath = path.join(__dirname, '..', 'uploads', 'uploadReport', filename);

        // 이미지 파일을 서버 폴더에 저장
        await new Promise((resolve, reject) => {
          fs.writeFile(filePath, img, (err3) => {
            if (err3) reject(err3);
            console.log("2번 쿼리 통과중");
            resolve();
          });
        });

        // 이미지 파일 이름을 DB에 저장
        await new Promise((resolve, reject) => {
          db.query(`INSERT INTO TB_REPORT_IMG (REP_IMG, REP_NO) VALUES (?,?)`, [filename, rep_no], (err4) => {
            if (err4) reject(err4);
            console.log("3번 쿼리 통과중");
            resolve();
          });
        });
      }));
    }

    // 서버 폴더를 정리하기 위해 DB에 있는 모든 이미지 파일 이름을 불러옴
    const repImgsFromDB = await new Promise((resolve, reject) => {
      db.query('SELECT rep_img FROM tb_report_img', (err5, rows) => {
        if (err5) reject(err5);
        console.log("4번 쿼리 통과중");
        resolve(rows.map((row) => row.rep_img));
      });
    });

    const uploadDirectory = path.join(__dirname, '../uploads/uploadReport');

    // 서버 폴더 내용 확인
    fs.readdir(uploadDirectory, (err, files) => {
      if (err) {
        console.error('경로 오류:', err);
        return;
      }

      // DB에 없는 파일만 삭제하기 위한 필터
      const filesToDelete = files.filter((file) => !repImgsFromDB.includes(file));

      // DB에 저장되어 있는 파일 이름들과 일치하지 않는 파일이 있을 경우 서버 폴더에서 파일을 삭제
      filesToDelete.forEach((file) => {
        const filePath = path.join(uploadDirectory, file);
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`파일 삭제 실패: ${file}:`, unlinkErr);
          } else {
            console.log(`삭제된 파일: ${file}`);
          }
        });
      });
    });

    res.send('success');
  } catch (error) {
    res.status(500).send('An error occurred.');
  }
});


//공지사항게시판(noticeMain.vue)
function sortNCaseReplace(sortNCase) {
  let order = ` ORDER BY NOT_DATE DESC, NOT_NO DESC`; // 최근 순
  if (sortNCase == 1) { // 오래된 순
      order = ` ORDER BY NOT_DATE, NOT_NO DESC`;
  }
  if (sortNCase == 2) { // 조회수 높은 순
    order = ` ORDER BY NOT_COUNT DESC, NOT_NO DESC`;
  }
  if (sortNCase == 3) { // 조회수 낮은 순
    order = ` ORDER BY NOT_COUNT, NOT_NO DESC`;
  }
  return order;
}

async function getNoticeList(sortSCaseNum, sortNCaseNum, keyword) {
  let search = "";

  if (keyword != "none") {
    if (sortSCaseNum == 0) {
      search = ' WHERE NOT_TITLE Like "%'  + keyword + '%"';
    } else if (sortSCaseNum == 1) {
      search = ' WHERE NOT_CONTENT Like "%' + keyword + '%"';
    } else if (sortSCaseNum == 2) {
      search = ' WHERE ( NOT_TITLE  Like "%' + keyword + '%" OR NOT_CONTENT Like "%' + keyword + '%")';
    }
  }

  const narrange = sortNCaseReplace(sortNCaseNum);

  return new Promise((resolve, reject) => {
    const query = search !== "" ? sql.notice + search + narrange : sql.notice + narrange;
    //console.log(query);
    db.query(query, function (error, results, fields) {
      if (error) {
        console.error(error);
        reject(error);
      }
      resolve(results);
    });
  });
}

router.get('/notice_list/:sortSCase/:sortNCase/:keyword', async function (request, response, next) {
    const sortSCase = request.params.sortSCase;
    const sortNCase = request.params.sortNCase;
    const keyword = request.params.keyword;
    
    try {
      const results = await getNoticeList(sortSCase, sortNCase, keyword);
      response.json(results);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "목록에러" });
    }
});

router.get('/noticeDetail/:notice_No', (request, response) => {
  const noticeNo = request.params.notice_No;

  db.query(sql.noticedetail, [noticeNo], function (error, results) {
    if (error) {
      console.error(error);
      return response.status(500).json({ error: '내용로드에러' });
    } 
    response.json(results);
  });
});

router.post('/addNCount', (req, res) => {
  const notNo = req.body.not_no;

  db.query(sql.noticeCadd, [notNo], function (error, comments) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'error'});
    } else {
      return res.status(200).json({ message: 'complete'});
    }
  })
})

router.get('/main_notice_list', function (request, response, next) {

  db.query(sql.mainNotice, function(err, results, fields) {
    if (err) {
      console.error(err);
      return response.status(500).json({ error: '에러' });
    }
    response.json(results);
  })
})

router.post('/noticeWrite', function (request, response) {

  const notice = request.body;

    db.query(sql.notice_add, [notice.title, notice.content], function (error, data) {
      if (error) {
        return response.status(500).json({
          message: 'DB_error'
        })
      }
        return response.status(200).json({
          message: 'join_complete'
        });
    })
       
});

router.post('/noticeModify', function (request, response) {

  const notice = request.body;

    db.query(sql.notice_update, [notice.title, notice.content, notice.not_no], function (error, data) {
      if (error) {
        return response.status(500).json({
          message: 'DB_error'
        })
      }
        return response.status(200).json({
          message: 'join_complete'
        });
    })
       
});

//신고게시판(reportMain.vue)
async function getReportList(sortCCaseNum, sortSCaseNum, sortRCaseNum, keyword) {
  let search = "";

  if (keyword != "none") {
    if (sortSCaseNum == 0) {
      search = ' AND REP_TITLE Like "%'  + keyword + '%"';
    } else if (sortSCaseNum == 1) {
      search = ' AND REP_CONTENT Like "%' + keyword + '%"';
    } else if (sortSCaseNum == 2) {
      search = ' AND (REP_TITLE LIKE "%' + keyword + '%" OR REP_CONTENT LIKE "%' + keyword + '%")';
    } else if (sortSCaseNum == 3) {
      search = ' AND U.USER_NICK Like "%' + keyword + '%"';
    }
  }

  const narrange = sortRCaseReplace(sortRCaseNum);
  const carrange = sortCCaseReplace(sortCCaseNum);

  return new Promise((resolve, reject) => {
    const query = search !== "" ? sql.report + carrange + search + narrange : sql.report + carrange + narrange;
    //console.log(query);
    db.query(query, function (error, results, fields) {
      if (error) {
        console.error(error);
        reject(error);
      }
      resolve(results);
    });
  });
}

function sortCCaseReplace(sortCCase) {
  let cate = ` WHERE (REP_CATEGORY = 0 OR REP_CATEGORY = 1)`;
  if (sortCCase == 1) {
    cate = ` WHERE REP_CATEGORY = 0`;
  }
  if (sortCCase == 2) {
    cate = ` WHERE REP_CATEGORY = 1`;
  }
  return cate;
}

function sortRCaseReplace(sortRCase) {
  let order = ` ORDER BY REP_DATE DESC, REP_NO DESC`; // 최근 순
  if (sortRCase == 1) { // 오래된 순
      order = ` ORDER BY REP_DATE, REP_NO DESC`;
  }
  if (sortRCase == 2) { // 조회수 높은 순
    order = ` ORDER BY REP_COUNT DESC, REP_NO DESC`;
  }
  if (sortRCase == 3) { // 조회수 낮은 순
    order = ` ORDER BY REP_COUNT, REP_NO DESC`;
  }
  return order;
}

router.get('/report_list/:sortCCase/:sortSCase/:sortRCase/:keyword', async function (request, response, next) {
  
    const sortCCase = request.params.sortCCase;
    const sortSCase = request.params.sortSCase;
    const sortRCase = request.params.sortRCase;
    const keyword = request.params.keyword;
    
    try {
      const results = await getReportList(sortCCase, sortSCase, sortRCase, keyword);
      response.json(results);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "목록에러" });
    }
});

router.get('/reportdetail', (request, response) => {
  const repNo = request.query.rep_no;

  db.query(sql.reportdetail, [repNo], function (error, results) {
      if (error) {
          console.error(error);
          return response.status(500).json({ error: '내용로드에러' });
      }
      response.json(results);
  });
});

router.get('/reportImgs', (request, response) => {
  const repNo = request.query.rep_no;

  db.query(sql.reportimgs, [repNo], function (error, results) {
      if (error) {
          console.error(error);
          return response.status(500).json({ error: '내용로드에러' });
      }
      response.json(results);
  });
});

router.post('/addRCount', (req, res) => {
  const repNo = req.body.rep_no;

  db.query(sql.reportCadd, [repNo], function (error, comments) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'error'});
    } else {
      return res.status(200).json({ message: 'complete'});
    }
  })
});

router.post('/deleteReport', (req, res) => {
  const rep_no = req.body.rep_no;
  
    db.query(sql.deleteReport, [rep_no], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: '글 삭제에러' });
        } 
 
        db.query(sql.deleteRImgs, [rep_no], function (errorb, resultb) {
          if (errorb) {
            console.error(error);
            return res.status(500).json({ error: '글 댓글 삭제에러' });
          }

          return res.status(200).json({
            message: 'success'
          });

        })        
    });
  });

  router.get("/main_report_list", function (request, response, next) {

    db.query(sql.mainReport, function (err, results, fields) {
      if (err) {
        console.error(err);
        return response.status(500).json({ error: "에러" });
      }
      response.json(results);
    });
  });

  //신고내용 수정
const reportUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post('/reportModify/:rep_no', reportUpload.array('rep_img', 3), async (req, res) => {
  const rep_no = req.params.rep_no;
  const { rep_title, rep_content, rep_category } = req.body;
  const rep_imgs = req.files.map((file) => file.buffer);

  try {
    // 이미지를 제외한 다른 데이터를 먼저 저장
    await new Promise((resolve, reject) => {
      db.query(`UPDATE tb_report SET rep_title = ?, rep_content = ?, rep_category = ? WHERE rep_no = ?`, [rep_title, rep_content, rep_category, rep_no], (err, result) => {
        if (err) reject(err);
        console.log("1번 쿼리 통과중");
        resolve();
      });
    });

    // 이미지를 첨부했다면 이미지 교체 과정을 시작함
    if (rep_imgs.length > 0) {
      // 기존 이미지 전부 삭제
      await new Promise((resolve, reject) => {
        db.query(`DELETE FROM tb_report_img WHERE rep_no = ?`, [rep_no], (err2) => {
          if (err2) reject(err2);
          console.log("2번 쿼리 통과중");
          resolve();
        });
      });

      await Promise.all(rep_imgs.map(async (img, index) => {
        const randomSixDigitNumber = Math.floor(Math.random() * 900000) + 100000;
        const ext = req.files[index].originalname.split('.').pop(); // Get file extension
        const filename = `${rep_no}_${randomSixDigitNumber}_${index}.${ext}`;
        const filePath = path.join(__dirname, '..', 'uploads', 'uploadReport', filename);

        // 이미지 파일을 서버 폴더에 저장
        await new Promise((resolve, reject) => {
          fs.writeFile(filePath, img, (err3) => {
            if (err3) reject(err3);
            resolve();
          });
        });

        // 이미지 파일 이름을 DB에 저장
        await new Promise((resolve, reject) => {
          db.query(`INSERT INTO tb_report_img (rep_img, rep_no) VALUES (?, ?)`, [filename, rep_no], (err4) => {
            if (err4) reject(err4);
            console.log("3번 쿼리 통과중");
            resolve();
          });
        });
      }));
    }

    // 서버 폴더를 정리하기 위해 DB에 있는 모든 이미지 파일 이름을 불러옴
    const RepImgsFromDB = await new Promise((resolve, reject) => {
      db.query('SELECT rep_img FROM tb_report_img', (err5, rows) => {
        if (err5) reject(err5);
        console.log("4번 쿼리 통과중");
        resolve(rows.map((row) => row.rep_img));
      });
    });

    const uploadDirectory = path.join(__dirname, '../uploads/uploadReport');

    // 서버 폴더 내용 확인
    fs.readdir(uploadDirectory, (err, files) => {
      if (err) {
        console.error('경로 오류:', err);
        return;
      }

      // DB에 없는 파일만 삭제하기 위한 필터
      const filesToDelete = files.filter((file) => !RepImgsFromDB.includes(file));

      // DB에 저장되어 있는 파일 이름들과 일치하지 않는 파일이 있을 경우 서버 폴더에서 파일을 삭제
      filesToDelete.forEach((file) => {
        const filePath = path.join(uploadDirectory, file);
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`파일 삭제 실패: ${file}:`, unlinkErr);
          } else {
            console.log(`삭제된 파일: ${file}`);
          }
        });
      });
    });

    res.send('success');
  } catch (error) {
    res.status(500).send('An error occurred.');
  }
});

module.exports = router;