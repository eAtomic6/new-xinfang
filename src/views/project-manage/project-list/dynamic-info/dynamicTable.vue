<!-- 动态列表页面 -->
<template>
<div>
  <div class="w-select">
       <el-form :inline="true" :model="keyWordData" class="demo-form-inline" min-width="1398px">
        <el-form-item label="关键词:">
            <el-input v-model="keyWordData.keyword" placeholder="可搜索：发布内容、发布人" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="warning" @click="querySelect" class="search-but">查询</el-button>
        </el-form-item>
        <el-form-item>
        <el-button type="primary" class="but-lightblue" @click="deleteData('1')">批量删除
        </el-button>
      </el-form-item>
    </el-form>
  </div>
    <el-table
    v-loading="loading"
    element-loading-text="玩命加载中"
    :data="tableData"
    border
    @selection-change="handleSelectionChange"
    >
    <el-table-column
    type="selection"
    width="55">
    </el-table-column>
    <el-table-column 
    v-for="(item,index) in showTableData"
    :label="item.name" 
    :width="item.width"
    :show-overflow-tooltip="item.name == '发布内容' || item.name == '所属公司'? true : false"
    :key="index">
    <template slot-scope="scope">
        <div v-if="scope.row[item.value] !== '' && scope.row[item.value] !== null && scope.row[item.value] !== '-'">
            <span v-if="item.name == '图片'">
                <img style="width:74px;height:54px" :src="(scope.row[item.value].split(','))[0]" alt="">
            </span>
            <span v-else-if="item.name == '动态时间'">
                {{(scope.row[item.value].split(' '))[0]}}
            </span>
            <span v-else-if="item.name == '操作'">
                <span @click="editReleaClick(scope.row)" style="color:#3292F5">编辑</span>
                <span @click="deleteData(scope.row)" style="color:#3292F5">删除</span>
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
    :current-page="pageNum"
    :page-sizes="[5,10,15,20]"
    :page-size="pageSize"
    layout="prev, pager, next,  total, sizes, jumper"
    :total="tableTotals">
</el-pagination>
<el-dialog
    width="30%"
    title="提示"
    :visible.sync="deleteDataDialog"
    append-to-body>
    <p style="text-align:center">您确定删除吗？</p>
    <div class="move_footer">
      <el-button @click="sureDelete" class="sureAdd"  type="primary" round>确定</el-button>
      <el-button @click="deleteDataDialog = false" class="noAdd">取 消</el-button>
    </div>
</el-dialog>
</div>
</template>

<script>
import {showTableData} from './tableData.js'
export default {
  data () {
    return {
        keyWordData:{
            keyword:""
        },
        pageNum:1,
        pageSize:5,
        tableTotals:0,
        tableData:[],
        loading:false,
        showTableData:showTableData,
        deleteDataDialog:false,
        selectArr:[],      // 表头select选中的数组
        deleteId:""         // 要删除的动态id
    };
  },
props:["projectId"],
    created () {
        },
    mounted () {
        setTimeout(() => {
            this.getTableData()
        }, 300);
    },
  methods: {
      getTableData(){
        //   console.log(this.projectId);
          this.keyWordData.pageNum = this.pageNum
          this.keyWordData.pageSize = this.pageSize
          this.keyWordData.bId = this.projectId
          this.$axios.get("/api/developmentsList",{params:this.keyWordData}).then(res => {
              res = res.data
            //   debugger
            this.tableTotals = res.data.total
            this.tableData = res.data.list
          })
      },
      querySelect(){
          this.pageNum = 1
          this.getTableData()
      },
      handleSizeChange(val){
          this.pageSize = val
          this.getTableData()
      },
      handleCurrentChange(val){
          this.pageNum = val
          this.getTableData()
      },
      handleSelectionChange(data){
        //   debugger
        this.selectArr = data
      },
    //   删除table列表指定数据
      deleteData(row){
          console.log(row);
          let strArr = []
          let idStr = ""
          if(row == 1 && !this.selectArr.length){
              this.alertMessage("info", "请选择删除的动态", 1500)
              return
          } else if(row == 1 && this.selectArr.length){
              this.selectArr.forEach(res => {
                  strArr.push(res.id)
              })
              idStr = strArr.join(",")
          }else{
              idStr = row.id
          }
          this.deleteId = idStr
          this.deleteDataDialog = true
      },
    //   点击编辑按钮
      editReleaClick(row){
        //   debugger
          this.$emit("editRelea",row)
      },
    //   点击确认删除
      sureDelete(){
          this.$axios.delete("/api/deleteDevelopments",{params:{dynamicId:this.deleteId}}).then(res => {
              res = res.data
            //   debugger
            if(res.status === 200){
                this.alertMessage("success","删除成功",1500)
                this.pageNum = 1
                this.pageSize = 5
                this.getTableData()
                this.$emit("getNewTableData")
                this.deleteDataDialog = false
            }else {
                this.alertMessage("warning",res.message,1500)
                return
            }
          })
      }
  },
  watch: {
  },
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
/deep/ .el-form{
    .el-form-item{
        &:nth-of-type(1){
            .el-input__inner{
                width: 184px;
            }
        }
    }
}
</style>