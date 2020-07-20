<template>
  <div class="app-container">
    <div class="inputBox">
      <el-input v-model="search" class="input" placeholder="请输入微信昵称查询" />
    </div>
    <el-table
      v-loading="listLoading"
      :data="list.filter(data => !search || data.user.includes(search))"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="微信昵称">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatarUrl" class="img_head" alt="">
        </template>
      </el-table-column>
      <el-table-column label="课程名称">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="章节名称">
        <template slot-scope="scope">
          {{ scope.row.chapter_name }}
        </template>
      </el-table-column>
      <!--<el-table-column align="center" prop="created_at" label="操作" width="240">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />
  </div>
</template>

<script>
  import api from '@/api/itedu'
  import Pagination from '@/components/Pagination'

  export default {
    data() {
      return {
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
        },
        search: ''
      }
    },
    components: { Pagination },
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
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        console.log(this.$route.query)
        api.getShareList({id:this.$route.query.id}).then(response => {
          if (response.code === 1) {
            this.list = response.data
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
          } else {
            this.listLoading = false
          }
        })
      },
      del(pid) {
        this.$confirm('确认要删除该咨询？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // delCourse(pid).then(res => {
          //   if (res.success) {
          //     this.$message({
          //       type: 'success',
          //       message: '删除成功!'
          //     })
          //     this.fetchData()
          //   }
          // })
        }).catch(() => {
        })
      },
      look(pid) {
        this.$router.push({
          path: '/detail',
          query: {
            id: pid
          }
        })
      },
      share(pid) {
        this.$router.push({
          path: '/itedu/userShare',
          query: {
            id: pid
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .line{
    text-align: center;
  }
  .img_head {
    width: 50px;
    height: 50px;
  }
</style>
