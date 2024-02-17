<template>
  <body>
    <main id="main">
      <div class="main-wrap">
        <div id="visual" ref="visual" class="visual-wrap">
          <div class="visual">
            <img :src="imageSrc" alt="campus">
          </div>
          <div class="visual-txt">
            <div>
              <span class="color-main">숙</span>
              <span class="color-sub">덕</span>
              <span class="color-main">숙</span>
              <span class="color-sub">덕</span>
            </div>
            <div>기숙사 이야기</div>
          </div>
          <div id="scrollDown" class="scroll-down" @click="scrollDown">
            <span class="down-txt">Scroll Down</span>
            <i class="fa-solid fa-caret-down"></i>
          </div>
        </div>
        <div id="content" ref="content" class="grid-wrap">
          <div class="grid-box free"><free-component /></div>
          <div class="grid-box notice"><notice-component /></div>
          <div class="grid-box login"><login-component /></div>
          <div class="grid-box report"><report-component /></div>
          <div class="grid-box food"><food-component /></div>
          <div class="grid-box score"><score-component /></div>
          <div class="grid-box"><lost-component /></div>
          <div class="grid-box location-box" @click="this.$router.push('/map')">
            <div class="location">
              <div class="location-icon-wrap">
                <i class="fa-solid fa-map-location-dot location-icon"></i>
              </div>
              <div class="location-txt-kr">오시는 <span class="colored">길</span></div>
              <div class="location-txt-en-wrap">
                <div class="dot"></div>
                <div class="location-txt-en">LOCATION</div>
                <div class="dot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div @click="scrollToTop" id="topBtn" class="top-btn">
        <i class="fa-solid fa-caret-up"></i>
        <span>TOP</span>
      </div>
    </main>
  </body>
</template>

<script>
//import axios from 'axios';
//import $ from 'jquery'
import LoginComponent from "@/components/login.vue"
import FoodComponent from "@/components/mainfood.vue"
import FreeComponent from "@/components/freeCom.vue"
import NoticeComponent from "@/components/noticeCom.vue"
import ReportComponent from "@/components/reportCom.vue"
import LostComponent from "@/components/lostCom.vue"
import ScoreComponent from "@/components/score.vue"


export default {	
  data() {
    return {
      imageSrc:"https://images.unsplash.com/photo-1532649538693-f3a2ec1bf8bd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      showChildComponent: true,
      childTitle: "제목",
      childContent: "내용",
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  components: {
    LoginComponent,
    FoodComponent,
    NoticeComponent,
    FreeComponent,
    ReportComponent,
    LostComponent,
    ScoreComponent,
  },
  methods: {
    scrollDown() {
      // ref를 사용하여 content 요소에 접근
      // 윈도우 최상단으로부터 현재 스크롤 위치까지의 거리와 content로부터 뷰포트 상단까지의 거리를 합산 = content의 y 절대좌표
      const contentTop = window.scrollY + this.$refs.content.getBoundingClientRect().top;
      // visual의 y 절대좌표
      const visualTop = window.scrollY + this.$refs.visual.getBoundingClientRect().top;

      // content의 offsetTop을 기준으로 스크롤
      window.scrollTo({ top: contentTop - visualTop, behavior: "smooth" });
    },
    scrollToTop() {
      if (window.scrollTop !== 0) {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 10);
      }
    },
  }
}
</script>

<style src="../assets/css/global.css" scoped></style>
<style scoped>
.visual-wrap {
  width: 100vw;
  height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-image: linear-gradient(black 0%, black 80%, transparent 100%);
}

.visual {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  mask: linear-gradient(rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0) 100%);
}

.visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.2);
}

.visual-wrap .visual-txt {
  position: absolute;
  top: 50%;
  width: 100%;
  max-width: 1280px;
  padding: 0 0.5em;
  transform: translateY(-50%);
  font-size: 6em;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: white;
  text-shadow: 0 0 3px black, 0 1px 1px rgba(0, 0, 0, 0.1), 1px 0 1px rgba(0, 0, 0, 0.1), 0 -1px 1px rgba(0, 0, 0, 0.1), -1px 0 1px rgba(0, 0, 0, 0.1);
}

.visual-wrap .color-main {
  color: var(--color-main-faint);
}

.visual-wrap .color-sub {
  color: var(--color-sub-faint);
}

.visual-wrap .scroll-down {
  width: fit-content;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  padding: 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: 500;
  color: white;
  text-shadow: 0 0 3px black, 0 1px 1px rgba(0, 0, 0, 0.1), 1px 0 1px rgba(0, 0, 0, 0.1), 0 -1px 1px rgba(0, 0, 0, 0.1), -1px 0 1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  animation: levitate 0.8s ease-out infinite alternate;
  transition: all 0.2s ease-out;
}

@keyframes levitate{
  0% {
    transform: translate(-50%, 0);
  }
  100% {
    transform: translate(-50%, -0.5em);
  }
}

.scroll-down .down-txt {
  white-space: nowrap;
}

.location-box {
  padding: 45px 10% 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 30px;
  font-size: 2em;
  cursor: pointer;
}

.location-box:hover {
  background-color: #666;
}

.location {
  height: 100%;
  padding: 45px 0 40px;
  border: 2px solid #999;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.location-box:hover .location {
  border-color: white;
}

.location-icon-wrap {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  color: white;
  background-color: var(--color-red);
  position: absolute;
  top: -25px;
  left: calc(50% - 25px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.location-icon {
  font-size: 24px;
}

.location-txt-kr {
  color: #666;
  font-weight: 900;
  line-height: 1;
  transition: all 0.2s ease-out;
}

.location-box:hover .location-txt-kr {
  color: white;
}

.colored {
  color: var(--color-main);
  transition: all 0.2s ease-out;
}

.location-box:hover .colored {
  color: var(--color-main-light);
}

.location-txt-en-wrap {
  color: #999;
  font-weight: 200;
  background-color: white;
  position: absolute;
  bottom: -0.53em;
  left: 50%;
  transform: translate(-50%);
  line-height: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.3em;
  transition: all 0.2s ease-out;
}

.location-box:hover .location-txt-en-wrap {
  color: white;
  background-color: #666;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: #999;
  transition: all 0.2s ease-out;
}

.location-box:hover .dot {
  background-color: white;
}

.top-btn .fa-caret-up {
  font-size: 12px;
  line-height: 0.6;
}

@media screen and (max-width: 768px) {
  .top-btn {
    width: 30px;
    height: 30px;
  }

  .top-btn span {
    display: none;
  }
}

@media only screen and (min-width: 480px) {
  .grid-wrap {
    grid-template-columns: 1fr 1fr;
  }
}

@media only screen and (min-width: 768.1px) {
  .visual-wrap {
    height: calc(100vh - 80px);
  }

  .visual-wrap .scroll-down:hover {
    animation-play-state: paused;
    color: #141414;
    text-shadow: 0 0 3px white, 0 1px 1px rgba(255, 255, 255, 0.1), 1px 0 1px rgba(255, 255, 255, 0.1), 0 -1px 1px rgba(255, 255, 255, 0.1), -1px 0 1px rgba(255, 255, 255, 0.1);
  }

  .grid-wrap {
    max-width: 1280px;
    padding: 40px;
    margin: 0 auto;
    grid-template-columns: 5fr 6fr 4fr;
  }

  .grid-box.food {
    grid-row: 2 / 4;
    grid-column: 2 / 3;
  }

  .top-btn:hover {
    transform: scale(1.2);
  }
}
</style>