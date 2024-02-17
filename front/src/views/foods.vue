<template>
  <main class="wrap">
    <div class="inner-wrap">
      <div class="title">
        <h1>오늘의 학식</h1>
      </div>
      <div class="grid-box">
        <div class="calendar-food-wrap">
          <div class="calendar">
            <div class="date">
              <span class="prev" @click="onClickPrev(currentMonth, $event)">
                <i class="fa-solid fa-chevron-left"></i>
              </span>
              <span class="year-month">
                <span>{{ currentYear }}년</span>
                <span>{{ currentMonth }}월</span>
              </span>
              <span class="next" @click="onClickNext(currentMonth, $event)">
                <i class="fa-solid fa-chevron-right"></i>
              </span>
            </div>
            <div class="month">
              <div class="week-names">
                <div class="week-name" v-for="(weekName, index) in weekNames" v-bind:key="index">
                  <span>{{ weekName }}</span>
                </div>
              </div>
              <div class="month-days">
                <div class="week-days" v-for="(row, index) in currentCalendarMatrix" :key="index">
                  <div v-for="(day, index2) in row" :key="index2" class="day">
                    <div v-if="isToday(currentYear, currentMonth, day) && !pointDay(currentYear, currentMonth, day)" 
                        class="today holiday">
                      <span>{{ day }}</span>
                    </div>
                    <div v-else-if="isToday(currentYear, currentMonth, day)" 
                        class="today" 
                        :class="{ 'active': isActiveDay(currentYear, currentMonth, day) }" 
                        @click="handleDayClick(currentYear, currentMonth, day)">
                      <span>{{ day }}</span>
                    </div>
                    <div v-else-if="pointDay(currentYear, currentMonth, day)" 
                        class="not-today" 
                        :class="{ 'active': isActiveDay(currentYear, currentMonth, day) }" 
                        @click="handleDayClick(currentYear, currentMonth, day)">
                      <span>{{ day }}</span>
                    </div>
                    <div v-else 
                        class="holiday">
                      <span>{{ day }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="food-modal-container">
            <div v-show="showModal" class="food-modal">
              <div class="modal-top">
                <span class="year-month-day">{{ selectedYear }}년 {{ selectedMonth }}월 {{ selectedDay }}일 식단</span>
                <!-- <i class="fa-solid fa-xmark" @click="showModal = !showModal"></i> -->
              </div>
              <div class="line"></div>
              <div class="food-wrap">
                <div class="meal">조식</div>
                <div class="meal">중식</div>
                <div class="meal">석식</div>
                <div v-html="type1" class="food"></div>
                <div v-html="type2" class="food"></div>
                <div v-html="type3" class="food"></div>
              </div>
              <div class="food-pic">
                <img src="../assets/breakfast.png" alt="음식 그림">
              </div>
            </div>
            <div v-show="!showModal" class="food-modal-null">
              <div class="typography">
                <p>Today's</p>
                <p>Meal</p>
              </div>
              <div class="dot-wrap">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
              <div class="food-pic">
                <img src="../assets/breakfast.png" alt="음식 그림">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import axios from 'axios';

export default {	
  name:'',
  components:{},
  data() {
    return {
      showModal: false,
      //isOptionDisabled: false,
      // weekNames: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
      // weekNames: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      weekNames: ["월", "화", "수", "목", "금", "토", "일"],
      rootYear: 1904,
      rootDayOfWeekIndex: 4, // 2000년 1월 1일은 토요일
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      currentDay: new Date().getDate(),
      currentMonthStartWeekIndex: null,
      currentCalendarMatrix: [],
      endOfDay: null,
      foodInfo: [],
      foods: [],
      type1: '',
      type2: '',
      type3: '',
      selectedYear: '',
      selectedMonth: '',
      selectedDay: ''
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  mounted() {
    this.init();
    this.getFoods();
  },
  methods: {
    init: function () {
      this.currentMonthStartWeekIndex = this.getStartWeek(this.currentYear, this.currentMonth);
      this.endOfDay = this.getEndOfDay(this.currentYear, this.currentMonth);
      this.initCalendar();
    },
    initCalendar: function () { //캘린더 날짜 생성
      this.currentCalendarMatrix = [];
      let day = 1;
      let start = 0;
      if((this.currentMonthStartWeekIndex == 5 && this.endOfDay == 31) || (this.currentMonthStartWeekIndex == 6 && this.endOfDay >= 30)) {
        start = 6;
      } else {
        start = 5;
      }
      for (let i = 0; i < start; i++) {
        let calendarRow = [];
        for (let j = 0; j < 7; j++) {
          if (i == 0 && j < this.currentMonthStartWeekIndex) {
            calendarRow.push("");
          }
          else if (day <= this.endOfDay) {
            calendarRow.push(day);
            day++;
          }
          else {
            calendarRow.push("");
          }
        }
        this.currentCalendarMatrix.push(calendarRow);
      }
    },
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
    getStartWeek: function (targetYear, targetMonth) { //캘린더 년,월 지정
      let year = this.rootYear;
      let month = 1;
      let sumOfDay = this.rootDayOfWeekIndex;
      // eslint-disable-next-line
      while (true) {
        if (targetYear > year) {
          for (let i = 0; i < 12; i++) {
            sumOfDay += this.getEndOfDay(year, month + i);
          }
          year++;
        }
        else if (targetYear == year) {
          if (targetMonth > month) {
            sumOfDay += this.getEndOfDay(year, month);
            month++;
          }
          else if (targetMonth == month) {
            return (sumOfDay) % 7;
          }
        }
      }
    },
    onClickPrev: function (month, event) { //클릭 시 전 달로 이동
      event.preventDefault();
      month--;
      if (month <= 0) {
        this.currentMonth = 12;
        this.currentYear -= 1;
      }
      else {
        this.currentMonth -= 1;
      }
      this.init();
    },
    onClickNext: function (month, event) { //클릭 시 다음 달로 이동
      event.preventDefault();
      month++;
      if (month > 12) {
        this.currentMonth = 1;
        this.currentYear += 1;
      }
      else {
        this.currentMonth += 1;
      }
      this.init();
    },
    isActiveDay(year, month, day) {
      // 클릭한 날짜가 현재 선택된 날짜와 같은지 확인
      return year === this.selectedYear && month === this.selectedMonth && day === this.selectedDay;
    },
    isToday: function (year, month, day) { //오늘 날짜 반환
      let date = new Date();
      return year == date.getFullYear() && month == date.getMonth() + 1 && day == date.getDate();
    },
    async handleDayClick(year, month, day) {
      try {
        const selectedDate = `${this.currentYear}-${this.currentMonth}-${day}`;
        const response = await axios.get(`http://localhost:3000/food/foods_info/${selectedDate}`);
          this.foodInfo = response.data;
          this.type1 = this.foodInfo[0].FOD_TYPE1.split(' ').join('<br />');
          this.type2 = this.foodInfo[0].FOD_TYPE2.split(' ').join('<br />');
          this.type3 = this.foodInfo[0].FOD_TYPE3.split(' ').join('<br />');
          this.selectedYear = year;
          this.selectedMonth = month;
          this.selectedDay = day;
          //console.log(this.type1);
          this.showModal = true;
          
      } catch (error) {
        console.error(error);
      }
    },
    async getFoods() {
      try {
        const response = await axios.get(`http://localhost:3000/food/all_list`);
        this.foods = response.data;
        console.log(this.foods);
      } catch(error) {
        console.error(error);
      }
    },
    pointDay(year, month, day) { //예약된 날짜와 캘린더 날짜 비교해서 같은 것 반환
      const targetDate = new Date(year, month - 1, day); // year와 month는 1씩 빼줘서 인덱스에 맞춤
      for (const cal of this.foods) {
        const calDate = new Date(cal.FOD_DATE);
        if (this.isSameDay(targetDate, calDate)) {
          return true;
        }
      }
      return false
    },
    isSameDay(date1, date2) { //두 날짜 값이 같은 지 비교
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      )
    },
  }
}
</script>

<style src="../assets/css/global.css" scoped></style>
<style scoped>
.grid-box {
  padding: 0;
}

.grid-box:hover {
  transform: none;
}

.calendar-food-wrap {
  display: flex;
  flex-direction: column;
}

.calendar ,
.month {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.calendar {
  padding: 30px;
}

.date {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.prev ,
.next {
  width: 2em;
  height: 2em;
  border-radius: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  color: #999;
  cursor: pointer;
  transition: all 0.5s ease-out;
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
  transition: transform 1s ease-out, background-color 0.5s ease-out;
}

.prev:hover::after ,
.next:hover::after {
  transform: scale(2);
  background-color: rgba(0, 0, 0, 0.05);
}

.year-month {
  display: flex;
  gap: 0.5em;
  font-size: 1.2em;
  font-weight: 500;
}

.week-names {
  display: flex;
  justify-content: space-between;
}

.week-name ,
.today ,
.not-today ,
.holiday {
  width: 2em;
  height: 2.4em;
  border-radius: 0.7em;
  display: flex;
  justify-content: center;
  align-items: center;
}

.week-name {
  font-weight: 500;
}

.week-name:nth-of-type(6) {
  color: var(--color-blue);
}

.week-name:nth-of-type(7) {
  color: var(--color-red);
}

.month-days {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.week-days {
  display: flex;
  justify-content: space-between;
}

.today ,
.not-today {
  transition: all 0.2s ease-out;
}

.today {
  position: relative;
}

.today:not(.holiday) ,
.not-today:not(.holiday) {
  border: 1px solid var(--color-main);
  cursor: pointer;
}

.today::before {
  content: '';
  display: block;
  width: 3em;
  height: 3.4em;
  border-radius: 1em;
  border: 2px solid var(--color-sub);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.today::after {
  content: '오늘';
  display: block;
  padding: 0.2em;
  border-radius: 0.3em;
  line-height: 1;
  background-color: white;
  font-size: 12px;
  position: absolute;
  bottom: -1.2em;
  left: calc(100% + 0.1em);
  color: var(--color-sub);
  font-weight: 700;
  writing-mode: vertical-lr;
  text-orientation: upright;
}

.today:not(.holiday):hover ,
.not-today:not(.holiday):hover {
  background-color: var(--color-main);
  border-color: var(--color-main);
  color: white;
}

.today.active ,
.not-today.active {
  background-color: var(--color-main-dark);
  border-color: var(--color-main-dark);
  color: white;
}

.holiday {
  background-color: #eaeaea;
  color: #999;
  border: 1px solid #eaeaea;
  cursor: default;
}

.food-modal-container {
  border-radius: 0 0 12px 12px;
  border-top: 1px solid #ccc;
  background-color: var(--color-main);
  color: white;
  position: relative;
}

.food-modal {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 30px;
}

.modal-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-top .year-month-day {
  font-size: 1.2em;
  font-weight: 500;
}

.fa-xmark {
  padding: 0.5em;
  cursor: pointer;
}

.line {
  width: 100%;
  height: 1px;
  background-color: #eaeaea;
}

.food-wrap {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 100px;
}

.meal ,
.food {
  border-radius: 0.7em;
  text-align: center;
  transition: all 0.2s ease-out;
}

.meal {
  padding: 0.7em 0;
  background-color: rgba(255, 255, 255, 0.1);
}

.meal:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.food {
  padding: 1.5em 0;
  line-height: 2;
  background-color: rgba(0, 0, 0, 0.1);
}

.food:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.food-modal-null {
  position: relative;
}

.typography {
  height: 100%;
  padding: 30px;
  line-height: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 30px;
  font-size: 4em;
  font-weight: 100;
  color: white;
  letter-spacing: -.07em;
}

.dot-wrap {
  position: absolute;
  top: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.dot-wrap .dot:first-of-type {
  background-color: var(--color-main-dark);
}

.dot-wrap .dot:not(:first-of-type) {
  background-color: white;
}

.food-pic {
  width: 100px;
  position: absolute;
  bottom: 0;
  right: 20px;
}

.food-modal .food-pic {
  display: none;
}

.food-pic img {
  width: 100%;
}

@media screen and (min-width: 481px) {
  .week-name ,
  .today ,
  .not-today ,
  .holiday {
    width: 3em;
  }

  .today::before {
    width: 4em;
  }
  
  .food-modal-null {
    padding: 40px 0;
  }
}

@media screen and (min-width: 769px) {
  .calendar-food-wrap {
    flex-direction: row-reverse;
  }

  .food-modal-container {
    width: 80%;
    border-radius: 12px 0 0 12px;
    border-right: 1px solid #ccc;
    border-top: none;
  }

  .food-modal .food-pic {
    display: block;
  }

  .food-modal-null {
    height: 100%;
  }
}
</style>