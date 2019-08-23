<template>
    <div class="app">
        <div class="headers">
            <span>制作分销结佣明细表</span>
            <p>
                <el-button>X</el-button>
            </p>
        </div>
         <div class="saleForm_top">
      <ul>
        <li :class="stepOne">选择分销结佣订单</li>
        <li :class="stepTwo"> 上传专票、支出证明单</li>
        <li :class="stepThree"> 制作分销结佣明细表</li>
        <li :class="stepFour">提交分销结佣明细表</li>
      </ul>
    </div>
        <div class="dll" v-if="step ==1" >
            11
        <div>
            <p v-show="showTopTitleTip">
            <i class="el-icon-info"></i>
            <span v-html="topTitleTip"></span>
            </p>
        </div>
        <div>
            
            <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;"
      highlight-current-row
      @current-change="rowChange"
      heigth="250"
      border
      class="newStyle"
    >
      <el-table-column label="序号" width="60" type="number">
          <template slot-scope="scope">
          <span :class="{newColor:scope.row.isSelected}"> </span>
        </template>
      </el-table-column>
      <el-table-column label="编号" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.name">{{scope.row.name}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
       <el-table-column label="项目名称" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.building_price">{{scope.row.building_price}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
       <el-table-column label="分销单位" width="170">
        <template slot-scope="scope">
          <span v-if="scope.row.building_price">{{scope.row.building_price}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
       <el-table-column label="审核状态" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.building_price">{{scope.row.building_price}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column> <el-table-column label="经纪人" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.building_price">{{scope.row.building_price}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column> <el-table-column label="提交人姓名" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.building_price">{{scope.row.building_price}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column> <el-table-column label="提交人电话" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.building_price">{{scope.row.building_price}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column> <el-table-column label="提交审核时间" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.building_price">{{scope.row.building_price}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="收佣客户数" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.building_price">{{scope.row.building_price}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="最早成交时间" width="120">
        <template slot-scope="scope">
          <span
            v-if="scope.row.province || scope.row.city || scope.row.area"
          >{{scope.row.province}}-{{scope.row.city}}-{{scope.row.area}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="最早草签时间" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.money_unit">{{scope.row.money_unit}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="最早网签时间" width="110" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.money_des">{{scope.row.money_des}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="本次应结佣金" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.building_property">{{scope.row.building_property}}</span>
          <span v-else>
            <i class="el-icon-minus" style="font-weight:600"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="本次实付佣金" width="110">
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

        </div>
        </div>
        <div class="bll" v-if="step ==2">
            <div>
                <p>已经选择结佣订单:【JYMX20181101001】、【JYMX20181101002】</p>
            </div>
              <div class="bodys">
            <div>
                <span>请上传渠道公司所开专票 : </span>
                <p>
                   <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible" size="tiny">
                    </el-dialog>
                </p>
            </div>
            <div>
                <span>请上传支出证明单 : </span>
                <p>
                   <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible" size="tiny">
                    </el-dialog>
                </p>
            </div>
            </div>
        </div>
        <div class="all" v-if="step ==3">
            <div class="sizes">
                <p>姓名 ：{{this.name}}</p>
                <p>日期 ：{{this.time}}</p>
            </div>
                <el-table
                :data="tableData"
                border
                style="width: 1750px">
                <el-table-column label="2019年7月份结佣明细表">
                    <el-table-column>
                        <el-table-column
                            label='序号'
                            type="index"
                            width="50">
                            </el-table-column>
                            <el-table-column
                            property="date"
                            label="类型"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            property="name"
                            label="接收日期"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            property="address"
                            label="项目名称">
                            </el-table-column>
                            <el-table-column
                            label='认购时间'
                            type="index"
                            width="50">
                            </el-table-column>
                            <el-table-column
                            property="date"
                            label="客户姓名"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            property="name"
                            label="房号"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            property="address"
                            label="结佣金额">
                            </el-table-column>
                            <el-table-column
                            label='分销公司'
                            type="index"
                            width="100">
                            </el-table-column>
                            <el-table-column
                            property="jie"
                            label="结佣"
                            width="70">
                            <template slot-scope="scope">
                                <div class="h-20" v-for="(item,index) in scope.row.fun" :key="index" v-if="scope.row.jieIndex===index" @click="jieClick(index,scope.row,scope.$index)">{{item}}</div>
                            </template>
                            </el-table-column>
                            <el-table-column
                            property="fa"
                            label="发票"
                            width="70">
                            <template slot-scope="scope">
                                <div class="h-20" v-for="(item,index) in scope.row.fun" :key="index" v-if="scope.row.faIndex===index" @click="jieClick2(index,scope.row,scope.$index)">{{item}}</div>
                            </template>
                            </el-table-column>
                            <el-table-column
                            property="cheng"
                            label="成交"
                            width="70">
                            <template slot-scope="scope">
                                <div class="h-20" v-for="(item,index) in scope.row.fun" :key="index" v-if="scope.row.chengIndex===index" @click="jieClick3(index,scope.row,scope.$index)">{{item}}</div>
                            </template>
                            </el-table-column>
                            <el-table-column
                            property="he"
                            label="合同"
                            width="70">
                            <template slot-scope="scope">
                                <div class="h-20" v-for="(item,index) in scope.row.fun" :key="index" v-if="scope.row.heIndex===index" @click="jieClick4(index,scope.row,scope.$index)">{{item}}</div>
                            </template>
                            </el-table-column>
                            <el-table-column
                            property="zheng"
                            label="政策"
                            width="70">
                            <template slot-scope="scope">
                                <div class="h-20" v-for="(item,index) in scope.row.fun" :key="index" v-if="scope.row.zhengIndex===index" @click="jieClick5(index,scope.row,scope.$index)">{{item}}</div>
                            </template>
                            </el-table-column>
                            <el-table-column
                            property="name"
                            label="情况说明"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            property="address"
                            label="备注">
                            </el-table-column>
                        </el-table-column>
                </el-table-column>
            </el-table>
            <p class="fontSizes">结佣总金额：90000元</p>
        </div>
        <div class="cll" v-if="step ==4">
            <div>
                <p>编号【FXJY20190102001】2019年7月份结佣明细表已制作成功</p>
                <p>你可以马上打印了！</p>
            </div>
            <div>
                <ul>
                    <li>• 分销结佣明细表提交成功后，你可以在结佣审核->分销结佣列表查看。</li>
                    <li>• 提交的分销结佣明细表无法撤回，你可以在分销结佣列表中修改。</li>
                </ul>
            </div>
        </div>
        <p class="buttons" v-if="this.step < 5">
            <el-button type="primary" @click="closeDialog" v-if="this.step == 1">取消</el-button>
            <el-button type="primary" @click="closeDialog" v-if="this.step == 2">上一步</el-button>
            <el-button type="primary" @click="closeDialog" v-if="this.step == 3">上一步</el-button>
            <el-button type="primary" @click="closeDialog" v-if="this.step == 4">完成</el-button>
            <el-button type="primary" @click="firstNext" v-if="this.step < 3">下一步</el-button>
            <el-button type="primary" @click="firstNext" v-if="this.step == 3">确认提交</el-button>
            <el-button type="primary" @click="firstNext" v-if="this.step == 4">下载打印</el-button>
        </p>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                topTitleTip:"！请先选择制作分销结佣明细表的订单！",
                showTopTitleTip:true,
                step:'',     // 步骤储存
                stepOne: "", // 第一步
                stepTwo: "", // 第二步
                stepThree: "", // 第三步
                stepFour: "", // 第四步
                name:'周小虎',
                time:'2017-3-5', 
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄',
                    jie:'',
                    fa:'',
                    cheng:'',
                    he:'',
                    zheng:'',
                    fun:['','√','X','/'],
                    jieIndex: 0,
                    faIndex: 0,
                    chengIndex: 0,
                    heIndex: 0,
                    zhengIndex: 0,
                    }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄',
                    jie:'',
                    fa:'',
                    cheng:'',
                    he:'',
                    zheng:'',
                    fun:['','√','X','/'],
                    jieIndex: 0,
                    faIndex: 0,
                    chengIndex: 0,
                    heIndex: 0,
                    zhengIndex: 0,
                    }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄',
                    jie:'',
                    fa:'',
                    cheng:'',
                    he:'',
                    zheng:'',
                    fun:['','√','X','/'],
                    jieIndex: 0,
                    faIndex: 0,
                    chengIndex: 0,
                    heIndex: 0,
                    zhengIndex: 0,
                    }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄',
                    jie:'',
                    fa:'',
                    cheng:'',
                    he:'',
                    zheng:'',
                    fun:['','√','X','/'],
                    jieIndex: 0,
                    faIndex: 0,
                    chengIndex: 0,
                    heIndex: 0,
                    zhengIndex: 0,
                    }],
                    currentRow: null,
                        }
        },
        created() {
            this.headCssChange(3)
        },
        methods: {
            jieClick(i,row,index) {
                console.log(i,row,index,111111111111111);
                if(i === row.fun.length-1){
                    row.jieIndex = 0
                    return
                }
                row.jieIndex = i+1
            },
            jieClick2(i,row,index) {
                console.log(i,row,index,2222222222222222222222);
                if(i === row.fun.length-1){
                    row.faIndex = 0
                    return
                }
                row.faIndex = i+1
            },
            jieClick3(i,row,index) {
                if(i === row.fun.length-1){
                    row.chengIndex = 0
                    return
                }
                row.chengIndex = i+1
            },
            jieClick4(i,row,index) {
                if(i === row.fun.length-1){
                    row.heIndex = 0
                    return
                }
                row.heIndex = i+1
            },
            jieClick5(i,row,index) {
                if(i === row.fun.length-1){
                    row.zhengIndex = 0
                    return
                }
                row.zhengIndex = i+1
            },
            // 上一步
            closeDialog(){
                this.step = this.step -1
                console.log(this.step,'后退',1111111111111111111111111);
                this.headCssChange(this.step)
            },
            // 下一步
            firstNext(){
                this.step = this.step +1
                console.log(this.step,'前进',1111111111111111111111111);
                this.headCssChange(this.step)
            },
          headCssChange(count) {
              this.step = count
            switch (count) {
                case 1:
                this.stepOne = "activeColor";
                this.stepTwo = "activeColorN";
                this.stepThree = "activeColorN";
                this.stepFour = "activeColorN";
                break;
                case 2:
                this.stepOne = "activeColor";
                this.stepTwo = "activeColor";
                this.stepThree = "activeColorN";
                this.stepFour = "activeColorN";
                break;
                case 3:
                this.stepOne = "activeColor";
                this.stepTwo = "activeColor";
                this.stepThree = "activeColor";
                this.stepFour = "activeColorN";
                break;
                case 4:
                this.stepOne = "activeColor";
                this.stepTwo = "activeColor";
                this.stepThree = "activeColor";
                this.stepFour = "activeColor";
                break;
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
.fontSizes{
    font-size: 20px;
    display: block;
    margin-left: 1500px;
    margin-top: 30px;
    font-weight:800;
}
.activeColorN {
    border-color: transparent transparent transparent #47af6e !important;
    // color: #fff;
    padding-left: 15px;
      &::before {
          content: "";
          width: 0;
          height: 0;
          border-left: 20px solid #fff;
          border-top: 31px solid transparent;
          border-bottom: 30px solid transparent;
          position: absolute;
          top: 0;
          left: 0px;
          z-index: 1;
        }
      &::after{
           content: "";
          width: 0;
          height: 0;
          border-left: 20px solid #ddd;
          border-top: 31px solid transparent;
          border-bottom: 30px solid transparent;
          position: absolute;
          top: 0;
          right: -20px;
          z-index: 2;
      }
  
  }
.activeColor {
    background-color: #47af6e !important;
    color: #fff;
    padding-left: 15px;
     &::after {
          content: "";
          width: 0;
          height: 0;
          border-left: 20px solid #47af6e;
          border-top: 31px solid transparent;
          border-bottom: 30px solid transparent;
          position: absolute;
          top: 0;
          right: -20px;
          z-index: 2;
        }
         &::before {
          content: "";
          width: 0;
          height: 0;
          border-left: 20px solid #fff;
          border-top: 31px solid transparent;
          border-bottom: 30px solid transparent;
          position: absolute;
          top: 0;
          left: 0px;
          z-index: 1;
        }
  
  }
.saleForm_top {
    // width: 100%;
    // height: 60px;
    text-align: center;
    > ul {
      margin: 0 auto;
      width: 740px;
      height: 62px;
      position: relative;
      > li {
      margin-right: 10px;
        float: left;
        position: relative;
        width: 170px;
        height: 61px;
        text-align: center;
        line-height: 61px;
        background-color: #ddd;
        &:nth-last-child(1){
            &::after{
                content:"";
              border-left: 20px solid #fff;
            }
        }
        &:nth-of-type(1){
            &::before{
                content:"";
              border-left: 20px solid #47af6e;
            }
        }
      }
    }
    > div {
      margin-bottom: 44px;
      margin-top: 21px;
      i {
        color: #5a9ef2;
        font-size: 19px;
      }
      span {
        color: #ff5438;
        margin-left: 11px;
      }
    }
  }
.app{
    margin: auto;
    width: 1800px;
    // height: 800px;
    border: 1px solid gray;
    .buttons{
        text-align: center;
        margin-top: 70px;
        margin-bottom: 70px;
    }
    .headers{
        width: 100%;
        height: 60px;
        border-bottom: 1px solid gray;
        span:nth-child(1){
            font-size: 20px;
            line-height: 60px;
            margin-left: 10px;
            font-weight:800;
        }
        p{
            display: inline-block;
            float: right;
            overflow: hidden;
            line-height: 60px;
            margin-right: 10px;
            /deep/ .el-button--default{
                font-size: 20px;
                background: gainsboro;
            }
        }
    }
    .dll{
        div{
            p{
                text-align: center;
                span{
                    color: #ff5438;
                }
            }
            .el-icon-info:before{
                color: rgb(40, 40, 233);
            }
        }
        .newStyle{
            /deep/ .el-table__header-wrapper{
                background: #E8EAF6;
                /deep/ .el-table__header{
                padding-left: 10px;
                /deep/ .has-gutter{
                    .is-leaf{
                    background: #E8EAF6;
                    }
                }
                }
            }
            /deep/ .el-table__body-wrapper{
                /deep/ .el-table__body{
                    width: 906px !important;
                    tbody{
                        /deep/ .el-table__row{
                        td:first-child{
                            div{
                            width: 0px;
                            height: 22px;
                            border: 1px solid;
                            border-radius: 12px;
                            margin-left: 30px;
                            }
                        }
                        }
                    }
                }
            }
        }
    }
    .bll{
        margin-left: 350px;
        margin-top: 30px;
        div{
            p{
                font-weight:800;
                font-size: 20px
            }
        }
    }
    .bodys{
        margin-top: 30px;
        margin-left: 50px;
        div{
            // height: 150px;
            line-height: 150px;
            margin-left: 10px;
            font-size: 15px;
            p{
                display: inline-block;
                position: absolute;
                margin-left: 24px;
            }
        }
        div:nth-child(2){
                margin-left: 20px;
                p{
                    margin-left: 59px;
                }
            }
    }
    .all{
        position: relative;
            margin-top: 20px;
        .sizes{
            position: absolute;
            z-index: 10;
            right: 0;
            margin-right: 200px;
            margin-top: 60px;
            p{
                display: inline-block;
                padding-left: 150px;
            }
        }
        margin-left: 20px;
        .h-20 {
            height: 40px;
            line-height: 40px;
        }
    }
    .cll{
        width: 1800px;
        // text-align: center;
        margin-left: 600px;
        div{
            p:nth-child(1){
                margin-top: 30px;
                font-weight:800;
                font-size: 20px;
            }
            ul{
                padding-top: 30px;
                width: 500px;
                height: 100px;
                background: rgb(235, 235, 177);
            }
        }
    }
}
</style>