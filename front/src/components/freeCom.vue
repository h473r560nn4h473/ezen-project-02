<template>
  <div class="title-btn-wrap">
    <div class="comp-title">자유 게시판</div>
    <div class="btn-text" @click="MyBoardMain">전체 글 보기 <i class="fa-solid fa-chevron-right"></i></div>
  </div>
  <div class="post-wrap">
    <div class="post grid-box" v-for="item in boardList" :key="item.BOD_NO"
    @click=movetocontent(item.BOD_NO)>
      <div class="post-title">{{ item.BOD_TITLE }}</div>
      <div class="post-detail">
        <div class="profile-pic">
          <img v-if="item.USER_IMG" :src="require('../../../back/uploads/uploadUser/' + `${item.USER_IMG}`)" alt="">
          <i v-else class="fa-solid fa-user"></i> 
        </div>
        <div class="post-author">{{ item.USER_NICK }}</div>
        <div class="bar"></div>
        <div class="post-date">{{ formatDateTime(item.BOD_DATE) }}</div>
        <div class="bar"></div>
        <div class="post-view"><i class="fa-regular fa-eye"></i>{{ item.BOD_COUNT }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      boardList: [], //현재 게시판과 페이지에 맞는 글 리스트
    }
  },
  computed: {
    user() {
      return this.$store.state.user; // 로그인 확인
    },
  },
  created() {
    this.getBoardList();
  },
  methods: {
    async getBoardList() {
      try {
        const response = await axios.get(`http://localhost:3000/board/main_board_list`);
        this.boardList = response.data;
        console.log(this.boardList);
      } catch (error) {
        console.error(error);
      }  
    },
    MyBoardMain() {
      this.$router.push('/board/free');
    },
    movetocontent(BOD_NO) {
      this.$router.push({ path: '/board/free/freeDetail', query: { BOD_NO: BOD_NO } });
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
  }  
};

</script>
  
<style src="../assets/css/global.css" scoped></style>
<style src="../assets/css/board.css" scoped></style>
<style scoped>
.title-btn-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.comp-title {
  font-size: 1.3em;
  font-weight: 600;
}

.post-wrap {
  margin-bottom: 0;
}

.post:last-of-type {
  margin-bottom: 0;
}

.post-title ,
.post-author {
  white-space: nowrap;
  word-break: break-all;
  overflow-x: hidden;
  text-overflow: ellipsis;
}

.post-title {
  max-width: 18dvw;
}
</style>