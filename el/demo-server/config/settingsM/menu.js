module.exports = (app, ctx) => {
  return [
    {
      name: "demo",
      text: "demo",
      children: [
        {
          name: "fdladmin.reportST",
          text: "非道路上报服务地址配置",
        },
        {
          name: "channel.camera",
          text: "摄像头配置"
        },
        {
          name: "lims.szapi",
          text: "深圳项目接口配置",
        },
      ],
    }, {
      text: "其他",
      children: [
        {
          name: "login.page",
          text: "登录页配置"
        },
        {
          name: "core.accountSecurity",
          text: "账户安全设置"
        }
      ]
    }

  ];
};
