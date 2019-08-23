<!-- 选取位置组建 -->
<template>
  <div>
      <el-input v-model="locationIpt" placeholder="请输入地址搜索"></el-input>
      <el-input v-model="location" readonly="readonly"></el-input><el-button @click="sureAdd">确定</el-button>
      <baidu-map class="bm-view" :center="locationQuery" @ready="handler" scroll-wheel-zoom :double-click-zoom='false' :zoom="zoom" @click="getPoint">
        <!-- <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" ></bm-navigation> -->
        <bm-local-search :keyword="locationIpt" :auto-viewport="true" :location="locationQuery" zoom="12.8" style="display: none"></bm-local-search>
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
        <bm-marker :position="locationQuery1" :dragging="true" >
        </bm-marker>
  </baidu-map>
  </div>
</template>

<script>
export default {
  data () {
    return {
      location:"",
      locationQuery:{lng: 0, lat: 0},
      locationIpt:"",
      zoom:10,
      locationQuery1:{}
    };
  },
  props:["defaultLocation"],
  methods: {
    handler ({BMap, map}) {
      // console.log(BMap, map)
      // debugger
      if(this.defaultLocation){
        this.locationQuery.lng = (this.defaultLocation.split(","))[0]
        this.locationQuery.lat = (this.defaultLocation.split(","))[1]
        this.zoom = 15
        this.location = this.defaultLocation
        this.locationQuery1 = this.locationQuery
      }else{
        let obj = JSON.parse(localStorage.getItem("myInfo"))
        this.zoom = 10
        this.locationQuery = obj.cityName ? obj.cityName : "武汉"
        this.locationQuery1 = this.locationQuery
      }
    },
    getPoint(e){
      // console.log(e);
      this.location = e.point.lng + "," + e.point.lat
      this.locationQuery1={lng: e.point.lng, lat: e.point.lat}
      
      // debugger
    },
    sureAdd(){
      this.$emit("getProjectLocation",this.location)
    }
  },
  watch: {
    locationIpt(){
      if(this.locationIpt){
        this.locationQuery = "武汉"
      }else{
        this.locationQuery = this.defaultLocation
      }
    }
  },
}

</script>
<style lang='scss' scoped>
.bm-view {
  margin-top: 10px;
  width: 100%;
  height: 450px;
}
/deep/ .el-input{
  display: inline-block;
  width: 195px;
  &:nth-of-type(1){
    width: 150px;
  }
}
/deep/ .el-button{
  height: 30px;
  padding: 7px 20px;
  margin-left: 5px;
}
</style>
