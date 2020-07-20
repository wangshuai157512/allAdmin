<template>
  <div>
    <el-form ref="form" label-width="80px" class="hc-form">
      <div style="display: flex">
        <el-form-item label="选择课程" class="form-item">
          <el-select v-model="courseId" placeholder="请选择" @change="changeCourse">
            <el-option
              v-for="(item,index) in courseList"
              :key="index"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择章节" class="form-item">
          <el-select v-model="chapterId" placeholder="请选择" @change="changeChapter">
            <el-option
              v-for="(item,index) in chapterList"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="childChapterList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="子节名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" :value="scope.row.name"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="视频地址">
        <template slot-scope="scope">
          <el-input v-model="scope.row.videoUrl" :value="scope.row.videoUrl"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="视频时间">
        <template slot-scope="scope">
          <el-input v-model="scope.row.time" :value="scope.row.time"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="权重">
        <template slot-scope="scope">
          <el-input v-model="scope.row.weight" :value="scope.row.weight"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="save(scope.row.id,scope.$index)">保存</el-button>
          <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
   import api from '../../api/itedu'
    export default {
      name: "getChapter",
      data () {
        return {
          courseId : null,
          courseList : [],
          chapterList : [],
          listLoading : false,
          chapterName : '',
          chapterId : null,
          childChapterList : []
        }
      },
      created () {
        this.getCourseList()
      },
      methods : {
        changeCourse (e) {
          this.listLoading = true
          this.getChapter(e)
        },
        getChapter (id) {
          api.getChapter({ course_id : id }).then(res => {
            this.listLoading = false
            if (res.code === 1) {
              this.chapterList = res.data
            }
          })
        },
        changeChapter (id) {
          this.getChildrenChapter(id)
        },
        getChildrenChapter (id) {
          api.getChildChapter({id}).then(res => {
            if (res.code === 1) {
              this.childChapterList = res.data
            }
          })
        },
        getCourseList () {
          let loading = this.$loading({ text : '加载中' })
          api.getCourse().then(res => {
            if (res.code === 1) {
              this.courseList = res.data
            }
            loading.close()
          })
        },
        save (id,index) {
          let { name , videoUrl , time ,weight } = this.childChapterList[index]
          let data = {
            id,
            name,
            videoUrl,
            time,
            weight
          }
          api.updateChildChapter(data).then(res => {
            if (res.code === 1) {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.getChapter(this.courseId)
              this.changeChapter(this.chapterId)
            }else {
              this.$message.error('修改失败')
            }
          })
        },
        del (id) {
          this.$confirm('确认要删除该章节？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            api.delChildChapter({ id }).then(res => {
              if (res.code === 1) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
                this.getChapter(this.courseId)
                this.changeChapter(this.chapterId)
              } else {
                this.$message.error('删除失败')
              }
            })
          })
            .catch({})
        },
        edit (id) {
          this.$router.push({
            path : '/itedu/editChapter',
            query : {
              id
            }
          })
        }
      }
    }
</script>

<style scoped>
  .hc-form {
    margin-top: 10px;
  }
</style>
