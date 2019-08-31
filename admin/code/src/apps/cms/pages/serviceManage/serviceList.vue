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
                        <span>&nbsp;&nbsp;服务类型：</span> 
                        <Select v-model="selectTypeValue" style="width:150px">
                            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                </div>
            </div>
            <div slot="extra">
                <Button type="primary" icon="ios-plus" @click="serviceDetail('add' , '')">新增服务</Button>
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
                <span>删除服务</span>
            </p>
            <div style="text-align:center">
                <p>服务删除后将不再显示</p> 
                <p>是否继续删除?</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="delete_loading" @click="deleteData">删除</Button>
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
            deleteModal : false,
            delete_loading : false,
            selectPlotValue : '-1',
            selectTypeValue : '-1',
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
            typeList:[{
                value : '-1',
                label : '全部'
            },{
                value : '1',
                label : '家政服务'
            },{
                value : '2',
                label : '维修服务'
            },{
                value : '3', 
                label : '搬家服务'
            }],
            list : [{
                name : 'XXXX家政服务',
                plot : '祥和佳园',
                createTime : '2019-08-29',
                type : '家政服务'
            },{
                name : 'XXXX家政服务',
                plot : '祥和佳园',
                createTime : '2019-08-29',
                type : '家政服务' 
            }],
            column : [{
                title: '服务名称',
                key: 'name' 
            },{
                title: '所属小区',
                key: 'plot'
            },{
                title: '服务类型',
                key: 'type'
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
                                    this.serviceDetail('edit' , this.list[params.index]);
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
                                    this.serviceDetail('check' , this.list[params.index]);
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
                                marginRight:'20px',
                                color:'#1890ff',
                            },
                            on: {
                                click: () => { 
                                    
                                }
                            }
                        }, '置顶'),
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
                title : '服务管理'
            },{
                title : "服务类型管理"
            }],1);
        })
    },
    methods:{
        serviceDetail(type , query){
            this.$router.push({
                path : '/serviceDetail',
                query : query
            })
        },
        deleteData(){

        },
    }
  
}
</script>

<style lang='scss'>

</style>
