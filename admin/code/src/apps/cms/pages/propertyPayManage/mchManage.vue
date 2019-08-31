<template>
    <div id="noticeManageIndex">
        <layout-container>
            <div slot="title">
                <div class="flex">
                    <span>小区：</span>
                    <Select v-model="selectPlotValue" style="width:150px">
                        <Option v-for="item in plotList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
            </div>
            <div slot="extra">
                <!-- <Button type="primary" icon="ios-plus" @click="toPage('add' , '')">新增</Button> -->
            </div>
             <Table 
                :columns="column" 
                :data="list"
                :highlight-row = highlight
                :loading = loading
                ></Table>
        </layout-container>

        <!--删除收费单位对话框-->
        <Modal v-model="deleteModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除收费单位</span> 
            </p>
            <div style="text-align:center">
                <p>收费单位删除后将不再显示</p> 
                <p>是否继续删除?</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="delete_loading" @click="deleteNotice">删除</Button>
            </div>
        </Modal>
    </div>
    
</template>

<script>
import layoutContainer from 'components/layout/layoutContainer.vue'
export default {
    name:'',
    data(){
        return {
            deleteModal : false,
            deleteItem : {},
            delete_loading : false,
            selectPlotValue: '-1',
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
            list:[{
                unitName : 'XX人事部',
                payee : 'XX牧业',
                createTime : '2019-08-28',
                plot : '祥和佳园' 
            },{
                unitName : 'XX安保部',
                payee : 'XX牧业',
                createTime : '2019-08-28',
                plot : '祥和佳园' 
            }],
            loading : false,
            highlight : true,
            column: [{
                title: '收费单位',
                key: 'unitName'
            },{
                title: '收款方',
                key: 'payee'
            },{
                title: '所属小区',
                key: 'plot'
            },{
                title: '时间',
                key: 'createTime'
            },{
                title: '操作',
                key: 'account',
                width : 230,
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
                                    this.toPage('check' , this.list[params.index]);
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
                                color:"rgb(145, 213, 255)",
                                color:'#1890ff',
                                marginRight:'20px',
                            },
                            on: {
                                click: () => {
                                    this.toPage('edit' , this.list[params.index]);
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
                                color:"rgb(145, 213, 255)",
                                color:'#1890ff',
                                marginRight:'20px',
                            },
                            on: {
                                click: () => {
                                    // this.toPage('edit' , this.list[params.index]);
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
                                marginRight:'20px',
                            },
                            on: {
                                click: () => { 
                                    this.deleteItem = this.list[params.index];
                                    this.deleteModal = true;
                                }
                            }
                        }, '删除'),
                    ]);
                }
            }], 
        }
    },
    components: {
        layoutContainer
    },
    mounted:function () {
         this.$nextTick(function() {
            window.eventHub.$emit("changePath", [{
                title : "收费单位管理"
            }],1);
        })
    },
    methods:{
        toPage(type , info){
            this.$router.push({
                path : '/noticeDetail',
                query : {
                    type : type,
                    info : info ? info : ''
                }
            })
        },
        deleteNotice(){
            this.deleteModal = false;
        }
    }
  
}
</script>

<style lang='scss'>

</style>
