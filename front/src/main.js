import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import store from './store'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import defaultLayout from './layouts/defaultLayout.vue'
import boardLayout from './layouts/boardLayout.vue'
import mypageLayout from './layouts/mypageLayout.vue'
import adminLayout from './layouts/adminLayout.vue'

import mainPage from './views/main.vue'
import resPage from './views/reservation.vue'
import join from './views/join.vue'
import find from './views/find.vue'
import foodsPage from './views/foods.vue'
import scoreDetail from './mypage/scoreDetail.vue'
import chatroom from "./views/chatroom.vue";
import map from "./components/map.vue"
import joinInfo from './views/joinInfo.vue'
import scoreStandard from './views/scorestandard.vue'
import intro from './views/intro.vue'
import intro2 from './views/intro2.vue'


import boardWrite from './board/boardWrite.vue'
import freePage from './board/freeMain.vue'
import freeDetail from './board/freeDetail.vue'
import freeModify from './board/freeModify.vue'
import lostPage from './board/lostMain.vue'
import lostDetailPage from './board/lostDetail.vue'
import lostModifyPage from './board/lostModify.vue'
import noticePage from './board/noticeMain.vue'
import noticeDetail from './board/noticeDetail.vue'
import reportPage from './board/reportMain.vue'
import reportDetail from './board/reportDetail.vue'
import reportModify from './board/reportModify.vue'
import anonPage from './board/anonMain.vue'
import anonDetail from './board/anonDetail.vue'
import anonModify from './board/anonModify.vue'

import userUpdate from './mypage/userupdate.vue'
import myBoard from './mypage/myBoards.vue'
import chat from "./mypage/chat.vue";
import myPage from "./mypage/mypage.vue"
import myResList from './mypage/myResList.vue'
import pass from './mypage/pass.vue'

import chartPage from './admin/chart.vue'
import adminUserList from "./admin/userlist.vue";
import adminAnonList from "./admin/anonboardlist.vue";
import adminFreeList from "./admin/freeboardlist.vue";
import adminLostList from "./admin/lostboardlist.vue";
import adminNoticeList from "./admin/noticeboardlist.vue";
import adminReportList from "./admin/reportboardlist.vue";

const routes = [
  {
    path: '/',
    name: 'defaultLayout',
    component: defaultLayout,
    children: [
      {
        path: '',
        component: mainPage,
      },
      {
        path: 'res',
        component: resPage,
      },
      {
        path: 'join',
        component: join,
      },
      {
        path: 'find',
        component: find,
      },
      {
        path: 'map',
        component: map,
      },
      {
        path: 'joinInfo',
        component: joinInfo,
      },
      {
        path: 'scoreStandard',
        component: scoreStandard,
      },
      {
        path: 'intro',
        component: intro,
      },
      {
        path: 'intro2',
        component: intro2,
      },
      {
        path: 'foods',
        component: foodsPage,
      }
    ]
  },
  {
    path: '/mypage/',
    name: 'mypageLayout',
    component: mypageLayout,
    children: [
      {
        path: '',
        component: myPage
      },
      {
        path: 'userupdate',
        component: userUpdate
      },
      {
        path: 'boards',
        component: myBoard
      },
      {
        path: 'chat',
        component: chat,
      },
      {
        path: 'scoreDetail',
        component: scoreDetail,
      },
      {
        path: 'resList',
        component: myResList,
      },
      {
        path: 'pass',
        component: pass,
      }
    ]
  },
  {
    path: '/board/',
    name: 'boardLayout',
    component: boardLayout,
    children : [
      {
        path: 'notice',
        component: noticePage,
      },
      {
        path: 'notice/noticeDetail',
        component: noticeDetail,
      },
      {
        path: 'free',
        component: freePage,
      },
      {
        path: 'free/freeDetail',
        component: freeDetail,
      },
      {
        path: 'free/freeModify',
        component: freeModify,
      },
      {
        path: 'anon',
        component: anonPage,
      },
      {
        path: 'anon/anonDetail',
        component: anonDetail,
      },
      {
        path: 'anon/anonModify',
        component: anonModify,
      },
      {
        path: 'report',
        component: reportPage,
      },
      {
        path: 'report/reportDetail',
        component: reportDetail,
      },
      {
        path: 'report/reportModify',
        component: reportModify,
      },
      {
        path: 'lost',
        component: lostPage,
      },
      {
        path: 'lost/lostDetail',
        component: lostDetailPage,
      },
      {
        path: 'lost/lostModify',
        component: lostModifyPage,
      },
      {
        path: 'boardWrite',
        component: boardWrite,
      },
    ]
  },
  {
    path: '/admin/',
    name: 'adminLayout',
    component: adminLayout,
    children : [
      {
        path: 'chart',
        component: chartPage,
      },
      {
        path: 'userlist',
        component: adminUserList,
      },
      {
        path: 'boardlist/anon',
        component: adminAnonList,
      },
      {
        path: 'boardlist/free',
        component: adminFreeList,
      },
      {
        path: 'boardlist/lost',
        component: adminLostList,
      },
      {
        path: 'boardlist/notice',
        component: adminNoticeList,
      },
      {
        path: 'boardlist/report',
        component: adminReportList,
      }
    ]
  },
  {
    path: '/chat',
    component: chat,
  },
  {
    path: '/chatroom/:id',
    component: chatroom,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
});

const app = createApp(App)
app.use(router);
app.use(store);
app.use(VueSweetalert2);
app.mount('#app');
