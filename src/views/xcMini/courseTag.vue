<template>
  <div class="class-slogan-content">
    <div class="slogan-content">
      <div class="tag-item" v-for="item in tagList" :key="item.id">
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
    name: "courseTag",
    data () {
      return {
        tagList : [],
        inputVisible : false,
        inputValue : ''
      }
    },
    created () {
      this.getCourseTagList()
    },
    methods : {
      getCourseTagList () {
        const loading = this.$loading()
        request(api.getCourseTagList,'get').then(res => {
          if (res.code === 1) {
            this.tagList = res.data
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

        this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const loading = this.$loading()
            request({
              url : api.delCourseTag,
              method: 'post',
              data : { id }
            }).then(res => {
              if (res.code === 1) {

                this.$message.success('删除成功')

                setTimeout(() => {

                  _this.getCourseTagList()
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
            url : api.addCourseTag,
            method : 'post',
            data : {
              name : inputValue
            }
          }).then(res => {
            if (res.code === 1) {
              setTimeout(() => {
                _this.getCourseTagList()
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
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
    margin-top: 15px;
  }
</style>
