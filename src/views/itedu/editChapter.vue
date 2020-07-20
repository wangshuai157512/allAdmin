<template>
    <div>
      <el-form ref="form" label-width="80px" class="hc-form">
        <el-form-item label="修改名称" class="form-item chapter-name">
          <el-input v-model="chapterName"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="save-btn" @click="save">保存</el-button>
    </div>
</template>

<script>
    import api from '../../api/itedu'
    export default {
      name: "editChapter",
      data () {
        return {
          chapterName : '',
          chapterId : null
        }
      },
      created () {
        this.chapterId = this.$route.query.id
      },
      methods : {
        save () {
          let data = {
            chapter_id : this.chapterId,
            name : this.chapterName
          }
          api.updateChapter(data).then(res => {
            if (res.code === 1) {

            }
          })
        }
      }
    }
</script>

<style scoped>
  .hc-form {
    margin-top: 10px;
  }
</style>
