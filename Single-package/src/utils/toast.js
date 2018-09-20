//toast提示
const msg = text => {
    wx.showToast({
        title: text,
        icon: 'none',
        duration: 1500,
    })
}
export default msg;
