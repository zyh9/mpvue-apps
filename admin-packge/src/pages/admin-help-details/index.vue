<template>
    <div class="admin_help_details">
        <div class="help_video" v-if="imgList[index].video" @click="videoSelect(index)">
            <img src="../../../static/video-img.png" alt="" class="video_img">
            <div class="video_text">
                <p>这里还有视频教程哟</p>
                <span>看视频  更清晰</span>
            </div>
            <img src="../../../static/look-video.png" alt="" class="look_video">
        </div>
        <div class="img_sum">
            <img v-for="(v,i) in imgList[index].imgUrl" :key="i" :src="v.url" alt="" style="width: 100%;" :style="{height:imgList[index].height+'px'}">
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                imgList: [{
                        imgUrl: [{
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/1_01.png'
                            }, {
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/1_02.png'
                            },
                            {
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/1_03.png'
                            }, {
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/1_04.png'
                            },
                            {
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/1_05.png'
                            }, {
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/1_06.png'
                            }
                        ],
                        video: 'https://v.qq.com/x/page/b0690zp38bg.html',
                        height: 550
                    },
                    {
                        imgUrl: [{
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/2_01.png'
                            }, {
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/2_02.png'
                            },
                            {
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/2_03.png'
                            }, {
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/2_04.png'
                            },
                            {
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/2_05.png'
                            }, {
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/2_06.png'
                            }
                        ],
                        video: 'https://v.qq.com/x/page/b0690vmf1a2.html',
                        height: 280
                    },
                    {
                        imgUrl: [{
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/3_01.png'
                            }, {
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/3_02.png'
                            },
                            {
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/3_03.png'
                            }, {
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/3_04.png'
                            },
                            {
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/3_05.png'
                            }, {
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/3_06.png'
                            }
                        ],
                        video: 'https://v.qq.com/x/page/r0690s2zsn5.html',
                        height: 520
                    },
                    {
                        imgUrl: [{
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/4_01.png'
                            }, {
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/4_02.png'
                            },
                            {
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/4_03.png'
                            }, {
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/4_04.png'
                            },
                            {
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/4_05.png'
                            }, {
                                url: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/4_06.png'
                            }
                        ],
                        video: 'https://v.qq.com/x/page/s0705qcqf01.html',
                        height: 580
                    },
                ],
                index: -1,
            }
        },
        onReady() {
            this.index = this.$mp.query.index;
        },
        onShow() {},
        methods: {
            videoSelect(ind) {
                // console.log(ind)
                wx.navigateTo({
                    url: `/pages/admin-webview?index=${ind}`
                })
            }
        },
        components: {}
    }
</script>

<style lang="less">
    .admin_help_details {
        background: #efeef4;
        height: 100%;
        overflow: hidden;
        padding-top: 162rpx;
        position: relative;
        box-sizing: border-box;
        .help_video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            background: #fff;
            height: 162rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 36rpx;
            box-sizing: border-box;
            .video_img {
                width: 130rpx;
                height: 120rpx;
                transform: translateX(-20rpx);
            }
            .video_text {
                transform: translateX(-40rpx);
                line-height: 1.2;
                p {
                    font-size: 34rpx;
                    color: #1a1a1a;
                }
                span {
                    font-size: 28rpx;
                    color: #656782;
                }
            }
            .look_video {
                width: 182rpx;
                height: 70rpx;
            }
        }
        .img_sum {
            height: 100%;
            overflow-x: hidden;
            overflow-y: scroll;
            box-sizing: border-box;
            padding-top: 24rpx;
        }
    }
</style>
