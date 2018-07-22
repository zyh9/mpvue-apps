<template>
    <web-view :src="videoList[index].video">
    </web-view>
</template>

<script>
    export default {
        data() {
            return {
                videoList: [{
                        video: 'https://v.qq.com/x/page/b0690zp38bg.html'
                    },
                    {
                        video: 'https://v.qq.com/x/page/b0690vmf1a2.html'
                    },
                    {
                        video: 'https://v.qq.com/x/page/r0690s2zsn5.html'
                    },
                    {
                        video: 'https://v.qq.com/x/page/s0705qcqf01.html'
                    }
                ],
                index: -1,
            }
        },
        onReady() {
            this.index = this.$mp.query.index;
            console.log(this.index)
        },
        components: {}
    }
</script>

<style>

</style>
