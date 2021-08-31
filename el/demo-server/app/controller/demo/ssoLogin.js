

'use strict';

const Controller = require('egg').Controller;



class ssoLogin extends Controller {

    async entry({ ssotoken, path }, { ctx }) {
        //假如密钥和主系统不一样
        //let decoded = ctx.service.core.auth.verify_ssoToken(ssotoken,key);
        //假如密钥和主系统一样
        let decoded = ctx.service.core.auth.verify_ssoToken(ssotoken);
        let { data: { userid } } = decoded;
        if (userid) {//这里可以获取userid     
            //在这里各个系统要实现自己登录授权,比如如果子系统也是我们得框架,那可以这么做
            await ctx.service.core.auth.sign_loginuserid(userid);
            ctx.redirect(`${path}`);
            return;
        }
        return "ssotoken 无效";
    }
}
module.exports = ssoLogin;