<template>
    <div class="wrap">
        <div class="admin_store_deployother" v-if="!emit">
            <div class="title">商铺宣传图</div>
            <div class="banner" @click="upShopImg">
                <img :src="shopImg" alt="">
                <p>点击上传商铺宣传图片</p>
            </div>
            <div class="title">商品分类图</div>
            <ul>
                <li v-for="(v,i) in list" :key='i' @click='emitGoods' :data-info='v'>
                    <div class="img">
                        <img :src="v.TypeImage" alt="">
                    </div>
                    <p>{{v.TypeName}}</p>
                </li>
                <li @click='emitGoods' data-info='' v-if='(list.length<8&&isHanlder)'>
                    <div class="img">
                    </div>
                </li>
            </ul>
            <!-- <div class="handler" v-if='isHanlder'>
                <div class="btn" @click="setInfo">保存</div>
            </div> -->
            <cover-view  class="handler" v-if='isHanlder'>
                <cover-view  class="btn" @click="setInfo">保存</cover-view>
            </cover-view>
        </div>
        <div class="admin_goods_deployother" v-if='emit'>
            <div class="top">
                <div class="title">商品分类图</div>
                <div class="img" @click="upLoadLogo">
                    <img :src="nowInfo.TypeImage" alt="">
                </div>
                <div class="option">
                    <div class="label">分类名称</div>
                    <input type="text" maxlength="8" placeholder-class='placeholderStyle' v-model="nowInfo.TypeName" placeholder="请输入分类名称">
                </div>
            </div>
            <!-- <div class="handler">
                <div class="btn" @click='setp'>保存</div>
            </div> -->
            <cover-view  class="handler">
                <cover-view  class="btn" @click='setp'>保存</cover-view>
            </cover-view>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isHanlder:false,/* 是否可编辑，0查看选择，1编辑 */
                emit: false,/* 下一步，修改商品分类 */
                shopId: '',
                shopImg:'',
                list: [],
                nowInfo: {},
                oldList:[]
            };
        },
        onShow() {
            
            if(wx.getStorageSync('cutImg1')){
                this.nowInfo.TypeImage = wx.getStorageSync('cutImg1');
            }
            
        },
        mounted() {
            this.emit=false;
            this.shopId = wx.getStorageSync('loginInfo').ShopID || '';
            this.isHanlder=this.$mp.query.emit==1?true:false;/* 0查看选择，1编辑 */
            
            this.getInfo();
            this.getShopInfo();
        },
        methods: {
            /* 点击商品分类 */
            emitGoods(e) {
                // if(this.list.length==0){
                //     this.isHanlder=true;
                // }
                /* 选择分类 */
                if(!this.isHanlder){
                    wx.setStorageSync('goodsType', e.currentTarget.dataset.info);
                    wx.navigateBack({
                        delta: 1
                    });
                    return
                }
                /* 编辑分类 */
                this.emit = true;
                if (typeof(e.currentTarget.dataset.info) == 'boolean') {
                    this.nowInfo = {
                        TypeId: 0,
                        TypeName: '',
                        TypeImage: '',
                        Note: '',
                    }
                } else {
                    this.nowInfo = e.currentTarget.dataset.info;
                }
            },
            /* 获取分类信息 */
            getInfo() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/ShopGoodTypes',
                    data: {
                        ShopID: this.shopId
                    }
                }).then(res => {
                    if (res.State == 1) {
                        this.list = res.Body;
                        this.oldList=JSON.parse(JSON.stringify(res.Body));
                        if(this.list.length==0){
                            this.isHanlder=true;
                        }
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            /* 获取店铺宣传图 */
            getShopInfo(){
                this.util.post({
                    url: '/api/Merchant/ShopManage/GetPublicityPic',
                    data: {
                        ShopID: this.shopId
                    }
                }).then(res => {
                    this.shopImg=res.Body.PublicityPic;
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            /* 提交设置信息 */
            setInfo() {
                let dataList = [];
                for (let i = 0; i < this.list.length; i++) {
                    dataList.push({
                        TypeID: this.list[i].TypeId,
                        TypeName: this.list[i].TypeName,
                        TypeImage: this.list[i].TypeImage,
                        TypeNote: this.list[i].Note,
                        PatentID: 0,
                    })
                }
                /* 店铺宣传图 */
                this.setShopImg();
                let obj='';
                let fil=[];
                this.oldList.forEach(ele=>{
                     obj=dataList.filter(item=>
                         (item.TypeID==ele.TypeId&&(item.TypeName!=ele.TypeName||item.TypeImage!=ele.TypeImage))
                    )
                    if(obj.length>0){
                        fil.push(obj[0])
                    }
                })
                let arr=dataList.filter(item=>item.TypeID==0);
                fil.push(...arr);
                /* 商品分类信息 */
                this.util.post({
                    url: '/api/Merchant/ShopManage/UpdateGoodType',
                    data: {
                        ShopID: this.shopId,
                        GoodsTypeList: fil
                    }
                }).then(res => {
                    this.msg('修改成功');
                    setTimeout(function(){
                        wx.navigateBack({
                            delta: 1
                        })
                    },300)
                    
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            /* 设置店铺宣传图 */
            setShopImg(){
                if(this.shopImg==''){
                    this.msg('请选择店铺宣传图');
                    return
                }
                 this.util.post({
                    url: '/api/Merchant/ShopManage/EditPublicityPic',
                    data: {
                        ShopID: this.shopId,
                        PublicityPic: this.shopImg
                    }
                }).then(res => {
                    if (res.State == 1) {
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            /* 商品分类图 */
            upLoadLogo() {
                if(!this.isHanlder){return}
                const that = this;
                wx.navigateTo({ url: '/pagesUser/upload-shop-img?type=1' });
            },
            /* 店铺宣传图 */
            upShopImg(){
                if(!this.isHanlder){return}
                const that = this;
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], 
                    sourceType: ['album', 'camera'], 
                    success: (res)=> {
                        wx.uploadFile({
                            url: this.util.baseUrl+'/api/Merchant/File/ImageUpload', //仅为示例，非真实的接口地址
                            filePath: res.tempFilePaths[0],
                            name: 'ImageFile',
                            formData:{
                                'ImageType': 2
                            },
                            success: function(res){
                                var tempFilePaths = JSON.parse(res.data).Body.ImageUrl;
                                that.shopImg = tempFilePaths;
                            },
                            fail(res){
                                console.log(res,'fail')
                            }
                        })
                    }
                })
            },
            /* 修改商品分类，保存按钮，返回到上一步 */
            setp() {
                if (this.nowInfo.TypeName == '' || this.nowInfo.TypeImage == '') {
                    this.msg('请完善信息');
                    return;
                }
                this.emit = false;
                for (let i = 0; i < this.list.length; i++) {
                    if (this.list[i].TypeId == this.nowInfo.TypeId&&this.nowInfo.TypeId!=0) {
                        this.list[i] = this.nowInfo;
                        return
                    }
                }
                this.list.push(this.nowInfo);
            }
        },
        components: {}
    };
</script>

<style lang="less">
    .wrap {
        height: 100%;
    }
    .admin_store_deployother {
        height: 100%;
        background: #fff;
        position: relative;
        overflow-x: hidden;
        overflow-y: scroll;
        padding-bottom: 120rpx;
        box-sizing: border-box;
        .title {
            font-size: 32rpx;
            color: #1d1d1d;
            border-top: 1rpx solid #ebebeb;
            line-height: 102rpx;
            padding: 0 36rpx;
            font-weight: 900;
            &:first-child {
                border: none;
            }
        }
        .banner {
            position: relative;
            margin: 0 auto 36rpx;
            background: #f5f5fa;
            width: 678rpx;
            height: 380rpx;
            background-color: #f5f5fa;
            background-image: url("../../../static/bigUpImg.png");
            background-position: center 108rpx;
            background-repeat: no-repeat;
            background-size: 112rpx 98rpx;
            border-radius: 10rpx;
            overflow: hidden;
            p {
                text-align: center;
                font-size: 24rpx;
                color: #cecee0;
                position: absolute;
                top: 237rpx;
                left: 0;
                width: 100%;
                z-index: 1;
            }
            img {
                width: 100%;
                height: 100%;
                position: relative;
                z-index: 10;
            }
        }
        ul {
            padding: 0 36rpx;
            display: flex;
            flex-wrap: wrap;
            li {
                margin-right: 13rpx;
                &:nth-child(4n+4){
                    margin-right: 0;
                }
                .img {
                    width: 160rpx;
                    height: 160rpx;
                    border-radius: 10rpx;
                    background-color: #f5f5fa;
                    background-image: url("../../../static/smallUpImg.png");
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: 56rpx 49rpx;
                    overflow: hidden;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                p {
                    font-size: 24rpx;
                    color: #000;
                    line-height: 50rpx;
                    text-align: center;
                }
            }
        }
        .handler {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 16rpx 0;
            background: #fff;
            .btn {
                margin: 0 36rpx;
                background: #0863ee;
                text-align: center;
                line-height: 88rpx;
                height: 88rpx;
                font-size: 28rpx;
                color: #fff;
            }
        }
    }
    .admin_goods_deployother {
        height: 100%;
        background: #eeeef4;
        position: relative;
        overflow-x: hidden;
        overflow-y: scroll;
        padding-bottom: 120rpx;
        box-sizing: border-box;
        .top {
            background: #fff;
        }
        .title {
            font-size: 32rpx;
            color: #1d1d1d;
            border-top: 1rpx solid #ebebeb;
            line-height: 102rpx;
            padding: 0 36rpx;
            font-weight: 900;
            &:first-child {
                border: none;
            }
        }
        .img {
            width: 160rpx;
            height: 160rpx;
            border-radius: 10rpx;
            background-color: #f5f5fa;
            background-image: url('../../../static/smallUpImg.png');
            background-position: center;
            background-repeat: no-repeat;
            background-size: 56rpx 49rpx;
            overflow: hidden;
            margin: 0 36rpx 36rpx;
           
            img {
                width: 100%;
                height: 100%;
            }
        }
        .option {
            display: flex;
            align-items: center;
            background: #fff;
            padding: 0 36rpx;
            height: 110rpx;
            border-top: 1rpx solid #ebebeb;
            .label {
                font-size: 28rpx;
                color: #1a1a1a;
                line-height: 36rpx;
                width: 134rpx;
            }
            input {
                flex: 1;
                font-size: 28rpx;
                color: #1a1a1a;
                line-height: 36rpx;
            }
            .placeholderStyle {
                font-size: 28rpx;
                color: #ccc;
                line-height: 36rpx;
            }
        }
        .handler {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 16rpx 0;
            background: #eeeef4;
            .btn {
                margin: 0 36rpx;
                background: #0863ee;
                text-align: center;
                line-height: 88rpx;
                height: 88rpx;
                font-size: 28rpx;
                color: #fff;
            }
        }
    }
</style>
