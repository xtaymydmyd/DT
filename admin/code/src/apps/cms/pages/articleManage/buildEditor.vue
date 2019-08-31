<template>
    <div class="buildEditor " >
        <layout-container>
            <div class="flex flex-justify-content form">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                    <FormItem label="类型:" prop="type" >
                        <Cascader :disabled="disabled" :data="typeList" v-model="formValidate.select" style="width:350px"  @on-change="configure"></Cascader>
                    </FormItem>
                    <!-- <FormItem label="标签:" prop="tips">
                        <div class="tips flex flex-align-items flex-wrap">
                            <div class=" flex flex-align-items flex-wrap">
                                <div class="tipsContent"  v-show="tipsCheckedList.length > 0" v-for="(item,index) in tipsCheckedList" :key="index">{{item}}</div>
                                <div class="tipsAdd" @click="addTips()">添加</div>
                            </div>
                        </div>
                    </FormItem> -->
                    <!-- <FormItem label="关键词" prop="keyWord">
                        <div class="keyWord flex flex-align-items">
                            <div class="keyWordContent flex flex-align-items flex-wrap"> -->
                                <!-- <Tag v-for="(item,index) in keyWordList" :key="index" closable @on-close="deleteKeyWord(index)">{{item}}</Tag>
                                <div class="keyWordAdd" style="height:25px;line-height:25px;" v-if="keyWordShow==false" @click="keyWordShow=true">添加</div>
                            </div>                           
                        </div>
                    </FormItem> -->
                    <FormItem label="标题:" class="ivu-form-item-required">
                        <Input v-model="formValidate.name" clearable :placeholder="'最多输入'+lengthList.titleLength+'字数'" style="width:350px;" :maxlength="lengthList.titleLength" ></Input>
                    </FormItem>
                    <FormItem label="描述:" prop="desc" v-if="mustList.indexOf('brief') == -1">
                        <Input v-model="formValidate.desc" type="textarea" :maxlength="lengthList.descLength" :autosize="{minRows: 4,maxRows: 7}" :placeholder="'最多输入'+lengthList.descLength+'字数'" style="width:350px;"></Input>
                    </FormItem>
                    <FormItem label="描述:" prop="desc" v-else-if="mustList.indexOf('brief')== 1" :class="[mustList.indexOf('brief')== -1 ? '':'ivu-form-item-required']">
                        <Input v-model="formValidate.desc" type="textarea" :maxlength="lengthList.descLength" :autosize="{minRows: 4,maxRows: 7}" :placeholder="'最多输入'+lengthList.descLength+'字数'" style="width:350px;"></Input>
                    </FormItem>
                    <FormItem 
                        v-for="(item, index) in extendList"
                        :label="item.description+':'" 
                        :key="index"
                        :class="[ item.hasOwnProperty('must') ? 'ivu-form-item-required':'']"
                        v-if="item.name == 'link'"
                        >
                        <!-- <DatePicker v-if="item.name == 'time'"  v-model="formValidate.meta[item.name]" @on-change="timeChange" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请选择发布时间" style="width: 350px"></DatePicker> -->
                        <Input  v-model="formValidate.meta[item.name]" clearable  style="width:350px;" :placeholder="'最多输入'+lengthList.linkLength+'字数'"></Input>
                    </FormItem>
                    <FormItem label="封面:" style="margin-bottom:10px;" v-if="mustList.indexOf('cover')== -1">
                    
                        <div class="headPic flex flex-align-items flex-wrap">
                             <div v-for="(item , index) in uploadImgs" :key="index"  class="uploadImg">
                                <img :src='detUrl+item.url'/>
                                <div class="imgView">
                                    <Icon type="ios-eye-outline" size="30" @click.native="handleView(item.url)"></Icon>
                                    <Icon type="ios-trash-outline" size="30" @click.native="removePic(item,index)"></Icon>
                                </div>
                            </div>
                            <div v-show="uploadImgs.length < lengthList.uploadImgLength" class="picUpload" @click="choosePic">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                            <div class="cover" style="margin-top:-60px;">封面要求：782像素（宽）× 460像素（高)</div>
                            <!-- 裁剪 -->
                            <div class="cut"  @click="selectPic">裁剪</div>
                            <input type="file" accept="image/*" style="display:none;" ref="selectPic" @change="selectPicChange">
                        </div>
                    </FormItem>
                     <FormItem label="封面:" prop="cover" style="margin-bottom:10px;" v-else-if="mustList.indexOf('cover')== 1" :class="[mustList.indexOf('cover')== -1 ? '':'ivu-form-item-required']">
                        <div class="headPic flex flex-align-items flex-wrap">
                             <div v-for="(item , index) in uploadImgs" :key="index"  class="uploadImg">
                                <img :src='detUrl+item.url'/>
                                <div class="imgView">
                                    <Icon type="ios-eye-outline" size="30" @click.native="handleView(item.url)"></Icon>
                                    <Icon type="ios-trash-outline" size="30" @click.native="removePic(item,index)"></Icon>
                                </div>
                            </div>
                            <div v-show="uploadImgs.length < lengthList.uploadImgLength" class="picUpload" @click="choosePic">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                            <div class="cover" style="margin-top:-60px;">封面要求：782像素（宽）× 460像素（高)</div>
                            <!-- 裁剪 -->
                            <div class="cut"  @click="selectPic">裁剪</div>
                            <input type="file" accept="image/*" style="display:none;" ref="selectPic" @change="selectPicChange">
                        </div>
                    </FormItem>
                    <FormItem 
                        label="内容:" 
                        prop="content" 
                        v-for="(item, i) in extendList"
                        :key="i"
                        v-if="item.name == 'content'"
                        :class="[item.hasOwnProperty('must') ? 'ivu-form-item-required':'']">
                        <div ref="newsEditor" style="min-height:440px;width:800px">
                            <VueUEditor @ready="editorReady" style=" width:700px;height:300px;margin-top:10px;margin-right: 10px;"></VueUEditor>
                        </div>
                    </FormItem>
                    <FormItem>
                        <div class="flex flex-justify-content" style="margin-top:10px;">
                            <Button type="primary" @click="saveMsg()">保存</Button>
                            <Button type="primary" @click="submitCheck()" style="margin-left: 8px" v-if="publishBtnStatus">发布</Button>
                            <Button  style="margin-left: 8px" v-else>请稍后...</Button>
                            <Button @click="goBack()" style="margin-left: 8px">取消</Button>
                        </div>
                    </FormItem>
                </Form>
               
                <Modal
                    v-model="tipsModel"
                    title="添加标签"
                    width="440"
                    @on-ok="getCheckedTips()"
                    @on-cancel="cancelTips()">
                    <p>
                        <div class="flex">
                            <CheckboxGroup v-model="checkedList" class="flex flex-wrap">
                                <Checkbox style="width:94px; height:30px;" v-for="(item,index) in tipsList" :key="index" :label="item.tagId">
                                    <span>{{item.tagName}}</span>
                                </Checkbox>
                            </CheckboxGroup>
                        </div>
                    </p>
                </Modal>
                <Modal
                    v-model="keyWordShow"
                    title="添加关键词"
                    width="200"
                    class-name="keyWordShow-modal"
                    :loading="loadingModel"
                    @on-ok="addKeyWord()"
                    @on-cancel="cancelKeyWord()">
                    <p>
                        <div class="flex flex-justify-content" v-if="keyWordShow" >                               
                            <Input v-model="keyWord"  clearable placeholder="" style="width:120px;" :maxlength="lengthList.keyWordInputLength"></Input>
                        </div>
                    </p>
                </Modal>
                <Modal title="预览" v-model="visibleImg">
                    <img :src="detUrl+imgName" v-if="visibleImg" style="width: 100%">
                </Modal>
                <Modal
                    v-model="publishTime"
                    title="发布提示"
                    width="400"
                    @on-ok="submitMsg()"
                    :loading="loadingModel1"
                    @on-cancel="cancelPublish">
                    <div>
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
                
                </Modal>
                <div class="img-Modal-mask" v-if="imgShow">
                    <div class="img-Modal-wrap">
                        <div class="img-Modal">
                            <div class="img-modal-content">
                                <div class="img-modal-body">
                                    <img-Editor v-on:childImg="listenerImg"></img-Editor>
                                </div>
                                <div class="img-modal-footer">
                                    <Button @click="cancelImgShow()">取消</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>   
        </layout-container>
    </div>
</template>
<script>
/************************************************
 * @author   : baoxun
 * @date     : 2018-10-25
 * @direction: 新建文件
 ************************************************/
import layoutContainer from 'components/layout/layoutContainer.vue'
import VueUEditor from 'components/UEditor/UEditor'
import imgEditor from '../../components/image-editor/image-editor.vue'
import lrz from 'lrz';
    export default {
        name:"buildEditor",
        components: {
            layoutContainer,
            VueUEditor,
            imgEditor
        },
        data () {
            return {
                publishBtnStatus:true,
                imgShow:false,
                disabled:false,
                typeList:[],                //类型的层级选择
                loadingModel:true,
                loadingModel1:true,
                publishTime:false,
                keyWordList:[],             //关键词列表
                keyWordShow:false,          //关键词保存的状态
                keyWord:'',                 //单个关键词的输入
                keyWordModel:false,         //关键词状态
                tipsList:[],                //标签列表
                tipsCheckedList:[],         //标签列表
                checkedList:[],
                tipsModel:false,            //B标签弹出框
                title:"新建",                //页面标题
                imgLoading: false,          //照片按钮加载中
                picUrl: '',                 //图片上传地址 
                detUrl:constGlobal.HostSource,          
                uploadImgs: [],             //图片上传列表
                visibleImg:false,           //查看图片
                imgurl:constGlobal.HostFileUpload,
                imgName: '',
                postId:'',
                typeCodeId:0,
                Id:'',
                editorInstance: '',
                mustData:{},
                mustList:[],                //必填字段
                extendData:{},              //扩展字段数据
                extendList:[],              //扩展字段
                btnStatus:false,             //按钮的保存状态
                lengthList:{                //可配置的长度限制
                    tipsLength:10,           //标签的长度
                    keyWordLength:20,        //关键词长度
                    keyWordInputLength:6,    //关键词输入长度
                    uploadImgLength:1,       //上传图片
                    descLength:200,          //描述内容
                    titleLength:100,
                    linkLength:100
                },
                formValidate: {             //表单
                    name: '',               //
                    select: [],
                    desc: '',
                    link:"",
                    imgIds:[],              //图片id
                    content:'',             //编辑器内容
                    meta:{}
                },
                ruleValidate: {
                    type: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
                    title:[{ required: true, message: '标题不能为空'}]
               },
               startTime:'',
               endTime:''
               
            }
        },
        mounted() {
            this.getTypeList();//文章类型
            //this.getTagList();//标签 
            this.getExtend();//扩展字段
            this.getMust();//必填字段
            this.judge();//判断是否为编辑
            this.$nextTick(function() {
                window.eventHub.$emit("changePath", [{
                    title : "文章列表",
                    name:"articleList"
                },{
                        title : this.$route.query.typeName,
                        name:"buildEditor",
                        query : {
                            postId:this.$route.query.postId,
                        }
                    }
                ],1);
            });
        },
        methods: {
            //判断是否是编辑
            judge(){
                //取出缓存
                let ids =JSON.parse(sessionStorage.getItem('data'));
                if(ids!= null ){
                    this.getDetaile(ids);
                    this.Id=ids;
                    this.disabled=true;
                }else if(this.$route.query.postId != null){
                    this.getDetaile(this.$route.query.postId);
                    this.Id=this.$route.query.postId
                    this.disabled=true;
                }
            },
            //获取编辑详情
            getDetaile(id){
                let url = constGlobal.HostFiremanRecruitArticleManage + '/post/getPostDetail?postId='+id;
                let paramOptions = {
                };
                http.apiGet(url, paramOptions).then(res => {
                    if(res.status == 0) {
                        this.formValidate = {
                            name:res.data.title,
                            desc:res.data.brief,
                            content:res.data.content,
                            imgIds:[],
                            select:res.data.typeIdList,
                            meta:res.data.meta
                        };
                        if(res.data.cover != null){
                            var obj={url:res.data.cover};
                            this.formValidate.imgIds.push(res.data.cover);
                            this.uploadImgs.push(obj);
                        }
                       
                            // for(let i = 0 ; i<res.data.postTagList.length ; i++){
                            //     this.checkedList.push(res.data.postTagList[i].tagId)
                            // }
                        //this.tipsCheckedList =this.checkedList;//已选标签
                        this.setUEContent(res.data.content);//富文本编辑内容
                        this.initExtendConfigure()          //渲染扩展字段
                    }else {
                        common.toastMsg(res.message);
                    }
                })
               
            },
            //获取文章类型
            getTypeList() {
                let url = constGlobal.HostFiremanRecruitArticleManage + '/post/getPostTypeTree?websiteId='+constGlobal.websiteId+'&mark=2';
                let paramOptions = {
                };
                http.apiGet(url, paramOptions).then(res => {
                    if(res.status == 0) {
                        this.typeList = res.data;
                    }else {
                        common.toastMsg(res.message);
                    }
                }) 
               
            },
            //获取标签列表
            getTagList() {
                let url = constGlobal.HostFiremanRecruitArticleManage + '/post/getPostTags';
                let paramOptions = {
                };
                http.apiGet(url, paramOptions).then(res => {
                    if(res.status == 0) {
                        this.tipsList = res.data;
                    }else {
                        common.toastMsg(res.message);
                    }
                })
               
            },
            //获取当前的选择的类型字段
            configure(value, selectedData){
                //let selectId=selectedData.map(o => o.value).join(', ');
                let selectId=[];
                selectedData.map(o => selectId.push(o.value));
                this.mustConfigure(selectId);
                this.changeExtendConfigure(selectId); 
            },
            //获取扩展字段
            getExtend(){
                let url = constGlobal.HostFiremanRecruitArticleManage + '/post/getPostExtDict';
                let paramOptions = {
                };
                http.apiGet(url, paramOptions).then(res => {
                    if(res.status == 0) {
                        this.extendData=res.data;
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
                        typeId=this.formValidate.select[j];
                        this.typeCodeId=typeId;
                    }
                }
                //锁定文章的扩展字段
                for(let i in this.extendData){
                    if(typeId == i){
                        extendMap=this.extendData[i];
                       // console.log(extendMap,"extendMap")
                    }   
                }
                //初始化编辑时锁定文章的必填字段
                for(let i in this.mustData){
                    if(typeId == i){
                        this.mustList=this.mustData[i];
                    }   
                }
                //将编辑的扩展项渲染到扩展字段当中
                // for(let i in this.formValidate.meta ){
                //     for(let j in extendMap){
                //         if(extendMap[j].name == this.formValidate.meta[i].name){
                //             extendMap[j].val=this.formValidate.meta[i].val
                //         }
                //     }
                // };
                //奖必填字段添加到扩展字段当中
                for(let f = 0 ; f < extendMap.length ; f++){
                    for(let m = 0 ; m < this.mustList.length ; m++){
                        if(extendMap[f].name == this.mustList[m]){
                            extendMap[f].must=extendMap[f].name;
                        }
                    }
                   
                }
                //console.log(this.mustList,"编辑中的必填字段")
                this.extendList=extendMap; 
                //console.log(this.extendList,"改变type类型，重制扩展字段的必填项")
            },
            //新建和改变type类型的扩展字段的配置
            changeExtendConfigure(selectId){
                this.extendList=[];
                let extendMap=[];
                //获取选取的类型
                let typeId="";
                //console.log(selectId,"挑选的selectId")
                for(let j=0 ; j < selectId.length ; j++ ){
                    if(j == selectId.length - 1){
                        typeId=selectId[j];
                        this.typeCodeId=typeId;
                    }
                }
                //锁定文章的拓展字段
                //console.log(typeId,"挑选的selectId的子类型")
                //console.log(this.extendData,"对应的的拓展字段extendData")
                for(let i in this.extendData){
                    if(typeId == i){
                        extendMap=this.extendData[i];
                    }  
                }
                
                //增加扩展字段的必填字段
                for(let f = 0 ; f < extendMap.length ; f++){
                    for(let m = 0 ; m < this.mustList.length ; m++){
                        if(extendMap[f].name == this.mustList[m]){
                            extendMap[f].must=extendMap[f].name;
                        }
                    }
                }
                //console.log(extendMap,"扩展字段的必填字段");
                 //console.log(this.mustList.indexOf('cover'));
                //新建表单的meta
                let tempObj={};
                for(let extObj in extendMap){
                    tempObj[extendMap[extObj].name] = "";
                };
                this.formValidate.meta=tempObj;
                //改变type类型，重制扩展字段的必填项。
                this.extendList=extendMap;
                //console.log(this.extendList,"改变type类型，重制扩展字段的必填项");
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
                })
                .catch(res => {
                    common.toastMsg(res.message);
                });
            },
            //对必填字段进行配置
            mustConfigure(selectId){
                this.mustList=[];
                let typeId="";
                //console.log(selectId,"挑选类型的集合")
                for(let j=0 ; j < selectId.length ; j++ ){
                    if(j == selectId.length - 1){
                        typeId=selectId[j];
                    }
                }
                //锁定文章的必填字段
                //console.log(this.mustData,"总必填项的集合")
                for(let i in this.mustData){
                    if(typeId == i){
                        this.mustList=this.mustData[i];
                    }  
                }
                //console.log( this.mustList,"选项改变的必填项");
                for(let n = 0 ; n < this.mustList.length ; n++){
                    switch (this.mustList[n]){
                        case "content":
                            this.ruleValidate.content=[{ required: true, message: '内容不能为空', trigger: 'blur' },];
                            break;
                        case "title":
                            this.ruleValidate.title=[{ required: true, message: '标题不能为空', trigger: 'blur' }];
                            break;
                        case "brief":
                            this.ruleValidate.desc=[ { required: true, message: '描述不能为空', trigger: 'blur' },
                                                    { type: 'string', min: 10, message: '不能少于10个字', trigger: 'blur' }];
                            break;
                        case "cover":
                            this.ruleValidate.cover=[{ required: true, message: '标题不能为空', trigger: 'blur' }];
                            break;
                    }
                }
            },
            // 点击选择图片
            choosePic(){
                this.$refs.selectPic.click();
            },
            selectPic() {
                this.imgShow=true;
            },
            selectPicChange(e,type){
                this.chooseChange(e)
            },
            //监听子组件传来的file
            listenerImg(data){
                if(data.files==""){
                    common.toastMsg('请重新选择图片，勿使用示例图片',"error");
                    return;
                }
                let imgFile=this.dataURLtoFile(data.cropedImg,data.files.name);
                this.picChange(imgFile)
            },
            //将base64转化成file
            dataURLtoFile(dataurl, filename) {
                var arr = dataurl.split(',');
                var mime = arr[0].match(/:(.*?);/)[1];
                if(arr[0].match(/:(.*?);/) == null){
                    common.toastMsg('图片缩放太小,请重试',"error");
                }
                var bstr = atob(arr[1]);
                var n = bstr.length;
                var u8arr = new Uint8Array(n);
                while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new File([u8arr], filename, {type:mime});
            },
             // 图片选择修改-裁剪
            picChange(imgFile) {
                // if(imgFile.size > 10485760){
                //     common.toastMsg('图片最大可传10M',"error");
                //     return
                // }
                let picUrl = window.URL.createObjectURL(imgFile);
                let img = new Image();
                img.src = picUrl;
                img.onload = () => {
                    this.picUrl = picUrl;
                    this.imgLoading = true;
                    let image = new FormData();
                    image.append('avatar',imgFile);
                    let url = constGlobal.HostFiremanRecruitArticleManage +'/upload';
                    //对图片进行压缩
                    lrz( this.picUrl , {
                        quality:0.7
                    }).then(resLrz=>{ 
                        common.toastMsg('图片上传中',"success");
                        http.apiPost(url, resLrz.formData, {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            }
                        }).then(res => {
                            if(res.status == 0) {
                                this.imgShow=false;
                                this.formValidate.imgIds=[];
                                this.uploadImgs=[];
                                this.formValidate.imgIds.push(res.data[0]);
                                let pic = {
                                    url: res.data[0],
                                    index: res.data[0]
                                }
                                this.uploadImgs.push(pic);
                            }else {
                                this.picUrl = '';
                                common.toastMsg(res.message,"error");
                            }
                            this.imgLoading = false;
                        })
                        .catch(res => {
                            this.imgLoading = false;
                            this.picUrl = '';
                            common.toastMsg('图片上传失败,请重试',"error");
                        });
                    }).catch(resLrz=>{
                        common.toastMsg('图片压缩失败,请重试',"error");
                    })
                    
                }
            },
             // 图片选择修改-直接上传
            chooseChange(e) {
                if(e.target.files[0].size > 10485760) {
                    common.toastMsg('图片最大可传10M', 'warning');
                    this.$refs.selectPic.value=null;
                    return;
                }
                let picUrl = window.URL.createObjectURL(e.target.files[0]);
                let img = new Image();
                img.src = picUrl;
                img.onload = () => {
                    let scaleVal=img.width/img.height;
                    if( scaleVal<1.66 || scaleVal > 1.78) {
                        common.toastMsg('请选择宽高比1.7的图片', 'warning');
                        this.$refs.selectPic.value=null;
                        return;
                    }
                    this.picUrl = picUrl;
                    this.imgLoading = true;
                    let image = new FormData();
                    image.append('avatar', e.target.files[0]);
                    let url = constGlobal.HostFiremanRecruitArticleManage + '/upload';
                    lrz( this.picUrl , {
                        quality:0.7
                    }).then(resLrz=>{
                        common.toastMsg('图片上传中',"success");
                        http.apiPost(url, resLrz.formData, {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            }
                        }).then(res => {
                            if(res.status == 0) {
                                this.formValidate.imgIds=[];
                                this.uploadImgs=[];
                                this.formValidate.imgIds.push(res.data[0]);
                                let pic = {
                                    url: res.data[0],
                                    index: res.data[0]
                                }
                                this.uploadImgs.push(pic);
                            }else {
                                this.picUrl = '';
                                common.toastMsg(res.message, 'warning');
                            }
                            this.imgLoading = false;
                        })
                        .catch(res => {
                            // debugger
                            this.imgLoading = false;
                            this.picUrl = '';
                            common.toastMsg('图片上传失败,请重试', 'error');
                        });
                    })
                
            }
        },
            //删除图片
            removePic(pic,i){
                this.formValidate.imgIds.splice(i,1);
                this.uploadImgs.splice(i,1);
                this.$refs.selectPic.value=null;
            },
            //预览
            handleView (url) {
                this.imgName = url;
                this.visibleImg = true;
            },
             cancelImgShow(){
                this.imgShow=false;
            },
            /**
            * 编辑ueditor-ready
            */
            editorReady(editorInstance){
                //console.log(editorInstance + "编辑ueditor")
                this.editorInstance = editorInstance;
                editorInstance.addListener('contentChange', () => {
                    // console.log('编辑器内容发生变化:', editorInstance.getContent())
                     this.formValidate.content = this.editorInstance.getContent();
                })

            },
            // 富文本默认内容(确保富文本编辑器加载完成, 未加载完成, 在20毫秒后再次判断)
            setUEContent(content) {
                if(this.editorInstance != '') {
                    if(content != null) {
                        this.editorInstance.setContent(content);
                    }
                }else {
                    setTimeout(() => {
                        this.setUEContent(content);
                    }, 20);
                }
            },
            //标签的添加
            addTips(){
                this.tipsModel= true;
            }, 
            //遍历已选的标签
            getCheckedTips(){
                this.tipsModel= false;
                this.tipsCheckedList=this.checkedList;
            },
            //取消
            cancelTips(){
                this.checkedList = [];
                this.tipsModel= false;
            },
            //关键词的添加
            addKeyWord(){
                if(this.keyWord==""){
                    common.toastMsg("请填写再保存","error");
                    this.loadingModel =false;
                    setTimeout(() => {
                        this.loadingModel =true;;
                    }, 10);
                    return;
                };
                if(this.keyWordList.length > this.lengthList.keyWordLength){
                    common.toastMsg("关键词数量最多"+ this.lengthList.keyWordLength +"个","error");
                }else{
                    this.keyWordList.push(this.keyWord);
                    this.keyWordShow=false;
                    this.keyWord="";
                } 
            },
            //关键词的删除
            deleteKeyWord(index){
                this.keyWordList.splice(0,index);
            },
            //关键词的取消
            cancelKeyWord(){
                this.keyWordShow=false;
                this.keyWord="";
            },
            //发布时间的选择
            startTimeChange(date){
                this.startTime=date;
            },
            endTimeChange(date){
                this.endTime=date;
            },
            //取消发布
            cancelPublish(){
                this.loadingModel =false;
                this.publishTime=false;
                this.paramsList={};
                this.startTime="";
                this.endTime="";
            },
            //校验 type:0表示没有封面，1表示必须有封面
            check(type){
                var status = 1;
                //;           
                if(this.formValidate.select.length == 0){
                    common.toastMsg("类型不能为空","error");
                    status= 0;
                    return status;  
                }else if(this.formValidate.name.trim() ==''){
                        common.toastMsg("标题不能为空","error");
                        status= 0;
                        return status;  
                }
                
                //对基础字段的验证
                for(let n = 0 ; n < this.mustList.length ; n++){
                    switch (this.mustList[n]){
                        // case "content":
                        //     if(this.formValidate.content == ''){
                        //         common.toastMsg("请输入内容","error");
                        //         status= 0; 
                        //         return status; 
                        //     }
                        //     break;
                        case "brief":
                            if(this.formValidate.desc.trim() ==''){
                                common.toastMsg("描述不能为空","error");
                                status= 0;
                                return status; 
                            }
                            break; 
                          
                        case "cover":
                            if(this.formValidate.imgIds.length==0){
                                common.toastMsg("封面不能为空","error");
                                status= 0; 
                                return status; 
                            }
                            break;      
                    };   
                }; 
                //对扩展字段的验证
                for(let m = 0 ; m < this.extendList.length ; m++){
                    if(this.extendList[m].hasOwnProperty("must")){
                        if(this.extendList[m].name== "content"){
                            this.formValidate.content = this.editorInstance.getContent();
                            if(this.formValidate.content.trim()==""||this.formValidate.content==undefined){
                                 common.toastMsg("请将内容填写完整","error");
                                 status= 0;
                                return status;
                            }
                        }else{
                            if(this.formValidate.meta[this.extendList[m].name].trim() == '' || this.formValidate.meta[this.extendList[m].name] == undefined){
                                common.toastMsg("请将"+this.extendList[m].description+"填写完整","error");
                                status= 0;
                                return status;  
                            }
                        }
                    }
                } 
            },
            //保存
            saveMsg(){
                if(this.check() ==0){
                   return;
                }
                var typeId="";
                for(let j=0 ; j < this.formValidate.select.length ; j++ ){
                    if(j == this.formValidate.select.length - 1){
                        typeId = this.formValidate.select[j];
                    }
                }
                var ch = 'https://recruit-user.oss-cn-beijing-internal.aliyuncs.com';
                var replaceUrl = 'http://xfyzl.119.gov.cn/'
                this.formValidate.content = this.formValidate.content.replace(new RegExp(ch,'g'),replaceUrl);
                console.log(this.formValidate.content)
                var urls = constGlobal.HostFiremanRecruitArticleManage +'/post/addPost';
                var paramOption={
                        id:this.Id,
                        websiteId:constGlobal.websiteId,     //网站表主键id
                        title:this.formValidate.name,         //这是标题
                        content:this.formValidate.content,                        //这是内容
                        typeId:typeId,                          //这是类型id
                        brief:this.formValidate.desc,         //这是简介
                        cover:this.formValidate.imgIds[0],  //url
                        tagIdList:this.tipsCheckedList,      //标签
                        meta:this.formValidate.meta, 
                        startTime:this.startTime,
                        endTime:this.endTime                                   
                };
                if(this.btnStatus){
                    common.toastMsg("正在提交中，请稍后..."); 
                    return; 
                }
                http.apiPost(urls,paramOption).then(res =>{
                    this.btnStatus=true;
                    if(res.status == 0){  
                        common.toastMsg("保存成功","success"); 
                        //this.postId=res.data;
                        this.Id=res.data;
                        this.btnStatus=false;
                        //保存的时候，缓存id，防止刷新，页面无数据
                        sessionStorage.setItem('data',JSON.stringify(this.postId));
                    }else{
                        this.btnStatus=false;
                        common.toastMsg(res.message,"error")
                    }
                })
                .catch(res => {
                    this.btnStatus=false;
                    common.toastMsg(res.message,"error");
                });  
            },
            //
            submitCheck(){
                if(this.check() ==0){
                //console.log("check错误");
                   return;
                  
                };
                // if(this.postId==""){
                //     common.toastMsg("请保存再发布","error");
                //      return;
                // }
                //console.log("开始判断是否有开时间");
                if(this.extendList.length > 0){
                    for(let m = 0 ; m < this.extendList.length ; m++){
                        if(this.extendList[m].name == 'time'){
                            this.publishTime=true;
                            //console.log("有时间");
                            return;
                        }
                        
                    } 
                //    console.log("没时间1");
                    this.publishTime=false;
                    this.submitMsg();
                }else{ 
                 //   console.log("没时间2");
                    this.publishTime=false;
                    this.submitMsg()
                }
                   
            },
            //提交
            submitMsg(){
                var typeId="";
                for(let j=0 ; j < this.formValidate.select.length ; j++ ){
                    if(j == this.formValidate.select.length - 1){
                        typeId = this.formValidate.select[j];
                    }
                };
                //console.log("执行提交");
                this.publishBtnStatus=false;
                var urls = constGlobal.HostFiremanRecruitArticleManage +'/post/publishPost';
                
                var ch = 'https://recruit-user.oss-cn-beijing-internal.aliyuncs.com';
                var replaceUrl = 'http://xfyzl.119.gov.cn/'
                this.formValidate.content = this.formValidate.content.replace(new RegExp(ch,'g'),replaceUrl);
                console.log(this.formValidate.content)

                var paramOption={
                        id:this.Id,
                        startTime:this.startTime,
                        endTime:this.endTime, 
                        websiteId:constGlobal.websiteId,     //网站表主键id
                        title:this.formValidate.name,         //这是标题
                        content:this.formValidate.content,      //这是内容
                        typeId:typeId,                          //这是类型id
                        brief:this.formValidate.desc,         //这是简介
                        cover:this.formValidate.imgIds[0],  //url
                        tagIdList:this.tipsCheckedList,      //标签
                        meta:this.formValidate.meta, 
                };
                http.apiPost(urls,paramOption).then(res =>{
                    if(res.status == 0){
                        common.toastMsg("操作成功","success");
                        //提交的时候，清除缓存id，防止刷新，页面有数据
                        sessionStorage.removeItem("data");
                        this.$router.push({path:"/articleList"})
                    }else{
                        this.loadingModel1 =false;
                        setTimeout(() => {
                            this.loadingModel1 =true;
                        }, 10);
                        this.loadingModel1 =false;
                        common.toastMsg(res.message,"error")
                        this.publishBtnStatus=true;
                    }
                })
                .catch(res => {
                    common.toastMsg(res.message,"error");
                    this.publishBtnStatus=true;
                });  
            },
            //取消
            goBack(){
                //提交的时候，清除缓存id，防止刷新，页面有数据
                sessionStorage.removeItem("data");
                history.back();
            }
        }
    }
</script>