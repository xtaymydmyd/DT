<template>
    <Modal
        v-model="menuModel"
        title="关联菜单"
        class="visible-depart-range-one"
        width = "500px"
        @on-cancel="cancel"
        @on-visible-change ="modelChange">
        <div class="visible-range-container flex flex-direction-column">
            <div class="selectVersionResult flex flex-justify-content-between">
                <div class="flex flex-align-items">
                    <span class="selectPageResultText">当前：</span>
                    <Tag v-if="currentMenu.id == ''" type="dot">暂无</Tag>
                    <Tag v-else color="blue" type="dot" closable @on-close="cleanMenu">{{currentMenu.name}}</Tag>
                </div>
            </div>
            <div class="visbile-range-list-wrap flex flex-1">
                <div class="range-left1 flex flex-direction-column" >
                    <div class="flex flex-direction-column">
                        <div class="tab-container flex-1" style="padding-top:10px;">
                            <div  class="tree1">
                                <el-tree 
                                    :data="menuTree" 
                                    v-loading="loadingTree" 
                                    element-loading-text="加载中..." 
                                    empty-text="暂无数据" 
                                    node-key="id" 
                                    :expand-on-click-node="false"
                                    ref="tree" 
                                    :props="defaultProps" 
                                    check-strictly
                                    @node-click="nodeClick"
                                    ></el-tree>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :disabled="currentMenu.id == ''" @click="rangeOk">确定</Button>
        </div>
    </Modal>
</template>

<script>

export default {
    data () {
        return {
            loadingTree : false,
            defaultProps: {
                label: 'name',
                children: 'children',
                isLeaf: 'isLeaf'
            },
            title : '文章类型',
            menuModel : false,
            menuTree : [],
            websiteId : '',
            currentMenu :{
                id : '',
                name : ''
            }
        };
    },
    methods: {
        /**
         * 初始化数据
        */
        init(websiteId , menu ){
            if(menu.id != ''){
                this.currentMenu.id = menu.id;
                this.currentMenu.name = menu.name;
            }
            this.websiteId = websiteId;
            this.menuModel = true;
            this.queryMenu();
        },
        cleanMenu(){
            this.currentMenu = {
                id : '',
                name : ''
            }
        },
        /**
         * 获取菜单树
        */
        queryMenu(){
            var url = constGlobal.HostCMSAdmin + 'carryChildrenMenuList/search?websiteId=' + this.websiteId;
            http.apiGet(url).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        this.menuTree = res.data;
                    }
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        /**
         * 选择节点
        */
        nodeClick(data){
            this.currentMenu = {
                id : data.id , 
                name : data.label
            }
        },
        /**
         * 保存
        */
        rangeOk () {
            this.menuModel = false;
            this.$emit("submitMenu" , this.currentMenu);
            this.currentMenu = {}
        },
        cancel () {
            this.menuModel = false;
            this.$emit("cancelMenu" );
            this.currentMenu = {}
        },
        modelChange(){
            if(this.menuModel == false){
                this.$emit("cancelMenu" );
                this.currentMenu = {}
            }
        }
    }
};
</script>

<style lang="scss">
    @import '~assets/css/public.scss';
    @import '~assets/css/flexComp.scss';
    .visible-depart-range-one{
        .selectVersionResult{
            margin-bottom: 11px;
            border-bottom: 1px dashed #e6e6e6;
            padding-bottom: 10px;
            height: 45px;
            box-sizing: border-box;
            .selectPageResultText{
                font-size:14px;
            }
        }
        .visible-range-result{
            border: 1px solid #efefef;
            padding: 8px 10px;
            border-radius: 5px;
            height: 46px;
            overflow: auto;
        }
        .visbile-range-list-wrap{
            margin-top:10px;
            .range-left1{
                border: 1px solid #efefef;
                border-radius: 5px;
                width:100% !important;
                .tree-list{
                    width:100% !important;
                    overflow:auto;
                }
                .ivu-tabs-bar{
                    margin-bottom:2px;
                }
            }
            .range-right{
                padding : 0px 0px 0px 10px;
            }
            .ivu-page{
                text-align:right;
            }
        }
        .tree1{
            overflow-x: auto;
            overflow-y: auto;
            width:100%;
            height: 297px;
        }
        .el-tree{
            width:100%;
            overflow: initial;
            >.el-tree-node{
                min-width: 100%;
                display: inline-block !important;
            }
        }
        .tab-header{
            .tab{
                height:40px;
                text-align:center;
                line-height:40px;
                font-size:14px;
                border-bottom:1px solid #eaeaea;
                cursor: pointer;
            }
            .tab.active{
                color : #2d8cf0;
                position:relative;
            }
            .tab.active:before{
                content: "";
                position: absolute;
                bottom: 0px;
                border-bottom: 2px solid #2d8cf0;
                width: 100%;
                left: 0px;
            }
        }
        .el-icon-yx-folder{
            background:url("~assets/img/qy.png");
            display: inline-block;
            width: 15px;
            height: 14px;
            background-size: 15px 15px;
            margin-bottom: -2px;
            margin-right:4px;
        }
        .el-icon-yx-file-text{
            background:url("~assets/img/bm.png");
            display: inline-block;
            width: 15px;
            height: 14px;
            background-size: 15px 15px;
            margin-bottom: -2px;
            margin-right:4px;
        }
    }
</style>
