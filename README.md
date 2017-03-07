# lightly.slide.js
纯javascript打造的滑动特效插件，面向手机、平板电脑等移动终端。
##html:
    <div class="lightly-container">
        <div class="lightly-wrapper">
            <div class="lightly-slide">Slide 1</div>
            <div class="lightly-slide">Slide 2</div>
            <div class="lightly-slide">Slide 3</div>
            <div class="lightly-slide">Slide 4</div>
            <div class="lightly-slide">Slide 5</div>
            <div class="lightly-slide">Slide 6</div>
            <div class="lightly-slide">Slide 7</div>
            <div class="lightly-slide">Slide 8</div>
        </div>
        <div class="lightly-pagination"></div>
        <div class="lightly-button-next lightly-button-white"></div>
        <div class="lightly-button-prev lightly-button-white"></div>
    </div>
##基本使用：
var lightly = lightlySlide('.lightly-container');
##带参数：
var lightly = lightlySlide('.lightly-container',{<br>
        width:'',<br>
        height:'',<br>
        direction: 'horizontal',<br>
        initialSlide: 0,<br>
        speed: 300,<br>
        autoplay: 0,<br>
        spaceBetween: 0,<br>
        slidesPerView: 1,<br>
        slidesPerGroup: 1,<br>
        touchRatio: 1,<br>
        touchAngle: 45,<br>
        followFinger: true,<br>
        nextButton: '.lightly-button-next',<br>
        prevButton: '.lightly-button-prev',<br>
        loop: false,<br>
        containerModifierClass: 'lightly-container-',<br>
        slideClass: 'lightly-slide',<br>
        slideActiveClass: 'lightly-slide-active',<br>
        wrapperClass: 'lightly-wrapper',<br>
        pagination: '.lightly-pagination',<br>
        paginationClass: 'lightly-pagination-container',<br>
        paginationItemClass: 'lightly-pagination-item',<br>
        paginationItemActiveClass: 'lightly-pagination-item-active',<br>
        buttonDisabledClass: 'lightly-button-disabled',<br>
        runCallbacksOnInit:false,<br>
        autoplayDisableOnInteraction:false, <br>
        // onInit: function (lightlySlide),<br>
        // onSlideChangeStart: function (lightlySlide),<br>
        // onSlideChangeEnd: function (lightlySlide),<br>
        // onTransitionStart: function (lightlySlide),<br>
        // onTransitionEnd: function (lightlySlide),<br>
        // onTouchStart: function (lightlySlide, e),<br>
        // onTouchEnd: function (lightlySlide, e),<br>
        // onAutoplayStart: function (lightlySlide),<br>
        // onAutoplayStop: function (lightlySlide),<br>
    })
    
##参数说明：
  direction 类型：string  默认：horizontal  滑动方向，可设置水平(horizontal)或垂直(vertical)。<br>
  initialSlide 类型：number 默认：0 设定初始化时slide的索引。<br>
  autoplay, 类型：number 默认：0 自动切换的时间间隔（单位ms），不设定该参数slide不会自动切换。<br>
  spaceBetwee 类型：number或string（如'10%'） 默认：0  slide之间的距离（单位px string类型为百分比）。<br>
  slidesPerView 类型：number 默认：1 设置slider容器能够同时显示的slides数量<br>
  slidesPerGroup 类型：number 默认：1 slides的数量多少为一组。<br>
  touchRatio 类型：number默认：1 触摸距离与slide滑动距离的比率。<br>
  touchAngle 类型：number默认：45 允许触发拖动的角度值。默认45度，即使触摸方向不是完全水平也能拖动slide<br>
  nextButton 类型：string 默认：null前进按钮的css选择器<br>
  loop 类型：boolean默认：false  是否循环<br>
  runCallbacksOnInit 类型：boolean 默认：false 初始化时触发 [Transition/SlideChange] [Start/End] 回调函数。这些回调函数会在下次初始化时被清除   如果initialSlide不为0。<br>
  autoplayDisableOnInteraction 类型：boolean默认：false 用户操作swiper之后，是否禁止autoplay<br>
  
  onInit: function (lightlySlide) 回调函数，初始化后执行。<br>
  onSlideChangeStart: function (lightlySlide) 回调函数，滑块释放时如果触发slider切换则执行。<br>
  onSlideChangeEnd: function (lightlySlide)<br>
  onTransitionStart: function (lightlySlide) 回调函数，过渡开始时触发<br>
  onTransitionEnd: function (lightlySlide)<br>
  onTouchStart: function (lightlySlide, e) 回调函数，当碰触到slider时执行<br>
  onTouchEnd: function (lightlySlide, e)<br>
  onAutoplayStart: function (lightlySlide) 回调函数，自动切换开始时执行<br>
  onAutoplayStop: function (lightlySlide)<br>
 
##属性
   lightly.realIndex  当前活动块的索引 <br>
   lightly.slideIndex  与pagination小圆点相对应<br>
   其它输出了解
