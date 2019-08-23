<template>
  <div>
    <div class="edit-center">
      <h4>联系人</h4>
      <ul>
        <li v-for="(item,index) in addData" :key="index">
          <el-input v-model="item.name" maxlength="8" placeholder="客户姓名"></el-input>
          <el-input
            v-model="item.phone"
            placeholder="电话号码"
            oninput="value=value.replace(/[^\d]/g,'')"
            @blur="checkPhone(index)"
            maxlength="11"
          ></el-input>

          <el-select
            v-model="item.relationshipId"
            placeholder="请选择"
            v-if="baseInfo[221]"
            @change="changeRelation"
          >
            <el-option key="index" label="本人" value="1" v-if="index == 0"></el-option>
            <el-option
              v-if="index != 0"
              v-for="val in baseInfo[221].children"
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
    <div class="base-info">
      <h4>基本资料</h4>
      <div class="customer_registered" v-if="baseInfo[211]">
        {{baseInfo[211].value}}：
        <el-radio-group v-model="registration">
          <el-radio v-for="(item,index) in baseInfo[211].children" :label="item.key">{{item.value}}</el-radio>
        </el-radio-group>
      </div>
      <div class="customer_status" v-if="baseInfo[216]">
        {{baseInfo[216].value}}：
        <el-radio-group v-model="status">
          <el-radio v-for="(item,index) in baseInfo[216].children" :label="item.key">{{item.value}}</el-radio>
        </el-radio-group>
      </div>
      <div class="if_lock" v-if="baseInfo[346]">
        {{baseInfo[346].value}}：
        <el-radio-group v-model="if_lock">
          <el-radio v-for="(item,index) in baseInfo[346].children" :label="item.key">{{item.value}}</el-radio>
        </el-radio-group>
      </div>
      <div class="score" v-if="baseInfo[200]">
        客户来源：
        <el-select v-model="source" placeholder="请选择">
          <el-option
            v-for="(item,index) in baseInfo[200].children"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="customer_intention">
      <h4>客户意向</h4>
      <div>
        <div>
          <span v-if="baseInfo[231]">
            <i>价格区间:</i>
            <el-select v-model="price" placeholder="请选择价格区间">
              <el-option
                v-for="(item,index) in baseInfo[231].children"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </span>

          <span v-if="baseInfo[250]">
            <i>面积区间:</i>
            <el-select v-model="area" placeholder="请选择面积区间">
              <el-option
                v-for="(item,index) in baseInfo[250].children"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </span>
          <span v-if="baseInfo[257]">
            <i>意向户型:</i>
            <el-select v-model="type_intention" placeholder="请选择意向户型">
              <el-option
                v-for="(item,index) in baseInfo[257].children"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </span>
        </div>
        <div>
          <span v-if="baseInfo[288]">
            <i>购房目的:</i>
            <el-select v-model="buy_purpose" placeholder="请选择购房目的">
              <el-option
                v-for="(item,index) in baseInfo[288].children"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </span>
          <span v-if="areaIntentioninfo">
            <i>意向区域:</i>
            <el-select v-model="area_intention" placeholder="请选择意向区域">
              <el-option
                v-for="(item,index) in areaIntentioninfo"
                :label="item.AreaName"
                :value="item"
              ></el-option>
            </el-select>
          </span>
          <span v-if="baseInfo[284]">
            <i>购房意愿:</i>
            <el-select v-model="buy_intention" placeholder="请选择购房意愿">
              <el-option
                v-for="(item,index) in baseInfo[284].children"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </span>
        </div>
        <div>
          <span v-if="baseInfo[292]">
            <i>居住人数:</i>
            <el-select v-model="live" placeholder="请选择居住人数">
              <el-option
                v-for="(item,index) in baseInfo[292].children"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </span>
          <span class="yixiangPro">
            <i>意向项目:</i>
            <el-input v-model="pro_intention" maxlength="11" placeholder="请选择意向项目" readonly></el-input>
            <el-button @click="chosePro">项目选择</el-button>
          </span>
        </div>
        <div class="clearfix">
          <span class="fl">客户备注:</span>
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="remark" class="fl"></el-input>
        </div>
      </div>
    </div>

    <div class="move_footer">
      <el-button class="sureAdd" @click="sureAdd">确 定</el-button>
      <el-button class="noAdd" @click="cancel">取 消</el-button>
    </div>
    <el-dialog
      title="选择项目"
      append-to-body
      :before-close="handleClose"
      class="operation-project"
      :visible.sync="projectDialog"
    >
      <customer-project @noSelect="noSelect" :avgPrice="avgPrice" @selectProject="selectProject"></customer-project>
    </el-dialog>
  </div>
</template>

<script>
import customerProject from "./customer-projectList.vue";
export default {
  data() {
    return {
      addData: [
        {
          name: "",
          phone: "",
          relationshipId: "1"
        }
      ],
      baseInfo: [], //基本信息
      areaIntentioninfo: [], //
      registration: "", //客户登记
      status: "", //客户状态
      if_lock: "", //是否锁定
      source: "", //客户来源
      price: "", //价格区间
      area: "", //面积区间
      type_intention: "", //意向户型
      buy_purpose: "", //购房目的

      buy_intention: "", //购房意愿
      area_intention: "", //意向区域
      live: "", //居住人数
      pro_intention: "", //意向项目
      pro_intentionId: "", //意向项目id
      projectDialog: false, //选择项目的
      avgPrice: [], //用于意向项目的均价
      remark: "", //备注
      userData: "",
      toUserType: ""
    };
  },
  created() {
    //获取用户类型
    this.userData = JSON.parse(localStorage.getItem("myInfo"));
    this.toUserType = this.userData.companyType;
    if (this.toUserType === 2) {
      this.getPopupListAjax([
        200,
        211,
        216,
        231,
        250,
        257,
        284,
        288,
        292,
        317,
        221
      ]);
    } else {
      this.getPopupListAjax([
        200,
        211,
        216,
        346,
        231,
        250,
        257,
        284,
        288,
        292,
        317,
        221
      ]);
    }
    this.getAreaIntention();
  },
  methods: {
    checkPhone() {},
    changeRelation(val) {},
    addItem() {
      let params = {
        name: "",
        phone: "",
        relationshipId: ""
      };
      if (this.addData.length < 3) {
        this.addData.push(params);
      } else {
        this.alertMessage("warning", "最多添加三个");
      }
    },
    removeItem(index) {
      this.addData.splice(index, 1);
    },
    sureAdd() {
      let param = {
        level: this.registration,
        state: this.status,
        sourceId: this.source,
        remark: this.remark, //备注
        linkmans: this.addData, //人
        priceId: this.price,
        acreageId: this.area,
        houseType: this.type_intention,
        buildingId: this.pro_intentionId, //意向项目
        district: this.area_intention.key,
        districtName: this.area_intention.AreaName, //意向区域名称
        houseIntent: this.buy_intention,
        houseReason: this.buy_purpose,
        housePeople: this.live
      };
      if (this.toUserType !== 2) {
        param = Object.assign({}, param, {
          isLock: this.if_lock
        });
      }
      let flage = true;
      this.addData.forEach(ele => {
        if (!ele.name) {
          flage = false;
          this.alertMessage("warning", "请将名字填写完整");
          return false;
        } else if (!ele.phone) {
          flage = false;
          this.alertMessage("warning", "请将电话填写完整");
          return false;
        } else if (!ele.relationshipId) {
          flage = false;
          this.alertMessage("warning", "请将关系填写完整");
          return false;
        } else if (!this.if_lock) {
          flage = false;
          this.alertMessage("warning", "请选择是否锁定");
          return false;
        } else {
          flage = true;
        }
      });
      flage ? this.getSubmit(param) : "";
    },
    getSubmit(param) {
      this.$ajax
        .postJSON("/api/customer", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.$emit("getTableData")
            this.alertMessage("success", "添加成功");
            this.$emit("changeShow", false);
          } else {
            this.alertMessage("warning", res.message);
          }
        })
        .catch(error => {
          console.log(error.response);
           this.alertMessage("warning","请求错误");
        });
    },
    cancel() {},
    // 点击出现选择弹窗
    chosePro() {
      this.projectDialog = true;
    },
    // 取消项目选择
    noSelect() {
      this.projectDialog = false;
    }, // 确认选取项目
    selectProject(data) {
      this.pro_intention = data.name;
      this.pro_intentionId = data.id;
      this.projectDialog = false;
    },
    // 请求数据字典
    getPopupListAjax(parentId) {
      let param = {
        parentId: parentId
      };
      let url = "dictionary";
      if (typeof parentId === "object") {
        parentId = parentId.join(",");
        url = "dictionary/list";
        param = {
          ids: parentId
        };
      }
      this.$ajax
        .get("/api/" + url, param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.avgPrice = res.data["317"].children;
            this.baseInfo = res.data;
            this.registration = res.data[211].children[0].key; //默认值
            this.status = res.data[216].children[0].key; //默认值
            this.if_lock =
              res.data[346].children[0].key == 1
                ? res.data[346].children[0].key
                : res.data[346].children[1].key;
            this.source = res.data[200].children[0].key;
            this.userInfo = res.data["221"].children;
            this.userInfo.shift();
          }
        })
        .catch(error => {
          // this.handleError(error);
        });
    },
    // 请求意向区域
    getAreaIntention() {
      let param = {
        cityID: this.userData.cityId || 1
      };
      this.$ajax
        .get("/api/resource/area", param)
        .then(res => {
          console.log(12345);
          console.log(res);
          res = res.data;
          if (res.status === 200) {
            this.areaIntentioninfo = res.data;
          } else {
            this.alertMessage("warning", res.message);
            return;
          }
        })
        .catch(err => {});
    },
    handleClose(done) {
      done();
    }
  },
  components: {
    customerProject
  }
};
</script>
<style lang="scss" scoped>
h4 {
  font-weight: 700;
}
.edit-center {
  > ul {
    margin: 15px 0 0 20px;
    li {
      &:nth-of-type(1) {
        position: relative;
        &::before {
          content: "*";
          font-size: 22px;
          position: absolute;
          top: 4px;
          left: -15px;
          color: #ff3b2c;
        }
      }
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
        margin-right: 30px;
        .el-icon-arrow-up {
          line-height: 0;
          &::before {
            content: "\E60C";
            color: #575757;
          }
        }
      }
      /deep/ .el-select {
        .el-input {
          margin-right: 0;
          /deep/ .el-input__inner {
            width: 135px;
          }
        }
      }
    }
  }
}
.base-info {
  margin-top: 20px;
  > h4 {
    margin-bottom: 10px;
  }
  > div {
    margin: 10px 0 10px 20px;
    color: #666;
    /deep/ .el-radio-group {
      margin-left: 5px;
      /deep/ .el-radio {
        width: 65px;
        color: #333;
      }
    }
  }
  /deep/ .el-input .el-input__inner {
    width: 120px;
  }
  .if_lock {
    position: relative;
    &::before {
      content: "*";
      font-size: 22px;
      position: absolute;
      top: -1px;
      left: -15px;
      color: #ff3b2c;
    }
  }
  .score {
    position: relative;
    &::before {
      content: "*";
      font-size: 22px;
      position: absolute;
      top: 4px;
      left: -15px;
      color: #ff3b2c;
    }
  }
}
.customer_intention {
  margin-top: 20px;
  > div {
    margin: 10px 0 10px 20px;
    color: #666;
    > div {
      margin-top: 10px;
      > span {
        margin-right: 15px;
      }
    }
    /deep/ .el-input .el-input__inner {
      width: 145px;
    }
    .yixiangPro {
      /deep/ .el-input {
        display: inline-block;
        width: auto;
      }
      /deep/ .el-button {
        padding: 0;
        width: 85px;
        height: 32px;
        line-height: 32px;
        color: #fff;
        margin-left: 10px;
        background-color: #72a0d1;
      }
    }
  }
  /deep/ .el-textarea {
    width: 70%;
  }
}
</style>