<template>
    <div class="detailTab">
        <layout-container>
            <Tabs value="name1" :animated="false" style="min-height:410px;">
                <TabPane label="录用书编号" name="name1">
                   <Employment></Employment>
                </TabPane>
                <TabPane label="注册表编号" name="name2">
                   <register></register>
                </TabPane>
            </Tabs>
        </layout-container>
    </div>
</template>
<script> 
/************************************************
 * @author   : baoxun
 * @date     : 2018-11-19-14:56
 * @direction:  证书编号录用管理
 ************************************************/
import layoutContainer from 'components/layout/layoutContainer.vue'
import register from '../../components/register.vue'
import Employment from '../../components/Employment.vue'
export default {
    components:{
        layoutContainer,
        register,
        Employment
    },
    data() {
        return {
            
        }
    },
   
    mounted() {
        
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
