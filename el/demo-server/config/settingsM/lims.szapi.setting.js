const path = require('path');
require('colors');

module.exports = app => {


  return {
    filetype: "json",
    label: '深圳项目接口配置',
    route: "",
    // uiDisplay: {
    //   "userapi": {
    //     uiType: "dict-text",
    //     description: "统一用户接入",
    //   },
    //   "shareldpapi": {
    //     uiType: "dict-text",
    //     description: "排污许可证接入",
    //   },
    //   "isUserLogin": { uiType: 'input-text', description: "检查用户是否登录" },
    //   "ldpbaseinfoapi": { uiType: 'input-text', description: "许可证基本信息" },
    // },

    async onLoad(cfg) {
      cfg = Object.assign({}, {
        "userapi": {
          "isUserLogin": "http://58.250.156.10:50001/secn/login/action/isUserLogin"
        },
        "shareldpapi": {
          "key": "B9F07A0F-B132-4B4A-AFF1-A121164A370B",
          "baseinfoapi": "http://10.253.100.139:50001/sdata/v1/rest/dataShare/consume/dataShareApi/dff71695-7a42-4730-a3c6-c1f4ba494821",
          "gasoutletinfoapi": "http://10.253.100.139:50001/sdata/v1/rest/dataShare/consume/dataShareApi/7505ee5a-c4be-474f-b7a0-a8224ddeb8de",
          "wateroutletinfoapi": "http://10.253.100.139:50001/sdata/v1/rest/dataShare/consume/dataShareApi/5af2852c-ddc5-4a8c-a558-3fd1adac9554"
        }
      }, cfg);
      return cfg
    },
    onSave: async function (ctx, next, { data }) {

      await next();
      await this.reLoad(data);
    }
  }


}


