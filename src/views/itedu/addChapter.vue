<template>
    <div style="padding: 20px;">
      <div class="form-item" style="margin-bottom: 20px">
        <span>选择课程</span>
        <el-select v-model="courseId" placeholder="请选择" @change="changeCourse">
          <el-option
            v-for="(item,index) in courseList"
            :key="index"
            :label="item.title"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="add__input" v-for="(item,index) in addList" :key="index">
        <div class="form-item">
          <span>章节名称</span>
          <div class="__input">
            <el-input v-model="item.name" :disabled="item.disabled"></el-input>
          </div>
        </div>
        <div class="form-item weight">
          <span>权重</span>
          <div>
            <el-input v-model="item.weight" ></el-input>
          </div>
        </div>
        <el-button type="primary" class="add-btn" @click="add(index)" :disabled="item.disabled">添加</el-button>
      </div>
      <!--<el-form ref="form" label-width="80px" class="hc-form">-->
        <!--<el-form-item>-->
          <!--<el-form-item label="章节名称" class="form-item chapter-name">-->
            <!--<el-input v-model="chapterName"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="权重" class="form-item chapter-name">-->
            <!--<el-input v-model="weight"></el-input>-->
          <!--</el-form-item>-->
        <!--</el-form-item>-->
      <!--</el-form>-->

    </div>
</template>

<script>
    import api from '../../api/itedu'
    export default {
      name: "addChapter",
      data () {
        return {
          courseId : null,
          courseList : [],
          chapterName : '',
          weight : 0,
          addList : [
            {
              name : '',
              weight : 0,
              disabled : false
            }
          ]
        }
      },
      created () {
        this.getCourseList()
      },
      methods : {
        changeCourse () {
          this.addList = [{
            name : '',
            weight : 0,
            disabled : false
          }]
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
        add (index) {
          let { name , weight } = this.addList[index]
          if (!this.courseId || !name) {
            this.$message.error('请输入完整内容');
            return
          }
          let loading = this.$loading({ text : '加载中' })
          let data = {
            course_id : this.courseId,
            name : name,
            weight : weight
          }
          api.addChapter(data).then(res => {
            loading.close()
            if (res.code === 1) {
              this.$message({
                message: '添加成功',
                type: 'success'
              });
              this.chapterName = ''
              this.$set(this.addList[index],'disabled',true)
              this.addList.push({
                name : '',
                weight : 0,
                disabled : false
              })
            }else {
              this.$message.error('添加失败');
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
  .chapter-name{
    width: 500px;
  }
  .form-item {
    display: flex;
    align-items: center;
  }
  .form-item span{
    font-size: 14px;
    color: #606266;
    margin-right: 10px;
  }
  .form-item .__input{
    width: 300px;
  }
  .add-btn {
    margin-left: 10px;
  }
  .add__input {
    display: flex;
    margin-top: 10px;
  }
  .weight {
    margin-left: 20px;
  }
</style>
