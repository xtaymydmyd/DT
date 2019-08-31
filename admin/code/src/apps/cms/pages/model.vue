<template>
    <div>
        <layout-container>
            <div slot="title"></div>
            <div slot="extra">
            </div>
        </layout-container>
    </div>
</template>

<script>
import layoutContainer from 'components/layout/layoutContainer.vue'
export default {
    name:'',
    data(){
       return {

        }
    },
    components: {
        layoutContainer
    },
    mounted:function () {
         this.$nextTick(function() {
            window.eventHub.$emit("changePath", [{
                title : "公告管理"
            }],1);
        })
    },
    methods:{

    }
  
}
</script>

<style lang='scss'>

</style>
