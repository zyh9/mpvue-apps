<template>
    <div class="address_info">
        <div class="address_top">
            <p class="city">{{city}}</p>
            <input type="text" placeholder="请输入地址" v-model="val" class="input_address">
            <i class="clear" @click="val=''" v-if="val">+</i>
        </div>
        <scroll-view scroll-y="true" :style="{height: winHeight+'px'}">
            <!-- <ul class="address_list">
                    <li v-for="(v,i) in addressList" :key="i" :data-address="v" @click="setAddress">
                        <p class="address_title">{{v.title}}</p>
                        <p class="address_con">{{v.address}}</p>
                    </li>
                </ul> -->
            <ul class="address_list">
                <li v-for="(v,i) in addressList" :key="i" :data-address="v" @click="setAddress">
                    <p class="address_title">{{v.city}} {{v.district}}</p>
                    <p class="address_con">{{v.name}}</p>
                </li>
            </ul>
        </scroll-view>
    </div>
</template>

<script>
    import util from '../../utils/index';
    import msg from '../../utils/toast';
    // 引入SDK核心类
    import QQMapWX from '../../utils/qqmap-wx-jssdk.js';
    const QQMap = new QQMapWX({
        key: 'BZMBZ-OKXRU-DINVZ-2SRN5-4KWJ7-S6B6O'
    })
    import BMapWX from '../../utils/bmap-wx.js';
    const BMap = new BMapWX({
        ak: 'dZjnRr2t8nBpGswyCB731AFD'
    })
    export default {
        data() {
            return {
                city: '定位中...',
                val: '',
                addressList: [],
                winWidth: '',
                winHeight: '',
                topHeight: ''
            }
        },
        created() {},
        mounted() {
            let query = wx.createSelectorQuery();
            query.select('.address_top').boundingClientRect()
            query.exec(res => {
                // console.log(res)
                this.topHeight = res.height;
            })
            wx.getSystemInfo({
                success: res => {
                    // console.log(res)
                    this.winWidth = res.windowWidth;
                    //减去上方的高度
                    this.winHeight = res.windowHeight - 50;
                }
            })
            // 实例化API核心类
            // wx.getLocation({
            //     type: 'wgs84',
            //     success: res => {
            //         console.log(res)
            //         this.QQcityInfo(res)
            //     },
            //     fail: err => {}
            // })
            this.BDMapInfo()
        },
        methods: {
            //坐标转地址
            QQcityInfo(info) {
                // 调用接口
                QQMap.reverseGeocoder({
                    location: {
                        latitude: info.latitude,
                        longitude: info.longitude
                    },
                    success: res => {
                        // console.log(res)
                        this.city = res.result.address_component.city
                    },
                    fail: err => {
                        msg('位置信息获取失败')
                    }
                })
            },
            //地址搜索列表
            siteInfo() {
                QQMap.search({
                    keyword: this.val,
                    success: res => {
                        console.log(res.data)
                        this.addressList = res.data;
                    },
                    fail: err => {
                        console.log(err)
                    }
                })
            },
            //所在城市获取
            BDMapInfo() {
                BMap.regeocoding({
                    success: res => {
                        // console.log(res)
                        this.city = res.originalData.result.addressComponent.city;
                    },
                    fail: err => {
                        console.log(err)
                    }
                })
            },
            //地址搜索列表
            bdMap() {
                BMap.suggestion({
                    query: this.val,
                    region: this.city,
                    success: res => {
                        console.log(res)
                        this.addressList = res.result;
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
                console.log(address)
            }
        },
        components: {},
        watch: {
            val: function(newVal, oldVal) {
                // this.siteInfo()
                this.bdMap()
                if (!newVal) {
                    this.addressList = [];
                }
            }
        }
    }
</script>

<style lang="less">
    .address_info {
        height: 100%;
        background: #f5f5f5;
        overflow: hidden;
    }
    .address_top {
        background: #fff;
        padding: 20rpx;
        display: flex;
        align-items: center;
        height: 60rpx;
        position: relative;
        .city {
            height: 100%;
            color: #666;
            font-size: 24rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 180rpx;
            margin-right: 20rpx;
        }
        .input_address {
            width: 100%;
            height: 60rpx;
            padding: 0 20rpx;
            flex-flow: 1;
            background: #e6e6e6;
            border-radius: 30rpx;
        }
        .clear{
            width: 30rpx;
            height: 30rpx;
            border-radius: 50%;
            background: #999;
            color: #666;
            font-size: 28rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(45deg);
            position: absolute;
            right:50rpx;
            z-index: 2;
        }
    }
    .address_list {
        background: #fff;
        li {
            padding: 20rpx 30rpx;
            border-bottom: 1rpx dashed #e6e6e6;
            .address_title {
                color: #666;
                font-size: 28rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .address_con {
                color: #999;
                font-size: 24rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        li:nth-last-of-type(1) {
            border-bottom: none;
        }
    }
</style>
