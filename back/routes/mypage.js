const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');
const fs = require('fs');
const path = require("path");
const multer = require('multer');
const bcrypt = require('bcrypt'); 

router.get('/getScore/:userNo', function (request, response, next) {
  const user_no = request.params.userNo;
  //console.log(user_no);

  db.query(sql.score_info, [user_no], function (error, results, fields) {
      if (error) {
          console.error(error);
          return response.status(500).json({ error: '정보에러' });
      }
      response.json(results);
  });
});

router.get('/scoreDetail/:user_no', function (request, response, next) {
  const user_no = request.params.user_no;

  db.query(sql.score_detail, [user_no], function (error, results, fields) {
      if (error) {
          console.error(error);
          return response.status(500).json({ error: '정보에러' });
      }
      response.json(results);
  });
});

router.get('/getUserData/:user_no', function (request, response, next) {
  const user_no = request.params.user_no;

  db.query(sql.user_info, [user_no], function (error, results, fields) {
      if (error) {
          console.error(error);
          return response.status(500).json({ error: '정보에러' });
      }
      response.json(results);
  });
});

router.post('/pass_process', function (request, response) {
  const pass = request.body;

  db.query(sql.get_password, [pass.user_no], function (error, results, fields) {
      if (results.length <= 0) {
          if (error) {
              return response.status(500).json({
                  message: 'DB_error'
              });
          }
      } else {
          const same = bcrypt.compareSync(pass.user_pw, results[0].user_pw);

          if (!same) {    // 비밀번호 체크
              return response.status(200).json({
                  message: 'pw_ck'
              });
          }
          const encryptedNewPW = bcrypt.hashSync(pass.user_npw, 10); // 새 비밀번호 암호화

          db.query(sql.pass_update, [encryptedNewPW, pass.user_no], function (error, results, fields) {
              if (error) {
                  return response.status(500).json({
                      message: 'DB_error'
                  });
              }

              return response.status(200).json({
                  message: 'pass_update'
              });
          });
      }
  });
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
      fileSize: 3 * 1024 * 1024,
  },
});

// mypage/petupdate.vue
router.post('/userUpdate', upload.single('user_img'), (req, res) => {
  const { user_id, user_nm, user_ph, user_mail, user_nick, zipcode, adr1, adr2, user_no } = req.body;
  const user_img = req.file ? req.file.buffer : null;
  db.query(sql.userinfo_update, [user_id, user_nm, user_ph, user_mail, user_nick, zipcode, adr1, adr2, user_no], (err, result) => {
      if (err) throw err;
      if(user_img) {
          const date = new Date().toJSON().slice(0, 10);
          const filename = `${date}_${user_no}.${req.file.originalname.split('.').pop()}`;
          fs.writeFile(`${__dirname}` + `../../uploads/uploadUser/${filename}`, user_img, (err2) => {
              if (err2) throw err2;
              db.query(sql.user_add_image, [filename, user_no], (err3) => {
                  if (err3) throw err3;
                  res.send('success');
                  db.query(sql.user_img_check, (err4, rows) => {
                      if (err4) throw err4;
                      const userImgs = rows.map((row) => row.user_img);
                      fs.readdir(`${__dirname}` + `../../uploads/uploadUser/`, (err5, files) => {
                          if (err5) throw err5;
                          files.forEach((file) => {
                              if (!userImgs.includes(file)) {
                                  fs.unlink(path.join(`${__dirname}` + `../../uploads/uploadUser/`, file), (err6) => {
                                      if (err6) throw err6;
                                      console.log(`삭제된 파일: ${file}`);
                                  });
                              }
                          });
                      });
                  });
              });
          });
      } else {
          res.send('success');
      }
  }, (error) => {
      console.log(error);
      res.send('error');
  });
});

async function getMBoardList(sortSCaseNum, sortMCaseNum, keyword, userNo) {
    let search = "";
  
    if (keyword != "none") {
      if (sortSCaseNum == 0) {
        search = ' AND BOD_TITLE Like "%'  + keyword + '%"';
      } else if (sortSCaseNum == 1) {
        search = ' AND BOD_CONTENT Like "%' + keyword + '%"';
      } else if (sortSCaseNum == 2) {
        search = ' AND (BOD_TITLE LIKE "%' + keyword + '%" OR BOD_CONTENT LIKE "%' + keyword + '%")';
      } 
    }
  
    const narrange = sortMMCaseReplace(sortMCaseNum);
  
    return new Promise((resolve, reject) => {
      const query = search !== "" ? sql.myBoard  + search + narrange : sql.myBoard +  narrange;
      //console.log(query);
      db.query(query, [userNo], function (error, results, fields) {
        if (error) {
          console.error(error);
          reject(error);
        }
        resolve(results);
      });
    });
  }
  
  
  function sortMMCaseReplace(sortLCase) {
    let order = ` ORDER BY BOD_DATE DESC, BOD_NO DESC`; // 최근 순
    if (sortLCase == 1) { // 오래된 순
        order = ` ORDER BY BOD_DATE, BOD_NO DESC`;
    }
    if (sortLCase == 2) { // 조회수 높은 순
      order = ` ORDER BY BOD_COUNT DESC, BOD_NO DESC`;
    }
    if (sortLCase == 3) { // 조회수 낮은 순
      order = ` ORDER BY BOD_COUNT, BOD_NO DESC`;
    }
    return order;
  }

  async function getMAnonList(sortSCaseNum, sortACaseNum, keyword, userNo) {
    let search = "";
  
    if (keyword != "none") {
      if (sortSCaseNum == 0) {
        search = ' AND ANO_TITLE Like "%'  + keyword + '%"';
      } else if (sortSCaseNum == 1) {
        search = ' AND ANO_CONTENT Like "%' + keyword + '%"';
      } else if (sortSCaseNum == 2) {
        search = ' AND ANO_TITLE OR ANO_CONTENT Like "%' + keyword + '%"';
      } 
    }
  
    const narrange = sortMACaseReplace(sortACaseNum);
  
    return new Promise((resolve, reject) => {
      const query = search !== "" ? sql.myAnon + search + narrange : sql.myAnon + narrange;
      //console.log(query);
      db.query(query, [userNo], function (error, results, fields) {
        if (error) {
          console.error(error);
          reject(error);
        }
        resolve(results);
      });
    });
  }
  
  function sortMACaseReplace(sortACase) {
    let order = ` ORDER BY ANO_DATE DESC, ANO_NO DESC`; // 최근 순
    if (sortACase == 1) { // 오래된 순
      order = ` ORDER BY ANO_DATE, ANO_NO DESC`;
    }
    if (sortACase == 2) { // 조회수 높은 순
      order = ` ORDER BY ANO_COUNT DESC, ANO_NO DESC`;
    }
    if (sortACase == 3) { // 조회수 낮은 순
        order = ` ORDER BY ANO_COUNT, ANO_NO DESC`;
    }
    return order;
  }

  async function getMReportList(sortSCaseNum, sortRCaseNum, keyword, userNo) {
    let search = "";
  
    if (keyword != "none") {
      if (sortSCaseNum == 0) {
        search = ' AND REP_TITLE Like "%'  + keyword + '%"';
      } else if (sortSCaseNum == 1) {
        search = ' AND REP_CONTENT Like "%' + keyword + '%"';
      } else if (sortSCaseNum == 2) {
        search = ' AND (REP_TITLE LIKE "%' + keyword + '%" OR REP_CONTENT LIKE "%' + keyword + '%")';
      } 
    }
  
    const narrange = sortMRCaseReplace(sortRCaseNum);
    //const carrange = sortCCaseReplace(sortCCaseNum);
  
    return new Promise((resolve, reject) => {
      const query = search !== "" ? sql.myReport + search + narrange : sql.myReport + narrange;
      //console.log(query);
      db.query(query, [userNo], function (error, results, fields) {
        if (error) {
          console.error(error);
          reject(error);
        }
        resolve(results);
      });
    });
  }
  
  
  function sortMRCaseReplace(sortRCase) {
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

  async function getMLostList(sortSCaseNum, sortLCaseNum, keyword, userNo) {
    let search = "";
  
    if (keyword != "none") {
      if (sortSCaseNum == 0) {
        search = ' AND LOST_TITLE Like "%'  + keyword + '%"';
      } else if (sortSCaseNum == 1) {
        search = ' AND LOST_CONTENT Like "%' + keyword + '%"';
      } else if (sortSCaseNum == 2) {
        search = ' AND (LOST_TITLE LIKE "%' + keyword + '%" OR LOST_CONTENT LIKE "%' + keyword + '%")';
      } 
    }
  
    const narrange = sortMLCaseReplace(sortLCaseNum);
  
    return new Promise((resolve, reject) => {
      const query = search !== "" ? sql.myLost + search + narrange : sql.myLost + narrange;
      //console.log(query);
      db.query(query, [userNo], function (error, results, fields) {
        if (error) {
          console.error(error);
          reject(error);
        }
        resolve(results);
      });
    });
  }
  
  function sortMLCaseReplace(sortLCase) {
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
  
  router.post('/my_board_list', async function (request, response, next) {
    
      const sortTCaseNum = request.body.sortTCaseNum;
      const sortSCase = request.body.sortSCaseNum;
      const sortMCase = request.body.sortMCaseNum;
      const keyword = request.body.keyword;
      const userNo = request.body.userNo;
      
      try {
        
          const result1 = await getMBoardList(sortSCase, sortMCase, keyword, userNo);
          const result2 = await getMAnonList(sortSCase, sortMCase, keyword, userNo);
          const result3 = await getMReportList(sortSCase, sortMCase, keyword, userNo);
          const result4 = await getMLostList(sortSCase, sortMCase, keyword, userNo);
            
            if ( sortTCaseNum == 0 ) response.json({result1, result2, result3, result4})
            if ( sortTCaseNum == 1 ) response.json(result1)
            if ( sortTCaseNum == 2 ) response.json(result2)
            if ( sortTCaseNum == 3 ) response.json(result3)
            if ( sortTCaseNum == 4 ) response.json(result4)
        
      } catch (error) {
        console.error(error);
        return response.status(500).json({ error: "목록에러" });
      }
  });

  router.get("/my_res_list/:userNo", function (request, response, next) {

    const userNo = request.params.userNo;

    db.query(sql.myRes_info, [userNo], function (err, results, fields) {
      if (err) {
        console.error(err);
        return response.status(500).json({ error: "에러" });
      }
      response.json(results);
    });
  });

  async function getMyResList(sortCCaseNum, sortRLCaseNum, keyword, userNo) {
    let search = "";
  
    if (keyword != "none") {
      search = ' AND RES_STR_ROOM Like "%'  + keyword + '%"';
    }
  
    const narrange = sortRLCaseReplace(sortRLCaseNum);
    const carrange = sortRCCaseReplace(sortCCaseNum);
  
    return new Promise((resolve, reject) => {
      const query = search !== "" ? sql.myRes_info + search + carrange + narrange : sql.myRes_info + carrange + narrange;
      //console.log(query);
      db.query(query, [userNo], function (error, results, fields) {
        if (error) {
          console.error(error);
          reject(error);
        }
        resolve(results);
      });
    });
  }

  function sortRCCaseReplace(sortCCase) {
    let cate = ``;
    if (sortCCase == 1) {
      cate = ` AND CONCAT(RES_DATE, ' ', RES_TIME) >= NOW() `;
    } 
    if (sortCCase == 2) {
      cate = ` AND CONCAT(RES_DATE, ' ', RES_TIME) < NOW() `
    }
    
    return cate;
  }
  
  function sortRLCaseReplace(sortRLCase) {
    let order = ` ORDER BY CONCAT(RES_DATE, ' ', RES_TIME) DESC`; // 최근 순
    if (sortRLCase == 1) { // 오래된 순
      order = ` ORDER BY CONCAT(RES_DATE, ' ', RES_TIME)`;
    }
    return order;
  }
  
  router.get('/res_list/:sortCCase/:sortRLCase/:keyword/:user_no', async function (request, response, next) {
    
      const sortCCase = request.params.sortCCase;
      const sortRLCase = request.params.sortRLCase;
      const keyword = request.params.keyword;
      const user_no = request.params.user_no;
      
      try {
        const results = await getMyResList(sortCCase, sortRLCase, keyword, user_no);
        response.json(results);
      } catch (error) {
        console.error(error);
        return response.status(500).json({ error: "목록에러" });
      }
  });

  router.post('/deleteRes', (req, res) => {
    const res_no = req.body.res_no;
    
      db.query(sql.deleteRes, [res_no], function (error, result) {
          if (error) {
              console.error(error);
              return res.status(500).json({ error: '글 삭제에러' });
          } 
          
          return res.status(200).json({ message: 'success' });
  
          
      });
    });

module.exports = router;