<!-- 新增视频弹框 -->
<template>
  <div>
    <span class="el-icon-close addVideoTop_delete" @click="turnOffDialog"></span>
    <el-form :model="addVideoForm" :rules="addMovieRules" ref="ruleForm">
        <el-form-item label="公司名称：" prop="companyId" v-if="isShowCompany_form">
          <el-autocomplete
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入公司名称"
            v-model="companyName"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="视频标题：" prop="name">
          <el-input v-model="addVideoForm.name" maxlength=50></el-input>
        </el-form-item>
        <el-form-item label="宣传图片：" :prop="isUploadImg == '2' ? '' : 'cover'">
          <el-radio-group v-model="isUploadImg">
            <el-radio  :label="coverUrl">上 传</el-radio>
            <el-radio  :label="noUpload">默 认</el-radio>
          </el-radio-group>
        </el-form-item>
        <transition name="el-fade-in-linear">
        <el-form-item label="上传图片：" class="bannerPhotoBox" v-if="isUploadImg=='1'" >
              <el-upload
              action="/img/upload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-success="uploadLogoSuccess"
              :beforeUpload="bannerBeforeUp"
              >
              <i class="el-icon-plus"></i>
            </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <div class="message">
            <span>1.只能上传一张图片</span>
            <span>2.尺寸:750px*422px</span>
            <span>大小：不超过70KB</span>
          </div>
        </el-form-item>
        </transition>
        <el-form-item label="视频上传："  class="upload_video">
        <uploadImg :id="'video'" @getDataUrl="getVideoUrl" :rules="['mp4']" :more="false"><a id="selectfiles" href="javascript:void(0);" class='btn'>选择视频</a></uploadImg>
          <!-- <a id="selectfiles" href="javascript:void(0);" class='btn'>选择视频</a> -->
          <!-- <span v-show="isUploading"><span>正在上传</span><i class="el-icon-loading"></i></span>
          <span v-show="isUploaded"><span>上传成功</span><i class="el-icon-check"></i></span> -->
          <p v-show="showUpload_NameBox"><span class="startIcon"><i class="el-icon-caret-right"></i></span><span>{{uploadVideo_name}}</span>
            <i class="el-icon-error deleteUpload_icon" @click="deleteUpload" ref="deleteUpload"></i>
          </p>
        </el-form-item>
         <el-form-item label="状 态：" prop="isOnshelve">
          <el-select v-model="addVideoForm.isOnshelve" placeholder="状态">
            <el-option label="上架" :value="up"></el-option>
            <el-option label="下架" :value="down"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="move_footer">
        <el-button  @click="sureAddVideo('ruleForm')" class="sureAdd">确 定</el-button>
        <el-button @click="close" class="noAdd">取 消</el-button>
      </div>
  </div>
</template>
<script>
import {getUploadData,addVideo} from '@/api/index'
import uploadImg from "@/components/uploadImg.vue"
import {set_upload_param} from "@/api/upload";
// let uploader = null
// let videoSrcStr = ""
// let videoSize = 0
export default {
  components:{uploadImg},
  data () {
    return {
      dialogImageUrl:"",
      vedioUrl:"",
      dialogVisible:false,
      companyName: '',
      coverUrl: '1',
      noUpload: '2',
      up: true,
      down: false,
      videoSize:"",
      showUpload_NameBox: false,
      // isUploading:false,
      // isUploaded:false,
      // upload_title:"正在上传",
      isUploadImg:"",
      addVideoForm:{
      },
      addMovieRules: {
        companyId: [{ required: true, message: "请选择公司名称", trigger: "change" }],
        name: [{ required: true, message: "请输入正确的公告标题", trigger: "blur" },
        {max: 50, message: '最多不能超过50个字符', trigger: 'blur'}],
        cover: [{ required: true, message: "请选择视频宣传图片" }],
        url: [{ required: true, message: "请上传视频", trigger: "change" }],
        isOnshelve: [{ required: true, message: "请选择选择状态", trigger: "change" }]
      },
      uploadVideo_name:"",
      isShowCompany_form: false
    };
  },
  created() {
    let infoObj = JSON.parse(localStorage.getItem("myInfo"))
    if(infoObj.dep.companyId >= 0){
      this.isShowCompany_form = false
    }else{
      this.isShowCompany_form = true
    }
  },
  mounted () {
    // this.getPlupload()
    this.defaultForm()
  },
  methods: {
    // 视频上传成功获得url
    getVideoUrl(urlArr){
      this.showUpload_NameBox = true
      this.uploadVideo_name = urlArr[0].name
      this.vedioUrl = urlArr[0].path
      this.videoSize = urlArr[0].size
      console.log(urlArr);
    },
    // 初始化数据
    defaultForm(){
      this.addVideoForm = {
        companyId: '-1',
        name: '',
        cover: '',
        url: '',
        isOnshelve: '',
        size:0
      }
      this.companyName = ""
      this.isUploadImg=""
      this.$refs.deleteUpload.click()
    },
      // 点击删除当前选择的视频
    deleteUpload(){
      // debugger
      this.vedioUrl = ""
      // uploader.splice(0, 1);
      this.showUpload_NameBox = false
    },
    // 公司输入框相关函数
    querySearchAsync(queryString, cb) {
      let companyList = [];
      this.$ajax.get('/api/department/company/list',{keyword:queryString}).then(res => {
        if(res.status === 200) {
          res.data.data.forEach(item => {
            companyList.push({"value":item.name,"id":item.id});
          });
        }else {
          this.alertMessage("warning","获取公司列表失败")
        }
      });
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(companyList);
      }, 3000 * Math.random());
      console.log(companyList);
    },
    handleSelect(item) {
      this.addVideoForm.companyId = item.id;
    },
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      console.log(this.dialogImageUrl);
      this.dialogVisible = true;
    },
    uploadLogoSuccess(file) {
      console.log(file);
      this.dialogImageUrl = file.images[0].src;
      this.addVideoForm.cover = file.images[0].src;
      console.log(this.dialogImageUrl);
    },
    bannerBeforeUp(file){
      if (file.size / 1024 > 70) {
        this.alertMessage("warning", "图片大小不超过70kb");
        return false;
      }
    },
    // 确认添加视频按钮
    sureAddVideo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(!this.vedioUrl){
              this.alertMessage("warning", "请选择视频文件")
              return
            }
          // this.isUploading = true
          this.addVideoForm.url = this.vedioUrl
          this.addVideoForm.size = this.videoSize
          this.submitAdd()
          console.log(this.addVideoForm);
        } else {
          this.alertMessage("warning","表单信息不完整");
        }
      })
    },
    // 调用新增视频的接口
    submitAdd(){
     addVideo(this.addVideoForm).then(res => {
            if(res.status === 200) {
              this.alertMessage("success","添加成功");
              this.$emit('closeAddVideoBox',false);
              this.$emit('getVedioListAjax');
              // this.isUploading = false
              // this.isUploaded = false
              this.defaultForm()
            }else {
              this.alertMessage("warning","添加失败");
            }
          }).catch(err => {
            this.alertMessage("error",err);
          })
    },
    // 取消添加视频按钮
    close() {
      this.companyName = ""
      this.defaultForm()
      // this.isUploading = false
      // this.isUploaded = false
      // uploader.splice(0,1);
      this.vedioUrl = ""
      this.$emit('closeAddVideoBox',false);
    },
    // 点击×删除时
    turnOffDialog(){
      this.defaultForm()
      this.$emit('closeAddVideoBox',false);
    }
  }
}

</script>
<style lang='scss' scoped>
.addVideoTop_delete{
    color: #909399;
    font-size: 20px;
    position: absolute;
    right: 10px;
    top: 13px;
}
.upload_video{
  margin-bottom: 26px !important;
  /deep/ .el-form-item__content{
    >div{
      position: absolute;
      left: 110px;
    }
    >p{
      margin-top: 26px;

    }
  }
  /deep/ label {
    &:before{
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
    }
  }
  p{
    width: 360px;
    span{
      &:nth-of-type(2){
        overflow: hidden;
        display: inline-block;
       text-overflow: ellipsis;
       white-space: nowrap;
       width: 260px;
       height: 26px;
      }
    }
  }
  #selectfiles{
    display: inline-block;
    width: 80px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border: 1px solid #FD8F00;
    border-radius:3px;
  }
  .startIcon{
    display: inline-block;
    width: 16px;
    height: 16px;
    background-color: #FD8F00;
    border-radius: 50%;
    line-height: 16px;
    // margin-left: 10px;
    i {
      color: #fff;
    }
  }
  p{
    margin-top: -10px;
    margin-left: 100px;
    .deleteUpload_icon{
      color: #606266;
      cursor: pointer;
    }
  }
}
/deep/ .el-form{
  padding-left: 16px;
  .bannerPhotoBox{
    margin-bottom: 48px !important;
  }
  .el-form-item{
    margin-bottom: 15px;
    height: 30px;
    width: 400px;
    .el-select-dropdown__item{
      padding-left: 8px;
    }
    &:nth-of-type(5){
      margin-bottom: 30px;
    }
    &:nth-of-type(4){
      margin-top: 10px;
      .el-upload-list__item-status-label {
        width: 40px;
        height: 24px;
        top: -7px;
        right: -18px;
        .el-icon-upload-success {
          margin-top: 11px;
          margin-left: 12px;
        }
      }
    }
    label {
      width: 110px;
      height: 30px;
      color: #606266;
      text-align-last: justify;
    }
    .el-input{
      width: 250px;
    }
    .el-radio{
      width: 80px;
      line-height: 2;
      text-align-last: inherit;
    }
    .el-upload-list--picture-card{
      position: absolute;
      left: 101px;
      top: 0;
      margin-left: 10px;
      li {
      width: 129px;
      height: 67px;
      border-radius: 0;
      }
    }
    .el-upload--picture-card{
      width: 120px;
      height: 67px;
      background-color: #e4e4e4;
      line-height: 68px;
      border-radius: 0;
      border: none;
    }
    .message{
      position: absolute;
      right: 6px;
      top: 0;
      width: 136px;
      line-height: 16px;
      span{
            color: #ff5151;
        }
    }
  }
}
</style>