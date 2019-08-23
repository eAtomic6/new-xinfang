<!-- 部门报表 -->
<template>
  <div class="container">
    <query-com 
    :otherItem="{name:'部门报表',isUplus:true}"
    :departData="departData"
    :uPlusData="uPlusData"
    :clickRowObj="clickRowObj"
    @querySelectP="querySelect" 
    @resetQueryP="resetQuery" 
    @outputExcel="outputExcel">
    </query-com>
    <table-com 
    :isShowPagination="isShowPagination"
    :loading="loading"
    :showTableData="showTableData"
    :tableData="tableData"
    :tableTotals="tableTotals"
    :paginationObj="paginationObj"
    @clickRow="clickRow"
    @sizeChange="sizeChange"
    @currentChange="currentChange">
    </table-com>
  </div>
</template>

<script>
let showTableData = [
  {
    name: "部门/门店",
    value: "name",
    width: "120",
    sortable: false
  },
  {
    name: "客户数量",
    value: "new_cust_num",
    width: "100",
    sortable: true
  },
  {
    name: "报备客户量",
    value: "bb_cust_num",
    width: "120",
    sortable: true
  },
  {
    name: "带看客户量",
    value: "dk_cust_num",
    width: "120",
    sortable: true
  },
  {
    name: "成交客户量",
    value: "deal_cust_num",
    width: "120",
    sortable: true
  },
  {
    name: "有效报备",
    value: "bb_valid",
    width: "120",
    sortable: true
  },
  {
    name: "无效报备",
    value: "bb_invalid",
    width: "120",
    sortable: true
  },
  {
    name: "过期报备",
    value: "bb_expired",
    width: "120",
    sortable: true
  },
  {
    name: "有效带看",
    value: "dk_valid",
    width: "120",
    sortable: true
  },
  {
    name: "无效带看",
    value: "dk_invalid",
    width: "120",
    sortable: true
  },
  {
    name: "过期带看",
    value: "dk_expired",
    width: "120",
    sortable: true
  },
  {
    name: "认筹",
    value: "rc",
    width: "75",
    sortable: true
  },
  {
    name: "认购",
    value: "rg",
    width: "75",
    sortable: true
  },
  {
    name: "草签",
    value: "cq",
    width: "75",
    sortable: true
  },
  {
    name: "网签",
    value: "wq",
    width: "75",
    sortable: true
  },
  {
    name: "结算",
    value: "js",
    width: "75",
    sortable: true
  },
  {
    name: "退筹/退房",
    value: "tctf",
    width: "120",
    sortable: true
  }
];
import tableCom from "@/components/statement-manage/tableCom.vue";
import queryCom from "@/components/statement-manage/queryCom.vue";
import {getDepartListData, getDepartData} from '@/vendor/methods.js'
export default {
  components: { tableCom, queryCom },
  data() {
    return {
      showTableData: showTableData,
      tableData: [],
      tableTotals: 0,
      paginationObj: {},
      departData: [],
      getDataObj: {},
      loading: false,
      isShowPagination: false,
      clickRowObj: {},
      uPlusData: []
    };
  },
  created() {
    this.$axios
      .get("/api/report/departmentReport/can")
      .then(res => {
        if (res.status === 200) {
          this.paginationObj = { pageSize: 999, pageNum: 1 };
          this.defaultObj();
          this.getDepartDataMethod();
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
        depId: JSON.parse(localStorage.getItem("myInfo")).depId,
        startAt: "",
        endAt: "",
        keyword: "",
        isUplusDep: "0"
      };
      this.getDataObj = Object.assign({}, this.getDataObj, obj);
    },
    //   查询
    querySelect(data) {
      this.$set(this.getDataObj, "keyword", data.keyword);
      this.$set(this.getDataObj, "depId", data.depId);
      this.$set(this.getDataObj, "startAt", data.startTime);
      this.$set(this.getDataObj, "endAt", data.endTime);
      this.$set(this.getDataObj, "isUplusDep", data.isUplusDep);
      this.getTableData();
    },
    getUplusData() {
      let params = {
        cityID: ""
      };
      let obj = JSON.parse(localStorage.getItem("myInfo")).dep
      obj.companyId > 0 ? params.cityID=obj.area:params.cityID=""
      if(obj.type == 3 || obj.type == 0){
        let arr = [
          {
            disabled: true,
            DepartOnlyCode: "",
            DeptName: "u+部门列表",
            SubDepart: ""
          }
        ];
        getDepartData(params).then(res => {
          if (res.status === 200) {
              this.uPlusData = arr;
              if(params.cityID == ""){
                this.uPlusData[0].SubDepart = res.data
              }else{
                 let arr = [
                      {
                        DepartOnlyCode: "",
                        DeptName: obj.areaName.split(",")[1],
                        SubDepart: ""
                      }
                    ]
                    arr[0].SubDepart = JSON.parse(res.data)
                    this.uPlusData[0].SubDepart=arr
              }
              // this.uPlusData[0].SubDepart = params.cityID == "" ? res.data : JSON.parse(res.data);
            } else {
              this.alertMessage("warning", res.message);
              return;
            }
        }).catch(err => {
          this.alertMessage("warning", err,2000);
          return;
        })
      }
    },
    //   当前页发生改变时
    currentChange() {},
    //   页数发生改变时
    sizeChange() {},
    //   重置
    resetQuery() {
      this.paginationObj = { pageSize: 999, pageNum: 1 };
      this.defaultObj();
      this.getTableData();
    },
    //   导出
    outputExcel(data) {
      this.$axios
        .get("/api/report/departmentReportExport/can")
        .then(res => {
          if (res.status === 200) {
            let str = `depId=${data.depId}&state=${data.protectId}&startAt=${
              data.startTime
            }&endAt=${data.endTime}`;
            window.location.href = "/api/report/departmentReportExport?" + str;
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无操作权限");
            return;
          }
        });
    },
    // 获取table数据
    getTableData() {
      this.loading = true;
      this.getDataObj = Object.assign({}, this.getDataObj, this.paginationObj);
      this.$axios
        .get("/api/report/departmentReport", { params: this.getDataObj })
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
    // 点击table行时
    clickRow(data) {
      this.clickRowObj = data;
      this.getDataObj.depId = data.id;
      this.getDataObj.keyword = "";
      this.getTableData();
    },
    // 获取部门接口
    getDepartDataMethod() {
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
    }
  }
};
</script>
<style lang='scss' scoped>
</style>