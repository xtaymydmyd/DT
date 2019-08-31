<style lang="less">
    @import './404.less';
</style>
<template >
    <div class="micropage-list">
        <layout-container>
            <div class="error404-body-con-title">4<span><Icon type="ios-navigate-outline"></Icon></span>4</div>
            <p class="error404-body-con-message">YOU&nbsp;&nbsp;LOOK&nbsp;&nbsp;LOST</p>
            <div class="error404-btn-con">
                <Button @click="backPage" size="large" style="width: 200px;margin-left: 40px;" type="primary">返回上一页</Button>
            </div>
        </layout-container>
    </div>
</template>

<script>
import layoutContainer from 'components/layout/layoutContainer.vue'
export default {
    data(){
        return {
            
        }
    },
    computed: {

    },
    created: function () {

    },
    components: {
        layoutContainer
    },
    mounted: function () {
        this.$nextTick(function() {
            window.eventHub.$emit("changePath", ["页面不存在"],1);
        })
    },
    methods: {
        backPage () {
            this.$router.go(-1);
        },
    }
  
}
</script>
<style lang="scss">

</style>

