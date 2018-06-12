<template>
    <div>
        <button plan="true" @click="pay">支付</button>
    </div>
</template>

<script>
    import gcoord from 'gcoord';
    export default {
        data() {
            return {}
        },
        onShow() {
            this.pos()
        },
        methods: {
            pos() {
                let result = gcoord.transform(
                    [113.736958,34.784264], // 经纬度坐标
                    gcoord.BD09, // 当前坐标系BD09
                    gcoord.GCJ02 // 目标坐标系
                )
                console.log(result)
            },
            pay() {
                wx.requestPayment({
                    'timeStamp': '1528792120942',
                    'nonceStr': '1528792120942',
                    'package': 'prepay_id=wx121628409088522e1c862cd61725196037',
                    'signType': 'MD5',
                    'paySign': '205A77A1FC0FF50E1182F26D5C4032DB',
                    'success': res => {
                        this.msg('您已支付')
                    },
                    'fail': err => {
                        this.msg('您已取消支付')
                    }
                })
            }
        },
        components: {}
    }
</script>

<style lang="less">

</style>
