<template>
  <div class="app-container">
    <div class="inputBox">
      <el-input v-model="search" class="input" placeholder="请输入课程名称查询" />
      <el-button type="primary" @click="addCourseType">新增</el-button>
      <el-button v-if="isShowDel === false" type="warning" @click="isShowDel = true">关联</el-button>
      <el-button v-else-if="isShowDel === true" type="warning" @click="isShowDel = false">取消</el-button>
    </div>
    <el-dialog :visible.sync="dialogFormVisible" title="关联课程">
      <el-form ref="dataForm" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="课程标签" prop="title">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select" @change="getValue">
            <el-option v-for="item in courseOptions" :key="item.id" :label="item.sign" :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="sure">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialog" :title="typeDialogTitle">
      <el-form ref="dataForm" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="包类型" prop="title">
          <el-input v-model="course.courseType" />
        </el-form-item>
        <el-form-item label="包名称" prop="title">
          <el-input v-model="course.title" />
        </el-form-item>
        <el-form-item label="包简介" prop="title">
          <el-input v-model="course.introduce" />
        </el-form-item>
        <el-form-item label="包原价" prop="title">
          <el-input v-model="course.oldPrice" />
        </el-form-item>
        <el-form-item label="缩略图" prop="title">
          <el-input v-model="course.imgUrl" />
        </el-form-item>
        <el-form-item label="banner图" prop="title">
          <el-input v-model="course.bannerUrl" />
        </el-form-item>
        <el-form-item label="图片状态" prop="title">
          <el-input v-model="course.imgState" type="number" />
        </el-form-item>
        <p style="color:red;">*注意：（0-对应coupon-price-bgc1.png；1-对应coupon-price-bgc2.png，前端定义）</p>
        <el-form-item label="是否开启" prop="title">
          <el-select v-model="course.isEnable" class="filter-item" placeholder="Please select" @change="getEnable">
            <el-option v-for="item in enableOption" :key="item.id" :label="item.isEnable" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="包含课程" prop="title">
          <el-select v-model="course.courseList" :disabled="typeDialogTitle === '编辑'" class="filter-item" placeholder="Please select" @change="getChildren">
            <el-option v-for="item in courseOptions" :key="item.id" :label="item.sign" :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" @click="sureAdd">确定</el-button>
      </div>
    </el-dialog>
    <el-table
      v-loading="listLoading"
      :data="list.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="课程包名称">
        <template slot-scope="scope">
          {{ scope.row.courseType }}
        </template>
      </el-table-column>
      <el-table-column label="是否启用">
        <template slot-scope="scope">
          <p v-if="scope.row.isEnable === 0">未启用</p>
          <p v-else-if="scope.row.isEnable === 1">已启用</p>
        </template>
      </el-table-column>
      <el-table-column label="课程包原价">
        <template slot-scope="scope">
          {{ scope.row.oldPrice }}
        </template>
      </el-table-column>
      <el-table-column label="课程包简介">
        <template slot-scope="scope">
          {{ scope.row.introduce }}
        </template>
      </el-table-column>
      <el-table-column label="课程包标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="缩略图">
        <template slot-scope="scope">
          <img :src="scope.row.imgUrl" class="img_url" alt="">
        </template>
      </el-table-column>
      <el-table-column label="包含课程标签">
        <template slot-scope="scope">
          <p v-for="(item, index) in scope.row.courseNameList" :key="index">{{ item.courseSign }}<i v-if="isShowDel" class="el-icon-remove" @click="deleteCourse(item.courseId, scope.row.id)" /></p>
          <i class="el-icon-circle-plus" @click="addCourse(scope.row.id)" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="240">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isEnable === 0" size="mini" type="success" @click="enable(scope.row.id)">启用</el-button>
          <el-button v-else-if="scope.row.isEnable === 1" size="mini" type="danger" @click="stop(scope.row.id)">停用</el-button>
          <el-button size="mini" type="primary" @click="editRow(scope.row.id)">编辑</el-button>
          <!--<el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />
  </div>
</template>

<script>
import { getCouponList, enableCoupon, outCourse, getCoupon, relaseCourse, addCourseList, getbar, editCourseList } from '@/api/course'
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
      isShowDel: false,
      dialogFormVisible: false,
      courseOptions: [],
      temp: {
        status: ''
      },
      courseTypeId: null,
      dialog: false,
      course: {
        courseType: '',
        title: '',
        introduce: '',
        oldPrice: '',
        imgUrl: '',
        bannerUrl: '',
        imgState: '',
        isEnable: '',
        courseList: ''
      },
      enableOption: [
        {
          id: 0,
          isEnable: '不开启'
        },
        {
          id: 1,
          isEnable: '开启'
        }
      ],
      typeDialogTitle: '新增'
    }
  },
  created() {
    this.fetchData()
    this.fetchCourse()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getCouponList(this.listQuery).then(response => {
        if (response.success) {
          this.list = response.coursePackList
          this.total = response.total
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        } else {
          this.listLoading = false
        }
      })
    },
    fetchCourse() {
      this.listLoading = true
      getCoupon(this.listQuery).then(response => {
        if (response.success) {
          this.courseOptions = response.courseList
          this.total = response.total
          // this.$data.temp.status = response.courseList[0].sign
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
    edit(pid) {
      this.$router.push({
        path: '/vocational/courseAdd',
        query: {
          id: pid
        }
      })
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
    deleteCourse(courseId, id) {
      this.$confirm('确认要移除该课程？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          courseId: courseId,
          courseTypeId: id
        }
        outCourse(data).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '移除成功!'
            })
            this.$data.isShowDel = false
            this.fetchData()
          } else {
            Message.error(res.err)
          }
        })
      }).catch(() => {
      })
    },
    addCourse(courseTypeId) {
      this.$data.courseTypeId = courseTypeId
      this.$data.dialogFormVisible = true
    },
    sure() {
      if (this.$data.temp.status === '') {
        Message.error('未选择任何课程')
      } else {
        const data = {
          courseId: this.$data.temp.status,
          courseTypeId: this.$data.courseTypeId
        }
        relaseCourse(data).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '添加课程成功!'
            })
            this.$data.dialogFormVisible = false
            this.fetchData()
          } else {
            Message.error(res.err)
          }
        })
      }
    },
    sureAdd() {
      const { courseType, title, introduce, oldPrice, imgUrl, bannerUrl, imgState, isEnable, courseList } = this.$data.course
      if (courseType === '') {
        Message.error('包类型未填写')
      } else if (title === '') {
        Message.error('包名称未填写')
      } else if (introduce === '') {
        Message.error('包介绍未填写')
      } else if (oldPrice === '') {
        Message.error('包价格未填写')
      } else if (imgUrl === '') {
        Message.error('缩略图地址未填写')
      } else if (bannerUrl === '') {
        Message.error('banner图地址未填写')
      } else if (imgState === '') {
        Message.error('图片状态未填写')
      } else if (isEnable === '') {
        Message.error('请选择是否开启课程包')
      } else if (courseList === '') {
        Message.error('请选择一门包含的课程')
      } else {
        const data = {
          courseType: courseType,
          title: title,
          introduce: introduce,
          oldPrice: oldPrice,
          imgUrl: imgUrl,
          bannerUrl: bannerUrl,
          imgState: imgState,
          isEnable: isEnable,
          courseList: courseList
        }
        this.$data.typeDialogTitle === `新增` ? this.requestAdd(data) : this.requestEdit(data)
      }
    },
    requestAdd(data) {
      addCourseList(data).then(response => {
        if (response.success) {
          if (response.success) {
            this.$message({
              type: 'success',
              message: '新增课程包成功!'
            })
            this.$data.dialog = false
            this.fetchData()
            this.resetData()
          } else {
            Message.error('新增失败')
          }
        } else {
          this.listLoading = false
        }
      })
    },
    requestEdit(data) {
      Object.assign(data, { id: this.$data.course.id })
      editCourseList(data).then(res => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '编辑成功!'
          })
          this.$data.dialog = false
          this.fetchData()
          this.resetData()
        }
      })
    },
    resetData() {
      let { courseType, title, introduce, oldPrice, imgUrl, bannerUrl, imgState, isEnable, courseList } = this.$data.course
      courseType = ''
      title = ''
      introduce = ''
      oldPrice = ''
      imgUrl = ''
      bannerUrl = ''
      imgState = ''
      isEnable = ''
      courseList = ''
    },
    getValue(value) {
      this.$data.temp.status = value
    },
    getEnable(value) {
      this.$data.course.isEnable = value
    },
    getChildren(value) {
      this.$data.course.courseList = value
    },
    addCourseType() {
      this.$data.typeDialogTitle === `新增`
      this.$data.dialog = true
    },
    editRow(id) {
      const bar = {
        id: id
      }
      getbar(bar).then(response => {
        this.$data.course = response.res
        this.$data.dialog = true
        this.$data.typeDialogTitle = '编辑'
      })
    }
  }
}
</script>

<style>
  .el-icon-remove {
    margin-left: 10px;
  }
  .img_url {
    width: 110px;
    height: 110px;
  }
</style>
