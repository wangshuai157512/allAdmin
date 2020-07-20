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
    import api from '../../api/itedu'
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
          api.getIsShowContent({name : 'itedu'})
            .then(res => {
              if (res.code === 1) {
                this.isShowType = res.data
              } else {
                this.$message.error('获取失败')
              }
            })
        },
        setIsShowContent () {
          api.setIsShowContent({
            name : 'itedu',
            type : this.isShowType
          })
            .then(res => {
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
