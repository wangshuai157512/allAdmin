<template>
  <section class="app-main">
      <transition name="fade-transform" mode="out-in">
        <!-- or name="fade" -->
        <!-- <router-view :key="key"></router-view> -->
        <router-view/>
      </transition>
  </section>
</template>

<script>
import bus from '../../../utils/bus'
export default {
  name: 'AppMain',
  data () {
    return {
      tagsList : [],
    }
  },
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  },
  created () {
    bus.$on('tags', msg => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
      console.log(this.tagsList)
    });
  },
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
}
</style>
