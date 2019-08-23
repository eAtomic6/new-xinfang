<!-- 报备项目、带看项目修改弹框 -->
<template>
  <div>
      <div class="change-select">
          <label v-html="changeData.valueName=='报备项目'?'报备状态:':'带看状态'"></label>
            <el-select v-model="changeType" placeholder="请选择">
                <el-option :label="changeData.valueName=='报备项目'? '有效报备':'有效带看'" :value="2"></el-option>
                <el-option :label="changeData.valueName=='报备项目'? '无效报备':'无效带看'" :value="1"></el-option>
                <el-option label="驳回" :value="4"></el-option>
            </el-select>
      </div>
        <p style="color:#FF0000; text-align:center;"><span class="el-icon-info" style="color:#5a9ef2"></span>请确定是否进行修改操作</p>
    <div class="move_footer">
      <el-button class="sureAdd" @click="sureChange">确 定</el-button>
      <el-button class="noAdd" @click="noChange">取 消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
        changeType:""
    };
  },
props:["changeData"],
created(){
    // console.log(this.changeData);
},
  methods: {
      sureChange(){
          if(this.changeType){
              let qs = require('qs')
              let str = ""
              str = this.changeData.valueName == '报备项目' ? "/api/report/state" : "/api/look/state"
              this.$axios.put(str,qs.stringify({id:this.changeData.id,state:this.changeType})).then(res => {
                  res = res.data
                //   debugger
                if(res.status === 200){
                    this.alertMessage("success","修改成功")
                    this.$emit("closeChangeDialog")
                    this.$store.commit("setDetailUpload", 2);
                    this.changeType=""  
                }else{
                    this.changeType=""
                    this.alertMessage("warning",res.message,2000)
                    return
                }
              })
          }else{
              this.$message.error(this.changeData.valueName=='报备项目'?'请选择报备状态':'请选择带看状态');
              return
          }
      },
      noChange(){
            this.$emit("closeChangeDialog")
      }
  }
}

</script>
<style lang='scss' scoped>
.change-select{
    text-align: center;
    margin: 20px 0 30px 0;
    label{
        &:before {  
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
        display: inline-block;
        }
    }
    /deep/ .el-select{
        .el-input__icon{
            line-height: 0;
        }
    }
}
</style>