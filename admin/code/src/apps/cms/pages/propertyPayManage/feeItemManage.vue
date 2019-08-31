<template>
    <div id="serviceType">
        <layout-container>
            <div slot="title">
                <div class="flex">
                    <div class="flex">
                        <span>小区：</span>
                        <Select v-model="selectPlotValue" style="width:150px">
                            <Option v-for="item in plotList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                    <div class="flex">
                        <span>&nbsp;&nbsp;收费单位：</span> 
                        <Select v-model="selectMchValue" style="width:150px">
                            <Option v-for="item in mchList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                </div>
            </div>
            <div slot="extra">
                <Button type="primary" icon="ios-plus" @click="detail('add' , '')">新增收费项目</Button>
            </div> 
            <Table 
                :columns="column" 
                :data="list"
                :highlight-row = highlight
                :loading = loading
                ></Table>
        </layout-container>

        <!--删除对话框-->
        <Modal v-model="deleteModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除收费项目</span>
            </p>
            <div style="text-align:center">
                <p>收费项目删除后将不再显示</p> 
                <p>是否继续删除?</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="delete_loading" @click="deleteData">删除</Button>
            </div>
        </Modal>

        <Modal
            v-model="detailModel"
            :title="type == 'add' ? '新增' : type == 'edit'? '编辑' : '查看' + '收费项目'"
            @on-ok="submit"
            @on-cancel="cancel">
                <div style="width : 400px;margin:10px 30px;">
                    <Form :model="formItem" :label-width="120" :rules="ruleValidate" ref="formRef">
                        <FormItem label="所属小区:" prop="plot">  
                            <div v-show="type == 'add' || type == 'edit'">
                                <Select v-model="formItem.plot">
                                    <Option v-for="item in plotList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </div>
                            <div v-if="type == 'check'">{{formItem.plot}}</div>
                        </FormItem>
                        <FormItem label="收费单位:" prop="unit">  
                            <div v-show="type == 'add' || type == 'edit'">
                                <Select v-model="formItem.unit">
                                    <Option v-for="item in mchList" :value="item.value" :key="item.value" v-show="item.value != -1">{{ item.label }}</Option>
                                </Select>
                            </div>
                            <div v-if="type == 'check'">{{formItem.plot}}</div>
                        </FormItem>
                        <FormItem label="收费项目名称:"  prop="title">  
                            <div v-show="type == 'add' || type == 'edit'">
                                <Input v-model="formItem.title" placeholder="请输入收费项目名称"></Input>
                            </div>
                            <div v-if="type == 'check'">{{formItem.title}}</div>
                        </FormItem> 
                        <FormItem label="价格:"  prop="price">  
                            <div v-show="type == 'add' || type == 'edit'">
                                <Input v-model="formItem.price" placeholder="请输入价格"></Input>
                            </div>
                            <div v-if="type == 'check'">{{formItem.price}}</div>
                        </FormItem>
                        <FormItem label="回调地址:"  prop="callbackUrl">  
                            <div v-show="type == 'add' || type == 'edit'">
                                <Input v-model="formItem.callbackUrl" placeholder="请输入回调地址"></Input>
                            </div>
                            <div v-if="type == 'check'">{{formItem.callbackUrl}}</div>
                        </FormItem>
                          <FormItem label="可信域名:"  prop="callbackUrl">   
                            <div v-show="type == 'add' || type == 'edit'">
                                <Input v-model="formItem.host" placeholder="请输入可信域名"></Input>
                            </div>
                            <div v-if="type == 'check'">{{formItem.callbackUrl}}</div>
                        </FormItem>
                        <FormItem label="描述:"  prop="describe">
                            <div v-show="type == 'add' || type == 'edit'">
                                <Input v-model="formItem.describe" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入内容"></Input>
                            </div>
                            <div v-if="type == 'check'">{{formItem.describe}}</div>
                        </FormItem>
                    </Form> 
                </div>
                
        </Modal>
    </div>
</template>

<script>
import layoutContainer from 'components/layout/layoutContainer.vue'
export default {
    name:'serviceType',
    data(){
        return {
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
                    required: true, message: '请输入收费项目', trigger: 'blur' 
                }],
                unit : [{
                    required: true, message: '请选择收费单位', trigger: 'blur' 
                }],
                price : [{
                    required: true, message: '请输入价格', trigger: 'blur' 
                }]
            },
            formItem : {
                plot : '1',
                title : '',
                unit : '',
                describe : '',
                price : '',
                callbackUrl : '',
                host : ''
            },
            detailModel : false,
            type : '',
            deleteModal : false,
            delete_loading : false,
            selectPlotValue : '-1',
            selectMchValue : '-1',
            loading : false,
            highlight : true,
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
            mchList:[{
                value : '-1',
                label : '全部'
            },{
                value : '1',
                label : 'XX物业'
            }],
            list : [{
                name : '物业费',
                plot : '祥和佳园',
                createTime : '2019-08-29',
            }],
            column : [{
                title: '收费项目名称',
                key: 'name' 
            },{
                title: '所属小区',
                key: 'plot'
            },{
                title: '时间',
                key: 'createTime'
            },{
                title: '操作',
                key: 'account',
                width : 200,
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
                                    this.detail('edit' , this.list[params.index]);
                                }
                            }
                        }, '编辑'),
                        h('Button', {
                            props: {
                                type: 'text'
                            },
                            style: {
                                padding: 0,
                                border: 0,
                                color:'#1890ff',
                                marginRight:'20px',
                            },
                            on: {
                                click: () => {
                                    this.detail('check' , this.list[params.index]);
                                }
                            }
                        }, '查看'),
                        h('Button', {
                            props: {
                                type: 'text'
                            },
                            style: {
                                padding: 0,
                                border: 0,
                                color:'red',
                            },
                            on: {
                                click: () => { 
                                    this.deleteItem = this.list[params.index];
                                    this.deleteModal = true;
                                }
                            }
                        }, '删除')
                        
                    ]);
                }
            }], 

            formItem : {
                title : '',
                polt : ''
            }
        }
    },
    components: {
        layoutContainer
    },
    mounted:function () {
         this.$nextTick(function() {
            window.eventHub.$emit("changePath", [{
                title : '物业缴费服务'
            },{
                title : "收费项目管理"
            }],1);
        })
    },
    methods:{
        detail(type , query){
            this.type = type;
            this.detailModel = true;
        },
        submit(){
            this.detailModel = false;
        },
        cancel(){

        },
        deleteData(){

        },
    }
  
}
</script>

<style lang='scss'>

</style>
