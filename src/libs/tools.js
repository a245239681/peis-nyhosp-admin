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
 * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
 */
export const getIntersection = (arr1, arr2) => {
  let len = Math.min(arr1.length, arr2.length);
  let i = -1;
  let res = [];
  while (++i < len) {
    const item = arr2[i];
    if (arr1.indexOf(item) > -1) res.push(item);
  }
  return res;
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
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
  return targetarr.some(_ => arr.indexOf(_) > -1);
};

/**
 * @param {String|Number} value 要验证的字符串或数值
 * @param {*} validList 用来验证的列表
 */
export function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true;
    }
  }
  return false;
}

/**
 * @param {Number} timeStamp 判断时间戳格式是否是毫秒
 * @returns {Boolean}
 */
const isMillisecond = timeStamp => {
  const timeStr = String(timeStamp);
  return timeStr.length > 10;
};

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} currentTime 当前时间时间戳
 * @returns {Boolean} 传入的时间戳是否早于当前时间戳
 */
const isEarly = (timeStamp, currentTime) => {
  return timeStamp < currentTime;
};

/**
 * @param {Number} num 数值
 * @returns {String} 处理后的字符串
 * @description 如果传入的数值小于10，即位数只有1位，则在前面补充0
 */
const getHandledValue = num => {
  return num < 10 ? "0" + num : num;
};

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} startType 要返回的时间字符串的格式类型，传入'year'则返回年开头的完整时间
 */
const getDate = (timeStamp, startType) => {
  const d = new Date(timeStamp * 1000);
  const year = d.getFullYear();
  const month = getHandledValue(d.getMonth() + 1);
  const date = getHandledValue(d.getDate());
  const hours = getHandledValue(d.getHours());
  const minutes = getHandledValue(d.getMinutes());
  const second = getHandledValue(d.getSeconds());
  let resStr = "";
  if (startType === "year")
    resStr =
      year +
      "-" +
      month +
      "-" +
      date +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      second;
  else resStr = month + "-" + date + " " + hours + ":" + minutes;
  return resStr;
};

/**
 * @param {String|Number} timeStamp 时间戳
 * @returns {String} 相对时间字符串
 */
export const getRelativeTime = timeStamp => {
  // 判断当前传入的时间戳是秒格式还是毫秒
  const IS_MILLISECOND = isMillisecond(timeStamp);
  // 如果是毫秒格式则转为秒格式
  if (IS_MILLISECOND) Math.floor((timeStamp /= 1000));
  // 传入的时间戳可以是数值或字符串类型，这里统一转为数值类型
  timeStamp = Number(timeStamp);
  // 获取当前时间时间戳
  const currentTime = Math.floor(Date.parse(new Date()) / 1000);
  // 判断传入时间戳是否早于当前时间戳
  const IS_EARLY = isEarly(timeStamp, currentTime);
  // 获取两个时间戳差值
  let diff = currentTime - timeStamp;
  // 如果IS_EARLY为false则差值取反
  if (!IS_EARLY) diff = -diff;
  let resStr = "";
  const dirStr = IS_EARLY ? "前" : "后";
  // 少于等于59秒
  if (diff <= 59) resStr = diff + "秒" + dirStr;
  // 多于59秒，少于等于59分钟59秒
  else if (diff > 59 && diff <= 3599)
    resStr = Math.floor(diff / 60) + "分钟" + dirStr;
  // 多于59分钟59秒，少于等于23小时59分钟59秒
  else if (diff > 3599 && diff <= 86399)
    resStr = Math.floor(diff / 3600) + "小时" + dirStr;
  // 多于23小时59分钟59秒，少于等于29天59分钟59秒
  else if (diff > 86399 && diff <= 2623859)
    resStr = Math.floor(diff / 86400) + "天" + dirStr;
  // 多于29天59分钟59秒，少于364天23小时59分钟59秒，且传入的时间戳早于当前
  else if (diff > 2623859 && diff <= 31567859 && IS_EARLY)
    resStr = getDate(timeStamp);
  else resStr = getDate(timeStamp, "year");
  return resStr;
};

/**
 * @returns {String} 当前浏览器名称
 */
export const getExplorer = () => {
  const ua = window.navigator.userAgent;
  const isExplorer = exp => {
    return ua.indexOf(exp) > -1;
  };
  if (isExplorer("MSIE")) return "IE";
  else if (isExplorer("Firefox")) return "Firefox";
  else if (isExplorer("Chrome")) return "Chrome";
  else if (isExplorer("Opera")) return "Opera";
  else if (isExplorer("Safari")) return "Safari";
};

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent("on" + event, handler);
      }
    };
  }
})();

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent("on" + event, handler);
      }
    };
  }
})();

/**
 * 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
export const hasKey = (obj, key) => {
  if (key) return key in obj;
  else {
    let keysArr = Object.keys(obj);
    return keysArr.length;
  }
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
    return !keysArr1.some(key => obj1[key] != obj2[key]);
};

export const getBASE64 = dataArray => {
  var digits =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var strData = "";
  for (var i = 0, ii = dataArray.length; i < ii; i += 3) {
    if (isNaN(dataArray[i])) break;
    var b1 = dataArray[i] & 0xff,
      b2 = dataArray[i + 1] & 0xff,
      b3 = dataArray[i + 2] & 0xff;
    var d1 = b1 >> 2,
      d2 = ((b1 & 3) << 4) | (b2 >> 4);
    var d3 = i + 1 < ii ? ((b2 & 0xf) << 2) | (b3 >> 6) : 64;
    var d4 = i + 2 < ii ? b3 & 0x3f : 64;
    strData +=
      digits.substring(d1, d1 + 1) +
      digits.substring(d2, d2 + 1) +
      digits.substring(d3, d3 + 1) +
      digits.substring(d4, d4 + 1);
  }
  return strData;
};

export const demoDownloadPDF = url => {
  if (!/^https?:/i.test(url)) return;
  if (window.XMLHttpRequest) var xhr = new XMLHttpRequest();
  else var xhr = new ActiveXObject("MSXML2.XMLHTTP");
  xhr.open("GET", url, false); // 同步方式
  if (xhr.overrideMimeType) {
    try {
      xhr.responseType = "arraybuffer";
      var arrybuffer = true;
    } catch (err) {
      xhr.overrideMimeType("text/plain; charset=x-user-defined");
    }
  }
  xhr.send(null);
  var data = xhr.response || xhr.responseBody;
  if (typeof Uint8Array !== "undefined") {
    if (arrybuffer) var dataArray = new Uint8Array(data);
    else {
      var dataArray = new Uint8Array(data.length);
      for (var i = 0; i < dataArray.length; i++) {
        dataArray[i] = data.charCodeAt(i);
      }
    }
  } else {
    var dataArray = BinaryToArray(data).toArray();
  }
  return getBASE64(dataArray);
};

//  判断是否闰年
function isLeapYear (year) {
  var leap = false;
  if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) {
    leap = true;
  } // 是闰年
  else {
    leap = false;
  } // 不是闰年
  // console.log(year,"is leap year:",leap)
  return leap;
}
//  判断大小月，2月不在判断范围内
function isBigMonth (month) {
  var bigMonth = false;
  if (month !== 4 && month !== 6 && month !== 9 && month !== 11) {
    bigMonth = true;
  } else {
    bigMonth = false;
  }
  // console.log("month is bigMonth:",bigMonth)
  return bigMonth;
}

//  依据年、月判断最大日
function currentMonthMaxDay (year, month) {
  // 是否2月?(闰年29，非闰28):(小月？30天:31天)
  var maxDay = 0;
  if (month === 2) {
    if (isLeapYear(year)) {
      maxDay = 29;
    } else {
      maxDay = 28;
    }
  } else {
    if (isBigMonth(month)) {
      maxDay = 31;
    } else {
      maxDay = 30;
    }
  }
  return maxDay;
}

/**
 * @description 根据身份证号码判断年龄、出生日期
 */
export const getBirthAndAge = idNo => {
  let len = idNo.length ? idNo.length : 0;
  let boIdNo = {
    birthday: "",
    age: "",
    sex: ""
  };
  let yearBirth = "";
  let monthBirth = "";
  let dayBirth = "";
  let sexNo = "";

  if (len == 0) {
    return false;
  } else {
    if (len != 15 && len != 18) {
      // 身份证号码只能为15位或18位其它不合法
      return false;
    }
  }

  if (len == 15) {
    boIdNo.birthday = "19" + idNo.substr(6, 6);
    yearBirth = "19" + idNo.substring(6, 8);
    monthBirth = idNo.substring(8, 10);
    dayBirth = idNo.substring(10, 12);
  } else if (len == 18) {
    boIdNo.birthday = idNo.substr(6, 8);
    yearBirth = idNo.substring(6, 10);
    monthBirth = idNo.substring(10, 12);
    dayBirth = idNo.substring(12, 14);
    sexNo = idNo.substring(16, 17);
  }

  if (+monthBirth > 12 || monthBirth == "00") {
    boIdNo.message = "证件号码中有错误的月份";
  }

  if (
    +dayBirth > currentMonthMaxDay(+yearBirth, +monthBirth) ||
    dayBirth == "00"
  ) {
    boIdNo.message = "证件号码中有错误的日期";
  }

  // 根据身份证倒数第二位，计算男女
  let tempid = sexNo % 2;
  if (tempid == 0) {
    boIdNo.sex = "女";
  } else {
    boIdNo.sex = "男";
  }

  // console.log(birthday)
  // 获取出生年月日
  boIdNo.birthday = boIdNo.birthday.replace(/(.{4})(.{2})/, "$1-$2-");
  // 获取当前年月日并计算年龄
  let myDate = new Date();
  let monthNow = myDate.getMonth() + 1;
  let dayNow = myDate.getDate();
  boIdNo.age = myDate.getFullYear() - yearBirth;
  if (monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)) {
    boIdNo.age--;
  }
  // console.log(age)
  boIdNo.age = boIdNo.age;
  // console.log(boIdNo);
  return boIdNo;
};

/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
export const debounce = (func, wait, immediate) => {
  let timeout;

  return function () {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
  };
};

/**
 *加法函数，用来得到精确的加法结果
 *说明：javascript的加法 结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 *调用：accAdd(arg1,arg2)
 *返回值：arg1加上arg2的精确结果
 */
function accAdd (arg1, arg2) {
  let r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
}

// 给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function (arg1, arg2) {
  return accAdd(arg1, arg2);
};

/**
 *乘法函数，用来得到精确的乘法结果
 *说明：javascript的乘法结果会有误差，在两个浮点数 相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 *调用：accMul(arg1,arg2)
 *返回值：arg1乘以 arg2的精确结果
 */
function accMul (arg1, arg2) {
  let m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) { }
  try {
    m += s2.split(".")[1].length;
  } catch (e) { }
  return (
    (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
    Math.pow(10, m)
  );
}

// 给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.mul = function (arg1, arg2) {
  return accMul(arg1, arg2);
};

/**
 *除法函数，用来得到精确的除法结果
 *说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为 精确的除法结果。
 *调用：accDiv(arg1,arg2)
 *返回值：arg1除以arg2的精确结果
 */
function accDiv (arg1, arg2) {
  let t1 = 0,
    t2 = 0,
    r1,
    r2;
  try {
    t1 = arg1.toString().split(".")[1].length;
  } catch (e) { }
  try {
    t2 = arg2.toString().split(".")[1].length;
  } catch (e) { }
  r1 = Number(arg1.toString().replace(".", ""));
  r2 = Number(arg2.toString().replace(".", ""));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}

// 给Number类型增加一个div方法，调用起来更加 方便。
Number.prototype.div = function (arg1, arg2) {
  return accDiv(arg1, arg2);
};

/**
 * @param {*} data JSON对象
 * @param {*} name 对象键值，是根据什么字段去重
 * @description JSON对象去重
 */
export const FilterByName = (data, Name) => {
  var dest = [];
  for (var i = 0; i < data.length; i++) {
    var ai = data[i];
    if (i == 0) {
      dest.push(ai);
    } else {
      var filterData = dest.filter(function (e) {
        return e[Name] == ai[Name];
      });
      if (filterData.length == 0) {
        dest.push(ai);
      }
    }
  }
  return dest;
};
