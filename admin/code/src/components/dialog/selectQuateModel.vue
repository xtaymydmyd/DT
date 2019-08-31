<template>
    <Modal
        v-model="selectQuateModel"
        :title="config.title"
        class="selectQuateModel"
        width = "800px"
        @on-cancel="cancel">
        <div class="flex flex-direction-column selectVersionContent" >
            <div class="flex-1">
                <Table 
                    size='small'
                    height="400"
                    highlight-row  
                    :columns="quateColumn" 
                    :data="allReferList"
                    @on-selection-change="quateSelectChange"></Table>
            </div>
        </div>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" @click="updateReferList" :disabled="selectQuateList.length == 0">确定</Button>
        </div>
    </Modal>
</template>

<script>

export default {
    data () {
        return {
            currentType : '0',
            selectQuateModel : false,
            allReferList : [],
            currentVersion : {
                id : '',
                versionName:''
            },
            
            quateColumn : [ {
                type: 'selection',
                width: 60,
                align: 'center'
            },{
                title: '引用名称',
                key: 'name'
            },{
                title: '描述',
                key: 'remark',
            }
            // ,{
            //     title: '链接',
            //     key: 'url',
            //     render: (h, params) => {
            //         return h('div' , {
            //             style: {
            //                 padding: 0,
            //                 border: 0,
            //                 color:"rgb(145, 213, 255)",
            //                 color:'#1890ff',
            //                 marginRight:'20px',
            //             },
            //             domProps : {
            //                 innerHTML : params.row.url
            //             }
            //         })
            //     }
            // }
            ],
            config : {
                title : '编辑引用'
            },
            selectQuateList:[],
            resourceList : []
        };
    },
 
    methods: {
        /**
         * 打开弹出框，并初始化数据
        */
        init(resourceList){
            console.log(resourceList)
            this.selectQuateList = resourceList;
            this.selectQuateModel = true;
            this.queryAllRefer();
        },
        /**
         * 获取所有引用资源
        */
        queryAllRefer(){
            var url = constGlobal.HostCMSAdmin + "/allRefer/search";
            this.allReferList = [];
            this.loading = true;
            http.apiGet(url).then(res => {
                if (res.status == 0) {
                    this.loading = false;
                    if(res.data){
                        this.allReferList = res.data;
                    }
                    for(var i = 0 ; i < this.allReferList.length ; i++){
                        this.allReferList[i]._checked = false;
                    }
                    for(var i = 0 ; i < this.allReferList.length ; i++){
                        for(var j = 0 ; j < this.selectQuateList.length ; j++){
                            if(this.allReferList[i].id == this.selectQuateList[j].id){
                                this.allReferList[i]._checked = true;
                            }
                        }
                    }
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },

        quateSelectChange(selection){
            console.log(selection)
            this.selectQuateList = selection;
        },
        /**
         * 保存
        */
        selectVersionOK () {
            this.$emit("submitQuate");
            this.selectQuateModel = false;
            
        },
        /**
         * 更新页面关联资源
        */
        updateReferList(){
            var url = constGlobal.HostCMSAdmin + "pageRReferList/update";
            var ids = [];
            for(var i = 0 ; i < this.selectQuateList.length ; i++){
                ids.push(this.selectQuateList[i].id)
            }
            var param = {
                pageId : this.$route.query.pageId,
                referIdList : ids
            }
            http.apiPost(url , param).then(res => {
                if (res.status == 0) {
                    this.selectVersionOK();
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        cancel () {
            this.$emit("cancelQuate" );
            this.selectQuateModel = false;
        }
     
    }
};
</script>

<style lang="scss">
    @import '~assets/css/public.scss';
    @import '~assets/css/flexComp.scss';
    .selectQuateModel{
        height : 400px;
        .selectVersionResult{
            height: 20px;
            align-items: center;
            margin-bottom: 16px;
            height:50px;
            .selectPageResultText{
                font-size:14px;
            }
        }
        .selectVersionContent{
            min-height:400px;
        }
        tr{
            cursor:pointer;
        }
    }
</style>
