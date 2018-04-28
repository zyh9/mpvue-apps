<template>
    <div class="store_index">
        <div class="store_index_list">
            <scroll-view scroll-y="true" style="height: 100%" lower-threshold="60" @scrolltolower="scrollHandler" class="scroll_left">
                <div v-for="(v,i) in left" :key="i" class="list-item_l" :data-id="v.id" @click="checked" :class="{left_select:i==selected}">{{v.text}}</div>
            </scroll-view>
            <scroll-view scroll-y="true" style="height: 100%" lower-threshold="60" @scrolltolower="scrollHandler" class="scroll_right">
                <div v-for="(v,i) in newList" :key="i" class="list-item_r">
                    <img :src="v.img" alt="">
                    <div class="li_info">
                        <p>{{v.text}}</p>
                        <p>月售100单</p>
                        <div class="li_b">
                            <p class="price">¥{{v.price}}</p>
                            <div class="count">
                                <i class="lower" @click="lower" :data-info="v" v-if="v.num>0">-</i>
                                <span v-if="v.num>0">{{v.num}}</span>
                                <i class="add" @click="add" :data-info="v">+</i>
                            </div>
                        </div>
                    </div>
                </div>
            </scroll-view>
        </div>
        <div class="shop_cart">
            <div class="cart_left" @click="blockCart">
                <img src="" alt="">
                <p class="money">总价格{{count}}</p>
            </div>
            <p class="settlement" @click="settlement">去结算{{count}}元</p>
        </div>
        <div class="history" v-if="shopList.length" :class="{history_active:isActive}">
            <div class="shop_rule">
                <p class="pack_price">包装费2元</p>
                <p class="clear" @click="clearCart">清空购物车</p>
            </div>
            <ul class="shop_list">
                <li class="lis" v-for="(v,i) in shopList" :key="i" v-if="v.num>0">
                    <p class="shop_list_name">{{v.text}}</p>
                    <span class="shop_list_price">¥{{v.price}}</span>
                    <div class="count">
                        <i class="lower" :data-info="v" v-if="v.num>0" @click="lowerShop">-</i>
                        <span v-if="v.num>0">{{v.num}}</span>
                        <i class="add" :data-info="v" @click="addShop">+</i>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import msg from '../utils/toast';
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
                        text: '优惠2',
                        id: 2
                    },
                    {
                        text: '优惠3',
                        id: 3
                    }
                ],
                right: [{
                        text: '热销1产品1',
                        id: 1,
                        price: 12,
                        img: 'https://i.loli.net/2018/04/27/5ae2e812b12e9.jpg',
                        num: 0,
                        shopId: '001'
                    }, {
                        text: '热销1产品2',
                        id: 1,
                        price: 14,
                        img: 'https://i.loli.net/2018/04/27/5ae2e812b12e9.jpg',
                        num: 0,
                        shopId: '002'
                    },
                    {
                        text: '热销1产品3',
                        id: 1,
                        price: 16,
                        img: 'https://i.loli.net/2018/04/27/5ae2e812b12e9.jpg',
                        num: 0,
                        shopId: '003'
                    },
                    {
                        text: '热销1产品4',
                        id: 1,
                        price: 18,
                        img: 'https://i.loli.net/2018/04/27/5ae2e812b12e9.jpg',
                        num: 0,
                        shopId: '004'
                    }, {
                        text: '热销1产品5',
                        id: 1,
                        price: 10,
                        img: 'https://i.loli.net/2018/04/27/5ae2e812b12e9.jpg',
                        num: 0,
                        shopId: '005'
                    },
                    {
                        text: '热销1产品6',
                        id: 1,
                        price: 8,
                        img: 'https://i.loli.net/2018/04/27/5ae2e812b12e9.jpg',
                        num: 0,
                        shopId: '006'
                    },
                    {
                        text: '热销2产品1',
                        id: 2,
                        price: 12,
                        img: 'https://i.loli.net/2018/04/27/5ae2e812b12e9.jpg',
                        num: 0,
                        shopId: '007'
                    }, {
                        text: '热销2产品2',
                        id: 2,
                        price: 14,
                        img: 'https://i.loli.net/2018/04/27/5ae2e812b12e9.jpg',
                        num: 0,
                        shopId: '008'
                    },
                    {
                        text: '热销2产品3',
                        id: 2,
                        price: 16,
                        img: 'https://i.loli.net/2018/04/27/5ae2e812b12e9.jpg',
                        num: 0,
                        shopId: '009'
                    },
                    {
                        text: '热销2产品4',
                        id: 2,
                        price: 18,
                        img: 'https://i.loli.net/2018/04/27/5ae2e812b12e9.jpg',
                        num: 0,
                        shopId: '010'
                    }, {
                        text: '热销2产品5',
                        id: 2,
                        price: 10,
                        img: 'https://i.loli.net/2018/04/27/5ae2e812b12e9.jpg',
                        num: 0,
                        shopId: '011'
                    },
                    {
                        text: '热销2产品6',
                        id: 2,
                        price: 8,
                        img: 'https://i.loli.net/2018/04/27/5ae2e812b12e9.jpg',
                        num: 0,
                        shopId: '012'
                    },
                    {
                        text: '热销3产品1',
                        id: 3,
                        price: 12,
                        img: 'https://i.loli.net/2018/04/27/5ae2e812b12e9.jpg',
                        num: 0,
                        shopId: '013'
                    }, {
                        text: '热销3产品2',
                        id: 3,
                        price: 14,
                        img: 'https://i.loli.net/2018/04/27/5ae2e812b12e9.jpg',
                        num: 0,
                        shopId: '014'
                    },
                    {
                        text: '热销3产品3',
                        id: 3,
                        price: 16,
                        img: 'https://i.loli.net/2018/04/27/5ae2e812b12e9.jpg',
                        num: 0,
                        shopId: '015'
                    },
                    {
                        text: '热销3产品4',
                        id: 3,
                        price: 18,
                        img: 'https://i.loli.net/2018/04/27/5ae2e812b12e9.jpg',
                        num: 0,
                        shopId: '016'
                    }, {
                        text: '热销3产品5',
                        id: 3,
                        price: 10,
                        img: 'https://i.loli.net/2018/04/27/5ae2e812b12e9.jpg',
                        num: 0,
                        shopId: '017'
                    },
                    {
                        text: '热销3产品6',
                        id: 3,
                        price: 8,
                        img: 'https://i.loli.net/2018/04/27/5ae2e812b12e9.jpg',
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
        mounted() {
            let history = wx.getStorageSync('history') || [];
            // console.log(history)
            //针对num等于0的数据仍保留做清空处理
            this.shopList = history.filter(e => e.num != 0)
            console.log(this.shopList)
            if (history.length) {
                this.right.forEach(e => {
                    history.forEach(ele => {
                        if (e.shopId == ele.shopId) {
                            e.num = ele.num;
                        }
                    })
                })
                this.newList = this.newList.length ? this.newList : this.right;
            } else {
                this.newList = this.newList.length ? this.newList : this.right;
            }
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
                this.shopList && (this.shopList = this.shopList.filter(e => e.num != 0))
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
                    history = history.filter(e => e.shopId !== info.shopId)
                    history.push(info)
                } else {
                    history.push(info)
                }
                //针对num等于0的数据仍保留做清空处理
                history = history.filter(e => e.num != 0)
                //针对num等于0的数据仍保留做清空处理
                this.shopList = history.filter(e => e.num != 0)
                // console.log(this.shopList)
                // 再设置缓存数据
                wx.setStorageSync('history', history)
            },
            blockCart() {
                if (this.shopList.length) {
                    this.isActive = !this.isActive;
                } else {
                    msg('您还没有选择商品哦')
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
                    console.log('待开发。。。')
                } else {
                    msg('您还没有选择商品哦')
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
            }
        },
        components: {}
    }
</script>

<style lang="less">
    .store_index {
        height: 100%;
        color: #666;
        font-size: 24rpx;
        padding-bottom: 96rpx;
        box-sizing: border-box;
    }
    .store_index_list {
        display: flex;
        height: 100%;
        .scroll_left {
            width: 260rpx;
            border-right: 1rpx solid #eee;
            .list-item_l {
                text-align: center;
                padding: 20rpx 40rpx;
                border-bottom: 1rpx solid #eee;
                white-space: nowrap;
            }
            .left_select {
                color: skyblue;
            }
        }
        .scroll_right {
            flex-grow: 1;
            .list-item_r {
                padding: 16rpx;
                border-bottom: 1rpx solid #eee;
                display: flex;
                align-items: center;
                img {
                    width: 120rpx;
                    height: 120rpx;
                    margin-right: 20rpx;
                }
                .li_info {
                    flex-grow: 1;
                    .li_b {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        .price {
                            color: #f00;
                        }
                        .count {
                            display: flex;
                            align-items: center;
                            .lower,
                            .add {
                                width: 30rpx;
                                height: 30rpx;
                                border-radius: 50%;
                                background: #2395ff;
                                color: #fff;
                                line-height: 30rpx;
                                text-align: center;
                            }
                            span {
                                margin: 0 16rpx;
                            }
                        }
                    }
                }
            }
        }
    }
    .store_index::-webkit-scrollbar,
    .scroll_left::-webkit-scrollbar,
    .scroll_right::-webkit-scrollbar {
        display: none;
    }
    .shop_cart {
        height: 96rpx;
        background: #ddd;
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 5;
        .cart_left {
            flex-flow: 1;
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 100%;
            img {
                width: 60rpx;
                height: 60rpx;
                background: #f00;
                margin-left: 20rpx;
            }
            .money {
                color: #666;
                font-size: 24rpx;
                margin-left: 20rpx;
            }
        }
        .settlement {
            height: 100%;
            color: #fff;
            background: #ff8b03;
            font-size: 24rpx;
            white-space: nowrap;
            padding: 0 30rpx;
            display: flex;
            align-items: center;
        }
    }
    .history {
        width: 100%;
        background: #ddd;
        transform: translateY(0%);
        transition: transform 0.4s ease;
        .shop_rule {
            display: flex;
            justify-content: space-between;
            padding: 20rpx;
            color: #666;
            font-size: 24rpx;
            .pack_price {}
            .clear {}
        }
        .shop_list {
            width: 100%;
            overflow: hidden;
            .lis {
                display: flex;
                justify-content: space-between;
                padding: 20rpx;
                .shop_list_name {
                    color: #666;
                    font-size: 24rpx;
                }
                .shop_list_price {
                    color: #666;
                    font-size: 24rpx;
                }
                .count {
                    display: flex;
                    align-items: center;
                    .lower,
                    .add {
                        width: 30rpx;
                        height: 30rpx;
                        border-radius: 50%;
                        background: #2395ff;
                        color: #fff;
                        line-height: 30rpx;
                        text-align: center;
                    }
                    span {
                        margin: 0 16rpx;
                    }
                }
            }
        }
    }
    .history_active {
        transform: translateY(-100%);
    }
</style>
