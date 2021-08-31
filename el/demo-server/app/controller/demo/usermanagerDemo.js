'use strict';

const Controller = require('egg').Controller;

class usermanagerDemo extends Controller {

    async index({ }, { ctx, userid }) {
        let { app } = this;
        let { transaction, Raw } = app.Dbs.fx;
        let users = await Raw.QueryList("select F{UserID,EnName,CnName,DPID,Phone} from fx_userinfo  where EnName is not NULL and CnName is not NULL");
        let departments = await Raw.QueryList("SELECT F{DPID,PDPID,DPName,DPName} FROM demo_department");
        return JSON.stringify({ users, departments });
    }

    async get({ id }, { ctx, userid }) {
        let { app } = this;
        let { transaction, Raw } = app.Dbs.fx;
        if (!id) app.Throw("id为空");
        let user = await Raw.Query("select F{UserID,EnName,CnName,Sex,Status,Phone,EMail,CreateTime} from fx_userinfo where UserID=:UserID", {
            replacements: {
                UserID: id
            }
        });


        return JSON.stringify({ user });
    }

    /**
     * @api {post} /demo/usermanager/update
     * @param {*} param0 
     * @param {*} param1 
     */
    async update({ content }, { ctx, userid }) {
        let { app } = this;
        let { transaction, Raw } = app.Dbs.fx;
        let { UserID, ...entity } = JSON.parse(content);
        if (!entity.PWD) Reflect.deleteProperty(entity, "PWD");
        let user = await Raw.Update("fx_userinfo", entity, {
            wherestr: "where UserID=:UserID",
            replacements: { UserID: UserID }
        });
        return "OK";
    }

    async add({ content }, { ctx, userid }) {
        let { app } = this;
        let { transaction, Raw } = app.Dbs.fx;
        let entity = JSON.parse(content);
        return Raw.ExecWithTran(async t => {
            let findobj = await Raw.Query("select F{UserID,CnName} From fx_userinfo where EnName=:EnName", {
                transaction: t,
                replacements: {
                    EnName: entity.EnName
                }
            });
            if (findobj != null) {
                app.Throw("登录名已存在");
            }
            //获取用户的最大值
            let { MAXID } = await Raw.Query("select max(UserID) as 'MAXID' From fx_userinfo", { transaction: t });
            let NextID = MAXID.substr(0, 1) + (parseInt(MAXID.substr(1)) + 1).toString().padStart(6, '0');
            entity.UserID = NextID;
            //插入数据
            entity.CreateTime = new Date();
            await Raw.Insert("fx_userinfo", entity, { transaction: t });
            return JSON.stringify(entity);
        });
    }

    async del({ UserID }, { ctx, userid }) {
        let { app } = this;
        let { transaction, Raw } = app.Dbs.fx;
        // app.Throw("手动报错", 501);
        return Raw.ExecWithTran(async t => {
            let flag = await Raw.Delete("fx_userinfo", {
                wherestr: "where UserID=:UserID",
                replacements: {
                    UserID: UserID
                },
                transaction: t
            });
            return "ok";
        });


    }

    async search({ keyword }, { ctx, userid }) {
        let { app } = this;
        let { transaction, Raw } = app.Dbs.fx;

        let list = await Raw.QueryList("select F{CnName,UserID} From fx_userinfo where CnName like :CnName ", {
            replacements: {
                CnName: `%${keyword}%`
            }
        });
        list = list.map(p => {
            return {
                text: p.CnName,
                path: `/app-testusermanger/${p.UserID}`
            }
        })

        return list;

    }

}

module.exports = usermanagerDemo;
