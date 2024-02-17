<template>
  <Header />
  <div class="main-wrap">
    <main class="wrap">
      <div class="board-wrap">
        <div class="title">
          <h1>게시판</h1>
        </div>
        <div class="theme-wrap">
          <div class="theme" :class="{ 'active': currentPath.includes('/board/notice'), 'clickable': currentPath !== '/board/notice' }" @click="handleClick('/board/notice', $event)">공지사항</div>
          <div class="bar"></div>
          <div class="theme" :class="{ 'active': currentPath.includes('/board/free'), 'clickable': currentPath !== '/board/free' }" @click="handleClick('/board/free', $event)">자유</div>
          <div class="bar"></div>
          <div class="theme" :class="{ 'active': currentPath.includes('/board/anon'), 'clickable': currentPath !== '/board/anon' }" @click="handleClick('/board/anon', $event)">익명</div>
          <div class="bar"></div>
          <div class="theme" :class="{ 'active': currentPath.includes('/board/report'), 'clickable': currentPath !== '/board/report' }" @click="handleClick('/board/report', $event)">신고</div>
          <div class="bar"></div>
          <div class="theme" :class="{ 'active': currentPath.includes('/board/lost'), 'clickable': currentPath !== '/board/lost' }" @click="handleClick('/board/lost', $event)">분실물</div>
        </div>
        <router-view />
      </div>
      <div class="login-wrap">
        <div class="grid-box">
          <Login />
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
    }
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
  }
  }
}
</script>

<style src="../assets/css/global.css" scoped></style>
<style src="../assets/css/board.css" scoped></style>
<style scoped>
.login-wrap {
  display: none;
  flex-shrink: 1;
  padding: 0 20px 0 0;
  margin-top: 12.6em;
}

.grid-box {
  height: fit-content;
}

@media screen and (min-width: 768.1px) {
  .login-wrap {
    display: block;
  }
}
</style>
