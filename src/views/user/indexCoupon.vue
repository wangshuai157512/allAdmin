<template>
  <div class="app-container">
    <div class="inputBox">
      <el-input v-model="search" class="input" placeholder="请输入微信昵称查询" />
      <!--<el-switch-->
      <!--v-model="auditStatus"-->
      <!--style="float: right;"-->
      <!--active-color="#13ce66" />-->
      <!--<span style="float: right;">开启审核 <br><br> </span>-->
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
          {{ scope.row.nickName }}
        </template>
      </el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatarUrl" class="img_head" alt="">
        </template>
      </el-table-column>
      <el-table-column label="授权信息">
        <template slot-scope="scope">
          <p v-if="scope.row.state === 1" class="have">授权完成</p>
          <p v-else-if="scope.row.state === 0" class="nopay">未授权</p>
          <p v-else-if="scope.row.state === 2" class="nopay">未授权手机号</p>
        </template>
      </el-table-column>
      <el-table-column label="手机">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />
  </div>
</template>

<script>
import { getCouponUserList } from '@/api/user'
import Pagination from '@/components/Pagination'

export default {
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
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      search: '',
      auditStatus: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getCouponUserList(this.listQuery).then(response => {
        if (response.success) {
          this.list = response.user
          this.total = response.total
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
    edit(pid) {
      this.$router.push({
        path: '/vocational/courseAdd',
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
  .have {
    color: green;
  }
  .nopay {
    color:red;
  }
</style>
