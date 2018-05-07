<template>
    <div class="shop_details">
        <div class="address">
            <p class="address_text">店铺地址</p>
            <p class="address_info">河南省郑州市金水区航海路与嵩山路交叉口200米路东11111111</p>
        </div>
        <div class="shop_service">
            <p class="text">配送服务</p>
            <p class="info">UU跑腿配送</p>
        </div>
        <div class="shop_business">
            <p class="text">营业时间</p>
            <p class="info">9:00-20:00</p>
        </div>
        <div class="shop_info_list">
            <div class="shop_tel" @click="tel">
                <img src="../../static/shop-tel.png" alt="" class="icon">
                <p>商家电话</p>
            </div>
            <div class="shop_wx" @click="copyWx">
                <img src="../../static/shop-wx.png" alt="" class="icon">
                <p>商家微信</p>
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
            copyWx() {
                wx.setClipboardData({
                    data: 'zyh941109',
                    success: res => {
                        this.msg("复制成功")
                    },
                    fail: err => {
                        this.msg("复制失败")
                    }
                })
            }
        },
        components: {}
    }
</script>

<style lang="less">
    .shop_details {
        height: 100%;
        background: #fff;
        overflow: hidden;
        .address {
            background: #fff;
            display: flex;
            padding: 20rpx 35rpx;
            align-items: center;
            justify-content: flex-start;
            border-bottom: 1rpx solid #ebebeb;
            .address_text {
                font-size: 28rpx;
                color: #5e5e5e;
                white-space: nowrap;
            }
            .address_info {
                flex-grow: 1;
                padding-left: 30rpx;
                font-size: 28rpx;
                color: #999;
                display: -webkit-box !important;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                word-break: break-all;
            }
        }
        .shop_service,
        .shop_business {
            background: #fff;
            padding: 20rpx 35rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1rpx solid #ebebeb;
            .text {
                font-size: 28rpx;
                color: #5e5e5e;
                white-space: nowrap;
            }
            .info{
                font-size: 28rpx;
                color: #999;
            }
        }
        .shop_business{
            border-bottom: none;
        }
        .shop_info_list {
            display: flex;
            padding: 20rpx 35rpx;
            align-items: center;
            background: #fff;
            .shop_tel,
            .shop_wx {
                flex-grow: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #f5f5f5;
                padding: 20rpx 0;
                border-radius: 8rpx;
                .icon {
                    width: 30rpx;
                    height: 30rpx;
                    margin-right: 8rpx;
                }
                p {
                    font-size: 24rpx;
                    color: #666;
                }
            }
            .shop_tel{
                margin-right: 20rpx;
            }
        }
        
    }
</style>
