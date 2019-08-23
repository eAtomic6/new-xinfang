<!-- 客源列表table表格 -->
<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;"
      v-loading="loading"
      heigth="250"
      element-loading-text="玩命加载中"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="序号" width="60" type="index">
        <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
      </el-table-column>
      <el-table-column label="客户编号" width="230">
        <template slot-scope="scope">
          <span v-if="scope.row.c_no">
            {{scope.row.c_no}}
            <span @click="clickRob(scope)" v-if="isUplus == 3 && scope.row.lockType == 0" class="fr" style="color:#3292F5;margin-right:13px">抢入</span>
            <span v-if="isUplus == 3 && scope.row.lockType == 1" class="fr" style="color:black;margin-right:13px">锁定</span>
            <span v-if="!isUplus">
              <i
                class="icon icon-yisuo"
                v-show="scope.row.isLock"
                style="color:#1CB36A;"
              ></i>
              <i class="icon icon-weisuo" v-show="!scope.row.isLock"></i> 
            </span>
          </span>
          <span v-else>
           <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="客户姓名" width="90">
        <template slot-scope="scope">
          <span @click="clickName(scope.row)" v-if="scope.row.name" style="color:#3292F5">{{scope.row.name}}</span>
          <span v-else><i class="el-icon-minus" style="font-weight:600"></i></span>
        </template>
      </el-table-column>
      <el-table-column label="客户电话" width="110">
         <template slot-scope="scope">
          <span v-if="scope.row.phone">{{scope.row.phone}}</span>
          <span v-else><i class="el-icon-minus" style="font-weight:600"></i></span>
        </template>
      </el-table-column>
      <el-table-column label="级别" width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.level">{{scope.row.level}}</span>
          <span v-else><i class="el-icon-minus" style="font-weight:600"></i></span>
        </template>
      </el-table-column>
      <!-- 秦星星加 B -->
      
      <el-table-column label="跟进记录" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.follow_reason">{{scope.row.follow_reason}}</span>
          <span v-else><i class="el-icon-minus" style="font-weight:600"></i></span>
        </template>
      </el-table-column>

      <!-- 秦星星加 E -->
      <el-table-column label="客户进展" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.follow_state">{{scope.row.follow_state}}</span>
          <span v-else><i class="el-icon-minus" style="font-weight:600"></i></span>
        </template>
      </el-table-column>
       <el-table-column label="所属公客" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.publicType">{{scope.row.publicType}}</span>
          <span v-else><i class="el-icon-minus" style="font-weight:600"></i></span>
        </template>
      </el-table-column>
      <el-table-column label="购房意向" width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.bName || scope.row.house_acreage || scope.row.district_name || scope.row.house_price">
            {{scope.row.bName}}&nbsp;&nbsp;
            {{scope.row.house_acreage}}&nbsp;&nbsp;
            {{scope.row.district_name}}&nbsp;&nbsp;
            {{scope.row.house_price}}
          </span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="isUplus == 1 ? '转入时间' : '录入时间'" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.create_time" v-html="scope.row.create_time.split(' ')[0]"></span>
          <span v-else><i class="el-icon-minus" style="font-weight:600"></i></span>
        </template>
      </el-table-column>
      <el-table-column label="维护人" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.eName">{{scope.row.eName}}</span>
          <span v-else><i class="el-icon-minus" style="font-weight:600"></i></span>
        </template>
      </el-table-column>
      <el-table-column :label="isUplus == 1 ? '所属门店' : (isUplus == 2 ? '所属渠道' : '所在部门')" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.dName">{{scope.row.dName}}</span>
          <span v-else><i class="el-icon-minus" style="font-weight:600"></i></span>
        </template>
      </el-table-column>
      <el-table-column label="最新跟进" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.last_follow_time">
            {{scope.row.last_follow_time}} ({{scope.row.count}})
            </span>
            <span v-else>
              <i class="el-icon-minus" style="font-weight:600"></i>
            </span>
        </template>
      </el-table-column>
      <el-table-column label="最新报备" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.last_report_time">{{scope.row.last_report_time}}</span>
          <span v-else><i class="el-icon-minus" style="font-weight:600"></i></span>
        </template>
      </el-table-column>
      <el-table-column label="最新带看" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.last_look_time">{{scope.row.last_look_time}}</span>
          <span v-else><i class="el-icon-minus" style="font-weight:600"></i></span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paginationObj.pageNum"
      :page-sizes="[10, 15, 20, 25]"
      :page-size="paginationObj.pageSize"
      layout="prev, pager, next,  total, sizes, jumper"
      :total="tableTotals"
    ></el-pagination>
    <el-dialog
          title="客户抢入"
          append-to-body
          class="customer-changeProject"
          :visible.sync="robDialog"
        >
        <div class="rob-main">
          <p><span>抢</span>是否抢入 <span style="color:#3292F5">{{robName}}{{robPhone}}</span> 为您的私客?</p>
        </div>
        <div class="move_footer">
          <el-button class="sureAdd" @click="sureRob">确 定</el-button>
          <el-button class="noAdd" @click="robDialog=false">取 消</el-button>
        </div>
        </el-dialog>
  </div>
</template> 

<script>
export default {
  data() {
    return {
      robDialog:false,
      robName:"",
      robPhone:"",
      customerId:""
    };
  },
  created() {

  },
  props: ["tableData", "paginationObj", "tableTotals","isUplus","loading"],
  methods: {
     // 点击确定抢入
    sureRob(){
      let qs = require('qs')
      this.$axios.post("/api/customer/lock",qs.stringify({
        customerId:this.customerId,
        followType:7,
        followReason:"pc端抢入客户",
        reasonType:4
      })).then(res => {
        res = res.data
        if(res.status === 200){
          this.alertMessage("success","抢入成功",1500)
          this.$emit("getTableData")
          this.robDialog = false
        }else{
          this.alertMessage("warning",res.message,1500)
          return
        }
      })
    },
    // 点击公客列表的抢入
    clickRob(scope){
      this.robDialog = true
      this.robName = scope.row.name
      this.robPhone = scope.row.phone
      this.customerId = scope.row.id
    },
    //   批量转移选择发生改变时
    handleSelectionChange(select) {
      console.log("我是所选择的");
      console.log(select);
       this.$store.commit("managementCustomerChoice", select);
    },
    //   点击table表格中客户姓名的时候
    clickName(row) {
      // console.log(row);
      this.$emit("clickCustName", row);
    },
    //   table每页数据条数发生改变时
    handleSizeChange(val) {
      this.$emit("sizeChange", val);
    },
    //   table当前页发生改变时
    handleCurrentChange(val) {
      this.$emit("numChange", val);
    }
  }
};
</script>
<style lang='scss' scoped>
/deep/ .el-table__body-wrapper {
  width: 101.5%;
  overflow: scroll;
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
      height: 580px;
    }
  }
   @media only screen and (max-width: 700px) {
     /deep/ .el-table__body-wrapper {
      height: 370px;
    }
  }
  /deep/ .el-dialog{
    width: 400px;
    min-height: 200px;
    .move_footer{
      margin-top: 28px;
    }
    .rob-main{
      text-align: center;
      margin-top: 16px;
      >p{
        >span{
          &:nth-of-type(1){
            display: inline-block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #1CB36A;
          color: #fff;
          font-size: 12px;
          line-height: 19px;
          margin-right: 3px;
          margin-bottom: 2px;
          }
        }
      }
    }
  }
</style>
