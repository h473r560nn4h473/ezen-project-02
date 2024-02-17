<template>
  <div v-if="user.user_no" class="flex-wrap">
    <div class="grid-title">
      <span><i class="fa-regular fa-chart-bar"></i>내 상벌점 현황</span>
    </div>
    <div class="grid-content">
      <div class="index">
        <div class="subject merits">
          <div class="color"></div>
          <span>상점</span>
        </div>
        <div class="subject demerits">
          <div class="color"></div>
          <span>벌점</span>
        </div>
      </div>
      <div class="graph merits">
        <div class="score-wrap">
          <span class="score">{{ scoreMerits }}점</span>
        </div>
        <div class="graph-bar-wrap">
          <div class="graph-bar" :style="{ width: barWidth1 + '%' }"></div>
        </div>
      </div>
      <div class="graph demerits">
        <div class="score-wrap">
          <span class="score">{{ scoreDemerits }}점</span>
        </div>
        <div class="graph-bar-wrap">
          <div class="graph-bar" :style="{ width: barWidth2 + '%' }"></div>
        </div>
        <div class="warning" v-show="barWidth2 >= 30">
          <span>경고! 상한 50점.</span>
          <span v-show="!showWarning">50점 초과시 불이익이 있습니다.</span>
        </div>
      </div>
    </div>
    <div class="detail">
      <div class="detail-btn btn-small" @click="goToDetail">상세보기</div>
    </div>
  </div>
  <div v-else class="null">
    <div class="ad">
      <div class="ad-notice"><i class="fa-solid fa-circle-info"></i> 광고</div>
      <img :src="selectedImagePath" alt="광고1">
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      //score: [],
      scoreMerits: 0,
      scoreDemerits: 0,
      barWidth1: 0,
      barWidth2: 0,
      imagePaths: [
      require('../assets/ad1.jpg'),
      require('../assets/ad2.jpg')
      ],
      selectedImagePath: ''
    }
  },
  computed: {
      user() {
        return this.$store.state.user
      },
      showWarning() {
        // 현재 경로에 따라 적절한 조건을 설정하세요.
        // 아래는 현재 경로가 '/'와 일치하는 경우에만 객체를 표시하는 예제입니다.
        return this.$route.path === '/';
      },
  },
  created() {
    this.selectedImagePath = this.getRandomImagePath();
  },
  mounted() {
    if (this.user.user_no != '') {
      this.getScore();
    }
  },
  methods: {
    getRandomImagePath() {
      const randomIndex = Math.floor(Math.random() * this.imagePaths.length);
      return this.imagePaths[randomIndex];
    },
    async getScore() {
      try {
        const response = await axios.get(`http://localhost:3000/mypage/getScore/${this.user.user_no}`);
        this.scoreMerits = response.data[0].PLUS;
        this.scoreDemerits = response.data[0].MINUS;
        console.log(typeof(this.scoreMerits));
        this.barWidth1 = this.scoreMerits * 2;
        this.barWidth2 = this.scoreDemerits * 2;
      }catch (error) {
        console.error(error);
      }
    },
    goToDetail() {
      this.$router.push('/mypage/scoreDetail');
    }
  }
}
</script>

<style src="../assets/css/global.css" scoped></style>
<style src="../assets/css/board.css" scoped></style>
<style scoped>
.flex-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.grid-box {
  line-height: 1;
}

.index {
  margin-bottom: 30px;
  display: flex;
  justify-content: right;
  align-items: center;
}

.index .subject {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.index .subject:not(:last-of-type) {
  margin-right: 20px;
}

.index .subject .color {
  width: 1em;
  height: 1em;
  margin-right: 0.5em;
  border-radius: 50%;
}

.index .subject.merits .color {
  background-color: var(--color-blue);
}

.index .subject.demerits .color {
  background-color: var(--color-red);
}

.graph {
  margin-bottom: 30px;
  display: flex;
  justify-content: left;
  align-items: center;
  position: relative;
}

.graph .score-wrap {
  width: 50px;
  margin-right: 20px;
  overflow: hidden;
  display: flex;
  justify-content: right;
}

.graph .score {
  white-space: nowrap;
}

.graph .graph-bar-wrap {
  width: 100%;
  overflow: hidden;
  border-radius: 0 0.25em 0.25em 0;
}

.graph .graph-bar-wrap .graph-bar {
  max-width: 100%;
  min-width: 3px;
  height: 0.8em;
  border-radius: 0.25em;
}

.graph.merits .graph-bar {
  background-color: var(--color-blue);
}

.graph.demerits .graph-bar {
  background-color: var(--color-red);
}

.graph.demerits .warning {
  position: absolute;
  top: 100%;
  right: 0;
  padding: 0.2em;
  line-height: 1;
  color: var(--color-red);
  font-weight: 500;
  white-space: nowrap;
  display: flex;
  gap: 0.3em;
}

.detail {
  display: flex;
  justify-content: right;
}

.null {
  width: 100%;
  height: 100%;
}

.ad {
  height: 100%;
}

.ad img {
  display: block;
  width: 100%;
  height: auto;
}
</style>