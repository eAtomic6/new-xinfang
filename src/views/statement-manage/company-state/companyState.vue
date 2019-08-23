<!-- 公司统计报表 -->
<template>
  <div id="companyState" class="container">
    <!-- 左边公司板块 -->
    <div id="company_info">
      <!-- 左边上半部分 -->
      <div class="company_info_top">
        <div class="company_info_top_name">
          <el-select v-model="company_name">
            <el-option
              v-for="(item,index) in company_chose"
              :key="index"
              :value="item.id"
              :label="item.name"
              @click.native="choseCompany(item)"
            ></el-option>
          </el-select>
          <p>公司负责人: {{company_info.managers | limit1}}</p>
          <p>入驻时间：{{company_info.create_time}}</p>
        </div>
        <div class="company_info_content">
          <div>
            <span>员工人数</span>
            <span>{{company_info.e_count}}人</span>
          </div>
          <div>
            <span>主管人数</span>
            <span>{{company_info.e_master_count}}人</span>
          </div>
          <div>
            <span>录入客户</span>
            <span>{{company_info.c_count}}人</span>
          </div>
          <div>
            <span>联动客户</span>
            <span>{{company_info.c_link_count}}人</span>
          </div>
          <div>
            <span>渠道客户</span>
            <span>{{company_info.channel_count}}人</span>
          </div>
          <div>
            <span>总成交客户</span>
            <span>{{company_info.c_deal_count}}人</span>
          </div>
          <div>
            <span>总成交面积</span>
            <span>{{company_info.house_area_sum}}㎡</span>
          </div>
        </div>
      </div>
      <!-- 左边半部分 -->
      <div class="company_info_bottom">
        <div>
          <span>应收总佣金</span>
          <span>{{company_info.expected_commision_sum}}元</span>
        </div>
        <div>
          <span>实收总佣金</span>
          <span>{{company_info.actual_commision_sum}}元</span>
        </div>
        <div>
          <span>剩余总佣金</span>
          <span>{{company_info.remaining_commision_sum}}元</span>
        </div>
        <div>
          <span>总发放佣金</span>
          <span>{{company_info.paid_commission_sum}}元</span>
        </div>
        <div>
          <span>实收总平台费</span>
          <span>{{company_info.platform_cost_sum}}元</span>
        </div>
        <div>
          <span>未发放佣金</span>
          <span>{{company_info.unpaid_commission_sum}}元</span>
        </div>
        <div>
          <span>总发放人数</span>
          <span>{{company_info.paid_e_count}}人</span>
        </div>
      </div>
    </div>
    <!-- 右边报表板块 -->
    <div id="report_info">
      <!-- t头部   -->
      <div class="report_info_top">
        <!-- 选择时间部分 -->
        <div>
          <span>时间选择</span>
          <el-date-picker
            v-model="monthValue"
            value-format="yyyy-MM-dd"
            type="daterange"
            @change="changeTime"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            :clearable="false"
          ></el-date-picker>
          <span @click="checkData">查询</span>
          <span @click="resetData">重置</span>
        </div>
        <!-- 图表部分 -->
        <ve-line :data="chartData" :settings="chartSettings" :colors="chartColor"></ve-line>
      </div>
      <!-- 底部 -->
      <div class="report_info_bottom clearfix">
        <div class="fl">
          <!-- <h3>客户维护信息</h3> -->
          <ul>
            <li
              v-for="(item,index) in projectTab"
              @click="handleClick(item,index)"
              :class="item==activeName?'active':''"
            >{{item}}</li>
          </ul>
          <div>
            <span>录入客户</span>
            <span>{{projectInfo.new_customer}}</span>
          </div>
          <div>
            <span>报备客户</span>
            <span>{{projectInfo.report_customer}}</span>
          </div>
          <div>
            <span>报备次数</span>
            <span>{{projectInfo.report_count}}</span>
          </div>
          <div>
            <span>带看客户</span>
            <span>{{projectInfo.look_customer}}</span>
          </div>
          <div>
            <span>带看次数</span>
            <span>{{projectInfo.look_count}}</span>
          </div>
          <div>
            <span>成交客户</span>
            <span>{{projectInfo.deal_count}}</span>
          </div>
          <div>
            <span>退筹/房</span>
            <span>{{projectInfo.unsubscribe_count}}</span>
          </div>
        </div>
        <div class="fl">
          <h3>员工结算信息</h3>
          <div>
            <span>结佣客户</span>
            <span>{{projectTimeDetail.commission_cust}}</span>
          </div>
          <div>
            <span>应收佣金</span>
            <span>{{projectTimeDetail.expected_commission}}</span>
          </div>
          <div>
            <span>实收佣金</span>
            <span>{{projectTimeDetail.actual_commission}}</span>
          </div>
          <div>
            <span>剩余佣金</span>
            <span>{{projectTimeDetail.remaining_commission}}</span>
          </div>
          <div>
            <span>发放佣金</span>
            <span>{{projectTimeDetail.issue_money}}</span>
          </div>
          <div>
            <span>实收平台管理费</span>
            <span>{{projectTimeDetail.platform_cost?projectTimeDetail.platform_cost:0}}</span>
          </div>
          <div>
            <span>发放人数</span>
            <span>{{projectTimeDetail.issue_employee?projectTimeDetail.issue_employee:0}}</span>
          </div>
        </div>
        <div class="fl">
          <el-tabs tab-position="top" style="height: 200px;">
            <el-tab-pane label="成交项目排名">
              <div
                v-for="(item,key) in projectRanking"
                class="clearfix"
                v-if="projectRanking.length !=0"
              >
                <span class="fl">{{item.b_name | limit2}}</span>
                <span class="fl">{{key+1}}</span>
                <span class="fl">
                  <i :style="'width:'+(item.b_count-0.0001)*100/projectRanking[0].b_count+'%'"></i>
                </span>
                <span class="fl">{{item.b_count}}</span>
              </div>
              <div v-if="projectRanking.length ==0">暂无数据</div>
            </el-tab-pane>
            <el-tab-pane label="成交顾问排名">
              <div
                v-for="(item,key) in employeeRanking"
                class="clearfix"
                v-if="projectRanking.length !=0"
              >
                <span class="fl">{{item.e_name | limit2}}</span>
                <span class="fl">{{key+1}}</span>
                <span class="fl">
                  <i :style="'width:'+(item.e_count-0.0001)*100/employeeRanking[0].e_count+'%'"></i>
                </span>
                <span class="fl">{{item.e_count}}</span>
              </div>
              <div v-if="projectRanking.length ==0">暂无数据</div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getCompanyData,
  getReportData,
  getReportDetail,
  getReportTimeRanking,
  getAllCompantInfo,
  getReportTimeDetail
} from "@/api/index";
export default {
  data() {
    this.chartSettings = {
      xAxisType: "time"
      // area: true
    };
    return {
      company_name: "",
      company_chose: [], //公司下拉选择
      company_info: {}, //公司信息
      monthValue: [],
      startTime: "", //选择的起始时间
      endTime: "", //选择的结束时间，默认的时间由于后台需要后一天，所以不能使用monthValue[1]
      chartColor: ["#35A0EC", "#FFA360", "#4EC776", "#F7749C"],
      chartData: {
        columns: ["日期", "录入客户", "报备客户", "带看客户", "成交客户"],
        rows: []
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now();
        },
        firstDayOfWeek: 1
      },
      projectInfo: {}, // 左下方表格
      projectTimeDetail:{},//右下角中间部分
      projectRanking: [], //右下角的tab1
      activeName: "合计",
      activeIndex: 0,
      projectTab: ["合计", "直销", "直营", "加盟", "渠道", "生态链"],
      employeeRanking: [] //右下角的tab2
    };
  },
  created() {
    this.getAllCompantInfo();
  },
  methods: {
    // 获得公司下拉
    getAllCompantInfo() {
      getAllCompantInfo({
        params: { dataAuth: true }
      }).then(res => {
        if (res.status == 200) {
          this.company_chose = res.data;
          // 页面打开默认的公司名字和id
          this.company_name =
            res.data[0].name.length > 10
              ? res.data[0].name.slice(0, 10) + "..."
              : res.data[0].name;
          this.companyID = res.data[0].id;
          this.defaultTime();
        } else {
          this.alertMessage("warning", res.message, 2000);
        }
      });
    },
    // 点击选择公司后
    choseCompany(val) {
      // 选择的公司名字
      this.company_name =
        val.name.length > 10 ? val.name.slice(0, 10) + "..." : val.name;
      // 选择公司的ID
      this.companyID = val.id;

      this.getCompanyData(); // 获得左边公司部分数据
      this.getReportData(); //获得报表信息
      this.getReportDetail(this.activeIndex); // 报表下面
      this.getReportTimeDetail();
      this.getReportTimeRanking(); //右下角排名
    },
    // 获得左边公司部分数据
    getCompanyData() {
      getCompanyData({ params: { id: this.companyID } }).then(res => {
        if (res.status == 200) {
          this.company_info = res.data;
        }
      });
    },
    // 改变选择的时间
    changeTime(val) {
      this.startTime = this.getBeforeDate(0, 1, val[0]);
      this.endTime = this.getBeforeDate(0, 2, val[1]);
    },
    // 默认进来的时间
    defaultTime() {
      // 前30天:this.getBeforeDate(30),当前日期this.getBeforeDate(0);
      this.monthValue = [this.getBeforeDate(30), this.getBeforeDate(0)];
      this.startTime = this.getBeforeDate(30, 1);
      this.endTime = this.getBeforeDate(0, 2);
      this.getCompanyData(); // 获得左边公司部分数据
      this.getReportData(); //获得默认的报表信息
      this.getReportDetail(this.activeIndex); // 报表下面
      this.getReportTimeDetail();
      this.getReportTimeRanking(); //右下角排名
    },
    // 封装的前多少天的方法
    getBeforeDate(n, type, day1) {
      let date;
      if (day1) {
        date = new Date(day1);
      } else {
        date = new Date();
      }
      let year, month, day;
      date.setDate(date.getDate() - n);
      year = date.getFullYear();
      month = date.getMonth() + 1;
      day = date.getDate();
      let s =
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day);
      if (type == 1) {
        s = s + " 00:00:00";
      } else if (type == 2) {
        s = s + " 23:59:59";
      }
      return s;
    },

    // 获得的报表的数据
    getReportData() {
      getReportData({
        params: {
          id: this.companyID,
          startAt: this.startTime,
          endAt: this.endTime
        }
      }).then(res => {
        if (res.status == 200) {
          this.chartData.rows = [];
          res.data.forEach(element => {
            let arr = {
              日期: element.the_day,
              录入客户: element.c_count,
              报备客户: element.bb_count,
              带看客户: element.dk_count,
              成交客户: element.cj_count
            };
            this.chartData.rows.push(arr);
          });
        } else {
          this.alertMessage("warning", res.message, 2000);
          return;
        }
      });
    },

    // 点击查询
    checkData() {
      this.getReportData();
      this.getReportDetail(this.activeIndex);
      this.getReportTimeDetail();
      this.getReportTimeRanking();
    },
    // 点击重置 == 也就是页面打开默认值
    resetData() {
      this.defaultTime();
    },

    // 报表下面
    getReportDetail(val) {
      getReportDetail({
        params: {
          id: this.companyID,
          startAt: this.startTime,
          endAt: this.endTime
        }
      }).then(res => {
        if (res.status == 200) {
          this.projectInfo = res.data[val];
          console.log(this.projectInfo);
        } else {
          this.alertMessage("warning", res.message, 2000);
          return;
        }
      });
    },
    // 右下角中间报表
    getReportTimeDetail() {
      getReportTimeDetail({
        params: {
          id: this.companyID,
          startAt: this.startTime,
          endAt: this.endTime
        }
      }).then(res => {
        if (res.status == 200) {
          this.projectTimeDetail = res.data;
          console.log(this.projectTimeDetail);
        } else {
          this.alertMessage("warning", res.message, 2000);
          return;
        }
      });
    },
    // 右下角排名
    getReportTimeRanking() {
      getReportTimeRanking({
        params: {
          id: this.companyID,
          startAt: this.startTime,
          endAt: this.endTime
        }
      }).then(res => {
        if (res.status == 200) {
          this.projectRanking = res.data.buildingRanking; //项目排名
          this.employeeRanking = res.data.employeeRanking; //项目排名
        } else {
          this.alertMessage("warning", res.message, 2000);
          return;
        }
      });
    },
    // 修改需求后---左下角第二个图表tab切换
    handleClick(tab, index) {
      this.activeName = tab;
      this.activeIndex = index;
      this.getReportDetail(this.activeIndex);
    }
  },
  filters: {
    limit1: function(str) {
      if (str) {
        return str.length > 25 ? str.slice(0, 25) + "..." : str;
      }
    },
    limit2: function(str) {
      if (str) {
        return str.length > 8 ? str.slice(0, 8) + "..." : str;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
#companyState {
  min-width: 1800px;
  #company_info {
    width: 240px;
    float: left;
    .company_info_top {
      box-sizing: content-box;
      .company_info_top_name {
        background: url("../../../assets/images/background.png") no-repeat 50%;
        background-size: 265px 120.5px;
        border-radius: 5px 5px 0 0;
        /deep/ .el-input__icon {
          line-height: 0;
        }
        /deep/ .el-input--suffix .el-input__inner {
          background-color: transparent;
          border: transparent;
          color: #fff;
          font-size: 17px;
          padding: 0;
        }
        /deep/ .el-select .el-input .el-select__caret {
          color: #fff;
          font-weight: 600;
          font-size: 17px;
        }

        /deep/ .el-select {
          padding: 8.5px 15px 0;
        }
        > p {
          margin-top: 5px;
          color: #ffebaf;
          padding: 0 15px;
          &:nth-of-type(2) {
            padding-bottom: 15px;
          }
        }
      }
      .company_info_content {
        background-color: #323242;
        padding: 10px;
        > div {
          width: 100%;
          height: 42px;
          line-height: 42px;
          text-align: center;
          > span {
            float: left;
            width: 50%;
            border: 1px solid #565662;
            border-right: 0;
            border-bottom: 0;
            color: #dedede;
            &:nth-last-of-type(1) {
              border-right: 1px solid #565662;
              background-color: #3a3a49;
            }
            &:nth-of-type(1) {
              background-color: #474755;
            }
          }
          &:nth-last-of-type(1) {
            span {
              border-bottom: 1px solid #565662;
            }
          }
        }
      }
    }
    .company_info_bottom {
      background-color: #323242;
      height: 353px;
      padding: 15px 10px;
      > div {
        width: 100%;
        height: 46px;
        line-height: 46px;
        text-align: center;
        > span {
          float: left;
          width: 50%;
          border: 1px solid #565662;
          border-right: 0;
          border-bottom: 0;
          color: #dedede;
          &:nth-last-of-type(1) {
            border-right: 1px solid#565662;
            background-color: #3a3a49;
          }
          &:nth-of-type(1) {
            background-color: #474755;
          }
        }
        &:nth-last-of-type(1) {
          span {
            border-bottom: 1px solid #565662;
          }
        }
      }
    }
  }
  #report_info {
    position: relative;
    float: left;
    height: 425px;
    min-width: 80%;
    margin-left: 17px;
    background-color: #fff;
    padding: 20px 10px;
    /deep/ .el-date-editor .el-range__icon,
    /deep/ .el-date-editor .el-range__close-icon {
      line-height: 0;
    }
    /deep/ .el-range-separator {
      line-height: initial;
    }
    /deep/ .el-date-editor--daterange.el-input__inner {
      height: 30px;
    }
    .report_info_top {
      > div {
        // 选择时间部分
        &:nth-of-type(1) {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 501;
          padding: 15px;
          > span {
            &:nth-of-type(1) {
              font-weight: 600;
              margin-right: 12px;
              font-size: 15px;
            }
            &:nth-of-type(2) {
              display: inline-block;
              width: 66px;
              height: 30px;
              line-height: 30px;
              text-align: center;
              background-color: #fda100;
              border-radius: 3px;
              color: #fff;
              margin-left: 10px;
            }
            &:nth-of-type(3) {
              display: inline-block;
              width: 66px;
              height: 30px;
              line-height: 30px;
              text-align: center;
              background-color: #d0d0d0;
              border-radius: 3px;
              color: #fff;
              margin-left: 10px;
            }
          }
        }
      }
    }
    .report_info_bottom {
      width: 101%;
      > div {
        background-color: #fff;
        height: 350px;
        margin-top: 23px;
        margin-left: -1%;
        padding: 10px 15px;
        width: 20%;
        &:nth-of-type(1) {
          ul {
            width: 100%;
            display: flex;
            li {
              flex: 1;
              text-align: center;
              color: #333;
              padding-bottom: 4px;
              margin-bottom: 5px;
              cursor: pointer;
            }
            .active {
              color: #fda100;
              border-bottom: 2px solid #fda100;
            }
          }
        }

        > h3 {
          font-weight: 600;
          margin-bottom: 10px;
        }
        > div {
          > span {
            // display: block;
            float: left;
            width: 50%;
            text-align: center;
            height: 42px;
            line-height: 42px;
            border: 1px solid #ddd;
            border-right: 0;
            border-bottom: 0;
            &:nth-last-of-type(1) {
              border-right: 1px solid #ddd;
            }
            &:nth-of-type(1) {
              background-color: #f2f2f6;
            }
          }
          &:nth-last-of-type(1) {
            span {
              border-bottom: 1px solid #ddd;
            }
          }
        }
        &:nth-of-type(2) {
          margin-left: 10px;
        }
        // 下面那个图表的
        &:nth-of-type(3) {
          min-width: 59.2%;
          margin-left: 12px;
          /deep/ .el-tabs__nav {
            margin-left: 230px;
          }
          /deep/ .el-tabs__item.is-active {
            color: #fda100;
          }
          /deep/ .el-tabs__active-bar {
            background-color: #fda100;
          }
          /deep/ .el-tabs__item:hover {
            color: initial;
          }
          /deep/ .el-tabs__content {
            padding: 0 10px;
          }
          /deep/ .el-tabs__header {
            margin-bottom: 8px;
          }
          /deep/ .el-tab-pane {
            width: 100%;
            > div {
              width: 100%;
              height: 28px;
              line-height: 28px;
              > span {
                border: 0;
                margin-right: 15px;
                &:nth-of-type(3) {
                  background-color: #ccc;
                  height: 8px;
                  width: 60%;
                  margin-top: 12px;
                  position: relative;
                  > i {
                    position: absolute;
                    top: 0;
                    left: 0;
                    background: linear-gradient(#42a9eb, #54daf2);
                    height: 8px;
                  }
                }
                &:nth-of-type(1) {
                  color: #333333;
                  width: 22%;
                  text-align: right;
                }
                &:nth-of-type(2) {
                  display: inline-block;
                  width: 16px;
                  height: 16px;
                  text-align: center;
                  line-height: 16px;
                  color: #fff;
                  font-size: 12px;
                  background-color: #adadad;
                  margin-top: 7px;
                }
              }
              &:nth-of-type(1) {
                > span {
                  &:nth-of-type(2) {
                    background-color: #fc807d;
                  }
                }
              }
              &:nth-of-type(2) {
                > span {
                  &:nth-of-type(2) {
                    background-color: #69b56c;
                  }
                }
              }
              &:nth-of-type(3) {
                > span {
                  &:nth-of-type(2) {
                    background-color: #72bde8;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>