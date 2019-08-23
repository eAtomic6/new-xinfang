<!-- u+成交报表 -->
<template>
  <div class="container">
      <query-common
      :itemInfo="{name:'所属公司'}"
      :companyData="companyData"
      :proCompanyData="proCompanyData"
      @companyChanged="companyChanged"
      @getTableData="getTableData"
      @defaultCompanyData="defaultCompanyData"
      @querySelect="querySelect"
      @resetQuery="resetQuery"
      @outputExcel="outputExcel">
      </query-common>
      <table-common
      :tableData="tableData"
      :showTableData="showTableData"
      :loading="loading"
      :paginationObj="paginationObj"
      :tableTotals="tableTotals"
      @sizeChange="sizeChange"
      @currentChange="currentChange">
      </table-common>
      <el-dialog
        title="提示"
        :visible.sync="exportDialog"
          width="30%"
        >
        <p style="text-align:center">手机号是否全号展示</p>
       <div class="move_footer">
          <el-button class="sureAdd"  type="primary" round @click="showPhone">是</el-button>
          <el-button class="noAdd" @click="noShowPhone">否</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import {showTableData} from './tableData.js'
import queryCommon from '@/components/settle-manage/queryCommon.vue'
import tableCommon from '@/components/settle-manage/tableCommon.vue'
export default {
    components:{queryCommon,tableCommon},
  data () {
    return {
      showTableData:showTableData,  // table表头信息
      companyData:[],               // 查询条件的公司数据
      proCompanyData:[],            // 查询条件的项目所属公司数据
      tableData:[],                  // table数据
      loading:false,                 // table数据加载动画
      paginationObj:{pageSize:20,pageNum:1},  //分页器页码显示
      tableTotals:0,                // table数据总条数
      keywordObj:{},
      defaultCompany:[],
      flag:false,
      exportDialog:false,
      data:{}
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
    defaultCompanyData(){
        this.proCompanyData=this.defaultCompany
      },
     // 搜索条件公司改变时
      companyChanged(val){
        this.$axios.get("/api/report/dealReport/bCompanies",{params:{id:val}}).then(res => {
          res = res.data
          if(res.status === 200){
            this.proCompanyData = res.data
            this.flag ? "" : this.defaultCompany = res.data
            this.flag = true
          }else{
            this.alertMessage("warning",res.message,2000)
            return
          }
        })
      },
      // 搜索条件改变对请求参数进行改变
    dealKeywordObj(obj,control){
      if(!control){
        this.keywordObj.companyId = obj.companyId
        this.keywordObj.bCompanyId = obj.bCompanyId
        this.keywordObj.bKeyword = obj.keyword
        this.keywordObj.startAt = obj.startTime
        this.keywordObj.endAt = obj.endTime
      }
      this.keywordObj.isUplus = 1
      this.keywordObj = Object.assign({}, this.keywordObj, this.paginationObj)
      this.$axios.get("/api/report/dealReport",{params:this.keywordObj}).then(res => {
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
    getTableData(obj){
      this.dealKeywordObj(obj,0)
    },
     // 点击查询
      querySelect(data){
      this.dealKeywordObj(data,0)
      },
      // 点击重置时
      resetQuery(data){
        this.paginationObj={
          pageSize:20,pageNum:1
        }
      this.dealKeywordObj(data,0)
      },
      // 点击导出
      outputExcel(data){
            this.exportDialog = true
            this.data = data
      },
      // 确定显示手机全号
      showPhone(){
        this.outputMethod(1)
      },
      // 不显示手机全号
      noShowPhone(){
        this.outputMethod("")
      },
      outputMethod(isShow){
        this.$axios
        .get("/api/report/dealReportExport/can")
        .then(res => {
          if (res.status === 200) {
            let str = `companyId=${this.data.companyId}&bCompanyId=${
              this.data.bCompanyId
            }&startAt=${this.data.startTime}&endAt=${this.data.endTime}&bKeyword=${
              this.data.keyword
            }&isUplus=1&showRaw=${isShow}`;
            this.exportDialog = false
            window.location.href = "/api/report/dealReportExport?" + str;
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无操作权限");
            return;
          }
        });
      },
      // 当table数据的每页显示数据改变时
      sizeChange(val){
        this.$set(this.paginationObj,"pageSize",val)
        this.dealKeywordObj(this.keywordObj,1)
      },
      // table数据当前页改变时
      currentChange(val){
        this.$set(this.paginationObj,"pageNum",val)
        this.dealKeywordObj(this.keywordObj,1)
      },
  }
}

</script>
<style lang='scss' scoped>
</style>