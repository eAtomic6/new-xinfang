<!-- 项目列表 -->
<template>
  <div>
    <el-form
      :inline="true"
      :model="keyWordForm"
      class="demo-form-inline w-select"
      min-width="1398px"
    >
      <el-form-item label="省:">
        <el-select
          v-model="keyWordForm.provinceId"
          placeholder="全部"
          size="mini"
          @change="provinceChange"
        >
          <el-option label="全部" value></el-option>
          <el-option
            v-for="value in allProvinceData"
            :key="value.provinceId"
            :label="value.province"
            :value="value.provinceId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="市:">
        <el-select v-model="keyWordForm.cityId" placeholder="全部" size="mini" @change="cityChange">
          <!-- <el-option label="全部" value=""></el-option> -->
          <el-option
            v-for="(value,index) in allCityData"
            :key="index"
            :label="value.city"
            :value="value.cityId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="片区：">
        <el-select v-model="keyWordForm.areaId" placeholder="全部" size="mini" @change="areaChange">
          <el-option label="全部" value></el-option>
          <el-option
            v-for="value in allAreaData"
            :key="value.areaId"
            :label="value.area"
            :value="value.areaId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商圈：">
        <el-select
          v-model="keyWordForm.businessDistrictId"
          placeholder="全部"
          size="mini"
          @change="businessDisChange"
        >
          <el-option label="全部" value></el-option>
          <el-option
            v-for="value in allBusinessData"
            :key="value.businessDistrictId"
            :label="value.businessDistrict"
            :value="value.businessDistrictId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="均价：">
        <el-select v-model="keyWordForm.buildingPrice" placeholder="全部" size="mini">
          <el-option label="全部" value></el-option>
          <el-option
            v-for="value in avgPrice"
            :label="value.value"
            :value="value.key"
            :key="value.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键词: ">
        <el-input v-model="keyWordForm.keyword" placeholder="请输入楼盘名称" size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="onSearch" class="search-but">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="onReset" class="chongzhi-but">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;"
      highlight-current-row
      @current-change="rowChange"
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
      <el-table-column label="均价" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.building_price">{{scope.row.building_price}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="区域" width="100">
        <template slot-scope="scope">
          <span
            v-if="scope.row.province || scope.row.city || scope.row.area"
          >{{scope.row.province}}-{{scope.row.city}}-{{scope.row.area}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="佣金" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.money_unit">{{scope.row.money_unit}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="佣金规则" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.money_des">{{scope.row.money_des}}</span>
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
      <el-table-column label="项目状态" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.project_state">{{scope.row.project_state}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="项目有效类型" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.customer_type">{{scope.row.customer_type}}</span>
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
    <div class="operation-btn move_footer myfooter">
      <el-button class="sureAdd" @click="sureSelect">确 定</el-button>
      <el-button class="noAdd" @click="noSelect">取 消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyWordForm: {}, // 条件搜索对象
      allProvinceData: [], // 所有省份数据
      allCityData: [], // 所有市数据
      allAreaData: [], // 所有片区
      allBusinessData: [], // 所有商圈
      tableData: [], // table数据
      pageSize: 10, //
      pageNum: 1,
      tableTotals: 0,
      rowMessage: {}
    };
  },
  props: ["avgPrice"],
  created() {
    //   let myInfo = JSON.parse(localStorage.getItem("myInfo")).dep
    let cityName = "";
    //   cityName = myInfo.areaName.split(",")[1]
    this.getProvinceData(1);
    //   this.allCityData.push({city:cityName,cityId:myInfo.area})
    this.defaultData();
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    getProvinceData(int, data) {
      this.$axios
        .get("/api/projectProvinceCityAreaBusinessDistrict", { params: data })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            //   debugger
            switch (int) {
              case 1:
                this.allProvinceData = res.data;
                break;
              case 2:
                this.allCityData = res.data;
                this.allCityData.unshift({ city: "全部", cityId: "" });
                break;
              case 3:
                this.allAreaData = res.data;
                break;
              case 4:
                this.allBusinessData = res.data;
                break;
              default:
                break;
            }
          }
        });
    },
    defaultData() {
      this.keyWordForm = {
        provinceId: "",
        keyword: "",
        //   cityId:JSON.parse(localStorage.getItem("myInfo")).dep.area,
        cityId: "",
        areaId: "",
        businessDistrictId: "",

        buildingPrice: ""
        //   commercialInfo:-500
      };
    },
    getTableData() {
      this.keyWordForm.pageNum = this.pageNum;
      this.keyWordForm.pageSize = this.pageSize;
      this.$axios
        .get("/api/pcCustomerLookReportProjects", { params: this.keyWordForm })
        .then(res => {
          res = res.data;
          //   debugger
          if (res.status === 200) {
            this.tableData = res.data.list;
            this.tableTotals = res.data.total;
          }
        });
    },
    //   省份发生改变
    provinceChange(val) {
      this.getProvinceData(2, { provinceId: val });
      this.keyWordForm.cityId = "";
      this.keyWordForm.areaId = "";
      this.keyWordForm.businessDistrictId = "";
      this.allAreaData = [];
      this.allBusinessData = [];
    },
    // 市发生改变
    cityChange(val) {
      this.getProvinceData(3, {
        provinceId: this.keyWordForm.provinceId,
        cityId: val
      });
      this.allBusinessData = [];
      this.keyWordForm.areaId = "";
      this.keyWordForm.businessDistrictId = "";
    },
    // 片区发生改变
    areaChange(val) {
      this.getProvinceData(4, {
        provinceId: this.keyWordForm.provinceId,
        cityId: this.keyWordForm.cityId,
        areaId: val
      });
      this.keyWordForm.businessDistrictId = "";
    },
    // 商圈发生改变
    businessDisChange(val) {},
    // 查询
    onSearch() {
      this.pageNum = 1;
      this.getTableData();
    },
    // 重置
    onReset() {
      this.defaultData();
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
    // 确定选择
    sureSelect() {
      if (this.rowMessage && this.rowMessage.id) {
        this.$emit("selectProject", this.rowMessage);
      } else {
        this.alertMessage("warning", "请选择项目");
        return;
      }
    },
    // 取消选择
    noSelect() {
      this.$emit("noSelect");
    },
    // 点击table行的时候
    rowChange(currentRow, oldRow) {
      this.rowMessage = currentRow;
      // debugger
    }
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
.el-table--enable-row-hover .el-table__body tr:hover > td {
  color: #1e1e1e !important;
}
</style>
