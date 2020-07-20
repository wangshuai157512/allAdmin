<template>
  <div class="app-container">
    <header-group>
      <div class="query-wrap">
        <div class="user-phone query-input__ query-item">
          <label>手机号:</label>
          <div>
            <el-input v-model="query.phone" placeholder="请输入手机号"></el-input>
          </div>
        </div>
        <div class="teacher-name query-input__ query-item">
          <label>老师姓名:</label>
          <div>
            <el-input v-model="query.teacherName" placeholder="请输入老师姓名"></el-input>
          </div>
        </div>
        <div class="query-input__ query-item">
          <label>是否录入公服:</label>
          <el-select v-model="query.isEnter" placeholder="是否录入公服">
            <el-option
              v-for="item in isEnterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="query-input__ query-item">
          <label>用户状态:</label>
          <el-select v-model="query.userType" placeholder="请选择状态">
            <el-option
              v-for="item in userStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="query-btn">
          <el-button type="primary"  @click="getUser" >查询</el-button>
          <el-button type="success"  @click="exportExlData" >导出</el-button>
        </div>
      </div>
    </header-group>
    <hc-table
      pagination
      :table-cols="tableCols"
      :table-data="list"
      :pagination-option="paginationOption"
      @handChangeSwitch="changeEnter"
      @handPaginationData="fetchData"
    >
      <el-table-column align="center" prop="created_at" label="操作" width="340" slot="opt">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="lookShare(scope.row.id)">我的邀请</el-button>
          <el-button size="mini" type="primary" @click="edit(scope.row.id,scope.$index)">编辑</el-button>
          <el-button size="mini" type="success" @click="exportExl(scope.row.id)">导出</el-button>
        </template>
      </el-table-column>
    </hc-table>
    <hc-dialog
      :dialog-option="dialogOption"
      @handClick="editRoles"
    >
      <div class="roles">
        <label>标记角色</label>
        <el-select v-model="rolesType" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </hc-dialog>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import api from './config/api'
  export default {
    name : 'xc_user',
    data() {
      return {
        list: [],
        page : 1,
        query : {
          phone : '',
          teacherName : '',
          isEnter : '',
          userType : ''
        },
        rolesType : 0,
        tableCols : [
          {
            label : 'ID',
            width : 80,
            props : 'id',
            align : 'center'
          },
          {
            label : '微信昵称',
            props : 'nickname'
          },
          {
            label : '头像',
            props : 'avatarUrl',
            type : 'image'
          },
          {
            label : '手机号',
            props : 'phone',
          },
          {
            label : '上级手机号',
            props : 'firstUserPhone'
          },
          {
            label : '老师姓名',
            props : 'newTeacherName',
          },
          {
            label : '城市',
            props : 'newTeacherCity'
          },
          {
            label : '用户分类',
            props : 'userType',
            type : 'tag',
            tagList : [
              {
                type : 'info',
                name : '游客'
              },
              {
                type : '',
                name : '客户'
              },
              {
                type : 'success',
                name : '销售'
              },
            ]
          },
          {
            label : '是否录入公服',
            props : 'isEnter',
            type : 'switch',
            activeValue : 1,
            inactiveValue : 0
          },
          {
            label : '操作',
            slot : 'opt'
          }
        ],
        options : [
          {
            label : '游客',
            value : 0
          },
          {
            label : '客户',
            value : 1
          },
          {
            label : '销售',
            value : 2
          }
        ],
        userStatusOptions : [
          {
            label : '游客',
            value : 0
          },
          {
            label : '客户',
            value : 1
          },
          {
            label : '销售',
            value : 2
          },
          {
            label : '全部',
            value : ''
          }
        ],
        isEntry : true,
        editUserId : null,
        paginationOption : {
          total : 0,
          page : 1,
          limit : 20
        },
        dialogOption : {
          dialogVisible : false,
        },
        isEnterOptions : [
          {
            label : '是',
            value : 1
          },
          {
            label : '否',
            value : 0
          },
          {
            label : '全部',
            value : ''
          }
        ]
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData(p = {}) {
        if (p.page) {
          this.page = p.page
        }
        const loading = this.$loading()
        request(`${api.getUserList}?phone=${this.query.phone}&teacherName=${this.query.teacherName}&isEnter=${this.query.isEnter}&userType=${this.query.userType}&page=${this.page}`)
          .then(res => {
            if (res.code === 1) {
              let list = res.data
              list.forEach(item => {
                if (item.userType === 2) {
                  item.newTeacherName = item.teacherName
                  item.newTeacherCity = item.teacherCity
                } else {
                  item.newTeacherName = item.firstUserName
                  item.newTeacherCity = item.firstUserCity
                }
              })
              this.list = list
              this.paginationOption = Object.assign({},this.paginationOption,{
                total : res.total
              })
            } else {
              this.$message.error('获取失败')
            }
            loading.close()
          })
          .catch(err => {
            this.$message.error('获取失败')
            loading.close()
          })
      },
      edit (id,index) {
        this.editUserId = id
        let status = this.list[index].userType
        this.rolesType = status
        this.dialogOption = Object.assign({},this.dialogOption,{
          dialogVisible : true
        })
      },
      lookShare (id) {
        this.$router.push({
          path : `shareUser?id=${id}`
        })
      },
      editRoles () {
        const loading = this.$loading()
        request({
          url : api.changeUserType,
          method : 'post',
          data : {
            userId : this.editUserId,
            userType : this.rolesType
          }
        })
          .then(res => {
            if (res.code === 1) {
              this.$message.success('修改成功')
              this.dialogOption = Object.assign({},this.dialogOption,{
                dialogVisible : false
              })
              this.fetchData()
            } else {
              this.$message.error('修改失败')
            }
            loading.close()
          })
          .catch(err => {
            this.$message.error('修改失败')
            loading.close()
          })
      },
      exportExl (id) {
        request(`${api.getShareList}?id=${id}`)
          .then(res => {
            if (res.code === 1) {
              this.$exportExcel({
                tHeader : ['姓名','电话'],
                tKey : ['nickname','phone'],
                exportList : res.data,
                excelName : '分享列表'
              })
            } else {
              this.$message.error('获取失败')
            }
          })
      },
      exportExlData () {
        let list = this.list
        list.forEach(item => {
          item.newIsEnter = item.isEnter === 1?'是':'否'
          switch (item.userType) {
            case 0:
              item.newUserType = '游客'
              break
            case 1:
              item.newUserType = '客户'
              break
            case 2:
              item.newUserType = '销售'
              break
            default:
              item.newUserType = '未知'
              break
          }
        })
        this.$exportExcel({
          tHeader : ['微信昵称','电话','老师姓名','上级姓名','城市','用户标签','是否录入公服'],
          tKey : ['nickname','phone','teacherName','newTeacherName','teacherCity','newUserType','newIsEnter'],
          exportList : list,
          excelName : '用户'
        })
      },
      changeEnter ({ id,index }) {
        const loading = this.$loading()
        let type = this.list[index].isEnter
        request({
          url : api.changeEnter,
          method : 'post',
          data : {
            userId : id,
            isEnter : type
          }
        })
          .then(res => {
            if (res.code === 1) {
              this.$message.success('修改成功')
              // this.fetchData()
            } else {
              this.$message.error('修改失败')
            }
            loading.close()
          })
          .catch(err => {
            this.$message.error('修改失败')
            loading.close()
          })
      },
      getUser () {
        this.page = 1
        this.paginationOption = Object.assign({},this.paginationOption,{
          page : 1
        })
        this.fetchData()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .query-btn {
    margin-left: 10px;
  }
  .query-input__ {
    /*width: 180px;*/
  }
  .query-wrap {
    display: flex;
    flex-wrap: wrap;
    .query-item:first-child {
      margin-left: 0;
    }
    .query-item {
      margin-left: 10px;
    }
  }
  .line{
    text-align: center;
  }
  .img_head {
    width: 50px;
    height: 50px;
  }
</style>
4 33 16 8
