<template>
    <div>
        我的收货地址
    </div>
</template>

<script>
    import util from '../../utils/index';
    console.log(util)
    export default {
        data() {
            return {}
        },
        created() {},
        mounted() {
            wx.getLocation({
                type: 'wgs84',
                success: res => {
                    console.log(res)
                },
                fail: err => {}
            })
        },
        components: {}
    }
</script>

<style lang="less">

</style>
