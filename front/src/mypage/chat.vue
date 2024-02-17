<template>
  <div class="myInfo">
    <h1 class="title">나의 채팅방</h1>
    <div class="chatroom-container">
      <div class="chatroom-row" v-for="(chatroom, i) in roomList" :key="i">
        <div class="chatroom-link" @click="gotoChatRoom(chatroom.CHATROOM_USER1 === user.user_no? chatroom.CHATROOM_USER2:chatroom.CHATROOM_USER1)">
          <div class="profile-pic">
            <img :src="user.user_no!='' ? userImgList[i] ? require(`../../../back/uploads/uploadUser/${userImgList[i]}`) : require(`../assets/profile.png`):require(`../assets/profile.png`)" alt="프로필 이미지" />
          </div>
          <div class="name-chat-wrap">
            <div class="nickname">
              <p>{{ userNickList[i] }}</p>
            </div>
            <div class="recent-chat">
              <p>{{ commentList[i] }}</p>
            </div>
          </div>
          <div class="time-alarm-wrap">
            <div class="time">
              <span>{{ formatDateTime(commentTime[i]) }}</span>
            </div>
            <div v-if="alarm[i]>0" class="alarm">
              <span>{{ alarm[i] }}</span>   <!-- 알람이 있을 경우 알람 표시 -->
            </div>
          </div>
        </div>
        <div class="exit" @click="outChatRoom(chatroom.CHATROOM_NO)">
          <i class="fa-solid fa-right-from-bracket"></i>
        </div>
      </div>
      <div class="chatroom-empty" v-if="roomList.length === 0">
        <span>채팅방이 없습니다.</span>
      </div>
    </div>
    <nav class="pagination">
      <div class="btn-small btn-prev" v-if="page>0" @click="prev()">이전</div>
      <ul>
        <li v-for="num in getPageNumbers()" :key="num" :id="num==page? 'select':''" :class="{ active: num === pageCount - 1 }" @click="getRoomList(num)">
          <span>{{num+1}}</span>
        </li>
      </ul>
      <div class="btn-small btn-next" v-if="page<(pageCount-1)" @click="next()">다음</div>
    </nav>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'mychat',
  data() {
    return {
      // 채팅방 리스트
      roomList: [],
      commentList: [],
      commentTime: [],
      userImgList: [],
      userNickList: [],

      // 페이징 처리
      page: 0,
      pageCount: 0,

      // 알람
      alarm: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  created() {
    this.getRoomList(this.page);
  },
  methods: {
    // 페이징 처리 리밋 5페이지
    getPageNumbers() {
      const groupSize = 5; // 페이지 그룹 크기
      const groupIndex = Math.floor(this.page / groupSize); // 현재 페이지 그룹 인덱스
      const start = groupIndex * groupSize; // 현재 페이지 그룹의 시작 페이지 번호
      const end = Math.min(start + groupSize, this.pageCount); // 현재 페이지 그룹의 마지막 페이지 번호
      return Array.from({length: end - start}, (v, i) => start + i); // 페이지 번호 배열 생성
    },
    // 채팅방으로 이동
    gotoChatRoom(index) {
      const popupWidth = 800;
			const popupHeight = 700;
			const popupX = (window.screen.width / 2) - (popupWidth / 2);
			const popupY = (window.screen.height / 2) - (popupHeight / 2);
			let popupWindow = window.open(`/chatroom/${index}`, '채팅', 'height=' + popupHeight  + ', width=' + popupWidth  + ', left=' + popupX + ', top='+ popupY + ', location=no, menubar=no, scrollbars=no, status=no, titlebar=no, toolbar=no');
    },
    // 채팅방 리스트 갯수 가져오기
    async getChatRoomCount(){
      try {
        const response = await axios.get(`http://localhost:3000/chat/getChatRoomCount/${this.user.user_no}`);
        this.pageCount = Math.ceil(response.data[0].count/10);
      } catch (error) {
        console.error(error);
      }
    },
    // 채팅방 리스트 가져오기
    async getRoomList(page) {
      await this.getChatRoomCount();
      try {
        const response = await axios.get(`http://localhost:3000/chat/getChatRoomList/${this.user.user_no}/${page}`);
        this.roomList = response.data;
      } catch (error) {
        console.error(error);
      }
      this.commentList = [];
      this.commentTime = [];
      this.userImgList = [];
      this.userNickList = [];
      this.alarm = [];

      for(var i = 0; i < this.roomList.length; i++) {
        if(this.roomList[i].CHATROOM_USER1===this.user.user_no && this.roomList[i].CHATROOM_OUT1 === 1){
          console.log(`${this.roomList[i].CHATROOM_NO}번 채팅방 나감`)
          this.roomList.splice(i, 1);
        } else if(this.roomList[i].CHATROOM_USER2===this.user.user_no && this.roomList[i].CHATROOM_OUT2 === 1) {
          console.log(`${this.roomList[i].CHATROOM_NO}번 채팅방 나감`)
          this.roomList.splice(i, 1);
        } else {
          await this.getComment(this.roomList[i].CHATROOM_NO)
          await this.getChatUser(this.roomList[i].CHATROOM_USER1 === this.user.user_no? this.roomList[i].CHATROOM_USER2:this.roomList[i].CHATROOM_USER1)
          await this.getAlarm(this.roomList[i].CHATROOM_NO)
        }
      }
      this.page = page;
    },
    // 채팅방 대화 내용 가져오기
    async getComment(room_no) {
      try {
        const response = await axios.get(`http://localhost:3000/chat/chatroomcomment/${room_no}`);
        if(response.data.length == 0){
          this.commentList.push('대화 없음')
        } else {
          this.commentList.push(response.data[0].CHAT_CONTENT);
          this.commentTime.push(response.data[0].CHAT_DATE);
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 채팅방 유저 정보 가져오기
    async getChatUser(user_no){
      try {
        const response = await axios.get(`http://localhost:3000/chat/userinfo/${user_no}`);
        this.userImgList.push(response.data[0].USER_IMG);
        this.userNickList.push(response.data[0].USER_NICK);   // db 대소문자 문제
      } catch (error) {
        console.error(error);
      }
    },
    // 채팅방 나가기
    outChatRoom(room_no) {
      // 채팅방에서 나가시겠습니까? 확인 후 삭제
      this.$swal.fire({
        title: '채팅방 나가기',
        text: '채팅방을 나가시겠습니까?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '나가기',
        cancelButtonText: '취소',
      }).then((result) => {
        if (result.isConfirmed) {
          try{
            axios({
              url:"http://localhost:3000/chat/outChatRoom",
              method: "POST",
              data: {
                room_no: room_no,
                user_no: this.user.user_no,
              }
            })
              .then((res)=>{
                if(res.data.message === 'success') {
                this.$swal('채팅방에서 나갔습니다.');
                this.getRoomList(this.pageCount<this.page ? this.page-1 : this.page);
              }
            })
          } catch(error) {
            console.error(error);
          }
        }
      });
    },
    // 페이징 처리
    prev() {
        this.page -= 1;
        this.getRoomList(this.page);
    },
    // 페이징 처리
    next(){
        this.page += 1;
        this.getRoomList(this.page)
    },
    // 알람 가져오기
    async getAlarm(room_no) {
      try {
        const response = await axios.get(`http://localhost:3000/chat/chat_check_alram/${this.user.user_no}/${room_no}`); // 경로명 alram 오타 수정 좀 해주세요
        this.alarm.push(response.data[0].count);
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
  }
}
</script>

<style src="../assets/css/global.css" scoped></style>
<style src="../assets/css/board.css" scoped></style>
<style scoped>
.myInfo {
  width: 100%;
  height: 100dvh;
  min-height: 100dvh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.title {
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
}

.chatroom-container {
  width: 100%;
  height: 100%;
}

.chatroom-row {
  width: 100%;
  padding-right: 20px;
  display: flex;
  align-items: center;
  border-radius: 20px;
  transition: all 0.2s ease-out;
}

.chatroom-row:hover {
  background-color: var(--color-main-translucent);
}

.chatroom-link {
  width: 100%;
  padding: 20px 10px 20px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
}

.profile-pic {
  width: 3em;
  min-width: 3em;
  height: 3em;
  border-radius: 1em;
}

.name-chat-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
}

.nickname {
  font-weight: 600;
}

.recent-chat {
  color: #999;
}


.time-alarm-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  white-space: nowrap;
}

.time {
  color: #999;
}

.alarm {
  font-size: 12px;
  width: 1.7em;
  height: 1.7em;
  border-radius: 0.9em;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-red);
  color: white;
}

.exit {
  width: 3em;
  height: 3em;
  border-radius: 1em;
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
}

.exit:hover {
  color: var(--color-red);
  border-color: rgba(0, 0, 0, 0);
  background-color: rgba(0, 0, 0, 0.05);
}

.chatroom-empty {
  text-align: center;
}

.pagination {
  margin-bottom: 0;
}
</style>