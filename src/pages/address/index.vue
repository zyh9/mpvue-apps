<template>
    <div class="address_info">
        正在定位：{{city}}
    </div>
</template>

<script>
    import util from '../../utils/index';
    import msg from '../../utils/toast';
    // 引入SDK核心类
    import QQMapWX from '../../utils/qqmap-wx-jssdk.js';
    const address = new QQMapWX({
        key: 'BZMBZ-OKXRU-DINVZ-2SRN5-4KWJ7-S6B6O'
    })
    export default {
        data() {
            return {
                city:null
            }
        },
        created() {},
        mounted() {
            // 实例化API核心类
            wx.getLocation({
                type: 'wgs84',
                altitude:true,
                success: res => {
                    this.map(res)
                },
                fail: err => {}
            })
        },
        methods: {
            map(info) {
                // 调用接口
                address.reverseGeocoder({
                    location: {
                        latitude: info.latitude,
                        longitude: info.longitude
                    },
                    success: res => {
                        console.log(res)
                        this.city = res.result.address_component.city
                    },
                    fail: err => {
                        msg('位置信息获取失败')
                    }
                })
            }
        },
        components: {}
    }
</script>

<style lang="less">

</style>
