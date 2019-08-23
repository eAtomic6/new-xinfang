<!-- 线下获客列表今日数据查询页面 -->
<template>
  <div>
      <div class="w-select">
          <label>接听人电话:</label><el-input v-model="phone" placeholder="请输入手机号"></el-input>
          <el-button type="primary" class="but-lightblue" @click="queryData">查询</el-button>
      </div>
      <el-table
      :data="tableData"
      style="width: 100%"
      height="300">
      <el-table-column
      type="index"
      label="序号"
      width="50">
    </el-table-column>
      <el-table-column
        prop="CallingTel"
        label="客户号码"
        width="180">
      </el-table-column>
      <el-table-column
        prop="StartTime"
        label="拨打时间">
      </el-table-column>
    </el-table>
      <div class="move_footer">
      <el-button @click="closeDialog" class="noAdd">关闭</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
        phone:"",
        tableData:[]
    };
  },
  methods: {
      closeDialog(){
          this.tableData = []
          this.phone = ""
          this.$emit("closeDialog")
      },
      queryData(){
          if(this.phone){
              this.$axios.get("/api/jjw/customer/offline/today",{params:{mobile:this.phone}}).then(res => {
                  debugger
                  res = res.data
                  if(res.status === 200){
                      this.tableData = res.data.list
                  }
              })
          }else{
              this.alertMessage("info","请输入手机号查询",1500)
              return
          }
      }
  }
}

</script>
<style lang='scss' scoped>
/deep/ .el-input{
    width: auto !important;
}
</style>