<template id="layoutRightSlider">
    <div v-if="slideMenu.length > 0" ref="sliceMenu"> 
        <div v-show="!shrink" >
            <div class="logo-wrap">
                <img class="logo-img" src="data:image/png;base64,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" />
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
                    :class="menuitemClasses"
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
</template>

<script>
export default {
    data(){
        return {
            theme2: 'dark',
            paths : [], //面包屑导航显示
            userName: 'admin',
            changePasswordView: false,      // 显示修改密码对话框
            slideMenu : [{
                remark : '组织结构管理',
                name : '组织结构管理',
                uri : '',
                icon : 'network',
                childs : [{
                    id : 1,
                    remark : 'concatsIndex',
                    name : '组织结构管理',
                    icon : 'setting',
                    uri : 'lechatSystem.html#/concatsIndex',
                    uriType : 0
                },{
                    id : 2,
                    remark : 'stationManagement',
                    name : '岗位管理',
                    icon : 'setting',
                    uri : 'lechatSystem.html#/stationManagement',
                    uriType : 0
                }]
            },{
                id : 14,
                remark : 'noticeManageIndex',
                name : '公告管理',
                uri : 'cms.html#/noticeManageIndex',
                icon : 'ios-box',
                uriType : 0
            },{
                id : 14,
                remark : 'serviceList',
                name : '服务管理',
                uri : 'cms.html#/serviceList',
                icon : 'ios-box',
                uriType : 0
            },{
                remark : '',
                name : '物业缴费服务',
                uri : '',
                icon : 'network',
                childs : [{
                    id : 1,
                    remark : 'mchManage',
                    name : '收费单位管理',
                    icon : 'setting',
                    uri : 'cms.html#/mchManage',
                    uriType : 0
                },{
                    id : 2,
                    remark : 'feeItemManage',
                    name : '收费项目管理',
                    icon : 'setting',
                    uri : 'cms.html#/feeItemManage',
                    uriType : 0
                }]
            }],
            activeMenu : '', //左侧菜单栏已选菜单 name
            openMenu : [],
            initialActiveSubMenu : [],
            activeName : '',
        }
    },
     components: {
    },
    props:{
        shrink: {
            type: Boolean,
            default: false
        },
        info : {
            type : Object,
            default : {}
        }
    },
    computed: {
        menuitemClasses () {
            return [
                'menu-item',
                this.shrink ? 'collapsed-menu' : ''
            ]
        }
    },
    watch: {
        '$route' (to, from) {
            
        }
    },
    mounted: function () {
        var _this = this;
        this.activeName = this.$route.meta.name;
         window.eventHub.$on('changeActiveName',function(name){
            _this.activeName = name;
        }.bind(this));
        
    },
    methods: {
        /**
         * 获取菜单框数据
        */
        queryMenu(item){
            var id = common.sessionGet("menuId" );
            let url = constGlobal.HostPrivilege + 'getMenuTreeByModuleIdAndUser?moduleId=' + id;
            http.apiGet( url ).then( res=>{
                if( res.status == 0){
                    this.activeName = this.$route.meta.name;
                    this.slideMenu = res.data;
                    if(window.location.hash == '#/'){
                        this.$router.push({path:'/welcome'});
                    }
                    this.initOpenName();
                }else{
                    common.toastMsg( res.message );
                }
            });
        },
        initOpenName(){
            for(var i = 0 ; i < this.slideMenu.length ; i++){
                if(this.slideMenu[i].childs){
                    for(var j = 0 ; j < this.slideMenu[i].childs.length ; j++){
                        if(this.slideMenu[i].childs[j].remark == this.activeName){
                           this.openMenu[0] = this.slideMenu[i].remark;
                        }
                    }
                }
            }
        },
        /**
         * 切换左边菜单
        */
        changeMenu: function(name){
            for(var i = 0 ; i < this.slideMenu.length ; i ++){
                if(this.slideMenu[i].childs){
                    for(var j = 0 ; j < this.slideMenu[i].childs.length ; j++){
                        if(this.slideMenu[i].childs[j].remark == name && this.slideMenu[i].childs[j].uriType == 0){
                            window.location.href = this.slideMenu[i].childs[j].uri;
                        }else if(this.slideMenu[i].childs[j].remark == name && this.slideMenu[i].childs[j].uriType == 1){
                            this.$router.push({
                                name: 'outSide' , 
                                query : {
                                    uri : this.slideMenu[i].childs[j].uri,
                                    title : this.slideMenu[i].childs[j].name
                                }
                            });
                        }else if(this.slideMenu[i].childs[j].remark == name && this.slideMenu[i].childs[j].uriType == 2){
                            window.open(this.slideMenu[i].childs[j].uri);
                            this.activeName = '';
                        }
                    }
                }else{
                    if(this.slideMenu[i].remark == name && this.slideMenu[i].uriType == 0){
                        window.location.href = this.slideMenu[i].uri;
                    }else if(this.slideMenu[i].remark == name && this.slideMenu[i].uriType == 1){
                        this.$router.push({
                            name: 'outSide' , 
                            query : {
                                uri : this.slideMenu[i].uri,
                                title : this.slideMenu[i].name
                            }
                        });
                    }else if(this.slideMenu[i].remark == name && this.slideMenu[i].uriType == 2){
                        window.open(this.slideMenu[i].uri);
                        this.activeName = '';
                    }
                }
            }
        },
    }
  
}
</script>
<style lang="scss">
@import '~assets/css/layout.scss';

</style>

