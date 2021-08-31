'use strict';

const Controller = require('egg').Controller;


class testController extends Controller {

  async getData({ }, { ctx, userid }) {
    let { app } = this;
    const noticeAPI = app.notifys.API;
    let channels = await noticeAPI.getUserChannels(userid)
    let data = await noticeAPI.getUserMsgs(userid, channels);
    return data;
  }

  async sendMsg({ Channel, MsgType, MsgTitle, MsgData, ExpireTime, IsTemp, timeout, recUserids, options, t }, { ctx, userid }) {
    let { app } = this;
    let pushobj = { Channel, MsgType, MsgTitle, MsgData, ExpireTime, timeout, recUserids, userid, IsTemp, options };
    let response1;
    response1 = await ctx.service.notify.send(pushobj);
    // const noticeAPI = app.notifys.API;
    // let result = await noticeAPI.push({ Channel, MsgAction, MsgType, MsgTitle, MsgData, ExpireTime, recUserids: [userid], userid, options });
    return response1;
  }

  async cancelMsg({ Channel, MsgType }, { ctx, userid }) {
    let { app } = this;
    let pushobj = { Channel, MsgType };
    let response1 = await ctx.service.notify.cancel(pushobj);
    // const noticeAPI = app.notifys.API;
    // let result = await noticeAPI.push({ Channel, MsgAction, MsgType, MsgTitle, MsgData, ExpireTime, recUserids: [userid], userid, options });
    return response1;

  }

  async setRead({ Channel, MsgID }, { ctx, userid }) {
    let { app } = this;
    let pushobj = { Channel, MsgID, UserID: userid };
    let response1 = await ctx.service.notify.setRead(pushobj);
    // const noticeAPI = app.notifys.API;
    // let result = await noticeAPI.push({ Channel, MsgAction, MsgType, MsgTitle, MsgData, ExpireTime, recUserids: [userid], userid, options });
    return response1;

  }



  async restoreAll() {
    let { app } = this;
    const noticeAPI = app.notifys.API;
    let data = await noticeAPI.restoreAll()
    return { code: 200, data: "success" }
  }


}

module.exports = testController;