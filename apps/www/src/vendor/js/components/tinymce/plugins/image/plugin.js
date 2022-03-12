(function () {
  const image = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    const noop = function () {
      const args = []
      for (let _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i]
      }
    }
    const constant = function (value) {
      return function () {
        return value
      }
    }
    const identity = function (x) {
      return x
    }
    const die = function (msg) {
      return function () {
        throw new Error(msg)
      }
    }
    const never = constant(false)
    const always = constant(true)

    const never$1 = never
    const always$1 = always
    const none = function () {
      return NONE
    }
    var NONE = (function () {
      const eq = function (o) {
        return o.isNone()
      }
      const call$$1 = function (thunk) {
        return thunk()
      }
      const id = function (n) {
        return n
      }
      const noop$$1 = function () {
      }
      const nul = function () {
        return null
      }
      const undef = function () {
        return undefined
      }
      const me = {
        fold(n, s) {
          return n()
        },
        is: never$1,
        isSome: never$1,
        isNone: always$1,
        getOr: id,
        getOrThunk: call$$1,
        getOrDie(msg) {
          throw new Error(msg || 'error: getOrDie called on none.')
        },
        getOrNull: nul,
        getOrUndefined: undef,
        or: id,
        orThunk: call$$1,
        map: none,
        ap: none,
        each: noop$$1,
        bind: none,
        flatten: none,
        exists: never$1,
        forall: always$1,
        filter: none,
        equals: eq,
        equals_: eq,
        toArray() {
          return []
        },
        toString: constant('none()'),
      }
      if (Object.freeze) { Object.freeze(me) }
      return me
    }())
    var some = function (a) {
      const constant_a = function () {
        return a
      }
      const self = function () {
        return me
      }
      const map = function (f) {
        return some(f(a))
      }
      const bind = function (f) {
        return f(a)
      }
      var me = {
        fold(n, s) {
          return s(a)
        },
        is(v) {
          return a === v
        },
        isSome: always$1,
        isNone: never$1,
        getOr: constant_a,
        getOrThunk: constant_a,
        getOrDie: constant_a,
        getOrNull: constant_a,
        getOrUndefined: constant_a,
        or: self,
        orThunk: self,
        map,
        ap(optfab) {
          return optfab.fold(none, (fab) => some(fab(a)))
        },
        each(f) {
          f(a)
        },
        bind,
        flatten: constant_a,
        exists: bind,
        forall: bind,
        filter(f) {
          return f(a) ? me : NONE
        },
        equals(o) {
          return o.is(a)
        },
        equals_(o, elementEq) {
          return o.fold(never$1, (b) => elementEq(a, b))
        },
        toArray() {
          return [a]
        },
        toString() {
          return `some(${a})`
        },
      }
      return me
    }
    const from = function (value) {
      return value === null || value === undefined ? NONE : some(value)
    }
    const Option = {
      some,
      none,
      from,
    }

    const typeOf = function (x) {
      if (x === null) { return 'null' }
      const t = typeof x
      if (t === 'object' && Array.prototype.isPrototypeOf(x)) { return 'array' }
      if (t === 'object' && String.prototype.isPrototypeOf(x)) { return 'string' }
      return t
    }
    const isType = function (type) {
      return function (value) {
        return typeOf(value) === type
      }
    }
    const isString = isType('string')
    const isObject = isType('object')
    const isFunction = isType('function')
    const isNumber = isType('number')

    const each = function (xs, f) {
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i]
        f(x, i, xs)
      }
    }
    const find = function (xs, pred) {
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i]
        if (pred(x, i, xs)) {
          return Option.some(x)
        }
      }
      return Option.none()
    }
    const { push } = Array.prototype
    const flatten = function (xs) {
      const r = []
      for (let i = 0, len = xs.length; i < len; ++i) {
        if (!Array.prototype.isPrototypeOf(xs[i])) { throw new Error(`Arr.flatten item ${i} was not an array, input: ${xs}`) }
        push.apply(r, xs[i])
      }
      return r
    }
    const { slice } = Array.prototype
    const from$1 = isFunction(Array.from) ? Array.from : function (x) {
      return slice.call(x)
    }

    var __assign = function () {
      __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i]
          for (const p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) { t[p] = s[p] }
          }
        }
        return t
      }
      return __assign.apply(this, arguments)
    }

    var nu = function (baseFn) {
      let data = Option.none()
      let callbacks = []
      const map$$1 = function (f) {
        return nu((nCallback) => {
          get((data) => {
            nCallback(f(data))
          })
        })
      }
      var get = function (nCallback) {
        if (isReady()) { call(nCallback) } else { callbacks.push(nCallback) }
      }
      const set = function (x) {
        data = Option.some(x)
        run(callbacks)
        callbacks = []
      }
      var isReady = function () {
        return data.isSome()
      }
      var run = function (cbs) {
        each(cbs, call)
      }
      var call = function (cb) {
        data.each((x) => {
          setTimeout(() => {
            cb(x)
          }, 0)
        })
      }
      baseFn(set)
      return {
        get,
        map: map$$1,
        isReady,
      }
    }
    const pure$1 = function (a) {
      return nu((callback) => {
        callback(a)
      })
    }
    const LazyValue = {
      nu,
      pure: pure$1,
    }

    const bounce = function (f) {
      return function () {
        const args = []
        for (let _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i]
        }
        const me = this
        setTimeout(() => {
          f.apply(me, args)
        }, 0)
      }
    }

    var nu$1 = function (baseFn) {
      const get = function (callback) {
        baseFn(bounce(callback))
      }
      const map = function (fab) {
        return nu$1((callback) => {
          get((a) => {
            const value = fab(a)
            callback(value)
          })
        })
      }
      const bind = function (aFutureB) {
        return nu$1((callback) => {
          get((a) => {
            aFutureB(a).get(callback)
          })
        })
      }
      const anonBind = function (futureB) {
        return nu$1((callback) => {
          get((a) => {
            futureB.get(callback)
          })
        })
      }
      const toLazy = function () {
        return LazyValue.nu(get)
      }
      const toCached = function () {
        let cache = null
        return nu$1((callback) => {
          if (cache === null) {
            cache = toLazy()
          }
          cache.get(callback)
        })
      }
      return {
        map,
        bind,
        anonBind,
        toLazy,
        toCached,
        get,
      }
    }
    const pure$2 = function (a) {
      return nu$1((callback) => {
        callback(a)
      })
    }
    const Future = {
      nu: nu$1,
      pure: pure$2,
    }

    var value = function (o) {
      const is = function (v) {
        return o === v
      }
      const or = function (opt) {
        return value(o)
      }
      const orThunk = function (f) {
        return value(o)
      }
      const map = function (f) {
        return value(f(o))
      }
      const mapError = function (f) {
        return value(o)
      }
      const each = function (f) {
        f(o)
      }
      const bind = function (f) {
        return f(o)
      }
      const fold = function (_, onValue) {
        return onValue(o)
      }
      const exists = function (f) {
        return f(o)
      }
      const forall = function (f) {
        return f(o)
      }
      const toOption = function () {
        return Option.some(o)
      }
      return {
        is,
        isValue: always,
        isError: never,
        getOr: constant(o),
        getOrThunk: constant(o),
        getOrDie: constant(o),
        or,
        orThunk,
        fold,
        map,
        mapError,
        each,
        bind,
        exists,
        forall,
        toOption,
      }
    }
    var error = function (message) {
      const getOrThunk = function (f) {
        return f()
      }
      const getOrDie = function () {
        return die(String(message))()
      }
      const or = function (opt) {
        return opt
      }
      const orThunk = function (f) {
        return f()
      }
      const map = function (f) {
        return error(message)
      }
      const mapError = function (f) {
        return error(f(message))
      }
      const bind = function (f) {
        return error(message)
      }
      const fold = function (onError, _) {
        return onError(message)
      }
      return {
        is: never,
        isValue: never,
        isError: always,
        getOr: identity,
        getOrThunk,
        getOrDie,
        or,
        orThunk,
        fold,
        map,
        mapError,
        each: noop,
        bind,
        exists: never,
        forall: always,
        toOption: Option.none,
      }
    }
    const Result = {
      value,
      error,
    }

    var wrap = function (delegate) {
      const toCached = function () {
        return wrap(delegate.toCached())
      }
      const bindFuture = function (f) {
        return wrap(delegate.bind((resA) => resA.fold((err) => Future.pure(Result.error(err)), (a) => f(a))))
      }
      const bindResult = function (f) {
        return wrap(delegate.map((resA) => resA.bind(f)))
      }
      const mapResult = function (f) {
        return wrap(delegate.map((resA) => resA.map(f)))
      }
      const mapError = function (f) {
        return wrap(delegate.map((resA) => resA.mapError(f)))
      }
      const foldResult = function (whenError, whenValue) {
        return delegate.map((res) => res.fold(whenError, whenValue))
      }
      const withTimeout = function (timeout, errorThunk) {
        return wrap(Future.nu((callback) => {
          let timedOut = false
          const timer = window.setTimeout(() => {
            timedOut = true
            callback(Result.error(errorThunk()))
          }, timeout)
          delegate.get((result) => {
            if (!timedOut) {
              window.clearTimeout(timer)
              callback(result)
            }
          })
        }))
      }
      return __assign({}, delegate, {
        toCached,
        bindFuture,
        bindResult,
        mapResult,
        mapError,
        foldResult,
        withTimeout,
      })
    }
    const nu$2 = function (worker) {
      return wrap(Future.nu(worker))
    }
    const value$1 = function (value) {
      return wrap(Future.pure(Result.value(value)))
    }
    const error$1 = function (error) {
      return wrap(Future.pure(Result.error(error)))
    }
    const fromResult = function (result) {
      return wrap(Future.pure(result))
    }
    const fromFuture = function (future) {
      return wrap(future.map(Result.value))
    }
    const fromPromise = function (promise) {
      return nu$2((completer) => {
        promise.then((value) => {
          completer(Result.value(value))
        }, (error) => {
          completer(Result.error(error))
        })
      })
    }
    const FutureResult = {
      nu: nu$2,
      wrap,
      pure: value$1,
      value: value$1,
      error: error$1,
      fromResult,
      fromFuture,
      fromPromise,
    }

    const { hasOwnProperty } = Object.prototype
    const shallow = function (old, nu) {
      return nu
    }
    const deep = function (old, nu) {
      const bothObjects = isObject(old) && isObject(nu)
      return bothObjects ? deepMerge(old, nu) : nu
    }
    const baseMerge = function (merger) {
      return function () {
        const objects = new Array(arguments.length)
        for (let i = 0; i < objects.length; i++) { objects[i] = arguments[i] }
        if (objects.length === 0) { throw new Error('Can\'t merge zero objects') }
        const ret = {}
        for (let j = 0; j < objects.length; j++) {
          const curObject = objects[j]
          for (const key in curObject) {
            if (hasOwnProperty.call(curObject, key)) {
              ret[key] = merger(ret[key], curObject[key])
            }
          }
        }
        return ret
      }
    }
    var deepMerge = baseMerge(deep)
    const merge = baseMerge(shallow)

    const Global = typeof window !== 'undefined' ? window : Function('return this;')()

    const path = function (parts, scope) {
      let o = scope !== undefined && scope !== null ? scope : Global
      for (let i = 0; i < parts.length && o !== undefined && o !== null; ++i) { o = o[parts[i]] }
      return o
    }
    const resolve = function (p, scope) {
      const parts = p.split('.')
      return path(parts, scope)
    }

    const unsafe = function (name, scope) {
      return resolve(name, scope)
    }
    const getOrDie = function (name, scope) {
      const actual = unsafe(name, scope)
      if (actual === undefined || actual === null) { throw `${name} not available on this browser` }
      return actual
    }
    const Global$1 = { getOrDie }

    const url = function () {
      return Global$1.getOrDie('URL')
    }
    const createObjectURL = function (blob) {
      return url().createObjectURL(blob)
    }
    const revokeObjectURL = function (u) {
      url().revokeObjectURL(u)
    }
    const URL = {
      createObjectURL,
      revokeObjectURL,
    }

    const makeItems = function (info) {
      const imageUrl = {
        name: 'src',
        type: 'urlinput',
        filetype: 'image',
        label: 'Source',
      }
      const imageList = info.imageList.map((items) => ({
        name: 'images',
        type: 'selectbox',
        label: 'Image list',
        items,
      }))
      const imageDescription = {
        name: 'alt',
        type: 'input',
        label: 'Image description',
      }
      const imageTitle = {
        name: 'title',
        type: 'input',
        label: 'Image title',
      }
      const imageDimensions = {
        name: 'dimensions',
        type: 'sizeinput',
      }
      const classList = info.classList.map((items) => ({
        name: 'classes',
        type: 'selectbox',
        label: 'Class',
        items,
      }))
      const caption = {
        type: 'label',
        label: 'Caption',
        items: [{
          type: 'checkbox',
          name: 'caption',
          label: 'Show caption',
        }],
      }
      return flatten([
        [imageUrl],
        imageList.toArray(),
        info.hasDescription ? [imageDescription] : [],
        info.hasImageTitle ? [imageTitle] : [],
        info.hasDimensions ? [imageDimensions] : [],
        [{
          type: 'grid',
          columns: 2,
          items: flatten([
            classList.toArray(),
            info.hasImageCaption ? [caption] : [],
          ]),
        }],
      ])
    }
    const makeTab = function (info) {
      return {
        title: 'General',
        type: 'form',
        items: makeItems(info),
      }
    }
    const MainTab = {
      makeTab,
      makeItems,
    }

    function FileReader() {
      const f = Global$1.getOrDie('FileReader')
      return new f()
    }

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.Promise')

    const global$2 = tinymce.util.Tools.resolve('tinymce.util.Tools')

    const global$3 = tinymce.util.Tools.resolve('tinymce.util.XHR')

    const hasDimensions = function (editor) {
      return editor.settings.image_dimensions !== false
    }
    const hasAdvTab = function (editor) {
      return editor.settings.image_advtab === true
    }
    const getPrependUrl = function (editor) {
      return editor.getParam('image_prepend_url', '')
    }
    const getClassList = function (editor) {
      return editor.getParam('image_class_list')
    }
    const hasDescription = function (editor) {
      return editor.settings.image_description !== false
    }
    const hasImageTitle = function (editor) {
      return editor.settings.image_title === true
    }
    const hasImageCaption = function (editor) {
      return editor.settings.image_caption === true
    }
    const getImageList = function (editor) {
      return editor.getParam('image_list', false)
    }
    const hasUploadUrl = function (editor) {
      return !!editor.getParam('images_upload_url', false)
    }
    const hasUploadHandler = function (editor) {
      return !!editor.getParam('images_upload_handler', false)
    }
    const getUploadUrl = function (editor) {
      return editor.getParam('images_upload_url')
    }
    const getUploadHandler = function (editor) {
      return editor.getParam('images_upload_handler')
    }
    const getUploadBasePath = function (editor) {
      return editor.getParam('images_upload_base_path')
    }
    const getUploadCredentials = function (editor) {
      return editor.getParam('images_upload_credentials')
    }
    const Settings = {
      hasDimensions,
      hasAdvTab,
      getPrependUrl,
      getClassList,
      hasDescription,
      hasImageTitle,
      hasImageCaption,
      getImageList,
      hasUploadUrl,
      hasUploadHandler,
      getUploadUrl,
      getUploadHandler,
      getUploadBasePath,
      getUploadCredentials,
    }

    const parseIntAndGetMax = function (val1, val2) {
      return Math.max(parseInt(val1, 10), parseInt(val2, 10))
    }
    const getImageSize = function (url, callback) {
      const img = document.createElement('img')
      function done(dimensions) {
        if (img.parentNode) {
          img.parentNode.removeChild(img)
        }
        callback(dimensions)
      }
      img.onload = function () {
        const width = parseIntAndGetMax(img.width, img.clientWidth)
        const height = parseIntAndGetMax(img.height, img.clientHeight)
        const dimensions = {
          width,
          height,
        }
        done(Result.value(dimensions))
      }
      img.onerror = function () {
        done(Result.error(undefined))
      }
      const { style } = img
      style.visibility = 'hidden'
      style.position = 'fixed'
      style.bottom = style.left = '0px'
      style.width = style.height = 'auto'
      document.body.appendChild(img)
      img.src = url
    }
    const buildListItems = function (inputList, itemCallback, startItems) {
      function appendItems(values, output) {
        output = output || []
        global$2.each(values, (item) => {
          const menuItem = { text: item.text || item.title }
          if (item.menu) {
            menuItem.menu = appendItems(item.menu)
          } else {
            menuItem.value = item.value
            itemCallback(menuItem)
          }
          output.push(menuItem)
        })
        return output
      }
      return appendItems(inputList, startItems || [])
    }
    const removePixelSuffix = function (value) {
      if (value) {
        value = value.replace(/px$/, '')
      }
      return value
    }
    const addPixelSuffix = function (value) {
      if (value.length > 0 && /^[0-9]+$/.test(value)) {
        value += 'px'
      }
      return value
    }
    const mergeMargins = function (css) {
      if (css.margin) {
        const splitMargin = String(css.margin).split(' ')
        switch (splitMargin.length) {
          case 1:
            css['margin-top'] = css['margin-top'] || splitMargin[0]
            css['margin-right'] = css['margin-right'] || splitMargin[0]
            css['margin-bottom'] = css['margin-bottom'] || splitMargin[0]
            css['margin-left'] = css['margin-left'] || splitMargin[0]
            break
          case 2:
            css['margin-top'] = css['margin-top'] || splitMargin[0]
            css['margin-right'] = css['margin-right'] || splitMargin[1]
            css['margin-bottom'] = css['margin-bottom'] || splitMargin[0]
            css['margin-left'] = css['margin-left'] || splitMargin[1]
            break
          case 3:
            css['margin-top'] = css['margin-top'] || splitMargin[0]
            css['margin-right'] = css['margin-right'] || splitMargin[1]
            css['margin-bottom'] = css['margin-bottom'] || splitMargin[2]
            css['margin-left'] = css['margin-left'] || splitMargin[1]
            break
          case 4:
            css['margin-top'] = css['margin-top'] || splitMargin[0]
            css['margin-right'] = css['margin-right'] || splitMargin[1]
            css['margin-bottom'] = css['margin-bottom'] || splitMargin[2]
            css['margin-left'] = css['margin-left'] || splitMargin[3]
        }
        delete css.margin
      }
      return css
    }
    const createImageList = function (editor, callback) {
      const imageList = Settings.getImageList(editor)
      if (typeof imageList === 'string') {
        global$3.send({
          url: imageList,
          success(text) {
            callback(JSON.parse(text))
          },
        })
      } else if (typeof imageList === 'function') {
        imageList(callback)
      } else {
        callback(imageList)
      }
    }
    const waitLoadImage = function (editor, data, imgElm) {
      function selectImage() {
        imgElm.onload = imgElm.onerror = null
        if (editor.selection) {
          editor.selection.select(imgElm)
          editor.nodeChanged()
        }
      }
      imgElm.onload = function () {
        if (!data.width && !data.height && Settings.hasDimensions(editor)) {
          editor.dom.setAttribs(imgElm, {
            width: imgElm.clientWidth,
            height: imgElm.clientHeight,
          })
        }
        selectImage()
      }
      imgElm.onerror = selectImage
    }
    const blobToDataUri = function (blob) {
      return new global$1((resolve, reject) => {
        const reader = FileReader()
        reader.onload = function () {
          resolve(reader.result)
        }
        reader.onerror = function () {
          reject(reader.error.message)
        }
        reader.readAsDataURL(blob)
      })
    }
    const Utils = {
      getImageSize,
      buildListItems,
      removePixelSuffix,
      addPixelSuffix,
      mergeMargins,
      createImageList,
      waitLoadImage,
      blobToDataUri,
    }

    const global$4 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils')

    const { DOM } = global$4
    const getHspace = function (image) {
      if (image.style.marginLeft && image.style.marginRight && image.style.marginLeft === image.style.marginRight) {
        return Utils.removePixelSuffix(image.style.marginLeft)
      }
      return ''
    }
    const getVspace = function (image) {
      if (image.style.marginTop && image.style.marginBottom && image.style.marginTop === image.style.marginBottom) {
        return Utils.removePixelSuffix(image.style.marginTop)
      }
      return ''
    }
    const getBorder = function (image) {
      if (image.style.borderWidth) {
        return Utils.removePixelSuffix(image.style.borderWidth)
      }
      return ''
    }
    const getAttrib = function (image, name$$1) {
      if (image.hasAttribute(name$$1)) {
        return image.getAttribute(name$$1)
      }
      return ''
    }
    const getStyle = function (image, name$$1) {
      return image.style[name$$1] ? image.style[name$$1] : ''
    }
    const hasCaption = function (image) {
      return image.parentNode !== null && image.parentNode.nodeName === 'FIGURE'
    }
    const setAttrib = function (image, name$$1, value) {
      image.setAttribute(name$$1, value)
    }
    const wrapInFigure = function (image) {
      const figureElm = DOM.create('figure', { class: 'image' })
      DOM.insertAfter(figureElm, image)
      figureElm.appendChild(image)
      figureElm.appendChild(DOM.create('figcaption', { contentEditable: true }, 'Caption'))
      figureElm.contentEditable = 'false'
    }
    const removeFigure = function (image) {
      const figureElm = image.parentNode
      DOM.insertAfter(image, figureElm)
      DOM.remove(figureElm)
    }
    const toggleCaption = function (image) {
      if (hasCaption(image)) {
        removeFigure(image)
      } else {
        wrapInFigure(image)
      }
    }
    const normalizeStyle = function (image, normalizeCss) {
      const attrValue = image.getAttribute('style')
      const value = normalizeCss(attrValue !== null ? attrValue : '')
      if (value.length > 0) {
        image.setAttribute('style', value)
        image.setAttribute('data-mce-style', value)
      } else {
        image.removeAttribute('style')
      }
    }
    const setSize = function (name$$1, normalizeCss) {
      return function (image, name$$1, value) {
        if (image.style[name$$1]) {
          image.style[name$$1] = Utils.addPixelSuffix(value)
          normalizeStyle(image, normalizeCss)
        } else {
          setAttrib(image, name$$1, value)
        }
      }
    }
    const getSize = function (image, name$$1) {
      if (image.style[name$$1]) {
        return Utils.removePixelSuffix(image.style[name$$1])
      }
      return getAttrib(image, name$$1)
    }
    const setHspace = function (image, value) {
      const pxValue = Utils.addPixelSuffix(value)
      image.style.marginLeft = pxValue
      image.style.marginRight = pxValue
    }
    const setVspace = function (image, value) {
      const pxValue = Utils.addPixelSuffix(value)
      image.style.marginTop = pxValue
      image.style.marginBottom = pxValue
    }
    const setBorder = function (image, value) {
      const pxValue = Utils.addPixelSuffix(value)
      image.style.borderWidth = pxValue
    }
    const setBorderStyle = function (image, value) {
      image.style.borderStyle = value
    }
    const getBorderStyle = function (image) {
      return getStyle(image, 'borderStyle')
    }
    const isFigure = function (elm) {
      return elm.nodeName === 'FIGURE'
    }
    const isImage = function (elm) {
      return elm.nodeName === 'IMG'
    }
    const defaultData = function () {
      return {
        src: '',
        alt: '',
        title: '',
        width: '',
        height: '',
        class: '',
        style: '',
        caption: false,
        hspace: '',
        vspace: '',
        border: '',
        borderStyle: '',
      }
    }
    const getStyleValue = function (normalizeCss, data) {
      const image = document.createElement('img')
      setAttrib(image, 'style', data.style)
      if (getHspace(image) || data.hspace !== '') {
        setHspace(image, data.hspace)
      }
      if (getVspace(image) || data.vspace !== '') {
        setVspace(image, data.vspace)
      }
      if (getBorder(image) || data.border !== '') {
        setBorder(image, data.border)
      }
      if (getBorderStyle(image) || data.borderStyle !== '') {
        setBorderStyle(image, data.borderStyle)
      }
      return normalizeCss(image.getAttribute('style'))
    }
    const create = function (normalizeCss, data) {
      const image = document.createElement('img')
      write(normalizeCss, merge(data, { caption: false }), image)
      setAttrib(image, 'alt', data.alt)
      if (data.caption) {
        const figure = DOM.create('figure', { class: 'image' })
        figure.appendChild(image)
        figure.appendChild(DOM.create('figcaption', { contentEditable: true }, 'Caption'))
        figure.contentEditable = 'false'
        return figure
      }
      return image
    }
    const read = function (normalizeCss, image) {
      return {
        src: getAttrib(image, 'src'),
        alt: getAttrib(image, 'alt'),
        title: getAttrib(image, 'title'),
        width: getSize(image, 'width'),
        height: getSize(image, 'height'),
        class: getAttrib(image, 'class'),
        style: normalizeCss(getAttrib(image, 'style')),
        caption: hasCaption(image),
        hspace: getHspace(image),
        vspace: getVspace(image),
        border: getBorder(image),
        borderStyle: getStyle(image, 'borderStyle'),
      }
    }
    const updateProp = function (image, oldData, newData, name$$1, set) {
      if (newData[name$$1] !== oldData[name$$1]) {
        set(image, name$$1, newData[name$$1])
      }
    }
    const normalized = function (set, normalizeCss) {
      return function (image, name$$1, value) {
        set(image, value)
        normalizeStyle(image, normalizeCss)
      }
    }
    var write = function (normalizeCss, newData, image) {
      const oldData = read(normalizeCss, image)
      updateProp(image, oldData, newData, 'caption', (image, _name, _value) => toggleCaption(image))
      updateProp(image, oldData, newData, 'src', setAttrib)
      updateProp(image, oldData, newData, 'alt', setAttrib)
      updateProp(image, oldData, newData, 'title', setAttrib)
      updateProp(image, oldData, newData, 'width', setSize('width', normalizeCss))
      updateProp(image, oldData, newData, 'height', setSize('height', normalizeCss))
      updateProp(image, oldData, newData, 'class', setAttrib)
      updateProp(image, oldData, newData, 'style', normalized((image, value) => setAttrib(image, 'style', value), normalizeCss))
      updateProp(image, oldData, newData, 'hspace', normalized(setHspace, normalizeCss))
      updateProp(image, oldData, newData, 'vspace', normalized(setVspace, normalizeCss))
      updateProp(image, oldData, newData, 'border', normalized(setBorder, normalizeCss))
      updateProp(image, oldData, newData, 'borderStyle', normalized(setBorderStyle, normalizeCss))
    }

    const normalizeCss = function (editor, cssText) {
      const css = editor.dom.styles.parse(cssText)
      const mergedCss = Utils.mergeMargins(css)
      const compressed = editor.dom.styles.parse(editor.dom.styles.serialize(mergedCss))
      return editor.dom.styles.serialize(compressed)
    }
    const getSelectedImage = function (editor) {
      const imgElm = editor.selection.getNode()
      const figureElm = editor.dom.getParent(imgElm, 'figure.image')
      if (figureElm) {
        return editor.dom.select('img', figureElm)[0]
      }
      if (imgElm && (imgElm.nodeName !== 'IMG' || imgElm.getAttribute('data-mce-object') || imgElm.getAttribute('data-mce-placeholder'))) {
        return null
      }
      return imgElm
    }
    const splitTextBlock = function (editor, figure) {
      const { dom } = editor
      const textBlock = dom.getParent(figure.parentNode, (node) => editor.schema.getTextBlockElements()[node.nodeName], editor.getBody())
      if (textBlock) {
        return dom.split(textBlock, figure)
      }
      return figure
    }
    const readImageDataFromSelection = function (editor) {
      const image = getSelectedImage(editor)
      return image ? read((css) => normalizeCss(editor, css), image) : defaultData()
    }
    const insertImageAtCaret = function (editor, data) {
      const elm = create((css) => normalizeCss(editor, css), data)
      editor.dom.setAttrib(elm, 'data-mce-id', '__mcenew')
      editor.focus()
      editor.selection.setContent(elm.outerHTML)
      const insertedElm = editor.dom.select('*[data-mce-id="__mcenew"]')[0]
      editor.dom.setAttrib(insertedElm, 'data-mce-id', null)
      if (isFigure(insertedElm)) {
        const figure = splitTextBlock(editor, insertedElm)
        editor.selection.select(figure)
      } else {
        editor.selection.select(insertedElm)
      }
    }
    const syncSrcAttr = function (editor, image) {
      editor.dom.setAttrib(image, 'src', image.getAttribute('src'))
    }
    const deleteImage = function (editor, image) {
      if (image) {
        const elm = editor.dom.is(image.parentNode, 'figure.image') ? image.parentNode : image
        editor.dom.remove(elm)
        editor.focus()
        editor.nodeChanged()
        if (editor.dom.isEmpty(editor.getBody())) {
          editor.setContent('')
          editor.selection.setCursorLocation()
        }
      }
    }
    const writeImageDataToSelection = function (editor, data) {
      const image = getSelectedImage(editor)
      write((css) => normalizeCss(editor, css), data, image)
      syncSrcAttr(editor, image)
      if (isFigure(image.parentNode)) {
        const figure = image.parentNode
        splitTextBlock(editor, figure)
        editor.selection.select(image.parentNode)
      } else {
        editor.selection.select(image)
        Utils.waitLoadImage(editor, data, image)
      }
    }
    const insertOrUpdateImage = function (editor, data) {
      const image = getSelectedImage(editor)
      if (image) {
        if (data.src) {
          writeImageDataToSelection(editor, data)
        } else {
          deleteImage(editor, image)
        }
      } else if (data.src) {
        insertImageAtCaret(editor, data)
      }
    }

    const findMap = function (arr, f) {
      for (let i = 0; i < arr.length; i++) {
        const r = f(arr[i], i)
        if (r.isSome()) {
          return r
        }
      }
      return Option.none()
    }

    const getValue = function (item) {
      return isString(item.value) ? item.value : ''
    }
    var sanitizeList = function (list, extractValue) {
      const out = []
      global$2.each(list, (item) => {
        const text = isString(item.text) ? item.text : isString(item.title) ? item.title : ''
        if (item.menu !== undefined) {
          const items = sanitizeList(item.menu, extractValue)
          out.push({
            text,
            items,
          })
        } else {
          const value = extractValue(item)
          out.push({
            text,
            value,
          })
        }
      })
      return out
    }
    const sanitizer = function (extracter) {
      if (extracter === void 0) {
        extracter = getValue
      }
      return function (list) {
        if (list) {
          return Option.from(list).map((list) => sanitizeList(list, extracter))
        }
        return Option.none()
      }
    }
    const sanitize = function (list) {
      return sanitizer(getValue)(list)
    }
    const isGroup = function (item) {
      return Object.prototype.hasOwnProperty.call(item, 'items')
    }
    var findEntryDelegate = function (list, value) {
      return findMap(list, (item) => {
        if (isGroup(item)) {
          return findEntryDelegate(item.items, value)
        } if (item.value === value) {
          return Option.some(item)
        }
        return Option.none()
      })
    }
    const findEntry = function (optList, value) {
      return optList.bind((list) => findEntryDelegate(list, value))
    }
    const ListUtils = {
      sanitizer,
      sanitize,
      findEntry,
    }

    function XMLHttpRequest() {
      const f = Global$1.getOrDie('XMLHttpRequest')
      return new f()
    }

    const noop$1 = function () {
    }
    const pathJoin = function (path1, path2) {
      if (path1) {
        return `${path1.replace(/\/$/, '')}/${path2.replace(/^\//, '')}`
      }
      return path2
    }
    function Uploader(settings) {
      const defaultHandler = function (blobInfo, success, failure, progress) {
        let xhr, formData
        xhr = XMLHttpRequest()
        xhr.open('POST', settings.url)
        xhr.withCredentials = settings.credentials
        xhr.upload.onprogress = function (e) {
          progress(e.loaded / e.total * 100)
        }
        xhr.onerror = function () {
          failure(`Image upload failed due to a XHR Transport error. Code: ${xhr.status}`)
        }
        xhr.onload = function () {
          let json
          if (xhr.status < 200 || xhr.status >= 300) {
            failure(`HTTP Error: ${xhr.status}`)
            return
          }
          json = JSON.parse(xhr.responseText)
          if (!json || typeof json.location !== 'string') {
            failure(`Invalid JSON: ${xhr.responseText}`)
            return
          }
          success(pathJoin(settings.basePath, json.location))
        }
        formData = new FormData()
        formData.append('file', blobInfo.blob(), blobInfo.filename())
        xhr.send(formData)
      }
      const uploadBlob = function (blobInfo, handler) {
        return new global$1((resolve, reject) => {
          try {
            handler(blobInfo, resolve, reject, noop$1)
          } catch (ex) {
            reject(ex.message)
          }
        })
      }
      const isDefaultHandler = function (handler) {
        return handler === defaultHandler
      }
      const upload = function (blobInfo) {
        return !settings.url && isDefaultHandler(settings.handler) ? global$1.reject('Upload url missing from the settings.') : uploadBlob(blobInfo, settings.handler)
      }
      settings = global$2.extend({
        credentials: false,
        handler: defaultHandler,
      }, settings)
      return { upload }
    }

    const makeTab$1 = function (info) {
      return {
        title: 'Advanced',
        items: [
          {
            type: 'input',
            label: 'Style',
            name: 'style',
          },
          {
            type: 'grid',
            columns: 2,
            items: [
              {
                type: 'input',
                label: 'Vertical space',
                name: 'vspace',
              },
              {
                type: 'input',
                label: 'Horizontal space',
                name: 'hspace',
              },
              {
                type: 'input',
                label: 'Border width',
                name: 'border',
              },
              {
                type: 'selectbox',
                name: 'borderstyle',
                label: 'Border style',
                items: [
                  {
                    text: 'Select...',
                    value: '',
                  },
                  {
                    text: 'Solid',
                    value: 'solid',
                  },
                  {
                    text: 'Dotted',
                    value: 'dotted',
                  },
                  {
                    text: 'Dashed',
                    value: 'dashed',
                  },
                  {
                    text: 'Double',
                    value: 'double',
                  },
                  {
                    text: 'Groove',
                    value: 'groove',
                  },
                  {
                    text: 'Ridge',
                    value: 'ridge',
                  },
                  {
                    text: 'Inset',
                    value: 'inset',
                  },
                  {
                    text: 'Outset',
                    value: 'outset',
                  },
                  {
                    text: 'None',
                    value: 'none',
                  },
                  {
                    text: 'Hidden',
                    value: 'hidden',
                  },
                ],
              },
            ],
          },
        ],
      }
    }
    const AdvTab = { makeTab: makeTab$1 }

    const collect = function (editor) {
      const urlListSanitizer = ListUtils.sanitizer((item) => editor.convertURL(item.value || item.url, 'src'))
      const futureImageList = Future.nu((completer) => {
        Utils.createImageList(editor, (imageList) => {
          completer(urlListSanitizer(imageList).map((items) => flatten([
            [{
              text: 'None',
              value: '',
            }],
            items,
          ])))
        })
      })
      const classList = ListUtils.sanitize(Settings.getClassList(editor))
      const hasAdvTab = Settings.hasAdvTab(editor)
      const hasUploadUrl = Settings.hasUploadUrl(editor)
      const hasUploadHandler = Settings.hasUploadHandler(editor)
      const image = readImageDataFromSelection(editor)
      const hasDescription = Settings.hasDescription(editor)
      const hasImageTitle = Settings.hasImageTitle(editor)
      const hasDimensions = Settings.hasDimensions(editor)
      const hasImageCaption = Settings.hasImageCaption(editor)
      const url = Settings.getUploadUrl(editor)
      const basePath = Settings.getUploadBasePath(editor)
      const credentials = Settings.getUploadCredentials(editor)
      const handler = Settings.getUploadHandler(editor)
      const prependURL = Option.some(Settings.getPrependUrl(editor)).filter((preUrl) => isString(preUrl) && preUrl.length > 0)
      return futureImageList.map((imageList) => ({
        image,
        imageList,
        classList,
        hasAdvTab,
        hasUploadUrl,
        hasUploadHandler,
        hasDescription,
        hasImageTitle,
        hasDimensions,
        hasImageCaption,
        url,
        basePath,
        credentials,
        handler,
        prependURL,
      }))
    }

    const makeTab$2 = function (info) {
      return {
        title: 'Upload',
        type: 'form',
        items: [{
          type: 'dropzone',
          name: 'fileinput',
          flex: true,
        }],
      }
    }
    const UploadTab = { makeTab: makeTab$2 }

    const createState = function (info) {
      return {
        prevImage: ListUtils.findEntry(info.imageList, info.image.src),
        prevAlt: info.image.alt,
        open: true,
      }
    }
    const fromImageData = function (image) {
      return {
        src: {
          value: image.src,
          meta: {},
        },
        images: image.src,
        alt: image.alt,
        title: image.title,
        dimensions: {
          width: image.width,
          height: image.height,
        },
        classes: image.class,
        caption: image.caption ? 'checked' : 'unchecked',
        style: image.style,
        vspace: image.vspace,
        border: image.border,
        hspace: image.hspace,
        borderstyle: image.borderStyle,
        fileinput: [],
      }
    }
    const toImageData = function (data) {
      return {
        src: data.src.value,
        alt: data.alt,
        title: data.title,
        width: data.dimensions.width,
        height: data.dimensions.height,
        class: data.classes,
        style: data.style,
        caption: data.caption === 'checked',
        hspace: data.hspace,
        vspace: data.vspace,
        border: data.border,
        borderStyle: data.borderstyle,
      }
    }
    const addPrependUrl2 = function (info, srcURL) {
      if (!/^(?:[a-zA-Z]+:)?\/\//.test(srcURL)) {
        return info.prependURL.bind((prependUrl) => {
          if (srcURL.substring(0, prependUrl.length) !== prependUrl) {
            return Option.some(prependUrl + srcURL)
          }
          return Option.none()
        })
      }
      return Option.none()
    }
    const addPrependUrl = function (info, api) {
      const data = api.getData()
      addPrependUrl2(info, data.src.value).each((srcURL) => {
        api.setData({
          src: {
            value: srcURL,
            meta: data.src.meta,
          },
        })
      })
    }
    const formFillFromMeta2 = function (info, data) {
      const { meta } = data.src
      if (meta !== undefined) {
        const dataCopy_1 = deepMerge({}, data)
        if (info.hasDescription && isString(meta.alt)) {
          dataCopy_1.alt = meta.alt
        }
        if (info.hasImageTitle && isString(meta.title)) {
          dataCopy_1.title = meta.title
        }
        if (info.hasDimensions) {
          if (isString(meta.width)) {
            dataCopy_1.dimensions.width = meta.width
          }
          if (isString(meta.height)) {
            dataCopy_1.dimensions.height = meta.height
          }
        }
        if (isString(meta.class)) {
          ListUtils.findEntry(info.classList, meta.class).each((entry) => {
            dataCopy_1.classes = entry.value
          })
        }
        if (info.hasAdvTab) {
          if (isString(meta.vspace)) {
            dataCopy_1.vspace = meta.vspace
          }
          if (isString(meta.border)) {
            dataCopy_1.border = meta.border
          }
          if (isString(meta.hspace)) {
            dataCopy_1.hspace = meta.hspace
          }
          if (isString(meta.borderstyle)) {
            dataCopy_1.borderstyle = meta.borderstyle
          }
        }
        return Option.some(dataCopy_1)
      }
      return Option.none()
    }
    const formFillFromMeta = function (info, api) {
      formFillFromMeta2(info, api.getData()).each((data) => api.setData(data))
    }
    const calculateImageSize = function (helpers, info, state, api) {
      const data = api.getData()
      const url = data.src.value
      const meta = data.src.meta || {}
      if (!meta.width && !meta.height && info.hasDimensions) {
        helpers.imageSize(url).get((result) => {
          result.each((size) => {
            if (state.open) {
              api.setData({ dimensions: size })
            }
          })
        })
      }
    }
    const updateImagesDropdown = function (info, state, api) {
      const data = api.getData()
      const image = ListUtils.findEntry(info.imageList, data.src.value)
      state.prevImage = image
      api.setData({
        images: image.map((entry) => entry.value).getOr(''),
      })
    }
    const changeSrc = function (helpers, info, state, api) {
      addPrependUrl(info, api)
      formFillFromMeta(info, api)
      calculateImageSize(helpers, info, state, api)
      updateImagesDropdown(info, state, api)
    }
    const changeImages = function (helpers, info, state, api) {
      const data = api.getData()
      const image = ListUtils.findEntry(info.imageList, data.images)
      image.each((img) => {
        const updateAlt = data.alt === '' || state.prevImage.map((image) => image.text === data.alt).getOr(false)
        if (updateAlt) {
          if (img.value === '') {
            api.setData({
              src: img,
              alt: state.prevAlt,
            })
          } else {
            api.setData({
              src: img,
              alt: img.text,
            })
          }
        } else {
          api.setData({ src: img })
        }
      })
      state.prevImage = image
      changeSrc(helpers, info, state, api)
    }
    const calcVSpace = function (css) {
      const matchingTopBottom = css['margin-top'] && css['margin-bottom'] && css['margin-top'] === css['margin-bottom']
      return matchingTopBottom ? Utils.removePixelSuffix(String(css['margin-top'])) : ''
    }
    const calcHSpace = function (css) {
      const matchingLeftRight = css['margin-right'] && css['margin-left'] && css['margin-right'] === css['margin-left']
      return matchingLeftRight ? Utils.removePixelSuffix(String(css['margin-right'])) : ''
    }
    const calcBorderWidth = function (css) {
      return css['border-width'] ? Utils.removePixelSuffix(String(css['border-width'])) : ''
    }
    const calcBorderStyle = function (css) {
      return css['border-style'] ? String(css['border-style']) : ''
    }
    const calcStyle = function (parseStyle, serializeStyle, css) {
      return serializeStyle(parseStyle(serializeStyle(css)))
    }
    const changeStyle2 = function (parseStyle, serializeStyle, data) {
      const css = Utils.mergeMargins(parseStyle(data.style))
      const dataCopy = deepMerge({}, data)
      dataCopy.vspace = calcVSpace(css)
      dataCopy.hspace = calcHSpace(css)
      dataCopy.border = calcBorderWidth(css)
      dataCopy.borderstyle = calcBorderStyle(css)
      dataCopy.style = calcStyle(parseStyle, serializeStyle, css)
      return dataCopy
    }
    const changeStyle = function (helpers, api) {
      const data = api.getData()
      const newData = changeStyle2(helpers.parseStyle, helpers.serializeStyle, data)
      api.setData(newData)
    }
    const changeAStyle = function (helpers, info, api) {
      const data = deepMerge(fromImageData(info.image), api.getData())
      const style = getStyleValue(helpers.normalizeCss, toImageData(data))
      api.setData({ style })
    }
    const changeFileInput = function (helpers, info, state, api) {
      const data = api.getData()
      api.block('Uploading image')
      const file = data.fileinput[0]
      const blobUri = URL.createObjectURL(file)
      const uploader = Uploader({
        url: info.url,
        basePath: info.basePath,
        credentials: info.credentials,
        handler: info.handler,
      })
      const finalize = function () {
        api.unblock()
        URL.revokeObjectURL(blobUri)
      }
      Utils.blobToDataUri(file).then((dataUrl) => {
        const blobInfo = helpers.createBlobCache(file, blobUri, dataUrl)
        uploader.upload(blobInfo).then((url) => {
          api.setData({
            src: {
              value: url,
              meta: {},
            },
          })
          api.showTab('General')
          changeSrc(helpers, info, state, api)
          finalize()
        }).catch((err) => {
          finalize()
          helpers.alertErr(api, err)
        })
      })
    }
    const changeHandler = function (helpers, info, state) {
      return function (api, evt) {
        if (evt.name === 'src') {
          changeSrc(helpers, info, state, api)
        } else if (evt.name === 'images') {
          changeImages(helpers, info, state, api)
        } else if (evt.name === 'alt') {
          state.prevAlt = api.getData().alt
        } else if (evt.name === 'style') {
          changeStyle(helpers, api)
        } else if (evt.name === 'vspace' || evt.name === 'hspace' || evt.name === 'border' || evt.name === 'borderstyle') {
          changeAStyle(helpers, info, api)
        } else if (evt.name === 'fileinput') {
          changeFileInput(helpers, info, state, api)
        }
      }
    }
    const closeHandler = function (state) {
      return function () {
        state.open = false
      }
    }
    const makeDialogBody = function (info) {
      if (info.hasAdvTab || info.hasUploadUrl || info.hasUploadHandler) {
        const tabPanel = {
          type: 'tabpanel',
          tabs: flatten([
            [MainTab.makeTab(info)],
            info.hasAdvTab ? [AdvTab.makeTab(info)] : [],
            info.hasUploadUrl || info.hasUploadHandler ? [UploadTab.makeTab(info)] : [],
          ]),
        }
        return tabPanel
      }
      const panel = {
        type: 'panel',
        items: MainTab.makeItems(info),
      }
      return panel
    }
    const makeDialog = function (helpers) {
      return function (info) {
        const state = createState(info)
        return {
          title: 'Insert/Edit Image',
          size: 'normal',
          body: makeDialogBody(info),
          buttons: [
            {
              type: 'cancel',
              name: 'cancel',
              text: 'Cancel',
            },
            {
              type: 'submit',
              name: 'save',
              text: 'Save',
              primary: true,
            },
          ],
          initialData: fromImageData(info.image),
          onSubmit: helpers.onSubmit(info),
          onChange: changeHandler(helpers, info, state),
          onClose: closeHandler(state),
        }
      }
    }
    const submitHandler = function (editor) {
      return function (info) {
        return function (api) {
          const data = deepMerge(fromImageData(info.image), api.getData())
          editor.undoManager.transact(() => {
            insertOrUpdateImage(editor, toImageData(data))
          })
          editor.editorUpload.uploadImagesAuto()
          api.close()
        }
      }
    }
    const imageSize = function (editor) {
      return function (url) {
        return FutureResult.nu((completer) => {
          Utils.getImageSize(editor.documentBaseURI.toAbsolute(url), (data) => {
            const result = data.bind((dimensions) => (isString(dimensions.width) || isNumber(dimensions.width)) && (isString(dimensions.height) || isNumber(dimensions.height)) ? Result.value({
              width: String(dimensions.width),
              height: String(dimensions.height),
            }) : Result.error(undefined))
            completer(result)
          })
        })
      }
    }
    const createBlobCache = function (editor) {
      return function (file, blobUri, dataUrl) {
        return editor.editorUpload.blobCache.create({
          blob: file,
          blobUri,
          name: file.name ? file.name.replace(/\.[^\.]+$/, '') : null,
          base64: dataUrl.split(',')[1],
        })
      }
    }
    const alertErr = function (editor) {
      return function (api, message) {
        editor.windowManager.alert(message, api.close)
      }
    }
    const normalizeCss$1 = function (editor) {
      return function (cssText) {
        return normalizeCss(editor, cssText)
      }
    }
    const parseStyle = function (editor) {
      return function (cssText) {
        return editor.dom.parseStyle(cssText)
      }
    }
    const serializeStyle = function (editor) {
      return function (stylesArg, name) {
        return editor.dom.serializeStyle(stylesArg, name)
      }
    }
    const Dialog = function (editor) {
      const helpers = {
        onSubmit: submitHandler(editor),
        imageSize: imageSize(editor),
        createBlobCache: createBlobCache(editor),
        alertErr: alertErr(editor),
        normalizeCss: normalizeCss$1(editor),
        parseStyle: parseStyle(editor),
        serializeStyle: serializeStyle(editor),
      }
      const open = function () {
        return collect(editor).map(makeDialog(helpers)).get((spec) => {
          editor.windowManager.open(spec)
        })
      }
      return { open }
    }

    const register = function (editor) {
      editor.addCommand('mceImage', Dialog(editor).open)
    }
    const Commands = { register }

    const hasImageClass = function (node) {
      const className = node.attr('class')
      return className && /\bimage\b/.test(className)
    }
    const toggleContentEditableState = function (state) {
      return function (nodes) {
        let i = nodes.length; let node
        const toggleContentEditable = function (node) {
          node.attr('contenteditable', state ? 'true' : null)
        }
        while (i--) {
          node = nodes[i]
          if (hasImageClass(node)) {
            node.attr('contenteditable', state ? 'false' : null)
            global$2.each(node.getAll('figcaption'), toggleContentEditable)
          }
        }
      }
    }
    const setup = function (editor) {
      editor.on('preInit', () => {
        editor.parser.addNodeFilter('figure', toggleContentEditableState(true))
        editor.serializer.addNodeFilter('figure', toggleContentEditableState(false))
      })
    }
    const FilterContent = { setup }

    const fromHtml = function (html, scope) {
      const doc = scope || document
      const div = doc.createElement('div')
      div.innerHTML = html
      if (!div.hasChildNodes() || div.childNodes.length > 1) {
        console.error('HTML does not have a single root node', html)
        throw new Error('HTML must have a single root node')
      }
      return fromDom(div.childNodes[0])
    }
    const fromTag = function (tag, scope) {
      const doc = scope || document
      const node = doc.createElement(tag)
      return fromDom(node)
    }
    const fromText = function (text, scope) {
      const doc = scope || document
      const node = doc.createTextNode(text)
      return fromDom(node)
    }
    var fromDom = function (node) {
      if (node === null || node === undefined) {
        throw new Error('Node cannot be null or undefined')
      }
      return { dom: constant(node) }
    }
    const fromPoint = function (docElm, x, y) {
      const doc = docElm.dom()
      return Option.from(doc.elementFromPoint(x, y)).map(fromDom)
    }
    const Element$$1 = {
      fromHtml,
      fromTag,
      fromText,
      fromDom,
      fromPoint,
    }

    const ATTRIBUTE = Node.ATTRIBUTE_NODE
    const CDATA_SECTION = Node.CDATA_SECTION_NODE
    const COMMENT = Node.COMMENT_NODE
    const DOCUMENT = Node.DOCUMENT_NODE
    const DOCUMENT_TYPE = Node.DOCUMENT_TYPE_NODE
    const DOCUMENT_FRAGMENT = Node.DOCUMENT_FRAGMENT_NODE
    const ELEMENT = Node.ELEMENT_NODE
    const TEXT = Node.TEXT_NODE
    const PROCESSING_INSTRUCTION = Node.PROCESSING_INSTRUCTION_NODE
    const ENTITY_REFERENCE = Node.ENTITY_REFERENCE_NODE
    const ENTITY = Node.ENTITY_NODE
    const NOTATION = Node.NOTATION_NODE

    const name = function (element) {
      const r = element.dom().nodeName
      return r.toLowerCase()
    }

    const Immutable = function () {
      const fields = []
      for (let _i = 0; _i < arguments.length; _i++) {
        fields[_i] = arguments[_i]
      }
      return function () {
        const values = []
        for (let _i = 0; _i < arguments.length; _i++) {
          values[_i] = arguments[_i]
        }
        if (fields.length !== values.length) {
          throw new Error(`Wrong number of arguments to struct. Expected "[${fields.length}]", got ${values.length} arguments`)
        }
        const struct = {}
        each(fields, (name, i) => {
          struct[name] = constant(values[i])
        })
        return struct
      }
    }

    const node = function () {
      const f = Global$1.getOrDie('Node')
      return f
    }
    const compareDocumentPosition = function (a, b, match) {
      return (a.compareDocumentPosition(b) & match) !== 0
    }
    const documentPositionPreceding = function (a, b) {
      return compareDocumentPosition(a, b, node().DOCUMENT_POSITION_PRECEDING)
    }
    const documentPositionContainedBy = function (a, b) {
      return compareDocumentPosition(a, b, node().DOCUMENT_POSITION_CONTAINED_BY)
    }
    const Node$1 = {
      documentPositionPreceding,
      documentPositionContainedBy,
    }

    const cached = function (f) {
      let called = false
      let r
      return function () {
        const args = []
        for (let _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i]
        }
        if (!called) {
          called = true
          r = f.apply(null, args)
        }
        return r
      }
    }

    const firstMatch = function (regexes, s) {
      for (let i = 0; i < regexes.length; i++) {
        const x = regexes[i]
        if (x.test(s)) { return x }
      }
      return undefined
    }
    const find$2 = function (regexes, agent) {
      const r = firstMatch(regexes, agent)
      if (!r) {
        return {
          major: 0,
          minor: 0,
        }
      }
      const group = function (i) {
        return Number(agent.replace(r, `$${i}`))
      }
      return nu$3(group(1), group(2))
    }
    const detect = function (versionRegexes, agent) {
      const cleanedAgent = String(agent).toLowerCase()
      if (versionRegexes.length === 0) { return unknown() }
      return find$2(versionRegexes, cleanedAgent)
    }
    var unknown = function () {
      return nu$3(0, 0)
    }
    var nu$3 = function (major, minor) {
      return {
        major,
        minor,
      }
    }
    const Version = {
      nu: nu$3,
      detect,
      unknown,
    }

    const edge = 'Edge'
    const chrome = 'Chrome'
    const ie = 'IE'
    const opera = 'Opera'
    const firefox = 'Firefox'
    const safari = 'Safari'
    const isBrowser = function (name, current) {
      return function () {
        return current === name
      }
    }
    const unknown$1 = function () {
      return nu$4({
        current: undefined,
        version: Version.unknown(),
      })
    }
    var nu$4 = function (info) {
      const { current } = info
      const { version } = info
      return {
        current,
        version,
        isEdge: isBrowser(edge, current),
        isChrome: isBrowser(chrome, current),
        isIE: isBrowser(ie, current),
        isOpera: isBrowser(opera, current),
        isFirefox: isBrowser(firefox, current),
        isSafari: isBrowser(safari, current),
      }
    }
    const Browser = {
      unknown: unknown$1,
      nu: nu$4,
      edge: constant(edge),
      chrome: constant(chrome),
      ie: constant(ie),
      opera: constant(opera),
      firefox: constant(firefox),
      safari: constant(safari),
    }

    const windows = 'Windows'
    const ios = 'iOS'
    const android = 'Android'
    const linux = 'Linux'
    const osx = 'OSX'
    const solaris = 'Solaris'
    const freebsd = 'FreeBSD'
    const isOS = function (name, current) {
      return function () {
        return current === name
      }
    }
    const unknown$2 = function () {
      return nu$5({
        current: undefined,
        version: Version.unknown(),
      })
    }
    var nu$5 = function (info) {
      const { current } = info
      const { version } = info
      return {
        current,
        version,
        isWindows: isOS(windows, current),
        isiOS: isOS(ios, current),
        isAndroid: isOS(android, current),
        isOSX: isOS(osx, current),
        isLinux: isOS(linux, current),
        isSolaris: isOS(solaris, current),
        isFreeBSD: isOS(freebsd, current),
      }
    }
    const OperatingSystem = {
      unknown: unknown$2,
      nu: nu$5,
      windows: constant(windows),
      ios: constant(ios),
      android: constant(android),
      linux: constant(linux),
      osx: constant(osx),
      solaris: constant(solaris),
      freebsd: constant(freebsd),
    }

    const DeviceType = function (os, browser, userAgent) {
      const isiPad = os.isiOS() && /ipad/i.test(userAgent) === true
      const isiPhone = os.isiOS() && !isiPad
      const isAndroid3 = os.isAndroid() && os.version.major === 3
      const isAndroid4 = os.isAndroid() && os.version.major === 4
      const isTablet = isiPad || isAndroid3 || isAndroid4 && /mobile/i.test(userAgent) === true
      const isTouch = os.isiOS() || os.isAndroid()
      const isPhone = isTouch && !isTablet
      const iOSwebview = browser.isSafari() && os.isiOS() && /safari/i.test(userAgent) === false
      return {
        isiPad: constant(isiPad),
        isiPhone: constant(isiPhone),
        isTablet: constant(isTablet),
        isPhone: constant(isPhone),
        isTouch: constant(isTouch),
        isAndroid: os.isAndroid,
        isiOS: os.isiOS,
        isWebView: constant(iOSwebview),
      }
    }

    const detect$1 = function (candidates, userAgent) {
      const agent = String(userAgent).toLowerCase()
      return find(candidates, (candidate) => candidate.search(agent))
    }
    const detectBrowser = function (browsers, userAgent) {
      return detect$1(browsers, userAgent).map((browser) => {
        const version = Version.detect(browser.versionRegexes, userAgent)
        return {
          current: browser.name,
          version,
        }
      })
    }
    const detectOs = function (oses, userAgent) {
      return detect$1(oses, userAgent).map((os) => {
        const version = Version.detect(os.versionRegexes, userAgent)
        return {
          current: os.name,
          version,
        }
      })
    }
    const UaString = {
      detectBrowser,
      detectOs,
    }

    const contains$1 = function (str, substr) {
      return str.indexOf(substr) !== -1
    }

    const normalVersionRegex = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/
    const checkContains = function (target) {
      return function (uastring) {
        return contains$1(uastring, target)
      }
    }
    const browsers = [
      {
        name: 'Edge',
        versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
        search(uastring) {
          const monstrosity = contains$1(uastring, 'edge/') && contains$1(uastring, 'chrome') && contains$1(uastring, 'safari') && contains$1(uastring, 'applewebkit')
          return monstrosity
        },
      },
      {
        name: 'Chrome',
        versionRegexes: [
          /.*?chrome\/([0-9]+)\.([0-9]+).*/,
          normalVersionRegex,
        ],
        search(uastring) {
          return contains$1(uastring, 'chrome') && !contains$1(uastring, 'chromeframe')
        },
      },
      {
        name: 'IE',
        versionRegexes: [
          /.*?msie\ ?([0-9]+)\.([0-9]+).*/,
          /.*?rv:([0-9]+)\.([0-9]+).*/,
        ],
        search(uastring) {
          return contains$1(uastring, 'msie') || contains$1(uastring, 'trident')
        },
      },
      {
        name: 'Opera',
        versionRegexes: [
          normalVersionRegex,
          /.*?opera\/([0-9]+)\.([0-9]+).*/,
        ],
        search: checkContains('opera'),
      },
      {
        name: 'Firefox',
        versionRegexes: [/.*?firefox\/\ ?([0-9]+)\.([0-9]+).*/],
        search: checkContains('firefox'),
      },
      {
        name: 'Safari',
        versionRegexes: [
          normalVersionRegex,
          /.*?cpu os ([0-9]+)_([0-9]+).*/,
        ],
        search(uastring) {
          return (contains$1(uastring, 'safari') || contains$1(uastring, 'mobile/')) && contains$1(uastring, 'applewebkit')
        },
      },
    ]
    const oses = [
      {
        name: 'Windows',
        search: checkContains('win'),
        versionRegexes: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/],
      },
      {
        name: 'iOS',
        search(uastring) {
          return contains$1(uastring, 'iphone') || contains$1(uastring, 'ipad')
        },
        versionRegexes: [
          /.*?version\/\ ?([0-9]+)\.([0-9]+).*/,
          /.*cpu os ([0-9]+)_([0-9]+).*/,
          /.*cpu iphone os ([0-9]+)_([0-9]+).*/,
        ],
      },
      {
        name: 'Android',
        search: checkContains('android'),
        versionRegexes: [/.*?android\ ?([0-9]+)\.([0-9]+).*/],
      },
      {
        name: 'OSX',
        search: checkContains('os x'),
        versionRegexes: [/.*?os\ x\ ?([0-9]+)_([0-9]+).*/],
      },
      {
        name: 'Linux',
        search: checkContains('linux'),
        versionRegexes: [],
      },
      {
        name: 'Solaris',
        search: checkContains('sunos'),
        versionRegexes: [],
      },
      {
        name: 'FreeBSD',
        search: checkContains('freebsd'),
        versionRegexes: [],
      },
    ]
    const PlatformInfo = {
      browsers: constant(browsers),
      oses: constant(oses),
    }

    const detect$2 = function (userAgent) {
      const browsers = PlatformInfo.browsers()
      const oses = PlatformInfo.oses()
      const browser = UaString.detectBrowser(browsers, userAgent).fold(Browser.unknown, Browser.nu)
      const os = UaString.detectOs(oses, userAgent).fold(OperatingSystem.unknown, OperatingSystem.nu)
      const deviceType = DeviceType(os, browser, userAgent)
      return {
        browser,
        os,
        deviceType,
      }
    }
    const PlatformDetection = { detect: detect$2 }

    const detect$3 = cached(() => {
      const { userAgent } = navigator
      return PlatformDetection.detect(userAgent)
    })
    const PlatformDetection$1 = { detect: detect$3 }

    const regularContains = function (e1, e2) {
      const d1 = e1.dom()
      const d2 = e2.dom()
      return d1 === d2 ? false : d1.contains(d2)
    }
    const ieContains = function (e1, e2) {
      return Node$1.documentPositionContainedBy(e1.dom(), e2.dom())
    }
    const { browser } = PlatformDetection$1.detect()
    const contains$2 = browser.isIE() ? ieContains : regularContains

    const parent = function (element) {
      const dom = element.dom()
      return Option.from(dom.parentNode).map(Element$$1.fromDom)
    }
    const spot = Immutable('element', 'offset')

    const getRootElement = function (elm) {
      return parent(elm).filter((parentElm) => name(parentElm) === 'figure').getOr(elm)
    }
    const register$1 = function (editor) {
      const makeContextMenuItem = function (node) {
        return {
          text: 'Image',
          icon: 'image',
          onAction() {
            const rootElm = getRootElement(Element$$1.fromDom(node))
            editor.selection.select(rootElm.dom())
            Dialog(editor).open()
          },
        }
      }
      editor.ui.registry.addToggleButton('image', {
        icon: 'image',
        tooltip: 'Insert/edit image',
        onAction: Dialog(editor).open,
        onSetup(buttonApi) {
          return editor.selection.selectorChangedWithUnbind('img:not([data-mce-object],[data-mce-placeholder]),figure.image', buttonApi.setActive).unbind
        },
      })
      editor.ui.registry.addMenuItem('image', {
        icon: 'image',
        text: 'Image...',
        onAction: Dialog(editor).open,
      })
      editor.ui.registry.addContextMenu('image', {
        update(element) {
          return isFigure(element) || isImage(element) ? [makeContextMenuItem(element)] : []
        },
      })
    }
    const Buttons = { register: register$1 }

    global.add('image', (editor) => {
      FilterContent.setup(editor)
      Buttons.register(editor)
      Commands.register(editor)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
