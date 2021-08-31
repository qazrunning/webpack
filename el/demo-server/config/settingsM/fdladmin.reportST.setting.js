const path = require('path');
require('colors');

module.exports = app => {


  // let target = path.join(__dirname, setingFilePath);
  const setingFilePath = path.join(path.resolve(), "../cfgs/fdladmin.reportST.setting.json");

 
  return {
    setingFilePath,
    filetype: "json",
    label: '非道路上报服务地址配置',
    async onLoad(cfg) {
      cfg = Object.assign({}, {
        "xzqNum": "440500",
        "province": "广东省",
        "city": "汕头市",
        "interfaceUrl": "https://www-app.gdeei.cn/ydyjgpt/FDJS/",
        "user": "stfd123",
        "pswd": "stfda1236664"
      }, cfg);
      return cfg;
    }
  }


}


