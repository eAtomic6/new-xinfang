<!-- 客源列表头部 -->
<template>
  <div class="w-select">
    <el-form :inline="true" :model="formData" class="demo-form-inline listForm">
      <el-form-item label="部门:" v-if="!isUplus">
        <el-select v-model="formData.depName" placeholder="部门条件搜索" class="tree-input">
          <el-option value>
            <el-tree
              :data="departmentData"
              :props="departmentProp"
              node-key="DepartOnlyCode"
              check-on-click-node
              :expand-on-click-node="false"
              @node-click="clickNode"
            ></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="公司:" v-if="isUplus == 3">
        <el-select
          v-model="formData.companyId"
          placeholder="公司搜索"
          class="tree-input"
          @change="selectCompany"
        >
          <el-option label="全部" value></el-option>
          <el-option
            v-for="item in allCompanyData"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
            <el-form-item label="U+:" v-if="isUplus == 1">
        <el-select v-model="formData.depName" placeholder="u+部门条件搜索" class="tree-input">
          <el-option value>
            <el-tree
              :data="uplusDepData"
              :props="uplusDataProp"
              node-key="DepartOnlyCode"
              check-on-click-node
              :expand-on-click-node="false"
              @node-click="clickUplusNode"
            ></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="渠道:" v-if="isUplus == 2">
        <el-select
          v-model="formData.depId"
          placeholder="渠道搜索"
          class="tree-input"
          @change="channelChange"
        >
          <el-option label="全部" value></el-option>
          <el-option v-for="item in channelData" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="维护人:">
        <el-select
          v-model="formData.maintainerName"
          filterable
          remote
          reserve-keyword
          :clearable="true"
          placeholder="请选择维护人"
          :remote-method="querySearch"
          @change="handleSelect"
        >
          <el-option
            v-for="item in maintainerData"
            :key="item.e_id"
            :label="item.e_name+'('+item.d_name+')'"
            :value="item.e_id+'-'+item.e_name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户进展:">
        <el-select v-model="formData.followState">
          <el-option label="全部" value></el-option>
          <el-option
            v-for="item in customerDevelop"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="统计日期:">
        <el-select v-model="formData.status" placeholder="不限">
          <el-option label="全部" value></el-option>
          <el-option
            v-for="item in staticData"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="tongjiTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="客户级别:">
        <el-select v-model="formData.level" placeholder="不限">
          <el-option label="全部" value></el-option>
          <el-option v-for="item in levelData" :key="item.id" :label="item.value" :value="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公客池:" v-if="isUplus == 3">
        <el-select v-model="formData.maleGuestType" placeholder="不限">
          <el-option label="全部" value=""></el-option>
          <el-option label="公司公客" :value="1"></el-option>
          <el-option label="部门公客" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="锁定筛选:" v-if="!isUplus">
        <el-select v-model="formData.lockSelection" placeholder="不限">
          <el-option label="全部" value></el-option>
          <el-option label="锁定" :value="1"></el-option>
          <el-option label="未锁定" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键词:" class="query-keyword">
        <el-input
          v-model="formData.keyword"
          placeholder="请输入客户编号，手机，姓名全搜"
          class="input-long"
          maxlength="50"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="querySelect" class="search-but">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="resetQuery" class="chongzhi-but">重置</el-button>
      </el-form-item>
      <div v-if="!isUplus">
        <el-form-item>
          <el-upload
            class="upload-demo"
            action="/api/importingCustomersBatches"
            :on-change="handleChange"
            :file-list="fileList3"
            :on-success="uploadOnSuccess"
            :on-error="uploadOnError"
          >
            <el-button size="small" type="primary" class="but-lightblue">
              <i class="icon icon-daoru"></i>导入
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="template" class="but-lightblue">
            <i class="icon icon-moban"></i> 模板
          </el-button>
        </el-form-item>
        <el-form-item v-if="showTransferDialog">
          <el-button type="primary" @click="transfer" class="but-lightblue">
            <i class="icon icon-zhuanyi"></i> 批量转移
          </el-button>
        </el-form-item>
        <!-- 秦星星加 B -->

        <el-form-item>
          <el-button type="info" @click="add_customer" class="but-lightblue">新增客户</el-button>
        </el-form-item>
        <!-- 秦星星加 E -->
      </div>
      <!-- <el-form-item>
                    <el-button type="primary" @click="outputExcel" class="but-lightblue"><span class="icon icon-daochu org-icon"></span>导出</el-button>
      </el-form-item>-->
    </el-form>
    <div style="display:none;">{{watchDefaultData}}</div>
    <!-- 新增客户弹框 -->
    <el-dialog
      title="新增客户"
      width="800px"
      :visible.sync="projectDetail"
      :before-close="handleClose"
      class="dialog-info total-dialog"
    >
      <addCustomer v-if="projectDetail" @getTableData="getTable" @changeShow="changeShow"></addCustomer>
    </el-dialog>
  </div>
</template>

<script>
import { staticData, customerDevelop } from "./customerQueryData.js";
import { getSettlementErr } from "@/api/index";
import addCustomer from "./addCustomer";
export default {
  data() {
    return {
      showTransferDialog: JSON.parse(localStorage.getItem("myInfo"))
        .isDepMaster, //不是主管则不显示该按钮
      fileList3: [],
      defalutDepId: "", // 当前登录人的部门id存储
      departmentData: [],
      customerDevelop: customerDevelop, // 客户级别下拉选数据
      staticData: staticData, // 统计日期下拉选数据
      departmentProp: {
        value: "id",
        label: "name",
        children: "child"
      },
      maintainerData: [], //维护人的数据
      defalutMaintainerData: [], // 维护人数据的暂时存储
      formData: {},
      tongjiTime: [], // 统计日期存储
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now();
        }
      },
      uplusDepData: [], // u+部门数据
      uplusDataProp: {
        // 管辖部门树状图的配置项
        label: "DeptName",
        value: "DepartOnlyCode",
        children: "SubDepart",
        disabled: "disabled"
      },
      channelData: [],
      projectDetail: false //新增客户弹框
    };
  },
  created() {
    this.defalutDepId = JSON.parse(localStorage.getItem("myInfo")).depId;
    // this.isUplus == 1 ? this.getUplusData() : this.getDepartData();
    this.isUplus == 1
      ? this.getUplusData()
      : this.isUplus != 3
      ? this.getDepartData()
      : "";
    this.isUplus == 2 ? this.getChannelData() : "";
    this.getMaintainerData(this.defalutDepId, "");
    this.defaultData();
    // this.maintainerData = this.defalutMaintainer
  },
  props: ["levelData", "isUplus", "allCompanyData"],
  methods: {
    handleChange(file, fileList) {
      console.log(file);
    },
    uploadOnSuccess(val) {
      if (val.status == 200) {
        this.$store.commit("customerDefaultData", 2);
        this.alertMessage("success", "上传成功", 2000);
      } else if (val.status == 4000) {
        // this.getErrInfo(val.data);
        // this.alertMessage("warning", val.message, 2000);
        this.open(val.message, val.data);
      } else {
        this.alertMessage("warning", val.message, 2000);
      }
    },
    uploadOnError(val) {
      this.alertMessage("warning", "上传错误", 2000);
    },

    open(val, msg) {
      let _this = this;
      this.$msgbox({
        title: "导入警告",
        message: val + " 是否导出未成功客户，修改后重新导入？",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            // 当返回 4000的时候后台让调用这个接口
            this.$axios
              .post("/api/errorCustomerExport", msg, {
                responseType: "arraybuffer"
              })
              .then(res => {
                console.log(res.headers.filename);
                let blob = new Blob([res.data], {
                  type: "application/vnd.ms-excel"
                });
                let objectUrl = URL.createObjectURL(blob); //下载链接
                let link = document.createElement("a");
                link.style.display = "none";
                link.href = objectUrl;
                link.setAttribute("download", "客户信息(格式错误).xlsx");
                document.body.appendChild(link);
                link.click();
                done();
              });
          } else {
            done();
          }
        }
      });
      // .then(action => {
      //   this.$message({
      //     type: "info",
      //     message: "action: " + action
      //   });
      // });
    },
     //   初始化条件查询对象
    defaultData() {
      this.formData = {
        eId: "",
        followState: "",
        status: "",
        startTime: "",
        endTime: "",
        level: "",
        keyword: "",
        depId: "",
        companyId:""
      };
        this.isUplus ? "" : (this.formData.lockSelection = "")
      switch (this.isUplus) {
        case "0":
          this.formData.depId = this.defalutDepId
          break;
        case "1":
          this.formData.transferorStore = ""
          break;
        case "2":
          this.formData.depId = ""
          break;
        case "3":
          // debugger
          this.$set(this.formData,"maleGuestType","")
          this.formData.lockSelection = 2
          break;
        default:
          break;
      }
      // this.isUplus == 3 ? (this.formData.maleGuestType = "") : "";
      // this.isUplus == 3 ? delete this.formData.depId : "";
      // this.isUplus == 1
      //   ? (this.formData.transferorStore = "")
      //   : this.isUplus == 2
      //   ? (this.formData.depId = "")
      //   : (this.formData.depId = this.defalutDepId);      
      this.tongjiTime = [];
      this.$emit("getTableData", this.formData, 1);
      this.$store.commit("customerDefaultData", 1);
    },

    //   获取部门列表数据
    getDepartData() {
      let params = {
        iRoot: true
      };
      this.$axios.get("/api/department/list", { params: params }).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.departmentData = JSON.parse(
            "[" + JSON.stringify(res.data) + "]"
          );
        } else {
          this.alertMessage("warning", res.message);
          return;
        }
      });
    },
    // 获取u+部门数据
    getUplusData() {
      let myInfo = JSON.parse(localStorage.getItem("myInfo"));
      let params = {
        cityID: myInfo.cityId ? myInfo.cityId : 1
      };
      this.$axios
        .get("/api/resource/uplusDepart", { params: params })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.uplusDepData = JSON.parse(res.data);
          }
        });
    },
    // 获取所有渠道数据
    getChannelData() {
      this.$axios
        .get("/api/department/channel/list", { params: { keyword: "" } })
        .then(res => {
          res = res.data;
          // debugger
          if (res.status === 200) {
            // debugger
            this.channelData = res.data;
          }
        });
    },
    // 获取维护人数据
    getMaintainerData(depId, keyword) {
      let info = JSON.parse(localStorage.getItem("myInfo"));
      let params = {
        depId: this.isUplus == 1 ? info.depId : depId,
        keyword: keyword,
        type:
          (this.isUplus == 2 && !this.formData.depId) || this.isUplus == 1
            ? 3
            : 2
      };
      this.$axios
        .get("/api/employee/departmentalIdQueryEmployees", { params: params })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.maintainerData = res.data;
            // this.defalutMaintainerData = res.data
          }
        });
    }, 
    // 公司下拉选选择公司
     selectCompany(val) {
      this.formData.depId = this.formData.companyId
    },
    // 渠道部门选择发生改变时
    channelChange(val) {
      this.getMaintainerData(val, "");
    },
    // 点击部门组织架构时
    clickNode(data, value) {
      // debugger
      // this.defalutDepId = data.id;
      this.$set(this.formData, "depName", data.name);
      this.formData.depId = data.id;
      this.getMaintainerData(data.id, "");
    },
    // 点击u+部门数据
    clickUplusNode(data, value) {
      // debugger
      this.$set(this.formData, "depName", data.DeptName);
      this.formData.transferorStore = data.DepartOnlyCode;
    },
    // 点击条件查询时
    querySelect() {
      if (this.tongjiTime && this.tongjiTime.length) {
        this.formData.startTime = this.tongjiTime[0];
        this.formData.endTime = this.tongjiTime[1];
      } else {
        this.formData.startTime = "";
        this.formData.endTime = "";
      }
      this.$emit("getTableData", this.formData, "int");
    },
    // 选择统计日期

    //   点击维护人下拉选数据
    handleSelect(item) {
      let resultArr = item.split("-");
      this.formData.eId = resultArr[0];
      this.formData.maintainerName = resultArr[1];
    },
    querySearch(queryString) {
      //   debugger
      if (queryString) {
        this.loading = true;
        this.getMaintainerData(this.defalutDepId, queryString);
        this.loading = false;
      } else {
        // debugger
        this.getMaintainerData(this.defalutDepId, "");
        // this.maintainerData = this.defalutMaintainerData
      }
    },
    //   点击重置
    resetQuery() {
      // debugger
      this.defaultData();
      this.getMaintainerData(this.defalutDepId, "");
    },
    //   点击批量转移
    transfer() {
      this.$emit("transferCustomer");
    },
    //   点击模板
    template() {
      window.open("/api/exportTemplate");
    },
    // 新增客户
    add_customer() {
      this.projectDetail = true;
    },
    // 添加完成后关闭新增客户
    changeShow(val) {
      this.projectDetail = val;
    },
    getTable() {
      this.$emit("getTableData");
    },
    handleClose(done) {
      done();
    }
  },
  computed: {
    watchDefaultData() {
      if (this.$store.state.customerDefaultData == 2) {
        this.defaultData();
      }
    }
  },
  components: {
    addCustomer
  }
};
</script>
<style lang='scss' scoped>
/deep/ .el-form {
  .el-upload-list {
    display: none;
  }
  .query-keyword {
    .el-input__inner {
      width: 240px !important;
    }
  }
  .el-form-item {
    .el-input__inner {
      font-weight: 700;
    }
    .el-form-item__label {
      padding: 0 5px 0 0;
    }
    &:nth-of-type(1) {
      .el-form-item__content {
        .el-input__inner {
          width: 278px;
        }
      }
    }
    &:nth-of-type(2),
    &:nth-of-type(3) {
      margin-right: 10px;
      .el-input__inner {
        width: 132px;
      }
    }
    &:nth-of-type(4) {
      margin-right: 5px;
      .el-select {
        .el-input__inner {
          width: 110px;
        }
      }
      .el-date-editor {
        width: 213px;
        .el-input__inner {
          width: 132px;
          padding-left: 30px;
        }
      }
    }
    &:nth-of-type(5),
    &:nth-of-type(6) {
      .el-input__inner {
        width: 126px;
      }
    }
    // &:nth-of-type(7) {
    //   .el-input__inner {
    //     width: 258px;
    //   }
    // }
  }
}
</style>
