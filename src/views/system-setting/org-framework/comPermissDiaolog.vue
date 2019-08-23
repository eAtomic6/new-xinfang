<!-- 高级公司管理页面 -->
<template>
  <div class="companyPermiss">
      <div class="companyPermiss_top">
          <label>项目是否同步u+:</label>
                <el-radio-group v-model="isAnnouncePlus">
                <el-radio :label='1'>是</el-radio>
                <el-radio :label='0'>否</el-radio>
            </el-radio-group>
      </div>
      <div class="companyPermiss_body">
          <label>合 作 公 司:</label>
           <el-tooltip class="item" effect="Light" 
           :visible-arrow=false
           placement="bottom">
           <div slot="content" class="tooltipContent" style="width:200px;">{{tooltipContent}}</div>
                <el-select v-model="operateCompany" placeholder="点击选择">
                        <el-option value="">
                            <el-tree :data="companyData" 
                            :props="employeeProps"
                            show-checkbox
                            node-key="id"
                            :default-checked-keys="defaultOperateCmy"
                            :expand-on-click-node=false
                            @check="handleNodeClickRole"
                            ></el-tree>
                        </el-option>
                </el-select>
            </el-tooltip>
      </div>
      <div class="move_footer">
        <el-button  @click.native="surePermiss" class="sureAdd">确 定</el-button>
        <el-button @click="noPermiss" class="noAdd">取 消</el-button>
      </div>
  </div>
</template>

<script>
import {getAllCompantInfo,setCompanyPermiss,getDefaultForm} from '@/api/index'
export default {
  data () {
    return {
        operateCompany:"",  // 选择合作公司时出现的公司名
         employeeProps:{   // 点击出现合作公司的配置
            label: "name",
            children: 'children'
        },
        companyData:[],  //所有合作公司数据
        isAnnouncePlus:"",  // 是否同步u+
        companyIdArr:[],   //选择之后的公司id
        tooltipContent:"", // 鼠标移入显示当前选中的公司
        defaultOperateCmy:[],  // 默认合作公司
        delCompanyIndex: "", //删除公司的索引

    };
  },
  props:['companyId'],
created(){
    console.log(this.companyId);
    getDefaultForm({params:{id: this.companyId.id}}).then(res => {
        // debugger
        console.log(res);
       this.isAnnouncePlus = res.data.sync ? 1 : 0
       this.defaultOperateCmy = res.data.share ? res.data.share.split(",") : []
        this.companyIdArr = this.defaultOperateCmy
        this.getAllCompantInfo()
    })
},
  methods: {
    //   获取合作公司
    getAllCompantInfo(){
        let that = this
            getAllCompantInfo({ params: { keyword: ''} }).then((res) => {
                if(res.status === 200){
                    // debugger
                    res.data.forEach((element,index) => {
                        // 当存在合作公司时将名字展示出来
                        if(that.defaultOperateCmy.length){
                            // debugger
                            that.defaultOperateCmy.forEach(val => {
                                if(val == element.id){
                                    this.operateCompany += element.name + ","
                                }
                            })
                            that.tooltipContent = that.operateCompany
                        }
                        // 去除当前公司
                        if(element.id == that.companyId.id){
                            that.delCompanyIndex = index
                        }
                    })
                    that.companyData = res.data
                    if(that.delCompanyIndex || that.delCompanyIndex == 0){
                        that.$delete(that.companyData, that.delCompanyIndex)
                    }
                }else{
                    this.alertMessage('warning', res.message)
                    return
                }
            })
    },
    //   点击选择合作公司时
     handleNodeClickRole(data, value){
        //  debugger
         let companyStr = ""
         let companyId = []
         if(value.checkedNodes.length !== 0){
             value.checkedNodes.forEach(val => {
                 companyStr += val.name + ','
                 companyId.push(val.id)
             })
         }
         this.operateCompany = companyStr
         this.companyIdArr = companyId
         this.tooltipContent = companyStr
     },
    //  确定设置
     surePermiss(){
         let params = {
             id: this.companyId.id,
             sync: this.isAnnouncePlus,
             share: this.companyIdArr.length ? this.companyIdArr.join(",") : ""
         }
         console.log(params);
         setCompanyPermiss(params).then(res => {
            //  debugger
            if(res.status === 200){
                this.alertMessage("success", "配置成功")
                this.$emit("close","yes")
            }else{
                this.alertMessage("warning", res.message)
                return
            }
         })
     },
    //  取消设置
     noPermiss(){
        this.$emit("close","no")
     }
  }
}
</script>
<style lang='scss' scoped>
/deep/ .el-tree-node__content{
    padding-left: 5px !important;
     .el-tree-node__expand-icon {
        display: none;
    }
}
/deep/ .el-select__caret{
    height: 30px;
    line-height: 0;
}
/deep/ .el-input__inner{
    &:focus{
        border-color:#fda100;
    }
}
.companyPermiss{
    height: 200px;
    .companyPermiss_top{
        margin-bottom: 30px;
        /deep/ .el-radio-group{
            .el-radio{
                &:nth-of-type(2){
                    margin-left: 30px;
                }
            }
        }
          > label{
            width: 120px;
            text-align: right;
            display: inline-block;
            &::before{
                content: '*';
                color: #f56c6c;
                margin-right: 4px;
            }
        }
        
    }
    .companyPermiss_body{
        /deep/ .el-input--suffix{
            width: 200px;
        }
        > label{
            width: 120px;
            display: inline-block;
            text-align: right;
            margin-right: 8px;
        }
    }
    .move_footer{
        margin-top: 75px;
    }
}
</style>