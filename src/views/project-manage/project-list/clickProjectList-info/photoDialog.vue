<!--  -->
<template>
  <div class="projectList_content">
     <div class="uploadVideo_content" v-show="isShowUploadBox">
        <uploadImg :id="'video'" @getDataUrl="getVideoUrl" :rules="['mp4']" :more="false"><a  href="javascript:void(0);" class='btn'><span class="icon icon-zengjia"></span>添加视频</a></uploadImg>
        <p>每个项目只支持上传一个视频 <i style="color:red">仅支持mp4格式</i></p>
     </div>
    <el-tabs type="border-card" :value="cardName" :before-leave="beforeChange" >
        <el-tab-pane v-for="(item, index) in dataList" :name="item.name" :label="item.name +'('+ item.sum +')'" :key="item.name">
         <div v-if="index !== dataLength">
            <uploadImg :id="'pic'+index"  @getDataUrl="getDataUrl(item,arguments)" :rules="['jpg','gif','png','bmp']"><el-button><span class="icon icon-zengjia"></span> 添加图片</el-button></uploadImg>                         
            <ul class="gallery-window-map" style="flex-wrap:wrap;">
                <viewer :images="item.image" style="display:block;">
                   <li v-for="(items,picIndex) in item.image" :key="items.imgId" @mouseenter="galleryActive=items.id" @mouseleave="galleryActive=''" class="cellPhono">
                         <img :src="items.imgUrl" alt="" :ref="'showImg_'+index">
                         <p v-show="galleryActive===items.id" :class="[item.cover?'cover-image-active':'']">
                             <span @click="coverImageOne(items)" v-show="!items.cover">设为封面</span>
                             <span @click="delImageOne(items)">X</span>
                             <span v-show="items.cover">当前封面</span>
                             <span  @click="clickPhoto('showImg_'+index,picIndex)" class="lookProject_img">查看</span>
                         </p>
                   </li>
                </viewer>
            </ul>
         </div>
         <div v-else>
          <!-- <a id="postfiles" href="javascript:void(0);" class='btn startUpload_video' @click="startUpload">开始上传</a> -->
             <el-button type="danger" icon="el-icon-delete" class="deleteVideo_btn" @click="deleteVideo(item)"></el-button>
             <!-- <video :src="videoUrl?videoUrl:''"  controls="controls" class="videoEle_box"><span>123</span> 您的浏览器不支持 video 标签。</video> -->
             <video :src="item.image.length ? item.image[0].url : ''" v-show="isShowVideo" controls="controls" class="videoEle_box"><span>123</span> 您的浏览器不支持 video 标签。</video>
          </div>
        </el-tab-pane>
    </el-tabs>
    <el-dialog
    title='删除视频'
    :visible.sync="deleteVideoBox"
    append-to-body
    width="25%"
    >
    <span>确定删除该视频吗</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="sureDelVideo">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>
<script>
let uploader = null;
let videoSrcStr = "";
import {
  getPhotoList,
  deleteClickPhoto,
  addProjectPhoto,
  setCoverPhoto,
  getUploadData,
  uploadVideo,
  deleteVideo
} from "@/api/index";

import uploadImg from "@/components/uploadImg.vue"
import plupload from 'plupload'
export default {
  data() {
    return {
      dataList: [],
      dialogVisible: false,
      dialogImageUrl: "",
      galleryActive: "",
      photoType: "", // 图片的类型
      cardName: "", // 当前选项卡的名字
      id: "file" + Math.random(),
      src: "",
      dataLength: 0,
      videoFile: {},
      files: [],
      isShowUploadBox: false, // 是否显示上传视频按钮
      percent: 0, // 进度条显示的百分比
      isShowVideo: false, // video显示
      isShowProgress: false, // 上传视频进度条显示
      deleteVideoBox: false, // 删除提示弹框
      deleteForm: {}, //删除视频的参数
      imgUrl:[],
      videoUrl:null,
      videoIds:null,
    };
  },
  props: ["projectId"],
  components:{
    uploadImg,
    
  },
  created() {
    this.getDataList();
  },
  mounted() {
  },
  methods: {
    // 当图片导航栏切换时执行
    beforeChange(activeName, oldActiveName) {
      if (activeName == "项目视频") {
        this.isShowUploadBox = true;
      } else {
        this.isShowUploadBox = false;
      }
      console.log(activeName);
      console.log(oldActiveName);
    },
    getDataList() {
      getPhotoList({ params: { bId: this.projectId } }).then(res => {     
        if (res.status === 200) {    
          this.dataList = res.data;
          this.cardName = res.data[0].name;      
          this.dataLength = res.data.length - 1;
          console.log(res.data[8].image[0])
          // this.videoUrl=res.data[8].image[0].url;
          // this.videoIds=res.data[8].image[0].id;
          if (res.data.length && res.data[res.data.length - 1].image.length) {
            this.isShowVideo = true;
          } else {
            this.isShowVideo = false;
          }
        }
      });
    },
    // 获取图片的url
    getDataUrl(){
      console.log(arguments[1][0]);
      console.log(arguments[0]);
      let [data,item,imgArr,paramArr]=[arguments[1][0],arguments[0],[],[]];
       data.map((item,index)=>{
         let obj={
           imgUrl:item.path
         }
         imgArr.push(obj);
         paramArr.push(item.path)
       })   
       let params = {
             kind: 1,
             imgUrl: paramArr.join(","),
             pictureType: item.pictureType,
             bId: this.projectId
      };
       addProjectPhoto(params).then(res => {
          if (res.status === 200) {
              this.getDataList();        
          } else {
            this.alertMessage("warning", res.message);
            return;
          }
      });
      
    },
    // 上传视频的url
    getVideoUrl(data){
      console.log(data)
       if (!this.isShowVideo) {     
         let params = {
             bId: this.projectId,
             url: data[0].path
         };
         uploadVideo(params).then(res => {
               this.isShowVideo = true;
               if (res.status === 200) {
                 this.getDataList();
               } else {
                 this.alertMessage("warning", res.message);
                 return;
               }
         });
       }else{
           this.alertMessage("info", "只能上传一个视频");
       }   
    },
    // 删除指定图片
    delImageOne(items) {
      deleteClickPhoto({ params: { id: items.id } }).then(res => {
        if (res.status === 200) {
          this.getDataList();
        }
      });
    },
    clickPhoto(str, picIndex) {
      this.$refs[str][picIndex].click();
    },
   // 将指定图片设为封面
    coverImageOne(items) {
      setCoverPhoto({ id: items.bId, coverPhoto: items.imgUrl }).then(res => {
        if (res.status === 200) {
          this.getDataList();
        }
      });
    },
    // 删除视频
    deleteVideo(item){
       if (!item.image.length) {
        this.alertMessage("info", "请先上传视频");
        return;
      }
      this.deleteForm = item;
      this.deleteVideoBox = true;
    },
    sureDelVideo() {
      let params = {
        bId: this.deleteForm.bId,
        videoId: this.deleteForm.image[0].id
      };
      deleteVideo(params).then(res => {
        if (res.status === 200) {
          this.getDataList();
          this.alertMessage("success", "删除成功");
          this.deleteVideoBox = false;
        } else {
          this.alertMessage("warning", res.message);
          return;
        }
      });
    },
  }
};
</script>
<style lang='scss' scoped>
.projectList_content {
  .cellPhono {
    float: left;
    position: relative;
    > p {
      top: 0;
      left: 0;
    }
  }
  /deep/ .deleteVideo_btn {
    background: #f56c6c !important;
    margin-left: 120px;
    margin-top: 1px;
  }
  .startUpload_video {
    margin-left: 84px;
    display: inline-block;
    padding: 8px 10px;
    background: #72a0d1;
    color: #ffffff;
    border-radius: 4px;
  }
  .videoEle_box {
    width: 537;
    height: 312px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    span {
      color: red;
      position: absolute;
      top: 0;
    }
  }
  .uploadVideo_content {
    position: absolute;
    top: 126px;
    left: 36px;
    a {
      display: inline-block;
      padding: 8px 10px;
      background: #72a0d1;
      color: #ffffff;
      border-radius: 4px;
      width: 109px;
      text-align: center;
    }
    > span {
      margin-left: 5px;
      i {
        color: #666;
        margin-left: 10px;
        cursor: pointer;
      }
    }
    p {
      margin-top: 10px;
      color: #666;
    }
  }
  /deep/ .el-progress {
    display: block;
    margin-top: 30px;
    width: 100%px;
    .el-progress-circle {
      width: 200px !important;
      height: 200px !important;
    }
  }
  /deep/ .el-button {
    height: 35px;
    background-color: #72a0d1;
    border: #72a0d1;
    line-height: 10px;
    color: #ffffff;
  }
  /deep/ .el-tabs__item {
    color: #333;
  }
  /deep/ .el-tabs__content {
    height: 520px;
    overflow-y: scroll;
  }
  .gallery {
    &-tab {
      display: flex;

      > li {
        padding: 10px;
        margin-right: 10px;

        &.active {
          color: #fd8f00;
          position: relative;

          &:after {
            content: "";
            width: 100%;
            border-top: 4px solid #fd8f00;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
          }
        }
      }
    }

    &-window {
      display: flex;
      margin-top: 10px;

      &-map {
        display: flex;
        margin-top: 10px;

        li {
          width: 120px;
          height: 100px;
          display: inherit;
          align-items: center;
          margin-left: 20px;
          margin-top: 15px;
          &:nth-of-type(-n + 7) {
            // margin-top: 0;
          }
          &:nth-of-type(7n-6) {
            // margin-left: 0;
          }
          img {
            width: 120px;
            height: 100px;
          }
          p {
            width: 120px;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.6);
            position: absolute;
            > span {
              color: #ffffff;
              &:nth-of-type(1) {
                cursor: pointer;
              }
              &:nth-of-type(2) {
                position: absolute;
                top: 0;
                right: 0;
                width: 30px;
                height: 30px;
                background-color: red;
                -webkit-border-radius: 50%;
                -moz-border-radius: 50%;
                border-radius: 50%;
                margin: -10px -10px 0 0;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
              }
              &:nth-of-type(3) {
                color: red;
              }
            }
            &.cover-image-active {
              > span:last-of-type {
                color: red;
              }
            }
          }
        }
      }
      &-opera {
        width: 100px;
        height: 100px;
        background-color: #e7e7e7;
        display: flex;
        justify-content: center;
        align-items: center;

        > span {
          width: 40px;
          height: 40px;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
          border-radius: 50%;
          border: 1px solid #a0a0a0;
          font-size: 24px;
          align-self: center;
          text-align: center;
          color: #b2b2b2;
        }
      }
    }
  }
  .lookProject_img {
    margin-left: 5px;
    cursor: pointer;
  }
}
</style>