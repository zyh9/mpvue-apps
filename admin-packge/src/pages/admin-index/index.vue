<template>
    <div class="admin_index">
        <div class="index_top">
            <div class="userInfo  set-flex set-between set-align">
                <div class="item set-flex ">
                    <div class="head"><img :src="shopInfo.ShopLogo" alt="" class="fade_in"></div>
                    <div class="name">
                        <div class="shop_name_left">
                            <p>{{shopInfo.ShopName}}</p>
                            <div class="shop_date_info">
                                <div class="is_vip">
                                    <i class="icon_plat" v-if="ShopPlatType==1"></i>
                                    <i class="icon_vip" v-if="ShopPlatType==2"></i>
                                    <span>{{ShopPlatType==1?'平台版':'专享版'}}</span>
                                </div>
                                <div class="last_date" v-if="shopInfo.Status==1">{{shopInfo.EndDay}}到期</div>
                            </div>
                        </div>
                        <div class="shop_time" v-if="shopInfo.Status==2 ||shopInfo.Status==-4 ||shopInfo.Status==0">
                            <div class="shop_buy" @click="shopBuy">
                                <p>立即订购</p><i class="yellow"></i></div>
                            <div class="last">{{shopInfo.Status==2?'试用至'+shopInfo.EndDay:shopInfo.Status==-4?'已过期':'待审核'}}</div>
                        </div>
                    </div>
                </div>
                <!-- 我的收款码，暂去掉 -->
                <!-- <i class="icon icon_myqr qr"  @click='goLink(0)'></i> -->
            </div>
            <div class="income">
                <div class="today_income">
                    <i class="icon icon_income"></i>
                    <span>{{income}}</span>
                    <p>今日订单收入(元)</p>
                </div>
                <div class="complete_order">
                    <i class="icon icon_order"></i>
                    <span>{{orderNum}}</span>
                    <p>今日完成订单数(单)</p>
                </div>
            </div>
        </div>
        <div class="main">
            <ul class="platSum">
                <li class="set-flex set-between set-align">
                    <div class="item set-flex ">
                        <img class="fade_in" src="https://otherfiles-ali.uupt.com/Stunner/FE/M/f11c233b1a5243cda24b374da7010c0e_big.png" alt="">
                        <div>
                            <p class="tit">店铺管理</p>
                            <p class="text">店铺模板、配送服务等在此管理</p>
                        </div>
                    </div>
                    <div class="look" @click='goLink(1)'>查看</div>
                </li>
                <li class="set-flex set-between set-align">
                    <div class="item set-flex ">
                        <img class="fade_in" src="https://otherfiles-ali.uupt.com/Stunner/FE/M/f04c053b5cc943eb9dd2ff8e06d766f7_big.png" alt="">
                        <div>
                            <p class="tit">商品管理 </p>
                            <p class="text">商品上下架、添加商品等在此管理</p>
                        </div>
                    </div>
                    <div class="look" @click='goLink(2)'>查看</div>
                </li>
                <li class="set-flex set-between set-align">
                    <div class="item set-flex ">
                        <img src="../../../static/discount.png" alt="">
                        <div>
                            <p class="tit">优惠管理 </p>
                            <p class="text">优惠券、折扣、配送费优惠等在此管理</p>
                        </div>
                    </div>
                    <div class="look" @click='goLink(3)'>查看</div>
                </li>
                <li class="set-flex set-between set-align" @click="shareQR">
                    <div class="item set-flex ">
                        <img class="fade_in" src="https://otherfiles-ali.uupt.com/Stunner/FE/M/20b38a88ff6b460eb42d55b21da3ca76_big.png" alt="">
                        <div>
                            <p class="tit">分享码</p>
                            <p class="text">点此生成店铺分享图片，分享获客</p>
                        </div>
                    </div>
                    <div class="look">查看</div>
                </li>
            </ul>
            <div class="switch_group">
                <div class="switch_item">
                    <p>店铺营业状态</p>
                    <switch @change="businessChange" :checked='shopInfo.OpenState==1?true:false' class="witch" />
                </div>
                <!-- <button open-type="openSetting" @opensetting="setting">打开授权设置页</button> -->
                <!-- <p class="tip">由于您跑腿钱包低于￥200余额，会影响跑腿下单，低于￥200期间 您将不能营业，为保证订单能正常运行，请您尽快充值</p> -->
            </div>
        </div>
        <div class="saveImg" v-if="canvasMask">
            <div class="main_canvas">
                <canvas canvas-id='myCanvas' style="background:#fff;width: 100%;height: 100%;"> 
                                                                                        <cover-view class="shareCover" >
                                                                                            <cover-image  @click='shareClose' class="icon icon_close" src="https://otherfiles-ali.uupt.com/Stunner/FE/M/8fa784b404314047a63e79dbb9c0ae87_big.png"/>
                                                                                            <cover-image @click='saveImg' class="saveBtn" src="https://otherfiles-ali.uupt.com/Stunner/FE/M/30c891fd875749fa8990c8ab6e78085e_big.png"/>
                                                                                        </cover-view>
                                                                                    </canvas>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                saveInfo: {
                    Logo: 'https://otherfiles-ali.uupt.com/Stunner/logo-C-R.png',
                    QrCodeUrl: '',
                    ShopLogo: '',
                    ShopName: '',
                    // ShareBg: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/f4ea66d48b154762bdda5e73f051d20e_big.png',
                    ShareBg: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/shareCard.png',
                },
                info: [{
                    name: '平台店铺'
                }, {
                    name: '自主店铺'
                }],
                platSum: [{
                        text: '店铺管理'
                    },
                    {
                        text: '商品管理'
                    },
                    {
                        text: '分享码'
                    }
                ],
                winWidth: 0,
                winHeight: 0,
                // tab切换  
                currentTab: 0,
                code: '',
                canvasMask: false,
                shopInfo: {},
                income: 0,
                orderNum: 0,
                ShopPlatType: -1,
                minShopLogo: ''
            }
        },
        onShow() { //页面渲染就会触发
            this.minShopLogo = '';
            this.currentTab = 0;
            this.canvasMask = false;
            wx.getStorageSync('loginInfo') && (this.ShopPlatType = wx.getStorageSync('loginInfo').ShopPlatType);
            this.getShopInfo();
        },
        mounted() {
            let query = wx.createSelectorQuery();
            query.select('.index_top').boundingClientRect()
            query.exec(res => {
                let height = res[0].height;
                wx.getSystemInfo({
                    success: res => {
                        // console.log(res)
                        this.winWidth = res.windowWidth;
                        //减去上方的高度
                        this.winHeight = res.windowHeight - height;
                    }
                })
            })
            this.getTodayData();
        },
        methods: {
            setting(e) {
                console.log(e)
            },
            getTodayData() {
                this.util.post({
                    url: '/api/Merchant/Personal/TodayStatistics',
                    data: {
                        ShopId: wx.getStorageSync('loginInfo').ShopID
                    }
                }).then(res => {
                    if (res.State == 1) {
                        this.income = res.Body.IncomeMoney;
                        this.orderNum = res.Body.FinishedOrder;
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            getShopInfo() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/GetShopDetail',
                    data: {
                        ShopID: wx.getStorageSync('loginInfo').ShopID
                    }
                }).then(res => {
                    // console.log(res)
                    if (res.State == 1) {
                        this.shopInfo = res.Body;
                        this.shopInfo.ShopName = wx.getStorageSync('loginInfo').ShopID === 0 ? wx.getStorageSync('userInfo').nickName + '' : this.shopInfo.ShopName;
                        this.saveInfo.ShopName = res.Body.ShopName;
                        this.saveInfo.ShopLogo = res.Body.ShopLogo;
                        this.ShopPlatType = res.Body.ShopPlatType;
                        this.shopInfo.EndDay = this.shopInfo.EndDay != "" ? this.util.FmtTime(new Date(this.shopInfo.EndDay), 'yyyy-MM-dd') : this.shopInfo.EndDay;
                        wx.setStorageSync('shopInfo', this.shopInfo);
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            //坐标转地址
            QQcityInfo(info) {
                // 调用接口
                QQMap.reverseGeocoder({
                    location: {
                        latitude: info.latitude,
                        longitude: info.longitude
                    },
                    success: res => {
                        let pos = {
                            city: res.result.address_component.city,
                            latitude: info.latitude,
                            longitude: info.longitude
                        }
                        wx.setStorageSync('QQmap', pos)
                    },
                    fail: err => {
                        this.msg('位置信息获取失败')
                    }
                })
            },
            getUserInfo() {
                // 调用登录接口
                wx.login({
                    success: res => {
                        this.code = res.code;
                        // wx.getUserInfo({
                        //   success: res => {
                        //     //userInfo.gender
                        //     //性别 0：未知、1：男、2：女
                        //     this.userInfo = res.userInfo
                        //     wx.setStorageSync('userInfo', res.userInfo)
                        //     this.userLogin()
                        //   },
                        //   fail: err => {
                        //     console.log(err)
                        //   }
                        // })
                    },
                    fail: err => {
                        console.log(err)
                    }
                })
            },
            userLogin(info) {
                this.util.post({
                    url: '/api/Merchant/Login/WxJsCodeLogin',
                    data: {
                        jsCode: this.code,
                        // wxUserInfo: "",
                        // wxopenid: "o2J1J5DQsMZmeFoROTdn4O2S6nmA"
                    }
                }).then(res => {
                    if (res.State == 1) {
                        let objInfo = res.Body;
                        /* 店铺默认模板是餐饮模板 1:餐饮模板，2:电商模板 */
                        // let objInfo = Object.assign({}, res.Body, {
                        //     TemplateID: 1
                        // })
                        // 会覆盖掉原来该 key 对应的内容
                        wx.setStorageSync('loginInfo', objInfo)
                        //获取商户信息 catch用来捕获异常
                    } else if (res.State == -10) {
                        if (!(wx.getStorageSync('loginInfo').Token)) {
                            //再次获取用户信息
                            this.userLogin()
                        }
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            shareQR() {
                this.util.post({
                    url: '/api/Merchant/Personal/CreateWxOpenQrCode',
                    data: {
                        CodeType: 2,
                        CodeValue: wx.getStorageSync('loginInfo').ShopID,
                        RequestType: 2
                    }
                }).then(res => {
                    this.saveInfo.QrCodeUrl = res.Body.QrCodeUrl;
                    this.requireImg().catch(err => {
                        this.msg('图片地址获取失败')
                    })
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            //滑动切换
            bindChange(e) {
                // console.log(e)
                this.currentTab = e.target.current
            },
            //点击tab切换 
            swichNav(e) {
                // console.log(e)
                if (this.currentTab === e.target.dataset.current) return;
                this.currentTab = e.target.dataset.current;
            },
            businessChange(e) {
                this.util.post({
                    url: '/api/Merchant/ShopManage/ChangeShopState',
                    data: {
                        ShopID: wx.getStorageSync('loginInfo').ShopID,
                        OpenState: e.target.value,
                    }
                }).then(res => {
                    this.getShopInfo();
                }).catch(err => {
                    this.msg(err.Msg)
                    this.getShopInfo();
                })
            },
            restChange(e) {
                console.log(e.target)
            },
            goLink(type) {
                let link = '';
                switch (type) {
                    case 0:
                        wx.navigateTo({
                            url: '/pagesUser/admin-collection-code'
                        })
                        break;
                    case 1:
                        wx.navigateTo({
                            url: '/pages/admin-store-manage'
                        })
                        break;
                    case 2:
                        this.getClass()
                        break;
                    case 3:
                        wx.navigateTo({
                            url: '/pages/admin-discount-manage'
                        })
                        break;
                }
            },
            getClass() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/ShopGoodTypes',
                    data: {
                        ShopID: wx.getStorageSync('loginInfo').ShopID
                    }
                }).then(res => {
                    if (res.Body.length == 0) {
                        wx.navigateTo({
                            url: '/pages/admin-no-shop'
                        })
                    } else {
                        wx.navigateTo({
                            url: '/pages/admin-commodity-manage'
                        })
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            shareClose() {
                this.canvasMask = false;
                wx.hideLoading()
            },
            downImg(val) {
                return new Promise((resolve, reject) => {
                    if (val.indexOf('wxfile://') == -1) {
                        wx.downloadFile({
                            url: val,
                            success: res => {
                                resolve(res.tempFilePath)
                            },
                            fail: err => {
                                reject(err)
                            }
                        })
                    } else {
                        resolve(val)
                    }
                })
            },
            async requireImg() {
                wx.showLoading({
                    title: '生成中',
                    // mask: true,
                })
                this.saveInfo.Logo = await this.downImg(this.saveInfo.Logo) //二维码图片
                this.saveInfo.QrCodeUrl = await this.downImg(this.saveInfo.QrCodeUrl) //二维码图片
                this.minShopLogo = await this.downImg(this.saveInfo.ShopLogo + '?x-oss-process=image/resize,h_100');
                this.saveInfo.ShareBg = await this.downImg(this.saveInfo.ShareBg) //背景图
                setTimeout(_ => {
                    this.drawCanvas()
                }, 0)
            },
            /* 绘制canvas */
            drawCanvas() {
                let pixelRatio = '';
                let windowWidth = '';
                let windowHeight = '';
                wx.getSystemInfo({
                    success: res => {
                        pixelRatio = res.pixelRatio;
                        windowWidth = res.windowWidth;
                        windowHeight = res.windowHeight;
                    }
                })
                // 默认像素比
                // let pixelRatio = this.pixelRatio;
                // 屏幕系数比，以设计稿375*667（iphone7）为例
                let XS = windowWidth / 375;
                const ctx = wx.createCanvasContext('myCanvas');
                // ctx.setFillStyle('#fff')
                ctx.fillRect(0, 0, 339 * XS, 522 * XS)
                /* 背景图 */
                ctx.drawImage(this.saveInfo.ShareBg, 0 * XS, 0 * XS, 339 * XS, 522 * XS)
                /* 小程序logo */
                ctx.drawImage(this.saveInfo.Logo, 13 * XS, 12 * XS, 34 * XS, 34 * XS)
                ctx.setFontSize(13 * XS);
                ctx.setFillStyle('#1a1a1a')
                ctx.fillText('足不出户 随意享购全城店铺', 55 * XS, 32 * XS);
                /* 店铺logo图片 */
                ctx.drawImage(this.minShopLogo, 157 * XS, 325 * XS, 25 * XS, 25 * XS)
                /* 二维码 */
                ctx.drawImage(this.saveInfo.QrCodeUrl, 65 * XS, 97 * XS, 211 * XS, 211 * XS)
                /* 店铺名字 */
                ctx.setFontSize(14 * XS);
                ctx.setFillStyle('#010101')
                ctx.setTextAlign('center');
                this.fontLineFeed(ctx, this.saveInfo.ShopName, 18 * XS, 18 * XS, 170 * XS, 350 * XS)
                ctx.draw()
                wx.hideLoading()
                this.canvasMask = true;
            },
            // 文字换行
            /**
             * ctx,画布对象
             * str,需要绘制的文字
             * splitLen,切割的长度字符串
             * strHeight,每行文字之间的高度
             * x,位置
             * y
             */
            fontLineFeed(ctx, str, splitLen, strHeight, x, y) {
                let strArr = [];
                for (let i = 0, len = str.length / splitLen; i < len; i++) {
                    strArr.push(str.substring(i * splitLen, i * splitLen + splitLen));
                }
                let s = 0;
                for (let j = 0, len = strArr.length; j < len; j++) {
                    s = s + strHeight;
                    ctx.fillText(strArr[j], x, y + s);
                }
            },
            /* 保存图片 */
            saveImg() {
                wx.canvasToTempFilePath({
                    canvasId: 'myCanvas',
                    success: res => {
                        wx.saveImageToPhotosAlbum({
                            filePath: res.tempFilePath,
                            success: res => {
                                wx.showToast({
                                    title: '图片保存成功',
                                    icon: 'success',
                                    duration: 800
                                })
                                this.canvasMask = false;
                            },
                            fail: err => {
                                this.util.phModel();
                            }
                        })
                    }
                })
            },
            shopBuy() {
                wx.navigateTo({
                    url: '/pagesMoney/admin-shop-setmeal'
                })
            }
        },
    }
</script>

<style lang="less" scoped>
    .admin_index {
        height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        background: #efeef4;
        position: relative;
        .index_top {
            background: #3c59ee;
            height: 342rpx;
            padding: 0 30rpx;
            position: relative;
            .userInfo {
                height: 150rpx;
                .item {
                    display: flex;
                    width: 100%;
                    align-items: center;
                    .head {
                        width: 98rpx;
                        height: 98rpx;
                        border-radius: 50%;
                        border: 3rpx solid #648bef;
                        margin-right: 20rpx;
                        border-radius: 49rpx;
                        overflow: hidden;
                        background-color: #fff;
                        img {
                            width: 98rpx;
                            height: 98rpx;
                            border-radius: 49rpx;
                        }
                    }
                    .name {
                        flex: 1;
                        overflow: hidden;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .shop_name_left {
                            flex: 1;
                            p {
                                font-size: 42rpx;
                                color: #fff;
                                width: 90%;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                            .shop_date_info {
                                display: flex;
                                align-items: center;
                                justify-content: flex-start;
                                .is_vip {
                                    display: flex;
                                    align-items: center;
                                    height: 34rpx;
                                    background-color: #2541d2;
                                    width: 90rpx;
                                    padding: 0 10rpx;
                                    margin-right: 18rpx;
                                    i {
                                        margin-right: 10rpx;
                                    }
                                    span {
                                        font-size: 18rpx;
                                        color: #fff;
                                        line-height: 34rpx;
                                        white-space: nowrap;
                                    }
                                }
                                .last_date {
                                    font-size: 20rpx;
                                    line-height: 34rpx;
                                    white-space: nowrap;
                                    color: #a4b9ff;
                                }
                            }
                        }
                        .shop_time {
                            width: 200rpx;
                            height: 88rpx;
                            background-color: #2845db;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            .last {
                                padding-left: 36rpx;
                                color: #a4b9ff;
                                font-size: 18rpx;
                            }
                            .shop_buy {
                                padding-left: 36rpx;
                                display: flex;
                                justify-content: flex-start;
                                align-items: center;
                                font-size: 28rpx;
                                color: #fff442;
                            }
                        }
                    }
                }
                img.qr {
                    width: 44rpx;
                    height: 44rpx;
                }
            }
            .income {
                display: flex;
                padding: 47rpx 20rpx;
                background: #fff;
                .today_income,
                .complete_order {
                    width: 100%;
                    flex-flow: 1;
                    i.icon {
                        display: block;
                        margin: 0 auto 20rpx;
                    }
                    p {
                        font-size: 22rpx;
                        color: #c2c2c2;
                        text-align: center;
                    }
                    span {
                        display: block;
                        text-align: center;
                        font-size: 40rpx;
                        color: #1a1a1a;
                        font-weight: 700;
                        line-height: 46rpx;
                    }
                }
                .today_income {
                    position: relative;
                    &:after {
                        content: '';
                        display: block;
                        width: 0;
                        height: 78rpx;
                        position: absolute;
                        top: 40rpx;
                        right: 0;
                        border-right: 1px solid #ebebeb;
                        transform: scaleX(0.5);
                        transform-origin: 0 0;
                    }
                }
            }
            .index_info {
                display: flex;
                justify-content: space-around;
                align-items: center;
                border-bottom: 1rpx solid #e6e6e6;
                background: #fff;
                li {
                    color: #666;
                    font-size: 24rpx;
                    flex-flow: 1;
                    width: 100%;
                    text-align: center;
                    padding: 16rpx;
                }
                .li_select {
                    color: skyblue;
                }
            }
        }
        .main {
            margin-top: 80rpx;
            padding: 0 30rpx;
            box-sizing: border-box;
        }
        .platSum {
            overflow: hidden;
            padding-left: 30rpx;
            box-sizing: border-box;
            margin: 70rpx auto 20rpx;
            background: #fff;
            li {
                padding-right: 9rpx;
                height: 142rpx;
                position: relative;
                &:after {
                    content: '';
                    display: block;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 0;
                    border-bottom: 1PX solid #ebebeb;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                }
                &:last-child {
                    &::after {
                        display: none;
                    }
                }
                .item {
                    img {
                        width: 78rpx;
                        height: 78rpx;
                        margin-right: 20rpx;
                    }
                    .tit {
                        font-size: 28rpx;
                        color: #1a1a1a;
                        font-weight: 900;
                    }
                    .text {
                        margin-top: 8rpx;
                        font-size: 20rpx;
                        color: #999;
                    }
                }
                .look {
                    width: 160rpx;
                    height: 92rpx;
                    background: url('../../../static/look.png') no-repeat;
                    background-size: 100%;
                    line-height: 92rpx;
                    font-size: 22rpx;
                    color: #fff;
                    text-align: center;
                }
            }
        }
        .switch_group {
            background: #fff;
            margin-bottom: 20rpx;
            .switch_item {
                padding: 20rpx 0;
                margin: 0 30rpx;
                display: flex;
                align-items: center;
                justify-content: space-between;
                p {
                    color: #1a1a1a;
                    font-size: 28rpx;
                }
                .witch {
                    transform: scale(0.8);
                    margin-right: -20rpx;
                }
            }
            .tip {
                padding: 20rpx 0;
                margin: 0 20rpx;
                font-size: 22rpx;
                color: #999;
            }
        }
        .me_shop {
            padding: 30rpx;
            img {
                width: 100%;
                height: 300rpx;
                border-radius: 8rpx 8rpx 0 0;
            }
            .btn {
                background: skyblue;
                text-align: center;
                height: 80rpx;
                line-height: 80rpx;
                border-radius: 0 0 8rpx 8rpx;
                color: #fff;
                font-size: 30rpx;
            }
        }
    }
    .saveImg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        box-sizing: border-box;
        z-index: 50;
        .icon_close {
            position: absolute;
            top: 28rpx;
            right: 25rpx;
            z-index: 100;
            width: 46rpx;
            height: 46rpx;
        }
        .saveBtn {
            display: block;
            position: absolute;
            left: 50%;
            top: 919rpx;
            width: 586rpx;
            height: 96rpx;
            z-index: 100;
            transform: translateX(-50%);
        }
        .shareCover {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        .main_canvas {
            border-radius: 10rpx;
            background: #fff; //   height: 1044rpx;
            width: 339px;
            height: 522px;
            overflow: hidden;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            margin: auto;
            .title {
                padding: 30rpx 0;
                position: relative;
                img {
                    width: 42rpx;
                    height: 42rpx;
                    margin-right: 14rpx;
                }
                .namea {
                    font-size: 28rpx;
                    color: #010101;
                }
            }
            img.goodsImg {
                width: 618rpx;
                height: 618rpx;
                margin-bottom: 35rpx;
            }
            .ft {
                .info {
                    padding-top: 26rpx;
                    padding-right: 44rpx;
                    border-right: 1rpx solid #ebebeb;
                    .name {
                        font-size: 28rpx;
                        color: #000;
                    }
                    .detail {
                        font-size: 24rpx;
                        color: #777;
                    }
                }
                .qr {
                    width: 240rpx;
                    height: 240rpx;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
</style>
