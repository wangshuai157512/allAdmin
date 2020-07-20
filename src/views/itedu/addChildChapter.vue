<template>
  <div>
    <el-form ref="form" label-width="80px" class="hc-form">
      <el-form-item label="选择课程" class="form-item">
        <el-select v-model="courseId" placeholder="请选择" @change="changeCourse">
          <el-option
            v-for="(item,index) in courseList"
            :key="index"
            :label="item.title"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择章节" class="form-item">
        <el-select v-model="chapterId" placeholder="请选择">
          <el-option
            v-for="(item,index) in chapterList"
            :key="index"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="子节名称" class="form-item chapter-name">
        <el-input v-model="chapterName"></el-input>
      </el-form-item>
      <el-form-item label="视频地址" class="form-item chapter-name">
        <el-input v-model="videoUrl"></el-input>
      </el-form-item>
      <el-form-item label="视频时长" class="form-item chapter-name">
        <el-input v-model="videoTime"></el-input>
      </el-form-item>
      <el-form-item label="权重" class="form-item chapter-name">
        <el-input v-model="weight"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" class="add-btn" @click="add">添加</el-button>
  </div>
</template>

<script>
  import api from '../../api/itedu'
  export default {
    name: "addChapter",
    data () {
      return {
        courseId : null,
        courseList : [],
        chapterList : [],
        chapterName : '',
        weight : 0,
        chapterId : null,
        videoTime : '',
        videoUrl : ''
      }
    },
    created () {
      this.getCourseList()
    },
    methods : {
      getCourseList () {
        let loading = this.$loading({ text : '加载中' })
        api.getCourse().then(res => {
          if (res.code === 1) {
            this.courseList = res.data
          }
          loading.close()
        })
      },
      changeCourse (e) {
        this.getChapter(e)
      },
      getChapter (course_id) {
        api.getChapter({ course_id }).then(res => {
          if (res.code === 1) {
            this.chapterList = res.data
          }
        })
      },
      add () {
        if (!this.courseId || !this.chapterName || !this.chapterId || !this.videoTime || !this.videoUrl) {
          this.$message.error('请输入完整内容');
          return
        }
        let loading = this.$loading({ text : '加载中' })
        let data = {
          name : this.chapterName,
          chapterId : this.chapterId,
          time : this.videoTime,
          videoUrl : this.videoUrl,
          weight : this.weight
        }
        api.addChildChapter(data).then(res => {
          loading.close()
          if (res.code === 1) {
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.chapterName = ''
            this.videoUrl = ''
            this.videoTime = ''
          }else {
            this.$message.error('添加失败');
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
  .chapter-name{
    width: 500px;
  }
  .add-btn {
    margin-left: 10px;
  }
</style>

