const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js'); 

async function getAnonList(sortSCaseNum, sortACaseNum, keyword) {
  let search = "";

  if (keyword != "none") {
    if (sortSCaseNum == 0) {
      search = ' WHERE ANO_TITLE Like "%'  + keyword + '%"';
    } else if (sortSCaseNum == 1) {
      search = ' WHERE ANO_CONTENT Like "%' + keyword + '%"';
    } else if (sortSCaseNum == 2) {
      search = ' WHERE ANO_TITLE OR ANO_CONTENT Like "%' + keyword + '%"';
    } 
  }

  const narrange = sortACaseReplace(sortACaseNum);
  // const sarrange = sortSCaseReplace(sortSCaseNum);

  return new Promise((resolve, reject) => {
    const query = search !== "" ? sql.anon + search + narrange : sql.anon + narrange;
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

function sortACaseReplace(sortACase) {
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

router.get('/anon_list/:sortSCase/:sortACase/:keyword', async function (request, response, next) {
  
    const sortSCase = request.params.sortSCase;
    const sortACase = request.params.sortACase;
    const keyword = request.params.keyword;
    
    try {
      const results = await getAnonList(sortSCase, sortACase, keyword);
      response.json(results);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "목록에러" });
    }
});


router.get('/anonDetail/:anon_No/:user_no', (request, response) => {
  const anonNo = request.params.anon_No;
  //console.log(anonNo);
  const userNo = request.params.user_no

  db.query(sql.anondetail, [anonNo, userNo, anonNo], function (error, results) {
    if (error) {
      console.error(error);
      return response.status(500).json({ error: '내용로드에러' });
    } 
    response.json(results);
  });
});

router.post('/anonmodify', function (request, response, next)  {
  const anon = request.body;

 db.query(sql.anon_update, [anon.ano_title, anon.ano_content, anon.ano_no], function (error, result, fields) { 
   if (error) {
     console.error(error);
     return response.status(500).json({ error: 'error' });
   }
   return response.status(200).json({ message: 'success' });
 });
});

router.post('/addACount', (req, res) => {
  const anoNo = req.body.ano_no;

  db.query(sql.anonCadd, [anoNo], function (error, comments) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'error'});
    } else {
      return res.status(200).json({ message: 'complete'});
    }
  })
})

router.post('/updateLikeA/:anoNo/:userNo', (req, res) => {
  const anoNo = req.params.anoNo;
  const userNo = req.params.userNo;

  db.query(sql.updateLikeOne, [anoNo, userNo], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(200).json({ message: 'error1' });
    } 
    db.query(sql.like_add, [anoNo], function (error, result) {
      if (error) {
        console.error(error);
        return res.status(200).json({ message: 'error2' });
      }
    })
    return res.status(200).json({ message: 'success'});
  })
})

router.post('/updateLikeB/:anoNo/:userNo', (req, res) => {
  const anoNo = req.params.anoNo;
  const userNo = req.params.userNo;

  db.query(sql.updateLikeZero, [anoNo, userNo], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(200).json({ message: 'error1' });
    } 
    db.query(sql.like_minus, [anoNo], function (error, result) {
      if (error) {
        console.error(error);
        return res.status(200).json({ message: 'error2' });
      }
    })
    return res.status(200).json({ message: 'success'});
  })
})

router.post('/addCommentA/:ANO_NO/:user_no', (req, res) => {
  const anonNo = req.params.ANO_NO;
  const user_no = req.params.user_no;
  const commentContent = req.body.commentContent; // 댓글 내용을 요청에서 가져옴

  // 댓글 생성 SQL 쿼리 실행
  db.query(sql.createCommentA, [user_no, anonNo, commentContent], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(200).json({ message: 'error' });
    } else {
      //console.log('새로운 댓글이 성공적으로 생성되었습니다.');
      // 댓글이 생성되면 댓글 목록을 다시 불러옵니다.
      db.query(sql.getcommentA, [anonNo], function (error, comments) {
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
router.get('/loadCommentA/:ANO_NO', (req, res) => {
  const anon_no = req.params.ANO_NO;

  db.query(sql.getcommentA, [anon_no], function (error, comments) {
      if (error) {
          console.error(error);
          return res.status(500).json({ error: '댓글을 불러오는 중 오류가 발생했습니다.' });
      } else {
          res.json(comments);
      }
  });
});

router.post('/deleteAnon', (req, res) => {
  const ano_no = req.body.ano_no;
  
    db.query(sql.deleteAnon, [ano_no], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: '글 삭제에러' });
        } 
        
        db.query(sql.deleteAComment, [ano_no], function (errorb, resultb) {
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

  router.post('/anonWrite', function (request, response) {

    const anons = request.body;
  
      db.query(sql.anon_add, [anons.title, anons.content, anons.user_no], 
        function (error, results, fields) {
          if (error) {
            return response.status(500).json({
              message: 'DB_error'
            })
          }
          
            const anoNo = results.insertId;
            
          db.query(sql.like_anon_add, [anoNo, anons.user_no], function (likeError, likeData) {
              if (likeError) {
                return response.status(500).json({
                  message: 'DB_error'
                })
              }
  
              return response.status(200).json({
                message: 'join_complete'
              });
  
          })
          
      })
         
  });


module.exports = router;