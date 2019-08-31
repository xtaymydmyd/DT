<template>
    <div class="cmsPageBaseInfo">
        <Button type="primary" @click="openQuateModel" class="editQuoteBtn" :disabled="loading">编辑引用</Button>
        <Table 
            :columns="pageColumn" 
            :data="resourceList"
            :highlight-row = highlight
            :loading = loading
            ></Table>
        <pageQuoteManage 
            @submitQuate="queryQuoteManage" 
            @cancelQuate="cancelQuate" 
            ref="pageQuoteManageRef"></pageQuoteManage>
    </div>
</template>
<script>
import pageQuoteManage from 'components/dialog/selectQuateModel.vue'
export default {
    data() {
        return {
            loading : false,
            highlight : true,
            resourceList : [],
            pageColumn: [{
                title: '引用名称',
                key: 'name'
            },{
                title:'描述',
                key: 'remark'
            },{
                title: '链接',
                key: 'url',
                render: (h, params) => {
                    return h('div' , {
                        style: {
                            padding: 0,
                            border: 0,
                            color:"rgb(145, 213, 255)",
                            color:'#1890ff',
                            marginRight:'20px',
                        },
                        domProps : {
                            innerHTML : params.row.url
                        }
                    })
                }
            }],  
            pageId : ''
        } 
    },
    components:{
        pageQuoteManage
    },
    mounted() {
       
    },
    methods: {
        init(pageId){
            this.pageId = pageId;
            this.queryQuoteManage();
        },
        /**
         * 查询基本信息
        */
        queryQuoteManage(){
            var url = constGlobal.HostCMSAdmin + "pageRReferList/search?pageId=" + this.pageId;
            this.resourceList = [];
            this.loading = true;
            http.apiGet(url).then(res => {
                if (res.status == 0) {
                    this.loading = false;
                    if(res.data){
                        this.resourceList = res.data;
                    }
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        openQuateModel(){
            this.$refs.pageQuoteManageRef.init(this.resourceList);
        },
        cancelQuate(){
            
        }
    }
}
</script>

<style lang="scss" >
.cmsPageBaseInfo{
    .editQuoteBtn{
        margin-bottom:16px;           
    }
   
}
    
</style>
