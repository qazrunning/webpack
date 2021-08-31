const menus = [
  {
    name: "app-hjdemo",
    text: "首页",
    icon: "fa fa-home fa-lg"
  },
  {
    // name: "app-authenticate",
    text: "系统管理",
    icon: "fa fa-cog fa-lg",
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
        icon: "fa fa-cog fa-lg"
      }
    ]
  },
  {
    // name: "app-modules",
    text: "框架内部调试",
    icon: "fa fa-bug fa-lg",
    children: [
      {
        name: "app-loguitest",
        text: "日志组件测试",
        // icon: "fa fa-database fa-lg"
      },
      {
        name: "gis-layout",
        text: "旧界面管理",
        // icon: "fa fa-database fa-lg"
      },
      {
        name: "app-socketio",
      },
      {
        text: "测试KeepAlive",
        name: "app-testalive",
      },
      {
        name: "app-noroute",
        text: "反面教材"
      },
      {
        name: 'app-dragusermanager',
        text: '测试拖拽'
      },
      {
        name: "app-iviewdebug",
        text: 'iview展示'
      }
    ]
  },
  {
    text: "框架组件",
    icon: "fa fa-th-large fa-lg",
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
    text: "场景实践",
    icon: "fa fa-chain-broken fa-lg",
    children: [
      {
        name: "app-testusermanger",
        text: "增删改查"
      },
      {
        name: "app-uploaddemo",
        text: "文件上传"
      },
      {
        name: 'app-testsso',
        text: "单点登录"
      }
    ]
  }
]

module.exports = {
  menus: menus,
  layouts: ["vs"]
}