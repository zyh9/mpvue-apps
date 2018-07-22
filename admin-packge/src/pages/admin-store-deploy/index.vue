<template>
  <div class="admin_store_deploy">
    <div class="store_deploy_top">
      <ul class="deploy_list">
        <li v-for="(v,i) in deployList" :key="i" :data-item="v" :data-index="i" @click='checkItem(v)' :style="{marginLeft:v.Leftv+'px'}">
          <!-- <div class="item"> -->
          <i class="icon icon_adminCheck" :class="{icon_adminChecked:checkId==v.TypeId}" v-if='indexBlock==0'></i>
          <i class="icon icon_reduce" style="margin-right:24rpx;" v-if='indexBlock==1' @click="touchDel(i)"></i>
          <div class="label">分类名称</div>
          <input type='text' @focus="inpFocus" :class="{input_dis:indexBlock!=1}" placeholder="请输入分类名称" maxlength="8" :disabled='indexBlock!=1' placeholder-class='placeholderStyle' v-model='v.TypeName'>
          <div v-if="indexBlock==2" style="display:flex" class="itemIcon">
            <i class="icon icon_rise" v-if="v.sort != 1" :class="{icon_hidden:v.sort == deployList.length}" @click="topMove(v,i)"></i>
            <i class="icon icon_drop" v-if="v.sort != deployList.length" :class="{icon_hidden:v.sort == 1}" @click="botMove(v,i)"></i>
          </div>
          <!-- </div> -->
          <div class="list_item_del" v-if='indexBlock==1' @click='delAddress(v,i)' :style="{right:-delBtnWidth+'px'}" :data-item="v">删除</div>
        </li>
      </ul>
      <div>
        <div class="optionAdd" v-if="indexBlock==1&&(deployList.length<20||deployList.length==0)" @click="addInfo">
          <i class="icon icon_emitAdd"></i>点击添加分类
        </div>
        <p class="deploy_tips" v-if="(deployList.length==0||deployList.length<20)&&!checkId">最多设置20个分类哟</p>
      </div>
    </div>
    <div class="handler" v-if="indexBlock==3&&!checkId">
      <div class="btn on btn1" @click="sortInfo">
        <i class="icon icon_adminSort"></i>
        <p>排序</p>
      </div>
      <div class="btn on btn2" @click="editInfo">
        <i class="icon icon_adminEmit"></i>
        <p>编辑</p>
      </div>
    </div>
    <div class="handler" v-if="indexBlock==1">
      <div class="btn on btnl" @click="cancelSet">取消</div>
      <div class="btn on btnr" @click="setInfo">保存</div>
    </div>
    <div class="handler" v-if="indexBlock==2">
      <div class="btn on btnl" @click="cancelSort">取消</div>
      <div class="btn on btnr" @click="setSort">保存</div>
    </div>
    <div class="mask" v-if='modalFlag' @click='delCancel'></div>
    <div class="layBox" v-if='modalFlag'>
      <h2 class="title">请您确认</h2>
      <p>您确定要删除此分类吗？</p>
      <div class="modalCont_btn">
        <div class="modalCont_btn_cont">
          <div class="modalCont_btn_cont_cancel" @click="delCancel">
            取消
          </div>
          <div class="modalCont_btn_cont_conf" @click="delSave">
            确定
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        modalFlag: false,
        checkId: "",
        deployList: [],
        indexBlock: 0, // 1.编辑 2.排序 3.综合 0.添加商品或者更改分类
        Leftv: 0,
        delBtnWidth: 90,
        shopId: "",
        oldList: [],
        delItem: null,
        delIndex: null,
      };
    },
    onLoad() {
      this.indexBlock = this.$mp.query.emit;
      console.log(this.$mp.query.emit, '显示页面')
      this.oldList = [];
      this.deployList = [];
      this.checkId = this.$mp.query.goodType;
      this.shopId = wx.getStorageSync("loginInfo").ShopID || "";
      this.getInfo();
    },
    onShow() {},
    methods: {
      inpFocus() {
        this.deployList.forEach((item, i) => {
          item.Leftv = 0;
        })
      },
      //删除
      delAddress(v, i) {
        console.log(v, typeof v.ifSave)
        this.modalFlag = true;
        this.delItem = v;
        this.delIndex = i;
      },
      delSave() {
        if (this.delItem.ifSave) {
          this.util
            .post({
              url: "/api/Merchant/ShopManage/DeleteGoodType",
              data: {
                ShopID: this.shopId,
                TypeId: this.delItem.TypeId
              }
            })
            .then(res => {
              if (res.State == 1) {
                this.deployList = [];
                this.modalFlag = false;
                this.msg(res.Msg)
                setTimeout(_ => {
                  this.getInfo();
                }, 200)
              } else {
                this.msg(res.Msg)
              }
            })
            .catch(err => {
              this.msg(err.Msg);
              this.modalFlag = false;
              if (this.indexBlock == 1) {
                this.deployList.forEach((item, i) => {
                  item.Leftv = 0;
                })
                this.deployList[index].Leftv = -70
              } else {
                console.log('move');
              }
            });
        } else {
          this.deployList.splice(this.delIndex, 1);
          this.modalFlag = false;
          this.msg('删除成功')
        }
      },
      delCancel() {
        this.modalFlag = false;
      },
      //排序
      topMove(v, i) {
        // console.log(v, i)
        if (i != 0) {
          let obj = this.deployList.splice(i, 1)
          this.deployList.splice(--i, 0, ...obj)
          // console.log(this.deployList)
          this.sortIndex()
        } else {}
      },
      botMove(v, i) {
        // console.log(v, i)
        if (i < this.deployList.length - 1) {
          let obj = this.deployList.splice(i, 1);
          this.deployList.splice(++i, 0, ...obj)
          // console.log(this.deployList)
          this.sortIndex()
        } else {}
      },
      sortIndex() {
        this.deployList.forEach((element, index) => {
          this.deployList[index].sort = index + 1;
        })
        // console.log(this.deployList)
      },
      setSort() {
        this.util
          .post({
            url: "/api/Merchant/ShopManage/UpdateGoodType",
            data: {
              ShopID: this.shopId,
              GoodsTypeList: this.deployList
            }
          })
          .then(res => {
            this.indexBlock = 3;
            this.deployList = [];
            this.getInfo();
            console.log(this.indexBlock, '自定义')
          })
          .catch(err => {
            this.msg(err.Msg);
          });
      },
      /* 选择分类 */
      checkItem(v) {
        if (this.indexBlock == 0) {
          this.checkId = v.TypeId;
          wx.setStorageSync("goodsType", v);
          wx.setStorageSync('TypeId', v.TypeId);
          wx.navigateBack({
            delta: 1
          });
        }
      },
      /* 获取分类信息 */
      getInfo() {
        wx.showLoading({
          title: '加载中',
        })
        this.util
          .post({
            url: "/api/Merchant/ShopManage/ShopGoodTypes",
            data: {
              ShopID: this.shopId
            }
          })
          .then(res => {
            let gt = wx.getStorageSync("goodsType");
            // console.log(gt)
            //是否从添加商品进入
            if (this.$mp.query.goodType == 0) {
              this.checkId = gt.TypeId;
            }
            let dep = []
            res.Body.forEach((element, index) => {
              element.Leftv = 0;
              element.sort = index + 1;
              element.PatentID = 0;
              element.TypeNote = '';
              element.TypeImage = '';
              element.ifSave = true;
              dep.push(element);
            });
            this.deployList = dep;
            this.oldList = JSON.parse(JSON.stringify(res.Body));
            if (this.$mp.query.emit == 0 && this.indexBlock == 1) {
              /* 如果是修改商品信息进来，选择第一个分类，返回商品信息页 */
              wx.setStorageSync("goodsType", res.Body[0]);
            } else {}
            setTimeout(function() {
              wx.hideLoading()
            }, 200)
          })
          .catch(err => {
            this.msg(err.Msg);
          });
      },
      //排序
      sortInfo() {
        if (this.deployList.length == 0) {
          this.msg('请添加分类再排序');
          return
        }
        if (this.deployList.length < 2) {
          this.msg('至少两条以上可排序');
          return
        }
        this.indexBlock = 2;
      },
      //编辑
      editInfo(index) {
        this.indexBlock = 1;
      },
      touchDel(index) {
        if (this.indexBlock == 1) {
          this.deployList.forEach((item, i) => {
            item.Leftv = 0;
          })
          this.deployList[index].Leftv = -70
        } else {
          console.log('move');
        }
      },
      //取消排序
      cancelSort() {
        this.indexBlock = 3;
        this.deployList = [];
        this.getInfo();
        console.log(this.indexBlock, '自定义')
      },
      //取消编辑
      cancelSet() {
        this.indexBlock = 3;
        this.delBtnWidth = 90;
        this.deployList = [];
        this.getInfo();
        console.log(this.indexBlock, '自定义')
      },
      //添加分类
      addInfo() {
        if (this.deployList.length >= 20 && !this.isSubmit) {
          return;
        }
        console.log(this.deployList.length)
        this.indexBlock = 1;
        this.deployList.push({
          TypeId: 0,
          TypeName: "",
          TypeImage: "",
          Note: "",
          Leftv: 0,
          sort: this.deployList.length,
          PatentID: 0,
          TypeNote: '',
          TypeImage: '',
          ifSave: false
        });
      },
      // 保存编辑
      setInfo() {
        let dataList = [];
        let fil = [];
        this.deployList.forEach(item => {
          item.Leftv = 0;
        })
        const that = this;
        this.deployList.filter(e => e.TypeName == '')
        if (this.deployList.filter(e => {
            return e.TypeName.replace(/\s/g, '') == '';
          }).length) {
          this.msg('请完善信息')
          return
        } else {
          for (let i = 0; i < this.deployList.length; i++) {
            if (this.deployList[i].TypeName != "") {
              dataList.push({
                TypeID: this.deployList[i].TypeId,
                TypeName: this.deployList[i].TypeName,
                TypeImage: this.deployList[i].TypeImage,
                TypeNote: this.deployList[i].Note,
                PatentID: 0,
                sort: this.deployList.length
              });
            }
          }
        }
        let obj = "";
        for (let i = 0; i < this.oldList.length; i++) {
          obj = dataList.filter(
            item =>
            item.TypeID == that.oldList[i].TypeId &&
            item.TypeName != that.oldList[i].TypeName
          );
          if (obj.length > 0) {
            fil.push(obj[0]);
          }
        }
        let arr = dataList.filter(item => item.TypeID == 0);
        fil.push(...arr);
        //未做编辑
        if (fil.length == 0) {
          this.indexBlock = 3;
          console.log(this.indexBlock, '自定义')
          return;
        }
        console.log(fil, '已编辑的个数');
        //保存修改
        this.util
          .post({
            url: "/api/Merchant/ShopManage/UpdateGoodType",
            data: {
              ShopID: this.shopId,
              GoodsTypeList: fil
            }
          })
          .then(res => {
            if (res.State == 1) {
              // this.msg("修改成功");
              this.indexBlock = 3;
              this.getInfo();
              console.log(this.indexBlock, '自定义')
            }
          })
          .catch(err => {
            this.msg(err.Msg);
          });
      }
    },
    computed: {
      isSubmit() {
        for (let i = 0; i < this.deployList.length; i++) {
          if (this.deployList[i].TypeName == "") {
            return false;
          }
        }
        return true;
      }
    },
    components: {}
  };
</script>

<style lang="less">
  page {
    background: #eeeef4;
  }
  .icon_rise {
    margin-right: 24rpx;
  }
  .icon_hidden {
    // display: none;
    margin-right: 0;
  }
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .7);
    z-index: 20;
  }
  .layBox {
    position: absolute;
    top: 350rpx;
    left: 0;
    right: 0;
    padding: 87rpx 30rpx 30rpx;
    margin: 0 90rpx;
    background: #fff;
    border-radius: 16rpx;
    box-sizing: border-box;
    z-index: 30;
    h2.title {
        line-height: 37rpx;
        font-size: 34rpx;
        color: #656782;
        text-align: center;
        width: 502rpx;
    }
    p {
        font-size: 28rpx;
        color: #656782;
        line-height: 28rpx;
        padding-top: 33rpx;
        text-align: center;
        width: 502rpx;
    }
    .modalCont_btn {
        // width: 100%; 
        overflow: hidden;
        position: relative;
        width: 502rpx;
        .modalCont_btn_cont {
            width: 100%;
            display: flex;
            flex-direction: row; // justify-content: space-between;
            font-size: 26rpx;
            margin-top: 81rpx;
            .modalCont_btn_cont_cancel {
                // flex: 1;
                text-align: center;
                width: 245rpx;
                height: 72rpx;
                border: solid 1rpx #3c59ee;
                font-family: PingFangSC-Regular;
                font-size: 26rpx;
                font-weight: normal;
                font-stretch: normal;
                line-height: 72rpx;
                letter-spacing: 0px;
                color: #3c59ee;
            }
            .modalCont_btn_cont_conf {
                // flex: 1;
                text-align: center;
                color: #0863ee;
                width: 245rpx;
                height: 72rpx;
                background-color: #3c59ee;
                font-family: PingFangSC-Regular;
                font-size: 26rpx;
                font-weight: normal;
                font-stretch: normal;
                line-height: 72rpx;
                letter-spacing: 0px;
                color: #ffffff;
                border: 1rpx solid #3c59ee;
                margin-left: 24rpx;
            }
            .btn_dis {
                border: 1rpx solid #cccccc;
                background: #cccccc;
            }
        }
    }
  }
  .admin_store_deploy {
    height: 100%;
    background: #eeeef4;
    position: relative;
  }
  .store_deploy_top {
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    padding-bottom: 120rpx;
    box-sizing: border-box;
    .deploy_list {
      position: relative;
      background: #fff;
      padding: 0 36rpx;
      li {
        transition: margin-left 0.6s ease;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 110rpx;
        background: #fff;
        position: relative;
        .list_item_del {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 130rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          background: #eb4e3d;
          font-size: 24rpx;
        }
        &:after {
          content: "";
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
        &:last-child {
          &::after {
            display: none;
          }
        }
        .item {
          // flex:1;
          display: flex;
          align-items: center;
          width: 100%;
          .itemIcon {
            justify-content: flex-end;
            i {
              margin-left: 15rpx;
            }
          }
        }
        .label {
          font-size: 30rpx;
          color: #1a1a1a;
          width: 160rpx;
          line-height: 42rpx;
          // margin-left: 23rpx;
        }
        input {
          font-size: 30rpx;
          color: #1a1a1a;
          line-height: 36rpx;
          flex: 1;
          text-align: left;
        }
        input.input_dis {
          color: #999999;
        }
        .placeholderStyle {
          font-size: 30rpx;
          color: #ccc;
          line-height: 36rpx;
        }
        .icon_adminCheck {
          margin-right: 13rpx;
        }
      }
    }
    .deploy_tips {
      text-align: center;
      font-size: 22rpx;
      color: #999;
      margin-top: 20rpx;
      line-height: 40rpx;
    }
    .optionAdd {
      font-size: 28rpx;
      color: #1a1a1a;
      padding: 36rpx;
      margin-top: 20rpx;
      background: #fff;
      .icon {
        margin-right: 25rpx;
        vertical-align: middle;
        margin-top: -2rpx;
      }
    }
  }
  .handler {
    position: absolute;
    bottom: 0;
    left: 0;
    background: #fff;
    width: 100%;
    height: 110rpx;
    z-index: 10;
    border-top: 1rpx solid #ebebeb;
    display: flex;
    align-items: center;
    padding: 0 26rpx;
    box-sizing: border-box;
    .btn {
      background: #ccc;
      text-align: center;
      font-size: 28rpx;
      color: #fff;
      line-height: 72rpx;
      height: 72rpx;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      i{
        margin-right: 8rpx;
      }
      &.on {
        background: #0863ee;
      }
    }
    .btn1 {
      margin-right: 20rpx;
      background-color: #fff;
      color: #0863ee;
      border: 1px solid #0863ee;
      &.on {
        background: #fff;
      }
    }
    .btn2 {
      background-color: #fff;
      color: #0863ee;
      border: 1px solid #0863ee;
      &.on {
        background: #fff;
      }
    }
    .btnl {
      margin-right: 12rpx;
      background-color: #fff;
      color: #0863ee;
      border: 1px solid #0863ee;
      &.on {
        background: #fff;
      }
    }
    .btnr {
      margin-left: 12rpx;
    }
  }
</style>
