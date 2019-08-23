<!-- banner管理 -->
<template>
  <div class="container" id='bannerCss'>
    <!-- 头部样式 -->
    <div class="header w-select">
      <el-form :inline="true" :model="keyWordData" class="demo-form-inline" min-width="1398px">
        <el-form-item label="公司:" v-if="companyId<0">
          <el-autocomplete
            class="inline-input"
            v-model="keyWordData.name"
            :fetch-suggestions="querySearch"
            placeholder="输入公司名称"
            :trigger-on-focus="false"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="keyWordData.isOffshelf" class="selectIpt">
            <el-option label="上架" :value=0></el-option>
            <el-option label="下架" :value=1></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="录入日期:">
          <el-date-picker
          v-model="keyWordData.startTime"
          type="date"
          placeholder="选择日期">
        </el-date-picker> -->

          <!-- 秦星星修改 -->
        <el-form-item label="录入日期:">
          <el-date-picker
          v-model="createBannerTime"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        </el-form-item>
        <el-form-item>
          <button type="button"  class="searchBtn" @click="sureQueryInfo">查询</button>
        </el-form-item>
        <el-form-item>
          <button type="button" class="resetBtn" @click="resetQueryInfo">重置</button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 中间样式 -->
    <div class="content">
      <el-table
      ref="multipleTable"
      :data="bannerDataList"
      tooltip-effect="dark"
      heigth='250'
      header-align=center
      border
      @selection-change="handleSelectionChange">
      <el-table-column
        label="序号"
        width="60"
        type="index">
      </el-table-column>
      <el-table-column
        prop="provinceName"
        label="省"
        width="130">
      </el-table-column>
      <el-table-column
        prop="cityName"
        label="市"
        width='60'
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="compName"
        label="公司名称"
        width='138'
        show-overflow-tooltip>
      </el-table-column>
       <el-table-column
        prop="location"
        label="banner位置"
        width='120'
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="type"
        label="banner类型"
        width='120'
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="name"
        label="banner名称"
        width='280'
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="is_offshelf"
        label="状态"
        width='50'
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="onshelf_time"
        label="上架时间"
        width='200'
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="offshelf_time"
        label="下架时间"
        width='200'
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="create_by"
        label="录入人"
        width='80'
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="录入时间"
        width='180'
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
          <button type="button" class="editData" @click="pushBtn(scope)" v-show="scope.row.is_offshelf=='上架'? false : true">上架</button>
           <button type="button" class="editData" @click="pullBtn(scope)" v-show="scope.row.is_offshelf=='上架'? true : false">下架</button>
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
      :total="count" v-show="showPage">
    </el-pagination>
    </div>
</div>
</template>

<script>
import {
  getBannerList,
  getDepartList,
  operationInfo,
  getAllCompantInfo
} from "@/api";
import axios from "axios"
export default {
  data() {
    return {
      companyData: [],
      pageNum: 1,
      pageSize: 5,
      formInline: {},
      bannerDataList: [],
      keyWordData: { name:"",pageNum: 1, pageSize: 5,endTime:"",endTime:""},
      count: 0,
      companyInfoList: [],
      showPage: true, //控制当页数为0的时候显示隐藏
      createBannerTime: [],
      companyId:""
    };
  },
  created() {
     let myInfo = JSON.parse(localStorage.getItem('myInfo'))
    this.companyId = myInfo.dep.companyId
    axios.get("/api/banner/list/can").then(res => {
      if(res.status === 200){
        this.getBannerInfo();
      }
    }).catch(err => {
      if(err.response.status === 403){
      this.$router.push({name: "403errorPage"})
      return
      }
    })
  },
  methods: {
    getBannerInfo() {
      if (this.keyWordData.name) {
        this.companyInfoList.forEach(value => {
          if (value.value === this.keyWordData.name) {
            this.keyWordData.companyId = value.id;
          }
        });
      }else{
        delete this.keyWordData.companyId
      }
      this.keyWordData.pageNum = this.pageNum
      this.keyWordData.pageSize = this.pageSize
      getBannerList({
        params: this.keyWordData
      }).then(res => {
        if(res.status === 200){
          console.log(res);
        this.count = res.data.count;
        res.data.bannerList.is_offshelf == "下架"
          ? (this.isShelf = true)
          : (this.isShelf = false);
        res.data.bannerList.filter(value => {
          return (
            (value.type = value.type == 0 ? "推荐房源" : (value.type == 1) ? "H5广告" : '视频链接') &&
            (value.is_offshelf = !value.is_offshelf ? "上架" : "下架")
            // &&
            // (value.onshelf_time =value.onshelf_time ? value.onshelf_time.substr(0, 10) : "") &&
            // (value.offshelf_time =value.offshelf_time ? value.offshelf_time.substr(0, 10) : '') &&
            // (value.create_time =value.create_time ? value.create_time.substr(0, 10) : '')
          );
        });
        this.bannerDataList = res.data.bannerList;
        }
      });
    },
    handleNodeClick() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getBannerInfo();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getBannerInfo();
    },
    resetQueryInfo() {
      this.keyWordData = { name:"",pageNum: 1, pageSize: 5,endTime:"",endTime:""};
      this.createBannerTime = []
      this.companyData = [];
      this.getBannerInfo();
    },
    // 公司输入的值
    querySearch(queryString, cb) {
      console.log(queryString);
      this.companyInfoList = [];
      getAllCompantInfo({ params: { keyword: this.keyWordData.name } }).then(
        res => {
          console.log(res);
          if (res.status === 200) {
            res.data.forEach(value => {
              this.companyInfoList.push({ value: value.name, id: value.id });
            });
          }
        }
      ).catch(err => {
         if(err.response.status === 403){
          this.alertMessage("warning", "无查询公司权限")
          return
          }
      })
      cb(this.companyInfoList);
    },
    // 上架操作
    pushBtn(scope) {
      axios.put("/api/banner/operate/can").then(res => {
        if(res.status === 200 ){
          const params = { id: scope.row.id, isOffshelf: 0 };
          operationInfo(params).then(res => {
            if (res.status === 200) {
              this.alertMessage("success", "上架成功");
              this.getBannerInfo();
            } else {
              this.alertMessage("warning",res.message);
            }
            console.log(res);
          });
        }
      }).catch(err => {
        if(err.response.status === 403){
          this.alertMessage("warning", "无操作权限")
          return
          }
      })
    },
    // 下架操作
    pullBtn(scope) {
       axios.put("/api/banner/operate/can").then(res => {
        if(res.status === 200 ){
          const params = { id: scope.row.id, isOffshelf: 1 };
          operationInfo(params).then(res => {
            if (res.status === 200) {
              this.alertMessage("success", "下架成功");
              this.getBannerInfo();
            } else {
              this.alertMessage("warning", "下架失败");
            }
            console.log(res);
          });
        }
      }).catch(err => {
         if(err.response.status === 403){
          this.alertMessage("warning", "无操作权限")
          return
          }
      })
    },
    // 根据关键词确定查询
    sureQueryInfo() {
      this.keyWordData.pageNum = 1
      this.keyWordData.pageSize = this.pageSize
      if (this.keyWordData.name) {
        // debugger
        this.companyInfoList.forEach(value => {
          if (value.value === this.keyWordData.name) {
            this.keyWordData.companyId = value.id;
          }
        });
      }else{
        delete this.keyWordData.companyId
      }
      console.log(this.createBannerTime);
      console.log(this.keyWordData.companyId);
      if(this.createBannerTime.length !== 0){
        this.keyWordData.endTime = this.timeFormats(this.createBannerTime[1])
        this.keyWordData.startTime = this.timeFormats(this.createBannerTime[0]) 
      }else if(!this.createBannerTime){
        // delete this.keyWordData.endTime
        // delete this.keyWordData.startTime
        this.keyWordData.startTime = ""
        this.keyWordData.endTime = ""
      }
      let params = this.keyWordData;
      console.log("哈哈哈哈或期货");
      console.log(params);
      getBannerList({ params: params }).then(res => {
        this.count = res.data.count;
        res.data.bannerList.filter(value => {
          return (
            (value.type = value.type == 0 ? "推荐房源" : "H5广告") &&
            (value.is_offshelf = !value.is_offshelf ? "上架" : "下架") 
            // (value.onshelf_time = value.onshelf_time ? value.onshelf_time.substr(0, 10) : "") &&
            // (value.offshelf_time =value.offshelf_time ? value.offshelf_time.substr(0, 10) : "") &&
            // (value.create_time = value.create_time ? value.create_time.substr(0, 10) : '')
          );
        });
        this.showPage = true;
        console.log(res.data.bannerList);
        this.bannerDataList = res.data.bannerList;
      });
    }
  }
};
</script>
<style lang='scss'>
#bannerCss {
  // 头部样式
  .header {
    height: 60px;
    background-color: #d7d7df;
    // 头部表单样式
    .el-form {
      .el-cascader {
        line-height: 0;
        .el-cascader__label {
          line-height: 30px;
        }
      }
      .el-input__prefix {
        left: 128px;
      }
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
      .resetBtn {
        background-color: #a0a0a0;
      }
      .addIpt {
        background-color: #72a0d1;
      }
    }
  }
  // 中间table样式
  .el-table__body {
    button {
      width: 51px;
      height: 26px;
      background-color: #31313c;
      border-radius: 3px;
      border: none;
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>