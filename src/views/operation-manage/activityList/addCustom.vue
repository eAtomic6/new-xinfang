<!-- 新增自定义活动弹框 -->
<template>
  <div>
    <el-dialog
      title="选择项目"
      append-to-body
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="selectProjectBox"
      class="select-project"
      width="770px"
    >
      <span class="el-icon-close" @click="clickClose"></span>
      <select-project
      :isCustom="isCustom"
        v-if="selectProjectBox1"
        @selectedProject="selectedProject"
        @closeSelectBox="clickClose"
        :companyId="companyId"
        :writeDownData="writeDownData"
        :editActivityData="editActivityData"
      ></select-project>
    </el-dialog>
    <el-form
      :inline="true"
      :rules="addRules"
      ref="addForm"
      :model="keyWordData"
      class="demo-form-inline"
      min-width="1398px"
    >
      <el-form-item label="公 司:" prop="company">
        <el-select
          v-model="keyWordData.company"
          placeholder="请选择公司"
          :disabled="isControlCompany.companyId > 0 || isSelectCompany"
        >
          <el-option
            v-for="item in companyData"
            :value="item.d_id"
            :label="item.name"
            :key="item.d_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动名称:" prop="activityName">
        <el-input v-model="keyWordData.activityName" placeholder="请输入活动名称" maxlength="8"></el-input>
      </el-form-item>
      <el-form-item label="H5链接:" prop="link">
        <el-input v-model="keyWordData.link" placeholder="请输入H5链接"></el-input>
      </el-form-item>
      <el-form-item label="位 置:" prop="position">
        <el-select v-model="keyWordData.position" placeholder="请选择">
          <el-option :value="0" label="吉家新房详情广告位"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动封面:" prop="cover">
        <p style="color:#F84949">请上传1035*300px图片</p>
        <ul class="fl addCustom-main">
          <uploadImg :id="'pic'" @getDataUrl="getDataUrl" :rules="['jpg','gif','png','bmp']">
            <li class="addCustom-picture">
              <span>+</span>
              <span style="color:#999999">点击上传</span>
            </li>
          </uploadImg>
          <viewer :images="urlArr" style="display:inherit">
            <li class="addCustom-mask" v-if="keyWordData.cover">
              <img :src="keyWordData.cover" alt :ref="'showImg_'">
              <div class="mask">
                <div class="ico-box">
                  <span class="font-btn" @click="clickProject_Img('showImg_')">
                    <i class="icon icon-fangda"></i>
                  </span>
                  <span class="font-btn">
                    <i class="icon icon-shanchu" @click="deleteImg"></i>
                    <i class="line"></i>
                  </span>
                </div>
              </div>
            </li>
          </viewer>
        </ul>
      </el-form-item>
      <el-form-item label="项目范围:" class="position-project" prop="idStr">
        <el-input readonly="readonly" v-model="keyWordData.idStr"></el-input>
        <el-button @click="clickSelectProject">选择项目</el-button>
      </el-form-item>
      <el-form-item label="备 注:">
        <el-input
          type="textarea"
          :rows="4"
          v-model="keyWordData.remarks"
          placeholder="请输入活动备注"
          maxlength="30"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="move_footer">
      <el-button class="sureAdd" @click="sureAdd('addForm')" type="primary" round>确 定</el-button>
      <el-button class="noAdd" @click="noAdd">取 消</el-button>
    </div>
  </div>
</template>

<script>
import selectProject from "./selectProject/selectProject.vue";
import uploadImg from "@/components/uploadImg.vue";
export default {
  components: { selectProject, uploadImg },
  data() {
    return {
      addRules: {
        company: [
          { required: true, message: "请选择公司", trigger: "change" }
        ],
        activityName: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        link: [{ required: true, message: "请输入H5链接", trigger: "blur" }],
        activityTime: [
          { required: true, message: "请选择活动时间", trigger: "change" }
        ],
        position: [
          { required: true, message: "请选择活动位置", trigger: "change" }
        ],
        cover: [{ required: true, message: "请上传图片", trigger: "blur" }],
        idStr: [{ required: true, message: "请选择项目", trigger: "blur" }]
        // remarks:[{ required: true, message: "请输入活动备注", trigger: "blur" }],
      },
      keyWordData: {}, //form数据对象
      isControlCompany: {},
      setActivityTime: "2", // 是否设置倒计时
      isSelectCompany: false, //是否禁止选择公司
      selectProjectBox: false, // 选择项目弹框
      selectProjectBox1: true,
      companyId: "", // 传给项目选择的公司id
      editActivityData: {}, // 编辑活动的时候传给选择项目的活动的数据
      writeDownData: {}, //
      isCustom:1,
      urlArr: []
    };
  },
  props: ["companyData", "editData"],
  created() {
    console.log(this.editData);
    this.urlArr=[]
    if (this.editData && this.editData.checkId == 1) {
      this.isSelectCompany = true;
      // debugger
      if (
        !this.editData.effectiveStartTime ||
        !this.editData.effectiveEndTime
      ) {
        this.setActivityTime = "2";
      } else {
        this.setActivityTime = "1";
        this.$set(this.keyWordData, "activityTime", [
          this.editData.effectiveStartTime,
          this.editData.effectiveEndTime
        ]);
      }
      this.$set(this.keyWordData, "company", this.editData.companyId);
      this.$set(this.keyWordData, "position", this.editData.positionId);
      this.$set(this.keyWordData, "remarks", this.editData.remarks);
      this.$set(this.keyWordData, "activityName", this.editData.activity_name);
      this.$set(this.keyWordData, "link", this.editData.link);
      this.$set(this.keyWordData, "cover", this.editData.cover);
      this.urlArr.push(this.editData.cover)
      this.$set(this.keyWordData, "bcaId", this.editData.id);
      this.getProjectIds();
    } else {
      this.defaultForm();
    }
  },
  methods: {
    clickProject_Img(str, picIndex) {
      this.$refs[str].click();
    },
    deleteImg() {
      this.keyWordData.cover = "";
      this.urlArr = [];
    },
    getDataUrl(url) {
      if (!this.keyWordData.cover) {
        if (url && url.length > 1) {
          this.alertMessage("info", "只能上传一张图片", 1500);
          return;
        } else if (url && url.length == 1) {
          this.keyWordData.cover = url[0].path;
          this.urlArr.push(url[0].path);
        }
      }else{
          this.alertMessage("info", "只能上传一张图片", 1500)
          return
      }
    },
    defaultForm() {
      let infoObj = JSON.parse(localStorage.getItem("myInfo"));
      this.isControlCompany = infoObj.dep;
      this.keyWordData = {
        company: infoObj.dep.companyId < 0 ? "" : infoObj.dep.companyId,
        activityName: "",
        position: 0,
        remarks: "",
        idStr: "",
        cover: "",
        link: ""
      };
    },
    sureAdd(form) {
      console.log(this.keyWordData);
      this.$refs[form].validate((valid, obj) => {
        if (valid) {
          let qs = require("qs");
          if (this.editData.checkId == 1) {
            this.$axios
              .put("/api/updateCustomActivities", qs.stringify(this.keyWordData))
              .then(res => {
                res = res.data;
                // debugger
                if (res.status === 200) {
                  this.alertMessage("success", "编辑成功", 1500);
                  this.defaultForm();
                  this.$emit("closeAddDialog", 1);
                } else {
                  this.alertMessage("warning", res.message, 1500);
                  return;
                }
              });
          } else {
            this.$axios
              .post("/api/addCustomActivities", qs.stringify(this.keyWordData))
              .then(res => {
                res = res.data;
                // debugger
                if (res.status === 200) {
                  this.alertMessage("success", "新增成功", 1500);
                  this.defaultForm();
                  this.$emit("closeAddDialog", 1);
                } else {
                  this.alertMessage("warning", res.message, 1500);
                  return;
                }
              });
          }
        } else {
          let toastMsg = this.addRules[Object.keys(obj)[0]][0].message;
          this.alertMessage("info", toastMsg, 2000);
          return;
        }
      });
    },
    noAdd() {
      this.defaultForm();
      this.$emit("closeAddDialog");
    },
    // 点击选择项目
    clickSelectProject() {
      if (this.editData.checkId != 1 && !this.keyWordData.company) {
        this.alertMessage("info", "请先选择公司", 1500);
        return;
      }
      if (this.editData.checkId == 1) {
        this.editActivityData.activityId = this.editData.id;
        // this.activityId = this.editData.id
      }
      // debugger
      this.selectProjectBox = true;
      this.selectProjectBox1 ? "" : (this.selectProjectBox1 = true);
      this.companyId = this.keyWordData.company;
    },
    // 确认选择项目
    selectedProject(data) {
      this.$set(this.keyWordData, "idStr", data.str);
      this.$set(this.keyWordData, "itemList", data.idStr);
      this.selectProjectBox = false;
      // this.selectProjectBox1 = true
      this.writeDownData = data;
    },
    // 关闭选择项目框
    clickClose() {
      this.selectProjectBox = false;
      this.selectProjectBox1 = false;
    },
    // 编辑活动的时候请求项目接口
    getProjectIds() {
      this.$axios
        .get("/api/customActivityQueryItem", {
          params: { id: this.editData.id }
        })
        .then(res => {
          res = res.data;
          // debugger
          if (res.status === 200) {
            this.$set(this.keyWordData, "idStr", res.data[0].idStr);
            this.$set(this.keyWordData, "itemList", res.data[0].id);
            this.editActivityData = res.data[0];
          }
        });
    }
  },
  computed: {
    isShowTime() {
      if (this.setActivityTime == "1") {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.addCustom-main {
  position: relative;
  .addCustom-picture {
    width: 200px;
    height: 58px;
    background-color: #e3e3e3;
    line-height: 30px;
    padding-top: 1px;
    > span {
      line-height: 25px;
      margin-left: 74px;
      &:nth-of-type(1) {
        width: 20px;
        height: 20px;
        line-height: 14px;
        margin-left: 92px;
        margin-top: 10px;
        display: block;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        border: 1px solid #a0a0a0;
        font-size: 24px;
        color: #b2b2b2;
      }
    }
  }
  .addCustom-mask {
    width: 200px;
    height: 58px;
    position: absolute;
    left: 211px;
    top: 0;
    img {
      width: 200px;
      height: 58px;
      background-color: red;
    }
    &:hover {
      .mask {
        display: block;
      }
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
        margin: 9px auto;
        font-size: 0;
        text-align: center;
        .font-btn {
          display: inline-block;
          height: 40px;
          width: 50%;
          padding: 0 20px;
          box-sizing: border-box;
          &:last-child {
            position: relative;
            .line {
              content: "";
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
  }
}
.select-project {
  /deep/ .el-dialog {
    height: 612px;
    .el-icon-close {
      position: absolute;
      right: 8px;
      top: 7px;
      font-size: 20px;
      color: #949494;
      cursor: pointer;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
}
/deep/ .position-project {
  // width: 280px;
  .el-form-item__content {
    width: 265px !important;
    .el-input {
      width: 170px;
      .el-input__inner {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .el-button {
      height: 30px;
      padding: 7px 16px;
    }
  }
}
/deep/ .el-form {
  position: relative;
  label {
    display: inline-block;
    width: 82px;
    text-align: justify;
    text-justify: inter-ideograph;
    text-align-last: justify;
    font-weight: normal;
    color: #666;
  }
  .el-form-item {
    &:nth-last-child(1) {
      display: block;
    }
    &:nth-of-type(5) {
      .el-form-item__content {
        width: 600px;
      }
    }
  }
  .el-form-item__content {
    width: 264px;
    .el-select {
      width: 100%;
    }
    .el-textarea {
      width: 630px;
    }
    .el-input__inner {
      width: 100%;
    }
  }
}
/deep/ .el-date-editor {
  .el-range-separator,
  .el-range__icon {
    line-height: 23px;
  }
  .el-range-input {
    width: 108px;
  }
  .el-input__icon {
    &:nth-of-type(2) {
      display: none;
    }
  }
}
</style>