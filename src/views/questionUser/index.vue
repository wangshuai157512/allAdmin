<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="微信">
        <template slot-scope="scope">
          {{ scope.row.user }}
        </template>
      </el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatarUrl" class="img_head" alt="">
        </template>
      </el-table-column>
      <el-table-column label="浏览次数">
        <template slot-scope="scope">
          {{ scope.row.browseNum }}
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="loadMore" />
  </div>
</template>

<script>
import { getQuestionUserList } from '@/api/question'
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
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.loadMore()
  },
  methods: {
    loadMore() {
      this.listLoading = true
      getQuestionUserList(this.listQuery).then(response => {
        console.log(response)
        if (response.success) {
          this.list = response.data
          this.total = response.total
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        } else {
          this.listLoading = false
        }
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
