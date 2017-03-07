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
var lightly = lightlySlide('.lightly-container',{
        width:'',
        height:'',
        direction: 'horizontal',
        initialSlide: 0,
        speed: 300,
        autoplay: 0,
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerGroup: 1,
        touchRatio: 1,
        touchAngle: 45,
        followFinger: true,
        nextButton: '.lightly-button-next',
        prevButton: '.lightly-button-prev',
        loop: false,
        containerModifierClass: 'lightly-container-',
        slideClass: 'lightly-slide',
        slideActiveClass: 'lightly-slide-active',
        wrapperClass: 'lightly-wrapper',
        pagination: '.lightly-pagination',
        paginationClass: 'lightly-pagination-container',
        paginationItemClass: 'lightly-pagination-item',
        paginationItemActiveClass: 'lightly-pagination-item-active',
        buttonDisabledClass: 'lightly-button-disabled',
        runCallbacksOnInit:false,
        autoplayDisableOnInteraction:false,
        // onInit: function (lightlySlide),
        // onSlideChangeStart: function (lightlySlide),
        // onSlideChangeEnd: function (lightlySlide),
        // onTransitionStart: function (lightlySlide),
        // onTransitionEnd: function (lightlySlide),
        // onTouchStart: function (lightlySlide, e),
        // onTouchEnd: function (lightlySlide, e),
        // onAutoplayStart: function (lightlySlide),
        // onAutoplayStop: function (lightlySlide),
    })
    
##参数说明：
  direction 类型：string  默认：horizontal  滑动方向，可设置水平(horizontal)或垂直(vertical)。
  initialSlide 类型：number 默认：0 设定初始化时slide的索引。
  autoplay, 类型：number 默认：0 自动切换的时间间隔（单位ms），不设定该参数slide不会自动切换。
  spaceBetwee 类型：number或string（如'10%'） 默认：0  slide之间的距离（单位px string类型为百分比）。
  slidesPerView 类型：number 默认：1 设置slider容器能够同时显示的slides数量
  slidesPerGroup 类型：number 默认：1 slides的数量多少为一组。
  touchRatio 类型：number默认：1 触摸距离与slide滑动距离的比率。
  touchAngle 类型：number默认：45 允许触发拖动的角度值。默认45度，即使触摸方向不是完全水平也能拖动slide
  nextButton 类型：string 默认：null前进按钮的css选择器
  loop 类型：boolean默认：false  是否循环
  runCallbacksOnInit 类型：boolean 默认：false 初始化时触发 [Transition/SlideChange] [Start/End] 回调函数。这些回调函数会在下次初始化时被清除   如果initialSlide不为0。
  autoplayDisableOnInteraction 类型：boolean默认：false 用户操作swiper之后，是否禁止autoplay
  
  onInit: function (lightlySlide) 回调函数，初始化后执行。
  onSlideChangeStart: function (lightlySlide) 回调函数，滑块释放时如果触发slider切换则执行。
  onSlideChangeEnd: function (lightlySlide)
  onTransitionStart: function (lightlySlide) 回调函数，过渡开始时触发
  onTransitionEnd: function (lightlySlide)
  onTouchStart: function (lightlySlide, e) 回调函数，当碰触到slider时执行
  onTouchEnd: function (lightlySlide, e)
  onAutoplayStart: function (lightlySlide) 回调函数，自动切换开始时执行
  onAutoplayStop: function (lightlySlide)
 
##属性
   lightly.realIndex  当前活动块的索引 
   lightly.slideIndex  与pagination小圆点相对应
   其它输出了解
