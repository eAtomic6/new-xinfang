<!-- 无权访问页面 -->
<template>
  <div class="errorPage-403">
      <i class="icon icon-mima"></i>
      <p>您没有权限访问该页面</p>
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
.errorPage-403{
    background-color: #f0f0f6;
    margin: 300px auto;
    text-align: center;
    i{
        font-size: 50px;
        opacity: 0.5;
    }
    p {
        margin-top: 20px;
        color: #666;
    }
}
</style>