<template>
	<main class="content_wrap">
		<div class="title">
			<h1>QnA</h1>
		</div>
		<form>
			<div class="wrap" v-for="qna in qnalist" :key="qna.QNA_NO">
				<div class="top_wrap">
					<div class="top">답변 작성자&nbsp;&nbsp;{{ qnalist[0].DOC_NM }}</div>
				</div>
				<table class="content_wrap">
					<tr>
						<th><span class="bar"></span>제목</th>
						<td>{{ qnalist[0].QNA_TITLE }}</td>
					</tr>
					<tr>
						<th><span class="bar"></span>작성일자</th>
						<td>{{ formatDateTime(qnalist[0].QNA_DATE) }}</td>
					</tr>
					<tr>
						<th><span class="bar"></span>내용</th>
						<td v-html="qna_content"></td>
					</tr>
					<tr v-if="qna_answer">
						<th><span class="bar"></span>답변</th>
						<td v-html="qna_answer"></td>
					</tr>
					<tr v-else>
					</tr>
				</table>
				<div class="img_wrap">
					<div class="img_frame">
						<img v-if="qnalist[0].QNA_IMAGE"
							:src="require(`../../../back/uploads/uploadQna/` + `${qnalist[0].QNA_IMAGE}`)" alt="질문 사진">
						<img v-else src='../assets/imgempty.svg' alt="null">
					</div>
				</div>
				<div class="btn_area">
					<div v-if="user.user_no !== ''">
						<div class="btn_container" v-if="user.user_no != qnalist[0].USER_NO">
							<button class="btn_small" @click="gotoChatRoom(qnalist[0].USER_NO), createChatRoom()">작성자와 1:1 채팅</button>
						</div>
					</div>
					<button type="button" class="btn_small" @click="MyQnaMain">목록으로</button>
				</div>
			</div>
		</form>
	</main>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			qnalist: [],
			editable: false,
			QNA_NO: this.$route.query.QNA_NO,
			qna_content: '',
			qna_answer: '',
		}
	},
	computed: {
		user() {
			return this.$store.state.user; //user 정보가 바뀔 때마다 자동으로 user() 갱신
		},
	},
	mounted() {
		this.getQnaDetail();
	},
	methods: {
		async getQnaDetail() {
			try {
				const response = await axios.get(`http://localhost:3000/qna/qnadetail/${this.QNA_NO}`);
				this.qnalist = response.data;
				//console.log(this.qnalist);
				this.qna_content = this.qnalist[0].QNA_CONTENT.split('\n').join('<br />');
				this.qna_answer = this.qnalist[0].QNA_ANSWER.split('\n').join('<br />');
			} catch (error) {
				console.error(error);
			}
		},
		formatDateTime(dateTime) {
			const date = new Date(dateTime);
			const formattedDateTime = date.toLocaleString('ko-KR');
			return formattedDateTime;
		},
		getQnaImg() {
			if (this.qnalist[0].QNA_IMAGE) {
				return require('../../../back/uploads/uploadQna/' + this.qnalist[0].QNA_IMAGE);
			} else {
				return require('../assets/imgempty.png');
			}
		},
		MyQnaMain() {
			this.$router.push('/qnaMain');
		},
		gotoChatRoom() {
			let popupWindow = window.open(`/chatroom/${this.qnalist[0].USER_NO}`, '_blank', 'left=100', 'top=50', 'scrollbars=no', 'resizable=no', 'toolbars=no', 'menubar=no');
			popupWindow.resizeTo(800, 650)
			popupWindow.onresize = (_ => {
				popupWindow.resizeTo(800, 650)
			})
			this.$router.go(-1);
		},
		async createChatRoom() {
			try {
				if (this.user.user_no == this.qnalist[0].USER_NO) {
					return this.$swal('본인과의 채팅은 불가능합니다.');
				} else {
					await axios({
						url: `http://localhost:3000/chat/getChatRoom/${this.user.user_no}/${this.qnalist[0].USER_NO}`,
						method: "POST",
						data: {
							ask: this.user.user_no,
							answer: this.qnalist[0].USER_NO,
						}
					})
				}
			} catch (error) {
				console.error(error);
			}
		},
	}
}
</script>

<style src="../assets/css/global.css" scoped />
<style src="../assets/css/boardContent.css" scoped />