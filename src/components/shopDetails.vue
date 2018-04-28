<template>
    <div class="shop_details">
        <div class="address">
            <img src="" alt="" class="icon">
            <p>地址：河南省郑州市金水区航海路与嵩山路交叉口200米路东11111111</p>
        </div>
        <div class="shop_info_list">
            <div class="shop_tel" @click="tel">
                <img src="" alt="" class="icon">
                <p>商家电话</p>
            </div>
            <div class="shop_wx" @click="copyWx">
                <img src="" alt="" class="icon">
                <p>商家微信</p>
            </div>
        </div>
        <div class="shop_service">
            <img src="" alt="" class="icon">
            <p>UU跑腿配送</p>
        </div>
        <div class="shop_business">
            <img src="" alt="" class="icon">
            <p>营业时间：9:00-20:00</p>
        </div>
    </div>
</template>

<script>
    import msg from '../utils/toast';
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
                        msg("复制成功")
                    },
                    fail: err => {
                        msg("复制失败")
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
        background: #f5f5f5;
        overflow: hidden;
        .address {
            margin-top: 20rpx;
            background: #fff;
            display: flex;
            padding: 20rpx;
            align-items: center;
            justify-content: flex-start;
            .icon {
                width: 50rpx;
                height: 50rpx;
                margin-right: 20rpx;
                background: #f00;
            }
            p {
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
        .shop_info_list {
            margin-top: 20rpx;
            display: flex;
            padding: 20rpx;
            align-items: center;
            background: #fff;
            .shop_tel,
            .shop_wx {
                flex-grow: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                .icon {
                    width: 50rpx;
                    height: 50rpx;
                    margin-right: 20rpx;
                    background: #f00;
                }
                p {
                    font-size: 24rpx;
                    color: #666;
                }
            }
        }
        .shop_service,
        .shop_business {
            margin-top: 20rpx;
            background: #fff;
            padding: 20rpx;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .icon {
                width: 50rpx;
                height: 50rpx;
                margin-right: 20rpx;
                background: #f00;
            }
            p {
                font-size: 24rpx;
                color: #666;
            }
        }
    }
</style>
