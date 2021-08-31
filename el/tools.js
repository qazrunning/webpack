import app from "@skyland/core";

export const forEach = (arr, fn) => {
  if (!arr.length || !fn) return;
  let i = -1;
  let len = arr.length;
  while (++i < len) {
    let item = arr[i];
    fn(item, i, arr);
  }
};

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1, arr2) => {
  return Array.from(new Set([...arr1, ...arr2]));
};

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 深拷贝
 */
export const objDeepCopy = (source) => {
  //数组对象深拷贝
  let sourceCopy = source instanceof Array ? [] : {};
  for (let item in source) {
    sourceCopy[item] =
      typeof source[item] === "object" && source[item] != null
        ? objDeepCopy(source[item])
        : source[item];
  }
  return sourceCopy;
};

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1, obj2) => {
  const keysArr1 = Object.keys(obj1);
  const keysArr2 = Object.keys(obj2);
  if (keysArr1.length !== keysArr2.length) return false;
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true;
  /* eslint-disable-next-line */ else
    return !keysArr1.some((key) => obj1[key] != obj2[key]);
};

/**
 * 绑定事件 on(element, event, handler)
 */
export const on = (function() {
  if (document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent("on" + event, handler);
      }
    };
  }
})();

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function() {
  if (document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent("on" + event, handler);
      }
    };
  }
})();

/**
 * @description 防抖函数 debounce(method, delay)
 * @param method 事件触发的操作
 * @param delay 多少毫秒内连续触发时间，不会执行
 * @returns {Function}
 */
export const debounce = (method, delay) => {
  let timer = null;
  return function() {
    let self = this,
      args = arguments;
    timer && clearTimeout(timer);
    timer = setTimeout(function() {
      method.apply(self, args);
    }, delay);
  };
};

//获取屏幕宽度,以及获取设备类型
export const screen = {
  isPC: (function() {
    var userAgentInfo = navigator.userAgent;
    var Agents = [
      "Android",
      "iPhone",
      "SymbianOS",
      "Windows Phone",
      "iPad",
      "iPod",
    ];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
  })(),
  winWidth: (window.screenWidth = document.body.clientWidth),
  winHeight: (window.screenHeight = document.body.clientHeight),
};

/**
 * @param value 值
 * @param fmt 日期格式
 * @param type 0为默认形式,1为日历模式,不写则使用默认形式
 */
//js中使用  this.$options.filters.dataFormat(new Date(),"yyyy-MM-dd hh:mm:ss",1);
//vue中使用 '2019-01-01' | dataFormat("yyyy-MM-dd hh:mm:ss",1);
export const dataFormat = (value, fmt, type) => {
  if (type) return ifDate(value, fmt);
  else return timeTo(value, fmt);

  //判断当前返回的是星期几
  function week(dayNum) {
    if (dayNum == 7) return "日";
    else if (dayNum == 1) return "一";
    else if (dayNum == 2) return "二";
    else if (dayNum == 3) return "三";
    else if (dayNum == 4) return "四";
    else if (dayNum == 5) return "五";
    else if (dayNum == 6) return "六";
  }

  function timeTo(value, fmt) {
    if (!value || value == "") return value;
    if (typeof value == "string" && value.indexOf(".") > -1)
      value = value.split(".")[0]; //时间格式带小数点则需把小数点后面的尾数去掉
    let getDate = new Date(value);
    let o = {
      "M+": getDate.getMonth() + 1,
      "d+": getDate.getDate(),
      "h+": getDate.getHours(),
      "m+": getDate.getMinutes(),
      // "s+": getDate.getSeconds(),
      "q+": Math.floor((getDate.getMonth() + 3) / 3),
      // S: getDate.getMilliseconds(),
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (getDate.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    for (let k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
      }
    }
    return fmt;
  }

  function ifDate(value, fmt) {
    if (!value || value == "") return value;
    let date = new Date(new Date().toLocaleDateString()).getTime(); //获取当前时间时间戳
    let perDate = new Date(new Date(value).toLocaleDateString()).getTime();
    let day = parseInt((date - perDate) / 86400 / 1000); //获取相差的天数，可以为负数
    let nowday = new Date(date).getDay(); //获取当前时间是星期几，0-6
    if (nowday == 0) {
      //如果为0的话，把周日赋值为7   1-7分别对应周一到周日
      nowday = 7;
    }
    const hour = timeTo(value, "hh");
    let hourText = "";
    if (hour < 12) hourText = " 上午";
    else hourText = " 下午";
    let timeText = hourText + timeTo(value, "hh:mm");

    if (day == 0) return "今天 " + timeText;
    //今天
    else if (day == 1) return "昨天" + timeText;
    //昨天
    else if (day == 2) return "前天" + timeText;
    //前天
    else if (day == -1) return "明天" + timeText;
    //明天
    else if (day == -2) return "后天" + timeText;
    //后天
    else if (day > 2 && day < nowday) {
      //判断是否是当前周而不是上一周
      var dayNum = nowday - day;
      return "周" + week(dayNum) + timeText;
    // } else if (day > 2 && day >= nowday && day < nowday + 7) {
    //   //判断是否是上一周
    //   var dayNum = 7 - Math.abs(nowday - day);
    //   return "上周" + week(dayNum) + timeText;
     //判断是不是超过上一周
    // day >= nowday + 7
    } else if (day > 2 && day >= nowday) {
      //判断是不是超过本周，显示正常时间格式
      return timeTo(value, fmt);
    } else if (Math.abs(day) <= 7 - nowday && day < 0) {
      //判断是否是当前周，不是下一周
      var dayNum = Math.abs(day) + nowday;
      return "周" + week(dayNum) + timeText;
    } else if (
      Math.abs(day) > 7 - nowday &&
      Math.abs(day) < 7 - nowday + 7 &&
      day < 0
    ) {
      var dayNum = Math.abs(day) + nowday - 7; //判断是否是下一周
      return "下周" + week(dayNum) + timeText;
    } else if (Math.abs(day) > 7 - nowday + 7 && day < 0) {
      //判断是否超过下一周，显示正常格式
      return timeTo(value, fmt);
    }
  }
};

/**
 * @param files 图片压缩
 * return{
 *  	baseUrl:baseUrl, base64图片
	  	blobUrl:dataURLtoFile(baseUrl,name) 字节图片
	 }
 */
import EXIF from "exif-js";
export const ImageZip = (files, callback) => {
  //如果不是图片
  if (!IsPhoto(files.name.toLowerCase())) {
    alert("图片格式不对,请重新上传！");
  }

  window.URL = window.URL || window.webkitURL;
  var url = window.URL.createObjectURL(files);
  var Orientation = null;
  EXIF.getData(files, function() {
    Orientation = EXIF.getTag(this, "Orientation");
    //压缩图片
    processfile(files);
  });

  function processfile(file) {
    var reader = new FileReader();
    reader.onload = function(event) {
      var blob = new Blob([event.target.result]);
      window.URL = window.URL || window.webkitURL;
      var blobURL = window.URL.createObjectURL(blob);
      var image = new Image();
      image.src = blobURL;
      image.onload = function() {
        var obj = resizeMe(image, file.name);
        //压缩完，直接上传
        return callback(obj);
      };
    };
    reader.readAsArrayBuffer(file);
  }

  //压缩图片
  function resizeMe(img, name) {
    //压缩的大小
    var max_width = 1024;
    var max_height = 650;

    var canvas = document.createElement("canvas");
    var width = img.width;
    var height = img.height;
    if (width > height) {
      if (width > max_width) {
        height = Math.round((height *= max_width / width));
        width = max_width;
      }
    } else {
      if (height > max_height) {
        width = Math.round((width *= max_height / height));
        height = max_height;
      }
    }

    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext("2d");

    switch (Orientation) {
      case 6: // 旋转90度
        canvas.width = height;
        canvas.height = width;
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(img, 0, -height, width, height);
        break;
      case 3: // 旋转180度
        ctx.rotate(Math.PI);
        ctx.drawImage(img, -width, -height, width, height);
        break;
      case 8: // 旋转-90度
        canvas.width = height;
        canvas.height = width;
        ctx.rotate((3 * Math.PI) / 2);
        ctx.drawImage(img, -width, 0, width, height);
        break;
      default:
        ctx.drawImage(img, 0, 0, width, height);
        break;
    }
    //ctx.drawImage(img, 0, 0, width, height);
    const baseUrl = canvas.toDataURL("image/jpeg", 0.92); //base64图片格式；
    //压缩率
    return {
      baseUrl: baseUrl,
      blobUrl: dataURLtoFile(baseUrl, name),
    };
  }

  //压缩图片完，base64 to blob
  function convertBase64UrlToBlob(dataurl) {
    var arr = dataurl.split(","),
      mime = "." + arr[0].match(/:(.*?);/)[1].split("/")[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  //base64转file
  function dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  //dataURL to blob
  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  //判断是否图片
  function IsPhoto(Str) {
    let tag = false;
    const typeArray = [".jpeg", ".jpg", ".png", ".gif"];
    for (let i = 0; i < typeArray.length; i++) {
      if (Str.indexOf(typeArray[i]) != -1) {
        tag = true;
        break;
      }
    }
    return tag;
  }
};

export const checkPhone = function(phone) {
  var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
  var isMob = /^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
  if (isMob.test(phone) || isPhone.test(phone)) {
    return true;
  } else {
    return false;
  }
};

export const config = {
  CityCode: "440600",
  limitStopTime: "600000",
  vlpn_c: {
    "blue": {
      Background: "rgba(56, 148, 255, 100)",
      BorderColor: "rgba(169, 184, 255, 100)",
      TextColor: "#ffffff",
    },
    "yellow": {
      Background: "rgba(241, 196, 52, 1)",
      BorderColor: "#000",
      TextColor: "#000000",
    },
    "black": {
      Background: "rgb(0, 0, 0)",
      BorderColor: "#ffffff",
      TextColor: "#ffffff",
    },
    "white": { Background: "#ffffff", BorderColor: "#000", TextColor: "#000000" },
    "green": {
      Background: "#56d688",
      BorderColor: "#000",
      TextColor: "#000",
    },
  },
  socket_conf: "~/socket",
  // 外检图图片上传地址
  externalImgIP: {
    LLAN: "",
    WLAN: "",
  },
  // 检测图片是否读取中心端
  isImageCenterEnd: true,
  // 检测视频是否读取中心端
  isVideoCenterEnd: true,
  // 审核备注是否能为空
  reSure: true,
};

/**
 * 设置车牌颜色
 * param：VLPNColor（车牌颜色），self(this)
 * return：返回车牌样式
 * 注：此方法已全局挂载，不用单独引入，直接 this.$options.filters.setVLPNColor(VLPNColor,this)即可
 *
 */
 export const setVLPNColor = (VLPNColor, self) => {
  const vlpn_Style = {
    "blue": {
      Background: "#3894ff",
      BorderColor: "#ffffff",
      TextColor: "#ffffff",
    },
    "yellow": {
      Background: "rgb(255, 228, 149)",
      BorderColor: "#000",
      TextColor: "#000000",
    },
    "black": {
      Background: "rgb(125, 125, 125)",
      BorderColor: "#ffffff",
      TextColor: "#ffffff",
    },
    "white": { Background: "#ffffff", BorderColor: "#000", TextColor: "#000000" },
    "green": {
      Background: "rgba(158, 236, 169, 0.58)",
      BorderColor: "#6da067",
      TextColor: "#000",
    },
  };
  const vlpn_c = vlpn_Style[VLPNColor];
  if (!vlpn_c) {
    return {};
  }
  return {
    display: "inline-block",
    margin: "-2 auto",
    "border-radius": "6px",
    "border-style": "double",
    "text-align": "center",
    padding: "0px 2px",
    background: `${vlpn_c.Background}`,
    color: `${vlpn_c.TextColor}`,
    "border-color": `${vlpn_c.BorderColor}`,
    "font-weight": "bold",
  };
};

// 根据cd表返回codename
export const returnCodeName = (namelist, codevalue) => {
  if (!namelist || namelist.length === 0) {
    return codevalue;
  }
  let CodeName = "";
  namelist.forEach((item) => {
    if (item.CodeValue == codevalue) CodeName = item.CodeName;
  });
  return CodeName;
};
