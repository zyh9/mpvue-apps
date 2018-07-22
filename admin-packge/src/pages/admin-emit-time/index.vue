<template>
    <div class="admin-emit-express">
        <div class="main " v-for="(v,i) in shopTime" :key='i'>
            <div class="option">
                <div class="label">时间段</div>
                <div class="time" @click="time(v)">
                    <!-- <input type="text" disabled placeholder-class='placeholerStyle' :value="v" placeholder="点击添加店铺营业时间（选填）"> -->
                    <picker mode="multiSelector" :range="multiArray" :value="multiIndex" :data-item='i' @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange" class="timeSelect">
                        <input type="text" disabled placeholder-class='placeholerStyle' :value="v" placeholder="点击添加店铺营业时间（选填）">
                    </picker>
                </div>
            </div>
            <i class="icon icon_del" @click="dealInfo(v,i)"></i>
        </div>
        <!-- <div class="emitAdd" @click="addInfo"> -->
        <div class="emitAdd" >
            <i class="icon icon_emitAdd"></i>
             <picker mode="multiSelector" @click="time('')" :range="multiArray" :value="multiIndex" :data-item='shopTime.length' @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange" class="timeSelect">
            <div class="label">点击为自己店铺添加营业时间段吧</div>
            </picker>
            
        </div>
        <div class="btn on" @click="setInfo">保存</div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                multiIndex: [0,0,0],
                multiArray: [
                    [],
                    ['至'],
                    []
                ],
                shopTime: [],/* ['00:00-16:00','12:00-14:30'] */
            }
        },
        onShow() {
            this.emit = false;
        },
        mounted() {
            this.shopId = wx.getStorageSync('loginInfo').ShopID || '';
            this.shopTime=wx.getStorageSync('timeArray')||[];
            /* 店铺营业时间初始化 00:00-24:00*/
            let timeArr = [];
            for (let i = 0; i < 24; i++) {
                timeArr.push((i > 9 ? i : '0' + i) + ':00');
                timeArr.push((i > 9 ? i : '0' + i) + ':30');
            }
            timeArr.push('24:00');
            this.multiArray = [timeArr,['至'], timeArr];
        },
        methods: {
            /* 删除信息 */
            dealInfo(v, i) {
                this.shopTime.splice(i, 1);
            },
            /* 添加信息 */
            addInfo() {
                this.shopTime.push('');
            },
            /* 保存信息 */
            setInfo() {
                this.shopTime=this.shopTime.filter(item=>{
                    return item!='';
                })
                for(let i=0;i<this.shopTime.length;i++){
                    let start = this.shopTime[i].split('-')[0].split(':').map(Number);
                    let end   = this.shopTime[i].split('-')[1].split(':').map(Number);
                    if(end[0]*60+end[1]<=start[0]*60+start[1]){
                        this.msg('结束时间必须大于开始时间');
                        return
                    }
                }
                wx.setStorageSync('timeArray', this.shopTime);
                wx.navigateBack({
                    delta: 1
                })
            },
            /* 确定时间 */
            bindMultiPickerChange: function(e) {
                this.multiIndex = e.mp.detail.value;
                let start = this.multiArray[0][e.mp.detail.value[0]].split(':').map(Number);
                let end = this.multiArray[2][e.mp.detail.value[2]].split(':').map(Number);
                if(start[0]*60+start[1]>=end[0]* 60+end[1]){
                    this.msg('结束时间必须大于开始时间')
                    return 
                }
                /* 新增时间 */
                if(e.currentTarget.dataset.item==this.shopTime.length){
                    this.addInfo();
                }
                this.shopTime[e.currentTarget.dataset.item] = this.multiArray[0][e.mp.detail.value[0]] + '-' + this.multiArray[2][e.mp.detail.value[2]];
            },
            /* 滑动改变时间 */
            bindMultiPickerColumnChange: function(e) {
                // console.log('修改的列为', e.mp.detail.column, '，下标为', e.mp.detail.value);
                let multiArray = this.multiArray;
                let multiIndex = this.multiIndex;
                multiIndex[e.mp.detail.column] = e.mp.detail.value;
                this.multiArray = multiArray,
                this.multiIndex = multiIndex;
            },
            /* 修改时间，记住当前时间 */
            time(t){
                this.multiIndex=[0,0,0]
                if(t){
                    let time=t.split('-');
                    for(let i=0;i<this.multiArray[0].length;i++){
                         if(this.multiArray[0][i]==time[0]){
                            this.multiIndex[0]=i;
                        }
                    }
                    for(let i=0;i<this.multiArray[2].length;i++){
                         if(this.multiArray[2][i]==time[1]){
                            this.multiIndex[2]=i;
                        }
                    }
                }
            }
        },
        computed: {
        },
        components: {},
    }
</script>

<style lang="less">
    .admin-emit-express {
        background: #eeeef4;
        padding-bottom: 102rpx;
        height: 100%;
        overflow-y: scroll;
        box-sizing: border-box;
        .main {
            background: #fff;
            margin-bottom: 20rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-right: 36rpx;
            .option {
                display: flex;
                flex: 1;
                align-items: center;
                margin-left: 36rpx;
                padding: 36rpx 0;
                box-sizing: border-box;
                .label {
                    font-size: 28rpx;
                    line-height: 28rpx;
                    color: #1a1a1a;
                    width: 136rpx;
                }
                .time {
                    font-size: 28rpx;
                    line-height: 28rpx;
                    color: #1a1a1a;
                    flex: 1;
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
                }
            }
            .icon{
                width: 24rpx;
                height: 24rpx;
            }
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
            margin: 56rpx 36rpx 0;
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
