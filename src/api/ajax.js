import axios from 'axios'

let qs = require('qs')
let root = process.env.API_ROOT

// axios.defaults.headers.common['token'] = 'bdec066f-4bf7-424e-9237-50a5145ae36a' //lwz 列表
// axios.defaults.headers.common['token'] = '4206b5cc-80fd-40bf-92c2-15b74bce55c5'//

if (localStorage['token'] !== null) {
  axios.defaults.headers.common['token'] = localStorage['token']
}

let api = {
  post: function(url, param) {
    return axios
      .post(url, param)
      .then(res => {
        return res
      })
  },
  postJSON: function(url, param) {
    let jsonParam = JSON.stringify(param)
    let headers = {}
    headers['Content-Type'] = 'application/json'
    return axios.post(url, jsonParam, { headers: headers }).then(res => {
      return res
    })
  },
  putJSON: function(url, param) {
    let jsonParam = JSON.stringify(param)
    let headers = {}
    headers['Content-Type'] = 'application/json'
    return axios.put(url, jsonParam, { headers: headers }).then(res => {
      return res
    })
  },
  get: function(url, param, type = 'init') {
    let headers = {}
    if (type === 'pt') {
      headers['platform'] = 'g'
    }
    return axios.get(url,{ headers: headers ,params:param}).then(res => {
      return res
    })
  },
  delete: function(url, param) {
    return axios
      .delete(url, {
        params: param
      })
      .then(res => {
        return res
      })
  },
  put: function(url, param) {
    return axios.put(url, qs.stringify(param)).then(res => {
      return res
    })
  }
}
export { api }
