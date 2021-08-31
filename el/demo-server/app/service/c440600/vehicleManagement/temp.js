const { Service } = require('egg');
const moment = require('moment');
class AddVehicleInfoService extends Service {
    /**
     * -4：不允许受理，-3:内部代码错误，-2：不符合该审核逻辑，-1：符合该逻辑且需审核，0：允许受理且不需要审核
     * @param {*} code 
     * @param {*} isPass 
     * @param {*} InspectionData 
     */
    async GetAuditReasonStatus(code, isPass, InspectionData) {
        let { transaction, Raw } = this.app.Dbs.hj;
        let cuser = ctx.helper.getCurrentUser();
        let areaCode = cuser['areaCode'];
        let countyCode = cuser['countyCode'];
        let sql = `select * from AuditReasonList where AuditReasonCode =:code and CityCode =:areaCode  and IsAvailable=1`;
        let list = await Raw.QueryList(sql, {
            replacements: {
                code, areaCode
            }
        });
        let IsCanAccept = 1; //默认允许受理
        let IsNeedAudit = 0; //默认不需审核
        let IsAutoAudit = 0; //默认不自动审核
        let index = 0;
        let res = {
            status: -4,
            msg: '',
            isAutoCheck: ''//自动审核次数
        }
        for (let i = 0; i < list.length; i++) {
            let obj = list[i];
            if (obj.CountyCode != null && obj.CountyCode == countyCode) {
                index = i; break;
            } else if (obj.CountyCode == null || obj.CountyCode == '') {
                index = i;
            }
        }
        if (list.length > 0) {
            if (isPass && list[index].IsCanAccept != null && list[index].IsCanAccept != '') {
                IsCanAccept = list[index].IsCanAccept;
                if (list[index].IsNeedAudit != null && list[index].IsNeedAudit != '') {
                    IsNeedAudit = list[index].IsNeedAudit;
                }
                if (list[index].IsAutoAudit != null && list[index].IsAutoAudit != '') {
                    IsAutoAudit = list[index].IsAutoAudit;
                }
                if (IsCanAccept != null && IsCanAccept == 0) {//不允许受理
                    res.status = -4;
                    if (list[index].Tips != null && list[index].Tips != '') {
                        res.msg = list[index].Tips + "不允许受理";
                    } else {
                        //跨站检测申请
                        if (code == "18") {
                            res.msg = `不允许跨站检测，车辆${InspectionData.VLPN}上一次检测时间${InspectionData.DetectEndTime}，在${InspectionData.StationShortName}检测未通过，请回${InspectionData.StationShortName}进行检测登录！`;
                        } else {
                            res.msg = list[index].AuditReasonName + "不允许受理";
                        }
                    }
                } else {
                    if (IsNeedAudit == 1) {
                        res.status = -1;
                        if (IsAutoAudit == 1) {
                            res.isAutoCheck += "1";
                        } else {
                            res.isAutoCheck += "0";
                            if (list[index].Tips != null && list[index].Tips != '') {
                                res.msg += list[index].Tips + ",";
                            }
                            //跨站检测申请
                            if (code == "18") {
                                res.msg += `[车辆${InspectionData.VLPN} 上一次在${InspectionData.DetectEndTime}，在${InspectionData.StationShortName}检测未通过！],需要进行跨站`;
                            }
                        }
                    } else {
                        res.status = 0;
                    }
                }
            } else {
                res.status = -2;
            }
        } else {
            sql = `select * from CD_AuditReason where CodeValue =:code and IsAvailable=1`;
            list = await Raw.QueryList(sql, {
                replacements: {
                    code
                }
            });
            if (list.length > 0) {
                IsCanAccept = list[index].IsCanAccept;
                if (list[index].IsNeedAudit != null && list[index].IsNeedAudit != '') {
                    IsNeedAudit = list[index].IsNeedAudit;
                }
                if (isPass) {
                    if (IsCanAccept != null && IsCanAccept == 0) {//不允许受理
                        res.status = -4;
                        if (list[index].Tips != null && list[index].Tips != '') {
                            res.msg = list[index].Tips;
                        } else {
                            if (code == "18") {
                                res.msg += `不允许跨站检测，车辆${InspectionData.VLPN}上一次检测时间${InspectionData.DetectEndTime}，在${InspectionData.StationShortName}检测未通过，请回${InspectionData.StationShortName}进行检测登录！`;
                            } else {
                                res.msg = list[index].CodeName + "不允许受理";
                            }
                        }
                    } else {
                        if (IsNeedAudit == 1) {
                            res.status = -1;
                            if (list[index].Tips != null && list[index].Tips != '') {
                                res.msg += list[index].Tips + ",";
                            }
                            //跨站检测申请
                            if (code == "18") {
                                res.msg += `[车辆${InspectionData.VLPN} 上一次在${InspectionData.DetectEndTime}，在${InspectionData.StationShortName}检测未通过！],需要进行跨站`;
                            }
                        } else {
                            res.status = 0;
                        }
                    }
                } else {
                    res.status = -2;
                }
            } else {
                res.status = -2;
            }
        }
        return res;
    }
    /**
     * 多检限制
     * @param {*} VehicleID 
     */
    async IsNeedAstrictMoreInspection(VehicleID) {
        let { transaction, Raw } = this.app.Dbs.hj;
        let res = {
            isOk: true,
            msg: ''
        }
        let sql = `select * from InspectionAudit where VehicleID=:VehicleID order by InspectionAuditID desc`;
        let list = await Raw.QueryList(sql, {
            replacements: {
                VehicleID
            }
        });
        if (list.length > 0) {
            if (list[0].AuditState != null && list[0].AuditState == "1") {
                res.isOk = false;
                return res;
            }
            let checkReInspection = await this.GetAuditReasonStatus("28", true, null);//复检审核
            let IsOkInspectionDate = list[0].IsOkInspectionDate;
            let now = moment().format('YYYY-MM-DD HH:mm:ss');
            if (IsOkInspectionDate > now && checkReInspection.status != -1) {
                res.isOk = true;
            } else {
                res.isOk = false;
            }
            //揭阳：若当前时间大于允许检测时间且受理审核设置设置了复检审核需要审核的，则允许受理
            if (IsOkInspectionDate < now && checkReInspection.status == -1) {
                checkReInspection.status = -2;
            }
            //江门：若复检提交了维修单，则可以继续受理
            let CheckAccptanceOnlyWeiXiuFile = await this.ctx.hleper.getAllSystemParam("01_CheckAccptanceOnlyWeiXiuFile")
            if (CheckAccptanceOnlyWeiXiuFile) {
                let InspectionNum = list[0].InspectionNum;
                sql = `select count(1) as c from UploadFileData where FileGroup='06' and BusinessType='11' and BusinessKey=:InspectionNum`;
                let fileInfo = await Raw.Query(sql, { replacements: { InspectionNum } });
                if (fileInfo.c > 0) {
                    res.isOk = true;
                    res.msg = '请上传维修凭证！';
                } else {
                    res.isOk = false;
                }
            }
        } else {
            res.isOk = false
            // return false;
        }
        return res;
    }
    /**
     * 是否存在waitcheck信息
     * //-4:不允许受理，-3:内部代码报错，-2:不符合该逻辑，-1:允许受理但需审核，0允许受理且不需要审核
     * @param {*} content 
     * @param {*} param1 
     */
    async IsExitsWaitCheck_New(content, { ctx, userid }) {
        let res = { status: -2, msg: '' };
        let checkObj = { checkR: '', isu: '' };
        let { Mileage, acceptance, applyAccReason, fgkreason, gavecReason, inspectionNum, isAccAudit, passReason, recheckReason, VehicleID } = content;
        let isTrue = await this.GetWhiteListByVehicleID(VehicleID);
        if (isTrue) {
            return this.ctx.helper.success(res);
        }
        //测试性检测&&!监督性检测
        if (acceptance.InspectionKind == "99" && acceptance.InspectionWay != "93") {
            return this.ctx.helper.success(res);
        } else {
            let IsNeedMoreAcceptance = await this.ctx.helper.getAllSystemParam('01_IsNeedMoreAcceptance');
            //多受理限制：当该车存在多受理审核表中，且不在允许再次受理的时间范围内，则不允许再次受理
            if (IsNeedMoreAcceptance) {
                let IsOkAcceptanceDate = await this.IsNeedAstrictMoreAcceptance(VehicleID);
                if (IsOkAcceptanceDate != '') {
                    let AstrictMoreAcceptance = (await this.ctx.helper.getAllSystemParam('01_AstrictMoreAcceptance')) - 1;
                    res.status = -4;
                    res.msg = "默认当天只允许受理" + AstrictMoreAcceptance + "次，需等待下次受理时间开始或联系管理员！";//这里提示有问题？
                    return this.ctx.helper.success(res);
                }
            }
            //是否启动检测不合格时开启复检限制
            let IsNeedAstrictMoreInspection = await this.ctx.helper.getAllSystemParam('01_IsNeedAstrictMoreInspection');
            if (IsNeedAstrictMoreInspection) {
                let astrict = await this.IsNeedAstrictMoreInspection(VehicleID);
                if (astrict.isOk) {
                    res.status = -4;
                    res.msg = astrict.msg;
                    if (res.msg == null || res.msg == '') {
                        res.msg = '上一次车辆检测不合格，请维修后再受理检测！';
                    }
                    return this.ctx.helper.success(res);
                }
            }
            //贵州：检测不合格后是否需要验证该车的维修信息状态，true需要验证，false不需要
            let CheckLastInspectionNeedMainTaince = await this.ctx.helper.getAllSystemParam('01_CheckLastInspectionNeedMainTaince');
            if (CheckLastInspectionNeedMainTaince) {
                let maintance = await this.CheckLastInspectionNeedMainTaince(VehicleID);
                if (maintance) {
                    res.status = -4;
                    res.msg = '上一次车辆检测不合格，请维修后或上传维修凭证后再进行受理！';
                    return this.ctx.helper.success(res);
                }
            }
            //海南：检测不合格是否需要验证该车的维修信息状态，true需要验证，false不需要
            let CheckLastInspectionNeedMainTainceHN = await this.ctx.helper.getAllSystemParam('01_CheckLastInspectionNeedMainTainceHN');
            if (CheckLastInspectionNeedMainTainceHN) {
                let maintance = await this.CheckLastInspectionNeedMainTainceHN(VehicleID);
                let UploadIMFiles = await this.ctx.helper.getAllSystemParam('01_UploadIMFiles');
                if (UploadIMFiles == null || UploadIMFiles == '') {
                    res.msg = '该车未接收到M站的维修信息，请等待！';
                } else {
                    res.msg = '该车未接收到M站的维修信息或审核不通过或未审核，请等待！';
                }
                if (maintance) {
                    res.status = -4;
                    return this.ctx.helper.success(res);
                }
            }
            //特殊车辆是否启动受理限制
            let IsSpecialAllowVehicle = await this.ctx.helper.getAllSystemParam('01_IsSpecialAllowVehicle');
            if (IsSpecialAllowVehicle) {
                let SpecialAllowCar = await this.IsSpecialAllowCar(VehicleID);
                if (SpecialAllowCar) {
                    res.status = -2;
                    return this.ctx.helper.success(res);
                }
            }
            //判断该车辆是否存在上一条受理审核的记录，若存在未审核的，则提示用户不要重复提交
            let IsCanAcc = await this.GetLastAccAuditResult(VehicleID);
            if (IsCanAcc.isOk) {
                //是否选择继续受理
                if (isAccAudit == 0) {

                }
            } else {
                res.status = -4;
                if (IsCanAcc.checkStatus == "1") {
                    res.msg = "该车辆上一次受理审核结果为退回,请在审核检索页面操作上次的提交记录";
                    return this.ctx.helper.success(res);
                } else {
                    res.msg = "该车辆上一次受理审核状态为未审核,请等待环保部门审核";
                    return this.ctx.helper.success(res);
                }
            }
        }
        let sql = ``;
    }
    async AudtiVecNeedAcceptance(VehicleID) {
        let res = {};
        let { transaction, Raw } = this.app.Dbs.hj;
        let sql = `select CodeValue,CodeName,IsAvailable from CD_AuditReason where CodeValue in ('23','24','25') and IsAvailable='1'`;
        let list = await Raw.QueryList(sql, { replacements: {} });
        let checkGAVec = 0;
        let checkPass = 0;
        let checkReCheck = 0;
        if (list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].CodeValue == "23") {
                    checkGAVec = 1;
                } else if (list[i].CodeValue == "24") {
                    checkPass = 1;
                } else {
                    checkReCheck = 1;
                }
            }
            let EnableDataSwitchingWithPolice = await this.ctx.helper.getAllSystemParam('01_EnableDataSwitchingWithPolice');//公安数据联网模式
            let InspectionPassNoAcc = await this.ctx.helper.getAllSystemParam('01_InspectionPassNoAcc');//受理时上传检测通过一个月内不给受理
            let EnableReCheck = await this.ctx.helper.getAllSystemParam('01_EnableReCheck');//复检时间间隔限定
            if (EnableDataSwitchingWithPolice == '1' && checkGAVec == 1) {

            }
            if (InspectionPassNoAcc && checkPass == 1) {

            }
            if (EnableReCheck && checkReCheck == 1) {

            }
        }
    }
    async CheckInspectionVDCT(VehicleID) {
        let lastInspectionData = await this.GetLastInspectionData(VehicleID);
        if (lastInspectionData.length > 0) {
            let now = moment();
            let jcrq = moment(lastInspectionData.IUIDATE);
            if (now.diff(jcrq, 'months') >= 1) {
                return 2;
            }
            let UseNewVDCT = await this.ctx.helper.getAllSystemParam('01_UseNewVDCT');//判断检测结果是否使用主检查表的
            if (UseNewVDCT) {
                return
            }
        } else {
            return 2;
        }
    }
    /**
     * 获取这辆车最新的受理审核记录，若未审核，则直接提醒上一条记录尚未审核
     * @param {*} VehicleID 
     */
    async GetLastAccAuditResult(VehicleID) {
        let res = {
            isOk: true,
            checkStatus: ""
        }
        let { transaction, Raw } = this.app.Dbs.hj;
        let sql = `select top 1 Status,AuditState from WaitCheck where CheckType = '20' and BusinessTable = 'AcceptanceAudit' and VehicleID =:VehicleID order by ApplyTime desc`;
        let list = await Raw.QueryList(sql, { replacements: { VehicleID: VehicleID } })
        if (list.length > 0) {
            if (list[0].Status == null || list[0].Status == '') {
                // return res;
                res.isOk = true;
            } else if (list[0].Status == "0") {//未审核
                res.isOk = false;
                res.checkStatus = "0";
            } else if (list[0].Status == "1" && list[0].AuditState == "4") {//已审核&&退回
                res.isOk = false;
                res.checkStatus = "1";
            } else {
                res.isOk = true;
            }
        }
        return res;
    }
    /**
     * 是否是特殊车辆
     * @param {*} VehicleID 
     */
    async IsSpecialAllowCar(VehicleID) {
        let { transaction, Raw } = this.app.Dbs.hj;
        let sql = `select * from SpecialAllowVehicle where IsAvailable='1' and VehicleID=:VehicleID`;
        let list = await Raw.QueryList(sql, { replacements: { VehicleID: VehicleID } });
        if (list.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * 通过VehicleID ,获取最新检测数据是否合格，且是否有维修记录或维修记录（河南逻辑）
     * @param {*} VehicleID 
     * @returns true 通过 false 不通过
     */
    async CheckLastInspectionNeedMainTainceHN(VehicleID) {
        let { transaction, Raw } = this.app.Dbs.hj;
        let lastInspectionData = await this.GetLastInspectionData(VehicleID);
        if (lastInspectionData.length > 0) {
            lastInspectionData = lastInspectionData[0];
            let OverInspectionTimesNeedRepair = await this.ctx.helper.getAllSystemParam('01_OverInspectionTimesNeedRepair');
            if (lastInspectionData.VDCT == "0" && lastInspectionData.InspectionTimes >= OverInspectionTimesNeedRepair) {
                let sql = `select * from WaitCheck where  BusinessKey=:InspectionNum  and  CheckType='42' order by ApplyTime desc`;
                let list = await Raw.QueryList(sql, { replacements: { InspectionNum: lastInspectionData.InspectionNum } });
                if (list.length > 0 && list[0].Status == "1" && (list[0].AuditState == "1" || list[0].AuditState == "3")) {
                    return false;
                } else {
                    sql = `select repairdate,repairStatus from RepairInfo_M where (RecallResult !=1 or RecallResult is null)   and (test_no =:InspectionNum  or  test_no =:InspectionReportNo) order by RepairVeID desc`;
                    let list = await Raw.QueryList(sql, { replacements: { InspectionNum: lastInspectionData.InspectionNum, InspectionReportNo: lastInspectionData.InspectionReportNo } });
                    if (list.length > 0 && list[0].repairdate >= lastInspectionData.DetectEndTime) {
                        let UploadIMFiles = await this.ctx.helper.getAllSystemParam('01_UploadIMFiles');
                        if (UploadIMFiles == null || UploadIMFiles == '') {
                            return false;
                        } else if (list[0].repairStatus == null && list[0].repairStatus == "01") {//原逻辑的bug，暂不删除
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                }
            }
        } else {
            return false;
        }
    }
    /**
     * 通过VehicleID ,获取最新检测数据是否合格，且是否有维修记录或维修记录（贵州逻辑）
     * @param {*} VehicleID 
     * @returns true 通过 false 不通过
     */
    async CheckLastInspectionNeedMainTaince(VehicleID) {
        let { transaction, Raw } = this.app.Dbs.hj;
        let lastInspectionData = await this.GetLastInspectionData(VehicleID);
        if (lastInspectionData.length > 0) {
            lastInspectionData = lastInspectionData[0];
            if (lastInspectionData.VDCT == "0") {
                let sql = `select Ack,MaintenanceTime from MaintenanceData where InspectionNum =:InspectionNum`;
                let list = await Raw.QueryList(sql, { replacements: { InspectionNum: lastInspectionData.InspectionNum } })
                if (list.length > 0 && list[0].MaintenanceTime >= lastInspectionData.DetectEndTime) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    /**
     * 多受理限制
     * @param {*} VehicleID 
     */
    async IsNeedAstrictMoreAcceptance(VehicleID) {
        let { transaction, Raw } = this.app.Dbs.hj;
        let sql = ` select * from MutiAcceptanceAudit where VehicleID=:VehicleID order by AcceptanceAuditID desc`;
        let list = await Raw.QueryList(sql, {
            replacements: {
                VehicleID
            }
        });
        if (list.length > 0) {
            let now = moment().format('YYYY-MM-DD HH:mm:ss');
            console.log(list[0].IsOkAcceptanceDate);
            if (list[0].IsOkAcceptanceDate > now) {
                return list[0].IsOkAcceptanceDate;
            }
        }
        return '';
    }
    /**
     * 根据车辆Id获取最新的检测信息
     * @param {*} VehicleID 
     */
    async GetLastInspectionData(VehicleID) {
        let sql = `select * from InspectionData where VehicleID=:VehicleID and InspectionKind != '99'  order by DetectEndTime desc`;
        let list = await Raw.QueryList(sql, {
            replacements: {
                VehicleID
            }
        });
        return list;
    }
    /**
     * 保存跨站记录
     * @param {*} content 
     * @param {*} cuser 
     */
    async SaveCrossVecByVehicleID(content, cuser) {
        let { transaction, Raw } = this.app.Dbs.hj;
        let params = {
            LastInspectionOperator: content.InspectionOperator,
            LastInspectionResult: content.VDCT,
            LastInspectionStation: content.StationCode,
            LastInspectionTime: content.DetectEndTime,
            InspectionStation: cuser['userOrg'],
            Recorder: cuser['displayName'],
            RecordTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            VehicleID: content.VehicleID,
        }
        await Raw.Insert('CrossStationRecord', params);
    }
    /**
     * 根据车辆ID获取白名单列表
     * @param {*} VehicleID 车辆ID
     */
    async GetWhiteListByVehicleID(VehicleID) {
        let sql = `select * from WhiteList where VehicleID =:VehicleID and WLType='02'`;
        let { transaction, Raw } = this.app.Dbs.hj;
        let list = await Raw.QueryList(sql, {
            replacements: {
                VehicleID
            }
        });
        if (list.length > 0) {
            let accInfo = await this.GetLastInspectionData(VehicleID);
            if (accInfo.length > 0) {
                let cuser = ctx.helper.getCurrentUser();
                accInfo = accInfo[0];
                if (accInfo.VDCT == "0" && cuser['userOrg'] != accInfo.StationCode && accInfo.InspectionWay != '03' && accInfo.InspectionWay != '04') {
                    await this.SaveCrossVecByVehicleID(accInfo, cuser);
                }
            }
            if (list[0].WLNature == "0") {
                sql = ` select VehicleID,VLPNColor,VLPN,VIN,WLTYPE,Reason,InsertDate,LastUploadDate,Operator,WLNature from WhiteList where VehicleID =:VehicleID and WLType='02'`;
                let winf = await Raw.Query(sql, {
                    replacements: {
                        VehicleID
                    }
                });
                await Raw.Insert('WhiteListLog', winf);
                await Raw.Delete('WhiteList', {
                    wherestr: `where VehicleID =:VehicleID and WLType='02'`,
                    replacements: {
                        VehicleID
                    }
                });
                this.ctx.helper.DeleteHashSetKeyToRedis('bd/whitelist', VehicleID);
            }
            return true;
        } else {
            return false;
        }
    }
    /**
     * 生成受理编号
     * @param {*} content 
     * @param {*} param1 
     */
    async GetInspectionNum(content, { ctx, userid }) {
        let cuser = ctx.helper.getCurrentUser();
        let InspectionNum = this.ctx.helper.GetInspectionNum(cuser['userOrg'], cuser['userLine']);
        return this.ctx.helper.success(InspectionNum);
    }
    /**
     * 查询redis中是否存在受理信息
     * @param {*} content VehicleID 车辆ID 
     * @param {*} param1 
     */
    async CheckVehicleInAcceptanceRedis(content, { ctx, userid }) {
        let { VehicleID } = content;
        let key = "bd/acceptance";
        let hj = Object.keys(this.app.config.redis.clients);
        hj = hj.filter((item) => item.includes("hj"));
        let org = this.ctx.helper.getCurrentUser('userOrg');
        console.log(org);
        if (hj.length == 1) {
            let map = await this.app.redis.get(hj[0]).hgetall(key);
            for (let key in map) {
                let t = map[key];
                if (t.VehicleID == VehicleID && t.StationCode == org) {
                    return this.ctx.helper.success(true);//存在
                }
            }
            return this.ctx.helper.success(false);
        } else {
            for (let str of hj) {
                let map = await this.app.redis.get(str).hgetall(key);
                for (let key in map) {
                    let t = map[key];
                    if (t.VehicleID == VehicleID && t.StationCode == org) {
                        return this.ctx.helper.success(true);//存在
                    }
                }
            }
            return this.ctx.helper.success(false);
        }
    }
    /**
     * 获取同一周期的检测次数
     * @param {*} content VehicleID 车辆ID 
     * @param {*} param1 
     */
    async GetInspectionTimes(content, { ctx, userid }) {
        let { transaction, Raw } = this.app.Dbs.hj;
        let { VehicleID } = content;
        let info = await ctx.helper.getVehicleInfo({ VehicleID: VehicleID });
        let now = moment().format('YYYY-MM-DD')
        let res = ctx.helper.GetVehicleInspectionPeriod(info[0], new Date(now));
        if (res != null) {
            console.log(res.PeriodDate);
            let startTime = res.PeriodDate.setMonth(res.PeriodDate.getMonth() - res.PeriodMonth);
            startTime = moment(startTime).format('YYYY-MM-DD');
            let endTime = res.PeriodDate;
            endTime = moment(endTime).format('YYYY-MM-DD');
            let sql = `select count(1) as c from InspectionData where VehicleID=:VehicleID and IUIDATE>=:startTime and IUIDATE<=:endTime `;
            let inf = await Raw.Query(sql, {
                replacements: {
                    VehicleID, startTime, endTime
                }
            }) || {};
            return ctx.helper.success(inf.c + 1);
        }
        return ctx.helper.success(1);
    }
    /**
     * 获取车辆文件信息
     * @param {*} content ID 业务id TYPE 
     * @param {*} param1 
     */
    async GetBusinessFileInfo(content, { ctx, userid }) {
        let { transaction, Raw } = this.app.Dbs.hj;
        let { ID, TYPE, OP, VehicleID } = content;
        let sql = `select  BusinessAuditID,VehicleID,FileBusinessGroup,FullFileName,DisplayName,FileBusinessType,Bytes from BusinessFileInfo where `;
        if (OP == "1") {//获取外地转入二手车
            sql += " BusinessAuditID=:ID and FileBusinessGroup=:TYPE ";
        } else if (OP == "2") { //获取委托书
            sql += " BusinessAuditID=:ID and FileBusinessGroup=:TYPE and DisplayName like '%委托书%' ";
        } else if (OP == "3") {//获取工转非
            sql += " VehicleID=:ID and FileBusinessGroup=:TYPE and DisplayName like '%工转非%' ";
        } else if (OP == "4") {
            sql += " BusinessAuditID=:ID and FileBusinessGroup=:TYPE ";
        } else if (OP == "5") {
            let wait = Raw.Query("select * from WaitCheck where checkId=:ID", { replacements: { ID } }) || {};
            if (wait.Status == "1") {
                //1、已审核
                if (wait.AuditState == "1") {
                    //审核通过
                    sql += " BusinessAuditID=VehicleID and VehicleID=:VehicleID and  Remark = '审核通过' and FileBusinessGroup=:TYPE";
                } else {
                    //审核不通过
                    sql += " BusinessAuditID=:ID and VehicleID=:VehicleID and  Remark = '审核不通过' and FileBusinessGroup=:TYPE";
                }

            } else {
                //2、未审核
                sql += " BusinessAuditID=VehicleID and VehicleID=:VehicleID and  Remark =:ID and FileBusinessGroup=:TYPE";
            }
        } else {//获取审核图片
            sql += " BusinessAuditID=:ID and FileBusinessGroup=:TYPE ";
        }
        let list = await Raw.QueryList(sql, { replacements: content });
        let res = [];
        if (list != null && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                let info = list[i];
                let temp = {};
                if (info.Bytes == null) {
                    let url = info.FullFileName;
                    temp["Byte"] = ctx.helper.pathToBase64(url);
                } else {
                    temp["Byte"] = info["Bytes"];
                }
                temp["Name"] = info["DisplayName"];
                temp["BusinessAuditID"] = info["BusinessAuditID"];
                temp["VehicleID"] = info["VehicleID"];
                temp["FileBusinessGroup"] = info["FileBusinessGroup"];
                temp["FileBusinessType"] = info["FileBusinessType"];
                res.push(temp);
            }
            return ctx.helper.success(res);
        } else {
            return ctx.helper.error("获取图片失败");
        }
    }
    /**
     * 添加车辆改变三元催化装置预警
     * @param {*} content VLPN:  StationCode: VIN:  CityCode: 
     * @param {*} param1 
     */
    async ChangeHacCCAToAlarm(content, { ctx, userid }) {
        let { transaction, Raw } = this.app.Dbs.hj;
        let { VLPN, StationCode, VIN, CityCode } = content;
        await Raw.Insert("V_Alarm", {
            StationCode,
            VIN,
            AlarmTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            AlarmType: '26',
            AlarmDeal: '01',
            AlarmRecord: '三元催化由是更新为否',
            IsAlarm: '1',
            Remark: '',
            VLPN,
            CityCode
        });
    }
    /**
     * 车辆类型查询（方式二）
     * @param {*} content 
     * @param {*} param1 
     */
    async DaGetEmissionStandardOfVehicletaQuery(content, { ctx, userid }) {
        return ctx.helper.GetEmissionStandardOfVehicle(content);
    }
    /**
     * 根据车架号判断车辆是否存在
     * @param {*} content 
     * @param {*} param1 
     */
    async VehicleExistsByVINOrVLPNAndColor(content, { ctx, userid }) {
        let { vin, vlpn, vlpnColor, vinsame } = content;
        let samellow = await ctx.helper.getAllSystemParam("01_IsAllowTheSameVINOrVLPNAndColor");
        if (vinsame != null && vinsame == "0") {
            samellow = false;
        }
        let isAllow = await ctx.helper.getAllSystemParam("01_IsAllowTheSameVINOrVLPNAndColor");
        // let priCode=ctx.helper.getCurrentUser('priCode');
        let rnt = await ctx.helper.VehicleExistsByVINOrVLPNAndColor(vin, vlpn, vlpnColor, content.VehicleID, null, samellow);
        return ctx.helper.success({ Have: rnt, IsAllow: isAllow })
    }
    /**
     * 车辆保存接口
     * @param {*} content data 车辆信息实体; type 业务类型：0为机动车检测，1为6年免检车辆，2为标志核发车辆，3为旧牌新用，4二手车转入 ;GASM 是否为公安扫描录入车辆信息，true为是，false不是; way 审核排放标准的方式（1.方式一审核，2.方式二审核）
     * @param {*} param1 
     */
    async SaveNewVehicle(content, { ctx, userid }) {
        let isAudit = 0;
        let checkId = 0;
        let { data, vdata, type, GASM, way } = content;
        let { app } = this;
        let { transaction, Raw } = app.Dbs.hj;
        if (ctx.helper.isEmpty(data.VLPN)) {
            return ctx.helper.error("车牌号码为空，请重新填写！");
        }
        if (ctx.helper.isEmpty(data.VLPNColor)) {
            return ctx.helper.error("车牌颜色为空，请重新填写！");
        }
        if (ctx.helper.isEmpty(data.EmissionStandard)) {
            return ctx.helper.error("排放标准为空，请重新填写！");
        }
        data.VerifyWay = way;
        if ((type == "2" || type == "3") && ctx.helper.isNotEmpty(data.VehicleID)) {
            // return ctx.helper.error("标志核发车辆或者旧牌新用车辆，只能做车辆新增录入，不允许修改录入！");
            return ctx.helper.error("旧牌新用车辆，只能做车辆新增录入，不允许修改录入！");
        }
        //判断排放标准是否一致
        if ((type == "0" || type == "1" || type == "4") && ctx.helper.isNotEmpty(data.VehicleID)) {
            let sql = `select * from Vehicle where vehicleId=:VehicleID`;
            let oldCar = await Raw.Query(sql, {
                replacements: {
                    VehicleID: data.VehicleID
                }
            }) || {};
            if (oldCar.EmissionStandard != null && oldCar.EmissionStandard != data.EmissionStandard) {
                return ctx.helper.error("该车的排放标准已存在，需修改请联系相应部门！");
            }
            data.VehicleKind = oldCar.VehicleKind;
        }
        let changeDataSoure = "";
        if (type === "0") {
            changeDataSoure = "机动车检测录入";
            data.IsSecondHandCar = null;
            data.SecondHandCarPlace = null;
            data.VehicleKind = "02";
        } else if (type === "1") {
            changeDataSoure = "6年免检车辆录入";
            if (ctx.helper.isEmpty(data.VehicleKind)) {
                data.VehicleKind = "02";
            }
        } else if (type === "2") {
            changeDataSoure = "标志核发车辆录入";
            data.VehicleKind = "01";
        } else if (type === "3") {
            await Raw.Update("Vehicle", { VLPN: data.VLPN + "原" }, {
                wherestr: "where VLPN=:VLPN and VLPNColor=:VLPNColor and IsInValid <>1",
                replacements: {
                    VLPN: data.VLPN,
                    VLPNColor: data.VLPNColor
                }
            });
        } else if (type === "4") {
            if (data.SecondHandCarPlace == "0") {
                changeDataSoure = "车辆变更登记";//变更登记            
                data.EStatus = "22";
            } else {
                changeDataSoure = "外地转入二手车";//外地转入二手车
            }
            data.VehicleKind = "03";
            data.IsSecondHandCar = "1";
        } else if (type === "5") {
            changeDataSoure = "预留情况";//预留情况
            data.VehicleKind = "02";
        } else {
            changeDataSoure = "车辆信息录入";
        }
        data.VLPN = data.VLPN.toUpperCase();
        data.VIN = data.VIN.toUpperCase();
        if (ctx.helper.isNotEmpty(data.IUVTYPE)) {
            data.IUVTYPE = data.IUVTYPE.toUpperCase();
        }
        if (ctx.helper.isNotEmpty(data.EngineNum)) {
            data.EngineNum = data.EngineNum.toUpperCase();
        }
        if (ctx.helper.isNotEmpty(data.TyreType)) {
            data.TyreType = data.TyreType.toUpperCase();
        }
        if (ctx.helper.isNotEmpty(data.ChassisType)) {
            data.ChassisType = data.ChassisType.toUpperCase();
        }
        if (ctx.helper.isEmpty(data.VStatus)) {
            data.VStatus = 'A';
        }
        if (ctx.helper.isEmpty(data.EStatus)) {
            data.EStatus = '01';
        }
        data.IsInValid = '0';
        //已经不发标了，省去发标逻辑
        // if(){...}
        //二维码扫描录入的车辆信息时，如果存在相同车架号，则用新的车辆信息覆盖旧的车辆信息。
        let VehicleID = data.VehicleID;
        let cuser = ctx.helper.getCurrentUser();
        let loginName = cuser['loginName'];
        if (ctx.helper.isNotEmpty(loginName)) {
            loginName = decodeURI(loginName);
        }
        let displayName = cuser['displayName'];
        if (ctx.helper.isNotEmpty(displayName)) {
            displayName = decodeURI(displayName);
        }
        let now = moment().format('YYYY-MM-DD HH:mm:ss');
        if (GASM) {
            let sql = `select * from Vehicle where VIN=:VIN`;
            let oldInfo = await Raw.Query(sql, {
                replacements: {
                    VIN: data.VIN
                }
            }) || {};
            if (ctx.helper.isNotEmpty(oldInfo.VehicleID)) {
                let gf = ['VLPN', 'VLPNColor', 'GAVType', 'EmissionStandard', 'UseOfAuto', 'FactoryPlateModel', 'IUVTYPE', 'IUETYPE', 'VIN', 'EngineNum', 'VRDATE', 'ProductDate', 'RatedSeats', 'VML', 'KerbMass', 'BenchmarkMass', 'IUVMANU', 'FuelType', 'EDSPL', 'EnginePower', 'OwnerName', 'Address', 'Tel', 'CredentialsType', 'CredentialsNum', 'OilSupplyWay', 'IntakeWay', 'EngineRatedSpeed', 'Mileage', 'OCHA', 'Province', 'City', 'County', 'EStatus', 'VehicleBigType', 'IUEMANU', 'GAIUVTYPE', 'VStatus', 'IsLocalInspection', 'IsInValid', 'IsImportedCar', 'PG', 'CatalyticConvertersAndCorp', 'GasVentCount', 'AxleWeight', 'HasOBD', 'IsDoubleFuel', 'HasOxygenSensor', 'HasCCA', 'RegistDate', 'AbandonedYear', 'VariableForm', 'ChassisType', 'GearCount', 'StrokeCount', 'CylinderCount', 'DriveForm', 'TyreType', 'Remarks', 'VehicleKind', 'BZTYPE']
                for (let str of gf) {
                    oldInfo[str] = data[str];
                }
                oldInfo['State'] = '2';
                oldInfo['PriCode'] = cuser['priCode'] || '4406';
                oldInfo['UniqueString'] = ctx.helper.getUniqueString(cuser['userOrg'], cuser['userLine']);
                let rr = await ctx.helper.UpdateCar(oldInfo, changeDataSoure + "（公安二维码扫描存在相同车架号新车信息覆盖旧车信息）", loginName);
                if (rr.code == 0) {
                    let t = rr.data;
                    rr.data = {};
                    rr.data.Vehicle = t;
                    rr.data.isAudit = isAudit;
                    rr.data.checkId = checkId;
                }
                return rr;
            }
        }
        if (ctx.helper.isEmpty(VehicleID)) {//新增
            if (ctx.helper.isEmpty(data.VehicleKind)) {
                data.VehicleKind = "01";
            }
            data.State = '3'
            data.UniqueString = ctx.helper.getUniqueString(cuser['userOrg'], cuser['userLine']);
            data.DataSources = changeDataSoure;
            data.UpdateDataSources = changeDataSoure;
            if (data.xh) {
                data.IsAndPoliceMatch = "1";
            }
            data.CreateTime = now;
            data.Creater = loginName;
            let temp = ctx.helper.filterVehicleFields(data);
            delete temp['VehicleID'];
            await Raw.Insert("Vehicle", temp);
            // let list=await ctx.helper.getVehicleInfo({vin:data.VIN,vlpn:data.VLPN,vlpnColor:data.VLPNColor});
            // if(ctx.helper.isNotEmpty(list)){
            //     data.VehicleID=list[0].VehicleID;
            //     data.State="1";
            // }
            let next_id = await Raw.Query("select @@IDENTITY as ID") || {};
            data.VehicleID = next_id.ID;
            data.State = "1";
            if (await ctx.helper.getAllSystemParam("01_IsAddToSAVehicle") && (data.VLPN.indexOf(await ctx.helper.getAllSystemParam('01_CityVlpnProfixCond')) >= 0) && data.VML > 3500 && data.FuelType == "B") {
                await this.IsAddToSpecialAttentionVehicle(data);
            }
            ///是否开启车辆黑名单
            if (await ctx.helper.getAllSystemParam("01_IsHeavyOilCarAddToBlackList") && (data.VML > 3500 && data.FuelType == "B")) {
                await this.AddOrUpdateBlacklist(data);
            }
        } else {//修改
            if (ctx.helper.isEmpty(data.VehicleKind)) {
                data.VehicleKind = "02";//在用车
            }
            if (ctx.helper.isEmpty(data.UniqueString)) {
                data.UniqueString = ctx.helper.getUniqueString(cuser['userOrg'], cuser['userLine']);//在用车
            }
            data.State = "2";
            if (vdata != null) {
                //暂时忽略日志记录
            }
            let rr = await ctx.helper.UpdateCar(data, changeDataSoure + "修改", loginName);
            if (rr.code == 0) {
                data = rr.data;
            } else {
                return rr;
            }
            if (await ctx.helper.getAllSystemParam("01_IsAddToSAVehicle") && (data.VLPN.indexOf(await ctx.helper.getAllSystemParam('01_CityVlpnProfixCond')) >= 0) && data.VML > 3500 && data.FuelType == "B") {
                await this.IsAddToSpecialAttentionVehicle(data);
            }
            ///是否开启车辆黑名单
            if (await ctx.helper.getAllSystemParam("01_IsHeavyOilCarAddToBlackList") && (data.VML > 3500 && data.FuelType == "B")) {
                await this.AddOrUpdateBlacklist(data);
            }
        }
        // 转入二手车逻辑
        if (type == "4") {
            let checkT = ctx.helper.getDictionaryTable('cd_checktype', "21");
            if (checkT != null && checkT.IsAvailable == 1 && ((await ctx.helper.getAllSystemParam("01_IsNeedSecondHandCar") && data.SecondHandCarPlace == "1") || (await ctx.helper.getAllSystemParam('01_IsCheckLocalCar') && data.SecondHandCarPlace == "0"))) {
                let sql = `select top 1 Status from WaitCheck where CheckType = '21' and BusinessTable = 'Vehicle' and VehicleID =:VehicleID order by ApplyTime desc`;
                let stats = await Raw.Query(sql, { replacements: { VehicleID: data.VehicleID } }) || {};
                if (stats != null && stats.Status == 0) {
                    isAudit = 1;//该车辆存在外地转入二手车未审核的数据
                    return ctx.helper.success({ Vehicle: data, isAudit, checkId });
                } else {
                    let waitcheck = ctx.helper.filterWaitCheckFields(data);
                    waitcheck.OrgCode = cuser['userOrg'];
                    waitcheck.Applicant = loginName;
                    waitcheck.ApplyUserName = displayName;
                    waitcheck.ApplyTime = now;
                    waitcheck.CityCode = cuser['areaCode'];
                    waitcheck.CountyCode = cuser['countyCode'];
                    waitcheck.CheckType = "21";
                    waitcheck.BusinessKey = data.VehicleID;
                    waitcheck.BusinessTable = data.Vehicle;
                    if (checkT != null && checkT.CityCode.indexOf(cuser['areaCode']) != -1) {//自动审核
                        waitcheck.Status = "1";
                        waitcheck.AuditState = "3";
                        waitcheck.CheckTime = now;
                        waitcheck.Checker = displayName;
                        isAudit = '3'; //自动通过
                        data.EStatus = "06";
                    } else {
                        data.EStatus = "03";
                        waitcheck.Status = "0";
                    }
                    waitcheck.ApplyReason = "外地转入二手车审核";
                    await Raw.Insert("WaitCheck", waitcheck);
                    let next_id = await Raw.Query("select @@IDENTITY as ID") || {};
                    waitcheck.CheckId = next_id.ID;
                    waitcheck.State = '1';
                    checkID = waitcheck.CheckId;
                    if (checkID > 0) {
                        //推送审核信息
                        //  InspectionDataBLL ins = new InspectionDataBLL(_dataManager);
                        //  ins.SendAuditData(waitcheck);
                    }
                    let rr = await ctx.helper.UpdateCar(data, changeDataSoure + "（公安二维码扫描存在相同车架号新车信息覆盖旧车信息）", loginName)
                    if (rr.code == 0) {
                        data = rr.data;
                    } else {
                        return rr;
                    }
                }
            }

        }
        //判断是否存在二手车转入图片，若存在则判断是新增还是更新车辆信息，若是新增，则需要更新UploadFileData表
        if (ctx.helper.isEmpty(VehicleID)) {
            let sql = `select  ID, BusinessKey from UploadFileData where BusinessType in ('81','82','83') and BusinessKey =:BusinessKey order by UploadFileTime desc`;
            let list = await Raw.QueryList(sql, {
                replacements: {
                    BusinessKey: data.VLPN
                }
            });
            if (list != null && list.length > 0) {
                for (let i = 0; i < list.length; i++) {
                    await Raw.Update("UploadFileData", { BusinessKey: data.VehicleID, Vehicle: data.VehicleID, UniqueString: data.UniqueString }, { wherestr: "where ID=:ID", replacements: { ID: list[i].ID } });
                }
            }
        }
        let resData = {};
        resData.Vehicle = data;
        resData.isAudit = isAudit;
        resData.checkId = checkId;
        return ctx.helper.success(resData);
    }
    /**
     * 将数据添加到黑名单表Blacklist
     * @param {*} data 车辆数据
     */
    async AddOrUpdateBlacklist(data) {
        let sql = `select * from Blacklist where VLPN=:VLPN and VehicleID=:VehicleID and VIN=:VIN`;
        let { transaction, Raw } = this.app.Dbs.hj;
        let list = await Raw.QueryList(sql, {
            replacements: {
                VehicleID: data.VehicleID,
                VLPN: data.VLPN,
                VIN: data.VIN
            }
        });
        let now = moment().format('YYYY-MM-DD HH:mm:ss');
        let cuser = this.ctx.helper.getCurrentUser();
        let loginName = decodeURI((cuser['loginName']) || "");
        let cityCode = cuser['CityCode'] || "";
        let f = {
            CityCode: cityCode,//
            VehicleID: data.VehicleID,
            UniqueString: data.UniqueString,
            VLPNColor: data.VLPNColor,
            VIN: data.VIN,
            BZTYPE: data.BZTYPE,
            Reason: "重型柴油重点监控单",
            InsertDate: now,
            Operator: loginName,
            SyncFlag: data.SyncFlag,
            IUVTYPE: data.IUVTYPE,
            // CheckDate:data.CheckDate,
            IUETYPE: data.IUETYPE,
            VRDATE: data.VRDATE,
        }
        if (this.ctx.helper.isNotEmpty(list)) {
            f.CheckDate = data.WqCheckDate;
            await Raw.Update('Blacklist', f, {
                wherestr: "where VLPN=:VLPN and VehicleID=:VehicleID and VIN=:VIN",
                replacements: {
                    VehicleID: data.VehicleID,
                    VLPN: data.VLPN,
                    VIN: data.VIN
                }
            });
        } else {
            f.VLPN = data.VLPN;
            f.BLType = "23";
            f.VehicleID = data.VehicleID;
            await Raw.Insert('Blacklist', f);
            this.ctx.helper.InsertHashSetKeyToRedis("bd/blacklist", data.VehicleID, data.VehicleID);
        }
    }
    /**
     * 外省重柴车辆保存时，添加到重点关注列表中
     * @param {*} data 车辆数据
     */
    async IsAddToSpecialAttentionVehicle(data) {
        let sql = `select * from SpecialAttentionVehicle where VehicleID=:VehicleID`;
        let { transaction, Raw } = this.app.Dbs.hj;
        let list = await Raw.QueryList(sql, {
            replacements: {
                VehicleID: data.VehicleID
            }
        });
        let now = moment().format('YYYY-MM-DD HH:mm:ss');
        let displayname = decodeURI((this.ctx.helper.getCurrentUser()['displayName']) || "");
        let f = {
            UniqueString: data.UniqueString,
            Reason: "外省重柴车辆",
            Recorder: displayname,
            RecordTime: now,
            IsAvailable: '1',
            VLPN: data.VLPN,
            vin: data.VIN,
            VRDATE: data.VRDATE
        }
        if (this.ctx.helper.isNotEmpty(list)) {
            await Raw.Update('SpecialAttentionVehicle', f, {
                wherestr: "where VehicleID=:VehicleID",
                replacements: {
                    VehicleID: data.VehicleID
                }
            });
        } else {
            f.VehicleID = data.VehicleID;
            await Raw.Insert('SpecialAttentionVehicle', f);
            this.ctx.helper.InsertHashSetKeyToRedis("bd/specialattentionvehicle", data.VehicleID, data.VehicleID);
        }
        //临时开始
        let IsSubmitCrossAuditByRehandle = await this.ctx.hleper.getAllSystemParam('01_IsSubmitCrossAuditByRehandle')
        if (auditReasonList != null && auditReasonList != '') {
            auditReasonList = auditReasonList.substring(0, auditReasonList.length - 1);
            let SaveAcceptanceAuditData_New = await this.SaveAcceptanceAuditData_New(acceptance, VehicleID, Mileage, auditReasonList, fgkreason, applyAccReason, isAutoCheck);
            if (isAutoCheck != null && isAutoCheck.indexOf("0") < 0) {
                res.status = -2;
            } else {
                res.status = -1;
            }
        } else if (IsSubmitCrossAuditByRehandle) {

        }
    }

    async SaveAcceptanceAuditData_New(acceptance, VehicleID, Mileage, auditReasonList, fgkreason, applyAccReason, isAutoCheck) {
        let cVehicle = await this.ctx.helper.getVehicleInfo({ VehicleID });
         let res={};
        if (cVehicle.length <= 0) {
            return '找不到车辆信息';
        }
        cVehicle = cVehicle[0];
        if (cVehicle.VLPN != null || cVehicle.VLPN != '') {
            return '车牌号码不能为空';
        }
        if (cVehicle.VIN != null || cVehicle.VIN != '') {
            return '车架号码不能为空';
        }
        let AccCheckInspectionMethod = await this.ctx.helper.getAllSystemParam('01_AccCheckInspectionMethod');
        let IsNeedAstrictFGKReason = await this.ctx.helper.getAllSystemParam('01_IsNeedAstrictFGKReason');
        let EnableCheckEStatus = await this.ctx.helper.getAllSystemParam('01_EnableCheckEStatus');
        let IsAccAuditAutoPass = await this.ctx.helper.getAllSystemParam('01_IsAccAuditAutoPass');
        let CheckYellowLowCar = await this.ctx.helper.getAllSystemParam('01_CheckYellowLowCar');

        if (AccCheckInspectionMethod) {
            if (acceptance.InspectionMethod == null || acceptance.InspectionMethod == '') {
                return '检测方法不能为空';
            }
            if (IsNeedAstrictFGKReason) {
                if ((acceptance.InspectionMethod == "F" || acceptance.InspectionMethod == "A") && (fgkreason.FGKReason == null || fgkreason.FGKReason == '')) {
                    return '非工况原因不能为空';
                }
            }
        }
        if (cVehicle.FuelType == null || cVehicle.FuelType == '') {
            return '燃油类型不能为空';
        }
        // 环保业务状态
        if (EnableCheckEStatus) {
            if (cVehicle.EStatus == '12') {
                return '该车辆环保业务状态为“正在检测”,不可进行受理！'
            }
            if (cVehicle.EStatus == '99') {
                return '该车辆环保业务状态为“锁定”,不可进行受理！'
            }
        }

        // 获取车辆受理信息
        let acceptanceModel = await this.getAcceptanData(VehicleID);
        const { InspectionNum, UniqueString } = acceptanceModel;
        if (acceptanceModel.length > 0) {
            this.RemoveAcceptance(InspectionNum, UniqueString, '车辆多次受理删除');
        }
        let user = this.getCurrentUser()
        let nowDate = moment(new Date()).format('YYYY-DD-MM HH:mm:ss');
        //  受理信息赋值到受理审核表
        acceptanceModel.InspectionNum = InspectionNum == "" ? this.ctx.hleper.GetAcceptanceNO() : InspectionNum;
        acceptanceModel.DayAcceptanceNum = await this.ctx.hleper.GetDayAcceptanceNum(user['userOrg'], acceptance.AcceptanceDate);
        acceptanceModel.CityCode = user['areaCode'];
        acceptanceModel.StationCode = user['userOrg'];
        acceptanceModel.Operator = user['loginName'];
        acceptanceModel.AcceptanceDate = nowDate;
        acceptanceModel.VehicleID = cVehicle.VehicleID;
        acceptanceModel.VLPN = cVehicle.VLPN;
        acceptanceModel.VIN = cVehicle.VIN;
        acceptanceModel.AcceptYear = nowDate.substring(0, 4);
        acceptanceModel.AcceptMonth = nowDate.substring(5, 7);
        acceptanceModel.UniqueString = cVehicle.UniqueString;
        acceptanceModel.HasOBD = cVehicle.HasOBD;
        acceptanceModel.GAVType = cVehicle.GAVType;
        acceptanceModel.KerbMass = cVehicle.KerbMass;
        acceptanceModel.BenchmarkMass = cVehicle.BenchmarkMass;
        acceptanceModel.VML = cVehicle.VML;
        acceptanceModel.RatedSeats = cVehicle.RatedSeats;
        acceptanceModel.IUETYPE = cVehicle.IUETYPE;
        acceptanceModel.EDSPL = cVehicle.EDSPL;
        acceptanceModel.EnginePower = cVehicle.EnginePower;
        acceptanceModel.EngineRatedSpeed = cVehicle.EngineRatedSpeed;
        acceptanceModel.IntakeWay = cVehicle.IntakeWay;
        acceptanceModel.OilSupplyWay = cVehicle.OilSupplyWay;
        acceptanceModel.HasCCA = cVehicle.HasCCA;
        acceptanceModel.EngineNum = cVehicle.EngineNum;
        //赋值
        acceptanceAdutiModel.InspectionNum = acceptanceModel.InspectionNum;
        acceptanceAdutiModel.InspectionKind = acceptanceModel.InspectionKind;
        acceptanceAdutiModel.CityCode = acceptanceModel.CityCode;
        acceptanceAdutiModel.StationCode = acceptanceModel.StationCode;
        acceptanceAdutiModel.VLPN = acceptanceModel.VLPN;
        acceptanceAdutiModel.VIN = acceptanceModel.VIN;
        acceptanceAdutiModel.Operator = acceptanceModel.Operator;
        acceptanceAdutiModel.AcceptanceDate = acceptanceModel.AcceptanceDate;
        acceptanceAdutiModel.InspectionMethod = acceptanceModel.InspectionMethod;
        acceptanceAdutiModel.InspectionTimes = acceptanceModel.InspectionTimes;
        acceptanceAdutiModel.InspectionNature = acceptanceModel.InspectionNature;
        acceptanceAdutiModel.VehicleID = acceptanceModel.VehicleID;
        acceptanceAdutiModel.DayAcceptanceNum = acceptanceModel.DayAcceptanceNum;
        acceptanceAdutiModel.UniqueString = acceptanceModel.UniqueString;
        acceptanceAdutiModel.AcceptYear = acceptanceModel.AcceptYear;
        acceptanceAdutiModel.AcceptMonth = acceptanceModel.AcceptMonth;
        acceptanceAdutiModel.InspectionWay = acceptanceModel.InspectionWay;
        acceptanceAdutiModel.AuditReason = auditReasonList;
        acceptanceAdutiModel.BZTYPE = cVehicle.BZTYPE;
        acceptanceAdutiModel.EmissionStandard = cVehicle.EmissionStandard;
        acceptanceAdutiModel.VLPNColor = cVehicle.VLPNColor;
        acceptanceAdutiModel.FuelType = cVehicle.FuelType;
        acceptanceAdutiModel.HasOBD = acceptanceModel.HasOBD;
        acceptanceAdutiModel.GAVType = acceptanceModel.GAVType;
        acceptanceAdutiModel.KerbMass = acceptanceModel.KerbMass;
        acceptanceAdutiModel.BenchmarkMass = acceptanceModel.BenchmarkMass;
        acceptanceAdutiModel.VML = acceptanceModel.VML;
        acceptanceAdutiModel.RatedSeats = acceptanceModel.RatedSeats;
        acceptanceAdutiModel.IUETYPE = acceptanceModel.IUETYPE;
        acceptanceAdutiModel.EDSPL = acceptanceModel.EDSPL;
        acceptanceAdutiModel.EnginePower = acceptanceModel.EnginePower;
        acceptanceAdutiModel.EngineRatedSpeed = acceptanceModel.EngineRatedSpeed;
        acceptanceAdutiModel.IntakeWay = acceptanceModel.IntakeWay;
        acceptanceAdutiModel.OilSupplyWay = acceptanceModel.OilSupplyWay;
        acceptanceAdutiModel.HasCCA = acceptanceModel.HasCCA;
        acceptanceAdutiModel.EngineNum = acceptanceModel.EngineNum;
        acceptanceAdutiModel.SceneCode = acceptanceModel.SceneCode;


        if ((acceptanceModel.InspectionMethod == 'A' || acceptanceModel.InspectionMethod == 'B' || acceptanceModel == 'C') && acceptanceModel.IsCheckHC == null) {
            acceptanceModel.IsCheckHC = 1;
        }
        acceptanceAdutiModel.IsUploadLambdaLimit = acceptanceModel.IsUploadLambdaLimit;
        acceptanceAdutiModel.EACLD = acceptanceModel.EACLD;
        acceptanceAdutiModel.EACLU = acceptanceModel.EACLU;
        acceptanceAdutiModel.IsCheckHC = acceptanceModel.IsCheckHC;
        acceptanceAdutiModel.IsCheckOBD = acceptanceModel.IsCheckOBD;
        acceptanceAdutiModel.UseOfAuto = cVehicle.UseOfAuto;
        acceptanceAdutiModel.CountyCode = user['countyCode'];
        if (applyAccReason != null || applyAccReason != '') {
            acceptanceAdutiModel.Remarks = applyAccReason;
        }
        // 受理信息保存到受理审核表
        let accAuditModel = await this.saveChangeToAduti(acceptanceAdutiModel);

        //受理信息保存到waitcheck
        acceptanceAdutiModel.displayName = user['displayName']
        await this.AddOrUpdateWaitCheck(accAuditModel, cVehicle, isAutoCheck);
        let wcModel = {};
        let arr = accAuditModel.AuditReason.split(',');
        if (arr.length > 1) {
            wcModel = this.getWaitCheckData(VehicleID, '31');
        } else {
            wcModel = this.getWaitCheckData(VehicleID, '20');
        }
        res.checkId = wcModel.CheckId;
        // 保存轨迹表
        await this.ctx.helper.InsertEStatusIntoVehicleTrail(VehicleID, '06');
        //  修改车辆状态和里程读数
        await this.UpdateVehicleStat('06', Mileage, VehicleID, user['loginName'], '受理');
        // 启动需要填写选择非工况的原因情况下，更新非工况原因到特定表
        // let IsNeedAstrictFGKReason = await this.ctx.hleper.getAllSystemParam('01_IsNeedAstrictFGKReason');//当启动验证车辆受理检测方法时，并且检测方法选择了非工况时，是否启动需要填写选择非工况的原因
        if (IsNeedAstrictFGKReason && (acceptanceModel.InspectionMethod == 'F' || acceptanceModel.InspectionMethod == 'A')) {
            this.InsertAcceptanceFGKReasonData(VehicleID, acceptanceModel.InspectionNum, fgkreason);
        }
        res.InspectionNum = acceptanceModel.InspectionNum
        // 发布受理审核信息  自动审核通过
        if ((isAutoCheck && isAutoCheck.indexOf('0') == -1) && (IsAccAuditAutoPass || (CheckYellowLowCar && cVehicle.GAVType.indexOf('H5') > -1 && (arr.length == 1 && (arr[0] == '03' || arr[0] == '20' || arr[0] == '22'))))) {
            Object.keys(cVehicle).forEach((key) => {
                if (acceptanceModel.hasOwnProperty(key)) {
                    if (key.toLowerCase() == "inspectionmethod")
                    acceptanceModel[key] = cVehicle[key];
                }
            });
        }
        await this.ctx.hleper.SetAccAndVecToRedisNew(acceptanceModel, cVehicle);
        let childRedis = Object.keys(app.config.redis.clients).filter(item => {
            if (item.indexOf('hj') > -1 && item.length > 3) {
                return item;
            }
        });
        let jsonacc = JSON.stringify(acceptanceModel);
        // 子客户端
        if (childRedis.length > 0) {
            // 发布消息到redis队列
            this.app.redis.get('hj' + CityCode).pushlish('wjapp/ljfw/djxx', jsonacc)
        } else {
            this.app.redis.get('hj').pushlish('wjapp/ljfw/djxx', jsonacc);
        }
        res.accAuditModel=accAuditModel;
        res.ok=true;
        return res;
    }


    // async GetLasInspectionData(VehicleID) {
    //     let list = await this.GetLastInspectionData(VehicleID);
    //     let cuser = ctx.helper.getCurrentUser();
    //     if (list.length > 0 && list[0].VDCT == "0" && list[0].StationCode != cuser['userOrg']) {
    //         let info = list[0];
    //         let res = await this.GetRehandleBusiness(info)
    //     } else {

    //     }
    // }
            /**  获取退办业务信息，且退办类型为线检不合格
           * @param {*} VehicleID  车辆ID
           *  @param {*} StationCode  站点编码
        */
    // async GetRehandleBusiness(acceptance) {
    //     const {Raw}=this.app.Dbs.hj;
    //     const {VehicleID, StationCode,VIN,VLPN,VLPNColor} =acceptance;
    //     let sql = `select top 1 ID from RehandleBusiness where ((VehicleID =:VehicleID) or (VIN =:VIN and VLPN =:VLPN and VLPNColor =:VLPNColor)) and RehandleStation =:StationCode
    //       and RehandleType = '01' order by RehandleTime desc`;
    //       let  dt=await Raw.QueryList(sql,{
    //           replacements:{
    //             VehicleID,
    //              StationCode,
    //              VIN,
    //              VLPN,
    //              VLPNColor
    //           }
    //       });
    //       if(dt.length>0){
    //           let d=await Raw.Query(`select top 1 VehicleID,VLPN,VLPNColor,VIN,OrgCode,Status,BusinessKey,AuditState,CheckType from WaitCheck where CheckType = '22' and BusinessKey=:ID
    //            and VehicleID =:VehicleID order by ApplyTime desc`,{

    //            })

    //       }

    // }

    /////////////////////////////////////////////////////////////////////////////////以下为未添加的代码
    /**
    * 检测限值判断
    * @param {*} acceptance 受理数据
    */
    async CheckLimitOut(acceptance) {
        let flag = false;
        let InspectionNum = acceptance.InspectionNum;
        if (acceptance.IUTYPE == 'F') {//不透光
            flag = await this.CheckLightProofSmokeDataOutLimit_GL(InspectionNum);
        } else if (acceptance.IUTYPE == 'G') {//加载减速
            flag = await this.CheckLDDataOutLimit_GL(InspectionNum);
        } else if (acceptance.IUTYPE == 'B') {//稳态
            flag = await this.CheckASMDataOutLimit_GL(InspectionNum);
        } else if (acceptance.IUTYPE == 'A') {//双怠速
            flag = await this.CheckTSIDataOutLimit_GL(InspectionNum);
        }
        return false;
    }
    /**
     * 不透光检测限值判断
     * @param {*} InspectionNum 
     */
    async CheckLightProofSmokeDataOutLimit_GL(InspectionNum) {
        let { Raw } = this.app.Dbs.hj;
        let sql = `select * from LightProofSmokeData where InspectionNum=:InspectionNum`;
        let list = await Raw.QueryList(sql, {
            replacements: {
                InspectionNum
            }
        });
        if (list.length > 0) {
            let data = list[0];
            if (data.EL == null) {
                return false;
            }
            let BTGOutLimit = await this.ctx.hleper.getAllSystemParam("01_BTGOutLimit");
            if ((data.ER1 != null || (parseFloat(data.ER1) - parseFloat(data.EL)) * 100 / parseFloat(data.EL) <= parseFloat(BTGOutLimit)) &&
                (data.ER2 != null || (parseFloat(data.ER2) - parseFloat(data.EL)) * 100 / parseFloat(data.EL) <= parseFloat(BTGOutLimit)) &&
                (data.ER3 != null || (parseFloat(data.ER3) - parseFloat(data.EL)) * 100 / parseFloat(data.EL) <= parseFloat(BTGOutLimit))
            ) {
                return false;
            }
            return true;
        } else {
            return false;
        }
    }
    /**
     * 加载减速检测限值判断
     * @param {*} InspectionNum 
     */
    async CheckLDDataOutLimit_GL(InspectionNum) {
        let { Raw } = this.app.Dbs.hj;
        let sql = `select * from LDData where InspectionNum=:InspectionNum`;
        let list = await Raw.QueryList(sql, {
            replacements: {
                InspectionNum
            }
        });
        if (list.length > 0) {
            let data = list[0];
            if (data.EL == null) {
                return false;
            }
            let LDDataOutLimit = await this.ctx.hleper.getAllSystemParam("01_LDDataOutLimit");
            if ((data.ER100 != null || (parseFloat(data.ER100) - parseFloat(data.EL)) * 100 / parseFloat(data.EL) <= parseFloat(LDDataOutLimit)) &&
                (data.ER80 != null || (parseFloat(data.ER80) - parseFloat(data.EL)) * 100 / parseFloat(data.EL) <= parseFloat(LDDataOutLimit)) &&
                (data.NOX80 != null || (parseFloat(data.NOX80) - parseFloat(data.NOXEL)) * 100 / parseFloat(data.NOXEL) <= parseFloat(LDDataOutLimit))
            ) {
                return false;
            }
            return true;
        } else {
            return false;
        }
    }
    /**
     * 稳态检测限值判断
     * @param {*} InspectionNum 
     */
    async CheckASMDataOutLimit_GL(InspectionNum) {
        let { Raw } = this.app.Dbs.hj;
        let sql = `select * from ASMData where InspectionNum=:InspectionNum`;
        let list = await Raw.QueryList(sql, {
            replacements: {
                InspectionNum
            }
        });
        if (list.length > 0) {
            let data = list[0];
            let ASMOutLimit = await this.ctx.hleper.getAllSystemParam("01_ASMOutLimit");
            if (((data.COER5025 != null && data.COEL5025 != null) || (parseFloat(data.COER5025) - parseFloat(data.COEL5025)) * 100 / parseFloat(data.COEL5025) <= parseFloat(ASMOutLimit)) &&
                ((data.HCER5025 != null && data.HCEL5025 != null) || (parseFloat(data.HCER5025) - parseFloat(data.HCEL5025)) * 100 / parseFloat(data.HCEL5025) <= parseFloat(ASMOutLimit)) &&
                ((data.NOER5025 != null && data.NOEL5025 != null) || (parseFloat(data.NOER5025) - parseFloat(data.NOEL5025)) * 100 / parseFloat(data.NOEL5025) <= parseFloat(ASMOutLimit))
            ) {
                if (((data.COER5025 != null && data.COEL5025 != null) || (parseFloat(data.COER5025) - parseFloat(data.COEL5025)) * 100 / parseFloat(data.COEL5025) <= parseFloat(ASMOutLimit)) &&
                    ((data.HCER5025 != null && data.HCEL5025 != null) || (parseFloat(data.HCER5025) - parseFloat(data.HCEL5025)) * 100 / parseFloat(data.HCEL5025) <= parseFloat(ASMOutLimit)) &&
                    ((data.NOER5025 != null && data.NOEL5025 != null) || (parseFloat(data.NOER5025) - parseFloat(data.NOEL5025)) * 100 / parseFloat(data.NOEL5025) <= parseFloat(ASMOutLimit))
                ) {

                    return false;
                }
                return true;
            }
            return true;
        } else {
            return false;
        }
    }
    /**
     * 双怠速检测限值判断
     * @param {*} InspectionNum 
     */
    async CheckTSIDataOutLimit_GL(InspectionNum) {
        let { Raw } = this.app.Dbs.hj;
        let sql = `select * from TSIData where InspectionNum=:InspectionNum`;
        let list = await Raw.QueryList(sql, {
            replacements: {
                InspectionNum
            }
        });
        if (list.length > 0) {
            let data = list[0];
            let TSIOutLimit = await this.ctx.hleper.getAllSystemParam("01_TSIOutLimit");
            if ((!(data.HICOR && data.HICOL) || (parseFloat(data.HICOR) - parseFloat(data.HICOL)) * 100.0 / parseFloat(data.HICOL) <= parseFloat(TSIOutLimit)) &&
                (!(data.HIHCR && data.HIHCL) || (parseFloat(data.HIHCR) - parseFloat(data.HIHCL)) * 100.0 / parseFloat(data.HIHCL) <= parseFloat(TSIOutLimit)) &&
                (!(data.LICOR && data.LICOL) || (parseFloat(data.LICOR) - parseFloat(data.LICOL)) * 100.0 / parseFloat(data.LICOL) <= parseFloat(TSIOutLimit)) &&
                ((data.LIHCR && data.LIHCL) || (parseFloat(data.LIHCR) - parseFloat(data.LIHCL)) * 100.0 / parseFloat(data.LIHCL) <= parseFloat(TSIOutLimit))
            ) {
                return false;
            }
            return true;
        } else {
            return false;
        }
    }
    /**
     * 检查检测数据上传资料情况
     * @param {*} acceptanceData 
     */
    async CheckInspectionDataPhoto(acceptanceData) {
        let res = { isOk: true, msg: '' }
        let CheckAccptanceOnlyWeiXiuFile = await this.ctx.hleper.getAllSystemParam("01_CheckAccptanceOnlyWeiXiuFile");
        // let CheckAccptanceFile=await this.ctx.hleper.getAllSystemParam("01_CheckAccptanceFile");//暂不处理
        let CheckAccptanceFile = false;
        let UseBussinessCondition = await this.ctx.hleper.getAllSystemParam("01_UseBussinessCondition");
        if (CheckAccptanceOnlyWeiXiuFile) {
            let content = {
                BusinessType: "11",//检测报告打印申请
                FileGroup: "06",//维修凭证
                BusinessKey: acceptanceData.InspectionNum
            };
            let exists = await this.this.Exists(content);
            if (exists) {
                res.isOk = false;
                res.msg = "请上传维修凭证";
                return res;
            }
        }
        if (CheckAccptanceFile) {
            let errorMsg = "";
            let cuser = ctx.helper.getCurrentUser();
            let areaCode = cuser['areaCode'];
            let userOrg = cuser['userOrg'];
            if (UseBussinessCondition) {
                let content = {
                    cityCode: areaCode,
                    acceptanceData: acceptanceData,
                    businessType: '11'//检测报告申请
                }
                // errorMsg = await this.HasBussinessCondition(content);
            } else {
                let content = {
                    cityCode: areaCode,
                    StationCode: userOrg,
                    acceptanceData: acceptanceData,
                    businessType: '11'//检测报告申请
                }
                // errorMsg = await this.HasUploadPdfForInspection(content);
            }
            if (errorMsg != null && errorMsg != "") {
                errorMsg.replace("打印报告", "办理业务");
                res.isOk = false;
                res.msg = errorMsg;
                return res;
            }
        }
        return res;
    }
//     async HasBussinessCondition(content) {
//         let { cityCode, acceptanceData, businessType } = content;
//         let { InspectionNum, StationCode } = acceptanceData;
//         let lstFileGroup = await this.GetBussinessCondition(cityCode, StationCode, InspectionNum, businessType);
//     }
//     async GetBussinessCondition(cityCode, StationCode, InspectionNum, businessType) {
//   let needPDF=0,effectESignPrint=0;
//   needPDF=this.NeedPDF(cityCode);

//     }
//     async NeedPDF()
    /**
     * 检测文件是否存在
     * @param {*} content 
     */
    async Exists(content) {
        let { Raw } = this.app.Dbs.hj;
        let sql = `select BusinessKey from UploadFileData where 1=1 `;
        let { FileGroup, BusinessType, BusinessKey, PicType } = content;
        if (FileGroup) {
            sql += " and FileGroup=:FileGroup";
        }
        if (BusinessType) {
            sql += " and BusinessType=:BusinessType";
        }
        if (BusinessKey) {
            sql += " and BusinessKey=:BusinessKey";
        }
        if (PicType) {
            sql += " and PicType=:PicType";
        }
        let list = await Raw.QueryList(sql, { replacements: content });
        if (list.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    // 根据ID获取车辆受理信息
    async getAcceptanData(VehicleID) {
        const { Raw } = this.app.Dbs.hj;
        const acceptanceHisData = await Raw.QueryList(`select top 1 * from Acceptance where VehicleID=:Vehicle order by AcceptanceDate desc`, {
            replacements: {
                VehicleID
            }
        });

        return acceptanceHisData;

    }
    /// <summary>
    /// 删除redis缓存中的受理信息、车辆信息、检测站的受理编码哈希表对应的字段信息和数据库中该条受理表的受理信息并且保存到受理日志表中
    /// </summary>
    async RemoveAcceptance(InspectionNum, UniqueString, remarks) {
        const { Raw } = this.app.Dbs.hj;
        let key = 'bd/acceptance'
        let cityCode = this.ctx.getCurrentUser['areaCode'];
        let isOpenExtExpiryDate = await this.ctx.getAllSystemParam('01_isOpenExtExpiryDate');//是否启动外检有效期开关
        // 子redis,如hj440600,hj440601...
        let childRedis = Object.keys(app.config.redis.clients).filter(item => {
            if (item.indexOf('hj') > -1 && item.length > 3) {
                return item;
            }
        });
        const fielKey = InspectionNum + '_0';
        let value = '';
        if (childRedis.length > 0) {
            value = this.app.redis.get(childRedis['hj' + cityCode]).hget(key, fielKey);
            let keyvec = 'vehicle' + UniqueString;
            let acc = JSON.parse(value);
            acc.remarks = remarks;
            let keyWJ = "_ExteriorInspect_" + acc.StationCode;
            let fieldkeyWJ = '_' + acc.VIN + '_' + acc.VLPN + '_' + acc.VLPNColor;
            // 插入受理日志
            await Raw.Insert('AcceptanceLog', acc);
            // 删除
            this.app.redis.get(childRedis['hj' + cityCode]).hdel(key, fielKey);//受理信息
            this.app.redis.get(childRedis['hj' + cityCode]).hdel(key, keyvec);//车辆信息
            if (!isOpenExtExpiryDate) {
                this.app.redis.get(childRedis['hj' + cityCode]).hdel(keyWJ, fieldkeyWJ);//外检信息
            }

        } else {
            value = redis.hget(key, fielKey);
            let keyvec = 'vehicle' + UniqueString;
            let acc = JSON.parse(value);
            let keyWJ = "_ExteriorInspect_" + acc.StationCode;
            let fieldkeyWJ = '_' + acc.VIN + '_' + acc.VLPN + '_' + acc.VLPNColor;
            // 插入受理日志
            acc.remarks = remarks;
            await Raw.Insert('AcceptanceLog', acc);
            // 删除
            this.app.redis.get('hj').hdel(key, fielKey);//受理信息
            this.app.redis.get('hj').hdel(key, keyvec);//车辆信息
            if (!isOpenExtExpiryDate) {
                this.app.redis.get('hj').hdel(keyWJ, fieldkeyWJ);//外检信息
            }
            //  新增受理信息到redis
            await this.ctx.hleper.SaveDataChangeToRedis(acc.StationCode, 'HDEL', key, fielKey, null, acc.CityCode);

            //  新增外检信息到redis
            await this.ctx.hleper.SaveDataChangeToRedis(acc.StationCode, 'DEL', keyvec, keyvec, null, acc.CityCode);

        }
        if (value == null) {
            this.app.CoreAPI.Log.trace("RemoveAcceptance方法，key:bd/acceptance," + "fieldkey:" + fieldKey + ",获取value为null或者空，value:" + value);
            return 0;
        }

    }

    // 保存受理信息到受理审核表
    async saveChangeToAduti(acceptanceAdutiModel) {
        let { RaW } = this.app.Dbs.hj;
        await Raw.Insert('AcceptanceAudit', acceptanceAdutiModel);

    }
    /// 将受理审核表信息插入到waticheck表中
    async AddOrUpdateWaitCheck(acceptanceAdutiModel, cVehicle, isAutoCheck) {
        const { Raw } = this.app.hj;
        let CheckYellowLowCar = await this.ctx.hleper.getAllSystemParam('01_CheckYellowLowCar');//黄标车低速货车
        let IsAccAuditAutoPass = await this.ctx.hleper.getAllSystemParam('01_IsAccAuditAutoPass');//自动审核
        let date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const arr = isAutoCheck.split(',');
        let CheckType = '20';
        if (arr.length > 1) {
            CheckType = '31';
        }
        let param = {
            CityCode: acceptanceAdutiModel.CityCode,
            OrgCode: acceptanceAdutiModel.StationCode,
            CheckType: CheckType,
            BusinessKey: acceptanceAdutiModel.AcceptanceAuditID,
            BusinessTable: 'AcceptanceAudit',
            VehicleID: acceptanceAdutiModel.VehicleID,
            UniqueString: acceptanceAdutiModel.UniqueString,
            VIN: acceptanceAdutiModel.VIn,
            VLPN: acceptanceAdutiModel.VlPN,
            VLPNColor: acceptanceAdutiModel.VLPNColor,
            FuelType: acceptanceAdutiModel.FuelType,
            GAVType: cVehicle.GAVType,
            IUVTYPE: cVehicle.IUVTYPE,
            IUETYPE: cVehicle.IUETYPE,
            ProductDate: cVehicle.ProductDate,
            RatedSeats: cVehicle.RatedSeats,
            FactoryPlateModel: cVehicle.FactoryPlateModel,
            OwnerName: cVehicle.OwnerName,
            VehicleKind: cVehicle.VehicleKind,
            ApplyTime: date,
            Applicant: acceptanceAdutiModel.Operator,
            Status: '0',
            ApplyUserName: acceptanceAdutiModel.displayName,
            ApplyReason: acceptanceAdutiModel.AuditReason,
            Remarks: acceptanceAdutiModel.Remarks,
            KerbMass: acceptanceAdutiModel.KerbMass,
            BenchmarkMass: acceptanceAdutiModel.BenchmarkMass,
            EDSPL: acceptanceAdutiModel.EDSPL,
            EnginePower: acceptanceAdutiModel.EnginePower,
            EmissionStandard: cVehicle.EmissionStandard,
            VML: cVehicle.VML,
            VRDATE: cVehicle.VRDATE,
            EngineNum: cVehicle.EngineNum,
            UseOfAuto: cVehicle.UseOfAuto,
            CountyCode: acceptanceAdutiModel.CountyCode,
            InspectionNature: acceptanceAdutiModel.InspectionNature,
        }
        // 自动审核插入：审核人、审核时间、审核类型
        if (isAutoCheck.indexOf('0') == -1 && isAutoCheck != '') {
            param.AuditState = '3';
            param.CheckTime = date;
            param.checker = acceptanceAdutiModel.displayName;
        } else {
            if (arr.length == 1 && ((IsAccAuditAutoPass) || (CheckYellowLowCar && (cVehicle.GAVType.IndexOf("H5") >= 0) && (arr[0] == "03" || arr[0] == "20" || arr[0] == "22")))) {
                //开启黄标车中的低速货车自动审核通过或开启受理审核自动通过
                param.AuditState = '3';
                param.CheckTime = date;
                param.checker = acceptanceAdutiModel.displayName;
            }
        }
        await Raw.Insert('WaitCheck', param);
    }
    // 获取受理信息
    async getWaitCheckData(VehicleID, CheckType) {
        const { Raw } = this.app.Dbs.hj;
        let list = await Raw.QueryList(`select top 1 * from waitCheck where VehicleID=:VehicleID and CheckType=:CheckType and(Status='0' or AuditSate='3') order by ApplyTime desc`, {
            replacements: {
                VehicleID,
                CheckType
            }
        });
        if (list.length > 0) {
            return list[0];
        } else {
            return null;
        }


    }
    // 更新车辆环保业务状态和里程数
    async UpdateVehicleStat(stat, Mileage, VehicleID, changer, changeDataSource) {
        const { Raw } = this.app.Dbs.hj;
        let table = await Raw.QueryList(`select EStatus,(case when mileage IS null then '' else CAST(mileage as varchar)end ) as mileage,
                  getdate(),VehicleID from Vehicle where VehicleID=:VehicleID`, {
            replacements: {
                VehicleID
            }
        });
        if (table == null) {
            return "确定受理时查询不到车辆信息！"
        }
        // 更新
        await Raw.Update("Vehicle", { EStatus: stat, Mileage: Mileage }, {
            wherestr: "where Vehicle=:Vehicle",//where 条件
            replacements: {//参数化执行
                VehicleID
            }
        });
        // 记录日志
        let log = {};
        log.LOG_MSG = "环保业务状态：" + table.EStatus + "=>" + stat + ';里程表读数:' + table.mileage + "=>" + Mileage;
        log.SOURCE_TABLE = 'Vehicle';
        log.CHANGER = changer;
        log.CHANGE_TIME = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        log.SOURCE_ID = VehicleID;
        log.CHANGEDATASOURCE = changeDataSource;
        await Raw.Insert('CHANGE_LOG', log);

        // 记录redis
        await this.app.redis.get('hj').hset('bd/vehiclestatus', VehicleID, stat);
    }
    /// 插入到非工况原因表
    async InsertAcceptanceFGKReasonData(VehicleID, InspectionNum, fgk) {
        const { Raw } = this.app.Dbs.hj;
        let vec = await this.ctx.hleper.getVehicleInfo({ VehicleID });
        const { FactoryPlateModel, IUVTYPE, IUETYPE, EmissionStandard, VRDATE } = vec;
        let vrdatestring = moment(VRDATE).format('YYYY-MM-DD');
        let text = ``;
        //  获取统计数据
        let dt = await Raw.QueryList(`select (select codename from CD_InspectionMethod where codevalue=IUTYPE and IsAvailable = 1) as IUTYPE,InspectDoneTimes,InspectRatio,InspectWayType from T_VEHICLES_ANAlYSE 
    where FactoryPlateModel=:FactoryPlateModel and IUVTYPE=:IUVTYPE and IUETYPE=:IUETYPE  and FILENAME<=:vrdatestring order by InspectDoneTimes desc,InspectRatio desc`, {
            replacements: {
                FactoryPlateModel,
                IUVTYPE,
                IUETYPE,
                vrdatestring
            }
        });
        if (dt.length > 0) {
            text = `当前车型最多使用检测方法为${dt[0].IUTYPE},使用比率为${dt[0].InspectRatio}%`
        }
        let param = {
            VehicleID,
            InspectionNum,
            FGKReason: fgk.FGKReason,
            ImportTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            Remark: text,
            OtherReason: fgk.OtherReason,
            JSFZRRemark: fgk.JSFZRRemark,
            InspectionMethod: fgk.InspectionMethod

        }
        /// 插入到非工况原因表
        await Raw.Insert('AcceptanceFGKReason', param);

    }

}
module.exports = AddVehicleInfoService;