'use strict';

const await = require('await-stream-ready/lib/await');
const path = require('path');
const moment = require('moment');
/**
 * IM站维修信息获取
 * */
const Controller = require('egg').Controller;

class Repair extends Controller {
    // 针对海南IM
    async getRepairData({ params }, { }) {
        params = JSON.parse(params)
        const { app } = this;
        try {
            const { Raw } = app.Dbs.hj;
            let where = ` 1=1 `;
            let reqParam = {};
            for (let key in params.param) {
                if (key == "Vehicleplatenumber" && params.param[key] && params.param[key] != "") {
                    where += ` and Vehicleplatenumber like :Vehicleplatenumber`;
                    reqParam['Vehicleplatenumber'] = '%' + params.param[key] + '%'
                } else if (key == "test_no" && params.param[key]) {
                    where += ` and test_no like :test_no`;
                    reqParam['test_no'] = '%' + params.param[key] + '%'
                } else if (key == "companyname" && params.param[key]) {
                    where += ` and companyname like :companyname`;
                    reqParam['companyname'] = '%' + params.param[key] + '%'
                } else if (key == "RecallResult" && params.param[key]) {
                    where += ` and RecallResult = :RecallResult`;
                    reqParam['RecallResult'] = params.param[key];
                } else if (key == 'repairdate' && params.param[key] && !params.param[key].includes("")) {
                    const repairdate1 = params.param[key][0];
                    const repairdate2 = params.param[key][1];
                    where += ` and repairdate >= :repairdate1 and repairdate <= :repairdate2`;
                    reqParam['repairdate1'] = repairdate1;
                    reqParam['repairdate2'] = repairdate2;
                }
            }

            let res = await Raw.QueryPageData(`select  RepairVeID,Costlistcode, test_no,Vehicleplatenumber,Vin,repairmileage,repairdate,settledate,
            companyname,b.address,Faultdescription from RepairInfo_M a left JOIN (SELECT companyuniquecode,address from Mstation_M) b  
            on a.companyuniquecode=b.companyuniquecode where ${where}`, params.pageNum, params.pageSize, {
                orderstr: "Vehicleplatenumber Desc",
                replacements: {
                    ...reqParam
                }
            });
            const { list, total } = res;
            return JSON.stringify({ state: 1, repairData: list, total, msg: "获取成功" })
        } catch (error) {
            console.log(error);
            this.app.CoreAPI.Log.trace('getRepairData方法报错：', error);
            return JSON.stringify({
                code: 1,
                msg: "获取失败"
            })
        }

    }
    // 统一IM
    async getAllRepairInfo({ params }, { }) {
        params = JSON.parse(params)
        // console.log('参数', params);

        const { app } = this;
        try {
            const { Raw } = app.Dbs.hj;
            let where = ` 1=1 `;
            let reqParam = {};
            for (let key in params.param) {
                if (key == "Vehicleplatenumber" && params.param[key] && params.param[key] != "") {
                    where += ` and Vehicleplatenumber like :Vehicleplatenumber`;
                    reqParam['Vehicleplatenumber'] = '%' + params.param[key] + '%'
                } else if (key == "test_no" && params.param[key]) {
                    where += ` and test_no like :test_no`;
                    reqParam['test_no'] = '%' + params.param[key] + '%'
                } else if (key == "companyname" && params.param[key]) {
                    where += ` and companyname like :companyname`;
                    reqParam['companyname'] = '%' + params.param[key] + '%'
                } else if (key == "StationCode" && params.param[key]) {
                    where += ` and b.StationCode like :StationCode`;
                    reqParam['StationCode'] = '%' + params.param[key] + '%'
                    // console.log('reqParam', reqParam);
                } else if (key == 'repairdate' && params.param[key] && !params.param[key].includes("")) {
                    const repairdate1 = params.param[key][0];
                    const repairdate2 = params.param[key][1];
                    where += ` and repairdate >= :repairdate1 and repairdate <= :repairdate2`;
                    reqParam['repairdate1'] = repairdate1;
                    reqParam['repairdate2'] = repairdate2;
                }
            }
            let userAreaRole = await this.ctx.service.hj.commonService.GetUserDetailRoleNew();
            //console.log('userAreaRole', userAreaRole);
            if (userAreaRole.provinceRole.length) {
                where += ' and test_no like :AreaCode';
                reqParam.AreaCode = userAreaRole.provinceRole[0].slice(0, 2) + '%';
            } else if (userAreaRole.cityRole.length) {
                if (userAreaRole.cityRole[0] == '2295') {
                    where += ' and test_no like :CityCode1 or test_no like :CityCode2';
                    reqParam.CityCode1 = '229583%';
                    reqParam.CityCode2 = '220581%';
                } else {
                    where += ' and test_no like :CityCode';
                    reqParam.CityCode = userAreaRole.cityRole[0].slice(0, 4) + '%';
                }
                let areaToFilter = await Raw.QueryList(`select AreaCode from Area where ParentAreaCode like '${userAreaRole.cityRole[0].slice(0, 4)}%' and Memo=2`);
                if (areaToFilter.length) {
                    areaToFilter.forEach((item, index) => {
                        where += ` and test_no not like :AreaCode${index}`;
                        reqParam[`AreaCode${index}`] = `${item.AreaCode}%`;
                    })
                }
            } else if (userAreaRole.areaRole.length) {
                where += ' and test_no like :AreaCode';
                reqParam.AreaCode = userAreaRole.areaRole[0] + '%';
            }


            let { CheckType, CheckResult } = params.param;
            if (CheckType == '1') {
                where += ` and InspectionNature = '02'`;
                if (CheckResult == '0') where += ` and VDCT = '1'`;
                else if (CheckResult == '1') where += ` and VDCT = '0'`;
            } else if (CheckType == '2') {
                where += ` and InspectionNature = '03'`;
                if (CheckResult == '0') where += ` and VDCT = '1'`;
                else if (CheckResult == '1') where += ` and VDCT = '0'`;
            }

            let RepairSql = `select RepairVeID,Costlistcode, test_no,Vehicleplatenumber,uploader,uploadTime, a.Vin,repairmileage,repairdate,settledate,Faultdescription,companyname,b.VLPNColor,b.VDCT,b.StationCode,b.DetectendTime,b.IUTYPE,b.inspectionNum,b.InspectionNature
            from RepairInfo_M a left join InspectionData b on a.test_no=b.InspectionReportNo where ${where}`
            if (params && params.IsexportExcel) {
                let res = await Raw.QueryList(RepairSql, {
                    orderstr: "repairdate Desc",
                    replacements: {
                        ...reqParam
                    }
                });
                return JSON.stringify({ state: 1, repairData: res, msg: "获取成功" })
            } else {
                let res = await Raw.QueryPageData(RepairSql, params.pageNum, params.pageSize, {
                    orderstr: "repairdate Desc",
                    replacements: {
                        ...reqParam
                    }
                });
                const { list, total } = res;
                return JSON.stringify({ state: 1, repairData: list, total, msg: "获取成功" })
            }
        } catch (error) {
            console.log(error);
            this.app.CoreAPI.Log.trace('getAllRepairInfo方法报错：', error);
            return JSON.stringify({
                code: 1,
                msg: "获取失败"
            })
        }

    }
    //获取上一次检测编号
    async getlastInspectionNum({ params }, { ctx, userid }) {
        try {
            const { app } = this;
            const { Raw } = app.Dbs.hj;
            params = JSON.parse(params)
            let lastInspectionNum = ""
            let sql = `SELECT top 1 DetectEndTime, InspectionNum ,IUTYPE from InspectionData WHERE DetectEndTime< :DetectEndTime and  VIN = :VIN  ORDER BY DetectEndTime Desc`
            let result = await Raw.Query(sql, {
                replacements: {//参数化执行
                    VIN: params.VIN,
                    DetectEndTime: params.DetectEndTime
                }
            })
            if (result && result.InspectionNum) {
                lastInspectionNum = result.InspectionNum
            }

            return { code: 1, lastInspectionNum }
        } catch (error) {
            this.app.CoreAPI.Log.trace('getlastInspectionNum方法报错：', error);
            return { code: 0, error }
        }
    }
    // 获取维修详情信息
    async getMaintainDetail({ RepairVeID }, { ctx, userid }) {
        try {
            const { app } = this;
            const { Raw } = app.Dbs.hj;
            let baseInfo = await Raw.Query(`select * from RepairInfo_M where RepairVeID='${RepairVeID}'`);
            let partsList = await Raw.QueryList(`select partsname,partsquantity,partscode from VehiclePartslist_M where RepairVeID='${RepairVeID}'`);
            let projectsList = await Raw.QueryList(`select repairproject,workinghours from RepairProjectList_M where RepairVeID='${RepairVeID}'`);
            let imgList = await Raw.QueryList(`select * from UploadFileData where BusinessTable='RepairInfo_M' and BusinessKey='${RepairVeID}' and BusinessType='77'`)
            return { code: 1, data: { baseInfo, partsList, projectsList, imgList } }
        } catch (error) {
            console.log(error);
            this.app.CoreAPI.Log.trace('getMaintainDetail方法报错：', error);
            return { code: 0, message: 'fail', error }
        }
    }

    //获取发送成功的检测信息
    async getSuccessInfoIM({ params }, { }) {
        const { app } = this;
        let { Raw } = app.Dbs.hj;
        let where = `where 1=1 `;
        try {
            params = JSON.parse(params)
            // console.log(params);
            if (params.param.stationCode && params.param.stationCode != '') {
                where += `and stationCode like '%${params.param.stationCode}%'`
            }
            if (params.param.VLPN && params.param.VLPN != '') {
                where += `and VLPN like '%${params.param.VLPN}%'`
            }
            if (params.param.InspectionNum && params.param.InspectionNum != '') {
                where += `and InspectionNum like '%${params.param.InspectionNum}%'`
            }
            if (params.param.InspectionReportNo && params.param.InspectionReportNo != '') {
                where += `and InspectionReportNo like '%${params.param.InspectionReportNo}%'`
            }
            if (params.param.VIN && params.param.VIN != '') {
                where += `and VIN like '%${params.param.VIN}%'`
            }
            if (params.param.time[0] != [] && params.param.time) {
                params.param.time[0] = moment(params.param.time[0]).format("YYYY-MM-DD 00:00:00")
                where += `and DetectEndTime >= '${params.param.time[0]}' `
            }
            if (params.param.time[1] != [] && params.param.time) {
                params.param.time[1] = moment(params.param.time[1]).format("YYYY-MM-DD 23:59:59")
                where += ` and DetectEndTime <= '${params.param.time[1]}' `
            }
            let successSql = `SELECT * from Success_sendToM ${where}`
            if (params && params.IsexportExcel) {
                let res = await Raw.QueryList(successSql, {
                    orderstr: "DetectEndTime desc"
                });
                return JSON.stringify({ state: 1, allData: res, msg: "获取成功" })
            } else {
                let res = await Raw.QueryPageData(successSql, params.pageNum, params.pageSize, {
                    orderstr: "DetectEndTime desc",
                    replacements: {
                        // VLPN: `%${VLPN}%`
                    }
                });
                const { list, total } = res;
                return JSON.stringify({ state: 1, allData: list, total, msg: "获取成功" })
            }

        } catch (error) {
            this.app.CoreAPI.Log.trace('getSuccessInfoIM方法报错' + error);
            return JSON.stringify({
                state: 0,
                msg: "获取失败"
            })
        }

    }

    //IM维修后复检情况统计
    async getIMfujianInfo({ params }, { }) {
        const { app } = this;
        let { Raw } = app.Dbs.hj;
        let where = `where 1=1 `;
        try {
            params = JSON.parse(params)
            // console.log(params);
            if (params.param.stationCode && params.param.stationCode != '') {
                where += `and stationCode like '%${params.param.stationCode}%'`
            }
            if (params.param.time[0] != [] && params.param.time) {
                params.param.time[0] = moment(params.param.time[0]).format("YYYY-MM-DD 00:00:00")
                where += `and DetectEndTime >= '${params.param.time[0]}' `
            }
            if (params.param.time[1] != [] && params.param.time) {
                params.param.time[1] = moment(params.param.time[1]).format("YYYY-MM-DD 23:59:59")
                where += ` and DetectEndTime <= '${params.param.time[1]}' `
            }
            let fujianSql = `SELECT StationCode, 
            SUM(case when  InspectionNature = '02'  then 1 else 0 end) as 'fujian',
            SUM(case when  InspectionNature = '02' and VDCT=1  then 1 else 0 end) as 'fujianTG',
            case when SUM(case when InspectionNature = '02' and VDCT=1  then 1 else 0 end) =0 then null else
            cast(round((SUM(case when  InspectionNature = '02' and VDCT=1 then 1 else 0 end)*100)  /
            SUM(case when  InspectionNature = '02' then 1 else 0 end) ,4) as numeric(7,2))   end as 'fujianTGL'
            from (SELECT StationCode,DetectEndTime,InspectionNature,VDCT from InspectionData WHERE VIN in (select  Vin from RepairInfo_M )) c ${where}
            group by StationCode `
            // console.log(fujianSql);
            if (params && params.IsexportExcel) {
                fujianSql += 'order by fujian desc'
                let res = await Raw.QueryList(fujianSql);
                return JSON.stringify({ state: 1, allData: res, msg: "获取成功" })
            } else {
                let res = await Raw.QueryPageData(fujianSql, params.pageNum, params.pageSize, {
                    orderstr: "fujian desc",
                    replacements: {
                        // VLPN: `%${VLPN}%`
                    }
                });
                const { list, total } = res;
                return JSON.stringify({ state: 1, allData: list, total, msg: "获取成功" })
            }

        } catch (error) {
            this.app.CoreAPI.Log.trace('getIMfujianInfo方法报错' + error);
            return JSON.stringify({
                state: 0,
                msg: "获取失败"
            })
        }

    }

    // 获取业务需要上传的图片
    async getImgToUpload({ BusinessType }, { ctx, userid }) {
        try {
            const { app } = this;
            const { Raw } = app.Dbs.hj;
            let AreaCode = await Raw.Query(`select FieldValue from Sys_Config where FieldKey='AreaCode'`);
            let res = await Raw.QueryList(`select rl.BusinessType_Code as BusinessType, FileGroup_Code, fg.CodeName as FileGroup_Name,IsMust 
      from RL_BusinessType_FileGroup rl, CD_FileGroup fg where rl.FileGroup_Code=fg.CodeValue 
      and rl.BusinessType_Code=:BusinessType and rl.IsAvailable=:IsAvailable and rl.CityCode=:CityCode order by FileGroup_Code`, {
                replacements: {
                    BusinessType: BusinessType,
                    IsAvailable: 1,
                    CityCode: AreaCode.FieldValue
                }
            })
            return { code: 1, data: { ImgList: res } }
        } catch (error) {
            console.log(error);
            this.app.CoreAPI.Log.trace('getImgToUpload方法报错：', error);
            return { code: 0, message: 'fail', error }
        }
    }

    //获取尾气不合格报告的数据
    async getNoQualifiedReport({
        params
    }) {
        const {
            app
        } = this;
        let where = ` where 1 = 1 `
        let {
            Raw
        } = app.Dbs.hj;
        params = JSON.parse(params);
        try {
            //params = JSON.parse(params);
            if (params.param.stationCode && params.param.stationCode != '') {
                where += `and stationCode like '%${params.param.stationCode}%'`;
            }
            if (params.param.vlpn && params.param.vlpn != '') {
                where += `and VLPN like '%${params.param.vlpn}%'`;
            }
            if (params.param.inspectionNum && params.param.inspectionNum != '') {
                where += `and InspectionNum like '%${params.param.inspectionNum}%'`;
            }
            if (params.param.inspectionReportNo && params.param.inspectionReportNo != '') {
                where += `and InspectionReportNo like '%${params.param.inspectionReportNo}%'`;
            }
            if (params.param.vin && params.param.vin != '') {
                where += `and VIN like '%${params.param.vin}%'`;
            }
            if (params.param.detectEndTime[0] != [] && params.param.detectEndTime) {
                params.param.detectEndTime[0] = moment(params.param.detectEndTime[0]).format("YYYY-MM-DD 00:00:00");
                where += `and DetectEndTime >= '${params.param.detectEndTime[0]}' `;
            }
            if (params.param.detectEndTime[1] != [] && params.param.detectEndTime) {
                params.param.detectEndTime[1] = moment(params.param.detectEndTime[1]).format("YYYY-MM-DD 23:59:59");
                where += ` and DetectEndTime <= '${params.param.detectEndTime[1]}' `;
            }
            if(params.param.iutype && params.param.iutype != ''){
                let iutypeTable = '';
                let resultStr = ''; //对应结果表的结果值字段
                where += ` and IUTYPE = '${params.param.iutype}'`;
                switch(params.param.iutype){
                    case 'A':
                        iutypeTable = 'TSIData';
                        resultStr = 'TSIED';
                        break;
                    case 'B':
                        iutypeTable = "ASMData" ;
                        resultStr = 'ASMED';
                        break;
                    case 'C':
                        iutypeTable = 'IMData';
                        resultStr = 'IMED';
                        break;
                    case 'F':
                        iutypeTable = "LightProofSmokeData" ;
                        resultStr = 'LPSED';
                        break;
                    case 'G':
                        iutypeTable = 'LDData';
                        resultStr = 'LDED';
                        break;
                    case 'J':
                        iutypeTable = "LingmanData" ;
                        resultStr = 'LGMED';
                        break;
                    default:
                        break;
                }
                where += ` and InspectionDataID in (select InspectionDataID from ${iutypeTable} where ${resultStr} = 0)`;
            }
            let strSql = `SELECT InspectionDataID,InspectionNum,InspectionReportNo,VLPN,VLPNColor,VIN,InspectionNature,InspectionKind,InspectionWay
            InspectionTimes,DetectEndTime,StationCode,FuelType,IUTYPE,VehicleID,VDCT
            from InspectionData ${where} and VDCT = '0'`;
            if (params && params.IsexportExcel) {
                let res = await Raw.QueryList(strSql, {
                    orderstr: "DetectEndTime desc"
                });
                return JSON.stringify({ state: 1, reportData: res })
            } else {
                let res = await Raw.QueryPageData(strSql, params.pageNum, params.pageSize, {
                    orderstr: "DetectEndTime desc",
                    replacements: {
                    }
                });
                return JSON.stringify({ state: 1, reportData: res.list, total:res.total })
            }
        } catch (error) {
            this.app.CoreAPI.Log.trace('getNoQualifiedReport方法报错' + error);
            return JSON.stringify({
                state: 0
            })
        }
    }
    // 获取站点权限
    async getStationFilterRole() {
        const { app } = this;
        try {
            const { Raw } = app.Dbs.hj;
            let filterCode = '';
            let userAreaRole = await this.ctx.service.hj.commonService.GetUserDetailRoleNew();
            //console.log('userAreaRole', userAreaRole);
            if (userAreaRole.provinceRole.length) {
                filterCode = userAreaRole.provinceRole[0].slice(0, 2)
            } else if (userAreaRole.cityRole.length) {
                filterCode = userAreaRole.cityRole[0].slice(0, 4)
            } else if (userAreaRole.areaRole.length) {
                filterCode = userAreaRole.areaRole[0]
            }
            return { state: 1, data: filterCode }

        } catch (error) {
            console.log(error);
            this.app.CoreAPI.Log.trace('方法报错：', error);
            return JSON.stringify({
                state: 0,
                msg: "获取失败"
            })
        }

    }


    //获取维修后是否有复检
    async getIsfujian({ params }, { ctx, userid }) {
        try {
            const { app } = this;
            const { Raw } = app.Dbs.hj;
            params = JSON.parse(params)
            console.log('&&&&&',params);
            
            let sql = `SELECT top 1 IUTYPE,StationCode,DetectEndTime,InspectionNature, InspectionNum ,VDCT from InspectionData WHERE DetectEndTime> :DetectEndTime and  VIN = :VIN  ORDER BY DetectEndTime asc`
            let result = await Raw.Query(sql, {
                replacements: {//参数化执行
                    VIN: params.Vin,
                    DetectEndTime: params.DetectendTime
                }
            })
            if (result && result.InspectionNum) {
                let nextInspectionNum = result.InspectionNum
                let nextDetectEndTime = result.DetectEndTime
                let nextVDCT = result.VDCT
                let nextStationCode = result.StationCode
                let nextIUTYPE = result.IUTYPE
                let nextInspectionNature = result.InspectionNature
                return { code: 1, nextInspectionNum, nextDetectEndTime, nextVDCT,nextStationCode,nextIUTYPE,nextInspectionNature }
            } else {
                return { code: 2 }
            }

        } catch (error) {
            console.log(error);
            this.app.CoreAPI.Log.trace('getlastInspectionNum方法报错：', error);
            return { state: 0, error }
        }
    }

}
module.exports = Repair;
