<!-- 顾问报表 -->
<template>
  <div class="container">
    <query-com
    :otherItem="{name:'部门报表',isShow:true}"
    :departData="departData" 
    @querySelectP="querySelect"
    @changeTable="changeTable" 
    @tableData="getTableData"
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
    <el-dialog title="详情" :visible.sync="projectDetail" :before-close="handleClose" class="dialog-info total-dialog">
        <manage-detail ref="childCom" :isGuWenManage="isGuWenManage" :manageId="manageId" v-if="projectDetail"></manage-detail>
    </el-dialog>
  </div>
</template>

<script>
import tableCom from "@/components/statement-manage/tableCom.vue";
import queryCom from "@/components/statement-manage/queryCom.vue";
import manageDetail from "@/components/manage-detail/manageDetail.vue";
import {showTableData,lessData} from "./showTableData.js";
import { getTargetSort,getDepartListData } from "@/vendor/methods.js";
export default {
  components: { tableCom, queryCom, manageDetail },
  data() {
    return {
      showTableData: showTableData, //table头部展示
      tableData: [], // table数据
      tableTotals: 0, // 数据总条数
      paginationObj: {}, // 分页对象数据
      departData: [], // 条件查询公司数据
      getDataObj: {},
      loading: true,
      simple:false,
      // ===========================所有项目详情里的data===============================
      projectDetail: false, // 项目详情弹框显示
      isGuWenManage:true
    };
  },
  created() {
    this.$axios
      .get("/api/report/consultantReport/can")
      .then(res => {
        if (res.status === 200) {
          this.paginationObj = { pageSize: 20, pageNum: 1 };
          this.getDepartData();
          this.defaultObj();
          this.getTableData();
        }
      })
      .catch(err => {
        if (err.response.status === 403) {
          this.$router.push({ name: "403errorPage" });
          return;
        }
      });
  },
  methods: {
    // 当点击简报的时候改变变量的值，用来控制获取table时的传入参数是否为简报
    changeTable(int){
     this.simple = int  == 1 ? true : false
      this.getTableData()
    },
    //   初始化搜索数据
    defaultObj() {
      let obj = {
        sort: "",
        startTime: "",
        endTime: "",
        depId: JSON.parse(localStorage.getItem("myInfo")).depId,
        keyword: ""
      };
      this.getDataObj = Object.assign({}, this.getDataObj, obj);
    },
    sortMethod() {
      this.$set(this.getDataObj, "sort", "0");
      this.getTableData();
    },
    //   获取table数据
    getTableData() {
      this.loading = true;
      this.getDataObj = Object.assign({}, this.getDataObj, this.paginationObj);
      this.getDataObj.simple =this.simple
      this.showTableData = !this.simple ? showTableData : lessData
      this.$axios
        .get("/api/report/consultantReport", { params: this.getDataObj })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.tableData = res.data.list;
            this.tableTotals = res.data.total;
            this.loading = false;
          }
        });
    },
    //   获取公司搜索条件数据
    getDepartData() {
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
    //   查询
    querySelect(data) {
      this.paginationObj = { pageSize: 20, pageNum: 1 }
      this.$set(this.getDataObj, "sort", "");
      this.$set(this.getDataObj, "depId", data.depId);
      this.$set(this.getDataObj, "startTime", data.startTime);
      this.$set(this.getDataObj, "endTime", data.endTime);
      this.$set(this.getDataObj, "keyword", data.keyword);
      this.getTableData();
    },
    //   当前页发生改变时
    currentChange(val) {
      this.loading = true;
      this.paginationObj.pageNum = val;
      this.getTableData();
    },
    //   页数发生改变时
    sizeChange(val) {
      this.loading = true;
      this.paginationObj.pageSize = val;
      this.getTableData();
    },
    //   重置
    resetQuery(data) {
      this.paginationObj = { pageSize: 20, pageNum: 1 };
      this.defaultObj();
      this.getTableData();
    },
    // 当排序发生改变时
    sortChange(data) {
      this.$set(this.getDataObj, "sort", getTargetSort(data.column));
      this.getTableData();
    },
    //   导出
    outputExcel(data) {
      this.$axios
        .get("/api/report/consultantReportExport/can")
        .then(res => {
          if (res.status === 200) {
            let str = `depId=${data.depId}&sort=${
              this.getDataObj.sort
            }&startTime=${data.startTime}&simple=${this.simple}&endTime=${data.endTime}&keyword=${
              data.keyword
            }`;
            window.location.href = "/api/report/consultantReportExport?" + str;
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无操作权限");
            return;
          }
        });
    },
    // ========================================项目详情所有方法开始======================================
    lookDetail(data) {
      this.projectDetail = true;
      this.manageId = data;
    },
    handleClose(done) {
      this.$refs["childCom"].handleClose();
      done();
    }
    // =========================================项目详情所有方法结束========================================
  }
};
</script>
<style lang='scss' scoped>
/deep/ .el-dialog {
  width: 770px;
  .el-date-editor .el-range__icon,
  .el-date-editor .el-range__close-icon {
    line-height: 23px;
  }
}
</style>