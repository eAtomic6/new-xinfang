<!-- 图片裁剪 -->
<template>
  <div>
    <div class="cut">
      <vue-cropper ref="cropper" :img="option.img" :output-size="option.size" :output-type="option.outputType" :info="true"
        :can-move="option.canMove" :can-move-box="option.canMoveBox" :fixed-box="option.fixedBox" :original="option.original"
        :auto-crop="option.autoCrop" :auto-crop-width="option.autoCropWidth" :auto-crop-height="option.autoCropHeight" :center-box="option.centerBox"
				@real-time="realTime" :high="option.high" ></vue-cropper>
    </div>
    <div class="test-button">                                          
      <label class="btn-upload" for="uploads">本地上传</label>
      <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg"
        @change="uploadImg($event, 1)">
      <button @click="rotateLeft" class="btn-other">左旋转</button>
      <button @click="rotateRight" class="btn-other">右旋转</button>
      <button @click="finish('blob')" class="btn-other">确定</button>
    </div>
</div>
</template>

<script>
import VueCropper from 'vue-cropper'
export default {
    components:{"vue-cropper": VueCropper},
  data () {
    return {
        crap: false,
        option: {
          img: '',
          size: 1,
          outputType: 'png,jpg',
          canMove: false,    // 能否拖动图片
          fixedBox: true,    // 截图框固定大小
          original: false,   //上传是否显示原始宽高
          canMoveBox: true,   // 是否拖动截图框
          autoCrop: true,    // 是否自动生成截图框
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 140,
          autoCropHeight: 140,   
          centerBox: false,   // 截图框是否限制在图片里
          high: true    // 是否生成高清图片
        },
    };
  },

  methods: {
      rotateLeft() {
          this.$refs.cropper.rotateLeft()
        },
        rotateRight() {
          this.$refs.cropper.rotateRight()
        },
        finish(type) {
          // 输出
          // var test = window.open('about:blank')
          // test.document.body.innerHTML = '图片生成中..'
         
            this.$refs.cropper.getCropBlob((data) => {
              var img = window.URL.createObjectURL(data)
            })
          
        },
        // 实时预览函数
        realTime(data) {
          this.previews = data
        },
        uploadImg(e, num) {
          //上传图片
          // this.option.img
          var file = e.target.files[0]
          if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
            alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
            return false
          }
          var reader = new FileReader()
          reader.onload = (e) => {
            let data
            if (typeof e.target.result === 'object') {
              // 把Array Buffer转化为blob 如果是base64不需要
              data = window.URL.createObjectURL(new Blob([e.target.result]))
            } else {
              data = e.target.result
            }
            if (num === 1) {
              this.option.img = data
            } else if (num === 2) {
              this.example2.img = data
            }
          }
          // 转化为base64
          // reader.readAsDataURL(file)
          // 转化为blob
          reader.readAsArrayBuffer(file)
        },
  }
}

</script>
<style lang='scss' scoped>
</style>