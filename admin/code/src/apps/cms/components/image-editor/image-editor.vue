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
                            <img id="cropimg3" src="./cropper-test.png" alt="">
                        </div>
                    </Col>
                    <Col span="8" class="image-editor-con3" style="width:300px">
                        <Row type="flex" justify="center" align="middle" class="image-editor-con3-preview-con">
                            <div id="preview3"></div>
                        </Row>
                        <Row>
                            <Col span="24" class="image-editor-con3-btn-box margin-top-20">
                                <input type="file" accept="image/png, image/jpeg,  image/jpg" @change="handleChange3" id="fileinput3" class="fileinput" />
                                <label class="filelabel filelabel3" for="fileinput3"><Icon type="image"></Icon>&nbsp;选择图片</label>
                            </Col>
                        </Row>
                        <Row class="margin-top-10" :gutter="10">
                            <Col span="24" class="crop3-btn-box">
                                <Tooltip content="放大" placement="bottom">
                                    <Button @click="cropper3.zoom(0.1)" type="primary"><Icon :size="16" type="plus-round"></Icon></Button>
                                </Tooltip>
                                <Tooltip content="缩小" placement="bottom">
                                    <Button @click="cropper3.zoom(-0.1)" type="primary"><Icon :size="16" type="minus-round"></Icon></Button>
                                </Tooltip>
                                <Tooltip content="左转" placement="bottom">
                                    <Button @click="cropper3.rotate(-30)" type="primary"><Icon :size="16" type="arrow-return-left"></Icon></Button>
                                </Tooltip>
                                <Tooltip content="右转" placement="bottom">
                                    <Button @click="cropper3.rotate(30)" type="primary"><Icon :size="16" type="arrow-return-right"></Icon></Button>
                                </Tooltip>
                            </Col>
                        </Row>
                        <Row class="margin-top-10" :gutter="10">
                            <Col span="24" class="crop3-btn-box">
                                <Tooltip content="左移" placement="bottom">
                                    <Button @click="cropper3.move(-10, 0)" type="primary"><Icon :size="18" type="android-arrow-back"></Icon></Button>
                                </Tooltip>
                                <Tooltip content="右移" placement="bottom">
                                    <Button @click="cropper3.move(10, 0)" type="primary"><Icon :size="18" type="android-arrow-forward"></Icon></Button>
                                </Tooltip>
                                <Tooltip content="上移" placement="bottom">
                                    <Button @click="cropper3.move(0, -10)" type="primary"><Icon :size="18" type="android-arrow-up"></Icon></Button>
                                </Tooltip>
                                <Tooltip content="下移" placement="bottom">
                                    <Button @click="cropper3.move(0, 10)" type="primary"><Icon :size="18" type="android-arrow-down"></Icon></Button>
                                </Tooltip>
                            </Col>
                        </Row>
                        <Row class="margin-top-10">
                            <Col span="24" class="crop3-btn-box">
                                <Button   @click="handlecrop3" style="width: 190px;" icon="crop" type="primary">裁剪</Button>
                            </Col>
                            <Modal v-model="option3.showCropedImage">
                                <p slot="header">预览裁剪之后的图片</p>
                                <img :src="option3.cropedImg" alt="" v-if="option3.showCropedImage" style="width: 100%;">
                            </Modal>
                        </Row>
                    </Col>
                </Row>
            </Card>
        </Row>
    </div>
</template>

<script>
import Cropper from 'cropperjs';
import './cropper.min.css';
export default {
    name: 'image-editor',
    data () {
        return {
            cropper1: {},
            option1: {
                showCropedImage: false,
                cropedImg: '',
            },
            cropper2: {},
            cropdata2: {
                x: '',
                y: '',
                w: '',
                h: '',
                deg: '',
                scaleX: '',
                scaleY: ''
            },
            cropper3: {},
            option3: {
                showCropedImage: false,
                cropedImg: '',
                files:''
            },
            cropperRemove:{},
            cropperSet:{},
             cropper3Canvas:{
                width:null,
                height:null
            },
        };
    },
    methods: {
        handleChange3 (e) {
            let file = e.target.files[0];
            if(e.target.files[0].size>10485760){
                common.toastMsg("请选择10M以下的图片","error");
                return
            }
            this.option3.files=file;
            let reader = new FileReader();
            reader.onload = () => {
                this.cropper3.replace(reader.result, true); // 这里必须设置true这个参数，否则旋转会有bug
                reader.onload = null;
            };
            reader.readAsDataURL(file);
        },
        handlecrop3 () {
            common.toastMsg('图片裁剪中',"success");
            this.cropper3.canvasData.left=Number(this.cropper3Canvas.transformX);
            this.cropper3.canvasData.top=Number(this.cropper3Canvas.transformY)
            this.cropper3.canvasData.minHeight=Number(this.cropper3Canvas.height);
            this.cropper3.canvasData.minwidth=Number(this.cropper3Canvas.width);
            this.cropper3.canvasData.minLeft=Number(this.cropper3Canvas.width);
            this.cropper3.canvasData.minTop=Number(this.cropper3Canvas.height); 
            this.cropper3.canvasData.width=Number(this.cropper3Canvas.width);
            this.cropper3.canvasData.height=Number(this.cropper3Canvas.height); 
            this.cropper3.canvasData.naturalHeight=this.cropper3.imageData.naturalHeight;
            this.cropper3.canvasData.naturalWidth=this.cropper3.imageData.naturalWidth;
            let file = this.cropper3.getCroppedCanvas().toDataURL();
            this.option3.cropedImg = file;
            this.$emit("childImg",this.option3)
           // this.option3.showCropedImage = true;
        },
        //获取内敛样式
        camelCase(name) {
            const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
            const MOZ_HACK_REGEXP = /^moz([A-Z])/;
            return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
                return offset ? letter.toUpperCase() : letter;
            }).replace(MOZ_HACK_REGEXP, 'Moz$1');
        },
        getStyle (element, styleName) {
            if (!element || !styleName) return null;
            styleName =this.camelCase(styleName);
            if (styleName === 'float') {
                styleName = 'cssFloat';
            }
            try {
                const computed = document.defaultView.getComputedStyle(element, '');
                return element.style[styleName] || computed ? computed[styleName] : null;
            } catch(e) {
                return element.style[styleName];
            }
        }  
    },
    mounted () {
        let img3 = document.getElementById('cropimg3');
        var _this=this;
        this.cropper3 = new Cropper(img3, {
            viewMode:0,
            dragMode: 'move',
            preview: '#preview3',
            aspectRatio:1.7,//等比缩放
            restore: false,
            center: false,
            highlight: false,
            cropBoxMovable: false,
            cropBoxResizable:true,  //改变裁剪框大小
            movable:true,
            toggleDragModeOnDblclick: false,
            minCropBoxWidth:170,     //裁剪框的最小宽度
            minCropBoxHeight:100,   //裁剪框的最小高度
            // minCanvasWidth:170,
            // minCanvasHeight:100,
            crop:function(e){
                var this_=_this;
                //当前展示缩放图
                let span= document.getElementsByClassName('cropper-view-box')[0].childNodes[0];
                let box= document.getElementsByClassName('cropper-crop-box')[0];
                //实际canvas画图
                let canvas= document.getElementsByClassName('cropper-canvas')[0];
                let canvasImg= document.getElementsByClassName('cropper-canvas')[0].childNodes[0];
                canvas.style.transform=span.style.transform + box.style.transform;
                canvas.style.height=span.style.height;
                canvas.style.width=span.style.width;
                canvasImg.style.transform="none";
                var val =this_.getStyle(canvas,'transform');
                var val1=val.substring(7);
                var val2=val1.substring(0,val1.length-1).split(",");
                this_.cropper3Canvas={
                    width:canvas.style.width.replace('px',''),
                    height:canvas.style.height.replace('px',''),
                    transformX:val2[4],
                    transformY:val2[5]
                };
            }
        });
    }
};
</script>

<style lang="scss">
.image-editor{
    .cropper-view-box {
        overflow:visible;
    }
    .cropper-drag-box{
         overflow:hidden;
    }
    .cropper-container{
         overflow:hidden;
    }
}
</style>
