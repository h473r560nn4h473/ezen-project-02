<template>
  <main class="wrap">
    <div class="inner-wrap">
      <div class="title">자습실 예약</div>
      <!-- 층, 방, 날짜, 시간 선택 -->
      <div class="top-container">
        <div class="select"> <!-- 구역 -->
          <div class="caption">층 선택</div>
          <div class="list">
            <button type="button" class="btn-big" @click="room_name(1)" :class="{ 'selected': selectedFloor === 1 }">1층</button>
            <button type="button" class="btn-big" @click="room_name(2)" :class="{ 'selected': selectedFloor === 2 }">2층</button>
            <button type="button" class="btn-big" @click="room_name(3)" :class="{ 'selected': selectedFloor === 3 }">3층</button>
          </div>
        </div>
        <div class="select"> <!-- 자습실 선택 -->
          <div class="caption">자습실 선택</div>
          <div class="list" v-if="room_names.length > 0">
            <button type="button" class="btn-big" v-for="roomName in room_names" :key="roomName" @click="dates(roomName)" :class="{ 'selected': selectedRoom === roomName }">
              {{ roomName }}
            </button>
          </div>
          <div class="null" v-else>층을 선택해주세요.</div>
        </div>
        <div class="select"> <!-- 날짜 선택 -->
          <div class="caption">날짜 선택</div>
          <input class="date btn-big" ref="myDateInput" type="date" @click="isActive = true" :class="{ 'selected': isActive }" @input="selectDate()" v-model="selectedDate" v-if="showCalendar[selectedRoom]" />
          <div class="null" v-else>자습실을 선택해주세요.</div>
        </div>
        <div class="select"> <!-- 시간 -->
          <div class="caption">시간 선택</div>
          <div class="list" v-if="times.length > 0">
            <button type="button" class="btn-big" v-for="time in times" :key="time" @click="selectTime(time)" :class="{ 'selected': selectedTime === time }">
              {{ time }}
            </button>
          </div>
          <div class="null" v-else>날짜를 선택해주세요.</div>
        </div>
      </div>

      <!-- 좌석 선택 -->
      <div class="bottom-container">
        <div class="select-check">
          <input type="checkbox" id="one-seat" v-model="selectedSeats.oneSeat" class="checkbox-large" @click="handleClick('oneSeat')" />
          <label for="one-seat" class="label-large"></label>
          <!-- <input type="checkbox" id="two-seat" v-model="selectedSeats.twoSeat" class="checkbox-large" @click="handleClick('twoSeat')" />
          <label for="two-seat" class="label-large">2인석</label>
          <input type="checkbox" id="four-seat" v-model="selectedSeats.fourSeat" class="checkbox-large" @click="handleClick('fourSeat')" />
          <label for="four-seat" class="label-large">4인석</label> -->
        </div>
        <div class="select-notice" v-if="seatVisible">좌석을 선택해주세요.</div>
        <div class="select-notice-null" v-else></div>
      </div>
      <div class="seat-select">
        <div class="room">
          <div class="door">
            <span>&nbsp;&nbsp;&nbsp;출입구</span>
          </div>
          <div class="table">
            <span>책&nbsp;&nbsp;&nbsp;상</span>
          </div>
          <div v-if="seatVisible" class="seat-wrap">
            <template v-for="(seatLine, index) in numbergroup" :key="index">
              <div class="seat-row">
                <template v-for="(seat, index2) in seatLine.slice(1)" :key="index2">
                  <button type="button" class="seat" :class="[ { 'reserved-seat': isSeatReserved(seat) }, { 'selected-seat': isSelected(seat) } ]" @click="selectSeat(seat)">
                    {{ seat.seat_number }}
                  </button>
                </template>
              </div>
            </template>
          </div>
          <div v-else class="seat-wrap-null">
            <div>상단 옵션 선택을 완료하시면 좌석이 표시됩니다.</div>
          </div>
        </div>
      </div>
      <div class="btn-area">
        <button class="btn-big" @click="makeReservation">예약하기</button>
      </div>
    </div>
  </main>
</template>

<script setup>
import axios from "axios";
import  store  from "../store";
import Swal from 'sweetalert2';
import { reactive, ref, watch, computed, onMounted, watchEffect } from 'vue';
const isSeatNotSelected = computed(() => selectedSeatIds.value.length === 0);
const selectedSeatIds = ref([]);

const room_names = ref([]);
const selectedFloor = ref(null);
const selectedRoom = ref(null);
const selectedTime = ref('');
const selectedDate = ref('');
const isActive = ref(false);

const times = ref([]);
let showCalendar = reactive({});
let seatVisible = ref(false);

const numbergroup = ref([]);

const reservedSeats = ref([]);


//체크박스로 1인 예매인지 2인 예매인지 4인 예매인지 확인하기 위해 필요
const selectedSeats = reactive({
  oneSeat: true,
  twoSeat: false,
  fourSeat: false,
});

const room_name = async (roomFloor) => {
  try {
    const response = await axios.get(`http://localhost:3000/reservation/roomlist/${roomFloor}`);

    if (response && response.data) {
      room_names.value = response.data.map(item => item.STR_ROOM);
      selectedFloor.value = roomFloor;
      selectedRoom.value = null;
    }
  } catch(error) {
    console.error(error);
  }
}

const dates = (roomName) => {
    
  showCalendar[roomName] = !showCalendar[roomName];
   
  if (showCalendar[roomName]) {  
    selectedRoom.value = roomName;
  } else {
    selectedRoom.value = null; // 선택이 해제되면 null로 설정 (선택 해제에 따라서 변경)
  }
}

const selectDate = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/reservation/timelist`);
    times.value = response.data.map(item => item.TIME_START);
  } catch(error) {
    console.error(error);
  }  
}

const selectTime = (time) => {
  // 선택한 시간에 대한 처리 로직 작성
  selectedTime.value = time;
};

watch(selectedTime, () => {
  seatVisible.value = !!selectedTime.value;
});

const seat = async () => {
  const room_name = selectedRoom.value;
  const response = await axios.post(`http://localhost:3000/reservation/getSeat/${room_name}`);

  if (response && response.data) {
    const movieSeat = response.data;
    const seats = movieSeat.map((seat) => ({
      seat_id: seat.SEAT_ID,
      seat_number: seat.SEAT_NUMBER,
      seat_line: seat.SEAT_LINE
    }));

    const seatLines = [...new Set(seats.map((seat) => seat.seat_line))];

    const groupedSeats = seatLines.reduce((acc, seatLine) => {
      acc[seatLine] = seats.filter((seat) => seat.seat_line === seatLine);
      return acc;
    }, {});

    const sortedSeatLines = seatLines.sort();

    numbergroup.value = sortedSeatLines.map((seatLine) => {
      return [seatLine, ...groupedSeats[seatLine]];
    });
  }
};

const updateSeatStatus = () => {
    const selectedRoomName = selectedRoom.value;
    const selectedDates = selectedDate.value;
    const reservatingTime = selectedTime.value;
    if (!selectedRoomName || !selectedDates || !reservatingTime) {
        return;
    }
    // 선택된 자습실, 날짜, 시간에 따라 예약된 좌석을 가져오는 비동기 함수
    const fetchReservedSeats = async () => {
        try {
            const response = await axios.post("http://localhost:3000/reservation/getReserved", {
                room_name: selectedRoomName,
                res_date: selectedDates,
                res_time: reservatingTime,
            });

            if (response && response.data) {
              console.log(response.data);
                reservedSeats.value = response.data;
            } else {
                reservedSeats.value = []; // 예약된 좌석이 없는 경우 빈 배열로 초기화
            }
        } catch (error) {
            console.error("예약된 좌석 정보를 가져오는 중에 오류가 발생했습니다:", error);
        }
    };

    // 예약된 좌석 정보 업데이트
    fetchReservedSeats();

    // 좌석 상태 업데이트 로직 작성
    // 예약된 좌석은 비활성화 처리
    const reservedSeatIds = reservedSeats.value.map((seat) => seat.RES_SEAT_IDS);

    numbergroup.value.forEach((seatLine) => {
        seatLine.slice(1).forEach((seat) => {
            seat.disabled = reservedSeatIds.includes(seat.RES_SEAT_IDS);
        });
    });
};

const reservedSeat = async () => {
    try {
        const selectedRoomName = selectedRoom.value;
        const selectedDates = selectedDate.value;
        const reservatingTime = selectedTime.value;

        const response = await axios.post("http://localhost:3000/reservation/getReserved", {
              room_name: selectedRoomName,
              res_date: selectedDates,
              res_time: reservatingTime,
        });

        if (response && response.data) {
            reservedSeats.value = response.data;
        } else {
            reservedSeats.value = []; // 예약된 좌석이 없는 경우 빈 배열로 초기화
        }
    } catch (error) {
        console.error("예약된 좌석 정보를 가져오는 중에 오류가 발생했습니다:", error);
    }
};
const isSeatReserved = (seat) => {
    return reservedSeats.value.some((reservedSeat) => reservedSeat.RES_SEAT_IDS === seat.seat_id);
};

watchEffect(() => {

if (selectedRoom.value && selectedTime.value) {
    seat();
    reservedSeat();
}
});

const selectSeat = (seat) => {
    // 선택 유형에 따른 좌석 수를 결정합니다.
    const seatCount = selectedSeats.oneSeat ? 1 :
        selectedSeats.twoSeat ? 2 :
            selectedSeats.fourSeat ? 4 : 0;

    const currentSeatNumber = parseInt(seat.seat_number);  // 선택하려는 좌석의 번호입니다.
    const currentSeatLine = numbergroup.value.find(seatLine => seatLine[0] === seat.seat_line);

    // 현재 행의 마지막 좌석 번호를 찾습니다.
    const lastSeatNumberInCurrentLine = Math.max(...currentSeatLine.slice(1).map(s => parseInt(s.seat_number)));

    // 선택하려는 마지막 좌석의 번호는 현재 행의 마지막 번호와 `currentSeatNumber`에 `seatCount`를 더한 값 중 작은 값입니다.
    const endSeatNumber = Math.min(lastSeatNumberInCurrentLine, currentSeatNumber + seatCount - 1);

    // 선택하려는 모든 좌석들이 이미 예약되어 있지 않은지 확인합니다.
    for (let seatNumber = currentSeatNumber; seatNumber <= endSeatNumber; seatNumber++) {
        const targetSeat = currentSeatLine.slice(1).find(s => parseInt(s.seat_number) === seatNumber);
        if (!targetSeat || isSeatReserved(targetSeat)) {
            console.error(`선택하려는 좌석(${seat.seat_line}, ${seatNumber})은 이미 예약되어 있습니다.`);
            return;
        }
    }

    // 현재 행에 충분한 좌석이 남아있는지 확인합니다.
    const remainingSeatsInCurrentLine = lastSeatNumberInCurrentLine - currentSeatNumber + 1;
    if (remainingSeatsInCurrentLine < seatCount) {
        console.error(`선택하려는 좌석(${seat.seat_line}, ${currentSeatNumber} ~ ${endSeatNumber})은 충분하지 않습니다.`);
        return;
    }

    // 모든 좌석들이 선택 가능하다면 선택합니다.
    for (let seatNumber = currentSeatNumber; seatNumber <= endSeatNumber; seatNumber++) {
        const targetSeat = currentSeatLine.slice(1).find(s => parseInt(s.seat_number) === seatNumber);

        console.log('Selected Seat:', targetSeat);
        toggleSeatSelection(targetSeat);
    }
};


const toggleSeatSelection = (seat) => {
    const seatIndex = selectedSeatIds.value.indexOf(seat.seat_id);
    if (seatIndex === -1) {
        // 좌석이 선택되지 않은 경우, 선택 처리
        selectedSeatIds.value = [...selectedSeatIds.value, seat.seat_id];
    } else {
        // 좌석이 이미 선택된 경우, 선택 해제
        selectedSeatIds.value = [
            ...selectedSeatIds.value.slice(0, seatIndex),
            ...selectedSeatIds.value.slice(seatIndex + 1),
        ];
    }
};

const isSelected = (seat) => {
    return selectedSeatIds.value.includes(seat.seat_id);
};

const handleClick = (seatType) => {
    selectedSeatIds.value = [];
    if (seatType === 'oneSeat') {
        selectedSeats.oneSeat = true
        selectedSeats.twoSeat = false
        selectedSeats.fourSeat = false
    } else if (seatType === 'twoSeat') {
        selectedSeats.oneSeat = false
        selectedSeats.twoSeat = true
        selectedSeats.fourSeat = false
    } else if (seatType === 'fourSeat') {
        selectedSeats.oneSeat = false
        selectedSeats.twoSeat = false
        selectedSeats.fourSeat = true
    }
}

onMounted(() => {
    selectedSeats.oneSeat = true
    updateSeatStatus()
})


watch(selectedSeats, () => {
    console.log("ss")
    updateSeatStatus()
})
watch([selectedRoom, selectedDate, selectedTime], () => {
    // 좌석 정보 초기화 로직을 여기에 작성하세요.
    selectedSeatIds.value = []; // 예약된 좌석 정보 초기화
    reservedSeats.value = []; // 예약된 좌석 정보 초기화
    updateSeatStatus(); // 좌석 상태 업데이트
});

const makeReservation = async () => {
    const selectedRoomName = selectedRoom.value;
    const selectedDates = selectedDate.value;
    const reservatingTime = selectedTime.value;
    const selectedSeatId = selectedSeatIds.value;
    const userNo = store.state.user.user_no;
    if (!selectedRoomName || !selectedDates || !reservatingTime || !selectedSeatId) {
        return;
    }
    try {
      const response = await axios.post("http://localhost:3000/reservation/makeReservation", {
        room_name: selectedRoomName,
        res_date: selectedDates,
        res_time: reservatingTime,
        seat_ids: selectedSeatId,
        user_no: userNo
      });
      if (response.data.message === 'success') {
        Swal.fire({
          icon: 'success',
          title: '예약이 완료되었습니다.',
          showConfirmButton: false,
          timer: 1500,
          confirmButtonColor: "var(--color-main)"
        });
        location.href = `http://localhost:8080/mypage`
      }
    } catch(error) {
      console.error(error);
    }

}

</script>

<style src="../assets/css/global.css" scoped />
<style scoped>
#main {
  padding: 20px;
}

.top-container {
  padding: 1em;
  border: 1px solid #ddd;
  border-radius: 1.2em;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  font-size: 16px;
}

.select {
  display: flex;
  flex-direction: column;
  gap: 20px;
  word-break: nowrap;
}

.caption {
  padding-bottom: 20px;
  text-align: center;
  position: relative;
}

.caption::after {
  content: '';
  display: block;
  width: 20px;
  height: 3px;
  border-radius: 1.5px;
  background-color: var(--color-main);
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
}

.list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-big {
  height: 3em;
  min-height: 3em;
  padding: 0;
}

.selected,
.date:focus {
  background-color: var(--color-main-darker);
}

.null {
  height: 3em;
  padding: 10px;
  border-radius: 0.7em;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eaeaea;
  text-align: center;
  word-break: keep-all;
}

.date {
  color-scheme: dark;
  text-align: center;
}

.bottom-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.select-check {
  display: none;
}

.select-notice {
  display: flex;
  flex-basis: 100%;
  align-items: center;
  color: #999;
  margin: 8px 0px;
}

.select-notice::before,
.select-notice::after {
  content: '';
  flex-grow: 1;
  background-color: #ddd;
  height: 1px;
  font-size: 0;
  line-height: 0;
  margin: 0px 16px;
}

.select-notice-null {
  height: 1px;
  background-color: #ddd;
  margin: 18px 16px;
}

.seat-select {
  width: 100%;
  height: 375px;
  border-radius: 20px;
  background-color: var(--color-main-darkest);
  display: flex;
  justify-content: center;
  align-items: center;
}

.room {
  width: 80%;
  max-width: 500px;
  height: 80%;
  border-radius: 0.7em;
  position: relative;
  background-color: white;
  box-shadow: 0 0 10px -1px white, inset 0 0 10px -1px var(--color-main-darkest);
}

.door {
  width: 6px;
  height: 40px;
  border-radius: 3px;
  background-color: #975d45;
  position: absolute;
  left: -3px;
  top: 20px;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.table {
  width: 40px;
  height: 120px;
  border-radius: 5px;
  background-color: #975d45;
  color: white;
  position: absolute;
  left: 50px;
  bottom: 30px;
  writing-mode: vertical-lr;
  display: flex;
  justify-content: center;
  align-items: center;
}

.seat-wrap,
.seat-wrap-null {
  width: 57%;
  height: 70%;
  position: absolute;
  top: 50%;
  right: 50px;
  transform: translateY(-50%);
  display: flex;
}

.seat-wrap {
  flex-direction: column;
  justify-content: space-between;
}

.seat-wrap-null {
  padding: 1.2em 2em;
  border-radius: 0.7em;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #eaeaea;
}

.seat-row {
  padding: 0.5em;
  border-radius: 1.2em;
  background-color: var(--color-main-translucent);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.seat {
  width: 2em;
  height: 2em;
  border-radius: 0.7em;
  background-color: white;
  border: 2px solid var(--color-main);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-out;
}

.seat:hover {
  background-color: var(--color-main-translucent);
}

.seat.selected-seat {
  background-color: var(--color-main);
  color: white;
}

.seat.reserved-seat {
  background-color: #eaeaea;
  border-color: #eaeaea;
  color: #999;
  cursor: default;
}

.btn-area .btn-big {
  max-width: 500px;
  margin: 0 auto;
}

@media screen and (min-width: 479px) {
  .top-container {
    grid-template-columns: 1fr 1fr;
  }

  .list {
    max-height: calc(3em * 3 + 20px);
    overflow-y: scroll;
  }
}

@media screen and (min-width: 768px) {
  .top-container {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  
  .null {
    height: 100%;
  }
}
</style>