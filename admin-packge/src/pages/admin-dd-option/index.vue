<template>
    <div class="admin_dd_option">
        <!-- 已有配置信息 -->
        <div class="list">
            <div class="main ">
                <div class="title">
                    <div class="label">达达跑腿规则</div>
                    <div class="item" @click='edit'><i class="icon icon_adminEmit"></i>编辑规则</div>
                </div>
                <div class="info">
                    <div class="option">
                        <div>达达配送开关</div>
                        <span>{{getInfo.OpenState?'开启':'暂未开通'}}</span>
                    </div>
                    <div class="option">
                        <div>经营行业</div>
                        <span>{{getInfo.BusinessName?getInfo.BusinessName:'暂未设置'}}</span>
                    </div>
                    <div class="option">
                        <div>联系人</div>
                        <span>{{getInfo.ContactName?getInfo.ContactName:'暂无信息'}}</span>
                    </div>
                    <div class="option">
                        <div>联系电话</div>
                        <span>{{getInfo.Phone?getInfo.Phone:'暂无信息'}}</span>
                    </div>
                </div>
            </div>
            <!-- <div class="tips">选择不同配送类型有不同计价规则</div>
                                                                <div class="rule" @click="goRule">查看达达计价规则</div> -->
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                getInfo: {}
            }
        },
        onShow() {
            if (wx.getStorageSync('dada')) {
                this.getInfo = wx.getStorageSync('dada');
            }
        },
        mounted() {},
        methods: {
            edit() {
                wx.navigateTo({
                    url: '/pages/admin-dd-set'
                })
            }
        },
        components: {},
        onUnload(){
            wx.removeStorageSync('dada');
        }
    }
</script>

<style lang="less">
    .admin_dd_option {
        background: #eeeef4;
        padding-bottom: 102rpx;
        height: 100%;
        overflow-y: scroll;
        box-sizing: border-box;
        .list {
            .main {
                background: #fff;
                margin-bottom: 36rpx;
                .title {
                    height: 56rpx;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 28rpx 0;
                    margin: 0 36rpx;
                    .label {
                        font-size: 32rpx;
                        color: #1a1a1a;
                        font-weight: 900;
                    }
                    .item {
                        font-size: 24rpx;
                        color: #0863ee;
                        margin-right: 5rpx;
                        width: 160rpx;
                        height: 56rpx;
                        text-align: center;
                        line-height: 56rpx;
                        position: relative;
                        &:after {
                            content: '';
                            display: block;
                            width: 200%;
                            height: 200%;
                            position: absolute;
                            top: 0;
                            left: 0;
                            transform: scale(0.5);
                            transform-origin: 0 0;
                            border: 1rpx solid #0863ee;
                        }
                        .icon {
                            margin-right: 5rpx;
                            vertical-align: middle;
                            margin-top: -4rpx;
                        }
                    }
                }
                .info {
                    border-top: 1rpx solid #ebebeb;
                    margin: 0 36rpx;
                    padding: 26rpx 0;
                    .option {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        height: 56rpx;
                        div {
                            font-size: 28rpx;
                            color: #1a1a1a;
                        }
                        span {
                            font-size: 28rpx;
                            color: #999;
                        }
                    }
                }
            }
            .tips {
                font-size: 22rpx;
                color: #999;
                padding-left: 36rpx;
                line-height: 40rpx;
            }
            .rule {
                font-size: 22rpx;
                color: #0863ee;
                padding-left: 36rpx;
                line-height: 40rpx;
            }
        }
    }
</style>
