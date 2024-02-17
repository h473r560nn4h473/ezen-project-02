<template>
  <div class="search-sort-wrap">
    <div class="search-cond">
      <div class="sort-wrap" :class="{ active: optionsSActive }" >
        <div class="sort-sel" tabindex="0" @click="toggleSOptions">
          <span>{{ soptionsN }}</span>
          <i class="fa-solid fa-chevron-down arrow-down"></i>
        </div>
        <div class="sort-opt-wrap">
          <div class="sort-opt">
            <div class="option-row" v-for="(soption, index) in soptions" :key="index" :class="{ 'selected': soption === sortSCase }" @click="handleSClick(soption, index, $event)">
              <div class="option">{{ soption }}</div>
              <div class="line"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg" @click="toggleSOptions"></div>
      <div class="search-wrap">
        <div class="search-input">
          <input refs="searchInput" v-model="keyword" type="search" placeholder="검색" @keyup.enter="getLostList(sortCCase, sortSCase, sortLCase)">
          <div class="erase" v-show="keyword.length > 0" @click="keyword = ''"><i class="fa-solid fa-xmark"></i></div>
        </div>
        <button class="search-btn" type="submit" @click="getLostList(sortCCase, sortSCase, sortLCase)"><i class="fa-solid fa-search"></i></button>
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
    <div class="bg" @click="toggleCOptions"></div>
    <div class="sort-wrap" :class="{ active: optionsActive }" >
      <div class="sort-sel" tabindex="0" @click="toggleOptions">
        <span>{{ optionsN }}</span>
        <i class="fa-solid fa-chevron-down arrow-down"></i>
      </div>
      <div class="sort-opt-wrap">
        <div class="sort-opt">
          <div class="option-row" v-for="(option, index) in options" :key="index" :class="{ 'selected': option === sortLCase }" @click="handleClick(option, index, $event)">
            <div class="option">{{ option }}</div>
            <div class="line"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg" @click="toggleOptions"></div>   
  </div>    
  <div class="post-wrap">
    <div class="post grid-box" v-for="item in pageLostList" :key="item.LOST_NO"
    @click=movetocontent(item.LOST_NO)>
      <!-- <span>{{ item.BOD_NO }}</span> 글번호 -->
      <div class="post-title">{{ item.LOST_TITLE }}</div>
      <div class="post-detail">
        <div class="profile-pic">
          <img v-if="item.USER_IMG" :src="require('../../../back/uploads/uploadUser/' + `${item.USER_IMG}`)" alt="">
          <i v-else class="fa-solid fa-user"></i> 
        </div>
        <div class="post-author">{{ item.USER_NICK }}</div>
        <div class="bar"></div>
        <div class="post-date">{{ formatDateTime(item.LOST_DATE) }}</div>
        <div class="bar"></div>
        <div class="post-view"><i class="fa-regular fa-eye"></i>{{ item.LOST_COUNT }}</div>
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
        <button v-if="user.user_id == ''" class="btn-small" @click="login">작성</button>
        <button v-else class="btn-small" @click="write_lost">작성</button>
      </div>
</template>
  
<script>
import axios from 'axios';


export default {
  data() {
    return {
      lostList: [], //현재 게시판과 페이지에 맞는 글 리스트
      sortLCase: 0,
      optionsN: '최근 순',
      options: ['최근 순','오래된 순','조회수 높은 순','조회수 낮은 순'],
      sortSCase: 0,
      soptionsN: '제목',
      soptions: ['제목', '내용', '제목 + 내용', '닉네임'],
      sortCCase: 0,
      coptionsN: '전체',
      coptions: ['전체', '주웠음', '잃음'],
      keyword: '',
      pageLostList: [],
      pageNum: 0,
      pageCnt: 0,
      onePageCnt: 4, //한페이지에 보여지는 정보 갯수
      optionsActive: false,
      optionsSActive: false,
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
    this.getLostList();
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
    handleSClick(soption, param, event) {
      this.handleSSelect(soption);
      this.sortSList(param, event);
    },
    handleCClick(coption, param, event) {
      this.handleCSelect(coption);
      this.sortCList(param, event);
    },
    setPage(page) {
      this.pageLostList = []
      this.pageNum = page - 1;
      this.sliceList()
    },  
    sliceList() {
      const start = 0 + this.pageNum * this.onePageCnt
      this.pageLostList = this.lostList.slice(start, start + this.onePageCnt);
    },
    async getLostList(sortCCaseNum, sortSCaseNum, sortLCaseNum) {
      let keyword = 'none'
      if (this.keyword != '') {
        keyword = this.keyword;
      }
      try {
        const response = await axios.get(`http://localhost:3000/lost/lost_list/${sortCCaseNum}/${sortSCaseNum}/${sortLCaseNum}/${keyword}`);
        this.lostList = response.data;
        console.log(this.lostList);
        this.pageCnt = Math.ceil(this.lostList.length / this.onePageCnt)
        this.setPage(1)
      } catch (error) {
        console.error(error);
      }
    },
    sortList(sortNum, event) {
      event.preventDefault();
      if (sortNum == 0) {
        this.sortLCase = 0;
        this.optionsN = '최근 순'
      } else if (sortNum == 1) {
        this.sortLCase = 1;
        this.optionsN = '오래된 순'
      } else if (sortNum == 2) {
        this.sortLCase = 2
        this.optionsN = '조회수 높은 순'
      } else if (sortNum == 3) {
        this.sortLCase = 3
        this.optionsN = '조회수 낮은 순'
      }
      this.getLostList(this.sortCCase, this.sortSCase, this.sortLCase)
    },
    sortSList(sortNum, event) {
      event.preventDefault();
      if (sortNum == 0) {
        this.sortSCase = 0
        this.soptionsN = '제목'
      } else if (sortNum == 1) {
        this.sortSCase = 1
        this.soptionsN = '내용'
      } else if (sortNum == 2) {
        this.sortSCase = 2
        this.soptionsN = '제목 + 내용'
      } else if (sortNum == 3) {
        this.sortSCase = 3
        this.soptionsN = '닉네임'
      }
      this.getLostList(this.sortCCase, this.sortSCase, this.sortLCase)
    },
    sortCList(sortNum, event) {
      event.preventDefault();
      if (sortNum == 0) {
        this.sortCCase = 0
        this.coptionsN = '전체'
      } else if (sortNum == 1) {
        this.sortCCase = 1
        this.coptionsN = '찾음'
      } else if (sortNum == 2) {
        this.sortCCase = 2
        this.coptionsN = '잃음'
      } 
      this.getLostList(this.sortCCase, this.sortSCase, this.sortLCase)
    },
    write_lost() {
      this.$router.push({ path: '/board/boardwrite' });
    },
    login() {
      this.$swal({
        title: '로그인 하신 후에 작성하실 수 있습니다.',
        showConfirmButton: true,
      })
      .then(() => {
          window.location.href = "http://localhost:8080";
      })
    },
      movetocontent(LOST_NO) {
      window.location.href = window.location.pathname + '/lostDetail?LOST_NO=' + LOST_NO
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
    handleSelect(item) {
      this.sortLCase = item;
      this.optionsActive = false;
    },
    toggleOptions() {
      this.optionsActive = !this.optionsActive;
    },  
    handleSSelect(item) {
      this.sortSCase = item;
      this.optionsSActive = false;
    },
    toggleSOptions() {
      this.optionsSActive = !this.optionsSActive;
    },
    handleCSelect(item) {
      this.sortCCase = item;
      this.optionsCActive = false;
    },
    toggleCOptions() {
      this.optionsCActive = !this.optionsCActive;
    },
  }  
};

</script>
  
<style src="../assets/css/global.css" scoped></style>
<style src="../assets/css/board.css" scoped></style>