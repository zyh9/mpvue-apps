<template>
    <div class="admin_store_manage">
        <div class="options">
            <p>店铺模板</p>
            <img src="../../../static/userImg.png" alt="">
        </div>
        <div class="options">
            <p>店铺配置</p>
            <img src="../../../static/userImg.png" alt="">
        </div>
        <div class="options">
            <p>价格配置</p>
            <img src="../../../static/userImg.png" alt="">
        </div>
        <div class="options">
            <p>店铺信息管理</p>
            <img src="../../../static/userImg.png" alt="">
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        components: {}
    }
</script>

<style lang="less">
    .admin_store_manage {
        height: 100%;
        background: #f5f5f5;
        .options {
            background: #fff;
            padding: 20rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1rpx solid #e6e6e6;
            p {
                color: #666;
                font-size: 24rpx;
            }
            img {
                width: 40rpx;
                height: 40rpx;
            }
        }
    }
</style>
