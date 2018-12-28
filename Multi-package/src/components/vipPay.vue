<template>
    <div>
        <div class="vip_mask" v-if="vipMask"></div>
        <div class="vip_con" v-if="vipMask">
            <div class="pay_title">
                <p class="pay_password">请输入支付密码</p>
                <div class="title_img" @click="cancelPay">
                    <i class="icon_close"></i>
                </div>
            </div>
            <div class="vip_pay_info">
                <p class="vip_pay_text"><i class="icon_over"></i><span>余额支付</span></p>
                <p class="vip_pay_money"><span>¥</span>{{payInfo.money}}</p>
                <p class="shop_name">付款给{{payInfo.name}}</p>
            </div>
            <div class="vip_code">
                <input type="number" focus="true" maxlength="6" v-model="code" placeholder-style="color:transparent;" />
                <div v-for="(v,i) in codeLen" :key="i" class="item_code">{{codeArr[i]}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                vipMask: false,
                code: '',
                codeLen: 6,
            }
        },
        props: {
            payInfo: {
                type: Object,
                default: {}
            }
        },
        onLoad() {},
        onReady() {},
        onShow() {},
        methods: {
            blockPay() {
                this.vipMask = true;
            },
            hidePay() {
                this.vipMask = false;
            },
            clearCode() {
                this.code = '';
            },
            cancelPay() {
                this.$emit("cancelPay", {
                    title: "取消支付"
                })
            }
        },
        computed: {
            codeArr() {
                let arr = [];
                this.code.split('').forEach(_ => arr.push('·'));
                return arr;
            },
        },
        watch: {
            code: function(newVal, oldVal) {
                newVal.length == 6 && this.$emit("authPassword", {
                    title: "提交密码",
                    val: newVal
                })
            }
        },
        components: {}
    }
</script>

<style lang="less">
    @import url('../less/vipPay.less');
</style>
