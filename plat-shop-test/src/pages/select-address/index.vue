<template>
    <div class="address_info">
        <div class="top">
            <div class="pageTitle">选择收货地址</div>
            <div class="address_top set-between">
                <p class="city">
                    <!-- {{city}} -->
                    <picker mode="region" @change="bindRegionChange" :value="region" class="citySelect">
                        <view class="picker">
                            {{region[1]}}
                        </view>
                    </picker>
                    <i class="icon icon_arrowDown"></i>
                </p>
                <div class="search set-flex set-grow set-align">
                    <i class="icon icon_search"></i>
                    <input type="text" placeholder="小区/写字楼/学校 等" v-model="val" class="input_address set-grow">
                    <i class="icon icon_del" v-if="val" @click="val=''"></i>
                </div>
            </div>
        </div>
        <scroll-view scroll-y="true" :style="{height: winHeight+'px'}" v-if="val==''&&pos">
            <p class="tip">附近地址</p>
            <ul class="address_list">
                <li v-for="(v,i) in poiList" :key="i" class="set-flex set-align" :data-address="v" @click="setAddress">
                    <i class="icon  icon_nearby" :class="{icon_nearbyOn:i==0}"></i>
                    <div class="addressBox_other set-grow">
                        <p class="address_title_other  set-grow">{{v.title}}</p>
                        <p class="address_con_other">{{v.address}}</p>
                    </div>
                    <p class="distance">{{v.distance}}km</p>
                </li>
            </ul>
        </scroll-view>
        <scroll-view scroll-y="true" :style="{height: winHeight+'px'}" v-if="val">
            <ul class="address_list">
                <li v-for="(v,i) in addressList" :key="i" class="set-flex set-align" :data-address="v" @click="setAddress">
                    <i class="icon  icon_nearby " :class="{icon_nearbyOn:i==0}"></i>
                    <div class="addressBox set-grow">
                        <p class="address_title  set-grow">{{v.title}}</p>
                        <p class="address_con">{{v.address}}</p>
                    </div>
                </li>
            </ul>
        </scroll-view>
    </div>
</template>

<script>
    import gcoord from 'gcoord'
    // 引入SDK核心类
    import QQMapWX from '../../utils/qqmap-wx-jssdk.js';
    const QQMap = new QQMapWX({
        key: 'BZMBZ-OKXRU-DINVZ-2SRN5-4KWJ7-S6B6O'
    })
    export default {
        data() {
            return {
                city: '定位中...',
                val: '',
                addressList: [],
                winWidth: '',
                winHeight: '',
                region: [],
                customItem: '请选择',
                poiList: [],
            }
        },
        onShow() {
            this.val = '';
        },
        mounted() {
            let query = wx.createSelectorQuery();
            query.select('.top').boundingClientRect()
            query.exec(res => {
                let height = res[0].height;
                wx.getSystemInfo({
                    success: res => {
                        this.winWidth = res.windowWidth;
                        //减去上方的高度
                        this.winHeight = res.windowHeight - height;
                    }
                })
            })
            // 实例化API核心类
            wx.getLocation({
                type: 'wgs84',
                success: res => {
                    this.QQcityInfo(res)
                },
                fail: err => {}
            })
        },
        methods: {
            bindRegionChange: function(e) {
                this.city = e.target.value[1];
                this.region = ['', e.target.value[1] == '县' ? e.target.value[0] : e.target.value[1]];
            },
            //坐标转地址
            QQcityInfo(info) {
                // 调用接口
                QQMap.reverseGeocoder({
                    location: {
                        latitude: info.latitude,
                        longitude: info.longitude
                    },
                    get_poi: 1, //返回poi列表
                    poi_options: `address_format=short`,
                    success: res => {
                        // console.log(res.result.pois, '000',res.result.location)
                        res.result.pois.forEach(e => {
                            e.distance = Math.floor(this.distance(res.result.location.lat, res.result.location.lng, e.location.lat, e.location.lng) * 100) / 100;
                        })
                        res.result.pois.sort((a, b) => a.distance - b.distance)
                        this.poiList = res.result.pois;
                        // console.log(this.poiList)
                        this.city = res.result.address_component.city;
                        this.region = [res.result.address_component.province, res.result.address_component.city, '']
                    },
                    fail: err => {
                        this.msg('位置信息获取失败')
                    }
                })
            },
            distance(lat1, lng1, lat2, lng2) {
                var radLat1 = lat1 * Math.PI / 180.0;
                var radLat2 = lat2 * Math.PI / 180.0;
                var a = radLat1 - radLat2;
                var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
                var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
                s = s * 6378.137;
                s = Math.round(s * 10000) / 10000;
                return s * 10
            },
            siteInfo() {
                QQMap.getSuggestion({
                    keyword: this.val,
                    region: this.city,
                    success: res => {
                        console.log(res, '新检索')
                        this.addressList = res.data;
                    },
                    fail: err => {
                        console.log(err)
                    }
                })
            },
            trans(location) {
                var result = gcoord.transform(
                    [location.lng, location.lat], // 经纬度坐标
                    gcoord.GCJ02, // 当前坐标系
                    gcoord.BD09 // 目标坐标系
                );
                return result;
            },
            //确定搜索地址
            setAddress(e) {
                // console.log(e)
                let {
                    address
                } = e.currentTarget.dataset;
                //转换坐标之后的地址
                const location = this.trans(address.location);
                // console.log(location)
                wx.setStorageSync('address', Object.assign({}, wx.getStorageSync('address'), {
                    name: address.address,
                    location: {
                        lat:location[1],
                        lng:location[0]
                    },
                    title: address.title,
                    city: address.city || address.ad_info.city,
                    district: address.district || address.ad_info.district
                }))
                // return;
                wx.navigateBack({
                    delta: 1
                })
            }
        },
        computed: {
            pos: function() {
                if (this.region[1] != wx.getStorageSync('QQmap').city) {
                    this.val = '';
                    return false;
                } else {
                    this.val = '';
                    return true;
                }
            }
        },
        components: {},
        watch: {
            val: function(newVal, oldVal) {
                if (!newVal) {
                    this.addressList = [];
                } else {
                    this.siteInfo();
                }
            },
        },
    }
</script>

<style lang="less">
    .address_info {
        height: 100%;
        background: #fff;
        overflow: hidden;
        padding: 0 36rpx;
    }
    .address_top {
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 64rpx;
        position: relative;
        margin: 10rpx auto;
        .city {
            height: 100%;
            color: #666;
            font-size: 28rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 24rpx;
            i.icon {
                margin-left: 10rpx;
            }
        }
        .search {
            flex: 1;
            background: #f5f5f5; // background: red;
            border-radius: 6rpx;
            padding: 0 24rpx;
            position: relative;
            width: 100%;
            .input_address {
                // width: 100%;
                height: 60rpx;
                padding: 0 20rpx 0 14rpx;
                flex-flow: 1;
                border-radius: 30rpx;
                color: #707070;
                font-size: 24rpx;
            }
            .icon {
                width: 24rpx;
                height: 24rpx;
            }
        }
    }
    p.tip {
        font-size: 24rpx;
        color: #999;
        line-height: 70rpx;
        position: relative;
        &:after {
            content: '';
            display: block;
            width: 100%;
            height: 0;
            border-bottom: 1px solid #ebebeb;
            position: absolute;
            bottom: 0;
            left: 0;
            transform: scaleY(0.5);
            transform-origin: 0 0;
        }
    }
    .address_list {
        background: #fff;
        padding-bottom: 10rpx;
        li {
            height: 120rpx;
            position: relative;
            .addressBox {
                max-width: 580rpx;
            }
            .addressBox_other {
                max-width: 480rpx;
            }
            .address_title,
            .address_title_other {
                color: #1a1a1a;
                font-size: 28rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 96%;
                font-weight: 900;
                span {
                    font-size: 24rpx;
                    color: #999;
                }
            }
            .icon {
                margin-right: 20rpx;
            }
            .address_con,
            .address_con_other {
                color: #999;
                font-size: 24rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 96%;
            }
            .distance {
                position: absolute;
                right: 0;
                top: 0;
                color: #999;
                font-size: 22rpx;
                transform: translateY(20rpx);
            }
            &:after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                border-bottom: 1px solid #ebebeb;
                position: absolute;
                bottom: 0;
                left: 0;
                transform: scaleY(0.5);
                transform-origin: 0 0;
            }
        }
    }
</style>
