import addVideo from "./addVideoDialog.vue"
const VEDIOSTATUS = [{
    key: '',
    value: '全部'
  },
  {
    key: true,
    value: '上架'
  },
  {
    key: false,
    value: '下架'
  }
]

const VEDIOTABLEDATA = [{
  order: 1,
  title: '带看基石之需求与匹配',
  size: '80MB',
  uploader: '王小虎',
  type: '上架',
  update: '2018-11-08  15:01:11',
  downdate: '2018-11-08  15:01:11',
}, {
  order: 2,
  title: '带看基石之需求与匹配',
  size: '80MB',
  uploader: '王小虎',
  type: '上架',
  update: '2018-11-08  15:01:11',
  downdate: '2018-11-08  15:01:11',
}, {
  order: 3,
  title: '带看基石之需求与匹配',
  size: '80MB',
  uploader: '王小虎',
  type: '上架',
  update: '2018-11-08  15:01:11',
  downdate: '2018-11-08  15:01:11',
}, {
  order: 4,
  title: '带看基石之需求与匹配',
  size: '80MB',
  uploader: '王小虎',
  type: '上架',
  update: '2018-11-08  15:01:11',
  downdate: '2018-11-08  15:01:11',
}]
export default {
  components: {
    addVideo
  },
  data() {
    return {
      vedioStatus: VEDIOSTATUS,
      vedioFrom: {
        companyId: '', //公司id
        isOnshelve: '', //视频状态
        name: '', //楼盘名称
      },
      vedioTableData: [],
      pageNum: 1, //页码
      pageSize: 10, //页大小
      total: 0, //视频总数
      addVideoBox: false,
      companyId: 0, //公司id
      companyNameArr: [], //公司名称数组
      notConfig: [{
        label: '公司名称',
        prop: 'companyName',
        enable: true,
        width: 300
      }],
      btnFlag: true, //按钮节流阀
      isShowCompanyForm: false
    }
  },
  methods: {
    /** 
     * 点击查询按钮
     */
    onSubmit() {
      console.log('submit!')
      this.getVedioListAjax()

    },
    // 点击新增视频
    addVideoBtn() {
      this.$ajax.post("/api/media/can").then(res => {
        if(res.status === 200){
          this.addVideoBox = true
        }
      }).catch(err => {
      if(err.response.status === 403){
        this.alertMessage("warning", "无新增权限")
        return
      }
    })
    },
    // 点击关闭添加视频
    closeAddVideoBox(addVideoBox) {
      this.addVideoBox = addVideoBox;
    },
    /** 
     * 点击重置按钮
     */
    reset() {
      this.vedioFrom = {
        isOnshelve: '', //视频状态
        name: '', //楼盘名称
      }
      this.pageNum = 1 //页码
      this.pageSize = 10 //页大小
      this.getVedioListAjax()
    },
    /** 
     * 修改页大小
     */
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getVedioListAjax()
    },
    /** 
     * 修改当前页
     */
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val
      this.getVedioListAjax()
    },
    /** 
     * 点击升序、降序
     */
    changeSort(item, isUp) {
      if (isUp && item.sortAsc === 1) {
        this.alertMessage('warning', '已是最高顺序')
        return
      } else if (!isUp && item.sortAsc === this.total) {
        this.alertMessage('warning', '已是最低顺序')
        return
      }
      //按钮节流
      if (!this.btnFlag) {
        this.alertMessage('warning', '请勿重复操作')
        return
      }
      this.btnFlag = false

      let param = {
        id: item.id,
        isUp: isUp
      }
      this.$ajax.put('/api/media/swap', param).then(res => {
        res = res.data
        console.log(res)
        if (res.status === 200) {
          this.getVedioListAjax()
          if (isUp) {
            this.alertMessage('success', '您已成功升序')
          } else {
            this.alertMessage('success', '您已成功降序')
          }
        //   this.btnFlag = true
        }
      })
    },
    /** 
     * 点击上架、下架
     */
    changeShelf(item, isOnshelve) {
      if (item.isOnshelve && isOnshelve) {
        this.alertMessage('warning', '该视频已是上架状态')
        return
      } else if (!item.isOnshelve && !isOnshelve) {
        this.alertMessage('warning', '该视频已是下架状态')
        return
      }
      //按钮节流
      if (!this.btnFlag) {
        this.alertMessage('warning', '请勿重复操作')
        return
      }
      this.btnFlag = false
      let param = {
        id: item.id,
        isOnshelve: isOnshelve
      }
      this.$ajax.put('/api/media/publish', param).then(res => {
        res = res.data
        console.log(res)
        if (res.status === 200) {
          this.getVedioListAjax()
          if (isOnshelve) {
            this.alertMessage('success', '您已成功上架')
          } else {
            this.alertMessage('success', '您已成功下架')
          }
        //   this.btnFlag = true

        }
      })
    },
    /** 
     * 删除当前视频
     */
    deleteVedio(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          id: id
        }
        this.$ajax.delete('/api/media', param).then(res => {
          res = res.data
          console.log(res)
          if (res.status === 200) {
            this.alertMessage('success', '删除成功')
            this.getVedioListAjax()
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
     * 获取视频列表数据
     */
    getVedioListAjax() {
      console.log(this.vedioFrom)
      let that = this
      let param = Object.assign({}, that.vedioFrom, {
        pageNum: that.pageNum,
        pageSize: that.pageSize,
      })
      console.log(param)
      this.$ajax.get('/api/media', param).then(res => {
        res = res.data
        console.log('====================456')
        console.log(res)
        if (res.status === 200) {
          let data = res.data
          console.log(data)
          this.vedioTableData = data.list
          this.total = data.total
          this.btnFlag = true

          if (this.total === 0) {
            this.alertMessage('info', '暂无视频')
          }
        }
      })
    },
    /** 
     * 获取公司名称数组
     */
    getCompanyAjax() {
      let param = {
        keyword: ''
      }
      this.$ajax.get('/api/department/company/list', param).then(res => {
        res = res.data
        console.log('====================123456')
        // console.log(res)
        if (res.status === 200) {
          let data = res.data
          console.log(data)
          this.companyNameArr = data
        }
      })
    }
  },
  created() {
    let myInfo = JSON.parse(localStorage.getItem('myInfo'))
    this.companyId = myInfo.dep.companyId
    setTimeout(() => {
      if (this.companyId < 0) {
        this.notConfig[0].enable = true
        this.notConfig[0].width = 300
        this.isShowCompanyForm = true
      } else {
        this.notConfig[0].enable = false
        this.notConfig[0].width = 1
        this.isShowCompanyForm = false
      }
    }, 100);
    console.log(this.myInfo)
    this.getCompanyAjax()
    if (this.companyId > 0) {
      this.getVedioListAjax()
    }
  }
}
