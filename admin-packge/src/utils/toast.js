//toast提示
const msg = (text) => {
    wx.showToast({
        title: text,
        icon: 'none',
        duration: 1200,
    })
}
export default msg;
