<!-- 分配驻场的弹框 -->
<template>
  <div>
    <i class="icon icon-zengjia" @click="clickPutPerson">分配人员</i>
    <el-table :data="personTableData">
        <el-table-column prop="title" label="职务">
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="mobile" label="联系电话">
        </el-table-column>
        <el-table-column prop="meaning" label="电话规则">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <div @click="setPhoneRule(scope.row)" style="color:#66b1ff;">设置电话规则</div>
                <el-button @click.native.prevent="confirmDelRowindex(scope.row)" type="text">
                    删除
                </el-button>
            </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },

  methods: {
    clickPutPerson(){

    },
    setPhoneRule(){},
    confirmDelRowindex(){}
  }
}

</script>
<style lang='scss' scoped>
</style>