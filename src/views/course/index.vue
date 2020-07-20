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
      <el-table-column align="center" label="ID" width="90">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="课程名称">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="课程权重">
        <template slot-scope="scope">
          {{ scope.row.weight }}
        </template>
      </el-table-column>
      <el-table-column label="课程类型">
        <template slot-scope="scope">
          <p v-if="scope.row.type === 0">精讲课</p>
          <p v-else-if="scope.row.type === 1">面试课</p>
          <p v-else-if="scope.row.type === 2">笔试课</p>
          <p v-else-if="scope.row.type === 3">面试+笔试</p>
        </template>
      </el-table-column>
      <!-- <el-table-column label="是否正价课">
        <template slot-scope="scope">
          <p v-if="scope.row.isPositivePrice === 0">否</p>
          <p v-else-if="scope.row.isPositivePrice === 1">是</p>
        </template>
      </el-table-column> -->
      <el-table-column label="课程价格">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="课程原价">
        <template slot-scope="scope">
          {{ scope.row.oldPrice }}
        </template>
      </el-table-column>
      <el-table-column label="视频地址">
        <template slot-scope="scope">
          {{ scope.row.videoUrl }}
        </template>
      </el-table-column>
      <el-table-column label="课程简介">
        <template slot-scope="scope">
          {{ scope.row.introduce }}
        </template>
      </el-table-column>
      <el-table-column label="适合人群">
        <template slot-scope="scope">
          <p v-if="scope.row.suitablePerson === 0">幼儿阶段</p>
          <p v-if="scope.row.suitablePerson === 1">小学阶段</p>
          <p v-if="scope.row.suitablePerson === 2">中学阶段</p>
          <p v-if="scope.row.suitablePerson === 3">中小学阶段</p>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="220">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="edit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
          <el-button size="mini"  type="info" @click="show(scope.row.id,isShow[1])" v-if="scope.row.isDel === 0">隐藏</el-button>
          <el-button size="mini"  type="success" @click="show(scope.row.id,isShow[0])" v-else>显示</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />
  </div>
</template>

<script>
import { getTeacherList, delTeacherCourse,showTeacherCourse } from '@/api/course'
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
      isShow: [0,1]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getTeacherList(this.listQuery).then(response => {
        if (response.success) {
          this.list = response.course
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
        delTeacherCourse(pid).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    },
    show(id,isShow) {
       showTeacherCourse({courseId:id,isShow}).then(res => {
        //  0显示   1隐藏
          if (res.success) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.fetchData()
          }
        }).catch((e)=> {
          console.log(e)
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
