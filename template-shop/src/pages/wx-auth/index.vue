<template>
    <div class="wx-auth">
        <div class="auth_bg"></div>
        <button open-type="openSetting" @opensetting="setting" plain="true" hover-class="none" class="auth_btn" style="background:#000;color:#fff;">微信授权</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        methods: {
            setting(e) {
                console.log(e.mp.detail.authSetting)
            },
        },
        components: {}
    }
</script>

<style lang="less">
.auth_bg{
    margin: 0 36rpx;
    height: 260rpx;
    background-image: url('https://otherfiles-ali.uupt.com/Stunner/FE/C/index-banner.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.auth_btn{
    margin: 30rpx 36rpx 0;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    border: 0;
    font-size: 28rpx;
}
</style>
