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
      </div>
      <div class="query-input__ query-item">
        <el-select v-model="channelId" placeholder="渠道">
          <el-option
            v-for="item in channelList"
            :key="item.id"
            :label="item.channel_name"
            :value="item.id">
          </el-option>
        </el-select>
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
      <el-table-column label="备注">
        <template slot-scope="scope">
          {{ scope.row.marks }}
        </template>
      </el-table-column>
      <el-table-column label="老师姓名">
        <template slot-scope="scope">
          {{ scope.row.teacherName }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="page" :limit.async="20" @pagination="fetchData" />
  </div>
</template>

<script>
  import request from '@/utils/request'
  import Pagination from '@/components/Pagination'
  import api from './config/api'
  export default {
    name : 'form_user',
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
        channelId : '',
        channelList : []
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
        request(`${api.getFormUserList}?channelId=${this.channelId}&page=${options.isExport?null:this.page}&startTime=${this.startTime}&endTime=${this.endTime}`)
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
        request(`${api.getChannel}`)
          .then(res => {
            if (res.code === 1) {
              this.channelList = [{ id : '',channel_name : '全部' },...res.data]
            } else {
              this.$message.error('渠道获取失败')
            }
          })
          .catch(err => {
            this.$message.error('渠道获取失败')
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
          const tHeader = ['姓名','手机号','备注','渠道','老师姓名','创建时间'];  //将对应的属性名转换成中文
          const filterVal = ['name','phone','marks','channel_name','teacherName','createTime'];    //table表格中对应的属性名
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

<style lang="scss">
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
  .query-item {
    margin-right: 20px;
  }
</style>
