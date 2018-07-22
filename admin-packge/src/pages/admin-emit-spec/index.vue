<template>
    <div class="admin_add_goods" v-if="block">
        <div class="main bannerImg" v-for="(v,i) in specslist" :key='i'>
            <div class="option">
                <div class="label">规格{{i+1}}</div>
                <div class="item">
                    <i class="icon icon_clear" @click="dealInfo(v,i)"></i>
                </div>
            </div>
            <div class="option">
                <div class="label">规格名称</div>
                <div class="item">
                    <input type="text" maxlength="150" v-model="v.SpecName" placeholder-class='placeholerStyle' placeholder="请输入规格名称">
                </div>
            </div>
            <div class="option">
                <div class="label">商品单价</div>
                <div class="item">
                    <input type="digit" v-model="v.OriginalPrice" placeholder-class='placeholerStyle' placeholder="请输入商品单价" @input="price(v.OriginalPrice,i)">
                    <span>元/件</span>
                </div>
            </div>
            <div class="option">
                <div class="label">打包费</div>
                <div class="item">
                    <input type="digit" v-model="v.PackingFee" placeholder-class='placeholerStyle' placeholder="请输入打包费" @input="packing(v.PackingFee,i)">
                    <span>元/件</span>
                </div>
            </div>
            <div class="option">
                <div class="label">库存数量</div>
                <div class="item">
                    <input type="number" v-model="v.stockMount" maxlength="5" placeholder-class='placeholerStyle' :disabled="v.isInit || v.isStock" placeholder="请输入库存数量" @input="stocking(v.PackingFee,i)">
                    <div @click="clickStock(v,i)" class="kc_btn" :class="{kc_active:v.isStock}">库存无限量 <i></i></div>
                    <span>件</span>
                </div>
            </div>
        </div>
        <div class="emitAdd" v-if="specslist.length < 8" @click='addInfo'>
            <i class="icon icon_emitAdd"></i>
            <div class="label">添加新规格</div>
        </div>
        <div class="bottom_tit">最多添加8条规格</div>
        <div class="btn " :class="{on:isSubmit}" @click='submitInfo'>保存</div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                specslist: [],
                dealList: [],
                oldList: [],
                //提交开关
                isSave: false,
                block: false,
            }
        },
        onLoad() {
            this.specslist = [];
            this.dealList = [];
            this.oldList = [];
            this.isSave = false;
            this.block = false;
            wx.showLoading({
                title: '加载中',
                mask: true
            })
        },
        onReady() {
            setTimeout(_ => {
                if (wx.getStorageSync('goodSpecs')) {
                    this.specslist = wx.getStorageSync('goodSpecs');
                    this.oldList = JSON.parse(JSON.stringify(this.specslist));
                    this.specslist = this.specslist.map(item => {
                        /* state：-2，修改信息 */
                        return item = Object.assign({}, item, {
                            State: 0
                        })
                    })
                }
                wx.hideLoading();
                this.block = true;
            }, 300)
        },
        onShow() {
            this.dealList = wx.getStorageSync('dealSpec') || [];
        },
        methods: {
            //点击无限库存
            clickStock(item, index) {
                //原始数据的库存不可编辑
                if (item.isInit) return;
                item.isStock = !item.isStock;
                if (item.isStock) {
                    item.stockMount = '无限';
                } else {
                    item.stockMount = '';
                }
            },
            price(val, index) {
                let reg = /(^(\.{1,})|(([0-9]+)[.]([0-9]{3,}))|(([0-9]+)([.]{2,}))|(([.]([\d]+)){2,}))|(^(([0]{2,})|([0][1-9])))$/;
                let valStr = val.toString();
                if (reg.test(valStr)) {
                    this.msg('请输入合法金额');
                }
                let v = valStr.replace(reg, "");
                this.specslist[index].OriginalPrice = v;
            },
            packing(val, index) {
                let reg = /(^(\.{1,})|(([0-9]+)[.]([0-9]{3,}))|(([0-9]+)([.]{2,}))|(([.]([\d]+)){2,}))|(^(([0]{2,})|([0][1-9])))$/;
                let valStr = val.toString();
                if (reg.test(valStr)) {
                    this.msg('请输入合法金额');
                }
                let v = valStr.replace(reg, "");
                this.specslist[index].PackingFee = v;
            },
            stocking(val, index) {
                let reg = /(^(\.{1,})|(([0-9]+)[.]([0-9]{3,}))|(([0-9]+)([.]{2,}))|(([.]([\d]+)){2,}))|(^(([0]{2,})|([0][1-9])))$/;
                let valStr = val.toString();
                if (reg.test(valStr)) {
                    this.msg('请输入合法金额');
                }
                let v = valStr.replace(reg, "");
                this.specslist[index].PackingFee = v;
            },
            /* 添加规格 */
            addInfo() {
                this.specslist.push({
                    Id: 0,
                    /* 规格名称 */
                    SpecName: '',
                    /* 商品原价 */
                    OriginalPrice: '',
                    /* 销售价格 */
                    SalesPrice: '',
                    /* 打包费 */
                    PackingFee: '',
                    State: -2,
                    isStock: true,
                    stockMount: '无限',
                    isInit: false
                })
            },
            /* 删除规格 */
            dealInfo(v, i) {
                for (let j = 0; j < this.specslist.length; j++) {
                    if (this.specslist[j].Id == v.Id && v.Id != 0) {
                        v.State = -1;
                        this.dealList.push(v);
                    }
                }
                this.specslist.splice(i, 1);
            },
            /* 提交信息，返回到修改商品页 */
            submitInfo() {
                if (this.isSave) {
                    return
                }
                this.isSave = true;
                if (!this.isSubmit) {
                    return
                }
                for (var i = 0; i < this.specslist.length; i++) {
                    // var stockMount = 
                    console.log(typeof this.specslist[i].stockMount)
                    if (typeof this.specslist[i].stockMount == 'string') {
                        if (this.specslist[i].stockMount == '') {
                            this.msg('请输入库存信息')
                            this.isSave = false;
                            return
                        }
                    }
                }
                this.oldList.forEach(ele => {
                    this.specslist.forEach(item => {
                        console.log(item)
                        if (ele.Id == item.Id && (ele.SpecName != item.SpecName || ele.OriginalPrice != item.OriginalPrice || ele.PackingFee != item.PackingFee || ele.stockMount != item.stockMount)) {
                            item.State = -2;
                        }
                        item.ResidueCount = item.stockMount
                        // item.ResidueCount =  item.isStock ? item.stockMount : item.stockMount
                    })
                });
                let info = this.specslist.concat(this.dealList);
                wx.setStorageSync('goodSpecs', info);
                wx.setStorageSync('dealSpec', this.dealList)
                this.msg('修改成功');
                setTimeout(_ => {
                    this.isSave = false;
                    wx.navigateBack({
                        delta: 1
                    })
                }, 300)
            }
        },
        computed: {
            isSubmit() {
                for (let i = 0; i < this.specslist.length; i++) {
                    if (this.specslist[i].SpecName == '' || this.specslist[i].OriginalPrice === '' || this.specslist[i].PackingFee === '' || this.specslist[i].SpecName == '') {
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
    .admin_add_goods {
        background: #eeeef4;
        padding-bottom: 102rpx;
        height: 100%;
        overflow-y: scroll;
        box-sizing: border-box;
        .main {
            background: #fff;
            margin-bottom: 20rpx;
            .option {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-left: 36rpx; // padding: 20rpx 0;
                height: 100rpx;
                box-sizing: border-box;
                position: relative;
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
                .label {
                    font-size: 28rpx;
                    line-height: 28rpx;
                    color: #1a1a1a;
                    width: 136rpx;
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
                    }
                    .placeholerStyle {
                        font-size: 28rpx;
                        color: #ccc;
                        line-height: 34rpx;
                    }
                    textarea {
                        flex: 1;
                        font-size: 28rpx;
                        color: #1a1a1a;
                        line-height: 34rpx;
                        width: 100%;
                        height: auto;
                        min-height: 34rpx;
                    }
                    span {
                        font-size: 28rpx;
                        color: #1a1a1a;
                    }
                    .kc_btn {
                        width: 164rpx;
                        height: 48rpx;
                        border: solid 1px #cccccc;
                        font-size: 24rpx;
                        color: #999999;
                        text-align: center;
                        line-height: 48rpx;
                        margin-right: 22rpx;
                        position: relative;
                    }
                    .kc_active {
                        border: solid 1px #3c59ee;
                        font-family: PingFangSC-Regular;
                        font-size: 24rpx;
                        color: #3c59ee;
                        text-align: center;
                        line-height: 48rpx;
                        i {
                            position: absolute;
                            width: 0;
                            height: 0;
                            bottom: -20rpx;
                            right: -20rpx;
                            border-width: 20rpx;
                            border-style: solid;
                            border-color: transparent transparent transparent #3c59ee;
                            transform: rotate(45deg);
                        }
                    }
                }
            }
            &.bannerImg {
                .option {
                    .item {
                        justify-content: flex-end;
                    }
                }
            }
        }
        .bottom_tit {
            text-align: center;
            font-size: 22rpx;
            color: #cccccc;
            margin-top: 30rpx;
        }
        .emitAdd {
            background: #fff;
            margin-bottom: 20rpx;
            display: flex;
            padding: 36rpx;
            .label {
                font-size: 28rpx;
                line-height: 28rpx;
                color: #1a1a1a;
                margin-left: 15rpx;
            }
        }
        .btn {
            margin: 44rpx 36rpx 0;
            text-align: center;
            line-height: 88rpx;
            background: #ccc;
            font-size: 28rpx;
            color: #fff;
            &.on {
                background: #4b6df8;
            }
        }
    }
</style>
