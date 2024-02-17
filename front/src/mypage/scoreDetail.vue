<template>
  <div class="wrap">
    <div class="total">
      <span>누적 상점: {{ totalPlus }}점</span>
      <span>누적 벌점: {{ totalMinus }}점</span>
      <span>누적 현황: {{ totalPlus - totalMinus }}점</span>
    </div>
    <div class="grid-box" :class="{ minus: item.SCO_PLUS == 0, plus: item.SCO_PLUS != 0 }" v-for="item in pageScoreList" :key="item.SCO_NO">
      <div class="row">
        <div class="item">일자</div>
        <div>{{ formatDateTime(item.SCO_DATE) }}</div>
      </div>
      <div class="row">
        <div class="item">제목</div>
        <div>{{ item.SCO_TITLE }}</div>
      </div>
      <div class="row">
        <div class="item">내용</div>
        <div>{{ item.SCO_CONTENT }}</div>
      </div>
      <div class="row" v-if="item.SCO_PLUS == 0">
        <div class="item">벌점</div>
        <div>{{ item.SCO_MINUS }}</div>
      </div>
      <div class="row" v-else>
        <div class="item">상점</div>
        <div>{{ item.SCO_PLUS }}</div>
      </div>
    </div>
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
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      scoreList: [],
      pageScoreList: [],
      totalPlus: 0,
      totalMinus: 0,
      pageNum: 0,
      pageCnt: 0,
      onePageCnt: 4, //한페이지에 보여지는 정보 갯수
      blockSize: 10,
    }
  },
  computed: {
    user() {
      return this.$store.state.user
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
    this.getScore();
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
    setPage(page) {
      this.pageScoreList = []
      this.pageNum = page - 1;
      this.sliceList()
    },  
    sliceList() {
      const start = 0 + this.pageNum * this.onePageCnt
      this.pageScoreList = this.scoreList.slice(start, start + this.onePageCnt);
    },
    async getScore() {
      try {
        const response = await axios.get(`http://localhost:3000/mypage/scoreDetail/${this.user.user_no}`);
        this.scoreList = response.data;
        console.log(this.scoreList);
        this.pageCnt = Math.ceil(this.scoreList.length / this.onePageCnt);
        // 상점과 벌점 누적값 계산
        this.totalPlus = this.scoreList.reduce((acc, cur) => acc + cur.SCO_PLUS, 0);
        this.totalMinus = this.scoreList.reduce((acc, cur) => acc + cur.SCO_MINUS, 0);
        this.setPage(1);
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
      const formattedDateTime = date.toLocaleDateString("ko-KR", options).replace(/\.$/, '');
     
      return formattedDateTime;
      
    },
  }
}
</script>

<style src="../assets/css/global.css" scoped></style>
<style src="../assets/css/board.css" scoped></style>
<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.total {
  display: flex;
  gap: 10px;
}

.grid-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.grid-box:hover ,
.grid-box.plus:hover .item ,
.grid-box.minus:hover .item {
  color: white;
}

.grid-box.plus {
  border: 1px solid var(--color-blue);
}

.grid-box.plus:hover {
  background-color: var(--color-blue);
}

.grid-box.plus:not(:hover) .item {
  color: var(--color-blue);
}

.grid-box.minus {
  border: 1px solid var(--color-red);
}

.grid-box.minus:hover {
  background-color: var(--color-red);
}

.grid-box.minus:not(:hover) .item {
  color: var(--color-red);
}

.row {
  display: flex;
  gap: 1em;
  align-items: center;
}

.item {
  font-weight: 600;
}

.bar {
  width: 4px;
  height: 0.7em;
  border-radius: 2px;
  background-color: var(--color-main);
}
</style>