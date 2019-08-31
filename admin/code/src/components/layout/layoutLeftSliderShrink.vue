<template id="layoutRightSlider">
    <div >
        <div class="logo-wrap">
            <img class="logo-img" src="static/img/layout/admin_thumb.png" />
        </div>
        <template v-for="(item, index) in slideMenu">
            <div style="text-align: center;" :key="index">
                <Dropdown 
                    transfer 
                    v-if="item.menuItems.length > 0" 
                    placement="right-start" 
                    :key="index" 
                    @on-click="changeMenu">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;color:white;" type="text">
                        <Icon :size="20" :type="item.menuIcon"></Icon>
                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <template v-for="(child, i) in item.menuItems">
                            <DropdownItem :name="child.menuName" :key="i">
                                <Icon :type="child.menuIcon"></Icon>
                                <span style="padding-left:10px;">{{ child.menuName}}1</span>
                            </DropdownItem>
                        </template>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown transfer 
                    v-else placement="right-start" 
                    :key="index" 
                    @on-click="changeMenu">
                    <Button @click="changeMenu(item.uri)" style="width: 70px;margin-left: -5px;padding:10px 0;color:white;" type="text">
                        <Icon :size="20" :type="item.menuIcon || item.menuIcon"></Icon>
                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <DropdownItem 
                            :name="item.menuName" 
                            :key="'d' + index">
                            <Icon :type="item.menuIcon || item.menuIcon"></Icon>
                            <span style="padding-left:10px;">{{ item.menuName }}2</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    data(){
        return {
            theme2: 'dark',
            paths : [], //面包屑导航显示
            userName: 'admin',
            changePasswordView: false,      // 显示修改密码对话框
            slideMenu : [],
            modules : [{
                homeUrl : 'lechatSystem.html',
                slideMenu : [{
                    menuName: "主页",
                    url: "/dashboard",
                    name : 'dashboard',
                    menuIcon: "flag",
                    menuItems: [],
                },{
                    menuName: "统一组织管理",
                    url : '',
                    name: "contacts",
                    menuIcon: "settings",
                    menuItems: [
                        {
                            menuName:"组织结构管理",
                            url : '/concatsIndex',
                            name : 'concatsIndex'
                        },{
                            menuName:"岗位管理",
                            url : '/stationManagement',
                            name : 'stationManagement'
                        }
                    ]
                },{
                    menuName: "应用中心",
                    url : '',
                    name: "application",
                    menuIcon: "cube",
                    menuItems: [
                        {
                            menuName:"门户应用管理",
                            url : '/showApp',
                            name : 'showApp'
                        },{
                            menuName:"企业微信管理",
                            url : '/enterpriseWeChat',
                            name : 'enterpriseWeChat'
                        },{
                            menuName :'服务号管理',
                            url : '/serviceNum',
                            name : 'serviceNum'
                        }
                    ]
                },{
                    menuName: "微门户管理",
                    url : '',
                    name: "microPortal",
                    menuIcon: "ios-color-filter",
                    menuItems:[
                        {
                            menuName : "宣传图片管理",
                            url : '/picManage',
                            name: "picManage",
                        },
                        {
                            menuName : "底部菜单管理",
                            url : '/tabManage',
                            name: "tabManage",
                        },
                        {
                            menuName : "新增图片管理",
                            url : '/addPicManage',
                            name: "addPicManage",
                        },
                    ]
                },{
                    menuName: "消息管理",
                    url : '',
                    name: "message",
                    menuIcon: "chatboxes",
                    menuItems:[
                        {
                            menuName : "定时消息管理",
                            url : '/timingMessage',
                            name: "timingMessage",
                        },
                        {
                            menuName : "自定义消息管理",
                            url : '/customMessage',
                            name: "customMessage",
                        }
                    ]
                },{
                    menuName: "素材管理",
                    url : '',
                    name: "materialManagement",
                    menuIcon: "ios-medical",
                    menuItems:[
                        {
                            menuName : '图片管理',
                            url : '/pictureManage',
                            name : 'pictureManage'
                        },
                        {
                            menuName : "微页面列表",
                            url : '/microPageList',
                            name: "microPageList",
                        },
                        {
                            menuName : "微信图文",
                            url : '/wechatGraphicList',
                            name: "wechatGraphicList",
                        },
                        {
                            menuName : "高级图文",
                            url : '/seniorGraphicList',
                            name: "seniorGraphicList",
                        }
                    ]
                }]
            },{
                homeUrl : 'campus.html',
                slideMenu : [{
                    menuName: "校园学习",
                    url : '/camputIndex',
                    name: "camputIndex",
                    menuIcon: "ios-navigate",
                    menuItems: []
                }]
            }],
            activeMenu : '', //左侧菜单栏已选菜单 name
            initialActiveSubMenu : []
        }
    },
    shrink: {
        type: Boolean,
        default: false
    },
    mounted: function () {
        this.initSliderMenu()
    },
    methods: {
        /**
         * 初始化菜单栏数据
        */
        initSliderMenu(){
            var path = window.location.pathname;
            var url = path.slice(1) , _this = this;
            this.modules.forEach(item => {
                if(url == item.homeUrl){
                    _this.slideMenu = item.slideMenu;
                    _this.initActiveMenu()
                }
            })
        },
        /**
         * 初始化菜单（已选）
        */
        initActiveMenu(){
            var _this = this
            this.$nextTick(function() {
                var hashUrl = window.location.hash.slice(1);
                _this.slideMenu.forEach(item => {
                    if(item.menuItems.length == 0 && item.url == hashUrl){
                        _this.activeMenu = item.url;
                        return;
                    }else{
                        if(item.menuItems.length > 0 ){
                            item.menuItems.forEach( modules => {
                                if(modules.url == hashUrl){
                                    _this.activeMenu = modules.url;
                                }
                            })
                        }
                    }
                })
            });
        },
        /**
         * 切换左边菜单
        */
        changeMenu: function(name){
            this.$router.replace({path: name});
        },
        /**
         * 路由跳转（外链使用iframe来嵌套展示）
        */
        queryUrlAddress(url){
            if(url.indexOf("http") > -1){
                this.$router.push({name: 'outSide' , query : {outSide : url}});
            }else{
                this.$router.push({name: url})
            }
        },
        
    }
  
}
</script>
<style lang="scss">
@import '~assets/css/layout.scss';

</style>

