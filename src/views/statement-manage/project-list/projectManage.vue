<!-- 项目报表 -->
<template>
  <div class="container">
    <query-com
    :otherItem="{name:'项目报表'}"
    :keyWordCompany="keyWordCompany"
    :keyWordProvince="keyWordProvince"
    :keyWordCity="keyWordCity"
    @cityChange="cityChange"
    @provinceChange="provinceChange"
    @querySelectP="querySelect" 
    @resetQueryP="resetQuery" 
    @outputExcel="outputExcel">
    </query-com>
    <table-com 
    :showTableData="showTableData"
    :tableData="tableData"
    :tableTotals="tableTotals"
    :paginationObj="paginationObj"
    :loading="loading"
    :isShowDetail=true
    :isShowPagination="'true'"
    @lookDetail="lookDetail"
    @sortMethod="sortMethod"
    @sortChange="sortChange"
    @sizeChange="sizeChange"
    @currentChange="currentChange">
    </table-com>
    <!-- 项目详情弹框 -->
    <el-dialog
      title="项目详情" :visible.sync="projectDetail" :before-close="handleClose" class="dialog-info total-dialog">
        <manage-detail ref="childCom" :manageId="manageId" v-if="projectDetail"></manage-detail>
    </el-dialog>
  </div>
</template>

<script>
let showTableData = [
  {
    name: "项目名称",
    value: "b_name",
    width: "120",
    sortable:false
  },
  {
    name:"项目归属",
    value:"project_agent",
    width:"100",
    sortable:false
  },
   {
    name: "客户数量",
    value: "customersNumber",
    width: "100",
    sortable:true

  },
   {
    name: "有效报备",
    value: "effectiveReport",
    width: "115",
    sortable:true
  },
   {
    name: "待审核报备",
    value: "reportStayExamine",
    width: "115",
    sortable:true
  },
   {
    name: "无效报备",
    value: "invalidReport",
    width: "115",
    sortable:true
  },
   {
    name: "过期报备",
    value: "overdueReport",
    width: "115",
    sortable:true
  },
   {
    name: "有效带看",
    value: "effectiveLook",
    width: "115",
    sortable:true
  },
   {
    name: "待审核带看",
    value: "lookStayExamine",
    width: "115",
    sortable:true
  },
   {
    name: "无效带看",
    value: "invalidLook",
    width: "115",
    sortable:true
  },
   {
    name: "过期带看",
    value: "overdueLook",
    width: "115",
    sortable:true
  },
   {
    name: "认筹",
    value: "identify",
    width: "75",
    sortable:true
  },
   {
    name: "认购",
    value: "subscription",
    width: "75",
    sortable:true
  },
   {
    name: "草签",
    value: "initition",
    width: "75",
    sortable:true
  },
   {
    name: "网签",
    value: "netSign",
    width: "75",
    sortable:true
  },
   {
    name: "结算",
    value: "settlement",
    width: "75",
    sortable:true
  },
   {
    name: "退筹/退房",
    value: "retirementHousing",
    width: "110",
    sortable:true
  }
];
import tableCom from "@/components/statement-manage/tableCom.vue";
import queryCom from "@/components/statement-manage/queryCom.vue";
import manageDetail from "@/components/manage-detail/manageDetail.vue"
import {getTargetSort} from '@/vendor/methods.js'
export default {
  components: { tableCom, queryCom, manageDetail},
  data() {
    return {
      showTableData: showTableData,   //table头部展示
      tableData: [],                  // table数据
      tableTotals: 0,                 // 数据总条数
      paginationObj: {},              // 分页对象数据
      keyWordCompany:[],                // 条件查询公司数据
      getDataObj:{},
      loading: true,
      keyWordCity:[],
      keyWordProvince:[],
      // ===========================所有项目详情里的data===============================
      projectDetail:false,    // 项目详情弹框显示
    };
  },
created(){
  this.$axios.get("/api/report/projectReport/can").then(res => {
    if(res.status === 200){
      this.paginationObj = { pageSize: 20, pageNum: 1 };
      // this.getCompanyData()
      this.defaultObj()
      this.getProvinceData()
      this.getTableData()
    }
  })
  .catch(err => {
        if(err.response.status === 403){
        this.$router.push({name: "403errorPage"})
        return
        }
      })
},
  methods: {
    //   初始化搜索数据
       defaultObj() {
      let myInfo = JSON.parse(localStorage.getItem("myInfo")).dep
      let obj = {
        sortCode: "",
        companyId: "-200",
        startTime: "",
        endTime: "",
        keyword: "",
        provinceId:"0",
        cityId:"0",
        projectAgent:"0"
      };
      this.getDataObj = Object.assign({}, this.getDataObj, obj);
      if(myInfo.companyId > 0){
            this.$set(this.getDataObj, "provinceId",myInfo.province)
            this.$set(this.getDataObj, "cityId",myInfo.area)
            this.$set(this.getDataObj, "companyId",myInfo.companyId)
      }
    },
    sortMethod(){
      this.$set(this.getDataObj,"sortCode",'0')
      this.getTableData()
    },
    //   获取table数据
    getTableData(){
      this.loading = true;
      this.getDataObj = Object.assign({}, this.getDataObj, this.paginationObj);
      this.$axios.get("/api/report/projectReport",{ params: this.getDataObj }).then(res => {
          res = res.data
          if(res.status === 200){
              this.tableData = res.data.list
              this.tableTotals = res.data.total
              this.loading = false;
          }
      })
    },
    // 获取项目列表的所有省
    getProvinceData(){
      let myInfo = JSON.parse(localStorage.getItem("myInfo"))
      let params = {
        province:'',
        city:''
      }
      if(myInfo.dep.companyId < 0){
        this.$axios.get("/api/report/provinceCityCompany",{params:params}).then(res => {
          res = res.data
          if(res.status === 200){
            this.keyWordProvince = res.data
          }else{
            this.alertMessage("warning", res.message)
            return
          }
        })
      }else{
        this.keyWordProvince = [{province_name:myInfo.company.areaName.split(",")[0],province:myInfo.company.province}]
        this.keyWordCity = [{area_name:myInfo.company.areaName.split(",")[1],area:myInfo.company.area}]
        this.keyWordCompany = [{company_name:myInfo.companyName,company_id:myInfo.companyId}]
      }
    },
    // 当省份发生改变时获取所有对应的市
    provinceChange(provinceId){
      let params = {
        province:provinceId,
        city:""
      }
      if(provinceId){
        this.$axios.get("/api/report/provinceCityCompany",{params:params}).then(res => {
           res = res.data
          if(res.status === 200){
            // debugger
            this.keyWordCity = res.data
          }else{
            this.alertMessage("warning", res.message)
            return
          }
        })
      }else{
        this.keyWordCity = []
      }
      this.keyWordCompany= []
    },
    // 当选择的市发生改变时
    cityChange(val){
      let params = {
        province: val[1],
        city:val[0]
      }
      this.$axios.get("/api/report/provinceCityCompany",{params:params}).then((res) => {
          res = res.data
          if(res.status === 200){
              this.keyWordCompany = res.data
              // this.keyWordCompany.unshift({company_name:"中房科瑞",company_id:-1})
          }else{
              this.alertMessage("warning", res.message)
              return
          }
      })
    },
    //   查询
    querySelect(data) {
      console.log(data);
      this.paginationObj={pageSize:20,pageNum:1}
      this.$set(this.getDataObj, "sortCode", "");
      this.$set(this.getDataObj, "companyId", data.companyId);
      this.$set(this.getDataObj, "provinceId", data.provinceId);
      this.$set(this.getDataObj, "cityId", data.cityId);
      this.$set(this.getDataObj, "projectAgent", data.projectAgent);
      this.$set(this.getDataObj, "startTime", data.startTime);
      this.$set(this.getDataObj, "endTime", data.endTime);
      this.$set(this.getDataObj, "keyword", data.keyword);
      this.getTableData();
    },
    //   当前页发生改变时
    currentChange(val) {
      this.loading=true
      this.paginationObj.pageNum = val;
      this.getTableData();
    },
    //   页数发生改变时
    sizeChange(val) {
      this.loading=true
      this.paginationObj.pageSize = val;
      this.getTableData();
    },
    //   重置
    resetQuery(data) {
      let obj = JSON.parse(localStorage.getItem("myInfo")).dep
      this.paginationObj = { pageSize: 20, pageNum: 1 };
      this.defaultObj();
      this.getTableData();
      this.getProvinceData()
      if(obj.companyId < 0){
        this.keyWordCity=[]
        this.keyWordCompany=[]
      }
    },
    // 当排序发生改变时
    sortChange(data){
      this.$set(this.getDataObj,"sortCode",getTargetSort(data.column))
      this.getTableData()
    },
    //   导出
    outputExcel(data) {
      this.$axios.get("/api/report/projectReportExport/can").then(res => {
         if(res.status === 200){
           let str = `companyId=${data.companyId}&sortCode=${this.getDataObj.sortCode}
           &provinceId=${data.provinceId}&cityId=${data.cityId}&projectAgent=${data.projectAgent}
           &startTime=${data.startTime}&endTime=${data.endTime}&keyword=${data.keyword}`
           window.location.href="/api/report/projectReportExport?"+str
         }
      }).catch(err => {
        if(err.response.status === 403){
          this.alertMessage("warning", "无操作权限")
          return
        }
      })
    },
    // ========================================项目详情所有方法开始======================================
    lookDetail(data){
      this.projectDetail=true
      this.manageId = data
    }, 
    handleClose(done){
      this.$refs['childCom'].handleClose()
      done()
    }
    // =========================================项目详情所有方法结束========================================
  }
};
</script>
<style lang='scss' scoped>
/deep/ .el-dialog{
  width: 770px;
  .el-date-editor .el-range__icon,
  .el-date-editor .el-range__close-icon{
    line-height: 23px;
  }
}
</style>