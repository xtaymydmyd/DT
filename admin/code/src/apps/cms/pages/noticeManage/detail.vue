<template>
    <div id="noticeDetail" class="noticeDetail">
        <layout-container :back="true">
            <div slot="title"></div>
            <div slot="extra">
                <Button type="primary" @click="save()" v-if="type == 'add' || type == 'edit'">保存</Button>
            </div>
            <div class="container">
                <Form :model="formItem" :label-width="80" :rules="ruleValidate" ref="formRef">
                     <FormItem label="所属小区:" prop="plot">  
                        <div v-show="type == 'add' || type == 'edit'">
                            <Select v-model="formItem.plot">
                                <Option v-for="item in plotList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </div>
                        <div v-if="type == 'check'">{{formItem.plot}}</div>
                    </FormItem>
                    <FormItem label="标题:" prop="title"> 
                        <div v-show="type == 'add' || type == 'edit'">
                            <Input v-model="formItem.title" placeholder="请输入标题"></Input>
                        </div>
                        <div v-if="type == 'check'">{{formItem.title}}</div>
                    </FormItem>
                    <FormItem label="内容:" prop="content">
                        <div v-show="type == 'add' || type == 'edit'">
                            <Input v-model="formItem.content" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入内容"></Input>
                        </div>
                        <div v-if="type == 'check'">{{formItem.title}}</div>
                    </FormItem>
                    <FormItem label="封面:" prop="cover">
                        <div v-show="type == 'add' || type == 'edit'">
                            <div class="cover-img" v-if="formItem.cover !=''">
                                <img :src="formItem.cover" class="coverImgWrap" alt="">
                                <div
                                    class="cover-img-pop flex flex-align-items flex-justify-content ">
                                    <Icon type="trash-a" @click.native="deleteCover()"></Icon>
                                </div>
                            </div>
                            <upload-img 
                                v-if="formItem.cover == ''"
                                :num=1 
                                uploadKey="cover"
                                :is-crop="false"
                                @uploadChange ="uploadChangeEvent" 
                                style="width:108px;">
                                <div slot="content" class="flex flex-justify-content flex-align-items" style=" width: 100px;height: 100px; border: 1px dashed #ccc;">
                                    <Icon type="camera" style="font-size:18px;"></Icon>
                                </div>
                            </upload-img>
                        </div>
                        <div v-if="type == 'check'">
                             <div class="cover-img" v-if="formItem.cover !=''">
                                <img :src="formItem.cover" class="coverImgWrap" alt="">
                            </div>
                        </div>
                    </FormItem>
                </Form>
            </div>
        </layout-container> 
    </div>
</template>

<script>
import layoutContainer from 'components/layout/layoutContainer.vue'
import uploadImg from 'cms/components/uploadImg/uploadImg.vue'
export default {
    name:'noticeDetail',
    data(){
        return {
            type : '',
            query : {},
            formItem : {
                plot : '',
                title : '',
                content : '',
                cover : ''
            },
            plotList : [{
                value: '-1',
                label: '全部'
            },{
                value: '1',
                label: '祥和佳园'
            },{
                value: '2',
                label: '省电宿舍'
            }] ,
            ruleValidate : {
                plot : [{
                    required: true, message: '请选择所属小区', trigger: 'blur' 
                }],
                title: [{ 
                    required: true, message: '请输入服务标题', trigger: 'blur' 
                }], 
                content: [{ 
                    required: true, message: '请输入服务内容', trigger: 'blur' 
                }], 
                cover: [{ 
                    required: true, message: '请选择封面图片', trigger: 'blur' 
                }]
            },
        }
    },
    components: {
        layoutContainer,
        uploadImg
    },
    mounted:function () {
        this.query = this.$route.query;
        this.type = this.query.type;

        this.$nextTick(function() {
            window.eventHub.$emit("changePath", [{
                title : "公告管理"
            },{
                title : this.query.type == 'add' ? '新增公告' : this.query.type == 'check' ? '查看公告':'编辑公告'
            }],1);
        })
    },
    methods:{
        save(name){
            this.$refs[formRef].validate((valid) => {
                if (valid) {
                    this.$Message.success('Success!');
                } else {
                    this.$Message.error('Fail!');
                }
            })
        },
        deleteCover(){
            this.formItem.cover = '';
        },
        uploadChangeEvent(){

        }
    }
  
}
</script>

<style lang='scss'>
.noticeDetail{
    .container{
        width : 500px;
        margin:0px auto;
    }
    .cover-img{
            position:relative;
            width: auto;
            display: inline-block;
            .cover-img-pop{
                position: absolute;
                top: 0px;
                left:0px;
                background: rgba(0,0,0,0.6);
                width: 100%;
                height: 100%;
                color: white;
                font-size: 18px;
                display:none;
            }
             .coverImgWrap{
                max-width:100%;
                height : 100px;
            }
            .deleteText{
                margin-left: 20px;
                color: #f5222d;
                cursor: pointer;
                height: 32px;
            }
        }
        
        .cover-img:hover{
            .cover-img-pop{
                display:flex
            }
        }
}
</style>
