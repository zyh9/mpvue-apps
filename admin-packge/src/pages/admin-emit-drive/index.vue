<template>
    <div class="admin-express-list">
        <!-- 已有配置信息 -->
        <div class="list" v-if="!emit">
            <div class="main ">
                <div class="title">
                    <div class="label">UU跑腿规则</div>
                    <div class="item" @click='emit=true'><i class="icon icon_adminEmit"></i>编辑规则</div>
                </div>
                <div class="info">
                    <div class="option">
                        <div>配送类型选择</div>
                        <span>UU{{info.DefaultServiceType==1?'专送':'快送'}}服务</span>
                    </div>
                    <div class="option">
                        <div>保温箱配送</div>
                        <span>{{info.DefaultWarmBox==1?'需要':'不需要'}}</span>
                    </div>
                    <div class="option">
                        <div>取件时电话联系</div>
                        <span>{{info.DefaultCallMeWithTake==1?'需要':'不需要'}}</span>
                    </div>
                    <div class="option"  v-if='info.DefaultCallMeWithTake==1'>
                        <div>联系电话</div>
                        <span>{{info.DefaultTakeUserMobile}}</span>
                    </div>
                </div>
            </div>
            <div class="tips">选择不同配送类型有不同计价规则</div>
            <div class="rule" @click="goRule">查看UU计价规则</div>
        </div>
        <!-- 编辑信息 -->
        <div class="emit" v-if='emit'>
            <div class="main">
                <div class="option">
                    <div class="label">默认配送类型</div>
                    <div class="item">
                        <!-- <div @click='info.DefaultServiceType=2'><i class="icon icon_adminCheck" :class="{icon_adminChecked:info.DefaultServiceType==2}"></i>UU快送</div> -->
                        <div @click='info.DefaultServiceType=1'><i class="icon icon_adminCheck" :class="{icon_adminChecked:info.DefaultServiceType==1}"></i>UU专送</div>
                    </div>
                </div>
                <div class="option">
                    <div class="label">保温箱配送</div>
                    <div class="item">
                        <switch @change="hotBox" :checked='info.DefaultWarmBox==1?true:false' class="witch" />
                    </div>
                </div>
                <div class="option">
                    <div class="label">取件时电话联系</div>
                    <div class="item">
                        <switch @change="businessChange" :checked='info.DefaultCallMeWithTake==1?true:false' class="witch" />
                    </div>
                </div>
                <div class="option">
                    <div class="label">联系电话</div>
                    <div class="item"><input type="number" placeholder-class='placeholderStyle' placeholder="请输入联系电话" maxlength="11" v-model="info.DefaultTakeUserMobile"> </div>
                </div>
            </div>
            <div class="btn on" @click="setInfo">保存</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                info: {
                    DefaultServiceType: '',
                    /* 1专送；2：快送 */
                    DefaultWarmBox: '',
                    /* 是否需要保温箱 */
                    DefaultTakeUserMobile: '',
                    /* 默认取件电话 */
                    DefaultCallMeWithTake: '',
                    /* 是否给我打电话 */
                },
                emit: false,
            }
        },
        onShow() {
            this.emit = false;
            this.info = {
                    DefaultServiceType: '',
                    DefaultWarmBox: '',
                    DefaultTakeUserMobile: '',
                    DefaultCallMeWithTake: '',
                },
            this.getInfo();
        },
        mounted() {
            // this.getInfo();
        },
        methods: {
            getInfo() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/GetPaotuiSetting',
                    data: {
                        ShopId: wx.getStorageSync('loginInfo').ShopID || ''
                    }
                }).then(res => {
                    console.log(res)
                    if (res.State == 1) {
                        this.info = res.Body;
                    }else {
                        this.msg(res.Msg)
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            setInfo() {
                let reg = /^[1][3,4,5,6,7,8,9]\d{9}$/;
                if (!reg.test(this.info.DefaultTakeUserMobile)) {
                    this.msg('请输入正确手机号码')
                    return
                }
                let datainfo = Object.assign({}, this.info, {
                    ShopId: wx.getStorageSync('loginInfo').ShopID || ''
                });
                this.util.post({
                    url: '/api/Merchant/ShopManage/UpdatePaotuiSetting',
                    data: datainfo
                }).then(res => {
                    if (res.State == 1) {
                        this.msg('修改成功');
                        setTimeout(()=>{
                            this.emit=false;
                            this.getInfo();
                        },300)
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            goRule() {
                wx.navigateTo({
                    url: '/pages/admin-rule-price'
                })
            },
            hotBox(e) {
                this.info.DefaultWarmBox = e.mp.detail.value ? 1 : 0;
            },
            businessChange(e) {
                this.info.DefaultCallMeWithTake = e.mp.detail.value ? 1 : 0;
            },
        },
        components: {},
    }
</script>

<style lang="less">
    .admin-express-list {
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
                        &:after{
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
        .emit {
            .main {
                background: #fff;
                .option {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-left: 36rpx;
                    padding-right: 36rpx;
                    position: relative;
                    &::after{
                        content: '';
                        display: block;
                        width: 100%;
                        height: 0;
                        border-bottom: 1PX solid #ebebeb;
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        transform: scaleY(0.5);
                        transform-origin: 0 0;
                    }
                    &:last-child{
                        &::after{
                            display: none;
                        }
                    }
                    .label {
                        font-size: 32rpx;
                        color: #1a1a1a;
                        padding: 36rpx 0;
                        width: 250rpx;
                    }
                    .item {
                        display: flex;
                        font-size: 32rpx;
                        color: #1a1a1a;
                        flex:1;
                        justify-content: flex-end;
                        div {
                            font-size: 30rpx;
                            color: #1a1a1a;
                            margin-left: 25rpx;
                            .icon {
                                margin-right: 10rpx;
                                vertical-align: middle;
                            }
                        }
                        input {
                            font-size: 30rpx;
                            color: #1a1a1a;
                            line-height: 34rpx;
                            text-align: right;
                        }
                        .placeholderStyle {
                            font-size: 30rpx;
                            color: #ccc;
                            line-height: 34rpx;
                        }
                    }
                }
            }
        }
        .btn {
            margin: 43rpx 36rpx 0;
            text-align: center;
            line-height: 88rpx;
            background: #ccc;
            font-size: 28rpx;
            color: #fff;
            &.on {
                background: #4b6df8;
            }
        }
        .witch{
            transform: scale(0.8);
            margin-right: -20rpx;
        }
        // .wx-switch-input {
        //     width: 44px !important;
        //     height: 22px !important;
        // }
        // .wx-switch-input::before {
        //     width: 43px !important;
        //     height: 22px !important;
        //     background: #ccc!important;
        // }
        // .wx-switch-input::after {
        //     width: 20px !important;
        //     height: 20px !important;
        // }
    }
</style>
