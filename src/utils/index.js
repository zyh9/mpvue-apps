import msg from './toast';

const baseUrl = '';

// let isJm = true;

const header = () => {
  return {
    "":""
  }
}

//get数据请求
const get = (url, params = {}, headers) => {
  let time = new Date().getTime();
  const str = Object.entries(params).map(e => `${e[0]}=${e[1]}`).join("&").replace(/\s/g, '');
  let initHeaders = Object.assign({},
    { "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8' },
    header());
  if (headers) {
    initHeaders = Object.assign({}, initHeaders, headers);
  }
  return new Promise((resolve, reject) => {
    let address = str ? `${url}${str}t?${time}` : `${url}t?${time}`;
    wx.request({
      url: baseUrl + address,
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
  let initHeaders = Object.assign({},
    { "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8' },
    header());
  if (headers) {
    initHeaders = Object.assign({}, initHeaders, { "token": wx.getStorageSync("token") }, headers);
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseUrl}${url}t?${time}`,
      data: {
        ...data
      },
      header: initHeaders,
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

export default {get,post};
