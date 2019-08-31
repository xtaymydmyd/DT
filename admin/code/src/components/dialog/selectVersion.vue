<template>
    <Modal
        v-model="selectVersionModel"
        :title="config.title"
        class="selectVersion"
        width = "800px"
        @on-cancel="cancel">
        <div class="flex flex-direction-column selectVersionContent" >
            <div class="selectVersionResult flex flex-justify-content-between">
                <div class="flex flex-align-items">
                    <span class="selectPageResultText">当前：</span>
                    <Tag v-if="currentVersion.id == ''" type="dot">暂无</Tag>
                    <Tag v-else color="blue" type="dot" closable @on-close="cleanVersion">{{currentVersion.name}}</Tag>
                </div>
            </div>
            <div class="filterWrap flex flex-justify-content-between">
                <Input 
                    v-model="fuzzy" 
                    placeholder="请输关键词" 
                    style="width: 200px" 
                    icon="search"
                    clearable
                    @on-change="queryVersionList"></Input>
                <div>
                    <span>类型：</span>
                    <Select v-model="saveTypeValue" style="width:200px" @on-change="queryVersionList">
                        <Option 
                            v-for="item in typeList" 
                            :value="item.value" 
                            :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
            </div>
            <div class="flex-1">
                <Table 
                    size='small'
                    :loading="loading"
                    highlight-row  
                    :columns="versionColumn" 
                    :data="versionList"
                    @on-row-click="versionRowSelect"></Table>
                <div class="pages flex flex-justify-content-right margin-top-24">
                        <Page 
                            :total="total" 
                            :current ="pageNum"
                            :page-size = pageSize
                            @on-page-size-change="onPageSizeChange"
                            @on-change="onPageChange" size="small" show-elevator show-sizer />
                    </div>
            </div>
        </div>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" @click="selectVersionOK" :disabled="currentVersion.id == ''">确定</Button>
        </div>
    </Modal>
</template>

<script>

export default {
    data () {
        return {
            loading : false,
            pageNum: 1,
            total : 1,
            pageSize : 10,
            saveTypeValue : '0',
            selectVersionModel : false,
            typeList : [{
                value: '0',
                label: '全部'
            },{
                value: 'userSaveType',
                label: '手动备份'
            },{
                value: 'autoSaveType',
                label: '自动备份'
            },{
                value: 'publishSaveType',
                label: '发布备份'
            }],
            currentVersion : {
                id : '',
                versionName:''
            },
            versionList : [],
            versionColumn : [{
                title: '创建人',
                key: 'userId',
            },{
                title: '版本名称',
                key: 'name'
            },{
                title: '类型',
                key: 'saveName'
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
                title : '选择版本'
            },
            pageId : '',
            fuzzy : ''
        };
    },
    methods: {
        /**
         * 打开弹出框，并初始化数据
        */
        init(id){
            this.pageId = id;
            this.selectVersionModel = true;
            this.pageNum = 1;
            this.fuzzy = '';
            this.queryVersionList();
        },
        /**
         * 获取版本列表
        */
        queryVersionList(){
            var url = constGlobal.HostCMSAdmin + 'backupPageCase/searchByPage';
            var param = {
                pageId : this.pageId,
                saveTypeList : this.saveTypeValue == '0' ? [] : [this.saveTypeValue],
                fuzzy : this.fuzzy,
                pager : {
                    pageNum : this.pageNum,
                    pageSize : this.pageSize
                },
            }
            this.loading = true;
            this.versionList = [];
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    this.loading = false;
                    if(res.data){
                        this.versionList = res.data;
                        for(var i = 0 ; i < this.versionList.length ; i++){
                            for(var j = 0 ; j < this.typeList.length ; j++){
                                if(this.versionList[i].saveType == this.typeList[j].value){
                                    this.versionList[i].saveName = this.typeList[j].label;
                                    break;
                                }
                            }
                        }
                        this.total = res.total;
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
            this.queryVersionList()
        },
        onPageChange(pageNum){
            this.pageNum = pageNum;
            this.queryVersionList()
        },
        /**
         * 选择某一个版本
        */
        versionRowSelect(item){
            this.currentVersion = item; 
        },
        /**
         * 保存
        */
        selectVersionOK () {
            this.$emit("submitVersion" , this.currentVersion);
            this.selectVersionModel = false;
        },
        cancel () {
            this.$emit("cancelVersion" , this.currentVersion);
            this.selectVersionModel = false;
        },
        cleanVersion(){
            this.currentVersion = {
                id : '',
                versionName:''
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
    .selectVersion{
        height : 400px;
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
        .filterWrap{
            margin-bottom:10px;
        }
        .selectVersionContent{
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
