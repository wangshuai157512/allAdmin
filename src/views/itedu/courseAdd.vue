<template>
  <div>
    <div class="form-box">
      <el-form ref="form" :model="form" label-width="80px" class="hc-form">
        <el-form-item label="课程名称" class="form-item">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="课程介绍" class="form-item">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="form.description">
          </el-input>
        </el-form-item>
        <el-form-item label="课程讲师" class="form-item">
          <el-input v-model="form.teacher"></el-input>
        </el-form-item>
        <el-form-item label="课程权重" class="form-item">
          <el-input v-model="form.weight"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" class="form-item">
          <el-select v-model="catid" placeholder="请选择" v-if="query.type === 0">
            <el-option
              v-for="(item,index) in course.categoryList"
              :key="index"
              :label="item.catname"
              :value="item.catid">
            </el-option>
          </el-select>
          <el-select v-model="catid" placeholder="请选择" v-else>
            <el-option
              v-for="(item,index) in categoryList"
              :key="index"
              :label="item.catname"
              :value="item.catid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属类型" class="form-item">
          <el-select v-model="typeid" placeholder="请选择">
            <el-option
              v-for="(item,index) in typeList"
              :key="index"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否推荐" class="form-item">
          <el-select v-model="recommendid" placeholder="请选择">
            <el-option
              v-for="(item,index) in recommend"
              :key="index"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="img-content">
        <p>缩略图</p>
        <div class="upload-box">
          <div>
            <img :src="imgUrl(smallUrl)" class="samll-img" v-if="smallUrl"/>
            <img src="../../assets/img/empty-img.jpeg" v-else class="que-img" />
          </div>
          <button class="upload-btn">
            编辑
            <input type="file" @change="editSmallImg" ref="inputer">
          </button>
        </div>
      </div>
      <div class="img-content">
        <p>banner图</p>
        <div class="upload-box">
          <div>
            <img :src="imgUrl(bannerUrl)" class="banner-img" v-if="bannerUrl"/>
            <img src="../../assets/img/empty-img.jpeg"  v-else class="que-img" />
          </div>
          <button class="upload-btn">
            编辑
            <input type="file" @change="editBannerImg" ref="banner">
          </button>
        </div>
      </div>
      <div class="img-content">
        <p>课程简介</p>
        <div class="upload-box">
          <div class="course-img" v-if="contentUrl && contentUrl.length >= 1">
            <div
              style="position: relative"
              v-for="(item,index) in contentUrl"
              :key="index"
            >
              <img
                :src="imgUrl(item)"
                class="content-img"
                style="margin-right: 5px"
              />
              <span class="close-icon" @click="deleteImg(index)">
                <i class="el-icon-close"></i>
              </span>
            </div>
          </div>
          <div v-else>
            <img src="../../assets/img/empty-img.jpeg" class="que-img"/>
          </div>
          <button class="upload-btn">
            添加
            <input type="file" @change="addContentUrl" ref="contentUrl">
          </button>
        </div>
      </div>
      <div class="img-content">
        <p>教师头像</p>
        <div class="upload-box">
          <div>
            <img :src="imgUrl(teacherHeadUrl)" class="samll-img" v-if="teacherHeadUrl" />
            <img src="../../assets/img/empty-img.jpeg" v-else class="que-img"/>
          </div>
          <button class="upload-btn">
            编辑
            <input type="file" @change="editTeacherImg" ref="teacher">
          </button>
        </div>
      </div>
    </div>
    <el-button type="primary" @click="save" style="margin-top: 20px" v-if="query.type === 0">保存</el-button>
    <el-button type="primary" @click="add" style="margin: 20px 10px 20px;" v-else>添加</el-button>
  </div>
</template>

<script>
    import api from '@/api/itedu'
    import config from '../../config/index'
    export default {
      name: "courseAdd",
      data() {
        return {
          baseUrl : config.imgUrl,
          form: {
            name: '',
            description : '',
            teacher : '',
            weight : ''
          },
          typeList : [
            {
              label : '默认',
              id : 0
            },
            {
              label : '免费',
              id : 1
            },
            {
              label : '精品',
              id : 2
            },
          ],
          recommend : [
            {
              label : '否',
              id : 0
            },
            {
              label : '是',
              id : 1
            }
          ],
          categoryList : [],
          catid: '',
          typeid:'',
          recommendid: '',
          query : {},
          course : {},
          smallUrl : '',
          bannerUrl : '',
          teacherHeadUrl : '',
          contentUrl : [],
          videoUrl : ''
        }
      },
      computed : {

      },
      created () {
        this.query = this.$route.query
        if (this.query.type === 0) {
          this.getCourseDetail()
        }else {
          api.getCategory()
            .then(res => {
              if (res.code === 1) {
                this.categoryList = res.data
              }
            })
        }
      },
      methods : {
        deleteImg (i) {
          let newContentUrl = this.contentUrl.filter((item,index) => index !== i)
          this.contentUrl = newContentUrl
        },
        addContentUrl () {
          let inputDOM = this.$refs.contentUrl;
          let file = inputDOM.files[0];
          this.upload(file)
            .then(res => {
              this.contentUrl.push(res.path)
            })
        },
        add () {
          if (!this.form.name || !this.form.description || this.form.weight === '' || !this.form.teacher || !this.teacherHeadUrl || !this.smallUrl || !this.bannerUrl || !this.contentUrl) {
            console.log(this)
            this.$message({
              showClose: true,
              message: '请输入完整',
              type: 'error'
            });
          }else {
            let data = {
              catid : this.catid,
              type : this.typeid,
              title : this.form.name,
              description : this.form.description,
              imgUrl : this.smallUrl,
              bannerUrl : this.bannerUrl,
              contentUrl : this.contentUrl.join(','),
              teacherName : this.form.teacher,
              teacherHeadImg : this.teacherHeadUrl,
              isRecommend : this.recommendid,
              weight : this.form.weight,
              videoUrl : this.videoUrl,
              id : this.course.id
            }
            api.addCourse(data)
              .then(res => {
                if (res.code === 1) {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                  this.$router.go(-1)
                } else {
                  this.$message({
                    showClose: true,
                    message: '添加失败',
                    type: 'error'
                  });
                }
              })

          }
        },
        save () {
          if (!this.form.name || !this.form.description || this.form.weight === '' || !this.form.teacher || !this.teacherHeadUrl || !this.smallUrl || !this.bannerUrl || !this.contentUrl) {
            console.log(this)
            this.$message({
              showClose: true,
              message: '请输入完整',
              type: 'error'
            });
          }else {
            let data = {
              catid : this.catid,
              type : this.typeid,
              title : this.form.name,
              description : this.form.description,
              imgUrl : this.smallUrl,
              bannerUrl : this.bannerUrl,
              contentUrl : this.contentUrl.join(','),
              teacherName : this.form.teacher,
              teacherHeadImg : this.teacherHeadUrl,
              isRecommend : this.recommendid,
              weight : this.form.weight,
              videoUrl : this.videoUrl,
              id : this.course.id
            }
            api.updateCourse(data)
              .then(res => {
                if (res.code === 1) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                  this.$router.go(-1)
                } else {
                  this.$message({
                    showClose: true,
                    message: '修改失败',
                    type: 'error'
                  });
                }
              })

          }
        },
        imgUrl (url) {
          return this.baseUrl + url
        },
        editSmallImg () {
          let inputDOM = this.$refs.inputer;
          let file = inputDOM.files[0];
          this.upload(file)
            .then(res => {
              this.smallUrl = res.path
            })
        },
        editBannerImg () {
          let inputDOM = this.$refs.banner;
          let file = inputDOM.files[0];
          this.upload(file)
            .then(res => {
              this.bannerUrl = res.path
            })
        },
        editTeacherImg () {
          let inputDOM = this.$refs.teacher;
          let file = inputDOM.files[0];
          this.upload(file)
            .then(res => {
              this.teacherHeadUrl = res.path
            })
        },
        UploadVideoData () {
          let inputDOM = this.$refs.videoUrl;
          let file = inputDOM.files[0];
          console.log(file)
          this.upload(file)
            .then(res => {
              this.videoUrl = res.path
            })
        },
        upload (file) {
          return new Promise((resolve, reject)=>{
            let formData = new FormData()
            formData.append('file',file)
            api.uploadFile(formData)
              .then(res => {
                if (res.code === 1) {
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
        getCourseDetail () {
          api.getCourseDetail({id : this.query.id})
            .then(res => {
              if (res.code === 1) {
                let data = res.data
                this.course = data
                this.form.name = data.title
                this.form.description = data.description
                this.form.teacher = data.teacherName
                this.form.weight = data.weight
                this.catid = data.catid
                this.typeid = data.type
                this.recommendid = data.isRecommend
                this.smallUrl = data.imgUrl
                this.bannerUrl = data.bannerUrl
                this.teacherHeadUrl = data.teacher_head_img
                this.contentUrl = data.contentUrl?data.contentUrl:[]
                this.videoUrl = data.videoUrl
              }
            })
        }
      }
    }
</script>

<style scoped>
  .course-img {
    display: flex;
  }
  .content-img {
    width: 200px;
  }
  .close-icon {
    position: absolute;
    top: 0;
    right: 10px;
    z-index: 10;
  }
  .samll-img {
    width: 150px;
    height: 150px;
  }
  .banner-img {
    width: 300px;
    height: 150px;
  }
  .upload-box {

  }
  .img-content {
    padding: 0 10px;
  }
  .hc-form {
    width: 460px;
  }
  .form-item {
    margin-top: 20px;
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
  .que-img{
    width: 200px;
  }
</style>
