<template>
    <div class="admin_mask">
        <img class="fade_in" :src="v.imgUrl" alt="" v-for="(v,i) in imgList" :key="i" @click="add" v-if="i==index" lazy-load="true" @load="imgLoad" @error="imgErr">
        <div class="over pos" @click="goIndex" v-if="index==0"></div>
        <div class="money" v-if="index==imgList.length - 1">
            <img class="fade_in" src="https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/gold.png" alt="">
            <p>祝您生意兴隆<br/>有任何需要随时联系我们</p>
        </div>
        <div class="know pos" @click="goIndex" v-if="index==imgList.length - 1"></div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                imgList: [{
                        imgUrl: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/guide-num-1.png'
                    },
                    {
                        imgUrl: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/guide-num-2.png'
                    }, {
                        imgUrl: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/guide-num-3.png'
                    }, {
                        imgUrl: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/guide-num-4.png'
                    }, {
                        imgUrl: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/guide-num-5.png'
                    }, {
                        imgUrl: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/guide-num-6.png'
                    }, {
                        imgUrl: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/guide-num-7.png'
                    }, {
                        imgUrl: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/guide-num-8.png'
                    }, {
                        imgUrl: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/guide-num-9.png'
                    },
                    {
                        imgUrl: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/guide-num-10.png'
                    },
                    {
                        imgUrl: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/guide-num-11.png'
                    },
                    {
                        imgUrl: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/guide-num-12.png'
                    }
                ],
                index: 0,
                onoff: true
            }
        },
        onReady() {
            this.index = 0;
            this.onoff = true;
        },
        methods: {
            add() {
                if (this.onoff) {
                    this.onoff = false;
                    setTimeout(_ => {
                        (this.index < this.imgList.length - 1) && this.index++;
                        console.log(this.index)
                        this.onoff = true;
                    }, 200)
                }
            },
            goIndex() {
                wx.switchTab({
                    url: '/pages/admin-index'
                })
            }
        },
        components: {}
    }
</script>

<style lang="less">
    .admin_mask {
        position: relative;
        height: 100%;
        overflow: hidden;
        &>img {
            width: 100%;
            height: 100%;
        }
        .money {
            position: absolute;
            top: 230rpx;
            left: 50%;
            transform: translateX(-50%);
            img {
                width: 340rpx;
                height: 310rpx;
                margin-bottom: 20rpx;
            }
            p {
                font-size: 32rpx;
                color: #ffffff;
                text-align: center;
                letter-spacing: 5rpx;
                white-space: nowrap;
            }
        }
        .pos {
            position: absolute;
            bottom: 280rpx;
            left: 50%;
            transform: translateX(-50%);
        }
    }
</style>
