<!-- App.vue中，是不能够写template的，不会编译 -->
<script>
export default {
  mpType: 'app'
}
</script>

<style>
html , body{
    width:100%;
    height:100%;
}
.container {
  height: 100%;
}
div{
	/*font-size: 16px;*/
}
.overflowYScroll {
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    -moz-overflow-scrolling: touch;
    -ms-overflow-scrolling: touch;
    
}
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}

/*
*   vux-1px-l 左边框
*   vux-1px-r 右边框
*   vux-1px-t 上边框
*   vux-1px-b 下边框
*   vux-1px-tb 上下边框
*   vux-1px 全边框
*/

.vux-1px, .vux-1px-t, .vux-1px-b, .vux-1px-tb, .vux-1px-l, .vux-1px-r {
  position: relative;
}
.vux-1px:before{
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  width: 200%;
  height: 1px;
  border: 1px solid #efefef;
  color: #efefef;
  height: 200%;
  transform-origin: left top;
  transform: scale(0.5);
}
.vux-1px-t:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #efefef;
    color: #efefef;
    transform-origin: 0 0;
    transform: scaleY(0.5);
    z-index: 1;
}
.vux-1px-b:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #efefef;
    color: #efefef;
    transform-origin: 0 100%;
    transform: scaleY(0.5);
    z-index: 1;
}
.vux-1px-tb:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #efefef;
    color: #efefef;
    transform-origin: 0 0;
    transform: scaleY(0.5);
}
.vux-1px-tb:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #efefef;
    color: #efefef;
    transform-origin: 0 100%;
    transform: scaleY(0.5);
}
.vux-1px-l:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 1px;
    bottom: 0;
    border-left: 1px solid #efefef;
    color: #efefef;
    transform-origin: 0 0;
    transform: scaleX(0.5);
    z-index: 1;
}
.vux-1px-r:after{
    content: " ";
    position: absolute;
    right: 0;
    top: 0;
    width: 1px;
    bottom: 0;
    border-right: 1px solid #efefef;
    color: #efefef;
    transform-origin: 100% 0;
    transform: scaleX(0.5);
    z-index: 1;
}
.flex {
    display: box;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-flex-direction: row;
    -moz-flex-direction: row;
    -mx-flex-direction: row;
    -webkit-flex-direction: row;
    flex-direction: row;
}

.flex-1 {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
}


.flex-direction-column {
    display: box;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    -o-flex-direction: column;
    flex-direction: column;
}

.flex-wrap {
    -webkit-flex-wrap: wrap;
    -moz-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    -o-flex-wrap: wrap;
    flex-wrap: wrap;
}

.flex-align-items {
    -webkit-box-align: center;
    -webkit-align-items: center;
    -moz-align-items: center;
    -ms-align-items: center;
    -o-align-items: center;
    align-items: center;
}

.flex-align-items-end {
    -webkit-box-align: flex-end;
    -webkit-align-items: flex-end;
    -moz-align-items: flex-end;
    -ms-align-items: flex-end;
    -o-align-items: flex-end;
    align-items: flex-end;
}

.flex-align-items-start {
    -webkit-box-align: flex-start;
    -webkit-align-items: flex-start;
    -moz-align-items: flex-start;
    -ms-align-items: flex-start;
    -o-align-items: flex-start;
    align-items: enflex-startd;
}

.flex-justify-content {
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -moz-justify-content: center;
    -ms-justify-content: center;
    -o-justify-content: center;
    justify-content: center;
}

.flex-justify-content-between {
    -webkit-box-pack: space-between;
    -webkit-justify-content: space-between;
    -moz-justify-content: space-between;
    -ms-justify-content: space-between;
    -o-justify-content: space-between;
    justify-content: space-between;
}

.flex-justify-content-around {
    -webkit-box-pack: space-around;
    -webkit-justify-content: space-around;
    -moz-justify-content: space-around;
    -ms-justify-content: space-around;
    -o-justify-content: space-around;
    justify-content: space-around;
}

.flex-justify-content-start {
    -webkit-box-pack: start;
    -webkit-justify-content: start;
    -moz-justify-content: start;
    -ms-justify-content: start;
    -o-justify-content: start;
    justify-content: start;
}

.flex-justify-content-left {
    -webkit-box-pack: left;
    -webkit-justify-content: left;
    -moz-justify-content: left;
    -ms-justify-content: left;
    -o-justify-content: left;
    justify-content: left;
}

.flex-justify-content-right {
    -webkit-box-pack: flex-end;
    -webkit-justify-content: flex-end;
    -moz-justify-content: flex-end;
    -ms-justify-content: flex-end;
    -o-justify-content: flex-end;
    justify-content: flex-end;
}
</style>
