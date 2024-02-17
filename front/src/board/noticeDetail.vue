<template>
  <div class="grid-box">
    <div class="top-wrap">
      <div class="post-title">{{ noticelist.NOT_TITLE }}</div>
      <div class="top">
        <div class="top-left">
          <div class="nick">관리자</div>
          <div class="bar"></div>
          <div class="date">{{ formatDateTime(noticelist.NOT_DATE) }}</div>
        </div>
        <div class="top-right">
          <div class="view"><i class="fa-regular fa-eye icon"></i>{{ noticelist.NOT_COUNT }}</div>
        </div>
      </div>
    </div>
    <div class="content-section">
      <div v-html="noticeContent" class="content"></div>
      <div class="ad">
        <div class="ad-notice"><i class="fa-solid fa-circle-info"></i> 광고</div>
        <img v-if="adImageLoaded" src="https://www.dc601.com/files/board/2023/12/44bba3eb56558c22f6b35d6453112324.jpg" alt="자격증 광고" @error="handleAdImageError">
        <span v-else>이미지를 불러올 수 없습니다.</span>
      </div>
    </div>
    <div class="btn-area">
      <button v-if="adminCheck == 1" type="button" class="btn-small btn-blue" @click="showModal()">수정</button>
      <button type="button" class="btn-small" @click="NoticeMain">목록으로</button>
    </div>
    <div v-if="showModalFlag" class="modal">
          <div class="bg" @click="closeModal"></div>
          <div class="modal-mask">
            <div class="modal-wrapper">
              <div class="modal-container">
                <div class="modal-header title">
                  <i class="fa-sharp fa-regular fa-pen-to-square"></i>
                  <h3>공지사항 수정</h3>
                </div>
                <div class="modal-body">
                  <table class="table">
                    <tbody>
                      <tr class="notice-title">
                        <th>제목</th>
                        <td colspan="3">
                          <input type="text" v-model="noticelist.NOT_TITLE" />
                        </td>
                      </tr>
                      <tr class="notice-description">
                        <th>내용</th>
                        <td colspan="3">
                          <textarea ref="textarea" type="text" v-model="noticeContent" @keydown="autoResize()" rows="3" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="modal-footer">
                  <button class="btn-small btn-blue" @click="modifyNotice">수정</button>
                  <button class="btn-small btn-red" @click="closeModal">취소</button>
                </div>
              </div>
            </div>
          </div>
        </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      noticelist: {},
      adminCheck: 0,
      showModalFlag: false,
      NOT_NO: this.$route.query.NOT_NO,
      noticeContent: '',
      adImageLoaded: true, // 광고 이미지 로딩 여부를 추적하는 상태 변수
    }
  },
  computed: {
    user() {
      return this.$store.state.user; // user 정보가 바뀔 때마다 자동으로 user() 갱신
    },
  },
  mounted() {
    this.getNoticeDetail();
  },
  methods: {
    async getNoticeDetail() {
      try {
        const response = await axios.get(`http://localhost:3000/board/noticeDetail/${this.NOT_NO}`);
        this.noticelist = response.data[0];
        console.log(this.noticelist);
        this.noticeContent = this.noticelist.NOT_CONTENT.split('\n').join('<br />');
      } catch (error) {
        console.error(error);
      }
    },
    formatDateTime(dateTime) {
      const today = new Date();
      const date = new Date(dateTime);
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      const betweenTime = Math.floor((today.getTime() - date.getTime()) / 1000 / 60);
      if (betweenTime < 1) return '방금 전';
      if (betweenTime < 60) return `${betweenTime}분 전`;
      const betweenTimeHour = Math.floor(betweenTime / 60);
      const formattedDateTime = date.toLocaleDateString("ko-KR", options).replace(/\.$/, '');
      if (betweenTimeHour < 24) {
        return `${betweenTimeHour}시간 전`;
      } else {
        return formattedDateTime;
      }
    },
    modifyNotice() {
      axios({
          url: "http://localhost:3000/board/noticeModify",
          method: "POST",
          data: {
            not_no: this.NOT_NO,
            title: this.noticelist.NOT_TITLE,
            content: this.noticeContent,
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
            this.showModalFlag = false;
            this.$swal({
              icon: 'success',
              title: '글이 수정되었습니다.',
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
    showModal() {
      this.showModalFlag = true;
    },
    closeModal() {
      this.showModalFlag = false;
    },
    NoticeMain() {
      axios({
        url: "http://localhost:3000/board/addNCount", 
        method: "POST",
        data: {
          not_no: this.NOT_NO
        },
      }).then(res => {
        if (res.data.message == 'complete') {
          this.$router.go(-1);
        }
      }).catch(err => {
        alert(err);
      });
    },
    handleAdImageError() { // 이미지 로딩에 실패했을 때 실행될 메소드
      this.adImageLoaded = false; // 이미지 로딩 실패 상태를 업데이트
    },
    autoResize() {
      let element = this.$refs["textarea"];
      element.style.height = 'auto';
      element.style.height = element.scrollHeight + 'px';
    }
  }
}
</script>

<style src="../assets/css/global.css" scoped></style>
<style src="../assets/css/board.css" scoped></style>
<style scoped>


.table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  text-align: left;
}

.table * {
  transition: all 0.2s ease-out;
}

.table thead {
  background-color: var(--color-main-dark);
  color: white;
}

.table th {
  font-weight: 500;
}

.table th ,
.table td {
  padding: 1.2em;
}

.table tr th:first-of-type ,
.table tr td:first-of-type {
  text-align: center;
}

.table th:hover ,
.table td:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
}

.modal {
  z-index: 1100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-mask {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 30px;
  border-radius: 12px;
}

.modal-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-header {
  display: flex;
  gap: 10px;
  align-items: center;
}

.modal-header i {
  color: var(--color-main);
}

.notice-title input ,
.notice-description textarea {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 0.7em;
  padding: 0.5em;
}

.notice-title input:focus ,
.notice-description textarea:focus {
  border-color: var(--color-main);
}

.notice-description textarea {
  height: auto;
  overflow: hidden;
}

.modal-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

</style>