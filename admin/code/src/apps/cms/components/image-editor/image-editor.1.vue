<style lang="less">
    @import './common.less';
    @import './image-editor.less';
</style>

<template>
    <div class="image-editor">
        <Row class="margin-top-10">
            <Card>
                <p slot="title">
                    <Icon type="levels"></Icon>
                    图片裁剪
                </p>
                <Row :gutter="10">
                    <Col span="16" class="image-editor-con3">
                        <div class="cropper3">
                            <img :id="'cropimg3'+cageID" src="./cropper-test.png" alt="">
                        </div>
                    </Col>
                    <Col span="8" class="image-editor-con3" style="width:300px">
                        <Row type="flex" justify="center" align="middle" class="image-editor-con3-preview-con">
                            <div id="preview3"></div>
                        </Row>
                        <Row>
                            <Col span="24" class="image-editor-con3-btn-box margin-top-20">
                                <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange3" id="fileinput3" class="fileinput" />
                                <label class="filelabel filelabel3" for="fileinput3"><Icon type="image"></Icon>&nbsp;选择图片</label>
                            </Col>
                        </Row>
                        <Row class="margin-top-10" :gutter="10">
                            <Col span="24" class="crop3-btn-box">
                                <Tooltip content="放大" placement="bottom">
                                    <Button @click="handlezooml" type="primary"><Icon :size="16" type="plus-round"></Icon></Button>
                                </Tooltip>
                                <Tooltip content="缩小" placement="bottom">
                                    <Button @click="handlezooms" type="primary"><Icon :size="16" type="minus-round"></Icon></Button>
                                </Tooltip>
                                <Tooltip content="左转" placement="bottom">
                                    <Button @click="handlerotatel" type="primary"><Icon :size="16" type="arrow-return-left"></Icon></Button>
                                </Tooltip>
                                <Tooltip content="右转" placement="bottom">
                                    <Button @click="handlerotater" type="primary"><Icon :size="16" type="arrow-return-right"></Icon></Button>
                                </Tooltip>
                            </Col>
                        </Row>
                        <Row class="margin-top-10" :gutter="10">
                            <Col span="24" class="crop3-btn-box">
                                <Tooltip content="左移" placement="bottom">
                                    <Button @click="handlemovel" type="primary"><Icon :size="18" type="android-arrow-back"></Icon></Button>
                                </Tooltip>
                                <Tooltip content="右移" placement="bottom">
                                    <Button @click="handlemover" type="primary"><Icon :size="18" type="android-arrow-forward"></Icon></Button>
                                </Tooltip>
                                <Tooltip content="上移" placement="bottom">
                                    <Button @click="handlemoveu" type="primary"><Icon :size="18" type="android-arrow-up"></Icon></Button>
                                </Tooltip>
                                <Tooltip content="下移" placement="bottom">
                                    <Button @click="handlemoved" type="primary"><Icon :size="18" type="android-arrow-down"></Icon></Button>
                                </Tooltip>
                            </Col>
                        </Row>
                        <Row class="margin-top-10">
                            <Col span="24" class="crop3-btn-box">
                                <Button @click="handlecrop3" style="width: 190px;" icon="crop" type="primary">裁剪</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>
        </Row>
    </div>
</template>

<script>
import Cropper from 'cropperjs';
import 'cms/components/uploadImg/cropper.min.css';
export default {
    name: 'image-editor',
    data () {
        return {
            cropper3: {},
            option3: {
                showCropedImage: false,
                cropedImg: '',
                files:''
            },
            cageID: this.generateGUID(), 
        };
    },
    mounted () {
        let img3 = document.getElementById('cropimg3'+this.cageID);
        // this.cropper3 = new Cropper(img3, {
        //     dragMode: 'crop',
        //     preview: '#preview3',
        //      viewMode: 0,
        //     restore: false,
        //     center: false,
        //     highlight: false,
        //     cropBoxMovable: false,
        //     toggleDragModeOnDblclick: false,
        //     cropBoxResizable:true,  //改变裁剪框大小
        //     cropBoxMovable:false,    //拖动裁剪框
        //     minCropBoxWidth:200,     //裁剪框的最小宽度
        //     minCropBoxHeight:200,   //裁剪框的最小高度
        // });
        this.cropper3 = new Cropper(img3, {
            dragMode: 'move',
            preview: '#preview3',
            aspectRatio:1.7,//等比缩放
            restore: false,
            center: false,
            highlight: false,
            cropBoxMovable: false,
            toggleDragModeOnDblclick: false,
            crop(event){
                console.log(event)
                var croppercropboxwidth = document.getElementsByClassName("cropper-crop-box")[0].style.width;
                var croppercropboxheight = document.getElementsByClassName("cropper-crop-box")[0].style.height;
                var croppercropboxtransform = document.getElementsByClassName("cropper-crop-box")[0].style.transform;

                console.log(document.getElementsByClassName("cropper-view-box")[0].childNodes[0].style.width)

                var croppercropboximgwidth = document.getElementsByClassName("cropper-view-box")[0].childNodes[0].style.width;
                var croppercropboximgheight = document.getElementsByClassName("cropper-view-box")[0].childNodes[0].style.height;
                var croppercropboximgtransform = document.getElementsByClassName("cropper-view-box")[0].childNodes[0].style.transform;

                document.getElementsByClassName("cropper-canvas")[0].style.width = croppercropboxwidth;
                document.getElementsByClassName("cropper-canvas")[0].style.height = croppercropboxheight;
                document.getElementsByClassName("cropper-canvas")[0].style.transform = croppercropboxtransform;


                document.getElementsByClassName("cropper-canvas")[0].childNodes[0].style.width = croppercropboximgwidth;
                document.getElementsByClassName("cropper-canvas")[0].childNodes[0].style.height = croppercropboximgheight;
                document.getElementsByClassName("cropper-canvas")[0].childNodes[0].style.transform = croppercropboximgtransform;
            }
        },
       );

        
    },
    methods: {
        handlerotatel () {
            if (document.getElementById('fileinput3').files[0]) {
                this.cropper3.rotate(-30);
            }
        },
        handlerotater () {
            if (document.getElementById('fileinput3').files[0]) {
                this.cropper3.rotate(30);
            }
        },
        handlezooml () {
            if (document.getElementById('fileinput3').files[0]) {
                this.cropper3.zoom(0.1);
            }
        },
        handlezooms () {
            if (document.getElementById('fileinput3').files[0]) {
                this.cropper3.zoom(-0.1);
            }
        },
        handleChange3 (e) {
            let file = e.target.files[0];
            console.log("handleChange")
            console.log(file);
            this.option3.files=file;
            let reader = new FileReader();
            reader.onload = () => {
                this.cropper3.replace(reader.result, true); // 这里必须设置true这个参数，否则旋转会有bug
                reader.onload = null;
            };
            reader.readAsDataURL(file);
          
        },
        handlemovel () {
            if (document.getElementById('fileinput3').files[0]) {
                this.cropper3.move(-10, 0);
            }
         
        },
        handlemover () {
            if (document.getElementById('fileinput3').files[0]) {
                this.cropper3.move(10, 0);
            }
       
        },
        handlemoveu () {
            if (document.getElementById('fileinput3').files[0]) {
                this.cropper3.move(0, -10);
            }
         
        },
        handlemoved () { 
            if (document.getElementById('fileinput3').files[0]) { 
                this.cropper3.move(0, 10);
            }
        },
        handlecrop3 () {
            var croppercropboxwidth = document.getElementsByClassName("cropper-crop-box")[0].style.width;
            var croppercropboxheight = document.getElementsByClassName("cropper-crop-box")[0].style.height;
            var croppercropboxtransform = document.getElementsByClassName("cropper-crop-box")[0].style.transform;

            console.log(document.getElementsByClassName("cropper-view-box")[0].childNodes[0].style.width)

            var croppercropboximgwidth = document.getElementsByClassName("cropper-view-box")[0].childNodes[0].style.width;
            var croppercropboximgheight = document.getElementsByClassName("cropper-view-box")[0].childNodes[0].style.height;
            var croppercropboximgtransform = document.getElementsByClassName("cropper-view-box")[0].childNodes[0].style.transform;

            document.getElementsByClassName("cropper-canvas")[0].style.width = croppercropboxwidth;
            document.getElementsByClassName("cropper-canvas")[0].style.height = croppercropboxheight;
            document.getElementsByClassName("cropper-canvas")[0].style.transform = croppercropboxtransform;


            document.getElementsByClassName("cropper-canvas")[0].childNodes[0].style.width = croppercropboximgwidth;
            document.getElementsByClassName("cropper-canvas")[0].childNodes[0].style.height = croppercropboximgheight;
            document.getElementsByClassName("cropper-canvas")[0].childNodes[0].style.transform = croppercropboximgtransform;


            let file = this.cropper3.getCroppedCanvas().toDataURL();
            // let file = this.cropper3.getCroppedCanvas().toBlob();
            this.option3.cropedImg = file;
            this.$emit("childImg",this.option3)
            this.cropper3.destroy();
        },
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
    },
    
};
</script>

<style lang="scss">
.image-editor{
    
    .cropper-canvas, .cropper-wrap-box{
        overflow:initial;
    }
    .cropper-wrap-box{
        overflow:hidden;
    }
}

</style>
