<template>
    <div>
        我的收货地址
    </div>
</template>

<script>
    import util from '../../utils/index';
    // 引入SDK核心类
    import QQMapWX from '../../utils/qqmap-wx-jssdk.js';
    export default {
        data() {
            return {
                latitude: null,
                longitude: null
            }
        },
        created() {},
        mounted() {
            wx.getLocation({
                type: 'wgs84',
                success: res => {
                    //纬度
                    this.latitude = res.latitude;
                    //经度
                    this.longitude = res.longitude;
                },
                fail: err => {}
            })
            // 实例化API核心类
            let address = new QQMapWX({
                key: 'BZMBZ-OKXRU-DINVZ-2SRN5-4KWJ7-S6B6O'
            })
            // 调用接口
            address.reverseGeocoder({
                location: {
                    latitude: this.latitude,
                    longitude: this.longitude
                },
                success: function(res) {
                    console.log(res);
                },
                fail: function(res) {
                    console.log(res);
                },
                complete: function(res) {
                    console.log(res);
                }
            });
        },
        components: {}
    }
</script>

<style lang="less">

</style>
