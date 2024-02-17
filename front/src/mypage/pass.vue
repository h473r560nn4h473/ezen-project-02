<template>
  <main>
    <div class="title">
      <h1>비밀번호 변경</h1>
    </div>
    <div class="input-wrap">
      <div class="input-row">
        <input type="password" id="user_pw" placeholder="기존 비밀번호" v-model="user_pw" />
        <div class="eye" @click="oneyes('user_pw')"><i class="fa-solid fa-eye"></i></div>
      </div>
      <div class="warning-row">
        <div class="warning" :class="{ active: user_pw !== '' && !isPasswordValid(user_pw)}">비밀번호가 일치하지 않습니다
        </div>
      </div>
      <div class="input-row">
        <input type="password" id="user_npw" placeholder="새 비밀번호" v-model="user_npw" />
        <div class="eye" @click="oneyes('user_npw')"><i class="fa-solid fa-eye"></i></div>
      </div>
      <div class="warning-row">
        <div class="warning" :class="{ active: user_npw !== '' && !isPasswordValid(user_npw) }">영문, 숫자, 특수문자 조합 8자 이상
        </div>
      </div>
      <div class="input-row">
        <input type="password" id="user_npw_ck" placeholder="비밀번호 확인" v-model="user_npw_ck" />
        <div class="eye" @click="oneyes('user_npw_ck')"><i class="fa-solid fa-eye"></i></div>
      </div>
      <div class="warning-row">
        <div class="warning" :class="{ active: user_npw_ck !== '' && !isPasswordValid(user_npw_ck) }">영문, 숫자, 특수문자 조합 8자
          이상</div>
      </div>
    </div>
    <div class="btn-area">
      <button type="submit" class="btn-small" :disabled="!isFormValid" @click="onSubmitForm">비밀번호 변경</button>
      <button type="button" class="btn-small" @click="this.$router.go(-1)">취소</button>
    </div>
  </main>
</template>

<script>
//230709
import axios from "axios";

export default {
  data() {
    return {
      user_pw: "",
      user_npw: "",
      user_npw_ck: "",
      user_no: "",
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    isFormValid() {
      return (
        this.user_pw !== "" &&
        this.user_npw !== "" &&
        this.user_npw_ck !== "" &&
        this.user_npw === this.user_npw_ck &&
        this.isPasswordValid(this.user_pw) &&
        this.isPasswordValid(this.user_npw) &&
        this.isPasswordValid(this.user_npw_ck)
      );
    },
  },
  mounted() {
    if (this.user.user_no === "") {
      this.$swal("로그인해주세요");
      this.$router.push({ path: "/" });
    } else {
      this.user_no = this.user.user_no;

      axios.get(`http://localhost:3000/mypage/getUserData/${this.user.user_no}`)
        .then((res) => {
          if (res.data.length > 0) {
            this.user = res.data[0];
            console.log(this.user);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  methods: {
    onSubmitForm() {
      if (
        this.user_pw === "" ||
        this.user_npw === "" ||
        this.user_npw_ck === ""
      ) {
        this.$swal({
          icon: "warning",
          title: "모든 항목을 입력해주세요"
        });
      } else if (this.user_npw !== this.user_npw_ck) {
        this.$swal("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      } else {
        axios.post("http://localhost:3000/mypage/pass_process", {
          user_no: this.user_no,
          user_pw: this.user_pw,
          user_npw: this.user_npw,
          user_npw_ck: this.user_npw_ck,
        })
          .then((res) => {
            if (res.data.message === "pass_update") {
              this.$swal({
                icon: 'success',
                title: '수정이 완료되었습니다',
                showConfirmButton: false,
                timer: 1500
              });
              this.$router.push({ path: "/mypage" });
            } else if (res.data.message === "pw_ck") {
              this.$swal("비밀번호가 틀립니다.");
            } else {
              this.$swal("알 수 없는 오류가 발생했습니다.");
            }
          })
          .catch((error) => {
            console.log(error);
            this.$swal("수정에 실패했습니다.");
          });
      }
    },
    //비밀번호 보기 아이콘
    oneyes(field) {
      const passwordInput = document.querySelector(`#${field}`);
      const eyeIcon = document.querySelector(`#${field} + .eye`);
      let isMouseDown = false;

      eyeIcon.addEventListener("mousedown", () => {
        passwordInput.type = "text";
        eyeIcon.style = "color: var(--color-dark)";
        isMouseDown = true;
      });

      document.addEventListener("mouseup", () => {
        passwordInput.type = "password";
        eyeIcon.style = "color: var(--color-gray)";
        isMouseDown = false;
      });

      passwordInput.addEventListener("blur", () => {
        passwordInput.type = "password";
        eyeIcon.style = "color: var(--color-gray)";
        isMouseDown = false;
      });

      passwordInput.addEventListener("focus", () => {
        if (isMouseDown) {
          passwordInput.type = "text";
          eyeIcon.style = "color: var(--color-dark)";
        }
      });
    },
    isPasswordValid(password) {
      const regex = /^\s*(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}\s*$/;
      return regex.test(password);
    }
  }
}
</script>

<style src="../assets/css/global.css" scoped />
<style scoped>
.title {
  margin-bottom: 40px;
}

.input-wrap {
  margin: 0 auto 20px;
  max-width: 400px;
}

.input-row {
  width: 100%;
  display: flex;
  align-items: center;
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

.btn-area {
  display: flex;
  justify-content: right;
  gap: 10px;
}
</style>
