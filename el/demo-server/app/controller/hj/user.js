'use strict';

const Controller = require('egg').Controller;

class user extends Controller {
    async add({content,extInfo}) {
        try{
            let {transaction, Raw} = this.app.Dbs.fx;
            let sql=`select * from FX_UserInfo where enname=:EnName`;
            let userInfo=await Raw.QueryList(sql,{replacements: {//参数化执行
                EnName: content.EnName
            }})
            if(userInfo!=null&&userInfo.length>0){
                return this.ctx.helper.error("账号已存在");
            }
            let result = await this.ctx.curl(`http://${this.config.cluster.listen.hostname}:${this.config.cluster.listen.port}/api/core/userManager/add`, {
                method: 'POST',
                headers:{ "Accept": "*/*",
                    "Content-Type":"application/json",
                    "Cookie": `${this.ctx.request.header.cookie}`
                },
                data: {content: JSON.stringify(content)},
                dataType: 'json'
            });
            if(result.status === 200) {
                //insert
                let user = result.data.user;
                //扩展表添加userid
                extInfo['UserID']=user.UserID
                await this.ctx.service.common.userExtService.addUserExt(extInfo);
                return this.ctx.helper.success(result.data);
            }else{
                return this.ctx.helper.error("新增失败");
            }
        } catch (e) {
            return this.ctx.helper.error(e.message);
        }
    }

    async del(content) {
        try{
            let result = await this.ctx.curl(`http://${this.config.cluster.listen.hostname}:${this.config.cluster.listen.port}/api/core/userManager/deleteUser`, {
                method: 'POST',
                headers:{ "Accept": "*/*",
                    "Content-Type":"application/json",
                    "Cookie": `${this.ctx.request.header.cookie}`
                },
                data: content,
                dataType: 'json'
            });

            if(result.status === 200) {
                await this.ctx.service.common.userExtService.delUserExt(content);
                return this.ctx.helper.success("删除成功")
            }else{
                return this.ctx.helper.error("删除失败");
            }
        } catch (e) {
            return this.ctx.helper.error(e.message);
        }
    }

    async update({content, extInfo}) {
        try{
            console.log(content);
            let result = await this.ctx.curl(`http://${this.config.cluster.listen.hostname}:${this.config.cluster.listen.port}/api/core/userManager/update`, {
                method: 'POST',
                headers:{ "Accept": "*/*",
                    "Content-Type":"application/json",
                    "Cookie": `${this.ctx.request.header.cookie}`
                },
                data: {content},
                dataType: 'text'
            });
            console.log("result", result);
            if(result.status === 200) {
                await this.ctx.service.common.userExtService.updateUserExt(extInfo);
                return this.ctx.helper.success("更新成功");
            }else{
                return this.ctx.helper.error("更新失败");
            }

            return result;
        } catch (e) {
            return this.ctx.helper.error(e.message);
        }
    }

    async get() {
        const query = this.ctx.query;
        try{
            let result = await this.ctx.curl(`http://${this.config.cluster.listen.hostname}:${this.config.cluster.listen.port}/api/core/userManager/get?id=${query.id}`, {
                method: 'GET',
                headers:{ "Accept": "*/*",
                    "Content-Type":"application/json",
                    "Cookie": `${this.ctx.request.header.cookie}`
                },
                data: {},
                dataType: 'json'
            });
            console.log(result);
            let user ={}
            if(result.status === 200) {
                user = result.data;
                const extInfo = await this.ctx.service.common.userExtService.getUserExt({userId: query.id});
                console.log(extInfo);
                user.user = Object.assign(user.user, extInfo);
            }

            return user;
        } catch (e) {
            return this.ctx.helper.error(e.message);
        }
    }
}

module.exports = user;
