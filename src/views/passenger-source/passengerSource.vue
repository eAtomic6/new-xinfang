<!-- 合同管理 -->
<template>
  <div class="content-txt" id="passengerSource">
    <!-- form表单 -->
    <div class="w-select">
      <el-form :inline="true" :model="formInline" class="demo-form-inline listForm">
        <el-form-item label="部门:">
          <el-input v-model="formInline.dealDepId" placeholder="请输入部门"></el-input>
        </el-form-item>
        <el-form-item label="转入人:">
          <el-input v-model="formInline.dealBy" placeholder="请输入转入人"></el-input>
        </el-form-item>
        <el-form-item label="客户进度:">
          <el-select v-model="formInline.dealTyp" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="登记" value="0"></el-option>
            <el-option label="跟进" value="1"></el-option>
            <el-option label="报备" value="2"></el-option>
            <el-option label="带看" value="3"></el-option>
            <el-option label="认筹" value="4"></el-option>
            <el-option label="认购" value="5"></el-option>
            <el-option label="草签" value="6"></el-option>
            <el-option label="网签" value="7"></el-option>
            <el-option label="结算" value="8"></el-option>
            <el-option label="退筹" value="9"></el-option>
            <el-option label="退房" value="10"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户级别:">
          <el-select v-model="formInline.dealTy" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="A级" value="0"></el-option>
            <el-option label="B级" value="1"></el-option>
            <el-option label="C级" value="2"></el-option>
            <el-option label="D级" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户状态:">
          <el-select v-model="formInline.dealT" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="有效" value="0"></el-option>
            <el-option label="暂缓" value="1"></el-option>
            <el-option label="已购" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="转联动:">
          <el-select v-model="formInline.deal" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="已转" value="0"></el-option>
            <el-option label="未转" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词:">
          <el-input v-model="formInline.keyWord" placeholder="请输入客户编号，客户电话，客户姓名" class="input-long"></el-input>
        </el-form-item>
        <span class="group-s">
          <el-form-item>
            <el-button type="primary" @click="onSearch" class="search-but">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onReset" class="chongzhi-but">重置</el-button>
          </el-form-item>
        </span>
      </el-form>
    </div>
    <!-- table表格 -->
    <el-table :data="financeData" style="width: 100%" class="el-table table-list" :row-key="getRowKeysCon" @row-click="rowClickCon" @expand-change="showDetailCon" :expand-row-keys="expandscon" @row-dblclick="rowDblclickCon">
      <el-table-column type="expand" width="5">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand click-table-row">
            <div class="fl w-list01">
              <div class="list-box">
                <p class="mr5 fw-b black-g">张三</p>
                <p>[ITKH0123456]</p>
                <p>
                  [中房网]
                </p>
                <p>
                  <span>C级客户</span>
                  <span class="ml5 xiao">有效</span>
                </p>
              </div>
            </div>
            <div class="fl w-list02">
              <div class="list-box">
                <p class="mr5 fw-b black-g">客户意向
                </p>
                <p>
                  武昌区-中北路
                </p>
                <p>凯德1818中心</p>
                <p>
                  <span class="mr10">100-200万</span><span class="mr10">150-180㎡</span>3室
                </p>
              </div>
            </div>
            <div class="fl w-list03">
              <div class="list-box">
                <p class="mr5 fw-b black-g">跟进维护</p>
                <p>转  入  人:
                  王兰-杨卓团队  2017-08-18  18:55
                </p>
                <p>
                  联动专员:
                 王兰-杨卓团队
                </p>
              </div>
            </div>
            <div class="fl w-list04">
              <div class="list-box">
                <p>最后报备时间：2017-08-18 18:55</p>
                <p>最后带看时间：2017-08-18 18:55</p>
              </div>
            </div>
            <div class="fl w-list05">
              <div class="list-box">
                <span class="mt15 but-lightblue">
                  <i class="mr10 el-icon-edit-outline"></i>报 备</span>
                <span class="mt10 but-lightblue">
                  <i class="mr10 el-icon-edit-outline"></i>写 跟 进</span>
                <span class="mt10 but-lightblue">
                  <i class="mr10 el-icon-edit-outline"></i>指定联动专员</span>
              </div>
            </div>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="序号" width="80">
      </el-table-column>
      <el-table-column prop="cName" label="客户编号" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="bName" label="客户姓名" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="housePrice" label="意向项目" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="type" label="价格区间" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="ownerName" label="转入人" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="lockStartTime" label="转入时间" width="160">
      </el-table-column>
      <el-table-column prop="dealByName" label="联动专员" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="dealTime" label="最后带看时间" width="160">
      </el-table-column>
      <el-table-column prop="accountingByName" label="最后报备时间" show-overflow-tooltip>
      </el-table-column>
      <div slot="empty" class="list-empty">
        <img src="../../assets/images/empty.png" alt="">
        <p class="desc">暂无数据</p>
      </div>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[ 5 , 10, 20, 30, 40]" :page-size="pageSize" layout="prev, pager, next,total, sizes, jumper" :total="userListTotal" v-show="financeData.length!=0&&userListTotal>pageSize">
    </el-pagination>
    <!-- Form -->

    <!-- 双击-客户明细 -->
    <el-dialog title="客户明细" :visible.sync="clientDetails" class="client-details" top="40px">
      <div class="fl left">
        <div class="field-tit">
          <div class="ileft">基本信息</div>
          <div class="iright">
            <a href="javascript:" class="but-lightblue mr10">
              <i class="mr10 el-icon-edit-outline"></i>编辑</a>
          </div>
        </div>
        <div class="field-row">
          <div class="ileft">项目编号:</div>
          <div class="iright">FYBM170515005</div>
        </div>
        <div class="field-row">
          <div class="ileft">锁定状态:</div>
          <div class="iright">
            <div class="lockbox js-affirm-layer">
              <div class="lockbox-handle"></div>
            </div>
            <div class="lock-text">未锁定</div>
          </div>
        </div>
        <div class="field-row">
          <div class="ileft">客户状态:</div>
          <div class="iright">
            <span class="client-tag">C级客户</span>
            <span class="client-tag">有效</span>
            <span class="client-tag">锁定</span>
          </div>
        </div>
        <div class="field-row">
          <div class="ileft">客户来源:</div>
          <div class="iright">网络-中房网</div>
        </div>
        <div class="field-row">
          <div class="ileft">客户备注:</div>
          <div class="iright">武汉市武昌区楚河汉街铁建集团凯德1818中心</div>
        </div>
        <div class="field-tit">
          <div class="ileft">客户意向</div>
          <div class="iright"></div>
        </div>
        <div class="field-row2">
          <div class="ileft">价格区间:</div>
          <div class="iright">100-200万</div>
        </div>
        <div class="field-row2">
          <div class="ileft">面积区间:</div>
          <div class="iright">100-200㎡</div>
        </div>
        <div class="field-row2">
          <div class="ileft">意向户型:</div>
          <div class="iright">3室</div>
        </div>
        <div class="field-row2">
          <div class="ileft">居住人数:</div>
          <div class="iright">3人</div>
        </div>
        <div class="field-row2">
          <div class="ileft">意向区域:</div>
          <div class="iright">武昌区-中北路</div>
        </div>
        <div class="field-row2">
          <div class="ileft">意向项目:</div>
          <div class="iright">铁建集团凯德1818</div>
        </div>
        <div class="field-row2">
          <div class="ileft">购房意愿:</div>
          <div class="iright">很有意愿</div>
        </div>
        <div class="field-row2">
          <div class="ileft">购房目的:</div>
          <div class="iright">自住</div>
        </div>
        <div class="field-tit">
          <div class="ileft">客户意向</div>
          <div class="iright"></div>
        </div>
        <div class="field-row2">
          <div class="ileft">转
            <em></em>入
            <em></em>信
            <em></em>息:</div>
          <div class="iright">杨卓团队-田丽<br/> 2017-08-12 19:00</div>
        </div>
        <div class="field-row2">
          <div class="ileft">联
            <em></em>动
            <em></em>专
            <em></em>员:</div>
          <div class="iright">程娜娜-张三</div>
        </div>
        <div class="field-row2">
          <div class="ileft">最后带看人:</div>
          <div class="iright">杨卓团队-田丽<br/> 2017-08-12 19:00</div>
        </div>
      </div>
      <div class="fl right">
        <div class="progress-top">
          <div class="list-box">
            <ul>
              <li class="on">
                <em class="c-big">
                  <em class="c-small"></em>
                </em>
                <p>登记</p>
              </li>
              <li class="on">
                <em class="c-big">
                  <em class="c-small"></em>
                </em>
                <p>跟进</p>
              </li>
              <li class="on">
                <em class="c-big">
                  <em class="c-small"></em>
                </em>
                <p>报备</p>
              </li>
              <li class="on">
                <em class="c-big">
                  <em class="c-small"></em>
                </em>
                <p>带看</p>
              </li>
              <li class="on">
                <em class="c-big">
                  <em class="c-small"></em>
                </em>
                <p>认购</p>
              </li>
              <li>
                <em class="c-big">
                  <em class="c-small"></em>
                </em>
                <p>草签</p>
              </li>
              <li>
                <em class="c-big">
                  <em class="c-small"></em>
                </em>
                <p>网签</p>
              </li>
              <li>
                <em class="c-big">
                  <em class="c-small"></em>
                </em>
                <p>结算</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="ml15 mr15 mt20">
          <a href="javascript:" class="but-yellow mr10">
            <i class="icon icon-zengjia mr5"></i>新增跟进</a>
          <a href="javascript:" class="but-yellow mr10">
            <i class="icon icon-zengjia mr5"></i>新增报备</a>
          <a href="javascript:" class="but-yellow mr10">
            <i class="icon icon-zengjia mr5"></i>新增带看</a>
          <a href="javascript:" class="but-yellow mr10">
            <i class="icon icon-zengjia mr5"></i>指定联动专员</a>
          <div class="clearfix"></div>
          <el-form :model="commission" :rules="rules" ref="commission" label-width="44px" class="mt10">
            <el-table :data="data" class="addwrap">
              <el-table-column>
                <template slot-scope="scope">
                  <el-input v-model="data[scope.$index].personnel" class="fl mr10 td-two" placeholder="姓名"></el-input>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-input v-model="data[scope.$index].proportion" class="small-input" placeholder="手机号码"></el-input>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-select v-model="data[scope.$index].cata" placeholder="本人" class="fl mr10">
                    <el-option label="本人" value="luru"></el-option>
                    <el-option label="丈夫" value="weihu"></el-option>
                    <el-option label="妻子" value="zhuanru"></el-option>
                    <el-option label="亲属" value="chengjiao"></el-option>
                    <el-option label="父亲" value="qita"></el-option>
                    <el-option label="母亲" value="qita"></el-option>
                    <el-option label="儿子" value="qita"></el-option>
                    <el-option label="女儿" value="qita"></el-option>
                    <el-option label="其他" value="qita"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <span @click="add(scope.$index)" class="fl ml5 button">
                    <i class="el-icon-plus"></i>
                  </span>
                  <span @click="deleteRow(scope.$index)" class="fl ml5 button">
                    <i class="el-icon-minus"></i>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
          <el-tabs type="border-card" class="mt20 tab-switch">
            <!-- 跟进记录 -->
            <el-tab-pane label="跟进记录">
              <el-table :data="data1" style="width: 100%" class="mt10 table-list table-box">
                <el-table-column prop="operattime" label="操作时间" width="140">
                </el-table-column>
                <el-table-column prop="functionname" label="跟进类型" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="content" label="跟进目的" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="content" label="目的描述" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="operator" label="操作人" show-overflow-tooltip>
                </el-table-column>
                <div slot="empty" class="list-empty">
                  <img src="../../assets/images/empty.png" alt="">
                  <p class="desc">暂无数据</p>
                </div>
              </el-table>
            </el-tab-pane>
            <!-- 报备记录 -->
            <el-tab-pane label="报备记录">
              <el-table :data="data2" style="width: 100%" class="mt10 table-list table-box">
                <el-table-column prop="operattime" label="操作时间" width="140">
                </el-table-column>
                <el-table-column prop="functionname" label="报备项目" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="content" label="报备状态" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="operator" label="操作人" show-overflow-tooltip>
                </el-table-column>
                <div slot="empty" class="list-empty">
                  <img src="../../assets/images/empty.png" alt="">
                  <p class="desc">暂无数据</p>
                </div>
              </el-table>
            </el-tab-pane>
            <!-- 带看记录 -->
            <el-tab-pane label="带看记录">
              <el-table :data="data3" style="width: 100%" class="mt10 table-list table-box">
                <el-table-column prop="operattime" label="操作时间" width="140">
                </el-table-column>
                <el-table-column prop="functionname" label="带看项目" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="content" label="带看状态" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="operator" label="操作人" show-overflow-tooltip>
                </el-table-column>
                <div slot="empty" class="list-empty">
                  <img src="../../assets/images/empty.png" alt="">
                  <p class="desc">暂无数据</p>
                </div>
              </el-table>
            </el-tab-pane>
            <!-- 操作记录 -->
            <el-tab-pane label="操作记录">
              <el-table :data="data4" style="width: 100%" class="mt10 table-list table-box">
                <el-table-column prop="operattime" label="操作时间" width="140">
                </el-table-column>
                <el-table-column prop="functionname" label="功能名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="content" label="内容" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="operator" label="操作人" show-overflow-tooltip>
                </el-table-column>
                <div slot="empty" class="list-empty">
                  <img src="../../assets/images/empty.png" alt="">
                  <p class="desc">暂无数据</p>
                </div>
              </el-table>

            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
// import { contractManagement, contractManagementClick } from "@/api/index";
export default {
  data() {
    return {
      //form区域对应字段
      formInline: {
        dealDepId: "",
        dealBy: "",
        dealType: "",
        dealTimeStart: "",
        dealTimeEnd: "",
        keyword: ""
      },
      // financeData: [], // 666合同管理table表格中的数据
      //行数据的 Key
      getRowKeysCon(row) {
        return row.id;
      }, //Table 目前的展开行
      expandscon: [],
      //分页
      userListTotal: 0, //分页-总条数
      pageNum: 1, //分页-table默认页
      pageSize: 10, //分页-每页默认的显示数目
      clientDetails: false, //客户明细弹层

      ///smdnfg
      financeData: [
        {
          id: "1",
          cName: "2",
          bName: "张三",
          housePrice: "上海市普陀区金沙江路 1518 弄",
          type: "225",
          ownerName: "李四",
          lockStartTime: "2016-05-02",
          dealByName: "王五",
          dealTime: "2016-05-02",
          accountingByName: "2016-05-02"
        },
        {
          id: "2",
          cName: "2",
          bName: "张三",
          housePrice: "上海市普陀区金沙江路 1518 弄",
          type: "225",
          ownerName: "李四",
          lockStartTime: "2016-05-02",
          dealByName: "王五",
          dealTime: "2016-05-02",
          accountingByName: "2016-05-02"
        }
      ],
      data1: [],
      data2: [],
      data3: [],
      data4: [],
      //renyuan 人员的添加
      data: [
        {
          personnel: "1",
          department: "朱先生",
          proportion: "12454"
        }
      ] //分佣比例行的添加
    };
  },
  created() {
    // 调用获取table列表数据方法
    //this.getList();
  },
  methods: {
    // 单击每行事件
    rowClickCon(row, event, column) {
      //点击行 展开
      // this.tableDataId = row.id; //点击表格的id
      // this.getListClick();
      let index = this.expandscon.indexOf(row.id);
      if (index > -1) {
        this.expandscon = this.expandscon.splice(index, -1);
      } else {
        this.expandscon = [];
        this.expandscon.push(row.id);
      }
    },
    //控制只显示当前一行
    showDetailCon(rowdata, expandedRows) {
      if (expandedRows.length) {
        this.expandscon = [];
        if (rowdata) {
          this.expandscon.push(rowdata.id);
        }
      } else {
        this.expandscon = [];
      }
    },
    // 双击行展开
    rowDblclickCon() {
      this.clientDetails = true;
    },
    //分页
    handleSizeChange(val) {
    },
    handleCurrentChange(val) {
    },
    //查询按钮
    onSearch() {}, //重置按钮
    onReset() {},

    //人员的添加
    add() {
      this.data.push({});
    },
    //人员的删除
    deleteRow(index) {
      this.data.splice(index, 1);
    }
  }
};
</script>
<style lang='scss'>
#passengerSource {
  margin-top: 10px;
  .client-details .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #fff;
    cursor: default;
  }
 .click-table-row {
    padding: 5px 20px 8px;
    cursor: pointer;
    text-align: left;
    overflow: hidden;
    .but-lightblue{
width: 125px;
height: 26px;
line-height: 26px;
text-align:center;
padding: 0;
}
}
  .list-box {
    text-align: left;
  }
  .w-list01 {
    margin-left: 1%;
    width: 14%;
    span {
      display: inline-block;
      height: 26px;
      line-height: 26px;
      padding: 0 6px;
      color: #78a97a;
      border: 1px solid #78a97a;
      background: #fff;
      &.xiao {
        border: 1px solid #fa7a58;
        color: #fa7a58;
      }
    }
  }
  .w-list02 {
    display: table-cell;
    margin-left: 0.3%;
    width: 22%;
  }
  .w-list03 {
    margin-left: 0.3%;
    width: 26%;
    img {
      width: 120px;
      height: 90px;
    }
  }
  .w-list04 {
    margin: 30px 0.3% 0 0;
    width: 20%;
    em {
      display: inline-block;
      border-radius: 50%;
    }
    ul li {
      position: relative;
      float: left;
      width: 13%;
      text-align: center;
      .c-big {
        z-index: 3;
        position: relative;
        width: 32px;
        height: 32px;
        background: #dedede;
        text-align: center;
      }
      .c-small {
        margin-top: 5px;
        width: 21px;
        height: 21px;
        background: #9b9b9b;
      }
      .c-name {
        margin-top: 5px;
        font-size: 12px;
        line-height: 22px;
      }
      .c-time {
        color: #999;
        font-size: 12px;
      }
      &:before {
        z-index: 1;
        content: "";
        display: block;
        position: absolute;
        top: 46px;
        left: -50px;
        width: 100%;
        height: 1px;
        background: #9b9b9b;
      }

      &.on {
        .c-big {
          background: #ffdcb0;
        }
        .c-small {
          background: #fd8f00;
        }
        &:before {
          background: #fd8f00;
        }
      }
      &:first-child:before {
        background: none;
      }
    }
  }
  .w-list05 {
    // display: table-cell;
    // margin-left: 0.3%; //width: 7%;
    width: 125px;
    // position: absolute;
    // right: 0;
    .list-box {
    display: table-cell;
}

  }
}
//合同明细
.client-details {
  .el-dialog {
    width: 910px;

    height: 810px;
  }
  .client-tag {
    display: inline-block;

    padding: 0 6px;

    height: 26px;

    border: 1px solid #78a97a;

    background: #fff;

    color: #78a97a;

    line-height: 26px;
  }

  .el-dialog__body {
    padding: 0;

    color: #333;
    .el-tabs--border-card {
      border: 0;

      box-shadow: 0 0 0;
    }
    .el-tabs--border-card > .el-tabs__header {
      border: 0;

      background-color: #e8e8ee;

      line-height: 0;
      .el-tabs__item {
        margin: 0px -2px 0;

        border: 2px solid transparent;
        color: #333;
        &.is-active {
          border-top: 2px solid #fda100;

          border-right-color: #dcdfe6;

          border-left-color: #dcdfe6;
        }
      }
    }
    .san-four {
      display: inline-block;
      width: 2px;
    }

    .nav-tit {
      clear: both;
      height: 30px;

      text-indent: 10px;

      font-weight: bold;

      line-height: 30px;
    }
    .left {
      width: 300px;

      height: 770px;

      background: #e6e6e9;
      .field-tit {
        overflow: hidden;

        margin-bottom: 10px;

        height: 45px;
        border-bottom: 1px #d8d8d8 solid;
        .ileft,
        .iright {
          float: left;

          width: 50%;

          height: 45px;

          line-height: 45px;
        }
        .ileft {
          text-indent: 1em;
          font-weight: bold;
        }
        .iright {
          text-align: right;
        }
      }
      .field-row {
        clear: both;

        overflow: hidden;

        min-height: 30px;
        .ileft,
        .iright {
          float: left;

          line-height: 30px;
        }
        .ileft {
          padding: 0 8px;

          color: #999;
        }
        .iright {
          width: 220px;
        }
      }
      .field-row2 {
        clear: both;

        overflow: hidden;

        min-height: 30px;
        em {
          display: inline-block;

          width: 5px;
        }
        .ileft,
        .iright {
          float: left;

          line-height: 30px;
        }
        .ileft {
          padding: 0 8px;

          color: #999;
        }
        .iright {
          max-width: 150px;
        }
      }
    }
    .right {
      width: 610px;
      overflow: auto;
      height: 770px;
      .form-row .tit {
        width: 65px;
      }
      .form-row .row {
        padding-left: 65px;
      }
      .switch-main {
        margin: 10px auto;
        width: 530px;
      }
      .box-item {
        clear: both; // height: 30px;
        .table-list {
          width: 530px;
          th,
          td {
            text-align: center;
            white-space: normal;
          }
        }
        .item-row {
          .ileft,
          .iright {
            float: left;

            height: 30px;

            line-height: 30px;
          }
          .ileft {
            padding: 0 8px;
            width: 120px;

            color: #999;

            text-align: right;
          }
          .iright {
            width: 380px;
          }
        }
        .item-row2 {
          overflow: hidden;
          .item {
            float: left;
            overflow: hidden;

            width: 50%;

            height: 30px;
            .ileft,
            .iright {
              float: left;

              height: 30px;

              line-height: 30px;
            }
            .ileft {
              padding: 0 8px;
              width: 35%;

              color: #999;

              text-align: right;
            }
            .iright {
              width: 65%;
            }
          }
        }
        .item-row1 {
          overflow: hidden;
          .item {
            float: left;
            overflow: hidden;

            width: 100%;

            height: auto;
            .ileft,
            .iright {
              float: left;

              height: 30px;

              line-height: 30px;
            }
            .ileft {
              padding: 0 8px;
              width: 17.5%;

              color: #999;

              text-align: right;
            }
            .iright {
              width: 82.5%;

              height: auto;
            }
          }
        }
        .h-auto {
          height: auto;
        }
      }
      .icon-addNew {
        font-size: 14px;
      }
    }
  }
  .progress-top {
    border-bottom: 1px solid #e6e6e9;
    .list-box {
      overflow: hidden;

      margin: 30px auto 0;

      padding-bottom: 20px;
      width: 90%;
      ul li {
        width: 12.5%;
        &.on .c-big {
          background: #ffdcb0;
        }
        &.on .c-small {
          background: #fd8f00;
        }
        &.on:before {
          background: #fd8f00;
        }
        &:first-child:before {
          background: none;
        }
        &.on p {
          color: #666;
        }
        &:before {
          top: 10px;

          left: -33px;

          background: #e0e0e0;
        }
        .c-big {
          width: 20px;

          height: 20px;

          background: #f5f5f5;
        }
        .c-small {
          margin-top: 4px;

          width: 12px;

          height: 12px;

          background: #e0e0e0;
        }
        p {
          color: #ccc;
        }
      }
    }
  }
  .el-tabs--border-card > .el-tabs__content {
    padding: 0;
  }
  .addwrap {
    .el-select {
      .el-input__icon {
        line-height: 30px;
        height: auto;
      }
      .el-icon-arrow-up:before {
        content: "\E60C";
        color: #575757;
      }
    }
    .button {
      display: inline-block;
      padding: 0;
      width: 30px;
      height: 30px;
      line-height: 30px;
      background: #c8c8c8;
      border-radius: 50%;
      text-align: center;
      cursor: pointer;
      i {
        color: #fff;
        font-weight: bold;
      }
    }
    .el-button + .el-button {
      margin-left: 10px;
    }
    .cell {
      padding: 0 5px;
      color: #333;
      font-weight: normal;
    }
    .el-table__header-wrapper {
      height: 0;
    }
    &.el-table:before {
      background: #fff;
      height: 0;
    }
    &.el-table th {
      padding: 0;
      height: 0;
      border: 0;
    }
    .el-table td {
      border-bottom: 0;
    }
    &.el-table tr:first-child td:last-child {
      span:last-child {
        display: none;
      }
    }
  }
}
</style>