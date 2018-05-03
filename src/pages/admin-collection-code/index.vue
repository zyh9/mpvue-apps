<template>
  <div class="admin_collection_code">
    <div class="code_img">
      <img src="../../../static/jp.jpg" alt="">
    </div>
    <p class="scanning">让顾客扫一扫，向我付款</p>
    <div class="save_code" @click="saveImg">保存图片</div>
    <div class="records" @click="records">查看收款记录</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    mounted() {},
    methods: {
      saveImg() {
        wx.saveImageToPhotosAlbum({
          filePath: require('../../../static/jp.jpg'),
          success: res => {
            console.log(res)
          },
          fail: err => {
            console.log(err)
          }
        })
      },
      records(){
         wx.navigateTo({
          url: '/pages/admin-receipt-records/main'
        })
      }
    },
    components: {}
  }
</script>

<style lang="less">
  .admin_collection_code {
    height: 100%;
    background: #f5f5f5;
    overflow-x: hidden;
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
    .save_code,.records {
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
