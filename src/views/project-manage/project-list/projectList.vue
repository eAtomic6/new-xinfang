<!-- 项目 -->
<template>
    <div class="container" id="projectList">
        <!-- form表单 -->
        <el-form :inline="true" :model="keyWordForm" class="demo-form-inline w-select" min-width="1398px">
            <el-form-item label="省:">
                <el-select v-model="keyWordForm.provinceId" placeholder="全部" size="mini" @change="provinceChange">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="value in allProvinceData" :key="value.provinceId" :label="value.province" :value="value.provinceId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="市:">
                <el-select v-model="keyWordForm.cityId" placeholder="全部" size="mini" @change="cityChange">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="(value,index) in allCityData" :key="index" :label="value.city" :value="value.cityId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="片区:">
                <el-select v-model="keyWordForm.areaId" placeholder="全部" size="mini" @change="areaChange">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="value in allAreaData" :key="value.areaId" :label="value.area" :value="value.areaId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商圈:">
                <el-select v-model="keyWordForm.businessDistrictId" placeholder="全部" size="mini" @change="businessDisChange">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="value in allBusinessData" :key="value.businessDistrictId" :label="value.businessDistrict" :value="value.businessDistrictId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="公司:" >
                <el-select v-model="keyWordForm.commercialInfo" placeholder="全部" size="mini" :disabled="isShowCompanyId<0 ? false : true">
                    <el-option label="全部" :value=-500></el-option>
                    <el-option label="中房科瑞" :value=-1></el-option>
                    <el-option v-for="value in keyWordCompany" :key="value.d_id" :label="value.name" :value="value.d_id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目状态:" class="project-projectStatus">
                <el-select v-model="projectStateArr" multiple placeholder="全部" size="mini" @change="projectStateChange" v-if="dictionary['117']">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="value in dictionary['117'].children" :label="value.value" :value="value.key" :key="value.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="项目类型:">
                <el-select v-model="keyWordForm.projectType" placeholder="全部" size="mini" v-if="dictionary['111']">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="value in project_type" :label="value.name" :value="value.code" :key="value.code"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发布系统:" class="project-projectStatus">
                <el-select v-model="publicSystemArr" multiple placeholder="全部" size="mini" @change="projectSystemChange" v-if="dictionary['111']">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="掌新房" :value="2"></el-option>
                    <el-option label="吉家网" :value="1"></el-option>
                    <el-option label="渠道" :value="4"></el-option>
                    <el-option label="未发布" :value="0"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="搜索:">
                <el-select v-model="keyWordForm.searchType" placeholder="全部" size="mini">
                    <el-option label="项目搜索" :value="1"></el-option>
                    <el-option label="驻场搜索" :value="2"></el-option>
                    <el-option label="吉家联系人搜索" :value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关键词: ">
                <el-input v-model="keyWordForm.keyword" placeholder="请输入关键词" size="mini"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="onSearch" class="search-but">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="onReset" class="chongzhi-but">重置</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="addProjectBtn" background-color="#72A0D1" class="but-lightblue"><span class="el-icon-circle-plus-outline org-icon"></span>新增
                </el-button>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onExport" class="but-lightblue"><span class="icon icon-daochu org-icon"></span>导出</el-button>
            </el-form-item>
        </el-form>
        
        <!-- 新增 弹出框 -->
        <el-dialog title="新增项目" :visible.sync="dialogAddFormVisible" :before-close="handleClose" top="40px" class="dialog-info">
            <el-dialog title="强推项目排序列表" :visible.sync="projectSortDiaolog" append-to-body width="950px">
                <project-sort v-if="projectSortDiaolog" :lookSortForm="lookSortForm"></project-sort>
            </el-dialog>
            <el-dialog title="选取位置" :visible.sync="getLocationDialog" append-to-body width="600px">
                <get-location v-if="getLocationDialog" :defaultLocation="defaultLocation" @getProjectLocation="getProjectLocation"></get-location>
            </el-dialog>
            <el-form :model="addForm" :inline="true" :rules="rules" ref="addForm" label-position="left" class="add-project">
                <!-- 供求类型 -->
                <div class="form-row-info">
                    <span>供求类型<br><i style="color:red;font-weight:normal">(必填)</i></span>
                    <div class="info-content info-content_top">
                        <el-form-item label="项 目 类 型 :" prop="projectType">
                            <el-radio-group v-model="addForm.projectType" v-if="dictionary['111']">
                                <el-radio v-for="item in project_type" :key="item.code" :label="item.code">{{item.name}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="项 目 状 态 :" prop="projectState">
                            <el-radio-group v-model="addForm.projectState" v-if="dictionary['117']" @change="projectStatusChange1">
                                <el-radio v-for="(item,index) in dictionary['117'].children" :key="index" :label="item.key">{{item.value}}</el-radio>
                            </el-radio-group>
                             <div v-show="isShowProjectSort1" class="project-listSort">
                                 排序: <el-select v-model="addForm.decoration">
                                    <el-option v-for="item in projectSortData" :label="item.serialNumber" :key="item.decoration" :value="item.decoration">
                                    </el-option>
                                </el-select>
                                <el-button @click="lookProjectSort">查看排序</el-button>
                             </div>
                        </el-form-item>
                        <el-form-item label="项 目 归 属 :" prop="projectAgent">
                            <el-radio-group v-model="addForm.projectAgent">
                                <el-radio :label="1">公司总包</el-radio>
                                <el-radio :label="2">合作分销</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <div>
                            <el-form-item label="开 盘 时 间 :" prop="specificOpeningTime">
                                <el-date-picker v-model="addForm.specificOpeningTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                        </div>
                    </div>
                </div>
                <div class="form-row-info">
                    <span>基本信息<br><i style="color:red;font-weight:normal">(必填)</i></span>
                    <div class="info-content">
                        <el-form-item required>
                            <el-col :span="12">
                                <el-form-item label="项 目 名 称 :" prop="name">
                                    <el-input v-model="addForm.name" maxlength=20></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="所 属 省 市 :" prop="provinceId">
                                    <el-select v-model="addForm.provinceId" @change="addProvinceChange">
                                        <el-option v-for="value in cityList" :key="value.ID" :label="value.ProvinceName" :value="value.ID"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="" prop="cityId">
                                    <el-select v-model="addForm.cityId" @change="addCityChange" ref="province">
                                        <el-option v-for="value in allCity" :key="value.CityID" :label="value.CityName" :value="value.CityID"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item required>
                            <el-col :span="12">
                                <el-form-item label="所 属 区 域 :" prop="areaId">
                                    <el-select v-model="addForm.areaId" @change="addAreaChange">
                                        <el-option v-for="value in allArea" :key="value.ID" :label="value.AreaName" :value="value.ID"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="所 属 商 圈 :" prop="businessDistrictId">
                                    <el-select v-model="addForm.businessDistrictId" @change="businessChange">
                                        <el-option v-for="value in allBusiness" :key="value.ShangQuanName" :label="value.ShangQuanName" :value="value.ID"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="项 目 价 格 :" prop="buildingPrice">
                            <el-input v-model="addForm.buildingPrice" oninput="value=value.replace(/[^\d]/g,'')" maxlength=6 >
                                <template slot="append">元/平方</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="项 目 地 址 :" prop="address" class="project_address">
                            <el-input v-model="addForm.address" maxlength=100></el-input>
                        </el-form-item>
                        <el-form-item label="地 图 坐 标 :" prop="coordinate" class="map-location">
                            <el-input v-model="addForm.coordinate"></el-input>
                            <!-- <a href="https://lbs.amap.com/console/show/picker" @click="clickGetLocation" target="_blank" class="a-coord">拾取坐标</a> -->
                            <a href="#" @click="clickGetLocation('1')" class="a-coord">拾取坐标</a>
                            <!-- <a href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank" class="a-coord">拾取坐标</a> -->
                        </el-form-item>
                        <!-- <el-form-item label="是否上架:" prop="statusSell">
                            <el-radio-group v-model="addForm.statusSell" v-if="dictionary['123']">
                                <el-radio v-for="(item,key) in dictionary['123'].children" :key="key" :label="item.key">{{item.value}}</el-radio>
                            </el-radio-group>
                        </el-form-item> -->
                        <el-form-item label="楼 盘 性 质 :" prop="buildingProperty">
                            <el-radio-group v-model="addForm.buildingProperty" v-if="dictionary['208']">
                                <el-radio v-for="(item,index) in dictionary['208'].children" :key="index" :label="item.key">{{item.value}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <!-- <el-form-item label="同步系统:" prop="platform">
                            <el-checkbox-group v-model="addForm.platform" v-if="dictionary['145']">
                                <el-checkbox v-for="item in dictionary['145'].children" :label="item.key" name="type">{{item.value}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item> -->
                    </div>
                </div>
                <div class="form-row-info project_protectTime">
                    <span>保护期<br><i style="color:red;font-weight:normal">(必填)</i></span>
                    <div class="info-content">
                        <el-form-item required>
                            <div class="space-between">
                                <el-col :span="12">
                                    <el-form-item label="项目有效类型:" prop="customerType">
                                        <el-select v-model="addForm.customerType" size="mini" v-if="dictionary['126']">
                                            <el-option v-for="(item,index) in dictionary['126'].children" :key="index" :label="item.value" :value="item.key"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10">
                                    <el-form-item label="佣金:" class="removeFlase">
                                        <el-input v-model="addForm.moneyUnit"></el-input>
                                    </el-form-item>
                                </el-col>
                            </div>

                        </el-form-item>
                        <el-form-item required>
                            <el-col :span="24">
                                <el-form-item label="佣 金 规 则 :" class="removeFlase">
                                    <el-input v-model="addForm.moneyDes" type="textarea" maxlength=300>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="14">
                                <el-form-item label="报 备 类 型 :" prop="reportingType">
                                    <el-radio-group v-model="addForm.reportingType" @change="protectTypeChange">
                                        <el-radio label="1">保护期</el-radio>
                                        <el-radio label="2">定点</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item v-if="addForm.reportingType == 2" label="定点保护期:" class="project_paperTime" prop="fixedPointProtectionPeriod">
                                     <el-time-picker
                                        value-format="HH:mm"
                                        v-model="addForm.fixedPointProtectionPeriod"
                                        format="HH:mm"
                                        placeholder="任意时间点">
                                    </el-time-picker>
                                </el-form-item>
                                <el-form-item label="报备保护期:" prop="proTimeAgentReport" v-if="addForm.reportingType == 1">
                                    <el-input v-model="addForm.proTimeAgentReport"  oninput="value=value.replace(/[^\d]/g,'')">
                                        <template slot="append">小时</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item required>
                            <el-col :span="24">
                                <el-form-item label="报 备 规 则 :" class="protactInfo removeFlase">
                                    <el-input v-model="addForm.reportRule" type="textarea" maxlength=500></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item required>
                            <el-col :span="12">
                                <el-form-item label="带看保护期:" prop="proTimeAgentLook">
                                    <el-input v-model="addForm.proTimeAgentLook" @keyup.native="getInt('proTimeAgentLook')">
                                        <template slot="append">小时</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="下定保护期:" class="removeFlase">
                                    <el-input v-model="addForm.proTimeDownPayment" @keyup.native="getInt('proTimeDownPayment')">
                                        <template slot="append">小时</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                    </div>
                </div>
                <div class="form-row-info">
                    <span>合同信息</span>
                    <div class="info-content">
                        <el-form-item>
                            <el-col :span="24">
                                <el-form-item label="合同截止时间:">
                                    <el-date-picker v-model="addForm.timeOfEnd" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item v-show="addForm.timeOfEnd">
                            <el-checkbox label="合同到期下架" v-model="addForm.lowerFrame"></el-checkbox>
                            <span style="color: red;fontSize: 12px;" class="timeOfEnd-tips">合同到期前10天短信通知项目负责人。</span>
                        </el-form-item>
                    </div>
                </div>
                <div class="form-row-info">
                    <span>项目图片</span>
                    <div class="info-content upload-info">
                        <ul class="upload-image-list">
                         <viewer :images="addForm.projectPictureList" style="display:inherit">
                            <li v-for="(item,picIndex) in addForm.projectPictureList" :key="item.imgUrl">
                                <img :src="item.imgUrl" alt="" @click="clickProject_Img('showImg_',picIndex)" :ref="'showImg_'">
                                <span @click="uploadImageOpera(item,'del')">X</span>
                                <!-- <span :class="[coverPhoto===item.imgUrl?'cover-photo':'']" @click="uploadImageOpera(item)">设为封面</span> -->
                            </li>
                         </viewer>
                            <li class="upload-box">
                                <uploadImg :id="'pic'"  @getDataUrl="getDataUrl('item',1,arguments)" :rules="['jpg','gif','png','bmp']">
                                <!-- <input type="file" @change="upLoadImage" v-show="false" ref="upload"> -->
                                <p class="upload-btn gallery-window-opera"><span>+</span></p>
                                </uploadImg>
                            </li>
                        </ul>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addPro" class="pop-submitbtn">确 定</el-button>
                <el-button type="cancel" @click="dialogAddFormVisible = false" class="pop-cancelbtn">取 消</el-button>
            </div>
        </el-dialog>
        <!--===============================新项目列表html开始==================================== -->
        <div class="newProject_list">
            <ul>
                <li v-for="item in xinProjectData" :key="item.id" @dblclick="goProDetails(item.id)">
                    <div class="fl">
                        <img :src="item.cover_photo" alt="">
                    </div>
                    <div class="fl newProject_two">
                        <ul>
                            <li>
                                <h3>{{item.name}}</h3>
                                <span>{{item.projectStateString}}</span>
                                <!-- <span>{{item.statusSellString}}</span> -->
                                <span>{{item.buildingPropertyString}}</span>
                                <span>{{item.customerTypeString}}</span>
                                <span v-if="item.platformString" v-for="value in item.platformString.split(',')" :key="value">{{value}}</span>
                                <!-- <span v-show="item.platformString">{{item.platformString}}</span> -->
                            </li>
                            <li>
                                <span><label>项目类型：</label>{{item.projectTypeString}}</span>
                                <span v-if="item.reporting_type == 1"><label>报备保护期：</label>{{item.pro_time_agent_report}}小时</span>
                                <span v-if="item.reporting_type == 2"><label>定点保护期：</label>{{item.fixed_point_protection_period}}</span>
                                <span><label>带看保护期：</label>{{item.pro_time_agent_look}}小时</span>
                            </li>
                            <li>
                                <span><label>项目负责人：</label>{{item.leader}}</span>
                                <span><label>负责人电话：</label>{{item.leader_mobile}}</span>
                                <span><label>驻场人数：</label>{{item.field_number}}</span>
                            </li>
                            <li>
                                <label>楼盘地址：</label>
                                    <span>{{item.province}}</span>
                                    <span>{{item.city}}</span>
                                    <span>{{item.area}}</span>
                                    <span>{{item.businessDistrict}}</span>
                            </li>
                            <li>
                                <span><label>户型图</label>( {{item.unit_number}} )</span>
                                <span><label>相册</label>( {{item.number_of_albums}} )</span>
                                <span><label>项目视频</label>( {{item.videoSum}} )</span>
                                <span><label>动态</label>( {{item.dynamicQuantity}} )</span>
                            </li>
                        </ul>
                    </div>
                    <div class="fr newProject_three">
                        <ul>
                            <li>{{item.building_price}}元/m²</li>
                            <!-- <li>
                                <label>信息完整度：</label>
                                {{item.unit_number}}%
                                <el-tooltip placement="top">
                                    <div slot="content">项目分数：<br />根据项目资料完成度系统评估项目分数。<br />没添加一份资料增加2.5分，分数越高，<br />在吉家网排名越靠前。</div>
                                    <span class="el-icon-question"></span>
                                </el-tooltip>
                            </li> -->
                            <li>
                                <span @click="clickSynBtn(item)"><i class="icon icon-fabu"></i> 发布</span>
                                <span @click="clickDisBtn(item.id)"><i class="icon icon-zhuchang"></i> 驻场</span>
                                <span @click="openHouseType(item.id)"><i class="icon icon-huxing"></i> 户型</span>
                                <span @click="clickPhotoBtn(item.id)"><i class="icon icon-tupian"></i> 图片</span>
                                <span @click="toEdit(item.id,item.name)"><i class="icon icon-bianji"></i> 编辑</span>
                                <span @click="getDynamic(item.id)"><i class="icon icon-dongtai"></i> 动态</span>
                                <span @click="getProjectStatistics('init',item.id)"><i class="icon icon-tongji"></i> 统计</span>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="pageSizesList" :page-size="pageSize" layout="prev, pager, next,  total, sizes, jumper" :total="count">
            </el-pagination>
        </div>
        <!-- ========================================点击项目列表动态时开始======================================== -->
        <el-dialog title="发布动态" :visible.sync="releasedDynamicDlg" v-if="releasedDynamicDlg" @close="closeReleaDialog" width="700px">
            <rele-dynamic @getNewTable="getNewProjectData" :projectId="clickProjectId" :checkINT="checkINT"  @closeReleaDialog="closeReleaDialog" :releasedDynamicData="releasedDynamicData"></rele-dynamic>
        </el-dialog>
        <!-- ========================================点击项目列表动态时结束======================================== -->
        <!-- ==========================点击项目列表图片时的弹框组件开始============================== -->
        <el-dialog title="项目相册" :visible.sync="photoBox" width="55%" height="660px" @close="closePhotoBox">
            <photo-dialog :projectId="clickProjectId" v-if="photoBox"></photo-dialog>
        </el-dialog>
        <!-- ==========================点击项目列表图片时的弹框组件结束============================== -->

        <!-- ==========================点击发布时的弹框组件开始============================== -->
        <el-dialog title="发布系统" :visible.sync="syncBox" width="500px">
            <announce-dialog :projectId="announceDiaData" @close="closeAnnounceBox"></announce-dialog>
        </el-dialog>
        <!-- ==========================点击发布时的弹框组件结束============================== -->
        <!-- ==========================点击明细时的弹框组件开始============================== -->
        <el-dialog title="项目明细" :visible.sync="projectDetail"  width="900px">
            <projectDetails v-if="projectDetail" @getDeleteNewData="getNewProjectData" ref="detailChild" @editReleaMethod="editReleaMethod" :proDetail="proDetailId"></projectDetails>
        </el-dialog>
        <!-- ==========================点击明细时的弹框组件结束============================== -->

        <!-- ==========================点击分配驻场时的弹框组件开始============================== -->
        <div class="projectList_dis">
            <el-dialog title="项目驻场" :visible.sync="distributeBox" width="40%" @close="closeDistributeBox" height="500px">
                <i class="icon icon-zengjia distributeBtn" @click="clickPutPerson">分配人员</i>
                <el-table :data="personTableData" height="300">
                    <el-table-column prop="title" label="职务">
                    </el-table-column>
                    <el-table-column prop="name" label="姓名">
                    </el-table-column>
                    <el-table-column prop="mobile" label="联系电话">
                    </el-table-column>
                    <el-table-column prop="meaning" label="电话规则">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <div @click="setPhoneRule(scope.row)" style="color:#66b1ff;">设置电话规则</div>
                            <el-button @click.native.prevent="confirmDelRowindex(scope.row)" type="text">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 点击设置电话规则弹出框 -->
                <el-dialog title="设置电话规则" :visible.sync="setPhoneRuleBox" width="400px" append-to-body class="person-visible phone_rule">
                    <div class="input-group">
                        <label>项目驻场:</label>
                        <span>{{setPhoneRuleForm.name}}</span>
                    </div>
                    <div class="input-group">
                        <label>职务:</label>
                        <span>{{setPhoneRuleForm.title}}</span>
                    </div>
                    <div class="input-group">
                        <label>电话报备规则:</label>
                        <el-radio-group v-model="setPhoneRuleForm.mobile_show_mode">
                            <el-radio :label="2">前三后四</el-radio>
                            <el-radio :label="1">全部显示</el-radio>
                        </el-radio-group>
                    </div>
                    <p class="input-group-opera">
                        <el-button @click="submitPhoneRule" class="pop-submitbtn">确 定</el-button>
                        <el-button @click="setPhoneRuleBox=false" class="pop-cancelbtn">取 消</el-button>
                    </p>
                </el-dialog>

                <!-- 内层 分配人员模态框 -->
                <el-dialog width="30%" title="分配人员" :visible.sync="personVisible" append-to-body class="person-visible">
                    <div class="input-group">
                        <label class="input-group-target">项目驻场:</label>
                        <input type="text" v-model="allotPersonForm.name" @keyup.enter="searchStaff">
                        <ul class="staff-search-list" v-if="staffSearch.length>0">
                            <li v-for="item in staffSearch" :key="item.e_id" @click="setProjectPerson(item)">{{item.e_name}} <span style="color:#ccc"> ({{item.cd_name}} -- {{item.d_name}}) </span></li>
                        </ul>
                    </div>
                    <div class="input-group">
                        <label>电话:</label>
                        <span>{{allotPersonForm.phone}}</span>
                    </div>
                    <div class="input-group">
                        <label>职务:</label>
                        <span>{{allotPersonForm.duty}}</span>
                    </div>
                    <div class="input-group">
                        <label>电话报备规则:</label>
                        <el-radio-group v-model="allotPersonForm.mobileShowMode">
                            <el-radio :label="2">前三后四</el-radio>
                            <el-radio :label="1">全部显示</el-radio>
                        </el-radio-group>
                    </div>
                    <p class="input-group-opera">
                        <el-button @click="submitAllotPersonForm" class="pop-submitbtn">确 定</el-button>
                        <el-button @click="cancelAllotPersonForm" class="pop-cancelbtn">取 消</el-button>
                    </p>
                </el-dialog>
                <!-- 确认删除 模态框 -->
                <el-dialog title="提示" :visible.sync="confirmDelVisible" width="400px" append-to-body class="projectlist-confirm-del">
                    <!-- <p style="text-align:center">{{deleteRowMessage}}</p> -->
                    <span class="word-del-confirm"> 
                        <i class="el-icon-info"></i>您确定删除吗?</span>
                    <span slot="footer" class="dialog-footer projectlist-btn-okCancel">
                        <el-button type="primary" @click="confirmDeleteRow(delRowindex,personTableData)" class="pop-submitbtn">确 定</el-button>
                        <el-button type="cancel" @click="confirmDelVisible = false" class="pop-cancelbtn">取 消</el-button>
                    </span>
                </el-dialog>
            </el-dialog>
        </div>
        <!-- ==========================点击分配驻场时的弹框组件结束============================== -->
        <!--===============================新项目列表html结束==================================== -->
        <!--单击弹出 项目编辑 模态框  -->
        <el-dialog title="项目编辑" :visible.sync="EditVisible" :before-close="handleClose" class="dialog-info edit_projectForm" top="40px">
            <el-dialog title="选取位置" :visible.sync="getLocationDialog" append-to-body width="600px">
                <get-location v-if="getLocationDialog" :defaultLocation="defaultLocation" @getProjectLocation="getProjectLocation1" ></get-location>
            </el-dialog>
            <el-dialog class="edit_lookEditor" :visible.sync="lookEditorBox" append-to-body >
                <div class="edit_lookContent">
                    <div class="edit_lookTitle" v-html="editDialogform.projectProfile"></div>
                    <div class="edit_lookFooter">
                        <el-button type="warning" @click="lookEditorBox = false">关闭</el-button>
                        <el-button type="success" @click="submitEditForm(0)">保存</el-button>
                    </div>
                </div>
                <img src="../../../assets/images/lookEditor.png" alt="">
               
            </el-dialog>
            <!-- =======================================删除项目弹框开始======================================= -->
            <el-dialog class="project-deleteProject" :before-close="defaultMessage" :title="delProjectTitle" :visible.sync="deleteProject" append-to-body width="500px">
                <delete-project v-if="deleteProject" @sureDelProject="sureDelProject" @closeDelDialog="closeDelDialog" :projectId="deleteProjectId"></delete-project>
            </el-dialog>
            <!-- =======================================删除项目弹框结束======================================= -->
            <!-- =======================================项目排序列表开始======================================= -->
            <el-dialog title="强推项目排序列表" :visible.sync="projectSortDiaolog" append-to-body width="950px">
                <project-sort v-if="projectSortDiaolog" :lookSortForm="lookSortForm"></project-sort>
            </el-dialog>
            <!-- =======================================项目排序列表结束======================================= -->
            <span class="projectlist-dialog-smtitle">[{{editProject_title}}]</span>
            <el-tabs type="border-card">
                <!-- 基本信息表单 -->
                <el-tab-pane label="基本信息" class="base-info">
                    <el-form :model="editDialogform" :inline="true" :rules="rules" ref="editForm" label-position="left">
                        <!-- 供求类型 -->
                        <div class="other-type">
                            <div class="info-content info-content_top">
                                <el-form-item label="项目类型:" prop="projectType">
                                    <el-radio-group v-model="editDialogform.projectType" v-if="dictionary['111']">
                                        <el-radio v-for="(item,index) in project_type" :label="item.code" :key="index">{{item.name}}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="项目状态:" prop="projectState">
                                    <el-radio-group v-model="editDialogform.projectState" v-if="dictionary['117']" @change="projectStatusChange2">
                                        <el-radio v-for="(item,index) in dictionary['117'].children" :key="index" :label="item.key">{{item.value}}</el-radio>
                                        <el-radio label="10" v-if="editDialogform.deletePermission">删除</el-radio>
                                    </el-radio-group>
                                        <div v-show="isShowProjectSort2" class="project-listSort">
                                        <span>排序: </span><el-select v-model="editDialogform.decoration">
                                             <el-option v-for="item in projectSortData" :label="item.serialNumber" :key="item.id" :value="item.decoration">
                                                </el-option>
                                        </el-select>
                                        <el-button @click="editLookSort">查看排序</el-button>
                                    </div>
                                </el-form-item>
                                <el-form-item label="项目归属:" prop="projectAgent">
                                <el-radio-group v-model="editDialogform.projectAgent">
                                    <el-radio :label="1">公司总包</el-radio>
                                        <el-radio :label="2">合作分销</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <div>
                                    <el-form-item label="开盘时间:" prop="specificOpeningTime">
                                        <el-date-picker v-model="editDialogform.specificOpeningTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                                        </el-date-picker>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="form-row-info other-type">
                                <div class="info-content">
                                    <el-form-item required class="full">
                                        <div class="space-between">
                                            <el-col :span="12">
                                                <el-form-item label="项目编号:" class="project_number">
                                                    <p style="min-width:232px;">{{editDialogform.projectNumber}}</p>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="项目名称:" prop="name">
                                                    <el-input v-model="editDialogform.name" maxlength=20></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </div>
                                    </el-form-item>
                                    <el-form-item required>
                                        <el-col :span="7">
                                            <el-form-item label="所属省市:" prop="provinceId">
                                                <el-select v-model="editDialogform.provinceId" @change="addProvinceChange">
                                                    <el-option v-for="value in cityList" :key="value.ID" :label="value.ProvinceName" :value="value.ID"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item label="" prop="cityId">
                                                <el-select v-model="editDialogform.cityId" @change="addCityChange" ref="province">
                                                    <el-option v-for="value in allCity" :key="value.CityID" :label="value.CityName" :value="value.CityID"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="7">
                                            <el-form-item label="所属区域:" prop="areaId">
                                                <el-select v-model="editDialogform.areaId" @change="addAreaChange">
                                                    <el-option v-for="value in allArea" :key="value.ID" :label="value.AreaName" :value="value.ID"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="7">
                                            <el-form-item label="所属商圈:" prop="businessDistrictId">
                                                <el-select v-model="editDialogform.businessDistrictId" @change="businessChange">
                                                    <el-option v-for="value in allBusiness" :key="value.ShangQuanName" :label="value.ShangQuanName" :value="value.ID"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                    </el-form-item>
                                    <el-form-item label="项目价格:" prop="buildingPrice">
                                        <el-input v-model="editDialogform.buildingPrice" oninput="value=value.replace(/[^\d]/g,'')" maxlength=6>
                                            <template slot="append">元/平方</template>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item class="full">
                                        <el-col :span="12">
                                            <el-form-item label="项目地址:" prop="address">
                                                <el-input v-model="editDialogform.address" maxlength=100></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="地图坐标:" prop="coordinate" class="map-location">
                                                <el-input v-model="editDialogform.coordinate"></el-input>
                                                <a href="#" @click="clickGetLocation('2')" class="a-coord">拾取坐标</a>
                                                <!-- <a href="https://lbs.amap.com/console/show/picker" target="_blank" class="a-coord">拾取坐标</a> -->
                                                <!-- <a href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank" class="a-coord">拾取坐标</a> -->
                                            </el-form-item>
                                        </el-col>
                                    </el-form-item>
                                    <el-form-item class="full">
                                        <el-col :span="12">
                                            <el-form-item label="项目负责人:" prop="leader">
                                                <el-input v-model="editDialogform.leader" maxlength=10></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="负责人电话:" prop="leaderMobile">
                                                <el-input v-model="editDialogform.leaderMobile" maxlength="11"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-form-item>

                                    <el-form-item label="建筑类型:" prop="buildingType">
                                        <!-- <el-radio-group v-model="editDialogform.buildingType" v-if="dictionary['135']">
                                        <el-radio v-for="item in dictionary['135'].children" :label="item.key">{{item.value}}</el-radio>
                                    </el-radio-group> -->
                                        <el-checkbox-group v-model="editDialogform.buildingType" v-if="dictionary['135']">
                                            <el-checkbox v-for="(item,index) in dictionary['135'].children" :key="index" :label="item.key">{{item.value}}
                                            </el-checkbox>
                                        </el-checkbox-group>
                                    </el-form-item>

                                    <el-form-item label="楼盘性质:" prop="buildingProperty" class="project_state">
                                        <el-radio-group v-model="editDialogform.buildingProperty" v-if="dictionary['208']">
                                            <el-radio v-for="(item,index) in dictionary['208'].children" :key="index" :label="item.key">{{item.value}}</el-radio>
                                        </el-radio-group>
                                    </el-form-item>

                                    <el-form-item label="楼盘特色:" prop="features">
                                        <el-checkbox-group v-model="editDialogform.features" v-if="dictionary['149']">
                                            <el-checkbox v-for="(item,index) in project_special" :key="index" :label="item.codeBinary" name="type">{{item.name}}
                                            </el-checkbox>
                                        </el-checkbox-group>
                                    </el-form-item>
                                    <!-- <el-form-item label="是否上架:" prop="statusSell">
                                        <el-radio-group v-model="editDialogform.statusSell" v-if="dictionary['123']">
                                            <el-radio v-for="(item,index) in dictionary['123'].children" :key="index" :label="item.key">{{item.value}}</el-radio>
                                        </el-radio-group>
                                    </el-form-item> -->
                                    <el-form-item label="基础设施:" prop="infrastructure">
                                        <el-checkbox-group v-model="editDialogform.infrastructure" v-if="dictionary['160']">
                                            <el-checkbox v-for="(item,index) in dictionary['160'].children" :key="index" :label="item.key" name="type">{{item.value}}
                                            </el-checkbox>
                                        </el-checkbox-group>
                                    </el-form-item>
                                    <!-- <el-form-item label="同步系统:" prop="platform">
                                    <el-checkbox-group v-model="editDialogform.platform" v-if="dictionary['145']">
                                        <el-checkbox v-for="item in dictionary['145'].children" :label="item.key" name="type">{{item.value}}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item> -->
                                </div>
                            </div>
                        </div>
                    </el-form>
                </el-tab-pane>
                <!-- 销售信息表单 -->
                <el-tab-pane label="销售信息" class="sell-form">
                    <el-form :model="editDialogform" :rules="rules" ref="sellinfoRules" :inline="true" label-width="80px">
                        <h3 class="eidtProject_title">建筑规划</h3>
                        <div class="space-between">
                            <el-form-item label="开 发 商:" prop="developers">
                                <el-input v-model="editDialogform.developer" maxlength=50 placeholder="最多输入50个字符"></el-input>
                            </el-form-item>
                            <el-form-item label="投  资  商:">
                                <el-input v-model="editDialogform.investors" maxlength=50 placeholder="最多输入50个字符"></el-input>
                            </el-form-item>
                        </div>
                        <!-- <el-form-item label="开盘时间:" prop="openTime">
                            <el-input v-model="editDialogform.openingTime" maxlength=20 placeholder="最多输入20个字符"></el-input>
                        </el-form-item> -->
                        <div class="space-between">
                            <el-form-item label="产权年限:">
                                <el-input v-model="editDialogform.yearsOfPropertyRights" maxlength=50 placeholder="最多输入50个字符"></el-input>
                            </el-form-item>
                            <el-form-item label="装修标准:">
                                <el-input v-model="editDialogform.decorationStandard" maxlength=50 placeholder="最多输入50个字符"></el-input>
                            </el-form-item>
                        </div>
                        <div class="space-between">
                            <el-form-item label="容 积 率:" prop="investor">
                                <el-input v-model="editDialogform.volumetricRate" maxlength=50 placeholder="最多输入50个字符"></el-input>
                            </el-form-item>
                            <el-form-item label="总 户 数:" prop="investor">
                                <el-input v-model="editDialogform.floorCondition" maxlength=50 placeholder="最多输入50个字符"></el-input>
                            </el-form-item>
                        </div>
                        <div class="space-between">
                            <el-form-item label="楼 栋 数:">
                                <el-input v-model="editDialogform.numberOfFloor" maxlength=10 placeholder="最多输入10个字符"></el-input>
                            </el-form-item>
                            <el-form-item label="占地面积:" prop="investor">
                                <el-input v-model="editDialogform.areaCovered" maxlength=50 placeholder="最多输入50个字符"></el-input>
                            </el-form-item>
                        </div>
                        <div class="space-between">
                            <el-form-item label="建筑面积:" prop="investor">
                                <el-input v-model="editDialogform.architectureArea" maxlength=50 placeholder="最多输入50个字符"></el-input>
                            </el-form-item>
                            <el-form-item label="工程进度:" prop="investor">
                                <el-input v-model="editDialogform.projectProgress" maxlength=50 placeholder="最多输入50个字符"></el-input>
                            </el-form-item>
                        </div>
                        <h3 class="eidtProject_title">物业信息</h3>
                        <div class="space-between">
                            <el-form-item label="物业公司:" prop="company">
                                <el-input v-model="editDialogform.propertyCompany" maxlength=50 placeholder="最多输入50个字符"></el-input>
                            </el-form-item>
                            <el-form-item label="物业费用:" prop="company">
                                <el-input v-model="editDialogform.propertyCost" maxlength=50 placeholder="最多输入50个字符"></el-input>
                            </el-form-item>
                        </div>
                        <div class="space-between">
                            <el-form-item label="车位数量:" prop="company">
                                <el-input v-model="editDialogform.numberOfParkingSpaces" maxlength=50 placeholder="最多输入50个字符"></el-input>
                            </el-form-item>
                            <el-form-item label="车位比例:" prop="company">
                                <el-input v-model="editDialogform.parkingRatio" maxlength=50 placeholder="最多输入50个字符"></el-input>
                            </el-form-item>
                        </div>
                        <el-form-item label="物业电话:" prop="phone">
                            <el-input v-model="editDialogform.salesPhone" maxlength=15 placeholder="最多输入15个字符"></el-input>
                        </el-form-item>
                        <h3 class="eidtProject_title">楼盘简介</h3>
                        <el-form-item label="项目简介:" prop="brief" class="project_intro">
                            <!-- <edit-com :editContent="editDialogform.projectProfile" @editorChange="editorChange">
                            </edit-com> -->
                            <el-input type="textarea" v-model="editDialogform.projectProfile" maxlength=500 placeholder="最多输入500个字符"></el-input>
                        </el-form-item>
                        <span class="eidtProject_lookEditor" @click="lookEditor">手机预览</span>
                    </el-form>
                </el-tab-pane>
                <!-- 保护期表单 -->
                <el-tab-pane label="保护期" class="protection-time">
                    <el-form :model="editDialogform" :rules="rules" ref="protectionRules" label-position="left">
                        <div class="form-row-info">
                            <div class="info-content label-init">
                                <el-form-item required>
                                    <el-col :span="13">
                                        <el-form-item label="项目有效类型:" prop="customerType">
                                            <el-select v-model="editDialogform.customerType" size="mini" v-if="dictionary['126']">
                                                <el-option v-for="(item,index) in dictionary['126'].children" :key="index" :label="item.value" :value="item.key"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="13">
                                        <el-form-item label=" 佣 金 :" class="removeFlase">
                                            <el-input v-model="editDialogform.moneyUnit"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-form-item>
                                <el-form-item required>
                                    <el-col :span="24">
                                        <el-form-item label="佣 金 规 则:" class="removeFlase">
                                            <el-input v-model="editDialogform.moneyDes" type="textarea" maxlength=300></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="13">
                                <el-form-item label="报 备 类 型:" prop="reportingType">
                                    <el-radio-group v-model="editDialogform.reportingType" @change="protectTypeChange">
                                        <el-radio :label="1">保护期</el-radio>
                                        <el-radio :label="2">定点</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item  prop="fixedPointProtectionPeriod" v-if="editDialogform.reportingType == 2" label="定点保护期:" class="project_paperTime">
                                     <el-time-picker
                                        value-format="HH:mm"
                                        v-model="editDialogform.fixedPointProtectionPeriod"
                                        format="HH:mm"
                                        placeholder="任意时间点">
                                    </el-time-picker>
                                </el-form-item>
                                <el-form-item label="报备保护期:" prop="proTimeAgentReport" class="project_protectTime" v-if="editDialogform.reportingType == 1">
                                    <el-input v-model="editDialogform.proTimeAgentReport"  oninput="value=value.replace(/[^\d]/g,'')">
                                        <template slot="append">小时</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                                </el-form-item>
                                <el-form-item required>
                                    <el-col :span="24">
                                        <el-form-item label="报 备 规 则:" class="removeFlase">
                                            <el-input v-model="editDialogform.reportRule" type="textarea" maxlength=500></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-form-item>
                                <div class="space-between">
                                    <el-col :span="11">
                                        <el-form-item label="带看保护期:" prop="proTimeAgentLook">
                                            <el-input v-model="editDialogform.proTimeAgentLook"></el-input>
                                            <span class="projectList_time">小时</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="下定保护期:"  class="removeFlase"  >
                                            <el-input v-model="editDialogform.proTimeDownPayment"></el-input>
                                            <span class="projectList_time">小时</span>
                                        </el-form-item>
                                    </el-col>
                                </div>
                            </div>
                        </div>
                    </el-form>
                </el-tab-pane>
                <!-- 合同信息表单 -->
                <el-tab-pane label="合同信息" class="contract-form">
                    <el-form :model="editDialogform" :rules="rules" ref="contractRules" label-position="right" label-width="100px">
                        <el-form-item label="公司全称:" prop="company">
                            <el-input v-model="editDialogform.contractCompanName"></el-input>
                        </el-form-item>
                        <el-form-item label="公司税号:" prop="dutyNumber">
                            <el-input v-model="editDialogform.contractEin"></el-input>
                        </el-form-item>
                        <el-form-item label="票别:" prop="ticketType">
                            <el-radio-group v-model="editDialogform.contractEinKind" v-if="dictionary['129']">
                                <el-radio v-for="item in dictionary['129'].children" :key="item.key" :label="item.key">{{item.value}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="开户行及账号:" prop="bankNumber">
                            <el-input v-model="editDialogform.contractBank"></el-input>
                        </el-form-item>
                        <el-form-item label="地址及电话:" prop="adressPhone">
                            <el-input v-model="editDialogform.contractAddress"></el-input>
                        </el-form-item>
                        <el-form-item label="合同截止日期:">
                            <el-date-picker v-model="editDialogform.timeOfEnd" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="合同到期下架:" v-show="editDialogform.timeOfEnd">
                            <el-checkbox label="合同到期下架" v-model="editDialogform.lowerFrame"></el-checkbox>
                        </el-form-item>
                        <el-form-item label="结佣标准:" prop="commission">
                            <el-input type="textarea" v-model="editDialogform.contractKnotCommission"></el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
            <div class="card-footer">
                <el-button type="primary" @click="submitEditForm(0)" class="pop-submitbtn">确 定</el-button>
                <el-button @click="closeEditWindow" class="el-button--cancel pop-cancelbtn">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 单击统计 弹出 项目统计 模态框 -->
        <el-dialog title="项目统计" :visible.sync="statisticsVisible" :before-close="handleClose" class="dialog-info total-dialog">
            <!--<span class="projectlist-dialog-smtitle">{{!statisticsTableData.buildingName?'':statisticsTableData.buildingName}}</span>-->
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
                <strong>统计说明: </strong>当前项目&nbsp;总客户数<span class="red-bold">&nbsp;{{customerTotals}}&nbsp;</span>位,&nbsp;{{ currentPhase }}总共{{ statisticsTable.info }}客户
                <span class="red-bold">{{statisticsCount.countSum}}</span>&nbsp;{{statisticsTable.info == '报备' || statisticsTable.info == '带看' || statisticsTable.info == '退筹' || statisticsTable.info == '退房' ? '次' : '位'}}
                ,&nbsp;其中<span v-if="hadUnsubscribeShow" class="hadUnsubscribeShow">{{ statisticsTable.msg }}<i> {{ statisticsCount.return }}</i> 次,</span>{{ statisticsTable.valid }}
                <span class="red-bold">{{statisticsCount.valid}}</span> {{ statisticsTable.unit }}
            </div>
            <div class="statistics-table" v-if="statisticsTableData.list">
                <el-table :data="statisticsTableData.list">
                    <el-table-column type="index" width="50" label="序号"></el-table-column>
                    <el-table-column property="employeeName" :label="statisticsTable.employeeName" width="180"></el-table-column>
                    <el-table-column property="customerName" label="客户名称" width="120"></el-table-column>
                    <el-table-column property="time" :label="statisticsTable.time" width="200"></el-table-column>
                    <el-table-column property="money" :label="statisticsTable.amount" v-if="amountTJShow"></el-table-column>
                    <el-table-column property="state" :label="statisticsTable.state" v-if="stateTJShow"></el-table-column>
                </el-table>
            </div>
            <!-- 项目统计分页器 -->
            <el-pagination @size-change="handleSizeChangeTJ" @current-change="handleCurrentChangeTJ" :current-page="SearchStatisticsForm.pageNum" :page-sizes="[5, 10, 15, 20]" :page-size="SearchStatisticsForm.pageSize" layout="prev, pager, next,  total, sizes, jumper" :total="statisticsCount.countSum">
            </el-pagination>
            <!--<div class="statistics-closebtn">
    <button type="primary" @click="statisticsVisible = false" class="close-btn">关 闭</button>
    </div>-->
        </el-dialog>
        <!-- 户型图弹窗html start -->
        <el-dialog title="户型" ref="houseTypeDialog" :visible.sync="houseTypeVisible" class="dialog-info houseType-dialog" :before-close="closeHouseType" :lockScroll="true">
            <h5 class="title">
                <el-button type="primary" class="un-select add-btn" @click="addHouseType"><i class="el-icon-circle-plus-outline"></i> 添加户型</el-button>
            </h5>
            <template v-for="(item,index) in houseTypeForm">
                <h5 class="un-select house-type-title" @click="clickTitle(index)"><span class="icon mr5" :class="houseTypeBoxTotal[index]?'icon-shouqi':'icon-zhankai'"></span>{{houseTypeBoxTotal[index]?'收起':'展开'}}</h5>
                <el-form ref="houseTypeDom" :rules="houseTypeRules" :model="item" label-width="83px" class="houseType-box">

                    <el-form-item class="select-item" label="户型名称:" prop="huoseTypenName">
                        <span v-if="!item.isNew&&editBtnType[index]">{{item.huoseTypenName}}</span>
                        <el-input v-else v-model="item.huoseTypenName" clearable></el-input>
                    </el-form-item>

                    <el-form-item class="select-item" label="售卖状态:" prop="sellingStatus">
                        <span v-if="!item.isNew&&editBtnType[index]">{{item.sellingStatusString}}</span>
                        <el-select v-else v-model="item.sellingStatus" placeholder="请选择">
                            <el-option v-for="option in sellType.children" :key="option.key" :label="option.value" :value="option.key">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <template v-if="houseTypeBoxTotal[index]">
                        <el-form-item class="select-item" label="房间朝向:" prop="roomOrientation">
                            <span v-if="!item.isNew&&editBtnType[index]">{{item.roomOrientationString}}</span>
                            <el-select v-else v-model="item.roomOrientation" placeholder="请选择">
                                <el-option v-for="option in face.children" :key="option.key" :label="option.value" :value="option.key">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item class="select-item" label="建筑面积:" prop="area">
                            <span v-if="!item.isNew&&editBtnType[index]">{{item.area}}</span>
                            <el-input v-else class="area" maxlength="11" v-model="item.area" clearable></el-input><span class="ml5">m²</span>
                        </el-form-item>

                        <el-form-item class="select-item" label="装修:" prop="renovation">
                            <span v-if="!item.isNew&&editBtnType[index]">{{item.renovationString}}</span>
                            <el-select v-else v-model="item.renovation" placeholder="请选择">
                                <el-option v-for="option in decoration.children" :key="option.key" :label="option.value" :value="option.key">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item class="select-item" label="房间结构:" prop="roomStructure">
                            <span v-if="!item.isNew&&editBtnType[index]">{{item.roomStructureString}}</span>
                            <el-select v-else v-model="item.roomStructure" placeholder="请选择">
                                <el-option v-for="option in structure.children" :key="option.key" :label="option.value" :value="option.key">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item class="select-item" label="均价:" prop="averagePrice">
                            <span v-if="!item.isNew&&editBtnType[index]">{{item.averagePrice}}</span>
                            <el-input v-else class="averagePrice" maxlength="20" v-model="item.averagePrice" clearable></el-input><span class="ml5">元/m²</span>
                        </el-form-item>

                        <el-form-item class="select-item" label="用途:" prop="purpose">
                            <span v-if="!item.isNew&&editBtnType[index]">{{item.purposeString}}</span>
                            <el-select v-else v-model="item.purpose" placeholder="请选择">
                                <el-option v-for="option in use.children" :key="option.key" :label="option.value" :value="option.key">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item class="select-item" label="户型:" prop="huxing">
                            <span v-if="!item.isNew&&editBtnType[index]">{{item.huxingString}}</span>
                            <el-select v-else v-model="item.huxing" placeholder="请选择">
                                <el-option v-for="option in homeType.children" :key="option.key" :label="option.value" :value="option.key">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item class="select-item" label="总价:">
                            <span v-html="Math.round(item.area*item.averagePrice/10000) +'万'"></span>
                        </el-form-item>

                        <div class="clearfix"></div>
                        <!-- {{!(!item.isNew&&editBtnType[index])}} -->
                        <el-form-item class="select-one" label="户型图:" required>
                            <input type="file" @change="upLoadHouse($event,index)" ref="houseTypeLoad" v-show="false">
                            <template v-if="!(!item.isNew&&editBtnType[index])">
                                <p class="red">建议尺寸：750*564px</p>
                            </template>

                            <ul class="gallery-window-map" style="flex-wrap:wrap;">
                                <!-- @click="houseUpload(index)" -->
                                <li class="house-pic-item" v-if="!(!item.isNew&&editBtnType[index])">
                                        <uploadImg :id="'pic'+index"  @getDataUrl="getDataUrl(index,2,arguments)" :rules="['jpg','gif','png','bmp']">
                                            <div class="pic-box">
                                                    <span class="icon icon-zengjia"></span>
                                                    <h5 class="btn-tit">点击上传</h5>
                                            </div>
                                        </uploadImg>
                                </li>
                                <viewer :images="item.imgUrl">
                                    <li class="house-pic-item" v-for="(picItem, picIndex) in item.imgUrl" :key="picIndex">
                                        <img :src="picItem" alt="" :key="picItem" width="120" height="90" :ref="'showImg_'+index">
                                        <div class="mask">
                                            <div class="ico-box">
                                                <span class="font-btn" @click="clickWatchImg('showImg_'+index,picIndex)">
                                                    <i class="icon icon-fangda"></i>
                                                </span>
                                                <span class="font-btn" v-if="!(!item.isNew&&editBtnType[index])" @click="delHouseImage(index,picIndex)">
                                                    <i class="icon icon-shanchu"></i>
                                                    <i class="line"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                </viewer>
                            </ul>
                        </el-form-item>
                        <el-form-item class="mt10 btn-box">
                            <el-button @click="deleteHouseType(index)">删除</el-button>
                            <el-button type="primary" @click.native="saveHouseType(index)">{{!item.isNew&&editBtnType[index]?'编辑':'保存'}}</el-button>
                        </el-form-item>

                    </template>
                    <div class="clearfix"></div>
                </el-form>
            </template>
        </el-dialog>
        <!-- 户型图弹窗html end -->
    </div>
</template>
<script src="./projectList.js"></script>
<style lang='scss' scoped src="./projectList.scss"></style>

