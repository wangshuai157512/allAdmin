<template>
    <div class="app-container">
      <header-group>
        <div class="query-wrap">
          <div class="add-material">
            <el-button type="primary" @click="addMaterial">添加资料</el-button>
          </div>
        </div>
      </header-group>
      <hc-table
        :pagination="false"
        :table-cols="tableCols"
        :table-data="tableData"
      >
        <el-table-column align="center" prop="created_at" label="操作" width="240" slot="opt">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope.row.id,scope.$index)">编辑</el-button>
            <el-button size="mini" type="danger" @click="delMaterial(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </hc-table>
      <div class="dialog">
        <hc-dialog
          :dialog-option="dialogOption"
          @handClick="editMaterial"
        >
          <div>
            <div class="course">
              <label style="margin-right: 10px">选择班型</label>
              <el-select v-model="editMaterialForm.classId" placeholder="请选择">
                <el-option
                  v-for="item in classList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="input__">
              <label style="margin-right: 10px">资料名称</label>
              <div class="input-wrap">
                <el-input v-model="editMaterialForm.materialName" placeholder="请输入资料名称"></el-input>
              </div>
            </div>
            <div class="input__">
              <label style="margin-right: 10px">资料简介</label>
              <div class="input-wrap">
                <el-input v-model="editMaterialForm.brief" placeholder="请输入资料名称"></el-input>
              </div>
            </div>
          </div>
        </hc-dialog>
      </div>
      <div class="add-material-dialog">
        <hc-dialog
          :dialog-option="addMaterialDialogOption"
          @handClick="uploadMaterial"
        >
          <div>
            <div class="course">
              <label style="margin-right: 10px">选择班型</label>
              <el-select v-model="addMaterialForm.classId" placeholder="请选择">
                <el-option
                  v-for="item in classList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="input__">
              <label style="margin-right: 10px">资料名称</label>
              <div class="input-wrap">
                <el-input v-model="addMaterialForm.materialName" placeholder="请输入资料名称"></el-input>
              </div>
            </div>
            <div class="input__">
              <label style="margin-right: 10px">资料简介</label>
              <div class="input-wrap">
                <el-input v-model="addMaterialForm.brief" placeholder="请输入资料名称"></el-input>
              </div>
            </div>
            <div class="add">
              <el-progress
                :percentage="state.globalData.uploadComplete"
                :status="state.globalData.uploadComplete===100?'success':''"
                v-if="isUpload"
              ></el-progress>
              <button class="upload-btn">上传资料
                <input type="file" @change="changeMaterial" ref="material" class="upload-input">
              </button>
            </div>
          </div>
        </hc-dialog>
      </div>
    </div>
</template>

<script>
    import request from '@/utils/request'
    import api from './config/api'
    import { mapState } from 'vuex'
    export default {
      name: "courseData",
      data () {
        return {
          tableData : [],
          tableCols : [
            {
              label : 'ID',
              width : 80,
              props : 'id',
              align : 'center'
            },
            {
              label : '资料名称',
              props : 'materialName'
            },
            {
              label : '资料简介',
              props : 'materialBrief'
            },
            {
              label : '所属班型',
              props : 'name'
            },
            {
              label : '资料链接',
              props : 'materialUrl',
              type : 'a'
            },
            {
              slot : 'opt'
            }
          ],
          dialogOption : {
            showFooterBtn : true,
            dialogVisible : false,
            dialogTitle : '编辑',
          },
          addMaterialDialogOption : {
            dialogVisible : false,
            dialogTitle : '添加',
          },
          classId : '',
          materialId : '',
          classList : [],
          addMaterialForm : {
            classId : null,
            materialName : null,
            materialUrl : null,
            brief : null
          },
          editMaterialForm : {
            classId : null,
            materialName : null,
            brief : null
          },
          isUpload : false
        }
      },
      created () {
        console.log(this.uploadComplete)
        this.getDataList()
        this.getClassList()
      },
      computed : {
        ...mapState({ state : state => state})
      },
      methods : {
        getClassList () {
          request(api.getClassList,'get')
            .then(res => {
              if (res.code === 1) {
                this.classList = res.data
              } else {
                this.$message.error('获取失败')
              }
            })
            .catch(err => {
              this.$message.error('获取失败')
            })
        },
        getDataList () {
          const loading = this.$loading()
          request(api.getMaterial,'get')
            .then(res => {
              if (res.code === 1) {
                this.tableData = res.data
              } else {
                this.$message.error('获取失败')
              }
              loading.close()
            })
            .catch(err => {
              this.$message.error('获取失败')
            })
        },
        edit (id,index) {
          let { materialName, classId , materialBrief } = this.tableData[index]
          this.dialogOption = Object.assign({},this.dialogOption,{
            dialogVisible : true
          })
          this.editMaterialForm = Object.assign({},this.editMaterialForm,{
            classId,
            materialName,
            brief : materialBrief
          })
          this.materialId = id
        },
        editMaterial () {
          let editMaterialForm = this.editMaterialForm
          if (!editMaterialForm.materialName || !editMaterialForm.materialName.replace(/(^\s*)|(\s*$)/g,"")) {
            this.$message.error('请输入资料名称')
            return
          }
          const loading = this.$loading()
          request({
            url : api.editMaterial,
            method: 'post',
            data : {
              id : this.materialId,
              name : editMaterialForm.materialName,
              brief : editMaterialForm.brief,
              classId : editMaterialForm.classId,
            }
          })
            .then(res => {
              if (res.code === 1) {
                setTimeout(() => {
                  this.getDataList()
                },1000)
              } else {
                this.$message.error('修改失败')
              }
              this.$message.success('修改成功')
              this.dialogOption = Object.assign({},this.dialogOption,{
                dialogVisible : false
              })
              loading.close()
            })
            .catch(err => {
              this.$message.error('修改失败')
              loading.close()
            })
        },
        delMaterial (id) {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              request({
                url : api.delMaterial,
                method : 'post',
                data : {
                  id
                }
              })
                .then(res => {
                  if (res.code === 1) {
                    this.$message.success('删除成功')
                    setTimeout(() => {
                      this.getDataList()
                    },500)
                  } else {
                    this.$message.error('删除失败')
                  }
                })
                .catch(err => {
                  this.$message.error('删除失败')
                })
            })
            .catch(err => {

            })
        },
        addMaterial () {
          this.addMaterialDialogOption = Object.assign({},this.addMaterialDialogOption,{
            dialogVisible : true
          })
          this.$store.commit('SET_UPLOAD_COMPLETE',0)
          this.isUpload = false
        },

        changeMaterial () {
          this.isUpload = true
          let inputDOM = this.$refs['material'];
          let file = inputDOM.files[0];
          this.$uploadFile(file)
            .then(res => {
               this.addMaterialForm = Object.assign({},this.addMaterialForm,{
                 materialUrl : res.path
               })
            })
            .catch(err => {
              this.$message.error('上传失败')
            })
          this.$refs.material.value = null;
        },
        uploadMaterial () {
          let addMaterialForm = this.addMaterialForm
          let { classId, materialName, materialUrl,brief } = addMaterialForm
          if (!classId) {
            this.$message.error('请选择班型')
            return
          }
          if (!materialName || !materialName.replace(/(^\s*)|(\s*$)/g,"")) {
            this.$message.error('请输入名称')
            return
          }
          if (!brief || !brief.replace(/(^\s*)|(\s*$)/g,"")) {
            this.$message.error('请输入简介')
            return
          }
          if (!materialUrl) {
            this.$message.error('请上传资料')
            return
          }
          const loading = this.$loading()
          request({
            url : api.addMaterial,
            method : 'post',
            data : {
              name : materialName,
              materialUrl,
              brief,
              classId
            }
          })
            .then(res => {
              if (res.code === 1) {
                this.$message.success('上传成功')
                setTimeout(() => {
                  this.getDataList()
                  this.addMaterialDialogOption = Object.assign({},this.addMaterialDialogOption,{
                    dialogVisible : false
                  })
                  this.addMaterialForm = Object.assign({},this.addMaterialForm,{
                    classId : null,
                    materialName : null,
                    materialUrl : null
                  })
                  this.$store.commit('SET_UPLOAD_COMPLETE',0)
                },1000)
              } else {
                this.$message.error('上传失败')
              }
              loading.close()
            })
            .catch(err => {
              this.$message.error('上传失败')
              this.$store.commit('SET_UPLOAD_COMPLETE',0)
              loading.close()
              this.addMaterialForm = Object.assign({},this.addMaterialForm,{
                materialUrl : null
              })
            })
        },
      }
    }
</script>

<style lang="scss">
  .input__ {
    width: 360px;
    margin-top: 20px;
  }
  .add {
    margin-top: 20px;
    .upload-btn {
      margin-top: 10px;
    }
  }
</style>
