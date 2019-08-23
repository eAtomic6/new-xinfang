<!-- u+客源列表 -->
<template>
  <div class="container">
    <!-- 客户详情弹框开始 -->
    <el-dialog
      title="客户明细"
      class="detail-firstDialog"
      :visible.sync="detailDialog"
      :before-close="handleClose"
      v-if="detailDialog"
    >
      <customer-detail
        @close="closeDetail"
        :relationData="relationData"
        :customerId="customerId"
        @clickEditCustomer="clickEditCustomer"
        :isUplus="isUplus"
        @getTableData="getTableData"
        @followDialog="followDialog"
        @changeProjectDialog="changeProjectDialog"
      ></customer-detail>
      <!-- 修改报备项目、带看项目开始 -->
      <el-dialog
          :title="changeProjectTitle"
          append-to-body
          class="customer-changeProject"
          :before-close="handleClose"
          :visible.sync="changeProjectType"
        >
        <project-state v-if="changeProjectType" :changeData="changeData" @closeChangeDialog="closeChangeDialog"></project-state>
        </el-dialog>
      <!-- 修改报备项目、带看项目结束 -->
      <!-- 新增带看、报备、页面开始 -->
      <el-dialog
        append-to-body
        :title="insideTitle"
        class="detail-twoDialog"
        :visible.sync="detailInDialog"
        :before-close="handleClose1"
        v-if="detailInDialog"
      >
        <customer-operation
          :formContent="formContent"
          @closeOperation="closeOperation"
          @projectSelect="projectSelect"
          :targetFollow="targetFollow"
          :followType="followType"
          :projectObj="projectObj"
          ref="child"
        ></customer-operation>
        <el-dialog
          title="选择项目"
          append-to-body
          :before-close="handleClose"
          class="operation-project"
          :visible.sync="projectDialog"
        >
          <customer-project
            :avgPrice="avgPrice"
            @noSelect="noSelect"
            @selectProject="selectProject"
          ></customer-project>
        </el-dialog>
      </el-dialog>
      <!-- 新增带看、报备、页面结束 -->
      <!-- 客户编辑页面开始 -->
      <el-dialog
        append-to-body
        class="detail-threeDialog"
        title="新房意向"
        :before-close="handleClose2"
        :visible.sync="detailEditDialog"
        v-if="detailEditDialog"
      >
        <customer-edit
          @projectSelect="projectSelect"
          :customerId="customerId"
          :projectObj="projectObj"
          :dictionaryData="dictionaryData"
          @close="closeDetail"
          @closeDelete="closeDelete"
          @showDeleteDlg="showDeleteDlg"
          @delAlerMessage="delAlerMessage"
          :editFormObj1="editFormObj1"
          @showActiveDialog="showActiveDialog"
          @noEditCustomer="noEditCustomer"
          ref="child"
        ></customer-edit>
        
        <el-dialog
          title="选择项目"
          append-to-body
          :before-close="handleClose"
          class="operation-project"
          :visible.sync="projectDialog"
        >
          <customer-project @noSelect="noSelect"
          :avgPrice="avgPrice"
           @selectProject="selectProject"></customer-project>
        </el-dialog>
        <el-dialog
          title="客户激活"
          append-to-body
          :before-close="handleClose"
          class="edit-active"
          :visible.sync="activeDialog"
        >
          <p>
            是否将客户
            <span>{{activeMessage}}</span> 激活为有购房意向的新客户!
          </p>
          <div class="operation-btn move_footer">
            <el-button class="sureAdd" @click="sureActive">确 定</el-button>
            <el-button class="noAdd" @click="noActive">取 消</el-button>
          </div>
        </el-dialog>
        <!-- =============删除客户开始================== -->
        <el-dialog
          :title="delCustomerTitle"
          append-to-body
          :before-close="closeDelete"
          width="400px"
          class="customer-deleteCustomer"
          :visible.sync="deleteDialog"
        >
          <delete-customer @sureDelCustomer="sureDelCustomer"
          @closeDelete="closeDelete"
          :deleteMessage="deleteMessage"
          ></delete-customer>
        </el-dialog>
        <!-- =============删除客户结束================== -->
      </el-dialog>
      <!-- 客户编辑页面结束 -->
    </el-dialog>
    <!-- 客户详情弹框结束 -->
    <!-- 批量转移弹框开始 -->
    <el-dialog
      title="批量转移"
      class="customer-transfer"
      :visible.sync="transferDialog"
      :before-close="handleClose"
      v-if="transferDialog"
    >
      <customer-transfer @close="close_dialog"></customer-transfer>
    </el-dialog>
    <!-- 批量转移弹框结束 -->
    <customer-query
      @getTableData="getTableData"
      @transferCustomer="transferCustomer"
      :levelData="levelData"
      :isUplus="isUplus"
    ></customer-query>
    <customer-table
    :isUplus="isUplus"
      @clickCustName="clickCustName"
      @sizeChange="sizeChange"
      @numChange="numChange"
      :tableData="tableData"
      :paginationObj="paginationObj"
      :tableTotals="totals"
      :loading="loading"
    ></customer-table>
  </div>
</template>

<script>
import customerQuery from "../customer-query.vue";
import customerTable from "../customer-table.vue";
import customerDetail from "../customer-detail.vue";
import customerTransfer from "../customer-transfer.vue";
import customerEdit from "../customer-edit.vue";
import customerOperation from "../customer-operation.vue";
import customerProject from "../customer-projectList.vue";
import deleteCustomer from "../deleteCustomer.vue";
import projectState from "../changeProject/project-state";
export default {
  components: {
    customerQuery,
    customerTable,
    customerDetail,
    customerOperation,
    customerEdit,
    customerTransfer,
    customerProject,
    deleteCustomer,
    projectState
  },
  data() {
    return {
      changeProjectType:false,   // 修改报备项目、带看项目弹框显示
      changeProjectTitle:"",     // 修改报备项目、带看项目弹框标题
      changeData:{},             // 通过点击修改报备项目、带看项目传给弹框的数据
      delCustomerTitle:"",    // 删除客源弹框标题
      deleteDialog:false,     // 删除客源弹框显示
      deleteMessage:"",       // 删除客源时的提示
      detailDialog: false, // 详情弹框
      projectDialog: false, // 项目弹框
      activeDialog: false, // 激活弹框
      detailInDialog: false, // 详情里面写跟进、报备、带看弹框
      insideTitle: "写跟进",
      detailEditDialog: false, // 编辑弹框
      transferDialog: false,
      tableData: [], // table表格数据
      levelData: [], // 客户等级数据
      relationData: [], // 关系数据
      paginationObj: {
        // table数据的分页
        pageSize: 20,
        pageNum: 1
      },
      keywordObj: {}, //条件查询数据
      totals: 0, // table数据总条数
      customerId: "", // 当前点击客户的id
      formContent: "", // 点击新增报备、带看、跟进时的类型存储
      followTarget: [], //跟进目的
      followType: [], // 跟进类型
      dictionaryData: {}, // 传给编辑字典数据
      editFormObj1: {}, // 传给编辑的对象数据
      activeMessage: "", // 激活弹框提示人和手机号
      avgPrice: [], // 均价数据
      projectObj: {}, // 报备、带看传入表单信息
      // customerId:""         // 激活弹框中的客户id存储
      isUplus:"1" ,        // 用来判断是否是u+客源列表
      loading:true
    };
  },
  created() {
    this.$axios.get("/api/third/uplus/customers/can").then(res => {
      res = res.data
      if(res.status === 200){
        this.getDictionary();
      }
    }).catch(err => {
        if (err.response.status === 403) {
          this.$router.push({ name: "403errorPage" });
          return;
        }
      });
  },
  methods: {
    getDictionary() {
      let params = {
        ids: "211,221,303,311,231,250,257,284,288,292,317"
      };
      this.$axios.get("/api/dictionary/list", { params: params }).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.dictionaryData = Object.assign(
            {},
            this.dictionaryData,
            res.data
          );
          this.levelData = res.data["211"].children;
          this.relationData = res.data["221"].children;
          this.targetFollow = res.data["311"].children;
          this.followType = res.data["303"].children;
          this.avgPrice = res.data["317"].children;
          // console.log(this.levelData);
        } else {
          this.alertMessage("warning", res.message);
          return;
        }
      });
    },
    // 转移弹窗里关闭转移弹窗并刷新页面
    close_dialog(val, refresh) {
      // refresh 为true,表示点击的是痰喘的确定按钮，false是取消按钮
      if (refresh) this.getTableData(this.keywordObj);
      this.transferDialog = val;
    },
    handleClose(done) {
      done();
    },
    handleClose1(done){
    this.$refs.child.defaultMethod();
    done()
    },
    // 点击table表格客户姓名的时候
    clickCustName(val) {
      this.detailDialog = true;
      this.customerId = val.id;
    },
    // 点击客户详情里面的跟进、报备、带看时
    followDialog(val) {
      // debugger
      this.formContent = val;
      this.insideTitle = val.type;
      this.detailInDialog = true;
    },
    // 详情页面点击编辑的时候
    clickEditCustomer(obj) {
      this.editFormObj1 = obj;
      this.detailEditDialog = true;
    },
    // 批量转移弹框显示
    transferCustomer() {
      if (this.$store.state.managementCustomerChoice.length > 0) {
        this.transferDialog = true;
      } else {
        this.alertMessage("warning", "请选择转移人");
      }
    },
    getTableData(data, int) {
      this.loading = true
      // debugger
      if(data){
          if (int) {
          this.paginationObj = {
            pageNum: 1,
            pageSize: 20
          };
        }
        this.keywordObj = Object.assign({}, data, this.paginationObj);
      }else{
        this.keywordObj=Object.assign({}, this.keywordObj, this.paginationObj);
      }
      this.$axios
        .get("/api/third/uplus/customers", { params: this.keywordObj })
        .then(res => {
          res = res.data;
          //  debugger
          if (res.status === 200) {
            this.tableData = res.data.list;
            this.totals = res.data.total;
            this.loading = false
          } else {
            this.alertMessage("warning", res.message);
            return;
          }
        });
    },
    // table每页展示数据条数改变
    sizeChange(val) {
      this.paginationObj.pageSize = val;
      this.getTableData(this.keywordObj);
    },
    // table当前页码改变
    numChange(val) {
      this.paginationObj.pageNum = val;
      this.getTableData(this.keywordObj);
    },
    // 取消详情弹框
    closeDetail() {
      this.detailDialog = false;
      this.deleteDialog = false
    },
    // 关闭跟进、带看、报备弹框
    closeOperation() {
      this.detailInDialog = false;
    },
    // 点击编辑激活时
    showActiveDialog(val) {
      this.activeMessage = val;
      this.activeDialog = true;
    },
    // 激活弹框点击取消
    noActive() {
      this.activeDialog = false;
    },
    // 激活弹框点击确认
    sureActive() {
      let params = {
        id: this.customerId
      };
      let qs = require("qs");
      this.$axios
        .put("/api/activate/customer", qs.stringify(params))
        .then(res => {
          res = res.data;
          // debugger
          if (res.status === 200) {
            this.alertMessage("success", "激活成功");
            this.activeDialog = false;
            this.detailEditDialog = false;
          } else {
            this.alertMessage("warning", res.message);
            return;
          }
        });
    },
    // 项目选择
    projectSelect() {
      // debugger
      this.projectDialog = true;
    },
    // 取消项目选择
    noSelect() {
      this.projectDialog = false;
    },
    // 确认选取项目
    selectProject(data) {
      this.$axios
        .get("/api/itemDetailsTelephoneNumber", { params: { id: data.id } })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.projectObj = res.data[0];
            this.projectDialog = false;
          } else {
            this.alertMessage("warning", res.message);
            return;
          }
        });
      console.log(data);
    },
    // 取消项目编辑
    noEditCustomer() {
      this.projectObj = {}
      this.detailEditDialog = false;
    },
    handleClose2(done){
      this.projectObj = {}
      done()
    },
    // =========================================删除客户的所有方法开始=========================================
    showDeleteDlg(val){
      // debugger
      this.delCustomerTitle = val.name + " "+ val.phone
      this.deleteDialog = true
    },
    // 确定删除客户
    sureDelCustomer(){
      // 调用编辑中的方法
      // debugger
      this.$refs.child.sureEdit(1)
      // console.log( this.$refs.child);
    },
    // 客户删除成功时关闭弹框
    closeDelete(){
      this.deleteDialog = false
      this.deleteMessage = ""
    },
    // 客户无法删除的提示
    delAlerMessage(msg){
      // debugger
      this.deleteMessage = msg
    },
    // 点击修改报备项目、带看项目
    changeProjectDialog(data){
      this.changeProjectType = true
      this.changeProjectTitle = (data.valueName=='报备项目' ? '修改报备' : '修改带看')+  " 【"+data.b_name+"】"
      this.changeData.id = data.id
      this.changeData.valueName = data.valueName
      // console.log(data);
    },
    // 关闭报备项目、带看项目修改弹框
    closeChangeDialog(){
      this.changeProjectType = false
    }
    // =========================================删除客户的所有方法结束=========================================
  }
};
</script>
<style lang='scss' scoped>
/deep/.customer-deleteCustomer{
  .el-dialog{
    .el-dialog__header{
      line-height: 58px;
      .el-dialog__title{
        display: inline-block;
        width: 350px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
/deep/ .el-dialog {
  margin-top: 5vh !important;
}
.detail-firstDialog {
  /deep/ .el-dialog {
    width: 900px;
    .el-dialog__body {
      padding: 0;
    }
  }
}
.customer-changeProject{
  /deep/ .el-dialog{
     margin-top: 20vh !important;
  }
}
.detail-twoDialog {
  /deep/ .el-dialog {
    width: 660px;
  }
}
.detail-threeDialog {
  /deep/ .el-dialog {
    width: 770px;
  }
}
.customer-transfer {
  /deep/ .el-dialog {
    width: 514px;
    height: 378px;
  }
}
.edit-active {
  /deep/ .el-dialog {
    width: 514px;
    height: 378px;
    p {
      margin-top: 80px;
      text-align: center;
      color: #333;
      span {
        color: #f85951;
      }
    }
    .move_footer {
      margin-top: 105px;
      .el-button {
        &:nth-of-type(1) {
          background-color: #f85951;
        }
      }
    }
  }
}
.operation-project {
  /deep/ .el-dialog {
    width: 950px;
    height: 700px;
    .el-dialog__body {
      padding: 13px 20px;
    }
  }
}
</style>