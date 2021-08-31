
/**
 * @param _this 当前this
 * @param name 字典表表名集合
 * @returns {Array}
 */

export const getCDData = (_this, list) => {
    return new Promise((resolve, reject) => {
        _this.$curl.get("api/hj/getCDData", { CDDataList: JSON.stringify(list) }).then(res => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
    });
};

export const getCDDatas = (_this, list) => {
    return new Promise((resolve, reject) => {
        _this.$curl.post("api/hj/getCDDatas", { CDDataList: list }).then(res => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
    });
};

/**
* @formatDate 时间格式化string;
*/
export function formatDates(n, format) {
    try {
        let mydate;
        if (!n) return "";
        else if (n instanceof Date)
            mydate = n;
        else
            mydate = new Date(Date.parse(n.replace("T", " ").replace(/-/g, "/").replace(/\..*/g, "").replace(/^\s+|\s+$/g, '')));
        if (isNaN(mydate)) {
            mydate = new Date(Date.parse(n));
        }
        if (format) {
            return formatDate(mydate, format);
        } else {
            return "时间格式不正确或者给定时间模板有错！"
        }

    } catch (e) {
        return n;
    }
}
function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
}
function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}


/**
* @formatDate codop 打印插件;
*/
//==本JS是加载Lodop插件及CLodop服务的综合示例，可直接使用，建议看懂后融进自己页面程序==

var CreatedOKLodopObject, CLodopIsLocal, CLodopJsState;


//==判断是否需要CLodop(那些不支持插件的浏览器):==
function needCLodop() {
    try {
        var ua = navigator.userAgent;
        if (ua.match(/Windows\sPhone/i))
            return true;
        if (ua.match(/iPhone|iPod|iPad/i))
            return true;
        if (ua.match(/Android/i))
            return true;
        if (ua.match(/Edge\D?\d+/i))
            return true;

        var verTrident = ua.match(/Trident\D?\d+/i);
        var verIE = ua.match(/MSIE\D?\d+/i);
        var verOPR = ua.match(/OPR\D?\d+/i);
        var verFF = ua.match(/Firefox\D?\d+/i);
        var x64 = ua.match(/x64/i);
        if ((!verTrident) && (!verIE) && (x64))
            return true;
        else if (verFF) {
            verFF = verFF[0].match(/\d+/);
            if ((verFF[0] >= 41) || (x64))
                return true;
        } else if (verOPR) {
            verOPR = verOPR[0].match(/\d+/);
            if (verOPR[0] >= 32)
                return true;
        } else if ((!verTrident) && (!verIE)) {
            var verChrome = ua.match(/Chrome\D?\d+/i);
            if (verChrome) {
                verChrome = verChrome[0].match(/\d+/);
                if (verChrome[0] >= 41)
                    return true;
            }
        }
        return false;
    } catch (err) {
        return true;
    }
}

//==引用CLodop的主JS,用双端口8000和18000(以防其中一个被占):==
if (needCLodop()) {
    var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;

    var JS1 = document.createElement("script");
    JS1.src = "http://localhost:8000/CLodopfuncs.js?priority=1";
    head.insertBefore(JS1, head.firstChild);

    var JS2 = document.createElement("script");
    JS2.src = "http://localhost:18000/CLodopfuncs.js?priority=0";
    head.insertBefore(JS2, head.firstChild);

    CLodopIsLocal = !!((JS1.src + JS2.src).match(/\/\/localho|\/\/127.0.0./i));

    if (JS1.attachEvent) {
        CLodopJsState = "loading";
        var onChange = function () {
            if (window.event.srcElement.readyState == 'loaded')
                CLodopJsState = "complete";
        };
        JS1.attachEvent('onreadystatechange', onChange);
        JS2.attachEvent('onreadystatechange', onChange);
    }
}

//==获取LODOP对象主过程,判断是否安装、需否升级:==
export function getLodop(oOBJECT, oEMBED) {
    var strHtmInstall = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop32.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
    var strHtmUpdate = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop32.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
    var strHtm64_Install = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop64.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
    var strHtm64_Update = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop64.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
    var strHtmFireFox = "<br><br><font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>";
    var strHtmChrome = "<br><br><font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>";
    // var strCLodopInstall_1 = "<br><font color='#FF00FF'>Web打印服务CLodop未安装启动，点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>下载执行安装</a>";
    // var strCLodopInstall_2 = "<br>（若此前已安装过，可<a href='CLodop.protocol:setup' target='_self'>点这里直接再次启动</a>）";
    // var strCLodopInstall_3 = "，成功后请刷新本页面。</font>";
    // var strCLodopUpdate = "<br><font color='#FF00FF'>Web打印服务CLodop需升级!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行升级</a>,升级后请刷新页面。</font>";
    var LODOP;
    try {
        var ua = navigator.userAgent;
        var isIE = !!(ua.match(/MSIE/i)) || !!(ua.match(/Trident/i));
        if (needCLodop()) {
            try {
                LODOP = getCLodop();
            } catch (err) { }
            if (!LODOP && (document.readyState !== "complete" || (isIE && CLodopJsState == "loading"))) {
                alert("网页还没下载完毕，请稍等一下再操作.");
                return;
            }
            if (!LODOP) {
                // document.body.innerHTML = strCLodopInstall_1 + (CLodopIsLocal ? strCLodopInstall_2 : "") + strCLodopInstall_3 + document.body.innerHTML;                
                return;
            } else {
                if (CLODOP.CVERSION < "3.0.9.3") {
                    // document.body.innerHTML = strCLodopUpdate + document.body.innerHTML;
                }
                if (oEMBED && oEMBED.parentNode)
                    oEMBED.parentNode.removeChild(oEMBED);
                if (oOBJECT && oOBJECT.parentNode)
                    oOBJECT.parentNode.removeChild(oOBJECT);
            }
        } else {
            var is64IE = isIE && !!(ua.match(/x64/i));
            //==如果页面有Lodop就直接使用,否则新建:==
            if (oOBJECT || oEMBED) {
                if (isIE)
                    LODOP = oOBJECT;
                else
                    LODOP = oEMBED;
            } else if (!CreatedOKLodopObject) {
                LODOP = document.createElement("object");
                LODOP.setAttribute("width", 0);
                LODOP.setAttribute("height", 0);
                LODOP.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
                if (isIE)
                    LODOP.setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
                else
                    LODOP.setAttribute("type", "application/x-print-lodop");
                document.documentElement.appendChild(LODOP);
                CreatedOKLodopObject = LODOP;
            } else
                LODOP = CreatedOKLodopObject;
            //==Lodop插件未安装时提示下载地址:==
            if ((!LODOP) || (!LODOP.VERSION)) {
                if (ua.indexOf('Chrome') >= 0)
                    // document.body.innerHTML = strHtmChrome + document.body.innerHTML;
                    alert(strHtmChrome)
                if (ua.indexOf('Firefox') >= 0)
                    // document.body.innerHTML = strHtmFireFox + document.body.innerHTML;
                    alert(strHtmFireFox)
                alert(is64IE ? strHtm64_Install : strHtmInstall)
                // document.body.innerHTML = (is64IE ? strHtm64_Install : strHtmInstall) + document.body.innerHTML;
                return LODOP;
            }
        }
        if (LODOP.VERSION < "6.2.2.6") {
            if (!needCLodop())
                // document.body.innerHTML = (is64IE ? strHtm64_Update : strHtmUpdate) + document.body.innerHTML;
                alert(is64IE ? strHtm64_Update : strHtmUpdate)
        }
        //===如下空白位置适合调用统一功能(如注册语句、语言选择等):==



        //=======================================================
        return LODOP;
    } catch (err) {
        alert("getLodop出错:" + err);
    }
}

// 导出多级表格
export const export_Excel = (table, name) => {
    let tableHtml;
    if (table.$refs) {
        let header = table.$refs.header.querySelector('table').innerHTML;
        let body = table.$refs.body.querySelector('tbody').outerHTML;
        tableHtml = header + body;
    } else {
        tableHtml = table.innerHTML;
    }
    let uri = 'data:application/vnd.ms-excel;base64,',
        template = `<html>
            <head><meta charset="UTF-8"></head>
            <body><table border="1">${tableHtml}</table></body>
        </html>`;

    let a = document.createElement('a');
    a.href = uri + window.btoa(unescape(encodeURIComponent(template)));
    a.download = name;
    a.click();
};


// 存储操作日志
export const addOperaLog = (_this, params) => {
    if (params) {
        _this.$curl.post('api/hj/dataChangeLog', { params })
            .then(res => {
                console.log(res)
            })
            .catch(error => {
                console.log(error)
            })
    }
}

// 获取数值是否为小数，为小数时保留多少位, value为传入的值， num为保留的位数，只有value的小数位大于num才会保留num位,type 默认为true，四舍五入，为false不四舍五入
export function saveNumber(value, num, type = true) {  // 不是纯数字字符返回NAN
    let x = String(value).indexOf('.') + 1;   //小数点的位置
    let y = String(value).length - x;  //小数的位数
    if (y >= num) {
        if (type)
            return Number(Number(value).toFixed(num));
        else
            return Math.floor(Number(value) * 10 ** num) / 10 ** num;
    } else {
        return Number(value);
    }


}
// 对象数组排序
export function ArraySort(key, ASCValue) {
    if (ASCValue) {
        return function (obj1, obj2) {
            let a = obj1[key] - 0
            let b = obj2[key] - 0
            if (a > b) {
                return 1
            } else if (a < b) {
                return -1
            } else {
                return 0
            }
        }
    } else {
        return function (obj1, obj2) {
            let a = obj1[key] - 0
            let b = obj2[key] - 0
            if (a > b) {
                return -1
            } else if (a < b) {
                return 1
            } else {
                return 0
            }
        }
    }

}

// /* 封装函数 */
/* 字段名以字符串的形式传入 */
export function treeData(source, id, parentId, children) {
    let cloneData = JSON.parse(JSON.stringify(source))
    return cloneData.filter(father => {
        let branchArr = cloneData.filter(child => father[id] == child[parentId]);
        branchArr.length > 0 ? father[children] = branchArr : ''
        return father[parentId] == "000000"        // 如果第一层不是parentId=0，请自行修改
    })
}

// 检测站信息修改审核各模块调用消息提示方法
export const setRemindAndInsertAudit = (_this, remindData, parmaData, OperationType) => {
    let url = 'api/hj/pushChangeStationInfo'
    let { oldItem, params } = parmaData
    let paramInfo = {
        StationCode: params.StationCode,
        CityCode: params.StationCode.slice(0, 4) + '00',
        CountryCode: params.StationCode.slice(0, 6),
        ChangeContent: {
            oldValue: oldItem,
            newValue: params
        },
        AuditType: remindData.msgTypeCode,
        OperationType: OperationType,
        AuditState: 0,
        AuditResult: null,
        SubmitTime: new Date,
        Proposer: _this.$store.state.core.user.username,
        Auditor: null,
        AuditTime: null,
        Remark: null
    }
    let changeList = [] //用于保存不为空的数据
    if (OperationType == '02') {
        for (let i in oldItem) {
            for (let j in params.datalist) {
                if (i == j) {
                    if (JSON.stringify(oldItem[i]) != JSON.stringify(params.datalist[j])) {
                        let oldData = oldItem[i] ? oldItem[i] : '无'
                        changeList.push({ field: j, oldValue: oldData, newValue: params.datalist[j] })
                    }
                }
            }
        }
    }
    paramInfo.ChangeContent.changeInfo = changeList // 加入到ChangeContent对象中
    console.log('实体', paramInfo.ChangeContent)
    _this.$curl.post(url, { remindData, paramInfo: JSON.stringify(paramInfo) }).then(res => {
        _this.$Notice.success({ title: "提示", desc: "已提交保存，等待审核!" })
    }).catch(error => console.log(error))
}
// 站点管理获取是否打开审核配置
export const getStationConfig = async (_this) => {
    let isOpen = false
    let url = 'api/hj/getStationConfig'
    await _this.$curl.get(url).then(res => {
        if (res.isOpen == 'false') isOpen = false
        else isOpen = true
    }).catch(error => console.log(error))
    return isOpen
}
// 根据对应的字段返回相应的中文名称
export const returnChineseName = (datalist, feildList) => {
    datalist.forEach(item1 => {
        feildList.forEach(item2 => {
            if (item1.field == item2.field) {
                item1.field = item2.label
            }
        })
    })
    return datalist
}

// 计算某字段的和
export const CountCol = (val, col) => {
    let temp = 0;
    val.forEach(v => {
        temp += Number(v[col]);
    });
    return temp;
}
//计算城市同比环比
export const retuenTbHb = (lastyear, proviyear, provimonth, key, tglType) => {
    let resultArr1 = [], resultArr2 = [], resultArr3 = [];
    //通过率
    if (tglType == 'tgl') {
        lastyear.forEach(itemly => {
            // 环比
            let hb_index = provimonth.findIndex(itempm => itemly[key] == itempm[key]);
            if (hb_index !== -1) {
                let itempm = provimonth[hb_index];
                let provmonthTGSums = itempm["nlm_cj_tgNums"] + itempm["nlm_fj_tgNums"] + itempm["nlm_dj_tgNums"]
                let lastmonthTGSums = itemly["n_cj_tgNums"] + itemly["n_fj_tgNums"] + itemly["n_dj_tgNums"]
                let provmonthSums = itempm["nlm_cjTotals"] + itempm["nlm_fjTotals"] + itempm["nlm_djTotals"]
                let lastmonthSums = itemly["n_cjTotals"] + itemly["n_fjTotals"] + itemly["n_djTotals"]
                let tgl = lastmonthSums ? ((lastmonthTGSums / lastmonthSums) * 100).toFixed(2) : '0.00'
                // let tglhb = provmonthSums && lastmonthSums ? (((lastmonthTGSums  / lastmonthSums) - (provmonthTGSums / provmonthSums)) * 100).toFixed(2) : '0.00';
                let tglhb = provmonthSums ? (((lastmonthTGSums - provmonthTGSums) / provmonthSums) * 100).toFixed(2) : '0.00';
                let obj = {}
                obj[key] = itempm[key]
                obj["tglhb"] = tglhb
                obj["tgl"] = tgl
                obj["cls"] = itemly["n_cjTotals"]
                resultArr1.push(obj)
            } else {
                let lastmonthTGSums = itemly["n_cj_tgNums"] + itemly["n_fj_tgNums"] + itemly["n_dj_tgNums"];
                let lastmonthSums = itemly["n_cjTotals"] + itemly["n_fjTotals"] + itemly["n_djTotals"];
                let tgl = lastmonthSums ? ((lastmonthTGSums / lastmonthSums) * 100).toFixed(2) : '0.00'
                let obj = {
                    tglhb: '--',
                    tgl: tgl,
                    cls: itemly["n_cjTotals"]
                };
                obj[key] = itemly[key];
                resultArr1.push(obj)
            }
            // 同比
            let tb_index = proviyear.findIndex(itempy => itemly[key] == itempy[key]);
            if (tb_index !== -1) {
                let itempy = proviyear[tb_index];
                let provyearTGSums = itempy["o_cj_tgNums"] + itempy["o_fj_tgNums"] + itempy["o_dj_tgNums"]
                let lastyearTGSums = itemly["n_cj_tgNums"] + itemly["n_fj_tgNums"] + itemly["n_dj_tgNums"]
                let provyearSums = itempy["o_cjTotals"] + itempy["o_fjTotals"] + itempy["o_djTotals"]
                let lastyearSums = itemly["n_cjTotals"] + itemly["n_fjTotals"] + itemly["n_djTotals"]
                // let tgltb = provyearSums && lastyearSums ? (((lastyearTGSums  / lastyearSums) - (provyearTGSums / provyearSums)) * 100).toFixed(2) : '0.00';
                let tgltb = provyearSums ? (((lastyearTGSums - provyearTGSums) / provyearSums) * 100).toFixed(2) : '0.00';
                resultArr1.forEach(itemRA => {
                    if (itempy[key] == itemRA[key]) {
                        itemRA.tgltb = tgltb
                    }
                })
            } else {
                resultArr1.forEach(itemRA => {
                    if (itemly[key] == itemRA[key]) {
                        itemRA.tgltb = '--'
                    }
                })
            }
        })
        return resultArr1
    }
    // 初检通过率
    if (tglType == 'cjtgl') {
        lastyear.forEach(itemly => {
            // 环比
            let hb_index = provimonth.findIndex(itempm => itemly[key] == itempm[key]);
            if (hb_index !== -1) {
                let itempm = provimonth[hb_index];
                let provmonthTGSums = itempm["nlm_cj_tgNums"]
                let lastmonthTGSums = itemly["n_cj_tgNums"]
                let provmonthSums = itempm["nlm_cjTotals"]
                let lastmonthSums = itemly["n_cjTotals"]
                let cjtgl = lastmonthSums ? ((lastmonthTGSums / lastmonthSums) * 100).toFixed(2) : '0.00'
                // let cjtglhb = provmonthSums && lastmonthSums? (((lastmonthTGSums / lastmonthSums)-(provmonthTGSums / provmonthSums)) * 100).toFixed(2) : '0.00'
                let cjtglhb = provmonthSums ? (((lastmonthTGSums - provmonthTGSums) / provmonthSums) * 100).toFixed(2) : '0.00'
                let obj = {}
                obj[key] = itemly[key]
                obj["cjtglhb"] = cjtglhb
                obj["cjtgl"] = cjtgl
                obj["cls"] = itemly["n_cjTotals"]
                resultArr2.push(obj)
            } else {
                let lastmonthTGSums = itemly["n_cj_tgNums"];
                let lastmonthSums = itemly["n_cjTotals"];
                let cjtgl = lastmonthSums ? ((lastmonthTGSums / lastmonthSums) * 100).toFixed(2) : '0.00';
                let obj = {}
                obj[key] = itemly[key]
                obj["cjtglhb"] = '--'
                obj["cjtgl"] = cjtgl
                obj["cls"] = itemly["n_cjTotals"]
                resultArr2.push(obj)
            }
            // 同比

            let tb_index = proviyear.findIndex(itempy => itemly[key] == itempy[key]);
            if (tb_index !== -1) {
                let itempy = proviyear[tb_index];
                let provyearTGSums = itempy["o_cj_tgNums"]
                let lastyearTGSums = itemly["n_cj_tgNums"]
                let provyearSums = itempy["o_cjTotals"]
                let lastyearSums = itempy["n_cjTotals"]
                // let cjtgltb = provyearSums && lastyearSums? (((lastyearTGSums / lastyearSums) - (provyearTGSums / provyearSums)) * 100).toFixed(2) : '0.00'
                let cjtgltb = provyearSums ? (((lastyearTGSums - provyearTGSums) / provyearSums) * 100).toFixed(2) : '0.00'

                resultArr2.forEach(itemRA => {
                    if (itempy[key] == itemRA[key]) {
                        itemRA.cjtgltb = cjtgltb
                    }
                })
            } else {
                resultArr2.forEach(itemRA => {
                    if (itemly[key] == itemRA[key]) {
                        itemRA.cjtgltb = '--'
                    }
                })
            }

        })
        return resultArr2
    }
    // 复检通过率
    if (tglType == 'fjtgl') {
        lastyear.forEach(itemly => {
            // 环比
            let hb_index = provimonth.findIndex(itempm => itemly[key] == itempm[key]);
            if (hb_index !== -1) {
                let itempm = provimonth[hb_index];
                let provmonthTGSums = itempm["nlm_fj_tgNums"]
                let lastmonthTGSums = itemly["n_fj_tgNums"]
                let provmonthSums = itempm["nlm_fjTotals"]
                let lastmonthSums = itemly["n_fjTotals"]
                let fjtgl = lastmonthSums ? ((lastmonthTGSums / lastmonthSums) * 100).toFixed(2) : '0.00'
                // let fjtglhb = provmonthSums && lastmonthSums? (((lastmonthTGSums / lastmonthSums)-(provmonthTGSums / provmonthSums)) * 100).toFixed(2) : '0.00'
                let fjtglhb = provmonthSums ? (((lastmonthTGSums - provmonthTGSums) / provmonthSums) * 100).toFixed(2) : '0.00'
                let obj = {}
                obj[key] = itemly[key]
                obj["fjtglhb"] = fjtglhb
                obj["fjtgl"] = fjtgl
                obj["cls"] = itemly["n_fjTotals"]
                resultArr3.push(obj)
            } else {
                let lastmonthTGSums = itemly["n_fj_tgNums"];
                let lastmonthSums = itemly["n_fjTotals"];
                let fjtgl = lastmonthSums ? ((lastmonthTGSums / lastmonthSums) * 100).toFixed(2) : '0.00';
                let obj = {}
                obj[key] = itemly[key]
                obj["fjtglhb"] = '--'
                obj["fjtgl"] = fjtgl
                obj["cls"] = itemly["n_fjTotals"]
                resultArr3.push(obj)
            }
            // 同比
            let tb_index = proviyear.findIndex(itempy => itemly[key] == itempy[key]);
            if (tb_index !== -1) {
                let itempy = proviyear[tb_index];
                let provyearTGSums = itempy["o_fj_tgNums"]
                let lastyearTGSums = itemly["n_fj_tgNums"]
                let provyearSums = itempy["o_fjTotals"]
                let lastyearSums = itempy["n_fjTotals"]
                let fjtgltb = provyearSums ? (((lastyearTGSums - provyearTGSums) / provyearSums) * 100).toFixed(2) : '0.00'
                // let fjtgltb = provyearSums && lastyearSums? (((lastyearTGSums / lastyearSums) - (provyearTGSums / provyearSums)) * 100).toFixed(2) : '0.00'
                resultArr3.forEach(itemRA => {
                    if (itempy[key] == itemRA[key]) {
                        itemRA.fjtgltb = fjtgltb
                    }
                })
            } else {
                resultArr3.forEach(itemRA => {
                    if (itemly[key] == itemRA[key]) {
                        itemRA.fjtgltb = '--'
                    }
                })
            }

        })
        return resultArr3
    }
    // 多检通过率
    if (tglType == 'djtgl') {
        lastyear.forEach(itemly => {
            // 环比
            let hb_index = provimonth.findIndex(itempm => itemly[key] == itempm[key]);
            if (hb_index !== -1) {
                let itempm = provimonth[hb_index];
                let provmonthTGSums = itempm["nlm_dj_tgNums"]
                let lastmonthTGSums = itemly["n_dj_tgNums"]
                let provmonthSums = itempm["nlm_djTotals"]
                let lastmonthSums = itemly["n_djTotals"]
                let djtgl = lastmonthSums ? ((lastmonthTGSums / lastmonthSums) * 100).toFixed(2) : '0.00'
                let djtglhb = provmonthSums ? (((lastmonthTGSums - provmonthTGSums) / provmonthSums) * 100).toFixed(2) : '0.00'
                // let djtglhb = provmonthSums && lastmonthSums? (((lastmonthTGSums / lastmonthSums)-(provmonthTGSums / provmonthSums)) * 100).toFixed(2) : '0.00'

                let obj = {}
                obj[key] = itemly[key]
                obj["djtglhb"] = djtglhb
                obj["djtgl"] = djtgl
                obj["cls"] = itemly["n_djTotals"]
                resultArr3.push(obj)
            } else {
                let lastmonthTGSums = itemly["n_dj_tgNums"]
                let lastmonthSums = itemly["n_djTotals"]
                let djtgl = lastmonthSums ? ((lastmonthTGSums / lastmonthSums) * 100).toFixed(2) : '0.00'
                let obj = {}
                obj[key] = itemly[key]
                obj["djtglhb"] = '--'
                obj["djtgl"] = djtgl
                obj["cls"] = itemly["n_djTotals"]
                resultArr3.push(obj)
            }
            // 同比
            let tb_index = proviyear.findIndex(itempy => itemly[key] == itempy[key]);
            if (tb_index !== -1) {
                let itempy = proviyear[tb_index];
                let provyearTGSums = itempy["o_dj_tgNums"]
                let lastyearTGSums = itemly["n_dj_tgNums"]
                let provyearSums = itempy["o_djTotals"]
                let lastyearSums = itempy["n_djTotals"]
                let djtgltb = provyearSums ? (((lastyearTGSums - provyearTGSums) / provyearSums) * 100).toFixed(2) : '0.00'
                // let djtgltb = provyearSums && lastyearSums? (((lastyearTGSums / lastyearSums) - (provyearTGSums / provyearSums)) * 100).toFixed(2) : '0.00'

                resultArr3.forEach(itemRA => {
                    if (itempy[key] == itemRA[key]) {
                        itemRA.djtgltb = djtgltb
                    }
                })
            } else {
                resultArr3.forEach(itemRA => {
                    if (itemly[key] == itemRA[key]) {
                        itemRA.djtgltb = '--'
                    }
                })
            }

        })
        return resultArr3
    }
}
// 计算点位同比环比
export const retuenStattionTbHb = (lastyear, proviyear, provimonth, key, tglType) => {
    let resultArr1 = [], resultArr2 = [], resultArr3 = [];
    //通过率
    if (tglType == 'tgl') {
        lastyear.forEach(itemly => {
            // 环比
            provimonth.forEach(itempm => {
                if (itemly[key] == itempm[key]) {
                    let provmonthTGSums = itempm["nlm_cj_tgNums"] + itempm["nlm_fj_tgNums"] + itempm["nlm_dj_tgNums"]
                    let lastmonthTGSums = itemly["n_cj_tgNums"] + itemly["n_fj_tgNums"] + itemly["n_dj_tgNums"]
                    let provmonthSums = itempm["nlm_cjTotals"] + itempm["nlm_fjTotals"] + itempm["nlm_djTotals"]
                    let lastmonthSums = itemly["n_cjTotals"] + itemly["n_fjTotals"] + itemly["n_djTotals"]
                    let tgl = lastmonthSums ? ((lastmonthTGSums / lastmonthSums) * 100).toFixed(2) : '0.00'
                    // let tglhb = provmonthSums && lastmonthSums ? ((( lastmonthTGSums / lastmonthSums) - ( provmonthTGSums / provmonthSums)) * 100).toFixed(2) : '0.00'
                    let tglhb = provmonthSums ? (((lastmonthTGSums - provmonthTGSums) / provmonthSums) * 100).toFixed(2) : '0.00'
                    let obj = {}
                    obj[key] = itempm[key]
                    obj["tglhb"] = tglhb
                    obj["tgl"] = tgl
                    obj["cls"] = itemly["n_cjTotals"]
                    resultArr1.push(obj)
                }
            })
            // 同比
            if (proviyear.length) {
                proviyear.forEach(itempy => {
                    if (itemly[key] == itempy[key]) {
                        let provyearTGSums = itempy["o_cj_tgNums"] + itempy["o_fj_tgNums"] + itempy["o_dj_tgNums"]
                        let lastyearTGSums = itemly["n_cj_tgNums"] + itemly["n_fj_tgNums"] + itemly["n_dj_tgNums"]
                        let provyearSums = itempy["o_cjTotals"] + itempy["o_fjTotals"] + itempy["o_djTotals"]
                        let lastyearSums = itempy["n_cjTotals"] + itempy["n_fjTotals"] + itempy["n_djTotals"]
                        // let tgltb = provyearSums && lastyearSums? (((lastyearTGSums/ lastyearSums) - (provyearTGSums/ provyearSums))  * 100).toFixed(2) : '0.00'
                        let tgltb = provyearSums ? (((lastyearTGSums - provyearTGSums) / provyearSums) * 100).toFixed(2) : '0.00'
                        resultArr1.forEach(itemRA => {
                            if (itempy[key] == itemRA[key]) {
                                itemRA.tgltb = tgltb
                            }
                        })

                    }
                })
            } else {
                resultArr1.forEach(itemRA => {
                    itemRA.tgltb = '--'
                })
            }

        })
        return resultArr1
    }
    // 初检通过率
    if (tglType == 'cjtgl') {
        lastyear.forEach(itemly => {
            // 环比
            provimonth.forEach(itempm => {
                if (itemly[key] == itempm[key]) {
                    let provmonthTGSums = itempm["nlm_cj_tgNums"]
                    let lastmonthTGSums = itemly["n_cj_tgNums"]
                    let provmonthSums = itempm["nlm_cjTotals"]
                    let lastmonthSums = itemly["n_cjTotals"]
                    let cjtgl = lastmonthSums ? ((lastmonthTGSums / lastmonthSums) * 100).toFixed(2) : '0.00'
                    // let cjtglhb = provmonthSums && lastmonthSums ? ((( lastmonthTGSums / lastmonthSums) - ( provmonthTGSums / provmonthSums)) * 100).toFixed(2) : '0.00'
                    let cjtglhb = provmonthSums ? (((lastmonthTGSums - provmonthTGSums) / provmonthSums) * 100).toFixed(2) : '0.00'
                    let obj = {}
                    obj[key] = itemly[key]
                    obj["cjtglhb"] = cjtglhb
                    obj["cjtgl"] = cjtgl
                    obj["cls"] = itempm["n_cjTotals"]
                    resultArr2.push(obj)
                }
            })
            // 同比
            if (proviyear.length) {
                proviyear.forEach(itempy => {
                    if (itemly[key] == itempy[key]) {
                        let provyearTGSums = itempy["o_cj_tgNums"]
                        let lastyearTGSums = itemly["n_cj_tgNums"]
                        let provyearSums = itempy["o_cjTotals"]
                        let lastyearSums = itempy["n_cjTotals"]
                        // let cjtgltb = provyearSums && lastyearSums? (((lastyearTGSums/ lastyearSums) - (provyearTGSums/ provyearSums))  * 100).toFixed(2) : '0.00'
                        let cjtgltb = provyearSums ? (((lastyearTGSums - provyearTGSums) / provyearSums) * 100).toFixed(2) : '0.00'
                        resultArr2.forEach(itemRA => {
                            if (itempy[key] == itemRA[key]) {
                                itemRA.cjtgltb = cjtgltb
                            }
                        })

                    }
                })
            } else {
                resultArr2.forEach(item => {
                    item.cjtgltb = '--'
                })
            }

        })
        return resultArr2
    }
    // 复检通过率
    if (tglType == 'fjtgl') {
        lastyear.forEach(itemly => {
            // 环比
            provimonth.forEach(itempm => {
                if (itemly[key] == itempm[key]) {
                    let provmonthTGSums = itempm["nlm_fj_tgNums"]
                    let lastmonthTGSums = itemly["n_fj_tgNums"]
                    let provmonthSums = itempm["nlm_fjTotals"]
                    let lastmonthSums = itemly["n_fjTotals"]
                    let fjtgl = lastmonthSums ? ((lastmonthTGSums / lastmonthSums) * 100).toFixed(2) : '0.00'
                    // let fjtglhb = provmonthSums && lastmonthSums ? ((( lastmonthTGSums / lastmonthSums) - ( provmonthTGSums / provmonthSums)) * 100).toFixed(2) : '0.00'
                    let fjtglhb = provmonthSums ? (((lastmonthTGSums - provmonthTGSums) / provmonthSums) * 100).toFixed(2) : '0.00'
                    let obj = {}
                    obj[key] = itemly[key]
                    obj["fjtglhb"] = fjtglhb
                    obj["fjtgl"] = fjtgl
                    obj["cls"] = itemly["n_fjTotals"]
                    resultArr3.push(obj)
                }
            })
            // 同比
            if (proviyear.length) {
                proviyear.forEach(itempy => {
                    if (itemly[key] == itempy[key]) {
                        let provmonthTGSums = itempy["o_fj_tgNums"]
                        let lastmonthTGSums = itemly["n_fj_tgNums"]
                        let provmonthSums = itempy["o_fjTotals"]
                        let lastmonthSums = itempy["n_fjTotals"]
                        // let fjtgltb = provmonthSums && lastmonthSums ? ((( lastmonthTGSums / lastmonthSums) - ( provmonthTGSums / provmonthSums)) * 100).toFixed(2) : '0.00'
                        let fjtgltb = provyearSums ? (((lastyearTGSums - provyearTGSums) / provyearSums) * 100).toFixed(2) : '0.00'
                        resultArr3.forEach(itemRA => {
                            if (itempy[key] == itemRA[key]) {
                                itemRA.fjtgltb = fjtgltb
                            }
                        })
                    }
                })
            } else {
                resultArr3.forEach(itemRA => {
                    itemRA.fjtgltb = '--'
                })
            }

        })
        return resultArr3
    }

    // 多检通过率
    if (tglType == 'djtgl') {
        lastyear.forEach(itemly => {
            // 环比
            provimonth.forEach(itempm => {
                if (itemly[key] == itempm[key]) {
                    let provmonthTGSums = itempm["nlm_fj_tgNums"]
                    let lastmonthTGSums = itemly["n_fj_tgNums"]
                    let provmonthSums = itempm["nlm_fjTotals"]
                    let lastmonthSums = itemly["n_fjTotals"]
                    let djtgl = lastmonthSums ? ((lastmonthTGSums / lastmonthSums) * 100).toFixed(2) : '0.00'
                    // let djtglhb = provmonthSums && lastmonthSums ? ((( lastmonthTGSums / lastmonthSums) - ( provmonthTGSums / provmonthSums)) * 100).toFixed(2) : '0.00'
                    let djtglhb = provmonthSums ? (((lastmonthTGSums - provmonthTGSums) / provmonthSums) * 100).toFixed(2) : '0.00'
                    let obj = {}
                    obj[key] = itemly[key]
                    obj["djtglhb"] = djtglhb
                    obj["djtgl"] = djtgl
                    obj["cls"] = itemly["n_fjTotals"]
                    resultArr3.push(obj)
                }
            })
            // 同比
            if (proviyear.length) {
                proviyear.forEach(itempy => {
                    if (itemly[key] == itempy[key]) {
                        let provyearTGSums = itempy["o_fj_tgNums"]
                        let lastyearTGSums = itemly["n_fj_tgNums"]
                        let provyearSums = itempy["o_fjTotals"]
                        let lastyearSums = itempy["n_fjTotals"]
                        // let djtgltb = provyearSums && lastyearSums? (((lastyearTGSums/ lastyearSums) - (provyearTGSums/ provyearSums))  * 100).toFixed(2) : '0.00'
                        let djtgltb = provyearSums ? (((lastyearTGSums - provyearTGSums) / provyearSums) * 100).toFixed(2) : '0.00'
                        resultArr3.forEach(itemRA => {
                            if (itempy[key] == itemRA[key]) {
                                itemRA.djtgltb = djtgltb
                            }
                        })
                    }
                })
            } else {
                resultArr3.forEach(itemRA => {
                    itemRA.djtgltb = '--'
                })
            }

        })
        return resultArr3
    }
}

//路检图片前缀
export const LJMedia = "/LJMedia/documents/";

// 黑烟车审核结果
export const HYCAuditResult = (AuditType) => {
    const resultObj = {
      "10": "未审核",
      "11": "已审核为黑烟车",
      "12": "已审核为非黑烟车",
      "13": "已存档",
      "20": "未审核",
      "21": "已初审为黑烟车",
      "22": "已初审为非黑烟车",
      "23": "已终审为黑烟车",
      "24": "已终审为非黑烟车",
      "25": "已存档",
      "30": "未审核",
      "31": "已初审为黑烟车",
      "32": "已初审为非黑烟车",
      "33": "已复审为黑烟车",
      "34": "已复审为非黑烟车",
      "35": "已终审为黑烟车",
      "36": "已终审为非黑烟车",
      "37": "已存档",
    };
    return resultObj[AuditType] ? resultObj[AuditType] : "未审核";
  };

  /**
 *  黑烟车审核状态码转换'
 */
export const getHYCHisDSStatus = (value) => {
    const oneAudit = {
      "11": "审核",
      "12": "审核",
      "13": "审核",
      "21": "初审",
      "22": "初审",
      "23": "终审",
      "24": "终审",
      "25": "终审",
      "31": "初审",
      "32": "初审",
      "33": "复审",
      "34": "复审",
      "35": "终审",
      "36": "终审",
      "37": "终审",
    };
    return oneAudit[value] || "未审核";
  };