<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list.filter(data => !search || data.user.includes(search))"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="课程名称">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Banner图">
        <template slot-scope="scope">
          <img :src="imgUrl(scope.row.imgUrl)" class="img_head" alt="">
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editBanner(scope.row.id,scope)">编辑</el-button>
          <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
          <el-button size="mini" type="success" @click="isShow(scope.row.id,show[0].type)" v-if="scope.row.type === 0">{{show[0].name}}</el-button>
          <el-button size="mini" type="info" @click="isShow(scope.row.id,show[1].type)" v-else>{{show[1].name}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { getItUserList } from '@/api/user'
  import api from '../../api/itedu'
  import config from '../../config/index'
  import Pagination from '@/components/Pagination'

  export default {
    data() {
      return {
        baseUrl : config.imgUrl,
        list: [],
        show: [{type:1,name:"显示"},{type:0,name:"隐藏"}],
        listLoading: true,
        search: ''
      }
    },
    components: { Pagination },
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
    created() {
      this.getBanner ()
    },
    methods: {
      getBanner() {
        this.listLoading = true
        api.getBanner().then(response => {
          if (response.code === 1) {
            this.list = response.data
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
          } else {
            this.listLoading = false
          }
        })
      },
      imgUrl (url) {
          return this.baseUrl + url
      },
      del(pid) {
        this.$confirm('确认要删除该用户？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.delBanner({id : pid})
            .then(res => {
              if (res.code === 1) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
                this.getBanner()
              }
            })
        }).catch(() => {
        })
      },
      isShow(id,type) {
        let data = {id,type}
        api.bannerShowOrhide(data).then((res)=> {
          if(res.code === 1) {
            this.getBanner ()
          }
        }).catch(()=> {})
      },
      look(pid) {
        this.$router.push({
          path: '/detail',
          query: {
            id: pid
          }
        })
      },
      editBanner(pid) {
        this.$router.push({
          path: '/itedu/bannerAdd',
          query: {
            id: pid
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .line{
    text-align: center;
  }
  .img_head {
    width: 100%;
    height: 100%;
  }
</style>
