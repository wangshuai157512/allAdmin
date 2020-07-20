<template>
  <div class="app-container">
    <div class="inputBox">
      <el-input v-model="search" class="input" placeholder="请输入订单编号或微信昵称查询" />
    </div>
    <el-table
      v-loading="listLoading"
      :data="list.filter(data => !search || data.merchOrderId.toLowerCase().includes(search.toLowerCase()) || data.nickName.toLowerCase().includes(search.toLowerCase()))"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单编号" width="95">
        <template slot-scope="scope">
          {{ scope.row.merchOrderId }}
        </template>
      </el-table-column>
      <el-table-column label="课程包类型">
        <template slot-scope="scope">
          {{ scope.row.courseType }}
        </template>
      </el-table-column>
      <el-table-column label="课程包">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="应付金额">
        <template slot-scope="scope">
          {{ scope.row.shouldPayMoney }}元
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
      <el-table-column label="手机">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="支付情况">
        <template slot-scope="scope">
          <p v-if="scope.row.isPay === 1" class="ispay">已支付</p>
          <p v-else-if="scope.row.isPay === 0" class="nopay">未支付</p>
          <p v-else-if="scope.row.isPay === 2" class="cancel">已取消</p>
          <p v-else-if="scope.row.isPay === 3" class="del">已删除</p>
        </template>
      </el-table-column>
      <el-table-column label="是否过期">
        <template slot-scope="scope">
          <p v-if="scope.row.isPast === 1" class="ispay">已过期</p>
          <p v-else-if="scope.row.isPast === 0" class="nopay">未过期</p>
        </template>
      </el-table-column>
      <el-table-column label="实付金额">
        <template slot-scope="scope">
          <p v-if="scope.row.actualPayMoney">{{ scope.row.actualPayMoney }}元</p>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="parseInt(scope.row.state) === 0 && scope.row.isPay === 1" type="primary" size="mini" @click="sign(scope.row.id)">标记订单</el-button>
          <p v-else-if="parseInt(scope.row.state) === 1 && scope.row.isPay === 1" class="have">已领取</p>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />
  </div>
</template>

<script>
import { getCouponOrderList } from '@/api/order'
import Pagination from '@/components/Pagination'
// import { Message } from 'element-ui'

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
      search: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getCouponOrderList(this.listQuery).then(response => {
        if (response.success) {
          this.list = response.order
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
  .ispay {
    color:#409EFF;
  }
  .nopay {
    color:red;
  }
  .cancel {
    color: black;
  }
  .del {
    color: green;
  }
  .have {
    color: green;
  }
</style>
