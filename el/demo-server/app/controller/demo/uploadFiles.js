"use strict";

const Controller = require("egg").Controller;
const moment = require("moment");
const fs = require("fs");
const path = require("path");

//静态文件存储路径
const filesPath = "upload/filetest";

class upload extends Controller {
  async saveFile({}, { ctx, userid }) {
    //上传文件
    let { Raw } = this.app.Dbs.fx;
    let parts = ctx.multipart();
    let part;
    let filesize = 0;
    let fileId = await this.app.CoreAPI.Gen.createUID();
    let filename;
    while ((part = await parts()) != null) {
      if (part.length) {
        // console.log('field: ' + part[0]);
        if (part[0] == "filesize") {
          //从客户端传回来的属性
          filesize = part[1];
        }
      } else {
        if (!part.filename) {
          // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
          // 需要做出处理，例如给出错误提示消息
          return;
        }
        filename = part.filename;
        // part 是上传的文件流
        // console.log('field: ' + part.fieldname);
        // console.log('filename: ' + part.filename);
        // console.log('encoding: ' + part.encoding);
        // console.log('mime: ' + part.mime);
        // let file = {};
        // file.name = part.filename;
        //let filePath
        const target = path.join(path.resolve(), `../${filesPath}/${fileId}`); //文件路径
        global.Helper.File.ensurePath(target); //返回 path 的目录名
        await global.Helper.Stream.savefileAsyc(part, target);
      }
    }

    let UploadDt = new Date();
    let FileID = fileId; //返回时间与id 用于前端渲染与下载
    await Raw.Insert("demo_attach", {
      //插入的数据
      FileID,
      UserID: userid,
      RelationID: null,
      FileName: filename,
      UploadDt,
      FileSize: filesize,
      filePath: fileId,
    });

    return JSON.stringify({ UploadDt, FileID });
  }

  async readFile({}, { ctx, userid }) {
    //查询数据库列表 用于渲染前端

    let { app } = this;
    let { transaction, Raw } = app.Dbs.fx;
    let files = await Raw.QueryList("select F{FileID,UserID,RelationID,FileName,UploadDt,FileSize,FilePath} from demo_attach  order  by UploadDt desc"); //查询列表 并按照 时间顺序排列
    return JSON.stringify({ files });
  }
  async download() {
    //下载

    let { ctx, app } = this;
    let { Raw } = this.app.Dbs.fx;
    let fileId = ctx.request.query["fileId"];
    if (!fileId) app.Throw("fileId 不存在");
    let file = await Raw.Query("select F{FileID,UserID,RelationID,FileName,UploadDt,FileSize,FilePath} from demo_attach where FileID=:FileID", {
      replacements: {
        FileID: fileId,
      },
    });
    const target = path.join(path.resolve(), `../${filesPath}/${fileId}`); //文件路径
    ctx.set("Content-Type", "application/octet-stream");
    ctx.set("Content-Length", file.FileSize);
    ctx.response.attachment(file.FileName);
    ctx.status = 200;
    ctx.body = fs.createReadStream(target);
  }
  async checkfile() {
    let { ctx, app } = this;
    let { Raw } = this.app.Dbs.fx;
    let fileId = ctx.request.query["fileId"];

    let file = await Raw.Query("select F{FileID,UserID,RelationID,FileName,UploadDt,FileSize,FilePath} from demo_attach where FileID=:FileID", {
      replacements: {
        FileID: fileId,
      },
    });
    if (file) {
      ctx.response.attachment(file.FileName);
      ctx.status = 200;
      return;
    } else {
      app.Throw("文件 不存在");
    }
  }
}
module.exports = upload;
