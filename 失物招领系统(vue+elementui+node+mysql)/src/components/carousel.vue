<template>
    <!-- @mosueenter.stop当鼠标进入某个元素时，停止事件的传播并执行 handleMouseEnter 方法。 -->
    <div :style="style" class="carouselBox"
         @mouseenter.stop="handleMouseEnter"
         @mouseleave.stop="handleMouseLeave"
    >
        <!--图片数组-->
        <div v-for="(item,index) in list" :key="index">
            <transition name="slide-right">
                <div v-show="index === activeIndex" class="carouselContent">
                    <img style="width:680px" :height="height" :src="item.imgPath">
                </div>
            </transition>
        </div>
        <!--指示器-->
        <div class="carousel__indicatorsBox"
             v-if="!hideIndicator"
        >
            <div v-for="(item, index) in list" :key="index"
                 :class="['carousel__indicator',{ 'activeIndicator': index === activeIndex }]"
                 @mouseenter="indicatorHover(index)"
                 @click.stop="indicatorClick(index)">
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            // 是否隐藏指示器
            hideIndicator: Boolean,
            // 轮播图切换时间间隔，单位毫秒ms
            interval: {
                type: Number,
                default: 4000
            },
            // 是否循环播放
            loop: {
                type: Boolean,
                default: true
            },
            // 是否自动播放
            autoplay: {
                type: Boolean,
                default: true
            },
            // 轮播图高度，不能小于10px
            height: {
                type: String,
                default: '100px'
            },
            // 轮播图宽度——根据高度，参考图片比例，指定合适的宽度
            width: {
                type: String,
                default: '680px'
            },
            // 图片数据——对象数组 imgPath属性为图片路径，url属性为点击跳转的链接
            list: Array
        },
        data() {
            return {
                activeIndex: 0,
                style: {
                    'height': this.height,
                    'width': this.width
                },
                timer: null,
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.startTimer();
            });
        },
        methods: {
            // 鼠标移入轮播图——暂停轮播
            handleMouseEnter() {
                this.pauseTimer();
            },
            // 鼠标移出轮播图——重启轮播
            handleMouseLeave() {
                this.startTimer();
            },
            // 启动轮播
            startTimer() {
                if (this.interval <= 0 || !this.autoplay || this.timer) return;
                this.timer = setInterval(this.playSlides, this.interval);
            },
            // 暂停轮播
            pauseTimer() {
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
            },
            // 切换展示的图片
            playSlides() {
                if (this.activeIndex < this.list.length - 1) {
                    this.activeIndex++;
                } else if (this.loop) {
                    this.activeIndex = 0;
                }
            },
            // 鼠标悬浮于指示器上时，切换到相应的图片
            indicatorHover(index) {
                this.activeIndex = index;
            },
            // 点击指示器时，切换到相应的图片
            indicatorClick(index) {
                this.activeIndex = index;
            },
            
        }
    }
</script>
<style scoped>
    /*轮播图盒子样式 -- 相对定位，超出部分隐藏,自动水平居中*/
    .carouselBox {
        /*无图片时的默认底色*/
        background: white;
        position: relative;
        overflow: hidden;
        margin: 0px auto
    }
 
    /*子绝父相定位——使指示器定位在轮播图下边缘*/
    .carousel__indicatorsBox {
        position: absolute;
        display: flex;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
    }
 
    /*指示器样式*/
    .carousel__indicator {
        margin: 0px 6px;
        opacity: .48;
        width: 30px;
        height: 4px;
        background-color: #FFF;
        border: none;
        outline: 0;
        cursor: pointer;
        -webkit-transition: .3s;
        transition: .3s;
    }
 
    /*鼠标悬浮于指示器上时，透明度变为1*/
    .activeIndicator {
        opacity: 1;
    }
 
    /*子绝父相定位——使图片层叠在轮播图中心*/
    .carouselContent {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
 
    /*轮播图切换时的过渡动画 -- 从左滑动进入，从右滑动移出*/
    .slide-right-enter-active,
    .slide-right-leave-active {
        will-change: transform;
        transition: all 500ms;
        position: absolute;
    }
 
    .slide-right-enter {
        opacity: 0;
        transform: translateX(-100%);
    }
 
    .slide-right-leave-active {
        opacity: 0;
        transform: translateX(100%);
    }
</style>