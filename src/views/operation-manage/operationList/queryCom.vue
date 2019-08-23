<!-- 获客列表筛选条件组件 -->
<template>
  <div class="w-select">
       <el-form :inline="true" :model="keyWordData" class="demo-form-inline" min-width="1398px">
          <el-form-item label="公司名称:">
            <el-select v-model="keyWordData.companyIds" class="selectIpt" :disabled="isShowCompanyId<0 ? false : true">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in allCompanyData" :label="item.name" :key="item.id" :value=item.d_id></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="获客渠道:" class="getMethods">
            <el-select v-model="keyWordData.type" class="selectIpt">
              <el-option v-for="(item,index) in channelData" :label="item.name" :key="index" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="连接时间:" class="getMethods" v-if="channelData[1].name == 'PC端'">
            <el-select v-model="keyWordData.dur" class="selectIpt">
              <el-option v-for="item in connectState" :label="item.name" :key="item.value" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="搜索:" class="query-searchIpt">
            <el-tooltip :content="messageData.value" placement="top" effect="light">
              <!-- <div class="box-tooltip">123</div> -->
            <el-input v-model="keyWordData.keyword" :placeholder="messageData.value" maxlength=30></el-input>
            </el-tooltip>
          </el-form-item>
           <el-form-item label="获客时间:">
            <el-date-picker
          v-model="createBannerTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
          </el-form-item>
           <el-form-item>
                <el-button type="warning" @click="sureQueryInfo" class="search-but">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="resetQueryInfo" class="chongzhi-but">重置</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="outputExcel" class="but-lightblue"><span class="icon icon-daochu org-icon"></span>导出</el-button>
            </el-form-item>
             <el-form-item v-if="channelData[1].name == 'PC端'">
                <el-button type="primary" class="but-lightblue" @click="queryToday">今日查询</el-button>
            </el-form-item>
        </el-form>
         <el-dialog
      title="今日查询"
      class="customer-transfer"
      :visible.sync="queryTodayBox"
      @close="closeDialog1"
      width="600px"
      >
      <query-today @closeDialog="closeDialog" ref="queryChild"></query-today>
    </el-dialog>
        <span style="color:red;display: block;margin-top: 5px;">提示：电话记录最新数据截止至昨天24:00!</span>
  </div>
</template>

<script>
import queryToday from './queryToday.vue'
export default {
  components:{
    queryToday
  },
  data () {
    return {
      createBannerTime: [], // 时间范围
      allCompanyData:[],
      isShowCompanyId:"",
      keyWordData:{
        startAt:"",
        endAt:"",
        type:"",
        dur:"",
        companyIds:""
      },
      startAt:"",
      endAt:"",
      queryTodayBox:false
    };
  },
  created(){
    let infoObj = JSON.parse(localStorage.getItem("myInfo"))
    this.defaultObj()
    this.getCompanyData()
    this.isShowCompanyId = infoObj.dep.companyId
  },
  mounted(){
    this.sureQueryInfo()
  },
  props:["channelData","connectState","messageData"],
  methods: {
    // 初始化搜索对象数据
    defaultObj(){
    let infoObj = JSON.parse(localStorage.getItem("myInfo"))
      let obj = {
        companyIds: infoObj.dep.companyId < 0 ? "" : infoObj.dep.companyId,
        type:"",
        keyword:"",
        startAt:"",
        endAt:"",
        dur:""
      }
      this.keyWordData = obj
      // Object.assign(this.keyWordData,obj)
    },
    // 获取公司数据
    getCompanyData(){
      this.$axios.get("/api/getItemCompany").then(res => {
        res = res.data
        if(res.status === 200){
          this.allCompanyData = res.data
        }
      })
    },
    // 点击查询
    sureQueryInfo(){
      this.timeFormat()
      this.$emit("getTableData",this.keyWordData,2)
    },
     //   处理时间段方法
    getQueryTime(arr) {
      this.keyWordData.endAt = arr[1];
      this.keyWordData.startAt = arr[0];
    },
     //   时间段处理方法
    timeFormat() {
      if (this.createBannerTime && this.createBannerTime.length != 0) {
        this.getQueryTime(this.createBannerTime);
      } else {
        this.$set(this.keyWordData, "endAt", "");
        this.$set(this.keyWordData, "startAt", "");
      }
    },
    // 点击重置
    resetQueryInfo(){
      this.createBannerTime = [];
      this.defaultObj()
      this.$emit("getTableData",this.keyWordData,1)
    },
    // 点击导出
    outputExcel(){
      this.timeFormat();
      this.$emit("outExcel",this.keyWordData)
    },
    queryToday(){
      this.queryTodayBox = true
    },
    closeDialog(){
      this.queryTodayBox = false
    },
    closeDialog1(){
      this.$refs.queryChild.closeDialog()
    }
  }
}

</script>
<style lang='scss' scoped>
/deep/ .el-input--prefix .el-input__inner{
      padding-left: 30px;
}
/deep/ .el-date-editor.el-input{
  width: 177px;
  .el-input__inner{
    width: 175px;
  }
}
/deep/ .el-form{
  .el-form-item{
  &:nth-of-type(1){
    .el-input__inner{
      width: 157px !important;
    }
  }
  }
}
.w-select{
  /deep/ .el-select{
    .el-input__inner{
    font-weight: 700;
  }
  }

}
</style>