<template>
    <div class="store" v-if="block">
        <div class="store_top_info" v-show="shopInfoList.Logo">
            <div class="store_banner">
                <img :src="shopInfoList.Logo?shopInfoList.Logo+'?x-oss-process=image/resize,w_200/format,jpg':''" alt="" class="shop_img fade_in">
                <div class="shop_right_details">
                    <p>简介：{{shopInfoList.ShopSummary?shopInfoList.ShopSummary:'欢迎光临本店，我们不定期会推出活动和优惠！'}}</p>
                    <p>{{time}}</p>
                    <div class="option" v-if="!shopInfoList.PaotuiPriceRule&&!CouponText">
                        <p>店主正在赶来的路上，关注店铺优惠马上就来！</p>
                    </div>
                    <div v-else @click='couponActive=true' class="offer_text">
                        <swiper class="offer_info" vertical="true" autoplay="true" interval="2000" circular="true">
                            <swiper-item v-if="shopInfoList.PaotuiPriceRule" class="swiper_item">
                                <div class="option"><i class="icon_set"></i><span class="coupon_text">{{shopInfoList.PaotuiPriceRule}}</span></div>
                            </swiper-item>
                            <swiper-item v-if="CouponText" class="swiper_item">
                                <div class="option"><i class="icon icon_coupon"></i><span class="coupon_text">{{CouponText}}</span></div>
                            </swiper-item>
                        </swiper>
                        <i class="icon_right_img"></i>
                    </div>
                </div>
            </div>
            <ul class="store_info">
                <li v-for="(v,i) in info" :key="i" :class="{li_select:i==currentTab}" :data-current="i" @click="swichNav"><span>{{v.name}}</span></li>
            </ul>
        </div>
        <swiper :current="currentTab" :style="{height: winHeight+'px'}" class="swiper-box" duration="300" @change="bindChange" v-show="shopInfoList.Logo">
            <swiper-item class="swiper-item">
                <div class="store_index">
                    <div class="store_index_list">
                        <scroll-view scroll-y="true" style="height: 100%" class="scroll_left">
                            <div v-for="(v,i) in allShopInfoList" :key="i" class="list_item_l" :data-id="i" @click="checked(v,i)" :class="{left_select:i==selected}">
                                <i class="icon_discount" v-if="v.ID==-1"></i>{{v.Name}}
                                <i class="left_num" v-if="v.sum>0||v.sum=='99+'">{{v.sum}}</i>
                            </div>
                        </scroll-view>
                        <div class="right_con">
                            <scroll-view v-for="(item,index) in allShopInfoList" :key="index" v-if="selected==index" scroll-y="true" style="height: 100%" class="scroll_right">
                                <!-- <p class="no_shop" v-if="!item.length">此分类暂无商品信息哦</p> -->
                                <div class="list_item_r" v-if="item.GoodsInfo.length" v-for="(v,i) in item.GoodsInfo" :key="i">
                                    <div class="lis_item_left" @click="goGoodsDetail(v)">
                                        <img :src="v.GoodsMasterPic?v.GoodsMasterPic+'?x-oss-process=image/resize,w_200/format,jpg':''" alt="" class="shop_lis_img fade_in" lazy-load="true">
                                        <div class="shop_lis_mask" v-if="v.State==3||(v.MultiSpec==0&&v.RealStock<=0)||(v.MultiSpec==1&&!v.List.length)">已售罄</div>
                                        <div class="li_info">
                                            <p class="shop_name">{{v.GoodName}}<span v-if="v.GoodsType==-1">{{v.SpecName}}</span></p>
                                            <div class="discount"><span v-if="v.GoodsType==-1" class="price_tips">{{v.PriceOffNote}}</span><span v-if="v.MultiSpec==0&&v.RealStock>0&&v.RealStock<=10">仅剩{{v.RealStock}}份</span></div>
                                            <div class="discount_shop" v-if="v.GoodsType==-1">
                                                <p class="price"><span>¥</span>{{v.SalesPrice}}</p>
                                                <p class="original_price">¥{{v.OriginalPrice}}</p>
                                            </div>
                                            <p class="price_init" v-else><span>¥</span>{{v.SalesPrice?v.SalesPrice:v.OriginalPrice}}</p>
                                        </div>
                                    </div>
                                    <div class="count" v-if="OpenState &&(v.MultiSpec==0&&v.State==1)&&v.RealStock>0">
                                        <i class="icon icon_lower" @click="lower($event)" :data-info="v" v-if="v.num>0"></i>
                                        <span v-if="v.num>0">{{v.num}}</span>
                                        <i class="icon icon_add" @click="add($event)" :data-info="v"></i>
                                    </div>
                                    <div class="select_rule" v-if="OpenState &&(v.MultiSpec==1&&v.State==1)&&v.List.length" :data-info="v" @click="format($event)">选规格</div>
                                    <!-- <p v-if="v.State==3" class="sold_out">已售罄</p> -->
                                    <div class="shop_mask_state" v-if="!OpenState" @click="shopOpenState"></div>
                                </div>
                            </scroll-view>
                        </div>
                        <div class="no_shop_tips" v-if="noShop">
                            <div class="no_shop_con">
                                <div class="no_shop_bg"></div>
                                <p>此店铺暂无上传商品</p>
                            </div>
                        </div>
                    </div>
                </div>
            </swiper-item>
            <swiper-item class="swiper-item">
                <div class="shop_details">
                    <div class="options options_bor">
                        <div class="label">店铺地址</div>
                        <div class="item">{{addressShopInfo}}</div>
                    </div>
                    <div class="options options_bor">
                        <div class="label">配送服务</div>
                        <div class="item">由商家指定配送服务(UU跑腿/快递)</div>
                    </div>
                    <div class="options" style="border:none">
                        <div class="label">营业时间</div>
                        <div class="item">{{timeInfo}}</div>
                    </div>
                    <div class="shop_info_list">
                        <div class="shop_tel" @click="tel">
                            <i class="icon icon_shop_tel icon_info"></i>
                            <p>商家电话</p>
                        </div>
                        <div class="shop_wx" @click="copyWx">
                            <i class="icon icon_shop_wx icon_info"></i>
                            <p>商家微信</p>
                        </div>
                    </div>
                    <div class="shop_share_btn">
                        <div class="shop_share_btn_body">
                            <p>感觉店内东东不错，告诉小伙伴吧！</p>
                            <div class="share_friend" @click="share">
                                <span>分享给好友</span>
                                <i class="icon double_arrow"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </swiper-item>
            <swiper-item class="swiper-item">
                <div class="user_info_right">
                    <div class="options" @click="order">
                        <i class="icon icon_userOrder"></i>
                        <p>我的订单</p>
                    </div>
                    <div class="options" @click="address">
                        <i class="icon icon_userAddress"></i>
                        <p>我的地址</p>
                    </div>
                    <div class="options" @click="goCoupon">
                        <i class="icon icon_offer"></i>
                        <p>我的优惠券</p>
                    </div>
                </div>
            </swiper-item>
        </swiper>
        <div class="cart_mask" v-if="cartActive||couponActive" @click="cartActive = false,couponActive=false"></div>
        <div class="shop_cart" v-if="currentTab==0">
            <div class="cart_left" @click="blockCart">
                <div class="cart_img">
                    <i class="icon icon_cart cart_img" v-if="number==0"></i>
                    <i class="icon icon_active cart_img" v-if="number>0||number=='99+'"></i>
                    <i v-if="cartListItem.length" class="number">{{number}}</i>
                </div>
                <p class="money" v-if="OpenState">¥ {{count}}</p>
            </div>
            <div class="cart_right">
                <span class="no_num" v-if="OpenState&&!cartListItem.length">快去挑选商品吧</span>
                <span class="no_operate" v-if="!OpenState">已打烊</span>
                <div v-if="OpenState&&cartListItem.length" class="settlement" @click="settlement">结算</div>
            </div>
        </div>
        <div class="couponList" :class="{couponList_active:couponActive}">
            <div class="top">
                <h2 class="title">亲！店里有优惠送您</h2>
                <p>赶快领取使用吧</p>
            </div>
            <div class="coupon">
                <div v-if='couponList.length'>
                    <div class="title_text">
                        <i class="icon icon_coupon"></i>
                        <span>优惠券</span>
                    </div>
                    <ul class="list">
                        <li v-for='(v,i) in couponList' :key='i' :class="'couponStatus'+v.Status" @click='receiveCoupon(v)'>
                            <p>满{{v.MinimumAmount}}元减</p>
                            <div class="money"><span class="number">{{v.Amount}}</span><span>元</span></div>
                        </li>
                    </ul>
                    <div class="tip">优惠券规则：商品费与打包费达到满减额度方能使用优惠券，部分优惠券无法与折扣商品共同使用。</div>
                </div>
                <div v-if="shopInfoList.PaotuiPriceRule">
                    <div class="title_text">
                        <i class="icon icon_set"></i><span>满减</span>
                    </div>
                    <div class="text">{{shopInfoList.PaotuiPriceRule}}</div>
                    <div class="tip">配送费满减规则：商品费与打包费达到满减额度方能使用配送费满减，配送费满减不与其他任何活动冲突，可直接享受。</div>
                </div>
            </div>
            <div class="close" @click='couponActive=false'>关闭</div>
        </div>
        <div class="cartListSum" v-if="cartListItem.length&&currentTab==0" :class="{cartListSum_active:cartActive}">
            <div class="shop_rule">
                <p class="pack_price">已选商品</p>
                <p class="clear" @click="clearCart"><i class="icon icon_clear"></i><span>清空</span></p>
            </div>
            <ul class="shop_list">
                <li class="lis" v-for="(v,i) in cartListItem" :key="i" v-if="v.num>0">
                    <div class="set-grow left">
                        <p class="shop_list_name">{{v.GoodName}}</p>
                        <span v-if='v.SpecName&&v.MultiSpec==1'>{{v.SpecName}}</span>
                    </div>
                    <div class="right set-flex set-between">
                        <p class="shop_list_price"><i class="icon_discount_text" v-if="v.GoodsType==-1"></i>¥{{v.sumPrice}}</p>
                        <div class="count">
                            <i class="icon icon_lower" @click="lower($event)" :data-info="v" v-if="v.num>0"></i>
                            <span v-if="v.num>0">{{v.num}}</span>
                            <i class="icon icon_add" @click="add($event)" :data-info="v"></i>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="share_mask" v-if="maskActive" @click="maskActive = false"></div>
        <div class="share_card" :class="{share_card_active:maskActive}">
            <div class="share_card_btn">
                <div class="btn_item">
                    <i class="icon icon_share_wx btn_img "></i>
                    <p>发给好友</p>
                    <button class="btn_send" plain="true" open-type="share"></button>
                </div>
                <div class="btn_item" @click="shareQR">
                    <i class="icon icon_share_qr btn_img"></i>
                    <p>二维码分享</p>
                </div>
            </div>
            <div class="cancel" @click="maskActive = false">取消</div>
        </div>
        <div class="saveImg" v-if='shareCard'>
            <div class="main">
                <canvas canvas-id='myCanvas' style="background:#fff;width: 100%;height: 100%;"> 
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
                        <li v-for="(v,i) in formatList.GoodsSpec" :key="i" :class="{select_format_li:i==formatLi}" @click="formatCheck(i)" v-if="v.RealStock>0">{{v.SpecName}}</li>
                    </ul>
                </div>
                <div class="format_bot">
                    <p class="format_price"><span>¥</span>{{formatList.GoodsSpec[formatLi].OriginalPrice}}<i v-if="formatList.GoodsSpec[formatLi].RealStock>0&&formatList.GoodsSpec[formatLi].RealStock<=10">仅剩{{formatList.GoodsSpec[formatLi].RealStock}}份</i></p>
                    <div class="add_cart" @click="addCart"><span>+</span> 加入购物车</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                info: [{
                    name: '商品'
                }, {
                    name: '店铺'
                }, {
                    name: '我的'
                }],
                winWidth: 0,
                winHeight: 0,
                currentTab: 0, // tab切换
                maskActive: false, //分享mask
                shareCard: false, //分享图片
                shopInfoList: {
                    ShopName: ''
                }, //店铺信息
                sumList: [], //商品总和
                selected: 0, //默认显示第一个分类
                cartActive: false, //购物车mask
                allShopInfoList: [], //所有商品分类
                shopPageListSum: [], //右侧商品大集合
                shopPageIndex: [], //右侧商品page汇总
                formatMask: false, //选择规格mask
                formatList: [], //规格列表
                formatLi: 0, //默认选择第一个规格
                code: '', //微信code
                time: '', //营业时间
                timeInfo: '',
                itemId: -1, //左侧分类列表id
                QrCodeUrl: '', //小程序码
                shareBg: '',
                ShopId: '', //店铺id
                GoodId: '', //商品id
                scene: '', //二维码信息获取
                cartListItem: [], //店铺商品缓存列表
                noShop: false, //店铺是否有商品
                block: false,
                Logo: 'https://otherfiles-ali.uupt.com/Stunner/logo-C-R.png?x-oss-process=image/resize,w_100/format,jpg',
                minShopLogo: '',
                couponActive: false,
                couponList: [],
                //优惠券文字
                CouponText: '',
            }
        },
        onShareAppMessage(res) {
            return {
                title: this.shopInfoList.ShopName,
                path: `pages/my-store/main?ShopId=${this.ShopId}`,
                imageUrl: this.shopInfoList.Logo,
                success: res => {
                    this.maskActive = false;
                },
                fail: err => {
                    this.msg('您已取消分享')
                    this.maskActive = false;
                }
            }
        },
        onLoad(options) {
            this.scene = options.scene;
            wx.setStorageSync('scene', this.scene);
            this.ShopId = this.$root.$mp.query.ShopId;
            // console.log(this.ShopId)
            this.currentTab = 0;
            this.block = false;
            wx.showLoading({
                title: '加载中',
                mask: true
            })
        },
        onReady() { //进入页面触发，回退不触发
            this.currentTab = 0;
            this.shopPageListSum = [];
            this.allShopInfoList = [];
            this.sumList = [];
            this.cartListItem = [];
            this.selected = 0;
            this.formatLi = 0;
            this.shopInfoList = {
                ShopName: ''
            };
            this.noShop = false;
            this.shareCard = false;
            this.cartActive = false;
            this.maskActive = false;
            this.formatMask = false;
            this.minShopLogo = '';
            //优惠券列表
            this.couponList = [];
            if (this.$root.$mp.query.type == 1 || this.$root.$mp.query.back == 1) {
                console.log('不走分享')
                // 获取店铺信息以及商品信息 catch用来捕获异常
                this.shopInfoSum().catch(err => {
                    console.log(err)
                    wx.hideLoading();
                    this.msg(err.Msg)
                    setTimeout(_ => {
                        wx.switchTab({
                            url: '/pages/nearby-shop/main'
                        })
                    }, 1000)
                })
            } else {
                console.log('走分享')
                this.util.qqMapInfo().then(res => {
                    //分享有参数，才去解析
                    if (this.scene) {
                        this.sceneInfo()
                    } else {
                        this.shopInfoSum().catch(err => {
                            wx.hideLoading();
                            this.msg(err.Msg)
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        onShow() { //页面渲染就会触发
            this.shareCard = false;
            console.log(this.$store.state.mutations.backIndex ? '存在不可结算商品' : '正常进入店铺')
            if (this.$store.state.mutations.backIndex) {
                this.currentTab = 0;
                this.shopPageListSum = [];
                this.allShopInfoList = [];
                this.sumList = [];
                this.cartListItem = [];
                this.selected = 0;
                this.formatLi = 0;
                this.shopInfoList = {
                    ShopName: ''
                };
                this.noShop = false;
                this.shareCard = false;
                this.cartActive = false;
                this.maskActive = false;
                this.formatMask = false;
                this.minShopLogo = '';
                //优惠券列表
                this.couponList = [];
                this.shopInfoSum().catch(err => {
                    wx.hideLoading();
                    this.msg(err.Msg)
                })
            }
            this.couponActive = false;
            this.cartActive = false;
            // 先获取缓存数据
            let cartListSum = wx.getStorageSync('cartListSum') || [];
            //再找到对应店铺
            let cartItem = cartListSum.filter(e => e.ShopId == wx.getStorageSync('shopInfo').ShopId);
            this.cartListItem = cartItem.length ? cartItem[0].cartList : [];
            this.cartListItem = this.cartListItem.filter(e => e.num != 0);
            //针对店铺商品购买成功之后商品数量重置
            if (!this.cartListItem.length) {
                this.sumList.forEach(item => {
                    if (item.MultiSpec == 1) {
                        item.GoodsSpec.forEach(ele => {
                            ele.num = 0;
                            ele.sumPrice = 0;
                        })
                    } else {
                        item.num = 0;
                        item.sumPrice = 0;
                    }
                })
                // this.shopPageListSum.forEach(item => {
                //     item.forEach(e => {
                //         if (e.MultiSpec == 1) {
                //             e.GoodsSpec.forEach(ele => {
                //                 ele.num = 0;
                //             })
                //         } else {
                //             e.num = 0;
                //         }
                //     })
                // })
                //清空列表数量
                this.allShopInfoList.forEach(e => {
                    e.sum = 0;
                })
            }
            //当前店铺购物车的列表不为空走缓存，反之过滤设置缓存（主要针对购物车无商品且缓存中仍存在商品数量为零的情况）
            this.cartListItem.length ? this.cache() : (cartListSum = cartListSum.filter(e => e.ShopId != wx.getStorageSync('shopInfo').ShopId))
            // 再设置缓存数据
            wx.setStorageSync('cartListSum', cartListSum);
            //缓存length不存在，直接清除
            !cartListSum.length && wx.removeStorageSync('cartListSum');
        },
        methods: {
            //二维码信息获取
            sceneInfo() {
                this.util.post({
                    url: '/api/Customer/Browse/GetSceneInfo',
                    data: {
                        Scene: this.scene || ''
                    }
                }).then(res => {
                    this.GoodId = res.Body.GoodId;
                    this.ShopId = res.Body.ShopId;
                    this.$store.dispatch('code', this.scene)
                    //获取店铺信息以及商品信息 catch用来捕获异常
                    this.shopInfoSum().catch(err => {
                        wx.hideLoading();
                        this.msg(err.Msg)
                    })
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            async shopInfoSum() {
                //店铺信息
                let shopInfo = await this.shopInfo()
                shopInfo.Body.Logo = shopInfo.Body.Logo;
                wx.setNavigationBarTitle({
                    title: shopInfo.Body.ShopName ? shopInfo.Body.ShopName : '店铺详情'
                })
                this.shopInfoList = shopInfo.Body;
                // console.log(this.shopInfoList.ShopTemplateId, '1 餐饮 2 电商')
                wx.setStorageSync('shopInfo', this.shopInfoList)
                // this.time = '营业时间：' + String(this.util.openTime(shopInfo.Body.OpenTime))
                this.time = '营业时间：' + String(this.util.openTime(shopInfo.Body.OpenTime)[0])
                this.timeInfo = String(this.util.openTime(shopInfo.Body.OpenTime));
                // this.time = '营业时间：' + String(this.util.openTime('0-140,180-300'))
                if (this.shopInfoList.OpenState == 0) { //店铺未营业
                    console.log('店铺未营业')
                    this.cartListItem = [];
                }
                // console.log(this.shopInfoList.PaotuiPriceRule)
                let getCouponSum = await this.getCoupon();
                let getCouponText = getCouponSum.Body.map(e => {
                    return `满${e.MinimumAmount}元减${e.Amount}元；`;
                })
                this.CouponText = getCouponText.join('').slice(0, -1);
                // console.log(this.CouponText)
                this.couponList = getCouponSum.Body;
                //获取所有商品以及分类
                let allShopInfo = await this.allShopInfo()
                //所有商品汇集  针对左侧列表返回商品为空的作清空处理
                this.allShopInfoList = allShopInfo.Body.filter(e => e.GoodsInfo.length);
                // console.log(this.allShopInfoList)
                if (!this.allShopInfoList.length) this.noShop = true;
                this.allShopInfoList.forEach(e => {
                    e.GoodsInfo.forEach(item => {
                        if (item.MultiSpec == 1) {
                            item.GoodsSpec.forEach(ele => {
                                ele.num = 0;
                                ele.GoodId = item.GoodId;
                                ele.GoodName = item.GoodName;
                                ele.GoodsMasterPic = item.GoodsMasterPic;
                                ele.State = item.State;
                                ele.sumPrice = 0;
                                ele.MultiSpec = 1;
                            })
                            //多规格判断是否已售罄
                            item.List = item.GoodsSpec.filter(e => e.RealStock > 0);
                        } else {
                            item.num = 0;
                            item.sumPrice = 0;
                            item.SpecName = item.GoodsSpec[0].SpecName == '默认' ? '' : item.GoodsSpec[0].SpecName == "" ? '' : ` - ${item.GoodsSpec[0].SpecName}`;
                            //规格编号  抓过来的数据单个规格数据没有
                            item.Id = item.GoodsSpec[0].Id;
                            item.RealStock = item.GoodsSpec[0].RealStock;
                        }
                        this.sumList.push(item)
                    })
                    //单项分类设置页面索引以及终止状态
                    // this.shopPageIndex.push({
                    //     page: 1,
                    //     quest: true
                    // })
                    // this.shopPageListSum.push([])
                })
                wx.hideLoading()
                this.block = true;
                this.$store.dispatch('backIndex', false)
                if (this.shopInfoList.OpenState == 1) { //店铺营业走缓存
                    // 先获取缓存数据
                    let cartListSum = wx.getStorageSync('cartListSum') || [];
                    //再找到对应店铺
                    let cartItem = cartListSum.filter(e => e.ShopId == wx.getStorageSync('shopInfo').ShopId);
                    this.cartListItem = cartItem.length ? cartItem[0].cartList : [];
                    this.cartListItem = this.cartListItem.filter(e => e.num != 0);
                    //当前店铺购物车的列表不为空走缓存，反之过滤设置缓存（主要针对购物车无商品且缓存中仍存在商品数量为零的情况）
                    this.cartListItem.length ? this.cache() : (cartListSum = cartListSum.filter(e => e.ShopId != wx.getStorageSync('shopInfo').ShopId))
                    // 再设置缓存数据
                    wx.setStorageSync('cartListSum', cartListSum);
                    //缓存length不存在，直接清除
                    !cartListSum.length && wx.removeStorageSync('cartListSum');
                }
                return;
                // console.log(this.shopPageIndex)
                //获取分类以及分页
                this.allShopInfoList.length && this.shopPageInfo(this.allShopInfoList[0].ID);
            },
            //店铺信息
            shopInfo() {
                return this.util.post({
                    url: '/api/Customer/Browse/GetShopInfo',
                    data: {
                        //分享二维码获取  商品详情获取 this.ShopId || wx.getStorageSync('ShopId')
                        shopId: this.ShopId || String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
                    }
                })
            },
            //全部商品信息
            allShopInfo() {
                return this.util.post({
                    url: '/api/Customer/Browse/GetShopAllGoods',
                    data: {
                        shopId: this.ShopId || String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
                    }
                })
            },
            // scrollHandler(select) {
            //     if (this.shopPageIndex[select].quest) {
            //         //单项的page++
            //         this.shopPageIndex[select].page++;
            //         console.log('加载至' + this.shopPageIndex[select].page)
            //         this.shopPageInfo(this.itemId, select, this.shopPageIndex[select])
            //     } else {
            //         // this.msg('已经没有更多商品了')
            //     }
            // },
            //切换左侧类别
            checked(item, index) {
                if (this.selected == index) return;
                // this.itemId = item.ID;
                // //没有请求数据列表的才会请求
                // // if (typeof(this.shopPageListSum[index]) == 'undefined') {
                // if (!this.shopPageListSum[index].length) {
                //     this.shopPageInfo(this.itemId, index)
                // }
                this.selected = index;
            },
            //单项分类商品信息获取  index默认为0  select={}
            shopPageInfo(id, index = 0, select = {
                page: 1,
                quest: true
            }) {
                return this.util.post({
                        url: '/api/Customer/Browse/GetShopGoods',
                        data: {
                            shopId: this.ShopId || String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
                            GoodType: id,
                            PageSize: 10,
                            PageIndex: select.page
                        }
                    })
                    .then(res => {
                        res.Body.forEach(e => {
                            if (e.MultiSpec == 1) {
                                e.GoodsSpec.forEach(item => {
                                    item.num = 0;
                                    item.GoodId = e.GoodId;
                                    item.GoodName = e.GoodName;
                                    item.GoodsMasterPic = e.GoodsMasterPic;
                                    item.State = e.State;
                                    item.sumPrice = 0;
                                })
                            } else {
                                e.num = 0;
                                e.sumPrice = 0;
                                e.SpecName = e.GoodsSpec[0].SpecName == '默认' ? '' : ` - ${e.GoodsSpec[0].SpecName}`;
                            }
                        })
                        if (res.Body.length < 10) {
                            if (select.page > 1) { //页面大于1
                                this.shopPageIndex[index].quest = false;
                                // this.msg('已经没有更多商品了')
                            } else { //页面小于1
                                this.shopPageIndex[index].quest = false;
                            }
                        }
                        this.shopPageListSum[index].push(...res.Body);
                        //右侧单项索引设置
                        // console.log(this.shopPageListSum, '总集合')
                        if (this.shopInfoList.OpenState == 1) { //店铺营业走缓存
                            // 先获取缓存数据
                            let cartListSum = wx.getStorageSync('cartListSum') || [];
                            //再找到对应店铺
                            let cartItem = cartListSum.filter(e => e.ShopId == wx.getStorageSync('shopInfo').ShopId);
                            this.cartListItem = cartItem.length ? cartItem[0].cartList : [];
                            this.cartListItem = this.cartListItem.filter(e => e.num != 0);
                            //当前店铺购物车的列表不为空走缓存，反之过滤设置缓存（主要针对购物车无商品且缓存中仍存在商品数量为零的情况）
                            this.cartListItem.length ? this.cache() : (cartListSum = cartListSum.filter(e => e.ShopId != wx.getStorageSync('shopInfo').ShopId))
                            // 再设置缓存数据
                            wx.setStorageSync('cartListSum', cartListSum);
                            //缓存length不存在，直接清除
                            !cartListSum.length && wx.removeStorageSync('cartListSum');
                        }
                    }).catch(err => {
                        // this.msg(err.Msg)
                        // console.log(err)
                    })
            },
            //规格点击信息获取
            format(e) {
                let {
                    info
                } = e.target.dataset;
                info.GoodsSpec = info.GoodsSpec.filter(e => e.RealStock > 0);
                // console.log(info)
                this.formatList = info;
                this.formatMask = true;
            },
            //滑动切换
            bindChange(e) {
                this.currentTab = e.target.current;
            },
            //点击tab切换 
            swichNav(e) {
                if (this.currentTab === e.currentTarget.dataset.current) return;
                this.currentTab = e.currentTarget.dataset.current;
            },
            share() {
                this.maskActive = true;
            },
            shareQR() {
                if (wx.getStorageSync('loginInfo').IsBindPhone == 0) {
                    this.msg('您还没有登录哦')
                    wx.redirectTo({
                        url: `/pages/login/main`
                    })
                    return;
                }
                this.maskActive = false; //底部分享按钮
                wx.showLoading({
                    title: '生成中',
                    mask: true
                })
                this.util.post({
                    url: '/api/Customer/Common/CreateWxOpenQrCode',
                    data: {
                        CodeType: 2,
                        CodeValue: String(wx.getStorageSync('shopInfo').ShopId) || '',
                        RequestType: 2
                    }
                }).then(res => {
                    this.QrCodeUrl = res.Body.QrCodeUrl;
                    // Promise.all([this.downImg(this.QrCodeUrl),
                    //     this.downImg(this.Logo),
                    //     this.downImg(this.shopInfoList.Logo),
                    //     this.downImg('https://otherfiles-ali.uupt.com/Stunner/FE/C/shareCard.png')
                    // ]).then(res=>{
                    //     console.log(res,111)
                    // }).catch(err=>{
                    //     console.log(err,222)
                    // })
                    this.requireImg().catch(err => {
                        this.msg('图片地址获取失败')
                    })
                }).catch(err => {
                    this.msg(err.Msg)
                })
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
                this.QrCodeUrl = await this.downImg(this.QrCodeUrl)
                this.Logo = await this.downImg(this.Logo)
                this.minShopLogo = await this.downImg(this.shopInfoList.Logo + '?x-oss-process=image/resize,h_50/rounded-corners,r_10');
                this.shareBg = await this.downImg('https://otherfiles-ali.uupt.com/Stunner/FE/C/shareCard.png?x-oss-process=image/resize,w_500/format,jpg');
                this.drawCanvas();
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
                // ctx.setFillStyle('#f1f1f1')
                ctx.fillRect(0, 0, 339 * XS, 522 * XS)
                /* 背景图 */
                ctx.drawImage(this.shareBg, 0 * XS, 0 * XS, 339 * XS, 522 * XS)
                /* 小程序logo */
                ctx.drawImage(this.Logo, 13 * XS, 12 * XS, 34 * XS, 34 * XS)
                ctx.setFontSize(13 * XS);
                ctx.setFillStyle('#1a1a1a')
                ctx.fillText('足不出户 随意享购全城店铺', 55 * XS, 32 * XS);
                /* 店铺logo图片 */
                ctx.drawImage(this.minShopLogo, 160 * XS, 400 * XS, 20 * XS, 20 * XS)
                /* 二维码 */
                ctx.drawImage(this.QrCodeUrl, 77 * XS, 197 * XS, 185 * XS, 185 * XS)
                /* 店铺名字 */
                ctx.setFontSize(20 * XS);
                ctx.setFillStyle('#333')
                ctx.setTextAlign('center');
                this.fontLineFeed(ctx, this.shopInfoList.ShopName, 18 * XS, 18 * XS, 175 * XS, 428 * XS)
                ctx.draw()
                wx.hideLoading()
                this.shareCard = true; //分享图展示
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
                            success: res => {
                                wx.showToast({
                                    title: '图片保存成功',
                                    icon: 'success',
                                    duration: 800
                                })
                                this.shareCard = false;
                            },
                            fail: err => {
                                console.log('店铺保存相册取消')
                                this.util.phModel()
                            }
                        })
                    }
                })
            },
            tel() {
                wx.makePhoneCall({
                    phoneNumber: this.shopInfoList.ShopMobile
                })
            },
            copyWx() {
                if (this.shopInfoList.ShopWechat == "") {
                    this.msg('商家未提供微信联系方式')
                } else {
                    wx.setClipboardData({
                        data: this.shopInfoList.ShopWechat,
                        success: res => {
                            this.msg("复制成功")
                        },
                        fail: err => {
                            this.msg("复制失败")
                        }
                    })
                }
            },
            lower(e) {
                let {
                    info
                } = e.target.dataset;
                // console.log(info)
                if (info.MultiSpec == 0) {
                    if (info.GoodsType == -1) { //折扣商品
                        if (info.PriceOffRule.DiscountRule == 1) { //购买规格  每人限一份
                            console.log('每人限一份')
                        } else { //每单限一份
                            console.log('每单限一份')
                        }
                    }
                    // this.shopPageListSum.forEach(item => {
                    //     item.forEach(ele => {
                    //         if (ele.GoodId == info.GoodId) {
                    //             ele.num = info.num;
                    //             ele.num--;
                    //         }
                    //     })
                    // })
                    this.sumList.forEach(ele => {
                        if (ele.GoodId == info.GoodId) {
                            ele.num = info.num;
                            ele.num--;
                            this.saveData(ele, wx.getStorageSync('shopInfo').ShopId)
                        }
                    })
                } else {
                    // this.shopPageListSum.forEach(item => {
                    //     item.forEach(ele => {
                    //         if (ele.MultiSpec == 1) {
                    //             ele.GoodsSpec.forEach(e => {
                    //                 e.num = info.num;
                    //                 e.num--;
                    //             })
                    //         }
                    //     })
                    // })
                    this.sumList.forEach(ele => {
                        if (ele.MultiSpec == 1) {
                            ele.GoodsSpec.forEach(e => {
                                if (e.Id == info.Id) {
                                    e.num = info.num;
                                    e.num--;
                                    this.saveData(e, wx.getStorageSync('shopInfo').ShopId)
                                }
                            })
                        }
                    })
                }
            },
            add(e) {
                let {
                    info
                } = e.target.dataset;
                // console.log(info)
                if (info.MultiSpec == 0) {
                    if (info.GoodsType == -1) { //折扣商品
                        if (info.PriceOffRule.DiscountRule == 1) { //购买规格  每人限一份
                            if (info.IsBuyed == 0) { //未购买
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
                } else { //多规格增加
                    // this.shopPageListSum.forEach(item => {
                    //     item.forEach(ele => {
                    //         if (ele.MultiSpec == 1) {
                    //             ele.GoodsSpec.forEach(e => {
                    //                 e.num = info.num;
                    //                 e.num++;
                    //             })
                    //         }
                    //     })
                    // })
                    this.sumList.forEach(ele => {
                        if (ele.MultiSpec == 1) {
                            ele.GoodsSpec.forEach(e => {
                                if (e.Id == info.Id) {
                                    e.num = info.num;
                                    e.num++;
                                    this.saveData(e, wx.getStorageSync('shopInfo').ShopId)
                                }
                            })
                        }
                    })
                }
            },
            addFun(info) {
                // this.shopPageListSum.forEach(item => {
                //     item.forEach(ele => {
                //         if (ele.GoodId == info.GoodId) {
                //             ele.num = info.num;
                //             ele.num++;
                //         }
                //     })
                // })
                this.sumList.forEach(ele => {
                    if (ele.GoodId == info.GoodId) {
                        ele.num = info.num;
                        ele.num++;
                        this.saveData(ele, wx.getStorageSync('shopInfo').ShopId)
                    }
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
                this.allShopInfoList.forEach(e => {
                    e.sum = 0;
                    e.GoodsInfo.forEach(ele => {
                        if (ele.MultiSpec == 0) {
                            e.sum += ele.num;
                        } else {
                            ele.GoodsSpec.forEach(item => {
                                e.sum += item.num;
                            })
                        }
                    })
                    e.sum = e.sum > 99 ? '99+' : e.sum;
                })
                // console.log(this.allShopInfoList)
            },
            //走缓存
            cache() {
                console.log('走缓存了');
                // console.log(this.cartListItem)
                // if (!this.shopPageListSum.length) return;
                // let listItem = this.shopPageListSum[this.selected];
                // listItem.forEach(item => {
                //     if (item.MultiSpec == 0) { //无规格
                //         item.num = 0;
                //         this.cartListItem.forEach(ele => {
                //             if (item.GoodId == ele.GoodId) {
                //                 item.num = ele.num;
                //             }
                //         })
                //     } else { //有规格
                //         item.GoodsSpec.forEach(ele => {
                //             ele.num = 0;
                //             this.cartListItem.forEach($item => {
                //                 if (ele.Id == $item.Id) {
                //                     ele.num = $item.num;
                //                 }
                //             })
                //         })
                //     }
                // })
                //针对全部商品的缓存赋值
                this.sumList.forEach(item => {
                    if (item.MultiSpec == 0) { //无规格
                        item.num = 0;
                        this.cartListItem.forEach(ele => {
                            if (item.GoodId == ele.GoodId) {
                                item.num = ele.num;
                            }
                        })
                    } else { //有规格
                        item.GoodsSpec.forEach(ele => {
                            ele.num = 0;
                            this.cartListItem.forEach($item => {
                                if (ele.Id == $item.Id) {
                                    ele.num = $item.num;
                                }
                            })
                        })
                    }
                })
                this.allShopInfoList.forEach(e => {
                    e.sum = 0;
                    e.GoodsInfo.forEach(ele => {
                        if (ele.MultiSpec == 0) {
                            e.sum += ele.num;
                        } else {
                            ele.GoodsSpec.forEach(item => {
                                e.sum += item.num;
                            })
                        }
                    })
                    e.sum = e.sum > 99 ? '99+' : e.sum;
                })
                // console.log(this.allShopInfoList)
            },
            blockCart() {
                if (this.OpenState == false) { //未营业
                    this.msg('店铺已打烊，暂不支持下单')
                } else {
                    if (this.cartListItem.length) {
                        this.cartActive = !this.cartActive;
                    } else {
                        this.msg('您还没有选择商品哦')
                    }
                }
            },
            clearCart() {
                this.cartActive = false;
                this.cartListItem = [];
                // this.shopPageListSum.forEach(e => {
                //     e.forEach(item => {
                //         if (item.MultiSpec == 1) {
                //             item.GoodsSpec.forEach(ele => {
                //                 ele.num = 0;
                //             })
                //         } else {
                //             item.num = 0;
                //         }
                //     })
                // })
                this.sumList.forEach(e => {
                    if (e.MultiSpec == 1) {
                        e.GoodsSpec.forEach(ele => {
                            ele.num = 0;
                        })
                    } else {
                        e.num = 0;
                    }
                })
                //清空列表数量
                this.allShopInfoList.forEach(e => {
                    e.sum = 0;
                })
                //先获取总缓存
                let cartListSum = wx.getStorageSync('cartListSum') || [];
                //过滤掉缓存
                cartListSum = cartListSum.filter(e => e.ShopId != this.ShopId);
                wx.setStorageSync('cartListSum', cartListSum);
                //缓存length不存在，直接清除
                !cartListSum.length && wx.removeStorageSync('cartListSum');
            },
            settlement() {
                if (this.cartListItem.length) {
                    //判断手机号绑定状态
                    if (wx.getStorageSync('loginInfo').IsBindPhone == 1) {
                        let ShopId = String(wx.getStorageSync('shopInfo').ShopId) || '';
                        wx.navigateTo({
                            url: `/pages/submit-order/main?ShopId=${ShopId}`
                        })
                    } else {
                        wx.navigateTo({
                            url: '/pages/login/main'
                        })
                    }
                } else {
                    this.msg('您还没有选择商品哦')
                }
            },
            goGoodsDetail(item) {
                if (item.State == 3 || (item.MultiSpec == 0 && item.RealStock <= 0) || (item.MultiSpec == 1 && !item.List.length)) {
                    this.msg('商品已售罄')
                    return;
                }
                let num = item.hasOwnProperty('num') ? item.num : 'spec';
                let {
                    GoodId
                } = item;
                let ShopId = String(wx.getStorageSync('shopInfo').ShopId) || '';
                wx.navigateTo({
                    url: `/pages/product-details/main?ShopId=${ShopId}&GoodId=${GoodId}&num=${num}&type=1`
                })
            },
            shopOpenState() {
                this.msg('店铺已打烊，暂不支持下单')
            },
            //选择规格
            formatCheck(i) {
                this.formatLi = i;
            },
            //规格加入购物车
            addCart() {
                //获取点击的规格和价格
                let info = this.formatList.GoodsSpec[this.formatLi];
                // console.log(list)
                // list.forEach(item => {
                //     if (item.MultiSpec == 1) {
                //         item.GoodsSpec.forEach(e => {
                //             if (e.Id == info.Id) {
                //                 info.num++;
                //                 e.num = info.num;
                //             }
                //         })
                //     }
                // })
                this.sumList.forEach(item => {
                    if (item.MultiSpec == 1) { //有规格
                        item.GoodsSpec.forEach(ele => {
                            if (ele.Id == info.Id) {
                                ele.num = info.num++;
                            }
                        })
                    }
                })
                // console.log('多规格的数量', info.num)
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
            goNearShop() {
                wx.switchTab({
                    url: '/pages/nearby-shop/main'
                })
            },
            address() {
                if (wx.getStorageSync('loginInfo').IsBindPhone == 0) {
                    this.msg('您还没有登录哦')
                    setTimeout(_ => {
                        wx.navigateTo({
                            url: '/pages/login/main'
                        })
                    }, 1000)
                } else {
                    wx.navigateTo({
                        url: '/pages/my-address/main?type=2'
                    })
                }
            },
            order() {
                if (wx.getStorageSync('loginInfo').IsBindPhone == 0) {
                    this.msg('您还没有登录哦')
                    setTimeout(_ => {
                        wx.navigateTo({
                            url: '/pages/login/main'
                        })
                    }, 1000)
                } else {
                    wx.navigateTo({
                        url: '/pages/my-order/main'
                    })
                }
            },
            goCoupon() {
                if (wx.getStorageSync('loginInfo').IsBindPhone == 0) {
                    this.msg('您还没有登录哦')
                    setTimeout(_ => {
                        wx.navigateTo({
                            url: '/pages/login/main'
                        })
                    }, 1000)
                } else {
                    let ShopId = String(wx.getStorageSync('shopInfo').ShopId) || '';
                    wx.navigateTo({
                        url: '/pages/my-coupon/main?type=2&shopId=' + ShopId
                    })
                }
            },
            /* 获取优惠券列表 */
            getCoupon() {
                return this.util.post({
                    url: '/api/Customer/Browse/ShopIndexCouponList',
                    data: {
                        ShopID: this.ShopId || String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
                    }
                })
            },
            /* 领取优惠券 */
            receiveCoupon(v) {
                if (wx.getStorageSync('loginInfo').IsBindPhone == 0) {
                    this.msg('您还没有登录哦')
                    setTimeout(_ => {
                        wx.navigateTo({
                            url: '/pages/login/main'
                        })
                    }, 1000)
                } else {
                    // console.log(v)
                    if (v.Status == 0) {
                        this.util.post({
                            url: '/api/Customer/Coupon/GetCoupon',
                            data: {
                                CouponID: v.ID,
                            }
                        }).then(res => {
                            this.msg('领取成功')
                            //更新领取状态
                            this.util.post({
                                url: '/api/Customer/Browse/ShopIndexCouponList',
                                data: {
                                    ShopID: this.ShopId || String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
                                }
                            }).then(result => {
                                this.couponList = result.Body;
                            }).catch(error => {
                                this.msg(error.Msg)
                            })
                        }).catch(err => {
                            this.msg(err.Msg)
                        })
                    } else {
                        this.msg('您已经领取过了哦')
                    }
                }
            }
        },
        computed: {
            //购物车商品总价
            count: function() {
                let n = 0;
                this.cartListItem.forEach(e => {
                    if (e.GoodsType == -1) { //折扣
                        if (e.PriceOffRule.DiscountRule == 2) { //每份仅限一单
                            if (e.num > 0) {
                                if (e.num > 1) { //原价
                                    n += Math.round(e.OriginalPrice * 10000) * (e.num - 1) + Math.round(e.SalesPrice * 10000);
                                    e.sumPrice += (Math.round(e.OriginalPrice * 10000) * (e.num - 1) + Math.round(e.SalesPrice * 10000)) / 10000;
                                } else { //折扣价
                                    n += Math.round(e.SalesPrice * 10000);
                                    e.sumPrice += Math.round(e.SalesPrice * 10000) / 10000;
                                }
                                // console.log(n)
                            }
                        } else {
                            if (e.num > 0) {
                                n += Math.round(e.SalesPrice * 10000) * e.num;
                                e.sumPrice = Math.round(e.SalesPrice * 10000) * e.num / 10000;
                            }
                        }
                    } else { //非折扣
                        if (e.num > 0) {
                            //销售价存在
                            if (e.SalesPrice) {
                                //javascript(js)的小数点乘法除法问题
                                n += Math.round(e.SalesPrice * 10000) * e.num;
                                e.sumPrice = Math.round(e.SalesPrice * 10000) * e.num / 10000;
                            } else { //不存在
                                //javascript(js)的小数点乘法除法问题
                                n += Math.round(e.OriginalPrice * 10000) * e.num;
                                e.sumPrice = Math.round(e.OriginalPrice * 10000) * e.num / 10000;
                            }
                        }
                    }
                })
                return this.cartListItem.length ? n / 10000 : 0;
            },
            //购物车商品个数
            number: function() {
                let number = 0;
                this.cartListItem.forEach(e => {
                    if (e.num > 0) {
                        number += e.num;
                    }
                })
                if (number == 0) {
                    this.cartActive = false;
                }
                return this.cartListItem.length ? number > 99 ? '99+' : number : 0;
            },
            addressInfo: function() {
                return this.shopInfoList.ShopAddress ? '地址：' + this.shopInfoList.ShopAddress.split('($)').join(' ') : '';
            },
            addressShopInfo: function() {
                return this.shopInfoList.ShopAddress ? this.shopInfoList.ShopAddress.split('($)').join(' ') : '';
            },
            shopName: function() {
                return this.shopInfoList.ShopName.length > 10 ? this.shopInfoList.ShopName.slice(0, 10) + '...' : this.shopInfoList.ShopName;
            },
            OpenState: function() { //0 未营业 1 营业中
                return this.shopInfoList.OpenState == 0 ? false : true;
            }
        },
    }
</script>

<style lang="less">
    .store {
        height: 100%;
        overflow: hidden;
        position: relative;
        display: flex;
        flex-direction: column;
    }
    .swiper-box {
        flex: 1;
        .shop_details {
            height: 100%;
            background: #fff;
            overflow: hidden;
            .options {
                padding: 35rpx 0;
                background: #fff;
                display: flex;
                margin: 0 35rpx;
                position: relative;
                .label {
                    font-size: 28rpx;
                    color: #5e5e5e;
                    white-space: nowrap;
                    font-weight: 900;
                    width: 160rpx;
                }
                .item {
                    flex: 1;
                    font-size: 28rpx;
                    color: #999;
                    line-height: 40rpx;
                    text-align: right;
                }
            }
            .options_bor:after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                border-bottom: 1px solid #ebebeb;
                position: absolute;
                bottom: 0;
                left: 0;
                transform: scaleY(0.5);
                transform-origin: 0 0;
            }
            .shop_info_list {
                display: flex;
                padding: 0 35rpx 20rpx;
                align-items: center;
                background: #fff;
                .shop_tel,
                .shop_wx {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #f5f5f5;
                    padding: 20rpx 0;
                    border-radius: 8rpx;
                    .icon_info {
                        width: 30rpx;
                        height: 30rpx;
                        margin-right: 8rpx;
                    }
                    p {
                        font-size: 24rpx;
                        color: #666;
                    }
                }
                .shop_tel {
                    margin-right: 20rpx;
                }
            }
        }
        .store_index {
            height: 100%;
            padding-bottom: 100rpx;
            box-sizing: border-box;
            background: #fff;
        }
        .store_index_list {
            display: flex;
            height: 100%;
            position: relative;
            .no_shop_tips {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 2;
                background: #fff;
                display: flex;
                .no_shop_con {
                    width: 200rpx;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: 137rpx auto 0;
                    p {
                        margin-top: 20rpx;
                        font-size: 22rpx;
                        color: #ccc;
                        white-space: nowrap;
                    }
                }
            }
            .scroll_left {
                width: 180rpx;
                .list_item_l {
                    padding: 35rpx 28rpx;
                    color: #444;
                    font-size: 26rpx;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: break-all;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    text-align: left;
                    position: relative;
                    &:first-child {
                        padding-top: 38rpx;
                    }
                    .left_num {
                        position: absolute;
                        right: 15rpx;
                        top: 20rpx;
                        width: 30rpx;
                        height: 30rpx;
                        line-height: 30rpx;
                        text-align: center;
                        background-image: linear-gradient(-22deg, #f21b30 0%, #ff693b 99%), linear-gradient( #ff2929, #ff2929); //   box-shadow: 2rpx 2rpx 8rpx 0rpx rgba(177, 5, 5, 0.7);
                        padding: 3rpx;
                        border-radius: 50%;
                        font-size: 16rpx;
                        color: #fff;
                    }
                }
                .left_select {
                    color: #1d1d1d;
                    font-weight: 700;
                }
            }
            .right_con {
                flex: 1;
                overflow-x: hidden;
                overflow-y: scroll;
            }
            .scroll_right {
                flex: 1;
                .no_shop {
                    font-size: 26rpx;
                    padding-top: 50rpx;
                    color: #666;
                    text-align: center;
                }
                .list_item_r {
                    position: relative;
                    padding: 20rpx 0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .lis_item_left {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        overflow: hidden;
                        position: relative;
                        .shop_lis_img {
                            width: 136rpx;
                            height: 136rpx;
                            margin-right: 20rpx;
                            border-radius: 10rpx;
                        }
                        .shop_lis_mask {
                            width: 136rpx;
                            height: 136rpx;
                            border-radius: 10rpx;
                            position: absolute;
                            top: 0;
                            left: 0;
                            background: rgba(0, 0, 0, 0.5);
                            z-index: 1;
                            color: #fff;
                            font-size: 26rpx;
                            text-align: center;
                            line-height: 136rpx;
                        }
                        .li_info {
                            flex: 1; // overflow: hidden;
                            position: relative;
                            .shop_name {
                                color: #1d1d1d;
                                font-size: 28rpx;
                                line-height: 60rpx;
                                transform: translateY(-18%);
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                width: 300rpx;
                                font-weight: 700;
                            }
                            .discount {
                                position: absolute;
                                left: 0;
                                top: 48rpx;
                                font-size: 22rpx;
                                color: #999;
                                .price_tips {
                                    margin-right: 24rpx;
                                }
                            }
                            .price_init {
                                color: #ff4d3a;
                                line-height: 60rpx;
                                font-size: 36rpx;
                                transform: translateY(20rpx);
                                font-weight: 700;
                                span {
                                    font-size: 24rpx;
                                }
                            }
                            .discount_shop {
                                display: flex;
                                align-items: center;
                                transform: translateY(10rpx);
                                .price {
                                    color: #ff4d3a;
                                    line-height: 60rpx;
                                    font-size: 36rpx;
                                    transform: translateY(18%);
                                    font-weight: 700;
                                    span {
                                        font-size: 24rpx;
                                    }
                                }
                                .original_price {
                                    font-size: 22rpx;
                                    color: #ccc;
                                    transform: translateY(14rpx);
                                    margin-left: 12rpx;
                                    position: relative;
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
                        }
                    }
                    .count {
                        position: absolute;
                        right: 27rpx;
                        bottom: 16rpx;
                        display: flex;
                        align-items: center;
                        width: 170rpx;
                        justify-content: flex-end;
                        .lower,
                        .add {
                            width: 50rpx;
                            height: 50rpx;
                        }
                        span {
                            font-size: 24rpx;
                            color: #4d4d4d;
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
                        position: absolute;
                        right: 27rpx;
                        bottom: 30rpx;
                        font-size: 24rpx;
                        color: #999;
                    }
                    .shop_mask_state {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        z-index: 2;
                    }
                }
                .list_item_r:first-child {
                    padding-top: 38rpx;
                }
            }
        }
        .user_info_right {
            padding: 20rpx;
            .options {
                background: url('https://otherfiles-ali.uupt.com/Stunner/FE/C/icon_arrowRight.png') no-repeat right center;
                background-size: 25rpx 25rpx;
                height: 108rpx;
                margin: 0 35rpx;
                display: flex;
                align-items: center;
                p {
                    color: #000;
                    font-size: 30rpx;
                }
                .icon {
                    margin-right: 16rpx;
                }
            }
        }
    }
    .store_top_info {
        overflow: hidden;
        .store_banner {
            background: #383838;
            position: relative;
            height: 168rpx;
            padding: 24rpx;
            box-sizing: border-box;
            display: flex;
            justify-content: flex-start;
            .shop_img {
                width: 120rpx;
                height: 120rpx;
                border-radius: 10rpx;
                margin-right: 20rpx;
            }
            .shop_right_details {
                flex: 1;
                overflow: hidden;
                .offer_text {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    overflow: hidden;
                }
                .offer_info {
                    flex: 1;
                    height: 46rpx;
                    overflow: hidden;
                }
                .swiper_item {
                    height: 46rpx !important;
                    i {
                        margin-left: 8rpx;
                    }
                }
                .option {
                    height: 46rpx;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                }
                p,
                span {
                    color: #fff;
                    font-size: 22rpx;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    line-height: 42rpx;
                    padding: 0 8rpx;
                    flex: 1;
                }
                .coupon_text {
                    padding-right: 20rpx;
                }
            }
            .share {
                position: absolute;
                top: 0;
                right: 22rpx;
                width: 86rpx;
                height: 86rpx;
            }
        }
        .store_text {
            background: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 58rpx;
            .name {
                font-size: 38rpx;
                color: #383838;
                font-weight: 700;
                .icon {
                    margin-left: 5rpx;
                }
            }
            .time {
                font-size: 22rpx;
                color: #ff4d3a;
                line-height: 36rpx;
                background-color: rgba(255, 77, 58, 0.13);
                border-radius: 4rpx;
                padding: 0 8rpx;
                margin: 6rpx 0 24rpx;
            }
            .address {
                width: 60%;
                font-size: 22rpx;
                color: #939393;
                display: -webkit-box !important;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                text-align: center;
            }
        }
        .store_info {
            display: flex;
            justify-content: space-around;
            align-items: center;
            box-sizing: border-box;
            position: relative;
            li {
                flex-flow: 1;
                width: 100%;
                text-align: center;
                height: 80rpx;
                span {
                    line-height: 80rpx;
                    color: #999;
                    font-size: 28rpx;
                    position: relative;
                    z-index: -1;
                    box-sizing: border-box;
                    display: inline-block;
                    height: 100%;
                }
            }
            .li_select {
                span {
                    color: #1d1d1d;
                    border-bottom: 5rpx solid #ff4d3a;
                    font-weight: 700;
                }
            }
            &:after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                border-bottom: 1px solid #ebebeb;
                position: absolute;
                bottom: 0;
                left: 0;
                transform: scaleY(0.5) translateY(100%);
                transform-origin: 0 0;
            }
        }
    }
    .cart_mask,
    .share_mask,
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
    .format_mask {
        z-index: 30;
    }
    .shop_cart {
        height: 100rpx;
        background-color: rgba(70, 70, 70, 0.97);
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 30;
        padding: 0 20rpx;
        box-sizing: border-box;
        .cart_left {
            flex-flow: 1;
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 100%;
            .cart_img {
                position: relative;
                .cart_img {
                    width: 112rpx;
                    height: 112rpx;
                    transform: translateY(-8%);
                }
                .number {
                    position: absolute;
                    right: -10rpx;
                    top: 15rpx;
                    width: 30rpx;
                    height: 30rpx;
                    line-height: 30rpx;
                    text-align: center;
                    transform: translateY(-80%);
                    background-image: linear-gradient(-22deg, #f21b30 0%, #ff693b 99%), linear-gradient( #ff2929, #ff2929); //   box-shadow: 2rpx 2rpx 8rpx 0rpx rgba(177, 5, 5, 0.7);
                    box-shadow: -4rpx 4rpx 8rpx 0rpx rgba(177, 5, 5, 0.7);
                    padding: 5rpx;
                    border-radius: 50%;
                    font-size: 18rpx;
                    color: #fff;
                }
            }
            .money {
                color: #fff;
                font-size: 36rpx;
                margin-left: 20rpx;
            }
        }
        .cart_right {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            .no_num {
                color: #a3a3a3;
                font-size: 24rpx;
                white-space: nowrap;
            }
            .no_operate {
                color: #fff;
                font-size: 32rpx;
                white-space: nowrap;
            }
            .settlement {
                width: 184rpx;
                height: 64rpx;
                background-color: #ff4d3a;
                border-radius: 8rpx;
                font-size: 24rpx;
                color: #fff;
                line-height: 64rpx;
                text-align: center;
            }
        }
    }
    .cartListSum {
        width: 100%;
        transform: translateY(100%);
        transition: transform 0.4s ease;
        position: absolute;
        z-index: 20;
        left: 0;
        bottom: 100rpx;
        background: #fff;
        .shop_rule {
            display: flex;
            justify-content: space-between;
            padding: 25rpx 35rpx;
            color: #999;
            font-size: 24rpx;
            background: #eaeaea;
            align-items: center;
            .clear {
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .icon_clear {
                margin-right: 10rpx;
            }
        }
        .shop_list {
            width: 100%;
            overflow-x: hidden;
            overflow-y: scroll;
            max-height: 505rpx;
            padding: 0 36rpx;
            box-sizing: border-box;
            .lis {
                display: flex;
                justify-content: space-between;
                padding: 24rpx 0;
                background: #fff;
                border-bottom: 1rpx solid #ebebeb;
                align-items: center;
                .left {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    height: 77rpx;
                    max-width: 280rpx;
                    .shop_list_name {
                        color: #1d1d1d;
                        font-size: 28rpx;
                        line-height: 40rpx;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        width: 100%;
                    }
                    span {
                        color: #999;
                        font-size: 22rpx;
                        line-height: 36rpx;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        width: 100%;
                    }
                }
                .right {
                    width: 300rpx;
                    align-items: center;
                }
                .shop_list_price {
                    color: #666;
                    font-size: 28rpx;
                    transform: translateY(10%);
                    position: relative;
                    i {
                        position: absolute;
                        left: -32rpx;
                        top: 4rpx;
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
            }
            .lis:nth-last-of-type(1) {
                border-bottom: none;
            }
        }
    }
    .cartListSum_active {
        transform: translateY(0%);
    }
    .couponList {
        width: 100%;
        transform: translateY(100%);
        transition: transform 0.4s ease;
        position: absolute;
        z-index: 30;
        left: 0;
        bottom: 0;
        background: #fff;
        .top {
            margin: 0 36rpx 8rpx;
            position: relative;
            padding: 40rpx 0;
            &:after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                border-top: 1px solid #ebebeb;
                position: absolute;
                bottom: 0;
                left: 0;
                transform: scaleY(.5);
                transform-origin: 0 0;
            }
            h2.title {
                font-size: 36rpx;
                color: #1a1a1a;
                text-align: center;
                font-weight: 900;
                line-height: 36rpx;
                margin-bottom: 14rpx;
            }
            p {
                font-size: 24rpx;
                color: #666;
                text-align: center;
                line-height: 24rpx;
            }
        }
        .coupon {
            margin: 0 36rpx;
            padding-bottom: 40rpx;
            max-height: 560rpx;
            overflow-y: scroll;
            .title {
                font-size: 30rpx;
                color: #1a1a1a;
                padding: 30rpx 0;
                margin-top: 12rpx;
                .icon {
                    margin-right: 10rpx;
                }
            }
            .title_text {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: 30rpx 0 16rpx;
                span {
                    color: #1a1a1a;
                    font-size: 30rpx;
                }
                .icon {
                    margin-right: 10rpx;
                    width: 32rpx;
                    height: 32rpx;
                }
            }
            ul.list {
                li {
                    width: 214rpx;
                    height: 109rpx;
                    background-image: url('../../../static/couponBg.png');
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: 100%;
                    margin-bottom: 17rpx;
                    display: inline-block;
                    &.couponStatus1 {
                        background-image: url('../../../static/couponBg1.png');
                    }
                    &.couponStatus2 {
                        background-image: url('../../../static/couponBg2.png');
                    }
                    &:nth-child(3n-1) {
                        margin: 0 16rpx 17rpx;
                    }
                    p {
                        text-align: left;
                        font-size: 18rpx;
                        color: rgba(255, 255, 255, 0.7);
                        padding-left: 12rpx;
                        line-height: 23rpx;
                        padding-top: 7rpx;
                    }
                    .money {
                        width: 146rpx;
                        text-align: center;
                        line-height: 65rpx;
                        span {
                            font-size: 24rpx;
                            color: #fff;
                            &.number {
                                font-size: 65rpx;
                            }
                        }
                    }
                }
            }
            .tip {
                font-size: 24rpx;
                color: #999;
                line-height: 36rpx;
            }
            .text {
                font-size: 26rpx;
                color: #ff4d3a;
                line-height: 36rpx;
                padding-bottom: 8rpx;
            }
        }
        .close {
            height: 96rpx;
            line-height: 96rpx;
            background: #fff;
            font-size: 30rpx;
            color: #1a1a1a;
            text-align: center;
            position: relative;
            &:after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                border-top: 1px solid #ebebeb;
                position: absolute;
                top: 0;
                left: 0;
                transform: scaleY(.5);
                transform-origin: 0 0;
            }
        }
        &.couponList_active {
            transform: translateY(0%);
        }
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
                    text-align: center;
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
    .button-hover {
        background: transparent;
    }
    .saveImg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        padding: 10rpx 36rpx 0;
        box-sizing: border-box;
        z-index: 50;
        .icon_close {
            position: absolute;
            top: 25rpx;
            right: 25rpx;
            z-index: 100;
        }
        .saveBtn {
            position: absolute;
            left: 50%;
            top: 919rpx;
            width: 290rpx;
            height: 73rpx;
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
        .main {
            border-radius: 10rpx;
            background: #f1f1f1;
            position: relative;
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
                    span {
                        font-size: 32rpx;
                        margin-right: 10rpx;
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
    .shop_share_btn {
        width: 100%;
        box-sizing: border-box;
        padding: 0 35rpx;
        position: absolute;
        bottom: 40rpx;
        .shop_share_btn_body {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #ed533d;
            height: 100rpx;
            p {
                padding-left: 20rpx;
                font-size: 28rpx;
                color: #fff;
                white-space: nowrap;
            }
            .share_friend {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 20rpx;
                background: #fff;
                border-radius: 6rpx;
                margin-right: 20rpx;
                height: 62rpx;
                span {
                    white-space: nowrap;
                    color: #ed533d;
                    font-size: 24rpx;
                    margin-right: 10rpx;
                }
            }
        }
    }
</style>
