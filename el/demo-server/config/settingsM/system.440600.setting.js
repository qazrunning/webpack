const path = require('path');
require('colors');

module.exports = app => {


  // let target = path.join(__dirname, setingFilePath);
  const setingFilePath = path.join(path.resolve(), "../cfgs/system.440600.setting.json");

 
  return {
    setingFilePath,
    filetype: "json",
    label: '系统配置',
    async onLoad(cfg) {
      cfg = Object.assign({}, {
        "IsLocal":true,//是否检测站端系统
        "ProvinceCode": "440000",
        "CityCode": "440600",
        "CityVlpnProfixCond": "粤",
        "PriCodeCond": "44",
        "GD": "true"
      }, cfg);
      return cfg;
    }
  }


}


