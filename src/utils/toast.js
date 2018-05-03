//toast提示
const msg = (text) => {
    wx.showToast({
        title: text,
        duration: 800,
    })
}
export default msg;
