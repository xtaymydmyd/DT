<template>
    <div class="pageVersion">
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
        <Table 
            :columns="versionColumn" 
            :data="versionList"
            highlight-row
            :loading = loading
            ></Table>
        <div class="pages flex flex-justify-content-right margin-top-24">
            <Page 
                :total="total" 
                :current ="pageNum"
                :page-size = pageSize
                @on-page-size-change="onPageSizeChange"
                @on-change="onPageChange" size="small" show-elevator show-sizer />
        </div>
    </div>
</template>
<script>

export default {
    data() {
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
                value: '1',
                label: '手动备份'
            }
            // ,{
            //     value: '2',
            //     label: '发布备份'
            // }
            ],
            currentVersion : {
                id : '',
                versionName:''
            },
            versionList : [],
            versionColumn : [{
                title: '创建人',
                key: 'userId',
            },{
                title: '备份名称',
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
            fuzzy : '',
            pageId : ''
        } 
    },
    mounted() {
    //    this.init();
    },
    methods: {
        init(pageId){
            this.pageId = pageId;
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
        filterTimes(value){
            let day = moment(value)
            let date = moment(day).format('YYYY-MM-DD HH:mm:SS')
            return date
        }
    }
}
</script>

<style lang="scss" >
.pageVersion{
    padding : 0px 15px;
    .filterWrap{
        margin-bottom:15px;
        .ivu-input-icon + .ivu-input{
            margin-bottom: 0px;
            height: 32px;
        }
    }
    .pages{
        margin-bottom:10px;
    }
}   
</style>
