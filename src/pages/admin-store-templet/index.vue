<template>
    <div class="admin_store_templet">
        <ul class="templet_top">
            <li v-for="(v,i) in templet" :key="i">
                <img src="../../../static/jp.jpg" alt="">
                <p>{{v.text}}</p>
            </li>
        </ul>
        <div class="templet_bottom">
            <p>保存</p>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                templet: [{
                        text: '餐饮模板'
                    },
                    {
                        text: '电商模板'
                    }
                ],
            }
        },
        components: {}
    }
</script>

<style lang="less">
    .admin_store_templet {
        height: 100%;
        background: #f5f5f5;
        position: relative;
        overflow-x: hidden;
        .templet_top {
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: space-around;
            padding: 20rpx;
            li {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                img {
                    width: 160rpx;
                    height: 200rpx;
                }
                p {
                    padding: 10rpx 0;
                    text-align: center;
                    font-size: 26rpx;
                    color: #666;
                }
            }
        }
        .templet_bottom {
            position: absolute;
            bottom: 60rpx;
            left: 0;
            right: 0;
            p {
                width: 80%;
                background: skyblue;
                margin: 0 auto;
                text-align: center;
                height: 80rpx;
                line-height: 80rpx;
                border-radius: 8rpx;
                color: #fff;
                font-size: 30rpx;
            }
        }
    }
</style>
