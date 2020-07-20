<template>
  <div class="app-container">
    <header-group>
      <div class="query-wrap">
        <div class="create-user query-input__">
          <label>手机号:</label>
          <div>
            <el-input v-model="phone" placeholder="手机号"></el-input>
          </div>
        </div>
        <div class="class-course query-input__">
          <label>班型:</label>
          <el-select v-model="classId" placeholder="请选择">
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="class-course query-input__">
          <label>拼团状态:</label>
          <el-select v-model="squadType" placeholder="拼团状态">
            <el-option
              v-for="item in squadState"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="query-btn">
          <el-button type="primary"  @click="getData" >查询</el-button>
        </div>
      </div>
    </header-group>
    <hc-table
      pagination
      :table-cols="tableCols"
      :table-data="list"
      :pagination-option="paginationOption"
      @handPaginationData="getSquad"
    >
      <el-table-column align="center" prop="created_at" label="操作" width="240" slot="opt">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="lookUser(scope.$index)">查看人数</el-button>
        </template>
      </el-table-column>
    </hc-table>
    <el-dialog title="拼团人数" :visible.sync="dialogVisible">
      <el-table v-if="list && list.length > 0" :data="list[squadIndex]?list[squadIndex].squadUserList:[]">
        <el-table-column label="姓名">
          <template slot-scope="scope">
            {{ scope.row.nickname }}
          </template>
        </el-table-column>
        <el-table-column label="头像">
          <template slot-scope="scope">
            <img :src="scope.row.avatarUrl" class="img_head" alt="">
          </template>
        </el-table-column>
        <el-table-column label="电话">
          <template slot-scope="scope">
            {{ scope.row.phone }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import Pagination from '@/components/Pagination'
  import api from './config/api'
  export default {
    data() {
      return {
        list: [],
        total: 0,
        listLoading: false,
        page : 1,
        search: '',
        dialogVisible : false,
        squadIndex : 0,
        classList : [],
        classId : '',
        phone : '',
        squadType : '',
        tableCols : [
          {
            label : 'ID',
            width : 80,
            props : 'squadId',
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
            label : '班型',
            props : 'className',
          },
          {
            label : '当前状态',
            props : 'squadState',
            type : 'tag',
            tagList : [
              {
                type : 'danger',
                name : '拼团失败'
              },
              {
                type : 'success',
                name : '拼团成功'
              },
              {
                type : '',
                name : '拼团中'
              },
            ]
          },
          {
            label : '创建时间',
            props : 'createSquadTime',
          },
          {
            label : '操作',
            slot : 'opt'
          }
        ],
        squadState : [
          {
            label : '全部',
            value : ''
          },
          {
            label : '进行中',
            value : 2
          },
          {
            label : '拼团成功',
            value : 1
          },
          {
            label : '拼团失败',
            value : 0
          }
        ],
        paginationOption : {
          total : 0,
          page : 1,
          limit : 20
        },
      }
    },
    created() {
       this.getSquad()
       this.getClassList()
    },
    methods: {
      getSquad (p = {}) {
        if (p.page) {
          this.page = p.page
        }
        request(`${api.getSquadList}?phone=${this.phone}&classId=${this.classId}&squadType=${this.squadType}&page=${this.page}`,'get')
          .then(res => {
            if (res.code === 1) {
              let list = res.data
              this.list = list
              this.paginationOption = Object.assign({},this.paginationOption,{
                total : res.total
              })
            }
          })
          .catch(err => {
            console.log(err)
            this.$message.error('获取失败')
          })
      },
      lookUser (i) {
        this.dialogVisible = true
        this.squadIndex = i
      },
      getData () {
        this.page = 1
        this.paginationOption = Object.assign({},this.paginationOption,{
          page : 1
        })
        this.getSquad()
      },
      getClassList () {
        request(api.getClassList,'get')
          .then(res => {
            if (res.code === 1) {
              let classList = res.data
              let newClassList = [...classList,{ id : '', name : '全部' }]
              this.classList = newClassList
            } else {
              this.$message.error('请求失败')
            }
          })
          .catch(err => {
            this.$message.error('请求失败')
          })
      }
    }
  }
</script>

<style lang="scss">
  .line{
    text-align: center;
  }
  .img_head {
    width: 50px;
    height: 50px;
  }
</style>
