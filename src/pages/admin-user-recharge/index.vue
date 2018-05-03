<template>
    <div class="admin_user_recharge">
        <div class="options">
            <p>充值金额</p>
            <input type="text" placeholder="请输入想要充值的金额" v-model="num">
        </div>
        <div class="btn" @click="signUp">确认充值</div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                num: ''
            }
        },
        mounted() {},
        methods: {
        },
        components: {}
    }
</script>

<style lang="less">
    .admin_user_recharge {
        height: 100%;
        background: #f5f5f5;
        overflow-x: hidden;
        .options {
            background: #fff;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 20rpx;
            border-bottom: 1rpx solid #e6e6e6;
            position: relative;
            p {
                font-size: 24rpx;
                color: #333;
                width: 140rpx;
                text-align: left;
                transform: translateY(3rpx);
            }
            input {
                flex-grow: 1;
                font-size: 24rpx;
                color: #666;
            }
        }
        .btn {
            background: skyblue;
            margin: 20rpx;
            text-align: center;
            height: 80rpx;
            line-height: 80rpx;
            border-radius: 8rpx;
            color: #fff;
            font-size: 30rpx;
        }
    }
</style>
