import QQMapWX from './qqmap-wx-jssdk.js';
const QQMap = new QQMapWX({
  key: 'BZMBZ-OKXRU-DINVZ-2SRN5-4KWJ7-S6B6O'
})

//线上地址
const baseUrl = 'https://stunnercustomer.uupt.com';
//袁沼地址
// const baseUrl = 'http://192.168.6.66:6001';
//光明地址
// const baseUrl = 'http://192.168.6.180:8060';

const commonHeader = _ => {
  //headers每次必传数据存放位置
  return {
    v:'1.0.6'
  }
}

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
        setTimeout(_ => {
          if (res.data.State == 1) {
            //返回正常的数据
            resolve(res.data)
          } else if (res.data.State == -10) {
            //针对token失效问题
            //调用wxLogin接口
            wxLogin()
            resolve(res.data)
          } else if (res.data.State == -1010) {
            //跑腿地址同步
            resolve(res.data)
          } else if (res.data.State < -10000) {
            //订单提交页商品状态码
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

//地理位置获取
const qqMapInfo = _ => {
  return new Promise((resolve, reject) => {
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
            wx.setStorageSync('QQmap', pos)
            //调用wxLogin接口
            wxLogin().then(res => {
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          },
          fail: err => {
            reject(err)
          }
        })
      },
      fail: err => {
        reject('error')
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
        wx.showLoading({
          title: '加载中',
          mask: true,
        })
        userLogin(res.code).then(res => {
          if (res.State == 1) {
            wx.hideLoading()
            resolve(res)
            wx.setStorageSync('loginInfo', res.Body)
          } else if (res.State == -10) {
            wxLogin()
          }
        }).catch(err => {
          reject(err)
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  })
}
const userLogin = async code => {
  return await post({
    url: '/api/Customer/Login/WxJsCodeLogin',
    data: {
      jsCode: code,
    },
    headers: {
      appid: '1',
      qrcode: ''
    }
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

export default { get, post, openTime, qqMapInfo };
