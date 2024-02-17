<template>
  <main>
    <div class="board-wrap">
      <h1 class="title">회원관리</h1>
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
              <input refs="searchInput" v-model="keyword" type="search" placeholder="검색" @keyup.enter="getUserList(sortSCase, sortNCase)">
              <div class="erase" v-show="keyword.length > 0" @click="keyword = ''"><i class="fa-solid fa-xmark"></i></div>
            </div>
            <button class="search-btn" type="submit" @click="getUserList(sortSCase, sortNCase)">
              <i class="fa-solid fa-search"></i>
            </button>
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
        <button class="btn-small btn-red" @click="deleteSelectedUsers">선택 탈퇴</button>
        <table class="table">
          <thead>
            <tr>
              <th><input type="checkbox" class="allCheck" :checked="isAllChecked" @click="checkAll"></th>
              <th>아이디</th>
              <th>사진</th>
              <th>이름</th>
              <th>전화번호</th>
              <th>학번</th>
              <th>상벌점</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in pageUserList" :key="index">
              <td><input type="checkbox" class="check" :value="item.USER_NO" v-model="checkedUsers"></td>
              <td>{{ item.USER_ID }}</td>
              <td>
                <div class="profile-pic" v-if="item.USER_IMG">
                  <img :src="require('../../../back/uploads/uploadUser/' + `${item.USER_IMG}`)" alt="">
                </div>
                <div class="profile-pic" v-else>
                  <i class="fa-solid fa-user"></i>
                </div>
              </td>
              <td>{{ item.USER_NM }}</td>
              <td>{{ item.USER_PH }}</td>
              <td>{{ item.USER_HNO }}</td>
              <td class="btn-score" v-if="item.USER_TP !== 1" @click="showModal(item.USER_NO)">
                <button>상벌점 부여</button>
              </td>
              <td v-else>
                <span>관리자</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="showModalFlag" class="modal">
          <div class="bg" @click="closeModal"></div>
          <div class="modal-mask">
            <div class="modal-wrapper">
              <div class="modal-container">
                <div class="modal-header title">
                  <i class="fa-solid fa-award"></i>
                  <h3>상벌점 부여</h3>
                </div>
                <div class="modal-body">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>유저 이름&nbsp;</th>
                        <th>마지막 상점 / 벌점&nbsp;</th>
                        <th>마지막 사유&nbsp;</th>
                        <th>마지막 상세사유&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ scoreList.USER_NM }}&nbsp;</td>
                        <td class="last-score">{{ scoreList.SCO_PLUS }}&nbsp;/&nbsp;{{ scoreList.SCO_MINUS }}</td>
                        <td>{{ scoreList.SCO_TITLE }}&nbsp;</td>
                        <td>{{ scoreList.SCO_CONTENT }}&nbsp;</td>
                      </tr>
                      <tr>
                        <th>상벌점</th>
                        <td class="plus-minus">
                          <input type="radio" name="score" value="plus" v-model="scoreType" />
                          &nbsp;
                          <label for="plus">+</label>
                          &nbsp;&nbsp;
                          <input type="radio" name="score" value="minus" v-model="scoreType" />
                          &nbsp;
                          <label for="minus">-</label>
                        </td>
                        <th class="score-input">점수입력</th>
                        <td class="score"><input type="number" v-model="scoreValue" /></td>
                      </tr>
                      <tr class="score-title">
                        <th>제목</th>
                        <td colspan="3">
                          <input type="text" v-model="scoreTitle" />
                        </td>
                      </tr>
                      <tr class="score-description">
                        <th>내용</th>
                        <td colspan="3">
                          <textarea ref="textarea" type="text" v-model="scoreContent" @keydown="autoResize()" rows="3" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="modal-footer">
                  <button class="btn-small btn-blue" @click="saveScore">부여</button>
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
      userList: [], //현재 게시판과 페이지에 맞는 글 리스트
      showModalFlag: false,
      scoreList: [],
      scoreType: "",
      scoreValue: "",
      userNo: 0,
      scoreTitle: "",
      scoreContent: "",
      sortNCase: 0,
      optionsN: '최근 가입 순',
      options: ['최근 가입 순', '과거 가입 순'],
      sortSCase: 0,
      soptionsN: '아이디',
      soptions: ['아이디', '이름', '전화번호', '메일', '학번', '주소'],
      keyword: '',
      pageUserList: [],
      checkedUsers: [],
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
      return this.checkedUsers.length === this.pageUserList.length;
    },
  },
  created() {
    this.getUserList();
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
      this.pageUserList = []
      this.pageNum = page - 1;
      this.sliceList()
    },
    sliceList() {
      const start = 0 + this.pageNum * this.onePageCnt
      this.pageUserList = this.userList.slice(start, start + this.onePageCnt);
    },
    async getUserList(sortSCaseNum, sortNCaseNum) {
      let keyword = 'none'
      if (this.keyword != '') {
        keyword = this.keyword;
      }
      try {
        const response = await axios.get(`http://localhost:3000/admin/userlist/${sortSCaseNum}/${sortNCaseNum}/${keyword}`);
        this.userList = response.data;
        console.log(this.userList);
        this.pageCnt = Math.ceil(this.userList.length / this.onePageCnt);
        this.setPage(1);
      } catch (error) {
        console.error(error);
      }
    },
    showModal(userNo) {
      this.userNo = userNo;
      this.showModalFlag = true;
      this.getScore();
    },
    closeModal() {
      this.showModalFlag = false;
    },
    getScore() {
      const url = "http://localhost:3000/admin/userlist/score/" + this.userNo;
      axios
        .get(url)
        .then((res) => {
          console.log(res);
          this.scoreList = res.data[0];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async saveScore() {
      try {
        const response = await axios.post(`http://localhost:3000/admin/userlist/score/add/${this.userNo}`, {
          userNo: this.userNo,
          scoreType: this.scoreType,
          scoreValue: this.scoreValue,
          scoreTitle: this.scoreTitle,
          scoreContent: this.scoreContent,
        })
          .then(res => {
            if (res.data.message === 'add') {
              this.$swal("부여가 완료되었습니다");
            } else {
              this.$swal("부여가 실패했습니다.")
            }
          })
        this.showModalFlag = false;
      }
      catch (err) {
        console.log(err);
      }
    },
    sortList(sortNum, event) {
      event.preventDefault();
      if (sortNum == 0) {
        this.sortNCase = 0;
        this.optionsN = '최근 가입 순'
      } else if (sortNum == 1) {
        this.sortNCase = 1;
        this.optionsN = '과거 가입 순'
      }
      this.getUserList(this.sortSCase, this.sortNCase)
    },
    sortSList(sortNum, event) {
      event.preventDefault();
      if (sortNum == 0) {
        this.sortSCase = 0
        this.soptionsN = '아이디'
      } else if (sortNum == 1) {
        this.sortSCase = 1
        this.soptionsN = '이름'
      } else if (sortNum == 2) {
        this.sortSCase = 2
        this.soptionsN = '전화번호'
      } else if (sortNum == 3) {
        this.sortSCase = 3
        this.soptionsN = '메일'
      } else if (sortNum == 4) {
        this.sortSCase = 4
        this.soptionsN = '학번'
      } else if (sortNum == 5) {
        this.sortSCase = 5
        this.soptionsN = '주소'
      }
      this.getUserList(this.sortSCase, this.sortNCase)
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
        this.checkedUsers = [];
      } else {
        this.checkedUsers = this.pageUserList.map(user => user.USER_NO);
      }
      //console.log(this.checkedUsers)
    },
    async deleteSelectedUsers() {
      if (this.checkedUsers.length === 0) {
        alert('삭제할 회원을 선택해주세요.');
        return;
      }

      const confirmResult = await this.$swal({
        title: '선택한 회원을 모두 탈퇴시키겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소'
      });

      if (confirmResult.value) {
        try {
          const response = await axios.delete(`http://localhost:3000/admin/userlist/delete`, {
            data: {
              userNos: this.checkedUsers // 배열 형태로 전달
            }
          });

          console.log('사용자 삭제 성공:', response.data);
          // 사용자 리스트에서 선택한 회원 제거
          this.userList = this.userList.filter(user => !this.checkedUsers.includes(user.USER_NO));
          this.checkedUsers = [];
          this.$swal({
            icon: 'success',
            title: '탈퇴되었습니다',
            showConfirmButton: false,
            timer: 1500,
          });
          location.reload();
        } catch (error) {
          console.error('사용자 탈퇴 실패:', error);
        }
      }
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

.btn-score {
  cursor: pointer;
}

.btn-score button {
  background-color: transparent;
}

.btn-score:hover button {
  text-decoration: underline;
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

.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
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

.last-score {
  text-align: center;
}

.plus-minus {
  line-height: 1;
}

.score-input {
  text-align: center;
}

.score input ,
.score-title input ,
.score-description textarea {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 0.7em;
  padding: 0.5em;
}

.score input:focus ,
.score-title input:focus ,
.score-description textarea:focus {
  border-color: var(--color-main);
}

.score-description textarea {
  height: auto;
  overflow: hidden;
}

.modal-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}
</style>