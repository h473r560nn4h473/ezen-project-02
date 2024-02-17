<template>
	<form class="grid-box board-modify">
		<div class="title">수정하기</div>
		<div class="board-title-row">
			<div class="board-subj">제목</div>
			<input type="text" v-model="boardTitle" />
		</div>
		<div class="board-content-row">
			<div class="board-subj">내용</div>
			<textarea type="text" v-model="boardContent"></textarea>
		</div>
		<div class="btn-area">
			<button type="button" class="btn-small" @click="confirmEditContent()">수정완료</button>
			<button type="button" class="btn-small btn-red" @click="goBack()">취소</button>
		</div>
	</form>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			boardlist: {},
			boardTitle: '',
			boardContent: '',
      BOD_NO: this.$route.query.BOD_NO
		};	
	},
	computed: {
		user() {
			return this.$store.state.user;
		}
	},
	mounted() {
    this.getBoardDetail();
	},
	methods: {
    async getBoardDetail() {
      try {
        const response = await axios.get(`http://localhost:3000/board/boardDetail/${this.BOD_NO}`);
        this.boardlist = response.data[0];
        console.log(this.boardlist);
				this.boardTitle = this.boardlist.BOD_TITLE.split('\n').join('<br />');
        this.boardContent = this.boardlist.BOD_CONTENT.split('\n').join('<br />');
      } catch (error) {
        console.error(error);
      }
    },
		confirmEditContent() {
			// 첫 번째 SweetAlert 대화상자
			this.$swal({
				title: '수정 확인',
				text: '정말로 수정하시겠습니까?',
				icon: 'question',
				showCancelButton: true,
				confirmButtonText: '확인',
				cancelButtonText: '취소',
			})
			.then((result) => {
				if (result.isConfirmed) {
					// 여기에 실제 수정 로직 추가
					return axios.post('http://localhost:3000/board/freemodify', {
						bod_no: this.BOD_NO,
						bod_title: this.boardTitle,
						bod_content: this.boardContent,
					});
				}
			})
			.then((res) => {
				if (res && res.data.message === 'success') {
					// 두 번째 SweetAlert 대화상자
					return this.$swal({
						icon: 'success',
						title: '수정되었습니다.',
						showConfirmButton: false,
						timer: 1500,
					});
				}
			})
			.then(() => {
				// 1초 후에 페이지 이동
				return new Promise(resolve => {
					setTimeout(() => {
						// 여기에서 페이지 이동을 수행
						this.$router.go(-1); // 예시: '/'는 이동할 경로에 맞게 수정
						resolve();
					}, 1000);
				});
			})
			.catch(() => {
				// 오류 발생 시 처리
				this.$swal({
					icon: 'error',
					title: '오류 발생',
				});
			});
		},
		goBack() {
			this.$router.push({ path: '/board/free/freeDetail', query: {BOD_NO: this.BOD_NO}})
		}
	}
}
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

.board-content-row .board-subj {
	padding: 0.7em 0;
}
</style>