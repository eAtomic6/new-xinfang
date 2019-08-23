<!-- u+报表管理 -->
<template>
  <div class="container">
    <query-com 
    :itemObj="itemObj" 
    @querySelectU="querySelect" 
    @resetQueryU="resetQuery" 
    @outputExcelU="outputExcel" 
    :uPlusData="uPlusData">
    </query-com>
    <table-com 
    :showTableData="showTableData"
    :isShowPagination="'true'"
    :tableData="tableData"
    :tableTotals="tableTotals"
    :paginationObj="paginationObj"
    :loading="loading"
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
    sortable: false
  },
  {
    value: "maintain",
    name: "维护动作",
    width: "110",
    sortable: false
  },
  {
    value: "create_time",
    name: "提交时间",
    width: "120",
    sortable: false
  },
  {
    value: "customerName",
    name: "客户姓名",
    width: "90",
    sortable: false
  },
  {
    value: "customerPhone",
    name: "客户电话",
    width: "110",
    sortable: false
  },
  {
    value: "remainingTime",
    name: "剩余保护期",
    width: "110",
    sortable: false
  },
  {
    value: "secondHandBrokerName",
    name: "二手经纪人",
    width: "100",
    sortable: false
  },
  {
    value: "secondHandBrokerMobile",
    name: "二手经纪人电话",
    width: "120",
    sortable: false
  },
  {
    value: "secondHandBrokerDepName",
    name: "二手房门店",
    width: "110",
    sortable: false
  },
  {
    value: "secondHandBrokerTheaterName",
    name: "二手战区",
    width: "110",
    sortable: false
  },
  {
    value: "linkageName",
    name: "联动专员",
    width: "100",
    sortable: false
  },
  {
    value: "linkageMobile",
    name: "联动电话",
    width: "110",
    sortable: false
  },
  {
    value: "linkageDepName",
    name: "联动所在部门",
    width: "120",
    sortable: false
  },
  {
    value: "stationingName",
    name: "审核驻场",
    width: "110",
    sortable: false
  },
  {
    value: "stationingMobile",
    name: "驻场电话",
    width: "110",
    sortable: false
  }
];
import tableCom from "@/components/statement-manage/tableCom.vue";
import queryCom from "@/components/statement-manage/queryCom.vue";
import { getStrTime } from "@/vendor/methods.js";
export default {
  components: { tableCom, queryCom },
  data() {
    return {
      showTableData: showTableData, // 传给table组件的表头
      tableData: [], // table表格数据
      uPlusData: [], // 传给条件搜索u+数据
      itemObj: { name: "U+" }, // 传给条件组件控制表单
      getDataObj: {},
      paginationObj: {}, // 传给table的页码和页数
      tableTotals: 0, // 分页器总页数
      loading: true
    };
  },
  created() {
    this.$axios
      .get("/api/report/uPlusReportForm/can")
      .then(res => {
        res = res.data;
        if (res.status === 200) {
          this.paginationObj = { pageSize: 20, pageNum: 1 };
          this.defaultObj();
          this.getTableData();
          this.getUplusData();
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
    defaultObj() {
      let obj = {
        departOnlyCode: "",
        maintain: "",
        startTime: "",
        endTime: "",
        keyword: "",
        cityId: JSON.parse(localStorage.getItem("myInfo")).dep.area
      };
      this.getDataObj = Object.assign({}, this.getDataObj, obj);
    },
    // 获取table数据
    getTableData() {
      this.loading = true;
      this.getDataObj = Object.assign({}, this.getDataObj, this.paginationObj);
      this.$axios
        .get("/api/report/uPlusReportForm", { params: this.getDataObj })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.tableData = res.data.list;
            this.tableTotals = res.data.total;
            this.loading = false;
          } else {
            this.alertMessage("warning", res.message);
            return;
          }
        });
    },
    getUplusData() {
      let params = {cityId:JSON.parse(localStorage.getItem("myInfo")).dep.area}
      this.$axios.get("/api/third/uplus/uPlusTheaterList",{params:params}).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.uPlusData = res.data;
        } else {
          this.alertMessage("warning", res.message);
          return;
        }
      });
    },
    // 每页数据发生变化
    sizeChange(val) {
      this.loading=true
      this.paginationObj.pageSize = val;
      this.getTableData();
    },
    currentChange(val) {
      this.loading=true
      this.paginationObj.pageNum = val;
      this.getTableData();
    },
    // 根据条件查询
    querySelect(data) {
      this.paginationObj={pageSize:20,pageNum:1}
      this.$set(this.getDataObj, "departOnlyCode", data.uPlusId);
      this.$set(this.getDataObj, "maintain", data.protectId);
      this.$set(this.getDataObj, "startTime", data.startTime);
      this.$set(this.getDataObj, "endTime", data.endTime);
      this.$set(this.getDataObj, "keyword", data.keyword);
      this.getTableData();
    },
    // 重置方法
    resetQuery(data) {
      this.paginationObj = { pageSize: 20, pageNum: 1 };
      this.defaultObj();
      this.getTableData();
    },
    // 导出excel
    outputExcel(data) {
      this.$axios
        .get("/api/report/uPlusReportFormExport/can")
        .then(res => {
          if (res.status === 200) {
            let str = `departOnlyCode=${data.uPlusId}&maintain=${
              data.protectId
            }&startTime=${data.startTime}&endTime=${data.endTime}&keyword=${
              data.keyword
            }&cityId=${
              JSON.parse(localStorage.getItem("myInfo")).dep.area
            }`;
            window.location.href = "/api/report/uPlusReportFormExport?" + str;
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无操作权限");
            return;
          }
        });
    }
  }
};
</script>
<style lang='scss' scoped>
</style>