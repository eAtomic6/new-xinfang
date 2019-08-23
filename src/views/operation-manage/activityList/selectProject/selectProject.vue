<!-- 选择项目添加活动的弹框 -->
<template>
  <div>
    <div class="selectProject-main">
      <div class="main-left fl">
        <div class="mainLeft-top">
          <el-input v-model="input" @keyup.enter.native="inputChange" placeholder="请输入项目名称"></el-input>
        </div>
        <div class="mainLeft-center">
          <span class="fl" style="color:#999999">项目总数:{{projectTotals}}</span>
          <span class="fr">
            全选&nbsp;&nbsp;
            <el-checkbox v-model="checked" @change="allChecked"></el-checkbox>
          </span>
        </div>
        <div class="mainLeft-footer">
          <el-scrollbar style="height:100%">
            <ul>
              <li v-for="(item,index) in projectData" :key="index">
                <span class="fl" style="font-size:16px">{{item.bName}}</span>
                <span class="mainLeft-footer-checkbox">
                  <!-- <el-checkbox
                    v-model="(isCustom == 1 ? item.shelvesNumber>2 : item.shelvesNumber>0) ?  true : item.shelvesNumberBoolean"
                    @change="checkChange(index,item)"
                    :disabled="isCustom == 1 ? item.shelvesNumber>2 : item.shelvesNumber>0"
                  ></el-checkbox> -->
                  <el-checkbox
                    v-model="item.shelvesNumber > 0 ? true : item.shelvesNumberBoolean"
                    @change="checkChange(index,item)"
                    :disabled="item.shelvesNumber>0"
                  ></el-checkbox>
                </span>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
      <div class="main-right fr">
        <div class="mainRight-top">
          <span class="fl">请勾选左边需要发布的项目</span>
          <span class="fr" style="cursor: pointer;" @click="emptyChecked">
            清空
            <i class="el-icon-delete"></i>
          </span>
        </div>
        <div class="mainRight-center">
          <el-scrollbar style="height:100%">
            <ul>
              <li v-for="(item,index) in checkedData" :key="index">
                <span class="fl" style="font-size:16px">{{item.bName}}</span>
                <span class="mainRight-center-delete" @click="removeProject(index,item)">
                  <i class="icon icon-yudingtishikuang-shurukuang-quxiao"></i>
                </span>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div class="move_footer">
      <el-button class="sureAdd" @click="sureSelect" type="primary" round>确 定</el-button>
      <el-button @click="noSelect" class="noAdd">取 消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
      checked: false,
      checkedData: [], //右边选中的项目
      projectData: [], // 项目总数数据
      projectTotals: "", //项目数量
      firstTotals:""
    };
  },
  props: ["companyId","editActivityData","writeDownData","isCustom"],
  created() {
    this.getProjectData();
  },
  methods: {
    getProjectData(int) {
      // console.log(this.editActivityData);
        let _that = this
      let params = {
        companyId: this.companyId,
        keyword: this.input,
        bfaId:this.editActivityData.activityId ? this.editActivityData.activityId : ""
      };
      // console.log(params)
      this.$axios
        .get(`/api/${this.isCustom == 1 ? 'customEventSelectionProject' : 'fixedActivitySelectionItems'}`, { params: params })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.projectData = res.data;
            !this.firstTotals ? this.firstTotals = res.data.length : ""
            this.projectTotals = res.data.length;
            let count = 0;
            if(this.editActivityData && this.editActivityData.idStr){
                // debugger
                // console.log(this.writeDownData);
                let idArr = []
                let strArr = []
                idArr = this.writeDownData.idStr ? this.writeDownData.idStr.split(",") : this.editActivityData.id.split(",")
                strArr = this.writeDownData.str ? this.writeDownData.str.split(",") : this.editActivityData.idStr.split(",")
                // debugger
               if(int != 1){
                 idArr.forEach((res,index) => {
                   this.checkedData.push({id:res,bName:strArr[index]})
                })
               }
            }
            // debugger
            if(_that.checkedData.length && _that.projectData){
                _that.projectData.forEach(element => {
                   _that.checkedData.forEach(val => {
                        if(val.id == element.bId){
                            element.shelvesNumberBoolean=true
                        }
                    })
                    if(!element.shelvesNumberBoolean){
                              count++;
                    }
                })
                // console.log(count)
                if(count != 0){
                    this.checked = false
                }else{
                    this.checked = true
                }
            }else{
                this.checkAllChecked()
            }
          }
        });
    },
    //   点击全选时
    allChecked(val) {
      if (val) {
        this.allCheckChange(val);
      } else {
        this.allCheckChange(val);
      }
    },
    //   当全选框发生改变时
    allCheckChange(val) {
      this.projectData.length == this.firstTotals ? this.checkedData = [] : ""
      // this.checkedData = [];
      console.log(this.projectData.length == this.firstTotals);
      if (this.projectData) {
        this.projectData.forEach(res => {
          this.checkedData.forEach((element,index) => {
            // debugger
            if(!val && res.bId == element.id){
              this.checkedData.splice(index,1)
            }
          })
          res.shelvesNumberBoolean = val;
          if(res.shelvesNumber == 0 && val){
              this.checkedData.push({id:res.bId,bName:res.bName});
          }
        });
      }
      // val ? "" : (this.checkedData = []);
    },
    //   当前点击项目checkbox时
    checkChange(index, item) {
      //   debugger;
      //   console.log(item.isTrue)
      if (item.shelvesNumberBoolean) {
        this.checkedData.push({id:item.bId,bName:item.bName});
        this.checkAllChecked();
      } else {
        this.checked = false;
        this.checkedData.forEach((res,index) => {
            if(res.id == item.bId){
                this.checkedData.splice(index, 1);
            }
        })
      }
    },
    // 用来检验是否所有的项目都被选中
    checkAllChecked() {
        // debugger
      if (this.projectData) {
        let count = 1;
        this.projectData.forEach(res => {
          if (!res.shelvesNumberBoolean) {
            count++;
          }
        });
        if (count == 1) {
          this.checked = true;
        } else {
          this.checked = false;
        }
      }
    },
    // 点击右边移除选中项
    removeProject(index, item) {
      this.checkedData.splice(index, 1);
      this.projectData.forEach(element => {
        if (element.bId == item.id) {
          element.shelvesNumberBoolean = false;
        }
      });
      this.checked = false;
    },
    // 点击右边清空按钮时
    emptyChecked() {
      if (this.checkedData) {
        this.checkedData.forEach(res => {
          this.projectData.forEach(element => {
            if (element.bId == res.id) {
              element.shelvesNumberBoolean = false;
            }
          });
        });
        this.checkedData = [];
        this.checked = false;
      }
    },
    // 项目搜索框发生改变时
    inputChange(val){
        // debugger
        this.getProjectData(1)
    },
    // 点击确认选择
    sureSelect(){
        let param = {}
        let idStrArr = []
        let idArr = []
        console.log(this.checkedData);
        if(this.checkedData.length && this.projectData.length){
            this.checkedData.forEach(res => {
              idStrArr.push(res.id)
              idArr.push(res.bName)
              })
                // idArr.push(res.bName)
                // this.projectData.forEach(element =>{
                //     if(res.id == element.bId){
                //         idStrArr.push(element.bId)
                //     }
                // })
        }
        param.str = idArr.length ? idArr.join(",") : ""
        param.idStr = idStrArr.length ? idStrArr.join(",") : ""
        this.$emit("selectedProject",param)
    },
    // 点击取消选择
    noSelect(){
       this.$emit("closeSelectBox") 
    }
  }
};
</script>
<style lang='scss' scoped>
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #fd8f00;
  border: #fd8f00;
  width: 16px;
  height: 16px;
}
/deep/ .el-checkbox__input.is-disabled .el-checkbox__inner{
    background-color:#9e9e9e !important;
}
/deep/ .el-checkbox__inner {
  width: 16px;
  height: 16px;
  &::after {
    left: 6px;
    height: 9px;
  }
}
.selectProject-main {
  width: 100%;
  height: 490px;
  // background-color: red;
  border-bottom: 1px solid #dddddd;
  .main-left,
  .main-right {
    width: 50%;
    height: 100%;
    // background-color: red;
  }
  .main-left {
    border-right: 1px solid #dddddd;
    padding: 15px 30px 10px;
    .mainLeft-center {
      height: 50px;
      line-height: 50px;
    }
    .mainLeft-footer {
      width: 106%;
      height: 385px;
      // overflow-y:scroll;
      // background-color: red;
      ul {
        width: 100%;
        // height: 100%;
        li {
          position: relative;
          width: 100%;
          height: 36px;
          line-height: 25px;
          span {
            &:nth-of-type(1) {
              display: inline-block;
              width: 280px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .mainLeft-footer-checkbox {
            // margin-right: 26px;
            position: absolute;
            right: 19px;
          }
        }
      }
    }
  }
  .main-right {
    padding: 15px 30px 10px;
    .mainRight-top {
      color: #999999;
      width: 100%;
      height: 30px;
      line-height: 30px;
    }
    .mainRight-center {
      width: 100%;
      height: 418px;
      margin-top: 15px;
      // background-color: red;
      ul {
        width: 100%;
        height: 100%;
        li {
          position: relative;
          width: 100%;
          height: 36px;
          line-height: 25px;
           span {
            &:nth-of-type(1) {
              display: inline-block;
              width: 280px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .mainRight-center-delete {
            // margin-right: 26px;
            position: absolute;
            right: 20px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
.move_footer {
  position: absolute;
  width: 770px;
  bottom: 22px;
}
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>