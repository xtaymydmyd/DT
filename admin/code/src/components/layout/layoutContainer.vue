<template>
    <div 
        class="layout-container flex flex-1 flex-direction-column" 
        :style="{
            height : fixedHeight ? layoutContainerHeight + 'px' : '',
            overflow : fixedHeight ? 'hidden' : '',
            backgroundColor : backgroundColor,
            minHeight : !fixedHeight ? layoutContainerHeight + 'px' : '' ,
        }"
        id="layout-container">
        <div 
            class="layout-container-head flex flex-align-items" 
            v-if="showHead">
            <div class="layout-container-head-left">
                <slot name = "title" class="title"></slot>
            </div>
            <div v-if="back" name = "back" class="title back" @click="backFun" style="line-height:32px;">
                <!-- <Icon type="arrow-left-a"></Icon> -->
                <img src="~assets/img/return.png" alt="" style="margin-bottom:-3px;">
                <span style="font-size:14px">&nbsp;返回上一级</span>
            </div>
            <div class="layout-container-head-right flex flex-1 flex-justify-content-right" v-if="showExtra">
                <slot name = "extra"></slot>
            </div>
        </div>
        <div class="layout-container-body flex flex-direction-column flex-1 " 
            :style="{padding : layoutBodyPadding ? '24px 32px' : '0px' , minHeight : showHead ? layoutContainerHeight - 66 + 'px' : layoutContainerHeight + 'px'}">
            <slot name = "body"></slot>
            <slot></slot>
        </div>
    </div>
</template>

<script>

/**
 * fixedHeight : 固定高度
 * backgroundColor ： 背景颜色
 * 
*/
export default {
    name : 'layoutContainer',
    data () {
        return {
            showHead: true,
            showExtra: true,
            showBody : true,
            layoutContainerHeight : '0px'
        };
    },
    props:{
        back : {
            type : Boolean,
            default : false,
        },
        fixedHeight : {
            type : Boolean,
            default : false
        },
        backgroundColor : {
            type : String,
            default : '#fff'
        },
        layoutBodyPadding : {
            type : Boolean,
            default : true
        }
    },
    mounted() {
        this.showHead = this.title || this.$slots.title !== undefined;
        this.showExtra = this.$slots.extra !== undefined;
        this.showBody = this.$slots.body !== undefined;

        var pageHeight = (document.documentElement.scrollHeight >document.documentElement.clientHeight) ? document.documentElement.scrollHeight : document.documentElement.clientHeight;
        var headerHeight = document.getElementById("header").clientHeight;
        var breadcrumbHeight = 69;
        var bottomHeight = 69;
        this.layoutContainerHeight = pageHeight - 150 - 48 ;
    },
    methods: {
        backFun(){
            this.$router.go(-1);
        }
    }
};
</script>

<style lang="scss">
    @import '~assets/css/public.scss';
     @import '~assets/css/flexComp.scss';
    .layout-container{
        overflow:hidden;
        .layout-container-head{
            border-bottom: 1px solid #e9eaec;
            padding: 16px 32px 16px 32px;
            line-height: 32px;
            .layout-container-head-left{
                .title{
                    width: 100%;
                    font-size: 14px;
                    color: #1c2438;
                    font-weight: 700;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                
            }
            .back{
                font-size:16px;
                cursor:pointer;
            }
        }
        .layout-container-body{
            padding : 24px 32px;
        }
    }
</style>
