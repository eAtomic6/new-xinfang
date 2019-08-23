// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import store from './store'
import  VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {
  api
} from '@/api/ajax'
// import "./views/login/validate"
//引入图片查看器
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import VCharts from 'v-charts'
import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'YOUR_APP_KEY'
})
Vue.use(VCharts)

Vue.use(VueQuillEditor)

Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})

Vue.config.productionTip = false
Vue.use(elementUI)
import axios from "axios"
Vue.prototype.$axios = axios;
Vue.prototype.$HTTP = "api"
// 全局钩子，用来做路由跳转之前的判断 to将要跳转的页面地址， from 将要跳转的当前页面， next继续执行的回调函数
router.beforeEach((to, from, next) => {
  // debugger
  window.document.title = to.meta.title;
  if (to.matched.some(record => record.meta.needLogin)) {
    if (store.state.token) {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    next() // 确保一定要调用 next()
  }
})
Vue.prototype.diGuiMethod = function (arr) {
  for (let j = 0; j < arr.length; j++) {
    if (arr[j].child.length !== 0) {
      this.diGuiMethod(arr[j].child)
    } else {
      delete arr[j].child
    }
  }
  return arr
}
// 消息弹框的封装
Vue.prototype.alertMessage = function (type, msg, time) {
  Vue.prototype.$message({
    type: type,
    message: msg,
    duration: time || 1000
  });
}
Vue.prototype.timeFormats = function (value) {
  var time = new Date(value);
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var day = time.getDate();
  // var hour = time.getHours();
  // var minutes = time.getMinutes();
  return (year + "-" + month + "-" + day);
}
Vue.prototype.$ajax = api

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
