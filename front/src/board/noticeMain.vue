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
          <input refs="searchInput" v-model="keyword" type="search" placeholder="검색" @keyup.enter="getNoticeList(sortSCase, sortNCase)">
          <div class="erase" v-show="keyword.length > 0" @click="keyword = ''"><i class="fa-solid fa-xmark"></i></div>
        </div>
        <button class="search-btn" type="submit" @click="getNoticeList(sortSCase, sortNCase)"><i class="fa-solid fa-search"></i></button>
      </div>
    </div>
    <div class="sort-wrap" :class="{ active: optionsActive }" >
      <div class="sort-sel" tabindex="0" @click="toggleOptions">
        <span>{{ optionsN }}</span>
        <i class="fa-solid fa-chevron-down arrow-down"></i>
      </div>
      <div class="sort-opt-wrap">
        <div class="sort-opt">
          <div class="option-row" v-for="(option, index) in options" :key="index" :class="{ 'selected': option === sortNCase }" @click="handleClick(option, index, $event)">
            <div class="option">{{ option }}</div>
              <div class="line"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg" @click="toggleOptions"></div>
  </div>
  <div class="post-wrap">
    <div class="post grid-box" v-for="item in pageNoticeList" :key="item.NOT_NO"
    @click=movetocontent(item.NOT_NO)>
      <div class="post-title">{{ item.NOT_TITLE }}</div>
      <div class="post-detail">
        <div class="post-date">{{ formatDateTime(item.NOT_DATE) }}</div>
        <div class="bar"></div>
        <div class="post-view"><i class="fa-regular fa-eye"></i>{{ item.NOT_COUNT }}</div>
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
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      noticeList: [], //현재 게시판과 페이지에 맞는 글 리스트
      sortNCase: 0,
      optionsN: '최근 순',
      options: ['최근 순','오래된 순','조회수 높은 순','조회수 낮은 순'],
      sortSCase: 0,
      soptionsN: '제목',
      soptions: ['제목', '내용', '제목 + 내용'],
      keyword: '',
      pageNoticeList: [],
      pageNum: 0,
      pageCnt: 0,
      onePageCnt: 10, //한페이지에 보여지는 정보 갯수
      optionsActive: false,
      optionsSActive: false,
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
    this.getNoticeList();
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
    setPage(page) {
      this.pageNoticeList = []
      this.pageNum = page - 1;
      this.sliceList()
    },  
    sliceList() {
      const start = 0 + this.pageNum * this.onePageCnt
      this.pageNoticeList = this.noticeList.slice(start, start + this.onePageCnt);
    },
    async getNoticeList(sortSCaseNum, sortNCaseNum) {
      let keyword = 'none'
      if (this.keyword != '') {
        keyword = this.keyword;
      }
      try {
        const response = await axios.get(`http://localhost:3000/board/notice_list/${sortSCaseNum}/${sortNCaseNum}/${keyword}`);
        this.noticeList = response.data;
        console.log(this.noticeList);
        this.pageCnt = Math.ceil(this.noticeList.length / this.onePageCnt)
        this.setPage(1)
      } catch (error) {
        console.error(error);
      }
    },
    sortList(sortNum, event) {
      event.preventDefault();
      if (sortNum == 0) {
        this.sortNCase = 0;
        this.optionsN = "최근 순"
      } else if (sortNum == 1) {
        this.sortNCase = 1;
        this.optionsN = '오래된 순'
      } else if (sortNum == 2) {
        this.sortNCase = 2;
        this.optionsN = '조회수 높은 순'
      } else if (sortNum == 3) {
        this.sortNCase = 3
        this.optionsN = '조회수 낮은 순'
      }
      this.getNoticeList(this.sortSCase, this.sortNCase);
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
      }
      this.getNoticeList(this.sortSCase, this.sortNCase)
    },
      movetocontent(NOT_NO) {
      window.location.href = window.location.pathname + '/noticeDetail?NOT_NO=' + NOT_NO
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
      this.sortNCase = item;
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
  }  
};

</script>
  
<style src="../assets/css/global.css" scoped></style>
<style src="../assets/css/board.css" scoped></style>