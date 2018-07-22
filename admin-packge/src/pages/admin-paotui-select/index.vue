<template>
    <div class="admin_paotui_select">
        <div class="list">
            <div class="options" @click="uuOptions">
                <p>UU跑腿</p>
                <i class="icon icon_arrowRight"></i>
            </div>
            <div class="options" @click="ddOptions">
                <p>达达跑腿</p>
                <i class="icon icon_arrowRight"></i>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        methods: {
            ddOptions() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/GetDaDaShopDetail',
                    data: {
                        ShopID: wx.getStorageSync('loginInfo').ShopID || ''
                    }
                }).then(res => {
                    // console.log(res.Body)
                    if (res.Body == null) {
                        setTimeout(_ => {
                            wx.navigateTo({
                                url: '/pages/admin-dd-set'
                            })
                        }, 300)
                    } else {
                        wx.setStorageSync('dada', res.Body);
                        setTimeout(_ => {
                            wx.navigateTo({
                                url: '/pages/admin-dd-option'
                            })
                        }, 300)
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            uuOptions() {
                wx.navigateTo({
                    url: '/pages/admin-emit-drive'
                })
            }
        },
        components: {}
    }
</script>

<style lang="less">
    .admin_paotui_select {
        height: 100%;
        background: #f5f5f5;
        box-sizing: border-box;
        .list {
            padding: 0 36rpx;
            background: #fff;
        }
        .options {
            background: #fff;
            height: 110rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            &:after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                border-bottom: 1PX solid #e6e6e6;
                position: absolute;
                bottom: 0;
                left: 0;
                transform: scaleY(0.5);
                transform-origin: 0 0;
            }
            &:last-child {
                &::after {
                    display: none;
                }
            }
            p {
                color: #1a1a1a;
                font-size: 30rpx;
            }
            img {
                width: 40rpx;
                height: 40rpx;
            }
        }
    }
</style>
