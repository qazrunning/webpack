const {Service} = require('egg');
const user = require('../../controller/hj/user');

class UserExtService extends Service {
    async addUserExt(userExtInfo) {
        let {transaction, Raw} = this.app.Dbs.fx;
        await this.delUserExt(userExtInfo);
        let sql=`select COUNT(1) as c from PM_USER_EXT where ESPOrganizationCode=:ESPOrganizationCode`;
        let info=await Raw.Query(sql,{
            replacements:{
                ESPOrganizationCode:userExtInfo.ESPOrganizationCode
            }
        })||{};
        userExtInfo.ESPStationCode=(info.c>9?info.c:('0'+info.c));
        const ret = await Raw.Insert("PM_USER_EXT", userExtInfo);
        return ret;
    }

    async delUserExt(userExtInfo) {
        let {transaction, Raw} = this.app.Dbs.fx;
        return await Raw.Delete("PM_USER_EXT", {
            wherestr: "where UserID=:UserID",//where 条件
            replacements: {//参数化执行
                UserID: `${userExtInfo.UserID}`
            }
        });
    }

    async updateUserExt(userExtInfo) {
        let {transaction, Raw} = this.app.Dbs.fx;
        const ret = await Raw.Update("PM_USER_EXT", userExtInfo, {
            wherestr: "where UserID=:UserID",//where 条件
            replacements: {//参数化执行
                UserID: `${userExtInfo.UserID}`
            }
        });
        return ret;
    }

    async getUserExt(userExtInfo) {
        let {transaction, Raw} = this.app.Dbs.fx;
        return await Raw.Query("SELECT * FROM PM_USER_EXT where UserID=:UserID", {
            replacements: {//参数化执行
                UserID: `${userExtInfo.userId}`
            }
        });
    }
}

module.exports = UserExtService;