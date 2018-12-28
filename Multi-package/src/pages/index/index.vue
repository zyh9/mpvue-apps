<template>
    <div>
        <h3 @click="other">去其他页面</h3>
        <h3 @click="addNum">点击增加</h3>
        <h3>{{state}}</h3>
        <h3 @click="clickShare">点击分享</h3>
        <h3 @click="clickPay">余额支付</h3>
        <share ref="share" @sendFriend="sendFriend" @shareQR="shareQR" @cancelShare="cancelShare"></share>
        <vipPay ref="vipPay" @authPassword="authPassword" @cancelPay="cancelPay" :payInfo="payInfo"></vipPay>
    </div>
</template>

<script>
    import share from '../../components/share';
    import vipPay from '../../components/vipPay';
    export default {
        data() {
            return {
                state: 0,
                payInfo: {
                    name: '测试店铺',
                    money: '666'
                }
            }
        },
        onShareAppMessage(res) {
            return {
                title: '测试测试',
                path: 'pages/index',
                imageUrl: '',
                success: res => {},
                fail: err => {}
            }
        },
        onLoad() { //用于数据重置
            this.state = 0;
        },
        onReady() {},
        onShow() {}, //页面渲染就会触发
        methods: {
            other() {
                wx.navigateTo({
                    url: '/pagesOther/other'
                });
            },
            addNum() {
                this.state++;
                this.$store.dispatch('add', this.state)
            },
            //点击分享
            clickShare() {
                this.$refs.share.blockShare()
            },
            //发送好友
            sendFriend(val) {
                console.log(val)
                this.$refs.share.hideShare()
            },
            //生成图片
            shareQR(val) {
                console.log(val)
                this.$refs.share.hideShare()
            },
            //取消分享
            cancelShare(val) {
                console.log(val)
                this.$refs.share.hideShare()
            },
            //点击支付
            clickPay() {
                this.$refs.vipPay.blockPay()
            },
            //验证密码
            authPassword(val) {
                console.log(val)
                //清理密码
                // this.$refs.vipPay.clearCode()
                //关闭弹窗
                // this.$refs.vipPay.hidePay()
            },
            //取消支付
            cancelPay(val) {
                console.log(val)
                this.$refs.vipPay.hidePay()
                //清理密码
                this.$refs.vipPay.clearCode()
            }
        },
        computed: {},
        watch: {},
        components: {
            share,
            vipPay
        }
    }
</script>

<style lang="less">

</style>
