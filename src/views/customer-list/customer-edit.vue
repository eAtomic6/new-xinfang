<!-- 客源列表客户的编辑页面 -->
<template>
  <div class="customer-edit">
    <div class="edit-top">
      <h4>基本资料</h4>
      <el-form
        :model="editFormObj"
        :rules="rules"
        ref="editFormObj"
        :inline="true"
        label-width="100px"
        class="demo-dynamic"
      >
        <el-form-item label="客户等级:" prop="level" class="afterContent">
          <el-select
            v-model="editFormObj.level"
            placeholder="请选择"
            v-if="dictionaryData['211'].children"
          >
            <el-option
              v-for="item in dictionaryData['211'].children"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户状态:" class="afterContent">
          <el-select v-model="editFormObj.state" placeholder="请选择">
            <el-option label="有效" :value="1"></el-option>
            <el-option label="暂缓" :value="2"></el-option>
            <el-option label="无效" :value="3"></el-option>
            <el-option label="失效" :value="4"></el-option>
            <el-option v-if="editFormObj1.isUplus ==1 ? false : editFormObj.deleteCustomerPower " label="删除" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户来源:" class="afterContent">
          <span>{{editFormObj1.source}}</span>
        </el-form-item>
        <el-form-item label="录 入 人:" class="afterContent" v-if="editFormObj1.isUplus == 1">
          <span>{{editFormObj1.creator_name}}</span>
        </el-form-item>
        <el-form-item label="转 入 人:" class="afterContent" v-if="editFormObj1.isUplus != 1">
          <span>{{editFormObj.transferor_name}}</span>
        </el-form-item>
        <el-form-item label="维 护 人:" class="afterContent" v-if="editFormObj1.isUplus == 1">
          <span>{{editFormObj1.owner_name}}</span>
        </el-form-item>
        <el-form-item label="联动专员:" class="afterContent" v-if="editFormObj1.isUplus != 1">
          <span>{{editFormObj.eName}}</span>
        </el-form-item>
        <el-form-item label="客户备注:" class="afterContent">
          <el-input
            type="textarea"
            v-model="editFormObj.remark"
            maxlength="200"
            placeholder="内容不多于200个字"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="edit-center">
      <h4>联系人</h4>
      <ul>
        <li v-for="(item,index) in addData" :key="index">
          <el-input v-model="item.name" placeholder="客户姓名"></el-input>
          <el-input
            v-model="item.phone"
            placeholder="电话号码"
            @blur="checkPhone(index)"
            oninput="value=value.replace(/[^\d]/g,'')"
            maxlength="11"
          ></el-input>
          <el-select
            v-model="item.relationshipId"
            placeholder="请选择"
            v-if="dictionaryData['221'].children"
          >
            <el-option
              v-for="val in dictionaryData['221'].children"
              :key="val.value"
              :label="val.value"
              :value="val.key"
            ></el-option>
          </el-select>
          <i v-if="index == 0" class="el-icon-circle-plus" @click="addItem"></i>
          <i v-else class="el-icon-remove" @click="removeItem(index)"></i>
        </li>
      </ul>
    </div>
    <div class="edit-footer">
      <h4>客户意向</h4>
      <el-form
        :model="editFormObj"
        :rules="rules"
        ref="editFormObj"
        :inline="true"
        label-width="100px"
        class="demo-dynamic"
      >
        <el-form-item label="价格区间:" class="afterContent">
          <el-select
            v-model="editFormObj.priceId"
            placeholder="请选择"
            v-if="dictionaryData['231'].children"
          >
            <el-option
              v-for="item in dictionaryData['231'].children"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面积区间:" class="afterContent">
          <el-select
            v-model="editFormObj.acreageId"
            placeholder="请选择"
            v-if="dictionaryData['250'].children"
          >
            <el-option
              v-for="item in dictionaryData['250'].children"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="意向户型:" class="afterContent">
          <el-select
            v-model="editFormObj.houseType"
            placeholder="请选择"
            v-if="dictionaryData['257'].children"
          >
            <el-option
              v-for="item in dictionaryData['257'].children"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="意向区域:" class="afterContent">
          <el-select v-model="districtStr" @change="districtChange" placeholder="请选择">
            <el-option
              v-for="item in priceAreaData"
              :key="item.value"
              :label="item.AreaName"
              :value="item.ID+','+ item.AreaName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="购房意愿:" class="afterContent">
          <el-select
            v-model="editFormObj.houseIntent"
            placeholder="请选择"
            v-if="dictionaryData['284'].children"
          >
            <el-option
              v-for="item in dictionaryData['284'].children"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="购房目的:" class="afterContent">
          <el-select
            v-model="editFormObj.houseReason"
            placeholder="请选择"
            v-if="dictionaryData['288'].children"
          >
            <el-option
              v-for="item in dictionaryData['288'].children"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="居住人数:" class="afterContent">
          <el-select
            v-model="editFormObj.housePeople"
            placeholder="请选择"
            v-if="dictionaryData['292'].children"
          >
            <el-option
              v-for="item in dictionaryData['292'].children"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="意向项目:" class="afterContent">
          <el-input placeholder="请选择意向项目" v-model="editFormObj.buildingId_zh" :disabled="true"></el-input>
          <el-button class="sureAdd select-project" @click="selectProject">项目选择</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="operation-btn move_footer">
      <el-button
        class="sureAdd active"
        v-if="editFormObj1.isUplus == 1 ? false : editFormObj1.follow_state == '结算'"
        @click="showActive"
      >激 活</el-button>
      <el-button class="sureAdd" @click="sureEdit">确 定</el-button>
      <el-button class="noAdd" @click="noEdit">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { RULE } from "./detailTableData.js";
export default {
  data() {
    return {
      rules: RULE,
      dialogVisible: true,
      editFormObj: {},
      addData: [],
      priceAreaData: [],
      districtStr: ""
    };
  },
  props: ["customerId", "dictionaryData", "editFormObj1", "projectObj"],
  created() {
    this.getEditForm(this.customerId);
    this.getAreaData();
    console.log( this.editFormObj1);
    console.log(this.editFormObj1.isUplus,1111111111111);
  },
  methods: {
    //   获取详情默认数据
    getEditForm(id) {
      this.$axios
        .get("/api/customer/details", { params: { customerId: id } })
        .then(res => {
          res = res.data;
          //   debugger
          if (res.status === 200) {
            this.editFormObj = res.data;
            // this.projectObj.b_name = this.editFormObj.buildingId_zh;//进来的时候把意向项目复制给客户意向
            this.districtStr = res.data.districtName;
            this.addData = res.data.linkmans;
          }
        });
    },
    //   获取意向区域数据
    getAreaData() {
      let cityID = JSON.parse(localStorage.getItem("myInfo")).cityId;
      this.$axios
        .get("/api/resource/area", { params: { cityID: cityID || 1} })
        .then(res => {
          res = res.data;
          //   debugger
          this.priceAreaData = res.data;
        });
    },
    //   添加联系人
    addItem() {
      if (this.addData.length > 2) {
        this.alertMessage("info", "最多添加三条信息");
        return;
      }
      let param = {
        name: "",
        phone: "",
        relationshipId: ""
      };
      this.addData.push(param);
    },
    //   删除联系人
    removeItem(index) {
      this.addData.splice(index, 1);
    },
    //   点击确认按钮
    sureEdit(int) {
      let count = 0;
      let isTrue = false;
      let headers = {};
      headers["Content-Type"] = "application/json";
      // this.editFormObj.buildingId = this.projectObj.b_id;
      this.editFormObj.linkmans = this.addData;
      this.addData.forEach(res => {
        if (res.relation_id == 1) {
          count++;
        }
        if (!res.name || !res.phone || !res.relationshipId) {
          isTrue = true;
        }
      });
      if (count > 1) {
        this.alertMessage("info", "本人信息不能超过一条", 2000);
        return;
      }
      if (isTrue) {
        this.alertMessage("info", "请完善添加信息", 2000);
        return;
      }
      if(int != 1 && this.editFormObj.state == "5"){
          this.$emit("showDeleteDlg",this.editFormObj.linkmans[0])
      }else{
        this.$axios
          .put("/api/customer", JSON.stringify(this.editFormObj), {
            headers: headers
          })
          .then(res => {
            res = res.data;
            
            //   debugger
            if (res.status === 200) {
              this.$emit("noEditCustomer");
              this.$store.commit("setDetailUpload", 2);
              if(this.editFormObj.state == "5"){
                this.$emit("close")
                this.$emit("getTableData")
                // this.$store.commit("customerDefaultData", 2);
                this.alertMessage("success", "删除成功");
              }else{
                this.alertMessage("success", "编辑成功");
              }
            } else {
              this.editFormObj.state == "5" ? this.$emit("delAlerMessage",res.message) : 
              this.alertMessage("warning", res.message);
              return;
            }
          });
      }
    },
    //   意向区域选择改变时
    districtChange(val) {
      this.editFormObj.district = val.split(",")[0];
      this.districtStr = val.split(",")[1];
      this.editFormObj.districtName = val.split(",")[1];
    },
    //   点击选择项目
    selectProject() {
      //   debugger
      this.$emit("projectSelect");
    },
    //   点击激活按钮
    showActive() {
      let str = "";
      this.addData.forEach(val => {
        if (val.relationshipId == 1) {
          str = val.name + " " + val.phone;
        }
      });
      if (str) {
        this.$emit("showActiveDialog", str);
      } else {
        this.alertMessage("warning", "请添加本人信息");
        return;
      }
    },
    noEdit() {
      this.$emit("noEditCustomer");
    },
    //添加关系时对input手机号进行验证
    checkPhone(index) {
      let str = this.addData[index].phone;
      if (+str.charAt(0) != "1" || +str.length !== 11) {
        this.addData[index].phone = "";
        this.alertMessage("info", "手机号格式不正确");
        return;
      }
    }
  },
  watch: {
    projectObj(val){
      // debugger
      this.editFormObj.buildingId_zh = val.b_name
      this.editFormObj.buildingId = val.b_id
    }
  },
};
</script>
<style lang='scss' scoped>
.customer-edit {
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
  .edit-top {
    /deep/ .el-form {
      .el-form-item {
        .el-select {
          margin-right: 50px;
          .el-input__inner {
            width: 114px;
          }
        }
        &:nth-of-type(2) {
          margin-right: 0;
          width: 226px;
          .el-form-item__content {
            width: 118px;
          }
        }
        &:nth-of-type(3),
        &:nth-of-type(4),
        &:nth-of-type(5) {
          span {
            display: inline-block;
            width: 110px;
          }
        }
        &:nth-of-type(4) {
          margin-right: 64px;
        }
        .el-textarea {
          .el-textarea__inner {
            width: 590px;
            height: 75px;
          }
        }
      }
    }
  }
  .edit-center {
    > ul {
      margin-left: 5px;
      margin-top: 15px;
      li {
        /deep/ .el-icon-circle-plus,
        .el-icon-remove {
          font-size: 30px;
          color: #c8c8c8;
          position: absolute;
          margin-left: 18px;
          cursor: pointer;
        }
        margin-bottom: 10px;
        height: 30px;
        /deep/ .el-input {
          width: 134px;
          .el-icon-arrow-up {
            line-height: 0;
            &::before {
              content: "\E60C";
              color: #575757;
            }
          }
        }
      }
    }
  }
  .edit-footer {
    margin-top: 15px;
    /deep/ .el-form {
      margin-top: 10px;
      .el-form-item {
        .el-input__inner {
          width: 136px;
          height: 30px !important;
        }
        label {
          display: inline-block;
          width: 80px !important;
        }
        &:nth-last-child(1) {
          .el-input {
            width: auto;
          }
        }
      }
    }
  }
  .operation-btn {
    .sureAdd,
    .noAdd {
      margin-left: 34px;
    }
    .active {
      background-color: #f85951;
    }
  }

  /deep/ .el-form {
    label {
      color: #666666;
      font-weight: normal;
      display: inline-block;
      width: 80px;
    }
    .el-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>