<template>
  <main class="wrap">
    <div class="inner-wrap">
      <h1 class="title">오시는 길 안내</h1>
      <div class="content">
        <div id="map"></div>
        <div><img src="../assets/map1.png" /></div>
        <div><img src="../assets/map2.png" /></div>
        <div><img src="../assets/map3.png" /></div>
        <div><img src="../assets/map4.png" /></div>
      </div>  
    </div>
  </main>  
</template>

<script>
import { toRaw } from "vue";
export default {
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=eca40114c12912aeb1322962de390162";
      document.head.appendChild(script);
    }
  },
  methods: {
    initMap() {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(37.193560939297804, 127.02339345028298),
        level: 3, //지도 확대/축소 단계(높을수록 축소됨)
      };

      //지도 객체를 등록합니다.
      //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
      this.map = new kakao.maps.Map(container, options);

      var markerPosition = new kakao.maps.LatLng(37.193560939297804, 127.02339345028298);
      var marker = new kakao.maps.Marker({ position: markerPosition });
      marker.setMap(this.map);

      var iwContent = '<div style="width:170px;height:fit-content;padding:5px;"><div style="width:100%;max-height:100px;overflow:hidden;display:flex;justify-content:center;align-items:center;"><img style="width:100%;height:100%;object-fit:cover;" src="https://img.newspim.com/news//2019/08/29/1908291358501670.jpg" alt="캠퍼스 사진"></div><div style="padding:5px;"><div>한신대학교</div><div><a href="https://map.kakao.com/link/map/한신대학교,37.193560939297804,127.02339345028298" style="font-weight:600;color:var(--color-main)" target="_blank">큰지도보기</a> <a href="https://map.kakao.com/link/to/한신대학교,37.193560939297804,127.02339345028298" style="font-weight:600;color:var(--color-main)" target="_blank">길찾기</a></div></div></div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
        iwPosition = new kakao.maps.LatLng(37.193560939297804, 127.02339345028298); //인포윈도우 표시 위치입니다

      // 인포윈도우를 생성합니다
      var infowindow = new kakao.maps.InfoWindow({
        position: iwPosition,
        content: iwContent
      });

      // 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
      infowindow.open(this.map, marker);
    },
    changeSize(size) {
      const container = document.getElementById("map");
      container.style.width = `${size}px`;
      container.style.height = `${size}px`;
      toRaw(this.map).relayout();
    },
  }
};
</script>

<style src="../assets/css/global.css" scoped />
<style scoped>
.content {
  max-width: 800px;
  height: 100%;
  margin: 0 auto;
}

#map {
  width: 100%;
  height: 400px;
}

img {
  width: 100%;
}
</style>
