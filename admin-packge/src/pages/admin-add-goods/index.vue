<template>
    <div class="admin_add_goods" :class="{on:isEmitImg}" v-if="block">
        <!-- 商品信息 -->
        <div v-if='!isEmitImg' style="height:100%;">
            <div class="wrap">
                <div class="bannerImg main">
                    <div class="option" @click="upLoadLogo">
                        <div class="label">商品主图</div>
                        <div class="goodsImg_state">
                            <img class="fade_in" lazy-load='true' :src="goodsInfo.GoodMasterPic?goodsInfo.GoodMasterPic+'?x-oss-process=image/resize,w_200/format,jpg':'https://otherfiles-ali.uupt.com/Stunner/FE/M/4243b565ad37411dbb481fb436472fe0_big.png'" alt="">
                            <div class="label" :class="'state'+goodsInfo.State" v-if='!isEmit'>{{goodsInfo.State==0?'在售':goodsInfo.State==1?'下架':'停售'}}</div>
                            <i class="icon icon_arrowRight" v-if='isEmit'></i>
                        </div>
                    </div>
                </div>
                <div class="main">
                    <div class="option">
                        <div class="label">商品名称</div>
                        <div class="item">
                            <input type="text" maxlength="15" placeholder-class='placeholerStyle' v-model="goodsInfo.GoodName" :disabled='!isEmit' placeholder="请输入商品名称15字以下">
                        </div>
                    </div>
                    <div class="option" @click="goLink(1)">
                        <div class="label">商品分类</div>
                        <div class="item">
                            <input type="text" placeholder-class='placeholerStyle' v-model="goodsTypeName" disabled placeholder="默认选中所创建的第一个分类">
                            <i class="icon icon_arrowRight" v-if='isEmit'></i>
                        </div>
                    </div>
                    <!-- 无规格时，默认规格 -->
                    <div class="option" v-if='newGoodSpecs.length==0'>
                        <div class="label">商品单价</div>
                        <div class="item">
                            <input type="digit" v-model="defaultSpec.OriginalPrice" placeholder-class='placeholerStyle' :disabled='!isEmit' placeholder="请输入单价" @input="price(defaultSpec.OriginalPrice)">
                            <span>元/件</span>
                        </div>
                    </div>
                    <div class="option" v-if='newGoodSpecs.length==0'>
                        <div class="label">打包费</div>
                        <div class="item">
                            <input type="digit" v-model="defaultSpec.PackingFee" placeholder-class='placeholerStyle' :disabled='!isEmit' placeholder="请输入打包费" @input="packing(defaultSpec.PackingFee)">
                            <span>元/件</span>
                        </div>
                    </div>
                    <div class="option" v-if='newGoodSpecs.length==0'>
                        <div class="label">库存</div>
                        <div class="item">
                            <input type="number" v-model="stockAmount" placeholder-class='placeholerStyle' maxlength="5" :disabled='!isEmit || defaultSpec.isStock' placeholder="请输入库存">
                            <div @click="clickStock" class="kc_btn" :class="{kc_active:defaultSpec.isStock}">库存无限量 <i></i></div>
                            <span>件</span>
                        </div>
                    </div>
                    <div class="option  info" v-for='(v,i) in newGoodSpecs' :key='i'>
                        <div class="label">规格{{i+1}}</div>
                        <div class="name">规格名称：{{v.SpecName}}</div>
                        <div class="name">商品单价：{{v.OriginalPrice}}元&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;打包费：{{v.PackingFee}}元/件&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;库存：{{v.stockMount}}件</div>
                    </div>
                    <div class="option" @click="goLink(2)">
                        <div class="label">商品规格</div>
                        <div class="item">
                            <input type="text" disabled placeholder-class='placeholerStyle' :placeholder="!isEmit?'':newGoodSpecs.length>0?'点击此处编辑规格':'需要多规格可点击编辑'">
                            <span v-if='newGoodSpecs.length>0'>{{newGoodSpecs.length}}种</span>
                            <i class="icon  icon_arrowRight" v-if='isEmit'></i>
                        </div>
                    </div>
                </div>
                <div class="main goodsImg">
                    <div class="option">
                        <div class="label">商品简介</div>
                        <div class="item">
                            <input type="text" placeholder-class='placeholerStyle' v-model="goodsInfo.GoodBrief" :disabled='!isEmit' maxlength="24" :placeholder="isEmit?'请输入商品简介24以下（选填）':'无'">
                            <!-- <textarea  type='text' placeholder-class='placeholerStyle' v-model="goodsInfo.GoodBrief" :disabled='!isEmit' auto-height='true' maxlength="24" :placeholder="isEmit?'请输入商品简介24以下（选填）':'无'"></textarea> -->
                        </div>
                    </div>
                    <div class="option noBor" @click='goEmitImg'>
                        <div class="label">介绍图片</div>
                        <div class="item">
                            <input type="text" disabled placeholder-class='placeholerStyle' :placeholder="!isEmit&&goodsInfo.GoodPics.length==0?'无':goodsInfo.GoodPics.length==0?'点击添加介绍图片（选填）':''">
                            <span v-if='goodsInfo.GoodPics.length>0'>{{goodsInfo.GoodPics.length}}张</span>
                            <i class="icon icon_arrowRight" v-if='isEmit'></i>
                        </div>
                    </div>
                    <div class="detailImg">
                        <img class="fade_in" v-for='(v,i) in goodsInfo.GoodPics' :key='i' :src="v.PicUrl+'?x-oss-process=image/resize,w_400/format,jpg'" lazy-load='true' alt="">
                    </div>
                </div>
            </div>
            <div class="handler" v-if='createBtn'>
                <div class="btn" :class="{on:isSubmit}" @click='submitGoodsInfo'>保存</div>
            </div>
            <div class="handler" v-if="editBtn">
                <div class="btn emit" @click="isEmit=true,createBtn=true,editBtn=false">
                    <i class="icon icon_btnEmit"></i>
                    <div class="text">修改</div>
                </div>
                <div class="btn state" @click="clickStateModal">
                    <i class="icon icon_btnState"></i>
                    <div class="text">上下架</div>
                </div>
                <div class="btn on share" @click='shareQR'>
                    <i class="icon icon_btnShare"></i>
                    <!-- <div  class="text">分享</div> -->
                </div>
            </div>
        </div>
        <!-- 编辑商品介绍图片 -->
        <div v-if='isEmitImg' style="height:100%;">
            <div class="wrap">
                <div class="main goodsImg">
                    <div class="option">
                        <div class="label">介绍图片</div>
                        <div class="item">
                            <input type="text" disabled placeholder-class='placeholerStyle' :placeholder="newGoodPics.length==0?'点击添加介绍图片（选填）':''">
                            <span v-if='newGoodPics.length>0'>{{newGoodPics.length}}张</span>
                        </div>
                    </div>
                    <ul class="emitImg">
                        <li v-for='(v,i) in newGoodPics' :key='i'>
                            <img :src="v.PicUrl+'?x-oss-process=image/resize,w_400/format,jpg'" alt="">
                            <div class="sort">
                                <span @click='dealImg(v,i)'><i class="icon icon_imgClear"></i>删除</span>
                                <span @click="sortUp(v,i)" v-if='i>0'><i class="icon icon_imgUp"></i>上移</span>
                                <span @click='sortDown(v,i)' v-if='i<(newGoodPics.length-1)'><i class="icon icon_imgDown"></i>下移</span>
                            </div>
                        </li>
                        <li @click='addImg' class="add"></li>
                    </ul>
                </div>
            </div>
            <div class="commodity_bottom">
                <div class="btn  on" @click='cancelEmit'>取消</div>
                <div class="btn" @click='emitImgBtn'>保存</div>
            </div>
        </div>
        <!-- 商品分享太阳码 -->
        <div class="saveImg" v-if='canvasMask'>
            <div class="main">
                <canvas canvas-id='myCanvas' style="background:#fff;width: 100%;height: 100%;"> 
                                                                                    <cover-view class="shareCover" >
                                                                                        <cover-image  @click='shareClose' class="icon icon_close" src="https://otherfiles-ali.uupt.com/Stunner/FE/M/8fa784b404314047a63e79dbb9c0ae87_big.png"/>
                                                                                        <cover-image @click='saveImg' class="saveBtn" src="https://otherfiles-ali.uupt.com/Stunner/FE/M/bbcb719243d44d9eb967cd169a57ff0d_big.png"/>
                                                                                    </cover-view>
                                                                                </canvas>
            </div>
        </div>
        <div v-if="stateModal">
            <div class="modalBg" @click="stateModal = false">
            </div>
            <div class="modalCont">
                <div class="modalCont_Tit">修改状态</div>
                <div class="modalCont_cont">
                    <div class="row" :class="{row1:index == 0}" v-for="(item,index) in stateList" :key="index" @click="stateSelect(index)">
                        <div class="rowItem">
                            <div class="audioBox">
                                <i class="icon icon_adminCheck" :class="{icon_adminChecked:stateIndex == index}"></i>
                            </div>
                            <div class="column1">
                                <p>{{item.name}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modalCont_btn">
                    <div class="modalCont_btn_cont">
                        <div class="modalCont_btn_cont_cancel" @click="stateModal = false,stateIndex=checkState">
                            稍后
                        </div>
                        <div class="modalCont_btn_cont_conf" :class="{btn_dis: stateIndex == null}" @click="confState">
                            确定
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="groupModal">
            <div class="modalBg" @click="groupModal=false">
            </div>
            <div class="modalCont modalCont_class">
                <div class="modalCont_Tit">选择分类</div>
                <div class="modalCont_cont modalCont_cont_class">
                    <div class="row" v-for="(item,index) in classList" :key="index" @click="selectIndex(index)">
                        <div class="rowItem">
                            <div class="audioBox">
                                <i class="icon icon_adminCheck" :class="{icon_adminChecked:(classListIndex ||0) == index}"></i>
                            </div>
                            <div class="column1">
                                <p>{{item.TypeName}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modalCont_btn">
                    <div class="modalCont_btn_cont">
                        <div class="modalCont_btn_cont_cancel" @click="groupModal=false">
                            稍后
                        </div>
                        <div class="modalCont_btn_cont_conf" :class="{btn_dis: classListIndex == null}" @click="okType">
                            确定
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        throttle
    } from '../../../src/utils/throttle';
    export default {
        data() {
            return {
                /* 分享方式弹窗 */
                isActive: false,
                /* 商品信息编辑状态 */
                isEmit: false,
                /* 状态模态框 */
                stateModal: false,
                /* 商品介绍图编辑状态 */
                isEmitImg: false,
                /* 状态 */
                stateIndex: null,
                stateList: [{
                        state: 1,
                        name: '上架'
                    },
                    {
                        state: 2,
                        name: '下架'
                    },
                    {
                        state: 3,
                        name: '停售'
                    }
                ],
                /* 绘制canvas所需信息 */
                info: {
                    ShopLogo: '',
                    ShopName: '',
                    GoodMasterPic: '',
                    QrCodeUrl: ''
                },
                /* 商品信息 */
                goodsInfo: {
                    GoodId: '',
                    GoodName: '',
                    /* 商品主图 */
                    GoodMasterPic: '',
                    /* 商品类型 */
                    GoodType: '',
                    /* 商品简介 */
                    GoodBrief: '',
                    /* 商品介绍图 */
                    GoodPics: [],
                    /* 商品规格 */
                    GoodSpecs: []
                },
                canvasMask: false, //分享图
                /* 商品分类名称 */
                goodsTypeName: '',
                /* 列表渲染的规格信息，未修改的，修改的，不包括删除的 */
                newGoodSpecs: [],
                /* 默认规格信息，（商品单价，打包费），newGoodSpecs为空时显示 */
                stockAmount: '无限',
                defaultSpec: {
                    Id: 0,
                    SpecName: '默认',
                    OriginalPrice: '',
                    SalesPrice: '',
                    PackingFee: 0,
                    State: -2,
                    isStock: true,
                    stockMount: 999999999
                },
                /* 列表渲染商品介绍图，未修改的，修改的，不包括删除的 */
                newGoodPics: [],
                /* 原始获取的商品介绍图，用于判断那些时修改的，添加标记 */
                oldGoodPics: [],
                /* 删除的商品介绍图 */
                dealGoodPics: [],
                /* 提交图片数组，包括未修改，修改，删除 */
                changeGoodsPics: [],
                isSpec: [],
                minShopLogo: '',
                //分类信息
                groupModal: false,
                classListIndex: null,
                classList: [],
                checkIndex: -1,
                checkState: -1,
                //添加开关
                addSubmit: false,
                createBtn: false,
                editBtn: false,
                block: false,
            }
        },
        onLoad() {
            this.block = false;
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            this.createBtn = false;
            this.editBtn = false;
            this.classListIndex = null;
            this.classList = [];
            this.checkIndex = -1;
            this.checkState = -1;
            this.groupModal = false;
            this.changeGoodsPics = [];
            this.isActive = false;
            this.oldGoodPics = [];
            this.isEmitImg = false;
            this.dealGoodPics = [];
            this.stockAmount = '无限';
            this.defaultSpec = {
                Id: 0,
                SpecName: '默认',
                OriginalPrice: '',
                SalesPrice: '',
                PackingFee: 0,
                State: -2,
                isStock: true,
                stockMount: 999999999
            };
            this.goodsInfo = {
                GoodId: 0,
                GoodName: '',
                /* 商品主图 */
                GoodMasterPic: '',
                /* 商品类型 */
                GoodType: '',
                /* 商品简介 */
                GoodBrief: '',
                /* 商品介绍图 */
                GoodPics: [],
                /* 商品规格 */
                GoodSpecs: []
            };
            this.shopId = wx.getStorageSync('loginInfo').ShopID || '';
            this.goodsInfo.GoodId = this.$mp.query.goodsId;
            this.info.ShopLogo = wx.getStorageSync('shopInfo').ShopLogo;
            this.info.ShopName = wx.getStorageSync('shopInfo').ShopName;
            this.getClass()
            /* goodid=0，是新建商品 */
            // 判断是否添加
            if (this.$mp.query.goodsId != 0) {
                wx.setNavigationBarTitle({
                    title: '商品详情'
                })
            }
            if (this.goodsInfo.GoodId == 0) {
                this.newGoodSpecs = [];
                this.goodsTypeName = '';
                /* 添加商品 */
                this.isEmit = true;
                this.createBtn = true;
                this.getClass();
            } else {
                /* goodid>0,编辑商品 */
                this.isEmit = false;
                this.editBtn = true;
                /* 查看商品 */
                this.getGoodsInfo();
            }
        },
        onShow() {
            //添加开关
            this.addSubmit = false;
            this.canvasMask = false;
            this.stateModal = false;
            this.groupModal = false;
            /* 获取规格信息--修改规格页存储 */
            if (wx.getStorageSync('goodSpecs')) {
                this.goodsInfo.GoodSpecs = wx.getStorageSync('goodSpecs');
                this.newGoodSpecs = this.goodsInfo.GoodSpecs.filter((item) => {
                    return item.State != -1;
                })
            }
            /* 获取商品分类--商品分类页存储 */
            if (wx.getStorageSync('goodsType')) {
                this.goodsInfo.GoodType = wx.getStorageSync('goodsType').TypeId;
                this.goodsTypeName = wx.getStorageSync('goodsType').TypeName;
            }
            if (wx.getStorageSync('cutImg1')) {
                this.goodsInfo.GoodMasterPic = wx.getStorageSync('cutImg1');
            }
            this.minShopLogo = ''
            this.isSpec = [];
            if (wx.getStorageSync('cutImg2')) {
                this.newGoodPics.push({
                    Id: 0,
                    PicUrl: wx.getStorageSync('cutImg2'),
                    Sort: 0,
                    State: -2
                })
            }
            this.getClass()
        },
        watch: {
            stockAmount(val) {
                // console.log(val)
                if (this.defaultSpec.isStock) {
                    this.defaultSpec.stockMount = 999999999;
                } else {
                    this.defaultSpec.stockMount = val;
                }
            }
        },
        methods: {
            //点击库存
            clickStock() {
                this.defaultSpec.isStock = !this.defaultSpec.isStock;
                if (this.defaultSpec.isStock) {
                    this.stockAmount = '无限'
                    this.defaultSpec.stockMount = 999999999;
                } else {
                    this.stockAmount = '';
                    this.defaultSpec.stockMount = '';
                }
                // console.log(this.defaultSpec)
            },
            /* 获取分类信息 */
            getClass() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/ShopGoodTypes',
                    data: {
                        ShopID: this.shopId
                    }
                }).then(res => {
                    this.block = true;
                    wx.hideLoading();
                    // res.Body = []; //测试
                    if (res.Body.length > 0) {
                        this.classList = res.Body;
                        /* 新建商品，默认选择第一项商品分类 */
                        if (this.goodsInfo.GoodId == 0) {
                            this.goodsInfo.GoodType = res.Body[0].TypeId;
                            this.goodsTypeName = res.Body[0].TypeName;
                            this.checkIndex = this.classListIndex = 0;
                            // console.log(this.classListIndex)
                        } else {
                            let n = this.classList.findIndex(e => e.TypeName == this.goodsTypeName);
                            // console.log(n, '商品分类索引')
                            this.checkIndex = this.classListIndex = n > -1 ? n : null;
                        }
                    }
                }).catch(err => {
                    wx.hideLoading();
                    this.msg(err.Msg)
                })
            },
            //状态选择
            clickStateModal() {
                if (this.stateList.length > 0) {
                    this.stateModal = true;
                    this.checkState = this.stateIndex;
                }
            },
            stateSelect(index) {
                this.stateIndex = index;
            },
            //选择分类
            selectIndex(index) {
                // console.log(index)
                this.classListIndex = index;
            },
            //确认分类
            okType() {
                this.checkIndex = this.classListIndex;
                this.groupModal = false;
                this.goodsInfo.GoodType = this.classList[this.classListIndex].TypeId;
                this.goodsTypeName = this.classList[this.classListIndex].TypeName;
            },
            confState() {
                let goodsId = [];
                goodsId.push(this.$mp.query.goodsId);
                if (this.stateIndex != null) {
                    this.util.post({
                        url: '/api/Merchant/Goods/ChangeGoodsState',
                        data: {
                            ShopId: this.shopId,
                            GoodIds: goodsId,
                            State: this.stateList[this.stateIndex].state
                        }
                    }).then(res => {
                        if (res.State == 1) {
                            this.stateModal = false;
                            this.msg('设置成功');
                            this.goodsInfo.State = this.stateIndex;
                        } else {
                            this.msg(res.Msg)
                        }
                    }).catch(err => {
                        this.msg(res.Msg)
                    })
                }
            },
            price(val) {
                let reg = /(^(\.{1,})|(([0-9]+)[.]([0-9]{3,}))|(([0-9]+)([.]{2,}))|(([.]([\d]+)){2,}))|(^(([0]{2,})|([0][1-9])))$/;
                let valStr = val.toString();
                if (reg.test(valStr)) {
                    this.msg('请输入合法金额');
                }
                let v = valStr.replace(reg, "");
                this.defaultSpec.OriginalPrice = v;
            },
            packing(val) {
                let reg = /(^(\.{1,})|(([0-9]+)[.]([0-9]{3,}))|(([0-9]+)([.]{2,}))|(([.]([\d]+)){2,}))|(^(([0]{2,})|([0][1-9])))$/;
                let valStr = val.toString();
                if (reg.test(valStr)) {
                    this.msg('请输入合法金额');
                }
                let v = valStr.replace(reg, "");
                this.defaultSpec.PackingFee = v;
            },
            /* 编辑商品介绍图 */
            goEmitImg() {
                this.changeGoodsPics = [];
                this.isEmitImg = this.isEmit;
                this.newGoodPics = JSON.parse(JSON.stringify(this.goodsInfo.GoodPics));
            },
            /* 取消编辑商品介绍图 */
            cancelEmit() {
                this.isEmitImg = false;
                this.dealGoodPics = [];
                this.changeGoodsPics = [];
            },
            /* 商品介绍图上移 */
            sortUp(v, i) {
                let deal = this.newGoodPics.splice(i, 1)[0];
                this.newGoodPics.splice(i - 1, 0, deal);
                /* state改变 */
            },
            /* 商品介绍图下移 */
            sortDown(v, i) {
                let deal = this.newGoodPics.splice(i, 1)[0];
                this.newGoodPics.splice(i + 1, 0, deal);
                /* state改变 */
            },
            /* 删除商品介绍图片*/
            dealImg(v, i) {
                this.newGoodPics.splice(i, 1);
                for (let i = 0; i < this.oldGoodPics.length; i++) {
                    if (v.Id == this.oldGoodPics[i].Id) {
                        this.dealGoodPics.push(Object.assign({}, v, {
                            State: -1
                        }));
                    }
                }
            },
            /* 上传商品介绍图片 */
            addImg() {
                const that = this;
                wx.navigateTo({
                    url: '/pages/upload-shop-img?type=2'
                });
            },
            /* 保存编辑的商品介绍图 */
            emitImgBtn() {
                this.goodsInfo.GoodPics = this.newGoodPics;
                this.goodsInfo.GoodPics.forEach((item, i) => {
                    item.Sort = i + 1;
                });
                this.changeGoodsPics = this.goodsInfo.GoodPics.concat(this.dealGoodPics);
                this.isEmitImg = false;
            },
            /* 上传店铺logo */
            upLoadLogo() {
                if (!this.isEmit) {
                    return
                }
                const that = this;
                wx.navigateTo({
                    url: '/pages/upload-shop-img?type=1'
                });
            },
            /* 获取商品信息 */
            getGoodsInfo() {
                // console.log(this.goodsInfo.GoodId, this.shopId)
                this.util.post({
                    url: '/api/Merchant/Goods/GoodDetail',
                    data: {
                        ShopId: this.shopId,
                        GoodId: this.goodsInfo.GoodId,
                    }
                }).then(res => {
                    // console.log(res)
                    if (res.State == 1) {
                        wx.hideLoading()
                        this.block = true;
                        this.goodsInfo = res.Body;
                        /* state：0，默认未修改 */
                        this.goodsInfo.GoodSpecs = res.Body.GoodSpecs.map((item, i) => item = Object.assign({}, item, {
                            State: 0
                        }));
                        //定义初始化库存数据  编辑规格使用
                        this.newGoodSpecs = this.goodsInfo.GoodSpecs;
                        this.newGoodSpecs.forEach(element => {
                            element.isInit = true;
                            element.isStock = false;
                            element.stockMount = element.ResidueCount;
                            if (Number(element.ResidueCount) > 99999) {
                                element.isStock = true;
                                element.stockMount = '无限';
                            }
                        })
                        this.goodsTypeName = this.goodsInfo.GoodTypeName;
                        this.oldGoodPics = res.Body.GoodPics;
                        this.goodsInfo.GoodPics = this.goodsInfo.GoodPics.map(item => item = Object.assign({}, item, {
                            State: 0
                        }));
                        //后续添加
                        this.goodsInfo.State--;
                        // console.log(this.goodsInfo.State,'状态')
                        this.checkState = this.stateIndex = this.goodsInfo.State;
                        this.getClass()
                    }
                }).catch(err => {
                    wx.hideLoading()
                    this.msg(err.Msg)
                })
            },
            /* 提交修改商品信息 */
            submitGoodsInfo() {
                //防止连续点击
                if (this.addSubmit) {
                    return;
                }
                this.addSubmit = true;
                if (!this.isSubmit) {
                    return
                }
                /* 修改图片数组，删除的，修改的 */
                for (let i = 0; i < this.oldGoodPics.length; i++) {
                    for (let j = 0; j < this.changeGoodsPics.length; j++) {
                        if (this.oldGoodPics[i].Id == this.changeGoodsPics[j].Id && this.oldGoodPics[i].Sort != this.changeGoodsPics[j].Sort) {
                            this.changeGoodsPics[j].State = -2;
                        }
                    }
                }
                this.changeGoodsPics = this.changeGoodsPics.filter(item => item.State != 0);
                /* 没有规格，插入填写的默认规格 */
                if (this.newGoodSpecs.length == 0 && this.isSpec.length == 0) {
                    /* this.isSpec.length==0，提交失败，再次点击提交，会重复插入数据 */
                    this.goodsInfo.GoodSpecs.push(this.defaultSpec)
                    this.isSpec.push(this.defaultSpec);
                }
                // console.log(this.defaultSpec)
                /* 过滤未修改的，未修改的不提交 */
                // this.goodsInfo.GoodSpecs=this.goodsInfo.GoodSpecs.filter(item=>item.State!=0);
                /* 商品售价=商品原价 */
                this.goodsInfo.GoodSpecs.forEach(item => {
                    // console.log(item)
                    item.SalesPrice = item.OriginalPrice;
                })
                let dataInfo = Object.assign({}, this.goodsInfo, {
                    ShopId: this.shopId
                });
                dataInfo.GoodPics = this.changeGoodsPics;
                //重构商品规格数组 
                let GoodSpecsArr = [];
                dataInfo.GoodSpecs.forEach(item => {
                    if (item.isInit) {
                        item.InitStock = item.InitStock;
                    } else {
                        if (item.isStock) {
                            item.InitStock = 999999999;
                        } else {
                            item.InitStock = item.stockMount;
                        }
                    }
                    GoodSpecsArr.push({
                        Id: item.Id,
                        SpecName: item.SpecName,
                        OriginalPrice: item.OriginalPrice,
                        PackingFee: item.PackingFee,
                        State: item.State,
                        InitStock: Number(item.InitStock)
                    })
                })
                dataInfo.GoodSpecs = GoodSpecsArr;
                // console.log(dataInfo)
                this.util.post({
                    url: '/api/Merchant/Goods/UpdateGoodInfo',
                    data: dataInfo
                }).then(res => {
                    if (res.State == 1) {
                        if (this.goodsInfo.GoodId == 0) {
                            this.msg('添加成功');
                        } else {
                            this.msg('修改成功');
                        }
                        wx.removeStorageSync('dealSpec');
                        if (this.$mp.query.type == '0') {
                            wx.redirectTo({
                                url: '/pages/admin-commodity-manage'
                            })
                        } else {
                            setTimeout(_ => {
                                this.addSubmit = false;
                                wx.navigateBack({
                                    delta: 1
                                });
                            }, 300)
                        }
                    } else {
                        this.msg(res.Msg);
                        this.addSubmit = false;
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                    this.addSubmit = false;
                })
            },
            /* 页面跳转 */
            goLink(type) {
                if (!this.isEmit) {
                    return
                };
                switch (type) {
                    case 1:
                        /* 选择商品分类 */
                        if (this.classList.length == 0) {
                            wx.navigateTo({
                                url: '/pages/admin-store-deploy?emit=1'
                            })
                        } else {
                            this.groupModal = true;
                            this.classListIndex = this.checkIndex;
                        }
                        break;
                    case 2:
                        /* 选择规格 */
                        wx.navigateTo({
                            url: '/pages/admin-emit-spec'
                        })
                        wx.setStorageSync('goodSpecs', this.newGoodSpecs);
                        break;
                }
            },
            shareQR() {
                this.util.post({
                    url: '/api/Merchant/Personal/CreateWxOpenQrCode',
                    data: {
                        CodeType: 1,
                        CodeValue: this.goodsInfo.GoodId,
                        RequestType: 2
                    }
                }).then(res => {
                    if (res.State == 1) {
                        this.info.QrCodeUrl = res.Body.QrCodeUrl;
                        this.requireImg().catch(err => {
                            this.msg('图片地址获取失败')
                        })
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            downImg(val) {
                return new Promise((resolve, reject) => {
                    if (val.indexOf('wxfile://') == -1) {
                        wx.downloadFile({
                            url: val,
                            success: res => {
                                resolve(res.tempFilePath)
                            },
                            fail: err => {
                                reject(err)
                            }
                        })
                    } else {
                        resolve(val)
                    }
                })
            },
            async requireImg() {
                wx.showLoading({
                    title: '生成中',
                    mask: true,
                })
                this.info.QrCodeUrl = await this.downImg(this.info.QrCodeUrl);
                this.info.GoodMasterPic = await this.downImg(`${this.goodsInfo.GoodMasterPic}?x-oss-process=image/resize,w_400/format,jpg`);
                // this.info.ShopLogo = await this.downImg(this.info.ShopLogo+'?x-oss-process=image/resize,h_100')
                this.minShopLogo = await this.downImg(this.info.ShopLogo + '?x-oss-process=image/resize,h_100');
                setTimeout(_ => {
                    this.drawCanvas();
                }, 0);
            },
            /* 绘制canvas */
            drawCanvas() {
                let pixelRatio = '';
                let windowWidth = '';
                let windowHeight = '';
                wx.getSystemInfo({
                    success: res => {
                        pixelRatio = res.pixelRatio;
                        windowWidth = res.windowWidth;
                        windowHeight = res.windowHeight;
                    }
                });
                // 默认像素比
                // 屏幕系数比，以设计稿375*667（iphone7）为例
                let XS = windowWidth / 375;
                const ctx = wx.createCanvasContext('myCanvas');
                ctx.setFillStyle('#fff')
                ctx.fillRect(0, 0, 339 * XS, 522 * XS)
                /* 店铺logo图片 */
                ctx.drawImage(this.minShopLogo, 15 * XS, 15 * XS, 21 * XS, 21 * XS)
                /* 店铺名称  */
                ctx.setFontSize(14 * XS);
                ctx.setFillStyle('#010101')
                ctx.fillText(this.info.ShopName, 43 * XS, 30 * XS)
                /* 商品图 */
                ctx.drawImage(this.info.GoodMasterPic, 15 * XS, 51 * XS, 309 * XS, 309 * XS)
                /* 商品名 */
                ctx.setFontSize(14 * XS);
                ctx.setFillStyle('#000')
                this.fontLineFeed(ctx, this.goodsInfo.GoodName, 18 * XS, 18 * XS, 15 * XS, 389 * XS)
                /* 商品描述 */
                ctx.setFontSize(12 * XS);
                ctx.setFillStyle('#777')
                this.fontLineFeed(ctx, this.goodsInfo.GoodBrief, 12 * XS, 18 * XS, 15 * XS, 415 * XS)
                /* 二维码 */
                ctx.drawImage(this.info.QrCodeUrl, 205 * XS, 376 * XS, 121 * XS, 124 * XS)
                /* 线 */
                ctx.setLineWidth(0.5)
                ctx.setStrokeStyle('#ebebeb')
                ctx.lineTo(182 * XS, 390 * XS)
                ctx.lineTo(182 * XS, 490 * XS)
                ctx.stroke();
                ctx.draw()
                wx.hideLoading()
                this.canvasMask = true;
            },
            shareClose() {
                this.canvasMask = false;
                wx.hideLoading();
            },
            // 文字换行
            /**
             * ctx,画布对象
             * str,需要绘制的文字
             * splitLen,切割的长度字符串
             * strHeight,每行文字之间的高度
             * x,位置
             * y
             */
            fontLineFeed(ctx, str, splitLen, strHeight, x, y) {
                var str = str.slice(0, 21);
                let strArr = [];
                for (let i = 0, len = str.length / splitLen; i < len; i++) {
                    strArr.push(str.substring(i * splitLen, i * splitLen + splitLen));
                }
                let s = 0;
                for (let j = 0, len = strArr.length; j < len; j++) {
                    s = s + strHeight;
                    ctx.fillText(strArr[j], x, y + s);
                }
            },
            /* 保存图片 */
            saveImg() {
                wx.canvasToTempFilePath({
                    canvasId: 'myCanvas',
                    success: res => {
                        wx.saveImageToPhotosAlbum({
                            filePath: res.tempFilePath,
                            success: result => {
                                wx.showToast({
                                    title: '图片保存成功',
                                    icon: 'success',
                                    duration: 800
                                })
                                this.canvasMask = false;
                            },
                            fail: err => {
                                // console.log(err, 'fail')
                                this.util.phModel();
                            }
                        })
                    }
                })
            },
        },
        computed: {
            isSubmit() {
                for (let prop in this.goodsInfo) {
                    if (this.goodsInfo[prop] === '' && prop != 'GoodBrief' && prop != 'GoodPics') {
                        return false
                    }
                    if (this.newGoodSpecs.length == 0 && (this.defaultSpec.OriginalPrice === '' || this.defaultSpec.PackingFee === '')) {
                        return false
                    }
                }
                return true
            },
        },
        onUnload() {
            wx.removeStorageSync('cutImg2');
        },
        components: {}
    }
</script>
<style lang="less">
    page {
        background: #eeeef4;
    }
    .admin_add_goods {
        background: #eeeef4;
        position: relative;
        height: 100%;
        overflow: hidden;
        .wrap {
            height: 100%;
            overflow-y: scroll;
            padding-bottom: 102rpx;
            box-sizing: border-box;
        }
        &.on {
            background: #fff;
            height: 100%;
            overflow-y: scroll;
        }
        .main {
            background: #fff;
            margin-bottom: 20rpx;
            .option {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-left: 36rpx;
                padding: 24rpx 0;
                box-sizing: border-box;
                position: relative;
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
                .label {
                    font-size: 28rpx;
                    line-height: 28rpx;
                    color: #1a1a1a;
                    width: 136rpx;
                }
                .goodsImg_state {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-right: 36rpx;
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
                        &.state0 {
                            background-image: linear-gradient(90deg, #38c439 0%, #4be009 100%);
                        }
                        &.state1 {
                            background-image: linear-gradient(90deg, #f47f19 0%, #f39716 100%), linear-gradient( #38c822, #38c822);
                        }
                        &.state2 {
                            color: #1a1a1a;
                            background-image: linear-gradient(90deg, #bebebe 0%, #b6b8bd 100%), linear-gradient( #38c822, #38c822);
                        }
                    }
                    img {
                        width: 160rpx;
                        height: 160rpx;
                        margin-right: 16rpx;
                    }
                }
                &.noBor {
                    &::after {
                        display: none;
                    }
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
                    .placeholerStyle {
                        font-size: 28rpx;
                        color: #ccc;
                        line-height: 34rpx;
                    }
                    textarea {
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
                    img {
                        width: 200rpx;
                        height: 200rpx;
                    }
                    .kc_btn {
                        width: 164rpx;
                        height: 48rpx;
                        border: solid 1px #cccccc;
                        font-size: 24rpx;
                        color: #999999;
                        text-align: center;
                        line-height: 48rpx;
                        margin-right: 22rpx;
                        position: relative;
                    }
                    .kc_active {
                        border: solid 1px #3c59ee;
                        font-family: PingFangSC-Regular;
                        font-size: 24rpx;
                        color: #3c59ee;
                        text-align: center;
                        line-height: 48rpx;
                        i {
                            position: absolute;
                            width: 0;
                            height: 0;
                            bottom: -20rpx;
                            right: -20rpx;
                            border-width: 20rpx;
                            border-style: solid;
                            border-color: transparent transparent transparent #3c59ee;
                            transform: rotate(45deg);
                        }
                    }
                }
                &.info {
                    display: block;
                    .label {
                        padding-left: 20rpx;
                        position: relative;
                        height: 28rpx;
                        &:after {
                            content: '';
                            display: block;
                            position: absolute;
                            left: 0;
                            top: 5rpx;
                            width: 3rpx;
                            height: 18rpx;
                            background: #f34b54;
                        }
                    }
                    .name {
                        font-size: 26rpx;
                        color: #555;
                        padding: 40rpx 0;
                        &:last-child {
                            padding: 0;
                        }
                    }
                }
            }
            &.bannerImg {
                .option {
                    align-items: flex-start;
                    .item {
                        justify-content: flex-end;
                        .icon {
                            margin-left: 28rpx;
                        }
                    }
                }
            }
            &.goodsImg {
                .option {
                    .item {
                        justify-content: flex-end;
                    }
                }
            }
            .detailImg {
                background: #fff;
                display: flex;
                flex-wrap: wrap;
                margin: 0 36rpx;
                padding: 10rpx 0;
                img {
                    width: 216rpx;
                    height: 216rpx;
                    margin-bottom: 15rpx;
                    margin-right: 15rpx;
                    &:nth-child(3n) {
                        margin-right: 0;
                    }
                }
            }
            ul.emitImg {
                padding: 10rpx 36rpx;
                li {
                    width: 678rpx;
                    height: 678rpx;
                    position: relative;
                    margin: 0 auto 36rpx;
                    &.add {
                        background-image: url('../../../static/bigUpImg.png');
                        background-position: center;
                        background-repeat: no-repeat;
                        background-size: 112rpx 98rpx;
                        background-color: #f5f5fa;
                    }
                    img {
                        width: 100%;
                        height: 100%;
                    }
                    .icon_dealImg {
                        position: absolute;
                        top: 24rpx;
                        right: 24rpx;
                        z-index: 10;
                    }
                    .sort {
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        z-index: 10;
                        height: 66rpx;
                        background: #fff;
                        border: 1px solid #ccc;
                        span {
                            display: inline-block;
                            width: 136rpx;
                            height: 66rpx;
                            font-size: 28rpx;
                            color: #444;
                            text-align: center;
                            line-height: 66rpx;
                            border-right: 1rpx solid #ccc;
                            &:last-child {
                                border: none;
                            }
                            .icon {
                                margin-right: 10rpx;
                                vertical-align: middle;
                            }
                        }
                    }
                }
            }
        }
        .handler {
            display: flex;
            justify-content: center;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #fff;
            padding: 16rpx 35rpx;
            border-top: 1rpx solid #ebebeb;
            z-index: 9999;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .btn {
                flex: 1;
                text-align: center;
                line-height: 72rpx;
                background: #ccc;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 72rpx;
                font-size: 28rpx;
                color: #fff;
                .icon_btnEmit {
                    width: 23rpx;
                    height: 30rpx;
                }
                .icon_btnShare {
                    width: 36rpx;
                    height: 30rpx;
                }
                .icon {
                    margin-right: 20rpx;
                    vertical-align: middle;
                }
                .text {
                    display: inline-block;
                    font-size: 28rpx;
                    color: #fff;
                }
                &.on {
                    background: #4b6df8;
                    flex: none;
                    width: 100%;
                }
                &.share {
                    background: #4b6df8;
                    flex: none;
                    width: 72rpx;
                    .icon {
                        margin-right: 0;
                    }
                }
                &.emit {
                    background: #fff;
                    color: #4b6df8;
                    border: 1px solid #4b6df8;
                    flex: none;
                    width: 279rpx;
                    .text {
                        color: #4b6df8;
                    }
                }
                &.state {
                    background: #fff;
                    color: #4b6df8;
                    border: 1px solid #4b6df8;
                    flex: none;
                    width: 279rpx;
                    .text {
                        color: #4b6df8;
                    }
                }
            }
        }
        .commodity_bottom {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 20;
            border-top: 1rpx solid #ebebeb;
            padding: 20rpx 36rpx;
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
                    border: 1px solid #0863ee;
                }
            }
        }
        .saveImg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7); // padding: 10rpx 36rpx 140rpx;
            box-sizing: border-box;
            z-index: 99999;
            .shareCover {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            .main {
                position: relative;
            }
            .icon_close {
                position: absolute;
                top: 25rpx;
                right: 25rpx;
                z-index: 100;
                background: none;
            }
            .saveBtn {
                position: absolute;
                top: 933rpx;
                left: 26rpx;
                width: 290rpx;
                height: 73rpx;
                z-index: 100;
            }
            .main {
                border-radius: 10rpx;
                background: #fff; // height: 100%;
                border-radius: 10rpx;
                width: 339px;
                height: 522px;
                overflow: hidden;
                position: fixed;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                margin: auto;
            }
        }
        .modalBg {
            width: 100%;
            height: 100%;
            background: #000;
            opacity: 0.6;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 99999;
        }
        .modalCont {
            position: absolute;
            z-index: 999999;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            width: 562rpx;
            height: 490rpx;
            border-radius: 18rpx;
            padding-top: 30rpx;
            padding-bottom: 30rpx;
            background: #fff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .modalCont_Tit {
                // height: 50rpx;
                line-height: 80rpx;
                text-align: center;
                font-family: PingFangSC-Medium;
                font-size: 35rpx;
                font-weight: normal;
                font-stretch: normal;
                letter-spacing: 0px;
                color: #333333;
                padding-left: 28rpx;
                padding-right: 28rpx;
            }
            .modalCont_head {
                font-size: 30rpx;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                padding-top: 40rpx;
                padding-bottom: 30rpx;
                padding-left: 28rpx;
                padding-right: 28rpx;
                .audioBox {
                    flex: 0.3;
                    text-align: center;
                }
                .column1 {
                    flex: 1;
                    text-align: center;
                    font-family: PingFangSC-Regular;
                    font-size: 26rpx;
                    font-weight: normal;
                    font-stretch: normal;
                    letter-spacing: 0px;
                    color: #999999;
                }
                .column2 {
                    flex: 1;
                    text-align: center;
                    font-family: PingFangSC-Regular;
                    font-size: 26rpx;
                    font-weight: normal;
                    font-stretch: normal;
                    letter-spacing: 0px;
                    color: #999999;
                }
                .column3 {
                    flex: 1;
                    text-align: center;
                    font-family: PingFangSC-Regular;
                    font-size: 26rpx;
                    font-weight: normal;
                    font-stretch: normal;
                    letter-spacing: 0px;
                    color: #999999;
                }
            }
            .modalCont_cont {
                height: 300rpx;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                padding-left: 28rpx;
                padding-right: 28rpx;
                .row {
                    // font-size: 26rpx;
                    width: 100%;
                    height: 100rpx;
                    line-height: 100rpx;
                    width: 100%;
                    font-size: 26rpx;
                    color: #1a1a1a;
                    position: relative;
                    &::after {
                        content: '';
                        display: block;
                        width: 100%;
                        height: 0;
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        border-bottom: 1PX solid #ebebeb;
                        transform: scaleY(0.5);
                        transform-origin: 0 0;
                    }
                    .rowItem {
                        width: 100%;
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        position: relative;
                        .audioBox {
                            position: absolute;
                            width: 100rpx;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100rpx;
                        }
                        .column1 {
                            flex: 1;
                            text-align: left;
                            display: flex;
                            flex-direction: row;
                            justify-content: flex-start;
                            text-align: center;
                            p {
                                width: 100%;
                                text-align: center;
                            }
                        }
                        .column2 {
                            flex: 1;
                            text-align: center;
                            p {
                                width: 100%;
                                text-align: center;
                            }
                        }
                        .column3 {
                            flex: 1;
                            text-align: center;
                            p {
                                width: 100%;
                                text-align: center;
                            }
                        }
                        div {
                            font-family: PingFangSC-Regular;
                            font-size: 24rpx;
                            font-weight: normal;
                            font-stretch: normal;
                            letter-spacing: 0px;
                            color: #1a1a1a;
                        }
                    }
                }
            }
            .modalCont_cont_class {
                height: 500rpx;
            }
            .modalCont_btn {
                overflow: hidden;
                padding-left: 30rpx;
                padding-right: 30rpx;
                .modalCont_btn_cont {
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    font-size: 26rpx;
                    margin-top: 30rpx;
                    .modalCont_btn_cont_cancel {
                        text-align: center;
                        width: 245rpx;
                        height: 72rpx;
                        border: 1px solid #3c59ee;
                        font-family: PingFangSC-Regular;
                        font-size: 26rpx;
                        font-weight: normal;
                        font-stretch: normal;
                        line-height: 72rpx;
                        letter-spacing: 0px;
                        color: #3c59ee;
                    }
                    .modalCont_btn_cont_conf {
                        text-align: center;
                        color: #0863ee;
                        width: 245rpx;
                        height: 72rpx;
                        background-color: #3c59ee;
                        font-family: PingFangSC-Regular;
                        font-size: 26rpx;
                        font-weight: normal;
                        font-stretch: normal;
                        line-height: 72rpx;
                        letter-spacing: 0px;
                        color: #ffffff;
                        border: 1px solid #3c59ee;
                        margin-left: 24rpx;
                    }
                    .btn_dis {
                        border: 1px solid #cccccc;
                        background: #cccccc;
                    }
                }
            }
        }
        .modalCont_class {
            height: 680rpx;
            .modalCont_btn {
                position: relative;
                &::after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-top: 1PX solid #ebebeb;
                    position: absolute;
                    top: 0;
                    left: 0;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                }
            }
        }
    }
</style>
