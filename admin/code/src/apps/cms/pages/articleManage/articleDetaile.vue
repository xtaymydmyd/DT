<template>
    <div class="artcleDetaile" >
        <layout-container>
            <div class="flex  form">
                <Form ref="formValidate" :model="formValidate"  :label-width="80">
                    <FormItem label="类型：" >
                       {{formValidate.selectName}}
                    </FormItem>
                    <!-- <FormItem label="标签：" >
                        <div class="tips flex  flex-align-items flex-wrap">
                            <div class=" flex flex-align-items flex-wrap">
                                <div class="tipsContent"  v-if="tipsCheckedList.length > 0" v-for="(item,index) in tipsCheckedList" :key="index">{{item.tagName}}</div>
                                <div v-else-if="tipsCheckedList.length == 0">暂无标签</div>
                            </div>
                        </div>
                    </FormItem> -->
                    <!-- <FormItem label="关键词：" >
                        <div class="tips flex flex-align-items flex-wrap">
                            <div class=" flex flex-align-items flex-wrap">
                                <div class="tipsContent"  v-for="(item,index) in keyWordList" :key="index">{{item}}</div>
                            </div>
                        </div>
                    </FormItem> -->
                    <FormItem label="标题："  >
                       {{formValidate.name}}
                    </FormItem>
                    <FormItem label="描述：">
                            <div v-if="formValidate.desc=='' || formValidate.desc== null">暂无描述</div>
                            <div v-else class=" flex flex-align-items flex-wrap" style="width:300px;">
                               {{formValidate.desc}}
                            </div>
                             
                    </FormItem>
                    <FormItem 
                        v-for="(item, index) in extendList"
                        :label="item.description+'：'" 
                        :key="index"
                        v-if="item.name == 'link'"
                        >
                        <div class="" style="width:500px;">{{formValidate.meta[item.name]}}</div>
                        <!-- <Input v-model="formValidate.meta[item.name]" clearable  style="width:350px;" :placeholder="'最多输入'+lengthList.linkLength+'字数'"></Input> -->
                        <div v-if="formValidate.meta[item.name]=='' || formValidate.content== null">暂无{{item.description}}</div>
                    </FormItem>
                    <!-- <FormItem 
                        label="发布时间:" 
                        prop="content" 
                        v-for="(item, i) in extendList"
                        :key="i"
                        v-if="item.name == 'time'"
                        >
                        <div v-if="formValidate.postPublishCreateTime=='' || formValidate.postPublishCreateTime== null">暂无发布时间</div>
                        <div  style="min-height:5px;" v-html="formValidate.postPublishCreateTime"></div>
                    </FormItem> -->
                    <FormItem label="封面：">
                        <div class="headPic flex flex-align-items flex-wrap">
                             <div v-for="(item,index) in formValidate.imgIds" :key="index" >
                                <div v-if="item==null || item==''" >暂无图片</div>
                                <div  class="uploadImg"  v-else >
                                    <img :src='picUrl+item'/>
                                    <div class="imgView">
                                        <Icon type="ios-eye-outline" size="30" @click.native="handleView(item)"></Icon>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </FormItem>
                    <!-- <FormItem label="链接：">
                       {{formValidate.link}}
                    </FormItem> -->
                    <!-- <FormItem label="内容：">
                        <div v-if="formValidate.content=='' || formValidate.content== null">暂无内容</div>
                        <div  style="min-height:5px;" v-html="formValidate.content"></div>
                    </FormItem> -->
                    <FormItem 
                        label="内容：" 
                        prop="content" 
                        v-for="(item, i) in extendList"
                        :key="i"
                        v-if="item.name == 'content'"
                        :class="[item.hasOwnProperty('must') ? '':'ivu-form-item-required']">
                        <div v-if="formValidate.content=='' || formValidate.content== null">暂无内容</div>
                        <div  style="min-height:5px;" v-html="formValidate.content"></div>
                    </FormItem>
                </Form>
                <Modal title="预览" v-model="visibleImg">
                    <img :src="picUrl+imgName" v-if="visibleImg" style="width: 100%">
                </Modal>
            </div>
            
        </layout-container>
    </div>
</template>

<script>
/************************************************
 * @author   : baoxun
 * @date     : 2018-11-5
 * @direction: 文章详情
 ************************************************/
import layoutContainer from 'components/layout/layoutContainer.vue'

    export default {
        name:"buildEditor",
        components: {
            layoutContainer  
        },
        data () {
            return {
                typeList:[],                //类型的层级选择
                loadingModel:true,
                keyWordList:[],             //关键词列表
                keyWordShow:false,          //关键词保存的状态
                keyWord:'',                 //单个关键词的输入
                keyWordModel:false,         //关键词状态
                tipsList:[],                //标签列表
                tipsCheckedList:[],         //标签列表
                checkedList:[],
                tipsModel:false,            //B标签弹出框
                imgLoading: false,          //照片按钮加载中
                picUrl: constGlobal.HostSource,                 //图片上传地址           
                uploadImgs: [],             //图片上传列表
                visibleImg:false,           //查看图片
                imgurl:constGlobal.HostFileUpload,
                imgName: '',
                postId:'',
                mustData:{},
                mustList:[],                //必填字段
                extendData:{},              //扩展字段数据
                extendList:[],              //扩展字段
                lengthList:{                //可配置的长度限制
                    tipsLength:10,           //标签的长度
                    keyWordLength:20,        //关键词长度
                    keyWordInputLength:6,    //关键词输入长度
                    uploadImgLength:1,       //上传图片
                    descLength:200,          //描述内容
                    titleLength:20,
                },
                formValidate: {             //表单
                    name: '',               //
                    select: "",
                    selectName:"",
                    desc: '',
                    link:"",
                    imgIds:[],              //图片id
                    content:'',             //编辑器内容
                     meta:{}
                },
               
            }
        },
        mounted() {
            this.getExtend();
            this.getMust();
            this.getTypeList();
            this.$nextTick(function() {
                window.eventHub.$emit("changePath", [{
                    title : "文章列表",
                    name:"articleList"
                },{
                        title : "文章详情",
                        name:"articleDetaile",
                        query : {
                            postId:this.$route.query.postId,
                
                        }

                    }
                ],1);
            })
        },
        methods: {
            //获取文章
            getTypeList() {
                let url = constGlobal.HostFiremanRecruitArticleManage + '/post/getPostDetail?postId='+this.$route.query.postId;
                let paramOptions = {
                };
                http.apiGet(url, paramOptions).then(res => {
                    if(res.status == 0) {
                        this.formValidate = {
                            name:res.data.title,
                            desc:res.data.brief,
                            content:res.data.content,
                            imgIds:[],
                            selectName:res.data.typeName,
                            select:res.data.typeIdList,
                            meta:res.data.meta
                        };
                        this.formValidate.imgIds.push(res.data.cover);
                        this.tipsCheckedList=res.data.postTagList;
                        this.initExtendConfigure()//渲染扩展字段
                    }else {
                        common.toastMsg(res.message,"error");
                    }
                })
            },
            //获取必须填写字段
            getMust(){
                let url = constGlobal.HostFiremanRecruitArticleManage + '/post/getPostNotNullField';
                let paramOptions = {
                };
                http.apiGet(url, paramOptions).then(res => {
                    if(res.status == 0) {
                        this.mustData=res.data;
                    }else {
                        common.toastMsg(res.message);
                    }
                    //console.log(this.mustData,"必须填写总集和");
                })
                .catch(res => {
                    common.toastMsg(res.message);
                });
            },
            //获取扩展字段
            getExtend(){
                let url = constGlobal.HostFiremanRecruitArticleManage + '/post/getPostExtDict';
                let paramOptions = {
                };
                http.apiGet(url, paramOptions).then(res => {
                    if(res.status == 0) {
                        this.extendData=res.data;
                       // console.log(this.extendData,"扩展字段")
                    }else {
                        common.toastMsg(res.message);
                    }
                })
               
            },
             //编辑渲染的扩展字段的配置
            initExtendConfigure(){
                this.extendList=[];
                //提取编辑初始化的typeID
                let typeId="",extendMap=[];
                for(let j=0 ; j < this.formValidate.select.length; j++ ){
                    if(j == this.formValidate.select.length - 1){
                        typeId=this.formValidate.select[j]
                    }
                };
                //锁定文章的扩展字段
                for(let i in this.extendData){
                    if(typeId == i){
                        extendMap=this.extendData[i];
                    };    
                };
                 //锁定文章的必填字段
                for(let i in this.mustData){
                    if(typeId == i){
                        this.mustList=this.mustData[i];
                    };    
                };
                //奖必填字段添加到扩展字段当中
                for(let f = 0 ; f < extendMap.length ; f++){
                    for(let m = 0 ; m < this.mustList.length ; m++){
                        if(extendMap[f].name == this.mustList[m]){
                            extendMap[f].must=extendMap[f].name;
                        }
                    }
                   
                };
               
                this.extendList=extendMap; 
                console.log(this.extendList,"单个的扩展字段")
            },
            //预览
            handleView (url) {
                this.imgName = url;
                this.visibleImg = true;
            },
            //取消
            goBack(){
                history.back();
            },

        }
    }
</script>