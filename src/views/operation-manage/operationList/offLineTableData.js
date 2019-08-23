const showTableData = [{
    value: "fronn",
    name: "获客渠道",
    width: "120"
  },
  {
    value: "mobile",
    name: "客户电话",
    width: "120"
  },
  {
    value: "b_name",
    name: "意向项目",
    width: "150"
  },
  {
    value: "building_price",
    name: "项目价格",
    width: "90"
  },
  {
    value: "d_name",
    name: "项目公司",
    width: "130"
  },
  {
    value: "StartTime",
    name: "呼叫时间",
    width: "100"
  },
  {
    value: "Duration",
    name: "连接时间",
    width: "90"
  },
  {
    value: "EndTime",
    name: "挂断时间",
    width: "100"
  },
  {
    value: "CalledTel",
    name: "接听电话",
    width: "120"
  },
  {
    value: "NewRecordUrl",
    name: "电话录音",
    width: "100"
  },
  {
    value: "CalledEmp",
    name: "接听人",
    width: "90"
  }
]
const channelData = [
    {
        name: "全部",
        value: ""
    },
    {
        name: "PC端",
        value: 0
    },
    {
        name: "wap端",
        value: 1
    },
    {
        name: "安卓app",
        value: 2
    },
    {
        name: "IOSapp",
        value: 3
    },
    {
        name: "微信",
        value: 4
    }
]
const connectState=[
  {
      name:"全部",
      value:""
  },
  {
      name:"未接通",
      value:0
  },
  {
      name:"接听10秒内",
      value:1
  },
  {
      name:"接听1分钟内",
      value:2
  },
  {
      name:"接听1分钟以上",
      value:3
  }
]
export {
  showTableData,channelData,connectState
}
