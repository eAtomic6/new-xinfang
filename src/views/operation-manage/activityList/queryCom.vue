<!-- 吉家活动公共搜索条件 -->
<template>
  <div class="w-select">
    <el-form :inline="true" :model="keyWordData" class="demo-form-inline" min-width="1398px">
      <el-form-item label="公司:">
        <el-select
          :disabled="isControlCompany.companyId > 0"
          v-model="keyWordData.companyId"
          placeholder="请选择"
        >
          <el-option value="" label="全部"></el-option>
          <!-- <el-option value="-1" label="中房科瑞"></el-option> -->
          <el-option
            v-for="item in companyData"
            :value="item.d_id"
            :label="item.name"
            :key="item.d_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动状态:" v-if="!isCustom">
        <el-select
          v-model="keyWordData.activityState"
          placeholder="请选择"
        >
          <el-option value="0" label="全部"></el-option>
          <el-option value="1" label="未开始"></el-option>
          <el-option value="2" label="已开始"></el-option>
          <el-option value="3" label="已失效"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键词:">
          <el-tooltip content="可搜索活动名称、备注、创建人" placement="top" effect="light">
              <!-- <div class="box-tooltip">123</div> -->
            <el-input v-model="keyWordData.keyword" placeholder="可搜索活动名称、备注、创建人" maxlength=30></el-input>
            </el-tooltip>
      </el-form-item>
      <el-form-item label="创建时间:">
        <el-date-picker
          v-model="createBannerTime1"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="生效开始时间:" v-if="!isCustom">
        <el-date-picker
          v-model="createBannerTime2"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
       <el-form-item label="上下架状态:">
        <el-select
          v-model="keyWordData.upperLowerRackStatus"
          placeholder="请选择"
        >
          <el-option value="-1" label="全部"></el-option>
          <el-option value="1" label="上架"></el-option>
          <el-option value="0" label="下架"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="querySelect" class="search-but">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="resetQuery" class="chongzhi-but">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addActivity" class="but-lightblue">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clickDelete" class="but-lightblue">删除</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyWordData: {}, //条件查询对象
      createBannerTime1: [], // 创建时间范围
      createBannerTime2:[],  // 生效开始时间
      isControlCompany: {},
      
    //   pickerOptions: {
    //     disabledDate(time) {
    //       return time.getTime() >= Date.now();
    //     },
    //     firstDayOfWeek: 1
    //   }
    };
  },
  props: ["companyData","isCustom"],
  mounted() {
    this.defalutKeywordData(0);
  },
  created() {
  },
  methods: {
    // 初始化查询条件对象
    defalutKeywordData(int) {
      let infoObj = JSON.parse(localStorage.getItem("myInfo"));
      this.isControlCompany = infoObj.dep;
      let obj = {
        companyId: infoObj.dep.companyId < 0 ? "" : infoObj.dep.companyId,
        activityState: "0",
        upperLowerRackStatus: "-1",
        keyword: "",
        effectiveStartTime:"",
        effectiveStartEndTime:"",
        creationStartTime:"",
        creationEndTime:"",
      };
      this.keyWordData = Object.assign({}, this.keyWordData, obj);
      // if(infoObj.dep.companyId < 0){
      //     this.keyWordData.companyId = this.getAllCompanyId()
      //     console.log(this.keyWordData.companyId);
      // }else{
      //   this.keyWordData.companyId = infoObj.dep.companyId
      // }
      // console.log(this.keyWordData);
        int ? "" : this.$emit("getTableData", this.keyWordData);
    },
    // 获取所有公司id来查询全部公司
    // getAllCompanyId(){
    //   let str = ""
    //   let strArr = []
    //   if(this.companyData &&　this.companyData.length){
    //     this.companyData.forEach(element => {
    //       strArr.push(element.d_id)
    //     });
    //   }
    //  strArr.length ? str = strArr.join(",") : ""
    //  return str
    // //  this.keyWordData.companyId = str
    // },
    //  点击查询
    querySelect() {
      // if(this.keyWordData.companyIdStr){
      //   this.keyWordData.companyId = this.keyWordData.companyIdStr
      // }else{
      //   this.keyWordData.companyId = this.getAllCompanyId()
      //   // this.getAllCompanyId()
      // }
      this.timeFormat();
      // console.log(this.keyWordData);
      this.$emit("querySelect", this.keyWordData);
    },
    //   点击重置
    resetQuery() {
      this.defalutKeywordData(1);
      this.createBannerTime1 = [];
      this.createBannerTime2 = [];
      this.$emit("resetQuery", this.keyWordData);
    },
    //   点击导出
    // outputExcel() {
    //   let date = new Date();
    //   let token = "";
    //   date.setTime(date.getTime() - 10000);
    //   document.cookie = "xf-timespan=; expire=" + date.toGMTString();
    //   this.timeFormat();
    //   token = localStorage.getItem("token");
    //   document.cookie = "xf-token=" + token + "";
    //   this.$emit("outputExcel", this.keyWordData);
    // },
    //   时间段处理方法
    timeFormat() {
      if (this.createBannerTime1 && this.createBannerTime1.length != 0) {
        this.getQueryTime(this.createBannerTime1,1);
      } else {
        this.$set(this.keyWordData, "creationEndTime", "");
        this.$set(this.keyWordData, "creationStartTime", "");
      }
      if (this.createBannerTime2 && this.createBannerTime2.length != 0) {
        this.getQueryTime(this.createBannerTime2,2);
      } else {
        this.$set(this.keyWordData, "effectiveStartEndTime", "");
        this.$set(this.keyWordData, "effectiveStartTime", "");
      }
    },
    //   处理时间段方法
    getQueryTime(arr,int) {
      if(int == 1){
        this.keyWordData.creationStartTime = arr[0] + " 00:00:00";
        this.keyWordData.creationEndTime = arr[1] + " 23:59:59";
      }else{
        this.keyWordData.effectiveStartTime = arr[0] + " 00:00:00";
        this.keyWordData.effectiveStartEndTime = arr[1] + " 23:59:59";
      }
    },
    // 点击新增按钮
    addActivity(){
        this.$emit("addNewActivity")
    },
    // 点击删除
    clickDelete(){
      this.$emit("deleteActivity",1)
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