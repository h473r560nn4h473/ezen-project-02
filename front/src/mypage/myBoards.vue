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
          <input refs="searchInput" v-model="keyword" type="search" placeholder="검색" @keyup.enter="getMyList(sortTCase, sortSCase, sortMCase)">
          <div class="erase" v-show="keyword.length > 0" @click="keyword = ''"><i class="fa-solid fa-xmark"></i></div>
        </div>
        <button class="search-btn" type="submit" @click="getMyList(sortTCase, sortSCase, sortMCase)"><i class="fa-solid fa-search"></i></button>
      </div>
    </div> 
    <div class="sort-wrap" :class="{ active: optionsTActive }" >
      <div class="sort-sel" tabindex="0" @click="toggleToptions">
        <span>{{ toptionsN }}</span>
        <i class="fa-solid fa-chevron-down arrow-down"></i>
      </div>
      <div class="sort-opt-wrap">
        <div class="sort-opt">
          <div class="option-row" v-for="(toption, index) in toptions" :key="index" :class="{ 'selected': toption === sortTCase }" @click="handleTClick(toption, index, $event)">
            <div class="option">{{ toption }}</div>
            <div class="line"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg" @click="toggleToptions"></div>
    <div class="sort-wrap" :class="{ active: optionsActive }" >
      <div class="sort-sel" tabindex="0" @click="toggleOptions">
        <span>{{ optionsN }}</span>
        <i class="fa-solid fa-chevron-down arrow-down"></i>
      </div>
      <div class="sort-opt-wrap">
        <div class="sort-opt">
          <div class="option-row" v-for="(option, index) in options" :key="index" :class="{ 'selected': option === sortMCase }" @click="handleClick(option, index, $event)">
            <div class="option">{{ option }}</div>
            <div class="line"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg" @click="toggleOptions"></div>   
  </div>    
  <div class="post-wrap" v-if="sortTCase == 0">
    <div class="post grid-box" v-for="item in pageMyList1" :key="item.BOD_NO"
    @click=movetocontentB(item.BOD_NO)>
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
    <div class="post grid-box" v-for="item2 in pageMyList2" :key="item2.ANO_NO"
    @click=movetocontentA(item2.ANO_NO)>
      <div class="post-title">{{ item2.ANO_TITLE }}</div>
      <div class="post-detail">
        <div class="post-author">익명{{ item2.ANO_NO }}</div>
        <div class="bar"></div>
        <div class="post-view"><i class="fa-regular fa-eye"></i>{{ item2.ANO_LIKE }}</div>
        <div class="bar"></div>
        <div class="post-view"><i class="fa-regular fa-eye"></i>{{ item2.ANO_COUNT }}</div>
        <div class="bar"></div>
        <div class="post-date">{{ formatDateTime(item2.ANO_DATE) }}</div>
      </div>
    </div>
    <div class="post grid-box" v-for="item3 in pageMyList3" :key="item3.REP_NO"
    @click=movetocontentR(item3.REP_NO)>
      <div class="post-title">{{ item3.REP_TITLE }}</div>
      <div class="post-detail">
        <div class="profile-pic">
          <img v-if="item3.USER_IMG" :src="require('../../../back/uploads/uploadUser/' + `${item3.USER_IMG}`)" alt="">
          <i v-else class="fa-solid fa-user"></i> 
        </div>
        <div class="post-author">{{ item3.USER_NICK }}</div>
        <div class="bar"></div>
        <div class="post-date">{{ formatDateTime(item3.REP_DATE) }}</div>
        <div class="bar"></div>
        <div class="post-view"><i class="fa-regular fa-eye"></i>{{ item3.REP_COUNT }}</div>
      </div>
    </div>
    <div class="post grid-box" v-for="item4 in pageMyList4" :key="item4.LOST_NO"
    @click=movetocontentL(item4.LOST_NO)>
      <div class="post-title">{{ item4.LOST_TITLE }}</div>
      <div class="post-detail">
        <div class="profile-pic">
          <img v-if="item4.USER_IMG" :src="require('../../../back/uploads/uploadUser/' + `${item4.USER_IMG}`)" alt="">
          <i v-else class="fa-solid fa-user"></i> 
        </div>
        <div class="post-author">{{ item4.USER_NICK }}</div>
        <div class="bar"></div>
        <div class="post-date">{{ formatDateTime(item4.LOST_DATE) }}</div>
        <div class="bar"></div>
        <div class="post-view"><i class="fa-regular fa-eye"></i>{{ item4.LOST_COUNT }}</div>
      </div>
    </div>
  </div>
  <div class="post-wrap" v-if="sortTCase == 1">
    <div class="post grid-box" v-for="item in pageMyList1" :key="item.BOD_NO"
    @click=movetocontentB(item.BOD_NO)>
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
  <div class="post-wrap" v-else-if="sortTCase == 2">
    <div class="post grid-box" v-for="item2 in pageMyList2" :key="item2.ANO_NO"
    @click=movetocontentA(item2.ANO_NO)>
      <div class="post-title">{{ item2.ANO_TITLE }}</div>
      <div class="post-detail">
        <div class="post-author">익명{{ item2.ANO_NO }}</div>
        <div class="bar"></div>
        <div class="post-view"><i class="fa-regular fa-eye"></i>{{ item2.ANO_LIKE }}</div>
        <div class="bar"></div>
        <div class="post-view"><i class="fa-regular fa-eye"></i>{{ item2.ANO_COUNT }}</div>
        <div class="bar"></div>
        <div class="post-date">{{ formatDateTime(item2.ANO_DATE) }}</div>
      </div>
    </div>
  </div>
  <div class="post-wrap" v-else-if="sortTCase == 3">
    <div class="post grid-box" v-for="item3 in pageMyList3" :key="item3.REP_NO"
    @click=movetocontentR(item3.REP_NO)>
      <div class="post-title">{{ item3.REP_TITLE }}</div>
      <div class="post-detail">
        <div class="profile-pic">
          <img v-if="item3.USER_IMG" :src="require('../../../back/uploads/uploadUser/' + `${item3.USER_IMG}`)" alt="">
          <i v-else class="fa-solid fa-user"></i> 
        </div>
        <div class="post-author">{{ item3.USER_NICK }}</div>
        <div class="bar"></div>
        <div class="post-date">{{ formatDateTime(item3.REP_DATE) }}</div>
        <div class="bar"></div>
        <div class="post-view"><i class="fa-regular fa-eye"></i>{{ item3.REP_COUNT }}</div>
      </div>
    </div>
  </div>
  <div class="post-wrap" v-else-if="sortTCase == 4">
    <div class="post grid-box" v-for="item4 in pageMyList4" :key="item4.LOST_NO"
    @click=movetocontentL(item4.LOST_NO)>
      <div class="post-title">{{ item4.LOST_TITLE }}</div>
      <div class="post-detail">
        <div class="profile-pic">
          <img v-if="item4.USER_IMG" :src="require('../../../back/uploads/uploadUser/' + `${item4.USER_IMG}`)" alt="">
          <i v-else class="fa-solid fa-user"></i> 
        </div>
        <div class="post-author">{{ item4.USER_NICK }}</div>
        <div class="bar"></div>
        <div class="post-date">{{ formatDateTime(item4.LOST_DATE) }}</div>
        <div class="bar"></div>
        <div class="post-view"><i class="fa-regular fa-eye"></i>{{ item4.LOST_COUNT }}</div>
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
        <button class="btn-small" @click="write_board">작성</button>
      </div>
</template>
  
<script>
import axios from 'axios';


export default {
  data() {
    return {
      myList1: [], //현재 게시판과 페이지에 맞는 글 리스트
      myList2: [],
      myList3: [],
      myList4: [],
      sortMCase: 0,
      optionsN: '최근 순',
      options: ['최근 순','오래된 순','조회수 높은 순','조회수 낮은 순'],
      sortSCase: 0,
      soptionsN: '제목',
      soptions: ['제목', '내용', '제목 + 내용'],
      sortTCase: 0,
      toptionsN: '전체',
      toptions: ['전체', '자유', '익명', '신고', '분실물'],
      keyword: '',
      pageMyList1: [],
      pageMyList2: [],
      pageMyList3: [],
      pageMyList4: [],
      pageNum: 0,
      pageCnt: 0,
      onePageCnt: 4, //한페이지에 보여지는 정보 갯수
      optionsActive: false,
      optionsSActive: false,
      optionsTActive: false,
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
    this.getMyList(this.sortTCase, this.sortSCase, this.sortMCase);
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
    handleTClick(toption, param, event) {
      this.handleTSelect(toption);
      this.sortTList(param, event);
    },
    setPage(page, Tnum) {
      if (Tnum >= 0 && Tnum <= 4) {
        this[`pageMyList${Tnum}`] = [];
        this.pageNum = page - 1;
        this.sliceList();
      }
    },  
    sliceList() {
      const start = 0 + this.pageNum * this.onePageCnt;
      this.pageMyList1 = this.myList1.slice(start, start + this.onePageCnt);
      this.pageMyList2 = this.myList2.slice(start, start + this.onePageCnt);
      this.pageMyList3 = this.myList3.slice(start, start + this.onePageCnt);
      this.pageMyList4 = this.myList4.slice(start, start + this.onePageCnt);
    },
    async getMyList(sortTCaseNum, sortSCaseNum, sortMCaseNum) {
      let keyword = 'none'
      if (this.keyword != '') {
        keyword = this.keyword;
      }
      try {
        const response = await axios.post(`http://localhost:3000/mypage/my_board_list`, {
          sortTCaseNum,
          sortSCaseNum,
          sortMCaseNum,
          keyword,
          userNo: this.user.user_no
        }) 

          if ( sortTCaseNum == 0 ) {
            this.myList1 = response.data.result1;
            this.myList2 = response.data.result2;
            this.myList3 = response.data.result3;
            this.myList4 = response.data.result4;
          
            //console.log(this.myList2);
            this.pageCnt = Math.ceil((this.myList1.length + this.myList2.length + this.myList3.length + this.myList4.length) / this.onePageCnt)
            this.setPage(1, 0)
          } else if ( sortTCaseNum == 1 ) {
            this.myList1 = response.data.result1;
            this.pageCnt = Math.ceil(this.myList1.length / this.onePageCnt)
            this.setPage(1, 1)
          } else if ( sortTCaseNum == 2 ) {
            this.myList2 = response.data.result2;
            this.pageCnt = Math.ceil(this.myList2.length / this.onePageCnt)
            this.setPage(1, 2)
          } else if ( sortTCaseNum == 3 ) {
            this.myList3 = response.data.result3;
            this.pageCnt = Math.ceil(this.myList3.length / this.onePageCnt)
            this.setPage(1, 3)
          } else {
            this.myList4 = response.data.result4;
            this.pageCnt = Math.ceil(this.myList4.length / this.onePageCnt)
            this.setPage(1, 4)
          }
      } catch (error) {
        console.error(error);
      }
    },
    sortList(sortNum, event) {
      event.preventDefault();
      if (sortNum == 0) {
        this.sortMCase = 0;
        this.optionsN = '최근 순'
      } else if (sortNum == 1) {
        this.sortMCase = 1;
        this.optionsN = '오래된 순'
      } else if (sortNum == 2) {
        this.sortMCase = 2
        this.optionsN = '조회수 높은 순'
      } else if (sortNum == 3) {
        this.sortMCase = 3
        this.optionsN = '조회수 낮은 순'
      }
      this.getMyList(this.sortTCase, this.sortSCase, this.sortMCase)
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
      this.getMyList(this.sortTCase, this.sortSCase, this.sortMCase)
    },
    sortTList(sortNum, event) {
      event.preventDefault();
      if (sortNum == 0) {
        this.sortTCase = 0
        this.toptionsN = '전체'
      } else if (sortNum == 1) {
        this.sortTCase = 1
        this.toptionsN = '자유'
      } else if (sortNum == 2) {
        this.sortTCase = 2
        this.toptionsN = '익명'
      } else if (sortNum == 3) {
        this.sortTCase = 3
        this.toptionsN = '신고'
      } else if (sortNum == 4) {
        this.sortTCase = 4
        this.toptionsN = '분실물'
      } 
      this.getMyList(this.sortTCase, this.sortSCase, this.sortMCase)
    },
    write_board() {
      this.$router.push({ path: '/board/boardwrite' });
    },
    movetocontentB(BOD_NO) {
        this.$router.push({ path: '/board/free/freeDetail', query: { BOD_NO: BOD_NO } });
    },
    movetocontentL(LOST_NO) {
      this.$router.push({ path: '/board/lost/lostDetail', query: { LOST_NO: LOST_NO } });
    },
    movetocontentR(REP_NO) {
      this.$router.push({ path: '/board/report/reportDetail', query: { REP_NO: REP_NO } });
    },
    movetocontentA(ANO_NO) {
      this.$router.push({ path: '/board/anon/anonDetail', query: { ANO_NO: ANO_NO } });
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
      this.sortMCase = item;
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
    handleTSelect(item) {
      this.sortTCase = item;
      this.optionsTActive = false;
    },
    toggleToptions() {
      this.optionsTActive = !this.optionsTActive;
    },
  }  
};

</script>
  
<style src="../assets/css/global.css" scoped></style>
<style src="../assets/css/board.css" scoped></style>