<template>
  <footer>
    <ul class="footer-wrap">
      <li class="footer-content">숙덕숙덕</li>
      <li class="bar"></li>
      <li class="footer-content">서울시 종로구 종로 78 미려빌딩 3층<br>관리자 : 임세인</li>
      <li class="bar"></li>
      <li class="footer-content">서비스이용약관<br>개인정보처리방침</li>
      <li class="bar"></li>
      <li class="footer-content">이메일 무단수집거부</li>
    </ul>
  </footer>
</template>

<script></script>

<style src="../assets/css/global.css" scoped></style>
<style scoped>
footer {
  width: 100%;
  background-color: #333;
  color: white;
  font-size: 14px;
}

.footer-wrap {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.bar {
  width: 1px;
  height: calc(100%-10px);
  background-color: white;
}

@media screen and (min-width: 768.1px) {
  .footer-wrap {
    max-width: 1280px;
    margin: 0 auto;
  }
}
</style>