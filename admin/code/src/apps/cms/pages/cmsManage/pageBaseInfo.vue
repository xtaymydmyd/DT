<template>
    <div class="cmsPageBaseInfo">
        <div class="baseInfoContent">
            <div class="flex" v-if="info.type">
                <div class="title">类型：</div>
                <div class="content">{{info.type}}</div>
            </div> 
            <div class="flex" v-if="info.name">
                <div class="title">名称：</div>
                <div class="content">{{info.name}}</div>
            </div>
            <div class="flex" v-if="info.pageId">
                <div class="title">页面ID：</div>
                <div class="content">{{info.pageId}}</div>
            </div>
            <div class="flex">
                <div class="title">关联菜单：</div>
                <div class="content">
                    <span v-if="!info.menuId">暂无关联菜单</span>
                    <span v-if="info.menuId">{{info.menuName}}</span>
                </div>
            </div>
            <div class="flex" v-if="info.showUrl">
                <div class="title">页面链接：</div>
                <div 
                    class="content baseInfoUrl flex flex-wrap" 
                    ref="baseInfoUrl" 
                    :data-clipboard-text="info.url" 
                    style="line-height: 20px;margin-top: 14px;">{{info.showUrl}}</div>
                <div v-clipboard:copy="info.showUrl"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError" class="copy_btn">拷贝</div>
            </div>
            <div style="text-align:center;margin-top:40px;">
                <Button type="primary" icon="edit" @click="openEditDialog">编辑</Button>
            </div>
        </div>
        <mu-drawer class="sliderRightDrawer flex flex-direction-column" right width="600" 
            :open="open" 
            :docked="docked" 
            @close="open=false">
            <div class="title" >信息编辑</div> 
            <div class="flex-1 sliderRightDrawerContent" style="overflow-y:scroll">
                <Form 
                    style="margin-right:40px;"
                    ref="departmentInfo" 
                    :label-width="80" >
                    <FormItem label="名称:">
                        <Input 
                            v-model="editParam.name" 
                            placeholder="请输入名称"></Input>
                    </FormItem>
                    <FormItem label="页面ID:">
                        <Input 
                            disabled
                            v-model="editParam.pageId" ></Input>
                    </FormItem>
                    <FormItem label="关联菜单:" class="relMenu">
                        <Input v-model="editParam.menuName">
                            <Button slot="append" icon="edit" @click="openMenuModel"></Button>
                        </Input>
                    </FormItem>
                    <FormItem label="页面链接:">
                        <Input 
                            disabled
                            v-model="editParam.showUrl" ></Input>
                    </FormItem>
                     <!-- <FormItem label="备注:">
                        <Input 
                            type="textarea" :rows="4"
                            v-model="editParam.remark" 
                            placeholder="请输入备注"></Input>
                    </FormItem> -->
                </Form>
            </div>
            <div class="sliderRightOpera flex flex-justify-content">
                <Button type="ghost" @click="cancelEdit()">取消</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" @click="saveEdit()" :loading="loading" style="margin-left: 8px">提交</Button>
            </div>
        </mu-drawer>
        <menu-model 
            ref="menuModelRef" 
            @submitMenu="submitMenu" 
            @cancelMenu="cancelMenu"></menu-model>
    </div>
</template>
<script>
import menuModel from 'components/dialog/menuModel.vue'
import Clipboard from 'clipboard';  
export default {
    data() {
        return {
            linkType : '1',
            loading : false,
            open : false,
            docked : false,
            info : {
                name : "",
                type : "",
                pageId : "",
                menuId : ""
            },
            pageId : '',
            websiteId : '',
            editParam : {
                name : "",
                menuId : "",
                menuName : ""
            }
        } 
    },
    components:{
        menuModel
    },
    methods: {
        init(pageId){
            this.pageId = pageId;
            this.websiteId = this.$route.query.websiteId;
            this.queryBaseInfo();
        },
        /**
         * 打开编辑菜单
        */
        openEditDialog(){
            this.editParam = JSON.parse(JSON.stringify(this.info))
            this.open = true;
        },
        /**
         * 取消编辑
        */
        cancelEdit(){
            this.editParam = {};
            this.open = false;
        },
        /**
         * 保存编辑
        */
        saveEdit(){
            console.log(this.editParam)
            this.loading = true;
            var url = constGlobal.HostCMSAdmin + "pageInfo/update";
            var param = {
                "pageId" : this.editParam.pageId,
                "name" : this.editParam.name,
                "remark" : this.editParam.remark,
                "menuId" : this.editParam.menuId
            }
            http.apiPost(url , param).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        this.loading = false;
                        this.open = false;
                        this.queryBaseInfo();
                    }
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        /**
         * 提交菜单
        */
        submitMenu(info){
            this.editParam.menuId = info.id;
            this.editParam.menuName = info.name;
            this.open = true;
        },
        /**
         * 取消修改菜单
        */
        cancelMenu(){
            this.open = true;
        },
        /**
         * 拷由链接成功
        */
        onCopy(){
            common.toastMsg("拷贝成功",'success');
        },
        /**
         * 拷由链接失败
        */
        onError(){
            common.toastMsg("拷贝成功",'error');
        },
        /**
         * 查询基本信息
        */
        queryBaseInfo(){
            var url = constGlobal.HostCMSAdmin + "pageInfo/searchById?pageId=" + this.pageId;
            http.apiGet(url).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        this.info = res.data;
                    }
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        /**
         * 打开选择菜单
        */
        openMenuModel(){
            this.open = false;
            var param = {
                id : this.editParam.menuId ? this.editParam.menuId : '',
                name : this.editParam.menuName ? this.editParam.menuName : ''
            }
            this.$refs.menuModelRef.init(this.websiteId , param)
        },
        cancelEdit(){

        }
    }
}
</script>

<style lang="scss" >
    .cmsPageBaseInfo{
        padding : 0px 15px;
        .baseInfoContent{
            max-width: 550px;
            margin: auto;
            line-height: 50px;
            font-size:15px;
            .title{
                font-weight:500;
                color : #333;
            }
            .content{
                color : #666;
            }
            .copy_btn{
                cursor:pointer;
                margin-left:10px;
                color:#2d8cf0;
            }
            .baseInfoUrl{
                word-wrap: break-word;
                width: calc(100% - 150px);
                display: inline-block;
            }
        }
        .sliderRightDrawer{
            .title{
                font-size: 16px;
                padding: 20px 15px;
                border-bottom: 1px solid #eaeaea;
            }
            .drawer-container {
                overflow:auto;
                padding : 0px 0px 40px 0px;
            }
            .title1{
                font-size: 16px;
                padding: 10px 15px;
                border-bottom: 1px solid #eaeaea;
            }
            .title-block{
                padding: 15px 30px;
                position: relative;
                background: #f6faff;
                -webkit-box-shadow: 0 1px 4px rgba(0,21,41,.08);
                box-shadow: 0 1px 4px rgba(0,21,41,.08);
                margin-bottom: 20px;
                border-top: 1px solid #fafafa;
            }
            .title-block:before{
                content: '';
                position: absolute;
                height: 15px;
                left: 18px;
                top: 19px;
            }
            .title-1:before{
                border-left: 5px solid #2d8cf0;
            }
            .title-2:before{
                border-left: 5px solid #c1210f;
            }
            .sliderRightDrawerContent{
                padding:30px 0px;
            }
            .sliderRightOpera{
                padding: 20px 15px;
                text-align: center;
                border-top: 1px solid #eaeaea;
            }
        }
        select, textarea, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="color"], .uneditable-input{
            height:35px;
        }
    }
</style>
