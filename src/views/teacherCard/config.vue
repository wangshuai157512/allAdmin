<template>
    <div class="config-box">
      <div class="isShowContentSwitch">
        <span>审核模式</span>
        <el-switch
          v-model="isShowType"
          active-color="#13ce66"
          :active-value="1"
          :inactive-value="0"
          @change="setIsShowContent"
        >
        </el-switch>
      </div>
    </div>
</template>

<script>
  import request from '@/utils/request'
  import config from '@/utils/config'
    export default {
      name: "config",
      data () {
        return {
          isShowType : ''
        }
      },
      created () {
        this.getIsShowContent()
      },
      methods : {
        getIsShowContent () {
          const requestUrl = config.BaseUrl + '/api/it_admin/getIsShowContent'
          request({
            url : requestUrl,
            method : 'post',
            data : {
              name : 'teacher'
            }
          }).then(res => {
              if (res.code === 1) {
                this.isShowType = res.data
              } else {
                this.$message.error('获取失败')
              }
            })
        },
        setIsShowContent () {
          const requestUrl = config.BaseUrl + '/api/it_admin/setIsShowContent'
          request({
            url : requestUrl,
            method : 'post',
            data : {
              name : 'teacher',
              type : this.isShowType
            }
          }).then(res => {
              if (res.code === 1) {
                this.$message.success(res.msg)
              } else {
                this.$message.error(res.msg)
              }
            })
        }
      }
    }
</script>

<style scoped>
  .config-box {
    box-sizing: border-box;
    padding: 20px;
  }
</style>
