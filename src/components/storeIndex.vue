<template>
    <div class="store_index">
        <scroll-view scroll-y="true" style="height: 100%" lower-threshold="60" @scrolltolower="scrollHandler" class="scroll_left">
            <div v-for="(v,i) in left" :key="i" class="list-item_l" :data-id="v.id" @click="checked" :class="{left_select:i==selected}">{{v.text}}</div>
        </scroll-view>
        <scroll-view scroll-y="true" style="height: 100%" lower-threshold="60" @scrolltolower="scrollHandler" class="scroll_right">
            <div v-for="(v,i) in newList" :key="i" class="list-item_r">{{v.text}}</div>
        </scroll-view>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                left: [{
                        text: '全部',
                        id: 0
                    }, {
                        text: '热销1',
                        id: 1
                    }, {
                        text: '优惠2',
                        id: 2
                    },
                    {
                        text: '优惠3',
                        id: 3
                    }
                ],
                right: [{
                        text: '热销1产品1',
                        id: 1
                    }, {
                        text: '热销1产品2',
                        id: 1
                    },
                    {
                        text: '热销1产品3',
                        id: 1
                    },
                    {
                        text: '热销1产品4',
                        id: 1
                    }, {
                        text: '热销1产品5',
                        id: 1
                    },
                    {
                        text: '热销1产品6',
                        id: 1
                    },
                    {
                        text: '热销2产品1',
                        id: 2
                    }, {
                        text: '热销2产品2',
                        id: 2
                    },
                    {
                        text: '热销2产品3',
                        id: 2
                    },
                    {
                        text: '热销2产品4',
                        id: 2
                    }, {
                        text: '热销2产品5',
                        id: 2
                    },
                    {
                        text: '热销2产品6',
                        id: 2
                    },
                    {
                        text: '热销3产品1',
                        id: 3
                    }, {
                        text: '热销3产品2',
                        id: 3
                    },
                    {
                        text: '热销3产品3',
                        id: 3
                    },
                    {
                        text: '热销3产品4',
                        id: 3
                    }, {
                        text: '热销3产品5',
                        id: 3
                    },
                    {
                        text: '热销3产品6',
                        id: 3
                    }
                ],
                screening: [],
                selected: 0
            }
        },
        mounted() {},
        methods: {
            checked(e) {
                if (e.target.dataset.id == 0) {
                    this.screening = this.right;
                } else {
                    this.screening = this.right.filter(ele => ele.id == e.target.dataset.id)
                    // console.log(this.screening)
                }
                this.selected = e.target.dataset.id;
            }
        },
        computed: {
            newList: function() {
                return this.screening.length ? this.screening : this.right;
            }
        },
        components: {}
    }
</script>

<style lang="less">
    .store_index {
        height: 100%;
        display: flex;
        color: #666;
        font-size: 24rpx;
        .scroll_left {
            width: 260rpx;
            border-right: 1rpx solid #eee;
            .list-item_l {
                text-align: center;
                padding: 16rpx;
                border-bottom: 1rpx solid #eee;
            }
            .left_select {
                color: skyblue;
            }
        }
        .scroll_right {
            flex-grow: 1;
            .list-item_r {
                text-align: center;
                padding: 16rpx;
                border-bottom: 1rpx solid #eee;
            }
        }
    }
</style>
