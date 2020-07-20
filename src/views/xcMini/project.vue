<template>
  <div class="channel-content">
    <div class="button-content">
      <div class="add-content">
        <el-button type="primary" @click="showModel(0)">添加分类</el-button>
      </div>
    </div>
    <el-table
      :data="projectList"
      v-loading="listLoading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="edit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="分类" :visible.sync="dialogFormVisible">
      <el-form :model="projectForm" :rules="rules" ref="projectForm">
        <el-form-item label="分类名称" label-width="120px" prop="name">
          <el-input v-model="projectForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类缩略图" label-width="120px">
          <button class="upload-btn" v-if="!projectForm.suolueImg">上传
            <input type="file" @change="projectImg" ref="suolueImg" data-imgname="suolueImg" class="upload-input">
          </button>
          <div class="img-wrap" v-else>
            <img class="suolue-img" :src="imgUrl+projectForm.suolueImg" alt="">
            <span class="del-img"><i data-imgname="suolueImg" @click="delImg($event)" class="el-icon-close"></i></span>
          </div>
        </el-form-item>
        <el-form-item label="分类banner图" label-width="120px">
          <button class="upload-btn" v-if="!projectForm.bannerImg">上传
            <input type="file" @change="projectImg" ref="bannerImg" data-imgname="bannerImg" class="upload-input">
          </button>
          <div class="banner-img-wrap" v-else>
            <img class="banner-img" :src="imgUrl+projectForm.bannerImg" alt="">
            <span class="del-img"><i data-imgname="bannerImg" @click="delImg($event)" class="el-icon-close"></i></span>
          </div>
        </el-form-item>
        <el-form-item label="分享封面" label-width="120px">
          <button class="upload-btn" v-if="!projectForm.shareImg">上传
            <input type="file" @change="projectImg" ref="shareImg" data-imgname="shareImg" class="upload-input">
          </button>
          <div class="banner-img-wrap" v-else>
            <img class="share-img" :src="imgUrl+projectForm.shareImg" alt="">
            <span class="del-img"><i data-imgname="shareImg" @click="delImg($event)" class="el-icon-close"></i></span>
          </div>
        </el-form-item>
        <el-form-item label="分类权重" label-width="120px" prop="weight">
          <el-input v-model.number="projectForm.weight" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProject" v-if="dialogType === 0">添 加</el-button>
        <el-button type="primary" @click="editProject" v-else-if="dialogType === 1">保 存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import api from './config/api'
  import request from '@/utils/request'
  import upload from '@/utils/upload'
  import config from '../../config'
  export default {
    name: "project",
    data () {
      return {
        projectList : [],
        listLoading : false,
        dialogFormVisible : false,
        imgUrl : config.imgUrl,
        projectForm : {
          name : '',
          suolueImg : '',
          bannerImg : '',
          shareImg : '',
          weight : 0
        },
        rules : {
          name : [
            {
              required: true, message: '请输入项目名称'
            }
          ],
          weight : [
            {
              required: true, message: '请输入权重',
            },
            {
              type : 'number',message : '请输入数字'
            }
          ]
        },

        //0:添加 1:保存
        dialogType : 0,

        projectId : null
      }
    },
    created () {
      this.getProjectList()
    },
    methods : {

      showModel (type) {
        this.dialogType = type

        this.dialogFormVisible = true

        setTimeout(() => {
          this.$refs.projectForm.resetFields()
        })
        this.projectForm = Object.assign({},this.projectForm,{
          name : '',
          suolueImg : '',
          bannerImg : '',
          shareImg : '',
          weight : 0
        })
      },

      getProjectList () {

        this.listLoading = true

        request(api.getProjectList,'get').then(res => {

          this.listLoading = false

          if (res.code === 1) {
            this.projectList = res.data
          } else {
            this.$message.error('获取失败')
          }

        })
      },
      projectImg (e) {
        let name = e.target.dataset.imgname
        let inputDOM = this.$refs[name];
        let file = inputDOM.files[0];
        upload.uploadImg(file).then(res => {
          this.projectForm[name] = res.path
          this.projectForm = Object.assign({},this.projectForm,{[name] : res.path})
        })
      },

      delImg (e) {
        let name = e.target.dataset.imgname
        this.projectForm = Object.assign({},this.projectForm,{[name] : ''})
      },

      del (id) {
        let _this = this
        this.$confirm('此操作将永久删除该渠道, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          const loading = this.$loading()

          request({
            url : api.delProject,
            method : 'post',
            data : {
              id
            }
          }).then(res => {
            if (res.code === 1) {

              setTimeout(() => {

                this.$message.success('删除成功')

                loading.close()

                _this.getProjectList()
              },1000)


            } else {
              this.$message.error('删除失败')
            }
          })

        }).catch(() => {

        });

      },

      addProject () {
        let _this = this

        this.$refs.projectForm.validate((valid) => {
          if (valid) {
            const loading = this.$loading()
            let { name,suolueImg,bannerImg,shareImg,weight } = this.projectForm
            request({
              url : api.addProject,
              method : 'post',
              data : {
                name,
                weight,
                img : suolueImg,
                banner_img : bannerImg,
                shareImg
              }
            }).then(res => {
              if (res.code === 1) {
                setTimeout(() => {

                  _this.dialogFormVisible = false

                  loading.close()

                  _this.getProjectList()

                },1000)
              } else {
                loading.close()
                this.$message.error('添加失败')
              }
            })
            .catch(err => {
              this.$message.error('添加失败')
            })
          }
        })

      },

      edit (id) {

        this.showModel(1)
        this.projectId = id

        request({
          url : api.getProjectDetail,
          method : 'post',
          data : { id }
        }).then(res => {
            if (res.code === 1) {
              this.projectForm = Object.assign({},this.projectForm,{
                name : res.data.name,
                suolueImg : res.data.img,
                bannerImg : res.data.banner_img,
                weight : res.data.weight
              })
            }
        })


      },
      editProject () {
        let _this = this
        this.$refs.projectForm.validate((valid) => {
          if (valid) {
            const loading = this.$loading()
            let { name,suolueImg,bannerImg,shareImg,weight } = this.projectForm
            let projectId = this.projectId

            request({
              url : api.editProject,
              method : 'post',
              data : {
                name,weight,projectId,
                img : suolueImg,
                banner_img : bannerImg,
                shareImg
              }
            }).then(res => {
              if (res.code === 1) {
                this.$message.success('修改成功')

                setTimeout(() => {
                  _this.dialogFormVisible = false

                  loading.close()

                  _this.getProjectList()
                },1000)

              } else {
                loading.close()
                this.$message.error('修改失败')
              }
            })
              .catch(err => {
                loading.close()
              })

          }
        })

      }

    }
  }
</script>

<style scoped>
  .button-content {
    padding: 24px;
    box-sizing: border-box;
  }
  .img-wrap {
    position: relative;
    width: 132px;
    height: 132px;
    margin-top: 20px;
  }
  .banner-img-wrap {
    position: relative;
    width: 200px;
    height: 100px;
    margin-top: 20px;
  }
  .suolue-img {
    width: 100%;
    height: 100%;
  }
  .share-img {
    width: 90px;
    height: 80px;
  }
  .banner-img {
    width: 200px;
    height: 100px;
  }
  .del-img {
    width: 28px;
    height: 28px;
    position: absolute;
    top: -28px;
    right: 0;
  }
  .del-img i{
    font-size: 28px;
  }
  .upload-input {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .upload-btn {
    position: relative;
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
  }
  .upload-btn:hover {
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
  }
  .upload-btn:active {
    background: #3a8ee6;
    border-color: #3a8ee6;
    color: #fff;
    outline: none;
  }
</style>
