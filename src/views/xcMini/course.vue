<template>
  <div class="channel-content">
    <div class="button-content">
      <div class="add-content">
        <el-button type="primary" @click="showModel(0)">添加班型</el-button>
      </div>
    </div>
    <el-table
      :data="courseList"
      v-loading="listLoading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="课时">
        <template slot-scope="scope">
          {{ scope.row.classHour }}
        </template>
      </el-table-column>
      <el-table-column label="价格">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="所属项目">
        <template slot-scope="scope">
          {{ scope.row.projectName }}
        </template>
      </el-table-column>
      <el-table-column label="所属分类">
        <template slot-scope="scope">
          {{ scope.row.className }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="editCourse(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="班型" :visible.sync="dialogFormVisible">
      <el-form :model="projectForm" :rules="rules" ref="projectForm">
        <el-form-item label="所属项目" label-width="120px" prop="classId">
          <el-cascader
            expand-trigger="hover"
            :options="projectList"
            value="[]"
            :props="{
              value : 'id',
              label : 'name',
              children : 'children'
            }"
            v-model="projectForm.classId"
            >
          </el-cascader>
        </el-form-item>
        <el-form-item label="班型名称" label-width="120px" prop="name">
          <el-input v-model="projectForm.name" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="价格" label-width="120px" prop="price">
          <el-input v-model.number="projectForm.price" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="学时" label-width="120px" prop="hour">
          <el-input v-model.number="projectForm.hour" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="课程类型" label-width="120px" prop="courseType">
          <el-select v-model="projectForm.courseType" placeholder="课程类型">
            <el-option
              v-for="item in courseType"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="课程标签" label-width="120px" prop="courseTag">
          <el-select v-model="projectForm.courseTag" multiple placeholder="课程标签">
            <el-option
              v-for="item in courseTag"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="课程亮点" label-width="120px" prop="courseSlogan">
          <div class="course-slogan">
            <el-select v-model="projectForm.courseSlogan" multiple placeholder="课程亮点">
              <el-option
                v-for="item in courseSlogan"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="分类权重" label-width="120px" prop="weight">
          <el-input v-model.number="projectForm.weight" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProject" v-if="diglogType === 0">添 加</el-button>
        <el-button type="primary" @click="edit()" v-else-if="diglogType === 1">保 存</el-button>
      </div>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="page" :limit="20" @pagination="getCourseList" />
  </div>
</template>

<script>
  import api from './config/api'
  import request from '@/utils/request'
  import upload from '@/utils/upload'
  import config from '../../config'
  import Pagination from '@/components/Pagination'
  export default {
    name: "course",
    data () {
      return {
        courseList : [],
        listLoading : false,
        dialogFormVisible : false,
        imgUrl : config.imgUrl,
        page : 1,
        total : 0,
        projectList : [],
        courseType : [],
        courseTag : [],
        courseSlogan : [],
        projectForm : {
          name : '',
          classId : [],
          courseType : '',
          courseTag : [],
          courseSlogan : [],
          hour : '',
          price : '',
          weight : 0
        },
        rules : {
          name : [
            {
              required: true, message: '请输入项目名称'
            }
          ],
          weight : [
            {
              required: true, message: '请输入权重',
            },
            {
              type : 'number',message : '请输入数字'
            }
          ],
          classId : [
            {
              required: true, message: '请选择项目',
            },
            {
              type : 'array',message : '请选择项目'
            }
          ],
          price : [
            {
              required: true, message: '请输入价格',
            },
            {
              type : 'number',message : '请输入数字'
            }
          ]
        },
        diglogType : 0,
        courseId : null,
        courseDetail : null
      }
    },
    components : {
      Pagination
    },
    created () {
      this.getCourseList()
      this.getProjectList()
      this.getCourseType()
      this.getCourseTag()
      this.getCourseSlogan()
    },
    methods : {

      showModel (type) {

        this.dialogFormVisible = true

        setTimeout(() => {
          this.$refs.projectForm.resetFields()
        })

        this.diglogType = type

      },

      getCourseList () {

        this.listLoading = true

        request(`${api.getCourseList}?page=${this.page}`,'get').then(res => {

          this.listLoading = false

          if (res.code === 1) {
            this.courseList = res.data
            this.total = res.total
          } else {
            this.$message.error('获取失败')
          }

        })
      },

      getProjectList () {
        request(`${api.getAllcategoryOrProject}`,'get').then(res => {

          if (res.code === 1) {
            this.projectList = res.data
          } else {
            this.$message.error('获取失败')
          }

        })
      },

      getCourseType () {
        request(api.getCourseType,'get').then(res => {
          if (res.code === 1) {
            let courseTypeDefault = [{id : 0, name : '无'},...res.data]
            this.courseType = courseTypeDefault
          }
        })
      },

      getCourseTag () {
        request(api.getCourseTagList,'get').then(res => {
          if (res.code === 1) {
            this.courseTag = res.data
          }
        })
      },

      getCourseSlogan () {
        request(api.getCourseSlogan,'get').then(res => {
          if (res.code === 1) {
            this.courseSlogan = res.data
          }
        })
      },

      editCourse (id) {
        this.showModel(1)
        this.courseId = id
        this.getCourseDetail()
      },

      getCourseDetail () {
        let courseId = this.courseId
        request(`${api.getCourseDetail}?id=${courseId}`,'get').then(res => {
          if (res.code === 1) {
            let data = res.data
            let courseTag = [],courseSlogan = [],classId = [data.parents.projectId,data.parents.classId]
            for (let i = 0; i < data.courseTag.length;i++) {
              courseTag.push(data.courseTag[i].id)
            }
            for (let i = 0; i < data.courseSlogan.length;i++) {
              courseSlogan.push(data.courseSlogan[i].id)
            }
            this.projectForm = Object.assign({},this.projectForm,{
              name : data.name,
              courseType : data.courseType ? data.courseType.id : 0,
              courseTag,
              courseSlogan,
              classId,
              hour : data.classHour,
              price : data.price,
              weight : data.weight
            })

          }
        })
      },

      edit () {
        let courseId = this.courseId

        let _this = this

        this.$refs.projectForm.validate((valid) => {
          if (valid) {
            if (_this.projectForm.classId.length > 1) {
              let classId = _this.projectForm.classId[1]
              let projectId = _this.projectForm.classId[0]
              const loading = this.$loading()
              let { name,courseType, courseTag,courseSlogan,price,hour,weight } = this.projectForm

              request({
                url : api.editCourse,
                method : 'post',
                data : {
                  name,
                  courseType,
                  courseTag,
                  courseSlogan,
                  price,
                  classId,
                  hour,
                  id : courseId,
                  projectId,
                  weight
                }
              }).then(res => {
                if (res.code === 1) {
                  setTimeout(() => {

                    _this.dialogFormVisible = false

                    loading.close()

                    this.$refs.projectForm.resetFields()

                    _this.getCourseList()

                  },1000)
                } else {
                  loading.close()
                  this.$message.error('修改失败')
                }
              })
                .catch(err => {
                  this.$message.error('修改失败')
                })

            } else {
              this.$message.error('请选择项目')
            }

          }
        })
      },

      del (id) {
        let _this = this
        this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          const loading = this.$loading()

          request({
            url : api.delCourse,
            method : 'post',
            data : {
              id
            }
          }).then(res => {
            if (res.code === 1) {

              setTimeout(() => {

                this.$message.success('删除成功')

                loading.close()

                _this.getCourseList()
              },1000)


            } else {
              this.$message.error('删除失败')
            }
          })

        }).catch(() => {

        });

      },

      addProject () {
        let _this = this

        this.$refs.projectForm.validate((valid) => {
          console.log(_this.projectForm)
          if (valid) {
            if (_this.projectForm.classId.length > 1) {
              let classId = _this.projectForm.classId[1]
              const loading = this.$loading()
              let { name,courseType, courseTag,courseSlogan,price,hour,weight } = this.projectForm

              request({
                url : api.addCourse,
                method : 'post',
                data : {
                  name,
                  courseType,
                  courseTag,
                  courseSlogan,
                  price,
                  classId,
                  hour,
                  weight
                }
              }).then(res => {
                if (res.code === 1) {
                  setTimeout(() => {

                    _this.dialogFormVisible = false

                    loading.close()

                    this.$refs.projectForm.resetFields()

                    _this.getCourseList()

                  },1000)
                } else {
                  loading.close()
                  this.$message.error('添加失败')
                }
              })
                .catch(err => {
                  this.$message.error('添加失败')
                })

            } else {
              this.$message.error('请选择项目')
            }

          }
        })

      }

    }
  }
</script>

<style>
  .button-content {
    padding: 24px;
    box-sizing: border-box;
  }
  .course-slogan .el-select {
    width: 300px;
  }

</style>
