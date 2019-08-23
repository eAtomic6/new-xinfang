import Vue from 'vue'
function alertMessage(type, msg) {
  Vue.prototype.$message({
    type: type,
    message: msg,
    duration: 1000
  });
}
export function isvalidLoginPhone(str) {
  const reg = /^1\d{10}$/ 
  return reg.test(str)
}
export function isvalidPhone(str) {
  const reg = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,3,6,7,8])|(19[7]))\d{8}$/
  return reg.test(str)
}
export function isvalidCard(str) {
  const reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
  return reg.test(str)
}
export function isProjectPrice(str) {
  const reg = /^[1-9]\d{0,8}$|^[1-9]\d{0,8}[.]\d{1,2}$|^[0][.]\d{1,2}/
  return reg.test(str)
}

export function isMobileSize(str) {
  let isPhone = /^1[34578]\d{9}$/;
  let isMob = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
  if (isMob.test(str) || isPhone.test(str)) {
    return true;
  } else {
    alertMessage("warning", "电话格式错误")
    return false;
  }
}
export function isPhone(str) {
  const reg = /^1[0-9]{10}$/
  return reg.test(str)
}
export function isIdCard(str) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(str)
}