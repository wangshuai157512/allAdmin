<template>
    <div class="channel-content">
      <div class="button-content">
        <div class="add-content">
          <el-button type="primary" @click="dialogFormVisible = true">添加渠道</el-button>
        </div>
      </div>
      <el-table
        :data="channelList"
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
        <el-table-column label="渠道">
          <template slot-scope="scope">
            {{ scope.row.channel_name }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="操作" width="240">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="渠道" :visible.sync="dialogFormVisible">
        <el-form :model="channelForm">
          <el-form-item label="渠道名称" label-width="120px">
            <el-input v-model="channelForm.name" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addChannel">确 定</el-button>
        </div>
      </el-dialog>

    </div>
</template>

<script>
    import api from './config/api'
    import request from '@/utils/request'
    export default {
      name: "channel",
      data () {
        return {
          channelList : [],
          listLoading : false,
          dialogFormVisible : false,
          channelForm : {
            name : ''
          }
        }
      },
      created () {
        this.getChannelList()
      },
      methods : {
        getChannelList () {

          this.listLoading = true

          request(api.getChannel,'get').then(res => {

            this.listLoading = false

            if (res.code === 1) {
              this.channelList = res.data
            } else {
              this.$message.error('获取失败')
            }

          })
        },

        del (id) {
          let _this = this
          this.$confirm('此操作将永久删除该渠道, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

            const loading = this.$loading()

            request({
              url : api.delChannel,
              method : 'post',
              data : {
                id
              }
            }).then(res => {
              if (res.code === 1) {

                setTimeout(() => {

                  this.$message.success('删除成功')

                  loading.close()

                  _this.getChannelList()
                },1000)


              } else {
                this.$message.error('删除失败')
              }
            })

          }).catch(() => {

          });

        },

        addChannel () {
          let _this = this

          let name = this.channelForm.name.replace(/^\s+|\s+$/g,"")

          if (name) {

            const loading = this.$loading()

            let params = { name }

            request({
              url : api.addChannel,
              method : 'post',
              data : params
            }).then(res => {
              if (res.code === 1) {

                setTimeout(() => {

                  this.$message.success('添加成功')

                  this.dialogFormVisible = false

                  loading.close()

                  _this.getChannelList()

                }, 1000);

              } else {

                loading.close()

                this.$message.error('添加失败')

              }
            })
          } else {
            this.$message.error('请输入渠道名称')
          }
        }

      }
    }
</script>

<style scoped>
  .button-content {
    padding: 24px;
    box-sizing: border-box;
  }
</style>
