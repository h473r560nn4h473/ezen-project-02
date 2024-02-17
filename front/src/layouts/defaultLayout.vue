<template>
  <Header />
  <div class="main-wrap">
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Header from './header.vue'
import Footer from './footer.vue'

export default {
  components: {
    Header, Footer
  }
}
</script>

<style scoped>
.main-wrap {
  min-height: 100dvh;
}
</style>

