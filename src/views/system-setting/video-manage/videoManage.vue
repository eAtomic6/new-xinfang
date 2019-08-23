<!-- H5视频管理页面 -->
<template>
    <div>
        <div class="content-txt">
            <!-- 查询表单 start -->
            <el-form :inline="true" :model="vedioFrom" class="demo-form-inline w-select" min-width="1398px">
                <el-form-item label="公司名称" v-if="companyId<0">
                    <el-select v-model="vedioFrom.companyId" size="mini">
                        <el-option v-for="item in companyNameArr" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="视频状态">
                    <el-select v-model="vedioFrom.isOnshelve" size="mini">
                        <el-option v-for="item in vedioStatus" :key="item.key" :label="item.value" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关键词">
                    <el-input v-model="vedioFrom.name" placeholder="请输入关键词" size="mini" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" class="search-but">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="reset" class="chongzhi-but">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addVideoBtn" class="but-lightblue"><span data-v-05fc45b4="" class="icon icon-zengjia org-icon mr10"></span>新增</el-button>
                </el-form-item>
            </el-form>
            <!-- 查询表单 end -->
            <!-- 视频table start -->
            <el-table :data="vedioTableData" class="table-list" style="width: 100%" tooltip-effect="dark">
                <el-table-column v-for="item in notConfig" :key="item.label" class="table-row" v-show="item.enable" :prop="item.prop" :label="item.label" :width="item.width" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <p v-if="item.enable">{{scope.row.companyName}}</p>
                    </template>
                </el-table-column>
                <el-table-column class="table-row" prop="sortAsc" label="顺序" min-width="50" show-overflow-tooltip>
                </el-table-column>
                <el-table-column class="table-row" prop="name" label="视频标题" min-width="300" show-overflow-tooltip>
                </el-table-column>
                <el-table-column class="table-row" prop="sizeStr" label="文件大小" min-width="140">
                </el-table-column>
                <el-table-column class="table-row" prop="createBy" label="上传人" min-width="140">
                </el-table-column>
                <el-table-column class="table-row" prop="isOnshelve" label="状态" min-width="80">
                    <template slot-scope="scope">
                        <span v-html="scope.row.isOnshelve?'上架':'下架'"></span>
                    </template>
                </el-table-column>
                <el-table-column class="table-row" prop="onshelveTime" label="上架时间" min-width="200">
                </el-table-column>
                <el-table-column class="table-row" prop="offshelveTime" label="下架时间" min-width="200">
                </el-table-column>
                <el-table-column class="table-row" label="操作" min-width="400">
                    <template slot-scope="scope">
                        <el-button type="text" class="table-btn" @click="changeSort(scope.row,true)">升序</el-button>
                        <el-button type="text" class="table-btn" @click="changeSort(scope.row,false)">降序</el-button>
                        <el-button type="text" class="table-btn" @click="changeShelf(scope.row,true)">上架</el-button>
                        <el-button type="text" class="table-btn" @click="changeShelf(scope.row,false)">下架</el-button>
                        <el-button type="text" class="table-btn delete" @click="deleteVedio(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 视频table end -->

            <!-- 分页start -->
            <div class="block" v-if="vedioTableData.length>0">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[5, 10, 20, 30,40]" :page-size="pageSize" layout=" prev, pager, next, total, sizes,jumper" :total="total">
                </el-pagination>
            </div>
            <!-- 分页end -->
            <el-dialog title="新增视频" :visible.sync="addVideoBox" @close="closeAddVideoBox" width="500px" class="addVideo_component">
                <add-video @closeAddVideoBox="closeAddVideoBox" @getVedioListAjax="getVedioListAjax"></add-video>
            </el-dialog>
        </div>
    </div>
</template>
<script src="./videoManage.js"></script>
<style lang='scss' scoped src="./videoManage.scss"></style>
