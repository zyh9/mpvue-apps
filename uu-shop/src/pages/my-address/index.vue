<template>
    <div class="my_address set-flex set-ver" v-if="block">
        <div class="main">
            <div class="pageTitle">我的地址</div>
            <p class="no_address" v-if="noAddress">您还没有地址，可点击底部按钮进行添加</p>
            <ul class="my_address_list set-grow" v-if="addressList.length">
                <li v-for="(v,i) in addressList" :key="i" :data-index="i" @touchstart="touchS" @touchmove="touchM" @touchend="touchE" :style="{marginLeft:v.leftVal}">
                    <div class="address_item_left set-align" @click="setAddress(v)">
                        <i class="icon " v-if='type==1' :class="checkId==v.Id?'icon_checked':'icon_check'"></i>
                        <div class="address_item_info">
                            <p class="name">{{v.LinkMan}} {{v.LinkManMobile}}</p>
                            <p class="pos">{{v.AddressTitle}}{{v.UserNote}}</p>
                            <p class="local_address">{{v.textInfo}}</p>
                        </div>
                    </div>
                    <div class="edit_box" @click='goEdit(v)'><i class="icon  icon_edit"></i></div>
                    <div class="list_item_del" @click='delAddress(v)' :style="{right:-delBtnWidth+'px',width:delBtnWidth+'px'}" :data-item="v">删除</div>
                </li>
            </ul>
            <ul class="my_address_list set-grow" v-if="uuptList.length">
                <li v-for="(v,i) in uuptList" :key="i" :data-index="i">
                    <div class="address_item_left set-align" @click="setAddress(v)">
                        <i class="icon " v-if='type==1' :class="checkId==v.Id?'icon_checked':'icon_check'"></i>
                        <div class="address_item_info">
                            <p class="name">{{v.LinkMan}} {{v.LinkManMobile}}</p>
                            <p class="pos">{{v.AddressTitle}}{{v.UserNote}}</p>
                            <p class="local_address">{{v.textInfo}}</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="address_bottom">
            <p @click="synchronize" class="set-flex set-align set-center"><i class="icon icon_synchro"></i>同步UU跑腿地址</p>
            <p @click="addAddress" class="set-flex set-align set-center"><i class="icon icon_addAddress"></i>添加新地址</p>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                checkId: '',
                addressList: [],
                startX: 0,
                delBtnWidth: 60,
                /* type:  1: 选择地址进入，可点击选择；2：我的地址进入，不可点击 */
                type: 1,
                uupt: true,
                uuptList: [],
                block: false,
                noAddress: false
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
            this.type = this.$root.$mp.query.type;
            this.uupt = true;
            this.checkId = '';
            this.noAddress = false;
            this.addressList = this.uuptList = [];
            this.addressInfo();
        },
        methods: {
            check() {},
            addAddress() {
                wx.removeStorageSync('address')
                wx.navigateTo({
                    url: '/pages/add-address/main?type=1'
                })
            },
            //获取所有地址
            addressInfo() {
                this.util.post({
                    url: '/api/Customer/PersonerCenter/Addresses',
                    data: {}
                }).then(res => {
                    this.block = true;
                    wx.hideLoading();
                    res.Body.forEach(e => {
                        e.AddressTitle = e.AddressTitle.split('($)').join(' ');
                        e.textInfo = '本地地址';
                        e.type = 1;
                    });
                    this.addressList = res.Body;
                    !this.addressList.length && (this.noAddress = true);
                    if (this.type == 1) {
                        this.checkId = this.$root.$mp.query.addressId;
                    } else {
                        if (res.Body.length > 0) {
                            this.checkId = res.Body[0].Id;
                        }
                    }
                }).catch(err => {
                    console.log(err)
                    this.msg(err.Msg)
                })
            },
            //同步UU跑腿地址
            synchronize() {
                if (this.uupt) {
                    this.util.post({
                        url: '/api/Customer/PersonerCenter/PaotuiAddresses',
                        data: {}
                    }).then(res => {
                        if (!res.Body.length) {
                            this.msg('您还没有UU跑腿的地址哦')
                        } else {
                            let id = 0;
                            res.Body.forEach(e => {
                                id--;
                                // e.AddressTitle = `${e.AddressNote} ${e.AddressTitle}`;
                                e.textInfo = '跑腿地址';
                                e.Id = id;
                                e.type = 2;
                            })
                            this.msg('已同步UU跑腿地址')
                            this.uuptList.push(...res.Body);
                            this.uuptList.length && (this.noAddress = false);
                            this.uupt = false;
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                } else {
                    this.msg('已经同步过了哦')
                }
            },
            goEdit(item) {
                wx.setStorageSync('address', {
                    AddressNote: item.AddressNote,
                    name: item.AddressNote,
                    location: {
                        lat: item.AddressLoc.split(',')[1],
                        lng: item.AddressLoc.split(',')[0]
                    },
                    title: item.AddressTitle.split(' ')[0],
                    UserNote: item.UserNote,
                    LinkMan: item.LinkMan,
                    LinkManMobile: item.LinkManMobile,
                    CityName: item.CityName,
                    CountyName: item.CountyName
                })
                // return;
                wx.navigateTo({
                    url: '/pages/add-address/main?type=2&addressId=' + item.Id
                })
            },
            //删除某条地址
            delAddress(v) {
                if (v.textInfo == '本地地址') {
                    this.util.post({
                        url: '/api/Customer/PersonerCenter/DeleteAddress',
                        data: {
                            AddressId: v.Id
                        }
                    }).then(res => {
                        if (res.State == 1) {
                            setTimeout(_ => {
                                this.addressInfo();
                            }, 400)
                        } else {
                            this.msg(res.Msg);
                        }
                    }).catch(err => {
                        this.msg(err);
                    })
                } else {
                    this.msg('UU跑腿地址暂不支持删除')
                }
            },
            touchS(e) {
                if (e.touches.length == 1) {
                    this.startX = e.touches[0].clientX;
                }
            },
            touchM(e) {
                let index = e.currentTarget.dataset.index;
                if (e.touches.length == 1) {
                    //手指滑动开始的位置记录
                    let moveX = e.touches[0].clientX;
                    let disX = this.startX - moveX;
                    let left = 0;
                    if (disX == 0 || disX < 0) { //如果移动距离小于等于0，位置不变
                        left = "0px";
                    } else if (disX > 0) { //移动距离大于0，left值等于手指移动距离
                        left = "-" + disX + "px";
                        if (disX >= this.delBtnWidth) {
                            left = "-" + this.delBtnWidth + "px";
                        }
                    }
                    if (index != "" && index != null) {
                        this.addressList[index].leftVal = left;
                    }
                }
            },
            touchE(e) {
                let index = e.currentTarget.dataset.index;
                if (e.mp.changedTouches.length == 1) {
                    //手指抬起的位置
                    let endX = e.mp.changedTouches[0].clientX;
                    let disX = this.startX - endX;
                    let left = 0;
                    //如果距离小于删除按钮的1/2，不显示删除按钮
                    left = disX > this.delBtnWidth / 2 ? "-" + this.delBtnWidth + "px" : "0px";
                    if (index !== "" && index != null) {
                        this.addressList = this.addressList.map(item => {
                            item.leftVal = 0;
                            return item;
                        })
                        this.addressList[index].leftVal = left;
                    }
                }
            },
            setAddress(item) {
                if (this.type == 1) {
                    if (item.type == 2) {
                        this.util.post({
                                url: '/api/Customer/PersonerCenter/UpdateAddress',
                                data: {
                                    Id: 0,
                                    AddressTitle: item.AddressTitle,
                                    AddressNote: item.AddressNote,
                                    AddressLoc: item.AddressLoc,
                                    UserNote: item.UserNote,
                                    LinkMan: item.LinkMan,
                                    LinkManMobile: item.LinkManMobile,
                                    LinkManSex: item.LinkManSex,
                                    CityName: item.CityName,
                                    CountyName: item.CountyName,
                                    Type: 2
                                }
                            })
                            .then(res => {
                                if (res.State == -1010 || res.State == 1) {
                                    this.checkId = res.Body.AddressId;
                                    setTimeout(_ => {
                                        item.AddressTitle = item.AddressTitle.split(' ').join('($)');
                                        item.Id = res.Body.AddressId;
                                        wx.setStorageSync('selectAddress', item)
                                        wx.navigateBack({
                                            delta: 1
                                        })
                                    }, 200)
                                }
                            }).catch(err => {
                                this.msg(err.Msg)
                            })
                    } else {
                        this.checkId = item.Id;
                        setTimeout(_ => {
                            item.AddressTitle = item.AddressTitle.split(' ').join('($)');
                            wx.setStorageSync('selectAddress', item)
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 200)
                    }
                }
            }
        },
        components: {}
    }
</script>

<style lang="less">
    .my_address {
        position: relative;
        height: 100%;
        background: #fff;
        .main {
            padding: 0 0 110rpx 36rpx;
        }
        .my_address_list {
            height: 100%;
            box-sizing: border-box;
            overflow-x: hidden;
            overflow-y: scroll;
            li {
                width: 100%;
                transition: margin-left 0.6s ease;
                padding: 20rpx 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;
                &:after {
                    content: '';
                    display: block;
                    width: 680rpx;
                    height: 0;
                    border-bottom: 1px solid #ebebeb;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                }
                &:last-child {
                    &::after {
                        display: none;
                    }
                }
                .edit_box {
                    margin-right: 36rpx;
                    padding: 12rpx;
                    line-height: 1;
                }
                .address_item_left {
                    display: flex;
                    flex: 1;
                    justify-content: flex-start;
                    width: 100%;
                    .icon {
                        margin-right: 15rpx;
                    }
                    .address_item_info {
                        flex: 1;
                        padding-right: 30rpx;
                        width: 100%;
                        .pos {
                            font-size: 28rpx;
                            color: #1a1a1a;
                            line-height: 36rpx;
                            padding: 5rpx 0;
                        }
                        .name {
                            color: #666;
                            font-size: 26rpx;
                        }
                        .local_address {
                            color: #666;
                            font-size: 20rpx;
                        }
                    }
                }
                .list_item_del {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    background: #ff4d3a;
                    font-size: 24rpx;
                }
            }
        }
        .address_bottom {
            width: 100%;
            position: fixed;
            bottom: 0;
            left: 0;
            height: 104rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            border-top: 1rpx solid #ededde;
            background: #ffffff;
            p {
                height: 50rpx;
                width: 50%;
                text-align: center;
                line-height: 50rpx;
                font-size: 26rpx;
                .icon {
                    margin-right: 10rpx;
                }
            }
            p:nth-of-type(2) {
                border-left: 1rpx solid #cdcdcd;
                box-sizing: border-box;
            }
        }
    }
    .no_address {
        font-size: 26rpx;
        padding-top: 50rpx;
        color: #666;
        text-align: center;
        transform: translateX(-2%);
    }
</style>
