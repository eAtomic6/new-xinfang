  import {
    getProjectTableRowInfo,
    getProjectStatistics,
    getTargetPlaceInfo,
    getAllProjectST,
    getAllProvince,
    getAddAreaList,
    getAddBusinessList,
    addNewProject,
    getMyCompany,
    getNewProjectList,
    projectDetail,
    getProjectState,
    getHouseSpecial
  } from '@/api/index'
  import {
    RULE
  } from '@/api/rules'
  import {
    CITY
  } from '@/api/city'
  import axios from 'axios'
import uploadImg from "@/components/uploadImg.vue"
import ImageCompressor from 'image-compressor.js';
  import deleteProject from './deleteProject.vue';
  import photoDialog from './clickProjectList-info/photoDialog.vue';
  import announceDialog from './clickProjectList-info/announceDialog.vue';
  import projectDetails from './clickProjectList-info/projectDetails.vue';
  import editCom from '@/components/edit-component/editCom.vue'
  import getLocation from '@/components/location-component/getLocation.vue'
  import projectSort from './projectSort.vue'
  import releDynamic from './dynamic-info/releaDynamic.vue'
  import {checkLong,checkLat} from '../../../vendor/methods.js'
  let activeItem = null
  const NEWHOUSETYPE = {
    area: '',
    averagePrice: '',
    bId: this.projectId,
    huoseTypenName: '',
    huxing: 1,
    imgUrl: [],
    kind: 2,
    pictureType: null,
    purpose: 1,
    renovation: 1,
    roomOrientation: 1,
    roomStructure: 1,
    sellingStatus: 1,
    totalPrice: 0,
    isNew: true
  }
  let checkAveragePrice = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('请输入均价'));
    }
    setTimeout(() => {
      if (!Number.isInteger(+value)) {
        callback(new Error('请输入数字值'));
      } else {
        let reg = /^[1-9]\d{0,5}$/
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error('请输入1到6位数字'));

        }
      }
    }, 1000);
  };
  let checkArea = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('请输入面积'));
    }
    setTimeout(() => {
      if (!Number.isInteger(+value)) {
        callback(new Error('请输入数字值'));
      } else {
        let reg = /^[1-9]\d{0,4}$|^[1-9]\d{0,4}[.]\d{1,2}$|^[0][.]\d{1,2}/
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error('最多为五位正整数加两位小数'));
        }
      }
    }, 1000);
  };
  export default {
    mixins: [RULE, CITY],
    components: {
      photoDialog,
      getLocation,
      announceDialog,
      projectDetails,
      editCom,
      deleteProject,
      uploadImg,
      projectSort,
      releDynamic
    },
    data() {
      return {
        // ===================项目位置选择数据开始========================
        getLocationDialog:false,
        defaultLocation:"",
        // getLocationDialog1:true,
        // ===================项目位置选择数据结束========================
        // ========================新的需求，项目列表动态功能开始=================================
        releasedDynamicDlg:false,   // 动态发布弹框显示隐藏
        releasedDynamicData:{},      // 点击编辑动态的数据
        checkINT:"",                  // 用来判断是新增还是编辑动态的数据
        // ========================新的需求，项目列表动态功能结束=================================
        // ========================新的需求，新增强推项目排序开始=================================
        isShowProjectSort1:false,   // 新增项目时强推项目排序显示隐藏
        isShowProjectSort2:false,   // 编辑项目时强推项目排序显示隐藏
        projectSortDiaolog:false,   // 强推项目列表弹框
        projectSortData:[],         // 强推项目排序数据
        lookSortForm:{},            // 传给排序列表的参数
        projectIdProtect:"",        // 项目id存储
        // ========================新的需求，新增强推项目排序结束=================================
        // ========================= 新的需求，加入删除项目删除客户开始=================================
        projectStateArr:[""],     // 项目条件搜索的项目状态数组
        publicSystemArr:[""],     // 项目条件搜索项目发布系统数组
        delProjectTitle:"",       // 删除项目弹框提示
        deleteProject:false,      // 删除项目的弹框显示
        // alertDelProjectMsg:"123",     // 删除项目时给的提示
        deleteProjectId:"",
        // ========================== 新的需求，加入删除项目删除客户结束==================================
        lookEditorBox:false,
        // 表单中的数据
        formInline: {
          province: "",
          city: "",
          area: "",
          business: "",
          status: "",
          type: "",
          houseName: ""
        },
        // 新增表单
        dialogAddFormVisible: false,
        addForm: {
          projectAgent: "",
          projectType: "",
          projectState: "",
          name: "",
          provinceId: "",
          cityId: "",
          areaId: "",
          businessDistrictId: "", // 商区
          buildingPrice: '',
          address: "",
          coordinate: "", // 地图坐标
          statusSell: 2, //  是否上架
          buildingProperty: "", // 楼盘性质
          platform: [], // 同步系统
          customerType: "", // 项目有效类型
          moneyDes: "", // 佣金
          proTimeAgentReport: "", //  报备保护期
          reportRule: "", //   报备规则
          proTimeAgentLook: "", //  带看保护期
          proTimeDownPayment: "", //   下定保护期
          dialogImageUrl: "",
          projectPictureList: [],
          decoration:"",
          originalPosition:"",
          otherInfo: "",
        },
        dialogImageVisible: false, // 新增 图片框
        dialogImageAllVisible: false, // 项目明细 图库里的 全部图
        dialogImageUrlAll: "",
        dialogImageTypeVisible: false, // 项目明细 图库里的 户型图
        dialogImageUrlType: "",
        keyWordCompany: [],
        // 单击表格行 展开行内数据
        rowExpand: {},
        // 单击展开行 弹出 项目编辑模态框
        EditVisible: false,
        editDialogform: {},
        rowDblclickId: 0, // 项目明细的id
        // 项目编辑 模态框 校验规则
        //  项目统计 模态框
        statisticsVisible: false,
        statisticsTable: {
          type: 1,
          employeeName: "报备人",
          time: "报备提交时间",
          state: "报备状态",
          info: "报备",
          valid: "有效报备",
          unit: "次",
          amount: "认筹金额"
        },
        statisticsCount: {},
        SearchStatisticsForm: {
          buildingId: 0,
          day: 5,
          startTime: '',
          endTime: '',
          type: 1,
          pageSize: 5,
          pageNum: 1
        },
        countSum: 0, //项目统计总条数
        customerTotals:0,
        // 项目统计 表格
        statisticsTableData: {},
        amountTJShow: false,
        stateTJShow: true,
        hadUnsubscribeShow: false,
        currentPhase: "全部",
        // 双击表格行 弹出 项目明细模态框
        detailVisible: false,
        personVisible: false,
        setPhoneRuleBox: false,
        setPhoneRuleForm: {},
        detailInfo: {},
        // 弹出内层模态框 分配人员
        allotPersonForm: {
          id: '',
          name: "",
          phone: "",
          duty: "",
          mobileShowMode: 2
        },
        allotPersonRules: {
          projectPreson: [{
            required: true,
            message: "请输入项目驻场",
            trigger: "blur"
          }]
        },
        personTableData: [],
        //确认删除模态框
        confirmDelVisible: false,
        delRowindex: 1,
        imgStore: "first",
        operateLogTableData: [],
        getTargetPlaceData: {},
        projectStatusData: [], // 所有的项目状态列表
        projectTypeData: [], // 所有的项目类型列表
        pageNum: 1, //分页器当前页
        pageSize: 5, //分页器每页的大小
        pageSizesList: [5,10, 15, 20, 30, 50],
        count: 0, //  分页器数据的总条数
        keyWordForm: {}, // 关键词搜索的表单数据对象
        allProvinceData: [], // 关键词搜索所有省份的数据
        allCityData: [], // 关键词搜索所有省份下城市的数据
        allAreaData: [], // 关键词搜索所有的片区的数据
        allBusinessData: [], // 关键词搜索所有的商圈数据
        addAllCityData: [], //新增项目中所有的城市
        addGetAreaData: {}, // 新增中用来存储城市id和区域id
        addAllAreaData: [], // 新增项目中所有区域的数据
        addAllBusinessData: [], // 新增项目中所有的商圈数据
        addProjectUrl: [], // 新增项目上传的图片地址
        projectPictureList: [], // 新增项目时的图片数组对象
        addPlatform: [], // 同步系统中选中的值
        dictionary: {},
        dictionaryList: [ 111,117, 350, 359, 123, 126, 145, 208, 135, 149, 160, 129, 437, 449, 454, 463, 468, 478],
        dataRange: [], //时间范围
        staffSearch: [],
        cityList: [], //所有城市信息
        allCity: [],
        allArea: [],
        allBusiness: [],
        cityMessage: { //临时存放当前选择的城市信息
          provinceId: '',
          cityId: '',
          areaId: '',
          businessDistrictId: ''
        },
        cityDetails: [], //用于拼接otherInfo字段
        coverPhoto: '',
        gallery: { //项目明细图片
          kind: 1,
          galleryList: []
        },
        uploadType: 1, //上传
        galleryActive: '',
        deleteRowId: 0,
        editProject_title: "",
        /** 户型图弹窗data start lwz*/
        houseTypeVisible: false,
        value: '',
        sellType: [], //展示数据 售卖状态
        face: [], //展示数据 房间朝向
        decoration: [], //展示数据 装修
        structure: [], //展示数据 房间结构
        use: [], //展示数据 用途
        homeType: [], //展示数据 户型
        houseTypeForm: [],
        houseTypeIndex: 0, //当前操作户型索引
        projectId: 0, //项目id
        houseTypeBoxTotal: [], //存储控制单个户型图显示隐藏布尔值
        editBtnType: [], //存储编辑按钮状态,false编辑
        houseTypeRules: {
          huoseTypenName: [{
            required: true,
            message: '请输入户型名称',
            trigger: ['keyup', 'blur']
          }, {
            max: 10,
            message: '长度超过10个字符',
            trigger: 'keyup'
          }],
          sellingStatus: [{
            required: true,
            message: '请选择售卖状态',
            trigger: 'change'
          }],
          roomOrientation: [{
            required: true,
            message: '请选择房间朝向',
            trigger: 'change'
          }],
          area: [{
            required: true,
            message: '请输入面积',
          }, {
            validator: checkArea,
            trigger: 'blur',
            trigger: 'keyup'

          }],
          renovation: [{
            required: true,
            message: '请选择装修类型',
            trigger: 'change'
          }],
          roomStructure: [{
            required: true,
            message: '请选择房间结构',
            trigger: 'change'
          }],
          averagePrice: [{
            required: true,
            message: '请输入均价',
          }, {
            validator: checkAveragePrice,
            trigger: 'blur',
            trigger: 'keyup'

          }],
          purpose: [{
            required: true,
            message: '请选择用途',
            trigger: 'change'
          }],
          huxing: [{
            required: true,
            message: '请选择户型',
            trigger: 'change'
          }]
        }, //户型图表单验证
        /** 户型图弹窗data end */
        xinProjectData: [], // 新项目列表数据data
        syncBox: false, // 点击同步时的弹框
        photoBox: false, // 项目图片弹框显示隐藏
        clickProjectId: "", // 点击图片时的项目id
        distributeBox: false, // 驻场分配弹框显示隐藏
        disProjectId: 0, // 分配驻场时的项目id存储
        houseImgActive: '', //当前操作户型图
        announceDiaData: {}, //点击发布时要传的对象
        projectDetail: false, //项目的详情
        proDetailId: "",
        tongjiProjectId: "", //点击统计的项目列表的存储
        project_type:[],   // 楼盘类型
        project_special:[],  // 楼盘特色
        isShowCompanyId: '',  // 当前登录人是否是公司的id
        deleteRowMessage:""
      };
    },
    created() {
      this.keyWordForm = this.defaultKeyWord()
      let infoObj = JSON.parse(localStorage.getItem("myInfo"))
      axios.get("/api/buildingList/can").then(res => {
        if (res.status === 200) {
          // let infoObj = JSON.parse(localStorage.getItem("myInfo"))
          this.getAllStatusType()
          this.getAllCity()
          this.getHouseSpecial()
          this.getNewProjectData()
          this.getAllProvinceList()
          this.isShowCompanyId = infoObj.dep.companyId
          getMyCompany().then(res => {
            if(res.status === 200){
              this.keyWordCompany = res.data
            }
          })
          this.keyWordForm.commercialInfo = infoObj.dep.companyId < 0 ? -1 : infoObj.dep.companyId
          // 页面加载获取项目类型
          getProjectState().then(res => {
            if(res.status === 200){
              this.project_type = res.data
            }
            // console.log(res);
          })
        }
      }).catch(err => {
        if (err.response.status === 403) {
          this.$router.push({
            name: "403errorPage"
          })
          return
        }
      })
    },
    methods: {
      // 获取楼盘特色
      getHouseSpecial(){
        getHouseSpecial().then(res => {
          // console.log(res);
          this.project_special = res.data
        })
      },
      //初始化表单对象
      initFormData: function () {
        let obj = {
          projectType: "",
          projectAgent:"",
          projectState: "",
          name: "",
          provinceId: "",
          cityId: "",
          areaId: "",
          businessDistrictId: "", // 商区
          buildingPrice: '',
          address: "",
          coordinate: "", // 地图坐标
          statusSell: 2, //  是否上架
          buildingProperty: "", // 楼盘性质
          platform: [], // 同步系统
          customerType: "", // 项目有效类型
          moneyDes: "", // 佣金
          proTimeAgentReport: "", //  报备保护期
          reportRule: "", //   报备规则
          proTimeAgentLook: "", //  带看保护期
          proTimeDownPayment: "", //   下定保护期
          dialogImageUrl: "",
          projectPictureList: [],
          otherInfo: "",
          moneyUnit: "",
          timeOfEnd: "",
          lowerFrame: false,
          proDetail: 0,
          specificOpeningTime:"",
          reportingType:"",
          fixedPointProtectionPeriod:""
        }
        this.cityDetails = []
        this.coverPhoto = ''
        this.addForm = Object.assign({}, this.addForm, obj)
      },
      //上传图片
      // upLoadImage(e) {
      //   let _that = this
      //   const file = e.target.files[0];

      //   if (!file) {
      //     return;
      //   }

      //   new ImageCompressor(file, {
      //     quality: .9,
      //     maxWidth: 2000,
      //     maxHeight: 2000,
      //     success(result) {
      //       // debugger
      //       const formData = new FormData();

      //       formData.append('file', result, result.name);
      //       formData.append("watermark", false)

      //       // Send the compressed image file to server with XMLHttpRequest.
      //       if (result.size > 1 * 1024 * 1024 || result.size < 3 * 1024) {
      //         _that.$message('图片大小要在3K~1M之间')
      //         return
      //       } else {
      //         _that.$ajax.post('/img/upload', formData).then(res => {
      //           res = res.data
      //           if (res.images && res.images.length > 0) {
      //             if (res.images[0].src !== 'file size is too small') {
      //               let item = {
      //                 kind: 1,
      //                 imgUrl: res.images[0].src
      //               }
      //               _that.addForm.projectPictureList.push(item)
      //             }
      //           }
      //         })
      //       }
      //     },
      //     error(e) {
      //       console.log(e.message);
      //     },
      //   });

      //   /*let uploadImg = e.target.files[0]
      //   let param = new FormData()
      //   param.append('img',uploadImg)
      //   param.append("watermark", false)
      //   //this.$axios.post(url,param).then(res=>{
      //   this.$ajax.post('/img/upload',param).then(res=>{
      //     res=res.data
      //     if(res.images&&res.images.length>0){
      //       if(res.images[0].src!=='file size is too small'){
      //         let item = {
      //           kind:1,
      //           imgUrl:res.images[0].src
      //         }
      //         if(this.uploadType===1){
      //           this.addForm.projectPictureList.push(item)
      //         }else if(this.uploadType===2) {
      //           this.upLoadImageOne(item)
      //         }
      //       }
      //     }
      //   })*/
      // },
      // 获取新项目列表数据
      getNewProjectData() {
        // debugger
        this.keyWordForm.pageNum = this.pageNum
        this.keyWordForm.pageSize = this.pageSize
        getNewProjectList({
          params: this.keyWordForm
        }).then(res => {
          // console.log(res);
          if (res.status === 200) {
            this.count = res.data.total
            this.xinProjectData = res.data.list
            this.xinProjectData.filter(val => {
              return (val.building_price = parseInt(val.building_price)) && (val.cover_photo ? "" : val.cover_photo = require("../../../assets/images/defaultImg.png"))
            })
          } else {
            this.alertMessage("warning", res.message)
          }
        })
      },
      // 初始化关键词搜索数据
      defaultKeyWord() {
        const keyWordFormDate = {
          businessDistrictId: '',
          cityId: "",
          provinceId: "",
          areaId: "",
          projectState: "",
          publishingSystem:"",
          projectType: "",
          keyword: "",
          commercialInfo: "",
          searchType:1
        }
        return keyWordFormDate
      },
      //对上传图片的操作
      uploadImageOpera: function (item, type = 'init') {
        if (type === 'init') {
          this.coverPhoto = item.imgUrl
          if (this.uploadType === 1) {
            this.$set(this.addForm, 'coverPhoto', item.imgUrl)
          } else {
            this.$set(this.editDialogform, 'coverPhoto', item.imgUrl)
          }
        } else {
          this.addForm.projectPictureList.forEach((val, index) => {
            if (val.imgUrl === item.imgUrl) {
              this.addForm.projectPictureList.splice(index, 1)
              if (this.coverPhoto === item.imgUrl && this.addForm.coverPhoto) {
                delete this.addForm.coverPhoto
                this.coverPhoto = ''
              }
            }
          })
          if (this.uploadType === 1) {
          }
          //  else {
          //   this.editDialogform.projectPictureList.forEach((val, index) => {
          //     if (val.imgUrl === item.imgUrl) {
          //       this.editDialogform.projectPictureList.splice(index, 1)
          //       if (this.coverPhoto === item.imgUrl && this.editDialogform.coverPhoto) {
          //         delete this.editDialogform.coverPhoto
          //         this.coverPhoto = ''
          //       }
          //     }
          //   })
          // }
        }
      },
      // 点击上传图片
      toUpload: function (type) {
          if (this.addForm.projectPictureList.length == 1) {
            this.alertMessage("warning", "只能上传一张项目封面")
            return
          }
          this.$refs.upload.click()
      },
      //新增项目
      addPro: function () {
        // console.log(this.addForm);
          this.submitForm('addForm').then(res => {
            let coor = this.addForm.coordinate.split(',')
            // if (this.addForm.projectState == 6 && !this.addForm.specificOpeningTime) {
            //   this.alertMessage("warning", "请选择开盘时间")
            //   return
            // }
            if (coor.length !== 2 || !coor[1]) {
              this.alertMessage("warning", "请输入正确的地图坐标")
              return
            } 
            if (this.addForm.timeOfEnd && new Date(this.addForm.timeOfEnd).getTime() < +new Date() - 86400000) {
              this.alertMessage("warning", "合同截止时间应大于当前时间",2000)
              return
            }
            let param = Object.assign({}, this.addForm)
            param.platform = this.getPlatformNum(param.platform)
            param.lowerFrame ? "" : param.lowerFrame = false
            param.otherInfo = this.cityDetails.join(',')
            // 新增若不是强推项目，则排序码传0
            if(this.addForm.projectState != 5){
              this.addForm.originalPosition=0
              this.addForm.decoration=0
            }
            // console.log(param);
            this.$ajax.postJSON('/api/building', param).then(res => {
              res = res.data
              if (res.status === 200) {
                this.dialogAddFormVisible = false
                this.alertMessage("success", "新增成功")
                this.getNewProjectData()
                this.initFormData()
              } else {
                this.alertMessage("warning", res.message)
                return
              }
            })
          }).catch(error => {
            let toastMsg = this.rules[Object.keys(error)[0]][0].message
            this.$message(toastMsg)
          })
      },
      // 关闭模态窗
      handleClose: function (done) {
        this.clearCityList()
        this.SearchStatisticsForm = {
          buildingId: 0,
          day: 5,
          startTime: '',
          endTime: '',
          type: 1,
          pageSize: 5,
          pageNum: 1
        }
        this.statisticsTable = {
            type: 1,
            employeeName: "报备人",
            time: "报备提交时间",
            state: "报备状态",
            info: "报备",
            valid: "有效报备",
            unit: "位",
            amount: "认筹金额"
          },
          this.currentPhase = "全部"
        this.stateTJShow = true
        this.amountTJShow = false
        this.hadUnsubscribeShow = false
        this.dataRange = []
        done()
      },
      //获取所有城市
      getAllCity: function () {
        let infoObj = JSON.parse(localStorage.getItem("myInfo")).company
        getAllProvince().then(res => {
          this.cityList = res.data
          // debugger
          if(infoObj){
            let arr = infoObj.areaName.split(",")
            // this.allCity = [{CityID:infoObj.area,CityName:arr[1]}]
            this.addProvinceChange(infoObj.province)
            this.addForm.provinceId = infoObj.province
            this.addForm.cityId = infoObj.area
            this.addCityChange(infoObj.area,'init')
            this.cityDetails = [arr[0],arr[1]]
          }else{
            // console.log("city",this.cityList[3])
            this.addProvinceChange(17)
            // this.allCity = this.cityList[3].CityList;
            this.addForm.provinceId = 17
            this.addForm.cityId = 1
            this.cityDetails = ['湖北省','武汉市']
            getAddAreaList({
              params: {
                cityID: 1
              }
            }).then(res => {
              this.allArea = res.data
            })
            // this.addCityChange(1,'init')
            this.cityMessage.cityId = 1
          }
          // console.log(res);
        })
      },
      // 获取选项栏数据
      getAllStatusType() {
        getAllProjectST({
          params: {
            ids: this.dictionaryList.join(',')
          }
        }).then(res => {
          if (res.status === 200) {
            this.dictionary = Object.assign({}, this.dictionary, res.data)
          }
          this.projectStatusData = res.data["117"].children
          this.projectTypeData = res.data["111"].children
          // console.log(res);
        })
      },
      // 省市区商圈改变时的方法封装
      getKeyFormData(params,string){
        getTargetPlaceInfo({params:params}).then(res => {
          if(res.status === 200){
            string == 'allCityData' ? this.allCityData = res.data : 
            string == 'allAreaData' ? this.allAreaData = res.data : this.allBusinessData = res.data
          }
        })
      },
      // 获取所有省份
      getAllProvinceList() {
        let provinceId = 0
        let cityId = 0
        let proObj = JSON.parse(localStorage.getItem("myInfo")).dep
        let that = this
        let params = {}
        getTargetPlaceInfo({
          params: that.getTargetPlaceData
        }).then(res => {
          if(res.status === 200){
            that.allProvinceData = res.data
            // 当所在人属于公司的时候，需要展示省和市
            if (proObj.isCompany) {
              provinceId = proObj.province
              cityId = proObj.area
              if (proObj.areaName) {
                that.allProvinceData.forEach(val => {
                  if (val.provinceId === provinceId) {
                    that.getTargetPlaceData.provinceId = provinceId
                    that.keyWordForm.provinceId = provinceId
                    params.provinceId = provinceId
                    getTargetPlaceInfo({params: params}).then(res => {
                      if(res.status === 200){
                        that.allCityData = res.data
                        that.allCityData.forEach(val => {
                          if(val.cityId == cityId){
                            that.keyWordForm.cityId = cityId
                          }
                        })
                        params.cityId = cityId
                        that.getTargetPlaceData.cityId = cityId
                        that.getKeyFormData(params,'allAreaData')
                        that.getNewProjectData()
                      }
                    })
                    // that.getKeyFormData(params,'allCityData')
                  }
                })
              }
            }else{
              that.getNewProjectData()
            }
          }
        })
      },
      // 编辑操作
      toEdit: function (id, title) {
        axios.put("/api/building/can").then(res => {
          if (res.status === 200) {
            getProjectTableRowInfo({
              params: {
                id: id
              }
            }).then(res => {
              if (res.status === 200) {
                // 将项目id存储
                this.projectIdProtect = id
                this.isShowProjectSort2 = false
                // 调获取排序码接口
                this.lookSortKey(id)
                this.editDialogform = Object.assign({}, res.data)
                activeItem = res.data
                this.isShowProjectSort2 = this.editDialogform.projectState == 5 ? true : false
                this.editDialogform.originalPosition = this.editDialogform.decoration
                console.log(this.editDialogform.decoration);
                this.$set(this.editDialogform, 'coordinate', `${res.data.longitude},${res.data.latitude}`) //跟进返回的经纬度创建地图坐标字段
                this.detailVisible = false
                this.EditVisible = true
                this.$set(this.editDialogform, 'features',this.bitOpera1(this.project_special, activeItem.features))
                // this.editDialogform.features = this.bitOpera1(this.dictionary['149'].children, activeItem.features)
                this.$set(this.editDialogform, 'infrastructure', this.bitOpera1(this.dictionary['160'].children, activeItem.infrastructure))
                this.$set(this.editDialogform, 'platform', this.bitOpera1(this.dictionary['145'].children, activeItem.platform))
                this.$set(this.editDialogform, 'buildingType', this.bitOpera1(this.dictionary['135'].children, activeItem.buildingType))
                //请求城市的所有接口
                this.addProvinceChange(this.editDialogform.provinceId, 'init')
                this.addCityChange(this.editDialogform.cityId, 'init')
                this.addAreaChange(this.editDialogform.areaId, 'init')
                this.businessChange(this.editDialogform.businessDistrictId, 'init')
              }
            })
            this.editProject_title = title
          }
        }).catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无操作权限")
            return
          }
        })
      },
      onExport() {
        //导出按钮
      },
      //或位运算
      getPlatformNum: function (arr) {
        // debugger
        let leng = arr.length
        if (leng === 1) {
          return arr[0]
        }
        if (leng === 2) {
          return arr[0] | arr[1]
        } else {
          let val = arr[0] | arr[1]
          arr = arr.slice(2)
          arr.unshift(val)
          return this.getPlatformNum(arr)
        }
      },
      //与位运算
      bitOpera1: function (arr, num) {
        // debugger
        let newArr = []
        let bit = "";
        let str = ""
        // debugger
        arr.length ?(str =  arr[0].hasOwnProperty("key") ? "key" : "codeBinary") : ""
        arr.forEach(item => {
           bit = item[str] & num
          if (item[str] === bit) {
            newArr.push(item[str])
          }
        })
        return newArr
      },
      // 提交 项目编辑 模态框的所有tab切换表单
      submitEditForm(int) {
        // debugger
        let coor = this.editDialogform.coordinate.split(',')

        if (coor.length !== 2 || !coor[1]) {
          this.alertMessage("warning", "请输入正确的地图坐标")
        } else {
          this.submitForm("editForm").then(res => {
            this.submitForm('protectionRules').then(res => {
              // if (this.editDialogform.projectState == 6 && !this.editDialogform.specificOpeningTime) {
              //   this.alertMessage("warning", "请选择开盘时间")
              //   return
              // }  
              if(this.editDialogform.timeOfEnd && new Date(this.editDialogform.timeOfEnd).getTime() < +new Date() - 86400000){
                this.alertMessage("warning", "合同截止时间应大于当前时间",2000)
                return
              }
              let param = Object.assign({}, this.editDialogform)
              param.platform = this.getPlatformNum(param.platform)
              param.features = this.getPlatformNum(param.features)
              param.infrastructure = this.getPlatformNum(param.infrastructure)
              param.buildingType = this.getPlatformNum(param.buildingType)
              param.otherInfo = this.cityDetails.join(',')
              if(param.projectState != 5){
                param.decoration = 0
                param.originalPosition = 0
              }
              // console.log(!int && this.editDialogform.projectState == "10");
              // debugger
              if(!int && this.editDialogform.projectState == "10"){
                  this.deleteProject = true
                  this.deleteProjectId = this.editDialogform.id
                  this.delProjectTitle = "删除项目【"+this.editDialogform.name+"】"
              }else{
                this.$ajax.putJSON('/api/building', param).then(res => {
                  res = res.data
                  if (res.status === 200) { 
                    this.editDialogform.projectState == "10" ?         
                    this.alertMessage("success", "删除成功") : this.alertMessage("success", "编辑成功")
                    this.lookEditorBox = false
                    this.deleteProject = false
                    this.EditVisible = false
                    this.getNewProjectData()
                  } else {
                    // this.editDialogform.projectState == "10" ?
                    // this.alertDelProjectMsg = res.message :
                    this.alertMessage("warning", res.message)
                    return
                  }
                })
              }
            }).catch(error => {
              let toastMsg = this.rules[Object.keys(error)[0]][0].message
              this.$message(toastMsg)
            })
          }).catch(error => {
            let toastMsg = this.rules[Object.keys(error)[0]][0].message
            this.$message(toastMsg)
          })
        }
      },
      // 项目统计 模态框
      getProjectStatistics(type, projectId) {
        axios.get("/api/buildingStatistics/can").then(res => {
          if(res.status === 200){

            this.tongjiProjectId = projectId
            this.SearchStatisticsForm.buildingId = projectId
            let param = {
              buildingId: projectId,
              day: 5,
              endTime: '',
              startTime: '',
              type: 1,
              pageSize: 5,
              pageNum: 1
            }
            if (type === 'info') {
              this.SearchStatisticsForm.startTime = this.dataRange ? this.dataRange[0] : ''
              this.SearchStatisticsForm.endTime = this.dataRange ? this.dataRange[1] : ''
            }
            this.statisticsVisible = true;
            getProjectStatistics({
              params: type === 'init' ? param : this.SearchStatisticsForm
            }).then(res => {
              // debugger
              if (res.status === 200) {
                this.statisticsTableData = res.data
                this.countSum = res.data.buildingReportSum
                this.customerTotals = res.data.total
              }
              let type = this.SearchStatisticsForm.type
              this.statisticsTableData.list.forEach(value => {
                if (type === 1 || type === 2) {
                  value.time = value.time ? value.time.slice(0, value.time.lastIndexOf(':')) : ""
                  value.money = value.money ? value.money + "元" : ""
                } else if (type === 5 || type === 6) {
                  value.time = value.time ? value.time.slice(0, value.time.lastIndexOf(' ')) : ""
                  value.money = value.money ? value.money + "万元" : ""
                } else {
                  value.time = value.time ? value.time.slice(0, value.time.lastIndexOf(' ')) : ""
                  value.money = value.money ? value.money + "元" : ""
                }
              })
              switch (type) {
                case 1:
                  this.statisticsCount = {
                    valid: this.statisticsTableData.buildingValidReportSum,
                    countSum: this.statisticsTableData.buildingReportSum
                  }
                  break
                case 2:
                  this.statisticsCount = {
                    valid: this.statisticsTableData.buildingValidLookSum,
                    countSum: this.statisticsTableData.buildingLookSum
                  }
                  break
                case 3:
                  this.statisticsCount = {
                    valid: this.statisticsTableData.buildingPrcMoneySum,
                    countSum: this.statisticsTableData.buildingPrcSum
                  }
                  break
                case 4:
                  this.statisticsCount = {
                    valid: this.statisticsTableData.buildingSubscribeMoneySum,
                    countSum: this.statisticsTableData.buildingSubscribeSum
                  }
                  break
                case 5:
                  this.statisticsCount = {
                    valid: this.statisticsTableData.buildingInitialMoneySum,
                    countSum: this.statisticsTableData.buildingInitialSum
                  }
                  break
                case 6:
                  this.statisticsCount = {
                    valid: this.statisticsTableData.buildingNetSignMoneySum,
                    countSum: this.statisticsTableData.buildingNetSignSum
                  }
                  break
                case 7:
                  this.statisticsCount = {
                    valid: this.statisticsTableData.unsubscribePrcMoneySum,
                    return: this.statisticsTableData.hadUnsubscribePrcSum,
                    countSum: this.statisticsTableData.unsubscribePrcSum
                  }
                  break
                case 8:
                  this.statisticsCount = {
                    valid: this.statisticsTableData.unsubscribeMoneySum,
                    return: this.statisticsTableData.hadUnsubscribeSum,
                    countSum: this.statisticsTableData.unsubscribeSum
                  }
                  break
              }
            })
          }
        }).catch(err => {
          if(err.response.status === 403){
            this.alertMessage("warning","无操作权限")
            return
          }
        })
      },
      // 项目统计模态框中的 搜索 按钮
      searchStatistics() {
        this.SearchStatisticsForm.pageNum = 1
        this.SearchStatisticsForm.pageSize = 5
        let TJData = [{
            type: 1,
            employeeName: "报备人",
            time: "报备提交时间",
            state: "报备状态",
            info: "报备",
            valid: "有效报备",
            unit: "位"
          },
          {
            type: 2,
            employeeName: "带看人",
            time: "带看提交时间",
            state: "带看状态",
            info: "带看",
            valid: "有效带看",
            unit: "位"
          },
          {
            type: 3,
            employeeName: "（认筹）成交人",
            time: "认筹时间",
            state: "认筹金额",
            info: "认筹",
            valid: "认筹金额共",
            unit: "元",
            amount: "认筹金额"
          },
          {
            type: 4,
            employeeName: "（认购）成交人",
            time: "认购时间",
            state: "认筹金额",
            info: "认购",
            valid: "认购金额共",
            unit: "元",
            amount: "认购金额"
          },
          {
            type: 5,
            employeeName: "（草签）成交人",
            time: "草签时间",
            state: "房屋总价",
            info: "草签",
            valid: "房屋总价共",
            unit: "万元",
            amount: "房屋总价"
          },
          {
            type: 6,
            employeeName: "（网签）成交人",
            time: "网签时间",
            state: "房屋总价",
            info: "网签",
            valid: "房屋总价共",
            unit: "万元",
            amount: "房屋总价"
          },
          {
            type: 7,
            employeeName: "退筹申请人",
            time: "退筹时间",
            amount: "退筹金额",
            state: "退筹状态",
            info: "退筹",
            valid: "退筹金额共",
            unit: "元",
            msg: "已退筹"
          },
          {
            type: 8,
            employeeName: "退房申请人",
            time: "退房时间",
            amount: "退款金额",
            state: "退房状态",
            info: "退房",
            valid: "退款金额共",
            unit: "元",
            msg: "已退房"
          },
        ]
        if (this.SearchStatisticsForm.type === 1 || this.SearchStatisticsForm.type === 2) {
          this.amountTJShow = false
        } else {
          this.amountTJShow = true
        }
        if (
          this.SearchStatisticsForm.type === 1 ||
          this.SearchStatisticsForm.type === 2 ||
          this.SearchStatisticsForm.type === 7 ||
          this.SearchStatisticsForm.type === 8) {
          this.stateTJShow = true
        } else {
          this.stateTJShow = false
        }
        if (this.SearchStatisticsForm.type === 7 || this.SearchStatisticsForm.type === 8) {
          this.hadUnsubscribeShow = true
        } else {
          this.hadUnsubscribeShow = false
        }
        TJData.forEach(value => {
          if (this.SearchStatisticsForm.type === value.type) {
            this.statisticsTable = value
          }
        })
        switch (this.SearchStatisticsForm.day) {
          case 1:
            this.currentPhase = "当天"
            break
          case 2:
            this.currentPhase = "七天内"
            break
          case 3:
            this.currentPhase = "本月"
            break
          case 4:
            this.currentPhase = "半年"
            break
          case 5:
            this.currentPhase = "全部"
            break
        }
        this.getProjectStatistics('info', this.tongjiProjectId)
      },
      // 获取项目明细人员列表
      getStaff: function (id) {
        let param = {
          id: id
        }
        this.$ajax.get('/api/itemMemberByBuildingId', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.personTableData = res.data
          }
        })
      },
      // 明细图片
      getProImages: function (type = 1) {
        let param = {
          id: this.rowExpand.id,
          kind: type
        }
        this.gallery.kind = type
        this.$ajax.get('/api/buildingImageByBuildingId', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.gallery.galleryList = res.data
          }
        })
      },
      // 获取操作记录
      getOperationRecord: function (id) {
        let param = {
          id: id
        }
        this.$ajax.get('/api/projectOperationRecord', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.operateLogTableData = res.data
          }
        })
      },
      // === 新增图片   ===
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePicture(file) {
        this.dialogImageUrl = file.url;
        this.dialogImageVisible = true;
      },
      handlePictureAll(file) {
        this.dialogImageUrl = file.url;
        this.dialogImageVisible = true;
      },
      handlePictureType(file) {
        this.dialogImageUrl = file.url;
        this.dialogImageVisible = true;
      },
      //提交分配人员内层模态框
      submitAllotPersonForm() {
        if (!this.allotPersonForm.name) {
          this.$message('请选择项目驻场')
        } else {
          let param = {
            bId: this.disProjectId,
            eId: this.allotPersonForm.id,
            mobileShowMode: this.allotPersonForm.mobileShowMode
          }
          this.$ajax.postJSON('/api/itemMember', param).then(res => {
            res = res.data
            if (res.status === 200) {
              this.personVisible = false
              this.getStaff(this.disProjectId)
              let obj = {
                id: '',
                name: "",
                phone: "",
                duty: ""
              }
              this.allotPersonForm = Object.assign({}, this.allotPersonForm, obj)
              this.alertMessage("success", "分配成功")
            } else {
              this.$message(res.message)
            }
          })
        }
      },
      //取消分配人员
      cancelAllotPersonForm() {
        this.allotPersonForm.name = ""
        this.allotPersonForm.phone = ""
        this.allotPersonForm.duty = ""
        this.personVisible = false
        this.staffSearch = []
      },
      //点击分配人员
      clickPutPerson() {
        axios.post("/api/itemMember/can").then(res => {
          if(res.status === 200){
            this.allotPersonForm.name = ""
            this.staffSearch = []
            this.personVisible = true
          }
        }).catch(err => {
          if(err.response.status === 403){
            this.alertMessage("warning", "无操作权限")
            return
          }
        })
      },
      // 获取人员列表
      searchStaff: function () {
        let param = {
          keyword: this.allotPersonForm.name
        }
        this.$ajax.get('/api/getProjectResident', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.staffSearch = res.data
          }
        })
      },
      // 设置项目人员
      setProjectPerson: function (item) {
        this.allotPersonForm.name = item.e_name
        this.allotPersonForm.id = item.e_id
        this.allotPersonForm.phone = item.mobile
        this.allotPersonForm.duty = item.title
        this.staffSearch = []
      },
      // 分配人员操作
      addStaff: function () {

      },
      // 项目统计时间改变时
      projectTimeChange() {
        this.dataRange = []
      },
      // 项目统计自定义时间改变时
      projectTimesChange() {
        this.SearchStatisticsForm.day = 5
      },
      // 传递删除行的index
      confirmDelRowindex(row) {
        // this.deleteRowMessage = ""
        // let param = {
        //   id: row.id
        // }
        // this.$ajax.delete('/api/itemMember', param).then(res => {
        //   res = res.data
        //   if(res.status === 410){
        //     this.deleteRowMessage = res.message
        //   }
        // })
        this.deleteRowId = row.id
        this.confirmDelVisible = true
      },
      setPhoneRule(row) {
        this.setPhoneRuleBox = true
        this.setPhoneRuleForm = row
      },
      submitPhoneRule() {
        let params = {}
        params.id = this.setPhoneRuleForm.id
        params.mobileShowMode = this.setPhoneRuleForm.mobile_show_mode
        axios.put("/api/itemMember", params).then(res => {
          if (res.status === 200) {
            if (res.data.status === 200) {
              this.setPhoneRuleBox = false
              this.alertMessage("success", "设置成功")
              this.getStaff(this.disProjectId)
            } else {
              this.alertMessage("warning", res.data.message)
            }
          } else {
            this.alertMessage("success", "设置失败")
          }
        })
      },
      // 删除人员分配里的表格行
      confirmDeleteRow(index, rows) {
        let param = {
          id: this.deleteRowId
        }
        this.$ajax.delete('/api/itemMember', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.alertMessage("success", "删除成功")
            this.getStaff(this.disProjectId)
          }else if(res.status === 410){
            this.$confirm(res.message+', 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              param.deleteTag = 1
              this.$ajax.delete('/api/itemMember', param).then(res => {
                res = res.data
                if(res.status === 200){
                  this.alertMessage("success", "删除成功")
                  this.getStaff(this.disProjectId)
                }else{
                 this.alertMessage("warning", res.message)
                 return
                }
              })
            })
          }else{
            this.alertMessage("warning", res.message)
            return
          }
          this.confirmDelVisible = false;
        })
        // rows.splice(index, 1); // 删除行
      },
      // tab 图库中 全部与户型图 切换
      imgStoreHandleClick(tab, event) {
        console.log(tab, event);
      },
      // 分页器点击每页显示条数变化时
      handleSizeChange(val) {
        this.pageSize = val
        this.getNewProjectData()
      },
      // 分页器点击页面跳转时
      handleCurrentChange(val) {
        this.pageNum = val
        this.getNewProjectData()
      },
      // 项目统计分页器点击每页显示条数变化时
      handleSizeChangeTJ(val) {
        this.SearchStatisticsForm.pageSize = val
        this.getProjectStatistics('info', this.tongjiProjectId)
      },
      // 项目统计分页器点击页面跳转时
      handleCurrentChangeTJ(val) {
        this.SearchStatisticsForm.pageNum = val
        this.getProjectStatistics('info', this.tongjiProjectId)
      },
      // 关键词搜索选择的省份发生改变时
      provinceChange(val) {
        delete this.getTargetPlaceData.cityId
        this.getTargetPlaceData.provinceId = val
        this.keyWordForm.cityId = ""
        this.keyWordForm.areaId = ""
        this.keyWordForm.businessDistrictId = ""
        this.allAreaData = []
        this.allBusinessData = []
        this.getKeyFormData(this.getTargetPlaceData, 'allCityData')
      },
      // 关键词搜索选择城市发生改变时
      cityChange(val) {
        delete this.getTargetPlaceData.areaId
        this.getTargetPlaceData.cityId = val
        this.keyWordForm.areaId = ""
        this.keyWordForm.businessDistrictId = ""
        this.allBusinessData = []
        this.getKeyFormData(this.getTargetPlaceData, 'allAreaData')
      },
      // 关键词搜索选择片区改变的时候
      areaChange(val) {
        this.keyWordForm.businessDistrictId = ""
        delete this.getTargetPlaceData.businessDistrictId
        this.getTargetPlaceData.areaId = val
        this.getKeyFormData(this.getTargetPlaceData, 'allBusinessData')
      },
      businessDisChange() {
      },
      // 根据输入的关键词查询按钮
      onSearch() {
        this.pageNum = 1
        this.getNewProjectData()
        console.log(this.keyWordForm);
      },
      onReset() {
        let infoObj = JSON.parse(localStorage.getItem("myInfo")) 
        // 重置查询条件按钮
        this.pageNum = 1
        this.pageSize = 5
        this.keyWordForm = this.defaultKeyWord()
        this.keyWordForm.commercialInfo = infoObj.dep.companyId < 0 ? -500 : infoObj.dep.companyId
        this.projectStateArr = [""]
        this.publicSystemArr=[""]
        this.getNewProjectData()
      },
      addProjectBtn() {
        axios.post("/api/building/can").then(res => {
          if (res.status === 200) {
            this.isShowProjectSort1 = false
            this.dialogAddFormVisible = true
            this.defaultLocation = ""
            this.initFormData()
            this.getAllCity()
            this.lookSortKey("")
          }
        }).catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无操作权限")
            return
          }
        })

      },
      // 省份选择发生改变时，获取城市
      addProvinceChange(val, type = 'edit') {
        // console.log(val);
        if (type === 'edit') {
          //重置下级
          this.addForm.cityId = ''
          this.addForm.areaId = ''
          this.addForm.businessDistrictId = ''
          this.editDialogform.cityId = ''
          this.editDialogform.areaId = ''
          this.editDialogform.businessDistrictId = ''
          this.allArea = []
          this.allBusiness = []
          this.cityDetails = []
        }
        console.log(this.cityList);
        if(this.cityList && this.cityList.length){
          this.cityList.forEach(value => {
            if (val == value.ID) {
              this.allCity = value.CityList
              this.cityDetails.splice(0, 1, value.ProvinceName)
              return
            }
          })
        }
      },
      // 城市选择发生改变时，获取城市区域
      addCityChange(val, type = 'edit') {
        this.cityMessage.cityId = val
        getAddAreaList({
          params: {
            cityID: val
          }
        }).then(res => {
          this.allArea = res.data
        })
        // debugger
        if (type === 'edit') {
          //重置下级
          this.addForm.areaId = ''
          this.addForm.businessDistrictId = ''
          this.editDialogform.areaId = ''
          this.editDialogform.businessDistrictId = ''
          this.allBusiness = []
          this.cityDetails.splice(1, 3)

          this.allCity.forEach(value => {
            if (val == value.CityID) {
              this.cityDetails.splice(1, 1, value.CityName)
              return
            }
          })
        } else {
          // console.log(this,);
          this.cityDetails.splice(1, 1, this.editDialogform.city)
        }
      },
      // 城市区域选择改变时，获取商圈
      addAreaChange(val, type = 'edit') {
        this.cityMessage.areaId = val
        let param = {
          cityID: this.cityMessage.cityId,
          areaID: this.cityMessage.areaId
        }
        getAddBusinessList({
          params: param
        }).then(res => {
          this.allBusiness = res.data
        })
        // debugger
        if (type === 'edit') {
          //重置下级
          this.addForm.businessDistrictId = ''
          this.editDialogform.businessDistrictId = ''
          this.cityDetails.splice(2, 2)
          this.allArea.forEach(value => {
            if (val == value.ID) {
              this.cityDetails.splice(2, 1, value.AreaName)
              return
            }
          })
        } else {
          this.cityDetails.splice(2, 1, this.editDialogform.area)
        }
      },
      businessChange(val, type = 'edit') {
        // debugger
        if (type !== 'edit') {
          this.cityDetails.splice(3, 1, this.editDialogform.businessDistrict)
        } else {
          this.allBusiness.forEach(value => {
            if (val == value.ID) {
              this.cityDetails.splice(3, 1, value.ShangQuanName)
              return
            }
          })
        }
      },
      uploadPhotoSuccess(file) {
        console.log(file);
        this.addProjectUrl.push(file.images[0].src)
        console.log(this.addProjectUrl);
      },
      handlePictureCardPreview(file) {
      },
      removeAddPhone(file) {
        this.addProjectUrl.forEach((value, index) => {
          if (value == file.response.images[0].src) {
            this.addProjectUrl.splice(index, 1)
          }
        })
      },
      spotFormatter: function (val) {
        if (!val) {
          return '-'
        } else {
          let tip = val.split(',')
          let str = ''
          for (let i = 0; i < tip.length; i++) {
            str += `<span>${tip[i]}</span>`
          }
          return str
        }
      },
      /******************* 户型图弹窗methods start lwz****************************/
      /** 
       * 打开户型图弹窗
       * @id 户型id
       */
      openHouseType(id) {
        this.houseTypeVisible = true

        //静态数据展示赋值
        this.sellType = this.dictionary[478]
        console.log(this.sellType)
        this.face = this.dictionary[437]
        this.decoration = this.dictionary[449]
        this.structure = this.dictionary[463]
        this.use = this.dictionary[468]
        this.homeType = this.dictionary[454]

        this.projectId = id
        this.getProjectHouseAjax()
      },
      /**
       * 获取项目默认数据
       * @id 项目id
       */
      getProjectHouseAjax() {
        let param = {
          bId: this.projectId
          //   bId: 2070
        }
        this.$ajax.get('/api/projectHouseTypePlan', param).then(res => {
          res = res.data
          if (res.status === 200) {
            if (res.data) {
              this.houseTypeForm = res.data
              res.data.forEach(item => {
                this.houseTypeBoxTotal.push(true)
                this.editBtnType.push(true)

              })
            } else {
              let newhousetype = JSON.parse(JSON.stringify(NEWHOUSETYPE))
              newhousetype.bId = this.projectId
              this.houseTypeForm = []
              this.houseTypeForm.push(newhousetype)
              this.houseTypeBoxTotal.push(true)
            }
          }
        })
      },
      /** 
       * 模拟点击上传图片按钮
       * @index 当前操作的户型box的索引
       */
      // houseUpload(index) {
      //   this.$refs.houseTypeLoad[index].click()
      // },
      /** 
       * 上传图片到服务器
       * @index 当前操作的户型box的索引
       */
      // upLoadHouse(e, index) {
      //   let _that = this
      //   const file = e.target.files[0]
      //   if (!file) {
      //     return
      //   }
      //   new ImageCompressor(file, {
      //     quality: 0.9,
      //     maxWidth: 2000,
      //     maxHeight: 2000,
      //     success(result) {
      //       // debugger
      //       const formData = new FormData()

      //       formData.append('file', result, result.name)
      //       formData.append('watermark', false)

      //       // Send the compressed image file to server with XMLHttpRequest.
      //       if (result.size > 1 * 1024 * 1024 || result.size < 3 * 1024) {
      //         _that.$message('图片大小要在3K~1M之间')
      //         return
      //       } else {
      //         _that.$ajax.post('/img/upload', formData).then(res => {
      //           res = res.data
      //           if (res.images && res.images.length > 0) {
      //             if (res.images[0].src !== 'file size is too small') {

      //               let item = res.images[0].src
      //               console.log(item)

      //               _that.houseTypeForm[index].imgUrl.unshift(item)

      //             }
      //           }
      //         })
      //       }
      //     },
      //     error(e) {
      //       console.log(e.message)
      //     }
      //   })
      // },
      /** 
       * 删除指定图片，操作表单数据
       * @index 当前操作的户型box的索引
       * @picIndex 当前操作的图片索引
       */
      delHouseImage(index, picIndex) {
        this.houseTypeForm[index].imgUrl.splice(picIndex, 1)
      },

      /**
       * 添加项目图片（新增）
       * 
       */
      addHouseType() {
        let newhousetype = JSON.parse(JSON.stringify(NEWHOUSETYPE))
        newhousetype.bId = this.projectId
        this.houseTypeForm.push(newhousetype)
        this.houseTypeBoxTotal.push(true)
        let dialogBody = this.$refs.houseTypeDialog.$el.getElementsByClassName('el-dialog__body')[0]
        setTimeout(() => {
          dialogBody.scrollTop = dialogBody.scrollHeight

        }, 100);

      },
      /**
       * 提交项目图片  新增或编辑户型图盒子
       * @index 当前操作的户型box的索引
       */
      saveHouseType(index) {

        //数据验证
        this.$refs.houseTypeDom[index].validate((valid) => {
          if (valid) {
            let param = JSON.parse(JSON.stringify(this.houseTypeForm[index]))
            let url = param.imgUrl.join(',')
            console.log(url)
            if (!url) {
              this.alertMessage("warning", "请上传户型图")
              return
            }
            param.imgUrl = url
            param.totalPrice = Math.round(param.averagePrice * param.area / 10000)
            if (param.isNew) {
              //新增户型图盒子
              this.$ajax.post('/api/buildingImage', param).then(res => {
                console.log(res)
                res = res.data
                if (res.status === 200) {
                  delete param.isNew
                  delete this.houseTypeForm[index].isNew
                  this.houseTypeBoxTotal = []
                  this.alertMessage("success", "恭喜您，操作成功")
                  this.getNewProjectData()
                  this.getProjectHouseAjax()

                  // this.houseTypeForm = res.data
                }else{
                  this.alertMessage("warning",res.message,2000)
                  return
                }
              })
            } else {
              if (this.editBtnType[index]) {
                this.$set(this.editBtnType, index, false)
                return
              }
              //编辑户型图盒子

              this.$ajax.putJSON('/api/editLayout', param).then(res => {
                res = res.data
                console.log('====================456')
                console.log(res)
                if (res.status === 200) {
                  this.houseTypeBoxTotal = []
                  this.editBtnType = []
                  this.alertMessage("success", "恭喜您，操作成功")
                  this.getNewProjectData()
                  this.getProjectHouseAjax()

                  // this.houseTypeForm = res.data
                }else{
                  this.alertMessage("warning",res.message,2000)
                  return
                }
              })
            }
          } else {
            this.alertMessage("warning", "请正确填写表单")
            return false;
          }
        });


      },
      /**
       * 删除户型
       * @index 当前操作的户型box的索引
       */
      deleteHouseType(index) {
        this.$confirm('您确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: this.houseTypeForm[index].id
          }
          this.houseTypeForm.splice(index, 1)
          this.$ajax.delete('/api/buildingImage', param).then(res => {
            res = res.data
            console.log('====================456')
            console.log(res)
            if (res.status === 200) {
              this.alertMessage("success", "户型已删除")
              this.getNewProjectData()
              // this.houseTypeForm = res.data
            }else{
              this.alertMessage("warning",res.message,2000)
              return
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      /** 
       * 点击户型图盒子标题
       */
      clickTitle(index) {
        //   this.houseTypeBoxTotal[index] = !this.houseTypeBoxTotal[index]
        this.$set(this.houseTypeBoxTotal, index, !this.houseTypeBoxTotal[index])
      },
      /** 
       * 打开图片查看器
       */
      clickWatchImg(str, picIndex) {
        console.log('=================')
        console.log(picIndex)
        console.log(this.$refs[str][picIndex])
        this.$refs[str][picIndex].click()
      },
      /** 
       * 关闭户型图弹窗
       */
      closeHouseType() {
        console.log('户型图弹窗关闭了')
        this.houseTypeVisible = false
        this.houseTypeBoxTotal = []
        this.editBtnType = []
        this.houseTypeForm=[]

      },
      /***************************** 户型图弹窗methods end lwz***************************/
      /**新项目列表methods start*/
      clickDisBtn(projectId) {
        axios.get("/api/itemMemberByBuildingId/can").then(res => {
          if(res.status === 200){
            this.disProjectId = projectId
            this.getStaff(this.disProjectId)
            this.distributeBox = true
          }
        }).catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无操作权限")
            return
          }
        })
      },
      closeDistributeBox() {
        this.getNewProjectData()
      },
      clickSynBtn(item) {
        axios.put("/api/publishSystemEditingProject/can").then(res => {
          if(res.status === 200){
            if (item.field_number == 0) {
              this.alertMessage("info", "请先分配驻场")
              return
            } else {
              console.log(item);
              this.announceDiaData = {
                id: item.id,
                platform: item.platform,
                ssrId: item.ssr_id
              }
              this.syncBox = true
            }
          }
        }).catch(err => {
           if (err.response.status === 403) {
            this.alertMessage("warning", "无操作权限")
            return
          }
        })
      },
      clickPhotoBtn(projectId) {
        axios.get("/api/getAPicture/can").then(res => {
          if(res.status === 200){
            this.photoBox = true
            this.clickProjectId = projectId
            console.log(this.clickProjectId);
          }
        }).catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无操作权限")
            return
          }
        })
   
      },
      closeAnnounceBox(data) {
        data == "yes" ? this.getNewProjectData() : ''
        this.syncBox=false
      },
      closePhotoBox() {
        this.getNewProjectData()
      },
      clickProject_Img(str,picIndex) {
        this.$refs[str][picIndex].click()
      },
      /**新项目列表methods start*/
      // =================================================================================
      // 报备类型发生改变时
      protectTypeChange(val){
        val == 1 ? this.addForm.fixedPointProtectionPeriod = "" : (val == 2 ? this.addForm.proTimeAgentReport="" : "")
      },
      // 项目详情
      goProDetails(val) {
        this.projectDetail = true;
        projectDetail({
          params: {
            bId: val
          }
        }).then(res => {
          if (res.status === 200) {
            res.data.building_price = parseInt(res.data.building_price)
            this.proDetailId = res.data
          }
        })
      },
      // ======================================新增项目删除需求开始===========================================
      // 条件搜索项目状态发生改变时
      projectStateChange(val){
        // console.log(val);
        if(val.length > 1 && val[0] == ""){
          this.projectStateArr = val
          this.projectStateArr.splice(0,1)
        }else if(val.length !== 0 && val[val.length-1] == ""){
          this.projectStateArr=[""]
        }
        this.keyWordForm.projectState = this.projectStateArr.length == 0 ? "" : 
        (this.projectStateArr.length == 1 ? this.projectStateArr[0] : this.projectStateArr.join(","))
      },
      sureDelProject(){
        // debugger
        // this.submitEditForm(1)
        this.EditVisible = false
        this.deleteProject = false
        this.getNewProjectData()
      },
      // 发布系统选择改变时
      projectSystemChange(val){
        if(val.length > 1 && val[0] === ""){
          this.publicSystemArr = val
          this.publicSystemArr.splice(0,1)
        }else if(val.length !== 0 && val[val.length-1] === ""){
          this.publicSystemArr=[""]
        }
        this.keyWordForm.publishingSystem = this.publicSystemArr.length == 0 ? "" : 
        (this.publicSystemArr.length == 1 ? this.publicSystemArr[0] : this.publicSystemArr.join(","))
      },
      closeDelDialog(){
        this.deleteProject = false
      },
      defaultMessage(){
        this.deleteProject = false
        // debugger
        // this.alertDelProjectMsg = ""
      },
      // ======================================新增项目删除需求结束===========================================
      // ============================================项目里面选取位置方法开始======================================
      // 点击拾取坐标
      clickGetLocation(int){
        let locationStr = ""
        locationStr = (int == 1 ? this.addForm.coordinate : 
        (int == 2 ? this.editDialogform.coordinate : ""))
        if(locationStr){
          let strArr = locationStr.split(",")
          if(strArr.length == 2 && strArr[1]){
            if(!checkLong(strArr[0])){
              this.alertMessage("info","请输入正确的地图坐标",1500)
              return
            }
            if(!checkLat(strArr[1])){
              this.alertMessage("info","请输入正确的地图坐标",1500)
              return
            }
            this.getLocationDialog = true
            this.defaultLocation = locationStr
          }else{
            this.alertMessage("info","请输入正确的地图坐标",1500)
            return
          }
        }else{
          this.getLocationDialog = true
        }
      },
      getProjectLocation(location){
        this.addForm.coordinate = location
        this.getLocationDialog = false
        // this.getLocationDialog1 = false
      },
      getProjectLocation1(location){
        // this.getLocationDialog1 = false
        this.editDialogform.coordinate = location
        this.getLocationDialog = false
      },
      // ============================================项目里面选取位置方法结束======================================
      // =======================================新增强推项目排序需求开始=======================================
      projectStatusChange1(val){
        // debugger
        if(val == 5){
          this.isShowProjectSort1 = true
        }else{
          this.isShowProjectSort1 = false
        }
      },
      projectStatusChange2(val){
        if(val == 5){
          this.isShowProjectSort2 = true
          this.projectSortData.forEach(res => {
            if(res.id == this.projectIdProtect){
              this.editDialogform.decoration = res.decoration
              this.editDialogform.originalPosition=res.decoration
            }
          })
        }else{
          this.isShowProjectSort2 = false
        }
      },
      // 合并两个对象方法
      assignObj(obj,int){
        let defaultObj = {
          id:"",
          name:"",
          buildingPrice:"",
          otherInfo:"",
          projectType:"",
          projectAgent:"",
          specificOpeningTime:"",
          buildingProperty:"",
          leader:"",
          leaderMobile:"",
          commercialInfo:"",
          decoration :"",
          originalPosition :""
        }
        for (const key in defaultObj) {
          if (obj.hasOwnProperty(key)) {
            defaultObj[key] = obj[key]
          }
        }
        if(int == 1){
          defaultObj.commercialInfo = JSON.parse(localStorage.getItem("myInfo")).companyId
          defaultObj.id=-999
        }
        return defaultObj
      },
      // 点击查看强推项目排序
      lookProjectSort(){
        // debugger
        this.projectSortDiaolog = true
        this.lookSortForm = this.assignObj(this.addForm,1)
        this.lookSortForm.otherInfo = this.cityDetails.join(",")
      },
      // 新增查看当前排序码
      lookSortKey(pId){
        // debugger
        this.$axios.get("/api/sortCode",{params:{bId:pId}}).then(res => {
          res = res.data
          // debugger
          if(res.status === 200){
            this.projectSortData = res.data
            if(!pId){
              this.addForm.decoration = this.projectSortData[this.projectSortData.length-1].decoration
              this.addForm.originalPosition = this.addForm.decoration
            }
          }
        })
      },
      // 编辑查看当前排序码
      editLookSort(){
        this.projectSortDiaolog = true
        this.lookSortForm = this.assignObj(this.editDialogform)
        this.lookSortForm.otherInfo = this.cityDetails.join(",")
      },
      // =======================================新增强推项目排序需求结束=======================================
      // =======================================新增项目列表动态功能开始=======================================
      // 点击发布动态按钮
      getDynamic(projectId){
        this.releasedDynamicDlg = true
        this.clickProjectId = projectId
        this.checkINT = 2
      },
      // 关闭发布动态弹框
      closeReleaDialog(int){
        if(int == 1){
          this.getNewProjectData()
        }else if(int == 2){
          console.log(this.$refs);
          this.$refs.detailChild.detailChild()
        }
        this.releasedDynamicDlg = false
      },
      // 点击编辑发布信息
      editReleaMethod(data){
        this.releasedDynamicDlg = true
        // 用来判断是新增动态还是编辑
        this.checkINT = data.check
        console.log(data);
        this.releasedDynamicData = data
      },
      // =======================================新增项目列表动态功能结束=======================================
      // =======================================户型图图片上传改成oss方法开始======================================
      getDataUrl(item,int,arr){
        // debugger
        console.log(arr[0][0].path);
        if(int == 1){
          if(arr[0].length > 1 || this.addForm.projectPictureList.length > 0){
            this.alertMessage("warning","只能上传一张图片",2000)
            return
          }else{
            let item = {
                        kind:1,
                        imgUrl:arr[0][0].path
                      }
            this.addForm.projectPictureList.push(item)
          }
        }else{
          arr[0].forEach(val => {
            this.houseTypeForm[item].imgUrl.unshift(val.path)
          })
        }
      },
      // =======================================户型图图片上传改成oss方法结束======================================
      // ===================================================富文本编辑器所有所有方法==================================
      editorChange(data){
        this.editDialogform.projectProfile = data
      },
      lookEditor(){
        this.lookEditorBox=true
      }
    },
    filters: {
      spotFormatter: function (val) {
        if (!val) {
          return '-'
        } else {
          let tip = val.split(',')
          let str = ''
          for (let i = 0; i < tip.length; i++) {
            str += `<span>${tip[i]}</span>`
          }
          return str
        }
      }
    },
  };
