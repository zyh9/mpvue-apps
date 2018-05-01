<template>
    <div class="plat_index">
        <div class="index_img">
            <p>UU小店，即将来袭</p>
        </div>
        <div class="Introduction">
            <p>简介暂无</p>
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
    .plat_index {
        height: 100%;
        .index_img {
            height: 300rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f5f5f5;
            p {
                color: #666;
                font-size: 24rpx;
            }
        }
        .Introduction {
            padding: 30rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            p {
                color: #666;
                font-size: 24rpx;
            }
        }
    }
</style>
