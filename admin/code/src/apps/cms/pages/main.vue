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
                width="256" v-model="shrink">
                <layout-left-slider :shrink="shrink" ref="layoutLeftSlider" :info="info"></layout-left-slider>
            </Sider>
            <Layout>
                <layout-header @toggleClick="toggleClick" @menuChange="menuChange" :info="info"></layout-header>
                <Content>
                    <layout-right-slider></layout-right-slider>
                </Content>
                <layout-footer :info="info"></layout-footer>
            </Layout>
        </Layout>
    </div>
</template>

<script>
import LayoutHeader from 'components/layout/layoutHeader.vue'
import LayoutFooter from 'components/layout/layoutFooter.vue'
import LayoutLeftSlider from 'components/layout/layoutLeftSlider.vue'
import layoutLeftSliderShrink from 'components/layout/layoutLeftSliderShrink.vue'
import LayoutRightSlider from 'components/layout/layoutRightSlider.vue'
export default {
    data(){
        return {
            shrink : false,
            info: {
                logo : '',
                logo_thumb : '',
                welcome_icon : '',
                copyright : ''
            }
        }
    },
    components: {
        LayoutHeader,
        LayoutFooter,
        LayoutLeftSlider,
        layoutLeftSliderShrink,
        LayoutRightSlider
    },
    mounted: function () {
        //菜单收缩与展开
         window.eventHub.$on('changeMenuStatus',function(value){
            this.shrink = value;
        }.bind(this));
    },
    methods: {
        /**
         * 修改左侧菜单栏大小
        */
        toggleClick(param){
            if(param.type == 0){
                this.shrink = param.value;
                this.$refs.side1.toggleCollapse();
            }else if( param.type == 1 ){
                this.$refs.layoutLeftSlider.queryMenu(param.value)
            }
            
        },
        menuChange(){
            this.$refs.layoutLeftSlider.queryMenu()
        }
    }
}
</script>
<style lang="scss">
@import '~assets/css/layout.scss';

</style>

