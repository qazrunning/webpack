'use strict';

const Controller = require('egg').Controller;
class testMq extends Controller { 
    async setTestRemind({ msgChannel, msgType, msgTitle }, { ctx, userid }) {
        let { app } = this;
        //清空所有消息
        // await app.coreRedis.Delkeys("msg/*");
        await app.CoreAPI.MQ.pushToUsers(msgChannel, [userid], {
            type: msgType,
            title: msgTitle,
            data: {
                a: 1,
                b: 2
            }
        }); 

        return "ok"
    }

    async grpctest({  }, { ctx, userid }) {
        let { app } = this;
        //清空所有消息
        // await app.coreRedis.Delkeys("msg/*");
          
            let response2 = await new Promise(function (resolve, reject) {
            app.Rpc.clients.get("fx").core.AccountService.updateUserCache(
                {
                    userid:'U000160',
                    userinfo:JSON.stringify(
                        {
                        "EnName": "lijinghao",
                        "CnName": "李京好11111",
                        }
                        )
                },
            function (err, response) {
                // callback的 err 是server 来返回的 如果无 null 说明无错误
                if (err != null) {
                console.log("err", err);
                reject(err);
                return;
                // 说明server端没有出现错误 (两段式请求,只能通过 err 来判断)
                }
                // server端给返回的数据 response
                console.log("Greeting:", response);
                resolve(response);
                // console.log(response)
            }
            );
        });
        ctx.body = response2
        return "ok"
    }

}
module.exports = testMq;