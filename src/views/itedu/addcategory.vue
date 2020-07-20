<template>
  <div class="app-container">
    <el-form ref="form" :model="form">
      <el-form-item label="分类名称">
        <el-input v-model="form.name" style="width: 300px"/>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="add">添加</el-button>
  </div>
</template>

<script>
    import itdeu from '../../api/itedu'
    export default {
      name: "addcategory",
      data () {
        return {
          form: {
            name: ''
          },
        }
      },
      methods : {
        add () {
          itdeu.addCategory(this.form)
            .then(res => {
              if (res.code === 1) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                });
                this.form.name = ''
              }else {
                this.$message.error('添加失败');
              }
            })
        }
      }
    }
</script>

<style scoped>

</style>
