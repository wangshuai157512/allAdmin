<template>
  <div class="app-container">
    <div class="header-wrap">
      <div class="time-content">
        <div class="start-time">
          <el-date-picker
            v-model="start_time"
            type="date"
            placeholder="选择开始日期">
          </el-date-picker>
        </div>
        <div class="end-time">
          <el-date-picker
            v-model="end_time"
            type="date"
            placeholder="选择结束日期">
          </el-date-picker>
        </div>
        <div class="channel-category">
          <el-select v-model="channelVal" placeholder="请选择">
            <el-option
              v-for="item in channelList"
              :key="item.id"
              :label="item.channel_name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <el-button type="primary"  class="query-btn" @click="getUser" >查询</el-button>
      <el-button type="primary"  class="export-btn" @click="exportData" >导出</el-button>
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
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="手机">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="渠道">
        <template slot-scope="scope">
          {{ scope.row.channel_name }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.create_time }}
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          {{ scope.row.marks }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="page" limit.sync="20" @pagination="fetchData" />
  </div>
</template>

<script>
  import request from '@/utils/request'
  import Pagination from '@/components/Pagination'
  import api from './config/api'
  export default {
    data() {
      return {
        list: [],
        exportList : [],
        total: 0,
        listLoading: false,
        page : 1,
        search: '',
        start_time : '',
        end_time : '',
        startTime : null,
        endTime : null,
        channelVal : '',
        channelList : [
          {
            channel_name : '全部',
            id : ''
          }
        ]
      }
    },
    components: { Pagination },
    created() {
      this.fetchData()
      this.getChannelList()
    },
    methods: {
      fetchData(options = {}) {
        this.listLoading = true
        request(`${api.getFormUserList}?page=${options.isExport?null:this.page}&startTime=${this.startTime}&endTime=${this.endTime}&channel=${this.channelVal}`)
          .then(res => {
            if (res.code === 1) {
              if (!options.isExport) {
                this.list = res.data
                this.total = res.total
              } else {
                this.exportList = res.data
                options.callback()
              }
            } else {
              this.$message.error('获取失败')
            }
            this.listLoading = false
          })
      },
      getChannelList () {
        request(api.getChannel,'get').then(res => {

          this.listLoading = false

          if (res.code === 1) {
            this.channelList = this.channelList.concat(res.data)
          } else {
            this.$message.error('获取失败')
          }

        })
      },
      del (id) {
        this.$confirm('确认要删除该用户？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request({
            url : api.delUser,
            method : 'post',
            data : { id }
          }).then(res => {
            if (res.code === 1) {
              this.fetchData()
            }
          })
        }).catch(() => {
        })
      },
      getUser () {
        this.startTime = this.start_time ? this.dateTime(this.start_time) : null
        this.endTime = this.end_time ? this.dateTime(this.end_time) : null
        this.fetchData()
      },
      exportData () {
        this.fetchData({isExport:true,callback : this.exportCallback})
      },
      exportCallback () {
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../vendor/Export2Excel');    //引入文件
          const tHeader = ['姓名','手机号','备注','渠道'];  //将对应的属性名转换成中文
          const filterVal = ['name','phone','marks','channel_name'];    //table表格中对应的属性名
          const list = this.exportList;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '表单用户');
          this.downloadLoading = false;
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      dateTime (time) {
        let date = new Date(time)
        let year = date.getFullYear()
        let month = date.getMonth()+1
        month = month < 10 ? ('0' + month) : month
        let day = date.getDate();
        day = day < 10 ? ('0' + day) : day
        let hours = date.getHours()
        hours = hours < 10? ('0' + hours) : hours
        let minute = date.getMinutes()
        minute = minute < 10? ('0' + minute) : minute
        let seconds = date.getSeconds()
        seconds = seconds < 10? ('0' + seconds) : seconds
        return `${year}-${month}-${day}`
      }
    }
  }
</script>

<style lang="scss" scoped>
  .channel-category {
    margin-right: 20px;
  }
  .line{
    text-align: center;
  }
  .img_head {
    width: 50px;
    height: 50px;
  }
  .header-wrap {
    margin-bottom: 20px;
  }
  .time-content {
    display: flex;
  }
  .time-content .start-time,.end-time {
    margin-right: 20px;
  }
  .header-wrap {
    display: flex;
  }
</style>
