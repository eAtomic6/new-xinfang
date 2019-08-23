<!-- 固定活动领取列表 -->
<template>
  <div>
    <div class="w-select">
        <el-form :inline="true" :model="keyWordData" class="demo-form-inline" min-width="1398px">
        <el-form-item label="城市:">
            <el-select
            v-model="keyWordData.city"
            placeholder="请选择"
            >
            <el-option value="" label="全部"></el-option>
            <el-option
                v-for="item in cityData"
                :value="item.CityID"
                :label="item.CityName"
                :key="item.CityID"
            ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="获客渠道:">
            <el-select
            v-model="keyWordData.channel"
            placeholder="请选择"
            >
            <el-option value="" label="全部"></el-option>
            <el-option value="0" label="PC"></el-option>
            <el-option value="1" label="WAP"></el-option>
            <el-option value="2" label="Android"></el-option>
            <el-option value="3" label="Ios"></el-option>
            <el-option value="4" label="小程序"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="优惠码:">
                <el-input v-model="keyWordData.code" placeholder="可搜索优惠码" maxlength=30></el-input>
        </el-form-item>
        <el-form-item label="领取时间:">
            <el-date-picker
            v-model="createBannerTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            ></el-date-picker>
        </el-form-item>
        <el-form-item label="关键字:">
            <el-tooltip content="可搜索意向项目、客户电话" placement="top" effect="light">
                <el-input v-model="keyWordData.keyword" placeholder="可搜索意向项目、客户电话" maxlength=30></el-input>
                </el-tooltip>
        </el-form-item>
        <el-form-item>
            <el-button type="warning" @click="querySelect" class="search-but">查询</el-button>
        </el-form-item>
        <el-form-item>
            <el-button type="info" @click="resetQuery" class="chongzhi-but">重置</el-button>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="outPut" class="but-lightblue">导出</el-button>
        </el-form-item>
        </el-form>
    </div>
    <el-table
    v-loading="loading"
    element-loading-text="玩命加载中"
    :data="tableData"
    border
    >
     <el-table-column
      label="序号"
      width="60"
      type="index">
      </el-table-column>
        <el-table-column 
        v-for="(item,index) in showTableData"
        :label="item.name" 
        :width="item.width"
        :key="index">
          <template slot-scope="scope">
            <div v-if="scope.row[item.value] !== '' && scope.row[item.value] !== null && scope.row[item.value] !== '-'">
                {{scope.row[item.value]}}
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
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="prev, pager, next,  total, sizes, jumper"
      :total="tableTotals">
    </el-pagination>
  </div>
</template>

<script>
import { showTableData } from "./tableData.js";
export default {
  data() {
    return {
      keyWordData: {}, //查询条件数据对象
      cityData: [], //城市下拉选数据
      createBannerTime: [], //领取时间数据存储
      pageNum: 1,
      pageSize: 10,
      tableTotals: 0,
      showTableData: showTableData,
      tableData: [],
      loading: false
    };
  },
  props: ["itemId"],
  created() {
    this.defaultData();
    this.getCityData();
    this.getTableData();
  },
  mounted() {
    // console.log(this.itemId);
  },
  methods: {
    defaultData() {
      this.createBannerTime=[]
      this.keyWordData = {
        city: "",
        channel: "",
        code: "",
        startTime: "",
        endTime: "",
        keyword: ""
      };
    },
    getListMethod() {
      this.defaultData();
      this.getCityData();
      this.getTableData();
    },
    //   获取城市数据接口
    getCityData() {
      this.$axios("/api/basicDataToGetAllCities").then(res => {
        res = res.data;
        // debugger;
        if (res.status === 200) {
          this.cityData = res.data;
        }
      });
    },
    //   获取table数据
    getTableData() {
      this.loading = true;
      if (this.createBannerTime && this.createBannerTime.length != 0) {
        this.keyWordData.startTime = this.createBannerTime[0] + " 00:00:00";
        this.keyWordData.endTime = this.createBannerTime[1] + " 23:59:59";
      } else {
        this.keyWordData.startTime = "";
        this.keyWordData.endTime = "";
      }
      this.keyWordData.faId = this.itemId;
      this.keyWordData.pageNum = this.pageNum;
      this.keyWordData.pageSize = this.pageSize;
      this.$axios
        .get("/api/discountCodeReceivingList", { params: this.keyWordData })
        .then(res => {
          res = res.data;
          //   debugger;
          if (res.status === 200) {
            this.loading = false;
            this.tableData = res.data.list;
            this.tableTotals = res.data.total;
          }
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getTableData();
    },
    //   点击查询
    querySelect() {
      this.pageNum = 1
      this.pageSize = 10
      this.getTableData();
    },
    //   点击重置
    resetQuery() {
      this.pageNum = 1;
      this.pageSize = 10;
      this.createBannerTime = [];
      this.defaultData();
      this.getTableData();
    },
    // 点击导出
    outPut() {
        let date = new Date();
        let token = ""
        date.setTime(date.getTime()-10000);
        document.cookie="xf-timespan=; expire="+date.toGMTString();
        token = localStorage.getItem("token")
        document.cookie="xf-token="+token+""
       this.$axios
        .get("/api/exportPreferenceCode/can")
        .then(res => {
          // debugger
          res = res.data
          if (res.status === 200) {
            let str = `faId=${this.keyWordData.faId}&city=${this.keyWordData.city}&channel=${this.keyWordData.channel
            }&startTime=${this.keyWordData.startTime}&endTime=${this.keyWordData.endTime}&code=${this.keyWordData.code}&keyword=${
              this.keyWordData.keyword
            }`;
            window.location.href = "/api/exportPreferenceCode?" + str;
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无操作权限");
            return;
          }
        });
    }
  },
  watch: {
    // itemId(val) {
    //   this.defaultData();
    //   this.getCityData();
    //   this.getTableData();
    // }
  }
};
</script>
<style lang='scss' scoped>
/deep/ .el-table__body-wrapper {
  width: 102%;
  overflow: scroll;
}
/deep/ .el-table__body-wrapper {
  height: 400px;
}
</style>