<!-- 报表条件搜索组件 -->
<template>
  <div class="w-select">
    <el-form :inline="true" :model="keyWordData" class="demo-form-inline" min-width="1398px">
        <div v-if="itemObj">
            <el-form-item  v-if="itemObj.name == 'U+'" :label="itemObj.name+':'">
                <el-select v-model="adminIptValue" placeholder="请选择">
                <el-option value="">
                    <el-tree :data="uPlusData"
                    :props="uPlusProp"
                    show-checkbox
                    node-key="DepartOnlyCode"
                    :expand-on-click-node=false
                    @check="handleNodeClick"
                    ref="tree"
                    class="uPlusCss"
                    style="width: 100%"
                    ></el-tree>
                </el-option>
            </el-select>
            </el-form-item>
            <el-form-item v-if="itemObj.name == '部门'" :label="itemObj.name+':'">
                <el-select v-model="adminIptValue" placeholder="请选择">
                    <el-option value="">
                        <el-tree 
                        :data="departData"
                        :props="departProp" 
                        node-key="DepartOnlyCode"
                        check-on-click-node
                        :expand-on-click-node=false
                        @node-click="clickNode"
                        ></el-tree>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="维护:">
                <el-select v-model="keyWordData.protectId" class="selectIpt">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item,index) in protectData" :label="item.name" :key="index" :value=item.value></el-option>
                </el-select>
            </el-form-item>
        </div>
        <div v-else>
            <div v-if="otherItem.name == '项目报表'" class="query_projectManage">
                <el-form-item label="省:">
                    <el-select v-model="keyWordData.provinceId" placeholder="请选择" size="mini" @change="provinceChange" :disabled="isShowCompanyId<0 ? false : true">
                        <el-option label="全部" :value="0"></el-option>
                        <el-option v-for="(value,index) in keyWordProvince" :key="index" :label="value.province_name" :value="value.province"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="市:">
                    <el-select v-model="keyWordData.cityId" placeholder="请选择" size="mini" @change="cityChange" :disabled="isShowCompanyId<0 ? false : true">
                        <el-option label="全部" :value="0"></el-option>
                        <el-option v-for="(value,index) in keyWordCity" :key="index" :label="value.area_name" :value="value.area"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="公司:">
                    <el-select v-model="keyWordData.companyId" placeholder="请选择" size="mini" :disabled="isShowCompanyId<0 ? false : true">
                        <el-option label="全部" :value=-200></el-option>
                        <!-- <el-option label="中房科瑞" :value=-1></el-option> -->
                        <el-option v-for="value in keyWordCompany" :key="value.company_id" :label="value.company_name" :value="value.company_id"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="归属:">
                    <el-select v-model="keyWordData.projectAgent" placeholder="请选择" size="mini">
                        <el-option label="全部" :value=0></el-option>
                        <el-option label="公司总包" value="1"></el-option>
                        <el-option label="合作分销" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <el-form-item label='部门:' v-if="otherItem.name == '部门报表'">
                <el-select v-model="adminIptValue" placeholder="请选择">
                    <el-option value="">
                        <el-tree 
                        :data="departData"
                        :props="departProp" 
                        node-key="DepartOnlyCode"
                        check-on-click-node
                        :expand-on-click-node=false
                        @node-click="clickNode"
                        ></el-tree>
                    </el-option>
                     <el-option value="" v-if="otherItem.isUplus && (myInfoObj.type == 3 || myInfoObj.type == 0)">
                        <el-tree
                        class="depUplus" 
                        :data="uPlusData"
                        check-on-click-node
                        :props="uPlusProp"
                        node-key="DepartOnlyCode"
                        :expand-on-click-node=false
                        @node-click="clickNode2"
                        ></el-tree>
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <el-form-item label="时间范围:">
            <el-date-picker
            v-model="createBannerTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="关键词:">
            <el-input v-model="keyWordData.keyword" placeholder="请输入关键词(最多30个字)" maxlength=30></el-input>
        </el-form-item>
        <el-form-item>
                <el-button type="warning" @click="querySelect" class="search-but">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="resetQuery" class="chongzhi-but">重置</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="outputExcel" class="but-lightblue"><span class="icon icon-daochu org-icon"></span>导出</el-button>
            </el-form-item>
             <el-form-item v-if="otherItem && otherItem.isShow">
                <el-button type="primary" @click="getSimpleData" v-if="showSimple" class="but-lightblue"><span class="icon icon-moban org-icon"></span>简报</el-button>
                <el-button type="primary" @click="getFullData" v-if="!showSimple" class="but-lightblue"><span class="icon icon-moban org-icon"></span>明细</el-button>
            </el-form-item>
        </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
        showSimple:true,            // 简报按钮的显示
        keyWordData:{},             // 关键词对象
        adminIptValue:"",           // 组织架构选择之后显示的值
        createBannerTime:[],        // 时间段
        protectData:[],             // 维护数据
        departProp: {                  // 部门结构配置
        value: "id",
        label: "name",
        children: "child"
      },
      uPlusProp:{
        label: "DeptName",
        value: "DepartOnlyCode",
        children: "SubDepart",
      },
      isShowCompanyId:"",
      filterText:"",
      myInfoObj:{}
    };
  },
    props:["itemObj","uPlusData","departData","keyWordCompany","otherItem","clickRowObj","keyWordProvince","keyWordCity"],
    mounted(){
       this.defalutKeywordData()
    },
    created(){
        let infoObj = JSON.parse(localStorage.getItem("myInfo"))
        this.myInfoObj = infoObj.dep
        this.isShowCompanyId = infoObj.dep.companyId
        if(this.itemObj){
            this.defaultProtectData()
            this.itemObj.name == '部门' ? this.adminIptValue=JSON.parse(localStorage.getItem("myInfo")).depName:''
        }
        if(this.otherItem && this.otherItem.name == '部门报表'){
            this.adminIptValue=JSON.parse(localStorage.getItem("myInfo")).depName
        }
    },
    methods: {
    // 初始化添加对象
      defalutKeywordData(){
          let obj = {
              uPlusId:"",
              depId: JSON.parse(localStorage.getItem("myInfo")).depId,
              startTime:"",
              endTime:"",
              keyword:"",
              protectId:"",
              isUplusDep:"",
              projectAgent:0,
              provinceId:0,
              cityId:0,
              companyId:-200
          }
          this.keyWordData = Object.assign({}, this.keyWordData, obj)
          if(this.myInfoObj.companyId > 0){
            this.$set(this.keyWordData, "provinceId",this.myInfoObj.province)
            this.$set(this.keyWordData, "cityId",this.myInfoObj.area)
            this.$set(this.keyWordData, "companyId",this.isShowCompanyId)
        }
      },
      defaultProtectData(){
          let dataArr = [
              {
                  name:"有效报备",
                  value:'2'
              },
              {
                  name:"报备待审核",
                  value:'0'
              },
              {
                  name:"无效报备",
                  value:'1'
              },
              {
                  name:"过期报备",
                  value:'3'
              },
              {
                  name:"有效带看",
                  value:'12'
              },
              {
                  name:"带看待审核",
                  value:'10'
              },
              {
                  name:"无效带看",
                  value:'11'
              },
              {
                  name:"过期带看",
                  value:'13'
              },
          ]
          this.protectData = dataArr
      },
    //   选择u+数据时
      handleNodeClick(data, value){
        let str = "";
        value.checkedNodes.forEach(value => {
            str += value.DeptName + ",";
        });
        this.adminIptValue = str;
        this.keyWordData.uPlusId = value.checkedKeys.join(",");
      },
    //   点击部门节点时
      clickNode(data, value){
        if(this.otherItem && this.otherItem.isUplus){
            this.keyWordData.isUplusDep=0
        }
        this.keyWordData.depId = data.id;
        this.adminIptValue = data.name;
      },
      clickNode2(data, value){
          if(data.DepartOnlyCode){
              this.keyWordData.isUplusDep=1
              this.keyWordData.depId = data.DepartOnlyCode;
              this.adminIptValue = data.DeptName;
          }
      },
    //   处理时间段方法
    getQueryTime(arr){
        this.keyWordData.endTime = arr[1] + " 23:59:59"
        this.keyWordData.startTime = arr[0] + " 00:00:00"
    },
    //   点击查询的时候
      querySelect(){
          this.timeFormat()
          if(this.itemObj){
              this.itemObj.name == "部门" ? 
              this.$emit("querySelectP",this.keyWordData) : (this.itemObj.name == "U+" ?
              this.$emit("querySelectU",this.keyWordData) : "")
          }else{
            this.$store.commit("sortChange","aaa")
            this.$emit("querySelectP",this.keyWordData)
          }
      },
    //   点击重置按钮
      resetQuery(){
          this.defalutKeywordData()
          this.createBannerTime=[]
          if(this.itemObj){
              this.adminIptValue = this.itemObj.name == '部门' ? JSON.parse(localStorage.getItem("myInfo")).depName:''
              if(this.itemObj.name == "部门"){
                  this.$emit("resetQueryP",this.keyWordData)
              }else if(this.itemObj.name == "U+"){
                  this.$refs.tree.setCheckedKeys([]);
                  this.$emit("resetQueryU",this.keyWordData)
              }
          }else{
              this.adminIptValue = JSON.parse(localStorage.getItem("myInfo")).depName
              this.$emit("resetQueryP",this.keyWordData)
              this.$store.commit("sortChange","aaa")
          }
      },
      timeFormat(){
            if(this.createBannerTime && this.createBannerTime.length != 0){
            this.getQueryTime(this.createBannerTime)
          }else{
              this.$set(this.keyWordData,"endTime","")
              this.$set(this.keyWordData,"startTime","")
            }
      },
    //   点击导出按钮
      outputExcel(){
        let date = new Date();
        let token = ""
        date.setTime(date.getTime()-10000);
        document.cookie="xf-timespan=; expire="+date.toGMTString();
        this.timeFormat()
        token = localStorage.getItem("token")
        document.cookie="xf-token="+token+""
        if(this.itemObj){
            // debugger
            this.itemObj.name == "部门" ?
            this.$emit("outputExcelP",this.keyWordData) : (this.itemObj.name == "U+" ?
            this.$emit("outputExcelU",this.keyWordData) : "")
        }else{
            this.$emit("outputExcel",this.keyWordData)
        }
      },
    //   当省份发生改变的时候
      provinceChange(val){
          this.$set(this.keyWordData,"cityId",0)
          this.$set(this.keyWordData,"companyId",-200)
          this.$emit("provinceChange",val)
      },
    //   当市发生改变时
      cityChange(val){
          this.$set(this.keyWordData,"companyId",-200)
          this.$emit("cityChange",[val,this.keyWordData.provinceId])
      },
    //   点击获取简报
      getSimpleData(){
          this.showSimple = false
          this.$emit("changeTable",1)
        //   this.$emit("tableData")
      },
    //   点击获取明细
    getFullData(){
        this.showSimple = true
        this.$emit("changeTable",2)
    }
  },
  watch: {
      clickRowObj(val){
          if(val){
              this.keyWordData.keyword = ""
              this.keyWordData.depId = val.id
              this.adminIptValue=val.name
          }
      }
  },
}
</script>
<style lang='scss' scoped>
/deep/ .el-select{
    .el-input .el-input__inner{
        width: 150px;
        font-weight: 700;
    }
}
/deep/ .uPlusCss {
    .el-tree-node__expand-icon{
        display: none;
    }
}
/deep/ .el-tree-node__expand-icon{
    color: #000;
}
/deep/ .el-tree-node__expand-icon.is-leaf{
color: transparent!important;
}
/deep/ .depUplus > .el-tree-node > .el-tree-node__content{
    &:hover{
        cursor: not-allowed;
    }
}
/deep/ .depUplus > .el-tree-node > .el-tree-node__children > .el-tree-node > .el-tree-node__content{
    &:hover{
        cursor: not-allowed;
    }
}
.query_projectManage{
    .el-form-item{
        &:nth-of-type(1),&:nth-of-type(2),&:nth-of-type(4){
            /deep/ .el-input__inner{
                width: 120px;
            }
        }
        &:nth-of-type(3){
            /deep/ .el-input__inner{
                width: 200px;
            }
        }
    }
}
</style>