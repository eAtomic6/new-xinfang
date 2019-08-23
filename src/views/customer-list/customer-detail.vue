<!-- 客源列表的客户详情 -->
<template>
  <div class="customer-detail .w-select">
    <div class="detail-left fl">
      <ul>
        <li>
          <h4>基本信息
            <el-button type="primary" class="but-lightblue fr" @click.native="editCustomer">
              <i class="icon icon-bianji"></i> 编辑
            </el-button>
          </h4>
          <p>
            <label>客户编号:</label>
            <span>{{detailForm.c_no}}</span>
          </p>
          <p class="detail-customerState">
            <label>客户状态:</label>
            <span>
              <i>{{detailForm.level}}</i>&nbsp;
              <i>{{detailForm.state}}</i>&nbsp;
              <i v-html="detailForm.lock_state_zh == '锁定' ? '受保护' : '不受保护'" v-if="isUplus != 1 && isUplus != 2"></i>
            </span>
          </p>
          <p>
            <label>客户来源:</label>
            <span>{{detailForm.source}}</span>
          </p>
          <p>
            <label>客户备注:</label>
            <span class="remark">{{detailForm.remark}}</span>
          </p>
        </li>
        <li>
          <h4>客户意向</h4>
          <p>
            <label>价格区间:</label>
            <span>{{detailForm.house_price}}</span>
          </p>
          <p>
            <label>面积区间:</label>
            <span>{{detailForm.house_acreage}}</span>
          </p>
          <p>
            <label>意向户型:</label>
            <span>{{detailForm.house_type}}</span>
          </p>
          <p>
            <label>居住人数:</label>
            <span>{{detailForm.people_count}}</span>
          </p>
          <p>
            <label>意向区域:</label>
            <span>{{detailForm.district_name}}</span>
          </p>
          <p>
            <label>意向项目:</label>
            <span>{{detailForm.b_name}}</span>
          </p>
          <p>
            <label>购房意愿:</label>
            <span>{{detailForm.house_intent}}</span>
          </p>
          <p>
            <label>购房目的:</label>
            <span>{{detailForm.house_reason}}</span>
          </p>
        </li>
        <li>
          <h4>跟进信息</h4>
          <p v-if="isUplus != 1">
            <label>录 入 信 息:</label>
            <span>{{detailForm.creator_name}}-{{detailForm.creator_dep_name}}<br>
           {{detailForm.create_time}}</span>
          </p>
          <p v-if="isUplus == 1">
            <label>转 入 信 息:</label>
            <span>{{detailForm.transferor_name}}-{{detailForm.transferor_dep_name}}<br>
           {{detailForm.create_time}}</span>
          </p>
          <p v-if="isUplus != 1">
            <label>维 护 专 员:</label>
            <span>{{detailForm.owner_name}}-{{detailForm.owner_dep_name}}</span>
          </p>
          <p v-if="isUplus == 1">
            <label>联 动 专 员:</label>
            <span>{{detailForm.e_name}}-{{detailForm.d_name}}</span>
          </p>
          <p>
            <label>最后带看人:</label>
            <span>
              <i v-if="lastLookInfo">
                {{lastLookInfo.pc_name}}-{{lastLookInfo.pc_dep_name}}
                <br>
                {{lastLookInfo.look_time}}
              </i>
            </span>
          </p>
        </li>
      </ul>
    </div>
    <div class="detail-right fr">
      <div class="detail-right-top">
        <ul>
          <li v-for="item of detailForm.progress" :key="item.id" :class="{'on':item.view}">
            <em class="c-big">
              <em class="c-small"></em>
            </em>
            <p class="black-g">{{item.name}}</p>
          </li>
        </ul>
      </div>
      <div class="detail-right-center">
        <div class="center-top">
          <el-button type="warning" @click="writeFollow">
            <i class="icon icon-zengjia"></i>新增跟进
          </el-button>
          <el-button type="warning" @click="writeReport">
            <i class="icon icon-zengjia"></i>新增报备
          </el-button>
          <el-button type="warning" @click="writeLook">
            <i class="icon icon-zengjia"></i>新增带看
          </el-button>
        </div>
        <ul>
          <li v-for="(item,index) in addData" :key="index">
            <el-input v-model="item.name" maxlength="12" placeholder="客户姓名"></el-input>
            <el-input
              v-model="item.phone"
              placeholder="电话号码"
              oninput="value=value.replace(/[^\d]/g,'')"
              @blur="checkPhone(index)"
              maxlength="11"
            ></el-input>
            <el-select v-model="item.relationshipId" placeholder="请选择">
              <el-option
                v-for="item in relationData"
                :key="item.value"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
            <i v-if="index == 0" class="el-icon-circle-plus" @click="addItem"></i>
            <i v-else class="el-icon-remove" @click="removeItem(index)"></i>
          </li>
        </ul>
      </div>
      <div class="detail-right-footer">
        <el-tabs type="border-card" :before-leave="changeTabs">
          <el-tab-pane v-for="(item,index) in titleData" :key="index" :label="item">
            <el-table
              ref="multipleTable"
              :data="detailData"
              tooltip-effect="dark"
              style="width: 100%;"
              heigth="400"
              border
            >
              <el-table-column
                v-for="value in detailTableData[index]"
                :key="value.name"
                :label="value.name"
                :width="value.width"
                :show-overflow-tooltip="value.name=='目的描述' ? true : false"
              >
                <template slot-scope="scope">
                  <div v-if="value.name == '保护期'?scope.row.period_time : scope.row[value.value]">
                    <span v-if="value.name=='保护期'" 
                    v-html="scope.row.reporting_type == 1 ? scope.row[value.value] +'小时': scope.row.period_time"></span>
                    <span v-else-if="value.name == '内容'" v-html="scope.row[value.value]"></span>
                    <span v-else-if="value.name == '报备项目' || value.name == '带看项目'">{{scope.row[value.value]}}
                      <a v-if="scope.row[value.deletePower]"
                       @click="changeProject(value.name,scope.row)" style="color:blue;">修改</a></span>
                    <span v-else>{{scope.row[value.value]}}</span>
                  </div>
                  <div v-else>
                      <i class="el-icon-minus" style="font-weight:600"></i>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[10, 15, 20, 25]"
              :page-size="pageSize"
              layout="prev, pager, next,  total, sizes, jumper"
              :total="tableTotals"
            ></el-pagination>
          </el-tab-pane>
        </el-tabs>
        <div class="move_footer">
          <el-button class="sureAdd" @click="sureDetail">确 定</el-button>
          <el-button class="noAdd" @click="noDetail">取 消</el-button>
        </div>
      </div>
    </div>
    <div style="display:none">{{watchDetailChange}}</div>
  </div>
</template>

<script>
import { detailTableData, titleData } from "./detailTableData.js";
export default {
  data() {
    return {
      detailForm: {}, //详情数据
      addData: [], // 详情里面的记录数据
      titleData: titleData,
      detailTableData: detailTableData,
      detailData: [],
      lastLookInfo: {}, // 详情里面带看数据
      paginationObj: {}, //  详情table条件查询
      pageNum: 1,
      pageSize: 10,
      tableTotals: 0,
      operationObj: {}
    };
  },
  created() {
      this.addData = []
    this.getDetailData(this.customerId);
    this.paginationObj = {
      customerId: this.customerId,
      type: "0",
      pageNum: 1,
      pageSize: 10
    };
    // this.getDetailTable(this.paginationObj);
  },
  props: ["customerId", "relationData","isUplus"],
  methods: {
    getDetailData(id) {
        this.$axios
          .get(`/api/${this.isUplus == 1 ? 'third/uplus/customer/info' : 'prc/customer'}`, { params: { customerId: id } })
          .then(res => {
            res = res.data;
            if (res.status === 200) {
              this.detailForm = res.data;
              this.lastLookInfo = res.data.lastLookInfo;
              res.data.mobiles.forEach(val => {
                this.relationData.forEach(el => {
                  if (val.relation_id == el.value) {
                    val.relation_id = el.key;
                  }
                });
                this.addData.push({
                  name: val.linkman_name,
                  phone: val.linkman_phone,
                  relationshipId: val.relation_id
                });
                this.operationObj.name = this.detailForm.name;
                this.operationObj.phone = this.detailForm.phone;
                this.operationObj.state = this.detailForm.state;
                this.operationObj.customerId = this.customerId;
                this.$store.commit("setDetailUpload", 1);
              });
            } else {
              this.alertMessage("warning", res.message);
              return;
            }
          });
    },
    getDetailTable(type) {
      this.$axios.get("/api/records", { params: type }).then(res => {
        res = res.data;
        if (res.status === 200) {
          //   debugger
          this.detailData = res.data.list;
          this.tableTotals = res.data.total;
        }
      });
    },
    addItem() {
      if (this.addData.length > 2) {
        this.alertMessage("info", "最多添加三条数据");
        return;
      }
      let param = {
        name: "",
        phone: "",
        relationshipId: ""
      };
      this.addData.push(param);
    },
    removeItem(index) {
      this.addData.splice(index, 1);
    },
    //   点击写跟进的时
    writeFollow() {
      this.operationObj.type = "写跟进";
      this.$emit("followDialog", this.operationObj);
    },
    //   点击新增报备
    writeReport() {
      this.operationObj.type = "报备";
      this.$emit("followDialog", this.operationObj);
    },
    //   点击新增带看
    writeLook() {
      this.operationObj.type = "带看";
      this.$emit("followDialog", this.operationObj);
    },
    //   点击编辑按钮
    editCustomer() {
      let obj = {
        follow_state: this.detailForm.follow_state,
        creator_name: this.detailForm.creator_name,
        source: this.detailForm.source,
        state: this.detailForm.state,
        owner_name: this.detailForm.owner_name,
        isUplus:(this.isUplus == 1||this.isUplus == 3) ? "1" : "",
      };
      this.$emit("clickEditCustomer", obj);
    },
    changeTabs(newName, oldName) {
      // debugger
      this.paginationObj.type = newName;
      this.paginationObj.pageNum=1;
      this.getDetailTable(this.paginationObj);
    },
    // table当前页显示数量发生改变
    handleSizeChange(val) {
      this.paginationObj.pageSize = val;
      this.getDetailTable(this.paginationObj);
    },
    //   table当前页发生改变
    handleCurrentChange(val) {
      this.paginationObj.pageNum = val;
      this.getDetailTable(this.paginationObj);
    },
    // 点击确定按钮时
    sureDetail() {
      let count = 0;
      let isTrue = false;
      let param = {
        customerId: this.customerId,
        linkmans: []
      };
      let headers = {};
      headers["Content-Type"] = "application/json";
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
      param.linkmans = this.addData;
      // this.detailForm.mobiles = this.addData
      this.$axios
        .put("/api/update/customer/mobile", JSON.stringify(param), {
          headers: headers
        })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.$emit("getTableData")
            this.alertMessage("success", "编辑成功", 2000);
            this.$emit("close");
            // this.$store.commit("customerDefaultData", 2);
          } else {
            this.alertMessage("warning", res.message);
            return;
          }
        });
    },
    // 取消详情
    noDetail() {
      this.$emit("close");
    },
    //添加关系时对input手机号进行验证
    checkPhone(index) {
      let str = this.addData[index].phone;
      if (+str.charAt(0) != "1" || +str.length !== 11) {
        this.addData[index].phone = "";
        this.alertMessage("info", "手机号格式不正确");
        return;
      }
    },
    // 点击修改报备项目、带看项目
    changeProject(valueName,scope){
      // debugger
      scope.valueName = valueName
      this.$emit("changeProjectDialog",scope)
    }
  },
  computed: {
    watchDetailChange() {
      if (this.$store.state.detailUpload == 2) {
        this.addData = [];
        this.getDetailData(this.customerId);
        this.getDetailTable(this.paginationObj);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.customer-detail {
  height: 850px;
  .detail-left {
    width: 300px;
    height: 850px;
    overflow-y: auto;
    background-color: #e6e6e9;
    > ul {
      max-height: 850px;
      overflow-y: auto;
      overflow-x:hidden;
      li {
        &:nth-last-child(1) {
          label {
            width: 80px;
          }
          span {
            width: 190px;
          }
        }
        width: 300px;
        p {
          margin-left: 14px;
          margin-top: 8px;
          label {
            display: inline-block;
            width: 66px;
            float: left;
            color: #999999;
          }
          span {
            display: inline-block;
            width: 200px;
            word-wrap: break-all;
            word-break: break-all;
          }
          .remark {
            height: auto;
          }
        }
        h4 {
          font-weight: 700;
          width: 100%;
          height: 50px;
          line-height: 50px;
          border-bottom: 1px solid #d8d8d8;
          padding-left: 14px;
          margin-bottom: 20px;
        }
      }
    }
    .but-lightblue {
      width: 84px;
      height: 34px;
      margin-top: 8px;
      margin-right: 12px;
      border-radius: 3px;
    }
  }
  .detail-right {
    width: 600px;
    height: 850px;
    .detail-right-top {
      width: 100%;
      height: 100px;
      border-bottom: 1px solid #e6e6e9;
      padding-left: 10px;
      padding-top: 20px;
      ul > li {
        position: relative;
        float: left;
        width: 12%;
        text-align: center;
        em {
          display: inline-block;
          border-radius: 50%;
        }
        .c-big {
          z-index: 3;
          position: relative;
          width: 21px;
          height: 21px;
          background: #dedede;
          text-align: center;
        }
        .black-g {
          margin-top: 8px;
          color: #666666;
        }
        .c-small {
          margin-top: 4px;
          width: 13px;
          height: 13px;
          background: #9b9b9b;
        }

        &:before {
          z-index: 1;
          content: "";
          display: block;
          position: absolute;
          top: 10px;
          left: -33px;
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
    .detail-right-center {
      width: 100%;
      min-height: 100px;
      padding: 18px 0 0 18px;
      .center-top {
        .el-button {
          background-color: #fd8f00;
          width: 93px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          padding: 0;
          border-radius: 3px;
          margin-left: 10px;
          &:nth-of-type(1) {
            margin-left: 0;
          }
        }
      }
      > ul {
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
    .detail-right-footer {
      width: 100%;
      min-height: 400px;
      padding: 18px 18px 0 18px;
      .move_footer {
        margin-top: 15px;
      }
      /deep/ .el-tabs--border-card {
        border: none;
        box-shadow: none;
        .el-table__body-wrapper {
          width: 103%;
          height: 318px;
          overflow-y: scroll;
        }
        .el-tabs__header {
          background: #e8e8ee;
          border: none;
          .el-tabs__item {
            color: #333333;
          }
          .el-tabs__item.is-active {
            border-top: 2px solid #fda100;
            background-color: #fff;
            color: #333;
          }
        }
        .el-tabs__content {
          padding: 0;
          margin-top: 18px;
          min-height: 400px;
        }
      }
    }
  }
  .detail-customerState {
    label {
      margin-top: 2px;
    }
    i {
      display: inline-block;
      padding: 2px 5px;
      border: 1px solid #78a97a;
      color: #78a97a;
    }
  }
}
</style>
