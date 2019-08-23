import {
  getDefaultDept,
  editDepartment,
  getAdminDept,
  getDepartList
} from '@/api/index'
// 获取当前人的区域id
export function getAreaId(id) {
  let params = {
    id: id
  }
  let method = new Promise((resolve, reject) => {
    editDepartment({
      params: params
    }).then(res => {
      if (res.status === 200) {
        resolve(res)
      } else {
        reject(res.message)
      }
    }).catch((err) => {
      reject(err.message)
    });
  })
  return method
}
// 获取所有被选择的管辖部门id的方法封装
export function DefaultDepartM(params) {
  let method = new Promise((resolve, reject) => {
    getDefaultDept({
      params: params
    }).then((res) => {
      if (res.status === 200) {
        resolve(res)
      } else {
        reject(res.message)
      }
    }).catch((err) => {
      reject(err.message)
    });
  })
  return method
}
// 使用正则匹配字符串进行替换
export function replaceString(idArr, string) {
  // debugger
  let str = ""
  str = defaultString(string)
  let arrStr = idArr.join("|")
  let re = new RegExp("(\"DepartOnlyCode\":(" + arrStr + ")\.0)(,\"disabled\":false)", "g")
  str = str.replace(re, "$1,\"disabled\":true")
  return str
}
// 通过正则初始化管辖部门数据
function defaultString(string) {
  string = string.replace(/("DepartOnlyCode":\d+\.0)/g, "$1,\"disabled\":false")
  return string
}
// 获取正则匹配之后的departName值
export function getDefaultString(string, depStr) {
  // debugger
  let arrStr = string.split(",").join("|")
  let resultArr = [],
    resultStr1 = "",
    resultStr2 = "";
  let re = new RegExp("\"DepartOnlyCode\":(" + arrStr + ")\,\"DeptName\":\"([^\"]+)", "g")
  resultArr = depStr.match(re)
  if(resultArr && resultArr.length !== 0){
    resultArr.forEach(val => {
      resultStr1 = re.exec(depStr)[2]
      resultStr2 += resultStr1 + ","
    });
  }
  return resultStr2
}
// 封装方法传入秒时获取多少天多少时多少分
export function getStrTime(second) {
  // let str = ""
  // switch (true) {
  //   case 60 > second:
  //     str = 0 + '天' + 0 + '时' + 0 + '分'
  //     break;
  //   case 60 <= second < 3600:
  //     str = 0 + '天' + 0 + '时' + parseInt(second/60) + '分'
  //     break;
  //   case 3600 <= second < 86400:
  //     str = 0 + '天' + parseInt(second/3600) + '时' + parseInt(second%3600/60) + '分'
  //     break;
  //   case second >= 86400:
  //     str = parseInt(second/86400) + '天' + parseInt(second%86400/3600) + '时' + parseInt(second%86400%3600) + '分'
  //     break;
  // }
  // return str
}
export function getTargetSort(data){
  let target = "";
  switch (data.label) {
    case '客户数量':
    target = data.order=="ascending" ? '1' : '2'
    break;
    case '私客数量':
    target = data.order=="ascending" ? '1' : '2'
    break;
    case '有效报备':
    target = data.order=='ascending' ? '3' : '4'
    break;
    case '待审核报备':
    target = data.order=='ascending' ? '5' : '6'
    break;
    case '无效报备':
    target = data.order=='ascending' ? '7' : '8'
    break;
    case '过期报备':
    target = data.order=='ascending' ? '9' : '10'
    break;
    case '有效带看':
    target = data.order=='ascending' ? '13' : '14'
    break;
    case '待审核带看':
    target = data.order=='ascending' ? '15' : '16'
    break;
    case '无效带看':
    target = data.order=='ascending' ? '17' : '18'
    break;
    case '过期带看':
    target = data.order=='ascending' ? '19' : '20'
    break;
    case '认筹':
    target = data.order=='ascending' ? '23' : '24'
    break;
    case '认购':
    target = data.order=='ascending' ? '25' : '26'
    break;
    case '草签':
    target = data.order=='ascending' ? '27' : '28'
    break;
    case '网签':
    target = data.order=='ascending' ? '29' : '30'
    break;
    case '结算':
    target = data.order=='ascending' ? '31' : '32'
    break;
    case '退筹/退房':
    target = data.order=='ascending' ? '33' : '34'
    break;
    case '新增客户':
    target = data.order=='ascending' ? '35' : '36'
    break;
    case '跟进总数':
    target = data.order=='ascending' ? '37' : '38'
    break;
    case '报备客户':
    target = data.order=='ascending' ? '39' : '40'
    break;
    case '报备总数':
    target = data.order=='ascending' ? '3' : '4'
    break;
    case '带看客户':
    target = data.order=='ascending' ? '41' : '42'
    break;
    case '带看总数':
    target = data.order=='ascending' ? '13' : '14'
    break;
    case '成交总数':
    target = data.order=='ascending' ? '43' : '44'
    break;
    case '结佣金额':
    target = data.order=='ascending' ? '45' : '46'
    break;
    default:
      break;
  }
  return target
}
// 部门报表里面的u+部门数据异步请求
export function getDepartData (params){
  let method = new Promise((resolve,reject) => {
      getAdminDept({params:params}).then(res => {
        if(res.status === 200){
          resolve(res)
        }else{
          reject(res.message)
        }
      }).catch((err) => {
        reject(err.message)
      });
  })
  return method
}
// 所有报表里面部门列表异步请求
export function getDepartListData (){
  let method = new Promise((resolve,reject) => {
    getDepartList().then(res => {
        if(res.status === 200){
          resolve(res)
        }else{
          reject(res.message)
        }
      }).catch((err) => {
        reject(err.message)
      });
  })
  return method
}

 // 保留两位小数，但不需要四舍五入：传参a是要截取的数值，可以是数字也可以是字符串，num是要截取的小数位数
 export function subStringNum(a, num) {
  var a_type = typeof a;
  if (a_type == "number") {
    var aStr = a.toString();
    var aArr = aStr.split(".");
  } else if (a_type == "string") {
    var aArr = a.split(".");
  }

  if (aArr.length > 1) {
    a = aArr[0] + "." + aArr[1].substr(0, num);
  }
  return a;
}
export function checkLong(lngStr){
  var longrg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
  // var lng = $("#itemform [id='lng']").val();
  if(!longrg.test(lngStr)){
      return false;
  }
  return true;
}
export function checkLat(latStr){
  var latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
  // var lat = $("#itemform [id='lat']").val();
  if(!latreg.test(latStr)){ 
      return false;
  }
  return true;
}