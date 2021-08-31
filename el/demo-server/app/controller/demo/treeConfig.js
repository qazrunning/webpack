
'use strict';

const Controller = require('egg').Controller;
const path = require('path');
let yqcodePath = path.join(path.resolve(), "config/stdfld/yqcode.json");

class treeConfig extends Controller {

  async getdata() {
    let { app } = this;
    return app.StdfldSetting.yqcode;
  }

  async savedata({ configjson }) {
    let { app } = this;
    let arr;
    try {
      arr = JSON.parse(configjson);
    } catch (error) {
      app.Throw("不是正确的Json");
    }
    if (!process.env.EGG_DEBUG) {
      global.Helper.File.ensurePath(yqcodePath);
      await global.Helper.File.writefilelAsyc(yqcodePath, configjson);
    }


    app.StdfldSetting.yqcode.splice(0, app.StdfldSetting.yqcode.length);
    Object.assign(app.StdfldSetting.yqcode, arr);
    return "ok";
  }

}

module.exports = treeConfig;