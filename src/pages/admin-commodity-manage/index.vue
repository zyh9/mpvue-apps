<template>
    <div class="admin-commodity-manage">
        <ul class="admin-commodity-manage_top">
            <li v-for="(v,i) in info" :key="i" :class="{li_select:i==currentTab}" :data-current="i" @click="swichNav">{{v.name}}</li>
        </ul>
        <swiper :current="currentTab" class="swiper-box" duration="300" :style="{height:winHeight+'px'}" @change="bindChange">
            <swiper-item v-for="(v,i) in info" :key="i">
                <scroll-view scroll-y="true" style="height: 100%">
                    <ul class="admin-commodity-manage_list" :style="{paddingBottom:fixedVal+'px'}">
                        <li class="commodity_item" v-for="(item,index) in newList" :key="index">
                            <div class="commodity_item_top">
                                <div class="top_img_info">
                                    <img src="../../../static/jp.jpg" alt="">
                                    <p>{{item.text}}</p>
                                </div>
                                <div class="top_shop_info">
                                    <p>商品1</p>
                                    <span>商品分类</span>
                                    <i>价格¥12 价格¥12 价格¥12</i>
                                </div>
                            </div>
                            <div class="commodity_item_bot">
                                <p class="time">2018/05/01 12:12:12</p>
                            </div>
                        </li>
                    </ul>
                </scroll-view>
            </swiper-item>
        </swiper>
        <div class="commodity_bottom" v-if="currentTab == 0">
            <p>批量操作</p>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                info: [{
                        name: '全部'
                    }, {
                        name: '上架中'
                    }, {
                        name: '下架中'
                    },
                    {
                        name: '停售中'
                    }
                ],
                orderList: [{
                    type: 0,
                    text: '上架中'
                }, {
                    type: 0,
                    text: '上架中'
                }, {
                    type: 0,
                    text: '上架中'
                }, {
                    type: 0,
                    text: '上架中'
                }, {
                    type: 1,
                    text: '下架中'
                }, {
                    type: 1,
                    text: '下架中'
                }, {
                    type: 2,
                    text: '停售中'
                }, {
                    type: 2,
                    text: '停售中'
                }],
                winWidth: 0,
                winHeight: 0,
                // tab切换  
                currentTab: 0,
                botHeight: 0,
            }
        },
        onShow() { //页面渲染就会触发
            this.currentTab = 0;
        },
        mounted() {
            let query = wx.createSelectorQuery();
            query.select('.admin-commodity-manage_top').boundingClientRect()
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
            query.select('.commodity_bottom').boundingClientRect()
            query.exec(res => {
                this.botHeight = res[1].height;
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
            newList: function() {
                // console.log(this.currentTab)
                switch (this.currentTab) {
                    case 0:
                        return this.orderList;
                        break;
                    case 1:
                        return this.orderList.filter(e => e.type == 0);
                        break;
                    case 2:
                        return this.orderList.filter(e => e.type == 1);
                        break;
                    case 3:
                        return this.orderList.filter(e => e.type == 2);
                        break;
                }
            },
            fixedVal: function() {
                return this.currentTab > 0 ? 0 : this.botHeight;
            }
        },
        components: {}
    }
</script>

<style lang="less">
    .admin-commodity-manage {
        height: 100%;
        background: #f5f5f5;
    }
    .admin-commodity-manage_top {
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
    .admin-commodity-manage_list {
        overflow: hidden;
        .commodity_item {
            background: #fff;
            border-bottom: 1rpx solid #e6e6e6;
            padding: 20rpx;
            .commodity_item_top {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .top_img_info {
                    position: relative;
                    margin-right: 30rpx;
                    img {
                        width: 100rpx;
                        height: 100rpx;
                    }
                    p {
                        position: absolute;
                        width: 100%;
                        bottom: 0;
                        left: 0;
                        background: #ccc;
                        color: #666;
                        font-size: 24rpx;
                        text-align: center;
                    }
                }
                .top_shop_info {
                    flex-grow: 1;
                    p {
                        color: #333;
                        font-size: 28rpx;
                    }
                    span,
                    i {
                        color: #666;
                        font-size: 24rpx;
                    }
                }
            }
            .commodity_item_bot {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .time {
                    color: #666;
                    font-size: 24rpx;
                }
            }
        }
    }
    .commodity_bottom {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        p {
            width: 100%;
            background: skyblue;
            margin: 0 auto;
            text-align: center;
            height: 80rpx;
            line-height: 80rpx;
            border-radius: 8rpx;
            color: #fff;
            font-size: 30rpx;
        }
    }
</style>
