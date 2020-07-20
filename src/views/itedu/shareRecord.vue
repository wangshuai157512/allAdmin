<template>
  <div class="app-container">
    <!-- <div class="inputBox">
      <el-input v-model="search" class="input" placeholder="请输入微信昵称查询" />
    </div> -->
    <div class="app-container-top">
      <div class="block">
        <!-- <span class="demonstration">默认</span> -->
        <el-date-picker
          v-model="value1"
          type="date"
          placeholder="开始时间">
        </el-date-picker>
        <el-date-picker
          v-model="value2"
          type="date"
          placeholder="结束时间">
        </el-date-picker>
        <el-button size="small" type="primary" @click="getShare">查询</el-button>
      </div>
      <el-button class="export" @click="handleExport" type="primary">导出</el-button>
    </div>  
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
      <el-table-column label="微信昵称">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="手机">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="课程名称">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="章节名称">
        <template slot-scope="scope">
          {{ scope.row.chapterName }}
        </template>
      </el-table-column>
      <el-table-column label="分享时间">
        <template slot-scope="scope">
          {{ scope.row.create_time }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" prop="created_at" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="share(scope.row.id)">分享明细</el-button>
          <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" limit.sync="20" @pagination="fetchData" />
  </div>
</template>

<script>
  import { getExportShareList } from '@/api/user'
  import api from '../../api/itedu'
  import Pagination from '@/components/Pagination'

  export default {
    data() {
      return {
        list: [],
        total: 0,
        exportList:[],
        listLoading: true,
        listQuery: {
          page: 1,
          startTime: null,
          endTime: null
        },
        search: '',
        value1: '',
        value2: ''
        
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
      this.fetchData()
    },
    methods: {
      fetchData(fun = {}) {
        this.listLoading = true
        if(this.value1 && this.value2) {
        let [startTime,endTime] = this.getTime()
        this.listQuery.startTime = startTime
        this.listQuery.endTime = endTime
        }
        getExportShareList(this.listQuery).then(response => {
          if (response.code === 1) {
            if(fun.Isexport) {
             this.exportList =  response.data
             fun.callback()
            }else {
              this.list = response.data
              this.total = response.total
            }
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
          } else {
            this.listLoading = false
          }
        })
      },
      getShare() {
        this.fetchData()
      },
      // 导出
      handleExport() {
        this.downloadLoading = true;
        this.listQuery.page = null
        this.fetchData({Isexport:true,callback:this.exportBack}) 
      },
      exportBack() {
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../vendor/Export2Excel');    //引入文件
          const tHeader = ['微信昵称','手机','课程名称',"章节名称","分享时间"];  //将对应的属性名转换成中文
          const filterVal = ['nickname','phone','title',"chapterName","create_time"];    //table表格中对应的属性名
          const list = this.exportList;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '分享记录excel');
          this.downloadLoading = false;
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      // 时间格式化
      getTime() {
        var d = new Date(this.value1);  
        var f = new Date(this.value2);
         var startTime=d.getFullYear() + '-' + ((d.getMonth() + 1)<10?'0'+(d.getMonth() + 1):"(d.getMonth() + 1)") + '-' + (d.getDate()<10?'0'+d.getDate():d.getDate()) + ' ' + '00' + ':' + "00" + ':' + "00";
        var endTime=f.getFullYear() + '-' + ((f.getMonth() + 1)<10?'0'+(f.getMonth() + 1):"(f.getMonth() + 1)") + '-' + (f.getDate()<10?'0'+f.getDate():f.getDate()) + ' ' + "23" + ':' + "59" + ':' + "59";
        var time=[startTime,endTime]
        return time
      },
    }
  }
</script>

<style lang="scss" scoped>
  .line{
    text-align: center;
  }
  .img_head {
    width: 50px;
    height: 50px;
  }
  .block {
    margin-bottom: 20px;
  }
  .export {
    width: 70px;
    height: 39px;
    text-align: center;
  }
  .app-container-top {
    display: flex;
    justify-content: space-between
  }
</style>
