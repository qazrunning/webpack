'use strict'
const Controller = require('egg').Controller;
const fs = require("fs");
const path = require("path");
class reportManagement extends Controller {
  //修改用户个性化tab栏设置
  async changeUserThema({ params }, { ctx, userid }) {
    const { app } = this;
    const { transaction, Raw } = app.Dbs.hj;
    try {
      let url = `documents/hj/user/${userid}`; //用户个性化配置位置
      let absolutePath = __dirname.split("\\"); //项目绝对路径
      absolutePath.splice(-4, 4);
      let fielPath = path.join(absolutePath.join("/"), url);
      let optionInfo = {}; //原有配置
      let state = 0;
      if (!fs.existsSync(fielPath)) {
        fielPath.split(path.sep).reduce((currentPath, folder) => {
          currentPath += folder + path.sep;
          if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
          }
          return currentPath;
        }, "");
      }
      fs.exists(path.join(fielPath, "menuTab.json"), (exists) => {
        if (!exists)
          fs.writeFileSync(
            path.join(fielPath, "menuTab.json"),
            JSON.stringify({}),
            "utf8"
          );
        fs.readFile(
          path.join(fielPath, "menuTab.json"),
          { encoding: "utf-8" },
          (err, data) => {
            if (err) {
              console.log(err);
            } else {
              optionInfo = JSON.parse(data);
              optionInfo.checkSelTab = params;
              fs.writeFile(
                `${fielPath}/menuTab.json`,
                JSON.stringify(optionInfo),
                (err) => {
                  if (err) console.log(err);
                  else state = 1;
                }
              );
            }
          }
        );
      });

      return { state: 1 };
    } catch (error) {
      ctx.logger.error(error);
      return { state: 0, msg: "修改菜单栏失败！" };
    }
  }
  // 获取用户个性化tab栏配置
  async getUserProcessMenuConfig({ }, { ctx, userid }) {
    try {
      const { app } = this;
      let url = `../documents/hj/user/${userid}`; //用户个性化配置位置
      let absolutePath = path.resolve();
      let fielPath = path.join(absolutePath, url);
      let checkSelTab; //原有配置
      if (!fs.existsSync(fielPath)) {
        return { code: 0, msg: "找不到该用户的默认配置文件，读取默认配置" };
      }
      if (fs.existsSync(path.join(fielPath, "menuTab.json"))) {
        let data = fs.readFileSync(path.join(fielPath, "menuTab.json"), {
          encoding: "utf-8",
        });
        checkSelTab = JSON.parse(data).checkSelTab;
        return { code: 1, data: { checkSelTab } };
      } else {
        return { code: 0, msg: "找不到该用户的默认配置文件，读取默认配置" };
      }
    } catch (error) {
      this.app.CoreAPI.Log.trace("getUserProcessMenuConfig方法报错：" + error);
      return { code: 0, msg: "获取标签页菜单配置失败！" };
    }
  }
  //j检测报告获取主检测表数据，并分页
  async getHistorySearch(param, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let reqParam = {};
      let where = '';
      let inputWhere = " ";
      let leftJoinTable = ``;
      let leftField = ``;
      let sql = ``;
      let {
        isExportExcel,
        pageSize,
        pageIndex,
        ifInspectionNum,
        VLPNandSceneCode,
        InspectionNum,
        JCSJ1,
        JCSJ2,
        likeParams,
        params,
        otherParams,
        selectInspectionNum,
        parame,
      } = param;
      let auditRole = [];
      // console.log(222,this.ctx.User.isAdmin);

      if (!this.ctx.User.isAdmin) {
        const userRoles = this.ctx.session.userRoles;
        if ("行政区角色" in userRoles) {
          auditRole = userRoles["行政区角色"].map((t) => t);
        }
        where += ` and StationCode like '${auditRole[0]}%'`
      }
      if (JSON.stringify(likeParams) != '{}') {
        for (let paramKey in likeParams) {
          where += " and " + paramKey + " like :" + paramKey;
          reqParam[paramKey] = "%" + likeParams[paramKey] + "%";

        }
      }
      if (JSON.stringify(params) != '{}') {
        for (let paramKey in params) {
          if (paramKey == "FaultIndicator" || paramKey == "IsCommunicated") {
            leftJoinTable = ` LEFT JOIN (SELECT InspectionNum,FaultIndicator,IsCommunicated from OBDInfo) B ON A.InspectionNum=B.InspectionNum `;
            leftField = `B.FaultIndicator,B.IsCommunicated,`;
            where += ` and ${paramKey} = ${params[paramKey]}`;
          } else if (paramKey == "IUTYPE" || paramKey == "FuelType") {
            where += " and " + paramKey + " like :" + paramKey;
            reqParam[paramKey] = `%${params[paramKey]}%`;
          } else {
            if (params[`${paramKey}`]) {
              if (params[paramKey] instanceof Array) {
                if (params[paramKey].length) {
                  where += " and (";
                  params[paramKey].forEach((item, index) => {
                    where += `${paramKey} = :${paramKey}${index} or `;
                    reqParam[`${paramKey}${index}`] = item;
                  });
                  where = where.slice(0, where.length - 3);
                  where += ")";
                }
              } else {
                where += " and " + paramKey + " = :" + paramKey;
                reqParam[paramKey] = params[paramKey];
              }
            }
          }
        }
      }
      if (JSON.stringify(otherParams) != '{}') {
        for (let paramKey in otherParams) {
          if (otherParams[paramKey]) {
            if (paramKey == "InspectionTimes") {
              where += ` and InspectionTimes ${otherParams.InspectionTimesOption} :InspectionTimes `;
              reqParam[paramKey] = otherParams[paramKey];
            } else if (paramKey == "RatedSeats") {
              where += ` and RatedSeats ${otherParams.RatedSeatsOption} :RatedSeats `;
              reqParam[paramKey] = otherParams[paramKey];
            } else if (paramKey == "VRDATE" && otherParams.VRDATE[0]) {
              where += ` and VRDATE >= '${otherParams.VRDATE[0]}' and VRDATE <= '${otherParams.VRDATE[1]}' `;
            } else if (paramKey == "VML") {
              where += ` and VML ${otherParams.VMLOption} :VML `;
              reqParam[paramKey] = otherParams[paramKey];
            }
          }
        }
      }

      if (JSON.stringify(parame) != '{}') {
        if (parame["StationCode"] && parame["StationCode"].length) {
          where += ` and StationCode in (:StationCode) `;
          reqParam["StationCode"] = parame["StationCode"];
        } else if (parame["county"]) {
          where += ` and CountyCode = :CountyCode`;
          reqParam["CountyCode"] = parame["county"];
        } else if (parame["city"]) {
          where += ` and CityCode like :CityCode`;
          reqParam["CityCode"] = parame["city"].substr(0, 4) + "%";
        }
      }

      if (VLPNandSceneCode) {
        inputWhere += " and VLPN like :VLPN or SceneCode like :SceneCode  ";
        reqParam.VLPN = "%" + VLPNandSceneCode + "%";
        reqParam.SceneCode = "%" + VLPNandSceneCode + "%";
      }
      if (JCSJ1 && JCSJ2) {
        where += " and DetectEndTime >= :JCSJ1 and DetectEndTime <= :JCSJ2 ";
        reqParam.JCSJ1 = JCSJ1;
        reqParam.JCSJ2 = JCSJ2;
      }
      if (InspectionNum) {
        where += " and InspectionNum = :InspectionNum ";
        reqParam.InspectionNum = InspectionNum;
      }

      if (selectInspectionNum && selectInspectionNum.length > 0) {
        where += ` and InspectionNum in (:selectInspectionNum) `;
        reqParam["selectInspectionNum"] = selectInspectionNum;
      } else if (ifInspectionNum) {
        return JSON.stringify({ result: { list: [], total: 0 }, state: 1 });
      }
      sql = `select InspectionDataID,VehicleID,${leftField}StationShortName,IUTYPE,A.InspectionNum,VDCT,VLPN,VIN, InspectionReportNo, IsCanPrint,
       		DetectEndTime,DetectStartTime,StationCode,PrintTimes,SceneCode,VLPNColor,EmissionStandard,FuelType, VehicleKind, InspectionWay,InspectionNature,IUVTYPE,InspectionTimes,VRDATE,FactoryPlateModel,OCHA,InspectionKind,UseOfAuto,GAVType 
        FROM InspectionData A ${leftJoinTable} where 1=1 ${where} ${inputWhere}`;

      // 判断是否是导出
      if (isExportExcel) {
        let sql2 = `select InspectionDataID,VehicleID,StationShortName,IUTYPE,InspectionNum,VDCT,VLPN,VIN, InspectionReportNo, 
				DetectEndTime,DetectStartTime,StationCode,PrintTimes,SceneCode,VLPNColor,EmissionStandard,FuelType, VehicleKind, InspectionWay,InspectionNature,IUVTYPE,InspectionTimes,VRDATE,FactoryPlateModel,OCHA,InspectionKind,UseOfAuto,GAVType FROM InspectionData ${where} ${inputWhere}`;
        let lst = await Raw.QueryList(sql2, {
          replacements: reqParam,
        });
        return JSON.stringify({ state: 1, lst });
      } else {
        let result;
        result = await Raw.QueryPageData(sql, pageIndex, pageSize, {
          orderstr: "detectendtime desc",
          replacements: reqParam,
        });

        return JSON.stringify({ state: 1, result });

      }
    } catch (error) {
      this.app.CoreAPI.Log.trace('getHistoryInfo报错' + error);
      return JSON.stringify({ msg: "检索信息出错" });
    }
  }
  // 获取检测结果报告数据
  async GetInspectionResultNew({ params }, { ctx, userid }) {
    params = JSON.parse(params);
    let table = '';
    let inspectionDataID = '';
    if (params.ifName) {
      // 判断是否为InspectionData的附表 true为是
      const date = new Date();
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      if (month < 10) {
        month = '0' + month;
      }
      table = 'InspectionData' + year + month; // 附表以OldID为查询字段
      inspectionDataID = 'OldID';
    } else {
      table = 'InspectionData';
      inspectionDataID = 'inspectionDataID';
    }
    let { app } = this;
    let { transaction, Raw } = app.Dbs.hj;
    try {
      let inspectionMethod = params.inspectionMethod;
      if (!inspectionMethod) {
        return { error: '检测方法为空！' };
      }
      //主检测信息
      let result0, result1, result2, result3, result4, result5, result6, result7, result8, result9, result10;
      if (params.inspectionDataID) {
        const promise1 = new Promise(async function (resolve, reject) {
          result0 = await Raw.QueryList(
            `select top 1  InspectionDataID,StationCode,StationShortName,VehicleID,CityCode,CountyCode
																	,InspectionNum,InspectionOperator,InspectionDriver
																	,Temperature,Pressure,Humidity,IUTID,VDCT,IUTYPE,InspectionStandard
																	,InspectionWay,InspectionNature,InspectionTimes,convert(varchar(10),IUIDATE,120) as IUIDATE,TSM,SceneCode
																	,SyncFlag,UploadDate,UploadMonth,UploadYear,DetectStartTime,DetectEndTime
																	,ICheck,CheckTime,VinFlag,EngineNumFlag,VerifyResult,VerifyOperator,VerifyTime,NewVDCT,
																	OwnerName,Tel,Address,UniqueString,VLPN,VLPNColor
																	,VIN ,IUVTYPE,VehicleBigType,PG,VehicleType  ,IsDoubleFuel                        
																	,KerbMass,BenchmarkMass,VML,RatedSeats,FactoryPlateModel
																	,Mileage,OCHA,UseOfAuto,convert(varchar(10),VRDATE,120) as VRDATE,AbandonedYear
																	,IUETYPE,EDSPL,(select CodeName from CD_IntakeWay where CodeValue=IntakeWay) as IntakeWay
																	--, (select CodeName from CD_FuelType where CodeValue=FuelType)as FuelType
																	,FuelType
																	,(select CodeName from CD_OilSupplyWay where CodeValue=OilSupplyWay)as OilSupplyWay
																	,EngineRatedSpeed,EnginePower,ProductDate
																	,(select CodeName from cd_DriveForm where CodeValue=DriveForm) as DriveForm
																	,(select CodeName from CD_VehicleKind where CodeValue=VehicleKind)as VehicleKind
																	,VehicleKind as VehicleKindType
																	,TyreType,IUVMANU,AxleWeight,StrokeCount,CylinderCount
																	,(case when HasCCA=0 then '无' when HasCCA=1 then '有' else '' end )as HasCCA
																	,HasOxygenSensor ,GasVentCount,HasOBD,InspectionReportNo,ChassisType,EngineNum,Remarks,BZTYPE
																	,(select CodeName from cd_VariableForm where CodeValue=VariableForm ) as VariableForm
																	,GearCount,IUEMANU,CatalyticConvertersAndCorp,SendedToPoliceMiddleDB,SendedToPoliceTimes,xh,VLPNType
																	,IsCanPrint,GAVType,InspectionLoginName,ReportPrintTime,ReportPrinter,EmissionStandard
																	,Dynamometer,DProvider,DIEAC,Analyser,AProvider,AIEAC,Smokemeter,SProvider,SIEAC,AddVehKind
																	,InspectionKind,IsUploadLambdaLimit
															from ${table} where ${inspectionDataID}=:inspectionDataID`,
            { replacements: { inspectionDataID: params.inspectionDataID } }
          );
          resolve();
        })
        const promise2 = new Promise(async function (resolve, reject) {
          //车辆信息
          result1 = await Raw.QueryList(
            `select top 1 OwnerName,Tel,Address,VehicleID,UniqueString,VLPN,VLPNColor
																,VIN ,IUVTYPE,VehicleBigType,PG,VehicleType  ,IsDoubleFuel,FuelSpecification
																,(select codeName from cd_VariableForm where CodeValue=VariableForm)as VariableForm
																,KerbMass,BenchmarkMass,VML,VLDATE,RatedSeats,FactoryPlateModel
																,Mileage,OCHA,UseOfAuto,RegistDate,convert(varchar(10),VRDATE,120) as VRDATE,AbandonedYear,EngineNum
																,IUETYPE,EDSPL,(select CodeName from CD_IntakeWay where CodeValue=IntakeWay) as IntakeWay
																--, (select CodeName from CD_FuelType where CodeValue=FuelType)as FuelType
																,FuelType
																,(select CodeName from CD_OilSupplyWay where CodeValue=OilSupplyWay)as OilSupplyWay
																,EngineRatedSpeed,EnginePower,ProductDate,ChassisType,GearCount
																,(select CodeName from cd_DriveForm where CodeValue=DriveForm) as DriveForm
																,TyreType,IUVMANU,AxleWeight,StrokeCount,IUEMANU,CylinderCount
																,(case when HasCCA=0 then '无' when HasCCA=1 then '有' else null end )as HasCCA
																,HasOxygenSensor ,CatalyticConvertersAndCorp,GasVentCount,InspectionPeriod,HasOBD,EStatus,UpdateDataSources
																,isSecondHandCar,(select CodeName from CD_EmissionStandard where CodeValue=EmissionStandard)as EmissionStandard
														from Vehicle where VehicleID=:vehicleID`,
            { replacements: { vehicleID: params.vehicleID } }
          );
          resolve();
        })
        const promise3 = new Promise(async function (resolve, reject) {
          // 检测设备
          result2 = await Raw.QueryList(
            `select * from InspectionDeviceLog  where InspectionDataID=:inspectionDataID`,
            { replacements: { inspectionDataID: params.inspectionDataID } }
          );
          resolve();
        })
        const promise4 = new Promise(async function (resolve, reject) {
          // 检测站
          result3 = await Raw.QueryList(
            `SELECT top 1 si.StationCode,si.CityCode,IUSTA,si.Address,
																	FaRen,LinkMan,TestTel,LineCount,Deadline,CertificateNo,ExpiryDate
																	,ServiceIP,PosX,PosY,RegisterDate,PostCode,Fax,Email
																	,MobilePhone,StationStatus,Remark,IsLockPrint
																	FROM ${table} id left join StationInfo si
																	on(id.StationCode=si.StationCode)
																	where ${inspectionDataID}=:inspectionDataID`,
            { replacements: { inspectionDataID: params.inspectionDataID } }
          );
          resolve();
        })
        const promise5 = new Promise(async function (resolve, reject) {
          result4 = await Raw.QueryList(
            `Select top 1 * from OBDInfo where InspectionNum=:InspectionNum order by OBDInspectStartTime desc`,
            { replacements: { InspectionNum: params.InspectionNum } }
          );
          resolve();
        })
        const promise6 = new Promise(async function (resolve, reject) {
          result5 = await Raw.QueryList(
            `select top 1 * from AppearanceInfo where InspectionNum=:InspectionNum order by AppearanceDate desc`,
            { replacements: { InspectionNum: params.InspectionNum } }
          );
          resolve();
        })
        const promise7 = new Promise(async function (resolve, reject) {
          // 检测设备-停放地
          result6 = await Raw.QueryList(
            `select * from RegulatoryAgencyDevice where LineInfoID in (select RegulatoryAgencyLineInfo.LineInfoID 
							from ${table} id left join RegulatoryAgencyLineInfo on(id.SceneCode=RegulatoryAgencyLineInfo.SceneCode)
							where ${inspectionDataID}=:inspectionDataID ) and RegulatoryAgencyCode=(select top 1 StationCode
							from ${table} where ${inspectionDataID}=:inspectionDataID)`,
            { replacements: { inspectionDataID: params.inspectionDataID } }
          );
          resolve();
        })
        const promise8 = new Promise(async function (resolve, reject) {
          // 检测站-停放地
          result7 = await Raw.QueryList(
            `SELECT top 1 si.RegulatoryAgencyCode,si.CityCode,IUSTA,si.Address,FaRen,LinkMan,TestTel,LineCount,Deadline
						,ServiceIP,PosX,PosY,RegisterDate,PostCode,Fax,Email
						,MobilePhone,RegulatoryAgencyStatus,Remark
						FROM ${table} id left join RegulatoryAgency si
						on(id.StationCode=si.RegulatoryAgencyCode)
						where ${inspectionDataID}=:inspectionDataID`,
            { replacements: { inspectionDataID: params.inspectionDataID } }
          );
          resolve();
        })
        const promise9 = new Promise(async function (resolve, reject) {
          //停放地检测信息
          result8 = await Raw.QueryList(
            `select top 1 * from ParkInspectData where InspectionDataID=:inspectionDataID`,
            { replacements: { inspectionDataID: params.inspectionDataID } }
          );
          resolve();
        })
        inspectionMethod = inspectionMethod.toUpperCase();
        let methodList = inspectionMethod.split(',');
        let sqles = '';
        let sqlList = [];
        if (methodList.length > 1) {
          methodList.forEach(item => {
            let sql = '';
            switch (item) {
              case 'B': sql = 'select top 1 * from ASMData where InspectionNum=:InspectionNum ---检测方法对应的信息'; break;
              case 'C': sql = 'select top 1 * from IMData where InspectionNum=:InspectionNum ---检测方法对应的信息'; break;
              case 'G': sql = 'select top 1 * from LDData where InspectionNum=:InspectionNum ---检测方法对应的信息'; break;
              case 'E': sql = 'select top 1 * from FilterSmokeData where InspectionNum=:InspectionNum ---检测方法对应的信息'; break;
              case 'F': sql = 'select top 1 * from LightProofSmokeData where InspectionNum=:InspectionNum ---检测方法对应的信息'; break;
              case 'A': sql = 'select top 1 * from TSIData where InspectionNum=:InspectionNum ---检测方法对应的信息'; break;
              case 'J': sql = 'select top 1 * from LingmanData where InspectionNum=:InspectionNum ---检测方法对应的信息'; break;
              default: break;
            }
            sqlList.push({
              IUTYPE: item,
              sql: sql
            });
          })
          if (!sqlList.length) {
            return { state: 0, msg: '没有找到对应的检测方法!' };
          }
        } else {
          switch (inspectionMethod) {
            case 'B': sqles += ' select top 1 * from ASMData where InspectionNum=:InspectionNum ---检测方法对应的信息'; break;
            case 'C': sqles += ' select top 1 * from IMData where InspectionNum=:InspectionNum ---检测方法对应的信息'; break;
            case 'G': sqles += ' select top 1 * from LDData where InspectionNum=:InspectionNum ---检测方法对应的信息'; break;
            case 'E': sqles += ' select top 1 * from FilterSmokeData where InspectionNum=:InspectionNum ---检测方法对应的信息'; break;
            case 'F': sqles += ' select top 1 * from LightProofSmokeData where InspectionNum=:InspectionNum ---检测方法对应的信息'; break;
            case 'A': sqles += ' select top 1 * from TSIData where InspectionNum=:InspectionNum ---检测方法对应的信息'; break;
            case 'J': sqles += ' select top 1 * from LingmanData where InspectionNum=:InspectionNum ---检测方法对应的信息'; break;
            default: break;
          }
          if (sqles === '') {
            return { state: 0, msg: '没有找到对应的检测方法!' };
          }
        }
        const promise10 = new Promise(async function (resolve, reject) {
          if (sqlList.length > 1) {
            let result = [];
            for (let i = 0; i < sqlList.length; i++) {
              let res = await Raw.Query(sqlList[i].sql, {
                replacements: { InspectionNum: params.InspectionNum }
              });
              result.push({
                IUTYPE: sqlList[i].IUTYPE,
                data: res
              });
            }
            result9 = result;
            resolve();
          } else {
            result9 = await Raw.QueryList(sqles, {
              replacements: { InspectionNum: params.InspectionNum }
            });
            resolve();
          }
        })
        // 燃油蒸发结果
        const promise11 = new Promise(async function (resolve, reject) {
          result10 = await Raw.QueryList(
            `Select top 1 * from FuelEvaporationInfo where InspectionNum=:InspectionNum order by EndTime desc`,
            { replacements: { InspectionNum: params.InspectionNum } }
          );
          resolve();
        })
        await Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7, promise8, promise9, promise10, promise11]);

        return {
          state: 1,
          InsDataInfo: result0,
          VehicleInfo: result1,
          StationDeviceInfo: result2,
          StationInfo: result3,
          OBDInfo: result4,
          Appearan: result5,
          RegulatoryAgencyDevice: result6,
          RegulatoryAgency: result7,
          ParkInspectData: result8,
          MethodDataInfo: result9,
          FuelEvaporationInfo: result10
        };
      }
    } catch (error) {
      this.app.CoreAPI.Log.trace('GetInspectionResultNew报错' + error);
    }
  }
  // 打印报告记录日志
  async AddChangeLog({ params }, { ctx, userid }) {
    let { app } = this;
    let { transaction, Raw } = app.Dbs.hj;
    let data = {
      SOURCE_TABLE: 'InspectionData',
      LOG_MSG: '打印检测报告，非检测站端不计入打印次数',
      CHANGER: params.useName,
      CHANGE_TIME: new Date(),
      SOURCE_ID: params.InspectionDataID
    };
    await Raw.Insert('CHANGE_LOG', data);
  }

  //获取检测的图片列表
  async getSelStationInfo({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let {
        StationCode,
        InspectionNum,
        isImageCenterEnd,
        isVideoCenterEnd,
      } = param;
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let result = {};
      if (StationCode) {
        result = await Raw.Query(
          `select * from StationInfo where StationCode=:StationCode`,
          {
            replacements: {
              StationCode: StationCode,
            },
          }
        );
      }
      let ImageUrl = ""; //图片路径
      let VideoUrl = ""; //视频路径
      if (isImageCenterEnd) {
        ImageUrl = "/";
      } else {
        if (result) ImageUrl = result.ImageMediaUrl;
      }

      if (isVideoCenterEnd) {
        VideoUrl = "/";
      } else {
        if (result) VideoUrl = result.ImageMediaUrl;
      }
      result = [];
      if (InspectionNum) {
        result = await Raw.QueryList(
          `select * from InspectionFile where InspectionNum=:InspectionNum`,
          {
            replacements: {
              InspectionNum: InspectionNum,
            },
          }
        );
      }
      return {
        state: 1,
        data: {
          ImageUrl: ImageUrl,
          VideoUrl: VideoUrl,
          Img_Video_List: result,
        },
        msg: "查询成功",
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
        msg: "查询失败",
      };
    }
  }
  // 获取点位的摄像头类型：1海康威视，2大华
  async getStationVideoType({ param }, { ctx }) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      if (!param.StationCode) {
        return {
          state: 0,
          msg: "参数错误，未携带必填参数！",
        };
      }
      let result = await Raw.Query(
        `select * from DVRInfo where StationCode = ${param.StationCode}`
      );
      return {
        state: 1,
        result,
        msg: "查询成功",
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
        msg: "查询失败",
      };
    }
  }
  async getResultDBInfo({ param }, { ctx }) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      if (!param.InspectionNum && !param.IUTYPE) {
        return { code: 1, data: null, msg: '缺少参数传入' };
      }
      let res = await Raw.Query(`select * from InsResultComparison where InspectionNum = '${param.InspectionNum}' and	IUTYPE = '${param.IUTYPE}'`)
      return { code: 1, data: res };

    } catch (err) {
      this.app.CoreAPI.Log.trace("getResultDBInfo方法报错：" + err);
      return { code: 0, msg: "查询结果对比信息失败！", err };
    }
  }
  //检测过程数据
  async getInspectProcessFromDB({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { InspectionNum, InspectionMethod } = param;
      if (!InspectionNum) return;
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;

      // 获取检测数据
      let dbTableData;
      let methodList = InspectionMethod.split(",");
      let sqles = "";
      let sqlList = [];
      if (methodList.length > 1) {
        methodList.forEach((item) => {
          let sql = "";
          switch (item) {
            case "B":
              sql =
                "select top 1 * from ASMData where InspectionNum=:InspectionNum ---检测方法对应的信息";
              break;
            case "C":
              sql =
                "select top 1 * from IMData where InspectionNum=:InspectionNum ---检测方法对应的信息";
              break;
            case "G":
              sql =
                "select top 1 * from LDData where InspectionNum=:InspectionNum ---检测方法对应的信息";
              break;
            case "E":
              sql =
                "select top 1 * from FilterSmokeData where InspectionNum=:InspectionNum ---检测方法对应的信息";
              break;
            case "F":
              sql =
                "select top 1 * from LightProofSmokeData where InspectionNum=:InspectionNum ---检测方法对应的信息";
              break;
            case "A":
              sql =
                "select top 1 * from TSIData where InspectionNum=:InspectionNum ---检测方法对应的信息";
              break;
            case "J":
              sql =
                "select top 1 * from LingmanData where InspectionNum=:InspectionNum ---检测方法对应的信息";
              break;
            default:
              break;
          }
          sqlList.push({
            IUTYPE: item,
            sql: sql,
          });
        });
        if (!sqlList.length) {
          return { state: 0, msg: "没有找到对应的检测方法!" };
        }
      } else {
        switch (InspectionMethod) {
          case "B":
            sqles +=
              " select top 1 * from ASMData where InspectionNum=:InspectionNum ---检测方法对应的信息";
            break;
          case "C":
            sqles +=
              " select top 1 * from IMData where InspectionNum=:InspectionNum ---检测方法对应的信息";
            break;
          case "G":
            sqles +=
              " select top 1 * from LDData where InspectionNum=:InspectionNum ---检测方法对应的信息";
            break;
          case "E":
            sqles +=
              " select top 1 * from FilterSmokeData where InspectionNum=:InspectionNum ---检测方法对应的信息";
            break;
          case "F":
            sqles +=
              " select top 1 * from LightProofSmokeData where InspectionNum=:InspectionNum ---检测方法对应的信息";
            break;
          case "A":
            sqles +=
              " select top 1 * from TSIData where InspectionNum=:InspectionNum ---检测方法对应的信息";
            break;
          case "J":
            sqles +=
              " select top 1 * from LingmanData where InspectionNum=:InspectionNum ---检测方法对应的信息";
            break;
          default:
            break;
        }
        if (sqles === "") {
          return { state: 0, msg: "没有找到对应的检测方法!" };
        }
      }
      if (sqlList.length > 1) {
        let result = [];
        for (let i = 0; i < sqlList.length; i++) {
          let res = await Raw.Query(sqlList[i].sql, {
            replacements: { InspectionNum: InspectionNum },
          });
          result.push({
            IUTYPE: sqlList[i].IUTYPE,
            data: res,
          });
        }
        dbTableData = result;
      } else {
        let res = await Raw.Query(sqles, {
          replacements: { InspectionNum: InspectionNum },
        });
        dbTableData = [
          {
            IUTYPE: InspectionMethod,
            data: res,
          },
        ];
      }

      let redisKey = "";
      if (InspectionMethod == "A")
        redisKey = "bd/processtsiinfo/" + InspectionNum + "/0";
      else if (InspectionMethod == "B")
        redisKey = "bd/processasminfo/" + InspectionNum + "/0";
      else if (InspectionMethod == "C")
        redisKey = "bd/processiminfo/" + InspectionNum + "/0";
      else if (InspectionMethod == "G")
        redisKey = "bd/processldinfo/" + InspectionNum + "/0";
      else if (InspectionMethod == "F")
        redisKey = "bd/processlpsinfo/" + InspectionNum + "/0";
      let allhstrget = {}; //从redis获取数据
      let childRedis = `hj${InspectionNum.substr(0, 4)}00`; //子redis
      if (app.redis.get(childRedis)) {
        allhstrget = await app.redis.get(childRedis).hgetall(redisKey);
      } else {
        allhstrget = await app.redis.get("hj").hgetall(redisKey);
      }
      if (JSON.stringify(allhstrget) != "{}") {
        let result = [];
        for (let i in allhstrget) {
          result.push(JSON.parse(allhstrget[i]));
        }

        function sortNumber(a, b) {
          return a.Second_NO - b.Second_NO;
        }
        return {
          state: 1,
          dbTableData,
          data: result.sort(sortNumber),
        };
      }
      const InspectInfo = await Raw.Query(
        `select DetectStartTime,IUTYPE from InspectionData where InspectionNum=:InspectionNum`,
        { replacements: { InspectionNum: InspectionNum } }
      );
      if (
        !InspectInfo ||
        (InspectInfo && !InspectInfo.DetectStartTime && !InspectInfo.IUTYPE)
      ) {
        return {
          state: 1,
          dbTableData,
          data: [],
          msg: "查询失败",
        };
      }

      const year = JSON.stringify(InspectInfo.DetectStartTime).substring(1, 5);
      const month = JSON.stringify(InspectInfo.DetectStartTime).substring(6, 8);
      const IUTYPE = InspectInfo.IUTYPE;
      let typeList = IUTYPE.split(",");
      let InspectProcessInfo = [];
      if (typeList.length > 1) {
        let arr = [];
        for (let i = 0; i < typeList.length; i++) {
          if (typeList[i] == "J") continue;
          let tableName = "";
          if (typeList[i] == "A") tableName = "TSIProcessData" + year + month;
          else if (typeList[i] == "B")
            tableName = "ASMProcessData" + year + month;
          else if (typeList[i] == "C")
            tableName = "IMProcessData" + year + month;
          else if (typeList[i] == "G")
            tableName = "LDProcessData" + year + month;
          else if (typeList[i] == "F")
            tableName = "LightProofSmokeProcessData" + year + month;
          let tableSql = await Raw.Query(
            `SELECT table_name FROM information_schema.TABLES WHERE table_name ='${tableName}'`
          );
          if (!tableSql)
            return {
              state: 1,
              dbTableData,
              data: [],
              msg: "查询成功",
            };
          const result = await Raw.QueryList(
            `select * from ${tableName} where InspectionNum=:InspectionNum  order by Second_NO asc`,
            {
              replacements: {
                InspectionNum: InspectionNum,
              },
            }
          );
          arr.push({
            IUTYPE: typeList[i],
            data: result,
          });
          InspectProcessInfo = result;
        }
      } else {
        let tableName = "";
        if (IUTYPE == "A") tableName = "TSIProcessData" + year + month;
        else if (IUTYPE == "B") tableName = "ASMProcessData" + year + month;
        else if (IUTYPE == "C") tableName = "IMProcessData" + year + month;
        else if (IUTYPE == "G") tableName = "LDProcessData" + year + month;
        else if (IUTYPE == "F")
          tableName = "LightProofSmokeProcessData" + year + month;
        let tableSql = await Raw.Query(
          `SELECT table_name FROM information_schema.TABLES WHERE table_name ='${tableName}'`
        );
        if (!tableSql)
          return {
            state: 1,
            dbTableData,
            data: [],
            msg: "查询成功",
          };
        InspectProcessInfo = await Raw.QueryList(
          `select * from ${tableName} where InspectionNum=:InspectionNum  order by Second_NO asc`,
          {
            replacements: {
              InspectionNum: InspectionNum,
            },
          }
        );
      }
      return {
        state: 1,
        dbTableData,
        data: InspectProcessInfo,
        msg: "查询成功",
      };
    } catch (error) {
      ctx.logger.error(error);
      return { state: 0, msg: "查询失败" };
    }
  }
  //OBD 检测过程数据
  async getObdInspectProcess({ InspectionNum }, { ctx, userid }) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      const InspectInfo = await Raw.Query(
        `select OBDInspectStartTime from OBDInfo where InspectionNum=:InspectionNum`,
        {
          replacements: {
            InspectionNum: InspectionNum,
          },
        }
      );
      if (
        !InspectInfo ||
        (InspectInfo && !InspectInfo.OBDInspectStartTime)
      ) {
        return {
          state: 1,
          data: [],
          msg: "查询失败",
        };
      }
      const year = JSON.stringify(InspectInfo.OBDInspectStartTime).substring(1, 5);
      const month = JSON.stringify(InspectInfo.OBDInspectStartTime).substring(6, 8);
      let tableName = "OBDProcessData" + year + month;
      let tableSql = await Raw.Query(
        `SELECT table_name FROM information_schema.TABLES WHERE table_name ='${tableName}'`
      );
      if (!tableSql)
        return {
          state: 1,
          data: [],
          msg: "查询成功",
        };
      const InspectProcessInfo = await Raw.QueryList(
        `select * from ${tableName} where InspectionNum=:InspectionNum  order by Second_NO asc`,
        {
          replacements: {
            InspectionNum: InspectionNum,
          },
        }
      );
      return {
        state: 1,
        data: InspectProcessInfo,
        msg: "查询成功",
      };
    } catch (error) {
      ctx.logger.error(error);
      return { state: 0, msg: "查询失败" };
    }
  }
  //黑匣子过程数据
  async getBlackBoxProcess({ InspectionNum }, { ctx, userid }) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      const InspectInfo = await Raw.Query(
        `select DetectStartTime,IUTYPE from InspectionData where InspectionNum=:InspectionNum`,
        {
          replacements: {
            InspectionNum: InspectionNum,
          },
        }
      );
      if (
        !InspectInfo ||
        (InspectInfo && !InspectInfo.DetectStartTime && !InspectInfo.IUTYPE)
      ) {
        return {
          state: 1,
          data: [],
          msg: "查询失败",
        };
      }
      const year = JSON.stringify(InspectInfo.DetectStartTime).substring(1, 5);
      const month = JSON.stringify(InspectInfo.DetectStartTime).substring(6, 8);
      const IUTYPE = InspectInfo.IUTYPE;
      let tableName = "";
      if (IUTYPE.indexOf("A") > -1) tableName = "HXZTSIProcessData" + year + month;
      else if (IUTYPE.indexOf("B") > -1) tableName = "HXZASMProcessData" + year + month;
      else if (IUTYPE.indexOf("C") > -1) tableName = "HXZIMProcessData" + year + month;
      else if (IUTYPE.indexOf("G") > -1) tableName = "HXZLDProcessData" + year + month;
      else if (IUTYPE.indexOf("F") > -1) tableName = "HXZLFProcessData" + year + month;
      let tableSql = await Raw.Query(
        `SELECT table_name FROM information_schema.TABLES WHERE table_name ='${tableName}'`
      );
      if (!tableSql)
        return {
          state: 1,
          data: [],
          msg: "不存在这张表！",
        };
      const BlackBoxProcessInfo = await Raw.QueryList(
        `select * from ${tableName} where inspection_id=:InspectionNum  order by Second_NO asc`,
        {
          replacements: {
            InspectionNum: InspectionNum,
          },
        }
      );

      let DBsql = ``;
      if (IUTYPE.indexOf("A") > -1)
        DBsql = `SELECT StationCode,inspection_id,CONVERT(varchar(100), time, 120) as ProcessTime,MAX(hc) as hc,MAX(o2) as o2,
			MAX(co) as co,MAX(co2) as co2,MAX(lambda) as lambda FROM ${tableName}  
			where inspection_id= :InspectionNum and time is not null 
			GROUP BY StationCode,inspection_id,CONVERT(varchar(100), time, 120) 
			order  BY inspection_id ,CONVERT(varchar(100), time, 120) asc `;
      else if (IUTYPE.indexOf("B") > -1)
        DBsql = ` SELECT StationCode,inspection_id,CONVERT(varchar(100), time, 120) as ProcessTime,MAX(hc) as hc,MAX(o2) as o2,
			MAX(co) as co,MAX(co2) as co2,MAX(no) as no,MAX(force) as force,MAX(speed) as speed,MAX(lambda) as lambda FROM ${tableName}  
			where inspection_id=:InspectionNum  and time is not null 
			GROUP BY StationCode,inspection_id,CONVERT(varchar(100), time, 120) 
			order  BY inspection_id ,CONVERT(varchar(100), time, 120) asc `;
      else if (IUTYPE.indexOf("C") > -1)
        DBsql = `SELECT COUNT(*) as sum,StationCode,inspection_id,CONVERT(varchar(100), time, 120) as ProcessTime,MAX(hc) as hc,MAX(o2) as o2,
			MAX(co) as co,MAX(co2) as co2,MAX(nox) as nox,MAX(force) as force,MAX(speed) as speed,MAX(lambda) as lambda FROM ${tableName}  
			where inspection_id=:InspectionNum and time is not null 
			GROUP BY StationCode,inspection_id,CONVERT(varchar(100), time, 120) 
			order  BY inspection_id ,CONVERT(varchar(100), time, 120) asc 
			`;
      else if (IUTYPE.indexOf("G") > -1)
        DBsql = `SELECT COUNT(*) as sum,StationCode,inspection_id,CONVERT(varchar(100), time, 120) as ProcessTime,MAX(n) as n,MAX(k) as k,MAX(co2) as co2,MAX(nox) as nox,MAX(force) as force,MAX(speed) as speed FROM ${tableName}  
			where inspection_id=:InspectionNum and time is not null
			GROUP BY StationCode,inspection_id,CONVERT(varchar(100), time, 120) 
			order  BY inspection_id ,CONVERT(varchar(100), time, 120) asc `;
      else if (IUTYPE.indexOf("F") > -1)
        DBsql = `SELECT StationCode,inspection_id,CONVERT(varchar(100), time, 120) as ProcessTime,MAX(n) as n,MAX(k) as k FROM ${tableName} 
			where inspection_id= :InspectionNum and  time is not null 
			GROUP BY StationCode,inspection_id,CONVERT(varchar(100), time, 120) 
			order  BY inspection_id ,CONVERT(varchar(100), time, 120) asc `;
      const DBInfo = await Raw.QueryList(DBsql, {
        replacements: {
          InspectionNum: InspectionNum,
        },
      });
      return {
        state: 1,
        data: BlackBoxProcessInfo,
        DBdata: DBInfo,
        msg: "查询成功",
      };
    } catch (error) {
      ctx.logger.error(error);
      return { state: 0, msg: "查询失败" };
    }
  }
  // 燃油蒸发检测过程数据
  async getFuelProcessData(param, { }) {
    const { app } = this;
    const { Raw } = app.Dbs.hj;
    try {
      let { InspectionNum, StartTime } = param;
      let message = ``, TankCoverProcessData = [], OilFillerProcessData = [];
      const year = JSON.stringify(StartTime).substring(1, 5);
      const month = JSON.stringify(StartTime).substring(6, 8);
      let tableName1 = "TankCoverProcessData" + year + month;
      let tableName2 = "OilFillerProcessData" + year + month;

      let tableSql1 = await Raw.Query(
        `SELECT table_name FROM information_schema.TABLES WHERE table_name ='${tableName1} '`
      );
      if (!tableSql1) {
        message += `找不到表${tableName1}`;
      } else {
        TankCoverProcessData = await Raw.QueryList(`select * from ${tableName1} where InspectionNum=:InspectionNum order by Second_NO asc`, {
          replacements: {
            InspectionNum: InspectionNum,
          },
        });
      }
      let tableSql2 = await Raw.Query(
        `SELECT table_name FROM information_schema.TABLES WHERE table_name ='${tableName2} '`
      );
      if (!tableSql2) {
        message += `找不到表${tableName2}`;
      } else {
        TankCoverProcessData = await Raw.QueryList(`select * from ${tableName2} where InspectionNum=:InspectionNum order by Second_NO asc`, {
          replacements: {
            InspectionNum: InspectionNum,
          },
        });
      }
      return JSON.stringify({ code: 1, message, TankCoverProcessData, OilFillerProcessData });
    } catch (error) {
      this.app.CoreAPI.Log.trace('getFuelProcessData报错' + error);
      return { code: 0, message: '查询失败', error }
    }
  }
  async getProxyPath({ }, { ctx, userid }) {
    const { app } = this;
    let { transaction, Raw } = app.Dbs.hj;
    try {
      let PictureVideoProxyPath = await app.redis
        .get("hj")
        .hget("systemconfig", "02_PictureVideoProxyPath");
      if (!PictureVideoProxyPath) {
        let res = await Raw.Query(
          "select FieldValue from Sys_Config where FieldKey='PictureVideoProxyPath' and SysConfigType='02'"
        );
        if (res) PictureVideoProxyPath = res.FieldValue;
      }
      if (PictureVideoProxyPath) return { PictureVideoProxyPath };
      else return { PictureVideoProxyPath: "HJMediaUrl" };
    } catch (error) {
      console.log(error);
      return { msg: "获取图片视频代理路径配置失败！", error };
    }
  }
  //历史查询-外观检信息
  async getAppearanceInfoData({ InspectionNum }, { ctx, userid }) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let ImgData = [];
      let InfoData = [];
      if (InspectionNum) {
        InfoData = await Raw.Query(
          `select * from AppearanceInfo where InspectionNum=:InspectionNum order by AppearanceDataID desc`,
          {
            replacements: {
              InspectionNum,
            },
          }
        ); //外观检信息

        if (InfoData) {
          ImgData = await Raw.QueryList(
            `select * from ExteriorInspectionFile where AppearanceDataID=:AppearanceDataID and IsPicAvailable != 1`,
            {
              replacements: {
                AppearanceDataID: InfoData.AppearanceDataID,
              },
            }
          ); //外观检图片
        }
      }

      return {
        state: 1,
        InfoData,
        ImgData,
        msg: "查询成功",
      };
    } catch (error) {
      ctx.logger.error(error);
      return { state: 0, msg: "查询失败" };
    }
  }

  //黑烟车抓拍查询
  async getBlackSmokeCheck({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      //console.log('------------',param);
      let {
        StationCode,
        VLPN,
        ZPRQ1,
        ZPRQ2,
        pageIndex,
        pageSize,
        InspectionNum,
        LingmanRank
      } = param;
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let where = " where 1=1";
      let reqParam = {};
      const page = (pageIndex - 1) * pageSize;
      if (pageSize) {
        reqParam.pageSize = pageSize;
        reqParam.RowNumber = page;
      } else {
        reqParam.pageSize = 8;
        reqParam.RowNumber = 0;
      }
      let imgList = await Raw.QueryList(
        "select FieldValue from Sys_Config where FieldKey = 'SmokeCapturePath'"
      );
      if (StationCode) where += " and StationCode like :StationCode";
      if (VLPN) where += " and VLPN like :VLPN ";
      if (LingmanRank || LingmanRank == 0) where += ` and LingmanRank = ${LingmanRank} `;
      if (InspectionNum) where += " and InspectionNum like :InspectionNum ";
      if (ZPRQ1 && ZPRQ2)
        where += " and CaptureTime >= :ZPRQ1 and CaptureTime <= :ZPRQ2 ";
      // console.log('where',where,pageSize,reqParam);
      let BlackSmokeCarSQL = `select TOP(:pageSize) InspectionNum,LingmanRank,VLPN,VLPNColor,StationCode,LineCode,CaptureTime,ImgFile1,VideoFile from (
        select ROW_NUMBER() OVER (ORDER BY CaptureTime desc) as RowNumber,*
        from BlackSmokeCarCapture ${where} )  BlackSmokeCarCapture  where RowNumber > :RowNumber order by RowNumber`
      let data = await Raw.QueryList(BlackSmokeCarSQL,
        {
          replacements: {
            StationCode: "%" + StationCode + "%",
            VLPN: "%" + VLPN + "%",
            InspectionNum: "%" + InspectionNum + "%",
            ZPRQ1,
            ZPRQ2,
            ...reqParam,
          },
        }
      );

      const Count = await Raw.Query(
        `select count(1) as total from BlackSmokeCarCapture ${where}`,
        {
          replacements: {
            StationCode: "%" + StationCode + "%",
            VLPN: "%" + VLPN + "%",
            InspectionNum: "%" + InspectionNum + "%",
            ZPRQ1,
            ZPRQ2,
            ...reqParam,
          },
        }
      );
      return JSON.stringify({
        code: 200,
        data,
        msg: "查询成功",
        imgList,
        Count,
      });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ code: 0, msg: "查询失败" });
    }
  }
  async getBlackSmokeParam({ param }, { ctx, userid }) {
    try {
      let { app } = this;
      const { Raw } = app.Dbs.hj;
      let data = await Raw.Query(`select inspectionDataID, vehicleID, IUTYPE,VDCT from InspectionData 
        WHERE InspectionNum=:InspectionNum`, {
        replacements: {
          InspectionNum: param,
        }
      });
      return JSON.stringify({
        code: 1,
        data,
      });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ code: 0, msg: "查询失败" });
    }
  }

  async getisUseMapIP({ }, { ctx, userid }) {
    try {
      const { app } = this;
      const { Raw } = app.Dbs.hj;
      let res = await ctx.service.c440600.stationManagement.commonService.GetAreaRole(); //行政区域
      let hasProRole = res.data.some(item => item.length === 2)
      if (!this.ctx.User.isAdmin && !hasProRole) return { isUseMapIP: "false" };
      let isUseMapIP = await app.redis
        .get("hj")
        .hget("systemconfig", "02_isUseMapIPtoIE");
      if (!isUseMapIP) {
        let res = await Raw.Query(
          "select FieldValue from Sys_Config where FieldKey='isUseMapIPtoIE' and SysConfigType='02'"
        );
        if (res) isUseMapIP = res.FieldValue;
      }
      if (isUseMapIP) return { isUseMapIP };
      else return { isUseMapIP: "false" };
    } catch (error) {
      this.app.CoreAPI.Log.trace('getisUseMapIP方法报错：' + error);
      return { code: 0, msg: '查询失败', error };
    }
  }
  async getMapIPtoIE({ }, { ctx, userid }) {
    try {
      const { app } = this;
      const { Raw } = app.Dbs.hj;
      let MapIPtoIE = await app.redis
        .get("hj")
        .hget("systemconfig", "02_MapIPtoIE");
      if (!MapIPtoIE) {
        let res = await Raw.Query(
          "select FieldValue from Sys_Config where FieldKey='MapIPtoIE' and SysConfigType='02'"
        );
        if (res) MapIPtoIE = res.FieldValue;
      }
      if (MapIPtoIE) return { MapIPtoIE };
      else return { MapIPtoIE: "127.0.0.1" };
    } catch (error) {
      this.app.CoreAPI.Log.trace('getMapIPtoIE方法报错：' + error);
      return { code: 0, msg: '查询失败', error };
    }
  }
  // 获取系统配置信息
  async getAllSysConfig({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { where, sysConfigType } = param;
      const { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let sql = " ";
      let paramsObj = {};
      if (where) {
        sql += "  and ( FieldKey like :where or FieldName like :where or Remarks like :where ) ";
        paramsObj.where = "%" + where + "%";
      }
      if (sysConfigType) {
        sql += " and SysConfigType =:sysConfigType ";
        paramsObj.sysConfigType = sysConfigType;
      }
      sql += " order by SysConfigType, OrderId asc";
      const data = await Raw.QueryList(`select * from Sys_Config where 1=1 ${sql}`, {
        replacements: paramsObj,
      });
      return { data: data };
    } catch (error) {
      this.ctx.logger.error(error);
    }
  }
  // 获取视频播放通道号
  async getVideoChannel({ StationCode, SceneCode }, { ctx, userid }) {
    try {
      const { app } = this;
      const { Raw } = app.Dbs.hj;
      let channel = await Raw.Query(
        `select top 1 CAMChannel from Cameras where StationCode=:StationCode and LineCode=:SceneCode`,
        {
          replacements: {
            StationCode: StationCode,
            SceneCode: SceneCode
          },
        }
      );
      return { code: 1, data: { channel: channel.CAMChannel } };
    } catch (error) {
      this.app.CoreAPI.Log.trace("getVideoChannel方法报错：" + error);
      return { code: 0, msg: "获取失败！", error };
    }
  }

  //获取硬盘录像机信息
  async getDVRInfo({ stationID, SceneCode }, { ctx, userid }) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;

      let whereArr = [];
      let where = "";
      if (stationID) whereArr.push("StationCode= :stationID");
      if (SceneCode) whereArr.push("LineCode= :SceneCode");
      if (whereArr.length > 0) where = " and " + whereArr.join(" and ");

      const DVRInfo = await Raw.Query(
        `select * from DVRInfo where DVRID=(select top 1 DVRID from Cameras where 1=1 ${where})`,
        {
          replacements: {
            stationID: stationID,
            SceneCode: SceneCode,
          },
        }
      );
      if (DVRInfo) {
        const CityInfo = await Raw.Query(
          `select CityCode from StationInfo where StationCode='${stationID}'`
        );
        DVRInfo.CityCode = CityInfo.CityCode;
      }

      return { state: 1, DVRInfo: DVRInfo, msg: "查询成功" };
    } catch (error) {
      ctx.logger.error(error);
      return { state: 0, msg: "查询失败", error };
    }
  }
  // 报警历史信息
  async getAlarmHistory(param, { ctx, userid }) {

    const {app}=this;
    const {Raw}=app.Dbs.hj;
    try {
      const { InspectionNum } = param;
      let str = `检测数据处于报警状态，报警信息：`;
      const result = await Raw.QueryList(`select InspectionNum,AlarmDeal,(select CodeName from CD_AlarmType where CodeValue=AlarmType)as AlarmType from Alarm where  InspectionNum=:InspectionNum and AlarmDeal='01'`, {
        replacements: {
          InspectionNum
        }
      });
   
      
      if (result.length>0) {
        result.forEach(e => {
          str += e.AlarmType+';'
        });
        return { code: 1,str,result};
      }else{
        return { code: 0};
      }

     
    } catch (error) {
      ctx.logger.error(error);
      return { code: 0, msg: "查询失败" };
    }
  }

}
module.exports = reportManagement;