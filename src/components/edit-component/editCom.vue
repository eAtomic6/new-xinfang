<!-- 富文本编辑测试 -->
<template>
<div>
  <quill-editor 
    v-model="content" 
    ref="myQuillEditor" 
    :options="editorOption" 
    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
    @change="onEditorChange($event)">
  </quill-editor>
  <el-upload
    class="avatar-uploader"
    action="/img/upload"
    name="img"
    :show-file-list="false"
    :on-success="uploadSuccess"
    :on-error="uploadError"
    :before-upload="beforeUpload">
  </el-upload>
</div>
</template>

<script>
import {toolbarOptions} from './editData.js'
export default {
  props:["editContent"],
  data () {
    return {
      content:"",
      editorOption:{
        modules:{
          toolbar: {
             container: toolbarOptions,  // 工具栏
             handlers: {
                 'image': function (value) {
                     if (value) {
                         document.querySelector('.avatar-uploader input').click()
                     } else {
                         this.quill.format('image', false);
                     }
                 }
             }
         }
        }
      }
    }
  },
created(){
  this.content = this.editContent
},
  methods: {
    onEditorBlur(){},
    onEditorChange(){
        this.$emit("editorChange",this.content)
    },
    onEditorFocus(){},
    uploadSuccess(res,file){
       let quill = this.$refs.myQuillEditor.quill
                // 如果上传成功
                if ( res.images.length !== 0 && res.images[0].issuccess !== 0) {
                    // 获取光标所在位置
                    let length = quill.getSelection().index;
                    // 插入图片  res.info为服务器返回的图片地址
                    quill.insertEmbed(length, 'image', res.images[0].src)
                    // 调整光标到最后
                    quill.setSelection(length + 1)
                } else {
                    this.$message.error('图片插入失败')
                }
                // loading动画消失
                this.quillUpdateImg = false
    },
    uploadError(){
      this.quillUpdateImg = false
                this.$message.error('图片插入失败')
    },
    beforeUpload(){
    }
  },
  watch:{
    editContent(val){
      this.content=val
    }
  }
}

</script>
<style lang='scss' scoped>
/deep/ .avatar-uploader{
    height: 0;
}
</style>