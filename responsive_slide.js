var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _transition, _animate, _htmlElements, _settings, _states;
var Events;
(function (Events) {
    Events["CLICK"] = "click";
    Events["SWIPE_DOWN"] = "swipeDown";
    Events["SWIPE_UP"] = "swipeUp";
    Events["SWIPE_LEFT"] = "swipeLeft";
    Events["SWIPE_RIGHT"] = "swipeRight";
    Events["KEYDOWN"] = "keydown";
    Events["ON_RESIZE"] = "onResize";
    Events["MOUSE_ENTER"] = "mouseenter";
    Events["MOUSE_LEAVE"] = "mouseleave";
})(Events || (Events = {}));
var Arrow;
(function (Arrow) {
    Arrow["LEFT"] = "ArrowLeft";
    Arrow["RIGHT"] = "ArrowRight";
})(Arrow || (Arrow = {}));
var Transform;
(function (Transform) {
    Transform["Default"] = "transform";
    Transform["Webkit"] = "-webkit-transform";
    Transform["Moz"] = "-moz-transform";
    Transform["Ms"] = "-ms-transform";
    Transform["Opera"] = "-o-transform";
})(Transform || (Transform = {}));
var Translation;
(function (Translation) {
    Translation["Left"] = "translateX(-100vw)";
    Translation["Viewport"] = "translateX(0)";
    Translation["Right"] = "translateX(100vw)";
})(Translation || (Translation = {}));
class ResponsiveSlide {
    constructor(container, imagesWrapper, navItemsWrapper, captionsWrapper, items, item, image, circle, hasMoreItems, active, slideTime, transitionDuration, autoplay, pauseOnHover, navItemsContainerHeight) {
        _transition.set(this, {
            right: {
                [Transform.Default]: Translation.Right,
                [Transform.Webkit]: Translation.Right,
                [Transform.Moz]: Translation.Right,
                [Transform.Ms]: Translation.Right,
                [Transform.Opera]: Translation.Right,
            },
            left: {
                [Transform.Default]: Translation.Left,
                [Transform.Webkit]: Translation.Left,
                [Transform.Moz]: Translation.Left,
                [Transform.Ms]: Translation.Left,
                [Transform.Opera]: Translation.Left,
            },
            viewport: {
                [Transform.Default]: Translation.Viewport,
                [Transform.Webkit]: Translation.Viewport,
                [Transform.Moz]: Translation.Viewport,
                [Transform.Ms]: Translation.Viewport,
                [Transform.Opera]: Translation.Viewport,
            }
        });
        _animate.set(this, {
            timing: {
                duration: 300,
                iterations: 1,
            },
            rightToLeft: [
                __classPrivateFieldGet(this, _transition).right,
                __classPrivateFieldGet(this, _transition).viewport,
            ],
            leftToRight: [
                __classPrivateFieldGet(this, _transition).left,
                __classPrivateFieldGet(this, _transition).viewport,
            ],
            toLeft: [
                __classPrivateFieldGet(this, _transition).viewport,
                __classPrivateFieldGet(this, _transition).left,
            ],
            toRight: [
                __classPrivateFieldGet(this, _transition).viewport,
                __classPrivateFieldGet(this, _transition).right,
            ]
        });
        _htmlElements.set(this, {
            container: null,
            imagesWrapper: null,
            navItemsWrapper: null,
            captionsWrapper: null,
        });
        _settings.set(this, {
            ids: {
                container: '#header-slider',
            },
            classSelections: {
                imagesWrapper: 'images-wrapper',
                navItemsWrapper: 'nav-items-wrapper',
                captionsWrapper: 'captions-wrapper',
                items: '.items',
                item: '.item',
                image: '.image',
                circle: '.circle',
            },
            classes: {
                active: 'active',
                hasMoreItems: 'has-more-items',
            },
            slideTime: 5000,
            autoplay: true,
            pauseOnHover: true,
            navItemsContainerHeight: 30,
        });
        _states.set(this, {
            currentTimerId: undefined,
            activeSlideNr: 0,
            navIsRunning: false,
            activeNavItem: null,
            imageIsRunning: false,
            activeImageItem: null,
            captionIsRunning: false,
            activeCaptionItem: null,
        });
        __classPrivateFieldGet(this, _settings).ids.container = container;
        __classPrivateFieldGet(this, _settings).classSelections.imagesWrapper = imagesWrapper;
        __classPrivateFieldGet(this, _settings).classSelections.navItemsWrapper = navItemsWrapper;
        __classPrivateFieldGet(this, _settings).classSelections.captionsWrapper = captionsWrapper;
        __classPrivateFieldGet(this, _settings).classSelections.items = items;
        __classPrivateFieldGet(this, _settings).classSelections.item = item;
        __classPrivateFieldGet(this, _settings).classSelections.image = image;
        __classPrivateFieldGet(this, _settings).classSelections.circle = circle;
        __classPrivateFieldGet(this, _settings).classes.hasMoreItems = hasMoreItems;
        __classPrivateFieldGet(this, _settings).classes.active = active;
        __classPrivateFieldGet(this, _settings).slideTime = slideTime;
        __classPrivateFieldGet(this, _animate).timing.duration = transitionDuration;
        __classPrivateFieldGet(this, _settings).autoplay = autoplay;
        __classPrivateFieldGet(this, _settings).pauseOnHover = pauseOnHover;
        __classPrivateFieldGet(this, _settings).navItemsContainerHeight = navItemsContainerHeight;
        __classPrivateFieldGet(this, _htmlElements).container = document.querySelector(__classPrivateFieldGet(this, _settings).ids.container);
        if (__classPrivateFieldGet(this, _htmlElements).container) {
            this.initHtmlElements();
            this.initEvent();
            this.init();
        }
    }
    initHtmlElements() {
        var _a, _b, _c;
        __classPrivateFieldGet(this, _htmlElements).imagesWrapper = (_a = __classPrivateFieldGet(this, _htmlElements).container) === null || _a === void 0 ? void 0 : _a.querySelector(__classPrivateFieldGet(this, _settings).classSelections.imagesWrapper);
        __classPrivateFieldGet(this, _htmlElements).navItemsWrapper = (_b = __classPrivateFieldGet(this, _htmlElements).container) === null || _b === void 0 ? void 0 : _b.querySelector(__classPrivateFieldGet(this, _settings).classSelections.navItemsWrapper);
        __classPrivateFieldGet(this, _htmlElements).captionsWrapper = (_c = __classPrivateFieldGet(this, _htmlElements).container) === null || _c === void 0 ? void 0 : _c.querySelector(__classPrivateFieldGet(this, _settings).classSelections.captionsWrapper);
    }
    initEvent() {
        var _a, _b, _c;
        const linkItems = (_a = __classPrivateFieldGet(this, _htmlElements).navItemsWrapper) === null || _a === void 0 ? void 0 : _a.querySelectorAll(__classPrivateFieldGet(this, _settings).classSelections.item);
        for (const linkItem of linkItems) {
            linkItem.addEventListener(Events.CLICK, event => {
                var _a;
                this._stopTimer();
                this._goToSlide(parseInt((_a = event.currentTarget.dataset.id) !== null && _a !== void 0 ? _a : ''));
                this._startTimer();
            });
        }
        window.spa.util.swipe.initModule(__classPrivateFieldGet(this, _htmlElements).container, Events.SWIPE_LEFT, () => {
            this._next();
        });
        window.spa.util.swipe.initModule(__classPrivateFieldGet(this, _htmlElements).container, Events.SWIPE_RIGHT, () => {
            this._prev();
        });
        window.document.addEventListener(Events.KEYDOWN, e => {
            if (e.key === Arrow.LEFT) {
                this._prev();
            }
            else if (e.key === Arrow.RIGHT) {
                this._next();
            }
        });
        window.addEventListener(Events.ON_RESIZE, () => {
            this._resizeHandler();
        });
        (_b = __classPrivateFieldGet(this, _htmlElements).container) === null || _b === void 0 ? void 0 : _b.addEventListener(Events.MOUSE_ENTER, () => {
            if (__classPrivateFieldGet(this, _settings).autoplay && __classPrivateFieldGet(this, _settings).pauseOnHover) {
                this._stopTimer();
            }
        });
        (_c = __classPrivateFieldGet(this, _htmlElements).container) === null || _c === void 0 ? void 0 : _c.addEventListener(Events.MOUSE_LEAVE, () => {
            if (__classPrivateFieldGet(this, _settings).autoplay && __classPrivateFieldGet(this, _settings).pauseOnHover) {
                this._startTimer();
            }
        });
    }
    init() {
        var _a, _b, _c;
        const firstLinkItem = (_a = __classPrivateFieldGet(this, _htmlElements).navItemsWrapper) === null || _a === void 0 ? void 0 : _a.querySelector(__classPrivateFieldGet(this, _settings).classSelections.item + this._selectItemById(0));
        const firstCaptionItem = (_b = __classPrivateFieldGet(this, _htmlElements).captionsWrapper) === null || _b === void 0 ? void 0 : _b.querySelector(__classPrivateFieldGet(this, _settings).classSelections.item + this._selectItemById(0));
        const firstImageItem = (_c = __classPrivateFieldGet(this, _htmlElements).imagesWrapper) === null || _c === void 0 ? void 0 : _c.querySelector(__classPrivateFieldGet(this, _settings).classSelections.item + this._selectItemById(0));
        firstLinkItem === null || firstLinkItem === void 0 ? void 0 : firstLinkItem.classList.add(__classPrivateFieldGet(this, _settings).classes.active);
        __classPrivateFieldGet(this, _states).activeNavItem = firstLinkItem;
        firstCaptionItem.classList.add(__classPrivateFieldGet(this, _settings).classes.active);
        __classPrivateFieldGet(this, _states).activeCaptionItem = firstCaptionItem;
        firstImageItem.classList.add(__classPrivateFieldGet(this, _settings).classes.active);
        __classPrivateFieldGet(this, _states).activeImageItem = firstImageItem;
        this._calcPos();
        this._startTimer();
    }
    _resizeHandler() {
        this._calcPos();
    }
    _calcPos() {
        var _a, _b;
        let maxContentHeight = 0;
        let maxImageHeight = 0;
        const captionItems = (_a = __classPrivateFieldGet(this, _htmlElements).captionsWrapper) === null || _a === void 0 ? void 0 : _a.querySelectorAll(__classPrivateFieldGet(this, _settings).classSelections.item);
        for (const item of captionItems) {
            maxContentHeight = item.offsetHeight > maxContentHeight ? item.offsetHeight : maxContentHeight;
        }
        __classPrivateFieldGet(this, _htmlElements).captionsWrapper.style.height = `${maxContentHeight}px`;
        const imageItems = (_b = __classPrivateFieldGet(this, _htmlElements).imagesWrapper) === null || _b === void 0 ? void 0 : _b.querySelectorAll(__classPrivateFieldGet(this, _settings).classSelections.item);
        for (const item of imageItems) {
            maxImageHeight = item.offsetHeight > maxImageHeight ? item.offsetHeight : maxImageHeight;
        }
        __classPrivateFieldGet(this, _htmlElements).imagesWrapper.style.height = `${maxImageHeight}px`;
        if (600 <= window.innerWidth) { //
            const max = Math.max(maxImageHeight, maxContentHeight + __classPrivateFieldGet(this, _settings).navItemsContainerHeight);
            __classPrivateFieldGet(this, _htmlElements).container.style.height = `${max}px`;
        }
        else {
            __classPrivateFieldGet(this, _htmlElements).container.style.height = "unset"; // no need to set for this media
        }
    }
    _next() {
        this._stopTimer();
        this._goToSlide(this._nextNumber());
        this._startTimer();
    }
    _prev() {
        this._stopTimer();
        this._goToSlide(this._previousNumber());
        this._startTimer();
    }
    _goToSlide(id) {
        if (__classPrivateFieldGet(this, _states).activeSlideNr !== id &&
            false === __classPrivateFieldGet(this, _states).navIsRunning &&
            false === __classPrivateFieldGet(this, _states).imageIsRunning &&
            false === __classPrivateFieldGet(this, _states).captionIsRunning) {
            this._goToNav(id);
            this._goToContent(id);
            this._goToImage(id);
            __classPrivateFieldGet(this, _states).activeSlideNr = id;
        }
    }
    _goToNav(id) {
        var _a, _b;
        __classPrivateFieldGet(this, _states).navIsRunning = true;
        const newItem = (_a = __classPrivateFieldGet(this, _htmlElements).navItemsWrapper) === null || _a === void 0 ? void 0 : _a.querySelector(__classPrivateFieldGet(this, _settings).classSelections.item + this._selectItemById(id));
        (_b = __classPrivateFieldGet(this, _states).activeNavItem) === null || _b === void 0 ? void 0 : _b.classList.remove(__classPrivateFieldGet(this, _settings).classes.active);
        newItem === null || newItem === void 0 ? void 0 : newItem.classList.add(__classPrivateFieldGet(this, _settings).classes.active);
        __classPrivateFieldGet(this, _states).activeNavItem = newItem;
        __classPrivateFieldGet(this, _states).navIsRunning = false;
    }
    _goToContent(id) {
        var _a, _b, _c;
        __classPrivateFieldGet(this, _states).navIsRunning = true;
        const newItem = (_a = __classPrivateFieldGet(this, _htmlElements).captionsWrapper) === null || _a === void 0 ? void 0 : _a.querySelector(__classPrivateFieldGet(this, _settings).classSelections.item + this._selectItemById(id));
        newItem.animate(__classPrivateFieldGet(this, _animate).leftToRight, __classPrivateFieldGet(this, _animate).timing);
        (_b = __classPrivateFieldGet(this, _states).activeCaptionItem) === null || _b === void 0 ? void 0 : _b.animate(__classPrivateFieldGet(this, _animate).toLeft, __classPrivateFieldGet(this, _animate).timing);
        (_c = __classPrivateFieldGet(this, _states).activeCaptionItem) === null || _c === void 0 ? void 0 : _c.classList.remove(__classPrivateFieldGet(this, _settings).classes.active);
        newItem === null || newItem === void 0 ? void 0 : newItem.classList.add(__classPrivateFieldGet(this, _settings).classes.active);
        __classPrivateFieldGet(this, _states).activeCaptionItem = newItem;
        __classPrivateFieldGet(this, _states).navIsRunning = false;
    }
    _goToImage(id) {
        var _a, _b;
        __classPrivateFieldGet(this, _states).imageIsRunning = true;
        const newItem = (_a = __classPrivateFieldGet(this, _htmlElements).imagesWrapper) === null || _a === void 0 ? void 0 : _a.querySelector(__classPrivateFieldGet(this, _settings).classSelections.item + this._selectItemById(id));
        (_b = __classPrivateFieldGet(this, _states).activeImageItem) === null || _b === void 0 ? void 0 : _b.classList.remove(__classPrivateFieldGet(this, _settings).classes.active);
        newItem.classList.add(__classPrivateFieldGet(this, _settings).classes.active);
        __classPrivateFieldGet(this, _states).activeImageItem = newItem;
        __classPrivateFieldGet(this, _states).imageIsRunning = false;
    }
    // Utils
    _selectItemById(id) {
        return `[data-id = "${id}"]`;
    }
    _stopTimer() {
        if (__classPrivateFieldGet(this, _settings).autoplay) {
            clearTimeout(__classPrivateFieldGet(this, _states).currentTimerId);
        }
    }
    _startTimer() {
        if (__classPrivateFieldGet(this, _settings).autoplay) {
            clearTimeout(__classPrivateFieldGet(this, _states).currentTimerId);
            __classPrivateFieldGet(this, _states).currentTimerId = setTimeout(() => {
                this._goToSlide(this._nextNumber());
                this._startTimer();
            }, __classPrivateFieldGet(this, _settings).slideTime);
        }
    }
    _nextNumber() {
        var _a;
        if (__classPrivateFieldGet(this, _states).activeSlideNr + 1 >=
            ((_a = __classPrivateFieldGet(this, _htmlElements).imagesWrapper) === null || _a === void 0 ? void 0 : _a.querySelectorAll(__classPrivateFieldGet(this, _settings).classSelections.item)).length) {
            return 0;
        }
        else {
            return __classPrivateFieldGet(this, _states).activeSlideNr + 1;
        }
    }
    _previousNumber() {
        var _a;
        if (__classPrivateFieldGet(this, _states).activeSlideNr <= 0) {
            return ((_a = __classPrivateFieldGet(this, _htmlElements).imagesWrapper) === null || _a === void 0 ? void 0 : _a.querySelectorAll(__classPrivateFieldGet(this, _settings).classSelections.item)).length - 1;
        }
        else {
            return __classPrivateFieldGet(this, _states).activeSlideNr - 1;
        }
    }
}
_transition = new WeakMap(), _animate = new WeakMap(), _htmlElements = new WeakMap(), _settings = new WeakMap(), _states = new WeakMap();
