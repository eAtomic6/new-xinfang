<!-- 合同管理 -->
<template>
    <div class="content-txt" id="contractManage">
        <!-- form表单 -->
        <div class="w-select">
            <el-form :inline="true" :model="formInline" class="demo-form-inline listForm">
                <el-form-item label="部门:">
                    <!-- <el-input v-model="formInline.dealDepId" placeholder="请输入部门"></el-input> -->
                    <el-select v-model="formInline.dealDepId" placeholder="请选择" class="tree-input">
                        <el-option value="">
                            <el-tree :data="departmentData" :props="departmentProp" node-key="DepartOnlyCode" check-on-click-node :expand-on-click-node=true @node-click="clickNode"></el-tree>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="成交人:">
                    <el-autocomplete class="inline-input" v-model="formInline.dealBy" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect"></el-autocomplete>
                    <!-- <el-input  placeholder="请输入成交人"></el-input>v-model="keyWordContent" -->
                </el-form-item>
                <el-form-item label="合同状态:">
                    <el-select v-model="formInline.dealType" placeholder="全部">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="认筹" value="0"></el-option>
                        <el-option label="认购" value="1"></el-option>
                        <el-option label="草签" value="2"></el-option>
                        <el-option label="网签" value="3"></el-option>
                        <el-option label="结算" value="7"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="成交日期:">
                    <div class="block">
                        <el-date-picker v-model="dealTime" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
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
                </span>
            </el-form>
        </div>
        <!-- table表格  @row-dblclick="rowDblclickCon"-->
        <el-table :data="financeData" style="width: 100%" class="el-table table-list" :row-key="getRowKeysCon" @row-click="rowClickCon" @expand-change="showDetailCon" :expand-row-keys="expandscon">
            <el-table-column type="expand" width="5">
                <template slot-scope="props">
                    <el-form label-position="left" class="demo-table-expand click-table-row">
                        <div @dblclick="rowDblclickCon">
                            <div class="fl w-list01">
                                <div class="list-box">
                                    <p class="mr5 fw-b black-g">客户信息</p>
                                    <p>[{{financeDataClick.cNo}}]</p>
                                    <p>
                                        {{financeDataClick.cName}}
                                    </p>
                                    <p>[{{financeDataClick.source}}]</p>
                                </div>
                            </div>
                            <div class="fl w-list02">
                                <div class="list-box">
                                    <p class="mr5 fw-b black-g">合同信息
                                        <span class="tag">{{ financeDataClick.type }}</span>
                                    </p>
                                    <p>
                                        <span class="pr10">{{financeDataClick.createName}}</span>
                                        {{financeDataClick.mobile}}
                                    </p>
                                    <p>{{financeDataClick.bName}}</p>
                                    <p>
                                        <span class="pr10">{{financeDataClick.housePrice}}元</span>{{financeDataClick.houseArea}}平米
                                    </p>
                                </div>
                            </div>
                            <div class="fl w-list03">
                                <div class="list-box">
                                    <p class="mr5 fw-b black-g">财务</p>
                                    <p>应收:
                                        <b class="color-red">{{financeDataClick.expectedCommision}}</b>元
                                    </p>
                                    <p>
                                        实收:
                                        <b class="color-red">{{financeDataClick.actualCommision}}</b>元
                                    </p>
                                </div>
                            </div>
                            <div class="fl w-list04">
                                <div class="list-box">
                                    <p><em v-if="sourceType===3">转入人:</em><em v-else>持有人:</em>{{financeDataClick.ownerDepName}}-{{financeDataClick.ownerName}}</p>
                                    <p><em v-if="sourceType===3">转入时间:</em><em v-else>持有时间:</em> {{financeDataClick.lockStartTime | formatTime}}</p>
                                    <p>成交人: {{financeDataClick.dealDepName}}-{{financeDataClick.dealByName}}</p>
                                    <p>成交时间: {{financeDataClick.dealTime | formatTime}}</p>
                                </div>
                            </div>
                            <div class="fl w-list05">
                                <div class="list-box">
                                    <!-- :key="item.id" :class="{'on':item.view}" -->
                                    <ul>
                                        <li v-for="item of financeDataClickBar" :key="item.id" :class="{'on':item.view}">
                                            <!-- <p class="black-g">{{item}}</p> -->
                                            <p class="black-g">{{item.name}}</p>
                                            <em class="c-big">
                                                <em class="c-small"></em>
                                            </em>
                                            <p class="c-name">{{item.empName}}</p>
                                            <p class="c-time">{{ item.operateTime | formatTimeHead }}</p>
                                            <p class="c-time">{{ item.operateTime | formatTimeEnd}}</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="fl w-list06">
                                <div class="list-box">
                                    <span @click="butSettlementClick" class="but-darkblue" v-show="butShowHide">
                                        <i class="mr10 el-icon-edit-outline"></i>结算</span>
                                    <span @click="butCommissionClick" class="but-darkblue" v-show="butShowHideFY">
                                        <i class="mr10 el-icon-edit-outline"></i>分佣</span>
                                </div>
                            </div>
                        </div>
                    </el-form>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="id" label="序号" width="80"></el-table-column> -->
            <el-table-column label="序号" width="50">
                <template slot-scope="scope">
                    <span>{{scope.$index+(pageNum - 1) * pageSize + 1}} </span>
                </template>
            </el-table-column>
            <el-table-column label="客户信息" width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.cName}}
                        <em class="ml5 yes-xiao">{{scope.row.state}}</em>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="bName" label="项目" width="150" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="房屋总价" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.housePrice}}元
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="合同状态" width="80" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="持有/转入人" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.ownerDepName}}-{{scope.row.ownerName}}
                    </span>
                </template>
            </el-table-column>
            <!-- -->
            <el-table-column prop="lockStartTime" label="持有/转入时间" width="145" :formatter="formatTime">
            </el-table-column>
            <el-table-column label="成交人" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.dealDepName}}-{{scope.row.dealByName}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="dealTime" label="成交时间" width="145" :formatter="formatTime">
            </el-table-column>
            <el-table-column label="结算人" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.accountingDepName}}-{{scope.row.accountingByName}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="accountingTime" label="结算时间" width="145" :formatter="formatTime">
            </el-table-column>
            <div slot="empty" class="list-empty">
                <img src="../../../assets/images/empty.png" alt="">
                <p class="desc">暂无数据</p>
            </div>
        </el-table>
        <!-- 分页 -->
        <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[ 5 , 10, 20, 30, 40]" :page-size="pageSize" layout="prev, pager, next,total, sizes, jumper" :total="userListTotal" v-show="financeData.length!=0&&userListTotal>pageSize">  v-show="financeData.length!=0"-->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[ 5 , 10, 20, 30, 40]" :page-size="pageSize" layout="prev, pager, next,total, sizes, jumper" :total="userListTotal" v-show="financeData.length!=0">
        </el-pagination>
        <!-- Form -->
        <!-- 结算的弹层 -->
        <el-dialog title="结算" :visible.sync="settlement" class="settlement" top="5%">
            <div class="pop-billing-info">
                <div class="layerbox-title">基本资料</div>
                <div class="form-row">
                    <div class="row rows3">
                        <div class="tit">客户姓名:</div>
                        {{settlementDetails.cName}}
                    </div>
                    <div class="row rows3" style="width:26%">
                        <div class="tit">客户状态:</div>
                        {{settlementDetails.state}}
                    </div>
                    <div class="row rows3" style="width:40%">
                        <div class="tit">客户编号:</div>
                        【{{settlementDetails.cNo}}】
                    </div>
                </div>
                <div class="form-row">
                    <div class="row rows1">
                        <div class="tit">手机号码:</div>
                        <span class="mr10" v-for="item of settlementDetailsPhone" :key="item.id">{{item.phone}}</span>
                        <!-- {{settlementDetails.phone}} -->
                    </div>
                </div>
                <div class="form-row">
                    <div class="row rows1">
                        <div class="tit">成交项目:</div>
                        {{settlementDetails.bName}}
                    </div>
                </div>
                <div class="form-row">
                    <div class="row rows3">
                        <div class="tit"> {{settlementDetails.reportingType == 1 ? '报备保护期' : '定点保护期'}}</div>
                        {{settlementDetails.reportingType == 1 ? settlementDetails.proTimeReport + '小时' : settlementDetails.fixedPointProtectionPeriod}}
                    </div>
                    <div class="row rows3" style="width:26%">
                        <div class="tit">带看保护期:</div>
                        {{settlementDetails.proTimeLook}}小时
                    </div>
                    <div class="row rows3" style="width:40%">
                        <div class="tit">项目性质:</div>
                        {{settlementDetails.buildingProperty}}
                    </div>
                </div>
                <div class="mt10 layerbox-title">合同进度</div>
                <div class="list-box">
                    <ul>
                        <li v-for="item of settlementDetailsBar" :key="item.id" :class="{'on':item.view}">
                            <p class="black-g">{{item.name}}</p>
                            <em class="c-big">
                                <em class="c-small"></em>
                            </em>
                            <p class="c-name">{{item.empName}}</p>
                            <p class="c-time">{{ item.operateTime | formatTimeHead }}</p>
                            <p class="c-time">{{ item.operateTime | formatTimeEnd}}</p>
                        </li>
                    </ul>
                </div>
                <div class="clearfix"></div>
                <!-- 认筹表单 -->
                <el-form :model="settlementDetailsFormRen" :rules="settlementRulesRenChou" label-width="85px" class="mt20 ruleForm ren" ref="refsettlementDetailsRenChou" v-if="renchouShow">
                    <div class="inputrows inputrows3">
                        <el-form-item label="合同姓名:" required prop="custName">
                            <el-input v-model="settlementDetailsFormRen.custName" maxlength=20></el-input>
                        </el-form-item>
                        <el-form-item label="手机号码:" required prop="custMobile">
                            <el-input v-model.number="settlementDetailsFormRen.custMobile" maxlength=11 @blur="validPhone"></el-input>
                        </el-form-item>
                        <el-form-item label="身份证号:" required prop="custIdCard">
                            <el-input v-model="settlementDetailsFormRen.custIdCard" maxlength=18 @blur="idCardChange"></el-input>
                        </el-form-item>
                        <!-- 认筹 开始 -->
                        <el-form-item label="认筹金额:" required class="right-words" prop="dealPay">
                            <el-input v-model.number="settlementDetailsFormRen.dealPay" @blur="Price"></el-input>
                            <span>元</span>
                        </el-form-item>
                        <el-form-item label="认筹时间:" required prop="dealTime">
                            <el-date-picker v-model="settlementDetailsFormRen.dealTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="截止时间:">
                            <el-date-picker v-model="settlementDetailsFormRen.dealDeadline" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="让利金额:" class="right-words">
                            <el-input v-model="settlementDetailsFormRen.dealProfit" @blur="Price" :class="{'emput-error':emputErrorRL}"></el-input>
                            <span>元</span>
                        </el-form-item>
                        <!-- 认筹 结束 -->
                        <el-form-item label="成交人:" class="twoinput" required prop="dealByName">
                            <el-autocomplete class="fl dropdown-box" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelectBoxRenChou" v-model="settlementDetailsFormRen.dealByName" @blur="valFrom" @change="changeValue"></el-autocomplete>
                            <el-input v-model="settlementDetailsFormRen.dealDepName" class="fl dropdown-box" readonly="readonly" :disabled="true"></el-input>
                        </el-form-item>
                        <!-- readonly="readonly" :disabled="true" -->
                    </div>
                    <div class="clearfix"></div>
                    <div class="inputrows upload">
                        <el-form-item label="">
                            <span class="labels-name">认筹单据:</span>
                            <el-upload class="upload-card" action="/img/upload" :on-success="uploadPhotoSuccess" :on-preview="handlePictureCardPreview" :on-remove="removeAddPhone" :file-list="cert" :before-upload="imgPreview" list-type="picture-card">
                                <i class="icon icon-zengjia"></i>
                            </el-upload>
                        </el-form-item>
                    </div>
                    <div class="clearfix"></div>
                    <div class="mt10 layerbox-title">结算</div>
                    <div class="inputrows inputrows3">
                        <el-form-item label="房屋房号:" :prop="houseNoRule">
                            <el-input v-model="settlementDetailsFormRen.houseNo" maxlength="20"></el-input>
                        </el-form-item>
                        <el-form-item label="房屋面积:" :prop="houseAreaRule" class="right-words">
                            <el-input v-model="settlementDetailsFormRen.houseArea"></el-input>
                            <span>平米</span>
                        </el-form-item>
                        <el-form-item label="房屋总价:" :prop="housePriceRule" class="right-words">
                            <el-input v-model="settlementDetailsFormRen.housePrice" @blur="Price" :class="{'emput-error':emputErrorZJ}"></el-input>
                            <span>元</span>
                        </el-form-item>
                        <!-- settlementDetailsPlan -->
                        <el-form-item label="应收佣金:" prop="expectedCommision" required class="right-words">
                            <el-input v-model.number="settlementDetailsFormRen.expectedCommision" @change="commissionReceivable" @blur="Price"></el-input>
                            <span>元</span>
                        </el-form-item>
                        <el-form-item label="实收佣金:" prop="actualCommision" required class="right-words">
                            <el-input v-model.number="settlementDetailsFormRen.actualCommision" @change="commissionReceivable" @blur="Price"></el-input>
                            <span>元</span>
                        </el-form-item>
                    </div>
                    <div class="clearfix"></div>
                    <div class="inputrows textarea">
                        <el-form-item label="备注说明:">
                            <el-input type="textarea" v-model="settlementDetailsFormRen.note" maxlength="400" onchange="this.value=this.value.substring(0, 400)" onkeydown="this.value=this.value.substring(0, 400)" onkeyup="this.value=this.value.substring(0, 400)"></el-input>
                        </el-form-item>
                    </div>
                    <div class="clearfix"></div>
                    <div class="inputrows upload">
                        <el-form-item label="合同附件:">
                            <el-upload class="upload-card" action="/img/upload" :on-success="uploadPhotoSuccess2" :on-preview="handlePictureCardPreview2" :on-remove="removeAddPhone2" :file-list="accountingCert" :before-upload="imgPreview2" list-type="picture-card">
                                <i class="icon icon-zengjia"></i>
                            </el-upload>
                        </el-form-item>
                    </div>
                </el-form>
                <!-- 认购，草签，网签表单 -->
                <el-form :model="settlementDetailsForm" :rules="settlementRules" label-width="85px" class="mt20 ruleForm feiren" ref="refsettlementDetails" v-else>
                    <div class="inputrows inputrows3">
                        <el-form-item label="合同姓名:" required prop="custName">
                            <el-input v-model="settlementDetailsForm.custName" maxlength=20></el-input>
                        </el-form-item>
                        <el-form-item label="手机号码:" required prop="custMobile">
                            <el-input v-model.number="settlementDetailsForm.custMobile" maxlength=11 @blur="validPhone"></el-input>
                        </el-form-item>
                        <el-form-item label="身份证号:" required prop="custIdCard">
                            <el-input v-model="settlementDetailsForm.custIdCard" maxlength=18 @blur="idCardChange"></el-input>
                        </el-form-item>
                        <!-- 认购 开始 -->
                        <el-form-item label="认购金额:" required :prop="renGouPrice" class="right-words" v-if="rengouShow">
                            <el-input v-model.number="settlementDetailsForm.dealPay" @blur="Price"></el-input>
                            <span>元</span>
                        </el-form-item>
                        <el-form-item label="认购时间:" required :prop="renGouTime" v-if="rengouShow">
                            <el-date-picker v-model="settlementDetailsForm.dealTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH-mm-ss">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="认购房号:" required v-if="rengouShow" :prop="renGouNum">
                            <el-input v-model="settlementDetailsForm.houseNo" maxlength="20"></el-input>
                        </el-form-item>
                        <el-form-item label="房屋面积:" required prop="houseArea" class="right-words02" v-if="rengouShow">
                            <el-input v-model.number="settlementDetailsForm.houseArea"></el-input>
                            <span>平米</span>
                        </el-form-item>
                        <el-form-item label="房屋总价:" required class="right-words" prop="housePrice" v-if="rengouShow">
                            <el-input v-model.number="settlementDetailsForm.housePrice" @blur="Price"></el-input>
                            <span>元</span>
                        </el-form-item>
                        <!-- 认购 结束 -->
                        <!-- 草签 开始 -->
                        <el-form-item label="草签时间:" required :prop="caoQianTime" v-if="caoqianShow">
                            <el-date-picker v-model="settlementDetailsForm.dealTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="房屋房号:" required :prop="caoQianNum" v-if="caoqianShow">
                            <el-input v-model="settlementDetailsForm.houseNo"></el-input>
                        </el-form-item>
                        <el-form-item label="房屋面积:" required prop="houseArea" class="right-words" v-if="caoqianShow">
                            <el-input v-model.number="settlementDetailsForm.houseArea"></el-input>
                            <span>平米</span>
                        </el-form-item>
                        <el-form-item label="房屋总价:" required class="right-words" v-if="caoqianShow" prop="housePrice">
                            <el-input v-model.number="settlementDetailsForm.housePrice" @blur="Price"></el-input>
                            <span>元</span>
                        </el-form-item>
                        <!-- 草签 结束 -->
                        <!-- 网签 开始 -->
                        <el-form-item label="网签时间:" required :prop="wangQianTime" v-if="wangqianShow">
                            <el-date-picker v-model="settlementDetailsForm.dealTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="房屋房号:" required :prop="wangQianNum" v-if="wangqianShow">
                            <el-input v-model="settlementDetailsForm.houseNo"></el-input>
                        </el-form-item>
                        <el-form-item label="房屋面积:" required prop="houseArea" class="right-words" v-if="wangqianShow">
                            <el-input v-model.number="settlementDetailsForm.houseArea"></el-input>
                            <span>平米</span>
                        </el-form-item>
                        <el-form-item label="房屋总价:" required class="right-words" prop="housePrice" v-if="wangqianShow">
                            <el-input v-model.number="settlementDetailsForm.housePrice" @blur="Price"></el-input>
                            <span>元</span>
                        </el-form-item>
                        <!-- 网签 结束 -->
                        <el-form-item label="成交人:" required class="twoinput" prop="dealByName">
                            <el-autocomplete class="fl dropdown-box" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelectBox" v-model="settlementDetailsForm.dealByName"></el-autocomplete>
                            <el-input v-model="settlementDetailsForm.dealDepName" class="fl dropdown-box" readonly="readonly" :disabled="true"></el-input>
                        </el-form-item>
                        <!-- readonly="readonly" :disabled="true" -->
                    </div>
                    <div class="clearfix"></div>
                    <div class="inputrows upload">
                        <el-form-item label="">
                            <span class="labels-name" v-if="rengouShow">认购单据:</span>
                            <span class="labels-name" v-if="caoqianShow">草签单据:</span>
                            <span class="labels-name" v-if="wangqianShow">网签单据:</span>
                            <el-upload class="upload-card" action="/img/upload" :on-success="uploadPhotoSuccess" :on-preview="handlePictureCardPreview" :on-remove="removeAddPhone" :file-list="cert" :before-upload="imgPreview" list-type="picture-card">
                                <i class="icon icon-zengjia"></i>
                            </el-upload>
                        </el-form-item>
                    </div>
                    <div class="clearfix"></div>
                    <div class="mt10 layerbox-title">结算</div>
                    <div class="inputrows inputrows3">
                        <el-form-item label="应收佣金:" required prop="expectedCommision" class="right-words">
                            <el-input v-model.number="settlementDetailsForm.expectedCommision" @change="commissionReceivable" @blur="Price"></el-input>
                            <span>元</span>
                        </el-form-item>
                        <el-form-item label="实收佣金:" required prop="actualCommision" class="right-words">
                            <el-input v-model.number="settlementDetailsForm.actualCommision" @change="commissionReceivable" @blur="Price"></el-input>
                            <span>元</span>
                        </el-form-item>
                    </div>
                    <div class="clearfix"></div>
                    <div class="inputrows textarea">
                        <el-form-item label="备注说明:">
                            <el-input type="textarea" v-model="settlementDetailsForm.note" maxlength="400" onchange="this.value=this.value.substring(0, 400)" onkeydown="this.value=this.value.substring(0, 400)" onkeyup="this.value=this.value.substring(0, 400)"></el-input>
                        </el-form-item>
                    </div>
                    <div class="clearfix"></div>
                    <div class="inputrows upload">
                        <el-form-item label="合同附件:">
                            <el-upload class="upload-card" action="/img/upload" :on-success="uploadPhotoSuccess2" :on-preview="handlePictureCardPreview2" :on-remove="removeAddPhone2" :file-list="accountingCert" :before-upload="imgPreview2" list-type="picture-card">
                                <i class="icon icon-zengjia"></i>
                            </el-upload>
                        </el-form-item>
                    </div>
                </el-form>
                <div slot="footer" class="layer-footer">
                    <el-button type="primary" @click="settlementSubmitRenChou('refsettlementDetailsRenChou')" class="pop-submitbtn" v-if="renchouShow">确认结算</el-button>
                    <el-button type="primary" @click="settlementSubmit('refsettlementDetails')" class="pop-submitbtn" v-else>确认结算</el-button>
                    <el-button @click="settlement = false" class="pop-cancelbtn">取消</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 分佣的弹层 -->
        <el-dialog title="分佣" :visible.sync="commissionBox" class="settlement" top="5%" @close="closeRest">
            <template v-if="commissionDetail.commissionTime>1">
                <div class="commission-rate" v-for="item in commissionDetail.list">
                    <div label-width="44px" class="commission">
                        <p class="add-title"><span class="point">*</span> 第 <span class="bold">{{item.commissionTime}}</span> 次结算金额：<span class="account show">{{item.settlementMoney}}</span> 元</p>
                        <div class="table-title">
                            <span class="title-item">参与分佣人员</span>
                            <span class="title-item center">所在部门</span>
                            <span class="title-item right">分佣比例</span>
                        </div>
                        <div class="table-main" v-for="mainItem in item.resultList">
                            <span class="main-item" alt="123">{{mainItem.eCharacter}}</span>
                            <el-tooltip class="main-item text-ellipsis name" effect="dark" :content="mainItem.employeeName" placement="top">
                                <el-button>{{mainItem.employeeName}}</el-button>
                            </el-tooltip>
                            <el-tooltip class="main-item text-ellipsis department" effect="dark" :content="mainItem.departmentName" placement="top">
                                <el-button>{{mainItem.departmentName}}</el-button>
                            </el-tooltip>
                            <span class="main-item text-ellipsis scale">{{mainItem.rate}}%</span>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </template>

            <div class="commission-rate">
                <el-form :model="commission" :rules="commissionRules" ref="formCommission" label-width="44px" class="commission">
                    <p class="add-title"><span class="point">*</span> 第 <span class="bold">{{commissionDetail.commissionTime}}</span> 次结算金额：<el-input class="account" v-model="currentMoney"></el-input> 元</p>
                    <el-table :data="commissionData" class="addwrap" :row-class-name="tableRowClassName" @row-click="rowClick">
                        <el-table-column label="" width="">
                            <template slot-scope="scope">
                                <!-- <el-form-item label="" prop="eCharacter"> -->
                                <el-select v-model="commissionData[scope.$index].eCharacter" placeholder="请选择" class="fl mr10 dropdown">
                                    <el-option label="录入人" value=1></el-option>
                                    <el-option label="维护人" value=2></el-option>
                                    <el-option label="转入人" value=3></el-option>
                                    <el-option label="成交人" value=4></el-option>
                                    <el-option label="其他" value=5></el-option>
                                </el-select>
                                <!-- </el-form-item> -->
                            </template>
                        </el-table-column>
                        <el-table-column label="参与分佣人员" width="200px">
                            <!-- <el-form-item label="" prop="eName"> -->
                            <el-autocomplete slot-scope="scope" :fetch-suggestions="querySearch" placeholder="请输入参与分佣人员" @select="handleSelectFY" @focus="focusBoxJ" v-model="commissionData[scope.$index].eName"></el-autocomplete>
                            <!-- </el-form-item> -->
                        </el-table-column>

                        <el-table-column label="所在部门">
                            <template slot-scope="scope">
                                <!-- <el-form-item label="" prop="depName"> -->
                                <!-- <el-input v-model="commissionData[scope.$index].depName" class="fl mr10 span-input" :disabled="true"></el-input> -->
                                <!-- </el-form-item> -->
                                <el-tooltip class="fl mr10 span-input" effect="dark" :content="commissionData[scope.$index].depName" placement="top">
                                    <el-button>{{commissionData[scope.$index].depName}}</el-button>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column label="" width="1px" class="none-form">
                            <template slot-scope="scope">
                                <el-input v-model="commissionData[scope.$index].eId" class="fl mr10 span-input" :disabled="true"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="" width="1px" class="none-form">
                            <template slot-scope="scope">
                                <el-input v-model="commissionData[scope.$index].depId" class="fl mr10 span-input" :disabled="true"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="分佣比例">
                            <template slot-scope="scope">
                                <!-- :min="0" :max="100" -->
                                <el-input-number controls-position="right" v-model="commissionData[scope.$index].rate" class="small-input"></el-input-number> %
                            </template>
                        </el-table-column>

                        <el-table-column label="" width="90px">
                            <template slot-scope="scope">
                                <span @click.stop="addcommissionData(scope.$index)" class="fl ml5 button">
                                    <i class="el-icon-plus"></i>
                                </span>
                                <span @click.stop="deleteRowcommissionData(scope.$index)" class="fl ml5 button">
                                    <i class="el-icon-minus"></i>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
                <div class="clearfix"></div>
                <p class="count">实收佣金：<span class="bold">{{commissionDetail.actualCommision}}</span>元<span class="break"></span>剩余结算佣金：<span class="bold">{{commissionDetail.restCommission}}</span>元</p>
                <p class="mt20 descript">分成比例说明:
                    <span>分成比例之和必须等于100%</span>
                </p>
                <div slot="footer" class="layer-footer">
                    <el-button type="primary" @click="commissionSubmit('formCommission')" class="pop-submitbtn">确定</el-button>
                    <el-button @click="commissionBox = false" class="pop-cancelbtn">取消</el-button>
                </div>

            </div>

        </el-dialog>
        <!-- 双击-合同明细 -->
        <el-dialog :title="'合同明细 ['+customerInfo.NAME+']'" :visible.sync="contractDetails" class="contract-details" top="40px">
            <div class="left" ref="leftWrap">
                <div class="field-tit">
                    <div class="ileft">客户信息</div>
                    <div class="iright"></div>
                </div>
                <div class="field-row">
                    <div class="ileft">客户编号:</div>
                    <div class="iright">{{customerInfo.c_no}}</div>
                </div>
                <div class="field-row">
                    <div class="ileft">客户来源:</div>
                    <div class="iright">{{customerInfo.source}}</div>
                </div>
                <div class="field-row">
                    <div class="ileft">客户状态:</div>
                    <div class="iright">
                        <span class="client-tag" v-show="this.customerInfo.level">{{customerInfo.level}}</span>
                        <span class="client-tag" v-show="this.customerInfo.state">{{customerInfo.state}}</span>
                        <span class="client-tag" v-show="this.customerInfo.protectState">{{customerInfo.protectState}}</span>
                    </div>
                </div>
                <div class="field-row">
                    <div class="ileft" v-if="this.customerType===3">转入信息:</div>
                    <div class="ileft" v-else>录入信息:</div>
                    <div class="iright">{{customerInfo.creator_dep_name}}-{{customerInfo.creator_name}}
                        <br>{{customerInfo.create_time | formatTime}}</div>
                </div>
                <div class="field-row">
                    <div class="ileft" v-if="this.customerType===3">联动专员:</div>
                    <div class="ileft" v-else>持有信息:</div>
                    <div class="iright">{{customerInfo.owner_dep_name}}-{{customerInfo.owner_name}}
                        <br>{{customerInfo.lock_start_time | formatTime}}</div>
                </div>
                <div class="field-row">
                    <div class="ileft">成交信息:</div>
                    <div class="iright">{{customerInfo.dealDepName}}-{{customerInfo.deal_by_name}}
                        <br>{{customerInfo.deal_time | formatTime}}</div>
                </div>
                <div class="field-row">
                    <div class="ileft">结算信息:</div>
                    <div class="iright">{{customerInfo.accountingDepName}}-{{customerInfo.accounting_by_name}}
                        <br>{{customerInfo.accounting_time | formatTime}}</div>
                </div>
                <div class="field-tit">
                    <div class="ileft">楼盘信息</div>
                    <div class="iright"></div>
                </div>
                <div class="field-row">
                    <div class="ileft">项目编号:</div>
                    <div class="iright">{{customerInfo.project_number}}</div>
                </div>
                <div class="field-row">
                    <div class="ileft">项目名称:</div>
                    <div class="iright">{{customerInfo.b_name}}</div>
                </div>
            </div>
            <div class="right" ref="rightWrap">
                <el-tabs type="border-card" class="tab-switch" @tab-click="tableClickIndex">
                    <!-- 结算信息 -->
                    <el-tab-pane label="结算信息">
                        <div class="billing-info">
                            <div class="layerbox-title">合同进度</div>
                            <div class="list-box">
                                <ul>
                                    <li v-for="item of customerInfoBar" :key="item.id" :class="{'on':item.view}">
                                        <p class="black-g">{{item.name}}</p>
                                        <em class="c-big">
                                            <em class="c-small"></em>
                                        </em>
                                        <p class="c-name">{{item.empName}}</p>
                                        <p class="c-time">{{ item.operateTime | formatTimeHead }}</p>
                                        <p class="c-time">{{ item.operateTime | formatTimeEnd}}</p>
                                    </li>
                                </ul>
                            </div>
                            <div class="clearfix"></div>
                            <div class="mt20 layerbox-title">合同信息</div>
                            <div class="form-row">
                                <div class="row rows3">
                                    <div class="tit">合同姓名:</div>
                                    {{settlementInfo.cust_name}}
                                </div>
                                <div class="row rows3">
                                    <div class="tit">手机号码:</div>
                                    {{settlementInfo.cust_mobile}}
                                </div>
                                <div class="row rows3" v-if="renchouShowHide">
                                    <div class="tit">认筹金额:</div>
                                    {{settlementInfo.deal_pay}}元
                                </div>
                                <div class="row rows3" v-if="rengouShowHide">
                                    <div class="tit">认购金额:</div>
                                    {{settlementInfo.deal_pay}}元
                                </div>
                                <div class="row rows3" v-if="rengouShowHide">
                                    <div class="tit">认购时间:</div>
                                    <div v-if="settlementInfo.deal_time">{{settlementInfo.deal_time.split(" ")[0]}}</div>
                                </div>
                                <div class="row rows3" v-if="renchouShowHide">
                                    <div class="tit">认筹时间:</div>
                                    <div v-if="settlementInfo.deal_time">{{settlementInfo.deal_time.split(" ")[0]}}</div>
                                </div>
                                <div class="row rows3" v-if="caoqianShowHide">
                                    <div class="tit">草签时间:</div>
                                    <div v-if="settlementInfo.deal_time">{{settlementInfo.deal_time.split(" ")[0]}}</div>
                                </div>
                                <div class="row rows3" v-if="wangqianShowHide">
                                    <div class="tit">网签时间:</div>
                                    <div v-if="settlementInfo.deal_time">{{settlementInfo.deal_time.split(" ")[0]}}</div>
                                </div>
                                <div class="row rows3">
                                    <div class="tit">身份证号:</div>
                                    {{settlementInfo.cust_idcard}}
                                </div>
                                <div class="row rows3" v-if="renchouShowHide">
                                    <div class="tit">截止日期:</div>
                                    <div v-if="settlementInfo.deal_deadline">{{settlementInfo.deal_deadline.split(" ")[0]}}</div>
                                </div>
                                <div class="row rows3" v-if="renchouShowHide">
                                    <div class="tit">让利金额:</div>
                                    {{settlementInfo.deal_profit}}元
                                </div>
                                <div class="row rows3" v-if="rengouShowHide">
                                    <div class="tit">认购房号:</div>
                                    {{settlementInfo.house_no}}
                                </div>
                                <div class="row rows3" v-if="rengouShowHide">
                                    <div class="tit">房屋面积:</div>
                                    {{settlementInfo.house_area}}平米
                                </div>
                                <div class="row rows3" v-if="rengouShowHide">
                                    <div class="tit">房屋总价:</div>
                                    {{settlementInfo.house_price}}元
                                </div>
                                <div class="row rows3" v-if="caoqianShowHide">
                                    <div class="tit">房屋房号:</div>
                                    {{settlementInfo.house_no}}
                                </div>
                                <div class="row rows3" v-if="caoqianShowHide">
                                    <div class="tit">房屋面积:</div>
                                    {{settlementInfo.house_area}}平米
                                </div>
                                <div class="row rows3" v-if="caoqianShowHide">
                                    <div class="tit">房屋总价:</div>
                                    {{settlementInfo.house_price}}元
                                </div>
                                <div class="row rows3" v-if="wangqianShowHide">
                                    <div class="tit">房屋房号:</div>
                                    {{settlementInfo.house_no}}
                                </div>
                                <div class="row rows3" v-if="wangqianShowHide">
                                    <div class="tit">房屋面积:</div>
                                    {{settlementInfo.house_area}}平米
                                </div>
                                <div class="row rows3" v-if="wangqianShowHide">
                                    <div class="tit">房屋总价:</div>
                                    {{settlementInfo.house_price}}元
                                </div>
                                <div class="row rows3">
                                    <div class="tit">成
                                        <em class="san-four"></em>交
                                        <em class="san-four"></em>人:</div>
                                    {{settlementInfo.deal_by_name}}
                                    ({{settlementInfo.dealByDepName}})
                                </div>
                                <div class="row rows1 upload">
                                    <div class="tit" v-if="renchouShowHide">认筹单据:</div>
                                    <div class="tit" v-if="rengouShowHide">认购单据:</div>
                                    <div class="tit" v-if="caoqianShowHide">草签单据:</div>
                                    <div class="tit" v-if="wangqianShowHide">网签单据:</div>
                                    <div class="img-wrap">
                                        <!-- <div class="fl mt15 mr15 imgs-w" v-for="item of settlementInfo.cert" :key="item.id">
                      <img :src="item" alt="" @click="dialogVisible = true">
                    </div> -->

                                        <div class="fl mt15 mr15 imgs-w" @click="ViewBigPhoto(index,value)" v-for="(value,index) of settlementInfo.cert" :key="index"><img :src="value" alt=""></div>

                                    </div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                            <div v-if="jiesuanShow">
                                <div class="mt10 layerbox-title jiesuanShow">结算信息</div>
                                <div class="form-row">
                                    <div class="row rows3" v-if="renchouShowHide">
                                        <div class="tit">房屋房号:</div>
                                        {{settlementInfo.house_no}}
                                    </div>
                                    <div class="row rows3" v-if="renchouShowHide">
                                        <div class="tit">房屋面积:</div>
                                        {{settlementInfo.house_area}}平米
                                    </div>
                                    <div class="row rows3" v-if="renchouShowHide">
                                        <div class="tit">房屋总价:</div>
                                        {{settlementInfo.house_price}}元
                                    </div>
                                    <div class="row rows3">
                                        <div class="tit">应收佣金:</div>
                                        {{settlementInfo.expected_commision}}元
                                    </div>
                                    <div class="row rows3">
                                        <div class="tit">实收佣金:</div>
                                        {{settlementInfo.actual_commision}}元
                                    </div>
                                    <div class="row rows1 more-text">
                                        <div class="tit">备注说明:</div>
                                        <p>{{settlementInfo.note}}</p>
                                    </div>
                                    <div class="row rows1 upload">
                                        <div class="tit">合同附件:</div>
                                        <!-- <img :src="item" alt="" v-for="item of settlementInfo.accounting_cert" :key="item.id" class="fl mt15 mr15"> -->
                                        <div class="fl mt15 mr15 imgs-w" @click="ViewBigPhoto(index,value)" v-for="(value,index) of settlementInfo.accounting_cert" :key="index"><img :src="value" alt=""></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <!-- 业绩分成 -->
                    <el-tab-pane label="业绩分成">
                        <div class="performance">
                            <div class="tr" v-if="commissionInfo.actualCommision"><span class="mr20">实收佣金：{{commissionInfo.actualCommision}} 元</span><span class="color-red ml20">剩余结算佣金：{{commissionInfo.restCommission}}</span></div>
                            <el-table :data="commissionInfoTab" style="width: 100%" class="mt10 table-list table-box">
                                <el-table-column label="序号" width="50" type="index">
                                </el-table-column>
                                <!-- show-overflow-tooltip -->
                                <el-table-column label="部门-人员" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span>{{scope.row.depName}}-{{scope.row.eName}}
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="结算次序" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span>第{{sectionToChinese(scope.row.commissionTime)}}次
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="结算金额" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span>{{scope.row.settlementMoney}}
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column property="eCharacter" label="分成原因" width="120">
                                </el-table-column>
                                <el-table-column label="分成比例" width="80">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.rate}}%
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column property="money" label="分成业绩" width="100">
                                </el-table-column>
                                <div slot="empty" class="list-empty">
                                    <img src="../../../assets/images/empty.png" alt="">
                                    <p class="desc">暂无数据</p>
                                </div>
                            </el-table>
                            <div class="sum-wrap" v-show="this.commissionInfoTab.length!=0">
                                <span class="table02">{{commissionInfo.sumMoney}}</span>
                            </div>

                        </div>
                    </el-tab-pane>
                    <!-- 操作记录 -->
                    <el-tab-pane label="操作记录">
                        <div class="operating-record">
                            <el-table :data="updateInfo" style="width: 100%" class="mt10 table-list table-box">
                                <el-table-column prop="createTime" label="操作时间" width="140" :formatter="formatTime">
                                </el-table-column>
                                <el-table-column prop="functionName" label="功能名称" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="logContent" label="内容">
                                </el-table-column>
                                <!-- <el-table-column prop="employeeName" label="操作人" show-overflow-tooltip>
                </el-table-column> -->
                                <el-table-column label="操作人">
                                    <template slot-scope="scope">
                                        <p>{{scope.row.depatmentName}}</p>
                                        <p>({{scope.row.employeeName}})</p>
                                    </template>
                                </el-table-column>
                                <div slot="empty" class="list-empty">
                                    <img src="../../../assets/images/empty.png" alt="">
                                    <p class="desc">暂无数据</p>
                                </div>
                            </el-table>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-dialog>

        <!-- 查看大图的弹层  width="100%" height="100%"-->
        <el-dialog :title="bigImgText" :visible.sync="bigImgVisible" class="bigImgBox">
            <div class="img-box">
                <img :src="bigImg" alt="">
            </div>

        </el-dialog>
    </div>
</template>

<script src="./contractManage.js"></script>
<style lang='scss' src="./contractManage.scss"></style>