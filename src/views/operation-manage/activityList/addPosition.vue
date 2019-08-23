<!-- 新增固定吉家活动弹框 -->
<template>
  <div>
    <el-dialog title="选择项目" append-to-body 
    :show-close="false" :close-on-press-escape="false"
    :close-on-click-modal="false" :visible.sync="selectProjectBox" class="select-project" width="770px">
    <span class="el-icon-close" @click="clickClose"></span>
        <select-project v-if="selectProjectBox1"
         @selectedProject="selectedProject" 
         @closeSelectBox="clickClose" 
         :companyId="companyId"
         :writeDownData="writeDownData"
         :editActivityData="editActivityData"></select-project>
    </el-dialog>
     <el-form :inline="true" :rules="addRules" ref="addForm" :model="keyWordData" class="demo-form-inline" min-width="1398px">
      <el-form-item label="公 司:" prop="companyId">
        <el-select
          v-model="keyWordData.companyId"
           placeholder="请选择公司"
           :disabled="isControlCompany.companyId > 0 || isSelectCompany"
        >
          <el-option
            v-for="item in companyData"
            :value="item.d_id"
            :label="item.name"
            :key="item.d_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动名称:" prop="activityName">
        <el-input v-model="keyWordData.activityName" placeholder="请输入活动名称" maxlength="8"></el-input>
      </el-form-item>
      <el-form-item label="时间设置:">
      <el-radio v-model="setActivityTime" label="2">不设置倒计时</el-radio>
      <el-radio v-model="setActivityTime" label="1">设置倒计时</el-radio>
      </el-form-item>
      <el-form-item label="活动时间:" prop="activityTime" v-if="isShowTime">
        <el-date-picker
        v-model="keyWordData.activityTime"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        :clearable=false
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      </el-form-item>
      <el-form-item label="位 置:" prop="position">
        <el-select
          v-model="keyWordData.position"
          placeholder="请选择"
        >
          <el-option :value=0 label="吉家新房详情广告位"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="项目范围:" class="position-project" prop="idStr">
                <el-input readonly="readonly" v-model="keyWordData.idStr"></el-input> <el-button @click="clickSelectProject">选择项目</el-button>
        </el-form-item>
      <el-form-item label="备 注:">
        <el-input
          type="textarea"
          :rows="4"
          v-model="keyWordData.remarks"
          placeholder="请输入活动备注"
          maxlength="30"
          show-word-limit
          >
        </el-input>
        </el-form-item>
    </el-form>
    <div class="move_footer">
      <el-button class="sureAdd" @click="sureAdd('addForm')" type="primary" round>确 定</el-button>
      <el-button class="noAdd" @click="noAdd">取 消</el-button>
    </div>
  </div>
</template>

<script>
import selectProject from './selectProject/selectProject.vue'
export default {
  components:{selectProject},
  data () {
    return {
      addRules:{
        companyId:[{ required: true, message: "请选择公司", trigger: "change" }],
        activityName:[{ required: true, message: "请输入活动名称", trigger: "blur" }],
        activityTime:[{ required: true, message: "请选择活动时间", trigger: "change" }],
        position:[{ required: true, message: "请选择活动位置", trigger: "change" }],
        idStr:[{ required: true, message: "请选择项目", trigger: "blur" }],
        // remarks:[{ required: true, message: "请输入活动备注", trigger: "blur" }],
      },
      keyWordData:{},     //form数据对象
      activityTime:[],      // 活动时间数组
      isControlCompany:{},
      setActivityTime:"2",      // 是否设置倒计时
      isSelectCompany:false,    //是否禁止选择公司
      selectProjectBox:false,    // 选择项目弹框
      selectProjectBox1:true,
      companyId:"",             // 传给项目选择的公司id
      editActivityData:{},            // 编辑活动的时候传给选择项目的活动的数据
      writeDownData:{},             // 
    };
  },
props:["companyData","editData"],
created () {
  // console.log(this.editData);
  if(this.editData && this.editData.checkId == 1){
    this.isSelectCompany = true
    // debugger
    if(!this.editData.effectiveStartTime || !this.editData.effectiveEndTime){
      this.setActivityTime = '2'
    }else{
      this.setActivityTime = '1'
      this.$set(this.keyWordData,"activityTime",[this.editData.effectiveStartTime,this.editData.effectiveEndTime])
    }
    this.$set(this.keyWordData,"companyId",this.editData.companyId)
    this.$set(this.keyWordData,"position",this.editData.positionId)
    this.$set(this.keyWordData,"remarks",this.editData.remarks)
    this.$set(this.keyWordData,"activityName",this.editData.activityName)
    this.$set(this.keyWordData,"effectiveStartTime",this.editData.effectiveStartTime)
    this.$set(this.keyWordData,"effectiveEndTime",this.editData.effectiveEndTime)
    this.$set(this.keyWordData,"id",this.editData.id)
    this.getProjectIds()
    // this.activityTime = [this.editData.effectiveStartTime,this.editData.effectiveEndTime]
  }else{
    this.defaultForm()
  }
},
  methods: {
    defaultForm(){
      let infoObj = JSON.parse(localStorage.getItem("myInfo"));
      this.isControlCompany = infoObj.dep;
      this.keyWordData = {
        companyId:infoObj.dep.companyId < 0 ? "" : infoObj.dep.companyId,
        activityName:"",
        activityTime:[],
        position:0,
        remarks:"",
        effectiveStartTime:"",
        effectiveEndTime:"",
        idStr:"",
      }
    },
    sureAdd(form){
      this.$refs[form].validate((valid, obj) => {
        if(valid){
            let qs = require('qs')
            if(this.setActivityTime == '2'){
              this.keyWordData.effectiveStartTime = ""
              this.keyWordData.effectiveEndTime = ""
              this.keyWordData.activityTime=[]
            }else{
              this.keyWordData.effectiveStartTime = this.keyWordData.activityTime[0]
              this.keyWordData.effectiveEndTime = this.keyWordData.activityTime[1]
              this.keyWordData.activityTime=[]
            }
            if(this.editData.checkId == 1){
                this.$axios.put("/api/updateFixedActivities",qs.stringify(this.keyWordData)).then(res => {
                res = res.data
                // debugger
                if(res.status === 200){
                  this.alertMessage("success", "编辑成功", 1500)
                  this.defaultForm()
                  this.$emit("closeAddDialog",1)
                }else{
                  this.alertMessage("warning", res.message, 1500)
                  return
                }
              })
            }else{
              this.$axios.post("/api/addFixedActivities",qs.stringify(this.keyWordData)).then(res => {
                res = res.data
                // debugger
                if(res.status === 200){
                  this.alertMessage("success", "新增成功", 1500)
                  this.defaultForm()
                  this.$emit("closeAddDialog",1)
                }else{
                  this.alertMessage("warning", res.message, 1500)
                  return
                }
              })
            }
        }else{
           let toastMsg = this.addRules[Object.keys(obj)[0]][0].message;
          this.alertMessage("info", toastMsg, 2000);
          return;
        }
      })
    },
    noAdd(){
      this.defaultForm()
      this.$emit("closeAddDialog")
    },
    // 点击选择项目
    clickSelectProject(){
      if(this.editData.checkId != 1 && !this.keyWordData.companyId){
        this.alertMessage("info","请先选择公司",1500)
        return
        }
      if(this.editData.checkId == 1){
        this.editActivityData.activityId = this.editData.id
          // this.activityId = this.editData.id
        }
        // debugger
        this.selectProjectBox = true
       this.selectProjectBox1 ? "" : this.selectProjectBox1 = true
        this.companyId = this.keyWordData.companyId
    },
    // 确认选择项目
    selectedProject(data){
      // debugger
      // console.log(data);
      this.$set(this.keyWordData,'idStr',data.str)
      this.$set(this.keyWordData,'ids',data.idStr)
      this.selectProjectBox = false
      // this.selectProjectBox1 = true
      this.writeDownData = data
    },
    // 关闭选择项目框
    clickClose(){
      this.selectProjectBox = false
      this.selectProjectBox1 = false
    },
    // 编辑活动的时候请求项目接口
    getProjectIds(){
      this.$axios.get("/api/itemsSelectedForFixedActivities",{params:{id:this.editData.id}}).then(res => {
        res = res.data
        // debugger
        if(res.status === 200){
          this.$set(this.keyWordData,"idStr",res.data[0].idStr)
          this.$set(this.keyWordData,"ids",res.data[0].id)
          this.editActivityData = res.data[0]
        }
      })
    }
  },
  computed: {
    isShowTime(){
      if(this.setActivityTime == '1'){
        return true
      }else{
        return false
      }
    }
  },
}

</script>
<style lang='scss' scoped>
.select-project{
  /deep/ .el-dialog{
    height: 612px;
    .el-icon-close{
      position: absolute;
      right: 8px;
      top: 7px;
      font-size: 20px;
      color: #949494;
      cursor: pointer;
    }
    .el-dialog__body{
      padding: 0;
    }
  }
}
/deep/ .position-project{
  // width: 280px;
      .el-form-item__content{
        width: 265px !important;
        .el-input{
          width: 170px;
          .el-input__inner{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .el-button {
          height: 30px;
          padding: 7px 16px;
        }
      }
    }
/deep/ .el-form{
  position: relative;
  label{
    display: inline-block;
    width: 82px;
    text-align: justify;
    text-justify: inter-ideograph;
    text-align-last: justify;
    font-weight: normal;
    color: #666;
  }
  .el-form-item{
    &:nth-last-child(1){
      display: block;
    }
    
  }
  .el-form-item__content{
    width: 264px;
    .el-select{
      width: 100%;
    }
    .el-textarea{
      width: 630px;
    }
    .el-input__inner{
      width: 100%;
    }
  }
}
/deep/ .el-date-editor {
.el-range-separator,.el-range__icon{
  line-height: 23px;
}
  .el-range-input{
    width: 108px;
  }
  .el-input__icon{
    &:nth-of-type(2){
    display: none;
    }
  }
}
</style>