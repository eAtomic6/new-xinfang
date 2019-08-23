<!-- 新房结算 -->
<template>
  <div class="container">
    <query-com
      :showCommission="true"
      :showMark="true"
      @showTip="showTip"
      :title="'结算'"
      @getList="getList"
    ></query-com>
    <!-- table表格 -->
    <el-table
      v-loading="loading"
      element-loading-text="玩命加载中"
      :data="settlementData"
      style="width: 100%"
      class="el-table table-list topTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column width="55" type="selection" fixed></el-table-column>
      <el-table-column label="操作" width="150" fixed>
        <template slot-scope="scope">
          <button type="text" class="lookDetail" @click="viewDetail(scope.row)">查看详情</button>
          <button
            v-if="scope.row.state != '已完结' && scope.row.state != '分佣中'"
            type="text"
            class="lookDetail"
            @click="auditSettlement(scope.row)"
          >审核结算</button>
        </template>
      </el-table-column>
      <el-table-column label="序号" width="80">
        <template slot-scope="scope">
          <span>{{scope.$index+(pageNum - 1) * pageSize + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="is_issue" label="佣金" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="成交日期" width="120" show-overflow-tooltip :formatter="dateFormatter">
        <template slot-scope="scope">
          <span
            :class="scope.row.deal_time?'':'el-icon-minus'"
          >{{scope.row.deal_time?scope.row.deal_time:''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="scope.row.bName?'':'el-icon-minus'">{{scope.row.bName?scope.row.bName:''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="scope.row.state?'':'el-icon-minus'">{{scope.row.state?scope.row.state:''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户信息" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="scope.row.cName?'':'el-icon-minus'">{{scope.row.cName?scope.row.cName:''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户手机号" width="130" show-overflow-tooltip :formatter="phoneFormatter">
        <template slot-scope="scope">
          <span
            :class="scope.row.cPhone  !== ''?'':'el-icon-minus'"
          >{{scope.row.cPhone !== ''?scope.row.cPhone:''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="物业地址" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            :class="scope.row.house_no !== ''?'':'el-icon-minus'"
          >{{scope.row.house_no !== ''?scope.row.house_no:''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="面积" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            :class="scope.row.house_area !== ''?'':'el-icon-minus'"
          >{{scope.row.house_area !== ''?scope.row.house_area:''}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="pc_name" label="成交人" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            :class="scope.row.pc_name?'':'el-icon-minus'"
          >{{scope.row.pc_name?scope.row.pc_name:''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="房屋总价" show-overflow-tooltip min-width="100">
        <template slot-scope="scope">
          <span
            :class="scope.row.house_price  !== ''?'':'el-icon-minus'"
          >{{scope.row.house_price !== ''?scope.row.house_price:''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="应收佣金" show-overflow-tooltip min-width="100">
        <template slot-scope="scope">
          <span
            :class="scope.row.expected_commision !== ''?'font-c':'el-icon-minus'"
          >{{scope.row.expected_commision !== ''?scope.row.expected_commision:''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="累计收佣" show-overflow-tooltip min-width="100">
        <template slot-scope="scope">
          <span
            :class="scope.row.actual_commision !== ''?'font-c':'el-icon-minus'"
          >{{scope.row.actual_commision !== ''?scope.row.actual_commision:""}}</span>
        </template>
      </el-table-column>
      <el-table-column label="本次收佣" show-overflow-tooltip min-width="90">
        <template slot-scope="scope">
          <span
            :class="scope.row.commission_money !== ''?'font-c':'el-icon-minus'"
          >{{scope.row.commission_money !== ''?scope.row.commission_money:""}}</span>
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
      v-show="settlementData.length!=0"
    ></el-pagination>
    <!-- 查看详情 -->
    <el-dialog title="查看详情" :visible.sync="showDetail" class="dialog-info" top="40px">
      <detail-com
        :title="'结算'"
        :infoData="infoData"
        :barData="[barData]"
        @changeBarData="changeBarData"
      ></detail-com>
    </el-dialog>
    <!-- 查看审核结算弹窗 -->
    <el-dialog
      title="审核结算"
      :visible.sync="showSettlement"
      :close-on-click-modal="false"
      v-if="showSettlement"
      top="100px"
      width="951px"
    >
      <reviewSettlement
        :title="'审核结算'"
        :reviewSettlement="reviewSettlement"
        @turn_down="turnDown"
        @closeReviewSettlement="closeReviewSettlement"
      ></reviewSettlement>
      <!-- 查看审核结算弹窗 -- 驳回原因 -->
      <el-dialog
        :visible.sync="turn_down"
        :close-on-click-modal="false"
        @close="close_turn_down"
        top="200px"
        width="570px"
        append-to-body
      >
        <div class="turn_down">
          <el-form
            class="demo-ruleForm"
            label-width="15%"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
          >
            <el-form-item label="驳回原因" prop="desc">
              <el-input
                type="textarea"
                style="width:100%"
                v-model="ruleForm.desc"
                maxlength="100"
                ref="reference"
                @input="textareaPosationChange"
              ></el-input>
              <span class="textareaPosation">{{textareaPosation}}/100</span>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="submitForm('ruleForm')" class="submitForm">保存</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <!-- 标记佣金发放提醒弹框 -->
    <el-dialog :title="tipTitle" :visible.sync="toTip" width="30%" class="tip-info">
      <div class="que">
        您是否确认将以下
        <span>{{selectedRows.length}}</span>
        个合同标记为{{isIssue}}佣金?
      </div>
      <div class="item-info">
        <span v-for="(item,index) in selectedRows" :key="index">
          {{item.bName}}
          <span class="name-time">（{{item.cName}}-{{item.deal_time | timeFormate}}）</span>、
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toTip = false" class="chongzhi-but">取消</el-button>
        <el-button @click="markToGranted" class="search-but">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import queryCom from "@/components/finance-manage/queryCom.vue";
import detailCom from "@/components/finance-manage/detailCom.vue";
import reviewSettlement from "@/views/finance-manage/getSettle-new/reviewSettlement.vue";
import {
  getNewGetSettle,
  getMoneySettleInfo,
  getSettlementTurnDown,
  toIssue
} from "@/api/index";
import { setTimeout } from "timers";
export default {
  components: { queryCom, detailCom, reviewSettlement },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error("请输入多余三个字的驳回原因"));
      } else {
        callback();
      }
    };
    return {
      settlementData: [], // 结算表格数据
      turn_down: false, //驳回的弹出窗
      turnDownId: "",
      ruleForm: {
        desc: ""
      },

      rules: {
        desc: [
          {
            required: validatePass,
            message: "请填写驳回原因",
            trigger: "blur"
          }
        ]
      },
      pageNum: 1, // 分页-table默认页
      pageSize: 10, // 分页-每页默认的显示数目
      userListTotal: 0, // 分页-总条数
      selectedRows: [], // 选择的行
      showDetail: false, // 控制详情弹窗弹出
      showSettlement: false, //控制审核结算弹窗
      toTip: false, // 控制佣金发放提醒弹框弹出
      tipTitle: "",
      isIssue: "",
      loading: false, // 控制loading动画
      reviewSettlement: {}, // 审核结算弹窗传参
      searchData: {
        // 用来筛选的数据
        dealDepId: JSON.parse(localStorage.getItem("myInfo")).depId,
        // dealDepId: "",
        dealById: "",
        dealType: "",
        dealTimeStart: "",
        dealTimeEnd: "",
        keyword: ""
      },
      infoData: {}, // 详情数据
      barData: {}, // 合同生命周期数据
      textareaPosation: 0 //驳回右下角
    };
  },
  created() {
    this.$axios.get("/api/settlement/list/can").then(res => {
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
    // 获取table列表数据
    getList(data, init) {
      this.loading = true;
      let params={}
      if (data) {
        this.searchData = data;
        this.pageNum = 1;
      }
      if(init){
        this.pageNum = 1;
        this.pageSize = 10;
         params = {
          depId: JSON.parse(localStorage.getItem("myInfo")).depId, //部门id
          // depId: "", //部门id
          traderId: "", //成交人id
          contractStatus: "", //合同状态value
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          startTime: "",
          endTime: "",
          keyword: "",
          isIssue: ""
        };
      }else{
        params = {
        depId: this.searchData.dealDepId, //部门id
        pcId: this.searchData.dealById, //成交人id
        state: this.searchData.dealType, //合同状态value
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        startTime: this.searchData.dealTimeStart,
        endTime: this.searchData.dealTimeEnd,
        keyword: this.searchData.keyword,
        isIssue: this.searchData.commissionType
        };
      }
      // var params = {
      //   depId: this.searchData.dealDepId, //部门id
      //   pcId: this.searchData.dealById, //成交人id
      //   state: this.searchData.dealType, //合同状态value
      //   pageNum: this.pageNum,
      //   pageSize: this.pageSize,
      //   startTime: this.searchData.dealTimeStart,
      //   endTime: this.searchData.dealTimeEnd,
      //   keyword: this.searchData.keyword,
      //   isIssue: this.searchData.commissionType
      // };
      // // 重置
      // if (init) {
      //   this.pageNum = 1;
      //   this.pageSize = 10;
      //   var params = {
      //     depId: JSON.parse(localStorage.getItem("myInfo")).depId, //部门id
      //     // depId: "", //部门id
      //     traderId: "", //成交人id
      //     contractStatus: "", //合同状态value
      //     pageNum: this.pageNum,
      //     pageSize: this.pageSize,
      //     startTime: "",
      //     endTime: "",
      //     keyword: "",
      //     isIssue: ""
      //   };
      // }
      getNewGetSettle({
        params: params
      }).then(res => {
        if (res.status === 200) {
          this.settlementData = res.data.list;
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
          dealId: item.deal_id
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
            this.barData.viewDetails.forEach(item => {
              // if (item.takeReceipt && item.takeReceipt.indexOf(",") != -1) {
              //   this.$set(item, "takeReceipt", (item.takeReceipt).split(","));
              // } else {
              //   this.$set(item, "takeReceipt", [item.takeReceipt]);
              // }
            });
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
    // 审核结算
    auditSettlement(val) {
      this.reviewSettlement = val; //正式
      this.showSettlement = true;
    },
    // 当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    // 佣金发放提醒弹框弹出
    showTip(isGrant) {
      if (!this.selectedRows.length) return;
      if (isGrant == 0) {
        this.tipTitle = "标记为未发佣金";
        this.isIssue = "未发放";
      } else {
        this.tipTitle = "标记为已发佣金";
        this.isIssue = "已发放";
      }
      this.toTip = true;
    },
    // 改变佣金发放状态
    markToGranted() {
      let ids = [];
      this.selectedRows.forEach(item => {
        ids.push(item.deal_id);
      });
      let params = {
        ids: ids.join(","),
        isIssue: this.isIssue == "未发放" ? 0 : 1
      };
      toIssue(params).then(res => {
        console.log(res.data);
      });
      this.selectedRows = [];
      this.toTip = false;
      this.allSelected = false;
      setTimeout(() => {
        this.getList();
      }, 200);
    },
    // 手机格式过滤
    phoneFormatter(row, column, cellValue, index) {
      // console.log(row, column, cellValue, index);
      if (!cellValue) {
        return "****";
      } else {
        return `${cellValue.substr(0, 3)}****${cellValue.substr(-4, 4)}`;
      }
    },
    // 结算弹窗--驳回
    turnDown(val) {
      this.turn_down = val.status; //打开弹出窗
      this.turnDownId = val.orderId; //获得驳回的ID
    },
    // 结算弹窗--驳回 -- 提交
    submitForm(formName) {
      if (this.ruleForm.desc.length < 3) {
        this.alertMessage("warning", "驳回请多余3个字", 2000);
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            getSettlementTurnDown({
              id: this.turnDownId,
              rejectRemark: this.ruleForm.desc
            }).then(res => {
              if (res.status == 200) {
                this.alertMessage("success", "驳回成功", 2000);
                this.turn_down = false; //关闭弹出窗
                 this.getList(false, true);
                this.showSettlement = false; //关闭审核结算弹窗
              } else {
                this.alertMessage("warning", res.message, 2000);
              }
            });
          } else {
            this.alertMessage("warning", "请填写多于三个字的驳回原因", 2000);
            return false;
          }
        });
      }
    },
    // 驳回内容改变赋值给右下角
    textareaPosationChange(val) {
      console.log(val.length);
      this.textareaPosation = val.length;
    },
    // 关闭驳回弹窗
    close_turn_down() {
      this.ruleForm.desc = "";
       this.getList(false, true);
    },

    // 提交成功后关闭结算弹窗
    closeReviewSettlement(val) {
      this.showSettlement = val;
        this.ruleForm.desc = "";
      this.getList(false, true);
    },
    // 日期过滤
    dateFormatter(row, column, cellValue, index) {
      return cellValue.split(" ")[0];
    }
  },
  filters: {
    timeFormate(val) {
      return val
        .split("-")
        .join(".")
        .split(" ")[0];
    }
  }
};
</script>
<style lang='scss' scoped>
/deep/.topTable .el-table__body-wrapper{
  line-height: 400px;
  min-height: 400px;
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

/deep/ .el-table .cell {
  width: 101%;
  height: 100%;
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
/deep/ .el-textarea__inner {
  min-height: 150px !important;
}
.turn_down {
  text-align: center;
  position: relative;
  .textareaPosation {
    position: absolute;
    position: absolute;
    bottom: -5px;
    right: 10px;
    font-size: 12px;
    color: #cdcdcd;
  }
  /deep/ .el-textarea {
    > textarea {
      resize: none;
    }
  }
}
.submitForm {
  background-color: #fd8f00;
  border-color: #fd8f00;
}
/deep/ .tip-info {
  .el-dialog {
    width: 514px !important;
    min-height: 388px;
    max-height: 80%;
    overflow-y: auto;
  }
  .que {
    font-size: 16px;
    margin-bottom: 15px;
    text-align: center;
    color: #ff5438;
  }
  .item-info {
    min-height: 164px;
    color: #333;
    padding-top: 31px;
    .name-time {
      color: #666;
    }
  }
  .el-dialog__footer {
    text-align: center;
    .search-but,
    .chongzhi-but {
      width: 104px;
      height: 40px;
      border-radius: 5px;
    }
  }
}
</style>