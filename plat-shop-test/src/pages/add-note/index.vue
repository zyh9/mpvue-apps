<template>
    <div class="add_note">
        <p class="note_title">添加备注</p>
        <div class="con">
            <textarea placeholder="请输入备注信息" maxlength="150" class="note_text" auto-focus="true" v-model="value" />
            <span>{{value.length}}/150</span>
        </div>
        <div class="submit_note" @click="submitNote">保存</div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                value: ''
            }
        },
        onLoad(){
            this.value='';
            if(wx.getStorageSync('note')){
                this.value=wx.getStorageSync('note');
            }
        },
        methods: {
            submitNote() {
                wx.setStorageSync('note', this.value)
                wx.navigateBack({
                    delta: 1
                })
            }
        },
        components: {},
        computed: {
            note: function() {
                return wx.getStorageSync('note') ? wx.getStorageSync('note') : this.value
            }
        },
        watch: {}
    }
</script>

<style lang="less">
    .add_note {
        height: 100%;
        background: #fff;
        padding: 20rpx 36rpx;
        box-sizing: border-box;
        .note_title {
            font-size: 44rpx;
            color: #000;
            font-weight: 700;
            line-height: 100rpx;
            margin-bottom: 17rpx;
        }
        .con {
            position: relative;
            overflow: hidden;
            margin-bottom: 74rpx;
            .note_text {
                font-size: 28rpx;
                color: #666;
                background: #f5f5f5;
                border-radius: 8rpx;
                padding: 17rpx;
                height: 420rpx;
                overflow-x: hidden;
                overflow-y: scroll;
                width: 100%;
                box-sizing: border-box;
            }
            span {
                color: #999;
                position: absolute;
                right: 16rpx;
                bottom: 16rpx;
                font-size: 22rpx;
            }
        }
        .submit_note {
            width: 100%;
            height: 88rpx;
            background: #333;
            color: #fff;
            text-align: center;
            line-height: 88rpx;
            font-size: 30rpx;
            border-radius: 6rpx;
        }
    }
</style>
