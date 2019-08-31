<template>
    <Modal
        v-model="selectPageModel"
        :title="config.title"
        class="selectPageModel"
        width = "800px"
        @on-cancel="cancel">
        <div class="visible-range-container1 flex flex-direction-column">
            <div class="selectPageResult flex">
                <span class="selectPageResultText">当前：</span>
                <Tag v-if="currentPage.pageId == ''">暂无</Tag>
                <Tag v-else color="blue">{{currentPage.name}}</Tag>
            </div>
            <div class="flex-1">
                <Table 
                    :loading="loading"
                    size='small'
                    highlight-row  
                    :columns="pageColumn" 
                    :data="pageList"
                    @on-row-click="pageRowSelect"
                    ></Table>
            </div>
        </div>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" @click="rangeOk" :disabled="currentPage.id == ''">确定</Button>
        </div>
    </Modal>
</template>

<script>

export default {
    data () {
        return {
            selectPageModel : false,
            currentPage : {
                id : '',
                title : '',
                url : ''
            },
            pageColumn : [{
                title: '名称',
                key: 'name',
                align : 'left'
            },{
                title: '描述',
                key: 'remark'
            },{
                title: '时间',
                key: 'createTime',
                render: (h, params) => {
                    return h('div' , {
                        domProps : {
                            innerHTML : this.filterTimes(params.row.createTime)
                        }
                    })
                }
            }],
            pageList : [],
            config : {
                title : '选择页面'
            },
            websiteId : '',
            loading : false,
            key : ''
        };
    },
    methods: {
        /**
         * 打开弹出框，并初始化数据
        */
        init(key , websiteId , info){
            this.websiteId = websiteId;
            this.key = key;
            if(info.pageId){
                this.currentPage = info;
            }else{
                this.currentPage = {
                    "pageId" : "",
                    "name" : "",
                }
            }
            this.selectPageModel = true;
            this.queryPageList();
        },
        /**
         * 查询页面列表
        */
        queryPageList(){
            this.loading = true;
            var url = constGlobal.HostCMSAdmin + 'pagelist/search';
            var param = {
                type : '',
                websiteId : this.websiteId,
                fuzzy : ''
            }
            this.pageList = [];
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    this.loading = false;
                    if(res.data){
                        this.pageList = res.data;
                        for(var i = 0 ; i < this.pageList.length ; i++){
                            this.pageList[i].id = this.pageList[i].pageId;
                        }
                    }
                } else {
                    common.toastMsg(res.message) 
                }
            })
        }, 
        /**
         * 选择某页面
        */
        pageRowSelect(info , index){
            this.currentPage = this.pageList[index];
        },
        /**
         * 保存
        */
        rangeOk () {
            this.selectPageModel = false;
            this.$emit("submitPage" , this.currentPage , this.key);
        },
        cancel () {
            this.selectPageModel = false;
            this.$emit("cancelPage" , [] , this.key);
        },
        visibleChange(){
            if(this.selectPageModel == false){
                this.$emit("cancelPage" , [] , this.key);
            }
        },
        filterTimes(value){
            let day = moment(value)
            let date = moment(day).format('YYYY-MM-DD HH:mm:SS')
            return date
        }
    }
};
</script>

<style lang="scss">
    @import '~assets/css/public.scss';
    @import '~assets/css/flexComp.scss';
    .selectPageModel{
        height : 400px;
        .selectPageResult{
            height: 20px;
            align-items: center;
            margin-bottom: 16px;
            .selectPageResultText{
                font-size:14px;
            }
        }
    }
</style>
