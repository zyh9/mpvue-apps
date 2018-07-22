<template>
    <div class="admin-commodity-manage">
        <div class="headTop">
            <div class="searchBox set-flex set-align ">
                <div class="item set-flex set-grow set-align">
                    <i class="icon icon_search"></i>
                    <input type="text" class="set-grow" v-model="searchKey" focus="true" placeholder="在这里搜索你的商品">
                    <i class="icon icon_del" @click="searchKeyNull" v-if="searchKey"></i>
                </div>
                <span class="gosearch" @click="search">搜索</span>
            </div>
        </div>
        <scroll-view scroll-y="true" class="scroll_view" @scrolltolower='scrolltolower'>
            <ul class="admin-commodity-manage_list">
                <li v-for='(item,index)  in goodsList' :key='index' :data-goodid='item.GoodId' @click="emitGoods(item.GoodId)">
                    <div class="li_div">
                        <i class="icon icon_adminCheck" :class="{icon_adminChecked:item.checked}" v-if='handler || flag'></i>
                        <div class="goodsImg"><img :src="item.MasterPic+'?x-oss-process=image/resize,h_100'" alt="">
                            <div class="label" :class="'state'+item.State">{{item.State==1?'在售':item.State==2?'下架':'停售'}}</div>
                        </div>
                        <div class="item">
                            <div class="name">{{item.GoodName}}</div>
                            
                            <div class="info">
                                <div class="price" v-if='item.MultiSpec<=1'><span>&yen;</span>{{item.OriginalPrice}}</div>
                                <div class="price" v-if='item.MultiSpec>1'><span>&yen;</span>{{item.OriginalPrice}}起</div>
                                <div class="num">({{item.MultiSpec}}个规格)</div>
                                <!-- <div class="goDetail" v-if='item.MultiSpec>1'>查看详情<i class="icon icon_arrowSpec"></i></div> -->
                            </div>
                            <div class="specs" v-if="item.MultiSpec == 1" @click.stop="clickStock(item.GoodId)"><span>{{item.MinSpecGoodsStock > 99999 ? '库存无限' : '库存'+item.MinSpecGoodsStock}}</span><i class="icon icon_arrowSpec"></i></div>
                            <div class="specs" v-else @click.stop="clickStock(item.GoodId)"><span>{{item.MinSpecGoodsStock > 99999 ? '库存无限' : '库存'+item.MinSpecGoodsStock+'起'}}</span><i class="icon icon_arrowSpec"></i></div>
                        </div>
                    </div>
                </li>
            </ul>
            <p class="nodata" v-if="!goodsList.length&&isSearch">暂无商品信息</p>
        </scroll-view>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //入口判断
                searchKey: "", //搜索key
                isSearch:false,
                goodsList: [],
                winWidth: 0,
                winHeight: 0,
                // tab切换
                shopId: "",
                page: 1,
                pageSize: 10,
                isOver: false,
                GoodState: 0,
            };
        },
        onShow() {
            this.isSearch = false;
            //页面渲染就会触发
            this.page = 1;
            this.goodsList = [];
            this.searchKey = "";
            this.stockModal = false;
        },
        onUnload() {},
        mounted() {
            let query = wx.createSelectorQuery();
            query.select(".headTop").boundingClientRect();
            query.exec(res => {
                console.log(res);
                let height = res[0].height;
                wx.getSystemInfo({
                    success: res => {
                        this.winWidth = res.windowWidth;
                        //减去上方的高度
                        this.winHeight = res.windowHeight - height;
                    }
                });
            });
        },
        methods: {
            //点击库存
            clickStock(id) {
                wx.navigateTo({
                    url:`/pages/admin-stock-list?goodId=${id}`
                })
            },
            confStock() {
                console.log('保存库存');
            },
            scrolltolower() {
                if (this.isOver) {
                    return;
                }
                this.page++;
                this.search();
            },
            searchKeyNull() {
                this.searchKey = "";
                this.goodsList = [];
            },
            search() {
                if (this.searchKey) {
                    this.page = 1;
                    this.util
                        .post({
                            url: "/api/Merchant/Goods/GoodList",
                            data: {
                                ShopId: wx.getStorageSync("loginInfo").ShopID || "",
                                // GoodState:this.currentTab,/* 0:全部，1：上架中；2下架中；3.停售中 */
                                GoodState: 0,
                                /* 0:全部，1：上架中；2下架中；3.停售中 */
                                PageSize: this.pageSize,
                                PageIndex: this.page,
                                GoodName: this.searchKey
                            }
                        })
                        .then(res => {
                            console.log(res.Body);
                            this.isSearch = true;
                            if (!res.Body.length && this.page == 1) {
                                this.msg("没有检索到任何商品");
                                this.goodsList = [];
                                return;
                            }
                            this.goodsList = res.Body;
                            
                            if (res.Body.length < this.pageSize) {
                                this.isOver = true;
                                if (this.page > 1) {
                                    this.msg("没有更多信息~");
                                }
                            }
                        })
                        .catch(err => {
                            this.msg(err.Msg);
                        });
                }
            },
            delSearch() {
                this.searchKey = "";
                this.page = 1;
                this.goodsList = [];
            },
            searchChange(e) {
                if (e.mp.detail.value == "") {
                    this.page = 1;
                    this.goodsList = [];
                }
            },
            emitGoods(id) {
                wx.redirectTo({
                    url: "/pages/admin-add-goods?goodsId=" + id
                });
            }
        },
        computed: {},
        components: {},
        watch: {
            searchKey: function(newVal, oldVal) {
                if (!newVal) {
                    this.goodsList = [];
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    
    .admin-commodity-manage {
        height: 100%;
        background: #fff;
        position: relative;
    }
    .scroll_view {
        position: absolute;
        top: 140rpx;
        left: 0;
        right: 0;
        bottom: 0;
        background: #fafafa;
    }
    .searchBox {
        padding: 38rpx 24rpx 38rpx;
        position: relative;
        &::after {
            content: "";
            display: block;
            width: 100%;
            height: 0;
            position: absolute;
            bottom: 0;
            left: 0;
            border-bottom: 1px solid #ebebeb;
            transform: scaleY(0.5);
            transform-origin: 0 0;
        }
        .item {
            background: #f5f5f5;
            padding: 0 20rpx 0 24rpx;
            height: 64rpx;
            input {
                font-size: 26rpx;
                color: #999;
            }
            input::-webkit-input-placeholder {
                font-size: 26rpx;
                color: #999;
            }
            .icon_search {
                width: 26rpx;
                height: 26rpx;
                margin-right: 13rpx;
            }
            .icon_del {
                width: 24rpx;
                height: 24rpx;
            }
        }
        .gosearch {
            font-size: 28rpx;
            color: #666;
            margin-left: 20rpx;
        }
    }
    .admin-commodity-manage_top {
        display: flex;
        justify-content: space-around;
        align-items: center;
        background: #fff;
        border-bottom: 1rpx solid #ebebeb;
        height: 80rpx;
        li {
            height: 100%;
            flex-flow: 1;
            width: 100%;
            text-align: center;
            padding: 0 16rpx;
            span {
                height: 100%;
                display: inline-block;
                color: #999;
                font-size: 28rpx; // box-sizing: border-box;
                vertical-align: top;
                line-height: 80rpx;
            }
        }
        .li_select {
            span {
                color: #4c4c4c; // border-bottom: 4rpx solid #0863ee;
                font-weight: 900;
                position: relative;
                &::after {
                    content: "";
                    display: block;
                    width: 100%;
                    height: 0;
                    border-bottom: 3px solid #0863ee;
                    position: absolute;
                    bottom: -2rpx;
                    left: 0;
                }
            }
        }
    }
    .admin-commodity-manage_list {
        overflow: hidden;
        // padding-top: 23rpx;
        // padding-bottom: 120rpx;
        li {
            display: flex;
            align-items: center;
            // margin: 0 24rpx;
            padding: 33rpx 0;
            position: relative;
            background: #ffffff;
            .li_div{
               margin: 0 24rpx; 
               display: flex;
               align-items: center;
               width: 100%;
            }
            &::after {
                content: "";
                display: block;
                width: 100%;
                height: 0;
                position: absolute;
                bottom: 0;
                left: 0;
                border-bottom: 1px solid #ebebeb;
                transform: scaleY(0.5);
                transform-origin: 0 0;
            }
            &:last-child {
                &::after {
                    display: none;
                }
            }
            .icon {
                margin-right: 26rpx;
            }
            .goodsImg {
                width: 160rpx;
                height: 160rpx;
                margin-right: 24rpx;
                position: relative;
                .label {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    text-align: center;
                    font-size: 22rpx;
                    color: #fff;
                    width: 120rpx;
                    height: 40rpx;
                    line-height: 40rpx;
                    border-radius: 0px 40px 0px 0px;
                    &.state1 {
                        background-image: linear-gradient(90deg, #38c439 0%, #4be009 100%);
                    }
                    &.state2 {
                        background-image: linear-gradient(90deg, #f47f19 0%, #f39716 100%), linear-gradient(#38c822, #38c822);
                    }
                    &.state3 {
                        color: #1a1a1a;
                        background-image: linear-gradient(90deg, #bebebe 0%, #b6b8bd 100%), linear-gradient(#38c822, #38c822);
                    }
                }
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .item {
                flex: 1;
                height: 160rpx;
                display: flex;
                flex-direction: column; // align-content: space-between;
                justify-content: space-between;
                .name {
                    font-size: 30rpx;
                    color: #1d1d1d;
                    line-height: 30rpx;
                    font-weight: 900;
                }
                .specs {
                    // margin-bottom: 18rpx;
                    width: 268rpx;
                    height: 56rpx;
                    background-color: #f7f9ff;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    span {
                        font-size: 21rpx;
                        color: #3c59ee;
                        // line-height: 21rpx;
                        // padding: 10rpx 11rpx;
                        display: inline-block;
                        // background: #ebf2ff;
                    }
                    i {
                        margin-left: 6rpx;
                    }
                    // padding: 4rpx 0;
                }
                .info {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    .num {
                        font-size: 22rpx;
                        color: #444444;
                        line-height: 22rpx;
                        margin-left: 8rpx;
                    }
                    .price {
                        font-size: 24rpx;
                        color: #1a1a1a;
                        line-height: 24rpx;
                    }
                    .goDetail {
                        font-size: 22rpx;
                        color: #0863ee;
                        .icon {
                            margin-right: 0;
                            margin-bottom: -2rpx;
                        }
                    }
                }
                .time {
                    font-size: 20rpx;
                    color: #999999;
                    line-height: 20rpx;
                }
            }
        }
        .commodity_item {
            background: #fff;
            border-bottom: 1rpx solid #e6e6e6;
            padding: 20rpx;
            .commodity_item_top {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .top_img_info {
                    position: relative;
                    margin-right: 30rpx;
                    img {
                        width: 100rpx;
                        height: 100rpx;
                    }
                    p {
                        position: absolute;
                        width: 100%;
                        bottom: 0;
                        left: 0;
                        background: #ccc;
                        color: #666;
                        font-size: 24rpx;
                        text-align: center;
                    }
                }
                .top_shop_info {
                    flex: 1;
                    p {
                        color: #333;
                        font-size: 28rpx;
                    }
                    span,
                    i {
                        color: #666;
                        font-size: 24rpx;
                    }
                }
            }
            .commodity_item_bot {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .time {
                    color: #666;
                    font-size: 24rpx;
                }
            }
        }
    }
    p.nodata {
        text-align: center;
        font-size: 28rpx;
        color: #666;
    }
    .commodity_bottom {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        border-top: 1rpx solid #ebebeb;
        padding: 20rpx 36rpx 20rpx 36rpx;
        background: #fff;
        display: flex;
        justify-content: space-between;
        .btn {
            width: 333rpx;
            height: 72rpx;
            font-size: 26rpx;
            color: #fff;
            background: #0863ee;
            text-align: center;
            line-height: 72rpx;
            box-sizing: border-box;
            &.on {
                background: #fff;
                color: #0863ee;
                border: 1rpx solid #0863ee;
            }
            &.btnSmall {
                width: 180rpx;
            }
            &.cancel {
                margin-right: -20rpx;
                margin-left: 10rpx;
            }
        }
        .btn_next {
            width: 100%;
            height: 80rpx;
            font-size: 26rpx;
            color: #ffffff;
            background: #0863ee;
            text-align: center;
            line-height: 80rpx;
            box-sizing: border-box;
            &.on {
                background: #fff;
                color: #0863ee;
                border: 1rpx solid #0863ee;
            }
            &.btnSmall {
                width: 180rpx;
            }
            &.cancel {
                margin-right: -20rpx;
                margin-left: 10rpx;
            }
        }
        .btn_dis {
            background: #cccccc;
        }
        .itemBtn {
            margin-left: 24rpx;
            .icon {
                display: block;
                margin: 0 auto 10rpx;
            }
            p {
                font-size: 22rpx;
                color: #999999;
                line-height: 22rpx;
            }
            &.on {
                p {
                    color: #1a1a1a;
                }
            }
        }
    }
</style>
