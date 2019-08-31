
<template>
    <div class="image-editor" style="line-height: initial;">
        <div class="imgDiv">
            <input 
                type="file" 
                accept="image/*" 
                ref="avatarInput" 
                @change="fileChange($event)" 
                :id="'fileinput1'+cageID" 
                class="fileinput" />
            <label class="fileImgLabel" :for="'fileinput1' + cageID">
                <slot name="content"><Icon type="camera" size="20"></Icon></slot>
            </label>
        </div>
       
        <Modal v-model="optionCrop.showCropedImage" @on-ok="cropOk">
            <p slot="header">图片裁剪</p>
            <div class="cropper" style="width:80%; height:300px;margin:0 auto;">
                <img :id="'cropimg2'+cageID" alt="" >
            </div>
        </Modal>
    </div>
</template>

<script>
/**
 * num : 图片上传张数
 * aspectRatio ： 图片宽高比
 * minCropBoxWidth ： 图片最小宽度
 * isCrop ： 是否需要裁剪
 */
import Cropper from 'cropperjs';
import './cropper.min.css';
export default {
    name: 'image-editor',
    data () {
        return {
            title : '',
            cropper2: {},
            imgIds:[],
            imgName:'',
            option1: {  //预览
                showCropedImage: false,
                cropedImg: ''
            },
            optionCrop: {   //裁剪
                showCropedImage: false,
                cropedImg: ''
            },
            cropdata2: {
                x: '',
                y: '',
                w: '',
                h: '',
                deg: '',
                scaleX: '',
                scaleY: ''
            },
            imgUrl:constGlobal.HostSource,
            cropBoxResizable:true,  //裁剪框能否改变大小
            file:{},                //存储上传文件信息
            imgInfo:{               //图片信息
                fileName:'',
                fileSiza:''
            },
            cageID: this.generateGUID(),     //用于组件中id动态变量
        };
    },
    props:{
        num:{
            type:Number,
            default:1
        },
        aspectRatio:{
            type:Number,
            default:1
        },
        minCropBoxWidth:{
            type:Number,
            defaulr:100
        },
        //是否裁剪
        isCrop:{
            type:Boolean,
            default:false
        }    
    },
    mounted () {
        let img2 = document.getElementById('cropimg2'+this.cageID);
        this.cropper2 = new Cropper(img2, {
            dragMode: 'move',
            viewMode :0,
            restore: false,
            center: false,
            highlight: false,
            cropBoxMovable: false,
            toggleDragModeOnDblclick: false,
            minCropBoxWidth:200,     //裁剪框的最小宽度
            minCropBoxHeight:200,   //裁剪框的最小高度
            cropBoxResizable:true,  //改变裁剪框大小
            cropBoxMovable:true,    //拖动裁剪框
            aspectRatio :this.aspectRatio       //裁剪框比例
            
        });
    },
    methods: {
        //组件通信
        uploadChange(){
            this.imgName = '';
            this.$emit( 'uploadChange' , this.imgIds );
        },
        fileChange(el) {
            debugger
            this.imgIds = [];
            var _this = this;
            if (!el.target.files[0].size) return;
            _this.file = el.target.files[0];
            this.imgName = _this.file.name;
            if( !this.isCrop ){
                if(el.target.files[0].size >= 10485760){
                    common.toastMsg("上传图片大于10M，请重新选择图片");
                    return;
                }else{
                    var image = new FormData()
                    image.append('avatar', this.$refs.avatarInput.files[0])
                    debugger
                    this.dataURLtoFile(el.target.files[0])
                    // this.url = constGlobal.HostCMSAdmin + 'upload';
                    // http.apiPost(this.url, image, {
                    //     headers: {
                    //         "Content-Type": "multipart/form-data"
                    //     }
                    // }).then( res =>{
                    //     if( res.status == 0 ){
                    //         this.imgIds.push({
                    //             id : res.data[0] , 
                    //             title : this.imgName
                    //         });
                    //         this.option1.cropedImg = res.data[0];
                    //         this.uploadChange()
                    //     }else{
                    //         common.toastMsg( res.message );
                    //     }               
                    // });
                }
            }else{
                if(el.target.files[0].size >= 10485760){
                    common.toastMsg("上传图片大于10M，请重新选择图片");
                    return
                }else{
                    this.optionCrop.showCropedImage = true;
                    let reader = new FileReader();
                    reader.onload = () => {
                        this.cropper2.replace(reader.result);
                        reader.onload = null;
                    };
                    reader.readAsDataURL(_this.file); 
                    var image = new FormData()
                    image.append('avatar', this.$refs.avatarInput.files[0])
                    this.url = constGlobal.HostFileUpload + 'upload';
                }
            }
            el.target.value = "";
        },
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
        //预览
        handleView (item) {
            this.option1.showCropedImage = true;
            this.option1.cropedImg = item;
            //获取预览的图片信息
            let url = constGlobal.HostFileUpload + 'metadata?fileId=' + item ;
            let params = {};
            http.apiGet(url,params).then(res=>{
                if(res.status == 0){
                    this.imgInfo.fileName = res.data[0].value;
                    this.imgInfo.fileSiza = this.bytesToSize(res.data[1].value);
                }else{
                    common.toastMsg(res.message);
                }
            })
        },
        //生成GUID
        generateGUID() {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            var guid = s.join("");
            return guid;
        },
        //字节换算
        bytesToSize(bytes) {  
            if (bytes === 0) return '0 B'; 
                var k = 1024;  
                var sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];  
                var i = Math.floor(Math.log(bytes) / Math.log(k));  
            return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];    
        },
        //移除
        handleRemove(index){
            this.imgIds.splice(index,1);
        },
        //确认裁剪
        cropOk(){
            //canvas转换为dataURL
            var canvas=this.cropper2.getCroppedCanvas();
            var png = canvas.toDataURL('image/png');
            function dataURLtoBlob(dataurl) {
                var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], {type:mime});
            }
            //dataURL转换为blob
            var blob = dataURLtoBlob(png);
            let reader = new FileReader();
            reader.onload = () => {
                this.cropper2.replace(reader.result);
                reader.onload = null;
            };
            reader.readAsDataURL(blob);
            var formData = new FormData();
            var nameImg = new Date().getTime() + '.png';
            formData.append('uploadfile' , blob , nameImg);
            http.apiPost(this.url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).then( res =>{
                if( res.status == 0 ){
                    this.imgIds.push({
                       id : res.data[0] ,
                       title : this.imgName
                    });
                    this.option1.cropedImg = res.data[0];
                    this.uploadChange()
                }else{
                    common.toastMsg( res.message );
                }               
            });
        },
        //预览确认
        ok(){
        }
    },
    
};
</script>
<style lang="scss">
    .imgDiv{
        border-radius: 3px;
        text-align: center;
        .fileinput{
            position:absolute;
            top:0px;
            left : 0px;
            right : 0px;
            bottom : 0px;
            width : 100%;
            height: 100%;
            opacity : 0;
        }
    }
    .cropper-crop-box{
        
    }
</style>

