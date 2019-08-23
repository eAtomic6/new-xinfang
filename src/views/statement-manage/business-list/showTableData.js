let showTableData = [
    {
        name: "姓名",
        value: "name",
        width: "80",
        sortable: false
      },
      {
        name: "私客数量",
        value: "customerCount",
        width: "100",
        sortable: true
      },
      {
        name: "新增客户",
        value: "addCustomerCount",
        width: "100",
        sortable: true
      },
      {
        name: "所属部门",
        value: "depName",
        width: "180",
        sortable: false
      },
      {
        name: "有效报备",
        value: "valid_report",
        width: "115",
        sortable: true
      },
      {
        name: "待审核报备",
        value: "unCheck_report",
        width: "120",
        sortable: true
      },
      {
        name: "无效报备",
        value: "invalid_report",
        width: "115",
        sortable: true
      },
      {
        name: "过期报备",
        value: "overdue_report",
        width: "115",
        sortable: true
      },
      {
        name: "有效带看",
        value: "valid_look",
        width: "115",
        sortable: true
      },
      {
        name: "待审核带看",
        value: "unCheck_look",
        width: "120",
        sortable: true
      },
      {
        name: "无效带看",
        value: "invalid_look",
        width: "115",
        sortable: true
      },
      {
        name: "过期带看",
        value: "overdue_look",
        width: "115",
        sortable: true
      },
      {
        name: "认筹",
        value: "raise",
        width: "75",
        sortable: true
      },
      {
        name: "认购",
        value: "subscribe",
        width: "75",
        sortable: true
      },
      {
        name: "草签",
        value: "draft",
        width: "75",
        sortable: true
      },
      {
        name: "网签",
        value: "net",
        width: "75",
        sortable: true
      },
      {
        name: "结算",
        value: "settle",
        width: "75",
        sortable: true
      },
      {
        name: "退筹/退房",
        value: "checkOut",
        width: "115",
        sortable: true
      }
]
let lessData=[
    {
        name: "姓名",
        value: "name",
        width: "80",
        sortable: false  
    },
    {
      name: "私客数量",
      value: "customerCount",
      width: "100",
      sortable: true
    },
    {
      name: "新增客户",
      value: "addCustomerCount",
      width: "100",
      sortable: true
    },
    {
      name: "所属部门",
      value: "depName",
      width: "180",
      sortable: false
    },
    {
        name: "跟进总数",
        value: "followCount",
        width: "100",
        sortable: true
      },
      {
        name: "报备客户",
        value: "reportCustomerCount",
        width: "100",
        sortable: true
     },
     {
       name: "报备总数",
       value: "valid_report",
       width: "100",
       sortable: true
    },
    {
      name: "带看客户",
      value: "lookCustomerCount",
      width: "100",
      sortable: true
   },
   {
     name: "带看总数",
     value: "valid_look",
     width: "100",
     sortable: true
  },
  {
    name: "成交总数",
    value: "dealCount",
    width: "100",
    sortable: true
 },
    {
    name: "结佣金额",
    value: "money",
    width: "100",
    sortable: true
    },
]
export {showTableData,lessData}