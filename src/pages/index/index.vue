<template>
    <div class="container">
        <div class="search">
            <input type="text" placeholder="请输入输入商品名称" class="input_address">
            <p>搜索</p>
        </div>
        <scroll-view scroll-y="true" :style="{height: winHeight+'px'}" lower-threshold="60" @scrolltolower="scrollHandler" @scroll="eventScroll">
            <ul class="classification_list">
                <li class="classification_item" v-for="(ele,ind) in 7" :key="ind">
                    <img src="../../../static/userImg.png" alt="">
                    <p>商品{{ind+1}}</p>
                </li>
            </ul>
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
                loading: true,
                winWidth: 0,
                winHeight: 0,
                loginOnoff: true
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
            let query = wx.createSelectorQuery();
            query.select('.search').boundingClientRect()
            query.exec(res => {
                let height = res[0].height;
                wx.getSystemInfo({
                    success: res => {
                        // console.log(res)
                        this.winWidth = res.windowWidth;
                        //减去上方的高度
                        this.winHeight = res.windowHeight - height;
                    }
                })
            })
            //获取电影条目
            this.loadMovies()
            //获取店铺信息
            this.shopInfoSum()
            this.$store.dispatch('code', {
                a: 1,
                b: 2
            })
            console.log(this.$store.state.mutations)
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
                        // console.log(pos)
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
                    url: '/api/Customer/Login/WxJsCodeLogin',
                    data: {
                        jsCode: '1',
                        // qrCodeId: '20180504',
                        wxUserInfo: JSON.stringify(this.userInfo)
                    },
                    headers: {
                        appid: '1',
                        // token: 'e6a3823d1e6c4dbe954fe7fbfc4b7140'
                    }
                }).then(res => {
                    if (res.State == 1) {
                        let objInfo = res.Body;
                        // 会覆盖掉原来该 key 对应的内容
                        wx.setStorageSync('loginInfo', objInfo)
                    } else if (res.State == -10) {
                        if (!(wx.getStorageSync('loginInfo').Token) && this.loginOnoff) {
                            this.loginOnoff = false;
                            //再次获取用户信息
                            this.userLogin()
                        }
                    } else {
                        this.msg(res.Msg)
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            shopInfoSum() {
                // let allShopInfo = await this.allShopInfo()
                // console.log(allShopInfo)
                // let shopPageInfo = await this.shopPageInfo()
                // console.log(shopPageInfo)
                this.allShopInfo()
                this.shopPageInfo()
            },
            allShopInfo() {
                return this.util.post({
                    url: '/api/Customer/Browse/GetShopAllGoods',
                    data: {
                        shopId: 1
                    },
                    headers: {
                        appid: '1',
                        token: wx.getStorageSync('loginInfo').Token || ''
                    }
                })
                .then(res => {
                    if (res.State == 1) {
                        console.log(res)
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            shopPageInfo() {
                return this.util.post({
                    url: '/api/Customer/Browse/GetShopGoods',
                    data: {
                        shopId: 1,
                        GoodType: 0,
                        PageSize: 10,
                        PageIndex: 0
                    },
                    headers: {
                        appid: '1',
                        token: wx.getStorageSync('loginInfo').Token || ''
                    }
                })
                .then(res => {
                    if (res.State == 1) {
                        console.log(res)
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            loadMovies() {
                this.loading = true;
                // wx.showLoading({
                //     title: '加载中...',
                // })
                wx.request({
                    url: 'https://db.miaov.com/doubanapi/v0/movie/list',
                    data: {
                        page: this.page,
                        size: this.size
                    },
                    header: {
                        'content-type': 'application/json'
                    },
                    method: 'GET',
                    success: res => {
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
                    },
                    fail: err => {
                        console.log(err)
                    }
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
                // console.log(e.target.scrollTop)
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
        .search {
            background: #fff;
            padding: 20rpx;
            display: flex;
            align-items: center;
            height: 60rpx;
            position: relative;
            .input_address {
                width: 100%;
                height: 60rpx;
                padding: 0 20rpx;
                flex-flow: 1;
                background: #e6e6e6;
                border-radius: 30rpx;
                color: #666;
                font-size: 24rpx;
            }
            .clear {
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
                right: 50rpx;
                z-index: 2;
            }
            p {
                height: 100%;
                color: #666;
                font-size: 24rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 120rpx;
            }
        }
    }
    .classification_list {
        overflow: hidden;
        .classification_item {
            width: 25%;
            float: left;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 12rpx 0;
            img {
                width: 80rpx;
                height: 80rpx;
            }
            p {
                color: #666;
                font-size: 24rpx;
                text-align: center;
                padding: 5rpx 0;
            }
        }
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
        img {
            width: 100%;
            height: 220rpx;
        }
        .title {
            font-size: 24rpx;
            text-align: center;
            color: #333;
            margin: 5rpx 0;
            .rate {
                color: #f00;
            }
        }
        .year-type {
            text-align: center;
            font-size: 22rpx;
            color: #888;
        }
    }
</style>
