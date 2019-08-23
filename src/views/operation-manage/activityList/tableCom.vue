<!-- 吉家活动公共table组件 -->
<template>
  <div>
    <el-table
    v-loading="loading"
    element-loading-text="玩命加载中"
    :data="tableData"
    @selection-change="handleSelectionChange"
    border
    >
        <el-table-column
        type="selection"
        width="55">
        </el-table-column>
        <el-table-column 
        v-for="(item,index) in showTableData"
        :label="item.name" 
        :width="item.width"
        :show-overflow-tooltip="item.name == '备注' || item.name == '活动名称'? true : false"
        :key="index">
          <template slot-scope="scope">
            <div v-if="scope.row[item.value] !== '' && scope.row[item.value] !== null ">
                <span v-if="item.name == '图片'">
                    <img :src="scope.row[item.value]" alt="">
                </span>
                <span v-else-if="item.name == '上下架状态'">
                  <span>{{scope.row[item.value] == '0' ? '下架' : '上架'}}</span>
                </span>
                <span v-else-if="item.name == '操作'">
                    <span style="color:#3292F5;" @click="upActivity(scope.row)" v-if="!isCustom">{{scope.row['upperLowerRackState'] == '0' ? '上架' : '下架'}}</span>
                    <span style="color:#3292F5;" @click="upActivity(scope.row)" v-if="isCustom">{{scope.row['upper_lower_shelf_status'] == '0' ? '上架' : '下架'}}</span>
                    <span style="color:#3292F5;" @click="getList(scope.row)" v-if="!isCustom">领取列表</span>
                    <span style="color:#3292F5;" @click="editFixedActivity(scope.row)">编辑</span>
                    <span style="color:#3292F5;" @click="clickDelete(scope.row)">删除</span>
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
props:["showTableData", "tableData","tableTotals","paginationObj","loading","isCustom"],
  methods: {
       // 每页展示条数发生改变
        handleSizeChange(val){
        // this.pageSize = val
        this.$emit("handleSizeChange",val)
        },
        // 页码发生改变
        handleCurrentChange(val){
        // this.pageNum = val
        this.$emit("handleCurrentChange",val)
        },
        // 点击编辑按钮
        editFixedActivity(scope){
          scope.checkId = 1
          this.$emit("editActivity",scope)
        },
        // 点击上架时
        upActivity(scope){
          // console.log(scope);
          let qs = require('qs')
          let params = {}
          this.isCustom == 1 ? params.bcaId = scope.id : params.id = scope.id
          this.isCustom == 1 ? params.company = scope.companyId : params.companyId = scope.companyId
          this.isCustom == 1 ? (params.state = (scope.upper_lower_shelf_status == 0 ? 1 : 0)) : (params.state = (scope.upperLowerRackState == 0 ? 1 : 0))
          this.$axios.post(`/api/${this.isCustom == 1 ? 'upAndDownCustomActivities' : 'upperLowerFixedActivities'}`,qs.stringify(params)).then(res => {
            res = res.data
            // debugger
            if(res.status === 200){
              this.alertMessage("success", "操作成功", 1500)
              this.$emit("getTableData",1)
            }else if(res.status === 4003){
              this.$emit("noUpMethod",res.message)
              return
            }
            else{
              this.alertMessage("info", res.message, 2000)
              return
            }
          })
        },
        handleSelectionChange(data){
          this.$emit("writeDeleteData",data)
        },
        clickDelete(scope){
        this.$emit("deleteActivity",scope)
        },
        // 点击领取列表
        getList(scope){
          this.$emit("getActivityList",scope.id)
        }
  }
}
</script>
<style lang='scss' scoped>
/deep/ .el-tooltip{
    >div{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
.activityStatus-up, .activityStatus-down{
  display: inline-block;
  width: 44px;
  height: 22px;
  text-align: center;
  line-height: 22px;
  color: #fff;
  background-color: #53B458;
  font-size: 12px;
  border-radius: 3px;
}
.activityStatus-down{
  background-color: #A0A0A0;
}
/deep/ .el-table tr{
  height: 66px;
}
/deep/ .el-table__body-wrapper{
  width: 101.5%;
  overflow: scroll;
  img{
    width: 90px;
    height: 60px;
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
      height: 600px;
    }
  }
   @media only screen and (max-width: 700px) {
     /deep/ .el-table__body-wrapper {
      height: 370px;
    }
  }
</style>