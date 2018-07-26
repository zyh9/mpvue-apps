<template>
    <div class="search_shop">
        <div class="search_top">
            <div class="search">
                <i class="icon icon_search_2"></i>
                <input type="text" placeholder="搜索" v-model="val" focus="true">
                <i class="icon icon_del" v-if="val" @click="clear"></i>
            </div>
            <p class="text" @click="searchClick">搜索</p>
        </div>
        <scroll-view scroll-y="true" :style="{height:winHeight+'px'}" lower-threshold="20" @scrolltolower="scrollHandler">
            <p class="no_search" v-if="tips">暂无搜索结果</p>
            <ul class="search_shop_list">
                <li class="search_item" v-for="(item,index) in shopList" :key="index" @click="openShop(item)">
                    <div class="item_top">
                        <div class="item_left">
                            <img :src="item.ShopLogo" alt="" class="item_left_img fade_in">
                            <div class="item_left_text">
                                <div class="name">
                                    <div class="name_left">
                                        <span class="rest" v-if="item.OpenState==0">休息中</span>
                                        <p class="shop_name">{{item.ShopName}}</p>
                                    </div>
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
                <div class="no_more" v-if="nomore">没有更多</div>
            </ul>
        </scroll-view>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                winWidth: 0,
                winHeight: 0,
                val: '',
                mapInfo: {},
                shopList: [],
                tips: false,
                page: 1,
                quest: true,
                nomore: false,
            }
        },
        onShow() {
            this.page = 1;
            this.quest = true;
            this.val = '';
            this.shopList = [];
            this.tips = false;
            this.nomore = false;
            this.mapInfo = wx.getStorageSync('QQmap')
            // console.log(this.mapInfo)
            let query = wx.createSelectorQuery();
            query.select('.search_top').boundingClientRect()
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
        },
        methods: {
            scrollHandler() {
                if (this.quest) {
                    this.page++;
                    this.search()
                }
            },
            searchClick() {
                this.page = 1;
                this.shopList = [];
                this.quest = true;
                this.nomore = false;
                this.search()
            },
            search() {
                if (this.val) {
                    this.util.post({
                        url: '/api/Customer/Browse/SearchShops',
                        data: {
                            CityName: this.mapInfo.city,
                            ShopName: this.val,
                            PageSize: 10,
                            PageIndex: this.page
                        }
                    }).then(res => {
                        // console.log("正确信息", res)
                        res.Body.Shops.forEach(e => {
                            e.ShopAddress = e.ShopAddress.replace(/\n/g, '').split('($)').join('');
                            e.ShopLogo = e.ShopLogo + '?x-oss-process=image/resize,w_100/format,jpg';
                        })
                        if (res.Body.Shops.length < 10 && this.page > 1) {
                            this.quest = false;
                            this.nomore = true;
                        }
                        this.shopList.push(...res.Body.Shops);
                        if (this.shopList.length == 0) this.tips = true;
                    }).catch(err => {
                        this.msg(err.Msg)
                    })
                } else this.msg('您还没有输入内容哦')
            },
            clear() {
                this.val = '';
                this.shopList = [];
                this.tips = false;
                this.nomore = false;
            },
            openShop(info) {
                console.log(info.ShopId)
                wx.redirectTo({
                    url: `/pages/my-store/main?ShopId=${info.ShopId}&type=1`
                })
            },
        },
        watch: {
            val: function(newOld, oldVal) {
                if (newOld == "") {
                    this.tips = false;
                }
            }
        },
        components: {}
    }
</script>

<style lang="less">
    .search_shop {
        height: 100%;
        background: #fff;
        overflow: hidden;
    }
    .search_top {
        padding: 16rpx 0 16rpx 35rpx;
        display: flex;
        justify-content: flex-start;
        .search {
            flex: 1;
            background: #f5f5f5;
            height: 80rpx;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            overflow: hidden;
            i {
                margin: 0 20rpx;
            }
            input {
                flex: 1;
                color: #333;
                font-size: 26rpx;
            }
        }
        .text {
            height: 80rpx;
            width: 120rpx;
            font-size: 28rpx;
            color: #444;
            line-height: 80rpx;
            text-align: center;
        }
    }
    .no_search {
        font-size: 24rpx;
        color: #999;
        text-align: center;
        padding-top: 60rpx;
    }
    .search_shop_list {
        overflow: hidden;
        .search_item {
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
                            margin-bottom: 16rpx;
                            width: 100%;
                            display: flex;
                            justify-content: flex-start;
                            .name_left {
                                flex: 1;
                                display: flex;
                                align-items: center;
                                max-width: 500rpx;
                                .rest {
                                    padding: 4rpx 8rpx;
                                    background-color: #595959;
                                    border-radius: 2px;
                                    font-size: 20rpx;
                                    color: #fff;
                                    white-space: nowrap;
                                    margin-right: 10rpx;
                                }
                                .shop_name {
                                    flex: 1;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    font-size: 32rpx;
                                    color: #1a1a1a;
                                    font-weight: 700;
                                    width: 90%;
                                }
                            }
                            span {
                                font-size: 24rpx;
                                color: #b3b3b3;
                                font-weight: normal;
                            }
                        }
                        .address {
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
                    span {
                        display: block;
                        font-size: 24rpx;
                        color: #666;
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
                }
            }
        }
        .search_item:nth-last-of-type(1) {
            border-bottom: none;
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
        height: 60rpx;
        width: 100%;
        line-height: 60rpx;
        font-size: 26rpx;
        color: #999;
        text-align: center;
        background: #fff;
    }
</style>
