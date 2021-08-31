//极简布局的菜单
const menus = [
  {
    name: "app-hjdemo",
    text: "门户",
    icon: "fa fa-home fa-lg",
    iconbg: "linear-gradient(to right,#998EFF, #7364FF)",
    description: "门户",
  },
  {
    name: "app-testusermanger",
    iconbg: "linear-gradient(to right, #FEA21E , #FC9107)",
    text: "增删改查",
    icon: "fa fa-pie-chart fa-lg",
  },
  {
    name: "core-modulesNav",
    icon: "fa fa-navicon fa-lg",
    svg: "application",
    text: "菜单",
    children: [
      {
        // name: "app-demo",
        text: "常用功能",
        icon: "fa fa-navicon fa-lg",
        children: [
          {
            name: "core-logManage",
            text: "操作日志",
            icon: "fa fa-file-code-o fa-lg",
          },
        ],
      },
      {
        // name: "app-authenticate",
        text: "系统管理",
        icon: "fa fa-lock fa-lg",
        expand: true,
        children: [
          {
            name: "core-privilegeManager",
            iconbg: "linear-gradient(to right, #1CDFD4 , #1CBFD4)",
            text: "权限管理",
            icon: "fa fa-expeditedssl fa-lg",
          },
          {
            name: "core-userManager",
            iconbg: "linear-gradient(to right, #1CDFD4 , #1CBFD4)",
            text: "用户管理",
            icon: "fa fa-user-plus fa-lg",
          },
          {
            name: "core-roleManager",
            iconbg: "linear-gradient(to right, #1CDFD4 , #1CBFD4)",
            text: "角色管理",
            icon: "fa fa-user-circle-o fa-lg",
          },
          {
            name: "core-systemSetting",
            iconbg: "linear-gradient(to right, #6F6C69 , #5E5B58)",
            text: "系统配置",
            icon: "fa fa-cog fa-lg",
          },
        ],
      },
    ],
  },
];

module.exports = {
  menus: menus,
  layouts: ["pc2"],
};
