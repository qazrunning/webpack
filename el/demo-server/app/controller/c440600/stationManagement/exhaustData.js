'use strict'

const Controller = require('egg').Controller
class ExhaustDataController extends Controller {
    /**
    * 获取CD字典表数据  例:[{tableName:'字符串',columns:'字符串',where:'字符串'},...]
    * */
    async getCDData({ CDDataList }, { ctx, userid }) {
        const { app } = this;
        try {
            CDDataList = JSON.parse(CDDataList)
            
            const { transaction, Raw } = app.Dbs.hj;
            const result = [];
            for (var i = 0; i < CDDataList.length; i++) {
                const queryString = CDDataList[i].where ? 
                    `select ${CDDataList[i].columns} from ${CDDataList[i].tableName} ${CDDataList[i].where}` :
                    `select ${CDDataList[i].columns} from ${CDDataList[i].tableName}`
                let table = CDDataList[i].tableName.toLowerCase(); // 表名全转为小写
                if (!table.startsWith('cd_') && table != 'area' && table != 'stationinfo') {  // 判断是否为cd表和area,stationinfo
                    const list = await Raw.QueryList(queryString);
                    result.push(list);
                } else {
                    let list;
                    if (table == 'area')
                        list = await app.redis.get('hj').hget('dictionarytable', table);
                    else if (table == 'stationinfo')
                        list = await app.redis.get('hj').hget('basicinformation', table)
                    else {
                        list = await app.redis.get('hj').hget('dictionarytable', table)
                    }
                    if (list) { // 判断是否在redis上获取到数据
                        list = JSON.parse(list);
                        result.push(list);
                    } else { // redis上没有获取到数据就去数据库中查
                        list = await Raw.QueryList(`select ${CDDataList[i].columns} from ${CDDataList[i].tableName} ${CDDataList[i].where}`);
                        result.push(list);
                    }

                }
            }
            return { state: 1, data: result, msg: "查询成功" };
        } catch (error) {
            ctx.logger.error(error);
            return { state: 0, msg: "查询失败" };
        }
    }

    // async getCDDatas({ CDDataList }, { ctx, userid }) {
    //     try{
    //         // console.log(CDDataList);
    //         const { app } = this;
    //         const { transaction, Raw } = app.Dbs.hj;
    //         const result=[];
    //         for(var i = 0; i < CDDataList.length; i++) {
    //             // const list = await Raw.QueryList(`select ${CDDataList[i].columns} from ${CDDataList[i].tableName} ${CDDataList[i].where}`);
    //             const list = await app.redis.get("hj").hget(`${CDDataList[i].key}`, `${CDDataList[i].tableName}`);
    //             result.push(JSON.parse(list));
    //         }
    //       return { state: 1, data: result,msg:"查询成功" };
    //     }catch(error){
    //         ctx.logger.error(error);
    //         return { state: 0, msg:"查询失败" };
    //     }  
    // }


    //判断当前用户是否有该类型的权限(type:权限Key)
    async hasAuthority({ type }, { ctx, userid }) {
        const { app } = this;
        try {
            
            let hasAuthority = false;
            const userList = await app.CoreAPI.Role.getRoleUsers(type);
            if (userid == 'U000001' || userList.indexOf(userid) != -1) hasAuthority = true;
            else hasAuthority = false;
            return { state: 1, hasAuthority: hasAuthority };
        } catch (error) {
            ctx.logger.error(error)
            return { state: 0 }
        }
    }
    // 用于获取权限集合
    async hasAuthoritys({ types }, { ctx, userid }) {
        const { app } = this;
        try {
            
            let len = types.length
            for (let i = 0; i < len; i++) {
                let hasAuthority = false;
                const userList = await app.CoreAPI.Role.getRoleUsers(types[i].key);
                if (userid == 'U000001' || userList.indexOf(userid) != -1) hasAuthority = true;
                else hasAuthority = false;
                types[i].HasAuthority = hasAuthority
            }
            return { state: 1, hasAuthoritys: types };
        } catch (error) {
            ctx.logger.error(error)
            return { state: 0 }
        }
    }
    // 存储area到redis
    async saveAreaRedis({ ctx, userid }) {
        const { app } = this;
        try {
            
            const { transaction, Raw } = app.Dbs.hj;
            let res = await app.redis.get('hj').hget('dictionarytable', 'area');
            if (res)
                return
            let result = await Raw.QueryList('select AreaCode, AreaName, ParentAreaCode, AreaCode as CodeValue, AreaName as CodeName  from area');
            app.redis.get('hj').hset('dictionarytable', 'area', JSON.stringify(result))
            return { state: 1 };
        } catch (error) {
            return { state: 0 }
        }
    }
    // 获取redis的公共方法
    async getRedisData({ redisList }, { ctx, userid }) {
        const { app } = this;
        try {
            redisList = JSON.parse(redisList)
            
            const { transaction, Raw } = app.Dbs.hj;
            const result = [];
            for (var i = 0; i < redisList.length; i++) {
                if (!redisList[i].key) {
                    const list = await app.redis.get(redisList[i].hashTable).hgetall(redisList[i].collection);
                    result.push(list);
                } else {
                    const list = await app.redis.get(redisList[i].hashTable).hget(redisList[i].collection, redisList[i].key);
                    result.push(list);
                }

            }
            return { state: 1, result }
        } catch (error) {
            this.app.CoreAPI.Log.trace('redis' + error);
            return { state: 0 }
        }
    }
}

module.exports = ExhaustDataController