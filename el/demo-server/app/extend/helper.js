const { EmissionStandardConst } = require("../service/common/EmissionStandardConst");
const { FuelTypeConst } = require("../service/common/FuelTypeConst");
const { VehicleBigTypeConst } = require("../service/common/VehicleBigTypeConst");
const { PGConst } = require("../service/common/PGConst");
const moment = require('moment');
module.exports = {
    pathToBase64(filePath) {
        if (this.isEmpty(filePath)) {
            return null;
        }
        if (!fs.existsSync(filePath)) {//判断图片文件是否存在，否则替换
            return null;
        }
        let bitmap = fs.readFileSync(filePath);
        let base64str = Buffer.from(bitmap, 'binary').toString('base64');//base64编码
        let suffix = path.substring(path.lastIndexOf(".") + 1);
        const imagePrefix = `data:image/${suffix};base64,`;
        return imagePrefix + base64str;
    },
    pathToBuffer(filePath) {
        if (this.isEmpty(filePath)) {
            return null;
        }
        if (!fs.existsSync(filePath)) {//判断图片文件是否存在，否则替换
            return null;
        }
        let bitmap = fs.readFileSync(filePath);
        return bitmap;
    },
    dataFormat(value, fmt) {
        if (!value || value == '') return value;
        if (typeof value == 'string' && value.indexOf('.') > -1) value = value.split('.')[0]; //时间格式带小数点则需把小数点后面的尾数去掉
        let getDate = new Date(value);
        let o = {
            'M+': getDate.getMonth() + 1,
            'd+': getDate.getDate(),
            'h+': getDate.getHours(),
            'm+': getDate.getMinutes(),
            's+': getDate.getSeconds(),
            'q+': Math.floor((getDate.getMonth() + 3) / 3),
            'S': getDate.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (let k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
        }
        return fmt;
    },
    //GJ_Logic 国标车辆审核
    async GetEmissionStandardOfVehicle(vehicle) {
        let { transaction, Raw } = this.app.Dbs.hj;
        let emissionStandard = '';
        if (!vehicle.GAVType) {
            return this.error('公安车辆类型不能为空');
        }
        if (!vehicle.FuelType) {
            return this.error('燃油类型不能为空');
        }
        if (!vehicle.VML) {
            return this.error('最大总质量不能为空');
        }
        if (!vehicle.RatedSeats) {
            return this.error('座位数不能为空');
        }
        if (!vehicle.VRDATE) {
            return this.error('初次登记日期不能为空');
        }
        if (vehicle.FuelType != "B" && vehicle.HasOBD === '') {
            return this.error('是否装有OBD不能为空');
        }
        //RL_HBVType_GAVType opRL_HBVType_GAVType = new RL_HBVType_GAVType(dataManager);
        let gaVTypeModel = await Raw.Query("select * from RL_HBVType_GAVType where GAVType=:GAVType", {
            replacements: {//参数化执行
                GAVType: vehicle.GAVType
            }
        })

        //排放标准审核方式二，根据国家车型网列出的参考整理的判断逻辑 FYQ 2017-06-20
        //摩托车审核排放标准逻辑
        // let VRDATE = vehicle.VRDATE;
        if (gaVTypeModel.VehicleBigType == VehicleBigTypeConst.MTC) {
            if (gaVTypeModel.GAVType == "M21") {
                if (vehicle.VRDATE < "2003-07-01") {
                    emissionStandard = EmissionStandardConst.G0;
                }
                else if ("2003-07-01" <= vehicle.VRDATE && vehicle.VRDATE < "2005-01-01") {
                    emissionStandard = EmissionStandardConst.G1;
                }
                else if ("2005-01-01" <= vehicle.VRDATE && vehicle.VRDATE < "2010-07-01") {
                    emissionStandard = EmissionStandardConst.G2;
                }
                else if ("2010-07-01" <= vehicle.VRDATE) {
                    emissionStandard = EmissionStandardConst.G3;
                }
            }
            else if ((gaVTypeModel.GAVType == "M12" || gaVTypeModel.GAVType == "M22")) {
                if (vehicle.VRDATE < "2004-01-01") {
                    emissionStandard = EmissionStandardConst.G0;
                }
                else if ("2004-01-01" <= vehicle.VRDATE && vehicle.VRDATE < "2006-01-01") {
                    emissionStandard = EmissionStandardConst.G1;
                }
                else if ("2006-01-01" <= vehicle.VRDATE && vehicle.VRDATE < "2010-07-01") {
                    emissionStandard = EmissionStandardConst.G2;
                }
                else if ("2010-07-01" <= vehicle.VRDATE) {
                    emissionStandard = EmissionStandardConst.G3;
                }
            }
            else if (vehicle.VRDATE < "2003-07-01") {
                emissionStandard = EmissionStandardConst.G0;
            }
            else if ("2003-07-01" <= vehicle.VRDATE && vehicle.VRDATE < "2005-01-01") {
                emissionStandard = EmissionStandardConst.G1;
            }
            else if ("2005-01-01" <= vehicle.VRDATE && vehicle.VRDATE < "2011-07-01") {
                emissionStandard = EmissionStandardConst.G2;
            }
            else if ("2011-07-01" <= vehicle.VRDATE) {
                emissionStandard = EmissionStandardConst.G3;
            }
            return this.success(emissionStandard); //摩托车返回的排放标准
        }

        //低速车审排放标准逻辑
        if (gaVTypeModel.VehicleBigType == VehicleBigTypeConst.DSQC) {
            if (vehicle.VRDATE < "2007-01-01") {
                emissionStandard = EmissionStandardConst.G0;
            }
            else if ("2007-01-01" <= vehicle.VRDATE && vehicle.VRDATE < "2008-01-01") {
                emissionStandard = EmissionStandardConst.G1;
            }
            else if (vehicle.VRDATE >= "2008-01-01") {
                emissionStandard = EmissionStandardConst.G2;
            }
            return this.success(emissionStandard);
        }

        //汽车审核排放标准逻辑
        //var vehicleType = vehicle.VehicleType;
        if (vehicle.FuelType == FuelTypeConst.ChaiYou) {
            if (vehicle.VML > 3500 && vehicle.VRDATE >= "2017-07-01") {
                emissionStandard = EmissionStandardConst.G5;
            }
            else if (vehicle.VML <= 3500 && vehicle.VRDATE >= "2018-01-01") {
                emissionStandard = EmissionStandardConst.G5;
            }
            else if (vehicle.VML > 3500 && vehicle.VRDATE >= "2013-07-01" && vehicle.VRDATE < "2017-07-01") {
                emissionStandard = EmissionStandardConst.G4;
            }
            else if (vehicle.VML <= 3500 && vehicle.VRDATE >= "2013-07-01" && vehicle.VRDATE < "2018-01-01") {
                emissionStandard = EmissionStandardConst.G4;
            }
            else if (vehicle.VML > 3500 && vehicle.VRDATE >= "2008-07-01" && vehicle.VRDATE < "2013-07-01") {
                emissionStandard = EmissionStandardConst.G3;
            }
            else if (gaVTypeModel.PG == PGConst.HuoChe && vehicle.VML <= 3500 && vehicle.VRDATE >= "2009-07-01" && vehicle.VRDATE < "2013-07-01") {
                emissionStandard = EmissionStandardConst.G3;
            }
            else if (gaVTypeModel.PG == PGConst.KeChe && vehicle.VML <= 3500 && vehicle.VRDATE >= "2008-07-01" && vehicle.VRDATE < "2013-07-01") {
                emissionStandard = EmissionStandardConst.G3;
            }
            else if (gaVTypeModel.PG == PGConst.KeChe && vehicle.VML <= 2500 && vehicle.RatedSeats <= 6 && vehicle.VRDATE >= "2005-07-01" && vehicle.VRDATE < "2008-07-01") {
                emissionStandard = EmissionStandardConst.G2;
            }
            else if (gaVTypeModel.PG == PGConst.HuoChe && vehicle.VML <= 2500 && vehicle.RatedSeats <= 6 && vehicle.VRDATE >= "2005-07-01" && vehicle.VRDATE < "2009-07-01") {
                emissionStandard = EmissionStandardConst.G2;
            }
            else if (gaVTypeModel.PG == PGConst.KeChe && vehicle.VML <= 3500 && vehicle.VRDATE >= "2006-07-01" && vehicle.VRDATE < "2008-07-01") {
                emissionStandard = EmissionStandardConst.G2;
            }
            else if (gaVTypeModel.PG == PGConst.HuoChe && vehicle.VML <= 3500 && vehicle.VRDATE >= "2006-07-01" && vehicle.VRDATE < "2009-07-01") {
                emissionStandard = EmissionStandardConst.G2;
            }
            else if (vehicle.VML > 3500 && vehicle.VRDATE >= "2004-09-01" && vehicle.VRDATE < "2008-07-01") {
                emissionStandard = EmissionStandardConst.G2;
            }
            else if (gaVTypeModel.PG == PGConst.KeChe && vehicle.VML <= 2500 && vehicle.RatedSeats <= 6 && vehicle.VRDATE >= "2000-07-01" && vehicle.VRDATE < "2005-07-01") {
                emissionStandard = EmissionStandardConst.G1;
            }
            else if (vehicle.VML <= 3500 && vehicle.VRDATE >= "2001-10-01" && vehicle.VRDATE < "2006-07-01") {
                emissionStandard = EmissionStandardConst.G1;
            }
            else if (vehicle.VML > 3500 && vehicle.VRDATE >= "2001-09-01" && vehicle.VRDATE < "2004-09-01") {
                emissionStandard = EmissionStandardConst.G1;
            }
            else if (gaVTypeModel.PG == PGConst.KeChe && vehicle.VML <= 2500 && vehicle.RatedSeats <= 6 && vehicle.VRDATE < "2000-07-01") {
                emissionStandard = EmissionStandardConst.G0;
            }
            else if (vehicle.VML <= 3500 && vehicle.VRDATE < "2001-10-01") {
                emissionStandard = EmissionStandardConst.G0;
            }
            else if (vehicle.VML > 3500 && vehicle.VRDATE < "2001-09-01") {
                emissionStandard = EmissionStandardConst.G0;
            }
            return this.success(emissionStandard);
        }//vehicle.FuelType == FuelTypeConst.B
        else//非柴油车
        {
            if (vehicle.VML <= 3500 && vehicle.VRDATE >= "2017-01-01") {
                emissionStandard = EmissionStandardConst.G5;
            }
            else if (vehicle.VML > 3500 && vehicle.VRDATE >= "2013-07-01") {
                emissionStandard = EmissionStandardConst.G4;
            }
            else if (vehicle.FuelType != "A" && vehicle.VML > 3500 && vehicle.VRDATE >= "2011-01-01") {
                emissionStandard = EmissionStandardConst.G4;
            }
            else if (vehicle.VML <= 3500 && vehicle.VRDATE >= "2011-07-01" && vehicle.VRDATE < "2017-01-01") {
                emissionStandard = EmissionStandardConst.G4;
            }
            else if (gaVTypeModel.PG == PGConst.KeChe && vehicle.VML <= 2500 && vehicle.RatedSeats <= 6 && vehicle.HasOBD == "1" && vehicle.VRDATE >= "2009-01-01" && vehicle.VRDATE < "2011-07-01") {
                emissionStandard = EmissionStandardConst.G3;
            }
            else if (gaVTypeModel.PG == PGConst.KeChe && vehicle.VML <= 2500 && vehicle.RatedSeats <= 6 && vehicle.HasOBD == "0" && vehicle.VRDATE >= "2008-07-01" && vehicle.VRDATE < "2011-07-01") {
                emissionStandard = EmissionStandardConst.G3;
            }
            else if (vehicle.VML <= 3500 && vehicle.VRDATE >= "2008-07-01" && vehicle.VRDATE < "2011-07-01") {
                emissionStandard = EmissionStandardConst.G3;
            }
            else if (vehicle.FuelType != "A" && vehicle.VML > 3500 && vehicle.VRDATE >= "2008-07-01" && vehicle.VRDATE < "2011-07-01") {
                emissionStandard = EmissionStandardConst.G3;
            }
            else if (vehicle.VML > 3500 && vehicle.VRDATE >= "2010-07-01" && vehicle.VRDATE < "2013-07-01") {
                emissionStandard = EmissionStandardConst.G3;
            }
            else if (gaVTypeModel.PG == PGConst.KeChe && vehicle.VML <= 2500 && vehicle.RatedSeats <= 6 && vehicle.HasOBD == "1" && vehicle.VRDATE >= "2005-07-01" && vehicle.VRDATE < "2009-07-01") {
                emissionStandard = EmissionStandardConst.G2;
            }
            else if (gaVTypeModel.PG == PGConst.KeChe && vehicle.VML <= 2500 && vehicle.RatedSeats <= 6 && vehicle.HasOBD == "0" && vehicle.VRDATE >= "2005-07-01" && vehicle.VRDATE < "2008-07-01") {
                emissionStandard = EmissionStandardConst.G2;
            }
            else if (vehicle.VML <= 3500 && vehicle.VRDATE >= "2006-07-01" && vehicle.VRDATE < "2008-07-01") {
                emissionStandard = EmissionStandardConst.G2;
            }
            else if (vehicle.FuelType != "A" && vehicle.VML > 3500 && vehicle.VRDATE >= "2004-09-01" && vehicle.VRDATE < "2008-07-01") {
                emissionStandard = EmissionStandardConst.G2;
            }
            else if (vehicle.VML > 3500 && vehicle.VRDATE >= "2004-09-01" && vehicle.VRDATE < "2010-07-01") {
                emissionStandard = EmissionStandardConst.G2;
            }
            else if (gaVTypeModel.PG == PGConst.KeChe && vehicle.VML <= 2500 && vehicle.RatedSeats <= 6 && vehicle.VRDATE >= "2000-07-01" && vehicle.VRDATE < "2005-07-01") {
                emissionStandard = EmissionStandardConst.G1;
            }
            else if (vehicle.VML <= 3500 && vehicle.VRDATE >= "2001-10-01" && vehicle.VRDATE < "2006-07-01") {
                emissionStandard = EmissionStandardConst.G1;
            }
            else if (vehicle.FuelType != "A" && vehicle.VML > 3500 && vehicle.VRDATE >= "2003-09-01" && vehicle.VRDATE < "2004-09-01") {
                emissionStandard = EmissionStandardConst.G1;
            }
            else if (vehicle.VML > 3500 && vehicle.VRDATE >= "2003-07-01" && vehicle.VRDATE < "2004-09-01") {
                emissionStandard = EmissionStandardConst.G1;
            }
            else if (gaVTypeModel.PG == PGConst.KeChe && vehicle.VML <= 2500 && vehicle.RatedSeats <= 6 && vehicle.VRDATE < "2007-07-01") {
                emissionStandard = EmissionStandardConst.G0;
            }
            else if (vehicle.VML <= 3500 && vehicle.VRDATE < "2001-10-01") {
                emissionStandard = EmissionStandardConst.G0;
            }
            else if (vehicle.FuelType != "A" && vehicle.VML > 3500 && vehicle.VRDATE < "2003-09-01") {
                emissionStandard = EmissionStandardConst.G0;
            }
            else if (vehicle.VML > 3500 && vehicle.VRDATE < "2003-07-01") {
                emissionStandard = EmissionStandardConst.G0;
            }
            return this.success(emissionStandard);
        }//非柴油车
    },
    /**
     * 转成树形式
     * @param {*} info 数组对象
     * @param {*} rootValue 根节点的值，默认为TOP
     * @param {*} childrenKey 节点key，默认为children
     */
    recursion(info, rootValue, childrenKey) {
        if (this.isEmptyOr(info)) {
            return info;
        }
        let map = {};
        rootValue = rootValue || "TOP";
        childrenKey = childrenKey || "children";
        for (let i = 0; i < info.length; i++) {
            if (info[i].pvalue == null) {
                info[i].pvalue = rootValue;
            }
            map[info[i].value] = info[i];
        }
        // //console.log(map)
        let res = [];
        for (let i = 0; i < info.length; i++) {
            let temp = info[i];
            // //console.log(temp)
            // //console.log(temp.pvalue)
            if (temp.pvalue == rootValue) {
                res.push(map[temp.value]);
            } else {
                let p = map[temp.pvalue];
                // console.info(temp.pvalue);
                if (this.isEmpty(p[childrenKey])) {
                    p[childrenKey] = [];
                }
                p[childrenKey].push(map[temp.value]);
            }
        }
        return res;
    },
    /**
     * 是否空，null，undefined，''，[],{}都是true，其他false
     * @param {*} v 需要判空的值
     */
    isEmpty(v) {
        if (v === null) {
            return true;
        }
        if (typeof v === "undefined") {
            return true;
        }
        if (typeof v === "string") {
            if (v === '') {
                return true;
            } else {
                return false;
            }
        }
        if (v instanceof String) {
            if (v.toString() === '') {
                return true;
            } else {
                return false;
            }
        }
        if (v instanceof Array) {
            if (v.length == 0) {
                return true;
            } else {
                return false;
            }
        }
        if (JSON.stringify(v) == "{}") {
            return true;
        } else {
            return false;
        }
    },
    isNotEmpty(v) {
        return !this.isEmpty(v);
    },
    success(data) {
        data = data || {};
        return {
            "msg": "成功",
            "code": 0,
            "data": data
        };
    },
    error(msg, data) {
        data = data || {};
        msg = msg || '服务器异常';
        return {
            "msg": msg,
            "code": 1,
            "data": data
        };
    },
    isEmptyOr(...objs) {
        if (objs == null || objs.length <= 0) {
            return true;
        }
        for (let i = 0; i < objs.length; i++) {
            if (this.isEmpty(objs[i])) {
                return true;
            }
        }
        return false;
    },
    isNotEmptyAnd(...objs) {
        if (objs == null || objs.length <= 0) {
            return false;
        }
        for (let i = 0; i < objs.length; i++) {
            if (this.isEmpty(objs[i])) {
                return false;
            }
        }
        return true;
    },
    isNotEmptyOr(...objs) {
        if (objs == null || objs.length <= 0) {
            return false;
        }
        for (let i = 0; i < objs.length; i++) {
            if (this.isNotEmpty(objs[i])) {
                return true;
            }
        }
        return false;
    },
    /**
     * 创建多级文件路径，例：C:/A/B/C
     * @param {*} dirname 路径
     */
    mkdirsSync(dirname) {
        if (fs.existsSync(dirname)) {
            return true;
        } else {
            if (this.mkdirsSync(path.dirname(dirname))) {
                fs.mkdirSync(dirname);
                return true;
            }
        }
    },
    /// <summary>
    /// 获取该次检测属于第几个检测周期，提前三个月检测算下一个检测周期
    /// </summary>
    /// <param name="veh">车辆信息</param>
    /// <param name="InspectionDate">检测时间</param>
    /// <returns>object.PeriodNum: 该次检测属于第几个检测周期</returns>
    /// <returns>object.PeriodMonth: 下一个检测周期</returns>
    /// <returns>object.PeriodDate: 下一次检测时间</returns>
    GetVehicleInspectionPeriod(veh, InspectionDate) {
        let PeriodNum = -1;//--第几个检测周期
        let VehicleAge = 0;//--车辆年限
        let PeriodMonth = 0;//--下一个检测周期
        let VRdat_Y = 0;
        let VRdat_M = 0;
        let VRdat_D = 0;
        let PeriodDate_Y = 0;
        let PeriodDate_M = 0;
        let PeriodDate_D = 0;

        let VRDate = new Date(veh.VRDATE);//初次登记日期
        let ocha = veh.OCHA;//营运性质：01营运；02非营运
        let pg = veh.PG; //客 / 货 01客，02货
        let vehicleType = veh.VehicleType;//车辆类型：01微型；02小型（轻型）；03中型；04大型（重型）;05 轻便摩托车；06 摩托车；07 低速汽车
        let gavType = veh.GAVType;
        let PeriodDate = VRDate;
        PeriodDate.setMonth(PeriodDate.getMonth() - 3);
        VRdat_Y = PeriodDate.getFullYear();
        VRdat_M = PeriodDate.getMonth();
        VRdat_D = PeriodDate.getDate();

        if (VRDate > InspectionDate) {
            return null;
        }
        while (PeriodDate <= InspectionDate) {
            //-------------------------计算车辆下次检测时的年限--开始-------------------------------------------- -
            PeriodDate_Y = PeriodDate.getFullYear();
            PeriodDate_M = PeriodDate.getMonth();
            PeriodDate_D = PeriodDate.getDate();
            VehicleAge = PeriodDate_Y - VRdat_Y;
            if (VRdat_M > PeriodDate_M || VRdat_D > PeriodDate_D) {
                --VehicleAge;
            }
            if (VehicleAge < 0) VehicleAge = 0;//不满一年算0年
            //--------------------------计算车辆下次检测时的年限--结束--------------------------------------------
            //--------------------------计算下一个检测周期时间--开始----------------------------------------------
            if (ocha == "01")//营运
            {
                if (pg == "02") {//货车
                    if (VehicleAge < 8) {
                        PeriodMonth = 12;
                    }
                    else PeriodMonth = 6;
                }
                else//客车
                {
                    if (veh.RatedSeats < 6) {
                        if ((VehicleAge < 8 && !(veh.UseOfAuto == "D" || veh.UseOfAuto == "N")) || (VehicleAge < 5 && (veh.UseOfAuto == "D" || veh.UseOfAuto == "N"))) {//8年内12（出租车、教练车5年内）
                            PeriodMonth = 12;
                        }
                        else if ((VehicleAge >= 8 && !(veh.UseOfAuto == "D" || veh.UseOfAuto == "N")) || (VehicleAge >= 5 && (veh.UseOfAuto == "D" || veh.UseOfAuto == "N"))) {//8年以上6（出租车、教练车5年以上）
                            PeriodMonth = 6;
                        }
                    }
                    else if (veh.RatedSeats > 5 && veh.RatedSeats < 9) {
                        if (VehicleAge < 8) {//8年内12
                            PeriodMonth = 12;
                        }
                        else PeriodMonth = 6;//8年以上6
                    }
                    else if (veh.RatedSeats > 8) {
                        if (VehicleAge < 8) {//8年内12
                            PeriodMonth = 12;
                        }
                        else PeriodMonth = 6;//8年以上6
                    }

                }
            }
            else {//非营运
                if (pg == "02") {//货车
                    if (VehicleAge < 6) {//6年内12个月
                        PeriodMonth = 12;
                    }
                    else if (VehicleAge >= 6 && VehicleAge < 15) {//6年以上15年以内12
                        PeriodMonth = 12;
                    }
                    else PeriodMonth = 6;//15年以上6
                }
                else//客车
                {
                    if (veh.RatedSeats < 6) {
                        if (VehicleAge < 6) {
                            PeriodMonth = 24;
                        }
                        else if (VehicleAge < 10 && gavType != "K39" && gavType != "K49") {//10年内24个月（面包车除外）
                            PeriodMonth = 24;
                        }
                        else if (VehicleAge >= 6 && VehicleAge < 15) {//6年以上15年以内12
                            PeriodMonth = 12;
                        }
                        else PeriodMonth = 6;//15年以上6
                    }
                    else if (veh.RatedSeats > 5 && veh.RatedSeats < 9) {
                        if (VehicleAge < 6)//6年内24个月
                            PeriodMonth = 24;
                        else if (VehicleAge < 10 && gavType != "K39" && gavType != "K49" && (vehicleType == "01" || vehicleType == "02")) {//10年内24个月（面包车除外）
                            PeriodMonth = 24;
                        }
                        else if (VehicleAge >= 6 && VehicleAge < 15) {//6年以上15年以内12
                            PeriodMonth = 12;
                        }
                        else PeriodMonth = 6;//15年以上6
                    }
                    else if (veh.RatedSeats > 8) {
                        if (VehicleAge < 6)//6年内12个月
                            PeriodMonth = 12;
                        else if (VehicleAge >= 6 && VehicleAge < 15) {//6年以上15年以内12
                            PeriodMonth = 12;
                        }
                        else PeriodMonth = 6;//15年以上6
                    }
                }
            }
            if (veh.UseOfAuto == "R") {
                if (VehicleAge < 6) {
                    PeriodMonth = 12;
                }
                else PeriodMonth = 6;
            }
            if (veh.UseOfAuto == "O" || veh.UseOfAuto == "P" || veh.UseOfAuto == "Q" || veh.UseOfAuto == "S") {
                PeriodMonth = 6;
            }

            if (PeriodMonth == 0) PeriodMonth = 6;
            //--------------------------计算下一个检测周期时间--结束----------------------------------------------
            //PeriodDate = PeriodDate.AddMonths(PeriodMonth);
            PeriodDate.setMonth(PeriodDate.getMonth() + PeriodMonth);
            ++PeriodNum;
        }
        return {
            PeriodNum: PeriodNum,
            PeriodMonth: PeriodMonth,
            PeriodDate: PeriodDate
        };
    },
    /// <summary>
    /// 获取一个检测周期的初检日期
    /// </summary>
    /// <param name="vehicleID">车辆ID</param>
    /// <param name="startTime">检测周期的开始时间</param>
    /// <param name="endTime">检测周期的结束时间</param>
    /// <returns></returns>
    async GetFirstInspectionDate(VehicleID, startTime, endTime) {
        const { app } = this;
        const { Raw } = app.Dbs.hj;
        try {
            let res = await Raw.Query(`select  min(IUIDATE)  as min_IUIDATE from InspectionData where VehicleID=:VehicleID and
                          IUIDATE>=:startTime and IUIDATE<=:endTime and Validity=1 and InspectionWay<'90' `, {
                replacements: {
                    VehicleID,
                    startTime,
                    endTime
                }
            });
            if (!res) return null
            else return res.min_IUIDATE;
        } catch (error) {
            this.appp.CoreAPI.Log.trace('GetFirstInspectionDate报错' + error);
            return null

        }
    },
    //获取车辆信息
    async getVehicleInfo(content) {
        let { transaction, Raw } = this.app.Dbs.hj;
        let replacements = {};
        let sql = "select VehicleID,UniqueString,VLPN,VLPNColor,VehicleColor,VLPNType,VIN,IUVTYPE,VehicleBigType,PG,VehicleType,GAVType,VariableForm,KerbMass,BenchmarkMass,VML,VLDATE,RatedSeats,FactoryPlateModel,Mileage,OCHA,UseOfAuto,RegistDate,VRDATE,AbandonedYear,EngineNum,IUETYPE,EDSPL,IntakeWay,FuelType,OilSupplyWay,EngineRatedSpeed,EnginePower,ProductDate,ChassisType,GearCount,DriveForm,TyreType,IUVMANU,AxleWeight,StrokeCount,IUEMANU,CylinderCount,HasCCA,HasOxygenSensor,CatalyticConvertersAndCorp,GasVentCount,InspectionPeriod,HasOBD,IsDoubleFuel,EnvironmentalInfoCard,BZTYPE,Province,City,County,OwnerName,Sex,Tel,CredentialsType,CredentialsNum,ZipCode,Address,Remarks,ESignNo,EmissionStandard,ExceedTimeLimit,VehicleKind,IsLocalInspection,EStatus,PriCode,CityCode,VStatus,RatioKey,DateOfPurchase,SyncFlag,IsInValid,NewVehicleYear,SecondVehicleYear,UsedingVehicleYear,HisUniqueString,RecordNo,InValidDate,Creater,CreateTime,xh,IsImportedCar,LastUpdateTime,DataSources,UpdateDataSources,WqCheckDate,VehicleCode_DR,GAIUVTYPE,PeriodCheckTimes,TsNo,IsAndPoliceMatch,IsSecondHandCar,SecondHandCarPlace,IsJSJB,VerifyPFWay,OldVLPN,OldVLPNColor,OrgCode,BGXZ,FuelSpecification,SlidingDevice,IsNew,NewSyncError,InspectionMethod,OldOwner,OldProv,OldCity,OldCounty,CommisionAgent,CAIdentification,CAPhoneNum,ESPOrganizationCode,ESPStationCode,smallintz,IsKghy,GASyncFlag,PoliceMatchDate,Egr,Tg,Hcl,HclType,HasDK,CanCloseESP,inRemarks,VerifyWay,IsLockPrintReport,AddVehKind,LockStatus,MotorType,ESDType,BatteryCapacity,DPF,DPFType,SCR,SCRType,OBDType,IsHasROBD,GBZZXT,HDZZL,IsExemption,JCXZ,HasFueltankCover from Vehicle where IsInValid=0 ";
        if (this.isNotEmpty(content.vin)) {
            sql += " and VIN=:vin";
            replacements['vin'] = content.vin;
        }
        if (this.isNotEmpty(content.vlpn)) {
            sql += " and vlpn=:vlpn";
            replacements['vlpn'] = content.vlpn;
        }
        if (this.isNotEmpty(content.vlpnColor)) {
            sql += " and vlpnColor=:vlpnColor";
            replacements['vlpnColor'] = content.vlpnColor;
        }
        if (this.isNotEmpty(content.vehicleID)) {
            sql += " and vehicleID=:vehicleID";
            replacements['vehicleID'] = content.vehicleID;
        }
        let vehicleModels = await Raw.QueryList(sql, {
            replacements
        })
        return vehicleModels;
    },
    /// <summary>
    /// 根据车架或车牌+颜色检索车辆和权限代码是否存在(参数车牌、车牌颜色与车架号不能同时为空)
    /// </summary>
    /// <param name="vin">车架号</param>
    /// <param name="vlpn">车牌号</param>
    /// <param name="vlpnColor">车牌颜色</param>
    /// <param name="vehicleID">车辆id</param>
    /// <param name="priCode">权限代码</param>
    /// <returns>是否存在车辆，0不存在，1存在相同车架号，2存在相同车牌及颜色,3存在相同车架且存在相同车牌及车牌颜色</returns>
    async VehicleExistsByVINOrVLPNAndColor(vin, vlpn, vlpnColor, vehicleID, priCode, /*IDataManager dataManager,*/ isAllow) {
        // if (!priCode) return -1;
        // if (priCode != null && priCode.length > 4) {
        //     priCode = priCode.substring(0, 4); 
        // }
        //console.log(vin, vlpn, vlpnColor, vehicleID, priCode, /*IDataManager dataManager,*/ isAllow)
        if (isAllow) return 0;
        //对于新增的车辆，车辆ID不存在，则给-1
        if (this.isEmpty(vehicleID)) vehicleID = "-1";
        let reInt = 0;
        if (this.isNotEmpty(vin)) {
            //是否有相同车架号
            let vehicleModels = await this.getVehicleInfo({ vin });
            for (const vehicle of vehicleModels) {
                if (vehicle["VehicleID"] != vehicleID) {
                    reInt = 1;
                    break;
                }
            }
        }
        //与公安联网时不检查此项
        if (!vlpn && !vlpnColor && await this.getAllSystemParam("01_EnableDataSwitchingWithPolice") != "1") {
            //是否有相同车牌和车牌颜色
            let vehicleModels = await this.getVehicleInfo({ vlpn, vlpnColor })
            for (const vehicle of vehicleModels) {
                if (vehicle["VehicleID"] != vehicleID) {
                    if (reInt == 1) {
                        reInt = 3;
                    } else {
                        reInt = 2;
                    }
                    break;
                }
            }
        }
        return reInt;
    },
    /**
     * 获取系统配置
     * @param {*} v key值，null返回所有，否则返回指定值
     */
    async getAllSystemParam(v) {
        let { app, ctx } = this;
        let redis = app.redis.get("hj");
        if (v == null) {
            let all = await redis.hgetall("systemconfig");
            for (let key in all) {
                if (all[key] === "false") {
                    all[key] = false;
                }
                if (all[key] === "true") {
                    all[key] = true;
                }
            }
            return all;
        } else {
            let temp = await redis.hget("systemconfig", v);
            if (temp === "false") {
                temp = false;
            }
            if (temp === "true") {
                temp = true;
            }
            return temp;
        }
    },
    /**
 * 获取waitcheck表的字段
 */
    filterWaitCheckFields(data) {
        let res = {};
        if (data == null) {
            return data;
        }
        let strs = ["CheckId", "CityCode", "OrgCode", "ESPStationCode", "CheckType", "BusinessKey", "BusinessType", "BusinessTable", "VehicleID", "UniqueString", "VIN", "VLPN", "VLPNColor", "GAVType", "IUVTYPE", "IUETYPE", "ProductDate", "RatedSeats", "FactoryPlateModel", "OwnerName", "VehicleKind", "ApplyTime", "Applicant", "CheckTime", "Checker", "Status", "Remarks", "IsModifyMainData", "ApplyReason", "ApplyUserName", "CheckStep", "FuelType", "VRDATE", "EngineNum", "VML", "CredentialsType", "CredentialsNum", "Tel", "Address", "AuditState", "DBCredentialsType", "DBCredentialsNum", "DBName", "KerbMass", "BenchmarkMass", "EDSPL", "EnginePower", "EmissionStandard", "UseOfAuto", "CountyCode", "ApplyDetailReason"];
        for (let str of strs) {
            if (data.hasOwnProperty(str)) {
                res[str] = data[str];
            }
        }
        return res;
    },
    /**
     * 获取Vehicle表的字段
     */
    filterVehicleFields(data) {
        let res = {};
        if (data == null) {
            return data;
        }
        let strs = ["VehicleID", "UniqueString", "VLPN", "VLPNColor", "VehicleColor", "VLPNType", "VIN", "IUVTYPE", "VehicleBigType", "PG", "VehicleType", "GAVType", "VariableForm", "KerbMass", "BenchmarkMass", "VML", "VLDATE", "RatedSeats", "FactoryPlateModel", "Mileage", "OCHA", "UseOfAuto", "RegistDate", "VRDATE", "AbandonedYear", "EngineNum", "IUETYPE", "EDSPL", "IntakeWay", "FuelType", "OilSupplyWay", "EngineRatedSpeed", "EnginePower", "ProductDate", "ChassisType", "GearCount", "DriveForm", "TyreType", "IUVMANU", "AxleWeight", "StrokeCount", "IUEMANU", "CylinderCount", "HasCCA", "HasOxygenSensor", "CatalyticConvertersAndCorp", "GasVentCount", "InspectionPeriod", "HasOBD", "IsDoubleFuel", "EnvironmentalInfoCard", "BZTYPE", "Province", "City", "County", "OwnerName", "Sex", "Tel", "CredentialsType", "CredentialsNum", "ZipCode", "Address", "Remarks", "ESignNo", "EmissionStandard", "ExceedTimeLimit", "VehicleKind", "IsLocalInspection", "EStatus", "PriCode", "CityCode", "VStatus", "RatioKey", "DateOfPurchase", "SyncFlag", "IsInValid", "NewVehicleYear", "SecondVehicleYear", "UsedingVehicleYear", "HisUniqueString", "RecordNo", "InValidDate", "Creater", "CreateTime", "xh", "IsImportedCar", "LastUpdateTime", "DataSources", "UpdateDataSources", "WqCheckDate", "VehicleCode_DR", "GAIUVTYPE", "PeriodCheckTimes", "TsNo", "IsAndPoliceMatch", "IsSecondHandCar", "SecondHandCarPlace", "IsJSJB", "VerifyPFWay", "OldVLPN", "OldVLPNColor", "OrgCode", "BGXZ", "FuelSpecification", "SlidingDevice", "IsNew", "NewSyncError", "InspectionMethod", "OldOwner", "OldProv", "OldCity", "OldCounty", "CommisionAgent", "CAIdentification", "CAPhoneNum", "ESPOrganizationCode", "ESPStationCode", "smallintz", "IsKghy", "GASyncFlag", "PoliceMatchDate", "Egr", "Tg", "Hcl", "HclType", "HasDK", "CanCloseESP", "inRemarks", "VerifyWay", "IsLockPrintReport", "AddVehKind", "LockStatus", "MotorType", "ESDType", "BatteryCapacity", "DPF", "DPFType", "SCR", "SCRType", "OBDType", "IsHasROBD", "GBZZXT", "HDZZL", "IsExemption", "JCXZ", "HasFueltankCover"];
        for (let str of strs) {
            if (data.hasOwnProperty(str)) {
                res[str] = data[str];
            }
        }
        return res;
    },
    /**
     * 获取InspectionData表的字段
     */
    filterInspectionFields(data) {
        let res = {};
        if (data == null) {
            return data;
        }
        let strs = ["InspectionDataID", "StationCode", "VehicleID", "UniqueString", "CityCode", "CountyCode", "InspectionNum", "ESignNo", "VLPN", "VIN", "InspectionOperator", "InspectionDriver", "Temperature", "Pressure", "Humidity", "IUTID", "VDCT", "IUTYPE", "InspectionStandard", "InspectionWay", "InspectionNature", "InspectionTimes", "IUIDATE", "TSM", "SceneCode", "SyncFlag", "UploadDate", "UploadMonth", "UploadYear", "DetectStartTime", "DetectEndTime", "ICheck", "CheckTime", "VinFlag", "EngineNumFlag", "VerifyResult", "VerifyOperator", "VerifyTime", "CheckYear", "CheckMonth", "InspectionReportNo", "InspectionKind", "RecordNo", "DistinguishVLPN", "NewVDCT", "VLPNColor", "VehicleColor", "VLPNType", "IUVTYPE", "VehicleBigType", "PG", "VehicleType", "GAVType", "KerbMass", "BenchmarkMass", "VML", "RatedSeats", "FactoryPlateModel", "Mileage", "OCHA", "UseOfAuto", "VRDATE", "AbandonedYear", "IUETYPE", "EDSPL", "IntakeWay", "FuelType", "OilSupplyWay", "EngineRatedSpeed", "EnginePower", "ProductDate", "DriveForm", "TyreType", "IUVMANU", "AxleWeight", "StrokeCount", "CylinderCount", "HasCCA", "HasOxygenSensor", "GasVentCount", "HasOBD", "IsDoubleFuel", "BZTYPE", "Province", "City", "County", "OwnerName", "Sex", "Tel", "CredentialsType", "CredentialsNum", "ZipCode", "Address", "EmissionStandard", "VehicleKind", "xh", "IsImportedCar", "LastUpdateTime", "VehicleCode_DR", "PeriodCheckTimes", "cFaceCheckID", "IsCheckout_DR", "IsCanPrint", "PrintTimes", "SurplusPrintTimes", "NewInspectionTimes", "Validity", "StationShortName", "AlarmType", "NewSyncError", "ChassisType", "EngineNum", "VariableForm", "GearCount", "IUEMANU", "CatalyticConvertersAndCorp", "QCode", "SendedToPoliceMiddleDB", "SendedToPoliceMiddleDBRemark", "SendedToPoliceTime", "SendedToPoliceTimes", "InspectionLoginName", "Remarks", "ReportPrintTime", "ReportPrinter", "Egr", "Tg", "Hcl", "HclType", "HasDK", "CanCloseESP", "Dynamometer", "DProvider", "DIEAC", "DValidPeriod", "Analyser", "AProvider", "AIEAC", "AValidPeriod", "Flowmeter", "FProvider", "FIEAC", "FValidPeriod", "Smokemeter", "SProvider", "SIEAC", "SValidPeriod", "Tachometer", "TProvider", "TIEAC", "TValidPeriod", "OTSensor", "OProvider", "OIEAC", "OValidPeriod", "WeatherStationType", "WeatherStationProvider", "WIEAC", "WValidPeriod", "SendedStatus", "FirstReportPrintTime", "IsSpecialAttentionVehicle", "IsBlackSmoke", "IsDailyWork", "AddVehKind", "IsExtCheck", "MotorType", "ESDType", "BatteryCapacity", "DPF", "DPFType", "SCR", "SCRType", "FuelSpecification", "AName", "IsUploadLambdaLimit", "AuthorizedSignature", "Certifier", "IsHasROBD", "RepairStatus", "HasFueltankCover"];
        for (let str of strs) {
            if (data.hasOwnProperty(str)) {
                res[str] = data[str];
            }
        }
        return res;
    },
    /**
     * 获取字典表数据
     * @param {*} key key值，实际上是表名小写
     * @param {*} code 字典表CodeValue
     */
    async getDictionaryTable(key, code) {
        let { app, ctx } = this;
        let { transaction, Raw } = app.Dbs.hj;
        let redis = app.redis.get("hj");
        let json = await redis.hgetall("dictionarytable");
        if (json != null) {
            for (let key in json) {
                try {
                    json[key] = JSON.parse(json[key]);
                } catch (e) {
                    //console.log(e.message);
                }
            }
            if (key != null) {
                if (code != null) {
                    let list = json[key];
                    if (list != null && list.length > 0) {
                        for (let i = 0; i < list.length; i++) {
                            if (list[i].CodeValue == code) {
                                return list[i];
                            }
                        }
                    }
                }
                return json[v];
            }
        }
        return json;
    },
    /**
     * 获取当前用户
     * @param {*} v key值，null返回所有，否则返回指定值
     * let currentUser={};
      currentUser['userId']='U000001';
      currentUser['displayName']=encodeURI('管理员', "UTF-8");
      currentUser['loginName']=encodeURI('admin', "UTF-8");
      currentUser['userOrg']='440604010';//站点编号
      currentUser['countyCode']='440604';//县
      currentUser['areaCode']='440600';//市
      currentUser['priCode']='4406';//权限代码
      currentUser['userLine']='01';//工位
      currentUser['isLocal']='01';//是否本地
      currentUser["gasolineFooterHeight"]="280mm,90mm,300,20";
      currentUser["dieselFooterHeight"]="270mm,90mm,200,20";
      currentUser["gasBarCodeStyle"]="87%,72%";
      currentUser["dieselBarCodeStyle"]="70%,72%";
      currentUser["gasContentStyle"]="5,-20";
      currentUser["dieselContentStyle"]="20,-20";
      currentUser["ProvinceCode"]="20,-20";
      currentUser["CityCode"]="20,-20";
      currentUser["ESPOrganizationName"]=encodeURI('佛山禅顺通', "UTF-8");//站点名称
      ctx.cookies.set('currentUser', JSON.stringify(currentUser), {
        httpOnly: false
      });
      ctx.session.currentUser=currentUser;
     */
    getCurrentUser(v) {
        let { app, ctx } = this;
        let user = ctx.session.currentUser;
        if (user == null) {
            user = {};
        }
        if (v != null) {
            return user[v];
        } else {
            return user;
        }
    },
    /**
     * 生成上传端的数据标识
     * @param {*} orgId 组织结构编码
     * @param {*} sta 工位号
     */
    getUniqueString(orgId, sta) {
        let time = moment().format('YYYYMMDDHHmmssSSS');
        return orgId + sta + time + parseInt(Math.random() * (99 - 10 + 1) + 10, 10);
    },
    /**
     * 生成受理编号
     * @param {*} orgId 组织结构编码
     * @param {*} sta 工位号
     */
    GetInspectionNum(orgId, sta) {
        let aNO = '';
        if (!orgId && !sta) {
            let user = this.getCurrentUser();
            //  站点编码+线编码+日期
            aNO = user['userOrg'] + user['userLine'] + moment(new Date()).format('YYYYMMDDHHmmssSSS');
        } else {
            aNO = orgId + sta + moment().format('YYYYMMDDHHmmssSSS');
        }

        return aNO;
    },
    /**
     * 更新车辆信息
     * @param {*} data 要更新的实体
     * @param {*} changeDataSource 修改来源
     * @param {*} changer 修改人
     */
    async UpdateCar(data, changeDataSource, changer) {
        let { app, ctx } = this;
        let { transaction, Raw } = this.app.Dbs.hj;
        if (ctx.helper.isNotEmpty(data.VLPN)) {
            data.VLPN = data.VLPN.replace(/\s+/g, "").toUpperCase();
        }
        if (ctx.helper.isNotEmpty(data.VIN)) {
            data.VIN = data.VIN.replace(/\s+/g, "").replace("\t", "").toUpperCase();
        }
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
        if (ctx.helper.isEmpty(data.CreateTime)) {
            data.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        if (!data.xh) {
            data.IsAndPoliceMatch = "1";
        }
        if (ctx.helper.isEmpty(data.Creater)) {
            data.Creater = changer;
        }
        if (ctx.helper.isNotEmpty(changer)) {
            let hasChange = true;//this.LogChanges(TABLE_NAME, changeDataSource, model.VehicleID.ToString(), model.Fields, changer);
            if (hasChange) {
                data.LastUpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');
                data.UpdateDataSources = changeDataSource;
                data.SyncFlag = 0;
            }
        } else {
            let sql = `select LastUpdateTime from Vehicle where VehicleID=:VehicleID`;
            let info = await Raw.Query(sql, { replacements: { VehicleID: data.vehicleID } }) || {};
            if (info.LastUpdateTime != null && info.LastUpdateTime > data.LastUpdateTime) {
                return ctx.helper.error("此车已被另一个用户修改，您需要重新检索出来才可进行操作！");
            }
        }
        data.LastUpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        delete data['DataSources'];
        let updateFields = this.filterVehicleFields(data);
        delete updateFields['VehicleID'];
        //console.log(updateFields,updateFields.length);
        await Raw.Update("Vehicle", updateFields, {
            wherestr: "where VehicleID=:VehicleID",
            replacements: { VehicleID: data.VehicleID }
        })
        let vinfo = await this.getVehicleInfo({ vehicleID: data.VehicleID });
        if (vinfo.length > 0) {
            vinfo = vinfo[0];
            vinfo.State = "1";
        } else {
            return ctx.helper.error("找不到该车");
        }
        return ctx.helper.success(vinfo);
    },
    /**
     * 插入redis（hset）
     * @param {*} key 
     * @param {*} n 
     * @param {*} v 
     */
    async InsertHashSetKeyToRedis(key, n, v) {
        let { app, ctx } = this;
        let redis = app.redis.get("hj");
        redis.hset(key, n, v);
    },
    /**
     * 删除redis(hset)
     * @param {*} key 
     * @param {*} n 
     */
    async DeleteHashSetKeyToRedis(key, n) {
        let { app, ctx } = this;
        let redis = app.redis.get("hj");
        redis.hdel(key, n);
    },
    /// <summary>
    /// 是否特殊军车
    /// </summary>
    /// <param name="vlpn">号牌号码</param>
    /// <returns>true是，false否</returns>
    async IsMilitaryVehicle(vlpn) {
        let str = ['A', 'B', 'C', 'E', 'G', 'H', 'J', 'K', 'L', 'N', 'S', 'V', 'W', 'Z'];
        if (str.indexOf(vlpn) > -1) return true;
        else return false;
    },
    // 当天最大检测量
    async GetDayAcceptanceNum(StationCode, date) {
        const { Raw } = this.app.Dbs.hj;
        const AcceptanceDate = moment(date).format('YYYY-MM-DD');
        let IsLocal = this.getAllSystemParam('01_IsLocal');//是否检测站端系统
        let count = await Raw.Query(`select CONVERT(int,isnull(MAX(DayAcceptanceNum),0)) from AcceptanceLog
            where StationCode = :StationCode and convert(varchar(10), AcceptanceDate, 120)=:AcceptanceDate`, {
            replacements: {
                StationCode,
                AcceptanceDate
            }
        });
        if (IsLocal && count < 5000) {
            count = '4999'
        }
        let total = +count + 1;
        // 保证是4位，不够4位前面补0
        return new Array(4 - (total + '').length + 1).join('0') + total;


    },

    /// <summary>
    /// 环保业务状态改变前记录原状态到轨迹表（必须在保存车辆信息前调用）
    /// </summary>
    /// <param name="vehicleID">车辆ID</param>
    /// <param name="eStatus">当前的环保业务状态（eStatus）值</param>
    /// <param name="dataManager">访问数据的IDataManager类型对象</param>
    /// <returns></returns>
    async InsertEStatusIntoVehicleTrail(VehicleID, eStatus) {
        const { Raw } = this.app.Dbs.hj;
        const user = this.getCurrentUser();
        const vehicle = this.getVehicleInfo({ VehicleID });
        let nowDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        //查到车辆信息
        //当当前的环保业务状态不等于数据表里面的环保业务状态时做轨迹记录
        if (vehicle.length > 0 && vehicle.EStatus != eStatus) {
            //记录车辆状态修改到车辆轨迹表
            let param = {
                loginName: user['loginName'],
                ChangeTime: nowDate,
                VehicleID: VehicleID,
                VIN:vehicle.VIN,
                VLPN: vehicle.VLPN,
                EStatus: vehicle.EStatus,
            }
            await Raw.Insert('VehicleTrail', param);
            return true;
        }
        return false;
    },
    /// 根据新标准，制定受理信息保存到redies的规则
    async SetAccAndVecToRedisNew(acc, vec) {
        let CityCode = this.getCurrentUser['areaCode']
        let jsonacc = JSON.stringify(acc);
        let jsonvec = JSON.stringify(vec);
        let us = vec.UniqueString;
        let publishKey = 'ywxt/wjapp/slxx';
        //保存受理信息到redis
        let hashkey_acc = 'bd/acceptance';
        let hashfieldkey_acc = acc.InspectionNum + '_0';
        let hashfieldvalue_acc = jsonacc;
        let childRedis = Object.keys(app.config.redis.clients).filter(item => {
            if (item.indexOf('hj') > -1 && item.length > 3) {
                return item;
            }
        });
        let veckey='_vehicle_' + us;
        // 子客户端
        if (childRedis.length > 0 && childRedis.indexOf(CityCode) > -1) {
           this.app.redis.get('hj' + CityCode).hset(hashkey_acc, hashfieldkey_acc, hashfieldvalue_acc);
            //redis新增存储信息
            this.SaveDataChangeToRedis(acc.StationCode, 'HSET', hashkey_acc, hashfieldkey_acc, hashfieldvalue_acc,CityCode);
            //保存vehicle信息到redis
           this.app.redis.get('hj' + CityCode).hset(veckey, jsonvec);
            this.SaveDataChangeToRedis(acc.StationCode, 'SET', key,key, jsonvec,CityCode);
            // 发布消息到redis队列
           this.app.redis.get('hj'+CityCode).pushlish(publishKey,jsonacc)
         

        } else {
           this.app.redis.get('hj').hset(hashkey_acc, hashfieldkey_acc, hashfieldvalue_acc);
            //保存vehicle信息到redis
           this.app.redis.get('hj').hset(veckey, jsonvec);
            // 发布消息redis队列
          this.app.redis.get('hj'+CityCode).pushlish(publishKey,jsonacc)
        }

    },

    // 保存新的受理信息到redis

    async SaveDataChangeToRedis(StationCode, OP, key, fieldKey, value, CityCode) {
        let IsOpenMotorDistributed = await this.ctx.hleper.getAllSystemParam('01_IsOpenMotorDistributed');//是否开启摩托车分布式
        let sendKey = 'informationupdate';
        let sendHKey = key + '@' + fieldKey + '@' + StationCode;
        let sendJson = {
            OP: OP,
            STATIONID: StationCode,
            REDISKEY: key,
            FIELDKEY: fieldKey
        };
        if (fieldKey == '' || fieldKey == null) {
            sendHKey = key + '@' + key + '@' + StationCode;
            sendJson.FIELDKEY = key;
        }
        if (OP == 'HDEL' || OP == 'DEL') {
            sendJson.VALUE = '';
        } else {
            sendJson.VALUE = value;
        }
        let sendValue = JSON.stringify(sendJson);
        if (CityCode != null) {
            if (IsOpenMotorDistributed && key != 'bd/acceptance') {
                await this.app.redis.get('hj' + CityCode).hset('mtinformationupdate', sendKey, sendValue);//摩托车
            }
            await this.app.redis.get('hj' + CityCode).hset(sendKey, sendHKey, sendValue);
        } else {
            if (IsOpenMotorDistributed && key != 'bd/acceptance') {
                await this.app.redis.get(StationCode.substring(0, 4) + '00').hset('mtinformationupdate', sendHKey, sendValue);//摩托车
            }
            await this.app.redis.get(StationCode.substring(0, 4) + '00').hset(sendKey, sendHKey, sendValue);
        }


    }


};
