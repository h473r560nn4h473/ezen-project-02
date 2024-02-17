<template>
  <main>
    <div class="board-wrap">
        <h1 class="title">공지사항</h1>
        <div class="theme-wrap">
          <div class="theme active" @click="goToNotice()">공지사항</div>
          <div class="bar"></div>
          <div class="theme" @click="goToFree()">자유</div>
          <div class="bar"></div>
          <div class="theme" @click="goToAnon()">익명</div>
          <div class="bar"></div>
          <div class="theme" @click="goToReport()">신고</div>
          <div class="bar"></div>
          <div class="theme" @click="goToLost()">분실물</div>
        </div>
      <div class="search-sort-wrap">
        <div class="search-cond">
          <div class="sort-wrap" :class="{ active: optionsSActive }">
            <div class="sort-sel" tabindex="0" @click="toggleSOptions">
              <span>{{ soptionsN }}</span>
              <i class="fa-solid fa-chevron-down arrow-down"></i>
            </div>
            <div class="sort-opt-wrap">
              <div class="sort-opt">
                <div class="option-row" v-for="(soption, index) in soptions" :key="index"
                  :class="{ 'selected': soption === sortSCase }" @click="handleSClick(soption, index, $event)">
                  <div class="option">{{ soption }}</div>
                  <div class="line"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg" @click="toggleSOptions"></div>
          <div class="search-wrap">
            <div class="search-input">
              <input refs="searchInput" v-model="keyword" type="search" placeholder="검색"
                @keyup.enter="getNoticeList(sortSCase, sortNCase)">
              <div class="erase" v-show="keyword.length > 0" @click="keyword = ''"><i class="fa-solid fa-xmark"></i></div>
            </div>
            <button class="search-btn" type="submit" @click="getNoticeList(sortSCase, sortNCase)"><i
                class="fa-solid fa-search"></i></button>
          </div>
        </div>
        <div class="sort-wrap" :class="{ active: optionsActive }">
          <div class="sort-sel" tabindex="0" @click="toggleOptions">
            <span>{{ optionsN }}</span>
            <i class="fa-solid fa-chevron-down arrow-down"></i>
          </div>
          <div class="sort-opt-wrap">
            <div class="sort-opt">
              <div class="option-row" v-for="(option, index) in options" :key="index"
                :class="{ 'selected': option === sortNCase }" @click="handleClick(option, index, $event)">
                <div class="option">{{ option }}</div>
                <div class="line"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg" @click="toggleOptions"></div>
      </div>
      <div class="post-wrap">
        <button class="btn-small btn-red" @click="deleteSelectedPosts">선택 삭제</button>
        <button class="btn-small btn-blue" @click="showModal()">작성</button>
        <table  class="table">
          <thead>
            <tr>
              <th><input type="checkbox" class="allCheck" :checked="isAllChecked" @click="checkAll"></th>
              <th>글번호</th>
              <th>제목</th>
              <th>내용</th>
              <th>작성일</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in pagePostList" :key="index">
              <td><input type="checkbox" class="check" :value="item.NOT_NO" v-model="checkedPosts"></td>
              <td @click=movetocontent(item.NOT_NO)>{{ item.NOT_NO }}</td>
              <td>{{ item.NOT_TITLE }}</td>
              <td>{{ cutTheContent(item.NOT_CONTENT,10) }}</td>
              <td>{{ formatDateTime(item.NOT_DATE) }}</td>
              <td>{{ item.NOT_COUNT }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="showModalFlag" class="modal">
          <div class="bg" @click="closeModal"></div>
          <div class="modal-mask">
            <div class="modal-wrapper">
              <div class="modal-container">
                <div class="modal-header title">
                  <i class="fa-sharp fa-regular fa-pen-to-square"></i>
                  <h3>공지사항 작성</h3>
                </div>
                <div class="modal-body">
                  <table class="table">
                    <tbody>
                      <tr class="notice-title">
                        <th>제목</th>
                        <td colspan="3">
                          <input type="text" v-model="noticeTitle" />
                        </td>
                      </tr>
                      <tr class="notice-description">
                        <th>내용</th>
                        <td colspan="3">
                          <textarea ref="textarea" type="text" v-model="noticeContent" @keydown="autoResize()" rows="3" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="modal-footer">
                  <button class="btn-small btn-blue" @click="writeNotice">작성</button>
                  <button class="btn-small btn-red" @click="closeModal">취소</button>
                </div>
              </div>
            </div>
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
    </div>
  </main>
</template>
  
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      postList: [], //현재 게시판과 페이지에 맞는 글 리스트
      showModalFlag: false,
      sortNCase: 0,
      optionsN: '최근 작성 순',
      options: ['최근 작성 순', '오래전 작성 순', '조회수 높은 순', '조회수 낮은 순'],
      sortSCase: 0,
      soptionsN: '글 번호',
      soptions: ['글 번호', '글 제목', '글 내용'],
      keyword: '',
      pagePostList: [],
      checkedPosts: [],
      noticeTitle: '',
      noticeContent: '',
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
    isAllChecked() {
      return this.checkedPosts.length === this.pagePostList.length;
    }
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
      this.pagePostList = []
      this.pageNum = page - 1;
      this.sliceList()
    },
    sliceList() {
      const start = 0 + this.pageNum * this.onePageCnt
      this.pagePostList = this.postList.slice(start, start + this.onePageCnt);
    },
    showModal() {
      this.showModalFlag = true;
    },
    closeModal() {
      this.showModalFlag = false;
    },
    async getNoticeList(sortSCaseNum, sortNCaseNum) {
      let keyword = 'none'
      if (this.keyword != '') {
        keyword = this.keyword;
      }
      try {
        const response = await axios.get(`http://localhost:3000/admin/noticelist/${sortSCaseNum}/${sortNCaseNum}/${keyword}`);
        this.postList = response.data;
        console.log(this.postList);
        this.pageCnt = Math.ceil(this.postList.length / this.onePageCnt);
        this.setPage(1);
      } catch (error) {
        console.error(error);
      }
    },
    sortList(sortNum, event) {
      event.preventDefault();
      if (sortNum == 0) {
        this.sortNCase = 0;
        this.optionsN = '최근 작성 순'
      } else if (sortNum == 1) {
        this.sortNCase = 1;
        this.optionsN = '오래전 작성 순'
      } else if (sortNum == 2) {
        this.sortNCase = 2
        this.optionsN = '조회수 높은 순'
      } else if (sortNum == 3) {
        this.sortNCase = 3
        this.optionsN = '조회수 낮은 순'
      }
      this.getNoticeList(this.sortSCase, this.sortNCase)
    },
    sortSList(sortNum, event) {
      event.preventDefault();
      if (sortNum == 0) {
        this.sortSCase = 0
        this.soptionsN = '글 번호'
      } else if (sortNum == 1) {
        this.sortSCase = 1
        this.soptionsN = '글 제목'
      } else if (sortNum == 2) {
        this.sortSCase = 2
        this.soptionsN = '글 내용'
      }
      this.getNoticeList(this.sortSCase, this.sortNCase)
    },
    writeNotice() {
      axios({
          url: "http://localhost:3000/board/noticeWrite",
          method: "POST",
          data: {
            title: this.noticeTitle,
            content: this.noticeContent,
          },
        })
        .then(res => {
          if (res.data.message == 'DB_error') {
            this.$swal({
              icon: 'error',
              title: 'DB 에러 발생'
            })
          }
          else {
            this.showModalFlag = false;
            this.$swal({
              icon: 'success',
              title: '글이 등록되었습니다.',
              showConfirmButton: false,
              timer: 1500
            })
            this.$router.go(0);
          }
        })
        .catch(err => {
          console.log(err);
        })
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
    checkAll() {
      if (this.isAllChecked) {
        this.checkedPosts = [];
      } else {
        this.checkedPosts = this.pagePostList.map(not => not.NOT_NO);
      }
      console.log(this.checkedPosts)
    },
    async deleteSelectedPosts() {
      if (this.checkedPosts.length === 0) {
        alert('삭제할 게시글을 선택해주세요.');
        return;
      }

      const confirmResult = await this.$swal({
        title: '선택한 게시글을 모두 삭제하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      });

      if (confirmResult.value) {
        try {
          const response = await axios.delete(`http://localhost:3000/admin/noticelist/delete`, {
            data: {
              postNos: this.checkedPosts // 배열 형태로 전달
            }
          });

          console.log('사용자 삭제 성공:', response.data);
          // 사용자 리스트에서 선택한 회원 제거
          this.postList = this.postList.filter(not => !this.checkedPosts.includes(not.NOT_NO));
          this.checkedPosts = [];
          this.$swal({
            icon: 'success',
            title: '삭제되었습니다',
            showConfirmButton: false,
            timer: 1500,
          });
          location.reload();
        } catch (error) {
          console.error('사용자 삭제 실패:', error);
        }
      }
    },
    movetocontent(NOT_NO) {
      this.$router.push({ path: '/board/notice/noticeDetail', query: { NOT_NO: NOT_NO }})
    },
    cutTheContent(content, maxLength) {
      if (content.length <= maxLength) {
        return content;
      } else {
        return content.slice(0, maxLength) + '...';
      }
    },
    goToNotice() {
      this.$router.push({ path: '/admin/boardlist/notice' });
    },
    goToFree() {
      this.$router.push({ path: '/admin/boardlist/free' });
    },
    goToAnon() {
      this.$router.push({ path: '/admin/boardlist/anon' });
    },
    goToReport() {
      this.$router.push({ path: '/admin/boardlist/report' });
    },
    goToLost() {
      this.$router.push({ path: '/admin/boardlist/lost' });
    },
    autoResize() {
      let element = this.$refs["textarea"];
      element.style.height = 'auto';
      element.style.height = element.scrollHeight + 'px';
    }
  }
};

</script>
  
<style src="../assets/css/global.css" scoped></style>
<style src="../assets/css/board.css" scoped></style>
<style scoped>
body {
  background-color: #f3f3f3;
}

.post-wrap>.btn-red {
  margin-bottom: 10px;
}

.table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  text-align: left;
}

.table * {
  transition: all 0.2s ease-out;
}

.table thead {
  background-color: var(--color-main-dark);
  color: white;
}

.table th {
  font-weight: 500;
}

.table th ,
.table td {
  padding: 1.2em;
}

.table tr th:first-of-type ,
.table tr td:first-of-type {
  text-align: center;
}

.table th:hover ,
.table td:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
}

.modal {
  z-index: 1100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-mask {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 30px;
  border-radius: 12px;
}

.modal-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-header {
  display: flex;
  gap: 10px;
  align-items: center;
}

.modal-header i {
  color: var(--color-main);
}

.notice-title input ,
.notice-description textarea {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 0.7em;
  padding: 0.5em;
}

.notice-title input:focus ,
.notice-description textarea:focus {
  border-color: var(--color-main);
}

.notice-description textarea {
  height: auto;
  overflow: hidden;
}

.modal-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.btn-small {
  margin-right: 10px; /* 원하는 간격 값으로 조절 */
}

</style>