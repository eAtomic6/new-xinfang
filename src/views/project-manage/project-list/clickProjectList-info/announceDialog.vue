<!-- 点击发布时的弹框 -->
<template>
  <div>
    <el-form :model="announceForm" ref="announceForm" :rules="announceRule" label-width="100px" class="demo-ruleForm">
        <el-form-item label="发 布 系 统:">
          <el-checkbox-group v-model="announceForm.platform" v-if="dictionaryData">
              <el-checkbox v-for="item in dictionaryData" :key="item.key" :label="item.key" name="type">{{item.value}}
              </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <div v-if="isShowMember">
          <el-form-item label="吉家联系人:" prop="id">
              <el-select v-model="announceForm.id" filterable   
              placeholder="请选择" @change="selectChange">
                  <!-- <el-option label="请选择" :value="0"></el-option> -->
                  <el-option v-for="value in selectData" :key="value.id" :label="value.name" :value="value.id"></el-option>
              </el-select>
          </el-form-item>
          <div class="announce_footer"><label>电 话</label>:<span>{{mobile}}</span></div>
          <div class="announce_footer"><label>职 务</label>:<span>{{adminList}}</span></div>
          <div class="announce_footer"><label>400电话</label>:<span>{{minMobile}}</span></div>
          <div class="announce_alertMessage" v-show="isShowMember">发布吉家后，项目会在10分钟内同步到吉家APP</div>
        </div>
    </el-form>
    <div class="move_footer">
      <el-button  @click="submitForm('announceForm')" class="sureAdd"  type="primary" round>确 定</el-button>
      <el-button @click="noSubmitForm" class="noAdd">取 消</el-button>
    </div>
  </div>
</template>

<script>
import {
  getAllProjectST,
  getAnnounceMember,
  sureAddAnounce,
  editDepartmentPuts
} from "@/api/index.js";
export default {
  data() {
    return {
      syncValue: "", // 同步下拉框中选择的内容
      dictionaryData: [], // 发布系统的数据
      announceForm: {
        id: "",
        platform: []
      },
      selectData: [],
      mobile: "",
      adminList: "",
      minMobile:"",
      announceRule: {
        id: [{ required: true, message: "请选择驻场人员", trigger: "change" }]
      }
    };
  },
  props: ["projectId"],
  created() {
    this.getDefaultData();
    this.getDictionary();
    this.getAllAnnounceData('');
    this.mobile = "";
        this.adminList = "";
        this.minMobile = ""
  },
  methods: {
    selectChange(val) {
      this.selectData.forEach(value => {
        if (value.id === val) {
          this.mobile = value.mobile;
          this.adminList = value.title;
          this.minMobile = value.mobile400
        }
      });
    },
    getDefaultData() {
      this.announceForm = {
        id: "",
        platform: []
      };
    },
    getAllAnnounceData(query) {
      getAnnounceMember({ params: { bId: this.projectId.id, keyword:query} }).then(res => {
        this.selectData = res.data;
        
        if (
          this.announceForm.platform.length !== 0 &&
          this.announceForm.platform.indexOf(1) !== -1
        ) {
          if(res.data && res.data.length > 0){
            res.data.forEach(val => {
              // debugger
              if (this.projectId.ssrId == val.id) {
                this.announceForm.id = this.projectId.ssrId;
                this.mobile = val.mobile;
                this.adminList = val.title;
                this.minMobile = val.mobile400
              }
            });
          }
        }
      });
    },
    getDictionary() {
      getAllProjectST({ params: { ids: "145" } }).then(res => {
        if (res.status === 200) {
          this.dictionaryData = res.data["145"].children;
          this.announceForm.platform = this.bitOpera1(
            res.data["145"].children,
            this.projectId.platform
          );
        }
      });
    },
    getPlatformNum: function(arr) {
      let leng = arr.length;
      if (leng === 1) {
        return arr[0];
      }
      if (leng === 2) {
        return arr[0] | arr[1];
      } else {
        let val = arr[0] | arr[1];
        arr = arr.slice(2);
        arr.unshift(val);
        return this.getPlatformNum(arr);
      }
    },
    //与位运算
    bitOpera1: function(arr, num) {
      // debugger
      let newArr = [];
      arr.forEach(item => {
        let bit = item.key & num;
        if (item.key === bit) {
          newArr.push(item.key);
        }
      });
      return newArr;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            !this.announceForm.id ||
            (this.announceForm.platform.length == 1 &&
              this.announceForm.platform[0] == 2)
          ) {
            this.announceForm.id = 0;
          }
          let platform = this.getPlatformNum(this.announceForm.platform);
          let params = {
            id: this.projectId.id,
            ssrId: this.announceForm.id,
            platform: platform
          };
          sureAddAnounce(params).then(res => {
            if (res.status === 200) {
              this.alertMessage("success", "操作成功");
              this.$emit("close", "yes");
            } else {
              this.alertMessage("warning", res.message);
              return;
            }
          });
        } else {
          this.alertMessage("info", "请选择吉家联系人");
          return;
        }
      });
    },
    noSubmitForm() {
      this.$emit("close", "no");
    },
    // 吉家联系人选择的模糊搜索方法
    // remoteMethod(query){
    //     this.getAllAnnounceData(query)
    // },
  },
  computed: {
    isShowMember() {
      if (
        this.announceForm.platform.length !== 0 &&
        this.announceForm.platform.indexOf(1) !== -1
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    projectId() {
      // debugger
      this.getDefaultData();
      this.getDictionary();
      this.getAllAnnounceData();
    }
  }
};
</script>
<style lang='scss' scoped>
/deep/ .el-form-item {
  margin-bottom: 0px;
  label {
    font-weight: normal;
  }
  .el-select-dropdown__item {
    padding: 6px 12px !important;
  }
  .el-select {
    display: block;
  }
}
.announce_alertMessage{
  color: red;
  text-align: left;
  margin-top: 30px;
  margin-left: 28px;
}
.announce_footer {
  margin-left: 30px;
  margin-top: 15px;
  label {
    display: inline-block;
    width: 56px;
    text-align-last: justify;
  }
  span {
    margin-left: 10px;
  }
}
</style>