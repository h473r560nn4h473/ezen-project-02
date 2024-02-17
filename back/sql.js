module.exports = {


//자습실 정보 가져오기
roomList: `SELECT STR_ROOM FROM TB_STUDY_ROOM WHERE STR_FLOOR = ?`,
timeList: `SELECT TIME_START FROM TB_ROOM_TIME`,
seatList: `SELECT SEAT_ID, SEAT_NUMBER, SEAT_LINE FROM TB_SEAT A, TB_STUDY_ROOM B WHERE A.STR_NO = B.STR_NO AND STR_ROOM = ? `,
resSeat: `SELECT RES_SEAT_IDS FROM TB_RESERVATION WHERE RES_STR_ROOM =? AND RES_DATE = ? AND RES_TIME = ?`,
mkRes: `INSERT INTO TB_RESERVATION (RES_STR_ROOM, RES_DATE, RES_TIME, RES_SEAT_IDS, USER_NO) VALUES (?,?,?,?,?)`,



foods_list: `SELECT FOD_TYPE1, FOD_TYPE2, FOD_TYPE3, FOD_DATE FROM TB_FOODS WHERE FOD_DATE = ?`,
all_foods: `SELECT * FROM TB_FOODS`,
//채팅페이지
chat_check_alram : `SELECT COUNT(*) as count FROM TB_ALRAM WHERE USER_NO = ? AND SELECT_NUM = ? AND ALRAM_COUNT = 0`,
chat_room_check : `SELECT * FROM TB_CHATROOM WHERE CHATROOM_USER1 = ? and CHATROOM_USER2 = ?`,
create_chat_room : `INSERT INTO TB_CHATROOM (CHATROOM_USER1, CHATROOM_USER2) VALUES (?,?)`,
get_chat : `SELECT * FROM TB_CHAT WHERE CHATROOM_NO = ?`,
get_room : `SELECT * FROM TB_CHATROOM WHERE CHATROOM_NO = ?`,
chat_room_in1 : `UPDATE TB_CHATROOM SET CHATROOM_OUT1 = 0 WHERE CHATROOM_NO = ?`,
chat_room_in2 : `UPDATE TB_CHATROOM SET CHATROOM_OUT2 = 0 WHERE CHATROOM_NO = ?`,
chat_add_alram : `INSERT INTO TB_ALRAM(ALRAM_COUNT, USER_NO, SELECT_NUM) VALUE(0,?,?)`,
send_chat : `INSERT INTO TB_CHAT (chatroom_no, chat_user, chat_content) VALUES (?,?,?)`,
delete_chatroom_chat : `DELETE FROM TB_CHAT WHERE CHATROOM_NO = ?`,
delete_chat_room : `DELETE FROM TB_CHATROOM WHERE CHATROOM_NO = ?`,
chat_room_out1 : `UPDATE TB_CHATROOM SET CHATROOM_OUT1 = 1 WHERE CHATROOM_NO = ?`,
delete_chat: `DELETE FROM tb_chat WHERE chat_user = ?`,
chat_room_out2 : `UPDATE TB_CHATROOM SET CHATROOM_OUT2 = 1 WHERE CHATROOM_NO = ?`,
chat_delete_alram : `DELETE FROM TB_ALRAM WHERE ALRAM_COUNT = 0 AND USER_NO = ? AND SELECT_NUM = ?`,
get_chat_room: `SELECT * FROM TB_CHATROOM WHERE CHATROOM_USER1 = ? and CHATROOM_OUT1 = 0 or CHATROOM_USER2 = ? and CHATROOM_OUT2 = 0`,
get_comment: `SELECT c.CHAT_CONTENT, c.CHAT_DATE FROM TB_CHAT c, TB_CHATROOM r WHERE c.CHATROOM_NO = ? ORDER BY c.CHAT_DATE DESC LIMIT 1`,
get_chatroom_count: `SELECT COUNT(*) as count FROM TB_CHATROOM WHERE CHATROOM_USER1 = ? and CHATROOM_OUT1 = 0 or CHATROOM_USER2 = ? and CHATROOM_OUT2 = 0`,
all_chat_alram: `SELECT COUNT(*) as count FROM TB_ALRAM WHERE USER_NO = ? AND ALRAM_COUNT = 0`,
get_user_info: `SELECT * FROM TB_USER WHERE USER_NO = ?`,

//auth
id_check: `SELECT * FROM TB_USER WHERE user_id = ?`,  
admin_check: `SELECT user_tp FROM tb_user WHERE user_no = ?`,
join: `INSERT INTO TB_USER (USER_ID, USER_PW, USER_NM, USER_NICK, USER_PH, USER_HNO, USER_MAIL, USER_SEX, USER_ZIPCODE, USER_ADR1, USER_ADR2) 
       VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
mkScore: `INSERT INTO TB_SCORE (USER_NO) VALUES (?)`,  
login: `SELECT user_pw FROM TB_USER WHERE user_id = ?`,
get_user_no: `SELECT user_no FROM tb_user WHERE user_id = ?`,
checkDuplicate: `SELECT * FROM tb_user WHERE user_id = ?`,
nickDuplicate: `SELECT * FROM tb_user WHERE user_nick = ?`,
id_find: `SELECT user_id FROM tb_user WHERE user_ph = ?`,
user_check: `SELECT user_no FROM tb_user WHERE user_ph = ? AND user_id = ?`,
pass_update_tem: `UPDATE tb_user SET user_pw = ? WHERE user_id = ?`,

//board
board: `SELECT B.*, U.USER_NICK, U.USER_IMG FROM TB_BOARD B LEFT JOIN TB_USER U ON B.USER_NO=U.USER_NO`,
myBoard: `SELECT B.*, U.USER_NICK, U.USER_IMG FROM TB_BOARD B LEFT JOIN TB_USER U ON B.USER_NO=U.USER_NO WHERE U.USER_NO = ?`,
mainBoard: `SELECT B.*, U.USER_NICK, U.USER_IMG FROM TB_BOARD B LEFT JOIN TB_USER U ON B.USER_NO=U.USER_NO ORDER BY BOD_DATE DESC, BOD_NO DESC LIMIT 2`,
boarddetail: `SELECT B.*, U.USER_NICK, U.USER_IMG, IFNULL(CommentCount.COMMENT_COUNT, 0) as countC
              FROM TB_BOARD B
              LEFT JOIN TB_USER U ON B.USER_NO = U.USER_NO
              LEFT JOIN (
              SELECT BOD_NO, COUNT(*) AS COMMENT_COUNT
              FROM TB_COMMENT
              GROUP BY BOD_NO
              HAVING BOD_NO = ?
              ) CommentCount ON B.BOD_NO = CommentCount.BOD_NO
              WHERE B.BOD_NO = ?`,
bod_update: `UPDATE TB_BOARD SET BOD_TITLE = ?, BOD_CONTENT = ? WHERE BOD_NO = ? `,              
boardCadd: `UPDATE TB_BOARD SET BOD_COUNT = BOD_COUNT + 1 WHERE BOD_NO = ?`,
createComment : `INSERT INTO TB_COMMENT (USER_NO, BOD_NO, COM_CONTENT) VALUES(?,?,?)`,
getcomment: `SELECT C.*, U.USER_NICK, U.USER_IMG
              FROM TB_COMMENT C, TB_USER U 
              WHERE C.USER_NO = U.USER_NO AND C.BOD_NO = ?
              ORDER BY COM_DATE ASC`, 
deleteComment: `DELETE FROM TB_COMMENT WHERE COM_NO = ?`, 
board_add: `INSERT INTO TB_BOARD (BOD_TITLE, BOD_CONTENT, USER_NO) VALUES (?,?,?)`,
deleteBoard: `DELETE FROM TB_BOARD WHERE BOD_NO = ?`,
deleteBComment: `DELETE FROM TB_COMMENT WHERE BOD_NO = ?`,

lost: `SELECT L.*, U.USER_NICK, U.USER_IMG FROM TB_LOST L LEFT JOIN TB_USER U ON L.USER_NO=U.USER_NO`,
myLost: `SELECT L.*, U.USER_NICK, U.USER_IMG FROM TB_LOST L LEFT JOIN TB_USER U ON L.USER_NO=U.USER_NO WHERE U.USER_NO = ?`,
lostdetail: `SELECT L.*, U.USER_NICK, U.USER_IMG FROM TB_LOST L, TB_USER U WHERE L.USER_NO = U.USER_NO AND L.LOST_NO = ?`,
lostimgs: `SELECT LOST_IMG FROM TB_LOST_IMG WHERE LOST_NO = ?`,
//lost_check: `SELECT * FROM TB_LOST WHERE LOST_CONTENT= ?`,
// lost_add: `INSERT INTO TB_LOST (LOST_TITLE, LOST_CONTENT, LOST_CATEGORY, USER_NO) VALUES (?,?,?,?)`,
// lost_add_image: `INSERT INTO TB_LOST_IMG (LOST_IMG, LOST_NO) VALUES (?,?)`,
lostCadd: `UPDATE TB_LOST SET LOST_COUNT = LOST_COUNT + 1 WHERE LOST_NO = ?`,
deleteLost: `DELETE FROM TB_LOST WHERE LOST_NO = ?`,
deleteLImgs: `DELETE FROM TB_LOST_IMG WHERE LOST_NO = ?`,
updateLost: `UPDATE TB_LOST SET LOST_STATE = 1 WHERE LOST_NO = ?`,
mainLost: `SELECT L.*, U.USER_NICK, U.USER_IMG FROM TB_LOST L LEFT JOIN TB_USER U ON L.USER_NO=U.USER_NO ORDER BY LOST_DATE DESC, LOST_NO DESC LIMIT 2`, 
//lost_img_check: `SELECT LOST_IMG FROM TB_LOST_IMG`,

notice: `SELECT N.* FROM TB_NOTICE N`,
noticedetail: `SELECT * FROM TB_NOTICE WHERE NOT_NO = ?`,
noticeCadd: `UPDATE TB_NOTICE SET NOT_COUNT = NOT_COUNT + 1 WHERE NOT_NO = ?`,
mainNotice: `SELECT * FROM TB_NOTICE ORDER BY NOT_DATE DESC, NOT_NO DESC LIMIT 2`,
notice_add: `INSERT INTO TB_NOTICE (NOT_TITLE, NOT_CONTENT) VALUES (?,?)`,
notice_update: `UPDATE TB_NOTICE SET NOT_TITLE = ?, NOT_CONTENT = ? WHERE NOT_NO = ?`,

report: `SELECT R.*, U.USER_NICK, U.USER_IMG FROM TB_REPORT R LEFT JOIN TB_USER U ON R.USER_NO=U.USER_NO`,
myReport: `SELECT R.*, U.USER_NICK, U.USER_IMG FROM TB_REPORT R LEFT JOIN TB_USER U ON R.USER_NO=U.USER_NO WHERE U.USER_NO = ?`,
reportdetail: `SELECT R.*, U.USER_NICK, U.USER_IMG FROM TB_REPORT R, TB_USER U WHERE R.USER_NO = U.USER_NO AND R.REP_NO = ?`,
reportimgs: `SELECT REP_IMG FROM TB_REPORT_IMG WHERE REP_NO = ?`,
// rep_add: `INSERT INTO TB_REPORT (REP_TITLE, REP_CONTENT, REP_CATEGORY, USER_NO) VALUES (?,?,?,?)`,
// rep_add_image: `INSERT INTO TB_REPORT_IMG (REP_IMG, REP_NO) VALUES (?,?)`,
reportCadd: `UPDATE TB_REPORT SET REP_COUNT = REP_COUNT + 1 WHERE REP_NO = ?`,
deleteReport: `DELETE FROM TB_REPORT WHERE REP_NO = ?`,
deleteRImgs: `DELETE FROM TB_REPORT_IMG WHERE REP_NO = ?`,
mainReport: `SELECT R.*, U.USER_NICK, U.USER_IMG FROM TB_REPORT R LEFT JOIN TB_USER U ON R.USER_NO = U.USER_NO ORDER BY REP_DATE DESC, REP_NO DESC LIMIT 2`,
//rep_img_check: `SELECT REP_IMG FROM TB_REPORT_IMG`,
anon: `SELECT * FROM TB_ANON`,
myAnon: `SELECT * FROM TB_ANON WHERE USER_NO = ?`,
anondetail: `SELECT A.*,
              IFNULL(CommentCount.COMMENT_COUNT, 0) AS countC,
              L.LIK_STATE
              FROM
              TB_ANON A
              LEFT JOIN (
              SELECT ANO_NO, COUNT(*) AS COMMENT_COUNT
              FROM TB_COMMENT
              GROUP BY ANO_NO
              HAVING ANO_NO = ?
              ) CommentCount ON A.ANO_NO = CommentCount.ANO_NO
              LEFT JOIN TB_LIKE L ON A.ANO_NO = L.ANO_NO AND L.USER_NO = ?
              WHERE
              A.ANO_NO = ?`,
anon_update: `UPDATE TB_ANON SET ANO_TITLE = ?, ANO_CONTENT = ? WHERE ANO_NO = ? `,
updateLikeOne: `UPDATE TB_LIKE set LIK_STATE = 1 where ANO_NO = ? AND USER_NO = ?`,     
like_add: ` UPDATE TB_ANON set ANO_LIKE = ANO_LIKE + 1 where ANO_NO = ?`,    
updateLikeZero: `UPDATE TB_LIKE set LIK_STATE = 0 where ANO_NO = ? AND USER_NO = ?`,     
like_minus: ` UPDATE TB_ANON set ANO_LIKE = ANO_LIKE - 1 where ANO_NO = ?`,    
anonCadd: `UPDATE TB_ANON SET ANO_COUNT = ANO_COUNT + 1 WHERE ANO_NO = ?`,
createCommentA : `INSERT INTO TB_COMMENT (USER_NO, ANO_NO, COM_CONTENT) VALUES(?,?,?)`,
getcommentA: `SELECT * FROM TB_COMMENT WHERE ANO_NO = ? ORDER BY COM_DATE ASC`,
anon_add: `INSERT INTO TB_ANON (ANO_TITLE, ANO_CONTENT, USER_NO) VALUES (?,?,?)`,
like_anon_add: `INSERT INTO TB_LIKE (ANO_NO, USER_NO) VALUES (?,?)`,
deleteAnon: `DELETE FROM TB_ANON WHERE ANO_NO = ?`,
deleteAComment: `DELETE FROM TB_COMMENT WHERE ANO_NO = ?`,

//admin
getGender: `SELECT CASE WHEN USER_SEX = 1 THEN '남성' WHEN USER_SEX = 2 THEN '여성' END AS GENDER, COUNT(*) AS COUNT FROM TB_USER WHERE USER_SEX IN (1, 2) GROUP BY USER_SEX`,
getResRoom: `SELECT CASE WHEN RES_STR_ROOM = 'A실' THEN '제 1실' WHEN RES_STR_ROOM = 'B실' THEN '제 2실' END AS RNAME, COUNT(*) AS COUNT
              FROM TB_RESERVATION WHERE RES_STR_ROOM IN ('A실', 'B실') GROUP BY RNAME`,
getGradeAge: `SELECT 
              CASE 
              WHEN YEAR(CURDATE()) + 1 - LEFT(CAST(user_hno AS CHAR), 4) >= 4 THEN 4
              ELSE YEAR(CURDATE()) + 1 - LEFT(CAST(user_hno AS CHAR), 4)
              END AS grade,
              CASE WHEN user_sex = 1 THEN '남성' WHEN user_sex = 2 THEN '여성' END AS gender, COUNT(*) AS count
              FROM tb_user WHERE user_sex IN (1, 2) GROUP BY grade, gender ORDER BY grade`,    
adminUserList: `SELECT * FROM tb_user`,
getScore: `SELECT s.*, u.USER_NM FROM TB_SCORE s, TB_USER u WHERE s.USER_NO = u.USER_NO AND s.USER_NO = ? ORDER BY s.SCO_DATE DESC LIMIT 1`,
adminScoreAdd: `INSERT INTO tb_score (USER_NO, SCO_PLUS, SCO_MINUS, SCO_TITLE, SCO_CONTENT) VALUES (?,?,?,?,?)`,
//get_user_info: `SELECT * FROM tb_user WHERE user_no = ?`,
deleteUsers: `DELETE tb_user, tb_score FROM tb_user LEFT JOIN tb_score ON tb_user.user_no = tb_score.user_no WHERE tb_user.user_no IN (?)`,              
adminAnonList: `SELECT * FROM tb_anon`,
deleteAnonPosts: `DELETE FROM tb_anon WHERE ano_no IN (?)`,
adminNoticeList: `SELECT * FROM tb_notice`,
deleteNoticePosts: `DELETE FROM tb_notice WHERE not_no IN (?)`,
adminBoardList: `SELECT tb_board.*, tb_user.USER_NM FROM tb_board JOIN tb_user ON tb_board.user_no = tb_user.user_no`,
deleteBoardPosts: `DELETE FROM tb_board WHERE bod_no IN (?)`,
adminLostList: `SELECT tb_lost.*, tb_user.USER_NM FROM tb_lost JOIN tb_user ON tb_lost.user_no = tb_user.user_no`,
deleteLostPosts: `DELETE FROM tb_lost WHERE lost_no IN (?)`,
adminReportList: `SELECT tb_report.*, tb_user.USER_NM FROM tb_report JOIN tb_user ON tb_report.user_no = tb_user.user_no`,
deleteReportPosts: `DELETE FROM tb_report WHERE rep_no IN (?)`,

                                      

//mypage
score_info: `SELECT IFNULL(SUM(SCO_PLUS),0) AS PLUS, IFNULL(SUM(SCO_MINUS),0) AS MINUS
              FROM TB_SCORE
              WHERE USER_NO = ?`,
score_detail: `SELECT * FROM TB_SCORE WHERE USER_NO = ?`,              
user_info: `SELECT * FROM TB_USER WHERE USER_NO = ?`,
userinfo_update: `UPDATE TB_USER SET USER_ID = ?, USER_NM = ?, USER_PH = ?, USER_MAIL = ?, USER_NICK = ?, USER_ZIPCODE = ?, USER_ADR1 = ?, USER_ADR2 = ? WHERE USER_NO = ?`,
user_add_image: `UPDATE TB_USER SET USER_IMG = ? WHERE USER_NO = ?`,
user_img_check: `SELECT USER_IMG FROM TB_USER`,
myRes_info: ` SELECT R.*, S.STR_FLOOR, T.SEAT_NUMBER FROM TB_RESERVATION R, TB_STUDY_ROOM S, TB_SEAT T WHERE R.RES_STR_ROOM = S.STR_ROOM AND R.RES_SEAT_IDS = T.SEAT_ID AND USER_NO = ?`,
deleteRes: ` DELETE FROM TB_RESERVATION WHERE RES_NO = ?`,
get_password: 'SELECT user_pw FROM tb_user WHERE user_no = ?',
pass_update: 'UPDATE tb_user SET user_pw = ? WHERE user_no = ?', 

}