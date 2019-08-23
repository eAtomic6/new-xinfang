<!-- 删除项目时弹框 -->
<template>
  <div>
     <div v-if="!delProjectMsg">
          <div>
          删除项目后，该项目数据不会出现在项目列表、统计报表中，该项目下所有的报备带看记录置业端无法查阅，管理端无法查阅！
        </div>
        <br>
        <br>
        <p style="color:#FF0000; text-align:center;"><span class="el-icon-info" style="color:#5a9ef2"></span> 请确定是否进行删除操作</p>
        <div class="move_footer">
            <el-button  @click="sureDelete" class="sureAdd"  type="primary" round>确 定</el-button>
            <el-button @click="noDelete" class="noAdd">取 消</el-button>
        </div>
     </div>
     <div v-else>
         <div style="text-align:center;">{{delProjectMsg}}</div>
         <div class="move_footer">
            <el-button @click="closeDialog" class="noAdd">取 消</el-button>
        </div>
     </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      delProjectMsg:""
    };
  },
props:["projectId"],
  methods: {
    //   确定删除项目
    sureDelete(){
        // 点击确定触发父组件中的编辑接口
        this.$axios.delete("/api/eletedProjects",{params:{id:this.projectId}}).then((res) => {
          res = res.data
          if(res.status === 200){
            this.alertMessage("success","删除成功")
            this.$emit("sureDelProject")
            return
          }else if(res.status === 400){
            this.delProjectMsg=res.message
            return
          }else{
            this.alertMessage("warning",res.message)
            return
          }
        }).catch((err) => {
          
        });
        // this.$emit("sureDelProject")
    },
    // 取消删除项目
    noDelete(){
        this.$emit("closeDelDialog")
    },
    // 不能删除时点击取消
    closeDialog(){
        this.$emit("closeDelDialog")
        // this.$emit("defaultMessage")
    }
  }
}

</script>
<style lang='scss' scoped>
</style>