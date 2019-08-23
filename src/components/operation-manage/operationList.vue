<!-- 获客列表组件 -->
<template>
    <div>  <!-- 头部样式 -->
      <div class="w-select">
        <el-form :inline="true" :model="keyWordData" class="demo-form-inline" min-width="1398px">
          <el-form-item label="公司名称:">
            <el-select v-model="keyWordData.companyIds" class="selectIpt" :disabled="isShowCompanyId<0 ? false : true">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in allCompanyData" :label="item.name" :key="item.id" :value=item.d_id></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="获取方式:" class="getMethods">
            <el-select v-model="keyWordData.type" class="selectIpt">
              <el-option label="全部" value=""></el-option>
              <el-option label="开盘变价通知" value="1"></el-option>
              <el-option label="联系项目专员" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键词:">
            <el-input v-model="keyWordData.keyword" placeholder="请输入关键词(最多30个字)" maxlength=30></el-input>
          </el-form-item>
           <el-form-item>
                <el-button type="warning" @click="sureQueryInfo" class="search-but">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="resetQueryInfo" class="chongzhi-but">重置</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="outputExcel" class="but-lightblue"><span class="icon icon-daochu org-icon"></span>导出</el-button>
            </el-form-item>
        </el-form>
        <span style="color:red;display: block;margin-top: 5px;">提示：电话记录最新数据截止至昨天24:00!</span>
      </div>
      <!-- 中间样式 -->
      <div class="content">
        <el-table
        ref="multipleTable"
        :data="operationDataList"
        tooltip-effect="dark"
        heigth='250'
        header-align=center
        border>
        <el-table-column
          label="序号"
          width="60"
          type="index">
        </el-table-column>
        <el-table-column
          prop="fronn"
          label="获客渠道"
          width='120'
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="type"
          label="获取方式"
          width='120'
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="客户电话"
          width='150'
          >
        </el-table-column>
        <el-table-column
          prop="b_name"
          label="意向项目"
          width='180'
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="building_price"
          label="项目价格"
          width='120'
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="d_name"
          label="项目公司"
          width='180'
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="获客时间"
          width='100'
          >
        </el-table-column>
        <el-table-column
          prop="StartTime"
          label="呼叫时间"
          width='100'
          >
        </el-table-column>
        <el-table-column
          prop="EndTime"
          label="挂断时间"
          width='100'
          >
        </el-table-column>
        <el-table-column
          prop="Duration"
          label="连接时间"
          width='100'
          >
        </el-table-column>
        <el-table-column
          prop="CalledTel"
          label="接听电话"
          width='150'
          >
        </el-table-column>
        <el-table-column
          label="电话录音"
          width='85'>
          <template slot-scope="scope">
                <div v-if="scope.row['NewRecordUrl'] != '-'">
                    <audio :src="scope.row['NewRecordUrl']" class="telephoneCss" controls="controls">
                  </audio>
                </div>
                <div v-else>
                    <i class="el-icon-minus" style="font-weight:600"></i>
                </div>
            </template>
        </el-table-column>
        <el-table-column
          prop="CalledEmp"
          label="接听人"
          width='90'
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="prev, pager, next,  total, sizes, jumper"
        :total="listTotals">
      </el-pagination>
      </div>
    </div>
</template>

<script>
import {getOperationList,getDepCompany,outputExcel} from "@/api/index"
export default {
  data () {
    return {
      operationDataList: [],  // table表格的数据
      listTotals: 0,        // table表格的数据中条数
      pageSize: 10,           // 列表每页展示数据的条数
      pageNum: 1,             // 当前列表的页数
      keyWordData: {},         // 条件搜索关键词对象
      allCompanyData:[],        // 条件搜索所有公司数据
      isShowCompanyId: "",       // 当前登录人的公司id
    };
  },
  mounted () {
    let infoObj = JSON.parse(localStorage.getItem("myInfo"))
    this.getTableData()
    this.getAllCompany()
    this.isShowCompanyId = infoObj.dep.companyId
    this.keyWordData.companyIds = infoObj.dep.companyId < 0 ? "" : infoObj.dep.companyId
    },
  created(){
    this.keyWordData = this.defaultForm()
  },
  methods: {
    // 重置条件搜索数据
    defaultForm(){
      let obj = {
        companyIds:"",
        type:"",
        keyword:"",
        pageSize:10,
        pageNum: 1
      }
      return obj
    },
    // 获取table表格的数据
    getTableData(){
      this.$axios.get("/api/jjw/customer/can").then(res => {
        if(res.status === 200){
          let params = this.keyWordData
          getOperationList({params:params}).then(res => {
            if(res.status === 200){
              this.operationDataList = res.data.list
              this.listTotals = res.data.total
            }
          })
        }
      }).catch(err => {
        if(err.response.status === 403){
        this.$router.push({name: "403errorPage"})
        return
        }
      })
    },
    // 获取所有公司
    getAllCompany(){
      getDepCompany().then(res => {
        if(res.status === 200){
          this.allCompanyData = res.data
        }else{
          this.alertMessage("warning", res.message)
          return
        }
      })
    },
    // 根据关键词查询
    sureQueryInfo(){
      // this.defaultForm()
      this.getTableData()
    },
    // 重置搜索条件
    resetQueryInfo(){
      this.pageSize=5
      this.pageNum=1
      this.keyWordData = this.defaultForm()
      this.keyWordData.companyIds = this.isShowCompanyId < 0 ? "" : this.isShowCompanyId
      this.getTableData()
    },
    // 列表每页展示的数据条数改变时
    handleSizeChange(val){
      this.pageSize = val
     this.$set(this.keyWordData,"pageSize",val)
      this.getTableData()
    },
    // 列表当前页码发生改变时
    handleCurrentChange(val){
      this.pageNum = val
      this.$set(this.keyWordData,"pageNum",val)
      this.getTableData()
    },
    formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
    },
    outputExcel(){
      this.$axios.get("/api/jjw/customer/excel/can").then(res => {
        if(res.status === 200){
          let token = ""
          token = localStorage.getItem("token")
          document.cookie="xf-token="+token+""
          window.location.href=`/api/jjw/customer/excel?keyword=${this.keyWordData.keyword}&companyIds=${this.keyWordData.companyIds}`
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
/deep/ .getMethods{
  .el-input__inner{
    width: 150px !important;
  }
}
/deep/ .el-input__inner{
    height: 30px !important;
}
  /deep/ .el-table__body{
    tbody {
      tr{
        height: 52px;
      }
    }
  }
  /deep/ .el-select{
    .el-input__inner{
      font-weight: 700;
    }
  }
 /deep/ .el-table__body-wrapper{
  width: 101.5%;
  overflow: scroll;
}
  @media only screen and (min-width: 800px) and (max-width:900px){
    /deep/ .el-table__body-wrapper {
      height: 400px;
    }
  }
   @media only screen and (min-width: 700px) and (max-width:800px) {
     /deep/ .el-table__body-wrapper {
      height: 370px;
    }
  }
   @media only screen and (min-width: 900px){
    /deep/ .el-table__body-wrapper {
      height: 600px;
    }
  }
   @media only screen and (max-width: 700px) {
     /deep/ .el-table__body-wrapper {
      height: 370px;
    }
  }
  .telephoneCss{
    &:focus{
      outline: none;
    }
  }
</style>