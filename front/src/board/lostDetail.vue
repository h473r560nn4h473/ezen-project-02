<template>
	<div class="grid-box">
		<div class="top-wrap">
			<div class="post-title">{{ lostdetail.LOST_TITLE }}</div>
			<div class="top">
				<div class="top-left">
          <div class="profile-pic">
            <img v-if="lostdetail.USER_IMG" :src="require('../../../back/uploads/uploadUser/' + `${lostdetail.USER_IMG}`)" alt="댓글 프로필">
            <i v-else class="fa-solid fa-user"></i>
          </div>
          <div class="nick">{{ lostdetail.USER_NICK }}</div>
          <div class="bar"></div>
          <div class="date">{{ formatDateTime(lostdetail.LOST_DATE) }}</div>
				</div>
				<div class="top-right">
					<div class="solved" v-if="lostdetail.LOST_STATE == 1"><i class="fa-solid fa-check icon"></i>해결됐어요</div>
					<div v-else><i class="fa-solid fa-question icon"></i>미해결</div>
					<div class="bar"></div>
          <div><i class="fa-regular fa-eye icon"></i>{{ lostdetail.LOST_COUNT }}</div>
        </div>
			</div>
		</div>
		<div class="content-section">
      <div v-html="lostContent" class="content"></div>
			<div class="img-uploaded-wrap">
				<div class="img-uploaded" v-for="imgs in lostImgs" :key="imgs.LOST_IMG">
					<img :src="require('../../../back/uploads/uploadLost/' + `${imgs.LOST_IMG}`)">
				</div>
			</div>
      <div class="ad">
        <div class="ad-notice"><i class="fa-solid fa-circle-info"></i> 광고</div>
        <img v-if="adImageLoaded" src="https://www.dc601.com/files/board/2023/12/44bba3eb56558c22f6b35d6453112324.jpg" alt="자격증 광고" @error="handleAdImageError">
        <span v-else>이미지를 불러올 수 없습니다.</span>
      </div>
			<!-- 해결 버튼 -->
			<button class="btn-solved" v-if="user.user_no !== '' && user.user_no === lostdetail.USER_NO && lostdetail.LOST_STATE === 0" @click="lostChange()">
				<i class="fa-solid fa-check"></i><span>해결</span>
			</button>

			<!-- 해결완료 버튼 -->
			<button class="btn-solved" v-else-if="user.user_no !== '' && user.user_no === lostdetail.USER_NO && lostdetail.LOST_STATE !== 0" disabled>
				<i class="fa-solid fa-check"></i><span>해결완료</span>
			</button>

			<!-- 1:1 채팅 버튼 -->
			<button class="btn-solved" v-else-if="user.user_no !== '' && user.user_no != lostdetail.USER_NO" @click="gotoChatRoom(lostdetail.USER_NO), createChatRoom()">
				작성자와 1:1 채팅
			</button>

			<!-- 그 외의 경우 버튼 숨기기 -->
			<button class="btn-solved" v-else disabled>
				<i class="fa-solid fa-check"></i><span>버튼 숨김</span>
			</button>
    </div>
		<div class="btn-area">
      <button v-show="lostdetail.USER_NO == user.user_no" type="button" class="btn-small btn-blue" @click="ModifyLost(lostdetail.LOST_NO)">수정</button>
      <button v-show="lostdetail.USER_NO == user.user_no" type="button" class="btn-small btn-red" @click="DeleteLost(lostdetail.LOST_NO)">삭제</button>
			<button type="button" class="btn-small" @click="LostMain">목록으로</button>
		</div>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			lostdetail: {},
			lostContent:'',
			lostImgs: [],
			adImageLoaded: true, // 광고 이미지 로딩 여부를 추적하는 상태 변수
		}
	},
	computed: {
		user() {
			return this.$store.state.user;
		}
	},
	mounted() {
		axios
			.get('http://localhost:3000/lost/lostdetail', {
			params: {
				lost_no: this.$route.query.LOST_NO
			},
		}).then((res) => {
			console.log(res.data[0]);
			this.lostdetail = res.data[0];
			this.lostContent = this.lostdetail.LOST_CONTENT.split('\n').join('<br />');
		}).catch((error) => {
			console.log(error);
		});
		axios
			.get('http://localhost:3000/lost/lostImgs' , {
				params: {
				lost_no: this.$route.query.LOST_NO
			},
		}).then((res) => {
			console.log(res.data);
			this.lostImgs = res.data;
		}).catch((error) => {
			console.log(error);
		});
	
	},
	methods: {
		LostMain() {
			axios({
        url: "http://localhost:3000/lost/addLCount", 
        method: "POST",
        data: {
          lost_no: this.$route.query.LOST_NO
        },
      }).then(res => {
        if (res.data.message == 'complete') {
          if (this.user.user_tp == 1) {
            this.$router.go(-1);
          } else {
            this.$router.push({ path: '/board/lost'})
          }
        }
      }).catch(err => {
        alert(err);
      });
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
		gotoChatRoom() {
			const popupWidth = 800;
			const popupHeight = 700;
			const popupX = (window.screen.width / 2) - (popupWidth / 2);
			const popupY = (window.screen.height / 2) - (popupHeight / 2);
			let popupWindow = window.open(`/chatroom/${this.lostdetail.USER_NO}`, '채팅', 'height=' + popupHeight  + ', width=' + popupWidth  + ', left=' + popupX + ', top='+ popupY + ', location=no, menubar=no, scrollbars=no, status=no, titlebar=no, toolbar=no');
		},
		async createChatRoom() {
			try {
				if (this.user.user_no == this.lostdetail.USER_NO) {
					return this.$swal({
						icon: 'error',
						title: '본인과의 채팅은 불가능합니다.'
					});
				} else {
					await axios({
						url: `http://localhost:3000/chat/getChatRoom/${this.user.user_no}/${this.lostdetail.USER_NO}`,	// 로그인한 사용자 번호와 글 작성자 번호를 채팅방 생성 기능으로 전달
						method: "POST",
					})
				}
			} catch (error) {
				console.error(error);
			}
		},
		ModifyLost(LOST_NO) {
			this.$router.push({ path: '/board/lost/lostModify', query: {lost_no: LOST_NO}})
		},
		DeleteLost(LOST_NO) {
      this.$swal({
        title: `게시글을 삭제하시겠습니까?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
      }).then(result => {
        if(result.value) {
          this.deleteLostA(LOST_NO); 
        }
      });
    },
		deleteLostA(LOST_NO) {
      axios({
        url: "http://localhost:3000/lost/deleteLost", //board.js에 있는 deletecontent 실행
        method: "POST",
        data: {
          lost_no: LOST_NO
        },
      }).then(res => {
        if(res.data.message == 'success') {
          this.$swal({
						icon: 'success',
						title: '삭제되었습니다.',
						showConfirmButton: false,
						timer: 1500
					})
					this.$router.push('/board/lost');
        } else {
					this.$swal({
						icon: 'error',
						title: 'DB 에러'
					});
				}
      }).catch(err => {
        this.$swal({
					icon: 'error',
					title: err
				});
      });
    },
		async lostChange() {
			try {
				const response = await axios.post(`http://localhost:3000/lost/updateLost/${this.$route.query.LOST_NO}`);
				console.log(response);
				this.$router.go(0);
			} catch (error) {
				console.error(error);
			}
		},
    handleAdImageError() { // 광고 이미지 로딩에 실패했을 때 실행될 메소드
      this.adImageLoaded = false; // 광고 이미지 로딩 실패 상태를 업데이트
    }
	}
}
</script>

<style src="../assets/css/global.css" scoped />
<style src="../assets/css/board.css" scoped />