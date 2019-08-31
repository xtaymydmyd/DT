<template>
    <div id="app" >        
        <keep-alive>
            <transition name="bounce">
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </transition>
        </keep-alive>
        <transition name="bounce">
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'app',
     data(){
        return {
            
        }
    },
    components: {
    },
    mounted:function () {
        
    },
    methods:{
        
    },
}
</script>

<style lang="scss">
    @import '~assets/css/public.scss';
    @import '~assets/css/flexComp.scss';
     @import '~cms/assets/css/indexModule.scss';
    #app {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
    }

    .el-submenu [class^=fa] {
        vertical-align: baseline;
        margin-right: 10px;
    }

    .el-menu-item [class^=fa] {
        vertical-align: baseline;
        margin-right: 10px;
    }
    .WeChat{
        .vux-header{
            .left-arrow{
                display:none;
            }
            .vux-header-back{
                display:none;
            }
        }
    }
    a { 
        text-decoration: none;
        -webkit-tap-highlight-color: transparent;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }

</style>
