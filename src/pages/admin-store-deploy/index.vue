<template>
  <div class="admin_store_deploy">
    <ul class="deploy_list" :style="{height:(liHeight*deployList.length)+'px'}">
      <li v-for="(v,i) in deployList" :key="i" class="deploy_item" :style="{top:(v.top)+'px',zIndex:v.zIndex,transition:v.transition}">
        <div class="item_left"> <img src="../../../static/jp.jpg" alt="">
          <p>{{v.text}}</p>
        </div>
        <div class="move" @touchstart="touchS" @touchmove="touchM" @touchend="touchE" :data-item="v">
          <img src="../../../static/userImg.png" alt="">
        </div>
      </li>
    </ul>
    <p class="deploy_tips">可拖拽调整分类顺序<br/>最多设置8个分类哟</p>
    <div class="templet_bottom">
      <p>保存</p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        deployList: [{
            text: '配置1'
          },
          {
            text: '配置2'
          }, {
            text: '配置3'
          }, {
            text: '配置4'
          }, {
            text: '配置5'
          }, {
            text: '配置6'
          }, {
            text: '配置7'
          },
          {
            text: '配置8'
          }
        ],
        sPageY: 0, //初始坐标
        mPageY: 0, //移动坐标
        mBox: false,
        cIndex: -1, //点击索引
        mObj: {}, //移动数据
        liHeight: 0, //单个配置的高度
      }
    },
    onShow() {},
    mounted() {
      let query = wx.createSelectorQuery();
      query.select('.deploy_item').boundingClientRect()
      query.exec(res => {
        this.liHeight = res[0].height;
        // console.log(this.liHeight)
        this.deployList.forEach((e, i) => {
          e.top = i * this.liHeight;
          e.zIndex = 5;
          e.transition = '0.1s';
        })
        // console.log(this.deployList)
      })
    },
    methods: {
      touchS(e) {
        let {
          item
        } = e.currentTarget.dataset;
        //获取点击的元素在整个列表中的索引
        this.cIndex = this.deployList.findIndex(e => e.text == item.text)
        this.mPageY = this.sPageY = Number(e.touches[0].pageY);
        this.mObj = this.deployList[this.cIndex];
        // console.log(item, this.cIndex, this.sPageY, this.mObj)
      },
      touchM(e) {
        this.mPageY = Number(e.touches[0].pageY);
        this.deployList[this.cIndex].top = this.mPageY;
        this.deployList[this.cIndex].zIndex = 10;
        // console.log(this.mPageY)
      },
      touchE(e) {
        //获取结束点的坐标
        let pageY = Number(e.mp.changedTouches[0].pageY);
        // console.log(pageY, this.sPageY)
        let pos = null;
        if (pageY > this.sPageY && (pageY - this.sPageY) > parseInt(this.liHeight / 2)) {
          //向下拖拽
          pos = Math.round((pageY - this.sPageY) / this.liHeight) + this.cIndex;
        } else if (pageY < this.sPageY && (this.sPageY - pageY) > parseInt(this.liHeight / 2)) {
          //向上拖拽
          pos = this.cIndex - Math.round((this.sPageY - pageY) / this.liHeight) + 1;
        } else {
          //停留原地
          pos = this.cIndex;
        }
        console.log(pos)
        // this.deployList[this.cIndex].top = this.liHeight*pos;
        this.deployList.splice(this.cIndex, 1);
        this.deployList.splice(pos, 0, this.mObj);
        // console.log(this.deployList)
        this.deployList.forEach((e, i) => {
          e.top = i * this.liHeight;
          e.zIndex = 5;
          e.transition = '0.1s';
        })
      },
    },
    components: {}
  }
</script>

<style lang="less">
  .admin_store_deploy {
    height: 100%;
    background: #f5f5f5;
    position: relative;
    .deploy_list {
      position: relative;
      li {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20rpx;
        border-bottom: 1rpx solid #e6e6e6;
        position: absolute;
        left: 0;
        background: #fff;
        .item_left {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          img {
            width: 80rpx;
            height: 80rpx;
          }
          p {
            margin-left: 30rpx;
            text-align: center;
            font-size: 26rpx;
            color: #666;
          }
        }
        .move {
          img {
            width: 80rpx;
            height: 80rpx;
          }
        }
      }
    }
    .deploy_tips {
      text-align: center;
      font-size: 26rpx;
      color: #666;
      margin-top: 20rpx;
    }
    .templet_bottom {
      position: fixed;
      bottom: 20rpx;
      left: 0;
      right: 0;
      p {
        width: 80%;
        background: skyblue;
        margin: 0 auto;
        text-align: center;
        height: 80rpx;
        line-height: 80rpx;
        border-radius: 8rpx;
        color: #fff;
        font-size: 30rpx;
      }
    }
  }
</style>
