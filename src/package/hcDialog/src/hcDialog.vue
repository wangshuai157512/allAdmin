<template>
    <div class="hc-diglog">
      <el-dialog :title="dialogOption.dialogTitle" :visible.sync="visible">
        <slot></slot>
        <div slot="footer" class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="handClick">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    export default {
      name: "hcDialog",
      props : {
        dialogOption : {
          type : Object,
          default : {
            showFooterBtn : true,
            dialogVisible : false,
            dialogTitle : 'dialog'
          }
        }
      },
      data () {
        return {
          visible : this.dialogOption.dialogVisible
        }
      },
      created () {

      },
      methods : {
        handClick () {
          this.$emit('handClick')
        }
      },
      watch : {
        dialogOption : {
          immediate: true,
          handler(data) {
            this.visible = data.dialogVisible
          }
        }
      }
    }
</script>

<style scoped>

</style>
