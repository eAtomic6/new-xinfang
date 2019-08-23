<!-- 收佣核对列表 -->
<template>
  <div>
      <sale-query></sale-query>
      <div class="makeSale-middle">
          <ul>
              <li>
                  <p>成交总价:123</p>
                  <span>直销</span>
                  <span>直营</span>
                  <span>加盟</span>
                  <span>加盟</span>
                  <span>加盟</span>
              </li>
              <li>
                  <p>成交总价:123</p>
                  <span>直销</span>
                  <span>直营</span>
                  <span>加盟</span>
                  <span>加盟</span>
                  <span>加盟</span>
              </li>
              <li>
                  <p>成交总价:123</p>
                  <span>直销</span>
                  <span>直营</span>
                  <span>加盟</span>
                  <span>加盟</span>
                  <span>加盟</span>
              </li>
          </ul>
      </div>
      <sale-table
     :showTableData="showTableData"
     :tableData="tableData"
     :tableTotals="tableTotals"
     :paginationObj="paginationObj"
     :loading="loading"></sale-table>
  </div>
</template>

<script>
import saleQuery from "../salequery.vue"
import saleTable from "../saleTable.vue"
import {showTableData} from "./checkSaleData.js"
export default {
    components:{saleQuery,saleTable},
  data () {
    return {
        tableTotals:0,   //table总条数
        tableData:[],    //table数据
        showTableData:showTableData,
        paginationObj:{
            pageSize:20,
            pageNum:1
        },
        loading:false
    };
  },
created(){
    this.tableData = [{
        name:"张三",
        pc_name:100,
        p_name:"我是测试项目"
    }]
},
  methods: {}
}

</script>
<style lang='scss' scoped>
.makeSale-middle{
    >ul{
        width: 100%;
        height: 100px;
        li{
            float: left;
            width: 20%;
        }
    }
}
</style>