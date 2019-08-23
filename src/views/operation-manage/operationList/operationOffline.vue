<!-- 线下获客列表 -->
<template>
  <div>
      <query-com 
      :allCompanyData="allCompanyData"
      @getTableData="getTableData"
      :connectState="connectState"
      :channelData="channelData"
      :messageData="messageData"
      @outExcel="outExcel"
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
import {showTableData,channelData,connectState} from './offLineTableData.js'
export default {
  data () {
    return {
      messageData:{},
      allCompanyData:[],
      connectState:connectState,
      channelData:channelData,
      paginationObj:{pageSize:10,pageNum:1},
      showTableData:showTableData,
      tableData:[],
      tableTotals:0,
      loading:false,
      keywordObj:{}
    };
  },
components:{queryCom,tableCom},
created(){
  this.$axios.get("/api/jjw/customer/offline/can").then(res => {
    res = res.data
    if(res.status === 200){
      this.messageData={
        isShow:true,
        value:"可搜索客户电话、接听人电话、意向项目、接听人"
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
    // 获取table数据
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
      this.$axios.get("/api/jjw/customer/offline",{params:param}).then(res => {
        res = res.data
        if(res.status === 200){
          this.loading = false
          this.tableData = res.data.list
          this.tableTotals = res.data.total
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
      // debugger
      this.$axios.get("/api/jjw/customer/offline/excel/can").then(res => {
        res = res.data
        // debugger
        if(res.status === 200){
          let token = ""
          token = localStorage.getItem("token")
          document.cookie="xf-token="+token+""
          window.location.href=`/api/jjw/customer/offline/excel?keyword=${data.keyword}&companyIds=${this.keywordObj.companyIds}&type=${data.type}&startAt=${data.startAt}&endAt=${data.endAt}`
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