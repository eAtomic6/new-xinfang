<!-- 设置权限 -->
<template>
  <div class="container">
      <div class="permiss-header">
          <el-button type='warning' @click="suerSetPermise">保存</el-button>
          <el-button type="info" @click="cancel">取消</el-button>
      </div>
      <div class="content">
          <h3>所有功能列表</h3>
          <table>
              <tr v-for="(val, key, index) in dataList" :key="index">
                  <td>
                        {{key}}
                  </td>
                  <td>
                     <el-checkbox v-for="(list,index) in val" v-model="list.ck"  :label="list" :key="index">
                       <div v-if="list.message">
                          <el-tooltip class="item" effect="dark" :content="list.message" placement="top-start">
                          <span>{{list.note}}</span>
                          </el-tooltip>
                       </div>
                       <div v-else>
                          <span>{{list.note}}</span>
                       </div>
                       </el-checkbox>
                  </td>
              </tr>
          </table>
      </div>
      <div class="footer">
          <el-button  style="background-color: #fd8f00;" @click="suerSetPermise">保存</el-button>
          <el-button  style="background-color: #a0a0a0;" @click="cancel">取消</el-button>
      </div>
  </div>
</template>

<script>
import { getSetPermiseInfo, setPermisePut } from "@/api";
export default {
  data() {
    return {
      isChecked: true,
      checkAll: false,
      dataList: [],
      roleId: this.$route.query.roleId
    };
  },
  created() {
    console.log(this.$route.query.roleId);
    getSetPermiseInfo({ params: { roleId: this.$route.query.roleId } }).then(
      res => {
        console.log(res);
        this.dataList = res.data;
      }
    );
  },
  methods: {
    suerSetPermise() {
      console.log(this.dataList);
      // 循环数据拿到所有被选中的权限
      let isCheckedArr = [];
      for (const key in this.dataList) {
        this.dataList[key].forEach(element => {
          if (element.ck) {
            isCheckedArr.push(element.id);
          }
        });
      }
      let isCheckedStr = isCheckedArr.join(",");
      !isCheckedStr ? isCheckedStr = "," : ""
      const params = { funcCk: isCheckedStr, roleId: this.roleId };
      console.log("哈哈哈哈或期货")
      console.log(params);

      setPermisePut(params).then(res => {
        if (res.status === 200) {
          this.alertMessage("success", "修改成功");
          setTimeout(() => {
            this.$router.push({  name: 'orgFramework' });
          }, 1000);
        } else {
          this.alertMessage("warning", res.message);
        }
        console.log(res);
      });
    },
    //秦星星  ===  取消
    cancel(){
        this.$router.push({ name: 'orgFramework' });
    }
  }
};
</script>
<style lang='scss' scoped>
.container {
  .el-button {
    width: 82px;
    height: 34px;
    margin-top: 8px;
    margin-left: 18px;
    padding: 0;
    border-radius: 5px;
    color: #fff;
    border: none;
  }
  .permiss-header {
    height: 50px;
    background-color: #d7d7df;
  }
  .footer {
    margin-top: 10px;
    height: 50px;
    background-color: #d7d7df;
  }
  .content {
    h3 {
      background-color: #f1f1f1;
      padding: 15px 0 15px 27px;
    }
    table {
      width: 100%;
      tr {
        .el-checkbox-group {
          display: inline-block;
        }
        &:first-of-type {
          border-top: 1px solid #ccc;
        }
        border-bottom: 1px solid #ccc;
        td {
          text-align: left;
          &:nth-of-type(1) {
            text-align: center;
            width: 200px;
            border-right: 1px solid #ccc;
            .el-checkbox {
              line-height: 50px;
              padding-left: 25px;
            }
          }
          &:nth-of-type(2) {
            padding-left: 25px;
            .el-checkbox {
              color: #333;
              height: 50px;
              width: 400px;
              text-align: left;
              line-height: 50px;
              padding-right: 25px;
            }
          }
        }
        .el-checkbox + .el-checkbox {
          margin-left: 0;
        }

        // .el-checkbox-group {
        //     border-left: 1px solid #ccc;
        // }
      }
    }
  }
}
</style>
