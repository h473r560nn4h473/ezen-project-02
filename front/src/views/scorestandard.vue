<template>
  <main class="wrap">
    <div class="inner-wrap">
      <div class="contents">
        <h1 class="title">상·벌점기준표</h1>
        <h2 class="sub-title"><span class="bar"></span>상점</h2>
        <table>
          <thead>
            <tr>
              <th>내용</th>
              <th class="score">상점</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in scoreData" :key="index">
              <td>{{ item.name }}</td>
              <td class="score">{{ item.score }}</td>
              <td v-if="item.content">{{ item.content }}</td>
              <td v-else>&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="contents">
        <h2 class="sub-title"><span class="bar"></span>벌점</h2>
        <table>
          <thead>
            <tr>
              <th>내용</th>
              <th class="score">벌점</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in penalties" :key="index">
              <td>{{ item.name }}</td>
              <td class="score">{{ item.score }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      scoreData: [
        { name: '사생회임원', score: +5},
        { name: '사회봉사(행사지원행사)', score: +5},
        { name: '사생봉사(사무실근로)', score: +3, content: '근로 장학생' },
        { name: '사생봉사(자치지도위원)', score: +4 },
        { name: '청소봉사(공공시설물)', score: +4, content: '2시간 봉사' },
        { name: '입퇴사 봉사', score: +3 },
        { name: '생할관 프로그램 참가', score: +2 },
        { name: '소방훈련 참가', score: +2 },
        { name: '교내의무 교육 참가', score: +2}
      ],
      
      penalties: [
        { name: '절도행위, 파렴치행위 등 단체생활 부적응자', score: '퇴사' },
        { name: '타인의 명의로 대리입사', score: '퇴사' },
        { name: '이성의 건물(등) 무단출입자', score: '퇴사' },
        { name: '호실내 애완동물을 키우는 행위', score: '퇴사' },
        { name: '사내에서의 흡연 행위', score: '퇴사' },
        { name: '사내에서 음주, 폭행, 도박 행위', score: '퇴사' },
        { name: '사내의 주류 반입 행위', score: -3 },
        { name: '인원점검 연속3회 이상 무단 불참', score: -3 },
        { name: '사내 기물, 시설물 등의 손상 및 파괴행위', score: -3 },
        { name: '인화물질 및 위험물의 반입 또는 사용', score: -3 },
        { name: '지정된 방의 임의변경', score: -2 },
        { name: '시설물의 무단 이동, 이용 및 가공', score: -1 },
        { name: '비정상적인 관내 출입행위', score: -1 },
        { name: '음식물쓰레기 무단 투기', score: -1 },
        { name: '호실내 불결(냉장고 등) 행위', score: -1 },
      ],
    };
  },
};

</script>

<style src="../assets/css/global.css"></style>
<style scoped>
.inner-wrap {
  display: flex;
  flex-direction: column;
  gap: 80px;
}

.contents {
  display: flex;
  flex-direction: column;
  gap: 30px;
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

table {
  border-top: 2px solid var(--color-main);
  color: #333;
  border-collapse: collapse;
}

table tr th ,
table tr td {
  font-size: 16px;
  padding: 3%;
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  word-break: keep-all;
}

table tr th {
  width: 30%;
  background: var(--color-main-translucent);
  text-align: center;
  font-weight: 700;
}

table tr td {
  line-height: 35px;
}

table tr th:last-child ,
table tr td:last-child {
  border-right: 1px solid #ccc;
}

.score {
  text-align: center;
  width: 15%;
}
</style>
