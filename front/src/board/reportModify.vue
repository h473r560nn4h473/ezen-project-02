<template>
  <form class="grid-box board-modify">
    <div class="title">신고글 수정</div>
    <div class="category-wrap">
      <div class="board-subj">분류 2</div>
      <div class="theme-wrap">
        <input id="report-broken" class="blind" type="radio" v-model="reportdetail.REP_CATEGORY" value="0" />
        <label for="report-broken" class="theme">고장</label>
        <div class="bar"></div>
        <input id="report-inconv" class="blind" type="radio" v-model="reportdetail.REP_CATEGORY" value="1" />
        <label for="report-inconv" class="theme">불편</label>
      </div>
    </div>
    <div class="board-title-row">
      <div class="board-subj">제목</div>
      <input type="text" v-model="reportdetail.REP_TITLE" />
    </div>
    <div class="board-content-row">
      <div class="board-subj">내용</div>
      <textarea type="text" v-model="reportdetail.REP_CONTENT"></textarea>
    </div>
    <div class="board-content-row">
      <div class="board-subj">사진</div>
      <div class="img-container" v-if="repOldImgs.length > 0 && rep_imgs.length <= 0">
        <div class="img-frame" v-for="imgs in repOldImgs" :key="imgs.REP_IMG">
          <div class="img">
            <img :src="require('../../../back/uploads/uploadReport/' + `${imgs.REP_IMG}`)" alt="old">
          </div>
        </div>
      </div>
      <div class="img-container" v-else-if="rep_imgs.length > 0">
        <div class="img-frame" v-for="(img, index) in rep_imgs" :key="index">
          <div class="img">
            <img :src="getImgUrl(img)" alt="preview">
          </div>
        </div>
      </div>
      <div class="img-container" v-else>
        <div class="img-frame">
          <div class="img">
            <img src="../assets/imgempty.svg" alt="null">
          </div>
        </div>
      </div>
      <div class="upload-wrap">
        <input type="file" id="imgs" ref="fileInput" @change="handleFileChange" multiple />
        <label for="imgs"></label>
          <div class="img-upload-txt">
            <p>지원되는 확장자 .png, .jpg, .jpeg</p>
            <p>용량제한 3MB</p>
            <p>180px &#215; 180px 추천</p>
            <p>업로드 사진 갯수 3개 제한</p>
          </div>
      </div>
    </div>
    <div class="btn-area">
      <button type="button" class="btn-small" @click="submitForm()">수정완료</button>
      <button type="button" class="btn-small" @click="goBack()">취소</button>
    </div>
  </form>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      reportdetail: {},
      rep_content: '',
      repOldImgs: [],
      rep_imgs: [],
    };
  },
  mounted() {
    axios
      .get('http://localhost:3000/board/reportdetail', {
        params: {
          rep_no: this.$route.query.rep_no
        },
      }).then((res) => {
        console.log(res.data[0]);
        this.reportdetail = res.data[0];
        this.rep_content = this.reportdetail.REP_CONTENT.split('\n').join('<br />');
      }).catch((error) => {
        console.log(error);
      });
    axios
      .get('http://localhost:3000/board/reportImgs', {
        params: {
          rep_no: this.$route.query.rep_no
        },
      }).then((res) => {
        console.log("이미지 목록:", res.data);
        this.repOldImgs = res.data;
      }).catch((error) => {
        console.log(error);
      });
  },
  methods: {
    goBack() {
      window.location.href = `http://localhost:8080/board/report/reportDetail?REP_NO=${this.$route.query.rep_no}`;
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

      this.rep_imgs = selectedFiles;
    },
    getImgUrl(img) {
      return URL.createObjectURL(img);
    },
    async submitForm() {
      const rep_no = this.$route.query.rep_no;

      const formData = new FormData();
      formData.append('rep_title', this.reportdetail.REP_TITLE);
      formData.append('rep_content', this.reportdetail.REP_CONTENT);
      formData.append('rep_category', this.reportdetail.REP_CATEGORY);
      formData.append('rep_no', rep_no);

      this.rep_imgs.forEach((img) => {
        formData.append('rep_img', img);
      });

      try {
        const response = await fetch(`http://localhost:3000/board/reportModify/${rep_no}`, {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          console.log('수정성공');
          window.location.href = `http://localhost:8080/board/report/reportDetail?REP_NO=${rep_no}`;
        } else {
          console.error('수정실패');
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    },
  },
};
</script>

<style src="../assets/css/global.css" scoped />
<style src="../assets/css/board.css" scoped />
<style scoped>
.board-modify {
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding: 30px;
	white-space: nowrap;
}

.board-modify:hover {
	transform: none;
}

.category-wrap {
  display: flex;
  gap: 20px;
  align-items: center;
}

.theme-wrap .theme:hover ,
.theme-wrap input[type=radio]:checked + .theme {
  font-weight: 600;
}

.theme-wrap input[type=radio]:checked + .theme {
  cursor: default;
}

.theme-wrap input[type=radio]:checked + .theme::after {
  content: '';
  display: block;
  width: 100%;
  height: 3px;
  border-radius: 1.5px;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-main);
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
/* 미리보기 이미지 스타일링 */
/* .input_row {
	margin-bottom: 30px;
}

.textarea_row {
	align-items: start;
	margin-bottom: 50px;
}

.input_row input,
.input_row .textarea_box,
.input_row textarea {
	width: 600px;
}

.input_row input {
	border-radius: 12px !important;
}

.img_up_wrap {
	display: flex;
	justify-content: left;
	align-items: center;
	width: 600px;
}

.img_frame {
  margin-right: 20px;
}

.upload_wrap {
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 12px;
}

#rep_img + label {
  margin-bottom: 20px;
}

#rep_img + label::after {
  content: '\f093\00a0\00a0업로드';
  font-family: 'Noto Sans KR', FontAwesome, sans-serif;
  font-weight: 500;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--color-orange);
  border-radius: 12px;
  color: var(--color-orange);
  background-color: var(--color-white);
  cursor: pointer;
}

#rep_img + label:hover::after {
  background-color: var(--color-orange);
  color: var(--color-white);
}

.upload_wrap.active #rep_img + label::after {
border: 1px solid var(--color-orange);
color: var(--color-orange);
background-color: var(--color-white);
}

.upload_wrap.active #rep_img + label:hover::after {
  background-color: var(--color-orange);
  color: var(--color-white);
}

.upload_wrap:not(.active) #rep_img + label::after {
border: 1px solid var(--color-gray);
color: var(--color-gray);
background-color: #f3f3f3;
cursor: default;
} */

</style>