<!-- 退房确认 -->
<template>
  <div class="container" id="dropPrepare">
    <!-- 头部搜索表单 -->
    <el-form :inline="true" :model="dropPrepareForm" class="demo-form-inline w-select" min-width="1398px">
      <el-form-item label="部门: ">
        <!-- <el-input v-model="dropPrepareForm.department"></el-input> -->
        <el-select v-model="dropPrepareForm.department" placeholder="请选择" class="tree-input">
          <el-option value="">
            <el-tree :data="departmentData" :props="departmentProp" node-key="DepartOnlyCode" check-on-click-node :expand-on-click-node=true @node-click="clickNode"></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目驻场: ">
        <!-- <el-input v-model="dropPrepareForm.person"></el-input> -->
        <el-autocomplete class="inline-input" v-model="dropPrepareForm.person" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect"></el-autocomplete>
      </el-form-item>
      <el-form-item label="审核状态：">
        <el-select v-model="dropPrepareForm.auditStatus" size="mini">
          <el-option label="全部" value=""></el-option>
          <el-option label="审核中" value="0"></el-option>
          <el-option label="已退房" value="1"></el-option>
          <el-option label="退房失败" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="block" label="退房申请日期: ">
        <!-- <el-date-picker v-model="dropPrepareForm.refunDate" type="date" placeholder="选择日期"> -->
          <el-date-picker v-model="dealTime" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="关键词">
        <el-input v-model="dropPrepareForm.keyWord" size="mini" placeholder="楼盘名称,客户名称,客户电话" maxlength=50></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="onSearch" class="search-but">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="onReset" class="chongzhi-but">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onExport" class="but-lightblue"><span class="icon icon-daochu org-icon"></span>导出</el-button>
      </el-form-item>
    </el-form>
    <!-- table表格 -->
    <el-table :data="tableData" style="width: 100%" class="drop-prepare-table table-list" :row-key="getRowKeys" @row-click="rowClick" @expand-change="showDetail" :expand-row-keys="expands">
      <el-table-column type="expand" width="5">
        <template slot-scope="props">
          <el-row style="min-width: 1398px">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-col :span="2" class="expand-one">
                <ul>
                  <li>
                    <strong>{{ rowExpand.name }}</strong>&nbsp;&nbsp;</li>
                  <li>{{ rowExpand.cNo }}</li>
                  <li>[网络-中房网]</li>
                </ul>
              </el-col>
              <el-col :span="3" class="expand-two">
                <ul>
                  <li>
                    <strong>项目信息</strong>
                  </li>
                  <li>{{ rowExpand.name }} {{ rowExpand.phone }}</li>
                  <li>{{ rowExpand.buildName }}</li>
                  <li>{{ rowExpand.area }}</li>
                </ul>
              </el-col>
              <el-col :span="3" class="expand-three">
                <ul>
                  <li>
                    <strong>合同资料</strong>
                  </li>
                  <li>{{ dropHouseForm.time }}：{{ rowExpand.dealTime }}</li>
                  <li>房屋房号：{{ rowExpand.houseNo }}</li>
                  <li>房屋面积：{{ rowExpand.houseArea }}㎡</li>
                  <li>房屋总价：{{ rowExpand.housePrice }}元</li>
                </ul>
              </el-col>
              <el-col :span="3" class="expand-four">
                <ul>
                  <li>
                    <strong>退房审批</strong>
                  </li>
                  <li>退房时间：{{ rowExpand.cancelTime | formatTimeFront }}</li>
                  <li>退房金额：{{ rowExpand.amount }}元</li>
                  <li>客户退房原因：{{ rowExpand.reason }}</li>
                </ul>
              </el-col>
              <el-col :span="1" class="expand-fifth">

                <img :src="rowExpand.unsubCert" alt="">

              </el-col>
              <el-col :span="11" class="expand-six">
                <div class="list-box">
                  <ul class="clearfix">
                    <!-- 没有报备的情况可以直接去掉 li -->
                    <li v-for="(item,index) in customerProgressBar" :key="index" :class="{'on':item.view}">
                      <p class="black-g">{{ item.name }}</p>
                      <em class="c-big">
                        <em class="c-small"></em>
                      </em>
                      <p class="c-name">{{ item.empName }}</p>
                      <p class="c-time">{{ item.operateTime | formatTimeFront}}</p>
                      <p class="c-time">{{ item.operateTime | formatTimeEnd}}</p>
                    </li>
                  </ul>
                </div>
              </el-col>
              <el-col :span="1" class="expand-seven" v-if="showExpandSeven">
                <input type="button" value="退房确认" class="btn-drop-prepare" @click="dropConfirmVisible = true">
                <i class="el-icon-edit-outline"></i>
              </el-col>
            </el-form>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" min-width="66">
      </el-table-column>
      <el-table-column label="客户名称" prop="cusName">
      </el-table-column>
      <el-table-column label="所属阶段" prop="befor_state">
      </el-table-column>
      <el-table-column label="审核状态" prop="state">
      </el-table-column>
      <el-table-column label="成交项目" prop="b_name" min-width="120">
      </el-table-column>
      <el-table-column label="退房时间" prop="cancel_time" min-width="115">
      </el-table-column>
      <el-table-column label="退房金额" prop="amount">
      </el-table-column>
      <el-table-column label="客户退房原因" prop="reason" min-width="120">
      </el-table-column>
      <el-table-column label="退房申请人" prop="name" min-width="130">
      </el-table-column>
      <el-table-column label="电话" prop="mobile" min-width="111">
      </el-table-column>
      <el-table-column label="退房申请时间" prop="createTime" min-width="120">
      </el-table-column>
      <el-table-column label="退房审核时间" prop="checkTime" min-width="120">
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="prev, pager, next,  total, sizes, jumper"
      :total="count">
    </el-pagination>
    <!-- 退房证据 模态框 -->
    <el-dialog :title="dropHouseData" :visible.sync="dropPrepareVisible" width="770px" class="drop-prepare-proof">
      <div class="drop-preparebox">
        <img :src="dropPrepareImg" alt="">
      </div>
    </el-dialog>
    <!-- 退房确认 模态框 -->
    <el-dialog title="退房确认" :visible.sync="dropConfirmVisible" width="770px" top="40px" class="drop-confirm" :before-close="handleClose">
      <strong class="strong-title">基本资料</strong>
      <div class="base-info"> 
        <p><span>客户姓名: {{ rowExpand.name }}</span><span>客户状态: {{ rowExpand.state }}</span></p>
        <p><span>手机号码: {{ rowExpand.phone }}</span></p>
        <p>成交项目: {{ rowExpand.buildName }}</p>
        <p><span>报备保护期: {{ rowExpand.reportTime }}小时</span><span>带看保护期: {{ rowExpand.lookTime }}小时</span><span>项目性质: {{ rowExpand.buildingProperty }}</span></p>
      </div>
      <strong class="strong-title st-second">{{ dropHouseInfo }}</strong>
      <div class="confirm-prepare-info">
        <p><span>合同姓名: {{ rowExpand.custName }}</span><span>合同电话: {{ rowExpand.custMobile }}</span><span>{{ dropHouseForm.time }}: {{ rowExpand.dealTime }}</span></p>
        <p class="p-confirm"><span v-show="rengouMoney">认购金额: {{ rowExpand.dealPay }}元</span><span>{{ dropHouseForm.houseNo }}: {{ rowExpand.houseNo }}</span><span>房屋面积: {{ rowExpand.houseArea }}㎡</span><span>房屋总价: {{ rowExpand.housePrice }}元</span></p>
        <span class="span-confirm-prepare">{{ dropHouseText }}: </span><div class="confirm-prepare" @click="ViewBigPhoto(index,value)" v-for="(value,index) in dealCert" :key="index"><img :src="value" alt=""></div>
      </div>
      <strong class="strong-title st-three">退房审批</strong>
      <div class="drop-prepare-check">
        <p><span>退房时间: {{ rowExpand.cancelTime | formatTimeFront }}</span><span>退款金额: {{ rowExpand.amount }}元</span></p>
        <p class="p-drop-reason">客户退房原因: {{ rowExpand.reason }}</p>
        <span class="span-drop-prepare">退房证据: </span><div class="confirm-prepare" @click="ViewBigPhoto(index,value)" v-for="(value,index) in unsubCert" :key="index"><img :src="value" alt=""></div>
      </div>
      <div class="dialogfoot-btn">
        <el-button class="agreenot" @click="dropConfirm(1)">不同意</el-button>
        <el-button class="agreeok" @click="dropConfirm(2)">同 意</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartList, getEmployeeList } from "@/api/index";
import axios from "axios"
export default {
  data() {
    return {
      // 表单中的数据
      dropPrepareForm: {
        department: "",
        person: "",
        auditStatus: "",
        keyWord: "",
        dealTimeStart: "",
        dealTimeEnd: "",
      },
      //form区域对应字段
      departmentProp: {
        value: "id",
        label: "name",
        children: "child"
      },
      //退房确认第二栏字段
      dropHouseForm: {
        time: "",
        houseNo: "",
      },
      rengouMoney: true,
      departmentSelect: {}, //选择的部门
      departmentData: [], //获取部门的数据
      dealSelect: {}, //选择的项目驻场
      getEmployeeListData: [], //项目驻场的数据
      dealTime: [], //时间
      // table表格中的数据
      tableData: [],
      getRowKeys(row) {
        return row.id;
      },
      expands: [],
      //单击表格行 展开行内数据
      rowExpand: {},
      customerProgressBar: [],
      //退筹证据 模态框
      dropPrepareVisible: false,
      dropPrepareImg: "",
      // 退筹确认 模态框
      dropConfirmVisible: false,
      dropHouseInfo: "", //所属阶段
      dropHouseText: "", //单据文本
      dropHouseData: "",
      showExpandSeven: false, //退房确认按钮
      count: 0,    //  分页器数据的总条数
      pageNum: 1,   //分页器当前页
      pageSize: 5,   //分页器每页的大小
      // dialogfootShowHide: false,
      dealCert: [], //认筹单据
      unsubCert: [], //退房证据
      bigCert: [] //退筹证据大图
    };
  },
  created(){
    axios.get('/api/deal/unsubscribe/list/can').then(res => {
      if(res.status === 200){
        this.getData()
        this.getDepartList()
      }
    }).catch(err => {
      if(err.response.status === 403){
      this.$router.push({name: "403errorPage"})
       return
      }
    })
  },
  methods: {
    /**
     * 获取列表数据
     */
    getData:function () {
      let state = this.dropPrepareForm.auditStatus
      let param = {
        type:1,
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        depId:this.departmentSelect.id,
        seId:this.dealSelect.id,
        keyword:this.dropPrepareForm.keyWord,
        state:state,
        startTime:this.dealTimeStart,
        endTime:this.dealTimeEnd
      }
      this.$ajax.get('/api/deal/unsubscribe/list',param).then(res=>{
        res = res.data
        if(res.status === 200){
          this.count = res.data.total
          this.tableData = res.data.list
        }else if(res.status === 403){
          this.$router.push({name: "403errorPage"})
          return
        }
        this.tableData.forEach(value => {
          value.cancel_time = value.cancel_time.slice(0,value.cancel_time.indexOf(' '))
          value.amount = value.amount + '元'
        })
      })
    },
    /**
     * 单击行获取列表详情
     */
    getDetail:function (param) {
      this.$ajax.get('/api/deal/unsubscribe/info',param).then(res=>{
        res = res.data
        if (res.status === 200) {
          this.rowExpand = res.data.info;
          this.customerProgressBar = res.data.customerProgressBar;
          this.dealCert = this.rowExpand.dealCert.split(",");
          this.unsubCert = this.rowExpand.unsubCert.split(",");
          this.bigCert = this.rowExpand.bigCert.split(",");
        } else {
          this.dealCert = [];
          this.unsubCert = [];
          this.bigCert = [];
        }
        //截取图片url
        let newdealCert = []
        this.dealCert.forEach(val => {
          if(val.indexOf('?') < 0){
            newdealCert.push(val)
          }else{
            newdealCert.push(val.substr(0,val.indexOf('?')))
          }
          this.dealCert = newdealCert
        })
        //设置列表详情进度条的宽度
        this.$nextTick(() => {
          if(this.customerProgressBar.length < 7) {
            let len
            if(document.getElementsByClassName('clearfix')[1]){
              len = document.getElementsByClassName('clearfix')[1].children
            }
            for(var i = 0; i < len.length; i++){
              var li = len[i]
              li.style.width = 16.6 + '%'
            }
          }
        })
        //退筹单据图片的数量
        // var len = this.dealCert.length
        // for(var i = 0; i < len; i++) {
        //   this.imgIsTrue[i] = false
        // }
      })
    },
    //退房确认同意
    dropConfirm(type) {
      let param = {
        id: this.expands[0],
        state: type
      };
      this.$ajax.put("/api/deal/unsubscribe/check", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          if (type === 1) {
            this.alertMessage("warning", "退房失败");            
          } else {
            this.alertMessage("success", "退房成功");            
          }
          this.dropConfirmVisible = false;
          this.expands = []
          this.getData();
          this.showExpandSeven = false
        }else{
          this.alertMessage("success", res.message);            
        }
      });
    },
    //关闭模态窗
    handleClose: function(done) {
      this.expands = []
      done()
    },
    //查看退筹证据大图
    ViewBigPhoto(index,item) {
      this.dropPrepareImg = ""
      if(this.unsubCert.indexOf(item) != -1){
        var newItem = item.split('?')[0]
        this.dropPrepareVisible = true;
        this.dropHouseData = "退房证据"
        this.dropPrepareImg = newItem;
      }
      if(this.dealCert.indexOf(item) != -1){
        var newItem = item.split('?')[0]
        this.dropPrepareVisible = true;
        this.dropHouseData = this.dropHouseText
        this.dropPrepareImg = newItem;
      }
    },
    // 获取部门
    getDepartList() {
      axios.get("/api/department/list/can").then(res => {
        if(res.status===200){
          getDepartList().then(res => {
            this.departmentData = JSON.parse("[" + JSON.stringify(res.data) + "]");
          });
        }
      }).catch(err => {
        if(err.response.status === 403){
          this.alertMessage("warning", "无获取部门权限")
          return
        }
      })
    },
    // 点击转移部门节点时
    clickNode(data, value) {
      this.departmentSelect.id = data.id;
      this.dropPrepareForm.department = data.name;
      this.getEmployeeListData.length = 0
      this.getEmployeeList()
    },
    //获取项目驻场列表
    getEmployeeList:function() {
      let param = {
        depId:this.departmentSelect.id,
        pageNum:1,
        pageSize:100,
        status:1
      }
      getEmployeeList({ params: param }).then(res => {
        res.data.list.forEach((value, id) => {
          this.getEmployeeListData.push({
            value: value.name + " (" + value.depName + ")",
            id: value.id,
            names: value.name,
            department: value.depName
          });
        });
      });
    },
    // 项目驻场的模糊搜索
    querySearch(queryString, cb) {
      if (queryString) {
        this.getEmployeeListData = this.getEmployeeListData.filter(
          this.createFilter(queryString)
        );
      } else {
        this.getEmployeeListData.length = 0
        this.getEmployeeList()
      }
      cb(this.getEmployeeListData);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1
        );
      };
    },
    //选中项目驻场
    handleSelect(item) {
      this.dealSelect.id = item.id;
      this.dropPrepareForm.person = item.value;
    },
    // 表单 搜索
    onSearch() {
      if (this.dealTime.length) {
        this.dealTimeStart = this.dealTime[0];
        this.dealTimeEnd = this.dealTime[1];
      } else {
        this.dealTimeStart = "";
        this.dealTimeEnd = "";
      }
      this.getData()
    },
    // 重置
    onReset() {
      this.dropPrepareForm.department = "";
      this.dropPrepareForm.person = "";
      this.dropPrepareForm.auditStatus = "";
      this.dealTime = "";
      this.dealTimeStart = "";
      this.dealTimeEnd = "";
      this.dropPrepareForm.keyWord = "";
      this.departmentSelect.id = "";
      this.dealSelect.id = ""; //清空项目驻场id
      this.pageNum = 1;
      this.pageSize = 5;
      this.getData()
    },
    // 导出
    onExport() {},
    // 单击每行事件
    rowClick(row, event, column) {
      //点击行 展开
      let index = this.expands.indexOf(row.id);
      if (index > -1) {
        this.expands = this.expands.splice(index, -1);
      } else {
        this.expands = [];
        this.expands.push(row.id);
      }
      //判断所属阶段更改文本信息
      if(row.befor_state === "草签"){
        this.dropHouseInfo = "草签资料"
        this.dropHouseText = "草签单据"
        this.dropHouseForm.time = "草签时间"
        this.rengouMoney = false
        this.dropHouseForm.houseNo = "房屋房号"
      }else if(row.befor_state === "认购"){
        this.dropHouseInfo = "认购资料"
        this.dropHouseText = "认购单据"
        this.dropHouseForm.time = "认购时间"
        this.rengouMoney = true
        this.dropHouseForm.houseNo = "认购房号"
      }else if(row.befor_state === "网签"){
        this.dropHouseInfo = "网签资料"
        this.dropHouseText = "网签单据"
        this.dropHouseForm.time = "网签时间"
        this.rengouMoney = false
        this.dropHouseForm.houseNo = "房屋房号"
      }
      //判断审核状态更改文本信息
      if (row.state === "审核中") {
        this.showExpandSeven = true
      }else {
        this.showExpandSeven = false
      }
      this.rowExpand = {}
      this.customerProgressBar = []
      let id = row.id
      this.getDetail({id:id})
    },
    //控制只显示当前一行
    showDetail(rowdata, expandedRows) {
      if (expandedRows.length) {
        this.expands = [];
        if (rowdata) {
          this.expands.push(rowdata.id);
        }
      } else {
        this.expands = [];
      }
    },
    dropImg() {
    },
    // 分页器点击每页显示条数变化时
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    // 分页器点击页面跳转时
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getData();
    },
    //认筹单据图片预览
    // imgPreview:function(index) {
    //   var isTrue = this.imgIsTrue[index]
    //   this.imgIsTrue.forEach((val,row) => {
    //     this.imgIsTrue.splice(row,1,false)
    //   })
    //   this.imgIsTrue.splice(index,1,!isTrue)
    // }
  },
  filters: {
    formatTimeFront(time){
      if(time){
        var index = time.indexOf(' ')
        return time.slice(0,index)
      }
    },
    formatTimeEnd(time){
      if(time){
        var index = time.indexOf(' ')
        return time.slice(index)
      }
    }
  }
};
</script>
<style lang='scss'>

</style>