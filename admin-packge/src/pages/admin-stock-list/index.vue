<template>
    <!-- 库存模态框 -->
    <div class="container">
        <div class="Cont">
            <div class="stock_item" v-for="(item,index) in stockList" :key="index">
                <div class="stock_item_spec">{{item.SpecName}}</div>
                <div class="stock_item_cont">
                    <input type="number" v-model="item.stockMount" :disabled="item.isStock" placeholder="请输入库存数量" maxlength="5">
                    <p @click="clickStock(item,index)" class="kc_btn" :class="{kc_active:item.isStock}">库存无限量 <i></i></p>
                </div>
            </div>
        </div>
        <div class="btnCont">
            <div class="btn cancel" @click="cancelStock">取消</div>
            <div class="btn save" @click="saveStock">保存</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                goodId: '',
                oldStockList: [],
                stockList: [],
            }
        },
        onLoad() {

        },
        onShow() {
            console.log(this.$mp.query.goodId)
            this.goodId = this.$mp.query.goodId;
            this.stockList = [];
            this.getStockList();
        },

        methods: {
            //保存
            saveStock() {
                for(let i=0;i<this.stockList.length;i++){
                    console.log(this.stockList[i].stockMount.length,this.stockList[i].stockMount)
                    if(this.stockList[i].stockMount.length == 0){
                        this.msg('请输入完整信息')
                        return
                    }
                }
                let SpecGoodsCountList = [];
                //查询修改过的规格
                this.oldStockList.forEach( ele => {
                    this.stockList.forEach( item => {
                        
                        if(ele.SpecId == item.SpecId) {
                            if(ele.stockMount != item.stockMount) {
                                SpecGoodsCountList.push(item);
                            }
                        }
                    })
                })
                
                console.log(SpecGoodsCountList)
                //如果没有修改库存 
                if(SpecGoodsCountList.length == 0) {
                    wx.navigateBack({
                        delta: 1
                    })
                    return
                }
                //重构一个提交的数组[object,...]
                // let SpecObject = [];
                let obj = {};
                SpecGoodsCountList.forEach( ele => {
                    
                    obj[ele.SpecId] = ele.isStock ? 999999999 : Number(ele.stockMount);
                    // SpecObject.push(obj);
                    // SpecObject.push({
                    //     key: ele.SpecId,
                    //     value: ele.isStock ? 999999999 : Number(ele.stockMount)
                    // })
                })
                console.log(obj)
                this.util
                    .post({
                        url:'/api/Merchant/Goods/EditGoodsStock',
                        data: {
                            ShopId: wx.getStorageSync("loginInfo").ShopID || "",
                            GoodsId: Number(this.goodId),
                            SpecGoodsStockList: obj
                        }
                    }).then( res => {
                        console.log(res)
                        if(res.State == 1) {
                            this.msg('修改成功');
                            wx.navigateBack({
                                delta: 1
                            })
                        }else {
                            this.msg(res.Msg)
                        }
                    }).catch( err => {
                        this.msg(err.Msg)
                    })
            },
            //取消
            cancelStock() {
                console.log('取消');
                wx.navigateBack({
                    delta: 1
                })
            },

            clickStock(item,index) {
                console.log(item)
                if(item.isStock) {
                    item.isStock = !item.isStock;
                    item.stockMount = '';
                }else {
                    item.isStock = !item.isStock;
                    item.stockMount = '无限';
                }
            },
            
            //获取规格库存列表
            getStockList() {
                this.util
                    .post({
                        url: "/api/Merchant/Goods/GetGoodsStock",
                        data: {
                            ShopId: wx.getStorageSync("loginInfo").ShopID || "",
                            GoodId: this.goodId
                        }
                    })
                    .then(res => {
                        console.log(res);
                        if(res.State == 1) {
                            //自定义添加字段 isStock点击无限  stockMount库存数量>99999为无限   isInit是否为初始数据
                            res.Body.forEach(element => {
                                element.isStock = false;
                                element.stockMount = element.ResidueCount;
                                element.isInit = true;
                                if(Number(element.ResidueCount) > 99999) {
                                    element.isStock = true;
                                    element.stockMount = '无限';
                                }
                            });
                            this.stockList = res.Body;
                            this.oldStockList = JSON.parse(JSON.stringify(this.stockList));
                            console.log(this.stockList);
                        }else {
                            this.msg(res.Msg);
                        }
                    })
                    .catch(err => {
                        this.msg(err.Msg);
                    });
            }
        }
    }
</script>

<style lang="less" scoped>
    .container {
        width: 100%;
        height: 100%;
        padding-bottom: 110rpx;
        box-sizing: border-box;
        .Cont {
            height: 100%;
            background-color: #ffffff;
            overflow-y: scroll;
            padding: 0 36rpx;
            .stock_item {
                width: 100%; // height: 125rpx;
                padding: 27rpx 0;
                position: relative;
                &::after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    border-bottom: 1PX solid #ebebeb;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                }
                .stock_item_spec {
                    font-size: 24rpx;
                    color: #999999;
                }
                .stock_item_cont {
                    margin-top: 12rpx;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    input {
                        font-size: 30rpx;
                        height: 30rpx;
                        line-height: 30rpx;
                        flex: 1;
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
                        // margin-right: 22rpx;
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
        }
    }
    .btnCont {
        padding: 19rpx 36rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        position: absolute;
        bottom: 0;
        left: 0;
        background: #ffffff;
        z-index: 999;
        width:100%;
        box-sizing:border-box;
        &::after {
            content: '';
            display: block;
            width: 100%;
            height: 0;
            position: absolute;
            top: 0;
            left: 0;
            border-top: 1PX solid #ebebeb;
            transform: scaleY(0.5);
            transform-origin: 0 0;
        }
        .btn {
            width: 327rpx;
            height: 72rpx;
            font-size: 26rpx;
            line-height: 72rpx;
            text-align: center;
        }
        .save {
            background-color: #3c5aee;
            border: solid 1rpx #3c5aee;
            color: #ffffff;
        }
        .cancel {
            border: solid 1rpx #3c5aee;
            color: #3c5aee;
        }
    }
</style>

