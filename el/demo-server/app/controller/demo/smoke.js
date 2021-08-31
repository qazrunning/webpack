'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');
const path = require('path');


class smokeController extends Controller {


  async submit({ }, { ctx }) {

    let parts = ctx.multipart();
    let part;
    let filename;
    while ((part = await parts()) != null) {
      if (part.length) {
        // console.log('field: ' + part[0]);
        console.log(`key:${part[0]},val:${part[1]}`);

      } else {
        if (!part.filename) {
          // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
          // 需要做出处理，例如给出错误提示消息
          return;
        }
        const target = path.join(path.resolve(), `../upload/${part.filename}`); //文件路径
        global.Helper.File.ensurePath(target); //返回 path 的目录名
        await global.Helper.Stream.savefileAsyc(part, target);

      }
    }


    return { submitId: "123456789" };
  }

}
module.exports = smokeController;