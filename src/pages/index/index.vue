<template>
    <div class="container">
        <scroll-view scroll-y="true" style="height: 100%" lower-threshold="60" @scrolltolower="scrollHandler">
            <div v-for="(v,i) in movies" :key="i" class="list-item">
                <div v-for="(item,index) in v" :key="index" class="movie-item">
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
    export default {
        data() {
            return {
                userInfo: {},
                movies: [],
                page: 1,
                size: 6,
                loading: true
            }
        },
        created() {
            // 调用应用实例的方法获取全局数据
            this.getUserInfo()
        },
        mounted() {
            //获取电影条目
            this.loadMovies()
        },
        methods: {
            getUserInfo() {
                // 调用登录接口
                wx.login({
                    success: () => {
                        wx.getUserInfo({
                            success: (res) => {
                                this.userInfo = res.userInfo
                            }
                        })
                    }
                })
            },
            loadMovies() {
                this.loading = true;
                wx.request({
                    url: `https://db.miaov.com/doubanapi/v0/movie/list?page=${this.page}&size=${this.size}`,
                    success: (res) => {
                        setTimeout(_ => {
                            let {
                                data
                            } = res.data;
                            for (let i = 0; i < data.length; i += 2) {
                                this.movies.push([data[i], data[i + 1] ? data[i + 1] : null])
                            }
                            this.loading = false;
                        }, 600)
                    }
                })
            },
            scrollHandler() {
                console.log(this.page)
                this.page++;
                this.loadMovies()
            },
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
    }
    .movie-item .title {
        font-size: 28rpx;
        text-align: center;
        color: #333;
        margin: 5rpx 0;
    }
    .movie-item .title .rate {
        color: #f00;
    }
    .movie-item .year-type {
        text-align: center;
        font-size: 20rpx;
        color: #888;
    }
</style>
