<!-- 维护报表 -->
<template>
   <div class="container">
    <query-com 
    :itemObj="itemObj" 
    @querySelectP="querySelect" 
    @resetQueryP="resetQuery" 
    @outputExcelP="outputExcel" 
    :departData="departData">
    </query-com>
    <table-com 
    :isShowPagination="'true'"
    :showTableData="showTableData"
    :tableData="tableData"
    :tableTotals="tableTotals"
    :loading="loading"
    :paginationObj="paginationObj"
    @sizeChange="sizeChange"
    @currentChange="currentChange">
    </table-com>
    </div>
</template>

<script>
let showTableData = [
  {
    value: "b_name",
    name: "项目名称",
    width: "150",
    sortable:false
  },
  {
    value: "state_str",
    name: "维护动作",
    width: "180",
    sortable:false
  },
  {
    value: "create_time",
    name: "提交时间",
    width: "180",
    sortable:false
  },
  {
    value: "c_name",
    name: "客户姓名",
    width: "100",
    sortable:false
  },
  {
    value: "c_phone",
    name: "客户电话",
    width: "120",
    sortable:false
  },
  {
    value: "remaining",
    name: "剩余保护期",
    width: "120",
    sortable:false
  },
  {
    value: "e_name",
    name: "置业顾问",
    width: "100",
    sortable:false
  },
  {
    value: "e_mobile",
    name: "顾问电话",
    width: "120",
    sortable:false
  },
  {
    value: "e_dep",
    name: "所属部门",
    width: "180",
    sortable:false
  },
  {
    value: "e_comp",
    name: "所属公司",
    width: "180",
    sortable:false
  },
  {
    value: "z_name",
    name: "审核驻场",
    width: "100",
    sortable:false
  },
  {
    value: "z_mobile",
    name: "驻场电话",
    width: "120",
    sortable:false
  }
];
import tableCom from "@/components/statement-manage/tableCom.vue";
import queryCom from "@/components/statement-manage/queryCom.vue";
import {getDepartListData} from '@/vendor/methods.js'
export default {
  components: { tableCom,queryCom },
  data () {
    return {
      showTableData:showTableData,  //传给table组件的表头
      tableData:[],                 // table表格数据
      departData:[],                // 传给条件搜索部门数据
      itemObj:{name:"部门"},
      getDataObj:{},                  // 获取table表格传参
      paginationObj:{},               // 传给table的页码和页数
      tableTotals:0,                  // 传给组建table总数
      loading:true
    };
  },
  created(){
    this.$axios.get("/api/report/followReport/can").then(res => {
      if(res.status === 200){
        this.paginationObj = {pageNum:1,pageSize:20}
        this.defaultObj()
        this.getTableData()
        this.getDepartData()
      }
    }).catch(err => {
        if(err.response.status === 403){
        this.$router.push({name: "403errorPage"})
        return
        }
      })
  },
  methods: {
    // 初始化条件查询对象
     defaultObj(){
      let obj = {
        dep_id:JSON.parse(localStorage.getItem("myInfo")).depId,
        state:"",
        start_at:"",
        end_at:"",
        keyword:""
      }
      this.getDataObj = Object.assign({},this.getDataObj,obj)
    },
    // 获取table数据
    getTableData(){
      this.loading = true
      this.getDataObj = Object.assign({},this.getDataObj,this.paginationObj)
       this.$axios.get("/api/report/followReport",{params:this.getDataObj}).then(res => {
         res = res.data
          if(res.status === 200){
            this.tableData = res.data.list
            this.tableTotals = res.data.total
            this.loading = false
          }else{
          this.alertMessage("warning", res.message)
          return
        }
        })
    },
    // 获取条件查询的部门数据
    getDepartData(){
       getDepartListData().then(res => {
        if (res.status === 200) {
          this.departData = JSON.parse("[" + JSON.stringify(res.data) + "]");
        } else {
          this.alertMessage("warning", res.message);
          return;
        }
      }).catch(err => {
        this.alertMessage("warning", err,2000);
        return;
      })
    },
     // 每页数据发生变化
    sizeChange(val){
      this.loading=true
      this.paginationObj.pageSize = val
      this.getTableData()
    },
    // 当前页发生改变时
    currentChange(val){
      this.loading=true
      this.paginationObj.pageNum = val
      this.getTableData()
    },
    // 根据条件查询
    querySelect(data){
      this.paginationObj={pageSize:20,pageNum:1}
      this.$set(this.getDataObj,"dep_id",data.depId)
      this.$set(this.getDataObj,"state",data.protectId)
      this.$set(this.getDataObj,"start_at",data.startTime)
      this.$set(this.getDataObj,"end_at",data.endTime)
      this.$set(this.getDataObj,"keyword",data.keyword)
      this.getTableData()
    },
    // 重置方法
    resetQuery(data){
      this.paginationObj={pageSize:20,pageNum:1}
      this.defaultObj()
      this.getTableData()
    },
    // 导出excel
    outputExcel(data){
       this.$axios.get("/api/report/followReportExport/can").then(res => {
         if(res.status === 200){
           let str = `dep_id=${data.depId}&state=${data.protectId}&start_at=${data.startTime}&end_at=${data.endTime}&keyword=${data.keyword}`
           window.location.href="/api/report/followReportExport?"+str
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