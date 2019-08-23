<!-- 动态发布弹框页面 -->
<template>
  <div class="relea-main">
    <el-input
      type="textarea"
      :rows="6"
      v-model="formData.content"
      placeholder="请输入动态信息"
       maxlength="200"
      show-word-limit
      >
    </el-input>
    <div class="relea-time">
      <label>动态时间:</label>
        <el-date-picker
        v-model="formData.dynamicTime"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择日期">
      </el-date-picker>
    </div>
    <div class="relea-upload">
      <p>上传图片: <span style="color:red;margin-left:10px;">请上传尺寸长360宽270的图片</span></p>
      <ul class="upload-image-list">
      <viewer :images="imgList" style="display:inherit">
          <li v-for="(item,picIndex) in imgList" :key="item.path">
              <img :src="item" alt="" :ref="'showImg_'">
                <div class="mask">
                  <div class="ico-box">
                      <span class="font-btn" @click="clickProject_Img('showImg_',picIndex)">
                          <i class="icon icon-fangda"></i>
                      </span>
                      <span class="font-btn">
                          <i class="icon icon-shanchu" @click="deleteImg(picIndex)"></i>
                          <i class="line"></i>
                      </span>
                  </div>
                </div>
              <!-- <span @click="uploadImageOpera(item)">X</span> -->
          </li>
          <li class="upload-box"  v-if="isShowUpload">
              <uploadImg :id="'pic'"  @getDataUrl="getDataUrl" :rules="['jpg','gif','png','bmp']">
              <p class="upload-btn gallery-window-opera"><span>+</span>
              <i class="clickUpload">点击上传</i>
              </p>
              <!-- <p class="upload-btn gallery-window-opera"><span>+</span></p> -->
              </uploadImg>
              <!-- <input type="file" @change="upLoadImage('0')" v-show="false" ref="upload"> -->
          </li>
      </viewer>
      </ul>
    </div>
    <div class="move_footer">
      <el-button @click="clickRelea" class="sureAdd"  type="primary" round>发 布</el-button>
      <el-button @click="clickNoRelea" class="noAdd">取 消</el-button>
    </div>
  </div>
</template>

<script>
import uploadImg from "@/components/uploadImg.vue"
export default {
  components:{uploadImg},
  data() {
    return {
      formData:{
        content: "",
        dynamicTime:""
      },
      imgList: [],
    };
  },
  props:["projectId","releasedDynamicData","checkINT"],
  created(){
    if(this.checkINT == 1){
      this.formData = this.releasedDynamicData 
      this.$set(this.formData,"dynamicTime",this.releasedDynamicData.create_time)
      // this.$set(this.formData,"content",this.releasedDynamicData.content)
      // this.formData.id = this.releasedDynamicData.id
      if(this.releasedDynamicData.picture && this.releasedDynamicData.picture.indexOf(",") == -1){
        this.imgList.push(this.releasedDynamicData.picture)
      }else if(this.releasedDynamicData.picture && this.releasedDynamicData.picture.indexOf(",") !== -1){
        this.imgList = this.releasedDynamicData.picture.split(",")
      }
    }
  },
  methods: {
    clickProject_Img(str, picIndex) {
      this.$refs[str][picIndex].click();
    },
    getDataUrl(url){
      if(url && url.length>1){
        url.forEach(element => {
          if(this.imgList.length == 9){
            this.alertMessage("info", "最多上传9张图片",1500)
            this.isShowUpload = false
            return
          }
        this.imgList.push(element.path)
        });
      }else if(url && url.length == 1){
        this.imgList.push(url[0].path)
      }
    },
    deleteImg(index) {
      this.imgList.splice(index,1)
    },
    // 点击发布时
    clickRelea(){
      let qs = require('qs')
      if(!this.formData.content){
        this.alertMessage("info", "请输入发布信息", 2000)
        return
      }
      if(!this.formData.dynamicTime){
        this.alertMessage("info", "请输入发布时间", 2000)
        return
      }
      this.formData.picture = this.imgList.length != 0 ? this.imgList.join(",") : ""
      this.formData.bId = this.projectId
      if(this.checkINT == 1){
        this.$axios.put("/api/updateDevelopments",qs.stringify(this.formData)).then(res => {
          res = res.data
          if(res.status === 200){
          this.alertMessage("success","编辑成功",2000)
          this.$emit("closeReleaDialog",2)
          this.$emit("getNewTable")
        }else{
          this.alertMessage("warning",res.message,2000)
          return
        }
        })
      }else{
        this.$axios.post("/api/newDevelopments",qs.stringify(this.formData)).then(res => {
          res = res.data
          if(res.status === 200){
          this.alertMessage("success","发布成功",2000)
          this.$emit("closeReleaDialog",1)
        }else{
          this.alertMessage("warning",res.message,2000)
          return
        }
        })
      }
    },
    // 点击取消发布时
    clickNoRelea(){
      this.$emit("closeReleaDialog")
    }
  },
  computed: {
    isShowUpload(){
      return this.imgList.length == 9 ? false : true
    }
  },
};
</script>
<style lang='scss' scoped>
.relea-main {
  min-height: 430px;
  /deep/ .el-textarea {
    &::before {
      content: "*";
      color: #f56c6c;
      position: absolute;
      left: 10px;
    }
  }
  .relea-time{
    margin-top: 15px;
    position: relative;
    &::before {
      content: "*";
      color: #f56c6c;
      position: absolute;
      left: -9px;
      top: 12px;
    }
    label {
      color: #666;
    }
    /deep/ .el-date-editor{
      line-height: 40px;
    }
  }
  .relea-upload {
    margin-top: 15px;
    p {
      color: #666;
    }
    .upload-image-list {
      display: flex;
      flex-wrap: wrap;
      padding: 5px 0 10px 0;
      > div {
        flex-wrap: wrap;
      }
      .clickUpload {
        position: absolute;
        bottom: 10px;
        left: 32px;
        color: #b2b2b2;
      }
      li {
        width: 120px;
        height: 90px;
        margin-bottom: 10px;
        text-align: center;
        position: relative;
        margin-right: 10px;
        .mask {
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(34, 34, 34, 0.6);
          .ico-box {
            margin: 25px auto;
            font-size: 0;
            text-align: center;
            .font-btn {
              display: inline-block;
              height: 40px;
              width: 50%;
              padding: 9px 20px;
              box-sizing: border-box;
              &:last-child {
                position: relative;
                .line {
                  content: "";
                  display: inline-block;
                  position: absolute;
                  left: 0;
                  top: 10px;
                  width: 1px;
                  height: 20px;
                  background: #fff;
                }
              }
            }

            .icon-fangda,
            .icon-shanchu {
              font-size: 22px;
              color: #fff;
            }
          }
        }
        &:hover {
          .mask {
            display: block;
          }
        }
        img {
          width: 120px;
          height: 90px;
        }

        > span {
          display: inline-block;
          border: 1px solid #f2f2f2;
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
          padding: 0 10px;
          margin-top: 10px;
          line-height: 1.4;
          &:first-of-type {
            position: absolute;
            top: 0;
            right: 0;
            background-color: red;
            color: #ffffff;
            display: flex;
            width: 30px;
            height: 30px;
            align-items: center;
            justify-content: center;
            margin: -15px -15px 0 0;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
          }

          &.cover-photo {
            border-color: #fd8f00;
            color: #fd8f00;
          }
        }
      }
    }
    .gallery-window-opera {
      width: 120px;
      height: 90px;
      background-color: #e7e7e7;
      display: flex;
      justify-content: center;
      align-items: center;
      > span {
        margin-bottom: 20px;
        width: 34px;
        height: 34px;
        line-height: 29px;
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
  .move_footer{
    margin-top: 100px;
  }
}
</style>