<template>
    <div class="checkIndex">
        <layout-container>
            <div class="checkIndexHead flex flex-wrap">
                <div class="left flex">
                    <span>表单类型:</span>
                    <Select v-model="formTypeValue" @on-change="formTypeValueChange" style="width:100%">
                        <Option 
                            v-for="item in formTypeList" 
                            :value="item.value" 
                            :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="left flex">
                    <span>审核状态:</span>
                    <Select v-model="checkTypeValue" @on-change="checkTypeValueChange" style="width:100%">
                        <Option 
                            v-for="item in checkTypeList" 
                            :value="item.value" 
                            :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="left flex">
                    <span>需求父类型:</span>
                    <Select v-model="typeValue" @on-change="typeValueChange" style="width:100%">
                        <Option 
                            v-for="item in formCaseType" 
                            :value="item.value"  
                            :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="left flex">
                    <span>需求子类型:</span>
                    <Select v-model="typeChildValue" @on-change="typeValueChildChange" style="width:100%">
                        <Option 
                            v-for="item in formCaseTypeChild" 
                            :value="item.value" 
                            :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="left flex">
                    <span>关键词:</span>
                    <Input 
                        v-model="fuzzy" 
                        @on-enter="searchList" 
                        @on-click="searchList"
                        @on-change="searchList"
                        clearable 
                        placeholder="请输入关键词"
                        icon="ios-search" >
                    </Input>
                </div>
            </div>
            <Table 
                :columns="listColumn" 
                :data="list"
                :highlight-row = highlight
                :loading = loading
                ></Table>
            <div class="page-wrap margin-top-24" style="text-align:right;">
                <Page 
                    style="display:inline-block;"
                    :total="total" 
                    :current ="pageNum"
                    :page-size = pageSize
                    @on-page-size-change="onPageSizeChange"
                    @on-change="onPageChange" size="small" show-elevator show-sizer></Page>
            </div>  
        </layout-container>
        <Modal
            v-model="operaFlag"
            title="操作"
            class="createCMSPage">
                <Form 
                    :model="operaPassInfo" 
                    :label-width="80" 
                    :rules="ruleValidate"
                    class="createPageformItem"
                    ref="createPageFormItem">
                    <FormItem label="是否通过">
                        <RadioGroup v-model="operaPassInfo.auditeStatus">
                            <Radio label="1">通过</Radio>
                            <Radio label="2">不通过</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="备   注">
                        <Input 
                            type="textarea" 
                            :autosize="{minRows: 3,maxRows: 5}" 
                            v-model="operaPassInfo.remark" placeholder="请输入备注"></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button @click="closeCreateModel">取消</Button>
                    <Button type="primary" @click="saveOpera" :loading="submitLoading">确定</Button>
                </div>
        </Modal>
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
            createPageFlag : false,
            typeValue : '1',
            loading : false,
            highlight : true,
            total : 1,
            pageNum : 1,
            pageSize : 10,
            formTypeList : [{
                value : '-1',
                label : '全部'
            },{
                value: '0',
                label: '需求'
            },{
                value : '1',
                label : '方案'
            }],
            formTypeValue : '-1',
            checkTypeList : [{
                value : '-1',
                label : '全部'
            },{
                value: '0',
                label: '未审核'
            },{
                value: '1',
                label: '审核通过'
            },{
                value: '2',
                label: '审核未通过'
            }],
            checkTypeValue : '-1',
            
            typeList: [],
            list : [],
            listColumn: [{
                title: '名称',
                key: 'name'
            },{
                title: '审核状态',
                key: 'auditStatusText'
            },{
                title : '表单类型',
                key : 'formType'
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
                                display : this.list[params.index].auditStatus == '0' ? "inline-block" : "none"
                            },
                            on: {
                                click: () => {
                                    this.operaPage(this.list[params.index] , 'pass');
                                }
                            }
                        }, '通过'),
                        
                    ]);
                }
            }],  
            ruleValidate:{
                auditeStatus: [{ required: true, message: '请选择是否通过', trigger: 'blur' }
            ]},
            currentPageId : '',
            formCaseType : [],
            formCaseTypeChild : [],
            typeChildValue : '',
            operaPassInfo : {
                auditeStatus : '1',
                remark : ''
            },
            operaFlag : false,
            current : {},
            submitLoading : false
        } 
    },
    components:{
        layoutContainer,
        selectVersionModel
    },
    mounted() {
        this.$nextTick(function() {
            window.eventHub.$emit("changePath", [{
                title : "审核管理",
                name : "checkIndex"
            }]);
        })
        this.queryFormCaseType();
    },
    methods: {
        /**
         *  需求父类型发生变化
        */
        typeValueChange(){
            console.log("需求父类型")
            console.log(this.typeChildValue)
            if(this.typeChildValue == ''){
                return
            }
            this.queryFormCaseList();
        },
        /**
         *  审核状态发生变化
        */
        checkTypeValueChange(){
            console.log("审核状态发生变化")
            this.queryFormCaseList();
        },
        /**
         *  表单类型发生变化时
        */
        formTypeValueChange(){
            console.log("表单类型发生变化时")
            this.queryFormCaseList();
        }, 
        /**
         *  获取需求父类型列表
        */
        queryFormCaseType(){
            let url = constGlobal.HostCheckAdmin + 'formCaseType/search';
            let param = {
                level : 0
            }
            http.apiPost(url , param).then(res => {
                if (res.status == 0) {
                    this.formCaseType = []
                    for(let i = 0 ; i < res.data.length ; i++){
                        let param = {
                           label : res.data[i].name,
                           value : res.data[i].id
                        } 
                        this.formCaseType.push(param);
                    }
                    this.typeValue = this.formCaseType[0].value
                    this.queryFormCaseTypeForChild();
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        /**
         *  根据需求父类型获取子类型
        */
        queryFormCaseTypeForChild(){
            let url = constGlobal.HostCheckAdmin + 'formCaseType/search';
            let param = {
                parentIdList : [this.typeValue]
            }
            http.apiPost(url , param).then(res => {
                if (res.status == 0) {
                    this.formCaseTypeChild = []
                    for(let i = 0 ; i < res.data.length ; i++){
                        let param = {
                           label : res.data[i].name,
                           value : res.data[i].id
                        } 
                        this.formCaseTypeChild.push(param);
                    }
                    this.typeChildValue = this.formCaseTypeChild[0].value;
                    
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        /**
         * 切换子类型
        */
        typeValueChildChange(){
            console.log("切换子类型")
            this.queryFormCaseList();
        },
        /**
         * 查询需求/方案列表
        */
        queryFormCaseList(){
            if(this.typeChildValue == ''){
                return
            }
            this.loading = true;
            let url = constGlobal.HostCheckAdmin + 'formCaseList/search';
            let param = {
                parentType : this.typeValue,// 父类型
                formType: this.formTypeValue == '-1' ? '' : this.formTypeValue,//表单类型 0 需求 1 方案
                typeIdList : [this.typeChildValue],//类型 传子类型
                fuzzy : this.fuzzy,// 模糊搜索
                auditStatus: this.checkTypeValue == '-1' ? '' : this.checkTypeValue, //审核状态 0 未审核 1 审核通过 2 审核未通过
                page : {
                    pageNum : this.pageNum,
                    pageSize : this.pageSize
                }
            }
            http.apiPost(url , param).then(res => {
                if (res.status == 0) {
                    this.loading = false;
                    for(var i = 0 ; i < res.data.length ; i++){
                        for(var j = 0 ; j < this.formTypeList.length ; j++){
                            if(res.data[i].formType == this.formTypeList[j].value){
                                res.data[i].formType = this.formTypeList[j].label;
                                break;
                            }
                        }
                        for(var j = 0 ; j < this.checkTypeList.length ; j++){
                            if(res.data[i].auditStatus == this.checkTypeList[j].value){
                                res.data[i].auditStatusText = this.checkTypeList[j].label;
                                break;
                            }
                        }
                    }

                    this.list = res.data
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        /**
         * 根据关键词进行页面搜索
        */
        searchList(){
            if(this.fuzzy == ''){
                return;
            }
            this.queryFormCaseList();
        },
        /**
         * 关闭审核对话框
        */
        closeCreateModel(){
            this.operaFlag = false;
        },
        operaPage(item , type){
            this.current = item;
            switch( type ){
                case 'pass':
                    this.submitLoading = false;
                    this.operaFlag = true;
                    break;
                default:
            }
        },
        /**
         * 新建页面并保存页面
        */
        saveOpera(){
            console.log(this.operaPassInfo)
            this.submitLoading = true;
            var url = constGlobal.HostCheckAdmin + 'formCaseStatus/update';
            var param = {
                auditStatus : this.operaPassInfo.auditeStatus,//审核状态 0 未审核 1 审核通过 2 审核未通过
                formCaseId : this.current.id, // 返回的id
                remark : this.operaPassInfo.remark// 备注
            }
            this.list = [];
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                   this.submitLoading = false;
                   this.queryFormCaseList();
                   common.toastMsg("审核成功" , "success");
                   this.operaFlag = false;
                    this.current = {};
                } else {
                    common.toastMsg(res.message) 
                }
            })
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
.checkIndex{
    .checkIndexHead{
        padding-bottom:24px;
        .left{
            width:33%;
            padding-right:8px;
            margin-bottom:10px;
            >span{
                width: 120px;
                line-height: 30px;
                text-align:right;
                padding-right:5px;
                display:inline-block;
            }
        }
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
