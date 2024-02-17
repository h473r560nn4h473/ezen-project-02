const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');


router.get('/foods_info/:selectedDate', function (request, response, next) {
    const selDate = request.params.selectedDate;
    //console.log(selDate);

    db.query(sql.foods_list, [selDate], function (error, results, fields) {
      if (error) {
        console.error(error);
        return response.status(500).json({ error: 'error' });
      }

      if (results.length === 0) {
        // 만약 results가 비어있으면 다른 값을 응답으로 보냅니다.
        return response.json({ message: 'No results found.' });
      }
      
        response.json(results);
    })
});

router.get('/all_list', function ( request, response, next) {

  db.query(sql.all_foods, function (error, results, fields) {
    if(error) {
      console.error(error);
      return response.status(500).json({ error: 'error' });
    }
      response.json(results);
  })
})

module.exports = router;