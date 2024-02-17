<template>
  <main class="wrap">
    <div class="inner-wrap">
      <h1 class="title">시설 소개</h1>
      <h2 class="sub-title"><span class="bar"></span>건물 소개</h2>
      <div class="row">
        <div class="img-frame grid-box">
          <div class="img">
            <img src='../assets/domi.png'>
          </div>
        </div>
      </div>
      <h2 class="sub-title"><span class="bar"></span>객실 소개</h2>
      <div class="row">
        <div class="img-frame grid-box">
          <div class="img">
            <img src='../assets/room.png'>
          </div>
        </div>
        <div class="descr">
          <p class="color-main">남자동 / 여자동 / 학생실(2인실)</p>
          <p>연면적: 13,283.93 ㎡</p>
          <p>규모: 지상 8층</p>
          <p>편의시설: 편의점, 세탁실, 휴게실, 식당, 체력 단련실</p>
        </div>
      </div>
      <h2 class="sub-title"><span class="bar"></span>편의시설 소개</h2>
      <div class="row">
        <div class="img-frame grid-box">
          <div class="img">
            <img src='../assets/cu.png'>
          </div>
        </div>
        <div class="descr">
          <p class="color-main">편의점</p>
          <p>위치: 1층</p>
          <p>이용시간: 07:00 ~ 24:00</p>
          <p>전화번호: 02-243-6234</p>
        </div>
      </div>
      <div class="row">
        <div class="img-frame grid-box">
          <div class="img">
            <img src='../assets/wash.png'>
          </div>
        </div>
        <div class="descr">
          <p class="color-main">세탁실</p>
          <p>위치: 남, 여 각 1층</p>
          <p>이용시간: 05:00 ~ 24:00</p>
          <p>시설: 세탁기, 건조기, 다리미</p>
          <p>전화번호: 02-521-5261</p>
        </div>
      </div>
      <div class="row">
        <div class="img-frame grid-box">
          <div class="img">
            <img src='../assets/rest.png'>
          </div>
        </div>
        <div class="descr">
          <p class="color-main">휴게실</p>
          <p>위치: 남, 여 각 2~8층</p>
          <p>이용시간: 05:00 ~ 24:00</p>
          <p>시설: TV, 정수기, 탁자, 의자, 청소기</p>
          <p>전화번호: 02-510-3359</p>
        </div>
      </div>
      <div class="row">
        <div class="img-frame grid-box">
          <div class="img">
            <img src='../assets/eat.png'>
          </div>
        </div>
        <div class="descr">
          <p class="color-main">식당</p>
          <p>위치: 1층</p>
          <p>이용시간: 07:30 ~ 09:00 조식</p>
          <p>12:00 ~ 13:30 중식</p>
          <p>17:30 ~ 19:00 석식</p>
          <p>전화번호: 02-510-2421</p>
        </div>
      </div>
      <div class="row">
        <div class="img-frame grid-box">
          <div class="img">
            <img src='../assets/exercise.png'>
          </div>
        </div>
        <div class="descr">
          <p class="color-main">체력단련실</p>
          <p>위치: 1층</p>
          <p>이용시간: 05:00 ~ 24:00</p>
          <p>시설: TV, 런닝머신 등 헬스기구</p>
          <p>전화번호: 02-510-1235</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style src="../assets/css/global.css" scoped></style>
<style scoped>
.inner-wrap {
  gap: 40px;
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

.row {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 0 50px;
  font-size: 16px;
}

.row:nth-of-type(odd) {
  flex-direction: row;
}

.row:nth-of-type(even) {
  flex-direction: row-reverse;
  text-align: right;
}

.descr {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5em;
  word-break: keep-all;
}

.row:nth-of-type(even) .descr {
  align-items: end;
}

.color-main {
  color: var(--color-main);
  font-size: 1.1em;
  font-weight: 600;
}

.img-frame {
  width: fit-content;
  max-width: 100%;
  min-width: 300px;
  height: 300px;
  padding: 10px;
  border-radius: 20px;
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
  background-color: #ccc;
}

.img-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>