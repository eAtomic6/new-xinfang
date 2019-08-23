<!-- 获客列表table表格组件 -->
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
        :width="item.width"
        :key="index">
          <template slot-scope="scope">
            <div v-if="scope.row[item.value] !== '' && scope.row[item.value] !== null && scope.row[item.value] !== '-'">
                <span v-if="item.name == '电话录音'">
                    <audio :src="scope.row[item.value]" class="telephoneCss" controls="controls">
                  </audio>
                </span>
                <span v-else>
                {{scope.row[item.value]}}
                </span>
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
        // this.pageSize = val
        this.$emit("sizeChange",val)
        },
        // 页码发生改变
        handleCurrentChange(val){
        // this.pageNum = val
        this.$emit("currentChange",val)
        },
  }
}

</script>
<style lang='scss' scoped>
  /deep/ .el-select{
    .el-input__inner{
      font-weight: 700;
    }
  }
 /deep/ .el-table__body-wrapper{
  width: 101.5%;
  overflow: scroll;
}
/deep/ .el-table__body{
  .el-table__row{
    td{
      &:nth-of-type(11){
        overflow: hidden; 
        padding-right: 19px;
      }
    }
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
      height: 610px;
    }
  }
   @media only screen and (max-width: 700px) {
     /deep/ .el-table__body-wrapper {
      height: 370px;
    }
  }
  .telephoneCss{
    &:focus{
      outline: none;
    }
    margin-left: -6px;
  }
</style>