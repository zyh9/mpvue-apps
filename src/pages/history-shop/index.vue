<template>
    <div class="histoty_shop">
        <ul class="histoty_shop_top">
            <li v-for="(v,i) in info" :key="i" :class="{li_select:i==currentTab}" :data-current="i" @click="swichNav">{{v.name}}</li>
        </ul>
        <swiper :current="currentTab" class="swiper-box" duration="300" :style="{height:winHeight+'px'}" @change="bindChange">
            <swiper-item v-for="(v,i) in info" :key="i">
                <scroll-view scroll-y="true" style="height: 100%">
                    <ul class="history_shop_list">
                        <li class="history_item" v-for="(item,index) in newHistory" :key="index">
                            <div class="item_top">
                                <div class="item_left">
                                    <img src="../../../static/userImg.png" alt="" class="item_left_img">
                                    <div class="item_left_text">
                                        <p class="name">XXXXX的便利店</p>
                                        <p class="address">地址：河南省郑州市金水区航海路与嵩山路交叉口200米路东</p>
                                        <p class="time">营业时间：9:00-22:00</p>
                                    </div>
                                </div>
                                <img src="../../../static/userImg.png" alt="" class="item_right_img">
                            </div>
                            <div class="item_bottom">
                                <p>最后访问：2017/01/21 22:22:22</p>
                                <p>累计访问：28次</p>
                            </div>
                        </li>
                    </ul>
                </scroll-view>
            </swiper-item>
        </swiper>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                info: [{
                    name: '我浏览过的'
                }, {
                    name: '我买过的'
                }],
                winWidth: 0,
                winHeight: 0,
                // tab切换  
                currentTab: 0,
                historyrList: [{
                    type: 0,
                    text: '我浏览过的'
                }, {
                    type: 0,
                    text: '我浏览过的'
                }, {
                    type: 0,
                    text: '我浏览过的'
                }, {
                    type: 0,
                    text: '我浏览过的'
                }, {
                    type: 0,
                    text: '我浏览过的'
                }, {
                    type: 0,
                    text: '我浏览过的'
                }, {
                    type: 1,
                    text: '我买过的'
                }, {
                    type: 1,
                    text: '我买过的'
                }],
            }
        },
        onShow() { //页面渲染就会触发
            this.currentTab = 0;
            let history = wx.getStorageSync('history') || [];
            console.log(history)
        },
        mounted() {
            let query = wx.createSelectorQuery();
            query.select('.histoty_shop_top').boundingClientRect()
            query.exec(res => {
                // console.log(res)
            })
            wx.getSystemInfo({
                success: res => {
                    // console.log(res)
                    this.winWidth = res.windowWidth;
                    //减去上方的高度
                    this.winHeight = res.windowHeight - 34;
                }
            })
        },
        methods: {
            //点击切换
            swichNav(e) {
                // console.log(e)
                if (this.currentTab === e.target.dataset.current) return;
                this.currentTab = e.target.dataset.current;
            },
            //滑动切换
            bindChange(e) {
                // console.log(e)
                this.currentTab = e.target.current
            },
        },
        computed: {
            newHistory: function() {
                console.log(this.currentTab)
                switch (this.currentTab) {
                    case 0:
                        return this.historyrList.filter(e => e.type == 0);
                        break;
                    case 1:
                        return this.historyrList.filter(e => e.type == 1);
                        break;
                }
            }
        },
        components: {}
    }
</script>

<style lang="less">
    .histoty_shop {
        height: 100%;
        background: #f5f5f5;
    }
    .histoty_shop_top {
        display: flex;
        justify-content: space-around;
        align-items: center;
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
    .history_shop_list {
        overflow: hidden;
        .history_item {
            background: #fff;
            margin-top: 20rpx;
            .item_top {
                padding: 20rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1rpx solid #e6e6e6;
                .item_left {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    .item_left_img {
                        width: 100rpx;
                        height: 100rpx;
                        display: block;
                    }
                    .item_left_text {
                        padding: 0 30rpx;
                        flex-grow: 1;
                        .name,
                        .time {
                            font-size: 24rpx;
                            color: #666;
                        }
                        .address {
                            font-size: 24rpx;
                            color: #666;
                            display: -webkit-box !important;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            word-break: break-all;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2;
                        }
                    }
                }
                .item_right_img {
                    width: 60rpx;
                    height: 60rpx;
                    display: block;
                }
            }
            .item_bottom {
                padding: 10rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;
                p {
                    font-size: 24rpx;
                    color: #666;
                }
            }
        }
        .history_item:nth-last-of-type(1) {
            margin-bottom: 20rpx;
        }
    }
</style>
