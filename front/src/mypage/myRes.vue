<template>
  <div class="title-btn-wrap">
    <div class="grid-title"><i class="fa-solid fa-chair"></i> 최신 예약 현황</div>
    <div class="btn-text" @click="MyResMain">전체 예약 보기 <i class="fa-solid fa-chevron-right"></i></div>
  </div>
  <div class="res-content-wrap">
    <div class="sub-title">이용 중</div>
    <div class="grid-box" v-for="item in filteredItems1" :key="item.RES_NO">
      {{ item.STR_FLOOR }}층 {{ item.RES_STR_ROOM }}룸 좌석 {{ item.SEAT_NUMBER }}
    </div>
    <div class="sub-title">이용 완료</div>
    <div class="grid-box" v-for="item1 in filteredItems2" :key="item1.RES_NO">
      {{ item1.STR_FLOOR }}층 {{ item1.RES_STR_ROOM }}룸 좌석 {{ item1.SEAT_NUMBER }}
    </div>
  </div>
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      myResList: [], //게시판 글 리스트로 불러오기
    }
  },
  computed: {
    user() {
      return this.$store.state.user; // 로그인 확인
    },
    filteredItems1() {
      const currentDate = new Date();
      const filteredItems = this.myResList.filter(item => {
        // item.RES_DATE를 Date 객체로 변환하여 비교
        const resDate = new Date(item.RES_DATE);
        return resDate >= currentDate;
        }).slice(0, 2);
        return filteredItems;
    },
    filteredItems2() {
      const currentDate = new Date();
      const filteredItems = this.myResList.filter(item => {
        // item.RES_DATE를 Date 객체로 변환하여 비교
        const resDate = new Date(item.RES_DATE);
        return resDate < currentDate;
      }).slice(0, 2);
      return filteredItems;
    }
  },
  created() {
    this.getMyResList();
  },
  methods: {
    async getMyResList() {
      try {
        const response = await axios.get(`http://localhost:3000/mypage/my_res_list/${this.user.user_no}`);
        this.myResList = response.data;
        console.log(this.myResList);
      } catch (error) {
        console.error(error);
      }
    },
    MyResMain() {
      this.$router.push('/mypage/resList');
    },
    formatDateTime(dateTime) {
      const today = new Date();
      const date = new Date(dateTime);
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      const formattedDateTime = date.toLocaleDateString("ko-KR", options).replace(/\.$/, '');
      
      return formattedDateTime;
      
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
  align-items: flex-start;
  margin-bottom: 20px;
}

.grid-title {
  font-size: 1.3em;
  font-weight: 600;
}

.grid-title i {
  color: var(--color-main);
}

.res-content-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sub-title {
  font-weight: 600;
  color: var(--color-main);
}
</style>