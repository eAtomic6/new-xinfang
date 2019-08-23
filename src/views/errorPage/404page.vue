<!-- 访问的页面不存在 -->
<template>
  <div class="errorPage-404">
      <img src="../../assets/images/errPages.png" alt="">
      <p>您访问的页面不存在</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },

  methods: {}
}

</script>
<style lang='scss' scoped>
.errorPage-404{
    background-color: #f0f0f6;
    margin: 300px auto;
    text-align: center;
    img{
        width: 60px;
        // opacity: 0.5;
    }
    p {
        margin-top: 20px;
        color: #666;
    }
}
</style>