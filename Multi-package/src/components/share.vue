<template>
    <div>
        <div class="share_mask" v-if="shareBlock"></div>
        <div class="share_card" :class="{share_card_active:shareBlock}">
            <div class="share_card_btn">
                <div class="btn_item">
                    <i class="icon_share_wx btn_img"></i>
                    <p>发给好友</p>
                    <button class="btn_send" plain="true" open-type="share" @click="sendFriend"></button>
                </div>
                <div class="btn_item" @click="shareQR">
                    <i class="icon_share_qr btn_img"></i>
                    <p>生成分享图片</p>
                </div>
            </div>
            <div class="cancel" @click="cancelShare">取消</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                shareBlock: false
            }
        },
        onLoad() {},
        onReady() {},
        onShow() {},
        methods: {
            blockShare() {
                this.shareBlock = true;
            },
            hideShare() {
                this.shareBlock = false;
            },
            sendFriend() {
                this.$emit("sendFriend", {
                    title: "发送好友"
                })
            },
            shareQR() {
                this.$emit("shareQR", {
                    title: "生成图片"
                })
            },
            cancelShare() {
                this.$emit("cancelShare", {
                    title: "取消"
                })
            }
        },
        computed: {},
        watch: {},
        components: {}
    }
</script>

<style lang="less">
    @import url('../less/share.less');
</style>
