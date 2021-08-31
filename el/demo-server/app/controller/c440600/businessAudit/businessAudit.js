"use strict";

const await = require("await-stream-ready/lib/await");

/* 业务审核 */
const Controller = require("egg").Controller;
const path = require("path");
const fs = require("fs");
class BusinessAuditController extends Controller {
  // 获取检测记录信息
  async getInspectionRecord({ params }) {
    const { app } = this;
    const { Raw } = app.Dbs.hj;
    try {
      let { VLPN, IUVTYPE, model } = params;
      let where = `1=1`;
      if (!model) {
        where += ` and VLPN = '${VLPN}'`;
      } else {
        where += ` and IUVTYPE = '${IUVTYPE}'`;
      }
      let rsult = await Raw.QueryList(
        `select VLPN,VLPNColor,StationCode,InspectionReportNo,DetectEndTime,IUTYPE, VDCT from InspectionData where ${where}`
      );
      return { state: 1, msg: "请求成功!", data: rsult };
    } catch (error) {
      app.CoreAPI.Log.trace("getInspectionRecord：" + error);
      return {
        state: 0,
        msg: "请求失败!",
      };
    }
  }
  //业务审核
  async getAuditInfo({}, { ctx, userid }) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let checkTime = ctx.helper.dataFormat(new Date(), "yyyy-MM-dd 00:00:00");
      let whereArr = [];
      let where = "";
      //非管理员数据过滤
      let limitReplace = {};
      let areaRole = [];
      let res = await ctx.service.c440600.stationManagement.commonService.GetAreaRole();
      if (res.state) areaRole = res.data;
      let auditRole = []; //审核权限
      let reasonRole = []; //审核原因(受理审核子项)
      res = await ctx.service.c440600.stationManagement.commonService.GetAuditRole();
      if (res.state) {
        auditRole = res.auditRole;
        reasonRole = res.reasonRole;
      }
      if (
        !this.ctx.User.isAdmin &&
        (areaRole.length == 0 ||
          (auditRole.length == 0 && reasonRole.length == 0))
      )
        return {
          state: 1,
          data: [],
          dataCount: 0,
        };
      if (
        !this.ctx.User.isAdmin &&
        areaRole.length > 0 &&
        !areaRole.find((t) => t.length == 2)
      ) {
        let limitWhere = "";
        let limitArr = [];
        let area = areaRole[0];
        if (area.length == 4) {
          // 市级用户
          // 查询该市下是否有需过滤的区数据
          let city = await Raw.Query(
            `select AreaCode from Area where AreaCode like '${area}%' and ParentAreaCode='${
              area.slice(0, 2) + "0000"
            }'`
          );
          let county = await Raw.QueryList(
            `select AreaCode from Area where ParentAreaCode='${city.AreaCode}' and Memo='2'`
          );
          county = county.map((item) => item.AreaCode);
          if (county.length > 0) {
            limitReplace[`areaRole`] = area + "%";
            limitArr.push(
              `(OrgCode like :areaRole or Applicant like :areaRole) and left(OrgCode,6) not in (${county.join(
                ","
              )})`
            );
          } else {
            limitReplace[`areaRole`] = area + "%";
            limitArr.push(
              `OrgCode like :areaRole or Applicant like :areaRole or CityCode like :areaRole`
            );
          }
        } else {
          // 区级用户
          limitReplace[`areaRole`] = area + "%";
          limitArr.push(
            `OrgCode like :areaRole or Applicant like :areaRole or CountyCode like :areaRole`
          );
        }
        if (limitArr.length) {
          limitWhere = "(" + limitArr.join(" or ") + ")";
          whereArr.push(limitWhere);
        }
      }

      //审核大项
      if (auditRole.length > 0) limitReplace["auditRole"] = auditRole;

      //审核子项
      if (reasonRole.length > 0) limitReplace["reasonRole"] = reasonRole;

      if (auditRole.length > 0 && reasonRole.length > 0)
        whereArr.push(
          `(CheckType in (:auditRole) or ApplyReason in (:reasonRole))`
        );
      else if (auditRole.length > 0 && reasonRole.length == 0)
        whereArr.push(`CheckType in (:auditRole)`);
      else if (auditRole.length == 0 && reasonRole.length > 0)
        whereArr.push(`ApplyReason in (:reasonRole)`);
        
      // 判断登录人员负责的站点
      let cuser=this.ctx.helper.getCurrentUser();
      let stationCode = cuser['userOrg']
      if(stationCode){
        where += ` and OrgCode = '${stationCode}'`;
      }

      if (whereArr.length > 0) where = "and " + whereArr.join(" and ");
      
      const sqls = `select CheckId,CheckType,BusinessKey,BusinessTable,
                            UniqueString,OrgCode,VLPN,VLPNColor,
                            VehicleID,AuditState,Status,FuelType,ProductDate,GAVType,
                            IUVTYPE,ApplyUserName,ApplyTime,ApplyReason,
                            CheckTime,Checker,VIN,OwnerName,InspectionNature
                    from WaitCheck                                       
                    where Status='0' ${where}  and DateDiff(dd,ApplyTime,getdate())=0  order by ApplyTime desc`;
      //and DateDiff(dd,ApplyTime,getdate())=0
      const result = await Raw.QueryList(sqls, {
        replacements: Object.assign(
          {
            checkTime: checkTime,
          },
          limitReplace
        ),
      });
      return {
        state: 1,
        auditList: result,
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
      };
    }
  }

  //业务审核历史查询
  async getAuditHistory({ param, IsExport }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { pageIndex, pageSize, formItem, selInputValue } = param;
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let whereArr = [];
      let where = "";

      //非管理员数据过滤
      let limitReplace = {};
      let areaRole = [];
      let res = await ctx.service.c440600.stationManagement.commonService.GetAreaRole();
      if (res.state) areaRole = res.data;
      let auditRole = []; //审核权限
      let reasonRole = []; //审核原因(受理审核子项)
      res = await ctx.service.c440600.stationManagement.commonService.GetAuditRole();
      if (res.state) {
        auditRole = res.auditRole;
        reasonRole = res.reasonRole;
      }
      if (
        !this.ctx.User.isAdmin &&
        (areaRole.length == 0 ||
          (auditRole.length == 0 && reasonRole.length == 0))
      )
        return {
          state: 1,
          data: [],
          dataCount: 0,
        };
      if (
        !this.ctx.User.isAdmin &&
        areaRole.length > 0 &&
        !areaRole.find((t) => t.length == 2)
      ) {
        let limitWhere = "";
        let limitArr = [];
        areaRole.forEach((areaCode, index) => {
          limitReplace[`areaRole${index}`] = areaCode + "%";
          limitArr.push(
            `OrgCode like :areaRole${index} or Applicant like :areaRole${index}`
          );
        });
        limitWhere = "(" + limitArr.join(" or ") + ")";
        whereArr.push(limitWhere);
      }

      //审核大项
      if (auditRole.length > 0) limitReplace["auditRole"] = auditRole;

      //审核子项
      if (reasonRole.length > 0) limitReplace["reasonRole"] = reasonRole;

      if (auditRole.length > 0 && reasonRole.length > 0)
        whereArr.push(
          `(CheckType in (:auditRole) or ApplyReason in (:reasonRole))`
        );
      else if (auditRole.length > 0 && reasonRole.length == 0)
        whereArr.push(`CheckType in (:auditRole)`);
      else if (auditRole.length == 0 && reasonRole.length > 0)
        whereArr.push(`ApplyReason in (:reasonRole)`);

      if (!+IsExport) {
        // if (selInputValue) whereArr.push(' VLPN like :selInputValue or CheckId like :selInputValue or OrgCode like :selInputValue');
        if (formItem.VLPN) whereArr.push(" VLPN like :VLPN");
        if (formItem.VLPNColor) whereArr.push(" VLPNColor like :VLPNColor");
        if (formItem.ESPOrganizationCode)
          whereArr.push("OrgCode=:ESPOrganizationCode");
        if (formItem.CheckType) whereArr.push("CheckType=:CheckType");
        if (formItem.ApplyReason)
          whereArr.push("ApplyReason like :ApplyReason");
        if (formItem.VIN != "") whereArr.push("VIN like :VIN");
        if (formItem.Status) whereArr.push("Status=:Status");
        if (formItem.CheckId !== "") whereArr.push("CheckId=:CheckId");
        if (formItem.AuditState) whereArr.push("AuditState=:AuditState");
        if (formItem.timeRange[0]) {
          whereArr.push("ApplyTime>=:fromTime");
          whereArr.push("ApplyTime<=:toTime");
        }
        if (whereArr.length > 0) where = " and " + whereArr.join(" and ");
        const replacements = {
          pageSize,
          RowNumber: (pageIndex - 1) * pageSize,
          selInputValue: "%" + selInputValue + "%",
          VLPN: "%" + formItem.VLPN + "%",
          VLPNColor: "%" + formItem.VLPNColor + "%",
          VIN: "%" + formItem.VIN + "%",
          ESPOrganizationCode: formItem.ESPOrganizationCode,
          AuditState: formItem.AuditState,
          Status: formItem.Status,
          CheckType: formItem.CheckType,
          CheckId: formItem.CheckId,
          ApplyReason: "%" + formItem.ApplyReason + "%",
          fromTime: formItem.timeRange[0],
          toTime: formItem.timeRange[1],
        };
        const result = await Raw.QueryList(
          `SELECT TOP(:pageSize) * FROM 
                        (
                            SELECT ROW_NUMBER() OVER (ORDER BY ApplyTime desc) AS RowNumber,OrgCode,CheckId,
                            VLPN,VLPNColor,VehicleID,VIN,CheckTime,Checker,BusinessKey,UniqueString,
                            FuelType,CheckType,ApplyUserName,
                            ApplyTime,ApplyReason,Status,AuditState
                            from WaitCheck  
                                where 1=1 ${where}
                        ) a  where RowNumber >:RowNumber`,
          {
            replacements: Object.assign(replacements, limitReplace),
          }
        );

        const Count = await Raw.Query(
          `select count(1) as total from WaitCheck 
                        where 1=1 ${where}`,
          {
            replacements: Object.assign(replacements, limitReplace),
          }
        );
        return {
          state: 1,
          data: result,
          dataCount: Count,
          msg: "查询成功！",
        };
      } else {
        if (whereArr.length > 0) where = " and " + whereArr.join(" and ");
        const allResult = await Raw.QueryList(
          `select OrgCode,CheckId,VLPN,VLPNColor,VehicleID,VIN,CheckTime,Checker,BusinessKey,FuelType,CheckType,ApplyUserName,
          ApplyTime,ApplyReason,Status,AuditState from WaitCheck  where 1=1 ${where} ORDER BY ApplyTime desc`,
          {
            replacements: Object.assign({}, limitReplace),
          }
        );
        return {
          state: 1,
          msg: "查询成功！",
          allResult,
        };
      }
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
        msg: "查询失败！",
      };
    }
  }

  //业务审核-受理审核
  async getAcceptAudit({ CheckId }, { ctx, userid }) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      //车辆信息及审核信息
      const WaitCheck = await Raw.Query(
        `select * from WaitCheck where CheckId=:CheckId`,
        {
          replacements: {
            CheckId: CheckId,
          },
        }
      );
      //受理信息
      const AcceptAudit = await Raw.Query(
        `select * from V_WaitCheck_AcceptanceAudit where CheckId=:CheckId`,
        {
          replacements: {
            CheckId: CheckId,
          },
        }
      );
      return {
        state: 1,
        data: {
          WaitCheck: WaitCheck,
          AcceptAudit: AcceptAudit,
          msg: "查询成功！",
        },
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
        msg: "查询失败！",
      };
    }
  }

  //受理审核-非工况原因信息
  async getFGKData({ InspectionNum }, { ctx, userid }) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      const FGKInfo = await Raw.Query(
        `select * from AcceptanceFGKReason where InspectionNum=:InspectionNum`,
        {
          replacements: {
            InspectionNum: InspectionNum,
          },
        }
      );

      return {
        state: 1,
        data: {
          FGKInfo: FGKInfo,
        },
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
      };
    }
  }

  //业务审核-车型审核
  async getModelReview({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { CheckId, VehicleID } = param;
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      const WaitCheck = await Raw.Query(
        `select * from WaitCheck where CheckId=:CheckId`,
        {
          replacements: {
            CheckId: CheckId,
          },
        }
      );
      const VehicleInfo = await Raw.Query(
        `select * from Vehicle where VehicleID=:VehicleID`,
        {
          replacements: {
            VehicleID: VehicleID,
          },
        }
      );

      return {
        state: 1,
        data: {
          WaitCheck: WaitCheck,
          VehicleInfo: VehicleInfo,
        },
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
      };
    }
  }

  //业务审核-车型审核图片
  async getUploadFileData({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { BusinessKey, BusinessType } = param;
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let result = [];
      if (BusinessKey && BusinessType) {
        result = await Raw.QueryList(
          `select * from UploadFileData where BusinessKey=:BusinessKey and BusinessType=:BusinessType`,
          {
            replacements: {
              BusinessKey: BusinessKey,
              BusinessType: BusinessType,
            },
          }
        );
      }
      return {
        state: 1,
        data: {
          imgList: result,
        },
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
      };
    }
  }

  //业务审核-变更登记审核图片或转入二手车
  async getChangeRegistratImage({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { BusinessType, BusinessKey, ApplyTime } = param;
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let result = [];
      if (BusinessKey && BusinessType && ApplyTime) {
        result = await Raw.QueryList(
          `select * from UploadFileData where BusinessType =:BusinessType and BusinessKey =:BusinessKey and  CONVERT(varchar(100),UploadFileTime, 23) =:ApplyTime`,
          {
            replacements: {
              BusinessType: BusinessType,
              BusinessKey: BusinessKey,
              ApplyTime: ctx.helper.dataFormat(ApplyTime, "yyyy-MM-dd"),
            },
          }
        );
      }
      return {
        state: 1,
        data: {
          imgList: result,
        },
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
      };
    }
  }

  //业务审核-环检抽查审核
  async getSpotCheckAudit({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { CheckId, RingTestSpotCheckID } = param;
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      //审核表
      const WaitCheck = await Raw.Query(
        `select * from WaitCheck where CheckId=:CheckId`,
        {
          replacements: {
            CheckId: CheckId,
          },
        }
      );

      //环检抽查明显表
      const RingTestSpotCheck = await Raw.Query(
        `select * from RingTestSpotCheck where RingTestSpotCheckID=:RingTestSpotCheckID`,
        {
          replacements: {
            RingTestSpotCheckID: RingTestSpotCheckID,
          },
        }
      );

      //外检信息表
      let AppearanceDataID = 0;
      if (RingTestSpotCheck)
        AppearanceDataID = RingTestSpotCheck.AppearanceDataID;
      const AppearanceData = await Raw.Query(
        `select * from AppearanceInfo where AppearanceDataID=:AppearanceDataID`,
        {
          replacements: {
            AppearanceDataID: AppearanceDataID,
          },
        }
      );

      //外检图片列表
      const ExternalImgList = await Raw.QueryList(
        `
               select ID,VLPN,VLPNColor,VehicleID,PicType,DisplayName,FullFileName,Bytes,IsPicAvailable 
                from ExteriorInspectionFile
                where AppearanceDataID=:AppearanceDataID order by UploadTime desc`,
        {
          replacements: {
            AppearanceDataID: AppearanceDataID,
          },
        }
      );
      return {
        state: 1,
        data: {
          WaitCheck: WaitCheck,
          RingTestSpotCheck: RingTestSpotCheck,
          AppearanceData: AppearanceData,
          ExternalImgList: ExternalImgList,
        },
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
      };
    }
  }
  //业务审核-检测方法变更
  async getChangeIutype({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { VehicleID, BusinessKey } = param;
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let result = [];
      if (VehicleID) {
        result = await Raw.QueryList(
          `select '检测方法' as Iutype,inspectionMethodBefore,InspectionMethodAfter,ID,IUVTYPE from ApplyModifyInspectionMethod 
          WHERE VehicleID=:VehicleID and ID=:ID`,
          {
            replacements: {
              VehicleID: VehicleID,
              ID: BusinessKey,
            },
          }
        );
      }
      return {
        state: 1,
        data: result,
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
      };
    }
  }
  //业务审核-检测方法变更-提示
  async getInspectRatio({ params }, { ctx, userid }) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let res = {};
      let lastestData = {};
      params = JSON.parse(params);
      if (params == {}) {
        return {
          state: 0,
        };
      }
      let {
        FactoryPlateModel,
        IUVTYPE,
        IUETYPE,
        VehicleID,
        AcceptanceDate,
      } = params;

      let VrdateObj = await Raw.Query(
        `select top 1 Vrdate from Vehicle where VehicleID=${VehicleID} and IsInValid = 0`
      );
      if (VrdateObj != {}) {
        res = await Raw.Query(
          `SELECT top(1) IUTYPE,InspectDoneTimes,InspectRatio,InspectWayType 
          from T_VEHICLES_ANAlYSE 
          WHERE FactoryPlateModel=:FactoryPlateModel and IUVTYPE=:IUVTYPE and IUETYPE=:IUETYPE and FILENAME<=:FILENAME 
          ORDER BY InspectDoneTimes desc, InspectRatio desc`,
          {
            replacements: {
              FactoryPlateModel: FactoryPlateModel,
              IUVTYPE: IUVTYPE,
              IUETYPE: IUETYPE,
              FILENAME: VrdateObj.Vrdate,
            },
          }
        );
      }
      lastestData = await Raw.Query(
        `select top 1 StationCode,DetectStartTime,DetectEndTime,VDCT,IUTYPE
        from InspectionData where VehicleID=:VehicleID and DetectEndTime<:DetectEndTime ORDER BY DetectEndTime desc`,
        {
          replacements: {
            VehicleID: VehicleID,
            DetectEndTime: AcceptanceDate,
          },
        }
      );

      return {
        state: 1,
        data: res,
        lastestData,
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
      };
    }
  }

  //获取外检修改审核信息
  async getOutInspectUpdateAudit({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { CheckId, ApplyID } = param;
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      //审核表
      const WaitCheck = await Raw.Query(
        `select * from WaitCheck where CheckId=:CheckId`,
        {
          replacements: {
            CheckId: CheckId,
          },
        }
      );

      //外检修改审核表
      const ApplyExteriorEdit = await Raw.Query(
        `select * from ApplyExteriorEdit where ApplyID=:ApplyID`,
        {
          replacements: {
            ApplyID: ApplyID,
          },
        }
      );

      //外检信息表
      let AppearanceDataID = 0;
      if (ApplyExteriorEdit)
        AppearanceDataID = ApplyExteriorEdit.AppearanceDataID;
      const AppearanceData = await Raw.Query(
        `select * from AppearanceInfo where AppearanceDataID=:AppearanceDataID`,
        {
          replacements: {
            AppearanceDataID: AppearanceDataID,
          },
        }
      );

      //外检图片列表
      const ExternalImgList = await Raw.QueryList(
        `
                  select ID,VLPN,VLPNColor,VehicleID,PicType,DisplayName,FullFileName,Bytes,IsPicAvailable 
                   from ExteriorInspectionFile
                   where AppearanceDataID=:AppearanceDataID order by UploadTime desc`,
        {
          replacements: {
            AppearanceDataID: AppearanceDataID,
          },
        }
      );

      return {
        state: 1,
        data: {
          WaitCheck: WaitCheck,
          ApplyExteriorEdit: ApplyExteriorEdit,
          AppearanceData: AppearanceData,
          ExternalImgList: ExternalImgList,
        },
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
      };
    }
  }

  //车型审核-方式一
  async getCartTypeList({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { CLXH, FDJXH, CLSB, pageSize, currentPage } = param;
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let whereArr = [];
      let where = "";
      if (CLXH) whereArr.push("CLXH like :CLXH");
      if (FDJXH) whereArr.push("FDJXH like :FDJXH");
      if (CLSB) whereArr.push("CLSB like :CLSB");
      if (whereArr.length > 0) where = "and " + whereArr.join(" and ");
      const result = await Raw.QueryList(
        `select TOP(:pageSize) * from (SELECT ROW_NUMBER() OVER (ORDER BY FILENAME desc) AS RowNumber,
            CLXH,PF,FILENAME,FDJXH,CLSB,MANUF,FDJSCC,CLMC,CLLB from T_VEHICLES where 1=1 ${where}
            ) T_VEHICLES where RowNumber >:RowNumber`,
        {
          replacements: {
            CLXH: "%" + CLXH + "%",
            FDJXH: "%" + FDJXH + "%",
            CLSB: "%" + CLSB + "%",
            pageSize: pageSize || 20,
            RowNumber: (currentPage - 1) * pageSize,
          },
        }
      );
      const count = await Raw.Query(
        `select count (*) as zs from T_VEHICLES where 1=1 ${where}`,
        {
          replacements: {
            CLXH: "%" + CLXH + "%",
            FDJXH: "%" + FDJXH + "%",
            CLSB: "%" + CLSB + "%",
          },
        }
      );
      return {
        state: 1,
        data: {
          cartTypeList: result,
          count,
        },
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
      };
    }
  }

  //车型审核-方式二
  async getEmissionStandard(vehicle, { ctx, userid }) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let emissionStandard = "";
      if (vehicle.FuelType != "B" && !vehicle.HasOBD) {
        return {
          state: 0,
          msg: "OBD信息不能为空！",
        };
      }
      let gaVTypeModel = await Raw.Query(
        `select * from RL_HBVType_GAVType where GAVType=:GAVType`,
        {
          replacements: {
            GAVType: vehicle.GAVType,
          },
        }
      );
      if (gaVTypeModel.VehicleBigType == "02") {
        if (gaVTypeModel.GAVType == "M21") {
          if (new Date(vehicle.VRDATE) < new Date("2003-07-01")) {
            emissionStandard = "00";
          } else if (
            new Date("2003-07-01") <= new Date(vehicle.VRDATE) &&
            new Date(vehicle.VRDATE) < new Date("2005-01-01")
          ) {
            emissionStandard = "01";
          } else if (
            new Date("2005-01-01") <= new Date(vehicle.VRDATE) &&
            new Date(vehicle.VRDATE) < new Date("2010-07-01")
          ) {
            emissionStandard = "02";
          } else if (new Date("2010-07-01") <= new Date(vehicle.VRDATE)) {
            emissionStandard = "03";
          }
        } else if (
          gaVTypeModel.GAVType == "M12" ||
          gaVTypeModel.GAVType == "M22"
        ) {
          if (new Date(vehicle.VRDATE) < new Date("2004-01-01")) {
            emissionStandard = "00";
          } else if (
            new Date("2004-01-01") <= new Date(vehicle.VRDATE) &&
            new Date(vehicle.VRDATE) < new Date("2006-01-01")
          ) {
            emissionStandard = "01";
          } else if (
            new Date("2006-01-01") <= new Date(vehicle.VRDATE) &&
            new Date(vehicle.VRDATE) < new Date("2010-07-01")
          ) {
            emissionStandard = "02";
          } else if (new Date("2010-07-01") <= new Date(vehicle.VRDATE)) {
            emissionStandard = "03";
          }
        } else if (new Date(vehicle.VRDATE) < new Date("2003-07-01")) {
          emissionStandard = "00";
        } else if (
          new Date("2003-07-01") <= new Date(vehicle.VRDATE) &&
          new Date(vehicle.VRDATE) < new Date("2005-01-01")
        ) {
          emissionStandard = "01";
        } else if (
          new Date("2005-01-01") <= new Date(vehicle.VRDATE) &&
          new Date(vehicle.VRDATE) < new Date("2011-07-01")
        ) {
          emissionStandard = "02";
        } else if (new Date("2011-07-01") <= new Date(vehicle.VRDATE)) {
          emissionStandard = "03";
        }
        return {
          emissionStandard,
        }; //摩托车返回的排放标准
      }
      if (gaVTypeModel.VehicleBigType == "03") {
        if (new Date(vehicle.VRDATE) < new Date("2007-01-01")) {
          emissionStandard = "00";
        } else if (
          new Date("2007-01-01") <= new Date(vehicle.VRDATE) &&
          new Date(vehicle.VRDATE) < new Date("2008-01-01")
        ) {
          emissionStandard = "01";
        } else if (new Date(vehicle.VRDATE) >= new Date("2008-01-01")) {
          emissionStandard = "02";
        }
        return {
          emissionStandard,
        };
      }
      if (vehicle.FuelType == "B") {
        if (
          vehicle.VML > 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2017-07-01")
        ) {
          emissionStandard = "05";
        } else if (
          vehicle.VML <= 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2018-01-01")
        ) {
          emissionStandard = "05";
        } else if (
          vehicle.VML > 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2013-07-01") &&
          new Date(vehicle.VRDATE) < new Date("2017-07-01")
        ) {
          emissionStandard = "04";
        } else if (
          vehicle.VML <= 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2013-07-01") &&
          new Date(vehicle.VRDATE) < new Date("2018-01-01")
        ) {
          emissionStandard = "04";
        } else if (
          vehicle.VML > 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2008-07-01") &&
          new Date(vehicle.VRDATE) < new Date("2013-07-01")
        ) {
          emissionStandard = "03";
        } else if (
          gaVTypeModel.PG == "02" &&
          vehicle.VML <= 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2009-07-01") &&
          new Date(vehicle.VRDATE) < new Date("2013-07-01")
        ) {
          emissionStandard = "03";
        } else if (
          gaVTypeModel.PG == "01" &&
          vehicle.VML <= 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2008-07-01") &&
          new Date(vehicle.VRDATE) < new Date("2013-07-01")
        ) {
          emissionStandard = "03";
        } else if (
          gaVTypeModel.PG == "01" &&
          vehicle.VML <= 2500 &&
          vehicle.RatedSeats <= 6 &&
          new Date(vehicle.VRDATE) >= new Date("2005-07-01") &&
          new Date(vehicle.VRDATE) < new Date("2008-07-01")
        ) {
          emissionStandard = "02";
        } else if (
          gaVTypeModel.PG == "02" &&
          vehicle.VML <= 2500 &&
          vehicle.RatedSeats <= 6 &&
          new Date(vehicle.VRDATE) >= new Date("2005-07-01") &&
          new Date(vehicle.VRDATE) < new Date("2009-07-01")
        ) {
          emissionStandard = "02";
        } else if (
          gaVTypeModel.PG == "01" &&
          vehicle.VML <= 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2006-07-01") &&
          new Date(vehicle.VRDATE) < new Date("2008-07-01")
        ) {
          emissionStandard = "02";
        } else if (
          gaVTypeModel.PG == "02" &&
          vehicle.VML <= 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2006-07-01") &&
          new Date(vehicle.VRDATE) < new Date("2009-07-01")
        ) {
          emissionStandard = "02";
        } else if (
          vehicle.VML > 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2004-09-01") &&
          new Date(vehicle.VRDATE) < new Date("2008-07-01")
        ) {
          emissionStandard = "02";
        } else if (
          gaVTypeModel.PG == "01" &&
          vehicle.VML <= 2500 &&
          vehicle.RatedSeats <= 6 &&
          new Date(vehicle.VRDATE) >= new Date("2000-07-01") &&
          new Date(vehicle.VRDATE) < new Date("2005-07-01")
        ) {
          emissionStandard = "01";
        } else if (
          vehicle.VML <= 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2001-10-01") &&
          new Date(vehicle.VRDATE) < new Date("2006-07-01")
        ) {
          emissionStandard = "01";
        } else if (
          vehicle.VML > 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2001-09-01") &&
          new Date(vehicle.VRDATE) < new Date("2004-09-01")
        ) {
          emissionStandard = "01";
        } else if (
          gaVTypeModel.PG == "01" &&
          vehicle.VML <= 2500 &&
          vehicle.RatedSeats <= 6 &&
          new Date(vehicle.VRDATE) < new Date("2000-07-01")
        ) {
          emissionStandard = "00";
        } else if (
          vehicle.VML <= 3500 &&
          new Date(vehicle.VRDATE) < new Date("2001-10-01")
        ) {
          emissionStandard = "00";
        } else if (
          vehicle.VML > 3500 &&
          new Date(vehicle.VRDATE) < new Date("2001-09-01")
        ) {
          emissionStandard = "00";
        }
        return {
          emissionStandard,
        };
      } else {
        if (
          vehicle.VML <= 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2017-01-01")
        ) {
          emissionStandard = "05";
        } else if (
          vehicle.VML > 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2013-07-01")
        ) {
          emissionStandard = "04";
        } else if (
          vehicle.FuelType != "A" &&
          vehicle.VML > 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2011-01-01")
        ) {
          emissionStandard = "04";
        } else if (
          vehicle.VML <= 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2011-07-01") &&
          new Date(vehicle.VRDATE) < new Date("2017-01-01")
        ) {
          emissionStandard = "04";
        } else if (
          gaVTypeModel.PG == "01" &&
          vehicle.VML <= 2500 &&
          vehicle.RatedSeats <= 6 &&
          vehicle.HasOBD == "1" &&
          new Date(vehicle.VRDATE) >= new Date("2009-07-01") &&
          new Date(vehicle.VRDATE) < new Date("2011-07-01")
        ) {
          emissionStandard = "03";
        } else if (
          gaVTypeModel.PG == "01" &&
          vehicle.VML <= 2500 &&
          vehicle.RatedSeats <= 6 &&
          vehicle.HasOBD == "0" &&
          new Date(vehicle.VRDATE) >= new Date("2008-07-01") &&
          new Date(vehicle.VRDATE) < new Date("2011-07-01")
        ) {
          emissionStandard = "03";
        } else if (
          vehicle.VML <= 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2008-07-01") &&
          new Date(vehicle.VRDATE) < new Date("2011-07-01")
        ) {
          emissionStandard = "03";
        } else if (
          vehicle.FuelType != "A" &&
          vehicle.VML > 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2008-07-01") &&
          new Date(vehicle.VRDATE) < new Date("2011-07-01")
        ) {
          emissionStandard = "03";
        } else if (
          vehicle.VML > 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2010-07-01") &&
          new Date(vehicle.VRDATE) < new Date("2013-07-01")
        ) {
          emissionStandard = "03";
        } else if (
          gaVTypeModel.PG == "01" &&
          vehicle.VML <= 2500 &&
          vehicle.RatedSeats <= 6 &&
          vehicle.HasOBD == "1" &&
          new Date(vehicle.VRDATE) >= new Date("2005-07-01") &&
          new Date(vehicle.VRDATE) < new Date("2009-07-01")
        ) {
          emissionStandard = "02";
        } else if (
          gaVTypeModel.PG == "01" &&
          vehicle.VML <= 2500 &&
          vehicle.RatedSeats <= 6 &&
          vehicle.HasOBD == "0" &&
          new Date(vehicle.VRDATE) >= new Date("2005-07-01") &&
          new Date(vehicle.VRDATE) < new Date("2008-07-01")
        ) {
          emissionStandard = "02";
        } else if (
          vehicle.VML <= 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2006-07-01") &&
          new Date(vehicle.VRDATE) < new Date("2008-07-01")
        ) {
          emissionStandard = "02";
        } else if (
          vehicle.FuelType != "A" &&
          vehicle.VML > 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2004-09-01") &&
          new Date(vehicle.VRDATE) < new Date("2008-07-01")
        ) {
          emissionStandard = "02";
        } else if (
          vehicle.VML > 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2004-09-01") &&
          new Date(vehicle.VRDATE) < new Date("2010-07-01")
        ) {
          emissionStandard = "02";
        } else if (
          gaVTypeModel.PG == "01" &&
          vehicle.VML <= 2500 &&
          vehicle.RatedSeats <= 6 &&
          new Date(vehicle.VRDATE) >= new Date("2000-07-01") &&
          new Date(vehicle.VRDATE) < new Date("2005-07-01")
        ) {
          emissionStandard = "01";
        } else if (
          vehicle.VML <= 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2001-10-01") &&
          new Date(vehicle.VRDATE) < new Date("2006-07-01")
        ) {
          emissionStandard = "01";
        } else if (
          vehicle.FuelType != "A" &&
          vehicle.VML > 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2003-09-01") &&
          new Date(vehicle.VRDATE) < new Date("2004-09-01")
        ) {
          emissionStandard = "01";
        } else if (
          vehicle.VML > 3500 &&
          new Date(vehicle.VRDATE) >= new Date("2003-07-01") &&
          new Date(vehicle.VRDATE) < new Date("2004-09-01")
        ) {
          emissionStandard = "01";
        } else if (
          gaVTypeModel.PG == "01" &&
          vehicle.VML <= 2500 &&
          vehicle.RatedSeats <= 6 &&
          new Date(vehicle.VRDATE) < new Date("2007-07-01")
        ) {
          emissionStandard = "00";
        } else if (
          vehicle.VML <= 3500 &&
          new Date(vehicle.VRDATE) < new Date("2001-10-01")
        ) {
          emissionStandard = "00";
        } else if (
          vehicle.FuelType != "A" &&
          vehicle.VML > 3500 &&
          new Date(vehicle.VRDATE) < new Date("2003-09-01")
        ) {
          emissionStandard = "00";
        } else if (
          vehicle.VML > 3500 &&
          new Date(vehicle.VRDATE) < new Date("2003-07-01")
        ) {
          emissionStandard = "00";
        }
        return {
          emissionStandard,
        };
      }
    } catch (error) {
      ctx.logger.error(error);
      return "查询报错，请查看日志";
    }
  }

  //业务审核-跨站审核
  async getCrossAudit({ VehicleiD }, { ctx, userid }) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      const CrossApply = await Raw.Query(
        `select top 1 *
            from CrossStationRecord where VehicleiD=:VehicleiD order by RecordTime desc`,
        {
          replacements: {
            VehicleiD: VehicleiD,
          },
        }
      );
      return {
        state: 1,
        data: {
          CrossApply: CrossApply,
        },
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
      };
    }
  }

  //业务审核-车辆关键信息修改审核
  async getVehicleUpdateInfo({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { CheckId, VehicleID } = param;
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      const WaitCheck = await Raw.Query(
        `select * from WaitCheck where CheckId=:CheckId`,
        {
          replacements: {
            CheckId: CheckId,
          },
        }
      );
      const vehicleInfo = await Raw.Query(
        `select * from Vehicle where VehicleID=:VehicleID`,
        {
          replacements: {
            VehicleID: VehicleID,
          },
        }
      );
      return {
        state: 1,
        data: {
          WaitCheck: WaitCheck,
          vehicleInfo: vehicleInfo,
        },
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
      };
    }
  }

  //业务审核-技术鉴别申请
  async getSkillDiscernAudit({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { CheckId, BusinessKey, VehicleID } = param;
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      const ApplyInfo = await Raw.Query(
        `select * from WaitCheck where CheckId=:CheckId`,
        {
          replacements: {
            CheckId: CheckId,
          },
        }
      );

      const AuditInfo = await Raw.Query(
        `select * from  JSJBApply where JSJBApplyID=:BusinessKey`,
        {
          replacements: {
            BusinessKey: BusinessKey,
          },
        }
      );

      const InspectData = await Raw.Query(
        `select top 1 * from  InspectionData
                 where InspectionWay='08' and VehicleID=:VehicleID order by InspectionDataID desc`,
        {
          replacements: {
            VehicleID: VehicleID,
          },
        }
      );

      return {
        state: 1,
        applyInfo: ApplyInfo,
        auditInfo: AuditInfo,
        inspectData: InspectData,
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
      };
    }
  }

  //业务审核-车辆变更登记审核 以及车辆数据修改审核(ModifyType为2时为车辆变更登记审核,1为车辆数据修改审核）
  async getChangeRegistratAudit({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { CheckId, BusinessKey, ModifyType } = param;
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;

      const WaitCheck = await Raw.Query(
        `select * from  WaitCheck where CheckId=:CheckId`,
        {
          replacements: {
            CheckId: CheckId,
          },
        }
      );
      let AppModifyVehicle = {};
      if (BusinessKey && ModifyType) {
        AppModifyVehicle = await Raw.Query(
          `select * from  AppModifyVehicle where ID=:BusinessKey and ModifyType=:ModifyType`,
          {
            replacements: {
              BusinessKey: BusinessKey,
              ModifyType: ModifyType,
            },
          }
        );
      }
      return {
        state: 1,
        WaitCheck: WaitCheck,
        AppModifyVehicle: AppModifyVehicle,
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
      };
    }
  }

  //业务审核-检测数据审核
  async getCheckDateAudit({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { BusinessKey, VehicleID, CheckType, IsCheck } = param;
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      const blackSmokeCar = await Raw.Query(
        `select * from BlackSmokeCar where VehicleID=:VehicleID and IsCheck=:IsCheck`,
        {
          replacements: {
            VehicleID: VehicleID,
            IsCheck: IsCheck,
          },
        }
      );
      const specialAttentionVehicle = await Raw.Query(
        `select * from SpecialAttentionVehicle where VehicleID=:VehicleID `,
        {
          replacements: {
            VehicleID: VehicleID,
          },
        }
      );
      const blackList = await Raw.Query(
        `select * from BlackList where VehicleID=:VehicleID `,
        {
          replacements: {
            VehicleID: VehicleID,
          },
        }
      );
      const blackSmokeCarCapture = await Raw.Query(
        `select * from BlackSmokeCarCapture where InspectionNum=:BusinessKey `,
        {
          replacements: {
            BusinessKey: BusinessKey,
          },
        }
      );
      const imgList = await Raw.QueryList(
        "select FieldValue from Sys_Config where FieldKey = 'SmokeCapturePath'"
      );
      return {
        blackSmokeCar,
        specialAttentionVehicle,
        blackList,
        blackSmokeCarCapture,
        state: 1,
        imgList,
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
        msg: "获取信息失败！",
      };
    }
  }

  // 业务审核-林格曼黑度法审核，用vehicleID从主检测表拿到最新一条检测不通过的林格曼黑度法的inspectionnum,前端根据这个编号查询blacksmokecarcapture表的图片视频
  async getLatestLingmanDataInspectionnum(
    { vehicleID, date },
    { ctx, userid }
  ) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let res = await Raw.Query(`select top 1 inspectionnum from inspectionData where vehicleID='${vehicleID}' and DetectEndTime<'${date}'
      and VDCT='0' and IUTYPE like '%J%' order by DetectEndTime desc`);
      return { inspectionnum: res.inspectionnum };
    } catch (error) {
      this.app.CoreAPI.Log.trace(
        "getLatestLingmanDataInspectionnum方法报错：" + error
      );
      return { state: 0, msg: "获取失败" };
    }
  }

  //保存技术鉴别申请
  async SaveJSJBApplyLogic(
    { CheckId, VehicleID, data, isStauts },
    { ctx, userid }
  ) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      if (isStauts == 0) {
        let date = await this.ctx.service.hj.businessAuditService.IsHasChecked({
          CheckId: CheckId,
        });
        if (date.state && date.success) return date;
      }

      const model = data;
      const UserName = ctx.User.cnname;
      //TODO:保存信息到技术鉴别表
      let oldVehicleJson, vec;
      let resData = await Raw.Query(
        `select * from Vehicle where VehicleID=:VehicleID`,
        {
          replacements: {
            VehicleID: VehicleID,
          },
        }
      );

      if (resData) {
        vec = resData;
        oldVehicleJson = JSON.stringify(vec); //json转化成字符串格式
      } else
        return {
          state: 0,
          msg: "车辆信息不存在",
        };

      //开启一个显示事务
      await Raw.ExecWithTran(async (t) => {
        //保存到jsjbapply
        const bac = new BusinessAuditCommon();
        const data = await bac.SaveJSJBApply(
          {
            model,
          },
          {
            ctx,
            userid,
            app,
          },
          Raw,
          t
        );

        //更新车辆表
        vec.IsJSJB = 1;
        const JBJL = data.JBJL;
        if (JBJL == "1") {
          //审核为绿标
          //修改备注
          let EmissionStandard = "";
          if (vec.FuelType == "A") EmissionStandard = "01";
          else if (vec.FuelType == "B") EmissionStandard = "03";

          if (!EmissionStandard) {
            resData = await Raw.QueryList(
              `select CodeValue,CodeName from CD_EmissionStandard`,
              {
                replacements: {},
                transaction: t,
              }
            );
            const CD_EmissionStandard = resData;
            let OldEmissionStandards = null;
            if (vec.EmissionStandard)
              OldEmissionStandards = CD_EmissionStandard.find(
                (item) => item.CodeValue == vec.EmissionStandard
              ).CodeName;
            const NewEmissionStandards = CD_EmissionStandard.find(
              (item) => item.CodeValue == EmissionStandard
            ).CodeName;

            if (vec.FuelType == "A")
              vec.Remarks +=
                " 技术鉴别黄转绿，由" +
                OldEmissionStandards +
                "变" +
                NewEmissionStandards +
                "。";
            else
              vec.Remarks +=
                " 技术鉴别黄改绿，由" +
                OldEmissionStandards +
                "变" +
                NewEmissionStandards +
                "。";

            //修改Vehicle_YLC和Vehicle_YCLGA表
            await Raw.Update(
              "Vehicle_YLC",
              {
                Flag: 0,
              },
              {
                wherestr:
                  "where VehicleID=:VehicleID or (VLPN=:VLPN and VLPNColor=:VLPNColor)", //where 条件
                replacements: {
                  VehicleID: vec.VehicleID,
                  VLPN: vec.VLPN,
                  VLPNColor: vec.VLPNColor,
                },
                transaction: t,
              }
            );

            await Raw.Update(
              "Vehicle_YLCGA",
              {
                Flag: 0,
              },
              {
                wherestr:
                  "where VehicleID=:VehicleID or (VLPN=:VLPN and VLPNColor=:VLPNColor)", //where 条件
                replacements: {
                  VehicleID: vec.VehicleID,
                  VLPN: vec.VLPN,
                  VLPNColor: vec.VLPNColor,
                },
                transaction: t,
              }
            );

            await Raw.Update(
              "Vehicle_YLC",
              {
                YLCAuditResult: "10",
              },
              {
                wherestr: "where VehicleID=:VehicleID", //where 条件
                replacements: {
                  VehicleID: vec.VehicleID,
                },
                transaction: t,
              }
            );

            //保存信息到技术鉴别表
            const JSEnt = {};
            JSEnt.VehicleID = vec.VehicleID;
            JSEnt.UniqueString = vec.UniqueString;
            if (!model.JSJBNUM) JSEnt.JianBieNum = +model.JSJBNUM;
            JSEnt.VLPN = vec.VLPN;
            JSEnt.VLPNColor = vec.VLPNColor;
            JSEnt.VIN = vec.VIN;
            JSEnt.FuelType = vec.FuelType;
            JSEnt.IUVTYPE = vec.IUVTYPE;
            JSEnt.IUETYPE = vec.IUETYPE;
            JSEnt.OldEmissionStandard = vec.OldEmissionStandard;
            JSEnt.NewEmissionStandard = EmissionStandard
              ? EmissionStandard
              : null;
            JSEnt.OldVehicleJson = oldVehicleJson;
            JSEnt.StationCode = model.StationCode;
            JSEnt.CountyCode = vec.County;
            JSEnt.UserName = UserName;
            JSEnt.CreateDate = new Date();
            JSEnt.JianBieDate = new Date(JSEnt.CreateDate);
            JSEnt.ApplyDate = new Date(JSEnt.CreateDate);
            JSEnt.VRDATE = new Date(vec.VRDATE);
            vec.EmissionStandard = EmissionStandard;

            resData = await Raw.Query(
              `select ID from JiShuJianBie where VehicleID=:VehicleID and UniqueString=:UniqueString`,
              {
                replacements: {
                  VehicleID: JSEnt.VehicleID,
                  UniqueString: JSEnt.UniqueString,
                },
                transaction: t,
              }
            );
            let jsjbID = 0;
            if (resData) jsjbID = resData.ID;
            if (!jsjbID) {
              //新增
              resData = await Raw.Insert(
                "JiShuJianBie",
                {
                  VehicleID: JSEnt.VehicleID,
                  UniqueString: JSEnt.UniqueString,
                  JianBieNum: JSEnt.JianBieNum,
                  VLPN: JSEnt.VLPN,
                  VLPNColor: JSEnt.VLPNColor,
                  VIN: JSEnt.VIN,
                  FuelType: JSEnt.FuelType,
                  IUVTYPE: JSEnt.IUVTYPE,
                  IUETYPE: JSEnt.IUETYPE,
                  OldEmissionStandard: JSEnt.OldEmissionStandard,
                  NewEmissionStandard: JSEnt.NewEmissionStandard,
                  OldVehicleJson: JSEnt.OldVehicleJson,
                  StationCode: JSEnt.StationCode,
                  CountyCode: JSEnt.CountyCode,
                  UserName: JSEnt.UserName,
                  ApplyDate: JSEnt.ApplyDate,
                  JianBieDate: JSEnt.JianBieDate,
                  CreateDate: JSEnt.CreateDate,
                  VRDATE: JSEnt.VRDATE,
                  InspectionNum: JSEnt.InspectionNum,
                  EngineNum: JSEnt.EngineNum,
                  JBRY: JSEnt.JBRY,
                  PrintDate: JSEnt.PrintDate,
                },
                {
                  transaction: t,
                }
              );
            } else {
              //编辑
              resData = await Raw.Update(
                "JiShuJianBie",
                {
                  VehicleID: JSEnt.VehicleID,
                  UniqueString: JSEnt.UniqueString,
                  JianBieNum: JSEnt.JianBieNum,
                  VLPN: JSEnt.VLPN,
                  VLPNColor: JSEnt.VLPNColor,
                  VIN: JSEnt.VIN,
                  FuelType: JSEnt.FuelType,
                  IUVTYPE: JSEnt.IUVTYPE,
                  IUETYPE: JSEnt.IUETYPE,
                  OldEmissionStandard: JSEnt.OldEmissionStandard,
                  NewEmissionStandard: JSEnt.NewEmissionStandard,
                  OldVehicleJson: JSEnt.OldVehicleJson,
                  StationCode: JSEnt.StationCode,
                  CountyCode: JSEnt.CountyCode,
                  UserName: JSEnt.UserName,
                  ApplyDate: JSEnt.ApplyDate,
                  JianBieDate: JSEnt.JianBieDate,
                  CreateDate: JSEnt.CreateDate,
                  VRDATE: JSEnt.VRDATE,
                  InspectionNum: JSEnt.InspectionNum,
                  EngineNum: JSEnt.EngineNum,
                  JBRY: JSEnt.JBRY,
                  PrintDate: JSEnt.PrintDate,
                },
                {
                  wherestr: "where ID=:jsjbID", //where 条件
                  replacements: {
                    jsjbID: jsjbID,
                  },
                  transaction: t,
                }
              );
            }
          }
        }
        await ctx.service.c440600.stationManagement.commonService.Update(
          vec,
          "技术鉴别审核",
          UserName,
          Raw,
          t
        );
        //根据黄绿标判断结果checktype,保存business到waitcheck
        const BusinessKey = data.JSJBApplyID;
        const checktime = new Date();
        resData = await Raw.Update(
          "WaitCheck",
          {
            Status: "1",
            BusinessKey: BusinessKey,
            AuditState: JBJL,
            Checker: UserName,
            CheckTime: checktime,
          },
          {
            wherestr: " where CheckId=:CheckId", //where 条件
            replacements: {
              CheckId: CheckId,
              BusinessKey: BusinessKey,
              JBJL: JBJL,
              UserName: UserName,
              checktime: checktime,
            },
            transaction: t,
          }
        );
      });
      let msgSendRes = await this.ctx.service.hj.hjnotice.updateBusinessNoticeByCheckId(
        CheckId
      );
      return {
        state: 1,
        msg: "保存成功",
        auditInfo: resData,
        msgSendRes,
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
        msg: "保存失败！",
      };
    }
  }
  // 获取标气图片
  async getStandardGas({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let result = await Raw.Query(`select Bytes, FullFileName, DisplayName, UploadTime from StandardGas_UploadFile 
      where id = ${param}`);
      return {
        state: 1,
        data: result,
      };
    } catch (e) {}
  }
  // 获取标气数据
  async getStandardGasData({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let result = await Raw.Query(`select * from StandardGasManage 
      where id = ${param}`);
      return {
        state: 1,
        data: result,
      };
    } catch (e) {
      console.log(e);
    }
  }

  // 获取上限数据
  async getLambdaLimit({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let result = await Raw.Query(`select LambdaU, LambdaD, IsCheckHC, IsUseIUEMANULambda from UploadLambdaLimit 
       ${param}`);
      return {
        state: 1,
        data: result,
      };
    } catch (e) {
      console.log(e);
    }
  }
  //审核信息保存
  async SaveAuditForWaitCheck(
    { ApplyReason, auditInfo, acceptInfo, isStauts, applyModifyMethod },
    { ctx, userid }
  ) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      if (isStauts == 0) {
        let date = await this.ctx.service.hj.businessAuditService.IsHasChecked({
          CheckId: auditInfo.CheckId,
        });
        if (date.state && date.success) return date;
      }
      //赋值审核人,审核时间
      auditInfo.Checker = ctx.User.cnname;
      auditInfo.CheckTime = new Date();
      //开启一个显示事务
      await Raw.ExecWithTran(async (t) => {
        let isOk = 1;
        const bac = new BusinessAuditCommon();
        if (auditInfo.CheckType == "20" || auditInfo.CheckType == "31")
          isOk = await bac.SaveAccessData(
            { auditInfo, acceptInfo },
            { ctx, userid, app },
            Raw,
            t
          ); //保存受理信息

        if (ApplyReason && ApplyReason.includes("18")) {
          if (auditInfo.AuditState == "1") {
            //审核通过
            //保存跨站申请信息
            if (isOk)
              isOk = await bac.SaveCrossInspectByWaitCheck(
                {
                  CheckId: auditInfo.CheckId,
                  Checker: auditInfo.Checker,
                  CheckTime: auditInfo.CheckTime,
                },
                {
                  ctx,
                  userid,
                  app,
                },
                Raw,
                t
              );
          }
        }
        // 复检审核
        if (ApplyReason && ApplyReason == "28") {
          let obj = await Raw.Query(
            `select top 1 * from InspectionAudit where VehicleID=${auditInfo.VehicleID} order by InspectionAuditID desc`
          );
          if (obj) {
            if (auditInfo.AuditState) {
              // 审核通过
              let time = new Date();
              await Raw.Update(
                "InspectionAudit",
                {
                  AuditState: auditInfo.AuditState,
                  IsOkInspectionDate: obj.IUIDATE,
                  HowLongTimes: 0,
                },
                {
                  wherestr: "where InspectionAuditID=:InspectionAuditID", //where 条件
                  replacements: {
                    InspectionAuditID: obj.InspectionAuditID,
                  },
                }
              );
            } else {
              // 审核不通过
              await Raw.Update(
                "InspectionAudit",
                {
                  AuditState: auditInfo.AuditState,
                },
                {
                  wherestr: "where InspectionAuditID=:InspectionAuditID", //where 条件
                  replacements: {
                    InspectionAuditID: obj.InspectionAuditID,
                  },
                }
              );
            }
          }

          // InspectionAudit
          // VehicleID
        }
        //车型审核
        if (auditInfo.CheckType == "02") {
          let values = "";
          if (auditInfo.AuditState == "1") values = "06";
          //审核通过
          else values = "44"; //审核不通过

          await Raw.Update(
            "Vehicle",
            {
              EStatus: values,
            },
            {
              wherestr: "where VehicleID=:VehicleID", //where 条件
              replacements: {
                VehicleID: auditInfo.VehicleID,
              },
              transaction: t,
            }
          );
        }
        // 转入二手车        // 合并车辆信息
        if (auditInfo.CheckType == "21" || auditInfo.CheckType == "34") {
          auditInfo.Status = 1;
          let CheckId = auditInfo.CheckId;
          delete auditInfo.CheckId;
          await Raw.Update("waitcheck", auditInfo, {
            wherestr: "where CheckId=:CheckId", //where 条件
            replacements: {
              //参数化执行
              CheckId,
            },
          });
          // 转入二手车更新vehicle
          if (auditInfo.CheckType == "21") {
            await Raw.Update(
              "vehicle",
              {
                EStatus: auditInfo.AuditState == "1" ? "06" : "44",
              },
              {
                wherestr: "where VehicleID=:VehicleID", //where 条件
                replacements: {
                  //参数化执行
                  VehicleID: auditInfo.VehicleID,
                },
              }
            );
          }
          auditInfo.CheckId = CheckId;
        }
        //保存到WaitCheck表
        await ctx.service.hj.businessAuditService.SaveWaitCheck(
          {
            auditInfo,
          },
          Raw,
          t
        );
        // 变更车辆检测方法申请
        if (auditInfo.CheckType == "28" && auditInfo.AuditState == "1") {
          await Raw.Update(
            "Vehicle",
            { InspectionMethod: applyModifyMethod.InspectionMethodAfter },
            {
              wherestr: "where VehicleID=:VehicleID",
              replacements: { VehicleID: applyModifyMethod.VehicleID },
            },
            { transaction: t }
          );
        }
      });
      let msgSendRes = await this.ctx.service.hj.hjnotice.updateBusinessNoticeByCheckId(
        auditInfo.CheckId
      );
      return {
        state: 1,
        auditInfo: auditInfo,
        msg: "审核成功！",
        msgSendRes,
      };
    } catch (error) {
      ctx.logger.error(error);
      this.app.CoreAPI.Log.trace("SaveAuditForWaitCheck方法报错：" + error);
      return {
        state: 0,
        msg: "审核失败！",
      };
    }
  }

  //车辆关键信息修改保存
  async SaveModifyVec(
    { VehicleID, CheckID, AuditState, isStauts },
    { ctx, userid }
  ) {
    try {
      const Creater = ctx.User.cnname;

      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      if (isStauts == 0) {
        let date = await this.ctx.service.hj.businessAuditService.IsHasChecked({
          CheckId: CheckID,
        });
        if (date.state && date.success) return date;
      }

      let WaitCheck = {};
      let Vehicle = {};

      const VehicleInfo = await Raw.Query(
        `select * from Vehicle where VehicleID=:VehicleID`,
        {
          replacements: {
            VehicleID: VehicleID,
          },
        }
      );
      if (VehicleInfo) Vehicle = VehicleInfo;

      const WaitCheckInfo = await Raw.Query(
        `select * from WaitCheck where CheckId=:CheckID`,
        {
          replacements: {
            CheckID: CheckID,
          },
        }
      );
      if (WaitCheckInfo) WaitCheck = WaitCheckInfo;

      //开启一个显示事务
      await Raw.ExecWithTran(async (t) => {
        if (AuditState != "0") {
          Vehicle.VLPN = WaitCheck.VLPN;
          Vehicle.VLPNColor = WaitCheck.VLPNColor;
          Vehicle.VIN = WaitCheck.VIN;
          Vehicle.IUVTYPE = WaitCheck.IUVTYPE;
          await ctx.service.c440600.stationManagement.commonService.Update(
            Vehicle,
            "车辆关键信息修改审核",
            Creater,
            Raw,
            t
          );
        }
      });

      return {
        state: 1,
        msg: "保存成功！",
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
        msg: "保存失败！",
      };
    }
  }

  //环检抽查审核
  async SaveVehicleRingTestSpotCheck(
    { rscModel, auditInfo, isStauts, imgToHandle },
    { ctx, userid }
  ) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      if (isStauts == 0) {
        let date = await this.ctx.service.hj.businessAuditService.IsHasChecked({
          CheckId: auditInfo.CheckId,
        });
        if (date.state && date.success) return date;
      }

      //赋值审核人,审核时间
      auditInfo.Checker = ctx.User.cnname;
      auditInfo.CheckTime = new Date();

      //开启一个显示事务
      await Raw.ExecWithTran(async (t) => {
        if (!rscModel.RingTestSpotCheckID) {
          await Raw.Insert(
            "RingTestSpotCheck",
            {
              InspectionNum: rscModel.InspectionNum,
              UniqueString: rscModel.UniqueString,
              VehicleID: rscModel.VehicleID,
              VLPN: rscModel.VLPN,
              VLPNColor: rscModel.VLPNColor,
              VIN: rscModel.VIN,
              InsReportAudit: rscModel.InsReportAudit,
              InsReportAuditReason: rscModel.InsReportAuditReason,
              InsProcessAudit: rscModel.InsProcessAudit,
              InsProcessAuditReason: rscModel.InsProcessAuditReason,
              InsImgAudit: rscModel.InsImgAudit,
              InsImgAuditReason: rscModel.InsImgAuditReason,
              InsVideoAudit: rscModel.InsVideoAudit,
              InsVideoAuditReason: rscModel.InsVideoAuditReason,
              InsBlackSmokeAudit: rscModel.InsBlackSmokeAudit,
              InsBlackSmokeAuditReason: rscModel.InsBlackSmokeAuditReason,
              InsExternalAudti: rscModel.InsExternalAudti,
              InsExternalNoZWM: rscModel.InsExternalNoZWM,
              InsExternalAudtiReason: rscModel.InsExternalAudtiReason,
              AppearanceDataID: rscModel.AppearanceDataID,
            },
            {
              transaction: t,
            }
          );
        } else {
          //编辑
          await Raw.Update(
            "RingTestSpotCheck",
            {
              InspectionNum: rscModel.InspectionNum,
              UniqueString: rscModel.UniqueString,
              VehicleID: rscModel.VehicleID,
              VLPN: rscModel.VLPN,
              VLPNColor: rscModel.VLPNColor,
              VIN: rscModel.VIN,
              InsReportAudit: rscModel.InsReportAudit,
              InsReportAuditReason: rscModel.InsReportAuditReason,
              InsProcessAudit: rscModel.InsProcessAudit,
              InsProcessAuditReason: rscModel.InsProcessAuditReason,
              InsImgAudit: rscModel.InsImgAudit,
              InsImgAuditReason: rscModel.InsImgAuditReason,
              InsVideoAudit: rscModel.InsVideoAudit,
              InsVideoAuditReason: rscModel.InsVideoAuditReason,
              InsBlackSmokeAudit: rscModel.InsBlackSmokeAudit,
              InsBlackSmokeAuditReason: rscModel.InsBlackSmokeAuditReason,
              InsExternalAudti: rscModel.InsExternalAudti,
              InsExternalNoZWM: rscModel.InsExternalNoZWM,
              InsExternalAudtiReason: rscModel.InsExternalAudtiReason,
              AppearanceDataID: rscModel.AppearanceDataID,
            },
            {
              wherestr: "where RingTestSpotCheckID=:RingTestSpotCheckID", //where 条件
              replacements: {
                RingTestSpotCheckID: rscModel.RingTestSpotCheckID,
              },
              transaction: t,
            }
          );
        }
        if (auditInfo.AuditState == "1") {
          //审核通过
          await Raw.Update(
            "InspectionData",
            { IsCanPrint: 1 },
            {
              wherestr: "where InspectionNum=:InspectionNum", //where 条件
              replacements: {
                InspectionNum: rscModel.InspectionNum,
              },
              transaction: t,
            }
          );
          console.log("处理外检图片", imgToHandle);
          // 处理外检图片
          if (imgToHandle.imgToDelete.length) {
            imgToHandle.imgToDelete.forEach(async (item) => {
              await Raw.Delete("ExteriorInspectionFile", {
                wherestr: "where ID=:ID",
                replacements: {
                  ID: item.ID,
                },
              });
            });
          }
          if (imgToHandle.imgToChange.length) {
            let idArr = imgToHandle.imgToChange.map((item) => item.ID);
            await Raw.Update(
              "ExteriorInspectionFile",
              { IsPicAvailable: 0 },
              {
                wherestr: "where ID in (:ID)",
                replacements: {
                  ID: idArr,
                },
              }
            );
          }
        }
        await ctx.service.hj.businessAuditService.SaveWaitCheck(
          {
            auditInfo,
          },
          Raw,
          t
        );
      });
      let msgSendRes = await this.ctx.service.hj.hjnotice.updateBusinessNoticeByCheckId(
        auditInfo.CheckId
      );
      return {
        state: 1,
        auditInfo: auditInfo,
        msg: "保存审核数据成功",
        msgSendRes,
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
        msg: "保存审核数据失败",
        error,
      };
    }
  }

  //外检修改审核
  async SaveOutInspectUpdateAudit(
    { auditInfo, extBeforeImgModel, extAfterImgModel, isStauts },
    { ctx, userid }
  ) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      if (isStauts == 0) {
        let date = await this.ctx.service.hj.businessAuditService.IsHasChecked({
          CheckId: auditInfo.CheckId,
        });
        if (date.state && date.success) return date;
      }

      //赋值审核人,审核时间
      auditInfo.Checker = ctx.User.cnname;
      auditInfo.CheckTime = new Date();

      //开启一个显示事务
      await Raw.ExecWithTran(async (t) => {
        //当外检申请修改审核通过后，修改更改前和更改后的图片状态
        if (auditInfo.AuditState == "1") {
          if (extBeforeImgModel && extBeforeImgModel.length > 0) {
            //将更改签的图片状态设置为作废
            await Raw.Update(
              "ExteriorInspectionFile",
              {
                IsPicAvailable: 1,
              },
              {
                wherestr: "where ID in (:ID)",
                replacements: {
                  ID: extBeforeImgModel,
                },
              }
            );
          }

          if (extAfterImgModel && extAfterImgModel.length > 0) {
            //将更改签的图片状态设置为可用
            await Raw.Update(
              "ExteriorInspectionFile",
              {
                IsPicAvailable: 0,
              },
              {
                wherestr: "where ID in (:ID)",
                replacements: {
                  ID: extAfterImgModel,
                },
              }
            );
          }
        }

        await ctx.service.hj.businessAuditService.SaveWaitCheck(
          {
            auditInfo,
          },
          Raw,
          t
        );
      });
      let msgSendRes = await this.ctx.service.hj.hjnotice.updateBusinessNoticeByCheckId(
        auditInfo.CheckId
      );
      return {
        state: 1,
        auditInfo: auditInfo,
        msg: "保存审核数据成功",
        msgSendRes,
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
        msg: "保存审核数据失败",
      };
    }
  }

  //ModifyType为1时为车辆数据修改审核，ModifyType为2时为车辆变更登记审核
  async SaveChangeRegistratAudit(
    { JsonData, auditInfo, ModifyType, isStauts },
    { ctx, userid }
  ) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      if (isStauts == 0) {
        let date = await this.ctx.service.hj.businessAuditService.IsHasChecked({
          CheckId: auditInfo.CheckId,
        });
        if (date.state && date.success) return date;
      }
      const UserName = ctx.User.cnname;

      //赋值审核人,审核时间
      auditInfo.Checker = ctx.User.cnname;
      auditInfo.CheckTime = new Date();

      //开启一个显示事务
      await Raw.ExecWithTran(async (t) => {
        if (ModifyType == 2) {
          if (!auditInfo.VehicleID)
            return {
              state: 0,
              msg: "车辆ID不能为空!",
            };
          const vehicleInfo = await Raw.Query(
            `select * from Vehicle where VehicleID=:VehicleID`,
            {
              replacements: {
                VehicleID: auditInfo.VehicleID,
              },
              transaction: t,
            }
          );
          if (!vehicleInfo)
            return {
              state: 0,
              msg: "无相关车辆信息!",
            };

          await Raw.Insert(
            "VehicleChangeRegistration",
            {
              Address: vehicleInfo.Address,
              CredentialsNum: vehicleInfo.CredentialsNum,
              EStatus: vehicleInfo.EStatus,
              FuelType: vehicleInfo.FuelType,
              GAVType: vehicleInfo.GAVType,
              IUETYPE: vehicleInfo.IUETYPE,
              IUVTYPE: vehicleInfo.IUVTYPE,
              OwnerName: vehicleInfo.OwnerName,
              PG: vehicleInfo.PG,
              RecordNo: vehicleInfo.RecordNo,
              Remarks: vehicleInfo.Remarks,
              Sex: vehicleInfo.Sex,
              Tel: vehicleInfo.Tel,
              UniqueString: vehicleInfo.UniqueString,
              VehicleBigType: vehicleInfo.VehicleBigType,
              VehicleColor: vehicleInfo.VehicleColor,
              VehicleID: vehicleInfo.VehicleID,
              VehicleType: vehicleInfo.VehicleType,
              VIN: vehicleInfo.VIN,
              VLPN: vehicleInfo.VLPN,
              VLPNColor: vehicleInfo.VLPNColor,
              VLPNType: vehicleInfo.VLPNType,
              VStatus: vehicleInfo.VStatus,
              ZipCode: vehicleInfo.ZipCode,
            },
            {
              transaction: t,
            }
          );

          JsonData.VehicleID = auditInfo.VehicleID;
          JsonData.IsInValid = 0;
          JsonData.SyncFlag = 0;
          JsonData.EStatus = 22;
        } else {
          JsonData.VehicleID = auditInfo.VehicleID;
          if (auditInfo.AuditState == "1") JsonData.EStatus = "06";
          else JsonData.EStatus = "44";
        }
        if (auditInfo.AuditState == "1") {
          await ctx.service.c440600.stationManagement.commonService.Update(
            JsonData,
            "车辆变更登记",
            UserName,
            Raw,
            t
          );
        } else {
          await Raw.Update(
            "Vehicle",
            {
              EStatus: "44",
              LastUpdateTime: this.ctx.helper.dataFormat(
                new Date(),
                "yyyy-MM-dd hh:mm:ss"
              ),
            },
            {
              wherestr: "where VehicleID=:VehicleID",
              replacements: {
                VehicleID: auditInfo.VehicleID,
              },
            }
          );
        }

        await ctx.service.hj.businessAuditService.SaveWaitCheck(
          {
            auditInfo,
          },
          Raw,
          t
        );
      });
      //waitcheck部分实体
      const entity = [
        "CheckId",
        "VehicleID",
        "VLPN",
        "VLPNColor",
        "CheckType",
        "CheckTime",
        "Checker",
      ];

      let nowWaitCheckInfo = {};
      entity.map((key) => {
        if (key == "CheckId") nowWaitCheckInfo[key] = auditInfo[key] || 0;
        else nowWaitCheckInfo[key] = auditInfo[key] || null;
      });
      //redis推送
      app.redis
        .get("hj")
        .publish("jgxt/ywxt/shjgxx", JSON.stringify(nowWaitCheckInfo));
      let msgSendRes = await this.ctx.service.hj.hjnotice.updateBusinessNoticeByCheckId(
        auditInfo.CheckId
      );
      return {
        state: 1,
        auditInfo: auditInfo,
        msg: "保存审核数据成功",
        msgSendRes,
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
        msg: "保存审核数据失败",
      };
    }
  }

  //审核-检测数据审核
  async SaveChangeCheckDateAudit({ auditInfo, isStauts }, { ctx, userid }) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      if (isStauts == 0) {
        //提交审核
        let date = await this.ctx.service.hj.businessAuditService.IsHasChecked({
          CheckId: auditInfo.CheckId,
        });
        if (date.state && date.success) return date;
      }
      auditInfo.Checker = ctx.User.cnname;
      auditInfo.Status = 1;
      auditInfo.CheckTime = this.ctx.helper.dataFormat(
        new Date(),
        "yyyy-MM-dd hh:mm:ss"
      );
      await Raw.Update(
        "WaitCheck",
        {
          Status: auditInfo.Status,
          Checker: auditInfo.Checker,
          CheckTime: auditInfo.CheckTime,
          ApplyReason: auditInfo.ApplyReason,
          Remarks: auditInfo.Remarks,
          AuditState: auditInfo.AuditState,
          CheckStep: auditInfo.CheckStep,
        },
        {
          wherestr: ` where CheckId=:CheckId `,
          replacements: {
            CheckId: auditInfo.CheckId,
          },
        }
      );
      if (auditInfo.AuditState == 0) {
        //不通过
        await Raw.Update(
          "InspectionData",
          {
            IsCanPrint: 0,
            VerifyResult: "04",
          },
          {
            wherestr: ` where InspectionNum=:InspectionNum`,
            replacements: {
              InspectionNum: auditInfo.BusinessKey,
            },
          }
        );
      } else {
        //通过
        await Raw.Update(
          "InspectionData",
          {
            IsCanPrint: 1,
            VerifyResult: "03",
          },
          {
            wherestr: ` where InspectionNum=:InspectionNum`,
            replacements: {
              InspectionNum: auditInfo.BusinessKey,
            },
          }
        );
      }
      let msgSendRes = await this.ctx.service.hj.hjnotice.updateBusinessNoticeByCheckId(
        auditInfo.CheckId
      );
      return {
        state: 1,
        auditInfo: auditInfo,
        msg: "保存审核数据成功",
        msgSendRes,
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
        msg: "保存审核数据失败",
      };
    }
  }

  //审核-申请变更林格曼结果
  async SaveChangeLingmanDataAudit(
    { auditInfo, isStauts, IUTYPE },
    { ctx, userid }
  ) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      if (isStauts == 0) {
        //提交审核
        let date = await this.ctx.service.hj.businessAuditService.IsHasChecked({
          CheckId: auditInfo.CheckId,
        });
        if (date.state && date.success) return date;
      }
      auditInfo.Checker = ctx.User.cnname;
      auditInfo.Status = 1;
      auditInfo.CheckTime = this.ctx.helper.dataFormat(
        new Date(),
        "yyyy-MM-dd hh:mm:ss"
      );
      await Raw.Update(
        "WaitCheck",
        {
          Status: auditInfo.Status,
          Checker: auditInfo.Checker,
          CheckTime: auditInfo.CheckTime,
          ApplyReason: auditInfo.ApplyReason,
          Remarks: auditInfo.Remarks,
          AuditState: auditInfo.AuditState,
          CheckStep: auditInfo.CheckStep,
        },
        {
          wherestr: ` where CheckId=:CheckId `,
          replacements: {
            CheckId: auditInfo.CheckId,
          },
        }
      );
      // if (auditInfo.AuditState == 1) {
      //   Raw.ExecWithTran(async (t) => {
      //     //通过则更新林格曼等级结果为合格
      //     await Raw.Update(
      //       "LingmanData", {
      //       VisibleSmoke: 0,
      //       LingmanRank: 0,
      //       ED: 1,
      //       LGMED: 1
      //     }, {
      //       wherestr: ` where InspectionNum=:InspectionNum`,
      //       replacements: {
      //         InspectionNum: auditInfo.BusinessKey
      //       }
      //     }
      //     );
      //     const arrMethod = IUTYPE.split(',').filter(item => item.indexOf('J') < 0);
      //     let methodData;
      //     if (arrMethod[0] == "G") {
      //       methodData = await Raw.Query(`select LDED as result from LDData where InspectionNum=:InspectionNum`, {
      //         replacements: {
      //           InspectionNum: auditInfo.BusinessKey
      //         }
      //       })
      //     } else if (arrMethod[0] == "F") {
      //       methodData = await Raw.Query(`select LPSED as result from LightProofSmokeData where InspectionNum=:InspectionNum`, {
      //         replacements: {
      //           InspectionNum: auditInfo.BusinessKey
      //         }
      //       })
      //     }
      //     if (methodData && methodData.result == "1") { //若加载减速或自由加速的结果值为合格，则更新总结果为1
      //       await Raw.Update(
      //         "InspectionData", {
      //         VDCT: 1
      //       }, {
      //         wherestr: ` where InspectionNum=:InspectionNum`,
      //         replacements: {
      //           InspectionNum: auditInfo.BusinessKey
      //         }
      //       }
      //       );
      //     }
      //   })

      // }
      let msgSendRes = await this.ctx.service.hj.hjnotice.updateBusinessNoticeByCheckId(
        auditInfo.CheckId
      );
      return {
        state: 1,
        auditInfo: auditInfo,
        msg: "保存审核数据成功",
        msgSendRes,
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
        msg: "保存审核数据失败",
      };
    }
  }

  //跨站检测审核
  async SaveCrossStationAudit({ auditInfo, isStauts }, { ctx, userid }) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      if (isStauts == 0) {
        //提交审核
        let date = await this.ctx.service.hj.businessAuditService.IsHasChecked({
          CheckId: auditInfo.CheckId,
        });
        if (date.state && date.success) return date;
      }
      auditInfo.Checker = ctx.User.cnname;
      auditInfo.CheckTime = this.ctx.helper.dataFormat(
        new Date(),
        "yyyy-MM-dd hh:mm:ss"
      );
      //开启一个显示事务
      await Raw.ExecWithTran(async (t) => {
        await ctx.service.hj.businessAuditService.SaveWaitCheck(
          {
            auditInfo,
          },
          Raw,
          t
        );
      });
      let msgSendRes = await this.ctx.service.hj.hjnotice.updateBusinessNoticeByCheckId(
        auditInfo.CheckId
      );
      return {
        state: 1,
        auditInfo: auditInfo,
        msg: "保存审核数据成功",
        msgSendRes,
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
        msg: "保存审核数据失败",
      };
    }
  }

  // 获取原车辆信息
  // 二手车转让审核
  async getOldVehicleInfo(params, { ctx, userid }) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let result = await Raw.Query(
        "select SecondHandCarPlace,OldVLPN from Vehicle where VehicleID=:VehicleID",
        {
          replacements: {
            //参数化执行
            VehicleID: params.VehicleID,
          },
        }
      );
      return {
        state: 1,
        result,
      };
    } catch (e) {
      console.log(e);
    }
  }
  // 车辆合并审核
  //获取图片列表
  // </summary>
  // <param name="ID">业务ID</param>
  // <param name="TYPE">业务类型(复合审核可能存在多个子项,需要传数组,其他则传入字符串)</param>
  // <param name="OP">指定类型(为3则为工转非,其他默认为外地二手车)</param>
  async getBusinessFileInfo({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { ID, TYPE, OP, vid, ApplyTime } = param;
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;

      if (!Array.isArray(TYPE)) TYPE = [TYPE]; //字符串转化成数组
      if (TYPE.length == 0 || !TYPE) TYPE = ["-1"]; //防止空数组报错,给一个默认值
      let result = [];
      if (OP == "1") {
        //获取外地转入二手车
        result = await Raw.QueryList(
          `
                    select BusinessAuditID,VehicleID,FileBusinessGroup,FullFileName,DisplayName,FileBusinessType,Bytes,UploadPerson
                    from BusinessFileInfo where BusinessAuditID=:ID and FileBusinessGroup in (:TYPE)`,
          {
            replacements: {
              ID: "" + ID,
              TYPE: TYPE,
            },
          }
        );
      } else if (OP == "2") {
        //获取委托书
        result = await Raw.QueryList(
          `
                     select BusinessAuditID,VehicleID,FileBusinessGroup,FullFileName,DisplayName,FileBusinessType,Bytes,UploadPerson 
                    from BusinessFileInfo where BusinessAuditID=:ID and FileBusinessGroup in (:TYPE) and DisplayName like '%委托书%'`,
          {
            replacements: {
              ID: "" + ID,
              TYPE: TYPE,
            },
          }
        );
      } else if (OP == "3") {
        //获取工转非
        result = await Raw.QueryList(
          `
                     select  BusinessAuditID,VehicleID,FileBusinessGroup,FullFileName,DisplayName,FileBusinessType,Bytes,UploadPerson 
                     from BusinessFileInfo where VehicleID=:ID and FileBusinessGroup in (:TYPE) and DisplayName like '%工转非%'`,
          {
            replacements: {
              ID: "" + ID,
              TYPE: TYPE,
            },
          }
        );
      } else if (OP == "4") {
        result = await Raw.QueryList(
          `
                select  BusinessAuditID,VehicleID,FileBusinessGroup,FullFileName,DisplayName,FileBusinessType,Bytes,UploadPerson 
                from BusinessFileInfo where BusinessAuditID=:ID and FileBusinessGroup in (:TYPE)`,
          {
            replacements: {
              ID: "" + ID,
              TYPE: TYPE,
            },
          }
        );
      } else if (OP == "5") {
        const WaitCheck = await Raw.Query(
          `
                 select Status,AuditState from WaitCheck where CheckId=:ID`,
          {
            replacements: {
              ID: "" + ID,
            },
          }
        );
        const wait = WaitCheck;
        if (wait && wait.Status == "1") {
          //已审核
          if (wait.AuditState == "1") {
            //审核通过
            result = await Raw.QueryList(
              `
                           select BusinessAuditID,VehicleID,FileBusinessGroup,FullFileName,DisplayName,FileBusinessType,Bytes,UploadPerson from BusinessFileInfo
                           where BusinessAuditID=VehicleID and VehicleID=:vid and FileBusinessGroup in (:TYPE)`,
              {
                replacements: {
                  vid: vid,
                  TYPE: TYPE,
                },
              }
            );
          } else {
            //审核不通过
            result = await Raw.QueryList(
              `
                           select BusinessAuditID,VehicleID,FileBusinessGroup,FullFileName,DisplayName,FileBusinessType,Bytes,UploadPerson from BusinessFileInfo
                           where BusinessAuditID=:ID and VehicleID=:vid  and FileBusinessGroup in (:TYPE)`,
              {
                replacements: {
                  vid: vid,
                  TYPE: TYPE,
                  ID: "" + ID,
                },
              }
            );
          }
        } else {
          //未审核
          result = await Raw.QueryList(
            `
                          select BusinessAuditID,VehicleID,FileBusinessGroup,FullFileName,DisplayName,FileBusinessType,Bytes,UploadPerson from BusinessFileInfo
                          where BusinessAuditID=VehicleID and VehicleID=:vid and FileBusinessGroup in (:TYPE)`,
            {
              replacements: {
                vid: vid,
                TYPE: TYPE,
              },
            }
          );
        }
      } else if (OP == "6") {
        //转入二手车
        result = await Raw.QueryList(
          `
                    select BusinessAuditID,VehicleID,FileBusinessGroup,FullFileName,DisplayName,FileBusinessType,Bytes,UploadPerson from BusinessFileInfo
                    where  VehicleID=:vid and FileBusinessGroup =:TYPE and CONVERT(varchar(100),UploadTime, 23)=:ApplyTime`,
          {
            replacements: {
              vid: vid,
              TYPE: TYPE,
              ApplyTime: ctx.helper.dataFormat(ApplyTime, "yyyy-MM-dd"),
            },
          }
        );
      } else if (OP == "7") {
        //受理审核
        result = await Raw.QueryList(
          `select * from UploadFileData where  BusinessKey =':vid' and BusinessType =:TYPE `,
          {
            replacements: {
              vid: vid,
              TYPE: "73",
            },
          }
        );
      } else {
        result = await Raw.QueryList(
          `
                    select BusinessAuditID,VehicleID,FileBusinessGroup,FullFileName,DisplayName,FileBusinessType,Bytes,UploadPerson 
                    from BusinessFileInfo where BusinessAuditID=:ID and FileBusinessGroup in (:TYPE)`,
          {
            replacements: {
              TYPE: TYPE,
              ID: "" + ID,
            },
          }
        );
      }

      return {
        state: 1,
        data: {
          imgList: result,
        },
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
      };
    }
  }

  async getSpecialImg({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let result = await Raw.QueryList(
        `
                  select  Url, OriginalFileName, UploadFileUser from  UploadFileData 
                  where BusinessKey='${param}' and (BusinessType='62' or BusinessType='71' or  BusinessType='61' or BusinessType='72' or  BusinessType='76'  or  BusinessType='16' or 
                  BusinessType='81' or  BusinessType='82' or  BusinessType='83' or  BusinessType='84')`,
        {
          replacements: {},
        }
      );
      // console.log(result)
      return {
        state: 1,
        data: result,
      };
    } catch (e) {}
  }
  //业务审核-过去10天数据
  async getlastTenData({}, { ctx, userid }) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let whereArr = [];
      let where = "";

      //非管理员数据过滤
      let limitReplace = {};
      let areaRole = [];
      let res = await ctx.service.c440600.stationManagement.commonService.GetAreaRole();
      if (res.state) areaRole = res.data;
      let auditRole = []; //审核权限
      let reasonRole = []; //审核原因(受理审核子项)
      res = await ctx.service.c440600.stationManagement.commonService.GetAuditRole();
      if (res.state) {
        auditRole = res.auditRole;
        reasonRole = res.reasonRole;
      }
      if (
        !this.ctx.User.isAdmin &&
        (areaRole.length == 0 ||
          (auditRole.length == 0 && reasonRole.length == 0))
      )
        return {
          state: 1,
          data: [],
          dataCount: 0,
        };
      if (areaRole.length > 0 && !areaRole.find((t) => t.length == 2)) {
        let limitWhere = "";
        let limitArr = [];
        areaRole.forEach((areaCode, index) => {
          limitReplace[`areaRole${index}`] = areaCode + "%";
          limitArr.push(
            `OrgCode like :areaRole${index} or Applicant like :areaRole${index} `
          );
        });
        limitWhere = "(" + limitArr.join(" or ") + ")";
        whereArr.push(limitWhere);
      }

      //审核大项
      if (auditRole.length > 0) limitReplace["auditRole"] = auditRole;

      //审核子项
      if (reasonRole.length > 0) limitReplace["reasonRole"] = reasonRole;

      if (auditRole.length > 0 && reasonRole.length > 0)
        whereArr.push(
          `(CheckType in (:auditRole) or ApplyReason in (:reasonRole))`
        );
      else if (auditRole.length > 0 && reasonRole.length == 0)
        whereArr.push(`CheckType in (:auditRole)`);
      else if (auditRole.length == 0 && reasonRole.length > 0)
        whereArr.push(`ApplyReason in (:reasonRole)`);
        
      // 判断登录人员负责的站点
      let cuser=this.ctx.helper.getCurrentUser();
      let stationCode = cuser['userOrg']
      if(stationCode){
        where += ` and OrgCode = '${stationCode}'`;
      }

      if (whereArr.length > 0) where = "and " + whereArr.join(" and ");
      let startTime = ctx.helper.dataFormat(
        new Date().setDate(new Date().getDate() - 10),
        "yyyy-MM-dd 00:00:00"
      );
      let endTime = ctx.helper.dataFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
      let sql = `
      select CheckType,ApplyTime,AuditState,CheckId,Status,OrgCode,CheckTime from WaitCheck a join CD_CheckType b on b.CodeValue=a.CheckType and b.IsAvailable=1
      where ApplyTime>=:startTime and ApplyTime<=:endTime ${where}`;
      const result = await Raw.QueryList(sql, {
        replacements: Object.assign(
          {
            startTime: startTime,
            endTime: endTime,
          },
          limitReplace
        ),
      });
      return {
        state: 1,
        data: result,
        startTime: startTime,
        endTime: endTime,
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
      };
    }
  }

  //业务审核-统计数目
  async getCountData({}, { ctx, userid }) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let whereArr = [];
      let where = "";

      //非管理员数据过滤
      let limitReplace = {};
      let areaRole = [];
      let res = await ctx.service.c440600.stationManagement.commonService.GetAreaRole();
      if (res.state) areaRole = res.data;
      let auditRole = []; //审核权限
      let reasonRole = []; //审核原因(受理审核子项)
      res = await ctx.service.c440600.stationManagement.commonService.GetAuditRole();
      if (res.state) {
        auditRole = res.auditRole;
        reasonRole = res.reasonRole;
      }
      if (
        !this.ctx.User.isAdmin &&
        (areaRole.length == 0 ||
          (auditRole.length == 0 && reasonRole.length == 0))
      )
        return {
          state: 1,
          data: [],
          dataCount: 0,
        };
      if (areaRole.length > 0 && !areaRole.find((t) => t.length == 2)) {
        let limitWhere = "";
        let limitArr = [];
        areaRole.forEach((areaCode, index) => {
          limitReplace[`areaRole${index}`] = areaCode + "%";
          limitArr.push(
            `OrgCode like :areaRole${index} or Applicant like :areaRole${index}`
          );
        });
        limitWhere = "(" + limitArr.join(" or ") + ")";
        whereArr.push(limitWhere);
      }

      //审核大项
      if (auditRole.length > 0) limitReplace["auditRole"] = auditRole;

      //审核子项
      if (reasonRole.length > 0) limitReplace["reasonRole"] = reasonRole;

      if (auditRole.length > 0 && reasonRole.length > 0)
        whereArr.push(
          `(CheckType in (:auditRole) or ApplyReason in (:reasonRole))`
        );
      else if (auditRole.length > 0 && reasonRole.length == 0)
        whereArr.push(`CheckType in (:auditRole)`);
      else if (auditRole.length == 0 && reasonRole.length > 0)
        whereArr.push(`ApplyReason in (:reasonRole)`);

      if (whereArr.length > 0) where = "and " + whereArr.join(" and ");
      //当日
      let startTime = ctx.helper.dataFormat(new Date(), "yyyy-MM-dd 00:00:00");
      let endTime = ctx.helper.dataFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
      const toDay = await Raw.Query(
        `
                    select Count(1) Num from WaitCheck where ApplyTime>=:startTime and ApplyTime<=:endTime ${where}`,
        {
          replacements: Object.assign(
            {
              startTime: startTime,
              endTime: endTime,
            },
            limitReplace
          ),
        }
      );

      //前天
      startTime = ctx.helper.dataFormat(
        new Date().setDate(new Date().getDate() - 1),
        "yyyy-MM-dd 00:00:00"
      );
      endTime = ctx.helper.dataFormat(
        new Date().setDate(new Date().getDate() - 1),
        "yyyy-MM-dd 23:59:59"
      );
      const yestDay = await Raw.Query(
        `
                 select Count(1) Num from WaitCheck where ApplyTime>=:startTime and ApplyTime<=:endTime ${where}`,
        {
          replacements: Object.assign(
            {
              startTime: startTime,
              endTime: endTime,
            },
            limitReplace
          ),
        }
      );

      //上一周
      var nowTime = new Date().setDate(new Date().getDate() - 7);
      var day = new Date(nowTime).getDay();
      var oneDayTime = 24 * 60 * 60 * 1000;

      startTime = ctx.helper.dataFormat(
        new Date(nowTime - (day - 1) * oneDayTime),
        "yyyy-MM-dd 00:00:00"
      ); //上周一
      endTime = ctx.helper.dataFormat(
        new Date(nowTime + (7 - day) * oneDayTime),
        "yyyy-MM-dd 23:59:59"
      ); //上周日
      const lastWeek = await Raw.Query(
        `
                    select Count(1) Num from WaitCheck where ApplyTime>=:startTime and ApplyTime<=:endTime ${where}`,
        {
          replacements: Object.assign(
            {
              startTime: startTime,
              endTime: endTime,
            },
            limitReplace
          ),
        }
      );

      //上一个月
      let lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth());
      const bac = new BusinessAuditCommon();
      var Year = lastMonthDate.getFullYear();
      var Month = lastMonthDate.getMonth();
      startTime = ctx.helper.dataFormat(
        new Date(Year, Month - 1, 1),
        "yyyy-MM-dd 00:00:00"
      );
      endTime = ctx.helper.dataFormat(
        new Date(Year, Month - 1, bac.getMonthDays(Year, Month)),
        "yyyy-MM-dd 23:59:59"
      );
      const lastMonth = await Raw.Query(
        `
                    select Count(1) Num from WaitCheck where ApplyTime>=:startTime and ApplyTime<=:endTime ${where}`,
        {
          replacements: Object.assign(
            {
              startTime: startTime,
              endTime: endTime,
            },
            limitReplace
          ),
        }
      );

      return {
        state: 1,
        toDay: toDay,
        yestDay: yestDay,
        lastWeek: lastWeek,
        lastMonth: lastMonth,
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
      };
    }
  }

  //业务审核-最新审核信息列表
  async getRecentAudit({}, { ctx, userid }) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let whereArr = [];
      let where = "";

      //非管理员数据过滤
      let limitReplace = {};
      let areaRole = [];
      let res = await ctx.service.c440600.stationManagement.commonService.GetAreaRole();
      if (res.state) areaRole = res.data;
      let auditRole = []; //审核权限
      let reasonRole = []; //审核原因(受理审核子项)
      res = await ctx.service.c440600.stationManagement.commonService.GetAuditRole();
      if (res.state) {
        auditRole = res.auditRole;
        reasonRole = res.reasonRole;
      }
      if (
        !this.ctx.User.isAdmin &&
        (areaRole.length == 0 ||
          (auditRole.length == 0 && reasonRole.length == 0))
      )
        return {
          state: 1,
          data: [],
          dataCount: 0,
        };
      if (
        !this.ctx.User.isAdmin &&
        areaRole.length > 0 &&
        !areaRole.find((t) => t.length == 2)
      ) {
        let limitWhere = "";
        let limitArr = [];
        areaRole.forEach((areaCode, index) => {
          limitReplace[`areaRole${index}`] = areaCode + "%";
          limitArr.push(
            `OrgCode like :areaRole${index} or Applicant like :areaRole${index}`
          );
        });
        limitWhere = "(" + limitArr.join(" or ") + ")";
        whereArr.push(limitWhere);
      }

      //审核大项
      if (auditRole.length > 0) limitReplace["auditRole"] = auditRole;

      //审核子项
      if (reasonRole.length > 0) limitReplace["reasonRole"] = reasonRole;

      if (auditRole.length > 0 && reasonRole.length > 0)
        whereArr.push(
          `(CheckType in (:auditRole) or ApplyReason in (:reasonRole))`
        );
      else if (auditRole.length > 0 && reasonRole.length == 0)
        whereArr.push(`CheckType in (:auditRole)`);
      else if (auditRole.length == 0 && reasonRole.length > 0)
        whereArr.push(`ApplyReason in (:reasonRole)`);
        
      // 判断登录人员负责的站点
      let cuser=this.ctx.helper.getCurrentUser();
      let stationCode = cuser['userOrg']
      if(stationCode){
        where += ` and OrgCode = '${stationCode}'`;
      }

      if (whereArr.length > 0) where = "and " + whereArr.join(" and ");

      const result = await Raw.QueryList(
        `
                select top 10 (select StationName from StationInfo v where b.OrgCode = v.StationCode ) as StationName, CheckId,CheckType,BusinessKey,BusinessTable,
                UniqueString,OrgCode,VLPN,VLPNColor,
                VehicleID,AuditState,Status,FuelType,ProductDate,GAVType,
                IUVTYPE,ApplyUserName,ApplyTime,ApplyReason,CheckTime,Checker,VIN,OwnerName
                from WaitCheck b
                where 1=1 and Status='1' ${where} order by CheckTime desc `,
        {
          replacements: limitReplace,
        }
      );

      return {
        state: 1,
        data: result,
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
      };
    }
  }

  //业务审核-车辆数据图片信息
  async getAcceptAuditImg({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { BusinessKey, BusinessType } = param;
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      if (BusinessKey && BusinessType) {
        const imgList = await Raw.QueryList(
          "select * from UploadFileData  where  BusinessKey =:BusinessKey and BusinessType =:BusinessType",
          {
            replacements: {
              BusinessKey: BusinessKey,
              BusinessType: BusinessType,
            },
          }
        );
        return {
          state: 1,
          imgList,
        };
      }
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
      };
    }
  }
  // 推送审核已审核
  async auditedEmit({ keys, str }, { ctx, userid }) {
    const { app } = this;
    try {
      await ctx.service.hj.businessAuditService.handleBusinessAuditRedis(
        keys,
        str
      );
      // app.redis.get("hj").publish(keys, str);
      return {
        state: 1,
        msg: "推送已审核成功",
      };
    } catch (error) {
      app.CoreAPI.Log.trace("auditedEmit" + error);
      return {
        state: 0,
        msg: "推送已审核失败",
      };
    }
  }
  //业务审核-检测方法申请变更
  async getChangeInspectionMethodAudit({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { CheckId, BusinessKey } = param;
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;

      const WaitCheck = await Raw.Query(
        `select * from  WaitCheck where CheckId=:CheckId`,
        {
          replacements: {
            CheckId: CheckId,
          },
        }
      );
      let ApplyModifyMethod = {};
      if (BusinessKey) {
        ApplyModifyMethod = await Raw.Query(
          `select * from  ApplyModifyInspectionMethod where ID=:BusinessKey`,
          {
            replacements: {
              BusinessKey: BusinessKey,
            },
          }
        );
      }
      return {
        state: 1,
        WaitCheck: WaitCheck,
        ApplyModifyMethod: ApplyModifyMethod,
      };
    } catch (error) {
      ctx.logger.error(error);
      return {
        state: 0,
      };
    }
  }

  // 获取环检抽查审核图片
  async getSpotAuditImg({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      const { app } = this;
      const { Raw } = app.Dbs.hj;
      if (!param.BusinessKey) return { code: 0, message: "fail" };
      const imgList = await Raw.QueryList(
        "select * from UploadFileData where (BusinessKey =:BusinessKey and BusinessType in('81','82','83')) or (VehicleID=:BusinessKey and BusinessType='10')",
        {
          replacements: {
            BusinessKey: param.BusinessKey,
          },
        }
      );
      return { code: 1, data: imgList };
    } catch (error) {
      this.app.CoreAPI.Log.trace("getSpotAuditImg方法报错: ", error);
      return { code: 0, message: "fail" };
    }
  }

  // 从业务端接收新审核信息并推送至前端
  async sendAuditInfo(params, { ctx, userid }) {
    try {
      const { app } = this;
      const parseMsg = params.message;
      const message = JSON.stringify(parseMsg);
      let concatUser = [];
      if (parseMsg.OrgCode && parseMsg.CheckType) {
        //市级权限用户,区级权限用户
        const areaData = await getPromiss("[hj-citycode]", [
          "" + parseMsg.OrgCode.slice(0, 2),
          "" + parseMsg.OrgCode.slice(0, 4),
          "" + parseMsg.OrgCode.slice(0, 6),
        ]);
        const { transaction, Raw } = app.Dbs.hj;
        let IsFGKAndCrossAudit = await app.redis
          .get("hj")
          .hget("systemconfig", "02_IsFGKAndCrossAudit");
        if (!IsFGKAndCrossAudit) {
          let key = await Raw.Query(
            "select FieldValue from Sys_Config where FieldKey='IsFGKAndCrossAudit' and SysConfigType='02'"
          );
          if (key) IsFGKAndCrossAudit = key.FieldValue;
        }
        let IsFGKAndSpecialAudit = await app.redis
          .get("hj")
          .hget("systemconfig", "02_IsFGKAndSpecialAudit");
        if (!IsFGKAndSpecialAudit) {
          let res = await Raw.Query(
            "select FieldValue from Sys_Config where FieldKey='IsFGKAndSpecialAudit' and SysConfigType='02'"
          );
          if (res) IsFGKAndSpecialAudit = res.FieldValue;
        }
        IsFGKAndSpecialAudit = IsFGKAndSpecialAudit == "true" ? true : false;
        IsFGKAndCrossAudit = IsFGKAndCrossAudit == "true" ? true : false;
        //审核权限用户
        let userData = [];
        if (parseMsg.CheckType == "20" && parseMsg.ApplyReason) {
          //只针对受理审核（审核原因只有一个）
          userData =
            (await getPromiss("[hj-auditCode]", [
              `sh20${parseMsg.ApplyReason}`,
              `sh20`,
            ])) || [];
        } else if (
          parseMsg.CheckType == "31" &&
          parseMsg.ApplyReason &&
          parseMsg.ApplyReason.split(",").sort().join(",") == "21,26"
        ) {
          //只针对复合审核
          if (IsFGKAndSpecialAudit)
            userData = (await getPromiss("[hj-auditCode]", [`sh312126`])) || [];
          else
            userData =
              (await getPromiss("[hj-auditCode]", [`sh31`, `sh312126`])) || [];
        } else if (
          parseMsg.CheckType == "31" &&
          parseMsg.ApplyReason &&
          parseMsg.ApplyReason.split(",").sort().join(",") == "18,21"
        ) {
          //只针对复合审核(非工况和跨站的)
          if (IsFGKAndCrossAudit)
            userData = (await getPromiss("[hj-auditCode]", [`sh311821`])) || [];
          else
            userData =
              (await getPromiss("[hj-auditCode]", [`sh31`, `sh311821`])) || [];
        } else {
          userData =
            (await getPromiss("[hj-auditCode]", "sh" + parseMsg.CheckType)) ||
            [];
        }
        //合并后的权限用户
        concatUser = areaData.filter(function (v) {
          return userData.indexOf(v) != -1;
        });
      }
      app.socketAPI.pushMessage({
        userids: ["U000001", ...concatUser],
        channel: "ywxt/jgxt/dshxx",
        content: {
          msgObj: message,
          title: concatUser.length + 1,
        },
      });
      app.CoreAPI.Log.trace(`businessAudit.js推送消息到前端`);
      // app.socketAPI.sendMessage(["U000001", ...concatUser], {
      //   title: concatUser.length,
      //   type: "ywxt/jgxt/dshxx",
      //   msgObj: message,
      //   timeout: 60,
      // });
      //获取用户权限,如不存在缓存里,则先存，再取
      async function getPromiss(key, roleArr) {
        if (roleArr.length) {
          let userlist = [];
          if (!Array.isArray(roleArr)) roleArr = [roleArr];
          if (!(await app.Cache.get(key + roleArr.join(",")))) {
            userlist = await app.CoreAPI.Role.getRoleUsers(roleArr);
            await app.Cache.set(key + roleArr.join(","), userlist);
          } else userlist = await app.Cache.get(key + roleArr.join(","));
          return userlist;
        }
      }
    } catch (error) {
      this.app.CoreAPI.Log.trace("sendAuditInfo方法报错：", error);
      return { code: 0, error };
    }
  }

  // 获取申请复检审核信息
  async getApplyFJAudit({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { CheckId } = param;
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      //审核表
      const WaitCheck = await Raw.Query(
        `select * from WaitCheck where CheckId=:CheckId`,
        {
          replacements: {
            CheckId: CheckId,
          },
        }
      );

      //图片列表
      const ImgList = await Raw.QueryList(
        `select * from UploadFileData where BusinessKey=:BusinessKey and BusinessType=:BusinessType`,
        {
          replacements: {
            BusinessKey: WaitCheck.BusinessKey,
            BusinessType: "85",
          },
        }
      );
      return {
        code: 1,
        data: {
          WaitCheck: WaitCheck,
          ImgList: ImgList,
        },
      };
    } catch (error) {
      this.app.CoreAPI.Log.trace("getApplyFJAudit报错：", error);
      return { code: 0, error };
    }
  }

  // 保存申请复检审核
  async saveApplyFJAudit({ auditInfo, isStauts }, { ctx, userid }) {
    try {
      const { app } = this;
      const { Raw } = app.Dbs.hj;
      if (isStauts == 0) {
        let date = await this.ctx.service.hj.businessAuditService.IsHasChecked({
          CheckId: auditInfo.CheckId,
        });
        if (date.state && date.success) return date;
      }
      //赋值审核人,审核时间
      auditInfo.Checker = this.ctx.User.cnname;
      auditInfo.CheckTime = new Date();
      let params = {
        Checker: auditInfo.Checker,
        CheckTime: auditInfo.CheckTime,
        AuditState: auditInfo.AuditState,
        Remarks: auditInfo.Remarks,
        Status: 1,
      };
      await Raw.Update("WaitCheck", params, {
        wherestr: "where CheckId=:CheckId", //where 条件
        replacements: {
          CheckId: auditInfo.CheckId,
        },
      });
      await this.ctx.service.hj.hjnotice.updateBusinessNoticeByCheckId(
        auditInfo.CheckId
      );
      return { code: 1, msg: "提交审核成功！", auditInfo };
    } catch (error) {
      this.app.CoreAPI.Log.trace("saveApplyFJAudit报错：", error);
      return { code: 0, msg: "提交审核失败！", error };
    }
  }

  // 获取用户提交审核快捷回复
  async getUserAuditFastReply({}, { ctx, userid }) {
    try {
      const { app } = this;
      let url = `../documents/hj/user/${userid}`; //用户个性化配置位置
      let absolutePath = path.resolve();
      let fielPath = path.join(absolutePath, url);
      let AuditFastReply; //原有配置
      if (!fs.existsSync(fielPath)) {
        return { code: 1, data: { AuditFastReply: [] } };
      }
      if (fs.existsSync(path.join(fielPath, "vehicleMenuTab.json"))) {
        let data = fs.readFileSync(path.join(fielPath, "vehicleMenuTab.json"), {
          encoding: "utf-8",
        });
        AuditFastReply = JSON.parse(data).AuditFastReply;
        if (!AuditFastReply) AuditFastReply = [];
        return { code: 1, data: { AuditFastReply } };
      } else {
        return { code: 1, data: { AuditFastReply: [] } };
      }
    } catch (error) {
      this.app.CoreAPI.Log.trace("getUserAuditFastReply方法报错：" + error);
      return { code: 0, data: {}, msg: "获取用户审核快捷回复失败！", error };
    }
  }

  // 保存用户首页默认提示配置
  async updateUserAuditFastReply({ AuditFastReply }, { ctx, userid }) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let url = `documents/hj/user/${userid}`; //用户个性化配置位置
      let absolutePath = __dirname.split("\\"); //项目绝对路径
      absolutePath.splice(-4, 4);
      let fielPath = path.join(absolutePath.join("/"), url);
      let optionInfo = {}; //原有配置
      let code = 0;
      if (!fs.existsSync(fielPath)) {
        fielPath.split(path.sep).reduce((currentPath, folder) => {
          currentPath += folder + path.sep;
          if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
          }
          return currentPath;
        }, "");
      }
      fs.exists(path.join(fielPath, "vehicleMenuTab.json"), (exists) => {
        if (!exists)
          fs.writeFileSync(
            path.join(fielPath, "vehicleMenuTab.json"),
            JSON.stringify({}),
            "utf8"
          );
        fs.readFile(
          path.join(fielPath, "vehicleMenuTab.json"),
          { encoding: "utf-8" },
          (err, data) => {
            if (err) {
              console.log(err);
            } else {
              optionInfo = JSON.parse(data);
              optionInfo.AuditFastReply = AuditFastReply;
              fs.writeFile(
                `${fielPath}/vehicleMenuTab.json`,
                JSON.stringify(optionInfo),
                (err) => {
                  if (err) console.log(err);
                  else code = 1;
                }
              );
            }
          }
        );
      });
      return { code: 1, msg: "修改成功！" };
    } catch (error) {
      this.app.CoreAPI.Log.trace("updateUserAuditFastReply方法报错：" + error);
      return { code: 0, msg: "修改失败！", error };
    }
  }

  // 查询同车型号的车辆申请变更检测方法详情
  async getModifyMethodDetail({ param, pageParam }, { ctx, userid }) {
    try {
      const { app } = this;
      const { Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      pageParam = JSON.parse(pageParam);
      let { list, total } = await Raw.QueryPageData(
        `select a.*,b.AuditState from ApplyModifyInspectionMethod a,WaitCheck b
      where a.ID=b.BusinessKey and b.CheckType=:CheckType and a.IUVTYPE=:IUVTYPE and b.Status='1' and a.ID!=:ID`,
        pageParam.pageNum,
        pageParam.pageSize,
        {
          orderstr: "VLPN asc",
          replacements: {
            CheckType: "28",
            IUVTYPE: param.IUVTYPE,
            ID: param.ID,
          },
        }
      );
      return { code: 1, data: { list, total } };
    } catch (error) {
      this.app.CoreAPI.Log.trace("getModifyMethodDetail方法报错：" + error);
      return { code: 0, error };
    }
  }

  // 查询车辆审核历史记录
  async getVehicleAuditHistory({ param, pageParam }, { ctx, userid }) {
    try {
      const { app } = this;
      const { Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      pageParam = JSON.parse(pageParam);
      let { list, total } = await Raw.QueryPageData(
        `select CheckType,ApplyReason,ApplyTime,Checker,AuditState,Remarks from WaitCheck
        where VehicleID=${param.VehicleID} and CheckId!=${param.CheckId} and Status='1'`,
        pageParam.pageNum,
        pageParam.pageSize,
        {
          orderstr: "ApplyTime desc",
        }
      );
      return { code: 1, data: { list, total } };
    } catch (error) {
      this.app.CoreAPI.Log.trace("getVehicleAuditHistory方法报错：" + error);
      return { code: 0, error };
    }
  }

  // 查询该车牌或车架是否已存在重复数据
  async checkVehicleInfoExist(
    { vehicleInfo, modifyData, modifyInfo },
    { ctx, userid }
  ) {
    try {
      const { app } = this;
      const { Raw } = app.Dbs.hj;
      let jsonData = JSON.parse(modifyData.JsonData);
      let targetVehicleInfo = {
        VLPN: "",
        VLPNColor: "",
        VIN: "",
      };
      jsonData.forEach((item) => {
        if (item.Field == "VLPN") targetVehicleInfo.VLPN = item.NewValue;
        if (item.Field == "VIN") targetVehicleInfo.VIN = item.NewValue;
      });
      for (let i in targetVehicleInfo) {
        if (!targetVehicleInfo[i]) {
          targetVehicleInfo[i] = vehicleInfo[i];
        }
      }
      targetVehicleInfo.VehicleID = vehicleInfo.VehicleID;
      targetVehicleInfo.IsInValid = 0;
      let sql = `select VLPN,VLPNColor,VIN from Vehicle where VehicleID!=:VehicleID and IsInValid!=:IsInValid and ((VLPN=:VLPN and VLPNColor=:VLPNColor) or VIN=:VIN)`;
      let res = await Raw.QueryList(sql, {
        replacements: targetVehicleInfo,
      });
      return { code: 1, data: { theSameVehicleList: res } };
    } catch (error) {
      this.app.CoreAPI.Log.trace("checkVehicleInfoExist方法报错：" + error);
      return { code: 0, error };
    }
  }

  //修改车型审核排放标准
  async changeEmissionStandard({ param }, { ctx, userid }) {
    try {
      const { app } = this;
      const { Raw } = app.Dbs.hj;
      let logParam = {};
      let { oldEmissionStandard, newEmissionStandard, VehicleID } = JSON.parse(
        param
      );
      await Raw.Update(
        "Vehicle",
        { EmissionStandard: newEmissionStandard },
        {
          wherestr: "where VehicleID=:VehicleID", //where 条件
          replacements: {
            //参数化执行
            VehicleID: VehicleID,
            newEmissionStandard: newEmissionStandard,
          },
        }
      );
      // 添加到SystemOperactionLog表
      let olddata = await this.returnEmissionStandard(oldEmissionStandard);
      let newdata = await this.returnEmissionStandard(newEmissionStandard);
      logParam.DataTable = "Vehicle";
      logParam.Optime = new Date();
      logParam.Operator = ctx.User.username;
      logParam.DataSource = `车型审核修改排放标准{old:${olddata},new:${newdata}}，车辆ID：${VehicleID}`;
      await Raw.Insert("SystemOperactionLog", logParam);
      return { code: 1 };
    } catch (error) {
      this.app.CoreAPI.Log.trace("changeEmissionStandard方法报错：" + error);
      return { code: 0, error };
    }
  }
  async returnEmissionStandard(val) {
    let value;
    if (val == "00") {
      value = "国O";
    } else if (val == "01") {
      value = "国Ⅰ";
    } else if (val == "02") {
      value = "国Ⅱ";
    } else if (val == "03") {
      value = "国Ⅲ";
    } else if (val == "04") {
      value = "国Ⅳ";
    } else if (val == "05") {
      value = "国Ⅴ";
    } else if (val == "06") {
      value = "国VI";
    } else {
      value = "";
    }
    return value;
  }

  // 退回审核
  async saveBackToAudit({ auditInfo, tailCheckInfo }, { ctx, userid }) {
    const { app } = this;
    try {
      const { Raw } = app.Dbs.hj;
      if (auditInfo.CheckType == "07") {
        await Raw.Update(
          "RingTestSpotCheck",
          {
            InsExternalAudti: tailCheckInfo.InsExternalAudti,
            InsExternalNoZWM: tailCheckInfo.InsExternalNoZWM,
            InsExternalAudtiReason: tailCheckInfo.InsExternalAudtiReason,
          },
          {
            wherestr: "where RingTestSpotCheckID=:RingTestSpotCheckID", //where 条件
            replacements: {
              RingTestSpotCheckID: tailCheckInfo.RingTestSpotCheckID,
            },
          }
        );
      }
      let updateParam = {
        AuditState: "4",
        Status: "1",
        Remarks: auditInfo.Remarks,
        Checker: this.ctx.User.cnname,
        CheckTime: new Date(),
      };
      await Raw.Update("WaitCheck", updateParam, {
        wherestr: "where CheckId=:CheckId",
        replacements: {
          CheckId: auditInfo.CheckId,
        },
      });
      return { code: 1, msg: "退回成功！", auditInfo: updateParam };
    } catch (error) {
      app.CoreAPI.Log.trace("handleBackToAudit方法报错：" + error);
      return { code: 0, error };
    }
  }
}
class BusinessAuditCommon {
  async SaveAccessData(
    { auditInfo, acceptInfo },
    { ctx, userid, app },
    Raw,
    t
  ) {
    try {
      //第二步：审核不通过的，不跑受理流程
      if (auditInfo.AuditState == 0) return;
      //第三步: 受理数据redis保存
      //1.获取受理表字段名称
      const resData = await Raw.QueryList(
        `select syscolumns.name from syscolumns where id=object_id('Acceptance')`,
        {
          replacements: {},
          transaction: t,
        }
      );

      const entity = resData.map((t) => t.name);

      //2.获取车辆表数据
      const vehicleInfo = await Raw.Query(
        `select * from Vehicle where VehicleID=:VehicleID`,
        {
          replacements: {
            VehicleID: acceptInfo.VehicleID,
          },
          transaction: t,
        }
      );
      //获取是否开启外检有效期开关
      let isOpenExtExpiryDate = await app.redis
        .get("hj")
        .hget("systemconfig", "01_IsOpenExtExpiryDate");
      if (!isOpenExtExpiryDate) {
        const result = await Raw.Query(
          `select FieldValue from Sys_Config where FieldKey='IsOpenExtExpiryDate' and SysConfigType = '01'`,
          {
            replacements: {},
          }
        );
        if (result && result.FieldValue && result.FieldValue != "")
          isOpenExtExpiryDate = result.FieldValue;
      }
      let nowAcceptInfo = {};
      entity.map((key) => {
        if (
          key == "AcceptanceID" ||
          key == "IsExtCheck" ||
          key == "IsUploadLambdaLimit" ||
          key == "EACLU" ||
          key == "EACLD" ||
          key == "IsCheckHC" ||
          key == "IsCheckOBD"
        )
          nowAcceptInfo[key] = acceptInfo[key] || 0;
        else nowAcceptInfo[key] = vehicleInfo[key] || null;
      });
      nowAcceptInfo.CityCode = acceptInfo.CityCode;
      nowAcceptInfo.CountyCode = acceptInfo.CountyCode;
      nowAcceptInfo.StationCode = acceptInfo.StationCode;
      nowAcceptInfo.Operator = acceptInfo.Operator;
      nowAcceptInfo.InspectionKind = acceptInfo.InspectionKind;
      nowAcceptInfo.InspectionMethod = acceptInfo.InspectionMethod;
      nowAcceptInfo.InspectionNature = acceptInfo.InspectionNature;
      nowAcceptInfo.InspectionWay = acceptInfo.InspectionWay;
      nowAcceptInfo.Mileage = acceptInfo.Mileage;
      nowAcceptInfo.InspectionTimes = acceptInfo.InspectionTimes;
      nowAcceptInfo.SceneCode = acceptInfo.SceneCode;
      nowAcceptInfo.InspectionNum = acceptInfo.InspectionNum;
      nowAcceptInfo.DayAcceptanceNum = acceptInfo.DayAcceptanceNum;
      nowAcceptInfo.VIN = acceptInfo.VIN;
      nowAcceptInfo.FuelType = acceptInfo.FuelType;
      nowAcceptInfo.VehicleKind = acceptInfo.VehicleKind;
      nowAcceptInfo.IUVTYPE = acceptInfo.IUVTYPE;
      nowAcceptInfo.AcceptanceDate = acceptInfo.AcceptanceDate;
      nowAcceptInfo.AcceptYear = acceptInfo.AcceptYear;
      nowAcceptInfo.AcceptMonth = acceptInfo.AcceptMonth;
      if (isOpenExtExpiryDate != "false") {
        //若开启了外检有效期，则进入该方法
        acceptInfo.IsExtCheck = await this.getExteriorInspect(
          acceptInfo.VIN,
          acceptInfo.VLPN,
          acceptInfo.VLPNColor,
          acceptInfo.AcceptanceDate,
          acceptInfo.StationCode,
          {
            ctx,
            app,
          },
          Raw
        );
        nowAcceptInfo.IsExtCheck = acceptInfo.IsExtCheck;
      }
      if (
        acceptInfo.InspectionMethod === "A" &&
        acceptInfo.IsUploadLambdaLimit === null
      ) {
        acceptInfo.IsUploadLambdaLimit == 0;
        acceptInfo.EACLD = 0.95;
        acceptInfo.EACLU = 1.05;
      }
      if (
        ["A", "B", "C"].includes(acceptInfo.InspectionMethod) &&
        acceptInfo.IsCheckHC === null
      ) {
        acceptInfo.IsCheckHC = 1;
      }
      nowAcceptInfo.IsUploadLambdaLimit = acceptInfo.IsUploadLambdaLimit;
      nowAcceptInfo.EACLD = acceptInfo.EACLD;
      nowAcceptInfo.EACLU = acceptInfo.EACLU;
      nowAcceptInfo.IsCheckHC = acceptInfo.IsCheckHC;
      nowAcceptInfo.IsCheckOBD = acceptInfo.IsCheckOBD;
      //更新授权签字人和批准人
      const authorizedList = await Raw.QueryList(
        `select Name from StationStaff where StationCode=:StationCode and IsAuthorizedSignature=1`,
        {
          replacements: {
            StationCode: acceptInfo.StationCode,
          },
        }
      );
      const certifierList = await Raw.QueryList(
        `select Name from StationStaff where StationCode=:StationCode and IsCertifier=1`,
        {
          replacements: {
            StationCode: acceptInfo.StationCode,
          },
        }
      );
      const AuthorizedSignature = authorizedList.map((a) => a.Name).join(",");
      const Certifier = certifierList.map((a) => a.Name).join(",");
      nowAcceptInfo.AuthorizedSignature = AuthorizedSignature;
      nowAcceptInfo.Certifier = Certifier;
      let hj = Object.keys(app.config.redis.clients); //所有redis连接配置
      let childRedis = hj.filter((r) => r != "hj" && r != "fx"); //子redis
      let Area = "";
      if (nowAcceptInfo.StationCode)
        // Area = 'hj'+nowAcceptInfo.StationCode.substr(0, 4)+'00';//指定客户端的redis
        Area = "hj" + nowAcceptInfo.CityCode; //指定客户端的redis
      if (auditInfo.CheckType == "20" || auditInfo.CheckType == "31") {
        //受理审核和复合审核
        let allDate = {};
        let childData = {}; //子redis数据
        if (childRedis.length) {
          //先从子redis中获取数据，如果没有子redis，就从主redis中获取受理信息
          for (let i = 0, l = childRedis.length; i < l; i++) {
            childData = await app.redis
              .get(childRedis[i])
              .hgetall("bd/acceptance");
            Object.assign(allDate, childData);
          }
        } else {
          allDate = await app.redis.get("hj").hgetall("bd/acceptance");
        }
        for (let key in allDate) {
          if (
            key.indexOf("_0") != -1 &&
            JSON.parse(allDate[key]).VehicleID == acceptInfo.VehicleID
          ) {
            let value = {
              OP: "HDEL",
              VALUE: "",
              STATIONID: acceptInfo.StationCode,
              REDISKEY: "bd/acceptance",
              FIELDKEY: key,
            };
            if (childRedis.length) {
              for (let j = 0, l = childRedis.length; j < l; j++) {
                app.redis.get(childRedis[j]).hdel("bd/acceptance", key);
              }
            } else {
              app.redis.get("hj").hdel("bd/acceptance", key);
            }
            if (app.redis.get(Area)) {
              // 是否开启摩托车分布式开关
              let IsOpenMotorDistributed = await app.Dbs.hj.Raw.Query(
                `select FieldValue from sys_config where FieldKey='IsOpenMotorDistributed'`
              );
              // app.redis.get(Area).hset('informationupdate', `bd/acceptance@${key}@${acceptInfo.StationCode}`, JSON.stringify(value)) //存受理信息到指定客户端redis
              ctx.service.c440600.stationManagement.commonService.SetInformationUpdate(
                app,
                Area,
                `bd/acceptance@${key}@${acceptInfo.StationCode}`,
                JSON.stringify(value),
                IsOpenMotorDistributed.FieldValue
              );
            }
          }
        }
      }
      //第四步: 受理数据redis推送
      //保存受理信息到指定的redis
      if (app.redis.get(Area)) {
        app.redis
          .get(Area)
          .hset(
            "bd/acceptance",
            nowAcceptInfo.InspectionNum + "_0",
            JSON.stringify(nowAcceptInfo)
          );
        let value = {
          OP: "HSET",
          VALUE: JSON.stringify(nowAcceptInfo),
          STATIONID: nowAcceptInfo.StationCode,
          REDISKEY: "bd/acceptance",
          FIELDKEY: nowAcceptInfo.InspectionNum + "_0",
        };
        // 是否开启摩托车分布式开关
        let IsOpenMotorDistributed = "false";
        let IsOpenMotorDistributedResult = await app.Dbs.hj.Raw.Query(
          `select FieldValue from sys_config where FieldKey='IsOpenMotorDistributed'`
        );
        if (IsOpenMotorDistributedResult)
          IsOpenMotorDistributed = IsOpenMotorDistributedResult.FieldValue;
        ctx.service.c440600.stationManagement.commonService.SetInformationUpdate(
          app,
          Area,
          `bd/acceptance@${nowAcceptInfo.InspectionNum}_0@${acceptInfo.StationCode}`,
          JSON.stringify(value),
          IsOpenMotorDistributed
        );
        // app.redis.get(Area).hset('informationupdate', `bd/acceptance@${nowAcceptInfo.InspectionNum}_0@${acceptInfo.StationCode}`, JSON.stringify(value))
      } else {
        app.redis
          .get("hj")
          .hset(
            "bd/acceptance",
            nowAcceptInfo.InspectionNum + "_0",
            JSON.stringify(nowAcceptInfo)
          );
      }
      if (hj.includes(Area)) {
        app.redis
          .get(Area)
          .publish("ywxt/wjapp/slxx", JSON.stringify(nowAcceptInfo));
      } else {
        app.redis
          .get("hj")
          .publish("ywxt/wjapp/slxx", JSON.stringify(nowAcceptInfo));
      }
      return 1;
    } catch (error) {
      ctx.logger.error(error);
      throw error;
    }
  }

  async SaveCrossInspectByWaitCheck(
    { CheckId, Checker, CheckTime },
    { ctx, userid, app },
    Raw,
    t
  ) {
    try {
      const cModel = {};
      const sql = await Raw.Query(
        `
                select 
                 VehicleID,Applicant Recorder,ApplyTime RecordTime
                from WaitCheck 
                where checkId=:CheckId`,
        {
          replacements: {
            CheckId: CheckId,
          },
          transaction: t,
        }
      );
      if (sql) {
        const vehicleId = sql.VehicleID;
        cModel.IsCanCross = 1;
        cModel.LastOperator = Checker;
        cModel.LastTime = CheckTime;
        cModel.VehicleID = vehicleId;
        cModel.Recorder = sql.Recorder;
        cModel.RecordTime = sql.RecordTime;
        const crossData = await Raw.Query(
          `
                        select 
                        VehicleID
                        from CrossStationInspection 
                        where VehicleID=:VehicleID`,
          {
            replacements: {
              VehicleID: vehicleId,
            },
            transaction: t,
          }
        );
        if (crossData) {
          await Raw.Update(
            "CrossStationInspection",
            {
              IsCanCross: cModel.IsCanCross,
              LastOperator: cModel.LastOperator,
              LastTime: cModel.LastTime,
              Recorder: cModel.Recorder,
              RecordTime: cModel.RecordTime,
            },
            {
              wherestr: "where VehicleID=:VehicleID", //where 条件
              replacements: {
                VehicleID: cModel.VehicleID,
              },
              transaction: t,
            }
          );
        } else {
          await Raw.Insert(
            "CrossStationInspection",
            {
              IsCanCross: cModel.IsCanCross,
              LastOperator: cModel.LastOperator,
              LastTime: cModel.LastTime,
              Recorder: cModel.Recorder,
              RecordTime: cModel.RecordTime,
              VehicleID: cModel.VehicleID,
            },
            {
              transaction: t,
            }
          );
        }
      }

      return 1;
    } catch (error) {
      ctx.logger.error(error);
      throw error;
    }
  }

  async SaveJSJBApply({ model }, { ctx, userid, app }, Raw, t) {
    try {
      let postback = null;
      if (!model.JSJBApplyID) {
        postback = await Raw.Insert(
          "JSJBApply",
          {
            OldESignNo: model.OldESignNo,
            NewESignNo: model.NewESignNo,
            BHCLXH: model.BHCLXH,
            HBCLXHQZ: model.HBCLXHQZ,
            DPFDJ: model.DPFDJ,
            HasCCA: model.HasCCA,
            HasOxygenSensor: model.HasOxygenSensor,
            DRSFDJQCQZ: model.DRSFDJQCQZ,
            DKPYZZ: model.DKPYZZ,
            YRSFDJQCQZ: model.YRSFDJQCQZ,
            VDCT: model.VDCT,
            JBJL: model.JBJL,
            StationCode: model.StationCode,
            JBDATE: model.JBDATE,
            JSJBNUM: model.JSJBNUM,
            VDCTQZ: model.VDCTQZ,
            OldESignNoQZ: model.OldESignNoQZ,
          },
          {
            transaction: t,
          }
        );

        postback = await Raw.Query(
          `select top 1 * from JSJBApply order by JSJBApplyID desc`,
          {
            replacements: {},
            transaction: t,
          }
        );
      } else {
        //编辑
        await Raw.Update(
          "JSJBApply",
          {
            OldESignNo: model.OldESignNo,
            NewESignNo: model.NewESignNo,
            BHCLXH: model.BHCLXH,
            HBCLXHQZ: model.HBCLXHQZ,
            DPFDJ: model.DPFDJ,
            HasCCA: model.HasCCA,
            HasOxygenSensor: model.HasOxygenSensor,
            DRSFDJQCQZ: model.DRSFDJQCQZ,
            DKPYZZ: model.DKPYZZ,
            YRSFDJQCQZ: model.YRSFDJQCQZ,
            VDCT: model.VDCT,
            JBJL: model.JBJL,
            StationCode: model.StationCode,
            JBDATE: model.JBDATE,
            JSJBNUM: model.JSJBNUM,
            VDCTQZ: model.VDCTQZ,
            OldESignNoQZ: model.OldESignNoQZ,
          },
          {
            wherestr: "where JSJBApplyID=:JSJBApplyID", //where 条件
            replacements: {
              JSJBApplyID: model.JSJBApplyID,
            },
            transaction: t,
          }
        );
        postback = model;
      }
      return postback;
    } catch (error) {
      ctx.logger.error(error);
      throw error;
    }
  }

  //获得某月的天数
  getMonthDays(Year, Month) {
    var monthStartDate = new Date(Year, Month, 1);
    var monthEndDate = new Date(Year, Month + 1, 1);
    var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
  }

  //当开启外检有效期时，返回该车在外检有效期内的外检结果，0 未外检，1外检合格，2外检不合格
  async getExteriorInspect(
    VIN,
    VLPN,
    VLPNColor,
    AcceptanceTime,
    StationCode,
    { ctx, app },
    Raw
  ) {
    let isExCheck = 0;
    try {
      const db = await Raw.Query(
        `select top 1 UploadTime,AppearanceResult from AppearanceInfo where VIN=:VIN and VLPN=:VLPN and VLPNColor=:VLPNColor and StationCode=:StationCode order by UploadTime desc`,
        {
          replacements: {
            VIN: VIN,
            VLPN: VLPN,
            VLPNColor: VLPNColor,
            StationCode: StationCode,
          },
        }
      );
      if (db) {
        let expiryDate = await app.redis
          .get("hj")
          .hget("systemconfig", "01_ExtExpiryDate"); //获取外检有效期
        if (!expiryDate) {
          const result = await Raw.Query(
            `select FieldValue from Sys_Config where FieldKey='ExtExpiryDate' and SysConfigType = '01'`,
            {
              replacements: {},
            }
          );
          if (result && result.FieldValue && result.FieldValue != "")
            expiryDate = result.FieldValue;
        }
        let date = new Date(
          new Date(AcceptanceTime).toLocaleDateString()
        ).getTime(); //获取当前时间时间戳
        let perDate = new Date(
          new Date(db.UploadTime).toLocaleDateString()
        ).getTime();
        let day = parseInt((date - perDate) / 86400 / 1000); //获取相差的天数，可以为负数
        if (db.UploadTime < new Date(AcceptanceTime) && day <= expiryDate) {
          if (db.AppearanceResult == 1) {
            isExCheck = 1;
          } else if (db.AppearanceResult == 0) {
            isExtCheck = 2;
          } else {
            isExCheck = 0;
          }
        } else {
          isExCheck = 0;
        }
      } else {
        isExCheck = 0;
      }
      return isExCheck;
    } catch (error) {
      app.CoreAPI.Log.trace(
        "返回该车在外检有效期内的外检结果方法报错：" + error
      );
      return (isExCheck = null);
    }
  }
}

module.exports = BusinessAuditController;
