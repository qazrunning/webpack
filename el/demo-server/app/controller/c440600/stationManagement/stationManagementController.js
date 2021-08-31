'use strict';
const moment = require('moment');
/**
 * 站点管理
 * */
const Controller = require('egg').Controller;
/**
 * 文件上传、文件操作相关引用
 */
//故名思意 异步二进制 写入流
const awaitWriteStream = require('await-stream-ready').write;
//管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');
//node.js 文件操作对象
const fs = require('fs');
//node.js 路径操作对象
const path = require('path');
const await = require('await-stream-ready/lib/await');

class supervisionCenter extends Controller {
    
    // 外检图图片上传地址
    async getexternalImgIP({ }, { ctx, userid }) {
        try {
            let { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            const IP = await app.redis.get('hj').hget('systemconfig', '01_ExtInpectionPath');
            if (!IP) {
                let res = await Raw.Query("select FieldValue from Sys_Config where FieldKey='ExtInpectionPath' and SysConfigType='01'")
                if (res) IP = res.FieldValue;
            }
            return { state: 1, msg: '获取配置成功', IP }

        } catch (error) {
            return { state: 0, msg: '获取配置失败' }
        }
    }


            //获取系统配置、
	async getSysConfig({ params }, { ctx, userid }) {
		try {
			let { app } = this;
			let { transaction, Raw } = app.Dbs.hj;
			let param = JSON.parse(params);
			const data = await Raw.QueryList(`select * from Sys_Config where FieldKey in (:FieldKey)`, {
				replacements: {
					FieldKey: param.FieldKey
				}
			});
			return { state: 1, data };
		} catch (error) {
			ctx.logger.error(error);
		}
    }
    
    async GetStationScoringIntegral({ StationCode }) {
        try {
          let { app } = this;
          let { transaction, Raw } = app.Dbs.hj;
          const sqls = `select RecordTotalScore from StationScore where StationCode=:StationCode`;
          const data = await Raw.Query(sqls, {
            replacements: { StationCode: StationCode },
          });
          return { state: 1, data, msg: "获取站点剩余积分查询成功！" };
        } catch (error) {
          return { state: 0, msg: "获取站点剩余积分查询失败！" };
        }
      }

      	// 数据可疑性首页从redis获取展示数据
	async getDataAnalysisFromRedis({ countBase }, { ctx, userid }) {
		try {
			const { app } = this;
			const redis = app.redis.get('hj');
			let allData = await redis.hgetall('dataanalysis');
			let data = [];
			// const res = await ctx.service.c440600.stationManagement.commonService.GetUserDetailRole();
			const res = await ctx.service.c440600.stationManagement.commonService.GetAreaRole();
			// console.log(res.data)
			// let area  = []
			// if (res.cityRole.length) {
			// 		area = []	
			// }else{
			// 	if(res.areaRole.length) {
			// 		res.areaRole.forEach(e=>{
			// 			area.push(e.slice(0, 6))
			// 		})
			// 	}else{
			// 		area = []	
			// 	}
			// }
			let area = '';
			let proIndex = res.data.findIndex(v => v.length == 2);
			if (proIndex !== -1) {
				// 省级用户
				area = res.data[proIndex];
			} else {
				let cityIndex = res.data.findIndex(v => v.length == 4);
				if (cityIndex != -1) {
					area = res.data[cityIndex];
				} else {
					let countyIndex = res.data.findIndex(v => v.length == 6);
					area = res.data[countyIndex];
				}
			}

			// 过滤日期获取今年有数据的统计结果
			const year = new Date().getFullYear();
			if (Object.keys(allData).length) {
				for (let key in allData) {
					if (key.indexOf(year) !== -1) {
						let obj = {};
						if (countBase === 'MM') {
							// 按月统计
							let month = parseInt(key.slice(4, 6)) + '月份';
							obj.title = month;
						} else {
							// 按周统计
							let date = key.slice(9);
							let year = date.slice(0, 4);
							let month = date.slice(4, 6);
							let day = date.slice(6);
							obj.title = `${year}-${month}-${day}`;
						}
						obj.statisticData = JSON.parse(allData[key]);
						data.push(obj);
					}
				}
			}
			// 根据日期倒序
			if (data.length) {
				if (countBase === 'MM') {
					data.sort(function (a, b) {
						return parseInt(b.title) - parseInt(a.title);
					})
				} else {
					data.sort(function (a, b) {
						return new Date(b.title) - new Date(a.title);
					})
				}
			}
			let resdata = []
			// if(area.length){
			// 	data.forEach(e=>{
			// 		let arr= []
			// 		e.statisticData.forEach(e=>{
			// 			let value = area.indexOf(e.CountyCode)
			// 			if(value!=-1){
			// 				arr.push(e)
			// 			}
			// 		})
			// 		resdata.push({
			// 			statisticData:arr,
			// 			title : e.title
			// 		})
			// 	})
			// }else{
			// 	resdata = data
			// }
			if (area) {
				data.forEach(e => {
					let arr = []
					e.statisticData.forEach(e => {
						let value = e.CountyCode.indexOf(area)
						if (value == 0) {
							arr.push(e)
						}
					})
					resdata.push({
						statisticData: arr,
						title: e.title
					})
				})
			} else {
				resdata = data
			}
			return { code: 1, msg: '数据获取成功', data: resdata }
		} catch (error) {
			this.app.CoreAPI.Log.trace('getDataAnalysisFromRedis方法报错：' + error);
			return { code: 0, msg: '从redis获取数据可疑性缓存数据失败' };
		}
	}

     //获取用户所在市，区
  async getUserCity({ }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      const res = await ctx.service.c440600.stationManagement.commonService.GetUserDetailRoleNew();
      if (res.provinceRole.length) {
        const province = await Raw.QueryList(
          `select * from Area where AreaCode in (:provinceRole)`,
          {
            replacements: {
              provinceRole: res.provinceRole.map((a) => a.slice(0, 2) + "0000"),
            },
          }
        );
        const city = await Raw.QueryList(
          `select * from Area where ParentAreaCode in (:ParentAreaCode)`,
          {
            replacements: { ParentAreaCode: res.provinceRole },
          }
        );
        const area = await Raw.QueryList(
          `select * from Area where left(ParentAreaCode,2) in (:leftTwoParentCode) and ParentAreaCode not in (:ParentAreaCode)`,
          {
            replacements: {
              leftTwoParentCode: res.provinceRole.map((s) => s.slice(0, 2)),
              ParentAreaCode: res.provinceRole,
            },
          }
        );
        return { province: province, city, area, grade: "1" };
      } else if (res.cityRole.length) {
        const province = await Raw.QueryList(
          `select * from Area where AreaCode in (:provinceRole)`,
          {
            replacements: {
              provinceRole: res.cityRole.map((a) => a.slice(0, 2) + "0000"),
            },
          }
        );
        let pro = res.cityRole[0].slice(0, 2) + "0000";
        const city = await Raw.QueryList(
          `select * from Area where AreaCode like '${res.cityRole[0]}%' and ParentAreaCode='${pro}'`
        );
        const area = await Raw.QueryList(
          `select * from Area where ParentAreaCode like '${res.cityRole[0]}%'   and (memo != '2' or memo is null)`
        );
        return { province, city, area, grade: "2" };
      } else if (res.areaRole.length) {
        const province = await Raw.QueryList(
          `select * from Area where AreaCode in (:AreaCode)`,
          {
            replacements: {
              AreaCode: res.areaRole.map((a) => a.slice(0, 2) + "0000"),
            },
          }
        );
        const city = await Raw.QueryList(
          `select * from Area where AreaCode in (select ParentAreaCode from Area where AreaCode in (:AreaCode))`,
          {
            replacements: {
              AreaCode: res.areaRole,
            },
          }
        );
        const area = await Raw.QueryList(
          `select * from Area where AreaCode in  (:AreaCode)`,
          {
            replacements: {
              AreaCode: res.areaRole,
            },
          }
        );
        return { province, city, area, grade: "3" };
      } else {
        this.app.CoreAPI.Log.trace("省");
        return {
          province: [],
          city: [],
          area: [],
        };
      }
    } catch (error) {
      this.ctx.logger.error(error);
    }
  }

    //点位查询
    async getStationsZD({ }, { ctx, userid }) {
        let { app } = this;
        try {
            let { transaction, Raw } = app.Dbs.hj;
            let where = ``;
            let limitReplace = {};
            let res = await ctx.service.c440600.stationManagement.commonService.GetAreaRole();
            let stationList = await ctx.service.hj.stationService.GetStationRole(); //站点权限过滤
            let areaRole = res.data;
            //判断如果非超级管理员,areaCode为空则retuen
            if (!this.ctx.User.isAdmin && stationList.data.length == 0 && areaRole.length == 0) {
                return JSON.stringify({
                    state: 1,
                    data: { alarmList: [], dataCount: 0, message: 0, alarm_count: 0 }
                });
            } else if (!this.ctx.User.isAdmin && areaRole.length > 0) {
                let limitArr = [];
                areaRole.forEach((areaCode, index) => {
                    limitReplace[`areaRole${index}`] = areaCode + '%';
                    limitArr.push(`StationCode like :areaRole${index}`);
                });
                where += ` and (` + limitArr.join(' or ') + `)`;
            } else if (stationList.state == 1 && stationList.data.length > 0) {
                let data = stationList.data.join(',');
                limitReplace.stationQX = data;
                where += ` and StationCode =:stationQX `;
            }
            const sqles =
                `select  (select AreaName from area where AreaCode=CountyCode) as countyname,
                    * from stationinfo  where CountyCode is not null and PosX is not null and PosY is not null ` + where;
            let result = await Raw.QueryList(sqles, {
                replacements: limitReplace
            });
            return JSON.stringify({ result, state: 1 });
        } catch (err) {
            this.app.CoreAPI.Log.trace('getStationsZD方法报错：' + err);
            return { state: 0, msg: '数据查询失败' };
        }
    }

    async getStationTGL({ }, { ctx, userid }) {
        let { app } = this;
        let { transaction, Raw } = app.Dbs.hj;
        try {
            let where = ` where 1=1`;
            let limitReplace = {};
            let res = await ctx.service.c440600.stationManagement.commonService.GetAreaRole();
            let stationList = await ctx.service.hj.stationService.GetStationRole();
            let areaRole = res.data;
            if (!this.ctx.User.isAdmin && stationList.data.length == 0 && areaRole.length == 0) {
                return JSON.stringify({ data: [], sumData: {}, areaStation: [] });
            } else if (stationList.state == 1 && stationList.data.length > 0) {
                let data = stationList.data.join(',');
                limitReplace.stationQX = data;
                where += ` and StationCode =:stationQX `;
            } else if (!this.ctx.User.isAdmin && areaRole.length > 0) {
                let limitArr = [];
                areaRole.forEach((areaCode, index) => {
                    limitReplace[`areaRole${index}`] = areaCode + '%';
                    limitArr.push(`StationCode like :areaRole${index}`);
                });
                where += ` and (` + limitArr.join(' or ') + `)`;
            }
            const tody = ` and  DateDiff(dd,DetectEndTime,getdate())=0`;
            // let where = `where DateDiff(dd,DetectEndTime,getdate())=0`; //当天的检测数据
            //每个站初检总数、复检总数、多检总数、初检复检多检通过总数,及通过率
            const sqls = `select StationCode,SUM(case when InspectionKind = '99' then 1 else 0 end) as cs,
			SUM(case when InspectionKind!='99' then 1 else 0 end) as zs,
			SUM(case when InspectionNature = '01' and InspectionKind != '99'  then 1 else 0 end) as cj,
			SUM(case when InspectionNature = '02' and InspectionKind != '99'  then 1 else 0 end) as fj,
			SUM(case when InspectionNature = '03' and InspectionKind != '99'  then 1 else 0 end) as dj,
			SUM(case when InspectionNature = '01' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as cj_tg,
			SUM(case when InspectionNature = '02' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as fj_tg,
			SUM(case when InspectionNature = '03' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as dj_tg,
			cast(SUM(case when InspectionNature = '01' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end)*1./nullif(SUM(case when InspectionNature = '01' and InspectionKind != '99'  then 1 else 0 end) ,0)*100  as decimal(5,2)) as cjtgl,
			cast(SUM(case when InspectionNature = '02' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end)*1./nullif(SUM(case when InspectionNature = '02' and InspectionKind != '99'  then 1 else 0 end),0)*100  as decimal(5,2)) as fjtgl,
			cast(SUM(case when InspectionNature = '03' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end)*1./nullif(SUM(case when InspectionNature = '03' and InspectionKind != '99'  then 1 else 0 end),0)*100 as decimal(5,2) )as djtgl 
			from InspectionData  ${where} ${tody}  group by StationCode`;
            //总通过率
            const countSql = `
			select SUM(case when InspectionKind = '99' then 1 else 0 end) as cs,
			SUM(case when InspectionKind!='99' then 1 else 0 end) as zs,
			  SUM(case when InspectionNature = '01' and InspectionKind != '99'  then 1 else 0 end) as cj,
			  SUM(case when InspectionNature = '02' and InspectionKind != '99'  then 1 else 0 end) as fj,
			  SUM(case when InspectionNature = '03' and InspectionKind != '99'  then 1 else 0 end) as dj,
			  SUM(case when InspectionNature = '01' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as cj_tg,
			  SUM(case when InspectionNature = '02' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as fj_tg,
			  SUM(case when InspectionNature = '03' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as dj_tg,
			cast(SUM(case when InspectionNature = '01' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end)*1./nullif(SUM(case when InspectionNature = '01' and InspectionKind != '99'  then 1 else 0 end) ,0)*100  as decimal(5,2)) as cjtgl,
			cast(SUM(case when InspectionNature = '02' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end)*1./nullif(SUM(case when InspectionNature = '01' and InspectionKind != '99'  then 1 else 0 end) ,0)*100  as decimal(5,2)) as fjtgl,
			cast(SUM(case when InspectionNature = '03' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end)*1./nullif(SUM(case when InspectionNature = '01' and InspectionKind != '99'  then 1 else 0 end) ,0)*100  as decimal(5,2)) as djtgl 
			from InspectionData ${where} ${tody}`;
            //行政区域下的站点
            const stationSql = `
			select  (select AreaName from area where AreaCode=CountyCode) as countyname,
			* from stationinfo  ${where} and CountyCode is not null and PosX is not null and PosY is not null `;
            let data = await Raw.QueryList(sqls, { replacements: limitReplace });
            let sumData = await Raw.Query(countSql, { replacements: limitReplace });
            let areaStation = await Raw.QueryList(stationSql, { replacements: limitReplace });
            return JSON.stringify({ data, sumData, areaStation });
        } catch (err) {
            this.app.CoreAPI.Log.trace('getStationTGL方法报错：' + err);
            return { state: 0, msg: '数据查询失败' };
        }
    }

    // 获取站点管理当天的检测统计数据（新）
    async getStationTGLNew({ }, { ctx, userid }) {
        try {
            const { app } = this;
            const { Raw } = app.Dbs.hj;
            const redis = app.redis.get('hj');
            let where = ` where 1=1`;
            let limitReplace = {};
            let res = await ctx.service.c440600.stationManagement.commonService.GetAreaRole();
            let areaRole = res.data;
            if (!this.ctx.User.isAdmin && areaRole.length == 0) {
                return JSON.stringify({ data: [], sumData: {}, areaStation: [] });
            } else if (!this.ctx.User.isAdmin && areaRole.length > 0) {
                let limitArr = [];
                areaRole.forEach((areaCode, index) => {
                    limitReplace[`areaRole${index}`] = areaCode + '%';
                    limitArr.push(`StationCode like :areaRole${index}`);
                });
                where += ` and (` + limitArr.join(' or ') + `)`;
            }
            // 获取当前用户行政区域下的站点信息
            let proRole = [], cityRole = [], countyRole = [];
            let areaStation = [];
            areaRole.forEach(item => {
                switch (item.length) {
                    case 2: proRole.push(item); break;
                    case 4: cityRole.push(item); break;
                    case 6: countyRole.push(item); break;
                    default: break;
                }
            });
            let isStationInfoExist = await redis.exists('stationlist');
            if (isStationInfoExist) {
                if (this.ctx.User.isAdmin || proRole.length > 0) {
                    let allStationInfo = await redis.hgetall('stationlist');
                    for (let key in allStationInfo) {
                        areaStation = [...areaStation, ...JSON.parse(allStationInfo[key])];
                    }
                } else if (!this.ctx.User.isAdmin && cityRole.length > 0) {
                    cityRole.forEach(async item => {
                        item = item + '00';
                        let cityStationList = await redis.hget('stationlist', item);
                        areaStation = [...areaStation, ...JSON.parse(cityStationList)];
                    })
                } else if (!this.ctx.User.isAdmin && countyRole.length > 0) {
                    countyRole.forEach(async item => {
                        let cityCode = item.slice(0, 4) + '00';
                        let cityStationList = await redis.hget('stationlist', cityCode);
                        cityStationList = JSON.parse(cityStationList);
                        let targetStation = cityStationList.filter(station => station.CountyCode === item);
                        areaStation = [...areaStation, ...targetStation];
                    })
                }
            } else {
                // 不存在
                const stationSql = `
                select  (select AreaName from area where AreaCode=CountyCode) as countyname,
                * from stationinfo  ${where} and CountyCode is not null and PosX is not null and PosY is not null `;
                areaStation = await Raw.QueryList(stationSql, { replacements: limitReplace });

                const allStationSql = `
                select  (select AreaName from area where AreaCode=CountyCode) as countyname,
                * from stationinfo where CountyCode is not null and PosX is not null and PosY is not null `;
                let allStation = await Raw.QueryList(allStationSql);
                // 将station数据缓存进库
                let stationList = {};
                allStation.forEach(station => {
                    if (stationList.hasOwnProperty(station.CityCode)) {
                        stationList[station.CityCode].push(station);
                    } else {
                        stationList[station.CityCode] = [];
                        stationList[station.CityCode].push(station);
                    }
                })
                for (let key in stationList) {
                    redis.hset('stationlist', key, JSON.stringify(stationList[key]));
                }
            }

            // 查询Redis是否包含当天的统计数据，如果有，直接查redis的数据
            let now = new Date();
            let timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, 0)}${now.getDate().toString().padStart(2, 0)}`;
            let redisKey = `stationInspection/${timestamp}`;
            let isExist = await redis.exists(redisKey);
            if (isExist) {
                // console.log('查Redis');
                // 存在
                let stationInspectionData = await redis.hgetall(redisKey);
                let data = [];
                // 获取当天所有检测数据，根据用户行政区角色进行过滤
                for (let key in stationInspectionData) {
                    let proCode = key.slice(0, 2);
                    let cityCode = key.slice(0, 4);
                    let countyCode = key.slice(0, 6);
                    if (areaRole.indexOf(proCode) !== -1 || areaRole.indexOf(cityCode) !== -1 || areaRole.indexOf(countyCode) !== -1) {
                        data.push(JSON.parse(stationInspectionData[key]))
                    }
                }
                // 根据过滤后的检测数据数组，计算总通过率
                let sumData = {
                    zs: 0,
                    cs: 0,
                    cj: 0,
                    fj: 0,
                    dj: 0,
                    cj_tg: 0,
                    fj_tg: 0,
                    dj_tg: 0,
                    cjtgl: 0,
                    fjtgl: 0,
                    djtgl: 0,
                    zstgl: 0
                };
                data.forEach(item => {
                    sumData.zs += item.zs;
                    sumData.cs += item.cs;
                    sumData.cj += item.cj;
                    sumData.fj += item.fj;
                    sumData.dj += item.dj;
                    sumData.cj_tg += item.cj_tg;
                    sumData.fj_tg += item.fj_tg;
                    sumData.dj_tg += item.dj_tg;
                });
                sumData.cjtgl = sumData.cj_tg ? ((sumData.cj_tg / sumData.cj) * 100).toFixed(2) : 0;
                sumData.fjtgl = sumData.fj_tg ? ((sumData.fj_tg / sumData.fj) * 100).toFixed(2) : 0;
                sumData.djtgl = sumData.dj_tg ? ((sumData.dj_tg / sumData.dj) * 100).toFixed(2) : 0;
                sumData.zstgl = (sumData.cj_tg + sumData.fj_tg + sumData.dj_tg) ?
                    (((sumData.cj_tg + sumData.fj_tg + sumData.dj_tg) / (sumData.cj + sumData.fj + sumData.dj)) * 100).toFixed(2) : 0;
                return JSON.stringify({ code: 1, data, sumData, areaStation });
            } else {
                // console.log('查库');
                let yesterday = new Date();
                yesterday.setTime(yesterday.getTime() - 24 * 60 * 60 * 1000);
                let oldtimestamp = `${yesterday.getFullYear()}${(yesterday.getMonth() + 1).toString().padStart(2, 0)}${yesterday.getDate().toString().padStart(2, 0)}`;
                await redis.del(`stationInspection/${oldtimestamp}`);
                // 不存在，查数据库，并存入redis
                const tody = ` and  DateDiff(dd,DetectEndTime,getdate()) = 0`;
                // const tody = ` and  DateDiff(dd,DetectStartTime,'2019-11-28') = 0`;
                // let where = `where DateDiff(dd,DetectEndTime,getdate())=0`; //当天的检测数据
                //每个站初检总数、复检总数、多检总数、初检复检多检通过总数,及通过率
                const sqls = `select StationCode,SUM(case when InspectionKind = '99' then 1 else 0 end) as cs,
                SUM(case when InspectionKind!='99' then 1 else 0 end) as zs,
                SUM(case when InspectionNature = '01' and InspectionKind != '99'  then 1 else 0 end) as cj,
                SUM(case when InspectionNature = '02' and InspectionKind != '99'  then 1 else 0 end) as fj,
                SUM(case when InspectionNature = '03' and InspectionKind != '99'  then 1 else 0 end) as dj,
                SUM(case when InspectionNature = '01' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as cj_tg,
                SUM(case when InspectionNature = '02' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as fj_tg,
                SUM(case when InspectionNature = '03' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as dj_tg,
                cast(SUM(case when InspectionNature = '01' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end)*1./nullif(SUM(case when InspectionNature = '01' and InspectionKind != '99'  then 1 else 0 end) ,0)*100  as decimal(5,2)) as cjtgl,
                cast(SUM(case when InspectionNature = '02' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end)*1./nullif(SUM(case when InspectionNature = '02' and InspectionKind != '99'  then 1 else 0 end),0)*100  as decimal(5,2)) as fjtgl,
                cast(SUM(case when InspectionNature = '03' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end)*1./nullif(SUM(case when InspectionNature = '03' and InspectionKind != '99'  then 1 else 0 end),0)*100 as decimal(5,2) )as djtgl 
                from InspectionData  ${where} ${tody}  group by StationCode`;
                //总通过率
                const countSql = `
                select SUM(case when InspectionKind = '99' then 1 else 0 end) as cs,
                SUM(case when InspectionKind!='99' then 1 else 0 end) as zs,
                  SUM(case when InspectionNature = '01' and InspectionKind != '99'  then 1 else 0 end) as cj,
                  SUM(case when InspectionNature = '02' and InspectionKind != '99'  then 1 else 0 end) as fj,
                  SUM(case when InspectionNature = '03' and InspectionKind != '99'  then 1 else 0 end) as dj,
                  SUM(case when InspectionNature = '01' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as cj_tg,
                  SUM(case when InspectionNature = '02' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as fj_tg,
                  SUM(case when InspectionNature = '03' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as dj_tg,
                cast(SUM(case when InspectionNature = '01' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end)*1./nullif(SUM(case when InspectionNature = '01' and InspectionKind != '99'  then 1 else 0 end) ,0)*100  as decimal(5,2)) as cjtgl,
                cast(SUM(case when InspectionNature = '02' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end)*1./nullif(SUM(case when InspectionNature = '01' and InspectionKind != '99'  then 1 else 0 end) ,0)*100  as decimal(5,2)) as fjtgl,
                cast(SUM(case when InspectionNature = '03' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end)*1./nullif(SUM(case when InspectionNature = '01' and InspectionKind != '99'  then 1 else 0 end) ,0)*100  as decimal(5,2)) as djtgl 
                from InspectionData ${where} ${tody}`;
                let data = await Raw.QueryList(sqls, { replacements: limitReplace });
                let sumData = await Raw.Query(countSql, { replacements: limitReplace });
                sumData.zstgl = (sumData.cj_tg + sumData.fj_tg + sumData.dj_tg) ?
                    (((sumData.cj_tg + sumData.fj_tg + sumData.dj_tg) / (sumData.cj + sumData.fj + sumData.dj)) * 100).toFixed(2) : 0;
                // 查询当天主检测表中的所有数据，根据站点统计
                const allDatasql = `select StationCode,SUM(case when InspectionKind = '99' then 1 else 0 end) as cs,
                SUM(case when InspectionKind!='99' then 1 else 0 end) as zs,
                SUM(case when InspectionNature = '01' and InspectionKind != '99'  then 1 else 0 end) as cj,
                SUM(case when InspectionNature = '02' and InspectionKind != '99'  then 1 else 0 end) as fj,
                SUM(case when InspectionNature = '03' and InspectionKind != '99'  then 1 else 0 end) as dj,
                SUM(case when InspectionNature = '01' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as cj_tg,
                SUM(case when InspectionNature = '02' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as fj_tg,
                SUM(case when InspectionNature = '03' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as dj_tg,
                cast(SUM(case when InspectionNature = '01' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end)*1./nullif(SUM(case when InspectionNature = '01' and InspectionKind != '99'  then 1 else 0 end) ,0)*100  as decimal(5,2)) as cjtgl,
                cast(SUM(case when InspectionNature = '02' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end)*1./nullif(SUM(case when InspectionNature = '02' and InspectionKind != '99'  then 1 else 0 end),0)*100  as decimal(5,2)) as fjtgl,
                cast(SUM(case when InspectionNature = '03' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end)*1./nullif(SUM(case when InspectionNature = '03' and InspectionKind != '99'  then 1 else 0 end),0)*100 as decimal(5,2) )as djtgl 
                from InspectionData where DateDiff(dd,DetectEndTime,getdate()) = 0 group by StationCode`;
                let allData = await Raw.QueryList(allDatasql);
                allData.forEach(item => {
                    redis.hset(redisKey, item.StationCode, JSON.stringify(item));
                })
                await redis.expire(redisKey, 86400);
                return JSON.stringify({ code: 1, data, sumData, areaStation });
            }
        } catch (error) {
            this.app.CoreAPI.Log.trace('getStationTGLNew方法报错：' + error);
            return { code: 0, msg: '数据查询失败' };
        }
    }

    // 删除redis中站点管理当天缓存的检测统计数据
    async deleteRedisInspectionData({ }, { ctx, userid }) {
        try {
            const { app } = this;
            const redis = app.redis.get('hj');
            let now = new Date();
            let timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, 0)}${now.getDate().toString().padStart(2, 0)}`;
            let res = await redis.del(`stationInspection/${timestamp}`);
            await redis.del(`stationlist`);
            return { code: 1, msg: '删除成功', res };
        } catch (error) {
            this.app.CoreAPI.Log.trace('deleteRedisInspectionData方法报错：' + error);
            return { code: 0, msg: '删除失败' };
        }
    }

    // 获取站点管理实况页面统计图数据
    async getStationDayInspData({ StationCode, Type }, { ctx, userid }) {
        try {
            const { app } = this;
            const { Raw } = app.Dbs.hj;

            let today = 'DateDiff(dd,DetectEndTime,getdate()) = 0';
            // let today = "DateDiff(dd,DetectStartTime,'2019-11-28') = 0";
            if (Type === 'InspectionType') {
                // 初始化结果数组
                let jczsData = ['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
                let cjData = ['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
                let fjData = ['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
                let djData = ['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
                let hourTotal = await Raw.QueryList(`SELECT SUBSTRING(CONVERT(varchar(100), DetectEndTime, 24), 1, 2) as DetectEndTime,COUNT(1) as value FROM InspectionData 
                where ${today} and StationCode='${StationCode}' GROUP BY SUBSTRING(CONVERT(varchar(100), DetectEndTime, 24), 1, 2)`);
                let inspTypeData = await Raw.QueryList(`select InspectionNature, SUBSTRING(CONVERT(varchar(100), DetectEndTime, 24), 1, 2) as DetectEndTime from InspectionData 
                where ${today} and StationCode='${StationCode}'`)
                hourTotal.forEach(item => {
                    let hour = item.DetectEndTime;
                    let index = jczsData.indexOf(hour);
                    if (index !== -1) {
                        jczsData[index] = item.value;
                    }
                })
                jczsData = jczsData.map(item => typeof item === 'string' ? 0 : item);
                let tempDataObj = {};
                inspTypeData.forEach(item => {
                    let time = item.DetectEndTime;
                    let type = item.InspectionNature;
                    if (!tempDataObj.hasOwnProperty(time)) {
                        tempDataObj[time] = {};
                    }
                    if (tempDataObj[time].hasOwnProperty(type)) {
                        tempDataObj[time][type] += 1;
                    } else {
                        tempDataObj[time][type] = 1;
                    }
                })
                for (let key in tempDataObj) {
                    let index1 = cjData.indexOf(key);
                    let index2 = fjData.indexOf(key);
                    let index3 = djData.indexOf(key);
                    if (index1 !== -1) {
                        cjData[index1] = tempDataObj[key]['01'] || 0;
                    }
                    if (index2 !== -1) {
                        fjData[index2] = tempDataObj[key]['02'] || 0;
                    }
                    if (index3 !== -1) {
                        djData[index3] = tempDataObj[key]['03'] || 0;
                    }
                }
                cjData = cjData.map(item => typeof item === 'string' ? 0 : item);
                fjData = fjData.map(item => typeof item === 'string' ? 0 : item);
                djData = djData.map(item => typeof item === 'string' ? 0 : item);
                return { code: 1, msg: '统计数据获取成功', data: { jczsData, cjData, fjData, djData } };
            } else if (Type === 'FuelType') {
                // 初始化结果数组
                let jcclsData = ['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
                let qiyouData = ['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
                let chaiyouData = ['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
                let qitaData = ['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
                let hourTotal = await Raw.QueryList(`SELECT SUBSTRING(CONVERT(varchar(100), DetectEndTime, 24), 1, 2) as DetectEndTime,COUNT(1) as value FROM InspectionData 
                where ${today} and StationCode='${StationCode}' and InspectionNature='01' GROUP BY SUBSTRING(CONVERT(varchar(100), DetectEndTime, 24), 1, 2)`);
                let fuelTypeData = await Raw.QueryList(`select FuelType, SUBSTRING(CONVERT(varchar(100), DetectEndTime, 24), 1, 2) as DetectEndTime from InspectionData 
                where ${today} and StationCode='${StationCode}' and InspectionNature='01'`)
                hourTotal.forEach(item => {
                    let hour = item.DetectEndTime;
                    let index = jcclsData.indexOf(hour);
                    if (index !== -1) {
                        jcclsData[index] = item.value;
                    }
                })
                jcclsData = jcclsData.map(item => typeof item === 'string' ? 0 : item);
                let tempDataObj = {};
                fuelTypeData.forEach(item => {
                    let time = item.DetectEndTime;
                    let type = item.FuelType;
                    if (!tempDataObj.hasOwnProperty(time)) {
                        tempDataObj[time] = {};
                    }
                    if (tempDataObj[time].hasOwnProperty(type)) {
                        tempDataObj[time][type] += 1;
                    } else {
                        tempDataObj[time][type] = 1;
                    }
                })
                for (let key in tempDataObj) {
                    let index1 = qiyouData.indexOf(key);
                    let index2 = chaiyouData.indexOf(key);
                    let index3 = qitaData.indexOf(key);
                    if (index1 !== -1) {
                        qiyouData[index1] = tempDataObj[key]['A'] || 0;
                    }
                    if (index2 !== -1) {
                        chaiyouData[index2] = tempDataObj[key]['B'] || 0;
                    }
                    if (index3 !== -1) {
                        let sum = 0;
                        for (let item in tempDataObj[key]) {
                            if (item !== 'A' && item !== 'B') sum += tempDataObj[key][item];
                        }
                        qitaData[index3] = sum;
                    }
                }
                qiyouData = qiyouData.map(item => typeof item === 'string' ? 0 : item);
                chaiyouData = chaiyouData.map(item => typeof item === 'string' ? 0 : item);
                qitaData = qitaData.map(item => typeof item === 'string' ? 0 : item);
                return { code: 1, msg: '统计数据获取成功', data: { jcclsData, qiyouData, chaiyouData, qitaData } };
            } else {
                return { code: 0, msg: '获取统计数据类型错误！' };
            }
        } catch (error) {
            this.app.CoreAPI.Log.trace('getStationDayInspData方法报错：' + error);
            return { code: 0, msg: '统计数据获取失败', error };
        }
    }

    // 获取站点管理实况页面左侧检测数据
    async getStationDayCarData({ param }, { ctx, userid }) {
        try {
            const { app } = this;
            const { Raw } = app.Dbs.hj;
            param = JSON.parse(param);
            let today = 'DateDiff(dd,DetectEndTime,getdate()) = 0';
            // let today = "DateDiff(dd,DetectStartTime,'2019-11-28') = 0";
            let { list, total } = await Raw.QueryPageData(`select InspectionDataID,VDCT,StationCode,VehicleID,InspectionNum,VLPN,IUTYPE,InspectionNature,EmissionStandard,AlarmType,SceneCode,DetectEndTime,InspectionReportNo,VLPNColor 
            from InspectionData where StationCode=:StationCode and ${today}`, param.pageNum, param.pageSize, {
                orderstr: "DetectEndTime desc",
                replacements: { StationCode: param.StationCode }
            })
            let sql = {
                A: 'select TSIDataID,EACL,EACR,EACD,LICOL,LICOR,LICOD,LIHCL,LIHCR,LIHCD,HICOL,HICOR,HICOD,HIHCL,HIHCR,HIHCD,TSIED from TSIData where InspectionNum=:InspectionNum',
                B: 'select ASMDataID,HCEL5025,HCER5025,HCED5025,HCEL2540,HCER2540,HCED2540,COEL5025,COER5025,COED5025,COEL2540,COER2540,COED2540,NOEL5025,NOER5025,NOED5025,NOEL2540,NOER2540,NOED2540,ASMED from ASMData where InspectionNum=:InspectionNum',
                C: 'select IMDataID,HCEL,HCER,HCED,COEL,COER,COED,NOXEL,NOXER,NOXED,IMED from IMData where InspectionNum=:InspectionNum',
                F: 'select LightProofSmokeDataID,EL,ER1,ER2,ER3,ERA,ActualRotateSpeed,EngineRatedSpeed,RotateSpeed,RotateSpeedLimit,LPSED from LightProofSmokeData where InspectionNum=:InspectionNum',
                G: 'select LDDataID,MWP,MWPEL,EL,ER100,ER80,NOX80,NOXEL,LDED from LDData where InspectionNum=:InspectionNum',
            }
            let carData = [];
            await Promise.all(getInspectionResult(list));
            carData.sort((a, b) => { return a.RowNum - b.RowNum });
            // 根据检测类型查询对应的检测结果
            function getInspectionResult(list) {
                let promiseArr = list.map(async item => {
                    return new Promise(async function (resolve, reject) {
                        let inspRes = await Raw.Query(sql[item.IUTYPE], {
                            replacements: {
                                InspectionNum: item.InspectionNum
                            }
                        })
                        let temp = Object.assign(item, inspRes);
                        carData.push(temp);
                        let tempArr = carData.filter(v => v.InspectionNum === item.InspectionNum);
                        if (tempArr.length) {
                            resolve()
                        } else {
                            reject();
                        }
                    });
                });
                return promiseArr;
            }
            return { code: 1, msg: '站点车辆检测数据获取成功', data: { total, carData } }
        } catch (error) {
            this.app.CoreAPI.Log.trace('getStationDayCarData方法报错：' + error);
            return { code: 0, msg: '站点车辆检测数据获取失败', error };
        }
    }
    // 获取实况详情页面左侧非工况检测数据
    async getStationDayFKKCarData({ param }, { ctx, userid }) {
        try {
            const { app } = this;
            const { Raw } = app.Dbs.hj;
            param = JSON.parse(param);
            let today = 'DateDiff(dd,DetectEndTime,getdate()) = 0';
            // let today = "DateDiff(dd,DetectStartTime,'2019-11-28') = 0";
            let { list, total } = await Raw.QueryPageData(`select InspectionDataID,VDCT,StationCode,VehicleID,InspectionNum,VLPN,IUTYPE,InspectionNature,EmissionStandard,AlarmType,SceneCode,DetectStartTime,DetectEndTime,InspectionReportNo,VLPNColor 
            from InspectionData where StationCode=:StationCode and IUTYPE in ('A','F') and ${today}`, param.pageNum, param.pageSize, {
                orderstr: "DetectEndTime desc",
                replacements: { StationCode: param.StationCode }
            })
            let carData = []
            await Promise.all(getInspectionResult(list));
            carData.sort((a, b) => { return a.RowNum - b.RowNum });
            // 根据车辆ID查询该车辆最近一次非工况检测结果
            function getInspectionResult(list) {
                let promiseArr = list.map(async item => {
                    return new Promise(async function (resolve, reject) {
                        let DetectStartTime = ctx.helper.dataFormat(new Date(item.DetectStartTime), 'yyyy-MM-dd hh:mm:ss');
                        let inspRes = await Raw.Query(`select top 1 StationCode,DetectStartTime,DetectEndTime,VDCT,IUTYPE
                            from InspectionData where VehicleID=:VehicleID and IUTYPE in ('B','C','G') and DetectStartTime<:DetectStartTime
                            ORDER BY DetectStartTime desc`, {
                            replacements: {
                                VehicleID: item.VehicleID,
                                DetectStartTime: DetectStartTime
                            }
                        })
                        let VehicleInfo = await Raw.Query('select FactoryPlateModel,IUVTYPE,IUETYPE,VehicleID from Vehicle where VehicleID=:VehicleID', {
                            replacements: {
                                VehicleID: item.VehicleID
                            }
                        })
                        let res = null;
                        let VrdateObj = await Raw.Query(`select top 1 Vrdate from Vehicle where VehicleID=${item.VehicleID} and IsInValid = 0`)
                        if (VrdateObj != {}) {
                            res = await Raw.Query(
                                `SELECT top(1) IUTYPE,InspectDoneTimes,InspectRatio,InspectWayType 
                            from T_VEHICLES_ANAlYSE 
                            WHERE FactoryPlateModel=:FactoryPlateModel and IUVTYPE=:IUVTYPE and IUETYPE=:IUETYPE and FILENAME<=:FILENAME 
                            ORDER BY InspectDoneTimes desc, InspectRatio desc`, {
                                replacements: {
                                    FactoryPlateModel: VehicleInfo.FactoryPlateModel, IUVTYPE: VehicleInfo.IUVTYPE, IUETYPE: VehicleInfo.IUETYPE, FILENAME: VrdateObj.Vrdate
                                }
                            })
                        }
                        item.recentGKInsp = inspRes;
                        item.Remark = res;
                        carData.push(item);
                        resolve();
                    });
                });
                return promiseArr;
            }
            return { code: 1, msg: '站点车辆非工况检测数据获取成功', data: { carData, total } };
        } catch (error) {
            this.app.CoreAPI.Log.trace('getStationDayFKKCarData方法报错：' + error);
            return { code: 0, msg: '站点车辆非工况检测数据获取失败', error };
        }
    }

    // 获取站点实况详情页检测方法对应检测数与通过数
    async getStationMethodStatistic({ param }, { ctx, userid }) {
        try {
            const { app } = this;
            const { Raw } = app.Dbs.hj;
            param = JSON.parse(param);
            const where = `where StationCode=:StationCode`;
            const today = ` and  DateDiff(dd,DetectStartTime,getdate())=0`;
            // const today = ` and  DateDiff(dd,DetectStartTime,'2019-11-28')=0`;
            const sql = `select StationCode,
			SUM(case when IUTYPE = 'A' and InspectionKind != '99'  then 1 else 0 end) as tsi,
			SUM(case when IUTYPE = 'B' and InspectionKind != '99'  then 1 else 0 end) as asm,
			SUM(case when IUTYPE = 'C' and InspectionKind != '99'  then 1 else 0 end) as im,
			SUM(case when IUTYPE = 'F' and InspectionKind != '99'  then 1 else 0 end) as lps,
			SUM(case when IUTYPE = 'G' and InspectionKind != '99'  then 1 else 0 end) as ld,
			SUM(case when IUTYPE = 'A' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as tsi_tg,
			SUM(case when IUTYPE = 'B' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as asm_tg,
			SUM(case when IUTYPE = 'C' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as im_tg,
			SUM(case when IUTYPE = 'F' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as lps_tg,
			SUM(case when IUTYPE = 'G' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as ld_tg
            from InspectionData ${where} ${today} GROUP BY StationCode`;
            let data = await Raw.Query(sql, { replacements: { StationCode: param.StationCode } });
            return { code: 1, data, msg: '数据获取成功' };
        } catch (error) {
            this.app.CoreAPI.Log.trace('getStationMethodStatistic方法报错：' + error);
            return { code: 0, msg: '数据获取失败' };
        }
    }

    // 实况首页分组卡片数据
    async getGroupStatisticData({ BusinessID }, { ctx, userid }) {
        try {
            const { app } = this;
            const { Raw } = app.Dbs.hj;
            const redis = app.redis.get('hj');
            if (!BusinessID) return { code: 0, msg: '请求参数为空！' };
            // 初始化结果数据
            const data = {
                cls: 0,
                zs: 0,
                cjtgl: 0,
                fjtgl: 0,
                djtgl: 0,
                cj: 0,
                fj: 0,
                dj: 0,
                cj_tg: 0,
                fj_tg: 0,
                dj_tg: 0
            };
            let now = new Date();
            let timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, 0)}${now.getDate().toString().padStart(2, 0)}`;
            let redisKey = `stationInspection/${timestamp}`;
            let isExist = await redis.exists(redisKey);
            let stationCodeArr = BusinessID.split(',');
            let targetStation = [];
            if (isExist) {
                // 存在
                await Promise.all(getDataFromRedis(stationCodeArr, redisKey));
                // console.log('获取到的结果',targetStation);
            } else {
                const allDatasql = `select StationCode,SUM(case when InspectionKind = '99' then 1 else 0 end) as cs,
                SUM(case when InspectionKind!='99' then 1 else 0 end) as zs,
                SUM(case when InspectionNature = '01' and InspectionKind != '99'  then 1 else 0 end) as cj,
                SUM(case when InspectionNature = '02' and InspectionKind != '99'  then 1 else 0 end) as fj,
                SUM(case when InspectionNature = '03' and InspectionKind != '99'  then 1 else 0 end) as dj,
                SUM(case when InspectionNature = '01' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as cj_tg,
                SUM(case when InspectionNature = '02' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as fj_tg,
                SUM(case when InspectionNature = '03' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end) as dj_tg,
                cast(SUM(case when InspectionNature = '01' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end)*1./nullif(SUM(case when InspectionNature = '01' and InspectionKind != '99'  then 1 else 0 end) ,0)*100  as decimal(5,2)) as cjtgl,
                cast(SUM(case when InspectionNature = '02' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end)*1./nullif(SUM(case when InspectionNature = '02' and InspectionKind != '99'  then 1 else 0 end),0)*100  as decimal(5,2)) as fjtgl,
                cast(SUM(case when InspectionNature = '03' and VDCT=1 and InspectionKind != '99'  then 1 else 0 end)*1./nullif(SUM(case when InspectionNature = '03' and InspectionKind != '99'  then 1 else 0 end),0)*100 as decimal(5,2) )as djtgl 
                from InspectionData where DateDiff(dd,DetectEndTime,getdate()) = 0 group by StationCode`;
                let allData = await Raw.QueryList(allDatasql);
                allData.forEach(item => {
                    redis.hset(redisKey, item.StationCode, JSON.stringify(item));
                })
                await redis.expire(redisKey, 86400);
                targetStation = allData.filter(station => stationCodeArr.indexOf(station.StationCode) !== -1);
            }
            targetStation.forEach(item => {
                data.zs += item.zs;
                data.cls += item.cj;
                data.cj += item.cj;
                data.cj_tg += item.cj_tg;
                data.fj += item.fj;
                data.fj_tg += item.fj_tg;
                data.dj += item.dj;
                data.dj_tg += item.dj_tg;
            })
            data.cjtgl = data.cj_tg ? ((data.cj_tg / data.cj) * 100).toFixed(2) : 0;
            data.fjtgl = data.fj_tg ? ((data.fj_tg / data.fj) * 100).toFixed(2) : 0;
            data.djtgl = data.dj_tg ? ((data.dj_tg / data.dj) * 100).toFixed(2) : 0;
            return { code: 1, msg: '站点实况首页数据获取成功！', data }

            // 获取redis内的指定站点的数据
            function getDataFromRedis(target, redisKey) {
                let promiseArr = target.map(async item => {
                    return new Promise(async function (resolve, reject) {
                        let data = await redis.hget(redisKey, item);
                        if (data) {
                            data = JSON.parse(data);
                            targetStation.push(data);
                        }
                        resolve();
                    });
                });
                return promiseArr;
            }
        } catch (error) {
            this.app.CoreAPI.Log.trace('getGroupStatisticData方法报错：' + error);
            return { code: 0, msg: '站点实况首页数据获取失败！', error };
        }
    }

    // 实况首页分组上传图片
    async uploadAreaImg({ }, { ctx, userid }) {
        try {
            const { app } = this;
            const stream = await this.ctx.getFileStream();
            let AreaGroupData = JSON.parse(stream.fields.AreaGroupData);
            let now = ctx.helper.dataFormat(new Date(), "yyyyMMddhhmmss");
            let imgName = `hj_${AreaGroupData.AreaID}_${now}.jpg`;
            stream.filename = imgName;
            let currpath = path.resolve();
            let targets = path.join(currpath, '../documents/hj/areaStationImg/')
            const files = fs.readdirSync(targets);
            files.forEach(function (item, index) {
                if (item.indexOf(`hj_${AreaGroupData.AreaID}`) !== -1) {
                    fs.unlinkSync(targets + item);
                }
            })
            if (!fs.existsSync(targets)) {
                targets.split(path.sep).reduce((currentPath, folder) => {
                    currentPath += folder + path.sep;
                    if (!fs.existsSync(currentPath)) {
                        fs.mkdirSync(currentPath, { recursive: true });
                    }
                    return currentPath;
                }, "");
            }
            const savepath = path.join(currpath, '../documents/hj/areaStationImg', stream.filename);
            const writeStream = fs.createWriteStream(savepath);
            await awaitWriteStream(stream.pipe(writeStream));
            return {
                code: 1,
                msg: '图片上传成功',
                uploadPath: '/documents/hj/areaStationImg/' + imgName,
            }
        } catch (error) {
            this.app.CoreAPI.Log.trace('uploadAreaImg方法报错：' + error);
            return { code: 0, msg: '站点实况首页图片上传失败！', error };
        }
    }

    // 实况首页分组获取背景图片
    async getAreaImg({ AreaID }, { ctx, userid }) {
        try {
            const { app } = this;
            let imgs = [];
            let currpath = path.resolve();
            let targets = path.join(currpath, '../documents/hj/areaStationImg/')
            const files = fs.readdirSync(targets);
            files.forEach(function (item, index) {
                if (item.indexOf(`hj_${AreaID}`) !== -1) {
                    imgs.push(item)
                }
            })
            let filename = imgs[imgs.length - 1];
            return {
                code: 1,
                ImgPath: '/documents/hj/areaStationImg/' + filename
            }
        } catch (error) {
            this.app.CoreAPI.Log.trace('getAreaImg方法报错：' + error);
            return { code: 0, msg: '站点实况首页图片获取失败！', error };
        }
    }

    //站点管理后台
    async getInspectionRedis({ }, { ctx, userid }) {
        let { app } = this;
        let { transaction, Raw } = app.Dbs.hj;
        try {
            const sqles = ` select StationCode,CheckTime as Time,VLPN,VLPNColor,'检测完成'as state from
              (
              select stationcode,CheckTime,VLPN,VLPNColor, ROW_NUMBER() over(partition by stationcode order by CheckTime desc) as rowNum
              from InspectionData
              ) ranked
              where ranked.rowNum <= 10
              order by ranked.stationcode, ranked.CheckTime desc`;
            let data = await Raw.QueryList(sqles);
            return JSON.stringify({ data });
        } catch (error) {
            return JSON.stringify({ mag: '查询失败', data: '' });
        }
    }

    //获取选中的站点信息
    async getStations({ params }, { ctx, userid }) {
        try {
            params = JSON.parse(params);
            let { StationCode } = params;
            let { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            let where = ``;
            if (StationCode && StationCode != '') where = 'and  StationCode=:StationCode';

            const sqles =
                `select * from stationinfo  where CountyCode is not null and PosX is not null and PosY is not null ` +
                where;
            let data = await Raw.Query(sqles, { replacements: { StationCode } });
            return { state: 1, data: data, msg: '查询成功！' };
        } catch (error) {
            return { state: 0, msg: '获取站点信息失败!' };
        }
    }

    // 站点管理--标定查询
    async GetStationInfo({ params }, { ctx, userid }) {
        params = JSON.parse(params);
        let { stationID, type } = params;
        let { app } = this;
        let { transaction, Raw } = app.Dbs.hj;
        try {
            let qydata = [];
            let cydata = [];
            let hjdata = [];
            if (type == 'qy') {
                qydata = await Raw.QueryList(
                    'select * from V_LineCheckPetrol_StationInfo  where StationCode =:StationCode  and DateDiff(dd,AdjustTimeEnd,getdate())=0  order by AdjustTimeEnd desc --汽油标定',
                    { replacements: { StationCode: stationID } }
                );
            } else if (type == 'cy') {
                cydata = await Raw.QueryList(
                    'select * from  V_LineCheckDiesel_StationInfo   where StationCode =:StationCode and DateDiff(dd,AdjustTimeEnd,getdate())=0 order by AdjustTimeEnd desc --柴油标定',
                    { replacements: { StationCode: stationID } }
                );
            } else {
                hjdata = await Raw.QueryList(
                    'select * from V_EnvParamSensor_StationInfo   where StationCode =:StationCode and DateDiff(dd,CheckTimeEnd,getdate())=0 order by CheckTimeEnd desc --环境参数校准',
                    { replacements: { StationCode: stationID } }
                );
            }
            return JSON.stringify({ qydata, cydata, hjdata });
        } catch (error) {
            return JSON.stringify({ msg: '获取失败！' });
        }
    }

    //获取资质证书图片
    async getStationimg({ stationID }, { ctx, userid }) {
        let { app } = this;
        let { transaction, Raw } = app.Dbs.hj;
        try {
            let ImageData = await Raw.QueryList(
                `select c.CodeValue,c.CodeName,c.Must,u.* from CD_CertificateType c
                left join StationInfo_UploadFile u on c.CodeValue=u.Type and u.StationCode =:StationCode where c.Type=1 ORDER BY c.OrderID asc`,
                {
                    replacements: { StationCode: stationID }
                }
            );
            return { state: 1, msg: '查询成功！', data: ImageData };
        } catch (error) {
            return { state: 0, msg: '获取证件图片失败！' };
        }
    }

    async GetStationIntegral({ StationCode }, { ctx, userid }) {
        try {
            let { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            const sqls = `select * from StationRecordScore where StationCode=:StationCode order by EntryTime desc`;
            const data = await Raw.Query(sqls, {
                replacements: { StationCode: StationCode }
            });
            return { state: 1, data, msg: '获取站点剩余积分查询成功！' };
        } catch (error) {
            return { state: 0, msg: '获取站点剩余积分查询失败！' };
        }
    }

    //添加和编辑站点信息
    async addOrUpdateStation({ StationCode, datalist, IsAdd }, { ctx, userid }) {
        try {
            let { app } = this;
            const { transaction, Raw } = app.Dbs.hj;
            let logParam = {};
            logParam.DataTable = 'StationInfo';
            logParam.Optime = this.ctx.helper.dataFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
            logParam.Operator = this.ctx.User.username;
            // 是否开启摩托车分布式开关
            let IsOpenMotorDistributed = await app.Dbs.hj.Raw.Query(`select FieldValue from sys_config where FieldKey='IsOpenMotorDistributed'`);
            const oldData = Object.assign({}, datalist);
            //第一步,存库
            if (IsAdd) {
                //判断是否已存在该站点编码
                const selStation = await Raw.Query('select * from StationInfo where StationCode=:StationCode ', {
                    replacements: { StationCode: datalist.StationCode }
                });
                if (selStation) return { state: 0, msg: '已存在该站点编码' };

                logParam.DataSource = `新增站点=>站点编码：${datalist.StationCode}`;
                await Raw.Insert('StationInfo', datalist);
                // 日志
                await Raw.Insert('SystemOperactionLog', logParam);
            } else {
                const StationCode = datalist.StationCode;
                // 旧数据
                let oldObj = await Raw.Query('select * from StationInfo where StationCode=:StationCode', {
                    replacements: {
                        StationCode: datalist.StationCode
                    }
                });
                // 处理旧数据时间
                oldObj.RegisterDate = this.ctx.helper.dataFormat(oldObj.RegisterDate, 'yyyy-MM-dd hh:mm:ss');
                oldObj.LinkDate = this.ctx.helper.dataFormat(oldObj.LinkDate, 'yyyy-MM-dd hh:mm:ss');
                // 站点信息有更新时，把上传标志othersyncflag位改为0，syncerror='数据有更新，需重传'，其他同步字段不变
                datalist.OtherSyncflag = 0;
                datalist.SyncError = '数据有更新，需重传';
                delete datalist['StationCode'];
                //筛选出修改的内容
                let filedString = `修改检测站信息:[站点：${oldObj.IUSTA},`;
                Object.keys(datalist).forEach((key) => {
                    if (oldObj && oldObj[key]) {
                        if (datalist[key] != oldObj[key]) {
                            filedString += `${key}:` + oldObj[key] + '=>' + datalist[key] + ';';
                        }
                    }
                });
                logParam.DataSource = filedString + ']'
                await Raw.Update('StationInfo', datalist, {
                    wherestr: 'where StationCode=:StationCode', //where 条件
                    replacements: { StationCode }
                });
                await Raw.Insert('SystemOperactionLog', logParam);
            }
            //第二步,存redis
            // let childRedis = `hj${oldData.StationCode.substr(0, 4)}00`;
            let childRedis = `hj${oldData.CityCode}`;
            let fieldKey = 'stationinfo/' + oldData.StationCode;
            if (app.redis.get(childRedis)) {
                app.redis.get(childRedis).hset('basicinformation', fieldKey, JSON.stringify(oldData));
                let value = {
                    OP: 'HSET',
                    VALUE: JSON.stringify(oldData),
                    STATIONID: StationCode,
                    REDISKEY: 'basicinformation',
                    FIELDKEY: fieldKey
                };
                // app.redis
                //     .get(childRedis)
                //     .hset('informationupdate', `basicinformation@${fieldKey}@${StationCode}`, JSON.stringify(value));
                ctx.service.c440600.stationManagement.commonService.SetInformationUpdate(
                    app,
                    childRedis,
                    `basicinformation@${fieldKey}@${StationCode}`,
                    JSON.stringify(value),
                    IsOpenMotorDistributed.FieldValue
                );
            }
            app.redis.get('hj').hset('basicinformation', fieldKey, JSON.stringify(oldData));
            return { state: 1, msg: '操作成功!' };
        } catch (error) {
            ctx.logger.error(error);
            this.app.CoreAPI.Log.trace('addOrUpdateStation方法报错：' + error);
            return { state: 0, msg: '操作失败!' };
        }
    }

    //获取检测线信息和DVR信息
    async GetLineByStationCode({ stationID }, { ctx, userid }) {
        try {
            let { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            let where = ` where 1=1`;
            if (stationID) where += ' and StationCode =:StationCode';
            const sqles = `select LineInfoID ,SceneCode value,LineType,StationCode,SceneCode label  from LineInfo ${where} order by LineInfoID desc`;
            const sql = `select DVRID value,DVRName label from DVRInfo ${where} order by DVRID desc`;
            let DVRInfo = await Raw.QueryList(sql, {
                replacements: { StationCode: stationID }
            });
            let data = await Raw.QueryList(sqles, {
                replacements: { StationCode: stationID }
            });
            return { state: 1, msg: '查询成功！', data, DVRInfo };
        } catch (error) {
            ctx.logger.error(error);
            return { state: 0, msg: '查询失败！' };
        }
    }

    //获取摄像头信息
    async getstationCameras({ stationID }, { ctx, userid }) {
        try {
            let { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            const sqles = `select * from Cameras where StationCode =:StationCode`;
            let data = await Raw.QueryList(sqles, {
                replacements: { StationCode: stationID }
            });
            return { state: 1, data, msg: '查询成功！' };
        } catch (error) {
            return { state: 0, msg: '查询失败！' };
        }
    }

    //获取检测方法
    async GetInspectionMethod({ stationID }, { ctx, userid }) {
        try {
            let { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            const sqles = `select * from RL_LineInfo_InspectionMethod where StationCode =:StationCode order by ID desc;`;
            // let cddata = await Raw.QueryList('select * from CD_InspectionMethod;');
            let data = await Raw.QueryList(sqles, {
                replacements: { StationCode: stationID }
            });
            return { state: 1, data, msg: '查询成功！' };
        } catch (error) {
            ctx.logger.error(error);
            return { state: 0, msg: '查询失败！' };
        }
    }

    // 站点管理--检测线方法保存
    async SETInspectionMethod({ datalist, StationCode }, { ctx, userid }) {
        try {
            const { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            // 是否开启摩托车分布式开关
            let IsOpenMotorDistributed = await app.Dbs.hj.Raw.Query(`select FieldValue from sys_config where FieldKey='IsOpenMotorDistributed'`);
            let logParam = {};
            logParam.Operator = this.ctx.User.username;
            logParam.Optime = this.ctx.helper.dataFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
            logParam.DataTable = 'RL_LineInfo_InspectionMethod';
            let id = datalist.ID;
            delete datalist._index;
            delete datalist._rowKey;
            // 查询旧数据
            let oldObj = await Raw.Query('select * from RL_LineInfo_InspectionMethod where ID=:ID', {
                replacements: {
                    ID: id
                }
            });
            //筛选出修改的内容
            let filedString = `修改检测线方法:[站点：${oldObj.IUSTA},`;
            Object.keys(datalist).forEach((key) => {
                if (oldObj && oldObj[key]) {
                    if (datalist[key] != oldObj[key]) {
                        if (key == 'ScenCode') {
                            filedString += '线编号：' + oldObj[key] + '=>' + datalist[key] + ';';
                        } else if (key == 'InspectionMethod') {
                            filedString += '检测方法：' + oldObj[key] + '=>' + datalist[key] + ';';
                        } else if (key == 'IsAvailable') {
                            filedString += '是否启动：' + oldObj[key] + '=>' + datalist[key] + ';';
                        }
                    }
                }
            });
            logParam.DataSource = filedString + ']';
            delete datalist.ID;
            await Raw.Update('RL_LineInfo_InspectionMethod', datalist, {
                wherestr: ' where ID=:ID',
                replacements: { ID: id }
            });
            // 记录日志
            await Raw.Insert('SystemOperactionLog', logParam);

            let sql_redis = `select * from RL_LineInfo_InspectionMethod where StationCode=:StationCode `;
            let cont = await Raw.QueryList(sql_redis, {
                replacements: { StationCode }
            });
            let das = JSON.stringify(cont || []);
            let CityInfo = await Raw.Query(`select CityCode from StationInfo where StationCode='${StationCode}'`);
            // let childRedis = `hj${StationCode.substr(0, 4)}00`;
            let childRedis = `hj${CityInfo.CityCode}`;
            let fieldKey = 'rl_lineinfo_inspectionmethod/' + StationCode;
            if (app.redis.get(childRedis)) {
                //更新指定客户端redis
                app.redis.get(childRedis).hset('basicinformation', fieldKey, das);
                let value = {
                    OP: 'HSET',
                    VALUE: das,
                    STATIONID: stationcode,
                    REDISKEY: 'basicinformation',
                    FIELDKEY: fieldKey
                };
                // app.redis
                //     .get(childRedis)
                //     .hset('informationupdate', `basicinformation@${fieldKey}@${StationCode}`, JSON.stringify(value));
                ctx.service.c440600.stationManagement.commonService.SetInformationUpdate(
                    app,
                    childRedis,
                    `basicinformation@${fieldKey}@${StationCode}`,
                    JSON.stringify(value),
                    IsOpenMotorDistributed.FieldValue
                );
            }
            app.redis.get('hj').hset('basicinformation', fieldKey, das);
            return { state: 1, msg: '保存成功！' };
        } catch (error) {
            ctx.logger.error(error);
            return { state: 0, msg: '保存失败！' };
        }
    }

    // 站点管理--检测线方法新增
    async ADDInspectionMethod({ datalist, StationCode }, { ctx, userid }) {
        try {
            const { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            let logParam = {};//修改记录
            logParam.Operator = this.ctx.User.username;
            logParam.Optime = this.ctx.helper.dataFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
            logParam.DataTable = 'RL_LineInfo_InspectionMethod';

            // 是否开启摩托车分布式开关
            let IsOpenMotorDistributed = await app.Dbs.hj.Raw.Query(`select FieldValue from sys_config where FieldKey='IsOpenMotorDistributed'`);
            const sqles = `select IUSTA,CityCode from StationInfo where StationCode =:StationCode`;
            let data = await Raw.Query(sqles, { replacements: { StationCode } });
            datalist.IUSTA = data.IUSTA;
            datalist.CityCode = data.CityCode;
            datalist.IsAvailable = datalist.IsAvailable == null ? 1 : datalist.IsAvailable;
            delete datalist.ID;
            // 新增数据
            await Raw.Insert('RL_LineInfo_InspectionMethod', datalist);
            //  记录日志
            logParam.DataSource = '新增检测线方法：' + `[站点:${datalist.IUSTA},线：${datalist.SceneCode},方法：${datalist.InspectionMethod}]`
            await Raw.Insert('SystemOperactionLog', logParam);
            let sql_redis = `select * from RL_LineInfo_InspectionMethod where StationCode=:StationCode `;
            let cont = await Raw.QueryList(sql_redis, {
                replacements: { StationCode }
            });
            let das = JSON.stringify(cont || []);
            // let childRedis = `hj${StationCode.substr(0, 4)}00`;
            let childRedis = `hj${datalist.CityCode}`;
            let fieldKey = 'rl_lineinfo_inspectionmethod/' + StationCode;
            if (app.redis.get(childRedis)) {
                //更新指定客户端redis
                app.redis.get(childRedis).hset('basicinformation', fieldKey, das);
                let value = {
                    OP: 'HSET',
                    VALUE: das,
                    STATIONID: stationcode,
                    REDISKEY: 'basicinformation',
                    FIELDKEY: fieldKey
                };
                // app.redis
                //     .get(childRedis)
                //     .hset('informationupdate', `basicinformation@${fieldKey}@${StationCode}`, JSON.stringify(value));
                ctx.service.c440600.stationManagement.commonService.SetInformationUpdate(
                    app,
                    childRedis,
                    `basicinformation@${fieldKey}@${StationCode}`,
                    JSON.stringify(value),
                    IsOpenMotorDistributed.FieldValue
                );
            }
            app.redis.get('hj').hset('basicinformation', fieldKey, das);
            return { state: 1, msg: '保存成功！' };
        } catch (error) {
            ctx.logger.error(error);
            return { state: 0, msg: '保存失败！' };
        }
    }

    // 站点管理--自检查询
    async GetselfChecking({ params }, { ctx, userid }) {
        params = JSON.parse(params);
        let { stationID, type } = params;
        let { app } = this;
        let { transaction, Raw } = app.Dbs.hj;
        try {
            let jzdata = [];
            let jydata = [];
            let sdsdata = [];
            let zyjsdata = [];
            let wtdata = [];
            let where = "when '1' then '通过' else '不通过' end";
            if (type == 'wt') {
                wtdata = await Raw.QueryList(
                    `select (case CDT40_Judge ${where} ) as CDT40_JudgeResult,(case CDT25_Judge ${where} ) as CDT25_JudgeResult,
                (case PressureGage_Judge ${where} ) as PressureGage_JudgeResult,(case Low_HC_Judge ${where} ) as Low_HC_JudgeResult,
                (case Low_CO_Judge ${where} ) as Low_CO_JudgeResult,(case Low_NO_Judge ${where} ) as Low_NO_JudgeResult,
                (case ML_HC_Judge ${where} ) as ML_HC_JudgeResult,(case ML_CO_Judge ${where} ) as ML_CO_JudgeResult,
                (case ML_NO_Judge ${where} ) as ML_NO_JudgeResult,(case Medium_HC_Judge ${where} ) as Medium_HC_JudgeResult,
                (case Medium_CO_Judge ${where} ) as Medium_CO_JudgeResult,(case Medium_NO_Judge ${where} ) as Medium_NO_JudgeResult,
                (case MH_HC_Judge ${where} ) as MH_HC_JudgeResult,(case MH_CO_Judge ${where} ) as MH_CO_JudgeResult,
                (case MH_NO_Judge ${where} ) as MH_NO_JudgeResult,(case High_HC_Judge ${where} ) as High_HC_JudgeResult,
                (case High_CO_Judge ${where} ) as High_CO_JudgeResult,(case High_NO_Judge ${where} ) as High_NO_JudgeResult,
                (case N1000_Judge ${where} ) as N1000_JudgeResult,(case N2000_Judge ${where} ) as N2000_JudgeResult,
                (case N3000_Judge ${where} ) as N3000_JudgeResult,(case N4000_Judge ${where} ) as N4000_JudgeResult,
                (case Judge ${where} ) as JudgeResult,* from ASMSelfCheckInfo where StationCode =:StationCode and DateDiff(dd,CheckTimeEnd,getdate())=0 order by CheckTimeEnd desc  --稳态工况分析`,
                    { replacements: { StationCode: stationID } }
                );
            }
            if (type == 'zyjs') {
                zyjsdata = await Raw.QueryList(
                    `select (case N0_Judge ${where} ) as N0JudgeResult,(case N30_Judge ${where} ) as N30JudgeResult,
                (case N50_Judge ${where} ) as N50JudgeResult,(case N70_Judge ${where} ) as N70JudgeResult,
                (case N90_Judge ${where} ) as N90JudgeResult,(case N100_Judge ${where} ) as N100JudgeResult,
                (case N1500_Judge ${where} ) as N1500JudgeResult,(case N2000_Judge ${where} ) as N2000JudgeResult,
                (case Judge ${where} ) as JudgeResult,* from LightProofSmokeSelfCheckInfo where StationCode =:StationCode and DateDiff(dd,CheckTimeEnd,getdate())=0
                 order by CheckTimeEnd desc --自由加速自检`,
                    { replacements: { StationCode: stationID } }
                );
            }
            if (type == 'jyst') {
                jydata = await Raw.QueryList(
                    `select  (case CDT40_Judge ${where} ) as CDT40_JudgeResult,
                (case CDT25_Judge ${where} ) as CDT25_JudgeResult,(case PressureGage_Judge ${where} ) as PressureGage_JudgeResult,
                (case Low_HC_Judge ${where} ) as Low_HC_JudgeResult,(case Low_CO_Judge ${where} ) as Low_CO_JudgeResult,
                (case Low_NO_Judge ${where} ) as Low_NO_JudgeResult,(case ML_HC_Judge ${where} ) as ML_HC_JudgeResult,
                (case ML_CO_Judge ${where} ) as ML_CO_JudgeResult,(case ML_NO_Judge ${where} ) as ML_NO_JudgeResult,
                (case Medium_HC_Judge ${where} ) as Medium_HC_JudgeResult,(case Medium_CO_Judge ${where} ) as Medium_CO_JudgeResult,
                (case Medium_NO_Judge ${where} ) as Medium_NO_JudgeResult,(case MH_HC_Judge ${where} ) as MH_HC_JudgeResult,
                (case MH_CO_Judge ${where} ) as MH_CO_JudgeResult,(case MH_NO_Judge ${where} ) as MH_NO_JudgeResult,
                (case High_HC_Judge ${where} ) as High_HC_JudgeResult,(case High_CO_Judge ${where} ) as High_CO_JudgeResult,
                (case High_NO_Judge ${where} ) as High_NO_JudgeResult,(case FGA_Judge_O2 ${where} ) as FGA_Judge_O2Result,
                (case Flowmeter_Judge_O2 ${where} ) as Flowmeter_Judge_O2Result,(case N1000_Judge ${where} ) as N1000_JudgeResult,
                (case N2000_Judge ${where} ) as N2000_JudgeResult,(case N3000_Judge ${where} ) as N3000_JudgeResult,
                (case N4000_Judge ${where} ) as N4000_JudgeResult,(case Judge ${where} ) as JudgeResult,
                * from IMSelfCheckInfo where StationCode =:StationCode and DateDiff(dd,CheckTimeEnd,getdate())=0 order by CheckTimeEnd desc  --简易瞬态自检`,
                    { replacements: { StationCode: stationID } }
                );
            }
            if (type == 'jzjs') {
                jzdata = await Raw.QueryList(
                    `select  (case PressureGage_Judge ${where} ) as PressureGageJudge,
                (case N50_Judge ${where} ) as N50JudgeResult,(case N30_Judge ${where} ) as N30JudgeResult,
                (case N70_Judge ${where} ) as N70JudgeResult,(case N1000_Judge ${where} ) as N1000JudgeResult,
                (case N2000_Judge ${where} ) as N2000JudgeResult,(case N3000_Judge ${where} ) as N3000JudgeResult,
                (case N4000_Judge ${where} ) as N4000JudgeResult,(case Judge ${where} ) as JudgeResult,
                * from LDSelfCheckInfo where StationCode =:StationCode and DateDiff(dd,CheckTimeEnd,getdate())=0  order by CheckTimeEnd desc --加载减速自检`,
                    { replacements: { StationCode: stationID } }
                );
            }
            if (type == 'sds') {
                sdsdata = await Raw.QueryList(
                    `select (case Low_HC_Judge ${where} ) as Low_HC_JudgeResult,
                (case Low_CO_Judge ${where} ) as Low_CO_JudgeResult,(case ML_HC_Judge ${where} ) as ML_HC_JudgeResult,
                (case ML_CO_Judge ${where} ) as ML_CO_JudgeResult,(case Medium_HC_Judge ${where} ) as Medium_HC_JudgeResult,
                (case Medium_CO_Judge ${where} ) as Medium_CO_JudgeResult,(case MH_HC_Judge ${where} ) as MH_HC_JudgeResult,
                (case MH_CO_Judge ${where} ) as MH_CO_JudgeResult,(case High_HC_Judge ${where} ) as High_HC_JudgeResult,
                (case High_CO_Judge ${where} ) as High_CO_JudgeResult,(case N1000_Judge ${where} ) as N1000_JudgeResult,
                (case N2000_Judge ${where} ) as N2000_JudgeResult,(case N3000_Judge ${where} ) as N3000_JudgeResult,
                (case N4000_Judge ${where} ) as N4000_JudgeResult,(case Judge ${where} ) as JudgeResult,
                * from TSISelfCheckInfo where StationCode =:StationCode and DateDiff(dd,CheckTimeEnd,getdate())=0 order by CheckTimeEnd desc --双怠速自检`,
                    { replacements: { StationCode: stationID } }
                );
            }
            return JSON.stringify({ jzdata, jydata, sdsdata, zyjsdata, wtdata });
        } catch (error) {
            ctx.logger.error(error);
            return JSON.stringify({ msg: '获取失败！' });
        }
    }

    // 站点管理--汽车检查查询
    async GetcarfChecking({ params }, { ctx, userid }) {
        try {
            params = JSON.parse(params);
            let { stationID, value } = params;
            let { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            const result =
                value == 'DeviceCheckWXBY'
                    ? await Raw.QueryList(
                        `select * from ${value} where StationCode =:station and DateDiff(dd,MaintenanceDate,getdate())=0  order by MaintenanceDate desc`,
                        { replacements: { station: stationID } }
                    )
                    : await Raw.QueryList(
                        `select * from ${value} where StationCode =:station and DateDiff(dd,CheckDate,getdate())=0  order by CheckDate desc`,
                        { replacements: { station: stationID } }
                    );
            return JSON.stringify({ result, msg: '获取成功！' });
        } catch (error) {
            this.ctx.logger.error(error);
            return JSON.stringify({ msg: '获取失败！' });
        }
    }

    // 站点管理--检测线查询
    async getstationLine({ StationCode }, { ctx, userid }) {
        try {
            let { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            StationCode = JSON.parse(StationCode)
            let data = [];
            let Line = [];
            if (StationCode.length) {
                const sqles = `select v.* from LineInfo v   where v.StationCode in (:StationCode)`;
                data = await Raw.QueryList(sqles, { replacements: { StationCode } });
                Line = await Raw.QueryList(
                    `select  SceneCode from InspectionData where StationCode in (:StationCode) group by SceneCode`,
                    { replacements: { StationCode } }
                );
            }

            return { state: 1, msg: '获取检测线信息成功！', data, Line };
        } catch (error) {
            ctx.logger.error(error);
            return { state: 0, msg: '获取检测线信息失败！' };
        }
    }

    // 站点管理--硬盘录像机查询
    async GetDVRInfo({ stationID }, { ctx, userid }) {
        try {
            let { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            const sqles = `select * from DVRInfo where StationCode =:StationCode`;
            let data = await Raw.QueryList(sqles, {
                replacements: { StationCode: stationID }
            });
            return { state: 1, data, msg: '查询成功！' };
        } catch (error) {
            ctx.logger.error(error);
            return { state: 0, msg: '查询失败！' };
        }
    }

    // 站点管理--设备信息查询
    async GetStationDevice({ stationID }, { ctx, userid }) {
        try {
            let { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            const sqles = `select * from StationDevice where StationCode =:StationCode order by CalValidityPeriod asc`;
            let data = await Raw.QueryList(sqles, {
                replacements: { StationCode: stationID }
            });
            return { state: 1, data, msg: '获取设备信息成功！' };
        } catch (error) {
            ctx.logger.error(error);
            return { state: 0, msg: '获取设备信息失败！' };
        }
    }
    // 站点管理-检测人员检测量
    async getStaffSum({params}, { }) {
        const { app } = this;
        const { Raw } = app.Dbs.hj;
        try {
            params=JSON.parse(params)
            let where = `where DetectEndTime>=:from and DetectEndTime<=:to and StationCode=:StationCode `;
            let reqParam = {
                to:params.to,
                from:params.from,
                StationCode:params.StationCode
            };
            if (params.staff) {  
                where += `and InspectionOperator like :InspectionOperator`;
                reqParam.InspectionOperator = '%'+ params.staff+'%';
            }
   
            
            let res = await Raw.QueryPageData(`select count(*) as total, InspectionOperator from inspectiondata ${where} group by InspectionOperator`
            ,params.pageIndex,params.pageSize,{
                orderstr: "total desc",
                replacements:reqParam
            });
            return JSON.stringify({ code: 1, data:res,msg:"查询成功" })
        } catch (error) {
            this.app.CoreAPI.Log.trace("getStaffSum报错" + error);
            return JSON.stringify({ code: 0, msg: '查询失败' });
        }
    }
    // 站点管理--检测人员信息
    async GetStationStaff({ params }, { ctx, userid }) {
        try {
            params = JSON.parse(params);
            let { StationCode, ID } = params;
            const { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            let where = '';
            if (ID) where += ' and ID=:ID';
            let data = await Raw.QueryList(
                `select * from StationStaff where StationCode =:StationCode ${where} order by ID desc `,
                { replacements: { StationCode, ID } }
            );
            data.forEach((e) => {
                if (e.IsAuthorizedSignature == '1') {
                    e.IsAuthorizedSignature = true;
                } else {
                    e.IsAuthorizedSignature = false;
                }
                if (e.IsCertifier == '1') {
                    e.IsCertifier = true;
                } else {
                    e.IsCertifier = false;
                }
            });

            return { state: 1, data, msg: '查询成功!' };
        } catch (error) {
            return { state: 0, msg: '查询失败！' };
        }
    }

    //站点管理-检测人员图片
    async getStaffimg({ StationStaffID }, { ctx, userid }) {
        try {
            const { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            let where = '';
            const data = await Raw.QueryList(
                `select c.CodeValue,c.CodeName,c.Must,u.* from CD_CertificateType c
             left join StationStaff_UploadFile u on c.CodeValue=u.Type and u.StationStaffID=:StationStaffID
             where c.Type=2 ORDER BY c.OrderID asc`,
                { replacements: { StationStaffID } }
            );
            return { state: 1, data, msg: '查询成功!' };
        } catch (error) {
            return { state: 0, msg: '查询失败！' };
        }
    }

    // 站点管理--设备信息查询图片
    async getDeviceimg({ StationDeviceID }, { ctx, userid }) {
        let { app } = this;
        let { transaction, Raw } = app.Dbs.hj;
        try {
            let data = await Raw.QueryList(
                `select c.CodeValue,c.CodeName,c.Must,u.* from CD_CertificateType c
                left join StationDeviceInfo_UploadFile u on c.CodeValue=u.Type and u.StationDeviceID=:StationDeviceID
                where c.Type=3 ORDER BY c.OrderID asc`,
                {
                    replacements: { StationDeviceID }
                }
            );
            return { state: 1, data, msg: '查询成功!' };
        } catch (error) {
            return { state: 0, data, msg: '查询失败!' };
        }
    }

    //站点详情——燃油类型统计
    async getStationFuelType({ params }, { ctx, userid }) {
        let { app } = this;
        let { transaction, Raw } = app.Dbs.hj;
        let where = '';
        where = ` and DateDiff(dd,DetectEndTime,getdate())=0`;
        try {
            let lst = await Raw.QueryList(
                `select (select CodeName from CD_FuelType where CodeValue = FuelType) as name,
                            count(1) as value from InspectionData where StationCode=:StationCode and FuelType is not null ` +
                where +
                `  group by FuelType `,
                {
                    replacements: { StationCode: params }
                }
            );
            return { data: lst };
        } catch (error) {
            return '获取数据失败！';
        }
    }

    //站点管理--检测线详细
    async getLineInfo({ params }, { }) {
        try {
            let { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            let { StationCode, SceneCode } = JSON.parse(params)
            let where = ` and StationCode=:StationCode and SceneCode=:SceneCode`, orderwhere = ` order by AdjustTimeEnd desc`;
            let sql =
                `SELECT top(1) 
                    StationCode,
                    SceneCode,
                    ( CASE HCED WHEN '1' THEN '合格' ELSE '不合格' END ) AS 'HC_result',
                    ( CASE COED WHEN '1' THEN '合格' ELSE '不合格' END ) AS 'CO_result',
                    ( CASE NOED WHEN '1' THEN '合格' ELSE '不合格' END ) AS 'NO_result',
                    ( CASE CO2ED WHEN '1' THEN '合格' ELSE '不合格' END ) AS 'CO2_result',
                    ( CASE O2ED WHEN '1' THEN '合格' ELSE '不合格' END ) AS 'O2_result',
                    AdjustTimeEnd 
                FROM
                    LineCheckPetrol
                where 1=1${where}${orderwhere}`;
            let resultData = await Raw.QueryList(sql, {
                replacements: {
                    StationCode,
                    SceneCode
                }
            })
            return {
                msg: '数据请求成功',
                state: 1,
                resultData
            }
        } catch (error) {
            this.app.CoreAPI.Log.trace('getLineInfo方法报错：' + error);
            return { state: 0, msg: '保存失败！' };
        }
    }
    //站点管理--检测线详细--检测结果接口
    async getLineDetectonResult({ params }, { }) {
        try {
            let { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            let { StationCode, SceneCode } = JSON.parse(params);
            // 查找某个站某条线所有的方法
            let methodSql = `select distinct inspectionMethod from RL_LineInfo_InspectionMethod where StationCode='${StationCode}' and SceneCode='${SceneCode}' and IsAvailable !=0`
            let methodResults = await Raw.QueryList(methodSql);
            // 通过方法从主检测表查找inspectionNum
            let result = [], i = 0, len = methodResults.length;
            for (i; i < len; i++) {
                // 通过每个方法拿到最新五条数据的inspectionNum
                let inspectionNumSql = `select top 5 inspectionNum from inspectionData where IUTYPE='${methodResults[i].inspectionMethod}' order by DetectEndTime DESC`;
                let inspectionNumObjs = await Raw.QueryList(inspectionNumSql);
                let inspectionNums = inspectionNumObjs.map(item => {
                    return item.inspectionNum
                })
                // 通过inspectionNum查找对应的数据
                let inspectionMethodValue = methodResults[i].inspectionMethod
                let resultSql = ``
                switch (inspectionMethodValue) {
                    case "A":
                        resultSql = `select InspectionNum,DetectEndTime,EACR,EACL,LICOR,LICOL,LIHCR,HICOR,HICOL,HIHCR,HIHCL,TSIED from TSIData where inspectionNum in (:inspectionNum) order by DetectEndTime desc`;
                        break;
                    case "B":
                        resultSql = `select InspectionNum,DetectEndTime,HCEL5025,HCER5025,COEL5025,COER5025,NOEL5025,NOER5025,HCEL2540,HCER2540,COEL2540,COER2540,NOEL2540,NOER2540,ASMED from ASMData where inspectionNum in (:inspectionNum) order by DetectEndTime desc`;
                        break;
                    case "C":
                        resultSql = `select InspectionNum,DetectEndTime,HCER,HCEL,COER,COEL,NOXER,NOXEL,IMED from IMData where inspectionNum in (:inspectionNum) order by DetectEndTime desc`;
                        break;
                    case "G":
                        resultSql = `select InspectionNum,DetectEndTime,EngineRatedSpeed,VelMaxHP,VelMaxEnginePower,ER100,EL,ER80,NOX80,NOXEL,LDED from LDData where inspectionNum in (:inspectionNum) order by DetectEndTime desc`;
                        break;
                    case "F":
                        resultSql = `select InspectionNum,DetectEndTime,EngineRatedSpeed,ActualRotateSpeed,ER1,ER2,ER3,ERA,EL,LPSED from LightProofSmokeData where inspectionNum in (:inspectionNum) order by DetectEndTime desc`;
                        break;
                }
                let resultList = await Raw.QueryList(resultSql, {
                    replacements: {
                        inspectionNum: inspectionNums
                    }
                })
                let resultObj = {}
                resultObj.type = inspectionMethodValue
                resultObj.data = resultList
                result.push(resultObj)
            }
            return {
                state: 1,
                msg: '数据获取成功',
                result
            }
        } catch (error) {
            this.app.CoreAPI.Log.trace('getLineDetectonResult方法报错：' + error);
            return { state: 0, msg: '获取失败！' };
        }
    }

    //查询相关站点的报警数、审核数
    async getStationAlarmandCheck({ params }, { ctx, userid }) {
        let { app } = this;
        let { transaction, Raw } = app.Dbs.hj;
        let where1 = '';
        let where2 = '';
        let where3 = '';
        where1 = ` and DateDiff(dd,AlarmTime,getdate())=0`;
        where2 = ` and DateDiff(dd,ApplyTime,getdate())=0`;
        where3 = ` and DateDiff(dd,DetectEndTime,getdate())=0`;

        try {
            let result = await Raw.QueryList(
                `select count(*) as bj from Alarm where StationCode=:StationCode ` +
                where1 +
                `
            select count(*) as sh from WaitCheck where OrgCode=:StationCode ` +
                where2 +
                `
            select count(distinct vehicleid) as jc from InspectionData where StationCode=:StationCode and InspectionNature = '01'` +
                where3,
                {
                    replacements: { StationCode: params }
                }
            );
            return { data: result };
        } catch (error) {
            return '获取数据失败！';
        }
    }

    //快捷查询
    async getSeachTable({ params }, { ctx, userid }) {
        params = JSON.parse(params);
        let { tableName, stationID, times } = params;
        let { app } = this;
        let { transaction, Raw } = app.Dbs.hj;
        try {
            let station = '';
            if (tableName == 'WaitCheck') station = 'OrgCode';
            else station = 'StationCode';
            const sqles = `select top 10 * from ${tableName} where 1=1 and  ${station} =:stationid order by  ${times} desc `;
            let data = await Raw.QueryList(sqles, {
                replacements: { stationid: stationID }
            });
            return JSON.stringify({ data });
        } catch (error) {
            return JSON.stringify({ msg: '获取数据失败！' });
        }
    }

    //检测站图片保存操作
    async uploadImage({ }, { ctx, userid }) {
        try {
            let { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            let stream = await this.ctx.getFileStream();
            let imgPath = this.config.imgPath;
            let datas = JSON.parse(stream.fields.selData);
            const uploadType = JSON.parse(stream.fields.uploadType);
            let StationCode = datas.StationCode;
            let Type = datas.CodeValue;
            const typeFile = {
                0: 'Other', //默认
                1: 'StationInfo', //资质证书
                2: 'StationStaff', //检测人员
                3: 'StationDevice' //检测设备
            };

            if (!+StationCode) return { state: 0, msg: '站点编码不能为空!' };
            let baseDir = await app.redis.get('hj').hget('systemconfig', '01_UploadFolder');
            if (!baseDir) {
                const result = await Raw.Query(`select FieldValue from Sys_Config where FieldKey='UploadFolder'`, {
                    replacements: {}
                });
                if (result && result.FieldValue && result.FieldValue != '') baseDir = result.FieldValue;
                else baseDir = 'C:/bsFile';
            }
            let filename = StationCode + '_' + Type + Math.floor(Math.random() * 9000) + stream.filename;
            const targets = path.join(baseDir, typeFile[uploadType] + '/' + StationCode);
            //2.保存路径是否存在,不存在则逐级创建目录
            if (!fs.existsSync(targets)) {
                targets.split(path.sep).reduce((currentPath, folder) => {
                    currentPath += folder + path.sep;
                    if (!fs.existsSync(currentPath)) {
                        fs.mkdirSync(currentPath);
                    }
                    return currentPath;
                }, '');
            }
            //3.保存文件
            const savepath = path.join(targets, filename);
            const writeStream = fs.createWriteStream(savepath);
            await awaitWriteStream(stream.pipe(writeStream));

            const bac = new StationCommon();
            let result = {};
            const fileUrl = imgPath + '/' + typeFile[uploadType] + '/' + StationCode;
            const mimeType = stream.mimeType; //图片格式

            if (uploadType == 1)
                result = await bac.setStationImgData(
                    { datas, fileUrl, filename, mimeType, Type },
                    { ctx, userid, app },
                    Raw
                ); //保存资质证书
            if (uploadType == 2)
                result = await bac.setStationStaffImg(
                    { datas, fileUrl, filename, mimeType, Type },
                    { ctx, userid, app },
                    Raw
                ); //保存检测人员图片
            if (uploadType == 3)
                result = await bac.setStationDeviceImg(
                    { datas, fileUrl, filename, mimeType, Type },
                    { ctx, userid, app },
                    Raw
                ); //保存检测设备图片
            return Object.assign({ state: 1, fullPath: savepath, msg: '上传证件成功！' }, result);
        } catch (error) {
            // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
            // await sendToWormhole(stream);
            this.ctx.logger.error(error);
            this.app.CoreAPI.Log.error(error);
            return { state: 0, msg: '上传图片失败!' };
        }
    }

    // 快捷更新(同时更新Redis)
    async SetTableRedis({ datalist, ID, tablename, IDname, IDvalue, StationCode, redis_key }, { ctx, userid }) {
        try {
            const { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            // 是否开启摩托车分布式开关
            let IsOpenMotorDistributed = await app.Dbs.hj.Raw.Query(`select FieldValue from sys_config where FieldKey='IsOpenMotorDistributed'`);
            if (!datalist || !IDname || !IDvalue || !tablename) return { state: 0, msg: '缺少关键条件无法更新！' };
            if (datalist.isEditDeviceInfo) {
                delete datalist.isEditDeviceInfo;
                let res = await Raw.QueryList(
                    `select LineInfoID from LineInfo where StationCode=:StationCode and SceneCode =:SceneCode`,
                    {
                        replacements: { StationCode: StationCode, SceneCode: datalist.SceneCode }
                    }
                );
                datalist.LineInfoID = res[0].LineInfoID;
            }
            let logParam = {};
            logParam.DataTable = tablename;
            logParam.Optime = this.ctx.helper.dataFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
            logParam.Operator = this.ctx.User.username;


            //去掉对象原型属性
            delete datalist._index;
            delete datalist._rowKey;
            delete datalist[IDname];
            let iddata = {};
            iddata[IDname] = IDvalue;

            // 线信息有更新时，把上传标志othersyncflag位改为0，syncerror='数据有更新，需重传'，其他同步字段不变
            if (tablename == 'LineInfo') {
                datalist.OtherSyncflag = 0;
                datalist.SyncError = '数据有更新，需重传';
            }
            // 旧数据
            let where = ' where ' + IDname + '=:' + IDname;
            let oldObj = await Raw.Query(`select * from ${tablename} ${where}`, {
                replacements: iddata
            });
            if (oldObj.DateCreated) oldObj.DateCreated = this.ctx.helper.dataFormat(oldObj.DateCreated, 'yyyy-MM-dd hh:mm:ss');
            if (oldObj.CalValidityPeriod) oldObj.CalValidityPeriod = this.ctx.helper.dataFormat(oldObj.CalValidityPeriod, 'yyyy-MM-dd hh:mm:ss');
            //筛选出修改的内容
            let filedString = '';
            Object.keys(datalist).forEach((key) => {
                if (oldObj && oldObj[key]) {
                    if (datalist[key] != oldObj[key]) {
                        filedString += `${key}` + ':' + oldObj[key] + '=>' + datalist[key] + ';';
                    }
                }
            });
            logParam.DataSource = filedString;
            await Raw.Update(tablename, datalist, {
                wherestr: ' where ' + IDname + '=:' + IDname,
                replacements: iddata,
            });

            // 日志
            await Raw.Insert('SystemOperactionLog', logParam);

            const sql_redis = `select * from ` + tablename + ` where StationCode=:StationCode `;
            const cont = await Raw.QueryList(sql_redis, {
                replacements: { StationCode: StationCode }
            });
            const das = JSON.stringify(cont || []);
            let CityInfo = await Raw.Query(`select CityCode from StationInfo where StationCode='${StationCode}'`);
            // let childRedis = `hj${StationCode.substr(0, 4)}00`;
            let childRedis = `hj${CityInfo.CityCode}`;
            let fieldKey = redis_key + '/' + StationCode;
            if (app.redis.clients.get(childRedis)) {
                //更新指定客户端redis
                app.redis.clients.get(childRedis).hset('basicinformation', fieldKey, das);
                let value = {
                    OP: 'HSET',
                    VALUE: das,
                    STATIONID: StationCode,
                    REDISKEY: 'basicinformation',
                    FIELDKEY: fieldKey
                };
                // app.redis.clients
                //     .get(childRedis)
                //     .hset('informationupdate', `basicinformation@${fieldKey}@${StationCode}`, JSON.stringify(value));
                ctx.service.c440600.stationManagement.commonService.SetInformationUpdate(
                    app,
                    childRedis,
                    `basicinformation@${fieldKey}@${StationCode}`,
                    JSON.stringify(value),
                    IsOpenMotorDistributed.FieldValue
                );
            }
            app.redis.clients.get('hj').hset('basicinformation', fieldKey, das);
            const getEveryData3 = await Raw.QueryList(`select SceneCode from LineInfo where StationCode=:StationCode`, {
                replacements: { StationCode: StationCode }
            });
            fieldKey = 'station_line_info/' + StationCode;
            if (getEveryData3.length) {
                if (app.redis.clients.get(childRedis)) {
                    //更新指定客户端redis
                    app.redis.clients
                        .get(childRedis)
                        .hset('basicinformation', fieldKey, getEveryData3.map((v) => v.SceneCode).join());
                    let value = {
                        OP: 'HSET',
                        VALUE: getEveryData3.map((v) => v.SceneCode).join(),
                        STATIONID: StationCode,
                        REDISKEY: 'basicinformation',
                        FIELDKEY: fieldKey
                    };
                    // app.redis.clients
                    //     .get(childRedis)
                    //     .hset(
                    //         'informationupdate',
                    //         `basicinformation@${fieldKey}@${StationCode}`,
                    //         JSON.stringify(value)
                    //     );
                    ctx.service.c440600.stationManagement.commonService.SetInformationUpdate(
                        app,
                        childRedis,
                        `basicinformation@${fieldKey}@${StationCode}`,
                        JSON.stringify(value),
                        IsOpenMotorDistributed.FieldValue
                    );
                }
                app.redis.clients.get('hj').hset('basicinformation', fieldKey, getEveryData3.map((v) => v.SceneCode).join());
            }
            if (tablename === 'StationDevice') {
                await ctx.service.hj.hjnotice.updateDeviceNoticeByStationCode(StationCode);
            }
            return { state: 1, msg: '保存成功！' };
        } catch (error) {
            this.app.CoreAPI.Log.trace('SetTableRedis方法报错：' + error);
            return { state: 0, msg: '保存失败！' };
        }
    }

    //快捷删除
    async delectTableID({ tablename, IDname, IDvalue, StationCode, redis_key }, { ctx, userid }) {
        try {
            const { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            let IsOpenMotorDistributed = await app.Dbs.hj.Raw.Query(`select FieldValue from sys_config where FieldKey='IsOpenMotorDistributed'`);
            if (!IDname || !IDvalue || !tablename) return { state: 0, msg: '缺少关键条件无法删除！' };
            // 日志
            let logParam = {};
            logParam.Operator = this.ctx.User.username;
            logParam.Optime = this.ctx.helper.dataFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
            logParam.DataTable = tablename;
            logParam.DataSource = `删除操作=> 关键条件：${IDname}:${IDvalue}`
            let iddata = {};
            iddata[IDname] = IDvalue;
            await Raw.Delete(tablename, {
                wherestr: ' where ' + IDname + '=:' + IDname,
                replacements: iddata
            });

            await Raw.Insert('SystemOperactionLog', logParam)

            let sql_redis = `select * from ` + tablename + ` where StationCode=:StationCode `;
            let cont = await Raw.QueryList(sql_redis, {
                replacements: { StationCode: StationCode }
            });
            let das = JSON.stringify(cont || []);
            let fieldKey = redis_key + '/' + StationCode;
            let CityInfo = await Raw.Query(`select CityCode from StationInfo where StationCode='${StationCode}'`);
            // let childRedis = `hj${StationCode.substr(0, 4)}00`;
            let childRedis = `hj${CityInfo.CityCode}`;
            if (app.redis.clients.get(childRedis)) {
                //更新指定客户端redis
                app.redis.clients.get(childRedis).hset('basicinformation', fieldKey, das);
                let value = {
                    OP: 'HSET',
                    VALUE: das,
                    STATIONID: StationCode,
                    REDISKEY: 'basicinformation',
                    FIELDKEY: fieldKey
                };
                // app.redis.clients
                //     .get(childRedis)
                //     .hset('informationupdate', `basicinformation@${fieldKey}@${StationCode}`, JSON.stringify(value));
                ctx.service.c440600.stationManagement.commonService.SetInformationUpdate(
                    app,
                    childRedis,
                    `basicinformation@${fieldKey}@${StationCode}`,
                    JSON.stringify(value),
                    IsOpenMotorDistributed.FieldValue
                );
            }
            app.redis.clients.get('hj').hset('basicinformation', fieldKey, das);
            return { state: 1, msg: '删除成功！' };
        } catch (error) {
            this.app.CoreAPI.Log.trace('delectTableID方法报错：' + error);
            return { state: 0, msg: '删除失败！', error };
        }
    }

    // 快捷新增（同时更新redis）
    async AddTableRedis({ datalist, isRedis, tablename, StationCode, redis_key }, { ctx, userid }) {

        try {
            console.log('1111', datalist, isRedis, tablename, StationCode, redis_key);
            const { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            // 是否开启摩托车分布式开关
            let IsOpenMotorDistributed = await app.Dbs.hj.Raw.Query(`select FieldValue from sys_config where FieldKey='IsOpenMotorDistributed'`);
            if (datalist.isEditDeviceInfo) {
                delete datalist.isEditDeviceInfo;
                if (datalist.LineInfoID == null) {
                    let res = await Raw.QueryList(
                        `select LineInfoID from LineInfo where StationCode=:StationCode and SceneCode =:SceneCode`,
                        {
                            replacements: { StationCode: StationCode, SceneCode: datalist.SceneCode }
                        }
                    );
                    datalist.LineInfoID = res[0].LineInfoID;
                }
            }
            if (isRedis) {
                //第一步
                delete datalist.ID;
                if (!datalist.ProductionDate) delete datalist.ProductionDate;
                if (!datalist.UseDate) delete datalist.UseDate;
                let obj = {}
                for (let i in datalist) {
                    if (datalist[i]) obj[`${i}`] = datalist[i]
                }
                obj.StationCode = StationCode;
                // 日志
                let logParam = {};
                logParam.DataTable = tablename;
                logParam.Optime = this.ctx.helper.dataFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
                logParam.Operator = this.ctx.User.username;
                let fieldstr = JSON.stringify(obj);
                logParam.DataSource = `新增信息：${fieldstr}`;
                await Raw.Insert(tablename, { ...obj });
                await Raw.Insert('SystemOperactionLog', logParam);
                //第二步
                const sql_redis = `select * from ` + tablename + ` where Stationcode=:StationCode `;
                const cont = await Raw.QueryList(sql_redis, {
                    replacements: { StationCode: StationCode }
                });
                const das = JSON.stringify(cont || []);
                let fieldKey = redis_key + '/' + StationCode;
                let CityInfo = await Raw.Query(`select CityCode from StationInfo where StationCode='${StationCode}'`);
                // let childRedis = `hj${StationCode.substr(0, 4)}00`;
                let childRedis = `hj${CityInfo.CityCode}`;
                if (app.redis.clients.get(childRedis)) {
                    //更新指定客户端redis
                    app.redis.clients.get(childRedis).hset('basicinformation', fieldKey, das);
                    let value = {
                        OP: 'HSET',
                        VALUE: das,
                        STATIONID: StationCode,
                        REDISKEY: 'basicinformation',
                        FIELDKEY: fieldKey
                    };
                    // app.redis.clients
                    //     .get(childRedis)
                    //     .hset(
                    //         'informationupdate',
                    //         `basicinformation@${fieldKey}@${StationCode}`,
                    //         JSON.stringify(value)
                    //     );
                    ctx.service.c440600.stationManagement.commonService.SetInformationUpdate(
                        app,
                        childRedis,
                        `basicinformation@${fieldKey}@${StationCode}`,
                        JSON.stringify(value),
                        IsOpenMotorDistributed.FieldValue
                    );
                }
                app.redis.clients.get('hj').hset('basicinformation', fieldKey, das);
            }
            return { state: 1, msg: '保存成功！' };
        } catch (error) {
            this.app.CoreAPI.Log.trace('AddTableRedis方法报错：' + error);
            return { state: 0, msg: '保存失败！' };
        }
    }

    //推送站点注册审核信息到指定用户
    async pushRegisterStationInfo({ msgChannel, msgType, msgInfo }, { ctx, userid }) {
        try {
            const { app } = this;
            let concatUser = [];
            //检测站注册channel:registerStationAudit
            if (msgInfo.StationCode && msgInfo.FinalResult == null) {
                //行政区域角色
                const areaData = await this.getPromiss('[hj-citycode]', [
                    '' + msgInfo.StationCode.slice(0, 2),
                    '' + msgInfo.StationCode.slice(0, 4),
                    '' + msgInfo.StationCode.slice(0, 6)
                ]);
                //操作类角色
                const userData = await app.CoreAPI.Role.getRoleUsers(['cz11', 'cz12']);
                //合并权限
                concatUser = areaData.filter((v) => userData.indexOf(v) != -1);
                if (concatUser.indexOf('U000001') == -1) concatUser = ['U000001', ...concatUser];
                await app.CoreAPI.MQ.pushToUsers(msgChannel, concatUser, {
                    type: msgType,
                    data: msgInfo
                });
                return { state: 1, msg: '推送站点审核信息成功！' };
            }
        } catch (error) {
            this.app.CoreAPI.Log.trace('pushRegisterStationInfo方法报错：' + error);
            return { state: 0, msg: '推送站点审核信息失败！' };
        }
    }
    // 获取当前用户关于检测站注册审核的权限
    async getUserRegisterStationAuditRole({ }, { ctx, userid }) {
        try {
            const { app } = this;
            let userStationAuditRole = {};
            const cityUsers = await app.CoreAPI.Role.getRoleUsers(['cz11']);
            const proUsers = await app.CoreAPI.Role.getRoleUsers(['cz12']);
            const isCityUser = cityUsers.some(item => item === userid);
            const isProUser = proUsers.some(item => item === userid);
            userStationAuditRole['isCityUser'] = isCityUser;
            userStationAuditRole['isProUser'] = isProUser;
            return { code: 1, msg: '获取审核权限成功', role: userStationAuditRole }
        } catch (error) {
            this.app.CoreAPI.Log.trace('getUserRegisterStationAuditRole方法报错：' + error);
            return { code: 0, msg: '获取用户站点注册审核权限失败！' };
        }
    }
    // 检测站注册审核详细站点信息查询
    async getRegisterStationAllData({ stationCode, all }, { ctx, userid }) {
        try {
            const { app } = this;
            const { Raw } = app.Dbs.hj;
            const redis = app.redis.get('hj');

            if (!stationCode) {
                return { code: 1, baseInfo: {}, lineInfo: [], methodInfo: [], fileInfo: [], deviceInfo: [], dvrInfo: [], cameraInfo: [] };
            }
            if (all === 'all') {
                // 查找各模块数据
                let baseInfo = await getStationInfoByMutiple(stationCode, 'StationInfo');
                let lineInfo = await getStationInfoByMutiple(stationCode, 'LineInfo');
                let methodInfo = await getStationInfoByMutiple(stationCode, 'RL_LineInfo_InspectionMethod');
                let fileInfo = await getStationInfoByMutiple(stationCode, 'StationInfo_UploadFile');
                let deviceInfo = await getStationInfoByMutiple(stationCode, 'StationDevice');
                let dvrInfo = await getStationInfoByMutiple(stationCode, 'DVRInfo');
                let cameraInfo = await getStationInfoByMutiple(stationCode, 'Cameras');
                return {
                    code: 1,
                    msg: '获取站点详细信息成功',
                    baseInfo: baseInfo.data,
                    lineInfo: lineInfo.data,
                    methodInfo: methodInfo.data,
                    fileInfo: fileInfo.data,
                    deviceInfo: deviceInfo.data,
                    dvrInfo: dvrInfo.data,
                    cameraInfo: cameraInfo.data
                };
            } else if (all === 'StationInfo') {
                let baseInfo = await getStationInfoByMutiple(stationCode, 'StationInfo');
                return {
                    code: 1,
                    msg: '获取站点基本信息成功',
                    data: baseInfo.data
                };
            }

            // 获取Redis中的数据
            async function getStationInfoByMutiple(stationCode, fieldName) {
                try {
                    // 1. 先从redis中查找数据
                    let fieldKey = `${fieldName}_${stationCode}_1`;
                    let strData = await redis.hget('registerstationaudit', fieldKey);
                    // console.log('找不到数据：', strData);
                    let data = null;
                    if (strData !== null) {
                        if (fieldName == 'StationInfo') {
                            data = {};
                        } else {
                            data = [];
                        }
                        if (strData !== null) {
                            data = JSON.parse(strData);
                        }
                        return { code: 1, data, msg: `获取 ${fieldName} 信息成功` }
                    } else if (strData === null) {
                        // 2. redis找不到, 则查数据库
                        let tableName;
                        if (fieldName === 'RL_LineInfo_InspectionMethod' || fieldName === 'StationInfo_UploadFile') {
                            tableName = `Register_${fieldName}`;
                        } else {
                            tableName = `Register${fieldName}`;
                        }
                        let sql = `select * from ${tableName} where StationCode=:StationCode`;
                        strData = await Raw.QueryList(sql, {
                            replacements: {
                                StationCode: stationCode
                            }
                        });
                        if (fieldName == 'StationInfo' && strData.length > 0) {
                            strData = strData[0];
                        } else if (fieldName == 'StationInfo' && strData.length === 0) {
                            strData = {};
                        }
                        return { code: 1, data: strData, msg: `获取 ${fieldName} 信息成功` }
                    }
                } catch (error) {
                    return { code: 0, data: {}, msg: `获取 ${fieldName} 信息失败`, error }
                }
            }

        } catch (error) {
            this.app.CoreAPI.Log.trace('getRegisterStationAllData方法报错：' + error);
            return { code: 0, msg: '检测站注册审核详细站点信息查询失败！' };
        }
    }

    // 检测站注册审核一级审核保存
    async updateFirstRegisterStationAudit({ params, changeCheckStatus }, { ctx, userid }) {
        try {
            const { app } = this;
            const redis = app.redis.get('hj');
            // 获取用户名
            var { Raw } = app.Dbs.fx;
            let res = await Raw.Query(`select CnName from FX_UserInfo where UserId=:UserId`, {
                replacements: {
                    UserId: userid,
                },
            });

            var { Raw } = app.Dbs.hj;
            let updateParam = {};
            // 过滤参数
            for (let key in params) {
                if (key === 'StationInfoAuditResult' && params.StationInfoAuditResult !== null) {
                    updateParam['StationInfoAuditResult'] = params.StationInfoAuditResult;
                } else if (key === 'LineInfoAuditResult' && params.LineInfoAuditResult !== null) {
                    updateParam['LineInfoAuditResult'] = params.LineInfoAuditResult;
                } else if (key === 'InspectionMethodAuditResult' && params.InspectionMethodAuditResult !== null) {
                    updateParam['InspectionMethodAuditResult'] = params.InspectionMethodAuditResult;
                } else if (key === 'FileInfoAuditResult' && params.FileInfoAuditResult !== null) {
                    updateParam['FileInfoAuditResult'] = params.FileInfoAuditResult;
                } else if (key === 'StationDeviceAuditResult' && params.StationDeviceAuditResult !== null) {
                    updateParam['StationDeviceAuditResult'] = params.StationDeviceAuditResult;
                } else if (key === 'Remarks') {
                    updateParam['Remarks'] = params.Remarks;
                }
            }
            updateParam.FirstCheckPerson = res.CnName;
            updateParam.FirstCheckTime = new Date();
            // 提交一级审核时，所需模块已全审，需修改 CheckStatus 值为 1,提交一级审核时，有个别模块信息未审核，仅保存模块审核结果
            if (changeCheckStatus) {
                updateParam['CheckStatus'] = 1;
            }
            await Raw.Update("RegisterStationAudit", updateParam, {
                wherestr: "where ID=:ID",//where 条件
                replacements: {//参数化执行
                    ID: params.ID
                }
            });
            let pushResult = undefined;
            if (changeCheckStatus) {
                pushResult = await pushMessageToUser(params.StationCode);
            }
            async function pushMessageToUser(StationCode) {
                try {
                    let targetUser = [];
                    // 获取该站点的行政区域
                    const stationArea = await Raw.Query(`select CityCode, CountyCode from RegisterStationInfo where StationCode='${StationCode}'`);
                    stationArea.ProCode = stationArea.CityCode.slice(0, 2);
                    stationArea.CityCode = stationArea.CityCode.slice(0, 4);
                    // 一级审核完成时，消息提醒二级审用户
                    const userData = await app.CoreAPI.Role.getRoleUsers(['cz12']);
                    //行政区域角色
                    const areaData = await app.CoreAPI.Role.getRoleUsers([
                        stationArea.ProCode,
                        stationArea.CityCode,
                        stationArea.CountyCode
                    ]);
                    targetUser = userData.filter((user) => areaData.indexOf(user) !== -1);
                    if (targetUser.indexOf('U000001') === -1) targetUser = ['U000001', ...targetUser];
                    let stationData = await redis.hget('registerstationaudit', `StationInfo_${StationCode}_1`);
                    if (stationData === null) {
                        stationData = await Raw.Query(`select StationName, StationCode from RegisterStationInfo where StationCode='${StationCode}'`);
                    } else {
                        stationData = JSON.parse(stationData);
                    }
                    await app.CoreAPI.MQ.pushToUsers('registerStationAudit', targetUser, {
                        type: `${stationData.StationName} 一级审核已完成，请进行二级审核！`,
                        data: {
                            "checkid": StationCode
                        }
                    });
                    return { code: 1 }
                } catch (error) {
                    return { code: 0 }
                }
            }
            return { code: 1, msg: '提交审核成功！', pushResult }
        } catch (error) {
            this.app.CoreAPI.Log.trace('updateFirstRegisterStationAudit方法报错：' + error);
            return { code: 0, msg: '审核结果保存失败！' };
        }
    }

    // 检测站注册审核二级审核保存
    async updateSecondRegisterStationAudit({ params, finalResult }, { ctx, userid }) {
        try {
            const { app } = this;
            // 获取用户名
            var { Raw } = app.Dbs.fx;
            let res = await Raw.Query(`select CnName from FX_UserInfo where UserId=:UserId`, {
                replacements: {
                    UserId: userid,
                },
            });
            let updateRegisterParam = {};
            // 过滤参数
            for (let key in params) {
                if (key === 'DVRInfoAuditResult' && params.DVRInfoAuditResult !== null) {
                    updateRegisterParam['DVRInfoAuditResult'] = params.DVRInfoAuditResult;
                } else if (key === 'CameraAuditResult' && params.CameraAuditResult !== null) {
                    updateRegisterParam['CameraAuditResult'] = params.CameraAuditResult;
                } else if (key === 'Remarks') {
                    updateRegisterParam['Remarks'] = params.Remarks;
                }
            }
            updateRegisterParam.CheckStatus = 2;
            updateRegisterParam.FinalResult = finalResult;
            updateRegisterParam.SecondCheckPerson = res.CnName;
            updateRegisterParam.SecondCheckTime = new Date();

            var { transaction, Raw } = app.Dbs.hj;
            // 如果 最终审核结果不通过，则只将审核信息存入 RegisterStationAudit
            if (finalResult) {
                // 最终审核通过
                let getDataResult = await getAllData(params.StationCode);
                if (getDataResult.code) {
                    // 过滤自增字段
                    for (let key in getDataResult.insertParams) {
                        if (getDataResult.insertParams[key].length) {
                            switch (key) {
                                case 'StationInfo_UploadFile':
                                    getDataResult.insertParams[key].forEach(item => {
                                        delete item.ID;
                                        delete item.State;
                                    });
                                    break;
                                case 'RL_LineInfo_InspectionMethod':
                                    getDataResult.insertParams[key].forEach(item => {
                                        delete item.ID;
                                        delete item.State;
                                    });
                                    break;
                                case 'LineInfo':
                                    getDataResult.insertParams[key].forEach(item => {
                                        delete item.LineInfoID;
                                        delete item.State;
                                    });
                                    break;
                                case 'StationDevice':
                                    getDataResult.insertParams[key].forEach(item => {
                                        delete item.StationDeviceID;
                                        delete item.State;
                                    });
                                    break;
                                case 'DVRInfo':
                                    getDataResult.insertParams[key].forEach(item => {
                                        delete item.DVRID;
                                        delete item.State;
                                    });
                                    break;
                                case 'Cameras':
                                    getDataResult.insertParams[key].forEach(item => {
                                        delete item.CAMID;
                                        delete item.State;
                                    });
                                    break;
                                // case 'StationInfo':
                                //     getDataResult.insertParams[key].forEach(item => {
                                //         delete item.State;
                                //     });
                                //     break;
                                default:
                                    break;
                            }
                        }

                    }
                    //站点信息存的是一个对象，不是数组
                    if (getDataResult.insertParams.StationInfo != {}) {

                        getDataResult.insertParams.StationInfo.CreateTime = moment(new Date(getDataResult.insertParams.StationInfo.CreateTime)).format('YYYY-MM-DD hh:mm:ss');
                        delete getDataResult.insertParams.StationInfo.State;
                    }
                    let station = getDataResult.insertParams.StationInfo;
                    // 新增该检测站的管理员用户
                    // let PRICODE = station.CityCode.slice(0,2) + '0000';
                    // const newUser = {
                    //     LOGINNAME: station.StationCode,
                    //     PASSWORD: 'CkcVGgdOYzq3tr7Wqrckq73c0yUPgKBrxhKiM6kHgFEB8kQbWykm5UzorIz7wHS7elZ0iDBIffCVkdvhZ+gA9g==',
                    //     DISPLAYNAME: station.StationCode,
                    //     DEPARTMENTID: 3,
                    //     AREACODE: station.CityCode,
                    //     COUNTYCODE: station.CountyCode,
                    //     PRICODE: PRICODE,
                    //     ESPOrganizationCode:station.StationCode,
                    //     ESPStationCode:'01'
                    // };
                    // 将数据更新进数据库
                    await Raw.ExecWithTran(async (t) => {
                        await Raw.Insert("StationInfo", getDataResult.insertParams.StationInfo, { transaction: t });
                        await Raw.InsertList("LineInfo", getDataResult.insertParams.LineInfo, { transaction: t });
                        await Raw.InsertList("RL_LineInfo_InspectionMethod", getDataResult.insertParams.RL_LineInfo_InspectionMethod, { transaction: t });
                        await Raw.InsertList("StationInfo_UploadFile", getDataResult.insertParams.StationInfo_UploadFile, { transaction: t });
                        await Raw.InsertList("StationDevice", getDataResult.insertParams.StationDevice, { transaction: t });
                        await Raw.InsertList("DVRInfo", getDataResult.insertParams.DVRInfo, { transaction: t });
                        await Raw.InsertList("Cameras", getDataResult.insertParams.Cameras, { transaction: t });
                    })
                    await Raw.ExecWithTran(async (t) => {
                        await Raw.Execute(`update StationDevice set LineInfoID = (select LineInfoID from LineInfo 
                            where SceneCode = StationDevice.SceneCode and StationCode = StationDevice.StationCode) where StationCode=:StationCode`, {
                            replacements: { StationCode: station.StationCode },
                            transaction: t
                        })
                        // 更新摄像头表关联DVRID字段
                        if (getDataResult.insertParams.DVRInfo.length > 1) {
                            // 硬盘录像机个数大于1
                            await Raw.Execute(`update Cameras set DVRID=(select DVRID from DVRInfo 
                                where IP=(select IP from RegisterDVRInfo where Cameras.DVRID=DVRID) and 
                                    Port=(select Port from RegisterDVRInfo where Cameras.DVRID=DVRID) and 
                                    DVRName=(select DVRName from RegisterDVRInfo where Cameras.DVRID=DVRID)) 
                                where StationCode=:StationCode`, {
                                replacements: { StationCode: station.StationCode },
                                transaction: t
                            })
                        } else {
                            let newDVRID = await Raw.Query(`select DVRID from DVRInfo where StationCode=:StationCode`, {
                                replacements: {
                                    StationCode: station.StationCode
                                }
                            });
                            newDVRID = newDVRID.DVRID;
                            await Raw.Execute(`update Cameras set DVRID = :DVRID where StationCode=:StationCode`, {
                                replacements: {
                                    DVRID: newDVRID,
                                    StationCode: station.StationCode
                                },
                                transaction: t
                            })
                        }
                        await Raw.Update("RegisterStationAudit", updateRegisterParam, {
                            wherestr: "where ID=:ID",//where 条件
                            replacements: {//参数化执行
                                ID: params.ID
                            }
                        }, { transaction: t });
                    })
                    return { code: 1, msg: '提交审核成功！' }
                } else {
                    return { code: 0, msg: getDataResult.msg };
                }
            } else {
                // 最终审核不通过
                let result = await Raw.Update("RegisterStationAudit", updateRegisterParam, {
                    wherestr: "where ID=:ID",//where 条件
                    replacements: {//参数化执行
                        ID: params.ID
                    }
                });
                if (result) {
                    // 提交审核结果成功
                    return { code: 1, msg: '提交审核成功！' }
                } else {
                    return { code: 0, msg: '审核结果保存失败！' };
                }
            }
            // 从redis或数据库获取所需所有数据
            async function getAllData(stationCode) {
                try {
                    const redis = app.redis.get('hj');
                    let StationInfo = await getStationInfoByMutiple(stationCode, 'StationInfo');
                    let LineInfo = await getStationInfoByMutiple(stationCode, 'LineInfo');
                    let RL_LineInfo_InspectionMethod = await getStationInfoByMutiple(stationCode, 'RL_LineInfo_InspectionMethod');
                    let StationInfo_UploadFile = await getStationInfoByMutiple(stationCode, 'StationInfo_UploadFile');
                    let StationDevice = await getStationInfoByMutiple(stationCode, 'StationDevice');
                    let DVRInfo = await getStationInfoByMutiple(stationCode, 'DVRInfo');
                    let Cameras = await getStationInfoByMutiple(stationCode, 'Cameras');
                    let insertParams = {
                        'StationInfo': StationInfo.data,
                        'LineInfo': LineInfo.data,
                        'RL_LineInfo_InspectionMethod': RL_LineInfo_InspectionMethod.data,
                        'StationInfo_UploadFile': StationInfo_UploadFile.data,
                        'StationDevice': StationDevice.data,
                        'DVRInfo': DVRInfo.data,
                        'Cameras': Cameras.data
                    };
                    return { code: 1, msg: '获取源数据成功', insertParams };
                    // 获取数据
                    async function getStationInfoByMutiple(stationCode, fieldName) {
                        try {
                            let fieldKey = `${fieldName}_${stationCode}_1`;
                            let data = await redis.hget('registerstationaudit', fieldKey);
                            if (data !== null) {
                                data = JSON.parse(data);
                                return { code: 1, data, msg: `获取 ${fieldName} 信息成功` }
                            } else if (data === null) {
                                // redis中找不到，查数据库
                                let tableName;
                                if (fieldName === 'RL_LineInfo_InspectionMethod' || fieldName === 'StationInfo_UploadFile') {
                                    tableName = `Register_${fieldName}`;
                                } else {
                                    tableName = `Register${fieldName}`;
                                }
                                let sql = `select * from ${tableName} where StationCode=:StationCode`;
                                let data = await Raw.QueryList(sql, {
                                    replacements: {
                                        StationCode: stationCode
                                    }
                                });
                                if (fieldName == 'StationInfo' && data.length > 0) {
                                    data = data[0];
                                } else if (fieldName == 'StationInfo' && data.length === 0) {
                                    data = {};
                                }
                                return { code: 1, data, msg: `获取 ${fieldName} 信息成功` }
                            }
                        } catch (error) {
                            return { code: 0, data: {}, msg: `获取 ${fieldName} 信息失败`, error }
                        }
                    }
                } catch (error) {
                    this.app.CoreAPI.Log.trace('getAllData方法报错：' + error);
                    return { code: 0, msg: '获取源数据成功失败！' };
                }
            }
        } catch (error) {
            this.app.CoreAPI.Log.trace('updateSecondRegisterStationAudit方法报错：' + error);
            return { code: 0, msg: '审核结果保存失败！', error };
        }
    }

    // 检测站注册审核统计数据查询
    async getRegisterStationStatistic({ type }, { ctx, userid }) {
        try {
            const { app } = this;
            const { Raw } = app.Dbs.hj;
            const redis = app.redis.get('hj');
            let where = '';
            let reqParam = {};
            let res = await ctx.service.c440600.stationManagement.commonService.GetAreaRole();
            let userRole = res.data;
            let proRole = [], cityRole = [], countyRole = [];
            userRole.forEach(item => {
                switch (item.length) {
                    case 2: proRole.push(item); break;
                    case 4: cityRole.push(item); break;
                    case 6: countyRole.push(item); break;
                    default: break;
                }
            });
            if (!this.ctx.User.isAdmin && userRole.length == 0) {
                return { code: 0, msg: '您没有查看权限！', data: [] }
            } else if (!this.ctx.User.isAdmin && proRole.length > 0) {
                // 非超级管理员，有省级权限
                where += 'and (';
                proRole.forEach((proRole, index) => {
                    where += ` CityCode like :proRole${index} or`;
                    reqParam[`proRole${index}`] = proRole + '%';
                })
                where = where.substr(0, where.length - 3);
                where += ')';
            } else if (!this.ctx.User.isAdmin && cityRole.length > 0) {
                // 非超级管理员，有市级权限
                where += 'and (';
                cityRole.forEach((cityRole, index) => {
                    where += ` CityCode like :cityRole${index} or`;
                    reqParam[`cityRole${index}`] = cityRole + '%';
                })
                where = where.substr(0, where.length - 3);
                where += ')';
            } else if (!this.ctx.User.isAdmin && countyRole.length > 0) {
                // 非超级管理员，有区级权限
                where += 'and (';
                countyRole.forEach((countyRole, index) => {
                    where += ` CityCode like :countyRole${index} or`;
                    reqParam[`countyRole${index}`] = countyRole + '%';
                })
                where = where.substr(0, where.length - 3);
                where += ')';
            }

            if (type === 'todayHasAudit') {
                let result = await Raw.QueryList(`select ID, StationCode, ApplyPerson, FinalResult, SecondCheckTime
                from RegisterStationAudit where CheckStatus='2' and DateDiff(dd,SecondCheckTime,getdate())=0 ${where} order by SecondCheckTime desc`, {
                    replacements: reqParam
                });
                if (result.length > 0) {
                    // 从redis中查出对应的站点名称
                    let todayAuditInfo = await getRedisStationName(result);
                    return { code: 1, msg: '获取当天已审核数据成功！', data: todayAuditInfo }
                } else {
                    return { code: 1, msg: '获取当天已审核数据成功！', data: [] }
                }
            } else if (type === 'lastTenApply') {
                let result = await Raw.QueryList(`
                    select ApplyTime, count(1) as Counts from (
                    select ID, StationCode, CONVERT(varchar(100), ApplyTime, 23) as ApplyTime
                    from RegisterStationAudit where DateDiff(dd,ApplyTime,getdate())<10 ${where}) a GROUP BY ApplyTime ORDER BY ApplyTime
                `, { replacements: reqParam });
                return { code: 1, msg: '获取最近十天申请数据成功！', data: result }
            } else if (type === 'areaAuditData') {
                let proRole = userRole.find(item => item.length === 2);
                let cityRole = userRole.find(item => item.length === 4);
                let areaInfo = await redis.hget('dictionarytable', 'area');
                areaInfo = JSON.parse(areaInfo);
                if (proRole) {
                    // 用户有省级权限
                    let proCode = proRole + '0000';
                    let StationCode = proRole + '%';
                    let result = await Raw.QueryList(`
                        select CityCode, 
                        count(case when FinalResult is null then 1 else null end) as unaudited,
                        count(case when FinalResult = 1 then 1 else null end) as pass,
                        count(case when FinalResult = 0 then 1 else null end) as unpass
                        from (select ID, StationCode, CityCode, CountyCode, FinalResult
                                from RegisterStationAudit where Stationcode like :StationCode) a GROUP BY CityCode ORDER BY CityCode
                        `, {
                        replacements: {
                            StationCode: StationCode
                        }
                    });
                    let targetArea = areaInfo.filter(item => item.ParentAreaCode === proCode);
                    // 初始化返回数据
                    let temp = [], xAxisData = [], unauditedData = [], passData = [], unpassData = [];
                    targetArea.forEach(item => {
                        temp.push(item.AreaCode);
                        xAxisData.push(item.AreaName);
                    });
                    temp.forEach(area => {
                        let index = result.findIndex(item => item.CityCode === area);
                        if (index !== -1) {
                            unauditedData.push(result[index].unaudited);
                            passData.push(result[index].pass);
                            unpassData.push(result[index].unpass);
                        } else {
                            unauditedData.push(0);
                            passData.push(0);
                            unpassData.push(0);
                        }
                    })
                    return {
                        code: 1, msg: '获取当前用户行政区域审核统计数据成功！', data: {
                            xAxisData, unauditedData, passData, unpassData, result
                        }
                    }
                } else if (cityRole) {
                    // 用户有市级权限
                    let cityCode = cityRole + '00';
                    let StationCode = cityRole + '%';
                    let result = await Raw.QueryList(`
                        select CountyCode, 
                        count(case when FinalResult is null then 1 else null end) as unaudited,
                        count(case when FinalResult = 1 then 1 else null end) as pass,
                        count(case when FinalResult = 0 then 1 else null end) as unpass
                        from (select ID, StationCode, CityCode, CountyCode, FinalResult
                                from RegisterStationAudit where Stationcode like :StationCode) a GROUP BY CountyCode ORDER BY CountyCode
                        `, {
                        replacements: {
                            StationCode: StationCode
                        }
                    });
                    let targetArea = areaInfo.filter(item => item.ParentAreaCode === cityCode);
                    // 初始化返回数据
                    let temp = [], xAxisData = [], unauditedData = [], passData = [], unpassData = [];
                    targetArea.forEach(item => {
                        temp.push(item.AreaCode);
                        xAxisData.push(item.AreaName);
                    });
                    temp.forEach(area => {
                        let index = result.findIndex(item => item.CountyCode === area);
                        if (index !== -1) {
                            unauditedData.push(result[index].unaudited);
                            passData.push(result[index].pass);
                            unpassData.push(result[index].unpass);
                        } else {
                            unauditedData.push(0);
                            passData.push(0);
                            unpassData.push(0);
                        }
                    })
                    return {
                        code: 1, msg: '获取当前用户行政区域审核统计数据成功！', data: {
                            xAxisData, unauditedData, passData, unpassData, result
                        }
                    }
                } else {
                    // 用户没有权限
                    return { code: 0, msg: '暂无查看统计的行政区域权限' }
                }
            } else {
                return { code: 0, msg: '请求type错误！' }
            }

            // 查出StationName字段, 先查redis，再查数据库
            function getRedisStationName(result) {
                return new Promise(function (resolve, reject) {
                    result.forEach(async item => {
                        let fieldKey = `StationInfo_${item.StationCode}_1`;
                        let strData = await redis.hget('registerstationaudit', fieldKey);
                        if (strData !== null) {
                            strData = JSON.parse(strData);
                            item.StationName = strData.StationName;
                        } else if (strData === null) {
                            let station = await Raw.Query('select StationName from RegisterStationInfo where StationCode=:StationCode', {
                                replacements: {
                                    StationCode: item.StationCode
                                }
                            });
                            if (station.StationName) {
                                item.StationName = station.StationName;
                            } else {
                                item.StationName = '';
                            }
                        } else {
                            item.StationName = '';
                        }
                    })
                    let timer = setInterval(() => {
                        let flag = result.every(item => item.hasOwnProperty('StationName'));
                        if (flag) {
                            clearInterval(timer);
                            resolve(result);
                        }
                    }, 1)
                })
            }
        } catch (error) {
            this.app.CoreAPI.Log.trace('getRegisterStationStatistic方法报错：' + error);
            return { code: 0, msg: '获取审核统计数据失败！', error };
        }
    }

    // 查询站点状态为注册的检测站
    async getRegisterStatusStation({ }, { ctx, userid }) {
        try {
            const { app } = this;
            const { Raw } = app.Dbs.hj;
            let where = ` where StationStatus='注册'`;
            let limitReplace = {};
            let res = await ctx.service.c440600.stationManagement.commonService.GetAreaRole();
            let areaRole = res.data;
            let proRole = [], cityRole = [], countyRole = [];
            areaRole.forEach(item => {
                switch (item.length) {
                    case 2: proRole.push(item); break;
                    case 4: cityRole.push(item); break;
                    case 6: countyRole.push(item); break;
                    default: break;
                }
            });
            if (!this.ctx.User.isAdmin && areaRole.length == 0) {
                return { code: 0, data: [], msg: '没有行政区域权限！' };
            } else if (!this.ctx.User.isAdmin && proRole.length > 0) {
                // 非超级管理员，有省级权限
                let limitArr = [];
                proRole.forEach((proRole, index) => {
                    limitReplace[`proRole${index}`] = proRole + '%';
                    limitArr.push(`CityCode like :proRole${index}`);
                });
                where += ` and (` + limitArr.join(' or ') + `)`;
            } else if (!this.ctx.User.isAdmin && cityRole.length > 0) {
                // 非超级管理员，有市级权限
                let limitArr = [];
                cityRole.forEach((cityRole, index) => {
                    limitReplace[`cityRole${index}`] = cityRole + '%';
                    limitArr.push(`CityCode like :cityRole${index}`);
                });
                where += ` and (` + limitArr.join(' or ') + `)`;
            } else if (!this.ctx.User.isAdmin && countyRole.length > 0) {
                // 非超级管理员，有区级权限
                let limitArr = [];
                countyRole.forEach((countyRole, index) => {
                    limitReplace[`countyRole${index}`] = countyRole + '%';
                    limitArr.push(`CountyCode like :countyRole${index}`);
                });
                where += ` and (` + limitArr.join(' or ') + `)`;
            }
            const sqles = ` select StationCode as 'key', StationName as label from StationInfo ${where}`;
            console.log(sqles);
            const data = await Raw.QueryList(sqles, { replacements: limitReplace });
            return { code: 1, data, msg: '获取注册状态站点数据成功！' };
        } catch (error) {
            this.app.CoreAPI.Log.trace('getRegisterStatusStation方法报错：' + error);
            return { code: 0, msg: '获取检测站状态失败！', error };
        }
    }

    // 修改站点状态 注册 为 正常
    async changeStationStatus({ params }, { ctx, userid }) {
        try {
            const { app } = this;
            const { Raw } = app.Dbs.hj;
            const redis = app.redis.get('hj');
            let sqlData = [];
            params.forEach(item => {
                sqlData.push({
                    StationStatus: '正常',
                    StationCode: item
                });
            });
            // 修改数据库中的状态
            await Raw.UpdateList("StationInfo", sqlData, (index, rowdata) => {
                return {
                    wherestr: "where StationCode=:StationCode",//where 条件
                    replacements: {//参数化执行
                        StationCode: rowdata.StationCode
                    }
                }
            });
            // 修改redis中的状态
            await changeRedis(params);
            await redis.del('stationlist');
            const allStationSql = `
            select  (select AreaName from area where AreaCode=CountyCode) as countyname,
            * from stationinfo where CountyCode is not null and PosX is not null and PosY is not null `;
            let allStation = await Raw.QueryList(allStationSql);
            // 将station数据缓存进库
            let stationList = {};
            allStation.forEach(station => {
                if (stationList.hasOwnProperty(station.CityCode)) {
                    stationList[station.CityCode].push(station);
                } else {
                    stationList[station.CityCode] = [];
                    stationList[station.CityCode].push(station);
                }
            })
            for (let key in stationList) {
                redis.hset('stationlist', key, JSON.stringify(stationList[key]));
            }

            function changeRedis(targetStation) {
                let promiseArr = targetStation.map(async item => {
                    return new Promise(async function (resolve, reject) {
                        let data = await redis.hget('basicinformation', `stationinfo/${item}`);
                        data = JSON.parse(data);
                        data.StationStatus = '正常';
                        await redis.hset('basicinformation', `stationinfo/${item}`, JSON.stringify(data));
                        let newData = await redis.hget('basicinformation', `stationinfo/${item}`);
                        newData = JSON.parse(newData);
                        if (newData.StationStatus === '正常') {
                            resolve();
                        } else {
                            reject();
                        }
                    });
                });
                return promiseArr;
            }
            return { code: 1, msg: '提交成功！' };
        } catch (error) {
            this.app.CoreAPI.Log.trace('changeStationStatus方法报错：' + error);
            return { code: 0, msg: '提交失败！', error }
        }
    }

    //检测站注册审核查询
    async getRegisterStationList({ }, { ctx, userid }) {
        try {
            const { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            let where = ` where 1=1`;
            let limitReplace = {};
            let res = await ctx.service.c440600.stationManagement.commonService.GetAreaRole();
            let areaRole = res.data; //获取行政区域
            let proRole = [], cityRole = [], countyRole = [];
            areaRole.forEach(item => {
                switch (item.length) {
                    case 2: proRole.push(item); break;
                    case 4: cityRole.push(item); break;
                    case 6: countyRole.push(item); break;
                    default: break;
                }
            });
            let czAuthority = await app.CoreAPI.Role.getRoleUsers(['cz11', 'cz12']); //操作类审核权限
            if (czAuthority.indexOf('U000001') == -1) czAuthority = ['U000001', ...czAuthority];
            //判断如果非超级管理员,areaCode为空或者没有操作类审核权限，则return
            if (!this.ctx.User.isAdmin && (areaRole.length == 0 || czAuthority.indexOf(userid) == -1)) {
                return JSON.stringify({
                    state: 0,
                    data: [],
                    msg: '没有行政区域或没有操作审核类权限！'
                });
            } else if (!this.ctx.User.isAdmin && proRole.length > 0) {
                // 非超级管理员，有省级权限
                let limitArr = [];
                proRole.forEach((proRole, index) => {
                    limitReplace[`proRole${index}`] = proRole + '%';
                    limitArr.push(`CityCode like :proRole${index}`);
                });
                where += ` and (` + limitArr.join(' or ') + `)`;
            } else if (!this.ctx.User.isAdmin && cityRole.length > 0) {
                // 非超级管理员，有市级权限
                let limitArr = [];
                cityRole.forEach((cityRole, index) => {
                    limitReplace[`cityRole${index}`] = cityRole + '%';
                    limitArr.push(`CityCode like :cityRole${index}`);
                });
                where += ` and (` + limitArr.join(' or ') + `)`;
            } else if (!this.ctx.User.isAdmin && countyRole.length > 0) {
                // 非超级管理员，有区级权限
                let limitArr = [];
                countyRole.forEach((countyRole, index) => {
                    limitReplace[`countyRole${index}`] = countyRole + '%';
                    limitArr.push(`CountyCode like :countyRole${index}`);
                });
                where += ` and (` + limitArr.join(' or ') + `)`;
            }
            const sqles = ` select * from RegisterStationAudit ${where} order by ApplyTime desc`;
            const data = await Raw.QueryList(sqles, { replacements: limitReplace });
            let unAuditNumber = 0;
            data.forEach(item => {
                if (item.CheckStatus !== 2) unAuditNumber++;
            })
            return { state: 1, data, unAuditNumber, msg: '查询成功!' }
        } catch (error) {
            this.app.CoreAPI.Log.trace('getRegisterStationList方法报错：' + error);
            return { state: 0, msg: '查询失败！' };
        }
    }
    //推送修改站点信息审核信息到指定用户
    async pushChangeStationInfo({ remindData, paramInfo }, { ctx, userid }) {
        try {
            const { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            let param = JSON.parse(paramInfo)
            param.ChangeContent = JSON.stringify(param.ChangeContent)
            await Raw.Insert("StationInfoAudit", { ...param })
            await app.CoreAPI.MQ.pushToUsers(remindData.msgChannel, ['U000001'], {
                type: remindData.msgType,
                data: remindData.msgInfo
            });
            return { state: 1, msg: '推送站点修改审核信息成功！' };
            // 
        } catch (error) {
            this.app.CoreAPI.Log.trace('pushChangeStationInfo' + error);
            return { state: 0, msg: '推送站点修改审核信息失败！' };
        }
    }
    //站点信息审核通过后更新数据
    async updateChangeStationInfo({ isStauts, ID }, { ctx, userid }) {
        try {
            const { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            let AuditResult, AuditState;
            if (isStauts == 1) {
                AuditResult = 1;
                AuditState = 1
            } else {
                AuditResult = 0;
                AuditState = 1
            }
            await Raw.Update("StationInfoAudit", { AuditResult: AuditResult, AuditState }, {
                wherestr: "where ID=:ID",//where 条件
                replacements: {//参数化执行
                    ID: ID
                }
            });
            // await app.CoreAPI.MQ.pushToUsers(remindData.msgChannel, ['U000001'], {
            // 	type: remindData.msgType,
            // 	data: remindData.msgInfo
            // });
            return { state: 1, msg: '推送站点修改审核通过！' };
        } catch (error) {
            this.app.CoreAPI.Log.trace('updateChangeStationInfo' + error);
            return { state: 0, msg: '推送站点修改审核失败！' };
        }

    }
    //站点修改信息审核查询
    async getChangeStationList({ }, { ctx, userid }) {
        try {
            const { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            // 添加权限，不同地区的用户只显示当地的数据
            const res = await ctx.service.c440600.stationManagement.commonService.GetUserDetailRole();
            let where = " 1=1";
            if (!this.ctx.User.isAdmin && res.provinceRole.length) {
                where += ` and left(StationCode,2) in (${res.provinceRole.map((p) => "'" + p.slice(0, 2) + "'").join(",")})`;
            } else if (!this.ctx.User.isAdmin && res.cityRole.length) {
                where += ` and left(StationCode,4) in (${res.cityRole.map((c) => "'" + c.slice(0, 4) + "'").join(",")})`;
            } else if (!this.ctx.User.isAdmin && res.areaRole.length) {
                where += ` and left(StationCode,6) in (${res.areaRole.map((a) => "'" + a.slice(0, 6) + "'").join(",")})`;
            }

            const sqles = ` select * from StationInfoAudit where${where} order by SubmitTime desc`;
            const data = await Raw.QueryList(sqles);
            return { state: 1, data, msg: '查询成功!' }
        } catch (error) {
            this.app.CoreAPI.Log.trace('getChangeStationList方法报错：' + error);
            return { state: 0, msg: '查询失败！' };
        }
    }
    //统计站点信息修改通过与未通过
    async getStateStationList({ }, { ctx, userid }) {
        try {
            const { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            let sql = `
			SELECT 
				AuditType,
				sum(case when AuditResult=0 then 1 else 0 end) as 'wtg',
				sum(case when AuditResult=1 then 1 else 0 end) as 'tg'
			FROM StationInfoAudit GROUP BY AuditType
			`
            let data = await Raw.QueryList(sql)
            return { state: 1, msg: '获取数据成功', data }
        } catch (error) {
            this.app.CoreAPI.Log.trace('getStateStationList方法报错：' + error);
            return { state: 0, msg: '查询失败！' };

        }
    }

    // 获取全部站点信息
    async getAllStation() {
        let { app } = this;
        let { Raw } = app.Dbs.hj;
        try {
            let where = ``;
            let rolelist = [];
            if (!this.ctx.User.isAdmin) {
                const userRoles = this.ctx.session.userRoles;
                if ('行政区角色' in userRoles) {
                    rolelist = userRoles['行政区角色'].map(v => v);
                }
                where += ` and stationCode like '${rolelist[0]}%'`;
            }
            let sqlData = await Raw.QueryList(`SELECT STATIONCODE as value,StationName as title, CityCode, CountyCode from StationInfo where ${where} StationName is not null`)
            return { data: sqlData, state: 1, msg: "获取数据成功" }
        } catch (error) {
            this.app.CoreAPI.Log.trace(`getAllStation方法报错:${error}`);
            return { state: 0, msg: "获取数据失败" };
        }
    }
    async getAllStationPage({ param }) {
        let { app } = this;
        let { Raw } = app.Dbs.hj;
        param = JSON.parse(param)
        let { pageNum, pageSize, Input_value } = param;
        try {
            let Result;
            let where = " 1=1";
            let where1 = ``;
            let auditRole = [];
            if (!this.ctx.User.isAdmin) {
                const userRoles = this.ctx.session.userRoles;
                if ('行政区角色' in userRoles) {
                    auditRole = userRoles['行政区角色'].map((t) => t);
                }
                where += ` and StationCode like '${auditRole[0]}%'`;
            }

            if (Input_value) {
                where1 += ` and (StationName like '%${Input_value}%' or StationCode like '%${Input_value}%') and `;
                Result = await Raw.QueryPageData(`SELECT StationCode,StationName,IUSTA,countycode,Address,OrgCode,FaRen,TestTel,LineCount,Remark, StationStatus,CityCode,LinkMan,Tel,StationTag,PosX,PosY from StationInfo where ${where} ${where1} StationName is not null `, pageNum,
                    pageSize, {
                    orderstr: "StationCode,countycode desc",
                    fieldstr: "",
                    replacements: {}
                })
            } else {
                Result = await Raw.QueryPageData(`SELECT StationCode,StationName,IUSTA,countycode,OrgCode,Address,FaRen,TestTel,LineCount,Remark, StationStatus,CityCode,LinkMan,Tel,StationTag,PosX,PosY from StationInfo where StationName is not null and ${where}`, pageNum,
                    pageSize, {
                    orderstr: "StationCode,countycode desc",
                    fieldstr: "",
                    replacements: {}
                })
            }
            return { data: Result, state: 1, msg: "获取数据成功" }
        } catch (error) {
            this.app.CoreAPI.Log.trace(`getAllStationPage方法报错:${error}`);
            return { state: 0, msg: "获取数据失败" };
        }
    }

    // 添加站点行政区域
    async saveStationArea({ params }) {
        let { app } = this;
        let { Raw } = app.Dbs.hj;
        try {
            params = JSON.parse(params)
            if (params.ID) {
                let existsCode = await Raw.Query(`SELECT count(1) FROM StationSortByName where ID != ${params.ID} and AreaID = ${params.AreaID}`)
                if (Object.values(existsCode) == "0") {
                    let ID = params.ID;
                    delete params.ID
                    await Raw.Update("StationSortByName", params, {
                        wherestr: "where ID=:ID",
                        replacements: {
                            ID: ID
                        }
                    });
                    return { state: 1, msg: '保存成功!' };
                } else {
                    return { state: 2, msg: '区域编号已存在!' };
                }
            } else {
                let existsCode = await Raw.Query(`SELECT count(1) FROM StationSortByName where AreaID = ${params.AreaID}`)
                if (Object.values(existsCode) == "0") {
                    params.BusinessTable = 'StationInfo'
                    Raw.ExecWithTran(async t => {
                        await Raw.Insert("StationSortByName", params, {
                            transaction: t
                        });
                    });
                    return { state: 1, msg: "保存成功!" }
                } else {
                    return { state: 2, msg: '区域编号已存在!' };
                }
            }

        } catch (error) {
            this.app.CoreAPI.Log.trace(`saveStationArea方法报错:${error}`);
            return { state: 0, msg: "保存失败!" };
        }
    }

    // 删除行政区域
    async removeArea({ ID }) {
        try {
            let { app } = this;
            let { Raw } = app.Dbs.hj;
            await Raw.Delete("StationSortByName", {
                wherestr: "where ID in (:ID)",
                replacements: {
                    ID
                }
            })
            return { state: 1, msg: '删除成功!' };
        } catch (error) {
            this.app.CoreAPI.Log.trace(`removeArea方法报错:${error}`);
            return { state: 0, msg: '删除失败!' };
        }
    }

    // 获取行政区域列表
    async getAllArea() {
        let { app } = this;
        let { Raw } = app.Dbs.hj;
        let where = ``;
        try {
            let auditRole = [];
            if (!this.ctx.User.isAdmin) {
                const userRoles = this.ctx.session.userRoles;
                if ('行政区角色' in userRoles) {
                    auditRole = userRoles['行政区角色'].map((t) => t);
                    where += ` and AreaID like '${auditRole[0]}%'`;
                }
            }
            let sqlData = await Raw.QueryList(`SELECT *,Name as title from StationSortByName where 1=1 ${where} order by OrderID asc`)
            return { data: sqlData, state: 1, msg: "获取数据成功" }
        } catch (error) {
            this.app.CoreAPI.Log.trace(`getAllArea方法报错:${error}`);
            return { state: 0, msg: "获取数据失败" };
        }
    }

    // 获取选中区域之外的站点
    async getOtherBusinessID({ params }) {
        let { app } = this;
        let { Raw } = app.Dbs.hj;
        try {
            params = JSON.parse(params)
            let otherBusinessID = await Raw.QueryList(`SELECT BusinessID from StationSortByName where ID != '${params}'`)
            return { data: otherBusinessID, state: 1, msg: "获取数据成功" }
        } catch (error) {
            this.app.CoreAPI.Log.trace(`getOtherBusinessID方法报错:${error}`);
            return { state: 0, msg: "获取数据失败" };
        }
    }

    // 更新站点信息
    async updateStationInfo({ params }) {
        let { app } = this;
        let { Raw } = app.Dbs.hj;
        try {
            params = JSON.parse(params)
            let ID = params.ID;
            delete params.ID;
            params.BusinessID = String(params.BusinessID)
            await Raw.Update("StationSortByName", params, {
                wherestr: "where ID=:ID",
                replacements: {
                    ID: ID
                }
            });
            return { state: 1, msg: "保存成功" }
        } catch (error) {
            this.app.CoreAPI.Log.trace(`updateStationInfo方法报错:${error}`);
            return { state: 0, msg: "保存失败" };
        }
    }

    // 更新站点分组规则的状态
    async updateAreaGroup({ param }, { ctx, userid }) {
        try {
            const { app } = this;
            const { Raw } = app.Dbs.hj;
            let updateData = [];
            if (param) {
                param = JSON.parse(param);
            } else {
                return { code: 0, msg: "请求参数错误！" };
            }
            param.forEach(v => {
                let isActive = v.active ? 1 : 0;
                let a = { AreaID: v.AreaID, isActive: isActive, BusinessID: v.BusinessID };
                updateData.push(a);
            });
            // console.log(updateData);

            await Raw.UpdateList("StationSortByName", updateData, (index, rowdata) => {
                return {
                    wherestr: "where AreaID=:AreaID",
                    replacements: {
                        AreaID: rowdata.AreaID,
                    }
                }
            });
            return { code: 1, msg: "保存成功！" };
        } catch (error) {
            this.app.CoreAPI.Log.trace(`updateAreaGroup方法报错:${error}`);
            return { code: 0, msg: "保存失败！" };
        }
    }

    // 站点管理拿取配置用于是否需要审核
    async getStationConfig({ }, { ctx, userid }) {
        try {
            let { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            const isOpen = await app.redis.get('hj').hget('systemconfig', '02_IsCheckStationInfoChange');
            if (!isOpen) {
                let res = await Raw.Query("select FieldValue from Sys_Config where FieldKey='IsCheckStationInfoChange' and SysConfigType='02'")
                if (res) isOpen = res.FieldValue;
                else isOpen = false;
            }
            return { state: 1, msg: '获取配置成功', isOpen }
        } catch (error) {
            return { state: 0, msg: '获取配置失败' }
        }
    }

    // 外检图图片上传地址
    async getexternalImgIP({ }, { ctx, userid }) {
        try {
            let { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            const IP = await app.redis.get('hj').hget('systemconfig', '01_ExtInpectionPath');
            if (!IP) {
                let res = await Raw.Query("select FieldValue from Sys_Config where FieldKey='ExtInpectionPath' and SysConfigType='01'")
                if (res) IP = res.FieldValue;
            }
            return { state: 1, msg: '获取配置成功', IP }

        } catch (error) {
            return { state: 0, msg: '获取配置失败' }
        }
    }

    // 冒黑烟车抓拍视频图像文件路径
    async getSmokeCapturePath({ }, { ctx, userid }) {
        try {
            let { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            const IP = await app.redis.get('hj').hget('systemconfig', '01_SmokeCapturePath');
            if (!IP) {
                let res = await Raw.Query("select FieldValue from Sys_Config where FieldKey='SmokeCapturePath' and SysConfigType='01'")
                if (res) IP = res.FieldValue;
            }
            return { state: 1, msg: '获取配置成功', IP }

        } catch (error) {
            return { state: 0, msg: '获取配置失败' }
        }
    }

    // 检测图片是否读取中心端
    async getisImageCenterEnd({ }, { ctx, userid }) {
        try {
            let { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            let data = await app.redis.get('hj').hget('systemconfig', '02_isImageCenterEnd');
            if (!data) {
                let res = await Raw.Query("select FieldValue from Sys_Config where FieldKey='isImageCenterEnd' and SysConfigType='02'")
                if (res) data = res.FieldValue;
            }
            data = data == "true" ? true : false;
            return { state: 1, msg: '获取配置成功', data }
        } catch (error) {
            return { state: 0, msg: '获取配置失败' }
        }
    }
    // 检测视频是否读取中心端
    async getisVideoCenterEnd({ }, { ctx, userid }) {
        try {
            let { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            let data = await app.redis.get('hj').hget('systemconfig', '02_isVideoCenterEnd');
            if (!data) {
                let res = await Raw.Query("select FieldValue from Sys_Config where FieldKey='isVideoCenterEnd' and SysConfigType='02'")
                if (res) data = res.FieldValue;
            }
            data = data == "true" ? true : false;
            return { state: 1, msg: '获取配置成功', data }
        } catch (error) {
            return { state: 0, msg: '获取配置失败' }
        }
    }
    // 审核备注是否能为空 配置
    async getreSure({ }, { ctx, userid }) {
        try {
            let { app } = this;
            let { transaction, Raw } = app.Dbs.hj;
            let data = await app.redis.get('hj').hget('systemconfig', '02_reSure');
            if (!data) {
                let res = await Raw.Query("select FieldValue from Sys_Config where FieldKey='reSure' and SysConfigType='02'")
                if (res) data = res.FieldValue;
            }
            data = data == "true" ? true : false;
            return { state: 1, msg: '获取配置成功', data }
        } catch (error) {
            return { state: 0, msg: '获取配置失败' }
        }
    }

    // 站点基础信息
    async getStationBaseInfo({ params }, { ctx, userid }) {
        let { app } = this;
        let { transaction, Raw } = app.Dbs.hj;
        try {
            const { StationCode } = JSON.parse(params)
            let where = ` 1=1`;
            let sql = `
                SELECT 
	                (SELECT AreaName FROM Area WHERE a.CityCode=AreaCode) AS CityCode,
	                (SELECT AreaName FROM Area WHERE a.CountyCode=AreaCode) AS CountyCode,
	                StationName,
	                Address,
	                ISNULL(LineCount, 0) as LineCount,
	                StationStatus,
	                SyncFlag
                FROM StationInfo a where StationCode=:StationCode`;
            let result = await Raw.Query(sql, {
                replacements: {
                    StationCode: StationCode
                }
            })
            let stationBaseInfo = [
                { field: 'CityCode', title: '所属市', value: '' },
                { field: 'CountyCode', title: '所属区', value: '' },
                { field: 'StationName', title: '站点名称', value: '' },
                { field: 'Address', title: '地址', value: '' },
                { field: 'LineCount', title: '检测线总数', value: '' },
                { field: 'StationStatus', title: '检测站状态', value: '' },
                { field: 'SyncFlag', title: '数据是否同步', value: '' },
            ]
            // 处理数据
            if (result) {
                if (result.SyncFlag) result.SyncFlag = '已同步'
                else result.SyncFlag = '未同步'
                for (let key in result) {
                    stationBaseInfo.forEach(item => {
                        if (key == item.field) item.value = result[key]
                    })
                }
            }
            return { state: 1, msg: '数据获取成功', result: stationBaseInfo }
        } catch (error) { }
    }
    // 站点自检信息
    async getSelfCheckInfo({ params }, { ctx, userid }) {
        let { app } = this;
        let { transaction, Raw } = app.Dbs.hj;
        try {
            // 拿系统配置信息确定自检
            let configInfo
            configInfo = await app.redis.get('hj').hget("systemconfig", "04_AccDeviceCheckItem")
            if (!configInfo) {
                let res = await Raw.Query("select FieldValue from Sys_Config where FieldKey='AccDeviceCheckItem'");
                if (res) configInfo = res.FieldValue
            }
            // 把拿回来的配置字符串转换成数组
            let configInfoList = configInfo.split(",")

            // 引入所有自检配置文件并过滤数据
            let configAll = require("../../../config/selfCheckConfig")
            let configFilters = new Array()
            configAll.forEach(item => {
                item.data = new Array()
                configInfoList.forEach(itemC => {
                    if (item.index == itemC) configFilters.push(item)
                })
            })

            // 查询数据 
            let i = 0, len = configFilters.length, judgeArr = ['LightProofSmokeSelfCheckInfo', 'LDSelfCheckInfo', 'ASMSelfCheckInfo', 'TSISelfCheckInfo', 'IMSelfCheckInfo'];
            let where = ` DateDiff(dd,CheckTimeEnd,getdate()) = 0`
            let where1 = ` DateDiff(dd,CheckDate,getdate()) = 0 `
            for (i; i < len; i++) {
                let tabalValue = configFilters[i].tableValue
                let indeNum = judgeArr.includes(tabalValue)
                if (indeNum) {
                    let result = await Raw.QueryList(`
                        SELECT SceneCode,judge FROM (
                            SELECT 
                                SceneCode,
                                row_number() over(partition by SceneCode order by CheckTimeEnd desc) as row_number,
                                case Judge when 1 then '合格' else '不合格' END as Judge
                            FROM ${tabalValue} where${where}
                        ) a WHERE a.row_number=1
                    `)
                    configFilters[i].data = result
                } else {

                    let result1 = await Raw.QueryList(`
                        SELECT SceneCode,judge FROM (
                            SELECT 
                                SceneCode,
                                row_number() over(partition by SceneCode order by CheckDate desc) as row_number,
                                case CheckJudge when 1 then '合格' else '不合格' END as Judge
                            FROM ${tabalValue} where${where1}
                        ) a WHERE a.row_number=1
                    `)
                    configFilters[i].data = result1
                }
            }
            // 返回数据
            return { state: 1, msg: '查询数据成功', resData: configFilters }
        } catch (error) {
            this.app.CoreAPI.Log.trace(`getSelfCheckInfo方法报错:${error}`);
            return { code: 0, msg: "数据获取失败" };
        }
    }

    async getLineCheckInfo({ params }, { ctx, userid }) {
        try {
            const { app } = this;
            const { Raw } = app.Dbs.hj;
            params = JSON.parse(params);
            let date = moment(new Date()).format('YYYY-MM-DD');
            if (params.selectDate) {
                date = moment(params.selectDate).format('YYYY-MM-DD');
            }
            let where = `and DATEDIFF(dd, AdjustTimeEnd, '${date}')=0`
            let petrolRes = await Raw.QueryList(`select SceneCode,HCED,COED,NOED,CO2ED,O2ED,AdjustTimeEnd from LineCheckPetrol 
            where StationCode=:StationCode ${where} order by AdjustTimeEnd desc`, {
                replacements: {
                    StationCode: params.StationCode
                }
            })
            let dieselRes = await Raw.QueryList(`select SceneCode,EL,ER,ED,AdjustTimeEnd from LineCheckDiesel 
            where StationCode=:StationCode ${where} order by AdjustTimeEnd desc`, {
                replacements: {
                    StationCode: params.StationCode
                }
            })
            return { code: 1, data: { petrolRes, dieselRes } }
        } catch (error) {
            this.app.CoreAPI.Log.trace('getLineCheckInfo方法报错：' + error)
            return { code: 0, error }
        }
    }

    async getSelfCheckData({ params }, { ctx, userid }) {
        try {
            const { app } = this;
            const { Raw } = app.Dbs.hj;
            params = JSON.parse(params);
            let date = moment(new Date()).format('YYYY-MM-DD');
            if (params.selectDate) {
                date = moment(params.selectDate).format('YYYY-MM-DD');
            }
            let sqlObj = await ctx.service.hj.selfCheck.getSelfCheckSql(params.selectTable);
            let where = ` where StationCode=:StationCode and DATEDIFF(dd, ${sqlObj.time}, '${date}')=0 ${sqlObj.order}`;
            let sql = sqlObj.sql + where;
            let list = await Raw.QueryList(sql, {
                replacements: {
                    StationCode: params.StationCode
                }
            })
            return { code: 1, data: { list } }
        } catch (error) {
            this.app.CoreAPI.Log.trace('getSelfCheckData方法报错：' + error)
            return { code: 0, error }
        }
    }

    async getStationPublicInfo({ StationName }, { ctx, userid }) {
        const { app } = this;
        try {
            const { Raw } = app.Dbs.hj;
            if (!StationName) {
                return { code: 0, msg: '参数错误！' }
            }
            let StationInfo = await Raw.QueryList(`select CityCode,CountyCode,StationName,IUSTA,Address,StationStatus 
				from StationInfo where StationName like '%${StationName}%' or IUSTA like '%${StationName}%' order by StationCode`)
            return { code: 1, data: { list: StationInfo }, msg: '查询检测站信息成功！' }
        } catch (error) {
            app.CoreAPI.Log.trace('getVehicleRecentInfo方法报错：' + error)
            return { code: 0, msg: '查询检测站信息失败！', error }
        }
    }
}

class StationCommon {
    //保存资质证书
    async setStationImgData({ datas, fileUrl, filename, mimeType, Type }, { ctx, userid, app }, Raw) {
        try {
            datas.FullFileName = path.join(fileUrl, filename);
            datas.FileExtension = mimeType;
            datas.UploadTime = datas.Modifytime = new Date();
            datas.UploadPerson = userid;
            datas.type = Type;
            datas.DisplayName = datas.CodeName;
            datas.Bytes = null;
            let newData = {};
            if (datas.ID && datas.ID != '') {
                //编辑
                let lsite = {
                    FileExtension: datas.FileExtension,
                    UploadTime: datas.UploadTime,
                    Modifytime: datas.Modifytime,
                    UploadPerson: datas.UploadPerson,
                    FullFileName: datas.FullFileName,
                    Bytes: datas.Bytes
                };
                await Raw.Update('StationInfo_UploadFile', lsite, {
                    wherestr: ' where ID=:id',
                    replacements: { id: datas.ID }
                });

                //赋值编辑的数据
                newData = datas;
            } else {
                //新增
                let lsitet = {
                    StationCode: datas.StationCode,
                    FullFileName: datas.FullFileName,
                    FileExtension: datas.FileExtension,
                    UploadTime: datas.UploadTime,
                    DisplayName: datas.DisplayName,
                    type: datas.type,
                    Modifytime: datas.Modifytime,
                    UploadPerson: datas.UploadPerson,
                    UploadPerson: datas.UploadPerson,
                    Bytes: datas.Bytes
                };
                await Raw.Insert('StationInfo_UploadFile', lsitet);

                //查出最新新增的一条信息
                newData = await Raw.Query('select top 1 * from StationInfo_UploadFile order by ID desc', {
                    replacements: {}
                });
            }

            return { newData: newData };
        } catch (error) {
            ctx.logger.error(error);
            throw error;
        }
    }

    //保存检测人员
    async setStationStaffImg({ datas, fileUrl, filename, mimeType, Type }, { ctx, userid, app }, Raw) {
        try {
            datas.FullFileName = path.join(fileUrl, filename);
            datas.FileExtension = mimeType;
            datas.UploadTime = datas.Modifytime = new Date();
            datas.UploadPerson = userid;
            datas.type = Type;
            datas.DisplayName = datas.CodeName;
            datas.Bytes = null;
            let newData = {};
            if (datas.ID && datas.ID != '') {
                //编辑
                let lsite = {
                    StationCode: datas.StationCode,
                    StationStaffID: datas.StationStaffID,
                    FileExtension: datas.FileExtension,
                    UploadTime: datas.UploadTime,
                    Modifytime: datas.Modifytime,
                    UploadPerson: datas.UploadPerson,
                    FullFileName: datas.FullFileName,
                    Bytes: datas.Bytes
                };
                await Raw.Update('StationStaff_UploadFile', lsite, {
                    wherestr: ' where StationStaffID=:id',
                    replacements: { id: datas.ID }
                });

                //赋值编辑的数据
                newData = datas;
            } else {
                //新增
                let lsitet = {
                    StationCode: datas.StationCode,
                    StationStaffID: datas.StationStaffID,
                    FileExtension: datas.FileExtension,
                    UploadTime: datas.UploadTime,
                    DisplayName: datas.DisplayName,
                    type: datas.type,
                    Modifytime: datas.Modifytime,
                    UploadPerson: datas.UploadPerson,
                    FullFileName: datas.FullFileName,
                    Bytes: datas.Bytes
                };
                await Raw.Insert('StationStaff_UploadFile', lsitet);

                //查出最新新增的一条信息
                newData = await Raw.Query('select top 1 * from StationStaff_UploadFile order by ID desc', {
                    replacements: {}
                });
            }

            return { newData: newData };
        } catch (error) {
            ctx.logger.error(error);
            throw error;
        }
    }

    //保存检测设备
    async setStationDeviceImg({ datas, fileUrl, filename, mimeType, Type }, { ctx, userid, app }, Raw) {
        try {
            datas.FullFileName = path.join(fileUrl, filename);
            datas.FileExtension = mimeType;
            datas.UploadTime = datas.Modifytime = new Date();
            datas.UploadPerson = userid;
            datas.type = Type;
            datas.DisplayName = datas.CodeName;
            datas.Bytes = null;
            let newData = {};
            if (datas.ID && datas.ID != '') {
                //编辑
                let lsite = {
                    StationDeviceID: datas.StationDeviceID,
                    FileExtension: datas.FileExtension,
                    UploadTime: datas.UploadTime,
                    Modifytime: datas.Modifytime,
                    UploadPerson: datas.UploadPerson,
                    FullFileName: datas.FullFileName,
                    Bytes: datas.Bytes
                };
                await Raw.Update('StationDeviceInfo_UploadFile', lsite, {
                    wherestr: ' where ID=:id',
                    replacements: { id: datas.ID }
                });

                //赋值编辑的数据
                newData = datas;
            } else {
                //新增
                let lsitet = {
                    StationDeviceID: datas.StationDeviceID,
                    FileExtension: datas.FileExtension,
                    UploadTime: datas.UploadTime,
                    DisplayName: datas.DisplayName,
                    type: datas.type,
                    Modifytime: datas.Modifytime,
                    UploadPerson: datas.UploadPerson,
                    FullFileName: datas.FullFileName,
                    Bytes: datas.Bytes
                };
                await Raw.Insert('StationDeviceInfo_UploadFile', lsitet);

                //查出最新新增的一条信息
                newData = await Raw.Query('select top 1 * from StationDeviceInfo_UploadFile order by ID desc', {
                    replacements: {}
                });
            }

            return { newData: newData };
        } catch (error) {
            ctx.logger.error(error);
            throw error;
        }
    }
}

module.exports = supervisionCenter;
