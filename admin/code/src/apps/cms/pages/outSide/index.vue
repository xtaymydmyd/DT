<template>
    <div class="outSide">
        <layout-container :fixedHeight="true" class="outSideContainer">
            <iframe :src="outSideUrl"></iframe>
        </layout-container>
    </div>
</template>
<script>
import layoutContainer from 'components/layout/layoutContainer.vue'
export default {
    data() {
        return {
            outSideUrl : ""
        }
    },
    watch: {
    },
    components : {
        layoutContainer
    },
    mounted() {
        this.$nextTick(function() {
            window.eventHub.$emit("changePath", [""],1);
        })
        this.outSideUrl = this.$route.query.uri;
    },
    methods: {
       
    }
}
</script>

<style lang="scss" >
.outSide{
    width:100%;
    min-height:100%;
    iframe{
        width:100%;
        height:100%;
        border:0px;
    }
    .outSideContainer{
        .layout-container-body{
            padding : 0px;
        }
    }
}
</style>
