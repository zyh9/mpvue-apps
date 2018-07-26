<template>
    <div class="vip_recharge">
        <div class="recharge_con">
            <div class="info"><i class="icon icon_price"></i>
                <p>送1000元成为高级会员</p>
            </div>
            <ul class="recharge_list">
                <li v-for="(v,i) in 7" :key="i" :class="{active:lisActive==i}">100元</li>
            </ul>
        </div>
        <div class="recharge_bot">
            <div class="bot_left">
                <div class="money_sum"><span>合计:</span><i>¥</i>111</div>
                <p>送200元余额成为高级会员送200元余额成为高级会员</p>
            </div>
            <button class="sum" plain="true">充值</button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                lisActive: 0,
            }
        },
        onShow() {},
        methods: {},
        computed: {},
    }
</script>

<style lang="less">
    page {
        background: #fff;
    }
    .vip_recharge {
        height: 100%;
        position: relative;
        padding-bottom: 136rpx;
        box-sizing: border-box;
        .recharge_con {
            padding: 36rpx;
            box-sizing: border-box;
            height: 100%;
            overflow-x: hidden;
            overflow-y: scroll;
            .info {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                p {
                    font-size: 28rpx;
                    color: #1a1a1a;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            .recharge_list {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                flex-wrap: wrap;
                li {
                    width: 328rpx;
                    height: 110rpx;
                    background-color: #f5f5f5;
                    border-radius: 6rpx;
                    margin-top: 24rpx;
                    font-size: 32rpx;
                    text-align: center;
                    line-height: 110rpx;
                    color: #ccc;
                }
                .active {
                    background-color: #ff4d3a;
                    color: #fff;
                }
            }
        }
        .recharge_bot {
            width: 100%;
            height: 136rpx;
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            position: absolute;
            bottom: 0;
            right: 0;
            left: 0;
            z-index: 5;
            padding: 0 35rpx;
            box-sizing: border-box;
            z-index: 5;
            &:after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                border-top: 1px solid #ebebeb;
                position: absolute;
                left: 0;
                top: 0;
                transform: scaleY(0.5);
                transform-origin: 0 0;
            }
            .bot_left {
                flex: 1;
                line-height: 1;
                .money_sum {
                    font-size: 48rpx;
                    color: #ff4d3a;
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    margin-bottom: 10rpx;
                    span {
                        font-size: 30rpx;
                        margin-right: 10rpx;
                        color: #1a1a1a;
                    }
                    i {
                        font-size: 30rpx;
                        margin-right: 6rpx;
                    }
                }
                p {
                    font-size: 28rpx;
                    color: #666;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    width: 350rpx;
                }
            }
            .sum {
                width: 232rpx;
                height: 80rpx;
                background-color: #ff4d3a;
                border-radius: 8rpx;
                font-size: 30rpx;
                color: #fff;
                line-height: 80rpx;
                text-align: center;
                border: 0;
            }
        }
    }
</style>
