<template>
  <div>
    <!-- 内容的头部部分 -->
    <div id="heard">
      <div>
        <span :class="first_showPoup || second_showPoup ||third_showPoup ?'activeColor':''">确认结算信息</span>
        <span :class="second_showPoup||third_showPoup?'activeColor':''">确认成交信息</span>
        <span :class="third_showPoup?'activeColor':''">业绩结算</span>
      </div>
      <p v-if="first_showPoup">
        <i class="el-icon-info"></i>请确认客户及结算信息，确认无误点击下一步，确认后无法修改
      </p>
      <p v-if="second_showPoup">
        <i class="el-icon-info"></i>请确认成交人信息，并且设置平台费，确认无误点击下一步，确认后无法修改
      </p>
      <p v-if="third_showPoup">
        <i class="el-icon-info"></i>分佣比例之和必须等于100%，设置结算人及业绩/佣金后，点击提交
      </p>
    </div>
    <!-- 审核结算第一个弹出层 -->
    <div id="first_settle" v-show="first_showPoup">
      <div>
        <h3>基本资料</h3>
        <div>
          <span>
            <i>客户名称:</i>
            <b>{{customer_info.cName}}</b>
          </span>
          <span>
            <i>成交项目:</i>
            <b>{{customer_info.bName}}【{{customer_info.project_number}}】</b>
          </span>
        </div>
        <div>
          <span>
            <i>客户编号:</i>
            <b
              :class="customer_info.c_no?'':'el-icon-minus'"
            >{{customer_info.c_no?customer_info.c_no:""}}</b>
          </span>
          <span>
            <i>项目公司:</i>
            <b
              :class="customer_info.depName?'':'el-icon-minus'"
            >{{customer_info.depName?customer_info.depName:""}}</b>
          </span>
        </div>
        <div>
          <span>
            <i>联系电话:</i>
            <b
              :class="customer_info.phone?'':'el-icon-minus'"
            >{{customer_info.phone?customer_info.phone:""}}</b>
          </span>
          <span>
            <i>项目价格:</i>
            <b v-if="customer_info.building_price !==''">{{customer_info.building_price}}元/平方</b>
            <b v-else class="el-icon-minus"></b>
          </span>
        </div>
        <div>
          <span>
            <i>客户来源:</i>
            <b
              :class="customer_info.source?'':'el-icon-minus'"
            >{{customer_info.source?customer_info.source:""}}</b>
          </span>
          <span>
            <i>项目地址:</i>
            <b
              :class="customer_info.address?'':'el-icon-minus'"
            >{{customer_info.address?customer_info.address:""}}</b>
          </span>
        </div>
      </div>
      <!-- 结算信息 -->
      <div>
        <h3>结算信息</h3>
        <div>
          <span>
            <i>合同姓名:</i>
            <b
              :class="settlement_info.cust_name?'':'el-icon-minus'"
            >{{settlement_info.cust_name?settlement_info.cust_name:""}}</b>
          </span>
          <span>
            <i>手机号码:</i>
            <b
              :class="settlement_info.cust_mobile?'':'el-icon-minus'"
            >{{settlement_info.cust_mobile?settlement_info.cust_mobile:""}}</b>
          </span>
        </div>
        <div>
          <span>
            <i>成交日期:</i>
            <b
              :class="settlement_info.deal_time?'':'el-icon-minus'"
            >{{settlement_info.deal_time?settlement_info.deal_time:""}}</b>
          </span>
          <span>
            <i>房屋面积:</i>
            <b v-if="settlement_info.house_area">{{settlement_info.house_area}}平米</b>
            <b v-else class="el-icon-minus"></b>
          </span>
        </div>
        <div>
          <span>
            <i>房屋号码:</i>
            <b
              :class="settlement_info.house_no !== ''?'':'el-icon-minus'"
            >{{settlement_info.house_no !== ''?settlement_info.house_no:""}}</b>
          </span>
          <span>
            <i>房屋总价:</i>
            <b v-if="settlement_info.house_price">{{settlement_info.house_price}}元</b>
            <b v-else class="el-icon-minus"></b>
          </span>
        </div>
        <div>
          <span>
            <i>收佣日期:</i>
            <b
              :class="settlement_info.collect_comm_time?'':'el-icon-minus'"
            >{{settlement_info.collect_comm_time?settlement_info.collect_comm_time:""}}</b>
          </span>
          <span>
            <i>应收佣金:</i>
            <b
              v-if="settlement_info.expected_commision !==''"
            >{{settlement_info.expected_commision}}元</b>
            <b v-else class="el-icon-minus"></b>
          </span>
        </div>
        <div>
          <span>
            <i>本次收佣:</i>
            <b v-if="settlement_info.commission_money !==''">{{settlement_info.commission_money}}元</b>
            <b v-else class="el-icon-minus"></b>
          </span>
          <span>
            <i>剩余佣金:</i>
            <b v-if="settlement_info.remaining_account !==''">{{settlement_info.remaining_account}}元</b>
            <b v-else class="el-icon-minus"></b>
          </span>
        </div>

        <div class="clearfix">
          <i class="fl">认购单据:</i>
          <viewer :images="settlement_info.voucher">
            <div class="architectural clearfix">
              <img
                v-for="(item,picIndex) in settlement_info.voucher"
                :src="item"
                @click="clickProject_Img('showImg_',picIndex)"
                :ref="'showImg_'"
                alt
              >
            </div>
          </viewer>
        </div>
      </div>
    </div>
    <!-- 审核结算第二个弹出层 -->
    <div id="second_settle" v-show="second_showPoup">
      <div>
        <h3>成交信息</h3>
        <div>
          <span>
            <i>成交驻场：</i>
            <b>{{settlement_commission.zName}}</b>
          </span>
          <span>
            <i>驻场电话：</i>
            <b>{{settlement_commission.zMobile}}</b>
          </span>
        </div>
        <div>
          <!-- type == 1 为新房 type ==2 为U+-->
          <span v-if="settlement_commission.type == 1">
            <i>成 交 人：</i>
            <b>{{settlement_commission.pc_name}}（{{settlement_commission.dep_name}}）</b>
          </span>
          <span v-if="settlement_commission.type == 2">
            <i>成 交 人：</i>
            <b>{{settlement_commission.pc_name}}（{{settlement_commission.dep_name}}--{{settlement_commission.warName}}）</b>
          </span>
          <span>
            <i>手机号码：</i>
            <b>{{settlement_commission.deal_mobile}}</b>
          </span>
        </div>
        <div v-if="settlement_commission.linkage_name">
          <span>
            <i>联动专员：</i>
            <b>{{settlement_commission.linkage_name}}（{{settlement_commission.linkage_dep_name}}）</b>
          </span>
          <span>
            <i>联动电话：</i>
            <b>{{settlement_commission.linkage_mobile}}</b>
          </span>
        </div>
      </div>
      <!-- 内容的累计收佣部分 -->
      <div>
        <h3>累计收佣</h3>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="number" label="序号" width="60">
            <template slot-scope="scope">
              <div>{{scope.$index+1}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="申请人" width="90"></el-table-column>
          <el-table-column prop="collect_comm_time" label="收佣日期" width="100"></el-table-column>
          <el-table-column prop="commission_money" label="本次收佣" width="100"></el-table-column>
          <el-table-column prop="account_commission" label="累计收佣" width="90"></el-table-column>
          <el-table-column prop="raiming_commission" label="剩余佣金" width="90"></el-table-column>
          <el-table-column prop label="申请结果" width="130">
            <template slot-scope="scope">
              <!-- <div
                :class="(scope.row.application_result=='通过')?'through':(scope.row.application_result=='待审核')?'reject':(scope.row.application_result=='驳回')?'Pending_review':''"
              >{{scope.row.application_result}}</div>-->
              <div v-if="scope.row.state == 9 || scope.row.state == 10" class="reject">通过</div>
              <div v-if="scope.row.state == 8" class="through">待审核</div>
              <div v-if="scope.row.state == 11" class="Pending_review">驳回</div>
            </template>
          </el-table-column>
          <el-table-column prop="checkName" label="审核人" width="90"></el-table-column>
          <el-table-column prop="reject_remark" label="审核备注" width="140" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <!-- 合同图片 -->
      <div>
        <h3>合同备注</h3>
        <div class="clearfix">
          <span class="fl">备注说明:</span>
          <span
            class="fl"
          >&nbsp;&nbsp;{{this.settlement_commission.remarks ? this.settlement_commission.remarks : "无"}}</span>
        </div>
        <div class="clearfix">
          <span class="fl">合同图片:</span>
          <span class="fl imgContract" v-if="imgContract[0]">
            <viewer :images="imgContract">
              <div class="architectural">
                <img
                  v-for="(item,picIndex) in imgContract"
                  :src="item"
                  @click="clickProject_Img('showImg_',picIndex)"
                  :ref="'showImg_'"
                  alt
                >
              </div>
            </viewer>
          </span>
          <span v-else>无</span>
        </div>
      </div>
      <!-- 内容的平台费部分 -->
      <div>
        <h3>平台费</h3>
        <div class="clearfix">
          <span>
            <i>费用占比:</i>
            <b>
              <input type="number" @input="oninput1" v-model="model1">%
            </b>
          </span>
          <span>
            <i>本次费用:</i>
            <b>
              <input type="number" @input="oninput2" v-model="model2">
            </b>
          </span>
          <span>
            <i>实际返佣:</i>
            <b>
              <input type="number" v-model="model3" readonly>
            </b>
          </span>
        </div>
      </div>
    </div>
    <!-- 审核结算第三个弹出层 -->
    <div id="third_settle" v-show="third_showPoup">
      <!-- 内容的中间部分 -->
      <div>
        <!-- 最新的一次结算 -->
        <div>
          <h3>
            【{{thirdNewInfo.bName}}&nbsp;&nbsp;{{thirdNewInfo.houseNo}}】
            <div class="fr">
              第
              <i>{{thirdNewInfo.time}}</i>
              次结算
            </div>
          </h3>
          <!-- 第一个佣金表 -->
          <div>
            <div class="clearfix">
              <span>应收总佣</span>
              <span>{{thirdNewInfo.expected_commision}}</span>
              <span>累计收佣</span>
              <span>{{thirdNewInfo.account_commission}}</span>
              <span>剩余佣金</span>
              <span>{{thirdNewInfo.raiming_commission}}</span>
            </div>
            <div class="clearfix">
              <span>本次收佣</span>
              <span>{{thirdNewInfo.commission_money}}</span>
              <span>平台费</span>
              <span>{{new_thirdNewInfo_free}}</span>
              <span>实际返佣</span>
              <span>{{new_thirdNewInfo_actualCommission}}</span>
            </div>
          </div>
          <!-- 角色表 -->
          <el-table :data="third_settle_arr" border style="width: 100%; margin-top:20px;">
            <el-table-column label="分佣角色">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.role"
                  placeholder="请选择"
                  @change="optionsChange(scope)"
                >
                  <el-option
                    v-for="list in options"
                    :key="list.key"
                    :label="list.value?list.value:'——'"
                    :value="list"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="参与分佣人员">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.name"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请选择"
                  @clear="clearable(scope)"
                  :remote-method="getLevel(scope)"
                  @change="commissionsChang(scope)"
                >
                  <el-option
                    v-for="(list,index) in third_settle_arr[scope.$index].commissions"
                    :key="index"
                    :label="list.eName?list.eName:'暂无'"
                    :value="list.eId+','+list.depName+','+list.depId+','+list.type+','+list.eName"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="menbers" label="所在部门">
              <template slot-scope="scope">{{scope.row.menbers}}</template>
            </el-table-column>
            <el-table-column label="分佣金额">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.part"
                  placeholder="请输入金额"
                  @change="oninput3(scope.row)"
                  @focus="focus3"
                  oninput="value=value.match(/^\d*(\.?\d{0,2})/g)[0] || null"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="分佣比例">
              <template slot-scope="scope">
                <el-input
                  placeholder="请输入比例"
                  v-model="scope.row.amount"
                  @focus="focus3"
                  @change="oninput4(scope.row)"
                  oninput="value=value.match(/^\d*(\.?\d{0,2})/g)[0] || null"
                ></el-input>
                <span class="distributionRatio">%</span>
              </template>
            </el-table-column>
            <el-table-column prop="radio" label="操作">
              <template slot-scope="scope">
                <div class="add_dell" @click="third_add">新增</div>
                <div class="add_dell" v-if="scope.$index !=0" @click="third_dell(scope.$index)">删除</div>
              </template>
            </el-table-column>
          </el-table>
          <!-- <div>剩余佣金比例{{residualRatio}}</div> -->
        </div>
        <!-- 历史佣金 -->
        <div v-for="(item,key) in historyNewInfo" v-if="key !=0" class="historyNewInfo">
          <h3>
            【{{item.bName}}&nbsp;&nbsp;{{item.houseNo}}】
            <div class="fr">
              第
              <i>{{item.time}}</i>
              次结算
            </div>
          </h3>
          <!-- 历史佣金表 -->
          <div>
            <div class="clearfix">
              <span>应收总佣</span>
              <span>{{item.expected_commision}}</span>
              <span>累计收佣</span>
              <span>{{item.account_commission}}</span>
              <span>剩余佣金</span>
              <span>{{item.raiming_commission}}</span>
            </div>
            <div class="clearfix">
              <span>本次收佣</span>
              <span>{{item.commission_money}}</span>
              <span>平台费</span>
              <span>{{item.fee}}</span>
              <span>实际返佣</span>
              <span>{{item.actualCommission}}</span>
            </div>
          </div>
          <!-- 历史角色表 -->
          <el-table
            :data="item.commissionList"
            :span-method="objectSpanMethod"
            border
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column prop="e_character" label="分佣角色" width="180"></el-table-column>
            <el-table-column prop="e_name" label="参与分佣人员"></el-table-column>
            <el-table-column prop="dep_name" label="所在部门"></el-table-column>
            <el-table-column prop="money" label="分佣金额"></el-table-column>
            <el-table-column prop="rate" label="分佣比例"></el-table-column>
            <el-table-column label="结算人">
              <template slot-scope="scope">
                <div style="display:block;width:100%;">{{scope.row.checkName}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 按钮下一步 -->
    <div id="button" class="clearfix">
      <div class="fl" @click="turnDown">驳回</div>
      <div v-if="!first_showPoup" class="fl" @click="Previous">上一步</div>
      <div v-if="!third_showPoup" class="fl" @click="nextStep">下一步</div>
      <div v-if="third_showPoup" class="fl" @click="submit">提交</div>
    </div>
  </div>
</template>

<script>
import {
  getSettlementFristDetail,
  getSettlementCommission,
  getSettlementPerformance,
  getSettlementdictionary,
  getSettlementemployee,
  getSettlementSubmit
} from "@/api/index";
import { subStringNum } from "@/vendor/methods.js";
let part_sum = 0,
  amount_sum = 0;
export default {
  props: ["reviewSettlement"],
  data() {
    return {
      tableData: [], //第二个弹框--累计收佣
      model1: "",
      model2: "",
      model3: "",
      pendingReview: 20000, //当前待审核的本次收佣
      first_showPoup: true, //第一个弹出层
      second_showPoup: false, //第二个弹出层
      third_showPoup: false, //第三个弹出层
      choseID: this.reviewSettlement.id, //选择的ID
      // 第一个弹出层---客户信息
      customer_info: {},
      // 第二个弹出层---客户信息
      settlement_commission: {},
      // 第二个弹出层---合同图片
      imgContract: [],
      // 第一个弹出层---结算信息
      settlement_info: {},
      third_settle_arr: [
        {
          role: "",
          menbers: "",
          part: "",
          amount: "",
          radio: "",
          commissions: []
        }
      ], //第三个弹出层 -- 增删项
      value: "",
      options: [], //第三个弹出层 -- 分佣角色
      commissions: [], //第三个弹出层 -- 分佣人员
      historyNewInfo: [], //历史分佣
      thirdNewInfo: {}, //第三个弹出层---最新的信息
      new_thirdNewInfo_free: "",
      new_thirdNewInfo_actualCommission: ""
      // residualRatio: "" //剩余佣金比例
    };
  },
  created() {
    this.getFristData();
    this.getcommission();
    this.getPerformance();
  },
  methods: {
    oninput1(e) {
      // 通过正则过滤小数点后两位
      this.model1 = this.model1.match(/^\d*(\.?\d{0,2})/g)[0] || null;
      //   如果输入的占比大于1，则让它等于1
      if (this.model1 / 100 >= 1) {
        this.model1 = 100;
      }
      this.model2 = subStringNum((this.model1 / 100) * this.pendingReview, 2);
      this.model3 = subStringNum(
        (1 - this.model1 / 100) * this.pendingReview,
        2
      );
    },
    oninput2() {
      // 通过正则过滤小数点后两位
      this.model2 = this.model2.match(/^\d*(\.?\d{0,2})/g)[0] || null;
      //   如果输入的本次费用大于总的本次收佣，则让它等于本次收佣
      if (this.model2 >= this.pendingReview) {
        this.model2 = this.pendingReview;
      }
      console.log(this.model2);
      console.log((this.model2 * 100) / this.pendingReview);
      if (this.pendingReview === 0) {
        this.model1 = 0;
      } else {
        this.model1 = subStringNum((this.model2 * 100) / this.pendingReview, 2);
      }
      this.model3 = subStringNum(this.pendingReview - this.model2, 2);
    },
    // 驳回
    turnDown() {
      let turnDownInfo = {
        status: true,
        orderId: this.choseID
      };
      this.$emit("turn_down", turnDownInfo);
    },
    // 上一步
    Previous() {
      // 再第二页
      if (this.second_showPoup) {
        // 清空第二页输入的数据
        this.model1 = "";
        this.model2 = "";
        this.model3 = "";
        this.first_showPoup = true;
        this.second_showPoup = false;
        this.third_showPoup = false;
      } else if (this.third_showPoup) {
        // 清空第三步已经填写的数据

        this.third_settle_arr.forEach(val => {
          val.part = "";
          val.amount = "";
        });
        console.log("秦星星修");
        console.log(this.third_settle_arr);
        this.first_showPoup = false;
        this.second_showPoup = true;
        this.third_showPoup = false;
      }
    },
    // 下一步
    nextStep() {
      // 在第一页

      if (this.first_showPoup) {
        this.first_showPoup = false;
        this.third_showPoup = false;
        this.second_showPoup = true;
      } else if (this.second_showPoup) {
        // 在第二步步填写平台费用不进行第三部操作
        console.log(this.model1);
        if (this.model1 !== "" && this.model2 !== "" && this.model3 !== "") {
          this.first_showPoup = false;
          this.second_showPoup = false;
          this.third_showPoup = true;
          this.new_thirdNewInfo_free = this.model2;
          this.new_thirdNewInfo_actualCommission = this.model3;
        } else {
          this.alertMessage("warning", "请填写正确的平台费用", 2000);
          return false;
        }
      }
    },
    // 提交
    submit() {
      let commissionFormArr = [];
      let objSubmitRate = 0,
        objSubmitMoney = 0;
      if (!this.third_settle_arr[0].menbers) {
        //没选分佣角色
        this.alertMessage("warning", "请完善分佣角色", 2000);
        return false;
      }
      this.third_settle_arr.forEach(val => {
        let objSubmit = {};
        if (val.role.key && val.name && val.amount !== "") {
          objSubmit.pcPlatform = Number(val.name.split(",")[3]); //属于哪个系统：0=本系统，1=U+系统
          objSubmit.eCharacter = val.role.key; //分佣角色
          objSubmit.eId = Number(val.name.split(",")[0]); //员工id
          objSubmit.eName = val.name.split(",")[4]; //员工姓名
          objSubmit.depId = Number(val.name.split(",")[2]); //部门id
          objSubmit.depName = val.name.split(",")[1]; //部门名称
          objSubmit.rate = Number(val.amount); //佣金比例
          objSubmit.money = Number(val.part); //分佣金额
          commissionFormArr.push(objSubmit);
          objSubmitRate += Number(val.amount); //总共的佣金比例
          objSubmitMoney += Number(val.part); //总共的佣金金额
        } else {
          objSubmitRate = "";
        }
      });
      console.log(objSubmitRate);
      objSubmitRate = subStringNum(objSubmitRate, 4);
      if (objSubmitRate === "") {
        this.alertMessage("warning", "请完善分佣比例", 2000);
        return false;
      }
      console.log(objSubmitRate);
      if (objSubmitRate > 100) {
        this.alertMessage("warning", "分佣比例之和超过100", 2000);
        return false;
      }
      if (objSubmitMoney > this.model3) {
        this.alertMessage("warning", "分佣金额不得超过" + this.model3, 2000);
        return false;
      }
      getSettlementSubmit({
        settlementId: this.choseID, //结算id
        expectedCommision: this.thirdNewInfo.expected_commision, //应收佣金
        accountCommission: this.thirdNewInfo.account_commission, //累计收佣
        percent: this.model1, //平台费用占比
        cost: this.model2, //平台费用
        remainingCommission: this.model3, //实际返佣
        commissionForm: commissionFormArr
      }).then(res => {
        if (res.status == 200) {
          this.alertMessage("success", "提交成功", 2000);
          this.$emit("closeReviewSettlement", false);
        } else {
          this.alertMessage("warning", res.message, 2000);
        }
      });
    },
    // 放大图片
    clickProject_Img() {},
    // 第一个弹出层交互
    getFristData() {
      getSettlementFristDetail({ params: { id: this.choseID } }).then(res => {
        if (res.status == 200) {
          this.customer_info = res.data.customerInfo; //第一个弹出层---客户信息
          this.settlement_info = res.data.settlement; //第一个弹出层---结算信息
        }
      });
    },

    // 第二个弹出层交互
    getcommission() {
      getSettlementCommission({ params: { id: this.choseID } }).then(res => {
        if (res.status == 200) {
          this.settlement_commission = res.data; //第二个弹框--成交信息
          this.tableData = res.data.commissionList; //第二个弹框--累计收佣
          this.imgContract = res.data.accounting_cert.split(","); //第二个弹框--合同
          this.pendingReview = this.tableData[
            this.tableData.length - 1
          ].commission_money;
        }
      });
    },
    // 第三个弹出层的业务逻辑
    getPerformance() {
      getSettlementPerformance({ params: { id: this.choseID } }).then(res => {
        if (res.status == 200) {
          this.thirdNewInfo = res.data[0]; //最新的一次
          this.historyNewInfo = res.data; //历史分佣
          this.getCharacter();
        }
      });
    },
    // 分佣角色
    getCharacter() {
      getSettlementdictionary({ params: { parentId: 513 } }).then(res => {
        if (res.status == 200) {
          // type == 1是U+ 0为新房
          if (this.thirdNewInfo.type == 1) {
            res.data.children.forEach(element => {
              if (element.key == 8 || element.key == 9) {
                this.options.push(element);
              }
            });
          } else if (this.thirdNewInfo.type == 0) {
            res.data.children.forEach(element => {
              if (element.key != 8 && element.key != 9) {
                this.options.push(element);
              }
            });
          }
        }
      });
    },

    // 分佣角色发生改变的时候 --- 出现参与分佣的，val分佣角色的ID
    optionsChange(val, keywordVal) {
      getSettlementemployee({
        params: {
          type: val.row.role.key,
          settlementId: this.choseID,
          keyword: keywordVal
        }
      }).then(res => {
        if (res.status == 200) {
          val.row.commissions = res.data;
        }
      });
    },

    //参与分佣人员发生改变
    commissionsChang(val) {
      let menbersArr = val.row.name.split(",");
      val.row.menbers = menbersArr[1]; //参与分佣人员发生改变 让所在部门也发生改变
    },
    // 搜索分佣人员
    getLevel(val) {
      return str => {
        if (str) this.optionsChange(val, str);
      };
    },
    // 清空分佣人员
    clearable(val) {
      this.optionsChange(val);
    },
    // 点击增加
    third_add() {
      let obj = {
        role: "",
        menbers: "",
        part: "",
        amount: "",
        radio: "",
        commissions: []
      };
      this.third_settle_arr.push(obj);
    },
    // 点击删除
    third_dell(index) {
      this.third_settle_arr.splice(index, 1);
    },
    // 输入金额

    oninput3(val) {
      console.log(this.model3);
      if (this.model3 === 0) {
        val.amount = 0;
      } else {
        val.amount = subStringNum((val.part * 100) / this.model3, 2);
      }
      this.third_settle_arr.forEach((element, index) => {
        part_sum += Number(element.part); //输入的总金额
        amount_sum += Number(element.amount); //输入的总比例
      });
    },
    oninput4(val) {
      val.part = subStringNum((val.amount / 100) * this.model3, 2);

      this.third_settle_arr.forEach((element, index) => {
        part_sum += Number(element.part); //输入的总金额
        amount_sum += Number(element.amount); //输入的总比例
      });
    },
    focus3() {},
    // 历史佣金合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 5) {
        return {
          rowspan: 10000,
          colspan: 1
        };
      }
    }
  },
  watch: {
    reviewSettlement(val) {
      this.choseID = val.id;
      this.getFristData();
      this.getcommission();
      this.getPerformance();
    }
  }
};
</script>

<style lang='scss' scoped>
.el-icon-minus {
  color: #72a0d1;
  font-size: 15px;
  vertical-align: middle;
  font-weight: 900;
}
// 去掉默认的number样式
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
input[type="number"] {
  -moz-appearance: textfield;
}
/* 审核结算第一个弹出层 CSS */
#heard {
  margin: 0 auto;
  width: 500px;
  > div {
    height: 55px;
    line-height: 55px;
    display: -webkit-flex;
    display: flex;
    display: -webkit-box;
    display: -ms-flexbox; /* TWEENER - IE 10 */
    > span {
      display: block;
      -ms-flex: 1; /* IE 10 */
      -webkit-flex: 1;
      flex: 1;
      -webkit-box-flex: 1;
      -moz-box-flex: 1;
      -ms-flex: 1;
      text-align: center;
      position: relative;
      background-color: #ececec;
      margin-right: 10px;
      &::after {
        content: "";
        width: 0;
        height: 0;
        border-left: 20px solid #ececec;
        border-top: 28px solid transparent;
        border-bottom: 25px solid transparent;
        position: absolute;
        top: 0;
        right: -20px;
        z-index: 2;
      }

      &::before {
        content: "";
        width: 0;
        height: 0;
        border-left: 20px solid #fff;
        border-top: 28px solid transparent;
        border-bottom: 25px solid transparent;
        position: absolute;
        top: 0;
        left: 0px;
        z-index: 1;
      }
      &:nth-of-type(1) {
        &::before {
          content: "";
          width: 0;
          height: 0;
          border: 0;
          position: absolute;
          top: 0;
          left: 0px;
          z-index: 1;
        }
      }
      &:nth-last-of-type(1) {
        margin-right: 0;
        &::after {
          content: "";
          width: 0;
          height: 0;
          border: 0;
          position: absolute;
          top: 0;
          right: 0;
          z-index: 2;
        }
      }
    }
    > .activeColor {
      background-color: #47af6e;
      color: #fff;
      &::after {
        content: "";
        width: 0;
        height: 0;
        border-left: 20px solid #47af6e;
        border-top: 28px solid transparent;
        border-bottom: 25px solid transparent;
        position: absolute;
        top: 0;
        right: -20px;
        z-index: 2;
      }
    }
  }
  > p {
    color: red;
    margin-top: 10px;
    > .el-icon-info {
      color: #5a9ef2;
      font-size: 17px;
      margin-right: 5px;
    }
  }
}
#first_settle {
  width: 100%;
  > div {
    padding: 10px;
    margin-top: 20px;
    > h3 {
      font-weight: 600;
      margin-bottom: 10px;
    }
    > div {
      padding-left: 10px;
      // height: 35px;
      line-height: 25px;
      > span {
        display: inline-block;
        width: 420px;
        padding: 5px 0;
        color: #333;
        position: relative;
        > i {
          color: #666;
          margin-right: 5px;
          position: absolute;
          top: 5px;
          left: 0;
        }
        > b {
          font-weight: normal;
          word-break: break-all;
          margin-left: 70px;
          display: inline-block;
          width: 80%;
        }
        &:nth-of-type(2) {
          float: right;
        }
      }
    }
    &:nth-of-type(2) {
      margin-bottom: 10px;
      > div {
        &:nth-last-of-type(1) {
          height: auto;
          margin-top: 10px;
          i {
            color: #666;
          }
          img {
            float: left;
            width: 80px;
            height: 80px;
            margin-left: 10px;
            &:nth-of-type(10n) {
              margin-left: 70px;
            }
            &:nth-of-type(n + 10) {
              margin-top: 10px;
            }
          }
        }
      }
    }
  }
}
#second_settle {
  width: 100%;
  > div {
    //  内容的资料部分
    &:nth-of-type(1) {
      padding: 10px;
      margin-top: 20px;
      > h3 {
        font-weight: 600;
        margin-bottom: 10px;
      }
      > div {
        padding-left: 10px;
        // height: 35px;
        line-height: 25px;
        > span {
          display: inline-block;
          width: 420px;
          padding: 5px 0;
          color: #333;
          position: relative;
          > i {
            color: #666;
            margin-right: 5px;
            position: absolute;
            top: 5px;
            left: 0;
          }
          > b {
            font-weight: normal;
            word-break: break-all;
            margin-left: 70px;
            display: inline-block;
            width: 80%;
          }
          &:nth-of-type(2) {
            float: right;
          }
        }
      }
    }

    //  内容的累计收佣部分
    &:nth-of-type(2) {
      margin-top: 10px;
      padding: 10px;
      > h3 {
        font-weight: 600;
        margin-bottom: 10px;
      }
      /deep/ .el-table__row {
        color: #666;
      }
      .through {
        color: red;
      }
      .reject {
        color: yellowgreen;
      }
      .Pending_review {
        color: blue;
      }
    }
    &:nth-of-type(3) {
      margin-top: 10px;
      padding: 10px;
      > h3 {
        font-weight: 600;
        margin-bottom: 10px;
      }
      > .clearfix {
        margin-top: 10px;
        position: relative;
        > span {
          &:nth-of-type(1) {
            color: #666;
            font-size: 15px;
            width: 8%;
          }
          &:nth-of-type(2) {
            width: 90%;
          }
        }
        > .imgContract {
          left: 65px;
        }
      }
      img {
        float: left;
        width: 100px;
        height: 100px;
        margin-left: 10px;
        &:nth-of-type(7n-6) {
          margin-left: 0;
        }
        &:nth-of-type(n + 8) {
          margin-top: 10px;
        }
      }
    }
    // 内容的平台费部分
    &:nth-of-type(4) {
      margin-top: 10px;
      padding: 10px;
      > h3 {
        font-weight: 600;
        margin-bottom: 20px;
      }
      > div {
        padding-left: 25px;
        span {
          float: left;
          color: #666;
          margin-right: 40px;
          > b {
            border: 1px solid #d0d0d0;
            padding: 0 10px;
            height: 30px;
            width: 110px;
            display: inline-block;
            border-radius: 3px;
            margin-left: 5px;
            > input {
              width: 70px;
              height: 28px;
            }
            /** 去除input输入框样式 */
            input[type="number"]::-webkit-inner-spin-button {
              -webkit-appearance: none;
            }
            .number__input {
              border: 1px solid #ccc;
            }
          }
        }
      }
    }
  }
}
#third_settle {
  width: 100%;
  > div {
    // 内容的中间部分
    &:nth-of-type(1) {
      padding: 10px;
      margin-top: 20px;
      // 最新的一次结算
      > div {
        padding: 10px;
        > h3 {
          font-weight: 600;
          i {
            color: red;
          }
        }
        > div {
          // 第一个佣金表
          &:nth-of-type(1) {
            margin-top: 10px;
            > div {
              span {
                float: left;
                width: 16.6%;
                height: 40px;
                line-height: 40px;
                text-align: center;
                border: 1px solid #d0d0d0;
                border-right: 0;
                border-bottom: 0;
                &:nth-last-of-type(1) {
                  border-right: 1px solid #d0d0d0;
                }
                &:nth-of-type(odd) {
                  background-color: #eeeeee;
                  color: #333;
                }
                &:nth-of-type(even) {
                  color: #ff5438;
                  font-weight: 600;
                }
              }
              &:nth-last-of-type(1) {
                span {
                  border-bottom: 1px solid #d0d0d0;
                }
              }
            }
          }
        }
        /deep/ .el-table {
          th,
          td {
            border-right: 1px solid #eee;
            padding: 5px 0;
          }
          td {
            &:nth-last-of-type(1) {
              .cell {
                text-align: center;
                display: -webkit-flex;
                display: flex;
                display: -webkit-box;
                display: -ms-flexbox; /* TWEENER - IE 10 */
                > .add_dell {
                  -ms-flex: 1; /* IE 10 */
                  -webkit-flex: 1;
                  flex: 1;
                  -webkit-box-flex: 1;
                  -moz-box-flex: 1;
                  -ms-flex: 1;
                  color: #3292f5;
                  cursor: pointer;
                }
              }
            }
            &:nth-of-type(5) {
              > .cell {
                position: relative;
                > .distributionRatio {
                  position: absolute;
                  top: 5px;
                  right: 18px;
                }
              }
            }
          }
          tr {
            height: 40px;
            .el-input__inner {
              height: 34px;
            }
            .el-input__icon {
              line-height: 0;
            }
          }
        }
        /deep/ .el-table__body tr:hover {
          background-color: transparent;
        }
      }
    }
    // 历史
    .historyNewInfo {
      border: 1px solid #eee;
      padding: 2px;
      margin-top: 5px;
    }
  }
}
#button {
  width: 400px;
  margin: 30px auto 0;
  cursor: pointer;
  > div {
    width: 105px;
    height: 40px;
    line-height: 40px;
    border-radius: 5px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    background-color: #fd8f00;
    margin-left: 30px;
    &:nth-of-type(1) {
      margin-left: 0;
      background-color: #ff5a4c;
    }
  }
}
</style>
