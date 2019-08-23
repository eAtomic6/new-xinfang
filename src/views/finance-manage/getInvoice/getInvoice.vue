<!-- 开票收佣 -->
<template>
  <div>
    <!-- =============================================公共头部================================================== -->
    <div class="saleForm_top">
      <ul>
        <li :class="stepOne">选择结佣公司</li>
        <li :class="stepTwo">选择结佣客户</li>
        <li :class="stepThree">填写结佣明细表</li>
        <li :class="stepFour">提交审核</li>
      </ul>
      <div v-if="cc ==3">
        <p v-show="showTopTitleTip">
          <i class="el-icon-info"></i>
          <span v-html="topTitleTip"></span>
        </p>
      </div>
    </div>
    <el-table
    :data="tableData"
    border
    style="width: 1200px"
    class="newTable"
    v-if="cc ==3"
    >
    <el-table-column
      fixed
      prop="date"
      label="客户姓名"
      width="150"
      class="isTotal">
    </el-table-column>
    <el-table-column
      prop="name"
      label="经纪人"
      width="150">
    </el-table-column>
    <el-table-column
      prop="province"
      label="分销单位"
      width="200">
    </el-table-column>
    <el-table-column
      prop="city"
      label="已收佣"
      width="120">
    </el-table-column>
    <el-table-column
      prop="address"
      label="本次应结佣金额"
      width="120">
    </el-table-column>
    <el-table-column
      prop="zip"
      label="本次结佣金额"
      width="120">
    </el-table-column>
    <el-table-column
      label="操作"
      width="300"
      >
      <template slot-scope="scope">
        <el-button  type="text" size="small"  @click="centerDialogVisible = true">上传</el-button>
         <el-button type="text" size="null">预览</el-button>
        <el-button type="text" size="small">下载模板</el-button>
      </template>
    </el-table-column>
  </el-table>
    <!-- ==========================新房收款的底部按钮============================= -->
    <div slot="footer" class="dialog-footer" style="text-align:center;">
      <div v-if="step == 'first'">
        <button @click="closeDialog" class="pop-cancelbtn">上一步</button>
        <button class="pop-submitbtn submitbtnCss" @click="firstNext('saleStepOneForm')">下一步</button>
      </div>
      <div v-else-if="step == 'second'">
        <button @click="stepBack" class="pop-submitbtn">上一步</button>
        <button class="pop-submitbtn submitbtnCss" @click="secondNext('saleStepOneForms')">下一步</button>
      </div>
      <div v-else>
        <button class="pop-submitbtn" @click="successStep" v-show="showSuccess">完成</button>
      </div>
    </div>
      <el-dialog
      title="修改渠道公司"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <p><em>*</em>渠道公司 ： 
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select></p>
      <p>渠道经理 ： 陈小虎</p>
      <p>联系电话 ： 135246879852</p>
      <p>特殊邀请函</p>
      <!-- <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload> -->
      <el-dialog :visible.sync="dialogVisible" size="tiny">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <span slot="footer" class="dialog-footer">
      <el-button @click="centerDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
      </el-dialog>
  </div>
</template>

<script>
import { RULE } from "../getMoney-new/ruleData.js";
import ImageCompressor from "image-compressor.js";
export default {
  mixins: [RULE],
  props: ["saleId", "contractType"],
  data() {
    return {
      step:'',
       options: [{
          value: '选项1',
          label: '茂业直销'
        }, {
          value: '选项2',
          label: '吉家直销'
        }, {
          value: '选项3',
          label: '链家'
        }, {
          value: '选项4',
          label: '房多多'
        }],
        value: '',
      centerDialogVisible:false,
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
      topTitleTip: "！ 点击表格填写或修改结佣明细，如果需要修改分销单位，请上传【特殊情况函】！",
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
      allowNext: true,
       tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }]
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
    this.headCssChange(3);
    this.getSaleForm();
  },
  methods: {
    handleClick(row) {
        console.log(row);
    },
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
      this.cc = count
      switch (count) {
        case 1:
          this.stepOne = "activeColor";
          this.stepTwo = "activeColorN";
          this.stepThree = "activeColorN";
          this.stepFour = "activeColorN";
          break;
        case 2:
          this.stepOne = "activeColor";
          this.stepTwo = "activeColor";
          this.stepThree = "activeColorN";
          this.stepFour = "activeColorN";
          break;
        case 3:
          this.stepOne = "activeColor";
          this.stepTwo = "activeColor";
          this.stepThree = "activeColor";
          this.stepFour = "activeColorN";
          break;
        case 4:
          this.stepOne = "activeColor";
          this.stepTwo = "activeColor";
          this.stepThree = "activeColor";
          this.stepFour = "activeColor";
          break;
      }
    },
    // 弹框取消时的方法
    closeDialog() {
      console.log(this.customerProgressInfoOfBid);
      this.$emit("close");
      this.cc = this.cc -1
      console.log(this.cc,'后退',1111111111111111111111111);
      this.headCssChange(this.cc)
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
      this.cc = this.cc +1
      console.log(this.cc,'前进',1111111111111111111111111);
      this.headCssChange(this.cc)
    },
    // 点击第二个下一步的时候
    secondNext(form) {
      console.log(3333333333333333333333);
      console.log(form);
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
<style lang='scss' scoped>
.el-dialog--center{
  .el-dialog__body{
    p:nth-child(1){
      em{
        color: red;
        margin-left: -11px;
        margin-right: 5px;
      }
      /deep/ .el-select{
        .el-input--suffix{
          .el-input__suffix{
            .el-input__suffix-inner{
              .el-icon-arrow-up{
                line-height: 30px;
              }
            }
          }
        }
      }
    }
    P:nth-child(2),
    P:nth-child(4){
          margin-top: 10px;
    margin-bottom: 10px;
    }
  }
}
.el-icon-minus {
  color: #72a0d1;
  font-size: 15px;
  vertical-align: middle;
  font-weight: 900;
}
/deep/ .el-dialog {
    width: 800px;
  }
  .toLong_css{
    display: inline-block;
    width: 183px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    height: 22px;
    line-height: 30px;
  }
  .successColor{
    color: #666666;
  }
  .failColor{
   color: #FF5438;
  }
  .coloring{
   color: #26A656;
  }
  // /deep/ .el-autocomplete-suggestion__list{
  //   height: 175px !important;
  // }
  .saleStepOne_deal{
    &::before{
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  .pop-cancelbtn {
    background-color: #A0A0A0;
    color: #fff;
    cursor: pointer;
  }
  .submitbtnCss{
    margin-left: 30px !important;
  }
  .pop-submitbtn {
    background-color: #fd8f00;
    color: #fff;
    cursor: pointer;
  }
  .activeColor {
    background-color: #47af6e !important;
    color: #fff;
     &::after {
          content: "";
          width: 0;
          height: 0;
          border-left: 20px solid #47af6e;
          border-top: 31px solid transparent;
          border-bottom: 30px solid transparent;
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
          border-top: 31px solid transparent;
          border-bottom: 30px solid transparent;
          position: absolute;
          top: 0;
          left: 0px;
          z-index: 1;
        }
  
  }
  .activeColorN {
    border-color: transparent transparent transparent #47af6e !important;
    // color: #fff;
      &::before {
          content: "";
          width: 0;
          height: 0;
          border-left: 20px solid #fff;
          border-top: 31px solid transparent;
          border-bottom: 30px solid transparent;
          position: absolute;
          top: 0;
          left: 0px;
          z-index: 1;
        }
      &::after{
           content: "";
          width: 0;
          height: 0;
          border-left: 20px solid #ddd;
          border-top: 31px solid transparent;
          border-bottom: 30px solid transparent;
          position: absolute;
          top: 0;
          right: -20px;
          z-index: 2;
      }
  
  }
  // 公共头部样式
  .saleForm_top {
    // width: 100%;
    // height: 60px;
    text-align: center;
    > ul {
      margin: 0 auto;
      width: 740px;
      height: 62px;
      position: relative;
      > li {
      margin-right: 10px;
        float: left;
        position: relative;
        width: 170px;
        height: 61px;
        text-align: center;
        line-height: 61px;
        background-color: #ddd;
        &:nth-last-child(1){
            &::after{
                content:"";
              border-left: 20px solid #fff;
            }
        }
        &:nth-of-type(1){
            &::before{
                content:"";
              border-left: 20px solid #47af6e;
            }
        }
      }
    }
    > div {
      margin-bottom: 44px;
      margin-top: 21px;
      i {
        color: #5a9ef2;
        font-size: 19px;
      }
      span {
        color: #ff5438;
        margin-left: 11px;
      }
    }
  }
  h3 {
    color: #333333;
    font-weight: bold;
    font-size: 14px;
    height: 30px;
    margin: 5px 0 5px 0;
  }
  .saleStepOne_top {
    > ul {
      margin-top: 10px;
      height: 160px;
      > li {
        padding-left: 10px;
        width: 50%;
        line-height: 18px;
        p {
          height: 36px;
          label {
            color: #666666;
          }
          span {
            color: #333333;
            word-break: keep-all;
            float: right;
            width: 305px;
            word-break: break-all;
          }
        }
      }
    }
  }
  .saleStepOne_center {
    .list-box {
      margin: 5px 0.5% 0 0;
      vertical-align: middle;
      width: 90%;
      height: 120px;
      margin-bottom: 15px;
      ul li {
        position: relative;
        float: left;
        width: 14%;
        text-align: center;
  
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
        }
  
        .c-time {
          color: #999;
          font-size: 12px;
        }
  
        &:before {
          z-index: 1;
          content: "";
          display: block;
          position: absolute;
          top: 46px;
          left: -50px;
          width: 100%;
          height: 1px;
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
    }
    .saleStepOne_centerForm {
      /deep/ .el-form {
        padding: 0 5px 0 5px;
        .el-form-item {
          margin-bottom: 6px;
          width: 235px;
          label {
            width: 84px !important;
            color: #666666;
            font-weight: normal;
          }
          .el-form-item__content {
            width: 150px;
            .el-date-editor {
              width: 150px;
            }
          }
        }
        .contractType{
          display: block;
          width: 100%;
          .el-form-item__content{
            width: 75%;
          }
        }
        .afterContent{
            position: relative;
            .el-form-item__content{
                width: 130px;
                span {
                    position: absolute;
                    right: -21px;
                    top: 0;
                }
            }
        }
      }
    }
  }
  .upload-image-list {
    display: flex;
    flex-wrap: wrap;
    padding: 5px 0 10px 0;
    > div{
    flex-wrap: wrap;
    }
    .clickUpload{
      position: absolute;
      bottom: 2px;
      left: 32px;
      color: #B2B2B2;
    }
    li {
      width: 110px;
      height: 90px;
      margin-bottom: 10px;
      text-align: center;
      position: relative;
      margin-right: 20px;
      .mask {
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(34, 34, 34, 0.6);
          .ico-box {
            margin: 25px auto;
            font-size: 0;
            text-align: center;
            .font-btn {
                display: inline-block;
                height: 40px;
                width: 50%;
                padding: 0 20px;
                box-sizing: border-box;
                &:last-child{
                    position: relative;
                    .line {
                        content: '';
                        display: inline-block;
                        position: absolute;
                        left: 0;
                        top: 10px;
                        width: 1px;
                        height: 20px;
                        background: #fff;
                    }
                }
            }
  
            .icon-fangda,
            .icon-shanchu {
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
      img {
        width: 110px;
        height: 90px;
      }
  
      > span {
        display: inline-block;
        border: 1px solid #f2f2f2;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        padding: 0 10px;
        margin-top: 10px;
        line-height: 1.4;
        &:first-of-type {
          position: absolute;
          top: 0;
          right: 0;
          background-color: red;
          color: #ffffff;
          display: flex;
          width: 30px;
          height: 30px;
          align-items: center;
          justify-content: center;
          margin: -15px -15px 0 0;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
          border-radius: 50%;
        }
  
        &.cover-photo {
          border-color: #fd8f00;
          color: #fd8f00;
        }
      }
    }
    
  }
  .upload-box {
    position: relative;
    .upload-btn {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 110px;
      height: 90px;
    }
  }
  .gallery-window-opera {
    width: 110px;
    height: 110px;
    background-color: #e7e7e7;
    display: flex;
    justify-content: center;
    align-items: center;
    > span {
      margin-bottom: 20px;
      width: 34px;
      height: 34px;
      line-height: 29px;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      border: 1px solid #a0a0a0;
      font-size: 24px;
      align-self: center;
      text-align: center;
      color: #b2b2b2;
    }
  }
   .newTable{
    margin: auto;
    /deep/ .el-table__fixed{
        /deep/ .el-table__fixed-header-wrapper{
            /deep/ .el-table__header{
                thead{
                    tr{
                        /deep/ .is-leaf{
                            background: #e7e7f7!important;
                         /deep/   .cell{
                                text-align: center!important;
                            }
                        }
                    }
                }
            }
        }
    }
  }
</style>