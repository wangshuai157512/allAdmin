<template>
  <div class="channel-content">
    <div class="button-content">
      <div class="add-content">
        <el-button type="primary" @click="showModel(0)">添加项目</el-button>
      </div>
    </div>
    <el-table
      :data="classList"
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
      <el-table-column label="视频">
      <template slot-scope="scope">
        {{ scope.row.videoUrl }}
      </template>
    </el-table-column>
      <el-table-column label="是否热门">
        <template slot-scope="scope">
          {{ scope.row.isHot===1?'是':'否' }}
        </template>
      </el-table-column>
      <el-table-column label="所属分类">
        <template slot-scope="scope">
          {{ scope.row.projectName }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="edit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="项目" :visible.sync="dialogFormVisible">
      <el-form :model="projectForm" :rules="rules" ref="projectForm">
        <el-form-item label="项目" label-width="120px" prop="name">
          <el-input v-model="projectForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" label-width="120px" prop="categoryId">
          <el-select v-model="projectForm.categoryId" placeholder="请选择">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="视频地址" label-width="120px" prop="videoUrl">
          <el-input v-model="projectForm.videoUrl" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否热门" label-width="120px" prop="isHot">
          <el-select v-model="projectForm.isHot" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.type"
              :label="item.label"
              :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加项目亮点" label-width="120px">
          <div class="slogan">
            <el-tag closable v-for="(tag,index) in dynamicTags" :key="tag.name" @close="handleClose(index)">{{tag.name}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </div>
        </el-form-item>

        <el-form-item label="资料包名称" label-width="120px">
          <el-input v-model="projectForm.materialName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="资料包简介" label-width="120px">
          <el-input v-model="projectForm.materialIntroduction" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="资料包标签" label-width="120px">
          <el-input v-model="projectForm.materialTag" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="资料包分类标签" label-width="120px">
          <el-input v-model="projectForm.materialTypeTag" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="背景图" label-width="120px">
          <button class="upload-btn" v-if="!projectForm.bgcImg">上传
            <input type="file" @change="projectImg" ref="bgcImg" data-imgname="bgcImg" class="upload-input">
          </button>
          <div class="banner-img-wrap" v-else>
            <img class="banner-img" :src="imgUrl+projectForm.bgcImg" alt="">
            <span class="del-img"><i data-imgname="bgcImg" @click="delImg($event)" class="el-icon-close"></i></span>
          </div>
        </el-form-item>

        <el-form-item label="视频封面" label-width="120px">
          <button class="upload-btn" v-if="!projectForm.videoImg">上传
            <input type="file" @change="projectImg" ref="videoImg" data-imgname="videoImg" class="upload-input">
          </button>
          <div class="banner-img-wrap" v-else>
            <img class="banner-img" :src="imgUrl+projectForm.videoImg" alt="">
            <span class="del-img"><i data-imgname="videoImg" @click="delImg($event)" class="el-icon-close"></i></span>
          </div>
        </el-form-item>

        <el-form-item label="分享封面" label-width="120px">
          <button class="upload-btn" v-if="!projectForm.shareImg">上传
            <input type="file" @change="projectImg" ref="shareImg" data-imgname="shareImg" class="upload-input">
          </button>
          <div class="share-img-wrap" v-else>
            <img class="share-img" :src="imgUrl+projectForm.shareImg" alt="">
            <span class="del-img"><i data-imgname="shareImg" @click="delImg($event)" class="el-icon-close"></i></span>
          </div>
        </el-form-item>

        <el-form-item label="资料包封面" label-width="120px">
          <button class="upload-btn" v-if="!projectForm.materialImg">上传
            <input type="file" @change="projectImg" ref="materialImg" data-imgname="materialImg" class="upload-input">
          </button>
          <div class="share-img-wrap" v-else>
            <img class="share-img" :src="imgUrl+projectForm.materialImg" alt="">
            <span class="del-img"><i data-imgname="materialImg" @click="delImg($event)" class="el-icon-close"></i></span>
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
    <pagination v-show="total>0" :total="total" :page.sync="page" :limit="20" @pagination="getClassList" />
  </div>
</template>

<script>
  import api from './config/api'
  import request from '@/utils/request'
  import upload from '@/utils/upload'
  import config from '../../config'
  import Pagination from '@/components/Pagination'
  export default {
    name: "classIndex",
    data () {
      return {
        classList : [],
        listLoading : false,
        dialogFormVisible : false,
        imgUrl : config.imgUrl,
        page : 1,
        total : 0,
        projectForm : {
          name : '',
          materialName : '',
          materialIntroduction : '',
          materialImg : '',
          materialTag : '',
          materialTypeTag : '',
          categoryId : null,
          videoUrl : '',
          isHot : 0,
          bgcImg : '',
          videoImg : '',
          shareImg : '',
          weight : 0
        },
        options : [
          {
            label : '是',
            type : 1
          },
          {
            label : '否',
            type : 0
          }
        ],

        /**
         * 表单验证
         */
        rules : {
          name : [
            {
              required: true, message: '请输入项目名称',trigger: 'blur'
            }
          ],
          categoryId : { required : true,message : '请选择分类' , trigger: 'change' },
          videoUrl : { required : false,message : '请输入视频地址' , trigger: 'blur' },
          isHot : { required : true,message : '请选择是否热门' , trigger: 'change' },
          weight : [
            {
              required: true, message: '请输入权重',trigger: 'blur'
            },
            {
              required: true,type : 'number',message : '请输入数字'
            }
          ]
        },

        categoryList : [],

        inputVisible : false,
        inputValue : '',
        dynamicTags : [],

        //0:添加 1:修改
        dialogType : 0,

        classId : null

      }
    },
    components : {
      Pagination
    },
    created () {
      this.getClassList()

      this.getCategoryList()
    },
    methods : {

      showModel (type) {

        this.dialogType = type

        if (type === 0) {
          this.projectForm = Object.assign({},this.projectForm, {
            name : '',
            materialName : '',
            materialIntroduction : '',
            materialImg : '',
            materialTag : '',
            materialTypeTag : '',
            categoryId : null,
            videoUrl : '',
            isHot : 0,
            bgcImg : '',
            videoImg : '',
            shareImg : '',
            weight : 0
          })
          this.dynamicTags = []
        }

        this.dialogFormVisible = true

      },

      projectImg (e) {
        let name = e.target.dataset.imgname
        let inputDOM = this.$refs[name];
        console.log(inputDOM.files[0])
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

      getClassList () {

        this.listLoading = true

        request(`${api.getClassList}?page=${this.page}`,'get').then(res => {

          this.listLoading = false

          if (res.code === 1) {
            this.classList = res.data
            this.total = res.total
          } else {
            this.$message.error('获取失败')
          }

        })
      },

      getCategoryList () {
        this.listLoading = true
        request(api.getProjectList,'get').then(res => {
          if (res.code === 1) {
            this.categoryList = res.data
          } else {
            this.$message.error('获取失败')
          }
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
        })
      },

      del (id) {
        let _this = this
        this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          const loading = this.$loading()

          request({
            url : api.delClass,
            method : 'post',
            data : {
              id
            }
          }).then(res => {
            if (res.code === 1) {

              setTimeout(() => {

                this.$message.success('删除成功')

                loading.close()

                _this.getClassList()
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
            let { name,categoryId,isHot,videoUrl,videoImg,bgcImg,shareImg,weight,materialImg,materialIntroduction,materialName,materialTag,materialTypeTag } = this.projectForm
            let slogan = this.dynamicTags
            request({
              url : api.addClassItem,
              method : 'post',
              data : {
                name,
                materialImg,
                materialIntroduction,
                materialName,
                materialTag,
                materialTypeTag,
                categoryId,
                isHot,
                weight,
                bgcImg,
                videoUrl,
                videoImg,
                shareImg,
                slogan
              }
            }).then(res => {
              if (res.code === 1) {
                setTimeout(() => {

                  _this.dialogFormVisible = false

                  loading.close()

                  _this.getClassList()

                  this.projectForm = Object.assign({},this.projectForm, {
                    name : '',
                    materialName : '',
                    materialIntroduction : '',
                    materialImg : '',
                    materialTag : '',
                    materialTypeTag : '',
                    categoryId : null,
                    videoUrl : '',
                    bgcImg : '',
                    videoImg : '',
                    shareImg : '',
                    isHot : 0,
                    weight : 0
                  })

                  this.dynamicTags = []

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

        this.classId = id

        request(`${api.getClassDetail}?id=${id}`,'get').then(res => {
          if (res.code === 1) {
            this.projectForm = Object.assign({},this.projectForm,{
              name : res.data.name,
              materialName : res.data.materialName,
              materialIntroduction : res.data.materialIntroduction,
              materialImg : res.data.materialImg,
              materialTag : res.data.materialTag,
              materialTypeTag : res.data.materialTypeTag,
              categoryId : res.data.projectId,
              videoUrl : res.data.videoUrl,
              isHot : res.data.isHot,
              bgcImg : res.data.bgcImg,
              videoImg : res.data.videoImg,
              shareImg : res.data.shareImg,
              weight : res.data.weight
            })
            this.dynamicTags = res.data.sloganList
          }
          this.showModel(1)
        })


      },

      editProject () {
        let _this = this

        let { name,categoryId,isHot,videoUrl,videoImg,bgcImg,shareImg,weight,materialImg,materialIntroduction,materialName,materialTag,materialTypeTag } = this.projectForm
        let slogan = this.dynamicTags
        this.$refs.projectForm.validate((valid) => {
          if (valid) {

            const loading = this.$loading()

            request({
              url : api.editClass,
              method :'post',
              data : {
                name,categoryId,isHot,videoUrl,weight,slogan,bgcImg,videoImg,shareImg,
                materialImg,materialIntroduction,materialName,materialTag,materialTypeTag,
                classId : this.classId
              }
            }).then(res => {
              if (res.code === 1) {
                setTimeout(() => {

                  _this.dialogFormVisible = false

                  loading.close()

                  _this.getClassList()

                  this.projectForm = Object.assign({},this.projectForm, {
                    name : '',
                    materialName : '',
                    materialIntroduction : '',
                    materialImg : '',
                    materialTag : '',
                    materialTypeTag : '',
                    categoryId : null,
                    videoUrl : '',
                    isHot : 0,
                    videoImg : '',
                    weight : 0
                  })

                  this.dynamicTags = []

                },1000)
              }
            })
          }
        })
      },


      handleClose(index) {
        this.dynamicTags.splice(index, 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push({
            name : inputValue
          });
        }
        this.inputVisible = false;
        this.inputValue = '';
      }

    }
  }
</script>

<style scoped>
  .button-content {
    padding: 24px;
    box-sizing: border-box;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .share-img-wrap {
    position: relative;
    width: 90px;
    height: 80px;
  }
  .share-img {
    width: 90px;
    height: 80px;
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
