<template>
    <Modal
        v-model="previewModel"
        title="预览"
        width = "500px"
        @on-cancel="cancel" class="previewHtmlModelWrap" >
        <div class="flex flex-direction-column">
            <div v-html="html" class="htmlWrap" ></div>
        </div>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
        </div>
    </Modal>
</template>

<script>

export default {
    data () {
        return {
            previewModel : false,
            html : ''
        };
    },
    methods: {
        /**
         * 初始化数据
        */
        init(html){
            this.previewModel = true;
            console.log(html);
            this.html = html;
        },
        cancel () {
            this.previewModel = false;
            this.$emit("cancelPreviewModel");
        }
    }
};
</script>

<style lang="scss">
    @import '~assets/css/public.scss';
    @import '~assets/css/flexComp.scss';
    .previewHtmlModelWrap{
        .htmlWrap{
            min-height: 350px;
            max-height: 400px;
            overflow: auto;
            border: 1px solid #eaeaea;
            border-radius: 2px;
            padding: 7px;
        }
    }
</style>
