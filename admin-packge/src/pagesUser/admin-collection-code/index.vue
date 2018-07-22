<template>
    <div class="admin_collection_code">
        <div class="main">
            <div class="tip">让顾客扫一扫，向我付款</div>
            <div class="code_img">
                <img :src="QRCodeUrl" alt="" class="fade_in">
            </div>
            <div class="handler">
                <div class="btn" @click="saveImg">保存收款码</div>
                <div class="btn" @click="records">查看收款记录</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                QRCodeUrl: '',
                //本地临时路径，用于保存本地
                imgUrl: '',
            }
        },
        onShow() {
            this.getCode()
        },
        mounted() {},
        methods: {
            getCode() {
                this.util.post({
                    url: '/api/Merchant/Personal/GetReceivingQRCod',
                    data: {
                        ShopId: wx.getStorageSync('loginInfo').ShopID
                    }
                }).then(res => {
                    // console.log(res.Body.QrCodeUrl)
                    this.QRCodeUrl = res.Body.QrCodeUrl;
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            saveImg() {
                wx.downloadFile({
                    url: this.QRCodeUrl,
                    success: res => {
                        this.imgUrl = res.tempFilePath;
                        this.savePh()
                    },
                    fail: err => {
                        console.log(err)
                    }
                })
            },
            savePh() {
                wx.saveImageToPhotosAlbum({
                    filePath: this.imgUrl,
                    success: res => {
                        this.msg('已为您保存到系统相册')
                    },
                    fail: err => {
                        this.util.phModel();
                    }
                })
            },
            records() {
                wx.navigateTo({
                    url: '/pagesUser/admin-receipt-records'
                })
            }
        },
        components: {}
    }
</script>

<style lang="less">
    .admin_collection_code {
        height: 100%;
        background: #3c5aee;
        overflow-x: hidden;
        .main {
            background: #fff;
            margin: 38rpx 35rpx 0;
            overflow: hidden;
            .tip {
                font-size: 28rpx;
                color: #1a1a1a;
                line-height: 32rpx;
                margin: 88rpx 0 50rpx;
                text-align: center;
            }
            .code_img {
                width: 372rpx;
                height: 372rpx;
                margin: 0 auto 140rpx;
                img {
                    width: 100%;
                    height: 100%;
                    vertical-align: top;
                }
            }
            .handler {
                margin: 0 23rpx;
                height: 126rpx;
                display: flex;
                align-items: center;
                position: relative;
                &::after {
                    content: '';
                    display: block;
                    width: 2rpx;
                    height: 32rpx;
                    background: #0863ee;
                    position: absolute;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    margin: auto;
                }
                &:before {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-top: 1px solid #ebebeb;
                    position: absolute;
                    left: 0;
                    top: 0;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                    z-index: 10;
                }
                .btn {
                    font-size: 32rpx;
                    color: #0863ee;
                    text-align: center;
                    width: 50%;
                }
            }
        }
        .code_img {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 50rpx 0;
            img {
                width: 460rpx;
                height: 460rpx;
            }
        }
        .scanning {
            color: #666;
            font-size: 24rpx;
            text-align: center;
            padding: 10rpx 0;
        }
        .save_code,
        .records {
            margin: 40rpx;
            height: 80rpx;
            line-height: 80rpx;
            text-align: center;
            color: #fff;
            font-size: 30rpx;
            background: skyblue;
        }
    }
</style>
