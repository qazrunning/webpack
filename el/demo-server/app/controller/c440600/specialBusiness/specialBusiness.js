"use strict";
/**
 * 特殊业务处理
 * */
const path = require("path");
const Controller = require("egg").Controller;
const fs = require("fs");
const awaitWriteStream = require("await-stream-ready").write;
const xlsx = require("xlsx");
const nodexlsx = require("node-xlsx");
// const await = require("await-stream-ready/lib/await");
const moment = require("moment");
// const { CLIENT_RENEG_LIMIT } = require("tls");
class specialBusiness extends Controller {
  async getForeignLocalData({ CityCode, param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let reqParam = {};
      let str = "";
      let str1 = "";
      let where = `where 1=1 and FuelType = 'B' and InspectionKind != 99 and InspectionNature = '01' and 
      Province is not null and City is not null and Province != '' and City != ''  `;
      const redisRes = await app.redis
        .get("hj")
        .hget("systemconfig", "01_LocalVlpn");
      const sqlRes = await Raw.Query(
        `select FieldValue from Sys_Config where FieldKey ='LocalVlpn'`,
        {}
      );
      if (redisRes) {
        redisRes.split(",").forEach((v) => (str = `'${v}',${str}`));
        str1 = str.slice(0, -1);
      } else {
        if (sqlRes)
          sqlRes.FieldValue.split(",").forEach((v) => (str = `'${v}',${str}`));
        str1 = str.slice(0, -1);
      }
      if (param.MoreValue) {
        where +=
          " and VLPN like :VLPN or InspectionNum like :InspectionNum or VIN like :VIN";
        reqParam.VLPN = "%" + param.MoreValue + "%";
        reqParam.InspectionNum = "%" + param.MoreValue + "%";
        reqParam.VIN = "%" + param.MoreValue + "%";
      }
      if (param.JCSJ1 && param.JCSJ2 && param.JCSJ1 != param.JCSJ2) {
        where += " and DetectEndTime >= :JCSJ1 and DetectEndTime <= :JCSJ2 ";
        reqParam.JCSJ1 = param.JCSJ1;
        reqParam.JCSJ2 = param.JCSJ2;
      } else if (param.JCSJ1 == param.JCSJ2 && param.JCSJ1 && param.JCSJ2) {
        where += " and DetectEndTime = :JCSJ1 ";
        reqParam.JCSJ1 = param.JCSJ1;
      }
      if (param.excessive0 == 1) where += ` and VDCT = 0  `;
      if (param.excessive1 == 1)
        where += ` and left(VLPN,2) not in (:str1) and InspectionKind != '06' `;
      if (param.excessive2 == 1)
        where += ` and DateDiff(yy,VRDATE,getdate())>5`;
      const StationData = await Raw.QueryList(
        `select SUM(c.total) as value from (select top(20) Province, 
      City, count(1) as total from InspectionData  ${where} and City != :CityCode group by Province, City order by total  desc) c `,
        {
          replacements: {
            CityCode,
            JCSJ1: reqParam.JCSJ1,
            JCSJ2: reqParam.JCSJ2,
            VLPN: reqParam.VLPN,
            VIN: reqParam.VIN,
            InspectionNum: reqParam.InspectionNum,
            str1: str1,
          },
        }
      );
      const StationData1 = await Raw.QueryList(
        `select SUM(c.total) as value1 from (select top(20) Province, 
      City, count(1) as total from InspectionData  ${where} and City = :CityCode group by Province, City order by total  desc) c `,
        {
          replacements: {
            CityCode,
            JCSJ1: reqParam.JCSJ1,
            JCSJ2: reqParam.JCSJ2,
            VLPN: reqParam.VLPN,
            VIN: reqParam.VIN,
            InspectionNum: reqParam.InspectionNum,
          },
        }
      );
      return JSON.stringify({
        state: 1,
        msg: "数据查询成功",
        data: [
          { value: StationData[0].value, name: "外地" },
          { value: StationData1[0].value1, name: "本地" },
        ],
      });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ state: 0, msg: "数据查询失败" });
    }
  }
  async getTheOwner5Data({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let reqParam = {};
      let str = "";
      let str1 = "";
      let where = `where 1=1 and FuelType = 'B' and InspectionKind != 99 and InspectionNature = '01' and len(OwnerName)>=4  and DateDiff(yy,VRDATE,getdate())>5 `;
      const redisRes = await app.redis
        .get("hj")
        .hget("systemconfig", "01_LocalVlpn");
      const sqlRes = await Raw.Query(
        `select FieldValue from Sys_Config where FieldKey ='LocalVlpn'`,
        {}
      );
      if (redisRes) {
        redisRes.split(",").forEach((v) => (str = `'${v}',${str}`));
        str1 = str.slice(0, -1);
      } else {
        sqlRes.FieldValue.split(",").forEach((v) => (str = `'${v}',${str}`));
        str1 = str.slice(0, -1);
      }
      if (param.MoreValue) {
        where +=
          " and VLPN like :VLPN or InspectionNum like :InspectionNum or VIN like :VIN";
        reqParam.VLPN = "%" + param.MoreValue + "%";
        reqParam.InspectionNum = "%" + param.MoreValue + "%";
        reqParam.VIN = "%" + param.MoreValue + "%";
      }
      if (param.JCSJ1 && param.JCSJ2 && param.JCSJ1 != param.JCSJ2) {
        where += " and DetectEndTime >= :JCSJ1 and DetectEndTime <= :JCSJ2 ";
        reqParam.JCSJ1 = param.JCSJ1;
        reqParam.JCSJ2 = param.JCSJ2;
      } else if (param.JCSJ1 == param.JCSJ2 && param.JCSJ1 && param.JCSJ2) {
        where += " and DetectEndTime = :JCSJ1 ";
        reqParam.JCSJ1 = param.JCSJ1;
      }
      if (param.excessive0 == 1) where += ` and VDCT = 0  `;
      if (param.excessive1 == 1) {
        where += ` and left(VLPN,2) not in (:str1) and InspectionKind != '06' `;
        reqParam.str1 = str1;
      }
      if (param.excessive2 == 1)
        where += ` and DateDiff(yy,VRDATE,getdate())>5`;
      const StationData = await Raw.QueryList(
        `select top(20) OwnerName,count(1) as total from InspectionData  ${where}  group by OwnerName order by total  desc`,
        { replacements: reqParam }
      );
      return JSON.stringify({
        state: 1,
        msg: "数据查询成功",
        data: StationData,
      });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ state: 0, msg: "数据查询失败" });
    }
  }
  async getNonLocalData({ CityCode, param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let reqParam = {};
      let str = "";
      let str1 = "";
      let where = `where 1=1 and FuelType = 'B' and InspectionKind != 99 and InspectionNature = '01' and Province is not null and City is not null and City is not null and Province != '' and City != '' and City !=:CityCode`;
      const redisRes = await app.redis
        .get("hj")
        .hget("systemconfig", "01_LocalVlpn");
      const sqlRes = await Raw.Query(
        `select FieldValue from Sys_Config where FieldKey ='LocalVlpn'`,
        {}
      );
      if (redisRes) {
        redisRes.split(",").forEach((v) => (str = `'${v}',${str}`));
        str1 = str.slice(0, -1);
      } else {
        sqlRes.FieldValue.split(",").forEach((v) => (str = `'${v}',${str}`));
        str1 = str.slice(0, -1);
      }
      if (param.MoreValue) {
        where +=
          " and VLPN like :VLPN or InspectionNum like :InspectionNum or VIN like :VIN";
        reqParam.VLPN = "%" + param.MoreValue + "%";
        reqParam.InspectionNum = "%" + param.MoreValue + "%";
        reqParam.VIN = "%" + param.MoreValue + "%";
      }
      if (param.JCSJ1 && param.JCSJ2 && param.JCSJ1 != param.JCSJ2) {
        where += " and DetectEndTime >= :JCSJ1 and DetectEndTime <= :JCSJ2 ";
        reqParam.JCSJ1 = param.JCSJ1;
        reqParam.JCSJ2 = param.JCSJ2;
      } else if (param.JCSJ1 == param.JCSJ2 && param.JCSJ1 && param.JCSJ2) {
        where += " and DetectEndTime = :JCSJ1 ";
        reqParam.JCSJ1 = param.JCSJ1;
      }
      if (param.excessive0 == 1) where += ` and VDCT = 0  `;
      if (param.excessive1 == 1)
        where += ` and left(VLPN,2) not in (:str1) and InspectionKind != '06' `;
      if (param.excessive2 == 1)
        where += ` and DateDiff(yy,VRDATE,getdate())>5`;
      const StationData = await Raw.QueryList(
        `select top(20) Province, City, count(1) as total from InspectionData  
      ${where}  group by Province, City order by total  desc`,
        {
          replacements: {
            CityCode,
            JCSJ1: reqParam.JCSJ1,
            JCSJ2: reqParam.JCSJ2,
            VLPN: reqParam.VLPN,
            VIN: reqParam.VIN,
            InspectionNum: reqParam.InspectionNum,
            str1: str1,
          },
        }
      );
      return JSON.stringify({
        state: 1,
        msg: "数据查询成功",
        data: StationData,
      });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ state: 0, msg: "数据查询失败" });
    }
  }
  async getTheOwnerData({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let reqParam = {};
      let str = "";
      let str1 = "";
      let where = `where 1=1 and FuelType = 'B' and InspectionKind != 99 and InspectionNature = '01' and VDCT = 0 and len(OwnerName)>=4`;
      const redisRes = await app.redis
        .get("hj")
        .hget("systemconfig", "01_LocalVlpn");
      const sqlRes = await Raw.Query(
        `select FieldValue from Sys_Config where FieldKey ='LocalVlpn'`,
        {}
      );
      if (redisRes) {
        redisRes.split(",").forEach((v) => (str = `'${v}',${str}`));
        str1 = str.slice(0, -1);
      } else {
        sqlRes.FieldValue.split(",").forEach((v) => (str = `'${v}',${str}`));
        str1 = str.slice(0, -1);
      }
      if (param.MoreValue) {
        where +=
          " and VLPN like :VLPN or InspectionNum like :InspectionNum or VIN like :VIN";
        reqParam.VLPN = "%" + param.MoreValue + "%";
        reqParam.InspectionNum = "%" + param.MoreValue + "%";
        reqParam.VIN = "%" + param.MoreValue + "%";
      }
      if (param.JCSJ1 && param.JCSJ2 && param.JCSJ1 != param.JCSJ2) {
        where += " and DetectEndTime >= :JCSJ1 and DetectEndTime <= :JCSJ2 ";
        reqParam.JCSJ1 = param.JCSJ1;
        reqParam.JCSJ2 = param.JCSJ2;
      } else if (param.JCSJ1 == param.JCSJ2 && param.JCSJ1 && param.JCSJ2) {
        where += " and DetectEndTime = :JCSJ1 ";
        reqParam.JCSJ1 = param.JCSJ1;
      }
      if (param.excessive0 == 1) where += ` and VDCT = 0  `;
      if (param.excessive1 == 1) {
        where += ` and left(VLPN,2) not in (:str1) and InspectionKind != '06' `;
        reqParam.str1 = str1;
      }
      if (param.excessive2 == 1)
        where += ` and DateDiff(yy,VRDATE,getdate())>5`;
      const StationData = await Raw.QueryList(
        `select top(20) OwnerName,count(1) as total from InspectionData  ${where}  group by OwnerName order by total  desc`,
        { replacements: reqParam }
      );
      return JSON.stringify({
        state: 1,
        msg: "数据查询成功",
        data: StationData,
      });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ state: 0, msg: "数据查询失败" });
    }
  }
  async getStationData({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let reqParam = {};
      let str = "";
      let str1 = "";
      let where = `where 1=1 and FuelType = 'B' and InspectionKind != 99 and InspectionNature = '01' and VDCT = 0`;
      const redisRes = await app.redis
        .get("hj")
        .hget("systemconfig", "01_LocalVlpn");
      const sqlRes = await Raw.Query(
        `select FieldValue from Sys_Config where FieldKey ='LocalVlpn'`,
        {}
      );
      if (redisRes) {
        redisRes.split(",").forEach((v) => (str = `'${v}',${str}`));
        str1 = str.slice(0, -1);
      } else {
        sqlRes.FieldValue.split(",").forEach((v) => (str = `'${v}',${str}`));
        str1 = str.slice(0, -1);
      }
      if (param.MoreValue) {
        where +=
          " and VLPN like :VLPN or InspectionNum like :InspectionNum or VIN like :VIN";
        reqParam.VLPN = "%" + param.MoreValue + "%";
        reqParam.InspectionNum = "%" + param.MoreValue + "%";
        reqParam.VIN = "%" + param.MoreValue + "%";
      }
      if (param.JCSJ1 && param.JCSJ2 && param.JCSJ1 != param.JCSJ2) {
        where += " and DetectEndTime >= :JCSJ1 and DetectEndTime <= :JCSJ2 ";
        reqParam.JCSJ1 = param.JCSJ1;
        reqParam.JCSJ2 = param.JCSJ2;
      } else if (param.JCSJ1 == param.JCSJ2 && param.JCSJ1 && param.JCSJ2) {
        where += " and DetectEndTime = :JCSJ1 ";
        reqParam.JCSJ1 = param.JCSJ1;
      }
      if (param.excessive0 == 1) where += ` and VDCT = 0  `;
      if (param.excessive1 == 1) {
        where += ` and left(VLPN,2) not in (:str1) and InspectionKind != '06' `;
        reqParam.str1 = str1;
      }
      if (param.excessive2 == 1)
        where += ` and DateDiff(yy,VRDATE,getdate())>5`;
      const StationData = await Raw.QueryList(
        `select top(20) StationCode,count(1) as total from InspectionData  ${where}  group by StationCode order by total  desc`,
        { replacements: reqParam }
      );
      return JSON.stringify({
        state: 1,
        msg: "数据查询成功",
        data: StationData,
      });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ state: 0, msg: "数据查询失败" });
    }
  }
  async getStatisData({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let reqParam = {};
      let str = "";
      let str1 = "";
      let where = `where 1=1 and FuelType = 'B' and InspectionKind != 99 and InspectionNature = '01' and VDCT = 0`;
      const redisRes = await app.redis
        .get("hj")
        .hget("systemconfig", "01_LocalVlpn");
      const sqlRes = await Raw.Query(
        `select FieldValue from Sys_Config where FieldKey ='LocalVlpn'`,
        {}
      );
      if (redisRes) {
        redisRes.split(",").forEach((v) => (str = `'${v}',${str}`));
        str1 = str.slice(0, -1);
      } else {
        sqlRes.FieldValue.split(",").forEach((v) => (str = `'${v}',${str}`));
        str1 = str.slice(0, -1);
      }
      if (param.MoreValue) {
        where +=
          " and VLPN like :VLPN or InspectionNum like :InspectionNum or VIN like :VIN";
        reqParam.VLPN = "%" + param.MoreValue + "%";
        reqParam.InspectionNum = "%" + param.MoreValue + "%";
        reqParam.VIN = "%" + param.MoreValue + "%";
      }
      if (param.JCSJ1 && param.JCSJ2 && param.JCSJ1 != param.JCSJ2) {
        where += " and DetectEndTime >= :JCSJ1 and DetectEndTime <= :JCSJ2 ";
        reqParam.JCSJ1 = param.JCSJ1;
        reqParam.JCSJ2 = param.JCSJ2;
      } else if (param.JCSJ1 == param.JCSJ2 && param.JCSJ1 && param.JCSJ2) {
        where += " and DetectEndTime = :JCSJ1 ";
        reqParam.JCSJ1 = param.JCSJ1;
      }
      if (param.excessive0 == 1) where += ` and VDCT = 0  `;
      if (param.excessive1 == 1) {
        where += ` and left(VLPN,2) not in (:str1) and InspectionKind != '06' `;
        reqParam.str1 = str1;
      }
      if (param.excessive2 == 1)
        where += ` and DateDiff(yy,VRDATE,getdate())>5`;
      const StatisData = await Raw.QueryList(
        `select top(20) FactoryPlateModel,count(1) as total from InspectionData  ${where}  group by FactoryPlateModel order by total  desc`,
        { replacements: reqParam }
      );
      return JSON.stringify({
        state: 1,
        msg: "数据查询成功",
        data: StatisData,
      });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ state: 0, msg: "数据查询失败" });
    }
  }
  async getDieselSup({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let reqParam = {};
      let str = "";
      let str1 = "";
      let where =
        "where 1=1 and FuelType = 'B' and InspectionKind != 99 and InspectionNature = '01' ";
      const redisRes = await app.redis
        .get("hj")
        .hget("systemconfig", "01_LocalVlpn");
      const sqlRes = await Raw.Query(
        `select FieldValue from Sys_Config where FieldKey ='LocalVlpn'`,
        {}
      );

      if (param.MoreValue) {
        where +=
          " and VLPN like :VLPN or InspectionNum like :InspectionNum or VIN like :VIN";
        reqParam.VLPN = "%" + param.MoreValue + "%";
        reqParam.InspectionNum = "%" + param.MoreValue + "%";
        reqParam.VIN = "%" + param.MoreValue + "%";
      }
      if (param.JCSJ1 && param.JCSJ2 && param.JCSJ1 != param.JCSJ2) {
        where += " and DetectEndTime >= :JCSJ1 and DetectEndTime <= :JCSJ2 ";
        reqParam.JCSJ1 = param.JCSJ1;
        reqParam.JCSJ2 = param.JCSJ2;
      } else if (param.JCSJ1 == param.JCSJ2 && param.JCSJ1 && param.JCSJ2) {
        where += " and DetectEndTime = :JCSJ1 ";
        reqParam.JCSJ1 = param.JCSJ1;
      }
      if (redisRes) {
        redisRes.split(",").forEach((v) => (str = `'${v}',${str}`));
        str1 = str.slice(0, -1);
      } else {
        sqlRes.FieldValue.split(",").forEach((v) => (str = `'${v}',${str}`));
        str1 = str.slice(0, -1);
      }
      if (param.excessive0 == 1) where += ` and VDCT = 0  `;
      if (param.excessive1 == 1) {
        reqParam.str1 = str1;
        where += ` and left(VLPN,2) not in (:str1) and InspectionKind != '06' `;
      }
      if (param.excessive2 == 1)
        where += ` and DateDiff(yy,VRDATE,getdate())>5`;
      let data = [];
      if (param.isExport == 0) {
        data = await Raw.QueryPageData(
          `SELECT  e.*FROM(select  ROW_NUMBER() over(ORDER BY DetectEndTime desc) AS RowIndex,d.*from(
          select c.*FROM(select ROW_NUMBER() OVER (PARTITION BY  VehicleID ORDER BY DetectEndTime desc) as RowNumber,
          StationCode, VRDATE, InspectionNum, VIN, VLPN, VLPNColor, IUTYPE, DetectEndTime, VDCT, InspectionTimes,InspectionNature,InspectionKind,FuelType from InspectionData  ${where}) 
          c WHERE c.RowNumber=1)d )e `,
          param.pageIndex,
          param.pageSize,
          {
            orderstr: "DetectEndTime desc",
            replacements: reqParam,
          }
        );
        return JSON.stringify({
          state: 1,
          msg: "数据查询成功",
          data: data.list,
          total: data.total,
          str1,
        });
      } else {
        data = await Raw.QueryList(
          `SELECT  e.*FROM(select  ROW_NUMBER() over(ORDER BY DetectEndTime desc) AS RowIndex,d.*from(
          select c.*FROM(select ROW_NUMBER() OVER (PARTITION BY  VehicleID ORDER BY DetectEndTime desc) as RowNumber,
          StationCode, VRDATE, InspectionNum, VIN, VLPN, VLPNColor, IUTYPE, DetectEndTime, VDCT, InspectionTimes,InspectionNature,InspectionKind,FuelType from InspectionData  ${where}) 
          c WHERE c.RowNumber=1)d )e`,
          { replacements: reqParam }
        );
        return JSON.stringify({ state: 1, data, msg: "数据查询成功！", str1 });
      }
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ state: 0, msg: "数据查询失败" });
    }
  }
  // 新增或编辑机动车异地定检证明
  async addvehCheckCertify(param, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let { ID, RowNum, ...entity } = param;
      if (!ID) {
        let reqParam = {};
        let where = "";
        let areaCode =
          (this.ctx.session.userRoles["行政区角色"] &&
            this.ctx.session.userRoles["行政区角色"]) ||
          [];
        areaCode = areaCode.sort(function (a, b) {
          return a - b;
        });
        areaCode = (areaCode.length && areaCode[0]) || "";
        const AddYear = param.AddDate.slice(0, 4);
        areaCode = areaCode.slice(0, 4);
        where += " AddYear=:AddYear";
        reqParam.AddYear = AddYear;
        const preTotal = await Raw.Query(
          `SELECT TOP 1 Total  FROM YDVehicleCheckCertify where ${where} order by Total  desc `,
          {
            replacements: reqParam,
          }
        );
        const Total = (preTotal && preTotal.Total + 1) || 0;
        let CertifyID;
        if (Total > 0) {
          if (Total < 10) {
            CertifyID =
              String(areaCode) + String(AddYear) + "00" + String(Total);
          } else if (Total > 9 && Total < 100) {
            CertifyID =
              String(areaCode) + String(AddYear) + "0" + String(Total);
          } else {
            CertifyID = String(areaCode) + String(AddYear) + String(Total);
          }
        } else {
          CertifyID = String(areaCode) + String(AddYear) + "001";
        }
        entity.Total = Total;
        entity.CertifyID = CertifyID;
        entity.AddYear = this.ctx.helper.dataFormat(new Date(), "yyyy");
        entity.SignatureDate = entity.SignatureDate
          ? this.ctx.helper.dataFormat(entity.SignatureDate, "yyyy")
          : null;

        await Raw.Insert("YDVehicleCheckCertify", entity);
        return JSON.stringify({ result: true, msg: "保存成功！" });
      } else {
        await Raw.Update("YDVehicleCheckCertify", entity, {
          wherestr: "where ID=:ID", //where 条件
          replacements: {
            ID: ID,
          },
        });
        return JSON.stringify({ result: true, msg: "修改成功！" });
      }
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ result: false, msg: "保存失败" });
    }
  }
  // 检索异地定检证明信息
  async searchVehCheckCertify({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let {
        VLPN,
        VIN,
        SignatureDate1,
        SignatureDate2,
        pageSize,
        pageIndex,
        likeValue,
      } = param;
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let where = "";
      let reqParam = {};
      if (likeValue) {
        reqParam.VLPN = "%" + likeValue + "%";
        reqParam.VIN = "%" + likeValue + "%";
        where += " and VLPN like :VLPN or VIN like :VIN";
      }
      if (VLPN) {
        reqParam.VLPN = "%" + VLPN + "%";
        where += " and VLPN like :VLPN ";
      }
      if (VIN) {
        reqParam.VIN = "%" + VIN + "%";
        where += " and VIN like :VIN ";
      }
      if (SignatureDate1 && SignatureDate2) {
        reqParam.SignatureDate1 = SignatureDate1;
        reqParam.SignatureDate2 = SignatureDate2;
        where +=
          " and SignatureDate >= :SignatureDate1 and SignatureDate <= :SignatureDate2 ";
      }
      const sqles = `select * from YDVehicleCheckCertify where 1=1 ${where}`;
      let result = await Raw.QueryPageData(sqles, pageIndex, pageSize, {
        orderstr: " SignatureDate desc",
        replacements: reqParam,
      });
      return { data: result.list, count: result.total };
    } catch (error) {
      this.ctx.logger.error(error);
      return { msg: "检索信息出错" };
    }
  }

  // 新增-修改-违法复核审批信息
  async addenvReview(param, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let { ID, AddYear, RowNum, ...entity } = param;
      if (ID) {
        await Raw.Update("ViolationVehicleAudit", entity, {
          wherestr: "where ID=:ID", //where 条件
          replacements: {
            ID: ID,
          },
        });
        return JSON.stringify({ result: true, msg: "修改成功！" });
      } else {
        let reqParam = {};
        reqParam.AddYear = AddYear;
        const where = "  AddYear = :AddYear ";
        const sqlesTotal = `SELECT TOP 1 Total  FROM ViolationVehicleAudit where ${where}  order by Total  desc`;
        const preTotal = await Raw.Query(sqlesTotal, {
          replacements: reqParam,
        });
        let Total = (preTotal && preTotal.Total + 1) || 0;
        let CheckNum = "";
        if (Total > 0) {
          if (Total < 10) {
            CheckNum = String(AddYear) + "-" + "00" + String(Total);
          } else if (Total > 9 && Total < 100) {
            CheckNum = String(AddYear) + "-" + "0" + String(Total);
          } else {
            CheckNum = String(AddYear) + "-" + String(Total);
          }
        } else {
          CheckNum = String(AddYear) + "-" + "001";
        }
        entity.CheckNum = CheckNum;
        entity.Total = Total;
        entity.AddYear = AddYear;
        entity.AddDate = this.ctx.helper.dataFormat(
          new Date(),
          "yyyy-MM-dd hh:mm:ss"
        );
        entity.AcceptanceDate = entity.AcceptanceDate
          ? this.ctx.helper.dataFormat(
            entity.AcceptanceDate,
            "yyyy-MM-dd hh:mm:ss"
          )
          : null;
        entity.OperatDate = entity.OperatDate
          ? this.ctx.helper.dataFormat(entity.OperatDate, "yyyy-MM-dd hh:mm:ss")
          : null;
        entity.AuditDate = entity.AuditDate
          ? this.ctx.helper.dataFormat(entity.AuditDate, "yyyy-MM-dd hh:mm:ss")
          : null;
        entity.CenterAuditDate = entity.CenterAuditDate
          ? this.ctx.helper.dataFormat(
            entity.CenterAuditDate,
            "yyyy-MM-dd hh:mm:ss"
          )
          : null;
        await Raw.Insert("ViolationVehicleAudit", entity);
        return JSON.stringify({ result: true, msg: "保存成功！" });
      }
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ result: false, msg: "保存失败" });
    }
  }

  // 检索违法复核审批信息
  async searchenvReview({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let {
        VLPN,
        Applicat,
        AcceptanceDate1,
        AcceptanceDate2,
        pageIndex,
        pageSize,
      } = param;
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let reqParam = {};
      let where = "";
      if (VLPN) {
        reqParam.VLPN = "%" + VLPN + "%";
        where += " and VLPN like :VLPN ";
      }
      if (Applicat) {
        reqParam.Applicat = "%" + Applicat + "%";
        where += " and Applicat like :Applicat ";
      }
      if (AcceptanceDate1 && AcceptanceDate2) {
        reqParam.AcceptanceDate1 = AcceptanceDate1;
        reqParam.AcceptanceDate2 = AcceptanceDate2;
        where +=
          " and AcceptanceDate >= :AcceptanceDate1 and AcceptanceDate <= :AcceptanceDate2 ";
      }
      const sqles = "select * from ViolationVehicleAudit where 1=1 " + where;
      const result = await Raw.QueryPageData(sqles, pageIndex, pageSize, {
        orderstr: "AcceptanceDate desc",
        replacements: reqParam,
      });
      return JSON.stringify({ data: result.list, count: result.total });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ msg: "检索失败！" });
    }
  }
  // 跨站检测管理——检索
  async searchDetectionInfo({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { VLPN, VLPNColor, VIN, OwnerName, RecordTime1, RecordTime2 } = param;
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let where = "1=1";
      let reqParam = {};
      if (VLPN) {
        reqParam.VLPN = "%" + VLPN + "%";
        where += " and VLPN like :VLPN ";
      }
      if (VLPNColor) {
        reqParam.VLPNColor = VLPNColor;
        where += " and VLPNColor = :VLPNColor ";
      }
      if (VIN) {
        reqParam.VIN = "%" + VIN + "%";
        where += " and VIN like :VIN ";
      }
      if (OwnerName) {
        reqParam.OwnerName = "%" + OwnerName + "%";
        where += " and OwnerName like :OwnerName ";
      }
      if (RecordTime1 && RecordTime2) {
        reqParam.RecordTime1 = RecordTime1;
        reqParam.RecordTime2 = RecordTime2;
        where +=
          " and left(CONVERT(varchar(100),RecordTime, 120),10) >= :RecordTime1 and left(CONVERT(varchar(100),RecordTime, 120),10) <= :RecordTime2 ";
      }
      const sqles = `select b.VehicleID,a.VIN,a.VLPN,a.VLPNColor,a.OwnerName,b.Recorder,b.LastOperator,
                        b.RecordTime,b.LastTime,b.IsCanCross,b.ID from CrossStationInspection as b 
                        left join Vehicle as a  on b.VehicleID=a.VehicleID where ${where} ORDER BY b.LastTime desc`;
      const result = await Raw.QueryList(sqles, {
        replacements: reqParam,
      });
      const username = ctx.User.username; //登录信息
      return JSON.stringify({ data: result, username });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ msg: "检索信息出错" });
    }
  }
  // 跨站检测管理——高级检索
  async advancedSearch({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let reqParam = {};
      let where = " where 1=1 ";
      for (let key in param) {
        if (
          key != "VRDATE1" &&
          key != "VRDATE2" &&
          key != "pageIndex" &&
          key != "pageSize"
        ) {
          if (param[key]) {
            reqParam[key] = "%" + param[key] + "%";
            where += " and " + key + " like :" + key;
          }
        }
      }
      if (param.VRDATE1 && param.VRDATE2) {
        reqParam.VRDATE1 = param.VRDATE1;
        reqParam.VRDATE2 = param.VRDATE2;
        where += " and VRDATE >= :VRDATE1 and VRDATE <= :VRDATE2 ";
      }
      const page = (param.pageIndex - 1) * param.pageSize;
      if (param.pageSize) {
        reqParam.pageSize = param.pageSize;
        reqParam.RowNumber = page;
      } else {
        reqParam.pageSize = 20;
        reqParam.RowNumber = 0;
      }
      const sql = `select TOP(:pageSize) * from (
        select ROW_NUMBER() OVER (ORDER BY VehicleID desc) as RowNumber,*
        from Vehicle  ${where} ) Vehicle where RowNumber > :RowNumber`;
      const sqlcount = "select count(1) as total from Vehicle " + where;
      const result = await Raw.QueryList(sql, {
        replacements: reqParam,
      });
      const Count = await Raw.Query(sqlcount, {
        replacements: reqParam,
      });
      return JSON.stringify({ state: 1, data: result, dataCount: Count.total });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ msg: "检索信息出错" });
    }
  }

  // 新增跨站检测车辆
  async addDetectionVeh(
    { VehicleID, Recorder, LastOperator, RecordTime, LastTime, IsCanCross },
    { ctx, userid }
  ) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let reqParam = {};
      reqParam.VehicleID = VehicleID;
      const where = "  VehicleID = :VehicleID ";
      const sqlesVehicleID =
        "SELECT count(*) as vehID  FROM CrossStationInspection where " + where;
      const oldVehicleID = await Raw.Query(sqlesVehicleID, {
        replacements: reqParam,
      });
      if (oldVehicleID.vehID == 0) {
        await Raw.Insert("CrossStationInspection", {
          VehicleID,
          Recorder,
          LastOperator,
          RecordTime,
          LastTime,
          IsCanCross,
        });
        return JSON.stringify({ result: true, msg: "保存成功！" });
      }
      return JSON.stringify({ result: true, msg: "该数据已存在！" });
    } catch (error) {
      this.ctx.logger.error(error);
    }
  }

  // 修改跨站检测车辆信息
  async modDetectionVeh(
    {
      ID,
      modNum,
      VehicleID,
      Recorder,
      LastOperator,
      RecordTime,
      LastTime,
      IsCanCross,
    },
    { ctx, userid }
  ) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let reqParam = {};
      if (modNum == 1) {
        reqParam.VehicleID = VehicleID;
        const where = "  VehicleID = :VehicleID ";
        const sqlesVehicleID =
          "SELECT count(*) as vehID  FROM CrossStationInspection where " +
          where;
        const oldVehicleID = await Raw.Query(sqlesVehicleID, {
          replacements: reqParam,
        });
        if (oldVehicleID.vehID == 0) {
          await Raw.Update(
            "CrossStationInspection",
            {
              VehicleID,
              Recorder,
              LastOperator,
              RecordTime,
              LastTime,
              IsCanCross,
            },
            {
              wherestr: "where ID=:ID",
              replacements: {
                ID: ID,
              },
            }
          );
          return JSON.stringify({ result: true, msg: "修改成功！" });
        }
        return JSON.stringify({ result: true, msg: "该数据已存在！" });
      }
      await Raw.Update(
        "CrossStationInspection",
        { VehicleID, Recorder, LastOperator, RecordTime, LastTime, IsCanCross },
        {
          wherestr: "where ID=:ID", //where 条件
          replacements: {
            ID: ID,
          },
        }
      );
      return JSON.stringify({ result: true, msg: "修改成功！" });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ result: false, msg: "修改失败" });
    }
  }

  // 反恐平台公安数据管理--检索与高级检索
  async getAntiManageData({ param }, { ctx, userid }) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      let where = " where 1=1";
      let reqParam = {};
      for (let key in param) {
        if (
          key != "VRDATE_FDJXH1" &&
          key != "VRDATE_FDJXH2" &&
          key != "AbandonedYear_QZBFQZ1" &&
          key != "AbandonedYear_QZBFQZ2" &&
          key != "YQJYQZBFQZ1" &&
          key != "YQJYQZBFQZ2" &&
          key != "currentPage" &&
          key != "pageSize" &&
          key != "isAll"
        ) {
          if (param[key]) {
            where += " and " + key + " like :" + key;
            reqParam[key] = "%" + param[key] + "%";
          }
        }
      }
      if (param.VRDATE_FDJXH1 && param.VRDATE_FDJXH2) {
        reqParam.VRDATE_FDJXH1 = param.VRDATE_FDJXH1;
        reqParam.VRDATE_FDJXH2 = param.VRDATE_FDJXH2;
        where +=
          " and VRDATE_FDJXH >= :VRDATE_FDJXH1 and VRDATE_FDJXH <= :VRDATE_FDJXH2 ";
      }
      if (param.AbandonedYear_QZBFQZ1 && param.AbandonedYear_QZBFQZ2) {
        reqParam.AbandonedYear_QZBFQZ1 = param.AbandonedYear_QZBFQZ1;
        reqParam.AbandonedYear_QZBFQZ2 = param.AbandonedYear_QZBFQZ2;
        where +=
          " and AbandonedYear_QZBFQZ >= :AbandonedYear_QZBFQZ1 and AbandonedYear_QZBFQZ <= :AbandonedYear_QZBFQZ2 ";
      }
      if (param.YQJYQZBFQZ1 && param.YQJYQZBFQZ2) {
        reqParam.YQJYQZBFQZ1 = param.YQJYQZBFQZ1;
        reqParam.YQJYQZBFQZ2 = param.YQJYQZBFQZ2;
        where +=
          " and YQJYQZBFQZ >= :YQJYQZBFQZ1 and YQJYQZBFQZ <= :YQJYQZBFQZ2 ";
      }
      if (param.isAll) {
        const allDate = await Raw.QueryList(
          `select * from T_FKGA_VEHICLE ${where} order by ImportDateTime desc`,
          {
            replacements: reqParam,
          }
        );
        return { state: 200, allDate };
      }
      let data = await Raw.QueryPageData(
        `select * from T_FKGA_VEHICLE ${where}`,
        param.currentPage,
        param.pageSize,
        {
          orderstr: "VRDATE_FDJXH desc ",
          replacements: reqParam,
        }
      );
      return JSON.stringify({ data: data.list, state: 200, count: data.total });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ state: 0, msg: "检索失败！" });
    }
  }
  //反恐平台公安数据管理-数据导入
  async importAntiManageData({ }, { ctx, userid }) {
    try {
      //1.获取文件流
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let importDateArr = [];
      const stream = await this.ctx.getFileStream();
      let baseDir = await app.redis
        .get("hj")
        .hget("systemconfig", "01_UploadFolder");
      if (!baseDir) {
        const result = await Raw.Query(
          `select FieldValue from Sys_Config where FieldKey='UploadFolder'`,
          {
            replacements: {},
          }
        );
        if (result && result.FieldValue && result.FieldValue != "")
          baseDir = result.FieldValue;
        else baseDir = "C:/bsFile";
      } //保存的路径
      let filename = stream.filename; //文件名称
      const url = path.join(baseDir, "HJ_AntiTerrprism/");
      //2.保存路径是否存在,不存在则逐级创建目录
      if (!fs.existsSync(url)) {
        url.split(path.sep).reduce((currentPath, folder) => {
          currentPath += folder + path.sep;
          if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
          }
          return currentPath;
        }, "");
      }
      //3.保存文件
      const savepath = path.join(url, filename);
      const writeStream = fs.createWriteStream(savepath);
      await awaitWriteStream(stream.pipe(writeStream));
      //4.读取excel文件
      const workbook = xlsx.readFile(savepath);
      const sheetNames = workbook.SheetNames; // 返回 ['sheet1', ...]
      const worksheet = workbook.Sheets[sheetNames[0]];
      //5.设置读取的范围
      let range = xlsx.utils.decode_range(worksheet["!ref"]);
      range.s.r = 1;
      range.s.c = 0;
      //6.获取excel数据
      const data = xlsx.utils.sheet_to_json(worksheet, {
        header: 1,
        range: range,
        raw: false,
      });
      if (data.length == 0) {
        return JSON.stringify({ msg: "同步的文件数据为空！", code: 2 }); //导入数据为空则返回
      }
      //写入数据库字段
      let insertSql = [
        "XH",
        "VLPN_HPHM",
        "VLPNColor_HPZL",
        "VIN",
        "IUVTYPE_CLXH",
        "UseOfAuto_SYXZ",
        "VehicleType_GA_CLLX",
        "EmissionStandard",
        "VRDATE_FDJXH",
        "FuelType_FDJXH",
        "IUETYPE_FDJXH",
        "ZZL_VML",
        "RatedSeats_HDZK",
        "AbandonedYear_QZBFQZ",
        "City_XZQH",
        "VStatus_ZT",
        "HBDBQK",
        "ImportDateTime",
        "FZJG",
        "YQJYQZBFQZ",
      ];
      //7.数据处理
      for (let i = 0; i < data.length; i++) {
        let importDate = {}; //写入表中的数据
        data[i][8] = this.ctx.helper.dataFormat(
          new Date(data[i][8]),
          "yyyy-MM-dd hh:mm:ss"
        );
        data[i][13] = this.ctx.helper.dataFormat(
          new Date(data[i][13]),
          "yyyy-MM-dd hh:mm:ss"
        );
        data[i][17] = data[i][17]
          ? this.ctx.helper.dataFormat(
            new Date(data[i][17]),
            "yyyy-MM-dd hh:mm:ss"
          )
          : this.ctx.helper.dataFormat(new Date(), "yyyy-MM-dd hh:mm:ss"); //最近一次同步时间
        data[i][19] = this.ctx.helper.dataFormat(
          new Date(data[i][19]),
          "yyyy-MM-dd hh:mm:ss"
        );
        if (data[i][2].toString().length == 1) {
          data[i][2] = "0" + data[i][2];
        }
        //8.数据入库处理
        const isTrue = await Raw.Query(
          "select top 1 * from  T_FKGA_Vehicle where XH=:XH",
          {
            replacements: { XH: data[i][0].toString() },
          }
        );
        if (isTrue) {
          importDate.SysFlag = 0;
          importDate.FalseReason = "已存在反恐公安数据，不做同步";
        } else {
          importDate.SysFlag = 1;
          importDate.FalseReason = "同步成功";
        }
        //写入数据到临时表
        for (let j = 0; j < insertSql.length; j++) {
          importDate[insertSql[j]] = data[i][j];
        }
        importDateArr.push(importDate);
      }
      await Raw.InsertList("T_FKGA_Vehicle_Temp", importDateArr);
      //写入数据到正式表
      const insertData = await Raw.QueryList(
        "select XH,VLPN_HPHM,VLPNColor_HPZL,IUVTYPE_CLXH,UseOfAuto_SYXZ,VehicleType_GA_CLLX,VRDATE_FDJXH,FuelType_FDJXH,IUETYPE_FDJXH,ZZL_VML,RatedSeats_HDZK,AbandonedYear_QZBFQZ,City_XZQH,VStatus_ZT,HBDBQK,ImportDateTime,FZJG,YQJYQZBFQZ,VIN,EmissionStandard from T_FKGA_Vehicle_Temp  where SysFlag=1"
      );
      await Raw.InsertList("T_FKGA_Vehicle", insertData);
      await Raw.Execute("truncate table T_FKGA_Vehicle_Temp"); //清空T_FKGA_Vehicle_Temp临时表
      return { success: true, msg: "数据上传成功！" };
    } catch (error) {
      this.ctx.logger.error(error);
      await sendToWormhole(stream);
      return { success: false, msg: "数据导入失败！" };
    }
  }
  // 黄标车管理与提交-检索
  async huangbiaoVehicleManagement({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let where = "where 1=1";
      let reqParam = {};
      let sqles = "";
      for (let key in param) {
        if (
          key != "pageSize" &&
          key != "currentPage" &&
          key != "type" &&
          key != "getAll" &&
          key != "ZPSJ1" &&
          key != "ZPSJ2" &&
          key != "AuditDateTime1" &&
          key != "AuditDateTime2" &&
          key != "ImportDateTime1" &&
          key != "ImportDateTime2"
        ) {
          if (param[key]) {
            where += " and " + key + " like :" + key;
            reqParam[key] = "%" + param[key] + "%";
          }
        }
        if (param.ZPSJ1 && param.ZPSJ2) {
          where += " and ZPSJ >= :ZPSJ1 and ZPSJ <= :ZPSJ2 ";
          reqParam.ZPSJ1 = param.ZPSJ1;
          reqParam.ZPSJ2 = param.ZPSJ2;
        }
        if (param.AuditDateTime1 && param.AuditDateTime2) {
          where +=
            " and AuditDateTime >= :AuditDateTime1 and AuditDateTime <= :AuditDateTime2 ";
          reqParam.AuditDateTime1 = param.AuditDateTime1;
          reqParam.AuditDateTime2 = param.AuditDateTime2;
        }
        if (param.ImportDateTime1 && param.ImportDateTime2) {
          where +=
            " and ImportDateTime >= :ImportDateTime1 and ImportDateTime <= :ImportDateTime2 ";
          reqParam.ImportDateTime1 = param.ImportDateTime1;
          reqParam.ImportDateTime2 = param.ImportDateTime2;
        }
      }
      if (param.getAll) {
        let sqlesAll = `select ID,XH,OwnerName,VLPN,(select CodeName from CD_VLPNColor where CodeValue = VLPNColor) as VLPNColor,VIN,Tel,
        (select CodeName from CD_VStatus where CodeValue=VStatus) as VStatus,
        ZPSJ,ZPDW,(case when BStatus=0 then '未审核' when BStatus=1 then '已审核' else '' end )as BStatus,
                (select CodeName from CD_AuditResult where CodeValue = AuditResult) as AuditResult,AuditDateTime,Auditer,SubmitDateTime,ImportDateTime,
            (case when Flag=0 then '否' when Flag=1 then '是' else '' end ) as Flag  from Vehicle_YLCGA ${where}`;
        const allDate = await Raw.QueryList(sqlesAll, {
          replacements: reqParam,
        });
        return { allDate };
      }
      if (param.type == "1")
        sqles = `select * from Vehicle_YLCGA ${where} and IsInValid != 1 and Flag!=1 and AuditResult='01'`; //提交查询
      if (param.type == "2") sqles = `select * from Vehicle_YLCGA ${where}`; //管理查询
      let data = await Raw.QueryPageData(
        sqles,
        param.currentPage,
        param.pageSize,
        {
          orderstr: "Vehicle_YLCGAID desc",
          replacements: reqParam,
        }
      );
      return JSON.stringify({
        data: data.list,
        count: data.total,
        state: 200,
        msg: "检索成功!",
      });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ state: 0, msg: "检索失败！" });
    }
  }
  //黄标车管理-图片查看
  async GetYLCGAFileByte({ Vehicle_YLCGAID, ID }, { ctx, userid }) {
    let { app } = this;
    let { transaction, Raw } = app.Dbs.hj;
    if (Vehicle_YLCGAID && ID) {
      const fileList = await Raw.QueryList(
        "select * from Vehicle_YLCGA_UploadFile where Vehicle_YLCGAID=:Vehicle_YLCGAID and ID=:ID",
        { replacements: { Vehicle_YLCGAID: Vehicle_YLCGAID, ID: ID } }
      );
      return JSON.stringify({ fileList });
    }
  }
  //黄标车管理-图片上传
  async vehicleYLCGAUpload(param, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let imgPath = this.config.captureImgPath;
      const stream = await this.ctx.getFileStream();
      let datas = stream.fields; //拿到上传的额外信
      let filename =
        datas.Vehicle_YLCGAID +
        "_" +
        Math.floor(Math.random() * 9000) +
        "_" +
        stream.filename;
      const targets = path.join("", imgPath + "/");
      if (!fs.existsSync(targets)) {
        targets.split(path.sep).reduce((currentPath, folder) => {
          currentPath += folder + path.sep;
          if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
          }
          return currentPath;
        }, "");
      }
      const target = path.join(targets, filename);
      datas.FullFileName = path.join(imgPath + "/", filename);
      // datas.FullFileName = "VehicleYLCGA/" + filename;
      datas.FileExtension = stream.mimeType;
      datas.UploadTime = datas.Modifytime = new Date();
      datas.DisplayName = stream.filename.substring(
        0,
        stream.filename.indexOf(".")
      );
      const writeStream = fs.createWriteStream(target);
      await awaitWriteStream(stream.pipe(writeStream));
      datas.Bytes = Buffer.from(fs.readFileSync(datas.FullFileName)); //转字节
      let lsitet = {
        Vehicle_YLCGAID: datas.Vehicle_YLCGAID,
        ID: datas.ID,
        FileExtension: datas.FileExtension,
        UploadTime: datas.UploadTime,
        DisplayName: datas.DisplayName,
        Remark: "",
        Modifytime: datas.Modifytime,
        UploadPerson: ctx.User.username,
        FullFileName: datas.FullFileName,
        Bytes: datas.Bytes,
      };
      const result = await Raw.Insert("Vehicle_YLCGA_UploadFile", lsitet);
      return { msg: "文件上传成功!", success: true };
    } catch (error) {
      this.ctx.logger.error(error);
      //this.app.CoreAPI.Log.info(error);
      // await sendToWormhole(stream);
      return false;
    }
  }
  // 鉴别是否还是黄标车
  async checkIsHuangbiao({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { VLPN, VLPNColor } = param;
      let { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let where1 = " and 1=1";
      let where2 = " and 1=1";
      let sqlParam1 = {};
      let sqlParam2 = {};
      if (VLPN) {
        where1 += " and HPHM=:HPHM";
        where2 += " and VLPN=:VLPN";
        sqlParam1.HPHM = VLPN;
        sqlParam2.VLPN = VLPN;
      }
      if (VLPNColor) {
        where1 += " and HPZL=:HPZL";
        where2 += " and VLPNColor=:VLPNColor";
        sqlParam1.HPZL = VLPNColor;
        sqlParam2.VLPNColor = VLPNColor;
      }
      let sqles1 =
        "select count(*) as zs from  Vehicle_CancelYLC where HPHM=right('{0}',6)   and HPZL='{1}'" +
        where1;
      let sqles2 =
        " select count(*) as zs from JiShuJianBie where VLPN='{0}' and VLPNColor='{1}'" +
        where2;
      let result = await Raw.QueryList(sqles1, {
        replacements: sqlParam1,
      });
      let result2 = await Raw.QueryList(sqles2, {
        replacements: sqlParam2,
      });
      let jsjb = false,
        bfc = false;
      if (result.zs > 0) {
        jsjb = true;
      }
      if (result2.zs > 0) {
        bfc = true;
      }
      return JSON.stringify({ jsjb, bfc, state: 200 });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ state: 0, msg: "检索失败！" });
    }
  }
  //判断公安抓拍黄标车是否在黄标车清单表中
  async isInHuangbbiaoV({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { VLPN, VLPNColor, XH } = param;
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let where = "where 1=1";
      let reqParam = {};
      if (VLPN) {
        where += " and VLPN=:VLPN";
        reqParam.VLPN = VLPN;
      }
      if (VLPNColor) {
        where += " and VLPNColor=:VLPNColor";
        reqParam.VLPNColor = VLPNColor;
      }
      if (XH) {
        where += " and XH=:XH";
        reqParam.XH = XH;
      }
      let cunzai = false;

      let sqles = ` select top 1 * from Vehicle_YLC ` + where;
      let data = await Raw.Query(sqles, {
        replacements: reqParam,
      });
      if (data) {
        cunzai = true;
      }
      return JSON.stringify({ cunzai, msg: "检索失败！", state: 200 });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ state: 0, msg: "检索失败！" });
    }
  }

  // 批量提交
  async submitHuangbiao(
    { Vehicle_YLCGAID, Submitter, SubmitDateTime },
    { ctx, userid }
  ) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let user = await Raw.Update(
        "Vehicle_YLCGA",
        {
          Flag: 1,
          SyncFlag: 0,
          Submitter: Submitter,
          SubmitDateTime: SubmitDateTime,
        },
        {
          wherestr: "where Vehicle_YLCGAID in(:Vehicle_YLCGAID)",
          replacements: { Vehicle_YLCGAID: Vehicle_YLCGAID },
        }
      );
      return JSON.stringify({ result: true, msg: "提交成功", state: 200 });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ result: false, state: 0, msg: "提交失败！" });
    }
  }

  //保存或审核黄标车清单
  async SaveVehicle_YLCGA(param, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let {
        Vehicle_YLCGAID,
        _index,
        _rowKey,
        pageSize,
        RowNum,
        type,
        ...hbcData
      } = param;
      if (type == 1) {
        hbcData.Flag = 0;
        hbcData.SyncFlag = 0;
        hbcData.Auditer = ctx.User.username;
        hbcData.AuditDateTime = this.ctx.helper.dataFormat(
          new Date(),
          "yyyy-MM-dd hh:mm:ss"
        );
        const hbcDataAuditResult = {
          "01": "04",
          "02": "05",
          "03": "07",
          "04": "08",
          "05": "09",
          "06": "06",
        };
        hbcData.YLCAuditResult = hbcDataAuditResult[hbcData.AuditResult];
        // switch (hbcData.AuditResult) {
        //   case "01": //核实黄标
        //     hbcData.YLCAuditResult = "04"; //人工核实黄标
        //     break;
        //   case "02": //核实绿标
        //     hbcData.YLCAuditResult = "05"; //人工核实绿标
        //     break;
        //   case "03": //不确定已联系车主
        //     hbcData.YLCAuditResult = "07"; //不确定已联系车主
        //     break;
        //   case "04": //不确定无法联系车主
        //     hbcData.YLCAuditResult = "08"; //不确定无法联系车主
        //     break;
        //   case "05": //不确定该车无车辆信息
        //     hbcData.YLCAuditResult = "09"; //不确定该车无车辆信息
        //     break;
        //   case "06": //清单中不存在
        //     hbcData.YLCAuditResult = "06"; //不确定
        //     break;
        // }
        if (hbcData.AuditResult != "06") {
          const XH = hbcData.XH;
          const VLPN = hbcData.VLPN;
          const VLPNColor = hbcData.VLPNColor;
          let where = " where 1=1";
          let reqParam = {};
          if (XH) {
            where += " or XH=:XH";
            reqParam.XH = XH;
          }
          if (VLPN) {
            where += " and VLPN=:VLPN";
            reqParam.VLPN = VLPN;
          }
          if (VLPNColor) {
            where += " and VLPNColor=:VLPNColor";
            reqParam.VLPNColor = VLPNColor;
          }
          const hbcqd = await Raw.Query(
            `select top 1 *  from Vehicle_YLC  ${where}`,
            {
              replacements: reqParam,
            }
          );
          const { Vehicle_YLCID, ...qd } = hbcqd;
          //更新黄标车清单
          qd.VLPN = hbcData.VLPN;
          qd.VLPNColor = hbcData.VLPNColor;
          qd.GAVType = hbcData.GAVType ? qd.GAVType : hbcData.GAVType;
          qd.EmissionStandard = hbcData.EmissionStandard
            ? qd.EmissionStandard
            : hbcData.EmissionStandard;
          qd.UseOfAuto = hbcData.UseOfAuto ? qd.UseOfAuto : hbcData.UseOfAuto;
          qd.FactoryPlateModel = hbcData.FactoryPlateModel
            ? qd.FactoryPlateModel
            : hbcData.FactoryPlateModel;
          qd.IUVTYPE = hbcData.IUVTYPE ? qd.IUVTYPE : hbcData.IUVTYPE;
          qd.IUETYPE = hbcData.IUETYPE ? qd.IUETYPE : hbcData.IUETYPE;
          qd.VIN = hbcData.VIN ? qd.VIN : hbcData.VIN;
          qd.EngineNum = hbcData.EngineNum ? qd.EngineNum : hbcData.EngineNum;
          qd.VRDATE = hbcData.VRDATE;
          qd.ProductDate = hbcData.ProductDate;
          qd.RatedSeats =
            hbcData.RatedSeats <= 0 ? qd.RatedSeats : hbcData.RatedSeats;
          qd.VML = hbcData.VML <= 0 ? qd.VML : hbcData.VML;
          qd.KerbMass = hbcData.KerbMass <= 0 ? qd.KerbMass : hbcData.KerbMass;
          qd.BenchmarkMass =
            hbcData.BenchmarkMass <= 0
              ? qd.BenchmarkMass
              : hbcData.BenchmarkMass;
          qd.IUVMANU = hbcData.IUVMANU ? qd.IUVMANU : hbcData.IUVMANU;
          qd.FuelType = hbcData.FuelType ? qd.FuelType : hbcData.FuelType;
          qd.EDSPL = hbcData.EDSPL <= 0 ? qd.EDSPL : hbcData.EDSPL;
          qd.EnginePower =
            hbcData.EnginePower <= 0 ? qd.EnginePower : hbcData.EnginePower;
          qd.OwnerName = hbcData.OwnerName ? qd.OwnerName : hbcData.OwnerName;
          qd.Address = hbcData.Address ? qd.Address : hbcData.Address;
          qd.Tel = hbcData.Tel ? qd.Tel : hbcData.Tel;
          qd.CredentialsType = hbcData.CredentialsType
            ? qd.CredentialsType
            : hbcData.CredentialsType;
          qd.CredentialsNum = hbcData.CredentialsNum
            ? qd.CredentialsNum
            : hbcData.CredentialsNum;
          qd.OilSupplyWay = hbcData.OilSupplyWay
            ? qd.OilSupplyWay
            : hbcData.OilSupplyWay;
          qd.IntakeWay = hbcData.IntakeWay ? qd.IntakeWay : hbcData.IntakeWay;
          qd.Mileage = hbcData.Mileage <= 0 ? qd.Mileage : hbcData.Mileage;
          qd.OCHA = hbcData.OCHA ? qd.OCHA : hbcData.OCHA;
          qd.Province = hbcData.Province ? qd.Province : hbcData.Province;
          qd.City = hbcData.City ? qd.City : hbcData.City;
          qd.County = hbcData.County ? qd.County : hbcData.County;
          qd.VStatus = hbcData.VStatus ? qd.VStatus : hbcData.VStatus;
          qd.AbandonedYear = hbcData.AbandonedYear;
          // qd.State=2;
          qd.YLCAuditResult = hbcData.YLCAuditResult;
          qd.IsInValid = 0;
          if (hbcData.AuditResult == "01") {
            qd.Flag = 1;
            qd.SyncFlag = 1;
          } else {
            qd.Flag = 0;
            qd.SyncFlag = 0;
          }
          await Raw.Update("Vehicle_YLC", qd, {
            wherestr: "where VLPNColor=:VLPNColor and VLPN =:VLPN",
            replacements: { VLPNColor: VLPNColor, VLPN: VLPN },
          });
        }
      }
      const a = await Raw.Update("Vehicle_YLCGA", hbcData, {
        wherestr: "where Vehicle_YLCGAID=:Vehicle_YLCGAID",
        replacements: {
          Vehicle_YLCGAID: Vehicle_YLCGAID,
        },
      });
      return { result: true, msg: "保存成功!", state: 200 };
    } catch (error) {
      this.ctx.logger.error(error);
      return { state: 0, msg: "保存失败！", result: false };
    }
  }
  // 黄标车同步-检索
  async HuangbiaoVehicleSync({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { VLPN, ZPSJ1, ZPSJ2 } = param;
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let where = "";
      let reqParam = {};
      if (VLPN) {
        where += " and VLPN like :VLPN";
        reqParam.VLPN = "%" + VLPN + "%";
      }
      if (ZPSJ1 && ZPSJ2) {
        where += " and ZPSJ>=:ZPSJ1 and ZPSJ<=:ZPSJ2";
        reqParam.ZPSJ1 = ZPSJ1;
        reqParam.ZPSJ2 = ZPSJ2;
      }
      let sqles =
        `SELECT ID
      ,XH
      ,OwnerName
      ,VLPN
      ,(select CodeName from CD_VLPNColor where CodeValue=VLPNColor) as VLPNColor
      ,VIN
      ,(select CodeName from CD_VStatus where CodeValue=VStatus) as VStatus
      ,CONVERT(varchar(19) ,ZPSJ,120) as ZPSJ
      ,ZPDW
      ,DLDM
      ,LKBH
      ,SBLX
      ,SBBH
      ,FalseReason
      FROM Vehicle_YLCGA_Temp where 1=1 ` + where;
      let data = await Raw.QueryList(sqles, {
        replacements: reqParam,
      });
      return JSON.stringify({ data, state: 200 });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ state: 0 });
    }
  }
  // 黄标车同步-文件导入
  async huangVehicImport(param, { ctx, userid }) {
    try {
      //1.获取文件流
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let importDateArr = []; //写入表中的所有数据
      const stream = await this.ctx.getFileStream();
      let baseDir = await app.redis
        .get("hj")
        .hget("systemconfig", "01_UploadFolder");
      if (!baseDir) {
        const result = await Raw.Query(
          `select FieldValue from Sys_Config where FieldKey='UploadFolder'`
        );
        if (result && result.FieldValue && result.FieldValue != "")
          baseDir = result.FieldValue;
        else baseDir = "C:/bsFile";
      } //保存的路径
      let filename = stream.filename; //文件名称
      const url = path.join(baseDir, "HJ_SyncData/");
      //2.保存路径是否存在,不存在则逐级创建目录
      if (!fs.existsSync(url)) {
        url.split(path.sep).reduce((currentPath, folder) => {
          currentPath += folder + path.sep;
          if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
          }
          return currentPath;
        }, "");
      }
      //3.保存文件
      const savepath = path.join(url, filename);
      const writeStream = fs.createWriteStream(savepath);
      await awaitWriteStream(stream.pipe(writeStream));
      //4.读取excel文件
      const workbook = xlsx.readFile(savepath);
      const sheetNames = workbook.SheetNames; // 返回 ['sheet1', ...]
      const worksheet = workbook.Sheets[sheetNames[0]];
      //5.设置读取的范围
      let range = xlsx.utils.decode_range(worksheet["!ref"]);
      range.s.r = 1;
      range.s.c = 0;
      //6.获取excel数据
      const data = xlsx.utils.sheet_to_json(worksheet, {
        header: 1,
        range: range,
        raw: false,
      });
      if (data.length == 0) {
        return JSON.stringify({ msg: "同步的文件数据为空！", code: 2 }); //导入数据为空则返回
      }
      //7.时间处理并数据入库
      let importDate = {}; //写入表中的单条数据
      //写入数据库字段
      let insertSql = [
        "ID",
        "XH",
        "VLPN",
        "VLPNColor",
        "VIN",
        "OwnerName",
        "VStatus",
        "ZPSJ",
        "ZPDW",
        "DLDM",
        "LKBH",
        "SBLX",
        "SBBH",
      ];

      for (let i = 0; i < data.length; i++) {
        importDate = {};
        data[i][7] = this.ctx.helper.dataFormat(
          new Date(data[i][7]),
          "yyyy-MM-dd hh:mm:ss"
        );
        if (data[i][3].toString().length == 1) {
          data[i][3] = "0" + data[i][3];
        }
        switch (
        data[i][3] //公安车牌颜色和环保车牌颜色转换
        ) {
          case "02":
            data[i][3] = "01";
            break;
          case "01":
            data[i][3] = "02";
            break;
          case "06":
            data[i][3] = "03";
            break;
          default:
            data[i][3] = "04";
            break;
        }
        const IsTrue = await Raw.Query(
          "select top 1 Count(1) from Vehicle_YLCGA where ID=:ID",
          {
            replacements: { ID: data[i][0].toString() },
          }
        );
        if (IsTrue) {
          importDate.FalseReason = "已存在抓拍车辆信息，不做同步";
          importDate.SyncFlag = 0;
        } else {
          importDate.FalseReason = "同步成功";
          importDate.SyncFlag = 1;
        }
        //循环拼接插入数据
        for (let j = 0; j < insertSql.length; j++) {
          importDate[insertSql[j]] = data[i][j];
        }
        importDateArr.push(importDate);
      }
      await Raw.Execute("truncate table Vehicle_YLCGA_Temp"); //清空T_FKGA_Vehicle_Temp临时表
      await Raw.InsertList("Vehicle_YLCGA_Temp", importDateArr); //写入临时表
      //数据同步到临时表成功之后，更新黄标车的相关字段信息。
      const updataYellow = await Raw.QueryList(
        "select * from Vehicle_YLCGA_Temp t join Vehicle_YLC y on t.VLPN=y.VLPN AND t.VLPNColor=y.VLPNColor where t.SyncFlag=1"
      );
      await Raw.InsertList("Vehicle_YLCGA_Temp", updataYellow);
      //临时表黄标车数据更新正确之后，把处理好的黄标车数据同步到公安抓拍黄标车信息正式表中，条件：SyncFlag = 1
      const insertintoylcga = await Raw.QueryList(
        "select VehicleID,UniqueString,VLPN,VLPNColor,GAVType,EmissionStandard,UseOfAuto,FactoryPlateModel,IUVTYPE,IUETYPE,VIN,EngineNum,VRDATE,ProductDate,RatedSeats,VML,KerbMass,BenchmarkMass,IUVMANU,FuelType,EDSPL,EnginePower,OwnerName,Address,Tel,CredentialsType,CredentialsNum,OilSupplyWay,IntakeWay,Mileage,OCHA,Province,City,County, VStatus,AbandonedYear,YQJYQZBFQZ,XH,VType,HBDBQK,FZJG,ID,ZPSJ,ZPDW,DLDM,LKBH,SBLX,SBBH,Vehicle_YLCID,YLCAuditResult from Vehicle_YLCGA_Temp where SyncFlag=1"
      );
      await Raw.InsertList("Vehicle_YLCGA", insertintoylcga);
      return { success: true, msg: "数据上传成功！" };
    } catch (error) {
      this.ctx.logger.error(error);
      await sendToWormhole(stream);
      return { success: false, msg: "数据导入失败！" };
    }
  }
  // 维修厂查询-海南
  async seacrchHNFactory({ param }, { }) {
    try {
      let { app } = this;
      const { Raw } = app.Dbs.hj;

      let where = ` 1=1 `;
      let reqParam = {};
      for (let key in param) {
        if (
          key == "selectData" &&
          param.selectData != "" &&
          param.selectData != undefined
        ) {
          where +=
            " and companyname like :selectData or companyuniquecode like :selectData";
          reqParam.selectData = "%" + param.selectData + "%";
        }
        let factoryObj = await Raw.QueryPageData(
          `select * FROM Mstation_M where ${where}`,
          param.pageIndex,
          param.pageSize,
          {
            orderstr: "MstionID desc",
            replacements: { ...reqParam },
          }
        );
        let { list, total } = factoryObj;
        return JSON.stringify({
          code: 1,
          msg: "获取成功",
          factoryList: list,
          total,
        });
      }
    } catch (error) {
      console.log(error);
      this.app.CoreAPI.Log.trace("获取海南维修厂数据错误", error);
      return JSON.stringify({ state: "0", msg: "获取失败" });
    }
  }
  //维修厂管理桂林小程序调用方法-查询所有维修厂信息
  async searchAllMaintainFactorInfo() {
    try {
      let { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      const countSql = `select MAI_ID as id,MAI_Name as title,MAI_OperateRange,MAI_Tel,MAI_Address,MAI_PosX as longitude,MAI_PosY as latitude from  MaintainFactory where MAI_Status ='01' `;
      const result = await Raw.QueryList(countSql);
      return { state: 1, data: result };
    } catch (error) {
      this.ctx.logger.error("searchAllMaintainFactorInfo方法错误" + error);
      return { state: 0 };
    }
  }
  //维修厂管理-查询
  async searchMaintainFactorInfo({ param }, { ctx, userid }) {
    try {
      let { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      let where = " ";
      let reqParam = {};
      for (let key in param) {
        if (
          key == "MAI_CompanyType" &&
          param.MAI_CompanyType != "" &&
          param.MAI_CompanyType != undefined
        ) {
          where += " and MAI_CompanyType=:MAI_CompanyType";
          reqParam.MAI_CompanyType = param.MAI_CompanyType;
        } else if (
          key == "MAI_LV" &&
          param.MAI_LV !== "" &&
          param.MAI_LV != undefined
        ) {
          where += " and MAI_LV=:MAI_LV";
          reqParam.MAI_LV = param.MAI_LV;
        } else if (key == "MoreValue" && param.MoreValue) {
          where +=
            " and (MAI_Name like :MoreValue or MAI_Address like :MoreValue)";
          reqParam.MoreValue = "%" + param.MoreValue + "%";
        } else if (
          key != "CurrentPage" &&
          key != "PageSize" &&
          key != "total"
        ) {
          if (param[key]) {
            where += " and " + key + " like :" + key;
            reqParam[key] = "%" + param[key] + "%";
          }
        }
      }
      //分页查询
      const StartRow = (param.CurrentPage - 1) * param.PageSize + 1;
      const EndRow = param.CurrentPage * param.PageSize;
      reqParam.StartRow = StartRow;
      reqParam.EndRow = EndRow;
      const countSql = `select count(1) as count from V_MaintainFactory_PDF where 1=1 ${where}`;
      const CountData = await Raw.Query(countSql, {
        replacements: reqParam,
      });
      if (CountData.count == 0) {
        return JSON.stringify({ data: [], total: 0 });
      }
      const sqles = `select * from (select ROW_NUMBER() OVER (ORDER BY MAI_RecordTime desc) AS RowNumber,* 
      from V_MaintainFactory_PDF where 1=1 ${where}) d where RowNumber >=:StartRow  and RowNumber <=:EndRow`;
      const result = await Raw.QueryList(sqles, {
        replacements: reqParam,
      });
      return JSON.stringify({
        data: result,
        total: CountData.count,
        state: 200,
      });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ state: "0" });
    }
  }
   //维修厂管理-新增与编辑
   async EditMaintainFactorInfo(param, { ctx, userid }) {
    try {
      let { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let str = "";
      let valueStr = "";
      const DataInfo = param.DataInfo;
      let reqParam = {};
      if (DataInfo.MAI_ID) {
        //修改
        for (const item in DataInfo) {
          if (
            DataInfo[item] &&
            item != "PDFCount" &&
            item != "MAI_ID" &&
            item != "imgData"
          ) {
            reqParam[item] = DataInfo[item];
          }
        }
         await Raw.Update("MaintainFactory", reqParam, {
          wherestr: "where MAI_ID =:MAI_ID",
          replacements: { MAI_ID: DataInfo["MAI_ID"] },
        });
        ctx.service.hj.maintainFactory.sendFactoryStatus(
            reqParam
        );
        return JSON.stringify({ success: true, msg: "修改成功！" });
      } else {
        //新增
        for (const item in DataInfo) {
          if (
            DataInfo[item] &&
            item != "MAI_ID" &&
            item != "PDFCount" &&
            item != "imgData"
          ) {
            reqParam[item] = DataInfo[item];
            str += item + ",";
            valueStr += ":" + item + ",";
          }
        }
        //录入时间
        let mydate = new Date();
        var currentTime = moment(mydate).format('YYYY-MM-DD HH:mm:ss');
        reqParam["MAI_RecordTime"] = currentTime;
        str += "MAI_RecordTime";
        valueStr += ":MAI_RecordTime";
        await Raw.Insert("MaintainFactory", reqParam);
        return JSON.stringify({ success: true, msg: "保存成功！" });
      }
     
    } catch (error) {
      this.app.CoreAPI.Log.trace('EditMaintainFactorInfo报错:'+error)
      return JSON.stringify({ success: false });
    }
  }
  // 维修厂管理-数据同步
  async updateFactoryInfo(params, { ctx, userid }) {
    const { formData, imgList, cnname } = params;
    // 删除空属性
    var newFormData = {};
    for (var key in formData) {
      if (
        (formData[key] === 0 || formData[key] === false || formData[key]) &&
        formData[key].toString().replace(/(^\s*)|(\s*$)/g, "") !== ""
      ) {
        newFormData[key] = formData[key];
      }
    }
    try {
      const { app } = this;
      const { Raw } = app.Dbs.hj;
      let EntKey = newFormData.EntKey;
      delete newFormData.EntKey;
      newFormData.MAI_Status = "03";
      newFormData.MAI_Recorder = cnname;
      newFormData.MAI_RecordTime = new Date();
      let obj = await Raw.Query(
        `select MAI_ID from  MaintainFactory where EntKey='${EntKey}'`
      );

      let MAI_ID = obj.MAI_ID;
      let oldImgList = await Raw.QueryList(
        `select RecordNo, FileGroup from  UploadFileData where BusinessKey='${MAI_ID}' and BusinessTable='MaintainFactory'`
      );
      let imgToUpdate = [];
      imgList.forEach((item) => {
        let index = oldImgList.findIndex(
          (k) => item.RecordNo === k.RecordNo && item.FileGroup === k.FileGroup
        );
        if (index == -1) {
          imgToUpdate.push({
            FileGroup: item.FileGroup,
            RecordNo: item.RecordNo,
          });
        }
      });
      let where = ` 1=1 `;
      if (imgToUpdate.length) {
        where = "FileGroup in (";
        imgToUpdate.forEach((item) => {
          where += `'${item.FileGroup}',`;
        });
        where = where.substring(0, where.length - 1) + ")";
      }

      await Raw.ExecWithTran(async (t) => {
        // let imgToDelete = await Raw.QueryList(`select RecordNo, FileGroup from UploadFileData where BusinessKey='${MAI_ID}' and BusinessTable='MaintainFactory' and ${where}`, { transaction: t })
        await Raw.Update("MaintainFactory", newFormData, {
          wherestr: "where MAI_ID=:MAI_ID",
          transaction: t,
          replacements: { MAI_ID: MAI_ID },
        });
        if (imgToUpdate.length) {
          await Raw.ExecuteNoQuery(
            `delete from UploadFileData where BusinessKey='${MAI_ID}' and BusinessTable='MaintainFactory' and ${where}`,
            { transaction: t }
          );
          let imgToCopy = imgToUpdate.map((item) => item.RecordNo);
          ctx.service.hj.maintainFactory.copyFile(imgToCopy, MAI_ID);
        }
      });

      return { code: 1, message: "维修厂数据同步成功" };
    } catch (error) {
      console.log(error);
      this.app.CoreAPI.Log.trace("updateFactory方法报错：", error);
      return { code: 0, message: "维修厂数据同步失败" };
    }
  }
  //维修厂管理-删除
  async DeleteMaintainFactorInfo({ MAI_ID }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      await Raw.Delete("MaintainFactory", {
        wherestr: "where MAI_ID=:MAI_ID", //where 条件
        replacements: {
          MAI_ID: MAI_ID,
        },
      });
      return JSON.stringify({ success: true, msg: "删除成功！" });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ success: false, msg: "删除失败！" });
    }
  }
  //维修厂管理-数据导入
  async importMaintainFactory({ }, { ctx, userid }) {
    try {
      //1.获取文件流
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let importDate = {}; //写入表中的单条数据
      let importDateArr = []; //写入表中的所有数据
      const stream = await this.ctx.getFileStream();
      let baseDir = "C:/skyland/uploadfactoryfile/";
      if (!baseDir) {
        const result = await Raw.Query(
          `select FieldValue from Sys_Config where FieldKey='UploadFolder'`,
          {
            replacements: {},
          }
        );
        if (result && result.FieldValue && result.FieldValue != "")
          baseDir = result.FieldValue;
        else baseDir = "C:/bsFile";
      } //保存的路径
      let filename = stream.filename; //文件名称
      const url = path.join(baseDir, "HJ_MaintainFactory/");
      //2.保存路径是否存在,不存在则逐级创建目录
      if (!fs.existsSync(url)) {
        url.split(path.sep).reduce((currentPath, folder) => {
          currentPath += folder + path.sep;
          if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
          }
          return currentPath;
        }, "");
      }
      //3.保存文件
      const savepath = path.join(url, filename);
      const writeStream = fs.createWriteStream(savepath);
      await awaitWriteStream(stream.pipe(writeStream));
      //4.读取excel文件
      const workbook = xlsx.readFile(savepath);
      const sheetNames = workbook.SheetNames; // 返回 ['sheet1', ...]
      const worksheet = workbook.Sheets[sheetNames[0]];
      //5.设置读取的范围
      let range = xlsx.utils.decode_range(worksheet["!ref"]);
      range.s.r = 2;
      range.s.c = 1;
      //6.获取excel数据
      const data = xlsx.utils.sheet_to_json(worksheet, {
        header: 1,
        range: range,
        raw: false,
      });
      if (data.length == 0) {
        return JSON.stringify({ msg: "同步的文件数据为空！", code: 2 }); //导入数据为空则返回
      }
      //7.时间处理并数据入库
      importDate.MAI_Recorder = ctx.User.username; //录入人
      let currentTime = this.ctx.helper.dataFormat(
        new Date(),
        "yyyy-MM-dd hh:mm:ss"
      );

      importDate.MAI_RecordTime = currentTime;
      for (let i = 0; i < data.length; i++) {
        let importDate = {};
        importDate.MAI_RecordTime = currentTime;
        importDate.MAI_Recorder = ctx.User.username;
        if (data[i][7]) {
          data[i][7] = this.ctx.helper.dataFormat(
            new Date(data[i][7]),
            "yyyy-MM-dd hh:mm:ss"
          );
        }
        if (data[i][8]) {
          data[i][8] = this.ctx.helper.dataFormat(
            new Date(data[i][8]),
            "yyyy-MM-dd hh:mm:ss"
          );
        }

        //8.数据入库处理
        importDate.MAI_Name = data[i][0];
        importDate.MAI_CompanyType = data[i][1];
        importDate.MAI_Permit = data[i][2];
        importDate.MAI_JuridicalPerson = data[i][3];
        importDate.MAI_ResponsiblePerson = data[i][4];
        importDate.MAI_Address = data[i][5];
        importDate.MAI_OperateRange = data[i][6];
        importDate.MAI_RegDate = data[i][7];
        importDate.MAI_ValidDate = data[i][8];
        if (data[i][9] != "" && data[i][9] != null) {
          importDate.MAI_Status = data[i][9] == "正常" ? "01" : "02";
        }
        importDateArr.push(importDate);
      }

      await Raw.InsertList("MaintainFactory", importDateArr);
      return { success: true, msg: "数据上传成功！" };
    } catch (error) {
      console.log(error);
      this.ctx.logger.error(error);
      return { success: false, msg: "数据导入失败！" };
    }
  }
  //停放地检测-检索与高级检索
  async getParkSiteData({ param }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      let reqParam = {};
      let where = " where 1=1 ";
      for (var key in param) {
        if (
          (key == "DetectEndTime1" && param.DetectEndTime1) ||
          (key == "DetectEndTime2" && param.DetectEndTime2)
        ) {
          reqParam["DetectEndTime1"] = param.DetectEndTime1;
          reqParam["DetectEndTime2"] = param.DetectEndTime2;
          where +=
            " and DetectEndTime >= :DetectEndTime1 and DetectEndTime <= :DetectEndTime2 ";
        } else if (key == "likeValue" && param.likeValue) {
          (where += " and VLPN like :VLPN or VIN like :VIN"),
            (reqParam.VLPN = "%" + param.likeValue + "%");
          reqParam.VIN = "%" + param.likeValue + "%";
        } else {
          if (param[key] && key != "pageSize" && key != "currentPage") {
            reqParam[key] = "%" + param[key] + "%";
            where += " and " + key + " like :" + key;
          }
        }
      }
      const result = await Raw.QueryPageData(
        `SELECT * FROM V_Park_InspectionData ${where}`,
        param.currentPage,
        param.pageSize,
        {
          orderstr: "DetectEndTime desc",
          replacements: reqParam,
        }
      );
      return JSON.stringify({
        data: result.list,
        dataCount: result.total,
        code: 200,
      });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ code: 0, msg: "检索失败！" });
    }
  }
  // 停放地检测 -检测车辆-检索
  async getVehicleForParkSite({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let reqParam = {};
      params = JSON.parse(params);
      let { param } = params;
      let where = " where 1=1";
      for (let key in param) {
        if (
          key != "VRDATE1" &&
          key != "VRDATE2" &&
          key != "currentIndex" &&
          key != "pageSize"
        ) {
          if (param[key]) {
            where += " and " + key + " like :" + key;
            reqParam[key] = "%" + param[key] + "%";
          }
          if (param.VRDATE1 && param.VRDATE2) {
            reqParam.VRDATE1 = param.VRDATE1;
            reqParam.VRDATE2 = param.VRDATE2;
            where += " and VRDATE>=:VRDATE1 and VRDATE<=:VRDATE2 ";
          }
        }
      }
      const page = (param.currentIndex - 1) * param.pageSize;
      reqParam.pageSize = param.pageSize ? param.pageSize : 20;
      reqParam.RowNumber = param.pageSize ? page : 0;
      const sql = `select TOP(:pageSize) * from (
        select  ROW_NUMBER() OVER (ORDER BY VRDATE desc) as RowNumber,*
        from Vehicle  ${where} ) Vehicle where RowNumber > :RowNumber`;
      const sqlcount = "select count(1) as total from Vehicle " + where;
      const data = await Raw.QueryList(sql, {
        replacements: reqParam,
      });
      const dataCount = await Raw.Query(sqlcount, { replacements: reqParam });
      return JSON.stringify({ data, state: 200, total: dataCount.total });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ state: 0, msg: "检索失败！" });
    }
  }
  //停放地管理-检索
  async getParkSite({ ParkName, ParkId }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let where = " where 1=1";
      let reqParam = {};
      if (ParkName) {
        where += " and ParkName like :ParkName";
        reqParam.ParkName = "%" + ParkName + "%";
      }
      if (ParkId) {
        where += " and ParkId =:ParkId";
        reqParam.ParkId = ParkId;
      }
      const sqles = "select * from ParkData" + where;
      const data = await Raw.QueryList(sqles, {
        replacements: reqParam,
      });
      return JSON.stringify({ data, state: 200 });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ state: 0 });
    }
  }
  //获取用户所在市，区
  async getUserCity({ }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      const res = await ctx.service.hj.commonService.GetUserDetailRoleNew();
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

  //获取用户所属区域下的机构
  async getRegulatoryAgency({ cityCode }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      const res = await ctx.service.hj.commonService.GetUserDetailRole();
      let sqles = ` `;
      let userCity = [];
      if (res.provinceRole.length) {
        sqles = `select  RegulatoryAgencyCode ,RegulatoryAgencyName,IUSTA ,CityCode from RegulatoryAgency where left(CityCode,2) in (:userCity) order by RegulatoryAgencyCode`;
        userCity = res.provinceRole.map((p) => p.slice(0, 2));
      } else if (res.cityRole.length) {
        sqles = `select  RegulatoryAgencyCode ,RegulatoryAgencyName,IUSTA ,CityCode from RegulatoryAgency where left(CityCode,4) in (:userCity) order by RegulatoryAgencyCode`;
        userCity = res.cityRole.map((p) => p.slice(0, 4));
      } else if (res.areaRole.length) {
        sqles = `select  RegulatoryAgencyCode ,RegulatoryAgencyName,IUSTA ,CityCode from RegulatoryAgency where left(CityCode,6) in (:userCity) order by RegulatoryAgencyCode`;
        userCity = res.areaRole.map((p) => p.slice(0, 6));
      } else {
        return JSON.stringify({ data: [] });
      }
      const data = await Raw.QueryList(sqles, {
        replacements: { userCity: userCity },
      });
      return JSON.stringify({ data });
    } catch (error) {
      this.ctx.logger.error(error);
    }
  }

  //获取检测线信息
  async GetLineByRegulatoryAgencyCode(
    { RegulatoryAgencyCode },
    { ctx, userid }
  ) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let where = " where 1=1";
      let reqParam = {};
      if (RegulatoryAgencyCode) {
        where += " and RegulatoryAgencyCode like :RegulatoryAgencyCode";
        reqParam.RegulatoryAgencyCode = "%" + RegulatoryAgencyCode + "%";
      }
      const sqles =
        "select LineInfoID ,SceneCode from RegulatoryAgencyLineInfo " + where;
      const data = await Raw.QueryList(sqles, {
        replacements: reqParam,
      });
      return JSON.stringify({ data });
    } catch (error) {
      this.ctx.logger.error(error);
    }
  }
  //修改停放地信息
  async updataParkSite(param, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      param.vehicle.HasCCA = param.vehicle.HasCCA == "无" ? 0 : 1;
      param.inspectionData.HasCCA = param.inspectionData.HasCCA == "无" ? 0 : 1;
      let checkMethod = param.inspectionData.IUTYPE;
      // 写入停放地
      delete param.parkInspectData.ID;
      param.parkInspectData.SyncFlag = 1;
      let iftrue1 = await Raw.Update("ParkInspectData", param.parkInspectData, {
        wherestr: "where InspectionDataID=:InspectionDataID",
        replacements: {
          InspectionDataID: param.parkInspectData.InspectionDataID,
        },
      });
      // 写入车辆信息
      delete param.vehicle.State;
      param.vehicle.SyncFlag = 0;
      const VehicleID = param.vehicle.VehicleID;
      delete param.vehicle.VehicleID;
      let iftrue2 = await Raw.Update("Vehicle", param.vehicle, {
        wherestr: "where VehicleID=:VehicleID",
        replacements: { VehicleID: VehicleID },
      });
      //写入主检测表
      const InspectionDataID = param.inspectionData.InspectionDataID;
      delete param.inspectionData.VehicleKindType;
      delete param.inspectionData.DayAcceptanceNum;
      delete param.inspectionData.InspectionDataID;
      param.inspectionData.SyncFlag = 0;
      param.inspectionData.NewVDCT = param.inspectionData.VDCT;
      if (
        param.inspectionData.UploadDate != null &&
        param.inspectionData.UploadDate
      ) {
        param.inspectionData.UploadYear = param.inspectionData.UploadDate.split(
          " "
        )[0].split("-")[0];
        param.inspectionData.UploadMonth = param.inspectionData.UploadDate.split(
          " "
        )[0].split("-")[1];
      }
      if (
        param.inspectionData.IUIDATE != null &&
        param.inspectionData.IUIDATE
      ) {
        param.inspectionData.CheckYear = param.inspectionData.IUIDATE.split(
          " "
        )[0].split("-")[0];
        param.inspectionData.CheckMonth = param.inspectionData.IUIDATE.split(
          " "
        )[0].split("-")[1];
      }
      const sqles4 = "select * from Vehicle where VehicleID=:VehicleID";
      let vec = await Raw.Query(sqles4, {
        replacements: {
          VehicleID: VehicleID,
        },
      });
      param.inspectionData.UniqueString = vec.UniqueString;
      param.inspectionData.VehicleID = vec.VehicleID;
      param.inspectionData.VLPN = vec.VLPN;
      param.inspectionData.VIN = vec.VIN;
      param.inspectionData.VLPNColor = vec.VLPNColor;
      param.inspectionData.VehicleColor = vec.VehicleColor;
      param.inspectionData.VLPNType = vec.VLPNType;
      param.inspectionData.IUVTYPE = vec.IUVTYPE;
      param.inspectionData.VehicleBigType = vec.VehicleBigType;
      param.inspectionData.PG = vec.PG;
      param.inspectionData.VehicleType = vec.VehicleType;
      param.inspectionData.GAVType = vec.GAVType;
      param.inspectionData.KerbMass = vec.KerbMass;
      param.inspectionData.BenchmarkMass = vec.BenchmarkMass;
      param.inspectionData.VML = vec.VML;
      param.inspectionData.RatedSeats = vec.RatedSeats;
      param.inspectionData.FactoryPlateModel = vec.FactoryPlateModel;
      param.inspectionData.Mileage = vec.Mileage;
      param.inspectionData.OCHA = vec.OCHA;
      param.inspectionData.UseOfAuto = vec.UseOfAuto;
      param.inspectionData.VRDATE = vec.VRDATE;
      param.inspectionData.AbandonedYear = vec.AbandonedYear;
      param.inspectionData.IUETYPE = vec.IUETYPE;
      param.inspectionData.EDSPL = vec.EDSPL;
      param.inspectionData.IntakeWay = vec.IntakeWay;
      param.inspectionData.FuelType = vec.FuelType;
      param.inspectionData.OilSupplyWay = vec.OilSupplyWay;
      param.inspectionData.EngineRatedSpeed = vec.EngineRatedSpeed;
      param.inspectionData.EnginePower = vec.EnginePower;
      param.inspectionData.ProductDate = vec.ProductDate;
      param.inspectionData.DriveForm = vec.DriveForm;
      param.inspectionData.TyreType = vec.TyreType;
      param.inspectionData.IUVMANU = vec.IUVMANU;
      param.inspectionData.AxleWeight = vec.AxleWeight;
      param.inspectionData.StrokeCount = vec.StrokeCount;
      param.inspectionData.CylinderCount = vec.CylinderCount;
      param.inspectionData.HasCCA = vec.HasCCA;
      param.inspectionData.HasOxygenSensor = vec.HasOxygenSensor;
      param.inspectionData.GasVentCount = vec.GasVentCount;
      param.inspectionData.HasOBD = vec.HasOBD;
      param.inspectionData.IsDoubleFuel = vec.IsDoubleFuel;
      param.inspectionData.BZTYPE = vec.BZTYPE;
      param.inspectionData.Province = vec.Province;
      param.inspectionData.City = vec.City;
      param.inspectionData.County = vec.County;
      param.inspectionData.OwnerName = vec.OwnerName;
      param.inspectionData.Sex = vec.Sex;
      param.inspectionData.Tel = vec.Tel;
      param.inspectionData.CredentialsType = vec.CredentialsType;
      param.inspectionData.CredentialsNum = vec.CredentialsNum;
      param.inspectionData.ZipCode = vec.ZipCode;
      param.inspectionData.Address = vec.Address;
      param.inspectionData.EmissionStandard = vec.EmissionStandard;
      param.inspectionData.VehicleKind = vec.VehicleKind;
      param.inspectionData.xh = vec.xh;
      param.inspectionData.IsImportedCar = vec.IsImportedCar;
      param.inspectionData.LastUpdateTime = vec.LastUpdateTime;
      let iftrue3 = await Raw.Update("InspectionData", param.inspectionData, {
        wherestr: "where InspectionDataID=:InspectionDataID",
        replacements: { InspectionDataID: InspectionDataID },
      });
      if (checkMethod == "A") {
        // //写入到双怠速表
        param.tsiData.SyncFlag = 0;
        delete param.tsiData.TSIDataID;
        let iftrue4 = await Raw.Update("TSIData", param.tsiData, {
          wherestr: "where InspectionDataID=:InspectionDataID",
          replacements: { InspectionDataID: InspectionDataID },
        });
        if (iftrue1 && iftrue2 && iftrue3 && iftrue4) {
          return JSON.stringify({ state: 200, msg: "修改成功" });
        } else {
          return JSON.stringify({ state: 0 });
        }
      } else if (checkMethod == "F") {
        //不透光
        param.lightProofSmokeData.SyncFlag = 0;
        delete param.lightProofSmokeData.LightProofSmokeDataID;
        let iftrue4 = await Raw.Update(
          "LightProofSmokeData",
          param.lightProofSmokeData,
          {
            wherestr: "where InspectionDataID=:InspectionDataID",
            replacements: { InspectionDataID: InspectionDataID },
          }
        );
        if (iftrue1 && iftrue2 && iftrue3 && iftrue4) {
          return JSON.stringify({ state: 200, msg: "修改成功" });
        } else {
          return JSON.stringify({ state: 0, msg: "修改失败！" });
        }
      } else if (checkMethod == "J") {
        //林格曼
        param.lingmannData.SyncFlag = 0;
        param.lingmannData.SceneCode = param.inspectionData.SceneCode;
        param.lingmannData.VIN = param.inspectionData.VIN;
        param.lingmannData.VLPNColor = param.inspectionData.VLPNColor;
        param.lingmannData.DetectDate = param.inspectionData.IUIDATE;
        param.lingmannData.DetectStartTime =
          param.inspectionData.DetectStartTime;
        param.lingmannData.DetectEndTime = param.inspectionData.DetectEndTime;
        param.lingmannData.Checker = param.inspectionData.ICheck;

        delete param.lingmannData.LingmanDataID;
        let iftrue4 = await Raw.Update("LingmanData", param.lingmannData, {
          wherestr: "where InspectionDataID=:InspectionDataID",
          replacements: { InspectionDataID: InspectionDataID },
        });
        if (iftrue1 && iftrue2 && iftrue3 && iftrue4) {
          return JSON.stringify({ state: 200, msg: "修改成功" });
        } else {
          return JSON.stringify({ state: 0, msg: "修改失败" });
        }
      }
    } catch (error) {
      this.ctx.logger.error(error);
    }
  }
  // 新增停放地信息
  async addParkSite(param, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      const loginU = ctx.User.username;
      const sqles =
        "select ESPOrganizationCode,ESPStationCode from PM_USER where LOGINNAME=:LOGINNAME";
      let data = await Raw.Query(sqles, {
        replacements: {
          LOGINNAME: loginU,
        },
      });
      // 写入车辆信息
      delete param.vehicle.State;
      param.vehicle.SyncFlag = 0;
      const VehicleID = param.vehicle.VehicleID;
      delete param.vehicle.VehicleID;
      let iftrue2 = await Raw.Update("Vehicle", param.vehicle, {
        wherestr: "where VehicleID=:VehicleID",
        replacements: { VehicleID: VehicleID },
      });

      const sqles4 = "select * from Vehicle where VehicleID=:VehicleID";
      let vec = await Raw.Query(sqles4, {
        replacements: {
          VehicleID: VehicleID,
        },
      });
      param.inspectionData.UniqueString = vec.UniqueString;
      param.inspectionData.VehicleID = vec.VehicleID;
      param.inspectionData.VLPN = vec.VLPN;
      param.inspectionData.VIN = vec.VIN;
      param.inspectionData.VLPNColor = vec.VLPNColor;
      param.inspectionData.VehicleColor = vec.VehicleColor;
      param.inspectionData.VLPNType = vec.VLPNType;
      param.inspectionData.IUVTYPE = vec.IUVTYPE;
      param.inspectionData.VehicleBigType = vec.VehicleBigType;
      param.inspectionData.PG = vec.PG;
      param.inspectionData.VehicleType = vec.VehicleType;
      param.inspectionData.GAVType = vec.GAVType;
      param.inspectionData.KerbMass = vec.KerbMass;
      param.inspectionData.BenchmarkMass = vec.BenchmarkMass;
      param.inspectionData.VML = vec.VML;
      param.inspectionData.RatedSeats = vec.RatedSeats;
      param.inspectionData.FactoryPlateModel = vec.FactoryPlateModel;
      param.inspectionData.Mileage = vec.Mileage;
      param.inspectionData.OCHA = vec.OCHA;
      param.inspectionData.UseOfAuto = vec.UseOfAuto;
      param.inspectionData.VRDATE = vec.VRDATE;
      param.inspectionData.AbandonedYear = vec.AbandonedYear;
      param.inspectionData.IUETYPE = vec.IUETYPE;
      param.inspectionData.EDSPL = vec.EDSPL;
      param.inspectionData.IntakeWay = vec.IntakeWay;
      param.inspectionData.FuelType = vec.FuelType;
      param.inspectionData.OilSupplyWay = vec.OilSupplyWay;
      param.inspectionData.EngineRatedSpeed = vec.EngineRatedSpeed;
      param.inspectionData.EnginePower = vec.EnginePower;
      param.inspectionData.ProductDate = vec.ProductDate;
      param.inspectionData.DriveForm = vec.DriveForm;
      param.inspectionData.TyreType = vec.TyreType;
      param.inspectionData.IUVMANU = vec.IUVMANU;
      param.inspectionData.AxleWeight = vec.AxleWeight;
      param.inspectionData.StrokeCount = vec.StrokeCount;
      param.inspectionData.CylinderCount = vec.CylinderCount;
      param.inspectionData.HasCCA = vec.HasCCA;
      param.inspectionData.HasOxygenSensor = vec.HasOxygenSensor;
      param.inspectionData.GasVentCount = vec.GasVentCount;
      param.inspectionData.HasOBD = vec.HasOBD;
      param.inspectionData.IsDoubleFuel = vec.IsDoubleFuel;
      param.inspectionData.BZTYPE = vec.BZTYPE;
      param.inspectionData.Province = vec.Province;
      param.inspectionData.City = vec.City;
      param.inspectionData.County = vec.County;
      param.inspectionData.OwnerName = vec.OwnerName;
      param.inspectionData.Sex = vec.Sex;
      param.inspectionData.Tel = vec.Tel;
      param.inspectionData.CredentialsType = vec.CredentialsType;
      param.inspectionData.CredentialsNum = vec.CredentialsNum;
      param.inspectionData.ZipCode = vec.ZipCode;
      param.inspectionData.Address = vec.Address;
      param.inspectionData.EmissionStandard = vec.EmissionStandard;
      param.inspectionData.VehicleKind = vec.VehicleKind;
      param.inspectionData.xh = vec.xh;
      param.inspectionData.IsImportedCar = vec.IsImportedCar;
      param.inspectionData.LastUpdateTime = vec.LastUpdateTime;
      //写入主检测表
      param.inspectionData.InspectionNum =
        data.ESPOrganizationCode +
        data.ESPStationCode +
        this.ctx.helper.dataFormat(new Date(), "yyyyMMddhhmmssS");
      if (
        param.inspectionData.UploadDate != null &&
        param.inspectionData.UploadDate
      ) {
        param.inspectionData.UploadYear = param.inspectionData.UploadDate.split(
          " "
        )[0].split("-")[0];
        param.inspectionData.UploadMonth = param.inspectionData.UploadDate.split(
          " "
        )[0].split("-")[1];
      }
      if (
        param.inspectionData.IUIDATE != null &&
        param.inspectionData.IUIDATE
      ) {
        param.inspectionData.CheckYear = param.inspectionData.IUIDATE.split(
          " "
        )[0].split("-")[0];
        param.inspectionData.CheckMonth = param.inspectionData.IUIDATE.split(
          " "
        )[0].split("-")[1];
      }
      param.inspectionData.SyncFlag = 0;

      param.inspectionData.NewVDCT = param.inspectionData.VDCT;
      let res6 = await Raw.Insert("InspectionData", param.inspectionData);

      const sqles3 =
        "select *  from InspectionData where InspectionNum=:InspectionNum";
      const data2 = await Raw.Query(sqles3, {
        replacements: {
          InspectionNum: param.inspectionData.InspectionNum,
        },
      });
      // 写入停放地
      let inspID = data2.InspectionDataID;
      param.parkInspectData.InspectionDataID = inspID;
      param.parkInspectData.SyncFlag = 0;
      const sqles2 =
        "select top 1 total from ParkInspectData where AddYear =:AddYear  ORDER BY AddDate  desc";
      const AddYear = this.ctx.helper.dataFormat(new Date(), "yyyy");
      const dt = await Raw.Query(sqles2, {
        replacements: {
          AddYear: AddYear,
        },
      });

      let num = (dt && dt.total + 1) || 0;
      if (num > 0) {
        if (num < 10) {
          param.parkInspectData.CheckNum =
            "南环监（尾气）字" +
            this.ctx.helper.dataFormat(new Date(), "yyyy") +
            "第" +
            this.ctx.helper.dataFormat(new Date(), "MM") +
            "0" +
            num +
            "号";
        } else if (num > 9 && num < 100) {
          param.parkInspectData.CheckNum =
            "南环监（尾气）字" +
            this.ctx.helper.dataFormat(new Date(), "yyyy") +
            "第" +
            this.ctx.helper.dataFormat(new Date(), "MM") +
            num +
            "号";
        }
      } else {
        param.parkInspectData.CheckNum =
          "南环监（尾气）字" +
          this.ctx.helper.dataFormat(new Date(), "yyyy") +
          this.ctx.helper.dataFormat(new Date(), "MM") +
          "001" +
          "号";
        num = 1;
      }
      param.parkInspectData.AddYear = this.ctx.helper.dataFormat(
        new Date(),
        "yyyy"
      );
      param.parkInspectData.Total = num;
      param.parkInspectData.AddDate = this.ctx.helper.dataFormat(
        new Date(),
        "yyyy-MM-dd hh:mm:ss"
      );
      let res2 = await Raw.Insert("ParkInspectData", param.parkInspectData);
      let checkMethod = param.inspectionData.IUTYPE;
      if (checkMethod == "A") {
        //写入到双怠速表
        param.tsiData.InspectionDataID = inspID;
        param.tsiData.InspectionNum = param.inspectionData.InspectionNum;
        param.tsiData.SyncFlag = 0;
        let res3 = await Raw.Insert("TSIData", param.tsiData);
        return JSON.stringify({ state: 200, msg: "新增成功" });
      } else if (checkMethod == "F") {
        //不透光
        param.lightProofSmokeData.InspectionDataID = inspID;
        param.lightProofSmokeData.InspectionNum =
          param.inspectionData.InspectionNum;
        param.lightProofSmokeData.SyncFlag = 0;
        let res3 = await Raw.Insert(
          "LightProofSmokeData",
          param.lightProofSmokeData
        );
        return JSON.stringify({ state: 200, msg: "新增成功" });
      } else if (checkMethod == "J") {
        //林格曼
        param.lingmannData.InspectionDataID = inspID;
        param.lingmannData.InspectionNum = param.inspectionData.InspectionNum;
        param.lingmannData.SyncFlag = 0;
        param.lingmannData.SceneCode = param.inspectionData.SceneCode;
        param.lingmannData.VIN = param.inspectionData.VIN;
        param.lingmannData.VLPNColor = param.inspectionData.VLPNColor;
        param.lingmannData.DetectDate = param.inspectionData.IUIDATE;
        param.lingmannData.DetectStartTime =
          param.inspectionData.DetectStartTime;
        param.lingmannData.DetectEndTime = param.inspectionData.DetectEndTime;
        param.lingmannData.Checker = param.inspectionData.ICheck;
        await Raw.Insert("LingmanData", param.lingmannData);
        return JSON.stringify({ state: 200, msg: "新增成功" });
      }
    } catch (error) {
      this.ctx.logger.error(error);
    }
  }
  //停放地管理-新增与编辑
  async addOrEditParkMange(param, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      const { ParkId, isEdit, ...entity } = param;
      const sqles = "select * from ParkData where ParkName=:ParkName";
      const data1 = await Raw.Query(sqles, {
        replacements: {
          ParkName: entity.ParkName,
        },
      });
      if (data1 == null) {
        if (isEdit) {
          //编辑
          const data2 = await Raw.Update("ParkData", entity, {
            wherestr: "where ParkId=:ParkId",
            replacements: { ParkId: ParkId },
          });
          return JSON.stringify({ code: 200, msg: "编辑成功！" });
        } else {
          //新增
          let userCityCode =
            (this.ctx.session.userRoles["行政区角色"] &&
              this.ctx.session.userRoles["行政区角色"]) ||
            [];
          userCityCode.sort(function (a, b) {
            return a - b;
          });
          let userCity = userCityCode[0]; //如果属于省级又属于市级。选择省级的编码
          const city = userCity.slice(0, 4) + "00";
          entity.CityCode = city;
          entity.PriCode = city.replace(/00$/, "").replace(/00$/, "");
          entity.CountyCode = userCity.slice(0, 4) + "01";
          await Raw.Insert("ParkData", entity);
          return JSON.stringify({ code: 200, msg: "新增成功！" });
        }
      } else {
        return JSON.stringify({ code: 0, msg: "数据已存在！" });
      }
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ code: 0, msg: "操作失败" });
    }
  }
  //停放地管理-删除
  async deleteParkMange({ ParkId }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      await Raw.Delete("ParkData", {
        wherestr: "where ParkId=:ParkId", //where 条件
        replacements: {
          ParkId: ParkId,
        },
      });
      return JSON.stringify({ code: 200, msg: "删除成功" });
    } catch (error) {
      this.ctx.logger.error(error);
      return JSON.stringify({ code: 0, msg: "删除失败" });
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
  //黄标车清单-检索与高级检索
  async getVehicleYLC({ param }, { ctx, userid }) {
    param = JSON.parse(param);
    let { app } = this;
    let { transaction, Raw } = app.Dbs.hj;
    let reqParam = {};
    let where = " where 1=1";
    const page = (param.currentPage - 1) * param.pageSize;
    if (param.pageSize) {
      reqParam.pageSize = param.pageSize;
      reqParam.RowNumber = page;
    } else {
      reqParam.pageSize = 20;
      reqParam.RowNumber = 0;
    }
    for (let key in param) {
      if (
        key != "currentPage" &&
        key != "pageSize" &&
        key != "AuditDateTime1" &&
        key != "AuditDateTime2" &&
        key != "isExport" &&
        key != "newTop"
      ) {
        if (param[key]) {
          if (key == "SyncFlag" && param[key] == 2) {
            where += " and " + "SyncFlag is null";
          } else {
            where += " and " + key + " like :" + key;
          }
          reqParam[key] = "%" + param[key] + "%";
        }
      }
    }
    if (param.AuditDateTime1 && param.AuditDateTime2) {
      where +=
        " and AuditDateTime>= :AuditDateTime1 and AuditDateTime<= :AuditDateTime2";
      reqParam.AuditDateTime1 = param.AuditDateTime1;
      reqParam.AuditDateTime2 = param.AuditDateTime2;
    }
    if (param.isExport) {
      const exportData = await Raw.QueryList(
        `select Vehicle_YLCID,County,FZJG,VLPN,VLPNColor,IUVTYPE,UseOfAuto,VRDATE,FuelType,AbandonedYear,YXQZ,
      RatedSeats,VML,OwnerName,Address,Phone,Tel,XQDD,Remark from Vehicle_YLC ${where} order by AuditDateTime desc`,
        {
          replacements: reqParam,
        }
      );
      return { exportData };
    }
    if (param.newTop) {
      const newData = await Raw.Query(
        "select Top 1 * from Vehicle_YLC order by Vehicle_YLCID desc"
      );
      return { newData };
    }
    let result = await Raw.QueryList(
      `select  TOP (:pageSize) * from (select ROW_NUMBER() OVER (ORDER BY AuditDateTime desc) as RowNumber,* from Vehicle_YLC ${where} ) Vehicle_YLC where RowNumber > :RowNumber`,
      {
        replacements: reqParam,
      }
    );
    let count = await Raw.Query(
      `select count(1) as zs from Vehicle_YLC ${where}`,
      {
        replacements: reqParam,
      }
    );
    return { result, state: 1, count: count.zs };
  }

  //黄标车清单-删除
  async removeVehicleYLC({ Vehicle_YLCID }, { ctx, userid }) {
    let { app } = this;
    let { transaction, Raw } = app.Dbs.hj;
    if (Vehicle_YLCID) {
      await Raw.Delete("Vehicle_YLC", {
        wherestr: "where Vehicle_YLCID=:Vehicle_YLCID", //where 条件
        replacements: {
          //参数化执行
          Vehicle_YLCID: Vehicle_YLCID,
        },
      });
      return { state: 1, msg: "删除成功！" };
    }
  }
  //黄标车清单-编辑与新增
  async editOrAddVehicleYLC(param, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let {
        type,
        _rowKey,
        _index,
        RowNumber,
        Vehicle_YLCID,
        ...entity
      } = param;
      entity.LastUpdateTime = this.ctx.helper.dataFormat(
        new Date(),
        "yyyy-MM-dd hh:mm:ss"
      );
      if (type == 1) {
        entity.Auditer = ctx.User.username;
        entity.AuditDateTime = this.ctx.helper.dataFormat(
          new Date(),
          "yyyy-MM-dd hh:mm:ss"
        );
      }
      if (!entity.Auditer && type == 1) {
        if (
          entity.YLCAuditResult == "03" ||
          entity.YLCAuditResult == "05" ||
          entity.VStatus == "P"
        ) {
          entity.Flag = 0;
          entity.SyncFlag = 0;
        } else {
          entity.Flag = 1;
          entity.SyncFlag = 0;
        }
      }
      //开启一个显示事务
      await Raw.ExecWithTran(async (t) => {
        if (!Vehicle_YLCID) {
          await Raw.Insert("Vehicle_YLC", entity, { transaction: t });
        } else {
          await Raw.Update("Vehicle_YLC", entity, {
            wherestr: "where Vehicle_YLCID=:Vehicle_YLCID",
            replacements: {
              Vehicle_YLCID: Vehicle_YLCID,
            },
            transaction: t,
          });
          let ylc = await Raw.Query(
            "select * from Vehicle_YLC where Vehicle_YLCID=:Vehicle_YLCID",
            {
              replacements: { Vehicle_YLCID: Vehicle_YLCID },
              transaction: t,
            }
          );
          if (
            (ylc.YLCAuditResult == "04" || ylc.YLCAuditResult == "05") &&
            type == 1
          ) {
            let vga = await Raw.Query(
              "select top 1 * from Vehicle_YLCGA where VLPN=:VLPN and VLPNColor=:VLPNColor",
              {
                replacements: {
                  VLPN: ylc.VLPN,
                  VLPNColor: ylc.VLPNColor,
                },
                transaction: t,
              }
            );
            if (vga != null) {
              // 黄标车清单车辆基本信息转换给公安抓拍信息表
              vga.GAVType = ylc.GAVType;
              vga.EmissionStandard = ylc.EmissionStandard;
              vga.UseOfAuto = ylc.UseOfAuto;
              vga.FactoryPlateModel = ylc.FactoryPlateModel;
              vga.IUVTYPE = ylc.IUVTYPE;
              vga.IUETYPE = ylc.IUETYPE;
              vga.VIN = ylc.VIN;
              vga.EngineNum = ylc.EngineNum;
              vga.VRDATE = ylc.VRDATE;
              vga.ProductDate = ylc.ProductDate;
              vga.RatedSeats = ylc.RatedSeats;
              vga.VML = ylc.VML;
              vga.KerbMass = ylc.KerbMass;
              vga.BenchmarkMass = ylc.BenchmarkMass;
              vga.IUVMANU = ylc.IUVMANU;
              vga.FuelType = ylc.FuelType;
              vga.EDSPL = ylc.EDSPL;
              vga.EnginePower = ylc.EnginePower;
              vga.OwnerName = ylc.OwnerName;
              vga.Address = ylc.Address;
              vga.Tel = ylc.Tel;
              vga.CredentialsType = ylc.CredentialsType;
              vga.CredentialsNum = ylc.CredentialsNum;
              vga.OilSupplyWay = ylc.OilSupplyWay;
              vga.IntakeWay = ylc.IntakeWay;
              vga.Mileage = ylc.Mileage;
              vga.OCHA = ylc.OCHA;
              vga.Province = ylc.Province;
              vga.City = ylc.City;
              vga.County = ylc.County;
              vga.VStatus = ylc.VStatus;
              vga.AbandonedYear = ylc.AbandonedYear;
              vga.YLCAuditResult = ylc.YLCAuditResult;
              delete vga.Vehicle_YLCGAID;
              await Raw.Update("Vehicle_YLCGA", vga, {
                wherestr: " where VLPN=:VLPN and VLPNColor=:VLPNColor",
                replacements: {
                  VLPN: ylc.VLPN,
                  VLPNColor: ylc.VLPNColor,
                },
                transaction: t,
              });
            }
          }
        }
      });
      return { state: 1 };
    } catch (error) {
      this.ctx.logger.error(error);
      return { state: 0 };
    }
  }
  //黄标车清单-图片查看
  async getVehicleYLCImg({ Vehicle_YLCID }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      if (Vehicle_YLCID) {
        const result = await Raw.QueryList(
          "select ID,FullFileName,DisplayName,UploadTime,Bytes from Vehicle_YLC_UploadFile where Vehicle_YLCID=:Vehicle_YLCID order by UploadTime desc",
          {
            replacements: {
              Vehicle_YLCID: Vehicle_YLCID,
            },
          }
        );
        return { state: 1, result };
      }
    } catch (error) {
      this.ctx.logger.error(error);
      return { state: 0, msg: "获取图片失败!" };
    }
  }
  //黄标车清单-图片上传
  async vehicleYLCUploadImg({ }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let imgPath = this.config.captureImgPath;
      const stream = await this.ctx.getFileStream();
      let datas = stream.fields; //拿到上传的额外信
      let guid = (((1 + Math.random()) * 0x10000) | 0)
        .toString(16)
        .substring(1);
      let filename = datas.ID + "_" + guid + stream.filename;
      const targets = path.join("", imgPath + "/");
      if (!fs.existsSync(targets)) {
        targets.split(path.sep).reduce((currentPath, folder) => {
          currentPath += folder + path.sep;
          if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
          }
          return currentPath;
        }, "");
      }
      const target = path.join(targets, filename);
      datas.FullFileName = path.join(imgPath + "/", filename);
      datas.FileExtension = stream.mimeType;
      datas.UploadTime = datas.Modifytime = new Date();
      datas.DisplayName = stream.filename.substring(
        0,
        stream.filename.indexOf(".")
      );
      const writeStream = fs.createWriteStream(target);
      await awaitWriteStream(stream.pipe(writeStream));
      datas.Bytes = Buffer.from(fs.readFileSync(datas.FullFileName)); //转字节
      let lsitet = {
        Vehicle_YLCID: datas.ID,
        FileExtension: datas.FileExtension,
        UploadTime: datas.UploadTime,
        DisplayName: datas.DisplayName,
        Modifytime: datas.Modifytime,
        UploadPerson: ctx.User.username,
        FullFileName: datas.FullFileName,
        Bytes: datas.Bytes,
      };
      const result = await Raw.Insert("Vehicle_YLC_UploadFile", lsitet);
      return JSON.stringify({ msg: "文件上传成功!", success: true });
    } catch (error) {
      this.ctx.logger.error(error);
      await sendToWormhole(stream);
      return JSON.stringify({ msg: "文件上传失败!", success: false });
    }
  }
  //选中省份得到对应市
  async getCityOption({ CodeValue }, { ctx, userid }) {
    let { app } = this;
    let { transaction, Raw } = app.Dbs.hj;
    if (CodeValue) {
      if (CodeValue.length == 2) {
        const City = await Raw.QueryList(
          "select * from CD_City where left(CodeValue,2)=:CodeValue",
          {
            replacements: {
              CodeValue: CodeValue,
            },
          }
        );
        return { City };
      }
      if (CodeValue.length == 6) {
        const Area = await Raw.QueryList(
          "select AreaCode as CodeValue,AreaName as CodeName  from Area where ParentAreaCode=:CodeValue",
          {
            replacements: {
              CodeValue: CodeValue,
            },
          }
        );
        return { Area };
      }
    }
  }
  //多检审核修改-检索、高级检索
  async getMuitAuditDate({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let reqParam = {};
      let where = "  where 1=1";
      const page = (param.currentPage - 1) * param.pageSize;
      if (param.pageSize) {
        reqParam.pageSize = param.pageSize;
        reqParam.RowNumber = page;
      } else {
        reqParam.pageSize = 20;
        reqParam.RowNumber = 0;
      }
      // 判断登录人员负责的站点
      let cuser=this.ctx.helper.getCurrentUser();
      let stationCode = cuser['userOrg']
      if(stationCode){
          where += ` and StationCode = ${stationCode}`;
      }
  
      if (param.IUIDATE1 && param.IUIDATE2) {
        where += ` and IUIDATE>=:IUIDATE1 and IUIDATE<=:IUIDATE2`;
        reqParam.IUIDATE1 = param.IUIDATE1;
        reqParam.IUIDATE2 = param.IUIDATE2;
      }
      if (param.VIN && !param.VLPN) {
        reqParam.VIN = param.VIN;
        where += `and VIN like '%${param.VIN}%'`;
      }
      if (!param.VIN && param.VLPN) {
        reqParam.VLPN = param.VLPN;
        where += ` and VLPN like '%${param.VLPN}%'`;
      }
      if (param.VIN && param.VLPN) {
        reqParam.VIN = param.VIN;
        reqParam.VLPN = param.VLPN;
        where += ` and VIN like '%${param.VIN}%'`;
        where += ` or VLPN like '%${param.VLPN}%'`;
      }
      const result = await Raw.QueryList(
        `select  TOP (:pageSize) * from (select ROW_NUMBER() OVER (ORDER BY IUIDATE desc) as RowNumber,* from  InspectionAudit ${where} ) InspectionAudit where RowNumber > :RowNumber`,
        {
          replacements: reqParam,
        }
      );
      const count = await Raw.Query(
        `select count(*) as zs from InspectionAudit ${where}`,
        {
          replacements: reqParam,
        }
      );
      return { state: 1, result, count: count.zs };
    } catch (error) {
      this.ctx.logger.error(error);
      return { state: 0 };
    }
  }

  // 检测管理检索-高级检索
  async getDetectionManageData(param, { ctx, userid }) {
    try {
      param = JSON.parse(param.params).param;
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let reqParam = {};
      let where = "where 1=1";
      const page = (param.currentPage - 1) * param.pageSize;
      if (param.IUIDATE1 && param.IUIDATE2) {
        where += ` and jysj>=:IUIDATE1 and jysj<=:IUIDATE2`;
        reqParam.IUIDATE1 = param.IUIDATE1;
        reqParam.IUIDATE2 = param.IUIDATE2;
      }
      if (param.IUIDATE3 && param.IUIDATE4) {
        where += ` and gxsj>=:IUIDATE3 and gxsj<=:IUIDATE4`;
        reqParam.IUIDATE3 = param.IUIDATE3;
        reqParam.IUIDATE4 = param.IUIDATE4;
      }
      if (param.pageSize) {
        reqParam.pageSize = param.pageSize;
        reqParam.RowNumber = page;
      } else {
        reqParam.pageSize = 20;
        reqParam.RowNumber = 0;
      }
      for (let key in param) {
        if (
          key != "IUIDATE1" &&
          key != "IUIDATE2" &&
          key != "IUIDATE3" &&
          key != "IUIDATE4" &&
          key != "currentPage" &&
          key != "pageSize"
        ) {
          if (key == "cyjg" && param[key] === 0) {
            reqParam[key] = param[key];
            where += " and " + key + " like :" + key;
          } else if (param[key]) {
            reqParam[key] = "%" + param[key] + "%";
            where += " and " + key + " like :" + key;
          }
        }
      }
      const result = await Raw.QueryList(
        `select  TOP (:pageSize) *from(select ROW_NUMBER() over(order by gxsj desc) as RowNumber, * from AnJianData ${where} ) AnJianData WHERE RowNumber > (:RowNumber) order by RowNumber`,
        {
          replacements: reqParam,
        }
      );
      const count = await Raw.Query(
        `select count(*) as total from AnJianData ${where}`,
        {
          replacements: reqParam,
        }
      );
      return { state: 1, result, count: count.total };
    } catch (error) {
      return { state: 0 };
    }
  }

  // 检测管理检索-编辑数据
  async editDetectionManageData(param, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let Operator = ctx.User.username;
      const { ID, hphm, clsbdh, Remark, AddTime } = param;
      const result = await Raw.Update(
        "AnJianData",
        { jcjg: 0 },
        {
          wherestr: "where ID=:ID", //where 条件
          replacements: {
            //参数化执行
            ID: ID,
          },
        }
      );
      const result2 = await Raw.Insert("AnJianHandleLog", {
        AN_ID: ID,
        hphm,
        clsbdh,
        Remark,
        Operator,
        AddTime,
      });
      return { state: result };
    } catch (error) {
      return { state: 0 };
    }
  }

  // 检测站记分管理
  async getStationRecordScoreData(param, { ctx, userid }) {
    try {
      let params = JSON.parse(param.params).param;
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let areaList = {}; // 保存区市权限
      let reqParam = {};
      if (!params.CountyCode && !params.quArea) {
        // 有area返回说明已经知道区域，就不再获取
        let areaLimit = await ctx.service.hj.commonService.GetAreaRole();
        if (areaLimit["data"].length == 0) {
          return;
        } else {
          let quarea = [];
          let area = [];
          areaLimit["data"].map((item) => {
            if (item.length == 4) {
              // 市级权限
              // area.push(item);
              areaList.CountyCode = item + "00";
            } else if (item.length == 6) {
              quarea.push(item); // 区级权限
            } else if (item.length == 2) {
              areaList.shiArea = item; // 省级权限
            }
          });
          // areaList.CountyCode = area;
          areaList.quArea = quarea;
        }
      }
      let where = "where 1=1";
      const page = (params.pageIndex - 1) * params.pageSize;
      if (params.recordTime1 && params.recordTime2) {
        where += ` and RecordTime>= :recordTime1 and RecordTime<= :recordTime2`;
        reqParam.recordTime1 = params.recordTime1;
        reqParam.recordTime2 = params.recordTime2;
      }
      for (let key in params) {
        if (params[key]) {
          if (
            key != "recordTime1" &&
            key != "recordTime2" &&
            key != "pageSize" &&
            key != "pageIndex" &&
            key != "quArea"
          ) {
            where += " and " + key + "= :" + key;
            reqParam[key] = params[key];
          }
        }
      }
      let result;
      let total;
      // result=await Raw.QueryList(`select *from StationRecordScore ${where} ORDER BY RecordTime DESC `);
      if (!params.CountyCode && !areaList.CountyCode) {
        where += " and ";
        if (params.quArea) {
          where += "CountyCode=" + `'${params.quArea}' or `;
        } else {
          areaList.quArea.forEach((item) => {
            where += "CountyCode=" + `'${item}' or `;
          });
        }
        where = where.slice(0, -4);
        result = await Raw.QueryList(
          `select top ${params.pageSize} *from (select ROW_NUMBER() OVER(ORDER BY entrytime desc) as RowNumber, *from StationRecordScore ${where}) StationRecordScore where RowNumber > ${page}`,
          {
            replacements: reqParam,
          }
        );
        total = await Raw.Query(
          `select count(1) as total from StationRecordScore ${where}`,
          {
            replacements: reqParam,
          }
        );
      } else {
        result = await Raw.QueryList(
          `select top ${params.pageSize} *from (select ROW_NUMBER() OVER(ORDER BY entrytime desc) as RowNumber, * from StationRecordScore ${where}) StationRecordScore where RowNumber > ${page}`,
          {
            replacements: reqParam,
          }
        );
        total = await Raw.Query(
          `select count(1) as total from StationRecordScore ${where}`,
          {
            replacements: reqParam,
          }
        );
      }
      return { state: 1, areaList, result, total };
      // return {state: 1, areaList, result}
    } catch (error) {
      this.ctx.logger.error(error);
      return { state: 0 };
    }
  }

  // 保存检测站记分管理数据
  async saveStationRecordScoreData(params, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      const { RecordItem, rowData } = params;
      delete rowData.maxID; // 删除多余的属性
      delete rowData.time; // 删除多余的属性
      Object.keys(RecordItem).forEach((item) => {
        if (item != "row") rowData[item] = RecordItem[item];
      });
      rowData.RecordPerson = ctx.User.username;
      if (!rowData.ID) {
        if (!RecordItem.row) {
          await Raw.Insert("StationRecordScore", rowData);
        } else {
          let { StationCode, CountyCode } = rowData;
          await Raw.Update("StationRecordScore", rowData, {
            wherestr:
              "where CountyCode=:CountyCode and StationCode=:StationCode", //where 条件
            replacements: {
              //参数化执行
              StationCode: StationCode,
              CountyCode: CountyCode,
            },
          });
        }
      } else {
        let ID;
        if (rowData["RowNumber"]) {
          delete rowData.RowNumber; //删除属性
        }
        ID = rowData.ID;
        delete rowData.ID; //删除属性
        await Raw.Update("StationRecordScore", rowData, {
          wherestr: "where ID=:ID", //where 条件
          replacements: {
            //参数化执行
            ID: ID,
          },
        });
      }

      return { state: 1 };
    } catch (error) {
      return { state: 0 };
    }
  }
  // 上传图片
  async Upload(param, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let stream = await this.ctx.getFileStream();
      //拿到上传的额外信
      let datas = stream.fields;
      let baseDir = await app.redis
        .get("hj")
        .hget("systemconfig", "01_UploadFolder");
      if (!baseDir) {
        const result = await Raw.Query(
          `select FieldValue from Sys_Config where FieldKey='UploadFolder'`,
          {
            replacements: {},
          }
        );
        if (result && result.FieldValue && result.FieldValue != "")
          baseDir = result.FieldValue;
        else baseDir = "C:/VIMUploadFiles";
      } //保存的路径
      let filename = stream.filename; //文件名称
      const url = path.join(baseDir, "StationRecordScore/");
      // 2.保存路径是否存在,不存在则逐级创建目录
      if (!fs.existsSync(url)) {
        url.split(path.sep).reduce((currentPath, folder) => {
          currentPath += folder + path.sep;
          if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
          }
          return currentPath;
        }, "");
      }
      //  3.保存文件
      const savepath = path.join(url, filename);
      const writeStream = fs.createWriteStream(savepath);
      await awaitWriteStream(stream.pipe(writeStream));
      const Bytes = Buffer.from(fs.readFileSync(savepath)); //转字节
      let DisplayName = filename.substring(0, filename.lastIndexOf("."));
      let FileExtension = filename.substring(filename.lastIndexOf("."));
      let ID;
      let time;
      if (datas.ID) {
        ID = datas.ID;
      } else {
        ID = datas.maxID;
      }
      time = ctx.helper.dataFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
      let list = {
        BusinessAuditID: ID,
        UploadTime: time,
        FullFileName: `bsFile/StationRecordScore/${
          DisplayName + FileExtension
          }`,
        DisplayName: DisplayName,
        FileExtension: FileExtension,
        UploadPerson: ctx.User.username,
        FileBusinessGroup: "27",
        Bytes: Bytes,
      };
      await Raw.Insert("BusinessFileInfo", list);
      return { msg: "文件上传成功!", state: 1 };
    } catch (error) {
      console.log(error);
      return { state: 0, msg: "文件上传失败!" };
    }
  }
  // 查看图片
  async lookPic(params, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;

      let result = await Raw.QueryList(
        `select FullFileName,DisplayName,Bytes,FileExtension from BusinessFileInfo where BusinessAuditID=${params.ID} and FileBusinessGroup='27'`,
        {}
      );
      return { state: 1, result: result };
    } catch (error) {
      return { state: 0, msg: "文件查看失败!" };
    }
  }
  //多检审核修改-再次检测时间间隔
  async editHowLongTimes(
    { HowLongTimes, IUIDATE, InspectionAuditID, VehicleID },
    { ctx, userid }
  ) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      if (!IUIDATE) {
        return { state: 0, msg: "检测日期为空,多检审核修改时间间隔失败！" };
      }
      const IsOkInspectionDate = new Date(
        Date.parse(IUIDATE) + HowLongTimes * 60 * 60 * 1000
      );

      let IsOkInspectionDate1 = moment(IsOkInspectionDate).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      await Raw.Update(
        "InspectionAudit",
        { HowLongTimes: HowLongTimes, IsOkInspectionDate: IsOkInspectionDate },
        {
          wherestr: "where InspectionAuditID=:InspectionAuditID",
          replacements: {
            InspectionAuditID: InspectionAuditID,
          },
        }
      );

      // 修改操作存进CHANGE_LOG表
      let logParam = {};
      logParam.SOURCE_TABLE = "InspectionAudit";
      logParam.CHANGE_TIME = new Date();
      logParam.CHANGER = ctx.User.username;
      logParam.SOURCE_ID = VehicleID;
      logParam.LOG_MSG = `上次检测时间：${IUIDATE}，允许再次检测时间：${IsOkInspectionDate1}`;
      logParam.CHANGEDATASOURCE = "多受理审核修改";
      await Raw.Insert("CHANGE_LOG", logParam);
      return { state: 1, msg: "修改成功！" };
    } catch (error) {
      ctx.logger.error(error);
    }
  }
  // 修改获取处罚数据，筛选，分页等后台接口
  async getPunishData({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let { pageNum, pageSize, formData } = JSON.parse(params);
      let res = await ctx.service.hj.commonService.GetAreaRole();

      // const res1 = await ctx.service.hj.commonService.GetUserDetailRole();
      let AreaCode = res.data[0].substr(0, 4);
      let AreaList = await Raw.QueryList(
        `select AreaName,AreaCode from Area where AreaCode LIKE '${AreaCode}%' and AreaCode!='${AreaCode}00'`
      );
      let AreaAndStationList = AreaList.map((p) => {
        return { AreaCode: p.AreaCode, AreaName: p.AreaName, stations: [] };
      });
      for (let i = 0; i < AreaAndStationList.length; i++) {
        let stationList = await Raw.QueryList(
          `SELECT StationCode,StationName FROM StationInfo WHERE StationCode like '${AreaAndStationList[i].AreaCode}%'`
        );
        AreaAndStationList[i].stations = stationList;
      }
      let whereList = " 1=1";
      if (formData.AreaCode)
        whereList += ` AND c.AreaCode='${formData.AreaCode}'`;
      if (formData.StationCode)
        whereList += ` AND b.StationCode='${formData.StationCode}'`;
      if (formData.checkTime[0] != "" && formData.checkTime[1] != "")
        whereList += ` AND PunishTime>='${formData.checkTime[0]}' AND PunishTime<='${formData.checkTime[1]}'`;

      let obj = await Raw.QueryPageData(
        `
        SELECT ID,c.AreaCode,c.AreaName,b.StationCode,b.StationName,PunishType,PunishStatus,PunishTime,PunishReason 
            FROM StationPunish a LEFT JOIN StationInfo b ON a.StationCode=b.StationCode LEFT JOIN Area c ON a.AreaCode=c.AreaCode 
            WHERE${whereList}
        `,
        pageNum,
        pageSize,
        {
          orderstr: "PunishTime DESC",
          fieldstr: "",
          replacements: {},
        }
      );
      let { list, total } = obj;

      let result = [];
      let IDList = list.map((p) => {
        return p.ID;
      });
      let baseDir = await app.redis
        .get("hj")
        .hget("systemconfig", "01_UploadFolder");
      if (!baseDir) {
        result = await Raw.QueryList(
          `select FieldValue from Sys_Config where FieldKey='UploadFolder'`,
          {
            replacements: {},
          }
        );
        if (result && result.FieldValue && result.FieldValue != "") {
          baseDir = result.FieldValue;
        }
      } else {
        for (let i = 0; i < IDList.length; i++) {
          let id = IDList[i];
          let listInfo = await Raw.QueryList(
            `select ID,BusinessAuditID,FullFileName from BusinessFileInfo where FileBusinessGroup='25' and BusinessAuditID='${id}'`
          );
          result = result.concat(listInfo);
        }
      }
      return {
        state: 1,
        msg: "查询成功",
        data: list,
        total: total,
        finalASList: AreaAndStationList,
        fileData: result,
      };
    } catch (error) {
      this.app.CoreAPI.Log.trace("getPunishData方法报错：" + error);
      return { state: 0, msg: "查询失败" };
    }
  }
  // 新增处罚数据
  async addOrUpdatePunishData(
    {
      ID,
      AreaCode,
      StationCode,
      PunishType,
      PunishStatus,
      PunishTime,
      PunishReason,
    },
    { ctx, userid }
  ) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      // let AreaCode=await Raw.Query(`SELECT AreaCode FROM Area WHERE AreaName='${AreaName}'`)
      // let StationCode=await Raw.Query(`SELECT StationCode FROM StationInfo WHERE StationName='${StationName}'`)
      let filedObj = {
        AreaCode: AreaCode,
        StationCode: StationCode,
        PunishTime: PunishTime,
        PunishType: PunishType,
        PunishStatus: PunishStatus,
        PunishReason: PunishReason,
        AuditId: StationCode,
      };
      if (ID && ID !== undefined) {
        await Raw.Update(
          "StationPunish",
          { ...filedObj },
          {
            wherestr: "where ID=:ID",
            replacements: { ID: ID },
          }
        );
      } else if (ID == undefined) {
        await Raw.Insert("StationPunish", { ...filedObj });
      }
      return { state: 1, msg: "操作成功" };
    } catch (error) {
      ctx.logger.error(error);
      return { state: 0, msg: "操作失败" };
    }
  }
  // 删除处罚数据
  async delPunishData({ ID }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      await Raw.Delete("StationPunish", {
        wherestr: "where ID=:ID",
        replacements: {
          ID: ID,
        },
      });
      let IDList = await Raw.QueryList(
        `SELECT ID FROM BusinessFileInfo WHERE FileBusinessGroup='25' and BusinessAuditID='${ID}'`
      );
      if (IDList.length > 0) {
        for (let i = 0; i < IDList.length; i++) {
          let delID = IDList[i].ID;
          await Raw.Delete("BusinessFileInfo", {
            wherestr: "where ID=:ID",
            replacements: {
              ID: delID,
            },
          });
        }
      }
      return { state: 1, msg: "删除成功" };
    } catch (error) {
      ctx.logger.error(error);
      return { state: 0, msg: "删除失败" };
    }
  }
  // 上传处罚文件
  async uploadFile({ }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let stream = await this.ctx.getFileStream();
      let IDList = await Raw.QueryList(
        "SELECT * FROM StationPunish ORDER BY ID DESC"
      );
      let stationObj = await Raw.Query(
        `SELECT stationName,StationPunish.stationCode as stationCode FROM StationPunish LEFT JOIN StationInfo ON StationPunish.StationCode=StationInfo.StationCode WHERE ID='${IDList[0].ID}'`
      );
      // 保存到本地物理路径
      let baseDir = await app.redis
        .get("hj")
        .hget("systemconfig", "01_UploadFolder");
      if (!baseDir) {
        const result = await Raw.Query(
          `select FieldValue from Sys_Config where FieldKey='UploadFolder'`,
          {
            replacements: {},
          }
        );
        if (result && result.FieldValue && result.FieldValue != "")
          baseDir = result.FieldValue;
        else
          baseDir = `C:/VIMUploadFiles/stationPublicFile/${stationObj.stationCode}/`;
      }
      let filename = stream.filename;
      const targets = path.join(
        baseDir,
        `stationPublicFile/${stationObj.stationCode}/`
      );
      if (!fs.existsSync(targets)) {
        targets.split(path.sep).reduce((currentPath, newpath) => {
          currentPath += newpath + path.sep;
          if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
          }
          return currentPath;
        }, "");
      }
      const savepath = path.join(targets, filename);
      const writeStream = fs.createWriteStream(savepath);
      await awaitWriteStream(stream.pipe(writeStream));
      // 保存到数据库

      let time = await Raw.Query(
        `SELECT PunishTime FROM StationPunish WHERE ID='${IDList[0].ID}'`
      );
      let FileExtension = stream.filename
        .substring(stream.filename.lastIndexOf("."))
        .trim();
      let FileBusinessType = stream.filename
        .substring(stream.filename.lastIndexOf(".") + 1)
        .trim();
      let BusinessAuditID;
      if (stream.fields.id == "-1") {
        BusinessAuditID = IDList[0].ID;
      } else {
        BusinessAuditID = Number(stream.fields.id);
      }

      let FullFileName =
        `bsFile/stationPublicFile/${stationObj.stationCode}/` + filename;

      await Raw.Insert("BusinessFileInfo", {
        BusinessAuditID: BusinessAuditID,
        FullFileName: FullFileName,
        DisplayName: stationObj.stationName,
        FileExtension: FileExtension,
        FileBusinessType: FileBusinessType,
        UploadPerson: ctx.session.user.username,
        UploadTime: time.PunishTime,
        FileBusinessGroup: 25,
      });

      return { state: 1, msg: "文件上传成功" };
    } catch (error) {
      ctx.logger.error(error);
      return { state: 0, msg: "文件上传失败" };
    }
  }
  // 删除或更新处罚文件
  async delOrUpdateFile({ delids, updateNum, punishId }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let idObjList = await Raw.QueryList(
        `SELECT TOP(${updateNum}) ID FROM BusinessFileInfo WHERE FileBusinessGroup='25' ORDER BY ID DESC`
      );
      if (idObjList.length > 0) {
        for (let i = 0; i < idObjList.length; i++) {
          let newID = idObjList[i].ID;
          // await Raw.Update(`UPDATE BusinessFileInfo SET BusinessAuditID = '${punishId}' WHERE ID='${newID}'`)
          await Raw.Update(
            "BusinessFileInfo",
            { BusinessAuditID: `${punishId}` },
            {
              wherestr: "where ID=:ID",
              replacements: { ID: newID },
            }
          );
        }
      }
      if (delids.length > 0) {
        for (let i = 0; i < delids.length; i++) {
          await Raw.Delete("BusinessFileInfo", {
            wherestr: "where ID=:ID",
            replacements: {
              ID: delids[i],
            },
          });
        }
      }

      return { state: 1, msg: "操作成功" };
    } catch (error) {
      ctx.logger.error(error);
      return { state: 0, msg: "操作失败" };
    }
  }
  // 获取特殊型号所有数据及分页
  async getAllSpecialModelData({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let { pageNum, pageSize, formData } = JSON.parse(params);
      formData = JSON.parse(formData);
      let where = " 1=1";
      if (formData) {
        for (let i in formData) {
          if (i == "IUETYPE") where += ` AND ${i} LIKE '%${formData[i]}%'`;
          else where += ` AND ${i}='${formData[i]}'`;
        }
      }
      let obj = await Raw.QueryPageData(
        `SELECT ID,EmissionStandard,IUETYPE,IUEMANU,LambdaD,LambdaU,Remark,UploadPerson,UploadTime,IsCheckHC,IsUploadLambdaLimit FROM LambdaLimitByMANU where${where}`,
        pageNum,
        pageSize,
        {
          orderstr: "ID DESC",
          fieldstr: "",
          replacements: {},
        }
      );
      let { list, total } = obj;
      return { data: list, total: total, state: 1, msg: "获取数据成功" };
    } catch (error) {
      this.app.CoreAPI.Log.trace("getAllSpecialModelData方法报错：" + error);
      return { state: 0, msg: "获取失败" };
    }
  }
  // 删除当前特殊型号数据
  async delSpecialModesData({ ID }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      await Raw.Delete("LambdaLimitByMANU", {
        wherestr: "where ID=:ID",
        replacements: {
          ID: ID,
        },
      });
      return { state: 1, msg: "删除成功" };
    } catch (error) {
      this.app.CoreAPI.Log.trace("delSpecialModesData方法报错：" + error);
      return { state: 0, msg: "删除失败" };
    }
  }
  // 新增特殊型号数据
  async addOrUpdateSpecialModesData({ ID, params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let fieldsObj = {};
      let UploadPerson = ctx.session.user.username;
      for (let i in params) {
        fieldsObj[i] = params[i];
      }
      fieldsObj.UploadPerson = UploadPerson;
      if (ID) {
        await Raw.Update(
          "LambdaLimitByMANU",
          { ...fieldsObj },
          {
            wherestr: "where ID=:ID",
            replacements: { ID: ID },
          }
        );
      } else {
        await Raw.Insert("LambdaLimitByMANU", { ...fieldsObj });
      }
      return { state: 1, msg: "数据更新成功" };
    } catch (error) {
      this.app.CoreAPI.Log.trace(
        "addOrUpdateSpecialModesData方法报错：" + error
      );
      return { state: 0, msg: "数据更新失败" };
    }
  }
  // 导入特殊型号表格
  async importSpecialModelExcel({ }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let importDateArr = [];
      const stream = await this.ctx.getFileStream();
      let baseDir = "C:/skyland/UploadSpecialModelFile/";
      if (!baseDir) {
        const result = await Raw.Query(
          `select FieldValue from Sys_Config where FieldKey='UploadFolder'`,
          {
            replacements: {},
          }
        );
        if (result && result.FieldValue && result.FieldValue != "")
          baseDir = result.FieldValue;
        else baseDir = "C:/bsFile";
      } //保存的路径
      let filename = stream.filename; //文件名称
      const url = path.join(baseDir, "VIMUploadFiles/specialModelData");
      //2.保存路径是否存在,不存在则逐级创建目录
      if (!fs.existsSync(url)) {
        url.split(path.sep).reduce((currentPath, folder) => {
          currentPath += folder + path.sep;
          if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
          }
          return currentPath;
        }, "");
      }
      //3.保存文件
      const savepath = path.join(url, filename);
      const writeStream = fs.createWriteStream(savepath);
      await awaitWriteStream(stream.pipe(writeStream));
      //4.读取excel文件
      const workbook = xlsx.readFile(savepath);
      const sheetNames = workbook.SheetNames; // 返回 ['sheet1', ...]
      const worksheet = workbook.Sheets[sheetNames[0]];
      //5.设置读取的范围
      let range = xlsx.utils.decode_range(worksheet["!ref"]);
      range.s.r = 1;
      range.s.c = 0;
      //6.获取excel数据
      const data = xlsx.utils.sheet_to_json(worksheet, {
        header: 1,
        range: range,
        dateNF: "",
      });
      if (data.length == 0) {
        return JSON.stringify({ msg: "同步的文件数据为空！", code: 2 }); //导入数据为空则返回
      }
      let EmissionStandards = await Raw.QueryList(
        "SELECT CodeName,CodeValue FROM CD_EmissionStandard"
      );
      // let importDate = {};
      for (let i = 0; i < data.length; i++) {
        let importDate = {};
        if (data[i][7]) {
          data[i][7] = formatDate1(data[i][7], '-')
        }

        importDate.IUETYPE = data[i][0]
        importDate.IUEMANU = data[i][1]
        importDate.EmissionStandard = data[i][2]
        importDate.isCheckHC = data[i][3]
        importDate.isUploadLambdaLimit = data[i][4]
        importDate.LambdaD = data[i][5]
        importDate.LambdaU = data[i][6]
        importDate.UploadTime = data[i][7]
        importDate.Remark = data[i][8]
        importDate.UploadPerson = data[i][9]
        importDateArr.push(importDate);

      }
      for (let i = 0; i < importDateArr.length; i++) {
        for (let j = 0; j < EmissionStandards.length; j++) {
          if (
            importDateArr[i].EmissionStandard == EmissionStandards[j].CodeName
          ) {
            importDateArr[i].EmissionStandard = EmissionStandards[j].CodeValue;
          }
        }
      }
      for (let i = 0; i < importDateArr.length; i++) {
        if (importDateArr[i].isCheckHC == "是") importDateArr[i].isCheckHC = 1;
        else importDateArr[i].isCheckHC = 0;
        if (importDateArr[i].isUploadLambdaLimit == "是")
          importDateArr[i].isUploadLambdaLimit = 1;
        else importDateArr[i].isUploadLambdaLimit = 0;
      }
      await Raw.InsertList("LambdaLimitByMANU", importDateArr);
      return { state: 1, msg: "表格导入成功" };
    } catch (error) {
      console.log(error);
      this.app.CoreAPI.Log.trace("importSpecialModelExcel方法报错：" + error);
      return { state: 0, msg: "表格导入失败" };
    }
    function formatDate1(serial, format) {
      var utc_days = Math.floor(serial - 25569);
      var utc_value = utc_days * 86400;
      var date_info = new Date(utc_value * 1000);
      var fractional_day = serial - Math.floor(serial) + 0.0000001;
      var total_seconds = Math.floor(86400 * fractional_day);
      var seconds = total_seconds % 60;
      total_seconds -= seconds;
      var hours = Math.floor(total_seconds / (60 * 60));
      var minutes = Math.floor(total_seconds / 60) % 60;


      var daytime = new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
      var returnDate = date_info.getFullYear();
      returnDate += format + (date_info.getMonth() < 9 ? '0' + (date_info.getMonth() + 1) : (date_info.getMonth() + 1));
      returnDate += format + (date_info.getDate() < 10 ? '0' + date_info.getDate() : date_info.getDate());
      returnDate += " " + (daytime.getHours() < 10 ? '0' + daytime.getHours() : daytime.getHours());
      returnDate += ":" + (daytime.getMinutes() < 10 ? '0' + daytime.getMinutes() : daytime.getMinutes());
      returnDate += ":" + (daytime.getSeconds() < 10 ? '0' + daytime.getSeconds() : daytime.getSeconds());
      return returnDate;
    }
  }
  // 特殊车辆OBD管理
  async getSpecialVehicleOBDManageData({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let { pageNum, pageSize, formData } = JSON.parse(params);
      let where = ` 1=1`;
      if (formData !== {}) {
        let {
          EmissionStandard,
          FuelType,
          ProductDate,
          VehicleType,
          IsHaveOBD,
          IsCheckOBD,
          UploadTime,
        } = formData;
        if (EmissionStandard)
          where += ` and EmissionStandard='${EmissionStandard}'`;
        if (FuelType) where += ` and FuelType='${FuelType}'`;
        if (ProductDate && ProductDate[0] != "" && ProductDate[1] != "")
          where += ` and ProductDate>='${ctx.helper.dataFormat(
            ProductDate[0],
            "yyyy-MM-dd 00:00:00"
          )}' and ProductDate<='${ctx.helper.dataFormat(
            ProductDate[0],
            "yyyy-MM-dd 23:59:59"
          )}'`;
        if (VehicleType) where += ` and VehicleType='${formData.VehicleType}'`;
        if (IsHaveOBD == 0) where += ` and IsHaveOBD=0`;
        if (IsHaveOBD == 1) where += ` and IsHaveOBD=1`;
        if (IsCheckOBD == 0) where += ` and IsCheckOBD=0`;
        if (IsCheckOBD == 1) where += ` and IsCheckOBD=1`;
        if (UploadTime && UploadTime[0] != "" && UploadTime[1] != "")
          where += ` and ProductDate>='${ctx.helper.dataFormat(
            UploadTime[0],
            "yyyy-MM-dd 00:00:00"
          )}' and ProductDate<='${ctx.helper.dataFormat(
            UploadTime[1],
            "yyyy-MM-dd 23:59:59"
          )}'`;
      }
      let obj = await Raw.QueryPageData(
        ` SELECT ID,b.CodeName EmissionStandard,FactoryPlateModel,IUVTYPE,IUEMANU,c.CodeName FuelType,ProductDate,d.CodeName VehicleType,IsHaveOBD,
      IsCheckOBD,UploadTime,UploadPerson,Remark FROM SpecialVehicleOBDManage a LEFT JOIN CD_EmissionStandard b ON a.EmissionStandard=b.CodeValue  LEFT JOIN CD_FuelType c ON a.FuelType=c.CodeValue 
      LEFT JOIN CD_VehicleType d ON a.VehicleType=d.CodeValue where ${where}`,
        pageNum,
        pageSize,
        {
          orderstr: "UploadTime desc",
        }
      );
      let { list, total } = obj;
      return { data: list, total: total, state: 1, msg: "查询成功" };
    } catch (error) {
      this.app.CoreAPI.Log.trace(
        "getSpecialVehicleOBDManageData方法报错：" + error
      );
      return { state: 0, msg: "数据查询失败" };
    }
  }
  // 新增或更新特殊车辆OBD数据
  async addOrUpdateOBDManageData({ ID, params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let dataObj = {};
      let UploadPerson = ctx.session.user.username;
      for (let i in params) {
        dataObj[i] = params[i];
      }
      dataObj.UploadPerson = UploadPerson;
      if (ID == undefined) {
        await Raw.Insert("SpecialVehicleOBDManage", { ...dataObj });
      } else {
        await Raw.Update(
          "SpecialVehicleOBDManage",
          { ...dataObj },
          { wherestr: "where ID=:ID", replacements: { ID: ID } }
        );
      }
      return { state: 1, msg: "操作成功" };
    } catch (error) {
      this.app.CoreAPI.Log.trace("addOrUpdateOBDManageData方法报错：" + error);
      return { state: 0, msg: "操作失败" };
    }
  }
  // 删除特殊车辆OBD数据
  async delOBDManageData({ ID }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      await Raw.Delete("SpecialVehicleOBDManage", {
        wherestr: "where ID=:ID",
        replacements: { ID: ID },
      });
      return { state: 1, msg: "删除成功" };
    } catch (error) {
      this.app.CoreAPI.Log.trace("delOBDManageData方法报错：" + error);
      return { state: 0, msg: "操作失败" };
    }
  }
  // 获取检测报告管理数据
  async getDetectionReportData({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let { pageNum, pageSize, formData, isAll, stationList } = JSON.parse(
        params
      );
      let where = ` 1=1`;
      if (formData.StationCode) {
        where += ` and StationCode='${formData.StationCode}'`;
      } else {
        let list = stationList.join(",");
        where += ` and StationCode in (${list})`;
      }
      if (formData.VLPN) {
        where += ` and VLPN like '%${formData.VLPN}%'`;
      }
      if (
        formData.DetectEndTime &&
        formData.DetectEndTime[0] != "" &&
        formData.DetectEndTime[1] != ""
      ) {
        where += ` and DetectEndTime>='${ctx.helper.dataFormat(
          formData.DetectEndTime[0],
          "yyyy-MM-dd 00:00:00"
        )}' and DetectEndTime<='${ctx.helper.dataFormat(
          formData.DetectEndTime[1],
          "yyyy-MM-dd 00:00:00"
        )}'`;
      }
      if (isAll) {
        const result = await Raw.QueryList(
          `SELECT InspectionDataID,StationCode,InspectionNum,VLPN,VLPNColor,VIN,IUTYPE,DetectEndTime,VDCT,IsCanPrint,PrintTimes,SurplusPrintTimes FROM InspectionData
                    where ${where} order by DetectEndTime desc`
        );
        return { state: 1, data: result };
      } else {
        let obj = await Raw.QueryPageData(
          `SELECT InspectionDataID,StationCode,InspectionNum,VLPN,VLPNColor,VIN,IUTYPE,DetectEndTime,VDCT,IsCanPrint,PrintTimes,SurplusPrintTimes FROM InspectionData where${where}`,
          pageNum,
          pageSize,
          {
            orderstr: "DetectEndTime desc",
          }
        );
        let { list, total } = obj;
        return { data: list, total: total, state: 1, msg: "查询成功" };
      }
    } catch (error) {
      this.app.CoreAPI.Log.trace("getDetectionReportData方法报错：" + error);
      return { state: 0, msg: "数据查询失败" };
    }
  }
  // 修改检测报告是否打印和剩余打印次数
  async editDetectionReportData(
    { InspectionDataID, IsCanPrint, SurplusPrintTimes },
    { ctx, userid }
  ) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let obj = {};
      if (IsCanPrint == 0 || IsCanPrint == 1) obj.IsCanPrint = IsCanPrint;
      if (SurplusPrintTimes) obj.SurplusPrintTimes = SurplusPrintTimes;
      await Raw.Update(
        "InspectionData",
        { ...obj },
        {
          wherestr: "where InspectionDataID=:InspectionDataID",
          replacements: { InspectionDataID: InspectionDataID },
        }
      );
      return { state: 1, msg: "更新成功" };
    } catch (error) {
      ctx.logger.error(error);
      return { state: 0, msg: "修改数据失败 " };
    }
  }
  async getVecRepairBasicInfo({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let { pageNum, pageSize, formdata } = JSON.parse(params);
      let where = ` 1=1`;
      if (formdata !== {}) {
        let { VLPN, time } = formdata;
        if (VLPN) where += ` and vehicleplatenumber like '%${VLPN}%'`;
        if (time && time[0] != "" && time[1] != "")
          where += ` and UploadTime >='${time[0]}' and UploadTime <='${time[1]}'`;
      }

      let list = await Raw.QueryList(
        `
        SELECT TOP(${pageSize}) N.*FROM(
          SELECT ROW_NUMBER() OVER(ORDER BY UploadTime DESC) AS ROWNUM, M.*FROM(
            select *
            From VecRepairBasicInfo
            where${where}
          ) M 
          
          ) N WHERE N.ROWNUM>((${pageNum}-1)*${pageSize})
        `
      );

      let total = await Raw.Query(
        `
        SELECT count(*) as total FROM VecRepairBasicInfo `
      );
      return { data: list, total: total.total, state: 1, msg: "查询成功" };
    } catch (error) {
      this.app.CoreAPI.Log.trace("testEquipmentExpiration方法报错：" + error);
      return { state: 0, msg: "查询失败" };
    }
  }
  // 车辆维修信息
  async getMaintainInfo({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let { pageNum, pageSize, formData } = JSON.parse(params);
      let where = ` 1=1`;
      let FactoryName = await Raw.QueryList(
        "select MAI_ID as CodeValue,MAI_Name as CodeName From MaintainFactory"
      );
      let VLPNColorlist = await Raw.QueryList(
        "select CodeValue,CodeName from CD_VLPNColor"
      );
      if (formData !== {}) {
        let { MAI_ID, MINF_ID, MINF_DATE, VLPNColor, VLPN } = formData;
        if (MINF_ID) where += ` and a.MINF_ID like '%${MINF_ID}%'`;
        if (MINF_DATE && MINF_DATE[0] != "" && MINF_DATE[1] != "")
          where += ` and a.MINF_Date>='${MINF_DATE[0]}' and a.MINF_Date<='${MINF_DATE[1]}'`;
        if (VLPN) where += ` and a.VLPN like '%${VLPN}%'`;
        if (VLPNColor) where += ` and a.VLPNColor='${VLPNColor}'`;
        if (MAI_ID) where += ` and a.MAI_ID='${MAI_ID}'`;
      }

      let list = await Raw.QueryList(
        `
        SELECT TOP(${pageSize}) N.*FROM(
          SELECT ROW_NUMBER() OVER(ORDER BY MINF_DATE DESC) AS ROWNUM, M.*FROM(
            select MINF_ID,MINF_RECORD,MINF_OPERATOR,MINF_OK,MINF_DATE,VLPN,b.CodeName VLPNColor,c.MAI_Name MAI_ID,MINF_MainKey
            From MaintainInfo a
            left join CD_VLPNColor b on a.VLPNColor=b.CodeValue
            left join (select MAI_ID,MAI_Name from MaintainFactory) c on a.MAI_ID =c.MAI_ID
            where${where}
          ) M 
          
          ) N WHERE N.ROWNUM>((${pageNum}-1)*${pageSize})
        `
      );

      let total = await Raw.Query(
        `
        SELECT count(*) as total FROM MaintainInfo `
      );
      list.forEach((p) => {
        if (p.MINF_OK == 1) p.MINF_OK = "合格";
        else if (p.MINF_OK == 0) p.MINF_OK = "不合格";
        else p.MINF_OK = null;
      });
      return {
        data: list,
        total: total.total,
        FactoryName: FactoryName,
        VlPNColorlist: VLPNColorlist,
        state: 1,
        msg: "查询成功",
      };
    } catch (error) {
      ctx.logger.error(error);
      return { state: 0, msg: "数据查询失败" };
    }
  }
  //车辆维修信息更改/添加
  async addOrUpdateMaintainInfo({ MINF_MainKey, params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let dataObj = {
        VLPN: params.VLPN,
        MINF_DATE: params.MINF_DATE,
        MINF_ID: params.MINF_ID,
        MINF_RECORD: params.MINF_RECORD || null,
        MAI_ID: params.MAI_ID,
        VLPNColor: params.VLPNColor,
        MINF_OK: params.MINF_OK,
        MINF_OPERATOR: params.MINF_OPERATOR,
      };
      if (MINF_MainKey == undefined) {
        await Raw.Insert("MaintainInfo", { ...dataObj });
      } else {
        await Raw.Update(
          "MaintainInfo",
          { ...dataObj },
          {
            wherestr: "where MINF_MainKey=:MINF_MainKey",
            replacements: { MINF_MainKey: MINF_MainKey },
          }
        );
      }
      return { state: 1, msg: "操作成功" };
    } catch (error) {
      ctx.logger.error(error);
      return { state: 0, msg: "操作失败" };
    }
  }
  //车辆维修信息删除
  async delMaintainInfo({ MINF_MainKey }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      await Raw.Delete("MaintainInfo", {
        wherestr: "where MINF_MainKey=:MINF_MainKey",
        replacements: { MINF_MainKey: MINF_MainKey },
      });
      return { state: 1, msg: "删除成功" };
    } catch (error) {
      ctx.logger.error(error);
      return { state: 0, msg: "操作失败" };
    }
  }

  // 查询路检数据
  async getRoadDetection(params, { ctx, userid }) {
    params = JSON.parse(params["params"]).param;
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let area = await ctx.service.hj.commonService.GetAreaRole();
      let where = "where 1=1";
      let reqParam = {};
      const page = (params.pageIndex - 1) * params.pageSize;
      if (params.CheckDate1 && params.CheckDate2) {
        where += ` and CheckDate>= :CheckDate1 and CheckDate<= :CheckDate2`;
        reqParam.CheckDate1 = params.CheckDate1;
        reqParam.CheckDate2 = params.CheckDate2;
      }
      for (let key in params) {
        if (params[key] || params[key] === 0) {
          if (
            key != "CheckDate1" &&
            key != "CheckDate2" &&
            key != "pageSize" &&
            key != "pageIndex" &&
            key != "VLPN" &&
            key != "OwnerName" &&
            key != "T_VEHICLEID"
          ) {
            where += " and " + key + "= :" + key;
            reqParam[key] = params[key];
          }
          if (key == "VLPN" || key == "OwnerName") {
            where += ` and ${key} like '%${params[key]}%'`;
          }
          if (key == "T_VEHICLEID") {
            if (params[key] == 1) where += ` and ${key} is not null`;
            else where += ` and ${key} is null`;
          }
        }
      }
      let result;
      let total;

      result = await Raw.QueryList(
        `select top ${params.pageSize} *from (select ROW_NUMBER() OVER(ORDER BY CheckDate desc) as RowNumber, *from RoadDetection ${where}) RoadDetection where RowNumber > ${page} order by RoadDetectionID desc`,
        {
          replacements: reqParam,
        }
      );
      total = await Raw.Query(
        `select count(1) as total from RoadDetection ${where}`,
        {
          replacements: reqParam,
        }
      );
      return { state: 1, result, total, area };
    } catch (error) {
      return { state: 0 };
    }
  }
  // 编辑路检数据
  async editRoadDetection(params, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let ID = params.RoadDetectionID;
      // 删除多余属性
      delete params.RoadDetectionID;
      delete params._index;
      delete params._rowKey;
      delete params.RowNumber;
      if (ID) {
        await Raw.Update("RoadDetection", params, {
          wherestr: "where RoadDetectionID=:ID", //where 条件
          replacements: {
            //参数化执行
            ID: ID,
          },
        });
      } else {
        // 路检编号生成
        const nowDate = moment(new Date()).format("YYYYMMDD");
        const lastCode = await Raw.Query(`select top 1 SUBSTRING(RoadDetectionCode, 7, 8) as codeDate, 
                      SUBSTRING(RoadDetectionCode, 15, 3)  as rightCode from RoadDetection where SUBSTRING(RoadDetectionCode, 7, 8)=:nowDate
                                        order by RoadDetectionID desc`, {
          replacements: {
            nowDate
          }
        });
        console.log(lastCode);
        if (lastCode && lastCode.codeDate && lastCode.rightCode && lastCode.codeDate == nowDate) {
          let three = parseInt(lastCode.rightCode) + 1;
          let newtree = '';
          if (three.toString.length == 1) {
            newtree = "00" + parseFloat(three);
          } else if (three.toString.length == 2) {
            newtree = "0" + parseFloat(three);
          }
          params.RoadDetectionCode = params.CheckUnit + nowDate + newtree;
        } else {
          params.RoadDetectionCode = params.CheckUnit + nowDate + '000';
        }
        await Raw.Insert("RoadDetection", params);
      }
      return { state: 1 };
    } catch (error) {
      console.log(error);

      this.app.CoreAPI.Log.error(`editRoadDetection:` + error);
      return { state: 0 };
    }
  }
  // 删除路检数据
  async deleteRoadDetection(params, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let ID = params.RoadDetectionID;
      await Raw.Delete("RoadDetection", {
        wherestr: "where RoadDetectionID=:ID", //where 条件
        replacements: {
          //参数化执行
          ID: ID,
        },
      });
      return { state: 1 };
    } catch (error) {
      return { state: 0 };
    }
  }
  // 上传文件
  async uploadDownloadLog(param, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let stream = await this.ctx.getFileStream();
      //拿到上传的额外信
      let datas = stream.fields;
      let ID = datas.RoadDetectionID;
      let baseDir = await app.redis
        .get("hj")
        .hget("systemconfig", "01_UploadFolder");
      if (!baseDir) {
        const result = await Raw.Query(
          `select FieldValue from Sys_Config where FieldKey='UploadFolder'`,
          {
            replacements: {},
          }
        );
        if (result && result.FieldValue && result.FieldValue != "")
          baseDir = result.FieldValue;
        else baseDir = "C:/VIMUploadFiles";
      } //保存的路径
      let filename = stream.filename; //文件名称
      const url = path.join(baseDir, "PathDetection/");
      // 2.保存路径是否存在,不存在则逐级创建目录
      if (!fs.existsSync(url)) {
        url.split(path.sep).reduce((currentPath, folder) => {
          currentPath += folder + path.sep;
          if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
          }
          return currentPath;
        }, "");
      }
      //  3.保存文件
      const savepath = path.join(url, filename);
      const writeStream = fs.createWriteStream(savepath);
      await awaitWriteStream(stream.pipe(writeStream));
      let FileExtension = filename.substring(filename.lastIndexOf("."));
      let time = ctx.helper.dataFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
      let time2 = ctx.helper.dataFormat(new Date(), "yyyyMMdd_hhmmss");
      let DisplayName = `整改通知书_${ID}_${time2}`;
      let list = {
        OperationDate: time,
        FileHref: `bsFile/PathDetection/${filename}`,
        DisplayName: DisplayName,
        FileName: DisplayName + FileExtension,
        FileType: "04",
        DownloadTimes: 0,
        Remark:
          DisplayName +
          FileExtension +
          "_" +
          ctx.helper.dataFormat(new Date(), "yyyyMMddhhmm"),
      };
      await Raw.Insert("DownloadLog", list);
      return { msg: "文件上传成功!", state: 1 };
    } catch (error) {
      return { state: 0, msg: "文件上传失败!" };
    }
  }

  // 路检数据管理导入
  async upLoadPathCheckData() {
    let { app } = this;
    let { transaction, Raw } = app.Dbs.hj;
    try {
      const targets = "c:/skyland/tempFiles/";
      const stream = await this.ctx.getFileStream();
      if (!fs.existsSync(targets)) {
        targets.split(path.sep).reduce((currentPath, folder) => {
          currentPath += folder + path.sep;
          if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath, { recursive: true });
          }
          return currentPath;
        }, "");
      }
      const savepath = path.join(targets, stream.filename);
      const writeStream = fs.createWriteStream(savepath);
      await awaitWriteStream(stream.pipe(writeStream));
      var list = await nodexlsx.parse(targets + stream.filename);
      let deviceType = [
        {
          CodeValue: "01",
          CodeName: "不透光烟度计",
        },
        {
          CodeValue: "02",
          CodeName: "林格曼测试仪",
        },
      ]; //设备类型
      let distribution = [
        { CodeValue: "0", CodeName: "否" },
        { CodeValue: "1", CodeName: "是" },
      ]; //是否发放整改书
      let checkResult = [
        { CodeValue: "0", CodeName: "不通过" },
        { CodeValue: "1", CodeName: "通过" },
      ]; //是否通过
      let vlpnColorList = await Raw.QueryList(
        `select CodeValue, CodeName from CD_VLPNColor`
      ); //车牌颜色
      let GAVTypeList = await Raw.QueryList(
        `select CodeValue, CodeName from CD_GAVType`
      ); //车辆类型
      let FuelTypeList = await Raw.QueryList(
        `select CodeValue, CodeName from CD_FuelType`
      ); //燃油类型
      let IntakeWayList = await Raw.QueryList(
        `select CodeValue, CodeName from CD_IntakeWay`
      ); //进气方式
      let BZTYPEList = await Raw.QueryList(
        `select CodeValue, CodeName from CD_BZTYPE`
      ); //标志类型
      let DetectionTypeList = await Raw.QueryList(
        `select CodeValue, CodeName from CD_DetectionType`
      ); //检测类型
      let Area = await Raw.QueryList(`select AreaCode, AreaName from Area`); //检测单位
      list[0].data.forEach(async (i, index) => {
        if (index > 0) {
          i[2] = vlpnColorList.filter((v) => {
            if (i[2] == v.CodeName) return v;
          }).length
            ? vlpnColorList.filter((v) => {
              if (i[2] == v.CodeName) return v;
            })[0].CodeValue
            : "";
          i[5] = GAVTypeList.filter((v) => {
            if (i[5] == v.CodeName) return v;
          }).length
            ? GAVTypeList.filter((v) => {
              if (i[5] == v.CodeName) return v;
            })[0].CodeValue
            : "";
          i[7] = FuelTypeList.filter((v) => {
            if (i[7] == v.CodeName) return v;
          }).length
            ? FuelTypeList.filter((v) => {
              if (i[7] == v.CodeName) return v;
            })[0].CodeValue
            : "";
          i[9] = IntakeWayList.filter((v) => {
            if (i[9] == v.CodeName) return v;
          }).length
            ? IntakeWayList.filter((v) => {
              if (i[9] == v.CodeName) return v;
            })[0].CodeValue
            : "";
          i[12] = deviceType.filter((v) => {
            if (i[12] == v.CodeName) return v;
          }).length
            ? deviceType.filter((v) => {
              if (i[12] == v.CodeName) return v;
            })[0].CodeValue
            : "";
          i[13] = DetectionTypeList.filter((v) => {
            if (i[13] == v.CodeName) return v;
          }).length
            ? DetectionTypeList.filter((v) => {
              if (i[13] == v.CodeName) return v;
            })[0].CodeValue
            : "";
          i[24] = BZTYPEList.filter((v) => {
            if (i[24] == v.CodeName) return v;
          }).length
            ? BZTYPEList.filter((v) => {
              if (i[24] == v.CodeName) return v;
            })[0].CodeValue
            : "";
          i[25] = Area.filter((v) => {
            if (i[25] == v.AreaName) return v;
          }).length
            ? Area.filter((v) => {
              if (i[25] == v.AreaName) return v;
            })[0].AreaCode
            : "";
          i[29] = distribution.filter((v) => {
            if (i[29] == v.CodeName) return v;
          }).length
            ? distribution.filter((v) => {
              if (i[29] == v.CodeName) return v;
            })[0].CodeValue
            : "";
          i[30] = checkResult.filter((v) => {
            if (i[30] == v.CodeName) return v;
          }).length
            ? checkResult.filter((v) => {
              if (i[30] == v.CodeName) return v;
            })[0].CodeValue
            : "";
          if (typeof i[8] == "number")
            i[8] = moment(new Date(1900, 0, i[8])).format(
              "YYYY-MM-DD hh:mm:ss"
            );
          if (typeof i[10] == "number")
            i[10] = moment(new Date(1900, 0, i[10])).format(
              "YYYY-MM-DD hh:mm:ss"
            );
          if (typeof i[27] == "number")
            i[27] = moment(new Date(1900, 0, i[27])).format(
              "YYYY-MM-DD hh:mm:ss"
            );
          if (typeof i[28] == "number")
            i[28] = moment(new Date(1900, 0, i[28])).format(
              "YYYY-MM-DD hh:mm:ss"
            );
          if (i[1] && i.length) {
            await Raw.Insert("RoadDetection", {
              RoadDetectionCode: i[0], // 路检编号
              VLPN: i[1] ? i[1] : "", // 车牌号
              VLPNColor: i[2], //车牌颜色
              OwnerName: i[3], //车主
              VIN: i[4], //车架号
              VehicleType: i[5], //车辆类型
              FactoryPlateModel: i[6], //厂家
              FuelType: i[7], // 燃油类型
              RegistDate: i[8], // 注册日期
              IntakeWay: i[9], // 进气方式
              CheckDate: i[10], // 检测日期
              DeviceCode: i[11], // 设备编号
              DeviceType: i[12], // 设备类型
              DectionType: i[13], //检测类型
              ED: i[14],
              LCO: i[15],
              LHC: i[16],
              HCO: i[17],
              HHC: i[18],
              Photopermeability1: i[19],
              Photopermeability2: i[20],
              Photopermeability3: i[21],
              AvgPhotopermeability: i[22], //平均不透光度
              AVGSmoking: i[23], //平均烟气黑度
              BZTYPE: i[24], //标志类型
              CheckUnit: i[25], //检测单位
              CheckAddress: i[26], //检测地段
              StartDateTime: i[27], //检测结束时间
              EndDateTime: i[28], //检测开始时间
              SendInform: i[29], //是否发放整改书
              DectionResult: i[30], // 检测结果
            });
          }
        }
      });
      return { state: 1, msg: "上传成功", list };
    } catch (error) {
      app.CoreAPI.Log.error(`upLoadPathCheckData:` + error);
      return JSON.stringify({ state: 0, msg: "上传失败" });
    }
  }

  // 查看文件
  async lookLoadPic(param, { ctx, userid }) {
    param = JSON.parse(param.params).row;
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let result = await Raw.QueryList(
        `select DisplayName, FileHref, FileName, DownloadTimes, ID from DownLoadLog where DisplayName like '%整改通知书_${param.RoadDetectionID}%'`
      );
      return { state: 1, result };
    } catch (error) {
      return { state: 0 };
    }
  }
  // 下载次数
  async addDownloadCount(params, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let ID = params.ID;
      await Raw.Update(
        "DownLoadLog",
        { DownloadTimes: params.DownloadTimes + 1 },
        {
          wherestr: "where ID=:ID", //where 条件
          replacements: {
            //参数化执行
            ID: ID,
          },
        }
      );
      return { state: 1 };
    } catch (error) {
      return { state: 0 };
    }
  }
  // 展示维修记录测试
  async maintenanceRecordData(params, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let resultlist = await Raw.QueryList(`SELECT * FROM ReqInfo`);
      return { state: 1, msg: "获取成功", data: resultlist };
    } catch (error) {
      return { state: 0 };
    }
  }
  // 企业信息
  async getCompanyInfo(params, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let companyuniquecode = params[0];
      let result = await Raw.Query(
        `SELECT * FROM repairCompanyInfo WHERE companyuniquecode='${companyuniquecode}'`
      );
      return { state: 1, msg: "获取成功", data: result };
    } catch (error) {
      return { state: 0 };
    }
  }
  // 基础信息
  async getBasicInfo(params, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let respInfoID = params[0];
      let resultlist = await Raw.QueryList(
        `SELECT * FROM BasicInfo WHERE respInfoID='${respInfoID}'`
      );
      return { state: 1, msg: "获取成功", data: resultlist };
    } catch (error) {
      return { state: 0 };
    }
  }
  // 配件信息
  async getPartsInfo(params, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let respInfoID = params[0];
      let resultlist = await Raw.QueryList(
        `SELECT * FROM Vehiclepartslist WHERE respInfoID='${respInfoID}'`
      );
      return { state: 1, msg: "获取成功", data: resultlist };
    } catch (error) {
      return { state: 0 };
    }
  }
  // 维修项目详细
  async getProjectInfo(params, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let respInfoID = params[0];
      let resultlist = await Raw.QueryList(
        `SELECT * FROM Repairprojectlist WHERE respInfoID='${respInfoID}'`
      );
      return { state: 1, msg: "获取成功", data: resultlist };
    } catch (error) {
      return { state: 0 };
    }
  }

  // 非工况原因查询
  async getFGKReasonInfo({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let param = JSON.parse(params);
      let where = " 1=1 ";
      if (param.formData.InspectionNum)
        where +=
          " and InspectionNum like '%" + param.formData.InspectionNum + "%'";
      if (param.formData.Time[0] != "" && param.formData.Time[1] != "")
        where +=
          " and ImportTime>='" +
          param.formData.Time[0] +
          "' and ImportTime<='" +
          param.formData.Time[1] +
          "'";
      let sql = `select Url,a.ID,a.VehicleID,InspectionNum,FGKReason,ImportTime,Remark,OtherReason,JSFZRRemark,InspectionMethod from AcceptanceFGKReason a left join (select * from UploadFileData where  BusinessType = '61'  and FileGroup = '20') b on a.InspectionNum = b.BusinessKey  where ${where}`;
      let result = [];
      if (param.isAll) {
        sql += " order by ImportTime desc";
        result = await Raw.QueryList(sql);
        return { state: 1, msg: "获取成功", data: result };
      } else {
        result = await Raw.QueryPageData(sql, param.pageIndex, param.pageSize, {
          orderstr: "ImportTime desc",
          fieldstr: "",
          replacements: {},
        });
        return {
          state: 1,
          msg: "获取成功",
          data: result.list,
          total: result.total,
        };
      }
    } catch (error) {
      this.app.CoreAPI.Log.trace("getFGKReasonInfo方法报错：" + error);
      return { state: 0, msg: "查询失败" };
    }
  }
  // 检测站版本号管理数据获取
  async getDetecionVersionInfo({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let param = JSON.parse(params);
      let where = ` 1=1`;
      let sql = ``;
      if (param.historyCode) where += ` and CodeValue='${param.historyCode}'`;
      if (param.historyCode) {
        sql = `select ID,equipmentVendor,CodeValue,StationCodeList,CurrentVersion,UpdateContent,UpdateTime,UploadPerson,UploadTime,Remark from DeviceSoftWareVesionInfo where${where}`;
      } else {
        sql = `SELECT *FROM(SELECT row_number() OVER(partition by CodeValue order by UpdateTime desc) as row_index,*FROM DeviceSoftWareVesionInfo)M where M.row_index=1`;
      }
      let result = await Raw.QueryPageData(sql, param.pageNum, param.pageSize, {
        orderstr: "UpdateTime desc",
        fieldstr: "",
        replacements: {},
      });
      let { list, total } = result;
      return { state: 1, msg: "获取成功", res: list, total: total };
    } catch (error) {
      this.app.CoreAPI.Log.trace("getDetecionVersionInfo方法报错：" + error);
      return { state: 0, msg: "查询失败" };
    }
  }
  // 新增或更新检测站版本号管理数据
  async addOrUpdateDetecionVersionData({ ID, params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let dataObj = {};
      for (let i in params) {
        if (i == "StationCodeList") {
          dataObj[i] = JSON.stringify(params[i]);
        } else {
          dataObj[i] = params[i];
        }
      }
      let UploadPerson = ctx.session.user.username;
      dataObj.UploadPerson = UploadPerson;
      let newDataObj = {};
      if (ID == undefined) {
        await Raw.Insert("DeviceSoftWareVesionInfo", { ...dataObj });
        let resID = await Raw.Query(
          `SELECT TOP(1) ID FROM DeviceSoftWareVesionInfo ORDER BY ID DESC`
        );
        newDataObj.LastSoftWareVersion = dataObj.CurrentVersion;
        newDataObj.LastSoftWareUpdateID = resID.ID;
        newDataObj.SoftWareFactoryName = dataObj.equipmentVendor;
        newDataObj.SoftWareVersionTime = dataObj.UpdateTime;
        let stationCodeList = JSON.parse(dataObj.StationCodeList);
        // stationCodeList.forEach(async (item) => {
        // 	await Raw.Update(
        // 		`SoftWareUpdateInfo`,
        // 		{ ...newDataObj },
        // 		{ wherestr: `where StationCode=:StationCode`, replacements: { StationCode: item } }
        // 	);
        // });

        for (let i = 0; i < stationCodeList.length; i++) {
          await Raw.Update(
            `SoftWareUpdateInfo`,
            { ...newDataObj },
            {
              wherestr: `where StationCode=:StationCode`,
              replacements: { StationCode: stationCodeList[i] },
            }
          );
        }
      } else {
        await Raw.Update(
          "DeviceSoftWareVesionInfo",
          { ...dataObj },
          { wherestr: "where ID=:ID", replacements: { ID: ID } }
        );
      }
      return { state: 1, msg: "操作成功" };
    } catch (error) {
      this.app.CoreAPI.Log.trace(
        "addOrUpdateDetecionVersionData方法报错：" + error
      );
      return { state: 0, msg: "操作失败" };
    }
  }
  //抽查业务查询
  async checkBusiness({ param }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let params = JSON.parse(param);
      let where = ` 1=1 `;
      if (params.formItem.VLPN)
        where += ` and Vlpn like '%${params.formItem.VLPN}%'`;
      if (params.formItem.VLPNColor)
        where += ` and Vlpncolor = '${params.formItem.VLPNColor}'`;
      if (params.formItem.VIN)
        where += ` and VIN like '%${params.formItem.VIN}%'`;
      if (params.formItem.InsReportAudit)
        where += ` and InsReportAudit = '${params.formItem.InsReportAudit}'`;
      if (params.formItem.InsProcessAudit)
        where += ` and InsProcessAudit = '${params.formItem.InsProcessAudit}'`;
      if (params.formItem.InsImgAudit)
        where += ` and InsImgAudit = '${params.formItem.InsImgAudit}'`;
      if (params.formItem.InsVideoAudit)
        where += ` and InsVideoAudit = '${params.formItem.InsVideoAudit}'`;
      if (params.formItem.InsBlackSmokeAudit)
        where += ` and InsBlackSmokeAudit = '${params.formItem.InsBlackSmokeAudit}'`;
      if (params.formItem.InsExternalAudti)
        where += ` and InsExternalAudti = '${params.formItem.InsExternalAudti}'`;
      let sqlsr = `select RingTestSpotCheckID,InspectionNum, VehicleID, VLPN, VIN, InsReportAuditReason,InsProcessAuditReason, InsImgAuditReason,InsVideoAuditReason, InsBlackSmokeAuditReason,InsExternalAudtiReason ,
            (select CodeName from CD_VLPNColor b where b.CodeValue=a.VLPNColor) as VLPNColor,
            (case InsReportAudit when '1' then '1' when '2' then '2' else '0' end) AS InsReportAudit, 
            (case InsProcessAudit when '1' then '1' when '2' then '2' else '0' end) AS InsProcessAudit, 
            (case InsImgAudit when '1' then '1' when '2' then '2' else '0' end) AS InsImgAudit, 
            (case InsVideoAudit when '1' then '1' when '2' then '2' else '0' end) AS InsVideoAudit, 
            (case InsBlackSmokeAudit when '1' then '1' when '2' then '2' else '0' end) AS InsBlackSmokeAudit,
            (case InsExternalAudti when '1' then '1' when '2' then '2' else '0' end) AS InsExternalAudti    
			from RingTestSpotCheck a where ${where}  `;
      let sqlsr1 = `select RingTestSpotCheckID,InspectionNum, VehicleID, VLPN, VIN, InsReportAuditReason,InsProcessAuditReason, InsImgAuditReason,InsVideoAuditReason, InsBlackSmokeAuditReason,InsExternalAudtiReason ,
            (select CodeName from CD_VLPNColor b where b.CodeValue=a.VLPNColor) as VLPNColor,
            (case InsReportAudit when '1' then '审核通过' when '2' then '审核不通过' else '未审核' end) AS InsReportAudit, 
            (case InsProcessAudit when '1' then '审核通过' when '2' then '审核不通过' else '未审核' end) AS InsProcessAudit, 
            (case InsImgAudit when '1' then '审核通过' when '2' then '审核不通过' else '未审核' end) AS InsImgAudit, 
            (case InsVideoAudit when '1' then '审核通过' when '2' then '审核不通过' else '未审核' end) AS InsVideoAudit, 
            (case InsBlackSmokeAudit when '1' then '审核通过' when '2' then '审核不通过' else '未审核' end) AS InsBlackSmokeAudit,
            (case InsExternalAudti when '1' then '审核通过' when '2' then '审核不通过' else '未审核' end) AS InsExternalAudti    
			from RingTestSpotCheck a where ${where}  `;
      let result = [];
      if (params.isAll) {
        let asc = ` order by  RingTestSpotCheckID asc`;
        result = await Raw.QueryList(sqlsr1 + asc);
        return { state: 1, msg: "获取成功", data: result };
      } else {
        result = await Raw.QueryPageData(
          sqlsr,
          params.pageIndex,
          params.pageSize,
          {
            orderstr: "RingTestSpotCheckID asc",
            fieldstr: "",
            replacements: {},
          }
        );
        return {
          state: 1,
          msg: "获取成功",
          data: result.list,
          total: result.total,
        };
      }
    } catch (error) {
      this.app.CoreAPI.Log.trace("checkBusiness方法报错：" + error);
      return { state: 0, msg: "操作失败" };
    }
  }
  async rowdatasearch({ param }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let params = JSON.parse(param);
      let where = ` 1=1 `;
      let sqlsr = ``;
      let sqlsr1 = ``;
      let sqlsr2 = ``;
      let sqlsr3 = ``;
      if (params.VehicleID) {
        where += ` and VehicleID = '${params.VehicleID}'`;
        sqlsr = `select * from vehicle where ${where}`;
        sqlsr1 = `select * from AppearanceInfo where ${where}`;
        sqlsr2 = `select * from WaitCheck where BusinessKey = '${params.RingTestSpotCheckID}' and BusinessTable = 'RingTestSpotCheck' `;
        sqlsr3 = `select ID,b.VLPN,b.VLPNColor,b.VehicleID,PicType,DisplayName,FullFileName,Bytes,IsPicAvailable from AppearanceInfo a left join ExteriorInspectionFile
				 b on a.AppearanceDataID = b.AppearanceDataID where b.VehicleID = '${params.VehicleID}' order by b.UploadTime desc`;
      }
      let result = await Raw.QueryList(sqlsr);
      let result1 = await Raw.QueryList(sqlsr1);
      let result2 = await Raw.Query(sqlsr2);
      let result3 = await Raw.QueryList(sqlsr3);
      return {
        state: 1,
        msg: "获取成功",
        data: result,
        AppearanceInfoData: result1,
        waitcheck: result2,
        imgFile: result3,
      };
    } catch (error) {
      this.app.CoreAPI.Log.trace("rowdatasearch方法报错：" + error);
      return { state: 0, msg: "操作失败" };
    }
  }
  async UpdateRingTestSpotCheck({ keyID, data }, { ctx, userid }) {
    //更新审核数据
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      await Raw.Update("RingTestSpotCheck", data, {
        wherestr: "where RingTestSpotCheckID=:RingTestSpotCheckID",
        replacements: {
          RingTestSpotCheckID: keyID,
        },
      });
      return { result: true, msg: "保存成功!", state: 200 };
    } catch (error) {
      this.ctx.logger.error(error);
      return { state: 0, msg: "保存失败！", result: false };
    }
  }
  // catch(error) {
  // 	this.app.CoreAPI.Log.trace('UpdateRingTestSpotCheck方法报错：' + error);
  // 	return { state: 0, msg: '操作失败' };
  // }
  // 获取车辆报备
  async getRecordCarDamage({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      params = JSON.parse(params);
      // const {VLPN, VIN} = params.param;
      let where = "where 1 = 1";
      let reqParam = {};
      // 权限筛选，先判断站点，站点存在取站点，不然判断区，再到市
      if (params.parame["station"] && params.parame["station"].length) {
        where += ` and StationCode in (:station)`;
        reqParam["station"] = params.parame["station"];
      } else if (params.parame["county"]) {
        where += ` and CountyCode = :county`;
        reqParam["county"] = params.parame["county"];
      } else if (params.parame["city"]) {
        where += ` and CityCode = :city`;
        reqParam["city"] = params.parame["city"];
      }
      for (let key in params.param) {
        if (params.param[key]) {
          where += ` and ${key} like :${key} `;
          reqParam[key] = `%${params.param[key]}%`;
        }
      }
      let result = await Raw.QueryPageData(
        `select * FROM RecordTSIInspect ${where}`,
        params.pageIndex,
        params.pageSize,
        {
          orderstr: "Rid desc",
          replacements: {
            ...reqParam,
          },
        }
      );
      return { result, state: 1 };
    } catch (error) {
      this.ctx.logger.error(error);
      return { state: 0 };
    }
  }
  // 添加车辆报备
  async addRecordCarDamage({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      params.data.NewspaperApplicant = ctx.User.username;
      params.data.ReportingTime = ctx.helper.dataFormat(
        new Date(),
        "yyyy-MM-dd hh:mm:ss"
      );
      let result = await Raw.Insert("RecordTSIInspect", params.data);
      return { result, state: 1 };
    } catch (error) {
      this.ctx.logger.error(error);
      return { state: 0 };
    }
  }
  // 获取车辆信息
  async getVehicleInfo({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      params = JSON.parse(params);
      // const {VLPN, VIN} = params.param;
      let where = "where 1 = 1";
      let reqParam = {};
      // 权限筛选，先判断站点，站点存在取站点，不然判断区，再到市
      for (let key in params.param) {
        if (params.param[key]) {
          where += ` and ${key} like :${key} `;
          reqParam[key] = `%${params.param[key]}%`;
        }
      }
      let result = await Raw.QueryPageData(
        `select OrgCode,vehicleID,VLPNType,VLPN,VLPNColor,VIN,IUVTYPE,FactoryPlateModel,
			VRDATE,ProductDate,FuelType,VML,GAVType,EngineRatedSpeed,EnginePower,EngineNum,IUETYPE,VehicleType,
			EmissionStandard,IUVMANU
			 FROM vehicle  ${where}`,
        params.pageIndex,
        params.pageSize,
        {
          orderstr: "vehicleID desc",
          replacements: {
            ...reqParam,
          },
        }
      );
      return { result, state: 1 };
    } catch (error) {
      this.ctx.logger.error(error);
      return { state: 0 };
    }
  }
  // 检测超标车
  async getCheckCarDetect({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      params = JSON.parse(params);
      // const {VLPN, VIN} = params.param;
      let where = "where 1 = 1";
      let reqParam = {};
      if (params.timeParams.start) {
        where += ` and checkTime >= :start`;
        reqParam["start"] = params.timeParams.start;
      }
      if (params.timeParams.end) {
        where += ` and checkTime <= :end`;
        reqParam["end"] = ctx.helper.dataFormat(
          params.timeParams.end,
          "yyyy-MM-dd 23:59:59"
        );
      }
      for (let key in params.param) {
        if (params.param[key]) {
          where += ` and ${key} like :${key} `;
          reqParam[key] = `%${params.param[key]}%`;
        }
      }
      let result = await Raw.QueryPageData(
        `select * FROM OverStandardModelInfo ${where}`,
        params.pageIndex,
        params.pageSize,
        {
          orderstr: "ID desc",
          replacements: {
            ...reqParam,
          },
        }
      );
      return { result, state: 1 };
    } catch (error) {
      this.ctx.logger.error(error);
      return { state: 0 };
    }
  }
  // 保存超标车信息
  // 检测超标车
  async saveOverInfo({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      params = params.param;
      let id = params.ID;
      delete params.ID;
      await Raw.Update("OverStandardModelInfo", params, {
        wherestr: "where id=:id", //where 条件
        replacements: {
          //参数化执行
          id: id,
        },
      });
      return { state: 1 };
    } catch (error) {
      this.ctx.logger.error(error);
      return { state: 0 };
    }
  }
  // 获取转入车
  async getVehicleMove({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      params = JSON.parse(params);
      // const {VLPN, VIN} = params.param;
      let where = "where 1 = 1";
      let reqParam = {};
      // 权限筛选，先判断站点，站点存在取站点，不然判断区，再到市
      for (let key in params.param) {
        if (
          key == "startAuditDate" &&
          params.param[key] &&
          params.param[key] != ""
        ) {
          where += ` and AuditDate >= :startAuditDate`;
          reqParam["startAuditDate"] = params.param[key];
        } else if (key == "likeValue" && params.param[key]) {
          where += ` and VLPN like :VLPN or Auditer like :Auditer`;
          reqParam["VLPN"] = "%" + params.param[key] + "%";
          reqParam["Auditer"] = "%" + params.param[key] + "%";
        } else if (
          key == "endAuditDate" &&
          params.param[key] &&
          params.param[key] != ""
        ) {
          where += ` and AuditDate <= :endAuditDate`;
          reqParam["endAuditDate"] =
            params.param[key].split(" ")[0] + " 23:59:59";
        } else if( key == "Status" && params.param[key] !== ""){
          if(params.param[key] == "01"){
             params.param[key] = "'01','02'";//因申请作废不是一个状态，是一个操作动作，因为在选择正常状态的时候，申请作废02也当作成正常状态
          }
          where += ` and ${key} in (` + params.param[key] + `) `;
          reqParam[key] = params.param[key];
        }else if (
          key == "VLPNColor" ||
          key == "EmissionStandard" ||
          key == "GAVType" ||
          (key == "ProductArea" && params.param[key] !== "") ||
          (key == "OutArea" && params.param[key] !== "") ||
          (key == "FuelType" && params.param[key])
        ) {
          where += ` and ${key} = :${key} `;
          reqParam[key] = params.param[key];
        } else if (
          key == "ProductDate" &&
          params.param[key] &&
          !params.param[key].includes("")
        ) {
          const ProductDate1 = params.param[key][0];
          const ProductDate2 = params.param[key][1];
          where += ` and ProductDate >= :ProductDate1 and ProductDate <= :ProductDate2`;
          reqParam["ProductDate1"] = ProductDate1;
          reqParam["ProductDate2"] = ProductDate2;
        } else if (params.param[key]) {
          where += ` and ${key} like :${key} `;
          reqParam[key] = `%${params.param[key]}%`;
        }
      }
      let result = await Raw.QueryPageData(
        `select *
			 FROM VehicleTransfer ${where}`,
        params.pageIndex,
        params.pageSize,
        {
          orderstr: "AuditDate desc",
          replacements: {
            ...reqParam,
          },
        }
      );
      return { result, state: 1 };
    } catch (error) {
      this.ctx.logger.error(error);
      return { state: 0 };
    }
  }
  // 获取转入车辆信息
  async getT_VehicleInfo({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      params = JSON.parse(params);
      // const {VLPN, VIN} = params.param;
      let where = "where 1 = 1";
      let reqParam = {};
      // 权限筛选，先判断站点，站点存在取站点，不然判断区，再到市
      for (let key in params.param) {
        if (params.param[key]) {
          where += ` and ${key} like :${key} `;
          reqParam[key] = `%${params.param[key]}%`;
        }
      }
      let result = await Raw.QueryPageData(
        `select ID,CLXH,CLMC,FDJXH,FDJSCC,MANUF,CLSB,FILENAME,PF,CLLB, FuelType
			 FROM T_vehicles ${where}`,
        params.pageIndex,
        params.pageSize,
        {
          orderstr: "ID desc",
          replacements: {
            ...reqParam,
          },
        }
      );
      return { result, state: 1 };
    } catch (error) {
      this.ctx.logger.error(error);
      return { state: 0 };
    }
  }
  // 添加转入车
  async addVehicleMove({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let dateTime = new Date();
      if (!params.param.TransferNo) {
        params.param.TransferNo = ctx.helper.dataFormat(
          dateTime,
          "yyyyMMddhhmmssS"
        );
        params.param.Status = "01";
      }
      params.param.AuditDate = `${ctx.helper.dataFormat(
        dateTime,
        "yyyy-MM-dd hh:mm:ss"
      )}`;
      params.param.Auditer = ctx.User.username;
      let ID = params.param.ID;
      let Remark = params.param.Remark;
      Raw.ExecWithTran(async (t) => {
        if (params.param.Invalid == 1) {
          // 申请作废操作
          await Raw.Update(
            "VehicleTransfer",
            { Status: "02", Remark },
            {
              wherestr: "where ID=:ID", //where 条件
              replacements: {
                //参数化执行
                ID,
              },
              transaction: t,
            }
          );
        } else if (params.param.Invalid == 2) {
          // 作废操作
          await Raw.Update(
            "VehicleTransfer",
            {
              Status: "03",
              Auditer: params.param.Auditer,
              AuditDate: params.param.AuditDate,
            },
            {
              wherestr: "where ID=:ID", //where 条件
              replacements: {
                //参数化执行
                ID,
              },
              transaction: t,
            }
          );
          let Verify = await Raw.Query(
            `select top 1 VerifyID from VTCancelVerify  where TransferNo = :TransferNo order by VerifyID desc`,
            {
              replacements: {
                //参数化执行
                TransferNo: params.param.TransferNo
              },
            }
          );
          if(Verify){//作废后需要将对应的审核信息更新
            await Raw.Update(
              "WaitCheck",
              {
                Status: "1",
                AuditState:"1",
                Checker: params.param.Auditer,
                CheckTime: params.param.AuditDate
              },
              {
                wherestr: "where BusinessKey=:ID and CheckType = '29'", //where 条件
                replacements: {
                  //参数化执行
                  ID:Verify.VerifyID
                },
                transaction: t,
              }
            );
          }
        } else {
          // 编辑操作
          let VehicleData = await Raw.Query(
            `select top 1 VehicleID,VLPN,VLPNColor from Vehicle where VLPN = :VLPN and VLPNColor = :VLPNColor and IsInValid = 0 order by VehicleID desc`,
            {
              replacements: {
                //参数化执行
                VLPN: params.param.VLPN,
                VLPNColor: params.param.VLPNColor,
              },
            }
          );
          if (!VehicleData) return { state: 2 };
          // 过滤没有的字段
          delete params.param.RowNum;
          delete params.param.ID;
          delete params.param._rowKey;
          delete params.param._index;
          await Raw.Update("VehicleTransfer", params.param, {
            wherestr: "where ID=:ID", //where 条件
            replacements: {
              //参数化执行
              ID,
            },
            transaction: t,
          });
          // 过滤车辆表没有的字段
          let {
            VIN,
            EmissionStandard,
            IUVTYPE,
            RatedSeats,
            FactoryPlateModel,
            VML,
            FuelType,
            IUVMANU,
            ProductDate,
            GAVType,
            OwnerName,
            Tel,
            CredentialsType,
            CredentialsNum,
            Address,
            BZTYPE,
            Remarks,
          } = params.param;
          await Raw.Update(
            "vehicle",
            {
              VIN,
              EmissionStandard,
              IUVTYPE,
              RatedSeats,
              FactoryPlateModel,
              VML,
              FuelType,
              IUVMANU,
              ProductDate,
              GAVType,
              OwnerName,
              Tel,
              CredentialsType,
              CredentialsNum,
              Address,
              BZTYPE,
              Remarks,
            },
            {
              wherestr: "where VehicleID=:VehicleID", //where 条件
              replacements: {
                //参数化执行
                VehicleID: VehicleData.VehicleID,
              },
              transaction: t,
            }
          );
        }
      });

      let result = await Raw.Query(
        "select top 1 * from VehicleTransfer where TransferNo = :TransferNo",
        {
          replacements: {
            //参数化执行
            TransferNo: params.param.TransferNo,
          },
        }
      );
      return { state: 1, result };
    } catch (error) {
      this.ctx.logger.error(error);
      return { state: 0 };
    }
  }
  // 编辑转入车
  async UploadVehicleMove({ }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let params = {}; // 参数
      const stream = await this.ctx.getFileStream();
      // 写入文件路径
      let baseDir = await app.redis
        .get("hj")
        .hget("systemconfig", "01_UploadFolder");
      if (!baseDir) {
        const result = await Raw.Query(
          `select FieldValue from Sys_Config where FieldKey='UploadFolder'`,
          {
            replacements: {},
          }
        );
        if (result && result.FieldValue && result.FieldValue != "")
          baseDir = result.FieldValue;
        else baseDir = "C:/VIMUploadFiles/";
      } //保存的路径
      let nowTime = new Date().getTime();
      let filename = stream.filename; //文件名称
      params.FileExtension = stream.filename.substring(
        stream.filename.indexOf(".")
      );
      filename =
        filename.substr(0, filename.lastIndexOf(".")) +
        nowTime +
        params.FileExtension;
      const url = path.join(baseDir, "VehicleTransfer/");
      // 2.保存路径是否存在,不存在则逐级创建目录
      if (!fs.existsSync(url)) {
        url.split(path.sep).reduce((currentPath, folder) => {
          currentPath += folder + path.sep;
          if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
          }
          return currentPath;
        }, "");
      }
      const savepath = path.join(url, filename);
      const writeStream = fs.createWriteStream(savepath);
      await awaitWriteStream(stream.pipe(writeStream));
      params.Bytes = Buffer.from(fs.readFileSync(savepath)); //转字节
      if (stream.fields.fileType == 0) {
        params.DisplayName = "身份证";
        params.FileBusinessType = 14;
      } else if (stream.fields.fileType == 1) {
        params.DisplayName = "合格证";
        params.FileBusinessType = 15;
      } else if (stream.fields.fileType == 2) {
        params.DisplayName = "报告单";
        params.FileBusinessType = 16;
      } else if (stream.fields.fileType == 3) {
        params.DisplayName = "报告单";
        params.FileBusinessType = 17;
      }

      (params.FullFileName = `bsFile/VehicleTransfer/${filename}`),
        (params.UploadPerson = ctx.User.username);
      params.UploadTime = `${ctx.helper.dataFormat(
        new Date(),
        "yyyy-MM-dd hh:mm:ss:S"
      )}`;
      params.FileBusinessGroup = 21;
      params.BusinessAuditID = stream.fields.TransferNo;
      params.VehicleID = stream.fields.VehicleID;

      await Raw.Insert("BusinessFileInfo", params);
      return { msg: "文件上传成功!", success: true };
    } catch (error) {
      this.ctx.logger.error(error);
      return { state: 0 };
    }
  }
  // 获取转入车图片
  async getVehicleTransferPicture({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      params = JSON.parse(params);
      let result = await Raw.QueryList(
        `
			select DisplayName,BusinessAuditID,ID,FullFileName,Bytes FROM BusinessFileInfo where BusinessAuditID=:BusinessAuditID`,
        {
          orderstr: "ID desc",
          replacements: {
            BusinessAuditID: params.BusinessAuditID,
          },
        }
      );
      return { result, state: 1 };
    } catch (error) {
      this.ctx.logger.error(error);
      return { state: 0 };
    }
  }
  // 删除转入车图片
  async deleteVehicleTransferPicture({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;

      await Raw.Delete("BusinessFileInfo", {
        wherestr: "where ID=:ID", //where 条件
        replacements: {
          //参数化执行
          ID: params.ID,
        },
      });
      return { state: 1 };
    } catch (error) {
      this.ctx.logger.error(error);
      return { state: 0 };
    }
  }
  async getApplyPrintData({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { Raw } = app.Dbs.hj;
      params = JSON.parse(params);
      let where = `where 1=1`;
      let keyword = {};
      let data;
      if (params.keyword.VLPN) {
        where += " and VLPN like :VLPN";
        keyword.VLPN = `%${params.keyword.VLPN}%`;
      }
      if (params.keyword.applyTime[0] || params.keyword.applyTime[1]) {
        where += ` and ApplyTime>='${this.ctx.helper.dataFormat(
          params.keyword.applyTime[0],
          "yyyy-MM-dd"
        )}' and ApplyTime<='${this.ctx.helper.dataFormat(
          params.keyword.applyTime[1],
          "yyyy-MM-dd"
        )}'`;
      }
      let sql = `select VLPN,VLPNColor,VIN,IUTYPE,InspectionDataId,InspectionNum,InspectionNature,VDCT,ApplyPerson,ApplyTime,IsObviousSmoke,Remarks,DetectEndTime from ApplyPrintByAuditSmoke ${where}`;
      data = await Raw.QueryPageData(sql, params.currentPage, params.pageSize, {
        orderstr: "DetectEndTime desc",
        replacements: {
          ...keyword,
        },
      });
      return {
        state: 1,
        msg: "获取数据成功",
        data,
      };
    } catch (error) {
      this.app.CoreAPI.Log.error(error);
      return { state: 0 };
    }
  }

  async checkStationFileUpload({ }, { ctx, userid }) {
    try {
      const { app } = this;
      const { Raw } = app.Dbs.hj;
      const redis = app.redis.get("hj");
      // 初始化文件详细信息
      let fileData = {};

      let stream = await this.ctx.getFileStream();
      let filePath = await redis.hget("systemconfig", "01_UploadFolder");
      // let filePath = "D:/VIMUploadFiles/";

      // 上传时携带的参数
      fileData.FileName = stream.filename;
      fileData.DisplayName = stream.filename.substring(
        0,
        stream.filename.indexOf(".")
      );

      let now = new Date();
      let tempPath =
        "" +
        now.getFullYear() +
        (now.getMonth() + 1).toString().padStart(2, 0) +
        now.getDate().toString().padStart(2, 0);
      const targets = path.join("", filePath + `CheckStation/${tempPath}/`);
      // 保存路径是否存在,不存在则逐级创建目录
      if (!fs.existsSync(targets)) {
        targets.split(path.sep).reduce((currentPath, folder) => {
          currentPath += folder + path.sep;
          if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
          }
          return currentPath;
        }, "");
      }
      let uniqueFileName = `${Date.now()}_${stream.filename}`;
      // 保存文件
      const savePath = path.join(targets, uniqueFileName);
      const writeStream = fs.createWriteStream(savePath);
      await awaitWriteStream(stream.pipe(writeStream));
      fileData.FullFileName = path.join(
        this.config.imgPath,
        `CheckStation/${tempPath}/${uniqueFileName}`
      );
      fileData.UploadTime = now;
      fileData.UploadPerson = ctx.User.username;

      return {
        code: 1,
        msg: "文件上传成功！",
        data: fileData,
      };
    } catch (error) {
      this.app.CoreAPI.Log.trace("checkStationFileUpload方法报错：" + error);
      return { code: 0, msg: "文件上传失败！", error };
    }
  }

  async getCheckStationInfo({ param, page, type }, { ctx, userid }) {
    try {
      const { app } = this;
      const { Raw } = app.Dbs.hj;
      let where = "where 1=1";
      let reqParam = {};
      let res = await ctx.service.hj.commonService.GetAreaRole();
      let areaRole = res.data; //获取行政区域
      // 判断是否有行政区域权限
      if (!this.ctx.User.isAdmin && areaRole.length === 0) {
        return { code: 0, data: [], msg: "没有行政区域权限" };
      } else if (!this.ctx.User.isAdmin && areaRole.length > 0) {
        let paramArr = [];
        areaRole.forEach((area, index) => {
          reqParam[`areaRole${index}`] = area + "%";
          paramArr.push(`StationCode like :areaRole${index}`);
        });
        where += " and (" + paramArr.join(" or ") + " )";
      }
      if (type === "page") {
        param = JSON.parse(param);
        page = JSON.parse(page);
        // 过滤参数
        for (let key in param) {
          if (param[key]) {
            where += ` and ${key}=:${key}`;
            reqParam[key] = param[key];
          }
        }
        let sql = `select * from CheckStation ${where}`;
        let result = await Raw.QueryPageData(
          sql,
          page.currentPage,
          page.pageSize,
          {
            orderstr: "CheckTime asc",
            replacements: reqParam,
          }
        );
        return { code: 1, msg: "获取站点检查记录数据成功！", param, result };
      } else if (type === "all") {
        let sql = `select row_number() over(order by CheckTime) RowNumber,* from CheckStation ${where} order by CheckTime asc`;
        console.log(sql);
        let result = await Raw.QueryList(sql, {
          replacements: reqParam,
        });
        return { code: 1, msg: "获取站点检查记录数据成功！", param, result };
      }
    } catch (error) {
      this.app.CoreAPI.Log.trace("getCheckStationInfo方法报错：" + error);
      return { code: 0, msg: "获取站点检查记录数据失败！", error };
    }
  }

  async getCheckStationFileInfo({ CheckStationID }, { ctx, userid }) {
    try {
      const { app } = this;
      const { Raw } = app.Dbs.hj;
      let files = await Raw.QueryList(
        "select * from CheckStation_UploadFile where CheckStationID=:CheckStationID",
        {
          replacements: {
            CheckStationID: CheckStationID,
          },
        }
      );
      files.forEach((item) => {
        let fileExt = /\.[a-zA-Z]+$/.exec(item.FullFileName);
        let fileName = item.DisplayName + fileExt;
        item["FileName"] = fileName;
      });

      return {
        code: 1,
        msg: "获取当前检查记录的附件信息成功！",
        files,
      };
    } catch (error) {
      this.app.CoreAPI.Log.trace("getCheckStationFileInfo方法报错：" + error);
      return { code: 0, msg: "获取当前检查记录的附件信息失败！", error };
    }
  }

  async delCheckStationFile({ ID }, { ctx, userid }) {
    try {
      const { app } = this;
      const { Raw } = app.Dbs.hj;
      //删除数据
      await Raw.Delete("CheckStation_UploadFile", {
        wherestr: "where ID=:ID", //where 条件
        replacements: {
          //参数化执行
          ID: ID,
        },
      });
      return { code: 1, msg: "删除成功！" };
    } catch (error) {
      this.app.CoreAPI.Log.trace("delCheckStationFile方法报错：" + error);
      return { code: 0, msg: "删除失败！", error };
    }
  }

  async saveCheckStationInfo(
    { baseInfo, fileInfo, delFilesID },
    { ctx, userid }
  ) {
    try {
      const { app } = this;
      const { transaction, Raw } = app.Dbs.hj;
      let baseInfoParam = {};
      let fileInfoParam = [];
      let newID; // 存放新增数据时，检查记录ID，用于数据关联
      // 过滤基本信息的参数
      for (let key in baseInfo) {
        if (key === "Year" && baseInfo.Year) {
          baseInfoParam.Year = baseInfo.Year.slice(0, 4);
        } else if (
          key !== "RowNum" &&
          key !== "_index" &&
          key !== "_rowKey" &&
          key !== "ID" &&
          baseInfo[key]
        ) {
          baseInfoParam[key] = baseInfo[key];
        }
      }

      // 1. 首先保存基本信息
      baseInfoParam["UploadTime"] = new Date();
      baseInfoParam["UploadPerson"] = userid;
      if (baseInfo.ID) {
        // 更新数据
        await Raw.Update("CheckStation", baseInfoParam, {
          wherestr: "where ID=:ID", //where 条件
          replacements: {
            //参数化执行
            ID: baseInfo.ID,
          },
        });
        newID = baseInfo.ID;
      } else {
        // 新增数据
        await Raw.Insert("CheckStation", baseInfoParam);
        let newData = await Raw.Query(
          "select top 1 ID from CheckStation order by ID desc"
        );
        newID = newData.ID;
      }
      // 2. 保存文件信息
      // 过滤处理文件信息的参数
      fileInfo.forEach((item) => {
        if (!item.ID) {
          delete item.FileName;
          delete item.fileIcon;
          delete item.typeName;
          item.checkStationID = newID;
          item.StationCode = baseInfo.StationCode;
          fileInfoParam.push(item);
        }
      });
      try {
        await Raw.ExecWithTran(async (t) => {
          if (fileInfoParam.length > 0) {
            await Raw.InsertList("CheckStation_UploadFile", fileInfoParam);
          }
          if (delFilesID.length > 0) {
            delFilesID.forEach(async (item) => {
              await Raw.Delete("CheckStation_UploadFile", {
                wherestr: "where ID=:ID",
                replacements: {
                  //参数化执行
                  ID: item,
                },
              });
            });
          }
        });
      } catch (error) {
        return { code: 0, msg: "文件信息保存失败！", error };
      }
      return { code: 1, msg: "数据保存成功！" };
    } catch (error) {
      this.app.CoreAPI.Log.trace("saveCheckStationInfo方法报错：" + error);
      return { code: 0, msg: "数据保存失败！", error };
    }
  }

  // 新增或修改联网数据
  async addOrUpdateInternetData({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let ID = params.ID;
      if (ID) {
        delete params.ID;
        await Raw.Update(
          "ConectToInternetData",
          { ...params },
          {
            wherestr: "where ID=:ID",
            replacements: { ID: ID },
          }
        );
      } else {
        await Raw.Insert("ConectToInternetData", { ...params });
      }
      return { state: 1, msg: "操作成功" };
    } catch (error) {
      ctx.logger.error(error);
      return { state: 0, msg: "操作失败" };
    }
  }
  // 获取联网数据
  async getInternetData({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      params = JSON.parse(params);
      let { pageNum, pageSize, formValidata } = params;
      let {
        CityCode,
        AreaCode,
        StationCode,
        InternetType,
        CurrentState,
        ApplyDate,
        InspectDate,
      } = formValidata;
      let where = ` where 1=1`;
      for (let i in formValidata) {
        if (formValidata[i] && i !== "StationCode") {
          where += ` and ${i}=:${i}`;
        } else if (formValidata[i].length) {
          where += ` and ${i} in (:${i})`;
        }
      }
      let res = await Raw.QueryPageData(
        `select * FROM ConectToInternetData${where}`,
        pageNum,
        pageSize,
        {
          orderstr: "ID asc",
          fieldstr: "",
          replacements: {
            CityCode,
            AreaCode,
            StationCode,
            InternetType,
            CurrentState,
            ApplyDate,
            InspectDate,
          },
        }
      );
      let { list, total } = res;

      let fileList = [];
      let IDList = list.map((p) => {
        return p.ID;
      });
      let baseDir = await app.redis
        .get("hj")
        .hget("systemconfig", "01_UploadFolder");
      if (!baseDir) {
        fileList = await Raw.QueryList(
          `select FieldValue from Sys_Config where FieldKey='UploadFolder'`,
          {
            replacements: {},
          }
        );
        if (fileList && fileList.FieldValue && fileList.FieldValue != "") {
          baseDir = fileList.FieldValue;
        }
      } else {
        for (let i = 0; i < IDList.length; i++) {
          let id = IDList[i];
          let listInfo = await Raw.QueryList(
            `select FileID,InternetDataID,FullFileName from ConectInternet_UploadFile where InternetDataID='${id}'`
          );
          fileList = fileList.concat(listInfo);
        }
      }
      return { state: 1, msg: "操作成功", list, total, fileList };
    } catch (error) {
      ctx.logger.error(error);
      return { state: 0, msg: "操作失败" };
    }
  }
  // 上传联网记录文件
  async uploadInternetFile({ }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let stream = await this.ctx.getFileStream();
      let IDobj = await Raw.Query(
        "SELECT top(1) * FROM ConectToInternetData ORDER BY ID DESC"
      );
      let stationObj = await Raw.Query(
        `SELECT stationName,ConectToInternetData.stationCode as stationCode FROM ConectToInternetData LEFT JOIN StationInfo ON ConectToInternetData.StationCode=StationInfo.StationCode WHERE ID='${IDobj.ID}'`
      );
      // 保存到本地物理路径
      let baseDir = await app.redis
        .get("hj")
        .hget("systemconfig", "01_UploadFolder");
      if (!baseDir) {
        const result = await Raw.Query(
          `select FieldValue from Sys_Config where FieldKey='UploadFolder'`,
          {
            replacements: {},
          }
        );
        if (result && result.FieldValue && result.FieldValue != "")
          baseDir = result.FieldValue;
        else
          baseDir = `C:/VIMUploadFiles/internetRecordFile/${stationObj.stationCode}/`;
      }
      let filename = stream.filename;
      const targets = path.join(
        baseDir,
        `internetRecordFile/${stationObj.stationCode}/`
      );
      if (!fs.existsSync(targets)) {
        targets.split(path.sep).reduce((currentPath, newpath) => {
          currentPath += newpath + path.sep;
          if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
          }
          return currentPath;
        }, "");
      }
      const savepath = path.join(targets, filename);
      const writeStream = fs.createWriteStream(savepath);
      await awaitWriteStream(stream.pipe(writeStream));
      // 保存到数据库

      let time = await Raw.Query(
        `SELECT ApplyDate FROM ConectToInternetData WHERE ID='${IDobj.ID}'`
      );
      let FileExension = stream.filename
        .substring(stream.filename.lastIndexOf("."))
        .trim();
      let InternetDataID;
      if (stream.fields.id == "-1") {
        InternetDataID = IDobj.ID;
      } else {
        InternetDataID = Number(stream.fields.id);
      }

      let FullFileName =
        `bsFile/internetRecordFile/${stationObj.stationCode}/` + filename;

      await Raw.Insert("ConectInternet_UploadFile", {
        InternetDataID: InternetDataID,
        StationCode: stationObj.stationCode,
        FullFileName: FullFileName,
        DisplayName: stationObj.stationName,
        FileExension: FileExension,
        UploadPerson: ctx.session.user.username,
        UploadTime: time.ApplyDate,
      });

      return { state: 1, msg: "文件上传成功" };
    } catch (error) {
      ctx.logger.error(error);
      return { state: 0, msg: "文件上传失败" };
    }
  }
  // 删除或更新联网记录文件
  async delOrUpdateInternetFile(
    { delids, updateNum, punishId },
    { ctx, userid }
  ) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let idObjList = await Raw.QueryList(
        `SELECT TOP(${updateNum}) FileID FROM ConectInternet_UploadFile ORDER BY FileID DESC`
      );
      if (idObjList.length) {
        for (let i = 0; i < idObjList.length; i++) {
          let newID = idObjList[i].FileID;
          // await Raw.Update(`UPDATE BusinessFileInfo SET BusinessAuditID = '${punishId}' WHERE ID='${newID}'`)
          await Raw.Update(
            "ConectInternet_UploadFile",
            { InternetDataID: `${punishId}` },
            {
              wherestr: "where FileID=:FileID",
              replacements: { FileID: newID },
            }
          );
        }
      }
      if (delids.length) {
        for (let i = 0; i < delids.length; i++) {
          await Raw.Delete("ConectInternet_UploadFile", {
            wherestr: "where FileID=:FileID",
            replacements: {
              FileID: delids[i],
            },
          });
        }
      }

      return { state: 1, msg: "操作成功" };
    } catch (error) {
      ctx.logger.error(error);
      return { state: 0, msg: "操作失败" };
    }
  }
  // 检测站版本号管理数据获取
  async getDetailDetecionVersionInfo({ params }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      // let param = JSON.parse(params);
      // console.log(params);
      let sql = ``;
      sql = `SELECT stationcode,SoftWareVersion from SoftWareUpdateInfo WHERE lastsoftwareupdateid=
		  '${params}'`;
      let result = await Raw.QueryList(sql);
      return { state: 1, msg: "获取成功", res: result };
    } catch (error) {
      this.app.CoreAPI.Log.trace("getDetecionVersionInfo方法报错：" + error);
      return { state: 0, msg: "查询失败" };
    }
  }
  // 多受理审核修改获取数据
  async geMutiAcceptanceAuditDate({ param }, { ctx, userid }) {
    try {
      param = JSON.parse(param);
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let reqParam = {};
      let where = "  where 1=1";
      const page = (param.currentPage - 1) * param.pageSize;
      if (param.pageSize) {
        reqParam.pageSize = param.pageSize;
        reqParam.RowNumber = page;
      } else {
        reqParam.pageSize = 20;
        reqParam.RowNumber = 0;
      }
      // 判断登录人员负责的站点
      let cuser=this.ctx.helper.getCurrentUser();
      let stationCode = cuser['userOrg']
      if(stationCode){
          where += ` and StationCode = ${stationCode}`;
      }
      if (param.AcceptanceDate1 && param.AcceptanceDate2) {
        where += ` and AcceptanceDate>=:AcceptanceDate1 and AcceptanceDate<=:AcceptanceDate2`;
        reqParam.AcceptanceDate1 = param.AcceptanceDate1;
        reqParam.AcceptanceDate2 = param.AcceptanceDate2;
      }
      if (param.VIN && !param.VLPN) {
        reqParam.VIN = param.VIN;
        where += ` and VIN like '%${param.VIN}%'`;
      }
      if (!param.VIN && param.VLPN) {
        reqParam.VLPN = param.VLPN;
        where += ` and VLPN like '%${param.VLPN}%'`;
      }
      if (param.VIN && param.VLPN) {
        reqParam.VIN = param.VIN;
        reqParam.VLPN = param.VLPN;
        where += ` and VIN like '%${param.VIN}%'`;
        where += ` or VLPN like '%${param.VLPN}%'`;
      }
      const result = await Raw.QueryList(
        `select  TOP (:pageSize) * from (select ROW_NUMBER() OVER (ORDER BY AcceptanceDate desc) as RowNumber,* from  MutiAcceptanceAudit ${where} ) MutiAcceptanceAudit where RowNumber > :RowNumber`,
        {
          replacements: reqParam,
        }
      );
      const count = await Raw.Query(
        `select count(*) as zs from MutiAcceptanceAudit ${where}`,
        {
          replacements: reqParam,
        }
      );
      return { state: 1, result, count: count.zs };
    } catch (error) {
      this.ctx.logger.error(error);
      return { state: 0 };
    }
  }
  //多受理审核修改-再次检测时间间隔
  async editMutiAcceptanceAuditHowLongTimes(
    { HowLongTimes, AcceptanceDate, AcceptanceAuditID },
    { ctx, userid }
  ) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      if (!AcceptanceDate) {
        return { state: 0, msg: "受理日期为空,多受理审核修改时间间隔失败！" };
      }
      const IsOkAcceptanceDate = new Date(
        Date.parse(AcceptanceDate) + HowLongTimes * 60 * 60 * 1000
      );
      await Raw.Update(
        "MutiAcceptanceAudit",
        { HowLongTimes: HowLongTimes, IsOkAcceptanceDate: IsOkAcceptanceDate },
        {
          wherestr: "where AcceptanceAuditID=:AcceptanceAuditID",
          replacements: {
            AcceptanceAuditID: AcceptanceAuditID,
          },
        }
      );
      return { state: 1, msg: "修改成功！" };
    } catch (error) {
      ctx.logger.error(error);
    }
  }

  // 摩托车数据接入
  async getMotorInspectionData({ param, page, type }, { ctx, userid }) {
    try {
      const { app } = this;
      const { Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      // 过滤处理查询参数
      let where = "where 1=1";
      let reqParam = {};
      for (let key in param) {
        if (key == "DetectTime" && param.DetectTime != "") {
          if (param.DetectTime[0] && param.DetectTime[1]) {
            where +=
              " and DetectStartTime>=:DetectStartTime and DetectStartTime<=:DetectEndTime";
            reqParam.DetectStartTime = param.DetectTime[0];
            reqParam.DetectEndTime =
              param.DetectTime[1].slice(0, 10) + " 23:59:59";
          }
        } else if (key == "VDCT" && param.VDCT !== null && param.VDCT !== "") {
          where += " and VDCT=:VDCT";
          reqParam.VDCT = param.VDCT;
        } else {
          if (param[key]) {
            where += " and " + key + " like :" + key;
            reqParam[key] = "%" + param[key] + "%";
          }
        }
      }
      if (type == "page") {
        page = JSON.parse(page);
        let { list, total } = await Raw.QueryPageData(
          `select * from Motorcycle ${where}`,
          page.pageNum,
          page.pageSize,
          {
            orderstr: "CityCode,CountyCode,DetectStartTime asc",
            replacements: reqParam,
          }
        );
        return { code: 1, msg: "摩托车数据查询成功", data: { list, total } };
      } else {
        let data = await Raw.QueryList(`select * from Motorcycle ${where}`, {
          replacements: reqParam,
        });
        return { code: 1, msg: "摩托车数据查询成功", data };
      }
    } catch (error) {
      this.app.CoreAPI.Log.trace("getMotorInspectionData方法报错：" + error);
      return { code: 0, msg: "数据查询失败" };
    }
  }

  //   获取检测站计分CD表
  async getCDScore() {
    const { app } = this;
    const { Raw } = app.Dbs.hj;
    try {
      const result = await Raw.QueryList(`select * from CD_Score`);
      return { code: 1, msg: "请求成功!", data: result };
    } catch (error) {
      this.app.CoreAPI.Log.trace("getCDScore方法报错：" + error);
      return { code: 0, msg: "请求失败" };
    }
  }

  //   获取检测站计分表
  async getStationScore({ params }) {
    const { app } = this;
    const { Raw } = app.Dbs.hj;
    try {
      let where = "1=1";
      params = JSON.parse(params);
      console.log(params);
      let {
        StationCode,
        recordTime1,
        recordTime2,
        pageIndex,
        pageSize,
        CountyCode,
        CityCode,
      } = params;
      if (StationCode) where += ` and StationCode = '${StationCode}'`;
      if (CountyCode) where += ` and CountyCode = '${CountyCode}'`;
      if (CityCode) where += ` and CityCode like '%${CityCode}%'`;
      if (recordTime1 && recordTime2)
        where += ` and RecordTime between '${recordTime1}' and '${recordTime2}'`;
      let sql = `select * from StationScore where ${where}`;
      let result = await Raw.QueryPageData(sql, pageIndex, pageSize, {
        orderstr: "ID DESC",
      });
      let dataList = await Raw.QueryList(`select * from StationScore`);
      return { code: 1, msg: "请求成功!", data: result, dataList: dataList };
    } catch (error) {
      this.app.CoreAPI.Log.trace("getStationScore方法报错：" + error);
      return { code: 0, msg: "请求失败" };
    }
  }

  // 保存检测站记分管理数据
  async saveStationScoreData(params) {
    try {
      let { app, ctx } = this;
      let { Raw } = app.Dbs.hj;
      const { rowData, ID, StopStationRemark } = params;
      if (ID) {
        if (StopStationRemark) {
          await Raw.Update(
            "StationScore",
            { StopStationRemark: StopStationRemark, StationStatus: "暂停" },
            {
              wherestr: "where ID=:ID", //where 条件
              replacements: {
                ID: ID,
              },
            }
          );
          return { state: 1, msg: "保存成功!" };
        } else {
          await Raw.Update(
            "StationScore",
            { RecordTotalScore: 0, RecordItem: JSON.stringify([]) },
            {
              wherestr: "where ID=:ID", //where 条件
              replacements: {
                ID: ID,
              },
            }
          );
          return { state: 1, msg: "保存成功!" };
        }
      } else {
        if (rowData.editData) {
          let uID = rowData.ID;
          delete rowData.ID;
          delete rowData.RowNum;
          delete rowData.editData;
          rowData.RecordItem = JSON.stringify(rowData.RecordItem);
          let exitData = await Raw.QueryList(
            `select count(1) as total from StationScore where StationCode = '${rowData.StationCode}' and ID != ${uID}`
          );
          // 点位是否已存在
          if (exitData[0].total) {
            return { state: 2, msg: "点位已存在!" };
          }
          await Raw.Update("StationScore", rowData, {
            wherestr: "where ID=:uID", //where 条件
            replacements: {
              uID: uID,
            },
          });
          return { state: 1, msg: "保存成功!" };
        } else {
          let exitData = await Raw.QueryList(
            `select count(1) as total from StationScore where StationCode = '${rowData.StationCode}'`
          );
          // 点位是否已存在
          if (exitData[0].total) {
            return { state: 2, msg: "点位已存在!" };
          }
          rowData.RecordItem = JSON.stringify(rowData.RecordItem);
          rowData.StationStatus = "正常";
          delete rowData.maxID; // 删除多余的属性
          rowData.RecordPerson = ctx.User.username;
          await Raw.Insert("StationScore", rowData);
          return { state: 1, msg: "请求成功!" };
        }
      }
    } catch (error) {
      this.app.CoreAPI.Log.trace("saveStationScoreData方法报错：" + error);
      return { code: 0, msg: "请求失败" };
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

  // 新车车型分析
  async getNewCarAnalysisData({ params }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let where = ` 1=1 `;
      let data;
      params = JSON.parse(params);
      if (params.VehicleType)
        where += ` and VehicleType='${params.VehicleType}'`;
      if (params.timePeriod.length && params.timePeriod[0] !== "")
        where += ` and PRODUCTDATE between '${params.timePeriod[0]}' and '${params.timePeriod[1]}'`;
      if (params.isAll) {
        let sqls = `select AVG(NOX80) as nox,EmissionStandard,count(1) as total,VehicleType from inspectiondata a 
            left join LDData b on a.InspectionDataID = b.InspectionDataID
            where ${where} and VehicleType is not null and EmissionStandard is not null
            group by EmissionStandard,vehiclekind,VehicleType`;
        data = await Raw.QueryList(sqls, {
          orderstr: "VehicleType",
        });
      } else {
        let sqls = `select AVG(NOX80) as nox,EmissionStandard,count(1) as total,VehicleType from inspectiondata a 
          left join LDData b on a.InspectionDataID = b.InspectionDataID
          where ${where} and VehicleType is not null and EmissionStandard is not null
          group by EmissionStandard,vehiclekind,VehicleType`;
        data = await Raw.QueryPageData(sqls, params.pageNum, params.pageSize, {
          orderstr: "VehicleType",
        });
      }

      return { state: 1, data, msg: "查询成功！" };
    } catch (error) {
      return { state: 0, msg: "查询失败！", error };
    }
  }

  //  单独海康威视视频查看
  async getAllCameraInfo({ AreaCode, isPro }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let data = [];
      let CityList, CityCodelist, CountyList, StationList;
      // isPro 1为省级 2为市级
      if (isPro == "1") {
        // 获取各地市信息
        CityList = await Raw.QueryList(
          `select AreaCode,AreaName,ParentAreaCode from Area where ParentAreaCode='${AreaCode}'`
        );
        // 拿到地市下各区的区域编号
        CityCodelist = CityList.map((v) => {
          return v.AreaCode;
        });
        // 区域信息
        CountyList = await Raw.QueryList(
          `select AreaCode,AreaName,ParentAreaCode from Area where ParentAreaCode in (:CityCodelist)`,
          {
            replacements: {
              //参数化执行
              CityCodelist,
            },
          }
        );
        // 站点列表
        StationList = await Raw.QueryList(
          `select StationName,StationCode,CountyCode from stationinfo where CityCode in (:CityCodelist)`,
          {
            replacements: {
              //参数化执行
              CityCodelist,
            },
          }
        );
      } else if (isPro == "2") {
        // 获取各地市信息
        CityList = await Raw.QueryList(
          `select AreaCode,AreaName,ParentAreaCode from Area where AreaCode='${AreaCode}'`
        );
        // 区域信息
        CountyList = await Raw.QueryList(
          `select AreaCode,AreaName,ParentAreaCode from Area where ParentAreaCode='${AreaCode}'`
        );
        // 站点列表
        StationList = await Raw.QueryList(
          `select StationName,StationCode,CountyCode from stationinfo where CityCode='${AreaCode}'`
        );
      }
      let StationCodeList = StationList.map((v) => {
        return v.StationCode;
      });
      // 硬盘录像机列表
      let DVRList = await Raw.QueryList(
        `select * from DVRInfo where StationCode in (:StationCodeList)`,
        {
          replacements: {
            StationCodeList,
          },
        }
      );
      // 摄像头列表
      let CamList = await Raw.QueryList(
        `select * from Cameras where StationCode in (:StationCodeList)`,
        {
          replacements: {
            StationCodeList,
          },
        }
      );
      StationList.forEach((v) => {
        v.DVRInfo = [];
        v.CamInfo = [];
        DVRList.forEach((j) => {
          if (j.StationCode == v.StationCode) {
            v.DVRInfo.push(j);
          }
        });
        CamList.forEach((k) => {
          if (k.StationCode == v.StationCode) {
            v.CamInfo.push(k);
          }
        });
      });
      CountyList.forEach((v) => {
        v.StaionInfo = [];
        StationList.forEach((j) => {
          if (v.AreaCode == j.CountyCode) {
            v.StaionInfo.push(j);
          }
        });
      });

      CityList.forEach((v) => {
        v.CountyInfo = [];
        CountyList.forEach((j) => {
          if (j.ParentAreaCode == v.AreaCode) {
            v.CountyInfo.push(j);
          }
        });
        let a = {};
        a.CityName = v.AreaName;
        a.CountyInfo = v.CountyInfo;
        data.push(a);
      });
      return { state: 1, data, msg: "查询成功！" };
    } catch (error) {
      return { state: 0, msg: "查询失败！", error };
    }
  }

  // 检测站上报率
  async getStationReportData({ param, pageNum, pageSize }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      let where = ` 1=1 `;
      let group = ``;
      let sql = ``;
      if (param.cityList.length) where += ` and CityCode in (:cityList)`;
      // if(param.yearAndMonth.length && param.yearAndMonth[0] !== "") where += ` and TimeForUpload between '${param.yearAndMonth[0]}' and '${param.yearAndMonth[1]}'`
      sql = `SELECT CityCode,COUNT(1) as ReportNum,sum(case when SyncFlag = 1 then 1 else 0 end) as Reported 
            FROM StationInfo WHERE ${where} and CityCode is not null  GROUP BY CityCode`;
      let data = await Raw.QueryList(sql, {
        replacements: {
          cityList: param.cityList,
        },
      });
      let all = {
        CityCode: "zongji",
        ReportNum: 0,
        Reported: 0,
        sbl: 0.0,
      };
      data.forEach((v) => {
        all.ReportNum += v.ReportNum;
        all.Reported += v.Reported;
        v.sbl = 0.0;
        if (v.ReportNum && v.ReportNum !== 0)
          v.sbl = ((v.Reported / v.ReportNum) * 100).toFixed(2);
      });
      if (all.ReportNum && all.ReportNum !== 0)
        all.sbl = ((all.Reported / all.ReportNum) * 100).toFixed(2);
      data.push(all);
      let errData = await Raw.QueryPageData(
        `select CityCode,StationCode,StationName,SyncError,SyncErrorType from stationInfo where ${where} and syncFlag='10'`,
        pageNum,
        pageSize,
        {
          replacements: {
            cityList: param.cityList,
          },
          orderstr: "SyncErrorType",
        }
      );
      let { list, total } = errData;
      return { state: 1, data, errData: list, total, msg: "查询成功！" };
    } catch (error) {
      return { state: 0, msg: "查询失败！", error };
    }
  }

  // 检测线上报率
  async getLineReportData({ param, pageNum, pageSize }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      let where = ` 1=1 `;
      let group = ``;
      let sql = ``;
      if (param.cityList.length) where += ` and CityCode in (:cityList)`;
      if (param.typeValue1 == "按站点统计") group = `,StationCode`;
      // if(param.yearAndMonth.length && param.yearAndMonth[0] !== "") where += ` and TimeForUpload between '${param.yearAndMonth[0]}' and '${param.yearAndMonth[1]}'`
      sql = `SELECT CityCode${group},COUNT(1) as ReportNum,sum(case when SyncFlag = 1 then 1 else 0 end) as Reported  FROM (SELECT (SELECT CityCode FROM StationInfo WHERE StationInfo.StationCode = c.StationCode )as CityCode,StationCode,SceneCode,
      SyncFlag FROM LineInfo c)d where ${where} group by CityCode${group} order by ReportNum desc`;
      let data = await Raw.QueryList(sql, {
        replacements: {
          cityList: param.cityList,
        },
      });
      let all = {
        CityCode: "zongji",
        ReportNum: 0,
        Reported: 0,
        Stationcode: "",
        sbl: 0.0,
      };
      data.forEach((v) => {
        all.ReportNum += v.ReportNum;
        all.Reported += v.Reported;
        v.sbl = 0.0;
        if (v.ReportNum && v.ReportNum !== 0)
          v.sbl = ((v.Reported / v.ReportNum) * 100).toFixed(2);
      });
      if (all.ReportNum && all.ReportNum !== 0)
        all.sbl = ((all.Reported / all.ReportNum) * 100).toFixed(2);
      data.push(all);
      let errData = await Raw.QueryPageData(
        `
      SELECT * FROM (SELECT (SELECT CityCode FROM StationInfo WHERE StationInfo.StationCode = c.StationCode )as CityCode,
      StationCode,SceneCode,LineType,SyncError,SyncErrorType,syncFlag FROM LineInfo c)d where ${where} and syncFlag='10'`,
        pageNum,
        pageSize,
        {
          replacements: {
            cityList: param.cityList,
          },
          orderstr: "SyncErrorType",
        }
      );
      let { list, total } = errData;
      return { state: 1, data, errData: list, total, msg: "查询成功！" };
    } catch (error) {
      return { state: 0, msg: "查询失败！", error };
    }
  }

  // 检测数据上报率
  async getInspectionDataReport({ param, pageNum, pageSize }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      let where = ` 1=1 `;
      let group = ``;
      let sql = ``;
      let order = ``;
      if (param.cityList.length) where += ` and CityCode in (:cityList)`;
      if (param.typeValue1 == "按站点统计") group = `,StationCode`;
      if (param.yearAndMonth.length && param.yearAndMonth[0] !== "")
        where += ` and TimeForUpload between '${param.yearAndMonth[0]}' and '${param.yearAndMonth[1]}'`;
      if (param.typeValue2 == "按月份统计") {
        group += `,month(TimeForUpload)`;
        order = `month(TimeForUpload)`;
      } else if (param.typeValue2 == "按年份统计") {
        group += `,year(TimeForUpload)`;
        order = `year(TimeForUpload)`;
      }
      sql = `select CityCode${group} as timeRange,count(1) as ReportNum,sum(case when SyncFlag = 1 then 1 else 0 end) as Reported from InspectionData where
      ${where} and isCanPrint='1' and vlpncolor like ('%0%') and vlpn not like ('%测%') group by CityCode${group} order by ${order} desc`;
      let data = await Raw.QueryList(sql, {
        replacements: {
          cityList: param.cityList,
        },
      });
      let all = {
        CityCode: "zongji",
        timeRange: "--",
        ReportNum: 0,
        Reported: 0,
        Stationcode: "",
        sbl: 0.0,
      };
      data.forEach((v) => {
        all.ReportNum += v.ReportNum;
        all.Reported += v.Reported;
        v.sbl = 0.0;
        if (v.ReportNum && v.ReportNum !== 0)
          v.sbl = ((v.Reported / v.ReportNum) * 100).toFixed(2);
      });
      if (all.ReportNum && all.ReportNum !== 0)
        all.sbl = ((all.Reported / all.ReportNum) * 100).toFixed(2);
      data.push(all);
      let errData = await Raw.QueryPageData(
        `select inspectionNum,StationCode,VLPN,VIN,SyncError,SyncErrorType,syncFlag from inspectionData
                    where ${where} and syncFlag='10' and vlpncolor like ('%0%') and vlpn not like ('%测%')`,
        pageNum,
        pageSize,
        {
          replacements: {
            cityList: param.cityList,
          },
          orderstr: "SyncErrorType",
        }
      );
      let { list, total } = errData;
      return { state: 1, data, errData: list, total, msg: "查询成功！" };
    } catch (error) {
      return { state: 0, msg: "查询失败！", error };
    }
  }

  // 加载减速工况法结果数据上报率
  async getLDDataReport({ param, pageNum, pageSize }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      let where = ` 1=1 `;
      let group = ``;
      let sql = ``;
      let order = ``;
      if (param.cityList.length) where += ` and CityCode in (:cityList)`;
      if (param.typeValue1 == "按站点统计") group = `,a.StationCode`;
      if (param.yearAndMonth.length && param.yearAndMonth[0] !== "")
        where += ` and a.TimeForUpload between '${param.yearAndMonth[0]}' and '${param.yearAndMonth[1]}'`;
      if (param.typeValue2 == "按月份统计") {
        group += `,month(a.TimeForUpload)`;
        order = `month(a.TimeForUpload)`;
      } else if (param.typeValue2 == "按年份统计") {
        group += `,year(a.TimeForUpload)`;
        order = `year(a.TimeForUpload)`;
      }
      sql = `SELECT CityCode${group} as timeRange,count(1) AS ReportNum, SUM ( CASE WHEN a.SyncFlag = 1 THEN 1 ELSE 0 END ) AS Reported from LDData a 
      INNER JOIN InspectionData b on a.InspectionNum = b.InspectionNum where ${where} and b.vlpncolor like ('%0%') and b.vlpn not like ('%测%') GROUP BY CityCode${group} order by ${order} desc`;
      let data = await Raw.QueryList(sql, {
        replacements: {
          cityList: param.cityList,
        },
      });
      let all = {
        CityCode: "zongji",
        timeRange: "--",
        ReportNum: 0,
        Reported: 0,
        Stationcode: "",
        sbl: 0.0,
      };
      data.forEach((v) => {
        all.ReportNum += v.ReportNum;
        all.Reported += v.Reported;
        v.sbl = 0.0;
        if (v.ReportNum && v.ReportNum !== 0)
          v.sbl = ((v.Reported / v.ReportNum) * 100).toFixed(2);
      });
      if (all.ReportNum && all.ReportNum !== 0)
        all.sbl = ((all.Reported / all.ReportNum) * 100).toFixed(2);
      data.push(all);
      let errData = await Raw.QueryPageData(
        `SELECT CityCode,a.StationCode,VLPN,VIN,a.InspectionNum,a.SyncError,a.SyncErrorType,a.TimeForUpload from LDData a 
      INNER JOIN InspectionData b on a.InspectionNum = b.InspectionNum where ${where} and b.vlpncolor like ('%0%') and b.vlpn not like ('%测%') and a.SyncFlag='10'`,
        pageNum,
        pageSize,
        {
          replacements: {
            cityList: param.cityList,
          },
          orderstr: "TimeForUpload desc",
        }
      );
      let { list, total } = errData;
      return { state: 1, data, errData: list, total, msg: "查询成功！" };
    } catch (error) {
      return { state: 0, msg: "查询失败！", error };
    }
  }

  // 加载减速工况法过程数据上报率
  async getLDProcessDataReport({ param, pageNum, pageSize }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      let where = ` 1=1 `;
      let group = ``;
      let sql = ``;
      let errsql = ``;
      let order = ``;
      if (param.cityList.length) where += ` and CityCode in (:cityList)`;
      if (param.typeValue1 == "按站点统计") group = `,a.StationCode`;
      if (param.yearAndMonth.length && param.yearAndMonth[0] !== "")
        where += ` and a.ReceiveTime between '${param.yearAndMonth[0]}' and '${param.yearAndMonth[1]}'`;
      if (param.typeValue2 == "按月份统计") {
        group += `,month(a.ReceiveTime)`;
        order = `month(a.ReceiveTime)`;
      } else if (param.typeValue2 == "按年份统计") {
        group += `,year(a.ReceiveTime)`;
        order = `year(a.ReceiveTime)`;
      }
      let sqlList = [];
      let errsqlList = [];
      // 获取两个日期之间的所有月份
      let dateRange = this.getMonthBetween(
        moment(param.yearAndMonth[0]).format("YYYY-MM"),
        moment(param.yearAndMonth[1]).format("YYYY-MM")
      );
      for (let i = 0; i < dateRange.length; i++) {
        let LDProcessTable = `LDProcessData` + dateRange[i];
        let ifExists = await Raw.QueryList(
          `select * from sysobjects where name='${LDProcessTable}' and xtype='U'`
        );
        if (ifExists.length) {
          sql = `SELECT CityCode${group} as timeRange,count(1) AS ReportNum, SUM ( CASE WHEN a.SyncFlag = 1 THEN 1 ELSE 0 END ) AS Reported from ${LDProcessTable} a 
          INNER JOIN InspectionData b on a.InspectionNum = b.InspectionNum where ${where} and b.vlpncolor like ('%0%') and b.vlpn not like ('%测%') GROUP BY CityCode${group}`;
          sqlList.push(sql);
          errsql = `select CityCode,a.StationCode,VLPN,VIN,a.InspectionNum,a.ReceiveTime from ${LDProcessTable} a 
          INNER JOIN InspectionData b on a.InspectionNum = b.InspectionNum where ${where} and b.vlpncolor like ('%0%') and b.vlpn not like ('%测%') and a.SyncFlag='10'`;
          errsqlList.push(errsql);
        }
      }
      sql = sqlList.join(" union ");
      errsql = errsqlList.join(" union ");
      sql += ` order by ${order} desc`;
      let data = await Raw.QueryList(sql, {
        replacements: {
          cityList: param.cityList,
        },
      });

      // if(param.typeValue2 == '按年份统计'){
      //   let newArr = []
      //   data.forEach(el=>{
      //     let result;
      //     if(param.typeValue1 == '按站点统计') result = newArr.findIndex(ol=>{return el.CityCode == ol.CityCode && el.timeRange == ol.timeRange && el.StationCode == ol.StationCode});
      //     else result = newArr.findIndex(ol=>{return el.CityCode == ol.CityCode && el.timeRange == ol.timeRange});
      //     if(result!== -1){
      //       newArr[result].ReportNum = newArr[result].ReportNum + el.ReportNum;
      //       newArr[result].Reported = newArr[result].Reported + el.Reported;
      //     }else{
      //       newArr.push(el)
      //     }
      //   })
      //   data = newArr;
      // }
      let all = {
        CityCode: "zongji",
        timeRange: "--",
        ReportNum: 0,
        Reported: 0,
        Stationcode: "",
        sbl: 0.0,
      };
      data.forEach((v) => {
        all.ReportNum += v.ReportNum;
        all.Reported += v.Reported;
        v.sbl = 0.0;
        if (v.ReportNum && v.ReportNum !== 0)
          v.sbl = ((v.Reported / v.ReportNum) * 100).toFixed(2);
      });
      if (all.ReportNum && all.ReportNum !== 0)
        all.sbl = ((all.Reported / all.ReportNum) * 100).toFixed(2);
      data.push(all);
      // 上报失败统计
      let errData = await Raw.QueryPageData(errsql, pageNum, pageSize, {
        replacements: {
          cityList: param.cityList,
        },
        orderstr: " ReceiveTime desc",
      });
      let { list, total } = errData;
      return { state: 1, data, errData: list, total, msg: "查询成功！" };
    } catch (error) {
      return { state: 0, msg: "查询失败！", error };
    }
  }

  // 自由加速（不透光烟度法）结果数据上报率
  async getLightProofSmokeDataReport(
    { param, pageNum, pageSize },
    { ctx, userid }
  ) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      let where = ` 1=1 `;
      let group = ``;
      let sql = ``;
      let order = ``;
      if (param.cityList.length) where += ` and CityCode in (:cityList)`;
      if (param.typeValue1 == "按站点统计") group = `,a.StationCode`;
      if (param.yearAndMonth.length && param.yearAndMonth[0] !== "")
        where += ` and a.TimeForUpload between '${param.yearAndMonth[0]}' and '${param.yearAndMonth[1]}'`;
      if (param.typeValue2 == "按月份统计") {
        group += `,month(a.TimeForUpload)`;
        order = `month(a.TimeForUpload)`;
      } else if (param.typeValue2 == "按年份统计") {
        group += `,year(a.TimeForUpload)`;
        order = `year(a.TimeForUpload)`;
      }
      sql = `SELECT CityCode${group} as timeRange,count(1) AS ReportNum, SUM ( CASE WHEN a.SyncFlag = 1 THEN 1 ELSE 0 END ) AS Reported from LightProofSmokeData a 
      INNER JOIN InspectionData b on a.InspectionNum = b.InspectionNum where ${where} and b.vlpncolor like ('%0%') and b.vlpn not like ('%测%') GROUP BY CityCode${group} order by ${order} desc`;
      let data = await Raw.QueryList(sql, {
        replacements: {
          cityList: param.cityList,
        },
      });
      let all = {
        CityCode: "zongji",
        timeRange: "--",
        ReportNum: 0,
        Reported: 0,
        Stationcode: "",
        sbl: 0.0,
      };
      data.forEach((v) => {
        all.ReportNum += v.ReportNum;
        all.Reported += v.Reported;
        v.sbl = 0.0;
        if (v.ReportNum && v.ReportNum !== 0)
          v.sbl = ((v.Reported / v.ReportNum) * 100).toFixed(2);
      });
      if (all.ReportNum && all.ReportNum !== 0)
        all.sbl = ((all.Reported / all.ReportNum) * 100).toFixed(2);
      data.push(all);
      let errData = await Raw.QueryPageData(
        `SELECT CityCode,a.StationCode,VLPN,VIN,a.InspectionNum,a.SyncError,a.SyncErrorType,a.TimeForUpload from LightProofSmokeData a 
      INNER JOIN InspectionData b on a.InspectionNum = b.InspectionNum where ${where} and b.vlpncolor like ('%0%') and b.vlpn not like ('%测%') and a.SyncFlag='10'`,
        pageNum,
        pageSize,
        {
          replacements: {
            cityList: param.cityList,
          },
          orderstr: "TimeForUpload desc",
        }
      );
      let { list, total } = errData;
      return { state: 1, data, errData: list, total, msg: "查询成功！" };
    } catch (error) {
      return { state: 0, msg: "查询失败！", error };
    }
  }

  // 自由加速 过程数据上报率
  async getLightProofSmokeProcessDataReport(
    { param, pageNum, pageSize },
    { ctx, userid }
  ) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      let where = ` 1=1 `;
      let group = ``;
      let sql = ``;
      let errsql = ``;
      let order = ``;
      if (param.cityList.length) where += ` and CityCode in (:cityList)`;
      if (param.typeValue1 == "按站点统计") group = `,a.StationCode`;
      if (param.yearAndMonth.length && param.yearAndMonth[0] !== "")
        where += ` and a.ReceiveTime between '${param.yearAndMonth[0]}' and '${param.yearAndMonth[1]}'`;
      if (param.typeValue2 == "按月份统计") {
        group += `,month(a.ReceiveTime)`;
        order = `month(a.ReceiveTime)`;
      } else if (param.typeValue2 == "按年份统计") {
        group += `,year(a.ReceiveTime)`;
        order = `year(a.ReceiveTime)`;
      }
      let sqlList = [];
      let errsqlList = [];
      // 获取两个日期之间的所有月份
      let dateRange = this.getMonthBetween(
        moment(param.yearAndMonth[0]).format("YYYY-MM"),
        moment(param.yearAndMonth[1]).format("YYYY-MM")
      );
      for (let i = 0; i < dateRange.length; i++) {
        let LightProcessTable = `LightProofSmokeProcessData` + dateRange[i];
        let ifExists = await Raw.QueryList(
          `select * from sysobjects where name='${LightProcessTable}' and xtype='U'`
        );
        if (ifExists.length) {
          sql = `SELECT CityCode${group} as timeRange,count(1) AS ReportNum, SUM ( CASE WHEN a.SyncFlag = 1 THEN 1 ELSE 0 END ) AS Reported from ${LightProcessTable} a 
          INNER JOIN InspectionData b on a.InspectionNum = b.InspectionNum where ${where} and b.vlpncolor like ('%0%') and b.vlpn not like ('%测%') GROUP BY CityCode${group}`;
          sqlList.push(sql);
          errsql = `select CityCode,a.StationCode,VLPN,VIN,a.InspectionNum,a.ReceiveTime from ${LightProcessTable} a 
          INNER JOIN InspectionData b on a.InspectionNum = b.InspectionNum where ${where} and b.vlpncolor like ('%0%') and b.vlpn not like ('%测%') and a.SyncFlag='10'`;
          errsqlList.push(errsql);
        }
      }
      sql = sqlList.join(" union ");
      errsql = errsqlList.join(" union ");
      sql += ` order by ${order} desc`;
      let data = await Raw.QueryList(sql, {
        replacements: {
          cityList: param.cityList,
        },
      });
      // if(param.typeValue2 == '按年份统计'){
      //   let newArr = []
      //   data.forEach(el=>{
      //     let result;
      //     if(param.typeValue1 == '按站点统计') result = newArr.findIndex(ol=>{return el.CityCode == ol.CityCode && el.timeRange == ol.timeRange && el.StationCode == ol.StationCode});
      //     else result = newArr.findIndex(ol=>{return el.CityCode == ol.CityCode && el.timeRange == ol.timeRange});
      //     if(result!== -1){
      //       newArr[result].ReportNum = newArr[result].ReportNum + el.ReportNum;
      //       newArr[result].Reported = newArr[result].Reported + el.Reported;
      //     }else{
      //       newArr.push(el)
      //     }
      //   })
      //   data = newArr;
      // }
      let all = {
        CityCode: "zongji",
        timeRange: "--",
        ReportNum: 0,
        Reported: 0,
        Stationcode: "",
        sbl: 0.0,
      };
      data.forEach((v) => {
        all.ReportNum += v.ReportNum;
        all.Reported += v.Reported;
        v.sbl = 0.0;
        if (v.ReportNum && v.ReportNum !== 0)
          v.sbl = ((v.Reported / v.ReportNum) * 100).toFixed(2);
      });
      if (all.ReportNum && all.ReportNum !== 0)
        all.sbl = ((all.Reported / all.ReportNum) * 100).toFixed(2);
      data.push(all);
      // 上报失败统计
      let errData = await Raw.QueryPageData(errsql, pageNum, pageSize, {
        replacements: {
          cityList: param.cityList,
        },
        orderstr: " ReceiveTime desc",
      });
      let { list, total } = errData;
      return { state: 1, data, errData: list, total, msg: "查询成功！" };
    } catch (error) {
      return { state: 0, msg: "查询失败！", error };
    }
  }

  // 双怠速过程数据上报率
  async getTSIProcessDataReport({ param, pageNum, pageSize }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      let where = ` 1=1 `;
      let group = ``;
      let sql = ``;
      let errsql = ``;
      let order = ``;
      if (param.cityList.length) where += ` and CityCode in (:cityList)`;
      if (param.typeValue1 == "按站点统计") group = `,a.StationCode`;
      if (param.yearAndMonth.length && param.yearAndMonth[0] !== "")
        where += ` and a.ReceiveTime between '${param.yearAndMonth[0]}' and '${param.yearAndMonth[1]}'`;
      if (param.typeValue2 == "按月份统计") {
        group += `,month(a.ReceiveTime)`;
        order = `month(a.ReceiveTime)`;
      } else if (param.typeValue2 == "按年份统计") {
        group += `,year(a.ReceiveTime)`;
        order = `year(a.ReceiveTime)`;
      }
      let sqlList = [];
      let errsqlList = [];
      // 获取两个日期之间的所有月份
      let dateRange = this.getMonthBetween(
        moment(param.yearAndMonth[0]).format("YYYY-MM"),
        moment(param.yearAndMonth[1]).format("YYYY-MM")
      );
      for (let i = 0; i < dateRange.length; i++) {
        let TSIProcessTable = `TSIProcessData` + dateRange[i];
        let ifExists = await Raw.QueryList(
          `select * from sysobjects where name='${TSIProcessTable}' and xtype='U'`
        );
        if (ifExists.length) {
          sql = `SELECT CityCode${group} as timeRange,count(1) AS ReportNum, SUM ( CASE WHEN a.SyncFlag = 1 THEN 1 ELSE 0 END ) AS Reported from ${TSIProcessTable} a 
          INNER JOIN InspectionData b on a.InspectionNum = b.InspectionNum where ${where} and b.vlpncolor like ('%0%') and b.vlpn not like ('%测%') GROUP BY CityCode${group}`;
          sqlList.push(sql);
          errsql = `select CityCode,a.StationCode,VLPN,VIN,a.InspectionNum,a.ReceiveTime from ${TSIProcessTable} a 
          INNER JOIN InspectionData b on a.InspectionNum = b.InspectionNum where ${where} and b.vlpncolor like ('%0%') and b.vlpn not like ('%测%') and a.SyncFlag='10'`;
          errsqlList.push(errsql);
        }
      }
      sql = sqlList.join(" union ");
      errsql = errsqlList.join(" union ");
      sql += ` order by ${order} desc`;
      let data = await Raw.QueryList(sql, {
        replacements: {
          cityList: param.cityList,
        },
      });
      // if(param.typeValue2 == '按年份统计'){
      //   let newArr = []
      //   data.forEach(el=>{
      //     let result;
      //     if(param.typeValue1 == '按站点统计') result = newArr.findIndex(ol=>{return el.CityCode == ol.CityCode && el.timeRange == ol.timeRange && el.StationCode == ol.StationCode});
      //     else result = newArr.findIndex(ol=>{return el.CityCode == ol.CityCode && el.timeRange == ol.timeRange});
      //     if(result!== -1){
      //       newArr[result].ReportNum = newArr[result].ReportNum + el.ReportNum;
      //       newArr[result].Reported = newArr[result].Reported + el.Reported;
      //     }else{
      //       newArr.push(el)
      //     }
      //   })
      //   data = newArr;
      // }
      let all = {
        CityCode: "zongji",
        timeRange: "--",
        ReportNum: 0,
        Reported: 0,
        Stationcode: "",
        sbl: 0.0,
      };
      data.forEach((v) => {
        all.ReportNum += v.ReportNum;
        all.Reported += v.Reported;
        v.sbl = 0.0;
        if (v.ReportNum && v.ReportNum !== 0)
          v.sbl = ((v.Reported / v.ReportNum) * 100).toFixed(2);
      });
      if (all.ReportNum && all.ReportNum !== 0)
        all.sbl = ((all.Reported / all.ReportNum) * 100).toFixed(2);
      data.push(all);
      // 上报失败统计
      let errData = await Raw.QueryPageData(errsql, pageNum, pageSize, {
        replacements: {
          cityList: param.cityList,
        },
        orderstr: " ReceiveTime desc",
      });
      let { list, total } = errData;
      return { state: 1, data, errData: list, total, msg: "查询成功！" };
      // return { state: 1, data, msg: "查询成功！" };
    } catch (error) {
      return { state: 0, msg: "查询失败！", error };
    }
  }

  // 双怠速结果上报率
  async getTSIProcessReport({ param, pageNum, pageSize }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      let where = ` 1=1 `;
      let group = ``;
      let sql = ``;
      let order = ``;
      if (param.cityList.length) where += ` and CityCode in (:cityList)`;
      if (param.typeValue1 == "按站点统计") group = `,a.StationCode`;
      if (param.yearAndMonth.length && param.yearAndMonth[0] !== "")
        where += ` and a.TimeForUpload between '${param.yearAndMonth[0]}' and '${param.yearAndMonth[1]}'`;
      if (param.typeValue2 == "按月份统计") {
        group += `,month(a.TimeForUpload)`;
        order = `month(a.TimeForUpload)`;
      } else if (param.typeValue2 == "按年份统计") {
        group += `,year(a.TimeForUpload)`;
        order = `year(a.TimeForUpload)`;
      }
      sql = `SELECT CityCode${group} as timeRange,SUM(1) AS ReportNum, SUM ( CASE WHEN a.SyncFlag = 1 THEN 1 ELSE 0 END ) AS Reported from TSIData a
      INNER JOIN InspectionData b on a.InspectionNum = b.InspectionNum where ${where} and b.vlpncolor like ('%0%') and b.vlpn not like ('%测%') group by CityCode${group} order by ${order} desc`;
      let data = await Raw.QueryList(sql, {
        replacements: {
          cityList: param.cityList,
        },
      });
      let all = {
        CityCode: "zongji",
        timeRange: "--",
        ReportNum: 0,
        Reported: 0,
        Stationcode: "",
        sbl: 0.0,
      };
      data.forEach((v) => {
        all.ReportNum += v.ReportNum;
        all.Reported += v.Reported;
        v.sbl = 0.0;
        if (v.ReportNum && v.ReportNum !== 0)
          v.sbl = ((v.Reported / v.ReportNum) * 100).toFixed(2);
      });
      if (all.ReportNum && all.ReportNum !== 0)
        all.sbl = ((all.Reported / all.ReportNum) * 100).toFixed(2);
      data.push(all);
      let errData = await Raw.QueryPageData(
        `SELECT CityCode,a.StationCode,VLPN,VIN,a.InspectionNum,a.SyncError,a.SyncErrorType,a.TimeForUpload from TSIProcessData a
      INNER JOIN InspectionData b on a.InspectionNum = b.InspectionNum where ${where} and b.vlpncolor like ('%0%') and b.vlpn not like ('%测%') and a.SyncFlag='10'`,
        pageNum,
        pageSize,
        {
          replacements: {
            cityList: param.cityList,
          },
          orderstr: "TimeForUpload desc",
        }
      );
      let { list, total } = errData;
      return { state: 1, data, errData: list, total, msg: "查询成功！" };
      // return { state: 1, data, msg: "查询成功！" };
    } catch (error) {
      return { state: 0, msg: "查询失败！", error };
    }
  }
  // 稳态工况结果数据上报率
  async getASMDataReport({ param, pageNum, pageSize }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      let where = ` 1=1 `;
      let group = ``;
      let sql = ``;
      let order = ``;
      if (param.cityList.length) where += ` and CityCode in (:cityList)`;
      if (param.typeValue1 == "按站点统计") group = `,a.StationCode`;
      if (param.yearAndMonth.length && param.yearAndMonth[0] !== "")
        where += ` and a.TimeForUpload between '${param.yearAndMonth[0]}' and '${param.yearAndMonth[1]}'`;
      if (param.typeValue2 == "按月份统计") {
        group += `,month(a.TimeForUpload)`;
        order = `month(a.TimeForUpload)`;
      } else if (param.typeValue2 == "按年份统计") {
        group += `,year(a.TimeForUpload)`;
        order = `year(a.TimeForUpload)`;
      }
      sql = `SELECT CityCode${group} as timeRange,SUM(1) AS ReportNum, SUM ( CASE WHEN a.SyncFlag = 1 THEN 1 ELSE 0 END ) AS Reported from ASMData a
      INNER JOIN InspectionData b on a.InspectionNum = b.InspectionNum where ${where} and b.vlpncolor like ('%0%') and b.vlpn not like ('%测%') group by CityCode${group} order by ${order} desc`;
      let data = await Raw.QueryList(sql, {
        replacements: {
          cityList: param.cityList,
        },
      });
      let all = {
        CityCode: "zongji",
        timeRange: "--",
        ReportNum: 0,
        Reported: 0,
        Stationcode: "",
        sbl: 0.0,
      };
      data.forEach((v) => {
        all.ReportNum += v.ReportNum;
        all.Reported += v.Reported;
        v.sbl = 0.0;
        if (v.ReportNum && v.ReportNum !== 0)
          v.sbl = ((v.Reported / v.ReportNum) * 100).toFixed(2);
      });
      if (all.ReportNum && all.ReportNum !== 0)
        all.sbl = ((all.Reported / all.ReportNum) * 100).toFixed(2);
      data.push(all);
      let errData = await Raw.QueryPageData(
        `SELECT CityCode,a.StationCode,VLPN,VIN,a.InspectionNum,a.SyncError,a.SyncErrorType,a.TimeForUpload from ASMData a
      INNER JOIN InspectionData b on a.InspectionNum = b.InspectionNum where ${where} and b.vlpncolor like ('%0%') and b.vlpn not like ('%测%') and a.SyncFlag='10'`,
        pageNum,
        pageSize,
        {
          replacements: {
            cityList: param.cityList,
          },
          orderstr: "TimeForUpload desc",
        }
      );
      let { list, total } = errData;
      return { state: 1, data, errData: list, total, msg: "查询成功！" };
      // return { state: 1, data, msg: "查询成功！" };
    } catch (error) {
      return { state: 0, msg: "查询失败！", error };
    }
  }

  // 稳态工况过程数据上报率
  async getASMProcessDataReport({ param, pageNum, pageSize }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      let where = ` 1=1 `;
      let group = ``;
      let sql = ``;
      let errsql = ``;
      let order = ``;
      if (param.cityList.length) where += ` and CityCode in (:cityList)`;
      if (param.typeValue1 == "按站点统计") group = `,a.StationCode`;
      if (param.yearAndMonth.length && param.yearAndMonth[0] !== "")
        where += ` and a.ReceiveTime between '${param.yearAndMonth[0]}' and '${param.yearAndMonth[1]}'`;
      if (param.typeValue2 == "按月份统计") {
        group += `,month(a.ReceiveTime)`;
        order = `month(a.ReceiveTime)`;
      } else if (param.typeValue2 == "按年份统计") {
        group += `,year(a.ReceiveTime)`;
        order = `year(a.ReceiveTime)`;
      }
      let sqlList = [];
      let errsqlList = [];
      // 获取两个日期之间的所有月份
      let dateRange = this.getMonthBetween(
        moment(param.yearAndMonth[0]).format("YYYY-MM"),
        moment(param.yearAndMonth[1]).format("YYYY-MM")
      );
      for (let i = 0; i < dateRange.length; i++) {
        let ASMProcessTable = `ASMProcessData` + dateRange[i];
        let ifExists = await Raw.QueryList(
          `select * from sysobjects where name='${ASMProcessTable}' and xtype='U'`
        );
        if (ifExists.length) {
          sql = `SELECT CityCode${group} as timeRange,count(1) AS ReportNum, SUM ( CASE WHEN a.SyncFlag = 1 THEN 1 ELSE 0 END ) AS Reported from ${ASMProcessTable} a 
          INNER JOIN InspectionData b on a.InspectionNum = b.InspectionNum where ${where} and b.vlpncolor like ('%0%') and b.vlpn not like ('%测%') GROUP BY CityCode${group}`;
          sqlList.push(sql);
          errsql = `select CityCode,a.StationCode,VLPN,VIN,a.InspectionNum,a.ReceiveTime from ${ASMProcessTable} a 
          INNER JOIN InspectionData b on a.InspectionNum = b.InspectionNum where ${where} and b.vlpncolor like ('%0%') and b.vlpn not like ('%测%') and a.SyncFlag='10'`;
          errsqlList.push(errsql);
        }
      }
      sql = sqlList.join(" union ");
      errsql = errsqlList.join(" union ");
      sql += ` order by ${order} desc`;
      let data = await Raw.QueryList(sql, {
        replacements: {
          cityList: param.cityList,
        },
      });
      // if(param.typeValue2 == '按年份统计'){
      //   let newArr = []
      //   data.forEach(el=>{
      //     let result;
      //     if(param.typeValue1 == '按站点统计') result = newArr.findIndex(ol=>{return el.CityCode == ol.CityCode && el.timeRange == ol.timeRange && el.StationCode == ol.StationCode});
      //     else result = newArr.findIndex(ol=>{return el.CityCode == ol.CityCode && el.timeRange == ol.timeRange});
      //     if(result!== -1){
      //       newArr[result].ReportNum = newArr[result].ReportNum + el.ReportNum;
      //       newArr[result].Reported = newArr[result].Reported + el.Reported;
      //     }else{
      //       newArr.push(el)
      //     }
      //   })
      //   data = newArr;
      // }
      let all = {
        CityCode: "zongji",
        timeRange: "--",
        ReportNum: 0,
        Reported: 0,
        Stationcode: "",
        sbl: 0.0,
      };
      data.forEach((v) => {
        all.ReportNum += v.ReportNum;
        all.Reported += v.Reported;
        v.sbl = 0.0;
        if (v.ReportNum && v.ReportNum !== 0)
          v.sbl = ((v.Reported / v.ReportNum) * 100).toFixed(2);
      });
      if (all.ReportNum && all.ReportNum !== 0)
        all.sbl = ((all.Reported / all.ReportNum) * 100).toFixed(2);
      data.push(all);
      // 上报失败统计
      let errData = await Raw.QueryPageData(errsql, pageNum, pageSize, {
        replacements: {
          cityList: param.cityList,
        },
        orderstr: " ReceiveTime desc",
      });
      let { list, total } = errData;
      return { state: 1, data, errData: list, total, msg: "查询成功！" };
    } catch (error) {
      return { state: 0, msg: "查询失败！", error };
    }
  }

  // OBD检查信息数据上报率
  async getOBDInfoReport({ param, pageNum, pageSize }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      let where = ` 1=1 `;
      let group = ``;
      let sql = ``;
      let order = ``;
      if (param.cityList.length) where += ` and CityCode in (:cityList)`;
      if (param.typeValue1 == "按站点统计") group = `,a.StationCode`;
      if (param.yearAndMonth.length && param.yearAndMonth[0] !== "")
        where += ` and a.TimeForUpload between '${param.yearAndMonth[0]}' and '${param.yearAndMonth[1]}'`;
      if (param.typeValue2 == "按月份统计") {
        group += `,month(a.TimeForUpload)`;
        order = `month(a.TimeForUpload)`;
      } else if (param.typeValue2 == "按年份统计") {
        group += `,year(a.TimeForUpload)`;
        order = `year(a.TimeForUpload)`;
      }
      sql = `SELECT CityCode${group} as timeRange,count(1) AS ReportNum, SUM ( CASE WHEN a.SyncFlag = 1 THEN 1 ELSE 0 END ) AS Reported 
      from OBDInfo a INNER JOIN InspectionData b on a.InspectionNum = b.InspectionNum where ${where} and b.vlpncolor like ('%0%') and b.vlpn not like ('%测%') group by CityCode${group} order by ${order}`;
      let data = await Raw.QueryList(sql, {
        replacements: {
          cityList: param.cityList,
        },
      });
      let all = {
        CityCode: "zongji",
        timeRange: "--",
        ReportNum: 0,
        Reported: 0,
        Stationcode: "",
        sbl: 0.0,
      };
      data.forEach((v) => {
        all.ReportNum += v.ReportNum;
        all.Reported += v.Reported;
        v.sbl = 0.0;
        if (v.ReportNum && v.ReportNum !== 0)
          v.sbl = ((v.Reported / v.ReportNum) * 100).toFixed(2);
      });
      if (all.ReportNum && all.ReportNum !== 0)
        all.sbl = ((all.Reported / all.ReportNum) * 100).toFixed(2);
      data.push(all);
      let errData = await Raw.QueryPageData(
        `SELECT CityCode,a.StationCode,b.VLPN,a.VIN,a.InspectionNum,a.SyncError,a.SyncErrorType,a.TimeForUpload
      from OBDInfo a INNER JOIN InspectionData b on a.InspectionNum = b.InspectionNum where ${where} and b.vlpncolor like ('%0%') and b.vlpn not like ('%测%') and a.SyncFlag='10'`,
        pageNum,
        pageSize,
        {
          replacements: {
            cityList: param.cityList,
          },
          orderstr: "TimeForUpload desc",
        }
      );
      let { list, total } = errData;
      return { state: 1, data, errData: list, total, msg: "查询成功！" };
      // return { state: 1, data, msg: "查询成功！" };
    } catch (error) {
      return { state: 0, msg: "查询失败！", error };
    }
  }

  // OBD检查控制单元信息数据上报率
  async getOBDConInfoReport({ param }, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      let where = ` 1=1 `;
      let group = ``;
      let sql = ``;
      let order = ``;
      if (param.cityList.length) where += ` and CityCode in (:cityList)`;
      if (param.typeValue1 == "按站点统计") group = `,a.StationCode`;
      if (param.yearAndMonth.length && param.yearAndMonth[0] !== "")
        where += ` and a.TimeForUpload between '${param.yearAndMonth[0]}' and '${param.yearAndMonth[1]}'`;
      if (param.typeValue2 == "按月份统计") {
        group += `,month(a.TimeForUpload)`;
        order = `month(a.TimeForUpload)`;
      } else if (param.typeValue2 == "按年份统计") {
        group += `,year(a.TimeForUpload)`;
        order = `year(a.TimeForUpload)`;
      }
      sql = `SELECT CityCode${group} as timeRange,count(1) AS ReportNum, SUM ( CASE WHEN a.SyncFlag = 1 THEN 1 ELSE 0 END ) AS Reported 
      from OBDInfo a INNER JOIN InspectionData b on a.InspectionNum = b.InspectionNum where ${where} and b.vlpncolor like ('%0%') and b.vlpn not like ('%测%') group by CityCode${group} order by ${order}`;
      let data = await Raw.QueryList(sql, {
        replacements: {
          cityList: param.cityList,
        },
      });
      let all = {
        CityCode: "zongji",
        timeRange: "--",
        ReportNum: 0,
        Reported: 0,
        Stationcode: "",
        sbl: 0.0,
      };
      data.forEach((v) => {
        v.ReportNum = v.ReportNum * 3;
        v.Reported = v.Reported * 3;
        all.ReportNum += v.ReportNum;
        all.Reported += v.Reported;
        v.sbl = 0.0;
        if (v.ReportNum && v.ReportNum !== 0)
          v.sbl = ((v.Reported / v.ReportNum) * 100).toFixed(2);
      });
      if (all.ReportNum && all.ReportNum !== 0)
        all.sbl = ((all.Reported / all.ReportNum) * 100).toFixed(2);
      data.push(all);
      return { state: 1, data, msg: "查询成功！" };
    } catch (error) {
      return { state: 0, msg: "查询失败！", error };
    }
  }

  getMonthBetween(start, end) {
    //传入的格式YYYY-MM
    var result = [];
    var s = start.split("-");
    var e = end.split("-");
    var min = new Date();
    var max = new Date();
    var yearMonthCode;
    var yearMonth;
    min.setFullYear(s[0], s[1] * 1 - 1, 1); //开始日期
    max.setFullYear(e[0], e[1] * 1 - 1, 1); //结束日期
    var curr = min;
    while (curr <= max) {
      yearMonthCode = moment(curr).format("YYYYMM");
      var month = curr.getMonth();
      var year = curr.getFullYear();

      var str = curr.getFullYear() + "-" + month;
      var s = curr.getFullYear() + "-0";
      if (str == s) {
        str = curr.getFullYear() + "-1";
      }
      var m = month + 1;
      // result.push({
      //     yearMonthCode: yearMonthCode,
      //     yearMonth: year + '年' + m + '月'
      // });
      result.push(yearMonthCode);
      curr.setMonth(month + 1);
    }
    return result;
  }

  async getDeviceWhiteData({ param }, { ctx, userid }) {
    try {
      const { app } = this;
      const { Raw } = app.Dbs.hj;
      param = JSON.parse(param);
      page = param.page;
      let sql = "";
      let where = "1=1";
      let reqParam = {};
      let res = await ctx.service.hj.commonService.GetAreaRole();
      let areaRole = res.data; //获取行政区域
      // 判断是否有行政区域权限
      if (!this.ctx.User.isAdmin && areaRole.length === 0) {
        return { code: 0, data: [], msg: "没有行政区域权限" };
      } else if (!this.ctx.User.isAdmin && areaRole.length > 0) {
        let proRoleIndex = areaRole.findIndex((item) => item.length === 2);
        if (proRoleIndex !== -1) {
          // 省级用户
          reqParam[`areaRole`] = areaRole[proRoleIndex] + "%";
          where += "CityCode like :areaRole";
        } else {
          let cityRoleIndex = areaRole.findIndex((item) => item.length === 4);
          if (cityRoleIndex !== -1) {
            // 市级用户
            let filterCounty = await Raw.QueryList(
              `select AreaCode from Area where ParentAreaCode='${
              areaRole[cityRoleIndex] + "00"
              }' and Memo='2'`
            );
            if (filterCounty.length > 0) {
              // 该市下有提升为市的区
              let filtersql = ` and CountyCode not in (${filterCounty.join(
                ","
              )})`;
              reqParam[`areaRole`] = areaRole[cityRoleIndex] + "%";
              where += "CityCode like :areaRole" + filtersql;
            } else {
              reqParam[`areaRole`] = areaRole[cityRoleIndex] + "%";
              where += "CityCode like :areaRole";
            }
          } else {
            // 区级用户
            let countyRoleIndex = areaRole.findIndex(
              (item) => item.length === 6
            );
            reqParam[`areaRole`] = areaRole[countyRoleIndex];
            where += "CountyCode=:areaRole";
          }
        }
      }
      if (param.InputValue.trim()) {
        reqParam[`InputValue`] = param.InputValue + '%';
        where += ' and UploadPerson like :InputValue or StationName like :InputValue';

      }
      sql = `select d.* from DeviceWhiteList d, StationInfo s where d.StationCode=s.StationCode ${where}`
      console.log(where)
      console.log(sql)
      let result = [];
      let list = [];
      let total = 0;
      if (type === "page") {
        result = await Raw.QueryPageData(sql, page.pageNum, page.pageSize,
          {
            orderstr: "StationCode asc",
            replacements: reqParam,
          }
        );
        list = result.list;
        total = result.total;
      } else {
        sql += " order by StationCode asc";
        result = await Raw.QueryList(sql, {
          replacements: reqParam,
        }
        );
        list = result;
        total = result.length;
      }
      return { code: 1, data: list };
    } catch (error) {
      this.app.CoreAPI.Log.trace("getDeviceWhiteData方法报错：" + error);
      return { code: 0, error };
    }
  }


  // 检测站工控软件版本号管理文件上传
  async UploadDetecionVersionData(param, { ctx, userid }) {
    try {
      let { app } = this;
      let { transaction, Raw } = app.Dbs.hj;
      let stream = await this.ctx.getFileStream();
      //拿到上传的额外信息
      let datas = stream.fields;
      //console.log('datas', datas);
      let baseDir = await app.redis.get("hj").hget("systemconfig", "01_UploadFolder");
      if (!baseDir) {
        const result = await Raw.Query(`select FieldValue from Sys_Config where FieldKey='UploadFolder'`, {
          replacements: {},
        }
        );
        if (result && result.FieldValue && result.FieldValue != "")
          baseDir = result.FieldValue;
        else baseDir = "C:/VIMUploadFiles";
      } //保存的路径
      let filename = stream.filename; //文件名称
      let update_time = ctx.helper.dataFormat(new Date(datas.UpdateTime), "yyyyMMddhhmmss");
      const StationCodeArr = datas.StationCodeList.split(",")
      //console.log('StationCodeArr——————-', StationCodeArr);
      let NO1url = ''
      for (let i = 0; i < StationCodeArr.length; i++) {
        const url = path.join(baseDir, `rjbb/${StationCodeArr[i]}/${update_time}/${datas.CurrentVersion}/`);
        if (!fs.existsSync(url)) {
          url.split(path.sep).reduce((currentPath, folder) => {
            currentPath += folder + path.sep;
            if (!fs.existsSync(currentPath)) {
              fs.mkdirSync(currentPath);
            }
            return currentPath;
          }, "");
        }
        // 保存文件
        if(i==0){
          const savepath = path.join(url, filename);
          NO1url = savepath
          const writeStream = fs.createWriteStream(savepath);
          await awaitWriteStream(stream.pipe(writeStream));
        }else{
          fs.copyFileSync(NO1url, path.join(url, filename))
        }
        // 更新SoftWareUpdateInfo表 文件名和路径
        const newurl = `bsFile/rjbb/${StationCodeArr[i]}/${update_time}/${datas.CurrentVersion}/${filename}`;
        let updateObj = {};
        updateObj.URL = newurl
        updateObj.UName = filename
        await Raw.Update(
          `SoftWareUpdateInfo`,
          { ...updateObj },
          {
            wherestr: "where StationCode=:StationCode",
            replacements: { StationCode: StationCodeArr[i] },
          }
        );
      }
      return { msg: "文件上传成功!", state: 1 };
    } catch (error) {
      console.log(error);
      return { state: 0, msg: "文件上传失败!" };
    }
  }
}

module.exports = specialBusiness;
