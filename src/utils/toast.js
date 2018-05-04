//toast提示
const msg = (text) => {
    wx.showToast({
        title: text,
        icon: 'none',
        duration: 800,
    })
}
export default msg;
