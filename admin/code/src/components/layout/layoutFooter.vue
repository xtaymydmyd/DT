<template  >
    <Footer>Copyright© 应急管理部消防救援局 技术支持电话：16601137916</Footer>
</template>

<script>
export default {
    data(){
        return {
            
        }
    },
    props:{
        info : {
            type : Object,
            default : {}
        }
    },
}
</script>
<style lang="scss" scoped>
    @import '~assets/css/layout.scss';
    @import '~assets/css/public.scss';
    .ivu-layout-footer{
        padding: 0px 24px 10px 24px;
        text-align: center;
        font-size: 12px;
        color: #999;
    }
</style>

