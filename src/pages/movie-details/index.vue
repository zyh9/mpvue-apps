<template>
  <div class="details">
    <video :src="movie.video" style="width: 100%" :poster="movie.cover" controls></video>
    <div class="movie-content">
      <div class="title">{{movie.title}}</div>
      <div class="type">{{movie.rate}}分 / {{movie.types}}</div>
      <div class="pubdate">上映时间: {{movie.pubdate}} ({{movie.country}})</div>
      <ul class="tags">
        <li v-for="(v,i) in movie.tags" :key="i">{{v}}</li>
      </ul>
      <div class="summary">电影简介：{{movie.summary}}</div>
    </div>
  </div>
</template>

<script>
  import util from '../../utils/index';
  export default {
    data() {
      return {
        movie: []
      }
    },
    // onLoad(options) {
    //   console.log(options)
    // },
    mounted() {
      console.log(this.$root.$mp.query)
      this.movieDetails(this.$root.$mp.query.id)
    },
    methods: {
      movieDetails(id) {
        util.get(
          'https://db.miaov.com/doubanapi/v0/movie/detail/' + id,
        ).then(res => {
          // console.log(res)
          let {
            data
          } = res.data;
          console.log(data)
          this.movie = data;
        }).catch(err => {
          console.log(err)
        })
      }
    },
    components: {}
  }
</script>

<style lang="less">
  .details {
    .movie-content {
      padding: 20rpx;
      .title {
        color: #333;
        font-size: 30rpx;
        margin-bottom: 20rpx;
      }
      .type,
      .pubdate {
        color: #666;
        font-size: 24rpx;
        margin-bottom: 20rpx;
      }
      .tags {
        overflow: hidden;
        margin-bottom: 20rpx;
        li {
          padding: 4rpx 12rpx;
          float: left;
          color: skyblue;
          font-size: 24rpx;
          border: 1rpx solid skyblue;
          border-radius: 4rpx;
          margin: 0 0 20rpx 20rpx;
        }
      }
      .summary{
        color: #666;
        font-size: 24rpx;
      }
    }
  }
</style>
