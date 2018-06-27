<template>
    <div class="map_info">
        <map id="myMap" class="qq_map" :longitude="longitude" :latitude="latitude" scale="14" show-location="true" @regionchange="regionchange" @begin="begin" @end="end" :controls="controls" @controltap="controlList"></map>
        <p class="adress_tips">{{addressInfo}}</p>
    </div>
</template>

<script>
    import QQMapWX from '../../utils/qqmap-wx-jssdk.js';
    const QQMap = new QQMapWX({
        key: 'BZMBZ-OKXRU-DINVZ-2SRN5-4KWJ7-S6B6O'
    })
    export default {
        data() {
            return {
                mapCtx: {},
                controls: [{
                        //控价id
                        id: 1,
                        //图标路径
                        iconPath: require('../../../static/myAddr.png'),
                        //位置
                        position: {
                            left: 0,
                            top: 0,
                            width: 30,
                            height: 30,
                        },
                        //是否可点击
                        clickable: true
                    },
                    {
                        //控价id
                        id: 2,
                        //图标路径
                        iconPath: require('../../../static/circlel.png'),
                        //位置
                        position: {
                            left: 20,
                            top: 0,
                            width: 50,
                            height: 50,
                        },
                        //是否可点击
                        clickable: true
                    }
                ],
                winWidth: 0,
                winHeight: 0,
                addressInfo: '正在获取您的位置...',
                longitude: 0,
                latitude: 0,
                n: 0,
            }
        },
        onReady() {
            this.mapCtx = wx.createMapContext('myMap');
        },
        onShow() {
            // 实例化API核心类
            wx.getLocation({
                type: 'wgs84',
                success: res => {
                    //设置当前位置
                    this.latitude = res.latitude;
                    this.longitude = res.longitude;
                    this.posText()
                },
                fail: err => {}
            })
            //获取屏幕宽高
            wx.getSystemInfo({
                success: res => {
                    // console.log(res)
                    this.winWidth = res.windowWidth;
                    this.winHeight = res.windowHeight;
                    this.controls[0].position.left = this.winWidth / 2 - this.controls[0].position.width / 2;
                    this.controls[0].position.top = this.winHeight / 2 - this.controls[0].position.height / 2;
                    this.controls[1].position.top = this.winHeight - this.controls[1].position.height - 20;
                }
            })
        },
        methods: {
            //视野发生变化时触发
            end(e) {
                if (e.mp.type == 'end') {
                    console.log('手指离开')
                    // return;
                    this.posInfo()
                }
            },
            posInfo() {
                //获取移动视野时的经纬度
                this.mapCtx.getCenterLocation({
                    success: res => {
                        // console.log(res)
                        //设置移动之后位置
                        this.latitude = res.latitude;
                        this.longitude = res.longitude;
                        this.posText()
                    },
                    fail: err => {
                        console.log(err)
                    }
                })
            },
            posText() {
                //调用逆解析
                QQMap.reverseGeocoder({
                    location: {
                        latitude: this.latitude,
                        longitude: this.longitude
                    },
                    success: res => {
                        // console.log(res)
                        this.addressInfo = res.result.formatted_addresses.recommend;
                        console.log(this.addressInfo)
                    },
                    fail: err => {
                        console.log(err)
                    }
                })
            },
            //移动到当前定位点
            controlList(e) {
                console.log('移动至原点')
                //控件id为2 => 恢复自身定位
                if (e.mp.controlId == 2) {
                    this.mapCtx.moveToLocation()
                }
            },
        },
        components: {}
    }
</script>

<style lang="less">
    .map_info {
        height: 100%;
        .qq_map {
            width: 100%;
            height: 100%;
        }
        .adress_tips {
            position: absolute;
            z-index: 100;
            width: 360rpx;
            height: 60rpx;
            border-radius: 30rpx;
            line-height: 60rpx;
            padding: 0 8rpx;
            text-align: center;
            background: rgba(0, 0, 0, 0.6);
            color: #fff;
            font-size: 24rpx;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -160%);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
</style>
