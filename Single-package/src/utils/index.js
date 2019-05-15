import msg from './toast.js';

const baseUrl = 'localhost:8080';

const commonHeader = _ => {
  //headers每次必传数据存放位置
  return {
    //...
  }
}

//get数据请求
const get = (opt = {}) => {
  let time = new Date().getTime();
  const str = Object.entries(opt.params).map(e => `${e[0]}=${e[1]}`).join("&").replace(/\s/g, '');
  let editHeaders = Object.assign({}, { 'content-type': 'application/json' }, commonHeader())
  opt.headers && (editHeaders = Object.assign({}, editHeaders, opt.headers))
  return new Promise((resolve, reject) => {
    let address = str ? `${opt.url}?${str}&t=${time}` : `${opt.url}?t=${time}`;
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
          resolve(res.data)
        }, 0)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

export default { get, post }
