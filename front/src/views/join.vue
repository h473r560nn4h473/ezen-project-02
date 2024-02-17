<template>
  <main class="wrap">
    <div class="inner-wrap">
      <div class="title">회원가입</div>
      <form id="sendForm" class="grid-box" @submit.prevent="onSubmitForm">
        <div class="vital"><span class="red">*</span> 별표 표시된 항목들은 필수 항목입니다.</div>
        <div class="input-wrap">
          <div class="item">아이디 <span class="red">*</span></div>
          <div class="input-row">
            <input class="input" type="text" v-model="user_id" :minlength="min_uid" :maxlength="max_uid" placeholder="영문, 숫자 조합 3~20자" @input="checkUidControl" />
          </div>
          <button class="btn-small" @click.prevent="checkDuplicate($event)" v-bind:disabled="errorUid !== false">중복확인</button>
        </div>
        <div class="warning-row">
          <div class="warning" :class="{ active: errorUid }">영문, 숫자 조합 3~20자</div>
          <div class="warning" :class="{ active: !errorUid }">{{ message }}</div>
        </div>
        <div class="input-wrap">
          <div class="item">비밀번호 <span class="red">*</span></div>
          <div class="input-row">
            <input class="input" type="password" id="user_pw_eye" v-model="user_pw" :minlength="min_upw" placeholder="영문, 숫자, 특수문자 조합 8자 이상" @input="checkUpw1" />
            <div class="eye" @click="oneyes('user_pw_eye')"><i class="fa-solid fa-eye"></i></div>
          </div>
        </div>
        <div class="warning-row">
          <div class="warning" :class="{ active: errorUpw }">영문, 숫자, 특수문자 조합 8자 이상</div>
        </div>
        <div class="input-wrap">
          <div class="item">비밀번호 확인 <span class="red">*</span></div>
          <div class="input-row">
            <input class="input" type="password" id="user_pw_ck_eye" v-model="user_pw_ck" placeholder="비밀번호 재입력" @input="checkUpw2" />
            <div class="eye" @click="oneyes('user_pw_ck_eye')"><i class="fa-solid fa-eye"></i></div>
          </div>
        </div>
        <div class="warning-row">
          <div class="warning" :class="{ active: errorUpw2 }">비밀번호가 일치하지 않습니다.</div>
        </div>
        <div class="input-wrap">
          <div class="item">이름 <span class="red">*</span></div>
          <div class="input-row">
            <input type="text" id="name" v-model="user_nm" @input="checkUnm" />
          </div>
        </div>
        <div class="warning-row">
          <div class="warning" :class="{ active: errorUnm }">이름을 입력하세요.</div>
        </div>
        <div class="input-wrap">
          <div class="item">닉네임 <span class="red">*</span></div>
          <div class="input-row">
            <input class="input" type="text" v-model="user_nick" placeholder="특수문자 제외 2~20자 이내" @input="checkUnickControl" />
          </div>
          <button class="btn-small" @click.prevent="checknickDuplicate($event)" v-bind:disabled="errorUnick !== false">중복확인</button>
        </div>
        <div class="warning-row">
          <div class="warning" :class="{ active: errorUnick }">특수문자 제외 2~20자 이내</div>
          <div class="warning" :class="{ active: !errorUnick }">{{ message2 }}</div>
        </div>
        <div class="input-wrap">
          <div class="item">전화번호 <span class="red">*</span></div>
          <div class="input-row">
            <input class="input" type="tel" @input="checkUph" v-model="user_ph" :minlength="min_uph" :maxlength="max_uph" />
          </div>
        </div>
        <div class="warning-row">
          <div class="warning" :class="{ active: errorUph }">전화번호를 입력하세요.</div>
        </div>
        <div class="input-wrap">
          <div class="item">학번 <span class="red">*</span></div>
          <div class="input-row">
            <input class="input" type="text" @input="checkUhno" v-model="user_schno" :minlength="min_schno" :maxlength="max_schno" />
          </div>
        </div>
        <div class="warning-row">
          <div class="warning" :class="{ active: errorUhno || errorUhno2 }">
            <span v-if="errorUhno">학번을 입력하세요.</span>
            <span v-else-if="errorUhno2" >7-10자 숫자입니다.</span>
            <span v-else>&nbsp;</span>
          </div>
        </div>
        <div class="input-wrap">
          <div class="item">이메일 <span class="red">*</span></div>
          <div class="input-row">
            <input class="input" type="text" @input="checkEmail" v-model="user_email">
          </div>
        </div>
        <div class="warning-row">
          <div class="warning" :class="{ active: errorUmail }">이메일을 입력하세요.</div>
        </div>
        <div class="input-wrap">
          <div class="item">성별 <span class="red">*</span></div>
          <div class="radio-wrap">
            <div class="radio-box">
              <input type="radio" id="male" name="sex" v-model="user_sex" :value="1" @input="checkUsx" />
              <label for="male" class="radio-sex">남</label>
            </div>
            <div class="radio-box">
              <input type="radio" id="female" name="sex" v-model="user_sex" :value="2" @input="checkUsx" />
              <label for="female" class="radio-sex">여</label>
            </div>
          </div>
        </div>
        <div class="warning-row">
          <div class="warning" :class="{ active: errorUsx }">성별을 입력하세요.</div>
        </div>
        <div class="input-wrap address">
          <div class="item">주소</div>
          <div class="input-row zipcode">
            <input type="text" placeholder="우편번호" v-model="zonecode" readonly @click="openPostcode" />
          </div>
          <button class="btn-small" type="button" id="postcode" @click="openPostcode">검색</button>
          <div class="input-row">
            <input type="text" v-model="roadAddress" placeholder="주소" readonly />
          </div>
        </div>
        <div class="input-wrap">
          <div class="item"></div>
          <div class="input-row">
            <input type="text" v-model="detailAddress" placeholder="상세주소" />
          </div>
        </div>
        <div class="warning-row">
          <div class="warning" :class="{ active: errorZonecode }">주소를 입력하세요.</div>
        </div>
        <div class="btn-area">
          <button class="btn-small" type="submit" :disabled="check_final">가입</button>
          <button class="btn-small btn-red" @click="goBack">뒤로가기</button>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user_id: '',
      user_pw: '',
      user_nm: '',
      user_nick: '',
      user_ph: '',
      user_schno: '',
      user_email: '',
      user_sex: [],
      zonecode: '',
      roadAddress: '',
      detailAddress: '',
      message: '',
      message2:'',

      user_pw_ck: '',
      errorUid: undefined,
      errorDup: undefined,
      errorDup2: undefined,
      errorUpw: undefined,
      errorUpw2: undefined,
      errorUnm: undefined,
      errorUnick: undefined,
      errorUph: undefined,
      errorUhno: undefined,
      errorUhno2: undefined,
      errorUmail: undefined,
      errorUsx: undefined,
      errorZonecode: undefined,

      min_uid: 3,
      max_uid: 20,
      min_upw: 8,
      min_uph: 10,
      max_uph: 11,
      min_schno: 7,
      max_schno: 10,
    }
  },
  computed: {
    check_final() {
      const fields = ['errorUid', 'errorDup', 'errorUpw', 'errorUpw2', 'errorUnm','errorUnick', 'errorUph', 'errorUhno', 'errorUmail', 'errorUsx', 'errorZonecode'];
      for (let check = 0; check < fields.length; check++) {
        if (this[fields[check]] === undefined || this[fields[check]]) {
          console.log(`Error in ${fields[check]}: ${this[fields[check]]}`);
          return true;
        }
      }
      return false;
    }
  },
  watch: {
    zonecode() { //우편번호유효성체크
      if (this.zonecode !== '') {
        this.errorZonecode = false;
      } else {
        this.errorZonecode = true;
      }
    },
  },
  methods: {
    onSubmitForm() {
      if (!this.validationCheck()) {
        return;
      }
      axios({
        url: "http://localhost:3000/auth/join_process",
        method: "POST",
        data: {
          user_id: this.user_id,
          user_pw: this.user_pw,
          user_nm: this.user_nm,
          user_nick: this.user_nick,
          user_ph: this.user_ph,
          user_hno: this.user_schno,
          user_email: this.user_email,
          user_sex: this.user_sex,
          zonecode: this.zonecode,
          roadAddress: this.roadAddress,
          detailAddress: this.detailAddress,
        },
      })
        .then(res => {
          if (res.data.message == 'already_exist_id') {
            this.$swal({
              icon: 'warning',
              title: '이미 존재하는 아이디입니다.'
            })
          }
          else if (res.data.message == 'DB_error') {
            this.$swal({
              icon: 'error',
              title: 'DB 에러 발생'
            })
          }
          else {
            this.$swal({
              icon: 'success',
              title: '회원 가입 성공!',
              showConfirmButton: false,
              timer: 1500
            })
            this.$router.push({ path: '/' }); 
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    validationCheck() {
      if (this.errorUid == true) {
        this.$swal('아이디조건불충족');
        return false;
      }

      if (this.errorUpw == true) {
        this.$swal('비밀번호조건불충족');
        return false;
      }

      if (this.errorUpw2 == true) {
        this.$swal('비밀번호확인조건불충족');
        return false;
      }

      if (this.errorUnm == true) {
        this.$swal('이름조건불충족');
        return false;
      }

      if (this.errorUnick == true) {
        this.$swal('닉네임조건불충족');
        return false;
      }

      if (this.errorUph == true) {
        this.$swal('전화번호조건불충족');
        return false;
      }

      if (this.errorUhno == true) {
        this.$swal('학번조건불충족');
        return false;
      }

      if (this.errorUmail == true) {
        this.$swal('이메일조건불충족');
        return false;
      }

      if (this.errorUsx == true) {
        this.$swal('성별조건불충족');
        return false;
      }

      if (this.errorZonecode == true) {
        this.$swal("우편번호를 입력하세요.");
        return false;
      }
      return true;
    },
    openPostcode() {  //우편주소 메소드
      new window.daum.Postcode({
        oncomplete: (data) => {
          console.log(data);
          this.zonecode = data.zonecode;
          this.roadAddress = data.roadAddress;
        },
      }).open();
    },
    validateInput(input, field) { //숫자 이외의 문자 제거
      this[field] = input.replace(/\D/g, '');
    },
    goBack() {
      this.$router.go(-1);
    },
    checkUid() {
      const validateUid = /^\s*(?=.*[a-z])(?=.*\d)[a-z\d\s]{3,20}\s*$/i;
      this.user_id = this.user_id.replace(/\s+/g, '');
      if (this.user_id === '') {
        this.errorUid = undefined;
        this.errorDup = undefined;
      } else if (validateUid.test(this.user_id)) {
        this.errorUid = false
      } else {
        this.errorUid = true
      }
    },
    checkDuplicate(event) {
      event.stopPropagation();  //중복확인 버튼 클릭시 부모 @submit.prevent="onSubmitForm"가 같이 실행되는데 이를 방지하기 위함
      axios({
        url: "http://localhost:3000/auth/idcheck",
        method: "POST",
        data: {
          user_id: this.user_id,
        },
      })
        .then(response => {
          if (response.data === '중복') {
            this.message = '중복된 아이디입니다.'
            this.user_id = ''
            this.errorDup = true
          } else if (response.data === '확인') {
            this.message = '사용 가능한 아이디입니다.'
            this.errorDup = false
          } else {
            console.log("중복체크고장")
            this.errorDup = true
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    warningDup() {
      if (this.errorUid) {
        this.message = '';
        this.errorDup = undefined;
      }
    },
    
    warningDup2() {
      if (this.errorUnick) {
        this.message = '';
        this.errorDup2 = undefined;
      }
    },
    checkUnick() {
      const validateUnick =  /^[\w\Wㄱ-ㅎㅏ-ㅣ가-힣]{2,20}$/;
      if (this.user_nick === '') {
        this.errorUnick = undefined;
        this.errorDup2 = undefined;
      } else if (validateUnick.test(this.user_nick)) {
        this.errorUnick = false
      } else {
        this.errorUnick = true
      }
    },
    checknickDuplicate(event) {
      event.stopPropagation();  //중복확인 버튼 클릭시 부모 @submit.prevent="onSubmitForm"가 같이 실행되는데 이를 방지하기 위함
      axios({
        url: "http://localhost:3000/auth/nickcheck",
        method: "POST",
        data: {
          user_nick: this.user_nick,
        },
      })
        .then(response => {
          if (response.data === '중복') {
            this.message2 = '중복된 닉네임입니다.'
            this.user_nick = ''
            this.errorDup2 = true
          } else if (response.data === '확인') {
            this.message2 = '사용 가능한 닉네임입니다.'
            this.errorDup2 = false
          } else {
            console.log("중복체크고장")
            this.errorDup2 = true
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    checkUidControl() {
      this.warningDup();
      this.checkUid();
    },
    checkUnickControl() {
      this.warningDup2();
      this.checkUnick();
    },
    checkUpw() { //비밀번호유효성체크
      const validateUpw = /^\s*(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}\s*$/;
      if (this.user_pw === '') {
        this.errorUpw = undefined
      } else if (validateUpw.test(this.user_pw)) {
        this.errorUpw = false
      } else {
        this.errorUpw = true
      }
    },
    checkUpw1() {
      this.checkUpw();
      this.checkUpw2();
    },
    checkUpw2() {
      if (this.user_pw_ck === '') {
        this.errorUpw2 = undefined
      } else if (this.user_pw_ck === this.user_pw) {
        this.errorUpw2 = false;
      } else {
        this.errorUpw2 = true;
      }
    },

    oneyes(field) {
      const passwordInput = document.querySelector(`#${field}`);
      const eyeIcon = document.querySelector(`#${field} + .eye`);
      let isMouseDown = false;

      eyeIcon.addEventListener("mousedown", () => {
        passwordInput.type = "text";
        eyeIcon.style = "color: #666";
        isMouseDown = true;
      });

      document.addEventListener("mouseup", () => {
        passwordInput.type = "password";
        eyeIcon.style = "color: #999";
        isMouseDown = false;
      });

      passwordInput.addEventListener("blur", () => {
        passwordInput.type = "password";
        eyeIcon.style = "color: #999";
        isMouseDown = false;
      });

      passwordInput.addEventListener("focus", () => {
        if (isMouseDown) {
          passwordInput.type = "text";
          eyeIcon.style = "color: #666";
        }
      });
    },
    checkUnm() { //이름유효성체크
      if (this.user_nm !== '') {
        this.errorUnm = false;
      } else {
        this.errorUnm = true;
      }
    },
    checkUph() { //전화번호유효성체크
      const validateUph = /^[0-9]{10,11}$/
      this.validateInput(this.user_ph, 'user_ph');

      if (validateUph.test(this.user_ph) && this.user_ph) {
        this.errorUph = false;
      } else {
        this.errorUph = true;
      }
    },
    checkUhno() { //학번유효성체크
      const validateUhno = /^[a-zA-Z0-9]*$/;
      this.user_schno = this.user_schno || '';
      this.validateInput(this.user_schno, 'user_schno');

      if (validateUhno.test(this.user_schno) && this.user_schno) {
        this.errorUhno = false;
        if ( this.user_schno.length < 7) {
          this.errorUhno2 = true;
        } else {
          this.errorUhno2 = false;
        }
      } else {
        this.errorUhno = true;
        this.errorUhno2 = false;
      }
    },
    checkEmail() { //이메일유효성체크
      const validateUmail = /^[A-Za-z0-9_\\.\\-]+@[A-Za-z0-9\\-]+\.[A-Za-z0-9\\-]+/;
      this.user_email = this.user_email.replace(/\s+/g, '');
      if (this.user_email === '') {
        this.errorUmail = undefined
      } else if (validateUmail.test(this.user_email)) {
        this.errorUmail = false
      } else {
        this.errorUmail = true
      }
    },
    checkUsx() {
      if (!this.user_sex) {
        this.errorUsx = true;
      } else {
        this.errorUsx = false;
      }
    },
  },
}

</script>
<style src="../assets/css/global.css" scoped />
<style scoped>
main.wrap {
  max-width: 600px;
}

.grid-box {
  padding: 30px;
}

.grid-box:hover {
  transform: none;
}

.vital {
  margin-bottom: 20px;
}

.red {
  color: var(--color-red);
}

.input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0.3em;
}

.item {
  display: flex;
  align-items: center;
  white-space: nowrap;
  flex-shrink: 0;
  flex-basis: 100px;
  color: var(--color-main);
  font-weight: 600;
}

.input-row {
  width: 100%;
  display: flex;
  align-items: center;
}

.address .zipcode {
  max-width: 80px;
  flex-basis: 80px;
  flex-shrink: 0;
}

.warning-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3em;
}

.warning {
  visibility: hidden;
  color: var(--color-red);
}

.warning.active {
  visibility: visible;
}

.eye {
  height: 100%;
  padding: 0 0.5em;
  color: #ccc;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.eye:hover {
  color: #999;
}

.radio-wrap {
  width: 100%;
  display: flex;
}

.radio-box {
  flex: 1;
  display: flex;
  align-items: center;
}

.radio-sex {
  min-width: 30px;
  padding: 0.5em;
}

[type="radio"] {
  vertical-align: middle;
  appearance: none;
  border: max(2px, 0.1em) solid #999;
  border-radius: 50%;
  width: 1.25em;
  height: 1.25em;
  transition: border 0.2s ease-in-out;
  cursor: pointer;
}

[type="radio"]:checked {
  border: 0.4em solid var(--color-main);
}

[type="radio"]:focus-visible {
  outline-offset: max(2px, 0.1em);
  outline: max(2px, 0.1em) dotted var(--color-main);
}

[type="radio"]:hover {
  box-shadow: 0 0 0 max(4px, 0.2em) #ccc;
}

[type="radio"]:disabled {
  background-color: #999;
  box-shadow: none;
  opacity: 0.7;
  cursor: not-allowed;
}

[type="radio"] + label {
  cursor: pointer;
}

[type="radio"]:hover + label {
  text-decoration: underline;
}

[type="radio"]:disabled + label {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-area {
  display: flex;
  justify-content: right;
  gap: 10px;
}
</style>