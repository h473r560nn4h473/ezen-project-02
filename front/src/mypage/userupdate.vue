<template>
  <main>
    <div class="title">
      <h1>내 정보 수정</h1>
    </div>
    <div class="img-form">
      <div class="img-frame">
        <label class="img" for="input-img" v-if="!loginUser.USER_IMG">
          <i class="fa-solid fa-image null-img"></i>
        </label>
        <label class="img" for="input-img" v-else-if="loginUser.USER_IMG && img_change === 0">
          <img :src="require(`../../../back/uploads/uploadUser/${loginUser.USER_IMG}`)" alt="...">
        </label>
        <label class="img" for="input-img" v-else-if="img_change === 1">
          <img :src="previewImage" alt="...">
        </label>
      </div>
      <input type="file" id="input-img" class="blind" accept="image/png, image/jpeg, image/jpg" @change="uploadFile($event)">
    </div>
    <div class="txt-wrap">
      <p>*이미지 클릭 시 이미지를 변경 혹은 업로드합니다.</p>
      <p>지원되는 확장자 .png, .jpg, .jpeg</p>
      <p>용량 제한 3MB</p>
      <p>180px &#215; 180px 추천</p>
    </div>
    <div class="input-wrap">
      <div class="item">아이디</div>
      <div class="input-row">
        <input type="text" v-model="loginUser.USER_ID" />
      </div>
    </div>
    <div class="input-wrap">
      <div class="item">이름</div>
      <div class="input-row">
        <input type="text" v-model="loginUser.USER_NM" />
      </div>
    </div>
    <div class="input-wrap">
      <div class="item">전화번호</div>
      <div class="input-row">
        <input type="text" v-model="loginUser.USER_PH" />
      </div>
    </div>
    <div class="input-wrap">
      <div class="item">이메일</div>
      <div class="input-row">
        <input type="text" v-model="loginUser.USER_MAIL" />
      </div>
    </div>
    <div class="input-wrap">
      <div class="item">닉네임</div>
      <div class="input-row">
        <input type="text" v-model="loginUser.USER_NICK" />
      </div>
    </div>
    <div class="input-wrap address">
      <div class="item">주소</div>
      <div class="input-row zipcode" v-if="loginUser">
        <input type="text" placeholder="우편번호" v-model="loginUser.USER_ZIPCODE" readonly @click="openPostcode" />
      </div>
      <button type="button" class="btn-small" @click="openPostcode">검색</button>
      <div class="input-row">
        <input type="text" v-model="loginUser.USER_ADR1" placeholder="주소" readonly />
      </div>
    </div>
    <div class="input-wrap">
      <div class="item"></div>
      <div class="input-row">
        <input type="text" v-model="loginUser.USER_ADR2" placeholder="상세주소" />
      </div>
    </div>
    <div class="btn-area">
      <button class="btn-text" @click="goToPass">비밀번호 수정</button>
      <button type="submit" class="btn-small" @click="onSubmitForm">수정완료</button>
      <button class="btn-small" @click="this.$router.go(-1)">취소</button>
    </div>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loginUser: {},
      img_change: 0,
      previewImage: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  mounted() {
    if (this.user.user_no === '') {
        this.$swal({
          icon: 'warning',
          title: '로그인해주세요.'
        });
        this.$router.push({ path: '/login' });
    }
    else {
      axios
        .get(`http://localhost:3000/mypage/getUserData/${this.user.user_no}`)
        .then((res) => {
          if (res.data.length > 0) {
            this.loginUser = res.data[0];
            console.log(this.loginUser);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, 
  methods: {
    uploadFile(e) {
      const file = e.target.files[0];
      if (!file) {
        console.log("파일첨부취소")
        e.target.value = '';
        return;
      } else if (file.size > 3 * 1024 * 1024) {
        this.$swal({
          icon: 'warning',
          title: '용량이 3MB 이하인 파일만 업로드하실 수 있습니다.'
        });
        e.target.value = '';
        return;
      }
      this.loginUser.USER_IMG = file;
      this.previewImage = URL.createObjectURL(this.loginUser.USER_IMG);
      this.img_change = 1;
    },
    onSubmitForm() {
      if (this.loginUser.USER_ID === "" || this.loginUser.USER_NM === "" || this.loginUser.USER_PH === "" || this.loginUser.USER_MAIL === "" || this.loginUser.ZIPCODE === "" || this.loginUser.ADR1 === "") {
        this.$swal("필수 항목을 입력해주세요");
      } else {
        const formData = new FormData();
        formData.append('user_no', this.user.user_no);
        formData.append('user_id', this.loginUser.USER_ID);
        formData.append('user_nm', this.loginUser.USER_NM);
        formData.append('user_ph', this.loginUser.USER_PH);
        formData.append('user_mail', this.loginUser.USER_MAIL);
        formData.append('user_nick', this.loginUser.USER_NICK);
        formData.append('zipcode', this.loginUser.USER_ZIPCODE);
        formData.append('adr1', this.loginUser.USER_ADR1);
        formData.append('adr2', this.loginUser.USER_ADR2);
        if (this.loginUser.USER_IMG) {
          formData.append('user_img', this.loginUser.USER_IMG);
        }
        axios.post('http://localhost:3000/mypage/userUpdate', formData).then((res) => {
          if (res.data === 'success') {
            this.$swal({
              icon: 'success',
              title: '내 정보가 수정되었습니다.',
              showConfirmButton: false,
              timer: 1500
            })
              .then(() => {
                this.$router.push({ path: '/mypage' });
                this.image_change = 0;
              })
          } else {
            this.$swal("펫정보 수정 실패");
          }
        })
          .catch(() => {
            this.$swal("오류 발생")
          })
      }
    },
    openPostcode() {  //우편주소 메소드
      new window.daum.Postcode({
        oncomplete: (data) => {
          console.log(data);
          this.loginUser.ZIPCODE = data.zonecode;
          this.loginUser.ADR1 = data.roadAddress;
        },
      }).open();
    },
    goToPass() {
      this.$router.push({ path: '/mypage/pass' });
    },
  }
}
</script>

<style src="../assets/css/global.css" scoped />
<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.img-frame {
  width: fit-content;
  max-width: 100%;
  min-width: 200px;
  height: 200px;
  padding: 10px;
  border-radius: 20px;
  border: 2px solid #ccc;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.img-frame .img {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #ccc;
  cursor: pointer;
}

.img-frame .null-img {
  font-size: 100px;
  color: white;
}

.img-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.input-wrap {
  display: flex;
  gap: 10px;
  align-items: center;
}

.item {
  display: flex;
  align-items: center;
  white-space: nowrap;
  flex-shrink: 0;
  flex-basis: 60px;
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

.btn-area {
  display: flex;
  justify-content: right;
  gap: 10px;
}
</style>