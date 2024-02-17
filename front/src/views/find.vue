<template>
  <main class="wrap">
    <div class="inner-wrap">
      <h1 class="title">아이디/비밀번호 찾기</h1>
      <div class="grid-box">
        <div class="tab-list">
          <div role="tab" id="tab1" class="tab" @click="handleTabClick('btn_id')" :class="{ active: isTabActive('btn_id') }">아이디 찾기</div>
          <div role="tab" id="tab2" class="tab" @click="handleTabClick('btn_pw')" :class="{ active: isTabActive('btn_pw') }">비밀번호 찾기</div>
        </div>
        <div class="form-wrap">
          <div class="form" v-show="isTabActive('btn_id')">
            <div class="form-title">전화번호</div>
            <div class="input-row">
              <input type="tel" @input="validatePhoneNumber" minlength="10" maxlength="11" placeholder="- 없이 숫자만 입력" v-model="user_ph" />
            </div>
            <button type="button" class="btn-small" @click="findID()">아이디 찾기</button>
            <div v-if="response_id_check" class="response">
              <div class="id-notice">아이디는 <span class="user-info">{{ search_user_id }}</span>입니다. </div>
            </div>
            <div class="btn-area">
              <button type="button" class="btn-login btn-big" @click="goToLogin">로그인</button>
            </div>
          </div>
          <div class="form" v-show="isTabActive('btn_pw')">
            <div class="form-title">아이디</div>
            <div class="input-row">
              <input type="test" placeholder="아이디" @value="foundID()" v-model="user_id" />
            </div>
            <div class="form-title">전화번호</div>
            <div class="input-row">
              <input type="tel" minlength="10" maxlength="11" placeholder="- 없이 숫자만 입력" v-model="user_ph" />
            </div>
            <button type="button" class="btn-small" @click="findPW()">비밀번호 찾기</button>
            <div v-if="response_pw_check" class="response">
              <div class="id-notice">임시 비밀번호는 <span class="user-info">{{ user_pw }}</span>입니다.</div>
              <div class="id-notice">로그인 후 꼭 변경해주세요.</div>
            </div>
            <div class="btn-area">
              <button type="button" class="btn-login btn-big" @click="goToLogin">로그인</button>
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
  data() {
    return {
      activeTab: 'btn_id',     // 초기에 보여질 탭 버튼
      user_ph: '',
      user_id: '',            // password 변경 용 입력한 아이디
      user_pw: '',
      search_user_id: '',     // id 찾기로 받은 아이디
      response_id_check: false,
      response_pw_check: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    goToLogin() {
      this.$router.push({ path: '/' });
    },
    handleTabClick(tab) {
      this.activeTab = tab; // 클릭한 탭 버튼으로 activeTab 값을 업데이트
    },
    isTabActive(tab) {
      return this.activeTab === tab; // 현재 활성화된 탭인지 확인하는 메서드
    },
    mounted() {  // 선택된 탭 버튼의 텍스트 색상 변경
      const selectedTab = document.querySelector(`${this.activeTab} button`);
      if (selectedTab) {
        selectedTab.style.color = '#cc8c00';
      }
    },
    findID() {
      if (this.user_ph === '') {
        this.$swal({
          icon: 'warning',
          title: '휴대전화번호를 입력해주세요.'
        });
      } else {
        axios.post('http://localhost:3000/auth/findId', {
          user_ph: this.user_ph
        })
          .then((res) => {
            if (res.data.message === 'user_ph') {
              this.search_user_id = res.data.user_id;
              this.response_id_check = true;
              this.user_id = this.search_user_id;
            } else {
              this.$swal({
                icon: 'error',
                title: '알 수 없는 오류가 발생했습니다.'
              });
            }
          })
          .catch((error) => {
            console.log(error);
            this.$swal({
              icon: 'error',
              title: '해당 휴대전화번호가 없습니다.'
            });
            // 이메일 전송 실패 시 처리할 작업 수행
          });
      }
    },
    findPW() {
      if (this.user_id === '' || this.user_ph === '') {
        this.$swal({
          icon: 'warning',
          title: '아이디와 휴대전화번호를 입력해주세요'
        });
      } else {
        axios.post('http://localhost:3000/auth/findPw', {
          user_id: this.user_id,
          user_ph: this.user_ph
        })
          .then((res) => {
            this.user_pw = res.data.message;
            this.response_pw_check = true;
          })
          .catch((error) => {
            console.log(error);
            this.$swal({
              icon: 'error',
              title: '정보 확인에 실패했습니다.'
            });
          });
      }
    },
    validatePhoneNumber() {
      this.user_ph = this.user_ph.replace(/\D/g, ''); // 숫자 이외의 문자 제거
    }
  }
}
</script>

<style src="../assets/css/global.css" scoped />
<style scoped>
main.wrap {
  max-width: 600px;
}

.grid-box {
  padding: 0;
}

.grid-box:hover {
  transform: none;
}

.tab-list {
  display: flex;
}

.tab {
  height: 50px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: none;
  position: relative;
  transition: all 0.2s ease-out;
}

.tab::after {
  content: '';
  display: block;
  width: 30px;
  height: 4px;
  border-radius: 2px;
  position: absolute;
  bottom: 0;
  left: calc(50% - 15px);
  transition: all 0.2s ease-out;
}

.tab:not(.active) {
  color: #ccc;
  cursor: pointer;
}

.tab:not(.active):hover ,
.tab.active {
  color: inherit;
  font-weight: 500;
}

.tab:not(.active):hover::after ,
.tab.active::after {
  background-color: var(--color-main);
}

.form-wrap {
  padding: 70px 30px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-title {
  font-size: 16px;
  font-weight: 500;
}

.input-row input {
  width: 100%;
  padding: 0.5em 0;
}

.btn-small {
  align-self: center;
}

.response {
  margin-bottom: 50px;
  text-align: center;
}

.response .id-notice:not(:last-child) {
  margin-bottom: 20px;
}

.response .user-info {
  color: var(--color-main);
  font-size: 1.2em;
  font-weight: 500;
  margin: 0 7px;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text; 
  user-select: text;
}

.btn-area {
  display: flex;
  justify-content: center;
}

.btn-login {
  max-width: 200px;
}
</style>