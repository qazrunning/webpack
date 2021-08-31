"use strict";
/**
 * 业务设置
 * */
const Controller = require("egg").Controller;
const path = require("path");
const fs = require("fs");
//故名思意 异步二进制 写入流
const awaitWriteStream = require("await-stream-ready").write;
const await = require("await-stream-ready/lib/await");
const { relativeTimeThreshold, moment } = require("moment");
const xlsx = require("xlsx");
const { CLIENT_RENEG_LIMIT } = require("tls");
class businessSettingController extends Controller {
 
  async getUserAreaData({ }, { ctx, userid }) {
    try {
      const { app } = this;
      const { Raw } = app.Dbs.hj;
      let cityList = [];
      let roleGrade = 0;
      let role = await ctx.service.hj.commonService.GetUserDetailRole(); //行政区域 
      let IsProOrCity = await app.redis.get('hj').hget("systemconfig", "02_IsProOrCity");
      if (!IsProOrCity) {
        let key = await Raw.Query(
          "select FieldValue from Sys_Config where FieldKey='IsProOrCity' and SysConfigType='02'"
        );
        if (key) IsProOrCity = key.FieldValue;
      }
      if (role.provinceRole.length) {
        let pro = `${role.provinceRole[0].slice(0, 2)}`
        cityList = await Raw.QueryList(`select * from Area where parentAreaCode='${role.provinceRole[0]}' or (parentAreaCode like '${pro}%' and Memo=2) order by AreaCode`)
        roleGrade = 1;
      } else if (role.cityRole.length) {
        if (IsProOrCity == '1') {
          cityList = await Raw.QueryList(`select * from Area where AreaCode='${role.cityRole[0]}'`)
          roleGrade = 2;
        } else {
          cityList = await Raw.QueryList(`select * from Area where parentAreaCode='${role.cityRole[0]}'`)
          roleGrade = 3;
        }
      } else if (role.areaRole.length) {
        cityList = await Raw.QueryList(`select * from Area where AreaCode='${role.areaRole[0]}'`)
        roleGrade = 3;
      }
      return { code: 1, data: { role, cityList, roleGrade } }
    } catch (error) {
      this.app.CoreAPI.Log.trace('getUserAreaData方法报错:', error);
      return { code: 0, error }
    }
  }

  async getAcceptSettingData({ params }, { ctx, userid }) {
    try {
      const { app } = this;
      const { Raw } = app.Dbs.hj;
      params = JSON.parse(params);
      let reqParam = {};
      let where = '';
      let pro = params.AreaCode.slice(0, 2) + '0000';
      if (params.userGrade == 1) {
        if (params.AreaCode) {
          if (params.AreaCode.slice(4) == '00') {
            where = 'and CountyCode is null and CityCode=:CityCode';
            reqParam.CityCode = params.AreaCode;
          } else if (params.parentAreaCode == pro) {
            where = 'and CountyCode is null and CityCode=:CityCode';
            reqParam.CityCode = params.AreaCode;
          } else {
            where = 'and CountyCode=:CountyCode';
            reqParam.CountyCode = params.AreaCode;
          }
        } else {
          let userRole = params.userRole.provinceRole[0].slice(0, 2);
          where = `and CityCode like '${userRole}%'`;
        }
      } else if (params.userGrade == 2) {
        where = 'and CountyCode is null and CityCode=:CityCode';
        reqParam.CityCode = params.AreaCode;
      } else if (params.userGrade == 3) {
        where = 'and CountyCode=:CountyCode';
        reqParam.CountyCode = params.AreaCode;
      }
      let res = await Raw.QueryList(`select * from AuditReasonList where 1=1 ${where} order by CityCode,CountyCode,AuditReasonCode`, {
        replacements: reqParam
      })
      return { code: 1, data: { list: res } }
    } catch (error) {
      this.app.CoreAPI.Log.trace('getAcceptSettingData方法报错：', error);
      return { code: 0, error }
    }
  }

  async saveAuditSettingData({ AuditSettingData }, { ctx, userid }) {
    try {
      const { app } = this;
      const { Raw } = app.Dbs.hj;
      let ID = AuditSettingData.ID
      delete AuditSettingData.ID;
      await Raw.Update("AuditReasonList", AuditSettingData, {
        wherestr: "where ID=:ID",//where 条件
        replacements: {//参数化执行
          ID: ID
        }
      });
      return { code: 1 }
    } catch (error) {
      this.app.CoreAPI.Log.trace('saveAuditSettingData方法报错：' + error);
      return { code: 0, error };
    }
  }

  // 初始化Redis中的站点信息表（站点管理用）
  async resetDataAnalysisToRedis({ }, { ctx, userid }) {
    try {
      const { app } = this;
      const { Raw } = app.Dbs.hj;
      const sysConfig = await Raw.Query("select top 1 * from Sys_Config where fieldkey = 'CountLTDataByMonthOrWeek'");
      const monthOrWeek = sysConfig.FieldValue.toUpperCase() == 'MM' ? 1 : 0; //1按月，0按周
      let timeList = await Raw.QueryList(`select DISTINCT AnalysisTimeStart,AnalysisTimeEnd from StationBlacklist order by AnalysisTimeStart desc`)
      let dateList = [];
      for (let i = 0; i < timeList.length; i++) {
        let startDay = moment(timeList[i].AnalysisTimeStart).format('YYYY-MM-DD 00:00:00');
        let endDay = moment(timeList[i].AnalysisTimeEnd).format('YYYY-MM-DD 23:59:59');
        dateList.push({
          startDay, endDay: endDay
        })
      }
      console.log(dateList)
      for (let i = 0; i < dateList.length; i++) {
        await ctx.service.hj.dataAnalysisToRedis.saveDataToRedis(dateList[i], monthOrWeek);
      }
      // if(monthOrWeek) {
      //   for(let i = 0; i < 12; i++) {
      //     let month = (i+1).toString().padStart(2, 0);
      //     let year = new Date().getFullYear();
      //     let startDay = `${year}-${month}-01 00:00:00`;
      //     let time = new Date(startDay)
      //     time.setMonth(time.getMonth()+1)
      //     time.setDate(0);
      //     let endDay = moment(time).format('YYYY-MM-DD 23:59:59')
      //     dateList.push({
      //       startDay,endDay: endDay
      //     }) 
      //   }
      //   for(let i = 0; i < dateList.length; i++) {
      //     await ctx.service.hj.dataAnalysisToRedis.saveDataToRedis(dateList[i], monthOrWeek);
      //   }
      //   return { result: 1, msg: '初始化Redis中的数据可疑性分析数据成功！' };
      // } else {
      //   return { result: 0, msg: '暂时仅支持初始化按月统计的数据' };
      // }
      return { result: 1, msg: '初始化Redis中的数据可疑性分析数据成功！' };
    } catch (error) {
      this.app.CoreAPI.Log.trace('resetRedisStationList方法报错：' + error);
      return { result: 0, msg: '初始化Redis中的数据可疑性分析数据失败！' };
    }
  }

  async resetAcceptAuditSetting({ }, { ctx, userid }) {
    try {
      const { app } = this;
      const { Raw } = app.Dbs.hj;
      const redis = app.redis.get('hj');
      // let res = await Raw.Query(`select count(1) as sum from AuditReasonList where `);
      // if(res.sum) return { code: 0, message: '受理审核配置已存在，不予初始化！'}
      let AreaCode = await redis.hget("systemconfig", "02_AreaCode");
      if (!AreaCode) {
        let key = await Raw.Query(
          "select FieldValue from Sys_Config where FieldKey='AreaCode' and SysConfigType='02'"
        );
        if (key) AreaCode = key.FieldValue;
      }
      let res = await Raw.Query(`select count(1) as sum from AuditReasonList where CityCode like '${AreaCode.slice(0, 2)}%'`);
      if (res.sum) return { code: 0, message: '受理审核配置已存在，不予初始化！' }
      let IsProOrCity = await redis.hget("systemconfig", "02_IsProOrCity");
      if (!IsProOrCity) {
        let key = await Raw.Query(
          "select FieldValue from Sys_Config where FieldKey='IsProOrCity' and SysConfigType='02'"
        );
        if (key) IsProOrCity = key.FieldValue;
      }
      let sql = '';
      if (IsProOrCity == '1') {
        // 省级平台
        sql = `insert into AuditReasonList (AuditReasonCode,AuditReasonName,IsAvailable,IsCanAccept,IsNeedAudit,Explain,Tips,CityCode,CountyCode,IsAutoAudit)
        select CodeValue as AuditReasonCode, CodeName as AuditReasonName, IsAvailable, IsCanAccept, IsNeedAudit, Explain, Tips ,AreaCode as CityCode, CountyCode = null,IsAutoAudit=null 
        from CD_AuditReason,Area where parentAreaCode='${AreaCode}'
        union
        select CodeValue as AuditReasonCode, CodeName as AuditReasonName, IsAvailable, IsCanAccept, IsNeedAudit, Explain, Tips ,ParentAreaCode as CityCode,AreaCode as CountyCode,IsAutoAudit=null 
        from CD_AuditReason,Area where parentAreaCode like '${AreaCode.slice(0, 2)}%' and Memo='2'`;
      } else {
        // 市级平台
        sql = `insert into AuditReasonList (AuditReasonCode,AuditReasonName,IsAvailable,IsCanAccept,IsNeedAudit,Explain,Tips,CityCode,CountyCode,IsAutoAudit)
        select CodeValue as AuditReasonCode, CodeName as AuditReasonName, IsAvailable, IsCanAccept, IsNeedAudit, Explain, Tips ,parentAreaCode as CityCode, AreaCode as CountyCode,IsAutoAudit=null 
        from CD_AuditReason,Area where parentAreaCode='${AreaCode}'`;
      }
      await Raw.ExecuteNoQuery(sql);
      return { code: 1, message: '受理审核设置初始化成功！' }
    } catch (error) {
      this.app.CoreAPI.Log.trace('resetAcceptAuditSetting方法报错:' + error)
      return { code: 0, message: '执行异常，请联系运维人员！', error }
    }
  }
}
module.exports = businessSettingController;
