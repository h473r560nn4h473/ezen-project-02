const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js'); 
const fs = require('fs');
const multer = require('multer');
const path = require("path");

async function getLostList(sortCCaseNum, sortSCaseNum, sortLCaseNum, keyword) {
    let search = "";
  
    if (keyword != "none") {
      if (sortSCaseNum == 0) {
        search = ' AND LOST_TITLE Like "%'  + keyword + '%"';
      } else if (sortSCaseNum == 1) {
        search = ' AND LOST_CONTENT Like "%' + keyword + '%"';
      } else if (sortSCaseNum == 2) {
        search = ' AND (LOST_TITLE LIKE "%' + keyword + '%" OR LOST_CONTENT LIKE "%' + keyword + '%")';
      } else if (sortSCaseNum == 3) {
        search = ' AND U.USER_NICK Like "%' + keyword + '%"';
      }
    }
  
    const narrange = sortLCaseReplace(sortLCaseNum);
    const carrange = sortCLCaseReplace(sortCCaseNum);
  
    return new Promise((resolve, reject) => {
      const query = search !== "" ? sql.lost + carrange + search + narrange : sql.lost + carrange + narrange;
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
  
  function sortCLCaseReplace(sortCCase) {
    let cate = ` WHERE (LOST_CATEGORY = 0 OR LOST_CATEGORY = 1)`;
    if (sortCCase == 1) {
      cate = ` WHERE LOST_CATEGORY = 0`;
    }
    if (sortCCase == 2) {
      cate = ` WHERE LOST_CATEGORY = 1`;
    }
    return cate;
  }
  
  function sortLCaseReplace(sortLCase) {
    let order = ` ORDER BY LOST_DATE DESC, LOST_NO DESC`; // 최근 순
    if (sortLCase == 1) { // 오래된 순
        order = ` ORDER BY LOST_DATE, LOST_NO DESC`;
    }
    if (sortLCase == 2) { // 조회수 높은 순
      order = ` ORDER BY LOST_COUNT DESC, LOST_NO DESC`;
    }
    if (sortLCase == 3) { // 조회수 낮은 순
      order = ` ORDER BY LOST_COUNT, LOST_NO DESC`;
    }
    return order;
  }
  
  router.get('/lost_list/:sortCCase/:sortSCase/:sortLCase/:keyword', async function (request, response, next) {
    
      const sortCCase = request.params.sortCCase;
      const sortSCase = request.params.sortSCase;
      const sortLCase = request.params.sortLCase;
      const keyword = request.params.keyword;
      
      try {
        const results = await getLostList(sortCCase, sortSCase, sortLCase, keyword);
        response.json(results);
      } catch (error) {
        console.error(error);
        return response.status(500).json({ error: "목록에러" });
      }
  });

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
  
  router.post('/lostWrite', upload.array('lost_img', 3), async (req, res) => {
    const { title, content, category, user_no } = req.body;
    const lost_imgs = req.files.map((file) => file.buffer);
  
    try {
      // 이미지를 제외한 다른 데이터를 먼저 저장
      const insertQuery = `INSERT INTO TB_LOST (LOST_TITLE, LOST_CONTENT, LOST_CATEGORY, USER_NO) VALUES (?,?,?,?)`;
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
      if (lost_imgs.length > 0) {
        const lost_no = result.insertId;
        await Promise.all(lost_imgs.map(async (img, index) => {
          const randomSixDigitNumber = Math.floor(Math.random() * 900000) + 100000;
          const ext = req.files[index].originalname.split('.').pop();
          const filename = `${lost_no}_${user_no}_${randomSixDigitNumber}_${index}.${ext}`;
          const filePath = path.join(__dirname, '..', 'uploads', 'uploadLost', filename);
  
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
            db.query(`INSERT INTO tb_lost_img (lost_img, lost_no) VALUES (?, ?)`, [filename, lost_no], (err4) => {
              if (err4) reject(err4);
              console.log("3번 쿼리 통과중");
              resolve();
            });
          });
        }));
      }
  
      // 서버 폴더를 정리하기 위해 DB에 있는 모든 이미지 파일 이름을 불러옴
      const LostImgsFromDB = await new Promise((resolve, reject) => {
        db.query('SELECT lost_img FROM tb_lost_img', (err5, rows) => {
          if (err5) reject(err5);
          console.log("4번 쿼리 통과중");
          resolve(rows.map((row) => row.lost_img));
        });
      });
  
      const uploadDirectory = path.join(__dirname, '../uploads/uploadLost');
  
      // 서버 폴더 내용 확인
      fs.readdir(uploadDirectory, (err, files) => {
        if (err) {
          console.error('경로 오류:', err);
          return;
        }
  
        // DB에 없는 파일만 삭제하기 위한 필터
        const filesToDelete = files.filter((file) => !LostImgsFromDB.includes(file));
  
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

const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post('/lostModify/:lost_no', memoryUpload.array('lost_img', 3), async (req, res) => {
  const lost_no = req.params.lost_no;
  const { lost_title, lost_content } = req.body;
  const lost_imgs = req.files.map((file) => file.buffer);

  try {
    // 이미지를 제외한 다른 데이터를 먼저 저장
    await new Promise((resolve, reject) => {
      db.query(`UPDATE tb_lost SET lost_title = ?, lost_content = ? WHERE lost_no = ?`, [lost_title, lost_content, lost_no], (err, result) => {
        if (err) reject(err);
        console.log("1번 쿼리 통과중");
        resolve();
      });
    });

    // 이미지를 첨부했다면 이미지 교체 과정을 시작함
    if (lost_imgs.length > 0) {
      // 기존 이미지 전부 삭제
      await new Promise((resolve, reject) => {
        db.query(`DELETE FROM tb_lost_img WHERE lost_no = ?`, [lost_no], (err2) => {
          if (err2) reject(err2);
          console.log("2번 쿼리 통과중");
          resolve();
        });
      });

      await Promise.all(lost_imgs.map(async (img, index) => {
        const randomSixDigitNumber = Math.floor(Math.random() * 900000) + 100000;
        const ext = req.files[index].originalname.split('.').pop(); // Get file extension
        const filename = `${lost_no}_${randomSixDigitNumber}_${index}.${ext}`;
        const filePath = path.join(__dirname, '..', 'uploads', 'uploadLost', filename);

        // 이미지 파일을 서버 폴더에 저장
        await new Promise((resolve, reject) => {
          fs.writeFile(filePath, img, (err3) => {
            if (err3) reject(err3);
            resolve();
          });
        });

        // 이미지 파일 이름을 DB에 저장
        await new Promise((resolve, reject) => {
          db.query(`INSERT INTO tb_lost_img (lost_img, lost_no) VALUES (?, ?)`, [filename, lost_no], (err4) => {
            if (err4) reject(err4);
            console.log("3번 쿼리 통과중");
            resolve();
          });
        });
      }));
    }

    // 서버 폴더를 정리하기 위해 DB에 있는 모든 이미지 파일 이름을 불러옴
    const LostImgsFromDB = await new Promise((resolve, reject) => {
      db.query('SELECT lost_img FROM tb_lost_img', (err5, rows) => {
        if (err5) reject(err5);
        console.log("4번 쿼리 통과중");
        resolve(rows.map((row) => row.lost_img));
      });
    });

    const uploadDirectory = path.join(__dirname, '../uploads/uploadLost');

    // 서버 폴더 내용 확인
    fs.readdir(uploadDirectory, (err, files) => {
      if (err) {
        console.error('경로 오류:', err);
        return;
      }

      // DB에 없는 파일만 삭제하기 위한 필터
      const filesToDelete = files.filter((file) => !LostImgsFromDB.includes(file));

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

router.get('/lostdetail', (request, response) => {
    const lostNo = request.query.lost_no;
  
    db.query(sql.lostdetail, [lostNo], function (error, results) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '내용로드에러' });
        }
        response.json(results);
    });
  });
  
  router.get('/lostImgs', (request, response) => {
    const lostNo = request.query.lost_no;
  
    db.query(sql.lostimgs, [lostNo], function (error, results) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '내용로드에러' });
        }
        response.json(results);
    });
  });

router.post('/addLCount', (req, res) => {
    const lostNo = req.body.lost_no;
  
    db.query(sql.lostCadd, [lostNo], function (error, comments) {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'error'});
      } else {
        return res.status(200).json({ message: 'complete'});
      }
    })
});

router.post('/deleteLost', (req, res) => {
    const lost_no = req.body.lost_no;
    
      db.query(sql.deleteLost, [lost_no], function (error, result) {
          if (error) {
              console.error(error);
              return res.status(500).json({ error: '글 삭제에러' });
          } 
   
          db.query(sql.deleteLImgs, [lost_no], function (errorb, resultb) {
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

router.post('/updateLost/:lostNo', (req, res) => {
  const lostNo = req.params.lostNo;

  db.query(sql.updateLost, [lostNo], function ( error, result) {
    if (error) {
      console.error(error);
      return res.status(200).json({ message: 'error' });
    } 

    return res.status(200).json({ message: 'success'});
  })
});

router.get('/main_lost_list', function (request, response, next) {

  db.query(sql.mainLost, function (err, results, fields) {
    if (err) {
      console.error(err);
      return response.status(500).json({ error: '에러' });
    }
    response.json(results);
  }); 
});




module.exports = router;