<template>
  <div class="detail">
    <h2 class="h2">{{ article.title }}</h2>
    <div class="box">
      <div>
        <span>作者：</span>
        <span class="author">{{ article.author }}</span>
      </div>
      <div>
        <span>发布时间：</span>
        <span class="time">{{ article.time }}</span>
      </div>
    </div>
    <audio v-if="article.audioUrl !== null" id="audio" :src="audioUrl" autoplay />
    <img v-if="article.audioUrl !== null" :class="musicState === true ? 'music rotate' : 'music'" alt="" src="../../assets/article/music.png" @click="stopOrStart">
    <div v-html="article.article">
      {{ article.article }}
    </div>
  </div>
</template>

<script>
import { lookArticle } from '@/api/table'
import Config from '@/utils/config'

export default {
  data() {
    return {
      id: '',
      article: {
        title: '',
        author: '',
        time: '',
        article: '',
        audioUrl: null
      },
      musicState: true
    }
  },

  computed: {
    audioUrl() {
      const _this = this
      if (_this.article.audioUrl) {
        return Config.DebugUrl + _this.article.audioUrl
      }
    }
  },

  created() {
    this.id = this.$route.query.id
    this.show(this.id)
  },

  methods: {
    show(pid) {
      lookArticle(pid).then(res => {
        if (res.success) {
          this.$data.article = res.article[0]
        }
      }).catch(() => {

      })
    },
    stopOrStart() {
      this.musicState = !this.musicState
      const audio = document.querySelector('#audio')
      this.musicState ? audio.play() : audio.pause()
    }
  }
}
</script>

<style lang="scss" scoped>
  .detail {
    width: 100%;
    .h2 {
      text-align: center;
    }
    .box {
      width: 80%;
      margin-left: 10%;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .music {
      width: 40px;
      height: 40px;
      position: fixed;
      right: 10px;
      top: 10px;
    }
  }
  .rotate {
    animation: rotate 3s linear infinite;
  }
  @keyframes rotate{
    from{transform: rotate(0deg)}
    to{transform: rotate(359deg)}
  }
</style>
