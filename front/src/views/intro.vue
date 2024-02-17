<template>
  <main class="wrap">
    <div class="inner-wrap">
      <div class="title">
        <h1>기숙사 소개</h1>
      </div>
      <div>
        <strong>이젠대학교 기숙사 홈페이지 <span class="big">'숙<span class="sub-color">덕</span>숙<span class="sub-color">덕</span>'</span>에 방문하신 걸 환영합니다!</strong>
      </div>
      <div class="sub-title"><span class="bar"></span>인사말</div>
      <div class="txt-row">
        <span>
          본 기숙사는 이젠대학교가 21세기 글로벌 시대에 선도 대학으로 거듭나기 위하여 이젠캠퍼스 건립 마스터 플랜에 포함되어 2010.6.30 준공하였고 지하1층, 지상4층 규모의 철근 콘트리트 건물로 외장은 적별돌로 치장하여 아름다운 외관을 자랑합니다.
          <br>
          생활관실로는 2인실 18실, 4인실 105실 합계 123실로 총 456명의 인원을 수용할 수 있습니다.  학습과 사색에 도움이 되고 주변환경이 산과 접하여 아늑한 느낌을 주는 곳으로
          의자, 옷장 등이 완비되어있고, 남 녀동 구별과 층별 사워실,지하층의 휴게실, 편의점, 세탁실 등이 마련되어 있습니다.
          <br>
          이젠대학교 기숙사에 오신 모든 학우분 진심으로 환영합니다! 
        </span>
      </div>
      <div class="sub-title"><span class="bar"></span>기숙사 연혁</div>
      <table class="table top1" cellpadding="0" cellspacing="0">
        <tbody>
          <tr>
            <td class="left">2010.6.30</td>
            <td class="right1 r01">기숙사 준공</td>
          </tr>
          <tr>
            <td class="left">2010. 7.1 ~ 2014.6.30</td>
            <td class="right1 r01">관장 김의진 교수</td>
          </tr>
          <tr>
            <td class="left">2014.7.1 ~ 2018.6.30</td>
            <td class="right1 r01">관장 김서현 교수</td>
          </tr>
          <tr>
            <td class="left">2018.7.1 ~ 2022.6.30</td>
            <td class="right1 r01">관장 이지은 교수</td>
          </tr>
          <tr>
            <td class="left">2022.7.1 ~ 현재</td>
            <td class="right1 r01">관장 이태우 교수</td>
          </tr>
        </tbody>
      </table>
      <div class="sub-title"><span class="bar"></span>기숙사 개요</div>
      <table class="table" cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <th class="nodege-n bottom1" colspan="5">수용인원(실/명)</th>
          </tr>
          <tr>
            <th class="left">사실 유형</th>
            <th class="right2 center">1인실</th>
            <th class="right2 center">2인실</th>
            <th class="right2 r01 center">합 계</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="left">사실 수</td>
            <td class="right2 center">13</td>
            <td class="right2 center">342</td>
            <td class="right2 r01 center">355</td>
          </tr>
          <tr>
            <td class="left">입사 인원</td>
            <td class="right2 center">13</td>
            <td class="right2 center">684</td>
            <td class="right2 r01 center">697</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style src="../assets/css/global.css" scoped></style>
<style scoped>
.inner-wrap {
  gap: 30px;
}

strong {
  font-size: 30px;
  letter-spacing: -0.1em;
  display: block;
  text-align: center;
}

.big {
  color: var(--color-main);
  font-size: 1.2em;
  margin: 0 0.5em;
}

.sub-color {
  color: var(--color-sub);
}

.sub-title {
  font-size: 1.5em;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.3em;
}

.bar {
  width: 4px;
  height: 0.8em;
  border-radius: 2px;
  background-color: var(--color-main);
}

.txt-row {
  font-size: 16px;
}

.table {
  width: 100%;
}

.top1 {
  border-top: 2px solid var(--color-main);
}

.bottom1 {
  border-bottom: 2px solid var(--color-main);
}

.table .left {
  width: 30%;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  padding: 2%;
  background: var(--color-main-translucent);
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  color: #333;
  word-break: keep-all;
}

.table .r01 {
  border-right: 1px solid #ccc;
}

.table .right1 ,
.table .right2 {
  font-size: 16px;
  line-height: 35px;
  padding: 3%;
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  word-break: keep-all;
}

.table .right1 {
  width: 70%;
}

.table .right2 {
  width: calc(70% / 3);
}

.center {
  text-align: center;
}
</style>    