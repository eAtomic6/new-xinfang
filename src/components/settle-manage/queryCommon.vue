<!-- 结算报表公共条件组件 -->
<template>
  <div class="w-select">
    <el-form :inline="true" :model="keyWordData" class="demo-form-inline" min-width="1398px">
      <el-form-item label="公司:">
        <el-select
          v-model="keyWordData.companyId"
          placeholder="请选择"
          :disabled="isControlCompany.companyId != -1"
          @change="companyChanged"
        >
          <el-option :value="-1" label="中房科瑞"></el-option>
          <el-option
            v-for="item in companyData"
            :value="item.d_id"
            :label="item.name"
            :key="item.d_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围:">
        <el-date-picker
          v-model="createBannerTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="佣金:" v-if="itemInfo.name == '佣金'">
        <el-select v-model="keyWordData.commissionId" class="selectIpt">
          <el-option label="不限" value></el-option>
          <el-option label="已发放" value="1"></el-option>
          <el-option label="未发放" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目所属公司:" v-if="itemInfo.name == '所属公司'">
        <el-select v-model="keyWordData.bCompanyId" class="selectIpt">
          <el-option label="全部" value></el-option>
          <el-option
            v-for="(item,index) in proCompanyData"
            :label="item.name"
            :key="index"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键词:">
        <el-input v-model="keyWordData.keyword" placeholder="请输入关键词(最多30个字)" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="querySelect" class="search-but">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="resetQuery" class="chongzhi-but">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="outputExcel" class="but-lightblue">
          <span class="icon icon-daochu org-icon"></span>导出
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyWordData: {}, //条件查询对象
      createBannerTime: [], // 时间范围
      isControlCompany: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now();
        },
        firstDayOfWeek: 1
      }
    };
  },
  props: ["companyData", "proCompanyData", "itemInfo"],
  mounted() {
    this.defalutKeywordData(0);
    this.proCompanyData
      ? this.$emit("companyChanged", this.isControlCompany.companyId)
      : "";
  },
  created() {},
  methods: {
    // 初始化查询条件对象
    defalutKeywordData(int) {
      let infoObj = JSON.parse(localStorage.getItem("myInfo"));
      this.isControlCompany = infoObj.dep;
      let obj = {
        companyId: infoObj.dep.companyId,
        startTime: "",
        endTime: "",
        keyword: "",
        commissionId: "",
        bCompanyId: ""
      };
      this.keyWordData = Object.assign({}, this.keyWordData, obj);
      int ? "" : this.$emit("getTableData", this.keyWordData);
    },
    //  点击查询
    querySelect() {
      this.timeFormat();
      this.$emit("querySelect", this.keyWordData);
    },
    //   点击重置
    resetQuery() {
      this.defalutKeywordData(1);
      this.createBannerTime = [];
      this.$emit("defaultCompanyData");
      this.$emit("resetQuery", this.keyWordData);
    },
    //   点击导出
    outputExcel() {
      let date = new Date();
      let token = "";
      date.setTime(date.getTime() - 10000);
      document.cookie = "xf-timespan=; expire=" + date.toGMTString();
      this.timeFormat();
      token = localStorage.getItem("token");
      document.cookie = "xf-token=" + token + "";
      this.$emit("outputExcel", this.keyWordData);
    },
    //   时间段处理方法
    timeFormat() {
      if (this.createBannerTime && this.createBannerTime.length != 0) {
        this.getQueryTime(this.createBannerTime);
      } else {
        this.$set(this.keyWordData, "endTime", "");
        this.$set(this.keyWordData, "startTime", "");
      }
    },
    //   处理时间段方法
    getQueryTime(arr) {
      this.keyWordData.endTime = arr[1] + " 23:59:59";
      this.keyWordData.startTime = arr[0] + " 00:00:00";
    },
    companyChanged(val) {
      this.keyWordData.bCompanyId = "";
      // this.$emit("defaultCompanyData")
      this.$emit("companyChanged", val);
    }
  }
};
</script>
<style lang='scss' scoped>
/deep/ .el-input__inner {
  height: 30px !important;
}
/deep/ .el-select {
  .el-input .el-input__inner {
    width: 150px;
    font-weight: 700;
  }
}
</style>