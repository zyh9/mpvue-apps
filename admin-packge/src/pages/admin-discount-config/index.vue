<template>
    <div class="admin_add_goods">
       
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
                <div class="label">商品原价</div>
                <div class="item">
                    <input type="digit" v-model="v.OriginalPrice" disabled placeholder-class='placeholerStyle'  placeholder="请输入商品原价">
                    <span>元/件</span>
                </div>
            </div>
            <div class="option">
                <div class="label">商品售价</div>
                <div class="item">
                    <input type="digit" v-model="v.OriginalPrice" placeholder-class='placeholerStyle'  placeholder="请输入商品售价">
                    <span>元/件</span>
                </div>
            </div>
            <div class="option">
                <div class="label">库存数量</div>
                <div class="item">
                    <input type="digit" disabled placeholder-class='placeholerStyle'  placeholder="无限制">
                    <span>元/件</span>
                </div>
            </div>
        </div>
        <div class="emitAdd" @click='addInfo'>
                <i class="icon icon_emitAdd"></i>
            <div class="label">添加新规格</div>
        </div>
        <div class="btn " :class="{on:isSubmit}" @click='submitInfo'>保存</div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                specslist:[],
                dealList:[],
                oldList:[]
            }
        },
        onShow() {
            this.dealList=wx.getStorageSync('dealSpec')||[];
        },
        mounted() {
           if(wx.getStorageSync('goodSpecs')){
               this.specslist=wx.getStorageSync('goodSpecs');
               this.oldList=JSON.parse(JSON.stringify(this.specslist));
               this.specslist=this.specslist.map(item=>{
                   /* state：-2，修改信息 */
                   return item=Object.assign({},item,{State:0})
               })
           }
        },
        methods: {
            /* 添加规格 */
            addInfo(){
                this.specslist.push({
                    Id: 0,
                    /* 规格名称 */
                    SpecName: '',
                    /* 商品原价 */
                    OriginalPrice:'',
                    /* 商品原价 */
                    SalesPrice: '',
                    /* 商品售价 */
                    PackingFee: '',
                    State:-2
                })
            },
            /* 删除规格 */
            dealInfo(v,i){
                for(let j=0;j<this.specslist.length;j++){
                    if(this.specslist[j].Id==v.Id&&v.Id!=0){
                        v.State=-1;
                        this.dealList.push(v);
                    }
                }
                this.specslist.splice(i, 1);
            },
            /* 提交信息，返回到修改商品页 */
            submitInfo(){
                if(!this.isSubmit){
                    return
                }
                this.oldList.forEach(ele => {
                    this.specslist.forEach(item=>{
                        if(ele.Id==item.Id&&(ele.SpecName!=item.SpecName||ele.OriginalPrice!=item.OriginalPrice||ele.PackingFee!=item.PackingFee)){
                            item.State=-2;
                        }
                    })
                });
                let info=this.specslist.concat(this.dealList);
                wx.setStorageSync('goodSpecs',info);
                wx.setStorageSync('dealSpec',this.dealList)
                this.msg('修改成功');
                setTimeout(function(){
                    wx.navigateBack({
                        delta: 1
                    })
                },300)
            }
        },
        computed: {
           isSubmit(){
                for(let i=0;i<this.specslist.length;i++){
                    if(this.specslist[i].SpecName==''||this.specslist[i].OriginalPrice===''||this.specslist[i].PackingFee===''){
                        return false
                    }
                }
                return true
            }  
        },
        components: {
           
        },
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
                margin-left: 36rpx;
                padding: 20rpx 0;
                box-sizing: border-box;
                position: relative;
                &::after{
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
                   
                    .placeholerStyle{
                        font-size: 28rpx;
                        color: #ccc;
                        line-height: 34rpx;
                    }
                    textarea{
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
                    }
                }
            }
        }
       .emitAdd{
           background: #fff;
           margin-bottom: 20rpx;
           display: flex;
            padding: 36rpx ;
            .label{
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
