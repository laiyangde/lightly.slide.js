(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var lightlySlide = function lightlySlide(container, params) {
    return new lightlySlide.fn.init(container, params);
};
lightlySlide.fn = lightlySlide.prototype;

lightlySlide.fn.version = '1.0';

lightlySlide.fn.init = function (container, params) {
    var setting = {
        direction: 'horizontal',
        initialSlide: 0,
        speed: 300,
        autoplay: false,
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerGroup: 1,
        touchRatio: 1,
        touchAngle: 45,
        shortSwipes: true,
        longSwipes: true,
        longSwipesRatio: 0.5,
        longSwipesMs: 300,
        followFinger: true,
        nextButton: null,
        prevButton: null,
        resistance: true,
        resistanceRatio: 0.85,
        loop: false,
        containerModifierClass: 'lightly-container-',
        slideClass: 'lightly-slide',
        slideActiveClass: 'lightly-slide-active',
        wrapperClass: 'lightly-wrapper',
        pagination: null,
        paginationClass: 'lightly-pagination-container',
        paginationItemClass: 'lightly-pagination-item',
        paginationItemActiveClass: 'lightly-pagination-item-active',
        paginationClickable: false,

        buttonDisabledClass: 'lightly-button-disabled',
        constomPaginationItem: false,
        runCallbacksOnInit: false,
        autoplayDisableOnInteraction: false
    };
    for (var key in params) {
        setting[key] = params[key];
    }
    this.params = setting;
    var container = document.querySelector(container);
    if (container === null) {
        throw new Error('can not found container');
        return;
    }
    this.addClass(container, this.params.containerModifierClass + this.params.direction);
    var wrapper = container.querySelector('.' + this.params.wrapperClass);
    if (wrapper === null) {
        throw new Error('can not found wrapper');
        return;
    }
    if (this.params.pagination) {
        var paginationContainer = document.querySelector(this.params.pagination);
        this.addClass(paginationContainer, this.params.paginationClass);
    }
    if (this.params.nextButton) {
        this.nextButton = document.querySelector(this.params.nextButton);
    }
    if (this.params.prevButton) {
        this.prevButton = document.querySelector(this.params.prevButton);
    }
    this.isHorizontal = this.params.direction === 'horizontal';
    this.translate = 0;
    //如果循环  头尾各复制slidesPerView个slide
    if (this.params.loop) this.createLoop(wrapper);
    //确定container宽高 保存size
    this.initContainerSize(container);
    this.initSlidesSize(wrapper);
    this.initPagination(paginationContainer);
    this.wrapper = wrapper;
    this.container = container;
    var initialSlide = this.params.loop ? this.params.initialSlide + this.params.slidesPerView : this.params.initialSlide;
    this.slideTo(initialSlide, 0, this.params.runCallbacksOnInit);
    this.initEvents();
    this.autoplayTimeoutId = undefined;
    this.autoplaying = false;
    this.autoplayPaused = false;
    if (this.params.autoplay) {
        this.startAutoplay();
    }
    this.emit('onInit', this);
};
lightlySlide.fn.createLoop = function (wrapper) {
    var slides = wrapper.querySelectorAll('.' + this.params.slideClass);
    var loopedSlides = this.params.slidesPerView;
    var prependSlides = [],
        appendSlides = [],
        slideMap = [],
        i,
        len = slides.length;
    for (var i = 0; i < len; i++) {
        if (i < loopedSlides) appendSlides.push(slides[i]);
        if (i < len && i >= len - loopedSlides) prependSlides.push(slides[i]);
        slides[i].setAttribute('data-index', i);
        slideMap.push(i);
    }
    for (i = 0; i < appendSlides.length; i++) {
        wrapper.appendChild(appendSlides[i].cloneNode(true));
        slideMap.push(i);
    }
    for (i = prependSlides.length - 1; i >= 0; i--) {
        wrapper.insertBefore(prependSlides[i].cloneNode(true), wrapper.childNodes[0]);
        slideMap.unshift(len - prependSlides.length + i);
    }
    this.slideMap = slideMap;
};
lightlySlide.fn.initContainerSize = function (container) {
    var width, height;
    var width = this.params.width || container.clientWidth,
        height = this.params.height || container.clientHeight;
    this.width = width;
    this.height = height;
    this.size = this.isHorizontal ? this.width : this.height;
};
lightlySlide.fn.initSlidesSize = function (wrapper) {
    var slides = wrapper.querySelectorAll('.' + this.params.slideClass);
    this.slideLen = slides.length;
    //保存移动点位置，如果slidesPerGroup=1，则和slidesGrid一样。比如我每次移动两个则保存index%2的位置！
    this.snapGrid = [];
    //保存每个slide的位置 
    this.slidesGrid = [];

    var spaceBetween = this.params.spaceBetween,
        slidePosition = 0,
        i,
        index = 0;
    if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
        spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * this.size;
    }
    var virtualSize = -spaceBetween;
    var slideSize = (this.size - (this.params.slidesPerView - 1) * spaceBetween) / this.params.slidesPerView;
    //计算每个slide的宽度并设置及保存
    for (i = 0; i < this.slideLen; i++) {
        if (this.isHorizontal) {
            slides[i].style.width = slideSize + 'px';
        } else {
            slides[i].style.height = slideSize + 'px';
        }
        if (index % this.params.slidesPerGroup === 0) this.snapGrid.push(slidePosition);
        this.slidesGrid.push(slidePosition);
        slidePosition = slidePosition + slideSize + spaceBetween;
        virtualSize += slideSize + spaceBetween;
        index++;
    }
    this.slideSize = slideSize;
    virtualSize = Math.max(virtualSize, this.size);
    this.snapGridLastIndex = this.snapGrid.length - 1;
    var _dis = virtualSize - this.size;
    for (i = this.snapGridLastIndex; i >= 0; i--) {
        if (this.snapGrid[i] - _dis > 1e-5) {
            this.snapGrid.pop();
            this.snapGridLastIndex -= 1;
        } else {
            break;
        }
    }
    if (Math.floor(virtualSize - this.size) - Math.floor(this.snapGrid[this.snapGridLastIndex]) > 1) {
        this.snapGrid.push(virtualSize - this.size);
        this.snapGridLastIndex += 1;
    }
    if (this.snapGrid.length === 0) this.snapGrid = [0];
    this.snapGridLastValue = this.snapGrid[this.snapGridLastIndex];

    // if (this.params.spaceBetween !== 0) {
    //     if (this.isHorizontal) {
    //         slides.css({marginRight: spaceBetween + 'px'})
    //     }
    //     else slides.css({marginBottom: spaceBetween + 'px'});
    // }
    if (this.params.spaceBetween !== 0) {
        if (this.isHorizontal) {
            this.styles(slides, 'marginRight', spaceBetween + 'px');
        } else this.styles(slides, 'marginBottom', spaceBetween + 'px');
    }
};
lightlySlide.fn.initPagination = function (paginationContainer) {
    if (!paginationContainer) return;
    var paginationHTML = '';
    var numberOfBullets = this.params.loop ? Math.ceil((this.slideLen - this.params.slidesPerView * 2) / this.params.slidesPerGroup) : this.snapGrid.length;
    for (var i = 0; i < numberOfBullets; i++) {
        paginationHTML += '<span class="' + this.params.paginationItemClass + '"></span>';
    }
    paginationContainer.innerHTML = paginationHTML;

    this.paginationItems = paginationContainer.querySelectorAll('.' + this.params.paginationItemClass);
};

lightlySlide.fn.startAutoplay = function () {
    if (typeof this.autoplayTimeoutId !== 'undefined') return false;
    if (!this.params.autoplay) return false;
    if (this.autoplaying) return false;
    this.autoplaying = true;
    this.emit('onAutoplayStart', this);
    this.autoplay();
};
lightlySlide.fn.stopAutoplay = function (internal) {
    if (!this.autoplayTimeoutId) return;
    if (this.autoplayTimeoutId) clearTimeout(this.autoplayTimeoutId);
    this.autoplaying = false;
    this.autoplayTimeoutId = undefined;
    this.emit('onAutoplayStop', this);
};

lightlySlide.fn.pauseAutoplay = function (speed) {
    var that = this;
    if (this.autoplayPaused) return;
    if (this.autoplayTimeoutId) clearTimeout(this.autoplayTimeoutId);
    this.autoplayPaused = true;
    if (speed === 0) {
        this.autoplayPaused = false;
        this.autoplay();
    } else {
        this.transitionEnd(function () {
            that.autoplayPaused = false;
            if (!that.autoplaying) {
                that.stopAutoplay();
            } else {
                that.autoplay();
            }
        });
    }
};

lightlySlide.fn.autoplay = function (speed) {
    var autoplayDelay = this.params.autoplay;
    var that = this;
    // var activeSlide = this.slides.eq(this.activeIndex);
    this.autoplayTimeoutId = setTimeout(function () {
        if (that.params.loop) {
            // that.fixLoop();
            that.slideNext(true, speed, true);
            that.emit('onAutoplay', that);
        } else {
            if (!that.isEnd) {
                that.slideNext(true, speed, true);
                that.emit('onAutoplay', that);
            } else {
                if (!that.params.autoplayStopOnLast) {
                    that.slideTo(0, speed, true, true);
                    that.emit('onAutoplay', that);
                } else {
                    that.stopAutoplay();
                }
            }
        }
    }, autoplayDelay);
};

lightlySlide.fn.updatePagination = function () {
    if (!this.paginationItems) return;
    if (this.paginationItems <= 0) return;
    var current,
        total = this.params.loop ? Math.ceil((this.slideLen - this.params.slidesPerView * 2) / this.params.slidesPerGroup) : this.snapGrid.length;
    if (this.params.loop) {
        current = Math.ceil((this.activeIndex - this.params.slidesPerView) / this.params.slidesPerGroup);
        if (current > this.slideLen - 1 - this.params.slidesPerView * 2) {
            current = current - (this.slideLen - this.params.slidesPerView * 2);
        }
        if (current > total - 1) current = current - total;
    } else {
        if (typeof this.snapIndex !== 'undefined') {
            current = this.snapIndex;
        } else {
            current = this.activeIndex || 0;
        }
    }
    this.paginationItems[this.prevCurrent || 0].classList.remove(this.params.paginationItemActiveClass);
    this.paginationItems[current].classList.add(this.params.paginationItemActiveClass);
    this.prevCurrent = current;
    this.slideIndex = current;
};
lightlySlide.fn.updateButton = function () {
    if (!this.params.loop && this.params.nextButton) {
        if (this.isBeginning) {
            this.prevButton.classList.add(this.params.buttonDisabledClass);
        } else {
            this.prevButton.classList.remove(this.params.buttonDisabledClass);
        }
        if (this.isEnd) {
            this.nextButton.classList.add(this.params.buttonDisabledClass);
        } else {
            this.nextButton.classList.remove(this.params.buttonDisabledClass);
        }
    }
};
lightlySlide.fn.slideTo = function (slideIndex, speed, runCallbacks, internal) {

    if (typeof runCallbacks === 'undefined') runCallbacks = true;
    if (typeof slideIndex === 'undefined') slideIndex = 0;
    if (slideIndex < 0) slideIndex = 0;
    this.snapIndex = Math.floor(slideIndex / this.params.slidesPerGroup);
    if (this.snapIndex >= this.snapGrid.length) this.snapIndex = this.snapGridLastIndex;
    var translate = -this.snapGrid[this.snapIndex];
    if (this.params.autoplay && this.autoplaying) {
        if (internal || !this.params.autoplayDisableOnInteraction) {
            this.pauseAutoplay(speed);
        } else {
            this.stopAutoplay();
        }
    }
    this.updateBothsEnd(translate);
    if (typeof speed === 'undefined') speed = this.params.speed;
    this.previousIndex = this.activeIndex || 0;
    this.activeIndex = slideIndex;
    this.realIndex = this.params.loop ? this.slideMap[slideIndex] : slideIndex;
    this.updatePagination();
    this.updateButton();
    if (translate === this.translate) {
        return false;
    }
    this.onTransitionStart(runCallbacks);

    if (speed === 0) {
        this.setWrapperTranslate(translate);
        this.setWrapperTransition(0);
        this.onTransitionEnd(runCallbacks);
    } else {
        this.setWrapperTranslate(translate);
        this.setWrapperTransition(speed);
        if (!this.animating) {
            var that = this;
            this.animating = true;
            this.transitionEnd(this.wrapper, function () {
                that.onTransitionEnd(runCallbacks);
            });
        }
    }
    return true;
};
lightlySlide.fn.onTransitionStart = function (runCallbacks) {
    if (typeof runCallbacks === 'undefined') runCallbacks = true;
    if (runCallbacks) {
        this.emit('onTransitionStart', this);
        if (this.activeIndex !== this.previousIndex) {
            this.emit('onSlideChangeStart', this);
            if (this.activeIndex > this.previousIndex) {
                this.emit('onSlideNextStart', this);
            } else {
                this.emit('onSlidePrevStart', this);
            }
        }
    }
};
lightlySlide.fn.onTransitionEnd = function (runCallbacks) {
    this.animating = false;
    this.setWrapperTransition(0);
    if (typeof runCallbacks === 'undefined') runCallbacks = true;
    if (runCallbacks) {
        this.emit('onTransitionEnd', this);
        if (this.activeIndex !== this.previousIndex) {
            this.emit('onSlideChangeEnd', this);
            if (this.activeIndex > this.previousIndex) {
                this.emit('onSlideNextEnd', this);
            } else {
                this.emit('onSlidePrevEnd', this);
            }
        }
    }
};
lightlySlide.fn.setWrapperTransition = function (duration) {
    this.wrapper.style.webkitTransitionDuration = this.wrapper.style.transitionDuration = duration + 'ms';
};
lightlySlide.fn.setWrapperTranslate = function (translate, updateActiveIndex, byController) {
    var x = 0,
        y = 0;
    this.isHorizontal ? x = translate : y = translate;
    this.wrapper.style.webkitTransform = this.wrapper.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0px)';
    this.translate = this.isHorizontal ? x : y;
};

lightlySlide.fn.updateBothsEnd = function (translate) {
    if (typeof translate === 'undefined') {
        translate = this.translate || 0;
    }
    this.isBeginning = -translate <= 0;
    this.isEnd = -translate >= this.snapGrid[this.snapGridLastIndex];
};
lightlySlide.fn.emit = function (eventName) {
    this.params[eventName] && this.params[eventName].apply(this, arguments);
};
lightlySlide.fn.initEvents = function () {
    this.touches = {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0
    };
    this.count = 0;
    this.onTouchMoveHandle = this.onTouchMove.bind(this);
    this.onTouchEndHandle = this.onTouchEnd.bind(this);
    //Touch Events
    this.container.addEventListener('touchstart', this.onTouchStart.bind(this), false);
    // window[action]('resize', s.onResize);
    if (this.params.nextButton && this.nextButton) {
        this.nextButton.addEventListener('click', this.onClickNext.bind(this), false);
    }
    if (this.params.prevButton && this.prevButton) {
        this.prevButton.addEventListener('click', this.onClickPrev.bind(this), false);
    }
};
lightlySlide.fn.onClickNext = function (e) {
    e.preventDefault();
    if (this.isEnd && !this.params.loop) return;
    this.slideNext();
};
lightlySlide.fn.onClickPrev = function (e) {
    e.preventDefault();
    if (this.isBeginning && !this.params.loop) return;
    this.slidePrev();
};
lightlySlide.fn.onTouchStart = function (e) {
    var startX = this.touches.currentX = e.targetTouches[0].pageX;
    var startY = this.touches.currentY = e.targetTouches[0].pageY;
    var container = this.container;
    this.touches.isTouched = true;
    this.touches.isMoved = false;
    this.touches.allowTouchCallbacks = true;
    this.touches.isScrolling = undefined;
    this.touches.startMoving = undefined;
    this.touches.startX = startX;
    this.touches.startY = startY;
    this.touches.touchStartTime = Date.now();
    this.allowClick = true;
    this.swipeDirection = undefined;
    this.emit('onTouchStart', this, e);
    container.addEventListener('touchmove', this.onTouchMoveHandle, false);
    container.addEventListener('touchend', this.onTouchEndHandle, false);
};
lightlySlide.fn.onTouchMove = function (e) {
    if (e.targetTouches && e.targetTouches.length > 1) {
        this.removeTouch();return;
    }
    this.touches.currentX = e.targetTouches[0].pageX;
    this.touches.currentY = e.targetTouches[0].pageY;
    //判断手指角度看看是否移动
    if (typeof this.touches.isScrolling === 'undefined') {
        var touchAngle;
        if (this.isHorizontal && this.touches.currentY === this.touches.startY || !this.isHorizontal && this.touches.currentX === this.touches.startX) {
            this.touches.isScrolling = false;
        } else {
            touchAngle = Math.atan2(Math.abs(this.touches.currentY - this.touches.startY), Math.abs(this.touches.currentX - this.touches.startX)) * 180 / Math.PI;
            this.touches.isScrolling = this.isHorizontal ? touchAngle > this.params.touchAngle : 90 - touchAngle > this.params.touchAngle;
        }
    }
    if (!this.touches.isTouched) return;
    if (this.touches.isScrolling) {
        this.touches.isTouched = false;
        return;
    }
    this.allowClick = false;
    e.preventDefault();
    e.stopPropagation();
    if (!this.touches.isMoved) {
        if (this.params.loop) {
            this.fixLoop();
        }
        this.touches.startTranslate = this.translate;
        this.setWrapperTransition(0);
        if (this.animating) {
            var events = window.ontransitionend === null ? 'transitionend' : 'webkitTransitionEnd';
            this.trigger(this.wrapper, events);
        }
        if (this.params.autoplay && this.autoplaying) {
            if (this.params.autoplayDisableOnInteraction) {
                this.stopAutoplay();
            } else {
                this.pauseAutoplay();
            }
        }
        this.touches.allowMomentumBounce = false;
    }
    this.touches.isMoved = true;
    var diff = this.touches.diff = this.isHorizontal ? this.touches.currentX - this.touches.startX : this.touches.currentY - this.touches.startY;
    diff = diff * this.params.touchRatio;
    this.swipeDirection = diff > 0 ? 'prev' : 'next';
    this.currentTranslate = diff + this.touches.startTranslate;
    if (diff > 0 && this.currentTranslate > 0) {
        if (this.params.resistance) this.currentTranslate = -1 + Math.pow(this.currentTranslate, this.params.resistanceRatio);
    } else if (diff < 0 && this.currentTranslate < -this.snapGridLastValue) {
        if (this.params.resistance) this.currentTranslate = -this.snapGridLastValue + 1 - Math.pow(-this.snapGridLastValue - this.currentTranslate, this.params.resistanceRatio);
    }
    if (!this.params.followFinger) return;
    this.setWrapperTranslate(this.currentTranslate);
};
lightlySlide.fn.onTouchEnd = function (e) {
    if (this.touches.allowTouchCallbacks) {
        this.emit('onTouchEnd', this, e);
    }
    this.touches.allowTouchCallbacks = false;
    if (!this.touches.isTouched) return;
    //Return Grab Cursor
    var touchEndTime = Date.now();
    var timeDiff = touchEndTime - this.touches.touchStartTime;
    if (!this.touches.isTouched || !this.touches.isMoved || !this.swipeDirection || this.touches.diff === 0 || this.touches.currentTranslate === this.touches.startTranslate) {
        this.touches.isTouched = this.touches.isMoved = false;
        return;
    }
    this.touches.isTouched = this.touches.isMoved = false;
    var currentPos = this.params.followFinger ? -this.translate : -this.touches.currentTranslate;
    // Find current slide
    var i,
        stopIndex = 0,
        groupSize = this.slideSize;
    for (i = 0; i < this.slidesGrid.length; i += this.params.slidesPerGroup) {
        if (typeof this.slidesGrid[i + this.params.slidesPerGroup] !== 'undefined') {
            if (currentPos >= this.slidesGrid[i] && currentPos < this.slidesGrid[i + this.params.slidesPerGroup]) {
                stopIndex = i;
                groupSize = this.slidesGrid[i + this.params.slidesPerGroup] - this.slidesGrid[i];
            }
        } else {
            if (currentPos >= this.slidesGrid[i]) {
                stopIndex = i;
                groupSize = this.slidesGrid[this.slideLen] - this.slidesGrid[this.slideLen - 1];
            }
        }
    }

    // Find current slide size
    var ratio = (currentPos - this.slidesGrid[stopIndex]) / groupSize;

    if (timeDiff > this.params.longSwipesMs) {
        // Long touches
        if (!this.params.longSwipes) {
            this.slideTo(this.activeIndex);
            return;
        }
        if (this.swipeDirection === 'next') {
            if (ratio >= this.params.longSwipesRatio) this.slideTo(stopIndex + this.params.slidesPerGroup);else this.slideTo(stopIndex);
        }
        if (this.swipeDirection === 'prev') {
            if (ratio > 1 - this.params.longSwipesRatio) this.slideTo(stopIndex + this.params.slidesPerGroup);else this.slideTo(stopIndex);
        }
    } else {
        // Short swipes
        if (!this.params.shortSwipes) {
            this.slideTo(s.activeIndex);
            return;
        }
        if (this.swipeDirection === 'next') {
            this.slideTo(stopIndex + this.params.slidesPerGroup);
        }
        if (this.swipeDirection === 'prev') {
            this.slideTo(stopIndex);
        }
    }
    this.removeTouch();
};
lightlySlide.fn.removeTouch = function () {
    var container = this.container;
    container.removeEventListener('touchmove', this.onTouchMoveHandle);
    container.removeEventListener('touchend', this.onTouchEndHandle);
};
lightlySlide.fn.slideNext = function (runCallbacks, speed, internal) {
    if (this.params.loop) {
        if (this.animating) return false;
        this.fixLoop();
        this.container.clientLeft;
        return this.slideTo(this.activeIndex + this.params.slidesPerGroup, speed, runCallbacks, internal);
    } else return this.slideTo(this.activeIndex + this.params.slidesPerGroup, speed, runCallbacks, internal);
};
lightlySlide.fn.slidePrev = function (runCallbacks, speed, internal) {
    if (this.params.loop) {
        if (this.animating) return false;
        this.fixLoop();
        this.container.clientLeft;
        return this.slideTo(this.activeIndex - this.params.slidesPerGroup, speed, runCallbacks, internal);
    } else return this.slideTo(this.activeIndex - this.params.slidesPerGroup, speed, runCallbacks, internal);
};
lightlySlide.fn.fixLoop = function () {
    var newIndex;
    //Fix For Negative Oversliding
    if (this.activeIndex < this.params.slidesPerView) {
        newIndex = this.slideLen - this.params.slidesPerView * 3 + this.activeIndex;
        newIndex = newIndex + this.params.slidesPerView;
        this.slideTo(newIndex, 0, false, true);
    }
    //Fix For Positive Oversliding
    else if (this.activeIndex > this.slideLen - this.params.slidesPerView * 2) {
            newIndex = -this.slideLen + this.activeIndex + this.params.slidesPerView;
            newIndex = newIndex + this.params.slidesPerView;
            this.slideTo(newIndex, 0, false, true);
        }
};
lightlySlide.fn.addClass = function (dom, classNames) {
    var classNames = classNames.split(' ');
    for (var i = 0; i < classNames.length; i++) {
        dom.classList.add(classNames[i]);
    }
};
lightlySlide.fn.styles = function (dom, props, value) {
    var len = dom.length;
    for (var i = 0; i < len; i++) {
        this.style(dom[i], props, value);
    }
};
lightlySlide.fn.style = function (dom, props, value) {
    if (arguments.length === 3) {
        dom.style[props] = value;
    } else {
        for (var key in props) {
            dom.style[key] = props[key];
        }
    }
};
lightlySlide.fn.transitionEnd = function (dom, callback) {
    var events = window.ontransitionend === null ? 'transitionend' : 'webkitTransitionEnd';
    function fireCallBack(e) {
        callback.call(this, e);
        dom.removeEventListener(events, fireCallBack);
    }
    if (callback) {
        dom.addEventListener(events, fireCallBack, false);
    }
};

lightlySlide.fn.trigger = function (dom, eventName, eventData) {
    var evt;
    try {
        evt = new window.CustomEvent(eventName, { detail: eventData, bubbles: true, cancelable: true });
    } catch (e) {
        evt = document.createEvent('Event');
        evt.initEvent(eventName, true, true);
        evt.detail = eventData;
    }
    dom.dispatchEvent(evt);
};

lightlySlide.fn.init.prototype = lightlySlide.fn;
window.lightlySlide = lightlySlide;

})));
