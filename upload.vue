<template>
    <div class="upload">
        <canvas class="canvas" canvas-id="cropper" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" disable-scroll="true" :style="{ width: cropperOpt.width + 'px', height: cropperOpt.height + 'px'}"></canvas>
        <canvas class="target" canvas-id="target" :style="{ width: vw + 'px', height: vh + 'px'}"></canvas>
        <cover-view class="cropper-buttons">
            <cover-view class="uploadImg" @tap="uploadTap">上传图片</cover-view>
            <cover-view class="getCropperImage" @tap="getCropperImage">生成图片</cover-view>
        </cover-view>
    </div>
</template>

<script>
    // 安装  npm install we-cropper --save
    import WeCropper from 'we-cropper';
    const device = wx.getSystemInfoSync();
    const devicePixelRatio = device.pixelRatio;
    const windowWidth = device.windowWidth;
    const windowHeight = device.windowHeight;
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
                srcUrl: '',
                vw: '100%',
                vh: '100%',
                targetCtx: null,
            }
        },
        onLoad() {
            this.vw = devicePixelRatio * windowWidth;
            this.vh = devicePixelRatio * windowHeight;
            this.targetCtx = wx.createCanvasContext('target');
            wx.getStorageSync('cutImg') && wx.removeStorageSync('cutImg');
            //数据重置
            this.cropperOpt = {
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
            }
            this.wecropper = new WeCropper(this.cropperOpt)
                .on('ready', (ctx) => {
                    // console.log(`wecropper准备工作`)
                })
                .on('beforeImageLoad', (ctx) => {
                    // console.log(`在图片加载之前，我可以做一些事情`)
                    wx.showToast({
                        title: '上传中',
                        icon: 'loading',
                        mask: true
                    })
                })
                .on('imageLoad', (ctx) => {
                    // console.log(`图片加载...`)
                    wx.hideToast()
                })
                .on('beforeDraw', (ctx, instance) => {
                    // console.log(`在画布画之前，我可以做点什么`)
                })
                .updateCanvas();
            this.uploadTap(); //先执行调用相册
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
                        this.srcUrl = res.tempFilePaths[0];
                        // 获取裁剪图片资源后，给data添加src属性及其值
                        // this.wecropper.pushOrign(this.srcUrl)
                    }
                })
            },
            //生成图片
            getCropperImage() {
                wx.showToast({
                    title: '生成中',
                    icon: 'loading',
                    mask: true
                })
                let {
                    imgLeft,
                    imgTop,
                    scaleWidth,
                    scaleHeight
                } = this.wecropper; // 获取图片在原画布坐标位置及宽高
                let {
                    x,
                    y,
                    width,
                    height
                } = this.wecropper.cut; // 获取裁剪框位置及大小
                // 所有参数乘设备像素比
                imgLeft = imgLeft * devicePixelRatio;
                imgTop = imgTop * devicePixelRatio;
                scaleWidth = scaleWidth * devicePixelRatio;
                scaleHeight = scaleHeight * devicePixelRatio;
                x = x * devicePixelRatio;
                y = y * devicePixelRatio;
                width = width * devicePixelRatio;
                height = height * devicePixelRatio;
                // 这里是目标canvas画布的id值
                console.log(this.srcUrl, imgLeft, imgTop, scaleWidth, scaleHeight, x, y, width, height)
                this.targetCtx.drawImage(this.srcUrl, imgLeft, imgTop, scaleWidth, scaleHeight) // 第一个参数代表被裁剪图片的临时路径
                this.targetCtx.draw();
                //canvas的绘制函数为异步函数，故作延时处理
                setTimeout(_ => {
                    wx.canvasToTempFilePath({
                        canvasId: 'target',
                        x,
                        y,
                        width,
                        height,
                        success: res => {
                            const tmpPath = res.tempFilePath;
                            if (tmpPath) {
                                wx.uploadFile({
                                    url: this.util.baseUrl + 'ImageUpload', //上传图片接口
                                    filePath: tmpPath,
                                    name: 'ImageFile',
                                    formData: {
                                        //参数...
                                    },
                                    header: this.util.commonHeader(), //公共header
                                    success: res => {
                                        // console.log(res)
                                        let tempFilePaths = JSON.parse(res.data).Body.ImageUrl;
                                        wx.setStorageSync('cutImg', tempFilePaths);
                                        setTimeout(_ => {
                                            wx.hideToast()
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
                        }
                    })
                }, 200)
                // this.wecropper.getCropperImage((src) => {
                //     if (src) {
                //         // console.log(src)
                //         wx.uploadFile({
                //             url: this.util.baseUrl + 'ImageUpload', //上传图片接口
                //             filePath: src,
                //             name: 'ImageFile',
                //             formData: {
                //                 //参数...
                //             },
                //             header: this.util.commonHeader(), //公共header
                //             success: res => {
                //                 // console.log(res)
                //                 let tempFilePaths = JSON.parse(res.data).Body.ImageUrl;
                //                 wx.setStorageSync('cutImg', tempFilePaths);
                //                 setTimeout(_ => {
                //                     wx.hideToast()
                //                     wx.navigateBack({
                //                         delta: 1
                //                     });
                //                 }, 300)
                //             },
                //             fail: err => {
                //                 console.log(err, 'fail')
                //             }
                //         })
                //     } else {
                //         console.log('获取图片地址失败，请稍后重试')
                //     }
                // })
            },
        }
    }
</script>

<style lang="less">
    .upload {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .8);
    }
    .target {
        position: absolute;
        left: 0;
        top: 0;
        transform: translateX(-200%);
    }
    .cropper-buttons {
        display: flex;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 10;
        width: 100%;
        height: 100rpx;
        background-color: #1a1a1a;
        font-size: 30rpx;
        color: #ccc;
        font-weight: 900;
        .uploadImg,
        .getCropperImage {
            flex: 1;
            text-align: center;
            height: 100rpx;
            line-height: 100rpx;
        }
    }
</style>
