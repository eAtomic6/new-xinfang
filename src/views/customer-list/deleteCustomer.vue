<!-- 删除客源弹框 -->
<template>
  <div v-if="!deleteMessage">
      删除客户后，该客户数据不会在现在的项目列表、统计报表中。
      <br>
      <br>
      <br>
       <p style="color:#FF0000; text-align:center;"><span class="el-icon-info" style="color:#5a9ef2"></span> 请确定是否进行删除操作</p>
        <div class="move_footer">
            <el-button  @click="sureDelete" class="sureAdd"  type="primary" round>确 定</el-button>
            <el-button @click="noDelete" class="noAdd">取 消</el-button>
        </div>
  </div>
  <div v-else>
      <p style="text-align:center;">{{deleteMessage}}</p>
       <div class="move_footer">
            <el-button @click="closeDialog" class="noAdd">取 消</el-button>
        </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },
    props:["deleteMessage"],
  methods: {
    //   确认删除
      sureDelete(){
          this.$emit("sureDelCustomer")
      },
    //   点击取消
      noDelete(){
          this.$emit("closeDelete")
      },
      closeDialog(){
          this.$emit("closeDelete")
      }
  }
}

</script>
<style lang='scss' scoped>
</style>