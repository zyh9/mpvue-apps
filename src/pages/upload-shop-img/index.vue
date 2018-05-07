<template>
    <div class="upload_shop_img">
        <canvas canvas-id="cropper" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" disable-scroll="true" :style="{ width: cropperOpt.width + 'px', height: cropperOpt.height + 'px', background: 'rgba(0, 0, 0, .8)' }"></canvas>
        <div class="cropper-buttons">
            <div class="upload" @tap="uploadTap">
                上传图片
            </div>
            <div class="getCropperImage" @tap="getCropperImage">
                生成图片
            </div>
        </div>
    </div>
</template>

<script>
    import WeCropper from 'we-cropper';
    const device = wx.getSystemInfoSync();
    const windowWidth = device.windowWidth;
    const windowHeight = device.windowHeight - 50;
    export default {
        data() {
            return {
                cropperOpt: {
                    width: windowWidth,
                    height: windowHeight,
                    scale: 2.5,
                    zoom: 8,
                    cut: {
                        x: (windowWidth - 300) / 2,
                        y: (windowHeight - 300) / 2,
                        width: 300,
                        height: 300
                    }
                },
                wecropper: null
            }
        },
        onLoad() {
            this.wecropper = new WeCropper(this.cropperOpt)
                .on('ready', (ctx) => {
                    // console.log(`wecropper准备工作`)
                })
                .on('beforeImageLoad', (ctx) => {
                    // console.log(`在图片加载之前，我可以做一些事情`)
                    // console.log(`当前画布上下文:`, ctx)
                    wx.showToast({
                        title: '上传中',
                        icon: 'loading',
                        duration: 20000
                    })
                })
                .on('imageLoad', (ctx) => {
                    // console.log(`图片加载...`)
                    // console.log(`当前画布上下文:`, ctx)
                    wx.hideToast()
                })
                .on('beforeDraw', (ctx, instance) => {
                    // console.log(`在画布画之前，我可以做点什么`)
                    // console.log(`当前画布上下文:`, ctx)
                })
                .updateCanvas()
            console.log(this.wecropper)
        },
        methods: {
            touchStart(e) {
                this.wecropper.touchStart(e)
            },
            touchMove(e) {
                this.wecropper.touchMove(e)
            },
            touchEnd(e) {
                this.wecropper.touchEnd(e)
            },
            //上传图片
            uploadTap() {
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: res => {
                        const src = res.tempFilePaths[0];
                        console.log(src)
                        //  获取裁剪图片资源后，给data添加src属性及其值
                        this.wecropper.pushOrign(src)
                    }
                })
            },
            //生成预览图
            getCropperImage() {
                this.wecropper.getCropperImage((src) => {
                    if (src) {
                        console.log(src)
                        wx.previewImage({
                            current: '', // 当前显示图片的http链接
                            urls: [src] // 需要预览的图片http链接列表
                        })
                    } else {
                        console.log('获取图片地址失败，请稍后重试')
                    }
                })
            },
        },
        components: {},
    }
</script>

<style lang="less">
    .upload_shop_img {
        width: 100%;
        height: 100%;
    }
    .cropper-buttons {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        justify-content: center;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50px;
        line-height: 50px;
        .upload,
        .getCropperImage {
            width: 50%;
            text-align: center;
        }
    }
    .cropper-buttons {
        background-color: rgba(0, 0, 0, 0.95);
        color: #04b00f;
    }
</style>
