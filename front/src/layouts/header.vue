<template>
  <header>
    <div class="header-wrap">
      <h1 class="logo" @click="this.$router.push('/')">
        <div>
          <span class="color-main">ㅅ</span>
          <span class="color-sub">ㄷ</span>
          <br>
          <span class="color-sub">ㅅ</span>
          <span class="color-main">ㄷ</span>
        </div>
      </h1>
      <!-- https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence -->
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="filters">
        <defs>
          <filter id="sketchy-0">
            <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="10" result="noise" seed="0" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
          <filter id="sketchy-1">
            <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="10" result="noise" seed="1" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
          <filter id="sketchy-2">
            <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="10" result="noise" seed="2" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
          <filter id="sketchy-3">
            <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="10" result="noise" seed="3" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
          <filter id="sketchy-4">
            <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="10" result="noise" seed="4" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
          <filter id="sketchy-5">
            <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="10" result="noise" seed="5" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
        </defs>
      </svg>
      <div class="gnb">
        <div class="burger-wrap">
          <div class="burgerMenu">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
          </div>
        </div>
        <ul>
          <div class="menu-top"><span>MENU</span></div>
          <li class="depth1">
            <div class="nav-txt">소개<i class="fa-solid fa-caret-down"></i></div>
            <ul>
              <li class="depth2" @click="this.$router.push('/intro')"><div class="nav-txt">기숙사</div></li>
              <li class="bound"></li>
              <li class="depth2" @click="this.$router.push('/intro2')"><div class="nav-txt">시설</div></li>
            </ul>
          </li>
          <li class="bound"></li>
          <li class="depth1">
            <div class="nav-txt">게시판<i class="fa-solid fa-caret-down"></i></div>
            <ul>
              <li class="depth2" @click="this.$router.push('/board/notice')"><div class="nav-txt">공지사항</div></li>
              <li class="bound"></li>
              <li class="depth2" @click="this.$router.push('/board/free')"><div class="nav-txt">자유</div></li>
              <li class="bound"></li>
              <li class="depth2" @click="this.$router.push('/board/anon')"><div class="nav-txt">익명</div></li>
              <li class="bound"></li>
              <li class="depth2" @click="this.$router.push('/board/report')"><div class="nav-txt">신고</div></li>
              <li class="bound"></li>
              <li class="depth2" @click="this.$router.push('/board/lost')"><div class="nav-txt">분실물</div></li>
            </ul>
          </li>
          <li class="bound"></li>
          <li class="depth1">
            <div class="nav-txt">안내<i class="fa-solid fa-caret-down"></i></div>
            <ul>
              <li class="depth2" @click="this.$router.push('/joinInfo')"><div class="nav-txt">입사/퇴사</div></li>
              <li class="bound"></li>
              <li class="depth2" @click="this.$router.push('/scoreStandard')"><div class="nav-txt">상벌점</div></li>
              <li class="bound"></li>
              <li class="depth2" @click="this.$router.push('/foods')"><div class="nav-txt">식단</div></li>
              <li class="bound"></li>
              <li class="depth2" @click="this.$router.push('/map')"><div class="nav-txt">오시는 길</div></li>
            </ul>
          </li>
          <li class="bound"></li>
          <li class="depth1">
            <div class="nav-txt" @click="this.$router.push('/res')">자습실 예약<i class="fa-solid fa-caret-down"></i></div>
          </li>
          <!-- <li class="bound"></li>
          <li class="depth1">
            <div class="nav-txt">Product<i class="fa-solid fa-caret-down"></i></div>
            <ul>
              <li class="depth2"><div class="nav-txt">Product1</div></li>
              <li class="bound"></li>
              <li class="depth2"><div class="nav-txt">Product2</div></li>
              <li class="bound"></li>
              <li class="depth2"><div class="nav-txt">Product3</div></li>
              <li class="bound"></li>
              <li class="depth2"><div class="nav-txt">Product4</div></li>
              <li class="bound"></li>
              <li class="depth2"><div class="nav-txt">Product5</div></li>
            </ul>
          </li>
          <li class="bound"></li> -->
        </ul>
      </div>
    </div>
    <div class="bg"></div>
  </header>
</template>

<script>
import $ from 'jquery'

export default {

  mounted() {
    this.myfunction() 
  },
  methods: {
  // 모바일 gnb 쪽 버그 픽스가 덜 됐음
    myfunction() {
      const burger = $(".gnb>.burger-wrap");
      const gnb = burger.parent(".gnb");
      const depth1 = gnb.find(".depth1");
      //const depth1Menu = gnb.find(".depth1>ul")
      //const header = $(".header-wrap");

      burger.click(function() {
        gnb.toggleClass("active");
      });

      depth1.find(">.nav-txt").click(function() {
        $(this).parent(depth1).toggleClass("active");
        $(this).parent(depth1).siblings().removeClass("active");
      });
      
      let desktop = function() {
        $(document).mousemove(function() {
          depth1.mouseenter(function() {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
          });
          gnb.mouseleave(function() {
            depth1.removeClass("active");
          });
        });
      };
      
      if($(window).width() <= 768) {
        $(window).resize(function() {
          if($(window).width() > 768) {
            depth1.find(">.nav-txt").off("click");
            // gnb.removeClass("active");
            // depth1.removeClass("active");
            desktop();
          }
        });
      } else if($(window).width() > 768) {
        desktop();
        $(window).resize(function() {
          if($(window).width() <= 768) {
            depth1.off("mouseenter");
            gnb.off("mouseleave");
            // depth1.removeClass("active");
          }
        });
      }
    }
  }
}
</script>

<style src="../assets/css/global.css" scoped></style>
<style scoped>
@font-face {
  font-family: 'netmarbleB';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.1/netmarbleB.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

header {
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-wrap {
  width: 100%;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease-out;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 0.7em;
  background-color: var(--color-main);
  font-family: "netmarbleB", sans-serif;
  font-size: 1.4em;
  text-align: center;
  line-height: 0.7;
  letter-spacing: -0.1em;
  box-shadow: 3px 3px 10px -3px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease-out;
}

.logo:hover {
  animation: sketchy 0.5s linear infinite;
}

.logo div span:nth-of-type(1) {
  animation-delay: 0.3s;
}

.logo div span:nth-of-type(2) {
  animation-delay: 0.1s;
}

.logo div span:nth-of-type(3) {
  animation-delay: 0.4s;
}

.logo div span:nth-of-type(4) {
  animation-delay: 0.2s;
}

.color-main {
  color: var(--color-main-faint);
}

.color-sub {
  color: var(--color-sub-faint);
}

svg#filters {
  visibility: hidden;
  position: absolute;
}


@keyframes sketchy {
	0% {
		filter: url("#sketchy-0");
	}
	20% {
		filter: url("#sketchy-1");
	}
	40% {
		filter: url("#sketchy-2");
	}
	60% {
		filter: url("#sketchy-3");
	}
	80% {
		filter: url("#sketchy-4");
	}
	100% {
		filter: url("#sketchy-5");
	}
}

.gnb .burger-wrap {
  position: relative;
  width: 50px;
  height: 40px;
  cursor: pointer;
  z-index: 130;
}

.gnb .burgerMenu {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 24px;
}

.gnb .line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  border-radius: 1px;
  background-color: #333;
  transition: all 0.3s ease-out;
}

.gnb .line:nth-of-type(1) {
  top: 0;
}

.gnb .line:nth-of-type(2) {
  top: 50%;
  transform: translateY(-50%);
}

.gnb .line:nth-of-type(3) {
  bottom: 0;
}

.gnb>ul {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 100%;
  transition: left 0.4s ease-out;
  background-color: white;
}

.gnb.active>ul {
  left: 0;
}

.gnb.active .line:nth-of-type(1) {
  width: 20px;
  transform: translate(10px, 11px) rotate(45deg);
  background-color: white;
}

.gnb.active .line:nth-of-type(2) {
  display: none;
}

.gnb.active .line:nth-of-type(3) {
  width: 20px;
  transform: translate(10px, -11px) rotate(-45deg);
  background-color: white;
}

.gnb .menu-top,
.gnb .depth1 {
  width: 100%;
  height: 60px;
}

.gnb .menu-top {
  z-index: 110;
  position: fixed;
  top: 0;
  left: 100%;
  background-color: #333;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  transition: left 0.4s ease-out;
}

.gnb.active .menu-top {
  left: 0;
}

.gnb .depth1 {
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.gnb .depth1 .nav-txt {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gnb .depth1 .nav-txt .fa-caret-down {
  color: #aaa;
  transition: transform 0.2s ease-out;
}

.gnb .depth1.active .nav-txt .fa-caret-down {
  z-index: 50;
  transform: rotate(180deg);
}

.gnb .bound {
  width: 100%;
  height: 1px;
  background-color: #ddd;
}

.gnb>.ul>.bound {
  display: none;
}

.bg {
  z-index: -100;
  position: absolute;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 0 15px -2px rgba(127, 127, 127, 0.5);
  background-color: white;
  width: 100vw;
  height: 100%;
}

@media screen and (max-width: 768px) {
  .gnb>ul {
    overflow-y: scroll;
  }

  .gnb>ul::-webkit-scrollbar {
    display: none;
  }

  .gnb .depth1:first-of-type {
    margin-top: 60px;
  }
  
  .gnb .depth1 {
    height: auto;
  }
  
  .gnb .depth1>.nav-txt,
  .gnb .depth1>ul .depth2 {
    height: 60px;
    padding: 0 20px;
  }

  .gnb .depth1>.nav-txt {
    border-bottom: 1px solid #ddd;
  }

  .gnb .depth1>ul {
    background-color: #f4f4f4;
    max-height: 0vh;
    overflow: hidden;
    transition: all 0.4s ease-out;
  }

  .gnb .depth1.active>ul {
    max-height: 100vh;
    overflow: hidden;
    transition: all 0.4s ease-out;
  }
}

@media only screen and (min-width: 768.1px) {
  header {
    height: 80px;
    font-size: 20px;
  }

  .header-wrap {
    max-width: 1280px;
    height: 100%;
  }

  .logo {
    cursor: pointer;
  }
  
  .logo:hover {
    transform: scale(1.05);
  }

  .gnb {
    height: 100%;
  }

  .gnb .burger-wrap {
    display: none;
  }

  .gnb ul {
    display: flex;
    align-items: center;
    padding: 10px;
    gap: 5px;
  }

  .gnb>ul {
    position: initial;
    width: fit-content;
    height: 100%;
    background-color: transparent;
  }

  .gnb .menu-top {
    display: none;
  }
  
  .gnb .depth1,
  .gnb .depth2 {
    width: fit-content;
    padding: 0 20px;
    display: flex;
    align-items: center;
  }

  .gnb .depth2 {
    font-size: 18px;
  }
  
  .gnb .depth1>.nav-txt,
  .gnb .depth2>.nav-txt {
    transition: all 0.2s ease-out;
  }

  .gnb .depth1:hover>.nav-txt,
  .gnb .depth2:hover>.nav-txt {
    transform: scale(1.05);
    color: white;
    text-shadow: 0 0 3px black, 0 1px 1px rgba(0, 0, 0, 0.1), 1px 0 1px rgba(0, 0, 0, 0.1), 0 -1px 1px rgba(0, 0, 0, 0.1), -1px 0 1px rgba(0, 0, 0, 0.1);
  }

  .gnb .depth1 .nav-txt .fa-caret-down {
    display: none;
  }

  .gnb .depth1>ul {
    z-index: -200;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 60px;
    justify-content: center;
    background-color: white;
    box-shadow: 0 0 15px -2px  rgba(127, 127, 127, 0);
    transition: top 0.5s ease-out, box-shadow 0.5s ease-out;
  }

  .gnb .depth1.active>ul {
    top: 80px;
    /* border-bottom: 1px solid #ddd; */
    box-shadow: 0 0 15px -2px rgba(127, 127, 127, 0.5);
  }

  .gnb .depth1>ul .depth2 {
    z-index: inherit;
    height: 100%;
  }

  .gnb .bound {
    display: block;
    width: 1px;
    height: 25px;
    background-color: #ccc;
  }

  .gnb .bound:last-of-type {
    display: none;
  }
}
</style>