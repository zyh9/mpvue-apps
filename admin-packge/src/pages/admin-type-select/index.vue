<template>
    <div class="admin_type_select">
        <div class="option" @click="select(v)" v-for="(v,i) in list" :key="i">
            <div class="label">{{v.Name}}</div>
            <i class="icon icon_arrowRight"></i>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                list: []
            }
        },
        onReady() {
            this.typeList()
        },
        methods: {
            typeList() {
                this.util.post({
                    url: '/Common/CommonList',
                    data: {
                        Type: 1
                    }
                }).then(res => {
                    this.list = res.Body;
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            select(v) {
                // console.log(v)
                wx.setStorageSync('type', v);
                wx.navigateBack({
                    delta: 1
                })
            }
        },
        components: {}
    }
</script>

<style lang="less">
    .admin_type_select {
        .option {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 36rpx;
            // padding: 36rpx 0;
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
            div {
                font-size: 30rpx;
                color: #1a1a1a;
                // margin-left: 25rpx;
                .icon {
                    margin-right: 10rpx;
                    vertical-align: middle;
                }
            }
            p {
                font-size: 30rpx;
                color: #ccc;
                line-height: 34rpx;
                text-align: right;
            }
        }
    }
</style>
