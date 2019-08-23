<!-- 组织机构 -->
<template>
  <div class="org_container container">
    <div class="left_Content" v-loading="leftLoading" element-loading-text="拼命加载中">
      <!-- 左边树状结构 -->
      <div class="org_leftTree">
        <el-tree
          :data="departDataList"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :props="defaultProps"
        >
          <span class="custom-tree-node" @mouseenter="treeNodeEnter" slot-scope="{ data }">
            <span class="listContent" @click="getEmployeeInfo(data)">{{ data.name }}</span>
            <el-tooltip
              v-if="data.teamId == data.id"
              class="item item-publicPool"
              effect="dark"
              :visible-arrow="false"
              content="公客池"
              placement="top"
            >
              <el-button>
                <img src="../../../assets/images/publicPool.png" alt>
              </el-button>
            </el-tooltip>
            <el-dropdown trigger="click" class="orgLeft-setBox">
              <i
                class="icon icon-shezhi orgLeft-icon"
                @click="editIcon(data)"
                :style="data.isCompany ? 'color: red' : (data.sectoralNature == 2 || data.sectoralNature == 3) ? 'color:rgb(0, 255, 0)' : ''"
              ></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="editDepartBtn(data)">
                  <i class="icon icon-bianji"></i>编辑部门
                </el-dropdown-item>
                <el-dropdown-item @click.native="deleteDepartBtn(data)">
                  <i class="el-icon-delete"></i> 删除部门
                </el-dropdown-item>
                <el-dropdown-item @click.native="addDepartBtn(data)">
                  <i class="icon icon-zengjia"></i> 新增部门
                </el-dropdown-item>
                <el-dropdown-item @click.native="addUserBtn(data)">
                  <i class="icon icon-zengjia"></i> 新增用户
                </el-dropdown-item>
                <el-dropdown-item @click.native="uploadLogo(data)" v-show="isUploadLogo">
                  <i class="icon icon-shangchuan"></i> 上传logo
                </el-dropdown-item>
                <el-dropdown-item @click.native="addBanner(data)" v-show="isAddBanner">
                  <i class="icon icon-zengjia"></i> 新增banner
                </el-dropdown-item>
                <el-dropdown-item @click.native="stationManage(data)" v-show="isStationManage">
                  <i class="icon icon-zengjia"></i>岗位管理
                </el-dropdown-item>
                <el-dropdown-item @click.native="setEmpDropTime(data)" v-show="isShowCompanyDep">
                  <i class="icon icon-bianji"></i>公司配置设置
                </el-dropdown-item>
                <el-dropdown-item @click.native="companyPermiss(data)" v-show="isAddBanner">
                  <i class="icon icon-bianji"></i>高级公司管理
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="right_Content">
      <!-- 头部form表单 -->
      <div class="w-select">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="状态:">
            <el-select v-model="formInline.status" placeholder="全部" class="selectIpt">
              <!-- 秦星星加22375 bug -->
              <el-option label="全部" value></el-option>
              <el-option label="在职" :value="1"></el-option>
              <el-option label="离职" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键词:">
            <el-input v-model="formInline.keyword" placeholder="关键词"></el-input>
          </el-form-item>
          <el-form-item>
            <button type="button" @click="onSearch" class="searchBtn">搜索</button>
          </el-form-item>
          <el-form-item>
            <button type="button" @click="onReset" class="resetBtn">重置</button>
          </el-form-item>
          <el-form-item>
            <button type="button" @click="addUserBtn" class="addIpt">
              <span class="icon icon-zengjia org-icon"></span>新增用户
            </button>
          </el-form-item>
          <el-form-item>
            <button type="button" @click="onExport" class="piliangBtn">
              <span class="icon icon-shezhi org-icon"></span>批量操作
            </button>
          </el-form-item>
          <el-form-item>
            <button type="button" @click="permissManage" class="adminBtn">
              <span class="icon icon-shezhi org-icon"></span>权限管理
            </button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 头部当前显示信息 -->
      <div class="nowAdress">
        <span>
          当前部门 :
          <b>{{departmentMsg}}</b>
        </span>
        <span>
          公司属性 :
          <b>{{companyType}}</b>
        </span>
      </div>
      <!-- 员工列表信息table表格 -->
      <el-table
        ref="multipleTable"
        v-loading="rightLoading"
        element-loading-text="拼命加载中"
        :data="userDataList"
        tooltip-effect="dark"
        @row-click="tableRowClick"
        @select="checkSelect"
        style="width: 100%;"
        heigth="500"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" prop="isDepMaster" width="50"></el-table-column>
        <el-table-column label="序号" width="60" type="index">
          <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
        </el-table-column>
        <el-table-column label="姓名" width="150">
          <template slot-scope="scope">
            <span>
              {{scope.row.name}}
              <i class="zhuGuan" v-show="scope.row.isDepMaster">主管</i>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="60" show-overflow-tooltip></el-table-column>
        <el-table-column label="所属公司" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{!scope.row.companyName ? scope.row.depName : scope.row.companyName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="roleStr" label="权限" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="title" label="职务" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="idcard" label="身份证号" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="状态" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="joinTime" label="入职日期" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <button type="text" class="editData" @click="editUserBtn(scope)">编辑</button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="prev, pager, next,  total, sizes, jumper"
        :total="userListTotal"
      ></el-pagination>
      <!-- 分页 -->
    </div>
    <!-- 添加用户弹框 -->
    <div class="org_addUser">
      <el-dialog title="新增用户" :visible.sync="addUserBox">
        <el-form
          :model="addUserForm"
          :rules="rules"
          label-width="100px"
          :inline="true"
          ref="addUserRuleForm"
          class="demo-ruleForm"
        >
          <div v-show="isShowBefore">
            <el-form-item label="员工姓名:" prop="name">
              <el-input v-model="addUserForm.name" maxlength="5"></el-input>
            </el-form-item>
            <el-form-item label="性 别:">
              <el-select v-model="addUserForm.sex" placeholder="选择性别">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="身份证号:" prop="idcard">
              <el-input v-model="addUserForm.idcard" @change="idCardChange" maxlength="18"></el-input>
            </el-form-item>
            <el-form-item label="入职日期:">
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择日期"
                v-model="addUserForm.joinTime"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="出生日期:">
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择日期"
                v-model="addUserForm.birthday"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="权 限:" class="rolePermissItem" v-if="isShowRole">
              <el-select v-model="addUserRoleShow" placeholder="请选择">
                <el-option value>
                  <el-tree
                    :data="roleList"
                    :props="employeeProps"
                    show-checkbox
                    class="user-tree"
                    :default-checked-keys="defaultAddUser"
                    node-key="DepartOnlyCode"
                    :expand-on-click-node="false"
                    @check="handleNodeClickRole"
                  ></el-tree>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="职 务:">
              <el-input v-model="addUserForm.title" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="所属部门:">
              <el-input v-model="addUserForm.depName" disabled></el-input>
            </el-form-item>
            <el-form-item label="管辖部门:" v-show="isShowAdminIpt">
              <el-select v-model="adminIptValue" placeholder="请选择">
                <el-option value>
                  <el-tree
                    :data="adminDeptData"
                    :props="adminDeptProp"
                    show-checkbox
                    node-key="DepartOnlyCode"
                    :expand-on-click-node="false"
                    @check="handleNodeClick"
                    style="width: 100%"
                  ></el-tree>
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 当是茂业的时候展示岗位 -->
            <el-form-item label="岗位:" class="rolePermissItem" v-if="isShowGangWei == '茂业'">
              <el-select
                v-model="addUserForm.postId"
                @change="choseMaoye"
                placeholder="请选择"
                class="fl"
              >
                <el-option
                  v-if="getCompany_maoye.length != 0"
                  v-for="item in getCompany_maoye"
                  :key="item.id"
                  :label="item.postName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-form-item label>
                <el-checkbox-group v-model="addUserForm.isDepMaster">
                  <el-checkbox label="主管" name="type"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form-item>
            <el-form-item v-if="isShowGangWei == '茂业' || isShowAdminIpt">
                <el-checkbox-group v-model="addUserForm.isJoint">
                  <el-checkbox label="联动专员" name="type"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
          </div>
          <div v-show="isShowNext" class="addUserPhone">
            <el-form-item label="手 机 号:" class="mobileInputBox">
              <el-input v-model="addUserForm.mobile" maxlength="11" @change="addUserPhoneChange"></el-input>
            </el-form-item>
            <el-form-item prop="addUserCaptcha" label="短信验证码:">
              <el-input v-model="addUserForm.captcha" placeholder="请输入短信验证码" class="codeIpt"></el-input>
              <div class="getPhoneCd" @click="getPhoneCd" v-show="isShowGet">获取手机验证码</div>
              <div class="getPhoneCd againPhoneCd" v-show="isShowAgain">
                还剩
                <span style="color: #FD8F00">{{againTime}}</span> 秒
              </div>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <div v-show="showBeforeBtn">
            <el-button @click="addBeforeStep" class="sureAdd" v-show="showBeforeBtn">上一步</el-button>
            <el-button
              @click="sureAddUser('addUserRuleForm')"
              class="sureAdd"
              v-show="showBeforeBtn"
            >完成</el-button>
          </div>
          <div v-show="showNextBtn">
            <el-button @click="addUserBox = false" class="noAdd">取 消</el-button>
            <el-button
              @click="addNextStep('addUserRuleForm')"
              class="sureAdd"
              v-show="showNextBtn"
            >下一步</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <!-- 编辑用户弹框 -->
    <div class="org_editUser">
      <el-dialog :title="editUserTitle" :visible.sync="editUserBox">
        <div class="newDepartBox" v-show="isShowMove">
          <el-form :model="moveEmpForm" ref="moveForm" label-width="100px" class="demo-ruleForm">
            <el-form-item
              label="新部门："
              :rules="[{required: true, message: '请输入新部门名称', trigger: 'blur' },]"
            >
              <el-select v-model="departName" placeholder="请选择">
                <el-option value>
                  <el-tree
                    :data="moveEmpData"
                    :props="moveEmpProp"
                    node-key="DepartOnlyCode"
                    check-on-click-node
                    :expand-on-click-node="false"
                    @node-click="clickNode"
                  ></el-tree>
                </el-option>
              </el-select>
            </el-form-item>
            <p class="moveEmployeeDec">
              你确定将
              <span style="font-weight:700">{{moveEmployee}}</span>
              <span style="color: #f84949;">{{moveEmployeeNum}}</span>名员工转移至新的部门？
            </p>
            <div class="move_footer">
              <el-button @click="sureMoveClick('moveForm')" class="sureAdd">确 定</el-button>
              <el-button @click="noMoveClick('moveForm')" class="noAdd">取 消</el-button>
            </div>
          </el-form>
        </div>
        <el-form
          :model="editUserData"
          :rules="rules"
          label-width="100px"
          :inline="true"
          ref="eidtUserRuleForm"
          class="demo-ruleForm"
          v-show="isShowEditUser"
        >
          <div v-show="showEditUserBefore">
            <el-form-item label="员工姓名:" prop="name">
              <el-input v-model="editUserData.name" maxlength="5"></el-input>
            </el-form-item>
            <el-form-item label="性 别:">
              <el-select v-model="editUserData.sex" placeholder="选择性别">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="身份证号:" prop="idcard">
              <el-input v-model="editUserData.idcard" @change="idCardChange" maxlength="18"></el-input>
            </el-form-item>
            <el-form-item label="入职日期:" prop="joinTime">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                v-model="editUserData.joinTime"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="出生日期:">
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                v-model="editUserData.birthday"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="状 态:" prop="status">
              <el-select v-model="editUserData.status" placeholder="选择权限" @change="statusChange">
                <el-option label="在职" :value="1"></el-option>
                <el-option label="离职" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="离职日期:" class="rolePermissItem org-dropEmployee" v-show="editUserData.status == 2">
              <el-date-picker
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                v-model="editUserData.leaveTime"
                @change="dropCompanyTime"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="客户交接人:" class="rolePermissItem org-empTransfer" v-show="editUserData.status == 2">
              <el-select v-model="editUserData.masterId" filterable placeholder="请选择交接人">
                <el-option
                  v-for="item in allMasterData"
                  :label="item.name"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="权 限:" class="rolePermissItem" v-if="isShowRole">
              <el-select v-model="editUserRolesShow" placeholder="请选择">
                <el-option value>
                  <el-tree
                    :data="roleList"
                    show-checkbox
                    node-key="roleId"
                    class="user-tree"
                    :default-checked-keys="defaultEditUser"
                    :expand-on-click-node="false"
                    @check="handleNodeClickEditRole"
                    :props="employeeProps"
                  ></el-tree>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="职 务:">
              <el-input v-model="editUserData.title" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="所属部门:">
              <el-input v-model="departmentMsg" disabled></el-input>
            </el-form-item>
            <el-form-item label="管辖部门:" v-show="isEditUserAdmin">
              <el-select v-model="adminIptValue" placeholder="请选择">
                <el-option value>
                  <el-tree
                    :data="adminDeptData"
                    :props="adminDeptProp"
                    show-checkbox
                    node-key="DepartOnlyCode"
                    :default-checked-keys="defaultEditAdmin"
                    :expand-on-click-node="false"
                    @check="handleNodeClick"
                  ></el-tree>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="岗位:" class="rolePermissItem" v-if="isShowGangWei_edit == 4">
              <el-select
                v-model="editUserData.postId"
                @change="choseMaoye"
                placeholder="请选择"
                class="fl"
              >
                <el-option
                  v-if="getCompany_maoye.length != 0"
                  v-for="item in getCompany_maoye"
                  :key="item.id"
                  :label="item.postName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label>
              <el-checkbox-group v-model="editUserData.isDepMaster">
                <el-checkbox label="主管" name="isDepMaster"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label v-if="isShowGangWei_edit == 4 || isEditUserAdmin">
              <el-checkbox-group v-model="editUserData.isJoint">
                <el-checkbox label="联动专员" name="isJoint"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label v-show="isShowDelBox">
              <el-checkbox-group v-model="editUserData.isDel">
                <el-checkbox label="是否删除" name="isDel"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div v-show="isShowNext" class="addUserPhone">
            <el-form-item label="手 机 号:" class="mobileInputBox">
              <el-input
                v-model="editUserData.mobile"
                @keyup.native="userPhoneChange"
                maxlength="11"
              ></el-input>
            </el-form-item>
            <el-form-item prop="captcha" label="短信验证码:" v-show="isShowCodeIpt">
              <el-input v-model="editUserData.captcha" placeholder="请输入短信验证码" class="codeIpt"></el-input>
              <div class="getPhoneCd" @click="getPhoneCd" v-show="isShowGet">获取手机验证码</div>
              <div class="getPhoneCd againPhoneCd" v-show="isShowAgain">
                还剩
                <span style="color: #FD8F00">{{againTime}}</span> 秒
              </div>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer" v-show="isShowEditUser">
          <div v-show="showBeforeBtn">
            <el-button @click="addBeforeStep" class="sureAdd" v-show="showBeforeBtn">上一步</el-button>
            <el-button
              @click="sureEditUser('eidtUserRuleForm')"
              class="sureAdd"
              v-show="showBeforeBtn"
            >完成</el-button>
          </div>
          <div v-show="showNextBtn">
            <!-- <el-button @click="editUserBox = false" class="noAdd">取 消</el-button> -->
            <el-button @click="editUserBoxChange" class="noAdd">取 消</el-button>
            <el-button
              @click="addNextStep('eidtUserRuleForm')"
              class="sureAdd"
              v-show="showNextBtn"
            >下一步</el-button>
          </div>
        </div>
        <div class="leaveOffice">
          <el-dialog
            title="员工离职处理"
            :visible.sync="leaveOfficeBox"
            append-to-body
            class="leaveOffice"
            width="30%"
          >
            <div v-if="isShowLeaveBox">
              <p>
                员工姓名：
                <span style="color: #333">{{dropCompanyPhone}}</span>
              </p>
              <p style="color: #333">
                注销帐号后他名下还有
                <span style="color: #f84949;">{{privateNum}}</span>个私客，将交给
                <span style="color: #f84949;">{{ giveMasterName }}</span>
              </p>
              <p style="color: #f84949;">请确定是否进行注销操作</p>
            </div>
            <div v-else v-html="showLeaveMsg"></div>
            <div class="move_footer">
              <el-button @click="sureEditDeleteUser" class="sureAdd" v-if="isShowLeaveBox">确 定</el-button>
              <el-button @click="leaveOfficeBox = false" class="noAdd">取 消</el-button>
            </div>
          </el-dialog>
        </div>
      </el-dialog>
    </div>
    <!-- 新增部门 + 编辑部门-->
    <div class="org_addDepart">
      <el-dialog :title="departTitle" :visible.sync="addDepartBox">
        <el-form
          :model="editDepartData"
          :rules="departRules"
          label-width="100px"
          :inline="true"
          ref="deptRuleForm"
          class="demo-ruleForm"
        >
          <el-form-item label="部门名称:" prop="name">
            <el-input v-model="editDepartData.name" maxlength="20" placeholder="最大输入20个字"></el-input>
          </el-form-item>
          <el-form-item v-show="isShowCheckBox">
            <el-checkbox label="公司" v-model="editDepartData.isCompany" @change="isCompanyMethod" name="type"></el-checkbox>
          </el-form-item>
          <el-form-item label="省 市:" v-if="isShowCompany" prop="province">
            <el-select
              v-model="editDepartData.province"
              placeholder="--省--"
              @change="provinceChanged"
            >
              <el-option
                :label="item.ProvinceName"
                :value="item.ID"
                v-for="(item, index) in provinceList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isShowCompany" prop="area">
            <el-select v-model="editDepartData.area" placeholder="--市--">
              <el-option
                :label="item.CityName"
                :value="item.CityID"
                v-for="item in getProvinceName"
                :key="item.CityName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公司属性:" v-if="isShowCompany" prop="type">
            <el-select v-model="editDepartData.type" placeholder="属性">
              <el-option
                v-for="(item, index) in companyTypeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上级部门:" class="upDepart_name">
            <el-input v-model="editDepartData.pname" disabled ></el-input>
              <!-- <el-select v-model="editDepartData.pname" v-show="!showLastDepart" placeholder="请选择" class="editDepart-before">
                <el-option value>
                  <el-tree
                    :data="departDataList"
                    :props="defaultProps"
                    node-key="id"
                    check-on-click-node
                    :expand-on-click-node="false"
                    @node-click="beforeClick"
                  ></el-tree>
                </el-option>
              </el-select> -->
          </el-form-item>
          <el-form-item label="部门电话:" class="depart_phone" v-if="!isShowMaoYe">
            <el-input v-model="editDepartData.mobile" @change="mobileSize"></el-input>
          </el-form-item>
          <div v-if="isShowMaoYe" class="depart-newPart">
            <el-form-item label="部门性质:" prop="sectoralNature">
              <el-select
                v-model="editDepartData.sectoralNature"
                @change="departTypeChange"
                placeholder="属性"
                :disabled="noEditDepart"
              >
                <el-option v-if="noShowNormalDepart" label="常规部门" :value="1"></el-option>
                <el-option label="渠道部门" :value="2"></el-option>
                <el-option label="生态链部门" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="渠道运营经理:" prop="channelManagerName">
              <el-select
                v-model="editDepartData.channelManagerName"
                filterable
                remote
                reserve-keyword
                :clearable="true"
                @change="channelChange"
              >
                <el-option
                  v-for="(item, index) in channelManagerData"
                  :key="index"
                  :label="item.e_name"
                  :value="item.e_id+'-'+item.d_name+'-'+ item.e_name"
                ></el-option>
              </el-select>
              <span>{{editDepartData.channelManagerDepartmentName}}</span>
            </el-form-item>
            <el-form-item label="渠道联系人:" prop="channelContacts">
              <el-input v-model="editDepartData.channelContacts" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="联系人电话:" prop="channelContactTelephone">
              <el-input v-model="editDepartData.channelContactTelephone" maxlength="50"></el-input>
            </el-form-item>
            <div class="depart-link">
                <el-form-item label="渠道运营总监:" prop="channelChief">
                <el-select
                  v-model="editDepartData.channelChief"
                  filterable
                  remote
                  reserve-keyword
                >
                  <el-option
                    v-for="(item, index) in channelManagerData"
                    :key="index"
                    :label="item.e_name"
                    :value="item.e_id"
                  ></el-option>
              </el-select>
            </el-form-item>
              <el-form-item label="默认权限:" class="rolePermissItem">
                <el-select v-model="departRolesShow" placeholder="请选择">
                  <el-option value>
                    <el-tree
                      :data="roleList"
                      show-checkbox
                      node-key="roleId"
                      class="user-tree"
                      :default-checked-keys="defaultDepartRole"
                      :expand-on-click-node="false"
                      @check="handleNodeClickDepartRole"
                      :props="employeeProps"
                    ></el-tree>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="邀 请 码:">
                <el-input v-model="editDepartData.invitateCode" disabled></el-input>
              </el-form-item>
            </div>
            <el-form-item label="渠道介绍:" class="team_introduce">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="最大输入200字符"
                maxlength="200"
                v-model="editDepartData.description"
              ></el-input>
              <div class="departIntroduceBox">
                <span>{{departIntro}}</span>/200
              </div>
            </el-form-item>
          </div>
          <div v-else class="depart-newPart-two">
            <el-form-item
              label="部门性质:"
              prop="sectoralNature"
              v-if="isShowDepType"
              class="depart-departType"
            >
              <el-select
                v-model="editDepartData.sectoralNature"
                @change="departTypeChange"
                placeholder="属性"
                :disabled="noEditDepart"
              >
                <el-option label="常规部门" :value="1"></el-option>
                <el-option label="渠道部门" :value="2"></el-option>
                <el-option label="生态链部门" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部门地址:" class="depart_address">
              <el-input v-model="editDepartData.address" maxlength="50" placeholder="最大输入50个字符"></el-input>
              <div class="departAddressBox">
                <span>{{departAddress}}</span>/50
              </div>
            </el-form-item>
            <el-form-item label="团队介绍:" class="team_introduce">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="最大输入200字符"
                maxlength="200"
                v-model="editDepartData.description"
              ></el-input>
              <div class="departIntroduceBox">
                <span>{{departIntro}}</span>/200
              </div>
            </el-form-item>
          </div>
          <el-form-item class="setPublic-pool" v-if="isShowPublicPool">
            <el-checkbox-group v-model="publicPoolIsTrue">
              <el-checkbox label="设置独立公客池" name="type" :disabled="isEditPublicPool"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item class="setPublic-pool" v-if="isShowShare">
            <el-checkbox-group v-model="editDepartData.isShareCustomer">
              <el-checkbox label="设置共享公客池" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- <el-form-item class="setPublic-pool" v-show="!isShowPublicPool">
              <el-checkbox-group v-model="publicPoolIsTrue1">
                <el-checkbox label="取消独立公客池" name="type" :disabled="isEditPublicPool"></el-checkbox>
              </el-checkbox-group>
          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="sureAddDepartment('deptRuleForm')" class="sureAdd">确 定</el-button>
          <el-button @click="addDepartBox = false" class="noAdd">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 删除部门 -->
    <div class="org_deleteDepart">
      <el-dialog :title="deleteBoxTitle" :visible.sync="deleteDepartBox" width="30%">
        <span v-show="employeeNum == 0 ? false : true">
          该部门还有
          <span style="color: #f84949">{{employeeNum}}</span>名员工，请先注销所有员工。
        </span>
        <span v-show="employeeNum == 0 ? true : false">
          该部门还有
          <span style="color: #f84949">{{employeeNum}}</span>名员工，您确定删除吗?
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sureClickDeleteDepart">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 设置私客掉公的弹框 -->
    <div class="org_empDropTime">
      <el-dialog title="公司配置设置" :visible.sync="setEmployeeTimeBox" width="500px">
        <el-form
          :model="setCompanyForm"
          ref="dynamicValidateForm"
          label-width="100px"
          class="demo-dynamic org_empDropTimeCss"
        >
          <el-form-item
            prop="lockTime"
            label="私客掉公时间："
            :rules="[
      { required: true, message: '请输入私客掉公时间', trigger: 'blur' },
    ]"
          >
            <el-input v-model="setCompanyForm.lockTime" placeholder="小时" maxlength="5"></el-input>&nbsp;
            <span style="color:#666">小时</span>
          </el-form-item>
          <el-form-item
            prop="lockCount"
            label="私客锁定数量："
            :rules="[
      {required: true, message: '请输入私客锁定数量', trigger: 'blur'},
    ]"
          >
            <el-input v-model="setCompanyForm.lockCount" placeholder="数量" maxlength="5"></el-input>
          </el-form-item>
          <el-form-item label="提前掉公提醒：">
            <el-input v-model="setCompanyForm.lockWarnTime" placeholder maxlength="5"></el-input>&nbsp;
            <span style="color:#666">小时</span>
          </el-form-item>

          <el-form-item label="部门掉公时间：">
            <el-input v-model="setCompanyForm.depLockTime" maxlength="5"></el-input>&nbsp;
            <span style="color:#666">小时</span>
          </el-form-item>
          <el-form-item label="经纪人名片:">
            <el-radio v-model="setCompanyForm.qrcodeUrl" label="0">微信</el-radio>
            <el-radio v-model="setCompanyForm.qrcodeUrl" label="1">吉家网</el-radio>
            <!-- <el-input v-model="setCompanyForm.qrcodeUrl" maxlength="5"></el-input>&nbsp; -->
          </el-form-item>
        </el-form>

        <div class="move_footer">
          <el-button @click="setEmployeeAjax('dynamicValidateForm')" class="sureAdd">确 定</el-button>
          <el-button @click="setEmployeeTimeBox=false" class="noAdd">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 上传logo -->
    <div class="org_upload">
      <el-dialog title="上传logo" :visible.sync="uploadBox" width="30%">
        <p>
          公司名称：
          <span>{{companyName}}</span>
        </p>
        <p>
          所属区域：
          <span>{{companyArea}}</span>
        </p>
        <p>logo图片：</p>
        <div class="uploadLogoBox">
          <div class="message" style="color:　#fa5151;">
            <span>说明:</span>
            <p>1. 只能上传一张图片</p>
            <p>2. 尺寸360*90
              <br>大小不超过70kb
            </p>
          </div>
          <el-upload
            action="/img/upload"
            list-type="picture-card"
            :limit="1"
            ref="upload"
            :on-success="uploadLogoSuccess"
            :on-preview="handlePictureCardPreview"
            :beforeUpload="beforeLogoUpload"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- <el-upload
        action="http://s224.360fdc.com:8085/img/upload"
        list-type="picture-card"
        :limit=1
        ref="upload"
        :on-success="uploadLogoSuccess"
        :on-preview="handlePictureCardPreview"
        :beforeUpload="beforeLogoUpload"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
          </el-upload>-->
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt>
          </el-dialog>
        </div>
        <div class="move_footer">
          <el-button @click="sureUploadLogo" class="sureAdd">确 定</el-button>
          <el-button @click="noUploadLogo" class="noAdd">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 退出企业 -->
    <!-- 权限管理 -->
    <div class="org_permiss">
      <el-dialog
        title="权限管理"
        :visible.sync="permissManageBox"
        @close="noPermissManage"
        width="700px"
      >
        <!-- 确认弹出框 -->
        <el-dialog
          title="提示"
          append-to-body
          :visible.sync="deletePermissDialog"
          width="30%"
          :before-close="handleClose"
        >
          <p style="text-align:center;">
            <span class="el-icon-info"></span> 是否删除该权限
          </p>
          <div class="operation-btn move_footer">
            <el-button class="sureAdd" @click="sureDeletePermiss">确 定</el-button>
            <el-button class="noAdd" @click="deletePermissDialog=false">取 消</el-button>
          </div>
        </el-dialog>
        <div class="permission clearfix">
          <!-- ===== -->
          <el-select
            v-model="chose_permission"
            @change="chosePermission"
            placeholder="请选择"
            class="fl"
            :disabled="companyId > 0"
          >
            <el-option label="中房科瑞" :value="-1"></el-option>
            <el-option
              v-for="item in getCompany_permission"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <!-- ====== -->
          <button type="button" class="addPermiss fr" @click="addLimit">新增</button>
        </div>
        <el-table :data="manageDataList" border style="width: 100%">
          <el-table-column label="序号" width="80" type="index"></el-table-column>
          <el-table-column prop="name" label="服务名称" width="200"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <button type="button" class="editPermiss" @click="editRadioManage(scope)">编辑</button>
              <button type="button" class="editPermiss" @click="setPermissClick(scope)">设置权限</button>
              <button
                type="button"
                class="editPermiss"
                style="background:#fd8f00;"
                @click="deletePermissClick(scope)"
              >删除</button>
            </template>
          </el-table-column>
        </el-table>
        <div class="move_footer">
          <!-- <el-button  @click="surePermissManage" class="sureAdd">确 定</el-button> -->
          <!-- 秦星星 begin -->
          <el-button @click="noPermissManage" class="noAddClose">关 闭</el-button>
          <!-- end -->
        </div>
        <div>
          <!-- 编辑权限弹框 -->
          <el-dialog
            class="addNewPermiss"
            title="新增岗位"
            :visible.sync="editPermissBox"
            width="30%"
            append-to-body
          >
            <div class="permissIpt">岗位名称:
              <el-input v-model="editLimitIpt.name" maxlength="10"></el-input>
            </div>
            <div class="move_footer">
              <el-button @click="sureEditPermise" class="sureAdd">确 定</el-button>
              <el-button @click="editPermissBox = false" class="noAdd">取 消</el-button>
            </div>
          </el-dialog>
          <!-- 新增权限弹框 -->
          <el-dialog
            class="addNewPermiss"
            title="新增权限"
            :visible.sync="addPermissBox"
            width="30%"
            append-to-body
          >
            <div class="permissIpt">权限名称:
              <el-input v-model="addLimitIpt" maxlength="10"></el-input>
            </div>
            <div class="move_footer">
              <el-button @click="sureAddPermise" class="sureAdd">确 定</el-button>
              <el-button @click="addPermissBox = false" class="noAdd">取 消</el-button>
            </div>
          </el-dialog>
        </div>
      </el-dialog>
    </div>
    <!-- 新增banner弹框 -->
    <div class="org_addBanner">
      <el-dialog title="新增" :visible.sync="addBannerBox" class="addBanner">
        <el-form :model="addBannerForm" :rules="bannerRules" ref="ruleForm">
          <el-form-item label="公 司 名 称：">
            <el-input v-model="addBannerForm.companyName" auto-complete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="所 属 区 域：">
            <span>{{companyAddress}}</span>
          </el-form-item>
          <el-form-item label="banner位置：" prop="location">
            <el-radio-group v-model="addBannerForm.location" @change="houseTypeChange">
              <el-radio label="0">进入页</el-radio>
              <el-radio label="1">首页</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="banner类型：" prop="type">
            <el-radio-group v-model="addBannerForm.type" @change="houseTypeChange">
              <el-radio label="1">H5广告</el-radio>
              <el-radio label="2">视频链接</el-radio>
              <el-radio label="0" v-show="addBannerForm.location == 1">推荐房源</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 秦星星加 -->
          <el-form-item label="广 告 链 接：" v-if="h5Input">
            <el-input v-model="addBannerForm.links" auto-complete="off" placeholder="没有H5链接时可不填"></el-input>
          </el-form-item>
          <!-- ==== -->
          <el-form-item label="banner名称：" prop="name">
            <el-input
              v-model="addBannerForm.name"
              auto-complete="off"
              maxlength="100"
              placeholder="最大输入100个字"
            ></el-input>
          </el-form-item>
          <el-form-item label="项 目 名 称：" prop="buildName" v-if="projectNameIpt">
            <el-autocomplete
              class="inline-input"
              v-model="addBannerForm.buildName"
              :fetch-suggestions="querySearch1"
              placeholder="输入楼盘名称，点击选择"
              :trigger-on-focus="false"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="banner图片：" class="bannerPhotoBox">
            <!-- <el-upload
              action="http://s224.360fdc.com:8085/img/upload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-success="uploadLogoSuccess"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>-->
            <el-upload
              action="/img/upload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-success="uploadLogoSuccess"
              :beforeUpload="bannerBeforeUp"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt>
            </el-dialog>
            <div class="message">
              <span>1.只能上传一张图片</span>
              <span>2.尺寸:750px*350px</span>
              <span>大小：不超过70KB</span>
            </div>
          </el-form-item>
        </el-form>
        <div class="move_footer">
          <el-button @click="sureAddBanner('ruleForm')" class="sureAdd">确 定</el-button>
          <el-button @click="addBannerBox=false" class="noAdd">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- =======================================高级公司管理弹框开始============================================== -->
    <div class="companyPermiss_dialog">
      <el-dialog title="高级公司管理" :visible.sync="companyPermissBox" width="500px" class="addBanner">
        <company-permiss
          @close="closePermissBox"
          v-if="companyPermissBox"
          :companyId="companyPermissId"
        ></company-permiss>
      </el-dialog>
    </div>
    <!-- =======================================高级公司管理弹框结束============================================== -->
    <!-- 岗位管理弹框组件 -->
    <StationManage
      :stationVisible="stationVisible"
      :stationData="stationData"
      @closeStation="stationVisible=false"
    ></StationManage>
  </div>
</template>

<script>
import {
  getDepartList,
  editDepartment,
  getAllProvince,
  deleteDepartment,
  getDeleteDepartNum,
  editUser,
  getEmployeeList,
  editUserPut,
  editDepartmentPut,
  addDepartment,
  getManageInfo,
  editPermisePut,
  addPermise,
  addUser,
  getAdminDept,
  getPersonEmployee,
  moveEmployeePut,
  uploadLogoPut,
  getProjectListInfo,
  addBannerPut,
  getPhoneCode,
  employeeDrop,
  getAllMaster,
  getDefaultForm,
  getAllCompantInfo,
  getCompanyIdQueryPostList
} from "@/api/index";
import Vue from "vue";
import axios from "axios";
import companyPermiss from "./comPermissDiaolog.vue";
import {
  isvalidCard,
  isMobileSize,
  isvalidLoginPhone
} from "@/views/login/validate.js";
import { RULE } from "@/api/rules";
import {
  DefaultDepartM,
  replaceString,
  getDefaultString
} from "@/vendor/methods.js";
// 引入岗位管理弹框组件
import StationManage from "./station-manage";
let validCard = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入身份证号"));
  } else if (!isvalidCard(value)) {
    callback(new Error("身份证号格式不正确"));
  } else {
    callback();
  }
};
// 消息弹框的封装
function alertMessage(type, msg) {
  Vue.prototype.$message({
    type: type,
    message: msg,
    duration: 1000
  });
}
export default {
  components: { companyPermiss, StationManage },
  mixins: [RULE],
  data() {
    return {
      // ======================新需求：新增邀请码、生态链部门数据开始===================
      writePublicPoolShow:1,  // 判断新增部门性质切换时是否显示独立公客池
      writePublicPoolStatus:1, // 判断新增部门性质切换时独立公客池是否被选中
      isShowShare:false,      // 是否显示共享公客池
      noEditDepart:false,     //是否可以编辑茂业里面的部门性质
      noShowNormalDepart:false, // 是否显示茂业里面部门性质里面的常规部门
      defaultDepartRole:[],      // 点击编辑部门时的默认权限
      departRolesShow:"",         // 部门里面的权限中文显示
      checkIsShowAdmin:"",        // 用来判断是否显示管辖部门
      // ======================新需求：新增邀请码、生态链部门数据结束===================
      showLastDepart:true,        // 上级部门是否可编辑
      deletePermissDialog: false, // 删除指定权限弹框显示
      deletePermissId: "", //删除指定权限的权限id存储
      isShowDepType: false, // 部门性质form的显示隐藏
      // 茂业属性数据开始======================
      isShowGangWei: "",
      departRules: {
        name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
        province: [
          { required: true, message: "请选择省份", trigger: "change" }
        ],
        area: [{ required: true, message: "请选择市", trigger: "change" }],
        type: [
          { required: true, message: "请选择公司属性", trigger: "change" }
        ],
        sectoralNature: [
          { required: true, message: "请选择部门性质", trigger: "change" }
        ],
        channelManagerName: [
          { required: true, message: "请输入渠道运营经理", trigger: "blur" }
        ],
        channelContacts: [
          { required: true, message: "请输入渠道联系人", trigger: "change" }
        ],
        channelContactTelephone: [
          { required: true, message: "请输入渠道联系人电话", trigger: "blur" }
        ],
        channelChief: [
          { required: true, message: "请输入渠道运营总监", trigger: "blur" }
        ],
      },
      isShowMaoYe: false, // 控制茂业部门的显示
      channelManagerData: [], //渠道运营经理的数据
      channelManagerData1: [], // 渠道运营经理的数据暂时存储
      channelDepMessage: "", // 渠道运营经理对应的部门
      isShowRole: true, // 控制新增编辑用户时的权限设置的显示隐藏
      // 茂业属性数据结束======================
      isShowPublicPool: false, // 编辑新增部门的时候是否显示设置公客池
      publicPoolIsTrue: false, // 编辑新增部门的时候公客池状态
      publicPoolIsTrue1: false,
      isEditPublicPool: false, // 编辑新增部门的时候公客池是否可编辑
      publicPoolData: {}, // 编辑或新增部门的时候将点击的部门信息存储
      isUploadLogo: false,
      isAddBanner: false,
      isShowCompanyDep: false,
      dialogImageUrl: "",
      dialogVisible: false,
      isShowCheckBox: false,
      departTitle: "新增部门",
      editUserTitle: "",
      editDepartData: { area: "" },
      // 分页器中的数据
      pageNum: 1,
      pageSize: 10,
      departmentMsg: "",
      companyType: "",
      // 表单中的数据
      formInline: { status: "", keyword: "" },
      ruleForm: {},
      companyName: "武汉吉家中房直销",
      companyArea: "华中-湖北-武汉",
      permissManageBox: false, // 权限管理弹框显示
      editPermissBox: false, // 编辑权限弹框的显示
      addPermissBox: false, // 新增权限弹框的显示
      setEmployeeTimeBox: false, // 设置私客掉公的弹框显示
      employeeDropTime: "", // 私客掉公的时间
      employeeDropRerson: "", // 私客掉公的数量
      employeeId: "", //私客掉公的id
      leaveOfficeBox: false, //  离职弹框显示
      dropCompanyPhone: "123456789", // 退出企业的当前用户手机
      dropCompanyCode: "", // 退出企业的短信验证码
      privateNum: 0, // 退出企业的私客数量
      giveMasterName: "", // 客户交接人名字
      showLogoImg: "", // 图片上传成功之后的logo显示
      uploadBox: false, // 上传logo弹框
      isShowEditUser: false, // 编辑用户的弹框显示
      deleteBoxTitle: "", // 删除部门和添加权限的title
      isShowEmployee: false, // 删除部门的span显示
      isShowLimitIpt: false, // 添加权限的input显示
      editLimitIpt: {}, // 编辑权限数据
      addLimitIpt: "", // 新增权限数据
      employeeNum: 20, // 删除部门的员工数量
      deleteDepartBox: false, // 删除部门的弹框
      addDepartBox: false, // 添加部门的弹框
      editUserBox: false, // 编辑用户的弹框
      addUserBox: false, //  添加用户的弹框
      addBannerBox: false, // 新增banner弹框显示
      projectNameIpt: true, // 新增banner项目名称的显示
      h5Input: false, // 新增banner广告连接的显示
      defaultEditUser: [], // 编辑用户时的默认的权限id
      companyAddress: "",
      addBannerForm: {},
      getUserInfoParams: {}, // 获取员工信息列表请求参数
      allMasterData: [],
      dialogImageUrl: "",
      dialogVisible: false,
      dialogFormVisible: false,
      isShowMove: false,
      moveEmployee: "刘德华",
      moveEmployeeNum: 1,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px",
      defaultProps: {
        // 左边树形数据的数据规则
        children: "child",
        label: "name"
      },
      isClickSearch: false,
      roleBits: "", // 新增用户时的权限展示
      editUserRolesShow: "", // 编辑用户时的权限展示
      multipleSelection: [],
      departDataList: [{ name: "" }], // 左边级联部门列表信息展示
      provinceList: [], // 所有省份列表
      cityList: [{ CityName: "请选择省份", CityID: "" }], //   省份对应的市
      userDataList: [], // 员工信息列表数据
      userListTotal: 0, // 分页器的数据总条数的显示
      leftClickContentId: this.$store.state.person.depId, // 点击左边树状时对应的id存储
      editUserData: {}, // 编辑用户信息列表
      companyTypeList: [
        { value: 1, label: "直销" },
        { value: 2, label: "分销" },
        { value: 3, label: "联动" },
        { value: 4, label: "茂业" }
      ], // 公司属性下拉选数据
      manageDataList: [], // 权限设置的权限列表数据
      roleList: [],
      // roleList: this.$store.state.person.roleList || [], // 权限列表信息
      addUserForm: { isDepMaster: false, majorArea: "" ,isJoint:false}, // 添加用户时的数据
      isShowAdminIpt: true, // 管辖部门的input框的显示隐藏
      areaId: 0, // 城市id
      adminDeptData: [], // 管辖部门的数据列表
      adminDeptProp: {
        // 管辖部门树状图的配置项
        label: "DeptName",
        value: "DepartOnlyCode",
        children: "SubDepart",
        disabled: "disabled"
      },
      employeeProps: {
        label: "roleName",
        id: "roleId",
        children: "children"
      },
      adminIptValue: "", // 管辖部门表单的数据
      personId: 0, // 当前用户id
      moveEmpForm: {}, // 批量转移员工的数据
      moveEmpData: [],
      moveEmpProp: {
        value: "id",
        label: "name",
        children: "child"
      },
      departName: "",
      moveEmpList: [], // 批量操作的表格数据
      moveEmpId: [], //批量转移员工的id
      projectListData: [], // 所有项目列表数据
      bannerProject: "", //
      againTime: 60, // 短信验证码倒计时
      isShowGet: true, // 显示获取短信验证码
      isShowAgain: false, // 重新获取验证码显示
      isShowNext: false, // 新增编辑用户下一步的表单显示
      isShowBefore: true, // 新增用户时上一步表单的显示
      showNextBtn: true, //  是否显示下一步按钮
      showBeforeBtn: false, // 是否显示上一步按钮
      showEditUserBefore: true, // 编辑用户时上一步表单的显示
      isShowCodeIpt: false, //是否显得手机短信验证输入框
      userPhone: "", // 每次点击编辑用户的时候的手机号的存储
      isEditUserAdmin: false, // 编辑用户时是否显示管辖部门框
      defaultEditAdmin: [], //  编辑用户时的默认勾选的管辖部门
      roleBitsArr: [], // 权限设置的数组存储id
      needDeleteDepId: "", // 删除部门时的部门id
      // provinceProp: "", // 省份的必填
      // companyTypeProp: "", // 公司属性的必填
      adminDeptId: "", //  获取联动公司管辖部门的城市id
      addUserRoleShow: "",
      defaultAddUser: [],
      bannerRules: {
        type: [
          { required: true, message: "请输入banner类型", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入banner名称", trigger: "blur" }
        ],
        location: [
          { required: true, message: "请输入banner位置", trigger: "blur" }
        ],
        buildName: [
          { required: true, message: "请输入项目名称", trigger: "blur" }
        ]
      },
      isShowDelBox: false,
      isSureDepClick: true,
      isSureUserClick: false,
      setCompanyForm: {},
      //  ============================  新功能变量定义 ================================
      companyPermissBox: false,
      companyPermissId: {},
      isShowLeaveBox: true, // 员工编辑能离职框中显示的内容
      showLeaveMsg: "", //员工不能离职时框中显示的内容
      defaultDepartArr: [], // 已经被选中的管辖部门id
      getCompany_permission: [], //权限管理的公司
      chose_permission: "", //选择后的权限管理的名字
      companyId: "", //默认的公司ID
      chose_maoye: "", //新增用户--茂业--岗位的选择后的结果值
      getCompany_maoye: [], //新增用户--茂业--岗位值
      choseCompanyPermission: "", //权限管理---下拉框选择后的id
      defaultDepartArr: [], // 已经被选中的管辖部门id
      stationVisible: false, //控制岗位管理弹框
      stationData: {}, //岗位管理传参数
      isStationManage: false, //控制岗位管理显示隐藏（茂业公司才显示）
      isShowGangWei_edit: "", //控制编辑用户茂业岗位
      leftLoading:false,    // 左边的加载动画
      rightLoading:false,    // 右边的加载动画
    };
  },
  created() {
    axios
      .get("/api/department/list/can")
      .then(res => {
        if (res.status === 200) {
        this.getUserInfo();
          // 调用获取左边组织架构列表的方法
          this.getLeftDepartList();
          const id = this.$store.state.person.depId;
          editDepartment({ params: { id: id } }).then(res => {
            if (res.status === 200) {
              this.adminDeptId = res.data.area;
              if (res.data.type == 0) {
                this.companyType = "非公司";
              } else {
                this.companyTypeList.forEach(value => {
                  if (value.value == res.data.type) {
                    this.companyType = value.label;
                    return;
                  }
                });
              }
              this.checkIsShowAdmin = res.data.sectoralNature
              this.companyId = res.data.companyId; //打开页面的默认id
              this.departmentMsg = res.data.name; //打开页面的默认当前部门
            }
          });
        }
      })
      .catch(err => {
        if (err.response.status === 403) {
          this.$router.push({ name: "403errorPage" });
          return;
        }
      });
  },
  mounted() {
    console.log(this.rules);
    this.rules.name[0].message = "请输入姓名";
  },
  methods: {
    // 获取左边组织架构列表的请求
    getLeftDepartList() {
      // debugger
      this.leftLoading = true
      getDepartList().then(res => {
        if (res.status === 200) {
          this.leftLoading = false
          this.departDataList = JSON.parse(
            "[" + JSON.stringify(res.data) + "]"
          );
        }
      });
    },
    // 获取右边列表信息的方法定义
    // 分页器的每个页面显示的数据量发生改变时
    handleSizeChange(val) {
      this.pageSize = val;
      this.getUserInfo();
    },
    // 分页器当前页码发生改变时
    handleCurrentChange(val) {
      // this.isClickSearch ? this.leftClickContentId = "" : ""
      if (this.isClickSearch) {
        this.formInline.status
          ? (this.getUserInfoParams.status = this.formInline.status)
          : "";
        this.formInline.keyword
          ? (this.getUserInfoParams.keyword = this.formInline.keyword)
          : "";
        this.leftClickContentId = "";
      }
      this.pageNum = val;
      this.getUserInfo();
    },
    // 获取用户信息
    getUserInfo() {
      this.rightLoading = true
      this.getUserInfoParams.depId = this.leftClickContentId;
      this.getUserInfoParams.pageNum = this.pageNum;
      this.getUserInfoParams.pageSize = this.pageSize;
      this.$axios.get("/api/employee/list",{params:this.getUserInfoParams}).then(res => {
        res = res.data
        if(res.status === 200){
          this.userDataList = res.data.list;
          this.userListTotal = res.data.total;
         this.userDataList.forEach(value => {
            value.sex = value.sex == 1 ? "男" : value.sex == 2 ? "女" : "";
            value.status = value.status == 1 ? "在职" : "离职";
            value.joinTime = value.joinTime ? value.joinTime.split(" ")[0] : "";
          });
        this.rightLoading = false
        }
      })
      // getEmployeeList({ params: this.getUserInfoParams }).then(res => {
      //   res.data.list.forEach(value => {
      //     value.sex = value.sex == 1 ? "男" : value.sex == 2 ? "女" : "";
      //     value.status = value.status == 1 ? "在职" : "离职";
      //     value.joinTime = value.joinTime ? value.joinTime.split(" ")[0] : "";
      //   });
      //   // console.log(arr);
      // this.rightLoading = false
      //   console.log(res.data.list);
      //   this.userDataList = res.data.list;
      //   this.userListTotal = res.data.total;
      //   console.log(res);
      // });
    },
    // 点击左边组织架构文字时
    getEmployeeInfo(scope) {
      this.isClickSearch = false;
      this.pageNum = 1;
      this.adminDeptId = scope.area;
      this.formInline = {};
      this.leftClickContentId = scope.id;
      this.departmentMsg = scope.name;
      this.checkIsShowAdmin = scope.sectoralNature
      // this.companyId = scope.companyId ? scope.companyId : myInfo.dep.companyId;
      this.companyId = scope.companyId;
      console.log(888);
      console.log(this.companyId);
      if (scope.type == 0) {
        this.companyType = "非公司";
      } else {
        this.companyTypeList.forEach(value => {
          if (value.value == scope.type) {
            this.companyType = value.label;
            return;
          }
        });
      }
      this.getUserInfo();
    },
    handleSelectionChange(select) {
      console.log(select);
      this.moveEmpList = select;
    },
    statusChange(val) {
      if (val === 1) {
        this.editUserData.leaveTime = "";
        this.isShowDelBox = false;
      } else {
        this.isShowDelBox = true;
      }
    },
    // 点击搜索
    onSearch() {
      this.isClickSearch = true;
      this.formInline.pageSize = this.pageSize;
      this.formInline.pageNum = 1;
      getEmployeeList({ params: this.formInline }).then(res => {
        console.log(res);
        this.pageNum = 1;
        res.data.list.forEach(val => {
          val.sex = val.sex == 1 ? "男" : val.sex == 2 ? "女" : "";
          val.status = val.status == 1 ? "在职" : "离职";
          val.joinTime = val.joinTime ? val.joinTime.split(" ")[0] : "";
        });
        this.userDataList = res.data.list;
        console.log(this.userDataList);
        this.userListTotal = res.data.total;
      });
    },
    onReset() {
      this.formInline = {};
      this.leftClickContentId = "";
      this.getUserInfo();
    },
    // 点击左边tree设置按钮
    editIcon(data) {
      // debugger
      data.isCompany ? (this.isUploadLogo = true) : (this.isUploadLogo = false);
      data.isCompany ? (this.isAddBanner = true) : (this.isAddBanner = false);
      data.id === 1 ? (this.isUploadLogo = true) : "";
      data.isCompany && data.type != 2
        ? (this.isShowCompanyDep = true)
        : (this.isShowCompanyDep = false);
      data.isCompany && data.type == 4
        ? (this.isStationManage = true)
        : (this.isStationManage = false);
    },
    idCardChange() {
      this.checkIdCard();
    },
    // 点击编辑用户
    editUserBtn(scope) {
      // debugger
      console.log(scope);
      this.isShowGangWei_edit = scope.row.companyType;
      axios
        .put("/api/employee/can")
        .then(res => {
          if (res.status === 200) {
            let checkIsShowAdmin = ""
            this.getGangweiData(scope.row.companyId);
            let majorArea = "";
            this.againTime = 60;
            this.isShowGet = true;
            this.isShowAgain = false;
            this.isShowGangWei = this.companyType;
            // this.roleList = [];
            // this.roleList = JSON.parse(localStorage.getItem("myInfo")).roleList;
            this.defaultEditUser = [];
            this.isShowDelBox = false;
            this.adminIptValue = "";
            editUser({ params: { id: scope.row.id } }).then(resault => {
              if (resault.status === 200) {
                this.editUserData = resault.data;
                this.getRoleList(scope.row.companyId,resault.data.roleList);
                console.log(resault.data);
                // 如果该部门下面没有岗位，或者从其他非茂业转到茂业，没有岗位，则postId=0，转化为空
                if (this.editUserData.postId == 0)
                  this.editUserData.postId = "";
                this.departmentMsg = resault.data.depName;
                editDepartment({ params: { id: resault.data.depId } }).then(
                  res => {
                    // debugger
                    if (res.status === 200) {
                      this.adminDeptId = res.data.area;
                     
                    }
                  }
                );
                majorArea = resault.data.majorArea;
                this.defaultEditAdmin = resault.data.majorArea
                  ? resault.data.majorArea.split(",")
                  : "";
                this.editUserRolesShow = resault.data.roleStr;
                let params = {
                  id: scope.row.id
                };
                getAllMaster({ params, params }).then(res => {
                  if (res.status === 200) {
                    this.allMasterData = res.data;
                  }
                });
                this.defaultEditUser = resault.data.roleIds;
                if (
                  (scope.row.companyType == "3" && (scope.row.sectoralNature != 2 && scope.row.sectoralNature != 3))||
                  (scope.row.companyType == "4" && (scope.row.sectoralNature != 2 && scope.row.sectoralNature != 3))
                ) {
                  // let params = {
                  //   except: scope.status == "离职" ? "" : majorArea
                  // }
                  this.isEditUserAdmin = true;
                  DefaultDepartM({
                    except: scope.row.status == "离职" ? "" : majorArea
                  }).then(res => {
                    if (res.status === 200) {
                      this.defaultDepartArr = res.data;
                      // 请求管辖部门接口 this.areaId
                      getAdminDept({
                        params: { cityID: this.adminDeptId }
                      }).then(res => {
                        if (res.status === 200) {
                          let majorArr = [];
                          let mainArr = [];
                          let str = "";
                          console.log(majorArea);
                          this.adminIptValue = majorArea
                            ? getDefaultString(majorArea, res.data)
                            : "";
                          this.editUserData.majorArea
                            ? (majorArr = this.editUserData.majorArea.split(
                                ","
                              ))
                            : "";
                          if (scope.row.companyType == "4") {
                            this.adminDeptData = JSON.parse(res.data);
                          } else {
                            str = replaceString(
                              this.defaultDepartArr,
                              res.data
                            );
                            this.adminDeptData = JSON.parse(str);
                          }
                          // console.log(this.adminDeptData);
                        } else {
                          this.alertMessage("warning", res.message);
                          return;
                        }
                      });
                    } else {
                      this.alertMessage("warning", res.message);
                      return;
                    }
                  });
                } else {
                  this.isEditUserAdmin = false;
                }
              } else if (resault.status === 403) {
                this.alertMessage("warning", res.message);
                return;
              }
            });
            this.dropCompanyPhone = scope.row.name;
            this.isShowCodeIpt = false;
            this.userPhone = scope.row.mobile;
            this.showEditUserBefore = true;
            this.showNextBtn = true;
            this.showBeforeBtn = false;
            this.isShowNext = false;
            this.personId = scope.row.id;
            this.editUserBox = true;
            this.editUserTitle = "编辑用户";
            this.isShowEditUser = true;
            this.isShowMove = false;
          } else {
            this.alertMessage("warning", "无操作权限");
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无编辑用户权限");
            return;
          }
        });
    },
    userPhoneChange() {
      // debugger
      if (this.editUserData.mobile != this.userPhone) {
        this.isShowCodeIpt = true;
      } else {
        this.isShowCodeIpt = false;
      }
    },
    // 点击确认编辑/新增部门按钮
    sureAddDepartment(deptRuleForm) {
      this.publicPoolIsTrue
        ? (this.editDepartData.teamId = this.publicPoolData.id)
        : (this.editDepartData.teamId = -1);
      if (!this.isSureDepClick) {
        return;
      }
      if (
        this.editDepartData.mobile &&
        !isMobileSize(this.editDepartData.mobile)
      ) {
        return;
      }
      // 拼接好省和市
      let areaName = "";
      this.provinceList.forEach(value => {
        if (this.editDepartData.province == value.ID) {
          areaName += value.ProvinceName + ",";
        }
      });
      this.cityList.forEach(value => {
        if (this.editDepartData.area == value.CityID) {
          areaName += value.CityName;
        }
      });
      this.editDepartData.areaName = areaName;
      this.editDepartData.pId = this.editDepartData.pId;
      // console.log(this.editDepartData);
      this.$refs[deptRuleForm].validate((valid, obj) => {
        // console.log(obj);
        if (valid) {
          if (this.editDepartData.isCompany) {
            if (
              !this.editDepartData.province ||
              !this.editDepartData.area ||
              !this.editDepartData.type
            ) {
              this.alertMessage("warning", "省市或公司属性不为空");
              return false;
            }
          }
          if((this.editDepartData.sectoralNature == 2 || this.editDepartData.sectoralNature == 3) && !this.departRolesShow){
            this.alertMessage("info","默认权限不能为空", 2000)
            return
          }
          if (!this.editDepartData.id) {
            // 请求新增部门接口
            this.editDepartData.type == 4 ? this.editDepartData.sectoralNature=0:""
            // console.log(this.editDepartData);
            addDepartment(this.editDepartData).then(res => {
              if (res.status === 200) {
                this.alertMessage("success", "新增成功");
                this.isSureDepClick = false;
                this.addDepartBox = false;
                this.getLeftDepartList();
              } else {
                this.alertMessage("warning", res.message,2000);
              }
            });
          } else {
            // 请求编辑新增部门接口
            // 秦星星改===当pid=-1的时候，重新命名为1
            if (this.editDepartData.pid == -1) {
              this.editDepartData.pid = 1;
            }
            console.log(this.editDepartData);
            editDepartmentPut(this.editDepartData).then(res => {
              if (res.status === 200) {
                this.addDepartBox = false;
                alertMessage("success", "编辑成功");
                this.isSureDepClick = false;
                this.getLeftDepartList();
              } else {
                alertMessage("warning", res.message,2000);
                return
              }
            });
          }
        } else {
          // debugger;
          console.log(Object.keys(obj));
          let toastMsg = this.departRules[Object.keys(obj)[0]][0].message;
          this.alertMessage("info", toastMsg, 2000);
          return;
        }
      });
    },
    // 点击新增或者编辑部门的时候对公客池的判断方法
    checkPublicPool(data, int) {
      this.publicPoolData = data;
      int == 1 ? this.writePublicPoolShow = 1:""
      this.isShowPublicPool = false;
      if (data.companyId > 0) {
        if (data.teamId < 0) {
          this.isShowPublicPool = true;
         int == 1 ? this.writePublicPoolShow = 2 : ""
        }
        if (data.teamId == data.id && int != 1) {
          this.isShowPublicPool = true;
          int == 1 ? this.writePublicPoolShow = 2 : ""
        }
      }
     int == 1 ? this.writePublicPoolStatus = 1 : ""
      this.publicPoolIsTrue = false;
      if (data.teamId > 0) {
        this.publicPoolIsTrue = true;
        int == 1 ? this.writePublicPoolStatus = 2: ""
      }
      if(int != 1 && data.isCompany){
        this.isShowPublicPool =false
      }
    },
    // 点击新增部门
    addDepartBtn(data) {
      this.checkPublicPool(data, 1);
      console.log(data);
      // console.log(this.editDepartData);
      // this.teamId > 0 ? this.isShowPublicPool = false :
      axios
        .post("/api/department/can")
        .then(res => {
          if (res.status === 200) {
            // debugger
            this.showLastDepart = true
            // 判断当前这个部门属性：为茂业时，新增部门时候显示部门性质...   不是茂业时跟原来新增部门一样
            if (data.type == 4) {
              this.isShowPublicPool = false
              this.isShowMaoYe = true;
              if(data.sectoralNature == 2 || data.sectoralNature == 3){
                this.noShowNormalDepart = false
              }else{
                this.noShowNormalDepart = true
              }
              this.noEditDepart = false
            } else {
              this.isShowMaoYe = false;
            }
            this.departRolesShow = ""
            this.defaultDepartRole = []
            this.isShowDepType = false;
            this.channelDepMessage = "";
            // this.editDepartData.sectoralNature
            // 当为茂业的时候新增时默认部门属性为茂业部门

            this.isSureDepClick = true;
            // 发送获取所有省份请求
            getAllProvince().then(res => {
              this.provinceList = res.data;
            });
            this.editDepartData = {
              isCompany: false
            };
            this.editDepartData.isCompany = false;
            // 请求获取部门信息接口
            editDepartment({ params: { id: data.id } }).then(res => {
              if (res.status === 200) {
                this.editDepartData.pname = res.data.name;
                this.addDepartBox = true;
                this.departTitle = "新增部门";
                // debugger
                if(data.companyId != -1){
                  this.isShowCheckBox = false
                }else{
                  this.isShowCheckBox = true
                  this.isShowPublicPool = true
                }
                // this.isShowCheckBox = (data.companyId != -1 ?  false : true);
                if(data.type == 4){
                  this.getRoleList(data.companyId)
                  this.$set(this.editDepartData, "sectoralNature", 2);
                  this.$set(this.editDepartData, "isShareCustomer", false);
                  // debugger
                  this.isShowShare = true
                  // this.isShowPublicPool = false
                }else{
                  this.isShowShare = false
                }
                // this.editDepartData.sectoralNature = 2;
                // console.log(res);
                if (res.data.pid == -1) {
                  //当pid=-1的时候就重新赋值为1
                  this.editDepartData.pid = 1;
                } else {
                  this.editDepartData.pid = res.data.pid;
                }
                this.editDepartData.pid = data.id;
              } else if (res.status === 403) {
                this.alertMessage("warning", res.message);
                return;
              }
            console.log(this.editDepartData);
            });
          } else {
            this.alertMessage("warning", "无操作权限");
          }
        })
        .catch(err => {
          // debugger
          console.log(err.response);
          if (err.response.status === 403) {
            this.alertMessage("warning", "无新增部门权限");
            return;
          }
        });
    },
    // 点击编辑部门
    editDepartBtn(data) {
      // debugger
      this.checkPublicPool(data);
      axios
        .put("/api/department/can")
        .then(res => {
          if (res.status === 200) {
            this.showLastDepart = false
            this.isSureDepClick = true;
            // 点击编辑部门时，当当前部门是公司或者不是公司但上级公司属性不是茂业公司则还是按照原来的来，
            // 当当前部门不是公司，并且所属公司是茂业公司时则显示到部门性质的部门编辑
            if(!data.isCompany && data.type == 4){
                this.getRoleList(data.companyId)
                this.isShowMaoYe = true
            }else{
                this.isShowMaoYe = false
            }
             this.isShowDepType = false;
            // 发送获取所有省份请求
            getAllProvince().then(res => {
              console.log(res);
              this.provinceList = res.data;
            });
            editDepartment({ params: { id: data.id } }).then(res => {
              this.addDepartBox = true;
              this.isShowCheckBox = false;
              this.departTitle = "编辑部门(公司)";
              // console.log(res);
              this.editDepartData = res.data;
              // console.log(this.editDepartData);
              this.defaultDepartRole = res.data.roleIds
              this.departRolesShow = res.data.roleStr
              // 点击编辑部门的时候进行判断，当当前部门性质为
              if(!data.isCompany && data.type == 4 && this.editDepartData.sectoralNature == 1){
                this.noEditDepart = true
                this.isShowShare = false
              }else{
                this.noEditDepart = false
              }
              if((!data.isCompany && data.type == 4 && this.editDepartData.sectoralNature == 2) ||
              (!data.isCompany && data.type == 4 && this.editDepartData.sectoralNature == 3)
              ){
                this.isShowShare = true
                this.isShowPublicPool = false
                this.noShowNormalDepart = false
              }else{
                this.noShowNormalDepart = true
                this.isShowShare = false
              }
              this.companyTypeData = res.data.type;
              if(data.isCompany &&data.type != 4){
                //  this.isShowDepType = false;
                 this.isShowMaoYe = false;
              }
              else if(!data.isCompany &&data.type != 4){
                 this.isShowDepType = false;
                 this.isShowMaoYe = false;
              }
              else if(data.isCompany &&data.type == 4){
                 this.isShowDepType = false;
                 this.isShowMaoYe = false;
              }
              else if(res.data.sectoralNature == 1&&data.type == 4&&!data.isCompany){
                 this.isShowDepType = true;
                 this.isShowMaoYe = false;
              }else{
                 this.isShowDepType = false;
                 this.isShowMaoYe = true;
              }
            });
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无编辑部门权限");
            return;
          }
        });
      // 请求获取部门信息接口
    },
    // 选择的权限发生改变时
    roleBitsChange(val) {
      console.log(val);
    },
    // 点击确认编辑用户
    sureEditUser(eidtUserRuleForm) {
      // 岗位非空判断
      if (this.isShowGangWei == "茂业" && this.isShowGangWei_edit == '4') {
        if (eidtUserRuleForm.postId) this.alertMessage("warm", "岗位不能为空");
      }
      this.submitForm("eidtUserRuleForm")
        .then(res => {
          if (!this.editUserData.captcha && this.isShowCodeIpt) {
            this.alertMessage("warning", "请输入新的验证码");
            return;
          }
          if (this.editUserData.status == 2) {
            this.allMasterData.forEach(val => {
              if (val.id === this.editUserData.masterId) {
                this.giveMasterName = val.name;
              }
            });
            getPersonEmployee({ params: { id: this.personId } }).then(res => {
              if (res.status === 200) {
                this.isShowLeaveBox = true;
                this.privateNum = res.data;
              } else if (res.status === 400) {
                this.isShowLeaveBox = false;
                this.showLeaveMsg = res.message;
              }
              this.leaveOfficeBox = true;
              console.log(res);
            });
            // this.editUserBox = false
          } else {
            delete this.editUserData.roleIds;
            delete this.editUserData.roleList;
            this.editUserData.leaveTime
              ? ""
              : delete this.editUserData.leaveTime;
            this.editUserData.joinTime ? "" : delete this.editUserData.joinTime;
            this.editUserData.birthday ? "" : delete this.editUserData.birthday;

            // this.editUserData.roleStr = this.editUserData.roleBits

            // this.editUserData.roleBits = 1 << (this.editUserData.roleBits - 1);
            editUserPut(this.editUserData).then(res => {
              console.log(res);
              if (res.status === 200) {
                this.alertMessage("success", "用户修改成功");
                this.editUserBox = false;
                this.getUserInfo();
              } else {
                this.alertMessage("warning", res.message);
              }
            });
          }
        })
        .catch(err => {
          this.alertMessage("warning", "请完善表单");
        });
      console.log(this.editUserData.status);
    },
    // 点击新增用户时的权限时
    handleNodeClickRole(data, value) {
      console.log(data);
      console.log(value);
      let str = "";
      let roleId = 0;
      value.checkedNodes.forEach(val => {
        str += val.roleName + ",";
        roleId += 1 << (val.roleId - 1);
      });
      this.addUserRoleShow = str;
      this.addUserForm.roleBits = roleId;
    },
    // 身份证号码验证
    checkIdCard() {
      if (this.addUserBox) {
        if (!isvalidCard(this.addUserForm.idcard)) {
          this.alertMessage("warning", "身份证号格式不正确");
          return 1;
        } else {
          return 0;
        }
      }
      if (this.editUserBox) {
        if (!isvalidCard(this.editUserData.idcard)) {
          this.alertMessage("warning", "身份证号格式不正确");
          return 1;
        } else {
          return 0;
        }
      }
    },
    // 点击编辑用户权限时
    handleNodeClickEditRole(data, value) {
      // debugger
      let str = "";
      let roleId = 0;
      value.checkedNodes.forEach(val => {
        str += val.roleName + ",";
        roleId += 1 << (val.roleId - 1);
      });
      // this.EditUserRolesShow = str.substr(0, str.length)
      this.editUserRolesShow = str;
      this.editUserData.roleBits = roleId;
    },
    // 选择生态链公司默认权限时
    handleNodeClickDepartRole(data,value){
        let str = "";
        let roleId = 0;
      value.checkedNodes.forEach(val => {
        str += val.roleName + ",";
        roleId += 1 << (val.roleId - 1);
      });
      // this.EditUserRolesShow = str.substr(0, str.length)
      this.departRolesShow = str;
      this.editDepartData.roleBits = roleId;
    },
    // 用户状态是离职时的确定编辑
    sureEditDeleteUser() {
      if (this.isShowLeaveBox) {
        delete this.editUserData.roleIds;
        delete this.editUserData.roleList;
        this.editUserData.leaveTime ? "" : delete this.editUserData.leaveTime;
        this.editUserData.joinTime ? "" : delete this.editUserData.joinTime;
        this.editUserData.birthday ? "" : delete this.editUserData.birthday;
        editUserPut(this.editUserData).then(res => {
          console.log(res);
          if (res.status === 200) {
            this.alertMessage("success", "用户修改成功");
            this.leaveOfficeBox = false;
            this.editUserBox = false;
            this.getUserInfo();
          } else {
            this.alertMessage("warning", res.message);
          }
        });
      } else {
        this.leaveOfficeBox = false;
      }
    },
    // 点击添加用户按钮
    addUserBtn(scope) {
      // this.companyType =scope.type;//type==4为茂业
      // debugge
      // console.log(888);
      console.log(scope);
      if (scope.type && scope.type !== "click") {
        scope.type == 4
          ? (this.isShowGangWei = "茂业")
          : (this.isShowGangWei = "");
      } else {
        // debugger
        this.isShowGangWei = this.companyType;
        // console.log(this.companyType);
      }
      //  (scope.type == 4) ? this.isShowGangWei = '茂业' : this.isShowGangWei = ""
      let myInfo = JSON.parse(localStorage.getItem("myInfo"));
      this.againTime = 60;
      this.isShowGet = true;
      this.isShowAgain = false;
      this.isSureUserClick = true;
      scope.companyId
        ? this.getRoleList(scope.companyId)
        : this.getRoleList(this.companyId);
      this.addUserRoleShow = "";

      axios
        .post("/api/employee/can")
        .then(res => {
          if (res.status == 200) {
            this.roleBits = "";
            scope.id ? (this.leftClickContentId = scope.id) : "";
            scope.area ? (this.adminDeptId = scope.area) : "";
            this.addUserForm = { isDepMaster: false, majorArea: "",isJoint:false };
            this.adminIptValue = "";
            this.isShowBefore = true;
            this.showNextBtn = true;
            this.showBeforeBtn = false;
            this.isShowNext = false;
            this.addUserBox = true;
            console.log(scope);
            this.addUserForm.depName = scope.name
              ? scope.name
              : this.departmentMsg;
            if ((scope.type == 'click' && ((this.companyType == "联动" && (this.checkIsShowAdmin != 2 && this.checkIsShowAdmin != 3))
             || (this.companyType == "茂业" && (this.checkIsShowAdmin != 2 && this.checkIsShowAdmin != 3)))) ||
              (scope.type != 'click' && ((scope.type === 3 && (scope.sectoralNature != 2 && scope.sectoralNature != 3)) || (scope.type == 4 && (scope.sectoralNature != 2 && scope.sectoralNature != 3))))
            ) {
              let params = { except: "" };
              DefaultDepartM(params).then(res => {
                if (res.status === 200) {
                  this.defaultDepartArr = res.data;
                  // 请求管辖部门接口 this.areaId
                  getAdminDept({ params: { cityID: this.adminDeptId } }).then(
                    res => {
                      if (res.status === 200) {
                        if (scope.type == 4) {
                          this.adminDeptData = JSON.parse(res.data);
                        } else {
                          let str = "";
                          str = replaceString(this.defaultDepartArr, res.data);
                          this.adminDeptData = JSON.parse(str);
                        }
                      } else {
                        this.alertMessage("warning", res.message);
                        return;
                      }
                    }
                  );
                } else {
                  this.alertMessage("warning", res.message);
                  return;
                }
              });
              this.isShowAdminIpt = true;
            } else {
              this.isShowAdminIpt = false;
            }
            this.addUserForm.depId = this.leftClickContentId;
            // console.log(this.addUserForm);
          } else {
            this.alertMessage("warning", "无操作权限");
          }
        })
        .catch(error => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无添加用户权限");
            return;
          }
        });
      // 茂业的岗位
      let companyId = "";
      companyId = scope.companyId ? scope.companyId : this.companyId;
      this.getGangweiData(companyId);
      // this.companyId = scope.companyId ? scope.companyId : myInfo.dep.companyId;
    },
    // 新增用户---茂业 ---岗位出现改变值
    choseMaoye(val) {
      // console.log(6666);
     this.addUserForm.postId = val;
     this.editUserData.postId = val;
      // console.log(this.addUserForm);
    },
    // 点击管辖部门节点时
    handleNodeClick(data, value) {
      let str = "";
      value.checkedNodes.forEach(value => {
        str += value.DeptName + ",";
      });
      this.adminIptValue = str;
      this.addUserForm.majorArea = value.checkedKeys.join(",");
      this.editUserData.majorArea = value.checkedKeys.join(",");
    },
    addUserPhoneChange() {
      if (!isvalidLoginPhone(this.addUserForm.mobile)) {
        this.alertMessage("info", "请输入正确的手机号");
      }
    },
    // 点击确认添加用户按钮
    sureAddUser(addUserRuleForm) {
      console.log(this.addUserForm);
      if (
        this.addUserForm.mobile &&
        !isvalidLoginPhone(this.addUserForm.mobile)
      ) {
        this.alertMessage("info", "请输入正确的手机号");
        return;
      }
      if (!this.isSureUserClick) {
        return;
      }
      console.log(111);
      this.submitForm("addUserRuleForm").then(res => {
        if (!this.addUserForm.title) {
          this.addUserForm.title = "";
        }
        addUser(this.addUserForm)
          .then(res => {
            if (res.status === 200) {
              this.alertMessage("success", "添加成功");
              this.isSureUserClick = false;
              this.isShowNext = false;
              this.isShowBefore = true;
              (this.showNextBtn = true), (this.showBeforeBtn = false);
              this.addUserBox = false;
              this.getUserInfo();
            } else {
              this.alertMessage("warning", res.message);
            }
            console.log(res);
          })
          .catch(error => {
            this.alertMessage("info", "请输入手机号");
          });
      });
    },
    provinceChanged() {
      delete this.editDepartData.area;
    },
    // 点击树状结构的删除部门
    deleteDepartBtn(data) {
      axios
        .delete("/api/department/can")
        .then(res => {
          if (res.status === 200) {
            this.needDeleteDepId = data.id;
            getDeleteDepartNum({ params: { id: data.id } }).then(res => {
              console.log(res);
              this.deleteDepartBox = true;
              this.isShowEmployee = true;
              this.isShowLimitIpt = false;
              this.deleteBoxTitle = "删除部门";
              this.employeeNum = res.data[0].count;
            });
          } else {
            this.alertMessage("warning", "无操作权限");
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无删除部门权限");
            return;
          }
        });
    },
    // 离职日期改变时
    dropCompanyTimeMethod() {
      let joinTime = 0;
      let leaveTime = 0;
      this.editUserData.leaveTime
        ? (leaveTime = +new Date(this.editUserData.leaveTime))
        : "";
      this.editUserData.joinTime
        ? (joinTime = +new Date(this.editUserData.joinTime))
        : "";
      if (this.editUserData.leaveTime && joinTime > leaveTime) {
        this.alertMessage("warning", "离职日期不能小于入职日期");
        return false;
      } else {
        return true;
      }
    },
    dropCompanyTime() {
      this.dropCompanyTimeMethod();
    },
    // 点击确定删除部门
    sureClickDeleteDepart() {
      if (this.employeeNum === 0) {
        deleteDepartment({ params: { id: this.needDeleteDepId } }).then(res => {
          if (res.status === 200) {
            this.alertMessage("success", "删除成功");
            this.getLeftDepartList();
          } else {
            this.alertMessage("success", res.message);
          }
          this.deleteDepartBox = false;
        });
      } else {
        this.deleteDepartBox = false;
      }
    },
    // 点击新增权限
    addLimit() {
      this.addPermissBox = true;
      this.addLimitIpt = "";
    },
    // 确认批量转移员工
    sureMoveClick(moveForm) {
      this.$refs[moveForm].validate(valid => {
        if (valid) {
          this.moveEmpForm.eids = this.moveEmpId;
          this.editUserBox = false;
          moveEmployeePut(this.moveEmpForm).then(res => {
            if (res.status === 200) {
              this.alertMessage("success", "转移成功");
              this.editUserBox = false;
              this.getUserInfo();
            } else {
              this.alertMessage("warning", res.message, 2500);
            }
          });
        } else {
          this.alertMessage("warning", "请填写完整信息");
          return false;
        }
      });
    },
    // 取消批量转移员工
    noMoveClick(moveForm) {
      this.editUserBox = false;
    },
    // 点击设置私客掉公
    setEmpDropTime(data) {
      this.setCompanyForm = {
        lockTime: "",
        lockCount: "",
        lockWarnTime: "",
        depLockTime: "",
        qrcodeUrl:"0"
      };
      let that = this;
      axios
        .put("/api/department/can")
        .then(res => {
          if (res.status === 200) {
            getDefaultForm({ params: { id: data.id } }).then(res => {
              console.log("秦星星修寻");
              console.log(res);
              if (res.status === 200) {
                that.setCompanyForm.lockTime = res.data.lockTime
                  ? res.data.lockTime
                  : 48;
                that.setCompanyForm.lockCount = res.data.lockCount
                  ? res.data.lockCount
                  : 50;
                that.setCompanyForm.lockWarnTime = res.data.lockWarnTime
                  ? res.data.lockWarnTime
                  : "";

                that.setCompanyForm.depLockTime = res.data.depLockTime
                  ? res.data.depLockTime
                  : "";
                that.setCompanyForm.qrcodeUrl = res.data.qrcodeUrl
                  ? res.data.qrcodeUrl
                  : "0";
              }
              // console.log(this.setCompanyForm);
            });
            this.setCompanyForm.id = data.id;
            // this.employeeId = data.id
            this.setEmployeeTimeBox = true;
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无操作权限");
          }
        });
    },
    // 点击私掉公的ajax
    setEmployeeAjax(dynamicValidateForm) {
      this.$refs[dynamicValidateForm].validate(valid => {
        if (valid) {
          console.log("挖去群群");
          console.log(this.setCompanyForm);
          if (
            !/^[0-9]*[1-9][0-9]*$/.test(this.setCompanyForm.lockCount) ||
            !/^[0-9]*[1-9][0-9]*$/.test(this.setCompanyForm.lockTime) ||
            (this.setCompanyForm.lockWarnTime != "" &&
              !/^[0-9]*[1-9][0-9]*$/.test(this.setCompanyForm.lockWarnTime)) ||
            (this.setCompanyForm.depLockTime != "" &&
              !/^[0-9]*[1-9][0-9]*$/.test(this.setCompanyForm.depLockTime))
          ) {
            this.alertMessage("warning", "时间和数量只能是大于0的整数", 2000);
            return;
          }
          employeeDrop(this.setCompanyForm).then(res => {
            if (res.status === 200) {
              this.alertMessage("success", "设置成功");
              this.getLeftDepartList();
            } else {
              this.alertMessage("warning", res.message);
              return;
            }
            this.setEmployeeTimeBox = false;
          });
        } else {
          this.alertMessage("warning", "请完善表单!");
          return false;
        }
      });
    },
    // 点击批量转移员工
    onExport() {
      axios
        .put("/api/employee/transfer/can")
        .then(res => {
          if (res.status === 200) {
            this.departName = "";
            if (this.moveEmpList.length !== 0) {
              getDepartList({ params: { iRoot: true } })
                .then(res => {
                  if (res.status === 200) {
                    console.log(res);
                    this.moveEmpData = JSON.parse(
                      "[" + JSON.stringify(res.data) + "]"
                    );
                  }
                })
                .catch(err => {
                  if (err.response.status === 403) {
                    this.alertMessage("warning", "无获取部门权限");
                    return;
                  }
                });
              let name = "";
              let arrId = [];
              this.moveEmpList.forEach(value => {
                name += value.name + "、";
                arrId.push(value.id);
              });
              this.moveEmpId = arrId;
              name = name.substr(0, name.length - 1);
              this.moveEmployee = name;
              this.moveEmployeeNum = arrId.length;
              this.editUserBox = true;
              this.editUserTitle = "批量转移员工";
              this.isShowMove = true;
              this.isShowEditUser = false;
            } else {
              // 秦星星 --- 没有选的时候给一个提醒
              this.alertMessage("warning", "请选择员工");
            }
          } else {
            this.alertMessage("warning", "无操作权限");
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无操作权限");
            return;
          }
        });
    },
    // 点击转移部门节点时
    clickNode(data, value, ss) {
      console.log(data);
      this.moveEmpForm.desDepId = data.id;
      this.departName = data.name;
    },
    // 请求获取权限列表
    getPermiseInfo(val) {
      getManageInfo({ params: { companyId: val } }).then(res => {
        this.manageDataList = res.data;
      });
      // 获得权限的公司
      getAllCompantInfo({ params: { dataAuth: true } }).then(res => {
        if (res.status == 200) {
          this.getCompany_permission = res.data;
        }
      });

      this.permissManageBox = true;
    },
    // 权限管理 -- 选择后的公司
    chosePermission(val) {
      // 当选择公司后查询列表
      this.choseCompanyPermission = val;
      this.getPermiseInfo(val);
    },
    // 点击权限设置时
    permissManage() {
      // 查看是否有权限

      this.chose_permission = this.companyId;
      axios
        .get("/api/func/role/can")
        .then(res => {
          if (res.status == 200) {
            this.getPermiseInfo(this.companyId);
          } else {
            this.alertMessage("warning", "无操作权限");
          }
        })
        .catch(function(err) {
          // debugger
          if (err.response.status === 403) {
            this.alertMessage("warning", "无操作权限");
            return;
          }
        });
      //
    },
    // 点击编辑权限时
    editRadioManage(scope) {
      axios
        .put("/api/func/role/can")
        .then(res => {
          if (res.status === 200) {
            console.log(scope);
            this.editPermissBox = true;
            this.editLimitIpt.name = scope.row.name;
            this.editLimitIpt.id = scope.row.role_id;
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无权访问");
            return;
          }
        });
    },
    // 确认编辑权限
    sureEditPermise() {
      if (!this.editLimitIpt.name) {
        this.alertMessage("warning", "权限不能为空");
        return;
      }
      editPermisePut(this.editLimitIpt).then(res => {
        if (res.status === 200) {
          alertMessage("success", "编辑成功");
          this.editPermissBox = false;
          // 如果进过选择了就选当前的公司的id，没有选择就选默认进来时的id
          this.getPermiseInfo(
            this.choseCompanyPermission
              ? this.choseCompanyPermission
              : this.companyId
          );
        } else {
          alertMessage("warning", "编辑失败");
        }
        console.log(res);
      });
    },
    // 点击确认新增权限时
    sureAddPermise() {
      if (!this.addLimitIpt) {
        this.alertMessage("warning", "请输入权限名称");
        return;
      }
      addPermise({
        name: this.addLimitIpt,
        companyId: this.choseCompanyPermission
          ? this.choseCompanyPermission
          : this.companyId
      }).then(res => {
        if (res.status === 200) {
          alertMessage("success", "新增成功");
          this.addPermissBox = false;
          this.getPermiseInfo(
            this.choseCompanyPermission
              ? this.choseCompanyPermission
              : this.companyId
          );
        } else {
          alertMessage("warning", res.message);
        }
      });
    },
    // 点击上传logo
    uploadLogo(data) {
      axios
        .put("/api/department/logo/can")
        .then(res => {
          if (res.status === 200) {
            console.log(data);
            let areaStr = "";
            editDepartment({ params: { id: data.id } }).then(res => {
              areaStr = res.data.areaName.split(",").join("-");
              this.companyArea = areaStr;
            });
            this.companyName = data.name;
            this.uploadBox = true;
            this.leftClickContentId = data.id;
          } else {
            this.alertMessage("warning", "无操作权限");
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无操作权限");
            return;
          }
        });
    },
    // 点击确认上传按钮
    sureUploadLogo() {
      if (!this.dialogImageUrl) {
        this.alertMessage("warning", "图片不能为空");
        return false;
      }
      uploadLogoPut({
        id: this.leftClickContentId,
        logo: this.dialogImageUrl
      }).then(res => {
        if (res.status === 200) {
          // 秦星星增加---公司logo---左上角使用
          if (
            uploadLogoPut.id ===
            JSON.parse(localStorage.getItem("myInfo")).depId
          ) {
            let params = JSON.parse(localStorage.getItem("myInfo"));
            params.companyLogo = this.dialogImageUrl;
            this.$store.commit("companyLogo", this.dialogImageUrl);
            localStorage.setItem("myInfo", JSON.stringify(params));
          }
          this.alertMessage("success", "logo上传成功");
          this.uploadBox = false;
          this.$refs.upload.clearFiles();
          this.getLeftDepartList();
        } else {
          this.alertMessage("warning", "图片上传失败");
        }
      });
    },
    beforeLogoUpload(file) {
      if (file.size / 1024 > 70) {
        this.alertMessage("warning", "图片大小不超过70kb");
        return false;
      }
      console.log(file);
    },
    bannerBeforeUp(file) {
      if (file.size / 1024 > 70) {
        this.alertMessage("warning", "图片大小不超过70kb");
        return false;
      }
    },
    // 点击取消上传按钮
    noUploadLogo() {
      this.uploadBox = false;
    },
    clickList(row, event, column) {},
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 文件上传成功的钩子
    uploadLogoSuccess(file) {
      console.log(file);
      this.dialogImageUrl = file.images[0].src;
    },
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 点击确定权限管理的修改
    // surePermissManage() {
    //   this.permissManageBox = false;
    // },
    // 点击取消权限管理的修改
    noPermissManage() {
      this.choseCompanyPermission = this.companyId;
      this.getCompany_permission = [];
      this.chose_permission = "";
      this.permissManageBox = false;
    },
    // 点击设置权限按钮
    setPermissClick(scope) {
      axios
        .put("/api/func/can")
        .then(res => {
          if (res.status === 200) {
            // 跳转路由
            this.$router.push({
              path: "setPermiss",
              query: { roleId: scope.row.role_id }
            });
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无权访问");
            return;
          }
        });
    },
    // 删除指定权限弹框消失时
    handleClose(done) {
      done();
    },
    // 点击删除指定权限
    deletePermissClick(scope) {
      this.deletePermissDialog = true;
      // console.log(scope);
      this.deletePermissId = scope.row.role_id;
    },
    // 点击确认删除权限
    sureDeletePermiss() {
      this.$axios
        .delete("/api/func/role", { params: { id: this.deletePermissId } })
        .then(res => {
          res = res.data;
          // debugger
          if (res.status === 200) {
            this.alertMessage("success", "删除成功");
            this.deletePermissDialog = false;
            this.getPermiseInfo(
              this.choseCompanyPermission
                ? this.choseCompanyPermission
                : this.companyId
            );
          } else {
            this.alertMessage("warning", res.message);
            this.deletePermissDialog = false;
            return;
          }
        });
    },
    // 点击新增banner
    addBanner(data) {
      axios
        .post("/api/banner/can")
        .then(res => {
          if (res.status === 200) {
            this.addBannerForm = {};
            console.log(data);
            let areaStr = "";
            editDepartment({ params: { id: data.id } }).then(res => {
              areaStr = res.data.areaName.split(",").join("-");
              this.companyAddress = areaStr;
            });
            this.addBannerForm.companyId = data.id;
            this.addBannerForm.companyName = data.name;
            this.addBannerBox = true;
          } else {
            this.alertMessage("warning", "无操作权限");
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无操作权限");
            return;
          }
        });
    },
    // 确定点击新增banner
    sureAddBanner(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          if (!this.dialogImageUrl) {
            this.alertMessage("warning", "请选择banner图片");
            return;
          }
          this.projectListData.forEach(value => {
            if (value.value === this.addBannerForm.buildName) {
              this.addBannerForm.buildId = value.id;
            }
          });
          this.addBannerForm.url = this.dialogImageUrl;
          addBannerPut(this.addBannerForm).then(res => {
            if (res.status === 200) {
              this.alertMessage("success", "添加成功");
              this.addBannerBox = false;
            } else {
              this.alertMessage("warning", res.message);
            }
          });
        } else {
          this.alertMessage("warning", "请完善表单");
        }
      });
    },
    // 点击table行的时候
    tableRowClick(row, event, column) {
      // console.log(row);
      // console.log(column);
      // console.log(event);
    },
    // 秦星星改，querySearch方法名重了
    querySearch1(queryString, cb) {
      this.projectListData = [];
      getProjectListInfo({
        params: { keyword: queryString, cId: this.addBannerForm.companyId }
      }).then(res => {
        if (res.status === 200) {
          res.data.forEach(value => {
            this.projectListData.push({ value: value.name, id: value.id });
          });
        }
      });
      cb(this.projectListData);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    houseTypeChange() {
      if (this.addBannerForm.type == "1") {
        this.projectNameIpt = false;
        this.h5Input = true;
      } else if (this.addBannerForm.type == "2") {
        this.projectNameIpt = false;
        this.h5Input = false;
      } else {
        this.projectNameIpt = true;
        this.h5Input = false;
      }
    },
    /* ================ */

    /* =========== */
    // 点击获取验证码
    getPhoneCd() {
      let params = {};
      if (this.addUserBox) {
        params = { mobile: this.addUserForm.mobile, type: 1 };
        if (!isvalidLoginPhone(this.addUserForm.mobile)) {
          this.alertMessage("info", "请输入正确的手机号");
          return;
        }
      } else {
        params = { mobile: this.editUserData.mobile, type: 1 };
        if (!isvalidLoginPhone(this.editUserData.mobile)) {
          this.alertMessage("info", "请输入正确的手机号");
          return;
        }
      }
      getPhoneCode({ params: params })
        .then(res => {
          if (res.status === 200) {
            this.isShowGet = false;
            this.isShowAgain = true;
            let timerId = setInterval(() => {
              this.againTime--;
              if (this.againTime == 0) {
                clearInterval(timerId);
                this.againTime = 60;
                this.isShowGet = true;
                this.isShowAgain = false;
              }
            }, 1000);
          } else {
            this.alertMessage("warning", res.message);
            return;
          }
          console.log(res);
        })
        .catch(err => {
          console.log(err);
          this.alertMessage("warning", err.message);
        });
    },
    addNextStep(aaa) {
      let refStr =
        aaa == "addUserRuleForm" ? "addUserRuleForm" : "eidtUserRuleForm";
      this.submitForm(refStr)
        .then(res => {
          if (this.checkIdCard() == 0) {
            if (refStr == "addUserRuleForm" && !this.addUserForm.joinTime) {
              this.alertMessage("warning", "请输入入职日期");
              return;
            }
            if (refStr == "addUserRuleForm" && !this.addUserForm.roleBits) {
              this.alertMessage("info", "请选择权限");
              return;
            }
            if (refStr == "eidtUserRuleForm" && !this.editUserRolesShow) {
              this.alertMessage("info", "请选择权限");
              return;
            }
            if (this.editUserData.status == 2 && !this.editUserData.leaveTime) {
              this.alertMessage("warning", "请输入离职日期");
              return;
            }
            if (this.editUserData.status == 2 && !this.editUserData.masterId) {
              this.alertMessage("warning", "请输入客户交接人");
              return;
            }
            if (this.isShowGangWei == "茂业" && !this.editUserData.postId && this.isShowGangWei_edit == '4') {
                this.alertMessage("warning", "岗位不能为空");
                return;
            }
            if (!this.dropCompanyTimeMethod()) {
              return;
            }
            !this.isShowDelBox || !this.editUserData.isDel
              ? (this.editUserData.isDel = false)
              : "";
            this.showEditUserBefore = false;
            this.isShowNext = true;
            this.isShowBefore = false;
            (this.showNextBtn = false), (this.showBeforeBtn = true);
            console.log(this.editUserData.isDel);
          }
        })
        .catch(error => {
          let toastMsg = this.rules[Object.keys(error)[0]][0].message;
          this.alertMessage("info", toastMsg);
        });
    },
    // ===================左边树状node鼠标移入时====================
    treeNodeEnter(e) {},
    // ============== 点击高级公司管理时=======================
    companyPermiss(data) {
      axios
        .post("/api/company/senior/config/can")
        .then(res => {
          if (res.status === 200) {
            this.companyPermissId = data;
            this.companyPermissBox = true;
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无操作权限");
            return;
          }
        });
    },
    closePermissBox(data) {
      if (data === "yes") {
        this.getLeftDepartList();
      }
      this.companyPermissBox = false;
    },
    addBeforeStep() {
      this.showEditUserBefore = true;
      this.isShowNext = false;
      this.isShowBefore = true;
      (this.showNextBtn = true), (this.showBeforeBtn = false);
    },
    // 秦星星修改===点击用户编辑===取消按钮，清空管辖部门数据
    getGangweiData(id) {
      // companyId = scope.companyId ? scope.companyId : this.companyId
      // this.companyId = scope.companyId ? scope.companyId : myInfo.dep.companyId;

      getCompanyIdQueryPostList({ params: { companyId: id } }).then(res => {
        // console.log("秦星星修寻");
        // console.log(res);
        this.getCompany_maoye = res.data;
      });
    },
    editUserBoxChange() {
      // this.adminIptValue = "";
      this.editUserBox = false;
    },
    // 新增部门电话号码验证
    mobileSize() {
      isMobileSize(this.editDepartData.mobile);
    },
    checkSelect(selecttion, row) {
      console.log(selecttion);
      console.log(row);
    },
    stationManage(data) {
      this.stationData = data;
      this.stationVisible = true;
    },
    // =====================需求：新增茂业部门属性方法开始==============================
    // 公司checkbox发生改变时
    isCompanyMethod(val){
      // debugger
      this.isShowPublicPool = !val 
    },
    departTypeChange(val) {
      if (val == 1) {
        this.isShowDepType = true;
        this.isShowMaoYe = false;
        this.isShowShare = false
        if(this.writePublicPoolShow == 2){
          this.isShowPublicPool = true
          if(this.writePublicPoolStatus == 2){
            this.publicPoolIsTrue = true
          }
        }
      } else {
        this.isShowShare = true
        this.isShowPublicPool = false
        this.isShowDepType = false;
        this.isShowMaoYe = true;
      }
    },
    // querySearch(queryString, callback) {
    //   if (queryString) {
    //     // this.getChannelManager(queryString);

    //     let depId = JSON.parse(localStorage.getItem("myInfo")).depId;
    //     let params = {
    //       depId: depId,
    //       keyword: queryString
    //     };
    //     this.$axios
    //       .get("/api/employee/departmentalIdQueryEmployees", { params: params })
    //       .then(res => {
    //         if (res.status === 200) {
    //           callback(res.data.data);
    //         } else {
    //           this.alertMessage("warning", res.message);
    //           return;
    //         }
    //       });
    //   } else {
    //     this.channelManagerData = this.channelManagerData1;
    //   }
    // },
    // 渠道经理获取的方法
    getChannelManager(queryString, int) {
      let depId = JSON.parse(localStorage.getItem("myInfo")).depId;
      let params = {
        depId: depId,
        keyword: queryString
      };
      this.$axios
        .get("/api/employee/departmentalIdQueryEmployees", { params: params })
        .then(res => {
          if (res.status === 200) {
            int ? (this.channelManagerData1 = res.data.data) : "";
            this.channelManagerData = res.data.data;
          } else {
            this.alertMessage("warning", res.message);
            return;
          }
        });
    },
    // 点击渠道运营经理下拉选数据时
    channelChange(val) {
      debugger
      this.editDepartData.channelManagerName = val.split("-")[2];
      this.editDepartData.channelManager = val.split("-")[0];
      this.editDepartData.channelManagerDepartmentName = val.split("-")[1];
      // debugger
    },
    // 页面加载时请求接口获取权限列表数据
    getRoleList(id,int) {
      // debugger
      let params = {
        companyId: id
      };
      this.$axios.get("/api/func/my", { params: params }).then(res => {
        res = res.data;
        // debugger
        if (res.status === 200) {
          this.roleList = res.data;
          if(int && int.length != 0){
            let count = 0;
            int.forEach((ele,index) => {
              count = 0
              res.data.forEach(val => {
                if(ele.roleId == val.roleId){
                    count++;
                }
              })
              if(count == 0){
                this.roleList.push(int[index])
              }
            })
          }
        } else {
          this.isShowRole = false;
        }
      });
    },
    // =====================需求：新增茂业部门属性方法结束==============================
    // =====================上级部门可编辑方法开始=====================================
    beforeClick(data){
      this.editDepartData.pname = data.name
      this.editDepartData.pid = data.id
    }
    // =====================上级部门可编辑方法结束=====================================
  },
  // 添加用户的时候的下一步
  computed: {
    getProvinceName: function() {
      // debugger
      let arr = [];
      // this.editDepartData.area=""
      this.provinceList.forEach(item => {
        if (item.ID === this.editDepartData.province) {
          this.editDepartData.areaName = item.ProvinceName;
          arr = item.CityList;
          this.cityList = arr;
        }
      });
      return arr;
    },
    departAddress() {
      return this.editDepartData.address
        ? this.editDepartData.address.length
        : 0;
    },
    departIntro() {
      return this.editDepartData.description
        ? this.editDepartData.description.length
        : 0;
    },
    isShowCompany() {
      if (this.editDepartData.isCompany) {
        // this.isShowPublicPool=false
        // this.provinceProp = "province";
        // this.companyTypeProp = "type";
      } else {
        // this.isShowPublicPool=true
        // this.provinceProp = "";
        // this.companyTypeProp = "";
      }
      return this.editDepartData.isCompany;
    }
  },
  watch: {
    isShowMaoYe(val) {
      // debugger
      if (val) {
        // console.log(555);
        // console.log(val);
        this.getChannelManager("", 1);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
// ===============================生态链部门样式开始====================
/deep/.el-select-dropdown__item{
  padding: 0 !important;
  >span{
    margin-left: 8px;
  }
  .el-tree-node__content{
    margin-left: 5px;
  }
}
/deep/ .org_addDepart{
    .el-form{
      .el-form-item{
        label{
          width: 110px !important;
        }
      }
    }
}
/deep/ .depart-link{
  .el-form-item{
    &:nth-of-type(1){
      margin:0 98px 18px 0 !important;
    }
    &:nth-of-type(2){
      .el-input__inner{
        width: 142px;
      }
    }
  }
}
// ===============================生态链部门样式结束=====================
// =========================上级部门可编辑样式开始================
/deep/ .editDepart-before{
  .el-input{
    width: 100% !important;
  }
}
// =========================上级部门可编辑样式结束================
// =========================茂业属性样式开始======================
/deep/ .depart-departType {
  .el-input__inner {
    width: 141px !important;
  }
}
/deep/ .depart_phone {
  margin-left: 94px !important;
}
/deep/ .depart-newPart-two {
  .el-form-item {
    &:nth-of-type(1) {
      .el-input__inner {
        margin-right: 7px !important;
      }
    }
  }
}
/deep/ .depart-newPart {
  .el-form-item {
    &:nth-of-type(1) {
      margin: 0 98px 18px 0;
      .el-input__inner {
        width: 136px !important;
      }
    }
    &:nth-of-type(2) {
      label {
        display: inline-block;
        width: 110px !important;
      }
      .el-form-item__content {
        > span {
          display: inline-block;
          height: 27px;
          width: 150px;
          overflow: hidden; /*超出部分隐藏*/
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /*规定段落中的文本不进行换行 */
        }
      }
    }
    &:nth-of-type(3) {
      margin-right: 103px;
      .el-input__inner {
        width: 136px;
      }
    }
    &:nth-of-type(4) {
      .el-input__inner {
        width: 140px;
      }
    }
  }
}
/deep/ .user-tree {
  .el-tree-node__expand-icon {
    display: none;
  }
}
// =========================茂业属性样式结束======================
/deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #fd8f00;
}
/deep/.item-publicPool {
  background: transparent;
  padding: 0;
  border: transparent;
  img {
    margin-bottom: 6px;
  }
}
/deep/ .setPublic-pool .el-checkbox-group {
  margin-left: 30px;
}
/deep/.rolePermissItem {
  label::before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
}
/deep/.mobileInputBox {
  label::before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
}
/deep/.permissIpt::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
/deep/.bannerPhotoBox {
  label::before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
}
/deep/.el-select .el-input .el-select__caret {
  line-height: 0;
}
.permission {
  width: 100%;
  margin-bottom: 10px;
}
.orgLeft-setBox {
  position: relative !important;
}
.el-dropdown-menu {
  left: 63px !important;
  padding: 0;
  > li {
    color: #333;
    border-bottom: 1px solid #dddddd;
    &:nth-last-child() {
      border-bottom: none;
    }
  }
}
/deep/ .el-tree-node > .el-tree-node__children {
  overflow: inherit;
}
.org_container {
  .org_leftTree {
    height: 730px;
    overflow: auto;
    // width: 320px;
    background-color: #fff;
  }
  .listContent {
    overflow: scroll;
    width: 320px;
  }
  .departIntroduceBox {
    position: absolute;
    right: 8px;
    top: 40px;
    color: #666;
  }
  .org-icon {
    font-size: 15px;
    margin-right: 3px;
    line-height: 5px;
  }
  .orgLeft-icon {
    font-size: 17px;
    color: #333;
    margin-left: 10px;
  }
  display: flex;
  justify-content: space-between;
  .newDepartBox {
    text-align: center;
  }
  .org_addDepart {
    .departName {
      width: 289px;
      height: 30px;
      background-color: #ffffff;
      border-radius: 3px;
      border: solid 1px #dcdfe6;
      margin-right: 136px;
      padding: 0 15px;
      font-size: inherit;
      color: #606266;
      &:focus {
        border-color: #409eff;
      }
    }
    .departAddressBox {
      color: #666;
    }
  }
  // 左边树状样式
  .left_Content {
    width: 25%;
    margin-right: 20px;
  }
  .right_Content {
    overflow: auto;
    /deep/ .el-table{
      .el-table__empty-block{
      min-height: 500px;
      }
    }
    .el-form {
      background-color: #d7d7df;
      .searchBtn,
      .resetBtn {
        background-color: #fd8f00;
        border-radius: 3px;
        width: 66px;
        border: none;
        margin-left: 19px;
        height: 30px;
        color: #fff;
        cursor: pointer;
      }
      .addIpt,
      .piliangBtn,
      .adminBtn {
        width: 105px;
        background-color: #72a0d1;
        border-radius: 3px;
        border: none;
        margin-left: 19px;
        height: 30px;
        color: #fff;
        cursor: pointer;
      }
      .resetBtn {
        background-color: #a0a0a0;
      }
    }
    .nowAdress {
      height: 51px;
      background-color: #fdf7e1;
      line-height: 51px;
      padding-left: 20px;
      span {
        font-size: 14px;
        color: #333;
        margin-right: 30px;
      }
    }
    .editData {
      width: 58px;
      height: 26px;
      background-color: #31313c;
      border-radius: 3px;
      border: none;
      outline: none;
      cursor: pointer;
      color: #fefefe;
    }
    .zhuGuan {
      color: #fa7a58;
      margin-left: 5px;
      font-size: 12px;
      border: 1px solid #fa7a58;
      border-radius: 3px;
    }
  }
  /deep/ .org_empDropTimeCss {
    margin-top: 15px;
    .el-form-item__label {
      width: 150px !important;
    }
    .el-form-item{
      &:nth-last-child(1){
        .el-form-item__label{
          padding: 0 20px 0 0;
        }
      }
    }
    .el-input {
      width: auto;
    }
  }
  .org_empDropTime {
    .empDropTime_content {
      text-align: center;
      margin-top: 15px;
    }
    .move_footer {
      margin-top: 40px;
      padding: 20px 0;
    }
  }
  .move_footer {
    margin-top: 130px;
  }
  .sureAdd {
    background: #fd8f00;
  }
  .noAdd {
    background-color: #a0a0a0;
  }
  .getPhoneCd {
    color: #fd8f00;
    cursor: pointer;
    width: 98px;
    font-size: 12px;
    position: absolute;
    left: 197px;
    top: 8px;
    height: 35px;
    line-height: 27px;
    text-align: right;
  }
  .againPhoneCd {
    color: #666;
    font-size: 12px;
    cursor: text;
  }
  .noAdd,
  .sureAdd {
    width: 104px;
    height: 40px;
    border-radius: 5px;
    border: none;
    color: #fff;
  }
  // 秦星星增加
  .noAddClose {
    width: 104px;
    height: 40px;
    border-radius: 5px;
    border: none;
    background-color: #ccc;
    margin-left: -85px;
  }
  .el-button:focus,
  .el-button:hover {
    color: #31313c;
  }
  // 上传logo样式
  .org_upload {
    height: 200px;
    position: relative;
    .uploadLogoBox {
      width: 68px;
      height: 68px;
      position: absolute;
      top: 149px;
      left: 130px;
      background-color: #e6e6e6;
      /deep/ .el-upload.el-upload--picture-card {
        background: none !important;
      }
      .el-icon-plus {
        width: 30px;
        height: 30px;
        border: 1px solid #a1a1a1;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        &::before {
          font-size: 16px;
          position: absolute;
          top: 6px;
          left: 6px;
        }
      }
      .message {
        position: absolute;
        width: 130px;
        height: 12;
        top: 0;
        left: 215px;
        span {
          color: #333;
        }
        p {
          margin-bottom: 0;
          color: #ff5151;
        }
      }
    }
    .move_footer {
      text-align: center;
      margin-top: 130px;
    }
    p {
      color: #666;
      margin-bottom: 16px;
      span {
        color: #333;
      }
    }
  }

  /deep/ .el-dialog__body {
    .el-checkbox__label,
    .el-form-item__label {
      color: #666;
      font-weight: 400 !important;
    }
  }
  // 退出企业样式

  .org_permiss {
    .addPermiss {
      border: none;
      width: 80px;
      height: 34px;
      background-color: #72a0d1;
      border-radius: 3px;
      margin-bottom: 10px;
      color: #fff;
      cursor: pointer;
    }
    .move_footer {
      text-align: center;
      margin-bottom: 50px;
      margin-top: 50px;
    }
    .editPermiss {
      padding: 5px;
      height: 26px;
      background-color: #31313c;
      border-radius: 3px;
      border: none;
      outline: none;
      cursor: pointer;
      color: #fefefe;
    }
  }
}
// 离职样式
.leaveOffice {
  p {
    margin-bottom: 15px;
    width: 100%;
    text-align: center;
    &:nth-of-type(2) {
      margin-top: 40px;
      color: #666;
    }
    &:nth-of-type(3) {
      color: #f84949;
    }
    span {
      color: #666;
    }
  }
}
// =============================================新增用户样式修改开始=====================================================
.addBanner {
  /deep/ .el-radio {
    margin-left: 10px;
  }
}
.org_addUser {
  /deep/ .el-form-item {
    &:nth-of-type(7) {
      label {
        padding-left: 17px;
      }
    }
    &:nth-of-type(4) {
      label {
        &::before {
          content: "*";
          color: #f56c6c;
          margin-right: 4px;
        }
      }
    }
  }
  /deep/ label {
    // display: flex;
    text-align: justify;
    text-justify: inter-ideograph;
    text-align-last: justify;
    // justify-content: space-between;
  }
}
.org_editUser {
  /deep/ .el-form-item {
    &:nth-of-type(2) {
      label {
        padding-left: 30px;
        text-align-last: justify;
      }
    }
    &:nth-of-type(6) {
      label {
        padding-left: 15px;
        text-align-last: justify;
      }
    }
    &:nth-of-type(8) {
      label {
        padding-left: 12px;
        text-align-last: justify;
      }
    }
    &:nth-of-type(9) {
      label {
        padding-left: 15px;
        text-align-last: justify;
      }
    }
  }
  .addUserPhone{
   /deep/ .el-form-item{
      label {
        width: 118px!important;
      }
    }
  }
}
/deep/ .el-select-dropdown__item {
  padding: 0;
}
// =============================================新增用户样式修改结束================================================
/deep/ .org-dropEmployee{
  margin-right: 3px !important;
}
/deep/ .org-empTransfer{
  label{
    width: 108px !important;
  }
}
.addNewPermiss {
  .el-dialog {
    .el-dialog__body {
      margin-top: 20px;
      color: #333;
      letter-spacing: 1px;
      .permissIpt {
        text-align: center;
      }
      .el-input {
        width: 240px;
        height: 30px;
        margin-left: 8px;
      }
    }
  }
}
</style>
