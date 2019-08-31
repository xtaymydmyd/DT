<template>
    <div class="cmsPageInfo">
        <layout-container :layoutBodyPadding="false">
            <Tabs value="name1" :animated="false">
                <TabPane label="基本信息" name="name1">
                    <pageBaseInfo ref="pageBaseInfo"></pageBaseInfo>
                </TabPane>
                <TabPane label="引用管理" name="name2">
                    <pageQuoteManage ref="pageQuoteManage"></pageQuoteManage>
                </TabPane>
                <TabPane label="备份记录" name="name3">
                    <pageVersion ref="pageVersion"></pageVersion>
                </TabPane>
            </Tabs>
        </layout-container>
    </div>
</template>
<script>

import layoutContainer from 'components/layout/layoutContainer.vue'
import pageBaseInfo from 'cms/pages/cmsManage/pageBaseInfo.vue'
import pageQuoteManage from 'cms/pages/cmsManage/pageQuoteManage.vue'
import pageVersion from 'cms/pages/cmsManage/pageVersion.vue'

export default {
    data() {
        return {
            leftActive: '2',
            pageId : ''
        } 
    },
    components:{
        layoutContainer,
        pageBaseInfo,
        pageQuoteManage,
        pageVersion
    },
    mounted() {
        
        this.$nextTick(function() {
            window.eventHub.$emit("changePath", [{
                title : "页面管理",
                name : "index"
            },{
                title : "查看信息"
            }]);
        })
        this.pageId = this.$route.query.pageId;
        this.$refs.pageBaseInfo.init(this.pageId);
        this.$refs.pageQuoteManage.init(this.pageId);
        this.$refs.pageVersion.init(this.pageId);
    }
}
</script>

<style lang="scss" >
    .cmsPageInfo{
        .ivu-tabs-nav-scroll{
           padding-left:15px;
        }
        .ivu-tabs-nav .ivu-tabs-tab{
            padding : 15px 16px;
        }
    }
</style>
