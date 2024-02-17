<template>
  <div v-if="showChildComponent" class="grid-box"><score-component /></div>
  <div v-if="showChildComponent" class="grid-box"><myres-component /></div>
</template>
<script>
import MyresComponent from "@/mypage/myRes.vue"
import ScoreComponent from "@/components/score.vue"

export default {
  data() {
    return {
      showChildComponent: true,
      childTitle: "제목",
      childContent: "내용",
    };
  },
  components:{
    MyresComponent, ScoreComponent
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {}
}
</script>

<style src="../assets/css/global.css" scoped></style>