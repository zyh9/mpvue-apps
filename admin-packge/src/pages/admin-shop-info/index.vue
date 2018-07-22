<template>
    <div class="admin-shop-info">
        <div class=" main">
            <div class="option  bannerImg" @click="upLoadLogo">
                <div class="label">店铺头像</div>
                <div class="item"><img :src="shopInfo.ShopLogo?shopInfo.ShopLogo:'https://otherfiles-ali.uupt.com/Stunner/FE/M/1978b6eeed3e4ba6bb9eafa2568fcf8b_big.png'" alt=""><i class="icon icon_arrowRight"></i></div>
            </div>
            <div class="option">
                <div class="label">店铺名称</div>
                <div class="item">
                    <input type="text" v-model="shopInfo.ShopName" placeholder-class='placeholerStyle' maxlength="15" placeholder="请输入店铺名称15字以下">
                </div>
            </div>
        </div>
        <div class="main  mainOther">
            <div class="option">
                <div class="label">店铺类型</div>
                <div class="item">
                    <div @click='shopType(v)' v-for='(v,i) in BusinessType' :key='i'><i class="icon icon_check1" :class="{icon_checked1:v.ID==shopInfo.BusinessType}"></i>{{v.BusinessType}}</div>
                </div>
            </div>
            <div class="option  otherBor" @click="goAddress">
                <div class="label">店铺地址</div>
                <div class="item">
                    <input type="text" v-model="shopInfo.AddressTitle" disabled placeholder-class='placeholerStyle' placeholder="点击选择">
                    <i class="icon icon_arrowRight"></i>
                </div>
            </div>
            <div class="option">
                <div class="label"></div>
                <div class="item">
                    <input type="text" v-model="shopInfo.AddressUserNote" placeholder-class='placeholerStyle' placeholder="请补充详细地址，如：18号楼1号商铺">
                </div>
            </div>
            <div class="option" v-if='shopInfo.BusinessType==1'>
                <div class="label">备餐时间</div>
                <div class="item">
                    <input type="number" v-model="shopInfo.PrepareMinute" placeholder-class='placeholerStyle' placeholder="请输入平均备餐时间">
                    <span>分钟</span>
                </div>
            </div>
        </div>
        <div class="main">
            <div class="option">
                <div class="label">联系电话</div>
                <div class="item">
                    <input type="number" v-model="shopInfo.LinkMobile" maxlength="11" placeholder-class='placeholerStyle' placeholder="请填写联系手机号">
                </div>
            </div>
            <div class="option">
                <div class="label">联系微信</div>
                <div class="item">
                    <input type="text" v-model="shopInfo.LinkWechat" placeholder-class='placeholerStyle' placeholder="填写您的微信 方便客户与您联系">
                </div>
            </div>
        </div>
        <div class="main ">
            <div class="option" @click="goAddTime">
                <div class="label">营业时间</div>
                <div class="item">
                    <input type="text" :value="time" disabled placeholder="点击添加店铺营业时间（选填）" placeholder-class='placeholerStyle'>
                    <i class="icon  icon_arrowRight"></i>
                </div>
            </div>
            <div class="option other">
                <div class="label">店铺简介</div>
                <div class="item">
                    <input type="text" v-model="shopInfo.ShopSummary" placeholder-class='placeholerStyle' maxlength="24" placeholder="请输入店铺简介24字以下（选填）">
                </div>
            </div>
        </div>
        <cover-view class="handler">
            <cover-view class="btn" :class="{on:isSubmit}" @click='submitInfo'>保存</cover-view>
        </cover-view>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                time: '点击添加店铺营业时间（选填）',
                address: {},
                BusinessType: [],
                shopId: '',
                shopTypeId: '',
                shopInfo: {
                    ShopName: '',
                    // 店铺名字
                    ShopLogo: '',
                    // 店铺Logo
                    OpenTime: '',
                    // 营业时间 例如 0-240,1140-1440
                    // 代表 00:00至4:00 和 19:00-24:00
                    OpenState: '',
                    // 营业状态 1营业 0闭店
                    BusinessType: '',
                    // 店铺类型
                    ShopCity: '',
                    AddressTitle: '',
                    AddressNote: '',
                    // 店铺详细地址
                    AddressUserNote: '',
                    // 店铺地址用户备注
                    ShopLoc: '',
                    // 店铺坐标(x,y)
                    PrepareMinute: 0,
                    // 备餐时间（单位：分钟）,创建时默认填入0
                    ShopSummary: '',
                    // 店铺简介
                    LinkMobile: '',
                    // 联系电话
                    LinkWechat: '',
                    // 联系人微信
                },
            }
        },
        onShow() {
            if (wx.getStorageSync('address')) {
                let address = wx.getStorageSync('address');
                /* 店铺地址信息 */
                this.shopInfo.AddressTitle = address.title;
                this.shopInfo.AddressNote = address.name;
                this.shopInfo.ShopPrivate = address.province;
                this.shopInfo.ShopCity = address.city;
                this.shopInfo.ShopCounty = address.district;
                this.shopInfo.ShopLoc = address.location.lng + ',' + address.location.lat
            }
            if (wx.getStorageSync('cutImg1')) {
                this.shopInfo.ShopLogo = wx.getStorageSync('cutImg1');
            }
            let timeArray = wx.getStorageSync('timeArray') || [];
            this.time = timeArray.length > 0 ? timeArray.join(',') : timeArray;
            for (let i = 0; i < timeArray.length; i++) {
                let arr = timeArray[i].split('-');
                arr[0] = arr[0].split(':').map(Number);
                arr[1] = arr[1].split(':').map(Number);
                timeArray[i] = (arr[0][0] * 60 + arr[0][1]) + '-' + (arr[1][0] * 60 + arr[1][1]);
            }
            this.shopInfo.OpenTime = timeArray.join(',');
        },
        mounted() {
            this.shopId = wx.getStorageSync('loginInfo').ShopID;
            /* 店铺类型 */
            this.GetBusinessType();
            if (this.shopId > 0) {
                this.getShopInfo();
            } else {
                this.shopInfo.LinkMobile = wx.getStorageSync('loginInfo').Mobile || '';
                this.shopInfo.ShopLogo = wx.getStorageSync('loginInfo').Photo || wx.getStorageSync('userInfo').avatarUrl;
                this.shopInfo.ShopName = (wx.getStorageSync('loginInfo').NickName || wx.getStorageSync('userInfo').nickName) + '的小店'
            };
        },
        methods: {
            shopType(v) {
                if (this.shopId === 0) {
                    this.shopInfo.BusinessType = v.ID
                }
            },
            /* 获取店铺信息 */
            getShopInfo() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/GetShopDetail',
                    data: {
                        ShopID: this.shopId
                    }
                }).then(res => {
                    if (res.State == 1) {
                        this.shopInfo = res.Body;
                        this.time = res.Body.OpenTime === '' ? '' : this.util.openTime(res.Body.OpenTime);
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            /* 获取店铺类型 */
            GetBusinessType() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/GetBusinessTypeDic',
                    data: {}
                }).then(res => {
                    if (res.State == 1) {
                        this.BusinessType = res.Body;
                        this.shopInfo.BusinessType = res.Body[0].ID;
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            /* 创建店铺 */
            cerateShop() {
                if (!this.isSubmit) return;
                if (this.phone(this.shopInfo.LinkMobile)) {
                    this.util.post({
                        url: '/api/Merchant/ShopManage/CreateShop',
                        data: this.shopInfo
                    }).then(res => {
                        if (res.State == 1) {
                            let loginInfo = wx.getStorageSync('loginInfo');
                            loginInfo.ShopID = res.Body.ShopID;
                            wx.setStorageSync('loginInfo', loginInfo);
                            wx.setStorageSync('shopInfo', this.shopInfo);
                            wx.removeStorageSync('userInfo');
                            this.msg('创建成功');
                            setTimeout(_=> {
                                // wx.navigateBack({
                                //     delta: 1
                                // })
                                wx.redirectTo({
                                    url: '/pages/admin-select-plat'
                                })
                            }, 300)
                        }
                    }).catch(err => {
                        this.msg(err.Msg)
                    })
                }
            },
            /* 修改店铺 */
            editShop() {
                if (this.phone(this.shopInfo.LinkMobile)) {
                    this.util.post({
                        url: '/api/Merchant/ShopManage/EditShop',
                        data: Object.assign({}, {
                            ShopID: this.shopId
                        }, this.shopInfo)
                    }).then(res => {
                        if (res.State == 1) {
                            this.msg('修改成功');
                            setTimeout(function() {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }, 300)
                        }
                    }).catch(err => {
                        this.msg(err.Msg)
                    })
                }
            },
            submitInfo() {
                if (this.shopId == '' || this.shopId == 0) {
                    /* 无店铺信息，创建店铺 */
                    this.cerateShop();
                } else {
                    /* 有店铺信息，修改店铺信息 */
                    this.editShop();
                }
            },
            //检测手机号
            phone(tel) {
                let reg = /^[1][3,4,5,6,7,8,9]\d{9}$/;
                if (reg.test(tel)) {
                    return true;
                } else {
                    if (tel != '') {
                        this.msg('请输入正确的手机号')
                    } else {
                        this.msg('请输入手机号')
                    }
                    return false;
                }
            },
            /* 选择地址 */
            goAddress() {
                wx.setStorageSync('timeArray', this.shopInfo.OpenTime == '' ? [] : this.util.openTime(this.shopInfo.OpenTime));
                wx.navigateTo({
                    url: '/pages/select-address'
                })
            },
            /* 修改营业时间 */
            goAddTime() {
                wx.setStorageSync('timeArray', this.shopInfo.OpenTime == '' ? [] : this.util.openTime(this.shopInfo.OpenTime));
                wx.navigateTo({
                    url: '/pages/admin-emit-time'
                })
            },
            upLoadLogo() {
                const that = this;
                wx.navigateTo({
                    url: '/pages/upload-shop-img?type=1'
                });
            },
        },
        computed: {
            isSubmit() {
                /* 判断提交信息，是否全部填写，除了营业状态，营业时间，备餐时间，地址备注 */
                for (let prop in this.shopInfo) {
                    if (this.shopInfo[prop] === '' && (prop != 'OpenTime' && prop != 'OpenState' && prop != 'ShopSummary' && prop != 'AddressUserNote' && prop != 'LinkWechat') && prop != 'ShopViewTemplate') {
                        console.log(prop)
                        return false
                    }
                }
                return true
            }
        },
        components: {},
    }
</script>

<style lang="less">
    page {
        background: #eeeef4;
    }
    .admin-shop-info {
        background: #eeeef4;
        padding-bottom: 130rpx;
        box-sizing: border-box;
        overflow-x: hidden;
        .main {
            background: #fff;
            margin-bottom: 20rpx;
            .option {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-left: 36rpx;
                padding: 23rpx 0;
                box-sizing: border-box;
                position: relative;
                &:after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-bottom: 1PX solid #ebebeb;
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
                &.otherBor {
                    &:after {
                        left: 137rpx;
                    }
                }
                .label {
                    font-size: 28rpx;
                    line-height: 28rpx;
                    color: #1a1a1a;
                    width: 136rpx;
                    margin-top: -1rpx;
                }
                .item {
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-right: 34rpx;
                    input {
                        flex: 1;
                        font-size: 28rpx;
                        color: #1a1a1a;
                        line-height: 34rpx;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .placeholerStyle {
                        font-size: 28rpx;
                        color: #ccc;
                        line-height: 34rpx;
                    }
                    span {
                        font-size: 28rpx;
                        color: #1a1a1a;
                    }
                    img {
                        width: 116rpx;
                        height: 116rpx;
                        margin-right: 28rpx;
                    }
                }
                &.info {
                    display: block;
                    .label {
                        padding-left: 20rpx;
                        position: relative;
                        height: 28rpx;
                        &:after {
                            content: '';
                            display: block;
                            position: absolute;
                            left: 0;
                            top: 5rpx;
                            width: 3rpx;
                            height: 18rpx;
                            background: #f34b54;
                        }
                    }
                    .name {
                        font-size: 26rpx;
                        color: #555;
                        padding: 40rpx 0;
                        &:last-child {
                            padding: 0;
                        }
                    }
                }
                &.bannerImg {
                    align-items: flex-start;
                    .item {
                        justify-content: flex-end;
                    }
                }
            }
            &.mainOther {
                .option {
                    .item {
                        justify-content: flex-end;
                        div {
                            font-size: 28rpx;
                            color: #1a1a1a;
                            margin-left: 24rpx;
                            .icon {
                                margin-right: 12rpx;
                            }
                        }
                    }
                }
            }
        }
        .handler {
            position: fixed;
            bottom: 0;
            left: 0;
            background: #fff;
            width: 100%;
            height: 118rpx;
            z-index: 10;
            border-top: 1rpx solid #ebebeb;
            .btn {
                margin: 19rpx 36rpx;
                height: 80rpx;
                text-align: center;
                line-height: 80rpx;
                background: #ccc;
                font-size: 28rpx;
                color: #fff;
                &.on {
                    background: #4b6df8;
                }
            }
        }
        .timeSelect {
            flex: 1;
        }
    }
</style>
