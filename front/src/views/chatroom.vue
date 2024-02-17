<template>
  <div class="chatroom-container">
    <div class="chatroom-top">
      <button class="btn-text btn-back" @click="this.$router.push('/chat')"><i class="fa-solid fa-chevron-left"></i>전체 채팅</button>
      <span class="title"><span class="user-nm">{{ anotherUser.USER_NM }}</span> 님과의 대화</span>
      <button class="btn-text btn-exit" @click="exitChat()">나가기</button>
    </div>
    <div class="chatlog-container" id="scroll">
      <div class="chatlog" v-for="(chat, i) in chatList" :key="i">
        <div v-if="chat.CHAT_USER===user.user_no" class="chat-me">
          <p class="chat open-drag" v-text="chat.CHAT_CONTENT"></p>
          <!-- <textarea class="chat" :rows="chat.CHAT_CONTENT.length/15" readonly v-model="chat.CHAT_CONTENT"></textarea> 전자가 정상 작동시 삭제 요망 -->
          <div class="viewed-time-wrap">
            <!-- <span class="chat-viewed">안 읽음</span> -->
            <span class="chat-time">{{ formatDateTime(chat.CHAT_DATE) }}</span>
          </div>
        </div>
        <div v-else class="chat-else">
          <div class="profile-pic">
            <img v-if="anotherUser.USER_IMG" :src="require('../../../back/uploads/uploadUser/' + `${anotherUser.USER_IMG}`)" alt="댓글 프로필">
            <i v-else class="fa-solid fa-user"></i>
          </div>
          <div class="name-chat-wrap">
            <p class="chat-name">{{ anotherUser.USER_NM }}</p>
            <p class="chat open-drag" v-text="chat.CHAT_CONTENT"></p>
            <!-- <textarea class="chat" :rows="chat.CHAT_CONTENT.length/15" readonly v-model="chat.CHAT_CONTENT"></textarea> 전자가 정상 작동시 삭제 요망 -->
          </div>
          <div class="viewed-time-wrap">
            <!-- <span class="chat-viewed">안 읽음</span> -->
            <span class="chat-time">{{ formatDateTime(chat.CHAT_DATE) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-input-container">
      <textarea class="chat-input" type="text" spellcheck="false" placeholder="메세지를 입력하세요. (Shift + Enter로 줄바꿈 가능)" v-model="content" @keydown.enter.exact.prevent @keyup.enter.exact="send" />
      <button class="btn-small chat-send" :disabled="this.content == ''" @click="send">전송</button>
    </div>
  </div>
</template>

<script>
import axios from "axios"
//소켓 클라이언트
import io from 'socket.io-client'

export default {
  name: 'chat',
  data() {
    return {
      loginUser: {},
      anotherUser: {},
      chatList: [],
      chatroom: {},
      content: '',
      connected: false,
      socket: io('http://localhost:3001')
    }
  },
  created() {//
    this.socket.on('chat', async (data) => {
      if(data.chatroom_no === this.chatroom.CHATROOM_NO) {
        console.log('채팅방 번호 일치');
        await this.getChat();
        this.scroll();
      }
    })
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  beforeMount() {
    this.getChatRoom()
  },
  mounted() {
    this.scroll()
  },
  methods: {
    scroll() {
      setTimeout(() => {
        const scroll = document.getElementById('scroll');
        scroll.scrollTop = scroll.scrollHeight;
      }, 100);
    },//채팅방 소켓 및 데이터베이스
    async getChatRoom() {
      this.socket.on('connect', () => {
        this.connected = true;
        console.log('채팅방 연결됨');
      })
      try {
        const me_no = this.user.user_no;
        const another_user_no = this.$route.params.id;
        let user_no = '';
        if(me_no > another_user_no) {
          user_no = `${another_user_no}/${me_no}`;
        } else {
          user_no = `${me_no}/${another_user_no}`;
        }
        const response = await axios.get(`http://localhost:3000/chat/getChatRoom/${user_no}`);
        this.chatroom = response.data[0];
      } catch (error) {
        console.error(error);
      }
      await this.getChat()
      await this.getUser()
      await this.getAnotherUser()
      await this.checkAlarm()
    },//사용자 가져오기
    async getUser() {
      try {
        const response = await axios.get(`http://localhost:3000/chat/userinfo/${this.user.user_no}`);
        this.loginUser = response.data[0];
      } catch(error) {
        console.error(error);
      }
    },
    async getAnotherUser() {
      try {
        const another_user_no = this.$route.params.id;
        const response = await axios.get(`http://localhost:3000/chat/userinfo/${another_user_no}`);
        this.anotherUser = response.data[0];
      } catch (error) {
        console.error(error);
      }
    },//채팅룸
    async getChat() {
      try {
        const chatroom_no = this.chatroom.CHATROOM_NO;
        const response = await axios.get(`http://localhost:3000/chat/getChat/${chatroom_no}`);
        this.chatList = response.data;
      } catch (error) {
        console.error(error);
      }
      this.scroll()
    },//채팅룸 데이터베이스 보내기
    async send() {
      if(this.content==''){
        this.$swal({
          icon: 'warning',
          title: '메시지를 입력하세요.',
          scrollbarPadding: false,
          confirmButtonColor: "var(--color-main)"
        })
        return;
      }
      try {
        const chatroom_no = this.chatroom.CHATROOM_NO;
        const chat_content = this.content;
        const user_no = this.user.user_no;

        const response = await axios.post(`http://localhost:3000/chat/send`, {
          chatroom_no,
          chat_content,
          user_no
        });
        if(response.data.message === 'success') {
          this.socket.timeout(5000).emit('chat', {
            chatroom_no: this.chatroom.CHATROOM_NO,
            chat_content: this.content,
            user_no: this.user.user_no
          })
          this.content = '';
          await this.getChat();
        } else {
          console.log('전송 실패');
        }
      } catch (error) {
        console.error(error);
      }
    },//시간 포멧
    formatDateTime(dateTime) {
      const date = new Date(dateTime);
      const now = new Date();
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      // 현재 시간을 기점으로 보낸 지 몇 초 안 됐다면 '0초 전' 이런 식으로 표시
      if(now.getTime() - date.getTime() < 60000) return `방금 전`;
      // 보낸 지 1분 안 됐다면 '0분 전' 이런 식으로 표시
      if(now.getTime() - date.getTime() < 3600000) return `${Math.floor((now.getTime() - date.getTime()) / 60000)}분 전`;
      // 보낸 지 1시간 안 됐다면 '0시간 전' 이런 식으로 표시
      if(now.getTime() - date.getTime() < 86400000) return `${Math.floor((now.getTime() - date.getTime()) / 3600000)}시간 전`;
      // 보낸 지 1일 안 됐다면 '0일 전' 이런 식으로 표시
      if(now.getTime() - date.getTime() < 2592000000) return `${Math.floor((now.getTime() - date.getTime()) / 86400000)}일 전`;
      // 보낸 지 1달 안 됐다면 날짜로 표시

      const formattedDateTime = date.toLocaleDateString("ko-KR", options);
      return formattedDateTime;
    },//채팅 끝내기
    exitChat() {
      window.close();
    },
    // 채팅방 확인시 알람 삭제
    async checkAlarm(){
      try {
        await axios.post(`http://localhost:3000/chat/chat_delete_alarm`,{
          user_no: this.user.user_no,
          chat_room_num: this.chatroom.CHATROOM_NO
        })
      } catch (error) {
        console.error(error);
      }
    }
  },
  unmounted() {
    this.socket.off('chat')
    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('채팅방 연결 끊김');
    })
  },
}
</script>

<style src="../assets/css/global.css" scoped></style>
<style src="../assets/css/board.css" scoped></style>
<style scoped>
.chatroom-container {
  width: 100%;
  height: 100dvh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  overflow: hidden;
  padding: 20px;
}

.chatroom-top {
  width: 100%;
  position: relative;
  text-align: center;
}

.chatroom-top .title {
  font-size: 1.2rem;
}

.chatroom-top .title .user-nm {
  font-size: 1.5rem;
}

.btn-back {
  position: absolute;
  left: 0;
  top: 0;
}

.btn-back i {
  margin-right: 0.5em;
}

.btn-exit {
  position: absolute;
  right: 0;
  top: 0;
}

.chatlog-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: var(--color-main-translucent);
  border: 2px solid var(--color-main);
  border-radius: 12px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chatlog {
  width: 100%;
}

.chat-me,
.chat-else {
  display: flex;
  gap: 10px;
  max-width: 80%;
}

.chat-me {
  flex-direction: row-reverse;
  margin-left: auto;
}

.chat-else {
  margin-right: auto;
}

.profile-pic {
  width: 2.5em;
  min-width: 2.5em;
  height: 2.5em;
  border-radius: 1em;
}

.name-chat-wrap {
  max-width: 100%;
}

.chat-name {
  margin-bottom: 0.5em;
}

.chat {
  padding: 0.7em 0.9em;
  border-radius: 0.3em;
  white-space: pre-wrap;
  overflow: hidden;
}

.chat-me .chat {
  background-color: var(--color-main-dark);
  color: white;
}

.chat-else .chat {
  background-color: white;
}

.viewed-time-wrap {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.chat-me .viewed-time-wrap {
  align-items: flex-end;
}

.chat-viewed {
  color: var(--color-main);
  white-space: nowrap;
}

.chat-time {
  white-space: nowrap;
}

.chat-input-container {
  width: 100%;
  padding: 0.7em;
  border: 2px solid #ddd;
  border-radius: 0.7em;
  display: flex;
  gap: 10px;
  transition: border 0.2s ease-out;
}

.chat-input-container:focus-within {
  border: 2px solid var(--color-main);
}

.chat-input {
  width: 100%;
  height: calc(4.2em + 2px);
}

.chat-send {
  align-self: flex-end;
}
</style>