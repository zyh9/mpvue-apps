<template>
    <div class="admin_rule_price" v-html='rules'>
        <!-- 
        <div class="main">
            <h2 class="title">UU专送计价规则</h2>
            <div class="tip"><i class="icon  icon_ruleCourse"></i>里程收费规则</div>
            <ul class="ruleList">
                <li>
                    <div>2公里以内</div>
                    <div><span>8.00</span>元</div>
                </li>
                <li>
                    <div>3公里以内</div>
                    <div><span>8.00</span>元</div>
                </li>
                <li>
                    <div>3-10公里以内部分</div>
                    <div><span>8.00</span>元/公里</div>
                </li>
                <li>
                    <div>10-30公里以内部分</div>
                    <div><span>2.00</span>元/公里</div>
                </li>
                <li>
                    <div>超出30公里以外部分</div>
                    <div><span>3.00</span>元/公里</div>
                </li>
            </ul>
            <div class="tip"><i class="icon icon_ruleAdd"></i>加价规则</div>
            <ul class="ruleList">
                <li>
                    <div>夜间21:00-00:00</div>
                    <div>每单<span>+8</span>元</div>
                </li>
                <li>
                    <div>夜间00:00-07:00</div>
                    <div>每单<span>+10</span>元</div>
                </li>
            </ul>
        </div>
        <div class="main">
            <h2 class="title">UU快送计价规则</h2>
            <div class="tip"><i class="icon icon_ruleCourse"></i>里程收费规则</div>
            <ul class="ruleList">
                <li>
                    <div>2公里以内</div>
                    <div><span>8.00</span>元</div>
                </li>
                <li>
                    <div>3公里以内</div>
                    <div><span>12.00</span>元</div>
                </li>
                <li>
                    <div>3-10公里以内部分</div>
                    <div><span>1.00</span>元/公里</div>
                </li>
                <li>
                    <div>10-30公里以内部分</div>
                    <div><span>2.00</span>元/公里</div>
                </li>
                <li>
                    <div>超出30公里以外部分</div>
                    <div><span>3.00</span>元/公里</div>
                </li>
            </ul>
            <div class="tip"><i class="icon icon_ruleAdd"></i>加价规则</div>
            <ul class="ruleList">
                <li>
                    <div>夜间21:00-00:00</div>
                    <div>每单<span>+5</span>元</div>
                </li>
                <li>
                    <div>夜间00:00-07:00</div>
                    <div>每单<span>+10</span>元</div>
                </li>
            </ul>
        </div> -->
    </div>
</template>

<script>
    export default {
        data() {
            return {
                rules:''
            }
        },
        mounted() {
            this.getRule();
        },
        methods: {
            getRule(){
                this.util.post({
                    url: '/api/Merchant/Orders/GetPaotuiPriceRule',
                    data: {
                        ShopID: wx.getStorageSync('loginInfo').ShopID || '',
                    }
                }).then(res => {
                    this.rules = res.Body.PaoTuiPriceRule;
                    console.log(this.rules)
                    this.rules=this.rules.replace(/<dl>/g,'<dl class="dl">').replace(/<dt>/g,'<dt class="dt">').replace(/<dd>/g,'<dd class="dd">').replace(/<span>/g,'<span class="span">').replace(/<em>/g,'<em class="em">');
                }).catch(err => {
                    this.msg(err.Msg)
                })
            }
        },
        components: {},
    }
</script>

<style lang="less">
    .card{
        background: #fff;
        .dl{
            padding: 0 36rpx;
            .dt{
                font-size: 30rpx;
                color:#666;
                line-height: 80rpx;
            }
            .dd{
                height: 60rpx;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                font-size: 28rpx;
                color:#ccc;
                .span{
                    display: inline-block;
                    font-size: 28rpx;
                        color: #999;

                }
                .em{
                    display: inline-block;
                    color: #3c59ee;
                    font-size: 28rpx;
                    font-style: normal;
                }

            }
        }
    }



    .admin_rule_price {
        background: #eeeef4;
        height: 100%;
        overflow-y: scroll;
        box-sizing: border-box;
        .main {
            background: #fff;
            margin-bottom: 20rpx;
            padding-bottom: 26rpx;
            h2.title {
                font-size: 32rpx;
                color: #1a1a1a;
                border-bottom: 1rpx solid#ebebeb;
                margin: 0 36rpx 18rpx;
                line-height: 116rpx;
            }
            .tip {
                .icon {
                    margin-right: 13rpx;
                    vertical-align: middle;
                }
                font-size: 30rpx;
                color:#666;
                line-height: 80rpx;
                padding: 0 36rpx;
            }
            ul.ruleList {
                padding: 0 36rpx;
                li {
                    height: 60rpx;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    div {
                        font-size: 28rpx;
                        color: #999;
                        span {
                            color: #3c59ee;
                            font-size: 28rpx;
                        }
                    }
                }
            }
        }
    }
</style>
