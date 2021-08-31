

'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');
const path = require('path')
const fs = require('fs')
class pbtest extends Controller {

  async testRawDB() {
    let { app } = this;
    let { Raw } = app.Dbs.obd;

    await Raw.Update('Driverinfo', { Name: '箫剑', openId: "oqDDr0K-PCGJCB1ow7ROxtr7mKwI" }, {
      wherestr: "where openId=:openId"
    });
  }


  async video() {
    const filePath = path.resolve(path.resolve(), '123.mp4');
    this.ctx.attachment('123.mp4');
    this.ctx.set('Content-Type', 'video/mp4');
    this.ctx.body = fs.createReadStream(filePath);
  }

  async index() {
    let { app } = this;

    // return "fsdfsdf";
    // await app.coreRedis.Delkeys("msg/*");
    // await app.CoreAPI.MQ.restoreAll();
    // return;
    //清空所有消息
    //await app.coreRedis.Delkeys("msg/*");
    // let { Raw } = app.Dbs.fx;

    // let { Raw: RawLims } = app.Dbs.lims;

    // let res1 = await app.CoreAPI.Chat.getChat("demo-11615842801122058241");
    // let lst = await app.CoreAPI.Role.getRoleUsers(["F_leave_xzsp", "F_leave_fgldsp"]);
    // await app.CoreAPI.Role.addRoleUsers("F_leave_xzsp", "U000101");

    let response1 = await new Promise(function (resolve, reject) {
      app.Rpc.get("fx").core.CoreService.sayHello({
        code: 3306,
        message: '22222131'
      }, function (err, response) {
        // callback的 err 是server 来返回的 如果无 null 说明无错误
        if (err != null) {
          console.log("err", err);
          reject(err);
          return;
          // 说明server端没有出现错误 (两段式请求,只能通过 err 来判断)
        }
        // server端给返回的数据 response
        console.log('Greeting:', response);
        resolve(response);
        // console.log(response)
      })
    });
    // let response1 = await new Promise(function (resolve, reject) {
    //   //GRPC 服务接口
    //   app.Rpc.get("fx").core.AccountService.updateUserCache({
    //     userid: 'U000001',
    //     userinfo: ''
    //   }, function (err, response) {
    //     // callback的 err 是server 来返回的 如果无 null 说明无错误
    //     if (err != null) {
    //       console.log("err", err);
    //       reject(err);
    //       return;
    //       // 说明server端没有出现错误 (两段式请求,只能通过 err 来判断)
    //     }
    //     // server端给返回的数据 response
    //     console.log('Greeting:', response);
    //     resolve(response);
    //     // console.log(response)
    //   })
    // });


    return { response1 };


    // let response1 = await new Promise(function (resolve, reject) {
    //   app.Rpc.get("fx").core.CoreService.sayHello({
    //     code: 3306,
    //     message: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    //   }, function (err, response) {
    //     // callback的 err 是server 来返回的 如果无 null 说明无错误
    //     if (err != null) {
    //       console.log("err", err);
    //       reject(err);
    //       return;
    //       // 说明server端没有出现错误 (两段式请求,只能通过 err 来判断)
    //     }
    //     // server端给返回的数据 response
    //     console.log('Greeting:', response);
    //     resolve(response);
    //     // console.log(response)
    //   })
    // });




    // return { response1 };


    //let uuid = await app.CoreAPI.Gen.createUID();

    //let lst = await app.CoreAPI.Role.getRoleUsers("admin");
    // let lstUserGroupR = await Raw.QueryList(`select2 F{GID,UserID,RoleKey} from fx_usergroupr left join fx_group  where UserID=:UserID`);


    // let id = await this.app.coreRedis.incr("tempincr/aa");
    // await this.app.coreRedis.expire("tempincr/aa", 1);
    // return "ok";
  }


  async lookuser() {

    return "lookuser:"+ JSON.stringify(this.ctx.session.user)
  }

  async pbtestsqlbug() {
    let { app, ctx } = this;

    let { Raw } = app.Dbs.fx;

    // app.Throw("围观围观围观", 901)


    let lst;
    await Raw.ExecWithTran(async t => {

      lst = await Raw.QueryList("select * from FX_UserInfo2", {
        transaction: t
      });

    });

    return "fsadfsdf";
  }
}
module.exports = pbtest;