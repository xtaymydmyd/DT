<template>
    <div class="pageIndex">
        <layout-container>
            <div class="pageIndexHead flex flex-justify-content-between">
                <div class="left">
                    <span>网站名称:</span>
                    <Select v-model="webSiteValue" @on-change="webSiteValueChange" style="width:200px">
                        <Option 
                            v-for="item in webSiteList" 
                            :value="item.value" 
                            :key="item.value">{{ item.label }}</Option>
                    </Select>
                    &nbsp;&nbsp;
                    <Button type="primary" icon="plus" @click="openCreateModel">新建页面</Button>
                </div>
                <div class="right">
                    <Input 
                        v-model="fuzzy" 
                        @on-enter="searchPageList" 
                        @on-click="searchPageList"
                        @on-change="searchPageList"
                        clearable 
                        placeholder="请输入关键词"
                        icon="ios-search" >
                    </Input>
                </div>
            </div>
            <Table 
                :columns="pageColumn" 
                :data="pageList"
                :highlight-row = highlight
                :loading = loading
                ></Table>
            <!-- <div class="page-wrap margin-top-24" style="text-align:right;">
                <Page 
                    style="display:inline-block;"
                    :total="total" 
                    :current ="pageNum"
                    :page-size = pageSize
                    @on-page-size-change="onPageSizeChange"
                    @on-change="onPageChange" size="small" show-elevator show-sizer></Page>
            </div>   -->
        </layout-container>
        <Modal
            v-model="createPageFlag"
            title="新建页面"
            class="createCMSPage">
                <Form 
                    :model="createPageInfo" 
                    :label-width="80" 
                    :rules="ruleValidate"
                    class="createPageformItem"
                    ref="createPageFormItem">
                    <FormItem label="页面标题" prop="name">
                        <Input v-model="createPageInfo.name" placeholder="请输入页面标题"></Input>
                    </FormItem>
                    <FormItem label="备   注">
                        <Input 
                            type="textarea" 
                            :autosize="{minRows: 3,maxRows: 5}" 
                            v-model="createPageInfo.remark" placeholder="请输入页面备注"></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button @click="closeCreateModel">取消</Button>
                    <Button type="primary" @click="savePage" :disabled="createPageInfo.name == ''">确定</Button>
                </div>
        </Modal>
         <Modal v-model="deletePageFlag" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>确认删除</span>
            </p>
            <div style="text-align:center">
                <p>此页面删除后将不再显示</p>
                <p>是否继续操作?</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="deletePage_loading" @click="deleteOk">删除</Button>
            </div>
        </Modal>
        <Modal v-model="issueModel" width="360">
            <p slot="header" style="color:#19be6b;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>发布确认</span>
            </p>
            <div style="text-align:center">
                <p>发布之后，用户可根据链接访问页面。</p>
                <p>是否继续发布？</p>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long :loading="issue_loading" @click="confirmaIssue">确认</Button>
            </div>
        </Modal>
        <selectVersionModel 
            @submitVersion="submitVersion" 
            @cancelVersion="cancelVersion" 
            ref="selectVersionModelRef"></selectVersionModel>
    </div>
</template>

<script>
import layoutContainer from 'components/layout/layoutContainer.vue'
import selectVersionModel from 'components/dialog/selectVersion.vue'
export default {
    data() {
        return {
            issue_loading :false,
            issueModel : false,
            loading : false,
            fuzzy : '',
            deletePageFlag : false,
            deletePage_loading : false,
            createPageInfo:{
                name : '',
                remark :''
            },
            createPageFlag : false,
            webSiteValue : '001',
            loading : false,
            highlight : true,
            total : 1,
            pageNum : 1,
            pageSize : 10,
            webSiteList: [{
                value: '001',
                label: '消防员招录系统'
            }],
            pageList : [],
            pageColumn: [{
                title: '页面名称',
                key: 'name',
                render: (h, params) => {
                    return h('div', [
                        h('a', {
                            props: {
                                type: 'text'
                            },
                            attr:{
                                href : this.pageList[params.index].id
                            },
                            style: {
                                padding: 0,
                                border: 0,
                                color:"rgb(145, 213, 255)",
                                color:'#1890ff',
                                marginRight:'20px',
                            },
                            on: {
                                click: () => {
                                    this.toHref(this.pageList[params.index]);
                                }
                            }
                        }, this.pageList[params.index].name),
                    ]);
                }
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
            },{
                title: '操作',
                key: 'account',
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'text'
                            },
                            style: {
                                padding: 0,
                                border: 0,
                                color:"rgb(145, 213, 255)",
                                color:'#1890ff',
                                marginRight:'20px',
                            },
                            on: {
                                click: () => {
                                    this.operaPage(this.pageList[params.index] , 'check');
                                }
                            }
                        }, '查看信息'),
                        h('Button', {
                            props: {
                                type: 'text'
                            },
                            style: {
                                padding: 0,
                                border: 0,
                                color:"rgb(145, 213, 255)",
                                color:'#1890ff',
                                marginRight:'20px',
                            },
                            on: {
                                click: () => {
                                    this.operaPage(this.pageList[params.index] , 'edit');
                                }
                            }
                        }, '编辑内容'),
                        h('Button', {
                            props: {
                                type: 'text'
                            },
                            style: {
                                padding: 0,
                                border: 0,
                                color:"rgb(145, 213, 255)",
                                color:'#1890ff',
                                marginRight:'20px',
                            },
                            on: {
                                click: () => {
                                    this.operaPage(this.pageList[params.index] , 'restore');
                                }
                            }
                        }, '还原'),
                        h('Button', {
                            props: {
                                type: 'text'
                            },
                            style: {
                                padding: 0,
                                border: 0,
                                color:"rgb(145, 213, 255)",
                                color:'#1890ff',
                                marginRight:'20px',
                            },
                            on: {
                                click: () => {
                                    this.operaPage(this.pageList[params.index] , 'issue');
                                }
                            }
                        }, '发布'),
                        // h('Button', {
                        //     props: {
                        //         type: 'text'
                        //     },
                        //     style: {
                        //         padding: 0,
                        //         border: 0,
                        //         color:"rgb(145, 213, 255)",
                        //         color:'#ff293d',
                        //         marginRight:'20px',
                        //     },
                        //     on: {
                        //         click: () => {
                        //             this.operaPage(this.pageList[params.index] , 'delete');
                        //         }
                        //     }
                        // }, '删除'),
                    ]);
                }
            }],  
            ruleValidate:{
                name: [
                { required: true, message: '页面标题不能为空', trigger: 'blur' }
            ]},
            currentPageId : ''
        } 
    },
    components:{
        layoutContainer,
        selectVersionModel
    },
    mounted() {
        this.$nextTick(function() {
            window.eventHub.$emit("changePath", [{
                title : "页面管理",
                name : "index"
            }]);
            window.eventHub.$emit("changeMenuStatus" , false);
        })
       
        this.queryWebSiteList();
    },
    methods: {
        toHref(info){
            console.log(info)
        },
        /**
         * 查询网站列表
        */
        confirmaIssue(){
            this.issue_loading = true;
            var url = constGlobal.HostCMSAdmin + '/publishPage/update?pageId=' + this.currentPageId;
            http.apiGet(url).then(res => {
                this.issue_loading = false;
                if (res.status == 0) {
                    common.toastMsg('发布成功' , 'success') 
                    this.issueModel = false;
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        /**
         * 查询网站列表
        */
        queryWebSiteList(){
            var url = constGlobal.HostCMSAdmin + 'websiteList/search';
            var param = {
                fuzzy : '',
                type : '',
            }
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    this.webSiteList = [];
                    for(var i = 0 ; i< res.data.length ; i++){
                        var param = {
                            value : res.data[i].id,
                            label : res.data[i].name
                        }
                        this.webSiteList.push(param);
                    }
                    this.webSiteValue = this.webSiteList[0].value;
                     this.queryPageList();
                } else {
                    common.toastMsg(res.message) 
                }
            })
        }, 
        /**
         * 获取发布的版本
        */
        submitVersion(item){
            var url = constGlobal.HostCMSAdmin + 'page/restore';
            var param = {
                pageId: item.pageId, //页面id
	            toCaseId: item.id //备份的实例id
            }
            http.apiPost(url , param).then(res => {
                if (res.status == 0) {
                    common.toastMsg('发布成功', 'success') 
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        /**
         * 取消发布
        */
        cancelVersion(){

        },
        /**
         * 根据关键词进行页面搜索
        */
        searchPageList(){
            if(this.fuzzy == ''){
                return;
            }
            this.queryPageList();
        },
        /**
         * 切换网站
        */
        webSiteValueChange(){
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
                websiteId : this.webSiteValue,
                fuzzy : this.fuzzy,
                // page : {
                //     pageNum : this.pageNum,
                //     pageSize : this.pageSize
                // }
            }
            this.pageList = [];
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    this.loading = false;
                    if(res.data){
                        this.pageList = res.data;
                    }
                } else {
                    common.toastMsg(res.message) 
                }
            })
        }, 
        /**
         * 确认删除
        */
        deleteOk(){
            this.deletePage_loading = true;
            this.deletePageFlag = false;
        },
        /**
         * 打开创建页面对话框
        */
        openCreateModel(){
            this.createPageFlag = true;
        },
        /**
         * 关闭创建页面对话框
        */
        closeCreateModel(){
            this.createPageFlag = false;
        },
        operaPage(item , type){
            switch( type ){
                case 'check':
                    this.$router.push({
                        path: '/cmsPageInfo' , 
                        query : {
                            pageId : item.pageId,
                            websiteId : this.webSiteValue
                        }
                    });
                    break;
                case 'edit':
                    this.$router.push({
                        path: '/cmsContent' , 
                        query : {
                            pageName : item.name,
                            pageId : item.pageId,
                            websiteId : this.webSiteValue
                        }});
                    break;
                case 'restore':
                    this.$refs.selectVersionModelRef.init(item.pageId); 
                    break;
                case 'delete':
                    this.deletePage_loading = false;
                    this.deletePageFlag = true;
                    break;
                case 'issue' : 
                    this.issueModel = true;
                    this.currentPageId = item.pageId;
                default:
            }
        },
        /**
         * 新建页面并保存页面
        */
        savePage( ){
            this.$refs.createPageFormItem.validate((valid) => {
                if (valid) {
                    this.createPageFlag = false;
                    this.createPage()
                } else {
                    return
                }
            })
        },
        /**
         * 创建一个新页面
        */
        createPage(){
            var url = constGlobal.HostCMSAdmin + 'page/add';
            var param = {
                websiteId : this.webSiteValue,
                name : this.createPageInfo.name,
                remark : this.createPageInfo.remark,
                type : ''
            }
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        common.toastMsg("新建页面成功" , 'success') ;
                        this.queryPageList()
                    }
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        /**
         * 关闭新建页面对话框
        */
        closeCreateModel(){
            this.createPageFlag = false;
        },
        /**
         * 切换每页条数
        */
        onPageSizeChange(pageNum){
             this.pageNum = 1;
            this.pageSize = pageSize;
            this.queryPageList()
        },
        onPageChange(pageNum){
            this.pageNum = pageNum;
            this.queryPageList()
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
.pageIndex{
    .pageIndexHead{
        padding-bottom:24px;
        .right{
            .ivu-icon{
                cursor:pointer;
            }
        }
        .ivu-input-icon + .ivu-input{
            margin-bottom: 0px;
            height: 32px;
        }
    }
    
}
.createCMSPage{
    .createPageformItem{
        width: 350px;
        margin: auto;
        padding: 30px 0px 10px 0px;
    }
    .ivu-input-icon + .ivu-input{
        margin-bottom: 0px;
        height: 32px;
    }
}

</style>
