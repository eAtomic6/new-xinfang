<!-- u+结算报表table组件 -->
<!-- 结算报表公共table组件 -->
<template>
  <div>
    <el-table
    v-loading="loading"
    element-loading-text="玩命加载中"
    :data="tableData"
    border
    ref="multipleTable"
    >
     <el-table-column
      label="序号"
      width="60"
      type="index">
      </el-table-column>
       <el-table-column
      label="成交日期"
      width="100">
         <template slot-scope="scope">
            <div v-if="scope.row.deal_time !== '' && scope.row.deal_time !== null">
                {{scope.row.deal_time}}
            </div>
            <div v-else>
                  <i class="el-icon-minus" style="font-weight:600"></i>
            </div>
        </template>
      </el-table-column> 
       <el-table-column
      label="项目名称"
      width="120">
        <template slot-scope="scope">
              <div v-if="scope.row.b_name !== '' && scope.row.b_name !== null">
                  {{scope.row.b_name}}
              </div>
              <div v-else>
                    <i class="el-icon-minus" style="font-weight:600"></i>
              </div>
          </template>
      </el-table-column> 
       <el-table-column
      label="客户姓名"
      width="90">
        <template slot-scope="scope">
              <div v-if="scope.row.cust_name !== '' && scope.row.cust_name !== null">
                  {{scope.row.cust_name}}
              </div>
              <div v-else>
                    <i class="el-icon-minus" style="font-weight:600"></i>
              </div>
          </template>
      </el-table-column>
       <el-table-column
      label="成交房号"
      width="90">
        <template slot-scope="scope">
              <div v-if="scope.row.house_no !== '' && scope.row.house_no !== null">
                  {{scope.row.house_no}}
              </div>
              <div v-else>
                    <i class="el-icon-minus" style="font-weight:600"></i>
              </div>
          </template>
      </el-table-column>
       <el-table-column
      label="面积"
      width="90">
        <template slot-scope="scope">
              <div v-if="scope.row.house_area !== '' && scope.row.house_area !== null">
                  {{scope.row.house_area}}
              </div>
              <div v-else>
                    <i class="el-icon-minus" style="font-weight:600"></i>
              </div>
          </template>
      </el-table-column>
       <el-table-column
      label="成交总价"
      width="90">
        <template slot-scope="scope">
              <div v-if="scope.row.deal_money !== '' && scope.row.deal_money !== null">
                  {{scope.row.deal_money}}
              </div>
              <div v-else>
                    <i class="el-icon-minus" style="font-weight:600"></i>
              </div>
          </template>
      </el-table-column>
       <el-table-column
      label="累计收佣"
      width="90">
         <template slot-scope="scope">
          <div class="tableCommonColor" v-if="scope.row.commission_money !== '' && scope.row.commission_money !== null">
            {{scope.row.commission_money}}
          </div>
          <div v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </div>
        </template>
      </el-table-column>
       <el-table-column
      label="平台费"
      width="90">
        <template slot-scope="scope">
          <div class="tableCommonColor" v-if="scope.row.cost !== '' && scope.row.cost !== null">
            {{scope.row.cost}}
          </div>
          <div v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </div>
        </template>
      </el-table-column>
       <el-table-column
      label="实际返佣"
      width="90">
        <template slot-scope="scope">
          <div class="tableCommonColor" v-if="scope.row.remaining_commission !== '' && scope.row.remaining_commission !== null">
            {{scope.row.remaining_commission}}
          </div>
          <div v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column
      label="联动部门"
      width="120">
        <template slot-scope="scope">
              <div v-if="scope.row.emp_dep_name !== '' && scope.row.emp_dep_name !== null">
                  {{scope.row.emp_dep_name}}
              </div>
              <div v-else>
                    <i class="el-icon-minus" style="font-weight:600"></i>
              </div>
          </template>
      </el-table-column>
      <el-table-column
      label="部门主管"
      width="90">
        <template slot-scope="scope">
              <div v-if="scope.row.emp_masters !== '' && scope.row.emp_masters !== null">
                  {{scope.row.emp_masters}}
              </div>
              <div v-else>
                    <i class="el-icon-minus" style="font-weight:600"></i>
              </div>
          </template>
      </el-table-column>
       <el-table-column
      label="联动专员"
      width="100">
      <template slot-scope="scope">
          <div v-if="scope.row.link_enames !== '' && scope.row.link_enames !== null">
              <p v-for="(list,index) in scope.row.link_enames.split(',')" :key="index">{{list}}</p>
          </div>
          <div v-else>
              <i class="el-icon-minus" style="font-weight:600"></i>
          </div>
      </template>
      </el-table-column>
       <el-table-column
      label="分佣比例"
      width="100">
      <template slot-scope="scope">
          <div v-if="scope.row.link_rates !== '' && scope.row.link_rates !== null">
              <p v-for="(list,index) in scope.row.link_rates.split(',')" :key="index">{{list}}</p>
          </div>
          <div v-else>
              <i class="el-icon-minus" style="font-weight:600"></i>
          </div>
      </template>
      </el-table-column>
      <el-table-column
      label="分佣金额"
      width="100">
      <template slot-scope="scope">
          <div v-if="scope.row.link_moneys !== '' && scope.row.link_moneys !== null">
              <p v-for="(list,index) in scope.row.link_moneys.split(',')" :key="index">{{list}}</p>
          </div>
          <div v-else>
              <i class="el-icon-minus" style="font-weight:600"></i>
          </div>
      </template>
      </el-table-column>
      <el-table-column
      label="合作战区"
      width="110">
        <template slot-scope="scope">
              <div v-if="scope.row.hzzq !== '' && scope.row.hzzq !== null">
                  {{scope.row.hzzq}}
              </div>
              <div v-else>
                    <i class="el-icon-minus" style="font-weight:600"></i>
              </div>
          </template>
      </el-table-column>
      <el-table-column
      label="合作区经"
      width="100">
        <template slot-scope="scope">
              <div v-if="scope.row.hzqj !== '' && scope.row.hzqj !== null">
                  {{scope.row.hzqj}}
              </div>
              <div v-else>
                    <i class="el-icon-minus" style="font-weight:600"></i>
              </div>
          </template>
      </el-table-column>
       <el-table-column
      label="门店性质"
      width="100">
        <template slot-scope="scope">
              <div v-if="scope.row.mdxz !== '' && scope.row.mdxz !== null">
                  {{scope.row.mdxz}}
              </div>
              <div v-else>
                    <i class="el-icon-minus" style="font-weight:600"></i>
              </div>
          </template>
      </el-table-column>
       <el-table-column
      label="合作门店+店长"
      width="110">
        <template slot-scope="scope">
              <div v-if="scope.row.hzmddz !== '' && scope.row.hzmddz !== null">
                  {{scope.row.hzmddz}}
              </div>
              <div v-else>
                    <i class="el-icon-minus" style="font-weight:600"></i>
              </div>
          </template>
      </el-table-column>
      <el-table-column
      label="合作经纪人"
      width="100">
      <template slot-scope="scope">
          <div v-if="scope.row.esf_enames !== '' && scope.row.esf_enames !== null">
              <p v-for="(list,index) in scope.row.esf_enames.split(',')" :key="index">{{list}}</p>
          </div>
          <div v-else>
              <i class="el-icon-minus" style="font-weight:600"></i>
          </div>
      </template>
      </el-table-column>
      <el-table-column
      label="分佣比例"
      width="100">
      <template slot-scope="scope">
          <div v-if="scope.row.esf_rates !== '' && scope.row.esf_rates !== null">
              <p v-for="(list,index) in scope.row.esf_rates.split(',')" :key="index">{{list}}</p>
          </div>
          <div v-else>
              <i class="el-icon-minus" style="font-weight:600"></i>
          </div>
      </template>
      </el-table-column>
      <el-table-column
      label="分佣金额"
      width="100">
      <template slot-scope="scope">
          <div v-if="scope.row.esf_moneys !== '' && scope.row.esf_moneys !== null">
              <p v-for="(list,index) in scope.row.esf_moneys.split(',')" :key="index">{{list}}</p>
          </div>
          <div v-else>
              <i class="el-icon-minus" style="font-weight:600"></i>
          </div>
      </template>
      </el-table-column>
       <el-table-column
      label="佣金"
      width="80">
        <template slot-scope="scope">
              <div v-if="scope.row.is_issue !== '' && scope.row.is_issue !== null">
                  {{scope.row.is_issue}}
              </div>
              <div v-else>
                    <i class="el-icon-minus" style="font-weight:600"></i>
              </div>
          </template>
      </el-table-column>
      <el-table-column
      label="结算时间"
      width="100">
        <template slot-scope="scope">
              <div v-if="scope.row.update_time !== '' && scope.row.update_time !== null">
                  {{scope.row.update_time}}
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
      :current-page="paginationObj.pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="paginationObj.pageSize"
      layout="prev, pager, next,  total, sizes, jumper"
      :total="tableTotals">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },
props:["tableData","tableTotals","paginationObj","loading"],
  methods: {
       // 每页展示条数发生改变
        handleSizeChange(val){
        this.pageSize = val
        this.$emit("sizeChange",val)
        },
        // 页码发生改变
        handleCurrentChange(val){
        this.pageNum = val
        this.$emit("currentChange",val)
        },
  }
}

</script>
<style lang='scss' scoped>
/deep/ .el-table tr{
  height: 66px;
  td{
      p{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      }
  }
}
/deep/ .el-table__body-wrapper{
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
      height: 600px;
    }
  }
   @media only screen and (max-width: 700px) {
     /deep/ .el-table__body-wrapper {
      height: 370px;
    }
  }
</style>