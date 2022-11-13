interface Window {
    spa: any,
  }

  enum Events {
    CLICK = 'click',
    SWIPE_DOWN = 'swipeDown',
    SWIPE_UP = 'swipeUp',
    SWIPE_LEFT = 'swipeLeft',
    SWIPE_RIGHT = 'swipeRight',
    KEYDOWN = 'keydown',
    ON_RESIZE = 'onResize',
    MOUSE_ENTER = 'mouseenter',
    MOUSE_LEAVE = 'mouseleave',
  }

  enum Arrow {
    LEFT = 'ArrowLeft',
    RIGHT = 'ArrowRight',
  }

  enum Transform {
    Default = 'transform',
    Webkit = '-webkit-transform',
    Moz = '-moz-transform',
    Ms = '-ms-transform',
    Opera = '-o-transform',
  }
  enum Translation {
    Left = "translateX(-100vw)",
    Viewport = "translateX(0)",
    Right = "translateX(100vw)",
  }
 
  class ResponsiveSlide {
    #transition: {
        right: any,
        left: any,
        viewport: any
    } = {
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
    }
    #animate: {
        timing: {
            duration: number,
            iterations: number
        },
        rightToLeft: Array<any>,
        leftToRight: Array<any>,
        toLeft: Array<any>,
        toRight: Array<any>,
    } = {
        timing: {
            duration: 300,
            iterations: 1,
        },
        rightToLeft: [
            this.#transition.right,
            this.#transition.viewport,
        ],
        leftToRight: [
            this.#transition.left,
            this.#transition.viewport,
        ],
        toLeft: [
            this.#transition.viewport,
            this.#transition.left,
        ],
        toRight: [
            this.#transition.viewport,
            this.#transition.right,
        ]
    }

    #htmlElements: {
      container?: HTMLDivElement | null
      imagesWrapper?: HTMLDivElement | null
      navItemsWrapper?: HTMLDivElement | null
      captionsWrapper?: HTMLDivElement | null
    } = {
      container: null,
      imagesWrapper: null,
      navItemsWrapper: null,
      captionsWrapper: null,
    }
  
    #settings = {
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
    }
  
    #states: {
        currentTimerId: number | undefined
        activeSlideNr: number
        navIsRunning: boolean
        activeNavItem: HTMLLIElement | null
        imageIsRunning: boolean
        activeImageItem: HTMLDivElement | null
        captionIsRunning: boolean
        activeCaptionItem: HTMLDivElement | null
    } = {
        currentTimerId: undefined,
        activeSlideNr: 0,
        navIsRunning: false,
        activeNavItem: null,
        imageIsRunning: false,
        activeImageItem: null,
        captionIsRunning: false,
        activeCaptionItem: null,
    }

  
    constructor(
      container: string,
      imagesWrapper: string,
      navItemsWrapper: string,
      captionsWrapper: string,
      items: string,
      item: string,
      image: string,
      circle: string,
      hasMoreItems: string,
      active: string,
      slideTime: number,
      transitionDuration: number,
      autoplay: boolean,
      pauseOnHover: boolean,
      navItemsContainerHeight: number,
    ) {
      this.#settings.ids.container = container
      this.#settings.classSelections.imagesWrapper = imagesWrapper
      this.#settings.classSelections.navItemsWrapper = navItemsWrapper
      this.#settings.classSelections.captionsWrapper = captionsWrapper
      this.#settings.classSelections.items = items
      this.#settings.classSelections.item = item
      this.#settings.classSelections.image = image
      this.#settings.classSelections.circle = circle
      this.#settings.classes.hasMoreItems = hasMoreItems
      this.#settings.classes.active = active
      this.#settings.slideTime = slideTime
      this.#animate.timing.duration = transitionDuration
      this.#settings.autoplay = autoplay
      this.#settings.pauseOnHover = pauseOnHover
      this.#settings.navItemsContainerHeight = navItemsContainerHeight
  
      this.#htmlElements.container = document.querySelector(
        this.#settings.ids.container
      )
  
      if (this.#htmlElements.container) {
        this.initHtmlElements()
        this.initEvent()
        this.init()
      }
    }
  
    private initHtmlElements() {
        this.#htmlElements.imagesWrapper = this.#htmlElements.container?.querySelector(
            this.#settings.classSelections.imagesWrapper
        )
        this.#htmlElements.navItemsWrapper = this.#htmlElements.container?.querySelector(
            this.#settings.classSelections.navItemsWrapper
        )
        this.#htmlElements.captionsWrapper = this.#htmlElements.container?.querySelector(
            this.#settings.classSelections.captionsWrapper
        )
    }

    private initEvent() {
        const linkItems = this.#htmlElements.navItemsWrapper?.querySelectorAll(this.#settings.classSelections.item) as NodeListOf<HTMLElement>

        for (const linkItem of linkItems) {
            linkItem.addEventListener(Events.CLICK, event => {
                this._stopTimer();
                this._goToSlide(parseInt((event.currentTarget as HTMLElement).dataset.id ?? ''));
                this._startTimer();
            });
        }

        window.spa.util.swipe.initModule(this.#htmlElements.container, Events.SWIPE_LEFT, () => {
            this._next();
        });
        window.spa.util.swipe.initModule(this.#htmlElements.container, Events.SWIPE_RIGHT, () => {
            this._prev();
        });
        window.document.addEventListener(Events.KEYDOWN, e => {
            if (e.key === Arrow.LEFT) {
                this._prev();
            } else if (e.key === Arrow.RIGHT) {
                this._next();
            }
        })

        window.addEventListener(Events.ON_RESIZE, () => {
            this._resizeHandler();
        });

        this.#htmlElements.container?.addEventListener(Events.MOUSE_ENTER, () => {
            if (this.#settings.autoplay && this.#settings.pauseOnHover) {
                this._stopTimer();   
            }
        })
        this.#htmlElements.container?.addEventListener(Events.MOUSE_LEAVE, () => {
            if (this.#settings.autoplay && this.#settings.pauseOnHover) {
                this._startTimer(); 
            }
        })
    }

    private init() {
        const firstLinkItem = this.#htmlElements.navItemsWrapper?.querySelector(
            this.#settings.classSelections.item + this._selectItemById(0)
        ) as HTMLLIElement;
        const firstCaptionItem = this.#htmlElements.captionsWrapper?.querySelector(
            this.#settings.classSelections.item + this._selectItemById(0)
        ) as HTMLDivElement;
        const firstImageItem = this.#htmlElements.imagesWrapper?.querySelector(
            this.#settings.classSelections.item + this._selectItemById(0)
        ) as HTMLDivElement;
        
        firstLinkItem?.classList.add(this.#settings.classes.active);
        this.#states.activeNavItem = firstLinkItem;
        
        firstCaptionItem.classList.add(this.#settings.classes.active);
        this.#states.activeCaptionItem = firstCaptionItem;
        
        firstImageItem.classList.add(this.#settings.classes.active);
        this.#states.activeImageItem = firstImageItem;

        this._calcPos();
        this._startTimer();
    }

    private _resizeHandler() {
        this._calcPos();
    }
    private _calcPos() {
        let maxContentHeight = 0;
        let maxImageHeight = 0;

        const captionItems = this.#htmlElements.captionsWrapper?.querySelectorAll(
            this.#settings.classSelections.item
        ) as NodeListOf<HTMLElement>
        for (const item of captionItems) {
            maxContentHeight = item.offsetHeight > maxContentHeight ? item.offsetHeight : maxContentHeight;
        }
        (this.#htmlElements.captionsWrapper as HTMLElement).style.height = `${maxContentHeight}px`;

        const imageItems = this.#htmlElements.imagesWrapper?.querySelectorAll(
            this.#settings.classSelections.item
        ) as NodeListOf<HTMLElement>
        for (const item of imageItems) {
            maxImageHeight = item.offsetHeight > maxImageHeight ? item.offsetHeight : maxImageHeight;
        }
        (this.#htmlElements.imagesWrapper as HTMLElement).style.height = `${maxImageHeight}px`;

        if (600 <= window.innerWidth) { //
            const max = Math.max(maxImageHeight, maxContentHeight + this.#settings.navItemsContainerHeight);
            (this.#htmlElements.container as HTMLElement).style.height = `${max}px`;
        } else {
            (this.#htmlElements.container as HTMLElement).style.height = "unset"; // no need to set for this media
        }
    }

    private _next() {
        this._stopTimer();
        this._goToSlide(this._nextNumber());
        this._startTimer();
    }
    private _prev() {
        this._stopTimer();
        this._goToSlide(this._previousNumber());
        this._startTimer();
    }

    private _goToSlide(id: number) {
        if (
            this.#states.activeSlideNr !== id &&
            false === this.#states.navIsRunning &&
            false === this.#states.imageIsRunning &&
            false === this.#states.captionIsRunning
        ) {
            this._goToNav(id);
            this._goToContent(id);
            this._goToImage(id);

            this.#states.activeSlideNr = id
        }
    }

    private _goToNav(id: number) {
        this.#states.navIsRunning = true;

        const newItem = this.#htmlElements.navItemsWrapper?.querySelector(
            this.#settings.classSelections.item + this._selectItemById(id)
        ) as HTMLLIElement;
        this.#states.activeNavItem?.classList.remove(this.#settings.classes.active);
        newItem?.classList.add(this.#settings.classes.active);
        this.#states.activeNavItem = newItem;

        this.#states.navIsRunning = false;
    }
    private _goToContent(id: number) {
        this.#states.navIsRunning = true;

        const newItem = this.#htmlElements.captionsWrapper?.querySelector(
            this.#settings.classSelections.item + this._selectItemById(id)
        ) as HTMLDivElement;

        newItem.animate(this.#animate.leftToRight, this.#animate.timing);
        this.#states.activeCaptionItem?.animate(this.#animate.toLeft, this.#animate.timing);

        this.#states.activeCaptionItem?.classList.remove(this.#settings.classes.active);
        newItem?.classList.add(this.#settings.classes.active);
        this.#states.activeCaptionItem = newItem;

        this.#states.navIsRunning = false;
    }
    private _goToImage(id: number) {
        this.#states.imageIsRunning = true;

        const newItem = this.#htmlElements.imagesWrapper?.querySelector(
            this.#settings.classSelections.item + this._selectItemById(id)
        ) as HTMLDivElement;

        this.#states.activeImageItem?.classList.remove(this.#settings.classes.active);
        newItem.classList.add(this.#settings.classes.active);
        this.#states.activeImageItem = newItem;

        this.#states.imageIsRunning = false;
    }

    // Utils
    private _selectItemById(id: number) {
        return `[data-id = "${id}"]`;
    }
    private _stopTimer() {
        if (this.#settings.autoplay) {
            clearTimeout(this.#states.currentTimerId);
        }
    }
    private _startTimer() {
        if (this.#settings.autoplay) {
            clearTimeout(this.#states.currentTimerId);
            this.#states.currentTimerId = setTimeout(() => {
                this._goToSlide(this._nextNumber());
                this._startTimer();
            }, this.#settings.slideTime);
        }
    }
    private _nextNumber() {
        if (
            this.#states.activeSlideNr + 1 >=
            (this.#htmlElements.imagesWrapper?.querySelectorAll(this.#settings.classSelections.item) as NodeList).length
        ) {
            return 0;
        } else {
            return this.#states.activeSlideNr + 1;
        }
    }
    private _previousNumber() {
        if (this.#states.activeSlideNr <= 0) {
            return (this.#htmlElements.imagesWrapper?.querySelectorAll(
                this.#settings.classSelections.item) as NodeList
            ).length - 1;
        } else {
            return this.#states.activeSlideNr - 1;
        }
    }
  }
  