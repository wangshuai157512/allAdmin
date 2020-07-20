<template>
  <div class="class-slogan-content">
    <div class="slogan-content">
      <div class="tag-item" v-for="item in typeList" :key="item.id">
        <el-tag
          closable
          @close="handleClose(item.id)"
        >{{item.name}}</el-tag>
      </div>
      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
    </div>
  </div>
</template>

<script>
  import api from './config/api'
  import request from '@/utils/request'
  import config from '../../config'
  export default {
    name: "courseSlogan",
    data () {
      return {
        typeList : [],
        inputVisible : false,
        inputValue : ''
      }
    },
    created () {
      this.getCourseSloganList()
    },
    methods : {
      getCourseSloganList () {
        const loading = this.$loading()
        request(api.getCourseSlogan,'get').then(res => {
          if (res.code === 1) {
            this.typeList = res.data
            setTimeout(() => {
              loading.close()
            },1000)
          } else {
            loading.close()
          }
        })
      },

      handleClose(id) {
        let _this = this

        this.$confirm('此操作将永久删除该类型, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const loading = this.$loading()
            request({
              url : api.delCourseSlogan,
              method: 'post',
              data : { id }
            }).then(res => {
              if (res.code === 1) {

                this.$message.success('删除成功')

                setTimeout(() => {

                  _this.getCourseSloganList()
                  loading.close()

                },1000)

              } else {
                this.$message.error('删除失败')
              }
            })
          })
          .catch(() => {})
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let _this = this
        let inputValue = this.inputValue;
        if (inputValue) {
          const loading = this.$loading()
          request({
            url : api.addCourseSlogan,
            method : 'post',
            data : {
              name : inputValue
            }
          }).then(res => {
            if (res.code === 1) {
              setTimeout(() => {
                _this.getCourseSloganList()
                loading.close()
              },1000)
            }else {
              loading.close()
            }
          })
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
    }
  }
</script>

<style scoped>
  .class-slogan-content {
    box-sizing: border-box;
    padding: 20px;
  }
  .tag-item {
    display: inline-flex;
    margin-right: 15px;
    margin-top: 15px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 15px;
  }
  .input-new-tag {
    width: 180px;
    margin-left: 10px;
    vertical-align: bottom;
    margin-top: 15px;
  }
</style>
