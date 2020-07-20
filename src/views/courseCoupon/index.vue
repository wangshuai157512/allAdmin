<template>
  <div class="app-container">
    <div class="inputBox">
      <el-input v-model="search" class="input" placeholder="请输入课程名称查询" />
      <el-button type="primary" @click="addCourse">新增</el-button>
    </div>
    <el-dialog :visible.sync="dialogFormVisible" :title="courseTitle">
      <el-form ref="dataForm" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="课程名称" prop="title">
          <el-input v-model="course.courseName" />
        </el-form-item>
        <el-form-item label="课程标签" prop="title">
          <el-input v-model="course.sign" />
        </el-form-item>
        <el-form-item label="课程类型" prop="title">
          <el-select v-model="course.courseType" class="filter-item" placeholder="Please select" @change="getValue">
            <el-option v-for="item in courseTypeOptions" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="课程简介" prop="title">
          <el-input v-model="course.introduce" />
        </el-form-item>
        <el-form-item label="课程地址" prop="title">
          <el-input v-model="course.address" />
        </el-form-item>
        <el-form-item label="图片地址" prop="title">
          <el-input v-model="course.imgUrl" />
        </el-form-item>
        <el-form-item label="讲师" prop="title">
          <el-input v-model="course.teacher" />
        </el-form-item>
        <el-form-item v-if="course.courseType === 0" label="课时" prop="title">
          <el-input v-model="course.courseTime" />
        </el-form-item>
        <el-form-item v-if="course.courseType === 1" label="开始时间" prop="title">
          <el-input v-model="course.startTime" />
        </el-form-item>
        <el-form-item v-if="course.courseType === 1" label="结束时间" prop="title">
          <el-input v-model="course.endTime" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="sureSubmit">确定</el-button>
      </div>
    </el-dialog>
    <el-table
      v-loading="listLoading"
      :data="list.filter(data => !search || data.courseName.toLowerCase().includes(search.toLowerCase()))"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="课程名称">
        <template slot-scope="scope">
          {{ scope.row.courseName }}
        </template>
      </el-table-column>
      <el-table-column label="课程类型">
        <template slot-scope="scope">
          <p v-if="scope.row.courseType === 0">录播回放课</p>
          <p v-else-if="scope.row.courseType === 1">直播课</p>
        </template>
      </el-table-column>
      <el-table-column label="课程文件地址 / 直播页面地址">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="课程简介">
        <template slot-scope="scope">
          {{ scope.row.introduce }}
        </template>
      </el-table-column>
      <el-table-column label="课程讲师">
        <template slot-scope="scope">
          {{ scope.row.teacher }}
        </template>
      </el-table-column>
      <el-table-column label="课程标签">
        <template slot-scope="scope">
          {{ scope.row.sign }}
        </template>
      </el-table-column>
      <el-table-column label="课程时长">
        <template slot-scope="scope">
          {{ scope.row.courseTime }}
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
          <el-button size="mini" type="success" @click="edit(scope.row.id,scope.$index)">编辑</el-button>
          <!--<el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />
  </div>
</template>

<script>
import { getCoupon, enableCoupon, addApolloCourse, editCourseCoupon } from '@/api/course'
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
      courseTitle: '新增课程',
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
        imgUrl: '',
        courseType: '',
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
      getCoupon(this.listQuery).then(response => {
        if (response.success) {
          this.list = response.courseList
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
    edit(pid, index) {
      this.$data.dialogFormVisible = true
      this.$data.courseTitle = '编辑课程'
      this.$data.course = this.$data.list[index]
    },
    enable(pid) {
      const data = {
        pid: pid,
        isEnable: 1
      }
      enableCoupon(data).then(res => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '启用成功!'
          })
          this.fetchData()
        }
      })
    },
    stop(pid) {
      const data = {
        pid: pid,
        isEnable: 0
      }
      enableCoupon(data).then(res => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '停用成功!'
          })
          this.fetchData()
        }
      })
    },
    getValue(value) {
      this.$data.course.status = value
    },
    addCourse() {
      this.$data.dialogFormVisible = true
      this.$data.courseTitle = '新增课程'
    },
    sureSubmit() {
      if (this.$data.courseTitle === '编辑课程') {
        this.editCourse()
        return
      }
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
      addApolloCourse(data).then(response => {
        if (response.success) {
          Message.success('课程添加成功！')
          this.$data.dialogFormVisible = false
          this.fetchData()
        } else {
          Message.error('课程添加失败！')
        }
      })
    },
    editCourse() {
      const req = this.$data.course
      editCourseCoupon(req).then(res => {
        if (res.success) {
          Message.success('课程编辑成功！')
          this.$data.dialogFormVisible = false
          this.fetchData()
        }
      })
    }
  }
}
</script>
