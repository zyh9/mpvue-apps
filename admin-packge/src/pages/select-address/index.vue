<template>
    <div class="address_info">
        <div class="top">
            <div class="banner">
                <div class="title">选择店铺地址</div>
                <div class="address_top set-between">
                    <!-- <p class="city" v-if='shopId>0'>
                            {{city}}
                        </p>
                        <p class="city" v-else> -->
                    <p class="city">
                        <picker mode="region" @change="bindRegionChange" :value="region" class="citySelect">
                            <view class="picker">
                                {{region[1]}}
                            </view>
                        </picker>
                        <i class="icon icon_arrowDown"></i>
                    </p>
                    <div class="search set-flex set-grow set-align">
                        <i class="icon icon_search"></i>
                        <input type="text" placeholder-class='placeholderStyle' placeholder="小区/写字楼/学校 等" v-model="val" class="input_address set-grow">
                        <i class="icon icon_del" v-if="val" @click="val=''"></i>
                    </div>
                </div>
            </div>
            <p class="tip" v-if="val==''&&localCity==city">附近地址</p>
        </div>
        <!-- <scroll-view scroll-y="true" :style="{height: winHeight+'px'}" v-if="val==''&&!shopId>0&&localCity==city"> -->
        <scroll-view scroll-y="true" :style="{height: winHeight+'px'}" v-if="val==''&&localCity==city">
            <ul class="address_list">
                <li v-for="(v,i) in poiList" :key="i" class="set-flex set-align set-between" :data-address="v" @click="setAddress">
                    <i class="icon  icon_nearby " :class="{icon_nearbyOn:i==0}"></i>
                    <div class="addressBox other set-grow">
                        <p class="address_title set-grow">{{v.title}}</p>
                        <p class="address_con">{{v.address}}</p>
                    </div>
                    <p class="distance">{{v.distance}}km</p>
                </li>
            </ul>
        </scroll-view>
        <scroll-view scroll-y="true" :style="{height: winHeight+'px'}" v-if="val">
            <ul class="address_list" v-if="val">
                <li v-for="(v,i) in addressList" :key="i" class="set-flex set-align" :data-address="v" @click="setAddress">
                    <i class="icon  icon_nearby " :class="{icon_nearbyOn:i==0}"></i>
                    <div class="addressBox set-grow">
                        <p class="address_title set-grow">{{v.title}}</p>
                        <p class="address_con">{{v.address}}</p>
                    </div>
                </li>
            </ul>
        </scroll-view>
    </div>
</template>

<script>
    // 引入SDK核心类
    import QQMapWX from '../../utils/qqmap-wx-jssdk.js';
    const QQMap = new QQMapWX({
        key: 'BZMBZ-OKXRU-DINVZ-2SRN5-4KWJ7-S6B6O'
    })
    import gcoord from 'gcoord';
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
                shopId: '',
                localCity: '' /* 定位地址 */
            }
        },
        onShow() {
            this.val = '';
            this.shopId = wx.getStorageSync('loginInfo').ShopID || '';
            if (this.shopId > 0) {
                this.city = wx.getStorageSync('shopInfo').ShopCity ? wx.getStorageSync('shopInfo').ShopCity : '';
            }
            // 实例化API核心类
            wx.getLocation({
                type: 'wgs84',
                success: res => {
                    this.QQcityInfo(res)
                },
                fail: err => {}
            })
        },
        created() {},
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
        },
        methods: {
            bindRegionChange: function(e) {
                this.city = e.target.value[1];
                this.region = ['', e.target.value[1] == '县' ? e.target.value[0] : e.target.value[1]]
                this.city = this.region[1];
                this.val = '';
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
                        res.result.pois.forEach(e => {
                            e.distance = Math.floor(this.distance(res.result.location.lat, res.result.location.lng, e.location.lat, e.location.lng) * 100) / 100;
                        })
                        res.result.pois.sort((a, b) => a.distance - b.distance)
                        this.poiList = res.result.pois;
                        this.localCity = res.result.address_component.city;
                        this.region = [res.result.address_component.province, res.result.address_component.city, ''];
                        console.log(this.region)
                        /* shopid=0，创建店铺，选择城市 */
                        if (!this.shopId > 0) {
                            this.city = res.result.address_component.city;
                        }
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
            //地址搜索列表
            siteInfo() {
                QQMap.getSuggestion({
                    keyword: this.val,
                    region: this.city,
                    region_fix: 1,
                    success: res => {
                        this.addressList = res.data;
                    },
                    fail: err => {
                        console.log(err)
                    }
                })
            },
            //确定搜索地址
            setAddress(e) {
                let {
                    address
                } = e.currentTarget.dataset;
                wx.setStorageSync('address', Object.assign({}, wx.getStorageSync('address'), {
                    name: address.address,
                    location: this.trans(address.location),
                    title: address.title,
                    // city: address.city,
                    // district: address.district,
                    province: address.province || address.ad_info.province,
                    city: address.city || address.ad_info.city,
                    district: address.district || address.ad_info.district
                }))
                wx.navigateBack({
                    delta: 1
                })
            },
            trans(pos) {
                let {
                    lat,
                    lng
                } = pos;
                var result = gcoord.transform(
                    [lat, lng], // 经纬度坐标
                    gcoord.GCJ02, // 目标坐标系
                    gcoord.BD09, // 当前坐标系    
                );
                let location = {
                    lat: result[0],
                    lng: result[1]
                };
                return location;
            },
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
    }
    .banner {
        padding: 0 24rpx 24rpx;
        background: #3c59ee;
        .title {
            color: #fff;
            font-size: 42rpx;
            line-height: 64rpx;
        }
        .address_top {
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: 64rpx;
            position: relative;
            margin-top: 28rpx;
            padding-left: 17rpx;
            .city {
                height: 100%;
                color: #666;
                font-size: 28rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 40rpx;
                i.icon {
                    margin-left: 10rpx;
                }
            }
            .search {
                flex: 1;
                border-radius: 6rpx;
                padding: 0 24rpx;
                position: relative;
                width: 100%;
                .input_address {
                    height: 60rpx;
                    padding: 0 20rpx;
                    flex-flow: 1;
                    border-radius: 30rpx;
                    color: #707070;
                    font-size: 26rpx;
                }
                .placeholderStyle {
                    font-size: 26rpx;
                    color: #ccc;
                }
            }
        }
    }
    p.tip {
        font-size: 24rpx;
        color: #999;
        line-height: 70rpx;
        padding-top: 14rpx;
        border-bottom: 1rpx solid #e6e6e6;
        margin-left: 24rpx;
    }
    .address_list {
        background: #fff;
        li {
            height: 120rpx;
            margin-left: 36rpx;
            position: relative;
            padding-right: 36rpx;
            &::after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                border-bottom: 1PX solid #ebebeb;
                position: absolute;
                bottom: 0;
                left: 0;
                transform: scaleY(0.5);
                transform-origin: 0 0;
            }
            &:last-child {
                &::after {
                    display: none;
                }
            }
            .addressBox {
                max-width: 623rpx;
                &.other {
                    max-width: 520rpx;
                }
            }
            .address_title {
                color: #1a1a1a;
                font-size: 28rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 100%;
                font-weight: 900;
                span {
                    font-size: 24rpx;
                    color: #999;
                }
            }
            .icon {
                margin-right: 20rpx;
            }
            .address_con {
                color: #999;
                font-size: 24rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 100%;
            }
            .distance {
                color: #999;
                font-size: 22rpx;
                transform: translateY(20rpx);
            }
        }
        li:nth-last-of-type(1) {
            border-bottom: none;
        }
    }
</style>
