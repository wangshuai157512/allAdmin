<template>
  <div class="app-container">
    <!--<div class="inputBox">-->
      <!--<el-input v-model="search" class="input" placeholder="请输入课程名称查询" />-->
    <!--</div>-->
    <el-table
      v-loading="listLoading"
      :data="list.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>

      <el-table-column label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatarUrl" alt="">
        </template>
      </el-table-column>
      <el-table-column label="评论内容">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="edit(scope.row.id,0)">显示</el-button>
          <el-button size="mini" type="danger" @click="edit(scope.row.id,1)">隐藏</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />-->
  </div>
</template>

<script>
    import api from '../../api/itedu'
    import Pagination from '@/components/Pagination'
    export default {
      name: "comments",
      components: {Pagination},
      filters: {
        statusFilter(status) {
          const statusMap = {
            published: 'success',
            draft: 'gray',
            deleted: 'danger'
          }
          return statusMap[status]
        }
      },
      data() {
        return {
          list: [],
          total: 0,
          listLoading: true,
          listQuery: {
            page: 1,
            limit : 10
          },
          search : ''
        }
      },
      created () {
        this.getComments()
      },
      methods : {
        getComments () {
          api.getComments({id:this.$route.query.id})
            .then(res => {
              if (res.code === 1) {
                this.listLoading = false
                this.list = res.data
              }
            })
        },
        edit (id,type) {
          api.editComment({id,type})
            .then(res => {
              if (res.code === 1) {
                this.getComments()
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
              } else {
                this.$message({
                  showClose: true,
                  message: '修改失败',
                  type: 'error'
                });
              }
            })
        }
      }
    }
</script>

<style scoped>

</style>
