<!-- 新房收款 -->
<template>
  <div class="container">
    <!-- 筛选部分 -->
    <query-com @getList="getList"></query-com>
    <!-- =============================点击结算的弹框开始============================= -->
    <el-dialog title="结算申请" :visible="saleDialogBox" :show-close="false" v-if="saleDialogBox">
      <i class="el-icon-close" @click="closeDialog"></i>
      <money-dialog
        ref="mychild"
        @getList="getList"
        @successChange="successChange"
        @close="close"
        :saleId="saleId"
        :contractType="contractType"
      ></money-dialog>
    </el-dialog>
    <!-- =============================点击结算的弹框结束============================= -->
    <!-- table表格 -->
    <el-table
      v-loading="loading"
      element-loading-text="玩命加载中"
      :data="getMoneyData"
      style="width: 100%"
      class="el-table table-list topTable"
    >
      <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.$index+(pageNum - 1) * pageSize + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed>
        <template slot-scope="scope">
          <button type="text" class="lookDetail" @click="viewDetail(scope.row)">查看详情</button>
          <button
            v-if="scope.row.contractStatus != '结算中' && scope.row.contractStatus != '已完成'"
            type="text"
            class="lookDetail"
            @click="applySettlement(scope.row)"
          >结算</button>
        </template>
      </el-table-column>
      <el-table-column label="客户信息" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            :class="scope.row.customerName?'':'el-icon-minus'"
          >{{scope.row.customerName?scope.row.customerName:''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户手机号" width="130" show-overflow-tooltip :formatter="phoneFormatter">
        <template slot-scope="scope">
          <span
            :class="scope.row.customerMobileNumber?'':'el-icon-minus'"
          >{{scope.row.customerMobileNumber?scope.row.customerMobileNumber:''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            :class="scope.row.entryName?'':'el-icon-minus'"
          >{{scope.row.entryName?scope.row.entryName:''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同状态" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            :class="!scope.row.contractStatus?'el-icon-minus':''"
            :style="scope.row.contractStatus == '驳回'?'color:#ff5438':''"
          >{{scope.row.contractStatus?scope.row.contractStatus:''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="成交人" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            :class="scope.row.traderName?'':'el-icon-minus'"
          >{{scope.row.traderName?scope.row.traderName:''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属部门" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            :class="scope.row.departmentName?'':'el-icon-minus'"
          >{{scope.row.departmentName?scope.row.departmentName:''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="成交日期" width="180" show-overflow-tooltip :formatter="dateFormatter">
        <template slot-scope="scope">
          <span
            :class="scope.row.closingTime !==''?'':'el-icon-minus'"
          >{{scope.row.closingTime !==''?scope.row.closingTime:''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="房屋总价" show-overflow-tooltip width="100">
        <template slot-scope="scope">
          <span
            :class="scope.row.housePrice !==''?'':'el-icon-minus'"
          >{{scope.row.housePrice !=='' ?scope.row.housePrice:""}}</span>
        </template>
      </el-table-column>
      <el-table-column label="应收佣金" show-overflow-tooltip width="100">
        <template slot-scope="scope">
          <span
            :class="scope.row.expectedCommision !==''?'font-c':'el-icon-minus'"
          >{{scope.row.expectedCommision !==''?scope.row.expectedCommision:""}}</span>
        </template>
      </el-table-column>
      <el-table-column label="累计收佣" show-overflow-tooltip width="100">
        <template slot-scope="scope">
          <span
            :class="scope.row.actualCommision !==''?'font-c':'el-icon-minus'"
          >{{scope.row.actualCommision !==''?scope.row.actualCommision:""}}</span>
        </template>
      </el-table-column>
      <el-table-column label="本次收佣" show-overflow-tooltip width="100">
        <template slot-scope="scope">
          <span
            :class="scope.row.commissionMoney !==''?'font-c':'el-icon-minus'"
          >{{scope.row.commissionMoney !==''?scope.row.commissionMoney:""}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            :class="scope.row.rejectReason?'':'el-icon-minus'"
          >{{scope.row.rejectReason?scope.row.rejectReason:''}}</span>
        </template>
      </el-table-column>
      <!-- <div slot="empty" class="list-empty">
        <img src="../../../assets/images/empty.png" alt>
        <p class="desc">暂无数据</p>
      </div> -->
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[ 5 , 10, 20, 30, 40]"
      :page-size="pageSize"
      layout="prev, pager, next,total, sizes, jumper"
      :total="userListTotal"
      v-show="getMoneyData.length!=0"
    ></el-pagination>
    <el-dialog title="查看详情" :visible.sync="showDetail" class="dialog-info" top="40px" width="840px">
      <detail-com :infoData="infoData" :barData="[barData]" @changeBarData="changeBarData"></detail-com>
    </el-dialog>
  </div>
</template>

<script>
import queryCom from "@/components/finance-manage/queryCom.vue";
import detailCom from "@/components/finance-manage/detailCom.vue";
import moneyDialog from "./getMoneyDialog.vue";
import { newGetMoney, getMoneySettleInfo } from "@/api/index";
export default {
  components: { queryCom, detailCom, moneyDialog },
  data() {
    return {
      saleDialogBox: false, //结算弹框显示隐藏
      saleId: "", // 点击结算的当前行id
      contractType: "", // 点击当前行的合同状态
      getMoneyData: [], // 收款表格数据
      pageNum: 1, //分页-table默认页
      pageSize: 10, //分页-每页默认的显示数目
      userListTotal: 0, //分页-总条数
      showDetail: false, // 控制弹窗显示
      loading: true,
      searchData: {
        // 用来筛选的数据
        dealDepId: JSON.parse(localStorage.getItem("myInfo")).depId,
        dealById: "",
        dealType: "",
        dealTimeStart: "",
        dealTimeEnd: "",
        keyword: "",
        isSuccess: false
      },
      infoData: {}, // 详情数据
      barData: {} // 合同生命周期数据
    };
  },
  created() {
    this.$axios.get("/api/settlement/newPremisesCollection/can").then(res => {
      res = res.data
      if(res.status === 200){
        this.getList(false, true);
      }
    }).catch(err => {
        if (err.response.status === 403) {
          this.$router.push({ name: "403errorPage" });
          return;
        }
      });
  },
  methods: {
    successChange() {
      this.isSuccess = true;
    },
    closeDialog() {
      this.isSuccess ? this.getList(false, true) : "";
      //       if(isSuccess){
      // this.getList(false,true)
      //       }
      this.saleDialogBox = false;
      this.isSuccess = false;
    },
    close() {
      this.saleDialogBox = false;
    },
    // 获取table列表数据666
    getList(data, init) {
      this.loading = true;
      this.saleDialogBox = false;
      if (data) {
        this.searchData = data;
        this.pageNum = 1;
      }
      var params = {
        depId: this.searchData.dealDepId, //部门id
        traderId: this.searchData.dealById, //成交人id
        contractStatus: this.searchData.dealType, //合同状态value
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        startTime: this.searchData.dealTimeStart,
        endTime: this.searchData.dealTimeEnd,
        keyword: this.searchData.keyword
      };
      // 重置
      if (init) {
        this.pageNum = 1;
        this.pageSize = 10;
        var params = {
          depId: JSON.parse(localStorage.getItem("myInfo")).depId, //部门id
          traderId: "", //成交人id
          contractStatus: "", //合同状态value
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          startTime: "",
          endTime: "",
          keyword: ""
        };
      }
      newGetMoney({
        params: params
      }).then(res => {
        if (res.status === 200) {
          this.getMoneyData = res.data.list;
          this.userListTotal = res.data.total;
          this.loading = false;
        }
      });
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getList();
    },
    // 查看详情
    viewDetail(item) {
      getMoneySettleInfo({
        params: {
          dealId: item.id
        }
      }).then(res => {
        if (res.status == 200) {
          this.showDetail = true;
          this.infoData = res.data;
          this.infoData.essentialInformation.forEach(item => {
            this.$set(item, `isShow`, false);
          });
          this.barData = this.infoData.essentialInformation.find(
            (item, index) => {
              if (item.view) {
                this.$set(item, `isShow`, true);
                return item;
              }
            }
          );
          // 带看图片转数组
          if (this.barData.name == "带看" && this.barData.viewDetails) {
            // this.barData.viewDetails.forEach(item => {
            //   if (item.takeReceipt && item.takeReceipt.indexOf(",") != -1) {
            //    console.log(1111);
            //    console.log((item.takeReceipt).split(","));
            //     this.$set(item, "takeReceipt", (item.takeReceipt).split(","));
            //   } else {
            //     this.$set(item, "takeReceipt", [item.takeReceipt]);
            //   }
            // });
          }
          // 单据转数组
          if (
            this.barData.name != "报备" &&
            this.barData.name != "带看" &&
            this.barData.viewDetails
          ) {
            let str = this.barData.viewDetails.cert;
            if (str && str.indexOf(",") != -1) {
              this.$set(this.barData.viewDetails, "cert", str.split(","));
            } else {
              this.$set(this.barData.viewDetails, "cert", [str]);
            }
          }
        }
      });
    },
    // 点击展示不同生命周期数据
    changeBarData(val) {
      this.barData = val;
    },
    // 申请结算
    applySettlement(scope) {
      this.saleId = scope.id;
      this.contractType = scope.transactionStatus;
      this.saleDialogBox = true;
    },
    // 手机格式过滤
    phoneFormatter(row, column, cellValue, index) {
      if (!cellValue) {
        return "****";
      } else {
        return `${cellValue.substr(0, 3)}****${cellValue.substr(-4, 4)}`;
      }
    },
    // 日期过滤
    dateFormatter(row, column, cellValue, index) {
      return cellValue.split(" ")[0];
    }
  },
  filters: {
    formatTime(time) {
      if (time) {
        return time.slice(0, 16);
      }
    },
    formatTimeHead(time) {
      if (time) {
        var index = time.indexOf(" ");
        return time.slice(0, index);
      }
    },
    formatTimeEnd(time) {
      if (time) {
        return time.slice(11, 16);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
/deep/ .el-dialog__header .el-dialog__headerbtn {
  width: 40px;
  height: 40px;
}
/deep/.topTable .el-table__body-wrapper {
  width: 103%;
  min-height: 400px;
  line-height: 400px;
}
/deep/ .el-dialog {
  width: 800px;
  .el-icon-close {
    position: absolute;
    right: 6px;
    top: 3px;
    font-size: 25px;
    color: #949494;
    cursor: pointer;
  }
}
.el-icon-minus {
  color: #72a0d1;
  font-size: 15px;
  vertical-align: middle;
  font-weight: 900;
}
.lookDetail {
  background-color: #333;
  color: #fff;
  padding: 4px 5px;
  cursor: pointer;
  border-radius: 2px;
  border: none;
}
/deep/ .el-table {
  tr {
    height: 66px;
  }
  th {
    text-align: center;
    background-color: #e7e7f7;
  }
  .font-c {
    color: #ff5438;
  }
}
/deep/ .dialog-info {
  .el-dialog {
    width: 770px;
  }
  .el-dialog__body {
    background-color: #e6e6e9;
    padding: 0;
    .el-tabs--border-card > .el-tabs__header {
      border: 0;
      background-color: #e8e8ee;
      line-height: 0;

      .el-tabs__item {
        color: #333;
        margin: 0px -2px 0;
        border: 2px solid transparent;

        &.is-active {
          border-top: 2px solid #fda100;
          border-right-color: #dcdfe6;
          border-left-color: #dcdfe6;
        }
      }
    }

    .san-four {
      width: 2px;
      display: inline-block;
    }
  }
}
</style>