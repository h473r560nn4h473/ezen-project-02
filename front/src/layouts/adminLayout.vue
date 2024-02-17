<template>
  <div class="burger">
    <i class="fa-solid fa-bars"></i>
  </div>
  <ul class="sidebar">
    <li class="sidebar-title">
      <span>관리자메뉴</span>
    </li>
    <li class="sidebar-menu clickable" @click="goToMain()">
      <i class="fa-solid fa-house sidebar-icon"></i>
      <span>홈페이지</span>
    </li>
    <li class="sidebar-menu" :class="{ 'active': currentPath.includes('/admin/userlist'), 'clickable': currentPath !== '/admin/userlist' }" @click="handleClick('/admin/userlist', $event)">
      <i class="fa-solid fa-user-gear sidebar-icon"></i>
      <span>회원관리</span>
    </li>
    <li class="sidebar-menu" :class="{ 'active': currentPath.includes('/admin/boardlist'), 'clickable': currentPath !== '/admin/boardlist/notice' }" @click="handleClick('/admin/boardlist/notice', $event)">
      <i class="fa-solid fa-list sidebar-icon"></i>
      <span>게시판관리</span>
    </li>
    <li class="sidebar-menu" :class="{ 'active': currentPath.includes('/admin/chart'), 'clickable': currentPath !== '/admin/chart' }" @click="handleClick('/admin/chart', $event)">
      <i class="fa-solid fa-chart-pie sidebar-icon"></i>
      <span>통계</span>
    </li>
  </ul>
  <div class="content-wrap">
    <router-view />
  </div>
</template>

<script>
export default {	
  data() {
    return {
      currentPath: this.$route.path
    };
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
    goToMain() {
      this.$router.push({ path: '/' });
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.burger {
  z-index: 50;
  position: fixed;
  bottom: 50px;
  left: 50px;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  color: #666;
  background-color: white;
  box-shadow: 2px 2px 7px -1px rgba(0, 0, 0, 0.4);
  transition: all 0.2s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.burger:hover {
  color: var(--color-main);
  transform: scale(1.02);
  box-shadow: 2px 2px 7px -1px rgba(0, 0, 0, 0.6);
}

.sidebar {
  z-index: 40;
  position: fixed;
  top: 0;
  left: -212px;
  width: 200px;
  height: 100dvh;
  background-color: white;
  box-shadow: 3px 3px 15px -3px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: hidden;
}

.sidebar-title ,
.sidebar-menu {
  height: 4em;
  padding: 0 20px;
  align-items: center;
}

.sidebar-title {
  display: none;
  font-size: 1.1em;
  font-weight: 700;
}

.sidebar-menu {
  display: flex;
  gap: 1.2em;
  position: relative;
  color: #666;
  transition: all 0.2s ease-out;
}

.sidebar-menu:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.sidebar-menu:not(.active):hover ,
.sidebar-menu.active {
  color: var(--color-main);
}

.sidebar-menu.clickable {
  cursor: pointer;
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

@media screen and (min-width: 769px) {
  .sidebar {
    left: 0;
  }

  .sidebar-title {
    display: flex;
  }

  .sidebar-menu span {
    display: inline-block;
  }

  .content-wrap {
    padding-left: 200px;
  }
}
</style>