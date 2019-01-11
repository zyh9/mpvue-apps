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
                    id: 'cropper',
                    targetId: 'target',
                    pixelRatio: devicePixelRatio,
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
                vw: devicePixelRatio * windowWidth,
                vh: devicePixelRatio * windowHeight,
            }
        },
        onLoad() {
            wx.getStorageSync('cutImg') && wx.removeStorageSync('cutImg');
            //数据重置
            this.cropperOpt = {
                id: 'cropper',
                targetId: 'target',
                pixelRatio: devicePixelRatio,
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
            // this.uploadTap(); //先执行调用相册
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
                        // 获取裁剪图片资源后，给data添加src属性及其值
                        this.wecropper.pushOrign(src)
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
                // 通过then链式调用  参数v1.3.3支持
                // 参考链接 https://we-plugin.github.io/we-cropper/#/api?id=wecroppergetcropperimageoptcallback
                this.wecropper.getCropperImage({
                    original: true, //是否使用原图模式（默认值 false）
                    quality: 1, //图片的质量，目前仅对jpg有效。取值范围为 (0,1]，不在范围内时当作1.0处理
                    fileType: String //目标文件的类型
                }).then(src => {
                    console.log(src)
                    return;
                    wx.uploadFile({
                        url: this.util.baseUrl + 'ImageUpload', //上传图片接口
                        filePath: src,
                        name: 'ImageFile',
                        formData: {
                            //参数...
                        },
                        header: this.util.commonHeader(), //公共header
                        success: res => {
                            // console.log(res)
                            let tempFilePaths = JSON.parse(res.data).Body.ImageUrl;
                            // 存储返回图片链接
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
                }).catch(err => {
                    console.log('获取图片地址失败，请稍后重试')
                })
            },
        }
    }
</script>

<style lang="less">
    @import url('../less/upload.less');
</style>
