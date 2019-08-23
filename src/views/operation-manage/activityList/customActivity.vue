<!-- 吉家自定义活动页面 -->
<template>
  <div>
      <query-com
      @addNewActivity='addNewActivity'
      @getTableData="getTableData"
      @querySelect="querySelect"
      @resetQuery="resetQuery"
      :isCustom="isCustom"
      @deleteActivity="deleteActivity"
      ref="reLoadTable"
       :companyData="companyData"></query-com>
      <table-com
      :paginationObj="paginationObj"
      :isCustom="isCustom"
      :showTableData="showTableData"
      :tableTotals="tableTotals"
      @getActivityList="getActivityList"
      @getTableData="getTableData"
      @writeDeleteData="writeDeleteData"
      @deleteActivity="deleteActivity"
      @noUpMethod="noUpMethod"
      :loading="loading"
      @editActivity="editActivity"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      :tableData="tableData"></table-com>
      <el-dialog :title="positionDialogTitle" :visible.sync="addAcivityDialog" @close="clearAddDiaolog" width="760px">
            <add-custom ref="addChild" v-if="addAcivityDialog" :editData="editData"  @closeAddDialog="closeAddDialog" :companyData="companyData"></add-custom>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="deleteDialog"  width="500px">
            <p style="text-align:center">您确定删除吗？</p>
            <div class="move_footer">
            <el-button @click="sureDelete" class="sureAdd"  type="primary" round>确定</el-button>
            <el-button @click="deleteDialog = false" class="noAdd">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="提示:上架失败" :visible.sync="upMessageDialog"  width="400px">
            <p style="text-align:center">{{noUpMessage}}</p>
            <div class="move_footer">
            <el-button @click="upMessageDialog = false" class="sureAdd"  type="primary" round>确定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="领取列表" :visible.sync="getLIstDialog"  v-if="getLIstDialog" width="1042px">
            <get-list :itemId="itemId"  v-if="getLIstDialog" ></get-list>
        </el-dialog>
  </div>
</template>

<script>
import queryCom from './queryCom.vue'
import tableCom from './tableCom.vue'
import addCustom from './addCustom.vue'
import getList from './getActivityList/getList.vue'
import {showTableData} from './customActivityData.js'
export default {
    components:{queryCom,tableCom,addCustom,getList},
  data () {
    return {
        getLIstDialog:false,   //领取列表弹框显示隐藏
        paginationObj:{pageSize:20,pageNum:1},
        showTableData:showTableData,
        addAcivityDialog:false,
        companyData:[],       // 所有公司数据
        keywordData:{},            // 获取table数据
        tableData:[],               // table数据
        tableTotals:0,               // table数据条数
        loading:true,               // table数据动画
        editData:{},
        deleteData:[],              // 待删除的数据checkbox
        deleteDialog:false,   // 删除活动弹框
        params:{},
        noUpMessage:"",        //无法上架的提示语
        upMessageDialog:false,   // 无法上架的弹框
        itemId:"",
        positionDialogTitle:"新增固定活动",
        isCustom:1,         // 用来判断是自定义活动页面
    };
  },
    mounted(){
        this.getCompanyData()
    },
  methods: {
      addNewActivity(){
          this.addAcivityDialog = true
          this.editData = {}
          this.positionDialogTitle="新增自定义活动"
      },
    //   获取所有公司数据
      getCompanyData(){
        this.$axios.get("/api/getItemCompany").then(res => {
            res = res.data
            if(res.status === 200){
                this.companyData = res.data
            }else{
                this.alertMessage("warning",res.message,1500)
                return
            }
        })
      },
    //   无法上架时的方法
    noUpMethod(data){
        this.upMessageDialog = true
        this.noUpMessage = data
    },
    //   点击查询按钮
      querySelect(data){
          this.paginationObj = {
            pageNum:1,
            pageSize:20
        }
          this.getTableData(data)
      },
    //   点击重置按钮
    resetQuery(data){
        this.paginationObj = {
            pageNum:1,
            pageSize:20
        }
        this.getTableData(data)
    },
    // table每页数据条数发生改变时
    handleSizeChange(val){
        this.$set(this.paginationObj,'pageSize',val)
        this.getTableData(this.keywordData)
    },
    // table页数发生改变时
    handleCurrentChange(val){
        this.$set(this.paginationObj,'pageNum',val)
        this.getTableData(this.keywordData)
    },
      closeAddDialog(int){
          this.addAcivityDialog = false
          int === 1 ? this.$refs.reLoadTable.resetQuery() : ""
      },
      clearAddDiaolog(){
          this.$refs.addChild.defaultForm()
      },
    //   获取table数据
      getTableData(data){
          this.loading = true
          console.log(data)
          if(data != 1){
              if(data && data.hasOwnProperty("companyId")){
                this.keywordData.company = data.companyId
                this.keywordData.state = data.upperLowerRackStatus
                this.keywordData.keyword = data.keyword  
                this.keywordData.startTime = data.creationStartTime
                this.keywordData.EndTime = data.creationEndTime
              }
              this.keywordData.pageSize = this.paginationObj.pageSize
              this.keywordData.pageNum = this.paginationObj.pageNum 
          }
        //   data == 1 ? "" : this.keywordData = Object.assign(data,this.paginationObj,{})
        //   console.log(this.keywordData);

          this.$axios.get("/api/queryCustomEventList",{params:this.keywordData}).then(res => {
              res = res.data
              if(res.status === 200){
                  this.tableData = res.data.list
                  this.tableTotals = res.data.total
                    this.loading = false
              }
          })
      },
    //   点击编辑活动
    editActivity(data){
        console.log(data);
        this.addAcivityDialog = true
        this.editData = data
        this.positionDialogTitle = "编辑自定义活动"
    },
    writeDeleteData(data){
        this.deleteData = data
    },
    // 点击删除
    deleteActivity(data){
        let idArr = []
        if(data === 1){
            if(this.deleteData.length){
                this.deleteData.forEach(val => {
                    idArr.push(val.id)
                })
                this.params.ids = idArr.join(",")
                 this.deleteDialog = true
            }else{
                this.alertMessage("info", "请选择要删除的活动", 1500)
                return
            }
        }else{
            this.params.ids = data.id
            this.deleteDialog = true
        }
    },
    // 确定删除
    sureDelete(data){
        let qs = require("qs")
        this.$axios.delete("/api/deleteCustomActivity", {params:this.params}).then(res => {
            res = res.data
            // debugger
            if(res.status === 200){
                this.alertMessage("success","删除成功",1500)
                this.deleteDialog = false
                this.getTableData(this.keywordData)
            }else{
                this.alertMessage("warning", res.message,1500)
                return
            }
        })
    },
    // 点击领取列表时
    getActivityList(id){
        // console.log(id);
        this.getLIstDialog = true
        this.itemId = id
        // console.log(this.$refs.listChild);
        // this.$refs.listChild?this.$refs.listChild.getListMethod():""
        // console.log(this.$refs.listChild);
        // this.$refs.listChild.getListMethod()
    },
    // // 关闭领取列表页面时
    // closeGetList(){
    //     // debugger
    //     this.itemId = ""
    // }
  }
}

</script>
<style lang='scss' scoped>
</style>