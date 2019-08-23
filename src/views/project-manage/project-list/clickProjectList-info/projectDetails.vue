<template>
    <div id="projectDetails">
        <div class="top">
            <div class="titleImg clearfix">
                <img src="../../../../assets/images/defaultImg.png" alt="" class="fl" v-if="!lists.cover_photo">
                <img :src="lists.cover_photo" alt="" class="fl" v-if="lists.cover_photo">
                <div class="fl projectDetails_right">
                    <div class="projectDetails_rightTop">
                        <span>{{lists.name}}</span>
                        <span>项目编号：{{lists.project_number}}</span>
                    </div>
                    <ul>
                        <li><label>区域范围：</label><span>{{lists.other_info}}</span></li>
                        <li>
                            <span><label>楼盘性质：</label><span>{{lists.building_property}}</span></span>
                            <span><label>项目类型：</label><span>{{lists.project_type}}</span></span>
                        </li>
                        <li>
                            <span><label>项目状态：</label><span>{{lists.project_state}}</span></span>
                            <span v-show="lists.project_state == '待开盘'"><label>开盘时间：</label><span>{{lists.specific_opening_time}}</span></span>
                        </li>
                        <li>
                            <span><label>系统发布：</label><span>{{lists.platform}}</span></span>
                            <!-- <span><label>上架状态：</label><span>{{lists.status_sell}}</span></span> -->
                        </li>
                    </ul>
                </div>
                <div class="fr" >{{lists.building_price}}元/㎡</div>
            </div>
        </div>
        <div class="bottom">
            <el-tabs type="border-card">
                <el-tab-pane label="基本信息" class="baseInfo">
                    <ul>
                        <li>
                            <label>项目负责人:</label><span>{{lists.leader}}</span>
                        </li>
                         <li>
                            <label>负责人电话:</label><span>{{lists.leader_mobile}}</span>
                        </li>
                         <li>
                            <label>项 目 地 址:</label><span>{{lists.address}}</span>
                        </li>
                        <li>
                            <label>项 目 归 属:</label><span>{{lists.project_agent}}</span>
                        </li>
                         <li>
                            <label>建 筑 类 型:</label><span>{{lists.building_type}}</span>
                        </li>
                         <li>
                            <label>楼 盘 特 色:</label><span>{{lists.features}}</span>
                        </li>
                         <li>
                            <label>基 础 设 施:</label><span>{{lists.infrastructure}}</span>
                        </li>
                    </ul>
                </el-tab-pane>
                <el-tab-pane label="销售信息" class="salesInfo">
                    <div>
                        <h3 class="title_architectural">建筑规划</h3>
                        <div class="architectural">
                            <ul class="clearfix">
                                <li>
                                    <label>开 发 商:</label><span>{{lists.developer}}</span>
                                </li>
                                <li>
                                    <label>投 资 商:</label><span>{{lists.investors}}</span>
                                </li>
                                <li><label>产权年限:</label><span>{{lists.years_of_property_rights}}</span></li>
                                <li><label>装修标准:</label><span>{{lists.decoration_standard}}</span></li>
                                <li><label>容 积 率:</label><span>{{lists.volumetric_rate}}</span></li>
                                <li>
                                    <label>总户数:</label><span>{{lists.floor_condition}}</span>
                                </li>
                                <li>
                                    <label>楼 栋 数:</label><span>{{lists.number_of_floor}}</span>
                                </li>
                                <li>
                                    <label>占地面积:</label><span>{{lists.area_covered?lists.area_covered+'㎡' : ''}}</span>
                                </li>
                                <li>
                                   <label>建筑面积:</label><span>{{lists.architecture_area ? lists.architecture_area+'㎡' : ''}}</span>
                                </li>
                                <li>
                                    <label>工程进度:</label><span>{{lists.project_progress}}</span>
                                </li>
                            </ul>
                        </div>
                        <h3 class="title_architectural">物业信息</h3>
                        <div class="architectural">
                            <ul class="clearfix">
                                <li>
                                    <label>物业公司:</label><span>{{lists.property_company}}</span>
                                </li>
                                <li>
                                    <label>物业费用:</label><span>{{lists.property_cost ? lists.property_cost : ''}}</span>
                                </li>
                                <li><label>车位数量:</label><span>{{lists.number_of_parking_spaces}}</span></li>
                                <li><label>车位比例:</label><span>{{lists.parking_ratio}}</span></li>
                                <li><label>物业电话:</label><span>{{lists.sales_phone}}</span></li>
                            </ul>
                        </div>
                        <h3>楼盘简介</h3>
                        <div class="architectural architectural_last">
                            <div>
                                <label>项目简介:</label><span v-html="lists.project_profile" class="editor_img"></span>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="保护期" class="baseInfo">
                    <ul>
                        <li>
                            <label>项目有效类型:</label><span>{{lists.customer_type}}</span>
                        </li>
                        <li>
                            <label>佣金:</label><span>{{lists.money_unit}}</span>
                        </li>
                        <li>
                            <label>佣金规则:</label><span>{{lists.money_des}}</span>
                        </li>
                        <li>
                            <label>报备类型:</label><span>{{lists.reporting_type == 1 ? '保护期' : '定点'}}</span>
                        </li>
                        <li v-if="lists.reporting_type == 1">
                            <label>报备保护期:</label><span>{{lists.pro_time_agent_report ? lists.pro_time_agent_report + '小时' : ''}}</span>
                        </li>
                        <li v-if="lists.reporting_type == 2">
                            <label>定点保护期:</label><span>{{lists.fixed_point_protection_period}}</span>
                        </li>
                        <li>
                            <label>报备规则:</label><span>{{lists.report_rule}}</span>
                        </li>
                        <li>
                            <label>带看保护期:</label><span>{{lists.pro_time_agent_look ? lists.pro_time_agent_look + '小时' : ''}}</span>
                        </li>
                        <li>
                            <label>下定保护期:</label><span>{{lists.pro_time_down_payment ? lists.pro_time_down_payment + '小时' : ''}}</span>
                        </li>
                    </ul>
                </el-tab-pane>
                <el-tab-pane label="合同信息"  class="baseInfo">
                     <ul>
                        <li>
                            <label>公司全称:</label><span>{{lists.contract_compan_name}}</span>
                        </li>
                        <li>
                            <label>公司税号:</label><span>{{lists.contract_ein}}</span>
                        </li>
                        <li>
                            <label>票别:</label><span>{{lists.contract_ein_kind}}</span>
                        </li>
                        <li>
                            <label>开户行及账号:</label><span>{{lists.contract_bank}}</span>
                        </li>
                        <li>
                            <label>地址及电话:</label><span>{{lists.contract_address}}</span>
                        </li>
                        <li>
                            <label>合同截止日期:</label><span v-html="lists.time_of_end ? lists.time_of_end.split(' ')[0] : ''"></span>
                        </li>
                        <li>
                            <label>结佣标准:</label><span>{{lists.contract_knot_commission}}</span>
                        </li>
                    </ul>
                </el-tab-pane>
                <el-tab-pane label="图库" class="salesInfo" >
                   <div v-for="item in lists.gallery" v-if="item.pictureType == 1" v-show="item.image.length">
                        <h3 class="title_architectural" >效果图({{item.sum}})</h3>
                           <viewer :images="item.image" style="display:inherit">
                                <div class="architectural clearfix" v-if="item.image">
                                    <img :src="cellItem.imgUrl" alt="" class="fl" v-for="cellItem in item.image">
                                </div>
                         </viewer>
                    </div>
                  <div v-for="item in lists.gallery" v-if="item.pictureType == 2" v-show="item.image.length">
                        <h3 class="title_architectural">实景图({{item.sum}})</h3>
                           <viewer :images="item.image" style="display:inherit">
                                <div class="architectural clearfix" v-if="item.image">
                                    <img :src="cellItem.imgUrl" alt="" class="fl" v-for="cellItem in item.image">
                                </div>
                          </viewer>
                  </div>
                      <div v-for="item in lists.gallery" v-if="item.pictureType == 3" v-show="item.image.length">
                        <h3 class="title_architectural">样板间({{item.sum}})</h3>
                          <viewer :images="item.image" style="display:inherit">
                                <div class="architectural clearfix" v-if="item.image">
                                    <img :src="cellItem.imgUrl" alt="" class="fl" v-for="cellItem in item.image">
                                </div>
                          </viewer>
                  </div>
                      <div v-for="item in lists.gallery" v-if="item.pictureType == 4" v-show="item.image.length">
                        <h3 class="title_architectural">位置图({{item.sum}})</h3>
                          <viewer :images="item.image" style="display:inherit">
                                <div class="architectural clearfix" v-if="item.image">
                                    <img :src="cellItem.imgUrl" alt="" class="fl" v-for="cellItem in item.image">
                                </div>
                          </viewer>
                  </div>
                      <div v-for="item in lists.gallery" v-if="item.pictureType == 5" v-show="item.image.length">
                        <h3 class="title_architectural">小区配套({{item.sum}})</h3>
                          <viewer :images="item.image" style="display:inherit">
                            <div class="architectural clearfix" v-if="item.image">
                                <img :src="cellItem.imgUrl" alt="" class="fl" v-for="cellItem in item.image">
                            </div>
                          </viewer>
                  </div>
                      <div v-for="item in lists.gallery" v-if="item.pictureType == 6" v-show="item.image.length">
                        <h3 class="title_architectural">项目现场({{item.sum}})</h3>
                          <viewer :images="item.image" style="display:inherit">
                                <div class="architectural clearfix" v-if="item.image">
                                    <img :src="cellItem.imgUrl" alt="" class="fl" v-for="cellItem in item.image">
                                </div>
                          </viewer>
                  </div>
                      <div v-for="item in lists.gallery" v-if="item.pictureType == 7" v-show="item.image.length">
                        <h3 class="title_architectural">总规划图({{item.sum}})</h3>
                          <viewer :images="item.image" style="display:inherit">
                                <div class="architectural clearfix" v-if="item.image">
                                    <img :src="cellItem.imgUrl" alt="" class="fl" v-for="cellItem in item.image">
                                </div>
                          </viewer>
                  </div>
                      <div v-for="item in lists.gallery" v-if="item.pictureType == 8" v-show="item.image.length">
                        <h3 class="title_architectural">预售许可({{item.sum}})</h3>
                          <viewer :images="item.image" style="display:inherit">
                                <div class="architectural clearfix" v-if="item.image">
                                    <img :src="cellItem.imgUrl" alt="" class="fl" v-for="cellItem in item.image">
                                </div>
                          </viewer>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="户型" class="salesInfo">
                    <div class="house_type" v-for="house in lists.huxing">
                        <h3 class="title_architectural">{{house.huoseTypenName}} <span style="color: #333;font-weight:normal;font-size:14px">({{house.sellingStatusString}})</span></h3> 
                        <div class="architectural">
                            <p><span><span>建筑面积:</span>{{house.area}}㎡</span><span><span>房间朝向:</span>{{house.roomOrientationString}}</span></p>
                            <p><span><span>房屋结构:</span>{{house.roomStructureString}}</span><span><span>装修:</span>{{house.renovationString}}</span></p>
                            <p><span><span>用途:</span>{{house.purposeString}}</span><span><span>均价:</span>{{house.averagePrice}}</span></p>
                            <p><span><span>总价:</span>{{house.totalPrice}}万</span><span><span>户型:</span>{{house.huxingString}}</span></p>
                            <p><span><span v-if="house.url">户  型  图:</span>
                                <viewer :images="house.url" style="display:inherit">
                                     <img :src="img" alt="" v-for="img in house.url">
                                </viewer>
                            </span></p>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="动态列表" >
                    <dynamic-table @getNewTableData="getNewTableData" ref="dynamicChild" @editRelea="editRelea" :projectId="proDetail.id"></dynamic-table>
                </el-tab-pane>
                <el-tab-pane label="操作日志" >
                    <el-table
                        :data="tableData"
                        height="250"
                        border
                        style="width: 100%">
                        <el-table-column
                            prop="create_time"
                            label="操作时间"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="function_name"
                            label="功能名称"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            label="内容">
                            <template slot-scope="scope">
                                <span v-html="scope.row.log_content"></span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="operator"
                            label="操作人">
                             <template slot-scope="scope">
                                <span v-html="scope.row.department+'-'+scope.row.operator"></span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import dynamicTable from '../dynamic-info/dynamicTable.vue'
// import { projectDetails } from "@/api/index";
export default {
    components:{
        dynamicTable
    },
  props: ["proDetail"],
  data() {
    return {
      lists: {},
      tableData: [],

    };
  },
  created() {
      },
  methods: {
    //   当删除动态的时候刷新项目列表数据
      getNewTableData(){
          this.$emit("getDeleteNewData")
      },
    //   在详情里面编辑动态点击发布时
      detailChild(){
        //   触发发布table里面的table方法
        this.$refs.dynamicChild.getTableData()
        //   debugger
      },
    editRelea(data){
        data.check = 1
        this.$emit("editReleaMethod",data)
    }
  },
  watch: {
    proDetail(val) {
      this.tableData = val.operationLog;
      this.lists = val;
    }
  }
};
</script>

<style lang='scss' scoped>
#projectDetails {
    min-height: 700px;
  .top {
    border: 1px solid #ebebeb;
    padding: 10px;
    .projectDetails_right {
      > ul {
        line-height: 24px;
        > li {
          width: 320px;
          &:nth-of-type(1) {
            span {
              width: 200px;
            }
          }
          > span {
            display: inline-block;
            width: 150px;
          }
          span {
            color: #333;
          }
          label {
            color: #999;
          }
          &:nth-of-type(4){
              span {
                  width: 280px;
              }
          }
        }
      }
      .projectDetails_rightTop {
        margin-bottom: 20px;
        span {
          &:nth-of-type(1) {
            font-size: 24px;
            font-weight: 600;
            color: #333;
            margin-right: 10px;
          }
          &:nth-of-type(2) {
            //  float: right;
            color: #999;
          }
        }
      }
    }
    .titleImg {
      margin-top: 20px;
      img {
        width: 240px;
        height: 150px;
        margin-right: 20px;
        vertical-align: middle;
      }
      .fl {
        &:nth-of-type(1) {
          line-height: 1.7;
        }
        p {
          span {
            color: #000;
          }
        }
      }
      .fr {
        color: red;
        font-size: 20px;
        margin-top: 59px;
        position: absolute;
        right: 30px;
      }
    }
  }
  .bottom {
    margin-top: 40px;
    /deep/ .el-tabs{
        min-height: 450px
    }
    .baseInfo {
      p {
        line-height: 1.8;
        span {
          color: #999;
          margin-right: 10px;
          width: 90px;
          display: inline-block;
          text-align: justify;
          text-align-last: justify;
        }
      }
    }
    .baseInfo {
      > ul {
        line-height: 35px;
        > li {
          label {
            color: #999;
            margin-right: 5px;
            display: inline-block;
            width: 90px;
            text-align-last: justify;
          }
          span {
            color: #333;
          }
        }
      }
    }
    .salesInfo {
      .house_type {
        margin-bottom: 40px;
      }
      h3 {
        font-weight: 600;
        margin-bottom: 10px;
        margin-top: 10px;
      }
      .architectural_last {
        label {
          display: inline-block;
          color: #999;
          width: 80px;
          text-align-last: justify;
          margin-right: 5px;
        }
       /deep/ .editor_img{
            img {
                width: 145px;
            }
        }
      }
      .architectural {
        > ul {
          width: 728px;
          line-height: 30px;
          li {
            width: 50%;
            float: left;
            label {
              display: inline-block;
              width: 80px;
              text-align-last: justify;
              margin-right: 5px;
              color: #999;
            }
            span {
              height: auto;
              word-wrap: break-word;
              word-break: break-all;
              overflow: hidden;
            }
          }
        }
        padding-left: 10px;
        p {
          display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
          display: -moz-box; /* Firefox 17- */
          display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
          display: -moz-flex; /* Firefox 18+ */
          display: -ms-flexbox; /* IE 10 */
          display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
          line-height: 1.8;
          > span {
            -webkit-flex: 1; /* Chrome */
            -ms-flex: 1; /* IE 10 */
            flex: 1; /* NEW, Spec - Opera 12.1, Firefox 20+ */
            -webkit-box-flex: 1;
            img {
              margin-top: 10px;
              width: 70px;
              height: 70px;
            }
            > span {
              &:nth-of-type(1) {
                color: #999;
                text-align: justify;
                text-align-last: justify;
                width: 90px;
                display: inline-block;
                margin-right: 10px;
              }
            }
          }
        }
        img {
          width: 100px;
          height: 100px;
          margin-left: 20px;
          margin-top: 20px;
          &:nth-of-type(7n){
             margin-left:0;
          }
          &:nth-of-type(1){
             margin-left:0;
          }
          &:nth-of-type(-n+6){
              margin-top: 0;
          }
        }
      }
    }
  }
}
</style>