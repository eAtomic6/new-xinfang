<!-- 项目列表 -->
<template>
  <div>
    <el-form
      :inline="true"
      :model="keyWordForm"
      class="demo-form-inline w-select"
      min-width="1398px"
    >
      <el-form-item label="关键词: ">
        <el-input v-model="keyWordForm.keyword" placeholder="请输入关键词" size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="onSearch" class="search-but">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;"
      highlight-current-row
      heigth="250"
      border
    >
      <el-table-column label="序号" width="60" type="index"></el-table-column>
      <el-table-column label="项目名称" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.name">{{scope.row.name}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="均价" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.building_price">{{scope.row.building_price}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
       <el-table-column label="区域" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.other_info">{{scope.row.other_info}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="项目类型" width="90">
        <template slot-scope="scope">
          <span
            v-if="scope.row.project_type">{{scope.row.project_type}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="项目归属" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.project_agent">{{scope.row.project_agent}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="开盘时间" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.specific_opening_time">{{scope.row.specific_opening_time}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="楼盘性质" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.building_property">{{scope.row.building_property}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="项目负责人" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.leader">{{scope.row.leader}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="负责人电话" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.leader_mobile">{{scope.row.leader_mobile}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[10, 15, 20, 25]"
      :page-size="pageSize"
      layout="prev, pager, next,  total, sizes, jumper"
      :total="tableTotals"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyWordForm: {}, // 条件搜索对象
      tableData: [], // table数据
      pageSize: 10, //
      pageNum: 1,
      tableTotals: 0,
    };
  },
  props:["lookSortForm"],
  created() {
    this.defaultData();
    console.log(this.lookSortForm);
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    defaultData() {
      this.keyWordForm = {
        keyword: "",
      };
    },
    getTableData() {
      this.lookSortForm.pageNum = this.pageNum;
      this.lookSortForm.pageSize = this.pageSize;
      this.lookSortForm.keyword = this.keyWordForm.keyword
      let qs = require("qs")
      // let params = this.lookSortForm
      let headers = {};
      headers["Content-Type"] = "application/json";
      this.$axios
        .get("/api/forceProjectSequencing", {params:this.lookSortForm})
        .then(res => {
          res = res.data;
          //   debugger
          if (res.status === 200) {
            this.tableData = res.data.list;
            this.tableTotals = res.data.total;
          }
        });
    },
    // 查询
    onSearch() {
      this.pageNum=1;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getTableData();
    },
  }
};
</script>
<style lang='scss' scoped>
/deep/ .el-table__body-wrapper {
  height: 350px;
  overflow-y: scroll;
  width: 101.5%;
}
.myfooter {
  margin-top: 0;
}
</style>
<style type="text/css">
  .current-row > td {
    background: #5a9ef2 !important;
    color: #000 !important;
  }
  .el-table--enable-row-hover .el-table__body tr:hover>td{
    color: #1e1e1e !important;
  }
</style>
