const CITY={
  data(){
    return{
      cityMessage: {//临时存放当前选择的城市信息
        provinceId: '',
        cityId: '',
        areaId: '',
        businessDistrictId: ''
      },
      cityDetails:[],//用于拼接otherInfo字段
    }
  },
  methods:{
    //清空城市筛选列表
    clearCityList: function () {
      this.allCity = []
      this.allArea = []
      this.allBusiness = []
    },
    //初始临时存储城市信息数据
    clearChoseCityMsg:function () {
      this.cityDetails = []
      this.cityMessage = {
        provinceId: '',
        cityId: '',
        areaId: '',
        businessDistrictId: ''
      }
    },
    //关闭编辑模态窗
    closeEditWindow:function () {
      this.EditVisible = false
      this.clearCityList()
      this.expands = []
    }
  }
}
export {
  CITY
}
