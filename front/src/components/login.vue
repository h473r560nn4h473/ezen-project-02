<template>
  <div class="wrap">
    <div v-if="user.user_no" class="flex-wrap">
      <div class="top-wrap">
        <div class="pic-greet-wrap">
          <div class="profile-pic">
            <img v-if="loginUser.USER_IMG" :src="require(`../../../back/uploads/uploadUser/` + `${loginUser.USER_IMG}`)" alt="사용자 사진">
            <i v-else class="fa-solid fa-user"></i>
          </div>
          <div class="greet">
            <span class="name">{{ loginUser.USER_NM }}</span>
            <span class="greet-text">님 환영합니다!</span>
          </div>
        </div>
        <div v-if="loginUser.USER_TP == 0" class="alarm-info-wrap">
          <div v-if="isAlarm" class="alarm on" @click="this.$router.push('/mypage/chat')">
            <i class="fa-solid fa-comments"></i>
            <div class="alarm-count">{{ chat_Alarm }}</div>
          </div>
          <div v-else class="alarm off" @click="this.$router.push('/mypage/chat')">
            <i class="fa-regular fa-comments"></i>
          </div>
          <div class="info-fix" title="내 정보 수정" @click="this.$router.push('/mypage/userupdate')">
            <i class="fa-solid fa-gear"></i>
          </div>
        </div>
      </div>
      <div v-if="loginUser.USER_TP == 0" class="login-profile">
        <span class="subj">학번</span>
        <span class="bar"></span>
        <span>{{ loginUser.USER_HNO }}</span>
        <span class="subj">이메일</span>
        <span class="bar"></span>
        <span>{{ loginUser.USER_MAIL }}</span>
        <span class="subj">전화번호</span>
        <span class="bar"></span>
        <span>{{ loginUser.USER_PH }}</span>
      </div>
      <div v-else class="login-profile">
        <span class="subj">이메일</span>
        <span class="bar"></span>
        <span>{{ loginUser.USER_MAIL }}</span>
        <span class="subj">전화번호</span>
        <span class="bar"></span>
        <span>{{ loginUser.USER_PH }}</span>
      </div>
      <div class="detail">
        <div class="btn-big" @click="logout()">로그아웃</div>
        <div v-if="loginUser.USER_TP == 0" class="btn-big" v-show="!showMyPageButton" @click="mypage()">마이페이지</div>
        <div v-else class="btn-big" v-show="!showMyPageButton" @click="adminpage()">관리자페이지</div>
      </div>
    </div>
    <div v-else class="flex-wrap">
      <div class="input-row">
        <label for="user_id" class="blind">아이디</label>
        <input type="text" id="user_id" @keyup.enter="login()" placeholder="아이디" v-model="user_id" />
      </div>
      <div class="input-row input-pw">
        <label for="user_pw" class="blind">비밀번호</label>
        <input type="password" id="user_pw" @keyup.enter="login()" placeholder="비밀번호" v-model="user_pw" />
        <div class="eye" @click="oneyes('user_pw')"><i class="fa-solid fa-eye"></i></div>
      </div>
      <button type="button" class="btn-big" @click="login()">로그인</button>
      <div class="btn-text-wrap">
        <button class="btn-text" @click="find()">아이디/비밀번호 찾기</button>
        <button class="btn-text" @click="join()">회원가입</button>
      </div>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      user_id: '',
      user_pw: '',
      loginUser: {},
      isAlarm: false,
      chat_Alarm: 0
    };
  },
  mounted() {
    if (this.user.user_no != '') {
      this.getUser();
    }
  },
  created() {
    // 페이지가 생성될 때 알람 데이터를 가져오기
    this.getAlarm();
  },
  watch: {
    chat_Alarm(newValue) {
      // chat_Alarm 값이 변경될 때마다 호출되는 로직
      this.isAlarm = newValue > 0;
    
    },
  },
  computed: {
    user() {
      return this.$store.state.user; // user 정보가 바뀔 때마다 자동으로 user() 갱신
    },
    showMyPageButton() {
      // 현재 경로에 따라 적절한 조건을 설정하세요.
      // 아래는 현재 경로가 '/mypage'를 포함하는 경우에만 버튼을 표시하는 예제입니다.
      return this.$route.path.includes('/mypage');
    },
  },
  methods: {
    login() {
      axios({
        url: "http://localhost:3000/auth/login_process",
        method: "POST",
        data: {
          user_id: this.user_id,
          user_pw: this.user_pw
        },
      })
        .then(res => {
          if (res.data.message == 'undefined_id') {
            this.$swal({
              icon: 'warning',
              title: '존재하지 않는 아이디입니다.'
            })
          }
          else if (res.data.message == 'incorrect_pw') {
            this.$swal({
              icon: 'warning',
              title: '비밀번호가 틀렸습니다.'
            })
          }
          else {
            this.$store.commit("user", { user_id: this.user_id, user_no: res.data.message })
            this.$swal({
              icon: 'success',
              title: '로그인 성공!',
              showConfirmButton: false,
              timer: 1500
            })
            this.$router.go(0); 
            
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    async logout() {
      try {
        this.$store.commit("user", {});
        await this.$swal({
          icon: 'success',
          title: '로그아웃되셨습니다.',
          showConfirmButton: false,
          scrollbarPadding: false,
          timer: 1500
        });
        window.location.href = "http://localhost:8080";
      } catch (err) {
        console.log(err);
      }
    },
    async getUser() {
      try {
    // 사용자 번호가 정의되어 있는지 확인
      
      //console.log(this.user.user_no);
      
      const response = await axios.get(`http://localhost:3000/mypage/getUserData/${this.user.user_no}`);
      this.loginUser = response.data[0];
      console.log(this.loginUser);
    
      } catch (error) {
        console.error(error);
      }
    },
    oneyes(field) {
      const passwordInput = document.querySelector(`#${field}`);
      const eyeIcon = document.querySelector(`#${field} + .eye`);
      let isMouseDown = false;

      eyeIcon.addEventListener("mousedown", () => {
        passwordInput.type = "text";
        eyeIcon.style = "color: #333";
        isMouseDown = true;
      });

      eyeIcon.addEventListener("click", () => {
        passwordInput.type = "password";
        eyeIcon.style = "color: #999";
        isMouseDown = false;
      });

      eyeIcon.addEventListener("mouseenter", () => {
        passwordInput.type = "password";
        eyeIcon.style = "color: #999";
        isMouseDown = false;
      });

      eyeIcon.addEventListener("mouseleave", () => {
        passwordInput.type = "password";
        eyeIcon.style = "color: #ccc";
        isMouseDown = false;
      });
    },
    join() {
      this.$router.push({ path: '/join' })
    },
    find() {
      this.$router.push({ path: '/find' })
    },
    mypage() {
      this.$router.push({ path: '/mypage'})
    },
    adminpage() {
      this.$router.push({ path: '/admin/userlist'})
    },
    async getAlarm() {
      try {
        const resAlarm = await axios.get(`http://localhost:3000/chat/getChatAlram/${this.user.user_no}`);
        this.chat_Alarm = resAlarm.data[0].count;
      } catch (error) {
        console.error(error);
      }
    } 
  }
}
</script>

<style src="../assets/css/global.css" scoped></style>
<style scoped>
.wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.flex-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
}

.top-wrap {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.pic-greet-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.greet {
  max-width: 100%;
  font-size: 1.2em;
  white-space: nowrap;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.3em;
}

.name ,
.greet-text {
  font-weight: 500;
  line-height: 1;
}

.greet-text {
  font-size: 0.8em;
}

.alarm-info-wrap {
  font-size: 1.2em;
  line-height: 1;
  display: flex;
  align-items: center;
  gap: 5px;
}

.alarm ,
.info-fix {
  padding: 0.2em;
  cursor: pointer;
  transition: all 0.2s ease-out;
}

.alarm.on {
  color: var(--color-main);
  position: relative;
}

.alarm.on:hover {
  color: var(--color-main-dark);
}

.alarm-count {
  font-size: 8px;
  width: 14px;
  height: 14px;
  border: 1px solid white;
  border-radius: 7px;
  background-color: var(--color-red);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: -4px;
  bottom: -4px;
}

.alarm.off {
  color: #999;
}

.alarm.off:hover {
  color: var(--color-main);
}

.info-fix {
  color: var(--color-main);
  cursor: pointer;
  transition: all 0.2s ease-out;
}

.info-fix:hover {
  color: var(--color-main-dark);
}

.login-profile {
  display: grid;
  grid-template-columns: 5fr 1fr 8fr;
  gap: 10px;
  align-items: center;
  white-space: nowrap;
}

.subj {
  color: var(--color-main);
  font-weight: 500;
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-row {
  position: relative;
}

.input-row input {
  width: 100%;
}

.eye {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: transparent;
  padding: 0.5em 0.7em;
  cursor: pointer;
  color: #ccc;
}

.eye:hover {
  color: #999;
}

.btn-text-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
</style>