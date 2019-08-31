<template>
    <div class="contacts">
        <layout-container>
            <div class="flex flex-1 flex-align-items flex-justify-content">
                <img src="~assets/img/welcome.png" style="width:50%;">
            </div>
        </layout-container>
    </div>
</template>
<script>
import layoutContainer from 'components/layout/layoutContainer.vue'
export default {
    data() {
        return {
            
        }
    },
    components:{
        layoutContainer
    },
    mounted() {
        this.$nextTick(function() {
            window.eventHub.$emit("changePath", [{
                title : "欢迎"
            }],1);
        })
    },
    methods: {
        
    }
}
</script>

<style lang="scss" >

</style>
