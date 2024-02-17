<template>
  <div class="grid-box">
    <div class="top-wrap">
      <div class="post-title">{{  anonlist.ANO_TITLE }}</div>
      <div class="top">
        <div class="top-left">
          <div class="nick">익명{{ anonlist.USER_NO }}</div>
          <div class="bar"></div>
          <div class="date">{{ formatDateTime(anonlist.ANO_DATE) }}</div>
        </div>
        <div class="top-right">
          <div class="view"><i class="fa-regular fa-eye icon"></i>{{ anonlist.ANO_COUNT }}</div>
          <div class="bar"></div>
          <div class="view"><i class="fa-regular fa-heart icon"></i>{{ anonlist.ANO_LIKE }}</div>
          <div class="bar"></div>
          <div class="comment-num"><i class="fa-regular fa-comment icon"></i>{{ anonlist.countC }}</div>
        </div>
      </div>
    </div>
    <div class="content-section">
      <div v-html="anon_content" class="content"></div>
      <div class="ad">
        <div class="ad-notice"><i class="fa-solid fa-circle-info"></i> 광고</div>
        <img v-if="adImageLoaded" src="https://www.dc601.com/files/board/2023/12/44bba3eb56558c22f6b35d6453112324.jpg" alt="자격증 광고" @error="handleAdImageError">
        <span v-else>이미지를 불러올 수 없습니다.</span>
      </div>
      <button class="btn-solved btn-like" v-if="anonlist.LIK_STATE == 0" @click="likeChange1()"><i class="fa-regular fa-heart"></i><span>좋아요</span></button>
      <button class="btn-solved btn-liked" v-else @click="likeChange2()"><i class="fa-solid fa-heart"></i><span>좋아요</span></button>
    </div>
    <div class="comment-section">
      <div class="comment-count"><i class="fa-regular fa-comment icon"></i>댓글 {{ anonlist.countC }}개</div>
      <!-- 댓글 작성 폼 -->
      <div class="comment-form">
        <div class="input-row">
          <input v-model="newCommentText" placeholder="댓글을 입력하세요." autocomplete="off" @keyup.enter="addComment" />
        </div>
        <button type="button" class="btn-small" @click="addComment">등록</button>
      </div>
      <div class="comment-list"> <!--가져온 정보의 게시글 번호-->
        <div class="comment-wrap" v-for="comment in commentList" :key="comment.COM_NO">
          <div class="comment-row">
            <div class="comment-row-right">
              <div class="right-top">
                <div class="right-top-left">
                  <div class="user-nick" :title="comment.USER_NO">익명{{ comment.USER_NO }}</div>
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
      <button v-show="anonlist.USER_NO == user.user_no" type="button" class="btn-small btn-blue" @click="ModifyAnon(anonlist.ANO_NO)">수정</button>
      <button v-show="anonlist.USER_NO == user.user_no" type="button" class="btn-small btn-red" @click="DeleteAnon(anonlist.ANO_NO)">삭제</button>
      <button type="button" class="btn-small" @click="AnonMain">목록으로</button>
    </div>    
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      anonlist: {},
      ANO_NO: this.$route.query.ANO_NO,
      anon_content: '',
      newCommentText: '',
      commentList: [],
      adImageLoaded: true,
    }
  },
  computed: {
    user() {
      return this.$store.state.user; // user 정보가 바뀔 때마다 자동으로 user() 갱신
    },
  },
  mounted() {
    this.getAnonDetail();
    this.fetchComments(); // fetchComments() 메서드를 호출합니다.
  },
  methods: {
    async getAnonDetail() {
      try {
        const response = await axios.get(`http://localhost:3000/anon/anonDetail/${this.ANO_NO}/${this.user.user_no}`);
        this.anonlist = response.data[0];
        console.log(this.user.user_no);
        console.log(this.anonlist);
        this.anon_content = this.anonlist.ANO_CONTENT.split('\n').join('<br />');
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
    AnonMain() {
      axios({
        url: "http://localhost:3000/anon/addACount", 
        method: "POST",
        data: {
          ano_no: this.ANO_NO
        },
      }).then(res => {
        if (res.data.message == 'complete') {
          if (this.user.user_tp == 1) {
            this.$router.go(-1);
          } else {
            this.$router.push({ path: '/board/anon'})
          }
        }
      }).catch(err => {
        alert(err);
      });
    },
    //댓글 추가
    async addComment() {
      if (this.newCommentText.trim() !== '') {
        try {
          const response = await axios.post(`http://localhost:3000/anon/addCommentA/${this.ANO_NO}/${this.user.user_no}`, {
            commentContent: this.newCommentText
          });
          //console.log(response.data); // 서버에서 받은 응답 출력

          this.getAnonDetail(); // 게시물 상세 내용을 다시 가져옵니다.
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
        const response = await axios.get(`http://localhost:3000/anon/loadCommentA/${this.ANO_NO}`);
        this.commentList = response.data;
        //console.log(this.commentList);
        //this.com_content = this.commentList[0].COM_CONTENT;
        //console.log(response.data);
      } catch (error) {
        console.error(error);
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
            title: '삭제되었습니다',
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
        this.getAnonDetail(); // 게시물 상세 내용을 다시 가져옵니다
        this.fetchComments();
        console.log(res.data)
      }).catch(err => {
        alert(err);
      });
    },
    async likeChange1() {
      try {
        const response = await axios.post(`http://localhost:3000/anon/updateLikeA/${this.ANO_NO}/${this.user.user_no}`);
        console.log(response);
        this.getAnonDetail();
      } catch (error) {
        console.error(error);
      }
    },
    async likeChange2() {
      try {
        const response = await axios.post(`http://localhost:3000/anon/updateLikeB/${this.ANO_NO}/${this.user.user_no}`);
        console.log(response);
        this.getAnonDetail();
      } catch (error) {
        console.error(error);
      }
    },
    DeleteAnon(ANO_NO) {
      this.$swal({
        title: `게시글을 삭제하시겠습니까?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
      }).then(result => {
        if(result.value) {
          this.deleteAnonA(ANO_NO); 
        }
      });
    },
    deleteAnonA(ANO_NO) {
      axios({
        url: "http://localhost:3000/anon/deleteAnon", //board.js에 있는 deletecontent 실행
        method: "POST",
        data: {
          ano_no: ANO_NO
        },
      }).then(res => {
        if(res.data.message == 'success') {
          this.$swal({
            icon: 'success',
            title: '삭제되었습니다.',
            showConfirmButton: false,
            timer: 1500
          })
          this.$router.push('/board/anon');
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
    handleAdImageError() { // 이미지 로딩에 실패했을 때 실행될 메소드
      this.adImageLoaded = false; // 이미지 로딩 실패 상태를 업데이트
    },
    ModifyAnon(ANO_NO) {
      this.$router.push({ path: '/board/anon/anonModify', query: { ANO_NO: ANO_NO }})
    }
  }
}
</script>
<style src="../assets/css/global.css" scoped></style>
<style src="../assets/css/board.css" scoped></style>