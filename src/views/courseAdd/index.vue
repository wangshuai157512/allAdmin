<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="课程名称">
        <el-input v-model="form.title"/>
      </el-form-item>
      <el-form-item label="课程类型">
        <el-select v-model="form.type" value-key="id" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="课程标签">
         <el-select v-model="form.tag" multiple placeholder="请选择">
            <el-option
              v-for="item in tagList"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="课程权重">
        <el-input v-model="form.weight" class="w120"/>
      </el-form-item>
      <el-form-item label="课程原价">
        <el-input v-model="form.oldPrice" :disabled="priceDisabled"/>
      </el-form-item>
      <el-form-item label="课程现价">
        <el-input v-model="form.price" :disabled="priceDisabled"/>
      </el-form-item>
      <!-- <el-form-item label="视频地址">
        <el-input v-model="form.videoUrl" :disabled="priceDisabled"/>
      </el-form-item> -->
      <el-form-item label="视频地址">
        <el-button v-if="!isEdit" size="small" type="primary" class="upload-btn" >
          <input  type="file" @change="addQualityVideo" ref="inputer">
          添加视频
        </el-button>
        <el-button v-if="isEdit" size="small" type="primary" class="upload-btn" :disabled="form.type !== 0">
          <input  type="file" @change="addQualityVideo" ref="inputer" :disabled="form.type !== 0" >
          编辑视频
        </el-button>
        <el-input v-model="form.videoUrl" :disabled="form.type === 0" class="videoInput"/>
      </el-form-item>
      <el-form-item label="适合人群">
        <el-select v-model="form.suitablePerson" value-key="id" placeholder="请选择">
          <el-option
            v-for="item in optionsPerson"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="课程介绍">
        <el-input v-model="form.introduce"/>
      </el-form-item>
      <el-form-item label="学习人数">
        <el-input v-model="form.studyNum" class="w120"/>
      </el-form-item>
      <el-form-item label="购买人数">
        <el-input v-model="form.baseNum" class="w120"/>
      </el-form-item>
      <el-form-item label="缩略图片">
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
        <img :src="imgSrc" :v-if="imgSrc" :style="imgSrc ? 'width: 326px;height: 200px' : ''" alt="">
        <el-upload
          v-if="isEdit"
          :action="actionUrl"
          :limit="1"
          :show-file-list="false"
          :on-success="changeEdit">
          <el-button v-if="imgSrc" size="small" type="primary">修改图片</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="封面图">
        <ImgUpload :is-edit="isEdit" :tem-src="bannerSrc" :id="4" @imgUpload="changeUrlBanner" @imgDelete="deleteUrl(4)" @imgEditUrl="changeEditUrl" />
      </el-form-item>
      <el-form-item label="内容(课程介绍)">
        <ImgUpload :is-edit="isEdit" :tem-src="tem1Src" :id="1" @imgUpload="changeUrlCourse" @imgDelete="deleteUrl(1)" @imgEditUrl="changeEditUrl" />
      </el-form-item>
      <el-form-item label="内容(授课老师)">
        <ImgUpload :is-edit="isEdit" :tem-src="tem2Src" :id="2" @imgUpload="changeUrlTeacher" @imgDelete="deleteUrl(2)" @imgEditUrl="changeEditUrl" />
      </el-form-item>
      <el-form-item label="内容(课程表)">
        <ImgUpload :is-edit="isEdit" :tem-src="tem3Src" :id="3" @imgUpload="changeUrlTable" @imgDelete="deleteUrl(3)" @imgEditUrl="changeEditUrl" />
      </el-form-item>
      <el-form-item>
        <el-button v-if="id === undefined || ''" type="primary" @click="onSubmit">新增</el-button>
        <el-button v-else type="primary" @click="onSubmit">编辑</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addTeacherCourse, selectTagCourse, lookTeacherCourse, editTeacherCourse, editTeacherCourseUrl,uploadFile } from '@/api/course'
// import { formatDateTime } from '@/utils'
import Tinymce from '@/components/Tinymce'
import ImgUpload from '@/components/ImgUpload'
import { Message } from 'element-ui'
import Config from '@/utils/config'

let url = ''
let urlBanner = ''
let urlCourse = ''
let urlTeacher = ''
let urlTable = ''

export default {
  components: { Tinymce, ImgUpload },
  data() {
    return {
      id: '',
      isEdit: false,
      form: {
        title: '',
        type: '',
        tag: '', // 课程标签
        weight: 0,
        price: '',
        oldPrice: '',
        videoUrl: '',
        suitablePerson: '',
        name: '',
        introduce: '',
        studyNum: '',
        baseNum: '',
      },
      priceDisabled: false,
      tagList:[],
      optionsPerson: [
        {
          value: 0,
          label: '幼儿阶段'
        },
        {
          value: 1,
          label: '小学阶段'
        },
        {
          value: 2,
          label: '中学阶段'
        },
        {
          value: 3,
          label: '中小学阶段'
        },
      ],
      options: [
        {
        value: 0,
        label: '精讲课'
      }, {
        value: 1,
        label: '面试课'
      }, {
        value: 2,
        label: '笔试课'
      }, {
        value: 3,
        label: '面试+笔试'
      }],
      fileList: [],
      fileContentList: [],
      imgSrc: null,
      actionUrl: '',
      bannerSrc: null,
      tem1Src: null,
      tem2Src: null,
      tem3Src: null
    }
  },
  created() {
    this.selectTagCourse()
    this.id = this.$route.query.id
    if (typeof this.id === 'number') {
      this.look(this.id)
      this.isEdit = true
    }
    // this.$data.actionUrl = Config.DebugUrl + '/wx/api/app_course/uploadImg'
    this.$data.actionUrl = Config.DebugUrl + '/wx/api/upload/uploadFile'
  },
  'watch': {
    '$route': 'fetchData'
  },
  methods: {
    selectTagCourse() {
      selectTagCourse().then((res)=> {
        this.tagList = res.data
      })
    },
    fetchData() {
      Object.assign(this.$data, this.$options.data())
      this.id = undefined
    },
    look(pid) {
      lookTeacherCourse(pid).then(res => {
        console.log(res.course[0].courseTag)

        if (res.success) {
          this.$data.form.title = res.course[0].title
          this.$data.form.type = res.course[0].type
          this.$data.form.tag = res.course[0].courseTag
          this.$data.form.weight = res.course[0].weight
          this.$data.form.price = res.course[0].price
          this.$data.form.videoUrl = res.course[0].videoUrl
          this.$data.form.oldPrice = res.course[0].oldPrice
          this.$data.form.suitablePerson = res.course[0].suitablePerson
          this.$data.form.introduce = res.course[0].introduce
          this.$data.form.studyNum = res.course[0].studyNum
          this.$data.form.baseNum = res.course[0].baseNum
          this.$data.imgSrc = Config.DebugUrl + res.course[0].imgUrl
          this.$data.bannerSrc = Config.DebugUrl + res.course[0].bannerUrl
          this.$data.tem1Src = Config.DebugUrl + res.course[0].tem1
          this.$data.tem2Src = Config.DebugUrl + res.course[0].tem2
          this.$data.tem3Src = Config.DebugUrl + res.course[0].tem3
        }
      }).catch(() => {

      })
    },
    onSubmit() {
      const { title, type, price, oldPrice, videoUrl, introduce, suitablePerson, studyNum, baseNum, tag, weight } = this.$data.form
      if (title === '') {
        Message.error('课程名称不能为空')
      } else if (type === '') {
        Message.error('课程类型不能为空')
      } else if (price === '') {
        Message.error('课程原价不能为空')
      } else if (oldPrice === '') {
        Message.error('课程现价不能为空')
      } else if (videoUrl === '') {
        Message.error('视频链接不能为空')
      } else if (introduce === '') {
        Message.error('课程介绍不能为空')
      } else if (studyNum === '') {
        Message.error('学习人数不能为空')
      } else if (baseNum === '') {
        Message.error('购买人数不能为空')
      } else if (suitablePerson === '') {
        Message.error('适合人群不能为空')
      } else if (tag === '') {
        Message.error('课程标签不能为空')
      }else if (weight === '') {
        Message.error('课程权重不能为空')
      } else {
        // const dateNow = new Date()
        // const mytime = formatDateTime(dateNow)
        let data = {}
        if (this.$data.fileList[0]) {
          data = {
            title: title,
            type: type,
            introduce: introduce,
            studyNum: studyNum,
            baseNum: parseInt(baseNum) ,
            suitablePerson: suitablePerson,
            url: url,
            tag: tag,
            weight: weight
          }
        } else {
          data = {
            title: title,
            type: type,
            introduce: introduce,
            studyNum: studyNum,
            baseNum: parseInt(baseNum),
            suitablePerson: suitablePerson,
            tag: tag,
            weight: weight
          }
        }
        data = (data.type === 0 || data.type === 1 || data.type === 2 || data.type === 3) ? Object.assign(data, { price: price, oldPrice: oldPrice, videoUrl: videoUrl }) : data
        if (typeof (this.id) === 'number') {
          editTeacherCourse(this.id, data).then(res => {
            if (res.success) {
              Message.success('编辑成功')
            } else {
              Message.error('编辑失败')
            }
          }).catch(() => {
            Message.error('编辑失败')
          })
        } else {
          if (data.hasOwnProperty('url')) {
            if (urlCourse === '') {
              Message.error('课程介绍图片未上传')
            } else if (urlTeacher === '') {
              Message.error('授课老师图片未上传')
            } else if (urlTable === '') {
              Message.error('课程表图片未上传')
            }else if (urlBanner === '') {
              Message.error('封面图未上传')
            } else {
              data = Object.assign(data, {
                urlBanner: urlBanner,
                urlCourse: urlCourse,
                urlTeacher: urlTeacher,
                urlTable: urlTable
              })
              addTeacherCourse(data).then(res => {
                if (res.success) {
                  Message.success('新增成功')
                } else {
                  Message.error('新增失败')
                }
              }).catch(() => {
                Message.error('新增失败')
              })
            }
          } else {
            Message.error('缩略图未上传')
          }
        }
      }
    },
    handleRemove(file, fileList) {},
    handlePreview(file) {},
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`).then(() => {
        this.imgSrc = null
        url = ''
      })
    },
    change(file, fileList) {
      // console.log(file)
      if (file.code) {
        this.$data.fileList = [].concat(fileList)
        url = file.data.path
        this.imgSrc = Config.DebugUrl + file.data.path.replace(/public/, '')
      }
    },
    changeEdit(file, fileList) {
      if (file.code) {
        url = file.data.path
        this.imgSrc = Config.DebugUrl + file.data.path.replace(/public/, '')
        // console.log(this.imgSrc)
        const data = {
          imgUrlType: 0,
          url: url
        }
        editTeacherCourseUrl(this.id, data).then(res => {
          if (res.success) {
            Message.success('修改成功')
          } else {
            Message.error('修改失败')
          }
        }).catch(() => {
          Message.error('修改失败')
        })
      }
    },
    changeEditUrl(id, msg) {
      if (parseInt(id) === 1) {
        this.tem1Src = Config.DebugUrl + msg.replace(/public/, '')
      } else if (parseInt(id) === 2) {
        this.tem2Src = Config.DebugUrl + msg.replace(/public/, '')
      }else if (parseInt(id) === 3) {
        this.tem3Src = Config.DebugUrl + msg.replace(/public/, '')
      } else {
        this.bannerSrc = Config.DebugUrl + msg.replace(/public/, '')
      }
      const data = {
        imgUrlType: id,
        url: msg
      }
      editTeacherCourseUrl(this.id, data).then(res => {
        if (res.success) {
          Message.success('修改成功')
        } else {
          Message.error('修改失败')
        }
      }).catch(() => {
        Message.error('修改失败')
      })
    },
    changeUrlBanner(path) {
      console.log(path)
      urlBanner = path
    },
    changeUrlCourse(path) {
      urlCourse = path
    },
    changeUrlTeacher(path) {
      urlTeacher = path
    },
    changeUrlTable(path) {
      urlTable = path
    },
    deleteUrl(id) {
      if (parseInt(id) === 1) {
        urlCourse = ''
      } else if (parseInt(id) === 2) {
        urlTeacher = ''
      }else if (parseInt(id) === 2) {
        urlTable = ''
      } else {
        urlBanner = ''
      }
    },

    upload (file) {
      // console.log('11111')
          return new Promise((resolve, reject)=>{
            let formData = new FormData()
            formData.append('file',file)
            uploadFile(formData)
              .then(res => {
                if (res.code === 1) {
                  console.log(res.data.path)
                  console.log(res.data)
                  this.form.videoUrl = res.data.path
                  this.$message({
                    message: '上传成功'
                  });
                  resolve(res.data)
                } else {
                  this.$message({
                    showClose: true,
                    message: '上传失败',
                    type: 'error'
                  });
                }
              })
          })

        },
    addQualityVideo() {
      let inputDOM = this.$refs.inputer;
          let file = inputDOM.files[0];
          this.upload(file)
            .then(res => {
              console.log(res)
            })
    }
  }
}
</script>

<style scoped>
  .line{
    text-align: center;
  }
  .w120 {
    width: 120px;
  }
  .videoInput {
    width: 600px;
  }
  .upload-btn {
    display: inline-block;
    padding: 9px 15px;
    position: relative;
    font-size: 12px;
    border-radius: 3px;
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
  }
  .upload-btn input {
    position: absolute;
    opacity: 0;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }
</style>

