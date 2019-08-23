<!-- 退出企业 -->
<template>
  <div v-test="color">退出企业</div>
</template>

<script>
import Vue from 'vue'
Vue.directive("test", (el, binding) => {
  console.log(el)
  console.log(binding)
  // el.style.color = binding.value
})
export default {
  data () {
    return {
      color: 'red'
    };
  },

  methods: {}
}

</script>
<style lang='scss' scoped>
</style>