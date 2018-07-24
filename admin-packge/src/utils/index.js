import QQMapWX from './qqmap-wx-jssdk.js';
import msg from './toast.js';

const QQMap = new QQMapWX({
  key: 'BZMBZ-OKXRU-DINVZ-2SRN5-4KWJ7-S6B6O'
})
//线上地址
// const baseUrl = 'https://stunnermerchant.uupt.com';
// const baseUrl = 'http://192.168.6.12:60004';
//光明地址
// const baseUrl = 'http://192.168.6.180:8070';
// 鹏浩
// const baseUrl = 'http://192.168.6.100:60003';
//海涛
// const baseUrl = 'http://192.168.6.156:50652';
// 袁沼
const baseUrl = 'http://192.168.6.66:6002';
const commonHeader = _ => {
  //headers每次必传数据存放位置
  return {
    appid: '2',
    token: wx.getStorageSync('loginInfo').Token || '',
    qrcode: wx.getStorageSync('scene') || ''
  }
}

//获取当前日期
const getDateTime = function () {
  let myDate = new Date();
  let n = myDate.getFullYear();
  let y = myDate.getMonth() + 1;
  let r = myDate.getDate();
  let yy = y.toString().replace(/^\d{1}$/, '0' + y);
  let rr = r.toString().replace(/^\d{1}$/, '0' + r);
  return `${n}-${yy}-${rr}`
}

///格式化时间  date时间对象  fmt时间格式 如yyyy/MM/dd hh:mm:ss
const FmtTime = function (date, fmt) {
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
};

//get数据请求
const get = (opt = {}) => {
  let time = new Date().getTime();
  const str = Object.entries(opt.params).map(e => `${e[0]}=${e[1]}`).join("&").replace(/\s/g, '');
  let editHeaders = Object.assign({}, { 'content-type': 'application/json' }, commonHeader())
  opt.headers && (editHeaders = Object.assign({}, editHeaders, opt.headers))
  return new Promise((resolve, reject) => {
    let address = str ? `${opt.url}?${str}&t=${time}` : `${url}?t=${time}`;
    wx.request({
      url: baseUrl + address,
      header: editHeaders,
      method: "GET",
      success: res => {
        setTimeout(_ => {
          resolve(res.data)
        }, 0)
      },
      fail: err => {
        reject(err);
      }
    })
  })
}

//post数据请求
const post = (opt = {}) => {
  let time = new Date().getTime();
  let editHeaders = Object.assign({}, { 'content-type': 'application/json' }, commonHeader())
  opt.headers && (editHeaders = Object.assign({}, editHeaders, opt.headers))
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseUrl}${opt.url}?t=${time}`,
      data: opt.data || {},
      header: editHeaders,
      method: "POST",
      success: res => {
        // console.log(res.statusCode)
        setTimeout(_ => {
          if (res.data.State == 1) {
            //返回正常的数据
            resolve(res.data)
          } else if (res.data.State == -10) {
            //针对token失效问题
            wxLogin()
            resolve(res.data)
          } else if (res.data.State == -7) {
            //店铺未绑定跑腿账户
          } else if (res.data.State == -11) {
            //未绑定第三方跑腿账户
            resolve(res.data)
          } else if (res.data.State == -12) {
            //订单价格token计算失效
            resolve(res.data)
          } else {
            //抛出异常
            reject(res.data)
          }
        }, 0)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

// 营业时间格式化 示例：'0-140,180-300' => ['00:00-02:20','03:00-05:00']
// 返回一个数组，使用的时候直接String转化为字符串，做相应操作
const openTime = str => {
  const two = n => {
    return n < 10 ? '0' + n : '' + n;
  }
  if (str.indexOf(',') > -1) {
    return str.split(',').map(e => {
      let a = two(Math.floor(e.split('-')[0] / 60))
      let b = two(Math.floor(e.split('-')[0] % 60))
      let c = two(Math.floor(e.split('-')[1] / 60))
      let d = two(Math.floor(e.split('-')[1] % 60))
      return e = `${a}:${b}-${c}:${d}`;
    })
  } else {
    let a = two(Math.floor(str.split('-')[0] / 60))
    let b = two(Math.floor(str.split('-')[0] % 60))
    let c = two(Math.floor(str.split('-')[1] / 60))
    let d = two(Math.floor(str.split('-')[1] % 60))
    return [`${a}:${b}-${c}:${d}`];
  }
}

// 生成图片本地链接，用于canvas绘制
const downImg = url => {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url: url,
      success: res => {
        resolve(res.tempFilePath)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

//地理位置获取
const qqMapInfo = _ => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        QQMap.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: ok => {
            //城市 经纬度
            let pos = {
              city: ok.result.address_component.city,
              latitude: res.latitude,
              longitude: res.longitude
            }
            if (wx.getStorageSync('QQmap')) {
              wx.removeStorageSync('QQmap');
            }
            wx.setStorageSync('QQmap', pos)
            //调用wxLogin接口
            wxLogin().then(res => {
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          },
          fail: err => {
            wx.hideLoading();
            reject(err);
          }
        })
      },
      fail: err => {
        wx.hideLoading();
        reject('error');
        model();
      }
    })
  })
}

//全局wxLogin token获取
const wxLogin = _ => {
  // 调用登录接口
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        userLogin(res.code).then(res => {
          if (res.State == 1) {
            wx.hideLoading()
            resolve(res)
            if (wx.getStorageSync('loginInfo')) {
              wx.removeStorageSync('loginInfo');
            }
            wx.setStorageSync('loginInfo', res.Body)
          } else if (res.State == -10) {
            wxLogin()
          }
        }).catch(err => {
          wx.hideLoading();
          msg(err.Msg);
          reject(err);
        })
      },
      fail: err => {
        wx.hideLoading();
        console.log(err);
      }
    })
  })
}

const userLogin = async code => {
  return await post({
    url: '/api/Merchant/Login/WxJsCodeLogin',
    data: {
      jsCode: code,
    },
  })
}

const getPriceType = _ => {
  if (!wx.getStorageSync('priceType')) {//不存在
    let oldTime = new Date().getTime();
    wx.setStorageSync('oldTime', oldTime);
    priceTypeInfo()
  } else {
    let newTime = new Date().getTime();
    let oldTime = wx.getStorageSync('oldTime');
    Math.round((Number(newTime) - Number(oldTime)) / 1000) > 30 * 60 && priceTypeInfo();
  }
}

const priceTypeInfo = _ => {
  post({
    url: '/api/Merchant/ShopManage/GetShopSetInfo',
    data: {
      ShopId: wx.getStorageSync('loginInfo').ShopID || ''
    }
  }).then(res => {
    wx.setStorageSync('priceType', res.Body.DispatchList)
  }).catch(err => {
    msg(err.Msg)
  })
}

//地理位置授权
const model = _ => {
  wx.showModal({
    title: '提示',
    content: '配送需要您的地理位置',
    showCancel:false,
    success: res => {
      if (res.confirm) {
        console.log('用户点击确定')
        wx.redirectTo({
          url: '/pages/wx-auth?type=1'
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
        model();
      }
    }
  })
}

//获取用户信息授权
const loginModel = _ => {
  wx.showModal({
    title: '提示',
    content: '需要您重新授权',
    showCancel:false,
    success: res => {
      if (res.confirm) {
        console.log('用户点击确定')
        wx.redirectTo({
          url: '/pages/wx-auth?type=2'
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
        loginModel();
      }
    }
  })
}

//保存到相册授权
const phModel = _ => {
  wx.showModal({
    title: '提示',
    content: '需要您重新授权',
    showCancel:false,
    success: res => {
      if (res.confirm) {
        console.log('用户点击确定')
        wx.navigateTo({
          url: '/pages/wx-auth?type=3'
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
        phModel();
      }
    }
  })
}

export default { get, post, openTime, downImg, baseUrl, qqMapInfo, FmtTime, getDateTime, getPriceType, phModel, loginModel }
