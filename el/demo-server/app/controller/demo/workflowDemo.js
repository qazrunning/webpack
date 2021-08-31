'use strict';

const Controller = require('egg').Controller;

class workflowDemo extends Controller {

    async del({ ChatID }, { ctx, userid }) {
        let { app } = this;
        let { Raw } = app.Dbs.fx;

        await app.CoreAPI.Chat.delChat(ChatID);

        return "ok";
    }

    async getlist({ }, { ctx, userid }) {
        let { app } = this;
        let listChat = await app.CoreAPI.Chat.getAllChatInfo(userid);
        return JSON.stringify(listChat);
    }

    async test({UserID}) {
        let { app } = this;
        let { Raw } = this;

        let lstUserGroupR = await Raw.QueryList(`select F{GID,UserID,RoleKey} from fx_usergroupr left join fx_group  where UserID=:UserID`,{
            replacements:{
                UserID
            }
        });
      

        let id = await this.app.coreRedis.incr("tempincr/aa");
        await this.app.coreRedis.expire("tempincr/aa", 1);
        return id;
    }
}


module.exports = workflowDemo;