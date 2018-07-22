<template>
    <div class="admin_store_manage">
        <div class="list">
            <div class="options" @click='go(0)'>
                <p>店铺模板</p>
                <i class="icon icon_arrowRight"></i>
            </div>
            <!-- <div class="options" @click='go(1)'>
                <p>商品分类</p>
                <i class="icon icon_arrowRight"></i>
            </div> -->
            <div class="options" @click='go(2)'>
                <p>跑腿配置</p>
                <i class="icon icon_arrowRight"></i>
            </div>
            <div class="options" @click='go(3)'>
                <p>快递配置</p>
                <i class="icon icon_arrowRight"></i>
            </div>
            <div class="options" @click='go(4)'>
                <p>配送费计价</p>
                <i class="icon icon_arrowRight"></i>
            </div>
            <div class="options" @click='go(5)'>
                <p>店铺信息管理</p>
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
        onShow() {
            if (wx.getStorageSync('address')) {
                wx.removeStorageSync('address');
            }
            if (wx.getStorageSync('cutImg1')) {
                wx.removeStorageSync('cutImg1');
            }
        },
        components: {},
        methods: {
            go(type) {
                let templateId = wx.getStorageSync('shopInfo').ShopViewTemplate;
                let link = '';
                switch (type) {
                    case 0:
                        link = '/pages/admin-store-templet';
                        break;
                    case 1:
                        if (templateId == 1) {
                            /* 餐饮模板 */
                            link = '/pages/admin-store-deploy?emit=3';
                        } else {
                            /* templateId=2 */
                            /* 电商模板 */
                            link = '/pages/admin-store-deployother?emit=1';
                        }
                        break;
                    case 2:
                        //跑腿选择项
                        link = '/pages/admin-paotui-select';
                        //uu跑腿配置
                        // link = '/pages/admin-emit-drive/main';
                        break;
                    case 3:
                        link = '/pages/admin-emit-express';
                        break;
                    case 4:
                        link = '/pages/admin-delivery-price';
                        break;
                    case 5:
                        link = '/pages/admin-shop-info';
                        break;
                }
                wx.navigateTo({
                    url: link
                })
            },
        }
    }
</script>

<style lang="less">
    .admin_store_manage {
        height: 100%;
        background: #f5f5f5;
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
                border-bottom: 1px solid #e6e6e6;
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
