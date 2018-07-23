<template>
  <div class="submit_order" v-if="block">
    <div class="submit_con">
      <div class="con_order_address">
        <div class="receipt_address" @click="address">
          <p class="options_top">订单配送至</p>
          <div class="options_bot">
            <p v-if="addressInfo==false">请选择收货地址</p>
            <p v-if="addressInfo">{{addressInfo}}</p>
            <i class="icon icon_right options_img"></i>
          </div>
          <span class="linkUser" v-if="addressInfo">{{selectAddress.LinkMan}}{{selectAddress.LinkManMobile}}</span>
        </div>
        <div class="options fade_in">
          <p>{{ExpressType}}</p>
        </div>
      </div>
      <div class="con_order_info">
        <div class="options">
          <img class="fade_in" :src="shopInfo.Logo" alt="">
          <p>{{shopInfo.ShopName}}</p>
        </div>
        <ul class="con_order_list">
          <li v-for="(v,i) in cartListItem" :key="i" class="con_list_item">
            <img class="fade_in" :src="v.GoodsMasterPic" alt="">
            <div class="item">
              <p class="name">{{v.GoodName}}</p>
              <p class="spec">{{v.SpecName&&v.MultiSpec==1?v.SpecName:''}}</p>
              <p class="num">X{{v.num}}</p>
            </div>
            <div class="sum">
              <p class="price">
                <i class="icon_discount_text" v-if="v.GoodsType==-1"></i><span>¥</span>{{v.TotalMoney}}
              </p>
              <p class="original_price" v-if="v.GoodsType==-1">¥{{v.sumPrice}}</p>
            </div>
          </li>
        </ul>
        <div class="consume">
          <p class="consume_l">打包费</p>
          <p class="consume_r"><span v-if="goodsInfo.PackageMoney!==''">¥</span>{{goodsInfo.PackageMoney===''?'-':goodsInfo.PackageMoney}}</p>
        </div>
        <div class="consume">
          <p class="consume_l">配送费</p>
          <p class="consume_r"><i v-if="ExpressPriceOff">已减{{ExpressPriceOff}}元</i><span v-if="GoodPriceToken!=''">¥</span>{{GoodPriceToken==''?'-':ExpressPrice}}</p>
        </div>
        <div class="consume other" @click="chooseCoupon">
          <p class="consume_l">店铺优惠券</p>
          <!-- goodsInfo.CouponID:没有匹配的优惠券、不使用优惠券都返回 0 ；nonuseCoupon默认0，匹配到优惠券也为0，选择不使用优惠券：变为-1-->
          <p class="consume_r">
            <span class="circle" v-if='goodsInfo.CouponID==0&&nonuseCoupon==0'>暂无可用优惠券</span>
            <span class="circle" v-if='nonuseCoupon==-1'>不使用优惠券</span>
            <span v-if="goodsInfo.CouponAmount" class="on">- ¥ {{goodsInfo.CouponAmount}}</span>
          </p>
          <!-- <i class="icon icon_arrowRight" v-if='goodsInfo.CouponID!=0||nonuseCoupon!=0'></i> -->
          <i class="icon icon_arrowRight"></i>
        </div>
        <div class="consume_sum">
          <p class="consume_l">小计</p>
          <p class="consume_r" v-if="GoodPriceToken!=''"><i v-if="reliefSum">共节省{{reliefSum}}元</i><span>¥</span>{{GoodPriceToken==''?'':totalMoney}}</p>
          <p class="select_num" v-if="GoodPriceToken==''">选择地址后计算</p>
        </div>
      </div>
      <div class="con_order_other">
        <div class="consume">
          <p class="pay_l">支付方式</p>
          <p class="pay_r">微信支付</p>
        </div>
        <div class="consume_note">
          <p class="note">备注</p>
          <p class="note_text" @click="noteInfo">{{note}}</p>
          <i class="icon icon_arrowRight"></i>
        </div>
      </div>
    </div>
    <div class="submit_bottom">
      <p><span v-if="GoodPriceToken!=''">¥</span>{{GoodPriceToken==''?'':totalMoney}}</p>
      <form @submit="formSubmit" report-submit>
        <button formType="submit" class="pay" :class="{pay_ok:infoOver}" plain="true">提交订单</button>
      </form>
    </div>
    <!-- <div class="copy_info">
                                                                                                                                                                                                                                          <p class="form_id" @click="copyInfo(formId)">{{formId}}</p>
                                                                                                                                                                                                                                          <p class="pay_id" @click="copyInfo(packageId)">{{packageId}}</p>
                                                                                                                                                                                                                                        </div> -->
    <div class="mask" v-if="isActive" @click="isActive = false"></div>
    <div class="distribution_card" :class="{distribution_card_active:isActive}">
      <div class="distribution_card_item">
        <div class="distribution_title">
          <p>配送方式+配送时长</p>
          <i class="icon icon_close title_img" @click="isActive = false"></i>
        </div>
        <div class="dis_item">
          <div class="dis_left">
            <p>立即配送</p>
            <span>30分钟内送达</span>
          </div>
          <i class="icon icon_checked"></i>
        </div>
        <div class="dis_item">
          <div class="dis_left">
            <p>预约配送</p>
            <span>预约功能敬请期待</span>
          </div>
          <i class="icon icon_check"></i>
        </div>
      </div>
      <div class="ok" @click="isActive = false">确定</div>
    </div>
    <div class="shop_update_mask" v-if="orderMask">
      <div class="update_con">
        <i class="icon_commodity"></i>
        <p>{{orderMsg}}</p>
        <div class="btn" @click="backStore">返回购物车</div>
      </div>
    </div>
  </div>
</template>

<script>
  import gcoord from 'gcoord';
  import QQMapWX from '../../utils/qqmap-wx-jssdk.js';
  const QQMap = new QQMapWX({
    key: 'BZMBZ-OKXRU-DINVZ-2SRN5-4KWJ7-S6B6O'
  })
  export default {
    data() {
      return {
        /* 配送方式,配送时长弹窗 */
        isActive: false,
        /* 备注信息 */
        noteText: '',
        /* 选择地址 */
        selectAddress: {},
        /* 店铺距离  */
        shopInfo: {
          ShopId: ''
        },
        /* 订单距离 */
        orderDiscance: 0,
        goodsInfo: {},
        ExpressPrice: '',
        /* 商品价格token，计算运费接口返回 */
        GoodPriceToken: '',
        /* 运费token，计算运费接口返回 */
        ExpressPriceToken: '',
        ExpressType: '配送方式+配送时长',
        totalMoney: 0,
        packageId: '', //payid
        formId: '',
        cartListItem: [], //购物车列表
        orderMsg: '',
        orderMask: false,
        block: false,
        /* 0：无可用优惠券；-1：不使用优惠券 */
        nonuseCoupon: 0,
        //配送费优惠
        ExpressPriceOff: 0,
        //共节省金额
        reliefSum: 0,
        //提交订单状态
        infoOver: false,
        IsOrderHasAcivity: '',
        IsAcivityAllowCoupon: '',
        payOnoff: true, //支付开关
        tips: ''
      }
    },
    onLoad() {
      this.block = false;
      wx.showLoading({
        title: '加载中',
        mask: true
      })
    },
    onShow() {
      this.selectAddress = {};
      this.ExpressType = '配送方式+配送时长';
      this.noteText = '';
      this.payOnoff = true;
      this.infoOver = false;
      this.totalMoney = '';
      this.GoodPriceToken = '';
      //地区配送不支持的提示
      this.tips = '';
      this.IsOrderHasAcivity = this.IsAcivityAllowCoupon = '';
      /* 选择优惠券返回 */
      if (wx.getStorageSync('couponInfo').couponId) {
        this.goodsInfo.CouponID = wx.getStorageSync('couponInfo').couponId;
        this.nonuseCoupon = wx.getStorageSync('couponInfo').couponId;
        wx.removeStorageSync('couponInfo')
      } else {
        this.goodsInfo.CouponID = 0;
        this.nonuseCoupon = 0;
      }
      this.orderMask = false;
      if (this.$mp.query.orderId) {
        this.cartListItem = wx.getStorageSync('againOrder') || [];
        console.log('再来')
        this.block = true;
        wx.hideLoading();
        this.againOrderInfo();
      } else {
        this.block = true;
        wx.hideLoading();
        console.log('正常')
        // 先获取缓存数据
        let cartListSum = wx.getStorageSync('cartListSum') || [];
        // console.log(cartListSum, '000')
        //再找到对应店铺
        let cartItem = cartListSum.filter(e => e.ShopId == wx.getStorageSync('shopInfo').ShopId);
        this.cartListItem = cartItem.length ? cartItem[0].cartList : [];
        this.cartListItem.forEach(e => {
          e.GoodsMasterPic = e.GoodsMasterPic.indexOf('x-oss-process=image') > -1 ? e.GoodsMasterPic : e.GoodsMasterPic + '?x-oss-process=image/resize,w_100/format,jpg';
        })
        console.log(this.cartListItem, '订单提交页')
        this.shopInfo = wx.getStorageSync('shopInfo') || [];
        this.shopInfo.Logo = this.shopInfo.Logo + '?x-oss-process=image/resize,w_100/format,jpg';
        this.priceNum()
      }
      this.noteText = wx.getStorageSync('note') || '';
      this.selectAddress = wx.getStorageSync('selectAddress') || {};
    },
    methods: {
      copyInfo(id) {
        wx.setClipboardData({
          data: id,
          success: res => {
            this.msg("复制成功")
          },
          fail: err => {
            this.msg("复制失败")
          }
        })
      },
      formSubmit(e) {
        this.formId = e.target.formId;
        this.createOrder()
      },
      address() {
        if (this.$root.$mp.query.orderId) {
          wx.setStorageSync('againOrder', this.cartListItem)
        }
        let totalMoney = (Math.round(this.goodsInfo.GoodMoney * 10000) + Math.round(this.goodsInfo.PackageMoney * 10000) + Math.round(this.ExpressPrice * 10000)) / 10000;
        wx.setStorageSync('couponInfo', {
          couponId: this.goodsInfo.CouponID,
          totalMoney: totalMoney
        });
        let addressId = this.selectAddress.Id ? this.selectAddress.Id : '';
        wx.navigateTo({
          url: '/pages/my-address/main?type=1&addressId=' + addressId
        })
      },
      time() {
        this.isActive = true;
      },
      trans(location) {
        var result = gcoord.transform(
          location, // 经纬度坐标
          gcoord.BD09, // 当前坐标系
          gcoord.WGS84, // 目标坐标系    
        );
        return result;
      },
      //价格计算
      priceNum() {
        let cartData = [];
        this.cartListItem.forEach(item => {
          cartData.push({
            GoodId: item.GoodId,
            GoodsNum: item.num,
            SpecId: item.Id,
            OriginalPrice: item.OriginalPrice,
            SalesPrice: item.SalesPrice,
          })
        })
        this.util.post({
            url: '/api/Customer/Order/ComputeGoodsPrice',
            data: {
              CouponId: this.goodsInfo.CouponID,
              ShopId: this.shopInfo.ShopId,
              CartOrderGoods: cartData
            }
          })
          .then(res => {
            if (res.State == 1) {
              // console.log(this.goodsInfo)
              this.goodsInfo = res.Body;
              // console.log(this.goodsInfo.GoodsPrice, this.cartListItem)
              this.cartListItem.forEach((e, i) => { //价格计算赋值
                e.TotalMoney = this.goodsInfo.GoodsPrice[i].TotalMoney;
                e.sumPrice = Math.round(e.OriginalPrice * 10000) * e.num / 10000;
              })
              this.IsOrderHasAcivity = this.goodsInfo.IsOrderHasAcivity;
              this.IsAcivityAllowCoupon = this.goodsInfo.IsAcivityAllowCoupon;
              if (this.shopInfo.ShopLoc && this.shopInfo.ShopLoc.split(',')[0] && this.selectAddress.AddressLoc) {
                this.Freight(res.Body.PriceToken)
              }
            } else if (res.State == -13) {
              this.orderMsg = res.Msg;
              this.orderMask = true;
              let cartListSum = wx.getStorageSync('cartListSum') || [];
              //查询所在店铺
              let cartItem = cartListSum.filter(e => e.ShopId == res.Body.ShopID);
              if (cartItem.length) {
                cartItem[0].cartList = cartItem[0].cartList ? cartItem[0].cartList : [];
              }
              let item = [];
              // console.log(res.Body.GoodsPrice.length, cartItem[0].cartList)
              if (res.Body.GoodsPrice.length) { //提交订单中存在可以支付的商品
                cartItem[0].cartList.forEach(e => {
                  res.Body.GoodsPrice.forEach(ele => {
                    if (e.Id == ele.SpecId) {
                      item.push(e)
                    }
                  })
                })
                cartItem[0].cartList = item;
              } else { //商品订单全部失效，清除店铺信息
                cartListSum = cartListSum.filter(e => e.ShopId != res.Body.ShopID);
              }
              // console.log(cartItem, cartListSum)
              //针对商品列表为空的店铺做清空处理
              cartListSum = cartListSum.filter(e => e.cartList.length > 0);
              // 再设置缓存数据
              wx.setStorageSync('cartListSum', cartListSum);
              //缓存length不存在，直接清除
              !cartListSum.length && wx.removeStorageSync('cartListSum');
            }
          }).catch(err => {
            this.msg(err.Msg)
          })
      },
      //运费计算
      Freight(priceToken) {
        this.util.post({
            url: '/api/Customer/Order/ComputeExpressPrice',
            data: {
              PriceToken: priceToken,
              ShopId: String(this.shopInfo.ShopId),
              OrderCityName: this.selectAddress.CityName,
              OrderCountyName: this.selectAddress.CountyName,
              EndAddressTitle: this.selectAddress.AddressTitle,
              EndAddressNote: this.selectAddress.AddressNote,
              EndAddressUserNote: this.selectAddress.UserNote,
              EndLocation: this.selectAddress.AddressLoc,
              ReceiveName: this.selectAddress.LinkMan,
              ReceiveMobile: this.selectAddress.LinkManMobile
            }
          })
          .then(res => {
            if (res.State == 1) {
              this.ExpressPrice = res.Body.ExpressPrice;
              this.GoodPriceToken = res.Body.PriceToken;
              this.ExpressPriceToken = res.Body.ExpressPriceToken;
              this.ExpressType = res.Body.ExpressType == 2 ? '快递配送' : res.Body.ExpressType == 4 ? '商家自送' : '跑腿配送';
              this.totalMoney = (Math.round(this.goodsInfo.GoodMoney * 10000) + Math.round(this.goodsInfo.PackageMoney * 10000) + Math.round(this.ExpressPrice * 10000) - Math.round(this.goodsInfo.CouponAmount * 10000)) / 10000;
              this.ExpressPriceOff = res.Body.ExpressPriceOff;
              this.reliefSum = (Math.round(this.goodsInfo.GoodPriceOffMoney * 10000) + Math.round(this.goodsInfo.CouponAmount * 10000) + Math.round(res.Body.ExpressPriceOff * 10000)) / 10000;
              // console.log(this.reliefSum);
              this.infoOver = true;
            }
          }).catch(err => {
            this.msg(err.Msg)
            this.tips = err.Msg;
          })
      },
      //创建订单
      createOrder() {
        if (!this.addressInfo) {
          this.msg('请选择收货地址');
          return;
        }
        if (this.infoOver == false) {
          this.msg(this.tips ? this.tips : '网络拥挤，请稍后重试')
          return;
        }
        if (this.payOnoff) {
          this.payOnoff = false;
          this.util.post({
              url: '/api/Customer/Order/CreateOrder',
              data: {
                ReceiveAddressId: this.selectAddress.Id,
                GoodPriceToken: this.GoodPriceToken,
                ExpressPriceToken: this.ExpressPriceToken,
                Remarks: this.noteText
              }
            })
            .then(res => {
              if (res.State == 1) {
                if (res.Body.wxPayInfo == null) {
                  this.payOnoff = true;
                  this.OrderRePay(res.Body.OrderId)
                } else {
                  this.packageId = res.Body.wxPayInfo.package;
                  wx.requestPayment({
                    timeStamp: res.Body.wxPayInfo.timeStamp,
                    nonceStr: res.Body.wxPayInfo.nonceStr,
                    package: res.Body.wxPayInfo.package,
                    signType: res.Body.wxPayInfo.signType,
                    paySign: res.Body.wxPayInfo.paySign,
                    success: payres => {
                      let cartListSum = wx.getStorageSync('cartListSum') || [];
                      cartListSum = cartListSum.filter(e => e.ShopId != wx.getStorageSync('shopInfo').ShopId);
                      console.log(cartListSum)
                      // 再设置缓存数据
                      wx.setStorageSync('cartListSum', cartListSum);
                      //缓存length不存在，直接清除
                      !cartListSum.length && wx.removeStorageSync('cartListSum');
                      wx.removeStorageSync('note');
                      wx.removeStorageSync('selectAddress');
                      wx.removeStorageSync('couponInfo');
                      this.payOnoff = true;
                      setTimeout(_ => {
                        /* 支付成功跳转订单列表 */
                        wx.redirectTo({
                          url: `/pages/order-details/main?orderId=${res.Body.OrderId}&type=1`
                        });
                      }, 800)
                    },
                    fail: err => {
                      console.log(err)
                      this.msg('您已取消支付')
                      let cartListSum = wx.getStorageSync('cartListSum') || [];
                      cartListSum = cartListSum.filter(e => e.ShopId != wx.getStorageSync('shopInfo').ShopId);
                      console.log(cartListSum)
                      // 再设置缓存数据
                      wx.setStorageSync('cartListSum', cartListSum);
                      //缓存length不存在，直接清除
                      !cartListSum.length && wx.removeStorageSync('cartListSum');
                      wx.removeStorageSync('note');
                      wx.removeStorageSync('selectAddress');
                      this.payOnoff = true;
                      setTimeout(_ => {
                        /* 取消支付跳转订单列表 */
                        wx.redirectTo({
                          url: `/pages/order-details/main?orderId=${res.Body.OrderId}&type=1`
                        });
                      }, 800)
                    }
                  })
                }
              } else if (res.State == -13) {
                this.orderMsg = res.Msg;
                this.orderMask = true;
                let cartListSum = wx.getStorageSync('cartListSum') || [];
                cartListSum = cartListSum.filter(e => e.ShopId != wx.getStorageSync('shopInfo').ShopId);
                console.log(cartListSum)
                // 再设置缓存数据
                wx.setStorageSync('cartListSum', cartListSum);
                //缓存length不存在，直接清除
                !cartListSum.length && wx.removeStorageSync('cartListSum');
                wx.removeStorageSync('note');
                wx.removeStorageSync('selectAddress');
                wx.removeStorageSync('couponInfo');
              }
            }).catch(err => {
              this.payOnoff = true;
              this.msg(err.Msg)
            })
        }
      },
      /* 再次生成订单信息 */
      OrderRePay(orderId) {
        if (this.payOnoff) {
          this.payOnoff = false;
          this.util.post({
              url: '/api/Customer/Order/OrderRePay',
              data: {
                OrderId: orderId,
              }
            })
            .then(res => {
              if (res.State == 1) {
                wx.requestPayment({
                  timeStamp: res.Body.timeStamp,
                  nonceStr: res.Body.nonceStr,
                  package: res.Body.package,
                  signType: res.Body.signType,
                  paySign: res.Body.paySign,
                  success: payres => {
                    let cartListSum = wx.getStorageSync('cartListSum') || [];
                    cartListSum = cartListSum.filter(e => e.ShopId != wx.getStorageSync('shopInfo').ShopId);
                    console.log(cartListSum)
                    // 再设置缓存数据
                    wx.setStorageSync('cartListSum', cartListSum);
                    //缓存length不存在，直接清除
                    !cartListSum.length && wx.removeStorageSync('cartListSum');
                    wx.removeStorageSync('note');
                    wx.removeStorageSync('selectAddress');
                    this.payOnoff = true;
                    setTimeout(_ => {
                      /* 支付成功跳转订单列表 */
                      wx.redirectTo({
                        url: `/pages/order-details/main?orderId=${orderId}&type=1`
                      });
                    }, 800)
                  },
                  fail: err => {
                    console.log(err)
                    this.msg('您已取消支付')
                    let cartListSum = wx.getStorageSync('cartListSum') || [];
                    cartListSum = cartListSum.filter(e => e.ShopId != wx.getStorageSync('shopInfo').ShopId);
                    console.log(cartListSum)
                    // 再设置缓存数据
                    wx.setStorageSync('cartListSum', cartListSum);
                    //缓存length不存在，直接清除
                    !cartListSum.length && wx.removeStorageSync('cartListSum');
                    wx.removeStorageSync('note');
                    wx.removeStorageSync('selectAddress');
                    this.payOnoff = true;
                    setTimeout(_ => {
                      /* 取消支付跳转订单列表 */
                      wx.redirectTo({
                        url: `/pages/order-details/main?orderId=${orderId}&type=1`
                      });
                    }, 800)
                  }
                })
              } else if (res.State == -13) {
                this.orderMsg = res.Msg;
                this.orderMask = true;
                let cartListSum = wx.getStorageSync('cartListSum') || [];
                cartListSum = cartListSum.filter(e => e.ShopId != wx.getStorageSync('shopInfo').ShopId);
                console.log(cartListSum)
                // 再设置缓存数据
                wx.setStorageSync('cartListSum', cartListSum);
                //缓存length不存在，直接清除
                !cartListSum.length && wx.removeStorageSync('cartListSum');
                wx.removeStorageSync('note');
                wx.removeStorageSync('selectAddress');
                wx.removeStorageSync('couponInfo');
              }
            }).catch(err => {
              this.payOnoff = true;
              this.msg(err.Msg)
            })
        }
      },
      noteInfo() {
        if (this.$root.$mp.query.orderId) {
          wx.setStorageSync('againOrder', this.cartListItem)
        }
        wx.setStorageSync('selectAddress', this.selectAddress);
        let totalMoney = (Math.round(this.goodsInfo.GoodMoney * 10000) + Math.round(this.goodsInfo.PackageMoney * 10000) + Math.round(this.ExpressPrice * 10000)) / 10000;
        wx.setStorageSync('couponInfo', {
          couponId: this.goodsInfo.CouponID,
          totalMoney: totalMoney
        });
        wx.navigateTo({
          url: '/pages/add-note/main'
        })
      },
      againOrderInfo() {
        this.util.post({
          url: '/api/Customer/Order/OrderDetail',
          data: {
            OrderID: this.$mp.query.orderId
          }
        }).then(res => {
          if (res.State == 1) {
            this.cartListItem = [];
            this.shopInfo = {
              ShopId: ''
            };
            this.shopInfo.ShopName = res.Body.ShopName;
            this.shopInfo.Logo = res.Body.ShopLogo + '?x-oss-process=image/resize,w_100/format,jpg';
            this.shopInfo.ShopLoc = res.Body.ShopLoc;
            this.shopInfo.ShopId = res.Body.ShopID;
            this.noteText = res.Body.Remark;
            let goodsDetail = [];
            res.Body.OrderGoods.forEach((item) => {
              goodsDetail.push({
                GoodId: item.GoodId,
                GoodName: item.GoodName,
                GoodsMasterPic: item.GoodMasterPic + '?x-oss-process=image/resize,w_100/format,jpg',
                OriginalPrice: item.OriginalPrice,
                num: item.GoodNum,
                SpecName: item.SpecName,
                Id: item.SpecId, //规格id
                SalesPrice: item.SinglePrice,
                GoodsType: item.GoodType,
                sumPrice: Math.round(item.OriginalPrice * 10000) * item.GoodNum / 10000
              })
            })
            console.log(goodsDetail, '再来一单')
            this.cartListItem = goodsDetail;
            if (wx.getStorageSync('selectAddress')) {
              this.selectAddress = wx.getStorageSync('selectAddress');
              this.QQcityInfo({
                latitude: this.shopInfo.ShopLoc.split(',').map(Number)[1],
                longitude: this.shopInfo.ShopLoc.split(',').map(Number)[0]
              })
            } else {
              this.getAddressInfo(res)
            }
          } else {
            console.log(res.Msg)
          }
        }).catch(err => {
          this.msg(err.Msg)
        })
      },
      //获取所有地址
      getAddressInfo(info) {
        this.util.post({
          url: '/api/Customer/PersonerCenter/Addresses',
          data: {}
        }).then(res => {
          // console.log(res)
          let n = res.Body.findIndex(e => e.Id == info.Body.ReceiveAddressId);
          //地址信息在个人地址列表里
          if (n > -1) {
            let address = info.Body.ReceiveAddress.split('($)');
            this.selectAddress = {
              AddressLoc: info.Body.ReceiverLoc,
              AddressNote: address[1],
              AddressTitle: address[0],
              CityName: '',
              CountyName: '',
              Id: info.Body.ReceiveAddressId,
              /* 收货地址id */
              LinkMan: info.Body.ReceiveMan,
              LinkManMobile: info.Body.ReceiveMobile,
              UserNote: address[2],
            }
            this.QQcityInfo({
              latitude: this.shopInfo.ShopLoc.split(',').map(Number)[1],
              longitude: this.shopInfo.ShopLoc.split(',').map(Number)[0]
            })
          } else {
            this.msg('请选择您的收货地址')
          }
        }).catch(err => {
          console.log(err)
          this.msg(err.Msg)
        })
      },
      //坐标转地址
      QQcityInfo(info) {
        // 调用接口
        QQMap.reverseGeocoder({
          location: {
            latitude: info.latitude,
            longitude: info.longitude
          },
          success: res => {
            this.selectAddress.CityName = res.result.address_component.city;
            this.selectAddress.CountyName = res.result.address_component.district;
            if (this.shopInfo.ShopLoc && this.shopInfo.ShopLoc.split(',')[0] && this.selectAddress.AddressLoc) {
              this.priceNum()
            }
          },
          fail: err => {
            this.msg('位置信息获取失败')
          }
        })
      },
      backStore() {
        this.orderMask = false;
        if (this.$mp.query.orderId) {
          wx.redirectTo({
            url: `/pages/my-store/main?ShopId=${this.shopInfo.ShopId}&type=1`
          })
        } else {
          this.$store.dispatch('backIndex', true)
          wx.navigateBack({
            delta: 1,
          })
        }
      },
      /* 选择优惠券 */
      chooseCoupon() {
        if (this.$root.$mp.query.orderId) {
          wx.setStorageSync('againOrder', this.cartListItem)
        }
        /* 未计算价格 或 没有匹配到优惠券*/
        let check = this.goodsInfo.CouponID == 0 && this.nonuseCoupon == 0 ? 2 : 1;
        // console.log(this.IsOrderHasAcivity,this.IsAcivityAllowCoupon)
        wx.navigateTo({
          url: `/pages/my-coupon/main?type=3&checked=${check}&isActive=${this.IsOrderHasAcivity}&isCoupon=${this.IsAcivityAllowCoupon}`
        })
        let totalMoney = (Math.round(this.goodsInfo.GoodMoney * 10000) + Math.round(this.goodsInfo.PackageMoney * 10000)) / 10000;
        wx.setStorageSync('couponInfo', {
          couponId: this.goodsInfo.CouponID,
          totalMoney: totalMoney
        })
      }
    },
    components: {},
    computed: {
      calculate: function() {
        let n = 0;
        this.cartListItem.forEach(e => {
          if (e.num > 0) {
            n += e.OriginalPrice * 10000 * e.num;
          }
        })
        // console.log(n)
        return n / 10000;
      },
      note: function() {
        return this.noteText != "" ? this.noteText : '请点此输入备注信息';
      },
      addressInfo: function() {
        return this.selectAddress.AddressTitle ? `${this.selectAddress.AddressTitle} ${this.selectAddress.AddressNote}`.split('($)').join(' ') : false
      },
    },
    onUnload() {
      //删除备注信息
      wx.getStorageSync('note') && wx.removeStorageSync('note');
    }
  }
</script>

<style lang="less">
  .submit_order {
    height: 100%;
    background: #f3f3f3;
    overflow: hidden;
    position: relative;
    .submit_con {
      height: 100%;
      padding-bottom: 100rpx;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: scroll;
      .con_order_address {
        background: #fff;
        margin-bottom: 20rpx;
        .receipt_address {
          padding: 20rpx 0;
          margin: 0 35rpx;
          position: relative;
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
          }
          .options_top {
            font-size: 32rpx;
            color: #999;
          }
          .linkUser {
            font-size: 28rpx;
            color: #999999;
          }
          .options_bot {
            display: flex;
            justify-content: space-between;
            align-items: center;
            p {
              font-size: 45rpx;
              white-space: nowrap;
              color: #1d1d1d;
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            span {
              flex: 1;
              width: 100%;
              font-size: 26rpx;
              color: #333;
              display: -webkit-box !important;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              word-break: break-all;
            }
            .options_img {
              width: 24rpx;
              height: 24rpx;
              margin-left: 20rpx;
            }
          }
        }
        .options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 30rpx 0;
          margin: 0 35rpx;
          p {
            font-size: 28rpx;
            white-space: nowrap;
            color: #1a1a1a;
          }
          img {
            width: 24rpx;
            height: 24rpx;
          }
        }
      }
      .con_order_info {
        background: #fff;
        margin-bottom: 20rpx;
        .options {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 28rpx 0;
          margin: 0 35rpx;
          position: relative;
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
          }
          img {
            width: 40rpx;
            height: 40rpx;
            margin-right: 20rpx;
            border-radius: 10rpx;
          }
          p {
            font-size: 26rpx;
            white-space: nowrap;
            color: #383838;
          }
        }
        .con_order_list {
          .con_list_item {
            padding: 30rpx 35rpx;
            display: flex; // align-items: center;
            justify-content: flex-start;
            img {
              width: 96rpx;
              height: 96rpx;
              border-radius: 10rpx;
            }
            .item {
              flex: 1;
              padding-left: 18rpx;
              .name {
                font-size: 28rpx;
                color: #1d1d1d;
                line-height: 32rpx;
                width: 426rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .spec {
                font-size: 22rpx;
                color: #b2b2b2;
                line-height: 46rpx;
                height: 46rpx;
                width: 426rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .num {
                font-size: 22rpx;
                color: #b2b2b2;
                line-height: 22rpx;
              }
            }
            .sum {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              .price {
                font-size: 28rpx;
                color: #1a1a1a;
                span {
                  font-size: 24rpx;
                }
              }
              .original_price {
                font-size: 24rpx;
                color: #b2b2b2;
                margin-left: 12rpx;
                position: relative;
                &:after {
                  content: '';
                  display: block;
                  width: 100%;
                  height: 0;
                  border-bottom: 1px solid #b2b2b2;
                  position: absolute;
                  bottom: 50%;
                  left: 0;
                  transform: scale(1, 0.5);
                  transform-origin: 0 0;
                }
              }
            }
          }
        }
        .consume {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 26rpx 0;
          margin: 0 35rpx;
          position: relative;
          &:after {
            content: '';
            display: block;
            width: 100%;
            height: 0;
            border-top: 1px solid #ebebeb;
            position: absolute;
            left: 0;
            top: 0;
            transform: scaleY(0.5);
            transform-origin: 0 0;
          }
          .consume_l {
            font-size: 28rpx;
            white-space: nowrap;
            color: #1d1d1d;
          }
          .consume_r {
            font-size: 28rpx;
            white-space: nowrap;
            color: #999;
            span {
              display: inline-block;
              font-size: 24rpx;
            }
            i {
              display: inline-block;
              font-size: 24rpx;
              color: #ff4d3a;
              margin-right: 16rpx;
            }
          }
          &.other {
            .consume_r {
              flex: 1;
              text-align: right;
              span {
                display: inline-block;
                font-size: 28rpx;
                color: #b2b2b2;
                background: transparent;
                margin-right: 15rpx;
                &.on {
                  font-size: 26rpx;
                  color: #ff4d3a;
                  background: transparent;
                  margin-right: 0;
                }
              }
              .circle {
                margin-right: 0;
                font-size: 24rpx;
                color: #b2b2b2;
                padding: 0 6rpx;
              }
            }
          }
        }
        .consume_sum {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 26rpx 0;
          margin: 0 35rpx;
          position: relative;
          &:after {
            content: '';
            display: block;
            width: 100%;
            height: 0;
            border-top: 1px solid #ebebeb;
            position: absolute;
            left: 0;
            top: 0;
            transform: scaleY(0.5);
            transform-origin: 0 0;
          }
          .consume_l {
            font-size: 28rpx;
            white-space: nowrap;
            color: #1d1d1d;
          }
          .consume_r {
            font-size: 34rpx;
            white-space: nowrap;
            color: #1d1d1d;
            span {
              display: inline-block;
              font-size: 26rpx;
            }
            i {
              font-size: 24rpx;
              color: #b2b2b2;
              display: inline-block;
              margin-right: 16rpx;
            }
          }
          .select_num {
            font-size: 28rpx;
            white-space: nowrap;
            color: #999;
          }
        }
      }
      .con_order_other {
        background: #fff;
        margin-bottom: 20rpx;
        .consume {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 26rpx 0;
          margin: 0 35rpx;
          position: relative;
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
          }
          .pay_l {
            font-size: 28rpx;
            white-space: nowrap;
            color: #1d1d1d;
          }
          .pay_r {
            font-size: 28rpx;
            white-space: nowrap;
            color: #1a1a1a;
          }
        }
        .consume_note {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 26rpx 0;
          margin: 0 35rpx;
          .note {
            width: 140rpx;
            text-align: left;
            font-size: 28rpx;
            color: #1d1d1d;
            white-space: nowrap;
          }
          .note_text {
            font-size: 28rpx;
            color: #999;
            flex: 1;
            text-align: right;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .submit_bottom {
      height: 100rpx;
      background-color: #fff;
      display: flex;
      align-items: center;
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      z-index: 5;
      padding: 0 35rpx;
      box-sizing: border-box;
      &:after {
        content: '';
        display: block;
        width: 100%;
        height: 0;
        border-top: 1px solid #ebebeb;
        position: absolute;
        left: 0;
        top: 0;
        transform: scaleY(0.5);
        transform-origin: 0 0;
      }
      p {
        font-size: 34rpx;
        color: #1a1a1a;
        height: 100%;
        flex: 1;
        line-height: 100rpx;
        span {
          font-size: 26rpx;
        }
      }
      .pay {
        width: 184rpx;
        height: 64rpx;
        background-color: #999;
        border-radius: 8rpx;
        font-size: 24rpx;
        color: #fff;
        line-height: 64rpx;
        text-align: center;
        border: 0;
      }
      .pay_ok {
        background-color: #000;
      }
    }
    .mask,
    .shop_update_mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      z-index: 10;
      transition: all 0.1s ease;
    }
    .shop_update_mask {
      display: flex;
      .update_con {
        width: 500rpx;
        margin: auto;
        background: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 66rpx 36rpx 36rpx;
        border-radius: 8rpx;
        p {
          margin-top: 42rpx;
          width: 58%;
          color: #b2b2b2;
          text-align: center;
          font-size: 28rpx;
          line-height: 48rpx;
        }
        .btn {
          margin-top: 36rpx;
          height: 74rpx;
          border: 30rpx;
          background: #1a1a1a;
          color: #fff;
          border-radius: 8rpx;
          text-align: center;
          line-height: 74rpx;
          font-size: 26rpx;
          width: 100%;
        }
      }
    }
    .distribution_card {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background: #fff;
      transform: translateY(100%);
      transition: transform 0.4s ease;
      z-index: 20;
      padding: 0 35rpx 20rpx;
      box-sizing: border-box;
      .distribution_card_item {
        .distribution_title {
          position: relative;
          padding: 30rpx 0;
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
          }
          p {
            text-align: center;
            color: #1d1d1d;
            font-size: 28rpx;
          }
          .title_img {
            width: 30rpx;
            height: 30rpx;
            position: absolute;
            right: 2rpx;
            top: 50%;
            transform: translateY(-50%);
            padding: 20rpx;
          }
        }
        .dis_item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24rpx 0;
          position: relative;
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
          }
          .dis_left {
            p {
              color: #1d1d1d;
              font-size: 28rpx;
            }
            span {
              display: block;
              font-size: 24rpx;
              color: #666;
            }
          }
          img {
            width: 42rpx;
            height: 42rpx;
          }
        }
        .dis_item:nth-last-of-type(1) {
          border-bottom: none;
        }
      }
      .ok {
        width: 100%;
        height: 88rpx;
        line-height: 88rpx;
        text-align: center;
        background-color: #333333;
        border-radius: 8rpx;
        color: #fff;
        font-size: 30rpx;
      }
    }
    .distribution_card_active {
      transform: translateY(0);
    }
  }
  .copy_info {
    position: absolute;
    bottom: 120rpx;
    left: 0;
    width: 100%;
    text-align: center;
    p {
      font-size: 22rpx;
      color: #666;
      margin-bottom: 20rpx;
    }
  }
</style>
