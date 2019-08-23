<!--  -->
<template>
  <div :id="getParentId" style="width:100px;">
      <div :id="getId">
          <slot></slot>
      </div>
  </div>
</template>
<script>
import plupload from 'plupload'
import { set_upload_param,get_suffix } from "@/api/upload";
// 1.0定义上传对象
let uploader = null

let result = null

let publicPath = ''

let loading = null
export default {
  data() {
    return {
       fileType:['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
       uploader:null,
       filePath:[],//表单提交传给后台的文件路径
       currentNum:0//执行上传的次数
    };
  },
  props:{
     id:{
       type:String,
       default:'selectfiles'
     },
     pId:{
       type:String,
       default:'container'
     },
     rules:{
       type:Array,
       default:function () {
         return []
       }
     },
     more:{
       type:Boolean,
       default:true
     }
   },
  components:{
    plupload
  },
  mounted() {
      let that = this
      this.uploader = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: that.getId,  //选择文件按钮
        multi_selection: that.more,
        drop_element:document.getElementById(that.getParentId),
        // flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf',
        // silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap',
        // url: 'http://oss.aliyuncs.com',
        filters: {
            mime_types:that.ruless.length>0?[{extensions:that.ruless.join(',')}]:"mp4",
            prevent_duplicates : false //不允许选取重复文件
        },
        multi_selection: that.more,  //是否多选
        init:{     
            FilesAdded: function(up, files) {
             loading = that.$loading({
                lock: true,
                text: '上传中，请稍等！',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
             });
             // 选择文件后执行
              that.up()
            },
            BeforeUpload: function(up, file) {
             // 点击上传前执行  
              let date = new Date() 
              publicPath = `${date.getTime()}${get_suffix(file.name)}`;
              set_upload_param(up,Object.assign({},result),publicPath,file.name); 
            },
            FileUploaded: function(up, file, info) {
               // 响应
              if(info.status===200||info.status===203){
                 that.currentNum++
                 that.filePath=that.filePath.concat({
                    path:`${result.host}/${result.key}${publicPath}`,
                    name:file.name,
                    size:file.size
                 })
              }
              if(that.currentNum===up.files.length){
             
                // 向父组件传递监听函数
                that.$emit("getDataUrl",that.filePath)
                that.uploader.splice(0,up.files.length)
                that.currentNum=0
                that.filePath=[];
                setTimeout(function(){
                 loading.close()
                },500)
               
              } 
            },
            Error: function(up, err) {
              //  失败
              loading.close()
              if(err.code===-601){
                that.$message({
                  message:`只允许上传${that.ruless}格式的文件`
                })
              }else {
                that.$message({
                  message:`上传失败，请稍后重试`
                })
              }
            }
        }
      });
      this.uploader.init();
  },
  methods: {
   up:function () {
      let path = 'picture/'
      let maxSize = 1024
      if(this.uploader.files.length!==0){
        let type=get_suffix(this.uploader.files[0].name)
        this.getUrl(path).then(res=>{
          result=JSON.parse(JSON.stringify(res))
          set_upload_param(this.uploader,Object.assign({},result),'');
        })
      }
   },
   getUrl:function (file) {
       return new Promise((resolve,reject)=>{
         let param=this.ruless.length>1?{dir:file}:{dir:file,type:1};
         this.$ajax.get('/api/projectUploadingVisa',param).then(res=>{
           res=res.data
           if(res.status===200){
             resolve(res.data)
           }
         })
       })
   },
  },
 computed:{
   getId:function () {
     return this.id
   },
   getParentId:function () {
     return this.pId
   },
   ruless:function(){
     return this.rules
   }
 }
};
</script>
<style lang='scss' scoped>


</style>