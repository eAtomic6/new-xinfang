<!-- 平台报表 -->
<template>
  <div>
      <div class="w-select">
        <el-form :inline="true" :model="keyWordData" class="demo-form-inline" min-width="1398px">
        <el-form-item label="时间范围:">
            <el-date-picker
            v-model="createBannerTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="timeChange"
            ></el-date-picker>
            <!-- :picker-options="pickerOptions" -->
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
     <el-table
    v-loading="loading"
    element-loading-text="玩命加载中"
    :data="tableData"
    :span-method="arraySpanMethod"
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
    :sortable="item.sortable"
    :key="index">
        <template slot-scope="scope">
            <div v-if="scope.row[item.value] !== '' && scope.row[item.value] !== null">
                {{scope.row[item.value]}}
            </div>
            <div v-else>
                  <i class="el-icon-minus" style="font-weight:600"></i>
            </div>
        </template>
    </el-table-column>
  </el-table>
  <!-- <div class="platform-lastFooter">
    <ul>
      <li v-for="(val, key, index) in tableLastData" :key="index">{{val}}</li>
      <li>{{tableLastData.province}}</li>
      <li>{{tableLastData.name}}</li>
      <li>{{tableLastData.ecount}}</li>
      <li>{{tableLastData.master_count}}</li>
      <li>{{tableLastData.bcount}}</li>
      <li>{{tableLastData.zxf_count}}</li>
      <li>{{tableLastData.deal_building}}</li>
      <li>{{tableLastData.c_count}}</li>
      <li>{{tableLastData.bb_cust}}</li>
      <li>{{tableLastData.bb_count}}</li>
      <li>{{tableLastData.dk_cust}}</li>
      <li>{{tableLastData.dk_count}}</li>
      <li>{{tableLastData.cj_cust}}</li>
      <li>{{tableLastData.expected_commission}}</li>
      <li>{{tableLastData.actual_commission}}</li>
    </ul>
  </div> -->
  </div>
</template>

<script>
import {showTableData} from "./tableData.js"
export default {
  data () {
    return {
        // tableLastData:{},    // table最后一行数据
        keyWordData:{},
        startAt:"",
        endAt:"",
        createBannerTime:[],
        loading:false,
        tableData:[],
        showTableData:showTableData
    };
  },
created(){
    this.$axios.get("/api/report/company/all/can").then(res => {
        res = res.data
        if(res.status === 200){
            this.getTableData()
        }
    }).catch(err => {
        if (err.response.status === 403) {
          this.$router.push({ name: "403errorPage" });
          return;
        }
      });
},
  methods: {
      arraySpanMethod({ row, column, rowIndex, columnIndex }){
          if (rowIndex === this.tableData.length-1) {
          if (columnIndex === 1) {
            return [1,2];
          } else if (columnIndex === 2) {
            return [0,0];
          }else if(columnIndex === 3){
            return [1,2];
          }else if(columnIndex === 4){
            return [0,0];
          }
        }
      },
      getTableData(){
                  this.loading = true
           if (this.createBannerTime && this.createBannerTime.length != 0) {
                this.startAt = this.createBannerTime[0] + " 00:00:00"
                this.endAt = this.createBannerTime[1] + " 23:59:59"
            } else {
               this.startAt = "",
               this.endAt = ""
            }
          let params = {
              startAt:this.startAt,
              endAt:this.endAt
          }
          this.$axios.get("/api/report/company/all",{params:params}).then(res => {
              res = res.data
              if(res.status === 200){
                  this.loading = false
                  this.tableData = res.data
                  // this.tableLastData = res.data[res.data.length-1]
                //   this.tableData.splice(this.tableData.length-1,1)
              }else{
                  this.alertMessage("warning",res.message)
                  return
              }
            //   debugger
          })
      },
    //   查询
    querySelect(){
        this.getTableData()
    },
    // 点击重置
    resetQuery(){
        this.createBannerTime = []
        this.getTableData()
    },
    outputExcel(){
      this.$axios.get("/api/report/company/allExport/can").then(res => {
        res = res.data
        if(res.status === 200){
          let date = new Date();
          let token = ""
          date.setTime(date.getTime()-10000);
          document.cookie="xf-timespan=; expire="+date.toGMTString();
          token = localStorage.getItem("token")
          document.cookie="xf-token="+token+""
           let str = `startAt=${this.startAt}&endAt=${this.endAt}`
           window.location.href="/api/report/company/allExport?"+str
        }
      })
    },
    timeChange(val){
      // debugger
      if(!val){
        this.resetQuery()
      }
    }
  }
}

</script>
<style lang='scss' scoped>
 /deep/ .el-table__body-wrapper{
  width: 101.5%;
  overflow: scroll;
  // padding-bottom: 62px;
  // .el-table__body{
  //   .el-table__row{
  //     &:nth-last-child(1){
  //       position: fixed;
  //       bottom: 33px;
  //       height: 65px;
  //       left: 0;
  //       min-width: 100%;
  //       &:hover{
  //         background-color: beige;
  //       }
  //       td{
  //         height: 65px;
  //         text-align: center;
  //         // padding: 0 
  //         width: 90px;
  //         &:nth-of-type(1){
  //           width: 60px;
  //         }
  //         &:nth-of-type(2){
  //           width: 160px;
  //         }
  //         &:nth-of-type(3){
  //           width: 250px;
  //         }
  //       }
  //     }
  //   }
  // }
}
/deep/ .el-table tr{
    &:last-child{
        background-color: beige;
    }
}
   @media only screen and (min-width: 800px) and (max-width:900px){
    /deep/ .el-table__body-wrapper {
      height: 400px;
    }
  }
   @media only screen and (min-width: 700px) and (max-width:800px) {
     /deep/ .el-table__body-wrapper {
      height: 370px;
    }
  }
   @media only screen and (min-width: 900px){
    /deep/ .el-table__body-wrapper {
      height: 708px;
    }
  }
   @media only screen and (max-width: 700px) {
     /deep/ .el-table__body-wrapper {
      height: 370px;
    }
  }
  // .platform-lastFooter{
  //   ul>li{
  //     float: left;
  //     text-align: center;
  //     padding: 0 10px;
  //     word-wrap: break-word;
  //     width: 90px;
  //     &:nth-of-type(1){
  //       width: 220px;
  //     }
  //     &:nth-of-type(2){
  //       width: 250px;
  //     }
  //   }
  // }
</style>