<template>
  <div class="app-container">
    <div class="inputBox">
      <el-input v-model="search" class="input" placeholder="请输入分享单号查询" />
    </div>
    <el-table
      v-loading="listLoading"
      :data="list.filter(data => !search || data.bill.toLowerCase().includes(search.toLowerCase()))"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="分享单号" width="95">
        <template slot-scope="scope">
          {{ scope.row.bill }}
        </template>
      </el-table-column>
      <el-table-column label="微信昵称">
        <template slot-scope="scope">
          {{ scope.row.user }}
        </template>
      </el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatarUrl" class="img_head" alt="">
        </template>
      </el-table-column>
      <el-table-column label="分享次数">
        <template slot-scope="scope">
          {{ scope.row.shareNum }}
        </template>
      </el-table-column>
      <el-table-column label="真实姓名">
        <template slot-scope="scope">
          {{ scope.row.realName }}
        </template>
      </el-table-column>
      <el-table-column label="手机">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="parseInt(scope.row.state) === 0" type="primary" size="mini" @click="sign(scope.row.id)">标记红包</el-button>
          <p v-else class="have">已领取</p>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />
  </div>
</template>

<script>
import { getShareList, signState } from '@/api/share'
import Pagination from '@/components/Pagination'
import { Message } from 'element-ui'

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
      search: '',
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    renderHeader(h, { column, $index }, index) {
      return h('span', {}, [
        h('span', {}, '时间片段'),
        h('el-popover', { props: { placement: 'top-start', width: '200', trigger: 'hover', content: '领先/落后品类=单店平均单量-该品类城市店均单量' }}, [
          h('i', { slot: 'reference', class: 'el-icon-question' }, '')
        ])
      ])
    },
    fetchData() {
      this.listLoading = true
      getShareList(this.listQuery).then(response => {
        if (response.success) {
          this.list = response.shareOrder
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
    },
    sign(pid) {
      signState({ id: pid }).then(res => {
        if (res.success) {
          Message.success('标记成功')
          this.fetchData()
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
</style>
