<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="分类名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.catname" :value="scope.row.catname"></el-input>
          <!--{{ scope.row.catname }}-->
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="save(scope.row.catid,scope.$index)">保存</el-button>
          <el-button size="mini" type="danger" @click="del(scope.row.catid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
    import api from '@/api/itedu'
    export default {
      name: "category",
      data () {
        return {
          list : [],
          listLoading: true,
          search : ''
        }
      },
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
      mounted () {
        this.getCategory()
      },
      methods : {
        getCategory () {
          api.getCategory()
            .then(res => {
              if (res.code === 1) {
                this.list = res.data
              }
              setTimeout(() => {
                this.listLoading = false
              }, 1.5 * 1000)
            })
        },
        save (id,index) {
          let { catname } = this.list[index]
          if (!catname) {
            this.$message.error('请输入完整内容')
          }
          api.updateCategory({ name : catname , id }).then(res => {
            if (res.code === 1) {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.getCategory()
            } else {
              this.$message.error('修改失败')
            }
          })
        },
        del (id) {
          console.log(id)
          this.$confirm('确认要删除该课程？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            api.delCategory({catid : id})
              .then(res => {
                if (res.code === 1) {
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  })
                  this.getCategory()
                } else {
                  this.$message({
                    showClose: true,
                    message: '删除失败',
                    type: 'error'
                  });
                }
              })
          })

        }
      }
    }
</script>

<style scoped>

</style>
