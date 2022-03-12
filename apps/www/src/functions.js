/* eslint-disable */
const $ = jQuery.noConflict()

$.fn.inlineStyle = function (prop) {
  return this.prop('style')[$.camelCase(prop)]
}

$.fn.doOnce = function (func) {
  this.length && func.apply(this)
  return this
};

(function () {
  let lastTime = 0
  const vendors = ['ms', 'moz', 'webkit', 'o']
  for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[`${vendors[x]}RequestAnimationFrame`]
    window.cancelAnimationFrame = window[`${vendors[x]}CancelAnimationFrame`] ||
									window[`${vendors[x]}CancelRequestAnimationFrame`]
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
      const currTime = new Date().getTime()
      const timeToCall = Math.max(0, 16 - (currTime - lastTime))
      const id = window.setTimeout(() => { callback(currTime + timeToCall) },
			  timeToCall)
      lastTime = currTime + timeToCall
      return id
    }
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id)
    }
  }
}())

function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result
  return function () {
    context = this
    args = arguments
    timestamp = new Date()
    var later = function () {
      const last = (new Date()) - timestamp
      if (last < wait) {
        timeout = setTimeout(later, wait - last)
      } else {
        timeout = null
        if (!immediate) result = func.apply(context, args)
      }
    }
    const callNow = immediate && !timeout
    if (!timeout) {
      timeout = setTimeout(later, wait)
    }
    if (callNow) result = func.apply(context, args)
    return result
  }
}

let requesting = false

const killRequesting = debounce(() => {
  requesting = false
}, 100)

function onScrollSliderParallax() {
  if (!requesting) {
    requesting = true
    requestAnimationFrame(() => {
      SEMICOLON.slider.sliderParallax()
      SEMICOLON.slider.sliderElementsFade()
    })
  }
  killRequesting()
}

var SEMICOLON = SEMICOLON || {};

(function ($) {
  // USE STRICT

  SEMICOLON.initialize = {

    init() {
      SEMICOLON.initialize.responsiveClasses()
      SEMICOLON.initialize.stickyElements()
      SEMICOLON.initialize.lazyLoad()
      SEMICOLON.initialize.fullScreen()
      SEMICOLON.initialize.verticalMiddle()
      SEMICOLON.initialize.lightbox()
      SEMICOLON.initialize.resizeVideos()
      SEMICOLON.initialize.imageFade()
      SEMICOLON.initialize.pageTransition()
      SEMICOLON.initialize.dataResponsiveClasses()
      SEMICOLON.initialize.dataResponsiveHeights()
      SEMICOLON.initialize.stickFooterOnSmall()
      SEMICOLON.initialize.stickyFooter()

      $('.fslider').addClass('preloader2')
    },

    responsiveClasses() {
      if (typeof jRespond === 'undefined') {
        console.log('responsiveClasses: jRespond not Defined.')
        return true
      }

      const jRes = jRespond([
        {
          label: 'smallest',
          enter: 0,
          exit: 575,
        }, {
          label: 'handheld',
          enter: 576,
          exit: 767,
        }, {
          label: 'tablet',
          enter: 768,
          exit: 991,
        }, {
          label: 'laptop',
          enter: 992,
          exit: 1199,
        }, {
          label: 'desktop',
          enter: 1200,
          exit: 10000,
        },
      ])
      jRes.addFunc([
        {
          breakpoint: 'desktop',
          enter() { $body.addClass('device-xl') },
          exit() { $body.removeClass('device-xl') },
        }, {
          breakpoint: 'laptop',
          enter() { $body.addClass('device-lg') },
          exit() { $body.removeClass('device-lg') },
        }, {
          breakpoint: 'tablet',
          enter() { $body.addClass('device-md') },
          exit() { $body.removeClass('device-md') },
        }, {
          breakpoint: 'handheld',
          enter() { $body.addClass('device-sm') },
          exit() { $body.removeClass('device-sm') },
        }, {
          breakpoint: 'smallest',
          enter() { $body.addClass('device-xs') },
          exit() { $body.removeClass('device-xs') },
        },
      ])
    },

    verticalMiddle() {
      if ($verticalMiddleEl.length > 0) {
        $verticalMiddleEl.each(function () {
          const element = $(this)
          let verticalMiddleH = element.outerHeight()
          const headerHeight = $header.outerHeight()

          if (element.parents('#slider').length > 0 && !element.hasClass('ignore-header')) {
            if ($header.hasClass('transparent-header') && ($body.hasClass('device-xl') || $body.hasClass('device-lg'))) {
              verticalMiddleH -= 70
              if ($slider.next('#header').length > 0) { verticalMiddleH += headerHeight }
            }
          }

          if ($body.hasClass('device-sm') || $body.hasClass('device-xs')) {
            if (element.parents('.full-screen').length && !element.parents('.force-full-screen').length) {
              if (element.children('.col-padding').length > 0) {
                element.css({ position: 'relative', top: '0', width: 'auto', marginTop: '0' }).addClass('clearfix')
              } else {
                element.css({ position: 'relative', top: '0', width: 'auto', marginTop: '0', paddingTop: '60px', paddingBottom: '60px' }).addClass('clearfix')
              }
            } else {
              element.css({ position: 'absolute', top: '50%', width: '100%', paddingTop: '0', paddingBottom: '0', marginTop: `${-(verticalMiddleH / 2)}px` })
            }
          } else {
            element.css({ position: 'absolute', top: '50%', width: '100%', paddingTop: '0', paddingBottom: '0', marginTop: `${-(verticalMiddleH / 2)}px` })
          }
        })
      }
    },

    stickyElements() {
      if ($siStickyEl.length > 0) {
        const siStickyH = $siStickyEl.outerHeight()
        $siStickyEl.css({ marginTop: `${-(siStickyH / 2)}px` })
      }

      if ($dotsMenuEl.length > 0) {
        const opmdStickyH = $dotsMenuEl.outerHeight()
        $dotsMenuEl.css({ marginTop: `${-(opmdStickyH / 2)}px` })
      }
    },

    fullScreen() {
      if ($fullScreenEl.length > 0) {
        $fullScreenEl.each(function () {
          const element = $(this)
          let scrHeight = window.innerHeight ? window.innerHeight : $window.height()
          const negativeHeight = element.attr('data-negative-height')

          if (element.attr('id') == 'slider') {
            const sliderHeightOff = $slider.offset().top
            scrHeight -= sliderHeightOff
            if (element.find('.slider-parallax-inner').length > 0) {
              const transformVal = element.find('.slider-parallax-inner').css('transform')
              const transformX = transformVal.match(/-?[\d\.]+/g)
              if (!transformX) { var transformXvalue = 0 } else { var transformXvalue = transformX[5] }
              scrHeight = ((window.innerHeight ? window.innerHeight : $window.height()) + Number(transformXvalue)) - sliderHeightOff
            }
            if ($('#slider.with-header').next('#header:not(.transparent-header)').length > 0 && ($body.hasClass('device-xl') || $body.hasClass('device-lg'))) {
              const headerHeightOff = $header.outerHeight()
              scrHeight -= headerHeightOff
            }
          }
          if (element.parents('.full-screen').length > 0) { scrHeight = element.parents('.full-screen').height() }

          if ($body.hasClass('device-sm') || $body.hasClass('device-xs')) {
            if (!element.hasClass('force-full-screen')) { scrHeight = 'auto' }
          }

          if (negativeHeight) { scrHeight -= Number(negativeHeight) }

          element.css('height', scrHeight)
          if (element.attr('id') == 'slider' && !element.hasClass('canvas-slider-grid')) { if (element.has('.swiper-slide')) { element.find('.swiper-slide').css('height', scrHeight) } }
        })
      }
    },

    testimonialsGrid() {
      if ($testimonialsGridEl.length > 0) {
        if ($body.hasClass('device-md') || $body.hasClass('device-lg') || $body.hasClass('device-xl')) {
          let maxHeight = 0
          $testimonialsGridEl.each(function () {
            $(this).find('li > .testimonial').each(function () {
						   if ($(this).height() > maxHeight) { maxHeight = $(this).height() }
            })
            $(this).find('li').height(maxHeight)
            maxHeight = 0
          })
        } else {
          $testimonialsGridEl.find('li').css({ height: 'auto' })
        }
      }
    },

    lightbox() {
      console.warn('no lightbox here')
    },

    modal() {
      if (!$().magnificPopup) {
        console.log('modal: Magnific Popup not Defined.')
        return true
      }

      if (Cookies === 'undefined') {
        console.log('cookieNotify: Cookie Function not defined.')
        return true
      }

      const $modal = $('.modal-on-load:not(.customjs)')
      if ($modal.length > 0) {
        $modal.each(function () {
          const element				= $(this)
          const elementTarget		= element.attr('data-target')
          const elementTargetValue	= elementTarget.split('#')[1]
          let elementDelay		= element.attr('data-delay')
          const elementTimeout		= element.attr('data-timeout')
          const elementAnimateIn	= element.attr('data-animate-in')
          const elementAnimateOut	= element.attr('data-animate-out')

          if (!element.hasClass('enable-cookie')) { Cookies.remove(elementTargetValue) }

          if (element.hasClass('enable-cookie')) {
            const elementCookie = Cookies.get(elementTargetValue)

            if (typeof elementCookie !== 'undefined' && elementCookie == '0') {
              return true
            }
          }

          if (!elementDelay) {
            elementDelay = 1500
          } else {
            elementDelay = Number(elementDelay) + 1500
          }

          const t = setTimeout(() => {
            $.magnificPopup.open({
              items: { src: elementTarget },
              type: 'inline',
              mainClass: 'mfp-no-margins mfp-fade',
              closeBtnInside: false,
              fixedContentPos: true,
              removalDelay: 500,
              callbacks: {
                open() {
                  if (elementAnimateIn != '') {
                    $(elementTarget).addClass(`${elementAnimateIn} animated`)
                  }
                },
                beforeClose() {
                  if (elementAnimateOut != '') {
                    $(elementTarget).removeClass(elementAnimateIn).addClass(elementAnimateOut)
                  }
                },
                afterClose() {
                  if (elementAnimateIn != '' || elementAnimateOut != '') {
                    $(elementTarget).removeClass(`${elementAnimateIn} ${elementAnimateOut} animated`)
                  }
                  if (element.hasClass('enable-cookie')) {
                    Cookies.set(elementTargetValue, '0')
                  }
                },
              },
            }, 0)
          }, Number(elementDelay))

          if (elementTimeout != '') {
            const to = setTimeout(() => {
              $.magnificPopup.close()
            }, Number(elementDelay) + Number(elementTimeout))
          }
        })
      }
    },

    resizeVideos() {
      if (!$().fitVids) {
        console.log('resizeVideos: FitVids not Defined.')
        return true
      }

      $('#content,#footer,.slider-element:not(.revslider-wrap),.landing-offer-media,.portfolio-ajax-modal,.mega-menu-column').fitVids({
        customSelector: "iframe[src^='//www.dailymotion.com/embed'], iframe[src*='maps.google.com'], iframe[src*='google.com/maps'], iframe[src*='facebook.com/plugins/video']",
        ignore: '.no-fv',
      })
    },

    imageFade() {
      $('.image_fade').hover(function () {
        $(this).filter(':not(:animated)').animate({ opacity: 0.8 }, 400)
      }, function () {
        $(this).animate({ opacity: 1 }, 400)
      })
    },

    blogTimelineEntries() {
      $('.post-timeline.grid-2').find('.entry').each(function () {
        const position = $(this).inlineStyle('left')
        if (position == '0px') {
          $(this).removeClass('alt')
        } else {
          $(this).addClass('alt')
        }
        $(this).find('.entry-timeline').fadeIn()
      })

      $('.entry.entry-date-section').next().next().find('.entry-timeline').css({ top: '70px' })
    },

    pageTransition() {
      if ($body.hasClass('no-transition')) { return true }

      if (!$().animsition) {
        $body.addClass('no-transition')
        console.log('pageTransition: Animsition not Defined.')
        return true
      }

      window.onpageshow = function (event) {
        if (event.persisted) {
          window.location.reload()
        }
      }

      let animationIn = $body.attr('data-animation-in')
      let animationOut = $body.attr('data-animation-out')
      let durationIn = $body.attr('data-speed-in')
      let durationOut = $body.attr('data-speed-out')
      let timeOutActive = false
      let loaderTimeOut = $body.attr('data-loader-timeout')
      const loaderStyle = $body.attr('data-loader')
      const loaderColor = $body.attr('data-loader-color')
      let loaderHtml = $body.attr('data-loader-html')
      let loaderStyleHtml = ''
      const loaderBefore = '<div class="css3-spinner">'
      const loaderAfter = '</div>'
      let loaderBgStyle = ''
      let loaderBorderStyle = ''
      let loaderBgClass = ''
      let loaderBorderClass = ''
      let loaderBgClass2 = ''
      let loaderBorderClass2 = ''

      if (!animationIn) { animationIn = 'fadeIn' }
      if (!animationOut) { animationOut = 'fadeOut' }
      if (!durationIn) { durationIn = 1500 }
      if (!durationOut) { durationOut = 800 }
      if (!loaderHtml) { loaderStyleHtml = '<div class="css3-spinner-bounce1"></div><div class="css3-spinner-bounce2"></div><div class="css3-spinner-bounce3"></div>' }

      if (!loaderTimeOut) {
        timeOutActive = false
        loaderTimeOut = false
      } else {
        timeOutActive = true
        loaderTimeOut = Number(loaderTimeOut)
      }

      if (loaderColor) {
        if (loaderColor == 'theme') {
          loaderBgClass = ' bgcolor'
          loaderBorderClass = ' border-color'
          loaderBgClass2 = ' class="bgcolor"'
          loaderBorderClass2 = ' class="border-color"'
        } else {
          loaderBgStyle = ` style="background-color:${loaderColor};"`
          loaderBorderStyle = ` style="border-color:${loaderColor};"`
        }
        loaderStyleHtml = `<div class="css3-spinner-bounce1${loaderBgClass}"${loaderBgStyle}></div><div class="css3-spinner-bounce2${loaderBgClass}"${loaderBgStyle}></div><div class="css3-spinner-bounce3${loaderBgClass}"${loaderBgStyle}></div>`
      }

      if (loaderStyle == '2') {
        loaderStyleHtml = `<div class="css3-spinner-flipper${loaderBgClass}"${loaderBgStyle}></div>`
      } else if (loaderStyle == '3') {
        loaderStyleHtml = `<div class="css3-spinner-double-bounce1${loaderBgClass}"${loaderBgStyle}></div><div class="css3-spinner-double-bounce2${loaderBgClass}"${loaderBgStyle}></div>`
      } else if (loaderStyle == '4') {
        loaderStyleHtml = `<div class="css3-spinner-rect1${loaderBgClass}"${loaderBgStyle}></div><div class="css3-spinner-rect2${loaderBgClass}"${loaderBgStyle}></div><div class="css3-spinner-rect3${loaderBgClass}"${loaderBgStyle}></div><div class="css3-spinner-rect4${loaderBgClass}"${loaderBgStyle}></div><div class="css3-spinner-rect5${loaderBgClass}"${loaderBgStyle}></div>`
      } else if (loaderStyle == '5') {
        loaderStyleHtml = `<div class="css3-spinner-cube1${loaderBgClass}"${loaderBgStyle}></div><div class="css3-spinner-cube2${loaderBgClass}"${loaderBgStyle}></div>`
      } else if (loaderStyle == '6') {
        loaderStyleHtml = `<div class="css3-spinner-scaler${loaderBgClass}"${loaderBgStyle}></div>`
      } else if (loaderStyle == '7') {
        loaderStyleHtml = `<div class="css3-spinner-grid-pulse"><div${loaderBgClass2}${loaderBgStyle}></div><div${loaderBgClass2}${loaderBgStyle}></div><div${loaderBgClass2}${loaderBgStyle}></div><div${loaderBgClass2}${loaderBgStyle}></div><div${loaderBgClass2}${loaderBgStyle}></div><div${loaderBgClass2}${loaderBgStyle}></div><div${loaderBgClass2}${loaderBgStyle}></div><div${loaderBgClass2}${loaderBgStyle}></div><div${loaderBgClass2}${loaderBgStyle}></div></div>`
      } else if (loaderStyle == '8') {
        loaderStyleHtml = `<div class="css3-spinner-clip-rotate"><div${loaderBorderClass2}${loaderBorderStyle}></div></div>`
      } else if (loaderStyle == '9') {
        loaderStyleHtml = `<div class="css3-spinner-ball-rotate"><div${loaderBgClass2}${loaderBgStyle}></div><div${loaderBgClass2}${loaderBgStyle}></div><div${loaderBgClass2}${loaderBgStyle}></div></div>`
      } else if (loaderStyle == '10') {
        loaderStyleHtml = `<div class="css3-spinner-zig-zag"><div${loaderBgClass2}${loaderBgStyle}></div><div${loaderBgClass2}${loaderBgStyle}></div></div>`
      } else if (loaderStyle == '11') {
        loaderStyleHtml = `<div class="css3-spinner-triangle-path"><div${loaderBgClass2}${loaderBgStyle}></div><div${loaderBgClass2}${loaderBgStyle}></div><div${loaderBgClass2}${loaderBgStyle}></div></div>`
      } else if (loaderStyle == '12') {
        loaderStyleHtml = `<div class="css3-spinner-ball-scale-multiple"><div${loaderBgClass2}${loaderBgStyle}></div><div${loaderBgClass2}${loaderBgStyle}></div><div${loaderBgClass2}${loaderBgStyle}></div></div>`
      } else if (loaderStyle == '13') {
        loaderStyleHtml = `<div class="css3-spinner-ball-pulse-sync"><div${loaderBgClass2}${loaderBgStyle}></div><div${loaderBgClass2}${loaderBgStyle}></div><div${loaderBgClass2}${loaderBgStyle}></div></div>`
      } else if (loaderStyle == '14') {
        loaderStyleHtml = `<div class="css3-spinner-scale-ripple"><div${loaderBorderClass2}${loaderBorderStyle}></div><div${loaderBorderClass2}${loaderBorderStyle}></div><div${loaderBorderClass2}${loaderBorderStyle}></div></div>`
      }

      if (!loaderHtml) {
        loaderHtml = loaderStyleHtml
      }

      loaderHtml = loaderBefore + loaderHtml + loaderAfter

      $wrapper.css({ opacity: 1 })

      $wrapper.animsition({
        inClass: animationIn,
        outClass: animationOut,
        inDuration: Number(durationIn),
        outDuration: Number(durationOut),
        linkElement: 'body:not(.device-md):not(.device-sm):not(.device-xs) #primary-menu:not(.on-click) ul li a:not([target="_blank"]):not([href*="#"]):not([data-lightbox]):not([href^="mailto"]):not([href^="tel"]):not([href^="sms"]):not([href^="call"])',
        loading: true,
        loadingParentElement: 'body',
        loadingClass: 'page-transition-wrap',
        loadingInner: loaderHtml,
        timeout: timeOutActive,
        timeoutCountdown: loaderTimeOut,
        onLoadEvent: true,
        browser: ['animation-duration', '-webkit-animation-duration'],
        overlay: false,
        overlayClass: 'animsition-overlay-slide',
        overlayParentElement: 'body',
      })
    },

    lazyLoad() {
      const lazyLoadEl = $('[data-lazyload]')

      if (!$().appear) {
        console.log('lazyLoad: Appear not Defined.')
        return true
      }

      if (lazyLoadEl.length > 0) {
        lazyLoadEl.each(function () {
          const element = $(this)
          const elementImg = element.attr('data-lazyload')

          element.attr('src', 'images/blank.svg').css({ background: 'url(images/preloader.gif) no-repeat center center #FFF' })

          element.appear(() => {
            element.css({ background: 'none' }).removeAttr('width').removeAttr('height').attr('src', elementImg)
          }, { accX: 0, accY: 120 }, 'easeInCubic')
        })
      }
    },

    topScrollOffset() {
      let topOffsetScroll = 0

      if (($body.hasClass('device-xl') || $body.hasClass('device-lg')) && !SEMICOLON.isMobile.any()) {
        if ($header.hasClass('sticky-header')) {
          if ($pagemenu.hasClass('dots-menu')) { topOffsetScroll = 100 } else { topOffsetScroll = 144 }
        } else if ($pagemenu.hasClass('dots-menu')) { topOffsetScroll = 140 } else { topOffsetScroll = 184 }

        if (!$pagemenu.length) {
          if ($header.hasClass('sticky-header')) { topOffsetScroll = 100 } else { topOffsetScroll = 140 }
        }
      } else {
        topOffsetScroll = 40
      }

      return topOffsetScroll
    },

    defineColumns(element) {
      let column = 4
      const xlCol = element.attr('data-xl-col')
      const lgCol = element.attr('data-lg-col')
      const mdCol = element.attr('data-md-col')
      const smCol = element.attr('data-sm-col')
      const xsCol = element.attr('data-xs-col')

      if (element.hasClass('portfolio-full')) {
        if (element.hasClass('portfolio-3')) column = 3
        else if (element.hasClass('portfolio-5')) column = 5
        else if (element.hasClass('portfolio-6')) column = 6
        else column = 4

        if ($body.hasClass('device-md') && (column == 4 || column == 5 || column == 6)) {
          column = 3
        } else if ($body.hasClass('device-sm') && (column == 3 || column == 4 || column == 5 || column == 6)) {
          column = 2
        } else if ($body.hasClass('device-xs')) {
          column = 1
        }
      } else if (element.hasClass('masonry-thumbs')) {
        if (element.hasClass('grid-2')) column = 2
        else if (element.hasClass('grid-3')) column = 3
        else if (element.hasClass('grid-5')) column = 5
        else if (element.hasClass('grid-6')) column = 6
        else column = 4
      }

      if ($body.hasClass('device-xl')) {
        if (xlCol) { column = Number(xlCol) }
      } else if ($body.hasClass('device-lg')) {
        if (lgCol) { column = Number(lgCol) }
      } else if ($body.hasClass('device-md')) {
        if (mdCol) { column = Number(mdCol) }
      } else if ($body.hasClass('device-sm')) {
        if (smCol) { column = Number(smCol) }
      } else if ($body.hasClass('device-xs')) {
        if (xsCol) { column = Number(xsCol) }
      }

      return column
    },

    setFullColumnWidth(element) {
      if (!$().isotope) {
        console.log('setFullColumnWidth: Isotope not Defined.')
        return true
      }

      element.css({ width: '' })

      if (element.hasClass('portfolio-full')) {
        var columns = SEMICOLON.initialize.defineColumns(element)
        var containerWidth = element.width()
        var postWidth = Math.floor(containerWidth / columns)
        if ($body.hasClass('device-xs')) { var deviceSmallest = 1 } else { var deviceSmallest = 0 }
        element.find('.portfolio-item').each(function (index) {
          if (deviceSmallest == 0 && $(this).hasClass('wide')) { var elementSize = (postWidth * 2) } else { var elementSize = postWidth }
          $(this).css({ width: `${elementSize}px` })
        })
      } else if (element.hasClass('masonry-thumbs')) {
        var columns = SEMICOLON.initialize.defineColumns(element)
        var containerWidth = element.innerWidth()

        if (containerWidth == windowWidth) {
          containerWidth = windowWidth * 1.005
          element.css({ width: `${containerWidth}px` })
        }

        var postWidth = (containerWidth / columns)

        postWidth = Math.floor(postWidth)

        if ((postWidth * columns) >= containerWidth) { element.css({ 'margin-right': '-1px' }) }

        element.children('a').css({ width: `${postWidth}px` })

        const firstElementWidth = element.find('a:eq(0)').outerWidth()

        element.isotope({
          masonry: {
            columnWidth: firstElementWidth,
          },
        })

        let bigImageNumbers = element.attr('data-big')
        if (bigImageNumbers) {
          bigImageNumbers = bigImageNumbers.split(',')
          let bigImageNumber = ''
          let bigi = ''
          for (bigi = 0; bigi < bigImageNumbers.length; bigi++) {
            bigImageNumber = Number(bigImageNumbers[bigi]) - 1
            element.find(`a:eq(${bigImageNumber})`).css({ width: `${firstElementWidth * 2}px` })
          }
          const t = setTimeout(() => {
            element.isotope('layout')
          }, 1000)
        }
      }
    },

    aspectResizer() {
      const $aspectResizerEl = $('.aspect-resizer')
      if ($aspectResizerEl.length > 0) {
        $aspectResizerEl.each(function () {
          const element = $(this)
          const elementW = element.inlineStyle('width')
          const elementH = element.inlineStyle('height')
          const elementPW = element.parent().innerWidth()
        })
      }
    },

    dataResponsiveClasses() {
      const $dataClassXs = $('[data-class-xs]')
      const $dataClassSm = $('[data-class-sm]')
      const $dataClassMd = $('[data-class-md]')
      const $dataClassLg = $('[data-class-lg]')
      const $dataClassXl = $('[data-class-xl]')

      if ($dataClassXs.length > 0) {
        $dataClassXs.each(function () {
          const element = $(this)
          const elementClass = element.attr('data-class-xs')
          const elementClassDelete = `${element.attr('data-class-sm')} ${element.attr('data-class-md')} ${element.attr('data-class-lg')} ${element.attr('data-class-xl')}`

          if ($body.hasClass('device-xs')) {
            element.removeClass(elementClassDelete)
            element.addClass(elementClass)
          }
        })
      }

      if ($dataClassSm.length > 0) {
        $dataClassSm.each(function () {
          const element = $(this)
          const elementClass = element.attr('data-class-sm')
          const elementClassDelete = `${element.attr('data-class-xs')} ${element.attr('data-class-md')} ${element.attr('data-class-lg')} ${element.attr('data-class-xl')}`

          if ($body.hasClass('device-sm')) {
            element.removeClass(elementClassDelete)
            element.addClass(elementClass)
          }
        })
      }

      if ($dataClassMd.length > 0) {
        $dataClassMd.each(function () {
          const element = $(this)
          const elementClass = element.attr('data-class-md')
          const elementClassDelete = `${element.attr('data-class-xs')} ${element.attr('data-class-sm')} ${element.attr('data-class-lg')} ${element.attr('data-class-xl')}`

          if ($body.hasClass('device-md')) {
            element.removeClass(elementClassDelete)
            element.addClass(elementClass)
          }
        })
      }

      if ($dataClassLg.length > 0) {
        $dataClassLg.each(function () {
          const element = $(this)
          const elementClass = element.attr('data-class-lg')
          const elementClassDelete = `${element.attr('data-class-xs')} ${element.attr('data-class-sm')} ${element.attr('data-class-md')} ${element.attr('data-class-xl')}`

          if ($body.hasClass('device-lg')) {
            element.removeClass(elementClassDelete)
            element.addClass(elementClass)
          }
        })
      }

      if ($dataClassXl.length > 0) {
        $dataClassXl.each(function () {
          const element = $(this)
          const elementClass = element.attr('data-class-xl')
          const elementClassDelete = `${element.attr('data-class-xs')} ${element.attr('data-class-sm')} ${element.attr('data-class-md')} ${element.attr('data-class-lg')}`

          if ($body.hasClass('device-xl')) {
            element.removeClass(elementClassDelete)
            element.addClass(elementClass)
          }
        })
      }
    },

    dataResponsiveHeights() {
      const $dataHeightXs = $('[data-height-xs]')
      const $dataHeightSm = $('[data-height-sm]')
      const $dataHeightMd = $('[data-height-md]')
      const $dataHeightLg = $('[data-height-lg]')
      const $dataHeightXl = $('[data-height-xl]')

      if ($dataHeightXs.length > 0) {
        $dataHeightXs.each(function () {
          const element = $(this)
          const elementHeight = element.attr('data-height-xs')

          if ($body.hasClass('device-xs')) {
            if (elementHeight != '') { element.css('height', elementHeight) }
          }
        })
      }

      if ($dataHeightSm.length > 0) {
        $dataHeightSm.each(function () {
          const element = $(this)
          const elementHeight = element.attr('data-height-sm')

          if ($body.hasClass('device-sm')) {
            if (elementHeight != '') { element.css('height', elementHeight) }
          }
        })
      }

      if ($dataHeightMd.length > 0) {
        $dataHeightMd.each(function () {
          const element = $(this)
          const elementHeight = element.attr('data-height-md')

          if ($body.hasClass('device-md')) {
            if (elementHeight != '') { element.css('height', elementHeight) }
          }
        })
      }

      if ($dataHeightLg.length > 0) {
        $dataHeightLg.each(function () {
          const element = $(this)
          const elementHeight = element.attr('data-height-lg')

          if ($body.hasClass('device-lg')) {
            if (elementHeight != '') { element.css('height', elementHeight) }
          }
        })
      }

      if ($dataHeightXl.length > 0) {
        $dataHeightXl.each(function () {
          const element = $(this)
          const elementHeight = element.attr('data-height-xl')

          if ($body.hasClass('device-xl')) {
            if (elementHeight != '') { element.css('height', elementHeight) }
          }
        })
      }
    },

    stickFooterOnSmall() {
      $footer.css({ 'margin-top': '' })
      const windowH = $window.height()
      const wrapperH = $wrapper.height()

      if (!$body.hasClass('sticky-footer') && $footer.length > 0 && $wrapper.has('#footer')) {
        if (windowH > wrapperH) {
          $footer.css({ 'margin-top': (windowH - wrapperH) })
        }
      }
    },

    stickyFooter() {
      if ($body.hasClass('sticky-footer') && $footer.length > 0 && ($body.hasClass('device-xl') || $body.hasClass('device-lg'))) {
        const stickyFooter = $footer.outerHeight()
        $content.css({ 'margin-bottom': stickyFooter })
      } else {
        $content.css({ 'margin-bottom': 0 })
      }
    },

  }

  SEMICOLON.header = {

    init() {
      SEMICOLON.header.superfish()
      SEMICOLON.header.menufunctions()
      SEMICOLON.header.fullWidthMenu()
      SEMICOLON.header.overlayMenu()
      SEMICOLON.header.stickyMenu()
      SEMICOLON.header.stickyPageMenu()
      SEMICOLON.header.sideHeader()
      SEMICOLON.header.sidePanel()
      SEMICOLON.header.onePageScroll()
      SEMICOLON.header.onepageScroller()
      SEMICOLON.header.logo()
      SEMICOLON.header.topsearch()
      SEMICOLON.header.topcart()
    },

    superfish() {
      if ($body.hasClass('device-xl') || $body.hasClass('device-lg')) {
        $primaryMenu.find('ul ul, ul .mega-menu-content').css('display', 'block')
        SEMICOLON.header.menuInvert()
        $primaryMenu.find('ul ul, ul .mega-menu-content').css('display', '')

        if (!$().superfish) {
          $body.addClass('no-superfish')
          console.log('superfish: Superfish not Defined.')
          return true
        }

        $('body:not(.side-header) #primary-menu:not(.on-click) > ul, body:not(.side-header) #primary-menu:not(.on-click) > div > ul:not(.dropdown-menu), .top-links:not(.on-click) > ul').superfish({
          popUpSelector: 'ul,.mega-menu-content,.top-link-section',
          delay: 250,
          speed: 350,
          animation: { opacity: 'show' },
          animationOut: { opacity: 'hide' },
          cssArrows: false,
          onShow() {
            const megaMenuContent = $(this)
            if (megaMenuContent.find('.owl-carousel.customjs').length > 0) {
              megaMenuContent.find('.owl-carousel').removeClass('customjs')
              SEMICOLON.widget.carousel()
            }
            if (megaMenuContent.find('.grid-container').length > 0) {
              megaMenuContent.find('.grid-container').isotope('layout')
            }
          },
        })

        $('body.side-header #primary-menu:not(.on-click) > ul').superfish({
          popUpSelector: 'ul',
          delay: 250,
          speed: 350,
          animation: { opacity: 'show', height: 'show' },
          animationOut: { opacity: 'hide', height: 'hide' },
          cssArrows: false,
        })
      }
    },

    menuInvert() {
      $primaryMenu.find('.mega-menu-content, ul ul').each((index, element) => {
        const $menuChildElement = $(element)
        const menuChildOffset = $menuChildElement.offset()
        const menuChildWidth = $menuChildElement.width()
        const menuChildLeft = menuChildOffset.left

        if (windowWidth - (menuChildWidth + menuChildLeft) < 0) {
          $menuChildElement.addClass('menu-pos-invert')
        }
      })
    },

    menufunctions() {
      $primaryMenu.find('ul li:has(ul)').addClass('sub-menu')
      $('.top-links ul li:has(ul) > a, #primary-menu.with-arrows > ul > li:has(ul) > a > div, #primary-menu.with-arrows > div > ul > li:has(ul) > a > div, #page-menu nav ul li:has(ul) > a > div').append('<i class="icon-angle-down"></i>')
      $('.top-links > ul').addClass('clearfix')

      if ($body.hasClass('device-xl') || $body.hasClass('device-lg')) {
        $('#primary-menu.sub-title > ul > li').hover(function () {
          $(this).prev().css({ backgroundImage: 'none' })
        }, function () {
          $(this).prev().css({ backgroundImage: 'url("images/icons/menu-divider.png")' })
        })

        $('#primary-menu.sub-title').children('ul').children('.current').prev().css({ backgroundImage: 'none' })
      }

      if ($primaryMenu.hasClass('on-click') || ($body.hasClass('device-md') || $body.hasClass('device-sm') || $body.hasClass('device-xs'))) {
        $primaryMenu.find('li:has(ul) > a').on('click touchend', function (e) {
          $(this).parents('.sub-menu').siblings().find('ul,.mega-menu-content').removeClass('d-block')
          $(this).parent('li').children('ul,.mega-menu-content').toggleClass('d-block')
          e.preventDefault()
        })
      }

      if ($('.top-links').hasClass('on-click') || ($body.hasClass('device-md') || $body.hasClass('device-sm') || $body.hasClass('device-xs'))) {
        $('.top-links li:has(ul,.top-link-section) > a').on('click touchend', function (e) {
          $(this).parents('li').siblings().find('ul,.top-link-section').removeClass('d-block')
          $(this).parent('li').children('ul,.top-link-section').toggleClass('d-block')
          e.preventDefault()
        })
      }
    },

    fullWidthMenu() {
      if ($body.hasClass('stretched')) {
        if ($header.find('.container-fullwidth').length > 0) { $('.mega-menu .mega-menu-content').css({ width: $wrapper.width() - 120 }) }
        if ($header.hasClass('full-header')) { $('.mega-menu .mega-menu-content').css({ width: $wrapper.width() - 60 }) }
      } else {
        if ($header.find('.container-fullwidth').length > 0) { $('.mega-menu .mega-menu-content').css({ width: $wrapper.width() - 120 }) }
        if ($header.hasClass('full-header')) { $('.mega-menu .mega-menu-content').css({ width: $wrapper.width() - 80 }) }
      }
    },

    overlayMenu() {
      if ($body.hasClass('overlay-menu')) {
        const overlayMenuItem = $primaryMenu.children('ul').children('li')
        const overlayMenuItemHeight = overlayMenuItem.outerHeight()
        const overlayMenuItemTHeight = overlayMenuItem.length * overlayMenuItemHeight
        const firstItemOffset = ($window.height() - overlayMenuItemTHeight) / 2

        $primaryMenu.children('ul').children('li:first-child').css({ 'margin-top': `${firstItemOffset}px` })
      }
    },

    stickyMenu(headerOffset) {
      if ($window.scrollTop() > headerOffset) {
        if ($body.hasClass('device-xl') || $body.hasClass('device-lg')) {
          $header.addClass('sticky-header')
          if (!$headerWrap.hasClass('force-not-dark')) { $headerWrap.removeClass('not-dark') }
          SEMICOLON.header.stickyMenuClass()
        } else if ($body.hasClass('device-sm') || $body.hasClass('device-xs') || $body.hasClass('device-md')) {
          if ($body.hasClass('sticky-responsive-menu')) {
            $header.addClass('responsive-sticky-header')
            SEMICOLON.header.stickyMenuClass()
          }
        }
      } else {
        SEMICOLON.header.removeStickyness()
      }
    },

    stickyPageMenu(pageMenuOffset) {
      if ($window.scrollTop() > pageMenuOffset) {
        if ($body.hasClass('device-xl') || $body.hasClass('device-lg')) {
          $('#page-menu:not(.dots-menu,.no-sticky)').addClass('sticky-page-menu')
        } else if ($body.hasClass('device-sm') || $body.hasClass('device-xs') || $body.hasClass('device-md')) {
          if ($body.hasClass('sticky-responsive-pagemenu')) {
            $('#page-menu:not(.dots-menu,.no-sticky)').addClass('sticky-page-menu')
          }
        }
      } else {
        $('#page-menu:not(.dots-menu,.no-sticky)').removeClass('sticky-page-menu')
      }
    },

    removeStickyness() {
      if ($header.hasClass('sticky-header')) {
        $('body:not(.side-header) #header:not(.no-sticky)').removeClass('sticky-header')
        $header.removeClass().addClass(oldHeaderClasses)
        $headerWrap.removeClass().addClass(oldHeaderWrapClasses)
        if (!$headerWrap.hasClass('force-not-dark')) { $headerWrap.removeClass('not-dark') }
        SEMICOLON.slider.swiperSliderMenu()
        SEMICOLON.slider.revolutionSliderMenu()
      }
      if ($header.hasClass('responsive-sticky-header')) {
        $('body.sticky-responsive-menu #header').removeClass('responsive-sticky-header')
      }
      if (($body.hasClass('device-sm') || $body.hasClass('device-xs') || $body.hasClass('device-md')) && (typeof responsiveMenuClasses === 'undefined')) {
        $header.removeClass().addClass(oldHeaderClasses)
        $headerWrap.removeClass().addClass(oldHeaderWrapClasses)
        if (!$headerWrap.hasClass('force-not-dark')) { $headerWrap.removeClass('not-dark') }
      }
    },

    sideHeader() {
      $('#header-trigger').off('click').on('click', () => {
        $('body.open-header').toggleClass('side-header-open')
        return false
      })
    },

    sidePanel() {
      $('.side-panel-trigger').off('click').on('click', () => {
        $body.toggleClass('side-panel-open')
        if ($body.hasClass('device-touch') && $body.hasClass('side-push-panel')) {
          $body.toggleClass('ohidden')
        }
        return false
      })
    },

    onePageScroll() {
      if ($onePageMenuEl.length > 0) {
        let onePageSpeed = $onePageMenuEl.attr('data-speed')
        const onePageOffset = $onePageMenuEl.attr('data-offset')
        let onePageEasing = $onePageMenuEl.attr('data-easing')

        if (!onePageSpeed) { onePageSpeed = 1000 }
        if (!onePageEasing) { onePageEasing = 'easeOutQuad' }

        $onePageMenuEl.find('a[data-href]').off('click').on('click', function () {
          const element = $(this)
          const divScrollToAnchor = element.attr('data-href')
          let divScrollSpeed = element.attr('data-speed')
          let divScrollOffset = element.attr('data-offset')
          let divScrollEasing = element.attr('data-easing')

          if ($(divScrollToAnchor).length > 0) {
            if (!onePageOffset) {
              var onePageOffsetG = SEMICOLON.initialize.topScrollOffset()
            } else {
              var onePageOffsetG = onePageOffset
            }

            if (!divScrollSpeed) { divScrollSpeed = onePageSpeed }
            if (!divScrollOffset) { divScrollOffset = onePageOffsetG }
            if (!divScrollEasing) { divScrollEasing = onePageEasing }

            if ($onePageMenuEl.hasClass('no-offset')) { divScrollOffset = 0 }

            onePageGlobalOffset = Number(divScrollOffset)

            $onePageMenuEl.find('li').removeClass('current')
            $onePageMenuEl.find(`a[data-href="${divScrollToAnchor}"]`).parent('li').addClass('current')

            if (windowWidth < 768 || $body.hasClass('overlay-menu')) {
              if ($primaryMenu.find('ul.mobile-primary-menu').length > 0) {
                $primaryMenu.find('ul.mobile-primary-menu, div > ul.mobile-primary-menu').toggleClass('d-block', false)
              } else {
                $primaryMenu.find('ul, div > ul').toggleClass('d-block', false)
              }
              $pagemenu.toggleClass('pagemenu-active', false)
              $body.toggleClass('primary-menu-open', false)
            }

            $('html,body').stop(true).animate({
              scrollTop: $(divScrollToAnchor).offset().top - Number(divScrollOffset),
            }, Number(divScrollSpeed), divScrollEasing)

            onePageGlobalOffset = Number(divScrollOffset)
          }

          return false
        })
      }
    },

    onepageScroller() {
      $onePageMenuEl.find('li').removeClass('current')
      $onePageMenuEl.find(`a[data-href="#${SEMICOLON.header.onePageCurrentSection()}"]`).parent('li').addClass('current')
    },

    onePageCurrentSection() {
      let currentOnePageSection = 'home'
      let headerHeight = $headerWrap.outerHeight()

      if ($body.hasClass('side-header')) { headerHeight = 0 }

      $pageSectionEl.each(function (index) {
        const h = $(this).offset().top
        const y = $window.scrollTop()

        const offsetScroll = headerHeight + onePageGlobalOffset

        if (y + offsetScroll >= h && y < h + $(this).height() && $(this).attr('id') != currentOnePageSection) {
          currentOnePageSection = $(this).attr('id')
        }
      })

      return currentOnePageSection
    },

    logo() {
      if (($header.hasClass('dark') || $body.hasClass('dark')) && !$headerWrap.hasClass('not-dark')) {
        if (defaultDarkLogo) { defaultLogo.find('img').attr('src', defaultDarkLogo) }
        if (retinaDarkLogo) { retinaLogo.find('img').attr('src', retinaDarkLogo) }
      } else {
        if (defaultLogoImg) { defaultLogo.find('img').attr('src', defaultLogoImg) }
        if (retinaLogoImg) { retinaLogo.find('img').attr('src', retinaLogoImg) }
      }
      if ($header.hasClass('sticky-header')) {
        if (defaultStickyLogo) { defaultLogo.find('img').attr('src', defaultStickyLogo) }
        if (retinaStickyLogo) { retinaLogo.find('img').attr('src', retinaStickyLogo) }
      }
      if ($body.hasClass('device-sm') || $body.hasClass('device-xs')) {
        if (defaultMobileLogo) { defaultLogo.find('img').attr('src', defaultMobileLogo) }
        if (retinaMobileLogo) { retinaLogo.find('img').attr('src', retinaMobileLogo) }
      }
    },

    stickyMenuClass() {
      if (stickyMenuClasses) { var newClassesArray = stickyMenuClasses.split(/ +/) } else { var newClassesArray = '' }
      const noOfNewClasses = newClassesArray.length

      if (noOfNewClasses > 0) {
        let i = 0
        for (i = 0; i < noOfNewClasses; i++) {
          if (newClassesArray[i] == 'not-dark') {
            $header.removeClass('dark')
            $headerWrap.addClass('not-dark')
          } else if (newClassesArray[i] == 'dark') {
            $headerWrap.removeClass('not-dark force-not-dark')
            if (!$header.hasClass(newClassesArray[i])) {
              $header.addClass(newClassesArray[i])
            }
          } else if (!$header.hasClass(newClassesArray[i])) {
            $header.addClass(newClassesArray[i])
          }
        }
      }
    },

    responsiveMenuClass() {
      if ($body.hasClass('device-sm') || $body.hasClass('device-xs') || $body.hasClass('device-md')) {
        if (responsiveMenuClasses) { var newClassesArray = responsiveMenuClasses.split(/ +/) } else { var newClassesArray = '' }
        const noOfNewClasses = newClassesArray.length

        if (noOfNewClasses > 0) {
          let i = 0
          for (i = 0; i < noOfNewClasses; i++) {
            if (newClassesArray[i] == 'not-dark') {
              $header.removeClass('dark')
              $headerWrap.addClass('not-dark')
            } else if (newClassesArray[i] == 'dark') {
              $headerWrap.removeClass('not-dark force-not-dark')
              if (!$header.hasClass(newClassesArray[i])) {
                $header.addClass(newClassesArray[i])
              }
            } else if (!$header.hasClass(newClassesArray[i])) {
              $header.addClass(newClassesArray[i])
            }
          }
        }
        SEMICOLON.header.logo()
      }
    },

    topsocial() {
      if ($topSocialEl.length > 0) {
        if ($body.hasClass('device-lg') || $body.hasClass('device-xl')) {
          $topSocialEl.show()
          $topSocialEl.find('a').css({ width: 40 })

          $topSocialEl.find('.ts-text').each(function () {
            const $clone = $(this).clone().css({ visibility: 'hidden', display: 'inline-block', 'font-size': '13px', 'font-weight': 'bold' }).appendTo($body)
            const cloneWidth = $clone.innerWidth() + 52
            $(this).parent('a').attr('data-hover-width', cloneWidth)
            $clone.remove()
          })

          $topSocialEl.find('a').hover(function () {
            if ($(this).find('.ts-text').length > 0) {
              $(this).css({ width: $(this).attr('data-hover-width') })
            }
          }, function () {
            $(this).css({ width: 40 })
          })
        } else {
          $topSocialEl.show()
          $topSocialEl.find('a').css({ width: 40 })

          $topSocialEl.find('a').each(function () {
            const topIconTitle = $(this).find('.ts-text').text()
            $(this).attr('title', topIconTitle)
          })

          $topSocialEl.find('a').hover(function () {
            $(this).css({ width: 40 })
          }, function () {
            $(this).css({ width: 40 })
          })

          if ($body.hasClass('device-xs')) {
            $topSocialEl.hide()
            $topSocialEl.slice(0, 8).show()
          }
        }
      }
    },

    topsearch() {
      $(document).on('click', (event) => {
        if (!$(event.target).closest('#top-search').length) { $body.toggleClass('top-search-open', false) }
        if (!$(event.target).closest('#top-cart').length) { $topCart.toggleClass('top-cart-open', false) }
        if (!$(event.target).closest('#page-menu').length) { $pagemenu.toggleClass('pagemenu-active', false) }
        if (!$(event.target).closest('#side-panel').length) { $body.toggleClass('side-panel-open', false) }
        if (!$(event.target).closest('#primary-menu').length) { $('#primary-menu.on-click > ul').find('.d-block').removeClass('d-block') }
        if (!$(event.target).closest('#primary-menu.mobile-menu-off-canvas > ul').length) { $('#primary-menu.mobile-menu-off-canvas > ul').toggleClass('d-block', false) }
        if (!$(event.target).closest('#primary-menu.mobile-menu-off-canvas > div > ul').length) { $('#primary-menu.mobile-menu-off-canvas > div > ul').toggleClass('d-block', false) }
      })

      $topSearchTrigger.off('click').on('click', (e) => {
        $body.toggleClass('top-search-open')
        $topCart.toggleClass('top-cart-open', false)
        $primaryMenu.find('ul, div > ul').toggleClass('d-block', false)
        $pagemenu.toggleClass('pagemenu-active', false)
        if ($body.hasClass('top-search-open')) {
          $topSearch.find('input').focus()
        }
        e.stopPropagation()
        e.preventDefault()
      })
    },

    topcart() {
      $('#top-cart-trigger').off('click').on('click', (e) => {
        $pagemenu.toggleClass('pagemenu-active', false)
        $topCart.toggleClass('top-cart-open')
        e.stopPropagation()
        e.preventDefault()
      })
    },

  }

  SEMICOLON.slider = {

    init() {
      SEMICOLON.slider.sliderParallaxDimensions()
      SEMICOLON.slider.sliderRun()
      SEMICOLON.slider.sliderParallax()
      SEMICOLON.slider.sliderElementsFade()
      SEMICOLON.slider.captionPosition()
    },

    sliderParallaxDimensions() {
      if ($sliderParallaxEl.find('.slider-parallax-inner').length < 1) { return true }

      if ($body.hasClass('device-xl') || $body.hasClass('device-lg') || $body.hasClass('device-md')) {
        let parallaxElHeight = $sliderParallaxEl.outerHeight()
        let parallaxElWidth = $sliderParallaxEl.outerWidth()

        if ($sliderParallaxEl.hasClass('revslider-wrap') || $sliderParallaxEl.find('.carousel-widget').length > 0) {
          parallaxElHeight = $sliderParallaxEl.find('.slider-parallax-inner').children().first().outerHeight()
          $sliderParallaxEl.height(parallaxElHeight)
        }

        $sliderParallaxEl.find('.slider-parallax-inner').height(parallaxElHeight)

        if ($body.hasClass('side-header')) {
          $sliderParallaxEl.find('.slider-parallax-inner').width(parallaxElWidth)
        }

        if (!$body.hasClass('stretched')) {
          parallaxElWidth = $wrapper.outerWidth()
          $sliderParallaxEl.find('.slider-parallax-inner').width(parallaxElWidth)
        }
      } else {
        $sliderParallaxEl.find('.slider-parallax-inner').css({ width: '', height: '' })
      }

      if (swiperSlider != '') { swiperSlider.update() }
    },

    sliderRun() {
      if (typeof Swiper === 'undefined') {
        console.log('sliderRun: Swiper not Defined.')
        return true
      }

      const $sliderEl = $sliderElement.filter(':not(.customjs)')

      $sliderEl.each(function () {
        if ($(this).hasClass('swiper_wrapper')) {
          if ($(this).find('.swiper-slide').length < 1) { return true }

          const element = $(this).filter('.swiper_wrapper')
          let elementDirection = element.attr('data-direction')
          let elementSpeed = element.attr('data-speed')
          let elementAutoPlay = element.attr('data-autoplay')
          let elementLoop = element.attr('data-loop')
          let elementEffect = element.attr('data-effect')
          let elementGrabCursor = element.attr('data-grab')
          const slideNumberTotal = element.find('.slide-number-total')
          const slideNumberCurrent = element.find('.slide-number-current')
          let sliderVideoAutoPlay = element.attr('data-video-autoplay')
          let sliderSettings = element.attr('data-settings')

          if (!elementSpeed) { elementSpeed = 300 }
          if (!elementDirection) { elementDirection = 'horizontal' }
          if (elementAutoPlay) { elementAutoPlay = Number(elementAutoPlay) } else { elementAutoPlay = 999999999 }
          if (elementLoop == 'true') { elementLoop = true } else { elementLoop = false }
          if (!elementEffect) { elementEffect = 'slide' }
          if (elementGrabCursor == 'false') { elementGrabCursor = false } else { elementGrabCursor = true }
          if (sliderVideoAutoPlay == 'false') { sliderVideoAutoPlay = false } else { sliderVideoAutoPlay = true }

          if (element.find('.swiper-pagination').length > 0) {
            var elementPagination = element.find('.swiper-pagination')
            var elementPaginationClickable = true
          } else {
            var elementPagination = ''
            var elementPaginationClickable = false
          }

          const elementNavNext = element.find('.slider-arrow-right')
          const elementNavPrev = element.find('.slider-arrow-left')
          const elementScollBar = element.find('.swiper-scrollbar')

          swiperSlider = new Swiper(element.find('.swiper-parent'), {
            direction: elementDirection,
            speed: Number(elementSpeed),
            autoplay: {
              delay: elementAutoPlay,
            },
            loop: elementLoop,
            effect: elementEffect,
            slidesPerView: 1,
            grabCursor: elementGrabCursor,
            pagination: {
              el: elementPagination,
              clickable: elementPaginationClickable,
            },
            navigation: {
              prevEl: elementNavPrev,
              nextEl: elementNavNext,
            },
            scrollbar: {
              el: elementScollBar,
            },
            on: {
              init(swiper) {
                SEMICOLON.slider.sliderParallaxDimensions()
                element.find('.yt-bg-player').attr('data-autoplay', 'false').removeClass('customjs')
                SEMICOLON.widget.youtubeBgVideo()
                $('.swiper-slide-active [data-animate]').each(function () {
                  const $toAnimateElement = $(this)
                  const toAnimateDelay = $toAnimateElement.attr('data-delay')
                  let toAnimateDelayTime = 0
                  if (toAnimateDelay) { toAnimateDelayTime = Number(toAnimateDelay) + 750 } else { toAnimateDelayTime = 750 }
                  if (!$toAnimateElement.hasClass('animated')) {
                    $toAnimateElement.addClass('not-animated')
                    const elementAnimation = $toAnimateElement.attr('data-animate')
                    setTimeout(() => {
                      $toAnimateElement.removeClass('not-animated').addClass(`${elementAnimation} animated`)
                    }, toAnimateDelayTime)
                  }
                })
                element.find('[data-animate]').each(function () {
                  const $toAnimateElement = $(this)
                  const elementAnimation = $toAnimateElement.attr('data-animate')
                  if ($toAnimateElement.parents('.swiper-slide').hasClass('swiper-slide-active')) { return true }
                  $toAnimateElement.removeClass('animated').removeClass(elementAnimation).addClass('not-animated')
                })
                SEMICOLON.slider.swiperSliderMenu()
              },
              transitionStart(swiper) {
                if (slideNumberCurrent.length > 0) {
                  if (elementLoop == true) {
                    slideNumberCurrent.html(Number(element.find('.swiper-slide.swiper-slide-active').attr('data-swiper-slide-index')) + 1)
                  } else {
                    slideNumberCurrent.html(swiperSlider.activeIndex + 1)
                  }
                }
                element.find('[data-animate]').each(function () {
                  const $toAnimateElement = $(this)
                  const elementAnimation = $toAnimateElement.attr('data-animate')
                  if ($toAnimateElement.parents('.swiper-slide').hasClass('swiper-slide-active')) { return true }
                  $toAnimateElement.removeClass('animated').removeClass(elementAnimation).addClass('not-animated')
                })
                SEMICOLON.slider.swiperSliderMenu()
              },
              transitionEnd(swiper) {
                element.find('.swiper-slide').each(function () {
                  const slideEl = $(this)
                  if (slideEl.find('video').length > 0 && sliderVideoAutoPlay == true) {
                    slideEl.find('video').get(0).pause()
                  }
                  if (slideEl.find('.yt-bg-player.mb_YTPlayer:not(.customjs)').length > 0) {
                    slideEl.find('.yt-bg-player.mb_YTPlayer:not(.customjs)').YTPPause()
                  }
                })
                element.find('.swiper-slide:not(".swiper-slide-active")').each(function () {
                  const slideEl = $(this)
                  if (slideEl.find('video').length > 0) {
                    if (slideEl.find('video').get(0).currentTime != 0) {
                      slideEl.find('video').get(0).currentTime = 0
                    }
                  }
                  if (slideEl.find('.yt-bg-player.mb_YTPlayer:not(.customjs)').length > 0) {
                    slideEl.find('.yt-bg-player.mb_YTPlayer:not(.customjs)').YTPSeekTo(slideEl.find('.yt-bg-player.mb_YTPlayer:not(.customjs)').attr('data-start'))
                  }
                })
                if (element.find('.swiper-slide.swiper-slide-active').find('video').length > 0 && sliderVideoAutoPlay == true) {
                  element.find('.swiper-slide.swiper-slide-active').find('video').get(0).play()
                }
                if (element.find('.swiper-slide.swiper-slide-active').find('.yt-bg-player.mb_YTPlayer:not(.customjs)').length > 0 && sliderVideoAutoPlay == true) {
                  element.find('.swiper-slide.swiper-slide-active').find('.yt-bg-player.mb_YTPlayer:not(.customjs)').YTPPlay()
                }

                element.find('.swiper-slide.swiper-slide-active [data-animate]').each(function () {
                  const $toAnimateElement = $(this)
                  const toAnimateDelay = $toAnimateElement.attr('data-delay')
                  let toAnimateDelayTime = 0
                  if (toAnimateDelay) { toAnimateDelayTime = Number(toAnimateDelay) + 300 } else { toAnimateDelayTime = 300 }
                  if (!$toAnimateElement.hasClass('animated')) {
                    $toAnimateElement.addClass('not-animated')
                    const elementAnimation = $toAnimateElement.attr('data-animate')
                    setTimeout(() => {
                      $toAnimateElement.removeClass('not-animated').addClass(`${elementAnimation} animated`)
                    }, toAnimateDelayTime)
                  }
                })
              },
            },
          })

          if (slideNumberCurrent.length > 0) {
            if (elementLoop == true) {
              slideNumberCurrent.html(swiperSlider.realIndex + 1)
            } else {
              slideNumberCurrent.html(swiperSlider.activeIndex + 1)
            }
          }

          if (slideNumberTotal.length > 0) {
            slideNumberTotal.html(element.find('.swiper-slide:not(.swiper-slide-duplicate)').length)
          }

          if (sliderSettings) {
            sliderSettings = eval(`(${sliderSettings})`)
            for (const prop in sliderSettings) {
              swiperSlider.params[prop] = sliderSettings[prop]
              swiperSlider.update()
            }
          }
        }
      })
    },

    sliderParallaxOffset() {
      let sliderParallaxOffsetTop = 0
      let headerHeight = $header.outerHeight()
      if ($body.hasClass('side-header') || $header.hasClass('transparent-header')) { headerHeight = 0 }
      if ($pageTitle.length > 0) {
        const pageTitleHeight = $pageTitle.outerHeight()
        sliderParallaxOffsetTop = pageTitleHeight + headerHeight
      } else {
        sliderParallaxOffsetTop = headerHeight
      }

      if ($slider.next('#header').length > 0) { sliderParallaxOffsetTop = 0 }

      return sliderParallaxOffsetTop
    },

    sliderParallax() {
      if ($sliderParallaxEl.length < 1) { return true }

      const parallaxOffsetTop = SEMICOLON.slider.sliderParallaxOffset()
      const parallaxElHeight = $sliderParallaxEl.outerHeight()

      if (($body.hasClass('device-xl') || $body.hasClass('device-lg')) && !SEMICOLON.isMobile.any()) {
        if ((parallaxElHeight + parallaxOffsetTop + 50) > $window.scrollTop()) {
          $sliderParallaxEl.addClass('slider-parallax-visible').removeClass('slider-parallax-invisible')
          if ($window.scrollTop() > parallaxOffsetTop) {
            if ($sliderParallaxEl.find('.slider-parallax-inner').length > 0) {
              var tranformAmount = (($window.scrollTop() - parallaxOffsetTop) * -0.4).toFixed(0)
              var tranformAmount2 = (($window.scrollTop() - parallaxOffsetTop) * -0.15).toFixed(0)
              $sliderParallaxEl.find('.slider-parallax-inner').css({ transform: `translateY(${tranformAmount}px)` })
              $('.slider-parallax .slider-caption,.ei-title').css({ transform: `translateY(${tranformAmount2}px)` })
            } else {
              var tranformAmount = (($window.scrollTop() - parallaxOffsetTop) / 1.5).toFixed(0)
              var tranformAmount2 = (($window.scrollTop() - parallaxOffsetTop) / 7).toFixed(0)
              $sliderParallaxEl.css({ transform: `translateY(${tranformAmount}px)` })
              $('.slider-parallax .slider-caption,.ei-title').css({ transform: `translateY(${-tranformAmount2}px)` })
            }
          } else if ($sliderParallaxEl.find('.slider-parallax-inner').length > 0) {
            $('.slider-parallax-inner,.slider-parallax .slider-caption,.ei-title').css({ transform: 'translateY(0px)' })
          } else {
            $('.slider-parallax,.slider-parallax .slider-caption,.ei-title').css({ transform: 'translateY(0px)' })
          }
        } else {
          $sliderParallaxEl.addClass('slider-parallax-invisible').removeClass('slider-parallax-visible')
        }
        if (requesting) {
          requestAnimationFrame(() => {
            SEMICOLON.slider.sliderParallax()
            SEMICOLON.slider.sliderElementsFade()
          })
        }
      } else if ($sliderParallaxEl.find('.slider-parallax-inner').length > 0) {
        $('.slider-parallax-inner,.slider-parallax .slider-caption,.ei-title').css({ transform: 'translateY(0px)' })
      } else {
        $('.slider-parallax,.slider-parallax .slider-caption,.ei-title').css({ transform: 'translateY(0px)' })
      }
    },

    sliderElementsFade() {
      if ($sliderParallaxEl.length > 0) {
        if (($body.hasClass('device-xl') || $body.hasClass('device-lg')) && !SEMICOLON.isMobile.any()) {
          const parallaxOffsetTop = SEMICOLON.slider.sliderParallaxOffset()
          const parallaxElHeight = $sliderParallaxEl.outerHeight()
          if ($slider.length > 0) {
            if ($header.hasClass('transparent-header') || $('body').hasClass('side-header')) { var tHeaderOffset = 100 } else { var tHeaderOffset = 0 }
            $sliderParallaxEl.find('.slider-arrow-left,.slider-arrow-right,.vertical-middle:not(.no-fade),.slider-caption,.ei-title,.camera_prev,.camera_next').css({ opacity: 1 - ((($window.scrollTop() - tHeaderOffset) * 1.85) / parallaxElHeight) })
          }
        } else {
          $sliderParallaxEl.find('.slider-arrow-left,.slider-arrow-right,.vertical-middle:not(.no-fade),.slider-caption,.ei-title,.camera_prev,.camera_next').css({ opacity: 1 })
        }
      }
    },

    captionPosition() {
      $sliderElement.find('.slider-caption:not(.custom-caption-pos)').each(function () {
        const scapHeight = $(this).outerHeight()
        const scapSliderHeight = $sliderElement.outerHeight()
        if ($(this).parents('#slider').prev('#header').hasClass('transparent-header') && ($body.hasClass('device-xl') || $body.hasClass('device-lg'))) {
          if ($(this).parents('#slider').prev('#header').hasClass('floating-header')) {
            $(this).css({ top: `${(scapSliderHeight + 160 - scapHeight) / 2}px` })
          } else {
            $(this).css({ top: `${(scapSliderHeight + 100 - scapHeight) / 2}px` })
          }
        } else {
          $(this).css({ top: `${(scapSliderHeight - scapHeight) / 2}px` })
        }
      })
    },

    swiperSliderMenu(onWinLoad) {
      onWinLoad = typeof onWinLoad !== 'undefined' ? onWinLoad : false
      if ($body.hasClass('device-xl') || $body.hasClass('device-lg') || ($header.hasClass('transparent-header-responsive') && !$body.hasClass('primary-menu-open'))) {
        const activeSlide = $slider.find('.swiper-slide.swiper-slide-active')
        SEMICOLON.slider.headerSchemeChanger(activeSlide, onWinLoad)
      }
    },

    revolutionSliderMenu(onWinLoad) {
      onWinLoad = typeof onWinLoad !== 'undefined' ? onWinLoad : false
      if ($body.hasClass('device-xl') || $body.hasClass('device-lg') || ($header.hasClass('transparent-header-responsive') && !$body.hasClass('primary-menu-open'))) {
        const activeSlide = $slider.find('.active-revslide')
        SEMICOLON.slider.headerSchemeChanger(activeSlide, onWinLoad)
      }
    },

    headerSchemeChanger(activeSlide, onWinLoad) {
      if (activeSlide.length > 0) {
        let darkExists = false
        if (activeSlide.hasClass('dark')) {
          if (oldHeaderClasses) { var oldClassesArray = oldHeaderClasses.split(/ +/) } else { var oldClassesArray = '' }
          const noOfOldClasses = oldClassesArray.length

          if (noOfOldClasses > 0) {
            let i = 0
            for (i = 0; i < noOfOldClasses; i++) {
              if (oldClassesArray[i] == 'dark' && onWinLoad == true) {
                darkExists = true
                break
              }
            }
          }
          $('#header.transparent-header:not(.sticky-header,.semi-transparent,.floating-header)').addClass('dark')
          if (!darkExists) {
            $('#header.transparent-header.sticky-header,#header.transparent-header.semi-transparent.sticky-header,#header.transparent-header.floating-header.sticky-header').removeClass('dark')
          }
          $headerWrap.removeClass('not-dark')
        } else if ($body.hasClass('dark')) {
          activeSlide.addClass('not-dark')
          $('#header.transparent-header:not(.semi-transparent,.floating-header)').removeClass('dark')
          $('#header.transparent-header:not(.sticky-header,.semi-transparent,.floating-header)').find('#header-wrap').addClass('not-dark')
        } else {
          $('#header.transparent-header:not(.semi-transparent,.floating-header)').removeClass('dark')
          $headerWrap.removeClass('not-dark')
        }
        if ($header.hasClass('sticky-header')) {
          SEMICOLON.header.stickyMenuClass()
        }
        SEMICOLON.header.logo()
      }
    },

    owlCaptionInit() {
      if ($owlCarouselEl.length > 0) {
        $owlCarouselEl.each(function () {
          const element = $(this)
          if (element.find('.owl-dot').length > 0) {
            element.addClass('with-carousel-dots')
          }
        })
      }
    },

  }

  SEMICOLON.widget = {

    init() {
      SEMICOLON.widget.animations()
      SEMICOLON.widget.youtubeBgVideo()
      SEMICOLON.widget.tabs()
      SEMICOLON.widget.tabsJustify()
      SEMICOLON.widget.tabsResponsive()
      SEMICOLON.widget.tabsResponsiveResize()
      SEMICOLON.widget.toggles()
      SEMICOLON.widget.accordions()
      SEMICOLON.widget.counter()
      SEMICOLON.widget.roundedSkill()
      SEMICOLON.widget.progress()
      SEMICOLON.widget.twitterFeed()
      SEMICOLON.widget.flickrFeed()
      SEMICOLON.widget.instagramPhotos('5834720953.1677ed0.a0a26ba4c90845f9a844d64c316bf77a', '8e000fefe3024b2ead6a50ff005bf036')
      SEMICOLON.widget.dribbbleShots('012d3d72d12f93e1d41a19195d7da2fc87e6b5afa48a184256e398eb793cfe56')
      SEMICOLON.widget.navTree()
      SEMICOLON.widget.textRotater()
      SEMICOLON.widget.carousel()
      SEMICOLON.widget.linkScroll()
      SEMICOLON.widget.ajaxForm()
      SEMICOLON.widget.subscription()
      SEMICOLON.widget.stickySidebar()
      SEMICOLON.widget.cookieNotify()
      SEMICOLON.widget.cartQuantity()
      SEMICOLON.widget.extras()
    },

    parallax() {
      if (typeof skrollr !== 'undefined' && $.isFunction(skrollr)) {
        console.log('parallax: skrollr not Defined.')
        return true
      }

      if ($parallaxEl.length > 0 || $parallaxPageTitleEl.length > 0 || $parallaxPortfolioEl.length > 0) {
        if (!SEMICOLON.isMobile.any()) {
          skrollr.init({ forceHeight: false })
        } else {
          $parallaxEl.addClass('mobile-parallax')
          $parallaxPageTitleEl.addClass('mobile-parallax')
          $parallaxPortfolioEl.addClass('mobile-parallax')
        }
      }
    },

    animations() {
      if (!$().appear) {
        console.log('animations: Appear not Defined.')
        return true
      }

      const $dataAnimateEl = $('[data-animate]')
      if ($dataAnimateEl.length > 0) {
        if ($body.hasClass('device-xl') || $body.hasClass('device-lg') || $body.hasClass('device-md')) {
          $dataAnimateEl.each(function () {
            const element = $(this)
            const animationOut = element.attr('data-animate-out')
            const animationDelay = element.attr('data-delay')
            const animationDelayOut = element.attr('data-delay-out')
            let animationDelayTime = 0
            let animationDelayOutTime = 3000

            if (element.parents('.fslider.no-thumbs-animate').length > 0) { return true }
            if (element.parents('.swiper-slide').length > 0) { return true }

            if (animationDelay) { animationDelayTime = Number(animationDelay) + 500 } else { animationDelayTime = 500 }
            if (animationOut && animationDelayOut) { animationDelayOutTime = Number(animationDelayOut) + animationDelayTime }

            if (!element.hasClass('animated')) {
              element.addClass('not-animated')
              const elementAnimation = element.attr('data-animate')
              element.appear(() => {
                setTimeout(() => {
                  element.removeClass('not-animated').addClass(`${elementAnimation} animated`)
                }, animationDelayTime)

                if (animationOut) {
                  setTimeout(() => {
                    element.removeClass(elementAnimation).addClass(animationOut)
                  }, animationDelayOutTime)
                }
              }, { accX: 0, accY: -120 }, 'easeInCubic')
            }
          })
        }
      }
    },

    loadFlexSlider() {
      if (!$().flexslider) {
        console.log('loadFlexSlider: FlexSlider not Defined.')
        return true
      }

      const $flexSliderEl = $('.fslider:not(.customjs)').find('.flexslider')
      if ($flexSliderEl.length > 0) {
        $flexSliderEl.each(function () {
          const $flexsSlider = $(this)
          let flexsAnimation = $flexsSlider.parent('.fslider').attr('data-animation')
          let flexsEasing = $flexsSlider.parent('.fslider').attr('data-easing')
          let flexsDirection = $flexsSlider.parent('.fslider').attr('data-direction')
          let flexsReverse = $flexsSlider.parent('.fslider').attr('data-reverse')
          let flexsSlideshow = $flexsSlider.parent('.fslider').attr('data-slideshow')
          let flexsPause = $flexsSlider.parent('.fslider').attr('data-pause')
          let flexsSpeed = $flexsSlider.parent('.fslider').attr('data-speed')
          let flexsVideo = $flexsSlider.parent('.fslider').attr('data-video')
          let flexsPagi = $flexsSlider.parent('.fslider').attr('data-pagi')
          let flexsArrows = $flexsSlider.parent('.fslider').attr('data-arrows')
          const flexsThumbs = $flexsSlider.parent('.fslider').attr('data-thumbs')
          let flexsHover = $flexsSlider.parent('.fslider').attr('data-hover')
          let flexsSheight = $flexsSlider.parent('.fslider').attr('data-smooth-height')
          let flexsTouch = $flexsSlider.parent('.fslider').attr('data-touch')
          let flexsUseCSS = false

          if (!flexsAnimation) { flexsAnimation = 'slide' }
          if (!flexsEasing || flexsEasing == 'swing') {
            flexsEasing = 'swing'
            flexsUseCSS = true
          }
          if (!flexsDirection) { flexsDirection = 'horizontal' }
          if (flexsReverse == 'true') { flexsReverse = true } else { flexsReverse = false }
          if (!flexsSlideshow) { flexsSlideshow = true } else { flexsSlideshow = false }
          if (!flexsPause) { flexsPause = 5000 }
          if (!flexsSpeed) { flexsSpeed = 600 }
          if (!flexsVideo) { flexsVideo = false }
          if (flexsSheight == 'false') { flexsSheight = false } else { flexsSheight = true }
          if (flexsDirection == 'vertical') { flexsSheight = false }
          if (flexsPagi == 'false') { flexsPagi = false } else { flexsPagi = true }
          if (flexsThumbs == 'true') { flexsPagi = 'thumbnails' } else { flexsPagi = flexsPagi }
          if (flexsArrows == 'false') { flexsArrows = false } else { flexsArrows = true }
          if (flexsHover == 'false') { flexsHover = false } else { flexsHover = true }
          if (flexsTouch == 'false') { flexsTouch = false } else { flexsTouch = true }

          $flexsSlider.flexslider({
            selector: '.slider-wrap > .slide',
            animation: flexsAnimation,
            easing: flexsEasing,
            direction: flexsDirection,
            reverse: flexsReverse,
            slideshow: flexsSlideshow,
            slideshowSpeed: Number(flexsPause),
            animationSpeed: Number(flexsSpeed),
            pauseOnHover: flexsHover,
            video: flexsVideo,
            controlNav: flexsPagi,
            directionNav: flexsArrows,
            smoothHeight: flexsSheight,
            useCSS: flexsUseCSS,
            touch: flexsTouch,
            start(slider) {
              SEMICOLON.widget.animations()
              SEMICOLON.initialize.verticalMiddle()
              slider.parent().removeClass('preloader2')
              const t = setTimeout(() => { $('.grid-container').isotope('layout') }, 1200)
              SEMICOLON.initialize.lightbox()
              $('.flex-prev').html('<i class="icon-angle-left"></i>')
              $('.flex-next').html('<i class="icon-angle-right"></i>')
              // SEMICOLON.portfolio.portfolioDescMargin()
            },
            after() {
              if ($('.grid-container').hasClass('portfolio-full')) {
                $('.grid-container.portfolio-full').isotope('layout')
                // SEMICOLON.portfolio.portfolioDescMargin()
              }
              if ($('.post-grid').hasClass('post-masonry-full')) {
                $('.post-grid.post-masonry-full').isotope('layout')
              }
            },
          })
        })
      }
    },

    html5Video() {
      const videoEl = $('.video-wrap:has(video)')
      if (videoEl.length > 0) {
        videoEl.each(function () {
          const element = $(this)
          const elementVideo = element.find('video')
          const divWidth = element.outerWidth()
          const divHeight = element.outerHeight()
          let videoWidth = ((16 * divHeight) / 9)
          let videoHeight = divHeight

          if (videoWidth < divWidth) {
            videoWidth = divWidth
            videoHeight = ((9 * divWidth) / 16)
          }

          elementVideo.css({ width: `${videoWidth}px`, height: `${videoHeight}px` })

          if (videoHeight > divHeight) {
            elementVideo.css({ left: '', top: `${-((videoHeight - divHeight) / 2)}px` })
          }

          if (videoWidth > divWidth) {
            elementVideo.css({ top: '', left: `${-((videoWidth - divWidth) / 2)}px` })
          }

          if (SEMICOLON.isMobile.any() && !element.hasClass('no-placeholder')) {
            const placeholderImg = elementVideo.attr('poster')

            if (placeholderImg != '') {
              element.append(`<div class="video-placeholder" style="background-image: url(${placeholderImg});"></div>`)
            }

            elementVideo.hide()
          }
        })
      }
    },

    youtubeBgVideo() {
      if (!$().YTPlayer) {
        console.log('youtubeBgVideo: YoutubeBG Plugin not Defined.')
        return true
      }

      const $youtubeBgPlayerEl = $('.yt-bg-player')
      if ($youtubeBgPlayerEl.hasClass('customjs')) { return true }

      if ($youtubeBgPlayerEl.length > 0) {
        $youtubeBgPlayerEl.each(function () {
          const element = $(this)
          const ytbgVideo = element.attr('data-video')
          let ytbgMute = element.attr('data-mute')
          let ytbgRatio = element.attr('data-ratio')
          let ytbgQuality = element.attr('data-quality')
          let ytbgOpacity = element.attr('data-opacity')
          let ytbgContainer = element.attr('data-container')
          let ytbgOptimize = element.attr('data-optimize')
          let ytbgLoop = element.attr('data-loop')
          let ytbgVolume = element.attr('data-volume')
          let ytbgStart = element.attr('data-start')
          let ytbgStop = element.attr('data-stop')
          let ytbgAutoPlay = element.attr('data-autoplay')
          let ytbgFullScreen = element.attr('data-fullscreen')

          if (ytbgMute == 'false') { ytbgMute = false } else { ytbgMute = true }
          if (!ytbgRatio) { ytbgRatio = '16/9' }
          if (!ytbgQuality) { ytbgQuality = 'hd720' }
          if (!ytbgOpacity) { ytbgOpacity = 1 }
          if (!ytbgContainer) { ytbgContainer = 'self' }
          if (ytbgOptimize == 'false') { ytbgOptimize = false } else { ytbgOptimize = true }
          if (ytbgLoop == 'false') { ytbgLoop = false } else { ytbgLoop = true }
          if (!ytbgVolume) { ytbgVolume = 1 }
          if (!ytbgStart) { ytbgStart = 0 }
          if (!ytbgStop) { ytbgStop = 0 }
          if (ytbgAutoPlay == 'false') { ytbgAutoPlay = false } else { ytbgAutoPlay = true }
          if (ytbgFullScreen == 'true') { ytbgFullScreen = true } else { ytbgFullScreen = false }

          element.YTPlayer({
            videoURL: ytbgVideo,
            mute: ytbgMute,
            ratio: ytbgRatio,
            quality: ytbgQuality,
            opacity: Number(ytbgOpacity),
            containment: ytbgContainer,
            optimizeDisplay: ytbgOptimize,
            loop: ytbgLoop,
            vol: Number(ytbgVolume),
            startAt: Number(ytbgStart),
            stopAt: Number(ytbgStop),
            autoPlay: ytbgAutoPlay,
            realfullscreen: ytbgFullScreen,
            showYTLogo: false,
            showControls: false,
          })
        })
      }
    },

    tabs() {
      if (!$().tabs) {
        console.log('tabs: Tabs not Defined.')
        return true
      }

      const $tabs = $('.tabs:not(.customjs)')
      if ($tabs.length > 0) {
        $tabs.each(function () {
          const element = $(this)
          let elementSpeed = element.attr('data-speed')
          let tabActive = element.attr('data-active')

          if (!elementSpeed) { elementSpeed = 400 }
          if (!tabActive) { tabActive = 0 } else { tabActive -= 1 }

          const windowHash = window.location.hash
          if (jQuery(windowHash).length > 0) {
            const windowHashText = windowHash.split('#')
            const tabItem = document.getElementById(windowHashText[1])
            tabActive = jQuery('.tab-content').index(tabItem)
          }

          element.tabs({
            active: Number(tabActive),
            show: {
              effect: 'fade',
              duration: Number(elementSpeed),
            },
          })
        })
      }
    },

    tabsJustify() {
      if (!$('body').hasClass('device-xs') && !$('body').hasClass('device-sm')) {
        const $tabsJustify = $('.tabs.tabs-justify')
        if ($tabsJustify.length > 0) {
          $tabsJustify.each(function () {
            const element = $(this)
            const elementTabs = element.find('.tab-nav > li')
            const elementTabsNo = elementTabs.length
            let elementContainer = 0
            let elementWidth = 0

            if (element.hasClass('tabs-bordered') || element.hasClass('tabs-bb')) {
              elementContainer = element.find('.tab-nav').outerWidth()
            } else if (element.find('tab-nav').hasClass('tab-nav2')) {
              elementContainer = element.find('.tab-nav').outerWidth() - (elementTabsNo * 10)
            } else {
              elementContainer = element.find('.tab-nav').outerWidth() - 30
            }

            elementWidth = Math.floor(elementContainer / elementTabsNo)
            elementTabs.css({ width: `${elementWidth}px` })
          })
        }
      } else { $('.tabs.tabs-justify').find('.tab-nav > li').css({ width: '' }) }
    },

    tabsResponsive() {
      if (!$().tabs) {
        console.log('tabs: Tabs not Defined.')
        return true
      }

      const $tabsResponsive = $('.tabs.tabs-responsive')
      if ($tabsResponsive.length < 1) { return true }

      $tabsResponsive.each(function () {
        const element = $(this)
        const elementNav = element.find('.tab-nav')
        const elementContent = element.find('.tab-container')

        elementNav.children('li').each(function () {
          const navEl = $(this)
          const navElAnchor = navEl.children('a')
          const navElTarget = navElAnchor.attr('href')
          const navElContent = navElAnchor.html()

          elementContent.find(navElTarget).before(`<div class="acctitle d-none"><i class="acc-closed icon-ok-circle"></i><i class="acc-open icon-remove-circle"></i>${navElContent}</div>`)
        })
      })
    },

    tabsResponsiveResize() {
      if (!$().tabs) {
        console.log('tabs: Tabs not Defined.')
        return true
      }

      const $tabsResponsive = $('.tabs.tabs-responsive')
      if ($tabsResponsive.length < 1) { return true }

      $tabsResponsive.each(function () {
        const element = $(this)
        const tabActive = element.tabs('option', 'active') + 1
        const elementAccStyle = element.attr('data-accordion-style')

        if ($('body').hasClass('device-sm') || $('body').hasClass('device-xs')) {
          element.find('.tab-nav').addClass('d-none')
          element.find('.tab-container').addClass(`accordion ${elementAccStyle} clearfix`).attr('data-active', tabActive)
          element.find('.tab-content').addClass('acc_content')
          element.find('.acctitle').removeClass('d-none')
          SEMICOLON.widget.accordions()
        } else if ($('body').hasClass('device-md') || $('body').hasClass('device-lg') || $('body').hasClass('device-xl')) {
          element.find('.tab-nav').removeClass('d-none')
          element.find('.tab-container').removeClass(`accordion ${elementAccStyle} clearfix`).attr('data-active', '')
          element.find('.tab-content').removeClass('acc_content')
          element.find('.acctitle').addClass('d-none')
          element.tabs('refresh')
        }
      })
    },

    toggles() {
      const $toggle = $('.toggle')
      if ($toggle.length > 0) {
        $toggle.each(function () {
          const element = $(this)
          const elementState = element.attr('data-state')

          if (elementState != 'open') {
            element.children('.togglec').hide()
          } else {
            element.children('.togglet').addClass('toggleta')
          }

          element.children('.togglet').off('click').on('click', function () {
            $(this).toggleClass('toggleta').next('.togglec').slideToggle(300)
            return true
          })
        })
      }
    },

    accordions() {
      const $accordionEl = $('.accordion')
      if ($accordionEl.length > 0) {
        $accordionEl.each(function () {
          const element = $(this)
          const elementState = element.attr('data-state')
          let accordionActive = element.attr('data-active')

          if (!accordionActive) { accordionActive = 0 } else { accordionActive -= 1 }

          element.find('.acc_content').hide()

          if (elementState != 'closed') {
            element.find(`.acctitle:eq(${Number(accordionActive)})`).addClass('acctitlec').next().show()
          }

          element.find('.acctitle').off('click').on('click', function () {
            if ($(this).next().is(':hidden')) {
              element.find('.acctitle').removeClass('acctitlec').next().slideUp('normal')
              const clickTarget = $(this)
              $(this).toggleClass('acctitlec').next().stop().slideDown('normal', () => {
                if (($body.hasClass('device-sm') || $body.hasClass('device-xs')) && element.hasClass('scroll-on-open')) {
                  $('html,body').stop(true).animate({
                    scrollTop: clickTarget.offset().top - (SEMICOLON.initialize.topScrollOffset() - 40),
                  }, 800, 'easeOutQuad')
                }
              })
            }
            return false
          })
        })
      }
    },

    counter() {
      if (!$().appear) {
        console.log('counter: Appear not Defined.')
        return true
      }

      if (!$().countTo) {
        console.log('counter: countTo not Defined.')
        return true
      }

      const $counterEl = $('.counter:not(.counter-instant)')
      if ($counterEl.length > 0) {
        $counterEl.each(function () {
          const element = $(this)
          let counterElementComma = $(this).find('span').attr('data-comma')
          if (!counterElementComma) { counterElementComma = false } else { counterElementComma = true }
          if ($body.hasClass('device-xl') || $body.hasClass('device-lg')) {
            element.appear(() => {
              SEMICOLON.widget.runCounter(element, counterElementComma)
            }, { accX: 0, accY: -120 }, 'easeInCubic')
          } else {
            SEMICOLON.widget.runCounter(element, counterElementComma)
          }
        })
      }
    },

    runCounter(counterElement, counterElementComma) {
      if (counterElementComma == true) {
        counterElement.find('span').countTo({
          formatter(value, options) {
            value = value.toFixed(options.decimals)
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            return value
          },
        })
      } else {
        counterElement.find('span').countTo()
      }
    },

    roundedSkill() {
      if (!$().appear) {
        console.log('roundedSkill: Appear not Defined.')
        return true
      }

      if (!$().easyPieChart) {
        console.log('roundedSkill: EasyPieChart not Defined.')
        return true
      }

      const $roundedSkillEl = $('.rounded-skill')
      if ($roundedSkillEl.length > 0) {
        $roundedSkillEl.each(function () {
          const element = $(this)

          let roundSkillSize = element.attr('data-size')
          let roundSkillSpeed = element.attr('data-speed')
          let roundSkillWidth = element.attr('data-width')
          let roundSkillColor = element.attr('data-color')
          let roundSkillTrackColor = element.attr('data-trackcolor')

          if (!roundSkillSize) { roundSkillSize = 140 }
          if (!roundSkillSpeed) { roundSkillSpeed = 2000 }
          if (!roundSkillWidth) { roundSkillWidth = 8 }
          if (!roundSkillColor) { roundSkillColor = '#0093BF' }
          if (!roundSkillTrackColor) { roundSkillTrackColor = 'rgba(0,0,0,0.04)' }

          const properties = { roundSkillSize, roundSkillSpeed, roundSkillWidth, roundSkillColor, roundSkillTrackColor }

          if ($body.hasClass('device-xl') || $body.hasClass('device-lg')) {
            element.css({ width: `${roundSkillSize}px`, height: `${roundSkillSize}px`, 'line-height': `${roundSkillSize}px` }).animate({ opacity: 0 }, 10)
            element.appear(() => {
              if (!element.hasClass('skills-animated')) {
                const t = setTimeout(() => { element.css({ opacity: 1 }) }, 100)
                SEMICOLON.widget.runRoundedSkills(element, properties)
                element.addClass('skills-animated')
              }
            }, { accX: 0, accY: -120 }, 'easeInCubic')
          } else {
            SEMICOLON.widget.runRoundedSkills(element, properties)
          }
        })
      }
    },

    runRoundedSkills(element, properties) {
      element.easyPieChart({
        size: Number(properties.roundSkillSize),
        animate: Number(properties.roundSkillSpeed),
        scaleColor: false,
        trackColor: properties.roundSkillTrackColor,
        lineWidth: Number(properties.roundSkillWidth),
        lineCap: 'square',
        barColor: properties.roundSkillColor,
      })
    },

    progress() {
      if (!$().appear) {
        console.log('progress: Appear not Defined.')
        return true
      }

      const $progressEl = $('.progress')
      if ($progressEl.length > 0) {
        $progressEl.each(function () {
          const element = $(this)
          const skillsBar = element.parent('li')
          const skillValue = skillsBar.attr('data-percent')

          if ($body.hasClass('device-xl') || $body.hasClass('device-lg')) {
            element.appear(() => {
              if (!skillsBar.hasClass('skills-animated')) {
                element.find('.counter-instant span').countTo()
                skillsBar.find('.progress').css({ width: `${skillValue}%` }).addClass('skills-animated')
              }
            }, { accX: 0, accY: -120 }, 'easeInCubic')
          } else {
            element.find('.counter-instant span').countTo()
            skillsBar.find('.progress').css({ width: `${skillValue}%` })
          }
        })
      }
    },

    twitterFeed() {
      if (typeof sm_format_twitter === 'undefined') {
        console.log('twitterFeed: sm_format_twitter() not Defined.')
        return true
      }

      if (typeof sm_format_twitter3 === 'undefined') {
        console.log('twitterFeed: sm_format_twitter3() not Defined.')
        return true
      }

      const $twitterFeedEl = $('.twitter-feed')
      if ($twitterFeedEl.length > 0) {
        $twitterFeedEl.each(function () {
          const element = $(this)
          let twitterFeedUser = element.attr('data-username')
          let twitterFeedCount = element.attr('data-count')
          let twitterFeedLoader = element.attr('data-loader')

          if (!twitterFeedUser) { twitterFeedUser = 'twitter' }
          if (!twitterFeedCount) { twitterFeedCount = 3 }
          if (!twitterFeedLoader) { twitterFeedLoader = 'include/twitter/tweets.php' }

          $.getJSON(`${twitterFeedLoader}?username=${twitterFeedUser}&count=${twitterFeedCount}`, (tweets) => {
            if (element.hasClass('fslider')) {
              element.find('.slider-wrap').html(sm_format_twitter3(tweets)).promise().done(() => {
                var timer = setInterval(() => {
                  if (element.find('.slide').length > 1) {
                    element.removeClass('customjs')
                    const t = setTimeout(() => { SEMICOLON.widget.loadFlexSlider() }, 500)
                    clearInterval(timer)
                  }
                }, 500)
              })
            } else {
              element.html(sm_format_twitter(tweets))
            }
          })
        })
      }
    },

    flickrFeed() {
      if (!$().jflickrfeed) {
        console.log('flickrFeed: jflickrfeed not Defined.')
        return true
      }

      const $flickrFeedEl = $('.flickr-feed')
      if ($flickrFeedEl.length > 0) {
        $flickrFeedEl.each(function () {
          const element = $(this)
          const flickrFeedID = element.attr('data-id')
          let flickrFeedCount = element.attr('data-count')
          const flickrFeedType = element.attr('data-type')
          let flickrFeedTypeGet = 'photos_public.gne'

          if (flickrFeedType == 'group') { flickrFeedTypeGet = 'groups_pool.gne' }
          if (!flickrFeedCount) { flickrFeedCount = 9 }

          element.jflickrfeed({
            feedapi: flickrFeedTypeGet,
            limit: Number(flickrFeedCount),
            qstrings: {
              id: flickrFeedID,
            },
            itemTemplate: '<a href="{{image_b}}" title="{{title}}" data-lightbox="gallery-item">' +
											'<img src="{{image_s}}" alt="{{title}}" />' +
									  '</a>',
          }, (data) => {
            SEMICOLON.initialize.lightbox()
          })
        })
      }
    },

    instagramPhotos(c_accessToken, c_clientID) {
      if (typeof Instafeed === 'undefined') {
        console.log('Instafeed not Defined.')
        return true
      }

      const $instagramPhotosEl = $('.instagram-photos')
      if ($instagramPhotosEl.length > 0) {
        $instagramPhotosEl.each(function () {
          const element = $(this)
          const instaGramTarget = element.attr('id')
          const instaGramUserId = element.attr('data-user')
          const instaGramTag = element.attr('data-tag')
          const instaGramLocation = element.attr('data-location')
          let instaGramCount = element.attr('data-count')
          const instaGramType = element.attr('data-type')
          let instaGramSortBy = element.attr('data-sortBy')
          let instaGramRes = element.attr('data-resolution')

          if (!instaGramCount) { instaGramCount = 9 }
          if (!instaGramSortBy) { instaGramSortBy = 'none' }
          if (!instaGramRes) { instaGramRes = 'thumbnail' }

          if (instaGramType == 'user') {
            var feed = new Instafeed({
              target: instaGramTarget,
              get: instaGramType,
              userId: Number(instaGramUserId),
              limit: Number(instaGramCount),
              sortBy: instaGramSortBy,
              resolution: instaGramRes,
              accessToken: c_accessToken,
              clientId: c_clientID,
            })
          } else if (instaGramType == 'tagged') {
            var feed = new Instafeed({
              target: instaGramTarget,
              get: instaGramType,
              tagName: instaGramTag,
              limit: Number(instaGramCount),
              sortBy: instaGramSortBy,
              resolution: instaGramRes,
              clientId: c_clientID,
            })
          } else if (instaGramType == 'location') {
            var feed = new Instafeed({
              target: instaGramTarget,
              get: instaGramType,
              locationId: Number(instaGramUserId),
              limit: Number(instaGramCount),
              sortBy: instaGramSortBy,
              resolution: instaGramRes,
              clientId: c_clientID,
            })
          } else {
            var feed = new Instafeed({
              target: instaGramTarget,
              get: 'popular',
              limit: Number(instaGramCount),
              sortBy: instaGramSortBy,
              resolution: instaGramRes,
              clientId: c_clientID,
            })
          }

          feed.run()
        })
      }
    },

    dribbbleShots(c_accessToken) {
      if (!$.jribbble) {
        console.log('dribbbleShots: Jribbble not Defined.')
        return true
      }

      if (!$().imagesLoaded) {
        console.log('dribbbleShots: imagesLoaded not Defined.')
        return true
      }

      const $dribbbleShotsEl = $('.dribbble-shots')
      if ($dribbbleShotsEl.length > 0) {
        $.jribbble.setToken(c_accessToken)

        $dribbbleShotsEl.each(function () {
          const element = $(this)
          const dribbbleUsername = element.attr('data-user')
          let dribbbleCount = element.attr('data-count')
          const dribbbleList = element.attr('data-list')
          const dribbbleType = element.attr('data-type')

          element.addClass('customjs')

          if (!dribbbleCount) { dribbbleCount = 9 }

          if (dribbbleType == 'user') {
            $.jribbble.users(dribbbleUsername).shots({
              sort: 'recent',
              page: 1,
              per_page: Number(dribbbleCount),
            }).then((res) => {
              const html = []
              res.forEach((shot) => {
                html.push(`<a href="${shot.html_url}" target="_blank">`)
                html.push(`<img src="${shot.images.teaser}" `)
                html.push(`alt="${shot.title}"></a>`)
              })
              element.html(html.join(''))

              element.imagesLoaded().done(() => {
                element.removeClass('customjs')
                SEMICOLON.widget.masonryThumbs()
              })
            })
          } else if (dribbbleType == 'list') {
            $.jribbble.shots(dribbbleList, {
              sort: 'recent',
              page: 1,
              per_page: Number(dribbbleCount),
            }).then((res) => {
              const html = []
              res.forEach((shot) => {
                html.push(`<a href="${shot.html_url}" target="_blank">`)
                html.push(`<img src="${shot.images.teaser}" `)
                html.push(`alt="${shot.title}"></a>`)
              })
              element.html(html.join(''))

              element.imagesLoaded().done(() => {
                element.removeClass('customjs')
                SEMICOLON.widget.masonryThumbs()
              })
            })
          }
        })
      }
    },

    navTree() {
      const $navTreeEl = $('.nav-tree')
      if ($navTreeEl.length > 0) {
        $navTreeEl.each(function () {
          const element = $(this)
          let elementSpeed = element.attr('data-speed')
          let elementEasing = element.attr('data-easing')

          if (!elementSpeed) { elementSpeed = 250 }
          if (!elementEasing) { elementEasing = 'swing' }

          element.find('ul li:has(ul)').addClass('sub-menu')
          element.find('ul li:has(ul) > a').append(' <i class="icon-angle-down"></i>')

          if (element.hasClass('on-hover')) {
            element.find('ul li:has(ul):not(.active)').hover(function (e) {
              $(this).children('ul').stop(true, true).slideDown(Number(elementSpeed), elementEasing)
            }, function () {
              $(this).children('ul').delay(250).slideUp(Number(elementSpeed), elementEasing)
            })
          } else {
            element.find('ul li:has(ul) > a').off('click').on('click', function (e) {
              const childElement = $(this)
              element.find('ul li').not(childElement.parents()).removeClass('active')
              childElement.parent().children('ul').slideToggle(Number(elementSpeed), elementEasing, function () {
                $(this).find('ul').hide()
                $(this).find('li.active').removeClass('active')
              })
              element.find('ul li > ul').not(childElement.parent().children('ul')).not(childElement.parents('ul')).slideUp(Number(elementSpeed), elementEasing)
              childElement.parent('li:has(ul)').toggleClass('active')
              e.preventDefault()
            })
          }
        })
      }
    },

    carousel() {
      if (!$().owlCarousel) {
        console.log('carousel: Owl Carousel not Defined.')
        return true
      }

      const $carousel = $('.carousel-widget:not(.customjs)')
      if ($carousel.length < 1) { return true }

      $carousel.each(function () {
        const element = $(this)
        let elementItems = element.attr('data-items')
        let elementItemsXl = element.attr('data-items-xl')
        let elementItemsLg = element.attr('data-items-lg')
        let elementItemsMd = element.attr('data-items-md')
        let elementItemsSm = element.attr('data-items-sm')
        let elementItemsXs = element.attr('data-items-xs')
        let elementLoop = element.attr('data-loop')
        let elementAutoPlay = element.attr('data-autoplay')
        let elementSpeed = element.attr('data-speed')
        let elementAnimateIn = element.attr('data-animate-in')
        let elementAnimateOut = element.attr('data-animate-out')
        let elementNav = element.attr('data-nav')
        let elementPagi = element.attr('data-pagi')
        let elementMargin = element.attr('data-margin')
        let elementStage = element.attr('data-stage-padding')
        let elementMerge = element.attr('data-merge')
        let elementStart = element.attr('data-start')
        let elementRewind = element.attr('data-rewind')
        let elementSlideBy = element.attr('data-slideby')
        let elementCenter = element.attr('data-center')
        let elementLazy = element.attr('data-lazyload')
        let elementVideo = element.attr('data-video')
        let elementRTL = element.attr('data-rtl')
        let elementAutoPlayTime = 5000
        let elementAutoPlayHoverPause = true

        if (!elementItems) { elementItems = 4 }
        if (!elementItemsXl) { elementItemsXl = Number(elementItems) }
        if (!elementItemsLg) { elementItemsLg = Number(elementItemsXl) }
        if (!elementItemsMd) { elementItemsMd = Number(elementItemsLg) }
        if (!elementItemsSm) { elementItemsSm = Number(elementItemsMd) }
        if (!elementItemsXs) { elementItemsXs = Number(elementItemsSm) }
        if (!elementSpeed) { elementSpeed = 250 }
        if (!elementMargin) { elementMargin = 20 }
        if (!elementStage) { elementStage = 0 }
        if (!elementStart) { elementStart = 0 }

        if (!elementSlideBy) { elementSlideBy = 1 }
        if (elementSlideBy == 'page') {
          elementSlideBy = 'page'
        } else {
          elementSlideBy = Number(elementSlideBy)
        }

        if (elementLoop == 'true') { elementLoop = true } else { elementLoop = false }
        if (!elementAutoPlay) {
          elementAutoPlay = false
          elementAutoPlayHoverPause = false
        } else {
          elementAutoPlayTime = Number(elementAutoPlay)
          elementAutoPlay = true
        }
        if (!elementAnimateIn) { elementAnimateIn = false }
        if (!elementAnimateOut) { elementAnimateOut = false }
        if (elementNav == 'false') { elementNav = false } else { elementNav = true }
        if (elementPagi == 'false') { elementPagi = false } else { elementPagi = true }
        if (elementRewind == 'true') { elementRewind = true } else { elementRewind = false }
        if (elementMerge == 'true') { elementMerge = true } else { elementMerge = false }
        if (elementCenter == 'true') { elementCenter = true } else { elementCenter = false }
        if (elementLazy == 'true') { elementLazy = true } else { elementLazy = false }
        if (elementVideo == 'true') { elementVideo = true } else { elementVideo = false }
        if (elementRTL == 'true' || $body.hasClass('rtl')) { elementRTL = true } else { elementRTL = false }

        element.owlCarousel({
          margin: Number(elementMargin),
          loop: elementLoop,
          stagePadding: Number(elementStage),
          merge: elementMerge,
          startPosition: Number(elementStart),
          rewind: elementRewind,
          slideBy: elementSlideBy,
          center: elementCenter,
          lazyLoad: elementLazy,
          nav: elementNav,
          navText: ['<i class="icon-angle-left"></i>', '<i class="icon-angle-right"></i>'],
          autoplay: elementAutoPlay,
          autoplayTimeout: elementAutoPlayTime,
          autoplayHoverPause: elementAutoPlayHoverPause,
          dots: elementPagi,
          smartSpeed: Number(elementSpeed),
          fluidSpeed: Number(elementSpeed),
          video: elementVideo,
          animateIn: elementAnimateIn,
          animateOut: elementAnimateOut,
          rtl: elementRTL,
          responsive: {
            0: { items: Number(elementItemsXs) },
            576: { items: Number(elementItemsSm) },
            768: { items: Number(elementItemsMd) },
            992: { items: Number(elementItemsLg) },
            1200: { items: Number(elementItemsXl) },
          },
          onInitialized() {
            SEMICOLON.slider.owlCaptionInit()
            SEMICOLON.slider.sliderParallaxDimensions()
            SEMICOLON.initialize.lightbox()
          },
        })
      })
    },

    masonryThumbs() {
      const $masonryThumbsEl = $('.masonry-thumbs:not(.customjs)')
      if ($masonryThumbsEl.length > 0) {
        $masonryThumbsEl.each(function () {
          const masonryItemContainer = $(this)
          SEMICOLON.widget.masonryThumbsArrange(masonryItemContainer)
        })
      }
    },

    masonryThumbsArrange(element) {
      if (!$().isotope) {
        console.log('masonryThumbsArrange: Isotope not Defined.')
        return true
      }

      SEMICOLON.initialize.setFullColumnWidth(element)
      element.isotope('layout')
    },

    notifications(element) {
      if (typeof toastr === 'undefined') {
        console.log('notifications: Toastr not Defined.')
        return true
      }

      toastr.remove()
      const notifyElement = $(element)
      let notifyPosition = notifyElement.attr('data-notify-position')
      const notifyType = notifyElement.attr('data-notify-type')
      let notifyMsg = notifyElement.attr('data-notify-msg')
      let notifyTimeout = notifyElement.attr('data-notify-timeout')
      let notifyCloseButton = notifyElement.attr('data-notify-close')

      if (!notifyPosition) { notifyPosition = 'toast-top-right' } else { notifyPosition = `toast-${notifyElement.attr('data-notify-position')}` }
      if (!notifyMsg) { notifyMsg = 'Please set a message!' }
      if (!notifyTimeout) { notifyTimeout = 5000 }
      if (notifyCloseButton == 'true') { notifyCloseButton = true } else { notifyCloseButton = false }

      toastr.options.positionClass = notifyPosition
      toastr.options.timeOut = Number(notifyTimeout)
      toastr.options.closeButton = notifyCloseButton
      toastr.options.closeHtml = '<button><i class="icon-remove"></i></button>'

      if (notifyType == 'warning') {
        toastr.warning(notifyMsg)
      } else if (notifyType == 'error') {
        toastr.error(notifyMsg)
      } else if (notifyType == 'success') {
        toastr.success(notifyMsg)
      } else {
        toastr.info(notifyMsg)
      }

      return false
    },

    textRotater() {
      if (!$().Morphext) {
        console.log('textRotater: Morphext not Defined.')
        return true
      }

      if ($textRotaterEl.length > 0) {
        $textRotaterEl.each(function () {
          const element = $(this)
          let trRotate = $(this).attr('data-rotate')
          let trSpeed = $(this).attr('data-speed')
          let trSeparator = $(this).attr('data-separator')

          if (!trRotate) { trRotate = 'fade' }
          if (!trSpeed) { trSpeed = 1200 }
          if (!trSeparator) { trSeparator = ',' }

          const tRotater = $(this).find('.t-rotate')

          const pluginData = tRotater.Morphext({
            animation: trRotate,
            separator: trSeparator,
            speed: Number(trSpeed),
          })
        })
      }
    },

    linkScroll() {
      $('a[data-scrollto]').off('click').on('click', function () {
        const element = $(this)
        const divScrollToAnchor = element.attr('data-scrollto')
        let divScrollSpeed = element.attr('data-speed')
        let divScrollOffset = element.attr('data-offset')
        let divScrollEasing = element.attr('data-easing')
        const divScrollHighlight = element.attr('data-highlight')

        if (element.parents('#primary-menu').hasClass('on-click')) { return true }

        if (!divScrollSpeed) { divScrollSpeed = 750 }
        if (!divScrollOffset) { divScrollOffset = SEMICOLON.initialize.topScrollOffset() }
        if (!divScrollEasing) { divScrollEasing = 'easeOutQuad' }

        $('html,body').stop(true).animate({
          scrollTop: $(divScrollToAnchor).offset().top - Number(divScrollOffset),
        }, Number(divScrollSpeed), divScrollEasing, () => {
          if (divScrollHighlight) {
            if ($(divScrollToAnchor).find('.highlight-me').length > 0) {
              $(divScrollToAnchor).find('.highlight-me').animate({ backgroundColor: divScrollHighlight }, 300)
              var t = setTimeout(() => { $(divScrollToAnchor).find('.highlight-me').animate({ backgroundColor: 'transparent' }, 300) }, 500)
            } else {
              $(divScrollToAnchor).animate({ backgroundColor: divScrollHighlight }, 300)
              var t = setTimeout(() => { $(divScrollToAnchor).animate({ backgroundColor: 'transparent' }, 300) }, 500)
            }
          }
        })

        return false
      })
    },

    ajaxForm() {
      if (!$().validate) {
        console.log('ajaxForm: Form Validate not Defined.')
        return true
      }

      if (!$().ajaxSubmit) {
        console.log('ajaxForm: jQuery Form not Defined.')
        return true
      }

      const $ajaxForm = $('.form-widget:not(.customjs)')
      if ($ajaxForm.length < 1) { return true }

      $ajaxForm.each(function () {
        const element = $(this)
        const elementForm = element.find('form')
        const elementFormId = elementForm.attr('id')
        let elementAlert = element.attr('data-alert-type')
        const elementLoader = element.attr('data-loader')
        const elementResult = element.find('.form-result')
        const elementRedirect = element.attr('data-redirect')

        if (!elementAlert) { elementAlert = 'notify' }

        if (elementFormId) {
          $body.addClass(`${elementFormId}-ready`)
        }

        element.find('form').validate({
          errorPlacement(error, elementItem) {
            if (elementItem.parents('.form-group').length > 0) {
              error.appendTo(elementItem.parents('.form-group'))
            } else {
              error.insertAfter(elementItem)
            }
          },
          focusCleanup: true,
          submitHandler(form) {
            elementResult.hide()

            if (elementLoader == 'button') {
              var defButton = $(form).find('button')
              var defButtonText = defButton.html()

              defButton.html('<i class="icon-line-loader icon-spin nomargin"></i>')
            } else {
              $(form).find('.form-process').fadeIn()
            }

            if (elementFormId) {
              $body.removeClass(`${elementFormId}-ready ${elementFormId}-complete ${elementFormId}-success ${elementFormId}-error`).addClass(`${elementFormId}-processing`)
            }

            $(form).ajaxSubmit({
              target: elementResult,
              dataType: 'json',
              success(data) {
                if (elementLoader == 'button') {
                  defButton.html(defButtonText)
                } else {
                  $(form).find('.form-process').fadeOut()
                }

                if (data.alert != 'error' && elementRedirect) {
                  window.location.replace(elementRedirect)
                  return true
                }

                if (elementAlert == 'inline') {
                  if (data.alert == 'error') {
                    var alertType = 'alert-danger'
                  } else {
                    var alertType = 'alert-success'
                  }

                  elementResult.removeClass('alert-danger alert-success').addClass(`alert ${alertType}`).html(data.message).slideDown(400)
                } else if (elementAlert == 'notify') {
                  elementResult.attr('data-notify-type', data.alert).attr('data-notify-msg', data.message).html('')
                  SEMICOLON.widget.notifications(elementResult)
                }

                if (data.alert != 'error') {
                  $(form).resetForm()
                  $(form).find('.btn-group > .btn').removeClass('active')

                  if ((typeof tinyMCE !== 'undefined') && tinyMCE.activeEditor && !tinyMCE.activeEditor.isHidden()) {
                    tinymce.activeEditor.setContent('')
                  }

                  const rangeSlider = $(form).find('.input-range-slider')
                  if (rangeSlider.length > 0) {
                    rangeSlider.each(function () {
                      const range = $(this).data('ionRangeSlider')
                      range.reset()
                    })
                  }

                  const ratings = $(form).find('.input-rating')
                  if (ratings.length > 0) {
                    ratings.each(function () {
                      $(this).rating('reset')
                    })
                  }

                  const selectPicker = $(form).find('.selectpicker')
                  if (selectPicker.length > 0) {
                    selectPicker.each(function () {
                      $(this).selectpicker('val', '')
                      $(this).selectpicker('deselectAll')
                    })
                  }

                  $(form).find('.input-select2,select[data-selectsplitter-firstselect-selector]').change()

                  $(form).trigger('formSubmitSuccess')
                  $body.removeClass(`${elementFormId}-error`).addClass(`${elementFormId}-success`)
                } else {
                  $(form).trigger('formSubmitError')
                  $body.removeClass(`${elementFormId}-success`).addClass(`${elementFormId}-error`)
                }

                if (elementFormId) {
                  $body.removeClass(`${elementFormId}-processing`).addClass(`${elementFormId}-complete`)
                }

                if ($(form).find('.g-recaptcha').children('div').length > 0) { grecaptcha.reset() }
              },
            })
          },
        })
      })
    },

    subscription() {
      if (!$().validate) {
        console.log('subscription: Form Validate not Defined.')
        return true
      }

      if (!$().ajaxSubmit) {
        console.log('subscription: jQuery Form not Defined.')
        return true
      }

      const $subscribeForm = $('.subscribe-widget:not(.customjs)')
      if ($subscribeForm.length < 1) { return true }

      $subscribeForm.each(function () {
        const element = $(this)
        const elementAlert = element.attr('data-alert-type')
        const elementLoader = element.attr('data-loader')
        const elementResult = element.find('.widget-subscribe-form-result')
        const elementRedirect = element.attr('data-redirect')

        element.find('form').validate({
          submitHandler(form) {
            elementResult.hide()

            if (elementLoader == 'button') {
              var defButton = $(form).find('button')
              var defButtonText = defButton.html()

              defButton.html('<i class="icon-line-loader icon-spin nomargin"></i>')
            } else {
              $(form).find('.icon-email2').removeClass('icon-email2').addClass('icon-line-loader icon-spin')
            }

            $(form).ajaxSubmit({
              target: elementResult,
              dataType: 'json',
              resetForm: true,
              success(data) {
                if (elementLoader == 'button') {
                  defButton.html(defButtonText)
                } else {
                  $(form).find('.icon-line-loader').removeClass('icon-line-loader icon-spin').addClass('icon-email2')
                }
                if (data.alert != 'error' && elementRedirect) {
                  window.location.replace(elementRedirect)
                  return true
                }
                if (elementAlert == 'inline') {
                  if (data.alert == 'error') {
                    var alertType = 'alert-danger'
                  } else {
                    var alertType = 'alert-success'
                  }

                  elementResult.addClass(`alert ${alertType}`).html(data.message).slideDown(400)
                } else {
                  elementResult.attr('data-notify-type', data.alert).attr('data-notify-msg', data.message).html('')
                  SEMICOLON.widget.notifications(elementResult)
                }
              },
            })
          },
        })
      })
    },

    stickySidebar() {
      if (!$().scwStickySidebar) {
        console.log('stickySidebar: Sticky Sidebar is not Defined.')
        return true
      }

      const $stickySidebar = jQuery('.sticky-sidebar-wrap')
      if ($stickySidebar.length < 1) { return true }

      $stickySidebar.each(function () {
        const element = $(this)
        let elementTop = element.attr('data-offset-top')
        let elementBottom = element.attr('data-offset-bottom')

        if (!elementTop) { elementTop = 110 }
        if (!elementBottom) { elementBottom = 50 }

        element.scwStickySidebar({
          additionalMarginTop: Number(elementTop),
          additionalMarginBottom: Number(elementBottom),
        })
      })
    },

    cookieNotify() {
      if (Cookies === 'undefined') {
        console.log('cookieNotify: Cookie Function not defined.')
        return true
      }

      if ($cookieNotification.length > 0) {
        const cookieNotificationHeight = $cookieNotification.outerHeight()

        $cookieNotification.css({ bottom: -cookieNotificationHeight })

        if (Cookies.get('websiteUsesCookies') != 'yesConfirmed') {
          $cookieNotification.css({ bottom: 0, opacity: 1 })
        }

        $('.cookie-accept').off('click').on('click', () => {
          $cookieNotification.css({ bottom: -cookieNotificationHeight, opacity: 0 })
          Cookies.set('websiteUsesCookies', 'yesConfirmed', { expires: 30 })
          return false
        })
      }
    },

    cartQuantity() {
      $('.plus').off('click').on('click', function () {
        const productQuantity = $(this).parents('.quantity').find('.qty').val()
        let quantityStep = $(this).parents('.quantity').find('.qty').attr('step')
        const intRegex = /^\d+$/

        if (!quantityStep) { quantityStep = 1 }

        if (intRegex.test(productQuantity)) {
          const productQuantityPlus = Number(productQuantity) + Number(quantityStep)
          $(this).parents('.quantity').find('.qty').val(productQuantityPlus)
        } else {
          $(this).parents('.quantity').find('.qty').val(Number(quantityStep))
        }

        return false
      })

      $('.minus').off('click').on('click', function () {
        const productQuantity = $(this).parents('.quantity').find('.qty').val()
        let quantityStep = $(this).parents('.quantity').find('.qty').attr('step')
        const intRegex = /^\d+$/

        if (!quantityStep) { quantityStep = 1 }

        if (intRegex.test(productQuantity)) {
          if (Number(productQuantity) > 1) {
            const productQuantityMinus = Number(productQuantity) - Number(quantityStep)
            $(this).parents('.quantity').find('.qty').val(productQuantityMinus)
          }
        } else {
          $(this).parents('.quantity').find('.qty').val(Number(quantityStep))
        }

        return false
      })
    },

    extras() {
      if ($().tooltip) {
        $('[data-toggle="tooltip"]').tooltip({ container: 'body' })
      } else {
        console.log('extras: Bootstrap Tooltip not defined.')
      }

      if ($().popover) {
        $('[data-toggle=popover]').popover()
      } else {
        console.log('extras: Bootstrap Popover not defined.')
      }

      $('.style-msg').on('click', '.close', function (e) {
        $(this).parents('.style-msg').slideUp()
        e.preventDefault()
      })

      function triggerPrimaryMenu() {
        if ($primaryMenu.find('ul.mobile-primary-menu').length > 0) {
          $primaryMenu.find('ul.mobile-primary-menu, div > ul.mobile-primary-menu').toggleClass('d-block')
        } else {
          $primaryMenu.find('ul, div > ul').toggleClass('d-block')
        }
        $body.toggleClass('primary-menu-open')
        return false
      }

      $primaryMenuTrigger.off('click').on('click', triggerPrimaryMenu)
      $('#overlay-menu-close').off('click').on('click', triggerPrimaryMenu)
      $('#page-submenu-trigger').off('click').on('click', () => {
        $body.toggleClass('top-search-open', false)
        $pagemenu.toggleClass('pagemenu-active')
        return false
      })
      $pagemenu.find('nav').off('click').on('click', (e) => {
        $body.toggleClass('top-search-open', false)
        $topCart.toggleClass('top-cart-open', false)
      })
      if (SEMICOLON.isMobile.any()) {
        $body.addClass('device-touch')
      }
      // var el = {
      //     darkLogo : $("<img>", {src: defaultDarkLogo}),
      //     darkRetinaLogo : $("<img>", {src: retinaDarkLogo})
      // };
      // el.darkLogo.prependTo("body");
      // el.darkRetinaLogo.prependTo("body");
      // el.darkLogo.css({'position':'absolute','z-index':'-100'});
      // el.darkRetinaLogo.css({'position':'absolute','z-index':'-100'});
    },

  }

  SEMICOLON.isMobile = {
    Android() {
      return navigator.userAgent.match(/Android/i)
    },
    BlackBerry() {
      return navigator.userAgent.match(/BlackBerry/i)
    },
    iOS() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i)
    },
    Opera() {
      return navigator.userAgent.match(/Opera Mini/i)
    },
    Windows() {
      return navigator.userAgent.match(/IEMobile/i)
    },
    any() {
      return (SEMICOLON.isMobile.Android() || SEMICOLON.isMobile.BlackBerry() || SEMICOLON.isMobile.iOS() || SEMICOLON.isMobile.Opera() || SEMICOLON.isMobile.Windows())
    },
  }

  SEMICOLON.documentOnResize = {

    init() {
      const t = setTimeout(() => {
        SEMICOLON.header.topsocial()
        SEMICOLON.header.fullWidthMenu()
        SEMICOLON.header.overlayMenu()
        SEMICOLON.initialize.fullScreen()
        SEMICOLON.initialize.dataResponsiveHeights()
        SEMICOLON.initialize.verticalMiddle()
        SEMICOLON.initialize.testimonialsGrid()
        SEMICOLON.initialize.stickFooterOnSmall()
        SEMICOLON.initialize.stickyFooter()
        SEMICOLON.slider.sliderParallaxDimensions()
        SEMICOLON.slider.captionPosition()
        SEMICOLON.widget.tabsResponsiveResize()
        SEMICOLON.widget.tabsJustify()
        SEMICOLON.widget.html5Video()
        SEMICOLON.widget.masonryThumbs()
        SEMICOLON.initialize.dataResponsiveClasses()
        if ($gridContainer.length > 0) {
          if (!$gridContainer.hasClass('.customjs')) {
            if ($().isotope) {
              $gridContainer.isotope('layout')
            } else {
              console.log('documentOnResize > init: Isotope not defined.')
            }
          }
        }
        if ($body.hasClass('device-xl') || $body.hasClass('device-lg')) {
          $primaryMenu.find('ul.mobile-primary-menu').removeClass('d-block')
        }
      }, 500)

      windowWidth = $window.width()
    },

  }

  SEMICOLON.documentOnReady = {

    init() {
      SEMICOLON.initialize.init()
      if ($slider.length > 0 || $sliderElement.length > 0) { SEMICOLON.slider.init() }
      if ($portfolio.length > 0) { SEMICOLON.portfolio.init() }
      SEMICOLON.widget.init()
      SEMICOLON.documentOnReady.windowscroll()
    },

    windowscroll() {
      let headerOffset = 0
      let headerWrapOffset = 0
      let pageMenuOffset = 0

      if ($header.length > 0) { headerOffset = $header.offset().top }
      if ($header.length > 0) { headerWrapOffset = $headerWrap.offset().top }
      if ($pagemenu.length > 0) {
        if ($header.length > 0 && !$header.hasClass('no-sticky')) {
          if ($header.hasClass('sticky-style-2') || $header.hasClass('sticky-style-3')) {
            pageMenuOffset = $pagemenu.offset().top - $headerWrap.outerHeight()
          } else {
            pageMenuOffset = $pagemenu.offset().top - $header.outerHeight()
          }
        } else {
          pageMenuOffset = $pagemenu.offset().top
        }
      }

      const headerDefinedOffset = $header.attr('data-sticky-offset')
      if (typeof headerDefinedOffset !== 'undefined') {
        if (headerDefinedOffset == 'full') {
          headerWrapOffset = $window.height()
          const headerOffsetNegative = $header.attr('data-sticky-offset-negative')
          if (typeof headerOffsetNegative !== 'undefined') { headerWrapOffset = headerWrapOffset - headerOffsetNegative - 1 }
        } else {
          headerWrapOffset = Number(headerDefinedOffset)
        }
      } else if ($header.hasClass('sticky-style-2') || $header.hasClass('sticky-style-3')) {
        if (headerWrapOffset === 'undefined') {
          headerWrapOffset = headerOffset
        }
      } else {
        headerWrapOffset = headerOffset
      }

      SEMICOLON.header.stickyMenu(headerWrapOffset)
      SEMICOLON.header.stickyPageMenu(pageMenuOffset)

      $window.on('scroll', () => {
        $('body.open-header.close-header-on-scroll').removeClass('side-header-open')
        SEMICOLON.header.stickyMenu(headerWrapOffset)
        SEMICOLON.header.stickyPageMenu(pageMenuOffset)
        SEMICOLON.header.logo()
      })

      window.addEventListener('scroll', onScrollSliderParallax, false)

      if ($onePageMenuEl.length > 0) {
        if ($().scrolled) {
          $window.scrolled(() => {
            SEMICOLON.header.onepageScroller()
          })
        } else {
          console.log('windowscroll: Scrolled Function not defined.')
        }
      }
    },

  }

  SEMICOLON.documentOnLoad = {

    init() {
      SEMICOLON.slider.captionPosition()
      SEMICOLON.slider.swiperSliderMenu(true)
      SEMICOLON.slider.revolutionSliderMenu(true)
      SEMICOLON.initialize.testimonialsGrid()
      SEMICOLON.initialize.verticalMiddle()
      SEMICOLON.initialize.stickFooterOnSmall()
      SEMICOLON.initialize.stickyFooter()
      SEMICOLON.widget.parallax()
      SEMICOLON.widget.loadFlexSlider()
      SEMICOLON.widget.html5Video()
      SEMICOLON.widget.masonryThumbs()
      SEMICOLON.header.topsocial()
      SEMICOLON.header.responsiveMenuClass()
      SEMICOLON.initialize.modal()
    },

  }

  var $window = $(window)
  var $body = $('body')
  var $wrapper = $('#wrapper')
  var $header = $('#header')
  var $headerWrap = $('#header-wrap')
  var $content = $('#content')
  var $footer = $('#footer')
  var windowWidth = $window.width()
  var oldHeaderClasses = $header.attr('class')
  var oldHeaderWrapClasses = $headerWrap.attr('class')
  var stickyMenuClasses = $header.attr('data-sticky-class')
  var responsiveMenuClasses = $header.attr('data-responsive-class')
  var defaultLogo = $('#logo').find('.standard-logo')
  const defaultLogoWidth = defaultLogo.find('img').outerWidth()
  var retinaLogo = $('#logo').find('.retina-logo')
  var defaultLogoImg = defaultLogo.find('img').attr('src')
  var retinaLogoImg = retinaLogo.find('img').attr('src')
  var defaultDarkLogo = defaultLogo.attr('data-dark-logo')
  var retinaDarkLogo = retinaLogo.attr('data-dark-logo')
  var defaultStickyLogo = defaultLogo.attr('data-sticky-logo')
  var retinaStickyLogo = retinaLogo.attr('data-sticky-logo')
  var defaultMobileLogo = defaultLogo.attr('data-mobile-logo')
  var retinaMobileLogo = retinaLogo.attr('data-mobile-logo')
  var $pagemenu = $('#page-menu')
  var $onePageMenuEl = $('.one-page-menu')
  var onePageGlobalOffset = 0
  var $portfolio = $('.portfolio')
  const $shop = $('.shop')
  var $gridContainer = $('.grid-container')
  var $slider = $('#slider')
  var $sliderParallaxEl = $('.slider-parallax')
  var $sliderElement = $('.slider-element')
  var swiperSlider = ''
  var $pageTitle = $('#page-title')
  const $portfolioItems = $('.portfolio-ajax').find('.portfolio-item')
  const $portfolioDetails = $('#portfolio-ajax-wrap')
  const $portfolioDetailsContainer = $('#portfolio-ajax-container')
  const $portfolioAjaxLoader = $('#portfolio-ajax-loader')
  const $portfolioFilter = $('.portfolio-filter,.custom-filter')
  const prevPostPortId = ''
  var $topSearch = $('#top-search')
  var $topCart = $('#top-cart')
  var $verticalMiddleEl = $('.vertical-middle')
  var $topSocialEl = $('#top-social').find('li')
  var $siStickyEl = $('.si-sticky')
  var $dotsMenuEl = $('.dots-menu')
  var $fullScreenEl = $('.full-screen')
  var $testimonialsGridEl = $('.testimonials-grid')
  var $pageSectionEl = $('.page-section')
  var $owlCarouselEl = $('.owl-carousel')
  var $parallaxEl = $('.parallax')
  var $parallaxPageTitleEl = $('.page-title-parallax')
  var $parallaxPortfolioEl = $('.portfolio-parallax').find('.portfolio-image')
  var $textRotaterEl = $('.text-rotater')
  var $cookieNotification = $('#cookie-notification')
  var $topSearchTrigger = $('#top-search-trigger')
  var $primaryMenu = $('#primary-menu')
  var $primaryMenuTrigger = $('#primary-menu-trigger')

  document.addEventListener('canvas-functions-init', (e) => {
    e.detail.$ = $

    $header = $(e.detail.header || $header)
    $headerWrap = $(e.detail.headerWrap || $headerWrap)
    $topSearch = $(e.detail.topSearch || $topSearch)
    $topSearchTrigger = $(e.detail.topSearchTrigger || $topSearchTrigger)
    $primaryMenu = $(e.detail.primaryMenu || $primaryMenu)
    $primaryMenuTrigger = $(e.detail.primaryMenuTrigger || $primaryMenuTrigger)
  }, true)

  $(document).ready(SEMICOLON.documentOnReady.init)
  $window.on('load', SEMICOLON.documentOnLoad.init)
  $window.on('resize', SEMICOLON.documentOnResize.init)
})(jQuery)
