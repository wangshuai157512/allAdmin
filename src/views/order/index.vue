<template>
  <div class="app-container">
    <div class="app-container-top">
      <div class="block">
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
        <el-button size="small" type="primary" @click="getTimeUser">查询</el-button>
      </div>
      <el-button class="export" @click="handleExport" type="primary">导出</el-button>
    </div>  
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
      <el-table-column align="center" label="订单编号" width="95">
        <template slot-scope="scope">
          {{ scope.row.merchOrderId }}
        </template>
      </el-table-column>
      <el-table-column label="课程">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="课程价格">
        <template slot-scope="scope">
          {{ scope.row.price }}元
        </template>
      </el-table-column>
      <el-table-column label="微信昵称">
        <template slot-scope="scope">
          {{ scope.row.user }}
        </template>
      </el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatarUrl" class="img_head" alt="">
        </template>
      </el-table-column>
      <el-table-column label="手机">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="支付情况">
        <template slot-scope="scope">
          <p v-if="scope.row.isPay === 1" class="ispay">已支付</p>
          <p v-else-if="scope.row.isPay === 0" class="nopay">未支付</p>
          <p v-else-if="scope.row.isPay === 2" class="cancel">已取消</p>
          <p v-else-if="scope.row.isPay === 3" class="del">已删除</p>
        </template>
      </el-table-column>
      <el-table-column label="实付金额">
        <template slot-scope="scope">
          <p v-if="scope.row.actualPayMoney">{{ scope.row.actualPayMoney }}元</p>
        </template>
      </el-table-column>
      <el-table-column label="下单时间">
        <template slot-scope="scope">
          <p v-if="scope.row.date">{{ scope.row.date}}</p>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="parseInt(scope.row.state) === 0 && scope.row.isPay === 1" type="primary" size="mini" @click="sign(scope.row.id)">标记订单</el-button>
          <p v-else-if="parseInt(scope.row.state) === 1 && scope.row.isPay === 1" class="have">已领取</p>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" limit.sync="10" @pagination="fetchData" />
  </div>
</template>

<script>
import { getOrderList, signOrderState } from '@/api/order'
import Pagination from '@/components/Pagination'
import { Message } from 'element-ui'

export default {
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
  data() {
    return {
      list: [],
      userList:[],
      isPayObject:{isPay:'',nopay:'',cancel:'',del:''},
      total: 0,
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
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(fun={}) {
      this.listLoading = true
       if(this.value1 && this.value2) {
        let [startTime,endTime] = this.getTime()
        this.listQuery.startTime = startTime
        this.listQuery.endTime = endTime
        }
      getOrderList(this.listQuery).then(response => {
        if (response.success) {
            if(fun.Isexport) {
              response.course.forEach((item)=> {
                switch (item.isPay) {
                  case 0:
                    item.payState = '未支付'
                    break
                  case 1:
                    item.payState = '已支付'
                    break
                  case 2:
                    item.payState = '已取消'
                    break
                  case 3:
                    item.payState = '已删除'
                    break
                }
                
              })
             this.userList =  response.course
             console.log(this.userList)
             fun.callback()
            }else {
              this.list = response.course
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

    getTimeUser() {
      this.fetchData()
    },
    // 导出
    handleExport() {
      this.downloadLoading = true;
      this.listQuery.page = null;
      this.fetchData({Isexport:true,callback:this.exportBack}) 
    },
    exportBack() {
      require.ensure([], () => {
        const { export_json_to_excel } = require('../../vendor/Export2Excel');    //引入文件
        const tHeader = ['订单编号','课程','课程价格','微信昵称','手机','支付情况',"实付金额","下单时间"];  //将对应的属性名转换成中文
        const filterVal = ['merchOrderId','title','price','user','phone','payState',"actualPayMoney","date"];    //table表格中对应的属性名
        const list = this.userList;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '订单查询excel');
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
  .ispay {
    color:#409EFF;
  }
  .nopay {
    color:red;
  }
  .cancel {
    color: black;
  }
  .del {
    color: green;
  }
  .have {
    color: green;
  }
  .app-container-top {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
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
