const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');
const async = require('async');

//reservation.vue
router.get('/roomlist/:floorNum', function (request, response, next) {
    const floorNum = request.params.floorNum;

    db.query(sql.roomList, [floorNum], function ( error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '방리스트에러'});
        }
        response.json(results);
    })
});

router.get('/timelist', function (request, response, next) {

    db.query(sql.timeList, function (error, results, fields) {
        if(error) {
            console.error(error);
            return response.status(500).json({ error: '시간리스트에러'});
        }
        response.json(results);
    })
})

router.post('/getSeat/:roomName', function(request, response, next) {
    const roomName = request.params.roomName;

    db.query(sql.seatList, [roomName], function( error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '좌석리스트에러'});
        }
        response.json(results);
    })
})

router.post('/getReserved', function(request, response, next) {
    const resInfo = request.body;
    //console.log(resInfo);
    db.query(sql.resSeat, [resInfo.room_name, resInfo.res_date, resInfo.res_time], function( error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '예약좌석리스트에러'});
        }
        response.json(results);
    })
})

router.post('/makeReservation', function(request, response, next) {
    const res = request.body;
    console.log(res.user_no);
    async.each(res.seat_ids, function(seat_id, callback) {
        // 각 seat_id에 대한 db.query 실행
        db.query(sql.mkRes, [res.room_name, res.res_date, res.res_time, seat_id, res.user_no], function(error, results, fields) {
            if (error) {
                console.error(error);
                // 각각의 query에서 에러 발생 시 콜백으로 에러 전달
                return callback(error);
            }
            // 각각의 query가 성공적으로 실행되면 다음으로 진행
            callback(null);
        });
    }, function(err) {
        if (err) {
            // 반복 중 에러가 발생한 경우 최종적으로 에러 응답
            return response.status(500).json({ error: '예약에러' });
        }
        // 모든 query가 성공적으로 실행되면 성공 응답
        response.json({
            message: 'success'
        });
    });
})

// // views/calendar.vue
// router.post('/reservation_create', function (request, response, next) {
//     const res = request.body;

//     try {

//         db.query(sql.res_check, [res.doc_id, res.res_sdd, res.res_stm], function (error, results, fields) {
//             if (results.length <= 0) {

//             db.query(sql.reservation_create, [res.res_nm, res.res_sdd, res.res_stm, res.doc_id, res.res_cont, res.res_petno], function (error, results, fields) {
//                 if (error) {
//                     console.log(error);
//                     return response.status(500).json({ error: 'error' });
//                 }
//                     return response.status(200).json({
//                     message: 'success'
//                 });
//             });
//             } else {
//                 return response.status(200).json({
//                     message: 'already_exist_reservation'
//                 })
//             }
//         }); 
//     } catch {
//         return response.status(200).json({
//             message: 'DB_error'
//         })
//     }    
// });

// // views/calendar.vue
// router.get('/reservation_list/:doc_nm', function (request, response, next) {
//     const doc_nm = request.params.doc_nm;

//     db.query(sql.reservation_list, [doc_nm], function (error, results, fields) {
//         if (error) {
//             console.error(error);
//             return response.status(500).json({ error: 'error' });
//         }
//         response.json(results);
//     });
// });

// // docpage/myReservationContent.vue
// router.get('/reservationdetail/:res_no', function (request, response, next) {
//     const reservationNo = request.params.res_no;

//     db.query(sql.reservationdetail, [reservationNo], function (error, results) {
//         if (error) {
//             console.error(error);
//             return response.status(500).json({ error: '내용로드에러' });
//         }
//         response.json(results);
//     });
// });


// async function getReservationList(sortCaseNum, setSearchNum, keyword) {
//     let search = '';

//     if (keyword != 'none') {
//         if (setSearchNum == 0) {
//             search = ` WHERE USER_NM Like "%${keyword}%"`;
//         } else if (setSearchNum == 1) {
//             search = ` WHERE DOC_NM Like "%${keyword}%"`;
//         }
//     }

//     const arrange = sortCaseReplace(sortCaseNum);

//     return new Promise((resolve, reject) => {
//         db.query(sql.admin_reservationlist + search + arrange, function (error, results, fields) {
//             if (error) {
//                 console.error(error);
//                 reject(error);
//             }
//             resolve(results);
//         });
//     });
// }

// function sortCaseReplace(sortCase) {
//     let order = ` ORDER BY res_no DESC`; // 최근 예약번호 순
//     if (sortCase == 1) { // 오래된 예약번호 순
//         order = ` ORDER BY res_no`;
//     }
//     if (sortCase == 2) { // 최근 예약일 순
//         order = ` ORDER BY res_date DESC, res_time, res_no DESC`;
//     }
//     if (sortCase == 3) { // 오래된 예약일 순
//         order = ` ORDER BY res_date, res_time DESC, res_no DESC`;
//     }
//     return order;
// }

// // admin/reservation.vue
// router.get('/admin/reservationlist/:setSearchNum/:sortCase/:keyword', async function (request, response, next) {

//     const sortCase = request.params.sortCase;
//     const setSearchNum = request.params.setSearchNum;
//     const keyword = request.params.keyword;

//     try {
//         const results = await getReservationList(sortCase, setSearchNum, keyword);
//         response.json(results);
//     } catch (error) {
//         console.error(error);
//         return response.status(500).json({ error: '목록에러' });
//     }
// });

// // admin/reservation.vue
// router.delete('/admin/reservationlist/:res_no', function (request, response, next) {
//     const reservationNo = request.params.res_no;

//     db.query(sql.deleteReservation, [reservationNo], function (error, result, fields) {
//         if (error) {
//             console.error(error);
//             return response.status(500).json({ error: '목록삭제에러' });
//         }
//         return response.status(200).json({ message: '목록삭제성공' });
//     });
//});



module.exports = router;