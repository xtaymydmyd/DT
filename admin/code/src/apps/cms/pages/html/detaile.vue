<template>
    <div class="detailTab">
        <layout-container>
            <Tabs value="name1" :animated="false">
                <TabPane label="相关信息" name="name1">
                    <tabLeft ></tabLeft>
                </TabPane>
                <TabPane label="在线报名信息" name="name2">
                    <tabRight></tabRight>
                </TabPane>
            </Tabs>
        </layout-container>
    </div>
</template>
<script> 
/************************************************
 * @author   : baoxun
 * @date     : 2018-11-21-13:56
 * @direction: 招录人员详情
 ************************************************/
import layoutContainer from 'components/layout/layoutContainer.vue'
import tabLeft from '../../components/tabLeft.vue'
import tabRight from '../../components/tabRight.vue'
export default {
    components:{
        layoutContainer,
        tabLeft,
        tabRight,
    },
    data() {
       
        return {
            
        }
    },
   
    mounted() {
         this.$nextTick(function() {
            window.eventHub.$emit("changePath", [{
                title : "证书编号管理",
                name:"manageTable"
            },
            {
                title : "详情",
                name:"detaile",
                query : {
                    postId:this.$route.query.id,
                }
            }
            ],1);
        })
    },
    methods: {
        
    }
}
</script>

<style lang="scss" >
@import '~assets/css/public.scss';
@import '~assets/css/flexComp.scss';

</style>
