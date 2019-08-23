<template>
    <!-- form表单 -->
        <div class="w-select">
            <el-form :inline="true" :model="formInline" class="demo-form-inline listForm">
                <el-form-item label="部门:">
                    <!-- <el-input v-model="formInline.dealDepId" placeholder="请输入部门"></el-input> -->
                    <el-select v-model="formInline.departName" placeholder="请选择" class="tree-input">
                        <el-option value="">
                            <el-tree :data="departmentData" :props="departmentProp" node-key="DepartOnlyCode" check-on-click-node
                             :expand-on-click-node="false" @node-click="clickNode"></el-tree>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="成交人:">
                    <!-- <el-autocomplete class="inline-input" v-model="formInline.dealBy" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect"></el-autocomplete> -->
                    <!-- <el-input  placeholder="请输入成交人"></el-input>v-model="keyWordContent" -->

                  <el-select
                    v-model="formInline.dealBy"
                    filterable
                    remote
                    reserve-keyword
                    :clearable="true"
                    placeholder="请输入内容"
                    :remote-method="querySearch"
                    @change="handleSelect"
                  >
                    <el-option
                      v-for="item in depArr"
                      :key="item.e_id"
                      :label="item.e_name+'('+item.d_name+')'"
                      :value="item.e_id+'-'+item.e_name"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="合同状态:">
                    <el-select v-model="formInline.dealType" placeholder="全部">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="认筹" value="0" v-if="title != '结算'"></el-option>
                        <el-option label="认购" value="1" v-if="title != '结算'"></el-option>
                        <el-option label="草签" value="2" v-if="title != '结算'"></el-option>
                        <el-option label="网签" value="3" v-if="title != '结算'"></el-option>
                        <el-option label="结算中" value="8"></el-option>
                        <el-option label="分佣中" value="9"></el-option>
                        <el-option label="已完成" value="10"></el-option>
                        <el-option label="驳回" value="11" v-if="title != '结算'"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="佣金:" v-if="title == '结算'">
                    <el-select v-model="formInline.commissionType" placeholder="不限">
                        <el-option label="不限" value=""></el-option>
                        <el-option label="未发放" value="0"></el-option>
                        <el-option label="已发放" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="成交日期:">
                    <div class="block">
                        <el-date-picker v-model="dealTime" type="daterange" start-placeholder="开始日期" :picker-options="pickerOptions" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="关键词:">
                    <el-input v-model="formInline.keyword" placeholder="请输入客户名称，客户电话，项目名称" class="input-long" maxlength="50"></el-input>
                </el-form-item>
                <span class="group-s">
                    <el-form-item>
                        <el-button type="primary" @click="onSearch" class="search-but">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onReset" class="chongzhi-but">重置</el-button>
                    </el-form-item>
                    <el-form-item v-if="title == '结算'">
                        <el-button type="primary" @click="toGrant" class="but-lightblue">标记为已发放佣金</el-button>
                    </el-form-item>
                    <el-form-item v-if="title == '结算'">
                        <el-button type="primary" @click="noGrant" class="but-lightblue">标记为未发放佣金</el-button>
                    </el-form-item>
                </span>
            </el-form>
        </div>
</template>

<script>
import { getDepartList, getEmployeeInfo } from "@/api/index";
export default {
  data() {
    return {
      formInline: {
        departName: "",
        dealDepId: JSON.parse(localStorage.getItem("myInfo")).depId, // 部门
        dealBy: "", // 成交人
        dealById: "", // 成交人
        dealType: "", // 合同状态
        commissionType: "", // 佣金类型
        dealTimeStart: "", // 成交开始时间
        dealTimeEnd: "", // 成交结束时间
        keyword: "" // 关键词
      },
      departmentData: [], //获取部门的数据
      departmentProp: {
        value: "id",
        label: "name",
        children: "child"
      },
      getEmployeeInfoData: [], //人员部门的数据
      dealTime: [],
      depArr:[],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now();
        },
        firstDayOfWeek: 1
      }
    };
  },
  props: {
      title:{
          type: String,
          default: '收款'
      }
  },
  created() {
    let param = {
        depId: JSON.parse(localStorage.getItem("myInfo")).depId,
        keyword: ""
    }
    this.getDepartList();
    this.getDealPeople(param)
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
      let param = {
        depId: data.id,
        keyword: ""
      }
      this.getDealPeople(param)
    },
    // 获取所有成交人信息方法
    getDealPeople(param){
      getEmployeeInfo({
          params: param
        }).then(res => {
          this.depArr=res.data;
        })
    },
    // 成交人的模糊搜索
    querySearch(queryString) {
       // debugger
      if (queryString) {
        let param = {
          depId: this.formInline.dealDepId,
          keyword: queryString
        };
        this.getDealPeople(param)
      }
      
      // else {
      //   this.getEmployeeInfoData.length = 0;
      //   this.formInline.dealById = ""
      //   let param = {
      //     depId: this.formInline.dealDepId,
      //     keyword: ''
      //   };

      //   getEmployeeInfo({
      //     params: param
      //   }).then(res => {

      //     res.data.forEach((value, id) => {
      //       this.getEmployeeInfoData.push({
      //         value: value.e_name + " (" + value.d_name + ")",
      //         // id: value.eid,
      //         eid: value.e_id,
      //         // did: value.did,
      //            names: value.e_name,
      //            department: value.d_name
      //       });
      //     });
      //   });
      // }
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    // 选中成交人
    handleSelect(item) {
       let resultArr=item.split("-");
       this.formInline.dealById = resultArr[0];
       this.formInline.dealBy=resultArr[1];
    },
    // 点击查询按钮
    onSearch() {
      if (this.dealTime !=null && this.dealTime.length) {
        this.formInline.dealTimeStart = this.dealTime[0]
        this.formInline.dealTimeEnd = this.dealTime[1]
      }else {
        this.formInline.dealTimeStart = ''
        this.formInline.dealTimeEnd = ''
      }
      this.$emit('getList',this.formInline)
    },
    // 点击重置按钮
    onReset() {
      this.formInline.departName = ""
        this.formInline.dealDepId = JSON.parse(localStorage.getItem("myInfo")).depId // 部门
        this.formInline.dealBy = "" // 成交人
        this.formInline.dealById = "" // 成交人
        this.formInline.dealType = "" // 合同状态
        this.formInline.commissionType = "" // 佣金类型
        this.formInline.dealTimeStart = "" // 成交开始时间
        this.formInline.dealTimeEnd = "" // 成交结束时间
        this.formInline.keyword = "" // 关键词
        this.dealTime = []
      this.$emit('getList',false,true)
    },
    // 点击标记已发按钮
    toGrant() {
      this.$emit('showTip',1)
    },
    // 点击标记未发按钮
    noGrant() {
      this.$emit('showTip',0)
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-select-dropdown__item{
  padding: 0 !important;
}
.w-select {
  /deep/ .tree-input {
    width: 180px;

    .el-input__inner {
      width: 180px!important;
    }
  }
  .group-s {
      width: 536px;
  }
}
</style>


