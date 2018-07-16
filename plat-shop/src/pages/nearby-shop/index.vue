<template>
    <div class="nearby_shop" v-if="block">
        <div class="nearby_top">
            <div class="search" @click="search">
                <i class="icon icon_sear"></i>
                <p class="text">搜索</p>
            </div>
        </div>
        <!-- <scroll-view scroll-y="true" :style="{height:winHeight+'px'}" lower-threshold="20" @scrolltolower="scrollHandler"> -->
        <div class="banner"></div>
        <ul class="nearby_shop_list">
            <li class="nearby_item" v-for="(item,index) in nearbyrList" :key="index" @click="openShop(item)">
                <div class="item_top">
                    <div class="item_left">
                        <img :src="item.ShopLogo" alt="" class="item_left_img fade_in" lazy-load="true">
                        <div class="item_left_text">
                            <div class="name">
                                <div class="name_left">
                                    <span class="rest" v-if="item.OpenState==0">休息中</span>
                                    <p class="shop_name">{{item.ShopName}}</p>
                                </div>
                                <span class="distance">{{item.Distance}}km</span>
                            </div>
                            <p class="address">{{item.ShopAddress}}</p>
                            <div class="option" v-if="item.PaotuiPriceOff"><i class="icon_set"></i><span class="coupon_text">{{item.PaotuiPriceOff}}</span></div>
                            <div class="option" v-if="item.Coupons"><i class="icon icon_coupon"></i><span class="coupon_text">{{item.Coupons}}</span></div>
                            <div class="option" v-if="!item.PaotuiPriceOff&&!item.Coupons"><span class="no_coupon_text">{{item.NoPerMessage}}</span></div>
                        </div>
                    </div>
                </div>
                <div class="li_mask" v-if="item.OpenState==0"></div>
            </li>
            <div class="no_more" v-if="nomore">附近没有更多店铺了</div>
        </ul>
        <!-- </scroll-view> -->
    </div>
</template>

<script>
    import gcoord from 'gcoord';
    import QQMapWX from '../../utils/qqmap-wx-jssdk.js';
    const QQMap = new QQMapWX({
        key: 'BZMBZ-OKXRU-DINVZ-2SRN5-4KWJ7-S6B6O'
    })
    export default {
        data() {
            return {
                winWidth: 0,
                winHeight: 0,
                nearbyrList: [],
                mapInfo: {},
                loginInfo: {},
                page: 1,
                quest: true,
                nomore: false,
                block: false,
            }
        },
        onLoad() {
            this.block = false;
            wx.showLoading({
                title: '加载中',
                mask: true
            })
        },
        onReady() { //页面渲染就会触发
            this.page = 1;
            this.quest = true;
            this.nomore = false;
            this.nearbyrList = [];
            this.util.qqMapInfo().then(res => {
                console.log(res)
                this.mapInfo = wx.getStorageSync('QQmap')
                this.nearbyShop()
            }).catch(err => {
                console.log(err)
            })
        },
        onShow() {},
        onPullDownRefresh() { //下拉刷新
            this.page = 1;
            this.nomore = false;
            this.util.getLoc().then(res => {
                this.mapInfo = wx.getStorageSync('QQmap')
                // console.log('下拉')
                this.nearbyShop(this.page)
            }).catch(err => {
                this.msg('位置信息获取错误，请稍后重试')
            })
        },
        onReachBottom() { //触底事件
            if (this.quest) {
                this.page++;
                this.nearbyShop()
            }
        },
        methods: {
            scrollHandler() {
                if (this.quest) {
                    this.page++;
                    this.nearbyShop()
                }
            },
            //附近的店铺
            nearbyShop(pg) {
                this.util.post({
                        url: '/api/Customer/Browse/NearbyShops',
                        data: {
                            CityName: this.mapInfo.city,
                            UserLocalPoint: this.trans(this.mapInfo),
                            Distance: 5000,
                            PageSize: 10,
                            PageIndex: this.page
                        }
                    })
                    .then(res => {
                        this.block = true;
                        wx.hideLoading();
                        wx.stopPullDownRefresh()
                        res.Body.Shops.forEach(e => {
                            e.ShopAddress = e.ShopAddress.replace(/\n/g, '').split('($)').join('');
                            e.Distance = Math.floor(e.Distance / 1000 * 100) / 100;
                            e.ShopLogo = e.ShopLogo + '?x-oss-process=image/resize,w_100/format,jpg';
                        })
                        if (!res.Body.Shops.length && this.page == 1) {
                            this.msg('您的附近暂时还没有店铺哦')
                        } else if (!res.Body.Shops.length && this.page > 1) {
                            this.quest = false;
                            this.nomore = true;
                        } else if (res.Body.Shops.length > 1 && res.Body.Shops.length < 10 && this.page > 1) {
                            this.quest = false;
                            this.nomore = true;
                        }
                        if (pg == 1) {
                            this.nearbyrList = res.Body.Shops;
                            this.quest = true;
                            this.nomore = false;
                        } else {
                            this.nearbyrList.push(...res.Body.Shops);
                        }
                        // console.log(this.nearbyrList)
                    }).catch(err => {
                        wx.hideLoading();
                        this.msg(err.Msg)
                    })
            },
            openShop(info) {
                let {
                    ShopId
                } = info;
                console.log(ShopId)
                wx.navigateTo({
                    url: `/pages/my-store/main?ShopId=${ShopId}&type=1`
                })
            },
            search() {
                wx.navigateTo({
                    url: `/pages/search-shop/main`
                })
            },
            trans(pos) {
                let {
                    latitude,
                    longitude
                } = pos;
                var result = gcoord.transform(
                    [latitude, longitude], // 经纬度坐标
                    gcoord.WGS84, // 当前坐标系
                    gcoord.BD09, //  目标坐标系  
                );
                let location = `${result[1]},${result[0]}`;
                return location;
            },
        },
        components: {}
    }
</script>

<style lang="less">
    .nearby_shop {
        background: #fff;
    }
    .nearby_top {
        padding: 0 36rpx 16rpx;
    }
    .search {
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        overflow: hidden;
        .text {
            margin-left: 12rpx;
            font-size: 28rpx;
            color: #999;
        }
    }
    .nearby_shop_list {
        overflow: hidden;
        .nearby_item {
            background: #fff;
            position: relative;
            .item_top {
                padding: 36rpx 0;
                margin: 0 36rpx;
                display: flex;
                align-items: center;
                overflow: hidden;
                position: relative;
                .item_left {
                    display: flex;
                    justify-content: flex-start; // align-items: center;
                    flex: 1;
                    .item_left_img {
                        width: 120rpx;
                        height: 120rpx;
                        display: block;
                        border-radius: 8rpx;
                    }
                    .item_left_text {
                        padding-left: 30rpx;
                        flex: 1;
                        max-width: 525rpx;
                        .name {
                            width: 100%;
                            display: flex;
                            justify-content: space-between;
                            transform: translateY(-2rpx);
                            .name_left {
                                flex: 1;
                                display: flex;
                                align-items: center;
                                max-width: 390rpx;
                                .rest {
                                    width: 72rpx;
                                    height: 30rpx;
                                    line-height: 30rpx;
                                    text-align: center;
                                    background-color: #595959;
                                    border-radius: 2rpx;
                                    font-size: 20rpx;
                                    color: #fff;
                                    white-space: nowrap;
                                    margin-right: 10rpx;
                                }
                                .shop_name {
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    font-size: 32rpx;
                                    color: #1a1a1a;
                                    font-weight: 700;
                                    width: 80%;
                                }
                            }
                        }
                        .address {
                            margin-top: 10rpx;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            font-size: 26rpx;
                            color: #999;
                            width: 100%;
                        }
                        .option {
                            height: 40rpx;
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            margin-top: 10rpx;
                            p,
                            span {
                                color: #1a1a1a;
                                font-size: 26rpx;
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
                            .no_coupon_text {
                                padding: 0;
                            }
                        }
                    }
                    .distance {
                        font-size: 24rpx;
                        color: #b3b3b3;
                        font-weight: normal;
                    }
                }
                .item_right_img {
                    width: 60rpx;
                    height: 60rpx;
                    display: block;
                }
                &:after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-bottom: 1px solid #ebebeb;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                    z-index: 10;
                }
            }
            // .item_top:nth-last-child(1) {
            //     &:after {
            //         display: none !important;
            //     }
            // }
        }
        .li_mask {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.6);
            z-index: 2;
        }
    }
    .no_more {
        height: 70rpx;
        width: 100%;
        line-height: 70rpx;
        font-size: 20rpx;
        color: #999;
        text-align: center;
        background: #f3f3f3;
    }
</style>
