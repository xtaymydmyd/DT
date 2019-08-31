<template>
    <div class="signUpTable" style="margin:-16px">
        <layout-container style="padding:15px">
            <!-- 表头通用 -->
            <div class="searchDiv flex flex-justify-content-between flex-align-items">
                    <div class="flex">
                        <div class="flex">
                            <span  style="line-height:32px">文章类型：</span>
                            <Cascader :data="typeList" v-model="searchObj.typeCode" style="width:168px" change-on-select></Cascader>
                        </div>
                        <div class="flex">
                            <span  style="line-height:32px;margin-left:8px">文章标题：</span>
                            <Input v-model="searchObj.title" placeholder="请输入" style="width:168px" clearable></Input>
                        </div>
                        <div class="flex">
                            <span  style="line-height:32px;margin-left:8px">文章状态：</span>
                            <Select v-model="searchObj.status" clearable style="width:168px">
                                <Option v-for="item in statusList" :value="item.status"  :key="item.status">{{ item.statusName }}</Option>
                            </Select>
                        </div>
                        <div class="flex" v-show="show==1 ">
                            <Button type="primary" style="font-size:12px; margin-left:8px" @click="search()">搜索</Button>
                            <Button style="font-size:12px;margin-left:8px" @click="resizeData">重置</Button>
                            <div class="open" @click="open(2)">
                                <a style="margin-left: 8px;"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">展开 </font></font><i class="anticon anticon-down"><svg viewBox="64 64 896 896" class="" data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path></svg></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="flex" v-show="show==1 ">
                        <Button type="primary" style="font-size:12px; margin-left:8px" @click="goPath('buildEditor',{postId:null,typeName:'新建'})">新建</Button>
                    </div>
            </div>
            <!-- 部局总队 -->
            <div  v-show="show== 2">
                <div class="searchDiv flex flex-justify-content-between flex-align-items">
                    <div class="flex">
                        <div class="flex" v-show="identity==1">
                            <span  style="line-height:32px;">创建单位：</span>
                            <Select v-model="searchObj.deptIdCode" clearable filterable style="width:168px;margin-right:8px">
                                <Option v-for="item in companyList" :value="item.deptId" :key="item.deptId">{{ item.regionName }}</Option>
                            </Select>
                        </div>
                        <div class="flex">
                            <span  style="line-height:32px;">创建开始：</span>
                            <DatePicker ref="selectStart"  type="datetime" :value="createStartTime" format="yyyy-MM-dd"  @on-change="startChange"   placeholder="请选择开始时间" style="width: 168px"></DatePicker>
                        </div>
                        <div class="flex">
                            <span  style="line-height:32px;margin-left:8px">创建结束：</span>
                            <DatePicker ref="selectEnd"  type="datetime" :value="createEndTime" format="yyyy-MM-dd"  @on-change="endChange"   placeholder="请选择结束时间" style="width: 168px"></DatePicker>
                        </div>
                        <div class="flex">
                            <Button type="primary" style="font-size:12px; margin-left:8px" @click="search()">搜索</Button>
                            <Button style="font-size:12px;margin-left:10px" @click="resizeData">重置</Button>
                            <div class="open"  @click="open(1)">
                                <a style="margin-left: 8px;"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">收起 </font></font><i class="anticon anticon-up"><svg viewBox="64 64 896 896" class="" data-icon="up" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3A8 8 0 0 0 140 768h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z"></path></svg></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="flex">
                        <Button type="primary" style="font-size:12px; margin-left:8px" @click="goPath('buildEditor',{postId:null,typeName:'新建'})">新建</Button>
                    </div>
                </div>
            </div>
            <!-- 表格 -->
            <div class="tableDiv" style="min-width:976px; overflow:auto">
                <Table :loading="loading" ref="selection"   :columns="tableHeader" :data="tableList" @on-select-all="checked(selection)" @on-selection-change="checked(selection)"></Table> 
            </div>
            <!-- 分页 -->
            <div class="pager flex flex-justify-content-between">
                <div>共{{total}}个记录</div>
                <Page :total="total" show-total show-elevator show-sizer :current="pager.pageNum" placement="top"
                    @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size-opts="pageSizeOpts"
                    :page-size="pager.pageSize"></Page>
            </div>
        </layout-container>
        <Modal
            v-model="modal"
            :styles="{top: '200px'}"
            width="300"
            @on-ok="msgOk()"
            @on-cancel="cancelModal">
            <p style="text-align:center;font-size:16px;margin-bottom:20px;">提示</p>
            <p style="text-align:center;font-size:14px;color:#666;margin-bottom:5px;">是否{{tips}}</p>
        </Modal>
         <Modal
            v-model="publishTime"
            title="发布提示"
            width="400"
            @on-ok="publish()"
             :loading="loadingModel"
            @on-cancel="cancelPublish">
            <div v-show="publishShow==1">
                <div class="flex" style="margin-top:10px" >
                    <div class="flex-justify-content-right flex flex-1  flex-align-items">开始日期：</div>
                    <div class="flex-justify-content-left flex flex-2">
                        <DatePicker ref="selectDate"  type="datetime" :value="startTime" format="yyyy-MM-dd HH:mm"  @on-change="startTimeChange"   placeholder="必须选择开始时间" style="width: 200px"></DatePicker>
                    </div>
                </div>
                <div class="flex" style="margin-top:10px">
                    <div class="flex-justify-content-right flex flex-1  flex-align-items">结束日期：</div>
                    <div class="flex-justify-content-left flex flex-2">
                        <DatePicker ref="selectDate" type="datetime" :value="endTime" format="yyyy-MM-dd HH:mm" @on-change="endTimeChange"   placeholder="请选择结束时间" style="width: 200px"></DatePicker>
                    </div>
                </div>
            </div>
            <div v-show="publishShow==0" style="text-align:center;font-size:16px;color:#666;margin-bottom:5px;">是否发布</div>
        </Modal>
         <Modal
            v-model="sortModel"
            title="排序"
            width="400"
            @on-ok="sort()"
            :loading="loadingSort"
            @on-cancel="cancelSort">
            <div class="flex" style="margin-top:10px">
                <div class="flex-justify-content-right flex flex-1  flex-align-items">排序号：</div>
                <div class="flex-justify-content-left flex flex-2">
                    <InputNumber :max='100000' :min="0" v-model="sortCount" placeholder="请输入" :step="1" :precision="0"  style="width: 200px"></InputNumber>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script> 
/************************************************
 * @author   : baoxun
 * @date     : 2018-10-23
 * @direction: 文章列表
 ************************************************/
import layoutContainer from 'components/layout/layoutContainer.vue'

export default {
    components: {
        layoutContainer,
    },
    data() {
        return {
            searchObj:{
                typeCode:[],                     
                title:"",
                status:'',    //文章状态
                deptIdCode:'',   //创建单位
                
            },
            createStartTime:'',
            createEndTime:'',
            typeList:[],
            tips:"",
            currentMarks:0,
            modal:false,
            pager: {                                // 分页
                pageSize: 20,
                pageNum: 1
            },
            loading: true,                          // 表格加载中...
            loadingModel:true,
            total: 0,                               //总数
            pageSizeOpts: [20,50,100],          // 分页可选值
            tableHeader: [                          // 表头
                {
                    title: '标题',
                    align: 'left',
                    render:(h, params) => {
                        return h('div', {
                            style: {
                                color:"#3399ff",
                                cursor: "pointer"
                            },
                            on: {
                                click: () => {
                                       this.goPath("articleDetaile",{postId:params.row.id})
                                }
                            }
                         }, params.row.title)
                        //  })
                    }
                   
                },
                {
                    title: '类型',
                    key: 'typeName',
                    align: 'left',
                    width: 125,
                   
                },
                {
                    title: '有效状态',
                    width: 90,
                    key: 'validState',
                   align: 'left',
                   
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    width: 170,
                   align: 'left',
                  
                },
                {
                    title: '发布状态',
                    key: 'statusName',
                    width: 90,
                   align: 'left',
                 
                },
                {
                    title: '排序',
                    key: 'order',
                    width: 100,
                   align: 'left',
               
                },
                {
                    title: '操作',
                    key: '',
                    width:210,
                    align: 'left',
                
                    render: (h, params) => {
                        let btnList=[];
                        //已发布-取消发布、查看
                        if(params.row.publishStatus==1){
                       
                            btnList.push(
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                       
                                        color:'#ed3f14',
                                        fontSize:"15px"
                                    },
                                    on: {
                                        click: () => {
                                        this.showModal(2,params.row)
                                        }
                                    }
                                }, '取消发布'));
                        if(this.bureau==1){
                            btnList.push(h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                      
                                        color:'#2d8cf0',
                                        fontSize:"15px"
                                    },
                                    on: {
                                        click: () => {
                                        this.sortbtn(params.row);
                                        }
                                    }
                                }, '排序'))
                        }
                        btnList.push(
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        color:'#ed3f14',
                                        fontSize:"15px"
                                    },
                                    on: {
                                        click: () => {
                                        this.showModal(3,params.row)
                                        }
                                    }
                                }, '删除'),
                            );
                        //未发布-发布、编辑、查看、删除、排序
                        }else if(params.row.publishStatus== 0){
                        if( params.row.status== 1 ||params.row.status== 2){
                                btnList.push(
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                            },
                                            style: {
                                               
                                                color:'#2d8cf0',
                                                fontSize:"15px"
                                            },
                                            on: {
                                                click: () => {
                                                    this.pushlishModel(params.row);
                                                }
                                            }
                                        }, '发布'),
                                )
                         }
                            //公共
                            btnList.push(
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                       
                                        color:'#2d8cf0',
                                        fontSize:"15px"
                                    },
                                    on: {
                                        click: () => {
                                            //提交的时候，清除缓存id，防止刷新，页面有数据
                                            this.changeStatus({postId:params.row.id,typeName:"编辑"
                                            })
                                           
                                        }
                                    }
                                }, '编辑'));
                            if(this.bureau==1){
                            btnList.push(     
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                      
                                        color:'#2d8cf0',
                                        fontSize:"15px"
                                    },
                                    on: {
                                        click: () => {
                                        this.sortbtn(params.row);
                                        }
                                    }
                                }, '排序'));
                            }
                            btnList.push(
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        color:'#ed3f14',
                                        fontSize:"15px"
                                    },
                                    on: {
                                        click: () => {
                                        this.showModal(3,params.row)
                                        }
                                    }
                                }, '删除')
                            )
                            
                        }
                        return btnList  
                    }
                }
            ],
            tableList:[],                               //表格数据
            paramsList:{},
            publishTime:false,
            statusList:[],
            endTime:"",
            startTime:"",
            startDate:new Date(),
            options3: {
                    disabledDate (date) {
                        // let initdate = new Date("2017-07-01") - 86400000;
                        // return (date && date.valueOf() < initdate) || (date && date.valueOf() >= new Date())
                        let initdate=86400000-(Date.now() - new Date().getTime());
                        return date && date.valueOf() < Date.now() - initdate;
                    }
            },
            sortModel:false,                    //排序弹框
            sortCount:0,                        //排序号码
            loadingSort:false,
            identity:0,                         //人员身份 0:总队，1:布局。
            show:1,
            companyList:[],
            createStartTime:'',
            createEndTime:'',
            publishShow:1,
            bureau:0
        }
    },
    created () {
        this.getTypeList();   
    },
    mounted() {
        this.$nextTick(function() {
            window.eventHub.$emit("changePath", [{
                title : "文章列表",
                name:"articleList"
            }
            ],1);
        })
        this.getTableList();
        this.getStatusList();
        this.getCompany();
    },
    methods: {
        // 获得数据列表
        getTableList() {
            var typeId=[],deptId=[];
            if(this.searchObj.typeCode.length > 0){
                for(let j=0 ; j < this.searchObj.typeCode.length ; j++ ){
                    if(j == this.searchObj.typeCode.length - 1){
                        typeId.push(this.searchObj.typeCode[j]);
                    }
                };
            }; 
            let url = constGlobal.HostFiremanRecruitArticleManage + '/post/getRecruitRCMSPostList';
            let paramOptions = {
                orderBy:'createTimeDesc',
                pager: this.pager,
                title:this.searchObj.title,
                typeIdList:typeId,
                status:this.searchObj.status,
                deptId:this.searchObj.deptIdCode,
                createStartTime:this.createStartTime,
                createEndTime:this.createEndTime,
                websiteId:constGlobal.websiteId
            };
            http.apiPost(url, paramOptions).then(res => {
                this.loading = false;
                if(res.status == 0) {
                    this.total = res.total;
                    this.tableList = res.data;
                    if(res.extData== -1 || res.extData== 1 || res.extData== 4 ){
                        this.identity=1;
                    }
                    if(res.extData== -1){this.bureau=1}
                   
                }else {
                    this.total = 0;
                    common.toastMsg(res.message);
                }
            })
            .catch(res => {
                this.total = 0;
                this.loading = false;
                common.toastMsg(res.message);
            });
        },
        //获取文章类型
        getTypeList() {
            let url = constGlobal.HostFiremanRecruitArticleManage + '/post/getPostTypeTree?websiteId='+constGlobal.websiteId+'&mark=1';
            let paramOptions = {
            };
            http.apiGet(url, paramOptions).then(res => {
                if(res.status == 0) {
                    if(res.data !=null){
                        this.typeList = res.data;  
                    }else{
                        this.typeList =[];
                    }
                }else {
                    common.toastMsg(res.message);
                }
            })
            .catch(res => {
                common.toastMsg(res.message);
            });
        },
        //获取文章状态
        getStatusList() {
            let url = constGlobal.HostFiremanRecruitArticleManage + '/post/getPostStatus';
            let paramOptions = {
               
            };
            http.apiGet(url, paramOptions).then(res => {
                if(res.status == 0) {
                    this.statusList = res.data;  
                }else {
                    common.toastMsg(res.message);
                }
            })
            .catch(res => {
                common.toastMsg(res.message);
            });
        },
        //获取创建单位
        getCompany(){
            let url = constGlobal.HostFiremanRecruitArticleManage + '/post/getDeptRRegionInfo';
            let paramOptions = {
               
            };
            http.apiPost(url, paramOptions).then(res => {
                if(res.status == 0){
                    this.companyList = res.data;  
                }else {
                    common.toastMsg(res.message);
                }
            })
            .catch(res => {
                common.toastMsg(res.message);
            });
        },
        //搜索
        search(){
            this.loading = true;
            this.pager.pageNum = 1;
            setTimeout(() => {
                this.getTableList();
            }, 500);
        },
        //重置
        resizeData(){
            console.log("111")
            this.searchObj={
                typeCode:[],                     
                title:"",
                status:'',    //文章状态
                deptIdCode:"",   //创建单位                    
            };
            this.createStartTime="",
            this.createEndTime="",  
            this.getTableList();
        },
        //新建，编辑，查看
        goPath(link,params){
           //提交的时候，清除缓存id，防止刷新，页面有数据
            sessionStorage.removeItem("data");
            this.$router.push({
                path:link,
                query:params
            })
        },
        //弹出的确定
        msgOk(){
            switch(this.currentMarks){
                case 1:     //发布
                //   this.tips="发布";
                //   this.currentMarks=1
                //   this.submit({postId:this.paramsList.id,
                //                startTime:this.paramsList.startTime,
                //                endTime:this.paramsList.endTime

                //    },"/cms/admin/post/publishPost")
                  break;
                case 2:     //取消发布
                  this.tips="取消发布";
                  this.currentMarks=2;
                  this.submit({postId:this.paramsList.id},"/post/updatePostPublishStatus")
                  break;
                case 3:     //删除
                  this.tips="删除";
                  this.currentMarks=3;
                  this.submit({postId:this.paramsList.id},'/post/deletePost')
                  break;
            }
        },
        // 发布
        pushlishModel(params){
            this.publishTime=true;
            this.paramsList=params;
            this.publishShow= params.isPhotoOrVideo; 
        },
        //发布的确定
        publish(params){
            if(this.paramsList.isPhotoOrVideo==1){
                // if(this.startTime == ""){
                //     this.loadingModel =false;
                //     setTimeout(() => {
                //         this.loadingModel =true;
                //     }, 10); 
                //     common.toastMsg("必须选择开始时间","error");
                //     this.loadingModel =false;
                //     return;
                // }else if(this.endTime != ""){
                //     if(this.startTime > this.endTime){
                //         this.loadingModel =false;
                //         setTimeout(() => {
                //             this.loadingModel =true;
                //         }, 10);
                //         common.toastMsg("结束时间应大于开始时间","error");
                //         this.loadingModel =false;
                //         return;
                //     }
                // }
                this.submit({
                        postId:this.paramsList.id,
                        websiteId:constGlobal.websiteId,     //网站表主键id
                        startTime:this.startTime,
                        endTime:this.endTime
                },"/post/publish","publish")
            }else{
                 this.submit({
                        postId:this.paramsList.id,
                        websiteId:constGlobal.websiteId,     //网站表主键id
                       
                },"/post/publish","publish")
            }
            
        },
        //取消发布
        cancelPublish(){
            this.loadingModel =false;
            this.publishTime=false;
            this.paramsList={};
            this.startTime="";
            this.endTime="";
        },
        startTimeChange(date){
            this.startTime=date;
             console.log(this.endTime)
        },
        endTimeChange(date){
            this.endTime=date;
            console.log(this.endTime)
        },
        //排序
        sortbtn(params){
            this.sortCount=0;
            this.sortModel=true;
            this.paramsList=params;
            this.sortCount=params.order;

        },
        sort(){
            if(this.sortCount < 1){
                this.loadingSort =false;
                setTimeout(() => {
                    this.loadingSort =true;;
                }, 10); 
                common.toastMsg("请输入正确的序号","error");
                return;
            };
            this.submit({postId:this.paramsList.id,
                        num:this.sortCount,
                        },"/post/updatePostSort")
        },
        cancelSort(){
            this.sortModel=false;
            this.paramsList={};
        },
        //各种按钮操作
        submit(param,urls,type){
            let url = constGlobal.HostFiremanRecruitArticleManage + urls;
            let paramOptions = param;
            http.apiPost(url, paramOptions).then(res => {
                if(res.status == 0) {
                    common.toastMsg("操作成功","success");
                    this.getTableList();
                    this.sortCount=0;
                    this.publishTime=false;
                    this.startTime="";
                    this.endTime="";
                }else {
                    if(type=="publish"){
                        this.loadingModel =false;
                        setTimeout(() => {
                            this.loadingModel =true;
                        }, 10);
                        this.loadingModel =false;
                    }
                    common.toastMsg(res.message,"error");
                }
               
            }).catch(res => {
                common.toastMsg(res.message,'error');
            });
        },
        //对话框显示
        showModal(mark,params){
            this.modal=true;
            this.paramsList=params;
            switch (mark){
                case 1:     //发布
                //   this.tips="发布";
                //   this.currentMarks=1
                  break;
                case 2:     //取消发布
                  this.tips="取消发布";
                  this.currentMarks=2;
                  break;
                case 3:     //删除
                  this.tips="删除";
                  this.currentMarks=3;
                  break;
            }
        },
        //对话框隐藏
        cancelModal(){
            this.modal=false;
            this.paramsList={};
        },
        //点击编辑，修改状态
        changeStatus(param){
            // let url = constGlobal.HostFiremanRecruitArticleManage + "/post/updatePostStatus";
            // let paramOptions = param;
            // http.apiPost(url, paramOptions).then(res => {
            //     if(res.status == 0) {
            //         this.goPath("buildEditor",param);
            //     }else {
            //         common.toastMsg(res.message,"error");
            //     }
            // }).catch(res => {
            //     common.toastMsg(res.message,'error');
            // });
            this.goPath("buildEditor",param);
        },
        //展开首期
        open(type){
            type==1 ? this.show=1 : this.show=2;
        },
        // 页码改变
        pageChange(pageNum) {
            this.loading = true;
            this.pager.pageNum = pageNum;
            setTimeout(() => {
                this.getTableList();
            }, 500);
        },
        // 页码尺寸改变
        pageSizeChange(pageSize) {
            // console.log(pageSize)
            this.loading = true;
            this.pager.pageSize = pageSize;
            setTimeout(() => {
                this.getTableList();
            }, 500);
        },
         // 显示: '加载中...'
        showLoading () {
            this.$Spin.show({
                render: (h) => {
                    return h('div', [
                        h('Icon', {
                            'class': 'demo-spin-icon-load',
                            props: {
                                type: 'load-c',
                                size: 28
                            }
                        }),
                        h('div', 'Loading')
                    ])
                }
            });
        },
        // 隐藏: '加载中...'
        hideLoading () {
            this.$Spin.hide();
        },
        startChange(data){
            this.createStartTime=data   
        },
        endChange(date){
            this.createEndTime=date;   
        },
    }
}
</script>

<style lang="scss">
.signUpTable{
    .layout-container .layout-container-body{
        padding:0 !important;
    }
    .searchDiv{
        margin-bottom:15px;
        .open{
            height:32px;
            line-height: 32px;
            a {
                color: #1890ff;
                background-color: transparent;
                text-decoration: none;
                outline: none;
                cursor: pointer;
                transition: color .3s;
                -webkit-text-decoration-skip: objects;
            }
            .anticon {
                display: inline-block;
                font-style: normal;
                vertical-align: -.125em;
                text-align: center;
                text-transform: none;
                line-height: 0;
                text-rendering: optimizeLegibility;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
        }
    }
    .pager{
        margin-top:15px;
    }
    .ivu-btn-text:active, .ivu-btn-text.active{
        color: #3091f2;
        background-color: transparent;
        border-color: transpar
    }
     .ivu-btn-text:focus {
        box-shadow: none;
    }
    .ivu-table-cell{
        padding-left: 10px !important;
        padding-right: 10px !important;
    }
}
</style>
