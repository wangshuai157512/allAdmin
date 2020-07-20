<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list.filter(data => !search || data.user.includes(search))"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
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
      <el-table-column label="手机">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="page" limit.sync="20" @pagination="fetchData" />
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
        search: ''
      }
    },
    components: { Pagination },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        request(`${api.getUserList}?page=${this.page}`)
          .then(res => {
            if (res.code === 1) {
              this.list = res.data
              this.total = res.total
            } else {
              this.$message.error('获取失败')
            }
            this.listLoading = false
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
