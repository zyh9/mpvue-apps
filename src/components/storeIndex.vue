<template>
    <div class="store_index">
        <div class="store_index_list">
            <scroll-view scroll-y="true" style="height: 100%" lower-threshold="60" @scrolltolower="scrollHandler" class="scroll_left">
                <div v-for="(v,i) in left" :key="i" class="list_item_l" :data-id="v.id" @click="checked" :class="{left_select:i==selected}">{{v.text}}</div>
            </scroll-view>
            <scroll-view scroll-y="true" style="height: 100%" lower-threshold="60" @scrolltolower="scrollHandler" class="scroll_right">
                <div v-for="(v,i) in newList" :key="i" class="list_item_r">
                    <img :src="v.img" alt="" class="shop_lis_img">
                    <div class="li_info">
                        <p class="shop_name">{{v.text}}</p>
                        <div class="li_b">
                            <p class="price"><span>¥</span>{{v.price}}</p>
                            <div class="count">
                                <img class="lower" @click="lower" :data-info="v" v-if="v.num>0" src="../../static/lower.png" alt="">
                                <span v-if="v.num>0">{{v.num}}</span>
                                <img class="add" @click="add" :data-info="v" src="../../static/add.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </scroll-view>
        </div>
        <div class="shop_cart">
            <div class="cart_left" @click="blockCart">
                <div class="cart_img">
                    <img src="../../static/cart.png" alt="" v-if="count==0">
                    <img src="../../static/cart-active.png" alt="" v-if="count>0">
                    <i v-if="shopList.length">{{number}}</i>
                </div>
                <p class="money">¥ {{count}}</p>
            </div>
            <div class="cart_right">
                <span class="no_num" v-if="!shopList.length">快去挑选商品吧</span>
                <div v-if="shopList.length" class="settlement" @click="settlement">结算</div>
            </div>
        </div>
        <div class="history" v-if="shopList.length" :class="{history_active:isActive}">
            <div class="shop_rule">
                <p class="pack_price">已选商品</p>
                <p class="clear" @click="clearCart">清空购物车</p>
            </div>
            <ul class="shop_list">
                <li class="lis" v-for="(v,i) in shopList" :key="i" v-if="v.num>0">
                    <p class="shop_list_name">{{v.text}}</p>
                    <p class="shop_list_price">¥{{v.price}}</p>
                    <div class="count">
                        <img class="lower" @click="lower" :data-info="v" v-if="v.num>0" src="../../static/lower.png" alt="">
                        <span v-if="v.num>0">{{v.num}}</span>
                        <img class="add" @click="add" :data-info="v" src="../../static/add.png" alt="">
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                left: [{
                        text: '全部',
                        id: 0
                    }, {
                        text: '热销1',
                        id: 1
                    }, {
                        text: '热销2',
                        id: 2
                    },
                    {
                        text: '热销3',
                        id: 3
                    }
                ],
                right: [{
                        text: '热销1产品1',
                        id: 1,
                        price: 12,
                        img: require('../../static/shop-lis.png'),
                        num: 0,
                        shopId: '001'
                    }, {
                        text: '热销1产品2',
                        id: 1,
                        price: 14,
                        img: require('../../static/shop-lis.png'),
                        num: 0,
                        shopId: '002'
                    },
                    {
                        text: '热销1产品3',
                        id: 1,
                        price: 16,
                        img: require('../../static/shop-lis.png'),
                        num: 0,
                        shopId: '003'
                    },
                    {
                        text: '热销1产品4',
                        id: 1,
                        price: 18,
                        img: require('../../static/shop-lis.png'),
                        num: 0,
                        shopId: '004'
                    }, {
                        text: '热销1产品5',
                        id: 1,
                        price: 10,
                        img: require('../../static/shop-lis.png'),
                        num: 0,
                        shopId: '005'
                    },
                    {
                        text: '热销1产品6',
                        id: 1,
                        price: 8,
                        img: require('../../static/shop-lis.png'),
                        num: 0,
                        shopId: '006'
                    },
                    {
                        text: '热销2产品1',
                        id: 2,
                        price: 12,
                        img: require('../../static/shop-lis.png'),
                        num: 0,
                        shopId: '007'
                    }, {
                        text: '热销2产品2',
                        id: 2,
                        price: 14,
                        img: require('../../static/shop-lis.png'),
                        num: 0,
                        shopId: '008'
                    },
                    {
                        text: '热销2产品3',
                        id: 2,
                        price: 16,
                        img: require('../../static/shop-lis.png'),
                        num: 0,
                        shopId: '009'
                    },
                    {
                        text: '热销2产品4',
                        id: 2,
                        price: 18,
                        img: require('../../static/shop-lis.png'),
                        num: 0,
                        shopId: '010'
                    }, {
                        text: '热销2产品5',
                        id: 2,
                        price: 10,
                        img: require('../../static/shop-lis.png'),
                        num: 0,
                        shopId: '011'
                    },
                    {
                        text: '热销2产品6',
                        id: 2,
                        price: 8,
                        img: require('../../static/shop-lis.png'),
                        num: 0,
                        shopId: '012'
                    },
                    {
                        text: '热销3产品1',
                        id: 3,
                        price: 12,
                        img: require('../../static/shop-lis.png'),
                        num: 0,
                        shopId: '013'
                    }, {
                        text: '热销3产品2',
                        id: 3,
                        price: 14,
                        img: require('../../static/shop-lis.png'),
                        num: 0,
                        shopId: '014'
                    },
                    {
                        text: '热销3产品3',
                        id: 3,
                        price: 16,
                        img: require('../../static/shop-lis.png'),
                        num: 0,
                        shopId: '015'
                    },
                    {
                        text: '热销3产品4',
                        id: 3,
                        price: 18,
                        img: require('../../static/shop-lis.png'),
                        num: 0,
                        shopId: '016'
                    }, {
                        text: '热销3产品5',
                        id: 3,
                        price: 10,
                        img: require('../../static/shop-lis.png'),
                        num: 0,
                        shopId: '017'
                    },
                    {
                        text: '热销3产品6',
                        id: 3,
                        price: 8,
                        img: require('../../static/shop-lis.png'),
                        num: 0,
                        shopId: '018'
                    }
                ],
                newList: [],
                selected: 0,
                shopList: [],
                isActive: false,
            }
        },
        onLoad() {
            let history = wx.getStorageSync('history') || [];
            // console.log(history)
            //针对num等于0的数据仍保留做清空处理
            this.shopList = history.filter(e => e.num != 0)
            // console.log(this.shopList)
            this.right.forEach(e => {
                //针对购物车的商品删除或者减至为0的设置，全部归为初始值
                e.num = 0;
                //空数组不会执行forEach，所以可省略针对this.shopList的length判断
                this.shopList.forEach(ele => {
                    if (e.shopId == ele.shopId) {
                        e.num = ele.num;
                    }
                })
                this.newList = this.newList.length ? this.newList : this.right;
            })
        },
        methods: {
            checked(e) {
                if (e.target.dataset.id == 0) {
                    this.newList = this.right;
                } else {
                    this.newList = this.right.filter(ele => ele.id == e.target.dataset.id)
                }
                this.selected = e.target.dataset.id;
            },
            lower(e) {
                let {
                    info
                } = e.target.dataset;
                this.newList.forEach(ele => {
                    if (ele.shopId == info.shopId) {
                        ele.num--;
                        this.saveData(ele)
                    }
                })
            },
            add(e) {
                let {
                    info
                } = e.target.dataset;
                this.newList.forEach(ele => {
                    if (ele.shopId == info.shopId) {
                        ele.num++;
                        this.saveData(ele)
                    }
                })
            },
            lowerShop(e) {
                let {
                    info
                } = e.target.dataset;
                this.shopList.forEach(ele => {
                    if (ele.shopId == info.shopId) {
                        ele.num--;
                    }
                    this.newList.forEach(item => {
                        if (item.shopId == ele.shopId) {
                            item.num = ele.num;
                        }
                    })
                })
                //针对num等于0的数据仍保留做清空处理
                this.shopList && (this.shopList = this.shopList.filter(e => e.num != 0));
                //购物车为空，列表栏隐藏
                !this.shopList.length && (this.isActive = false)
                wx.setStorageSync('history', this.shopList)
            },
            addShop(e) {
                let {
                    info
                } = e.target.dataset;
                this.shopList.forEach(ele => {
                    if (ele.shopId == info.shopId) {
                        ele.num++;
                    }
                    this.newList.forEach(item => {
                        if (item.shopId == ele.shopId) {
                            item.num = ele.num;
                        }
                    })
                })
                wx.setStorageSync('history', this.shopList)
            },
            saveData(info) {
                // console.log(info)
                // 先获取缓存数据
                let history = wx.getStorageSync('history') || [];
                if (history.length) {
                    let n = history.findIndex(e => e.shopId == info.shopId)
                    //数据存在就赋值，不存在就push
                    if (n >= 0) {
                        history.forEach(e => {
                            if (e.shopId == info.shopId) {
                                e.num = info.num;
                            }
                        })
                    } else {
                        history.push(info)
                    }
                } else {
                    history.push(info)
                }
                //针对num等于0的数据仍保留做清空处理
                this.shopList = history = history.filter(e => e.num != 0)
                // console.log(this.shopList)
                // 再设置缓存数据
                wx.setStorageSync('history', history)
            },
            blockCart() {
                if (this.shopList.length) {
                    this.isActive = !this.isActive;
                } else {
                    this.msg('您还没有选择商品哦')
                }
            },
            clearCart() {
                this.isActive = false;
                this.shopList = [];
                this.newList.forEach(e => {
                    e.num = 0;
                })
                wx.removeStorageSync('history')
            },
            settlement() {
                if (this.shopList.length) {
                    wx.navigateTo({
                        url: '/pages/submit-order/main'
                    })
                } else {
                    this.msg('您还没有选择商品哦')
                }
            },
        },
        computed: {
            count: function() {
                let n = 0;
                this.newList.forEach(e => {
                    if (e.num > 0) {
                        n += e.price * e.num;
                    }
                })
                return this.shopList.length ? n : 0;
            },
            number: function() {
                let number = 0;
                this.newList.forEach(e => {
                    if (e.num > 0) {
                        number += e.num;
                    }
                })
                return this.shopList.length ? number > 99 ? '99+' : number : 0;
            }
        },
        components: {},
        watch: {
            shopList: function(newVal, oldVal) {}
        }
    }
</script>

<style lang="less">
    .store_index {
        height: 100%;
        padding-bottom: 100rpx;
        box-sizing: border-box;
        background: #fff;
    }
    .store_index_list {
        display: flex;
        height: 100%;
        .scroll_left {
            width: 260rpx; // background: #e6e6e6;
            .list_item_l {
                text-align: center;
                padding: 20rpx;
                color: #4d4d4d;
                font-size: 26rpx;
                word-break: break-all;
            }
            .left_select {
                color: #1d1d1d; // background: #fff;
            }
        }
        .scroll_right {
            flex-grow: 1;
            .list_item_r {
                padding: 16rpx;
                border-bottom: 1rpx solid #ebebeb;
                display: flex;
                align-items: center;
                .shop_lis_img {
                    width: 120rpx;
                    height: 120rpx;
                    margin-right: 20rpx;
                }
                .li_info {
                    flex-grow: 1;
                    .shop_name {
                        color: #1d1d1d;
                        font-size: 30rpx;
                        line-height: 60rpx;
                        transform: translateY(-20%);
                    }
                    .li_b {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        .price {
                            color: #f00;
                            line-height: 60rpx;
                            font-size: 32rpx;
                            transform: translateY(20%);
                            span {
                                font-size: 24rpx;
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
                                color: #4d4d4d;
                                margin: 0 12rpx;
                            }
                        }
                    }
                }
            }
            .list_item_r:nth-last-of-type(1) {
                border-bottom: none;
            }
        }
    }
    .store_index::-webkit-scrollbar,
    .scroll_left::-webkit-scrollbar,
    .scroll_right::-webkit-scrollbar {
        display: none;
    }
    .shop_cart {
        height: 100rpx;
        background-color: rgba(70, 70, 70, 1);
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 5;
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
                img {
                    width: 100rpx;
                    height: 100rpx;
                    transform: translateY(-20%);
                }
                i {
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 30rpx;
                    height: 30rpx;
                    line-height: 30rpx;
                    text-align: center;
                    transform: translateY(-80%);
                    background-image: linear-gradient(-22deg, #f21b30 0%, #ff693b 99%), linear-gradient( #ff2929, #ff2929);
                    box-shadow: -4px 4px 8px 0px rgba(177, 5, 5, 0.7);
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
    .history {
        width: 100%;
        transform: translateY(0%);
        transition: transform 0.4s ease;
        .shop_rule {
            display: flex;
            justify-content: space-between;
            padding: 20rpx 35rpx;
            color: #999;
            font-size: 24rpx;
            background: #eaeaea;
            // .pack_price {}
            // .clear {}
        }
        .shop_list {
            width: 100%;
            overflow-x: hidden;
            overflow-y: scroll;
            max-height: 368rpx;
            .lis {
                display: flex;
                justify-content: space-between;
                padding: 20rpx 35rpx;
                background: #fff;
                border-bottom: 1rpx solid #ebebeb;
                
                .shop_list_name{
                    color: #1d1d1d;
                    font-size: 24rpx;
                    transform: translateY(10%);
                }
                    .shop_list_price {
                    color: #666;
                    font-size: 24rpx;
                    transform: translateY(10%);
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
                        color: #4d4d4d;
                        margin: 0 12rpx;
                    }
                }
            }
            .lis:nth-last-of-type(1) {
                border-bottom: none;
            }
        }
    }
    .history_active {
        transform: translateY(-100%);
    }
</style>
