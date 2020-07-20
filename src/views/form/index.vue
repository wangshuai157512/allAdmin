<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="标题">
        <el-input v-model="form.title"/>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="音乐">
        <el-upload
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-success="change"
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList"
          multiple
          class="upload-demo"
          accept=".mp3"
          action="http://172.16.17.234:3002/api/app_article/uploadMusic">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传mp3文件</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <tinymce :height="300" v-model="form.content"/>
      </el-form-item>
      <el-form-item>
        <el-button v-if="id === undefined || ''" type="primary" @click="onSubmit">新增</el-button>
        <el-button v-else type="primary" @click="onSubmit">编辑</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addArticle, lookArticle, editArticle } from '@/api/table'
import { formatDateTime } from '@/utils'
import Tinymce from '@/components/Tinymce'
import { Message } from 'element-ui'

let url = ''

export default {
  components: { Tinymce },
  data() {
    return {
      id: '',
      form: {
        title: '',
        name: '',
        content: ''
      },
      fileList: []
    }
  },
  created() {
    this.id = this.$route.query.id
    if (this.id) {
      this.look(this.id)
    }
  },
  'watch': {
    '$route': 'fetchData'
  },
  methods: {
    fetchData() {
      Object.assign(this.$data, this.$options.data())
      this.id = undefined
    },
    look(pid) {
      lookArticle(pid).then(res => {
        if (res.success) {
          this.$data.form.title = res.article[0].title
          this.$data.form.name = res.article[0].author
          this.$data.form.content = res.article[0].article
        }
      }).catch(() => {

      })
    },
    onSubmit() {
      const title = this.$data.form.title
      const name = this.$data.form.name
      const content = this.$data.form.content
      console.log(this.$data.fileList)
      if (title === '') {
        Message.error('标题不能为空')
      } else if (name === '') {
        Message.error('姓名不能为空')
      } else if (content === '') {
        Message.error('内容不能为空')
      } else {
        const dateNow = new Date()
        const mytime = formatDateTime(dateNow)
        let data = {}
        if (this.$data.fileList[0]) {
          data = {
            title: title,
            article: content,
            name: name,
            time: mytime,
            url: url
          }
        } else {
          data = {
            title: title,
            article: content,
            name: name,
            time: mytime
          }
        }
        if (this.id) {
          editArticle(this.id, data).then(res => {
            if (res.success) {
              Message.success('编辑成功')
            } else {
              Message.error('编辑失败')
            }
          }).catch(err => {
            console.log(err)
            Message.error('编辑失败')
          })
        } else {
          addArticle(data).then(res => {
            if (res.success) {
              Message.success('新增成功')
            } else {
              Message.error('新增失败')
            }
          }).catch(err => {
            console.log(err)
            Message.error('新增失败')
          })
        }
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 $ { file.name }？`)
    },
    change(file, fileList) {
      if (file.success) {
        this.$data.fileList = [].concat(fileList)
        url = file.path
      }
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

