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
    watch: {
        $route (to, from) {
            var _this = this;
            this.outSideUrl = this.$route.query.uri;
            this.$nextTick(function() {
                window.eventHub.$emit("changePath", [_this.$route.query.title],1);
                window.document.title = _this.$route.query.title
            })
        }
    },
    mounted() {
        var _this = this;
        this.outSideUrl = this.$route.query.uri;
        this.$nextTick(function() {
            window.eventHub.$emit("changePath", [_this.$route.query.title],1);
            window.document.title = _this.$route.query.title
        })
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
