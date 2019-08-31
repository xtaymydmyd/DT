<template>
    <div class="cmsContent">
        <layout-container class="customContainer" fixedHeight>
            <div class="container1 flex flex-1">
                <div class="contacts-left collapseContent flex flex-align-items " ref="contactLeft" style="position:relative;">
                    <Collapse v-model="coolapseActive" accordion>
                        <Panel 
                            v-for="(item , index) in layoutList"
                            :key="index" 
                            :name="item.type">
                            {{item.name}}
                            <div slot="content" class="sidebar-nav">
                                <div class="custom-layout">
                                    <div class="lyrow ui-draggable lyrowLayout" sourceSectionId=''  >
                                        <span class="layoutSet iconTag label" ><Icon type="gear-a"></Icon>设置</span>
                                        <div class="remove iconTag label label-important removeCustom"><Icon type="ios-trash"></Icon>删除</div>
                                        <div class="drag iconTag label label-important dragCustom"><Icon type="arrow-move"></Icon><span>移动</span></div>
                                        <div class="dragIcon"></div>
                                        <div class="preview flex flex-direction-column" >
                                            <input type="text" placeholder="布局比例总和为12，冒号分隔">
                                        </div>
                                        <div class="view">
                                            <div class="row-fluid clearfix" >
                                                <div class="span12 column"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="lyrow-wrap">
                                    <div 
                                        v-for="(list , j) in item.list" 
                                        :key="j" 
                                        class="lyrow ui-draggable lyrowLayout" 
                                        sourceSectionId='' 
                                        :class="'component-' + item.type">
                                        <span class="layoutSet iconTag label" ><Icon type="gear-a"></Icon>设置</span>
                                        <div class="remove iconTag label label-important removeCustom"><Icon type="ios-trash"></Icon>删除</div>
                                        <div class="drag iconTag label label-important dragCustom"><Icon type="arrow-move"></Icon>移动</div>
                                        <div class="preview flex flex-direction-column" >
                                            <div :style="{backgroundPosition: list.position}" class="previewIcon"></div>
                                            <span class="text-ellipsis">{{list.name}}</span>
                                        </div>
                                        <div class="view">
                                            <div class="row-fluid clearfix" v-html="list.html"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Panel>
                        <Panel 
                            v-for="item  in componentList"
                            :key="item.typeId" 
                            :name="item.typeId">
                            {{item.typeName}}
                            <div slot="content" class="sidebar-nav">
                                <div class="lyrow-wrap">
                                    <div 
                                        v-for="(list , j) in item.sectionList" 
                                        :key="j" 
                                        class="lyrow ui-draggable" 
                                        :sourceSectionId='list.id' 
                                        >
                                        <span class="set iconTag label" ><Icon type="gear-a"></Icon>设置</span>
                                        <div class="remove iconTag label label-important"><Icon type="ios-trash"></Icon>删除</div>
                                        <div class="drag iconTag label label-important"><Icon type="arrow-move"></Icon>移动</div>
                                        <div class="preview flex flex-direction-column" >
                                            <div  class="previewIcon" style="background:none;position:relative;">
                                                <img :src="list.icon" style="position: absolute;top: 0px; left: 0px;">
                                            </div>
                                            <span class="text-ellipsis">{{list.name}}</span>
                                        </div>
                                        <div class="view">
                                            <div class="row-fluid clearfix" v-html="list.html"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Panel>
                    </Collapse>
                </div>
                <div class="contacts-right flex flex-direction-column">
                    <div class="contacts-right-header flex flex-justify-content-between">
                        <div class="flex-1" style="line-height:32px;">
                            <Icon type="document"></Icon>
                            <span style="padding-left:4px;">{{pageName}}</span>
                        </div>
                        <div>
                            <Button type="ghost" icon="ios-copy-outline" @click="toBackup" >备份</Button>&nbsp;&nbsp;
                            <Button type="ghost" icon="eye" @click="toPreview" >预览</Button>&nbsp;&nbsp;
                            <Button type="primary" icon="ios-download" :loading="saveBtnLoading" @click="saveCMS">保存</Button>
                        </div>
                    </div>
                    <div class="right-container flex-1 overflowYScroll" >
                        <div class="container-bar" ref="containerBar" id="containerBar" :class="{'container-bar-empty' : emptyFlag}">
                            
                        </div>
                        <div class="container-bar-attention" v-show="emptyFlag">
                            <Icon type="arrow-move"></Icon>
                            <span>将布局或组件拖入些区域</span>
                        </div>
                    </div>
                </div>
            </div>
            <mu-drawer class="sliderRightDrawer flex flex-direction-column" right width="600" 
                :open="open" 
                :docked="docked" 
                @close="open=false">
                <div class="title flex flex-justify-content-between">
                    <span>信息设置</span>
                    <!-- {{editInfo.referSectionCaseId}}
                    {{editInfo.count}} -->
                    <div @click="openSectionDialog(0)" class="quoteText" v-if="editInfo.referSectionCaseId == '' && editInfo.count == 0">引用</div>
                    <div @click="openSectionDialog(1)" class="quoteText" v-if="editInfo.referSectionCaseId && editInfo.referSectionCaseId != ''">取消引用</div>
                </div> 
                <div class="flex-1 sliderRightDrawerContent flex flex-direction-column" style="overflow-y:scroll">
                    <div class="no-edit-key flex flex-direction-column flex-align-items flex-justify-content flex-1" v-if="JSON.stringify(editKey) == '{}'">
                        <img src="~cms/assets/img/configuration.png" alt="" style="width:50%;">
                        <span class="no-edit-key-text">暂无配置项</span>
                    </div>
                    <Form 
                        style="margin-right:40px;"
                        v-show="open && JSON.stringify(editKey) != '{}'"
                        ref="departmentInfo" 
                        :label-width="100" >
                        <!-- {{editKey}} -->
                       <!-- {{editParam}} -->
                       <Alert style="margin-left:15px;" show-icon v-if="editInfo.referSectionCaseId">当前引用 ： {{editInfo.referSectionCaseName}}</Alert>
                        <!-- 组件名称 -->
                        <FormItem label="组件名称：">
                            <Input 
                                type="text" 
                                placeholder="请输入组件名称" 
                                v-model="editInfo.name" ></Input>
                        </FormItem>
                        <!-- 文本 -->
                        <FormItem :label="editParam.text.label + ':'" v-if="editKey.text">
                            <Input 
                                type="text" 
                                :placeholder="'请输入' + editParam.text.label" 
                                v-model="editParam.text.value" 
                                :disabled="editInfo.referSectionCaseId ? true : false"></Input>
                        </FormItem>
                        <FormItem :label="editParam.logoutLink.label + ':'" v-if="editKey.logoutLink">
                            <Input 
                                type="text" 
                                :placeholder="'请输入' + editParam.logoutLink.label" 
                                v-model="editParam.logoutLink.value" 
                                :disabled="editInfo.referSectionCaseId ? true : false"></Input>
                        </FormItem>
                        <!-- 标题 -->
                        <FormItem :label="editParam.title.label + ':'" v-if="editKey.title">
                            <Input 
                                type="text" 
                                :placeholder="'请输入' + editParam.title.label" 
                                v-model="editParam.title.value" 
                                :disabled="editInfo.referSectionCaseId ? true : false"></Input>
                        </FormItem>
                        <FormItem :label="editParam.link.label + ':'" v-if="editKey.link && !editKey.innerLink" >
                            <Input 
                                v-model="editParam.link.value" 
                                placeholder="请输入或选择" 
                                :disabled="editInfo.referSectionCaseId ? true : false"></Input>
                        </FormItem>
                        <!-- 更多或其他链接 -->
                        <FormItem :label="editParam.link.label + ':'" v-if="editKey.link && editKey.innerLink"  >
                            <Input 
                                v-model="editParam.link.value" 
                                placeholder="请输入或选择" 
                                v-show="linkType == '1'"
                                :disabled="editInfo.referSectionCaseId ? true : false">
                                <Select :disabled="editInfo.referSectionCaseId ? true : false" v-model="linkType" slot="prepend" @on-change="changeLinkType('link',1)" style="width: 120px" v-show="editKey.link && editKey.innerLink && editKey.link && editKey.innerLink">
                                    <Option value="1">自定义链接</Option>
                                    <Option value="2">内部链接</Option>
                                </Select>
                            </Input>
                            <Input 
                                v-model="editParam.innerLink.value.name" 
                                placeholder="请输入或选择" 
                                v-show="linkType == '2'" 
                                :disabled="editInfo.referSectionCaseId ? true : false">
                                <Select :disabled="editInfo.referSectionCaseId ? true : false" v-model="linkType" slot="prepend" @on-change="changeLinkType('innerLink' , 1)" style="width: 120px">
                                    <Option value="1">自定义链接</Option>
                                    <Option value="2">内部链接</Option>
                                </Select>
                                <Button slot="append" icon="edit" @click="openSelectPageModel('innerLink')"></Button>
                            </Input>
                        </FormItem>
                        <!-- 详情页链接 -->
                        <FormItem :label="editParam.detailLink.label + ':'" v-if="editKey.detailLink && editKey.detailInnerLink"  >
                            <Input 
                                v-model="editParam.detailLink.value" 
                                placeholder="请输入或选择" 
                                v-show="detailLinkType == '1'"
                                :disabled="editInfo.referSectionCaseId ? true : false">
                                <Select :disabled="editInfo.referSectionCaseId ? true : false" v-model="detailLinkType" slot="prepend" @on-change="changeLinkType1('detailLink',1)" style="width: 120px" >
                                    <Option value="1">自定义链接</Option>
                                    <Option value="2">内部链接</Option>
                                </Select>
                            </Input>
                            <Input 
                                v-model="editParam.detailInnerLink.value.name" 
                                placeholder="请输入或选择" 
                                v-show="detailLinkType == '2'" 
                                :disabled="editInfo.referSectionCaseId ? true : false">
                                <Select :disabled="editInfo.referSectionCaseId ? true : false" v-model="detailLinkType" slot="prepend" @on-change="changeLinkType1('detailInnerLink',1)" style="width: 120px">
                                    <Option value="1">自定义链接</Option>
                                    <Option value="2">内部链接</Option>
                                </Select>
                                <Button slot="append" icon="edit" @click="openSelectPageModel('detailInnerLink')"></Button>
                            </Input>
                        </FormItem>
                        <!-- 详情页链接 -->
                        <FormItem :label="editParam.iconLink.label + ':'" v-if="editKey.iconLink">
                            <Input 
                                type="text" 
                                placeholder="请输入" 
                                v-model="editParam.iconLink.value.link" 
                                :disabled="editInfo.referSectionCaseId ? true : false"></Input>
                        </FormItem> 
                        <!-- 文本 、链接、字体颜色 -->
                        <div v-if="editKey.linkList" >
                            <div 
                                v-for="(item , linkIndex) in editParam.linkList.value" 
                                :key="linkIndex" 
                                v-if="editKey.linkList"
                                class="edit-info-wrap1">
                                 
                                <FormItem label="文本:" >
                                    <Input type="text" placeholder="请输入"  v-model="item.name" :disabled="editInfo.referSectionCaseId ? true : false"></Input>
                                </FormItem>
                                <FormItem label="链接:" >
                                    <Input type="text" placeholder="请输入" v-model="item.link" :disabled="editInfo.referSectionCaseId ? true : false"></Input>
                                </FormItem>
                                <FormItem label="字体颜色:" > 
                                    <Input type="text" placeholder="请输入" v-model="item.color" :disabled="editInfo.referSectionCaseId ? true : false"></Input>
                                </FormItem>
                                <div class="flex opera-info">
                                    <div class="flex-1 delete-text"
                                        @click="deleteLinkList(linkIndex)" 
                                        style="">
                                        <Icon type="ios-trash-outline"></Icon>
                                        <span>删除</span></div>
                                    <div class="flex-1 add-text"
                                        @click="addLinkList()" 
                                        v-show="(editParam.linkList.value.length-1) ==linkIndex && editParam.linkList.value.length < (parseInt(editParam.linkList.config.maxLink) )" >
                                        <Icon type="ios-plus-outline"></Icon>
                                        <span>增加</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 文章类型 -->
                        <div class="formItem flex flex-align-items" v-if="editKey.typeList">
                            <div class="label" style="font-weight: initial;"><span class="requirText">*</span>{{editParam.typeList.label}}:</div>
                            <div class="like-input flex" 
                                :class="{'errorInput':errorFlag && editParam.typeList.value.length == 0,'disabled':(editInfo.referSectionCaseId ? true : false)}"
                                @click="openArticleTypeDialog()">
                                <div class="flex-1">
                                    <div v-if="editParam.typeList.value.length == 0" class="attText">请选择类型</div>
                                    <Tag 
                                        v-for="(item , indexTree) in editParam.typeList.value" 
                                        :key="indexTree" 
                                        type="border"
                                        :name="item.label" 
                                        :closable="closable"
                                        style="margin-top:4px;"
                                        @on-close="deleteTreeTag(indexTree)">{{item.name}}</Tag>
                                </div>
                            </div>
                            <div class="error" v-show="errorFlag && editParam.typeList.value.length == 0">请选择类型</div>
                        </div> 
                        <!-- 排序方式 -->
                        <FormItem :label="editParam.orderBy.label + ':'" v-if="editKey.orderBy">
                            <Select v-model="editParam.orderBy.value" :disabled="editInfo.referSectionCaseId ? true : false">
                                <Option value="orderByCreateDate">时间排序</Option>
                                <Option value="orderByOrder">排序值</Option>
                                <Option value="orderByOrderAndPublishTime">排序值+时间</Option>
                            </Select>
                        </FormItem>
                        <!-- 名称设置链接 -->
                        <div v-if="editKey.requireList" v-for="(item , index) in editParam.requireList" :key="index">
                            <FormItem :label="item.name + '链接:'" >
                               <Input type="text" placeholder="请输入"  v-model="item.url" :disabled="editInfo.referSectionCaseId ? true : false"></Input>
                            </FormItem>
                        </div>
                        <!-- 分页每页页数 -->
                        <FormItem :label="editParam.page.pageSize.label + ':'" v-if="editKey.page">
                            <Input 
                                v-model="editParam.page.pageSize.value" 
                                :placeholder="'请输入' + editParam.page.pageSize.label"
                                :disabled="editInfo.referSectionCaseId ? true : false"></Input>
                        </FormItem>
                        <!-- 封面 -->
                        <FormItem :label="editParam.cover.label + ':'" v-if="editKey.cover">
                            <div class="cover-img" v-if="editParam.cover.value !=''">
                                <img :src="HostSource + editParam.cover.value" class="coverImgWrap" alt="">
                                <div
                                    v-if="editInfo.referSectionCaseId ? false : true"
                                    class="cover-img-pop flex flex-align-items flex-justify-content ">
                                    <Icon type="trash-a" @click.native="deleteEditParamCover('cover')"></Icon>
                                </div>
                            </div>
                            <upload-img 
                                v-if="editParam.cover.value == ''"
                                :num=1 
                                uploadKey="cover"
                                :minCropBoxWidth=100
                                :aspectRatio = editParam.cover.config.aspectRatio
                                :is-crop="editParam.cover.config.isCrop"
                                @uploadChange ="uploadChangeEvent" 
                                @openCropDialog="openCropDialog"
                                style="width:108px;">
                                <div slot="content" class="flex flex-justify-content flex-align-items" style=" width: 100px;height: 100px; border: 1px dashed #ccc;">
                                    <Icon type="camera" style="font-size:18px;"></Icon>
                                </div>
                            </upload-img>
                        </FormItem>
                        <!-- 默认图片 -->
                         <FormItem :label="editParam.defaultCoverImg.label + ':'" v-if="editKey.defaultCoverImg">
                            <div class="cover-img" v-if="editParam.defaultCoverImg.value !=''">
                                <img :src="HostSource + editParam.defaultCoverImg.value" class="coverImgWrap" style="max-width:300px;" alt="">
                                <div 
                                    v-if="editInfo.referSectionCaseId ? false : true"
                                    class="cover-img-pop flex flex-align-items flex-justify-content " @click="deleteEditParamCover('defaultCoverImg')">
                                    <Icon type="trash-a"  @click.native="deleteEditParamCover('defaultCoverImg')"></Icon>
                                </div>
                            </div>
                            <upload-img 
                                v-show="editParam.defaultCoverImg.value == ''"
                                :num=1 
                                uploadKey="defaultCoverImg"
                                :minCropBoxWidth=100
                                :aspectRatio = editParam.defaultCoverImg.config.aspectRatio
                                :is-crop="editParam.defaultCoverImg.config.isCrop"
                                @uploadChange ="uploadChangeEvent" 
                                @openCropDialog="openCropDialog"
                                style="width:108px;">
                                <div slot="content" class="flex flex-justify-content flex-align-items" style=" width: 100px;height: 100px; border: 1px dashed #ccc;">
                                    <Icon type="camera" style="font-size:18px;"></Icon>
                                </div>
                            </upload-img>
                        </FormItem>
                        <!-- imgList -->
                        <FormItem :label="editParam.imgList.label + ':'" v-if="editKey.imgList">
                            <div v-for="(item , index) in editParam.imgList.value" :key="index" class="img-list-wrap">
                                <img :src="HostSource + item.cover" alt="">
                                <div 
                                    class="flex flex-align-items flex-justify-content img-list-wrap-pop" 
                                    @click="deleteImgList(index)"
                                    v-if="editInfo.referSectionCaseId ? true : false">
                                    <Icon type="ios-trash"></Icon>
                                </div>
                            </div>
                            <upload-img 
                                :num=1 
                                uploadKey="imgList"
                                :minCropBoxWidth=100
                                :aspectRatio = editParam.imgList.config.aspectRatio
                                :is-crop="editParam.imgList.config.isCrop"
                                @uploadChange ="uploadChangeEvent" 
                                @openCropDialog="openCropDialog"
                                v-if="editInfo.referSectionCaseId ? true : false"
                                style="width:100%;"
                                class="uploadImgListWrap">
                                <div slot="content" class="flex flex-justify-content flex-align-items" style=" width: 100%;height: 60px; border: 1px dashed #ccc;position:relative;">
                                    <Icon type="plus" style="font-size:18px;"></Icon>
                                </div>
                            </upload-img>
                        </FormItem>
                        <!-- 证证链接 -->
                        <FormItem :label="editParam.casLink.label + ':'" v-if="editKey.casLink">
                            <Input 
                                v-model="editParam.casLink.value" 
                                :placeholder="'请输入' + editParam.casLink.label"
                                :disabled="editInfo.referSectionCaseId ? true : false"></Input>
                        </FormItem>
                    </Form>
                </div>
                <div class="sliderRightOpera flex flex-justify-content">
                    <Button type="ghost" style="margin-left: 8px" @click="handleCancel()">取消</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary" @click="handleSubmit()">提交</Button>
                </div>
            </mu-drawer>
            <!--输入或编辑自定义内容 -->
            <mu-drawer class="sliderRightDrawer flex flex-direction-column" right width="800" 
                :open="componentOpen" 
                :docked="docked" 
                @close="componentOpen=false">
                <div class="title" >内容编辑</div> 
                <div class="flex-1 contentEditWrap" style="overflow-y:scroll">
                    <div class="flex flex-justify-content-between" >
                        <div class="att-text">将已准备好的html手动输入或复制粘贴至下方</div>
                    </div>
                    <codemirror 
                        class="codemirror-wrap"
                        v-model="componentHtml" 
                        :options="cmOptions"
                        @input="onCmCodeChange"></codemirror>
                </div>
                <div class="sliderRightOpera flex flex-justify-content">
                    <Button type="ghost" @click="cancelComponentHtml()" style="margin-left: 8px">取消</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="success" @click="previewComponentHml()" >预览</Button>
                    <Button type="primary" @click="saveComponentHml()" style="margin-left: 8px">提交</Button>
                </div>
            </mu-drawer>
            <!--输入或编辑自定义内容 -->
            <mu-drawer class="sliderRightDrawer flex flex-direction-column" right width="600" 
                :open="cssDrawerOpen" 
                :docked="docked" 
                @close="cssDrawerOpen=false">
                <div class="title" >样式设置</div> 
                <div class="flex-1 contentEditWrap" style="overflow-y:scroll">
                    <!-- {{currentCSSDivObj}} -->
                    <Form 
                        style="margin-right:40px;"
                        :label-width="80">
                        <FormItem label="背景色:" class="formItem formItemColorPicker">
                            <Input v-model="currentCSSDivObj.backgroundColor" placeholder="请输入背景色">
                                <ColorPicker v-model="currentCSSDivObj.backgroundColor" alpha @on-change="colorPickerChange" slot="append"/>
                            </Input>
                        </FormItem> 
                        <FormItem label="上外边距:" class="formItem">
                            <Input v-model="currentCSSDivObj.marginTop" placeholder="请输入上外边距，单位为px"></Input>
                        </FormItem> 
                        <FormItem label="下外边距:" class="formItem">
                            <Input v-model="currentCSSDivObj.marginBottom" placeholder="请输入下外边距，，单位为px"></Input>
                        </FormItem> 
                        <FormItem label="上内边距:" class="formItem">
                            <Input v-model="currentCSSDivObj.paddingTop" placeholder="请输入上内边距，单位为px"></Input>
                        </FormItem> 
                        <FormItem label="下内边距:" class="formItem">
                            <Input v-model="currentCSSDivObj.paddingBottom" placeholder="请输入下内边距，，单位为px"></Input>
                        </FormItem> 
                    </Form>
                </div>
                <div class="sliderRightOpera flex flex-justify-content">
                    <Button type="ghost" @click="cancelEditCSS()">取消</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary" @click="submitEditCSS()" style="margin-left: 8px">提交</Button>
                </div>
            </mu-drawer>
            <!-- 选择页面 -->
            <selectPage 
                ref="selectPageRef"
                 @submitPage="submitPage"
                @cancelPage='cancelPage'></selectPage>
            <!-- 选择文章类型 -->
            <selectArticleType 
                ref="selectArticleTypeRef" 
                @submitAriticleType="submitAriticleType"
                @cancelAriticleType='cancelAriticleType'></selectArticleType>
            <!-- 选择组件引用 -->
            <selectSourceSection 
                ref="selectSourceSection"
                @submitSourceSection="submitSourceSection"
                @cancelSourceSection="cancelSourceSection"></selectSourceSection>
            <!-- 预览自定义内容 -->
            <previewModel ref="previewModelRef" @cancelPreviewModel="cancelPreviewModel"></previewModel>
            <!-- 保存页面实例输入名称 -->
            <Modal 
                v-model="nameDialog" 
                title="备份名称" 
                class="nameDialog"
                @on-cancel="this.name= ''">
                <Form 
                    :label-width="80" >
                    <FormItem label="备份名称" prop="name" class="name-wrap">
                        <Input v-model="name" placeholder="名称"></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button size="large"  @click="cancelSave">取消</Button>
                    <Button type="primary" size="large" :loading="saveLoading" @click="saveBackUp">保存</Button>
                </div>
            </Modal>
        </layout-container>
        <div id="saveCMS" ref="content" v-html="saveHtml" style="display:none;"></div>
    </div>
</template>
<script>
import layoutContainer from 'components/layout/layoutContainer.vue'
import selectPage from 'components/dialog/selectPage.vue'
import selectArticleType from 'components/dialog/selectArticleType.vue'
import selectSourceSection from 'components/dialog/selectSourceSection.vue'
import previewModel from 'components/dialog/previewModel.vue'
import uploadImg from 'cms/components/uploadImg/uploadImg.vue'
import { setTimeout } from 'timers';
import { callbackify } from 'util';
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
export default {
    data(){
        return{
            cssDrawerOpen : false,
            saveBtnLoading : false,
            componentHtml : "<div></div>",
            nameDialog : false,
            saveLoading : false,
            linkType : '1',
            detailLinkType : '1',
            HostSource : constGlobal.HostSource,
            errorFlag : false,
            closable: false,
            docked : false,
            coolapseActive : 'layout',
            layoutList : [{
                type : 'layout',
                name : '布局模板',
                list : [{
                    position : '-2px -5px',
                    name : '通栏',
                    html : '<div class="span12 column"></div>',
                    id : 'layout',
                },{
                    name : '4 : 8',
                    position : '-2px -89px',
                    html : '<div class="span4 column"></div><div class="span8 column"></div>',
                    id : 'layout',
                },{
                    name : '5 : 7',
                    position : '-2px -110px',
                    html : '<div class="span5 column"></div><div class="span7 column"></div>',
                    id : 'layout',
                },{
                    name : '6 : 6',
                    position : '-2px -131px',
                    html : '<div class="span6 column"></div><div class="span6 column"></div>',
                    id : 'layout',
                },{
                    name : '8 : 4',
                    position : '-2px -173px',
                    html : '<div class="span8 column"></div><div class="span4 column"></div>',
                    id : 'layout',
                },{
                    name : '固定宽度',
                    position : '-2px -257px',
                    html : '<div class="container"><div class="span12 column"></div></div>',
                    id : 'layout12',
                },{
                    name : '占位',
                    position : '-2px -257px',
                    html : '<div style="width:100%;" class="column layout-placeholder"></div>',
                    id : 'layout12',
                }]
            }],
            emptyFlag : true,
            componentList : [],
            componentArray : [],
            currentDivId : "",
            editParam : {},
            editInfo : {
                referSectionCaseId : ''
            },
            editKey : {},
            open : false,
            pageId : '',
            pageCase : {},
            divList : [],
            name : '',
            saveHtml : '',
            componentOpen : false,
            cmOptions: {
                tabSize: 4,
                mode: 'text/javascript',
                theme: 'base16-dark',
                lineNumbers: true,
                line: true,
            },
            sourceSectionId : '',
            currentCSSDiv : "",
            styleKeyList:[{
                key : 'backgroundColor',
                value: 'rgb(255,255,255)'
            },{
                key : 'marginTop',
                value : '0px'
            },{
                key : 'marginBottom',
                value : '0px'
            },{
                key : 'paddingTop',
                value : '0px'
            },{
                key : 'paddingBottom',
                value : '0px'
            }],
            currentCSSDivObj : {
                backgroundColor : "rgb(255,255,255)",
                marginTop : "0px",
                marginBottom : "0px"
            },
            pageName : ""
        }
    },
    components:{ 
        layoutContainer,
        selectPage,
        selectArticleType,
        uploadImg,
        codemirror,
        selectSourceSection,
        previewModel
    },
    mounted(){
        this.$nextTick(function() {
            window.eventHub.$emit("changePath", [{
                title : "页面管理",
                name : "index"
            },{ 
                title : "内容管理"
            }]);
            window.eventHub.$emit("changeMenuStatus" , true);
        });
        this.init();
    },
    methods:{
        /**
         * 删除某个图片
         */
        deleteImgList(index){
            this.editParam.imgList.value.splice(index , 1);
        },
        colorPickerChange(value){
            let obj = common.cloneJson(this.currentCSSDivObj);
            obj.backgroundColor = value;
            this.$set(this , 'currentCSSDivObj' , obj);
        },
        /**
         * 取消编辑css
         */
        cancelEditCSS(){
            this.cssDrawerOpen = false;
        },
        submitEditCSS(){
            var ele = $('[divid=' + this.currentCSSDiv + ']')[0];
            for(let key in this.currentCSSDivObj){
                ele.style[key] = this.currentCSSDivObj[key]
            }
            this.cssDrawerOpen = false;
        },
         /**
         * 获取引用组件内容
         */
        submitSourceSection(info){
            info.initParam = JSON.parse(info.initParam);
            this.open = true;
            this.editInfo.referSectionCaseId = info.id;
            this.editInfo.referSectionCaseName = info.name;
            this.editInfo.css = info.css;
            this.editInfo.name = info.name;
            this.editParam = info.initParam;
            this.initEditData();
        },
         /**
         * 取消获取引用组件内容
         */
        cancelSourceSection(){
            this.open = true;
        },
        /**
         * 预览自定义内容
         */
        previewComponentHml(){
            this.componentOpen = false;
            this.$refs.previewModelRef.init(this.componentHtml);
        },
        cancelPreviewModel(){
            this.componentOpen = true;
        },
        /**
         * 打开引用对话框
         */
        openSectionDialog(type){
            if(type == 0){ //打开引用对话框
                this.open = false;
                var info = {
                    name : this.editInfo.referSectionCaseName,
                    id : this.editInfo.referSectionCaseId
                }
                this.$refs.selectSourceSection.init(this.sourceSectionId , this.websiteId , info , this.currentDivId);
            }else if(type == 1){ //取消引用
                this.$delete(this.editInfo , 'referSectionCaseId')
                this.$delete(this.editInfo , 'referSectionCaseName')
                this.editInfo.referSectionCaseId = '';
                this.editInfo.referSectionCaseName = '';
            }
        },
        /**
         * 取消保存自定义的组件
         */
        cancelComponentHtml(){
            this.componentHtml = '';
            this.componentOpen = false;
        },
        /**
         * 保存自定义的组件
         */
        saveComponentHml(){
            var divId = Math.random().toString(36).substr(4,40);
            var str = '<div sourcesectionid="' + divId + '" class="lyrow ui-draggable lyrowLayout component-layout" ><div class="remove iconTag label label-important"><i class="ivu-icon ivu-icon-ios-trash"></i>删除</div><div class="drag iconTag label label-important"><i class="ivu-icon ivu-icon-arrow-move"></i>移动</div><span class="editTag editComponent iconTag label" ><Icon type="gear-a"></Icon>编辑</span><div class="view"><div class="row-fluid clearfix">' + this.componentHtml + '</div></div></div>';
            $(".editColumn").append(str)
            this.componentOpen = false;
        },
        onCmCodeChange(code){
            this.componentHtml = code;
        },
        /**
         * 初始化数据
         */
        init(){
            this.pageId = this.$route.query.pageId;
            this.pageName = this.$route.query.pageName;
            this.websiteId = this.$route.query.websiteId;
            this.querySectionList();
            this.initContainer();
            this.removeElm();
            this.setElm();
            this.setAddEle();
            this.initCustomLayout();
        },
        /**
         * 获取页面实例的最新的版本
         */
        queryPageCase(){
            var url = constGlobal.HostCMSAdmin + 'lastPageCase/searchByUser?pageId=' + this.pageId;
            http.apiGet(url,).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        var _this = this;
                        this.pageCase = res.data;
                        this.$refs.containerBar.innerHTML = this.pageCase.editContent;
                        this.showEmptyDiv();
                        this.queryDivList();

                        this.initContainer()
                        this.initDraggable();
                    }
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        /**
         * 获取页面实例的divlist
         */
        queryDivList(){
            var url = constGlobal.HostCMSAdmin + 'divList/searchByPageCaseId?caseId=' + this.pageCase.id;
            http.apiGet(url,).then(res => {
                if (res.status == 0) {
                    this.divList = res.data;
                    this.initCmsContent();
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        /**
         * 初始化编辑内容
         */
        initCmsContent(){
            for(var i = 0 ; i < this.divList.length ; i++){
                this.divList[i].initParam = JSON.parse(this.divList[i].initParam)
            }
            this.componentArray = []
            if(this.divList.length > 0){
                for(var i = 0 ; i < this.componentList.length ; i++){
                    for(var j = 0 ; j < this.componentList[i].sectionList.length ; j++){
                        for(var k = 0 ; k < this.divList.length ; k++){
                            if(this.componentList[i].sectionList[j].id == this.divList[k].sourceSectionId){
                                var param = JSON.parse(JSON.stringify(this.componentList[i].sectionList[j]));
                                
                                param.name = this.divList[k].name;
                                param.count = this.divList[k].count ? this.divList[k].count : 0;
                                param.cDivId = this.divList[k].id;
                                param.divId = this.divList[k].divId;
                                // if(this.divList[k].initParam.articleList){
                                //     for(var i = 0 ; i < this.divList[k].initParam.articleList.length ; i++){
                                //         if(this.divList[k].initParam.articleList[i].cover){
                                //             this.divList[k].initParam.articleList[i].cover = this.HostSource + this.divList[k].initParam.articleList[i].cover;
                                //         }
                                //     }
                                // }
                                if(this.divList[k].initParam.HostSource){
                                    this.divList[k].initParam.HostSource = this.HostSource;
                                }
                                param.initParam.data = JSON.parse(JSON.stringify(this.divList[k].initParam));
                                param.referSectionCaseId = this.divList[k].referSectionCaseId;
                                param.referSectionCaseName = this.divList[k].referSectionCaseName;
                                this.componentArray.push(param);

                            }
                        }
                    }
                }
            }
        },
        initDialogParam(){
            this.linkType = '1';
            this.detailLinkType = '1';
            if(this.editKey.link && this.editKey.innerLink && this.editParam.innerLink.value.pageId){
                this.linkType = '2';
            }
            if(this.editKey.detailLink && this.editKey.detailInnerLink && this.editParam.detailInnerLink.value.pageId){
                this.detailLinkType = '2'
            }
        },
        openNameDialog(){
            this.saveHtml = this.$refs.containerBar.innerHTML + '';
            this.nameDialog = true;
        },
        cancelSave(){
            this.name='';
            this.nameDialog = false
        },
        /**
         * 保存数据
         */
        saveCMS(){
            var _this = this;
            this.saveBtnLoading = true;
            this.saveHtml = this.$refs.containerBar.innerHTML + '';
            setTimeout(function(){
                _this.submitPageCase();
            },500)
        },
        /**
         * 提交页面实例
         */
        submitPageCase(){
            //将含有divId属性的标签内容清空
            var editContent = this.$refs.containerBar.innerHTML + '';
            for(var i = 0 ; i < this.componentArray.length ; i++){
                $('#saveCMS').find("#" + this.componentArray[i].divId)[0].innerHTML = '';
            }
            var rowFluidList = $("#saveCMS").find(".row-fluid");
            for(var i = 0 ; i < rowFluidList.length ; i++){
                $(rowFluidList[i]).removeClass('row-fluid')
            }
            var content = this.$refs.content.innerHTML + '';
            var list = [];
            for(var i = 0 ; i < this.componentArray.length ; i++){
                this.componentArray[i].initParam.data.websiteId = this.websiteId;
                var param = {
                    "name":this.componentArray[i].name,
                    "sourceSectionId":this.componentArray[i].id,
                    "divId" : this.componentArray[i].divId,
                    "initParam": JSON.stringify(this.componentArray[i].initParam.data),
                    "css":this.componentArray[i].css,
                    "reuse": 0 ,
                    "id" : this.componentArray[i].cDivId ? this.componentArray[i].cDivId : '',
                    "referSectionCaseId" : this.componentArray[i].referSectionCaseId
                }
                list.push(param);
            }
            var param = {
                "pageCase":{
                    "content":content,
                    "editContent":editContent,
                    "pageId":this.pageId,
                    "name":this.name
                },
                "divList":list
            }
            var url = constGlobal.HostCMSAdmin + 'pageCase/create';
            http.apiPost(url , param).then(res => {
                if (res.status == 0) {
                    this.saveBtnLoading = false;
                    common.toastMsg('保存成功' , 'success');
                    router.go(-1);
                } else {
                    common.toastMsg(res.message)
                }
            })
        },
        /**
         * 链接类型发生变化
         */
        changeLinkType(key , type){
            if(key == 'link'){
                this.editParam[key].value = ''
            }else if(key = 'innerLink'){
                this.editParam[key].value = {
                    "name" : "",
                    "pageId" : ""
                }
            }
        },
        changeLinkType1(key , type){
            if(key == 'detailLink'){
                this.editParam[key].value = ''
            }else if(key == 'detailInnerLink'){
                this.editParam[key].value = {
                    "name" : "",
                    "pageId" : ""
                }
            }
        },
        /**
         * 删除图片
         */
        deleteEditParamCover(key){
            this.editParam[key].value = ''
        },
        /**
         * 获取图片
         */
        uploadChangeEvent(imgObj , editKey){
            if(editKey != 'imgList'){
                this.editParam[editKey].value = imgObj[0].id;
            }else{
                this.editParam[editKey].value.push({"cover" : imgObj[0].id})
            }
            this.open = true;
        },
        openCropDialog(){
            this.open = false;
        },
        /**
         * 编辑提交
         */
        handleSubmit(){
            if(this.editKey.typeList && this.editParam.typeList.value.length == 0){
                this.errorFlag = true;
            }
            for(var i = 0 ; i < this.componentArray.length ; i++){
                if(this.currentDivId == this.componentArray[i].divId){
                    if(this.editParam.typeList){
                        for(var j = 0 ; j < this.editParam.typeList.value.length ; j++){
                            if(j == 0){
                                this.editParam.typeList.value[j].active = true;
                            }else{
                                this.editParam.typeList.value[j].active = false;
                            }
                        }
                    }
                    this.componentArray[i].initParam.data = JSON.parse(JSON.stringify(this.editParam));
                    this.componentArray[i].name = JSON.parse(JSON.stringify(this.editInfo.name))
                    this.componentArray[i].referSectionCaseId = JSON.parse(JSON.stringify(this.editInfo.referSectionCaseId));
                    this.componentArray[i].referSectionCaseName = JSON.parse(JSON.stringify(this.editInfo.referSectionCaseName));
                    this.componentArray[i].css = this.editInfo.css ? JSON.parse(JSON.stringify(this.editInfo.css)) : '';
                    this.open = false;
                    this.setNewHtml(i);
                }
            }
        },
        momentFilter(value){
            let day = moment(value)
            let date = moment(day).format('YYYY-MM-DD')
            return date
        },
        /**
         * 设置新的html
         */
        setNewHtml(i){
            var param = this.componentArray[i].initParam;
            var render = template.compile(this.componentArray[i].templateContent);
            var html = render(param);
            $('[divid=' + this.componentArray[i].divId + ']').find(".view").find(".row-fluid")[0].innerHTML = html;
            this.open = false;
        },
        /**
         * 删除文本、链接和字体颜色
         */
        deleteLinkList(index){
            this.editParam.linkList.value.splice(index , 1);
        },
        /**
         * 增加文本、链接和字体颜色
         */
        addLinkList(){
            this.editParam.linkList.value.push({
                "name" : "",
                "link" : "",
                "color" : ""
            })
        },
        /**
         * 打开选择页面的功能
         */
        openSelectPageModel(key){
            this.open = false;
            this.$refs.selectPageRef.init(key , JSON.parse(JSON.stringify(this.websiteId)) , JSON.parse(JSON.stringify(this.editParam[key])));
        },
        submitPage(pageInfo , key){
            console.log(pageInfo);
            this.editParam[key].value = pageInfo;
            this.open = true;
        },
        cancelPage(pageInfo , key){
            this.open = true;
        },
        /**
         * 打开类型选择对话框
         */
        openArticleTypeDialog(){
            if(this.editInfo.referSectionCaseId){
                return;
            }
            this.open = false;
            this.$refs.selectArticleTypeRef.initArticleType( this.websiteId , JSON.parse(JSON.stringify(this.editParam.typeList)));
        },
        /**
         * 取消编辑
         */
        handleCancel(){
            this.open = false;
        },
        /**
         * 提交己选择类型数据
         */
        submitAriticleType(list){
            this.editParam.typeList.value = list;
            // this.editParam.typeList.push();
            this.open = true;
        },
        /**
         * 取消选择类型
         */
        cancelAriticleType(){
            this.open = true;
        },
        /**
         * 打开设置窗口
         */
        openSetDialog(divId , sourceSectionId){
            this.currentDivId = divId;
            this.editKey = {};
            this.editParam = {};
            this.editInfo = {};
            for(var i = 0 ; i < this.componentArray.length ; i++){
                if(divId == this.componentArray[i].divId){
                    this.editParam = JSON.parse(JSON.stringify(this.componentArray[i].initParam.data));
                    this.editInfo.name = JSON.parse(JSON.stringify(this.componentArray[i].name));
                    this.editInfo.count = this.componentArray[i].count ? JSON.parse(JSON.stringify(this.componentArray[i].count)) : 0;
                    if(this.componentArray[i].referSectionCaseId){
                        this.editInfo.referSectionCaseId = JSON.parse(JSON.stringify(this.componentArray[i].referSectionCaseId));
                        this.editInfo.referSectionCaseName = JSON.parse(JSON.stringify(this.componentArray[i].referSectionCaseName));
                    }else{
                        this.editInfo.referSectionCaseId = '';
                        this.editInfo.referSectionCaseName = '';
                    }
                    
                    break;
                }
            }
            for(var key  in this.editParam){
                this.editKey[key] = true
            }
            //初始化弹出框数据
            this.initEditData();
            this.initDialogParam();
            this.open = true;
        },
        /**
         * 初始化编辑数据
         */
        initEditData(){
            if(this.editParam.defaultCoverImg ){
                if(this.editParam.defaultCoverImg.config && this.editParam.defaultCoverImg.config.isCrop){
                    this.editParam.defaultCoverImg.config.aspectRatio = this.editParam.defaultCoverImg.config.aspectRatio ? parseFloat(this.editParam.defaultCoverImg.config.aspectRatio) : 1;
                }else{
                    this.editParam.defaultCoverImg.config = {
                        "isCrop" : false,
                        "aspectRatio" : 1
                    }
                }
            }
            if(this.editParam.imgList ){
                if(this.editParam.imgList.config && this.editParam.imgList.config.isCrop){
                    this.editParam.imgList.config.aspectRatio = this.editParam.imgList.config.aspectRatio ? parseFloat(this.editParam.imgList.config.aspectRatio) : 1;
                }else{
                    this.editParam.imgList.config = {
                        "isCrop" : false,
                        "aspectRatio" : 1
                    }
                }
            }
            //初始化封面
            if(this.editParam.cover){
                if(this.editParam.cover.config && this.editParam.cover.config.isCrop){
                    this.editParam.cover.config.aspectRatio = this.editParam.cover.config.aspectRatio ? parseFloat(this.editParam.defaultCoverImg.config.aspectRatio) : 1;
                }else{
                    this.editParam.cover.config = {
                        "isCrop" : false,
                        "aspectRatio" : 1
                    }
                }
            }
        },
        /**
         * 预览
         */
        toPreview(){
            var _this = this;
            this.saveHtml = this.$refs.containerBar.innerHTML + '';
            setTimeout(function(){
                _this.savePreviewData();
            },500)
        },
        savePreviewData(){
            var editContent = this.$refs.containerBar.innerHTML + '';
            for(var i = 0 ; i < this.componentArray.length ; i++){
                $('#saveCMS').find("#" + this.componentArray[i].divId)[0].innerHTML = '';
            }
            var rowFluidList = $("#saveCMS").find(".row-fluid");
            for(var i = 0 ; i < rowFluidList.length ; i++){
                $(rowFluidList[i]).removeClass('row-fluid')
            }
            var content = this.$refs.containerBar.innerHTML + '';
            var list = [];
            for(var i = 0 ; i < this.componentArray.length ; i++){
                var param = {
                    "name":this.componentArray[i].name,
                    "sourceSectionId":this.componentArray[i].id,
                    "divId" : this.componentArray[i].divId,
                    "initParam": JSON.stringify(this.componentArray[i].initParam.data),
                    "css":this.componentArray[i].css,
                    "reuse": 0 ,
                    "referSectionCaseId" : this.componentArray[i].referSectionCaseId
                }
                list.push(param);
            }
            var param = {
                "pageCase":{
                    "content":editContent,
                    "editContent":editContent,
                    "pageId":this.pageId,// 对应的页面id 为必填选项
                    "name":"",// 实例名称 可不填
                    "saveType":"userSaveType"  // 目前为固定值"userSaveType"
                },
                "divList":list
            }
            var url = constGlobal.HostCMSAdmin + 'pageContent/preview';
            http.apiPost(url , param).then(res => {
                if (res.status == 0) {
                    window.open(res.data)
                } else {
                    common.toastMsg(res.message)
                }
            })
        },
        toBackup(){
            this.saveHtml = this.$refs.containerBar.innerHTML + '';
            this.nameDialog = true;
            this.name = "";
        },
        saveBackUp(){
            this.saveLoading = true;
            var editContent = this.$refs.containerBar.innerHTML + '';
            for(var i = 0 ; i < this.componentArray.length ; i++){
                $('#saveCMS').find("#" + this.componentArray[i].divId)[0].innerHTML = '';
            }
            var rowFluidList = $("#saveCMS").find(".row-fluid");
            for(var i = 0 ; i < rowFluidList.length ; i++){
                $(rowFluidList[i]).removeClass('row-fluid')
            }
            var content = this.$refs.content.innerHTML + '';
            var list = [];
            for(var i = 0 ; i < this.componentArray.length ; i++){
                this.componentArray[i].initParam.data.websiteId = this.websiteId;
                var param = {
                    "name":this.componentArray[i].name,
                    "sourceSectionId":this.componentArray[i].id,
                    "divId" : this.componentArray[i].divId,
                    "initParam": JSON.stringify(this.componentArray[i].initParam.data),
                    "css":this.componentArray[i].css,
                    "reuse": 0 ,
                    "referSectionCaseId" : this.componentArray[i].referSectionCaseId
                }
                list.push(param);
            }
            var param = {
                "pageCase":{
                    "content":content,
                    "editContent":editContent,
                    "pageId":this.pageId,
                    "name":this.name
                },
                "divList":list
            }
            var url = constGlobal.HostCMSAdmin + 'pageCase/backup';
            http.apiPost(url , param).then(res => {
                if (res.status == 0) {
                    this.saveLoading = false;
                    this.nameDialog = false;
                    common.toastMsg('内容备份成功' , 'success');
                } else {
                    common.toastMsg(res.message)
                }
            })
        },
        /**
         * 显示（将布局或组件拖入区域中）
         */
        showEmptyDiv(){
            var innerHtml = this.$refs.containerBar.innerHTML;
            if(innerHtml == '<!---->' || innerHtml == ""){
                this.emptyFlag = true;
            }else if(innerHtml != '<!---->' && innerHtml.length > 0){
                this.emptyFlag = false;
            }
        },
        /**
         * 初始化移动事件
         */
        initDraggable: function() {
            var _this = this
            $('.sidebar-nav .lyrow').draggable({
                connectToSortable: '.container-bar',
                helper: 'clone',
                // handle: '.preview',
                start: function(e, t) {
                    if (!this.startdrag) this.stopsave++
                    this.startdrag = 1
                    // _this.$refs.contactLeft.style.overflow = "hidden";
                },
                drag: function(e, t) {
                    t.helper.width(400)
                },
                stop: function(e, t) {
                    _this.showEmptyDiv();
                    _this.componentAddId();
                    _this.addIconForCustomComponent();
                    // _this.$refs.contactLeft.style.overflow = "scroll";
                    $('.container-bar .column').sortable({
                        opacity: 0.35,
                        connectWith: '.column',
                        start: function(e, t) {
                            if (!this.startdrag) this.stopsave++
                            this.startdrag = 1
                        },
                        stop: function(e, t) {
                            if (this.stopsave > 0) this.stopsave--
                            this.startdrag = 0
                        }
                    })
                    if (this.stopsave > 0) this.stopsave--
                    this.startdrag = 0
                }
            })
            $('.custom-layout .lyrow').draggable({
                connectToSortable: '.container-bar',
                helper: 'clone',
                start: function(e, t) {
                    if (!this.startdrag) this.stopsave++
                    this.startdrag = 1
                },
                drag: function(e, t) {
                    t.helper.width(400)
                },
                stop: function(e, t) {
                    _this.showEmptyDiv();
                    _this.componentAddId();
                    _this.addIconForCustomComponent();
                    
                    $('.container-bar .column').sortable({
                        opacity: 0.35,
                        connectWith: '.column',
                        start: function(e, t) {
                            if (!this.startdrag) this.stopsave++
                            this.startdrag = 1
                        },
                        stop: function(e, t) {
                            if (this.stopsave > 0) this.stopsave--
                            this.startdrag = 0
                        }
                    })
                    if (this.stopsave > 0) this.stopsave--
                    this.startdrag = 0
                }
            })
        },
        /**
         * 为每个组件增加id
         */
        addIconForCustomComponent(){
            var columnList = $("#containerBar .column");
            for(var i = 0 ; i < columnList.length ; i++){
                if($(columnList[i]).children('.addIcon').length == 0){
                    $(columnList[i])[0].innerHTML = '<div class="addIcon iconTag label label-important addIconCustom"><Icon type="ios-plus-outline"></Icon><span>自定义内容</span></div>'
                }
            }
        },
        /**
         * 为每个组件增加id
         */
        componentAddId() {
            var _this = this;
            var cons = $('.container-bar div[sourceSectionId]')
            for (var i = 0; i < cons.length; i++) {
                if (!$(cons[i])[0].attributes.divId) {
                    var divId = Math.random().toString(36).substr(4,40);
                    $($(cons[i])[0]).attr('divId' , divId)
                    $($(cons[i])[0]).attr('id' , divId)
                    var sourceSectionId = $(cons[i])[0].attributes.sourceSectionId.nodeValue;
                    this.operaComponentArray(sourceSectionId , divId, 1);
                }
            }
        },
        /**
         * 在己使用组件列表增加或删除数据
         */
        operaComponentArray(sourceSectionId , divId , type){
            if(type == 1){ 
                for(var i = 0 ; i < this.componentList.length ; i++){
                    for(var j = 0 ; j < this.componentList[i].sectionList.length ; j++){
                        if(sourceSectionId == this.componentList[i].sectionList[j].id){
                            var param = JSON.parse(JSON.stringify(this.componentList[i].sectionList[j]));
                            param.divId = divId;
                            this.componentArray.push(param);
                        }
                    }
                }
            }else if(type == 2){
                for(var i = 0 ; i< this.componentArray.length ; i++){
                    if(this.componentArray[i].divId == divId && this.componentArray[i].id == sourceSectionId){
                        this.componentArray.splice(i , 1)
                    }
                }
            }
            console.log(this.componentArray)
        },
        /**
         * 初始化页面内容
         */
        initContainer: function() {
            $('.container-bar, .container-bar .column').sortable({
                connectWith: '.column',
                opacity: 0.35,
                handle: '.drag',
                start: function(e, t) {
                    if (!this.startdrag) this.stopsave++
                    this.startdrag = 1
                },
                stop: function(e, t) {
                    if (this.stopsave > 0) this.stopsave--
                    this.startdrag = 0
                }
            })
        },
        /**
         * 删除元素
         */
        removeElm() {
            var _this = this;
            $('.container-bar').delegate('.remove', 'click', function(e) {
                var length = $(this).parents(".lyrowLayout").length;
                var sectionId = $(this).parent(".lyrow")[0].attributes.sourceSectionId.nodeValue;
                var hasClass = $($(this).parents(".lyrowLayout")[length -1]).hasClass("lyrowLayout")
                if(!sectionId && hasClass){
                    var list = $($(this).parents(".lyrowLayout")[length -1]).find("div[divid]")
                    for(var i = 0 ; i < list.length ; i++){
                        var divId = $(list[i])[0].attributes.divId.nodeValue;
                        var sourceSectionId = $(list[i])[0].attributes.sourceSectionId.nodeValue;
                        _this.operaComponentArray(sourceSectionId , divId, 2);
                    }
                }else{
                    var divId = $(this).parent()[0].attributes.divId.nodeValue;
                    var sourceSectionId = $(this).parent()[0].attributes.sourceSectionId.nodeValue;
                    _this.operaComponentArray(sourceSectionId , divId, 2);
                }
                
                e.preventDefault()
                $(this).parent().remove()
                _this.showEmptyDiv()
            })
        },
        setAddEle(){
            var _this = this;
            $('.container-bar').delegate('.addIcon', 'click', function(e) {
                var editColumnList = $('.container-bar').find(".editColumn")
                for(var i = 0 ; i < editColumnList.length ; i++){
                    $(editColumnList[i]).removeClass('editColumn')
                }
                $($(this).parent(".column")[0]).addClass("editColumn");
                _this.componentHtml = '';
                _this.componentOpen = true;
            })
            $('.container-bar').delegate('.editTag', 'click', function(e) {
                var view = $($(this).parent('.lyrow')[0]).children(".view");
                var rowFluid = $($(view)[0]).children(".row-fluid");
                var html = $(rowFluid)[0].innerHTML;
                _this.componentHtml = html;
                _this.componentOpen = true;
            })
            
        },
        /**
         * 设置元素
         */
        setElm(){
            var _this = this;
            $('.container-bar').delegate('.set', 'click', function(e) {
                var divId = $(this).parent()[0].attributes.divId.nodeValue;
                var sourceSectionId = $(this).parent()[0].attributes.sourceSectionId.nodeValue;
                _this.sourceSectionId = sourceSectionId;
                _this.openSetDialog(divId , sourceSectionId)
                e.preventDefault()
            })
            
            $('.container-bar').delegate('.layoutSet', 'click', function(e) {
                var divId = $(this).parent()[0].attributes.divId.nodeValue;
                _this.currentCSSDiv = divId;
                var styleObj = $(this).parent()[0].style;
                _this.getTagStyleList(styleObj)
                e.preventDefault()
            })
        },
        getTagStyleList(styleObj){
            this.currentCSSDivObj = {};
            for(var i = 0 ;i < this.styleKeyList.length ; i++){
                this.currentCSSDivObj[this.styleKeyList[i].key] = styleObj[this.styleKeyList[i].key] == '' ? this.styleKeyList[i].value : styleObj[this.styleKeyList[i].key];
            }
            console.log(this.currentCSSDivObj)
            this.cssDrawerOpen = true;
        },
        /**
         * 查询组件列表
        */
        querySectionList(){
            var url = constGlobal.HostCMSAdmin + 'section/search';
            var param = {
                type : null
            }
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    for(var i = 0 ; i < res.data.length ; i++){
                        for(var j = 0 ; j < res.data[i].sectionList.length ; j++){
                            console.log(res.data[i].sectionList[j].id)
                            res.data[i].sectionList[j].initParam = JSON.parse(res.data[i].sectionList[j].initParam)
                            if(res.data[i].sectionList[j].initParam.data.HostSource){
                                res.data[i].sectionList[j].initParam.data.HostSource = constGlobal.HostSource + '/'
                            }
                            var render = template.compile(res.data[i].sectionList[j].templateContent);
                            var html = render(res.data[i].sectionList[j].initParam);
                            res.data[i].sectionList[j].html = html;
                        }
                    }
                    this.componentList = res.data;
                    var _this = this;
                    setTimeout(function(){
                        _this.initDraggable()
                    },1000)
                    this.queryPageCase();
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        /**
         * 初始化自定义布局
        */
        initCustomLayout(){
            $('.lyrow .preview input').bind('keyup', function() {
                var e = 0
                var t = ''
                var n = $(this).val().split(':', 12)
                $.each(n, function(n, r) {
                    e = e + parseInt(r)
                    t += '<div class="span' + r + ' column"></div>'
                })
                if (e == 12) {
                    $(this).parent().next().children().html(t)
                    $(this).parent().prev().show()
                } else {
                    $(this).parent().prev().hide()
                }
            })
        }
    }
}
</script>
<style lang="scss">
    @import '~cms/assets/css/public.scss';
    @import '~cms/assets/css/cmsContent.scss';
    @import '~cms/assets/css/component.scss';
    @import '~cms/assets/css/jm.scss';
    @import '~cms/assets/css/layout.scss';
    
    .nameDialog{
        .name-wrap{
            input{
                height:36px;
            }
        }
        
    }
    .right-container{
        .row {
            margin-left: -20px;
            *zoom: 1
        }

        .row:before,
        .row:after {
            display: table;
            line-height: 0;
            content: ""
        }

        .row:after {
            clear: both
        }

        [class*="span"] {
            float: left;
            min-height: 1px;
            margin-left: 0px
        }

        .container,
        .navbar-static-top .container,
        .navbar-fixed-top .container,
        .navbar-fixed-bottom .container {
            width: 940px
        }

        .row-fluid {
            width: 100%;
            *zoom: 1
        }

        .row-fluid:before,
        .row-fluid:after {
            display: table;
            line-height: 0;
            content: ""
        }

        .row-fluid:after {
            clear: both
        }

        .row-fluid [class*="span"] {
            display: block;
            float: left;
            width: 100%;
            min-height: 30px;
            margin-left: 0px;
            *margin-left: 0px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box
        }

        .row-fluid [class*="span"]:first-child {
            margin-left: 0
        }

        .row-fluid .controls-row [class*="span"]+[class*="span"] {
            margin-left: 0px;
        }

        .row-fluid .span12 {
            width: 100%;
            *width: 99.94680851063829%
        }

        .row-fluid .span11 {
            width: 91.48936170212765%;
            *width: 91.43617021276594%
        }

        .row-fluid .span10 {
            width: 82.97872340425532%;
            *width: 82.92553191489361%
        }

        .row-fluid .span9 {
            width: 74.46808510638297%;
            *width: 74.41489361702126%
        }

        .row-fluid .span8 {
            width: 65.95744680851064%;
            *width: 65.90425531914893%
        }

        .row-fluid .span7 {
            width: 57.44680851063829%;
            *width: 57.39361702127659%
        }

        .row-fluid .span6 {
            width: 48.93617021276595%;
            *width: 48.88297872340425%
        }

        .row-fluid .span5 {
            width: 40.42553191489362%;
            *width: 40.37234042553192%
        }

        .row-fluid .span4 {
            width: 31.914893617021278%;
            *width: 31.861702127659576%
        }

        .row-fluid .span3 {
            width: 23.404255319148934%;
            *width: 23.351063829787233%
        }

        .row-fluid .span2 {
            width: 14.893617021276595%;
            *width: 14.840425531914894%
        }

        .row-fluid .span1 {
            width: 6.382978723404255%;
            *width: 6.329787234042553%
        }

        .row-fluid .offset12 {
            margin-left: 104.25531914893617%;
            *margin-left: 104.14893617021275%
        }

        .row-fluid .offset12:first-child {
            margin-left: 102.12765957446808%;
            *margin-left: 102.02127659574467%
        }

        .row-fluid .offset11 {
            margin-left: 95.74468085106382%;
            *margin-left: 95.6382978723404%
        }

        .row-fluid .offset11:first-child {
            margin-left: 93.61702127659574%;
            *margin-left: 93.51063829787232%
        }

        .row-fluid .offset10 {
            margin-left: 87.23404255319149%;
            *margin-left: 87.12765957446807%
        }

        .row-fluid .offset10:first-child {
            margin-left: 85.1063829787234%;
            *margin-left: 84.99999999999999%
        }

        .row-fluid .offset9 {
            margin-left: 78.72340425531914%;
            *margin-left: 78.61702127659572%
        }

        .row-fluid .offset9:first-child {
            margin-left: 76.59574468085106%;
            *margin-left: 76.48936170212764%
        }

        .row-fluid .offset8 {
            margin-left: 70.2127659574468%;
            *margin-left: 70.10638297872339%
        }

        .row-fluid .offset8:first-child {
            margin-left: 68.08510638297872%;
            *margin-left: 67.9787234042553%
        }

        .row-fluid .offset7 {
            margin-left: 61.70212765957446%;
            *margin-left: 61.59574468085106%
        }

        .row-fluid .offset7:first-child {
            margin-left: 59.574468085106375%;
            *margin-left: 59.46808510638297%
        }

        .row-fluid .offset6 {
            margin-left: 53.191489361702125%;
            *margin-left: 53.085106382978715%
        }

        .row-fluid .offset6:first-child {
            margin-left: 51.063829787234035%;
            *margin-left: 50.95744680851063%
        }

        .row-fluid .offset5 {
            margin-left: 44.68085106382979%;
            *margin-left: 44.57446808510638%
        }

        .row-fluid .offset5:first-child {
            margin-left: 42.5531914893617%;
            *margin-left: 42.4468085106383%
        }

        .row-fluid .offset4 {
            margin-left: 36.170212765957444%;
            *margin-left: 36.06382978723405%
        }

        .row-fluid .offset4:first-child {
            margin-left: 34.04255319148936%;
            *margin-left: 33.93617021276596%
        }

        .row-fluid .offset3 {
            margin-left: 27.659574468085104%;
            *margin-left: 27.5531914893617%
        }

        .row-fluid .offset3:first-child {
            margin-left: 25.53191489361702%;
            *margin-left: 25.425531914893618%
        }

        .row-fluid .offset2 {
            margin-left: 19.148936170212764%;
            *margin-left: 19.04255319148936%
        }

        .row-fluid .offset2:first-child {
            margin-left: 17.02127659574468%;
            *margin-left: 16.914893617021278%
        }

        .row-fluid .offset1 {
            margin-left: 10.638297872340425%;
            *margin-left: 10.53191489361702%
        }

        .row-fluid .offset1:first-child {
            margin-left: 8.51063829787234%;
            *margin-left: 8.404255319148938%
        }

        [class*="span"].hide,
        .row-fluid [class*="span"].hide {
            display: none
        }

        [class*="span"].pull-right,
        .row-fluid [class*="span"].pull-right {
            float: right
        }

        .container {
            margin-right: auto;
            margin-left: auto;
            *zoom: 1
        }

        .container:before,
        .container:after {
            display: table;
            line-height: 0;
            content: ""
        }

        .container:after {
            clear: both
        }

        .container-fluid {
            padding-right: 20px;
            padding-left: 20px;
            *zoom: 1
        }

        .container-fluid:before,
        .container-fluid:after {
            display: table;
            line-height: 0;
            content: ""
        }

        .container-fluid:after {
            clear: both
        }
    }
</style>
<style  scoped>
    @import '~cms/assets/css/list.css';
    @import '~cms/assets/css/detail.css';
    /* @import '~cms/assets/css/bootstrap.min.css'; */
    /* @import '~cms/assets/css/bootstrap-combined.min.css'; */
    
</style>
<style scoped lang="css">

</style>


