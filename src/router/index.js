import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [{
      path: '/',
      redirect: "/login"
    },
    {
      path: "/login",
      name: "login",
      component: () => import('@/views/login/Login.vue'),
      meta: {
        title: "登录",
        roles: ['login']
      }
    },
    
    {
      path: "/home",
      redirect: "/home/project",
      name: 'home',
      component: () => import('@/views/home/Home.vue'),
      meta: {
        title: "首页",
        roles: ['home'],
        needLogin: false
      },
      children: [{
          path: 'project',
          name: 'project',
          component: () => import('@/views/project-manage/project-list/projectList.vue'),
          meta: {
            title: '项目列表',
            roles: ['项目管理', '项目列表'],
            needLogin: true
          }

        },
        {
          path: 'dropPrepare',
          name: 'dropPrepare',
          component: () => import('@/views/project-manage/dropPrepare-info/dropPrepare.vue'),
          meta: {
            title: '退筹确认',
            roles: ['项目管理', '退筹确认'],
            needLogin: true
          }
        },
        {
          path: 'dropHouse',
          name: 'dropHouse',
          component: () => import('@/views/project-manage/dropHouse-info/dropHouse.vue'),
          meta: {
            title: '退房确认',
            roles: ['项目管理', '退房确认'],
            needLogin: true
          }
        },
        {
          path: 'businessInfo',
          name: 'businessInfo',
          component: () => import('@/views/statement-manage/business-list/businessInfo.vue'),
          meta: {
            title: '顾问报表',
            roles: ['报表管理', '顾问报表'],
            needLogin: true
          }
        },
        {
          path: 'protectInfo',
          name: 'protectInfo',
          component: () => import('@/views/statement-manage/protect-list/protectInfo.vue'),
          meta: {
            title: '维护报表',
            roles: ['报表管理', '维护报表'],
            needLogin: true
          }
        },
        {
          path: 'uPlusInfo',
          name: 'uPlusInfo',
          component: () => import('@/views/statement-manage/uPlus-manage/uPlusInfo.vue'),
          meta: {
            title: '报表管理',
            roles: ['报表管理', 'u+报表'],
            needLogin: true
          }
        },
        {
          path: 'departInfo',
          name: 'departInfo',
          component: () => import('@/views/statement-manage/depart-list/departInfo.vue'),
          meta: {
            title: '报表管理',
            roles: ['报表管理', '部门报表'],
            needLogin: true
          }
        },
        {
          path: 'projectManage',
          name: 'projectManage',
          component: () => import('@/views/statement-manage/project-list/projectManage.vue'),
          meta: {
            title: '报表管理',
            roles: ['报表管理', '项目报表'],
            needLogin: true
          }
        },
        {
          path: 'settleManage',
          name: 'settleManage',
          component: () => import('@/views/statement-manage/settle-manage/settleManage.vue'),
          meta: {
            title: '报表管理',
            roles: ['报表管理', '成交报表'],
            needLogin: true
          }
        },
        {
          path: 'saleManage',
          name: 'saleManage',
          component: () => import('@/views/statement-manage/sale-manage/saleManage.vue'),
          meta: {
            title: '报表管理',
            roles: ['报表管理', '结算报表'],
            needLogin: true
          }
        },
        {
          path: 'uplusSettleManage',
          name: 'uplusSettleManage',
          component: () => import('@/views/statement-manage/uplusSettle-manage/uplusSettleManage.vue'),
          meta: {
            title: '报表管理',
            roles: ['报表管理', 'u+成交报表'],
            needLogin: true
          }
        },
        {
          path: 'uplusSaleManage',
          name: 'uplusSaleManage',
          component: () => import('@/views/statement-manage/uplusSale-manage/uplusSaleManage.vue'),
          meta: {
            title: '报表管理',
            roles: ['报表管理', 'u+结算报表'],
            needLogin: true
          }
        },
        {
          path: 'platformManage',
          name: 'platformManage',
          component: () => import('@/views/statement-manage/platform-manage/platformManage.vue'),
          meta: {
            title: '报表管理',
            roles: ['报表管理', '平台报表'],
            needLogin: true
          }
        },
        {
          path: 'companyState',
          name: 'companyState',
          component: () => import('@/views/statement-manage/company-state/companyState.vue'),
          meta: {
            title: '报表管理',
            roles: ['报表管理', '公司统计报表'],
            needLogin: true
          }
        },
        {
          path: 'contractManage',
          name: 'contractManage',
          component: () => import('@/views/finance-manage/contract-manage/contractManage.vue'),
          meta: {
            title: '合同管理',
            roles: ['财务管理', '合同管理'],
            needLogin: true
          }
        },
        {
          path: 'newGetMoney',
          name: 'newGetMoney',
          component: () => import('@/views/finance-manage/getMoney-new/newGetMoney.vue'),
          meta: {
            title: '新房收款',
            roles: ['财务管理', '新房收款'],
            needLogin: true
          }
        },
        {
          path: 'newGetSettle',
          name: 'newGetSettle',
          component: () => import('@/views/finance-manage/getSettle-new/newGetSettle.vue'),
          meta: {
            title: '新房结算',
            roles: ['财务管理', '新房结算'],
            needLogin: true
          }
        },
        // {
        //   path: 'makeCustomer',
        //   name: 'makeCustomer',
        //   component: () => import('@/views/finance-manage/make-customer/makeCustomer.vue'),
        //   meta: {
        //     title: '成交客户',
        //     roles: ['财务管理', '成交客户'],
        //     needLogin: true
        //   }
        // },
        // {
        //   path: 'checkSale',
        //   name: 'checkSale',
        //   component: () => import('@/views/finance-manage/check-sale/checkSale.vue'),
        //   meta: {
        //     title: '收佣核对',
        //     roles: ['财务管理', '收佣核对'],
        //     needLogin: true
        //   }
        // },
        // {
        //   path: 'checkCommission',
        //   name: 'checkCommission',
        //   component: () => import('@/views/finance-manage/check-commission/checkCommission.vue'),
        //   meta: {
        //     title: '结佣审核',
        //     roles: ['财务管理', '结佣审核'],
        //     needLogin: true
        //   }
        // },
        {
          path: 'getInvoice',
          name: 'getInvoice',
          component: () => import('@/views/finance-manage/getInvoice/getInvoice.vue'),
          meta: {
            title: '开票收佣',
            roles: ['财务管理', '开票收佣'],
            needLogin: true
          }
        },
         {
          path: 'detailedTables',
          name: 'detailedTables',
          component: () => import('@/views/finance-manage/detailedTables/detailedTables.vue'),
          meta: {
            title: '结佣明细表',
            roles: ['财务管理', '结佣明细表'],
            needLogin: true
          }
        },
        {
          path: 'orgFramework',
          name: 'orgFramework',
          component: () => import('@/views/system-setting/org-framework/orgFramework.vue'),
          meta: {
            title: '组织架构',
            roles: ['系统设置', '组织架构'],
            needLogin: true
          }
        },
        {
          path: 'setPermiss',
          name: 'setPermiss',
          component: () => import('@/views/system-setting/org-framework/setPermiss.vue'),
          meta: {
            title: '权限设置',
            roles: ['系统管理员', '权限设置'],
            needLogin: true
          }
        },
        {
          path: 'showAnnounce',
          name: 'showAnnounce',
          component: () => import('@/views/system-setting/announce-manage/showAnnounce.vue'),
          meta: {
            title: '公告详情',
            needLogin: true
            // roles: ['系统管理员', '权限设置']
          }
        },
        {
          path: 'dataDictionary',
          name: 'dataDictionary',
          component: () => import('@/views/system-setting/data-dictionary/dataDictionary.vue'),
          meta: {
            title: '数据字典',
            roles: ['系统设置', '数据字典'],
            needLogin: true
          }
        },
        {
          path: 'bannerManage',
          name: 'bannerManage',
          component: () => import('@/views/system-setting/banner-manage/bannerManage.vue'),
          meta: {
            title: 'banner管理',
            roles: ['系统设置', 'banner管理'],
            needLogin: true
          }
        },
        {
          path: 'videoManage',
          name: 'videoManage',
          component: () => import('@/views/system-setting/video-manage/videoManage.vue'),
          meta: {
            title: 'H5视频管理',
            roles: ['系统设置', 'H5视频管理'],
            needLogin: true
          }
        },
        {
          path: 'announceManage',
          name: 'announceManage',
          component: () => import('@/views/system-setting/announce-manage/announceManage.vue'),
          meta: {
            title: '公告管理',
            roles: ['系统设置', '公告管理'],
            needLogin: true
          }
        },
        {
          path: 'editAvatar',
          name: 'editAvatar',
          component: () => import('@/views/system-setting/edit-avatar/editAvatar.vue'),
          meta: {
            title: '编辑头像',
            roles: ['系统设置', '编辑头像'],
            needLogin: true
          }
        },
        {
          path: 'modifyPhone',
          name: 'modifyPhone',
          component: () => import('@/views/system-setting/modify-phone/modifyPhone.vue'),
          meta: {
            title: '修改电话',
            roles: ['系统设置', '修改电话'],
            needLogin: true
          }
        },
        {
          path: 'exitCompany',
          name: 'exitCompany',
          component: () => import('@/views/system-setting/exit-company/exitCompany.vue'),
          meta: {
            title: '退出企业',
            roles: ['系统设置', '退出企业'],
            needLogin: true
          }
        },
        {
          path: 'operationList',
          name: 'operationList',
          component: () => import('@/views/operation-manage/operationList/operationList.vue'),
          meta: {
            title: '获客列表',
            roles: ['运营管理', '获客列表'],
            needLogin: true
          }
        },
        {
          path: 'operationOnline',
          name: 'operationOnline',
          component: () => import('@/views/operation-manage/operationList/operationOnline.vue'),
          meta: {
            title: '线上获客列表',
            roles: ['运营管理', '线上获客列表'],
            needLogin: true
          }
        },
        {
          path: 'operationOffline',
          name: 'operationOffline',
          component: () => import('@/views/operation-manage/operationList/operationOffline.vue'),
          meta: {
            title: '线下获客列表',
            roles: ['运营管理', '线下获客列表'],
            needLogin: true
          }
        },
        {
          path: 'positionActivity',
          name: 'positionActivity',
          component: () => import('@/views/operation-manage/activityList/positionActivity.vue'),
          meta: {
            title: '吉家活动(固定)',
            roles: ['运营管理', '吉家活动(固定)'],
            needLogin: true
          }
        },
        {
          path: 'customActivity',
          name: 'customActivity',
          component: () => import('@/views/operation-manage/activityList/customActivity.vue'),
          meta: {
            title: '吉家活动(自定义)',
            roles: ['运营管理', '吉家活动(自定义)'],
            needLogin: true
          }
        },
        {
          path: 'uplusCustomer',
          name: 'uplusCustomer',
          component: () => import('@/views/customer-list/u+customer/uplusCustomer.vue'),
          meta: {
            title: 'u+客源列表',
            roles: ['客源管理', 'u+客源列表'],
            needLogin: true
          }
        },
        {
          path: 'channelCustomer',
          name: 'channelCustomer',
          component: () => import('@/views/customer-list/channelCustomer/channelCustomer.vue'),
          meta: {
            title: '渠道客源列表',
            roles: ['客源管理', '渠道客源列表'],
            needLogin: true
          }
        },
        {
          path: 'customerPublic',
          name: 'customerPublic',
          component: () => import('@/views/customer-list/customerPublic/customerPublic.vue'),
          meta: {
            title: '公客池列表',
            roles: ['客源管理', '公客池列表'],
            needLogin: true
          }
        },
        {
          path: 'customerList',
          name: 'customerList',
          component: () => import('@/views/customer-list/customerList.vue'),
          meta: {
            title: '客源列表',
            roles: ['客源管理', '客源列表'],
            needLogin: true
          }
        },
        {
          path: '403errorPage',
          name: '403errorPage',
          component: () => import('@/views/errorPage/403page.vue'),
          meta: {
            title: 403,
            needLogin: false
          }
        },

      ]
    },
    {
      path: '*',
      name: '404errorPage',
      component: () => import('@/views/errorPage/404page.vue'),
      meta: {
        title: 404,
        needLogin: false
      }
    },

    // u+页面
    {
      path: '/passengerSource',
      name: 'passengerSource',
      component: () => import('@/views/passenger-source/passengerSource.vue'),
      meta: {
        needLogin: false
      }
    },


  ]
})
