import msg from './toast';

// const baseUrl = 'http://192.168.10.66:6001';
const baseUrl = '';

const header = _ => {
  //可以从session获取数据赋值
  return {
    'CityName': '',
    'LocationX': 0,
    'LocationY': 0,
  }
}


//get数据请求
const get = (url, params = {}, headers) => {
  let time = new Date().getTime();
  const str = Object.entries(params).map(e => `${e[0]}=${e[1]}`).join("&").replace(/\s/g, '');
  let editHeaders = Object.assign({}, { "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8' })
  if (headers) {
    editHeaders = Object.assign({}, editHeaders, { "token": wx.getStorageSync("token") }, headers)
  }
  return new Promise((resolve, reject) => {
    let address = str ? `${url}?${str}&t=${time}` : `${url}?t=${time}`;
    wx.request({
      url: baseUrl + address,
      header: editHeaders,
      method: "GET",
      success: res => {
        setTimeout(_ => {
          resolve(res)
        }, 0)
      },
      fail: err => {
        msg("请稍后重试")
        reject(err);
      }
    })
  })
}

//post数据请求
const post = function (url, data = {}, headers) {
  let time = new Date().getTime();
  let editHeaders = Object.assign({}, { "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8' })
  if (headers) {
    editHeaders = Object.assign({}, editHeaders, { "token": wx.getStorageSync("token") }, headers)
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseUrl}${url}?=t${time}`,
      data: data,
      header: editHeaders,
      method: "POST",
      success: res => {
        setTimeout(_ => {
          resolve(res)
        }, 0)
      },
      fail: err => {
        msg("请稍后重试")
        reject(err)
      }
    })
  })
}

//格式化时间  date时间对象  fmt时间格式 如yyyy/MM/dd hh:mm:ss
const FmtTime = (date, fmt) => {
  var o = {
    "M+": date.getMonth() + 1, //月份   
    "d+": date.getDate(), //日   
    "h+": date.getHours(), //小时   
    "m+": date.getMinutes(), //分   
    "s+": date.getSeconds(), //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
    "S": date.getMilliseconds() //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

export default { get, post, FmtTime };
