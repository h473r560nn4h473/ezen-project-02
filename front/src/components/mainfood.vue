<template>
  <div class="flex-wrap">
    <div class="grid-title">
      <span><i class="fa-solid fa-utensils"></i>식단 일정</span>
    </div>
    <div class="date">
      <div class="prev" @click="onClickPrev(currentDay, $event)">
        <i class="fa-solid fa-caret-left"></i>
      </div>
      <div class="year-month-day">
        <span>{{ currentYear }}년</span>
        <span>{{ currentMonth }}월</span>
        <span>{{ currentDay }}일</span>
      </div>
      <div class="next" @click="onClickNext(currentDay, $event)">
        <i class="fa-solid fa-caret-right"></i>
      </div>
    </div>
    <div class="food-info" v-if="foodInfo.length > 0">
      <div class="time">조식</div>
      <div class="food" v-html="type1"></div>
      <div class="time">중식</div>
      <div class="food" v-html="type2"></div>
      <div class="time">석식</div>
      <div class="food" v-html="type3"></div>
    </div>
    <div class="food-info-null" v-else> <!--식단 없을 시 이미지 추가-->
      <i class="fa-solid fa-wheat-awn-circle-exclamation food-icon"></i>
      <p>식사가 제공되지 않는 날이거나 식단이 누락되었습니다.</p>
    </div>
    <div class="detail">
      <div class="detail-btn btn-small" @click="$router.push('/foods')">전체보기</div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {	
  name:'',
  components:{},
  data() {
    return {
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      currentDay: new Date().getDate(),
      foodInfo: [],
      type1: '',
      type2: '',
      type3: ''
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  mounted() {
    this.foodList(); // 컴포넌트가 마운트된 후에 foodList 함수를 호출
  },
  watch: {
    currentYear: 'foodList',
    currentMonth: 'foodList',
    currentDay: 'foodList',
  },
  methods: {
    getEndOfDay: function (year, month) { //캘린더 월마다 끝나는 날 지정
      switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          return 31;
        // break;
        case 4:
        case 6:
        case 9:
        case 11:
          return 30;
        // break;
        case 2:
          if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
            return 29;
          }
          else {
            return 28;
          }
        // break;
        default:
          //console.log("unknown month " + month);
          return 0;
        // break;
      }
    },
    onClickPrev: function (day, event) { //클릭 시 전 달로 이동
      event.preventDefault();
      day--;
      if( day > 0) {
        this.currentDay -= 1;
      } else {
        this.currentMonth -= 1;

        if (this.currentMonth < 1) {
          // 1월보다 작아진 경우, 전 년도로 이동
          this.currentMonth = 12; // 월을 12로 초기화
          this.currentYear -= 1; // 년도를 감소시킴
        }

        this.currentDay = this.getEndOfDay(this.currentYear, this.currentMonth);
      }
      
    },
    onClickNext: function (day, event) { //클릭 시 다음 달로 이동
      event.preventDefault();
      day++;
      if (day > this.getEndOfDay(this.currentYear, this.currentMonth)) {
        // 만약 현재 월의 마지막 날짜를 넘어간다면
        day = 1; // 일을 1로 초기화하고
        this.currentMonth += 1; // 월을 증가시킴

        if (this.currentMonth > 12) {
          // 12월 다음이면
          this.currentMonth = 1; // 월을 1로 초기화하고
          this.currentYear += 1; // 년도를 증가시킴
        }
      }
      this.currentDay = day;
    },
    async foodList() {
      try {
        const selectedDate = `${this.currentYear}-${this.currentMonth}-${this.currentDay}`;
        const response = await axios.get(`http://localhost:3000/food/foods_info/${selectedDate}`);
        if (response.data.message == 'No results found.') {
          this.foodInfo = [];
          this.type1 = '';
          this.type2 = '';
          this.type3 = '';
        }
        else {
          this.foodInfo = response.data;
          //console.log(this.foodInfo);
          this.type1 = this.foodInfo[0].FOD_TYPE1.split(' ').join('<br />');
          this.type2 = this.foodInfo[0].FOD_TYPE2.split(' ').join('<br />');
          this.type3 = this.foodInfo[0].FOD_TYPE3.split(' ').join('<br />');
          //console.log(this.type1);
        }  
        this.showModal = true;
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>

<style src="../assets/css/global.css" scoped></style>
<style scoped>
.flex-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.date {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.prev ,
.next {
  width: 2em;
  height: 2em;
  border-radius: 1em;
  color: #999;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: color 0.5s ease-out;
  position: relative;
}

.prev:hover ,
.next:hover {
  color: #666;
}

.prev::after ,
.next::after {
  content: '';
  display: block;
  position: absolute;
  top: calc(50% - 0.5em);
  left: calc(50% - 0.5em);
  width: 1em;
  height: 1em;
  border-radius: 50%;
  transition: transform 0.5s ease-out, background-color 0.5s ease-out;
}

.prev:hover::after ,
.next:hover::after {
  transform: scale(2);
  background-color: rgba(0, 0, 0, 0.05);
}

.year-month-day {
  display: flex;
  gap: 0.3em;
  font-weight: 500;
}

.food-info {
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 10px;
  text-align: center;
}

.food-info>div {
  border-radius: 12px;
  padding: 0.5em 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.food-info>div:nth-of-type(odd) {
  border: 2px solid #f3f3f3;
}

.food-info>div:nth-of-type(even) {
  background-color: #f3f3f3;
}

.food {
  line-height: 1.7;
}

.food-info-null {
  height: 100%;
  padding: 30px;
  border-radius: 0.7em;
  background-color: #f3f3f3;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
  word-break: keep-all;
  text-align: center;
}

.food-info-null .food-icon {
  font-size: 3em;
}

.detail {
  display: flex;
  justify-content: right;
  margin-top: 10px;
}
</style>