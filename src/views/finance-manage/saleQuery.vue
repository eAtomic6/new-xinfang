<!-- 结算的公共条件搜索组建 -->
<template>
  <div>
    <div class="w-select">
      <el-form :inline="true" :model="formInline" class="demo-form-inline listForm">
        <el-form-item label="部门:">
          <el-select v-model="formInline.departName" placeholder="请选择" class="tree-input">
            <el-option value>
              <el-tree
                :data="departmentData"
                :props="departmentProp"
                node-key="DepartOnlyCode"
                check-on-click-node
                :expand-on-click-node="false"
                @node-click="clickNode"
              ></el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同状态:">
          <el-select v-model="formInline.dealType" placeholder="全部">
            <el-option label="全部" value></el-option>
            <el-option label="认筹" value="0"></el-option>
            <el-option label="认购" value="1"></el-option>
            <el-option label="草签" value="2"></el-option>
            <el-option label="网签" value="3"></el-option>
            <el-option label="结算中" value="8"></el-option>
            <el-option label="分佣中" value="9"></el-option>
            <el-option label="已完成" value="10"></el-option>
            <el-option label="驳回" value="11"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="佣金状态:">
          <el-select v-model="formInline.commissionType" placeholder="不限">
            <el-option label="不限" value></el-option>
            <el-option label="未发放" value="0"></el-option>
            <el-option label="已发放" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成交日期:">
          <div class="block">
            <el-date-picker
              v-model="dealTime"
              type="daterange"
              start-placeholder="开始日期"
              :picker-options="pickerOptions"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="关键词:">
          <el-input
            v-model="formInline.keyword"
            placeholder="请输入客户名称，客户电话，项目名称"
            class="input-long"
            maxlength="50"
          ></el-input>
        </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch" class="search-but">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onReset" class="chongzhi-but">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="makeSale" class="but-lightblue">开票收佣</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="applySale" class="but-lightblue">申请结佣</el-button>
          </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      departmentData: [], //部门数据
      departmentProp: {     //部门的值prop
        value: "id",
        label: "name",
        children: "child"
      },
      formInline: {}, //条件数据对象
      dealTime:[],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now();
        },
        firstDayOfWeek: 1
      }
    };
  },
  methods: {
    // 获取部门
    getDepartList() {
      getDepartList()
        .then(res => {
          this.departmentData = JSON.parse(
            "[" + JSON.stringify(res.data) + "]"
          );
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无获取部门权限");
            return;
          }
        });
    },
    // 点击转移部门节点时
    clickNode(data, value) {
      this.departmentSelect = data.id;
      this.formInline.dealDepId = data.id;
      this.formInline.departName = data.name;
    },
    //   点击查询
    onSearch() {},
    //   点击重置
    onReset() {},
    //   点击开盘收佣
    makeSale() {},
    //   点击申请结佣
    applySale() {}
  }
};
</script>
<style lang='scss' scoped>
</style>