<template>
    <div class="container">
        <scroll-view scroll-y="true" style="height: 100%" lower-threshold="60" @scrolltolower="scrollHandler" @scroll="eventScroll">
            <div v-for="(v,i) in movies" :key="i" class="list-item">
                <div v-for="(item,index) in v" :key="index" class="movie-item" :data-item="item" @click="goDetails">
                    <img :src="item.cover" alt="信息">
                    <p class="title">{{item.title}}评分<span class="rate">{{item.rate}}</span></p>
                    <p class="year-type">{{item.types}} / {{item.year}}</p>
                </div>
            </div>
            <aside class="loading" v-show="loading">
                <div class="donut"></div>
            </aside>
        </scroll-view>
    </div>
</template>

<script>
    import BMapWX from '../../utils/bmap-wx.js';
    const BMap = new BMapWX({
        ak: 'dZjnRr2t8nBpGswyCB731AFD'
    })
    export default {
        data() {
            return {
                userInfo: {},
                movies: [],
                page: 1,
                size: 8,
                loading: true
            }
        },
        onShareAppMessage() {
            return {
                title: 'UU商城',
                path: "pages/index/main",
                imageUrl: require('../../../static/jp.jpg')
            }
        },
        created() {
            //全局的设置
            // wx.showNavigationBarLoading()
            // setTimeout(_ => {
            //     wx.hideNavigationBarLoading()
            // }, 1000)
            // 调用应用实例的方法获取全局数据
            this.getUserInfo()
            //调用百度地图
            this.BDMapInfo()
        },
        onShow() {},
        mounted() {
            //获取电影条目
            // this.loadMovies()
        },
        methods: {
            //所在城市获取
            BDMapInfo() {
                BMap.regeocoding({
                    success: res => {
                        // console.log(res.wxMarkerData[0])
                        //x,y(经度,纬度)
                        let pos = {
                            city: res.originalData.result.addressComponent.city,
                            //经度
                            longitude: res.wxMarkerData[0].longitude,
                            //纬度
                            latitude: res.wxMarkerData[0].latitude
                        }
                        console.log(pos)
                        wx.setStorageSync('BMap', pos)
                    },
                    fail: err => {
                        console.log(err)
                    }
                })
            },
            getUserInfo() {
                // 调用登录接口
                wx.login({
                    success: (res) => {
                        wx.getUserInfo({
                            success: res => {
                                this.userInfo = res.userInfo
                                wx.setStorageSync('userInfo', res.userInfo)
                                this.userLogin()
                            },
                            fail: err => {
                                console.log(err)
                            }
                        })
                    },
                    fail: err => {
                        console.log(err)
                    }
                })
            },
            userLogin() {
                this.util.post({
                    url: '/api/Customer/Base/Login',
                    data: {
                        jsCode: '1',
                        qrCodeId: '20180504',
                        wxUserInfo: JSON.stringify(this.userInfo)
                    },
                    headers: {
                        appid: '1',
                        // token: 'e6a3823d1e6c4dbe954fe7fbfc4b7140'
                    }
                }).then(res => {
                    if (res.State == 1) {} else {
                        this.msg(res.Msg)
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            loadMovies() {
                this.loading = true;
                // wx.showLoading({
                //     title: '加载中...',
                // })
                this.util.get({
                    url: 'https://db.miaov.com/doubanapi/v0/movie/list',
                    params: {
                        page: this.page,
                        size: this.size
                    }
                }).then(res => {
                    // console.log(res)
                    setTimeout(_ => {
                        let {
                            data
                        } = res.data;
                        for (let i = 0; i < data.length; i += 2) {
                            this.movies.push([data[i], data[i + 1] ? data[i + 1] : null])
                        }
                        this.loading = false;
                        // wx.hideLoading()
                    }, 600)
                }).catch(err => {
                    console.log(err)
                })
            },
            scrollHandler() {
                console.log(this.page)
                this.page++;
                this.loadMovies()
            },
            goDetails(e) {
                let {
                    _id
                } = e.currentTarget.dataset.item;
                // console.log(_id)
                wx.navigateTo({
                    url: '/pages/movie-details/main?id=' + _id
                })
            },
            //监听滚动距离
            eventScroll(e) {
                console.log(e.target.scrollTop)
            }
        },
        components: {},
    }
</script>

<style lang="less">
    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        @-webkit-keyframes donut-spin {
            0% {
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
            }
            100% {
                -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
            }
        }
        @keyframes donut-spin {
            0% {
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
            }
            100% {
                -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
            }
        }
        .donut {
            border: 4rpx solid rgba(0, 0, 0, 0.1);
            border-left-color: #7983ff;
            border-radius: 50%;
            width: 40rpx;
            height: 40rpx;
            margin: 10rpx 0;
            -webkit-animation: donut-spin 1s linear infinite;
            animation: donut-spin 1s linear infinite;
        }
    }
    .container {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
    .list-item {
        width: 100%;
        overflow: hidden;
        box-sizing: border-box;
        padding: 0 20rpx;
    }
    .movie-item {
        width: 48%;
        margin: 1%;
        float: left;
    }
    .movie-item img {
        width: 100%;
        height: 220rpx;
    }
    .movie-item .title {
        font-size: 24rpx;
        text-align: center;
        color: #333;
        margin: 5rpx 0;
    }
    .movie-item .title .rate {
        color: #f00;
    }
    .movie-item .year-type {
        text-align: center;
        font-size: 22rpx;
        color: #888;
    }
</style>
