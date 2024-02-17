<template>
  <div class="search-sort-wrap">
    <div class="search-cond">
      <div class="bg" @click="toggleSOptions"></div>
      <div class="search-wrap">
        <div class="search-input">
          <input refs="searchInput" v-model="keyword" type="search" placeholder="자습실 검색" @keyup.enter="getAnonList(sortCCase, sortRLCase)">
          <div class="erase" v-show="keyword.length > 0" @click="keyword = ''"><i class="fa-solid fa-xmark"></i></div>
        </div>
        <button class="search-btn" type="submit" @click="getAnonList(sortCCase, sortRLCase)"><i class="fa-solid fa-search"></i></button>
      </div>
    </div>
    <div class="sort-wrap" :class="{ active: optionsCActive }" >
      <div class="sort-sel" tabindex="0" @click="toggleCOptions">
        <span>{{ coptionsN }}</span>
        <i class="fa-solid fa-chevron-down arrow-down"></i>
      </div>
      <div class="sort-opt-wrap">
        <div class="sort-opt">
          <div class="option-row" v-for="(coption, index) in coptions" :key="index" :class="{ 'selected': coption === sortCCase }" @click="handleCClick(coption, index, $event)">
            <div class="option">{{ coption }}</div>
            <div class="line"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="sort-wrap" :class="{ active: optionsActive }" >
      <div class="sort-sel" tabindex="0" @click="toggleOptions">
        <span>{{ optionsN }}</span>
        <i class="fa-solid fa-chevron-down arrow-down"></i>
      </div>
      <div class="sort-opt-wrap">
        <div class="sort-opt">
          <div class="option-row" v-for="(option, index) in options" :key="index" :class="{ 'selected': option === sortRLCase }" @click="handleClick(option, index, $event)">
            <div class="option">{{ option }}</div>
            <div class="line"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg" @click="toggleOptions"></div>
  </div>
    <div class="post-wrap">
      <div class="post grid-box" v-for="item in pageResList" :key="item.RES_NO">
        <div class="post-title">{{ item.STR_FLOOR }}층</div>
        <div class="post-detail">
          <div class="post-room">{{ item.RES_STR_ROOM }}룸</div>
          <div class="bar"></div>
          <div class="post-seat">좌석번호 : {{ item.SEAT_NUMBER }}</div>
          <div class="bar"></div>
          <div class="post-date">{{ formatDateTime(item.RES_DATE) }}</div>
          <div class="bar"></div>
          <div class="post-time">{{ item.RES_TIME }}</div>
          <button v-if="comparedDate()" type="button" @click="deleteRes(item.RES_NO)" class="btn_right btn-small btn-red">취소</button>
          <button v-else type="button" @click="deleteRes(item.RES_NO)"  class="btn_right btn-small btn-red">삭제</button>
        </div>
      </div>
    </div>
    <!-- 페이징  -->
    <nav class="pagination">
      <div class="btn-small btn-prev" @click="prevBlock" v-if="blockNum > 1">
        <span>이전</span>
      </div>
      <ul v-for="i in pageBlock" :key="i">
        <li v-if="i !== pageNum + 1" @click="setPage(i)" :class="{ active: i === pageNum + 1 }">
          <span>{{ i }}</span>
        </li>
        <li v-else :class="{ active: i === pageNum + 1 }">
          <span>{{ i }}</span>
        </li>
      </ul>
      <div class="btn-small btn-next" @click="nextBlock" v-if="blockNum < totalBlocks">
        <span>다음</span>
      </div>
    </nav>
    <div class="btn-area">
      <button class="btn-small" @click="goToRes">예약하기</button>
    </div> 
</template>


<script>
import axios from 'axios';


export default {
data() {
return {
  resList: [], //현재 게시판과 페이지에 맞는 글 리스트
  sortRLCase: 0,
  optionsN: '최근 순',
  options: ['최근 순','오래된 순'],
  sortCCase: 0,
  coptionsN: '전체',
  coptions: ['전체', '이용 중', '이용완료'],
  keyword: '',
  pageResList: [],
  pageNum: 0,
  pageCnt: 0,
  onePageCnt: 5, //한페이지에 보여지는 정보 갯수
  optionsActive: false,
  optionsCActive: false,
  blockSize: 10,
}
},
computed: {
  user() {
      return this.$store.state.user; // 로그인 확인
  },
  totalBlocks() {
    return Math.ceil(this.pageCnt / this.blockSize);
  },
  blockNum() {
    return Math.ceil((this.pageNum + 1) / this.blockSize);
  },
  pageBlock() {
    const start = (this.blockNum - 1) * this.blockSize + 1;
    const end = Math.min(this.pageCnt, this.blockNum * this.blockSize);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  },
},
created() {
this.getResList();
},
methods: {
  prevBlock() {
    if (this.blockNum > 1) {
      this.setPage((this.blockNum - 2) * this.blockSize + this.blockSize);
    }
  },
  nextBlock() {
    if (this.blockNum < this.totalBlocks) {
      this.setPage(this.blockNum * this.blockSize + 1);
    }
  },
  handleClick(option, param, event) {
    this.handleSelect(option);
    this.sortList(param, event);
  },
  handleCClick(coption, param, event) {
      this.handleCSelect(coption);
      this.sortCList(param, event);
    },
  setPage(page) {
    this.pageResList = []
    this.pageNum = page - 1;
    this.sliceList()
  },  
  sliceList() {
    const start = 0 + this.pageNum * this.onePageCnt
    this.pageResList = this.resList.slice(start, start + this.onePageCnt);
  },
  async getResList(sortCCaseNum, sortRLCaseNum) {
    let keyword = 'none'
    if (this.keyword != '') {
      keyword = this.keyword;
    }
    try {
      const response = await axios.get(`http://localhost:3000/mypage/res_list/${sortCCaseNum}/${sortRLCaseNum}/${keyword}/${this.user.user_no}`);
      this.resList = response.data;
      console.log(this.resList);
      this.pageCnt = Math.ceil(this.resList.length / this.onePageCnt)
      this.setPage(1);
    } catch (error) {
      console.error(error);
    }
  },
  sortList(sortNum, event) {
    event.preventDefault();
    if (sortNum == 0) {
        this.sortRLCase = 0;
        this.optionsN = '최근 순'
    } else if (sortNum == 1) {
        this.sortRLCase = 1;
        this.optionsN = '오래된 순'
    } 
    this.getResList(this.sortCCase, this.sortRLCase)
  },
  sortCList(sortNum, event) {
      event.preventDefault();
      if (sortNum == 0) {
        this.sortCCase = 0
        this.coptionsN = '전체'
      } else if (sortNum == 1) {
        this.sortCCase = 1
        this.coptionsN = '이용 중'
      } else if (sortNum == 2) {
        this.sortCCase = 2
        this.coptionsN = '이용완료'
      } 
      this.getResList(this.sortCCase, this.sortRLCase)
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
  goToRes() {
    this.$router.push({ path: '/res' });
  },
  handleSelect(item) {
    this.sortRLCase = item;
    this.optionsActive = false;
  },
  toggleOptions() {
    this.optionsActive = !this.optionsActive;
  },  
  handleCSelect(item) {
      this.sortCCase = item;
      this.optionsCActive = false;
  },
  toggleCOptions() {
      this.optionsCActive = !this.optionsCActive;
  },
  comparedDate() {
      const currentDate = new Date();
      const filteredItems = this.resList.filter(item => {
        // item.RES_DATE를 Date 객체로 변환하여 비교
        const resDate = new Date(item.RES_DATE);
        return resDate >= currentDate;
        });
  },
  deleteRes(RES_NO) {
    this.$swal({
        title: `예약을 취소하시겠습니까?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
      }).then(result => {
        if(result.value) {
          this.deleteMyRes(RES_NO); 
        }
      });
  },
  deleteMyRes(RES_NO) {
      axios({
        url: "http://localhost:3000/mypage/deleteRes", //board.js에 있는 deletecontent 실행
        method: "POST",
        data: {
          res_no: RES_NO
        },
      }).then(res => {
        if(res.data.message == 'success') {
          this.$swal({
            icon: 'success',
            title: '삭제되었습니다.',
            showConfirmButton: false,
            timer: 1500
          })
          this.$router.go(0);
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
}  
};

</script>

<style src="../assets/css/global.css" scoped></style>
<style src="../assets/css/board.css" scoped></style>
<style scoped>
.grid-box {
  cursor: default;
}

.grid-box:hover {
  transform: none;
}

.post .post-detail {
  font-size: 0.9em;
  display: flex;
  justify-content: space-between; /* 변경된 부분 */
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}


.post .post-detail button {
  margin-left: auto; /* 변경된 부분 */
}
</style>