<template>
    <div class="upload_shop_img">
        <canvas class="canvas" canvas-id="cropper" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" disable-scroll="true" :style="{ width: cropperOpt.width + 'px', height: cropperOpt.height + 'px', background: 'rgba(0, 0, 0, .8)' }"></canvas>
        <div class="zin" :style="{height:winHeight+'px'}"></div>
        <cover-view class="cropper-buttons">
            <cover-view v-if='!isStep' class="upload" @tap="uploadTap">上传图片</cover-view>
            <cover-view v-else class="getCropperImage" @tap="getCropperImage">生成图片</cover-view>
        </cover-view>
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
                wecropper: null,
                type: '',
                isStep: false,
                isNext: true,
                winHeight: 0
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
            this.uploadTap()
        },
        onShow() {
            this.type = this.$mp.query.type;
            this.isStep = false;
            this.isNext = true;
        },
        mounted() {
            let query = wx.createSelectorQuery();
            query.select('.canvas').boundingClientRect()
            query.exec(res => {
                let height = res[0].height;
                wx.getSystemInfo({
                    success: res => {
                        //减去上方的高度
                        this.winHeight = res.windowHeight - height;
                    }
                })
            })
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
                    sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有  sizeType: ['original', 'compressed'],
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: res => {
                        const src = res.tempFilePaths[0];
                        this.isStep = true;
                        //  获取裁剪图片资源后，给data添加src属性及其值
                        this.wecropper.pushOrign(src)
                    }
                })
            },
            //生成图片
            getCropperImage() {
                if (!this.isNext) {
                    return
                }
                if (!this.isStep) {
                    this.msg('请上传图片');
                    return
                }
                this.isNext = false;
                const that = this;
                wx.showLoading({
                    title: '生成中',
                })
                this.wecropper.getCropperImage((src) => {
                    if (src) {
                        // console.log(src)
                        wx.uploadFile({
                            url: this.util.baseUrl + '/api/Merchant/File/ImageUpload',
                            filePath: src,
                            name: 'ImageFile',
                            formData: {
                                'ImageType': 2
                            },
                            header: {
                                appid: '2',
                                token: wx.getStorageSync('loginInfo').Token || '',
                                qrcode: wx.getStorageSync('scene') || ''
                            },
                            success: res => {
                                let tempFilePaths = JSON.parse(res.data).Body.ImageUrl;
                                wx.setStorageSync('cutImg' + that.type, tempFilePaths);
                                setTimeout(_ => {
                                    this.isNext = true;
                                    wx.hideLoading()
                                    wx.navigateBack({
                                        delta: 1
                                    });
                                }, 300)
                            },
                            fail: err => {
                                console.log(err, 'fail')
                            }
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
    .zin {
        width: 100%;
        background: #242424;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1;
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
        z-index: 10;
        width: 100%;
        height: 100rpx;
        line-height: 100rpx;
        background-color: #1a1a1a;
        font-size: 30rpx;
        color: #ccc;
        font-weight: 900;
        .upload,
        .getCropperImage {
            width: 50%;
            text-align: center;
            line-height: 100rpx;
        }
    }
</style>
