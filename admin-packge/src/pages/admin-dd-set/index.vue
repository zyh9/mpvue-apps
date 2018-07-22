<template>
    <div class="admin_dd_set">
        <!-- 编辑信息 -->
        <div class="emit">
            <div class="main">
                <div class="option">
                    <div class="label" style="width:250rpx;">达达配送开关</div>
                    <div class="item">
                        <switch @change="open" :checked="getInfo.OpenState && getInfo.OpenState == 1?true:false" class="witch" />
                    </div>
                </div>
                <div class="option" @click="typeSelect">
                    <div class="label">经营行业</div>
                    <div class="item">
                        <p v-if="type">{{type}}</p>
                        <span v-if="type==''">请选择行业类型</span>
                        <i class="icon icon_arrowRight"></i>
                    </div>
                </div>
                <div class="option">
                    <div class="label">联系人</div>
                    <div class="item"><input type="text" placeholder-class='placeholderStyle' placeholder="请输入联系人姓名" maxlength="10" v-model="name"></div>
                </div>
                <div class="option">
                    <div class="label">联系方式</div>
                    <div class="item"><input type="number" placeholder-class='placeholderStyle' placeholder="请输入联系电话" maxlength="11" v-model="tel"></div>
                </div>
            </div>
            <div class="btn on" @click="setDD">保存</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: '',
                tel: '',
                type: '',
                state: 0,
                Id: null,
                getInfo: {}
            }
        },
        onShow() {
            if (wx.getStorageSync('dada')) {
                this.getInfo = wx.getStorageSync('dada');
                this.tel = this.getInfo.Phone;
                this.name = this.getInfo.ContactName;
                this.type = this.getInfo.BusinessName;
                this.Id = this.getInfo.Business;
            }
            if (wx.getStorageSync('type')) {
                this.type = wx.getStorageSync('type').Name;
                this.Id = wx.getStorageSync('type').Id;
            }
        },
        mounted() {},
        methods: {
            open(e) {
                if (wx.getStorageSync('dada')) {
                    this.state = this.getInfo.OpenState = e.target.value == true ? 1 : 0;
                    wx.setStorageSync('dada', this.getInfo);
                } else {
                    this.state = this.getInfo.OpenState = e.target.value == true ? 1 : 0;
                }
            },
            typeSelect() {
                wx.navigateTo({
                    url: '/pages/admin-type-select'
                })
            },
            setDD() {
                if (this.typeAuth() && this.nameAuth(this.name) && this.phone(this.tel)) {
                    this.util.post({
                        url: '/api/Merchant/ShopManage/SetDaDaShop',
                        data: {
                            ShopID: wx.getStorageSync('loginInfo').ShopID || '',
                            State: this.state, //0：关闭 1：开启
                            Business: this.Id, //经营类别
                            ContactName: this.name,
                            Phone: this.tel
                        }
                    }).then(res => {
                        // console.log(res.Body)
                        let dada = {
                            OpenState: this.state,
                            Business: this.Id,
                            BusinessName: this.type,
                            ContactName: this.name,
                            Phone: this.tel
                        }
                        this.state == 1 && wx.setStorageSync('dada', dada);
                        wx.removeStorageSync('type')
                        this.msg(this.state == 1 ? '设置保存成功' : '设置保存成功');
                        setTimeout(_ => {
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 300)
                    }).catch(err => {
                        this.msg(err.Msg)
                    })
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
            nameAuth(name) {
                let reg = /^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,10})$/;
                if (reg.test(name)) {
                    return true;
                } else {
                    if (name == '') {
                        this.msg('您还没有输入姓名哦')
                    }
                    return false;
                }
            },
            typeAuth() {
                if (this.type != '') {
                    return true;
                } else {
                    this.msg('您还没有选择类型哦')
                    return false;
                }
            }
        },
        components: {},
        watch: {},
    }
</script>

<style lang="less">
    .admin_dd_set {
        background: #eeeef4;
        padding-bottom: 102rpx;
        height: 100%;
        overflow-y: scroll;
        box-sizing: border-box;
        .emit {
            .main {
                background: #fff;
                .option {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-left: 36rpx;
                    padding-right: 36rpx;
                    position: relative;
                    height:110rpx;
                    &::after {
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
                    .label {
                        font-size: 30rpx;
                        color: #1a1a1a;
                        // padding: 36rpx 0;
                        width: 150rpx;
                        
                    }
                    
                    .item {
                        display: flex;
                        font-size: 30rpx;
                        color: #1a1a1a;
                        flex: 1;
                        align-items: center;
                        justify-content: flex-end;
                        div {
                            font-size: 30rpx;
                            color: #1a1a1a;
                            margin-left: 25rpx;
                            .icon {
                                margin-right: 10rpx;
                                vertical-align: middle;
                            }
                        }
                        input {
                            font-size: 30rpx;
                            color: #1a1a1a;
                            line-height: 34rpx;
                            text-align:left;
                            flex:1;
                        }
                        .placeholderStyle {
                            font-size: 30rpx;
                            color: #ccc;
                            line-height: 34rpx;
                        }
                        .icon {
                            margin-left: 20rpx;
                        }
                        p {
                            font-size: 30rpx;
                            color: #1a1a1a;
                            line-height: 34rpx;
                            text-align: right;
                        }
                        span {
                            font-size: 30rpx;
                            color: #ccc;
                            line-height: 34rpx;
                            text-align:left;
                            flex:1;
                        }
                    }
                }
            }
        }
        .btn {
            margin: 43rpx 36rpx 0;
            text-align: center;
            line-height: 88rpx;
            background: #ccc;
            font-size: 28rpx;
            color: #fff;
            &.on {
                background: #4b6df8;
            }
        }
        .witch {
            transform: scale(0.8);
            margin-right: -20rpx;
        }
    }
</style>
