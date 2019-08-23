<!-- 客源列表客户操作，跟进、带看、报备 -->
<template>
  <div class="customer-operation">
    <div class="operation-top">
      <h4>基本信息</h4>
      <ul>
        <li>
          <label>客户姓名:</label>
          <span>{{formContent.name}}</span>
        </li>
        <li>
          <label>客户状态:</label>
          <span>{{formContent.state}}</span>
        </li>
        <li>
          <label>手机号码:</label>
          <span>{{formContent.phone}}</span>
        </li>
      </ul>
    </div>
      <div class="operation-footer">
          <div v-if="formContent.type == '写跟进'" class="operation-follow">
              <h4>跟进信息</h4>
              <el-form
                :model="formObj"
                :inline="true"
                label-width="100px"
                class="demo-dynamic"
                >
                <el-form-item label="跟进类型:" class="value-check afterContent">
                    <el-select v-model="formContent.followType" placeholder="请选择">
                        <el-option
                        v-for="item in followType"
                        :key="item.value"
                        :label="item.value"
                        :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="跟进目的:"  class="value-check afterContent">
                    <el-select v-model="formContent.reasonType" placeholder="请选择">
                        <el-option
                        v-for="item in targetFollow"
                        :key="item.value"
                        :label="item.value"
                        :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注说明:" class="value-check afterContent">
                    <el-input type="textarea" v-model="formContent.followReason" maxlength=400 placeholder="内容不少于10个字"></el-input>
                </el-form-item>
            </el-form>
          </div>
          <div v-else-if="formContent.type == '报备'" class="operation-report">
                 <h4>报备项目</h4>
                <el-form
                :model="formObj"
                :inline="true"
                label-width="100px"
                class="demo-dynamic"
                >
                <el-form-item label="报备项目:" class="afterContent value-check">
                    <el-input
                    placeholder="请输入内容"
                    v-model="projectObj.b_name"
                    :disabled="true">
                    </el-input>
                    <el-button class="sureAdd select-project" @click="selectProject">项目选择</el-button>
                </el-form-item>
                <el-form-item label="报备保护期:" class="afterContent">
                    <span>{{projectObj.pro_time_agent_report ? projectObj.pro_time_agent_report + '小时' : ''}}</span>
                </el-form-item>
                <el-form-item label="项目驻场:" class="afterContent">
                    <span>{{projectObj.e_name}}</span>
                </el-form-item>
                <el-form-item label="驻 场 电 话:" class="afterContent">
                    <span>{{projectObj.mobile}}</span>
                </el-form-item>
                <el-form-item label="报备规则:" class="afterContent">
                    <span>{{projectObj.report_rule}}</span>
                </el-form-item>
                <el-form-item label="预计带看时间:" class="value-check afterContent">
                    <el-time-picker
                        value-format="HH:mm"
                        v-model="formObj.expectLookTime"
                        format="HH:mm"
                        placeholder="任意时间点">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="客户情况:" prop="customerNow" class="afterContent">
                    <el-input type="textarea" v-model="formObj.details" maxlength="100" placeholder="内容不多于100个字"></el-input>
                </el-form-item>
            </el-form>
          </div>
          <div v-else class="operation-takeLook">
               <h4>带看项目</h4>
                <el-form
                :model="formObj"
                :inline="true"
                label-width="100px"
                class="demo-dynamic"
                >
                <el-form-item label="带看项目:" prop="b_name" class="value-check afterContent">
                   <el-input
                    placeholder="请输入内容"
                    v-model="projectObj.b_name"
                    :disabled="true">
                    </el-input>
                    <el-button class="sureAdd select-project" @click="selectProject">项目选择</el-button>
                </el-form-item>
                <el-form-item label="带看时间:" class="value-check afterContent">
                    <el-date-picker
                    v-model="formObj.lookTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="带看保护期:" class="afterContent">
                    <span>{{projectObj.pro_time_agent_look ? projectObj.pro_time_agent_look + '小时' : ''}}</span>
                </el-form-item>
                <el-form-item label="项目驻场:" class="afterContent takeLook-project">
                    <span>{{projectObj.e_name}}</span>
                </el-form-item>
                <el-form-item label="驻 场 电 话:" class="afterContent">
                    <span>{{projectObj.mobile}}</span>
                </el-form-item>
                <el-form-item label="带看确认单:" class="value-check afterContent">
                    <ul class="upload-image-list">
                        <viewer :images="imagesList" style="display:inherit">
                            <li v-for="(item,picIndex) in imagesList" :key="item.imgUrl">
                            <img :src="item" alt :ref="'showImg_'">
                            <div class="mask">
                                <div class="ico-box">
                                <span class="font-btn" @click="clickProject_Img('showImg_',picIndex)">
                                    <i class="icon icon-fangda"></i>
                                </span>
                                <span class="font-btn">
                                    <i class="icon icon-shanchu" @click="deleteImg(picIndex)"></i>
                                    <i class="line"></i>
                                </span>
                                </div>
                            </div>
                            </li>
                            <li class="upload-box">
                            <input type="file" @change="upLoadImage" v-show="false" ref="upload">
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
      </div>
      <div class="operation-btn move_footer">
          <el-button class="sureAdd" @click="sureOperation('formObj')">确 定</el-button>
          <el-button  class="noAdd" @click="noOperation">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import ImageCompressor from "image-compressor.js";
import { RULE } from "./detailTableData.js";
// let headers = {}
// headers['Content-Type'] = 'application/json'
export default {
  data() {
    return {
      val: Date.now(),
      // formType:"备",
      formObj: {}, // 表单对象
      follwoType: [], // 跟进类型数据
      followTarget: [], // 跟进目的数据
      rules: RULE, // form表单验证规则
      loading: false,
      stateImgList: [],
      defaultForm: {},
      imagesList: []
    };
  },
  props: ["formContent", "followType", "targetFollow", "projectObj"],
  created() {
    this.formObj.customerId = this.formContent.customerId,
    this.formObj.phone = this.formContent.phone,
    this.formObj.state = this.formContent.state,
    this.formObj.type = this.formContent.type,
    this.formObj.name = this.formContent.name,
    this.defaultForm = this.formContent;
    console.log(this.formObj);
  },
  methods: {
    //   点击上传单据
    toUpload() {
      this.$refs.upload.click();
    },
    //   点击放大图片
    clickProject_Img(str, picIndex) {
      this.$refs[str][picIndex].click();
    },
    //   点击删除单据时
    deleteImg(index) {
      this.imagesList.splice(index, 1);
      this.formObj.lookVoucher = this.imagesList.join(",");
    },
    //   当上传的单据发生改变时
    upLoadImage(type) {
      if(this.imagesList.length>2){
       this.$message("最多上传三张图片");
       return false;
      }
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
          if (result.size > 3 * 1024 * 1024 || result.size < 3 * 1024) {
            _that.$message("图片大小要在3K~1M之间");
            return;
          } else {
            _that.$ajax.post("/img/upload", formData).then(res => {
              res = res.data;
              if (res.images && res.images.length > 0) {
                if (res.images[0].src !== "file size is too small") {
                  let item = res.images[0].src;
                  _that.imagesList.unshift(item);
                  _that.formObj.lookVoucher = _that.imagesList.join(",");
                }
              }
            });
          }
        }
      });
    },
    //   清空报备、带看、跟进表单数据
    defaultMethod() {
      if (this.formContent.type == "写跟进") {
        this.formContent.followType = "";
        this.formContent.reasonType = "";
        this.formContent.followReason = "";
      } else {
        this.formObj.expectLookTime = "";
        this.formObj.b_name = "";
        this.formObj.lookTime = "";
        this.formObj.lookVoucher = "";
        this.formObj.details = "";
        this.projectObj.b_name = "";
        this.projectObj.e_name = "";
        this.projectObj.mobile = "";
        this.projectObj.expectLookTime = "";
        this.projectObj.pro_time_agent_look = "";
        this.projectObj.pro_time_agent_report = "";
        this.projectObj.report_rule = "";
        this.projectObj.lookTime = "";
        this.projectObj.lookVoucher = "";
      }
    },
    //   点击取消
      noOperation(){
          this.defaultMethod()
          this.$emit("closeOperation")
      },
    //   点击确定
      sureOperation(form){
          let urlStr = ""
           let qs = require("qs");
          let params = {
                      customerId:this.formContent.customerId,
                  }
          if(this.formContent.type == "写跟进"){
                    if(!this.formContent.followType || !this.formContent.reasonType || !this.formContent.followReason){
                       this.alertMessage("warning","请完善表单信息")
                         return
                        
                    }else if(this.formContent.followReason.length < 10){
                        this.alertMessage("warning","备注说明不少于10个字")
                         return
                    }else{
                       urlStr = "/api/follows"
                        params = this.formContent
                    }
          }else if(this.formContent.type == "报备"){
              if(!this.projectObj.b_id || !this.formObj.expectLookTime){
                  this.alertMessage("warning","请完善表单信息")
                  return
              }else{
                  urlStr = "/api/reports"
                  params.buildingId = this.projectObj.b_id
                  params.details = this.formObj.details
                  params.expectLookTime = this.formObj.expectLookTime
              }
          }else{
              if(!this.formObj.lookTime || !this.formObj.lookVoucher || !this.projectObj.b_name){
                  this.alertMessage("warning","请完善表单信息")
                  return
              }else{
                  urlStr = "/api/looks"
                  params.buildingId = this.projectObj.b_id
                  params.lookTime = this.formObj.lookTime
                  params.lookVoucher = this.formObj.lookVoucher
              }
          }
          params.pcPlatform = 0
              this.$axios.post(urlStr,qs.stringify(params)).then(res => {
                    res = res.data
                    if(res.status === 200){
                    //   debugger
                        this.alertMessage("success","添加成功")
                        this.$emit("closeOperation")
                        this.defaultMethod()
                    this.$store.commit("setDetailUpload", 2)
                    }else{
                        this.alertMessage("warning",res.message,2000)
                        return
                    }
                })
      },
    //   点击项目选择
    selectProject() {
      //   debugger
      this.$emit("projectSelect");
    }
  }
};
</script>
<style lang='scss' scoped>
.customer-operation {
  /deep/ .value-check {
    label {
      &::before {
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
      }
    }
  }
  .select-project {
    padding: 7px 13px;
  }
  /deep/ .el-icon-arrow-up {
    line-height: 0;
    &::before {
      content: "\E60C";
      color: #575757;
    }
  }
  h4 {
    font-weight: 700;
  }
  .operation-top {
    ul {
      margin-left: 20px;
      margin-top: 25px;
      width: 600px;
      height: 58px;
      li {
        width: 300px;
        float: left;
        &:nth-last-child(1) {
          margin-top: 20px;
        }
        label {
          color: #666666;
          display: inline-block;
          width: 68px;
        }
        span {
          color: #333333;
        }
      }
    }
  }
  .operation-footer {
    margin-top: 15px;
    .operation-follow {
      /deep/ .el-form {
        .el-form-item {
          .el-select {
            .el-input__inner {
              width: 141px;
            }
          }
          &:nth-of-type(1) {
            margin-right: 95px;
          }
          .el-textarea {
            .el-textarea__inner {
              width: 482px;
              height: 105px;
            }
          }
        }
      }
    }
    .operation-report {
      /deep/ .el-form {
        .el-form-item {
          margin-right: 0;
          &:nth-of-type(1) {
            margin-right: 5px;
            .el-input {
              width: auto;
              .el-input__inner {
                width: 201px;
                height: 30px !important;
              }
            }
          }
          &:nth-of-type(5) {
            width: 385px;
            span {
              display: inline-block;
              width: 260px;
              height: 30px;
            }
          }
          &:nth-of-type(6) {
            // width:  112px;
            label {
              width: 110px !important;
            }
            .el-form-item__content,
            .el-date-editor {
              width: 105px;
            }
            .el-input__inner {
              width: 105px;
              padding-right: 10px;
            }
          }
          &:nth-of-type(3) {
            // margin-right: 302px;
            span {
              display: inline-block;
              width: 294px;
            }
          }
          .el-textarea {
            .el-textarea__inner {
              width: 482px;
              height: 105px;
            }
          }
        }
      }
    }
    .operation-takeLook {
      /deep/ .takeLook-project{
        span{
          width: 271px;
          display: inline-block;
        }
      }
      /deep/ .el-form {
        .el-form-item {
          &:nth-of-type(1) {
            .el-input {
              width: auto;
            }
          }
          .el-date-editor {
            width: 197px;
            margin-right: 75px;
            .el-input__inner {
              width: 197px;
            }
        }
        .operation-takeLook{
            /deep/ .el-form{
                .el-form-item{
                  &:nth-of-type(4){
                    display: none;
                  }
                    &:nth-of-type(1){
                        .el-input{
                            width: auto;
                        }
                    }
                    &:nth-of-type(2){
                        .el-form-item__content{
                            width: 271px;
                        }
                    }
                    .el-date-editor{
                        width: 197px;
                        margin-right: 130px;
                        .el-input__inner{
                            width: 197px;
                        }
                    }
                }
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
    > div {
      flex-wrap: wrap;
    }
    .clickUpload {
      position: absolute;
      bottom: -3px;
      left: 11px;
      width: 60px;
      color: #b2b2b2;
    }
    li {
      width: 80px;
      height: 80px;
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
            // padding: 0 20px;
            box-sizing: border-box;
            &:last-child {
              position: relative;
              .line {
                content: "";
                display: inline-block;
                position: absolute;
                left: 0px;
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
        width: 80px;
        height: 80px;
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
      width: 80px;
      height: 80px;
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
      width: 30px;
      height: 30px;
      line-height: 25px;
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
  /deep/ .el-form {
    label {
      color: #666666;
      font-weight: normal;
    }
    .el-form-item {
      margin-bottom: 10px;
    }
  }
  .move_footer {
    margin-top: 50px;
    margin-bottom: 10px;
  }
}
</style>