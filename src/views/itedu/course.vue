<template>
  <div class="app-container">
    <div class="inputBox">
      <el-input v-model="search" class="input" placeholder="请输入课程名称查询" />
    </div>
    <el-table
      v-loading="listLoading"
      :data="list.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="课程名称">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="课程类型">
        <template slot-scope="scope">
          <p v-if="scope.row.type === 0">默认</p>
          <p v-else-if="scope.row.type === 1">免费</p>
          <p v-else-if="scope.row.type === 2">精讲</p>
        </template>
      </el-table-column>
      <el-table-column label="是否首页推荐">
        <template slot-scope="scope">
          <p v-if="scope.row.isRecommend === 0">否</p>
          <p v-else-if="scope.row.isRecommend === 1">是</p>
        </template>
      </el-table-column>
      <el-table-column label="所属分类">
        <template slot-scope="scope">
          {{ scope.row.catname }}
        </template>
      </el-table-column>
      <el-table-column label="课程简介">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column label="权重">
        <template slot-scope="scope">
          <p>{{scope.row.weight}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="edit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="success" @click="comment(scope.row.id)">评论</el-button>
          <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />
  </div>
</template>

<script>
  import { getItcourseList, delTeacherCourse } from '@/api/course'
  import api from '../../api/itedu'
  import Pagination from '@/components/Pagination'
  export default {
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
        search: ''
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getItcourseList(this.listQuery).then(response => {
          if (response.code === 1) {
            this.list = response.data
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
        this.$confirm('确认要删除该课程？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.delCourse({id : pid}).then(res => {
            if (res.code === 1) {
              console.log(1111)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.fetchData()
            }else {
              this.$message({
                showClose: true,
                message: '删除失败',
                type: 'error'
              });
            }
          })
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
          path: '/itedu/courseAdd',
          query: {
            id: pid,
            type : 0
          }
        })
      },
      comment (pid) {
        this.$router.push({
          path: '/itedu/comments',
          query: {
            id: pid
          }
        })
      }
    }
  }
</script>
