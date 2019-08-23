const RULE = {
  data() {
    return {
      rules: {
        projectType: [
          {required: true, message: "请选择一个项目类型", trigger: "change"}
        ],
        projectState: [
          {required: true, message: "请选择一个项目状态", trigger: "change"}
        ],
        projectAgent:[
          {required: true, message: "请选择一个项目归属", trigger: "change"}
        ],
        name: [
          {required: true, message: "请输入项目名称", trigger: "blur"}
        ],
        developers:[
          {max: 50, message: "开发商字数不超过50", trigger: "blur"}
        ],
        investor:[{required: false, min:0,max: 50, message: "投资商字数不超过50", trigger: "blur"},
      ],
        openTime:[{max: 20, message: "开盘时间字数不超过50", trigger: "blur"}],
        provinceId: [
          {required: true, message: "请选择省份", trigger: "change"}
        ],
        cityId: [
          {required: true, message: "请选择城市", trigger: "change"}
        ],
        areaId: [{required: true, message: "请选择区域", trigger: "change"}],
        businessDistrictId: [
          {required: true, message: "请选择商区", trigger: "change"}
        ],
        buildingPrice: [
          {required: true, message: "请输入项目价格", trigger: "blur"},
        ],
        address: [
          {required: true, message: "请输入项目地址", trigger: "blur"}
        ],
        coordinate: [
          {required: true, message: "请输入拾取的地图坐标点", trigger: "blur"}
        ],
        statusSell: [
          {required: true, message: "请选择是否上架", trigger: "change"}
        ],
        buildingProperty: [
          {required: true, message: "请选择楼盘性质", trigger: "change"}
        ],
        platform: [
          {required: true, message: "请至少选择一个同步系统", trigger: "change"}
        ],
        customerType: [
          {required: true, message: "请选择项目有效类型", trigger: "change"}
        ],
        moneyDes: [
          {required: true, message: "请输入佣金", trigger: "blur"},
        ],
        proTimeAgentReport: [
          {required: true, message: "请输入报备保护期", trigger: "blur"},
        ],
        fixedPointProtectionPeriod: [
          {required: true, message: "请选择定点报备时间", trigger: "change"},
        ],
        reportingType: [
          {required: true, message: "请选择报备类型", trigger: "change"},
        ],
        reportRule: [
          {required: true, message: "请输入报备规则", trigger: "blur"}
        ],
        proTimeAgentLook: [
          {required: true, message: "请输入带看保护期", trigger: "blur"},
        ],
        proTimeDownPayment: [
          {required: true, message: "请输入下定保护期", trigger: "blur"},
        ],
        leader:[
          {required: true, message: "请输入项目负责人", trigger: "blur"},
        ],
        leaderMobile:[
          {required: true, min: 11, message: "请输入正确的电话号码", trigger: "blur"}
        ],
        buildingType:[
          {required: true, message: "请输入建筑类型", trigger: "change"},
        ],
        features:[
          {required: true, message: "请输入楼盘特色", trigger: "change"},
        ],
        infrastructure:[
          {required: true, message: "请输入基础设施", trigger: "change"},
        ],
        specificOpeningTime: [
          { required: true, message: "请选择开盘时间", trigger: "change" }
        ],
        province: [
          { required: true, message: "请选择省份", trigger: "change" }
        ],
        area: [{ required: true, message: "请选择市", trigger: "change" }],
        type: [
          { required: true, message: "请选择公司类型", trigger: "change" }
        ],
        idcard: [{ required: true, message:"请输入身份证号码", trigger: "blur"}],
        status: [
          { required: true, message: "请输入正确的手机号", trigger: "change" }
        ],
        joinTime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        captcha1: [
          { required: true, message: "请输入正确的手机号", trigger: "blur" }
        ]
      },
      rules2:{
        fixedPointProtectionPeriod: [
          {required: true, message: "请选择定点报备时间", trigger: "change"},
        ],
        proTimeAgentReport: [
          {required: true, message: "请输入报备保护期", trigger: "blur"},
        ],
      }
    }
  },
  methods: {
    submitForm(formName) {
      return new Promise((resolve,reject)=>{
        this.$refs[formName].validate((boolean, obj)=>{
          if(boolean){
            resolve()
          }else {
            reject(obj)
          }
        });
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //获取整数
    getInt:function (param,int=1) {
      this.addForm[param]=this.addForm[param].replace(/[^\.\d]/g,'')
      if(int){
        this.addForm[param]=this.addForm[param].replace('.','')
      }
    }
  }
}
export {
  RULE
}
