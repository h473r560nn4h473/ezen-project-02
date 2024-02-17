<template>
  <div class="container">
    <div class="title">
      <i class="fa-solid fa-chart-pie title-icon"></i>
      <span>통계</span>
    </div>
    <!-- 남녀 비율 통계 -->
    <div class="grid-box">
      <div class="graph-title">남녀 비율</div>
      <div class="graph">
        <canvas ref="genderChartRef"></canvas> <!-- 여기에 그래프 -->
      </div>
    </div>

    <!-- 자습실 별 통계 -->
    <div class="grid-box">
      <div class="graph-title">자습실 별 예약 분포</div>
      <div class="graph">
        <canvas ref="resChartRef"></canvas> <!-- 여기에 그래프 -->
      </div>
    </div>
    
    <!-- 학년 별 나이대 통계 -->
    <div class="grid-box">
      <div class="graph-title">학년 별 성별 분포</div>
      <div class="graph">
        <canvas ref="gradeAgeChartRef"></canvas> <!-- 여기에 그래프 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import axios from 'axios';
//import router from "@/router";

// 차트를 위한 ref
const genderChartRef = ref(null);
const resChartRef = ref(null);
const gradeAgeChartRef = ref(null);

// 서버로부터 데이터 가져오기
const fetchData1 = async () => {
    try {
        const response = await axios.get('http://localhost:3000/admin/chart/getChartData');
            
        createGenderChart(response.data);
      
    } catch (error) {
        console.error(error);
    }
};

const fetchData2 = async () => {
  try {
        const response = await axios.get('http://localhost:3000/admin/chart/getResData');
          
          createResChart(response.data);

  } catch (error) {
    console.error(error);
  }
};

const fetchData3 = async () => {
  try {
        const response = await axios.get('http://localhost:3000/admin/chart/getGradeData');
          
          createGradeAgeChart(response.data);

  } catch (error) {
    console.error(error);
  }
}


// 남녀 비율 차트 생성
const createGenderChart = (genderData) => {
  const labels = genderData.map(item => item.GENDER);
  const data = genderData.map(item => item.COUNT);
  const ctx = genderChartRef.value.getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        label: '남녀 비율',
        data,
        backgroundColor: ['#5890fd', '#fc6f65'],
      }]
    },
  });
};

//연령대 별 분포 차트 생성
const createResChart = (resData) => {
  const roomRanges = {
    "제 1실": 0,
    "제 2실": 0,
    "제 3실": 0,
    "제 4실": 0,
    "제 5실": 0,
    "제 6실": 0,
  };

  resData.forEach(item => {
    const rname = item.RNAME;
    const count = item.COUNT;

    if (rname == '제 1실') roomRanges["제 1실"] += count;
    else if (rname == '제 2실') roomRanges["제 2실"] += count;
    else if (rname == '제 3실') roomRanges["제 3실"] += count;
    else if (rname == '제 4실') roomRanges["제 4실"] += count;
    else if (rname == '제 5실') roomRanges["제 5실"] += count;
    else if (rname == '제 6실') roomRanges["제 6실"] += count;
  });

  const labels = Object.keys(roomRanges);
  const data = Object.values(roomRanges);

  const ctx = resChartRef.value.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: '자습실 별 예약 좌석 수',
        data,
        backgroundColor: '#5bafcb',
      }]
    },
  });
};

const createGradeAgeChart = (gradeData) => {
  const labels = [];
  const dataMale = [];
  const dataFemale = [];

  // 카테고리 이름을 중복 없이 가져옵니다.
  const uniqueGrades = [...new Set(gradeData.map(item => item.grade))];

  uniqueGrades.forEach(grade => {
    // 남성과 여성 데이터를 초기화합니다.
    let maleCount = 0;
    let femaleCount = 0;

    // 해당 카테고리의 남성과 여성 데이터를 찾습니다.
    gradeData.forEach(item => {
      if (item.grade === grade) {
        if (item.gender === '남성') {
          maleCount = item.count;
        } else if (item.gender === '여성') {
          femaleCount = item.count;
        }
      }
    });

    // 결과를 저장합니다.
    labels.push(grade);
    dataMale.push(maleCount);
    dataFemale.push(femaleCount);
  });

  const ctx = gradeAgeChartRef.value.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: '남성',
          data: dataMale,
          backgroundColor: '#5890fd',
        },
        {
          label: '여성',
          data: dataFemale,
          backgroundColor: '#fc6f65',
        }
      ]
    },
  });
};

// 컴포넌트가 마운트되면 데이터 가져오기
onMounted(() => {
  fetchData1();
  fetchData2();
  fetchData3();
});
</script>

<style src="../assets/css/global.css" scoped />
<style scoped>
.container {
  padding: 50px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.title {
  display: flex;
  gap: 0.5em;
  align-items: center;
}

.title-icon {
  color: var(--color-main);
}

.grid-box {
  max-width: 1280px;
  font-size: 1.2em;
  font-weight: 500;
}

.graph-title {
  padding: 10px 20px 20px 20px;
  border-bottom: 2px solid #ccc;
}

.graph {
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
}
</style>