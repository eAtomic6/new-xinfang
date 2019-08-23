<template>
    <div>
        <el-dialog
             title="岗位管理"
             :visible.sync="stationVisible"
             width="35%"
             :before-close="handleClose">
             <div style="margin-bottom:30px;">
                  <span class="company">公司：<el-input placeholder="请输入内容" v-model="stationData.name" :disabled="true"> </el-input></span>
                  <span class="fr" style="margin-top:-5px;"><el-button type="primary" icon="el-icon-circle-plus-outline" @click="add">新增</el-button></span>
             </div> 
                <el-table
                 :data="permissArr"
                  style="width: 100%">
                     <el-table-column
                       label="序号"
                       width="80">
                       <template slot-scope="scope">
                           {{scope.$index+1}}
                       </template>
                     </el-table-column>
                     <el-table-column
                       prop="postName"
                       label="岗位名称"
                       width="150">
                     </el-table-column>
                     <el-table-column
                       prop="address"
                       label="操作">
                        <template slot-scope="scope">
                            <span @click="editEvent(scope.row)">编辑</span>
                            <span style="margin-left:10px;">等级模板</span>
                            <span style="margin-left:10px;">业绩模板</span>
                        </template>  
                     </el-table-column>
                </el-table>
               <div style="text-align:center;margin-top:20px;">
                     <el-button type="info" @click="handleClose" class="noAdd">取消</el-button>
               </div> 
                 <!-- 新增岗位弹框 -->
                    <el-dialog
                      class="addNewPermiss"
                      title="新增岗位"
                      :visible.sync="editPermissBox1"
                      width="30%"
                      append-to-body
                    >
                      <div class="permissIpt">岗位名称:
                        <el-input maxlength="10" v-model="permissName"></el-input>
                      </div>
                      <div class="move_footer">
                        <el-button class="sureAdd" @click="surePermiss">确 定</el-button>
                        <el-button @click="editPermissBox1 = false" class="noAdd">取 消</el-button>
                      </div>
                    </el-dialog>       
                          <!-- 编辑岗位弹框 -->
                    <el-dialog
                      class="addNewPermiss"
                      title="编辑岗位"
                      :visible.sync="editNameShow"
                      width="30%"
                      append-to-body
                    >
                      <div class="permissIpt">岗位名称:
                        <el-input maxlength="10" v-model="editName"></el-input>
                      </div>
                      <div class="move_footer">
                        <el-button class="sureAdd" @click="editePermiss">确 定</el-button>
                        <el-button @click="editNameShow = false" class="noAdd">取 消</el-button>
                      </div>
                    </el-dialog>       
       </el-dialog>
    </div>
</template>

<script>
export default {
   name:"StationManage",
   props:{
       stationVisible: Boolean,
       stationData:Object
   },
   created(){},
   data(){
       return{
           permissArr:[], //列表数组
           stationBaseInfo:{}, //父组件传过来的公司信息
           editPermissBox1:false, //添加岗位名称弹框显示与隐藏
           permissName:"" ,  //岗位名称
           editNameShow:false,
           editName:"",
           editId:""
       }
   },
   methods:{
         handleClose(done) {
           this.$emit("closeStation")
         },
         add(){
             this.editPermissBox1=true;
         },
        //  获取新增岗位列表
         addPermissList(){
             this.$axios.get("/api/companyIdQueryPostList",{params:{companyId:this.stationData.companyId}}).then(res => {
                console.log(res);
                if(res.data.status==200){
                 this.permissArr=res.data.data;
                }            
             }).catch(err => {
              if (err.response.status === 403) {
                this.$router.push({ name: "403errorPage" });
                return;
               }
           });
         },

         surePermiss(){
             let qs = require("qs");
             let params={
                 companyId:this.stationData.companyId,
                 postName:this.permissName
             }
             //  新增岗位名称
            this.$axios.post("/api/addPost",qs.stringify(params)).then(res => {
               if(res.data.status==200){
                 this.addPermissList()  
                 this.editPermissBox1=false; 
                 this.permissName="";
               }        
            }).catch(err => {
                if (err.response.status === 403) {
                   this.$router.push({ name: "403errorPage" });
                    return;
                }
           });
       
         },
         editEvent(item){
           console.log(item);
           this.editNameShow=true;
           this.editName=item.postName;
           this.editId=item.id;          
         },
         editePermiss(){
            let qs = require("qs");
            let params={
                 id:this.editId,
                 postName: this.editName
            }
           //编辑岗位名称
            this.$axios.put("/api/editorialPost",qs.stringify(params)).then(res => {
               if(res.data.status==200){
                 this.addPermissList()  
                 this.editNameShow=false; 
               }        
            }).catch(err => {
                if (err.response.status === 403) {
                   this.$router.push({ name: "403errorPage" });
                    return;
                }
           });
         }
   },
   watch:{
       stationData(val){
            this.stationData=val;
            this.addPermissList();
       }
   }
}
</script>

<style lang="scss" scoped>
   /deep/ .el-dialog__body{
   }
   .company{
       .el-input{
         width: 200px;
       }
   }
 .addNewPermiss {
     margin-top: 100px;
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
