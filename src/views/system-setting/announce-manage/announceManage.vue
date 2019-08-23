<!-- banner管理 -->
<template>
  <div class="container" id='announceCss'>
    <!-- 头部样式 -->
    <div class="header w-select">
      <el-form :inline="true" :model="keyWordData" class="demo-form-inline">
        <el-form-item label="发布时间:">
          <el-date-picker
          v-model="dataTime"
          type="daterange"
          placeholder="选择日期">
        </el-date-picker>
        </el-form-item>
        <el-form-item label="发布部门:">
          <el-select v-model="departName" placeholder="请选择" >
                <el-option :value="departDataList" :label="departName">
                    <el-tree :data="departDataList" 
                    :props="moveEmpProp"
                    node-key="DepartOnlyCode"
                    check-on-click-node
                    :expand-on-click-node=false
                    @node-click="clickNode"
                    ></el-tree>
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="关键词:">
          <el-input v-model="keyWordData.keyword" placeholder="请输入关键词(最多30个字)" maxlength=30></el-input>
        </el-form-item>
        <el-form-item>
          <button type="button"  class="searchBtn" @click="sureQueryInfo">查询</button>
        </el-form-item>
        <el-form-item>
          <button type="button" class="resetBtn" @click="resetQueryInfo">重置</button>
        </el-form-item>
        <el-form-item>
          <button type="button" class="addIpt" @click="addAnnounceList">新增</button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 中间样式 -->
    <div class="content">
      <el-table
      ref="multipleTable"
      :data="announceDataList"
      tooltip-effect="dark"
      header-align=center
      border
      @selection-change="handleSelectionChange">
      <el-table-column
        label="序号"
        width="90"
        type="index">
        <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
      </el-table-column>
      <el-table-column
        prop="title"
        label="公告标题"
        width="400">
      </el-table-column>
      <el-table-column
        prop="type"
        label="公告类型"
        width='200'
        show-overflow-tooltip>
      </el-table-column>
        <el-table-column
        prop="readDesc"
        label="公告情况"
        width='200'
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="发布时间"
        width='260'
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="create_by"
        label="发布人"
        width='258'
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width='470'>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">查看</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
     </el-table-column>
     </el-table>
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="prev, pager, next,  total, sizes, jumper"
      :total="count">
    </el-pagination>
    </div>
    <!-- 新增公告弹框 -->
    <div class="ann_addAnnounce">
      <el-dialog title="发布公告" :visible.sync="addAnnounceBox">
        <el-form :model="addAnnounceForm" :rules="rules" label-width='100px' ref="ruleForm" class="demo-ruleForm">
        <el-form-item label="公告标题:" prop="title" class="ann-title">
          <el-input v-model="addAnnounceForm.title"></el-input>
          <div class="titleMaxNum"><span>{{titleLengthChange}}</span>/30</div>
        </el-form-item>
        <el-form-item label="公告类型:" prop="type">
        <el-select v-model="addAnnounceForm.type">
          <el-option label="项目" :value="0"></el-option>
          <el-option label="系统" :value="1"></el-option>
        </el-select>
        </el-form-item>
         <el-form-item label="发布范围:">
            <el-select v-model="addAnnounceForm.readers" placeholder="请选择">
            <el-option value="">
                <el-tree :data="departDataList"
                :props="moveEmpProp"
                show-checkbox
                node-key="id"
                :expand-on-click-node=false
                @check="handleNodeClick"
                style="width: 100%"
                ></el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="发布范围:" prop="readers">
          <el-select v-model="addAnnounceForm.readers" placeholder="请选择">
                <el-option value="">
                    <el-tree :data="departDataList" 
                    :props="moveEmpProp"
                    node-key="DepartOnlyCode"
                    check-on-click-node
                    :expand-on-click-node=false
                    @node-click="areaClickNode"
                    ></el-tree>
                </el-option>
            </el-select>
        </el-form-item> -->
        <el-form-item label="公告内容:" prop="context">
        <el-input
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 8}"
          placeholder="请输入内容"
          v-model="addAnnounceForm.context">
        </el-input>
        <div class="contentMaxNum"><span>{{annContentNum}}</span>/1000</div>
        </el-form-item>
      </el-form>
      <div class="move_footer">
        <el-button  @click="sureAddAnnounce('ruleForm')" class="sureAdd">确 定</el-button>
        <el-button @click="addAnnounceBox = false" class="noAdd">取 消</el-button>
      </div>
      </el-dialog>
    </div>
    <!-- 删除公告弹框 -->
    <div class="ann_delAnnounce">
       <el-dialog title="提示" :visible.sync="delAnnounceBox">
        <span class="el-icon-info del-icon"></span>&nbsp;&nbsp;<span style="color: #333;">你确定要删除此公告吗？</span>
      <div class="move_footer">
        <el-button  @click="sureDeleteAnnounce" class="sureAdd">确 定</el-button>
        <el-button @click="delAnnounceBox = false" class="noAdd">取 消</el-button>
      </div>
      </el-dialog>
    </div>
</div>
</template>
<script>
import {getAnnounceList, getDepartList, deleteAnnounce,addAnnounceInfo,getNoReadNum} from '@/api'
import axios from "axios"
function getCascaderObj(val,opt) {
            return val.map(function (value, index, array) {
                for (var itm of opt) {
                    if (itm.pid == value) { opt = itm.child; return itm; }
                }
                return null;
            });
        }
export default {
  data() {
    return {
      titleCharNum: 0,  // 新增公告标题的字符数
      readNameArr:[],
      readIdStr:[],
      pageNum: 1,
      pageSize: 5,
      count: 0,
      announceId: 0,
      dataTime:'',
      keyWordData:{startTime:"",endTime:"",keyword:"",deptId:""},
      departDataList:[],
      announceDataList: [],  // 公告列表信息展示
      delAnnounceBox: false,  // 删除公告弹框显示
      addAnnounceForm: {readers:"",type:0},    // 新增公告弹框中的表单数据
      addAnnounceBox: false,   // 新增弹框显示
       moveEmpProp: {
        value: 'id',
        label: 'name',
        children: 'child'
      },
      departName: "",   //部门名称
       rules: {
        title: [{ required: true, message: "请输入正确的公告标题", trigger: "blur" },
        {max: 30, message: '最多不能超过30个字符', trigger: 'blur'}],
        context: [{ required: true, message: "请输入公告内容", trigger: "blur" },
        {max: 1000, message: '最多不能超过1000个字符', trigger: 'blur'}],
        readers: { required: true, message: "请选择发布范围", trigger: "change" },
        type: { required: true, message: "请选择公告类型", trigger: "change" }
      },
    };
  },
  created(){
    axios.get("/api/notice/list/can").then(res => {
      if(res.status === 200) {
        this.getAnnounceInfo()
         getDepartList({params: {iRoot: true}}).then(res => {
          // console.log(res);
          this.departDataList =  JSON.parse("["+JSON.stringify(res.data)+"]")
           getNoReadNum().then(res => {
                    if (res.status === 200) {
                      localStorage.setItem("announceNum", res.data.count);
                      this.$store.commit("set_annNum", res.data.count);
                    }
            });
          })
          .catch(err => {
            if(err.response.status === 403){
              this.alertMessage("warning", "无获取部门权限")
              return
          }
          })
      }
    }).catch(err => {
       if(err.response.status === 403){
         this.$router.push({name: "403errorPage"})
         return
        }
    })
  },
  methods: {
    getAnnounceInfo(){
      let params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        type: 2,
        startTime: this.keyWordData.startTime,
        endTime: this.keyWordData.endTime,
        deptId: this.keyWordData.deptId,
        keyword: this.keyWordData.keyword
      }
      getAnnounceList({params: params}).then(res => {
      if(res.status === 200){
        this.count = res.data.count
      console.log(res);
      res.data.noticeList.filter(value => {
        return (value.type = value.type == 1 ? '系统公告' : '项目公告')&&(value.readDesc = value.isRead ? "已读" : "未读" )
      })
      this.announceDataList = res.data.noticeList
        console.log(res);
      }
    })
    },
    handleNodeClick(data, value) {
      // debugger
      let str = "";
      value.checkedNodes.forEach(value => {
        str += value.name + ",";
      });
      this.addAnnounceForm.readers = str;

      this.addAnnounceForm.readerIds = value.checkedKeys.join(",");
      console.log(this.addAnnounceForm);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 点击新增公告按钮
    addAnnounceList(){
      axios.post("/api/notice/can").then(res => {
        if(res.status === 200){
          this.addAnnounceBox = true
          this.addAnnounceForm={readers:""}
        }else{this.alertMessage("warning", "无操作权限")}
      }).catch(err => {
         if(err.response.status === 403){
          this.alertMessage("warning", "无新增公告权限")
          return
          }
      })
    },
    // 点击确定添加公告按钮
    sureAddAnnounce(formName){
      this.$refs[formName].validate((valid) =>{
        if(valid){
          // this.addAnnounceForm.readerIds = this.readIdStr.join(",")
          addAnnounceInfo(this.addAnnounceForm).then(res => {
            if(res.status === 200) {
              this.alertMessage("success", "添加成功")
              this.addAnnounceBox = false
               localStorage.setItem("announceNum", parseInt(localStorage.getItem("announceNum")) + 1)
                this.$store.commit("set_annNum", localStorage.getItem("announceNum"))
              this.getAnnounceInfo()
            }else {
              this.alertMessage("warning", "添加失败")
            }
          })
        }else{
          this.alertMessage("warning", "表单信息不完善")
        }
      })
    },
    // 点击删除公告按钮
    handleDelete(index, row){
      this.delAnnounceBox = true
      this.announceId = row.id  
    },
    // 点击确定删除指定公告
    sureDeleteAnnounce(){
      deleteAnnounce({params: {noticeId:this.announceId}}).then(res => {
        if(res.status === 200) {
          this.alertMessage("success", "删除成功")
          this.delAnnounceBox = false
          this.getAnnounceInfo()
        }else {
          this.alertMessage("warning", res.message)
        }
        console.log(res);
      })
    },
    // 点击查看公告按钮
    handleEdit(index, row){
      axios.get("/api/notice/can").then(res => {
        if(res.status === 200){
          console.log(row);
          if(!row.isRead){
            localStorage.setItem("announceNum", localStorage.getItem("announceNum") - 1)
            this.$store.commit("set_annNum", localStorage.getItem("announceNum"))
          }
          this.$router.push({name: 'showAnnounce', query: {noticeId: row.id}})
        }else{this.alertMessage("warning", "无操作权限")}
      }).catch(err => {
         if(err.response.status === 403){
          this.alertMessage("warning", "无查看公告权限")
          return
          }
      })
    },
    handleSizeChange(){},
    handleCurrentChange(){},
     // 点击根据关键词查询信息
    sureQueryInfo(){
      this.keyWordData.startTime = this.dataTime ? this.timeFormats(this.dataTime[0]) : ""
      this.keyWordData.endTime = this.dataTime ? this.timeFormats(this.dataTime[1]) : ""
      this.keyWordData.type = 2
      let params = this.keyWordData
      this.getAnnounceInfo()
    //   console.log(params);
    //   getAnnounceList({params:params}).then(res => {
    //   console.log(res)
    //   this.count = res.data.count
    //   res.data.noticeList.filter(value => {
    //     return (value.type = value.type == 1 ? '系统公告' : '项目公告')&&(value.readDesc = value.isRead ? "已读" : "未读" )
    //   })
    //   this.announceDataList = res.data.noticeList
    // })
    },
    resetQueryInfo(){
      // this.keyWordData = {pageNum: 1, pageSize: 5}
      this.pageNum = 1
      this.keyWordData={
        startTime:"",endTime:"",keyword:"",deptId:""
      }
      this.dataTime = ""
      this.departName = ""
      this.getAnnounceInfo()
    },
    handleSizeChange(val){
      this.pageSize = val
     this.getAnnounceInfo()
    },
    handleCurrentChange(val){
      this.pageNum = val
      this.getAnnounceInfo()
    },
    // 点击发布部门中的数据时
     clickNode(data, value, ss){
      console.log(data);
      // console.log(value);
      // console.log(ss);
      this.keyWordData.deptId = data.id
      this.departName = data.name
    },
  },
  computed:{
    titleLengthChange(){
      // debugger  
      return this.addAnnounceForm.title ? this.addAnnounceForm.title.length : 0
    },
    annContentNum(){
      return this.addAnnounceForm.context ? this.addAnnounceForm.context.length : 0
    }
  }
}
</script>
<style lang='scss'>
#announceCss {
  // 头部样式
  .header {
    height: auto;
    background-color: #d7d7df;
    // 头部表单样式
    .el-form {
      .el-cascader{
        line-height: 0;
      }
       .el-select{
       .el-input__inner{
            width: 166px;
          }
       }
      .el-input__prefix{
        left: 128px;
      }
      .searchBtn,
      .addIpt,
      .resetBtn {
        background-color: #fd8f00;
        border-radius: 3px;
        width: 66px;
        border: none;
        margin-left: 19px;
        height: 30px;
        color: #fff;
        cursor: pointer;
      }
      .resetBtn {
        background-color: #a0a0a0;
      }
      .addIpt {
        background-color: #72a0d1;
      }
    }
    
  }
  // 中间table样式
  .el-table__body{
    button{
        width: 51px;
        height: 26px;
        background-color: #31313c;
        border-radius: 3px;
        border: none;
        color: #fff;
        cursor: pointer;
    }
  }
  .ann_addAnnounce{
    .el-input{
          .el-input__inner{
              padding-right: 45px !important;
        }
    }
      .el-dialog {
      width: 514px;
      height: 398px;
      .titleMaxNum,{
        position: absolute;
        right: 5px;
        top: 0;
      }
      .contentMaxNum{
       position: absolute;
        right: 5px;
        bottom: -30px;
      }
      .el-form-item__error{
        padding-top: 0;
        margin-top: -3px;
        display: block;
      }
      .el-form-item{
        margin-bottom: 10px;
        
        .el-select{
          .el-input--suffix{
            width: 374px!important;
          }
        } 
        .el-textarea{
          height: 90px;
            .el-textarea__inner{
              height: 90px !important;
            }
        }
      }
      .move_footer{
        margin-top: 20px;
      }
    }
  }
  .ann_delAnnounce{
    .el-dialog {
        width: 400px;
        height: 230px;
      .el-dialog__body{
        text-align: center;
        .del-icon{
         font-size: 20px;
         color: #5a9ef2;
        }
      }
    }
  }
  /deep/ .el-dialog__body {
      .el-checkbox__label,
      .el-form-item__label {
          color: #666;
          font-weight: 400!important;
      }
  }
}
</style>