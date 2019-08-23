<!-- 结算报表 -->
<template>
  <div class="container">
      <query-common
      :itemInfo="{name:'佣金'}"
      :companyData="companyData"
      @getTableData="getTableData"
      @querySelect="querySelect"
      @resetQuery="resetQuery"
      @outputExcel="outputExcel">
      </query-common>
      <table-common
      :tableData="tableData"
      :loading="loading"
      :paginationObj="paginationObj"
      :tableTotals="tableTotals"
      @sizeChange="sizeChange"
      @currentChange="currentChange">
      </table-common>
  </div>
</template>

<script>
import queryCommon from '@/components/settle-manage/queryCommon.vue'
import tableCommon from './saleTable.vue'
export default {
    components:{queryCommon,tableCommon},
  data () {
    return {
      companyData:[],               // 查询条件的公司数据
      tableData:[],                  // table数据
      loading:false,                 // table数据加载动画
      paginationObj:{pageSize:20,pageNum:1},  //分页器页码显示
      tableTotals:0,                // table数据总条数
      keywordObj:{}
    };
  },
created(){
    this.getcompanyData()
},
  methods: {
    // 获取公司数据
      getcompanyData(){
        this.$axios.get("/api/getItemCompany").then((res) => {
          res = res.data
          if(res.status === 200){
            this.companyData = res.data
          }
        })
      },
      // 条件对象初始化并请求table数据
      dealKeywordObj(obj,control){
            // console.log(obj);
        if(!control){
          this.keywordObj.companyId = obj.companyId
          this.keywordObj.isIssue = obj.commissionId
          this.keywordObj.keyWord = obj.keyword
          this.keywordObj.startAt = obj.startTime
          this.keywordObj.endAt = obj.endTime
        }
        this.keywordObj.isUplus = 0
        this.keywordObj = Object.assign({}, this.keywordObj, this.paginationObj)
        this.$axios.get("/api/report/settlementReport",{params:this.keywordObj}).then(res => {
          res = res.data
          if(res.status === 200){
            this.tableData = res.data.list
            this.tableTotals = res.data.total
          }else{
            this.alertMessage("warning",res.message,2000)
            return
          }
        })
      },
      // 获取table数据
      getTableData(data){
          this.dealKeywordObj(data,0)
      },
      // 点击查询
      querySelect(data){
        this.paginationObj={
          pageSize:20,pageNum:1
        }
      this.dealKeywordObj(data,0)
          console.log(data);
      },
      // 点击重置
      resetQuery(data){
        this.paginationObj={
          pageSize:20,pageNum:1
        }
      this.dealKeywordObj(data,0)
      },
      // 点击导出
      outputExcel(data){
         this.$axios
        .get("/api/report/settlementReportExport/can")
        .then(res => {
          if (res.status === 200) {
            let str = `companyId=${data.companyId}&isIssue=${
              data.commissionId
            }&startAt=${data.startTime}&endAt=${data.endTime}&keyWord=${
              data.keyword
            }&isUplus=0`;
            window.location.href = "/api/report/settlementReportExport?" + str;
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无操作权限");
            return;
          }
        });
      },
      // table每页显示数据变化
      sizeChange(val){
        this.$set(this.paginationObj,"pageSize",val)
        this.dealKeywordObj(this.keywordObj,1)
      },
      // table当前页改变
      currentChange(val){
        this.$set(this.paginationObj,"pageNum",val)
        this.dealKeywordObj(this.keywordObj,1)
      },
  }
}
</script>
<style lang='scss' scoped>
</style>