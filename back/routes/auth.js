const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');
const bcrypt = require('bcrypt');  

router.post('/join_process', function (request, response) {

  const user = request.body;
  console.log(user);
  const encryptedPW = bcrypt.hashSync(user.user_pw, 10);

  db.query(sql.id_check, [user.user_id], function (error, results, fields) {
      if (results.length <= 0) {
          db.query(sql.join, [user.user_id, encryptedPW, user.user_nm, user.user_nick, user.user_ph, user.user_hno, user.user_email, user.user_sex, user.zonecode, user.roadAddress, user.detailAddress], function (error, data) {
              if (error) {
                  return response.status(500).json({
                      message: 'DB_error'
                  })
              }

              const user_no = data.insertId;
              db.query(sql.mkScore, [user_no], function (error, results, fields) {
                if (error) {
                    return response.status(500).json({ error: 'DB_error' });
                }
                    return response.status(200).json({
                        message: 'success'
                    });
                
            });
          })
      }
      else {
          return response.status(200).json({
              message: 'already_exist_id'
          })
      }
  })
});

// views/join.vue
router.post('/idcheck', function (request, response) {
  const user = request.body;

  db.query(sql.checkDuplicate, [user.user_id], function (error, results) {
      if (error) {
          return response.status(500).json({
              message: 'DB_error'
          })
      }
      if (results.length > 0) {
          response.send('중복');
      } else {
          response.send('확인');
      }
  })
});

router.post('/nickcheck', function (request, response) {
    const user = request.body;
  
    db.query(sql.nickDuplicate, [user.user_nick], function (error, results) {
        if (error) {
            return response.status(500).json({
                message: 'DB_error'
            })
        }
        if (results.length > 0) {
            response.send('중복');
        } else {
            response.send('확인');
        }
    })
  });

  router.post("/admin_check", function (request, response) {
    const loginUser = request.body;
  
    db.query(
      sql.admin_check,
      [loginUser.user_no],
      function (error, results, fields) {
        if (results[0].user_tp == 1) {
          // 로그인한 유저의 TP가 1(관리자)인 경우
          return response.status(200).json({
            message: "admin",
          });
        } else {
          return response.status(200).json({
            message: "user",
          });
        }
      }
    );
  });  

router.post('/login_process', function (request, response) {
    const loginUser = request.body;

    db.query(sql.id_check, [loginUser.user_id], function (error, results, fields) {
        if (results.length <= 0) {
            return response.status(200).json({
                message: 'undefined_id'
            })
        }
        else {
            db.query(sql.login, [loginUser.user_id], function (error, results, fields) {
                const same = bcrypt.compareSync(loginUser.user_pw, results[0].user_pw);

                if (same) {
                    // ID에 저장된 pw 값과 입력한 pw값이 동일한 경우
                    db.query(sql.get_user_no, [loginUser.user_id], function (error, results, fields) {
                        return response.status(200).json({
                            message: results[0].user_no
                        })
                    })
                }
                else {
                     // 비밀번호 불일치
                     return response.status(200).json({
                         message: 'incorrect_pw'
                     })
                }
            })
        }
    })
});

// views/find.vue
router.post('/findId', function (request, response, next) {
    const user_ph = request.body.user_ph;

    db.query(sql.id_find, [user_ph], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '회원 에러' });
        }

        if (results.length === 0) {
            // 휴대전화번호가 데이터베이스에 존재하지 않는 경우
            return response.status(404).json({ message: 'user_not_found' });
        }

        const user_id = results[0].user_id; // 사용자 아이디를 가져옴
        return response.status(200).json({
            message: 'user_ph',
            user_id: user_id
        });
    });
});

// 임시 비밀번호
function generateTempPassword() {
    const length = 3; // 임시 비밀번호의 길이
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const integers = '0123456789';
    const spcharacters = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];
    let tempPass= [];
    let tempPassword = '';

    for (let i = 0; i < length; i++) {
        const randomIndex1 = Math.floor(Math.random() * characters.length);
        const randomIndex2 = Math.floor(Math.random() * integers.length);
        const randomIndex3 = Math.floor(Math.random() * spcharacters.length);
        tempPass[i] = characters[randomIndex1] + integers[randomIndex2] + spcharacters[randomIndex3];
        tempPassword += tempPass[i];
    }

    return tempPassword;
}

// views/find.vue
router.post('/findPw', function (request, response, next) {
    const user_id = request.body.user_id;
    const user_ph = request.body.user_ph;

    db.query(sql.user_check, [user_ph, user_id], async function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '회원 에러' });
        }

        if (results.length == 0) {
            // 휴대전화번호가 데이터베이스에 존재하지 않는 경우
            return response.status(404).json({ message: 'user_not_found' });
        }

        const user_pw = generateTempPassword(); // 임시 비밀번호 생성

        const encryptedPW = bcrypt.hashSync(user_pw, 10); // 임시 비밀번호 암호화

        // 업데이트
        db.query(sql.pass_update_tem, [encryptedPW, user_id], function (error, results, fields) {
            if (error) {
                console.error(error);
                return response.status(500).json({ error: '비번 에러' });
            }
            return response.status(200).json({
                message: user_pw
            });
        });

    });
});

module.exports = router;