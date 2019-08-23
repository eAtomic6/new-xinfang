import axios from 'axios'
import Vue from 'vue'
import {
  getDepartList,
  getEmployeeList,
  contractManagement,
  contractManagementClick,
  settlementClick,
  settlementDetailsClick,
  getEmployeeInfo,
  postCommission,
  getContractInfo
} from '@/api/index'
import {
  isProjectPrice,
  isIdCard
} from '@/views/login/validate.js'
let checkPhoneVlidate = function (str) {
  return /^[1][0-9]{10}$/.test(str)
}
let checkIdVlidate = function (str) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str)
}
let arr = [],
  arr2 = [],
  commissions = [], //分佣的数据
  commissionseId = [], //分佣的数据
  row = 1,
  timingFlag = true, //金额正则检测节流阀
  timer //计时器
export default {
  inject: ['reload'],
  data() {
    return {
      imageUrl: '',
      //form区域对应字段
      departmentProp: {
        value: 'id',
        label: 'name',
        children: 'child'
      },
      departmentSelect: {}, //选择的部门
      departmentData: [], //获取部门的数据
      dealSelect: {}, //选择的成交人
      getEmployeeInfoData: [], //人员部门的数据
      renGouTime: '',
      renGouNum: '',
      caoQianNum: '',
      wangQianNum: '',
      caoQianTime: '',
      wangQianTime: '',
      renGouPrice: '',
      formInline: {
        // departName: "",
        dealDepId: '', //部门
        dealType: '',
        dealTimeStart: '',
        dealTimeEnd: '',
        keyword: ''
      },
      dealTime: [], //时间

      c: '', //弹框中的成交人的输入框
      dealDepName: '', //弹框中的成交人的输入框

      //

      //上传图片22
      dialogVisible: false, //上传55
      dialogImageVisible: false,
      settlement: false, //结算弹层
      commissionBox: false, //分佣弹层
      contractDetails: false, //合同明细弹层
      // formLabelWidth: "120px",
      financeData: [], // 666合同管理table表格中的数据
      financeDataClick: [], // 666合同管理点击table的数据
      financeDataClickBar: [], // 666合同管理点击table的数据,周期
      tableDataId: null, // 666对应表格时对应的id存储
      tableDataType: '', // 666对应表格时对应的合同状态存储
      dealType: null, //双击合同明细-合同的状态-number
      beforeDealType: null, //双击合同明细-结算前的合同状态
      sourceType: null, //列表中的持有人，转入人
      //分页
      userListTotal: 0, //分页-总条数
      pageNum: 1, //分页-table默认页
      pageSize: 10, //分页-每页默认的显示数目
      butShowHide: false, //结算按钮的显示隐藏99
      butShowHideFY: false, //分佣按钮的显示隐藏99
      settlementData: {}, //结算提交表单2
      settlementDetails: {}, //结算详情基本资料
      settlementDetailsBar: {}, //结算详情周期合同进度
      //  settlementDetailsPlan: "", //结算详情佣
      settlementDetailsForm: {}, //结算详情结算
      settlementDetailsFormRen: {}, //结算详情结算(认筹)
      //  settlementInput: {}, //结算信息提交的数据2322
      //
      settlementDetailsPhone: {}, //结算详情手机号码

      renchouShow: false, //结算-弹窗-认筹字段
      rengouShow: false, //结算-弹窗-认购字段
      caoqianShow: false, //结算-弹窗-草签字段
      wangqianShow: false, //结算-弹窗-网签字段

      tabSettlement: 'first', //结算默认tab项目

      renchouShowHide: false, //双击合同详情-弹窗-认筹字段
      rengouShowHide: false, //双击合同详情-弹窗-认购字段
      caoqianShowHide: false, //双击合同详情-弹窗-草签字段
      wangqianShowHide: false, //双击合同详情-弹窗-网签字段
      jiesuanShow: true, //双击合同详情-弹窗-是否有结算

      customerType: null, //合同明细-左边内容身份 3为u+
      customerInfo: {}, //合同明细-左边内容
      customerInfoBar: '', //合同明细-周期
      settlementInfo: {}, //合同明细-结算信息
      tableIndex: 1, //合同明细-tab切换的序列
      currentMoney: null, //存储当前分佣的金额
      commissionDetail: {}, //存储以前的分佣详情
      //分佣比例行的添加
      commissionData: [],
      contractInfo: [], //双击合同明细

      //业绩分成的数据
      commissionInfo: {},
      //业绩分成表格的数据
      commissionInfoTab: [],
      //操作记录表格的数据
      updateInfo: [],
      //行数据的 Key
      getRowKeysCon(row) {
        return row.id
      }, //Table 目前的展开行
      expandscon: [],
      //分佣比例tab
      commission: {
        ren: ''
      },
      fyIndex: '',
      //结算验证（认筹）
      settlementRulesRenChou: {
        //合同姓名
        custName: [{
            required: true,
            trigger: 'blur'
          }
          // ,
          // { pattern: /^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,10})$/ }
        ],
        //手机号码
        custMobile: [{
          required: true,
          trigger: 'blur'
        }],
        //身份证号
        custIdCard: [{
          required: true,
          trigger: 'blur'
        }],
        //认筹金额//认购金额
        dealPay: [{
            required: true,
            trigger: 'blur'
          },
          {
            pattern: /^[1-9]\d{0,8}$|^[1-9]\d{0,8}[.]\d{1,2}$|^[0][.]\d{1,2}/
          }
        ],
        //截止时间
        dealDeadline: [{
          type: 'string',
          trigger: 'blur'
        }],
        //让利金额
        dealProfit: [{
            required: true,
            trigger: 'blur'
          },
          {
            pattern: /^[1-9]\d{0,8}$|^[1-9]\d{0,8}[.]\d{1,2}$|^[0][.]\d{1,2}/
          }
        ],
        //认筹时间
        dealTime: [{
          required: true,
          // type: "datetime",
          trigger: 'blur'
        }],
        //房屋房号
        houseNo: [{
          trigger: 'blur'
        }],
        // //房屋面积
        houseArea: [{
          trigger: 'blur'
        }],
        //房屋总价
        housePrice: [{
            type: 'number',
            trigger: 'blur'
          },
          {
            pattern: /^[1-9]\d{0,8}$|^[1-9]\d{0,8}[.]\d{1,2}$|^[0][.]\d{1,2}/
          }
        ],
        //成交人
        dealByName: [{
          required: true,
          trigger: 'blur,change'
        }],
        //应收佣金
        expectedCommision: [{
            required: true,
            // type: "number",
            trigger: 'blur'
            // validator: validexpected
          },
          {
            pattern: /^[1-9]\d{0,8}$|^[1-9]\d{0,8}[.]\d{1,2}$|^[0][.]\d{1,2}/
          }
        ],
        //实收佣金
        actualCommision: [{
            required: true,
            // type: "number",
            trigger: 'blur'
            // validator: validactual
          },
          {
            pattern: /^[1-9]\d{0,8}$|^[1-9]\d{0,8}[.]\d{1,2}$|^[0][.]\d{1,2}/
          }
        ]
        // 认筹的结算表单
      },
      //结算验证（认购，草签，网签）
      settlementRules: {
        //合同姓名
        custName: [{
            required: true,
            trigger: 'blur'
          }
          // ,
          // { pattern: /^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,10})$/ }
        ],
        //手机号码
        custMobile: [{
          required: true,
          trigger: 'blur'
        }],
        //身份证号
        custIdCard: [{
          required: true,
          trigger: 'blur'
        }],
        //认购金额
        dealPay: [{
            required: true,
            trigger: 'blur'
          },
          {
            pattern: /^[1-9]\d{0,8}$|^[1-9]\d{0,8}[.]\d{1,2}$|^[0][.]\d{1,2}/
          }
        ],
        //认购时间-草签时间-网签时间
        dealTime: [{
          required: true,
          // type: "datetime",
          trigger: 'blur'
        }],
        //房屋房号
        houseNo: [{
          required: true,
          trigger: 'blur'
        }],
        //房屋面积
        houseArea: [{
          required: true,
          type: 'number',
          trigger: 'blur'
        }],
        //房屋总价
        housePrice: [{
            required: true,
            type: 'number',
            trigger: 'blur'
          },
          {
            pattern: /^[1-9]\d{0,8}$|^[1-9]\d{0,8}[.]\d{1,2}$|^[0][.]\d{1,2}/
          }
        ],
        //成交人
        dealByName: [{
          required: true,
          trigger: 'blur'
        }],
        //应收佣金
        expectedCommision: [{
            required: true,
            // type: "number",
            trigger: 'blur'
            // validator: validexpected
          },
          {
            pattern: /^[1-9]\d{0,8}$|^[1-9]\d{0,8}[.]\d{1,2}$|^[0][.]\d{1,2}/
          }
        ],
        //实收佣金
        actualCommision: [{
            required: true,
            // type: "number",
            trigger: 'blur'
            // validator: validactual
          },
          {
            pattern: /^[1-9]\d{0,8}$|^[1-9]\d{0,8}[.]\d{1,2}$|^[0][.]\d{1,2}/
          }
        ]
        // 认筹的结算表单
      },
      //分佣验证
      commissionRules: {
        //分佣比例
        eCharacter: [{
          required: true,
          trigger: 'blur'
        }],
        eName: [{
          required: true,
          trigger: 'blur'
        }],
        depName: [{
          required: true,
          trigger: 'blur'
        }],
        rate: [{
          required: true,
          trigger: 'blur',
          type: 'number'
        }]
      },
      // operateTime:[],
      // rengoutime: "", //认购时间
      // fenyong: "", //分佣比例

      editForm: {
        // 编辑表单
        photo: '' // 活动图片
      },
      editRules: {
        // 表单验证规则
        photo: [{
          required: true,
          message: '请上传活动图片',
          trigger: 'blur'
        }]
      },

      cert: [], //单据图片
      accountingCert: [], //合同图片
      // editFiles: [], // 编辑时已上传图片初始化
      // uploadComplete: true,
      // base: base.imgURL + "upload/img",
      //  imgVisible: false, // 上传图片预览
      //   dialogImageUrl: [], // 图片预览地址
      imageNum1: 0,
      picLength1: 0,

      houseNoRule: '', //认筹“房屋房号”的规则
      houseAreaRule: '', //认筹“房屋面积”的规则
      housePriceRule: '', //认筹“房屋总价”的规则

      emputErrorRL: false, //让利金额
      emputErrorZJ: false, //房屋总价
      //大图的弹层
      bigImgVisible: false,
      bigImg: '',
      bigImgText: ''
    }
  },
  created() {
    this.$watch('currentMoney', this.debounce((newVal) => {
      if (!newVal) {
        return
      }
      // newVal为输入的值
      this.detectCurMoney()
    }, 500))

    axios
      .get('/api/deal/list/can')
      .then(res => {
        if (res.status === 200) {
          // 调用获取table列表数据方法
          this.getList()
          this.getDepartList()
        }
      })
      .catch(err => {
        if (err.response.status === 403) {
          this.$router.push({
            name: '403errorPage'
          })
          return
        }
      })

  },
  methods: {
    //图片的上传 单据
    //图片删除
    removeAddPhone(res, file, fileList) {
      let index = arr.lastIndexOf(res.url)
      arr.splice(index, 1)
    },
    handlePictureCardPreview(file) {
      this.cert = file.url
      this.dialogImageVisible = true
    },
    uploadPhotoSuccess(res, file, fileList) {
      arr.push(res.images[0].src)
    },
    //判断所传文件类型 上传图片前
    imgPreview(file, fileList) {
      const isJPG = file.type === 'image/jpeg'
      const isGIF = file.type === 'image/gif'
      const isPNG = file.type === 'image/png'
      const isBMP = file.type === 'image/bmp'
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message.error('上传图片必须是JPG/GIF/PNG/BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!')
      }
      return (isJPG || isGIF || isPNG || isBMP) && isLt2M
    },
    //图片的上传 合同
    removeAddPhone2(file, fileList) {
      let index = arr2.lastIndexOf(file.response.images[0].src)
      arr2.splice(index, 1)
    },
    handlePictureCardPreview2(file) {
      this.accountingCert = file.url
      this.dialogImageVisible = true
    },
    uploadPhotoSuccess2(res, file, fileList) {
      arr2.push(res.images[0].src)
    },
    //判断所传文件类型
    imgPreview2(file, fileList) {
      const isJPG = file.type === 'image/jpeg'
      const isGIF = file.type === 'image/gif'
      const isPNG = file.type === 'image/png'
      const isBMP = file.type === 'image/bmp'
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message.error('上传图片必须是JPG/GIF/PNG/BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!')
      }
      return (isJPG || isGIF || isPNG || isBMP) && isLt2M
    },
    // 获取部门
    getDepartList() {
      getDepartList()
        .then(res => {
          this.departmentData = JSON.parse('[' + JSON.stringify(res.data) + ']')
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.alertMessage('warning', '无获取部门权限')
            return
          }
        })
    },
    // 点击转移部门节点时
    clickNode(data, value) {
      console.log(this.departmentSelect)

      this.departmentSelect.id = data.id
      this.formInline.dealDepId = data.name
    },
    // 成交人的模糊搜索
    querySearch(queryString, cb) {
      if (queryString) {
        this.getEmployeeInfoData = this.getEmployeeInfoData.filter(
          this.createFilter(queryString)
        )
      } else {
        this.getEmployeeInfoData.length = 0
        console.log(this.departmentSelect)
        let param = {
          depId: this.departmentSelect.id
        }

        getEmployeeInfo({
          params: param
        }).then(res => {
          res.data.forEach((value, id) => {
            this.getEmployeeInfoData.push({
              value: value.employeeName + ' (' + value.departmentName + ')',
              // id: value.eid,
              eid: value.eid,
              did: value.did,
              names: value.employeeName,
              department: value.departmentName
            })
          })
        })
      }
      cb(this.getEmployeeInfoData)
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
    //选中成交人
    handleSelect(item) {
      console.log(item)

      this.dealSelect.id = item.eid
      console.log(item.value)

      this.formInline.dealByValue = item.value;
    },
    //选中成交人---结算信息弹窗中（认购，网签，草签）
    handleSelectBox(item) {
      console.log(item)
      this.settlementDetailsForm.dealByName = item.names
      this.settlementDetailsForm.dealDepName = item.department
      this.settlementDetailsForm.dealBy = item.eid
      this.settlementDetailsForm.dealDepId = item.did
    },
    //选中成交人---结算信息弹窗中（认筹）
    handleSelectBoxRenChou(item) {
      console.log(item)
      this.settlementDetailsFormRen.dealByName = item.names
      this.settlementDetailsFormRen.dealDepName = item.department
      this.settlementDetailsFormRen.dealBy = item.eid
      this.settlementDetailsFormRen.dealDepId = item.did
      // console.log(item);
    },
    valFrom() {
      // console.log(this.settlementDetailsFormRen.dealByName);
      // if (this.settlementDetailsFormRen.dealByName == "") {
      //   this.settlementDetailsFormRen.dealDepName = "";
      // } else {
      //   let param = {
      //     keyword: this.settlementDetailsFormRen.dealByName,
      //     // keyword: this.settlementDetailsFormRen.dealDepName
      //   };
      //   getEmployeeInfo({ params: param }).then(res => {
      //     console.log(res);
      //     console.log(res.data.length);
      //   });
      // }
    },
    changeValue() {
      // console.log(555555);
    },
    //选中成交人---分佣弹窗中
    handleSelectFY(item) {
      this.commissionData[this.fyIndex].eId = item.eid
      this.commissionData[this.fyIndex].depId = item.did
      this.commissionData[this.fyIndex].eName = item.names
      this.commissionData[this.fyIndex].depName = item.department
    },
    // 分佣弹窗中-单击每行事件
    tableRowClassName({
      row,
      rowIndex
    }) {
      //把每一行的索引放进row
      row.index = rowIndex
    },
    rowClick(row, event, column) {
      //行点击消除new标记
      var index = row.index
      this.fyIndex = index
    },
    // 获取table列表数据666
    getList() {
      this.formInline.dealByValue ? "" : this.dealSelect.id = ""
      const params = {
        dealDepId: this.departmentSelect.id, //部门id
        dealBy: this.dealSelect.id, //成交人id
        dealType: this.formInline.dealType, //合同状态value
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        dealTimeStart: this.dealTimeStart,
        dealTimeEnd: this.dealTimeEnd,
        keyword: this.formInline.keyword
      }
      contractManagement({
        params: params
      }).then(res => {
        console.log(res)

        if (res.status === 200) {
          this.financeData = res.data.list
          this.userListTotal = res.data.total

          this.financeData.forEach(value => {
            if (value.state === 0) {
              this.financeData.state = '有效'
            } else if (value.state === 1) {
              this.financeData.state = '暂缓'
            } else if (value.state === 2) {
              this.financeData.state = '无效'
            } else if (value.state === 3) {
              this.financeData.state = '失效'
            }
          })
        }
      })
    },
    // table列表点击获取数据666
    getListClick(htType) {
      const params = {
        dealId: this.tableDataId
      }
      contractManagementClick({
        params: params
      }).then(res => {
        if (res.status === 200) {
          console.log(res)

          this.financeDataClick = res.data.contractDetails //客户详情的数据
          this.financeDataClickBar = res.data.customerProgressBar //客户生命周期的数据
          let source = this.financeDataClick.source //客户来源
          let type = this.financeDataClick.type //合同状态
          let fyType = res.data.commissionType //分佣的状态
          console.log(fyType)

          console.log(this.financeDataClickBar)

          if (
            type === '认筹' ||
            type === '认购' ||
            type === '草签' ||
            type === '网签'
          ) {
            this.butShowHide = true
            // this.jiesuanShow = false;
          } else {
            this.butShowHide = false
            // this.jiesuanShow = true;
          }
          //客户来源的判断
          if (source === 1) {
            this.financeDataClick.source = '来电'
          } else if (source === 2) {
            this.financeDataClick.source = '转介'
          } else if (source === 3) {
            this.financeDataClick.source = '微信/小程序'
          } else if (source === 4) {
            this.financeDataClick.source = '搜房'
          } else if (source === 5) {
            this.financeDataClick.source = '广告'
          } else if (source === 6) {
            this.financeDataClick.source = '社区'
          } else if (source === 7) {
            this.financeDataClick.source = '大客户'
          } else if (source === 8) {
            this.financeDataClick.source = 'u+'
          }
          this.tableDataType = type
          console.log('==============fyType')
          console.log(fyType)
          console.log('==============type')
          console.log(type)
          if (htType === '结算中') {
            this.butShowHideFY = true
          } else {
            this.butShowHideFY = false
          }
        }
      })
    },
    // 单击每行事件
    rowClickCon(row, event, column) {
      console.log(111111111)
      console.log(row.type)
      console.log(event)
      console.log(column)
      //点击行 展开
      this.tableDataId = row.id //点击的表格的id
      this.dealType = row.dealType //点击的表格的合同状态传合同明细-number
      this.beforeDealType = row.beforeDealType //点击的表格的合同状态传合同明细 结算前的合同状态-number
      this.sourceType = row.sourceType //列表中的持有人，转入人-number

      let index = this.expandscon.indexOf(row.id)
      if (index > -1) {
        this.expandscon = this.expandscon.splice(index, -1)
      } else {
        this.expandscon = []
        this.expandscon.push(row.id)
      }
      this.getListClick(row.type)
    },
    //控制只显示当前一行
    showDetailCon(rowdata, expandedRows) {
      if (expandedRows.length) {
        this.expandscon = []
        if (rowdata) {
          this.expandscon.push(rowdata.id)
        }
      } else {
        this.expandscon = []
      }
    },

    //分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pageNum = val
      this.getList()
    },
    //查询按钮
    onSearch() {
      if (this.dealTime.length) {
        this.dealTimeStart = this.dealTime[0]
        this.dealTimeEnd = this.dealTime[1]
      } else {
        this.dealTimeStart = ''
        this.dealTimeEnd = ''
      }
      this.getList();
      // this.formInline.pageNum = 1
      // this.formInline.pageSize = 5
      // this.pageNum = 1
      // contractManagement({ params: this.formInline }).then(res => {
      //   console.log('==============contractManagement')
      //   console.log(res)
      //   if (res.status === 200) {
      //     this.financeData = res.data.list
      //     this.userListTotal = res.data.total

      //     this.financeData.forEach(value => {
      //       if (value.state === 0) {
      //         this.financeData.state = '有效'
      //       } else if (value.state === 1) {
      //         this.financeData.state = '暂缓'
      //       } else if (value.state === 2) {
      //         this.financeData.state = '无效'
      //       } else if (value.state === 3) {
      //         this.financeData.state = '失效'
      //       }
      //     })
      //   }
      // })
    },
    //重置按钮
    onReset() {
      //this.formInline={};//清空文本框的内容
      this.formInline.dealDepId = ""; //清空部门文本框的内容
      this.formInline.dealByValue = ""; //清空成交人文本框的内容
      this.formInline.dealBy=""
      this.formInline.dealType = ""; //清空合同状态文本框的内容
      this.formInline.keyword = ""; //清空关键词文本框的内容
      this.dealTime = ""; //清空日期文本框
      this.departmentSelect.id = ""; //清空部门id
      this.dealSelect.id = ""; //清空成交人id
      this.pageNum = 1;
      this.pageSize = 10;
      this.dealTimeStart = "";
      this.dealTimeEnd = "";
      this.getList();
    },
    // 结算按钮
    butSettlementClick() {
      axios
        .put('/api/deal/settlement/can')
        .then(res => {
          if (res.status === 200) {
            this.getList()
            this.cert = []
            this.accountingCert = []
            arr = []
            arr2 = []
            this.emputErrorRL = false //表单
            this.emputErrorZJ = false //表单
            this.settlement = true //结算弹层
            const params = {
              dealId: this.tableDataId
            }
            // 结算详情数据
            settlementDetailsClick({
              params: params
            }).then(res => {
              // console.log("结算详情的数据");
              // console.log(res);
              // debugger
              this.settlementData = res.data
              this.settlementDetails = res.data.basciInformation
              this.settlementDetailsBar = res.data.customerProgressBar
              //   this.settlementDetailsPlan = res.data.deal;
              this.settlementDetailsForm = res.data.latestInfo
              // this.cert = res.data.latestInfo.cert; //单据图片
              this.settlementDetailsFormRen = res.data.latestInfo
              if (res.data.latestInfo.cert.length != 0) {
                console.log(128578)
                res.data.latestInfo.cert.forEach(value => {
                  this.cert.push({
                    url: value
                  })
                })
                arr = res.data.latestInfo.cert
              }

              let settlementphone = res.data.phone
              this.settlementDetailsPhone = settlementphone
              let buildingProperty = this.settlementDetails.buildingProperty //项目性质
              this.settlementDetails.buildingProperty =
                buildingProperty == '1' ? '以带看为准' : '非带看为准'
              let type = this.tableDataType //获取合同状态
              if (type === '认筹') {
                this.renchouShow = true

                this.houseNoRule = ''
                this.houseAreaRule = ''
                this.housePriceRule = ''

                this.settlementDetailsFormRen.houseNo = ''
                this.settlementDetailsFormRen.houseArea = ''
                this.settlementDetailsFormRen.housePrice = ''
              } else {
                this.renchouShow = false
              }
              if (type === '认购') {
                this.rengouShow = true
                this.renGouTime = 'dealTime'
                this.renGouPrice = 'dealPay'
                this.caoQianTime = ''
                this.wangQianTime = ''
                this.renGouNum = 'houseNo'
                this.caoQianNum = ''
                this.wangQianNum = ''
              } else {
                this.rengouShow = false
              }
              if (type === '草签') {
                this.caoqianShow = true
                this.renGouTime = ''
                this.caoQianTime = 'dealTime'
                this.wangQianTime = ''
                this.renGouPrice = ''
                this.renGouNum = ''
                this.caoQianNum = 'houseNo'
                this.wangQianNum = ''
              } else {
                this.caoqianShow = false
              }
              if (type === '网签') {
                this.wangqianShow = true
                this.renGouTime = ''
                this.caoQianTime = ''
                this.wangQianTime = 'dealTime'
                this.renGouPrice = ''
                this.renGouNum = ''
                this.caoQianNum = ''
                this.wangQianNum = 'houseNo'
              } else {
                this.wangqianShow = false
              }
            })
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.alertMessage('warning', '无操作权限')
            return
          }
        })
    },
    // 结算表单提交（认筹）
    settlementSubmitRenChou(refsettlementDetailsRenChou) {
      this.settlementDetailsFormRen.cert = arr
      this.settlementDetailsFormRen.accountingCert = arr2
      //佣金的大小
      if (
        this.settlementDetailsFormRen.expectedCommision != undefined &&
        this.settlementDetailsFormRen.actualCommision != undefined
      ) {
        if (
          this.settlementDetailsFormRen.actualCommision >
          this.settlementDetailsFormRen.expectedCommision
        ) {
          this.alertMessage('warning', '应收佣金应大于等于实收佣金！')
          return false
        }
      }

      console.log(this.settlementDetailsFormRen)
      this.$refs[refsettlementDetailsRenChou].validate(valid => {
        if (valid) {
          if (!checkPhoneVlidate(this.settlementDetailsFormRen.custMobile)) {
            this.alertMessage('warning', '手机号格式不正确')
            return
          }
          if (!checkIdVlidate(this.settlementDetailsFormRen.custIdCard)) {
            this.alertMessage('warning', '身份证格式不正确')
            return
          }
          settlementClick(this.settlementDetailsFormRen).then(res => {
            if (res.status === 200) {
              this.alertMessage('success', '结算成功！')
              this.butShowHide = false
              this.jiesuanShow = true
              this.settlement = false //结算弹层
              this.reload()
            } else {
              this.alertMessage('warning', '结算失败！')
            }
          })
        } else {
          this.alertMessage('warning', '请完善信息！')
          return false
        }
      })
    },
    // 结算表单提交（认购，草签，网签）
    settlementSubmit(refsettlementDetails) {
      this.settlementDetailsForm.cert = arr
      this.settlementDetailsForm.accountingCert = arr2
      //佣金的大小
      if (
        this.settlementDetailsForm.expectedCommision != undefined &&
        this.settlementDetailsForm.actualCommision != undefined
      ) {
        if (
          this.settlementDetailsForm.actualCommision >
          this.settlementDetailsForm.expectedCommision
        ) {
          this.alertMessage('warning', '应收佣金应大于等于实收佣金！')
          return false
        }
      }

      console.log(this.settlementDetailsForm)
      this.$refs[refsettlementDetails].validate(valid => {
        if (valid) {
          if (!checkPhoneVlidate(this.settlementDetailsForm.custMobile)) {
            this.alertMessage('warning', '手机号格式不正确')
            return
          }
          if (!checkIdVlidate(this.settlementDetailsForm.custIdCard)) {
            this.alertMessage('warning', '身份证格式不正确')
            return
          }
          settlementClick(this.settlementDetailsForm).then(res => {
            if (res.status === 200) {
              this.alertMessage('success', '结算成功！')
              this.butShowHide = false
              this.jiesuanShow = true
              this.settlement = false //结算弹层
              this.reload()
            } else {
              this.alertMessage('warning', '结算失败！')
            }
          })
        } else {
          this.alertMessage('warning', '请完善信息！')
          return false
        }
      })
    },
    // 分佣按钮
    butCommissionClick() {
      //this.getList();
      axios
        .post('/api/deal/commission/can')
        .then(res => {
          if (res.status === 200) {
            this.commissionData = [{}] //分佣数据清空
            this.commissionBox = true //分佣弹层
            this.currentMoney = '' //实收佣金初始化
            this.getCommissionAjax()
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.alertMessage('warning', '无操作权限')
            return
          }
        })
    },
    /**
     * 获取分佣详情
     */
    getCommissionAjax() {
      console.log(this.tableDataId)
      //   return
      let param = {
        dealId: this.tableDataId
      }
      axios
        .get('/api/deal/commissionDetails', {
          params: param
        })
        .then(res => {
          res = res.data
          if (res.status === 200) {
            console.log(res.data)
            this.commissionDetail = res.data
          }
        })
        .catch(err => {})
    },
    //分佣比例的添加
    addcommissionData() {
      this.commissionData.push({})
      console.log(this.commissionData)
      row += 1
    },
    //分佣比例的删除
    deleteRowcommissionData(index) {
      this.commissionData.splice(index, 1)
      row -= 1
      // this.fyIndex-=1
    },
    detectCurMoney() {
      let sss = /^[1-9]\d{0,8}$|^[1-9]\d{0,8}[.]\d{1,2}$|^[0][.]\d{1,2}/
      if (!sss.test(this.currentMoney)) {
        this.alertMessage('warning', '实收金额最多为9位正整数加2位小数', 3000)
        this.currentMoney = ''
        return
      }
      if (this.currentMoney > this.commissionDetail.restCommission) {
        this.alertMessage('warning', '不能超过剩余结算佣金', 2000)
        this.currentMoney = this.commissionDetail.restCommission
      }
    },
    /***
     * 连续输入节流阀
     * @param func 输入完成的回调函数
     * @param delay 延迟时间
     */
    debounce(func, delay) {
      let timer
      return (...args) => {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          func.apply(this, args)
        }, delay)
      }
    },
    //分佣比例的提交
    commissionSubmit(formCommission) {
      console.log('=================commission')
      console.log(this.commission)
      console.log(this.commissionData)
      commissions = []
      commissionseId = []
    //   console.log(this.tableDataId)
    //   console.log(this.fyIndex)
    //   console.log(row)
      this.fyIndex = 0
      for (let i = 0; i < row; i++) {
          console.log(i,row)
          console.log('======================commissionData')
          console.log(this.commissionData[i])
        this.commissionData[i].dealId = this.tableDataId
        if (
          this.commissionData[i].eCharacter == undefined ||
          this.commissionData[i].depName == undefined ||
          this.commissionData[i].eName == undefined ||
          this.commissionData[i].rate == undefined ||
          this.currentMoney == ''
        ) {
          this.alertMessage('warning', '请完善信息！')
          return false
        }
      }
      console.log(this.commissionData)
      let param = {
        commissionForm: this.commissionData,
        settlementMoney: this.currentMoney,
        commissionTime: this.commissionDetail.commissionTime
      }
      console.log('====================param')
      console.log(param)
      //   return
      postCommission(param).then(res => {
        console.log(res)
        if (res.status === 200) {
          this.alertMessage('success', '分佣成功！')
          this.butShowHideFY = false //分佣按钮
          this.commissionBox = false //分佣弹层
          this.currentMoney = '' //初始化
          this.closeRest()
          this.getList()
          this.reload()
        } else {
          this.alertMessage('warning', '分成比例之和必须等于100%！')
        }
      })
    },
    closeRest() {
      row = 1
    },
    // 双击合同明细
    rowDblclickCon() {
      this.contractDetails = true
      const params = {
        dealId: this.tableDataId, //成交人id
        type: this.tableIndex, //类型id
        dealType: this.dealType //合同状态
      }
      getContractInfo({
        params: params
      }).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.customerInfo = res.data[0]
          this.customerType = res.data[0].type //客户类型
          if (this.tableIndex === 1) {
            this.settlementInfo = res.data[1]
            this.customerInfoBar = res.data[1].customerProgressBarOfSite //合同状态
            let type = this.tableDataType //获取合同状态
            let beforeDealType = this.beforeDealType //获取结算前的合同状态-number
            let dealType = this.dealType //获取合同状态-number

            if (dealType === 7) {
              this.jiesuanShow = true
            } else {
              this.jiesuanShow = false
            }
            if (beforeDealType !== null) {
              //合同明细的结算状态
              this.jiesuanShow = true
              if (beforeDealType === 0) {
                console.log(555555)

                this.renchouShowHide = true
              } else {
                this.renchouShowHide = false
              }
              if (beforeDealType === 1) {
                console.log(23445)
                this.rengouShowHide = true
              } else {
                this.rengouShowHide = false
              }
              if (beforeDealType === 2) {
                this.caoqianShowHide = true
              } else {
                this.caoqianShowHide = false
              }
              if (beforeDealType === 3) {
                this.wangqianShowHide = true
              } else {
                this.wangqianShowHide = false
              }
            } else {
              //合同状态0:认筹 1:认购 2:草签 3:网签 7:结算 非结算状态
              this.jiesuanShow = false
              if (dealType === 0) {
                this.renchouShowHide = true
              } else {
                this.renchouShowHide = false
              }
              if (dealType === 1) {
                this.rengouShowHide = true
              } else {
                this.rengouShowHide = false
              }
              if (dealType === 2) {
                this.caoqianShowHide = true
              } else {
                this.caoqianShowHide = false
              }
              if (dealType === 3) {
                this.wangqianShowHide = true
              } else {
                this.wangqianShowHide = false
              }
            }
          }

          if (this.tableIndex === 2) {
            this.commissionInfo = res.data[1]
            this.commissionInfoTab = res.data[1].commissionInfos
          }
          if (this.tableIndex === 3) {
            this.updateInfo = res.data[1].updateInfo
          }
        }
      })
    },
    tableClickIndex(value) {
      this.tableIndex = parseInt(value.index) + 1
      this.rowDblclickCon()
    },
    //时间格式的转换2255
    formatTime(row, column) {
      if (row[column.property] != null) {
        const date = new Date(row[column.property])
        if (date) {
          //  return date.slice(0, 16);
          let myyear = date.getFullYear()
          let mymonth =
            date.getMonth() + 1 < 10 ?
            '0' + (date.getMonth() + 1) :
            date.getMonth() + 1
          let mydate =
            date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
          let gethours =
            date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
          let getminutes =
            date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
          return (
            myyear +
            '-' +
            mymonth +
            '-' +
            mydate +
            ' ' +
            gethours +
            ':' +
            getminutes
          )
        }
      }
    },
    commissionReceivable() {
      if (
        this.settlementDetailsForm.expectedCommision != undefined &&
        this.settlementDetailsForm.actualCommision != undefined
      ) {
        if (
          this.settlementDetailsForm.actualCommision >
          this.settlementDetailsForm.expectedCommision
        ) {
          this.alertMessage('warning', '应收佣金应大于等于实收佣金！')
          return false
        }
      }
    },
    //查看大图
    ViewBigPhoto(index, item) {
      this.bigImg = ''
      if (this.settlementInfo.cert.indexOf(item) != -1) {
        this.bigImg = ''
        let newItem = item.split('?')[0]
        this.bigImg = newItem
        this.bigImgText = '单据图片'
        this.bigImgVisible = true
      }
      if (this.settlementInfo.accounting_cert.indexOf(item) != -1) {
        this.bigImg = ''
        let newItem = item.split('?')[0]
        this.bigImg = newItem
        this.bigImgText = '合同图片'
        this.bigImgVisible = true
      }
    },
    //价格验证
    Price() {
      let housePrice = this.settlementDetailsForm.housePrice
      let dealPay = this.settlementDetailsForm.dealPay
      let dealProfit = this.settlementDetailsForm.dealProfit

      let expectedCommision = this.settlementDetailsForm.expectedCommision
      let actualCommision = this.settlementDetailsForm.actualCommision

      let housePriceRen = this.settlementDetailsFormRen.housePrice
      let dealPayRen = this.settlementDetailsFormRen.dealPay
      let expectedCommisionRen = this.settlementDetailsFormRen.expectedCommision
      let actualCommisionRen = this.settlementDetailsFormRen.actualCommision
      if (
        housePrice ||
        dealProfit ||
        dealPay ||
        expectedCommision ||
        actualCommision
      ) {
        if (!isProjectPrice(dealPay) && dealPay) {
          this.alertMessage('warning', '金额格式不正确')
          return false
        } else {
          if (!isProjectPrice(dealProfit) && dealProfit) {
            this.alertMessage('warning', '让利金额格式不正确')
            this.emputErrorRL = true
            return false
          } else {
            this.emputErrorRL = false
            if (!isProjectPrice(housePrice) && housePrice) {
              this.alertMessage('warning', '房屋总价格式不正确')
              this.emputErrorZJ = true
              return false
            } else {
              this.emputErrorZJ = false
              if (
                (!isProjectPrice(expectedCommision) && expectedCommision) ||
                (!isProjectPrice(actualCommision) && actualCommision)
              ) {
                this.alertMessage('warning', '佣金格式不正确')
                return false
              }
            }
          }
        }
      }
    },
    //身份证号验证
    idCardChange() {
      let custIdCard = this.settlementDetailsForm.custIdCard
      let custIdCardRen = this.settlementDetailsFormRen.custIdCard
      if (custIdCard) {
        if (!checkIdVlidate(custIdCard)) {
          this.alertMessage('warning', '身份证号格式不正确')
          return false
        }
      }
    },
    //手机号验证
    validPhone() {
      let custMobileRen = this.settlementDetailsFormRen.custMobile
      let custMobile = this.settlementDetailsForm.custMobile
      if (custMobile) {
        if (!checkPhoneVlidate(custMobile)) {
          this.alertMessage('warning', '手机号格式不正确')
          return
        }
      }
    },
    /**
     * 数字转汉字
     */
    sectionToChinese(section) {
      var chnNumChar = [
        '零',
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
        '七',
        '八',
        '九'
      ]
      var chnUnitSection = ['', '万', '亿', '万亿', '亿亿']
      var chnUnitChar = ['', '十', '百', '千']

      var strIns = '',
        chnStr = ''
      var unitPos = 0
      var zero = true
      while (section > 0) {
        var v = section % 10
        if (v === 0) {
          if (!zero) {
            zero = true
            chnStr = chnNumChar[v] + chnStr
          }
        } else {
          zero = false
          strIns = chnNumChar[v]
          strIns += chnUnitChar[unitPos]
          chnStr = strIns + chnStr
        }
        unitPos++
        section = Math.floor(section / 10)
      }
      return chnStr
    },
    focusBoxJ() {}
  },
  watch: {
    //   currentMoney(newVal){
    //     this.debounce((newval)=>{
    //         this.detectCurMoney()
    //     })
    //   }
  },
  filters: {
    formatTime(time) {
      if (time) {
        return time.slice(0, 16)
      }
    },
    formatTimeHead(time) {
      if (time) {
        var index = time.indexOf(' ')
        return time.slice(0, index)
      }
    },
    formatTimeEnd(time) {
      if (time) {
        return time.slice(11, 16)
      }
    }
  }
}
