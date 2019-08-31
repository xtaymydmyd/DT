<template id="main">
    <div class="layout">
        <Layout :style="{height: '100%'}">
            <Sider 
                style="overflow:auto;"
                ref="side1" 
                hide-trigger 
                collapsible 
                :shrink='shrink'
                :collapsed-width="78" 
                width="256" 
                v-model="shrink">
                <div v-if="slideMenu.length > 0" ref="sliceMenu"> 
                    <div v-show="!shrink" >
                        <div class="logo-wrap">
                            <img class="logo-img" :src="info.logo" />
                        </div>
                        <div class="flex-1">   
                            <Menu 
                                ref="side_menu" 
                                :active-name="activeName" 
                                :open-names="openMenu"
                                @on-select="changeMenu"
                                accordion 
                                width='auto'
                                :theme="theme2"
                                >
                                <div v-for="(item , index) in slideMenu" :key = index>
                                    <Submenu :name="item.remark" v-if="item.childs && item.childs.length > 0">
                                        <template slot="title">
                                            <Icon :size="16" :type="item.icon || item.icon"></Icon>
                                            <span>{{item.name}}</span>
                                        </template>
                                        <MenuItem 
                                            v-for="(menu , j) in item.childs" 
                                            :name="menu.remark" 
                                            :key="j"
                                            > 
                                            <div style="display:inline-block;width:20px;"></div>
                                            <span>{{menu.name}}</span>
                                        </MenuItem>
                                    </Submenu>
                                    <MenuItem 
                                        :name="item.remark" 
                                        v-else> 
                                        <Icon :size="16" :type="item.icon || item.icon"></Icon>
                                        <span>{{item.name}}</span>
                                    </MenuItem>
                                </div>
                            </Menu>
                        </div>
                    </div>
                    <div v-if="shrink">
                        <div class="logo-wrap">
                            <img class="logo-img" :src="info.logo_thumb" />
                        </div>
                        <template v-for="(item, index) in slideMenu">
                            <div style="text-align: center;" :key="index">
                                <Dropdown 
                                    transfer 
                                    v-if="item.childs && item.childs.length > 0" 
                                    placement="bottom-end" 
                                    trigger ="click"
                                    :key="index"
                                    @on-click="changeMenu" >
                                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;color:white;" type="text">
                                        <Icon :size="16" :type="item.icon"></Icon>
                                    </Button>
                                    <DropdownMenu style="width: 200px;" slot="list" >
                                        <template v-for="(child, i) in item.childs">
                                            <DropdownItem :name="child.remark" :key="i" >
                                                <Icon :type="child.icon"></Icon>
                                                <span style="padding-left:10px;">{{ child.name}}</span>
                                            </DropdownItem>
                                        </template>
                                    </DropdownMenu>
                                </Dropdown>
                                <Dropdown transfer 
                                    v-else placement="right-start" 
                                    :key="index" 
                                    @on-click="changeMenu"
                                >
                                    <Button  style="width: 70px;margin-left: -5px;padding:10px 0;color:white;" type="text">
                                        <Icon :size="16" :type="item.icon || item.icon"></Icon>
                                    </Button>
                                    <DropdownMenu style="width: 200px;" slot="list">
                                        <DropdownItem 
                                            :name="item.remark" 
                                            :key="'d' + index">
                                            <Icon :type="item.icon || item.icon"></Icon>
                                            <span style="padding-left:10px;">{{ item.name }}</span>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </template>
                    </div>
                </div>
            </Sider>
            <Layout>
                <div style="background:#fff;">
                    <Header id="header" class="layout-header flex" >
                        <Button class="menu-icon" 
                            :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" 
                            type="text" 
                            @click="toggleClick()">
                            <Icon type="navicon" size="32"></Icon>
                        </Button>
                        <div class="menu flex flex-1">
                            <div class="menu-wrap" 
                                v-for="module in modules"
                                :key="module.url" 
                                @click="changeRouter(module)"
                                :class="{active : moduleId == module.id}" >
                                <span class="menu-wrap-text">{{module.name}}</span>
                                <div class="topSlider transition-bottom-start" v-if="module.childs && module.childs.length > 0">
                                    <div 
                                        v-for="(item , index) in module.childs" 
                                        :key="index"
                                        :class="{'active' : moduleId == item.id}"
                                        >
                                        <span @click="toModule(item)">{{item.name}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                    <Breadcrumb :style="{margin: '24px 0' , padding:'0px 24px'}">
                        <BreadcrumbItem 
                            v-for="(path , index) in paths" 
                            :key="index" 
                            :to="{ name : path.name , params : path.params , query : path.query}">{{path.title}}</BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <Content>
                     <Layout :style="{padding: '24px 24px 10px 24px'}">
                        <Content 
                            id="main_content"
                            class="main_content flex flex-direction-column" 
                            >
                            <router-view ></router-view>
                        </Content>
                    </Layout>
                </Content>
                <Footer>{{info.copyright}}</Footer>
            </Layout>
        </Layout>
    </div>
</template>

<script>

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
            theme2: 'dark',
            shrink : false,
            info: {
                logo : '',
                logo_thumb : '',
                welcome_icon : '',
                copyright : ''
            },
            slideMenu : [],
            paths : [], //面包屑导航显示
            modules: [],
            menuList : [],
            activeName : "",
            paths : [], //面包屑导航显示
            userName: 'admin',
            changePasswordView: false,      // 显示修改密码对话框
            shrink: false,
            activeIndex : 0,
            moduleId : '',
            editPasswordModal : false,
            openMenu : [],
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
            routerName : ''
        }
    },
    watch: {
        '$route' (to, from) {
            this.activeName = to.name;
            this.changePath();
        }
    },

    mounted: function () {

        window.eventHub.$on('changePath',function(path){
            this.paths = path;
        }.bind(this));
        window.eventHub.$on('changePath',function(path){
            this.paths = path;
        }.bind(this));
        window.eventHub.$on('addBreadcrumb',function(path){
            for(var i = 0 ; i < path.length ;i++){
                this.paths.push(path[i])
            }
            this.paths.push(path);
        }.bind(this));
        //菜单收缩与展开
         window.eventHub.$on('changeMenuStatus',function(path){
            this.shrink = !this.shrink;
        }.bind(this));

        this.routerName = this.$route.meta.name;
        console.log(this.routerName)
    },
    methods: {
        changePath(){
            var currentItem = {};
            console.log(this.activeName)
            for(var i = 0 ; i < this.menuList.length ; i++){
                if(this.activeName == this.menuList[i].remark){
                    console.log(this.menuList[i])
                    currentItem = this.menuList[i]
                }
            }
            for(var j = 0 ; j < this.menuList.length ; j++){
                if(currentItem.parentId == this.menuList[j].id){
                    console.log(this.menuList[j])
                    this.paths = [{
                        title : this.menuList[j].name
                    },{
                        title : currentItem.name
                    }]
                    break;
                }
            }
            if(j == this.menuList.length){
                this.paths = [{
                    title : currentItem.name
                }]
            }
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
        /**
         * 修改模块
        */
        changeRouter(item){
            if(item.childs && item.childs.length > 0){
                return;
            }else{
                this.toModule(item)
            }
        },
        toModule(item){
            window.location.href = item.uri;
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
        /**
         * 显示与缩小菜单栏
        */
        toggleClick(){
            if(!this.shrink){
                this.$refs.side1.toggleCollapse();
            }else{
                this.shrink = !this.shrink
            }
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
                            this.$Message.info('密码修改成功');
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
            let url = constGlobal.MainHost + '/logout';
            window.location.href = url;
        },
        /**
         * 获取用户信息
        */
        queryUserInfo(){
            var url = constGlobal.HostContact + 'loginInformation/search'
            http.apiGet( url ).then( res=>{
                if( res.status == 0){
                    this.userInfo = res.data
                }else{
                    common.toastMsg( res.message );
                }
            });
        },
    }
}
</script>
<style lang="scss">
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
    .aa{
        z-index: 20141436;
    -webkit-transition: all .45s cubic-bezier(.23,1,.32,1);
    transition: all .45s cubic-bezier(.23,1,.32,1);
    color: rgba(0,0,0,.87);
    background-color: #fff;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    visibility: visible;
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
            margin-right:40px;
            color : #70747b;
            cursor:pointer;
            position:relative;
            .topSlider{
                display:none;
                padding: 20px 30px;
                font-size: 14px;
                line-height: 34px;
                color: #333;
                .active{
                    color : #3399ff;
                    font-weight:bold;
                }
            }
        }
        .menu-wrap:hover{
            .topSlider{
                display:inline-block;
                height: 0;
                -webkit-transition: height 100ms ease-in;
                -moz-transition: height 100ms ease-in;
                -o-transition: height 100ms ease-in;
                transition: height 100ms ease-in;
            }
            .topSlider{
                min-width: 400px;
                min-height: 100px;
                border: 1px solid #eaeaea;
                position: absolute;
                z-index: 123456;
                background:white;
                left: -30px;
            }
            .topSlider{
                height:300px;
                 -webkit-box-shadow: 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12);
                box-shadow: 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12);
                position:absolute;
            }
        }
       
        .menu-wrap.active{
            color :$theme-dark;
            font-weight:bold;
        }
    }
}
.ivu-layout-footer{
    padding: 0px 24px 10px 24px;
    text-align: center;
    font-size: 12px;
    color: #999;
}
</style>

