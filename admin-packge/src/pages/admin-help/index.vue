<template>
    <div class="admin_help">
        <ul class="help_list">
            <li v-for="(v,i) in list" :key="i" @click="details(i)">
                <img class="fade_in" :src="v.imgUrl" alt="" lazy-load="true">
                <p>{{v.text}}</p>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                winWidth: 0,
                winHeight: 0,
                list: [{
                        imgUrl: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/application-1.png',
                        text: '1.快速申请小程序'
                    },
                    {
                        imgUrl: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/application-2.png',
                        text: '2.微信小程序认证'
                    }, {
                        imgUrl: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/application-3.png',
                        text: '3.微信支付申请'
                    }, {
                        imgUrl: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/application-4.png',
                        text: '4.小程序授权'
                    }
                ]
            }
        },
        onShow() { //页面渲染就会触发
        },
        mounted() {
            // let query = wx.createSelectorQuery();
            // query.select('.admin_help_top').boundingClientRect()
            // query.exec(res => {
            //     let height = res[0].height;
            //     wx.getSystemInfo({
            //         success: res => {
            //             // console.log(res)
            //             this.winWidth = res.windowWidth;
            //             //减去上方的高度
            //             this.winHeight = res.windowHeight - height;
            //         }
            //     })
            // })
        },
        methods: {
            //滑动切换
            bindChange(e) {
                this.currentTab = e.target.current;
            },
            //点击tab切换 
            swichNav(e) {
                if (this.currentTab === e.currentTarget.dataset.current) return;
                this.currentTab = e.currentTarget.dataset.current;
            },
            details(i) {
                console.log()
                wx.navigateTo({
                    url: `/pages/admin-help-details?index=${i}`
                })
            }
        },
        computed: {},
        components: {}
    }
</script>

<style lang="less">
    .admin_help {
        background: #efeef4;
        height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
    }
    .help_list {
        padding: 36rpx;
        li {
            margin-bottom: 36rpx;
            background: #fff;
            img {
                height: 418rpx;
                width: 100%;
            }
            p {
                height: 84rpx;
                line-height: 84rpx;
                font-size: 30rpx;
                color: #656782;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding: 0 30rpx;
            }
        }
    }
</style>
