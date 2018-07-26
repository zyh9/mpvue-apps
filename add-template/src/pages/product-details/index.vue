<template>
    <div class="product-details" v-if="block">
        <scroll-view scroll-y="true" style="height: 100%;padding:0  35rpx 110rpx;box-sizing:border-box;" lower-threshold="60" @scrolltolower="scrollHandler">
            <div class="shop_top">
                <img :src="goodsInfo.GoodMasterPic?goodsInfo.GoodMasterPic+'?x-oss-process=image/resize,w_1000/format,jpg':''" alt="" class="shop_img fade_in">
                <i class="icon icon_goodsShare" @click="share"></i>
            </div>
            <div class="info">
                <div class="name">{{goodsInfo.GoodName}}<span v-if="goodsInfo.GoodType==-1">{{goodsInfo.SpecName}}</span></div>
                <div class="price_sum set-flex set-between">
                    <div class="discount_shop" v-if="goodsInfo.GoodType==-1">
                        <p class="shop_price"><span>¥</span>{{goodsInfo.SalesPrice}}</p>
                        <p class="original_price">¥{{goodsInfo.OriginalPrice}}</p>
                    </div>
                    <p class="shop_price" v-else><span>¥</span>{{goodsInfo.SalesPrice?goodsInfo.SalesPrice:goodsInfo.OriginalPrice}}</p>
                    <div class="count" v-if="goodsInfo.State==1&&!isRule&&goodsInfo.RealStock>0">
                        <i class="icon icon_lower" @click="lower" v-if="goodsInfo.num>0" :data-info="goodsInfo"></i>
                        <span v-if="goodsInfo.num>0">{{goodsInfo.num}}</span>
                        <i class="icon icon_add" @click="add" :data-info="goodsInfo"></i>
                    </div>
                    <div class="select_rule" @click="format" v-if="goodsInfo.State==1&&isRule&&goodsInfo.List.length" :data-info="goodsInfo">选规格</div>
                    <p v-if="goodsInfo.State==3 ||(isRule&&!goodsInfo.List.length) ||(!isRule&&goodsInfo.RealStock<=0)" class="sold_out">已售罄</p>
                </div>
                <div class="good_type" v-if="goodsInfo.GoodType==-1&&goodsInfo.RealStock>0&&goodsInfo.RealStock<=10">仅剩{{goodsInfo.RealStock}}份</div>
                <div class="good_type" v-if="goodsInfo.GoodType!=-1&&!isRule&&goodsInfo.RealStock>0&&goodsInfo.RealStock<=10">仅剩{{goodsInfo.RealStock}}份</div>
                <div class="main">
                    <div class="introduction" v-if="goodsInfo.GoodBrief">
                        <div class="item">商品简介</div>
                        <div class="detail">{{goodsInfo.GoodBrief}}</div>
                    </div>
                    <div class="graphic" v-if="goodsInfo.GoodPics.length">
                        <div class="item">图文详情</div>
                        <div class="detail">
                            <img class="fade_in" v-for='(v,i) in goodsInfo.GoodPics' :key="i" :src="v?v+'?x-oss-process=image/resize,w_1000/format,jpg':''" mode="widthFix" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </scroll-view>
        <div class="go_index">
            <div class="go_index_text" @click="goIndex">
                <i class="icon icon_index"></i>
                <p>进入店铺首页结算</p>
            </div>
        </div>
        <!-- 分享方式 -->
        <div class="share_mask" v-if="isActive" @click="isActive = false"></div>
        <div class="share_card" :class="{share_card_active:isActive}">
            <div class="share_card_btn">
                <div class="btn_item">
                    <i class="icon icon_share_wx btn_img "></i>
                    <p>发给好友</p>
                    <button class="btn_send" plain="true" open-type="share"></button>
                </div>
                <div class="btn_item" @click='shareQR'>
                    <i class="icon icon_share_qr btn_img"></i>
                    <p>二维码分享</p>
                </div>
            </div>
            <div class="cancel" @click="isActive = false">取消</div>
        </div>
        <!-- 规格 -->
        <!-- 分享保存图片 -->
        <div class="saveImg" v-if='shareCard'>
            <div class="main">
                <canvas canvas-id='myCanvas' style="background:#fff;width: 100%;height: 100%;position:absolute;top:0;left:0;"> 
                                        <cover-view class="shareCover" >
                                        <cover-image  @click='shareClose' class="icon icon_close" src="https://otherfiles-ali.uupt.com/Stunner/FE/C/icon_close.png"/>
                                        <cover-image @click='saveImg' class="saveBtn" src="https://otherfiles-ali.uupt.com/Stunner/FE/C/saveImg.png"/>
                                        </cover-view>
                                                    </canvas>
            </div>
        </div>
        <div class="format_mask" @click="formatMask=false,formatLi = 0" v-if="formatMask">
        </div>
        <div class="format" v-if="formatMask">
            <div class="format_con">
                <p class="format_title">{{formatList.GoodName}}</p>
                <i class="icon icon_close_no_bg" @click="formatMask=false,formatLi = 0"></i>
                <div class="format_center">
                    <span class="format_info">规格</span>
                    <ul class="format_list">
                        <li v-for="(v,i) in formatList.GoodSpecs" :key="i" :class="{select_format_li:i==formatLi}" @click="formatCheck(i)" v-if="v.RealStock>0">{{v.SpecName}}</li>
                    </ul>
                </div>
                <div class="format_bot">
                    <p class="format_price"><span>¥</span>{{formatList.GoodSpecs[formatLi].OriginalPrice}}<i v-if="formatList.GoodSpecs[formatLi].RealStock>0&&formatList.GoodSpecs[formatLi].RealStock<=10">仅剩{{formatList.GoodSpecs[formatLi].RealStock}}份</i></p>
                    <div class="add_cart" @click="addCart"><span>+</span> 加入购物车</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import util from '../../utils/index';
    export default {
        data() {
            return {
                /* 分享弹窗 */
                isActive: false,
                /* 保存图片弹窗 */
                shareCard: false,
                /* 已添加商品列表 */
                cartListItem: [],
                /* 当前商品信息 */
                goodsInfo: {},
                formatLi: 0,
                formatMask: false, //规格弹窗
                formatList: [],
                QrCodeUrl: '',
                GoodId: '', //商品id
                ShopId: '', //店铺id
                scene: '', //二维码信息获取
                block: false,
                minShopLogo: '',
                minGoodsPic: ''
            }
        },
        onShareAppMessage(res) {
            return {
                title: this.goodsInfo.GoodName,
                path: `pages/product-details/main?ShopId=${this.$root.$mp.query.ShopId || this.ShopId}&GoodId=${this.$root.$mp.query.GoodId || this.GoodId}`,
                imageUrl: this.goodsInfo.GoodMasterPic,
                success: res => {
                    this.isActive = false;
                },
                fail: err => {
                    this.msg('您已取消分享')
                    this.isActive = false;
                }
            }
        },
        onLoad(options) {
            //options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
            this.scene = options.scene;
            wx.setStorageSync('scene', this.scene);
            this.block = false;
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            this.formatLi = 0;
            this.formatMask = false;
            this.formatList = [];
            this.minShopLogo = '';
            this.minGoodsPic = '';
            this.goodsInfo = {};
            if (this.$root.$mp.query.type == 1) {
                console.log('不走分享')
                this.getGoodsInfo()
            } else {
                console.log('走分享')
                this.util.qqMapInfo().then(res => {
                    if (this.scene) {
                        this.sceneInfo()
                    } else {
                        this.getGoodsInfo()
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        onShow() {
            this.shareCard = false;
            // 先获取缓存数据
            let cartListSum = wx.getStorageSync('cartListSum') || [];
            //再找到对应店铺
            let cartItem = cartListSum.filter(e => e.ShopId == wx.getStorageSync('shopInfo').ShopId);
            this.cartListItem = cartItem.length ? cartItem[0].cartList : [];
            // console.log(this.cartListItem, '进入子页面获取信息')
        },
        methods: {
            //二维码信息获取
            sceneInfo() {
                this.util.post({
                    url: '/api/Customer/Browse/GetSceneInfo',
                    data: {
                        Scene: this.scene
                    }
                }).then(res => {
                    this.GoodId = res.Body.GoodId;
                    this.ShopId = res.Body.ShopId;
                    wx.setStorageSync('ShopId', this.ShopId)
                    //获取商品信息
                    this.getGoodsInfo()
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            /* 分享，分享类型弹窗 */
            share() {
                this.isActive = true;
            },
            lower(e) {
                let {
                    info
                } = e.target.dataset;
                if (info.GoodSpecs.length == 1) {
                    this.goodsInfo.num = info.num;
                    this.goodsInfo.num--;
                    this.saveData(this.goodsInfo, wx.getStorageSync('shopInfo').ShopId)
                }
            },
            add(e) {
                let {
                    info
                } = e.target.dataset;
                // console.log(info)
                if (info.GoodType == -1) {
                    if (info.GoodSpecs[0].PriceOffRule.DiscountRule == 1) { //每人限一份
                        if (info.GoodSpecs[0].IsBuyed == 0) {
                            if (info.num == 1) {
                                this.msg('每人限1份的商品仅能购买一次')
                                return;
                            }
                            this.addFun(info)
                        } else { //已购买
                            this.msg('每人限1份的商品仅能购买一次')
                        }
                    } else { //每单限一份
                        if (info.num == 1) {
                            this.msg('每单仅享1份优惠价')
                        }
                        this.addFun(info)
                    }
                } else {
                    console.log('非折扣')
                    this.addFun(info)
                }
            },
            addFun(info) {
                if (info.GoodSpecs.length == 1) {
                    this.goodsInfo.num = info.num;
                    this.goodsInfo.num++;
                    this.saveData(this.goodsInfo, wx.getStorageSync('shopInfo').ShopId)
                }
            },
            //规格点击信息获取
            format(e) {
                let {
                    info
                } = e.target.dataset;
                info.GoodSpecs = info.GoodSpecs.filter(e=>e.RealStock>0);
                this.formatList = info;
                this.formatMask = true;
            },
            //选择规格
            formatCheck(i) {
                this.formatLi = i;
            },
            //规格加入购物车
            addCart() {
                //获取点击的规格和价格
                let info = this.formatList.GoodSpecs[this.formatLi];
                this.goodsInfo.GoodSpecs.forEach(e => {
                    if (e.Id == info.Id) {
                        info.num++;
                        e.num = info.num;
                    }
                })
                this.saveData(info, wx.getStorageSync('shopInfo').ShopId)
                //索引归0  遮罩隐藏
                this.formatLi = 0;
                this.formatMask = false;
                wx.showToast({
                    title: '添加购物车成功',
                    icon: 'success',
                    duration: 600
                })
            },
            saveData(info, ShopId) {
                // console.log(info, ShopId)
                // 先获取缓存数据
                let cartListSum = wx.getStorageSync('cartListSum') || [];
                if (cartListSum.length) {
                    //先获取到店铺的id
                    let cartItem = cartListSum.filter(e => e.ShopId == ShopId)
                    if (cartItem.length) {
                        // console.log('有此店铺')
                        // console.log(cartItem[0].cartList, '过滤')
                        if (info.MultiSpec == 0) { //无规格商品
                            // console.log(info, '无规格')
                            //返回info在列表的索引
                            let n = cartItem[0].cartList.findIndex(e => e.GoodId == info.GoodId)
                            // console.log(n, '存在索引')
                            //数据存在就赋值，不存在就push
                            if (n >= 0) {
                                // console.log('找到了')
                                cartItem[0].cartList.forEach(e => {
                                    if (e.GoodId == info.GoodId) {
                                        e.num = info.num;
                                    }
                                })
                            } else {
                                // console.log(cartItem[0].cartList, '没找到')
                                cartItem[0].cartList.push(info)
                            }
                        } else { //有规格商品
                            // console.log(info, '有规格')
                            //返回info在列表的索引
                            let n = cartItem[0].cartList.findIndex(e => e.Id == info.Id)
                            // console.log(n, '存在索引')
                            if (n >= 0) {
                                // console.log('找到了')
                                cartItem[0].cartList.forEach(e => {
                                    if (e.Id == info.Id) {
                                        e.num = info.num;
                                    }
                                })
                            } else {
                                // console.log(cartItem[0].cartList, '没找到')
                                cartItem[0].cartList.push(info)
                            }
                        }
                        //针对num等于0的数据仍保留做清空处理
                        this.cartListItem = cartItem[0].cartList.filter(e => e.num != 0)
                        // console.log(this.cartListItem)
                        //走设置
                        cartListSum.forEach(e => {
                            if (e.ShopId == ShopId) {
                                e.cartList = this.cartListItem;
                            }
                        })
                        //针对商品列表为空的店铺做清空处理
                        cartListSum = cartListSum.filter(e => e.cartList.length > 0);
                        // 再设置缓存数据
                        wx.setStorageSync('cartListSum', cartListSum);
                        //缓存length不存在，直接清除
                        !cartListSum.length && wx.removeStorageSync('cartListSum');
                    } else {
                        // console.log('查无此店铺')
                        cartListSum.push({
                            ShopId: ShopId,
                            cartList: [{
                                ...info
                            }]
                        })
                        wx.setStorageSync('cartListSum', cartListSum);
                        let cartItemInit = cartListSum.filter(e => e.ShopId == ShopId);
                        this.cartListItem = cartItemInit[0].cartList.filter(e => e.num != 0);
                    }
                } else {
                    //没有缓存，添加店铺id以及第一条数据
                    cartListSum.push({
                        ShopId: ShopId,
                        cartList: [{
                            ...info
                        }]
                    })
                    wx.setStorageSync('cartListSum', cartListSum);
                    let cartItemInit = cartListSum.filter(e => e.ShopId == ShopId);
                    this.cartListItem = cartItemInit[0].cartList.filter(e => e.num != 0);
                }
            },
            /* 分享二维码 */
            shareQR() {
                if (wx.getStorageSync('loginInfo').IsBindPhone == 0) {
                    this.msg('您还没有登录哦')
                    wx.redirectTo({
                        url: `/pages/login/main`
                    })
                    return;
                }
                this.isActive = false;
                /* 获取商品二维码 */
                wx.showLoading({
                    title: '生成中',
                    mask: true
                })
                this.util.post({
                    url: '/api/Customer/Common/CreateWxOpenQrCode',
                    data: {
                        CodeType: 1,
                        CodeValue: this.$store.state.mutations.qrcode || this.$root.$mp.query.GoodId || '', //对应的商品id
                        RequestType: 2
                    }
                }).then(res => {
                    this.QrCodeUrl = res.Body.QrCodeUrl;
                    // this.drawCanvas();
                    this.requireImg().catch(err => {
                        this.msg('图片地址获取失败')
                    })
                }).catch(err => {
                    this.msg(err.Msg)
                })
                /* 绘制分享图 */
                // this.drawCanvas();
            },
            async requireImg() {
                this.QrCodeUrl = await this.downImg(this.QrCodeUrl)
                this.minShopLogo = await this.downImg(this.goodsInfo.ShopLogo + '?x-oss-process=image/resize,h_50/rounded-corners,r_10')
                this.minGoodsPic = await this.downImg(this.goodsInfo.GoodMasterPic + '?x-oss-process=image/resize,h_400/rounded-corners,r_6/format,jpg');
                this.drawCanvas();
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
            /* 绘制canvas */
            drawCanvas() {
                let windowWidth = '';
                let windowHeight = '';
                wx.getSystemInfo({
                    success: res => {
                        windowWidth = res.windowWidth;
                        windowHeight = res.windowHeight;
                    }
                })
                // 屏幕系数比，以设计稿375*667（iphone7）为例
                let XS = windowWidth / 375;
                const ctx = wx.createCanvasContext('myCanvas');
                ctx.setFillStyle('#fff')
                ctx.fillRect(0, 0, 339 * XS, 522 * XS)
                /* 店铺logo图片 */
                ctx.drawImage(this.minShopLogo, 15 * XS, 15 * XS, 21 * XS, 21 * XS)
                /* 店铺名称  */
                ctx.setFontSize(14 * XS);
                ctx.setFillStyle('#010101')
                ctx.fillText(this.goodsInfo.ShopName, 43 * XS, 30 * XS)
                /* 商品图 */
                ctx.drawImage(this.minGoodsPic, 15 * XS, 51 * XS, 309 * XS, 309 * XS)
                /* 商品名 */
                ctx.setFontSize(14 * XS);
                ctx.setFillStyle('#000')
                this.fontLineFeed(ctx, this.goodsInfo.GoodName, 18 * XS, 18 * XS, 15 * XS, 389 * XS)
                /* 商品描述 */
                ctx.setFontSize(12 * XS);
                ctx.setFillStyle('#777')
                this.fontLineFeed(ctx, this.goodsInfo.GoodBrief, 12 * XS, 18 * XS, 15 * XS, 415 * XS)
                /* 二维码 */
                ctx.drawImage(this.QrCodeUrl, 205 * XS, 376 * XS, 121 * XS, 124 * XS)
                /* 线 */
                ctx.setLineWidth(0.5)
                ctx.setStrokeStyle('#ebebeb')
                ctx.lineTo(182 * XS, 390 * XS)
                ctx.lineTo(182 * XS, 490 * XS)
                ctx.stroke();
                ctx.draw()
                wx.hideLoading()
                this.shareCard = true;
            },
            shareClose() {
                this.shareCard = false;
                wx.hideLoading()
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
                            success(result) {
                                wx.showToast({
                                    title: '图片保存成功',
                                    icon: 'success',
                                    duration: 800
                                })
                            },
                            fail: err => {
                                console.log('商品详情保存相册取消')
                                this.util.phModel()
                            }
                        })
                    }
                })
            },
            /* 获取商品信息 */
            getGoodsInfo() {
                this.util.post({
                        url: '/api/Customer/Browse/GetGoodDetail',
                        data: {
                            ShopId: this.$root.$mp.query.ShopId || this.ShopId,
                            GoodId: this.$root.$mp.query.GoodId || this.GoodId
                        }
                    })
                    .then(res => {
                        if (res.State == 1) {
                            wx.hideLoading();
                            this.block = true;
                            wx.setNavigationBarTitle({
                                title: res.Body.GoodName ? res.Body.GoodName : '商品详情'
                            })
                            if (res.Body.GoodSpecs.length == 1) {
                                res.Body.num = this.$root.$mp.query.num ? this.$root.$mp.query.num : 0;
                                //无规格设置
                                res.Body.MultiSpec = 0;
                                res.Body.GoodsMasterPic = res.Body.ShopLogo;
                                res.Body.OriginalPrice = res.Body.GoodSpecs[0].OriginalPrice;
                                res.Body.IsBuyed = res.Body.GoodSpecs[0].IsBuyed;
                                res.Body.SalesPrice = res.Body.GoodSpecs[0].SalesPrice;
                                res.Body.SpecName = res.Body.GoodSpecs[0].SpecName == '默认' ? '' : ` - ${res.Body.GoodSpecs[0].SpecName}`;
                                res.Body.RealStock = res.Body.GoodSpecs[0].RealStock;
                            } else {
                                res.Body.GoodSpecs.forEach(item => {
                                    item.num = 0;
                                    if (this.cartListItem) {
                                        this.cartListItem.forEach(ele => {
                                            if (item.Id == ele.Id) {
                                                item.num = ele.num;
                                            }
                                        })
                                    } else {
                                        item.num = 0;
                                    }
                                    item.GoodId = res.Body.GoodId;
                                    item.GoodName = res.Body.GoodName;
                                    item.GoodsMasterPic = res.Body.GoodMasterPic;
                                    item.MultiSpec = 1;
                                })
                                res.Body.OriginalPrice = res.Body.GoodSpecs[0].OriginalPrice;
                                res.Body.SalesPrice = res.Body.GoodSpecs[0].SalesPrice;
                                res.Body.List = res.Body.GoodSpecs.filter(e => e.RealStock > 0)
                                // console.log(res.Body)
                            }
                            this.goodsInfo = res.Body;
                            console.log(this.goodsInfo)
                        }
                    }).catch(err => {
                        wx.hideLoading();
                        this.msg(err.Msg)
                    })
            },
            goIndex() {
                if (this.$root.$mp.query.type == 1) {
                    wx.navigateBack({
                        delta: 1
                    })
                } else {
                    wx.redirectTo({
                        url: `/pages/my-store/main?ShopId=${this.goodsInfo.ShopId}&back=1`
                    })
                }
            }
        },
        computed: {
            isRule: function() {
                return this.goodsInfo.GoodSpecs ? this.goodsInfo.GoodSpecs.length > 1 ? true : false : false;
            }
        },
        components: {}
    }
</script>

<style lang="less">
    .product-details {
        box-sizing: border-box;
        background: #fff;
        height: 100%;
        position: relative;
        overflow: hidden;
        padding-top: 10rpx;
        .shop_top {
            width: 678rpx;
            height: 678rpx;
            position: relative;
            border-radius: 36rpx;
            .shop_img {
                width: 100%;
                height: 100%;
                border-radius: 36rpx;
            }
            .icon {
                position: absolute;
                bottom: 20rpx;
                right: 20rpx;
            }
        }
        .info {
            padding: 50rpx 0 20rpx 0;
            overflow: hidden;
            .name {
                font-size: 36rpx;
                color: #000;
                line-height: 56rpx;
                font-weight: 900;
            }
            .price_sum {
                position: relative;
                .discount_shop {
                    display: flex;
                    .original_price {
                        font-size: 22rpx;
                        color: #ccc;
                        transform: translateY(10rpx);
                        margin-left: 12rpx;
                        position: relative;
                        display: flex;
                        align-items: center;
                        &:after {
                            content: '';
                            display: block;
                            width: 100%;
                            height: 0;
                            border-bottom: 1px solid #ccc;
                            position: absolute;
                            bottom: 50%;
                            left: 0;
                            transform: scale(1, 0.5);
                            transform-origin: 0 0;
                        }
                    }
                }
                .shop_price {
                    font-size: 48rpx;
                    color: #ff4d3a;
                    font-weight: 700;
                    display: inline-block;
                    span {
                        font-size: 24rpx;
                        display: inline-block;
                    }
                    i {
                        margin-left: 24rpx;
                        color: #939393;
                        font-size: 24rpx;
                        font-weight: normal;
                        display: inline-block;
                    }
                }
                .count {
                    display: flex;
                    align-items: center;
                    .lower,
                    .add {
                        width: 50rpx;
                        height: 50rpx;
                    }
                    span {
                        font-size: 24rpx;
                        color: #939393;
                        margin: 0 12rpx;
                    }
                }
                .select_rule {
                    position: absolute;
                    right: 27rpx;
                    bottom: 16rpx;
                    font-size: 24rpx;
                    color: #fff;
                    height: 42rpx;
                    line-height: 42rpx;
                    text-align: center;
                    padding: 0 20rpx;
                    border-radius: 25rpx;
                    background-image: linear-gradient(-22deg, #f21b30 0%, #ff693b 99%), linear-gradient( #ff2929, #ff2929);
                    box-shadow: 1rpx 2rpx 5rpx 0rpx rgba(177, 5, 5, 0.16);
                }
                .sold_out {
                    font-size: 24rpx;
                    color: #999;
                    transform: translateY(20rpx);
                }
            }
            .good_type {
                color: #939393;
                font-size: 24rpx;
                font-weight: normal;
                display: flex;
                align-items: center;
                margin-bottom: 30rpx;
            }
            .main {
                .introduction {
                    position: relative;
                    &:after {
                        content: '';
                        display: block;
                        width: 100%;
                        height: 0;
                        border-top: 1px solid #ebebeb;
                        position: absolute;
                        left: 0;
                        top: 0;
                        transform: scaleY(0.5);
                        transform-origin: 0 0;
                    }
                }
                .graphic {
                    position: relative;
                    &:after {
                        content: '';
                        display: block;
                        width: 100%;
                        height: 0;
                        border-top: 1px solid #ebebeb;
                        position: absolute;
                        left: 0;
                        top: 0;
                        transform: scaleY(0.5);
                        transform-origin: 0 0;
                    }
                }
                .item {
                    padding-top: 36rpx;
                    height: 70rpx;
                    line-height: 70rpx;
                    font-size: 28rpx;
                    font-weight: 900;
                    color: #000;
                }
                .detail {
                    padding-bottom: 36rpx;
                    line-height: 48rpx;
                    font-size: 26rpx;
                    color: #939393;
                    line-height: 48rpx;
                    img {
                        width: 100%;
                        margin: 20rpx auto 0;
                    }
                }
            }
        }
        .share_mask {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 10;
            transition: all 0.1s ease;
        }
        .share_card {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            background: #ccc;
            transform: translateY(100%);
            transition: transform 0.4s ease;
            z-index: 30;
            .share_card_btn {
                display: flex;
                align-items: center;
                justify-content: space-around;
                padding: 58rpx 30rpx 50rpx;
                box-sizing: border-box;
                background: #f0f0f0;
                .btn_item {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    .btn_img {
                        width: 96rpx;
                        height: 96rpx;
                        margin-bottom: 40rpx;
                    }
                    p {
                        color: #555555;
                        font-size: 28rpx;
                        text-align: center; // padding: 5rpx 0;
                        line-height: 28rpx;
                    }
                    .btn_send {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        border: none;
                    }
                }
            }
            .cancel {
                width: 100%;
                height: 96rpx;
                line-height: 96rpx;
                text-align: center;
                color: #555;
                font-size: 30rpx;
                background: #fff;
            }
        }
        .share_card_active {
            transform: translateY(0);
        }
        .saveImg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            padding: 10rpx 36rpx 140rpx;
            box-sizing: border-box;
            z-index: 50;
            .shareCover {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            .main {
                position: relative;
            }
            .icon_close {
                position: absolute;
                top: 25rpx;
                right: 25rpx;
                z-index: 100;
            }
            .saveBtn {
                position: absolute;
                top: 933rpx;
                left: 34rpx;
                width: 290rpx;
                height: 73rpx;
                z-index: 100;
            }
            .main {
                border-radius: 10rpx;
                background: #fff;
                width: 339px;
                height: 522px;
                overflow: hidden;
                position: fixed;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                margin: auto;
            }
        }
        .spec {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            padding: 10rpx 36rpx 140rpx;
            box-sizing: border-box;
            z-index: 50;
            padding: 300rpx 60rpx 0;
            .card {
                position: relative;
                .icon_close {
                    position: absolute;
                    top: 40rpx;
                    right: 66rpx;
                    z-index: 100;
                }
                width: 100%;
                background: #fff;
                padding: 36rpx;
                box-sizing: border-box;
                .title {
                    text-align: center;
                }
                .labels {
                    padding: 20rpx 0;
                    span {
                        display: inline-block;
                        padding: 5rpx 10rpx;
                        color: #1a1a1a;
                        background: #eee;
                        &.on {
                            background: #ff8b03;
                        }
                    }
                }
                .price {
                    border-top: 1rpx solid #000;
                    font-size: 48rpx;
                    color: #ff4d3a;
                    height: 62rpx;
                    margin-bottom: 25rpx;
                    span {
                        font-size: 24rpx;
                        color: #ff4d3a;
                    }
                    .count {
                        span {
                            font-size: 26rpx;
                            color: #939393;
                            display: inline-block;
                            vertical-align: middle;
                            padding: 0 10rpx;
                        }
                    }
                }
            }
            .submitSpec {
                text-align: center;
                background: #1a1a1a;
                line-height: 88rpx;
                color: #fff;
                font-size: 26rpx;
                border-radius: 10rpx;
            }
        }
    }
    .button-hover {
        background: transparent;
    }
    .history_active {
        transform: translateY(-100%);
    }
    .format_mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 10;
        transition: all 0.1s ease;
    }
    .format {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 0 35rpx;
        display: flex;
        box-sizing: border-box;
        .format_con {
            margin: auto;
            padding-top: 30rpx;
            background: #fff;
            border-radius: 6rpx;
            width: 100%;
            box-sizing: border-box;
            position: relative;
            z-index: 50;
            overflow: hidden;
            .format_title {
                text-align: center;
                color: #333;
                font-size: 36rpx;
                line-height: 52rpx;
                font-weight: 700;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 80%;
                margin: 0 auto;
            }
            .format_center {
                padding: 44rpx 32rpx;
                .format_info {
                    display: block;
                    color: #1a1a1a;
                    font-size: 28rpx;
                    margin-bottom: 32rpx;
                    line-height: 30rpx;
                }
                .format_list {
                    overflow: hidden;
                    li {
                        float: left;
                        color: #1a1a1a;
                        font-size: 24rpx;
                        margin-right: 24rpx;
                        margin-bottom: 20rpx;
                        background: #fff;
                        text-align: center;
                        position: relative;
                        line-height: 34rpx;
                        padding: 11rpx 20rpx;
                        max-width: 584rpx;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                        box-sizing: border-box;
                        border: 1rpx solid #ebebeb;
                    }
                    .select_format_li {
                        color: #ff4d3a;
                        background: #fff6f5;
                        border: 1rpx solid #fcd3cf;
                    }
                }
            }
            .format_bot {
                padding: 0 30rpx;
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: #f2f2f2;
                height: 100rpx;
                .format_price {
                    color: #ff4d3a;
                    font-size: 48rpx;
                    font-weight: 700;
                    display: inline-block;
                    span {
                        font-size: 32rpx;
                        margin-right: 10rpx;
                        display: inline-block;
                    }
                    i {
                        margin-left: 24rpx;
                        color: #939393;
                        font-size: 24rpx;
                        font-weight: normal;
                        display: inline-block;
                    }
                }
                .add_cart {
                    font-size: 24rpx;
                    color: #fff;
                    height: 50rpx;
                    line-height: 50rpx;
                    text-align: center;
                    padding: 0 20rpx;
                    border-radius: 25rpx;
                    background-image: linear-gradient(-22deg, #f21b30 0%, #ff693b 99%), linear-gradient( #ff2929, #ff2929); //   box-shadow: 2rpx 2rpx 8rpx 0rpx rgba(177, 5, 5, 0.7);
                    span {
                        font-weight: 700;
                        font-size: 28rpx;
                    }
                }
            }
        }
        .icon_close_no_bg {
            position: absolute;
            top: 32rpx;
            right: 32rpx;
        }
    }
    .go_index {
        height: 130rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translateY(-100%);
        padding: 0 36rpx;
        background: #fff;
        position: relative;
        .go_index_text {
            height: 86rpx;
            background: #1a1a1a;
            width: 100%;
            border-radius: 6rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            i {
                transform: translateY(-2rpx);
            }
            p {
                height: 86rpx;
                line-height: 86rpx;
                color: #fff;
                font-size: 30rpx;
                margin-left: 12rpx;
            }
        }
        &:after {
            content: '';
            display: block;
            width: 100%;
            height: 0;
            border-top: 1px solid #ebebeb;
            position: absolute;
            left: 0;
            top: 0;
            transform: scaleY(0.5);
            transform-origin: 0 0;
        }
    }
</style>
