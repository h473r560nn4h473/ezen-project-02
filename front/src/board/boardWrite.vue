<template>
  <form class="grid-box board-write">
    <div class="title">글 작성</div>
    <div class="category-container">
      <div class="category-wrap">
        <div class="board-subj">분류 1</div>
        <div class="theme-wrap">
          <div class="theme" @click="selectTab(1)" :class="{ active: selectedTab === 1 }">자유</div>
          <div class="bar"></div>
          <div class="theme" @click="selectTab(2)" :class="{ active: selectedTab === 2 }">익명</div>
          <div class="bar"></div>
          <div class="theme" @click="selectTab(3)" :class="{ active: selectedTab === 3 }">신고</div>
          <div class="bar"></div>
          <div class="theme" @click="selectTab(4)" :class="{ active: selectedTab === 4 }">분실물</div>
        </div>
      </div>
      <div class="category-wrap">
        <div class="board-subj">분류 2</div>
        <div class="theme-wrap" v-if="selectedTab === 3">
          <div class="theme" @click="handleThemeClick(0)" :class="{ active: selectedCategory === 0 }">고장</div>
          <div class="bar"></div>
          <div class="theme" @click="handleThemeClick(1)" :class="{ active: selectedCategory === 1 }">불편</div>
        </div>
        <div class="theme-wrap" v-else-if="selectedTab === 4">
          <div class="theme" @click="handleThemeClickL(0)" :class="{ active: selectedCategoryL === 0 }">주웠어요</div>
          <div class="bar"></div>
          <div class="theme" @click="handleThemeClickL(1)" :class="{ active: selectedCategoryL === 1 }">잃어버렸어요</div>
        </div>
        <div class="null" v-else>없음</div>
      </div>
    </div>
    <div class="board-title-row">
      <span class="board-subj">제목</span>
      <input type="text" v-model="title" placeholder="제목" autocomplete="off" />
    </div>
    <div class="board-content-row">
      <span class="board-subj">내용</span>
      <textarea v-model="content" placeholder="내용을 입력해 주세요!"></textarea>
    </div>
    <div class="board-content-row" v-if="selectedTab === 3 || selectedTab === 4">
      <span class="board-subj">사진</span>
      <div class="img-container">
        <div class="img-frame" v-for="(img, index) in imgs" :key="index">
          <div class="img">
            <img :src="getImgUrl(img)" /><!--{{ img }}-->
          </div>
        </div>
      </div>
      <div class="upload-wrap">
        <input type="file" id="imgs" accept=".png, .jpg, .jpeg" @change="handleFileChange" multiple />
        <label for="imgs"></label>
        <div class="img-upload-txt">
          <p>지원되는 확장자 .png, .jpg, .jpeg</p>
          <p>용량 제한 3MB</p>
          <p>180px &#215; 180px 추천</p>
          <p>업로드 사진 갯수 3개 제한</p>
        </div>
      </div>
    </div>
    <div class="btn-area">
      <button type="button" class="btn-small" @click="onSubmitWrite">등록</button>
      <button type="button" class="btn-small" @click="this.$router.go(-1)">취소</button>
    </div>
  </form>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      title: "",
      content: "",
      imgs: [],
      selectedTab: 0, //게시판 카테고리
      selectedCategory: 0, //신고 게시판 카테고리
      selectedCategoryL: 0,
    };
  },

  computed: {
    user() {
      return this.$store.state.user; // 로그인 확인
    },
  },

  mounted() {
    if (this.user.user_id == "") {
      // 일단은 로그인 상태 체크
      this.$swal("비회원 접근제한 페이지입니다.");
      this.$router.push({ path: "/" });
    }
  },

  methods: {
    handleThemeClick(themeNumber) {
      // 테마가 클릭되었을 때 호출되는 메소드
      this.selectedCategory = themeNumber;
    },
    handleThemeClickL(themeNumber) {
      // 테마가 클릭되었을 때 호출되는 메소드
      this.selectedCategoryL = themeNumber;
    },
    selectTab(tabNumber) {
      this.selectedTab = tabNumber;
    },
    handleFileChange(event) {
      const selectedFiles = Array.from(event.target.files);

      if (!selectedFiles.length) {
        console.log("파일첨부취소");
        event.target.value = '';
        return;
      }

      // 파일 갯수 제한
      if (selectedFiles.length > 3) {
        alert('사진은 3장까지만 첨부할 수 있습니다.');
        event.target.value = '';
        return;
      }

      // 각 파일의 크기 확인 (3MB 이하만 허용)
      const maxSize = 3 * 1024 * 1024; // 3MB
      const oversizedFiles = selectedFiles.filter(file => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        alert('용량이 3MB 미만인 파일만 첨부 가능합니다.');
        event.target.value = '';
        return;
      }

      this.imgs = selectedFiles;
    },
    getImgUrl(img) {
      return URL.createObjectURL(img);
    },
    onSubmitWrite() {
      if( this.selectedTab == 1) {
        axios({
          url: "http://localhost:3000/board/boardWrite",
          method: "POST",
          data: {
            title: this.title,
            content: this.content,
            user_no: this.user.user_no,
          },
        })
        .then(res => {
          if (res.data.message == 'DB_error') {
            this.$swal({
              icon: 'error',
              title: 'DB 에러 발생'
            })
          }
          else {
            this.$swal({
              icon: 'success',
              title: '글이 등록되었습니다.',
              showConfirmButton: false,
              timer: 1500
            })
            this.$router.push({ path: '/board/free' });
          }
        })
        .catch(err => {
          console.log(err);
        })
      } else if (this.selectedTab == 2) {
        axios({
          url: "http://localhost:3000/anon/anonWrite",
          method: "POST",
          data: {
            title: this.title,
            content: this.content,
            user_no: this.user.user_no,
          },
        })
        .then(res => {
          if (res.data.message == 'DB_error') {
            this.$swal({
              icon: 'error',
              title: 'DB 에러 발생'
            })
          }
          else {
            this.$swal({
              icon: 'success',
              title: '글이 등록되었습니다.',
              showConfirmButton: false,
              timer: 1500
            })
            this.$router.push({ path: '/board/anon' });
          }
        })
        .catch(err => {
          console.log(err);
        })
      } else if ( this.selectedTab == 3) { 
        const formData = new FormData();
        formData.append("title", this.title);
        formData.append("content", this.content);
        formData.append("user_no", this.user.user_no);
        formData.append("category", this.selectedCategory);

        this.imgs.forEach((img) => {
          formData.append('rep_img', img);
        });

        axios
          .post("http://localhost:3000/board/reportWrite", formData)
          .then((res) => {
            console.log("서버 응답:", res.data);
            if (res.data === "success") {
              this.$swal({
                icon: "success",
                title: "게시판에 글이 등록되었습니다.",
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                 this.$router.push({ path: '/board/report' });
              });
            } else {
              this.$swal('등록 실패');
            }
          })
          .catch((error) => {
            console.error('등록 에러', error);
            this.$swal('등록 중 오류가 발생했습니다',);
          });
      } else if( this.selectedTab == 4) {
        const formData = new FormData();
        formData.append("title", this.title);
        formData.append("content", this.content);
        formData.append("user_no", this.user.user_no);
        formData.append("category", this.selectedCategoryL);

        this.imgs.forEach((img) => {
          formData.append('lost_img', img);
        });

        axios
          .post("http://localhost:3000/lost/lostWrite", formData)
          .then((res) => {
            console.log("서버 응답:", res.data);
            if (res.data === "success") {
              this.$swal({
                icon: "success",
                title: "게시판에 글이 등록되었습니다.",
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                this.$router.push({ path: '/board/lost' });
              });
            } else {
              this.$swal('등록 실패');
            }
          })
          .catch((error) => {
            console.error('등록 에러', error);
            this.$swal('등록 중 오류가 발생했습니다',);
          });
      }
    },
    goBack() {
        this.$router.go(-1);
      }
  },
};
</script>

<style src="../assets/css/global.css" scoped />
<style src="../assets/css/board.css" scoped />
<style scoped>
.board-write {
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding: 30px;
	white-space: nowrap;
}

.board-write:hover {
	transform: none;
}

.category-container {
  display: flex;
}

.category-wrap {
  display: flex;
  gap: 20px;
  align-items: center;
  flex: 1;
}

.theme-wrap .theme:hover {
  font-weight: 600;
}

.board-title-row {
	display: flex;
	gap: 20px;
	align-items: center;
}

.board-subj {
	color: var(--color-main);
	font-weight: 500;
	font-size: 16px;
}

.board-content-row {
  display: flex;
  gap: 20px;
}

.board-content-row .board-subj {
	padding: 0.7em 0;
}

.img-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.img-frame {
  width: fit-content;
  max-width: 600px;
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
}

.img-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-wrap {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.img-upload-txt {
  white-space: nowrap;
}

#imgs {
  display: none;
}

#imgs + label {
  width: fit-content;
}

#imgs + label::after {
  content: "\f093\00a0\00a0업로드";
  font-family: "Noto Sans KR", FontAwesome, sans-serif;
  font-weight: 500;
  width: fit-content;
  padding: 0.5em 0.7em;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--color-main);
  border-radius: 12px;
  color: var(--color-main);
  background-color: white;
  transition: all 0.2s ease-out;
  cursor: pointer;
}

#imgs + label:hover::after {
  background-color: var(--color-main);
  color: white;
}
</style>
