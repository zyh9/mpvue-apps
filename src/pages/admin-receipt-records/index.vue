<template>
    <div class="admin_receipt_records">
        <!-- <scroll-view scroll-y="true" style="height: 100%" lower-threshold="60" @scrolltolower="scrollHandler" @scroll="eventScroll" :scroll-top="scrollTop"> -->
        <ul class="recordList">
            <li v-for="(v,i) in 30" :key="i" class="record_item">
                <div class="record_left">
                    <p>线下收款：</p>
                    <span>2018/05/01 12:12:12</span>
                </div>
                <i class="num_value">+84</i>
            </li>
        </ul>
        <!-- </scroll-view> -->
        <div class="go_top" v-if="topBtn" @click="goTop">
            <img src="../../../static/userImg.png" alt="">
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                winHeight: 0,
                topBtn: false,
                scrollTop: 0,
            }
        },
        onPageScroll:function(e) {
            console.log(e)
        },
        mounted() {
            wx.getSystemInfo({
                success: res => {
                    // console.log(res)
                    this.winHeight = res.windowHeight;
                    // console.log(this.winHeight)
                }
            })
        },
        methods: {
            scrollHandler() {
                // console.log(this.page)
                // this.page++;
            },
            //监听滚动距离
            eventScroll(e) {
                this.scrollTop = e.target.scrollTop;
            },
            goTop() { // 一键回到顶部
                this.scrollTop = 0;
            }
        },
        components: {},
        watch: {
            scrollTop: function(newVal, oldVal) {
                this.topBtn = this.scrollTop >= this.winHeight ? true : false;
            }
        }
    }
</script>

<style lang="less">
    .admin_receipt_records {
        height: 100%;
        overflow-x: hidden;
        background: #f5f5f5;
        position: relative;
        .recordList {
            overflow: hidden;
            .record_item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20rpx;
                border-bottom: 1rpx solid #e6e6e6;
                .record_left {
                    flex-grow: 1;
                    p {
                        color: #666;
                        font-size: 26rpx;
                    }
                    span {
                        color: #666;
                        font-size: 24rpx;
                    }
                }
                .num_value {
                    color: #666;
                    font-size: 30rpx;
                }
            }
            .record_item:nth-last-of-type(1) {
                border-bottom: none;
            }
        }
        .go_top {
            position: absolute;
            right: 20rpx;
            bottom: 20rpx;
            z-index: 10;
            img {
                width: 80rpx;
                height: 80rpx;
            }
        }
    }
</style>
