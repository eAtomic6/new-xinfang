<!-- 线下获客列表 -->
<template>
  <div>
      <query-com 
      :allCompanyData="allCompanyData"
      @getTableData="getTableData"
      :channelData="channelData"
      @outExcel="outExcel"
      :messageData="messageData"
      ></query-com>
      <table-com
      @sizeChange="sizeChange"
      @currentChange="currentChange"
      :showTableData="showTableData"
      :tableData="tableData"
      :tableTotals="tableTotals"
      :paginationObj="paginationObj"
      :loading="loading"
      ></table-com>
  </div>
</template>

<script>
import queryCom from './queryCom.vue'
import tableCom from './tableCom.vue'
import {showTableData,channelData} from './onLineTableData.js'
export default {
  data () {
    return {
      messageData:{},
      allCompanyData:[],
      channelData:channelData,
      paginationObj:{pageSize:10,pageNum:1},
      showTableData:showTableData,
      tableData:[],
      tableTotals:0,
      loading:false
    };
  },
components:{queryCom,tableCom},
created(){
  this.$axios.get("/api/jjw/customer/online/can").then(res => {
    res = res.data
    if(res.status === 200){
      this.messageData={
        isShow:false,
        value:"可搜索意向项目、客户电话"
      }
    }
  }).catch(err => {
        if(err.response.status === 403){
        this.$router.push({name: "403errorPage"})
        return
        }
      })
},
  methods: {
    getTableData(data,int){
       // debugger
       this.loading = true
      if(int == 1 || int == 2){
        this.paginationObj = {
          pageSize:10,
          pageNum:1
        }
      }
      this.keywordObj=data
      let param = {}
      param = Object.assign(param,data,this.paginationObj)
      this.$axios.get("/api/jjw/customer/online",{params:param}).then(res => {
        res = res.data
        if(res.status === 200){
          this.tableData = res.data.list
          this.tableTotals = res.data.total
          this.loading = false
        }else{
          this.alertMessage("warning",res.message,2000)
          this.loading = false
          return
        }
      })
      console.log(data);
    },
    // 每页展示数据条数发生改变时
    sizeChange(val){
      this.paginationObj.pageSize = val
      this.getTableData(this.keywordObj)
    },
    // 页码发生改变时
    currentChange(val){
      this.paginationObj.pageNum = val
      this.getTableData(this.keywordObj)
    },
    outExcel(data){
      this.$axios.get("/api/jjw/customer/online/excel/can").then(res => {
        res = res.data
        if(res.status === 200){
          let token = ""
          token = localStorage.getItem("token")
          document.cookie="xf-token="+token+""
          window.location.href=`/api/jjw/customer/online/excel?keyword=${data.keyword}&companyIds=${data.companyIds}&type=${data.type}&startAt=${data.startAt}&endAt=${data.endAt}&dur=${data.dur}`
        }
      }).catch(err => {
        if(err.response.status === 403){
          this.alertMessage("warning", "无操作权限")
          return
        }
      })
    }
  }
}

</script>
<style lang='scss' scoped>
</style>