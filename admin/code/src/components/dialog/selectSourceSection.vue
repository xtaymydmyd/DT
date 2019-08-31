<template>
    <Modal
        v-model="selectComponentModel"
        :title="config.title"
        class="selectBackup"
        width = "800px"
        @on-cancel="cancel">
        <div class="flex flex-direction-column selectBackupContent" >
            <div class="selectBackupResult flex flex-justify-content-between">
                <div class="flex flex-align-items">
                    <span class="selectPageResultText">当前：</span>
                    <Tag v-if="currentBackup.id == ''" type="dot">暂无</Tag>
                    <Tag v-else color="blue" type="dot" closable @on-close="cleanBackup">{{currentBackup.name}}</Tag>
                </div>
            </div>
            <div class="filterWrap flex flex-justify-content-between">
                <div></div>
                <Input 
                    v-model="fuzzy" 
                    placeholder="请输关键词" 
                    style="width: 200px" 
                    icon="search"
                    clearable
                    @on-change="querySourceSection"></Input>
            </div>
            <div class="flex-1">
                <Table 
                    size='small'
                    :loading="loading"
                    highlight-row  
                    :columns="sectionColumn" 
                    :data="sectionList"
                    @on-row-click="backupRowSelect"></Table>
                <!-- <div class="pages flex flex-justify-content-right margin-top-24">
                    <Page 
                        :total="total" 
                        :current ="pageNum"
                        :page-size = pageSize
                        @on-page-size-change="onPageSizeChange"
                        @on-change="onPageChange" size="small" show-elevator show-sizer />
                </div> -->
            </div>
        </div>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" @click="selectBackupOK" :disabled="currentBackup.id == ''">确定</Button>
        </div>
    </Modal>
</template>

<script>

export default {
    data () {
        return {
            loading : false,
            saveTypeValue : '0',
            selectComponentModel : false,
            currentBackup : {
                id : '',
                backupName:''
            },
            sectionList : [],
            sectionColumn : [{
                title: '名称',
                key: 'name',
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
            config : {
                title : '选择引用'
            },
            fuzzy : '',
            websiteId : ""
        };
    },
    methods: {
        /**
         * 打开弹出框，并初始化数据
        */
        init(id , websiteId , info , divId){
            this.divId = divId;
            this.websiteId = websiteId;
            this.sourceSectionId = id;
            this.selectComponentModel = true;
            this.pageNum = 1;
            this.fuzzy = '';
            this.querySourceSection();
        },
        /**
         * 获取插件列表
        */
        querySourceSection(){
            var url = constGlobal.HostCMSAdmin + 'canReferSectionCase/search';
            this.loading = true;
            this.sectionList = [];
            var param = {
                sourceSectionId:this.sourceSectionId,
                websiteId: this.websiteId
            }
            http.apiPost(url , param).then(res => {
                if (res.status == 0) {
                    this.loading = false;
                    if(res.data){
                        var arr = []
                        for(var i = 0 ; i < res.data.length ; i++){
                            if(res.data[i].divId != this.divId){
                                arr.push(res.data[i])
                            }
                        }
                        this.sectionList = arr;
                    }
                    
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        /**
         * 切换每页条数
        */
        onPageSizeChange(pageSize){
            this.pageNum = 1;
            this.pageSize = pageSize;
            this.querySourceSection()
        },
        onPageChange(pageNum){
            this.pageNum = pageNum;
            this.querySourceSection()
        },
        /**
         * 选择某一个版本
        */
        backupRowSelect(item){
            this.currentBackup = item; 
        },
        /**
         * 保存
        */
        selectBackupOK () {
            this.$emit("submitSourceSection" , this.currentBackup);
            this.selectComponentModel = false;
        },
        cancel () {
            this.$emit("cancelSourceSection" , this.currentBackup);
            this.selectComponentModel = false;
        },
        cleanBackup(){
            this.currentBackup = {
                id : '',
                backupName:''
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
    .selectBackup{
        height : 400px;
        .selectBackupResult{
            margin-bottom: 11px;
            border-bottom: 1px dashed #e6e6e6;
            padding-bottom: 10px;
            height: 45px;
            box-sizing: border-box;
            .selectPageResultText{
                font-size:14px;
            }
        }
        .filterWrap{
            margin-bottom:10px;
        }
        .selectBackupContent{
            min-height:400px;
        }
        tr{
            cursor:pointer;
        }
        .ivu-input-icon + .ivu-input{
            margin-bottom: 0px;
            height: 32px;
        }
    }
</style>
