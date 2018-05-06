<template>
    <div class="upload_shop_img">
    </div>
</template>

<script>
    import WeCropper from 'we-cropper/dist/we-cropper.min.js';
    // console.log(WeCropper)
    const device = wx.getSystemInfoSync() // 获取设备信息
    const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
    const height = width;
    export default {
        data() {
            return {
                cropperOpt: {
                    id: 'cropper',
                    width, // 画布宽度
                    height, // 画布高度
                    scale: 2.5, // 最大缩放倍数
                    zoom: 8, // 缩放系数
                    cut: {
                        x: (width - 200) / 2, // 裁剪框x轴起点
                        y: (width - 200) / 2, // 裁剪框y轴期起点
                        width: 200, // 裁剪框宽度
                        height: 200 // 裁剪框高度
                    }
                }
            }
        },
        onLoad(option) {
            const {
                cropperOpt
            } = this.data
            // 若同一个页面只有一个裁剪容器，在其它Page方法中可通过this.wecropper访问实例
            new WeCropper(cropperOpt)
                .on('ready', (ctx) => {
                    console.log(`wecropper is ready for work!`)
                })
                .on('beforeImageLoad', (ctx) => {
                    console.log(`before picture loaded, i can do something`)
                    console.log(`current canvas context: ${ctx}`)
                    wx.showToast({
                        title: '上传中',
                        icon: 'loading',
                        duration: 20000
                    })
                })
                .on('imageLoad', (ctx) => {
                    console.log(`picture loaded`)
                    console.log(`current canvas context: ${ctx}`)
                    wx.hideToast()
                })
            // 若同一个页面由多个裁剪容器，需要主动做如下处理
            this.A = new weCropper(cropperOptA)
            this.B = new weCropper(cropperOptB)
        },
        components: {}
    }
</script>

<style lang="less">

</style>
