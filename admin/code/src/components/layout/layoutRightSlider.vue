<template id="layoutRightSlider">
    <Layout :style="{padding: '24px 24px 10px 24px'}">
        <Content 
            id="main_content"
            class="main_content flex flex-direction-column">
            <router-view ></router-view>
        </Content>
    </Layout>
</template>

<script>
export default {
    data(){
        return {
            paths : [], //面包屑导航显示
            userName: 'admin',
            changePasswordView: false,      // 显示修改密码对话框

            initialActiveMenu : '', //左侧菜单栏已选菜单 name
            initialActiveSubMenu : []
        }
    },
    components: {
    },
    mounted: function () {
    },
    methods: {
        /**
         * 切换左边菜单
        */
        changeMenu: function(name){
            this.initBreadcrumb(name);
            this.queryUrlAddress(name)
        },
        /**
         * 初始化面包屑（微门户管理/底部菜单管理）
        */
        initBreadcrumb(name){
           var _this = this
            for(var i = 0 ; i < this.slideMenu.length ; i ++){
                var item = this.slideMenu[i]
                if(item.menuItems.length == 0){
                    if(item.name == name){
                        common.sessionSet("sideMenuActiveName" , item.name)
                        break;
                    }
                }else{
                    item.menuItems.forEach(function(value){
                        if(value.name == name){
                            common.sessionSet("sideMenuActiveName" , value.name)
                        }
                    })
                }
            }
            
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
        /**
         * 账户选项
        */
        dropSelect(name) {
            if(name == 'changePassword') {
                this.changePasswordView = true;
            }
            if(name == 'loginOut') {
                sessionStorage.removeItem("userInfo");
                sessionStorage.removeItem("userButtonPower");
                sessionStorage.removeItem("userMenus");
            }
        },
        confirmChange() {
            this.$refs.changePassword.setPassword();
        }
    }
  
}
</script>
<style lang="scss">
    @import '~assets/css/layout.scss';
    @import '~assets/css/flexComp.scss';
</style>

