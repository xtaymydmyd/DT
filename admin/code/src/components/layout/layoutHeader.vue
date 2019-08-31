<template  >
    <div style="background:#fff;">
        <Header id="header" class="layout-header flex" >
            <Button class="menu-icon" :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick(0)">
                <Icon type="navicon" size="32"></Icon>
            </Button>
            <div class="menu flex flex-1">
                <div class="menu-wrap" 
                    v-for="module in modules"
                    :key="module.url" 
                    @click="changeRouter(module)"
                    :class="{active : menuId == module.id}" >
                    {{module.name}}
                </div>
            </div>
            <slot name = "headSlot"></slot>
            <slot></slot>
            
            <!-- 账户 -->
            <div class="layout-amdin">
                <Dropdown trigger="click" @on-click="dropSelect">
                    <span style="margin-right:50px;cursor:pointer">
                        {{ userInfo.account }}
                        <Icon type="arrow-down-b"></Icon>
                    </span>
                    <DropdownMenu slot="list">
                        <DropdownItem name="changePassword" v-if="info.passwordEdit == 1" @click.native="openEditPasswordModal">修改密码</DropdownItem>
                        <DropdownItem name="loginOut">退出登录</DropdownItem>
                    </DropdownMenu>
                    <img class="admin-img" src="static/img/layout/default.png" v-if="!userInfo.headImgUrl"/>
                    <img class="admin-img" :src="(userInfo.headImgUrl.indexOf('http') != -1)? userInfo.headImgUrl : sourceUrl + userInfo.headImgUrl " v-if="userInfo.headImgUrl"/>
                </Dropdown>
            </div>
            <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
                <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
                <Form 
                    ref="editPasswordForm" 
                    :model="editPasswordForm" 
                    :label-width="100" 
                    label-position="right" 
                    :rules="passwordValidate">
                    <FormItem label="原密码" prop="oldPass" :error="oldPassError">
                        <Input v-model="editPasswordForm.oldPass" type="password" placeholder="请输入现在使用的密码" ></Input>
                    </FormItem>
                    <FormItem label="新密码" prop="newPass">
                        <Input v-model="editPasswordForm.newPass" type="password" placeholder="请输入新密码，至少6位字符" ></Input>
                    </FormItem>
                    <FormItem label="确认新密码" prop="rePass">
                        <Input v-model="editPasswordForm.rePass" type="password" placeholder="请再次输入新密码" ></Input>
                    </FormItem>
                </Form> 
                <div slot="footer">
                    <Button type="text" @click="editPasswordModal = false">取消</Button>
                    <Button type="primary" :loading="savePassLoading" @click="saveEditPass('editPasswordForm')">保存</Button>
                </div>
            </Modal>
        </Header>
        <Breadcrumb :style="{margin: '24px 0' , padding:'0px 24px'}" id="Breadcrumb">
            <BreadcrumbItem 
                v-for="(path , index) in paths" 
                :key="index" 
                :to="{ name : path.name , params : path.params , query : path.query}">{{path.title}}</BreadcrumbItem>
        </Breadcrumb>
    </div>
</template>
<script>
import ModalChangePassword from 'components/common/ModalChangePassword.vue'
export default {
    data(){
        const valideRePassword = (rule, value, callback) => {
            if (value !== this.editPasswordForm.newPass) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };
        return {
            modules: [],
            activeName : "lechatSystem.html#/",
            paths : [], //面包屑导航显示
            userName: 'admin',
            changePasswordView: false,      // 显示修改密码对话框
            shrink: false,
            activeIndex : 0,
            menuId : '',
            editPasswordModal : false,
            editPasswordForm : {
                oldPass : '',
                newPass : '',
                rePass : ''
            },
            savePassLoading : false,
            passwordValidate: {
                oldPass: [
                    { required: true, message: '请输入原密码', trigger: 'blur' }
                ],
                newPass: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                    { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                ],
                rePass: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                    { validator: valideRePassword, trigger: 'blur' }
                ]
            },
            oldPassError: '',
            userInfo : {
                userName : '',
                headImgUrl : ''
            },
            sourceUrl : constGlobal.HostSource,
            batchList : null,
            currentBatch : null,
            showBatch: true
        }
    },
    props:{
        info : {
            type : Object,
            default : {}
        }
    },
    components: {
        ModalChangePassword
    },
    mounted: function () {
        window.eventHub.$on('changePath',function(path, hideBatch){
            this.paths = path;
            if(hideBatch){
                this.showBatch = false;
            }
        }.bind(this));

        var shrink = sessionStorage.getItem("shrink");
        if(shrink){
            this.shrink = false;
            sessionStorage.setItem("shrink" , 0);
        }else{
            this.shrink = shrink == 1 ? true : false;
        }
    },
    methods: {
        //修改当前操作批次,广播切换批次事件
        changeBatch(){
            common.sessionSet("currentBatch" , this.currentBatch);
            console.log("changeBatch ==== ", this.currentBatch);
            bus.$emit('changeCurrentBatch', this.currentBatch);
        },
        /**
         * 打开修改密码对话框
        */
        openEditPasswordModal(){
            this.editPasswordModal = true;
            this.editPasswordForm = {
                oldPass : '',
                newPass : '',
                rePass : ''
            }
        },
        changeRouter(item){
            this.menuId = item.id
            common.sessionSet("menuId" , this.menuId);
            window.location.href = item.uri;
        },
        /**
         * 切换顶部菜单
        */
        changeMenu: function(name){
            window.location.href = name;
        },
        /**
         * 账户选项
        */
        dropSelect(name) {
            if(name == 'changePassword') {
                this.changePasswordView = true;
            }
            if(name == 'loginOut') {
                this.logout();
            }
        },
        confirmChange() {
            this.$refs.changePassword.setPassword();
        },
        toggleClick(type , item){
            var param = {};
            if(type == 0){//菜单隐藏与显示
                this.shrink = !this.shrink;
                sessionStorage.setItem("shrink" , this.shrink);
                param = {
                    type : 0,
                    value : this.shrink
                }
            }else if(type == 1){//顶部菜单选择后，左侧菜单筛选
                param = {
                    type : 1,
                    value : item
                }
            }
            this.$emit("toggleClick" , param )
        },
        /**
         * 取消修改密码
        */
        cancelEditPass(){

        },
        /**
         * 保存密码 
        */
        saveEditPass(name){
            var url = constGlobal.HostPrivilege + 'updatePassword';
            var param = {
                beforePassword : this.editPasswordForm.oldPass,
                updateToPassword : this.editPasswordForm.newPass
            }
            this.$refs[name].validate((valid) => {
                if (valid) {
                    http.apiPost(url , param).then(res => {
                        if(res.status == 0){
                             this.editPasswordModal = false;
                            common.toastMsg('密码修改成功' , 'success')
                        }else{
                            common.toastMsg(res.message)
                        }
                    })
                } else {
                }
            })
        },
        /**
         * 退出登录
        */
        logout(){
            alert("退出")
        }
    }
}
</script>
<style lang="scss" scoped>
    @import '~assets/css/layout.scss';
    @import '~assets/css/public.scss';
    .layout-header{
        padding : 0px 15px 0px 0px;
        background :#fff;
        -webkit-box-shadow: 0 1px 4px rgba(0,21,41,.08);
        box-shadow: 0 1px 4px rgba(0,21,41,.08);
        .ivu-menu-item-active{
            font-size:20px;
        }

        .menu-icon{
            color:$theme-dark;
            margin-right:10px;
            margin-left:5px;
            margin-right:20px;
        }
        .layout-nav{
            margin-left:0px;
            height: auto;
            overflow: hidden;
            margin-top:3px
        }
        .ivu-btn-text:focus{
            box-shadow:none;
        }
        .menu{
            .menu-wrap{
                font-size:19px;
                margin-right:25px;
                color : #70747b;
                cursor:pointer;
            }
            .menu-wrap.active{
                color :$theme-dark;
                font-weight:bold;
            }
        }
        .currentBatch{
            padding-right: 20px;
            width:200px;
        }
    }
</style>

