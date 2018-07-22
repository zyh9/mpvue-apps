<template>
    <div class="admin_store_templet">
        <ul class="templet_top">
            <li v-for="(v,i) in BusinessType" :key="i" @click='templateId=v.ID' v-if="v.ID==1">
                <img :src="v.ID==1?'https://otherfiles-ali.uupt.com/Stunner/FE/M/e59cd825e16f4a728ea6e17e7c9335ed_big.png':'https://otherfiles-ali.uupt.com/Stunner/FE/M/d956117ac1a542d3a31eccb7852e19a6_big.png'" alt="">
                <div class="text"><i class="icon icon_adminCheck" :class="{icon_adminChecked:templateId==v.ID}"></i>{{v.BusinessType}}</div>
            </li>
        </ul>
        <cover-view  class="hander">
            <cover-view class="btn" @click='changeTemplate'>保存</cover-view>
        </cover-view>
        
    </div>
</template>

<script>
    export default {
        data() {
            return {
                BusinessType:[
                    {
                        ID:1,
                        BusinessType:'',
                        Sort:''
                    }
                ],
                templateId: 1 /* 1：餐饮；2：电商 */
            }
        },
        mounted () {
            this.templateId=wx.getStorageSync('shopInfo').ShopViewTemplate;
          this.GetBusinessType();  
        },
        methods: {
             /* 获取店铺类型 */
            GetBusinessType() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/GetBusinessTypeDic',
                    data: {}
                }).then(res => {
                    if (res.State == 1) {
                        this.BusinessType = res.Body;
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            changeTemplate() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/ChangeViewTemplate',
                    data: {
                        ShopID: wx.getStorageSync('loginInfo').ShopID || '',
                        TemplateID: this.templateId
                    }
                }).then(res => {
                    if (res.State == 1) {
                        let shopInfo=wx.getStorageSync('shopInfo');
                        shopInfo.ShopViewTemplate=this.templateId;
                        wx.setStorageSync('shopInfo',shopInfo);
                        this.msg('修改成功');
                        setTimeout(function(){
                            wx.navigateBack({
                                delta: 1
                            })
                        },300)
                        
                    }
                }).catch(err => {
                    console.log(err)
                    this.msg(err.Msg)
                })
            }
        },
        components: {}
    }
</script>

<style lang="less">
page{
    background: #eeeef4;
}
    .admin_store_templet {
        height: 100%;
        background: #eeeef4;
        position: relative;
        overflow-x: hidden;
        padding: 35rpx 35rpx 0;
        box-sizing: border-box;
        .templet_top {
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: space-between;
            li {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: #fff;
                padding: 15rpx 15rpx 0;
                img {
                    width: 298rpx;
                    height: 493rpx;
                }
                .text {
                    height: 110rpx;
                    text-align: center;
                    font-size: 28rpx;
                    color: #1a1a1a;
                    line-height: 110rpx;
                    .icon {
                        vertical-align: middle;
                        margin-right: 19rpx;
                    }
                }
            }
        }
        .hander{
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 118rpx;
            background: #fff;
            border-top: 1rpx solid #ebebeb;
            .btn{
                margin:19rpx 36rpx;
                height:80rpx;
                background-color: #0863ee;
                text-align: center;
                color: #fff;
                line-height: 80rpx;
                font-size: 28rpx;
            }
        }
    }
</style>
