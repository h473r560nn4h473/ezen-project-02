<template>
  <div class="grid-box">
    <div class="top-wrap">
      <div class="post-title">{{ boardlist.BOD_TITLE }}</div>
      <div class="top">
        <div class="top-left">
          <div class="profile-pic">
            <img v-if="boardlist.USER_IMG" :src="require('../../../back/uploads/uploadUser/' + `${boardlist.USER_IMG}`)" alt="댓글 프로필">
            <i v-else class="fa-solid fa-user"></i>
          </div>
          <div class="nick">{{ boardlist.USER_NICK }}</div>
          <div class="bar"></div>
          <div class="date">{{ formatDateTime(boardlist.BOD_DATE) }}</div>
        </div>
        <div class="top-right">
          <div class="view"><i class="fa-regular fa-eye icon"></i>{{ boardlist.BOD_COUNT }}</div>
          <div class="bar"></div>
          <div class="comment-num"><i class="fa-regular fa-comment icon"></i>{{ boardlist.countC }}</div>
        </div>
      </div>
    </div>
    <div class="content-section">
      <div v-html="boardContent" class="content"></div>
      <div class="ad">
        <div class="ad-notice"><i class="fa-solid fa-circle-info"></i> 광고</div>
        <img v-if="adImageLoaded" src="https://www.dc601.com/files/board/2023/12/44bba3eb56558c22f6b35d6453112324.jpg" alt="자격증 광고" @error="handleAdImageError">
        <span v-else>이미지를 불러올 수 없습니다.</span>
      </div>
    </div>
    <div class="comment-section">
      <div class="comment-count"><i class="fa-regular fa-comment icon"></i>댓글 {{ boardlist.countC }}개</div>
      <!-- 댓글 작성 폼 -->
      <div class="comment-form">
        <div class="input-row">
          <input v-model="newCommentText" placeholder="댓글을 입력하세요" autocomplete="off" @keyup.enter="addComment" />
        </div>
        <button type="button" class="btn-small" @click="addComment">등록</button>
      </div>
      <div class="comment-list"> <!--가져온 정보의 게시글 번호-->
        <div class="comment-wrap" v-for="comment in commentList" :key="comment.COM_NO">
          <div class="comment-row">
            <div class="comment-row-left">
              <div class="profile-pic">
                <img v-if="comment.USER_IMG" :src="require('../../../back/uploads/uploadUser/' + `${comment.USER_IMG}`)" alt="댓글 프로필">
                <i v-else class="fa-solid fa-user"></i>
              </div>
            </div>
            <div class="comment-row-right">
              <div class="right-top">
                <div class="right-top-left">
                  <div class="user-nick" :title="comment.USER_NICK">{{ comment.USER_NICK }}</div>
                  <div class="bar"></div>
                  <div class="date">{{ formatDateTime(comment.COM_DATE) }}</div>
                </div>
                <button class="btn-small btn-red" v-if="this.user.user_no == comment.USER_NO" @click="confirmDeleteComment(comment.COM_NO)">삭제</button>
              </div>
              <div class="comment-content">{{ comment.COM_CONTENT }}</div>
            </div>
          </div>
          <div class="line"></div>
        </div>
      </div>
    </div>
    <div class="btn-area">
      <button v-show="boardlist.USER_NO == user.user_no" type="button" class="btn-small btn-blue" @click="UpdateBoard(boardlist.BOD_NO)">수정</button>
      <button v-show="boardlist.USER_NO == user.user_no" type="button" class="btn-small btn-red" @click="DeleteBoard(boardlist.BOD_NO)">삭제</button>
      <button type="button" class="btn-small" @click="BoardMain">목록으로</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      boardlist: {},
      BOD_NO: this.$route.query.BOD_NO,
      boardContent: '',
      newCommentText: '',
      commentList: [],
      adImageLoaded: true, // 광고 이미지 로딩 여부를 추적하는 상태 변수
    }
  },
  computed: {
    user() {
      return this.$store.state.user; // user 정보가 바뀔 때마다 자동으로 user() 갱신
    },
  },
  mounted() {
    this.getBoardDetail();
    this.fetchComments(); // fetchComments() 메서드를 호출합니다.
  },
  methods: {
    async getBoardDetail() {
      try {
        const response = await axios.get(`http://localhost:3000/board/boardDetail/${this.BOD_NO}`);
        this.boardlist = response.data[0];
        console.log(this.boardlist);
        this.boardContent = this.boardlist.BOD_CONTENT.split('\n').join('<br />');
      } catch (error) {
        console.error(error);
      }
    },
    formatDateTime(dateTime) {
      const today = new Date();
      const date = new Date(dateTime);
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      const betweenTime = Math.floor((today.getTime() - date.getTime()) / 1000 / 60);
      if (betweenTime < 1) return '방금 전';
      if (betweenTime < 60) return `${betweenTime}분 전`;
      const betweenTimeHour = Math.floor(betweenTime / 60);
      const formattedDateTime = date.toLocaleDateString("ko-KR", options).replace(/\.$/, '');
      if (betweenTimeHour < 24) {
        return `${betweenTimeHour}시간 전`;
      } else {
        return formattedDateTime;
      }
    },
    BoardMain() {
      axios({
        url: "http://localhost:3000/board/addBCount", 
        method: "POST",
        data: {
          bod_no: this.BOD_NO
        },
      }).then(res => {
        if (res.data.message == 'complete') {
          if (this.user.user_tp == 1) {
            this.$router.go(-1);
          } else {
            this.$router.push({ path: '/board/free'})
          }
        }
      }).catch(err => {
        alert(err);
      });
    },
    // 댓글 추가
    async addComment() {
      if (this.newCommentText.trim() !== '') {
        try {
          const response = await axios.post(`http://localhost:3000/board/addComment/${this.BOD_NO}/${this.user.user_no}`, {
            commentContent: this.newCommentText
          });
          if (response.data.message === 'success') {
                this.$swal({
                  icon: 'success',
                  title: '댓글 등록이 성공했습니다.',
                  showConfirmButton: false,
                  timer: 1500
            })
          } else {
            this.$swal({
              icon: 'error',
              title: '댓글 등록이 실패했습니다',
              
            })
          }
          //console.log(response.data); // 서버에서 받은 응답 출력

          this.getBoardDetail(); // 게시물 상세 내용을 다시 가져옵니다.
          this.newCommentText = ''; // 입력 필드 초기화
          this.fetchComments(); // 댓글을 추가한 후에 댓글 목록을 다시 불러옵니다.
        } catch (error) {
          console.error('댓글 등록에 실패했습니다:', error);
        }
      }
    },
    // 댓글 로드
    async fetchComments() {
      try {
        const response = await axios.get(`http://localhost:3000/board/loadComment/${this.BOD_NO}`);
        this.commentList = response.data;
        console.log(this.commentList);
        //this.com_content = this.commentList[0].COM_CONTENT;
        //console.log(response.data);
      } catch (error) {
        console.error(error);
        this.$swal({
          icon: 'error',
          title: '댓글을 불러오는 것에 실패했습니다.'
        });
      }
    },
    confirmDeleteComment(COM_NO) { //글 삭제 확인하는 메서드(글삭제 확인 메시지 설정, 실행 시간 설정 등)
      this.$swal({
        title: `댓글을 삭제하시겠습니까?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
      }).then(result => {
        if(result.value) {
          this.deleteComment(COM_NO); //밑에 있는 글 삭제 메서드 실행
          this.$swal({
            icon: 'success',
            title: '삭제되었습니다.',
            showConfirmButton: false,
            timer: 1500
          })
          this.fetchComments();
        }
      });
    },
    deleteComment(COM_NO) {
      axios({
        url: "http://localhost:3000/board/deleteComment", //board.js에 있는 deletecontent 실행
        method: "POST",
        data: {
          com_no: COM_NO
        },
      }).then(res => {
        this.content = res.data;
        this.getBoardDetail(); // 게시물 상세 내용을 다시 가져옵니다
        this.fetchComments();
        console.log(res.data)
      }).catch(err => {
        alert(err);
      });
    },
    DeleteBoard(BOD_NO) {
      this.$swal({
        title: `게시글을 삭제하시겠습니까?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
      }).then(result => {
        if(result.value) {
          this.deleteBoardA(BOD_NO); 
        }
      });
    },
    deleteBoardA(BOD_NO) {
      axios({
        url: "http://localhost:3000/board/deleteBoard", //board.js에 있는 deletecontent 실행
        method: "POST",
        data: {
          bod_no: BOD_NO
        },
      }).then(res => {
        if(res.data.message == 'success') {
          this.$swal({
            icon: 'success',
            title: '삭제되었습니다.',
            showConfirmButton: false,
            timer: 1500
          })
          this.$router.push('/board/free');
        } else {
					this.$swal({
						icon: 'error',
						title: 'DB 에러'
					});
        }
      }).catch(err => {
        alert(err);
      });
    },
    UpdateBoard(BOD_NO) {
      this.$router.push({ path: '/board/free/freeModify', query: {BOD_NO: BOD_NO} })
    },
    handleAdImageError() { // 이미지 로딩에 실패했을 때 실행될 메소드
      this.adImageLoaded = false; // 이미지 로딩 실패 상태를 업데이트
    }
  }
}
</script>

<style src="../assets/css/global.css" scoped></style>
<style src="../assets/css/board.css" scoped></style>