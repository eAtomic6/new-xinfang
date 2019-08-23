<template>
  <div>
    <!--单击弹出 查看详情 模态框  -->
    <el-card class="info-card">
      <div class="user-name">
        <span>
          {{customerDetails.customerName}}
          <span
            class="c-no"
          >客户编号: {{customerDetails.customerNumber}}</span>
        </span>
        <span
          class="settle-type"
          v-if="title == '结算'"
        >{{customerDetails.stateString}}/{{customerDetails.releaseMark?'已发放佣金':'未发放佣金'}}</span>
      </div>
      <ul class="fl">
        <li>
          客户来源：
          <span class="self-info">{{customerDetails.customerSourceString}}</span>
        </li>
        <li>
          联系电话：
          <span class="self-info">{{customerDetails.contactNumber}}</span>
        </li>
        <li v-if="customerDetails.type == 3">
          转 入 人：
          <span
            class="self-info"
            :class="customerDetails.transferPerson?'':'el-icon-minus'"
          >{{customerDetails.transferPerson?customerDetails.transferPerson:''}}</span>
        </li>
        <li v-if="customerDetails.type == 3">
          联动专员：
          <span
            class="self-info"
            :class="customerDetails.associateCommissioner?'':'el-icon-minus'"
          >{{customerDetails.associateCommissioner?customerDetails.associateCommissioner:''}}</span>
        </li>
        <li>
          成 交 人：
          <span
            class="self-info"
            :class="customerDetails.traderName?'':'el-icon-minus'"
          >{{customerDetails.traderName?customerDetails.traderName:'' }}</span>
        </li>
        <li>
          结 算 人：
          <span
            class="self-info"
            :class="customerDetails.settlementPerson?'':'el-icon-minus'"
          >{{customerDetails.settlementPerson?customerDetails.settlementPerson:''}}</span>
        </li>
      </ul>
      <ul class="fl">
        <li>
          项目编号：
          <span class="self-info">{{customerDetails.projectNumber}}</span>
        </li>
        <li>
          项目名称：
          <span class="self-info">{{customerDetails.projectName}}</span>
        </li>
        <li>
          项目价格：
          <span class="self-info">{{customerDetails.projectPrice}} 元/平方</span>
        </li>
        <li>
          项目类型：
          <span class="self-info">{{customerDetails.projectTypeString}}</span>
        </li>
        <li>
          区域范围：
          <span class="self-info">{{customerDetails.regionalScope | formArea}}</span>
        </li>
        <li>
          项目地址：
          <span class="self-info">{{customerDetails.address}}</span>
        </li>
      </ul>
    </el-card>
    <el-tabs type="border-card" class="tab-switch">
      <!-- ================基本信息表单================ -->
      <el-tab-pane label="基本信息" class="base-info">
        <ul class="clearfix bar">
          <li
            class="itemBar"
            v-for="(item,index) in essentialInformation"
            :key="index"
            :class="{'on':item.view}"
            @click="showMessage(index)"
          >
            <p class="black-g">{{item.name}}</p>
            <em class="c-big">
              <em class="c-small"></em>
            </em>
            <p class="c-name">{{item.empName | formEmpName}}</p>
            <p class="c-time">{{ item.operateTime | formatTimeHead }}</p>
            <p class="c-time">{{ item.operateTime | formatTimeEnd}}</p>
            <div :class="{'sign':item.isShow}"></div>
          </li>
        </ul>
        <div class="content">
          <el-table
            :data="barData"
            style="width: 100%"
            class="el-table table-list"
            border
            :show-header="false"
          >
            <el-table-column prop="name" label="1" width="76"></el-table-column>
            <el-table-column label="2">
              <template slot-scope="scope">
                <div v-if="scope.row.name=='报备' || scope.row.name=='带看'">
                  <div
                    v-for="(item,index) in scope.row.viewDetails"
                    :key="index"
                    class="show-message"
                  >
                    <ul v-if="scope.row.name =='报备'">
                      <li>
                        {{scope.row.name}}时间：
                        <span class="bar-info">{{item.reportingTime}}</span>
                      </li>
                      <li>
                        审核驻场：
                        <span class="bar-info">{{item.auditResidence}}</span>
                      </li>
                      <li>
                        {{scope.row.name}}人员：
                        <span class="bar-info">{{item.newspaperClerk}}</span>
                      </li>
                      <li>
                        {{scope.row.name}}公司：
                        <span class="bar-info">{{item.companyTheaterName}}</span>
                      </li>
                      <li v-if="scope.row.name=='报备'">
                        客户情况：
                        <span class="bar-info">{{item.remark?item.remark:'暂无'}}</span>
                      </li>
                    </ul>
                    <ul v-if="scope.row.name=='带看'">
                      <li>
                        {{scope.row.name}}时间：
                        <span class="bar-info">{{item.takeTime}}</span>
                      </li>
                      <li>
                        审核驻场：
                        <span class="bar-info">{{item.auditResidence}}</span>
                      </li>
                      <li>
                        {{scope.row.name}}人员：
                        <span class="bar-info">{{item.watchPeople}}</span>
                      </li>
                      <li>
                        {{scope.row.name}}公司：
                        <span class="bar-info">{{item.lookCompany}}</span>
                      </li>
                    </ul>
                    <ul class="img-box" v-if="item.takeReceipt">
                      <!-- 当item.takeReceipt一条数据则不含“,”-->
                      <viewer v-show="(item.takeReceipt).indexOf(',') == -1" :images="Array.of(item.takeReceipt)">
                        <li>
                          <img
                            :src="Array.of(item.takeReceipt)"
                            class="info-img"
                            ref="showImg"
                            v-show="scope.row.name =='带看'"
                          >
                        </li>
                      </viewer>

                      <!-- 当item.takeReceipt不止一条数据-->
                      <viewer v-show="(item.takeReceipt).split(',').length > 1" :images="(item.takeReceipt).split(',')">
                        <li v-for="(item,index) in (item.takeReceipt).split(',')" :key="index">
                          <img
                            :src="item"
                            class="info-img"
                            ref="showImg1"
                            v-show="scope.row.name =='带看'"
                          >
                        </li>
                      </viewer>
                    </ul>
                  </div>
                </div>
                <div v-else class="show-message">
                  <ul>
                    <li>
                      合同姓名：
                      <span class="bar-info">{{scope.row.viewDetails.cust_name}}</span>
                    </li>
                    <li>
                      手机号码：
                      <span
                        class="bar-info"
                      >{{scope.row.viewDetails.cust_mobile | phoneFormatter}}</span>
                    </li>
                    <li>
                      身份证号：
                      <span class="bar-info">{{scope.row.viewDetails.cust_idcard}}</span>
                    </li>
                    <li v-if="scope.row.name == '认筹' || scope.row.name == '认购'">
                      {{scope.row.name}}金额：
                      <span
                        class="bar-info"
                      >{{scope.row.viewDetails.deal_pay}}元</span>
                    </li>
                    <li>
                      {{scope.row.name}}时间：
                      <span
                        class="bar-info"
                      >{{scope.row.viewDetails.deal_time}}</span>
                    </li>
                    <li v-if="scope.row.name == '认筹'">
                      截止日期：
                      <span
                        class="bar-info"
                        :class="scope.row.viewDetails.deal_deadline?'':'el-icon-minus'"
                      >{{scope.row.viewDetails.deal_deadline?scope.row.viewDetails.deal_deadline:''}}</span>
                    </li>
                    <li v-if="scope.row.name == '认筹'">
                      让利金额：
                      <span
                        class="bar-info"
                        :class="scope.row.viewDetails.deal_profit?'':'el-icon-minus'"
                      >{{scope.row.viewDetails.deal_profit?scope.row.viewDetails.deal_profit + '元':''}}</span>
                    </li>
                    <li>
                      {{scope.row.name == '认购'?'认购':'房屋'}}房号：
                      <span
                        class="bar-info"
                        :class="scope.row.viewDetails.house_no?'':'el-icon-minus'"
                      >{{scope.row.viewDetails.house_no?scope.row.viewDetails.house_no:''}}</span>
                    </li>
                    <li>
                      房屋面积：
                      <span
                        class="bar-info"
                        :class="scope.row.viewDetails.house_area?'':'el-icon-minus'"
                      >{{scope.row.viewDetails.house_area?scope.row.viewDetails.house_area + '平米':''}}</span>
                    </li>
                    <li>
                      房屋总价：
                      <span
                        class="bar-info"
                        :class="scope.row.viewDetails.house_price?'':'el-icon-minus'"
                      >{{scope.row.viewDetails.house_price?scope.row.viewDetails.house_price + '元':''}}</span>
                    </li>
                    <li>
                      成 交 人：
                      <span class="bar-info">{{scope.row.viewDetails.trader}}</span>
                    </li>
                  </ul>
                  <ul class="img-box" v-if="urlImg[0]">
                    <viewer :images="urlImg">
                      <li v-for="(item,index) in urlImg" :key="index" v-if="item != ''">
                        <img :src="item" class="info-img" ref="showImg">
                        <div class="mask" @click="clickWatchImg('showImg',index)">
                          <div class="ico-box">
                            <span class="font-btn">
                              <i class="icon icon-fangda"></i>
                            </span>
                          </div>
                        </div>
                      </li>
                    </viewer>
                  </ul>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <!-- ================收款信息================ -->
      <el-tab-pane label="收款信息" class="get-money">
        <div class="title">累计收佣</div>
        <el-table
          :data="accumulativeCommission"
          style="width: 100%"
          class="el-table table-list"
          border
          max-height="393"
        >
          <el-table-column label="序号" type="index" width="58"></el-table-column>
          <el-table-column prop="name" label="申请人" width="90" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="collect_comm_time"
            label="收佣日期"
            width="100"
            :formatter="dateFormatter"
          ></el-table-column>
          <el-table-column prop="commission_money" label="本次收佣"></el-table-column>
          <el-table-column prop="account_commission" label="累计收佣"></el-table-column>
          <el-table-column prop="raiming_commission" label="剩余佣金"></el-table-column>
          <el-table-column label="申请结果" width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.state == 8">待审核</div>
              <div v-if="scope.row.state == 9 || scope.row.state == 10">通过</div>
              <div v-if="scope.row.state == 11">驳回</div>
            </template>
          </el-table-column>
          <el-table-column prop="checkName" label="审核人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="reject_remark" label="审核备注" show-overflow-tooltip width="100"></el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- ================业绩分成================ -->
      <el-tab-pane label="业绩分成" class="settlement-share">
        <div v-for="(item,index) in performanceSplit" :key="index">
          <div class="title">
            <span>
              【{{item.bName}} {{item.houseNo}}】&nbsp;
              <i>
                平台收取费用
                <b>{{item.fee}}</b>元
              </i>
            </span>
            <span>
              第
              <span class="times">{{item.time}}</span>次结算
            </span>
          </div>
          <el-table
            :data="[item]"
            style="width: 100%"
            class="el-table table-list"
            border
            :show-header="false"
          >
            <el-table-column label="1" class-name="bgc">
              <template slot-scope="scope">
                <div>本次收佣</div>
              </template>
            </el-table-column>
            <el-table-column prop="commission_money" label="2" class-name="font-c"></el-table-column>
            <el-table-column prop=":" label="3" class-name="bgc">
              <template slot-scope="scope">
                <div>累计收佣</div>
              </template>
            </el-table-column>
            <el-table-column prop="account_commission" label="4" class-name="font-c"></el-table-column>
            <el-table-column prop=":" label="5" class-name="bgc">
              <template slot-scope="scope">
                <div>剩余佣金</div>
              </template>
            </el-table-column>
            <el-table-column prop="raiming_commission" label="6" class-name="font-c"></el-table-column>
          </el-table>
          <el-table
            :data="item.commissionList"
            style="width: 100%"
            class="el-table table-list"
            border
            :span-method="objectSpanMethod"
          >
            <el-table-column prop="e_character" label="分佣角色"></el-table-column>
            <el-table-column prop="e_name" label="参与分佣人员" show-overflow-tooltip></el-table-column>
            <el-table-column prop="dep_name" label="所在部门" show-overflow-tooltip></el-table-column>
            <el-table-column prop="money" label="结算金额"></el-table-column>
            <el-table-column label="分佣比例">
              <template slot-scope="scope">
                <div>{{scope.row.rate}}%</div>
              </template>
            </el-table-column>
            <el-table-column prop="checkName" label="结算人" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <!-- ================操作记录================ -->
      <el-tab-pane label="操作记录" class="operating-record">
        <el-table
          :data="operationRecord"
          style="width: 100%"
          class="mt10 table-list table-box"
          max-height="433"
        >
          <el-table-column prop="operationTime" label="操作时间" width="180"></el-table-column>
          <el-table-column prop="functionName" label="功能名称" width="100"></el-table-column>
          <el-table-column prop="operationContent" label="操作内容" show-overflow-tooltip></el-table-column>
          <el-table-column prop="operator" label="操作人" width="180" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { subStringNum } from "@/vendor/methods.js";
export default {
  data() {
    return { urlImg: [] };
  },
  computed: {
    // 客户详情
    customerDetails() {
      return this.infoData.customerDetails;
    },
    // 基本信息
    essentialInformation() {
      return this.infoData.essentialInformation;
    },
    // 收款信息
    accumulativeCommission() {
      this.infoData.accumulativeCommission.forEach(val => {
        // 收款信息---累计，剩余，本次收佣保留两位小数
        val.commission_money = subStringNum(val.commission_money, 2);
        val.account_commission = subStringNum(val.account_commission, 2);
        val.raiming_commission = subStringNum(val.raiming_commission, 2);
      });
      return this.infoData.accumulativeCommission;
    },
    // 业绩分成
    performanceSplit() {
      this.infoData.performanceSplit.forEach(val => {
        val.commissionList.forEach(ele => {
          // 收款信息---结算金额保留两位小数
          ele.money = subStringNum(ele.money, 2);
        });
      });
      return this.infoData.performanceSplit;
    },
    // 操作记录
    operationRecord() {
      return this.infoData.operationRecord;
    }
  },
  props: {
    // 详情数据
    infoData: {
      type: Object,
      default: {}
    },
    // 合同生命周期数据
    barData: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    }
  },
  methods: {
    // 点击显示不同进度详情
    showMessage(index) {
      if (!this.essentialInformation[index].view) return;
      this.infoData.essentialInformation.forEach(i => {
        this.$set(i, `isShow`, false);
      });
      this.$set(this.infoData.essentialInformation[index], `isShow`, true);
      this.$emit("changeBarData", this.infoData.essentialInformation[index]);
      // 带看图片转数组
      // console.log(this.infoData.essentialInformation[1].viewDetails);
      if (index == 1 && this.infoData.essentialInformation[1].viewDetails) {
        // this.infoData.essentialInformation[1].viewDetails.forEach(item => {
        // if (item.takeReceipt && item.takeReceipt.indexOf(",") != -1) {
        //   this.$set(item, "takeReceipt", item.takeReceipt.split(","));
        // } else {
        //   this.$set(item, "takeReceipt", item.takeReceipt);
        // }
        // item.takeReceipt = item.takeReceipt.split(",")
        // });
      }
      // 单据转数组
      if (
        index != 0 &&
        index != 1 &&
        this.infoData.essentialInformation[index].viewDetails
      ) {
        // let str = this.infoData.essentialInformation[index].viewDetails.cert;
        // if (str && str.indexOf(",") != -1) {
        //   this.$set(
        //     this.infoData.essentialInformation[index].viewDetails,
        //     "cert",
        //     str.split(",")
        //   );
        // } else {
        //   this.$set(
        //     this.infoData.essentialInformation[index].viewDetails,
        //     "cert",
        //     [str]
        //   );
        // }

        this.urlImg = this.infoData.essentialInformation[
          index
        ].viewDetails.cert.split(",");
      }
    },
    // 合并行方法
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // if (columnIndex === 5) {
      //   return {
      //     rowspan: 2,
      //     colspan: 1
      //   };
      // }
    },
    /**
     * 打开图片查看器
     */
    clickWatchImg(str, index) {
      this.$refs[str][index].click();
    },
    // 日期过滤
    dateFormatter(row, column, cellValue, index) {
      return cellValue.split(" ")[0];
    }
  },
  filters: {
    // 电话格式过滤
    phoneFormatter: function(val) {
      if (!val) {
        return "****";
      } else {
        return `${val.substr(0, 3)}****${val.substr(-4, 4)}`;
      }
    },
    // 区域范围过滤
    formArea: function(val) {
      return val
        .split(",")
        .splice(2, 2)
        .join(",");
    },
    // 生命周期节点人员过滤
    formEmpName: function(val) {
      if (val && val.indexOf("(") != -1) {
        return val.split("(")[0];
      } else {
        return val;
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

<style lang="scss" scoped>
/deep/ .el-table tr {
  height: 40px;
}
/deep/ .info-card {
  .el-card__body:after {
    content: ".";
    width: 0;
    height: 0;
    visibility: hidden;
    display: block;
    clear: both;
    overflow: hidden;
  }

  ul {
    width: 50%;
    color: #999;
    li {
      line-height: 30px;
      .self-info {
        color: #000;
        word-wrap: break-word;
      }

      .el-icon-minus {
        color: #72a0d1;
        font-size: 15px;
        vertical-align: middle;
        font-weight: 900;
      }
    }
  }
  .user-name {
    font-weight: bold;
    font-size: 22px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    .c-no {
      font-weight: normal;
      font-size: 14px;
      margin-left: 10px;
      color: #999;
    }
    .settle-type {
      font-size: 20px;
      color: #ff5438;
    }
  }
}
.tab-switch {
  .base-info {
    width: 100%;
    margin: 5px 0.3% 0 0;
    em {
      display: inline-block;
      border-radius: 50%;
    }

    .bar .itemBar {
      position: relative;
      float: left;
      width: 14%;
      text-align: center;
      cursor: pointer;

      .c-big {
        z-index: 3;
        position: relative;
        width: 32px;
        height: 32px;
        background: #dedede;
        text-align: center;
      }

      .c-small {
        margin-top: 5px;
        width: 21px;
        height: 21px;
        background: #9b9b9b;
      }

      .c-name {
        margin-top: 5px;
        font-size: 12px;
        line-height: 22px;
        height: 22px;
      }

      .c-time {
        color: #999;
        font-size: 12px;
        height: 22px;
      }

      .sign {
        position: relative;
        display: inline-block;
        margin-top: 15px;
        width: 0;
        height: 0;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        border-bottom: 15px solid #fd8f00;
      }
      &:before {
        z-index: 1;
        content: "";
        display: block;
        position: absolute;
        top: 35px;
        left: -60px;
        width: 100%;
        height: 2px;
        background: #9b9b9b;
      }

      &.on {
        .c-big {
          background: #ffdcb0;
        }

        .c-small {
          background: #fd8f00;
        }

        &:before {
          background: #fd8f00;
        }
      }

      &:first-child:before {
        background: none;
      }
    }

    /deep/ .content {
      width: 100%;
      margin-top: -4px;
      background-color: #eee;
      padding: 6px;
      .el-table__body-wrapper {
        max-height: 240px;
        overflow: auto;
      }
      .el-table td {
        border-right: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
      }
      .show-message {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 18px;
        position: relative;
        &:after {
          position: absolute;
          left: -12px;
          top: 110%;
          content: "";
          height: 1px;
          width: 105%;
          background-color: #ddd;
        }
        &:last-of-type {
          margin-bottom: 0;
        }
        li {
          list-style-type: disc;
          margin-left: 20px;
          float: none;
          text-align: left;
          line-height: 24px;
          color: #999;
          .bar-info {
            color: #666;
          }
        }
        ul {
          width: 300px;
        }
        .img-box {
          width: 340px;
          li {
            list-style: none;
            position: relative;
            float: left;
            margin-left: 7px;
            margin-top: 8px;
            .info-img {
              display: block;
              width: 100px;
              height: 74px;
              margin: 0 auto;
            }
            .mask {
              display: none;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(34, 34, 34, 0.6);
              .ico-box {
                line-height: 71px;
                text-align: center;
                .icon-fangda {
                  font-size: 22px;
                  color: #fff;
                }
              }
            }
            &:hover {
              .mask {
                display: block;
              }
            }
          }
        }
      }
    }
  }
  .get-money {
    .title {
      color: #333;
      font-weight: bold;
      font-size: 14px;
      line-height: 50px;
    }
  }
  /deep/ .settlement-share {
    // max-height: 435px;
    // overflow: scroll;
    .title {
      color: #333;
      line-height: 50px;
      font-weight: bold;
      font-size: 17px;
      display: flex;
      justify-content: space-between;
      .times {
        color: #ff5438;
        font-size: 18px;
        font-size: 14px;
      }
      i {
        font-weight: normal;
        font-size: 14px;
        > b {
          color: red;
        }
      }
    }
    .bgc {
      background-color: #eee;
    }
    .font-c {
      color: #ff5438;
      font-weight: bold;
    }
    .el-table {
      margin-bottom: 24px;
      tr {
        height: 45px;
      }
    }
  }
}
/deep/.table-list .cell {
  white-space: normal;
}
</style>


