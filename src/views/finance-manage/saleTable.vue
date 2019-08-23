<!-- 结算报表公共table组件 -->
<template>
  <div>
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
        :show-overflow-tooltip="item.name == '分销单位' || item.name == '经纪人' || item.name == '项目名称' ||item.name == '所属部门'"
        :width="item.width"
        label-class-name="tableCloColor"
        :class-name="item.name=='佣金金额' ||item.name=='已收佣' ||item.name=='已结佣' || item.name=='本次应结佣金'
         || item.name=='合同总价'|| item.name=='本次实付佣金' || item.name=='本次收佣金额'?'tableCommonColor':''"
        :key="index">
          <template slot-scope="scope">
            <div v-if="scope.row[item.value] !== '' && scope.row[item.value] !== null ">
                <span v-if="item.name=='客户姓名' || item.name=='项目名称'" style="color:rgb(50, 146, 245);">
                    {{scope.row[item.value]}}
                </span>
                <span v-else>{{scope.row[item.value]}}</span>
                
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
props:["showTableData", "tableData","tableTotals","paginationObj","loading"],
  methods: {
       // 每页展示条数发生改变
        handleSizeChange(val){
        this.pageSize = val
        },
        // 页码发生改变
        handleCurrentChange(val){
        this.pageNum = val
        },
  }
}
</script>
<style lang='scss' scoped>
/deep/ .el-table tr{
  height: 66px;
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