const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');

router.get('/chart/getChartData', function (request, response, next) {
  
  db.query(sql.getGender, function (err, results, fields) {
      if (err) {
        console.error(err);
        return response.status(500).json({ error: '에러' });
      }
      response.json(results);
  }); 
});

router.get('/chart/getResData', function (request, response, next) {
  
  db.query(sql.getResRoom, function (err, results, fields) {
       if (err) {
         console.error(err);
         return response.status(500).json({ error: '에러' });
       }
       response.json(results);
  }); 
});

router.get('/chart/getGradeData', function (request, response, next) {
  
  db.query(sql.getGradeAge, function (err, results, fields) {
       if (err) {
         console.error(err);
         return response.status(500).json({ error: '에러' });
       }
       response.json(results);
  }); 
});

router.get("/userlist/:userSearchCase/:userSortCase/:userSearchKeyword", async function (request, response, next) {
    const userSearchCase = request.params.userSearchCase;
    const userSortCase = request.params.userSortCase;
    const userSearchKeyword = request.params.userSearchKeyword;

    try {
      const results = await getUserList(userSearchCase, userSortCase, userSearchKeyword);
      response.json(results);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "목록에러" });
    }
  }
);

async function getUserList(userSearchCaseNum, userSortCaseNum, userSearchKeyword ) {
  let addUserSearchQuery = "";

  if (userSearchKeyword != "none") {
    if (userSearchCaseNum == 0) {
      addUserSearchQuery =
        ' WHERE user_id Like "%' + userSearchKeyword + '%"';
    } else if (userSearchCaseNum == 1) {
      addUserSearchQuery =
        ' WHERE user_nm Like "%' + userSearchKeyword + '%"';
    } else if (userSearchCaseNum == 2) {
      addUserSearchQuery =
        ' WHERE user_ph Like "%' + userSearchKeyword + '%"';
    } else if (userSearchCaseNum == 3) {
      addUserSearchQuery =
        ' WHERE user_mail Like "%' + userSearchKeyword + '%"';
    } else if (userSearchCaseNum == 4) {
      addUserSearchQuery =
        ' WHERE user_hno Like "%' + userSearchKeyword + '%"';
    } else if (userSearchCaseNum == 5) {
      addUserSearchQuery =
        ' WHERE user_adr1 Like "%' + userSearchKeyword + '%"';
    }
  }

  const userSortArrange = userSortCaseReplace(userSortCaseNum);

  return new Promise((resolve, reject) => {
    const userSearchQuery =
      addUserSearchQuery !== "" ? sql.adminUserList + addUserSearchQuery + userSortArrange : sql.adminUserList + userSortArrange;
    //console.log(query);
    db.query(userSearchQuery, function (error, results, fields) {
      if (error) {
        console.error(error);
        reject(error);
      }
      resolve(results);
    });
  });
}

function userSortCaseReplace(userSortCase) {
  let order = ` ORDER BY user_no DESC`; // 최근 순
  if (userSortCase == 1) {
    // 오래된 순
    order = ` ORDER BY user_no`;
  }
  return order;
}

router.get("/userlist/score/:user_no", (req, res) => {
  const user_no = req.params.user_no;
  db.query(sql.getScore, [user_no], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
      console.log(result);
    }
  });
});

router.delete("/userlist/delete", function (req, res) {
  const userNos = req.body.userNos; // 배열로 받음

  db.query(sql.deleteUsers, [userNos], (err, result) => {
    if (err) {
      console.error("사용자 삭제 실패:", err);
      res.status(500).json({ message: "사용자 삭제 실패" });
    } else {
      console.log("사용자 삭제 성공:", result);
      res.status(200).json({ message: "사용자 삭제 성공" });
    }
  });
});

router.post("/userlist/score/add/:userNo", function (req, res, next) {
  const user_no = req.body.userNo;
  //console.log("user_no", user_no);
  const score_type = req.body.scoreType;
  const score_value = req.body.scoreValue;
  let sco_plus = 0;
  let sco_minus = 0;

  if (score_type == "plus") {
    sco_plus = score_value;
  } else if (score_type == "minus") {
    sco_minus = score_value;
  }

  const score_title = req.body.scoreTitle;
  const score_content = req.body.scoreContent;

  //console.log("score_type", score_type);
  //console.log("score_value", score_value);
  //console.log("score_title", score_title);
  //console.log("score_content", score_content);
  db.query(sql.adminScoreAdd, [user_no, sco_plus, sco_minus, score_title, score_content], function (err, results, fields) {
      if (err) {
        console.error(err);
        return response.status(500).json({ err: "fail" });
      }
      return res.status(200).json({ message: "add" });
    }
  );
});

router.get("/anonlist/:postAnonSearchCase/:postAnonSortCase/:postAnonSearchKeyword", async function (request, response, next) {
    const postAnonSearchCase = request.params.postAnonSearchCase;
    const postAnonSortCase = request.params.postAnonSortCase;
    const postAnonSearchKeyword = request.params.postAnonSearchKeyword;

    try {
      const results = await getPostAnonList( postAnonSearchCase, postAnonSortCase, postAnonSearchKeyword );
      response.json(results);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "목록에러" });
    }
  }
);

async function getPostAnonList(postAnonSearchCaseNum, postAnonSortCaseNum, postAnonSearchKeyword ) {
  let addPostAnonSearchQuery = "";

  if (postAnonSearchKeyword != "none") {
    if (postAnonSearchCaseNum == 0) {
      addPostAnonSearchQuery =
        ' WHERE tb_anon.ano_no = "' + postAnonSearchKeyword + '"';
    } else if (postAnonSearchCaseNum == 1) {
      addPostAnonSearchQuery =
        ' WHERE tb_anon.ano_title Like "%' + postAnonSearchKeyword + '%"';
    } else if (postAnonSearchCaseNum == 2) {
      addPostAnonSearchQuery =
        ' WHERE tb_anon.ano_content Like "%' + postAnonSearchKeyword + '%"';
    } else if (postAnonSearchCaseNum == 3) {
      addPostAnonSearchQuery =
        ' WHERE tb_anon.user_no = "' + postAnonSearchKeyword + '"';
    }
  }

  const postAnonSortArrange = postAnonSortCaseReplace(postAnonSortCaseNum);

  return new Promise((resolve, reject) => {
    const postAnonSearchQuery =
      addPostAnonSearchQuery !== "" ? sql.adminAnonList + addPostAnonSearchQuery + postAnonSortArrange : sql.adminAnonList + postAnonSortArrange;
    //console.log(query);
    db.query(postAnonSearchQuery, function (error, results, fields) {
      if (error) {
        console.error(error);
        reject(error);
      }
      resolve(results);
    });
  });
}

function postAnonSortCaseReplace(postAnonSortCase) {
  let order = ` ORDER BY ano_no DESC`; // 최근 순(글 번호 기준)
  if (postAnonSortCase == 1) {
    // 오래된 순
    order = ` ORDER BY ano_no`;
  }
  if (postAnonSortCase == 2) {
    // 조회수 높은 순
    order = ` ORDER BY ano_count DESC, ano_no DESC`;
  }
  if (postAnonSortCase == 3) {
    // 조회수 낮은 순
    order = ` ORDER BY ano_count, ano_no DESC`;
  }
  if (postAnonSortCase == 4) {
    // 추천수 높은 순
    order = ` ORDER BY ano_like DESC, ano_no DESC`;
  }
  if (postAnonSortCase == 5) {
    // 추천수 낮은 순
    order = ` ORDER BY ano_like, ano_no DESC`;
  }
  return order;
}

router.delete("/anonlist/delete", function (req, res) {
  const postNos = req.body.postNos; // 배열로 받음

  db.query(sql.deleteAnonPosts, [postNos], (err, result) => {
    if (err) {
      console.error("게시글 삭제 실패:", err);
      res.status(500).json({ message: "게시글 삭제 실패" });
    } else {
      console.log("게시글 삭제 성공:", result);
      res.status(200).json({ message: "게시글 삭제 성공" });
    }
  });
});

router.get(
  "/noticelist/:postNoticeSearchCase/:postNoticeSortCase/:postNoticeSearchKeyword",
  async function (request, response, next) {
    const postNoticeSearchCase = request.params.postNoticeSearchCase;
    const postNoticeSortCase = request.params.postNoticeSortCase;
    const postNoticeSearchKeyword = request.params.postNoticeSearchKeyword;

    try {
      const results = await getPostNoticeList(
        postNoticeSearchCase,
        postNoticeSortCase,
        postNoticeSearchKeyword
      );
      response.json(results);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "목록에러" });
    }
  }
);

async function getPostNoticeList(
  postNoticeSearchCaseNum,
  postNoticeSortCaseNum,
  postNoticeSearchKeyword
) {
  let addPostNoticeSearchQuery = "";

  if (postNoticeSearchKeyword != "none") {
    if (postNoticeSearchCaseNum == 0) {
      addPostNoticeSearchQuery =
        ' WHERE tb_notice.not_no = "' + postNoticeSearchKeyword + '"';
    } else if (postNoticeSearchCaseNum == 1) {
      addPostNoticeSearchQuery =
        ' WHERE tb_notice.not_title Like "%' + postNoticeSearchKeyword + '%"';
    } else if (postNoticeSearchCaseNum == 2) {
      addPostNoticeSearchQuery =
        ' WHERE tb_notice.not_content Like "%' + postNoticeSearchKeyword + '%"';
    }
  }

  const postNoticeSortArrange = postNoticeSortCaseReplace(postNoticeSortCaseNum);

  return new Promise((resolve, reject) => {
    const postNoticeSearchQuery =
      addPostNoticeSearchQuery !== ""
        ? sql.adminNoticeList + addPostNoticeSearchQuery + postNoticeSortArrange
        : sql.adminNoticeList + postNoticeSortArrange;
    //console.log(query);
    db.query(postNoticeSearchQuery, function (error, results, fields) {
      if (error) {
        console.error(error);
        reject(error);
      }
      resolve(results);
    });
  });
}

function postNoticeSortCaseReplace(postNoticeSortCase) {
  let order = ` ORDER BY tb_notice.not_no DESC`; // 최근 순(글 번호 기준)
  if (postNoticeSortCase == 1) {
    // 오래된 순
    order = ` ORDER BY tb_notice.not_no`;
  }
  if (postNoticeSortCase == 2) {
    // 조회수 높은 순
    order = ` ORDER BY tb_notice.not_count DESC`;
  }
  if (postNoticeSortCase == 3) {
    // 조회수 낮은 순
    order = ` ORDER BY tb_notice.not_count`;
  }
  return order;
}

router.delete("/noticelist/delete", function (req, res) {
  const postNos = req.body.postNos; // 배열로 받음

  db.query(sql.deleteNoticePosts, [postNos], (err, result) => {
    if (err) {
      console.error("게시글 삭제 실패:", err);
      res.status(500).json({ message: "게시글 삭제 실패" });
    } else {
      console.log("게시글 삭제 성공:", result);
      res.status(200).json({ message: "게시글 삭제 성공" });
    }
  });
});

router.get("/boardlist/:postBoardSearchCase/:postBoardSortCase/:postBoardSearchKeyword", async function (request, response, next) {
    const postBoardSearchCase = request.params.postBoardSearchCase;
    const postBoardSortCase = request.params.postBoardSortCase;
    const postBoardSearchKeyword = request.params.postBoardSearchKeyword;

    try {
      const results = await getPostBoardList(
        postBoardSearchCase,
        postBoardSortCase,
        postBoardSearchKeyword
      );
      response.json(results);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "목록에러" });
    }
  }
);

async function getPostBoardList(postBoardSearchCaseNum, postBoardSortCaseNum, postBoardSearchKeyword ) {
  let addPostBoardSearchQuery = "";

  if (postBoardSearchKeyword != "none") {
    if (postBoardSearchCaseNum == 0) {
      addPostBoardSearchQuery =
        ' WHERE tb_board.bod_no = "' + postBoardSearchKeyword + '"';
    } else if (postBoardSearchCaseNum == 1) {
      addPostBoardSearchQuery =
        ' WHERE tb_board.bod_title Like "%' + postBoardSearchKeyword + '%"';
    } else if (postBoardSearchCaseNum == 2) {
      addPostBoardSearchQuery =
        ' WHERE tb_board.bod_content Like "%' + postBoardSearchKeyword + '%"';
    }
  }

  const postBoardSortArrange = postBoardSortCaseReplace(postBoardSortCaseNum);

  return new Promise((resolve, reject) => {
    const postBoardSearchQuery =
      addPostBoardSearchQuery !== "" ? sql.adminBoardList + addPostBoardSearchQuery + postBoardSortArrange : sql.adminBoardList + postBoardSortArrange;
    //console.log(query);
    db.query(postBoardSearchQuery, function (error, results, fields) {
      if (error) {
        console.error(error);
        reject(error);
      }
      resolve(results);
    });
  });
}

function postBoardSortCaseReplace(postBoardSortCase) {
  let order = ` ORDER BY tb_board.bod_no DESC`; // 최근 순(글 번호 기준)
  if (postBoardSortCase == 1) {
    // 오래된 순
    order = ` ORDER BY tb_board.bod_no`;
  }
  if (postBoardSortCase == 2) {
    // 조회수 높은 순
    order = ` ORDER BY tb_board.bod_count DESC`;
  }
  if (postBoardSortCase == 3) {
    // 조회수 낮은 순
    order = ` ORDER BY tb_board.bod_count`;
  }
  return order;
}

router.delete("/boardlist/delete", function (req, res) {
  const postNos = req.body.postNos; // 배열로 받음

  db.query(sql.deleteBoardPosts, [postNos], (err, result) => {
    if (err) {
      console.error("게시글 삭제 실패:", err);
      res.status(500).json({ message: "게시글 삭제 실패" });
    } else {
      console.log("게시글 삭제 성공:", result);
      res.status(200).json({ message: "게시글 삭제 성공" });
    }
  });
});

router.get("/lostlist/:postLostSearchCase/:postLostSortCase/:postLostSearchKeyword", async function (request, response, next) {
    const postLostSearchCase = request.params.postLostSearchCase;
    const postLostSortCase = request.params.postLostSortCase;
    const postLostSearchKeyword = request.params.postLostSearchKeyword;

    try {
      const results = await getPostLostList(postLostSearchCase, postLostSortCase, postLostSearchKeyword );
      response.json(results);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "목록에러" });
    }
  }
);

async function getPostLostList(postLostSearchCaseNum, postLostSortCaseNum, postLostSearchKeyword) {
  let addPostLostSearchQuery = "";

  if (postLostSearchKeyword != "none") {
    if (postLostSearchCaseNum == 0) {
      addPostLostSearchQuery =
        ' WHERE tb_lost.lost_no = "' + postLostSearchKeyword + '"';
    } else if (postLostSearchCaseNum == 1) {
      addPostLostSearchQuery =
        ' WHERE tb_lost.lost_title Like "%' + postLostSearchKeyword + '%"';
    } else if (postLostSearchCaseNum == 2) {
      addPostLostSearchQuery =
        ' WHERE tb_lost.lost_content Like "%' + postLostSearchKeyword + '%"';
    }
  }

  const postLostSortArrange = postLostSortCaseReplace(postLostSortCaseNum);

  return new Promise((resolve, reject) => {
    const postLostSearchQuery =
      addPostLostSearchQuery !== ""
        ? sql.adminLostList + addPostLostSearchQuery + postLostSortArrange
        : sql.adminLostList + postLostSortArrange;
    //console.log(query);
    db.query(postLostSearchQuery, function (error, results, fields) {
      if (error) {
        console.error(error);
        reject(error);
      }
      resolve(results);
    });
  });
}

function postLostSortCaseReplace(postLostSortCase) {
  let order = ` ORDER BY tb_lost.lost_no DESC`; // 최근 순(글 번호 기준)
  if (postLostSortCase == 1) {
    // 오래된 순
    order = ` ORDER BY tb_lost.lost_no`;
  }
  return order;
}

router.delete("/lostlist/delete", function (req, res) {
  const postNos = req.body.postNos; // 배열로 받음

  db.query(sql.deleteLostPosts, [postNos], (err, result) => {
    if (err) {
      console.error("게시글 삭제 실패:", err);
      res.status(500).json({ message: "게시글 삭제 실패" });
    } else {
      console.log("게시글 삭제 성공:", result);
      res.status(200).json({ message: "게시글 삭제 성공" });
    }
  });
});

router.get(
  "/reportlist/:postReportStateCase/:postReportSearchCase/:postReportSortCase/:postReportSearchKeyword",
  async function (request, response, next) {
    const postReportStateCase = request.params.postReportStateCase;
    const postReportSearchCase = request.params.postReportSearchCase;
    const postReportSortCase = request.params.postReportSortCase;
    const postReportSearchKeyword = request.params.postReportSearchKeyword;

    try {
      const results = await getPostReportList(
        postReportStateCase,
        postReportSearchCase,
        postReportSortCase,
        postReportSearchKeyword
      );
      response.json(results);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "목록에러" });
    }
  }
);

async function getPostReportList(
  postReportStateCaseNum,
  postReportSearchCaseNum,
  postReportSortCaseNum,
  postReportSearchKeyword
) {
  let addPostReportSearchQuery = "";

  if (postReportSearchKeyword != "none") {
    if (postReportSearchCaseNum == 0) {
      addPostReportSearchQuery =
        ' AND tb_report.rep_no = "' + postReportSearchKeyword + '"';
    } else if (postReportSearchCaseNum == 1) {
      addPostReportSearchQuery =
        ' AND tb_report.rep_title Like "%' + postReportSearchKeyword + '%"';
    } else if (postReportSearchCaseNum == 2) {
      addPostReportSearchQuery =
        ' AND tb_report.rep_content Like "%' + postReportSearchKeyword + '%"';
    } else if (postReportSearchCaseNum == 3) {
      addPostReportSearchQuery =
        ' AND tb_report.rep_category = "' + postReportSearchKeyword + '"';
    }
  }

  const postReportSortArrange = postReportSortCaseReplace(postReportSortCaseNum);
  const postReportStateArrange = postReportStateCaseReplace(postReportStateCaseNum);

  return new Promise((resolve, reject) => {
    const postReportSearchQuery =
      addPostReportSearchQuery !== ""
        ? sql.adminReportList + postReportStateArrange + addPostReportSearchQuery + postReportSortArrange
        : sql.adminReportList + postReportStateArrange + postReportSortArrange;
    //console.log(query);
    db.query(postReportSearchQuery, function (error, results, fields) {
      if (error) {
        console.error(error);
        reject(error);
      }
      resolve(results);
    });
  });
}

function postReportStateCaseReplace(postReportStateCase) {
  let cate = ` WHERE (tb_report.rep_state = 0 OR tb_report.rep_state = 1)`;
  if (postReportStateCase == 1) {
    cate = ` WHERE tb_report.rep_state = 1`;
  }
  if (postReportStateCase == 2) {
    cate = ` WHERE tb_report.rep_state = 0`;
  }
  return cate;
}

function postReportSortCaseReplace(postReportSortCase) {
  let order = ` ORDER BY tb_report.rep_no DESC`; // 최근 순(글 번호 기준)
  if (postReportSortCase == 1) {
    // 오래된 순
    order = ` ORDER BY tb_report.rep_no`;
  }
  return order;
}

router.delete("/reportlist/delete", function (req, res) {
  const postNos = req.body.postNos; // 배열로 받음

  db.query(sql.deleteReportPosts, [postNos], (err, result) => {
    if (err) {
      console.error("게시글 삭제 실패:", err);
      res.status(500).json({ message: "게시글 삭제 실패" });
    } else {
      console.log("게시글 삭제 성공:", result);
      res.status(200).json({ message: "게시글 삭제 성공" });
    }
  });
});

router.post("/reportlist/read", function (req, res) {
  const { postNos_Read } = req.body.data;

  db.query(`UPDATE tb_report SET rep_state = 1 WHERE rep_no IN (?)`, [postNos_Read], (err, result) => {
    if (err) {
      console.error("게시글 수정 실패:", err);
      res.status(500).json({ message: "게시글 읽기 실패" });
    } else {
      console.log("게시글 수정 성공:", result);
      res.status(200).json({ message: "게시글 읽기 성공" });
    }
  });
});

module.exports = router;