<!-- 数据字典 -->
<template>
  <div class="container" id="dataDictionaryCss">
    <div class="data_left">
      <el-tree
        :data="parentData"
        node-key="id"
        :props="dataRule"
        default-expand-all
        :expand-on-click-node="false"
        scope='name'>
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span class="listContent" @click="getItemList(data)">{{ node.label }}</span>
          <el-dropdown trigger="click">
          <i class="icon icon-shezhi dic-icon"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="addDictionaryClick(data)"><i class="icon icon-zengjia"></i> 新增字典</el-dropdown-item>
              <el-dropdown-item @click.native="editDictionaryClick(data)"><i class="icon icon-bianji"></i> 编辑字典</el-dropdown-item> 
              <el-dropdown-item @click.native="addDictionaryClick(data)"><i class="icon icon-zengjia"></i> 新增字典项</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        </span>
      </el-tree>
    </div>
    <div class="data_rigth">
      <el-tree
        :data="childrenData"
        node-key="id"
        :props="dataRule"
        default-expand-all
        :expand-on-click-node="false"
        scope='name'>
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span class="listContent">{{ node.label }}</span>
          <el-dropdown trigger="click">
          <i class="icon icon-shezhi dic-icon"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="addDictionaryClick(data)"><i class="icon icon-zengjia" style="margin-right: 3px"></i>新增字典项</el-dropdown-item>
              <el-dropdown-item @click.native="editDictionaryClick(data)"><i class="icon icon-bianji" style="margin-right: 3px"></i>编辑字典项</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        </span>
      </el-tree>
    </div>
    <!-- 新增字典的弹框 -->
    <div class="data_addDictionary">
       <el-dialog title="新增字典" :visible.sync="addDictionaryBox">
          <el-form :model="addDictionaryData" :rules="rules" label-width='100px' ref="ruleForm" class="demo-ruleForm">
            <el-form-item label="字典名称:" prop="value">
              <el-input v-model="addDictionaryData.value" maxlength=50 placeholder="名称最多50个字"></el-input>
            </el-form-item>
            <el-form-item label="字典类型:" :prop="dictionaryType">
            <el-select v-model="addDictionaryData.type">
              <el-option label="自增" :value="0"></el-option>
              <el-option label="按位运算" :value="1"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="拓展字段:">
              <el-input v-model="addDictionaryData.note" maxlength=255 placeholder="拓展字段最多255个字"></el-input>
            </el-form-item>
        </el-form>
        <div class="move_footer">
          <el-button  @click="sureAddDictionary('ruleForm')" class="sureAdd">确 定</el-button>
          <el-button @click="addDictionaryBox = false" class="noAdd">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="data_addDictionary">
       <el-dialog title="编辑字典" :visible.sync="editDictionaryBox">
          <!-- 删除字典弹框 -->
        <div class="delDictionary">
          <el-dialog title="提示" :visible.sync="delDictionaryBox" append-to-body class="data-delDicBox">
            <span class="el-icon-info del-icon"></span>&nbsp;&nbsp;<span style="color: #333;">你确定要删除此记录吗？</span>
          <div class="move_footer">
            <el-button  @click="sureDelDic" class="sureAdd">确 定</el-button>
            <el-button @click="delDictionaryBox = false" class="noAdd">取 消</el-button>
          </div>
          </el-dialog>
        </div>
        <el-form :model="editDictionaryData" :rules="rules" label-width='100px' ref="ruleFormEdit" class="demo-ruleForm">
          <el-form-item label="字典名称:" prop="value">
            <el-input v-model="editDictionaryData.value" maxlength=50 placeholder="名称最多50个字"></el-input>
          </el-form-item>
          <el-form-item label="字典状态:" >
          <el-select v-model="editDictionaryData.state" placeholder="--状态--">
            <el-option label="正常" :value=0></el-option>
            <el-option label="禁用" :value=1></el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="拓展字段:">
            <el-input v-model="editDictionaryData.note" maxlength=255 placeholder="拓展字段最多255个字"></el-input>
          </el-form-item>
      </el-form>
      <div class="move_footer">
        <el-button  @click="sureEditDictionary('ruleFormEdit')" class="sureAdd">确 定</el-button>
        <el-button @click="editDictionaryBox = false" class="noAdd">取 消</el-button>
      </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getParentDictionary, addDictionary, editDictionary } from "@/api";
import axios from "axios"
export default {
  data() {
    return {
      addDictionaryBox: false, // 新增字典的弹框显示
      delDictionaryBox: false, //  删除字典的弹框
      ruleForm: {}, // 编辑/新增字典的表单数据
      rules: {
        type: [{ required: true, message: "请选择字典类型", trigger: "change" }],
        value:[{ required: true, message: "请输入字典名称", trigger: "blur" }]
      },
      addDictionaryData: {},
      parentData: [],
      childrenData: [],
      dataRule: {
        value: "id",
        label: "value"
      },
      editDictionaryData:{},
      showChildId: 0,
      dictionaryType:"",
      editDictionaryBox: false
    };
  },
  created() {
    axios.get("/api/dictionary/can").then(res => {
      if(res.status === 200){
        this.getDictionaryInfo();
      }
    }).catch(err => {
       if(err.response.status === 403){
        this.$router.push({name: "403errorPage"})
        return
        }
    })
  },
  methods: {
    getDictionaryInfo() {
      getParentDictionary({ params: { parentId: 0 } }).then(res => {
        if (res.status === 200) {
          this.parentData = JSON.parse("[" + JSON.stringify(res.data) + "]");
          this.parentData[0].value = "中房网数据字典";
        }
      });
    },
    // 点击新增字典或新增字典项按钮
    addDictionaryClick(data) {
      axios.post("/api/dictionary/can").then(res => {
        if(res.status === 200){
          this.addDictionaryData = {};
          this.addDictionaryBox = true;
          this.dictionaryType="type"
          this.addDictionaryData.parentId = data.id;
        }else{this.alertMessage("warning", "无操作权限")}
      }).catch(err => {
        if(err.response.status === 403){
          this.alertMessage("warning", "无新增字典权限")
          return
          }
      })
    },
    // 点击编辑字典项或者字典项
    editDictionaryClick(data) {
      axios.put("/api/dictionary/can").then(res => {
        if(res.status === 200){
          this.dictionaryType=""
          this.showChildId = data.parentId
          this.editDictionaryData={
            value: data.value,
            id: data.id,
            key: data.key,
            note: data.note,
            parentId: data.parentId,
            readonly: data.readonly,
            sort:data.sort,
            state:data.state || 0
          }
          this.editDictionaryBox = true;
        }else{
          this.alertMessage("warning", "无操作权限")
        }
      }).catch(err => {
      if(err.response.status === 403){
        this.alertMessage("warning", "无编辑字典权限")
        return
        }
      })
    },
    // 点击左边指定列表数据的时候
    getItemList(data) {
      if (data.id === 0) {
        return;
      }
      this.showChildId = data.id;
      this.getChildInfo();
    },
    getChildInfo() {
      getParentDictionary({ params: { parentId: this.showChildId } }).then(
        res => {
          console.log(res.data);
          this.childrenData = res.data.children;
        }
      );
    },
    // 点击确定新增字典/字典项
    sureAddDictionary(ruleForm) {
       this.$refs[ruleForm].validate(valid => {
          if (valid) {
            this.addDictionaryData.sort = 0;
            addDictionary(this.addDictionaryData).then(res => {
              console.log(res);
              if (res.status === 200) {
                this.alertMessage("success", "添加成功");
                this.getDictionaryInfo();
                this.addDictionaryBox = false;
              } else {
                this.alertMessage("warning", res.message);
              }
            })
       }else{
            this.alertMessage("warning", "表单不完善")
          }
       }) 
    },
    // 确定编辑字典/字典项
    sureEditDictionary(ruleFormEdit){
       this.$refs[ruleFormEdit].validate(valid => {
          if (valid) {
               if (this.editDictionaryData.state == 1) {
                this.delDictionaryBox = true;
              } else {
                editDictionary(this.editDictionaryData).then(res => {
                  console.log(res);
                  if (res.status === 200) {
                    this.alertMessage("success", "编辑成功");
                    if(this.showChildId !== 0){
                      this.getChildInfo()
                    }
                    // 秦星星增加
                    this.getDictionaryInfo();
                    this.editDictionaryBox = false;
                  } else {
                    this.alertMessage("warning", res.message);
                  }
                }); 
            }
            }else{
                  this.alertMessage("warning", "表单不完善")
                }
            })
    },
    sureDelDic() {
      editDictionary(this.editDictionaryData).then(res => {
        console.log(res);
        if (res.status === 200) {
          this.alertMessage("success", "删除成功");
          this.delDictionaryBox = false;
          this.editDictionaryBox = false
          this.getDictionaryInfo()
        } else {
          this.alertMessage("warning", res.message);
        }
      });
    }
  }
};
</script>
<style lang='scss'>
// 弹框内部弹框样式
.dic-icon {
  font-size: 19px;
  color: #333;
}
.data-delDicBox {
  .el-dialog {
    width: 400px;
    height: 230px;
    .el-dialog__body {
      text-align: center;
      .del-icon {
        font-size: 20px;
        color: #5a9ef2;
      }
    }
  }
}
#dataDictionaryCss {
  display: flex;
  justify-content: space-between;
  .data_addDictionary,
  .data_addDictionaryList {
    .el-dialog {
      width: 514px;
      .el-form-item__error {
        padding-top: 0;
      }
      // height: 378px;
      .el-form-item {
        margin-bottom: 8px;
        .el-select {
          .el-input--suffix {
            width: 360px;
          }
        }
      }
      .move_footer {
        margin-top: 10px;
      }
    }
  }
}
</style>