<!-- 新房收款 -->
<template>
  <div>
    <!-- =============================================公共头部================================================== -->
    <div class="saleForm_top">
      <ul>
        <li :class="stepOne">确认信息</li>
        <li :class="stepTwo">结算金额</li>
        <li :class="stepThree">提交申请</li>
      </ul>
      <div>
        <p v-show="showTopTitleTip">
          <i class="el-icon-info"></i>
          <span v-html="topTitleTip"></span>
        </p>
      </div>
    </div>
    <!-- =============================================新房收款的内容======================================== -->
    <!-- ==========================步骤一========================== -->
    <div class="saleStepOne" v-if="showStepOne">
      <div class="saleStepOne_top">
        <h3>基本资料</h3>
        <ul>
          <li class="fl clearfix">
            <p>
              <label>客户姓名:</label>
              <span>{{saleStepOneObj.customerName}}</span>
            </p>
            <p>
              <label>客户编号:</label>
              <span>{{saleStepOneObj.customerNumber}}</span>
            </p>
            <p>
              <label>联系电话:</label>
              <span class="clearfix">{{saleStepOneObj.contactNumber}}</span>
            </p>
            <p>
              <label>客户来源:</label>
              <span>{{saleStepOneObj.customerSourceString}}</span>
            </p>
          </li>
          <li class="fl">
            <p>
              <label>成交项目:</label>
              <span>{{saleStepOneObj.transactionItem}}</span>
            </p>
            <p>
              <label>项目公司:</label>
              <span>{{saleStepOneObj.itemCmpany}}</span>
            </p>
            <p>
              <label>项目价格:</label>
              <span>{{saleStepOneObj.projectPrice}}</span>
            </p>
            <p>
              <label>项目地址:</label>
              <span>{{saleStepOneObj.projectAddress}}</span>
            </p>
          </li>
        </ul>
      </div>
      <div class="saleStepOne_center">
          <h3>合同详情</h3>
          <div class="fl list-box clearfix">
              <ul>
                  <li v-for="item of customerProgressInfoOfBid" :key="item.id" :class="{'on':item.view}">
                      <p class="black-g">{{item.name}}</p>
                      <em class="c-big">
                          <em class="c-small"></em>
                      </em>
                      <p class="c-name">{{item.empName}}</p>
                      <p class="c-time">{{ item.operateTime | formatTimeHead }}</p>
                      <p class="c-time">{{ item.operateTime | formatTimeEnd}}</p>
                  </li>
              </ul>
          </div>
          <div class="saleStepOne_centerForm">
              <el-form :model="saleStepOneObj" ref="saleStepOneForm" :rules='rules'  :inline=true label-width="100px" class="demo-dynamic">
                  <el-form-item label="合同姓名:" prop="contractName">
                      <el-input v-model="saleStepOneObj.contractName" maxlength=10></el-input>
                  </el-form-item>
                  <el-form-item label="手机号码:" prop="contractPhone">
                      <el-input v-model="saleStepOneObj.contractPhone" onkeyup="this.value=this.value.replace(/\D/g,'')" @blur="mobileCheck" maxlength=11></el-input>
                  </el-form-item>
                  <el-form-item label="身份证号:" prop="idNumber">
                      <el-input v-model="saleStepOneObj.idNumber" maxlength=18 @blur="idCardCheck"></el-input>
                  </el-form-item>
                  <!-- =========================================认筹状态开始========================================= -->
                  <div v-if="contractType == 0">
                    <el-form-item label="认筹金额:" prop="turnoverAmount" class="afterContent">
                        <el-input v-model="saleStepOneObj.turnoverAmount" maxlength=12 @blur="moneyCheck('turnoverAmount')"></el-input>
                        <span>元</span>
                    </el-form-item>
                    <el-form-item label="认筹时间:" prop="closingTime">
                        <el-date-picker v-model="saleStepOneObj.closingTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="截止时间:">
                        <el-date-picker v-model="saleStepOneObj.deadline" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="让利金额:" class="afterContent">
                      <el-input v-model="saleStepOneObj.allowanceAmount" maxlength=12 @blur="moneyCheck('allowanceAmount')"></el-input>
                      <span>元</span>
                    </el-form-item>
                  </div>
                  <!-- =========================================认筹状态结束========================================= -->
                  <!-- =========================================认购状态开始========================================= -->
                  <div v-if="contractType == 1">
                    <el-form-item label="认购金额:" prop="turnoverAmount" class="afterContent">
                        <el-input v-model="saleStepOneObj.turnoverAmount" maxlength=12 @blur="moneyCheck('turnoverAmount')"></el-input>
                        <span>元</span>
                    </el-form-item>
                    <el-form-item label="认购时间:" prop="closingTime">
                        <el-date-picker v-model="saleStepOneObj.closingTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="认购房号:" prop="roomNumber">
                        <el-input v-model="saleStepOneObj.roomNumber" maxlength=20></el-input>
                    </el-form-item>
                    <el-form-item label="房屋面积:" prop="housingArea" class="afterContent">
                        <el-input v-model="saleStepOneObj.housingArea" maxlength=12 @blur="moneyCheck('housingArea')"></el-input>
                        <span>m²</span>
                    </el-form-item>
                    <el-form-item label="房屋总价:" prop="totalHousingPrice" class="afterContent">
                        <el-input v-model="saleStepOneObj.totalHousingPrice" maxlength=12 @blur="moneyCheck('totalHousingPrice')"></el-input>
                        <span>元</span>
                    </el-form-item>
                  </div>
                  <!-- =========================================认购状态结束========================================= -->
                  <!-- =========================================草签、网签状态开始========================================= -->
                  <div v-if="contractType == 2 || contractType == 3">
                      <el-form-item :label="contractType == 2 ? '草签时间:' :'网签时间:'" prop="closingTime">
                          <el-date-picker v-model="saleStepOneObj.closingTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
                          </el-date-picker>
                      </el-form-item>
                      <el-form-item label="房屋房号:" prop="roomNumber">
                          <el-input v-model="saleStepOneObj.roomNumber" maxlength=20></el-input>
                      </el-form-item>
                      <el-form-item label="房屋面积:" prop="housingArea" class="afterContent">
                          <el-input v-model="saleStepOneObj.housingArea" maxlength=12 @blur="moneyCheck('housingArea')"></el-input>
                          <span>m²</span>
                      </el-form-item>
                      <el-form-item label="房屋总价:" prop="totalHousingPrice" class="afterContent">
                          <el-input v-model="saleStepOneObj.totalHousingPrice" maxlength=12 @blur="moneyCheck('totalHousingPrice')"></el-input>
                          <span>元</span>
                      </el-form-item>
                  </div>
                  <!-- =========================================草签、网签状态结束========================================= -->
                  <el-form-item :label="showBills" class="contractType">
                      <!-- <span class="labels-name">认筹单据:</span> -->
                      <ul class="upload-image-list">
                          <viewer :images="contractImgList" style="display:inherit">
                              <li v-for="(item,picIndex) in contractImgList" :key="item.imgUrl">
                                  <img :src="item" alt="" :ref="'showImg_'">
                                   <div class="mask">
                                      <div class="ico-box">
                                          <span class="font-btn" @click="clickProject_Img('showImg_',picIndex)">
                                              <i class="icon icon-fangda"></i>
                                          </span>
                                          <span class="font-btn">
                                              <i class="icon icon-shanchu" @click="deleteImg(picIndex,'0')"></i>
                                              <i class="line"></i>
                                          </span>
                                      </div>
                                    </div>
                                  <!-- <span @click="uploadImageOpera(item)">X</span> -->
                              </li>
                              <li class="upload-box">
                                  <input type="file" @change="upLoadImage('0')" v-show="false" ref="upload">
                                  <p class="upload-btn gallery-window-opera" @click="toUpload"><span>+</span>
                                  <i class="clickUpload">点击上传</i>
                                  </p>
                              </li>
                          </viewer>
                          </ul>
                  </el-form-item>
              </el-form>
          </div>
        <div class="saleStepOne_footer">
          <h3>成交信息</h3>
          <ul>
            <li>
              <p>
                <label>成交驻场:</label>
                <span>{{saleStepOneObj.closingIn}}</span>
              </p>
              <p>
                <label class="saleStepOne_deal">成交人:</label>
                <el-autocomplete
                  :fetch-suggestions="querySearch"
                  :trigger-on-focus="false"
                  placeholder="请输入成交人"
                  @select="handleSelectBoxRenChou"
                  v-model="saleStepOneObj.traderName"
                ></el-autocomplete>
                <!-- <el-input placeholder="请输入成交人" v-model="saleStepOneObj.traderName"></el-input> -->
                <span class="toLong_css">{{saleStepOneObj.departmentName}}</span>
              </p>
              <p v-if="saleStepOneObj.customerType == 3">
                <label class="saleStepOne_deal">联动专员:</label>
                <el-autocomplete
                  :fetch-suggestions="querySearch1"
                  :trigger-on-focus="false"
                  placeholder="请输入成交人"
                  @select="handleSelectBoxRenChou1"
                  v-model="saleStepOneObj.associateCommissioner"
                ></el-autocomplete>
                <!-- <el-input placeholder="请输入联动专员" v-model="saleStepOneObj.associateCommissioner"></el-input> -->
                <span class="toLong_css">{{saleStepOneObj.linkageDepartment}}</span>
              </p>
            </li>
            <li>
              <p>
                <label>驻场电话:</label>
                <span>{{saleStepOneObj.residentTelephone}}</span>
              </p>
              <p>
                <label>手机号码:</label>
                <span>{{saleStepOneObj.dealersTelephone}}</span>
              </p>
              <p v-if="saleStepOneObj.customerType == 3">
                <label>联动电话:</label>
                <span>{{saleStepOneObj.linkedTelephone}}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="saleStepTwo" v-if="showStepTwo">
      <div class="saleStepTwo_top">
        <p>
          <span>{{saleStepOneObj.transactionItem.split("【")[0]}}</span>&nbsp;&nbsp;&nbsp;
          <span>{{saleStepOneObj.roomNumber}}</span>
        </p>
        <el-form
          :model="saleStepOneObj"
          :rules="rules"
          ref="saleStepOneForms"
          :inline="false"
          label-width="100px"
          class="demo-dynamic"
        >
          <el-form-item label="应收佣金:" prop="commissionReceivable" class="afterContent">
            <el-input
              v-model="saleStepOneObj.commissionReceivable"
              @blur="moneyCheck('commissionReceivable')"
              maxlength="12"
            ></el-input>
            <span>元</span>
          </el-form-item>
          <el-form-item label="备注说明:" class="afterContent">
            <el-input type="textarea" v-model="saleStepOneObj.remarks" maxlength="100"></el-input>
            <span class="descContent">{{descContent}}/100</span>
          </el-form-item>
          <el-form-item label="合同上传:">
            <ul class="upload-image-list">
              <viewer :images="stateImgList" style="display:inherit">
                <li v-for="(item,picIndex) in stateImgList" :key="item.imgUrl">
                  <img :src="item" alt :ref="'showImg_'">
                  <div class="mask">
                    <div class="ico-box">
                      <span class="font-btn" @click="clickProject_Img('showImg_',picIndex)">
                        <i class="icon icon-fangda"></i>
                      </span>
                      <span class="font-btn">
                        <i class="icon icon-shanchu" @click="deleteImg(picIndex,'1')"></i>
                        <i class="line"></i>
                      </span>
                    </div>
                  </div>
                  <!-- <span @click="uploadImageOpera(item)">X</span> -->
                </li>
                <li class="upload-box">
                  <input type="file" @change="upLoadImage('1')" v-show="false" ref="upload">
                  <p class="upload-btn gallery-window-opera" @click="toUpload">
                    <span>+</span>
                  </p>
                  <i class="clickUpload">点击上传</i>
                </li>
              </viewer>
            </ul>
          </el-form-item>
        </el-form>
      </div>
      <div class="saleStepTwo_center">
        <h4>累计收佣</h4>
         <el-table
            :data="saleStepOneObj.commissionList"
            height="250"
            border
            style="width: 100%">
             <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
                prop="name"
                label="申请人"
                width="80">
            </el-table-column>
            <el-table-column
                prop="collect_comm_time"
                label="收佣日期"
                width="100">
            </el-table-column>
            <el-table-column
                prop="commission_money"
                label="本次收佣"
                width="100">
            </el-table-column>
            <el-table-column
                prop="account_commission"
                label="累计收佣"
                width="100">
            </el-table-column>
            <el-table-column
                prop="raiming_commission"
                label="剩余佣金"
                width="100">
            </el-table-column>
            <el-table-column
                label="申请结果"
                >
                <template slot-scope="scope">
                    <span 
                    v-html="scope.row.state == 8 ? '待审核' : scope.row.state == 11 ? '驳回' : '通过'"
                     :class="scope.row.state == 8 ? 'coloring' : scope.row.state == 11 ? 'failColor' : 'successColor' "></span>
                </template>
            </el-table-column>
            <el-table-column
                prop="checkName"
                label="审核人"
                width="80">
            </el-table-column>
            <el-table-column
                prop="reject_remark"
                label="审核备注"
                width="100"
                show-overflow-tooltip>
            </el-table-column>
        </el-table>
      </div>
      <div class="saleStepTwo_footer">
        <h4>本次收佣</h4>
        <el-form
          :model="saleStepOneObj"
          ref="saleStepOneForms"
          :rules="rules"
          :inline="true"
          label-width="100px"
          class="demo-dynamic"
        >
          <el-form-item label="本次收佣:" prop="thisCommission" class="afterContent">
            <el-input
              v-model="saleStepOneObj.thisCommission"
              @blur="moneyCheck('thisCommission')"
              maxlength="12"
            ></el-input>
            <span>元</span>
          </el-form-item>
          <el-form-item label="收佣日期:" class="afterContent">
            <el-date-picker v-model="saleStepOneObj.time" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-form>
        <p>
          <label>剩余佣金:</label>
          <span v-html="residueMoney.toFixed(2) +'元'"></span>
        </p>
      </div>
    </div>
    <div class="saleStepThree" v-if="showStepThree">
      <div v-show="showSuccess">
        <p>
          <span class="el-icon-circle-check"></span>
          <span>{{saleStepOneObj.transactionItem.split("【")[0]}}</span>&nbsp;&nbsp;
          <span>{{saleStepOneObj.roomNumber}}</span>&nbsp;&nbsp;
          <span>结算申请已成功提交!</span>
        </p>
        <p>审批部门可能会通过微信或电话与您联系，请保持电话通畅！</p>
        <ul>
          <li>• 当日提交成功后，会有专员进行审批。</li>
          <li>• 如果需要加急，请根据公司规章制度联系审批人员。</li>
          <li>• 审批结果可通过“查看详情”查询。</li>
        </ul>
      </div>
      <div v-show="!showSuccess">
        <img src="../../../assets/images/translate.gif" alt>
        <p class="success-loading">客官莫急，正在为您提交中...</p>
      </div>
    </div>
    <!-- ==========================新房收款的底部按钮============================= -->
    <div slot="footer" class="dialog-footer" style="text-align:center;">
      <div v-if="step == 'first'">
        <button @click="closeDialog" class="pop-cancelbtn">取 消</button>
        <button class="pop-submitbtn submitbtnCss" @click="firstNext('saleStepOneForm')">下一步</button>
        <!-- <el-button type="info" @click="closeDialog"  class="pop-cancelbtn">取 消</el-button> -->
        <!-- <el-button  type="warning" class="pop-submitbtn" @click="firstNext('saleStepOneForm')">下一步</el-button> -->
      </div>
      <div v-else-if="step == 'second'">
        <button @click="stepBack" class="pop-submitbtn">上一步</button>
        <button class="pop-submitbtn submitbtnCss" @click="secondNext('saleStepOneForms')">下一步</button>
        <!-- <el-button type="warning" @click="stepBack"  class="pop-cancelbtn">上一步</el-button> -->
        <!-- <el-button type="warning" class="pop-submitbtn" @click="secondNext('saleStepOneForms')">下一步</el-button> -->
      </div>
      <div v-else>
        <button class="pop-submitbtn" @click="successStep" v-show="showSuccess">完成</button>
        <!-- <el-button type="warning" class="pop-submitbtn" @click="successStep" v-show="showSuccess">完成</el-button> -->
      </div>
    </div>
  </div>
</template>

<script>
import { RULE } from "./ruleData.js";
import ImageCompressor from "image-compressor.js";
export default {
  mixins: [RULE],
  props: ["saleId", "contractType"],
  data() {
    return {
      saleDialogBox: false,
      showStepThree: false, // 步骤三显示隐藏
      showSuccess: false, // 是否显示完成按钮
      showStepOne: true, // 步骤一显示隐藏
      tableData: [], //table数据
      showStepTwo: false, // 步骤二显示隐藏
      step: "first", // 步骤
      stepOne: "", // 第一步
      stepTwo: "", // 第二步
      stepThree: "", // 第三步
      stepFour: "", // 第四步
      stepFive: "", // 第五步
      topTitleTip: "请确认客户及结算信息，确认无误点击下一步，确认后无法修改！",
      showTopTitleTip: true,
      saleStepOneObj: {}, //第一张中间表单的对象
      contractImgList: [], // 单据图片数据
      customerProgressInfoOfBid: [],
      stateImgList: [], // 合同图片数据
      salePerson: [], // 成交人模糊搜索数据
      residueMoney: 0, // 剩余佣金显示
      firstResidueMoney: 0, //最开始累计佣金的暂存
      receivableMoney: 0, // 应收佣金的存储
      secondFormObj: {}, // 暂存表单对象数据用来验证表单
      allowNext: true
    };
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
  },
  created() {
    this.loadingMethod();
    this.headCssChange(1);
    this.getSaleForm();
  },
  methods: {
    defaultObj(obj) {
      let targetObj = {
        dealId: "",
        contractName: "",
        contractPhone: "",
        idNumber: "",
        turnoverAmount: "",
        closingTime: "",
        roomNumber: "",
        housingArea: "",
        totalHousingPrice: "",
        receipt: "",
        traderId: "",
        associateCommissionerId: "",
        commissionReceivable: "",
        remarks: "",
        contract: "",
        contract: "",
        thisCommission: "",
        commissionDate: "",
        traderName: "",
        departmentId: "",
        linkageDepartmentId: "",
        allowanceAmount: "",
        deadline: ""
      };
      for (const key in targetObj) {
        if (targetObj.hasOwnProperty(key)) {
          targetObj[key] = obj[key];
        }
      }
      return targetObj;
    },
    getSaleForm() {
      this.$axios
        .get("/api/settlement/settlementApplicationDetails", {
          params: { dealId: this.saleId }
        })
        .then(res => {
          res = res.data;
          if (res.status == 200) {
            this.saleStepOneObj = Object.assign({}, res.data);
            res.data.receipt
              ? (this.contractImgList = res.data.receipt.split(","))
              : "";
            res.data.contract
              ? (this.stateImgList = res.data.contract.split(","))
              : "";
            this.customerProgressInfoOfBid = res.data.customerProgressInfoOfBid;
            this.receivableMoney = res.data.commissionReceivable;
            this.secondFormObj = res.data;
            this.$set(this.saleStepOneObj, "thisCommission", "");
            if (this.saleStepOneObj.commissionList.length !== 0) {
              let str = 0;
              this.saleStepOneObj.commissionList.forEach(element => {
                if (element.state == 9 || element.state == 10) {
                  str = element.account_commission;
                }
              });
              this.firstResidueMoney = str;
            }
            this.residueMoney = this.receivableMoney - this.firstResidueMoney;
            this.saleStepOneObj.time
              ? ""
              : (this.saleStepOneObj.time = this.getCurrentTime());
          } else {
            this.alertMessage("warning", res.message, 2000);
            return;
          }
        });
    },
    getCurrentTime() {
      let date = new Date();
      let seperator1 = "-";
      let seperator2 = ":";
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate =
        date.getFullYear() +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        date.getHours() +
        seperator2 +
        date.getMinutes() +
        seperator2 +
        date.getSeconds();
      return currentdate;
    },
    //   点击结算弹框出现时执行的函数
    loadingMethod() {
      this.headCssChange(1);
      this.step = "first";
    },
    // 控制头部样式改变方法
    headCssChange(count) {
      switch (count) {
        case 1:
          this.stepOne = "activeColor";
          this.stepTwo = "activeColorN";
          this.stepThree = "activeColorN";
          break;
        case 2:
          this.stepOne = "activeColor";
          this.stepTwo = "activeColor";
          this.stepThree = "activeColorN";
          break;
        case 3:
          this.stepOne = "activeColor";
          this.stepTwo = "activeColor";
          this.stepThree = "activeColor";

          break;
      }
    },
    // 弹框取消时的方法
    closeDialog() {
      console.log(this.customerProgressInfoOfBid);
      this.$emit("close");
    },
    // 点击结算的时候
    saleClick() {
      this.headCssChange(1);
      this.step = "first";
      this.saleDialogBox = true;
    },
    // 点击上一步的时候
    stepBack() {
      this.step = "first";
      this.headCssChange(1);
      this.showStepOne = true;
      this.showStepTwo = false;
      this.topTitleTip =
        "请确认客户及结算信息，确认无误点击下一步，确认后无法修改！";
    },
    // 点击第一个下一步的时候
    firstNext(form) {
      this.submitForm(form)
        .then(res => {
          // debugger
          if (this.allowNext) {
            if (!this.saleStepOneObj.traderName) {
              this.alertMessage("info", "请输入成交人", 2000);
              return;
            }
            if (
              this.saleStepOneObj.customerType === 3 &&
              !this.saleStepOneObj.associateCommissioner
            ) {
              this.alertMessage("info", "请输入联动专员", 2000);
              return;
            }
            this.topTitleTip = "请输入本次结算金额，确认后提交审核，不可更改！";
            this.headCssChange(2);
            this.allowNext = true;
            this.showStepTwo = true;
            this.showStepOne = false;
            this.step = "second";
          } else {
            this.allowNext = true;
          }
        })
        .catch(error => {
          let toastMsg = this.rules[Object.keys(error)[0]][0].message;
          this.alertMessage("info", toastMsg, 2000);
          return;
        });
    },
    // 点击第二个下一步的时候
    secondNext(form) {
      this.submitForm(form)
        .then(res => {
          let params = {};
          let qs = require("qs");
          this.stateImgList.length !== 0
            ? this.$set(
                this.saleStepOneObj,
                "contract",
                this.stateImgList.join(",")
              )
            : this.$set(this.saleStepOneObj, "contract", "");
          this.contractImgList.length !== 0
            ? this.$set(
                this.saleStepOneObj,
                "receipt",
                this.contractImgList.join(",")
              )
            : this.$set(this.saleStepOneObj, "receipt", "");
          this.headCssChange(3);
          this.step = "third";
          this.showTopTitleTip = false;
          this.showStepThree = true;
          this.showStepTwo = false;
          this.showStepOne = false;
          this.showSuccess = false;
          params = this.defaultObj(this.saleStepOneObj);
          this.$axios
            .post(
              "/api/settlement/settlementApplicationSubmission",
              qs.stringify(params)
            )
            .then(res => {
              res = res.data;
              this.showSuccess = true;
              if (res.status === 200) {
                this.alertMessage("success", "结算成功", 2000);
                this.$emit("successChange");
                return;
              } else {
                this.alertMessage("warning", res.message, 2000);
                this.$emit("close");
                return;
              }
            })
            .catch(error => {
              this.alertMessage("warning", "结算失败");
              this.$emit("close");
              return;
            });
        })
        .catch(error => {
          let toastMsg = this.rules[Object.keys(error)[0]][0].message;
          this.alertMessage("info", toastMsg, 2000);
          return;
        });
    },
    // 成交人模糊搜索
    handleSelectBoxRenChou(val) {
        this.$set(
          this.saleStepOneObj,
          "departmentName",
          val.deptName
        );
        this.$set(
          this.saleStepOneObj,
          "dealersTelephone",
          val.mobile
        );
        this.$set(
          this.saleStepOneObj,
          "departmentId",
          val.deptId
        );
        this.$set(this.saleStepOneObj, "traderId", val.empId);
       
    },
    handleSelectBoxRenChou1(val) {
       this.$set(
          this.saleStepOneObj,
          "linkageDepartment",
          val.deptName
        );
        this.$set(
          this.saleStepOneObj,
          "linkedTelephone",
          val.mobile
        );
        this.$set(
          this.saleStepOneObj,
          "associateCommissionerId",
          val.empId
        );
        this.$set(
          this.saleStepOneObj,
          "linkageDepartmentId",
          val.deptId
        );
    },
    querySearch1(queryString, cb) {
      this.salePerson.length = 0;
      let params = {
        keyword: this.saleStepOneObj.associateCommissioner
      };
      this.$axios
        .get("/api/settlement/getAssociateCommissioner", { params: params })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            res.data.forEach((value, id) => {
              this.salePerson.push({
                value: value.name,
                empId: value.empId,
                names: value.name,
                deptId: value.deptId,
                deptName: value.deptName,
                mobile: value.mobile
              });
            });
          } else {
            this.alertMessage("warning", res.message, 2000);
            return;
          }
        });
      cb(this.salePerson);
    },
    querySearch(queryString, cb) {
      this.salePerson.length = 0;
      let params = {
        keyword: this.saleStepOneObj.traderName,
        customerType: this.saleStepOneObj.customerType
      };
      this.$axios
        .get("/api/settlement/acquisitionNewHouseDealers", { params: params })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            res.data.forEach((value, id) => {
              this.salePerson.push({
                value: value.name,
                empId: value.empId,
                deptId: value.deptId,
                names: value.name,
                deptName: value.deptName,
                mobile: value.mobile
              });
            });
          } else {
            this.alertMessage("warning", res.message, 2000);
            return;
          }
        });
      cb(this.salePerson);
    },
    // 点击完成时
    successStep() {
      // this.$emit("close");
      this.$emit("getList");
    },
    upLoadImage(type) {
      let _that = this;
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      new ImageCompressor(file, {
        quality: 0.9,
        maxWidth: 2000,
        maxHeight: 2000,
        success(result) {
          const formData = new FormData();
          formData.append("file", result, result.name);
          formData.append("watermark", false);
          if (result.size > 1 * 1024 * 1024 || result.size < 3 * 1024) {
            _that.$message("图片大小要在3K~1M之间");
            return;
          } else {
            _that.$ajax.post("/img/upload", formData).then(res => {
              res = res.data;
              if (res.images && res.images.length > 0) {
                if (res.images[0].src !== "file size is too small") {
                  let item = res.images[0].src;
                  type == "0"
                    ? _that.contractImgList.unshift(item)
                    : _that.stateImgList.unshift(item);
                }
              }
            });
          }
        }
      });
    },
    toUpload() {
      this.$refs.upload.click();
    },
    // 删除指定图片
    deleteImg(index, int) {
      int == "0"
        ? this.contractImgList.splice(index, 1)
        : this.stateImgList.splice(index, 1);
    },
    uploadImageOpera() {},
    clickProject_Img(str, picIndex) {
      this.$refs[str][picIndex].click();
    },
    // ==============================================所有表单校验方法===============================================
    // 手机号码验证
    mobileCheck() {
      if (
        this.saleStepOneObj.contractPhone &&
        this.saleStepOneObj.contractPhone.substr(0, 1) != "1"
      ) {
        this.alertMessage("info", "手机号只能是数字1开头");
        this.saleStepOneObj.contractPhone = this.secondFormObj.contractPhone;
        return;
      }
    },
    // 身份证号验证
    idCardCheck() {
      if (
        !/^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/.test(
          this.saleStepOneObj.idNumber
        )
      ) {
        this.alertMessage("info", "身份证号有误，请重新输入");
        this.saleStepOneObj.idNumber = this.secondFormObj.idNumber;
        return;
      }
    },
    // 金额校验
    moneyCheck(item) {
      let str = "只能输入正整数和小数后最多两位";
      str =
        item == "housingArea"
          ? "房屋面积" + str
          : item == "totalHousingPrice"
          ? "房屋总价" + str
          : "金额" + str;
      if (this.saleStepOneObj[item]) {
        if (
          !/^([+]?)\d*\.?\d+$/.test(this.saleStepOneObj[item]) ||
          !/^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.test(
            this.saleStepOneObj[item]
          )
        ) {
          this.alertMessage("info", str, 2000);
          this.saleStepOneObj[item] = this.secondFormObj[item];
          this.allowNext = false;
          return;
        } else if (
          this.saleStepOneObj[item].toString().indexOf(".") == -1 &&
          this.saleStepOneObj[item].length > 9
        ) {
          // debugger
          this.alertMessage("info", "正整数长度不能超过9位", 2000);
          this.saleStepOneObj[item] = this.secondFormObj[item];
          this.allowNext = false;
          return;
        } else {
          // debugger
          if (item == "commissionReceivable") {
            if (
              this.saleStepOneObj[item] < this.firstResidueMoney ||
              this.saleStepOneObj[item] -
                this.firstResidueMoney -
                this.saleStepOneObj.thisCommission <
                0
            ) {
              this.alertMessage(
                "info",
                "应收佣金应大于累计收佣和本次收佣的和",
                2000
              );
              this.saleStepOneObj.commissionReceivable = this.receivableMoney;
              this.residueMoney = this.receivableMoney - this.firstResidueMoney - this.saleStepOneObj.thisCommission
              this.allowNext = false;
              return;
            } else {
              this.allowNext = true;
              this.residueMoney =
                this.saleStepOneObj[item] -
                this.firstResidueMoney -
                this.saleStepOneObj.thisCommission;
            }
          } else if (item == "thisCommission") {
            if (
              this.saleStepOneObj[item] >
              this.saleStepOneObj.commissionReceivable - this.firstResidueMoney
            ) {
              this.alertMessage("info", "本次收佣应小于等于剩余佣金", 2000);
              this.saleStepOneObj[item] = "";
              this.allowNext = false;
              return false;
            } else {
              this.allowNext = true;
              this.residueMoney =
                this.saleStepOneObj.commissionReceivable -
                this.firstResidueMoney -
                this.saleStepOneObj[item];
            }
          } else {
            this.allowNext = true;
          }
        }
      }
    }
  },
  computed: {
    descContent() {
      return this.saleStepOneObj.remarks
        ? this.saleStepOneObj.remarks.length
        : 0;
    },
    showBills() {
      // debugger
      let typeContent = "";
      switch (this.contractType) {
        case 0:
          typeContent = "认筹单据:";
          break;
        case 1:
          typeContent = "认购单据:";
          break;
        case 2:
          typeContent = "草签单据:";
          break;
        case 3:
          typeContent = "网签单据:";
          break;
        default:
          break;
      }
      return typeContent;
    }
  }
};
</script>
<style lang='scss' scoped src="./getMoneyDialog.scss"></style>