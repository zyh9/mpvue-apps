<template>
    <div class="my_order">
        <ul class="my_order_top">
            <li v-for="(v,i) in info" :key="i" :class="{li_select:i==currentTab}" :data-current="i" @click="swichNav">{{v.name}}</li>
        </ul>
        <swiper :current="currentTab" class="swiper-box" duration="300" :style="{height:winHeight+'px'}" @change="bindChange">
            <swiper-item v-for="(v,i) in info" :key="i">
                <ul>
                    <li v-for="(item,index) in newOrder" :key="index">{{item.text}}</li>
                </ul>
            </swiper-item>
        </swiper>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                info: [{
                        name: '全部'
                    }, {
                        name: '待支付'
                    }, {
                        name: '待完成'
                    },
                    {
                        name: '已完成'
                    },
                    {
                        name: '已取消'
                    }
                ],
                orderList: [{
                    type: 0,
                    text: '待支付订单'
                }, {
                    type: 0,
                    text: '待支付订单'
                }, {
                    type: 1,
                    text: '待完成订单'
                }, {
                    type: 1,
                    text: '待完成订单'
                }, {
                    type: 2,
                    text: '已完成订单'
                }, {
                    type: 2,
                    text: '已完成订单'
                }, {
                    type: 3,
                    text: '已取消订单'
                }, {
                    type: 3,
                    text: '已取消订单'
                }, ],
                winWidth: 0,
                winHeight: 0,
                // tab切换  
                currentTab: 0,
            }
        },
        mounted() {
            let query = wx.createSelectorQuery();
            query.select('.my_order_top').boundingClientRect()
            query.exec(res => {
                // console.log(res)
            })
            wx.getSystemInfo({
                success: res => {
                    // console.log(res)
                    this.winWidth = res.windowWidth;
                    //减去上方的高度
                    this.winHeight = res.windowHeight - 136;
                }
            })
        },
        methods: {
            swichNav(e) {
                // console.log(e)
                if (this.currentTab === e.target.dataset.current) return;
                this.currentTab = e.target.dataset.current;
            }
        },
        computed: {
            newOrder: function() {
                console.log(this.currentTab)
                switch (this.currentTab) {
                    case 0:
                        return this.orderList;
                        break;
                    case 1:
                        return this.orderList.filter(e=>e.type==0);
                        break;
                    case 2:
                        return this.orderList.filter(e=>e.type==1);
                        break;
                    case 3:
                        return this.orderList.filter(e=>e.type==2);
                        break;
                    case 4:
                        return this.orderList.filter(e=>e.type==3);
                        break;
                }
            }
        },
        components: {}
    }
</script>

<style lang="less">
    .my_order_top {
        display: flex;
        justify-content: space-around;
        align-items: center;
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
</style>
