<template>
  <div class="app-container">
    <div class="inputBox">
      <el-input v-model="search" class="input" placeholder="请输入课程名称查询" />
      <!--<el-button type="primary" @click="addCourse">新增</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list.filter(data => !search || data.couponTypeName.toLowerCase().includes(search.toLowerCase()))"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="优惠券名称">
        <template slot-scope="scope">
          {{ scope.row.couponTypeName }}
        </template>
      </el-table-column>
      <el-table-column label="课程包">
        <template slot-scope="scope">
          {{ scope.row.courseType }} | {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="优惠券价格">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="是否发放">
        <template slot-scope="scope">
          <p v-if="scope.row.isGive === 1" class="have">是</p>
          <p v-else-if="scope.row.isGive === 0" class="nopay">否</p>
        </template>
      </el-table-column>
      <el-table-column label="是否过期">
        <template slot-scope="scope">
          <p v-if="scope.row.overTime === 1" class="have">是</p>
          <p v-else-if="scope.row.overTime === 0" class="nopay">否</p>
        </template>
      </el-table-column>
      <el-table-column label="是否已删除">
        <template slot-scope="scope">
          <p v-if="scope.row.isDel === 1" class="have">是</p>
          <p v-else-if="scope.row.isDel === 0" class="nopay">否</p>
        </template>
      </el-table-column>
      <el-table-column label="开始时间">
        <template slot-scope="scope">
          {{ scope.row.startTime }}
        </template>
      </el-table-column>
      <el-table-column label="结束时间">
        <template slot-scope="scope">
          {{ scope.row.endTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="240">
        <template slot-scope="scope">
          <!--<el-button size="mini" type="success" @click="edit(scope.row.id)">编辑</el-button>-->
          <!--<el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />
  </div>
</template>

<script>
import { selectCouponList } from '@/api/coupon'
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
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      search: '',
      dialogFormVisible: false,
      courseTypeOptions: [
        {
          id: 0,
          name: '录播回放课'
        },
        {
          id: 1,
          name: '直播课程'
        }
      ],
      course: {
        courseName: '',
        sign: '',
        introduce: '',
        address: '',
        courseUrl: '',
        status: '',
        teacher: '',
        courseTime: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      selectCouponList(this.listQuery).then(response => {
        console.log(response)
        if (response.success) {
          this.list = response.couponList
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
        // delTeacherCourse(pid).then(res => {
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
    // edit(pid) {
    //   console.log('编辑')
    //   console.log(pid)
    // },
    getValue(value) {
      this.$data.course.status = value
    },
    addCourse() {
      this.$data.dialogFormVisible = true
    },
    sureSubmit() {
      if (this.$data.course.courseName === '') {
        Message.error('请输入课程名称')
      } else if (this.$data.course.sign === '') {
        Message.error('请输入课程标签')
      } else if (this.$data.course.status === '') {
        Message.error('请输入课程类型')
      } else if (this.$data.course.introduce === '') {
        Message.error('请输入课程简介')
      } else if (this.$data.course.address === '') {
        Message.error('请输入课程地址')
      } else if (this.$data.course.courseUrl === '') {
        Message.error('请输入图片地址')
      } else if (this.$data.course.teacher === '') {
        Message.error('请输入讲师名称')
      } else {
        console.log('提交')
        console.log(this.$data.course)
        if (Number(this.$data.course.status === 0)) {
          // 录播
          if (this.$data.course.courseTime === '') {
            Message.error('请输入课程时长')
          } else {
            this.request(this.$data.course)
          }
        } else {
          // 直播
          if (this.$data.course.startTime === '') {
            Message.error('请输入开始时间')
          } else if (this.$data.course.endTime === '') {
            Message.error('请输入结束时间')
          } else {
            this.request(this.$data.course)
          }
        }
      }
    },
    request(data) {
    }
  }
}
</script>

<style>
  .have {
    color: green;
  }
  .nopay{
    color: red;
  }
</style>
