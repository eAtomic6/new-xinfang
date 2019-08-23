<template>
  <!-- 该组件是通用的公司组件 -->
  <div>
    <el-tree :data="lists" :props="defaultProps" accordion @node-click="handleNodeClick"></el-tree>
  </div>
</template>

<script>
import { getDepartList,getAllCompantInfo } from "@/api/index";
export default {
  data() {
    return {
      lists: [{ name: "" }],
      defaultProps: {
        children: "child",
        label: "name"
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getDepartList().then(res => {
        if (res.status == 200) {
          this.lists = JSON.parse("[" + JSON.stringify(res.data) + "]");
          this.$emit("handleNodeClick", this.lists[0]);
        }
      });
    },
    handleNodeClick(data) {
      this.$emit("handleNodeClick", data);
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
