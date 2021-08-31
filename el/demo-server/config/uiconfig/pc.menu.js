const menus = [
  {
    name: "app-hjdemo",
    text: "首页",
    icon: "fa fa-home fa-lg"
  },
  {
    name: "app-testusermanger",
    text: "增删改查"
  },
  {
    // name: "app-authenticate",
    text: "系统管理",
    icon: "fa fa-lock fa-lg",
    expand: true,
    children: [
      {
        name: "core-privilegeManager",
        text: "权限管理"
      },
      {
        name: "core-userManager",
        text: "用户管理"
      },
      {
        name: "core-systemSetting",
        text: "系统配置",
      }
    ]
  },
  {
    text: "框架组件",
    icon: "fa fa-navicon fa-lg",
    children: [
      {
        name: "app-gridtest",
        text: "框架Grid组件"
      },
      {
        name: "app-coreuserselecttest",
        text: "框架选人组件"
      }
    ]
  },
  {
    // name: "app-demo",
    text: "常用功能",
    icon: "fa fa-navicon fa-lg",
    children: [
      {
        name: "app-uploaddemo",
        text: "文件上传"
      },
      {
        name: 'app-testsso',
        text: "单点登录"
      },
      {
        name: "app-threeColumn",
        iconbg: 'linear-gradient(to right, #1CDFD4 , #1CBFD4)',
        text: "三列表单"
      },
    ]
  }
]

module.exports = {
  menus: menus,
  layouts: ["lr", "top"]
}