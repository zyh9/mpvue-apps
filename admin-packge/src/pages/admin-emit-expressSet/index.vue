<template>
    <div class="admin_add_goods">
        <!--  -->
        <div class="emitAdd" v-if='!emit&&list.length==0' @click="emitAdd();addInfo()">
            <i class="icon icon_emitAdd"></i>
            <div class="label">创建规则</div>
        </div>
        <!-- 已配置规则 -->
        <div class="list" v-if='!emit&&list.length>0'>
            <div class="main ">
                <div class="option" v-for="(v,i) in list" :key='i'>
                    <div class="item">
                        <div class="title">满减配送费 - 优惠{{i+1}}</div>
                        <div class="tip">消费满{{v.OverGoodPrice}}元，减免配送费{{v.SubtractProtuiMoney}}元</div>
                    </div>
                </div>
            </div>
            <!-- <div class="btn on" @click='emitAdd'>编辑规则 </div> -->
            <!-- <div class="handler">
                <div class="btn on" @click='emitAdd'>编辑规则</div>
            </div> -->
            <div class="handler">
                <div class="btn on" @click='emitAdd'>编辑规则</div>
            </div>
        </div>
        <!-- 编辑规则 -->
        <div class="emit" v-if="emit">
            <div class="main bannerImg" v-for="(v,i) in newList" :key='i'>
                <div class="option other">
                    <div class="label">规则{{i+1}}</div>
                    <div class="item" >
                        <i class="icon icon_clear" @click="dealInfo(v,i)"></i>
                    </div>
                </div>
                <div class="option">
                    <div class="label">消费金额</div>
                    <div class="item">
                        <input type="number" maxlength="5" v-model="v.OverGoodPrice" placeholder-class='placeholerStyle' placeholder="请输入整数金额">
                        <span>元</span>
                    </div>
                </div>
                <div class="option">
                    <div class="label">减免金额</div>
                    <div class="item">
                        <input type="number" maxlength="3" v-model="v.SubtractProtuiMoney" placeholder-class='placeholerStyle' placeholder="请输入整数金额">
                        <span>元</span>
                    </div>
                </div>
            </div>
            <div class="emitAdd" v-if='newList.length<5' @click='addInfo'>
                <i class="icon icon_emitAdd"></i>
                <div class="label">创建规则</div>
            </div>
            <div class="tips">最多支持添加5条减免规则</div>
            <!-- <div class="handler">
                <div class="btn on" @click="setInfo">保存</div>
            </div> -->
            <cover-view class="handler">
                <cover-view class="btn on" @click="setInfo">保存</cover-view>
            </cover-view>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                emit: false,
                list: [],
                newList:[],
                shopId: '',
                dealList:[],/* 删除的信息 */
            }
        },
        onShow() {
            this.emit = false;
            
        },
        mounted() {
            this.shopId = wx.getStorageSync('loginInfo').ShopID || '';
            this.getInfo();
        },
        methods: {
            /* 编辑规则 */
            emitAdd(){
                this.emit=true;
                this.newList=JSON.parse(JSON.stringify(this.list));
               
                for(let i=0;i<this.newList.length;i++){
                    this.newList[i]=Object.assign({},this.newList[i],{State:0})
                }
            },
            /* 获取信息 */
            getInfo() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/GetShopPaotuiPrice',
                    data: {
                        ShopID: this.shopId
                    }
                }).then(res => {
                    if (res.State == 1) {
                        this.list = res.Body;
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            /* 删除信息 */
            dealInfo(v,i) {
                for(let i=0;i<this.list.length;i++){
                    if(this.list[i].Id==v.Id){
                        v.State=-1;
                        this.dealList.push(v);
                    }
                }
                this.newList.splice(i, 1);
            },
            /* 提交修改信息 */
            setInfo() {
                /* 合并修改信息，删除信息 */
                let subList=this.newList.concat(this.dealList);
                if(subList.length==0){
                    return
                }
                for (let i = 0; i < subList.length; i++) {
                    console.log(subList[i].OverGoodPrice,subList[i].SubtractProtuiMoney)
                    if (subList[i].OverGoodPrice === '' || subList[i].SubtractProtuiMoney === '') {
                        this.msg('请完善费用信息');
                        return
                    }
                    subList[i].OverGoodPrice = Number(subList[i].OverGoodPrice);
                    subList[i].SubtractProtuiMoney = Number(subList[i].SubtractProtuiMoney);
                }
                
                this.util.post({
                    url: '/api/Merchant/ShopManage/UpdateShopPaotuiPrice',
                    data: {
                        ShopID: this.shopId,
                        PriceList: subList
                    }
                }).then(res => {
                    this.msg('修改成功');
                    this.dealList=[];
                    this.list=[];
                    this.newList=[];
                    setTimeout(()=>{
                         this.getInfo();
                        this.emit=false;
                    },300)
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            /* 添加新信息 */
            addInfo() {
                this.newList.push({
                    Id: 0,
                    OverGoodPrice: '',
                    SubtractProtuiMoney: '',
                    State:0
                })
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
        .main {
            background: #fff;
            margin-bottom: 20rpx;
            .option {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-left: 36rpx;
                // border-bottom: 1rpx solid #ebebeb;
                padding: 36rpx 0;
                box-sizing: border-box;
                position: relative;
                &:after{
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
                &:last-child{
                    &::after{
                        display: none;
                    }
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
                }
            }
            &.bannerImg {
                .option {
                    .item {
                        justify-content: flex-end;
                        .icon{
                            margin-right: -4rpx;
                        }
                    }
                }
            }
        }
        .list {
            .main {
                .option {
                    .item {
                        display: block;
                        .title {
                            font-size: 32rpx;
                            color: #1a1a1a;
                            line-height: 40rpx;
                            font-weight: 900;
                            margin-bottom: 10rpx;
                        }
                        .tip {
                            font-size: 28rpx;
                            color: #444;
                            line-height: 34rpx;
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
        .emit{
            padding-bottom: 100rpx;
        }
        .handler{
            position: fixed;
            bottom: 0;
            left: 0;
            background: #fff;
            width: 100%;
            height: 120rpx;
            z-index: 10;
            border-top: 1rpx solid #ebebeb;
            .btn {
                margin:19rpx 36rpx;
                height:80rpx;
                text-align: center;
                line-height: 80rpx;
                background: #ccc;
                font-size: 28rpx;
                color: #fff;
                &.on{
                    background: #4b6df8;
                }
            }
        }
        
        .tips {
            font-size: 22rpx;
            color: #999;
            line-height: 30rpx;
            padding: 30rpx 36rpx 0;
        }
    }
</style>
