<template>
  <div>
    <el-upload
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :on-success="change"
      :limit="1"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :action="actionUrl"
      multiple
      class="upload-demo"
      accept=".jpg,.jpeg,.png,.JPG,.JPEG">
      <el-button v-if="!isEdit" size="small" type="primary">点击上传</el-button>
      <div v-if="!isEdit" slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png文件</div>
    </el-upload>
    <img :src="temSrc" class="temSrc" alt="">
    <img :src="imgSrc" :v-if="imgSrc" :style="imgSrc ? 'width: 326px;' : ''" alt="">
    <el-upload
      v-if="isEdit"
      :action="actionUrl"
      :limit="1"
      :show-file-list="false"
      :on-success="changeEdit">
      <el-button size="small" type="primary">修改图片</el-button>
    </el-upload>
  </div>
</template>

<script>
import Config from '@/utils/config'

let url = ''

export default {
  name: 'ImgUpload',
  props: {
    isEdit: {
      type: Boolean,
      require: true,
      default: false
    },
    temSrc: {
      type: String,
      require: true,
      default: null
    },
    id: {
      type: Number,
      require: true,
      default: 0
    }
  },
  data() {
    return {
      fileList: [],
      actionUrl: '',
      imgSrc: ''
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.$data.actionUrl = Config.DebugUrl + '/wx/api/upload/uploadFile'
    console.log(this.$data.actionUrl)
  },
  methods: {
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
      return this.$confirm(`确定移除 ${file.name}？`).then(() => {
        this.imgSrc = null
        url = ''
        this.$emit('imgDelete')
      })
    },
    change(file, fileList) {
      if (file.code) {
        this.$data.fileList = [].concat(fileList)
        url = Config.DebugUrl + file.data.path.replace(/public/, '')
        this.imgSrc = url
        this.$emit('imgUpload', file.data.path)
      }
    },
    changeEdit(file, fileList) {
      if (file.code) {
        this.$emit('imgEditUrl', this.id, file.data.path)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.temSrc {
  width: 200px;
}
</style>
