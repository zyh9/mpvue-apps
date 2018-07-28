<template>
  <div class="type_list">
    <h3 class="title">分类列表</h3>
    <div class="options" v-for="(v,i) in typeList" :key="i">
      <p>{{v.Name}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        typeList:[]
      }
    },
    onReady() {
      this.typeList = [];
      this.getTypeList()
    },
    methods: {
      getTypeList() {
        this.util.post({
          url: '/api/Customer/Browse/GetGoodsTypes',
          data: {
            ShopId: '1817162813555718'
          }
        }).then(res => {
          this.typeList = res.Body;
        }).catch(err => {
          this.msg(err.Msg)
        })
      }
    },
    watch: {},
    onUnload() {}
  }
</script>

<style lang="less">
  .type_list {
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    position: relative;
    .title {
      margin: 20rpx 36rpx;
      font-size: 46rpx;
      font-weight: 700;
    }
    .options {
      background: url('https://otherfiles-ali.uupt.com/Stunner/FE/C/icon_arrowRight.png') no-repeat right center;
      background-size: 25rpx 25rpx;
      height: 108rpx;
      display: flex;
      align-items: center;
      position: relative;
      margin: 0 36rpx;
      &:after {
        content: '';
        display: block;
        width: 100%;
        height: 0;
        border-bottom: 1px solid #ebebeb;
        position: absolute;
        left: 0;
        bottom: 0;
        transform: scaleY(0.5);
        transform-origin: 0 0;
        z-index: 10;
      }
      p {
        color: #000;
        font-size: 30rpx;
      }
      .icon {
        margin-right: 16rpx;
      }
    }
    .options:nth-last-child(1) {
      &:after {
        display: none !important;
      }
    }
  }
</style>
