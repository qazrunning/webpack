'use strict';

const Service = require('egg').Service;
class CommonService extends Service {
	async Update(vec, changeDataSource, Creater = '', Raw, t) {
		try {
			//初始化实体,防止报错
			const entity = {
				//xh:null,
				//IsAndPoliceMatch:null,
				//FuelType:null,
				//BZTYPE:null,
				// EmissionStandard:null,
				CreateTime: null,
				Creater: null,
				UpdateDataSources: null,
				SyncFlag: null,
				RatioKey: null,
				LastUpdateTime: null,
				VehicleID: null
				// PG:null,
				// VehicleType:null,
				// UseOfAuto:null,
				// VehicleBigType:null
			};
			const model = Object.assign(entity, vec);

			if (model.xh && (!model.IsAndPoliceMatch || model.IsAndPoliceMatch == 0)) model.IsAndPoliceMatch = 1;

			if (model.FuelType == 'C' || model.FuelType == 'N') {
				model.BZTYPE = '01';
			} else if (
				!model.EmissionStandard &&
				((model.FuelType == 'A' && model.EmissionStandard == '01') ||
					(model.FuelType == 'B' && model.EmissionStandard == '03'))
			) {
				//汽油
				model.BZTYPE = '01';
			} else if (
				!model.EmissionStandard &&
				((model.FuelType == 'A' && model.EmissionStandard != '01') ||
					(model.FuelType == 'B' && model.EmissionStandard != '03'))
			) {
				model.BZTYPE = '02';
			}

			if (model.CreateTime == null)
				model.CreateTime = this.ctx.helper.dataFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
			if (model.Creater == null) model.Creater = Creater;

			if (Creater != '') {
				model.UpdateDataSources = changeDataSource;
				model.SyncFlag = 0;
			}

			model.RatioKey = await this.ctx.service.hj.commonService.GetRatioKey({ model, changeDataSource }, Raw, t);
			model.LastUpdateTime = this.ctx.helper.dataFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');

			//根据不同的列Updat车辆表信息
			let updateField = {};
			if (model) {
				Object.keys(model).forEach(function (key) {
					if (key == 'VehicleID') return;
					updateField[key] = model[key];
				});
			}
			const state = await this.ctx.service.hj.commonService.LogChanges({ model, changeDataSource }, Raw, t);
			await Raw.Update('Vehicle', updateField, {
				wherestr: 'where VehicleID=:VehicleID', //where 条件
				replacements: {
					//参数化执行
					VehicleID: model.VehicleID
				},
				transaction: t
			});
			if (!state) return 0;
			return 1;
		} catch (error) {
			this.ctx.logger.error(error);
			throw error;
		}
	}

	//保存操作车辆日志
	//model 新车辆信息
	//changeDataSource  功能名称
	async LogChanges({ model, changeDataSource }, Raw, t) {
		try {
			if (!model) return 1;

			const vehicles = await Raw.QueryList(
				`                       
                    SELECT
                    col.name AS value,
                    ISNULL(ep.[value], '') AS name 
                    FROM dbo.syscolumns col
                    LEFT JOIN dbo.systypes t ON col.xtype = t.xusertype
                    inner JOIN dbo.sysobjects obj ON col.id = obj.id
                    AND obj.xtype = 'U'
                    AND obj.status >= 0
                    LEFT JOIN dbo.syscomments comm ON col.cdefault = comm.id
                    LEFT JOIN sys.extended_properties ep ON col.id = ep.major_id
                    AND col.colid = ep.minor_id
                    AND ep.name = 'MS_Description'
                    LEFT JOIN sys.extended_properties epTwo ON obj.id = epTwo.major_id
                    AND epTwo.minor_id = 0
                    AND epTwo.name = 'MS_Description'
                    WHERE obj.name = 'Vehicle'--表名
                    ORDER BY col.colorder ;`,
				{
					replacements: {},
					transaction: t
				}
			);

			//获取车辆表字段和描述;
			let keyValue = {};
			vehicles.forEach((t) => {
				keyValue[t.value] = t.name;
			});

			//旧车辆信息
			let oldVec = null;
			const resData = await Raw.Query(`select * from Vehicle where VehicleID=:VehicleID`, {
				replacements: {
					VehicleID: model.VehicleID
				},
				transaction: t
			});
			if (!resData) return 0;
			oldVec = resData;
			oldVec.RegistDate=this.ctx.helper.dataFormat(oldVec.RegistDate,'yyyy-MM-dd hh:mm:ss');
			oldVec.VRDATE = this.ctx.helper.dataFormat(oldVec.VRDATE, 'yyyy-MM-dd hh:mm:ss');
			oldVec.ProductDate = this.ctx.helper.dataFormat(oldVec.ProductDate, 'yyyy-MM-dd hh:mm:ss');
			oldVec.DateOfPurchase = this.ctx.helper.dataFormat(oldVec.DateOfPurchase, 'yyyy-MM-dd hh:mm:ss');
			oldVec.CreateTime = this.ctx.helper.dataFormat(oldVec.CreateTime, 'yyyy-MM-dd hh:mm:ss');
			oldVec.LastUpdateTime = this.ctx.helper.dataFormat(oldVec.LastUpdateTime, 'yyyy-MM-dd hh:mm:ss');
			oldVec.AbandonedYear = this.ctx.helper.dataFormat(oldVec.AbandonedYear, 'yyyy-MM-dd hh:mm:ss');
			if(oldVec.EDSPL) oldVec.EDSPL=oldVec.EDSPL.toFixed(2)
			const Creater = this.ctx.User.cnname;
			const CreateTime = this.ctx.helper.dataFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
			//筛选出修改的内容
			let filedString = '';
			Object.keys(model).forEach((key) => {
				if (oldVec && oldVec[key]) {
					if (model[key] != oldVec[key]) {
						filedString += keyValue[key] + ':' + oldVec[key] + '=>' + model[key] + ';';
					}
				}
			});

			if (!filedString) return;
			await Raw.Insert(
				'CHANGE_LOG',
				{
					SOURCE_TABLE: 'VEHICLE',
					LOG_MSG: filedString,
					CHANGER: Creater,
					CHANGE_TIME: CreateTime,
					SOURCE_ID: model.VehicleID,
					CHANGEDATASOURCE: changeDataSource
				},
				{ transaction: t }
			);
			let logParam = {};
			logParam.DataTable = 'VEHICLE';
			logParam.Optime = CreateTime;
			logParam.Operator = this.ctx.User.username;
			logParam.DataSource = filedString;
			await Raw.Insert('SystemOperactionLog', logParam, { transaction: t });
			return 1;
		} catch (error) {
			this.ctx.logger.error(error);
			throw error;
		}
	}

	//生成排放数据 (model 车辆数据)
	async GetRatioKey({ model }, Raw, t) {
		try {
			if (!model) return null;
			//无车牌号,则返回
			if (!model.VLPN) return null;
			//修改排放系数
			if (
				!(
					model.VLPN ||
					model.VehicleBigType ||
					model.PG ||
					model.VehicleType ||
					model.UseOfAuto ||
					model.FuelType ||
					model.EmissionStandard
				)
			) {
				const citys = await Raw.Query(`select CityCode from AreaVLPN where LicensePlate+Letter=:VLPN`, {
					replacements: {
						VLPN: model.VLPN.slice(0, 2)
					},
					transaction: t
				});
				let strCity = '';
				if (citys) {
					strCity = citys.CityCode;
				}
				const strFuelType = model.FuelType == 'A' || model.FuelType == 'B' ? model.FuelType : 'QT';
				const strUseOfAuto = model.UseOfAuto == 'C' || model.UseOfAuto == 'D' ? model.UseOfAuto : 'QT';

				return string.Format(
					'{0}_{1}_{2}_{3}_{4}_{5}_{6}',
					strCity,
					model.VehicleBigType,
					model.PG,
					model.VehicleType,
					strUseOfAuto,
					strFuelType,
					model.EmissionStandard
				);
			}
			return null;
		} catch (error) {
			this.ctx.logger.error(error);
			throw error;
		}
	}

	//获取当前用户审核权限
	async GetAuditRole() {
		try {
			const { app } = this;
			const { transaction, Raw } = app.Dbs.hj;

			let auditRole = []; //审核类型角色
			let reasonRole = []; //审核原因(受理审核子项)
			if (!this.ctx.User.isAdmin) {
				const userRoles = this.ctx.session.userRoles;
				if ('审核类角色' in userRoles) {
					//  auditRole=userRoles['审核类角色']
					//  .filter(tt=> tt.indexOf('sh20') ==-1)
					//  .map(t=> t.replace('sh',''));

					//  reasonRole=userRoles['审核类角色']
					//  .filter(tt=> tt.indexOf('sh20') !=-1)
					//  .map(t=> t.replace('sh20',''));

					//当受理审核和复合审核都有子项时
					auditRole = userRoles['审核类角色']
						.filter((tt) => tt.indexOf('sh20') == -1 && tt.indexOf('sh31') == -1)
						.map((t) => t.replace('sh', ''));
					reasonRole = userRoles['审核类角色']
						.filter((tt) => tt.indexOf('sh20') != -1)
						.map((t) => t.replace('sh20', ''));
					let sh31 = userRoles['审核类角色']
						.filter((tt) => tt.indexOf('sh31') != -1)
						.map((t) => t.replace('sh31', ''));
					if (sh31.length) {
						if (sh31.length == 1 && sh31.indexOf('2126') != -1) reasonRole.push('21,26');
						else if (sh31.length == 1 && sh31.indexOf('1821') != -1) reasonRole.push('18,21');
						else auditRole.push('31');
					}
				}
			}
			return { state: 1, auditRole: auditRole, reasonRole: reasonRole };
		} catch (error) {
			this.ctx.logger.error(error);
			return { state: 0 };
		}
	}

	//获取当前用户报警权限
	async GetAlarmRole() {
		try {
			const { app } = this;
			const { transaction, Raw } = app.Dbs.hj;

			let auditRole = [];
			if (!this.ctx.User.isAdmin) {
				const userRoles = this.ctx.session.userRoles;
				if ('报警类角色' in userRoles) {
					auditRole = userRoles['报警类角色'].map((t) => t.replace('bj', ''));
				}
			}

			return { state: 1, data: auditRole };
		} catch (error) {
			this.ctx.logger.error(error);
			return { state: 0 };
		}
	}

	//获取当前用户行政区
	async GetAreaRole() {
		try {
			const { app } = this;
			const { transaction, Raw } = app.Dbs.hj;
			let auditRole = [];
			const userRoles = this.ctx.session.userRoles;
			if(!userRoles) return { state: 1, data: auditRole }
			if ('行政区角色' in userRoles) {
				auditRole = userRoles['行政区角色'].map((t) => t);
			}
			return { state: 1, data: auditRole };
		} catch (error) {
			this.ctx.logger.error(error);
			return { state: 0 };
		}
	}

	//获取用户省市区
	async GetUserDetailRole() {
		try {
			const { app } = this;
			const { transaction, Raw } = app.Dbs.hj;
			let userCityCode = (this.ctx.session.userRoles && this.ctx.session.userRoles['行政区角色']) || [];
			let provinceRole = userCityCode.filter((v) => v.length == 2).map((s) => s + '0000'); //省市区行政区域 

			// provinceRole=(provinceRole.length == 0 ? ['440000'] : provinceRole);
			let cityRole = userCityCode.filter((v) => v.length == 4).map((s) => s + '00');
			let areaRole = userCityCode.filter((v) => v.length == 6);
			return { provinceRole, cityRole, areaRole }
		} catch (error) {
			return { state: 0 };
		}
	}

	async GetUserDetailRoleNew() {
		try {
			const { app } = this;
			const { transaction, Raw } = app.Dbs.hj;
			let userCityCode = (this.ctx.session.userRoles && this.ctx.session.userRoles['行政区角色']) || [];
			let provinceRole = userCityCode.filter((v) => v.length == 2).map((s) => s + '0000'); //省市区行政区域 

			// provinceRole=(provinceRole.length == 0 ? ['440000'] : provinceRole);
			let cityRole = userCityCode.filter((v) => v.length == 4);
			let areaRole = userCityCode.filter((v) => v.length == 6);
			return { provinceRole, cityRole, areaRole }
		} catch (error) {
			return { state: 0 };
		}
	}

	// 更新redis informationUpdate key公共方法 
	// 参数 app,item:redis名,key名,value值
	async SetInformationUpdate(app, item, key, value, IsOpenMotorDistributed) {
		try {
			await app.redis.get(item).hset('informationupdate', key, value);
			// 如果IsOpenMotorDistributed开关开启，同时将不是受理信息的数据存入mtinformationupdate中
			if (IsOpenMotorDistributed == 'true' && key.indexOf('bd/acceptance') == -1) {
				await app.redis.get(item).hset('mtinformationupdate', key, value);
			}
		} catch (error) {
			console.log(error);
		}
	}
}
module.exports = CommonService;
