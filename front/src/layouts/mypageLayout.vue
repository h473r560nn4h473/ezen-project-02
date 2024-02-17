<template>
  <Header />
  <div class="main-wrap">
    <main class="wrap">
      <div class="inner-wrap">
        <div class="title">마이페이지</div>
        <div class="flex-wrap">
          <div class="side-wrap">
            <div class="grid-box">
              <Login />
            </div>
            <div class="grid-box sidebar">
              <div class="sidebar-menu" :class="{ 'active': currentPath === '/mypage' || currentPath === '/mypage/', 'clickable': currentPath !== '/mypage' || currentPath !== '/mypage/' }" @click="handleClick('/mypage', $event)">
                <i class="fa-solid fa-house-user sidebar-icon"></i>
                <span>마이페이지 홈</span>
              </div>
              <div class="sidebar-menu" :class="{ 'active': currentPath.includes('/mypage/boards'), 'clickable': currentPath !== '/mypage/boards' }" @click="handleClick('/mypage/boards', $event)">
                <i class="fa-solid fa-pen sidebar-icon"></i>
                <span>내 게시글</span>
              </div>
              <div class="sidebar-menu" :class="{ 'active': currentPath.includes('/mypage/chat'), 'clickable': currentPath !== '/mypage/chat' }" @click="handleClick('/mypage/chat', $event)">
                <i class="fa-solid fa-comments sidebar-icon"></i>
                <span>채팅 목록</span>
              </div>
            </div>
          </div>
          <div class="content" :class="getClassForRoute()">
            <router-view />
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>
<script>
import Header from './header.vue'
import Footer from './footer.vue'
import Login from '../components/login.vue'

export default {	
  data() {
    return {
      currentPath: this.$route.path
    };
  },
  components: {
    Header, Footer, Login
  },
  watch: {
    '$route'(to) {
      this.currentPath = to.path
    }
  },
  methods: {
    handleClick(path, event) {
      const clickedElement = event.currentTarget;

      if (!clickedElement.classList.contains('active') && this.currentPath !== path) {
        this.$router.push({ path: path });
      }
    },
    getClassForRoute() {
      // 현재 라우터의 경로를 확인
      const currentPath = this.$route.path;

      // 경로에 따라 다르게 클래스를 할당
      if (currentPath === '/mypage' || currentPath === '/mypage/' || currentPath === '/mypage/boards' || currentPath === '/mypage/resList') {
        return 'content-wrap';
      } 
      else {
        // 기본적으로 할당할 클래스
        return 'grid-box';
      }
    },
  }
}
</script>

<style src="../assets/css/global.css" scoped></style>
<style src="../assets/css/board.css" scoped></style>
<style scoped>
.main-wrap {
  min-height: 100dvh;
}

.flex-wrap {
  display: flex;
  gap: 20px;
}

.side-wrap {
  width: fit-content;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar {
  width: fit-content;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: hidden;
}

.sidebar-menu {
  height: 4em;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 1.2em;
  position: relative;
  color: #666;
  transition: all 0.2s ease-out;
}

.sidebar-menu:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.sidebar-menu:not(.active) {
  cursor: pointer;
}

.sidebar-menu:not(.active):hover ,
.sidebar-menu.active {
  color: var(--color-main);
}

.sidebar-menu::before {
  content: '';
  display: block;
  width: 6px;
  height: 2em;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: -6px;
  transform: translateY(-50%);
  background-color: var(--color-main);
  transition: left 0.2s ease-out;
}

.sidebar-menu:hover::before ,
.sidebar-menu.active::before {
  left: -3px;
}

.sidebar-icon {
  width: 1.2em;
  font-size: 1.2em;
}

.sidebar-menu span {
  display: none;
  font-weight: 500;
}

.grid-wrap {
  padding: 0;
  height: fit-content;
}

.content-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.flex-wrap .grid-box {
  width: 100%;
  height: fit-content;
}

.content {
  padding: 30px;
}

.content:hover {
  transform: none;
}

@media screen and (min-width: 769px) {
  .sidebar {
    width: 100%;
  }

  .sidebar-menu span {
    display: inline-block;
  }
}
</style>