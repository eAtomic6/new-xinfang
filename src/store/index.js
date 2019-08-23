import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    watchSort:"",
    token: localStorage.getItem('token') || '',
    person: JSON.parse(localStorage.getItem('myInfo')) || {},
    announceNum: localStorage.getItem("announceNum"),
    companyLogo:"",
    code:"",
    managementCustomerChoice:"",
    customerDefaultData:"",
    detailUpload:""
  },
  mutations: {
    set_token(state, token) {
      state.token = token
      localStorage.getItem("token", token)
    },
    del_token(state) {
      state.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem("myInfo")
      localStorage.removeItem("announceNum")
    },
    set_info(state, person) {
      state.person = person
    },
    change_annNum(state, announceNum) {
      state.announceNum--
    },
    set_annNum(state, announceNum) {
      state.announceNum = announceNum
    },
    companyLogo(state, v) {
      state.person.companyLogo = v;
    },
    sortChange(state, v) {
      state.watchSort = v;
    },
    code(state, v) {
      state.code = v;
    },
    // 客户管理 --- 客户列表 ---选择客户
    managementCustomerChoice(state, v) {
      state.managementCustomerChoice = v;
    },
    // 客户管理 --- 客户列表 ---删选条件后，1为需要刷新列表2不需要刷新
    customerDefaultData(state, v){
      state.customerDefaultData = v;
    },
    // 客源列表--详情更新
    setDetailUpload(state, v){
      state.detailUpload = v;
    }
  }
})
export default store
