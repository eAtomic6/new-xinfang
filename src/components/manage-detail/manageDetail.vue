<!-- 报表里面的详情 -->
<template>
  <div class="total-dialog">
       <ul class="total-dialog-tool">
            <li>
                <span>统计类型:</span>
                <el-select v-model="SearchStatisticsForm.type" v-if="dictionary['350']">
                    <el-option v-for="item in dictionary['350'].children" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
            </li>
            <li>
                <span>统计时间:</span>
                <el-select v-model="SearchStatisticsForm.day" v-if="dictionary['359']" @change="projectTimeChange">
                    <el-option v-for="item in dictionary[359].children" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
            </li>
            <li>
                <el-date-picker type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="dataRange" start-placeholder="开始日期" end-placeholder="结束日期" @change="projectTimesChange">
                </el-date-picker>
            </li>
            <li>
                <el-button type="primary" @click="searchStatistics">查询</el-button>
            </li>
        </ul>
        <div class="total-dialog-content">
            <strong>统计说明: </strong> <i v-html="isGuWenManage ? '':'当前项目'"></i> &nbsp;<i v-if="!isGuWenManage">总客户数<span class="red-bold">&nbsp;{{customerTotals}}&nbsp;</span>位,</i>&nbsp;{{ currentPhase }}总共{{ statisticsTable.info }}客户
            <span class="red-bold">{{statisticsCount.countSum}}</span>&nbsp; <i v-if="isGuWenManage">位</i><i v-if="!isGuWenManage">{{statisticsTable.info == '报备' || statisticsTable.info == '带看' || statisticsTable.info == '退筹' || statisticsTable.info == '退房' ? '次' : '位'}}</i>
            ,其中<span v-if="hadUnsubscribeShow" class="hadUnsubscribeShow">{{ statisticsTable.msg }}<i> {{ statisticsCount.return }}</i> 位,</span>{{ statisticsTable.valid }}
            <span class="red-bold">{{statisticsCount.valid}}</span> {{ statisticsTable.unit }}
        </div>
        <div class="statistics-table" v-if="statisticsTableData.list">
            <el-table :data="statisticsTableData.list">
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column property="bName" label="项目名称" width="120" v-if="isGuWenManage"></el-table-column>
                <el-table-column property="employeeName" :label="statisticsTable.employeeName" width="180" v-if="!isGuWenManage"></el-table-column>
                <el-table-column property="customerName" label="客户名称" width="120"></el-table-column>
                <el-table-column property="time" :label="statisticsTable.time" width="200"></el-table-column>
                <el-table-column property="money" :label="statisticsTable.amount" v-if="amountTJShow"></el-table-column>
                <el-table-column property="state" :label="statisticsTable.state" v-if="stateTJShow"></el-table-column>
            </el-table>
        </div>
        <!-- 项目统计分页器 -->
        <el-pagination @size-change="handleSizeChangeTJ" @current-change="handleCurrentChangeTJ" :current-page="SearchStatisticsForm.pageNum" :page-sizes="[5, 10, 15, 20]" :page-size="SearchStatisticsForm.pageSize" layout="prev, pager, next,  total, sizes, jumper" :total=" isGuWenManage ? countSum : statisticsCount.countSum">
        </el-pagination>
  </div>
</template>

<script>
import {getProjectStatistics} from '@/api/index.js'
export default {
  data () {
    return {
        statisticsTable: {
          type: 1,
          employeeName: "报备人",
          time: "报备提交时间",
          state: "报备状态",
          info: "报备",
          valid: "有效报备",
          unit: "位",
          amount: "认筹金额"
        },
       SearchStatisticsForm: {  // 搜索条件对象
          day: 5,
          startTime: '',
          endTime: '',
          type: 1,
          pageSize: 5,
          pageNum: 1
        },
        statisticsCount: {},
        countSum: 0, //项目统计总条数
        // 项目统计 表格
        statisticsTableData: {},
        amountTJShow: false,
        stateTJShow: true,
        hadUnsubscribeShow: false,
        currentPhase: "全部",
        dictionary:{},
        dataRange:[],
        tongjiProjectId: "", //点击统计的项目列表的存储
        customerTotals:0,
    };
  },
  props:["manageId","isGuWenManage"],
created(){
  this.getProjectStatistics("init",this.manageId)
  this.getDictionary()
},
  methods: {
     // 获取字典项
    getDictionary(){
      this.$axios.get("/api/dictionary/list",{params:{ids:"350,359"}}).then(res => {
        this.dictionary=res.data.data
      })
    },
    getProjectStatistics(type, projectId) {
      let that = this
      this.$axios.get("/api/report/consultantCount/can").then(res => {
        if(res.status === 200){
          this.tongjiProjectId = projectId
          this.isGuWenManage ? this.SearchStatisticsForm.empId = projectId : this.SearchStatisticsForm.buildingId = projectId
          let param = {
            day: 5,
            endTime: '',
            startTime: '',
            type: 1,
            pageSize: 5,
            pageNum: 1
          }
          this.isGuWenManage ? param.empId = projectId : param.buildingId=projectId
          if (type === 'info') {
            that.SearchStatisticsForm.startTime = that.dataRange.length ? that.dataRange[0] : ''
            that.SearchStatisticsForm.endTime = that.dataRange.length ? that.dataRange[1] : ''
          }
          this.projectDetail = true;
          let urlStr = ""
          urlStr = this.isGuWenManage ? "/api/report/consultantCount" : "/api/buildingStatistics"
          this.$axios.get(urlStr,{
            params: type === 'init' ? param : this.SearchStatisticsForm
          }).then(res => {
            res = res.data
            if (res.status === 200) {
              let type= this.SearchStatisticsForm.type
              if(this.isGuWenManage){
                this.statisticsTableData = res.data.pageInfo
                this.countSum = res.data.pageInfo.total
                this.statisticsCount.countSum = res.data.customerCount
                this.statisticsCount.return = res.data.checkOutCustomerCount
                if(type == 1 || type == 2){
                this.statisticsCount.valid = res.data.validCustomerCount
                }else if(type == 5 || type == 6){
                this.statisticsCount.valid = res.data.areaMoney
                }else{
                this.statisticsCount.valid = res.data.moneyCount
                }
              }else{
                this.customerTotals = res.data.total
                this.statisticsTableData = res.data
                this.countSum = res.data.buildingReportSum
              switch (type) {
              case 1:
                this.statisticsCount = {
                  valid: this.statisticsTableData.buildingValidReportSum,
                  countSum: this.statisticsTableData.buildingReportSum
                }
                break
              case 2:
                this.statisticsCount = {
                  valid: this.statisticsTableData.buildingValidLookSum,
                  countSum: this.statisticsTableData.buildingLookSum
                }
                break
              case 3:
                this.statisticsCount = {
                  valid: this.statisticsTableData.buildingPrcMoneySum,
                  countSum: this.statisticsTableData.buildingPrcSum
                }
                break
              case 4:
                this.statisticsCount = {
                  valid: this.statisticsTableData.buildingSubscribeMoneySum,
                  countSum: this.statisticsTableData.buildingSubscribeSum
                }
                break
              case 5:
                this.statisticsCount = {
                  valid: this.statisticsTableData.buildingInitialMoneySum,
                  countSum: this.statisticsTableData.buildingInitialSum
                }
                break
              case 6:
                this.statisticsCount = {
                  valid: this.statisticsTableData.buildingNetSignMoneySum,
                  countSum: this.statisticsTableData.buildingNetSignSum
                }
                break
              case 7:
                this.statisticsCount = {
                  valid: this.statisticsTableData.unsubscribePrcMoneySum,
                  return: this.statisticsTableData.hadUnsubscribePrcSum,
                  countSum: this.statisticsTableData.unsubscribePrcSum
                }
                break
              case 8:
                this.statisticsCount = {
                  valid: this.statisticsTableData.unsubscribeMoneySum,
                  return: this.statisticsTableData.hadUnsubscribeSum,
                  countSum: this.statisticsTableData.unsubscribeSum
                }
                break
            }
              }
            }
            this.statisticsTableData.list.forEach(value => {
              if (type === 1 || type === 2) {
                value.time = value.time ? value.time.slice(0, value.time.lastIndexOf(':')) : ""
                value.money = value.money ? value.money + "元" : ""
              } else if (type === 5 || type === 6) {
                value.time = value.time ? value.time.slice(0, value.time.lastIndexOf(' ')) : ""
                value.money = value.money ? value.money + "万元" : ""
              } else {
                value.time = value.time ? value.time.slice(0, value.time.lastIndexOf(' ')) : ""
                value.money = value.money ? value.money + "元" : ""
              }
            })
            
          })
        }
        }).catch(err => {
          if(err.response.status === 403){
            this.alertMessage("warning","无操作权限")
            return
          }
        })
      },
    handleClose(){
       this.SearchStatisticsForm = {
          day: 5,
          startTime: '',
          endTime: '',
          type: 1,
          pageSize: 5,
          pageNum: 1
        }
        this.statisticsTable = {
            type: 1,
            employeeName: "报备人",
            time: "报备提交时间",
            state: "报备状态",
            info: "报备",
            valid: "有效报备",
            unit: "位",
            amount: "认筹金额"
          },
          this.currentPhase = "全部"
        this.stateTJShow = true
        this.amountTJShow = false
        this.hadUnsubscribeShow = false
        this.dataRange = []
    },
    handleSizeChangeTJ(val){
      this.SearchStatisticsForm.pageSize = val
      this.getProjectStatistics('info', this.tongjiProjectId)
    },
    handleCurrentChangeTJ(val){
      this.SearchStatisticsForm.pageNum = val
      this.getProjectStatistics('info', this.tongjiProjectId)
    },
    projectTimeChange(){
      this.dataRange = []
    },
    // 项目详情查询
    searchStatistics(){
      this.SearchStatisticsForm.pageNum = 1
        this.SearchStatisticsForm.pageSize = 5
        let TJData = [{
            type: 1,
            employeeName: "报备人",
            time: "报备提交时间",
            state: "报备状态",
            info: "报备",
            valid: "有效报备",
            unit: "位"
          },
          {
            type: 2,
            employeeName: "带看人",
            time: "带看提交时间",
            state: "带看状态",
            info: "带看",
            valid: "有效带看",
            unit: "位"
          },
          {
            type: 3,
            employeeName: "（认筹）成交人",
            time: "认筹时间",
            state: "认筹金额",
            info: "认筹",
            valid: "认筹金额共",
            unit: "元",
            amount: "认筹金额"
          },
          {
            type: 4,
            employeeName: "（认购）成交人",
            time: "认购时间",
            state: "认筹金额",
            info: "认购",
            valid: "认购金额共",
            unit: "元",
            amount: "认购金额"
          },
          {
            type: 5,
            employeeName: "（草签）成交人",
            time: "草签时间",
            state: "房屋总价",
            info: "草签",
            valid: "房屋总价共",
            unit: "万元",
            amount: "房屋总价"
          },
          {
            type: 6,
            employeeName: "（网签）成交人",
            time: "网签时间",
            state: "房屋总价",
            info: "网签",
            valid: "房屋总价共",
            unit: "万元",
            amount: "房屋总价"
          },
          {
            type: 7,
            employeeName: "退筹申请人",
            time: "退筹时间",
            amount: "退筹金额",
            state: "退筹状态",
            info: "退筹",
            valid: "退筹金额共",
            unit: "元",
            msg: "已退筹"
          },
          {
            type: 8,
            employeeName: "退房申请人",
            time: "退房时间",
            amount: "退款金额",
            state: "退房状态",
            info: "退房",
            valid: "退款金额共",
            unit: "元",
            msg: "已退房"
          },
        ]
        if (this.SearchStatisticsForm.type === 1 || this.SearchStatisticsForm.type === 2) {
          this.amountTJShow = false
        } else {
          this.amountTJShow = true
        }
        if (
          this.SearchStatisticsForm.type === 1 ||
          this.SearchStatisticsForm.type === 2 ||
          this.SearchStatisticsForm.type === 7 ||
          this.SearchStatisticsForm.type === 8) {
          this.stateTJShow = true
        } else {
          this.stateTJShow = false
        }
        if (this.SearchStatisticsForm.type === 7 || this.SearchStatisticsForm.type === 8) {
          this.hadUnsubscribeShow = true
        } else {
          this.hadUnsubscribeShow = false
        }
        TJData.forEach(value => {
          if (this.SearchStatisticsForm.type === value.type) {
            this.statisticsTable = value
          }
        })
        switch (this.SearchStatisticsForm.day) {
          case 1:
            this.currentPhase = "当天"
            break
          case 2:
            this.currentPhase = "七天内"
            break
          case 3:
            this.currentPhase = "本月"
            break
          case 4:
            this.currentPhase = "半年"
            break
          case 5:
            this.currentPhase = "全部"
            break
        }
        this.getProjectStatistics('info', this.tongjiProjectId)
    },
      // 项目统计自定义时间改变时
    projectTimesChange() {
        this.SearchStatisticsForm.day = 5
      },
  }
}
</script>
<style lang='scss' scoped>
.total-dialog {
  .total-dialog-tool {
    height: 60px;
    background: #e6e6e9;
    color: #333344;
    font-weight: 700;
    /deep/ .el-input--suffix{
      .el-icon-arrow-up{
        line-height: 0;
      }
    }
   /deep/ .el-range-separator{
      line-height: 20px;
    }
    >li {
      &:first-of-type {
        padding-left: 10px;
      }

      &:last-child {
        margin-top: 45px;

        .el-button {
          background-color: #fd8f00;
          border: none;
        }
      }

      >span {
        width: 128px;
      }
    }
  }
  &-tool {
    display: flex;

    >li {
      display: inherit;
      align-items: center;
      padding-right: 20px;
      /deep/ .el-icon-arrow-up{
        line-height: 0;
      }
      /deep/ .el-range-separator {
        line-height: 20px;
      }
      >span {
        width: 80px;
      }
    }
  }

  &-content {
    background-color: #fffae7;
    padding: 10px;
    margin-bottom: 10px;

    >span {
      color: #f84949;
    }
  }
   .total-dialog-content {
    margin-top: 10px;

    >.hadUnsubscribeShow {
      color: #666;

      i {
        color: #f84949;
      }
    }
    .red-bold {
      color: #f84949;
      font-weight: 600;
    }
  }
  .el-button {
    margin-bottom: 45px;
  }
}
</style>