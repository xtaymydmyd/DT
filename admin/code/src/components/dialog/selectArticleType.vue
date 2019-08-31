<template>
    <Modal
        v-model="articleTypeModel"
        :title="title"
        class="visible-depart-range-one"
        width = "500px"
        @on-cancel="cancel"
        @on-visible-change ="visibleChange">
        <div class="visible-range-container flex flex-direction-column">
            <div class="visible-range-result">
                <Tag 
                    v-for="(item , index) in count"
                    :key = index
                    v-if="item.relateId"
                    color="blue"
                    type="border"
                    :name="item.name" 
                    closable 
                    @on-close="deleteTag(item)">{{item.name}}</Tag>
            </div>
            <div class="visbile-range-list-wrap flex flex-1">
                <div class="range-left1 flex flex-direction-column" >
                    <div class="flex flex-direction-column">
                        <div class="tab-container flex-1" style="padding-top:10px;">
                            <div  class="tree1">
                                <el-tree 
                                    :data="articleTree" 
                                    v-loading="loadingTree" 
                                    element-loading-text="加载中..." 
                                    empty-text="暂无数据" 
                                    node-key="id" 
                                    show-checkbox
                                    :default-checked-keys="checkedKeys" 
                                    :expand-on-click-node="false"
                                    :check-on-click-node="false"
                                    ref="tree" 
                                    :props="defaultProps" 
                                    check-strictly
                                    @check-change="handleCheckChange"
                                    ></el-tree>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :disabled="count.length == 0" @click="rangeOk">确定</Button>
        </div>
    </Modal>
</template>

<script>

export default {
    data () {
        return {
            count : {
                name : '',
                id : ''
            },
            loadingTree : false,
            completeOrgTree:[],
            checkedKeys: [],
            defaultProps: {
                label: 'name',
                children: 'children',
                isLeaf: 'isLeaf'
            },
            pageSize : 10,
            activeIndex : 0,
            node : {
                id : ''
            },
            title : '文章类型',
            articleTypeModel : false,
            articleTree : [],
            websiteId : '',
            countLength : ''
        };
    },
    methods: {
        /**
         * 初始化数据
        */
        initArticleType(websiteId , list , length){
            this.websiteId = websiteId;
            if(list == undefined){
                this.count = []
            }else{
                this.count = list.value;
                this.count.push();
            }
            this.articleTypeModel = true;
            this.node.id = '';
            this.queryPostTypeTree();
        },
        /**
         * 获取文章类型树
        */
        queryPostTypeTree(){
            var url = constGlobal.HostCMSAdmin + 'post/getPostTypeTree?websiteId=' + this.websiteId;
            http.apiGet(url).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        this.articleTree = res.data;
                        this.initTreeSelect();
                    }
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        /**
         * 初始化选中树
        */
        handleCheckChange(data, checked, indeterminate) {
            if(checked){
                for(var i = 0 ; i < this.count.length ; i++){
                    if(data.id == this.count[i].relateId){
                        return;
                    }
                }
                var param = {
                    relateId : data.id,
                    name : data.name
                }
                this.count.push(param);
            }else{
                for(var i = 0 ; i < this.count.length ; i++){
                    if(data.id == this.count[i].relateId){
                        this.count.splice(i , 1);
                    }
                }
            }
        },
        /**
         * 删除文章类型
        */
        deleteTag(item){
            var param = {
                id : item.relateId,
                label : item.name
            }
            this.count.splice( this.count.indexOf(item), 1);
            this.$refs.tree.setChecked( param, false);
        },
        /**
         * 获取根节点
        */
        queryTreeRoot(){
            var url ;
            var param = {};
            url = constGlobal.HostContact + 'orgRootNode/search';
            http.apiPost(url ,param).then(res => {
                if (res.status == 0) {
                    this.completeOrgTree = res.data;
                    this.initTreeSelect();
                } else { 
                    common.toastMsg(res.message)
                }
            })
        },
       
         /**
         * 获取子节点选中状态
        */
        initTreeSelect(){
            this.checkedKeys = [];
            if(this.count.length !=0){
                for(var i = 0 ; i < this.count.length ; i++){
                    this.checkedKeys.push(this.count[i].relateId)
                }
            }
        },
        /**
         * 选择节点
        */
        nodeClick(node){
            // this.count = JSON.parse(JSON.stringify(node));
            // this.count = {
            //     name : node.name,
            //     id : node.id,
            //     level : node.level,
            //     parentId : node.parentId
            // }
        },
        
        /**
         * 保存
        */
        rangeOk () {
            if(this.count.length == 0){
                return;
            }
            this.articleTypeModel = false;
            this.$emit("submitAriticleType" , this.count);
        },
        cancel () {
            this.articleTypeModel = false;
            this.$emit("cancelAriticleType" , this.count);
        },
        visibleChange(){
            if(this.articleTypeModel == false){
                this.$emit("cancelAriticleType" , this.count);
            }
        }
    }
};
</script>

<style lang="scss">
    @import '~assets/css/public.scss';
    @import '~assets/css/flexComp.scss';
    .visible-depart-range-one{
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
