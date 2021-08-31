export default [
  // 站点管理
  {
    name:"stationMaintain",
    path:"c440600/stationManagement/stationManagement",
    component:()=> import("../views/c440600/stationManagement/stationManagement")
  },
  // 车辆信息录入
  {
    name:"vehicleManagement",
    path:"c440600/vehicleManagement/vehicleManagement",
    component:()=> import("../views/c440600/vehicleManagement/vehicleManagement")
  },
   //业务审核
  {
    name: 'hj-business-audits',
    path: 'hj-business-audits/:checkid',
    meta: {
        keepAlive: true
    },
    MenuParams: { checkid: 'null' },
    component: () => import('../views/c440600/businessAudits/index.vue')
  },
    //业务审核历史查询
    {
      name: 'hj-audit-search',
      isPublic: true,
      component: () => import('../views/c440600/auditHistorySearch')
  },
   // 资料上传
   {
    name:"datumUpload",
    path:"c440600/datumUpload/datumUpload",
    component:()=> import("../views/c440600/datumUpload/datumUpload")
  },
  // 用户管理
  {
    name:"userManager",
    path:"c440600/userManager/userManager",
    component:()=> import("../views/c440600/userManager/userManager")
  },
  //检测报告
  {
    name:"reportManagement",
    path:"c440600/reportManagement/reportManagement",
    component:()=> import("../views/c440600/reportManagement/reportManagement")
  },
   //维修厂管理
  {
    name:"MaintainFactory",
    path:"c440600/iminfo/MaintainFactory/hainanFactory",
    component:()=> import("../views/c440600/iminfo/MaintainFactory/hainanFactory/index")
  },
  //  //维修厂管理(海南)
  //  {
  //   name:"reportManagement",
  //   path:"c440600/reportManagement/reportManagement",
  //   component:()=> import("../views/c440600/iminfo/MaintainFactory")
  // },
  //  //IM/车辆维修信息(海南)
  //  {
  //   name:"reportManagement",
  //   path:"c440600/reportManagement/reportManagement",
  //   component:()=> import("../views/c440600/iminfo/repairInfoIM/index")
  // },
   //IM/车辆维修信息
   {
    name:"IM-repairInfo",
    path:"c440600/iminfo/repairInfoIM",
    component:()=> import("../views/c440600/iminfo/repairInfoIM/repairinfo")
  },
   //IM检测信息上报
   {
    name:"IM-InfoIM",
    path:"c440600/iminfo/sendInfoToM",
    component:()=> import("../views/c440600/iminfo/sendInfoToM/index")
  },
  //  //IM用户管理(南宁)
  //  {
  //   name:"reportManagement",
  //   path:"c440600/reportManagement/reportManagement",
  //   component:()=> import("../views/c440600/reportManagement/reportManagement")
  // },
  //IM维修复检统计
   {
    name:"IM-fujianInfo",
    path:"c440600/c440600/reportManagement",
    component:()=> import("../views/c440600/reportManagement/reportManagement")
  },
   //IM尾气不合格报告
   {
    name:"IM-noQualifiedReport",
    path:"c440600/c440600/reportManagement",
    component:()=> import("../views/c440600/reportManagement/reportManagement")
  },
  //多检审核修改
  {
    name: 'hj-mutiAuditEdit',
    component: () => import('../views/c440600/mutiAuditEdit'),
    meta: {
        keepAlive: true
    }
  },
  //多受理审核修改
  {
    name: 'hj-mutiAcceptanceAuditEdit',
    component: () => import('../views/c440600/mutiAcceptanceAuditEdit/index.vue'),
    meta: {
        keepAlive: true
    }
  },
  // 受理审核设置
  {
    name: 'hj-acceptAuditSetting',
    component: () => import('../views/c440600/businessSetting/AcceptAuditSetting.vue')
  },
]