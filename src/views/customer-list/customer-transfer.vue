<!-- 客户的批量转移弹框 -->
<template>
  <div class="customer-transfer">
    <p>
      你已选择了
      <span>{{managementCustomerArr.length}}位</span>客源
    </p>
    <label>转移至:</label>
    <el-select
      v-model="transferData"
      filterable
      remote
      reserve-keyword
      placeholder="请输入关键词"
      :remote-method="remoteMethod"
      :loading="loading"
      @change="chose()"
    >
      <el-option
        v-for="item in projectData"
        :key="item.e_id"
        :label="item.e_name"
        :value="item.d_name +','+item.e_id"
      ></el-option>
    </el-select>
    <span>{{chosePart}}团队</span>
    <div class="move_footer">
      <el-button class="sureAdd" @click="sureAdd">确 定</el-button>
      <el-button class="noAdd" @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      transferData: "",
      projectData: [],
      projectDataList: [],
      loading: false,
      defalutDepId: "", //部门的id
      managementCustomerArr: [], //选择客户的id
      chosePart: "", //接收人的部门
      receiverId: "" //接收人的Id
    };
  },

  created() {
    this.defalutDepId = JSON.parse(localStorage.getItem("myInfo")).depId; //获得部门id
    // 被转移人的id
    this.$store.state.managementCustomerChoice.forEach(element => {
      this.managementCustomerArr.push(element.id);
    });
    this.remoteMethod();
  },
  methods: {
    //   获得接收人的数据
    getTransferPersonnel(val) {
      let params = {
        depId: this.defalutDepId,
        keyword: val,
        type:1
      };
      this.$axios
        .get("/api/employee/departmentalIdQueryEmployees", { params: params })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.projectData = res.data;
          }
        });
    },
    // 接收人模糊搜索
    remoteMethod(query) {
      query = query ? query : "";
      this.getTransferPersonnel(query);
    },
    // 选择接收人
    chose() {
      this.chosePart = this.transferData.split(",")[0]; //接收人的部门
      this.receiverId = this.transferData.split(",")[1]; //接收人的id
    },
    // 点击确认按钮
    sureAdd() {
      let params = {
        customerArray: this.managementCustomerArr.join(","),
        receiverId: this.receiverId
      };
      let qs = require("qs");
      let headers = {};
      headers["Content-Type"] = "application/json";
      this.$axios.put("/api/batchTransfer", qs.stringify(params)).then(res => {
        res = res.data;
        if (res.status === 200) {
          // this.$store.commit("customerDefaultData", 2); //需要刷新列表
          this.$emit("getTableData")
          this.alertMessage("success", "转移成功");
          this.$emit("close", false,true);
        } else {
          this.alertMessage("warning", res.message);
        }
      });
    },
    // 点击取消
    cancel() {
      this.$emit("close", false,false);
    }
  }
};
</script>
<style lang='scss' scoped>
.customer-transfer {
  padding-top: 10px;
  p {
    margin-bottom: 20px;
    margin-left: 20px;
    color: #333333;
    font-weight: 700;
    span {
      color: #f84949;
    }
  }
  > label {
    color: #333333;
    font-weight: 700;
    margin-left: 20px;
  }
  /deep/ .el-input__inner {
    width: 137px;
    height: 30px !important;
  }
  > span {
    color: #333333;
    margin-left: 5px;
  }
  .move_footer {
    margin-top: 143px;
  }
}
</style>
