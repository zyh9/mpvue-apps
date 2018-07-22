<template>
    <div class="admin_store_manage">
        <div class="list">
            <div class="options" @click='go(0)'>
                <p>优惠券管理</p>
                <p>
                    <i class="icon icon_arrowRight"></i>
                </p>
            </div>
            <div class="options" @click='go(1)'>
                <p>折扣活动管理</p>
                <p>
                    <i class="icon icon_arrowRight"></i>
                </p> 
            </div>
            <div class="options" @click='go(2)'>
                <p>配送费优惠管理</p>
                <p>
                    <i class="icon icon_arrowRight"></i>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {}
        },
        onShow() {
            if (wx.getStorageSync('address')) {
                wx.removeStorageSync('address');
            }
            if(wx.getStorageSync('cutImg1')){
                wx.removeStorageSync('cutImg1');
            }
        },
        components: {},
        methods: {
            go(type) {
                let templateId=wx.getStorageSync('shopInfo').ShopViewTemplate;
                let link = '';
                console.log(type)
                switch (type) {
                    case 0:
                        link = '/pages/admin-discount-list';
                        break;
                    case 1:
                        link = '/pages/admin-rebate-list';
                        break;
                    case 2:
                        link = '/pages/admin-emit-expressSet';
                        break;
                }
                wx.navigateTo({
                    url: link
                })
            }
        }
    }
</script>

<style lang="less">
    .admin_store_manage {
        height: 100%;
        background: #f5f5f5;
        .list{
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
            &:after{
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
            &:last-child{
                &::after{
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
