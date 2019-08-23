<!-- 报表管理中的table表格组件 -->
<template>
  <div>
    <el-table
    v-loading="loading"
    element-loading-text="玩命加载中"
    :data="tableData"
    ref="clearSort"
    @row-click="clickRow"
    @sort-change="sortData"
    border
    >
     <el-table-column
      label="序号"
      width="60"
      type="index">
      </el-table-column>
       <el-table-column
        v-if="isShowDetail"
      label="操作"
      width="90"
      >
      <template slot-scope="scope">
        <button type="text" class="lookDetail" @click="projectDetail(scope.row)">查看详情</button>
      </template>
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
  <el-pagination
      v-if="isShowPagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="prev, pager, next,  total, sizes, jumper"
      :total="tableTotals">
    </el-pagination>
    <div v-show="false">{{testData}}</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pageSize: 20,
      pageNum:  1,
      bbb:1
    };
  },
props:["showTableData", "tableData","tableTotals","paginationObj","loading","isShowDetail","isShowPagination"],
created(){
},
  methods: {
    sortData(column){
      if(column.column){
        this.$emit("sortChange",column)
        this.$store.commit("sortChange","bbb")
      }else{
        this.$emit("sortMethod")
      }
    },
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
    projectDetail(data){
      let id = ""
      id = data.b_id || data.id
      this.$emit("lookDetail",id)
    },
    // 当前行被点击时
    clickRow(row){
      this.$emit("clickRow",row)
    }
  },
  watch: {
    paginationObj(val){
      this.pageSize = val.pageSize
      this.pageNum = val.pageNum
    },
  },
  computed:{
    testData(){
      // debugger
      if (this.$store.state.watchSort == "aaa") {
        this.$refs.clearSort.clearSort()
        this.$store.commit("sortChange","bbb")
      }
    }
  }
}

</script>
<style lang='scss' scoped>
/deep/ .el-table tr{
  height: 66px;
}
.lookDetail{
  background-color: #333;
    color: #fff;
    padding: 4px 5px;
    cursor: pointer;
    border-radius: 2px;
    border: none;
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