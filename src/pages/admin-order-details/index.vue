<template>
    <div class="admin_order_details">
        <div class="order_status">待接单</div>
        <div class="admin_order_details_con">
            <div class="user_info_sum">
                <div class="user_info">
                    <img src="../../../static/userImg.png" alt="">
                    <p>高先生</p>
                </div>
                <img src="../../../static/userImg.png" alt="" class="user_tel" @click="tel">
            </div>
            <ul class="con_order_list">
                <li v-for="(v,i) in 3" :key="i" class="con_list_item">
                    <div class="lis_left">
                        <img src="../../../static/jp.jpg" alt="">
                        <div class="li_info">
                            <p>番茄烤肉拌饭</p>
                            <p class="price">¥12元</p>
                        </div>
                    </div>
                    <div class="num">X 2</div>
                    <div class="sum">24元</div>
                </li>
            </ul>
            <div class="consume">
                <p>配送费</p>
                <p>10元</p>
            </div>
            <div class="consume">
                <p>打包费</p>
                <p>10元</p>
            </div>
            <div class="consume_sum">
                <p>小计：66元</p>
            </div>
        </div>
        <div class="order_pay_info">
            <div class="options">
                <p>支付方式</p>
                <p>微信支付</p>
            </div>
            <div class="options">
                <p>备注</p>
                <p>备注内容</p>
            </div>
            <div class="options">
                <p>配送方式</p>
                <p>UU专送 立即配送</p>
            </div>
            <div class="options">
                <p>收货地址</p>
                <p>北京市朝阳区将府家园北里11号楼1101室北京市朝阳区将府家园北里11号楼1101室</p>
            </div>
            <div class="options">
                <p>订单号</p>
                <p>123456789</p>
            </div>
            <div class="options">
                <p>订单时间</p>
                <p>2018/05/01 12:12:12</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        mounted() {},
        methods: {
            tel() {
                wx.makePhoneCall({
                    phoneNumber: '13837987714'
                })
            },
        },
        components: {}
    }
</script>

<style lang="less">
    .admin_order_details {
        height: 100%;
        background: #f5f5f5;
        overflow-x: hidden;
        .order_status {
            height: 80rpx;
            background: #ccc;
            text-align: center;
            line-height: 80rpx;
            color: #333;
            font-size: 26rpx;
        }
        .admin_order_details_con {
            margin-bottom: 20rpx;
            .user_info_sum {
                background: #fff;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20rpx;
                border-bottom: 1rpx solid #e6e6e6;
                .user_info {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    img {
                        width: 50rpx;
                        height: 50rpx;
                        margin-right: 20rpx;
                    }
                    p {
                        white-space: nowrap;
                        color: #666;
                    }
                }
                .user_tel {
                    width: 50rpx;
                    height: 50rpx;
                }
            }
            .con_order_list {
                background: #fff;
                .con_list_item {
                    padding: 12rpx 30rpx;
                    border-bottom: 1rpx solid #eee;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .lis_left {
                        display: flex;
                        align-items: center;
                        img {
                            width: 80rpx;
                            height: 80rpx;
                            margin-right: 20rpx;
                        }
                        .li_info {
                            p {
                                font-size: 24rpx;
                                color: #666;
                            }
                            .price {
                                color: #f00;
                            }
                        }
                    }
                    .num,
                    .sum {
                        font-size: 24rpx;
                        color: #666;
                    }
                }
            }
            .consume {
                background: #fff;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20rpx;
                border-bottom: 1rpx solid #e6e6e6;
                p {
                    font-size: 24rpx;
                    white-space: nowrap;
                    color: #666;
                }
            }
            .consume_sum {
                background: #fff;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                padding: 20rpx;
                border-bottom: 1rpx solid #e6e6e6;
                p {
                    font-size: 30rpx;
                    white-space: nowrap;
                    color: #666;
                }
            }
        }
        .order_pay_info {
            margin-bottom: 20rpx;
            .options {
                background: #fff;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: 20rpx;
                border-bottom: 1rpx solid #e6e6e6;
                p {
                    color: #666;
                    font-size: 24rpx;
                }
                p:nth-of-type(1) {
                    width: 140rpx;
                    text-align: left;
                    white-space: nowrap;
                    margin-right: 20rpx;
                }
                p:nth-of-type(2) {
                    flex-grow: 1;
                    width: 100%;
                }
            }
        }
    }
</style>
