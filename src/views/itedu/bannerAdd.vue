<template>
  <div>
    <div class="form-box">
      <el-form ref="form" label-width="80px" class="hc-form">
        <el-form-item label="所属课程" class="form-item">
          <el-select v-model="id" class="select_width" v-if="query.id">
            <el-option
              v-for="(item,index) in bannerCourseList"
              :key="index"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="id" placeholder="请选择" class="select_width" v-else>
            <el-option
              v-for="(item,index) in bannerCourseList"
              :key="index"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程权重" >
          <el-input v-model="weight" class="weight"></el-input>
        </el-form-item>
      </el-form>
      <div class="img-content">
        <p>banner图</p>
        <div class="upload-box">
          <!-- <div v-if="query.id">
            <img :src="imgUrl(editList.imgUrl)" class="banner-img" v-if="editList.imgUrl"/>
            <img src="../../assets/img/empty-img.jpeg"  v-else class="que-img" />
          </div> -->
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
    </div>
    <el-button type="primary" @click="save" style="margin-top: 20px" v-if="query.id">保存</el-button>
    <el-button type="primary" @click="add" style="margin: 20px 10px 20px;" v-else>添加</el-button>
  </div>
</template>

<script>
    import api from '@/api/itedu'
    import config from '../../config/index'

    export default {
      name: "bannerAdd",
      data() {
        return {
          baseUrl : config.imgUrl,
          query:'',
          bannerUrl : '',
          bannerCourseList: '',
          editList:'',
          id: '',
          weight:0,
          // editPlaceHolder: ''
        }
      },
      computed : {
        
      },
      created () {
        this.query = this.$route.query
        if(this.query.id) {
          this.getCourse()
          
          api.getBannerDetail(this.query).then(res=>{
            if (res.code === 1) {
              this.editList = res.data
              this.bannerUrl = res.data.imgUrl
              this.weight = res.data.weight
              this.id = res.data.courseId
            }
          })
        }else {
          this.getCourse()
        }
        
        
      },
      methods : {
        getCourse() {
           api.getCourse()
          .then(res => {
            if (res.code === 1) {
              this.bannerCourseList = res.data,
              this.id = res.data.id
            }
          })
        },
        add () {
          if (!this.bannerUrl || !this.id || this.weight === '') {
            this.$message({
              showClose: true,
              message: '请输入完整',
              type: 'error'
            });
          }else {
            let data = {
              url : this.bannerUrl,
              courseId: this.id,
              weight: parseInt(this.weight) 
            }
            api.addBanner(data)
              .then(res => {
                if (res.code === 1) {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                  // this.$router.go(-1)
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
          if (!this.bannerUrl || !this.id || this.weight === '') {
            this.$message({
              showClose: true,
              message: '请输入完整',
              type: 'error'
            });
          }else {
            let data = {
               imgUrl : this.bannerUrl,
              courseId: this.id,
              weight: parseInt(this.weight), 
              id: this.query.id
            }
            api.editBanner(data)
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
        editBannerImg () {
          let inputDOM = this.$refs.banner;
          let file = inputDOM.files[0];
          this.upload(file)
            .then(res => {
              this.bannerUrl = res.path
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
  .select_width {
    width: 260px;
  }
  .weight {
    width: 100px;
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
