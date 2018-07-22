<template>
    <div class="admin_no_shop">
        <div class="block_con">
            <i class="icon icon_home"></i>
            <p>快去添加商品和分类吧！</p>
        </div>
        <div class="add_shop_bot">
            <div class="bot_lis bot_lis_r" @click="addShop">添加商品</div>
            <div class="bot_lis" @click="addType">添加分类</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        methods: {
            addShop() {
                wx.redirectTo({
                    url: '/pages/admin-add-goods?goodsId=0&type=0'
                })
            },
            addType() {
                wx.redirectTo({
                    url: '/pages/admin-store-deploy?emit=1'
                })
            }
        }
    }
</script>

<style lang="less">
    .admin_no_shop {
        height: 100%;
        position: relative;
        background: #fff;
        display: flex;
        .block_con {
            width: 300rpx;
            margin: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            transform: translateY(-100%);
            p {
                margin-top: 20rpx;
                text-align: center;
                font-size: 22rpx;
                color: #ccc;
            }
        }
        .add_shop_bot {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            border-top: 1rpx solid #ebebeb;
            height: 110rpx;
            background: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 26rpx;
            box-sizing: border-box;
            .bot_lis {
                height: 72rpx;
                color: #0863ee;
                border: 1px solid #0863ee;
                flex: 1;
                text-align: center;
                font-size: 26rpx;
                line-height: 72rpx;
            }
            .bot_lis_r {
                margin-right: 20rpx;
            }
        }
    }
</style>
