
'use strict';

const Controller = require('egg').Controller;

const fs = require('fs');
const path = require('path');
//静态文件存储路径
const filesPath = 'documents/filetest';

class upload extends Controller {


  async saveFile({ }, { ctx, userid }) {
    let { Raw } = this.app.Dbs.fx;
    let parts = ctx.multipart();
    let part;

    while ((part = await parts()) != null) {

      if (part.length) {
        let logstr = `---mutipart-form----
        field:${part[0]}
        value:${part[1]}
        valueTruncated:${part[2]}
        fieldnameTruncated:${part[3]}
        `;
        console.log(logstr.green);
      } else {
        if (!part.filename) {
          // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
          // 需要做出处理，例如给出错误提示消息
          return;
        }


        let logstr = `---mutipart-form----
        field:${part.fieldname}
        filename:${part.filename}
        encoding:${part.encoding}
        mime:${part.mime}
        `;
        console.log(logstr.green);



        // let file = {};
        // file.name = part.filename;


        const target = path.join(path.resolve(), `../${filesPath}/${part.filename}`);//文件路径
        global.Helper.File.ensurePath(target);
        await global.Helper.Stream.savefileAsyc(part, target);
      }
    }

    return 'ok';
  }

  async readFile({ }, { ctx, userid }) {
    // let { Raw } = this.app.Dbs.fx;
    // let files = await Raw.QueryList("select F{name,path} from demo_attach where UserID=:UserID", {
    //     replacements: { UserID: userid },
    // })
    let dirName = path.join(path.resolve(), `../${filesPath}`) //把一个路径或路径片段的序列解析为一个绝对路径 (绝对路径下的当前路径)
    global.Helper.File.ensureDir(dirName); // 下载地址

    let files = fs.readdirSync(dirName) //方法将返回一个包含“指定目录下所有文件名称”的数组对象。、
    let result = files.map(p => {
      let fileItemMsg = {
        name: p,
        path: `${filesPath}/${p}`,
        percentage: 100
      }
      fileItemMsg.mtime = fs.statSync(path.join(dirName, p)).mtime,
        fileItemMsg.size = fs.statSync(path.join(dirName, p)).size
      return fileItemMsg
    })
    // files.map(p => {//files只是文件名
    //     fs.stat(path.join(dirName, p), (error, stats) => {

    //     })
    // })

    // result.forEach(item => {
    //     fs.stat(path.join(dirName, item.name), (error, stats) => {
    //         item.stats = stats
    //         console.log(item.stats)
    //     })
    // });
    // console.log(result)
    result.reverse();//倒叙 结合 flex布局flex-direction: column-reverse 实现新上传的文件在第一个
    return result
  }
}
module.exports = upload;