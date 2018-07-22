<template>
    <div class="admin-commodity-manage">
        <div class="searchBox set-flex set-align " @click="searchTo">
            <div class="item set-flex set-grow set-align">
                <i class="icon icon_search"></i>
                <span>在这里搜索你的商品</span>
                <!-- <input type="text" disabled="true" class="set-grow" placeholder="在这里搜索你的商品"> -->
                <!-- <i class="icon icon_del"></i> -->
            </div>
            <!-- <span class="gosearch">搜索</span> -->
        </div>
        <div class="admin-commodity-manage_list_class">
            <scroll-view scroll-y="true" class="admin-commodity-manage_list_class_cont">
                <div class="admin-commodity-manage_list_class_item" :class="{item_active:(classIndex||0)==index}" v-for="(item,index) in classList" :key="index" @click="clickClass(item,index)">
                    {{item.TypeName}}
                </div>
            </scroll-view>
            <div class="admin-commodity-manage_list_class_bottom" @click="toClass">
                <i class="icon icon_menu"></i>
                <p>分类管理</p>
            </div>
        </div>
        <scroll-view scroll-y="true" class="scroll_view fade_in" :style="{width:winWidth+'px'}" v-if="block">
            <div v-for="(v,i) in shopListSum" :key="i" v-if="v.list.length">
                <div class="list_top" @click="rotate(v)">
                    <p>{{v.state}}<span>(共计{{v.list.length}}件商品)</span></p>
                    <div class="black" :class="{black_rotate:!v.onoff}"><i class="icon icon_right_black"></i></div>
                </div>
                <ul class="admin-commodity-manage_list" :style="{height:v.onoff?lisHeight*v.list.length+'px':0}">
                    <li v-for='(item,index) in v.list' :key='index' :data-item='item' :data-goodid='item.GoodId' @click='selectGoods(item,index,i)' class="sumLis">
                        <i class="icon icon_adminCheck" :class="{icon_adminChecked:item.checked}" v-if='handler || flag'></i>
                        <div class="goodsImg"><img :src="item.MasterPic+'?x-oss-process=image/resize,h_100'" alt="">
                            <div class="label" :class="'state'+item.State">{{item.State==1?'在售':item.State==2?'下架':'停售'}}</div>
                        </div>
                        <div class="item">
                            <div class="name">{{item.GoodName}}</div>
                            <div class="info">
                                <div class="price" v-if='item.MultiSpec<=1'><span>&yen;</span>{{item.OriginalPrice}}</div>
                                <div class="price" v-if='item.MultiSpec>1'><span>&yen;</span>{{item.OriginalPrice}}起</div>
                                <div class="num">({{item.MultiSpec}}个规格)</div>
                                <!-- <div class="goDetail" v-if='item.MultiSpec>1'>查看详情<i class="icon icon_arrowSpec"></i></div> -->
                            </div>
                            <!-- <div class="specs"><span>{{item.GoodType}}</span></div> -->
                            <div class="specs" v-if="item.MultiSpec == 1" @click.stop="clickStock(item.GoodId)"><span>{{item.MinSpecGoodsStock > 99999 ? '库存无限' : '库存'+item.MinSpecGoodsStock}}</span><i class="icon icon_arrowSpec"></i></div>
                            <div class="specs" v-else @click.stop="clickStock(item.GoodId)"><span>{{item.MinSpecGoodsStock > 99999 ? '库存无限' : '库存'+item.MinSpecGoodsStock+'起'}}</span><i class="icon icon_arrowSpec"></i></div>
                        </div>
                    </li>
                </ul>
                <div v-if="v.onoff" class="item_bottom_b"></div>
            </div>
            <p class="nodata" v-if="classFlag">暂无商品信息</p>
            <!-- <div class="nodata" v-if="classFlag">
                                    <i class="icon icon_home"></i>
                                    <p>快去添加商品和分类吧</p>
                                </div> -->
        </scroll-view>
        <div v-if="!flag">
            <div class="commodity_bottom " v-if='handler' :class="{commodity_bottom_active:handler}">
                <div class="itemBtn" @click='submitEmit(1)'>
                    <i class="icon icon_btnState"></i>
                    <p>上下架</p>
                </div>
                <div class="itemBtn" @click='submitEmit(2)'>
                    <i class="icon icon_classed"></i>
                    <p>改分类</p>
                </div>
                <div class="btn btnSmall cancel" @click='cancelSelect'>
                    <i class="icon icon_close_shop"></i>
                    <p>取消</p>
                </div>
                <!-- <div class="btn btnSmall" @click='submitEmit'>保存</div> -->
            </div>
            <div class="commodity_bottom" v-else>
                <div class="btn  on" @click="batch">批量操作</div>
                <div class="btn" @click='emitGoods(0)'>添加商品</div>
            </div>
        </div>
        <div v-else>
            <div class="commodity_bottom" :class="{commodity_bottom_l:flag}">
                <div v-if="goodsList.length == 0" class="btn_next" @click="emitGoods(0)">添加商品</div>
                <div v-else class="btn_next" :class="{btn_dis: !nextDis || goodsList.length == 0}" @click="next">下一步</div>
            </div>
        </div>
        <div v-if="modal && flag">
            <div class="modalBg" @click="cancel">
            </div>
            <div class="modalCont modalCont_rule">
                <div class="modalCont_Tit">规格选择</div>
                <div class="modalCont_head">
                    <div class="audioBox"></div>
                    <div class="column1">规格名称</div>
                    <div class="column2">商品原价</div>
                    <div class="column3">打包费</div>
                </div>
                <div class="modalCont_cont modalCont_cont_spec">
                    <div class="row" v-for="(item,index) in specList" :key="index" @click="specSelect(index)">
                        <div class="rowItem">
                            <div class="audioBox">
                                <i class="icon icon_adminCheck" :class="{icon_adminChecked:specListIndex == index}"></i>
                            </div>
                            <div class="modalCont_head"></div>
                            <div class="column1">
                                <p>{{item.SpecName}}</p>
                            </div>
                            <div class="column2">
                                <p>￥{{item.OriginalPrice}}</p>
                            </div>
                            <div class="column3">
                                <p>￥{{item.PackingFee}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modalCont_btn modalCont_btn_spec">
                    <div class="modalCont_btn_cont">
                        <div class="modalCont_btn_cont_cancel" @click="cancel">
                            取消
                        </div>
                        <div class="modalCont_btn_cont_conf" :class="{btn_dis: specListIndex == null}" @click="conf">
                            确定
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="groupModal && !flag">
            <div class="modalBg" @click="cancelGroup">
            </div>
            <div class="modalCont modalCont_class">
                <div class="modalCont_Tit">选择分类</div>
                <div class="modalCont_cont modalCont_cont_class">
                    <div class="row" v-for="(item,index) in classList" :key="index" @click="modifySelect(index)">
                        <div class="rowItem">
                            <div class="audioBox">
                                <i class="icon icon_adminCheck" :class="{icon_adminChecked:classListIndex == index}"></i>
                            </div>
                            <div class="column1">
                                <p>{{item.TypeName}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modalCont_btn modalCont_btn_border">
                    <div class="modalCont_btn_cont">
                        <div class="modalCont_btn_cont_cancel" @click="cancelGroup">
                            稍后
                        </div>
                        <div class="modalCont_btn_cont_conf" :class="{btn_dis: classListIndex == null}" @click="confGroup">
                            确定
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="stateModal">
            <div class="modalBg" @click="cancelState">
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
                        <div class="modalCont_btn_cont_cancel" @click="cancelState">
                            稍后
                        </div>
                        <div class="modalCont_btn_cont_conf" :class="{btn_dis: stateIndex == null}" @click="confState">
                            确定
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                classFlag: false, //判断分类列表和商品列表为空
                //入口判断
                flag: false, //判断是否从折扣进入
                create: false, //创建进
                modal: false, //模态框 （创建、编辑）
                groupModal: false,
                nextDis: false, //下一步按钮状态
                specListIndex: null, //选择的规格索引 （创建、编辑）
                specList: [], //规格列表 （创建、编辑）
                specCont: {},
                goodsItem: null, //选择的一条商品数据 （创建、编辑）
                goodType: null,
                goodsList: [],
                classListIndex: null,
                classList: [],
                classIndex: 0,
                winWidth: 0,
                winHeight: 0,
                // tab切换  
                currentTab: 0,
                botHeight: 0,
                handler: false,
                goodsIdArr: [],
                emitType: null,
                /* 1:上架；2下架；3：停售 */
                shopId: '',
                page: 1,
                pageSize: 9999,
                isOver: false,
                GoodState: 0,
                //上下架模态框
                stateModal: false,
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
                shopListSum: [{
                    onoff: true,
                    list: [],
                    state: '上架'
                }, {
                    onoff: true,
                    list: [],
                    state: '下架'
                }, {
                    onoff: true,
                    list: [],
                    state: '停售'
                }],
                //单个li的高度
                lisHeight: 0,
                block: false,
            }
        },
        onLoad() {
            this.groupModal = false;
            this.stateModal = false;
            wx.removeStorageSync('classIndex');
        },
        onShow() { //页面渲染就会触发
            this.block = false;
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            this.shopId = wx.getStorageSync('loginInfo').ShopID || '';
            this.goodsIdArr = [];
            // this.classList = [];
            this.goodsList = [];
            this.shopListSum = [{
                onoff: true,
                list: [],
                state: '上架'
            }, {
                onoff: true,
                list: [],
                state: '下架'
            }, {
                onoff: true,
                list: [],
                state: '停售'
            }];
            this.GoodState = 0;
            this.page = 1;
            this.isOver = false;
            this.groupModal = false;
            this.stateModal = false;
            this.getClass();
            let query = wx.createSelectorQuery();
            query.select('.admin-commodity-manage_list_class').boundingClientRect();
            query.exec(res => {
                let width = res[0].width;
                wx.getSystemInfo({
                    success: res => {
                        this.winWidth = res.windowWidth - width;
                    }
                })
            })
            wx.removeStorageSync('goodSpecs');
            wx.removeStorageSync('dealSpec');
            wx.removeStorageSync('goodsType');
            if (wx.getStorageSync('cutImg1')) {
                wx.removeStorageSync('cutImg1');
            }
            if (wx.getStorageSync('cutImg2')) {
                wx.removeStorageSync('cutImg2');
            }
            if (this.$root.$mp.query.flag) {
                this.flag = true;
                this.handler = true;
            } else {
                this.flag = false;
                this.handler = false;
            }
            if (this.$root.$mp.query.create == 'true') {
                this.create = true;
                this.nextDis = false;
                this.goodsIdArr = [];
            } else {
                this.create = false;
            }
        },
        methods: {
            clickStock(id) {
                wx.navigateTo({
                    url: `/pages/admin-stock-list?goodId=${id}`
                })
            },
            toClass() {
                if (this.classList.length == 0) {
                    wx.redirectTo({
                        url: '/pages/admin-no-shop'
                    });
                } else {
                    wx.redirectTo({
                        url: '/pages/admin-store-deploy?emit=3'
                    })
                }
            },
            //分类选择
            modifySelect(index) {
                console.log(index)
                this.shopListSum.forEach(e => {
                    e.onoff = true;
                })
                this.classListIndex = index;
            },
            //商品上下架状态选择
            stateSelect(index) {
                this.stateList.forEach((v, i) => {
                    this.stateIndex = null;
                });
                this.stateIndex = index;
            },
            modifyGroup() {
                if (this.goodsIdArr.length != 0) {
                    this.groupModal = true;
                } else {
                    this.msg('请选择商品')
                }
            },
            confGroup() {
                this.util.post({
                    url: '/api/Merchant/Goods/ChangeGoodType',
                    data: {
                        ShopID: this.shopId,
                        GoodIds: this.goodsIdArr,
                        GoodType: this.classList[this.classListIndex].TypeId
                    }
                }).then(res => {
                    if (res.State == 1) {
                        this.groupModal = false;
                        this.goodsList = [];
                        this.page = 1;
                        this.isOver = false;
                        this.goodsIdArr = [];
                        this.getGoodsList();
                        this.emitType = null;
                        this.handler = false;
                    } else {
                        this.msg(res.Msg);
                    }
                }).catch(err => {
                    this.msg(err.Msg);
                })
            },
            cancelGroup() {
                this.handler = false;
                this.emitType = null;
                this.groupModal = false;
                this.goodsIdArr = [];
                this.stateIndex = null;
                this.shopListSum.forEach(ele => {
                    ele.list.forEach(item => {
                        item.checked = false;
                    })
                })
            },
            /* 获取分类信息 */
            getClass() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/ShopGoodTypes',
                    data: {
                        ShopID: this.shopId
                    }
                }).then(res => {
                    if (res.Body.length == 0) {
                        wx.redirectTo({
                            url: '/pages/admin-no-shop'
                        });
                    } else {
                        this.classList = res.Body;
                        this.classList.forEach(item => {
                            item.checked = false;
                        })
                        if (wx.getStorageSync('classIndex')) {
                            console.log('存在')
                            this.classIndex = wx.getStorageSync('classIndex');
                        } else {
                            console.log('不存在')
                            this.classIndex = 0;
                        }
                        console.log(this.classIndex)
                        this.goodType = this.classList[this.classIndex].TypeId;
                        this.getGoodsList();
                    }
                }).catch(err => {
                    wx.hideLoading();
                    this.msg(err.Msg)
                })
            },
            clickClass(item, index) {
                if (this.classIndex == index) return;
                this.goodsList = [];
                this.shopListSum = [{
                    onoff: true,
                    list: [],
                    state: '上架'
                }, {
                    onoff: true,
                    list: [],
                    state: '下架'
                }, {
                    onoff: true,
                    list: [],
                    state: '停售'
                }];
                this.goodType = item.TypeId;
                this.PageIndex = 1;
                this.classIndex = index;
                this.getGoodsList();
            },
            next() {
                if (this.goodsList.length == 0) {
                    return;
                }
                if (this.specListIndex == null) {
                    return;
                }
                if (!this.nextDis) {
                    this.msg('请选择商品');
                    return;
                }
                let query = this.$root.$mp.query;
                this.goodsItem.specList = [];
                this.goodsItem.specListIndex = this.specListIndex;
                this.goodsItem.specList.push(this.specList[this.specListIndex]);
                this.goodsItem.GoodBrief = this.specCont.GoodBrief;
                this.goodsItem.GoodPics = this.specCont.GoodPics;
                if (this.goodsItem && this.goodsItem.specList.length != 0) {
                    wx.setStorage({
                        key: "goodsSelect",
                        data: this.goodsItem,
                        success: res => {
                            wx.navigateBack({
                                delta: 1
                            })
                        },
                        fail: err => {
                            this.msg('出现错误');
                        }
                    })
                } else {
                    this.msg('请选择商品');
                }
            },
            searchTo() {
                if (this.classList.length > 0) {
                    wx.navigateTo({
                        url: '/pages/admin-commodity-search'
                    })
                } else {
                    this.msg('此分类暂无商品可搜索');
                }
            },
            cancel() {
                this.modal = false;
                this.specListIndex = null;
                this.shopListSum.forEach(ele => {
                    ele.list.forEach(item => {
                        item.checked = false;
                    })
                })
            },
            conf(e) {
                this.modal = false;
                this.nextDis = true;
                // console.log(this.shopListSum)
                this.goodsList.forEach(ele => {
                    ele.checked = false;
                    // console.log(ele.GoodId, this.goodsItem.GoodId)
                    if (ele.GoodId == this.goodsItem.GoodId) {
                        ele.checked = true;
                    }
                });
                // this.goodsList = this.goodsList;
                // item.checked = true;
            },
            batch() {
                if (this.goodsList.length > 0) {
                    this.handler = true;
                } else {
                    this.msg('无商品可操作');
                }
            },
            getGoodsList() {
                let jsonObj = {
                    ShopId: this.shopId,
                    // GoodState 0:全部
                    GoodState: this.GoodState,
                    PageSize: this.pageSize,
                    PageIndex: this.page,
                    GoodType: this.goodType,
                };
                // console.log(jsonObj)
                //循环对象并删除为null的属性
                for (var key in jsonObj) {
                    if (jsonObj[key] == null) {
                        delete jsonObj[key]
                    }
                }
                // console.log(jsonObj)
                this.util.post({
                    url: '/api/Merchant/Goods/GoodList',
                    data: jsonObj
                }).then(res => {
                    this.goodsList = this.goodsList.concat(res.Body);
                    this.shopListSum[0].list = this.goodsList.filter(e => e.State == 1); //上架
                    this.shopListSum[1].list = this.goodsList.filter(e => e.State == 2); //下架
                    this.shopListSum[2].list = this.goodsList.filter(e => e.State == 3); //停售
                    for (let i = 0; i < this.goodsList.length; i++) {
                        this.goodsList[i] = Object.assign({}, this.goodsList[i], {
                            checked: this.goodsIdArr.findIndex(ele => ele == this.goodsList[i].GoodId) > -1 ? true : false
                        })
                    }
                    this.shopListSum.forEach(ele => {
                        ele.list.forEach(item => {
                            item.checked = false;
                        })
                    })
                    
                    if (res.Body.length < this.pageSize) {
                        this.isOver = true;
                        if (this.page > 1) {
                            this.msg('没有更多信息~')
                        }
                    }
                    if (this.goodsList.length == 0) {
                        this.classFlag = true;
                    } else {
                        this.classFlag = false;
                    }
                    // console.log(this.goodsList)
                    //折扣创建 => 缓存 => checked
                    wx.getStorage({
                        key: 'goodsSelect',
                        success: res => {
                            // console.log(res.data);
                            this.goodsList.forEach(ele => {
                                if (ele.GoodId == res.data.GoodId) {
                                    // ele.checked = true;
                                    // this.selectGoods(ele);
                                }
                            })
                        },
                        fail: err => {}
                    })
                    this.block = true;
                    wx.hideLoading();
                    if (this.lisHeight == 0) {
                        setTimeout(_ => {
                            if (this.goodsList.length) {
                                let query = wx.createSelectorQuery();
                                query.select('.sumLis').boundingClientRect();
                                query.exec(res => {
                                    this.lisHeight = res[0].height;
                                })
                            }
                        }, 600)
                    }
                    // console.log(this.goodsList)
                }).catch(err => {
                    wx.hideLoading();
                    this.msg(err.Msg)
                })
            },
            selectGoods(item, index, i) {
                if (!this.handler) {
                    this.emitGoods(item.GoodId);
                    return
                }
                //判断入口
                if (this.flag) {
                    this.modal = true;
                    this.shopListSum.forEach(ele => {
                        ele.list.forEach(item => {
                            item.checked = false;
                        })
                    })
                    this.shopListSum[i].list[index].checked = true;
                    wx.showLoading({
                        title: '加载中',
                        mask: true
                    })
                    this.goodsItem = item;
                    this.util.post({
                        url: '/api/Merchant/Goods/GoodDetail',
                        data: {
                            ShopId: this.shopId,
                            GoodId: item.GoodId
                        }
                    }).then(res => {
                        wx.hideLoading();
                        this.specList = res.Body.GoodSpecs;
                        this.specCont = res.Body;
                        this.specListIndex = null;
                        this.nextDis = false;
                        //折扣创建 => 缓存 => checked
                        wx.getStorage({
                            key: 'goodsSelect',
                            success: res => {
                                this.specList.forEach((ele, index) => {
                                    if (ele.Id == res.data.specList[0].Id) {
                                        this.specSelect(index)
                                    }
                                })
                            },
                            fail: err => {}
                        })
                    }).catch(err => {
                        wx.hideLoading();
                        this.msg(err.Msg)
                    })
                } else {
                    item.checked = !item.checked;
                    let id = item.GoodId;
                    let i = this.goodsIdArr.findIndex(ele => ele == id);
                    if (i == -1) {
                        this.goodsIdArr.push(id);
                    } else {
                        this.goodsIdArr.splice(i, 1);
                    }
                }
            },
            specSelect(index) {
                this.specList.forEach((v, i) => {
                    this.specListIndex = null;
                });
                this.specListIndex = index;
            },
            //选择取消
            cancelSelect() {
                this.handler = false;
                this.emitType = null;
                this.goodsIdArr = [];
                this.shopListSum.forEach(ele => {
                    ele.list.forEach(item => {
                        item.checked = false;
                    })
                })
            },
            /* 保存修改信息 */
            submitEmit(emitType) {
                if (this.goodsIdArr.length == 0) {
                    this.msg('请选择商品');
                    return;
                }
                if (emitType == 2) {
                    this.classListIndex = -1;
                    this.emitType = -1;
                    this.groupModal = true;
                } else {
                    //1.上架，2.下架，3.停售
                    this.stateModal = true;
                    this.stateIndex = -1;
                }
            },
            cancelState() {
                this.goodsIdArr = [];
                this.emitType = null;
                this.handler = false;
                this.stateModal = false;
                this.stateIndex = null;
                this.shopListSum.forEach(ele => {
                    ele.list.forEach(item => {
                        item.checked = false;
                    })
                })
            },
            confState() {
                this.emitType = this.stateIndex;
                this.emitType++;
                this.util.post({
                    url: '/api/Merchant/Goods/ChangeGoodsState',
                    data: {
                        ShopId: this.shopId,
                        GoodIds: this.goodsIdArr,
                        State: this.emitType
                    }
                }).then(res => {
                    if (res.State == 1) {
                        this.handler = false;
                        this.msg('修改成功');
                        this.emitType = null;
                        this.goodsIdArr = [];
                        this.goodsList = [];
                        this.stateModal = false;
                        this.stateIndex = null;
                        this.page = 1;
                        this.getGoodsList();
                    } else {
                        this.msg(res.Msg)
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            emitGoods(id) {
                console.log(id)
                wx.setStorage({
                    key: "classIndex",
                    data: this.classIndex
                });
                wx.navigateTo({
                    url: `/pages/admin-add-goods?goodsId=${id}&type=1`
                })
            },
            rotate(v) {
                // console.log(v)
                v.onoff = !v.onoff;
            }
        },
        onUnload() {
            this.modal = false;
            this.goodsList = [];
            wx.removeStorageSync('classIndex');
        },
        computed: {},
        components: {},
        watch: {
            searchKey: function(newVal, oldVal) {
                if (!newVal) {
                    this.goodsList = [];
                    this.getGoodsList()
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .item_bottom_b {
        height: 20rpx;
        width: 100%;
        background: #fafafa;
    }
    .admin-commodity-manage {
        width: 100%;
        height: 100%;
        background: #fff;
        position: relative;
        overflow: hidden;
        .scroll_view {
            position: absolute;
            top: 130rpx;
            left: 150rpx;
            right: 0;
            bottom: 0;
            background: #ffffff;
            padding-bottom: 120rpx;
            box-sizing: border-box;
        }
        .admin-commodity-manage_list_class {
            position: absolute;
            top: 130rpx;
            left: 0;
            bottom: 0;
            width: 150rpx;
            z-index: 9999;
            background-color: #f3f3f3;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            overflow: hidden;
            .admin-commodity-manage_list_class_cont {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                overflow-x: hidden;
                padding-bottom: 120rpx;
                overflow: hidden;
                .admin-commodity-manage_list_class_item {
                    text-align: center;
                    font-family: PingFangSC-Regular;
                    font-size: 24rpx;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 68rpx;
                    letter-spacing: 0px;
                    color: #1d1d1d;
                    width: 100%;
                    height: 100rpx;
                    box-sizing: border-box;
                    position: relative;
                    z-index: 999;
                    padding: 16rpx;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .item_active {
                    background: #ffffff;
                }
            }
            .admin-commodity-manage_list_class_bottom {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 110rpx;
                text-align: center; // line-height: 110rpx;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                p {
                    font-family: PingFangSC-Regular;
                    font-size: 22rpx;
                    font-weight: normal;
                    font-stretch: normal;
                    letter-spacing: 0px;
                    color: #999999;
                    line-height: 1;
                    margin-top: 10rpx;
                }
            }
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
        z-index: 999999;
    }
    .modalCont {
        position: absolute;
        z-index: 9999999;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 562rpx;
        height: 480rpx;
        border-radius: 18rpx;
        padding-top: 56rpx;
        padding-bottom: 30rpx;
        background: #fff;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .modalCont_Tit {
            // height: 50rpx;
            line-height: 35rpx;
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
            // padding-bottom: 30rpx;
            padding-left: 28rpx;
            padding-right: 28rpx;
            position: relative;
            .audioBox {
                width: 60rpx;
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
            margin-top:30rpx;
            .row {
                font-size: 26rpx;
                width: 100%;
                height: 100rpx;
                line-height: 100rpx;
                width: 100%;
                // font-size: 24rpx;
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
                        justify-content: flex-start;
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
        .modalCont_cont_spec {
            position: relative;
            height: 500rpx;
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
            .row {
                position: relative;
                &::after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    position: absolute;
                    top: 0;
                    left: 0;
                    border-top: 1PX solid #ebebeb;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                }
            }
        }
        
        .modalCont_cont_class {
            height: 500rpx;
        }
        .modalCont_btn {
            overflow: hidden;
            position: relative;
            padding-left: 30rpx;
            padding-right: 30rpx;
            padding-top: 10rpx;
            margin-top: 30rpx;
            .modalCont_btn_cont {
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                font-size: 26rpx; // margin-top: 30rpx;
                .modalCont_btn_cont_cancel {
                    text-align: center;
                    width: 245rpx;
                    height: 72rpx;
                    border: solid 1px #3c59ee;
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
        .modalCont_btn_spec {
            overflow:hidden;
            position:relative;
            padding-left:30rpx;
            padding-right:30rpx;
            padding-top:10rpx;
            margin-top:20rpx;
        }
        .modalCont_btn_border {
            position: relative;
            padding-top: 30rpx;
            margin-top: 10rpx;
            &::after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                position: absolute;
                top: 0;
                left: 0;
                border-top: 1PX solid #ebebeb;
                transform: scaleY(0.5);
                transform-origin: 0 0;
            }
        }
    }
    .modalCont_class {
        height: 680rpx;
    }
    .modalCont_rule {
        height: 750rpx;
        padding-top: 56rpx;
    }
    .searchBox {
        padding: 0 24rpx;
        position: relative;
        width: 100%;
        box-sizing: border-box;
        text-align: center;
        z-index: 99999;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 130rpx;
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
            transform-origin: 0 0; // transform: translateY(-100%);
        }
        .item {
            background: #f5f5f5;
            padding: 0 20rpx 0 24rpx;
            height: 64rpx;
            font-size: 26rpx;
            color: #999;
            text-align: center;
            display: flex;
            flex-direction: row;
            justify-content: center;
            input {
                font-size: 26rpx;
                color: #999;
            }
            input::-webkit-input-placeholder {
                font-size: 26rpx;
                color: #999;
            }
            .icon_search {
                width: 26rpx;
                height: 26rpx;
                margin-right: 13rpx;
            }
            .icon_del {
                width: 24rpx;
                height: 24rpx;
            }
        }
        .gosearch {
            font-size: 28rpx;
            color: #666;
            margin-left: 20rpx;
        }
    }
    .admin-commodity-manage_top {
        display: flex;
        justify-content: space-around;
        align-items: center;
        background: #3c59ee;
        height: 80rpx;
        li {
            height: 100%;
            flex-flow: 1;
            width: 100%;
            text-align: center;
            padding: 0 16rpx;
            span {
                height: 100%;
                display: inline-block;
                color: rgba(255, 255, 255, 0.5);
                font-size: 28rpx;
                vertical-align: top;
                line-height: 80rpx;
            }
        }
        .li_select {
            span {
                color: #ffffff;
                font-weight: 900;
                position: relative;
                &::after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-bottom: 4px solid #ffffff;
                    position: absolute;
                    bottom: -2rpx;
                    left: 0;
                }
            }
        }
    }
    .list_top {
        height: 82rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        padding: 0 24rpx;
        box-sizing: border-box; // position: relative;
        // &::after {
        //     content: '';
        //     display: block;
        //     width: 100%;
        //     height: 0;
        //     position: absolute;
        //     bottom: 0;
        //     left: 0;
        //     border-bottom: 1px solid #ebebeb;
        //     transform: scaleY(0.5);
        //     transform-origin: 0 0;
        // }
        p {
            font-size: 28rpx;
            color: #1a1a1a;
            span {
                font-size: 24rpx;
                color: #999;
            }
        }
        .black {
            padding: 10rpx 20rpx;
            line-height: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.3s;
            transform: rotate(90deg);
        }
        .black_rotate {
            transform: rotate(0deg);
        }
    }
    .admin-commodity-manage_list {
        transition: 0.3s;
        overflow: hidden;
        background: #fff; // margin-bottom: 20rpx;
        position: relative;
        &::after {
            content: '';
            display: block;
            width: 100%;
            height: 0;
            position: absolute;
            top: 0;
            left: 0;
            border-top: 1px solid #ebebeb;
            transform: scaleY(0.5);
            transform-origin: 0 0;
        }
        li {
            display: flex;
            align-items: center;
            padding: 33rpx 20rpx 33rpx 0;
            margin-left: 24rpx;
            position: relative;
            box-sizing: border-box;
            &::after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                position: absolute;
                bottom: 0;
                left: 0;
                border-bottom: 1px solid #ebebeb;
                transform: scaleY(0.5);
                transform-origin: 0 0;
            }
            &:last-child {
                &::after {
                    display: none;
                }
            }
            .icon {
                margin-right: 26rpx;
            }
            .goodsImg {
                width: 160rpx;
                height: 160rpx;
                margin-right: 24rpx;
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
                    &.state1 {
                        background-image: linear-gradient(90deg, #38c439 0%, #4be009 100%);
                    }
                    &.state2 {
                        background-image: linear-gradient(90deg, #f47f19 0%, #f39716 100%), linear-gradient( #38c822, #38c822);
                    }
                    &.state3 {
                        color: #1a1a1a;
                        background-image: linear-gradient(90deg, #bebebe 0%, #b6b8bd 100%), linear-gradient( #38c822, #38c822);
                    }
                }
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .item {
                flex: 1;
                height: 160rpx;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .name {
                    font-size: 30rpx;
                    color: #1d1d1d;
                    line-height: 30rpx;
                    font-weight: 900;
                }
                .specs {
                    // margin-bottom: 18rpx;
                    width: 268rpx;
                    height: 56rpx;
                    background-color: #f7f9ff;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    span {
                        font-size: 21rpx;
                        color: #0E72EB; // line-height: 21rpx;
                        // padding: 10rpx 11rpx;
                        display: inline-block; // background: #ebf2ff;
                    }
                    i {
                        margin-left: 6rpx;
                    } // padding: 4rpx 0;
                }
                .info {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    .num {
                        font-size: 22rpx;
                        color: #444444;
                        line-height: 22rpx;
                        margin-left: 8rpx;
                    }
                    .price {
                        font-size: 28rpx;
                        color: #1a1a1a;
                        line-height: 28rpx;
                        span {
                            font-size: 24rpx;
                        }
                    }
                    .goDetail {
                        font-size: 22rpx;
                        color: #0863ee;
                        .icon {
                            margin-right: 0;
                            margin-bottom: -2rpx;
                        }
                    }
                }
                .time {
                    font-size: 20rpx;
                    color: #999999;
                    line-height: 20rpx;
                }
            }
        }
        .commodity_item {
            background: #fff;
            border-bottom: 1px solid #e6e6e6;
            padding: 20rpx;
            .commodity_item_top {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .top_img_info {
                    position: relative;
                    margin-right: 30rpx;
                    img {
                        width: 100rpx;
                        height: 100rpx;
                    }
                    p {
                        position: absolute;
                        width: 100%;
                        bottom: 0;
                        left: 0;
                        background: #ccc;
                        color: #666;
                        font-size: 24rpx;
                        text-align: center;
                    }
                }
                .top_shop_info {
                    flex: 1;
                    p {
                        color: #333;
                        font-size: 28rpx;
                    }
                    span,
                    i {
                        color: #666;
                        font-size: 24rpx;
                    }
                }
            }
            .commodity_item_bot {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .time {
                    color: #666;
                    font-size: 24rpx;
                }
            }
        }
    }
    .nodata {
        text-align: center;
        font-size: 22rpx;
        color: #ccc;
        padding-top: 120rpx;
        p {
            line-height: 1;
            margin-top: 30rpx;
        }
    }
    .commodity_bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ebebeb;
        padding: 20rpx 30rpx 20rpx 30rpx;
        padding-left: 150rpx;
        background: #fff;
        display: flex;
        justify-content: space-between;
        .btn {
            width: 255rpx;
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
                margin-left: 28rpx;
            }
            &.btnSmall {
                width: 80rpx;
                background: #fff;
                line-height: 1.2;
                p {
                    color: #999;
                    font-size: 22rpx;
                }
            }
        }
        .btn_next {
            width: 100%;
            height: 80rpx;
            font-size: 26rpx;
            color: #ffffff;
            background: #0863ee;
            text-align: center;
            line-height: 80rpx;
            box-sizing: border-box;
            &.on {
                background: #fff;
                color: #0863ee;
                border: 1px solid #0863ee;
            }
            &.btnSmall {
                width: 180rpx;
            }
            &.cancel {
                margin-right: -20rpx;
                margin-left: 10rpx;
            }
        }
        .btn_dis {
            background: #cccccc;
        }
        .itemBtn {
            flex: 1;
            text-align: center;
            border: 1px solid #0863ee;
            margin-right: 20rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            .icon {
                display: block;
                margin-right: 8rpx;
            }
            p {
                font-size: 26rpx;
                color: #0863ee;
                line-height: 26rpx;
            }
            &.on {
                p {
                    color: #1a1a1a;
                }
            }
        }
    }
    .commodity_bottom_l {
        padding-left: 180rpx;
    }
    .commodity_bottom_active {
        padding-left: 0rpx;
        padding: 20rpx 30rpx;
        z-index: 99999;
    }
</style>
