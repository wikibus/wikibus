// 5.0.0-rc-1-build.3 (TBD)
(function () {
  (function () {
    const noop = function () {
      const args = []
      for (let _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i]
      }
    }
    const compose = function (fa, fb) {
      return function () {
        const args = []
        for (let _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i]
        }
        return fa(fb.apply(null, args))
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
    function curry(fn) {
      const initialArgs = []
      for (let _i = 1; _i < arguments.length; _i++) {
        initialArgs[_i - 1] = arguments[_i]
      }
      return function () {
        const restArgs = []
        for (let _i = 0; _i < arguments.length; _i++) {
          restArgs[_i] = arguments[_i]
        }
        const all = initialArgs.concat(restArgs)
        return fn.apply(null, all)
      }
    }
    const not = function (f) {
      return function () {
        const args = []
        for (let _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i]
        }
        return !f.apply(null, args)
      }
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
    const isArray = isType('array')
    const isNull = isType('null')
    const isBoolean = isType('boolean')
    const isFunction = isType('function')
    const isNumber = isType('number')

    const rawIndexOf = (function () {
      const pIndexOf = Array.prototype.indexOf
      const fastIndex = function (xs, x) {
        return pIndexOf.call(xs, x)
      }
      const slowIndex = function (xs, x) {
        return slowIndexOf(xs, x)
      }
      return pIndexOf === undefined ? slowIndex : fastIndex
    }())
    const indexOf = function (xs, x) {
      const r = rawIndexOf(xs, x)
      return r === -1 ? Option.none() : Option.some(r)
    }
    const contains = function (xs, x) {
      return rawIndexOf(xs, x) > -1
    }
    const exists = function (xs, pred) {
      return findIndex(xs, pred).isSome()
    }
    const map = function (xs, f) {
      const len = xs.length
      const r = new Array(len)
      for (let i = 0; i < len; i++) {
        const x = xs[i]
        r[i] = f(x, i, xs)
      }
      return r
    }
    const each = function (xs, f) {
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i]
        f(x, i, xs)
      }
    }
    const eachr = function (xs, f) {
      for (let i = xs.length - 1; i >= 0; i--) {
        const x = xs[i]
        f(x, i, xs)
      }
    }
    const partition = function (xs, pred) {
      const pass = []
      const fail = []
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i]
        const arr = pred(x, i, xs) ? pass : fail
        arr.push(x)
      }
      return {
        pass,
        fail,
      }
    }
    const filter = function (xs, pred) {
      const r = []
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i]
        if (pred(x, i, xs)) {
          r.push(x)
        }
      }
      return r
    }
    const foldr = function (xs, f, acc) {
      eachr(xs, (x) => {
        acc = f(acc, x)
      })
      return acc
    }
    const foldl = function (xs, f, acc) {
      each(xs, (x) => {
        acc = f(acc, x)
      })
      return acc
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
    var findIndex = function (xs, pred) {
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i]
        if (pred(x, i, xs)) {
          return Option.some(i)
        }
      }
      return Option.none()
    }
    var slowIndexOf = function (xs, x) {
      for (let i = 0, len = xs.length; i < len; ++i) {
        if (xs[i] === x) {
          return i
        }
      }
      return -1
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
    const bind = function (xs, f) {
      const output = map(xs, f)
      return flatten(output)
    }
    const forall = function (xs, pred) {
      for (let i = 0, len = xs.length; i < len; ++i) {
        const x = xs[i]
        if (pred(x, i, xs) !== true) {
          return false
        }
      }
      return true
    }
    const { slice } = Array.prototype
    const reverse = function (xs) {
      const r = slice.call(xs, 0)
      r.reverse()
      return r
    }
    const difference = function (a1, a2) {
      return filter(a1, (x) => !contains(a2, x))
    }
    const mapToObject = function (xs, f) {
      const r = {}
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i]
        r[String(x)] = f(x, i)
      }
      return r
    }
    const sort = function (xs, comparator) {
      const copy = slice.call(xs, 0)
      copy.sort(comparator)
      return copy
    }
    const head = function (xs) {
      return xs.length === 0 ? Option.none() : Option.some(xs[0])
    }
    const last = function (xs) {
      return xs.length === 0 ? Option.none() : Option.some(xs[xs.length - 1])
    }
    const from$1 = isFunction(Array.from) ? Array.from : function (x) {
      return slice.call(x)
    }

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

    const nav = navigator; const { userAgent } = nav
    let opera, webkit, ie, ie11, ie12, gecko, mac, iDevice, android, fileApi, phone, tablet, windowsPhone
    const matchMediaQuery = function (query) {
      return 'matchMedia' in window ? matchMedia(query).matches : false
    }
    opera = false
    android = /Android/.test(userAgent)
    webkit = /WebKit/.test(userAgent)
    ie = !webkit && !opera && /MSIE/gi.test(userAgent) && /Explorer/gi.test(nav.appName)
    ie = ie && /MSIE (\w+)\./.exec(userAgent)[1]
    ie11 = userAgent.indexOf('Trident/') !== -1 && (userAgent.indexOf('rv:') !== -1 || nav.appName.indexOf('Netscape') !== -1) ? 11 : false
    ie12 = userAgent.indexOf('Edge/') !== -1 && !ie && !ie11 ? 12 : false
    ie = ie || ie11 || ie12
    gecko = !webkit && !ie11 && /Gecko/.test(userAgent)
    mac = userAgent.indexOf('Mac') !== -1
    iDevice = /(iPad|iPhone)/.test(userAgent)
    fileApi = 'FormData' in window && 'FileReader' in window && 'URL' in window && !!URL.createObjectURL
    phone = matchMediaQuery('only screen and (max-device-width: 480px)') && (android || iDevice)
    tablet = matchMediaQuery('only screen and (min-width: 800px)') && (android || iDevice)
    windowsPhone = userAgent.indexOf('Windows Phone') !== -1
    if (ie12) {
      webkit = false
    }
    const contentEditable = !iDevice || fileApi || parseInt(userAgent.match(/AppleWebKit\/(\d*)/)[1], 10) >= 534
    const Env = {
      opera,
      webkit,
      ie,
      gecko,
      mac,
      iOS: iDevice,
      android,
      contentEditable,
      transparentSrc: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      caretAfter: ie !== 8,
      range: window.getSelection && 'Range' in window,
      documentMode: ie && !ie12 ? document.documentMode || 7 : 10,
      fileApi,
      ceFalse: ie === false || ie > 8,
      cacheSuffix: null,
      container: null,
      overrideViewPort: null,
      experimentalShadowDom: false,
      canHaveCSP: ie === false || ie > 11,
      desktop: !phone && !tablet,
      windowsPhone,
    }

    const promise = function () {
      function bind(fn, thisArg) {
        return function () {
          fn.apply(thisArg, arguments)
        }
      }
      const isArray = Array.isArray || function (value) {
        return Object.prototype.toString.call(value) === '[object Array]'
      }
      const Promise = function (fn) {
        if (typeof this !== 'object') {
          throw new TypeError('Promises must be constructed via new')
        }
        if (typeof fn !== 'function') {
          throw new TypeError('not a function')
        }
        this._state = null
        this._value = null
        this._deferreds = []
        doResolve(fn, bind(resolve, this), bind(reject, this))
      }
      const asap = Promise.immediateFn || typeof setImmediate === 'function' && setImmediate || function (fn) {
        setTimeout(fn, 1)
      }
      function handle(deferred) {
        const me = this
        if (this._state === null) {
          this._deferreds.push(deferred)
          return
        }
        asap(() => {
          const cb = me._state ? deferred.onFulfilled : deferred.onRejected
          if (cb === null) {
            (me._state ? deferred.resolve : deferred.reject)(me._value)
            return
          }
          let ret
          try {
            ret = cb(me._value)
          } catch (e) {
            deferred.reject(e)
            return
          }
          deferred.resolve(ret)
        })
      }
      function resolve(newValue) {
        try {
          if (newValue === this) {
            throw new TypeError('A promise cannot be resolved with itself.')
          }
          if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
            const { then } = newValue
            if (typeof then === 'function') {
              doResolve(bind(then, newValue), bind(resolve, this), bind(reject, this))
              return
            }
          }
          this._state = true
          this._value = newValue
          finale.call(this)
        } catch (e) {
          reject.call(this, e)
        }
      }
      function reject(newValue) {
        this._state = false
        this._value = newValue
        finale.call(this)
      }
      function finale() {
        for (let i = 0, len = this._deferreds.length; i < len; i++) {
          handle.call(this, this._deferreds[i])
        }
        this._deferreds = null
      }
      function Handler(onFulfilled, onRejected, resolve, reject) {
        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null
        this.onRejected = typeof onRejected === 'function' ? onRejected : null
        this.resolve = resolve
        this.reject = reject
      }
      function doResolve(fn, onFulfilled, onRejected) {
        let done = false
        try {
          fn((value) => {
            if (done) {
              return
            }
            done = true
            onFulfilled(value)
          }, (reason) => {
            if (done) {
              return
            }
            done = true
            onRejected(reason)
          })
        } catch (ex) {
          if (done) {
            return
          }
          done = true
          onRejected(ex)
        }
      }
      Promise.prototype.catch = function (onRejected) {
        return this.then(null, onRejected)
      }
      Promise.prototype.then = function (onFulfilled, onRejected) {
        const me = this
        return new Promise((resolve, reject) => {
          handle.call(me, new Handler(onFulfilled, onRejected, resolve, reject))
        })
      }
      Promise.all = function () {
        const args = Array.prototype.slice.call(arguments.length === 1 && isArray(arguments[0]) ? arguments[0] : arguments)
        return new Promise((resolve, reject) => {
          if (args.length === 0) {
            return resolve([])
          }
          let remaining = args.length
          function res(i, val) {
            try {
              if (val && (typeof val === 'object' || typeof val === 'function')) {
                const { then } = val
                if (typeof then === 'function') {
                  then.call(val, (val) => {
                    res(i, val)
                  }, reject)
                  return
                }
              }
              args[i] = val
              if (--remaining === 0) {
                resolve(args)
              }
            } catch (ex) {
              reject(ex)
            }
          }
          for (let i = 0; i < args.length; i++) {
            res(i, args[i])
          }
        })
      }
      Promise.resolve = function (value) {
        if (value && typeof value === 'object' && value.constructor === Promise) {
          return value
        }
        return new Promise((resolve) => {
          resolve(value)
        })
      }
      Promise.reject = function (value) {
        return new Promise((resolve, reject) => {
          reject(value)
        })
      }
      Promise.race = function (values) {
        return new Promise((resolve, reject) => {
          for (let i = 0, len = values.length; i < len; i++) {
            values[i].then(resolve, reject)
          }
        })
      }
      return Promise
    }
    const promiseObj = window.Promise ? window.Promise : promise()

    let requestAnimationFramePromise
    const requestAnimationFrame$$1 = function (callback, element) {
      let i; let requestAnimationFrameFunc = window.requestAnimationFrame
      const vendors = [
        'ms',
        'moz',
        'webkit',
      ]
      const featurefill = function (callback) {
        window.setTimeout(callback, 0)
      }
      for (i = 0; i < vendors.length && !requestAnimationFrameFunc; i++) {
        requestAnimationFrameFunc = window[`${vendors[i]}RequestAnimationFrame`]
      }
      if (!requestAnimationFrameFunc) {
        requestAnimationFrameFunc = featurefill
      }
      requestAnimationFrameFunc(callback, element)
    }
    const wrappedSetTimeout = function (callback, time) {
      if (typeof time !== 'number') {
        time = 0
      }
      return setTimeout(callback, time)
    }
    const wrappedSetInterval = function (callback, time) {
      if (typeof time !== 'number') {
        time = 1
      }
      return setInterval(callback, time)
    }
    const wrappedClearTimeout = function (id) {
      return clearTimeout(id)
    }
    const wrappedClearInterval = function (id) {
      return clearInterval(id)
    }
    const debounce = function (callback, time) {
      let timer, func
      func = function () {
        const args = arguments
        clearTimeout(timer)
        timer = wrappedSetTimeout(function () {
          callback.apply(this, args)
        }, time)
      }
      func.stop = function () {
        clearTimeout(timer)
      }
      return func
    }
    const Delay = {
      requestAnimationFrame(callback, element) {
        if (requestAnimationFramePromise) {
          requestAnimationFramePromise.then(callback)
          return
        }
        requestAnimationFramePromise = new promiseObj((resolve) => {
          if (!element) {
            element = document.body
          }
          requestAnimationFrame$$1(resolve, element)
        }).then(callback)
      },
      setTimeout: wrappedSetTimeout,
      setInterval: wrappedSetInterval,
      setEditorTimeout(editor, callback, time) {
        return wrappedSetTimeout(() => {
          if (!editor.removed) {
            callback()
          }
        }, time)
      },
      setEditorInterval(editor, callback, time) {
        let timer
        timer = wrappedSetInterval(() => {
          if (!editor.removed) {
            callback()
          } else {
            clearInterval(timer)
          }
        }, time)
        return timer
      },
      debounce,
      throttle: debounce,
      clearInterval: wrappedClearInterval,
      clearTimeout: wrappedClearTimeout,
    }

    const eventExpandoPrefix = 'mce-data-'
    const mouseEventRe = /^(?:mouse|contextmenu)|click/
    const deprecated = {
      keyLocation: 1,
      layerX: 1,
      layerY: 1,
      returnValue: 1,
      webkitMovementX: 1,
      webkitMovementY: 1,
      keyIdentifier: 1,
    }
    const hasIsDefaultPrevented = function (event$$1) {
      return event$$1.isDefaultPrevented === returnTrue || event$$1.isDefaultPrevented === returnFalse
    }
    var returnFalse = function () {
      return false
    }
    var returnTrue = function () {
      return true
    }
    const addEvent = function (target, name$$1, callback, capture) {
      if (target.addEventListener) {
        target.addEventListener(name$$1, callback, capture || false)
      } else if (target.attachEvent) {
        target.attachEvent(`on${name$$1}`, callback)
      }
    }
    const removeEvent = function (target, name$$1, callback, capture) {
      if (target.removeEventListener) {
        target.removeEventListener(name$$1, callback, capture || false)
      } else if (target.detachEvent) {
        target.detachEvent(`on${name$$1}`, callback)
      }
    }
    const getTargetFromShadowDom = function (event$$1, defaultTarget) {
      if (event$$1.composedPath) {
        const composedPath = event$$1.composedPath()
        if (composedPath && composedPath.length > 0) {
          return composedPath[0]
        }
      }
      return defaultTarget
    }
    const fix = function (originalEvent, data) {
      let name$$1
      const event$$1 = data || {}
      for (name$$1 in originalEvent) {
        if (!deprecated[name$$1]) {
          event$$1[name$$1] = originalEvent[name$$1]
        }
      }
      if (!event$$1.target) {
        event$$1.target = event$$1.srcElement || document
      }
      if (Env.experimentalShadowDom) {
        event$$1.target = getTargetFromShadowDom(originalEvent, event$$1.target)
      }
      if (originalEvent && mouseEventRe.test(originalEvent.type) && originalEvent.pageX === undefined && originalEvent.clientX !== undefined) {
        const eventDoc = event$$1.target.ownerDocument || document
        const doc = eventDoc.documentElement
        const { body } = eventDoc
        event$$1.pageX = originalEvent.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0)
        event$$1.pageY = originalEvent.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0)
      }
      event$$1.preventDefault = function () {
        event$$1.isDefaultPrevented = returnTrue
        if (originalEvent) {
          if (originalEvent.preventDefault) {
            originalEvent.preventDefault()
          } else {
            originalEvent.returnValue = false
          }
        }
      }
      event$$1.stopPropagation = function () {
        event$$1.isPropagationStopped = returnTrue
        if (originalEvent) {
          if (originalEvent.stopPropagation) {
            originalEvent.stopPropagation()
          } else {
            originalEvent.cancelBubble = true
          }
        }
      }
      event$$1.stopImmediatePropagation = function () {
        event$$1.isImmediatePropagationStopped = returnTrue
        event$$1.stopPropagation()
      }
      if (hasIsDefaultPrevented(event$$1) === false) {
        event$$1.isDefaultPrevented = returnFalse
        event$$1.isPropagationStopped = returnFalse
        event$$1.isImmediatePropagationStopped = returnFalse
      }
      if (typeof event$$1.metaKey === 'undefined') {
        event$$1.metaKey = false
      }
      return event$$1
    }
    const bindOnReady = function (win, callback, eventUtils) {
      const doc = win.document; const event$$1 = { type: 'ready' }
      if (eventUtils.domLoaded) {
        callback(event$$1)
        return
      }
      const isDocReady = function () {
        return doc.readyState === 'complete' || doc.readyState === 'interactive' && doc.body
      }
      var readyHandler = function () {
        removeEvent(win, 'DOMContentLoaded', readyHandler)
        removeEvent(win, 'load', readyHandler)
        if (!eventUtils.domLoaded) {
          eventUtils.domLoaded = true
          callback(event$$1)
        }
      }
      var waitForDomLoaded = function () {
        if (isDocReady()) {
          removeEvent(doc, 'readystatechange', waitForDomLoaded)
          readyHandler()
        }
      }
      var tryScroll = function () {
        try {
          doc.documentElement.doScroll('left')
        } catch (ex) {
          Delay.setTimeout(tryScroll)
          return
        }
        readyHandler()
      }
      if (doc.addEventListener && !(Env.ie && Env.ie < 11)) {
        if (isDocReady()) {
          readyHandler()
        } else {
          addEvent(win, 'DOMContentLoaded', readyHandler)
        }
      } else {
        addEvent(doc, 'readystatechange', waitForDomLoaded)
        if (doc.documentElement.doScroll && win.self === win.top) {
          tryScroll()
        }
      }
      addEvent(win, 'load', readyHandler)
    }
    const EventUtils = function () {
      const self$$1 = this
      let events = {}; let count; let expando; let hasFocusIn; let hasMouseEnterLeave; let mouseEnterLeave
      expando = eventExpandoPrefix + (+new Date()).toString(32)
      hasMouseEnterLeave = 'onmouseenter' in document.documentElement
      hasFocusIn = 'onfocusin' in document.documentElement
      mouseEnterLeave = {
        mouseenter: 'mouseover',
        mouseleave: 'mouseout',
      }
      count = 1
      self$$1.domLoaded = false
      self$$1.events = events
      const executeHandlers = function (evt, id) {
        let callbackList, i, l, callback
        const container = events[id]
        callbackList = container && container[evt.type]
        if (callbackList) {
          for (i = 0, l = callbackList.length; i < l; i++) {
            callback = callbackList[i]
            if (callback && callback.func.call(callback.scope, evt) === false) {
              evt.preventDefault()
            }
            if (evt.isImmediatePropagationStopped()) {
              return
            }
          }
        }
      }
      self$$1.bind = function (target, names, callback, scope) {
        let id, callbackList, i, name$$1, fakeName, nativeHandler, capture
        const win = window
        const defaultNativeHandler = function (evt) {
          executeHandlers(fix(evt || win.event), id)
        }
        if (!target || target.nodeType === 3 || target.nodeType === 8) {
          return
        }
        if (!target[expando]) {
          id = count++
          target[expando] = id
          events[id] = {}
        } else {
          id = target[expando]
        }
        scope = scope || target
        names = names.split(' ')
        i = names.length
        while (i--) {
          name$$1 = names[i]
          nativeHandler = defaultNativeHandler
          fakeName = capture = false
          if (name$$1 === 'DOMContentLoaded') {
            name$$1 = 'ready'
          }
          if (self$$1.domLoaded && name$$1 === 'ready' && target.readyState === 'complete') {
            callback.call(scope, fix({ type: name$$1 }))
            continue
          }
          if (!hasMouseEnterLeave) {
            fakeName = mouseEnterLeave[name$$1]
            if (fakeName) {
              nativeHandler = function (evt) {
                let current, related
                current = evt.currentTarget
                related = evt.relatedTarget
                if (related && current.contains) {
                  related = current.contains(related)
                } else {
                  while (related && related !== current) {
                    related = related.parentNode
                  }
                }
                if (!related) {
                  evt = fix(evt || win.event)
                  evt.type = evt.type === 'mouseout' ? 'mouseleave' : 'mouseenter'
                  evt.target = current
                  executeHandlers(evt, id)
                }
              }
            }
          }
          if (!hasFocusIn && (name$$1 === 'focusin' || name$$1 === 'focusout')) {
            capture = true
            fakeName = name$$1 === 'focusin' ? 'focus' : 'blur'
            nativeHandler = function (evt) {
              evt = fix(evt || win.event)
              evt.type = evt.type === 'focus' ? 'focusin' : 'focusout'
              executeHandlers(evt, id)
            }
          }
          callbackList = events[id][name$$1]
          if (!callbackList) {
            events[id][name$$1] = callbackList = [{
              func: callback,
              scope,
            }]
            callbackList.fakeName = fakeName
            callbackList.capture = capture
            callbackList.nativeHandler = nativeHandler
            if (name$$1 === 'ready') {
              bindOnReady(target, nativeHandler, self$$1)
            } else {
              addEvent(target, fakeName || name$$1, nativeHandler, capture)
            }
          } else if (name$$1 === 'ready' && self$$1.domLoaded) {
            callback({ type: name$$1 })
          } else {
            callbackList.push({
              func: callback,
              scope,
            })
          }
        }
        target = callbackList = 0
        return callback
      }
      self$$1.unbind = function (target, names, callback) {
        let id, callbackList, i, ci, name$$1, eventMap
        if (!target || target.nodeType === 3 || target.nodeType === 8) {
          return self$$1
        }
        id = target[expando]
        if (id) {
          eventMap = events[id]
          if (names) {
            names = names.split(' ')
            i = names.length
            while (i--) {
              name$$1 = names[i]
              callbackList = eventMap[name$$1]
              if (callbackList) {
                if (callback) {
                  ci = callbackList.length
                  while (ci--) {
                    if (callbackList[ci].func === callback) {
                      const { nativeHandler } = callbackList
                      const { fakeName } = callbackList; const { capture } = callbackList
                      callbackList = callbackList.slice(0, ci).concat(callbackList.slice(ci + 1))
                      callbackList.nativeHandler = nativeHandler
                      callbackList.fakeName = fakeName
                      callbackList.capture = capture
                      eventMap[name$$1] = callbackList
                    }
                  }
                }
                if (!callback || callbackList.length === 0) {
                  delete eventMap[name$$1]
                  removeEvent(target, callbackList.fakeName || name$$1, callbackList.nativeHandler, callbackList.capture)
                }
              }
            }
          } else {
            for (name$$1 in eventMap) {
              callbackList = eventMap[name$$1]
              removeEvent(target, callbackList.fakeName || name$$1, callbackList.nativeHandler, callbackList.capture)
            }
            eventMap = {}
          }
          for (name$$1 in eventMap) {
            return self$$1
          }
          delete events[id]
          try {
            delete target[expando]
          } catch (ex) {
            target[expando] = null
          }
        }
        return self$$1
      }
      self$$1.fire = function (target, name$$1, args) {
        let id
        if (!target || target.nodeType === 3 || target.nodeType === 8) {
          return self$$1
        }
        args = fix(null, args)
        args.type = name$$1
        args.target = target
        do {
          id = target[expando]
          if (id) {
            executeHandlers(args, id)
          }
          target = target.parentNode || target.ownerDocument || target.defaultView || target.parentWindow
        } while (target && !args.isPropagationStopped())
        return self$$1
      }
      self$$1.clean = function (target) {
        let i, children
        const { unbind } = self$$1
        if (!target || target.nodeType === 3 || target.nodeType === 8) {
          return self$$1
        }
        if (target[expando]) {
          unbind(target)
        }
        if (!target.getElementsByTagName) {
          target = target.document
        }
        if (target && target.getElementsByTagName) {
          unbind(target)
          children = target.getElementsByTagName('*')
          i = children.length
          while (i--) {
            target = children[i]
            if (target[expando]) {
              unbind(target)
            }
          }
        }
        return self$$1
      }
      self$$1.destroy = function () {
        events = {}
      }
      self$$1.cancel = function (e) {
        if (e) {
          e.preventDefault()
          e.stopImmediatePropagation()
        }
        return false
      }
    }
    EventUtils.Event = new EventUtils()
    EventUtils.Event.bind(window, 'ready', () => {
    })

    let i; let support; let Expr; let getText; let isXML; let tokenize; let compile; let select; let outermostContext; let sortInput; let hasDuplicate; let setDocument; let document$1; let docElem; let documentIsHTML; let rbuggyQSA; let rbuggyMatches; let matches; let contains$1; const expando = `sizzle${-new Date()}`; const preferredDoc = window.document; let dirruns = 0; let done = 0; const classCache = createCache(); const tokenCache = createCache(); const compilerCache = createCache(); let sortOrder = function (a, b) {
      if (a === b) {
        hasDuplicate = true
      }
      return 0
    }; const strundefined = typeof undefined; const MAX_NEGATIVE = 1 << 31; const hasOwn = {}.hasOwnProperty; let arr = []; const { pop } = arr; const push_native = arr.push; let push$1 = arr.push; const slice$1 = arr.slice; const indexOf$1 = arr.indexOf || function (elem) {
      let i = 0; const len = this.length
      for (; i < len; i++) {
        if (this[i] === elem) {
          return i
        }
      }
      return -1
    }; const booleans = 'checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped'; const whitespace = '[\\x20\\t\\r\\n\\f]'; const identifier = '(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+'; const attributes = `\\[${whitespace}*(${identifier})(?:${whitespace}*([*^$|!~]?=)${whitespace}*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(${identifier}))|)${whitespace}*\\]`; const pseudos = `:(${identifier})(?:\\((` + `('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|` + `((?:\\\\.|[^\\\\()[\\]]|${attributes})*)|` + `.*` + `)\\)|)`; const rtrim = new RegExp(`^${whitespace}+|((?:^|[^\\\\])(?:\\\\.)*)${whitespace}+$`, 'g'); const rcomma = new RegExp(`^${whitespace}*,${whitespace}*`); const rcombinators = new RegExp(`^${whitespace}*([>+~]|${whitespace})${whitespace}*`); const rattributeQuotes = new RegExp(`=${whitespace}*([^\\]'"]*?)${whitespace}*\\]`, 'g'); const rpseudo = new RegExp(pseudos); const ridentifier = new RegExp(`^${identifier}$`); const matchExpr = {
      ID: new RegExp(`^#(${identifier})`),
      CLASS: new RegExp(`^\\.(${identifier})`),
      TAG: new RegExp(`^(${identifier}|[*])`),
      ATTR: new RegExp(`^${attributes}`),
      PSEUDO: new RegExp(`^${pseudos}`),
      CHILD: new RegExp(`^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(${whitespace}*(even|odd|(([+-]|)(\\d*)n|)${whitespace}*(?:([+-]|)${whitespace}*(\\d+)|))${whitespace}*\\)|)`, 'i'),
      bool: new RegExp(`^(?:${booleans})$`, 'i'),
      needsContext: new RegExp(`^${whitespace}*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(${whitespace}*((?:-\\d)?\\d*)${whitespace}*\\)|)(?=[^-]|$)`, 'i'),
    }; const rinputs = /^(?:input|select|textarea|button)$/i; const rheader = /^h\d$/i; const rnative = /^[^{]+\{\s*\[native \w/; const rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/; const rsibling = /[+~]/; const rescape = /'|\\/g; const runescape = new RegExp(`\\\\([\\da-f]{1,6}${whitespace}?|(${whitespace})|.)`, 'ig'); const funescape = function (_, escaped, escapedWhitespace) {
      const high = `0x${escaped}` - 65536
      return high !== high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320)
    }
    try {
      push$1.apply(arr = slice$1.call(preferredDoc.childNodes), preferredDoc.childNodes)
      arr[preferredDoc.childNodes.length].nodeType
    } catch (e) {
      push$1 = {
        apply: arr.length ? function (target, els) {
          push_native.apply(target, slice$1.call(els))
        } : function (target, els) {
          let j = target.length; let i = 0
          while (target[j++] = els[i++]) {
          }
          target.length = j - 1
        },
      }
    }
    const Sizzle = function (selector, context, results, seed) {
      let match, elem, m, nodeType, i, groups, old, nid, newContext, newSelector
      if ((context ? context.ownerDocument || context : preferredDoc) !== document$1) {
        setDocument(context)
      }
      context = context || document$1
      results = results || []
      if (!selector || typeof selector !== 'string') {
        return results
      }
      if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) {
        return []
      }
      if (documentIsHTML && !seed) {
        if (match = rquickExpr.exec(selector)) {
          if (m = match[1]) {
            if (nodeType === 9) {
              elem = context.getElementById(m)
              if (elem && elem.parentNode) {
                if (elem.id === m) {
                  results.push(elem)
                  return results
                }
              } else {
                return results
              }
            } else if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains$1(context, elem) && elem.id === m) {
              results.push(elem)
              return results
            }
          } else if (match[2]) {
            push$1.apply(results, context.getElementsByTagName(selector))
            return results
          } else if ((m = match[3]) && support.getElementsByClassName) {
            push$1.apply(results, context.getElementsByClassName(m))
            return results
          }
        }
        if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
          nid = old = expando
          newContext = context
          newSelector = nodeType === 9 && selector
          if (nodeType === 1 && context.nodeName.toLowerCase() !== 'object') {
            groups = tokenize(selector)
            if (old = context.getAttribute('id')) {
              nid = old.replace(rescape, '\\$&')
            } else {
              context.setAttribute('id', nid)
            }
            nid = `[id='${nid}'] `
            i = groups.length
            while (i--) {
              groups[i] = nid + toSelector(groups[i])
            }
            newContext = rsibling.test(selector) && testContext(context.parentNode) || context
            newSelector = groups.join(',')
          }
          if (newSelector) {
            try {
              push$1.apply(results, newContext.querySelectorAll(newSelector))
              return results
            } catch (qsaError) {
            } finally {
              if (!old) {
                context.removeAttribute('id')
              }
            }
          }
        }
      }
      return select(selector.replace(rtrim, '$1'), context, results, seed)
    }
    function createCache() {
      const keys = []
      function cache(key, value) {
        if (keys.push(`${key} `) > Expr.cacheLength) {
          delete cache[keys.shift()]
        }
        return cache[`${key} `] = value
      }
      return cache
    }
    function markFunction(fn) {
      fn[expando] = true
      return fn
    }
    function siblingCheck(a, b) {
      let cur = b && a; const diff = cur && a.nodeType === 1 && b.nodeType === 1 && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE)
      if (diff) {
        return diff
      }
      if (cur) {
        while (cur = cur.nextSibling) {
          if (cur === b) {
            return -1
          }
        }
      }
      return a ? 1 : -1
    }
    function createInputPseudo(type) {
      return function (elem) {
        const name$$1 = elem.nodeName.toLowerCase()
        return name$$1 === 'input' && elem.type === type
      }
    }
    function createButtonPseudo(type) {
      return function (elem) {
        const name$$1 = elem.nodeName.toLowerCase()
        return (name$$1 === 'input' || name$$1 === 'button') && elem.type === type
      }
    }
    function createPositionalPseudo(fn) {
      return markFunction((argument) => {
        argument = +argument
        return markFunction((seed, matches) => {
          let j; const matchIndexes = fn([], seed.length, argument); let i = matchIndexes.length
          while (i--) {
            if (seed[j = matchIndexes[i]]) {
              seed[j] = !(matches[j] = seed[j])
            }
          }
        })
      })
    }
    function testContext(context) {
      return context && typeof context.getElementsByTagName !== strundefined && context
    }
    support = Sizzle.support = {}
    isXML = Sizzle.isXML = function (elem) {
      const documentElement = elem && (elem.ownerDocument || elem).documentElement
      return documentElement ? documentElement.nodeName !== 'HTML' : false
    }
    setDocument = Sizzle.setDocument = function (node) {
      let hasCompare; const doc = node ? node.ownerDocument || node : preferredDoc; const parent$$1 = doc.defaultView
      function getTop(win) {
        try {
          return win.top
        } catch (ex) {
        }
        return null
      }
      if (doc === document$1 || doc.nodeType !== 9 || !doc.documentElement) {
        return document$1
      }
      document$1 = doc
      docElem = doc.documentElement
      documentIsHTML = !isXML(doc)
      if (parent$$1 && parent$$1 !== getTop(parent$$1)) {
        if (parent$$1.addEventListener) {
          parent$$1.addEventListener('unload', () => {
            setDocument()
          }, false)
        } else if (parent$$1.attachEvent) {
          parent$$1.attachEvent('onunload', () => {
            setDocument()
          })
        }
      }
      support.attributes = true
      support.getElementsByTagName = true
      support.getElementsByClassName = rnative.test(doc.getElementsByClassName)
      support.getById = true
      Expr.find.ID = function (id, context) {
        if (typeof context.getElementById !== strundefined && documentIsHTML) {
          const m = context.getElementById(id)
          return m && m.parentNode ? [m] : []
        }
      }
      Expr.filter.ID = function (id) {
        const attrId = id.replace(runescape, funescape)
        return function (elem) {
          return elem.getAttribute('id') === attrId
        }
      }
      Expr.find.TAG = support.getElementsByTagName ? function (tag, context) {
        if (typeof context.getElementsByTagName !== strundefined) {
          return context.getElementsByTagName(tag)
        }
      } : function (tag, context) {
        let elem; const tmp = []; let i = 0; const results = context.getElementsByTagName(tag)
        if (tag === '*') {
          while (elem = results[i++]) {
            if (elem.nodeType === 1) {
              tmp.push(elem)
            }
          }
          return tmp
        }
        return results
      }
      Expr.find.CLASS = support.getElementsByClassName && function (className, context) {
        if (documentIsHTML) {
          return context.getElementsByClassName(className)
        }
      }
      rbuggyMatches = []
      rbuggyQSA = []
      support.disconnectedMatch = true
      rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join('|'))
      rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join('|'))
      hasCompare = rnative.test(docElem.compareDocumentPosition)
      contains$1 = hasCompare || rnative.test(docElem.contains) ? function (a, b) {
        const adown = a.nodeType === 9 ? a.documentElement : a; const bup = b && b.parentNode
        return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16))
      } : function (a, b) {
        if (b) {
          while (b = b.parentNode) {
            if (b === a) {
              return true
            }
          }
        }
        return false
      }
      sortOrder = hasCompare ? function (a, b) {
        if (a === b) {
          hasDuplicate = true
          return 0
        }
        let compare = !a.compareDocumentPosition - !b.compareDocumentPosition
        if (compare) {
          return compare
        }
        compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1
        if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {
          if (a === doc || a.ownerDocument === preferredDoc && contains$1(preferredDoc, a)) {
            return -1
          }
          if (b === doc || b.ownerDocument === preferredDoc && contains$1(preferredDoc, b)) {
            return 1
          }
          return sortInput ? indexOf$1.call(sortInput, a) - indexOf$1.call(sortInput, b) : 0
        }
        return compare & 4 ? -1 : 1
      } : function (a, b) {
        if (a === b) {
          hasDuplicate = true
          return 0
        }
        let cur; let i = 0; const aup = a.parentNode; const bup = b.parentNode; const ap = [a]; const bp = [b]
        if (!aup || !bup) {
          return a === doc ? -1 : b === doc ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf$1.call(sortInput, a) - indexOf$1.call(sortInput, b) : 0
        } if (aup === bup) {
          return siblingCheck(a, b)
        }
        cur = a
        while (cur = cur.parentNode) {
          ap.unshift(cur)
        }
        cur = b
        while (cur = cur.parentNode) {
          bp.unshift(cur)
        }
        while (ap[i] === bp[i]) {
          i++
        }
        return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0
      }
      return doc
    }
    Sizzle.matches = function (expr, elements) {
      return Sizzle(expr, null, null, elements)
    }
    Sizzle.matchesSelector = function (elem, expr) {
      if ((elem.ownerDocument || elem) !== document$1) {
        setDocument(elem)
      }
      expr = expr.replace(rattributeQuotes, '=\'$1\']')
      if (support.matchesSelector && documentIsHTML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
        try {
          const ret = matches.call(elem, expr)
          if (ret || support.disconnectedMatch || elem.document && elem.document.nodeType !== 11) {
            return ret
          }
        } catch (e) {
        }
      }
      return Sizzle(expr, document$1, null, [elem]).length > 0
    }
    Sizzle.contains = function (context, elem) {
      if ((context.ownerDocument || context) !== document$1) {
        setDocument(context)
      }
      return contains$1(context, elem)
    }
    Sizzle.attr = function (elem, name$$1) {
      if ((elem.ownerDocument || elem) !== document$1) {
        setDocument(elem)
      }
      const fn = Expr.attrHandle[name$$1.toLowerCase()]; let val = fn && hasOwn.call(Expr.attrHandle, name$$1.toLowerCase()) ? fn(elem, name$$1, !documentIsHTML) : undefined
      return val !== undefined ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name$$1) : (val = elem.getAttributeNode(name$$1)) && val.specified ? val.value : null
    }
    Sizzle.error = function (msg) {
      throw new Error(`Syntax error, unrecognized expression: ${msg}`)
    }
    Sizzle.uniqueSort = function (results) {
      let elem; const duplicates = []; let j = 0; let i = 0
      hasDuplicate = !support.detectDuplicates
      sortInput = !support.sortStable && results.slice(0)
      results.sort(sortOrder)
      if (hasDuplicate) {
        while (elem = results[i++]) {
          if (elem === results[i]) {
            j = duplicates.push(i)
          }
        }
        while (j--) {
          results.splice(duplicates[j], 1)
        }
      }
      sortInput = null
      return results
    }
    getText = Sizzle.getText = function (elem) {
      let node; let ret = ''; let i = 0; const { nodeType } = elem
      if (!nodeType) {
        while (node = elem[i++]) {
          ret += getText(node)
        }
      } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
        if (typeof elem.textContent === 'string') {
          return elem.textContent
        }
        for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
          ret += getText(elem)
        }
      } else if (nodeType === 3 || nodeType === 4) {
        return elem.nodeValue
      }
      return ret
    }
    Expr = Sizzle.selectors = {
      cacheLength: 50,
      createPseudo: markFunction,
      match: matchExpr,
      attrHandle: {},
      find: {},
      relative: {
        '>': {
          dir: 'parentNode',
          first: true,
        },
        ' ': { dir: 'parentNode' },
        '+': {
          dir: 'previousSibling',
          first: true,
        },
        '~': { dir: 'previousSibling' },
      },
      preFilter: {
        ATTR(match) {
          match[1] = match[1].replace(runescape, funescape)
          match[3] = (match[3] || match[4] || match[5] || '').replace(runescape, funescape)
          if (match[2] === '~=') {
            match[3] = ` ${match[3]} `
          }
          return match.slice(0, 4)
        },
        CHILD(match) {
          match[1] = match[1].toLowerCase()
          if (match[1].slice(0, 3) === 'nth') {
            if (!match[3]) {
              Sizzle.error(match[0])
            }
            match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === 'even' || match[3] === 'odd'))
            match[5] = +(match[7] + match[8] || match[3] === 'odd')
          } else if (match[3]) {
            Sizzle.error(match[0])
          }
          return match
        },
        PSEUDO(match) {
          let excess; const unquoted = !match[6] && match[2]
          if (matchExpr.CHILD.test(match[0])) {
            return null
          }
          if (match[3]) {
            match[2] = match[4] || match[5] || ''
          } else if (unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, true)) && (excess = unquoted.indexOf(')', unquoted.length - excess) - unquoted.length)) {
            match[0] = match[0].slice(0, excess)
            match[2] = unquoted.slice(0, excess)
          }
          return match.slice(0, 3)
        },
      },
      filter: {
        TAG(nodeNameSelector) {
          const nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase()
          return nodeNameSelector === '*' ? function () {
            return true
          } : function (elem) {
            return elem.nodeName && elem.nodeName.toLowerCase() === nodeName
          }
        },
        CLASS(className) {
          let pattern = classCache[`${className} `]
          return pattern || (pattern = new RegExp(`(^|${whitespace})${className}(${whitespace}|$)`)) && classCache(className, (elem) => pattern.test(typeof elem.className === 'string' && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute('class') || ''))
        },
        ATTR(name$$1, operator, check) {
          return function (elem) {
            let result = Sizzle.attr(elem, name$$1)
            if (result == null) {
              return operator === '!='
            }
            if (!operator) {
              return true
            }
            result += ''
            return operator === '=' ? result === check : operator === '!=' ? result !== check : operator === '^=' ? check && result.indexOf(check) === 0 : operator === '*=' ? check && result.indexOf(check) > -1 : operator === '$=' ? check && result.slice(-check.length) === check : operator === '~=' ? (` ${result} `).indexOf(check) > -1 : operator === '|=' ? result === check || result.slice(0, check.length + 1) === `${check}-` : false
          }
        },
        CHILD(type, what, argument, first, last) {
          const simple = type.slice(0, 3) !== 'nth'; const forward = type.slice(-4) !== 'last'; const ofType = what === 'of-type'
          return first === 1 && last === 0 ? function (elem) {
            return !!elem.parentNode
          } : function (elem, context, xml) {
            let cache; let outerCache; let node; let diff; let nodeIndex; let start; let dir = simple !== forward ? 'nextSibling' : 'previousSibling'; const parent$$1 = elem.parentNode; const name$$1 = ofType && elem.nodeName.toLowerCase(); const useCache = !xml && !ofType
            if (parent$$1) {
              if (simple) {
                while (dir) {
                  node = elem
                  while (node = node[dir]) {
                    if (ofType ? node.nodeName.toLowerCase() === name$$1 : node.nodeType === 1) {
                      return false
                    }
                  }
                  start = dir = type === 'only' && !start && 'nextSibling'
                }
                return true
              }
              start = [forward ? parent$$1.firstChild : parent$$1.lastChild]
              if (forward && useCache) {
                outerCache = parent$$1[expando] || (parent$$1[expando] = {})
                cache = outerCache[type] || []
                nodeIndex = cache[0] === dirruns && cache[1]
                diff = cache[0] === dirruns && cache[2]
                node = nodeIndex && parent$$1.childNodes[nodeIndex]
                while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {
                  if (node.nodeType === 1 && ++diff && node === elem) {
                    outerCache[type] = [
                      dirruns,
                      nodeIndex,
                      diff,
                    ]
                    break
                  }
                }
              } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) {
                diff = cache[1]
              } else {
                while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {
                  if ((ofType ? node.nodeName.toLowerCase() === name$$1 : node.nodeType === 1) && ++diff) {
                    if (useCache) {
                      (node[expando] || (node[expando] = {}))[type] = [
                        dirruns,
                        diff,
                      ]
                    }
                    if (node === elem) {
                      break
                    }
                  }
                }
              }
              diff -= last
              return diff === first || diff % first === 0 && diff / first >= 0
            }
          }
        },
        PSEUDO(pseudo, argument) {
          let args; const fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error(`unsupported pseudo: ${pseudo}`)
          if (fn[expando]) {
            return fn(argument)
          }
          if (fn.length > 1) {
            args = [
              pseudo,
              pseudo,
              '',
              argument,
            ]
            return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction((seed, matches) => {
              let idx; const matched = fn(seed, argument); let i = matched.length
              while (i--) {
                idx = indexOf$1.call(seed, matched[i])
                seed[idx] = !(matches[idx] = matched[i])
              }
            }) : function (elem) {
              return fn(elem, 0, args)
            }
          }
          return fn
        },
      },
      pseudos: {
        not: markFunction((selector) => {
          const input = []; const results = []; const matcher = compile(selector.replace(rtrim, '$1'))
          return matcher[expando] ? markFunction((seed, matches, context, xml) => {
            let elem; const unmatched = matcher(seed, null, xml, []); let i = seed.length
            while (i--) {
              if (elem = unmatched[i]) {
                seed[i] = !(matches[i] = elem)
              }
            }
          }) : function (elem, context, xml) {
            input[0] = elem
            matcher(input, null, xml, results)
            return !results.pop()
          }
        }),
        has: markFunction((selector) => function (elem) {
          return Sizzle(selector, elem).length > 0
        }),
        contains: markFunction((text) => {
          text = text.replace(runescape, funescape)
          return function (elem) {
            return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1
          }
        }),
        lang: markFunction((lang) => {
          if (!ridentifier.test(lang || '')) {
            Sizzle.error(`unsupported lang: ${lang}`)
          }
          lang = lang.replace(runescape, funescape).toLowerCase()
          return function (elem) {
            let elemLang
            do {
              if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute('xml:lang') || elem.getAttribute('lang')) {
                elemLang = elemLang.toLowerCase()
                return elemLang === lang || elemLang.indexOf(`${lang}-`) === 0
              }
            } while ((elem = elem.parentNode) && elem.nodeType === 1)
            return false
          }
        }),
        target(elem) {
          const hash = window.location && window.location.hash
          return hash && hash.slice(1) === elem.id
        },
        root(elem) {
          return elem === docElem
        },
        focus(elem) {
          return elem === document$1.activeElement && (!document$1.hasFocus || document$1.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex)
        },
        enabled(elem) {
          return elem.disabled === false
        },
        disabled(elem) {
          return elem.disabled === true
        },
        checked(elem) {
          const nodeName = elem.nodeName.toLowerCase()
          return nodeName === 'input' && !!elem.checked || nodeName === 'option' && !!elem.selected
        },
        selected(elem) {
          if (elem.parentNode) {
            elem.parentNode.selectedIndex
          }
          return elem.selected === true
        },
        empty(elem) {
          for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
            if (elem.nodeType < 6) {
              return false
            }
          }
          return true
        },
        parent(elem) {
          return !Expr.pseudos.empty(elem)
        },
        header(elem) {
          return rheader.test(elem.nodeName)
        },
        input(elem) {
          return rinputs.test(elem.nodeName)
        },
        button(elem) {
          const name$$1 = elem.nodeName.toLowerCase()
          return name$$1 === 'input' && elem.type === 'button' || name$$1 === 'button'
        },
        text(elem) {
          let attr
          return elem.nodeName.toLowerCase() === 'input' && elem.type === 'text' && ((attr = elem.getAttribute('type')) == null || attr.toLowerCase() === 'text')
        },
        first: createPositionalPseudo(() => [0]),
        last: createPositionalPseudo((matchIndexes, length$$1) => [length$$1 - 1]),
        eq: createPositionalPseudo((matchIndexes, length$$1, argument) => [argument < 0 ? argument + length$$1 : argument]),
        even: createPositionalPseudo((matchIndexes, length$$1) => {
          let i = 0
          for (; i < length$$1; i += 2) {
            matchIndexes.push(i)
          }
          return matchIndexes
        }),
        odd: createPositionalPseudo((matchIndexes, length$$1) => {
          let i = 1
          for (; i < length$$1; i += 2) {
            matchIndexes.push(i)
          }
          return matchIndexes
        }),
        lt: createPositionalPseudo((matchIndexes, length$$1, argument) => {
          let i = argument < 0 ? argument + length$$1 : argument
          for (; --i >= 0;) {
            matchIndexes.push(i)
          }
          return matchIndexes
        }),
        gt: createPositionalPseudo((matchIndexes, length$$1, argument) => {
          let i = argument < 0 ? argument + length$$1 : argument
          for (; ++i < length$$1;) {
            matchIndexes.push(i)
          }
          return matchIndexes
        }),
      },
    }
    Expr.pseudos.nth = Expr.pseudos.eq
    for (i in {
      radio: true,
      checkbox: true,
      file: true,
      password: true,
      image: true,
    }) {
      Expr.pseudos[i] = createInputPseudo(i)
    }
    for (i in {
      submit: true,
      reset: true,
    }) {
      Expr.pseudos[i] = createButtonPseudo(i)
    }
    function setFilters() {
    }
    setFilters.prototype = Expr.filters = Expr.pseudos
    Expr.setFilters = new setFilters()
    tokenize = Sizzle.tokenize = function (selector, parseOnly) {
      let matched; let match; let tokens; let type; let soFar; let groups; let preFilters; const cached = tokenCache[`${selector} `]
      if (cached) {
        return parseOnly ? 0 : cached.slice(0)
      }
      soFar = selector
      groups = []
      preFilters = Expr.preFilter
      while (soFar) {
        if (!matched || (match = rcomma.exec(soFar))) {
          if (match) {
            soFar = soFar.slice(match[0].length) || soFar
          }
          groups.push(tokens = [])
        }
        matched = false
        if (match = rcombinators.exec(soFar)) {
          matched = match.shift()
          tokens.push({
            value: matched,
            type: match[0].replace(rtrim, ' '),
          })
          soFar = soFar.slice(matched.length)
        }
        for (type in Expr.filter) {
          if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
            matched = match.shift()
            tokens.push({
              value: matched,
              type,
              matches: match,
            })
            soFar = soFar.slice(matched.length)
          }
        }
        if (!matched) {
          break
        }
      }
      return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0)
    }
    function toSelector(tokens) {
      let i = 0; const len = tokens.length; let selector = ''
      for (; i < len; i++) {
        selector += tokens[i].value
      }
      return selector
    }
    function addCombinator(matcher, combinator, base) {
      const { dir } = combinator; const checkNonElements = base && dir === 'parentNode'; const doneName = done++
      return combinator.first ? function (elem, context, xml) {
        while (elem = elem[dir]) {
          if (elem.nodeType === 1 || checkNonElements) {
            return matcher(elem, context, xml)
          }
        }
      } : function (elem, context, xml) {
        let oldCache; let outerCache; const newCache = [
          dirruns,
          doneName,
        ]
        if (xml) {
          while (elem = elem[dir]) {
            if (elem.nodeType === 1 || checkNonElements) {
              if (matcher(elem, context, xml)) {
                return true
              }
            }
          }
        } else {
          while (elem = elem[dir]) {
            if (elem.nodeType === 1 || checkNonElements) {
              outerCache = elem[expando] || (elem[expando] = {})
              if ((oldCache = outerCache[dir]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                return newCache[2] = oldCache[2]
              }
              outerCache[dir] = newCache
              if (newCache[2] = matcher(elem, context, xml)) {
                return true
              }
            }
          }
        }
      }
    }
    function elementMatcher(matchers) {
      return matchers.length > 1 ? function (elem, context, xml) {
        let i = matchers.length
        while (i--) {
          if (!matchers[i](elem, context, xml)) {
            return false
          }
        }
        return true
      } : matchers[0]
    }
    function multipleContexts(selector, contexts, results) {
      let i = 0; const len = contexts.length
      for (; i < len; i++) {
        Sizzle(selector, contexts[i], results)
      }
      return results
    }
    function condense(unmatched, map, filter, context, xml) {
      let elem; const newUnmatched = []; let i = 0; const len = unmatched.length; const mapped = map != null
      for (; i < len; i++) {
        if (elem = unmatched[i]) {
          if (!filter || filter(elem, context, xml)) {
            newUnmatched.push(elem)
            if (mapped) {
              map.push(i)
            }
          }
        }
      }
      return newUnmatched
    }
    function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
      if (postFilter && !postFilter[expando]) {
        postFilter = setMatcher(postFilter)
      }
      if (postFinder && !postFinder[expando]) {
        postFinder = setMatcher(postFinder, postSelector)
      }
      return markFunction((seed, results, context, xml) => {
        let temp; let i; let elem; const preMap = []; const postMap = []; const preexisting = results.length; const elems = seed || multipleContexts(selector || '*', context.nodeType ? [context] : context, []); const matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems; let matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn
        if (matcher) {
          matcher(matcherIn, matcherOut, context, xml)
        }
        if (postFilter) {
          temp = condense(matcherOut, postMap)
          postFilter(temp, [], context, xml)
          i = temp.length
          while (i--) {
            if (elem = temp[i]) {
              matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem)
            }
          }
        }
        if (seed) {
          if (postFinder || preFilter) {
            if (postFinder) {
              temp = []
              i = matcherOut.length
              while (i--) {
                if (elem = matcherOut[i]) {
                  temp.push(matcherIn[i] = elem)
                }
              }
              postFinder(null, matcherOut = [], temp, xml)
            }
            i = matcherOut.length
            while (i--) {
              if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf$1.call(seed, elem) : preMap[i]) > -1) {
                seed[temp] = !(results[temp] = elem)
              }
            }
          }
        } else {
          matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut)
          if (postFinder) {
            postFinder(null, results, matcherOut, xml)
          } else {
            push$1.apply(results, matcherOut)
          }
        }
      })
    }
    function matcherFromTokens(tokens) {
      let checkContext; let matcher; let j; const len = tokens.length; const leadingRelative = Expr.relative[tokens[0].type]; const implicitRelative = leadingRelative || Expr.relative[' ']; let i = leadingRelative ? 1 : 0; const matchContext = addCombinator((elem) => elem === checkContext, implicitRelative, true); const matchAnyContext = addCombinator((elem) => indexOf$1.call(checkContext, elem) > -1, implicitRelative, true); let matchers = [function (elem, context, xml) {
        return !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml))
      }]
      for (; i < len; i++) {
        if (matcher = Expr.relative[tokens[i].type]) {
          matchers = [addCombinator(elementMatcher(matchers), matcher)]
        } else {
          matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches)
          if (matcher[expando]) {
            j = ++i
            for (; j < len; j++) {
              if (Expr.relative[tokens[j].type]) {
                break
              }
            }
            return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1).concat({ value: tokens[i - 2].type === ' ' ? '*' : '' })).replace(rtrim, '$1'), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens))
          }
          matchers.push(matcher)
        }
      }
      return elementMatcher(matchers)
    }
    function matcherFromGroupMatchers(elementMatchers, setMatchers) {
      const bySet = setMatchers.length > 0; const byElement = elementMatchers.length > 0; const superMatcher = function (seed, context, xml, results, outermost) {
        let elem; let j; let matcher; let matchedCount = 0; let i = '0'; const unmatched = seed && []; let setMatched = []; const contextBackup = outermostContext; const elems = seed || byElement && Expr.find.TAG('*', outermost); const dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1; const len = elems.length
        if (outermost) {
          outermostContext = context !== document$1 && context
        }
        for (; i !== len && (elem = elems[i]) != null; i++) {
          if (byElement && elem) {
            j = 0
            while (matcher = elementMatchers[j++]) {
              if (matcher(elem, context, xml)) {
                results.push(elem)
                break
              }
            }
            if (outermost) {
              dirruns = dirrunsUnique
            }
          }
          if (bySet) {
            if (elem = !matcher && elem) {
              matchedCount--
            }
            if (seed) {
              unmatched.push(elem)
            }
          }
        }
        matchedCount += i
        if (bySet && i !== matchedCount) {
          j = 0
          while (matcher = setMatchers[j++]) {
            matcher(unmatched, setMatched, context, xml)
          }
          if (seed) {
            if (matchedCount > 0) {
              while (i--) {
                if (!(unmatched[i] || setMatched[i])) {
                  setMatched[i] = pop.call(results)
                }
              }
            }
            setMatched = condense(setMatched)
          }
          push$1.apply(results, setMatched)
          if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
            Sizzle.uniqueSort(results)
          }
        }
        if (outermost) {
          dirruns = dirrunsUnique
          outermostContext = contextBackup
        }
        return unmatched
      }
      return bySet ? markFunction(superMatcher) : superMatcher
    }
    compile = Sizzle.compile = function (selector, match) {
      let i; const setMatchers = []; const elementMatchers = []; let cached = compilerCache[`${selector} `]
      if (!cached) {
        if (!match) {
          match = tokenize(selector)
        }
        i = match.length
        while (i--) {
          cached = matcherFromTokens(match[i])
          if (cached[expando]) {
            setMatchers.push(cached)
          } else {
            elementMatchers.push(cached)
          }
        }
        cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers))
        cached.selector = selector
      }
      return cached
    }
    select = Sizzle.select = function (selector, context, results, seed) {
      let i; let tokens; let token; let type; let find; const compiled = typeof selector === 'function' && selector; const match = !seed && tokenize(selector = compiled.selector || selector)
      results = results || []
      if (match.length === 1) {
        tokens = match[0] = match[0].slice(0)
        if (tokens.length > 2 && (token = tokens[0]).type === 'ID' && support.getById && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
          context = (Expr.find.ID(token.matches[0].replace(runescape, funescape), context) || [])[0]
          if (!context) {
            return results
          } if (compiled) {
            context = context.parentNode
          }
          selector = selector.slice(tokens.shift().value.length)
        }
        i = matchExpr.needsContext.test(selector) ? 0 : tokens.length
        while (i--) {
          token = tokens[i]
          if (Expr.relative[type = token.type]) {
            break
          }
          if (find = Expr.find[type]) {
            if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context)) {
              tokens.splice(i, 1)
              selector = seed.length && toSelector(tokens)
              if (!selector) {
                push$1.apply(results, seed)
                return results
              }
              break
            }
          }
        }
      }
      (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, rsibling.test(selector) && testContext(context.parentNode) || context)
      return results
    }
    support.sortStable = expando.split('').sort(sortOrder).join('') === expando
    support.detectDuplicates = !!hasDuplicate
    setDocument()
    support.sortDetached = true

    const isArray$1 = Array.isArray
    const toArray = function (obj) {
      let array = obj; let i; let l
      if (!isArray$1(obj)) {
        array = []
        for (i = 0, l = obj.length; i < l; i++) {
          array[i] = obj[i]
        }
      }
      return array
    }
    const each$1 = function (o, cb, s) {
      let n, l
      if (!o) {
        return 0
      }
      s = s || o
      if (o.length !== undefined) {
        for (n = 0, l = o.length; n < l; n++) {
          if (cb.call(s, o[n], n, o) === false) {
            return 0
          }
        }
      } else {
        for (n in o) {
          if (o.hasOwnProperty(n)) {
            if (cb.call(s, o[n], n, o) === false) {
              return 0
            }
          }
        }
      }
      return 1
    }
    const map$1 = function (array, callback) {
      const out = []
      each$1(array, (item, index) => {
        out.push(callback(item, index, array))
      })
      return out
    }
    const filter$1 = function (a, f) {
      const o = []
      each$1(a, (v, index) => {
        if (!f || f(v, index, a)) {
          o.push(v)
        }
      })
      return o
    }
    const indexOf$2 = function (a, v) {
      let i, l
      if (a) {
        for (i = 0, l = a.length; i < l; i++) {
          if (a[i] === v) {
            return i
          }
        }
      }
      return -1
    }
    const reduce = function (collection, iteratee, accumulator, thisArg) {
      let i = 0
      if (arguments.length < 3) {
        accumulator = collection[0]
      }
      for (; i < collection.length; i++) {
        accumulator = iteratee.call(thisArg, accumulator, collection[i], i)
      }
      return accumulator
    }
    const findIndex$1 = function (array, predicate, thisArg) {
      let i, l
      for (i = 0, l = array.length; i < l; i++) {
        if (predicate.call(thisArg, array[i], i, array)) {
          return i
        }
      }
      return -1
    }
    const find$1 = function (array, predicate, thisArg) {
      const idx = findIndex$1(array, predicate, thisArg)
      if (idx !== -1) {
        return array[idx]
      }
      return undefined
    }
    const last$1 = function (collection) {
      return collection[collection.length - 1]
    }
    const ArrUtils = {
      isArray: isArray$1,
      toArray,
      each: each$1,
      map: map$1,
      filter: filter$1,
      indexOf: indexOf$2,
      reduce,
      findIndex: findIndex$1,
      find: find$1,
      last: last$1,
    }

    const whiteSpaceRegExp = /^\s*|\s*$/g
    const trim = function (str) {
      return str === null || str === undefined ? '' : (`${str}`).replace(whiteSpaceRegExp, '')
    }
    const is = function (obj, type) {
      if (!type) {
        return obj !== undefined
      }
      if (type === 'array' && ArrUtils.isArray(obj)) {
        return true
      }
      return typeof obj === type
    }
    const makeMap = function (items, delim, map) {
      let i
      items = items || []
      delim = delim || ','
      if (typeof items === 'string') {
        items = items.split(delim)
      }
      map = map || {}
      i = items.length
      while (i--) {
        map[items[i]] = {}
      }
      return map
    }
    const hasOwnProperty = function (obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop)
    }
    const create = function (s, p, root) {
      const self$$1 = this
      let sp; let ns; let cn; let scn; let c; let de = 0
      s = /^((static) )?([\w.]+)(:([\w.]+))?/.exec(s)
      cn = s[3].match(/(^|\.)(\w+)$/i)[2]
      ns = self$$1.createNS(s[3].replace(/\.\w+$/, ''), root)
      if (ns[cn]) {
        return
      }
      if (s[2] === 'static') {
        ns[cn] = p
        if (this.onCreate) {
          this.onCreate(s[2], s[3], ns[cn])
        }
        return
      }
      if (!p[cn]) {
        p[cn] = function () {
        }
        de = 1
      }
      ns[cn] = p[cn]
      self$$1.extend(ns[cn].prototype, p)
      if (s[5]) {
        sp = self$$1.resolve(s[5]).prototype
        scn = s[5].match(/\.(\w+)$/i)[1]
        c = ns[cn]
        if (de) {
          ns[cn] = function () {
            return sp[scn].apply(this, arguments)
          }
        } else {
          ns[cn] = function () {
            this.parent = sp[scn]
            return c.apply(this, arguments)
          }
        }
        ns[cn].prototype[cn] = ns[cn]
        self$$1.each(sp, (f, n) => {
          ns[cn].prototype[n] = sp[n]
        })
        self$$1.each(p, (f, n) => {
          if (sp[n]) {
            ns[cn].prototype[n] = function () {
              this.parent = sp[n]
              return f.apply(this, arguments)
            }
          } else if (n !== cn) {
            ns[cn].prototype[n] = f
          }
        })
      }
      self$$1.each(p.static, (f, n) => {
        ns[cn][n] = f
      })
    }
    const extend = function (obj, ext) {
      const x = []
      for (let _i = 2; _i < arguments.length; _i++) {
        x[_i - 2] = arguments[_i]
      }
      let i, l, name$$1
      const args = arguments
      let value
      for (i = 1, l = args.length; i < l; i++) {
        ext = args[i]
        for (name$$1 in ext) {
          if (ext.hasOwnProperty(name$$1)) {
            value = ext[name$$1]
            if (value !== undefined) {
              obj[name$$1] = value
            }
          }
        }
      }
      return obj
    }
    var walk = function (o, f, n, s) {
      s = s || this
      if (o) {
        if (n) {
          o = o[n]
        }
        ArrUtils.each(o, (o, i) => {
          if (f.call(s, o, i, n) === false) {
            return false
          }
          walk(o, f, n, s)
        })
      }
    }
    const createNS = function (n, o) {
      let i, v
      o = o || window
      n = n.split('.')
      for (i = 0; i < n.length; i++) {
        v = n[i]
        if (!o[v]) {
          o[v] = {}
        }
        o = o[v]
      }
      return o
    }
    const resolve$1 = function (n, o) {
      let i, l
      o = o || window
      n = n.split('.')
      for (i = 0, l = n.length; i < l; i++) {
        o = o[n[i]]
        if (!o) {
          break
        }
      }
      return o
    }
    const explode = function (s, d) {
      if (!s || is(s, 'array')) {
        return s
      }
      return ArrUtils.map(s.split(d || ','), trim)
    }
    const _addCacheSuffix = function (url) {
      const { cacheSuffix } = Env
      if (cacheSuffix) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + cacheSuffix
      }
      return url
    }
    const Tools = {
      trim,
      isArray: ArrUtils.isArray,
      is,
      toArray: ArrUtils.toArray,
      makeMap,
      each: ArrUtils.each,
      map: ArrUtils.map,
      grep: ArrUtils.filter,
      inArray: ArrUtils.indexOf,
      hasOwn: hasOwnProperty,
      extend,
      create,
      walk,
      createNS,
      resolve: resolve$1,
      explode,
      _addCacheSuffix,
    }

    const doc = document; const push$2 = Array.prototype.push; const slice$2 = Array.prototype.slice
    const rquickExpr$1 = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/
    const Event$$1 = EventUtils.Event
    const skipUniques = Tools.makeMap('children,contents,next,prev')
    const isDefined = function (obj) {
      return typeof obj !== 'undefined'
    }
    const isString$1 = function (obj) {
      return typeof obj === 'string'
    }
    const isWindow = function (obj) {
      return obj && obj === obj.window
    }
    const createFragment = function (html, fragDoc) {
      let frag, node, container
      fragDoc = fragDoc || doc
      container = fragDoc.createElement('div')
      frag = fragDoc.createDocumentFragment()
      container.innerHTML = html
      while (node = container.firstChild) {
        frag.appendChild(node)
      }
      return frag
    }
    var domManipulate = function (targetNodes, sourceItem, callback, reverse) {
      let i
      if (isString$1(sourceItem)) {
        sourceItem = createFragment(sourceItem, getElementDocument(targetNodes[0]))
      } else if (sourceItem.length && !sourceItem.nodeType) {
        sourceItem = DomQuery.makeArray(sourceItem)
        if (reverse) {
          for (i = sourceItem.length - 1; i >= 0; i--) {
            domManipulate(targetNodes, sourceItem[i], callback, reverse)
          }
        } else {
          for (i = 0; i < sourceItem.length; i++) {
            domManipulate(targetNodes, sourceItem[i], callback, reverse)
          }
        }
        return targetNodes
      }
      if (sourceItem.nodeType) {
        i = targetNodes.length
        while (i--) {
          callback.call(targetNodes[i], sourceItem)
        }
      }
      return targetNodes
    }
    const hasClass = function (node, className) {
      return node && className && (` ${node.className} `).indexOf(` ${className} `) !== -1
    }
    const wrap = function (elements, wrapper, all) {
      let lastParent, newWrapper
      wrapper = DomQuery(wrapper)[0]
      elements.each(function () {
        const self$$1 = this
        if (!all || lastParent !== self$$1.parentNode) {
          lastParent = self$$1.parentNode
          newWrapper = wrapper.cloneNode(false)
          self$$1.parentNode.insertBefore(newWrapper, self$$1)
          newWrapper.appendChild(self$$1)
        } else {
          newWrapper.appendChild(self$$1)
        }
      })
      return elements
    }
    const numericCssMap = Tools.makeMap('fillOpacity fontWeight lineHeight opacity orphans widows zIndex zoom', ' ')
    const booleanMap = Tools.makeMap('checked compact declare defer disabled ismap multiple nohref noshade nowrap readonly selected', ' ')
    const propFix = {
      for: 'htmlFor',
      class: 'className',
      readonly: 'readOnly',
    }
    const cssFix = { float: 'cssFloat' }
    const attrHooks = {}; const cssHooks = {}
    var DomQuery = function (selector, context) {
      return new DomQuery.fn.init(selector, context)
    }
    const inArray = function (item, array) {
      let i
      if (array.indexOf) {
        return array.indexOf(item)
      }
      i = array.length
      while (i--) {
        if (array[i] === item) {
          return i
        }
      }
      return -1
    }
    const whiteSpaceRegExp$1 = /^\s*|\s*$/g
    const trim$1 = function (str) {
      return str === null || str === undefined ? '' : (`${str}`).replace(whiteSpaceRegExp$1, '')
    }
    const each$2 = function (obj, callback) {
      let length$$1, key, i, value
      if (obj) {
        length$$1 = obj.length
        if (length$$1 === undefined) {
          for (key in obj) {
            if (obj.hasOwnProperty(key)) {
              value = obj[key]
              if (callback.call(value, key, value) === false) {
                break
              }
            }
          }
        } else {
          for (i = 0; i < length$$1; i++) {
            value = obj[i]
            if (callback.call(value, i, value) === false) {
              break
            }
          }
        }
      }
      return obj
    }
    const grep = function (array, callback) {
      const out = []
      each$2(array, (i, item) => {
        if (callback(item, i)) {
          out.push(item)
        }
      })
      return out
    }
    var getElementDocument = function (element) {
      if (!element) {
        return doc
      }
      if (element.nodeType === 9) {
        return element
      }
      return element.ownerDocument
    }
    DomQuery.fn = DomQuery.prototype = {
      constructor: DomQuery,
      selector: '',
      context: null,
      length: 0,
      init(selector, context) {
        const self$$1 = this
        let match, node
        if (!selector) {
          return self$$1
        }
        if (selector.nodeType) {
          self$$1.context = self$$1[0] = selector
          self$$1.length = 1
          return self$$1
        }
        if (context && context.nodeType) {
          self$$1.context = context
        } else {
          if (context) {
            return DomQuery(selector).attr(context)
          }
          self$$1.context = context = document
        }
        if (isString$1(selector)) {
          self$$1.selector = selector
          if (selector.charAt(0) === '<' && selector.charAt(selector.length - 1) === '>' && selector.length >= 3) {
            match = [
              null,
              selector,
              null,
            ]
          } else {
            match = rquickExpr$1.exec(selector)
          }
          if (match) {
            if (match[1]) {
              node = createFragment(selector, getElementDocument(context)).firstChild
              while (node) {
                push$2.call(self$$1, node)
                node = node.nextSibling
              }
            } else {
              node = getElementDocument(context).getElementById(match[2])
              if (!node) {
                return self$$1
              }
              if (node.id !== match[2]) {
                return self$$1.find(selector)
              }
              self$$1.length = 1
              self$$1[0] = node
            }
          } else {
            return DomQuery(context).find(selector)
          }
        } else {
          this.add(selector, false)
        }
        return self$$1
      },
      toArray() {
        return Tools.toArray(this)
      },
      add(items, sort) {
        const self$$1 = this
        let nodes, i
        if (isString$1(items)) {
          return self$$1.add(DomQuery(items))
        }
        if (sort !== false) {
          nodes = DomQuery.unique(self$$1.toArray().concat(DomQuery.makeArray(items)))
          self$$1.length = nodes.length
          for (i = 0; i < nodes.length; i++) {
            self$$1[i] = nodes[i]
          }
        } else {
          push$2.apply(self$$1, DomQuery.makeArray(items))
        }
        return self$$1
      },
      attr(name$$1, value) {
        const self$$1 = this
        let hook
        if (typeof name$$1 === 'object') {
          each$2(name$$1, (name$$1, value) => {
            self$$1.attr(name$$1, value)
          })
        } else if (isDefined(value)) {
          this.each(function () {
            let hook
            if (this.nodeType === 1) {
              hook = attrHooks[name$$1]
              if (hook && hook.set) {
                hook.set(this, value)
                return
              }
              if (value === null) {
                this.removeAttribute(name$$1, 2)
              } else {
                this.setAttribute(name$$1, value, 2)
              }
            }
          })
        } else {
          if (self$$1[0] && self$$1[0].nodeType === 1) {
            hook = attrHooks[name$$1]
            if (hook && hook.get) {
              return hook.get(self$$1[0], name$$1)
            }
            if (booleanMap[name$$1]) {
              return self$$1.prop(name$$1) ? name$$1 : undefined
            }
            value = self$$1[0].getAttribute(name$$1, 2)
            if (value === null) {
              value = undefined
            }
          }
          return value
        }
        return self$$1
      },
      removeAttr(name$$1) {
        return this.attr(name$$1, null)
      },
      prop(name$$1, value) {
        const self$$1 = this
        name$$1 = propFix[name$$1] || name$$1
        if (typeof name$$1 === 'object') {
          each$2(name$$1, (name$$1, value) => {
            self$$1.prop(name$$1, value)
          })
        } else if (isDefined(value)) {
          this.each(function () {
            if (this.nodeType === 1) {
              this[name$$1] = value
            }
          })
        } else {
          if (self$$1[0] && self$$1[0].nodeType && name$$1 in self$$1[0]) {
            return self$$1[0][name$$1]
          }
          return value
        }
        return self$$1
      },
      css(name$$1, value) {
        const self$$1 = this
        let elm, hook
        const camel = function (name$$1) {
          return name$$1.replace(/-(\D)/g, (a, b) => b.toUpperCase())
        }
        const dashed = function (name$$1) {
          return name$$1.replace(/[A-Z]/g, (a) => `-${a}`)
        }
        if (typeof name$$1 === 'object') {
          each$2(name$$1, (name$$1, value) => {
            self$$1.css(name$$1, value)
          })
        } else if (isDefined(value)) {
          name$$1 = camel(name$$1)
          if (typeof value === 'number' && !numericCssMap[name$$1]) {
            value = `${value.toString()}px`
          }
          self$$1.each(function () {
            const { style } = this
            hook = cssHooks[name$$1]
            if (hook && hook.set) {
              hook.set(this, value)
              return
            }
            try {
              this.style[cssFix[name$$1] || name$$1] = value
            } catch (ex) {
            }
            if (value === null || value === '') {
              if (style.removeProperty) {
                style.removeProperty(dashed(name$$1))
              } else {
                style.removeAttribute(name$$1)
              }
            }
          })
        } else {
          elm = self$$1[0]
          hook = cssHooks[name$$1]
          if (hook && hook.get) {
            return hook.get(elm)
          }
          if (elm.ownerDocument.defaultView) {
            try {
              return elm.ownerDocument.defaultView.getComputedStyle(elm, null).getPropertyValue(dashed(name$$1))
            } catch (ex) {
              return undefined
            }
          } else if (elm.currentStyle) {
            return elm.currentStyle[camel(name$$1)]
          } else {
            return ''
          }
        }
        return self$$1
      },
      remove() {
        const self$$1 = this
        let node; let i = this.length
        while (i--) {
          node = self$$1[i]
          Event$$1.clean(node)
          if (node.parentNode) {
            node.parentNode.removeChild(node)
          }
        }
        return this
      },
      empty() {
        const self$$1 = this
        let node; let i = this.length
        while (i--) {
          node = self$$1[i]
          while (node.firstChild) {
            node.removeChild(node.firstChild)
          }
        }
        return this
      },
      html(value) {
        const self$$1 = this
        let i
        if (isDefined(value)) {
          i = self$$1.length
          try {
            while (i--) {
              self$$1[i].innerHTML = value
            }
          } catch (ex) {
            DomQuery(self$$1[i]).empty().append(value)
          }
          return self$$1
        }
        return self$$1[0] ? self$$1[0].innerHTML : ''
      },
      text(value) {
        const self$$1 = this
        let i
        if (isDefined(value)) {
          i = self$$1.length
          while (i--) {
            if ('innerText' in self$$1[i]) {
              self$$1[i].innerText = value
            } else {
              self$$1[0].textContent = value
            }
          }
          return self$$1
        }
        return self$$1[0] ? self$$1[0].innerText || self$$1[0].textContent : ''
      },
      append() {
        return domManipulate(this, arguments, function (node) {
          if (this.nodeType === 1 || this.host && this.host.nodeType === 1) {
            this.appendChild(node)
          }
        })
      },
      prepend() {
        return domManipulate(this, arguments, function (node) {
          if (this.nodeType === 1 || this.host && this.host.nodeType === 1) {
            this.insertBefore(node, this.firstChild)
          }
        }, true)
      },
      before() {
        const self$$1 = this
        if (self$$1[0] && self$$1[0].parentNode) {
          return domManipulate(self$$1, arguments, function (node) {
            this.parentNode.insertBefore(node, this)
          })
        }
        return self$$1
      },
      after() {
        const self$$1 = this
        if (self$$1[0] && self$$1[0].parentNode) {
          return domManipulate(self$$1, arguments, function (node) {
            this.parentNode.insertBefore(node, this.nextSibling)
          }, true)
        }
        return self$$1
      },
      appendTo(val) {
        DomQuery(val).append(this)
        return this
      },
      prependTo(val) {
        DomQuery(val).prepend(this)
        return this
      },
      replaceWith(content) {
        return this.before(content).remove()
      },
      wrap(content) {
        return wrap(this, content)
      },
      wrapAll(content) {
        return wrap(this, content, true)
      },
      wrapInner(content) {
        this.each(function () {
          DomQuery(this).contents().wrapAll(content)
        })
        return this
      },
      unwrap() {
        return this.parent().each(function () {
          DomQuery(this).replaceWith(this.childNodes)
        })
      },
      clone() {
        const result = []
        this.each(function () {
          result.push(this.cloneNode(true))
        })
        return DomQuery(result)
      },
      addClass(className) {
        return this.toggleClass(className, true)
      },
      removeClass(className) {
        return this.toggleClass(className, false)
      },
      toggleClass(className, state) {
        const self$$1 = this
        if (typeof className !== 'string') {
          return self$$1
        }
        if (className.indexOf(' ') !== -1) {
          each$2(className.split(' '), function () {
            self$$1.toggleClass(this, state)
          })
        } else {
          self$$1.each((index, node) => {
            let existingClassName, classState
            classState = hasClass(node, className)
            if (classState !== state) {
              existingClassName = node.className
              if (classState) {
                node.className = trim$1((` ${existingClassName} `).replace(` ${className} `, ' '))
              } else {
                node.className += existingClassName ? ` ${className}` : className
              }
            }
          })
        }
        return self$$1
      },
      hasClass(className) {
        return hasClass(this[0], className)
      },
      each(callback) {
        return each$2(this, callback)
      },
      on(name$$1, callback) {
        return this.each(function () {
          Event$$1.bind(this, name$$1, callback)
        })
      },
      off(name$$1, callback) {
        return this.each(function () {
          Event$$1.unbind(this, name$$1, callback)
        })
      },
      trigger(name$$1) {
        return this.each(function () {
          if (typeof name$$1 === 'object') {
            Event$$1.fire(this, name$$1.type, name$$1)
          } else {
            Event$$1.fire(this, name$$1)
          }
        })
      },
      show() {
        return this.css('display', '')
      },
      hide() {
        return this.css('display', 'none')
      },
      slice() {
        return new DomQuery(slice$2.apply(this, arguments))
      },
      eq(index) {
        return index === -1 ? this.slice(index) : this.slice(index, +index + 1)
      },
      first() {
        return this.eq(0)
      },
      last() {
        return this.eq(-1)
      },
      find(selector) {
        let i, l
        const ret = []
        for (i = 0, l = this.length; i < l; i++) {
          DomQuery.find(selector, this[i], ret)
        }
        return DomQuery(ret)
      },
      filter(selector) {
        if (typeof selector === 'function') {
          return DomQuery(grep(this.toArray(), (item, i) => selector(i, item)))
        }
        return DomQuery(DomQuery.filter(selector, this.toArray()))
      },
      closest(selector) {
        const result = []
        if (selector instanceof DomQuery) {
          selector = selector[0]
        }
        this.each((i, node) => {
          while (node) {
            if (typeof selector === 'string' && DomQuery(node).is(selector)) {
              result.push(node)
              break
            } else if (node === selector) {
              result.push(node)
              break
            }
            node = node.parentNode
          }
        })
        return DomQuery(result)
      },
      offset(offset) {
        let elm, doc, docElm
        let x = 0; let y = 0; let pos
        if (!offset) {
          elm = this[0]
          if (elm) {
            doc = elm.ownerDocument
            docElm = doc.documentElement
            if (elm.getBoundingClientRect) {
              pos = elm.getBoundingClientRect()
              x = pos.left + (docElm.scrollLeft || doc.body.scrollLeft) - docElm.clientLeft
              y = pos.top + (docElm.scrollTop || doc.body.scrollTop) - docElm.clientTop
            }
          }
          return {
            left: x,
            top: y,
          }
        }
        return this.css(offset)
      },
      push: push$2,
      sort: [].sort,
      splice: [].splice,
    }
    Tools.extend(DomQuery, {
      extend: Tools.extend,
      makeArray(object) {
        if (isWindow(object) || object.nodeType) {
          return [object]
        }
        return Tools.toArray(object)
      },
      inArray,
      isArray: Tools.isArray,
      each: each$2,
      trim: trim$1,
      grep,
      find: Sizzle,
      expr: Sizzle.selectors,
      unique: Sizzle.uniqueSort,
      text: Sizzle.getText,
      contains: Sizzle.contains,
      filter(expr, elems, not) {
        let i = elems.length
        if (not) {
          expr = `:not(${expr})`
        }
        while (i--) {
          if (elems[i].nodeType !== 1) {
            elems.splice(i, 1)
          }
        }
        if (elems.length === 1) {
          elems = DomQuery.find.matchesSelector(elems[0], expr) ? [elems[0]] : []
        } else {
          elems = DomQuery.find.matches(expr, elems)
        }
        return elems
      },
    })
    const dir = function (el, prop, until) {
      const matched = []
      let cur = el[prop]
      if (typeof until !== 'string' && until instanceof DomQuery) {
        until = until[0]
      }
      while (cur && cur.nodeType !== 9) {
        if (until !== undefined) {
          if (cur === until) {
            break
          }
          if (typeof until === 'string' && DomQuery(cur).is(until)) {
            break
          }
        }
        if (cur.nodeType === 1) {
          matched.push(cur)
        }
        cur = cur[prop]
      }
      return matched
    }
    const sibling = function (node, siblingName, nodeType, until) {
      const result = []
      if (until instanceof DomQuery) {
        until = until[0]
      }
      for (; node; node = node[siblingName]) {
        if (nodeType && node.nodeType !== nodeType) {
          continue
        }
        if (until !== undefined) {
          if (node === until) {
            break
          }
          if (typeof until === 'string' && DomQuery(node).is(until)) {
            break
          }
        }
        result.push(node)
      }
      return result
    }
    const firstSibling = function (node, siblingName, nodeType) {
      for (node = node[siblingName]; node; node = node[siblingName]) {
        if (node.nodeType === nodeType) {
          return node
        }
      }
      return null
    }
    each$2({
      parent(node) {
        const parent$$1 = node.parentNode
        return parent$$1 && parent$$1.nodeType !== 11 ? parent$$1 : null
      },
      parents(node) {
        return dir(node, 'parentNode')
      },
      next(node) {
        return firstSibling(node, 'nextSibling', 1)
      },
      prev(node) {
        return firstSibling(node, 'previousSibling', 1)
      },
      children(node) {
        return sibling(node.firstChild, 'nextSibling', 1)
      },
      contents(node) {
        return Tools.toArray((node.nodeName === 'iframe' ? node.contentDocument || node.contentWindow.document : node).childNodes)
      },
    }, (name$$1, fn) => {
      DomQuery.fn[name$$1] = function (selector) {
        const self$$1 = this
        let result = []
        self$$1.each(function () {
          const nodes = fn.call(result, this, selector, result)
          if (nodes) {
            if (DomQuery.isArray(nodes)) {
              result.push.apply(result, nodes)
            } else {
              result.push(nodes)
            }
          }
        })
        if (this.length > 1) {
          if (!skipUniques[name$$1]) {
            result = DomQuery.unique(result)
          }
          if (name$$1.indexOf('parents') === 0) {
            result = result.reverse()
          }
        }
        result = DomQuery(result)
        if (selector) {
          return result.filter(selector)
        }
        return result
      }
    })
    each$2({
      parentsUntil(node, until) {
        return dir(node, 'parentNode', until)
      },
      nextUntil(node, until) {
        return sibling(node, 'nextSibling', 1, until).slice(1)
      },
      prevUntil(node, until) {
        return sibling(node, 'previousSibling', 1, until).slice(1)
      },
    }, (name$$1, fn) => {
      DomQuery.fn[name$$1] = function (selector, filter) {
        const self$$1 = this
        let result = []
        self$$1.each(function () {
          const nodes = fn.call(result, this, selector, result)
          if (nodes) {
            if (DomQuery.isArray(nodes)) {
              result.push.apply(result, nodes)
            } else {
              result.push(nodes)
            }
          }
        })
        if (this.length > 1) {
          result = DomQuery.unique(result)
          if (name$$1.indexOf('parents') === 0 || name$$1 === 'prevUntil') {
            result = result.reverse()
          }
        }
        result = DomQuery(result)
        if (filter) {
          return result.filter(filter)
        }
        return result
      }
    })
    DomQuery.fn.is = function (selector) {
      return !!selector && this.filter(selector).length > 0
    }
    DomQuery.fn.init.prototype = DomQuery.fn
    DomQuery.overrideDefaults = function (callback) {
      let defaults
      var sub = function (selector, context) {
        defaults = defaults || callback()
        if (arguments.length === 0) {
          selector = defaults.element
        }
        if (!context) {
          context = defaults.context
        }
        return new sub.fn.init(selector, context)
      }
      DomQuery.extend(sub, this)
      return sub
    }
    const appendHooks = function (targetHooks, prop, hooks) {
      each$2(hooks, (name$$1, func) => {
        targetHooks[name$$1] = targetHooks[name$$1] || {}
        targetHooks[name$$1][prop] = func
      })
    }
    if (Env.ie && Env.ie < 8) {
      appendHooks(attrHooks, 'get', {
        maxlength(elm) {
          const value = elm.maxLength
          if (value === 2147483647) {
            return undefined
          }
          return value
        },
        size(elm) {
          const value = elm.size
          if (value === 20) {
            return undefined
          }
          return value
        },
        class(elm) {
          return elm.className
        },
        style(elm) {
          const value = elm.style.cssText
          if (value.length === 0) {
            return undefined
          }
          return value
        },
      })
      appendHooks(attrHooks, 'set', {
        class(elm, value) {
          elm.className = value
        },
        style(elm, value) {
          elm.style.cssText = value
        },
      })
    }
    if (Env.ie && Env.ie < 9) {
      cssFix.float = 'styleFloat'
      appendHooks(cssHooks, 'set', {
        opacity(elm, value) {
          const { style } = elm
          if (value === null || value === '') {
            style.removeAttribute('filter')
          } else {
            style.zoom = 1
            style.filter = `alpha(opacity=${value * 100})`
          }
        },
      })
    }
    DomQuery.attrHooks = attrHooks
    DomQuery.cssHooks = cssHooks

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
      return nu(group(1), group(2))
    }
    const detect = function (versionRegexes, agent) {
      const cleanedAgent = String(agent).toLowerCase()
      if (versionRegexes.length === 0) { return unknown() }
      return find$2(versionRegexes, cleanedAgent)
    }
    var unknown = function () {
      return nu(0, 0)
    }
    var nu = function (major, minor) {
      return {
        major,
        minor,
      }
    }
    const Version = {
      nu,
      detect,
      unknown,
    }

    const edge = 'Edge'
    const chrome = 'Chrome'
    const ie$1 = 'IE'
    const opera$1 = 'Opera'
    const firefox = 'Firefox'
    const safari = 'Safari'
    const isBrowser = function (name, current) {
      return function () {
        return current === name
      }
    }
    const unknown$1 = function () {
      return nu$1({
        current: undefined,
        version: Version.unknown(),
      })
    }
    var nu$1 = function (info) {
      const { current } = info
      const { version } = info
      return {
        current,
        version,
        isEdge: isBrowser(edge, current),
        isChrome: isBrowser(chrome, current),
        isIE: isBrowser(ie$1, current),
        isOpera: isBrowser(opera$1, current),
        isFirefox: isBrowser(firefox, current),
        isSafari: isBrowser(safari, current),
      }
    }
    const Browser = {
      unknown: unknown$1,
      nu: nu$1,
      edge: constant(edge),
      chrome: constant(chrome),
      ie: constant(ie$1),
      opera: constant(opera$1),
      firefox: constant(firefox),
      safari: constant(safari),
    }

    const windows = 'Windows'
    const ios = 'iOS'
    const android$1 = 'Android'
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
      return nu$2({
        current: undefined,
        version: Version.unknown(),
      })
    }
    var nu$2 = function (info) {
      const { current } = info
      const { version } = info
      return {
        current,
        version,
        isWindows: isOS(windows, current),
        isiOS: isOS(ios, current),
        isAndroid: isOS(android$1, current),
        isOSX: isOS(osx, current),
        isLinux: isOS(linux, current),
        isSolaris: isOS(solaris, current),
        isFreeBSD: isOS(freebsd, current),
      }
    }
    const OperatingSystem = {
      unknown: unknown$2,
      nu: nu$2,
      windows: constant(windows),
      ios: constant(ios),
      android: constant(android$1),
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

    const contains$2 = function (str, substr) {
      return str.indexOf(substr) !== -1
    }
    const trim$2 = function (str) {
      return str.replace(/^\s+|\s+$/g, '')
    }
    const lTrim = function (str) {
      return str.replace(/^\s+/g, '')
    }
    const rTrim = function (str) {
      return str.replace(/\s+$/g, '')
    }

    const normalVersionRegex = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/
    const checkContains = function (target) {
      return function (uastring) {
        return contains$2(uastring, target)
      }
    }
    const browsers = [
      {
        name: 'Edge',
        versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
        search(uastring) {
          const monstrosity = contains$2(uastring, 'edge/') && contains$2(uastring, 'chrome') && contains$2(uastring, 'safari') && contains$2(uastring, 'applewebkit')
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
          return contains$2(uastring, 'chrome') && !contains$2(uastring, 'chromeframe')
        },
      },
      {
        name: 'IE',
        versionRegexes: [
          /.*?msie\ ?([0-9]+)\.([0-9]+).*/,
          /.*?rv:([0-9]+)\.([0-9]+).*/,
        ],
        search(uastring) {
          return contains$2(uastring, 'msie') || contains$2(uastring, 'trident')
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
          return (contains$2(uastring, 'safari') || contains$2(uastring, 'mobile/')) && contains$2(uastring, 'applewebkit')
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
          return contains$2(uastring, 'iphone') || contains$2(uastring, 'ipad')
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
    const type = function (element) {
      return element.dom().nodeType
    }
    const isType$1 = function (t) {
      return function (element) {
        return type(element) === t
      }
    }
    const isElement = isType$1(ELEMENT)
    const isText = isType$1(TEXT)

    const { keys } = Object
    const hasOwnProperty$1 = Object.hasOwnProperty
    const each$3 = function (obj, f) {
      const props = keys(obj)
      for (let k = 0, len = props.length; k < len; k++) {
        const i = props[k]
        const x = obj[i]
        f(x, i, obj)
      }
    }
    const map$2 = function (obj, f) {
      return tupleMap(obj, (x, i, obj) => ({
        k: i,
        v: f(x, i, obj),
      }))
    }
    var tupleMap = function (obj, f) {
      const r = {}
      each$3(obj, (x, i) => {
        const tuple = f(x, i, obj)
        r[tuple.k] = tuple.v
      })
      return r
    }
    const bifilter = function (obj, pred) {
      const t = {}
      const f = {}
      each$3(obj, (x, i) => {
        const branch = pred(x, i) ? t : f
        branch[i] = x
      })
      return {
        t,
        f,
      }
    }
    const get = function (obj, key) {
      return has(obj, key) ? Option.some(obj[key]) : Option.none()
    }
    var has = function (obj, key) {
      return hasOwnProperty$1.call(obj, key)
    }

    const isSupported = function (dom) {
      return dom.style !== undefined
    }

    const inBody = function (element) {
      const dom = isText(element) ? element.dom().parentNode : element.dom()
      return dom !== undefined && dom !== null && dom.ownerDocument.body.contains(dom)
    }

    const rawSet = function (dom, key, value$$1) {
      if (isString(value$$1) || isBoolean(value$$1) || isNumber(value$$1)) {
        dom.setAttribute(key, `${value$$1}`)
      } else {
        console.error('Invalid call to Attr.set. Key ', key, ':: Value ', value$$1, ':: Element ', dom)
        throw new Error('Attribute value was not simple')
      }
    }
    const set = function (element, key, value$$1) {
      rawSet(element.dom(), key, value$$1)
    }
    const setAll = function (element, attrs) {
      const dom = element.dom()
      each$3(attrs, (v, k) => {
        rawSet(dom, k, v)
      })
    }
    const get$1 = function (element, key) {
      const v = element.dom().getAttribute(key)
      return v === null ? undefined : v
    }
    const has$1 = function (element, key) {
      const dom = element.dom()
      return dom && dom.hasAttribute ? dom.hasAttribute(key) : false
    }
    const remove = function (element, key) {
      element.dom().removeAttribute(key)
    }

    const get$2 = function (element, property) {
      const dom = element.dom()
      const styles = window.getComputedStyle(dom)
      const r = styles.getPropertyValue(property)
      const v = r === '' && !inBody(element) ? getUnsafeProperty(dom, property) : r
      return v === null ? undefined : v
    }
    var getUnsafeProperty = function (dom, property) {
      return isSupported(dom) ? dom.style.getPropertyValue(property) : ''
    }
    const getRaw = function (element, property) {
      const dom = element.dom()
      const raw = getUnsafeProperty(dom, property)
      return Option.from(raw).filter((r) => r.length > 0)
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

    const toArray$1 = function (target, f) {
      const r = []
      const recurse = function (e) {
        r.push(e)
        return f(e)
      }
      let cur = f(target)
      do {
        cur = cur.bind(recurse)
      } while (cur.isSome())
      return r
    }
    const Recurse = { toArray: toArray$1 }

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

    const ELEMENT$1 = ELEMENT
    const DOCUMENT$1 = DOCUMENT
    const is$1 = function (element, selector) {
      const elem = element.dom()
      if (elem.nodeType !== ELEMENT$1) {
        return false
      } if (elem.matches !== undefined) {
        return elem.matches(selector)
      } if (elem.msMatchesSelector !== undefined) {
        return elem.msMatchesSelector(selector)
      } if (elem.webkitMatchesSelector !== undefined) {
        return elem.webkitMatchesSelector(selector)
      } if (elem.mozMatchesSelector !== undefined) {
        return elem.mozMatchesSelector(selector)
      }
      throw new Error('Browser lacks native selectors')
    }
    const bypassSelector = function (dom) {
      return dom.nodeType !== ELEMENT$1 && dom.nodeType !== DOCUMENT$1 || dom.childElementCount === 0
    }
    const all = function (selector, scope) {
      const base = scope === undefined ? document : scope.dom()
      return bypassSelector(base) ? [] : map(base.querySelectorAll(selector), Element$$1.fromDom)
    }
    const one = function (selector, scope) {
      const base = scope === undefined ? document : scope.dom()
      return bypassSelector(base) ? Option.none() : Option.from(base.querySelector(selector)).map(Element$$1.fromDom)
    }

    const eq = function (e1, e2) {
      return e1.dom() === e2.dom()
    }
    const regularContains = function (e1, e2) {
      const d1 = e1.dom()
      const d2 = e2.dom()
      return d1 === d2 ? false : d1.contains(d2)
    }
    const ieContains = function (e1, e2) {
      return Node$1.documentPositionContainedBy(e1.dom(), e2.dom())
    }
    const { browser } = PlatformDetection$1.detect()
    const contains$3 = browser.isIE() ? ieContains : regularContains

    const owner = function (element) {
      return Element$$1.fromDom(element.dom().ownerDocument)
    }
    const documentElement = function (element) {
      return Element$$1.fromDom(element.dom().ownerDocument.documentElement)
    }
    const defaultView = function (element) {
      const el = element.dom()
      const defView = el.ownerDocument.defaultView
      return Element$$1.fromDom(defView)
    }
    const parent = function (element) {
      const dom = element.dom()
      return Option.from(dom.parentNode).map(Element$$1.fromDom)
    }
    const parents = function (element, isRoot) {
      const stop = isFunction(isRoot) ? isRoot : constant(false)
      let dom = element.dom()
      const ret = []
      while (dom.parentNode !== null && dom.parentNode !== undefined) {
        const rawParent = dom.parentNode
        const p = Element$$1.fromDom(rawParent)
        ret.push(p)
        if (stop(p) === true) {
          break
        } else {
          dom = rawParent
        }
      }
      return ret
    }
    const prevSibling = function (element) {
      const dom = element.dom()
      return Option.from(dom.previousSibling).map(Element$$1.fromDom)
    }
    const nextSibling = function (element) {
      const dom = element.dom()
      return Option.from(dom.nextSibling).map(Element$$1.fromDom)
    }
    const prevSiblings = function (element) {
      return reverse(Recurse.toArray(element, prevSibling))
    }
    const nextSiblings = function (element) {
      return Recurse.toArray(element, nextSibling)
    }
    const children = function (element) {
      const dom = element.dom()
      return map(dom.childNodes, Element$$1.fromDom)
    }
    const child = function (element, index) {
      const cs = element.dom().childNodes
      return Option.from(cs[index]).map(Element$$1.fromDom)
    }
    const firstChild = function (element) {
      return child(element, 0)
    }
    const lastChild = function (element) {
      return child(element, element.dom().childNodes.length - 1)
    }
    const childNodesCount = function (element) {
      return element.dom().childNodes.length
    }
    const spot = Immutable('element', 'offset')

    const browser$1 = PlatformDetection$1.detect().browser
    const firstElement = function (nodes) {
      return find(nodes, isElement)
    }
    const getTableCaptionDeltaY = function (elm) {
      if (browser$1.isFirefox() && name(elm) === 'table') {
        return firstElement(children(elm)).filter((elm) => name(elm) === 'caption').bind((caption) => firstElement(nextSiblings(caption)).map((body) => {
          const bodyTop = body.dom().offsetTop
          const captionTop = caption.dom().offsetTop
          const captionHeight = caption.dom().offsetHeight
          return bodyTop <= captionTop ? -captionHeight : 0
        })).getOr(0)
      }
      return 0
    }
    const getPos = function (body, elm, rootElm) {
      let x = 0; let y = 0; let offsetParent$$1
      const doc = body.ownerDocument
      let pos
      rootElm = rootElm || body
      if (elm) {
        if (rootElm === body && elm.getBoundingClientRect && get$2(Element$$1.fromDom(body), 'position') === 'static') {
          pos = elm.getBoundingClientRect()
          x = pos.left + (doc.documentElement.scrollLeft || body.scrollLeft) - doc.documentElement.clientLeft
          y = pos.top + (doc.documentElement.scrollTop || body.scrollTop) - doc.documentElement.clientTop
          return {
            x,
            y,
          }
        }
        offsetParent$$1 = elm
        while (offsetParent$$1 && offsetParent$$1 !== rootElm && offsetParent$$1.nodeType) {
          x += offsetParent$$1.offsetLeft || 0
          y += offsetParent$$1.offsetTop || 0
          offsetParent$$1 = offsetParent$$1.offsetParent
        }
        offsetParent$$1 = elm.parentNode
        while (offsetParent$$1 && offsetParent$$1 !== rootElm && offsetParent$$1.nodeType) {
          x -= offsetParent$$1.scrollLeft || 0
          y -= offsetParent$$1.scrollTop || 0
          offsetParent$$1 = offsetParent$$1.parentNode
        }
        y += getTableCaptionDeltaY(Element$$1.fromDom(elm))
      }
      return {
        x,
        y,
      }
    }
    const Position = { getPos }

    var nu$3 = function (baseFn) {
      let data = Option.none()
      let callbacks = []
      const map$$1 = function (f) {
        return nu$3((nCallback) => {
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
      return nu$3((callback) => {
        callback(a)
      })
    }
    const LazyValue = {
      nu: nu$3,
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

    var nu$4 = function (baseFn) {
      const get = function (callback) {
        baseFn(bounce(callback))
      }
      const map = function (fab) {
        return nu$4((callback) => {
          get((a) => {
            const value = fab(a)
            callback(value)
          })
        })
      }
      const bind = function (aFutureB) {
        return nu$4((callback) => {
          get((a) => {
            aFutureB(a).get(callback)
          })
        })
      }
      const anonBind = function (futureB) {
        return nu$4((callback) => {
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
        return nu$4((callback) => {
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
      return nu$4((callback) => {
        callback(a)
      })
    }
    const Future = {
      nu: nu$4,
      pure: pure$2,
    }

    const par = function (asyncValues, nu) {
      return nu((callback) => {
        const r = []
        let count = 0
        const cb = function (i) {
          return function (value) {
            r[i] = value
            count++
            if (count >= asyncValues.length) {
              callback(r)
            }
          }
        }
        if (asyncValues.length === 0) {
          callback([])
        } else {
          each(asyncValues, (asyncValue, i) => {
            asyncValue.get(cb(i))
          })
        }
      })
    }

    const par$1 = function (futures) {
      return par(futures, Future.nu)
    }

    var value$1 = function (o) {
      const is = function (v) {
        return o === v
      }
      const or = function (opt) {
        return value$1(o)
      }
      const orThunk = function (f) {
        return value$1(o)
      }
      const map = function (f) {
        return value$1(f(o))
      }
      const mapError = function (f) {
        return value$1(o)
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
      value: value$1,
      error,
    }

    function StyleSheetLoader(document$$1, settings) {
      if (settings === void 0) {
        settings = {}
      }
      let idCount = 0
      const loadedStates = {}
      let maxLoadTime
      maxLoadTime = settings.maxLoadTime || 5000
      const appendToHead = function (node) {
        document$$1.getElementsByTagName('head')[0].appendChild(node)
      }
      const load = function (url, loadedCallback, errorCallback) {
        let link, style, startTime, state
        const resolve = function (status$$1) {
          state.status = status$$1
          state.passed = []
          state.failed = []
          if (link) {
            link.onload = null
            link.onerror = null
            link = null
          }
        }
        const passed = function () {
          const callbacks = state.passed
          let i = callbacks.length
          while (i--) {
            callbacks[i]()
          }
          resolve(2)
        }
        const failed = function () {
          const callbacks = state.failed
          let i = callbacks.length
          while (i--) {
            callbacks[i]()
          }
          resolve(3)
        }
        const isOldWebKit = function () {
          const webKitChunks = navigator.userAgent.match(/WebKit\/(\d*)/)
          return !!(webKitChunks && parseInt(webKitChunks[1], 10) < 536)
        }
        const wait = function (testCallback, waitCallback) {
          if (!testCallback()) {
            if (new Date().getTime() - startTime < maxLoadTime) {
              Delay.setTimeout(waitCallback)
            } else {
              failed()
            }
          }
        }
        var waitForWebKitLinkLoaded = function () {
          wait(() => {
            const { styleSheets } = document$$1
            let styleSheet; let i = styleSheets.length; let owner
            while (i--) {
              styleSheet = styleSheets[i]
              owner = styleSheet.ownerNode ? styleSheet.ownerNode : styleSheet.owningElement
              if (owner && owner.id === link.id) {
                passed()
                return true
              }
            }
          }, waitForWebKitLinkLoaded)
        }
        var waitForGeckoLinkLoaded = function () {
          wait(() => {
            try {
              const { cssRules } = style.sheet
              passed()
              return !!cssRules
            } catch (ex) {
            }
          }, waitForGeckoLinkLoaded)
        }
        url = Tools._addCacheSuffix(url)
        if (!loadedStates[url]) {
          state = {
            passed: [],
            failed: [],
          }
          loadedStates[url] = state
        } else {
          state = loadedStates[url]
        }
        if (loadedCallback) {
          state.passed.push(loadedCallback)
        }
        if (errorCallback) {
          state.failed.push(errorCallback)
        }
        if (state.status === 1) {
          return
        }
        if (state.status === 2) {
          passed()
          return
        }
        if (state.status === 3) {
          failed()
          return
        }
        state.status = 1
        link = document$$1.createElement('link')
        link.rel = 'stylesheet'
        link.type = 'text/css'
        link.id = `u${idCount++}`
        link.async = false
        link.defer = false
        startTime = new Date().getTime()
        if (settings.contentCssCors) {
          link.crossOrigin = 'anonymous'
        }
        if ('onload' in link && !isOldWebKit()) {
          link.onload = waitForWebKitLinkLoaded
          link.onerror = failed
        } else {
          if (navigator.userAgent.indexOf('Firefox') > 0) {
            style = document$$1.createElement('style')
            style.textContent = `@import "${url}"`
            waitForGeckoLinkLoaded()
            appendToHead(style)
            return
          }
          waitForWebKitLinkLoaded()
        }
        appendToHead(link)
        link.href = url
      }
      const loadF = function (url) {
        return Future.nu((resolve) => {
          load(url, compose(resolve, constant(Result.value(url))), compose(resolve, constant(Result.error(url))))
        })
      }
      const unbox = function (result) {
        return result.fold(identity, identity)
      }
      const loadAll = function (urls, success, failure) {
        par$1(map(urls, loadF)).get((result) => {
          const parts = partition(result, (r) => r.isValue())
          if (parts.fail.length > 0) {
            failure(parts.fail.map(unbox))
          } else {
            success(parts.pass.map(unbox))
          }
        })
      }
      return {
        load,
        loadAll,
      }
    }

    function TreeWalker(startNode, rootNode) {
      let node = startNode
      const findSibling = function (node, startName, siblingName, shallow) {
        let sibling, parent
        if (node) {
          if (!shallow && node[startName]) {
            return node[startName]
          }
          if (node !== rootNode) {
            sibling = node[siblingName]
            if (sibling) {
              return sibling
            }
            for (parent = node.parentNode; parent && parent !== rootNode; parent = parent.parentNode) {
              sibling = parent[siblingName]
              if (sibling) {
                return sibling
              }
            }
          }
        }
      }
      const findPreviousNode = function (node, startName, siblingName, shallow) {
        let sibling, parent, child
        if (node) {
          sibling = node[siblingName]
          if (rootNode && sibling === rootNode) {
            return
          }
          if (sibling) {
            if (!shallow) {
              for (child = sibling[startName]; child; child = child[startName]) {
                if (!child[startName]) {
                  return child
                }
              }
            }
            return sibling
          }
          parent = node.parentNode
          if (parent && parent !== rootNode) {
            return parent
          }
        }
      }
      this.current = function () {
        return node
      }
      this.next = function (shallow) {
        node = findSibling(node, 'firstChild', 'nextSibling', shallow)
        return node
      }
      this.prev = function (shallow) {
        node = findSibling(node, 'lastChild', 'previousSibling', shallow)
        return node
      }
      this.prev2 = function (shallow) {
        node = findPreviousNode(node, 'lastChild', 'previousSibling', shallow)
        return node
      }
    }

    const blocks = [
      'article',
      'aside',
      'details',
      'div',
      'dt',
      'figcaption',
      'footer',
      'form',
      'fieldset',
      'header',
      'hgroup',
      'html',
      'main',
      'nav',
      'section',
      'summary',
      'body',
      'p',
      'dl',
      'multicol',
      'dd',
      'figure',
      'address',
      'center',
      'blockquote',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'listing',
      'xmp',
      'pre',
      'plaintext',
      'menu',
      'dir',
      'ul',
      'ol',
      'li',
      'hr',
      'table',
      'tbody',
      'thead',
      'tfoot',
      'th',
      'tr',
      'td',
      'caption',
    ]
    const voids = [
      'area',
      'base',
      'basefont',
      'br',
      'col',
      'frame',
      'hr',
      'img',
      'input',
      'isindex',
      'link',
      'meta',
      'param',
      'embed',
      'source',
      'wbr',
      'track',
    ]
    const tableCells = [
      'td',
      'th',
    ]
    const tableSections = [
      'thead',
      'tbody',
      'tfoot',
    ]
    const textBlocks = [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'div',
      'address',
      'pre',
      'form',
      'blockquote',
      'center',
      'dir',
      'fieldset',
      'header',
      'footer',
      'article',
      'section',
      'hgroup',
      'aside',
      'nav',
      'figure',
    ]
    const headings = [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
    ]
    const listItems = [
      'li',
      'dd',
      'dt',
    ]
    const lists = [
      'ul',
      'ol',
      'dl',
    ]
    const wsElements = [
      'pre',
      'script',
      'textarea',
      'style',
    ]
    const lazyLookup = function (items) {
      let lookup
      return function (node) {
        lookup = lookup || mapToObject(items, constant(true))
        return lookup.hasOwnProperty(name(node))
      }
    }
    const isHeading = lazyLookup(headings)
    const isBlock = lazyLookup(blocks)
    const isTable = function (node) {
      return name(node) === 'table'
    }
    const isInline = function (node) {
      return isElement(node) && !isBlock(node)
    }
    const isBr = function (node) {
      return isElement(node) && name(node) === 'br'
    }
    const isTextBlock = lazyLookup(textBlocks)
    const isList = lazyLookup(lists)
    const isListItem = lazyLookup(listItems)
    const isVoid = lazyLookup(voids)
    const isTableSection = lazyLookup(tableSections)
    const isTableCell = lazyLookup(tableCells)
    const isWsPreserveElement = lazyLookup(wsElements)

    const isNodeType = function (type) {
      return function (node) {
        return !!node && node.nodeType === type
      }
    }
    const isElement$1 = isNodeType(1)
    const matchNodeNames = function (names) {
      const items = names.toLowerCase().split(' ')
      return function (node) {
        let i, name
        if (node && node.nodeType) {
          name = node.nodeName.toLowerCase()
          for (i = 0; i < items.length; i++) {
            if (name === items[i]) {
              return true
            }
          }
        }
        return false
      }
    }
    const matchStyleValues = function (name, values) {
      const items = values.toLowerCase().split(' ')
      return function (node) {
        let i, cssValue
        if (isElement$1(node)) {
          for (i = 0; i < items.length; i++) {
            const computed = node.ownerDocument.defaultView.getComputedStyle(node, null)
            cssValue = computed ? computed.getPropertyValue(name) : null
            if (cssValue === items[i]) {
              return true
            }
          }
        }
        return false
      }
    }
    const hasPropValue = function (propName, propValue) {
      return function (node) {
        return isElement$1(node) && node[propName] === propValue
      }
    }
    const hasAttribute = function (attrName, attrValue) {
      return function (node) {
        return isElement$1(node) && node.hasAttribute(attrName)
      }
    }
    const hasAttributeValue = function (attrName, attrValue) {
      return function (node) {
        return isElement$1(node) && node.getAttribute(attrName) === attrValue
      }
    }
    const isBogus = function (node) {
      return isElement$1(node) && node.hasAttribute('data-mce-bogus')
    }
    const isBogusAll = function (node) {
      return isElement$1(node) && node.getAttribute('data-mce-bogus') === 'all'
    }
    const isTable$1 = function (node) {
      return isElement$1(node) && node.tagName === 'TABLE'
    }
    const hasContentEditableState = function (value) {
      return function (node) {
        if (isElement$1(node)) {
          if (node.contentEditable === value) {
            return true
          }
          if (node.getAttribute('data-mce-contenteditable') === value) {
            return true
          }
        }
        return false
      }
    }
    const isText$1 = isNodeType(3)
    const isComment$1 = isNodeType(8)
    const isDocument$1 = isNodeType(9)
    const isBr$1 = matchNodeNames('br')
    const isContentEditableTrue = hasContentEditableState('true')
    const isContentEditableFalse = hasContentEditableState('false')
    const NodeType = {
      isText: isText$1,
      isElement: isElement$1,
      isComment: isComment$1,
      isDocument: isDocument$1,
      isBr: isBr$1,
      isContentEditableTrue,
      isContentEditableFalse,
      matchNodeNames,
      hasPropValue,
      hasAttribute,
      hasAttributeValue,
      matchStyleValues,
      isBogus,
      isBogusAll,
      isTable: isTable$1,
    }

    const surroundedBySpans = function (node) {
      const previousIsSpan = node.previousSibling && node.previousSibling.nodeName === 'SPAN'
      const nextIsSpan = node.nextSibling && node.nextSibling.nodeName === 'SPAN'
      return previousIsSpan && nextIsSpan
    }
    const isBookmarkNode = function (node) {
      return node && node.tagName === 'SPAN' && node.getAttribute('data-mce-type') === 'bookmark'
    }
    var trimNode = function (dom, node) {
      let i; let children = node.childNodes
      if (NodeType.isElement(node) && isBookmarkNode(node)) {
        return
      }
      for (i = children.length - 1; i >= 0; i--) {
        trimNode(dom, children[i])
      }
      if (NodeType.isDocument(node) === false) {
        if (NodeType.isText(node) && node.nodeValue.length > 0) {
          const trimmedLength = Tools.trim(node.nodeValue).length
          if (dom.isBlock(node.parentNode) || trimmedLength > 0) {
            return
          }
          if (trimmedLength === 0 && surroundedBySpans(node)) {
            return
          }
        } else if (NodeType.isElement(node)) {
          children = node.childNodes
          if (children.length === 1 && isBookmarkNode(children[0])) {
            node.parentNode.insertBefore(children[0], node)
          }
          if (children.length || isVoid(Element$$1.fromDom(node))) {
            return
          }
        }
        dom.remove(node)
      }
      return node
    }
    const TrimNode = { trimNode }

    const makeMap$1 = Tools.makeMap
    let namedEntities, baseEntities, reverseEntities
    const attrsCharsRegExp = /[&<>\"\u0060\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g
    const textCharsRegExp = /[<>&\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g
    const rawCharsRegExp = /[<>&\"\']/g
    const entityRegExp = /&#([a-z0-9]+);?|&([a-z0-9]+);/gi
    const asciiMap = {
      128: '\u20AC',
      130: '\u201A',
      131: '\u0192',
      132: '\u201E',
      133: '\u2026',
      134: '\u2020',
      135: '\u2021',
      136: '\u02c6',
      137: '\u2030',
      138: '\u0160',
      139: '\u2039',
      140: '\u0152',
      142: '\u017d',
      145: '\u2018',
      146: '\u2019',
      147: '\u201C',
      148: '\u201D',
      149: '\u2022',
      150: '\u2013',
      151: '\u2014',
      152: '\u02DC',
      153: '\u2122',
      154: '\u0161',
      155: '\u203A',
      156: '\u0153',
      158: '\u017e',
      159: '\u0178',
    }
    baseEntities = {
      '"': '&quot;',
      '\'': '&#39;',
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '`': '&#96;',
    }
    reverseEntities = {
      '&lt;': '<',
      '&gt;': '>',
      '&amp;': '&',
      '&quot;': '"',
      '&apos;': '\'',
    }
    const nativeDecode = function (text) {
      let elm
      elm = Element$$1.fromTag('div').dom()
      elm.innerHTML = text
      return elm.textContent || elm.innerText || text
    }
    const buildEntitiesLookup = function (items, radix) {
      let i, chr, entity
      const lookup = {}
      if (items) {
        items = items.split(',')
        radix = radix || 10
        for (i = 0; i < items.length; i += 2) {
          chr = String.fromCharCode(parseInt(items[i], radix))
          if (!baseEntities[chr]) {
            entity = `&${items[i + 1]};`
            lookup[chr] = entity
            lookup[entity] = chr
          }
        }
        return lookup
      }
    }
    namedEntities = buildEntitiesLookup('50,nbsp,51,iexcl,52,cent,53,pound,54,curren,55,yen,56,brvbar,57,sect,58,uml,59,copy,' + '5a,ordf,5b,laquo,5c,not,5d,shy,5e,reg,5f,macr,5g,deg,5h,plusmn,5i,sup2,5j,sup3,5k,acute,' + '5l,micro,5m,para,5n,middot,5o,cedil,5p,sup1,5q,ordm,5r,raquo,5s,frac14,5t,frac12,5u,frac34,' + '5v,iquest,60,Agrave,61,Aacute,62,Acirc,63,Atilde,64,Auml,65,Aring,66,AElig,67,Ccedil,' + '68,Egrave,69,Eacute,6a,Ecirc,6b,Euml,6c,Igrave,6d,Iacute,6e,Icirc,6f,Iuml,6g,ETH,6h,Ntilde,' + '6i,Ograve,6j,Oacute,6k,Ocirc,6l,Otilde,6m,Ouml,6n,times,6o,Oslash,6p,Ugrave,6q,Uacute,' + '6r,Ucirc,6s,Uuml,6t,Yacute,6u,THORN,6v,szlig,70,agrave,71,aacute,72,acirc,73,atilde,74,auml,' + '75,aring,76,aelig,77,ccedil,78,egrave,79,eacute,7a,ecirc,7b,euml,7c,igrave,7d,iacute,7e,icirc,' + '7f,iuml,7g,eth,7h,ntilde,7i,ograve,7j,oacute,7k,ocirc,7l,otilde,7m,ouml,7n,divide,7o,oslash,' + '7p,ugrave,7q,uacute,7r,ucirc,7s,uuml,7t,yacute,7u,thorn,7v,yuml,ci,fnof,sh,Alpha,si,Beta,' + 'sj,Gamma,sk,Delta,sl,Epsilon,sm,Zeta,sn,Eta,so,Theta,sp,Iota,sq,Kappa,sr,Lambda,ss,Mu,' + 'st,Nu,su,Xi,sv,Omicron,t0,Pi,t1,Rho,t3,Sigma,t4,Tau,t5,Upsilon,t6,Phi,t7,Chi,t8,Psi,' + 't9,Omega,th,alpha,ti,beta,tj,gamma,tk,delta,tl,epsilon,tm,zeta,tn,eta,to,theta,tp,iota,' + 'tq,kappa,tr,lambda,ts,mu,tt,nu,tu,xi,tv,omicron,u0,pi,u1,rho,u2,sigmaf,u3,sigma,u4,tau,' + 'u5,upsilon,u6,phi,u7,chi,u8,psi,u9,omega,uh,thetasym,ui,upsih,um,piv,812,bull,816,hellip,' + '81i,prime,81j,Prime,81u,oline,824,frasl,88o,weierp,88h,image,88s,real,892,trade,89l,alefsym,' + '8cg,larr,8ch,uarr,8ci,rarr,8cj,darr,8ck,harr,8dl,crarr,8eg,lArr,8eh,uArr,8ei,rArr,8ej,dArr,' + '8ek,hArr,8g0,forall,8g2,part,8g3,exist,8g5,empty,8g7,nabla,8g8,isin,8g9,notin,8gb,ni,8gf,prod,' + '8gh,sum,8gi,minus,8gn,lowast,8gq,radic,8gt,prop,8gu,infin,8h0,ang,8h7,and,8h8,or,8h9,cap,8ha,cup,' + '8hb,int,8hk,there4,8hs,sim,8i5,cong,8i8,asymp,8j0,ne,8j1,equiv,8j4,le,8j5,ge,8k2,sub,8k3,sup,8k4,' + 'nsub,8k6,sube,8k7,supe,8kl,oplus,8kn,otimes,8l5,perp,8m5,sdot,8o8,lceil,8o9,rceil,8oa,lfloor,8ob,' + 'rfloor,8p9,lang,8pa,rang,9ea,loz,9j0,spades,9j3,clubs,9j5,hearts,9j6,diams,ai,OElig,aj,oelig,b0,' + 'Scaron,b1,scaron,bo,Yuml,m6,circ,ms,tilde,802,ensp,803,emsp,809,thinsp,80c,zwnj,80d,zwj,80e,lrm,' + '80f,rlm,80j,ndash,80k,mdash,80o,lsquo,80p,rsquo,80q,sbquo,80s,ldquo,80t,rdquo,80u,bdquo,810,dagger,' + '811,Dagger,81g,permil,81p,lsaquo,81q,rsaquo,85c,euro', 32)
    const encodeRaw = function (text, attr) {
      return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, (chr) => baseEntities[chr] || chr)
    }
    const encodeAllRaw = function (text) {
      return (`${text}`).replace(rawCharsRegExp, (chr) => baseEntities[chr] || chr)
    }
    const encodeNumeric = function (text, attr) {
      return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, (chr) => {
        if (chr.length > 1) {
          return `&#${(chr.charCodeAt(0) - 55296) * 1024 + (chr.charCodeAt(1) - 56320) + 65536};`
        }
        return baseEntities[chr] || `&#${chr.charCodeAt(0)};`
      })
    }
    const encodeNamed = function (text, attr, entities) {
      entities = entities || namedEntities
      return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, (chr) => baseEntities[chr] || entities[chr] || chr)
    }
    const getEncodeFunc = function (name, entities) {
      const entitiesMap = buildEntitiesLookup(entities) || namedEntities
      const encodeNamedAndNumeric = function (text, attr) {
        return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, (chr) => {
          if (baseEntities[chr] !== undefined) {
            return baseEntities[chr]
          }
          if (entitiesMap[chr] !== undefined) {
            return entitiesMap[chr]
          }
          if (chr.length > 1) {
            return `&#${(chr.charCodeAt(0) - 55296) * 1024 + (chr.charCodeAt(1) - 56320) + 65536};`
          }
          return `&#${chr.charCodeAt(0)};`
        })
      }
      const encodeCustomNamed = function (text, attr) {
        return encodeNamed(text, attr, entitiesMap)
      }
      const nameMap = makeMap$1(name.replace(/\+/g, ','))
      if (nameMap.named && nameMap.numeric) {
        return encodeNamedAndNumeric
      }
      if (nameMap.named) {
        if (entities) {
          return encodeCustomNamed
        }
        return encodeNamed
      }
      if (nameMap.numeric) {
        return encodeNumeric
      }
      return encodeRaw
    }
    const decode = function (text) {
      return text.replace(entityRegExp, (all, numeric) => {
        if (numeric) {
          if (numeric.charAt(0).toLowerCase() === 'x') {
            numeric = parseInt(numeric.substr(1), 16)
          } else {
            numeric = parseInt(numeric, 10)
          }
          if (numeric > 65535) {
            numeric -= 65536
            return String.fromCharCode(55296 + (numeric >> 10), 56320 + (numeric & 1023))
          }
          return asciiMap[numeric] || String.fromCharCode(numeric)
        }
        return reverseEntities[all] || namedEntities[all] || nativeDecode(all)
      })
    }
    const Entities = {
      encodeRaw,
      encodeAllRaw,
      encodeNumeric,
      encodeNamed,
      getEncodeFunc,
      decode,
    }

    const mapCache = {}; const dummyObj = {}
    const makeMap$2 = Tools.makeMap; const each$4 = Tools.each; const extend$1 = Tools.extend; const explode$1 = Tools.explode; const inArray$1 = Tools.inArray
    const split = function (items, delim) {
      items = Tools.trim(items)
      return items ? items.split(delim || ' ') : []
    }
    const compileSchema = function (type) {
      const schema = {}
      let globalAttributes, blockContent
      let phrasingContent, flowContent, html4BlockContent, html4PhrasingContent
      const add = function (name, attributes, children) {
        let ni, attributesOrder, element
        const arrayToMap = function (array, obj) {
          const map = {}
          let i, l
          for (i = 0, l = array.length; i < l; i++) {
            map[array[i]] = obj || {}
          }
          return map
        }
        children = children || []
        attributes = attributes || ''
        if (typeof children === 'string') {
          children = split(children)
        }
        name = split(name)
        ni = name.length
        while (ni--) {
          attributesOrder = split([
            globalAttributes,
            attributes,
          ].join(' '))
          element = {
            attributes: arrayToMap(attributesOrder),
            attributesOrder,
            children: arrayToMap(children, dummyObj),
          }
          schema[name[ni]] = element
        }
      }
      const addAttrs = function (name, attributes) {
        let ni, schemaItem, i, l
        name = split(name)
        ni = name.length
        attributes = split(attributes)
        while (ni--) {
          schemaItem = schema[name[ni]]
          for (i = 0, l = attributes.length; i < l; i++) {
            schemaItem.attributes[attributes[i]] = {}
            schemaItem.attributesOrder.push(attributes[i])
          }
        }
      }
      if (mapCache[type]) {
        return mapCache[type]
      }
      globalAttributes = 'id accesskey class dir lang style tabindex title role'
      blockContent = 'address blockquote div dl fieldset form h1 h2 h3 h4 h5 h6 hr menu ol p pre table ul'
      phrasingContent = 'a abbr b bdo br button cite code del dfn em embed i iframe img input ins kbd ' + 'label map noscript object q s samp script select small span strong sub sup ' + 'textarea u var #text #comment'
      if (type !== 'html4') {
        globalAttributes += ' contenteditable contextmenu draggable dropzone ' + 'hidden spellcheck translate'
        blockContent += ' article aside details dialog figure main header footer hgroup section nav'
        phrasingContent += ' audio canvas command datalist mark meter output picture ' + 'progress time wbr video ruby bdi keygen'
      }
      if (type !== 'html5-strict') {
        globalAttributes += ' xml:lang'
        html4PhrasingContent = 'acronym applet basefont big font strike tt'
        phrasingContent = [
          phrasingContent,
          html4PhrasingContent,
        ].join(' ')
        each$4(split(html4PhrasingContent), (name) => {
          add(name, '', phrasingContent)
        })
        html4BlockContent = 'center dir isindex noframes'
        blockContent = [
          blockContent,
          html4BlockContent,
        ].join(' ')
        flowContent = [
          blockContent,
          phrasingContent,
        ].join(' ')
        each$4(split(html4BlockContent), (name) => {
          add(name, '', flowContent)
        })
      }
      flowContent = flowContent || [
        blockContent,
        phrasingContent,
      ].join(' ')
      add('html', 'manifest', 'head body')
      add('head', '', 'base command link meta noscript script style title')
      add('title hr noscript br')
      add('base', 'href target')
      add('link', 'href rel media hreflang type sizes hreflang')
      add('meta', 'name http-equiv content charset')
      add('style', 'media type scoped')
      add('script', 'src async defer type charset')
      add('body', 'onafterprint onbeforeprint onbeforeunload onblur onerror onfocus ' + 'onhashchange onload onmessage onoffline ononline onpagehide onpageshow ' + 'onpopstate onresize onscroll onstorage onunload', flowContent)
      add('address dt dd div caption', '', flowContent)
      add('h1 h2 h3 h4 h5 h6 pre p abbr code var samp kbd sub sup i b u bdo span legend em strong small s cite dfn', '', phrasingContent)
      add('blockquote', 'cite', flowContent)
      add('ol', 'reversed start type', 'li')
      add('ul', '', 'li')
      add('li', 'value', flowContent)
      add('dl', '', 'dt dd')
      add('a', 'href target rel media hreflang type', phrasingContent)
      add('q', 'cite', phrasingContent)
      add('ins del', 'cite datetime', flowContent)
      add('img', 'src sizes srcset alt usemap ismap width height')
      add('iframe', 'src name width height', flowContent)
      add('embed', 'src type width height')
      add('object', 'data type typemustmatch name usemap form width height', [
        flowContent,
        'param',
      ].join(' '))
      add('param', 'name value')
      add('map', 'name', [
        flowContent,
        'area',
      ].join(' '))
      add('area', 'alt coords shape href target rel media hreflang type')
      add('table', 'border', `caption colgroup thead tfoot tbody tr${type === 'html4' ? ' col' : ''}`)
      add('colgroup', 'span', 'col')
      add('col', 'span')
      add('tbody thead tfoot', '', 'tr')
      add('tr', '', 'td th')
      add('td', 'colspan rowspan headers', flowContent)
      add('th', 'colspan rowspan headers scope abbr', flowContent)
      add('form', 'accept-charset action autocomplete enctype method name novalidate target', flowContent)
      add('fieldset', 'disabled form name', [
        flowContent,
        'legend',
      ].join(' '))
      add('label', 'form for', phrasingContent)
      add('input', 'accept alt autocomplete checked dirname disabled form formaction formenctype formmethod formnovalidate ' + 'formtarget height list max maxlength min multiple name pattern readonly required size src step type value width')
      add('button', 'disabled form formaction formenctype formmethod formnovalidate formtarget name type value', type === 'html4' ? flowContent : phrasingContent)
      add('select', 'disabled form multiple name required size', 'option optgroup')
      add('optgroup', 'disabled label', 'option')
      add('option', 'disabled label selected value')
      add('textarea', 'cols dirname disabled form maxlength name readonly required rows wrap')
      add('menu', 'type label', [
        flowContent,
        'li',
      ].join(' '))
      add('noscript', '', flowContent)
      if (type !== 'html4') {
        add('wbr')
        add('ruby', '', [
          phrasingContent,
          'rt rp',
        ].join(' '))
        add('figcaption', '', flowContent)
        add('mark rt rp summary bdi', '', phrasingContent)
        add('canvas', 'width height', flowContent)
        add('video', 'src crossorigin poster preload autoplay mediagroup loop ' + 'muted controls width height buffered', [
          flowContent,
          'track source',
        ].join(' '))
        add('audio', 'src crossorigin preload autoplay mediagroup loop muted controls ' + 'buffered volume', [
          flowContent,
          'track source',
        ].join(' '))
        add('picture', '', 'img source')
        add('source', 'src srcset type media sizes')
        add('track', 'kind src srclang label default')
        add('datalist', '', [
          phrasingContent,
          'option',
        ].join(' '))
        add('article section nav aside main header footer', '', flowContent)
        add('hgroup', '', 'h1 h2 h3 h4 h5 h6')
        add('figure', '', [
          flowContent,
          'figcaption',
        ].join(' '))
        add('time', 'datetime', phrasingContent)
        add('dialog', 'open', flowContent)
        add('command', 'type label icon disabled checked radiogroup command')
        add('output', 'for form name', phrasingContent)
        add('progress', 'value max', phrasingContent)
        add('meter', 'value min max low high optimum', phrasingContent)
        add('details', 'open', [
          flowContent,
          'summary',
        ].join(' '))
        add('keygen', 'autofocus challenge disabled form keytype name')
      }
      if (type !== 'html5-strict') {
        addAttrs('script', 'language xml:space')
        addAttrs('style', 'xml:space')
        addAttrs('object', 'declare classid code codebase codetype archive standby align border hspace vspace')
        addAttrs('embed', 'align name hspace vspace')
        addAttrs('param', 'valuetype type')
        addAttrs('a', 'charset name rev shape coords')
        addAttrs('br', 'clear')
        addAttrs('applet', 'codebase archive code object alt name width height align hspace vspace')
        addAttrs('img', 'name longdesc align border hspace vspace')
        addAttrs('iframe', 'longdesc frameborder marginwidth marginheight scrolling align')
        addAttrs('font basefont', 'size color face')
        addAttrs('input', 'usemap align')
        addAttrs('select', 'onchange')
        addAttrs('textarea')
        addAttrs('h1 h2 h3 h4 h5 h6 div p legend caption', 'align')
        addAttrs('ul', 'type compact')
        addAttrs('li', 'type')
        addAttrs('ol dl menu dir', 'compact')
        addAttrs('pre', 'width xml:space')
        addAttrs('hr', 'align noshade size width')
        addAttrs('isindex', 'prompt')
        addAttrs('table', 'summary width frame rules cellspacing cellpadding align bgcolor')
        addAttrs('col', 'width align char charoff valign')
        addAttrs('colgroup', 'width align char charoff valign')
        addAttrs('thead', 'align char charoff valign')
        addAttrs('tr', 'align char charoff valign bgcolor')
        addAttrs('th', 'axis align char charoff valign nowrap bgcolor width height')
        addAttrs('form', 'accept')
        addAttrs('td', 'abbr axis scope align char charoff valign nowrap bgcolor width height')
        addAttrs('tfoot', 'align char charoff valign')
        addAttrs('tbody', 'align char charoff valign')
        addAttrs('area', 'nohref')
        addAttrs('body', 'background bgcolor text link vlink alink')
      }
      if (type !== 'html4') {
        addAttrs('input button select textarea', 'autofocus')
        addAttrs('input textarea', 'placeholder')
        addAttrs('a', 'download')
        addAttrs('link script img', 'crossorigin')
        addAttrs('iframe', 'sandbox seamless allowfullscreen')
      }
      each$4(split('a form meter progress dfn'), (name) => {
        if (schema[name]) {
          delete schema[name].children[name]
        }
      })
      delete schema.caption.children.table
      delete schema.script
      mapCache[type] = schema
      return schema
    }
    const compileElementMap = function (value, mode) {
      let styles
      if (value) {
        styles = {}
        if (typeof value === 'string') {
          value = { '*': value }
        }
        each$4(value, (value, key) => {
          styles[key] = styles[key.toUpperCase()] = mode === 'map' ? makeMap$2(value, /[, ]/) : explode$1(value, /[, ]/)
        })
      }
      return styles
    }
    function Schema(settings) {
      let elements = {}
      const children = {}
      let patternElements = []
      let validStyles
      let invalidStyles
      let schemaItems
      let whiteSpaceElementsMap, selfClosingElementsMap, shortEndedElementsMap, boolAttrMap, validClasses
      let blockElementsMap, nonEmptyElementsMap, moveCaretBeforeOnEnterElementsMap, textBlockElementsMap, textInlineElementsMap
      const customElementsMap = {}; const specialElements = {}
      const createLookupTable = function (option, defaultValue, extendWith) {
        let value = settings[option]
        if (!value) {
          value = mapCache[option]
          if (!value) {
            value = makeMap$2(defaultValue, ' ', makeMap$2(defaultValue.toUpperCase(), ' '))
            value = extend$1(value, extendWith)
            mapCache[option] = value
          }
        } else {
          value = makeMap$2(value, /[, ]/, makeMap$2(value.toUpperCase(), /[, ]/))
        }
        return value
      }
      settings = settings || {}
      schemaItems = compileSchema(settings.schema)
      if (settings.verify_html === false) {
        settings.valid_elements = '*[*]'
      }
      validStyles = compileElementMap(settings.valid_styles)
      invalidStyles = compileElementMap(settings.invalid_styles, 'map')
      validClasses = compileElementMap(settings.valid_classes, 'map')
      whiteSpaceElementsMap = createLookupTable('whitespace_elements', 'pre script noscript style textarea video audio iframe object code')
      selfClosingElementsMap = createLookupTable('self_closing_elements', 'colgroup dd dt li option p td tfoot th thead tr')
      shortEndedElementsMap = createLookupTable('short_ended_elements', 'area base basefont br col frame hr img input isindex link ' + 'meta param embed source wbr track')
      boolAttrMap = createLookupTable('boolean_attributes', 'checked compact declare defer disabled ismap multiple nohref noresize ' + 'noshade nowrap readonly selected autoplay loop controls')
      nonEmptyElementsMap = createLookupTable('non_empty_elements', 'td th iframe video audio object ' + 'script pre code', shortEndedElementsMap)
      moveCaretBeforeOnEnterElementsMap = createLookupTable('move_caret_before_on_enter_elements', 'table', nonEmptyElementsMap)
      textBlockElementsMap = createLookupTable('text_block_elements', 'h1 h2 h3 h4 h5 h6 p div address pre form ' + 'blockquote center dir fieldset header footer article section hgroup aside main nav figure')
      blockElementsMap = createLookupTable('block_elements', 'hr table tbody thead tfoot ' + 'th tr td li ol ul caption dl dt dd noscript menu isindex option ' + 'datalist select optgroup figcaption details summary', textBlockElementsMap)
      textInlineElementsMap = createLookupTable('text_inline_elements', 'span strong b em i font strike u var cite ' + 'dfn code mark q sup sub samp')
      each$4((settings.special || 'script noscript noframes noembed title style textarea xmp').split(' '), (name) => {
        specialElements[name] = new RegExp(`</${name}[^>]*>`, 'gi')
      })
      const patternToRegExp = function (str) {
        return new RegExp(`^${str.replace(/([?+*])/g, '.$1')}$`)
      }
      const addValidElements = function (validElements) {
        let ei, el, ai, al, matches, element, attr, attrData, elementName, attrName, attrType, attributes, attributesOrder, prefix, outputName, globalAttributes, globalAttributesOrder, key, value
        const elementRuleRegExp = /^([#+\-])?([^\[!\/]+)(?:\/([^\[!]+))?(?:(!?)\[([^\]]+)\])?$/; const attrRuleRegExp = /^([!\-])?(\w+[\\:]:\w+|[^=:<]+)?(?:([=:<])(.*))?$/; const hasPatternsRegExp = /[*?+]/
        if (validElements) {
          validElements = split(validElements, ',')
          if (elements['@']) {
            globalAttributes = elements['@'].attributes
            globalAttributesOrder = elements['@'].attributesOrder
          }
          for (ei = 0, el = validElements.length; ei < el; ei++) {
            matches = elementRuleRegExp.exec(validElements[ei])
            if (matches) {
              prefix = matches[1]
              elementName = matches[2]
              outputName = matches[3]
              attrData = matches[5]
              attributes = {}
              attributesOrder = []
              element = {
                attributes,
                attributesOrder,
              }
              if (prefix === '#') {
                element.paddEmpty = true
              }
              if (prefix === '-') {
                element.removeEmpty = true
              }
              if (matches[4] === '!') {
                element.removeEmptyAttrs = true
              }
              if (globalAttributes) {
                for (key in globalAttributes) {
                  attributes[key] = globalAttributes[key]
                }
                attributesOrder.push.apply(attributesOrder, globalAttributesOrder)
              }
              if (attrData) {
                attrData = split(attrData, '|')
                for (ai = 0, al = attrData.length; ai < al; ai++) {
                  matches = attrRuleRegExp.exec(attrData[ai])
                  if (matches) {
                    attr = {}
                    attrType = matches[1]
                    attrName = matches[2].replace(/[\\:]:/g, ':')
                    prefix = matches[3]
                    value = matches[4]
                    if (attrType === '!') {
                      element.attributesRequired = element.attributesRequired || []
                      element.attributesRequired.push(attrName)
                      attr.required = true
                    }
                    if (attrType === '-') {
                      delete attributes[attrName]
                      attributesOrder.splice(inArray$1(attributesOrder, attrName), 1)
                      continue
                    }
                    if (prefix) {
                      if (prefix === '=') {
                        element.attributesDefault = element.attributesDefault || []
                        element.attributesDefault.push({
                          name: attrName,
                          value,
                        })
                        attr.defaultValue = value
                      }
                      if (prefix === ':') {
                        element.attributesForced = element.attributesForced || []
                        element.attributesForced.push({
                          name: attrName,
                          value,
                        })
                        attr.forcedValue = value
                      }
                      if (prefix === '<') {
                        attr.validValues = makeMap$2(value, '?')
                      }
                    }
                    if (hasPatternsRegExp.test(attrName)) {
                      element.attributePatterns = element.attributePatterns || []
                      attr.pattern = patternToRegExp(attrName)
                      element.attributePatterns.push(attr)
                    } else {
                      if (!attributes[attrName]) {
                        attributesOrder.push(attrName)
                      }
                      attributes[attrName] = attr
                    }
                  }
                }
              }
              if (!globalAttributes && elementName === '@') {
                globalAttributes = attributes
                globalAttributesOrder = attributesOrder
              }
              if (outputName) {
                element.outputName = elementName
                elements[outputName] = element
              }
              if (hasPatternsRegExp.test(elementName)) {
                element.pattern = patternToRegExp(elementName)
                patternElements.push(element)
              } else {
                elements[elementName] = element
              }
            }
          }
        }
      }
      const setValidElements = function (validElements) {
        elements = {}
        patternElements = []
        addValidElements(validElements)
        each$4(schemaItems, (element, name) => {
          children[name] = element.children
        })
      }
      const addCustomElements = function (customElements) {
        const customElementRegExp = /^(~)?(.+)$/
        if (customElements) {
          mapCache.text_block_elements = mapCache.block_elements = null
          each$4(split(customElements, ','), (rule) => {
            const matches = customElementRegExp.exec(rule); const inline = matches[1] === '~'; const cloneName = inline ? 'span' : 'div'; const name = matches[2]
            children[name] = children[cloneName]
            customElementsMap[name] = cloneName
            if (!inline) {
              blockElementsMap[name.toUpperCase()] = {}
              blockElementsMap[name] = {}
            }
            if (!elements[name]) {
              let customRule = elements[cloneName]
              customRule = extend$1({}, customRule)
              delete customRule.removeEmptyAttrs
              delete customRule.removeEmpty
              elements[name] = customRule
            }
            each$4(children, (element, elmName) => {
              if (element[cloneName]) {
                children[elmName] = element = extend$1({}, children[elmName])
                element[name] = element[cloneName]
              }
            })
          })
        }
      }
      const addValidChildren = function (validChildren) {
        const childRuleRegExp = /^([+\-]?)(\w+)\[([^\]]+)\]$/
        mapCache[settings.schema] = null
        if (validChildren) {
          each$4(split(validChildren, ','), (rule) => {
            const matches = childRuleRegExp.exec(rule)
            let parent, prefix
            if (matches) {
              prefix = matches[1]
              if (prefix) {
                parent = children[matches[2]]
              } else {
                parent = children[matches[2]] = { '#comment': {} }
              }
              parent = children[matches[2]]
              each$4(split(matches[3], '|'), (child) => {
                if (prefix === '-') {
                  delete parent[child]
                } else {
                  parent[child] = {}
                }
              })
            }
          })
        }
      }
      const getElementRule = function (name) {
        let element = elements[name]; let i
        if (element) {
          return element
        }
        i = patternElements.length
        while (i--) {
          element = patternElements[i]
          if (element.pattern.test(name)) {
            return element
          }
        }
      }
      if (!settings.valid_elements) {
        each$4(schemaItems, (element, name) => {
          elements[name] = {
            attributes: element.attributes,
            attributesOrder: element.attributesOrder,
          }
          children[name] = element.children
        })
        if (settings.schema !== 'html5') {
          each$4(split('strong/b em/i'), (item) => {
            item = split(item, '/')
            elements[item[1]].outputName = item[0]
          })
        }
        each$4(split('ol ul sub sup blockquote span font a table tbody tr strong em b i'), (name) => {
          if (elements[name]) {
            elements[name].removeEmpty = true
          }
        })
        each$4(split('p h1 h2 h3 h4 h5 h6 th td pre div address caption li'), (name) => {
          elements[name].paddEmpty = true
        })
        each$4(split('span'), (name) => {
          elements[name].removeEmptyAttrs = true
        })
      } else {
        setValidElements(settings.valid_elements)
      }
      addCustomElements(settings.custom_elements)
      addValidChildren(settings.valid_children)
      addValidElements(settings.extended_valid_elements)
      addValidChildren('+ol[ul|ol],+ul[ul|ol]')
      each$4({
        dd: 'dl',
        dt: 'dl',
        li: 'ul ol',
        td: 'tr',
        th: 'tr',
        tr: 'tbody thead tfoot',
        tbody: 'table',
        thead: 'table',
        tfoot: 'table',
        legend: 'fieldset',
        area: 'map',
        param: 'video audio object',
      }, (parents, item) => {
        if (elements[item]) {
          elements[item].parentsRequired = split(parents)
        }
      })
      if (settings.invalid_elements) {
        each$4(explode$1(settings.invalid_elements), (item) => {
          if (elements[item]) {
            delete elements[item]
          }
        })
      }
      if (!getElementRule('span')) {
        addValidElements('span[!data-mce-type|*]')
      }
      const getValidStyles = function () {
        return validStyles
      }
      const getInvalidStyles = function () {
        return invalidStyles
      }
      const getValidClasses = function () {
        return validClasses
      }
      const getBoolAttrs = function () {
        return boolAttrMap
      }
      const getBlockElements = function () {
        return blockElementsMap
      }
      const getTextBlockElements = function () {
        return textBlockElementsMap
      }
      const getTextInlineElements = function () {
        return textInlineElementsMap
      }
      const getShortEndedElements = function () {
        return shortEndedElementsMap
      }
      const getSelfClosingElements = function () {
        return selfClosingElementsMap
      }
      const getNonEmptyElements = function () {
        return nonEmptyElementsMap
      }
      const getMoveCaretBeforeOnEnterElements = function () {
        return moveCaretBeforeOnEnterElementsMap
      }
      const getWhiteSpaceElements = function () {
        return whiteSpaceElementsMap
      }
      const getSpecialElements = function () {
        return specialElements
      }
      const isValidChild = function (name, child) {
        const parent = children[name.toLowerCase()]
        return !!(parent && parent[child.toLowerCase()])
      }
      const isValid = function (name, attr) {
        let attrPatterns, i
        const rule = getElementRule(name)
        if (rule) {
          if (attr) {
            if (rule.attributes[attr]) {
              return true
            }
            attrPatterns = rule.attributePatterns
            if (attrPatterns) {
              i = attrPatterns.length
              while (i--) {
                if (attrPatterns[i].pattern.test(name)) {
                  return true
                }
              }
            }
          } else {
            return true
          }
        }
        return false
      }
      const getCustomElements = function () {
        return customElementsMap
      }
      return {
        children,
        elements,
        getValidStyles,
        getValidClasses,
        getBlockElements,
        getInvalidStyles,
        getShortEndedElements,
        getTextBlockElements,
        getTextInlineElements,
        getBoolAttrs,
        getElementRule,
        getSelfClosingElements,
        getNonEmptyElements,
        getMoveCaretBeforeOnEnterElements,
        getWhiteSpaceElements,
        getSpecialElements,
        isValidChild,
        isValid,
        getCustomElements,
        addValidElements,
        setValidElements,
        addCustomElements,
        addValidChildren,
      }
    }

    const toHex = function (match, r, g, b) {
      const hex = function (val) {
        val = parseInt(val, 10).toString(16)
        return val.length > 1 ? val : `0${val}`
      }
      return `#${hex(r)}${hex(g)}${hex(b)}`
    }
    function Styles(settings, schema) {
      const rgbRegExp = /rgb\s*\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*\)/gi
      const urlOrStrRegExp = /(?:url(?:(?:\(\s*\"([^\"]+)\"\s*\))|(?:\(\s*\'([^\']+)\'\s*\))|(?:\(\s*([^)\s]+)\s*\))))|(?:\'([^\']+)\')|(?:\"([^\"]+)\")/gi
      const styleRegExp = /\s*([^:]+):\s*([^;]+);?/g
      const trimRightRegExp = /\s+$/
      let i
      const encodingLookup = {}
      let encodingItems
      let validStyles
      let invalidStyles
      const invisibleChar = '\uFEFF'
      settings = settings || {}
      if (schema) {
        validStyles = schema.getValidStyles()
        invalidStyles = schema.getInvalidStyles()
      }
      encodingItems = (`\\" \\' \\; \\: ; : ${invisibleChar}`).split(' ')
      for (i = 0; i < encodingItems.length; i++) {
        encodingLookup[encodingItems[i]] = invisibleChar + i
        encodingLookup[invisibleChar + i] = encodingItems[i]
      }
      return {
        toHex(color) {
          return color.replace(rgbRegExp, toHex)
        },
        parse(css) {
          const styles = {}
          let matches, name, value, isEncoded
          const urlConverter = settings.url_converter
          const urlConverterScope = settings.url_converter_scope || this
          const compress = function (prefix, suffix, noJoin) {
            let top, right, bottom, left
            top = styles[`${prefix}-top${suffix}`]
            if (!top) {
              return
            }
            right = styles[`${prefix}-right${suffix}`]
            if (!right) {
              return
            }
            bottom = styles[`${prefix}-bottom${suffix}`]
            if (!bottom) {
              return
            }
            left = styles[`${prefix}-left${suffix}`]
            if (!left) {
              return
            }
            const box = [
              top,
              right,
              bottom,
              left,
            ]
            i = box.length - 1
            while (i--) {
              if (box[i] !== box[i + 1]) {
                break
              }
            }
            if (i > -1 && noJoin) {
              return
            }
            styles[prefix + suffix] = i === -1 ? box[0] : box.join(' ')
            delete styles[`${prefix}-top${suffix}`]
            delete styles[`${prefix}-right${suffix}`]
            delete styles[`${prefix}-bottom${suffix}`]
            delete styles[`${prefix}-left${suffix}`]
          }
          const canCompress = function (key) {
            let value = styles[key]; let i
            if (!value) {
              return
            }
            value = value.split(' ')
            i = value.length
            while (i--) {
              if (value[i] !== value[0]) {
                return false
              }
            }
            styles[key] = value[0]
            return true
          }
          const compress2 = function (target, a, b, c) {
            if (!canCompress(a)) {
              return
            }
            if (!canCompress(b)) {
              return
            }
            if (!canCompress(c)) {
              return
            }
            styles[target] = `${styles[a]} ${styles[b]} ${styles[c]}`
            delete styles[a]
            delete styles[b]
            delete styles[c]
          }
          const encode = function (str) {
            isEncoded = true
            return encodingLookup[str]
          }
          const decode = function (str, keepSlashes) {
            if (isEncoded) {
              str = str.replace(/\uFEFF[0-9]/g, (str) => encodingLookup[str])
            }
            if (!keepSlashes) {
              str = str.replace(/\\([\'\";:])/g, '$1')
            }
            return str
          }
          const decodeSingleHexSequence = function (escSeq) {
            return String.fromCharCode(parseInt(escSeq.slice(1), 16))
          }
          const decodeHexSequences = function (value) {
            return value.replace(/\\[0-9a-f]+/gi, decodeSingleHexSequence)
          }
          const processUrl = function (match, url, url2, url3, str, str2) {
            str = str || str2
            if (str) {
              str = decode(str)
              return `'${str.replace(/\'/g, '\\\'')}'`
            }
            url = decode(url || url2 || url3)
            if (!settings.allow_script_urls) {
              const scriptUrl = url.replace(/[\s\r\n]+/g, '')
              if (/(java|vb)script:/i.test(scriptUrl)) {
                return ''
              }
              if (!settings.allow_svg_data_urls && /^data:image\/svg/i.test(scriptUrl)) {
                return ''
              }
            }
            if (urlConverter) {
              url = urlConverter.call(urlConverterScope, url, 'style')
            }
            return `url('${url.replace(/\'/g, '\\\'')}')`
          }
          if (css) {
            css = css.replace(/[\u0000-\u001F]/g, '')
            css = css.replace(/\\[\"\';:\uFEFF]/g, encode).replace(/\"[^\"]+\"|\'[^\']+\'/g, (str) => str.replace(/[;:]/g, encode))
            while (matches = styleRegExp.exec(css)) {
              styleRegExp.lastIndex = matches.index + matches[0].length
              name = matches[1].replace(trimRightRegExp, '').toLowerCase()
              value = matches[2].replace(trimRightRegExp, '')
              if (name && value) {
                name = decodeHexSequences(name)
                value = decodeHexSequences(value)
                if (name.indexOf(invisibleChar) !== -1 || name.indexOf('"') !== -1) {
                  continue
                }
                if (!settings.allow_script_urls && (name === 'behavior' || /expression\s*\(|\/\*|\*\//.test(value))) {
                  continue
                }
                if (name === 'font-weight' && value === '700') {
                  value = 'bold'
                } else if (name === 'color' || name === 'background-color') {
                  value = value.toLowerCase()
                }
                value = value.replace(rgbRegExp, toHex)
                value = value.replace(urlOrStrRegExp, processUrl)
                styles[name] = isEncoded ? decode(value, true) : value
              }
            }
            compress('border', '', true)
            compress('border', '-width')
            compress('border', '-color')
            compress('border', '-style')
            compress('padding', '')
            compress('margin', '')
            compress2('border', 'border-width', 'border-style', 'border-color')
            if (styles.border === 'medium none') {
              delete styles.border
            }
            if (styles['border-image'] === 'none') {
              delete styles['border-image']
            }
          }
          return styles
        },
        serialize(styles, elementName) {
          let css = ''; let name; let value
          const serializeStyles = function (name) {
            let styleList, i, l, value
            styleList = validStyles[name]
            if (styleList) {
              for (i = 0, l = styleList.length; i < l; i++) {
                name = styleList[i]
                value = styles[name]
                if (value) {
                  css += `${(css.length > 0 ? ' ' : '') + name}: ${value};`
                }
              }
            }
          }
          const isValid = function (name, elementName) {
            let styleMap
            styleMap = invalidStyles['*']
            if (styleMap && styleMap[name]) {
              return false
            }
            styleMap = invalidStyles[elementName]
            if (styleMap && styleMap[name]) {
              return false
            }
            return true
          }
          if (elementName && validStyles) {
            serializeStyles('*')
            serializeStyles(elementName)
          } else {
            for (name in styles) {
              value = styles[name]
              if (value && (!invalidStyles || isValid(name, elementName))) {
                css += `${(css.length > 0 ? ' ' : '') + name}: ${value};`
              }
            }
          }
          return css
        },
      }
    }

    const each$5 = Tools.each
    const grep$1 = Tools.grep
    const isIE = Env.ie
    const simpleSelectorRe = /^([a-z0-9],?)+$/i
    const whiteSpaceRegExp$2 = /^[ \t\r\n]*$/
    const setupAttrHooks = function (styles, settings, getContext) {
      let attrHooks = {}
      const keepValues = settings.keep_values
      const keepUrlHook = {
        set($elm, value, name$$1) {
          if (settings.url_converter) {
            value = settings.url_converter.call(settings.url_converter_scope || getContext(), value, name$$1, $elm[0])
          }
          $elm.attr(`data-mce-${name$$1}`, value).attr(name$$1, value)
        },
        get($elm, name$$1) {
          return $elm.attr(`data-mce-${name$$1}`) || $elm.attr(name$$1)
        },
      }
      attrHooks = {
        style: {
          set($elm, value) {
            if (value !== null && typeof value === 'object') {
              $elm.css(value)
              return
            }
            if (keepValues) {
              $elm.attr('data-mce-style', value)
            }
            $elm.attr('style', value)
          },
          get($elm) {
            let value = $elm.attr('data-mce-style') || $elm.attr('style')
            value = styles.serialize(styles.parse(value), $elm[0].nodeName)
            return value
          },
        },
      }
      if (keepValues) {
        attrHooks.href = attrHooks.src = keepUrlHook
      }
      return attrHooks
    }
    const updateInternalStyleAttr = function (styles, $elm) {
      const rawValue = $elm.attr('style')
      let value = styles.serialize(styles.parse(rawValue), $elm[0].nodeName)
      if (!value) {
        value = null
      }
      $elm.attr('data-mce-style', value)
    }
    const findNodeIndex = function (node, normalized) {
      let idx = 0; let lastNodeType; let nodeType
      if (node) {
        for (lastNodeType = node.nodeType, node = node.previousSibling; node; node = node.previousSibling) {
          nodeType = node.nodeType
          if (normalized && nodeType === 3) {
            if (nodeType === lastNodeType || !node.nodeValue.length) {
              continue
            }
          }
          idx++
          lastNodeType = nodeType
        }
      }
      return idx
    }
    function DOMUtils(doc, settings) {
      const _this = this
      if (settings === void 0) {
        settings = {}
      }
      let attrHooks
      const addedStyles = {}
      const win = window
      const files = {}
      let counter = 0
      const stdMode = true
      const boxModel = true
      const styleSheetLoader = StyleSheetLoader(doc, { contentCssCors: settings.contentCssCors })
      const boundEvents = []
      const schema = settings.schema ? settings.schema : Schema({})
      const styles = Styles({
        url_converter: settings.url_converter,
        url_converter_scope: settings.url_converter_scope,
      }, settings.schema)
      const events = settings.ownEvents ? new EventUtils(settings.proxy) : EventUtils.Event
      const blockElementsMap = schema.getBlockElements()
      const $ = DomQuery.overrideDefaults(() => ({
        context: doc,
        element: self$$1.getRoot(),
      }))
      const isBlock = function (node) {
        if (typeof node === 'string') {
          return !!blockElementsMap[node]
        } if (node) {
          const type = node.nodeType
          if (type) {
            return !!(type === 1 && blockElementsMap[node.nodeName])
          }
        }
        return false
      }
      const get = function (elm) {
        if (elm && doc && typeof elm === 'string') {
          const node = doc.getElementById(elm)
          if (node && node.id !== elm) {
            return doc.getElementsByName(elm)[1]
          }
          return node
        }
        return elm
      }
      const $$ = function (elm) {
        if (typeof elm === 'string') {
          elm = get(elm)
        }
        return $(elm)
      }
      const getAttrib = function (elm, name$$1, defaultVal) {
        let hook, value
        const $elm = $$(elm)
        if ($elm.length) {
          hook = attrHooks[name$$1]
          if (hook && hook.get) {
            value = hook.get($elm, name$$1)
          } else {
            value = $elm.attr(name$$1)
          }
        }
        if (typeof value === 'undefined') {
          value = defaultVal || ''
        }
        return value
      }
      const getAttribs = function (elm) {
        const node = get(elm)
        if (!node) {
          return []
        }
        return node.attributes
      }
      const setAttrib = function (elm, name$$1, value) {
        let originalValue, hook
        if (value === '') {
          value = null
        }
        const $elm = $$(elm)
        originalValue = $elm.attr(name$$1)
        if (!$elm.length) {
          return
        }
        hook = attrHooks[name$$1]
        if (hook && hook.set) {
          hook.set($elm, value, name$$1)
        } else {
          $elm.attr(name$$1, value)
        }
        if (originalValue !== value && settings.onSetAttrib) {
          settings.onSetAttrib({
            attrElm: $elm,
            attrName: name$$1,
            attrValue: value,
          })
        }
      }
      const clone = function (node, deep) {
        if (!isIE || node.nodeType !== 1 || deep) {
          return node.cloneNode(deep)
        }
        if (!deep) {
          const clone_1 = doc.createElement(node.nodeName)
          each$5(getAttribs(node), (attr) => {
            setAttrib(clone_1, attr.nodeName, getAttrib(node, attr.nodeName))
          })
          return clone_1
        }
        return null
      }
      const getRoot = function () {
        return settings.root_element || doc.body
      }
      const getViewPort = function (argWin) {
        const actWin = !argWin ? win : argWin
        const doc = actWin.document
        const rootElm = boxModel ? doc.documentElement : doc.body
        return {
          x: actWin.pageXOffset || rootElm.scrollLeft,
          y: actWin.pageYOffset || rootElm.scrollTop,
          w: actWin.innerWidth || rootElm.clientWidth,
          h: actWin.innerHeight || rootElm.clientHeight,
        }
      }
      const getPos = function (elm, rootElm) {
        return Position.getPos(doc.body, get(elm), rootElm)
      }
      const setStyle = function (elm, name$$1, value) {
        const $elm = $$(elm).css(name$$1, value)
        if (settings.update_styles) {
          updateInternalStyleAttr(styles, $elm)
        }
      }
      const setStyles = function (elm, stylesArg) {
        const $elm = $$(elm).css(stylesArg)
        if (settings.update_styles) {
          updateInternalStyleAttr(styles, $elm)
        }
      }
      const getStyle = function (elm, name$$1, computed) {
        const $elm = $$(elm)
        if (computed) {
          return $elm.css(name$$1)
        }
        name$$1 = name$$1.replace(/-(\D)/g, (a, b) => b.toUpperCase())
        if (name$$1 === 'float') {
          name$$1 = Env.ie && Env.ie < 12 ? 'styleFloat' : 'cssFloat'
        }
        return $elm[0] && $elm[0].style ? $elm[0].style[name$$1] : undefined
      }
      const getSize = function (elm) {
        let w, h
        elm = get(elm)
        w = getStyle(elm, 'width')
        h = getStyle(elm, 'height')
        if (w.indexOf('px') === -1) {
          w = 0
        }
        if (h.indexOf('px') === -1) {
          h = 0
        }
        return {
          w: parseInt(w, 10) || elm.offsetWidth || elm.clientWidth,
          h: parseInt(h, 10) || elm.offsetHeight || elm.clientHeight,
        }
      }
      const getRect = function (elm) {
        let pos, size
        elm = get(elm)
        pos = getPos(elm)
        size = getSize(elm)
        return {
          x: pos.x,
          y: pos.y,
          w: size.w,
          h: size.h,
        }
      }
      const is = function (elm, selector) {
        let i
        if (!elm) {
          return false
        }
        if (!Array.isArray(elm)) {
          if (selector === '*') {
            return elm.nodeType === 1
          }
          if (simpleSelectorRe.test(selector)) {
            const selectors = selector.toLowerCase().split(/,/)
            const elmName = elm.nodeName.toLowerCase()
            for (i = selectors.length - 1; i >= 0; i--) {
              if (selectors[i] === elmName) {
                return true
              }
            }
            return false
          }
          if (elm.nodeType && elm.nodeType !== 1) {
            return false
          }
        }
        const elms = !Array.isArray(elm) ? [elm] : elm
        return Sizzle(selector, elms[0].ownerDocument || elms[0], null, elms).length > 0
      }
      const getParents = function (elm, selector, root, collect) {
        const result = []
        let selectorVal
        let node = get(elm)
        collect = collect === undefined
        root = root || (getRoot().nodeName !== 'BODY' ? getRoot().parentNode : null)
        if (Tools.is(selector, 'string')) {
          selectorVal = selector
          if (selector === '*') {
            selector = function (node) {
              return node.nodeType === 1
            }
          } else {
            selector = function (node) {
              return is(node, selectorVal)
            }
          }
        }
        while (node) {
          if (node === root || !node.nodeType || node.nodeType === 9) {
            break
          }
          if (!selector || typeof selector === 'function' && selector(node)) {
            if (collect) {
              result.push(node)
            } else {
              return [node]
            }
          }
          node = node.parentNode
        }
        return collect ? result : null
      }
      const getParent = function (node, selector, root) {
        const parents = getParents(node, selector, root, false)
        return parents && parents.length > 0 ? parents[0] : null
      }
      const _findSib = function (node, selector, name$$1) {
        let func = selector
        if (node) {
          if (typeof selector === 'string') {
            func = function (node) {
              return is(node, selector)
            }
          }
          for (node = node[name$$1]; node; node = node[name$$1]) {
            if (typeof func === 'function' && func(node)) {
              return node
            }
          }
        }
        return null
      }
      const getNext = function (node, selector) {
        return _findSib(node, selector, 'nextSibling')
      }
      const getPrev = function (node, selector) {
        return _findSib(node, selector, 'previousSibling')
      }
      const select = function (selector, scope) {
        return Sizzle(selector, get(scope) || settings.root_element || doc, [])
      }
      const run = function (elm, func, scope) {
        let result
        const node = typeof elm === 'string' ? get(elm) : elm
        if (!node) {
          return false
        }
        if (Tools.isArray(node) && (node.length || node.length === 0)) {
          result = []
          each$5(node, (elm, i) => {
            if (elm) {
              if (typeof elm === 'string') {
                elm = get(elm)
              }
              result.push(func.call(scope, elm, i))
            }
          })
          return result
        }
        const context = scope || _this
        return func.call(context, node)
      }
      const setAttribs = function (elm, attrs) {
        $$(elm).each((i, node) => {
          each$5(attrs, (value, name$$1) => {
            setAttrib(node, name$$1, value)
          })
        })
      }
      const setHTML = function (elm, html) {
        const $elm = $$(elm)
        if (isIE) {
          $elm.each((i, target) => {
            if (target.canHaveHTML === false) {
              return
            }
            while (target.firstChild) {
              target.removeChild(target.firstChild)
            }
            try {
              target.innerHTML = `<br>${html}`
              target.removeChild(target.firstChild)
            } catch (ex) {
              DomQuery('<div></div>').html(`<br>${html}`).contents().slice(1).appendTo(target)
            }
            return html
          })
        } else {
          $elm.html(html)
        }
      }
      const add = function (parentElm, name$$1, attrs, html, create) {
        return run(parentElm, (parentElm) => {
          const newElm = typeof name$$1 === 'string' ? doc.createElement(name$$1) : name$$1
          setAttribs(newElm, attrs)
          if (html) {
            if (typeof html !== 'string' && html.nodeType) {
              newElm.appendChild(html)
            } else if (typeof html === 'string') {
              setHTML(newElm, html)
            }
          }
          return !create ? parentElm.appendChild(newElm) : newElm
        })
      }
      const create = function (name$$1, attrs, html) {
        return add(doc.createElement(name$$1), name$$1, attrs, html, true)
      }
      const { decode } = Entities
      const encode = Entities.encodeAllRaw
      const createHTML = function (name$$1, attrs, html) {
        let outHtml = ''; let key
        outHtml += `<${name$$1}`
        for (key in attrs) {
          if (attrs.hasOwnProperty(key) && attrs[key] !== null && typeof attrs[key] !== 'undefined') {
            outHtml += ` ${key}="${encode(attrs[key])}"`
          }
        }
        if (typeof html !== 'undefined') {
          return `${outHtml}>${html}</${name$$1}>`
        }
        return `${outHtml} />`
      }
      const createFragment = function (html) {
        let node
        const container = doc.createElement('div')
        const frag = doc.createDocumentFragment()
        if (html) {
          container.innerHTML = html
        }
        while (node = container.firstChild) {
          frag.appendChild(node)
        }
        return frag
      }
      const remove = function (node, keepChildren) {
        const $node = $$(node)
        if (keepChildren) {
          $node.each(function () {
            let child
            while (child = this.firstChild) {
              if (child.nodeType === 3 && child.data.length === 0) {
                this.removeChild(child)
              } else {
                this.parentNode.insertBefore(child, this)
              }
            }
          }).remove()
        } else {
          $node.remove()
        }
        return $node.length > 1 ? $node.toArray() : $node[0]
      }
      const removeAllAttribs = function (e) {
        return run(e, (e) => {
          let i
          const attrs = e.attributes
          for (i = attrs.length - 1; i >= 0; i--) {
            e.removeAttributeNode(attrs.item(i))
          }
        })
      }
      const parseStyle = function (cssText) {
        return styles.parse(cssText)
      }
      const serializeStyle = function (stylesArg, name$$1) {
        return styles.serialize(stylesArg, name$$1)
      }
      const addStyle = function (cssText) {
        let head, styleElm
        if (self$$1 !== DOMUtils.DOM && doc === document) {
          if (addedStyles[cssText]) {
            return
          }
          addedStyles[cssText] = true
        }
        styleElm = doc.getElementById('mceDefaultStyles')
        if (!styleElm) {
          styleElm = doc.createElement('style')
          styleElm.id = 'mceDefaultStyles'
          styleElm.type = 'text/css'
          head = doc.getElementsByTagName('head')[0]
          if (head.firstChild) {
            head.insertBefore(styleElm, head.firstChild)
          } else {
            head.appendChild(styleElm)
          }
        }
        if (styleElm.styleSheet) {
          styleElm.styleSheet.cssText += cssText
        } else {
          styleElm.appendChild(doc.createTextNode(cssText))
        }
      }
      const loadCSS = function (url) {
        let head
        if (self$$1 !== DOMUtils.DOM && doc === document) {
          DOMUtils.DOM.loadCSS(url)
          return
        }
        if (!url) {
          url = ''
        }
        head = doc.getElementsByTagName('head')[0]
        each$5(url.split(','), (url) => {
          let link
          url = Tools._addCacheSuffix(url)
          if (files[url]) {
            return
          }
          files[url] = true
          link = create('link', {
            rel: 'stylesheet',
            href: url,
          })
          head.appendChild(link)
        })
      }
      const toggleClass = function (elm, cls, state) {
        $$(elm).toggleClass(cls, state).each(function () {
          if (this.className === '') {
            DomQuery(this).attr('class', null)
          }
        })
      }
      const addClass = function (elm, cls) {
        $$(elm).addClass(cls)
      }
      const removeClass = function (elm, cls) {
        toggleClass(elm, cls, false)
      }
      const hasClass = function (elm, cls) {
        return $$(elm).hasClass(cls)
      }
      const show = function (elm) {
        $$(elm).show()
      }
      const hide = function (elm) {
        $$(elm).hide()
      }
      const isHidden = function (elm) {
        return $$(elm).css('display') === 'none'
      }
      const uniqueId = function (prefix) {
        return (!prefix ? 'mce_' : prefix) + counter++
      }
      const getOuterHTML = function (elm) {
        const node = typeof elm === 'string' ? get(elm) : elm
        return NodeType.isElement(node) ? node.outerHTML : DomQuery('<div></div>').append(DomQuery(node).clone()).html()
      }
      const setOuterHTML = function (elm, html) {
        $$(elm).each(function () {
          try {
            if ('outerHTML' in this) {
              this.outerHTML = html
              return
            }
          } catch (ex) {
          }
          remove(DomQuery(this).html(html), true)
        })
      }
      const insertAfter = function (node, reference) {
        const referenceNode = get(reference)
        return run(node, (node) => {
          let parent$$1, nextSibling
          parent$$1 = referenceNode.parentNode
          nextSibling = referenceNode.nextSibling
          if (nextSibling) {
            parent$$1.insertBefore(node, nextSibling)
          } else {
            parent$$1.appendChild(node)
          }
          return node
        })
      }
      const replace = function (newElm, oldElm, keepChildren) {
        return run(oldElm, (oldElm) => {
          if (Tools.is(oldElm, 'array')) {
            newElm = newElm.cloneNode(true)
          }
          if (keepChildren) {
            each$5(grep$1(oldElm.childNodes), (node) => {
              newElm.appendChild(node)
            })
          }
          return oldElm.parentNode.replaceChild(newElm, oldElm)
        })
      }
      const rename = function (elm, name$$1) {
        let newElm
        if (elm.nodeName !== name$$1.toUpperCase()) {
          newElm = create(name$$1)
          each$5(getAttribs(elm), (attrNode) => {
            setAttrib(newElm, attrNode.nodeName, getAttrib(elm, attrNode.nodeName))
          })
          replace(newElm, elm, true)
        }
        return newElm || elm
      }
      const findCommonAncestor = function (a, b) {
        let ps = a; let pe
        while (ps) {
          pe = b
          while (pe && ps !== pe) {
            pe = pe.parentNode
          }
          if (ps === pe) {
            break
          }
          ps = ps.parentNode
        }
        if (!ps && a.ownerDocument) {
          return a.ownerDocument.documentElement
        }
        return ps
      }
      const toHex = function (rgbVal) {
        return styles.toHex(Tools.trim(rgbVal))
      }
      const isEmpty = function (node, elements) {
        let i; let attributes; let type; let whitespace; let walker; let name$$1; let brCount = 0
        node = node.firstChild
        if (node) {
          walker = new TreeWalker(node, node.parentNode)
          elements = elements || (schema ? schema.getNonEmptyElements() : null)
          whitespace = schema ? schema.getWhiteSpaceElements() : {}
          do {
            type = node.nodeType
            if (NodeType.isElement(node)) {
              const bogusVal = node.getAttribute('data-mce-bogus')
              if (bogusVal) {
                node = walker.next(bogusVal === 'all')
                continue
              }
              name$$1 = node.nodeName.toLowerCase()
              if (elements && elements[name$$1]) {
                if (name$$1 === 'br') {
                  brCount++
                  node = walker.next()
                  continue
                }
                return false
              }
              attributes = getAttribs(node)
              i = attributes.length
              while (i--) {
                name$$1 = attributes[i].nodeName
                if (name$$1 === 'name' || name$$1 === 'data-mce-bookmark') {
                  return false
                }
              }
            }
            if (type === 8) {
              return false
            }
            if (type === 3 && !whiteSpaceRegExp$2.test(node.nodeValue)) {
              return false
            }
            if (type === 3 && node.parentNode && whitespace[node.parentNode.nodeName] && whiteSpaceRegExp$2.test(node.nodeValue)) {
              return false
            }
            node = walker.next()
          } while (node)
        }
        return brCount <= 1
      }
      const createRng = function () {
        return doc.createRange()
      }
      const split = function (parentElm, splitElm, replacementElm) {
        let r = createRng(); let bef; let aft; let pa
        if (parentElm && splitElm) {
          r.setStart(parentElm.parentNode, findNodeIndex(parentElm))
          r.setEnd(splitElm.parentNode, findNodeIndex(splitElm))
          bef = r.extractContents()
          r = createRng()
          r.setStart(splitElm.parentNode, findNodeIndex(splitElm) + 1)
          r.setEnd(parentElm.parentNode, findNodeIndex(parentElm) + 1)
          aft = r.extractContents()
          pa = parentElm.parentNode
          pa.insertBefore(TrimNode.trimNode(self$$1, bef), parentElm)
          if (replacementElm) {
            pa.insertBefore(replacementElm, parentElm)
          } else {
            pa.insertBefore(splitElm, parentElm)
          }
          pa.insertBefore(TrimNode.trimNode(self$$1, aft), parentElm)
          remove(parentElm)
          return replacementElm || splitElm
        }
      }
      var bind = function (target, name$$1, func, scope) {
        if (Tools.isArray(target)) {
          let i = target.length
          while (i--) {
            target[i] = bind(target[i], name$$1, func, scope)
          }
          return target
        }
        if (settings.collect && (target === doc || target === win)) {
          boundEvents.push([
            target,
            name$$1,
            func,
            scope,
          ])
        }
        return events.bind(target, name$$1, func, scope || self$$1)
      }
      var unbind = function (target, name$$1, func) {
        let i
        if (Tools.isArray(target)) {
          i = target.length
          while (i--) {
            target[i] = unbind(target[i], name$$1, func)
          }
          return target
        }
        if (boundEvents && (target === doc || target === win)) {
          i = boundEvents.length
          while (i--) {
            const item = boundEvents[i]
            if (target === item[0] && (!name$$1 || name$$1 === item[1]) && (!func || func === item[2])) {
              events.unbind(item[0], item[1], item[2])
            }
          }
        }
        return events.unbind(target, name$$1, func)
      }
      const fire = function (target, name$$1, evt) {
        return events.fire(target, name$$1, evt)
      }
      const getContentEditable = function (node) {
        if (node && NodeType.isElement(node)) {
          const contentEditable = node.getAttribute('data-mce-contenteditable')
          if (contentEditable && contentEditable !== 'inherit') {
            return contentEditable
          }
          return node.contentEditable !== 'inherit' ? node.contentEditable : null
        }
        return null
      }
      const getContentEditableParent = function (node) {
        const root = getRoot()
        let state = null
        for (; node && node !== root; node = node.parentNode) {
          state = getContentEditable(node)
          if (state !== null) {
            break
          }
        }
        return state
      }
      const destroy = function () {
        if (boundEvents) {
          let i = boundEvents.length
          while (i--) {
            const item = boundEvents[i]
            events.unbind(item[0], item[1], item[2])
          }
        }
        if (Sizzle.setDocument) {
          Sizzle.setDocument()
        }
      }
      const isChildOf = function (node, parent$$1) {
        while (node) {
          if (parent$$1 === node) {
            return true
          }
          node = node.parentNode
        }
        return false
      }
      const dumpRng = function (r) {
        return `startContainer: ${r.startContainer.nodeName}, startOffset: ${r.startOffset}, endContainer: ${r.endContainer.nodeName}, endOffset: ${r.endOffset}`
      }
      var self$$1 = {
        doc,
        settings,
        win,
        files,
        stdMode,
        boxModel,
        styleSheetLoader,
        boundEvents,
        styles,
        schema,
        events,
        isBlock,
        $,
        $$,
        root: null,
        clone,
        getRoot,
        getViewPort,
        getRect,
        getSize,
        getParent,
        getParents,
        get,
        getNext,
        getPrev,
        select,
        is,
        add,
        create,
        createHTML,
        createFragment,
        remove,
        setStyle,
        getStyle,
        setStyles,
        removeAllAttribs,
        setAttrib,
        setAttribs,
        getAttrib,
        getPos,
        parseStyle,
        serializeStyle,
        addStyle,
        loadCSS,
        addClass,
        removeClass,
        hasClass,
        toggleClass,
        show,
        hide,
        isHidden,
        uniqueId,
        setHTML,
        getOuterHTML,
        setOuterHTML,
        decode,
        encode,
        insertAfter,
        replace,
        rename,
        findCommonAncestor,
        toHex,
        run,
        getAttribs,
        isEmpty,
        createRng,
        nodeIndex: findNodeIndex,
        split,
        bind,
        unbind,
        fire,
        getContentEditable,
        getContentEditableParent,
        destroy,
        isChildOf,
        dumpRng,
      }
      attrHooks = setupAttrHooks(styles, settings, () => self$$1)
      return self$$1
    }
    (function (DOMUtils) {
      DOMUtils.DOM = DOMUtils(document)
      DOMUtils.nodeIndex = findNodeIndex
    }(DOMUtils || (DOMUtils = {})))
    const DOMUtils$1 = DOMUtils

    const { DOM } = DOMUtils$1
    const each$6 = Tools.each; const grep$2 = Tools.grep
    const isFunction$1 = function (f) {
      return typeof f === 'function'
    }
    const ScriptLoader = function () {
      const QUEUED = 0
      const LOADING = 1
      const LOADED = 2
      const FAILED = 3
      const states = {}
      const queue = []
      const scriptLoadedCallbacks = {}
      const queueLoadedCallbacks = []
      let loading = 0
      const loadScript = function (url, success, failure) {
        const dom = DOM
        let elm, id
        const done = function () {
          dom.remove(id)
          if (elm) {
            elm.onreadystatechange = elm.onload = elm = null
          }
          success()
        }
        const error = function () {
          if (isFunction$1(failure)) {
            failure()
          } else if (typeof console !== 'undefined' && console.log) {
            console.log(`Failed to load script: ${url}`)
          }
        }
        id = dom.uniqueId()
        elm = document.createElement('script')
        elm.id = id
        elm.type = 'text/javascript'
        elm.src = Tools._addCacheSuffix(url)
        elm.onload = done
        elm.onerror = error;
        (document.getElementsByTagName('head')[0] || document.body).appendChild(elm)
      }
      this.loadScript = function (url, success, failure) {
        loadScript(url, success, failure)
      }, this.isDone = function (url) {
        return states[url] === LOADED
      }
      this.markDone = function (url) {
        states[url] = LOADED
      }
      this.add = this.load = function (url, success, scope, failure) {
        const state = states[url]
        if (state === undefined) {
          queue.push(url)
          states[url] = QUEUED
        }
        if (success) {
          if (!scriptLoadedCallbacks[url]) {
            scriptLoadedCallbacks[url] = []
          }
          scriptLoadedCallbacks[url].push({
            success,
            failure,
            scope: scope || this,
          })
        }
      }
      this.remove = function (url) {
        delete states[url]
        delete scriptLoadedCallbacks[url]
      }
      this.loadQueue = function (success, scope, failure) {
        this.loadScripts(queue, success, scope, failure)
      }
      this.loadScripts = function (scripts, success, scope, failure) {
        let loadScripts
        const failures = []
        const execCallbacks = function (name$$1, url) {
          each$6(scriptLoadedCallbacks[url], (callback) => {
            if (isFunction$1(callback[name$$1])) {
              callback[name$$1].call(callback.scope)
            }
          })
          scriptLoadedCallbacks[url] = undefined
        }
        queueLoadedCallbacks.push({
          success,
          failure,
          scope: scope || this,
        })
        loadScripts = function () {
          const loadingScripts = grep$2(scripts)
          scripts.length = 0
          each$6(loadingScripts, (url) => {
            if (states[url] === LOADED) {
              execCallbacks('success', url)
              return
            }
            if (states[url] === FAILED) {
              execCallbacks('failure', url)
              return
            }
            if (states[url] !== LOADING) {
              states[url] = LOADING
              loading++
              loadScript(url, () => {
                states[url] = LOADED
                loading--
                execCallbacks('success', url)
                loadScripts()
              }, () => {
                states[url] = FAILED
                loading--
                failures.push(url)
                execCallbacks('failure', url)
                loadScripts()
              })
            }
          })
          if (!loading) {
            const notifyCallbacks = queueLoadedCallbacks.slice(0)
            queueLoadedCallbacks.length = 0
            each$6(notifyCallbacks, (callback) => {
              if (failures.length === 0) {
                if (isFunction$1(callback.success)) {
                  callback.success.call(callback.scope)
                }
              } else if (isFunction$1(callback.failure)) {
                callback.failure.call(callback.scope, failures)
              }
            })
          }
        }
        loadScripts()
      }
    }
    ScriptLoader.ScriptLoader = new ScriptLoader()

    var Cell = function (initial) {
      let value = initial
      const get = function () {
        return value
      }
      const set = function (v) {
        value = v
      }
      const clone = function () {
        return Cell(get())
      }
      return {
        get,
        set,
        clone,
      }
    }

    const isRaw = function (str) {
      return isObject(str) && has(str, 'raw')
    }
    const isTokenised = function (str) {
      return isArray(str) && str.length > 1
    }
    const data = {}
    const currentCode = Cell('en')
    const setCode = function (newCode) {
      if (newCode) {
        currentCode.set(newCode)
      }
    }
    const getCode = function () {
      return currentCode.get()
    }
    const add = function (code, items) {
      let langData = data[code]
      if (!langData) {
        data[code] = langData = {}
      }
      for (const name in items) {
        langData[name.toLowerCase()] = items[name]
      }
    }
    const translate = function (text) {
      const langData = data[currentCode.get()] || {}
      const toString = function (obj) {
        if (isFunction(obj)) {
          return Object.prototype.toString.call(obj)
        }
        return !isEmpty(obj) ? `${obj}` : ''
      }
      var isEmpty = function (text) {
        return text === '' || text === null || text === undefined
      }
      const getLangData = function (text) {
        const textstr = toString(text)
        const lowercaseTextstr = textstr.toLowerCase()
        return has(langData, lowercaseTextstr) ? toString(langData[lowercaseTextstr]) : textstr
      }
      const removeContext = function (str) {
        return str.replace(/{context:\w+}$/, '')
      }
      const translated = function (text) {
        return text
      }
      if (isEmpty(text)) {
        return translated('')
      }
      if (isRaw(text)) {
        return translated(toString(text.raw))
      }
      if (isTokenised(text)) {
        const values_1 = text.slice(1)
        const substitued = getLangData(text[0]).replace(/\{([0-9]+)\}/g, ($1, $2) => has(values_1, $2) ? toString(values_1[$2]) : $1)
        return translated(removeContext(substitued))
      }
      return translated(removeContext(getLangData(text)))
    }
    const isRtl = function () {
      return get(data, currentCode.get()).bind((items) => get(items, '_dir')).exists((dir) => dir === 'rtl')
    }
    const hasCode = function (code) {
      return has(data, code)
    }
    const I18n = {
      setCode,
      getCode,
      add,
      translate,
      isRtl,
      hasCode,
    }

    const each$7 = Tools.each
    function AddOnManager() {
      const _this = this
      const items = []
      const urls = {}
      const lookup = {}
      let _listeners = []
      const get = function (name) {
        if (lookup[name]) {
          return lookup[name].instance
        }
        return undefined
      }
      const dependencies = function (name) {
        let result
        if (lookup[name]) {
          result = lookup[name].dependencies
        }
        return result || []
      }
      const requireLangPack = function (name, languages) {
        let language = I18n.getCode()
        if (language && AddOnManager.languageLoad !== false) {
          if (languages) {
            languages = `,${languages},`
            if (languages.indexOf(`,${language.substr(0, 2)},`) !== -1) {
              language = language.substr(0, 2)
            } else if (languages.indexOf(`,${language},`) === -1) {
              return
            }
          }
          ScriptLoader.ScriptLoader.add(`${urls[name]}/langs/${language}.js`)
        }
      }
      const add = function (id, addOn, dependencies) {
        items.push(addOn)
        lookup[id] = {
          instance: addOn,
          dependencies,
        }
        const result = partition(_listeners, (listener) => listener.name === id)
        _listeners = result.fail
        each$7(result.pass, (listener) => {
          listener.callback()
        })
        return addOn
      }
      const remove = function (name) {
        delete urls[name]
        delete lookup[name]
      }
      const createUrl = function (baseUrl, dep) {
        if (typeof dep === 'object') {
          return dep
        }
        return typeof baseUrl === 'string' ? {
          prefix: '',
          resource: dep,
          suffix: '',
        } : {
          prefix: baseUrl.prefix,
          resource: dep,
          suffix: baseUrl.suffix,
        }
      }
      const addComponents = function (pluginName, scripts) {
        const pluginUrl = _this.urls[pluginName]
        each$7(scripts, (script) => {
          ScriptLoader.ScriptLoader.add(`${pluginUrl}/${script}`)
        })
      }
      const loadDependencies = function (name, addOnUrl, success, scope) {
        const deps = dependencies(name)
        each$7(deps, (dep) => {
          const newUrl = createUrl(addOnUrl, dep)
          load(newUrl.resource, newUrl, undefined, undefined)
        })
        if (success) {
          if (scope) {
            success.call(scope)
          } else {
            success.call(ScriptLoader)
          }
        }
      }
      var load = function (name, addOnUrl, success, scope, failure) {
        if (urls[name]) {
          return
        }
        let urlString = typeof addOnUrl === 'string' ? addOnUrl : addOnUrl.prefix + addOnUrl.resource + addOnUrl.suffix
        if (urlString.indexOf('/') !== 0 && urlString.indexOf('://') === -1) {
          urlString = `${AddOnManager.baseURL}/${urlString}`
        }
        urls[name] = urlString.substring(0, urlString.lastIndexOf('/'))
        if (lookup[name]) {
          loadDependencies(name, addOnUrl, success, scope)
        } else {
          ScriptLoader.ScriptLoader.add(urlString, () => loadDependencies(name, addOnUrl, success, scope), scope, failure)
        }
      }
      const waitFor = function (name, callback) {
        if (lookup.hasOwnProperty(name)) {
          callback()
        } else {
          _listeners.push({
            name,
            callback,
          })
        }
      }
      return {
        items,
        urls,
        lookup,
        _listeners,
        get,
        dependencies,
        requireLangPack,
        add,
        remove,
        createUrl,
        addComponents,
        load,
        waitFor,
      }
    }
    (function (AddOnManager) {
      AddOnManager.PluginManager = AddOnManager()
      AddOnManager.ThemeManager = AddOnManager()
    }(AddOnManager || (AddOnManager = {})))

    const before = function (marker, element) {
      const parent$$1 = parent(marker)
      parent$$1.each((v) => {
        v.dom().insertBefore(element.dom(), marker.dom())
      })
    }
    const after = function (marker, element) {
      const sibling = nextSibling(marker)
      sibling.fold(() => {
        const parent$$1 = parent(marker)
        parent$$1.each((v) => {
          append(v, element)
        })
      }, (v) => {
        before(v, element)
      })
    }
    const prepend = function (parent$$1, element) {
      const firstChild$$1 = firstChild(parent$$1)
      firstChild$$1.fold(() => {
        append(parent$$1, element)
      }, (v) => {
        parent$$1.dom().insertBefore(element.dom(), v.dom())
      })
    }
    var append = function (parent$$1, element) {
      parent$$1.dom().appendChild(element.dom())
    }
    const wrap$1 = function (element, wrapper) {
      before(element, wrapper)
      append(wrapper, element)
    }

    const before$1 = function (marker, elements) {
      each(elements, (x) => {
        before(marker, x)
      })
    }
    const append$1 = function (parent, elements) {
      each(elements, (x) => {
        append(parent, x)
      })
    }

    const empty = function (element) {
      element.dom().textContent = ''
      each(children(element), (rogue) => {
        remove$2(rogue)
      })
    }
    var remove$2 = function (element) {
      const dom = element.dom()
      if (dom.parentNode !== null) {
        dom.parentNode.removeChild(dom)
      }
    }
    const unwrap = function (wrapper) {
      const children$$1 = children(wrapper)
      if (children$$1.length > 0) {
        before$1(wrapper, children$$1)
      }
      remove$2(wrapper)
    }

    const first$1 = function (fn, rate) {
      let timer = null
      const cancel = function () {
        if (timer !== null) {
          clearTimeout(timer)
          timer = null
        }
      }
      const throttle = function () {
        const args = []
        for (let _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i]
        }
        if (timer === null) {
          timer = setTimeout(() => {
            fn.apply(null, args)
            timer = null
          }, rate)
        }
      }
      return {
        cancel,
        throttle,
      }
    }
    const last$3 = function (fn, rate) {
      let timer = null
      const cancel = function () {
        if (timer !== null) {
          clearTimeout(timer)
          timer = null
        }
      }
      const throttle = function () {
        const args = []
        for (let _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i]
        }
        if (timer !== null) { clearTimeout(timer) }
        timer = setTimeout(() => {
          fn.apply(null, args)
          timer = null
        }, rate)
      }
      return {
        cancel,
        throttle,
      }
    }

    const read = function (element, attr) {
      const value = get$1(element, attr)
      return value === undefined || value === '' ? [] : value.split(' ')
    }
    const add$1 = function (element, attr, id) {
      const old = read(element, attr)
      const nu = old.concat([id])
      set(element, attr, nu.join(' '))
      return true
    }
    const remove$3 = function (element, attr, id) {
      const nu = filter(read(element, attr), (v) => v !== id)
      if (nu.length > 0) {
        set(element, attr, nu.join(' '))
      } else {
        remove(element, attr)
      }
      return false
    }

    const supports = function (element) {
      return element.dom().classList !== undefined
    }
    const get$3 = function (element) {
      return read(element, 'class')
    }
    const add$2 = function (element, clazz) {
      return add$1(element, 'class', clazz)
    }
    const remove$4 = function (element, clazz) {
      return remove$3(element, 'class', clazz)
    }

    const add$3 = function (element, clazz) {
      if (supports(element)) {
        element.dom().classList.add(clazz)
      } else {
        add$2(element, clazz)
      }
    }
    const cleanClass = function (element) {
      const classList = supports(element) ? element.dom().classList : get$3(element)
      if (classList.length === 0) {
        remove(element, 'class')
      }
    }
    const remove$5 = function (element, clazz) {
      if (supports(element)) {
        const { classList } = element.dom()
        classList.remove(clazz)
      } else {
        remove$4(element, clazz)
      }
      cleanClass(element)
    }
    const has$2 = function (element, clazz) {
      return supports(element) && element.dom().classList.contains(clazz)
    }

    var descendants = function (scope, predicate) {
      let result = []
      each(children(scope), (x) => {
        if (predicate(x)) {
          result = result.concat([x])
        }
        result = result.concat(descendants(x, predicate))
      })
      return result
    }

    const descendants$1 = function (scope, selector) {
      return all(selector, scope)
    }

    function ClosestOrAncestor(is, ancestor, scope, a, isRoot) {
      return is(scope, a) ? Option.some(scope) : isFunction(isRoot) && isRoot(scope) ? Option.none() : ancestor(scope, a, isRoot)
    }

    const ancestor = function (scope, predicate, isRoot) {
      let element = scope.dom()
      const stop = isFunction(isRoot) ? isRoot : constant(false)
      while (element.parentNode) {
        element = element.parentNode
        const el = Element$$1.fromDom(element)
        if (predicate(el)) {
          return Option.some(el)
        } if (stop(el)) {
          break
        }
      }
      return Option.none()
    }
    const closest = function (scope, predicate, isRoot) {
      const is = function (s) {
        return predicate(s)
      }
      return ClosestOrAncestor(is, ancestor, scope, predicate, isRoot)
    }

    const ancestor$1 = function (scope, selector, isRoot) {
      return ancestor(scope, (e) => is$1(e, selector), isRoot)
    }
    const descendant$1 = function (scope, selector) {
      return one(selector, scope)
    }
    const closest$1 = function (scope, selector, isRoot) {
      return ClosestOrAncestor(is$1, ancestor$1, scope, selector, isRoot)
    }

    const annotation = constant('mce-annotation')
    const dataAnnotation = constant('data-mce-annotation')
    const dataAnnotationId = constant('data-mce-annotation-uid')

    const identify = function (editor, annotationName) {
      const rng = editor.selection.getRng()
      const start = Element$$1.fromDom(rng.startContainer)
      const root = Element$$1.fromDom(editor.getBody())
      const selector = annotationName.fold(() => `.${annotation()}`, (an) => `[${dataAnnotation()}="${an}"]`)
      const newStart = child(start, rng.startOffset).getOr(start)
      const closest = closest$1(newStart, selector, (n) => eq(n, root))
      const getAttr = function (c, property) {
        if (has$1(c, property)) {
          return Option.some(get$1(c, property))
        }
        return Option.none()
      }
      return closest.bind((c) => getAttr(c, `${dataAnnotationId()}`).bind((uid) => getAttr(c, `${dataAnnotation()}`).map((name$$1) => {
        const elements = findMarkers(editor, uid)
        return {
          uid,
          name: name$$1,
          elements,
        }
      })))
    }
    const isAnnotation = function (elem) {
      return isElement(elem) && has$2(elem, annotation())
    }
    var findMarkers = function (editor, uid) {
      const body = Element$$1.fromDom(editor.getBody())
      return descendants$1(body, `[${dataAnnotationId()}="${uid}"]`)
    }
    const findAll = function (editor, name$$1) {
      const body = Element$$1.fromDom(editor.getBody())
      const markers = descendants$1(body, `[${dataAnnotation()}="${name$$1}"]`)
      const directory = {}
      each(markers, (m) => {
        const uid = get$1(m, dataAnnotationId())
        const nodesAlready = directory.hasOwnProperty(uid) ? directory[uid] : []
        directory[uid] = nodesAlready.concat([m])
      })
      return directory
    }

    const setup = function (editor, registry) {
      const changeCallbacks = Cell({})
      const initData = function () {
        return {
          listeners: [],
          previous: Cell(Option.none()),
        }
      }
      const withCallbacks = function (name, f) {
        updateCallbacks(name, (data) => {
          f(data)
          return data
        })
      }
      var updateCallbacks = function (name, f) {
        const callbackMap = changeCallbacks.get()
        const data = callbackMap.hasOwnProperty(name) ? callbackMap[name] : initData()
        const outputData = f(data)
        callbackMap[name] = outputData
        changeCallbacks.set(callbackMap)
      }
      const fireCallbacks = function (name, uid, elements) {
        withCallbacks(name, (data) => {
          each(data.listeners, (f) => f(true, name, {
            uid,
            nodes: map(elements, (elem) => elem.dom()),
          }))
        })
      }
      const fireNoAnnotation = function (name) {
        withCallbacks(name, (data) => {
          each(data.listeners, (f) => f(false, name))
        })
      }
      const onNodeChange = last$3(() => {
        const callbackMap = changeCallbacks.get()
        const annotations = sort(keys(callbackMap))
        each(annotations, (name) => {
          updateCallbacks(name, (data) => {
            const prev = data.previous.get()
            identify(editor, Option.some(name)).fold(() => {
              if (prev.isSome()) {
                fireNoAnnotation(name)
                data.previous.set(Option.none())
              }
            }, (_a) => {
              const { uid } = _a; const { name } = _a; const { elements } = _a
              if (!prev.is(uid)) {
                fireCallbacks(name, uid, elements)
                data.previous.set(Option.some(uid))
              }
            })
            return {
              previous: data.previous,
              listeners: data.listeners,
            }
          })
        })
      }, 30)
      editor.on('remove', () => {
        onNodeChange.cancel()
      })
      editor.on('nodeChange', () => {
        onNodeChange.throttle()
      })
      const addListener = function (name, f) {
        updateCallbacks(name, (data) => ({
          previous: data.previous,
          listeners: data.listeners.concat([f]),
        }))
      }
      return { addListener }
    }

    const setup$1 = function (editor, registry) {
      const identifyParserNode = function (span) {
        const optAnnotation = Option.from(span.attributes.map[dataAnnotation()])
        return optAnnotation.bind(registry.lookup)
      }
      editor.on('init', () => {
        editor.serializer.addNodeFilter('span', (spans) => {
          each(spans, (span) => {
            identifyParserNode(span).each((settings) => {
              if (settings.persistent === false) {
                span.unwrap()
              }
            })
          })
        })
      })
    }

    const create$1 = function () {
      const annotations = {}
      const register = function (name, settings) {
        annotations[name] = {
          name,
          settings,
        }
      }
      const lookup = function (name) {
        return annotations.hasOwnProperty(name) ? Option.from(annotations[name]).map((a) => a.settings) : Option.none()
      }
      return {
        register,
        lookup,
      }
    }

    function __rest(s, e) {
      const t = {}
      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) { t[p] = s[p] }
      }
      if (s != null && typeof Object.getOwnPropertySymbols === 'function') {
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0) { t[p[i]] = s[p[i]] }
        }
      }
      return t
    }

    let unique = 0
    const generate = function (prefix) {
      const date = new Date()
      const time = date.getTime()
      const random = Math.floor(Math.random() * 1000000000)
      unique++
      return `${prefix}_${random}${unique}${String(time)}`
    }

    const add$4 = function (element, classes) {
      each(classes, (x) => {
        add$3(element, x)
      })
    }

    const clone$1 = function (original, isDeep) {
      return Element$$1.fromDom(original.dom().cloneNode(isDeep))
    }
    const shallow = function (original) {
      return clone$1(original, false)
    }
    const deep = function (original) {
      return clone$1(original, true)
    }

    const fromHtml$1 = function (html, scope) {
      const doc = scope || document
      const div = doc.createElement('div')
      div.innerHTML = html
      return children(Element$$1.fromDom(div))
    }

    const get$5 = function (element) {
      return element.dom().innerHTML
    }
    const set$2 = function (element, content) {
      const owner$$1 = owner(element)
      const docDom = owner$$1.dom()
      const fragment = Element$$1.fromDom(docDom.createDocumentFragment())
      const contentElements = fromHtml$1(content, docDom)
      append$1(fragment, contentElements)
      empty(element)
      append(element, fragment)
    }

    const ZWSP = '\uFEFF'
    const isZwsp = function (chr) {
      return chr === ZWSP
    }
    const trim$3 = function (text) {
      return text.replace(new RegExp(ZWSP, 'g'), '')
    }
    const Zwsp = {
      isZwsp,
      ZWSP,
      trim: trim$3,
    }

    const isElement$2 = NodeType.isElement
    const isText$2 = NodeType.isText
    const isCaretContainerBlock = function (node) {
      if (isText$2(node)) {
        node = node.parentNode
      }
      return isElement$2(node) && node.hasAttribute('data-mce-caret')
    }
    const isCaretContainerInline = function (node) {
      return isText$2(node) && Zwsp.isZwsp(node.data)
    }
    const isCaretContainer = function (node) {
      return isCaretContainerBlock(node) || isCaretContainerInline(node)
    }
    const hasContent = function (node) {
      return node.firstChild !== node.lastChild || !NodeType.isBr(node.firstChild)
    }
    const insertInline = function (node, before) {
      let doc, sibling, textNode, parentNode
      doc = node.ownerDocument
      textNode = doc.createTextNode(Zwsp.ZWSP)
      parentNode = node.parentNode
      if (!before) {
        sibling = node.nextSibling
        if (isText$2(sibling)) {
          if (isCaretContainer(sibling)) {
            return sibling
          }
          if (startsWithCaretContainer(sibling)) {
            sibling.splitText(1)
            return sibling
          }
        }
        if (node.nextSibling) {
          parentNode.insertBefore(textNode, node.nextSibling)
        } else {
          parentNode.appendChild(textNode)
        }
      } else {
        sibling = node.previousSibling
        if (isText$2(sibling)) {
          if (isCaretContainer(sibling)) {
            return sibling
          }
          if (endsWithCaretContainer(sibling)) {
            return sibling.splitText(sibling.data.length - 1)
          }
        }
        parentNode.insertBefore(textNode, node)
      }
      return textNode
    }
    const isBeforeInline = function (pos) {
      const container = pos.container()
      return pos && NodeType.isText(container) && container.data.charAt(pos.offset()) === Zwsp.ZWSP
    }
    const isAfterInline = function (pos) {
      const container = pos.container()
      return pos && NodeType.isText(container) && container.data.charAt(pos.offset() - 1) === Zwsp.ZWSP
    }
    const createBogusBr = function () {
      const br = document.createElement('br')
      br.setAttribute('data-mce-bogus', '1')
      return br
    }
    const insertBlock = function (blockName, node, before) {
      let doc, blockNode, parentNode
      doc = node.ownerDocument
      blockNode = doc.createElement(blockName)
      blockNode.setAttribute('data-mce-caret', before ? 'before' : 'after')
      blockNode.setAttribute('data-mce-bogus', 'all')
      blockNode.appendChild(createBogusBr())
      parentNode = node.parentNode
      if (!before) {
        if (node.nextSibling) {
          parentNode.insertBefore(blockNode, node.nextSibling)
        } else {
          parentNode.appendChild(blockNode)
        }
      } else {
        parentNode.insertBefore(blockNode, node)
      }
      return blockNode
    }
    var startsWithCaretContainer = function (node) {
      return isText$2(node) && node.data[0] === Zwsp.ZWSP
    }
    var endsWithCaretContainer = function (node) {
      return isText$2(node) && node.data[node.data.length - 1] === Zwsp.ZWSP
    }
    const trimBogusBr = function (elm) {
      const brs = elm.getElementsByTagName('br')
      const lastBr = brs[brs.length - 1]
      if (NodeType.isBogus(lastBr)) {
        lastBr.parentNode.removeChild(lastBr)
      }
    }
    const showCaretContainerBlock = function (caretContainer) {
      if (caretContainer && caretContainer.hasAttribute('data-mce-caret')) {
        trimBogusBr(caretContainer)
        caretContainer.removeAttribute('data-mce-caret')
        caretContainer.removeAttribute('data-mce-bogus')
        caretContainer.removeAttribute('style')
        caretContainer.removeAttribute('_moz_abspos')
        return caretContainer
      }
      return null
    }
    const isRangeInCaretContainerBlock = function (range) {
      return isCaretContainerBlock(range.startContainer)
    }

    const isContentEditableTrue$1 = NodeType.isContentEditableTrue
    const isContentEditableFalse$1 = NodeType.isContentEditableFalse
    const isBr$2 = NodeType.isBr
    const isText$3 = NodeType.isText
    const isInvalidTextElement = NodeType.matchNodeNames('script style textarea')
    const isAtomicInline = NodeType.matchNodeNames('img input textarea hr iframe video audio object')
    const isTable$2 = NodeType.matchNodeNames('table')
    const isCaretContainer$1 = isCaretContainer
    const isCaretCandidate = function (node) {
      if (isCaretContainer$1(node)) {
        return false
      }
      if (isText$3(node)) {
        if (isInvalidTextElement(node.parentNode)) {
          return false
        }
        return true
      }
      return isAtomicInline(node) || isBr$2(node) || isTable$2(node) || isNonUiContentEditableFalse(node)
    }
    const isUnselectable = function (node) {
      return NodeType.isElement(node) && node.getAttribute('unselectable') === 'true'
    }
    var isNonUiContentEditableFalse = function (node) {
      return isUnselectable(node) === false && isContentEditableFalse$1(node)
    }
    const isInEditable = function (node, root) {
      for (node = node.parentNode; node && node !== root; node = node.parentNode) {
        if (isNonUiContentEditableFalse(node)) {
          return false
        }
        if (isContentEditableTrue$1(node)) {
          return true
        }
      }
      return true
    }
    const isAtomicContentEditableFalse = function (node) {
      if (!isNonUiContentEditableFalse(node)) {
        return false
      }
      return foldl(from$1(node.getElementsByTagName('*')), (result, elm) => result || isContentEditableTrue$1(elm), false) !== true
    }
    const isAtomic = function (node) {
      return isAtomicInline(node) || isAtomicContentEditableFalse(node)
    }
    const isEditableCaretCandidate = function (node, root) {
      return isCaretCandidate(node) && isInEditable(node, root)
    }

    const { round } = Math
    const clone$2 = function (rect) {
      if (!rect) {
        return {
          left: 0,
          top: 0,
          bottom: 0,
          right: 0,
          width: 0,
          height: 0,
        }
      }
      return {
        left: round(rect.left),
        top: round(rect.top),
        bottom: round(rect.bottom),
        right: round(rect.right),
        width: round(rect.width),
        height: round(rect.height),
      }
    }
    const collapse = function (rect, toStart) {
      rect = clone$2(rect)
      if (toStart) {
        rect.right = rect.left
      } else {
        rect.left += rect.width
        rect.right = rect.left
      }
      rect.width = 0
      return rect
    }
    const isEqual = function (rect1, rect2) {
      return rect1.left === rect2.left && rect1.top === rect2.top && rect1.bottom === rect2.bottom && rect1.right === rect2.right
    }
    const isValidOverflow = function (overflowY, rect1, rect2) {
      return overflowY >= 0 && overflowY <= Math.min(rect1.height, rect2.height) / 2
    }
    const isAbove = function (rect1, rect2) {
      if (rect1.bottom - rect1.height / 2 < rect2.top) {
        return true
      }
      if (rect1.top > rect2.bottom) {
        return false
      }
      return isValidOverflow(rect2.top - rect1.bottom, rect1, rect2)
    }
    const isBelow = function (rect1, rect2) {
      if (rect1.top > rect2.bottom) {
        return true
      }
      if (rect1.bottom < rect2.top) {
        return false
      }
      return isValidOverflow(rect2.bottom - rect1.top, rect1, rect2)
    }
    const containsXY = function (rect, clientX, clientY) {
      return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
    }
    const overflowX = function (outer, inner) {
      if (inner.left > outer.left && inner.right < outer.right) {
        return 0
      }
      return inner.left < outer.left ? inner.left - outer.left : inner.right - outer.right
    }
    const overflowY = function (outer, inner) {
      if (inner.top > outer.top && inner.bottom < outer.bottom) {
        return 0
      }
      return inner.top < outer.top ? inner.top - outer.top : inner.bottom - outer.bottom
    }
    const getOverflow = function (outer, inner) {
      return {
        x: overflowX(outer, inner),
        y: overflowY(outer, inner),
      }
    }

    const getSelectedNode = function (range) {
      const { startContainer } = range; const { startOffset } = range
      if (startContainer.hasChildNodes() && range.endOffset === startOffset + 1) {
        return startContainer.childNodes[startOffset]
      }
      return null
    }
    const getNode = function (container, offset) {
      if (container.nodeType === 1 && container.hasChildNodes()) {
        if (offset >= container.childNodes.length) {
          offset = container.childNodes.length - 1
        }
        container = container.childNodes[offset]
      }
      return container
    }

    const extendingChars = new RegExp('[\u0300-\u036f\u0483-\u0487\u0488-\u0489\u0591-\u05bd\u05bf\u05c1-\u05c2\u05c4-\u05c5\u05c7\u0610-\u061a' + '\u064b-\u065f\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7-\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0' + '\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u08E3-\u0902\u093a\u093c' + '\u0941-\u0948\u094d\u0951-\u0957\u0962-\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2-\u09e3' + '\u0a01-\u0a02\u0a3c\u0a41-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a51\u0a70-\u0a71\u0a75\u0a81-\u0a82\u0abc' + '\u0ac1-\u0ac5\u0ac7-\u0ac8\u0acd\u0ae2-\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57' + '\u0b62-\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c00\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55-\u0c56' + '\u0c62-\u0c63\u0c81\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc-\u0ccd\u0cd5-\u0cd6\u0ce2-\u0ce3\u0d01\u0d3e\u0d41-\u0d44' + '\u0d4d\u0d57\u0d62-\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9' + '\u0ebb-\u0ebc\u0ec8-\u0ecd\u0f18-\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86-\u0f87\u0f8d-\u0f97' + '\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039-\u103a\u103d-\u103e\u1058-\u1059\u105e-\u1060\u1071-\u1074' + '\u1082\u1085-\u1086\u108d\u109d\u135d-\u135f\u1712-\u1714\u1732-\u1734\u1752-\u1753\u1772-\u1773\u17b4-\u17b5' + '\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927-\u1928\u1932\u1939-\u193b\u1a17-\u1a18' + '\u1a1b\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1ab0-\u1abd\u1ABE\u1b00-\u1b03\u1b34' + '\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80-\u1b81\u1ba2-\u1ba5\u1ba8-\u1ba9\u1bab-\u1bad\u1be6\u1be8-\u1be9' + '\u1bed\u1bef-\u1bf1\u1c2c-\u1c33\u1c36-\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1cf4\u1cf8-\u1cf9' + '\u1dc0-\u1df5\u1dfc-\u1dff\u200c-\u200d\u20d0-\u20dc\u20DD-\u20E0\u20e1\u20E2-\u20E4\u20e5-\u20f0\u2cef-\u2cf1' + '\u2d7f\u2de0-\u2dff\u302a-\u302d\u302e-\u302f\u3099-\u309a\ua66f\uA670-\uA672\ua674-\ua67d\uA69E-\ua69f\ua6f0-\ua6f1' + '\ua802\ua806\ua80b\ua825-\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc' + '\ua9e5\uaa29-\uaa2e\uaa31-\uaa32\uaa35-\uaa36\uaa43\uaa4c\uaa7c\uaab0\uaab2-\uaab4\uaab7-\uaab8\uaabe-\uaabf\uaac1' + '\uaaec-\uaaed\uaaf6\uabe5\uabe8\uabed\ufb1e\ufe00-\ufe0f\ufe20-\uFE2F\uff9e-\uff9f]')
    const isExtendingChar = function (ch) {
      return typeof ch === 'string' && ch.charCodeAt(0) >= 768 && extendingChars.test(ch)
    }

    const liftN = function (arr, f) {
      const r = []
      for (let i = 0; i < arr.length; i++) {
        const x = arr[i]
        if (x.isSome()) {
          r.push(x.getOrDie())
        } else {
          return Option.none()
        }
      }
      return Option.some(f.apply(null, r))
    }

    const slice$3 = [].slice
    const or = function () {
      const x = []
      for (let _i = 0; _i < arguments.length; _i++) {
        x[_i] = arguments[_i]
      }
      const args = slice$3.call(arguments)
      return function (x) {
        for (let i = 0; i < args.length; i++) {
          if (args[i](x)) {
            return true
          }
        }
        return false
      }
    }
    const and = function () {
      const x = []
      for (let _i = 0; _i < arguments.length; _i++) {
        x[_i] = arguments[_i]
      }
      const args = slice$3.call(arguments)
      return function (x) {
        for (let i = 0; i < args.length; i++) {
          if (!args[i](x)) {
            return false
          }
        }
        return true
      }
    }
    const Predicate = {
      and,
      or,
    }

    const isElement$3 = NodeType.isElement
    const isCaretCandidate$1 = isCaretCandidate
    const isBlock$1 = NodeType.matchStyleValues('display', 'block table')
    const isFloated = NodeType.matchStyleValues('float', 'left right')
    const isValidElementCaretCandidate = Predicate.and(isElement$3, isCaretCandidate$1, not(isFloated))
    const isNotPre = not(NodeType.matchStyleValues('white-space', 'pre pre-line pre-wrap'))
    const isText$4 = NodeType.isText
    const isBr$3 = NodeType.isBr
    const { nodeIndex } = DOMUtils$1
    const resolveIndex = getNode
    const createRange = function (doc) {
      return 'createRange' in doc ? doc.createRange() : DOMUtils$1.DOM.createRng()
    }
    const isWhiteSpace = function (chr) {
      return chr && /[\r\n\t ]/.test(chr)
    }
    const isRange = function (rng) {
      return !!rng.setStart && !!rng.setEnd
    }
    const isHiddenWhiteSpaceRange = function (range$$1) {
      const container = range$$1.startContainer
      const offset = range$$1.startOffset
      let text
      if (isWhiteSpace(range$$1.toString()) && isNotPre(container.parentNode) && NodeType.isText(container)) {
        text = container.data
        if (isWhiteSpace(text[offset - 1]) || isWhiteSpace(text[offset + 1])) {
          return true
        }
      }
      return false
    }
    const getBrClientRect = function (brNode) {
      const doc = brNode.ownerDocument
      const rng = createRange(doc)
      const nbsp = doc.createTextNode('\xA0')
      const { parentNode } = brNode
      let clientRect
      parentNode.insertBefore(nbsp, brNode)
      rng.setStart(nbsp, 0)
      rng.setEnd(nbsp, 1)
      clientRect = clone$2(rng.getBoundingClientRect())
      parentNode.removeChild(nbsp)
      return clientRect
    }
    const getBoundingClientRectWebKitText = function (rng) {
      const sc = rng.startContainer
      const ec = rng.endContainer
      const so = rng.startOffset
      const eo = rng.endOffset
      if (sc === ec && NodeType.isText(ec) && so === 0 && eo === 1) {
        const newRng = rng.cloneRange()
        newRng.setEndAfter(ec)
        return getBoundingClientRect(newRng)
      }
      return null
    }
    const isZeroRect = function (r) {
      return r.left === 0 && r.right === 0 && r.top === 0 && r.bottom === 0
    }
    var getBoundingClientRect = function (item) {
      let clientRect, clientRects
      clientRects = item.getClientRects()
      if (clientRects.length > 0) {
        clientRect = clone$2(clientRects[0])
      } else {
        clientRect = clone$2(item.getBoundingClientRect())
      }
      if (!isRange(item) && isBr$3(item) && isZeroRect(clientRect)) {
        return getBrClientRect(item)
      }
      if (isZeroRect(clientRect) && isRange(item)) {
        return getBoundingClientRectWebKitText(item)
      }
      return clientRect
    }
    const collapseAndInflateWidth = function (clientRect, toStart) {
      const newClientRect = collapse(clientRect, toStart)
      newClientRect.width = 1
      newClientRect.right = newClientRect.left + 1
      return newClientRect
    }
    const getCaretPositionClientRects = function (caretPosition) {
      const clientRects = []
      let beforeNode, node
      const addUniqueAndValidRect = function (clientRect) {
        if (clientRect.height === 0) {
          return
        }
        if (clientRects.length > 0) {
          if (isEqual(clientRect, clientRects[clientRects.length - 1])) {
            return
          }
        }
        clientRects.push(clientRect)
      }
      const addCharacterOffset = function (container, offset) {
        const range$$1 = createRange(container.ownerDocument)
        if (offset < container.data.length) {
          if (isExtendingChar(container.data[offset])) {
            return clientRects
          }
          if (isExtendingChar(container.data[offset - 1])) {
            range$$1.setStart(container, offset)
            range$$1.setEnd(container, offset + 1)
            if (!isHiddenWhiteSpaceRange(range$$1)) {
              addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(range$$1), false))
              return clientRects
            }
          }
        }
        if (offset > 0) {
          range$$1.setStart(container, offset - 1)
          range$$1.setEnd(container, offset)
          if (!isHiddenWhiteSpaceRange(range$$1)) {
            addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(range$$1), false))
          }
        }
        if (offset < container.data.length) {
          range$$1.setStart(container, offset)
          range$$1.setEnd(container, offset + 1)
          if (!isHiddenWhiteSpaceRange(range$$1)) {
            addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(range$$1), true))
          }
        }
      }
      if (isText$4(caretPosition.container())) {
        addCharacterOffset(caretPosition.container(), caretPosition.offset())
        return clientRects
      }
      if (isElement$3(caretPosition.container())) {
        if (caretPosition.isAtEnd()) {
          node = resolveIndex(caretPosition.container(), caretPosition.offset())
          if (isText$4(node)) {
            addCharacterOffset(node, node.data.length)
          }
          if (isValidElementCaretCandidate(node) && !isBr$3(node)) {
            addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(node), false))
          }
        } else {
          node = resolveIndex(caretPosition.container(), caretPosition.offset())
          if (isText$4(node)) {
            addCharacterOffset(node, 0)
          }
          if (isValidElementCaretCandidate(node) && caretPosition.isAtEnd()) {
            addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(node), false))
            return clientRects
          }
          beforeNode = resolveIndex(caretPosition.container(), caretPosition.offset() - 1)
          if (isValidElementCaretCandidate(beforeNode) && !isBr$3(beforeNode)) {
            if (isBlock$1(beforeNode) || isBlock$1(node) || !isValidElementCaretCandidate(node)) {
              addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(beforeNode), false))
            }
          }
          if (isValidElementCaretCandidate(node)) {
            addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(node), true))
          }
        }
      }
      return clientRects
    }
    function CaretPosition(container, offset, clientRects) {
      const isAtStart = function () {
        if (isText$4(container)) {
          return offset === 0
        }
        return offset === 0
      }
      const isAtEnd = function () {
        if (isText$4(container)) {
          return offset >= container.data.length
        }
        return offset >= container.childNodes.length
      }
      const toRange = function () {
        let range$$1
        range$$1 = createRange(container.ownerDocument)
        range$$1.setStart(container, offset)
        range$$1.setEnd(container, offset)
        return range$$1
      }
      const getClientRects = function () {
        if (!clientRects) {
          clientRects = getCaretPositionClientRects(CaretPosition(container, offset))
        }
        return clientRects
      }
      const isVisible = function () {
        return getClientRects().length > 0
      }
      const isEqual$$1 = function (caretPosition) {
        return caretPosition && container === caretPosition.container() && offset === caretPosition.offset()
      }
      const getNode$$1 = function (before) {
        return resolveIndex(container, before ? offset - 1 : offset)
      }
      return {
        container: constant(container),
        offset: constant(offset),
        toRange,
        getClientRects,
        isVisible,
        isAtStart,
        isAtEnd,
        isEqual: isEqual$$1,
        getNode: getNode$$1,
      }
    }
    (function (CaretPosition) {
      CaretPosition.fromRangeStart = function (range$$1) {
        return CaretPosition(range$$1.startContainer, range$$1.startOffset)
      }
      CaretPosition.fromRangeEnd = function (range$$1) {
        return CaretPosition(range$$1.endContainer, range$$1.endOffset)
      }
      CaretPosition.after = function (node) {
        return CaretPosition(node.parentNode, nodeIndex(node) + 1)
      }
      CaretPosition.before = function (node) {
        return CaretPosition(node.parentNode, nodeIndex(node))
      }
      CaretPosition.isAbove = function (pos1, pos2) {
        return liftN([
          head(pos2.getClientRects()),
          last(pos1.getClientRects()),
        ], isAbove).getOr(false)
      }
      CaretPosition.isBelow = function (pos1, pos2) {
        return liftN([
          last(pos2.getClientRects()),
          head(pos1.getClientRects()),
        ], isBelow).getOr(false)
      }
      CaretPosition.isAtStart = function (pos) {
        return pos ? pos.isAtStart() : false
      }
      CaretPosition.isAtEnd = function (pos) {
        return pos ? pos.isAtEnd() : false
      }
      CaretPosition.isTextPosition = function (pos) {
        return pos ? NodeType.isText(pos.container()) : false
      }
      CaretPosition.isElementPosition = function (pos) {
        return CaretPosition.isTextPosition(pos) === false
      }
    }(CaretPosition || (CaretPosition = {})))
    const CaretPosition$1 = CaretPosition

    const isText$5 = NodeType.isText
    const isBogus$1 = NodeType.isBogus
    const nodeIndex$1 = DOMUtils$1.nodeIndex
    var normalizedParent = function (node) {
      const { parentNode } = node
      if (isBogus$1(parentNode)) {
        return normalizedParent(parentNode)
      }
      return parentNode
    }
    var getChildNodes = function (node) {
      if (!node) {
        return []
      }
      return ArrUtils.reduce(node.childNodes, (result, node) => {
        if (isBogus$1(node) && node.nodeName !== 'BR') {
          result = result.concat(getChildNodes(node))
        } else {
          result.push(node)
        }
        return result
      }, [])
    }
    const normalizedTextOffset = function (node, offset) {
      while (node = node.previousSibling) {
        if (!isText$5(node)) {
          break
        }
        offset += node.data.length
      }
      return offset
    }
    const equal$1 = function (a) {
      return function (b) {
        return a === b
      }
    }
    const normalizedNodeIndex = function (node) {
      let nodes, index, numTextFragments
      nodes = getChildNodes(normalizedParent(node))
      index = ArrUtils.findIndex(nodes, equal$1(node), node)
      nodes = nodes.slice(0, index + 1)
      numTextFragments = ArrUtils.reduce(nodes, (result, node, i) => {
        if (isText$5(node) && isText$5(nodes[i - 1])) {
          result++
        }
        return result
      }, 0)
      nodes = ArrUtils.filter(nodes, NodeType.matchNodeNames(node.nodeName))
      index = ArrUtils.findIndex(nodes, equal$1(node), node)
      return index - numTextFragments
    }
    const createPathItem = function (node) {
      let name
      if (isText$5(node)) {
        name = 'text()'
      } else {
        name = node.nodeName.toLowerCase()
      }
      return `${name}[${normalizedNodeIndex(node)}]`
    }
    const parentsUntil = function (root, node, predicate) {
      const parents = []
      for (node = node.parentNode; node !== root; node = node.parentNode) {
        if (predicate && predicate(node)) {
          break
        }
        parents.push(node)
      }
      return parents
    }
    const create$2 = function (root, caretPosition) {
      let container; let offset; let path = []; let outputOffset; let childNodes; let parents
      container = caretPosition.container()
      offset = caretPosition.offset()
      if (isText$5(container)) {
        outputOffset = normalizedTextOffset(container, offset)
      } else {
        childNodes = container.childNodes
        if (offset >= childNodes.length) {
          outputOffset = 'after'
          offset = childNodes.length - 1
        } else {
          outputOffset = 'before'
        }
        container = childNodes[offset]
      }
      path.push(createPathItem(container))
      parents = parentsUntil(root, container)
      parents = ArrUtils.filter(parents, not(NodeType.isBogus))
      path = path.concat(ArrUtils.map(parents, (node) => createPathItem(node)))
      return `${path.reverse().join('/')},${outputOffset}`
    }
    const resolvePathItem = function (node, name, index) {
      let nodes = getChildNodes(node)
      nodes = ArrUtils.filter(nodes, (node, index) => !isText$5(node) || !isText$5(nodes[index - 1]))
      nodes = ArrUtils.filter(nodes, NodeType.matchNodeNames(name))
      return nodes[index]
    }
    const findTextPosition = function (container, offset) {
      let node = container; let targetOffset = 0; let dataLen
      while (isText$5(node)) {
        dataLen = node.data.length
        if (offset >= targetOffset && offset <= targetOffset + dataLen) {
          container = node
          offset -= targetOffset
          break
        }
        if (!isText$5(node.nextSibling)) {
          container = node
          offset = dataLen
          break
        }
        targetOffset += dataLen
        node = node.nextSibling
      }
      if (isText$5(container) && offset > container.data.length) {
        offset = container.data.length
      }
      return CaretPosition$1(container, offset)
    }
    const resolve$2 = function (root, path) {
      let parts, container, offset
      if (!path) {
        return null
      }
      parts = path.split(',')
      path = parts[0].split('/')
      offset = parts.length > 1 ? parts[1] : 'before'
      container = ArrUtils.reduce(path, (result, value) => {
        value = /([\w\-\(\)]+)\[([0-9]+)\]/.exec(value)
        if (!value) {
          return null
        }
        if (value[1] === 'text()') {
          value[1] = '#text'
        }
        return resolvePathItem(result, value[1], parseInt(value[2], 10))
      }, root)
      if (!container) {
        return null
      }
      if (!isText$5(container)) {
        if (offset === 'after') {
          offset = nodeIndex$1(container) + 1
        } else {
          offset = nodeIndex$1(container)
        }
        return CaretPosition$1(container.parentNode, offset)
      }
      return findTextPosition(container, parseInt(offset, 10))
    }

    const isContentEditableFalse$2 = NodeType.isContentEditableFalse
    const getNormalizedTextOffset = function (trim, container, offset) {
      let node, trimmedOffset
      trimmedOffset = trim(container.data.slice(0, offset)).length
      for (node = container.previousSibling; node && NodeType.isText(node); node = node.previousSibling) {
        trimmedOffset += trim(node.data).length
      }
      return trimmedOffset
    }
    const getPoint = function (dom, trim, normalized, rng, start) {
      let container = rng[start ? 'startContainer' : 'endContainer']
      let offset = rng[start ? 'startOffset' : 'endOffset']
      const point = []
      let childNodes; let after = 0
      const root = dom.getRoot()
      if (NodeType.isText(container)) {
        point.push(normalized ? getNormalizedTextOffset(trim, container, offset) : offset)
      } else {
        childNodes = container.childNodes
        if (offset >= childNodes.length && childNodes.length) {
          after = 1
          offset = Math.max(0, childNodes.length - 1)
        }
        point.push(dom.nodeIndex(childNodes[offset], normalized) + after)
      }
      for (; container && container !== root; container = container.parentNode) {
        point.push(dom.nodeIndex(container, normalized))
      }
      return point
    }
    const getLocation = function (trim, selection, normalized, rng) {
      const { dom } = selection; const bookmark = {}
      bookmark.start = getPoint(dom, trim, normalized, rng, true)
      if (!selection.isCollapsed()) {
        bookmark.end = getPoint(dom, trim, normalized, rng, false)
      }
      return bookmark
    }
    const trimEmptyTextNode = function (node) {
      if (NodeType.isText(node) && node.data.length === 0) {
        node.parentNode.removeChild(node)
      }
    }
    const findIndex$3 = function (dom, name, element) {
      let count = 0
      Tools.each(dom.select(name), (node) => {
        if (node.getAttribute('data-mce-bogus') === 'all') {
          return
        }
        if (node === element) {
          return false
        }
        count++
      })
      return count
    }
    const moveEndPoint = function (rng, start) {
      let container, offset, childNodes
      const prefix = start ? 'start' : 'end'
      container = rng[`${prefix}Container`]
      offset = rng[`${prefix}Offset`]
      if (NodeType.isElement(container) && container.nodeName === 'TR') {
        childNodes = container.childNodes
        container = childNodes[Math.min(start ? offset : offset - 1, childNodes.length - 1)]
        if (container) {
          offset = start ? 0 : container.childNodes.length
          rng[`set${start ? 'Start' : 'End'}`](container, offset)
        }
      }
    }
    const normalizeTableCellSelection = function (rng) {
      moveEndPoint(rng, true)
      moveEndPoint(rng, false)
      return rng
    }
    const findSibling = function (node, offset) {
      let sibling
      if (NodeType.isElement(node)) {
        node = getNode(node, offset)
        if (isContentEditableFalse$2(node)) {
          return node
        }
      }
      if (isCaretContainer(node)) {
        if (NodeType.isText(node) && isCaretContainerBlock(node)) {
          node = node.parentNode
        }
        sibling = node.previousSibling
        if (isContentEditableFalse$2(sibling)) {
          return sibling
        }
        sibling = node.nextSibling
        if (isContentEditableFalse$2(sibling)) {
          return sibling
        }
      }
    }
    const findAdjacentContentEditableFalseElm = function (rng) {
      return findSibling(rng.startContainer, rng.startOffset) || findSibling(rng.endContainer, rng.endOffset)
    }
    const getOffsetBookmark = function (trim, normalized, selection) {
      const element = selection.getNode()
      let name = element ? element.nodeName : null
      const rng = selection.getRng()
      if (isContentEditableFalse$2(element) || name === 'IMG') {
        return {
          name,
          index: findIndex$3(selection.dom, name, element),
        }
      }
      const sibling = findAdjacentContentEditableFalseElm(rng)
      if (sibling) {
        name = sibling.tagName
        return {
          name,
          index: findIndex$3(selection.dom, name, sibling),
        }
      }
      return getLocation(trim, selection, normalized, rng)
    }
    const getCaretBookmark = function (selection) {
      const rng = selection.getRng()
      return {
        start: create$2(selection.dom.getRoot(), CaretPosition$1.fromRangeStart(rng)),
        end: create$2(selection.dom.getRoot(), CaretPosition$1.fromRangeEnd(rng)),
      }
    }
    const getRangeBookmark = function (selection) {
      return { rng: selection.getRng() }
    }
    const createBookmarkSpan = function (dom, id, filled) {
      const args = {
        'data-mce-type': 'bookmark',
        id,
        style: 'overflow:hidden;line-height:0px',
      }
      return filled ? dom.create('span', args, '&#xFEFF;') : dom.create('span', args)
    }
    const getPersistentBookmark = function (selection, filled) {
      const { dom } = selection
      let rng = selection.getRng()
      const id = dom.uniqueId()
      const collapsed = selection.isCollapsed()
      const element = selection.getNode()
      const name = element.nodeName
      if (name === 'IMG') {
        return {
          name,
          index: findIndex$3(dom, name, element),
        }
      }
      const rng2 = normalizeTableCellSelection(rng.cloneRange())
      if (!collapsed) {
        rng2.collapse(false)
        const endBookmarkNode = createBookmarkSpan(dom, `${id}_end`, filled)
        rng2.insertNode(endBookmarkNode)
        trimEmptyTextNode(endBookmarkNode.nextSibling)
      }
      rng = normalizeTableCellSelection(rng)
      rng.collapse(true)
      const startBookmarkNode = createBookmarkSpan(dom, `${id}_start`, filled)
      rng.insertNode(startBookmarkNode)
      trimEmptyTextNode(startBookmarkNode.previousSibling)
      trimEmptyTextNode(startBookmarkNode.nextSibling)
      selection.moveToBookmark({
        id,
        keep: 1,
      })
      return { id }
    }
    const getBookmark = function (selection, type, normalized) {
      if (type === 2) {
        return getOffsetBookmark(Zwsp.trim, normalized, selection)
      } if (type === 3) {
        return getCaretBookmark(selection)
      } if (type) {
        return getRangeBookmark(selection)
      }
      return getPersistentBookmark(selection, false)
    }
    const GetBookmark = {
      getBookmark,
      getUndoBookmark: curry(getOffsetBookmark, identity, true),
      getPersistentBookmark,
    }

    const CARET_ID = '_mce_caret'
    const isCaretNode = function (node) {
      return NodeType.isElement(node) && node.id === CARET_ID
    }
    const getParentCaretContainer = function (body, node) {
      while (node && node !== body) {
        if (node.id === CARET_ID) {
          return node
        }
        node = node.parentNode
      }
      return null
    }

    const isElement$4 = NodeType.isElement
    const isText$6 = NodeType.isText
    const removeNode = function (node) {
      const { parentNode } = node
      if (parentNode) {
        parentNode.removeChild(node)
      }
    }
    const getNodeValue = function (node) {
      try {
        return node.nodeValue
      } catch (ex) {
        return ''
      }
    }
    const setNodeValue = function (node, text) {
      if (text.length === 0) {
        removeNode(node)
      } else {
        node.nodeValue = text
      }
    }
    const trimCount = function (text) {
      const trimmedText = Zwsp.trim(text)
      return {
        count: text.length - trimmedText.length,
        text: trimmedText,
      }
    }
    const removeUnchanged = function (caretContainer, pos) {
      remove$7(caretContainer)
      return pos
    }
    const removeTextAndReposition = function (caretContainer, pos) {
      const before = trimCount(caretContainer.data.substr(0, pos.offset()))
      const after = trimCount(caretContainer.data.substr(pos.offset()))
      const text = before.text + after.text
      if (text.length > 0) {
        setNodeValue(caretContainer, text)
        return CaretPosition$1(caretContainer, pos.offset() - before.count)
      }
      return pos
    }
    const removeElementAndReposition = function (caretContainer, pos) {
      const parentNode = pos.container()
      const newPosition = indexOf(from$1(parentNode.childNodes), caretContainer).map((index) => index < pos.offset() ? CaretPosition$1(parentNode, pos.offset() - 1) : pos).getOr(pos)
      remove$7(caretContainer)
      return newPosition
    }
    const removeTextCaretContainer = function (caretContainer, pos) {
      return isText$6(caretContainer) && pos.container() === caretContainer ? removeTextAndReposition(caretContainer, pos) : removeUnchanged(caretContainer, pos)
    }
    const removeElementCaretContainer = function (caretContainer, pos) {
      return pos.container() === caretContainer.parentNode ? removeElementAndReposition(caretContainer, pos) : removeUnchanged(caretContainer, pos)
    }
    const removeAndReposition = function (container, pos) {
      return CaretPosition$1.isTextPosition(pos) ? removeTextCaretContainer(container, pos) : removeElementCaretContainer(container, pos)
    }
    var remove$7 = function (caretContainerNode) {
      if (isElement$4(caretContainerNode) && isCaretContainer(caretContainerNode)) {
        if (hasContent(caretContainerNode)) {
          caretContainerNode.removeAttribute('data-mce-caret')
        } else {
          removeNode(caretContainerNode)
        }
      }
      if (isText$6(caretContainerNode)) {
        const text = Zwsp.trim(getNodeValue(caretContainerNode))
        setNodeValue(caretContainerNode, text)
      }
    }
    const CaretContainerRemove = {
      removeAndReposition,
      remove: remove$7,
    }

    const browser$2 = PlatformDetection$1.detect().browser
    const isContentEditableFalse$3 = NodeType.isContentEditableFalse
    const isTableCell$1 = function (node) {
      return NodeType.isElement(node) && /^(TD|TH)$/i.test(node.tagName)
    }
    const getAbsoluteClientRect = function (root, element, before) {
      const clientRect = collapse(element.getBoundingClientRect(), before)
      let docElm, scrollX, scrollY, margin, rootRect
      if (root.tagName === 'BODY') {
        docElm = root.ownerDocument.documentElement
        scrollX = root.scrollLeft || docElm.scrollLeft
        scrollY = root.scrollTop || docElm.scrollTop
      } else {
        rootRect = root.getBoundingClientRect()
        scrollX = root.scrollLeft - rootRect.left
        scrollY = root.scrollTop - rootRect.top
      }
      clientRect.left += scrollX
      clientRect.right += scrollX
      clientRect.top += scrollY
      clientRect.bottom += scrollY
      clientRect.width = 1
      margin = element.offsetWidth - element.clientWidth
      if (margin > 0) {
        if (before) {
          margin *= -1
        }
        clientRect.left += margin
        clientRect.right += margin
      }
      return clientRect
    }
    const trimInlineCaretContainers = function (root) {
      let contentEditableFalseNodes, node, sibling, i, data
      contentEditableFalseNodes = DomQuery('*[contentEditable=false]', root)
      for (i = 0; i < contentEditableFalseNodes.length; i++) {
        node = contentEditableFalseNodes[i]
        sibling = node.previousSibling
        if (endsWithCaretContainer(sibling)) {
          data = sibling.data
          if (data.length === 1) {
            sibling.parentNode.removeChild(sibling)
          } else {
            sibling.deleteData(data.length - 1, 1)
          }
        }
        sibling = node.nextSibling
        if (startsWithCaretContainer(sibling)) {
          data = sibling.data
          if (data.length === 1) {
            sibling.parentNode.removeChild(sibling)
          } else {
            sibling.deleteData(0, 1)
          }
        }
      }
    }
    const FakeCaret = function (root, isBlock, hasFocus) {
      const lastVisualCaret = Cell(Option.none())
      let cursorInterval, caretContainerNode
      const show = function (before, element) {
        let clientRect, rng
        hide()
        if (isTableCell$1(element)) {
          return null
        }
        if (isBlock(element)) {
          caretContainerNode = insertBlock('p', element, before)
          clientRect = getAbsoluteClientRect(root, element, before)
          DomQuery(caretContainerNode).css('top', clientRect.top)
          const caret = DomQuery('<div class="mce-visual-caret" data-mce-bogus="all"></div>').css(clientRect).appendTo(root)[0]
          lastVisualCaret.set(Option.some({
            caret,
            element,
            before,
          }))
          lastVisualCaret.get().each((caretState) => {
            if (before) {
              DomQuery(caretState.caret).addClass('mce-visual-caret-before')
            }
          })
          startBlink()
          rng = element.ownerDocument.createRange()
          rng.setStart(caretContainerNode, 0)
          rng.setEnd(caretContainerNode, 0)
        } else {
          caretContainerNode = insertInline(element, before)
          rng = element.ownerDocument.createRange()
          if (isContentEditableFalse$3(caretContainerNode.nextSibling)) {
            rng.setStart(caretContainerNode, 0)
            rng.setEnd(caretContainerNode, 0)
          } else {
            rng.setStart(caretContainerNode, 1)
            rng.setEnd(caretContainerNode, 1)
          }
          return rng
        }
        return rng
      }
      var hide = function () {
        trimInlineCaretContainers(root)
        if (caretContainerNode) {
          CaretContainerRemove.remove(caretContainerNode)
          caretContainerNode = null
        }
        lastVisualCaret.get().each((caretState) => {
          DomQuery(caretState.caret).remove()
          lastVisualCaret.set(Option.none())
        })
        clearInterval(cursorInterval)
      }
      var startBlink = function () {
        cursorInterval = Delay.setInterval(() => {
          if (hasFocus()) {
            DomQuery('div.mce-visual-caret', root).toggleClass('mce-visual-caret-hidden')
          } else {
            DomQuery('div.mce-visual-caret', root).addClass('mce-visual-caret-hidden')
          }
        }, 500)
      }
      const reposition = function () {
        lastVisualCaret.get().each((caretState) => {
          const clientRect = getAbsoluteClientRect(root, caretState.element, caretState.before)
          DomQuery(caretState.caret).css(clientRect)
        })
      }
      const destroy = function () {
        return Delay.clearInterval(cursorInterval)
      }
      const getCss = function () {
        return '.mce-visual-caret {' + 'position: absolute;' + 'background-color: black;' + 'background-color: currentcolor;' + '}' + '.mce-visual-caret-hidden {' + 'display: none;' + '}' + '*[data-mce-caret] {' + 'position: absolute;' + 'left: -1000px;' + 'right: auto;' + 'top: 0;' + 'margin: 0;' + 'padding: 0;' + '}'
      }
      return {
        show,
        hide,
        getCss,
        reposition,
        destroy,
      }
    }
    const isFakeCaretTableBrowser = function () {
      return browser$2.isIE() || browser$2.isEdge() || browser$2.isFirefox()
    }
    const isFakeCaretTarget = function (node) {
      return isContentEditableFalse$3(node) || NodeType.isTable(node) && isFakeCaretTableBrowser()
    }

    const is$3 = function (expected) {
      return function (actual) {
        return expected === actual
      }
    }
    const isNbsp = is$3('\xA0')
    const isWhiteSpace$1 = function (chr) {
      return /^[\r\n\t ]$/.test(chr)
    }
    const isContent = function (chr) {
      return !isWhiteSpace$1(chr) && !isNbsp(chr)
    }

    const isContentEditableFalse$4 = NodeType.isContentEditableFalse
    const isBlockLike = NodeType.matchStyleValues('display', 'block table table-cell table-caption list-item')
    const isCaretContainer$2 = isCaretContainer
    const isCaretContainerBlock$1 = isCaretContainerBlock
    const isElement$5 = NodeType.isElement
    const isCaretCandidate$2 = isCaretCandidate
    const isForwards = function (direction) {
      return direction > 0
    }
    const isBackwards = function (direction) {
      return direction < 0
    }
    const skipCaretContainers = function (walk, shallow) {
      let node
      while (node = walk(shallow)) {
        if (!isCaretContainerBlock$1(node)) {
          return node
        }
      }
      return null
    }
    const findNode = function (node, direction, predicateFn, rootNode, shallow) {
      const walker = new TreeWalker(node, rootNode)
      if (isBackwards(direction)) {
        if (isContentEditableFalse$4(node) || isCaretContainerBlock$1(node)) {
          node = skipCaretContainers(walker.prev, true)
          if (predicateFn(node)) {
            return node
          }
        }
        while (node = skipCaretContainers(walker.prev, shallow)) {
          if (predicateFn(node)) {
            return node
          }
        }
      }
      if (isForwards(direction)) {
        if (isContentEditableFalse$4(node) || isCaretContainerBlock$1(node)) {
          node = skipCaretContainers(walker.next, true)
          if (predicateFn(node)) {
            return node
          }
        }
        while (node = skipCaretContainers(walker.next, shallow)) {
          if (predicateFn(node)) {
            return node
          }
        }
      }
      return null
    }
    const getParentBlock = function (node, rootNode) {
      while (node && node !== rootNode) {
        if (isBlockLike(node)) {
          return node
        }
        node = node.parentNode
      }
      return null
    }
    const isInSameBlock = function (caretPosition1, caretPosition2, rootNode) {
      return getParentBlock(caretPosition1.container(), rootNode) === getParentBlock(caretPosition2.container(), rootNode)
    }
    const getChildNodeAtRelativeOffset = function (relativeOffset, caretPosition) {
      let container, offset
      if (!caretPosition) {
        return null
      }
      container = caretPosition.container()
      offset = caretPosition.offset()
      if (!isElement$5(container)) {
        return null
      }
      return container.childNodes[offset + relativeOffset]
    }
    const beforeAfter = function (before, node) {
      const range = node.ownerDocument.createRange()
      if (before) {
        range.setStartBefore(node)
        range.setEndBefore(node)
      } else {
        range.setStartAfter(node)
        range.setEndAfter(node)
      }
      return range
    }
    const isNodesInSameBlock = function (root, node1, node2) {
      return getParentBlock(node1, root) === getParentBlock(node2, root)
    }
    const lean = function (left, root, node) {
      let sibling, siblingName
      if (left) {
        siblingName = 'previousSibling'
      } else {
        siblingName = 'nextSibling'
      }
      while (node && node !== root) {
        sibling = node[siblingName]
        if (isCaretContainer$2(sibling)) {
          sibling = sibling[siblingName]
        }
        if (isContentEditableFalse$4(sibling)) {
          if (isNodesInSameBlock(root, sibling, node)) {
            return sibling
          }
          break
        }
        if (isCaretCandidate$2(sibling)) {
          break
        }
        node = node.parentNode
      }
      return null
    }
    const before$2 = curry(beforeAfter, true)
    const after$2 = curry(beforeAfter, false)
    const normalizeRange = function (direction, root, range) {
      let node, container, offset, location
      const leanLeft = curry(lean, true, root)
      const leanRight = curry(lean, false, root)
      container = range.startContainer
      offset = range.startOffset
      if (isCaretContainerBlock(container)) {
        if (!isElement$5(container)) {
          container = container.parentNode
        }
        location = container.getAttribute('data-mce-caret')
        if (location === 'before') {
          node = container.nextSibling
          if (isFakeCaretTarget(node)) {
            return before$2(node)
          }
        }
        if (location === 'after') {
          node = container.previousSibling
          if (isFakeCaretTarget(node)) {
            return after$2(node)
          }
        }
      }
      if (!range.collapsed) {
        return range
      }
      if (NodeType.isText(container)) {
        if (isCaretContainer$2(container)) {
          if (direction === 1) {
            node = leanRight(container)
            if (node) {
              return before$2(node)
            }
            node = leanLeft(container)
            if (node) {
              return after$2(node)
            }
          }
          if (direction === -1) {
            node = leanLeft(container)
            if (node) {
              return after$2(node)
            }
            node = leanRight(container)
            if (node) {
              return before$2(node)
            }
          }
          return range
        }
        if (endsWithCaretContainer(container) && offset >= container.data.length - 1) {
          if (direction === 1) {
            node = leanRight(container)
            if (node) {
              return before$2(node)
            }
          }
          return range
        }
        if (startsWithCaretContainer(container) && offset <= 1) {
          if (direction === -1) {
            node = leanLeft(container)
            if (node) {
              return after$2(node)
            }
          }
          return range
        }
        if (offset === container.data.length) {
          node = leanRight(container)
          if (node) {
            return before$2(node)
          }
          return range
        }
        if (offset === 0) {
          node = leanLeft(container)
          if (node) {
            return after$2(node)
          }
          return range
        }
      }
      return range
    }
    const isNextToContentEditableFalse = function (relativeOffset, caretPosition) {
      const node = getChildNodeAtRelativeOffset(relativeOffset, caretPosition)
      return isContentEditableFalse$4(node) && !NodeType.isBogusAll(node)
    }
    const isNextToTable = function (relativeOffset, caretPosition) {
      return NodeType.isTable(getChildNodeAtRelativeOffset(relativeOffset, caretPosition))
    }
    const getRelativeCefElm = function (forward, caretPosition) {
      return Option.from(getChildNodeAtRelativeOffset(forward ? 0 : -1, caretPosition)).filter(isContentEditableFalse$4)
    }
    const getNormalizedRangeEndPoint = function (direction, root, range) {
      const normalizedRange = normalizeRange(direction, root, range)
      if (direction === -1) {
        return CaretPosition.fromRangeStart(normalizedRange)
      }
      return CaretPosition.fromRangeEnd(normalizedRange)
    }
    const isBeforeContentEditableFalse = curry(isNextToContentEditableFalse, 0)
    const isAfterContentEditableFalse = curry(isNextToContentEditableFalse, -1)
    const isBeforeTable = curry(isNextToTable, 0)
    const isAfterTable = curry(isNextToTable, -1)
    const isChar = function (forward, predicate, pos) {
      return Option.from(pos.container()).filter(NodeType.isText).exists((text) => {
        const delta = forward ? 0 : -1
        return predicate(text.data.charAt(pos.offset() + delta))
      })
    }
    const isBeforeSpace = curry(isChar, true, isWhiteSpace$1)
    const isAfterSpace = curry(isChar, false, isWhiteSpace$1)
    const getElementFromPosition = function (pos) {
      return Option.from(pos.getNode()).map(Element$$1.fromDom)
    }
    const getElementFromPrevPosition = function (pos) {
      return Option.from(pos.getNode(true)).map(Element$$1.fromDom)
    }

    let HDirection;
    (function (HDirection) {
      HDirection[HDirection.Backwards = -1] = 'Backwards'
      HDirection[HDirection.Forwards = 1] = 'Forwards'
    }(HDirection || (HDirection = {})))
    const isContentEditableFalse$5 = NodeType.isContentEditableFalse
    const isText$7 = NodeType.isText
    const isElement$6 = NodeType.isElement
    const isBr$4 = NodeType.isBr
    const isCaretCandidate$3 = isCaretCandidate
    const isAtomic$1 = isAtomic
    const isEditableCaretCandidate$1 = isEditableCaretCandidate
    const getParents = function (node, root) {
      const parents = []
      while (node && node !== root) {
        parents.push(node)
        node = node.parentNode
      }
      return parents
    }
    const nodeAtIndex = function (container, offset) {
      if (container.hasChildNodes() && offset < container.childNodes.length) {
        return container.childNodes[offset]
      }
      return null
    }
    const getCaretCandidatePosition = function (direction, node) {
      if (isForwards(direction)) {
        if (isCaretCandidate$3(node.previousSibling) && !isText$7(node.previousSibling)) {
          return CaretPosition$1.before(node)
        }
        if (isText$7(node)) {
          return CaretPosition$1(node, 0)
        }
      }
      if (isBackwards(direction)) {
        if (isCaretCandidate$3(node.nextSibling) && !isText$7(node.nextSibling)) {
          return CaretPosition$1.after(node)
        }
        if (isText$7(node)) {
          return CaretPosition$1(node, node.data.length)
        }
      }
      if (isBackwards(direction)) {
        if (isBr$4(node)) {
          return CaretPosition$1.before(node)
        }
        return CaretPosition$1.after(node)
      }
      return CaretPosition$1.before(node)
    }
    const moveForwardFromBr = function (root, nextNode) {
      const { nextSibling } = nextNode
      if (nextSibling && isCaretCandidate$3(nextSibling)) {
        if (isText$7(nextSibling)) {
          return CaretPosition$1(nextSibling, 0)
        }
        return CaretPosition$1.before(nextSibling)
      }
      return findCaretPosition(HDirection.Forwards, CaretPosition$1.after(nextNode), root)
    }
    var findCaretPosition = function (direction, startPos, root) {
      let node, nextNode, innerNode
      let rootContentEditableFalseElm, caretPosition
      if (!isElement$6(root) || !startPos) {
        return null
      }
      if (startPos.isEqual(CaretPosition$1.after(root)) && root.lastChild) {
        caretPosition = CaretPosition$1.after(root.lastChild)
        if (isBackwards(direction) && isCaretCandidate$3(root.lastChild) && isElement$6(root.lastChild)) {
          return isBr$4(root.lastChild) ? CaretPosition$1.before(root.lastChild) : caretPosition
        }
      } else {
        caretPosition = startPos
      }
      const container = caretPosition.container()
      let offset = caretPosition.offset()
      if (isText$7(container)) {
        if (isBackwards(direction) && offset > 0) {
          return CaretPosition$1(container, --offset)
        }
        if (isForwards(direction) && offset < container.length) {
          return CaretPosition$1(container, ++offset)
        }
        node = container
      } else {
        if (isBackwards(direction) && offset > 0) {
          nextNode = nodeAtIndex(container, offset - 1)
          if (isCaretCandidate$3(nextNode)) {
            if (!isAtomic$1(nextNode)) {
              innerNode = findNode(nextNode, direction, isEditableCaretCandidate$1, nextNode)
              if (innerNode) {
                if (isText$7(innerNode)) {
                  return CaretPosition$1(innerNode, innerNode.data.length)
                }
                return CaretPosition$1.after(innerNode)
              }
            }
            if (isText$7(nextNode)) {
              return CaretPosition$1(nextNode, nextNode.data.length)
            }
            return CaretPosition$1.before(nextNode)
          }
        }
        if (isForwards(direction) && offset < container.childNodes.length) {
          nextNode = nodeAtIndex(container, offset)
          if (isCaretCandidate$3(nextNode)) {
            if (isBr$4(nextNode)) {
              return moveForwardFromBr(root, nextNode)
            }
            if (!isAtomic$1(nextNode)) {
              innerNode = findNode(nextNode, direction, isEditableCaretCandidate$1, nextNode)
              if (innerNode) {
                if (isText$7(innerNode)) {
                  return CaretPosition$1(innerNode, 0)
                }
                return CaretPosition$1.before(innerNode)
              }
            }
            if (isText$7(nextNode)) {
              return CaretPosition$1(nextNode, 0)
            }
            return CaretPosition$1.after(nextNode)
          }
        }
        node = nextNode || caretPosition.getNode()
      }
      if (isForwards(direction) && caretPosition.isAtEnd() || isBackwards(direction) && caretPosition.isAtStart()) {
        node = findNode(node, direction, constant(true), root, true)
        if (isEditableCaretCandidate$1(node, root)) {
          return getCaretCandidatePosition(direction, node)
        }
      }
      nextNode = findNode(node, direction, isEditableCaretCandidate$1, root)
      rootContentEditableFalseElm = ArrUtils.last(filter(getParents(container, root), isContentEditableFalse$5))
      if (rootContentEditableFalseElm && (!nextNode || !rootContentEditableFalseElm.contains(nextNode))) {
        if (isForwards(direction)) {
          caretPosition = CaretPosition$1.after(rootContentEditableFalseElm)
        } else {
          caretPosition = CaretPosition$1.before(rootContentEditableFalseElm)
        }
        return caretPosition
      }
      if (nextNode) {
        return getCaretCandidatePosition(direction, nextNode)
      }
      return null
    }
    const CaretWalker = function (root) {
      return {
        next(caretPosition) {
          return findCaretPosition(HDirection.Forwards, caretPosition, root)
        },
        prev(caretPosition) {
          return findCaretPosition(HDirection.Backwards, caretPosition, root)
        },
      }
    }

    const walkToPositionIn = function (forward, root, start) {
      const position = forward ? CaretPosition$1.before(start) : CaretPosition$1.after(start)
      return fromPosition(forward, root, position)
    }
    const afterElement = function (node) {
      return NodeType.isBr(node) ? CaretPosition$1.before(node) : CaretPosition$1.after(node)
    }
    const isBeforeOrStart = function (position) {
      if (CaretPosition$1.isTextPosition(position)) {
        return position.offset() === 0
      }
      return isCaretCandidate(position.getNode())
    }
    const isAfterOrEnd = function (position) {
      if (CaretPosition$1.isTextPosition(position)) {
        const container = position.container()
        return position.offset() === container.data.length
      }
      return isCaretCandidate(position.getNode(true))
    }
    const isBeforeAfterSameElement = function (from, to) {
      return !CaretPosition$1.isTextPosition(from) && !CaretPosition$1.isTextPosition(to) && from.getNode() === to.getNode(true)
    }
    const isAtBr = function (position) {
      return !CaretPosition$1.isTextPosition(position) && NodeType.isBr(position.getNode())
    }
    const shouldSkipPosition = function (forward, from, to) {
      if (forward) {
        return !isBeforeAfterSameElement(from, to) && !isAtBr(from) && isAfterOrEnd(from) && isBeforeOrStart(to)
      }
      return !isBeforeAfterSameElement(to, from) && isBeforeOrStart(from) && isAfterOrEnd(to)
    }
    var fromPosition = function (forward, root, pos) {
      const walker = CaretWalker(root)
      return Option.from(forward ? walker.next(pos) : walker.prev(pos))
    }
    const navigate = function (forward, root, from) {
      return fromPosition(forward, root, from).bind((to) => {
        if (isInSameBlock(from, to, root) && shouldSkipPosition(forward, from, to)) {
          return fromPosition(forward, root, to)
        }
        return Option.some(to)
      })
    }
    const positionIn = function (forward, element) {
      const startNode = forward ? element.firstChild : element.lastChild
      if (NodeType.isText(startNode)) {
        return Option.some(CaretPosition$1(startNode, forward ? 0 : startNode.data.length))
      } if (startNode) {
        if (isCaretCandidate(startNode)) {
          return Option.some(forward ? CaretPosition$1.before(startNode) : afterElement(startNode))
        }
        return walkToPositionIn(forward, element, startNode)
      }
      return Option.none()
    }
    const nextPosition = curry(fromPosition, true)
    const prevPosition = curry(fromPosition, false)
    const CaretFinder = {
      fromPosition,
      nextPosition,
      prevPosition,
      navigate,
      positionIn,
      firstPositionIn: curry(positionIn, true),
      lastPositionIn: curry(positionIn, false),
    }

    const isStringPathBookmark = function (bookmark) {
      return typeof bookmark.start === 'string'
    }
    const isRangeBookmark = function (bookmark) {
      return bookmark.hasOwnProperty('rng')
    }
    const isIdBookmark = function (bookmark) {
      return bookmark.hasOwnProperty('id')
    }
    const isIndexBookmark = function (bookmark) {
      return bookmark.hasOwnProperty('name')
    }
    const isPathBookmark = function (bookmark) {
      return Tools.isArray(bookmark.start)
    }

    const addBogus = function (dom, node) {
      if (dom.isBlock(node) && !node.innerHTML && !Env.ie) {
        node.innerHTML = '<br data-mce-bogus="1" />'
      }
      return node
    }
    const resolveCaretPositionBookmark = function (dom, bookmark) {
      let rng, pos
      rng = dom.createRng()
      pos = resolve$2(dom.getRoot(), bookmark.start)
      rng.setStart(pos.container(), pos.offset())
      pos = resolve$2(dom.getRoot(), bookmark.end)
      rng.setEnd(pos.container(), pos.offset())
      return rng
    }
    const insertZwsp = function (node, rng) {
      const textNode = node.ownerDocument.createTextNode(Zwsp.ZWSP)
      node.appendChild(textNode)
      rng.setStart(textNode, 0)
      rng.setEnd(textNode, 0)
    }
    const isEmpty = function (node) {
      return node.hasChildNodes() === false
    }
    const tryFindRangePosition = function (node, rng) {
      return CaretFinder.lastPositionIn(node).fold(() => false, (pos) => {
        rng.setStart(pos.container(), pos.offset())
        rng.setEnd(pos.container(), pos.offset())
        return true
      })
    }
    const padEmptyCaretContainer = function (root, node, rng) {
      if (isEmpty(node) && getParentCaretContainer(root, node)) {
        insertZwsp(node, rng)
        return true
      }
      return false
    }
    const setEndPoint = function (dom, start, bookmark, rng) {
      const point = bookmark[start ? 'start' : 'end']
      let i, node, offset, children
      const root = dom.getRoot()
      if (point) {
        offset = point[0]
        for (node = root, i = point.length - 1; i >= 1; i--) {
          children = node.childNodes
          if (padEmptyCaretContainer(root, node, rng)) {
            return true
          }
          if (point[i] > children.length - 1) {
            if (padEmptyCaretContainer(root, node, rng)) {
              return true
            }
            return tryFindRangePosition(node, rng)
          }
          node = children[point[i]]
        }
        if (node.nodeType === 3) {
          offset = Math.min(point[0], node.nodeValue.length)
        }
        if (node.nodeType === 1) {
          offset = Math.min(point[0], node.childNodes.length)
        }
        if (start) {
          rng.setStart(node, offset)
        } else {
          rng.setEnd(node, offset)
        }
      }
      return true
    }
    const isValidTextNode = function (node) {
      return NodeType.isText(node) && node.data.length > 0
    }
    const restoreEndPoint = function (dom, suffix, bookmark) {
      let marker = dom.get(`${bookmark.id}_${suffix}`); let node; let idx; let next; let prev
      const { keep } = bookmark
      let container, offset
      if (marker) {
        node = marker.parentNode
        if (suffix === 'start') {
          if (!keep) {
            idx = dom.nodeIndex(marker)
          } else if (marker.hasChildNodes()) {
            node = marker.firstChild
            idx = 1
          } else if (isValidTextNode(marker.nextSibling)) {
            node = marker.nextSibling
            idx = 0
          } else if (isValidTextNode(marker.previousSibling)) {
            node = marker.previousSibling
            idx = marker.previousSibling.data.length
          } else {
            node = marker.parentNode
            idx = dom.nodeIndex(marker) + 1
          }
          container = node
          offset = idx
        } else {
          if (!keep) {
            idx = dom.nodeIndex(marker)
          } else if (marker.hasChildNodes()) {
            node = marker.firstChild
            idx = 1
          } else if (isValidTextNode(marker.previousSibling)) {
            node = marker.previousSibling
            idx = marker.previousSibling.data.length
          } else {
            node = marker.parentNode
            idx = dom.nodeIndex(marker)
          }
          container = node
          offset = idx
        }
        if (!keep) {
          prev = marker.previousSibling
          next = marker.nextSibling
          Tools.each(Tools.grep(marker.childNodes), (node) => {
            if (NodeType.isText(node)) {
              node.nodeValue = node.nodeValue.replace(/\uFEFF/g, '')
            }
          })
          while (marker = dom.get(`${bookmark.id}_${suffix}`)) {
            dom.remove(marker, true)
          }
          if (prev && next && prev.nodeType === next.nodeType && NodeType.isText(prev) && !Env.opera) {
            idx = prev.nodeValue.length
            prev.appendData(next.nodeValue)
            dom.remove(next)
            if (suffix === 'start') {
              container = prev
              offset = idx
            } else {
              container = prev
              offset = idx
            }
          }
        }
        return Option.some(CaretPosition$1(container, offset))
      }
      return Option.none()
    }
    const alt = function (o1, o2) {
      return o1.isSome() ? o1 : o2
    }
    const resolvePaths = function (dom, bookmark) {
      const rng = dom.createRng()
      if (setEndPoint(dom, true, bookmark, rng) && setEndPoint(dom, false, bookmark, rng)) {
        return Option.some(rng)
      }
      return Option.none()
    }
    const resolveId = function (dom, bookmark) {
      const startPos = restoreEndPoint(dom, 'start', bookmark)
      const endPos = restoreEndPoint(dom, 'end', bookmark)
      return liftN([
        startPos,
        alt(endPos, startPos),
      ], (spos, epos) => {
        const rng = dom.createRng()
        rng.setStart(addBogus(dom, spos.container()), spos.offset())
        rng.setEnd(addBogus(dom, epos.container()), epos.offset())
        return rng
      })
    }
    const resolveIndex$1 = function (dom, bookmark) {
      return Option.from(dom.select(bookmark.name)[bookmark.index]).map((elm) => {
        const rng = dom.createRng()
        rng.selectNode(elm)
        return rng
      })
    }
    const resolve$3 = function (selection, bookmark) {
      const { dom } = selection
      if (bookmark) {
        if (isPathBookmark(bookmark)) {
          return resolvePaths(dom, bookmark)
        } if (isStringPathBookmark(bookmark)) {
          return Option.some(resolveCaretPositionBookmark(dom, bookmark))
        } if (isIdBookmark(bookmark)) {
          return resolveId(dom, bookmark)
        } if (isIndexBookmark(bookmark)) {
          return resolveIndex$1(dom, bookmark)
        } if (isRangeBookmark(bookmark)) {
          return Option.some(bookmark.rng)
        }
      }
      return Option.none()
    }
    const ResolveBookmark = { resolve: resolve$3 }

    const getBookmark$1 = function (selection, type, normalized) {
      return GetBookmark.getBookmark(selection, type, normalized)
    }
    const moveToBookmark = function (selection, bookmark) {
      ResolveBookmark.resolve(selection, bookmark).each((rng) => {
        selection.setRng(rng)
      })
    }
    const isBookmarkNode$1 = function (node) {
      return NodeType.isElement(node) && node.tagName === 'SPAN' && node.getAttribute('data-mce-type') === 'bookmark'
    }
    const Bookmarks = {
      getBookmark: getBookmark$1,
      moveToBookmark,
      isBookmarkNode: isBookmarkNode$1,
    }

    const isInlineBlock = function (node) {
      return node && /^(IMG)$/.test(node.nodeName)
    }
    const moveStart = function (dom, selection, rng) {
      const offset = rng.startOffset
      let container = rng.startContainer; let walker; let node; let nodes
      if (rng.startContainer === rng.endContainer) {
        if (isInlineBlock(rng.startContainer.childNodes[rng.startOffset])) {
          return
        }
      }
      if (container.nodeType === 1) {
        nodes = container.childNodes
        if (offset < nodes.length) {
          container = nodes[offset]
          walker = new TreeWalker(container, dom.getParent(container, dom.isBlock))
        } else {
          container = nodes[nodes.length - 1]
          walker = new TreeWalker(container, dom.getParent(container, dom.isBlock))
          walker.next(true)
        }
        for (node = walker.current(); node; node = walker.next()) {
          if (node.nodeType === 3 && !isWhiteSpaceNode(node)) {
            rng.setStart(node, 0)
            selection.setRng(rng)
            return
          }
        }
      }
    }
    const getNonWhiteSpaceSibling = function (node, next, inc) {
      if (node) {
        next = next ? 'nextSibling' : 'previousSibling'
        for (node = inc ? node : node[next]; node; node = node[next]) {
          if (node.nodeType === 1 || !isWhiteSpaceNode(node)) {
            return node
          }
        }
      }
    }
    const isTextBlock$1 = function (editor, name) {
      if (name.nodeType) {
        name = name.nodeName
      }
      return !!editor.schema.getTextBlockElements()[name.toLowerCase()]
    }
    const isValid = function (ed, parent, child) {
      return ed.schema.isValidChild(parent, child)
    }
    var isWhiteSpaceNode = function (node) {
      return node && node.nodeType === 3 && /^([\t \r\n]+|)$/.test(node.nodeValue)
    }
    const replaceVars = function (value, vars) {
      if (typeof value !== 'string') {
        value = value(vars)
      } else if (vars) {
        value = value.replace(/%(\w+)/g, (str, name) => vars[name] || str)
      }
      return value
    }
    const isEq = function (str1, str2) {
      str1 = str1 || ''
      str2 = str2 || ''
      str1 = `${str1.nodeName || str1}`
      str2 = `${str2.nodeName || str2}`
      return str1.toLowerCase() === str2.toLowerCase()
    }
    const normalizeStyleValue = function (dom, value, name) {
      if (name === 'color' || name === 'backgroundColor') {
        value = dom.toHex(value)
      }
      if (name === 'fontWeight' && value === 700) {
        value = 'bold'
      }
      if (name === 'fontFamily') {
        value = value.replace(/[\'\"]/g, '').replace(/,\s+/g, ',')
      }
      return `${value}`
    }
    const getStyle = function (dom, node, name) {
      return normalizeStyleValue(dom, dom.getStyle(node, name), name)
    }
    const getTextDecoration = function (dom, node) {
      let decoration
      dom.getParent(node, (n) => {
        decoration = dom.getStyle(n, 'text-decoration')
        return decoration && decoration !== 'none'
      })
      return decoration
    }
    const getParents$1 = function (dom, node, selector) {
      return dom.getParents(node, selector, dom.getRoot())
    }
    const FormatUtils = {
      isInlineBlock,
      moveStart,
      getNonWhiteSpaceSibling,
      isTextBlock: isTextBlock$1,
      isValid,
      isWhiteSpaceNode,
      replaceVars,
      isEq,
      normalizeStyleValue,
      getStyle,
      getTextDecoration,
      getParents: getParents$1,
    }

    const isBookmarkNode$2 = Bookmarks.isBookmarkNode
    const getParents$2 = FormatUtils.getParents; const isWhiteSpaceNode$1 = FormatUtils.isWhiteSpaceNode; const isTextBlock$2 = FormatUtils.isTextBlock
    const findLeaf = function (node, offset) {
      if (typeof offset === 'undefined') {
        offset = node.nodeType === 3 ? node.length : node.childNodes.length
      }
      while (node && node.hasChildNodes()) {
        node = node.childNodes[offset]
        if (node) {
          offset = node.nodeType === 3 ? node.length : node.childNodes.length
        }
      }
      return {
        node,
        offset,
      }
    }
    const excludeTrailingWhitespace = function (endContainer, endOffset) {
      let leaf = findLeaf(endContainer, endOffset)
      if (leaf.node) {
        while (leaf.node && leaf.offset === 0 && leaf.node.previousSibling) {
          leaf = findLeaf(leaf.node.previousSibling)
        }
        if (leaf.node && leaf.offset > 0 && leaf.node.nodeType === 3 && leaf.node.nodeValue.charAt(leaf.offset - 1) === ' ') {
          if (leaf.offset > 1) {
            endContainer = leaf.node
            endContainer.splitText(leaf.offset - 1)
          }
        }
      }
      return endContainer
    }
    const isBogusBr = function (node) {
      return node.nodeName === 'BR' && node.getAttribute('data-mce-bogus') && !node.nextSibling
    }
    const findParentContentEditable = function (dom, node) {
      let parent = node
      while (parent) {
        if (parent.nodeType === 1 && dom.getContentEditable(parent)) {
          return dom.getContentEditable(parent) === 'false' ? parent : node
        }
        parent = parent.parentNode
      }
      return node
    }
    const findSpace = function (start, remove, node, offset) {
      let pos, pos2
      const str = node.nodeValue
      if (typeof offset === 'undefined') {
        offset = start ? str.length : 0
      }
      if (start) {
        pos = str.lastIndexOf(' ', offset)
        pos2 = str.lastIndexOf('\xA0', offset)
        pos = pos > pos2 ? pos : pos2
        if (pos !== -1 && !remove && (pos < offset || !start) && pos <= str.length) {
          pos++
        }
      } else {
        pos = str.indexOf(' ', offset)
        pos2 = str.indexOf('\xA0', offset)
        pos = pos !== -1 && (pos2 === -1 || pos < pos2) ? pos : pos2
      }
      return pos
    }
    const findWordEndPoint = function (dom, body, container, offset, start, remove) {
      let walker, node, pos, lastTextNode
      if (container.nodeType === 3) {
        pos = findSpace(start, remove, container, offset)
        if (pos !== -1) {
          return {
            container,
            offset: pos,
          }
        }
        lastTextNode = container
      }
      walker = new TreeWalker(container, dom.getParent(container, dom.isBlock) || body)
      while (node = walker[start ? 'prev' : 'next']()) {
        if (node.nodeType === 3 && !isBookmarkNode$2(node.parentNode)) {
          lastTextNode = node
          pos = findSpace(start, remove, node)
          if (pos !== -1) {
            return {
              container: node,
              offset: pos,
            }
          }
        } else if (dom.isBlock(node) || FormatUtils.isEq(node, 'BR')) {
          break
        }
      }
      if (lastTextNode) {
        if (start) {
          offset = 0
        } else {
          offset = lastTextNode.length
        }
        return {
          container: lastTextNode,
          offset,
        }
      }
    }
    const findSelectorEndPoint = function (dom, format, rng, container, siblingName) {
      let parents, i, y, curFormat
      if (container.nodeType === 3 && container.nodeValue.length === 0 && container[siblingName]) {
        container = container[siblingName]
      }
      parents = getParents$2(dom, container)
      for (i = 0; i < parents.length; i++) {
        for (y = 0; y < format.length; y++) {
          curFormat = format[y]
          if ('collapsed' in curFormat && curFormat.collapsed !== rng.collapsed) {
            continue
          }
          if (dom.is(parents[i], curFormat.selector)) {
            return parents[i]
          }
        }
      }
      return container
    }
    const findBlockEndPoint = function (editor, format, container, siblingName) {
      let node
      const { dom } = editor
      const root = dom.getRoot()
      if (!format[0].wrapper) {
        node = dom.getParent(container, format[0].block, root)
      }
      if (!node) {
        const scopeRoot = dom.getParent(container, 'LI,TD,TH')
        node = dom.getParent(container.nodeType === 3 ? container.parentNode : container, (node) => node !== root && isTextBlock$2(editor, node), scopeRoot)
      }
      if (node && format[0].wrapper) {
        node = getParents$2(dom, node, 'ul,ol').reverse()[0] || node
      }
      if (!node) {
        node = container
        while (node[siblingName] && !dom.isBlock(node[siblingName])) {
          node = node[siblingName]
          if (FormatUtils.isEq(node, 'br')) {
            break
          }
        }
      }
      return node || container
    }
    const findParentContainer = function (dom, format, startContainer, startOffset, endContainer, endOffset, start) {
      let container, parent, sibling, siblingName, root
      container = parent = start ? startContainer : endContainer
      siblingName = start ? 'previousSibling' : 'nextSibling'
      root = dom.getRoot()
      if (container.nodeType === 3 && !isWhiteSpaceNode$1(container)) {
        if (start ? startOffset > 0 : endOffset < container.nodeValue.length) {
          return container
        }
      }
      while (true) {
        if (!format[0].block_expand && dom.isBlock(parent)) {
          return parent
        }
        for (sibling = parent[siblingName]; sibling; sibling = sibling[siblingName]) {
          if (!isBookmarkNode$2(sibling) && !isWhiteSpaceNode$1(sibling) && !isBogusBr(sibling)) {
            return parent
          }
        }
        if (parent === root || parent.parentNode === root) {
          container = parent
          break
        }
        parent = parent.parentNode
      }
      return container
    }
    const expandRng = function (editor, rng, format, remove) {
      let endPoint; let { startContainer } = rng; let { startOffset } = rng; let { endContainer } = rng; let { endOffset } = rng
      const { dom } = editor
      if (startContainer.nodeType === 1 && startContainer.hasChildNodes()) {
        startContainer = getNode(startContainer, startOffset)
        if (startContainer.nodeType === 3) {
          startOffset = 0
        }
      }
      if (endContainer.nodeType === 1 && endContainer.hasChildNodes()) {
        endContainer = getNode(endContainer, rng.collapsed ? endOffset : endOffset - 1)
        if (endContainer.nodeType === 3) {
          endOffset = endContainer.nodeValue.length
        }
      }
      startContainer = findParentContentEditable(dom, startContainer)
      endContainer = findParentContentEditable(dom, endContainer)
      if (isBookmarkNode$2(startContainer.parentNode) || isBookmarkNode$2(startContainer)) {
        startContainer = isBookmarkNode$2(startContainer) ? startContainer : startContainer.parentNode
        if (rng.collapsed) {
          startContainer = startContainer.previousSibling || startContainer
        } else {
          startContainer = startContainer.nextSibling || startContainer
        }
        if (startContainer.nodeType === 3) {
          startOffset = rng.collapsed ? startContainer.length : 0
        }
      }
      if (isBookmarkNode$2(endContainer.parentNode) || isBookmarkNode$2(endContainer)) {
        endContainer = isBookmarkNode$2(endContainer) ? endContainer : endContainer.parentNode
        if (rng.collapsed) {
          endContainer = endContainer.nextSibling || endContainer
        } else {
          endContainer = endContainer.previousSibling || endContainer
        }
        if (endContainer.nodeType === 3) {
          endOffset = rng.collapsed ? 0 : endContainer.length
        }
      }
      if (rng.collapsed) {
        endPoint = findWordEndPoint(dom, editor.getBody(), startContainer, startOffset, true, remove)
        if (endPoint) {
          startContainer = endPoint.container
          startOffset = endPoint.offset
        }
        endPoint = findWordEndPoint(dom, editor.getBody(), endContainer, endOffset, false, remove)
        if (endPoint) {
          endContainer = endPoint.container
          endOffset = endPoint.offset
        }
      }
      if (format[0].inline) {
        endContainer = remove ? endContainer : excludeTrailingWhitespace(endContainer, endOffset)
      }
      if (format[0].inline || format[0].block_expand) {
        if (!format[0].inline || (startContainer.nodeType !== 3 || startOffset === 0)) {
          startContainer = findParentContainer(dom, format, startContainer, startOffset, endContainer, endOffset, true)
        }
        if (!format[0].inline || (endContainer.nodeType !== 3 || endOffset === endContainer.nodeValue.length)) {
          endContainer = findParentContainer(dom, format, startContainer, startOffset, endContainer, endOffset, false)
        }
      }
      if (format[0].selector && format[0].expand !== false && !format[0].inline) {
        startContainer = findSelectorEndPoint(dom, format, rng, startContainer, 'previousSibling')
        endContainer = findSelectorEndPoint(dom, format, rng, endContainer, 'nextSibling')
      }
      if (format[0].block || format[0].selector) {
        startContainer = findBlockEndPoint(editor, format, startContainer, 'previousSibling')
        endContainer = findBlockEndPoint(editor, format, endContainer, 'nextSibling')
        if (format[0].block) {
          if (!dom.isBlock(startContainer)) {
            startContainer = findParentContainer(dom, format, startContainer, startOffset, endContainer, endOffset, true)
          }
          if (!dom.isBlock(endContainer)) {
            endContainer = findParentContainer(dom, format, startContainer, startOffset, endContainer, endOffset, false)
          }
        }
      }
      if (startContainer.nodeType === 1) {
        startOffset = dom.nodeIndex(startContainer)
        startContainer = startContainer.parentNode
      }
      if (endContainer.nodeType === 1) {
        endOffset = dom.nodeIndex(endContainer) + 1
        endContainer = endContainer.parentNode
      }
      return {
        startContainer,
        startOffset,
        endContainer,
        endOffset,
      }
    }
    const ExpandRange = { expandRng }

    const each$8 = Tools.each
    const getEndChild = function (container, index) {
      const { childNodes } = container
      index--
      if (index > childNodes.length - 1) {
        index = childNodes.length - 1
      } else if (index < 0) {
        index = 0
      }
      return childNodes[index] || container
    }
    const walk$1 = function (dom, rng, callback) {
      let { startContainer } = rng
      const { startOffset } = rng
      let { endContainer } = rng
      const { endOffset } = rng
      let ancestor
      let startPoint
      let endPoint
      let node
      let parent
      let siblings
      let nodes
      nodes = dom.select('td[data-mce-selected],th[data-mce-selected]')
      if (nodes.length > 0) {
        each$8(nodes, (node) => {
          callback([node])
        })
        return
      }
      const exclude = function (nodes) {
        let node
        node = nodes[0]
        if (node.nodeType === 3 && node === startContainer && startOffset >= node.nodeValue.length) {
          nodes.splice(0, 1)
        }
        node = nodes[nodes.length - 1]
        if (endOffset === 0 && nodes.length > 0 && node === endContainer && node.nodeType === 3) {
          nodes.splice(nodes.length - 1, 1)
        }
        return nodes
      }
      const collectSiblings = function (node, name, endNode) {
        const siblings = []
        for (; node && node !== endNode; node = node[name]) {
          siblings.push(node)
        }
        return siblings
      }
      const findEndPoint = function (node, root) {
        do {
          if (node.parentNode === root) {
            return node
          }
          node = node.parentNode
        } while (node)
      }
      const walkBoundary = function (startNode, endNode, next) {
        const siblingName = next ? 'nextSibling' : 'previousSibling'
        for (node = startNode, parent = node.parentNode; node && node !== endNode; node = parent) {
          parent = node.parentNode
          siblings = collectSiblings(node === startNode ? node : node[siblingName], siblingName)
          if (siblings.length) {
            if (!next) {
              siblings.reverse()
            }
            callback(exclude(siblings))
          }
        }
      }
      if (startContainer.nodeType === 1 && startContainer.hasChildNodes()) {
        startContainer = startContainer.childNodes[startOffset]
      }
      if (endContainer.nodeType === 1 && endContainer.hasChildNodes()) {
        endContainer = getEndChild(endContainer, endOffset)
      }
      if (startContainer === endContainer) {
        return callback(exclude([startContainer]))
      }
      ancestor = dom.findCommonAncestor(startContainer, endContainer)
      for (node = startContainer; node; node = node.parentNode) {
        if (node === endContainer) {
          return walkBoundary(startContainer, ancestor, true)
        }
        if (node === ancestor) {
          break
        }
      }
      for (node = endContainer; node; node = node.parentNode) {
        if (node === startContainer) {
          return walkBoundary(endContainer, ancestor)
        }
        if (node === ancestor) {
          break
        }
      }
      startPoint = findEndPoint(startContainer, ancestor) || startContainer
      endPoint = findEndPoint(endContainer, ancestor) || endContainer
      walkBoundary(startContainer, startPoint, true)
      siblings = collectSiblings(startPoint === startContainer ? startPoint : startPoint.nextSibling, 'nextSibling', endPoint === endContainer ? endPoint.nextSibling : endPoint)
      if (siblings.length) {
        callback(exclude(siblings))
      }
      walkBoundary(endContainer, endPoint)
    }
    const RangeWalk = { walk: walk$1 }

    const zeroWidth = function () {
      return '\uFEFF'
    }

    function NodeValue(is, name) {
      const get = function (element) {
        if (!is(element)) {
          throw new Error(`Can only get ${name} value of a ${name} node`)
        }
        return getOption(element).getOr('')
      }
      const getOptionIE10 = function (element) {
        try {
          return getOptionSafe(element)
        } catch (e) {
          return Option.none()
        }
      }
      var getOptionSafe = function (element) {
        return is(element) ? Option.from(element.dom().nodeValue) : Option.none()
      }
      const { browser } = PlatformDetection$1.detect()
      var getOption = browser.isIE() && browser.version.major === 10 ? getOptionIE10 : getOptionSafe
      const set = function (element, value) {
        if (!is(element)) {
          throw new Error(`Can only set raw ${name} value of a ${name} node`)
        }
        element.dom().nodeValue = value
      }
      return {
        get,
        getOption,
        set,
      }
    }

    const api = NodeValue(isText, 'text')
    const get$6 = function (element) {
      return api.get(element)
    }

    const isZeroWidth = function (elem) {
      return isText(elem) && get$6(elem) === zeroWidth()
    }
    const context = function (editor, elem, wrapName, nodeName) {
      return parent(elem).fold(() => 'skipping', (parent$$1) => {
        if (nodeName === 'br' || isZeroWidth(elem)) {
          return 'valid'
        } if (isAnnotation(elem)) {
          return 'existing'
        } if (isCaretNode(elem)) {
          return 'caret'
        } if (!FormatUtils.isValid(editor, wrapName, nodeName) || !FormatUtils.isValid(editor, name(parent$$1), wrapName)) {
          return 'invalid-child'
        }
        return 'valid'
      })
    }

    const shouldApplyToTrailingSpaces = function (rng) {
      return rng.startContainer.nodeType === 3 && rng.startContainer.nodeValue.length >= rng.startOffset && rng.startContainer.nodeValue[rng.startOffset] === '\xA0'
    }
    const applyWordGrab = function (editor, rng) {
      const r = ExpandRange.expandRng(editor, rng, [{ inline: true }], shouldApplyToTrailingSpaces(rng))
      rng.setStart(r.startContainer, r.startOffset)
      rng.setEnd(r.endContainer, r.endOffset)
      editor.selection.setRng(rng)
    }
    const makeAnnotation = function (eDoc, _a, annotationName, decorate) {
      const _b = _a.uid; const uid = _b === void 0 ? generate('mce-annotation') : _b; const data = __rest(_a, ['uid'])
      const master = Element$$1.fromTag('span', eDoc)
      add$3(master, annotation())
      set(master, `${dataAnnotationId()}`, uid)
      set(master, `${dataAnnotation()}`, annotationName)
      const _c = decorate(uid, data); const _d = _c.attributes; const attributes = _d === void 0 ? {} : _d; const _e = _c.classes; const classes = _e === void 0 ? [] : _e
      setAll(master, attributes)
      add$4(master, classes)
      return master
    }
    const annotate = function (editor, rng, annotationName, decorate, data) {
      const newWrappers = []
      const master = makeAnnotation(editor.getDoc(), data, annotationName, decorate)
      const wrapper = Cell(Option.none())
      const finishWrapper = function () {
        wrapper.set(Option.none())
      }
      const getOrOpenWrapper = function () {
        return wrapper.get().getOrThunk(() => {
          const nu = shallow(master)
          newWrappers.push(nu)
          wrapper.set(Option.some(nu))
          return nu
        })
      }
      const processElements = function (elems) {
        each(elems, processElement)
      }
      var processElement = function (elem) {
        const ctx = context(editor, elem, 'span', name(elem))
        switch (ctx) {
          case 'invalid-child': {
            finishWrapper()
            const children$$1 = children(elem)
            processElements(children$$1)
            finishWrapper()
            break
          }
          case 'valid': {
            const w = getOrOpenWrapper()
            wrap$1(elem, w)
            break
          }
          case 'skipping':
          case 'existing':
          case 'caret':
        }
      }
      const processNodes = function (nodes) {
        const elems = map(nodes, Element$$1.fromDom)
        processElements(elems)
      }
      RangeWalk.walk(editor.dom, rng, (nodes) => {
        finishWrapper()
        processNodes(nodes)
      })
      return newWrappers
    }
    const annotateWithBookmark = function (editor, name$$1, settings, data) {
      editor.undoManager.transact(() => {
        const initialRng = editor.selection.getRng()
        if (initialRng.collapsed) {
          applyWordGrab(editor, initialRng)
        }
        if (editor.selection.getRng().collapsed) {
          const wrapper = makeAnnotation(editor.getDoc(), data, name$$1, settings.decorate)
          set$2(wrapper, '\xA0')
          editor.selection.getRng().insertNode(wrapper.dom())
          editor.selection.select(wrapper.dom())
        } else {
          const bookmark = GetBookmark.getPersistentBookmark(editor.selection, false)
          const rng = editor.selection.getRng()
          annotate(editor, rng, name$$1, settings.decorate, data)
          editor.selection.moveToBookmark(bookmark)
        }
      })
    }

    function Annotator(editor) {
      const registry = create$1()
      setup$1(editor, registry)
      const changes = setup(editor, registry)
      return {
        register(name, settings) {
          registry.register(name, settings)
        },
        annotate(name, data) {
          registry.lookup(name).each((settings) => {
            annotateWithBookmark(editor, name, settings, data)
          })
        },
        annotationChanged(name, callback) {
          changes.addListener(name, callback)
        },
        remove(name) {
          identify(editor, Option.some(name)).each((_a) => {
            const { elements } = _a
            each(elements, unwrap)
          })
        },
        getAll(name) {
          const directory = findAll(editor, name)
          return map$2(directory, (elems) => map(elems, (elem) => elem.dom()))
        },
      }
    }

    const hasOwnProperty$2 = Object.prototype.hasOwnProperty
    const shallow$1 = function (old, nu) {
      return nu
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
            if (hasOwnProperty$2.call(curObject, key)) {
              ret[key] = merger(ret[key], curObject[key])
            }
          }
        }
        return ret
      }
    }
    const merge = baseMerge(shallow$1)

    const create$3 = function () {
      const buttons = {}
      const menuItems = {}
      const popups = {}
      const icons = {}
      const contextMenus = {}
      const contextToolbars = {}
      const add = function (collection, type) {
        return function (name, spec) {
          return collection[name.toLowerCase()] = merge({ type }, spec)
        }
      }
      const addIcon = function (name, svgData) {
        return icons[name.toLowerCase()] = svgData
      }
      return {
        addButton: add(buttons, 'button'),
        addToggleButton: add(buttons, 'togglebutton'),
        addMenuButton: add(buttons, 'menubutton'),
        addSplitButton: add(buttons, 'splitbutton'),
        addMenuItem: add(menuItems, 'menuitem'),
        addNestedMenuItem: add(menuItems, 'nestedmenuitem'),
        addToggleMenuItem: add(menuItems, 'togglemenuitem'),
        addAutocompleter: add(popups, 'autocompleter'),
        addContextMenu: add(contextMenus, 'contextmenu'),
        addContextToolbar: add(contextToolbars, 'contexttoolbar'),
        addContextForm: add(contextToolbars, 'contextform'),
        addIcon,
        getAll() {
          return {
            buttons,
            menuItems,
            icons,
            popups,
            contextMenus,
            contextToolbars,
          }
        },
      }
    }

    const whiteSpaceRegExp$3 = /^[ \t\r\n]*$/
    const typeLookup = {
      '#text': 3,
      '#comment': 8,
      '#cdata': 4,
      '#pi': 7,
      '#doctype': 10,
      '#document-fragment': 11,
    }
    const walk$2 = function (node, root, prev) {
      let sibling
      let parent
      const startName = prev ? 'lastChild' : 'firstChild'
      const siblingName = prev ? 'prev' : 'next'
      if (node[startName]) {
        return node[startName]
      }
      if (node !== root) {
        sibling = node[siblingName]
        if (sibling) {
          return sibling
        }
        for (parent = node.parent; parent && parent !== root; parent = parent.parent) {
          sibling = parent[siblingName]
          if (sibling) {
            return sibling
          }
        }
      }
    }
    const Node$2 = (function () {
      function Node(name, type) {
        this.name = name
        this.type = type
        if (type === 1) {
          this.attributes = []
          this.attributes.map = {}
        }
      }
      Node.create = function (name, attrs) {
        let node, attrName
        node = new Node(name, typeLookup[name] || 1)
        if (attrs) {
          for (attrName in attrs) {
            node.attr(attrName, attrs[attrName])
          }
        }
        return node
      }
      Node.prototype.replace = function (node) {
        const self = this
        if (node.parent) {
          node.remove()
        }
        self.insert(node, self)
        self.remove()
        return self
      }
      Node.prototype.attr = function (name, value) {
        const self = this
        let attrs, i
        if (typeof name !== 'string') {
          for (i in name) {
            self.attr(i, name[i])
          }
          return self
        }
        if (attrs = self.attributes) {
          if (value !== undefined) {
            if (value === null) {
              if (name in attrs.map) {
                delete attrs.map[name]
                i = attrs.length
                while (i--) {
                  if (attrs[i].name === name) {
                    attrs = attrs.splice(i, 1)
                    return self
                  }
                }
              }
              return self
            }
            if (name in attrs.map) {
              i = attrs.length
              while (i--) {
                if (attrs[i].name === name) {
                  attrs[i].value = value
                  break
                }
              }
            } else {
              attrs.push({
                name,
                value,
              })
            }
            attrs.map[name] = value
            return self
          }
          return attrs.map[name]
        }
      }
      Node.prototype.clone = function () {
        const self = this
        const clone = new Node(self.name, self.type)
        let i, l, selfAttrs, selfAttr, cloneAttrs
        if (selfAttrs = self.attributes) {
          cloneAttrs = []
          cloneAttrs.map = {}
          for (i = 0, l = selfAttrs.length; i < l; i++) {
            selfAttr = selfAttrs[i]
            if (selfAttr.name !== 'id') {
              cloneAttrs[cloneAttrs.length] = {
                name: selfAttr.name,
                value: selfAttr.value,
              }
              cloneAttrs.map[selfAttr.name] = selfAttr.value
            }
          }
          clone.attributes = cloneAttrs
        }
        clone.value = self.value
        clone.shortEnded = self.shortEnded
        return clone
      }
      Node.prototype.wrap = function (wrapper) {
        const self = this
        self.parent.insert(wrapper, self)
        wrapper.append(self)
        return self
      }
      Node.prototype.unwrap = function () {
        const self = this
        let node, next
        for (node = self.firstChild; node;) {
          next = node.next
          self.insert(node, self, true)
          node = next
        }
        self.remove()
      }
      Node.prototype.remove = function () {
        const self = this; const { parent } = self; const { next } = self; const { prev } = self
        if (parent) {
          if (parent.firstChild === self) {
            parent.firstChild = next
            if (next) {
              next.prev = null
            }
          } else {
            prev.next = next
          }
          if (parent.lastChild === self) {
            parent.lastChild = prev
            if (prev) {
              prev.next = null
            }
          } else {
            next.prev = prev
          }
          self.parent = self.next = self.prev = null
        }
        return self
      }
      Node.prototype.append = function (node) {
        const self = this
        let last
        if (node.parent) {
          node.remove()
        }
        last = self.lastChild
        if (last) {
          last.next = node
          node.prev = last
          self.lastChild = node
        } else {
          self.lastChild = self.firstChild = node
        }
        node.parent = self
        return node
      }
      Node.prototype.insert = function (node, refNode, before) {
        let parent
        if (node.parent) {
          node.remove()
        }
        parent = refNode.parent || this
        if (before) {
          if (refNode === parent.firstChild) {
            parent.firstChild = node
          } else {
            refNode.prev.next = node
          }
          node.prev = refNode.prev
          node.next = refNode
          refNode.prev = node
        } else {
          if (refNode === parent.lastChild) {
            parent.lastChild = node
          } else {
            refNode.next.prev = node
          }
          node.next = refNode.next
          node.prev = refNode
          refNode.next = node
        }
        node.parent = parent
        return node
      }
      Node.prototype.getAll = function (name) {
        const self = this
        let node
        const collection = []
        for (node = self.firstChild; node; node = walk$2(node, self)) {
          if (node.name === name) {
            collection.push(node)
          }
        }
        return collection
      }
      Node.prototype.empty = function () {
        const self = this
        let nodes, i, node
        if (self.firstChild) {
          nodes = []
          for (node = self.firstChild; node; node = walk$2(node, self)) {
            nodes.push(node)
          }
          i = nodes.length
          while (i--) {
            node = nodes[i]
            node.parent = node.firstChild = node.lastChild = node.next = node.prev = null
          }
        }
        self.firstChild = self.lastChild = null
        return self
      }
      Node.prototype.isEmpty = function (elements, whitespace, predicate) {
        const self = this
        let node = self.firstChild; let i; let name
        whitespace = whitespace || {}
        if (node) {
          do {
            if (node.type === 1) {
              if (node.attributes.map['data-mce-bogus']) {
                continue
              }
              if (elements[node.name]) {
                return false
              }
              i = node.attributes.length
              while (i--) {
                name = node.attributes[i].name
                if (name === 'name' || name.indexOf('data-mce-bookmark') === 0) {
                  return false
                }
              }
            }
            if (node.type === 8) {
              return false
            }
            if (node.type === 3 && !whiteSpaceRegExp$3.test(node.value)) {
              return false
            }
            if (node.type === 3 && node.parent && whitespace[node.parent.name] && whiteSpaceRegExp$3.test(node.value)) {
              return false
            }
            if (predicate && predicate(node)) {
              return false
            }
          } while (node = walk$2(node, self))
        }
        return true
      }
      Node.prototype.walk = function (prev) {
        return walk$2(this, null, prev)
      }
      return Node
    }())

    const isValidPrefixAttrName = function (name) {
      return name.indexOf('data-') === 0 || name.indexOf('aria-') === 0
    }
    const trimComments = function (text) {
      return text.replace(/<!--|-->/g, '')
    }
    const isInvalidUri = function (settings, uri) {
      if (settings.allow_html_data_urls) {
        return false
      } if (/^data:image\//i.test(uri)) {
        return settings.allow_svg_data_urls === false && /^data:image\/svg\+xml/i.test(uri)
      }
      return /^data:/i.test(uri)
    }
    const findEndTagIndex = function (schema, html, startIndex) {
      let count = 1; let index; let matches; let tokenRegExp; let shortEndedElements
      shortEndedElements = schema.getShortEndedElements()
      tokenRegExp = /<([!?\/])?([A-Za-z0-9\-_\:\.]+)((?:\s+[^"\'>]+(?:(?:"[^"]*")|(?:\'[^\']*\')|[^>]*))*|\/|\s+)>/g
      tokenRegExp.lastIndex = index = startIndex
      while (matches = tokenRegExp.exec(html)) {
        index = tokenRegExp.lastIndex
        if (matches[1] === '/') {
          count--
        } else if (!matches[1]) {
          if (matches[2] in shortEndedElements) {
            continue
          }
          count++
        }
        if (count === 0) {
          break
        }
      }
      return index
    }
    function SaxParser(settings, schema) {
      if (schema === void 0) {
        schema = Schema()
      }
      const noop = function () {
      }
      settings = settings || {}
      if (settings.fix_self_closing !== false) {
        settings.fix_self_closing = true
      }
      const comment = settings.comment ? settings.comment : noop
      const cdata = settings.cdata ? settings.cdata : noop
      const text = settings.text ? settings.text : noop
      const start = settings.start ? settings.start : noop
      const end = settings.end ? settings.end : noop
      const pi = settings.pi ? settings.pi : noop
      const doctype = settings.doctype ? settings.doctype : noop
      const parse = function (html) {
        let matches; let index = 0; let value; let endRegExp
        const stack = []
        let attrList, i, textData, name
        let isInternalElement, removeInternalElements, shortEndedElements, fillAttrsMap, isShortEnded
        let validate, elementRule, isValidElement, attr, attribsValue, validAttributesMap, validAttributePatterns
        let attributesRequired, attributesDefault, attributesForced, processHtml
        let anyAttributesRequired; let selfClosing; let tokenRegExp; let attrRegExp; let specialElements; let attrValue; let idCount = 0
        const { decode } = Entities
        let fixSelfClosing
        const filteredUrlAttrs = Tools.makeMap('src,href,data,background,formaction,poster,xlink:href')
        const scriptUriRegExp = /((java|vb)script|mhtml):/i
        const processEndTag = function (name) {
          let pos, i
          pos = stack.length
          while (pos--) {
            if (stack[pos].name === name) {
              break
            }
          }
          if (pos >= 0) {
            for (i = stack.length - 1; i >= pos; i--) {
              name = stack[i]
              if (name.valid) {
                end(name.name)
              }
            }
            stack.length = pos
          }
        }
        const parseAttribute = function (match, name, value, val2, val3) {
          let attrRule, i
          const trimRegExp = /[\s\u0000-\u001F]+/g
          name = name.toLowerCase()
          value = name in fillAttrsMap ? name : decode(value || val2 || val3 || '')
          if (validate && !isInternalElement && isValidPrefixAttrName(name) === false) {
            attrRule = validAttributesMap[name]
            if (!attrRule && validAttributePatterns) {
              i = validAttributePatterns.length
              while (i--) {
                attrRule = validAttributePatterns[i]
                if (attrRule.pattern.test(name)) {
                  break
                }
              }
              if (i === -1) {
                attrRule = null
              }
            }
            if (!attrRule) {
              return
            }
            if (attrRule.validValues && !(value in attrRule.validValues)) {
              return
            }
          }
          if (filteredUrlAttrs[name] && !settings.allow_script_urls) {
            let uri = value.replace(trimRegExp, '')
            try {
              uri = decodeURIComponent(uri)
            } catch (ex) {
              uri = unescape(uri)
            }
            if (scriptUriRegExp.test(uri)) {
              return
            }
            if (isInvalidUri(settings, uri)) {
              return
            }
          }
          if (isInternalElement && (name in filteredUrlAttrs || name.indexOf('on') === 0)) {
            return
          }
          attrList.map[name] = value
          attrList.push({
            name,
            value,
          })
        }
        tokenRegExp = new RegExp('<(?:' + '(?:!--([\\w\\W]*?)-->)|' + '(?:!\\[CDATA\\[([\\w\\W]*?)\\]\\]>)|' + '(?:!DOCTYPE([\\w\\W]*?)>)|' + '(?:\\?([^\\s\\/<>]+) ?([\\w\\W]*?)[?/]>)|' + '(?:\\/([A-Za-z][A-Za-z0-9\\-_\\:\\.]*)>)|' + '(?:([A-Za-z][A-Za-z0-9\\-_\\:\\.]*)((?:\\s+[^"\'>]+(?:(?:"[^"]*")|(?:\'[^\']*\')|[^>]*))*|\\/|\\s+)>)' + ')', 'g')
        attrRegExp = /([\w:\-]+)(?:\s*=\s*(?:(?:\"((?:[^\"])*)\")|(?:\'((?:[^\'])*)\')|([^>\s]+)))?/g
        shortEndedElements = schema.getShortEndedElements()
        selfClosing = settings.self_closing_elements || schema.getSelfClosingElements()
        fillAttrsMap = schema.getBoolAttrs()
        validate = settings.validate
        removeInternalElements = settings.remove_internals
        fixSelfClosing = settings.fix_self_closing
        specialElements = schema.getSpecialElements()
        processHtml = `${html}>`
        while (matches = tokenRegExp.exec(processHtml)) {
          if (index < matches.index) {
            text(decode(html.substr(index, matches.index - index)))
          }
          if (value = matches[6]) {
            value = value.toLowerCase()
            if (value.charAt(0) === ':') {
              value = value.substr(1)
            }
            processEndTag(value)
          } else if (value = matches[7]) {
            if (matches.index + matches[0].length > html.length) {
              text(decode(html.substr(matches.index)))
              index = matches.index + matches[0].length
              continue
            }
            value = value.toLowerCase()
            if (value.charAt(0) === ':') {
              value = value.substr(1)
            }
            isShortEnded = value in shortEndedElements
            if (fixSelfClosing && selfClosing[value] && stack.length > 0 && stack[stack.length - 1].name === value) {
              processEndTag(value)
            }
            if (!validate || (elementRule = schema.getElementRule(value))) {
              isValidElement = true
              if (validate) {
                validAttributesMap = elementRule.attributes
                validAttributePatterns = elementRule.attributePatterns
              }
              if (attribsValue = matches[8]) {
                isInternalElement = attribsValue.indexOf('data-mce-type') !== -1
                if (isInternalElement && removeInternalElements) {
                  isValidElement = false
                }
                attrList = []
                attrList.map = {}
                attribsValue.replace(attrRegExp, parseAttribute)
              } else {
                attrList = []
                attrList.map = {}
              }
              if (validate && !isInternalElement) {
                attributesRequired = elementRule.attributesRequired
                attributesDefault = elementRule.attributesDefault
                attributesForced = elementRule.attributesForced
                anyAttributesRequired = elementRule.removeEmptyAttrs
                if (anyAttributesRequired && !attrList.length) {
                  isValidElement = false
                }
                if (attributesForced) {
                  i = attributesForced.length
                  while (i--) {
                    attr = attributesForced[i]
                    name = attr.name
                    attrValue = attr.value
                    if (attrValue === '{$uid}') {
                      attrValue = `mce_${idCount++}`
                    }
                    attrList.map[name] = attrValue
                    attrList.push({
                      name,
                      value: attrValue,
                    })
                  }
                }
                if (attributesDefault) {
                  i = attributesDefault.length
                  while (i--) {
                    attr = attributesDefault[i]
                    name = attr.name
                    if (!(name in attrList.map)) {
                      attrValue = attr.value
                      if (attrValue === '{$uid}') {
                        attrValue = `mce_${idCount++}`
                      }
                      attrList.map[name] = attrValue
                      attrList.push({
                        name,
                        value: attrValue,
                      })
                    }
                  }
                }
                if (attributesRequired) {
                  i = attributesRequired.length
                  while (i--) {
                    if (attributesRequired[i] in attrList.map) {
                      break
                    }
                  }
                  if (i === -1) {
                    isValidElement = false
                  }
                }
                if (attr = attrList.map['data-mce-bogus']) {
                  if (attr === 'all') {
                    index = findEndTagIndex(schema, html, tokenRegExp.lastIndex)
                    tokenRegExp.lastIndex = index
                    continue
                  }
                  isValidElement = false
                }
              }
              if (isValidElement) {
                start(value, attrList, isShortEnded)
              }
            } else {
              isValidElement = false
            }
            if (endRegExp = specialElements[value]) {
              endRegExp.lastIndex = index = matches.index + matches[0].length
              if (matches = endRegExp.exec(html)) {
                if (isValidElement) {
                  textData = html.substr(index, matches.index - index)
                }
                index = matches.index + matches[0].length
              } else {
                textData = html.substr(index)
                index = html.length
              }
              if (isValidElement) {
                if (textData.length > 0) {
                  text(textData, true)
                }
                end(value)
              }
              tokenRegExp.lastIndex = index
              continue
            }
            if (!isShortEnded) {
              if (!attribsValue || attribsValue.indexOf('/') !== attribsValue.length - 1) {
                stack.push({
                  name: value,
                  valid: isValidElement,
                })
              } else if (isValidElement) {
                end(value)
              }
            }
          } else if (value = matches[1]) {
            if (value.charAt(0) === '>') {
              value = ` ${value}`
            }
            if (!settings.allow_conditional_comments && value.substr(0, 3).toLowerCase() === '[if') {
              value = ` ${value}`
            }
            comment(value)
          } else if (value = matches[2]) {
            cdata(trimComments(value))
          } else if (value = matches[3]) {
            doctype(value)
          } else if (value = matches[4]) {
            pi(value, matches[5])
          }
          index = matches.index + matches[0].length
        }
        if (index < html.length) {
          text(decode(html.substr(index)))
        }
        for (i = stack.length - 1; i >= 0; i--) {
          value = stack[i]
          if (value.valid) {
            end(value.name)
          }
        }
      }
      return { parse }
    }
    (function (SaxParser) {
      SaxParser.findEndTag = findEndTagIndex
    }(SaxParser || (SaxParser = {})))
    const SaxParser$1 = SaxParser

    const trimHtml = function (tempAttrs, html) {
      const trimContentRegExp = new RegExp([`\\s?(${tempAttrs.join('|')})="[^"]+"`].join('|'), 'gi')
      return html.replace(trimContentRegExp, '')
    }
    const trimInternal = function (serializer, html) {
      let content = html
      const bogusAllRegExp = /<(\w+) [^>]*data-mce-bogus="all"[^>]*>/g
      let endTagIndex, index, matchLength, matches, shortEndedElements
      const { schema } = serializer
      content = trimHtml(serializer.getTempAttrs(), content)
      shortEndedElements = schema.getShortEndedElements()
      while (matches = bogusAllRegExp.exec(content)) {
        index = bogusAllRegExp.lastIndex
        matchLength = matches[0].length
        if (shortEndedElements[matches[1]]) {
          endTagIndex = index
        } else {
          endTagIndex = SaxParser$1.findEndTag(schema, content, index)
        }
        content = content.substring(0, index - matchLength) + content.substring(endTagIndex)
        bogusAllRegExp.lastIndex = index - matchLength
      }
      return Zwsp.trim(content)
    }
    const trimExternal = trimInternal
    const TrimHtml = {
      trimExternal,
      trimInternal,
    }

    const getBodySetting = function (editor, name, defaultValue) {
      const value = editor.getParam(name, defaultValue)
      if (value.indexOf('=') !== -1) {
        const bodyObj = editor.getParam(name, '', 'hash')
        return bodyObj.hasOwnProperty(editor.id) ? bodyObj[editor.id] : defaultValue
      }
      return value
    }
    const getIframeAttrs = function (editor) {
      return editor.getParam('iframe_attrs', {})
    }
    const getDocType = function (editor) {
      return editor.getParam('doctype', '<!DOCTYPE html>')
    }
    const getDocumentBaseUrl = function (editor) {
      return editor.getParam('document_base_url', '')
    }
    const getBodyId = function (editor) {
      return getBodySetting(editor, 'body_id', 'tinymce')
    }
    const getBodyClass = function (editor) {
      return getBodySetting(editor, 'body_class', '')
    }
    const getContentSecurityPolicy = function (editor) {
      return editor.getParam('content_security_policy', '')
    }
    const shouldPutBrInPre = function (editor) {
      return editor.getParam('br_in_pre', true)
    }
    const getForcedRootBlock = function (editor) {
      if (editor.getParam('force_p_newlines', false)) {
        return 'p'
      }
      const block = editor.getParam('forced_root_block', 'p')
      if (block === false) {
        return ''
      } if (block === true) {
        return 'p'
      }
      return block
    }
    const getForcedRootBlockAttrs = function (editor) {
      return editor.getParam('forced_root_block_attrs', {})
    }
    const getBrNewLineSelector = function (editor) {
      return editor.getParam('br_newline_selector', '.mce-toc h2,figcaption,caption')
    }
    const getNoNewLineSelector = function (editor) {
      return editor.getParam('no_newline_selector', '')
    }
    const shouldKeepStyles = function (editor) {
      return editor.getParam('keep_styles', true)
    }
    const shouldEndContainerOnEmptyBlock = function (editor) {
      return editor.getParam('end_container_on_empty_block', false)
    }
    const getFontStyleValues = function (editor) {
      return Tools.explode(editor.getParam('font_size_style_values', ''))
    }
    const getFontSizeClasses = function (editor) {
      return Tools.explode(editor.getParam('font_size_classes', ''))
    }
    const getImagesDataImgFilter = function (editor) {
      return editor.getParam('images_dataimg_filter', constant(true), 'function')
    }
    const isAutomaticUploadsEnabled = function (editor) {
      return editor.getParam('automatic_uploads', true, 'boolean')
    }
    const shouldReuseFileName = function (editor) {
      return editor.getParam('images_reuse_filename', false, 'boolean')
    }
    const shouldReplaceBlobUris = function (editor) {
      return editor.getParam('images_replace_blob_uris', true, 'boolean')
    }
    const getImageUploadUrl = function (editor) {
      return editor.getParam('images_upload_url', '', 'string')
    }
    const getImageUploadBasePath = function (editor) {
      return editor.getParam('images_upload_base_path', '', 'string')
    }
    const getImagesUploadCredentials = function (editor) {
      return editor.getParam('images_upload_credentials', false, 'boolean')
    }
    const getImagesUploadHandler = function (editor) {
      return editor.getParam('images_upload_handler', null, 'function')
    }
    const shouldUseContentCssCors = function (editor) {
      return editor.getParam('content_css_cors', false, 'boolean')
    }
    const getLanguageCode = function (editor) {
      return editor.getParam('language', 'en', 'string')
    }
    const getLanguageUrl = function (editor) {
      return editor.getParam('language_url', '', 'string')
    }
    const shouldIndentUseMargin = function (editor) {
      return editor.getParam('indent_use_margin', false)
    }
    const getIndentation = function (editor) {
      return editor.getParam('indentation', '40px', 'string')
    }
    const getContentCss = function (editor) {
      const contentCss = editor.settings.content_css
      if (isString(contentCss)) {
        return map(contentCss.split(','), trim$2)
      } if (isArray(contentCss)) {
        return contentCss
      } if (contentCss === false) {
        return []
      }
      return ['default']
    }
    const Settings = {
      getIframeAttrs,
      getDocType,
      getDocumentBaseUrl,
      getBodyId,
      getBodyClass,
      getContentSecurityPolicy,
      shouldPutBrInPre,
      getForcedRootBlock,
      getForcedRootBlockAttrs,
      getBrNewLineSelector,
      getNoNewLineSelector,
      shouldKeepStyles,
      shouldEndContainerOnEmptyBlock,
      getFontStyleValues,
      getFontSizeClasses,
      getImagesDataImgFilter,
      isAutomaticUploadsEnabled,
      shouldReuseFileName,
      shouldReplaceBlobUris,
      getImageUploadUrl,
      getImageUploadBasePath,
      getImagesUploadCredentials,
      getImagesUploadHandler,
      shouldUseContentCssCors,
      getLanguageCode,
      getLanguageUrl,
      shouldIndentUseMargin,
      getIndentation,
      getContentCss,
    }

    const defaultFormat = 'html'
    const trimEmptyContents = function (editor, html) {
      const blockName = Settings.getForcedRootBlock(editor)
      const emptyRegExp = new RegExp(`^(<${blockName}[^>]*>(&nbsp;|&#160;|\\s|\xA0|<br \\/>|)<\\/${blockName}>[\r\n]*|<br \\/>[\r\n]*)$`)
      return html.replace(emptyRegExp, '')
    }
    const getContentFromBody = function (editor, args, body) {
      let content
      args.format = args.format ? args.format : defaultFormat
      args.get = true
      args.getInner = true
      if (!args.no_events) {
        editor.fire('BeforeGetContent', args)
      }
      if (args.format === 'raw') {
        content = Tools.trim(TrimHtml.trimExternal(editor.serializer, body.innerHTML))
      } else if (args.format === 'text') {
        content = Zwsp.trim(body.innerText || body.textContent)
      } else if (args.format === 'tree') {
        return editor.serializer.serialize(body, args)
      } else {
        content = trimEmptyContents(editor, editor.serializer.serialize(body, args))
      }
      if (args.format !== 'text' && !isWsPreserveElement(Element$$1.fromDom(body))) {
        args.content = Tools.trim(content)
      } else {
        args.content = content
      }
      if (!args.no_events) {
        editor.fire('GetContent', args)
      }
      return args.content
    }
    const getContent = function (editor, args) {
      if (args === void 0) {
        args = {}
      }
      return Option.from(editor.getBody()).fold(constant(args.format === 'tree' ? new Node$2('body', 11) : ''), (body) => getContentFromBody(editor, args, body))
    }

    const makeMap$3 = Tools.makeMap
    function Writer(settings) {
      const html = []
      let indent, indentBefore, indentAfter, encode, htmlOutput
      settings = settings || {}
      indent = settings.indent
      indentBefore = makeMap$3(settings.indent_before || '')
      indentAfter = makeMap$3(settings.indent_after || '')
      encode = Entities.getEncodeFunc(settings.entity_encoding || 'raw', settings.entities)
      htmlOutput = settings.element_format === 'html'
      return {
        start(name, attrs, empty) {
          let i, l, attr, value
          if (indent && indentBefore[name] && html.length > 0) {
            value = html[html.length - 1]
            if (value.length > 0 && value !== '\n') {
              html.push('\n')
            }
          }
          html.push('<', name)
          if (attrs) {
            for (i = 0, l = attrs.length; i < l; i++) {
              attr = attrs[i]
              html.push(' ', attr.name, '="', encode(attr.value, true), '"')
            }
          }
          if (!empty || htmlOutput) {
            html[html.length] = '>'
          } else {
            html[html.length] = ' />'
          }
          if (empty && indent && indentAfter[name] && html.length > 0) {
            value = html[html.length - 1]
            if (value.length > 0 && value !== '\n') {
              html.push('\n')
            }
          }
        },
        end(name) {
          let value
          html.push('</', name, '>')
          if (indent && indentAfter[name] && html.length > 0) {
            value = html[html.length - 1]
            if (value.length > 0 && value !== '\n') {
              html.push('\n')
            }
          }
        },
        text(text, raw) {
          if (text.length > 0) {
            html[html.length] = raw ? text : encode(text)
          }
        },
        cdata(text) {
          html.push('<![CDATA[', text, ']]>')
        },
        comment(text) {
          html.push('<!--', text, '-->')
        },
        pi(name, text) {
          if (text) {
            html.push('<?', name, ' ', encode(text), '?>')
          } else {
            html.push('<?', name, '?>')
          }
          if (indent) {
            html.push('\n')
          }
        },
        doctype(text) {
          html.push('<!DOCTYPE', text, '>', indent ? '\n' : '')
        },
        reset() {
          html.length = 0
        },
        getContent() {
          return html.join('').replace(/\n$/, '')
        },
      }
    }

    function Serializer(settings, schema) {
      if (schema === void 0) {
        schema = Schema()
      }
      const writer = Writer(settings)
      settings = settings || {}
      settings.validate = 'validate' in settings ? settings.validate : true
      const serialize = function (node) {
        let handlers, validate
        validate = settings.validate
        handlers = {
          3(node) {
            writer.text(node.value, node.raw)
          },
          8(node) {
            writer.comment(node.value)
          },
          7(node) {
            writer.pi(node.name, node.value)
          },
          10(node) {
            writer.doctype(node.value)
          },
          4(node) {
            writer.cdata(node.value)
          },
          11(node) {
            if (node = node.firstChild) {
              do {
                walk(node)
              } while (node = node.next)
            }
          },
        }
        writer.reset()
        var walk = function (node) {
          const handler = handlers[node.type]
          let name, isEmpty, attrs, attrName, attrValue, sortedAttrs, i, l, elementRule
          if (!handler) {
            name = node.name
            isEmpty = node.shortEnded
            attrs = node.attributes
            if (validate && attrs && attrs.length > 1) {
              sortedAttrs = []
              sortedAttrs.map = {}
              elementRule = schema.getElementRule(node.name)
              if (elementRule) {
                for (i = 0, l = elementRule.attributesOrder.length; i < l; i++) {
                  attrName = elementRule.attributesOrder[i]
                  if (attrName in attrs.map) {
                    attrValue = attrs.map[attrName]
                    sortedAttrs.map[attrName] = attrValue
                    sortedAttrs.push({
                      name: attrName,
                      value: attrValue,
                    })
                  }
                }
                for (i = 0, l = attrs.length; i < l; i++) {
                  attrName = attrs[i].name
                  if (!(attrName in sortedAttrs.map)) {
                    attrValue = attrs.map[attrName]
                    sortedAttrs.map[attrName] = attrValue
                    sortedAttrs.push({
                      name: attrName,
                      value: attrValue,
                    })
                  }
                }
                attrs = sortedAttrs
              }
            }
            writer.start(node.name, attrs, isEmpty)
            if (!isEmpty) {
              if (node = node.firstChild) {
                do {
                  walk(node)
                } while (node = node.next)
              }
              writer.end(name)
            }
          } else {
            handler(node)
          }
        }
        if (node.type === 1 && !settings.inner) {
          walk(node)
        } else {
          handlers[11](node)
        }
        return writer.getContent()
      }
      return { serialize }
    }

    var traverse = function (node, fn) {
      fn(node)
      if (node.firstChild) {
        traverse(node.firstChild, fn)
      }
      if (node.next) {
        traverse(node.next, fn)
      }
    }
    const findMatchingNodes = function (nodeFilters, attributeFilters, node) {
      const nodeMatches = {}
      const attrMatches = {}
      const matches = []
      if (node.firstChild) {
        traverse(node.firstChild, (node) => {
          each(nodeFilters, (filter$$1) => {
            if (filter$$1.name === node.name) {
              if (nodeMatches[filter$$1.name]) {
                nodeMatches[filter$$1.name].nodes.push(node)
              } else {
                nodeMatches[filter$$1.name] = {
                  filter: filter$$1,
                  nodes: [node],
                }
              }
            }
          })
          each(attributeFilters, (filter$$1) => {
            if (typeof node.attr(filter$$1.name) === 'string') {
              if (attrMatches[filter$$1.name]) {
                attrMatches[filter$$1.name].nodes.push(node)
              } else {
                attrMatches[filter$$1.name] = {
                  filter: filter$$1,
                  nodes: [node],
                }
              }
            }
          })
        })
      }
      for (var name in nodeMatches) {
        if (nodeMatches.hasOwnProperty(name)) {
          matches.push(nodeMatches[name])
        }
      }
      for (var name in attrMatches) {
        if (attrMatches.hasOwnProperty(name)) {
          matches.push(attrMatches[name])
        }
      }
      return matches
    }
    const filter$2 = function (nodeFilters, attributeFilters, node) {
      const matches = findMatchingNodes(nodeFilters, attributeFilters, node)
      each(matches, (match) => {
        each(match.filter.callbacks, (callback) => {
          callback(match.nodes, match.filter.name, {})
        })
      })
    }

    const hasFocus = function (element) {
      const doc = owner(element).dom()
      return element.dom() === doc.activeElement
    }
    const active = function (_DOC) {
      const doc = _DOC !== undefined ? _DOC.dom() : document
      return Option.from(doc.activeElement).map(Element$$1.fromDom)
    }
    const search = function (element) {
      return active(owner(element)).filter((e) => element.dom().contains(e.dom()))
    }

    const generate$1 = function (cases) {
      if (!isArray(cases)) {
        throw new Error('cases must be an array')
      }
      if (cases.length === 0) {
        throw new Error('there must be at least one case')
      }
      const constructors = []
      const adt = {}
      each(cases, (acase, count) => {
        const keys$$1 = keys(acase)
        if (keys$$1.length !== 1) {
          throw new Error('one and only one name per case')
        }
        const key = keys$$1[0]
        const value = acase[key]
        if (adt[key] !== undefined) {
          throw new Error(`duplicate key detected:${key}`)
        } else if (key === 'cata') {
          throw new Error('cannot have a case named cata (sorry)')
        } else if (!isArray(value)) {
          throw new Error('case arguments must be an array')
        }
        constructors.push(key)
        adt[key] = function () {
          const argLength = arguments.length
          if (argLength !== value.length) {
            throw new Error(`Wrong number of arguments to case ${key}. Expected ${value.length} (${value}), got ${argLength}`)
          }
          const args = new Array(argLength)
          for (let i = 0; i < args.length; i++) { args[i] = arguments[i] }
          const match = function (branches) {
            const branchKeys = keys(branches)
            if (constructors.length !== branchKeys.length) {
              throw new Error(`Wrong number of arguments to match. Expected: ${constructors.join(',')}\nActual: ${branchKeys.join(',')}`)
            }
            const allReqd = forall(constructors, (reqKey) => contains(branchKeys, reqKey))
            if (!allReqd) { throw new Error(`Not all branches were specified when using match. Specified: ${branchKeys.join(', ')}\nRequired: ${constructors.join(', ')}`) }
            return branches[key].apply(null, args)
          }
          return {
            fold() {
              if (arguments.length !== cases.length) {
                throw new Error(`Wrong number of arguments to fold. Expected ${cases.length}, got ${arguments.length}`)
              }
              const target = arguments[count]
              return target.apply(null, args)
            },
            match,
            log(label) {
              console.log(label, {
                constructors,
                constructor: key,
                params: args,
              })
            },
          }
        }
      })
      return adt
    }
    const Adt = { generate: generate$1 }

    const adt = Adt.generate([
      { before: ['element'] },
      {
        on: [
          'element',
          'offset',
        ],
      },
      { after: ['element'] },
    ])

    const type$1 = Adt.generate([
      { domRange: ['rng'] },
      {
        relative: [
          'startSitu',
          'finishSitu',
        ],
      },
      {
        exact: [
          'start',
          'soffset',
          'finish',
          'foffset',
        ],
      },
    ])
    const range$1 = Immutable('start', 'soffset', 'finish', 'foffset')
    const { domRange } = type$1
    const { relative } = type$1
    const { exact } = type$1

    const browser$3 = PlatformDetection$1.detect().browser
    const clamp = function (offset, element) {
      const max = isText(element) ? get$6(element).length : children(element).length + 1
      if (offset > max) {
        return max
      } if (offset < 0) {
        return 0
      }
      return offset
    }
    const normalizeRng = function (rng) {
      return range$1(rng.start(), clamp(rng.soffset(), rng.start()), rng.finish(), clamp(rng.foffset(), rng.finish()))
    }
    const isOrContains = function (root, elm) {
      return contains$3(root, elm) || eq(root, elm)
    }
    const isRngInRoot = function (root) {
      return function (rng) {
        return isOrContains(root, rng.start()) && isOrContains(root, rng.finish())
      }
    }
    const shouldStore = function (editor) {
      return editor.inline === true || browser$3.isIE()
    }
    const nativeRangeToSelectionRange = function (r) {
      return range$1(Element$$1.fromDom(r.startContainer), r.startOffset, Element$$1.fromDom(r.endContainer), r.endOffset)
    }
    const readRange = function (win) {
      const selection = win.getSelection()
      const rng = !selection || selection.rangeCount === 0 ? Option.none() : Option.from(selection.getRangeAt(0))
      return rng.map(nativeRangeToSelectionRange)
    }
    const getBookmark$2 = function (root) {
      const win = defaultView(root)
      return readRange(win.dom()).filter(isRngInRoot(root))
    }
    const validate = function (root, bookmark) {
      return Option.from(bookmark).filter(isRngInRoot(root)).map(normalizeRng)
    }
    const bookmarkToNativeRng = function (bookmark) {
      const rng = document.createRange()
      try {
        rng.setStart(bookmark.start().dom(), bookmark.soffset())
        rng.setEnd(bookmark.finish().dom(), bookmark.foffset())
        return Option.some(rng)
      } catch (_) {
        return Option.none()
      }
    }
    const store = function (editor) {
      const newBookmark = shouldStore(editor) ? getBookmark$2(Element$$1.fromDom(editor.getBody())) : Option.none()
      editor.bookmark = newBookmark.isSome() ? newBookmark : editor.bookmark
    }
    const storeNative = function (editor, rng) {
      const root = Element$$1.fromDom(editor.getBody())
      const range = shouldStore(editor) ? Option.from(rng) : Option.none()
      const newBookmark = range.map(nativeRangeToSelectionRange).filter(isRngInRoot(root))
      editor.bookmark = newBookmark.isSome() ? newBookmark : editor.bookmark
    }
    const getRng = function (editor) {
      const bookmark = editor.bookmark ? editor.bookmark : Option.none()
      return bookmark.bind(curry(validate, Element$$1.fromDom(editor.getBody()))).bind(bookmarkToNativeRng)
    }
    const restore = function (editor) {
      getRng(editor).each((rng) => {
        editor.selection.setRng(rng)
      })
    }
    const SelectionBookmark = {
      store,
      storeNative,
      readRange,
      restore,
      getRng,
      getBookmark: getBookmark$2,
      validate,
    }

    const getContentEditableHost = function (editor, node) {
      return editor.dom.getParent(node, (node) => editor.dom.getContentEditable(node) === 'true')
    }
    const getCollapsedNode = function (rng) {
      return rng.collapsed ? Option.from(getNode(rng.startContainer, rng.startOffset)).map(Element$$1.fromDom) : Option.none()
    }
    const getFocusInElement = function (root, rng) {
      return getCollapsedNode(rng).bind((node) => {
        if (isTableSection(node)) {
          return Option.some(node)
        } if (contains$3(root, node) === false) {
          return Option.some(root)
        }
        return Option.none()
      })
    }
    const normalizeSelection = function (editor, rng) {
      getFocusInElement(Element$$1.fromDom(editor.getBody()), rng).bind((elm) => CaretFinder.firstPositionIn(elm.dom())).fold(() => {
        editor.selection.normalize()
      }, (caretPos) => editor.selection.setRng(caretPos.toRange()))
    }
    const focusBody = function (body) {
      if (body.setActive) {
        try {
          body.setActive()
        } catch (ex) {
          body.focus()
        }
      } else {
        body.focus()
      }
    }
    const hasElementFocus = function (elm) {
      return hasFocus(elm) || search(elm).isSome()
    }
    const hasIframeFocus = function (editor) {
      return editor.iframeElement && hasFocus(Element$$1.fromDom(editor.iframeElement))
    }
    const hasInlineFocus = function (editor) {
      const rawBody = editor.getBody()
      return rawBody && hasElementFocus(Element$$1.fromDom(rawBody))
    }
    const hasFocus$1 = function (editor) {
      return editor.inline ? hasInlineFocus(editor) : hasIframeFocus(editor)
    }
    const focusEditor = function (editor) {
      const { selection } = editor
      const body = editor.getBody()
      let rng = selection.getRng()
      editor.quirks.refreshContentEditable()
      const contentEditableHost = getContentEditableHost(editor, selection.getNode())
      if (editor.$.contains(body, contentEditableHost)) {
        focusBody(contentEditableHost)
        normalizeSelection(editor, rng)
        activateEditor(editor)
        return
      }
      if (editor.bookmark !== undefined && hasFocus$1(editor) === false) {
        SelectionBookmark.getRng(editor).each((bookmarkRng) => {
          editor.selection.setRng(bookmarkRng)
          rng = bookmarkRng
        })
      }
      if (!editor.inline) {
        if (!Env.opera) {
          focusBody(body)
        }
        editor.getWin().focus()
      }
      if (Env.gecko || editor.inline) {
        focusBody(body)
        normalizeSelection(editor, rng)
      }
      activateEditor(editor)
    }
    var activateEditor = function (editor) {
      return editor.editorManager.setActive(editor)
    }
    const focus$1 = function (editor, skipFocus) {
      if (editor.removed) {
        return
      }
      skipFocus ? activateEditor(editor) : focusEditor(editor)
    }
    const EditorFocus = {
      focus: focus$1,
      hasFocus: hasFocus$1,
    }

    const defaultFormat$1 = 'html'
    const isTreeNode = function (content) {
      return content instanceof Node$2
    }
    const moveSelection = function (editor) {
      if (EditorFocus.hasFocus(editor)) {
        CaretFinder.firstPositionIn(editor.getBody()).each((pos) => {
          const node = pos.getNode()
          const caretPos = NodeType.isTable(node) ? CaretFinder.firstPositionIn(node).getOr(pos) : pos
          editor.selection.setRng(caretPos.toRange())
        })
      }
    }
    const setEditorHtml = function (editor, html) {
      editor.dom.setHTML(editor.getBody(), html)
      moveSelection(editor)
    }
    const setContentString = function (editor, body, content, args) {
      let forcedRootBlockName, padd
      if (content.length === 0 || /^\s+$/.test(content)) {
        padd = '<br data-mce-bogus="1">'
        if (body.nodeName === 'TABLE') {
          content = `<tr><td>${padd}</td></tr>`
        } else if (/^(UL|OL)$/.test(body.nodeName)) {
          content = `<li>${padd}</li>`
        }
        forcedRootBlockName = Settings.getForcedRootBlock(editor)
        if (forcedRootBlockName && editor.schema.isValidChild(body.nodeName.toLowerCase(), forcedRootBlockName.toLowerCase())) {
          content = padd
          content = editor.dom.createHTML(forcedRootBlockName, editor.settings.forced_root_block_attrs, content)
        } else if (!content) {
          content = '<br data-mce-bogus="1">'
        }
        setEditorHtml(editor, content)
        editor.fire('SetContent', args)
      } else {
        if (args.format !== 'raw') {
          content = Serializer({ validate: editor.validate }, editor.schema).serialize(editor.parser.parse(content, {
            isRootContent: true,
            insert: true,
          }))
        }
        args.content = isWsPreserveElement(Element$$1.fromDom(body)) ? content : Tools.trim(content)
        setEditorHtml(editor, args.content)
        if (!args.no_events) {
          editor.fire('SetContent', args)
        }
      }
      return args.content
    }
    const setContentTree = function (editor, body, content, args) {
      filter$2(editor.parser.getNodeFilters(), editor.parser.getAttributeFilters(), content)
      const html = Serializer({ validate: editor.validate }, editor.schema).serialize(content)
      args.content = isWsPreserveElement(Element$$1.fromDom(body)) ? html : Tools.trim(html)
      setEditorHtml(editor, args.content)
      if (!args.no_events) {
        editor.fire('SetContent', args)
      }
      return content
    }
    const setContent = function (editor, content, args) {
      if (args === void 0) {
        args = {}
      }
      args.format = args.format ? args.format : defaultFormat$1
      args.set = true
      args.content = isTreeNode(content) ? '' : content
      if (!isTreeNode(content) && !args.no_events) {
        editor.fire('BeforeSetContent', args)
        content = args.content
      }
      return Option.from(editor.getBody()).fold(constant(content), (body) => isTreeNode(content) ? setContentTree(editor, body, content, args) : setContentString(editor, body, content, args))
    }

    const firePreProcess = function (editor, args) {
      return editor.fire('PreProcess', args)
    }
    const firePostProcess = function (editor, args) {
      return editor.fire('PostProcess', args)
    }
    const fireRemove = function (editor) {
      return editor.fire('remove')
    }
    const fireDetach = function (editor) {
      return editor.fire('detach')
    }
    const fireSwitchMode = function (editor, mode) {
      return editor.fire('SwitchMode', { mode })
    }
    const fireObjectResizeStart = function (editor, target, width, height) {
      editor.fire('ObjectResizeStart', {
        target,
        width,
        height,
      })
    }
    const fireObjectResized = function (editor, target, width, height) {
      editor.fire('ObjectResized', {
        target,
        width,
        height,
      })
    }
    const Events = {
      firePreProcess,
      firePostProcess,
      fireRemove,
      fireDetach,
      fireSwitchMode,
      fireObjectResizeStart,
      fireObjectResized,
    }

    const DOM$1 = DOMUtils$1.DOM
    const restoreOriginalStyles = function (editor) {
      DOM$1.setStyle(editor.id, 'display', editor.orgDisplay)
    }
    const safeDestroy = function (x) {
      return Option.from(x).each((x) => x.destroy())
    }
    const clearDomReferences = function (editor) {
      editor.contentAreaContainer = editor.formElement = editor.container = editor.editorContainer = null
      editor.bodyElement = editor.contentDocument = editor.contentWindow = null
      editor.iframeElement = editor.targetElm = null
      if (editor.selection) {
        editor.selection = editor.selection.win = editor.selection.dom = editor.selection.dom.doc = null
      }
    }
    const restoreForm = function (editor) {
      const form = editor.formElement
      if (form) {
        if (form._mceOldSubmit) {
          form.submit = form._mceOldSubmit
          form._mceOldSubmit = null
        }
        DOM$1.unbind(form, 'submit reset', editor.formEventDelegate)
      }
    }
    const remove$8 = function (editor) {
      if (!editor.removed) {
        const { _selectionOverrides } = editor; const { editorUpload } = editor
        const body = editor.getBody()
        const element = editor.getElement()
        if (body) {
          editor.save({ is_removing: true })
        }
        editor.removed = true
        editor.unbindAllNativeEvents()
        if (editor.hasHiddenInput && element) {
          DOM$1.remove(element.nextSibling)
        }
        if (!editor.inline && body) {
          restoreOriginalStyles(editor)
        }
        Events.fireRemove(editor)
        editor.editorManager.remove(editor)
        Events.fireDetach(editor)
        DOM$1.remove(editor.getContainer())
        safeDestroy(_selectionOverrides)
        safeDestroy(editorUpload)
        editor.destroy()
      }
    }
    const destroy = function (editor, automatic) {
      const { selection } = editor; const { dom } = editor
      if (editor.destroyed) {
        return
      }
      if (!automatic && !editor.removed) {
        editor.remove()
        return
      }
      if (!automatic) {
        editor.editorManager.off('beforeunload', editor._beforeUnload)
        if (editor.theme && editor.theme.destroy) {
          editor.theme.destroy()
        }
        safeDestroy(selection)
        safeDestroy(dom)
      }
      restoreForm(editor)
      clearDomReferences(editor)
      editor.destroyed = true
    }

    const sectionResult = Immutable('sections', 'settings')
    const detection = PlatformDetection$1.detect()
    const isTouch = detection.deviceType.isTouch()
    const isPhone = detection.deviceType.isPhone()
    const mobilePlugins = [
      'lists',
      'autolink',
      'autosave',
    ]
    const defaultMobileSettings = isPhone ? { theme: 'mobile' } : {}
    const normalizePlugins = function (plugins) {
      const pluginNames = isArray(plugins) ? plugins.join(' ') : plugins
      const trimmedPlugins = map(isString(pluginNames) ? pluginNames.split(' ') : [], trim$2)
      return filter(trimmedPlugins, (item) => item.length > 0)
    }
    const filterMobilePlugins = function (plugins) {
      return filter(plugins, curry(contains, mobilePlugins))
    }
    const extractSections = function (keys$$1, settings) {
      const result = bifilter(settings, (value, key) => contains(keys$$1, key))
      return sectionResult(result.t, result.f)
    }
    const getSection = function (sectionResult, name, defaults) {
      const sections = sectionResult.sections()
      const sectionSettings = sections.hasOwnProperty(name) ? sections[name] : {}
      return Tools.extend({}, defaults, sectionSettings)
    }
    const hasSection = function (sectionResult, name) {
      return sectionResult.sections().hasOwnProperty(name)
    }
    const getDefaultSettings = function (id, documentBaseUrl, editor) {
      return {
        id,
        theme: 'silver',
        popup_css: '',
        plugins: '',
        document_base_url: documentBaseUrl,
        add_form_submit_trigger: true,
        submit_patch: true,
        add_unload_trigger: true,
        convert_urls: true,
        relative_urls: true,
        remove_script_host: true,
        object_resizing: true,
        doctype: '<!DOCTYPE html>',
        visual: true,
        font_size_style_values: 'xx-small,x-small,small,medium,large,x-large,xx-large',
        font_size_legacy_values: 'xx-small,small,medium,large,x-large,xx-large,300%',
        forced_root_block: 'p',
        hidden_input: true,
        render_ui: true,
        inline_styles: true,
        convert_fonts_to_spans: true,
        indent: 'simple',
        indent_before: 'p,h1,h2,h3,h4,h5,h6,blockquote,div,title,style,pre,script,td,th,ul,ol,li,dl,dt,dd,area,table,thead,' + 'tfoot,tbody,tr,section,summary,article,hgroup,aside,figure,figcaption,option,optgroup,datalist',
        indent_after: 'p,h1,h2,h3,h4,h5,h6,blockquote,div,title,style,pre,script,td,th,ul,ol,li,dl,dt,dd,area,table,thead,' + 'tfoot,tbody,tr,section,summary,article,hgroup,aside,figure,figcaption,option,optgroup,datalist',
        entity_encoding: 'named',
        url_converter: editor.convertURL,
        url_converter_scope: editor,
        ie7_compat: true,
      }
    }
    const getExternalPlugins = function (overrideSettings, settings) {
      const userDefinedExternalPlugins = settings.external_plugins ? settings.external_plugins : {}
      if (overrideSettings && overrideSettings.external_plugins) {
        return Tools.extend({}, overrideSettings.external_plugins, userDefinedExternalPlugins)
      }
      return userDefinedExternalPlugins
    }
    const combinePlugins = function (forcedPlugins, plugins) {
      return [].concat(normalizePlugins(forcedPlugins)).concat(normalizePlugins(plugins))
    }
    const processPlugins = function (isTouchDevice, sectionResult, defaultOverrideSettings, settings) {
      const forcedPlugins = normalizePlugins(defaultOverrideSettings.forced_plugins)
      const plugins = normalizePlugins(settings.plugins)
      const platformPlugins = isTouchDevice && hasSection(sectionResult, 'mobile') ? filterMobilePlugins(plugins) : plugins
      const combinedPlugins = combinePlugins(forcedPlugins, platformPlugins)
      return Tools.extend(settings, { plugins: combinedPlugins.join(' ') })
    }
    const isOnMobile = function (isTouchDevice, sectionResult) {
      const isInline = sectionResult.settings().inline
      return isTouchDevice && !isInline
    }
    const combineSettings = function (isTouchDevice, defaultSettings, defaultOverrideSettings, settings) {
      const sectionResult = extractSections(['mobile'], settings)
      const extendedSettings = Tools.extend(defaultSettings, defaultOverrideSettings, sectionResult.settings(), isOnMobile(isTouchDevice, sectionResult) ? getSection(sectionResult, 'mobile', defaultMobileSettings) : {}, {
        validate: true,
        external_plugins: getExternalPlugins(defaultOverrideSettings, sectionResult.settings()),
      })
      return processPlugins(isTouchDevice, sectionResult, defaultOverrideSettings, extendedSettings)
    }
    const getEditorSettings = function (editor, id, documentBaseUrl, defaultOverrideSettings, settings) {
      const defaultSettings = getDefaultSettings(id, documentBaseUrl, editor)
      return combineSettings(isTouch, defaultSettings, defaultOverrideSettings, settings)
    }
    const getFiltered = function (predicate, editor, name) {
      return Option.from(editor.settings[name]).filter(predicate)
    }
    const getString = curry(getFiltered, isString)
    const getParamObject = function (value) {
      let output = {}
      if (typeof value === 'string') {
        each(value.indexOf('=') > 0 ? value.split(/[;,](?![^=;,]*(?:[;,]|$))/) : value.split(','), (val) => {
          const arr = val.split('=')
          if (arr.length > 1) {
            output[Tools.trim(arr[0])] = Tools.trim(arr[1])
          } else {
            output[Tools.trim(arr[0])] = Tools.trim(arr)
          }
        })
      } else {
        output = value
      }
      return output
    }
    const isArrayOf = function (p) {
      return function (a) {
        return isArray(a) && forall(a, p)
      }
    }
    const getParam = function (editor, name, defaultVal, type) {
      const value = name in editor.settings ? editor.settings[name] : defaultVal
      if (type === 'hash') {
        return getParamObject(value)
      } if (type === 'string') {
        return getFiltered(isString, editor, name).getOr(defaultVal)
      } if (type === 'number') {
        return getFiltered(isNumber, editor, name).getOr(defaultVal)
      } if (type === 'boolean') {
        return getFiltered(isBoolean, editor, name).getOr(defaultVal)
      } if (type === 'object') {
        return getFiltered(isObject, editor, name).getOr(defaultVal)
      } if (type === 'array') {
        return getFiltered(isArray, editor, name).getOr(defaultVal)
      } if (type === 'string[]') {
        return getFiltered(isArrayOf(isString), editor, name).getOr(defaultVal)
      } if (type === 'function') {
        return getFiltered(isFunction, editor, name).getOr(defaultVal)
      }
      return value
    }

    const getProp = function (propName, elm) {
      const rawElm = elm.dom()
      return rawElm[propName]
    }
    const getComputedSizeProp = function (propName, elm) {
      return parseInt(get$2(elm, propName), 10)
    }
    const getClientWidth = curry(getProp, 'clientWidth')
    const getClientHeight = curry(getProp, 'clientHeight')
    const getMarginTop = curry(getComputedSizeProp, 'margin-top')
    const getMarginLeft = curry(getComputedSizeProp, 'margin-left')
    const getBoundingClientRect$1 = function (elm) {
      return elm.dom().getBoundingClientRect()
    }
    const isInsideElementContentArea = function (bodyElm, clientX, clientY) {
      const clientWidth = getClientWidth(bodyElm)
      const clientHeight = getClientHeight(bodyElm)
      return clientX >= 0 && clientY >= 0 && clientX <= clientWidth && clientY <= clientHeight
    }
    const transpose = function (inline, elm, clientX, clientY) {
      const clientRect = getBoundingClientRect$1(elm)
      const deltaX = inline ? clientRect.left + elm.dom().clientLeft + getMarginLeft(elm) : 0
      const deltaY = inline ? clientRect.top + elm.dom().clientTop + getMarginTop(elm) : 0
      const x = clientX - deltaX
      const y = clientY - deltaY
      return {
        x,
        y,
      }
    }
    const isXYInContentArea = function (editor, clientX, clientY) {
      const bodyElm = Element$$1.fromDom(editor.getBody())
      const targetElm = editor.inline ? bodyElm : documentElement(bodyElm)
      const transposedPoint = transpose(editor.inline, targetElm, clientX, clientY)
      return isInsideElementContentArea(targetElm, transposedPoint.x, transposedPoint.y)
    }
    const fromDomSafe = function (node) {
      return Option.from(node).map(Element$$1.fromDom)
    }
    const isEditorAttachedToDom = function (editor) {
      const rawContainer = editor.inline ? editor.getBody() : editor.getContentAreaContainer()
      return fromDomSafe(rawContainer).map((container) => contains$3(owner(container), container)).getOr(false)
    }
    const EditorView = {
      isXYInContentArea,
      isEditorAttachedToDom,
    }

    function NotificationManagerImpl() {
      const unimplemented = function () {
        throw new Error('Theme did not provide a NotificationManager implementation.')
      }
      return {
        open: unimplemented,
        close: unimplemented,
        reposition: unimplemented,
        getArgs: unimplemented,
      }
    }

    function NotificationManager(editor) {
      const notifications = []
      const getImplementation = function () {
        const { theme } = editor
        return theme && theme.getNotificationManagerImpl ? theme.getNotificationManagerImpl() : NotificationManagerImpl()
      }
      const getTopNotification = function () {
        return Option.from(notifications[0])
      }
      const isEqual = function (a, b) {
        return a.type === b.type && a.text === b.text && !a.progressBar && !a.timeout && !b.progressBar && !b.timeout
      }
      const reposition = function () {
        if (notifications.length > 0) {
          getImplementation().reposition(notifications)
        }
      }
      const addNotification = function (notification) {
        notifications.push(notification)
      }
      const closeNotification = function (notification) {
        findIndex(notifications, (otherNotification) => otherNotification === notification).each((index) => {
          notifications.splice(index, 1)
        })
      }
      const open = function (args) {
        if (editor.removed || !EditorView.isEditorAttachedToDom(editor)) {
          return
        }
        return find(notifications, (notification) => isEqual(getImplementation().getArgs(notification), args)).getOrThunk(() => {
          editor.editorManager.setActive(editor)
          var notification = getImplementation().open(args, () => {
            closeNotification(notification)
            reposition()
          })
          addNotification(notification)
          reposition()
          return notification
        })
      }
      const close = function () {
        getTopNotification().each((notification) => {
          getImplementation().close(notification)
          closeNotification(notification)
          reposition()
        })
      }
      const getNotifications = function () {
        return notifications
      }
      const registerEvents = function (editor) {
        editor.on('SkinLoaded', () => {
          const serviceMessage = editor.settings.service_message
          if (serviceMessage) {
            open({
              text: serviceMessage,
              type: 'warning',
              timeout: 0,
            })
          }
        })
        editor.on('ResizeEditor ResizeWindow NodeChange', () => {
          Delay.requestAnimationFrame(reposition)
        })
        editor.on('remove', () => {
          each(notifications.slice(), (notification) => {
            getImplementation().close(notification)
          })
        })
      }
      registerEvents(editor)
      return {
        open,
        close,
        getNotifications,
      }
    }

    function WindowManagerImpl() {
      const unimplemented = function () {
        throw new Error('Theme did not provide a WindowManager implementation.')
      }
      return {
        open: unimplemented,
        alert: unimplemented,
        confirm: unimplemented,
        close: unimplemented,
        getParams: unimplemented,
        setParams: unimplemented,
      }
    }

    function WindowManager(editor) {
      let dialogs = []
      const getImplementation = function () {
        const { theme } = editor
        return theme && theme.getWindowManagerImpl ? theme.getWindowManagerImpl() : WindowManagerImpl()
      }
      const funcBind = function (scope, f) {
        return function () {
          return f ? f.apply(scope, arguments) : undefined
        }
      }
      const fireOpenEvent = function (dialog) {
        editor.fire('OpenWindow', { dialog })
      }
      const fireCloseEvent = function (dialog) {
        editor.fire('CloseWindow', { dialog })
      }
      const addDialog = function (dialog) {
        dialogs.push(dialog)
        fireOpenEvent(dialog)
      }
      const closeDialog = function (dialog) {
        fireCloseEvent(dialog)
        dialogs = filter(dialogs, (otherDialog) => otherDialog !== dialog)
        if (dialogs.length === 0) {
          editor.focus()
        }
      }
      const getTopDialog = function () {
        return Option.from(dialogs[dialogs.length - 1])
      }
      const open = function (args, params) {
        editor.editorManager.setActive(editor)
        SelectionBookmark.store(editor)
        const dialog = getImplementation().open(args, params, closeDialog)
        addDialog(dialog)
        return dialog
      }
      const alert = function (message, callback, scope) {
        getImplementation().alert(message, funcBind(scope || this, callback))
      }
      const confirm = function (message, callback, scope) {
        getImplementation().confirm(message, funcBind(scope || this, callback))
      }
      const close = function () {
        getTopDialog().each((dialog) => {
          getImplementation().close(dialog)
          closeDialog(dialog)
        })
      }
      editor.on('remove', () => {
        each(dialogs, (dialog) => {
          getImplementation().close(dialog)
        })
      })
      return {
        open,
        alert,
        confirm,
        close,
      }
    }

    const { PluginManager } = AddOnManager
    const resolvePluginName = function (targetUrl, suffix) {
      for (const name$$1 in PluginManager.urls) {
        const matchUrl = `${PluginManager.urls[name$$1]}/plugin${suffix}.js`
        if (matchUrl === targetUrl) {
          return name$$1
        }
      }
      return null
    }
    const pluginUrlToMessage = function (editor, url) {
      const plugin = resolvePluginName(url, editor.suffix)
      return plugin ? `Failed to load plugin: ${plugin} from url ${url}` : `Failed to load plugin url: ${url}`
    }
    const displayNotification = function (editor, message) {
      editor.notificationManager.open({
        type: 'error',
        text: message,
      })
    }
    const displayError = function (editor, message) {
      if (editor._skinLoaded) {
        displayNotification(editor, message)
      } else {
        editor.on('SkinLoaded', () => {
          displayNotification(editor, message)
        })
      }
    }
    const uploadError = function (editor, message) {
      displayError(editor, `Failed to upload image: ${message}`)
    }
    const pluginLoadError = function (editor, url) {
      displayError(editor, pluginUrlToMessage(editor, url))
    }
    const initError = function (message) {
      const x = []
      for (let _i = 1; _i < arguments.length; _i++) {
        x[_i - 1] = arguments[_i]
      }
      const console$$1 = window.console
      if (console$$1) {
        if (console$$1.error) {
          console$$1.error.apply(console$$1, arguments)
        } else {
          console$$1.log.apply(console$$1, arguments)
        }
      }
    }
    const ErrorReporter = {
      pluginLoadError,
      uploadError,
      displayError,
      initError,
    }

    const CreateIconManager = function () {
      const lookup = {}
      const add = function (id, iconPack) {
        lookup[id] = iconPack
      }
      const get = function (id) {
        if (lookup[id]) {
          return lookup[id]
        }
        return { icons: {} }
      }
      return {
        add,
        get,
      }
    }
    const IconManager = CreateIconManager()

    const PluginManager$1 = AddOnManager.PluginManager

    const { ThemeManager } = AddOnManager

    function XMLHttpRequest() {
      const f = Global$1.getOrDie('XMLHttpRequest')
      return new f()
    }

    function Uploader(uploadStatus, settings) {
      const pendingPromises = {}
      const pathJoin = function (path1, path2) {
        if (path1) {
          return `${path1.replace(/\/$/, '')}/${path2.replace(/^\//, '')}`
        }
        return path2
      }
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
      const noUpload = function () {
        return new promiseObj((resolve) => {
          resolve([])
        })
      }
      const handlerSuccess = function (blobInfo, url) {
        return {
          url,
          blobInfo,
          status: true,
        }
      }
      const handlerFailure = function (blobInfo, error) {
        return {
          url: '',
          blobInfo,
          status: false,
          error,
        }
      }
      const resolvePending = function (blobUri, result) {
        Tools.each(pendingPromises[blobUri], (resolve) => {
          resolve(result)
        })
        delete pendingPromises[blobUri]
      }
      const uploadBlobInfo = function (blobInfo, handler, openNotification) {
        uploadStatus.markPending(blobInfo.blobUri())
        return new promiseObj((resolve) => {
          let notification, progress
          const noop = function () {
          }
          try {
            const closeNotification_1 = function () {
              if (notification) {
                notification.close()
                progress = noop
              }
            }
            const success = function (url) {
              closeNotification_1()
              uploadStatus.markUploaded(blobInfo.blobUri(), url)
              resolvePending(blobInfo.blobUri(), handlerSuccess(blobInfo, url))
              resolve(handlerSuccess(blobInfo, url))
            }
            const failure = function (error) {
              closeNotification_1()
              uploadStatus.removeFailed(blobInfo.blobUri())
              resolvePending(blobInfo.blobUri(), handlerFailure(blobInfo, error))
              resolve(handlerFailure(blobInfo, error))
            }
            progress = function (percent) {
              if (percent < 0 || percent > 100) {
                return
              }
              if (!notification) {
                notification = openNotification()
              }
              notification.progressBar.value(percent)
            }
            handler(blobInfo, success, failure, progress)
          } catch (ex) {
            resolve(handlerFailure(blobInfo, ex.message))
          }
        })
      }
      const isDefaultHandler = function (handler) {
        return handler === defaultHandler
      }
      const pendingUploadBlobInfo = function (blobInfo) {
        const blobUri = blobInfo.blobUri()
        return new promiseObj((resolve) => {
          pendingPromises[blobUri] = pendingPromises[blobUri] || []
          pendingPromises[blobUri].push(resolve)
        })
      }
      const uploadBlobs = function (blobInfos, openNotification) {
        blobInfos = Tools.grep(blobInfos, (blobInfo) => !uploadStatus.isUploaded(blobInfo.blobUri()))
        return promiseObj.all(Tools.map(blobInfos, (blobInfo) => uploadStatus.isPending(blobInfo.blobUri()) ? pendingUploadBlobInfo(blobInfo) : uploadBlobInfo(blobInfo, settings.handler, openNotification)))
      }
      const upload = function (blobInfos, openNotification) {
        return !settings.url && isDefaultHandler(settings.handler) ? noUpload() : uploadBlobs(blobInfos, openNotification)
      }
      if (isFunction(settings.handler) === false) {
        settings.handler = defaultHandler
      }
      return { upload }
    }

    function FileReader() {
      const f = Global$1.getOrDie('FileReader')
      return new f()
    }

    function Uint8Array(arr) {
      const f = Global$1.getOrDie('Uint8Array')
      return new f(arr)
    }

    const requestAnimationFrame$1 = function (callback) {
      const f = Global$1.getOrDie('requestAnimationFrame')
      f(callback)
    }
    const atob = function (base64) {
      const f = Global$1.getOrDie('atob')
      return f(base64)
    }
    const Window = {
      atob,
      requestAnimationFrame: requestAnimationFrame$1,
    }

    const blobUriToBlob = function (url) {
      return new promiseObj((resolve, reject) => {
        const rejectWithError = function () {
          reject(`Cannot convert ${url} to Blob. Resource might not exist or is inaccessible.`)
        }
        try {
          const xhr = XMLHttpRequest()
          xhr.open('GET', url, true)
          xhr.responseType = 'blob'
          xhr.onload = function () {
            if (this.status === 200) {
              resolve(this.response)
            } else {
              rejectWithError()
            }
          }
          xhr.onerror = rejectWithError
          xhr.send()
        } catch (ex) {
          rejectWithError()
        }
      })
    }
    const parseDataUri = function (uri) {
      let type, matches
      const uriParts = decodeURIComponent(uri).split(',')
      matches = /data:([^;]+)/.exec(uriParts[0])
      if (matches) {
        type = matches[1]
      }
      return {
        type,
        data: uriParts[1],
      }
    }
    const dataUriToBlob = function (uri) {
      return new promiseObj((resolve) => {
        let str, arr, i
        const uriParts = parseDataUri(uri)
        try {
          str = Window.atob(uriParts.data)
        } catch (e) {
          resolve(new Blob([]))
          return
        }
        arr = Uint8Array(str.length)
        for (i = 0; i < arr.length; i++) {
          arr[i] = str.charCodeAt(i)
        }
        resolve(new Blob([arr], { type: uriParts.type }))
      })
    }
    const uriToBlob = function (url) {
      if (url.indexOf('blob:') === 0) {
        return blobUriToBlob(url)
      }
      if (url.indexOf('data:') === 0) {
        return dataUriToBlob(url)
      }
      return null
    }
    const blobToDataUri = function (blob) {
      return new promiseObj((resolve) => {
        const reader = FileReader()
        reader.onloadend = function () {
          resolve(reader.result)
        }
        reader.readAsDataURL(blob)
      })
    }
    const Conversions = {
      uriToBlob,
      blobToDataUri,
      parseDataUri,
    }

    let count = 0
    const uniqueId = function (prefix) {
      return (prefix || 'blobid') + count++
    }
    const imageToBlobInfo = function (blobCache, img, resolve, reject) {
      let base64, blobInfo
      if (img.src.indexOf('blob:') === 0) {
        blobInfo = blobCache.getByUri(img.src)
        if (blobInfo) {
          resolve({
            image: img,
            blobInfo,
          })
        } else {
          Conversions.uriToBlob(img.src).then((blob) => {
            Conversions.blobToDataUri(blob).then((dataUri) => {
              base64 = Conversions.parseDataUri(dataUri).data
              blobInfo = blobCache.create(uniqueId(), blob, base64)
              blobCache.add(blobInfo)
              resolve({
                image: img,
                blobInfo,
              })
            })
          }, (err) => {
            reject(err)
          })
        }
        return
      }
      base64 = Conversions.parseDataUri(img.src).data
      blobInfo = blobCache.findFirst((cachedBlobInfo) => cachedBlobInfo.base64() === base64)
      if (blobInfo) {
        resolve({
          image: img,
          blobInfo,
        })
      } else {
        Conversions.uriToBlob(img.src).then((blob) => {
          blobInfo = blobCache.create(uniqueId(), blob, base64)
          blobCache.add(blobInfo)
          resolve({
            image: img,
            blobInfo,
          })
        }, (err) => {
          reject(err)
        })
      }
    }
    const getAllImages = function (elm) {
      return elm ? from$1(elm.getElementsByTagName('img')) : []
    }
    function ImageScanner(uploadStatus, blobCache) {
      const cachedPromises = {}
      const findAll = function (elm, predicate) {
        let images
        if (!predicate) {
          predicate = constant(true)
        }
        images = filter(getAllImages(elm), (img) => {
          const { src } = img
          if (!Env.fileApi) {
            return false
          }
          if (img.hasAttribute('data-mce-bogus')) {
            return false
          }
          if (img.hasAttribute('data-mce-placeholder')) {
            return false
          }
          if (!src || src === Env.transparentSrc) {
            return false
          }
          if (src.indexOf('blob:') === 0) {
            return !uploadStatus.isUploaded(src) && predicate(img)
          }
          if (src.indexOf('data:') === 0) {
            return predicate(img)
          }
          return false
        })
        const promises = map(images, (img) => {
          if (cachedPromises[img.src]) {
            return new promiseObj((resolve) => {
              cachedPromises[img.src].then((imageInfo) => {
                if (typeof imageInfo === 'string') {
                  return imageInfo
                }
                resolve({
                  image: img,
                  blobInfo: imageInfo.blobInfo,
                })
              })
            })
          }
          const newPromise = new promiseObj((resolve, reject) => {
            imageToBlobInfo(blobCache, img, resolve, reject)
          }).then((result) => {
            delete cachedPromises[result.image.src]
            return result
          }).catch((error) => {
            delete cachedPromises[img.src]
            return error
          })
          cachedPromises[img.src] = newPromise
          return newPromise
        })
        return promiseObj.all(promises)
      }
      return { findAll }
    }

    let count$1 = 0
    const seed = function () {
      const rnd = function () {
        return Math.round(Math.random() * 4294967295).toString(36)
      }
      const now = new Date().getTime()
      return `s${now.toString(36)}${rnd()}${rnd()}${rnd()}`
    }
    const uuid = function (prefix) {
      return prefix + count$1++ + seed()
    }
    const Uuid = { uuid }

    function BlobCache() {
      let cache = []
      const mimeToExt = function (mime) {
        const mimes = {
          'image/jpeg': 'jpg',
          'image/jpg': 'jpg',
          'image/gif': 'gif',
          'image/png': 'png',
        }
        return mimes[mime.toLowerCase()] || 'dat'
      }
      const create = function (o, blob, base64, filename) {
        if (isString(o)) {
          const id = o
          return toBlobInfo({
            id,
            name: filename,
            blob,
            base64,
          })
        } if (isObject(o)) {
          return toBlobInfo(o)
        }
        throw new Error('Unknown input type')
      }
      var toBlobInfo = function (o) {
        let id, name
        if (!o.blob || !o.base64) {
          throw new Error('blob and base64 representations of the image are required for BlobInfo to be created')
        }
        id = o.id || Uuid.uuid('blobid')
        name = o.name || id
        return {
          id: constant(id),
          name: constant(name),
          filename: constant(`${name}.${mimeToExt(o.blob.type)}`),
          blob: constant(o.blob),
          base64: constant(o.base64),
          blobUri: constant(o.blobUri || URL.createObjectURL(o.blob)),
          uri: constant(o.uri),
        }
      }
      const add = function (blobInfo) {
        if (!get(blobInfo.id())) {
          cache.push(blobInfo)
        }
      }
      var get = function (id) {
        return findFirst((cachedBlobInfo) => cachedBlobInfo.id() === id)
      }
      var findFirst = function (predicate) {
        return filter(cache, predicate)[0]
      }
      const getByUri = function (blobUri) {
        return findFirst((blobInfo) => blobInfo.blobUri() === blobUri)
      }
      const removeByUri = function (blobUri) {
        cache = filter(cache, (blobInfo) => {
          if (blobInfo.blobUri() === blobUri) {
            URL.revokeObjectURL(blobInfo.blobUri())
            return false
          }
          return true
        })
      }
      const destroy = function () {
        each(cache, (cachedBlobInfo) => {
          URL.revokeObjectURL(cachedBlobInfo.blobUri())
        })
        cache = []
      }
      return {
        create,
        add,
        get,
        getByUri,
        findFirst,
        removeByUri,
        destroy,
      }
    }

    function UploadStatus() {
      const PENDING = 1; const UPLOADED = 2
      let blobUriStatuses = {}
      const createStatus = function (status, resultUri) {
        return {
          status,
          resultUri,
        }
      }
      const hasBlobUri = function (blobUri) {
        return blobUri in blobUriStatuses
      }
      const getResultUri = function (blobUri) {
        const result = blobUriStatuses[blobUri]
        return result ? result.resultUri : null
      }
      const isPending = function (blobUri) {
        return hasBlobUri(blobUri) ? blobUriStatuses[blobUri].status === PENDING : false
      }
      const isUploaded = function (blobUri) {
        return hasBlobUri(blobUri) ? blobUriStatuses[blobUri].status === UPLOADED : false
      }
      const markPending = function (blobUri) {
        blobUriStatuses[blobUri] = createStatus(PENDING, null)
      }
      const markUploaded = function (blobUri, resultUri) {
        blobUriStatuses[blobUri] = createStatus(UPLOADED, resultUri)
      }
      const removeFailed = function (blobUri) {
        delete blobUriStatuses[blobUri]
      }
      const destroy = function () {
        blobUriStatuses = {}
      }
      return {
        hasBlobUri,
        getResultUri,
        isPending,
        isUploaded,
        markPending,
        markUploaded,
        removeFailed,
        destroy,
      }
    }

    function EditorUpload(editor) {
      const blobCache = BlobCache()
      let uploader, imageScanner
      const uploadStatus = UploadStatus()
      const urlFilters = []
      const aliveGuard = function (callback) {
        return function (result) {
          if (editor.selection) {
            return callback(result)
          }
          return []
        }
      }
      const cacheInvalidator = function () {
        return `?${new Date().getTime()}`
      }
      const replaceString = function (content, search, replace) {
        let index = 0
        do {
          index = content.indexOf(search, index)
          if (index !== -1) {
            content = content.substring(0, index) + replace + content.substr(index + search.length)
            index += replace.length - search.length + 1
          }
        } while (index !== -1)
        return content
      }
      const replaceImageUrl = function (content, targetUrl, replacementUrl) {
        content = replaceString(content, `src="${targetUrl}"`, `src="${replacementUrl}"`)
        content = replaceString(content, `data-mce-src="${targetUrl}"`, `data-mce-src="${replacementUrl}"`)
        return content
      }
      const replaceUrlInUndoStack = function (targetUrl, replacementUrl) {
        each(editor.undoManager.data, (level) => {
          if (level.type === 'fragmented') {
            level.fragments = map(level.fragments, (fragment) => replaceImageUrl(fragment, targetUrl, replacementUrl))
          } else {
            level.content = replaceImageUrl(level.content, targetUrl, replacementUrl)
          }
        })
      }
      const openNotification = function () {
        return editor.notificationManager.open({
          text: editor.translate('Image uploading...'),
          type: 'info',
          timeout: -1,
          progressBar: true,
        })
      }
      const replaceImageUri = function (image, resultUri) {
        blobCache.removeByUri(image.src)
        replaceUrlInUndoStack(image.src, resultUri)
        editor.$(image).attr({
          src: Settings.shouldReuseFileName(editor) ? resultUri + cacheInvalidator() : resultUri,
          'data-mce-src': editor.convertURL(resultUri, 'src'),
        })
      }
      const uploadImages = function (callback) {
        if (!uploader) {
          uploader = Uploader(uploadStatus, {
            url: Settings.getImageUploadUrl(editor),
            basePath: Settings.getImageUploadBasePath(editor),
            credentials: Settings.getImagesUploadCredentials(editor),
            handler: Settings.getImagesUploadHandler(editor),
          })
        }
        return scanForImages().then(aliveGuard((imageInfos) => {
          let blobInfos
          blobInfos = map(imageInfos, (imageInfo) => imageInfo.blobInfo)
          return uploader.upload(blobInfos, openNotification).then(aliveGuard((result) => {
            const filteredResult = map(result, (uploadInfo, index) => {
              const { image } = imageInfos[index]
              if (uploadInfo.status && Settings.shouldReplaceBlobUris(editor)) {
                replaceImageUri(image, uploadInfo.url)
              } else if (uploadInfo.error) {
                ErrorReporter.uploadError(editor, uploadInfo.error)
              }
              return {
                element: image,
                status: uploadInfo.status,
              }
            })
            if (callback) {
              callback(filteredResult)
            }
            return filteredResult
          }))
        }))
      }
      const uploadImagesAuto = function (callback) {
        if (Settings.isAutomaticUploadsEnabled(editor)) {
          return uploadImages(callback)
        }
      }
      const isValidDataUriImage = function (imgElm) {
        if (forall(urlFilters, (filter$$1) => filter$$1(imgElm)) === false) {
          return false
        }
        if (imgElm.getAttribute('src').indexOf('data:') === 0) {
          const dataImgFilter = Settings.getImagesDataImgFilter(editor)
          return dataImgFilter(imgElm)
        }
        return true
      }
      const addFilter = function (filter$$1) {
        urlFilters.push(filter$$1)
      }
      var scanForImages = function () {
        if (!imageScanner) {
          imageScanner = ImageScanner(uploadStatus, blobCache)
        }
        return imageScanner.findAll(editor.getBody(), isValidDataUriImage).then(aliveGuard((result) => {
          result = filter(result, (resultItem) => {
            if (typeof resultItem === 'string') {
              ErrorReporter.displayError(editor, resultItem)
              return false
            }
            return true
          })
          each(result, (resultItem) => {
            replaceUrlInUndoStack(resultItem.image.src, resultItem.blobInfo.blobUri())
            resultItem.image.src = resultItem.blobInfo.blobUri()
            resultItem.image.removeAttribute('data-mce-src')
          })
          return result
        }))
      }
      const destroy = function () {
        blobCache.destroy()
        uploadStatus.destroy()
        imageScanner = uploader = null
      }
      const replaceBlobUris = function (content) {
        return content.replace(/src="(blob:[^"]+)"/g, (match, blobUri) => {
          const resultUri = uploadStatus.getResultUri(blobUri)
          if (resultUri) {
            return `src="${resultUri}"`
          }
          let blobInfo = blobCache.getByUri(blobUri)
          if (!blobInfo) {
            blobInfo = foldl(editor.editorManager.get(), (result, editor) => result || editor.editorUpload && editor.editorUpload.blobCache.getByUri(blobUri), null)
          }
          if (blobInfo) {
            const blob = blobInfo.blob()
            return `src="data:${blob.type};base64,${blobInfo.base64()}"`
          }
          return match
        })
      }
      editor.on('setContent', () => {
        if (Settings.isAutomaticUploadsEnabled(editor)) {
          uploadImagesAuto()
        } else {
          scanForImages()
        }
      })
      editor.on('RawSaveContent', (e) => {
        e.content = replaceBlobUris(e.content)
      })
      editor.on('getContent', (e) => {
        if (e.source_view || e.format === 'raw') {
          return
        }
        e.content = replaceBlobUris(e.content)
      })
      editor.on('PostRender', () => {
        editor.parser.addNodeFilter('img', (images) => {
          each(images, (img) => {
            const src = img.attr('src')
            if (blobCache.getByUri(src)) {
              return
            }
            const resultUri = uploadStatus.getResultUri(src)
            if (resultUri) {
              img.attr('src', resultUri)
            }
          })
        })
      })
      return {
        blobCache,
        addFilter,
        uploadImages,
        uploadImagesAuto,
        scanForImages,
        destroy,
      }
    }

    const dropLast = function (xs) {
      return xs.slice(0, -1)
    }
    const parentsUntil$1 = function (start, root, predicate) {
      if (contains$3(root, start)) {
        return dropLast(parents(start, (elm) => predicate(elm) || eq(elm, root)))
      }
      return []
    }
    const parents$1 = function (start, root) {
      return parentsUntil$1(start, root, constant(false))
    }
    const parentsAndSelf = function (start, root) {
      return [start].concat(parents$1(start, root))
    }
    const Parents = {
      parentsUntil: parentsUntil$1,
      parents: parents$1,
      parentsAndSelf,
    }

    const isBlockElement = function (blockElements, node) {
      return blockElements.hasOwnProperty(node.nodeName)
    }
    const isValidTarget = function (blockElements, node) {
      if (NodeType.isText(node)) {
        return true
      } if (NodeType.isElement(node)) {
        return !isBlockElement(blockElements, node) && !Bookmarks.isBookmarkNode(node)
      }
      return false
    }
    const hasBlockParent = function (blockElements, root, node) {
      return exists(Parents.parents(Element$$1.fromDom(node), Element$$1.fromDom(root)), (elm) => isBlockElement(blockElements, elm.dom()))
    }
    const shouldRemoveTextNode = function (blockElements, node) {
      if (NodeType.isText(node)) {
        if (node.nodeValue.length === 0) {
          return true
        } if (/^\s+$/.test(node.nodeValue) && (!node.nextSibling || isBlockElement(blockElements, node.nextSibling))) {
          return true
        }
      }
      return false
    }
    const addRootBlocks = function (editor) {
      const { dom } = editor; const { selection } = editor
      const { schema } = editor; const blockElements = schema.getBlockElements()
      let node = selection.getStart()
      const rootNode = editor.getBody()
      let rng
      let startContainer, startOffset, endContainer, endOffset, rootBlockNode
      let tempNode, wrapped, restoreSelection
      let rootNodeName
      const forcedRootBlock = Settings.getForcedRootBlock(editor)
      if (!node || !NodeType.isElement(node) || !forcedRootBlock) {
        return
      }
      rootNodeName = rootNode.nodeName.toLowerCase()
      if (!schema.isValidChild(rootNodeName, forcedRootBlock.toLowerCase()) || hasBlockParent(blockElements, rootNode, node)) {
        return
      }
      rng = selection.getRng()
      startContainer = rng.startContainer
      startOffset = rng.startOffset
      endContainer = rng.endContainer
      endOffset = rng.endOffset
      restoreSelection = EditorFocus.hasFocus(editor)
      node = rootNode.firstChild
      while (node) {
        if (isValidTarget(blockElements, node)) {
          if (shouldRemoveTextNode(blockElements, node)) {
            tempNode = node
            node = node.nextSibling
            dom.remove(tempNode)
            continue
          }
          if (!rootBlockNode) {
            rootBlockNode = dom.create(forcedRootBlock, editor.settings.forced_root_block_attrs)
            node.parentNode.insertBefore(rootBlockNode, node)
            wrapped = true
          }
          tempNode = node
          node = node.nextSibling
          rootBlockNode.appendChild(tempNode)
        } else {
          rootBlockNode = null
          node = node.nextSibling
        }
      }
      if (wrapped && restoreSelection) {
        rng.setStart(startContainer, startOffset)
        rng.setEnd(endContainer, endOffset)
        selection.setRng(rng)
        editor.nodeChanged()
      }
    }
    const setup$2 = function (editor) {
      if (Settings.getForcedRootBlock(editor)) {
        editor.on('NodeChange', curry(addRootBlocks, editor))
      }
    }
    const ForceBlocks = { setup: setup$2 }

    const isEq$1 = function (rng1, rng2) {
      return rng1 && rng2 && (rng1.startContainer === rng2.startContainer && rng1.startOffset === rng2.startOffset) && (rng1.endContainer === rng2.endContainer && rng1.endOffset === rng2.endOffset)
    }
    const RangeCompare = { isEq: isEq$1 }

    const getStartNode = function (rng) {
      const sc = rng.startContainer; const so = rng.startOffset
      if (NodeType.isText(sc)) {
        return so === 0 ? Option.some(Element$$1.fromDom(sc)) : Option.none()
      }
      return Option.from(sc.childNodes[so]).map(Element$$1.fromDom)
    }
    const getEndNode = function (rng) {
      const ec = rng.endContainer; const eo = rng.endOffset
      if (NodeType.isText(ec)) {
        return eo === ec.data.length ? Option.some(Element$$1.fromDom(ec)) : Option.none()
      }
      return Option.from(ec.childNodes[eo - 1]).map(Element$$1.fromDom)
    }
    var getFirstChildren = function (node) {
      return firstChild(node).fold(constant([node]), (child$$1) => [node].concat(getFirstChildren(child$$1)))
    }
    var getLastChildren = function (node) {
      return lastChild(node).fold(constant([node]), (child$$1) => {
        if (name(child$$1) === 'br') {
          return prevSibling(child$$1).map((sibling) => [node].concat(getLastChildren(sibling))).getOr([])
        }
        return [node].concat(getLastChildren(child$$1))
      })
    }
    const hasAllContentsSelected = function (elm, rng) {
      return liftN([
        getStartNode(rng),
        getEndNode(rng),
      ], (startNode, endNode) => {
        const start = find(getFirstChildren(elm), curry(eq, startNode))
        const end = find(getLastChildren(elm), curry(eq, endNode))
        return start.isSome() && end.isSome()
      }).getOr(false)
    }
    const moveEndPoint$1 = function (dom, rng, node, start) {
      const root = node; const walker = new TreeWalker(node, root)
      const nonEmptyElementsMap = dom.schema.getNonEmptyElements()
      do {
        if (node.nodeType === 3 && Tools.trim(node.nodeValue).length !== 0) {
          if (start) {
            rng.setStart(node, 0)
          } else {
            rng.setEnd(node, node.nodeValue.length)
          }
          return
        }
        if (nonEmptyElementsMap[node.nodeName] && !/^(TD|TH)$/.test(node.nodeName)) {
          if (start) {
            rng.setStartBefore(node)
          } else if (node.nodeName === 'BR') {
            rng.setEndBefore(node)
          } else {
            rng.setEndAfter(node)
          }
          return
        }
        if (Env.ie && Env.ie < 11 && dom.isBlock(node) && dom.isEmpty(node)) {
          if (start) {
            rng.setStart(node, 0)
          } else {
            rng.setEnd(node, 0)
          }
          return
        }
      } while (node = start ? walker.next() : walker.prev())
      if (root.nodeName === 'BODY') {
        if (start) {
          rng.setStart(root, 0)
        } else {
          rng.setEnd(root, root.childNodes.length)
        }
      }
    }
    const hasAnyRanges = function (editor) {
      const sel = editor.selection.getSel()
      return sel && sel.rangeCount > 0
    }

    function NodeChange(editor) {
      let lastRng; let lastPath = []
      const isSameElementPath = function (startElm) {
        let i, currentPath
        currentPath = editor.$(startElm).parentsUntil(editor.getBody()).add(startElm)
        if (currentPath.length === lastPath.length) {
          for (i = currentPath.length; i >= 0; i--) {
            if (currentPath[i] !== lastPath[i]) {
              break
            }
          }
          if (i === -1) {
            lastPath = currentPath
            return true
          }
        }
        lastPath = currentPath
        return false
      }
      if (!('onselectionchange' in editor.getDoc())) {
        editor.on('NodeChange Click MouseUp KeyUp Focus', (e) => {
          let nativeRng, fakeRng
          nativeRng = editor.selection.getRng()
          fakeRng = {
            startContainer: nativeRng.startContainer,
            startOffset: nativeRng.startOffset,
            endContainer: nativeRng.endContainer,
            endOffset: nativeRng.endOffset,
          }
          if (e.type === 'nodechange' || !RangeCompare.isEq(fakeRng, lastRng)) {
            editor.fire('SelectionChange')
          }
          lastRng = fakeRng
        })
      }
      editor.on('contextmenu', () => {
        editor.fire('SelectionChange')
      })
      editor.on('SelectionChange', () => {
        const startElm = editor.selection.getStart(true)
        if (!startElm || !Env.range && editor.selection.isCollapsed()) {
          return
        }
        if (hasAnyRanges(editor) && !isSameElementPath(startElm) && editor.dom.isChildOf(startElm, editor.getBody())) {
          editor.nodeChanged({ selectionChange: true })
        }
      })
      editor.on('MouseUp', (e) => {
        if (!e.isDefaultPrevented() && hasAnyRanges(editor)) {
          if (editor.selection.getNode().nodeName === 'IMG') {
            Delay.setEditorTimeout(editor, () => {
              editor.nodeChanged()
            })
          } else {
            editor.nodeChanged()
          }
        }
      })
      this.nodeChanged = function (args) {
        const { selection } = editor
        let node, parents, root
        if (editor.initialized && selection && !editor.settings.disable_nodechange && !editor.readonly) {
          root = editor.getBody()
          node = selection.getStart(true) || root
          if (node.ownerDocument !== editor.getDoc() || !editor.dom.isChildOf(node, root)) {
            node = root
          }
          parents = []
          editor.dom.getParent(node, (node) => {
            if (node === root) {
              return true
            }
            parents.push(node)
          })
          args = args || {}
          args.element = node
          args.parents = parents
          editor.fire('NodeChange', args)
        }
      }
    }

    const getAbsolutePosition = function (elm) {
      let doc, docElem, win, clientRect
      clientRect = elm.getBoundingClientRect()
      doc = elm.ownerDocument
      docElem = doc.documentElement
      win = doc.defaultView
      return {
        top: clientRect.top + win.pageYOffset - docElem.clientTop,
        left: clientRect.left + win.pageXOffset - docElem.clientLeft,
      }
    }
    const getBodyPosition = function (editor) {
      return editor.inline ? getAbsolutePosition(editor.getBody()) : {
        left: 0,
        top: 0,
      }
    }
    const getScrollPosition = function (editor) {
      const body = editor.getBody()
      return editor.inline ? {
        left: body.scrollLeft,
        top: body.scrollTop,
      } : {
        left: 0,
        top: 0,
      }
    }
    const getBodyScroll = function (editor) {
      const body = editor.getBody(); const docElm = editor.getDoc().documentElement
      const inlineScroll = {
        left: body.scrollLeft,
        top: body.scrollTop,
      }
      const iframeScroll = {
        left: body.scrollLeft || docElm.scrollLeft,
        top: body.scrollTop || docElm.scrollTop,
      }
      return editor.inline ? inlineScroll : iframeScroll
    }
    const getMousePosition = function (editor, event) {
      if (event.target.ownerDocument !== editor.getDoc()) {
        const iframePosition = getAbsolutePosition(editor.getContentAreaContainer())
        const scrollPosition = getBodyScroll(editor)
        return {
          left: event.pageX - iframePosition.left + scrollPosition.left,
          top: event.pageY - iframePosition.top + scrollPosition.top,
        }
      }
      return {
        left: event.pageX,
        top: event.pageY,
      }
    }
    const calculatePosition = function (bodyPosition, scrollPosition, mousePosition) {
      return {
        pageX: mousePosition.left - bodyPosition.left + scrollPosition.left,
        pageY: mousePosition.top - bodyPosition.top + scrollPosition.top,
      }
    }
    const calc = function (editor, event) {
      return calculatePosition(getBodyPosition(editor), getScrollPosition(editor), getMousePosition(editor, event))
    }
    const MousePosition = { calc }

    const isContentEditableFalse$6 = NodeType.isContentEditableFalse; const isContentEditableTrue$3 = NodeType.isContentEditableTrue
    const isDraggable = function (rootElm, elm) {
      return isContentEditableFalse$6(elm) && elm !== rootElm
    }
    const isValidDropTarget = function (editor, targetElement, dragElement) {
      if (targetElement === dragElement || editor.dom.isChildOf(targetElement, dragElement)) {
        return false
      }
      if (isContentEditableFalse$6(targetElement)) {
        return false
      }
      return true
    }
    const cloneElement = function (elm) {
      const cloneElm = elm.cloneNode(true)
      cloneElm.removeAttribute('data-mce-selected')
      return cloneElm
    }
    const createGhost = function (editor, elm, width, height) {
      const clonedElm = elm.cloneNode(true)
      editor.dom.setStyles(clonedElm, {
        width,
        height,
      })
      editor.dom.setAttrib(clonedElm, 'data-mce-selected', null)
      const ghostElm = editor.dom.create('div', {
        class: 'mce-drag-container',
        'data-mce-bogus': 'all',
        unselectable: 'on',
        contenteditable: 'false',
      })
      editor.dom.setStyles(ghostElm, {
        position: 'absolute',
        opacity: 0.5,
        overflow: 'hidden',
        border: 0,
        padding: 0,
        margin: 0,
        width,
        height,
      })
      editor.dom.setStyles(clonedElm, {
        margin: 0,
        boxSizing: 'border-box',
      })
      ghostElm.appendChild(clonedElm)
      return ghostElm
    }
    const appendGhostToBody = function (ghostElm, bodyElm) {
      if (ghostElm.parentNode !== bodyElm) {
        bodyElm.appendChild(ghostElm)
      }
    }
    const moveGhost = function (ghostElm, position, width, height, maxX, maxY) {
      let overflowX = 0; let overflowY = 0
      ghostElm.style.left = `${position.pageX}px`
      ghostElm.style.top = `${position.pageY}px`
      if (position.pageX + width > maxX) {
        overflowX = position.pageX + width - maxX
      }
      if (position.pageY + height > maxY) {
        overflowY = position.pageY + height - maxY
      }
      ghostElm.style.width = `${width - overflowX}px`
      ghostElm.style.height = `${height - overflowY}px`
    }
    const removeElement = function (elm) {
      if (elm && elm.parentNode) {
        elm.parentNode.removeChild(elm)
      }
    }
    const isLeftMouseButtonPressed = function (e) {
      return e.button === 0
    }
    const hasDraggableElement = function (state) {
      return state.element
    }
    const applyRelPos = function (state, position) {
      return {
        pageX: position.pageX - state.relX,
        pageY: position.pageY + 5,
      }
    }
    const start = function (state, editor) {
      return function (e) {
        if (isLeftMouseButtonPressed(e)) {
          const ceElm = find(editor.dom.getParents(e.target), Predicate.or(isContentEditableFalse$6, isContentEditableTrue$3)).getOr(null)
          if (isDraggable(editor.getBody(), ceElm)) {
            const elmPos = editor.dom.getPos(ceElm)
            const bodyElm = editor.getBody()
            const docElm = editor.getDoc().documentElement
            state.element = ceElm
            state.screenX = e.screenX
            state.screenY = e.screenY
            state.maxX = (editor.inline ? bodyElm.scrollWidth : docElm.offsetWidth) - 2
            state.maxY = (editor.inline ? bodyElm.scrollHeight : docElm.offsetHeight) - 2
            state.relX = e.pageX - elmPos.x
            state.relY = e.pageY - elmPos.y
            state.width = ceElm.offsetWidth
            state.height = ceElm.offsetHeight
            state.ghost = createGhost(editor, ceElm, state.width, state.height)
          }
        }
      }
    }
    const move = function (state, editor) {
      const throttledPlaceCaretAt = Delay.throttle((clientX, clientY) => {
        editor._selectionOverrides.hideFakeCaret()
        editor.selection.placeCaretAt(clientX, clientY)
      }, 0)
      return function (e) {
        const movement = Math.max(Math.abs(e.screenX - state.screenX), Math.abs(e.screenY - state.screenY))
        if (hasDraggableElement(state) && !state.dragging && movement > 10) {
          const args = editor.fire('dragstart', { target: state.element })
          if (args.isDefaultPrevented()) {
            return
          }
          state.dragging = true
          editor.focus()
        }
        if (state.dragging) {
          const targetPos = applyRelPos(state, MousePosition.calc(editor, e))
          appendGhostToBody(state.ghost, editor.getBody())
          moveGhost(state.ghost, targetPos, state.width, state.height, state.maxX, state.maxY)
          throttledPlaceCaretAt(e.clientX, e.clientY)
        }
      }
    }
    const getRawTarget = function (selection) {
      const rng = selection.getSel().getRangeAt(0)
      const { startContainer } = rng
      return startContainer.nodeType === 3 ? startContainer.parentNode : startContainer
    }
    const drop = function (state, editor) {
      return function (e) {
        if (state.dragging) {
          if (isValidDropTarget(editor, getRawTarget(editor.selection), state.element)) {
            let targetClone_1 = cloneElement(state.element)
            const args = editor.fire('drop', {
              targetClone: targetClone_1,
              clientX: e.clientX,
              clientY: e.clientY,
            })
            if (!args.isDefaultPrevented()) {
              targetClone_1 = args.targetClone
              editor.undoManager.transact(() => {
                removeElement(state.element)
                editor.insertContent(editor.dom.getOuterHTML(targetClone_1))
                editor._selectionOverrides.hideFakeCaret()
              })
            }
          }
        }
        removeDragState(state)
      }
    }
    const stop$$1 = function (state, editor) {
      return function () {
        if (state.dragging) {
          editor.fire('dragend')
        }
        removeDragState(state)
      }
    }
    var removeDragState = function (state) {
      state.dragging = false
      state.element = null
      removeElement(state.ghost)
    }
    const bindFakeDragEvents = function (editor) {
      const state = {}
      let pageDom, dragStartHandler, dragHandler, dropHandler, dragEndHandler, rootDocument
      pageDom = DOMUtils$1.DOM
      rootDocument = document
      dragStartHandler = start(state, editor)
      dragHandler = move(state, editor)
      dropHandler = drop(state, editor)
      dragEndHandler = stop$$1(state, editor)
      editor.on('mousedown', dragStartHandler)
      editor.on('mousemove', dragHandler)
      editor.on('mouseup', dropHandler)
      pageDom.bind(rootDocument, 'mousemove', dragHandler)
      pageDom.bind(rootDocument, 'mouseup', dragEndHandler)
      editor.on('remove', () => {
        pageDom.unbind(rootDocument, 'mousemove', dragHandler)
        pageDom.unbind(rootDocument, 'mouseup', dragEndHandler)
      })
    }
    const blockIeDrop = function (editor) {
      editor.on('drop', (e) => {
        const realTarget = typeof e.clientX !== 'undefined' ? editor.getDoc().elementFromPoint(e.clientX, e.clientY) : null
        if (isContentEditableFalse$6(realTarget) || isContentEditableFalse$6(editor.dom.getContentEditableParent(realTarget))) {
          e.preventDefault()
        }
      })
    }
    const init = function (editor) {
      bindFakeDragEvents(editor)
      blockIeDrop(editor)
    }
    const DragDropOverrides = { init }

    const getNodeClientRects = function (node) {
      const toArrayWithNode = function (clientRects) {
        return map(clientRects, (clientRect) => {
          clientRect = clone$2(clientRect)
          clientRect.node = node
          return clientRect
        })
      }
      if (NodeType.isElement(node)) {
        return toArrayWithNode(node.getClientRects())
      }
      if (NodeType.isText(node)) {
        const rng = node.ownerDocument.createRange()
        rng.setStart(node, 0)
        rng.setEnd(node, node.data.length)
        return toArrayWithNode(rng.getClientRects())
      }
    }
    const getClientRects = function (node) {
      return foldl(node, (result, node) => result.concat(getNodeClientRects(node)), [])
    }

    let VDirection;
    (function (VDirection) {
      VDirection[VDirection.Up = -1] = 'Up'
      VDirection[VDirection.Down = 1] = 'Down'
    }(VDirection || (VDirection = {})))
    const findUntil = function (direction, root, predicateFn, node) {
      while (node = findNode(node, direction, isEditableCaretCandidate, root)) {
        if (predicateFn(node)) {
          return
        }
      }
    }
    const walkUntil = function (direction, isAboveFn, isBeflowFn, root, predicateFn, caretPosition) {
      let line = 0; let node
      const result = []
      let targetClientRect
      const add = function (node) {
        let i, clientRect, clientRects
        clientRects = getClientRects([node])
        if (direction === -1) {
          clientRects = clientRects.reverse()
        }
        for (i = 0; i < clientRects.length; i++) {
          clientRect = clientRects[i]
          if (isBeflowFn(clientRect, targetClientRect)) {
            continue
          }
          if (result.length > 0 && isAboveFn(clientRect, ArrUtils.last(result))) {
            line++
          }
          clientRect.line = line
          if (predicateFn(clientRect)) {
            return true
          }
          result.push(clientRect)
        }
      }
      targetClientRect = ArrUtils.last(caretPosition.getClientRects())
      if (!targetClientRect) {
        return result
      }
      node = caretPosition.getNode()
      add(node)
      findUntil(direction, root, add, node)
      return result
    }
    const aboveLineNumber = function (lineNumber, clientRect) {
      return clientRect.line > lineNumber
    }
    const isLineNumber = function (lineNumber, clientRect) {
      return clientRect.line === lineNumber
    }
    const upUntil = curry(walkUntil, VDirection.Up, isAbove, isBelow)
    const downUntil = curry(walkUntil, VDirection.Down, isBelow, isAbove)
    const positionsUntil = function (direction, root, predicateFn, node) {
      const caretWalker = CaretWalker(root)
      let walkFn, isBelowFn, isAboveFn, caretPosition
      const result = []
      let line = 0; let clientRect; let targetClientRect
      const getClientRect = function (caretPosition) {
        if (direction === 1) {
          return ArrUtils.last(caretPosition.getClientRects())
        }
        return ArrUtils.last(caretPosition.getClientRects())
      }
      if (direction === 1) {
        walkFn = caretWalker.next
        isBelowFn = isBelow
        isAboveFn = isAbove
        caretPosition = CaretPosition$1.after(node)
      } else {
        walkFn = caretWalker.prev
        isBelowFn = isAbove
        isAboveFn = isBelow
        caretPosition = CaretPosition$1.before(node)
      }
      targetClientRect = getClientRect(caretPosition)
      do {
        if (!caretPosition.isVisible()) {
          continue
        }
        clientRect = getClientRect(caretPosition)
        if (isAboveFn(clientRect, targetClientRect)) {
          continue
        }
        if (result.length > 0 && isBelowFn(clientRect, ArrUtils.last(result))) {
          line++
        }
        clientRect = clone$2(clientRect)
        clientRect.position = caretPosition
        clientRect.line = line
        if (predicateFn(clientRect)) {
          return result
        }
        result.push(clientRect)
      } while (caretPosition = walkFn(caretPosition))
      return result
    }
    const isAboveLine = function (lineNumber) {
      return function (clientRect) {
        return aboveLineNumber(lineNumber, clientRect)
      }
    }
    const isLine = function (lineNumber) {
      return function (clientRect) {
        return isLineNumber(lineNumber, clientRect)
      }
    }

    const isContentEditableFalse$7 = NodeType.isContentEditableFalse
    const findNode$1 = findNode
    const distanceToRectLeft = function (clientRect, clientX) {
      return Math.abs(clientRect.left - clientX)
    }
    const distanceToRectRight = function (clientRect, clientX) {
      return Math.abs(clientRect.right - clientX)
    }
    const isInside = function (clientX, clientRect) {
      return clientX >= clientRect.left && clientX <= clientRect.right
    }
    const findClosestClientRect = function (clientRects, clientX) {
      return ArrUtils.reduce(clientRects, (oldClientRect, clientRect) => {
        let oldDistance, newDistance
        oldDistance = Math.min(distanceToRectLeft(oldClientRect, clientX), distanceToRectRight(oldClientRect, clientX))
        newDistance = Math.min(distanceToRectLeft(clientRect, clientX), distanceToRectRight(clientRect, clientX))
        if (isInside(clientX, clientRect)) {
          return clientRect
        }
        if (isInside(clientX, oldClientRect)) {
          return oldClientRect
        }
        if (newDistance === oldDistance && isContentEditableFalse$7(clientRect.node)) {
          return clientRect
        }
        if (newDistance < oldDistance) {
          return clientRect
        }
        return oldClientRect
      })
    }
    const walkUntil$1 = function (direction, root, predicateFn, node) {
      while (node = findNode$1(node, direction, isEditableCaretCandidate, root)) {
        if (predicateFn(node)) {
          return
        }
      }
    }
    const findLineNodeRects = function (root, targetNodeRect) {
      let clientRects = []
      const collect = function (checkPosFn, node) {
        let lineRects
        lineRects = filter(getClientRects([node]), (clientRect) => !checkPosFn(clientRect, targetNodeRect))
        clientRects = clientRects.concat(lineRects)
        return lineRects.length === 0
      }
      clientRects.push(targetNodeRect)
      walkUntil$1(VDirection.Up, root, curry(collect, isAbove), targetNodeRect.node)
      walkUntil$1(VDirection.Down, root, curry(collect, isBelow), targetNodeRect.node)
      return clientRects
    }
    const getFakeCaretTargets = function (root) {
      return filter(from$1(root.getElementsByTagName('*')), isFakeCaretTarget)
    }
    const caretInfo = function (clientRect, clientX) {
      return {
        node: clientRect.node,
        before: distanceToRectLeft(clientRect, clientX) < distanceToRectRight(clientRect, clientX),
      }
    }
    const closestCaret = function (root, clientX, clientY) {
      let closestNodeRect
      const contentEditableFalseNodeRects = getClientRects(getFakeCaretTargets(root))
      const targetNodeRects = filter(contentEditableFalseNodeRects, (rect) => clientY >= rect.top && clientY <= rect.bottom)
      closestNodeRect = findClosestClientRect(targetNodeRects, clientX)
      if (closestNodeRect) {
        closestNodeRect = findClosestClientRect(findLineNodeRects(root, closestNodeRect), clientX)
        if (closestNodeRect && isFakeCaretTarget(closestNodeRect.node)) {
          return caretInfo(closestNodeRect, clientX)
        }
      }
      return null
    }

    const isXYWithinRange = function (clientX, clientY, range$$1) {
      if (range$$1.collapsed) {
        return false
      }
      return foldl(range$$1.getClientRects(), (state, rect) => state || containsXY(rect, clientX, clientY), false)
    }
    const RangePoint = { isXYWithinRange }

    const isContentEditableTrue$4 = NodeType.isContentEditableTrue
    const isContentEditableFalse$8 = NodeType.isContentEditableFalse
    const showCaret = function (direction, editor, node, before, scrollIntoView) {
      return editor._selectionOverrides.showCaret(direction, node, before, scrollIntoView)
    }
    const getNodeRange = function (node) {
      const rng = node.ownerDocument.createRange()
      rng.selectNode(node)
      return rng
    }
    const selectNode = function (editor, node) {
      const e = editor.fire('BeforeObjectSelected', { target: node })
      if (e.isDefaultPrevented()) {
        return null
      }
      return getNodeRange(node)
    }
    const renderCaretAtRange = function (editor, range, scrollIntoView) {
      const normalizedRange = normalizeRange(1, editor.getBody(), range)
      const caretPosition = CaretPosition$1.fromRangeStart(normalizedRange)
      const caretPositionNode = caretPosition.getNode()
      if (isContentEditableFalse$8(caretPositionNode)) {
        return showCaret(1, editor, caretPositionNode, !caretPosition.isAtEnd(), false)
      }
      const caretPositionBeforeNode = caretPosition.getNode(true)
      if (isContentEditableFalse$8(caretPositionBeforeNode)) {
        return showCaret(1, editor, caretPositionBeforeNode, false, false)
      }
      const ceRoot = editor.dom.getParent(caretPosition.getNode(), (node) => isContentEditableFalse$8(node) || isContentEditableTrue$4(node))
      if (isContentEditableFalse$8(ceRoot)) {
        return showCaret(1, editor, ceRoot, false, scrollIntoView)
      }
      return null
    }
    const renderRangeCaret = function (editor, range, scrollIntoView) {
      if (!range || !range.collapsed) {
        return range
      }
      const caretRange = renderCaretAtRange(editor, range, scrollIntoView)
      if (caretRange) {
        return caretRange
      }
      return range
    }

    const setup$3 = function (editor) {
      const renderFocusCaret = first$1(() => {
        if (!editor.removed && editor.getBody().contains(document.activeElement)) {
          const rng = editor.selection.getRng()
          if (rng.collapsed) {
            const caretRange = renderRangeCaret(editor, editor.selection.getRng(), false)
            editor.selection.setRng(caretRange)
          }
        }
      }, 0)
      editor.on('focus', () => {
        renderFocusCaret.throttle()
      })
      editor.on('blur', () => {
        renderFocusCaret.cancel()
      })
    }
    const CefFocus = { setup: setup$3 }

    const VK = {
      BACKSPACE: 8,
      DELETE: 46,
      DOWN: 40,
      ENTER: 13,
      LEFT: 37,
      RIGHT: 39,
      SPACEBAR: 32,
      TAB: 9,
      UP: 38,
      modifierPressed(e) {
        return e.shiftKey || e.ctrlKey || e.altKey || this.metaKeyPressed(e)
      },
      metaKeyPressed(e) {
        return Env.mac ? e.metaKey : e.ctrlKey && !e.altKey
      },
    }

    const isContentEditableTrue$5 = NodeType.isContentEditableTrue
    const isContentEditableFalse$9 = NodeType.isContentEditableFalse
    const isAfterContentEditableFalse$1 = isAfterContentEditableFalse
    const isBeforeContentEditableFalse$1 = isBeforeContentEditableFalse
    const getContentEditableRoot = function (editor, node) {
      const root = editor.getBody()
      while (node && node !== root) {
        if (isContentEditableTrue$5(node) || isContentEditableFalse$9(node)) {
          return node
        }
        node = node.parentNode
      }
      return null
    }
    const SelectionOverrides = function (editor) {
      const isBlock = function (node) {
        return editor.dom.isBlock(node)
      }
      const rootNode = editor.getBody()
      const fakeCaret = FakeCaret(editor.getBody(), isBlock, () => EditorFocus.hasFocus(editor))
      const realSelectionId = `sel-${editor.dom.uniqueId()}`
      let selectedContentEditableNode
      const isFakeSelectionElement = function (elm) {
        return editor.dom.hasClass(elm, 'mce-offscreen-selection')
      }
      const getRealSelectionElement = function () {
        const container = editor.dom.get(realSelectionId)
        return container ? container.getElementsByTagName('*')[0] : container
      }
      const setRange = function (range$$1) {
        if (range$$1) {
          editor.selection.setRng(range$$1)
        }
      }
      const getRange = function () {
        return editor.selection.getRng()
      }
      const showCaret$$1 = function (direction, node, before, scrollIntoView) {
        if (scrollIntoView === void 0) {
          scrollIntoView = true
        }
        let e
        e = editor.fire('ShowCaret', {
          target: node,
          direction,
          before,
        })
        if (e.isDefaultPrevented()) {
          return null
        }
        if (scrollIntoView) {
          editor.selection.scrollIntoView(node, direction === -1)
        }
        return fakeCaret.show(before, node)
      }
      const getNormalizedRangeEndPoint$$1 = function (direction, range$$1) {
        range$$1 = normalizeRange(direction, rootNode, range$$1)
        if (direction === -1) {
          return CaretPosition$1.fromRangeStart(range$$1)
        }
        return CaretPosition$1.fromRangeEnd(range$$1)
      }
      const showBlockCaretContainer = function (blockCaretContainer) {
        if (blockCaretContainer.hasAttribute('data-mce-caret')) {
          showCaretContainerBlock(blockCaretContainer)
          setRange(getRange())
          editor.selection.scrollIntoView(blockCaretContainer[0])
        }
      }
      const registerEvents = function () {
        editor.on('mouseup', (e) => {
          const range$$1 = getRange()
          if (range$$1.collapsed && EditorView.isXYInContentArea(editor, e.clientX, e.clientY)) {
            setRange(renderCaretAtRange(editor, range$$1, false))
          }
        })
        editor.on('click', (e) => {
          let contentEditableRoot
          contentEditableRoot = getContentEditableRoot(editor, e.target)
          if (contentEditableRoot) {
            if (isContentEditableFalse$9(contentEditableRoot)) {
              e.preventDefault()
              editor.focus()
            }
            if (isContentEditableTrue$5(contentEditableRoot)) {
              if (editor.dom.isChildOf(contentEditableRoot, editor.selection.getNode())) {
                removeContentEditableSelection()
              }
            }
          }
        })
        editor.on('blur NewBlock', () => {
          removeContentEditableSelection()
        })
        editor.on('ResizeWindow FullscreenStateChanged', () => fakeCaret.reposition())
        const handleTouchSelect = function (editor) {
          let moved = false
          editor.on('touchstart', () => {
            moved = false
          })
          editor.on('touchmove', () => {
            moved = true
          })
          editor.on('touchend', (e) => {
            const contentEditableRoot = getContentEditableRoot(editor, e.target)
            if (isContentEditableFalse$9(contentEditableRoot)) {
              if (!moved) {
                e.preventDefault()
                setContentEditableSelection(selectNode(editor, contentEditableRoot))
              }
            }
          })
        }
        const hasNormalCaretPosition = function (elm) {
          const caretWalker = CaretWalker(elm)
          if (!elm.firstChild) {
            return false
          }
          const startPos = CaretPosition$1.before(elm.firstChild)
          const newPos = caretWalker.next(startPos)
          return newPos && !isBeforeContentEditableFalse$1(newPos) && !isAfterContentEditableFalse$1(newPos)
        }
        const isInSameBlock$$1 = function (node1, node2) {
          const block1 = editor.dom.getParent(node1, editor.dom.isBlock)
          const block2 = editor.dom.getParent(node2, editor.dom.isBlock)
          return block1 === block2
        }
        const hasBetterMouseTarget = function (targetNode, caretNode) {
          const targetBlock = editor.dom.getParent(targetNode, editor.dom.isBlock)
          const caretBlock = editor.dom.getParent(caretNode, editor.dom.isBlock)
          if (targetBlock && editor.dom.isChildOf(targetBlock, caretBlock) && isContentEditableFalse$9(getContentEditableRoot(editor, targetBlock)) === false) {
            return true
          }
          return targetBlock && !isInSameBlock$$1(targetBlock, caretBlock) && hasNormalCaretPosition(targetBlock)
        }
        handleTouchSelect(editor)
        editor.on('mousedown', (e) => {
          let contentEditableRoot
          const targetElm = e.target
          if (targetElm !== rootNode && targetElm.nodeName !== 'HTML' && !editor.dom.isChildOf(targetElm, rootNode)) {
            return
          }
          if (EditorView.isXYInContentArea(editor, e.clientX, e.clientY) === false) {
            return
          }
          contentEditableRoot = getContentEditableRoot(editor, targetElm)
          if (contentEditableRoot) {
            if (isContentEditableFalse$9(contentEditableRoot)) {
              e.preventDefault()
              setContentEditableSelection(selectNode(editor, contentEditableRoot))
            } else {
              removeContentEditableSelection()
              if (!(isContentEditableTrue$5(contentEditableRoot) && e.shiftKey) && !RangePoint.isXYWithinRange(e.clientX, e.clientY, editor.selection.getRng())) {
                hideFakeCaret()
                editor.selection.placeCaretAt(e.clientX, e.clientY)
              }
            }
          } else if (isFakeCaretTarget(targetElm) === false) {
            removeContentEditableSelection()
            hideFakeCaret()
            const caretInfo = closestCaret(rootNode, e.clientX, e.clientY)
            if (caretInfo) {
              if (!hasBetterMouseTarget(e.target, caretInfo.node)) {
                e.preventDefault()
                const range$$1 = showCaret$$1(1, caretInfo.node, caretInfo.before, false)
                editor.getBody().focus()
                setRange(range$$1)
              }
            }
          }
        })
        editor.on('keypress', (e) => {
          if (VK.modifierPressed(e)) {
            return
          }
          switch (e.keyCode) {
            default:
              if (isContentEditableFalse$9(editor.selection.getNode())) {
                e.preventDefault()
              }
              break
          }
        })
        editor.on('getSelectionRange', (e) => {
          let rng = e.range
          if (selectedContentEditableNode) {
            if (!selectedContentEditableNode.parentNode) {
              selectedContentEditableNode = null
              return
            }
            rng = rng.cloneRange()
            rng.selectNode(selectedContentEditableNode)
            e.range = rng
          }
        })
        editor.on('setSelectionRange', (e) => {
          let rng
          rng = setContentEditableSelection(e.range, e.forward)
          if (rng) {
            e.range = rng
          }
        })
        const isPasteBin = function (node) {
          return node.id === 'mcepastebin'
        }
        editor.on('AfterSetSelectionRange', (e) => {
          const rng = e.range
          if (!isRangeInCaretContainer(rng) && !isPasteBin(rng.startContainer.parentNode)) {
            hideFakeCaret()
          }
          if (!isFakeSelectionElement(rng.startContainer.parentNode)) {
            removeContentEditableSelection()
          }
        })
        editor.on('copy', (e) => {
          const { clipboardData } = e
          if (!e.isDefaultPrevented() && e.clipboardData && !Env.ie) {
            const realSelectionElement = getRealSelectionElement()
            if (realSelectionElement) {
              e.preventDefault()
              clipboardData.clearData()
              clipboardData.setData('text/html', realSelectionElement.outerHTML)
              clipboardData.setData('text/plain', realSelectionElement.outerText)
            }
          }
        })
        DragDropOverrides.init(editor)
        CefFocus.setup(editor)
      }
      const isWithinCaretContainer = function (node) {
        return isCaretContainer(node) || startsWithCaretContainer(node) || endsWithCaretContainer(node)
      }
      var isRangeInCaretContainer = function (rng) {
        return isWithinCaretContainer(rng.startContainer) || isWithinCaretContainer(rng.endContainer)
      }
      var setContentEditableSelection = function (range$$1, forward) {
        let node
        const { $ } = editor
        const { dom } = editor
        let $realSelectionContainer, sel, startContainer, startOffset, endOffset, e, caretPosition, targetClone, origTargetClone
        if (!range$$1) {
          return null
        }
        if (range$$1.collapsed) {
          if (!isRangeInCaretContainer(range$$1)) {
            if (forward === false) {
              caretPosition = getNormalizedRangeEndPoint$$1(-1, range$$1)
              if (isFakeCaretTarget(caretPosition.getNode(true))) {
                return showCaret$$1(-1, caretPosition.getNode(true), false, false)
              }
              if (isFakeCaretTarget(caretPosition.getNode())) {
                return showCaret$$1(-1, caretPosition.getNode(), !caretPosition.isAtEnd(), false)
              }
            } else {
              caretPosition = getNormalizedRangeEndPoint$$1(1, range$$1)
              if (isFakeCaretTarget(caretPosition.getNode())) {
                return showCaret$$1(1, caretPosition.getNode(), !caretPosition.isAtEnd(), false)
              }
              if (isFakeCaretTarget(caretPosition.getNode(true))) {
                return showCaret$$1(1, caretPosition.getNode(true), false, false)
              }
            }
          }
          return null
        }
        startContainer = range$$1.startContainer
        startOffset = range$$1.startOffset
        endOffset = range$$1.endOffset
        if (startContainer.nodeType === 3 && startOffset === 0 && isContentEditableFalse$9(startContainer.parentNode)) {
          startContainer = startContainer.parentNode
          startOffset = dom.nodeIndex(startContainer)
          startContainer = startContainer.parentNode
        }
        if (startContainer.nodeType !== 1) {
          return null
        }
        if (endOffset === startOffset + 1) {
          node = startContainer.childNodes[startOffset]
        }
        if (!isContentEditableFalse$9(node)) {
          return null
        }
        targetClone = origTargetClone = node.cloneNode(true)
        e = editor.fire('ObjectSelected', {
          target: node,
          targetClone,
        })
        if (e.isDefaultPrevented()) {
          return null
        }
        $realSelectionContainer = descendant$1(Element$$1.fromDom(editor.getBody()), `#${realSelectionId}`).fold(() => $([]), (elm) => $([elm.dom()]))
        targetClone = e.targetClone
        if ($realSelectionContainer.length === 0) {
          $realSelectionContainer = $('<div data-mce-bogus="all" class="mce-offscreen-selection"></div>').attr('id', realSelectionId)
          $realSelectionContainer.appendTo(editor.getBody())
        }
        range$$1 = editor.dom.createRng()
        if (targetClone === origTargetClone && Env.ie) {
          $realSelectionContainer.empty().append('<p style="font-size: 0" data-mce-bogus="all">\xA0</p>').append(targetClone)
          range$$1.setStartAfter($realSelectionContainer[0].firstChild.firstChild)
          range$$1.setEndAfter(targetClone)
        } else {
          $realSelectionContainer.empty().append('\xA0').append(targetClone).append('\xA0')
          range$$1.setStart($realSelectionContainer[0].firstChild, 1)
          range$$1.setEnd($realSelectionContainer[0].lastChild, 0)
        }
        $realSelectionContainer.css({ top: dom.getPos(node, editor.getBody()).y })
        $realSelectionContainer[0].focus()
        sel = editor.selection.getSel()
        sel.removeAllRanges()
        sel.addRange(range$$1)
        each(descendants$1(Element$$1.fromDom(editor.getBody()), '*[data-mce-selected]'), (elm) => {
          remove(elm, 'data-mce-selected')
        })
        node.setAttribute('data-mce-selected', '1')
        selectedContentEditableNode = node
        hideFakeCaret()
        return range$$1
      }
      var removeContentEditableSelection = function () {
        if (selectedContentEditableNode) {
          selectedContentEditableNode.removeAttribute('data-mce-selected')
          descendant$1(Element$$1.fromDom(editor.getBody()), `#${realSelectionId}`).each(remove$2)
          selectedContentEditableNode = null
        }
        descendant$1(Element$$1.fromDom(editor.getBody()), `#${realSelectionId}`).each(remove$2)
        selectedContentEditableNode = null
      }
      const destroy = function () {
        fakeCaret.destroy()
        selectedContentEditableNode = null
      }
      var hideFakeCaret = function () {
        fakeCaret.hide()
      }
      if (Env.ceFalse) {
        registerEvents()
      }
      return {
        showCaret: showCaret$$1,
        showBlockCaretContainer,
        hideFakeCaret,
        destroy,
      }
    }

    const KEEP = 0; const INSERT = 1; const DELETE = 2
    const diff = function (left, right) {
      const size = left.length + right.length + 2
      const vDown = new Array(size)
      const vUp = new Array(size)
      const snake = function (start, end, diag) {
        return {
          start,
          end,
          diag,
        }
      }
      var buildScript = function (start1, end1, start2, end2, script) {
        const middle = getMiddleSnake(start1, end1, start2, end2)
        if (middle === null || middle.start === end1 && middle.diag === end1 - end2 || middle.end === start1 && middle.diag === start1 - start2) {
          let i = start1
          let j = start2
          while (i < end1 || j < end2) {
            if (i < end1 && j < end2 && left[i] === right[j]) {
              script.push([
                KEEP,
                left[i],
              ])
              ++i
              ++j
            } else if (end1 - start1 > end2 - start2) {
              script.push([
                DELETE,
                left[i],
              ])
              ++i
            } else {
              script.push([
                INSERT,
                right[j],
              ])
              ++j
            }
          }
        } else {
          buildScript(start1, middle.start, start2, middle.start - middle.diag, script)
          for (let i2 = middle.start; i2 < middle.end; ++i2) {
            script.push([
              KEEP,
              left[i2],
            ])
          }
          buildScript(middle.end, end1, middle.end - middle.diag, end2, script)
        }
      }
      const buildSnake = function (start, diag, end1, end2) {
        let end = start
        while (end - diag < end2 && end < end1 && left[end] === right[end - diag]) {
          ++end
        }
        return snake(start, end, diag)
      }
      var getMiddleSnake = function (start1, end1, start2, end2) {
        const m = end1 - start1
        const n = end2 - start2
        if (m === 0 || n === 0) {
          return null
        }
        const delta = m - n
        const sum = n + m
        const offset = (sum % 2 === 0 ? sum : sum + 1) / 2
        vDown[1 + offset] = start1
        vUp[1 + offset] = end1 + 1
        let d, k, i, x, y
        for (d = 0; d <= offset; ++d) {
          for (k = -d; k <= d; k += 2) {
            i = k + offset
            if (k === -d || k !== d && vDown[i - 1] < vDown[i + 1]) {
              vDown[i] = vDown[i + 1]
            } else {
              vDown[i] = vDown[i - 1] + 1
            }
            x = vDown[i]
            y = x - start1 + start2 - k
            while (x < end1 && y < end2 && left[x] === right[y]) {
              vDown[i] = ++x
              ++y
            }
            if (delta % 2 !== 0 && delta - d <= k && k <= delta + d) {
              if (vUp[i - delta] <= vDown[i]) {
                return buildSnake(vUp[i - delta], k + start1 - start2, end1, end2)
              }
            }
          }
          for (k = delta - d; k <= delta + d; k += 2) {
            i = k + offset - delta
            if (k === delta - d || k !== delta + d && vUp[i + 1] <= vUp[i - 1]) {
              vUp[i] = vUp[i + 1] - 1
            } else {
              vUp[i] = vUp[i - 1]
            }
            x = vUp[i] - 1
            y = x - start1 + start2 - k
            while (x >= start1 && y >= start2 && left[x] === right[y]) {
              vUp[i] = x--
              y--
            }
            if (delta % 2 === 0 && -d <= k && k <= d) {
              if (vUp[i] <= vDown[i + delta]) {
                return buildSnake(vUp[i], k + start1 - start2, end1, end2)
              }
            }
          }
        }
      }
      const script = []
      buildScript(0, left.length, 0, right.length, script)
      return script
    }
    const Diff = {
      KEEP,
      DELETE,
      INSERT,
      diff,
    }

    const getOuterHtml = function (elm) {
      if (NodeType.isElement(elm)) {
        return elm.outerHTML
      } if (NodeType.isText(elm)) {
        return Entities.encodeRaw(elm.data, false)
      } if (NodeType.isComment(elm)) {
        return `<!--${elm.data}-->`
      }
      return ''
    }
    const createFragment$1 = function (html) {
      let frag, node, container
      container = document.createElement('div')
      frag = document.createDocumentFragment()
      if (html) {
        container.innerHTML = html
      }
      while (node = container.firstChild) {
        frag.appendChild(node)
      }
      return frag
    }
    const insertAt = function (elm, html, index) {
      const fragment = createFragment$1(html)
      if (elm.hasChildNodes() && index < elm.childNodes.length) {
        const target = elm.childNodes[index]
        target.parentNode.insertBefore(fragment, target)
      } else {
        elm.appendChild(fragment)
      }
    }
    const removeAt = function (elm, index) {
      if (elm.hasChildNodes() && index < elm.childNodes.length) {
        const target = elm.childNodes[index]
        target.parentNode.removeChild(target)
      }
    }
    const applyDiff = function (diff, elm) {
      let index = 0
      each(diff, (action) => {
        if (action[0] === Diff.KEEP) {
          index++
        } else if (action[0] === Diff.INSERT) {
          insertAt(elm, action[1], index)
          index++
        } else if (action[0] === Diff.DELETE) {
          removeAt(elm, index)
        }
      })
    }
    const read$1 = function (elm) {
      return filter(map(from$1(elm.childNodes), getOuterHtml), (item) => item.length > 0)
    }
    const write = function (fragments, elm) {
      const currentFragments = map(from$1(elm.childNodes), getOuterHtml)
      applyDiff(Diff.diff(currentFragments, fragments), elm)
      return elm
    }
    const Fragments = {
      read: read$1,
      write,
    }

    const undoLevelDocument = Cell(Option.none())
    const lazyTempDocument = function () {
      return undoLevelDocument.get().getOrThunk(() => {
        const doc = document.implementation.createHTMLDocument('undo')
        undoLevelDocument.set(Option.some(doc))
        return doc
      })
    }
    const hasIframes = function (html) {
      return html.indexOf('</iframe>') !== -1
    }
    const createFragmentedLevel = function (fragments) {
      return {
        type: 'fragmented',
        fragments,
        content: '',
        bookmark: null,
        beforeBookmark: null,
      }
    }
    const createCompleteLevel = function (content) {
      return {
        type: 'complete',
        fragments: null,
        content,
        bookmark: null,
        beforeBookmark: null,
      }
    }
    const createFromEditor = function (editor) {
      let fragments, content, trimmedFragments
      fragments = Fragments.read(editor.getBody())
      trimmedFragments = bind(fragments, (html) => {
        const trimmed = TrimHtml.trimInternal(editor.serializer, html)
        return trimmed.length > 0 ? [trimmed] : []
      })
      content = trimmedFragments.join('')
      return hasIframes(content) ? createFragmentedLevel(trimmedFragments) : createCompleteLevel(content)
    }
    const applyToEditor = function (editor, level, before) {
      if (level.type === 'fragmented') {
        Fragments.write(level.fragments, editor.getBody())
      } else {
        editor.setContent(level.content, { format: 'raw' })
      }
      editor.selection.moveToBookmark(before ? level.beforeBookmark : level.bookmark)
    }
    const getLevelContent = function (level) {
      return level.type === 'fragmented' ? level.fragments.join('') : level.content
    }
    const getCleanLevelContent = function (level) {
      const elm = Element$$1.fromTag('body', lazyTempDocument())
      set$2(elm, getLevelContent(level))
      each(descendants$1(elm, '*[data-mce-bogus]'), unwrap)
      return get$5(elm)
    }
    const hasEqualContent = function (level1, level2) {
      return getLevelContent(level1) === getLevelContent(level2)
    }
    const hasEqualCleanedContent = function (level1, level2) {
      return getCleanLevelContent(level1) === getCleanLevelContent(level2)
    }
    const isEq$2 = function (level1, level2) {
      if (!level1 || !level2) {
        return false
      } if (hasEqualContent(level1, level2)) {
        return true
      }
      return hasEqualCleanedContent(level1, level2)
    }
    const Levels = {
      createFragmentedLevel,
      createCompleteLevel,
      createFromEditor,
      applyToEditor,
      isEq: isEq$2,
    }

    function UndoManager(editor) {
      let self = this; let index = 0; let data = []; let beforeBookmark; let isFirstTypedCharacter; let locks = 0
      const isUnlocked = function () {
        return locks === 0
      }
      const setTyping = function (typing) {
        if (isUnlocked()) {
          self.typing = typing
        }
      }
      const setDirty = function (state) {
        editor.setDirty(state)
      }
      const addNonTypingUndoLevel = function (e) {
        setTyping(false)
        self.add({}, e)
      }
      const endTyping = function () {
        if (self.typing) {
          setTyping(false)
          self.add()
        }
      }
      editor.on('init', () => {
        self.add()
      })
      editor.on('BeforeExecCommand', (e) => {
        const cmd = e.command
        if (cmd !== 'Undo' && cmd !== 'Redo' && cmd !== 'mceRepaint') {
          endTyping()
          self.beforeChange()
        }
      })
      editor.on('ExecCommand', (e) => {
        const cmd = e.command
        if (cmd !== 'Undo' && cmd !== 'Redo' && cmd !== 'mceRepaint') {
          addNonTypingUndoLevel(e)
        }
      })
      editor.on('ObjectResizeStart Cut', () => {
        self.beforeChange()
      })
      editor.on('SaveContent ObjectResized blur', addNonTypingUndoLevel)
      editor.on('DragEnd', addNonTypingUndoLevel)
      editor.on('KeyUp', (e) => {
        const { keyCode } = e
        if (e.isDefaultPrevented()) {
          return
        }
        if (keyCode >= 33 && keyCode <= 36 || keyCode >= 37 && keyCode <= 40 || keyCode === 45 || e.ctrlKey) {
          addNonTypingUndoLevel()
          editor.nodeChanged()
        }
        if (keyCode === 46 || keyCode === 8) {
          editor.nodeChanged()
        }
        if (isFirstTypedCharacter && self.typing && Levels.isEq(Levels.createFromEditor(editor), data[0]) === false) {
          if (editor.isDirty() === false) {
            setDirty(true)
            editor.fire('change', {
              level: data[0],
              lastLevel: null,
            })
          }
          editor.fire('TypingUndo')
          isFirstTypedCharacter = false
          editor.nodeChanged()
        }
      })
      editor.on('KeyDown', (e) => {
        const { keyCode } = e
        if (e.isDefaultPrevented()) {
          return
        }
        if (keyCode >= 33 && keyCode <= 36 || keyCode >= 37 && keyCode <= 40 || keyCode === 45) {
          if (self.typing) {
            addNonTypingUndoLevel(e)
          }
          return
        }
        const modKey = e.ctrlKey && !e.altKey || e.metaKey
        if ((keyCode < 16 || keyCode > 20) && keyCode !== 224 && keyCode !== 91 && !self.typing && !modKey) {
          self.beforeChange()
          setTyping(true)
          self.add({}, e)
          isFirstTypedCharacter = true
        }
      })
      editor.on('MouseDown', (e) => {
        if (self.typing) {
          addNonTypingUndoLevel(e)
        }
      })
      const isInsertReplacementText = function (event) {
        return event.inputType === 'insertReplacementText'
      }
      const isInsertTextDataNull = function (event) {
        return event.inputType === 'insertText' && event.data === null
      }
      editor.on('input', (e) => {
        if (e.inputType && (isInsertReplacementText(e) || isInsertTextDataNull(e))) {
          addNonTypingUndoLevel(e)
        }
      })
      editor.addShortcut('meta+z', '', 'Undo')
      editor.addShortcut('meta+y,meta+shift+z', '', 'Redo')
      editor.on('AddUndo Undo Redo ClearUndos', (e) => {
        if (!e.isDefaultPrevented()) {
          editor.nodeChanged()
        }
      })
      self = {
        data,
        typing: false,
        beforeChange() {
          if (isUnlocked()) {
            beforeBookmark = GetBookmark.getUndoBookmark(editor.selection)
          }
        },
        add(level, event) {
          let i
          const { settings } = editor
          let lastLevel, currentLevel
          currentLevel = Levels.createFromEditor(editor)
          level = level || {}
          level = Tools.extend(level, currentLevel)
          if (isUnlocked() === false || editor.removed) {
            return null
          }
          lastLevel = data[index]
          if (editor.fire('BeforeAddUndo', {
            level,
            lastLevel,
            originalEvent: event,
          }).isDefaultPrevented()) {
            return null
          }
          if (lastLevel && Levels.isEq(lastLevel, level)) {
            return null
          }
          if (data[index]) {
            data[index].beforeBookmark = beforeBookmark
          }
          if (settings.custom_undo_redo_levels) {
            if (data.length > settings.custom_undo_redo_levels) {
              for (i = 0; i < data.length - 1; i++) {
                data[i] = data[i + 1]
              }
              data.length--
              index = data.length
            }
          }
          level.bookmark = GetBookmark.getUndoBookmark(editor.selection)
          if (index < data.length - 1) {
            data.length = index + 1
          }
          data.push(level)
          index = data.length - 1
          const args = {
            level,
            lastLevel,
            originalEvent: event,
          }
          editor.fire('AddUndo', args)
          if (index > 0) {
            setDirty(true)
            editor.fire('change', args)
          }
          return level
        },
        undo() {
          let level
          if (self.typing) {
            self.add()
            self.typing = false
            setTyping(false)
          }
          if (index > 0) {
            level = data[--index]
            Levels.applyToEditor(editor, level, true)
            setDirty(true)
            editor.fire('undo', { level })
          }
          return level
        },
        redo() {
          let level
          if (index < data.length - 1) {
            level = data[++index]
            Levels.applyToEditor(editor, level, false)
            setDirty(true)
            editor.fire('redo', { level })
          }
          return level
        },
        clear() {
          data = []
          index = 0
          self.typing = false
          self.data = data
          editor.fire('ClearUndos')
        },
        hasUndo() {
          return index > 0 || self.typing && data[0] && !Levels.isEq(Levels.createFromEditor(editor), data[0])
        },
        hasRedo() {
          return index < data.length - 1 && !self.typing
        },
        transact(callback) {
          endTyping()
          self.beforeChange()
          self.ignore(callback)
          return self.add()
        },
        ignore(callback) {
          try {
            locks++
            callback()
          } finally {
            locks--
          }
        },
        extra(callback1, callback2) {
          let lastLevel, bookmark
          if (self.transact(callback1)) {
            bookmark = data[index].bookmark
            lastLevel = data[index - 1]
            Levels.applyToEditor(editor, lastLevel, true)
            if (self.transact(callback2)) {
              data[index - 1].beforeBookmark = bookmark
            }
          }
        },
      }
      return self
    }

    const getLastChildren$1 = function (elm) {
      const children$$1 = []
      let rawNode = elm.dom()
      while (rawNode) {
        children$$1.push(Element$$1.fromDom(rawNode))
        rawNode = rawNode.lastChild
      }
      return children$$1
    }
    const removeTrailingBr = function (elm) {
      const allBrs = descendants$1(elm, 'br')
      const brs = filter(getLastChildren$1(elm).slice(-1), isBr)
      if (allBrs.length === brs.length) {
        each(brs, remove$2)
      }
    }
    const fillWithPaddingBr = function (elm) {
      empty(elm)
      append(elm, Element$$1.fromHtml('<br data-mce-bogus="1">'))
    }
    const isPaddingContents = function (elm) {
      return isText(elm) ? get$6(elm) === '\xA0' : isBr(elm)
    }
    const isPaddedElement = function (elm) {
      return filter(children(elm), isPaddingContents).length === 1
    }
    const trimBlockTrailingBr = function (elm) {
      lastChild(elm).each((lastChild$$1) => {
        prevSibling(lastChild$$1).each((lastChildPrevSibling) => {
          if (isBlock(elm) && isBr(lastChild$$1) && isBlock(lastChildPrevSibling)) {
            remove$2(lastChild$$1)
          }
        })
      })
    }
    const PaddingBr = {
      removeTrailingBr,
      fillWithPaddingBr,
      isPaddedElement,
      trimBlockTrailingBr,
    }

    const isEq$3 = FormatUtils.isEq
    const matchesUnInheritedFormatSelector = function (ed, node, name) {
      const formatList = ed.formatter.get(name)
      if (formatList) {
        for (let i = 0; i < formatList.length; i++) {
          if (formatList[i].inherit === false && ed.dom.is(node, formatList[i].selector)) {
            return true
          }
        }
      }
      return false
    }
    const matchParents = function (editor, node, name, vars) {
      const root = editor.dom.getRoot()
      if (node === root) {
        return false
      }
      node = editor.dom.getParent(node, (node) => {
        if (matchesUnInheritedFormatSelector(editor, node, name)) {
          return true
        }
        return node.parentNode === root || !!matchNode(editor, node, name, vars, true)
      })
      return matchNode(editor, node, name, vars)
    }
    const matchName = function (dom, node, format) {
      if (isEq$3(node, format.inline)) {
        return true
      }
      if (isEq$3(node, format.block)) {
        return true
      }
      if (format.selector) {
        return node.nodeType === 1 && dom.is(node, format.selector)
      }
    }
    const matchItems = function (dom, node, format, itemName, similar, vars) {
      let key, value
      const items = format[itemName]
      let i
      if (format.onmatch) {
        return format.onmatch(node, format, itemName)
      }
      if (items) {
        if (typeof items.length === 'undefined') {
          for (key in items) {
            if (items.hasOwnProperty(key)) {
              if (itemName === 'attributes') {
                value = dom.getAttrib(node, key)
              } else {
                value = FormatUtils.getStyle(dom, node, key)
              }
              if (similar && !value && !format.exact) {
                return
              }
              if ((!similar || format.exact) && !isEq$3(value, FormatUtils.normalizeStyleValue(dom, FormatUtils.replaceVars(items[key], vars), key))) {
                return
              }
            }
          }
        } else {
          for (i = 0; i < items.length; i++) {
            if (itemName === 'attributes' ? dom.getAttrib(node, items[i]) : FormatUtils.getStyle(dom, node, items[i])) {
              return format
            }
          }
        }
      }
      return format
    }
    var matchNode = function (ed, node, name, vars, similar) {
      const formatList = ed.formatter.get(name)
      let format, i, x, classes
      const { dom } = ed
      if (formatList && node) {
        for (i = 0; i < formatList.length; i++) {
          format = formatList[i]
          if (matchName(ed.dom, node, format) && matchItems(dom, node, format, 'attributes', similar, vars) && matchItems(dom, node, format, 'styles', similar, vars)) {
            if (classes = format.classes) {
              for (x = 0; x < classes.length; x++) {
                if (!ed.dom.hasClass(node, classes[x])) {
                  return
                }
              }
            }
            return format
          }
        }
      }
    }
    const match = function (editor, name, vars, node) {
      let startNode
      if (node) {
        return matchParents(editor, node, name, vars)
      }
      node = editor.selection.getNode()
      if (matchParents(editor, node, name, vars)) {
        return true
      }
      startNode = editor.selection.getStart()
      if (startNode !== node) {
        if (matchParents(editor, startNode, name, vars)) {
          return true
        }
      }
      return false
    }
    const matchAll = function (editor, names, vars) {
      let startElement
      const matchedFormatNames = []
      const checkedMap = {}
      startElement = editor.selection.getStart()
      editor.dom.getParent(startElement, (node) => {
        let i, name
        for (i = 0; i < names.length; i++) {
          name = names[i]
          if (!checkedMap[name] && matchNode(editor, node, name, vars)) {
            checkedMap[name] = true
            matchedFormatNames.push(name)
          }
        }
      }, editor.dom.getRoot())
      return matchedFormatNames
    }
    const canApply = function (editor, name) {
      const formatList = editor.formatter.get(name)
      let startNode, parents, i, x, selector
      const { dom } = editor
      if (formatList) {
        startNode = editor.selection.getStart()
        parents = FormatUtils.getParents(dom, startNode)
        for (x = formatList.length - 1; x >= 0; x--) {
          selector = formatList[x].selector
          if (!selector || formatList[x].defaultBlock) {
            return true
          }
          for (i = parents.length - 1; i >= 0; i--) {
            if (dom.is(parents[i], selector)) {
              return true
            }
          }
        }
      }
      return false
    }
    const MatchFormat = {
      matchNode,
      matchName,
      match,
      matchAll,
      canApply,
      matchesUnInheritedFormatSelector,
    }

    const splitText = function (node, offset) {
      return node.splitText(offset)
    }
    const split$1 = function (rng) {
      let { startContainer } = rng; let { startOffset } = rng; let { endContainer } = rng; let { endOffset } = rng
      if (startContainer === endContainer && NodeType.isText(startContainer)) {
        if (startOffset > 0 && startOffset < startContainer.nodeValue.length) {
          endContainer = splitText(startContainer, startOffset)
          startContainer = endContainer.previousSibling
          if (endOffset > startOffset) {
            endOffset -= startOffset
            startContainer = endContainer = splitText(endContainer, endOffset).previousSibling
            endOffset = endContainer.nodeValue.length
            startOffset = 0
          } else {
            endOffset = 0
          }
        }
      } else {
        if (NodeType.isText(startContainer) && startOffset > 0 && startOffset < startContainer.nodeValue.length) {
          startContainer = splitText(startContainer, startOffset)
          startOffset = 0
        }
        if (NodeType.isText(endContainer) && endOffset > 0 && endOffset < endContainer.nodeValue.length) {
          endContainer = splitText(endContainer, endOffset).previousSibling
          endOffset = endContainer.nodeValue.length
        }
      }
      return {
        startContainer,
        startOffset,
        endContainer,
        endOffset,
      }
    }
    const SplitRange = { split: split$1 }

    const isCollapsibleWhitespace = function (c) {
      return ' \f\n\r\t\x0B'.indexOf(c) !== -1
    }
    const normalizeContent = function (content, isStartOfContent, isEndOfContent) {
      const result = foldl(content.split(''), (acc, c) => {
        if (isCollapsibleWhitespace(c) || c === '\xA0') {
          if (acc.previousCharIsSpace || acc.str === '' && isStartOfContent || acc.str.length === content.length - 1 && isEndOfContent) {
            return {
              previousCharIsSpace: false,
              str: `${acc.str}\xA0`,
            }
          }
          return {
            previousCharIsSpace: true,
            str: `${acc.str} `,
          }
        }
        return {
          previousCharIsSpace: false,
          str: acc.str + c,
        }
      }, {
        previousCharIsSpace: false,
        str: '',
      })
      return result.str
    }
    const normalize = function (node, offset, count) {
      if (count === 0) {
        return
      }
      const whitespace = node.data.slice(offset, offset + count)
      const isEndOfContent = offset + count >= node.data.length
      const isStartOfContent = offset === 0
      node.replaceData(offset, count, normalizeContent(whitespace, isStartOfContent, isEndOfContent))
    }
    const normalizeWhitespaceAfter = function (node, offset) {
      const content = node.data.slice(offset)
      const whitespaceCount = content.length - lTrim(content).length
      return normalize(node, offset, whitespaceCount)
    }
    const normalizeWhitespaceBefore = function (node, offset) {
      const content = node.data.slice(0, offset)
      const whitespaceCount = content.length - rTrim(content).length
      return normalize(node, offset - whitespaceCount, whitespaceCount)
    }
    const mergeTextNodes = function (prevNode, nextNode, normalizeWhitespace) {
      const whitespaceOffset = rTrim(prevNode.data).length
      prevNode.appendData(nextNode.data)
      remove$2(Element$$1.fromDom(nextNode))
      if (normalizeWhitespace) {
        normalizeWhitespaceAfter(prevNode, whitespaceOffset)
      }
      return prevNode
    }

    const ancestor$3 = function (scope, selector, isRoot) {
      return ancestor$1(scope, selector, isRoot).isSome()
    }

    const hasWhitespacePreserveParent = function (rootNode, node) {
      const rootElement = Element$$1.fromDom(rootNode)
      const startNode = Element$$1.fromDom(node)
      return ancestor$3(startNode, 'pre,code', curry(eq, rootElement))
    }
    const isWhitespace = function (rootNode, node) {
      return NodeType.isText(node) && /^[ \t\r\n]*$/.test(node.data) && hasWhitespacePreserveParent(rootNode, node) === false
    }
    const isNamedAnchor = function (node) {
      return NodeType.isElement(node) && node.nodeName === 'A' && node.hasAttribute('name')
    }
    const isContent$1 = function (rootNode, node) {
      return isCaretCandidate(node) && isWhitespace(rootNode, node) === false || isNamedAnchor(node) || isBookmark(node)
    }
    var isBookmark = NodeType.hasAttribute('data-mce-bookmark')
    const isBogus$2 = NodeType.hasAttribute('data-mce-bogus')
    const isBogusAll$1 = NodeType.hasAttributeValue('data-mce-bogus', 'all')
    const isEmptyNode = function (targetNode) {
      let walker; let node; let brCount = 0
      if (isContent$1(targetNode, targetNode)) {
        return false
      }
      node = targetNode.firstChild
      if (!node) {
        return true
      }
      walker = new TreeWalker(node, targetNode)
      do {
        if (isBogusAll$1(node)) {
          node = walker.next(true)
          continue
        }
        if (isBogus$2(node)) {
          node = walker.next()
          continue
        }
        if (NodeType.isBr(node)) {
          brCount++
          node = walker.next()
          continue
        }
        if (isContent$1(targetNode, node)) {
          return false
        }
        node = walker.next()
      } while (node)
      return brCount <= 1
    }
    const isEmpty$1 = function (elm) {
      return isEmptyNode(elm.dom())
    }
    const Empty = { isEmpty: isEmpty$1 }

    const needsReposition = function (pos, elm) {
      const container = pos.container()
      const offset = pos.offset()
      return CaretPosition$1.isTextPosition(pos) === false && container === elm.parentNode && offset > CaretPosition$1.before(elm).offset()
    }
    const reposition = function (elm, pos) {
      return needsReposition(pos, elm) ? CaretPosition$1(pos.container(), pos.offset() - 1) : pos
    }
    const beforeOrStartOf = function (node) {
      return NodeType.isText(node) ? CaretPosition$1(node, 0) : CaretPosition$1.before(node)
    }
    const afterOrEndOf = function (node) {
      return NodeType.isText(node) ? CaretPosition$1(node, node.data.length) : CaretPosition$1.after(node)
    }
    const getPreviousSiblingCaretPosition = function (elm) {
      if (isCaretCandidate(elm.previousSibling)) {
        return Option.some(afterOrEndOf(elm.previousSibling))
      }
      return elm.previousSibling ? CaretFinder.lastPositionIn(elm.previousSibling) : Option.none()
    }
    const getNextSiblingCaretPosition = function (elm) {
      if (isCaretCandidate(elm.nextSibling)) {
        return Option.some(beforeOrStartOf(elm.nextSibling))
      }
      return elm.nextSibling ? CaretFinder.firstPositionIn(elm.nextSibling) : Option.none()
    }
    const findCaretPositionBackwardsFromElm = function (rootElement, elm) {
      const startPosition = CaretPosition$1.before(elm.previousSibling ? elm.previousSibling : elm.parentNode)
      return CaretFinder.prevPosition(rootElement, startPosition).fold(() => CaretFinder.nextPosition(rootElement, CaretPosition$1.after(elm)), Option.some)
    }
    const findCaretPositionForwardsFromElm = function (rootElement, elm) {
      return CaretFinder.nextPosition(rootElement, CaretPosition$1.after(elm)).fold(() => CaretFinder.prevPosition(rootElement, CaretPosition$1.before(elm)), Option.some)
    }
    const findCaretPositionBackwards = function (rootElement, elm) {
      return getPreviousSiblingCaretPosition(elm).orThunk(() => getNextSiblingCaretPosition(elm)).orThunk(() => findCaretPositionBackwardsFromElm(rootElement, elm))
    }
    const findCaretPositionForward = function (rootElement, elm) {
      return getNextSiblingCaretPosition(elm).orThunk(() => getPreviousSiblingCaretPosition(elm)).orThunk(() => findCaretPositionForwardsFromElm(rootElement, elm))
    }
    const findCaretPosition$1 = function (forward, rootElement, elm) {
      return forward ? findCaretPositionForward(rootElement, elm) : findCaretPositionBackwards(rootElement, elm)
    }
    const findCaretPosOutsideElmAfterDelete = function (forward, rootElement, elm) {
      return findCaretPosition$1(forward, rootElement, elm).map(curry(reposition, elm))
    }
    const setSelection = function (editor, forward, pos) {
      pos.fold(() => {
        editor.focus()
      }, (pos) => {
        editor.selection.setRng(pos.toRange(), forward)
      })
    }
    const eqRawNode = function (rawNode) {
      return function (elm) {
        return elm.dom() === rawNode
      }
    }
    const isBlock$2 = function (editor, elm) {
      return elm && editor.schema.getBlockElements().hasOwnProperty(name(elm))
    }
    const paddEmptyBlock = function (elm) {
      if (Empty.isEmpty(elm)) {
        const br = Element$$1.fromHtml('<br data-mce-bogus="1">')
        empty(elm)
        append(elm, br)
        return Option.some(CaretPosition$1.before(br.dom()))
      }
      return Option.none()
    }
    const deleteNormalized = function (elm, afterDeletePosOpt, normalizeWhitespace) {
      const prevTextOpt = prevSibling(elm).filter((e) => NodeType.isText(e.dom()))
      const nextTextOpt = nextSibling(elm).filter((e) => NodeType.isText(e.dom()))
      remove$2(elm)
      return liftN([
        prevTextOpt,
        nextTextOpt,
        afterDeletePosOpt,
      ], (prev, next, pos) => {
        const prevNode = prev.dom(); const nextNode = next.dom()
        const offset = prevNode.data.length
        mergeTextNodes(prevNode, nextNode, normalizeWhitespace)
        return pos.container() === nextNode ? CaretPosition$1(prevNode, offset) : pos
      }).orThunk(() => {
        if (normalizeWhitespace) {
          prevTextOpt.each((elm) => normalizeWhitespaceBefore(elm.dom(), elm.dom().length))
          nextTextOpt.each((elm) => normalizeWhitespaceAfter(elm.dom(), 0))
        }
        return afterDeletePosOpt
      })
    }
    const isInlineElement = function (editor, element) {
      return has(editor.schema.getTextInlineElements(), name(element))
    }
    const deleteElement = function (editor, forward, elm, moveCaret) {
      if (moveCaret === void 0) {
        moveCaret = true
      }
      const afterDeletePos = findCaretPosOutsideElmAfterDelete(forward, editor.getBody(), elm.dom())
      const parentBlock = ancestor(elm, curry(isBlock$2, editor), eqRawNode(editor.getBody()))
      const normalizedAfterDeletePos = deleteNormalized(elm, afterDeletePos, isInlineElement(editor, elm))
      if (editor.dom.isEmpty(editor.getBody())) {
        editor.setContent('')
        editor.selection.setCursorLocation()
      } else {
        parentBlock.bind(paddEmptyBlock).fold(() => {
          if (moveCaret) {
            setSelection(editor, forward, normalizedAfterDeletePos)
          }
        }, (paddPos) => {
          if (moveCaret) {
            setSelection(editor, forward, Option.some(paddPos))
          }
        })
      }
    }
    const DeleteElement = { deleteElement }

    const ZWSP$1 = Zwsp.ZWSP; const CARET_ID$1 = '_mce_caret'
    const importNode = function (ownerDocument, node) {
      return ownerDocument.importNode(node, true)
    }
    const getEmptyCaretContainers = function (node) {
      const nodes = []
      while (node) {
        if (node.nodeType === 3 && node.nodeValue !== ZWSP$1 || node.childNodes.length > 1) {
          return []
        }
        if (node.nodeType === 1) {
          nodes.push(node)
        }
        node = node.firstChild
      }
      return nodes
    }
    const isCaretContainerEmpty = function (node) {
      return getEmptyCaretContainers(node).length > 0
    }
    const findFirstTextNode = function (node) {
      let walker
      if (node) {
        walker = new TreeWalker(node, node)
        for (node = walker.current(); node; node = walker.next()) {
          if (node.nodeType === 3) {
            return node
          }
        }
      }
      return null
    }
    const createCaretContainer = function (fill) {
      const caretContainer = Element$$1.fromTag('span')
      setAll(caretContainer, {
        id: CARET_ID$1,
        'data-mce-bogus': '1',
        'data-mce-type': 'format-caret',
      })
      if (fill) {
        append(caretContainer, Element$$1.fromText(ZWSP$1))
      }
      return caretContainer
    }
    const trimZwspFromCaretContainer = function (caretContainerNode) {
      const textNode = findFirstTextNode(caretContainerNode)
      if (textNode && textNode.nodeValue.charAt(0) === ZWSP$1) {
        textNode.deleteData(0, 1)
      }
      return textNode
    }
    const removeCaretContainerNode = function (editor, node, moveCaret) {
      if (moveCaret === void 0) {
        moveCaret = true
      }
      const { dom } = editor; const { selection } = editor
      if (isCaretContainerEmpty(node)) {
        DeleteElement.deleteElement(editor, false, Element$$1.fromDom(node), moveCaret)
      } else {
        const rng = selection.getRng()
        const block = dom.getParent(node, dom.isBlock)
        const textNode = trimZwspFromCaretContainer(node)
        if (rng.startContainer === textNode && rng.startOffset > 0) {
          rng.setStart(textNode, rng.startOffset - 1)
        }
        if (rng.endContainer === textNode && rng.endOffset > 0) {
          rng.setEnd(textNode, rng.endOffset - 1)
        }
        dom.remove(node, true)
        if (block && dom.isEmpty(block)) {
          PaddingBr.fillWithPaddingBr(Element$$1.fromDom(block))
        }
        selection.setRng(rng)
      }
    }
    const removeCaretContainer = function (editor, node, moveCaret) {
      if (moveCaret === void 0) {
        moveCaret = true
      }
      const { dom } = editor; const { selection } = editor
      if (!node) {
        node = getParentCaretContainer(editor.getBody(), selection.getStart())
        if (!node) {
          while (node = dom.get(CARET_ID$1)) {
            removeCaretContainerNode(editor, node, false)
          }
        }
      } else {
        removeCaretContainerNode(editor, node, moveCaret)
      }
    }
    const insertCaretContainerNode = function (editor, caretContainer, formatNode) {
      const { dom } = editor; const block = dom.getParent(formatNode, curry(FormatUtils.isTextBlock, editor))
      if (block && dom.isEmpty(block)) {
        formatNode.parentNode.replaceChild(caretContainer, formatNode)
      } else {
        PaddingBr.removeTrailingBr(Element$$1.fromDom(formatNode))
        if (dom.isEmpty(formatNode)) {
          formatNode.parentNode.replaceChild(caretContainer, formatNode)
        } else {
          dom.insertAfter(caretContainer, formatNode)
        }
      }
    }
    const appendNode = function (parentNode, node) {
      parentNode.appendChild(node)
      return node
    }
    const insertFormatNodesIntoCaretContainer = function (formatNodes, caretContainer) {
      const innerMostFormatNode = foldr(formatNodes, (parentNode, formatNode) => appendNode(parentNode, formatNode.cloneNode(false)), caretContainer)
      return appendNode(innerMostFormatNode, innerMostFormatNode.ownerDocument.createTextNode(ZWSP$1))
    }
    const applyCaretFormat = function (editor, name$$1, vars) {
      let rng, caretContainer, textNode, offset, bookmark, container, text
      const { selection } = editor
      rng = selection.getRng(true)
      offset = rng.startOffset
      container = rng.startContainer
      text = container.nodeValue
      caretContainer = getParentCaretContainer(editor.getBody(), selection.getStart())
      if (caretContainer) {
        textNode = findFirstTextNode(caretContainer)
      }
      const wordcharRegex = /[^\s\u00a0\u00ad\u200b\ufeff]/
      if (text && offset > 0 && offset < text.length && wordcharRegex.test(text.charAt(offset)) && wordcharRegex.test(text.charAt(offset - 1))) {
        bookmark = selection.getBookmark()
        rng.collapse(true)
        rng = ExpandRange.expandRng(editor, rng, editor.formatter.get(name$$1))
        rng = SplitRange.split(rng)
        editor.formatter.apply(name$$1, vars, rng)
        selection.moveToBookmark(bookmark)
      } else {
        if (!caretContainer || textNode.nodeValue !== ZWSP$1) {
          caretContainer = importNode(editor.getDoc(), createCaretContainer(true).dom())
          textNode = caretContainer.firstChild
          rng.insertNode(caretContainer)
          offset = 1
          editor.formatter.apply(name$$1, vars, caretContainer)
        } else {
          editor.formatter.apply(name$$1, vars, caretContainer)
        }
        selection.setCursorLocation(textNode, offset)
      }
    }
    const removeCaretFormat = function (editor, name$$1, vars, similar) {
      const { dom } = editor; const { selection } = editor
      let container, offset, bookmark
      let hasContentAfter, node, formatNode
      const parents = []; const rng = selection.getRng()
      let caretContainer
      container = rng.startContainer
      offset = rng.startOffset
      node = container
      if (container.nodeType === 3) {
        if (offset !== container.nodeValue.length) {
          hasContentAfter = true
        }
        node = node.parentNode
      }
      while (node) {
        if (MatchFormat.matchNode(editor, node, name$$1, vars, similar)) {
          formatNode = node
          break
        }
        if (node.nextSibling) {
          hasContentAfter = true
        }
        parents.push(node)
        node = node.parentNode
      }
      if (!formatNode) {
        return
      }
      if (hasContentAfter) {
        bookmark = selection.getBookmark()
        rng.collapse(true)
        let expandedRng = ExpandRange.expandRng(editor, rng, editor.formatter.get(name$$1), true)
        expandedRng = SplitRange.split(expandedRng)
        editor.formatter.remove(name$$1, vars, expandedRng)
        selection.moveToBookmark(bookmark)
      } else {
        caretContainer = getParentCaretContainer(editor.getBody(), formatNode)
        const newCaretContainer = createCaretContainer(false).dom()
        const caretNode = insertFormatNodesIntoCaretContainer(parents, newCaretContainer)
        if (caretContainer) {
          insertCaretContainerNode(editor, newCaretContainer, caretContainer)
        } else {
          insertCaretContainerNode(editor, newCaretContainer, formatNode)
        }
        removeCaretContainerNode(editor, caretContainer, false)
        selection.setCursorLocation(caretNode, 1)
        if (dom.isEmpty(formatNode)) {
          dom.remove(formatNode)
        }
      }
    }
    const disableCaretContainer = function (editor, keyCode) {
      const { selection } = editor; const body = editor.getBody()
      removeCaretContainer(editor, null, false)
      if ((keyCode === 8 || keyCode === 46) && selection.isCollapsed() && selection.getStart().innerHTML === ZWSP$1) {
        removeCaretContainer(editor, getParentCaretContainer(body, selection.getStart()))
      }
      if (keyCode === 37 || keyCode === 39) {
        removeCaretContainer(editor, getParentCaretContainer(body, selection.getStart()))
      }
    }
    const setup$4 = function (editor) {
      editor.on('mouseup keydown', (e) => {
        disableCaretContainer(editor, e.keyCode)
      })
    }
    const replaceWithCaretFormat = function (targetNode, formatNodes) {
      const caretContainer = createCaretContainer(false)
      const innerMost = insertFormatNodesIntoCaretContainer(formatNodes, caretContainer.dom())
      before(Element$$1.fromDom(targetNode), caretContainer)
      remove$2(Element$$1.fromDom(targetNode))
      return CaretPosition$1(innerMost, 0)
    }
    const isFormatElement = function (editor, element) {
      const inlineElements = editor.schema.getTextInlineElements()
      return inlineElements.hasOwnProperty(name(element)) && !isCaretNode(element.dom()) && !NodeType.isBogus(element.dom())
    }
    const isEmptyCaretFormatElement = function (element) {
      return isCaretNode(element.dom()) && isCaretContainerEmpty(element.dom())
    }

    const postProcessHooks = {}; const filter$3 = ArrUtils.filter; const each$9 = ArrUtils.each
    const addPostProcessHook = function (name, hook) {
      let hooks = postProcessHooks[name]
      if (!hooks) {
        postProcessHooks[name] = hooks = []
      }
      postProcessHooks[name].push(hook)
    }
    const postProcess = function (name, editor) {
      each$9(postProcessHooks[name], (hook) => {
        hook(editor)
      })
    }
    addPostProcessHook('pre', (editor) => {
      const rng = editor.selection.getRng()
      let isPre, blocks
      const hasPreSibling = function (pre) {
        return isPre(pre.previousSibling) && ArrUtils.indexOf(blocks, pre.previousSibling) !== -1
      }
      const joinPre = function (pre1, pre2) {
        DomQuery(pre2).remove()
        DomQuery(pre1).append('<br><br>').append(pre2.childNodes)
      }
      isPre = NodeType.matchNodeNames('pre')
      if (!rng.collapsed) {
        blocks = editor.selection.getSelectedBlocks()
        each$9(filter$3(filter$3(blocks, isPre), hasPreSibling), (pre) => {
          joinPre(pre.previousSibling, pre)
        })
      }
    })
    const Hooks = { postProcess }

    const each$a = Tools.each
    const ElementUtils = function (dom) {
      this.compare = function (node1, node2) {
        if (node1.nodeName !== node2.nodeName) {
          return false
        }
        const getAttribs = function (node) {
          const attribs = {}
          each$a(dom.getAttribs(node), (attr) => {
            const name = attr.nodeName.toLowerCase()
            if (name.indexOf('_') !== 0 && name !== 'style' && name.indexOf('data-') !== 0) {
              attribs[name] = dom.getAttrib(node, name)
            }
          })
          return attribs
        }
        const compareObjects = function (obj1, obj2) {
          let value, name
          for (name in obj1) {
            if (obj1.hasOwnProperty(name)) {
              value = obj2[name]
              if (typeof value === 'undefined') {
                return false
              }
              if (obj1[name] !== value) {
                return false
              }
              delete obj2[name]
            }
          }
          for (name in obj2) {
            if (obj2.hasOwnProperty(name)) {
              return false
            }
          }
          return true
        }
        if (!compareObjects(getAttribs(node1), getAttribs(node2))) {
          return false
        }
        if (!compareObjects(dom.parseStyle(dom.getAttrib(node1, 'style')), dom.parseStyle(dom.getAttrib(node2, 'style')))) {
          return false
        }
        return !Bookmarks.isBookmarkNode(node1) && !Bookmarks.isBookmarkNode(node2)
      }
    }

    const MCE_ATTR_RE = /^(src|href|style)$/
    const each$b = Tools.each
    const isEq$4 = FormatUtils.isEq
    const isTableCell$2 = function (node) {
      return /^(TH|TD)$/.test(node.nodeName)
    }
    const isChildOfInlineParent = function (dom, node, parent$$1) {
      return dom.isChildOf(node, parent$$1) && node !== parent$$1 && !dom.isBlock(parent$$1)
    }
    const getContainer = function (ed, rng, start) {
      let container, offset, lastIdx
      container = rng[start ? 'startContainer' : 'endContainer']
      offset = rng[start ? 'startOffset' : 'endOffset']
      if (NodeType.isElement(container)) {
        lastIdx = container.childNodes.length - 1
        if (!start && offset) {
          offset--
        }
        container = container.childNodes[offset > lastIdx ? lastIdx : offset]
      }
      if (NodeType.isText(container) && start && offset >= container.nodeValue.length) {
        container = new TreeWalker(container, ed.getBody()).next() || container
      }
      if (NodeType.isText(container) && !start && offset === 0) {
        container = new TreeWalker(container, ed.getBody()).prev() || container
      }
      return container
    }
    const wrap$2 = function (dom, node, name, attrs) {
      const wrapper = dom.create(name, attrs)
      node.parentNode.insertBefore(wrapper, node)
      wrapper.appendChild(node)
      return wrapper
    }
    const wrapWithSiblings = function (dom, node, next, name, attrs) {
      const start = Element$$1.fromDom(node)
      const wrapper = Element$$1.fromDom(dom.create(name, attrs))
      const siblings$$1 = next ? nextSiblings(start) : prevSiblings(start)
      append$1(wrapper, siblings$$1)
      if (next) {
        before(start, wrapper)
        prepend(wrapper, start)
      } else {
        after(start, wrapper)
        append(wrapper, start)
      }
      return wrapper.dom()
    }
    const matchName$1 = function (dom, node, format) {
      if (isEq$4(node, format.inline)) {
        return true
      }
      if (isEq$4(node, format.block)) {
        return true
      }
      if (format.selector) {
        return NodeType.isElement(node) && dom.is(node, format.selector)
      }
    }
    const isColorFormatAndAnchor = function (node, format) {
      return format.links && node.tagName === 'A'
    }
    const find$4 = function (dom, node, next, inc) {
      node = FormatUtils.getNonWhiteSpaceSibling(node, next, inc)
      return !node || (node.nodeName === 'BR' || dom.isBlock(node))
    }
    const removeNode$1 = function (ed, node, format) {
      const { parentNode } = node
      let rootBlockElm
      const { dom } = ed; const forcedRootBlock = Settings.getForcedRootBlock(ed)
      if (format.block) {
        if (!forcedRootBlock) {
          if (dom.isBlock(node) && !dom.isBlock(parentNode)) {
            if (!find$4(dom, node, false) && !find$4(dom, node.firstChild, true, 1)) {
              node.insertBefore(dom.create('br'), node.firstChild)
            }
            if (!find$4(dom, node, true) && !find$4(dom, node.lastChild, false, 1)) {
              node.appendChild(dom.create('br'))
            }
          }
        } else if (parentNode === dom.getRoot()) {
          if (!format.list_block || !isEq$4(node, format.list_block)) {
            each$b(Tools.grep(node.childNodes), (node) => {
              if (FormatUtils.isValid(ed, forcedRootBlock, node.nodeName.toLowerCase())) {
                if (!rootBlockElm) {
                  rootBlockElm = wrap$2(dom, node, forcedRootBlock)
                  dom.setAttribs(rootBlockElm, ed.settings.forced_root_block_attrs)
                } else {
                  rootBlockElm.appendChild(node)
                }
              } else {
                rootBlockElm = 0
              }
            })
          }
        }
      }
      if (format.selector && format.inline && !isEq$4(format.inline, node)) {
        return
      }
      dom.remove(node, 1)
    }
    const removeFormat = function (ed, format, vars, node, compareNode) {
      let i, attrs, stylesModified
      const { dom } = ed
      if (!matchName$1(dom, node, format) && !isColorFormatAndAnchor(node, format)) {
        return false
      }
      if (format.remove !== 'all') {
        each$b(format.styles, (value, name) => {
          value = FormatUtils.normalizeStyleValue(dom, FormatUtils.replaceVars(value, vars), name)
          if (typeof name === 'number') {
            name = value
            compareNode = 0
          }
          if (format.remove_similar || (!compareNode || isEq$4(FormatUtils.getStyle(dom, compareNode, name), value))) {
            dom.setStyle(node, name, '')
          }
          stylesModified = 1
        })
        if (stylesModified && dom.getAttrib(node, 'style') === '') {
          node.removeAttribute('style')
          node.removeAttribute('data-mce-style')
        }
        each$b(format.attributes, (value, name) => {
          let valueOut
          value = FormatUtils.replaceVars(value, vars)
          if (typeof name === 'number') {
            name = value
            compareNode = 0
          }
          if (!compareNode || isEq$4(dom.getAttrib(compareNode, name), value)) {
            if (name === 'class') {
              value = dom.getAttrib(node, name)
              if (value) {
                valueOut = ''
                each$b(value.split(/\s+/), (cls) => {
                  if (/mce\-\w+/.test(cls)) {
                    valueOut += (valueOut ? ' ' : '') + cls
                  }
                })
                if (valueOut) {
                  dom.setAttrib(node, name, valueOut)
                  return
                }
              }
            }
            if (name === 'class') {
              node.removeAttribute('className')
            }
            if (MCE_ATTR_RE.test(name)) {
              node.removeAttribute(`data-mce-${name}`)
            }
            node.removeAttribute(name)
          }
        })
        each$b(format.classes, (value) => {
          value = FormatUtils.replaceVars(value, vars)
          if (!compareNode || dom.hasClass(compareNode, value)) {
            dom.removeClass(node, value)
          }
        })
        attrs = dom.getAttribs(node)
        for (i = 0; i < attrs.length; i++) {
          const attrName = attrs[i].nodeName
          if (attrName.indexOf('_') !== 0 && attrName.indexOf('data-') !== 0) {
            return false
          }
        }
      }
      if (format.remove !== 'none') {
        removeNode$1(ed, node, format)
        return true
      }
    }
    const findFormatRoot = function (editor, container, name, vars, similar) {
      let formatRoot
      each$b(FormatUtils.getParents(editor.dom, container.parentNode).reverse(), (parent$$1) => {
        let format
        if (!formatRoot && parent$$1.id !== '_start' && parent$$1.id !== '_end') {
          format = MatchFormat.matchNode(editor, parent$$1, name, vars, similar)
          if (format && format.split !== false) {
            formatRoot = parent$$1
          }
        }
      })
      return formatRoot
    }
    const wrapAndSplit = function (editor, formatList, formatRoot, container, target, split, format, vars) {
      let parent$$1, clone, lastClone, firstClone, i, formatRootParent
      const { dom } = editor
      if (formatRoot) {
        formatRootParent = formatRoot.parentNode
        for (parent$$1 = container.parentNode; parent$$1 && parent$$1 !== formatRootParent; parent$$1 = parent$$1.parentNode) {
          clone = dom.clone(parent$$1, false)
          for (i = 0; i < formatList.length; i++) {
            if (removeFormat(editor, formatList[i], vars, clone, clone)) {
              clone = 0
              break
            }
          }
          if (clone) {
            if (lastClone) {
              clone.appendChild(lastClone)
            }
            if (!firstClone) {
              firstClone = clone
            }
            lastClone = clone
          }
        }
        if (split && (!format.mixed || !dom.isBlock(formatRoot))) {
          container = dom.split(formatRoot, container)
        }
        if (lastClone) {
          target.parentNode.insertBefore(lastClone, target)
          firstClone.appendChild(target)
        }
      }
      return container
    }
    const remove$9 = function (ed, name, vars, node, similar) {
      const formatList = ed.formatter.get(name); const format = formatList[0]
      let bookmark; let rng; let contentEditable = true
      const { dom } = ed
      const { selection } = ed
      const splitToFormatRoot = function (container) {
        const formatRoot = findFormatRoot(ed, container, name, vars, similar)
        return wrapAndSplit(ed, formatList, formatRoot, container, container, true, format, vars)
      }
      const isRemoveBookmarkNode = function (node) {
        return Bookmarks.isBookmarkNode(node) && NodeType.isElement(node) && (node.id === '_start' || node.id === '_end')
      }
      var process = function (node) {
        let children$$1, i, l, lastContentEditable, hasContentEditableState
        if (NodeType.isElement(node) && dom.getContentEditable(node)) {
          lastContentEditable = contentEditable
          contentEditable = dom.getContentEditable(node) === 'true'
          hasContentEditableState = true
        }
        children$$1 = Tools.grep(node.childNodes)
        if (contentEditable && !hasContentEditableState) {
          for (i = 0, l = formatList.length; i < l; i++) {
            if (removeFormat(ed, formatList[i], vars, node, node)) {
              break
            }
          }
        }
        if (format.deep) {
          if (children$$1.length) {
            for (i = 0, l = children$$1.length; i < l; i++) {
              process(children$$1[i])
            }
            if (hasContentEditableState) {
              contentEditable = lastContentEditable
            }
          }
        }
      }
      const unwrap = function (start) {
        const node = dom.get(start ? '_start' : '_end')
        let out = node[start ? 'firstChild' : 'lastChild']
        if (isRemoveBookmarkNode(out)) {
          out = out[start ? 'firstChild' : 'lastChild']
        }
        if (NodeType.isText(out) && out.data.length === 0) {
          out = start ? node.previousSibling || node.nextSibling : node.nextSibling || node.previousSibling
        }
        dom.remove(node, true)
        return out
      }
      const removeRngStyle = function (rng) {
        let startContainer, endContainer
        const { commonAncestorContainer } = rng
        rng = ExpandRange.expandRng(ed, rng, formatList, true)
        if (format.split) {
          rng = SplitRange.split(rng)
          startContainer = getContainer(ed, rng, true)
          endContainer = getContainer(ed, rng)
          if (startContainer !== endContainer) {
            if (/^(TR|TH|TD)$/.test(startContainer.nodeName) && startContainer.firstChild) {
              if (startContainer.nodeName === 'TR') {
                startContainer = startContainer.firstChild.firstChild || startContainer
              } else {
                startContainer = startContainer.firstChild || startContainer
              }
            }
            if (commonAncestorContainer && /^T(HEAD|BODY|FOOT|R)$/.test(commonAncestorContainer.nodeName) && isTableCell$2(endContainer) && endContainer.firstChild) {
              endContainer = endContainer.firstChild || endContainer
            }
            if (isChildOfInlineParent(dom, startContainer, endContainer)) {
              var marker = Option.from(startContainer.firstChild).getOr(startContainer)
              splitToFormatRoot(wrapWithSiblings(dom, marker, true, 'span', {
                id: '_start',
                'data-mce-type': 'bookmark',
              }))
              unwrap(true)
              return
            }
            if (isChildOfInlineParent(dom, endContainer, startContainer)) {
              var marker = Option.from(endContainer.lastChild).getOr(endContainer)
              splitToFormatRoot(wrapWithSiblings(dom, marker, false, 'span', {
                id: '_end',
                'data-mce-type': 'bookmark',
              }))
              unwrap(false)
              return
            }
            startContainer = wrap$2(dom, startContainer, 'span', {
              id: '_start',
              'data-mce-type': 'bookmark',
            })
            endContainer = wrap$2(dom, endContainer, 'span', {
              id: '_end',
              'data-mce-type': 'bookmark',
            })
            splitToFormatRoot(startContainer)
            splitToFormatRoot(endContainer)
            startContainer = unwrap(true)
            endContainer = unwrap()
          } else {
            startContainer = endContainer = splitToFormatRoot(startContainer)
          }
          rng.startContainer = startContainer.parentNode ? startContainer.parentNode : startContainer
          rng.startOffset = dom.nodeIndex(startContainer)
          rng.endContainer = endContainer.parentNode ? endContainer.parentNode : endContainer
          rng.endOffset = dom.nodeIndex(endContainer) + 1
        }
        RangeWalk.walk(dom, rng, (nodes) => {
          each$b(nodes, (node) => {
            process(node)
            if (NodeType.isElement(node) && ed.dom.getStyle(node, 'text-decoration') === 'underline' && node.parentNode && FormatUtils.getTextDecoration(dom, node.parentNode) === 'underline') {
              removeFormat(ed, {
                deep: false,
                exact: true,
                inline: 'span',
                styles: { textDecoration: 'underline' },
              }, null, node)
            }
          })
        })
      }
      if (node) {
        if (node.nodeType) {
          rng = dom.createRng()
          rng.setStartBefore(node)
          rng.setEndAfter(node)
          removeRngStyle(rng)
        } else {
          removeRngStyle(node)
        }
        return
      }
      if (dom.getContentEditable(selection.getNode()) === 'false') {
        node = selection.getNode()
        for (let i = 0, l = formatList.length; i < l; i++) {
          if (formatList[i].ceFalseOverride) {
            if (removeFormat(ed, formatList[i], vars, node, node)) {
              break
            }
          }
        }
        return
      }
      if (!selection.isCollapsed() || !format.inline || dom.select('td[data-mce-selected],th[data-mce-selected]').length) {
        bookmark = GetBookmark.getPersistentBookmark(ed.selection, true)
        removeRngStyle(selection.getRng())
        selection.moveToBookmark(bookmark)
        if (format.inline && MatchFormat.match(ed, name, vars, selection.getStart())) {
          FormatUtils.moveStart(dom, selection, selection.getRng())
        }
        ed.nodeChanged()
      } else {
        removeCaretFormat(ed, name, vars, similar)
      }
    }
    const RemoveFormat = {
      removeFormat,
      remove: remove$9,
    }

    const each$c = Tools.each
    const isElementNode = function (node) {
      return node && node.nodeType === 1 && !Bookmarks.isBookmarkNode(node) && !isCaretNode(node) && !NodeType.isBogus(node)
    }
    const findElementSibling = function (node, siblingName) {
      let sibling
      for (sibling = node; sibling; sibling = sibling[siblingName]) {
        if (sibling.nodeType === 3 && sibling.nodeValue.length !== 0) {
          return node
        }
        if (sibling.nodeType === 1 && !Bookmarks.isBookmarkNode(sibling)) {
          return sibling
        }
      }
      return node
    }
    const mergeSiblingsNodes = function (dom, prev, next) {
      let sibling, tmpSibling
      const elementUtils = new ElementUtils(dom)
      if (prev && next) {
        prev = findElementSibling(prev, 'previousSibling')
        next = findElementSibling(next, 'nextSibling')
        if (elementUtils.compare(prev, next)) {
          for (sibling = prev.nextSibling; sibling && sibling !== next;) {
            tmpSibling = sibling
            sibling = sibling.nextSibling
            prev.appendChild(tmpSibling)
          }
          dom.remove(next)
          Tools.each(Tools.grep(next.childNodes), (node) => {
            prev.appendChild(node)
          })
          return prev
        }
      }
      return next
    }
    var processChildElements = function (node, filter, process) {
      each$c(node.childNodes, (node) => {
        if (isElementNode(node)) {
          if (filter(node)) {
            process(node)
          }
          if (node.hasChildNodes()) {
            processChildElements(node, filter, process)
          }
        }
      })
    }
    const hasStyle = function (dom, name) {
      return curry((name, node) => !!(node && FormatUtils.getStyle(dom, node, name)), name)
    }
    const applyStyle = function (dom, name, value) {
      return curry((name, value, node) => {
        dom.setStyle(node, name, value)
        if (node.getAttribute('style') === '') {
          node.removeAttribute('style')
        }
        unwrapEmptySpan(dom, node)
      }, name, value)
    }
    var unwrapEmptySpan = function (dom, node) {
      if (node.nodeName === 'SPAN' && dom.getAttribs(node).length === 0) {
        dom.remove(node, true)
      }
    }
    const processUnderlineAndColor = function (dom, node) {
      let textDecoration
      if (node.nodeType === 1 && node.parentNode && node.parentNode.nodeType === 1) {
        textDecoration = FormatUtils.getTextDecoration(dom, node.parentNode)
        if (dom.getStyle(node, 'color') && textDecoration) {
          dom.setStyle(node, 'text-decoration', textDecoration)
        } else if (dom.getStyle(node, 'text-decoration') === textDecoration) {
          dom.setStyle(node, 'text-decoration', null)
        }
      }
    }
    const mergeUnderlineAndColor = function (dom, format, vars, node) {
      if (format.styles.color || format.styles.textDecoration) {
        Tools.walk(node, curry(processUnderlineAndColor, dom), 'childNodes')
        processUnderlineAndColor(dom, node)
      }
    }
    const mergeBackgroundColorAndFontSize = function (dom, format, vars, node) {
      if (format.styles && format.styles.backgroundColor) {
        processChildElements(node, hasStyle(dom, 'fontSize'), applyStyle(dom, 'backgroundColor', FormatUtils.replaceVars(format.styles.backgroundColor, vars)))
      }
    }
    const mergeSubSup = function (dom, format, vars, node) {
      if (format.inline === 'sub' || format.inline === 'sup') {
        processChildElements(node, hasStyle(dom, 'fontSize'), applyStyle(dom, 'fontSize', ''))
        dom.remove(dom.select(format.inline === 'sup' ? 'sub' : 'sup', node), true)
      }
    }
    const mergeSiblings = function (dom, format, vars, node) {
      if (node && format.merge_siblings !== false) {
        node = mergeSiblingsNodes(dom, FormatUtils.getNonWhiteSpaceSibling(node), node)
        node = mergeSiblingsNodes(dom, node, FormatUtils.getNonWhiteSpaceSibling(node, true))
      }
    }
    const clearChildStyles = function (dom, format, node) {
      if (format.clear_child_styles) {
        const selector = format.links ? '*:not(a)' : '*'
        each$c(dom.select(selector, node), (node) => {
          if (isElementNode(node)) {
            each$c(format.styles, (value, name) => {
              dom.setStyle(node, name, '')
            })
          }
        })
      }
    }
    const mergeWithChildren = function (editor, formatList, vars, node) {
      each$c(formatList, (format) => {
        each$c(editor.dom.select(format.inline, node), (child) => {
          if (!isElementNode(child)) {
            return
          }
          RemoveFormat.removeFormat(editor, format, vars, child, format.exact ? child : null)
        })
        clearChildStyles(editor.dom, format, node)
      })
    }
    const mergeWithParents = function (editor, format, name, vars, node) {
      if (MatchFormat.matchNode(editor, node.parentNode, name, vars)) {
        if (RemoveFormat.removeFormat(editor, format, vars, node)) {
          return
        }
      }
      if (format.merge_with_parents) {
        editor.dom.getParent(node.parentNode, (parent) => {
          if (MatchFormat.matchNode(editor, parent, name, vars)) {
            RemoveFormat.removeFormat(editor, format, vars, node)
            return true
          }
        })
      }
    }
    const MergeFormats = {
      mergeWithChildren,
      mergeUnderlineAndColor,
      mergeBackgroundColorAndFontSize,
      mergeSubSup,
      mergeSiblings,
      mergeWithParents,
    }

    const createRange$1 = function (sc, so, ec, eo) {
      const rng = document.createRange()
      rng.setStart(sc, so)
      rng.setEnd(ec, eo)
      return rng
    }
    const normalizeBlockSelectionRange = function (rng) {
      const startPos = CaretPosition$1.fromRangeStart(rng)
      const endPos = CaretPosition$1.fromRangeEnd(rng)
      const rootNode = rng.commonAncestorContainer
      return CaretFinder.fromPosition(false, rootNode, endPos).map((newEndPos) => {
        if (!isInSameBlock(startPos, endPos, rootNode) && isInSameBlock(startPos, newEndPos, rootNode)) {
          return createRange$1(startPos.container(), startPos.offset(), newEndPos.container(), newEndPos.offset())
        }
        return rng
      }).getOr(rng)
    }
    const normalize$1 = function (rng) {
      return rng.collapsed ? rng : normalizeBlockSelectionRange(rng)
    }
    const RangeNormalizer = { normalize: normalize$1 }

    const each$d = Tools.each
    const isElementNode$1 = function (node) {
      return node && node.nodeType === 1 && !Bookmarks.isBookmarkNode(node) && !isCaretNode(node) && !NodeType.isBogus(node)
    }
    var applyFormat = function (ed, name, vars, node) {
      const formatList = ed.formatter.get(name)
      const format = formatList[0]
      let bookmark, rng
      const isCollapsed = !node && ed.selection.isCollapsed()
      const { dom } = ed; const { selection } = ed
      const setElementFormat = function (elm, fmt) {
        fmt = fmt || format
        if (elm) {
          if (fmt.onformat) {
            fmt.onformat(elm, fmt, vars, node)
          }
          each$d(fmt.styles, (value, name) => {
            dom.setStyle(elm, name, FormatUtils.replaceVars(value, vars))
          })
          if (fmt.styles) {
            const styleVal = dom.getAttrib(elm, 'style')
            if (styleVal) {
              elm.setAttribute('data-mce-style', styleVal)
            }
          }
          each$d(fmt.attributes, (value, name) => {
            dom.setAttrib(elm, name, FormatUtils.replaceVars(value, vars))
          })
          each$d(fmt.classes, (value) => {
            value = FormatUtils.replaceVars(value, vars)
            if (!dom.hasClass(elm, value)) {
              dom.addClass(elm, value)
            }
          })
        }
      }
      const applyNodeStyle = function (formatList, node) {
        let found = false
        if (!format.selector) {
          return false
        }
        each$d(formatList, (format) => {
          if ('collapsed' in format && format.collapsed !== isCollapsed) {
            return
          }
          if (dom.is(node, format.selector) && !isCaretNode(node)) {
            setElementFormat(node, format)
            found = true
            return false
          }
        })
        return found
      }
      const applyRngStyle = function (dom, rng, bookmark, nodeSpecific) {
        const newWrappers = []
        let wrapName; let wrapElm; let contentEditable = true
        wrapName = format.inline || format.block
        wrapElm = dom.create(wrapName)
        setElementFormat(wrapElm)
        RangeWalk.walk(dom, rng, (nodes) => {
          let currentWrapElm
          var process = function (node) {
            let nodeName, parentName, hasContentEditableState, lastContentEditable
            lastContentEditable = contentEditable
            nodeName = node.nodeName.toLowerCase()
            parentName = node.parentNode.nodeName.toLowerCase()
            if (node.nodeType === 1 && dom.getContentEditable(node)) {
              lastContentEditable = contentEditable
              contentEditable = dom.getContentEditable(node) === 'true'
              hasContentEditableState = true
            }
            if (FormatUtils.isEq(nodeName, 'br')) {
              currentWrapElm = 0
              if (format.block) {
                dom.remove(node)
              }
              return
            }
            if (format.wrapper && MatchFormat.matchNode(ed, node, name, vars)) {
              currentWrapElm = 0
              return
            }
            if (contentEditable && !hasContentEditableState && format.block && !format.wrapper && FormatUtils.isTextBlock(ed, nodeName) && FormatUtils.isValid(ed, parentName, wrapName)) {
              node = dom.rename(node, wrapName)
              setElementFormat(node)
              newWrappers.push(node)
              currentWrapElm = 0
              return
            }
            if (format.selector) {
              const found = applyNodeStyle(formatList, node)
              if (!format.inline || found) {
                currentWrapElm = 0
                return
              }
            }
            if (contentEditable && !hasContentEditableState && FormatUtils.isValid(ed, wrapName, nodeName) && FormatUtils.isValid(ed, parentName, wrapName) && !(!nodeSpecific && node.nodeType === 3 && node.nodeValue.length === 1 && node.nodeValue.charCodeAt(0) === 65279) && !isCaretNode(node) && (!format.inline || !dom.isBlock(node))) {
              if (!currentWrapElm) {
                currentWrapElm = dom.clone(wrapElm, false)
                node.parentNode.insertBefore(currentWrapElm, node)
                newWrappers.push(currentWrapElm)
              }
              currentWrapElm.appendChild(node)
            } else {
              currentWrapElm = 0
              each$d(Tools.grep(node.childNodes), process)
              if (hasContentEditableState) {
                contentEditable = lastContentEditable
              }
              currentWrapElm = 0
            }
          }
          each$d(nodes, process)
        })
        if (format.links === true) {
          each$d(newWrappers, (node) => {
            var process = function (node) {
              if (node.nodeName === 'A') {
                setElementFormat(node, format)
              }
              each$d(Tools.grep(node.childNodes), process)
            }
            process(node)
          })
        }
        each$d(newWrappers, (node) => {
          let childCount
          const getChildCount = function (node) {
            let count = 0
            each$d(node.childNodes, (node) => {
              if (!FormatUtils.isWhiteSpaceNode(node) && !Bookmarks.isBookmarkNode(node)) {
                count++
              }
            })
            return count
          }
          const getChildElementNode = function (root) {
            let child = false
            each$d(root.childNodes, (node) => {
              if (isElementNode$1(node)) {
                child = node
                return false
              }
            })
            return child
          }
          const mergeStyles = function (node) {
            let child, clone
            child = getChildElementNode(node)
            if (child && !Bookmarks.isBookmarkNode(child) && MatchFormat.matchName(dom, child, format)) {
              clone = dom.clone(child, false)
              setElementFormat(clone)
              dom.replace(clone, node, true)
              dom.remove(child, 1)
            }
            return clone || node
          }
          childCount = getChildCount(node)
          if ((newWrappers.length > 1 || !dom.isBlock(node)) && childCount === 0) {
            dom.remove(node, 1)
            return
          }
          if (format.inline || format.wrapper) {
            if (!format.exact && childCount === 1) {
              node = mergeStyles(node)
            }
            MergeFormats.mergeWithChildren(ed, formatList, vars, node)
            MergeFormats.mergeWithParents(ed, format, name, vars, node)
            MergeFormats.mergeBackgroundColorAndFontSize(dom, format, vars, node)
            MergeFormats.mergeSubSup(dom, format, vars, node)
            MergeFormats.mergeSiblings(dom, format, vars, node)
          }
        })
      }
      if (dom.getContentEditable(selection.getNode()) === 'false') {
        node = selection.getNode()
        for (let i = 0, l = formatList.length; i < l; i++) {
          if (formatList[i].ceFalseOverride && dom.is(node, formatList[i].selector)) {
            setElementFormat(node, formatList[i])
            return
          }
        }
        return
      }
      if (format) {
        if (node) {
          if (node.nodeType) {
            if (!applyNodeStyle(formatList, node)) {
              rng = dom.createRng()
              rng.setStartBefore(node)
              rng.setEndAfter(node)
              applyRngStyle(dom, ExpandRange.expandRng(ed, rng, formatList), null, true)
            }
          } else {
            applyRngStyle(dom, node, null, true)
          }
        } else if (!isCollapsed || !format.inline || dom.select('td[data-mce-selected],th[data-mce-selected]').length) {
          const curSelNode = ed.selection.getNode()
          if (!ed.settings.forced_root_block && formatList[0].defaultBlock && !dom.getParent(curSelNode, dom.isBlock)) {
            applyFormat(ed, formatList[0].defaultBlock)
          }
          ed.selection.setRng(RangeNormalizer.normalize(ed.selection.getRng()))
          bookmark = GetBookmark.getPersistentBookmark(ed.selection, true)
          applyRngStyle(dom, ExpandRange.expandRng(ed, selection.getRng(), formatList), bookmark)
          if (format.styles) {
            MergeFormats.mergeUnderlineAndColor(dom, format, vars, curSelNode)
          }
          selection.moveToBookmark(bookmark)
          FormatUtils.moveStart(dom, selection, selection.getRng())
          ed.nodeChanged()
        } else {
          applyCaretFormat(ed, name, vars)
        }
        Hooks.postProcess(name, ed)
      }
    }
    const ApplyFormat = { applyFormat }

    const each$e = Tools.each
    const setup$5 = function (formatChangeData, editor) {
      const currentFormats = {}
      formatChangeData.set({})
      editor.on('NodeChange', (e) => {
        let parents = FormatUtils.getParents(editor.dom, e.element)
        const matchedFormats = {}
        parents = Tools.grep(parents, (node) => node.nodeType === 1 && !node.getAttribute('data-mce-bogus'))
        each$e(formatChangeData.get(), (callbacks, format) => {
          each$e(parents, (node) => {
            if (editor.formatter.matchNode(node, format, {}, callbacks.similar)) {
              if (!currentFormats[format]) {
                each$e(callbacks, (callback) => {
                  callback(true, {
                    node,
                    format,
                    parents,
                  })
                })
                currentFormats[format] = callbacks
              }
              matchedFormats[format] = callbacks
              return false
            }
            if (MatchFormat.matchesUnInheritedFormatSelector(editor, node, format)) {
              return false
            }
          })
        })
        each$e(currentFormats, (callbacks, format) => {
          if (!matchedFormats[format]) {
            delete currentFormats[format]
            each$e(callbacks, (callback) => {
              callback(false, {
                node: e.element,
                format,
                parents,
              })
            })
          }
        })
      })
    }
    const addListeners = function (formatChangeData, formats, callback, similar) {
      const formatChangeItems = formatChangeData.get()
      each$e(formats.split(','), (format) => {
        if (!formatChangeItems[format]) {
          formatChangeItems[format] = []
          formatChangeItems[format].similar = similar
        }
        formatChangeItems[format].push(callback)
      })
      formatChangeData.set(formatChangeItems)
    }
    const formatChanged = function (editor, formatChangeState, formats, callback, similar) {
      if (formatChangeState.get() === null) {
        setup$5(formatChangeState, editor)
      }
      addListeners(formatChangeState, formats, callback, similar)
    }
    const FormatChanged = { formatChanged }

    const get$8 = function (dom) {
      const formats = {
        valigntop: [{
          selector: 'td,th',
          styles: { verticalAlign: 'top' },
        }],
        valignmiddle: [{
          selector: 'td,th',
          styles: { verticalAlign: 'middle' },
        }],
        valignbottom: [{
          selector: 'td,th',
          styles: { verticalAlign: 'bottom' },
        }],
        alignleft: [
          {
            selector: 'figure.image',
            collapsed: false,
            classes: 'align-left',
            ceFalseOverride: true,
            preview: 'font-family font-size',
          },
          {
            selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li',
            styles: { textAlign: 'left' },
            inherit: false,
            preview: false,
            defaultBlock: 'div',
          },
          {
            selector: 'img,table',
            collapsed: false,
            styles: { float: 'left' },
            preview: 'font-family font-size',
          },
        ],
        aligncenter: [
          {
            selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li',
            styles: { textAlign: 'center' },
            inherit: false,
            preview: 'font-family font-size',
            defaultBlock: 'div',
          },
          {
            selector: 'figure.image',
            collapsed: false,
            classes: 'align-center',
            ceFalseOverride: true,
            preview: 'font-family font-size',
          },
          {
            selector: 'img',
            collapsed: false,
            styles: {
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            },
            preview: false,
          },
          {
            selector: 'table',
            collapsed: false,
            styles: {
              marginLeft: 'auto',
              marginRight: 'auto',
            },
            preview: 'font-family font-size',
          },
        ],
        alignright: [
          {
            selector: 'figure.image',
            collapsed: false,
            classes: 'align-right',
            ceFalseOverride: true,
            preview: 'font-family font-size',
          },
          {
            selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li',
            styles: { textAlign: 'right' },
            inherit: false,
            preview: 'font-family font-size',
            defaultBlock: 'div',
          },
          {
            selector: 'img,table',
            collapsed: false,
            styles: { float: 'right' },
            preview: 'font-family font-size',
          },
        ],
        alignjustify: [{
          selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li',
          styles: { textAlign: 'justify' },
          inherit: false,
          defaultBlock: 'div',
          preview: 'font-family font-size',
        }],
        bold: [
          {
            inline: 'strong',
            remove: 'all',
          },
          {
            inline: 'span',
            styles: { fontWeight: 'bold' },
          },
          {
            inline: 'b',
            remove: 'all',
          },
        ],
        italic: [
          {
            inline: 'em',
            remove: 'all',
          },
          {
            inline: 'span',
            styles: { fontStyle: 'italic' },
          },
          {
            inline: 'i',
            remove: 'all',
          },
        ],
        underline: [
          {
            inline: 'span',
            styles: { textDecoration: 'underline' },
            exact: true,
          },
          {
            inline: 'u',
            remove: 'all',
          },
        ],
        strikethrough: [
          {
            inline: 'span',
            styles: { textDecoration: 'line-through' },
            exact: true,
          },
          {
            inline: 'strike',
            remove: 'all',
          },
        ],
        forecolor: {
          inline: 'span',
          styles: { color: '%value' },
          links: true,
          remove_similar: true,
          clear_child_styles: true,
        },
        hilitecolor: {
          inline: 'span',
          styles: { backgroundColor: '%value' },
          links: true,
          remove_similar: true,
          clear_child_styles: true,
        },
        fontname: {
          inline: 'span',
          toggle: false,
          styles: { fontFamily: '%value' },
          clear_child_styles: true,
        },
        fontsize: {
          inline: 'span',
          toggle: false,
          styles: { fontSize: '%value' },
          clear_child_styles: true,
        },
        fontsize_class: {
          inline: 'span',
          attributes: { class: '%value' },
        },
        blockquote: {
          block: 'blockquote',
          wrapper: true,
          remove: 'all',
        },
        subscript: { inline: 'sub' },
        superscript: { inline: 'sup' },
        code: { inline: 'code' },
        link: {
          inline: 'a',
          selector: 'a',
          remove: 'all',
          split: true,
          deep: true,
          onmatch() {
            return true
          },
          onformat(elm, fmt, vars) {
            Tools.each(vars, (value, key) => {
              dom.setAttrib(elm, key, value)
            })
          },
        },
        removeformat: [
          {
            selector: 'b,strong,em,i,font,u,strike,sub,sup,dfn,code,samp,kbd,var,cite,mark,q,del,ins',
            remove: 'all',
            split: true,
            expand: false,
            block_expand: true,
            deep: true,
          },
          {
            selector: 'span',
            attributes: [
              'style',
              'class',
            ],
            remove: 'empty',
            split: true,
            expand: false,
            deep: true,
          },
          {
            selector: '*',
            attributes: [
              'style',
              'class',
            ],
            split: false,
            expand: false,
            deep: true,
          },
        ],
      }
      Tools.each('p h1 h2 h3 h4 h5 h6 div address pre div dt dd samp'.split(/\s/), (name) => {
        formats[name] = {
          block: name,
          remove: 'all',
        }
      })
      return formats
    }
    const DefaultFormats = { get: get$8 }

    function FormatRegistry(editor) {
      const formats = {}
      const get$$1 = function (name) {
        return name ? formats[name] : formats
      }
      const has$$1 = function (name) {
        return has(formats, name)
      }
      var register = function (name, format) {
        if (name) {
          if (typeof name !== 'string') {
            Tools.each(name, (format, name) => {
              register(name, format)
            })
          } else {
            format = format.length ? format : [format]
            Tools.each(format, (format) => {
              if (typeof format.deep === 'undefined') {
                format.deep = !format.selector
              }
              if (typeof format.split === 'undefined') {
                format.split = !format.selector || format.inline
              }
              if (typeof format.remove === 'undefined' && format.selector && !format.inline) {
                format.remove = 'none'
              }
              if (format.selector && format.inline) {
                format.mixed = true
                format.block_expand = true
              }
              if (typeof format.classes === 'string') {
                format.classes = format.classes.split(/\s+/)
              }
            })
            formats[name] = format
          }
        }
      }
      const unregister = function (name) {
        if (name && formats[name]) {
          delete formats[name]
        }
        return formats
      }
      register(DefaultFormats.get(editor.dom))
      register(editor.settings.formats)
      return {
        get: get$$1,
        has: has$$1,
        register,
        unregister,
      }
    }

    const each$f = Tools.each
    const dom = DOMUtils$1.DOM
    const parsedSelectorToHtml = function (ancestry, editor) {
      let elm, item, fragment
      const schema = editor && editor.schema || Schema({})
      const decorate = function (elm, item) {
        if (item.classes.length) {
          dom.addClass(elm, item.classes.join(' '))
        }
        dom.setAttribs(elm, item.attrs)
      }
      const createElement = function (sItem) {
        let elm
        item = typeof sItem === 'string' ? {
          name: sItem,
          classes: [],
          attrs: {},
        } : sItem
        elm = dom.create(item.name)
        decorate(elm, item)
        return elm
      }
      const getRequiredParent = function (elm, candidate) {
        const name = typeof elm !== 'string' ? elm.nodeName.toLowerCase() : elm
        const elmRule = schema.getElementRule(name)
        const parentsRequired = elmRule && elmRule.parentsRequired
        if (parentsRequired && parentsRequired.length) {
          return candidate && Tools.inArray(parentsRequired, candidate) !== -1 ? candidate : parentsRequired[0]
        }
        return false
      }
      var wrapInHtml = function (elm, ancestry, siblings) {
        let parent, parentCandidate, parentRequired
        const ancestor = ancestry.length > 0 && ancestry[0]
        const ancestorName = ancestor && ancestor.name
        parentRequired = getRequiredParent(elm, ancestorName)
        if (parentRequired) {
          if (ancestorName === parentRequired) {
            parentCandidate = ancestry[0]
            ancestry = ancestry.slice(1)
          } else {
            parentCandidate = parentRequired
          }
        } else if (ancestor) {
          parentCandidate = ancestry[0]
          ancestry = ancestry.slice(1)
        } else if (!siblings) {
          return elm
        }
        if (parentCandidate) {
          parent = createElement(parentCandidate)
          parent.appendChild(elm)
        }
        if (siblings) {
          if (!parent) {
            parent = dom.create('div')
            parent.appendChild(elm)
          }
          Tools.each(siblings, (sibling) => {
            const siblingElm = createElement(sibling)
            parent.insertBefore(siblingElm, elm)
          })
        }
        return wrapInHtml(parent, ancestry, parentCandidate && parentCandidate.siblings)
      }
      if (ancestry && ancestry.length) {
        item = ancestry[0]
        elm = createElement(item)
        fragment = dom.create('div')
        fragment.appendChild(wrapInHtml(elm, ancestry.slice(1), item.siblings))
        return fragment
      }
      return ''
    }
    const selectorToHtml = function (selector, editor) {
      return parsedSelectorToHtml(parseSelector(selector), editor)
    }
    const parseSelectorItem = function (item) {
      let tagName
      const obj = {
        classes: [],
        attrs: {},
      }
      item = obj.selector = Tools.trim(item)
      if (item !== '*') {
        tagName = item.replace(/(?:([#\.]|::?)([\w\-]+)|(\[)([^\]]+)\]?)/g, ($0, $1, $2, $3, $4) => {
          switch ($1) {
            case '#':
              obj.attrs.id = $2
              break
            case '.':
              obj.classes.push($2)
              break
            case ':':
              if (Tools.inArray('checked disabled enabled read-only required'.split(' '), $2) !== -1) {
                obj.attrs[$2] = $2
              }
              break
          }
          if ($3 === '[') {
            const m = $4.match(/([\w\-]+)(?:\=\"([^\"]+))?/)
            if (m) {
              obj.attrs[m[1]] = m[2]
            }
          }
          return ''
        })
      }
      obj.name = tagName || 'div'
      return obj
    }
    var parseSelector = function (selector) {
      if (!selector || typeof selector !== 'string') {
        return []
      }
      selector = selector.split(/\s*,\s*/)[0]
      selector = selector.replace(/\s*(~\+|~|\+|>)\s*/g, '$1')
      return Tools.map(selector.split(/(?:>|\s+(?![^\[\]]+\]))/), (item) => {
        const siblings = Tools.map(item.split(/(?:~\+|~|\+)/), parseSelectorItem)
        const obj = siblings.pop()
        if (siblings.length) {
          obj.siblings = siblings
        }
        return obj
      }).reverse()
    }
    const getCssText = function (editor, format) {
      let name, previewFrag, previewElm, items
      let previewCss = ''; let parentFontSize; let previewStyles
      previewStyles = editor.settings.preview_styles
      if (previewStyles === false) {
        return ''
      }
      if (typeof previewStyles !== 'string') {
        previewStyles = 'font-family font-size font-weight font-style text-decoration ' + 'text-transform color background-color border border-radius outline text-shadow'
      }
      const removeVars = function (val) {
        return val.replace(/%(\w+)/g, '')
      }
      if (typeof format === 'string') {
        format = editor.formatter.get(format)
        if (!format) {
          return
        }
        format = format[0]
      }
      if ('preview' in format) {
        previewStyles = format.preview
        if (previewStyles === false) {
          return ''
        }
      }
      name = format.block || format.inline || 'span'
      items = parseSelector(format.selector)
      if (items.length) {
        if (!items[0].name) {
          items[0].name = name
        }
        name = format.selector
        previewFrag = parsedSelectorToHtml(items, editor)
      } else {
        previewFrag = parsedSelectorToHtml([name], editor)
      }
      previewElm = dom.select(name, previewFrag)[0] || previewFrag.firstChild
      each$f(format.styles, (value, name) => {
        value = removeVars(value)
        if (value) {
          dom.setStyle(previewElm, name, value)
        }
      })
      each$f(format.attributes, (value, name) => {
        value = removeVars(value)
        if (value) {
          dom.setAttrib(previewElm, name, value)
        }
      })
      each$f(format.classes, (value) => {
        value = removeVars(value)
        if (!dom.hasClass(previewElm, value)) {
          dom.addClass(previewElm, value)
        }
      })
      editor.fire('PreviewFormats')
      dom.setStyles(previewFrag, {
        position: 'absolute',
        left: -65535,
      })
      editor.getBody().appendChild(previewFrag)
      parentFontSize = dom.getStyle(editor.getBody(), 'fontSize', true)
      parentFontSize = /px$/.test(parentFontSize) ? parseInt(parentFontSize, 10) : 0
      each$f(previewStyles.split(' '), (name) => {
        let value = dom.getStyle(previewElm, name, true)
        if (name === 'background-color' && /transparent|rgba\s*\([^)]+,\s*0\)/.test(value)) {
          value = dom.getStyle(editor.getBody(), name, true)
          if (dom.toHex(value).toLowerCase() === '#ffffff') {
            return
          }
        }
        if (name === 'color') {
          if (dom.toHex(value).toLowerCase() === '#000000') {
            return
          }
        }
        if (name === 'font-size') {
          if (/em|%$/.test(value)) {
            if (parentFontSize === 0) {
              return
            }
            const numValue = parseFloat(value) / (/%$/.test(value) ? 100 : 1)
            value = `${numValue * parentFontSize}px`
          }
        }
        if (name === 'border' && value) {
          previewCss += 'padding:0 2px;'
        }
        previewCss += `${name}:${value};`
      })
      editor.fire('AfterPreviewFormats')
      dom.remove(previewFrag)
      return previewCss
    }
    const Preview = {
      getCssText,
      parseSelector,
      selectorToHtml,
    }

    const toggle$3 = function (editor, formats, name, vars, node) {
      const fmt = formats.get(name)
      if (MatchFormat.match(editor, name, vars, node) && (!('toggle' in fmt[0]) || fmt[0].toggle)) {
        RemoveFormat.remove(editor, name, vars, node)
      } else {
        ApplyFormat.applyFormat(editor, name, vars, node)
      }
    }
    const ToggleFormat = { toggle: toggle$3 }

    const setup$6 = function (editor) {
      editor.addShortcut('meta+b', '', 'Bold')
      editor.addShortcut('meta+i', '', 'Italic')
      editor.addShortcut('meta+u', '', 'Underline')
      for (let i = 1; i <= 6; i++) {
        editor.addShortcut(`access+${i}`, '', [
          'FormatBlock',
          false,
          `h${i}`,
        ])
      }
      editor.addShortcut('access+7', '', [
        'FormatBlock',
        false,
        'p',
      ])
      editor.addShortcut('access+8', '', [
        'FormatBlock',
        false,
        'div',
      ])
      editor.addShortcut('access+9', '', [
        'FormatBlock',
        false,
        'address',
      ])
    }
    const FormatShortcuts = { setup: setup$6 }

    function Formatter(editor) {
      const formats = FormatRegistry(editor)
      const formatChangeState = Cell(null)
      FormatShortcuts.setup(editor)
      setup$4(editor)
      return {
        get: formats.get,
        has: formats.has,
        register: formats.register,
        unregister: formats.unregister,
        apply: curry(ApplyFormat.applyFormat, editor),
        remove: curry(RemoveFormat.remove, editor),
        toggle: curry(ToggleFormat.toggle, editor, formats),
        match: curry(MatchFormat.match, editor),
        matchAll: curry(MatchFormat.matchAll, editor),
        matchNode: curry(MatchFormat.matchNode, editor),
        canApply: curry(MatchFormat.canApply, editor),
        formatChanged: curry(FormatChanged.formatChanged, editor, formatChangeState),
        getCssText: curry(Preview.getCssText, editor),
      }
    }

    const register = function (htmlParser, settings, dom) {
      htmlParser.addAttributeFilter('data-mce-tabindex', (nodes, name) => {
        let i = nodes.length; let node
        while (i--) {
          node = nodes[i]
          node.attr('tabindex', node.attributes.map['data-mce-tabindex'])
          node.attr(name, null)
        }
      })
      htmlParser.addAttributeFilter('src,href,style', (nodes, name) => {
        let i = nodes.length; let node; let value
        const internalName = `data-mce-${name}`
        const urlConverter = settings.url_converter
        const urlConverterScope = settings.url_converter_scope
        while (i--) {
          node = nodes[i]
          value = node.attributes.map[internalName]
          if (value !== undefined) {
            node.attr(name, value.length > 0 ? value : null)
            node.attr(internalName, null)
          } else {
            value = node.attributes.map[name]
            if (name === 'style') {
              value = dom.serializeStyle(dom.parseStyle(value), node.name)
            } else if (urlConverter) {
              value = urlConverter.call(urlConverterScope, value, name, node.name)
            }
            node.attr(name, value.length > 0 ? value : null)
          }
        }
      })
      htmlParser.addAttributeFilter('class', (nodes) => {
        let i = nodes.length; let node; let value
        while (i--) {
          node = nodes[i]
          value = node.attr('class')
          if (value) {
            value = node.attr('class').replace(/(?:^|\s)mce-item-\w+(?!\S)/g, '')
            node.attr('class', value.length > 0 ? value : null)
          }
        }
      })
      htmlParser.addAttributeFilter('data-mce-type', (nodes, name, args) => {
        let i = nodes.length; let node
        while (i--) {
          node = nodes[i]
          if (node.attributes.map['data-mce-type'] === 'bookmark' && !args.cleanup) {
            node.remove()
          }
        }
      })
      htmlParser.addNodeFilter('noscript', (nodes) => {
        let i = nodes.length; let node
        while (i--) {
          node = nodes[i].firstChild
          if (node) {
            node.value = Entities.decode(node.value)
          }
        }
      })
      htmlParser.addNodeFilter('script,style', (nodes, name) => {
        let i = nodes.length; let node; let value; let type
        const trim = function (value) {
          return value.replace(/(<!--\[CDATA\[|\]\]-->)/g, '\n').replace(/^[\r\n]*|[\r\n]*$/g, '').replace(/^\s*((<!--)?(\s*\/\/)?\s*<!\[CDATA\[|(<!--\s*)?\/\*\s*<!\[CDATA\[\s*\*\/|(\/\/)?\s*<!--|\/\*\s*<!--\s*\*\/)\s*[\r\n]*/gi, '').replace(/\s*(\/\*\s*\]\]>\s*\*\/(-->)?|\s*\/\/\s*\]\]>(-->)?|\/\/\s*(-->)?|\]\]>|\/\*\s*-->\s*\*\/|\s*-->\s*)\s*$/g, '')
        }
        while (i--) {
          node = nodes[i]
          value = node.firstChild ? node.firstChild.value : ''
          if (name === 'script') {
            type = node.attr('type')
            if (type) {
              node.attr('type', type === 'mce-no/type' ? null : type.replace(/^mce\-/, ''))
            }
            if (settings.element_format === 'xhtml' && value.length > 0) {
              node.firstChild.value = `// <![CDATA[\n${trim(value)}\n// ]]>`
            }
          } else if (settings.element_format === 'xhtml' && value.length > 0) {
            node.firstChild.value = `<!--\n${trim(value)}\n-->`
          }
        }
      })
      htmlParser.addNodeFilter('#comment', (nodes) => {
        let i = nodes.length; let node
        while (i--) {
          node = nodes[i]
          if (node.value.indexOf('[CDATA[') === 0) {
            node.name = '#cdata'
            node.type = 4
            node.value = node.value.replace(/^\[CDATA\[|\]\]$/g, '')
          } else if (node.value.indexOf('mce:protected ') === 0) {
            node.name = '#text'
            node.type = 3
            node.raw = true
            node.value = unescape(node.value).substr(14)
          }
        }
      })
      htmlParser.addNodeFilter('xml:namespace,input', (nodes, name) => {
        let i = nodes.length; let node
        while (i--) {
          node = nodes[i]
          if (node.type === 7) {
            node.remove()
          } else if (node.type === 1) {
            if (name === 'input' && !('type' in node.attributes.map)) {
              node.attr('type', 'text')
            }
          }
        }
      })
      htmlParser.addAttributeFilter('data-mce-type', (nodes) => {
        each(nodes, (node) => {
          if (node.attr('data-mce-type') === 'format-caret') {
            if (node.isEmpty(htmlParser.schema.getNonEmptyElements())) {
              node.remove()
            } else {
              node.unwrap()
            }
          }
        })
      })
      htmlParser.addAttributeFilter('data-mce-src,data-mce-href,data-mce-style,' + 'data-mce-selected,data-mce-expando,' + 'data-mce-type,data-mce-resize', (nodes, name) => {
        let i = nodes.length
        while (i--) {
          nodes[i].attr(name, null)
        }
      })
    }
    const trimTrailingBr = function (rootNode) {
      let brNode1, brNode2
      const isBr = function (node) {
        return node && node.name === 'br'
      }
      brNode1 = rootNode.lastChild
      if (isBr(brNode1)) {
        brNode2 = brNode1.prev
        if (isBr(brNode2)) {
          brNode1.remove()
          brNode2.remove()
        }
      }
    }
    const DomSerializerFilters = {
      register,
      trimTrailingBr,
    }

    const preProcess = function (editor, node, args) {
      let impl, doc, oldDoc
      const { dom } = editor
      node = node.cloneNode(true)
      impl = document.implementation
      if (impl.createHTMLDocument) {
        doc = impl.createHTMLDocument('')
        Tools.each(node.nodeName === 'BODY' ? node.childNodes : [node], (node) => {
          doc.body.appendChild(doc.importNode(node, true))
        })
        if (node.nodeName !== 'BODY') {
          node = doc.body.firstChild
        } else {
          node = doc.body
        }
        oldDoc = dom.doc
        dom.doc = doc
      }
      Events.firePreProcess(editor, merge(args, { node }))
      if (oldDoc) {
        dom.doc = oldDoc
      }
      return node
    }
    const shouldFireEvent = function (editor, args) {
      return editor && editor.hasEventListeners('PreProcess') && !args.no_events
    }
    const process = function (editor, node, args) {
      return shouldFireEvent(editor, args) ? preProcess(editor, node, args) : node
    }
    const DomSerializerPreProcess = { process }

    const removeAttrs = function (node, names) {
      each(names, (name) => {
        node.attr(name, null)
      })
    }
    const addFontToSpansFilter = function (domParser, styles, fontSizes) {
      domParser.addNodeFilter('font', (nodes) => {
        each(nodes, (node) => {
          const props = styles.parse(node.attr('style'))
          const color = node.attr('color')
          const face = node.attr('face')
          const size = node.attr('size')
          if (color) {
            props.color = color
          }
          if (face) {
            props['font-family'] = face
          }
          if (size) {
            props['font-size'] = fontSizes[parseInt(node.attr('size'), 10) - 1]
          }
          node.name = 'span'
          node.attr('style', styles.serialize(props))
          removeAttrs(node, [
            'color',
            'face',
            'size',
          ])
        })
      })
    }
    const addStrikeToSpanFilter = function (domParser, styles) {
      domParser.addNodeFilter('strike', (nodes) => {
        each(nodes, (node) => {
          const props = styles.parse(node.attr('style'))
          props['text-decoration'] = 'line-through'
          node.name = 'span'
          node.attr('style', styles.serialize(props))
        })
      })
    }
    const addFilters = function (domParser, settings) {
      const styles = Styles()
      if (settings.convert_fonts_to_spans) {
        addFontToSpansFilter(domParser, styles, Tools.explode(settings.font_size_legacy_values))
      }
      addStrikeToSpanFilter(domParser, styles)
    }
    const register$1 = function (domParser, settings) {
      if (settings.inline_styles) {
        addFilters(domParser, settings)
      }
    }
    const LegacyFilter = { register: register$1 }

    const paddEmptyNode = function (settings, args, blockElements, node) {
      const brPreferred = settings.padd_empty_with_br || args.insert
      if (brPreferred && blockElements[node.name]) {
        node.empty().append(new Node$2('br', 1)).shortEnded = true
      } else {
        node.empty().append(new Node$2('#text', 3)).value = '\xA0'
      }
    }
    const isPaddedWithNbsp = function (node) {
      return hasOnlyChild(node, '#text') && node.firstChild.value === '\xA0'
    }
    var hasOnlyChild = function (node, name) {
      return node && node.firstChild && node.firstChild === node.lastChild && node.firstChild.name === name
    }
    const isPadded = function (schema, node) {
      const rule = schema.getElementRule(node.name)
      return rule && rule.paddEmpty
    }
    const isEmpty$2 = function (schema, nonEmptyElements, whitespaceElements, node) {
      return node.isEmpty(nonEmptyElements, whitespaceElements, (node) => isPadded(schema, node))
    }
    const isLineBreakNode = function (node, blockElements) {
      return node && (blockElements[node.name] || node.name === 'br')
    }

    const register$2 = function (parser, settings) {
      const { schema } = parser
      if (settings.remove_trailing_brs) {
        parser.addNodeFilter('br', (nodes, _, args) => {
          let i
          const l = nodes.length
          let node
          const blockElements = Tools.extend({}, schema.getBlockElements())
          const nonEmptyElements = schema.getNonEmptyElements()
          let parent, lastParent, prev, prevName
          const whiteSpaceElements = schema.getNonEmptyElements()
          let elementRule, textNode
          blockElements.body = 1
          for (i = 0; i < l; i++) {
            node = nodes[i]
            parent = node.parent
            if (blockElements[node.parent.name] && node === parent.lastChild) {
              prev = node.prev
              while (prev) {
                prevName = prev.name
                if (prevName !== 'span' || prev.attr('data-mce-type') !== 'bookmark') {
                  if (prevName !== 'br') {
                    break
                  }
                  if (prevName === 'br') {
                    node = null
                    break
                  }
                }
                prev = prev.prev
              }
              if (node) {
                node.remove()
                if (isEmpty$2(schema, nonEmptyElements, whiteSpaceElements, parent)) {
                  elementRule = schema.getElementRule(parent.name)
                  if (elementRule) {
                    if (elementRule.removeEmpty) {
                      parent.remove()
                    } else if (elementRule.paddEmpty) {
                      paddEmptyNode(settings, args, blockElements, parent)
                    }
                  }
                }
              }
            } else {
              lastParent = node
              while (parent && parent.firstChild === lastParent && parent.lastChild === lastParent) {
                lastParent = parent
                if (blockElements[parent.name]) {
                  break
                }
                parent = parent.parent
              }
              if (lastParent === parent && settings.padd_empty_with_br !== true) {
                textNode = new Node$2('#text', 3)
                textNode.value = '\xA0'
                node.replace(textNode)
              }
            }
          }
        })
      }
      parser.addAttributeFilter('href', (nodes) => {
        let i = nodes.length; let node
        const appendRel = function (rel) {
          const parts = rel.split(' ').filter((p) => p.length > 0)
          return parts.concat(['noopener']).sort().join(' ')
        }
        const addNoOpener = function (rel) {
          const newRel = rel ? Tools.trim(rel) : ''
          if (!/\b(noopener)\b/g.test(newRel)) {
            return appendRel(newRel)
          }
          return newRel
        }
        if (!settings.allow_unsafe_link_target) {
          while (i--) {
            node = nodes[i]
            if (node.name === 'a' && node.attr('target') === '_blank') {
              node.attr('rel', addNoOpener(node.attr('rel')))
            }
          }
        }
      })
      if (!settings.allow_html_in_named_anchor) {
        parser.addAttributeFilter('id,name', (nodes) => {
          let i = nodes.length; let sibling; let prevSibling; let parent; let node
          while (i--) {
            node = nodes[i]
            if (node.name === 'a' && node.firstChild && !node.attr('href')) {
              parent = node.parent
              sibling = node.lastChild
              do {
                prevSibling = sibling.prev
                parent.insert(sibling, node)
                sibling = prevSibling
              } while (sibling)
            }
          }
        })
      }
      if (settings.fix_list_elements) {
        parser.addNodeFilter('ul,ol', (nodes) => {
          let i = nodes.length; let node; let parentNode
          while (i--) {
            node = nodes[i]
            parentNode = node.parent
            if (parentNode.name === 'ul' || parentNode.name === 'ol') {
              if (node.prev && node.prev.name === 'li') {
                node.prev.append(node)
              } else {
                const li = new Node$2('li', 1)
                li.attr('style', 'list-style-type: none')
                node.wrap(li)
              }
            }
          }
        })
      }
      if (settings.validate && schema.getValidClasses()) {
        parser.addAttributeFilter('class', (nodes) => {
          let i = nodes.length; let node; let classList; let ci; let className; let classValue
          const validClasses = schema.getValidClasses()
          let validClassesMap, valid
          while (i--) {
            node = nodes[i]
            classList = node.attr('class').split(' ')
            classValue = ''
            for (ci = 0; ci < classList.length; ci++) {
              className = classList[ci]
              valid = false
              validClassesMap = validClasses['*']
              if (validClassesMap && validClassesMap[className]) {
                valid = true
              }
              validClassesMap = validClasses[node.name]
              if (!valid && validClassesMap && validClassesMap[className]) {
                valid = true
              }
              if (valid) {
                if (classValue) {
                  classValue += ' '
                }
                classValue += className
              }
            }
            if (!classValue.length) {
              classValue = null
            }
            node.attr('class', classValue)
          }
        })
      }
    }

    const makeMap$4 = Tools.makeMap; const each$g = Tools.each; const explode$2 = Tools.explode; const extend$2 = Tools.extend
    function DomParser(settings, schema) {
      if (schema === void 0) {
        schema = Schema()
      }
      const nodeFilters = {}
      const attributeFilters = []
      let matchedNodes = {}
      let matchedAttributes = {}
      settings = settings || {}
      settings.validate = 'validate' in settings ? settings.validate : true
      settings.root_name = settings.root_name || 'body'
      const fixInvalidChildren = function (nodes) {
        let ni, node, parent, parents, newParent, currentNode, tempNode, childNode, i
        let nonEmptyElements, whitespaceElements, nonSplitableElements, textBlockElements, specialElements, sibling, nextNode
        nonSplitableElements = makeMap$4('tr,td,th,tbody,thead,tfoot,table')
        nonEmptyElements = schema.getNonEmptyElements()
        whitespaceElements = schema.getWhiteSpaceElements()
        textBlockElements = schema.getTextBlockElements()
        specialElements = schema.getSpecialElements()
        for (ni = 0; ni < nodes.length; ni++) {
          node = nodes[ni]
          if (!node.parent || node.fixed) {
            continue
          }
          if (textBlockElements[node.name] && node.parent.name === 'li') {
            sibling = node.next
            while (sibling) {
              if (textBlockElements[sibling.name]) {
                sibling.name = 'li'
                sibling.fixed = true
                node.parent.insert(sibling, node.parent)
              } else {
                break
              }
              sibling = sibling.next
            }
            node.unwrap(node)
            continue
          }
          parents = [node]
          for (parent = node.parent; parent && !schema.isValidChild(parent.name, node.name) && !nonSplitableElements[parent.name]; parent = parent.parent) {
            parents.push(parent)
          }
          if (parent && parents.length > 1) {
            parents.reverse()
            newParent = currentNode = filterNode(parents[0].clone())
            for (i = 0; i < parents.length - 1; i++) {
              if (schema.isValidChild(currentNode.name, parents[i].name)) {
                tempNode = filterNode(parents[i].clone())
                currentNode.append(tempNode)
              } else {
                tempNode = currentNode
              }
              for (childNode = parents[i].firstChild; childNode && childNode !== parents[i + 1];) {
                nextNode = childNode.next
                tempNode.append(childNode)
                childNode = nextNode
              }
              currentNode = tempNode
            }
            if (!isEmpty$2(schema, nonEmptyElements, whitespaceElements, newParent)) {
              parent.insert(newParent, parents[0], true)
              parent.insert(node, newParent)
            } else {
              parent.insert(node, parents[0], true)
            }
            parent = parents[0]
            if (isEmpty$2(schema, nonEmptyElements, whitespaceElements, parent) || hasOnlyChild(parent, 'br')) {
              parent.empty().remove()
            }
          } else if (node.parent) {
            if (node.name === 'li') {
              sibling = node.prev
              if (sibling && (sibling.name === 'ul' || sibling.name === 'ul')) {
                sibling.append(node)
                continue
              }
              sibling = node.next
              if (sibling && (sibling.name === 'ul' || sibling.name === 'ul')) {
                sibling.insert(node, sibling.firstChild, true)
                continue
              }
              node.wrap(filterNode(new Node$2('ul', 1)))
              continue
            }
            if (schema.isValidChild(node.parent.name, 'div') && schema.isValidChild('div', node.name)) {
              node.wrap(filterNode(new Node$2('div', 1)))
            } else if (specialElements[node.name]) {
              node.empty().remove()
            } else {
              node.unwrap()
            }
          }
        }
      }
      var filterNode = function (node) {
        let i, name, list
        name = node.name
        if (name in nodeFilters) {
          list = matchedNodes[name]
          if (list) {
            list.push(node)
          } else {
            matchedNodes[name] = [node]
          }
        }
        i = attributeFilters.length
        while (i--) {
          name = attributeFilters[i].name
          if (name in node.attributes.map) {
            list = matchedAttributes[name]
            if (list) {
              list.push(node)
            } else {
              matchedAttributes[name] = [node]
            }
          }
        }
        return node
      }
      const addNodeFilter = function (name, callback) {
        each$g(explode$2(name), (name) => {
          let list = nodeFilters[name]
          if (!list) {
            nodeFilters[name] = list = []
          }
          list.push(callback)
        })
      }
      const getNodeFilters = function () {
        const out = []
        for (const name in nodeFilters) {
          if (nodeFilters.hasOwnProperty(name)) {
            out.push({
              name,
              callbacks: nodeFilters[name],
            })
          }
        }
        return out
      }
      const addAttributeFilter = function (name, callback) {
        each$g(explode$2(name), (name) => {
          let i
          for (i = 0; i < attributeFilters.length; i++) {
            if (attributeFilters[i].name === name) {
              attributeFilters[i].callbacks.push(callback)
              return
            }
          }
          attributeFilters.push({
            name,
            callbacks: [callback],
          })
        })
      }
      const getAttributeFilters = function () {
        return [].concat(attributeFilters)
      }
      const parse = function (html, args) {
        let parser, nodes, i, l, fi, fl, list, name
        let blockElements
        const invalidChildren = []
        let isInWhiteSpacePreservedElement
        let node
        const getRootBlockName = function (name) {
          if (name === false) {
            return ''
          } if (name === true) {
            return 'p'
          }
          return name
        }
        args = args || {}
        matchedNodes = {}
        matchedAttributes = {}
        blockElements = extend$2(makeMap$4('script,style,head,html,body,title,meta,param'), schema.getBlockElements())
        const nonEmptyElements = schema.getNonEmptyElements()
        const { children } = schema
        const { validate } = settings
        const forcedRootBlockName = 'forced_root_block' in args ? args.forced_root_block : settings.forced_root_block
        const rootBlockName = getRootBlockName(forcedRootBlockName)
        const whiteSpaceElements = schema.getWhiteSpaceElements()
        const startWhiteSpaceRegExp = /^[ \t\r\n]+/
        const endWhiteSpaceRegExp = /[ \t\r\n]+$/
        const allWhiteSpaceRegExp = /[ \t\r\n]+/g
        const isAllWhiteSpaceRegExp = /^[ \t\r\n]+$/
        isInWhiteSpacePreservedElement = whiteSpaceElements.hasOwnProperty(args.context) || whiteSpaceElements.hasOwnProperty(settings.root_name)
        const addRootBlocks = function () {
          let node = rootNode.firstChild; let next; let rootBlockNode
          const trim = function (rootBlockNode) {
            if (rootBlockNode) {
              node = rootBlockNode.firstChild
              if (node && node.type === 3) {
                node.value = node.value.replace(startWhiteSpaceRegExp, '')
              }
              node = rootBlockNode.lastChild
              if (node && node.type === 3) {
                node.value = node.value.replace(endWhiteSpaceRegExp, '')
              }
            }
          }
          if (!schema.isValidChild(rootNode.name, rootBlockName.toLowerCase())) {
            return
          }
          while (node) {
            next = node.next
            if (node.type === 3 || node.type === 1 && node.name !== 'p' && !blockElements[node.name] && !node.attr('data-mce-type')) {
              if (!rootBlockNode) {
                rootBlockNode = createNode(rootBlockName, 1)
                rootBlockNode.attr(settings.forced_root_block_attrs)
                rootNode.insert(rootBlockNode, node)
                rootBlockNode.append(node)
              } else {
                rootBlockNode.append(node)
              }
            } else {
              trim(rootBlockNode)
              rootBlockNode = null
            }
            node = next
          }
          trim(rootBlockNode)
        }
        var createNode = function (name, type) {
          const node = new Node$2(name, type)
          let list
          if (name in nodeFilters) {
            list = matchedNodes[name]
            if (list) {
              list.push(node)
            } else {
              matchedNodes[name] = [node]
            }
          }
          return node
        }
        const removeWhitespaceBefore = function (node) {
          let textNode, textNodeNext, textVal, sibling
          const blockElements = schema.getBlockElements()
          for (textNode = node.prev; textNode && textNode.type === 3;) {
            textVal = textNode.value.replace(endWhiteSpaceRegExp, '')
            if (textVal.length > 0) {
              textNode.value = textVal
              return
            }
            textNodeNext = textNode.next
            if (textNodeNext) {
              if (textNodeNext.type === 3 && textNodeNext.value.length) {
                textNode = textNode.prev
                continue
              }
              if (!blockElements[textNodeNext.name] && textNodeNext.name !== 'script' && textNodeNext.name !== 'style') {
                textNode = textNode.prev
                continue
              }
            }
            sibling = textNode.prev
            textNode.remove()
            textNode = sibling
          }
        }
        const cloneAndExcludeBlocks = function (input) {
          let name
          const output = {}
          for (name in input) {
            if (name !== 'li' && name !== 'p') {
              output[name] = input[name]
            }
          }
          return output
        }
        parser = SaxParser$1({
          validate,
          allow_script_urls: settings.allow_script_urls,
          allow_conditional_comments: settings.allow_conditional_comments,
          self_closing_elements: cloneAndExcludeBlocks(schema.getSelfClosingElements()),
          cdata(text) {
            node.append(createNode('#cdata', 4)).value = text
          },
          text(text, raw) {
            let textNode
            if (!isInWhiteSpacePreservedElement) {
              text = text.replace(allWhiteSpaceRegExp, ' ')
              if (isLineBreakNode(node.lastChild, blockElements)) {
                text = text.replace(startWhiteSpaceRegExp, '')
              }
            }
            if (text.length !== 0) {
              textNode = createNode('#text', 3)
              textNode.raw = !!raw
              node.append(textNode).value = text
            }
          },
          comment(text) {
            node.append(createNode('#comment', 8)).value = text
          },
          pi(name, text) {
            node.append(createNode(name, 7)).value = text
            removeWhitespaceBefore(node)
          },
          doctype(text) {
            let newNode
            newNode = node.append(createNode('#doctype', 10))
            newNode.value = text
            removeWhitespaceBefore(node)
          },
          start(name, attrs, empty) {
            let newNode, attrFiltersLen, elementRule, attrName, parent
            elementRule = validate ? schema.getElementRule(name) : {}
            if (elementRule) {
              newNode = createNode(elementRule.outputName || name, 1)
              newNode.attributes = attrs
              newNode.shortEnded = empty
              node.append(newNode)
              parent = children[node.name]
              if (parent && children[newNode.name] && !parent[newNode.name]) {
                invalidChildren.push(newNode)
              }
              attrFiltersLen = attributeFilters.length
              while (attrFiltersLen--) {
                attrName = attributeFilters[attrFiltersLen].name
                if (attrName in attrs.map) {
                  list = matchedAttributes[attrName]
                  if (list) {
                    list.push(newNode)
                  } else {
                    matchedAttributes[attrName] = [newNode]
                  }
                }
              }
              if (blockElements[name]) {
                removeWhitespaceBefore(newNode)
              }
              if (!empty) {
                node = newNode
              }
              if (!isInWhiteSpacePreservedElement && whiteSpaceElements[name]) {
                isInWhiteSpacePreservedElement = true
              }
            }
          },
          end(name) {
            let textNode, elementRule, text, sibling, tempNode
            elementRule = validate ? schema.getElementRule(name) : {}
            if (elementRule) {
              if (blockElements[name]) {
                if (!isInWhiteSpacePreservedElement) {
                  textNode = node.firstChild
                  if (textNode && textNode.type === 3) {
                    text = textNode.value.replace(startWhiteSpaceRegExp, '')
                    if (text.length > 0) {
                      textNode.value = text
                      textNode = textNode.next
                    } else {
                      sibling = textNode.next
                      textNode.remove()
                      textNode = sibling
                      while (textNode && textNode.type === 3) {
                        text = textNode.value
                        sibling = textNode.next
                        if (text.length === 0 || isAllWhiteSpaceRegExp.test(text)) {
                          textNode.remove()
                          textNode = sibling
                        }
                        textNode = sibling
                      }
                    }
                  }
                  textNode = node.lastChild
                  if (textNode && textNode.type === 3) {
                    text = textNode.value.replace(endWhiteSpaceRegExp, '')
                    if (text.length > 0) {
                      textNode.value = text
                      textNode = textNode.prev
                    } else {
                      sibling = textNode.prev
                      textNode.remove()
                      textNode = sibling
                      while (textNode && textNode.type === 3) {
                        text = textNode.value
                        sibling = textNode.prev
                        if (text.length === 0 || isAllWhiteSpaceRegExp.test(text)) {
                          textNode.remove()
                          textNode = sibling
                        }
                        textNode = sibling
                      }
                    }
                  }
                }
              }
              if (isInWhiteSpacePreservedElement && whiteSpaceElements[name]) {
                isInWhiteSpacePreservedElement = false
              }
              if (elementRule.removeEmpty && isEmpty$2(schema, nonEmptyElements, whiteSpaceElements, node)) {
                if (!node.attributes.map.name && !node.attr('id')) {
                  tempNode = node.parent
                  if (blockElements[node.name]) {
                    node.empty().remove()
                  } else {
                    node.unwrap()
                  }
                  node = tempNode
                  return
                }
              }
              if (elementRule.paddEmpty && (isPaddedWithNbsp(node) || isEmpty$2(schema, nonEmptyElements, whiteSpaceElements, node))) {
                paddEmptyNode(settings, args, blockElements, node)
              }
              node = node.parent
            }
          },
        }, schema)
        var rootNode = node = new Node$2(args.context || settings.root_name, 11)
        parser.parse(html)
        if (validate && invalidChildren.length) {
          if (!args.context) {
            fixInvalidChildren(invalidChildren)
          } else {
            args.invalid = true
          }
        }
        if (rootBlockName && (rootNode.name === 'body' || args.isRootContent)) {
          addRootBlocks()
        }
        if (!args.invalid) {
          for (name in matchedNodes) {
            list = nodeFilters[name]
            nodes = matchedNodes[name]
            fi = nodes.length
            while (fi--) {
              if (!nodes[fi].parent) {
                nodes.splice(fi, 1)
              }
            }
            for (i = 0, l = list.length; i < l; i++) {
              list[i](nodes, name, args)
            }
          }
          for (i = 0, l = attributeFilters.length; i < l; i++) {
            list = attributeFilters[i]
            if (list.name in matchedAttributes) {
              nodes = matchedAttributes[list.name]
              fi = nodes.length
              while (fi--) {
                if (!nodes[fi].parent) {
                  nodes.splice(fi, 1)
                }
              }
              for (fi = 0, fl = list.callbacks.length; fi < fl; fi++) {
                list.callbacks[fi](nodes, list.name, args)
              }
            }
          }
        }
        return rootNode
      }
      const exports = {
        schema,
        addAttributeFilter,
        getAttributeFilters,
        addNodeFilter,
        getNodeFilters,
        filterNode,
        parse,
      }
      register$2(exports, settings)
      LegacyFilter.register(exports, settings)
      return exports
    }

    const addTempAttr = function (htmlParser, tempAttrs, name) {
      if (Tools.inArray(tempAttrs, name) === -1) {
        htmlParser.addAttributeFilter(name, (nodes, name) => {
          let i = nodes.length
          while (i--) {
            nodes[i].attr(name, null)
          }
        })
        tempAttrs.push(name)
      }
    }
    const postProcess$1 = function (editor, args, content) {
      if (!args.no_events && editor) {
        const outArgs = Events.firePostProcess(editor, merge(args, { content }))
        return outArgs.content
      }
      return content
    }
    const getHtmlFromNode = function (dom, node, args) {
      const html = Zwsp.trim(args.getInner ? node.innerHTML : dom.getOuterHTML(node))
      return args.selection || isWsPreserveElement(Element$$1.fromDom(node)) ? html : Tools.trim(html)
    }
    const parseHtml = function (htmlParser, html, args) {
      const parserArgs = args.selection ? merge({ forced_root_block: false }, args) : args
      const rootNode = htmlParser.parse(html, parserArgs)
      DomSerializerFilters.trimTrailingBr(rootNode)
      return rootNode
    }
    const serializeNode = function (settings, schema, node) {
      const htmlSerializer = Serializer(settings, schema)
      return htmlSerializer.serialize(node)
    }
    const toHtml = function (editor, settings, schema, rootNode, args) {
      const content = serializeNode(settings, schema, rootNode)
      return postProcess$1(editor, args, content)
    }
    function DomSerializer(settings, editor) {
      let dom, schema, htmlParser
      const tempAttrs = ['data-mce-selected']
      dom = editor && editor.dom ? editor.dom : DOMUtils$1.DOM
      schema = editor && editor.schema ? editor.schema : Schema(settings)
      settings.entity_encoding = settings.entity_encoding || 'named'
      settings.remove_trailing_brs = 'remove_trailing_brs' in settings ? settings.remove_trailing_brs : true
      htmlParser = DomParser(settings, schema)
      DomSerializerFilters.register(htmlParser, settings, dom)
      const serialize = function (node, parserArgs) {
        const args = merge({ format: 'html' }, parserArgs || {})
        const targetNode = DomSerializerPreProcess.process(editor, node, args)
        const html = getHtmlFromNode(dom, targetNode, args)
        const rootNode = parseHtml(htmlParser, html, args)
        return args.format === 'tree' ? rootNode : toHtml(editor, settings, schema, rootNode, args)
      }
      return {
        schema,
        addNodeFilter: htmlParser.addNodeFilter,
        addAttributeFilter: htmlParser.addAttributeFilter,
        serialize,
        addRules(rules) {
          schema.addValidElements(rules)
        },
        setRules(rules) {
          schema.setValidElements(rules)
        },
        addTempAttr: curry(addTempAttr, htmlParser, tempAttrs),
        getTempAttrs() {
          return tempAttrs
        },
      }
    }

    function Serializer$1(settings, editor) {
      const domSerializer = DomSerializer(settings, editor)
      return {
        schema: domSerializer.schema,
        addNodeFilter: domSerializer.addNodeFilter,
        addAttributeFilter: domSerializer.addAttributeFilter,
        serialize: domSerializer.serialize,
        addRules: domSerializer.addRules,
        setRules: domSerializer.setRules,
        addTempAttr: domSerializer.addTempAttr,
        getTempAttrs: domSerializer.getTempAttrs,
      }
    }

    function BookmarkManager(selection) {
      return {
        getBookmark: curry(Bookmarks.getBookmark, selection),
        moveToBookmark: curry(Bookmarks.moveToBookmark, selection),
      }
    }
    (function (BookmarkManager) {
      BookmarkManager.isBookmarkNode = Bookmarks.isBookmarkNode
    }(BookmarkManager || (BookmarkManager = {})))
    const BookmarkManager$1 = BookmarkManager

    const isContentEditableFalse$a = NodeType.isContentEditableFalse
    const isContentEditableTrue$6 = NodeType.isContentEditableTrue
    const getContentEditableRoot$1 = function (root, node) {
      while (node && node !== root) {
        if (isContentEditableTrue$6(node) || isContentEditableFalse$a(node)) {
          return node
        }
        node = node.parentNode
      }
      return null
    }
    const ControlSelection = function (selection, editor) {
      const { dom } = editor; const { each } = Tools
      let selectedElm, selectedElmGhost, resizeHelper, resizeHandles, selectedHandle
      let startX, startY, selectedElmX, selectedElmY, startW, startH, ratio, resizeStarted
      let width, height
      const editableDoc = editor.getDoc(); const rootDocument = document
      const { abs } = Math; const { round } = Math; const rootElement = editor.getBody()
      let startScrollWidth, startScrollHeight
      resizeHandles = {
        nw: [
          0,
          0,
          -1,
          -1,
        ],
        ne: [
          1,
          0,
          1,
          -1,
        ],
        se: [
          1,
          1,
          1,
          1,
        ],
        sw: [
          0,
          1,
          -1,
          1,
        ],
      }
      const isImage = function (elm) {
        return elm && (elm.nodeName === 'IMG' || editor.dom.is(elm, 'figure.image'))
      }
      const isEventOnImageOutsideRange = function (evt, range) {
        return isImage(evt.target) && !RangePoint.isXYWithinRange(evt.clientX, evt.clientY, range)
      }
      const contextMenuSelectImage = function (evt) {
        const { target } = evt
        if (isEventOnImageOutsideRange(evt, editor.selection.getRng()) && !evt.isDefaultPrevented()) {
          evt.preventDefault()
          editor.selection.select(target)
        }
      }
      const getResizeTarget = function (elm) {
        return editor.dom.is(elm, 'figure.image') ? elm.querySelector('img') : elm
      }
      const isResizable = function (elm) {
        let selector = editor.settings.object_resizing
        if (selector === false || Env.iOS) {
          return false
        }
        if (typeof selector !== 'string') {
          selector = 'table,img,figure.image,div'
        }
        if (elm.getAttribute('data-mce-resize') === 'false') {
          return false
        }
        if (elm === editor.getBody()) {
          return false
        }
        return is$1(Element$$1.fromDom(elm), selector)
      }
      const resizeGhostElement = function (e) {
        let deltaX, deltaY, proportional
        let resizeHelperX, resizeHelperY
        deltaX = e.screenX - startX
        deltaY = e.screenY - startY
        width = deltaX * selectedHandle[2] + startW
        height = deltaY * selectedHandle[3] + startH
        width = width < 5 ? 5 : width
        height = height < 5 ? 5 : height
        if (isImage(selectedElm) && editor.settings.resize_img_proportional !== false) {
          proportional = !VK.modifierPressed(e)
        } else {
          proportional = VK.modifierPressed(e) || isImage(selectedElm) && selectedHandle[2] * selectedHandle[3] !== 0
        }
        if (proportional) {
          if (abs(deltaX) > abs(deltaY)) {
            height = round(width * ratio)
            width = round(height / ratio)
          } else {
            width = round(height / ratio)
            height = round(width * ratio)
          }
        }
        dom.setStyles(getResizeTarget(selectedElmGhost), {
          width,
          height,
        })
        resizeHelperX = selectedHandle.startPos.x + deltaX
        resizeHelperY = selectedHandle.startPos.y + deltaY
        resizeHelperX = resizeHelperX > 0 ? resizeHelperX : 0
        resizeHelperY = resizeHelperY > 0 ? resizeHelperY : 0
        dom.setStyles(resizeHelper, {
          left: resizeHelperX,
          top: resizeHelperY,
          display: 'block',
        })
        resizeHelper.innerHTML = `${width} &times; ${height}`
        if (selectedHandle[2] < 0 && selectedElmGhost.clientWidth <= width) {
          dom.setStyle(selectedElmGhost, 'left', selectedElmX + (startW - width))
        }
        if (selectedHandle[3] < 0 && selectedElmGhost.clientHeight <= height) {
          dom.setStyle(selectedElmGhost, 'top', selectedElmY + (startH - height))
        }
        deltaX = rootElement.scrollWidth - startScrollWidth
        deltaY = rootElement.scrollHeight - startScrollHeight
        if (deltaX + deltaY !== 0) {
          dom.setStyles(resizeHelper, {
            left: resizeHelperX - deltaX,
            top: resizeHelperY - deltaY,
          })
        }
        if (!resizeStarted) {
          Events.fireObjectResizeStart(editor, selectedElm, startW, startH)
          resizeStarted = true
        }
      }
      var endGhostResize = function () {
        resizeStarted = false
        const setSizeProp = function (name$$1, value) {
          if (value) {
            if (selectedElm.style[name$$1] || !editor.schema.isValid(selectedElm.nodeName.toLowerCase(), name$$1)) {
              dom.setStyle(getResizeTarget(selectedElm), name$$1, value)
            } else {
              dom.setAttrib(getResizeTarget(selectedElm), name$$1, value)
            }
          }
        }
        setSizeProp('width', width)
        setSizeProp('height', height)
        dom.unbind(editableDoc, 'mousemove', resizeGhostElement)
        dom.unbind(editableDoc, 'mouseup', endGhostResize)
        if (rootDocument !== editableDoc) {
          dom.unbind(rootDocument, 'mousemove', resizeGhostElement)
          dom.unbind(rootDocument, 'mouseup', endGhostResize)
        }
        dom.remove(selectedElmGhost)
        dom.remove(resizeHelper)
        showResizeRect(selectedElm)
        Events.fireObjectResized(editor, selectedElm, width, height)
        dom.setAttrib(selectedElm, 'style', dom.getAttrib(selectedElm, 'style'))
        editor.nodeChanged()
      }
      var showResizeRect = function (targetElm) {
        let position, targetWidth, targetHeight, e, rect
        hideResizeRect()
        unbindResizeHandleEvents()
        position = dom.getPos(targetElm, rootElement)
        selectedElmX = position.x
        selectedElmY = position.y
        rect = targetElm.getBoundingClientRect()
        targetWidth = rect.width || rect.right - rect.left
        targetHeight = rect.height || rect.bottom - rect.top
        if (selectedElm !== targetElm) {
          selectedElm = targetElm
          width = height = 0
        }
        e = editor.fire('ObjectSelected', { target: targetElm })
        if (isResizable(targetElm) && !e.isDefaultPrevented()) {
          each(resizeHandles, (handle, name$$1) => {
            let handleElm
            const startDrag = function (e) {
              startX = e.screenX
              startY = e.screenY
              startW = getResizeTarget(selectedElm).clientWidth
              startH = getResizeTarget(selectedElm).clientHeight
              ratio = startH / startW
              selectedHandle = handle
              handle.startPos = {
                x: targetWidth * handle[0] + selectedElmX,
                y: targetHeight * handle[1] + selectedElmY,
              }
              startScrollWidth = rootElement.scrollWidth
              startScrollHeight = rootElement.scrollHeight
              selectedElmGhost = selectedElm.cloneNode(true)
              dom.addClass(selectedElmGhost, 'mce-clonedresizable')
              dom.setAttrib(selectedElmGhost, 'data-mce-bogus', 'all')
              selectedElmGhost.contentEditable = false
              selectedElmGhost.unSelectabe = true
              dom.setStyles(selectedElmGhost, {
                left: selectedElmX,
                top: selectedElmY,
                margin: 0,
              })
              selectedElmGhost.removeAttribute('data-mce-selected')
              rootElement.appendChild(selectedElmGhost)
              dom.bind(editableDoc, 'mousemove', resizeGhostElement)
              dom.bind(editableDoc, 'mouseup', endGhostResize)
              if (rootDocument !== editableDoc) {
                dom.bind(rootDocument, 'mousemove', resizeGhostElement)
                dom.bind(rootDocument, 'mouseup', endGhostResize)
              }
              resizeHelper = dom.add(rootElement, 'div', {
                class: 'mce-resize-helper',
                'data-mce-bogus': 'all',
              }, `${startW} &times; ${startH}`)
            }
            handleElm = dom.get(`mceResizeHandle${name$$1}`)
            if (handleElm) {
              dom.remove(handleElm)
            }
            handleElm = dom.add(rootElement, 'div', {
              id: `mceResizeHandle${name$$1}`,
              'data-mce-bogus': 'all',
              class: 'mce-resizehandle',
              unselectable: true,
              style: `cursor:${name$$1}-resize; margin:0; padding:0`,
            })
            if (Env.ie === 11) {
              handleElm.contentEditable = false
            }
            dom.bind(handleElm, 'mousedown', (e) => {
              e.stopImmediatePropagation()
              e.preventDefault()
              startDrag(e)
            })
            handle.elm = handleElm
            dom.setStyles(handleElm, {
              left: targetWidth * handle[0] + selectedElmX - handleElm.offsetWidth / 2,
              top: targetHeight * handle[1] + selectedElmY - handleElm.offsetHeight / 2,
            })
          })
        } else {
          hideResizeRect()
        }
        selectedElm.setAttribute('data-mce-selected', '1')
      }
      var hideResizeRect = function () {
        let name$$1, handleElm
        unbindResizeHandleEvents()
        if (selectedElm) {
          selectedElm.removeAttribute('data-mce-selected')
        }
        for (name$$1 in resizeHandles) {
          handleElm = dom.get(`mceResizeHandle${name$$1}`)
          if (handleElm) {
            dom.unbind(handleElm)
            dom.remove(handleElm)
          }
        }
      }
      const updateResizeRect = function (e) {
        let startElm, controlElm
        const isChildOrEqual = function (node, parent$$1) {
          if (node) {
            do {
              if (node === parent$$1) {
                return true
              }
            } while (node = node.parentNode)
          }
        }
        if (resizeStarted || editor.removed) {
          return
        }
        each(dom.select('img[data-mce-selected],hr[data-mce-selected]'), (img) => {
          img.removeAttribute('data-mce-selected')
        })
        controlElm = e.type === 'mousedown' ? e.target : selection.getNode()
        controlElm = dom.$(controlElm).closest('table,img,figure.image,hr')[0]
        if (isChildOrEqual(controlElm, rootElement)) {
          disableGeckoResize()
          startElm = selection.getStart(true)
          if (isChildOrEqual(startElm, controlElm) && isChildOrEqual(selection.getEnd(true), controlElm)) {
            showResizeRect(controlElm)
            return
          }
        }
        hideResizeRect()
      }
      const isWithinContentEditableFalse = function (elm) {
        return isContentEditableFalse$a(getContentEditableRoot$1(editor.getBody(), elm))
      }
      var unbindResizeHandleEvents = function () {
        for (const name$$1 in resizeHandles) {
          const handle = resizeHandles[name$$1]
          if (handle.elm) {
            dom.unbind(handle.elm)
            delete handle.elm
          }
        }
      }
      var disableGeckoResize = function () {
        try {
          editor.getDoc().execCommand('enableObjectResizing', false, false)
        } catch (ex) {
        }
      }
      editor.on('init', () => {
        disableGeckoResize()
        if (Env.ie && Env.ie >= 11) {
          editor.on('mousedown click', (e) => {
            const { target } = e; const { nodeName } = target
            if (!resizeStarted && /^(TABLE|IMG|HR)$/.test(nodeName) && !isWithinContentEditableFalse(target)) {
              if (e.button !== 2) {
                editor.selection.select(target, nodeName === 'TABLE')
              }
              if (e.type === 'mousedown') {
                editor.nodeChanged()
              }
            }
          })
          editor.dom.bind(rootElement, 'mscontrolselect', (e) => {
            const delayedSelect = function (node) {
              Delay.setEditorTimeout(editor, () => {
                editor.selection.select(node)
              })
            }
            if (isWithinContentEditableFalse(e.target)) {
              e.preventDefault()
              delayedSelect(e.target)
              return
            }
            if (/^(TABLE|IMG|HR)$/.test(e.target.nodeName)) {
              e.preventDefault()
              if (e.target.tagName === 'IMG') {
                delayedSelect(e.target)
              }
            }
          })
        }
        const throttledUpdateResizeRect = Delay.throttle((e) => {
          if (!editor.composing) {
            updateResizeRect(e)
          }
        })
        editor.on('nodechange ResizeEditor ResizeWindow drop FullscreenStateChanged', throttledUpdateResizeRect)
        editor.on('keyup compositionend', (e) => {
          if (selectedElm && selectedElm.nodeName === 'TABLE') {
            throttledUpdateResizeRect(e)
          }
        })
        editor.on('hide blur', hideResizeRect)
        editor.on('contextmenu', contextMenuSelectImage)
      })
      editor.on('remove', unbindResizeHandleEvents)
      const destroy = function () {
        selectedElm = selectedElmGhost = null
      }
      return {
        isResizable,
        showResizeRect,
        hideResizeRect,
        updateResizeRect,
        destroy,
      }
    }

    const getPos$1 = function (elm) {
      let x = 0; let y = 0
      let offsetParent = elm
      while (offsetParent && offsetParent.nodeType) {
        x += offsetParent.offsetLeft || 0
        y += offsetParent.offsetTop || 0
        offsetParent = offsetParent.offsetParent
      }
      return {
        x,
        y,
      }
    }
    const fireScrollIntoViewEvent = function (editor, elm, alignToTop) {
      const scrollEvent = {
        elm,
        alignToTop,
      }
      editor.fire('scrollIntoView', scrollEvent)
      return scrollEvent.isDefaultPrevented()
    }
    const scrollElementIntoView = function (editor, elm, alignToTop) {
      let y, viewPort
      const { dom } = editor
      const root = dom.getRoot()
      let viewPortY; let viewPortH; let offsetY = 0
      if (fireScrollIntoViewEvent(editor, elm, alignToTop)) {
        return
      }
      if (!NodeType.isElement(elm)) {
        return
      }
      if (alignToTop === false) {
        offsetY = elm.offsetHeight
      }
      if (root.nodeName !== 'BODY') {
        const scrollContainer = editor.selection.getScrollContainer()
        if (scrollContainer) {
          y = getPos$1(elm).y - getPos$1(scrollContainer).y + offsetY
          viewPortH = scrollContainer.clientHeight
          viewPortY = scrollContainer.scrollTop
          if (y < viewPortY || y + 25 > viewPortY + viewPortH) {
            scrollContainer.scrollTop = y < viewPortY ? y : y - viewPortH + 25
          }
          return
        }
      }
      viewPort = dom.getViewPort(editor.getWin())
      y = dom.getPos(elm).y + offsetY
      viewPortY = viewPort.y
      viewPortH = viewPort.h
      if (y < viewPort.y || y + 25 > viewPortY + viewPortH) {
        editor.getWin().scrollTo(0, y < viewPortY ? y : y - viewPortH + 25)
      }
    }
    const getViewPortRect = function (editor) {
      if (editor.inline) {
        return editor.getBody().getBoundingClientRect()
      }
      const win = editor.getWin()
      return {
        left: 0,
        right: win.innerWidth,
        top: 0,
        bottom: win.innerHeight,
        width: win.innerWidth,
        height: win.innerHeight,
      }
    }
    const scrollBy = function (editor, dx, dy) {
      if (editor.inline) {
        editor.getBody().scrollLeft += dx
        editor.getBody().scrollTop += dy
      } else {
        editor.getWin().scrollBy(dx, dy)
      }
    }
    const scrollRangeIntoView = function (editor, rng) {
      head(CaretPosition.fromRangeStart(rng).getClientRects()).each((rngRect) => {
        const bodyRect = getViewPortRect(editor)
        const overflow = getOverflow(bodyRect, rngRect)
        const margin = 4
        const dx = overflow.x > 0 ? overflow.x + margin : overflow.x - margin
        const dy = overflow.y > 0 ? overflow.y + margin : overflow.y - margin
        scrollBy(editor, overflow.x !== 0 ? dx : 0, overflow.y !== 0 ? dy : 0)
      })
    }
    const ScrollIntoView = {
      scrollElementIntoView,
      scrollRangeIntoView,
    }

    const hasCeProperty = function (node) {
      return NodeType.isContentEditableTrue(node) || NodeType.isContentEditableFalse(node)
    }
    const findParent = function (node, rootNode, predicate) {
      while (node && node !== rootNode) {
        if (predicate(node)) {
          return node
        }
        node = node.parentNode
      }
      return null
    }
    const findClosestIeRange = function (clientX, clientY, doc) {
      let element, rng, rects
      element = doc.elementFromPoint(clientX, clientY)
      rng = doc.body.createTextRange()
      if (!element || element.tagName === 'HTML') {
        element = doc.body
      }
      rng.moveToElementText(element)
      rects = Tools.toArray(rng.getClientRects())
      rects = rects.sort((a, b) => {
        a = Math.abs(Math.max(a.top - clientY, a.bottom - clientY))
        b = Math.abs(Math.max(b.top - clientY, b.bottom - clientY))
        return a - b
      })
      if (rects.length > 0) {
        clientY = (rects[0].bottom + rects[0].top) / 2
        try {
          rng.moveToPoint(clientX, clientY)
          rng.collapse(true)
          return rng
        } catch (ex) {
        }
      }
      return null
    }
    const moveOutOfContentEditableFalse = function (rng, rootNode) {
      const parentElement = rng && rng.parentElement ? rng.parentElement() : null
      return NodeType.isContentEditableFalse(findParent(parentElement, rootNode, hasCeProperty)) ? null : rng
    }
    const fromPoint$1 = function (clientX, clientY, doc) {
      let rng, point
      const pointDoc = doc
      if (pointDoc.caretPositionFromPoint) {
        point = pointDoc.caretPositionFromPoint(clientX, clientY)
        if (point) {
          rng = doc.createRange()
          rng.setStart(point.offsetNode, point.offset)
          rng.collapse(true)
        }
      } else if (doc.caretRangeFromPoint) {
        rng = doc.caretRangeFromPoint(clientX, clientY)
      } else if (pointDoc.body.createTextRange) {
        rng = pointDoc.body.createTextRange()
        try {
          rng.moveToPoint(clientX, clientY)
          rng.collapse(true)
        } catch (ex) {
          rng = findClosestIeRange(clientX, clientY, doc)
        }
        return moveOutOfContentEditableFalse(rng, doc.body)
      }
      return rng
    }
    const CaretRangeFromPoint = { fromPoint: fromPoint$1 }

    const processRanges = function (editor, ranges) {
      return map(ranges, (range$$1) => {
        const evt = editor.fire('GetSelectionRange', { range: range$$1 })
        return evt.range !== range$$1 ? evt.range : range$$1
      })
    }
    const EventProcessRanges = { processRanges }

    const fromElements = function (elements, scope) {
      const doc = scope || document
      const fragment = doc.createDocumentFragment()
      each(elements, (element) => {
        fragment.appendChild(element.dom())
      })
      return Element$$1.fromDom(fragment)
    }

    const tableModel = Immutable('element', 'width', 'rows')
    const tableRow = Immutable('element', 'cells')
    const cellPosition = Immutable('x', 'y')
    const getSpan = function (td, key) {
      const value = parseInt(get$1(td, key), 10)
      return isNaN(value) ? 1 : value
    }
    const fillout = function (table, x, y, tr, td) {
      const rowspan = getSpan(td, 'rowspan')
      const colspan = getSpan(td, 'colspan')
      const rows = table.rows()
      for (let y2 = y; y2 < y + rowspan; y2++) {
        if (!rows[y2]) {
          rows[y2] = tableRow(deep(tr), [])
        }
        for (let x2 = x; x2 < x + colspan; x2++) {
          const cells = rows[y2].cells()
          cells[x2] = y2 === y && x2 === x ? td : shallow(td)
        }
      }
    }
    const cellExists = function (table, x, y) {
      const rows = table.rows()
      const cells = rows[y] ? rows[y].cells() : []
      return !!cells[x]
    }
    const skipCellsX = function (table, x, y) {
      while (cellExists(table, x, y)) {
        x++
      }
      return x
    }
    const getWidth = function (rows) {
      return foldl(rows, (acc, row) => row.cells().length > acc ? row.cells().length : acc, 0)
    }
    const findElementPos = function (table, element) {
      const rows = table.rows()
      for (let y = 0; y < rows.length; y++) {
        const cells = rows[y].cells()
        for (let x = 0; x < cells.length; x++) {
          if (eq(cells[x], element)) {
            return Option.some(cellPosition(x, y))
          }
        }
      }
      return Option.none()
    }
    const extractRows = function (table, sx, sy, ex, ey) {
      const newRows = []
      const rows = table.rows()
      for (let y = sy; y <= ey; y++) {
        const cells = rows[y].cells()
        const slice = sx < ex ? cells.slice(sx, ex + 1) : cells.slice(ex, sx + 1)
        newRows.push(tableRow(rows[y].element(), slice))
      }
      return newRows
    }
    const subTable = function (table, startPos, endPos) {
      const sx = startPos.x(); const sy = startPos.y()
      const ex = endPos.x(); const ey = endPos.y()
      const newRows = sy < ey ? extractRows(table, sx, sy, ex, ey) : extractRows(table, sx, ey, ex, sy)
      return tableModel(table.element(), getWidth(newRows), newRows)
    }
    const createDomTable = function (table, rows) {
      const tableElement = shallow(table.element())
      const tableBody = Element$$1.fromTag('tbody')
      append$1(tableBody, rows)
      append(tableElement, tableBody)
      return tableElement
    }
    const modelRowsToDomRows = function (table) {
      return map(table.rows(), (row) => {
        const cells = map(row.cells(), (cell) => {
          const td = deep(cell)
          remove(td, 'colspan')
          remove(td, 'rowspan')
          return td
        })
        const tr = shallow(row.element())
        append$1(tr, cells)
        return tr
      })
    }
    const fromDom$2 = function (tableElm) {
      const table = tableModel(shallow(tableElm), 0, [])
      each(descendants$1(tableElm, 'tr'), (tr, y) => {
        each(descendants$1(tr, 'td,th'), (td, x) => {
          fillout(table, skipCellsX(table, x, y), y, tr, td)
        })
      })
      return tableModel(table.element(), getWidth(table.rows()), table.rows())
    }
    const toDom = function (table) {
      return createDomTable(table, modelRowsToDomRows(table))
    }
    const subsection = function (table, startElement, endElement) {
      return findElementPos(table, startElement).bind((startPos) => findElementPos(table, endElement).map((endPos) => subTable(table, startPos, endPos)))
    }
    const SimpleTableModel = {
      fromDom: fromDom$2,
      toDom,
      subsection,
    }

    const getRanges = function (selection) {
      const ranges = []
      if (selection) {
        for (let i = 0; i < selection.rangeCount; i++) {
          ranges.push(selection.getRangeAt(i))
        }
      }
      return ranges
    }
    const getSelectedNodes = function (ranges) {
      return bind(ranges, (range$$1) => {
        const node = getSelectedNode(range$$1)
        return node ? [Element$$1.fromDom(node)] : []
      })
    }
    const hasMultipleRanges = function (selection) {
      return getRanges(selection).length > 1
    }
    const MultiRange = {
      getRanges,
      getSelectedNodes,
      hasMultipleRanges,
    }

    const getCellsFromRanges = function (ranges) {
      return filter(MultiRange.getSelectedNodes(ranges), isTableCell)
    }
    const getCellsFromElement = function (elm) {
      const selectedCells = descendants$1(elm, 'td[data-mce-selected],th[data-mce-selected]')
      return selectedCells
    }
    const getCellsFromElementOrRanges = function (ranges, element) {
      const selectedCells = getCellsFromElement(element)
      const rangeCells = getCellsFromRanges(ranges)
      return selectedCells.length > 0 ? selectedCells : rangeCells
    }
    const getCellsFromEditor = function (editor) {
      return getCellsFromElementOrRanges(MultiRange.getRanges(editor.selection.getSel()), Element$$1.fromDom(editor.getBody()))
    }
    const TableCellSelection = {
      getCellsFromRanges,
      getCellsFromElement,
      getCellsFromElementOrRanges,
      getCellsFromEditor,
    }

    const findParentListContainer = function (parents$$1) {
      return find(parents$$1, (elm) => name(elm) === 'ul' || name(elm) === 'ol')
    }
    const getFullySelectedListWrappers = function (parents$$1, rng) {
      return find(parents$$1, (elm) => name(elm) === 'li' && hasAllContentsSelected(elm, rng)).fold(constant([]), (li) => findParentListContainer(parents$$1).map((listCont) => [
        Element$$1.fromTag('li'),
        Element$$1.fromTag(name(listCont)),
      ]).getOr([]))
    }
    const wrap$3 = function (innerElm, elms) {
      const wrapped = foldl(elms, (acc, elm) => {
        append(elm, acc)
        return elm
      }, innerElm)
      return elms.length > 0 ? fromElements([wrapped]) : wrapped
    }
    const directListWrappers = function (commonAnchorContainer) {
      if (isListItem(commonAnchorContainer)) {
        return parent(commonAnchorContainer).filter(isList).fold(constant([]), (listElm) => [
          commonAnchorContainer,
          listElm,
        ])
      }
      return isList(commonAnchorContainer) ? [commonAnchorContainer] : []
    }
    const getWrapElements = function (rootNode, rng) {
      const commonAnchorContainer = Element$$1.fromDom(rng.commonAncestorContainer)
      const parents$$1 = Parents.parentsAndSelf(commonAnchorContainer, rootNode)
      const wrapElements = filter(parents$$1, (elm) => isInline(elm) || isHeading(elm))
      const listWrappers = getFullySelectedListWrappers(parents$$1, rng)
      const allWrappers = wrapElements.concat(listWrappers.length ? listWrappers : directListWrappers(commonAnchorContainer))
      return map(allWrappers, shallow)
    }
    const emptyFragment = function () {
      return fromElements([])
    }
    const getFragmentFromRange = function (rootNode, rng) {
      return wrap$3(Element$$1.fromDom(rng.cloneContents()), getWrapElements(rootNode, rng))
    }
    const getParentTable = function (rootElm, cell) {
      return ancestor$1(cell, 'table', curry(eq, rootElm))
    }
    const getTableFragment = function (rootNode, selectedTableCells) {
      return getParentTable(rootNode, selectedTableCells[0]).bind((tableElm) => {
        const firstCell = selectedTableCells[0]
        const lastCell = selectedTableCells[selectedTableCells.length - 1]
        const fullTableModel = SimpleTableModel.fromDom(tableElm)
        return SimpleTableModel.subsection(fullTableModel, firstCell, lastCell).map((sectionedTableModel) => fromElements([SimpleTableModel.toDom(sectionedTableModel)]))
      }).getOrThunk(emptyFragment)
    }
    const getSelectionFragment = function (rootNode, ranges) {
      return ranges.length > 0 && ranges[0].collapsed ? emptyFragment() : getFragmentFromRange(rootNode, ranges[0])
    }
    const read$2 = function (rootNode, ranges) {
      const selectedCells = TableCellSelection.getCellsFromElementOrRanges(ranges, rootNode)
      return selectedCells.length > 0 ? getTableFragment(rootNode, selectedCells) : getSelectionFragment(rootNode, ranges)
    }
    const FragmentReader = { read: read$2 }

    const getTextContent = function (editor) {
      return Option.from(editor.selection.getRng()).map((r) => Zwsp.trim(r.toString())).getOr('')
    }
    const getHtmlContent = function (editor, args) {
      const rng = editor.selection.getRng(); const tmpElm = editor.dom.create('body')
      const sel = editor.selection.getSel()
      let fragment
      const ranges = EventProcessRanges.processRanges(editor, MultiRange.getRanges(sel))
      if (rng.cloneContents) {
        fragment = args.contextual ? FragmentReader.read(Element$$1.fromDom(editor.getBody()), ranges).dom() : rng.cloneContents()
        if (fragment) {
          tmpElm.appendChild(fragment)
        }
      } else {
        tmpElm.innerHTML = rng.toString()
      }
      return editor.selection.serializer.serialize(tmpElm, args)
    }
    const getContent$1 = function (editor, args) {
      if (args === void 0) {
        args = {}
      }
      args.get = true
      args.format = args.format || 'html'
      args.selection = true
      args = editor.fire('BeforeGetContent', args)
      if (args.isDefaultPrevented()) {
        editor.fire('GetContent', args)
        return args.content
      }
      if (args.format === 'text') {
        return getTextContent(editor)
      }
      args.getInner = true
      const content = getHtmlContent(editor, args)
      if (args.format === 'tree') {
        return content
      }
      args.content = editor.selection.isCollapsed() ? '' : content
      editor.fire('GetContent', args)
      return args.content
    }
    const GetSelectionContent = { getContent: getContent$1 }

    const findParent$1 = function (node, rootNode, predicate) {
      while (node && node !== rootNode) {
        if (predicate(node)) {
          return node
        }
        node = node.parentNode
      }
      return null
    }
    const hasParent = function (node, rootNode, predicate) {
      return findParent$1(node, rootNode, predicate) !== null
    }
    const hasParentWithName = function (node, rootNode, name) {
      return hasParent(node, rootNode, (node) => node.nodeName === name)
    }
    const isTable$3 = function (node) {
      return node && node.nodeName === 'TABLE'
    }
    const isTableCell$3 = function (node) {
      return node && /^(TD|TH|CAPTION)$/.test(node.nodeName)
    }
    const isCeFalseCaretContainer = function (node, rootNode) {
      return isCaretContainer(node) && hasParent(node, rootNode, isCaretNode) === false
    }
    const hasBrBeforeAfter = function (dom, node, left) {
      const walker = new TreeWalker(node, dom.getParent(node.parentNode, dom.isBlock) || dom.getRoot())
      while (node = walker[left ? 'prev' : 'next']()) {
        if (NodeType.isBr(node)) {
          return true
        }
      }
    }
    const isPrevNode = function (node, name) {
      return node.previousSibling && node.previousSibling.nodeName === name
    }
    const hasContentEditableFalseParent = function (body, node) {
      while (node && node !== body) {
        if (NodeType.isContentEditableFalse(node)) {
          return true
        }
        node = node.parentNode
      }
      return false
    }
    const findTextNodeRelative = function (dom, isAfterNode, collapsed, left, startNode) {
      let walker, lastInlineElement, parentBlockContainer
      const body = dom.getRoot()
      let node
      const nonEmptyElementsMap = dom.schema.getNonEmptyElements()
      parentBlockContainer = dom.getParent(startNode.parentNode, dom.isBlock) || body
      if (left && NodeType.isBr(startNode) && isAfterNode && dom.isEmpty(parentBlockContainer)) {
        return Option.some(CaretPosition(startNode.parentNode, dom.nodeIndex(startNode)))
      }
      walker = new TreeWalker(startNode, parentBlockContainer)
      while (node = walker[left ? 'prev' : 'next']()) {
        if (dom.getContentEditableParent(node) === 'false' || isCeFalseCaretContainer(node, body)) {
          return Option.none()
        }
        if (NodeType.isText(node) && node.nodeValue.length > 0) {
          if (hasParentWithName(node, body, 'A') === false) {
            return Option.some(CaretPosition(node, left ? node.nodeValue.length : 0))
          }
          return Option.none()
        }
        if (dom.isBlock(node) || nonEmptyElementsMap[node.nodeName.toLowerCase()]) {
          return Option.none()
        }
        lastInlineElement = node
      }
      if (collapsed && lastInlineElement) {
        return Option.some(CaretPosition(lastInlineElement, 0))
      }
      return Option.none()
    }
    const normalizeEndPoint = function (dom, collapsed, start, rng) {
      let container, offset, walker
      const body = dom.getRoot()
      let node, nonEmptyElementsMap
      let directionLeft; let isAfterNode; let normalized = false
      container = rng[`${start ? 'start' : 'end'}Container`]
      offset = rng[`${start ? 'start' : 'end'}Offset`]
      isAfterNode = NodeType.isElement(container) && offset === container.childNodes.length
      nonEmptyElementsMap = dom.schema.getNonEmptyElements()
      directionLeft = start
      if (isCaretContainer(container)) {
        return Option.none()
      }
      if (NodeType.isElement(container) && offset > container.childNodes.length - 1) {
        directionLeft = false
      }
      if (NodeType.isDocument(container)) {
        container = body
        offset = 0
      }
      if (container === body) {
        if (directionLeft) {
          node = container.childNodes[offset > 0 ? offset - 1 : 0]
          if (node) {
            if (isCaretContainer(node)) {
              return Option.none()
            }
            if (nonEmptyElementsMap[node.nodeName] || isTable$3(node)) {
              return Option.none()
            }
          }
        }
        if (container.hasChildNodes()) {
          offset = Math.min(!directionLeft && offset > 0 ? offset - 1 : offset, container.childNodes.length - 1)
          container = container.childNodes[offset]
          offset = NodeType.isText(container) && isAfterNode ? container.data.length : 0
          if (!collapsed && container === body.lastChild && isTable$3(container)) {
            return Option.none()
          }
          if (hasContentEditableFalseParent(body, container) || isCaretContainer(container)) {
            return Option.none()
          }
          if (container.hasChildNodes() && isTable$3(container) === false) {
            node = container
            walker = new TreeWalker(container, body)
            do {
              if (NodeType.isContentEditableFalse(node) || isCaretContainer(node)) {
                normalized = false
                break
              }
              if (NodeType.isText(node) && node.nodeValue.length > 0) {
                offset = directionLeft ? 0 : node.nodeValue.length
                container = node
                normalized = true
                break
              }
              if (nonEmptyElementsMap[node.nodeName.toLowerCase()] && !isTableCell$3(node)) {
                offset = dom.nodeIndex(node)
                container = node.parentNode
                if (!directionLeft) {
                  offset++
                }
                normalized = true
                break
              }
            } while (node = directionLeft ? walker.next() : walker.prev())
          }
        }
      }
      if (collapsed) {
        if (NodeType.isText(container) && offset === 0) {
          findTextNodeRelative(dom, isAfterNode, collapsed, true, container).each((pos) => {
            container = pos.container()
            offset = pos.offset()
            normalized = true
          })
        }
        if (NodeType.isElement(container)) {
          node = container.childNodes[offset]
          if (!node) {
            node = container.childNodes[offset - 1]
          }
          if (node && NodeType.isBr(node) && !isPrevNode(node, 'A') && !hasBrBeforeAfter(dom, node, false) && !hasBrBeforeAfter(dom, node, true)) {
            findTextNodeRelative(dom, isAfterNode, collapsed, true, node).each((pos) => {
              container = pos.container()
              offset = pos.offset()
              normalized = true
            })
          }
        }
      }
      if (directionLeft && !collapsed && NodeType.isText(container) && offset === container.nodeValue.length) {
        findTextNodeRelative(dom, isAfterNode, collapsed, false, container).each((pos) => {
          container = pos.container()
          offset = pos.offset()
          normalized = true
        })
      }
      return normalized ? Option.some(CaretPosition(container, offset)) : Option.none()
    }
    const normalize$2 = function (dom, rng) {
      const { collapsed } = rng; const normRng = rng.cloneRange()
      const startPos = CaretPosition.fromRangeStart(rng)
      normalizeEndPoint(dom, collapsed, true, normRng).each((pos) => {
        if (!collapsed || !CaretPosition.isAbove(startPos, pos)) {
          normRng.setStart(pos.container(), pos.offset())
        }
      })
      if (!collapsed) {
        normalizeEndPoint(dom, collapsed, false, normRng).each((pos) => {
          normRng.setEnd(pos.container(), pos.offset())
        })
      }
      if (collapsed) {
        normRng.collapse(true)
      }
      return RangeCompare.isEq(rng, normRng) ? Option.none() : Option.some(normRng)
    }
    const NormalizeRange = { normalize: normalize$2 }

    const prependData = function (target, data) {
      target.insertData(0, data)
    }
    const removeEmpty = function (text) {
      if (text.dom().length === 0) {
        remove$2(text)
        return Option.none()
      }
      return Option.some(text)
    }
    const rngSetContent = function (rng, fragment) {
      const firstChild$$1 = Option.from(fragment.firstChild).map(Element$$1.fromDom)
      const lastChild$$1 = Option.from(fragment.lastChild).map(Element$$1.fromDom)
      rng.deleteContents()
      rng.insertNode(fragment)
      const prevText = firstChild$$1.bind(prevSibling).filter(isText).bind(removeEmpty)
      const nextText = lastChild$$1.bind(nextSibling).filter(isText).bind(removeEmpty)
      liftN([
        prevText,
        firstChild$$1.filter(isText),
      ], (prev, start) => {
        prependData(start.dom(), prev.dom().data)
        remove$2(prev)
      })
      liftN([
        nextText,
        lastChild$$1.filter(isText),
      ], (next, end) => {
        const oldLength = end.dom().length
        end.dom().appendData(next.dom().data)
        rng.setEnd(end.dom(), oldLength)
        remove$2(next)
      })
      rng.collapse(false)
    }
    const setupArgs = function (args, content) {
      args = args || { format: 'html' }
      args.set = true
      args.selection = true
      args.content = content
      return args
    }
    const setContent$1 = function (editor, content, args) {
      args = setupArgs(args, content)
      if (!args.no_events) {
        args = editor.fire('BeforeSetContent', args)
        if (args.isDefaultPrevented()) {
          editor.fire('SetContent', args)
          return
        }
      }
      const rng = editor.selection.getRng()
      rngSetContent(rng, rng.createContextualFragment(args.content))
      editor.selection.setRng(rng)
      ScrollIntoView.scrollRangeIntoView(editor, rng)
      if (!args.no_events) {
        editor.fire('SetContent', args)
      }
    }
    const SetSelectionContent = { setContent: setContent$1 }

    const getEndpointElement = function (root, rng, start, real, resolve) {
      const container = start ? rng.startContainer : rng.endContainer
      const offset = start ? rng.startOffset : rng.endOffset
      return Option.from(container).map(Element$$1.fromDom).map((elm) => !real || !rng.collapsed ? child(elm, resolve(elm, offset)).getOr(elm) : elm).bind((elm) => isElement(elm) ? Option.some(elm) : parent(elm)).map((elm) => elm.dom()).getOr(root)
    }
    const getStart$2 = function (root, rng, real) {
      return getEndpointElement(root, rng, true, real, (elm, offset) => Math.min(childNodesCount(elm), offset))
    }
    const getEnd = function (root, rng, real) {
      return getEndpointElement(root, rng, false, real, (elm, offset) => offset > 0 ? offset - 1 : offset)
    }
    const skipEmptyTextNodes = function (node, forwards) {
      const orig = node
      while (node && NodeType.isText(node) && node.length === 0) {
        node = forwards ? node.nextSibling : node.previousSibling
      }
      return node || orig
    }
    const getNode$1 = function (root, rng) {
      let elm, startContainer, endContainer, startOffset, endOffset
      if (!rng) {
        return root
      }
      startContainer = rng.startContainer
      endContainer = rng.endContainer
      startOffset = rng.startOffset
      endOffset = rng.endOffset
      elm = rng.commonAncestorContainer
      if (!rng.collapsed) {
        if (startContainer === endContainer) {
          if (endOffset - startOffset < 2) {
            if (startContainer.hasChildNodes()) {
              elm = startContainer.childNodes[startOffset]
            }
          }
        }
        if (startContainer.nodeType === 3 && endContainer.nodeType === 3) {
          if (startContainer.length === startOffset) {
            startContainer = skipEmptyTextNodes(startContainer.nextSibling, true)
          } else {
            startContainer = startContainer.parentNode
          }
          if (endOffset === 0) {
            endContainer = skipEmptyTextNodes(endContainer.previousSibling, false)
          } else {
            endContainer = endContainer.parentNode
          }
          if (startContainer && startContainer === endContainer) {
            return startContainer
          }
        }
      }
      if (elm && elm.nodeType === 3) {
        return elm.parentNode
      }
      return elm
    }
    const getSelectedBlocks = function (dom, rng, startElm, endElm) {
      let node, root
      const selectedBlocks = []
      root = dom.getRoot()
      startElm = dom.getParent(startElm || getStart$2(root, rng, rng.collapsed), dom.isBlock)
      endElm = dom.getParent(endElm || getEnd(root, rng, rng.collapsed), dom.isBlock)
      if (startElm && startElm !== root) {
        selectedBlocks.push(startElm)
      }
      if (startElm && endElm && startElm !== endElm) {
        node = startElm
        const walker = new TreeWalker(startElm, root)
        while ((node = walker.next()) && node !== endElm) {
          if (dom.isBlock(node)) {
            selectedBlocks.push(node)
          }
        }
      }
      if (endElm && startElm !== endElm && endElm !== root) {
        selectedBlocks.push(endElm)
      }
      return selectedBlocks
    }
    const select$1 = function (dom, node, content) {
      return Option.from(node).map((node) => {
        const idx = dom.nodeIndex(node)
        const rng = dom.createRng()
        rng.setStart(node.parentNode, idx)
        rng.setEnd(node.parentNode, idx + 1)
        if (content) {
          moveEndPoint$1(dom, rng, node, true)
          moveEndPoint$1(dom, rng, node, false)
        }
        return rng
      })
    }

    const deleteFromCallbackMap = function (callbackMap, selector, callback) {
      if (callbackMap && callbackMap.hasOwnProperty(selector)) {
        const newCallbacks = filter(callbackMap[selector], (cb) => cb !== callback)
        if (newCallbacks.length === 0) {
          delete callbackMap[selector]
        } else {
          callbackMap[selector] = newCallbacks
        }
      }
    }
    function SelectorChanged(dom, editor) {
      let selectorChangedData, currentSelectors
      return {
        selectorChangedWithUnbind(selector, callback) {
          if (!selectorChangedData) {
            selectorChangedData = {}
            currentSelectors = {}
            editor.on('NodeChange', (e) => {
              const node = e.element; const parents = dom.getParents(node, null, dom.getRoot()); const matchedSelectors = {}
              Tools.each(selectorChangedData, (callbacks, selector) => {
                Tools.each(parents, (node) => {
                  if (dom.is(node, selector)) {
                    if (!currentSelectors[selector]) {
                      Tools.each(callbacks, (callback) => {
                        callback(true, {
                          node,
                          selector,
                          parents,
                        })
                      })
                      currentSelectors[selector] = callbacks
                    }
                    matchedSelectors[selector] = callbacks
                    return false
                  }
                })
              })
              Tools.each(currentSelectors, (callbacks, selector) => {
                if (!matchedSelectors[selector]) {
                  delete currentSelectors[selector]
                  Tools.each(callbacks, (callback) => {
                    callback(false, {
                      node,
                      selector,
                      parents,
                    })
                  })
                }
              })
            })
          }
          if (!selectorChangedData[selector]) {
            selectorChangedData[selector] = []
          }
          selectorChangedData[selector].push(callback)
          return {
            unbind() {
              deleteFromCallbackMap(selectorChangedData, selector, callback)
              deleteFromCallbackMap(currentSelectors, selector, callback)
            },
          }
        },
      }
    }

    const isNativeIeSelection = function (rng) {
      return !!rng.select
    }
    const isAttachedToDom = function (node) {
      return !!(node && node.ownerDocument) && contains$3(Element$$1.fromDom(node.ownerDocument), Element$$1.fromDom(node))
    }
    const isValidRange = function (rng) {
      if (!rng) {
        return false
      } if (isNativeIeSelection(rng)) {
        return true
      }
      return isAttachedToDom(rng.startContainer) && isAttachedToDom(rng.endContainer)
    }
    const Selection = function (dom, win, serializer, editor) {
      let bookmarkManager, controlSelection
      let selectedRange, explicitRange
      const { selectorChangedWithUnbind } = SelectorChanged(dom, editor)
      const setCursorLocation = function (node, offset) {
        const rng = dom.createRng()
        if (!node) {
          moveEndPoint$1(dom, rng, editor.getBody(), true)
          setRng(rng)
        } else {
          rng.setStart(node, offset)
          rng.setEnd(node, offset)
          setRng(rng)
          collapse(false)
        }
      }
      const getContent = function (args) {
        return GetSelectionContent.getContent(editor, args)
      }
      const setContent = function (content, args) {
        return SetSelectionContent.setContent(editor, content, args)
      }
      const getStart = function (real) {
        return getStart$2(editor.getBody(), getRng(), real)
      }
      const getEnd$$1 = function (real) {
        return getEnd(editor.getBody(), getRng(), real)
      }
      const getBookmark = function (type, normalized) {
        return bookmarkManager.getBookmark(type, normalized)
      }
      const moveToBookmark = function (bookmark) {
        return bookmarkManager.moveToBookmark(bookmark)
      }
      const select = function (node, content) {
        select$1(dom, node, content).each(setRng)
        return node
      }
      const isCollapsed = function () {
        const rng = getRng(); const sel = getSel()
        if (!rng || rng.item) {
          return false
        }
        if (rng.compareEndPoints) {
          return rng.compareEndPoints('StartToEnd', rng) === 0
        }
        return !sel || rng.collapsed
      }
      var collapse = function (toStart) {
        const rng = getRng()
        rng.collapse(!!toStart)
        setRng(rng)
      }
      var getSel = function () {
        return win.getSelection ? win.getSelection() : win.document.selection
      }
      var getRng = function () {
        let selection, rng, elm, doc
        const tryCompareBoundaryPoints = function (how, sourceRange, destinationRange) {
          try {
            return sourceRange.compareBoundaryPoints(how, destinationRange)
          } catch (ex) {
            return -1
          }
        }
        if (!win) {
          return null
        }
        doc = win.document
        if (typeof doc === 'undefined' || doc === null) {
          return null
        }
        if (editor.bookmark !== undefined && EditorFocus.hasFocus(editor) === false) {
          const bookmark = SelectionBookmark.getRng(editor)
          if (bookmark.isSome()) {
            return bookmark.map((r) => EventProcessRanges.processRanges(editor, [r])[0]).getOr(doc.createRange())
          }
        }
        try {
          if (selection = getSel()) {
            if (selection.rangeCount > 0) {
              rng = selection.getRangeAt(0)
            } else {
              rng = selection.createRange ? selection.createRange() : doc.createRange()
            }
          }
        } catch (ex) {
        }
        rng = EventProcessRanges.processRanges(editor, [rng])[0]
        if (!rng) {
          rng = doc.createRange ? doc.createRange() : doc.body.createTextRange()
        }
        if (rng.setStart && rng.startContainer.nodeType === 9 && rng.collapsed) {
          elm = dom.getRoot()
          rng.setStart(elm, 0)
          rng.setEnd(elm, 0)
        }
        if (selectedRange && explicitRange) {
          if (tryCompareBoundaryPoints(rng.START_TO_START, rng, selectedRange) === 0 && tryCompareBoundaryPoints(rng.END_TO_END, rng, selectedRange) === 0) {
            rng = explicitRange
          } else {
            selectedRange = null
            explicitRange = null
          }
        }
        return rng
      }
      var setRng = function (rng, forward) {
        let sel, node, evt
        if (!isValidRange(rng)) {
          return
        }
        const ieRange = isNativeIeSelection(rng) ? rng : null
        if (ieRange) {
          explicitRange = null
          try {
            ieRange.select()
          } catch (ex) {
          }
          return
        }
        sel = getSel()
        evt = editor.fire('SetSelectionRange', {
          range: rng,
          forward,
        })
        rng = evt.range
        if (sel) {
          explicitRange = rng
          try {
            sel.removeAllRanges()
            sel.addRange(rng)
          } catch (ex) {
          }
          if (forward === false && sel.extend) {
            sel.collapse(rng.endContainer, rng.endOffset)
            sel.extend(rng.startContainer, rng.startOffset)
          }
          selectedRange = sel.rangeCount > 0 ? sel.getRangeAt(0) : null
        }
        if (!rng.collapsed && rng.startContainer === rng.endContainer && sel.setBaseAndExtent && !Env.ie) {
          if (rng.endOffset - rng.startOffset < 2) {
            if (rng.startContainer.hasChildNodes()) {
              node = rng.startContainer.childNodes[rng.startOffset]
              if (node && node.tagName === 'IMG') {
                sel.setBaseAndExtent(rng.startContainer, rng.startOffset, rng.endContainer, rng.endOffset)
                if (sel.anchorNode !== rng.startContainer || sel.focusNode !== rng.endContainer) {
                  sel.setBaseAndExtent(node, 0, node, 1)
                }
              }
            }
          }
        }
        editor.fire('AfterSetSelectionRange', {
          range: rng,
          forward,
        })
      }
      const setNode = function (elm) {
        setContent(dom.getOuterHTML(elm))
        return elm
      }
      const getNode = function () {
        return getNode$1(editor.getBody(), getRng())
      }
      const getSelectedBlocks$$1 = function (startElm, endElm) {
        return getSelectedBlocks(dom, getRng(), startElm, endElm)
      }
      const isForward = function () {
        const sel = getSel()
        let anchorRange, focusRange
        if (!sel || !sel.anchorNode || !sel.focusNode) {
          return true
        }
        anchorRange = dom.createRng()
        anchorRange.setStart(sel.anchorNode, sel.anchorOffset)
        anchorRange.collapse(true)
        focusRange = dom.createRng()
        focusRange.setStart(sel.focusNode, sel.focusOffset)
        focusRange.collapse(true)
        return anchorRange.compareBoundaryPoints(anchorRange.START_TO_START, focusRange) <= 0
      }
      const normalize = function () {
        const rng = getRng()
        const sel = getSel()
        if (!MultiRange.hasMultipleRanges(sel) && hasAnyRanges(editor)) {
          const normRng = NormalizeRange.normalize(dom, rng)
          normRng.each((normRng) => {
            setRng(normRng, isForward())
          })
          return normRng.getOr(rng)
        }
        return rng
      }
      const selectorChanged = function (selector, callback) {
        selectorChangedWithUnbind(selector, callback)
        return exports
      }
      const getScrollContainer = function () {
        let scrollContainer
        let node = dom.getRoot()
        while (node && node.nodeName !== 'BODY') {
          if (node.scrollHeight > node.clientHeight) {
            scrollContainer = node
            break
          }
          node = node.parentNode
        }
        return scrollContainer
      }
      const scrollIntoView = function (elm, alignToTop) {
        return ScrollIntoView.scrollElementIntoView(editor, elm, alignToTop)
      }
      const placeCaretAt = function (clientX, clientY) {
        return setRng(CaretRangeFromPoint.fromPoint(clientX, clientY, editor.getDoc()))
      }
      const getBoundingClientRect = function () {
        const rng = getRng()
        return rng.collapsed ? CaretPosition$1.fromRangeStart(rng).getClientRects()[0] : rng.getBoundingClientRect()
      }
      const destroy = function () {
        win = selectedRange = explicitRange = null
        controlSelection.destroy()
      }
      var exports = {
        bookmarkManager: null,
        controlSelection: null,
        dom,
        win,
        serializer,
        editor,
        collapse,
        setCursorLocation,
        getContent,
        setContent,
        getBookmark,
        moveToBookmark,
        select,
        isCollapsed,
        isForward,
        setNode,
        getNode,
        getSel,
        setRng,
        getRng,
        getStart,
        getEnd: getEnd$$1,
        getSelectedBlocks: getSelectedBlocks$$1,
        normalize,
        selectorChanged,
        selectorChangedWithUnbind,
        getScrollContainer,
        scrollIntoView,
        placeCaretAt,
        getBoundingClientRect,
        destroy,
      }
      bookmarkManager = BookmarkManager$1(exports)
      controlSelection = ControlSelection(exports, editor)
      exports.bookmarkManager = bookmarkManager
      exports.controlSelection = controlSelection
      return exports
    }

    const isText$8 = NodeType.isText
    const startsWithCaretContainer$1 = function (node) {
      return isText$8(node) && node.data[0] === Zwsp.ZWSP
    }
    const endsWithCaretContainer$1 = function (node) {
      return isText$8(node) && node.data[node.data.length - 1] === Zwsp.ZWSP
    }
    const createZwsp = function (node) {
      return node.ownerDocument.createTextNode(Zwsp.ZWSP)
    }
    const insertBefore = function (node) {
      if (isText$8(node.previousSibling)) {
        if (endsWithCaretContainer$1(node.previousSibling)) {
          return node.previousSibling
        }
        node.previousSibling.appendData(Zwsp.ZWSP)
        return node.previousSibling
      } if (isText$8(node)) {
        if (startsWithCaretContainer$1(node)) {
          return node
        }
        node.insertData(0, Zwsp.ZWSP)
        return node
      }
      const newNode = createZwsp(node)
      node.parentNode.insertBefore(newNode, node)
      return newNode
    }
    const insertAfter = function (node) {
      if (isText$8(node.nextSibling)) {
        if (startsWithCaretContainer$1(node.nextSibling)) {
          return node.nextSibling
        }
        node.nextSibling.insertData(0, Zwsp.ZWSP)
        return node.nextSibling
      } if (isText$8(node)) {
        if (endsWithCaretContainer$1(node)) {
          return node
        }
        node.appendData(Zwsp.ZWSP)
        return node
      }
      const newNode = createZwsp(node)
      if (node.nextSibling) {
        node.parentNode.insertBefore(newNode, node.nextSibling)
      } else {
        node.parentNode.appendChild(newNode)
      }
      return newNode
    }
    const insertInline$1 = function (before, node) {
      return before ? insertBefore(node) : insertAfter(node)
    }
    const insertInlineBefore = curry(insertInline$1, true)
    const insertInlineAfter = curry(insertInline$1, false)

    const insertInlinePos = function (pos, before) {
      if (NodeType.isText(pos.container())) {
        return insertInline$1(before, pos.container())
      }
      return insertInline$1(before, pos.getNode())
    }
    const isPosCaretContainer = function (pos, caret) {
      const caretNode = caret.get()
      return caretNode && pos.container() === caretNode && isCaretContainerInline(caretNode)
    }
    const renderCaret = function (caret, location) {
      return location.fold((element) => {
        CaretContainerRemove.remove(caret.get())
        const text = insertInlineBefore(element)
        caret.set(text)
        return Option.some(CaretPosition$1(text, text.length - 1))
      }, (element) => CaretFinder.firstPositionIn(element).map((pos) => {
        if (!isPosCaretContainer(pos, caret)) {
          CaretContainerRemove.remove(caret.get())
          const text = insertInlinePos(pos, true)
          caret.set(text)
          return CaretPosition$1(text, 1)
        }
        return CaretPosition$1(caret.get(), 1)
      }), (element) => CaretFinder.lastPositionIn(element).map((pos) => {
        if (!isPosCaretContainer(pos, caret)) {
          CaretContainerRemove.remove(caret.get())
          const text = insertInlinePos(pos, false)
          caret.set(text)
          return CaretPosition$1(text, text.length - 1)
        }
        return CaretPosition$1(caret.get(), caret.get().length - 1)
      }), (element) => {
        CaretContainerRemove.remove(caret.get())
        const text = insertInlineAfter(element)
        caret.set(text)
        return Option.some(CaretPosition$1(text, 1))
      })
    }
    const BoundaryCaret = { renderCaret }

    const strongRtl = /[\u0591-\u07FF\uFB1D-\uFDFF\uFE70-\uFEFC]/
    const hasStrongRtl = function (text) {
      return strongRtl.test(text)
    }

    const isInlineTarget = function (editor, elm) {
      const selector = getString(editor, 'inline_boundaries_selector').getOr('a[href],code')
      return is$1(Element$$1.fromDom(elm), selector)
    }
    const isRtl$1 = function (element) {
      return DOMUtils$1.DOM.getStyle(element, 'direction', true) === 'rtl' || hasStrongRtl(element.textContent)
    }
    const findInlineParents = function (isInlineTarget, rootNode, pos) {
      return filter(DOMUtils$1.DOM.getParents(pos.container(), '*', rootNode), isInlineTarget)
    }
    const findRootInline = function (isInlineTarget, rootNode, pos) {
      const parents = findInlineParents(isInlineTarget, rootNode, pos)
      return Option.from(parents[parents.length - 1])
    }
    const hasSameParentBlock = function (rootNode, node1, node2) {
      const block1 = getParentBlock(node1, rootNode)
      const block2 = getParentBlock(node2, rootNode)
      return block1 && block1 === block2
    }
    const isAtZwsp = function (pos) {
      return isBeforeInline(pos) || isAfterInline(pos)
    }
    const normalizePosition = function (forward, pos) {
      const container = pos.container(); const offset = pos.offset()
      if (forward) {
        if (isCaretContainerInline(container)) {
          if (NodeType.isText(container.nextSibling)) {
            return CaretPosition$1(container.nextSibling, 0)
          }
          return CaretPosition$1.after(container)
        }
        return isBeforeInline(pos) ? CaretPosition$1(container, offset + 1) : pos
      }
      if (isCaretContainerInline(container)) {
        if (NodeType.isText(container.previousSibling)) {
          return CaretPosition$1(container.previousSibling, container.previousSibling.data.length)
        }
        return CaretPosition$1.before(container)
      }
      return isAfterInline(pos) ? CaretPosition$1(container, offset - 1) : pos
    }
    const normalizeForwards = curry(normalizePosition, true)
    const normalizeBackwards = curry(normalizePosition, false)
    const InlineUtils = {
      isInlineTarget,
      findRootInline,
      isRtl: isRtl$1,
      isAtZwsp,
      normalizePosition,
      normalizeForwards,
      normalizeBackwards,
      hasSameParentBlock,
    }

    const evaluateUntil = function (fns, args) {
      for (let i = 0; i < fns.length; i++) {
        const result = fns[i].apply(null, args)
        if (result.isSome()) {
          return result
        }
      }
      return Option.none()
    }
    const LazyEvaluator = { evaluateUntil }

    const Location = Adt.generate([
      { before: ['element'] },
      { start: ['element'] },
      { end: ['element'] },
      { after: ['element'] },
    ])
    const rescope = function (rootNode, node) {
      const parentBlock = getParentBlock(node, rootNode)
      return parentBlock || rootNode
    }
    const before$4 = function (isInlineTarget, rootNode, pos) {
      const nPos = InlineUtils.normalizeForwards(pos)
      const scope = rescope(rootNode, nPos.container())
      return InlineUtils.findRootInline(isInlineTarget, scope, nPos).fold(() => CaretFinder.nextPosition(scope, nPos).bind(curry(InlineUtils.findRootInline, isInlineTarget, scope)).map((inline) => Location.before(inline)), Option.none)
    }
    const isNotInsideFormatCaretContainer = function (rootNode, elm) {
      return getParentCaretContainer(rootNode, elm) === null
    }
    const findInsideRootInline = function (isInlineTarget, rootNode, pos) {
      return InlineUtils.findRootInline(isInlineTarget, rootNode, pos).filter(curry(isNotInsideFormatCaretContainer, rootNode))
    }
    const start$1 = function (isInlineTarget, rootNode, pos) {
      const nPos = InlineUtils.normalizeBackwards(pos)
      return findInsideRootInline(isInlineTarget, rootNode, nPos).bind((inline) => {
        const prevPos = CaretFinder.prevPosition(inline, nPos)
        return prevPos.isNone() ? Option.some(Location.start(inline)) : Option.none()
      })
    }
    const end = function (isInlineTarget, rootNode, pos) {
      const nPos = InlineUtils.normalizeForwards(pos)
      return findInsideRootInline(isInlineTarget, rootNode, nPos).bind((inline) => {
        const nextPos = CaretFinder.nextPosition(inline, nPos)
        return nextPos.isNone() ? Option.some(Location.end(inline)) : Option.none()
      })
    }
    const after$4 = function (isInlineTarget, rootNode, pos) {
      const nPos = InlineUtils.normalizeBackwards(pos)
      const scope = rescope(rootNode, nPos.container())
      return InlineUtils.findRootInline(isInlineTarget, scope, nPos).fold(() => CaretFinder.prevPosition(scope, nPos).bind(curry(InlineUtils.findRootInline, isInlineTarget, scope)).map((inline) => Location.after(inline)), Option.none)
    }
    const isValidLocation = function (location) {
      return InlineUtils.isRtl(getElement(location)) === false
    }
    const readLocation = function (isInlineTarget, rootNode, pos) {
      const location = LazyEvaluator.evaluateUntil([
        before$4,
        start$1,
        end,
        after$4,
      ], [
        isInlineTarget,
        rootNode,
        pos,
      ])
      return location.filter(isValidLocation)
    }
    var getElement = function (location) {
      return location.fold(identity, identity, identity, identity)
    }
    const getName = function (location) {
      return location.fold(constant('before'), constant('start'), constant('end'), constant('after'))
    }
    const outside = function (location) {
      return location.fold(Location.before, Location.before, Location.after, Location.after)
    }
    const inside = function (location) {
      return location.fold(Location.start, Location.start, Location.end, Location.end)
    }
    const isEq$5 = function (location1, location2) {
      return getName(location1) === getName(location2) && getElement(location1) === getElement(location2)
    }
    const betweenInlines = function (forward, isInlineTarget, rootNode, from, to, location) {
      return liftN([
        InlineUtils.findRootInline(isInlineTarget, rootNode, from),
        InlineUtils.findRootInline(isInlineTarget, rootNode, to),
      ], (fromInline, toInline) => {
        if (fromInline !== toInline && InlineUtils.hasSameParentBlock(rootNode, fromInline, toInline)) {
          return Location.after(forward ? fromInline : toInline)
        }
        return location
      }).getOr(location)
    }
    const skipNoMovement = function (fromLocation, toLocation) {
      return fromLocation.fold(constant(true), (fromLocation) => !isEq$5(fromLocation, toLocation))
    }
    const findLocationTraverse = function (forward, isInlineTarget, rootNode, fromLocation, pos) {
      const from = InlineUtils.normalizePosition(forward, pos)
      const to = CaretFinder.fromPosition(forward, rootNode, from).map(curry(InlineUtils.normalizePosition, forward))
      const location = to.fold(() => fromLocation.map(outside), (to) => readLocation(isInlineTarget, rootNode, to).map(curry(betweenInlines, forward, isInlineTarget, rootNode, from, to)).filter(curry(skipNoMovement, fromLocation)))
      return location.filter(isValidLocation)
    }
    const findLocationSimple = function (forward, location) {
      if (forward) {
        return location.fold(compose(Option.some, Location.start), Option.none, compose(Option.some, Location.after), Option.none)
      }
      return location.fold(Option.none, compose(Option.some, Location.before), Option.none, compose(Option.some, Location.end))
    }
    const findLocation = function (forward, isInlineTarget, rootNode, pos) {
      const from = InlineUtils.normalizePosition(forward, pos)
      const fromLocation = readLocation(isInlineTarget, rootNode, from)
      return readLocation(isInlineTarget, rootNode, from).bind(curry(findLocationSimple, forward)).orThunk(() => findLocationTraverse(forward, isInlineTarget, rootNode, fromLocation, pos))
    }
    const BoundaryLocation = {
      readLocation,
      findLocation,
      prevLocation: curry(findLocation, false),
      nextLocation: curry(findLocation, true),
      getElement,
      outside,
      inside,
    }

    const hasSelectionModifyApi = function (editor) {
      return isFunction(editor.selection.getSel().modify)
    }
    const moveRel = function (forward, selection, pos) {
      const delta = forward ? 1 : -1
      selection.setRng(CaretPosition$1(pos.container(), pos.offset() + delta).toRange())
      selection.getSel().modify('move', forward ? 'forward' : 'backward', 'word')
      return true
    }
    const moveByWord = function (forward, editor) {
      const rng = editor.selection.getRng()
      const pos = forward ? CaretPosition$1.fromRangeEnd(rng) : CaretPosition$1.fromRangeStart(rng)
      if (!hasSelectionModifyApi(editor)) {
        return false
      } if (forward && isBeforeInline(pos)) {
        return moveRel(true, editor.selection, pos)
      } if (!forward && isAfterInline(pos)) {
        return moveRel(false, editor.selection, pos)
      }
      return false
    }
    const WordSelection = {
      hasSelectionModifyApi,
      moveByWord,
    }

    const setCaretPosition = function (editor, pos) {
      const rng = editor.dom.createRng()
      rng.setStart(pos.container(), pos.offset())
      rng.setEnd(pos.container(), pos.offset())
      editor.selection.setRng(rng)
    }
    const isFeatureEnabled = function (editor) {
      return editor.settings.inline_boundaries !== false
    }
    const setSelected = function (state, elm) {
      if (state) {
        elm.setAttribute('data-mce-selected', 'inline-boundary')
      } else {
        elm.removeAttribute('data-mce-selected')
      }
    }
    const renderCaretLocation = function (editor, caret, location) {
      return BoundaryCaret.renderCaret(caret, location).map((pos) => {
        setCaretPosition(editor, pos)
        return location
      })
    }
    const findLocation$1 = function (editor, caret, forward) {
      const rootNode = editor.getBody()
      const from = CaretPosition$1.fromRangeStart(editor.selection.getRng())
      const isInlineTarget = curry(InlineUtils.isInlineTarget, editor)
      const location = BoundaryLocation.findLocation(forward, isInlineTarget, rootNode, from)
      return location.bind((location) => renderCaretLocation(editor, caret, location))
    }
    const toggleInlines = function (isInlineTarget, dom, elms) {
      const selectedInlines = filter(dom.select('*[data-mce-selected="inline-boundary"]'), isInlineTarget)
      const targetInlines = filter(elms, isInlineTarget)
      each(difference(selectedInlines, targetInlines), curry(setSelected, false))
      each(difference(targetInlines, selectedInlines), curry(setSelected, true))
    }
    const safeRemoveCaretContainer = function (editor, caret) {
      if (editor.selection.isCollapsed() && editor.composing !== true && caret.get()) {
        const pos = CaretPosition$1.fromRangeStart(editor.selection.getRng())
        if (CaretPosition$1.isTextPosition(pos) && InlineUtils.isAtZwsp(pos) === false) {
          setCaretPosition(editor, CaretContainerRemove.removeAndReposition(caret.get(), pos))
          caret.set(null)
        }
      }
    }
    const renderInsideInlineCaret = function (isInlineTarget, editor, caret, elms) {
      if (editor.selection.isCollapsed()) {
        const inlines = filter(elms, isInlineTarget)
        each(inlines, (inline) => {
          const pos = CaretPosition$1.fromRangeStart(editor.selection.getRng())
          BoundaryLocation.readLocation(isInlineTarget, editor.getBody(), pos).bind((location) => renderCaretLocation(editor, caret, location))
        })
      }
    }
    const move$1 = function (editor, caret, forward) {
      return function () {
        return isFeatureEnabled(editor) ? findLocation$1(editor, caret, forward).isSome() : false
      }
    }
    const moveWord = function (forward, editor, caret) {
      return function () {
        return isFeatureEnabled(editor) ? WordSelection.moveByWord(forward, editor) : false
      }
    }
    const setupSelectedState = function (editor) {
      const caret = Cell(null)
      const isInlineTarget = curry(InlineUtils.isInlineTarget, editor)
      editor.on('NodeChange', (e) => {
        if (isFeatureEnabled(editor)) {
          toggleInlines(isInlineTarget, editor.dom, e.parents)
          safeRemoveCaretContainer(editor, caret)
          renderInsideInlineCaret(isInlineTarget, editor, caret, e.parents)
        }
      })
      return caret
    }
    const moveNextWord = curry(moveWord, true)
    const movePrevWord = curry(moveWord, false)
    const BoundarySelection = {
      move: move$1,
      moveNextWord,
      movePrevWord,
      setupSelectedState,
      setCaretPosition,
    }

    const isContentEditableFalse$b = NodeType.isContentEditableFalse
    const getSelectedNode$1 = getSelectedNode
    const isAfterContentEditableFalse$2 = isAfterContentEditableFalse
    const isBeforeContentEditableFalse$2 = isBeforeContentEditableFalse
    const getVisualCaretPosition = function (walkFn, caretPosition) {
      while (caretPosition = walkFn(caretPosition)) {
        if (caretPosition.isVisible()) {
          return caretPosition
        }
      }
      return caretPosition
    }
    const isMoveInsideSameBlock = function (from, to) {
      const inSameBlock = isInSameBlock(from, to)
      if (!inSameBlock && NodeType.isBr(from.getNode())) {
        return true
      }
      return inSameBlock
    }
    const moveToCeFalseHorizontally = function (direction, editor, getNextPosFn, range$$1) {
      let node, caretPosition, peekCaretPosition, rangeIsInContainerBlock
      const forwards = direction === HDirection.Forwards
      const isBeforeContentEditableFalseFn = forwards ? isBeforeContentEditableFalse$2 : isAfterContentEditableFalse$2
      if (!range$$1.collapsed) {
        node = getSelectedNode$1(range$$1)
        if (isContentEditableFalse$b(node)) {
          return showCaret(direction, editor, node, direction === HDirection.Backwards, true)
        }
      }
      rangeIsInContainerBlock = isRangeInCaretContainerBlock(range$$1)
      caretPosition = getNormalizedRangeEndPoint(direction, editor.getBody(), range$$1)
      if (isBeforeContentEditableFalseFn(caretPosition)) {
        return selectNode(editor, caretPosition.getNode(!forwards))
      }
      caretPosition = getNextPosFn(caretPosition)
      if (!caretPosition) {
        if (rangeIsInContainerBlock) {
          return range$$1
        }
        return null
      }
      if (isBeforeContentEditableFalseFn(caretPosition)) {
        return showCaret(direction, editor, caretPosition.getNode(!forwards), forwards, true)
      }
      peekCaretPosition = getNextPosFn(caretPosition)
      if (isBeforeContentEditableFalseFn(peekCaretPosition)) {
        if (isMoveInsideSameBlock(caretPosition, peekCaretPosition)) {
          return showCaret(direction, editor, peekCaretPosition.getNode(!forwards), forwards, true)
        }
      }
      if (rangeIsInContainerBlock) {
        return renderRangeCaret(editor, caretPosition.toRange(), true)
      }
      return null
    }
    const moveToCeFalseVertically = function (direction, editor, walkerFn, range$$1) {
      let caretPosition, linePositions, nextLinePositions
      let closestNextLineRect, caretClientRect, clientX
      let dist1, dist2, contentEditableFalseNode
      contentEditableFalseNode = getSelectedNode$1(range$$1)
      caretPosition = getNormalizedRangeEndPoint(direction, editor.getBody(), range$$1)
      linePositions = walkerFn(editor.getBody(), isAboveLine(1), caretPosition)
      nextLinePositions = filter(linePositions, isLine(1))
      caretClientRect = ArrUtils.last(caretPosition.getClientRects())
      if (isBeforeContentEditableFalse$2(caretPosition) || isBeforeTable(caretPosition)) {
        contentEditableFalseNode = caretPosition.getNode()
      }
      if (isAfterContentEditableFalse$2(caretPosition) || isAfterTable(caretPosition)) {
        contentEditableFalseNode = caretPosition.getNode(true)
      }
      if (!caretClientRect) {
        return null
      }
      clientX = caretClientRect.left
      closestNextLineRect = findClosestClientRect(nextLinePositions, clientX)
      if (closestNextLineRect) {
        if (isContentEditableFalse$b(closestNextLineRect.node)) {
          dist1 = Math.abs(clientX - closestNextLineRect.left)
          dist2 = Math.abs(clientX - closestNextLineRect.right)
          return showCaret(direction, editor, closestNextLineRect.node, dist1 < dist2, true)
        }
      }
      if (contentEditableFalseNode) {
        const caretPositions = positionsUntil(direction, editor.getBody(), isAboveLine(1), contentEditableFalseNode)
        closestNextLineRect = findClosestClientRect(filter(caretPositions, isLine(1)), clientX)
        if (closestNextLineRect) {
          return renderRangeCaret(editor, closestNextLineRect.position.toRange(), true)
        }
        closestNextLineRect = ArrUtils.last(filter(caretPositions, isLine(0)))
        if (closestNextLineRect) {
          return renderRangeCaret(editor, closestNextLineRect.position.toRange(), true)
        }
      }
    }
    const createTextBlock = function (editor) {
      const textBlock = editor.dom.create(Settings.getForcedRootBlock(editor))
      if (!Env.ie || Env.ie >= 11) {
        textBlock.innerHTML = '<br data-mce-bogus="1">'
      }
      return textBlock
    }
    const exitPreBlock = function (editor, direction, range$$1) {
      let pre, caretPos, newBlock
      const caretWalker = CaretWalker(editor.getBody())
      const getNextVisualCaretPosition = curry(getVisualCaretPosition, caretWalker.next)
      const getPrevVisualCaretPosition = curry(getVisualCaretPosition, caretWalker.prev)
      if (range$$1.collapsed && editor.settings.forced_root_block) {
        pre = editor.dom.getParent(range$$1.startContainer, 'PRE')
        if (!pre) {
          return
        }
        if (direction === 1) {
          caretPos = getNextVisualCaretPosition(CaretPosition$1.fromRangeStart(range$$1))
        } else {
          caretPos = getPrevVisualCaretPosition(CaretPosition$1.fromRangeStart(range$$1))
        }
        if (!caretPos) {
          newBlock = createTextBlock(editor)
          if (direction === 1) {
            editor.$(pre).after(newBlock)
          } else {
            editor.$(pre).before(newBlock)
          }
          editor.selection.select(newBlock, true)
          editor.selection.collapse()
        }
      }
    }
    const getHorizontalRange = function (editor, forward) {
      const caretWalker = CaretWalker(editor.getBody())
      const getNextVisualCaretPosition = curry(getVisualCaretPosition, caretWalker.next)
      const getPrevVisualCaretPosition = curry(getVisualCaretPosition, caretWalker.prev)
      let newRange
      const direction = forward ? HDirection.Forwards : HDirection.Backwards
      const getNextPosFn = forward ? getNextVisualCaretPosition : getPrevVisualCaretPosition
      const range$$1 = editor.selection.getRng()
      newRange = moveToCeFalseHorizontally(direction, editor, getNextPosFn, range$$1)
      if (newRange) {
        return newRange
      }
      newRange = exitPreBlock(editor, direction, range$$1)
      if (newRange) {
        return newRange
      }
      return null
    }
    const getVerticalRange = function (editor, down) {
      let newRange
      const direction = down ? 1 : -1
      const walkerFn = down ? downUntil : upUntil
      const range$$1 = editor.selection.getRng()
      newRange = moveToCeFalseVertically(direction, editor, walkerFn, range$$1)
      if (newRange) {
        return newRange
      }
      newRange = exitPreBlock(editor, direction, range$$1)
      if (newRange) {
        return newRange
      }
      return null
    }
    const moveH = function (editor, forward) {
      return function () {
        const newRng = getHorizontalRange(editor, forward)
        if (newRng) {
          editor.selection.setRng(newRng)
          return true
        }
        return false
      }
    }
    const moveV = function (editor, down) {
      return function () {
        const newRng = getVerticalRange(editor, down)
        if (newRng) {
          editor.selection.setRng(newRng)
          return true
        }
        return false
      }
    }

    let BreakType;
    (function (BreakType) {
      BreakType[BreakType.Br = 0] = 'Br'
      BreakType[BreakType.Block = 1] = 'Block'
      BreakType[BreakType.Wrap = 2] = 'Wrap'
      BreakType[BreakType.Eol = 3] = 'Eol'
    }(BreakType || (BreakType = {})))
    const flip = function (direction, positions) {
      return direction === HDirection.Backwards ? positions.reverse() : positions
    }
    const walk$3 = function (direction, caretWalker, pos) {
      return direction === HDirection.Forwards ? caretWalker.next(pos) : caretWalker.prev(pos)
    }
    const getBreakType = function (scope, direction, currentPos, nextPos) {
      if (NodeType.isBr(nextPos.getNode(direction === HDirection.Forwards))) {
        return BreakType.Br
      } if (isInSameBlock(currentPos, nextPos) === false) {
        return BreakType.Block
      }
      return BreakType.Wrap
    }
    const getPositionsUntil = function (predicate, direction, scope, start) {
      const caretWalker = CaretWalker(scope)
      let currentPos = start; let nextPos
      const positions = []
      while (currentPos) {
        nextPos = walk$3(direction, caretWalker, currentPos)
        if (!nextPos) {
          break
        }
        if (NodeType.isBr(nextPos.getNode(false))) {
          if (direction === HDirection.Forwards) {
            return {
              positions: flip(direction, positions).concat([nextPos]),
              breakType: BreakType.Br,
              breakAt: Option.some(nextPos),
            }
          }
          return {
            positions: flip(direction, positions),
            breakType: BreakType.Br,
            breakAt: Option.some(nextPos),
          }
        }
        if (!nextPos.isVisible()) {
          currentPos = nextPos
          continue
        }
        if (predicate(currentPos, nextPos)) {
          const breakType = getBreakType(scope, direction, currentPos, nextPos)
          return {
            positions: flip(direction, positions),
            breakType,
            breakAt: Option.some(nextPos),
          }
        }
        positions.push(nextPos)
        currentPos = nextPos
      }
      return {
        positions: flip(direction, positions),
        breakType: BreakType.Eol,
        breakAt: Option.none(),
      }
    }
    const getAdjacentLinePositions = function (direction, getPositionsUntilBreak, scope, start) {
      return getPositionsUntilBreak(scope, start).breakAt.map((pos) => {
        const { positions } = getPositionsUntilBreak(scope, pos)
        return direction === HDirection.Backwards ? positions.concat(pos) : [pos].concat(positions)
      }).getOr([])
    }
    const findClosestHorizontalPositionFromPoint = function (positions, x) {
      return foldl(positions, (acc, newPos) => acc.fold(() => Option.some(newPos), (lastPos) => liftN([
        head(lastPos.getClientRects()),
        head(newPos.getClientRects()),
      ], (lastRect, newRect) => {
        const lastDist = Math.abs(x - lastRect.left)
        const newDist = Math.abs(x - newRect.left)
        return newDist <= lastDist ? newPos : lastPos
      }).or(acc)), Option.none())
    }
    const findClosestHorizontalPosition = function (positions, pos) {
      return head(pos.getClientRects()).bind((targetRect) => findClosestHorizontalPositionFromPoint(positions, targetRect.left))
    }
    const getPositionsUntilPreviousLine = curry(getPositionsUntil, CaretPosition.isAbove, -1)
    const getPositionsUntilNextLine = curry(getPositionsUntil, CaretPosition.isBelow, 1)
    const isAtFirstLine = function (scope, pos) {
      return getPositionsUntilPreviousLine(scope, pos).breakAt.isNone()
    }
    const isAtLastLine = function (scope, pos) {
      return getPositionsUntilNextLine(scope, pos).breakAt.isNone()
    }
    const getPositionsAbove = curry(getAdjacentLinePositions, -1, getPositionsUntilPreviousLine)
    const getPositionsBelow = curry(getAdjacentLinePositions, 1, getPositionsUntilNextLine)
    const getFirstLinePositions = function (scope) {
      return CaretFinder.firstPositionIn(scope).map((pos) => [pos].concat(getPositionsUntilNextLine(scope, pos).positions)).getOr([])
    }
    const getLastLinePositions = function (scope) {
      return CaretFinder.lastPositionIn(scope).map((pos) => getPositionsUntilPreviousLine(scope, pos).positions.concat(pos)).getOr([])
    }

    const deflate = function (rect, delta) {
      return {
        left: rect.left - delta,
        top: rect.top - delta,
        right: rect.right + delta * 2,
        bottom: rect.bottom + delta * 2,
        width: rect.width + delta,
        height: rect.height + delta,
      }
    }
    const getCorners = function (getYAxisValue, tds) {
      return bind(tds, (td) => {
        const rect = deflate(clone$2(td.getBoundingClientRect()), -1)
        return [
          {
            x: rect.left,
            y: getYAxisValue(rect),
            cell: td,
          },
          {
            x: rect.right,
            y: getYAxisValue(rect),
            cell: td,
          },
        ]
      })
    }
    const findClosestCorner = function (corners, x, y) {
      return foldl(corners, (acc, newCorner) => acc.fold(() => Option.some(newCorner), (oldCorner) => {
        const oldDist = Math.sqrt(Math.abs(oldCorner.x - x) + Math.abs(oldCorner.y - y))
        const newDist = Math.sqrt(Math.abs(newCorner.x - x) + Math.abs(newCorner.y - y))
        return Option.some(newDist < oldDist ? newCorner : oldCorner)
      }), Option.none())
    }
    const getClosestCell = function (getYAxisValue, isTargetCorner, table, x, y) {
      const cells = descendants$1(Element$$1.fromDom(table), 'td,th,caption').map((e) => e.dom())
      const corners = filter(getCorners(getYAxisValue, cells), (corner) => isTargetCorner(corner, y))
      return findClosestCorner(corners, x, y).map((corner) => corner.cell)
    }
    const getBottomValue = function (rect) {
      return rect.bottom
    }
    const getTopValue = function (rect) {
      return rect.top
    }
    const isAbove$1 = function (corner, y) {
      return corner.y < y
    }
    const isBelow$1 = function (corner, y) {
      return corner.y > y
    }
    const getClosestCellAbove = curry(getClosestCell, getBottomValue, isAbove$1)
    const getClosestCellBelow = curry(getClosestCell, getTopValue, isBelow$1)
    const findClosestPositionInAboveCell = function (table, pos) {
      return head(pos.getClientRects()).bind((rect) => getClosestCellAbove(table, rect.left, rect.top)).bind((cell) => findClosestHorizontalPosition(getLastLinePositions(cell), pos))
    }
    const findClosestPositionInBelowCell = function (table, pos) {
      return last(pos.getClientRects()).bind((rect) => getClosestCellBelow(table, rect.left, rect.top)).bind((cell) => findClosestHorizontalPosition(getFirstLinePositions(cell), pos))
    }

    const moveToRange = function (editor, rng) {
      editor.selection.setRng(rng)
      ScrollIntoView.scrollRangeIntoView(editor, rng)
    }
    const hasNextBreak = function (getPositionsUntil, scope, lineInfo) {
      return lineInfo.breakAt.map((breakPos) => getPositionsUntil(scope, breakPos).breakAt.isSome()).getOr(false)
    }
    const startsWithWrapBreak = function (lineInfo) {
      return lineInfo.breakType === BreakType.Wrap && lineInfo.positions.length === 0
    }
    const startsWithBrBreak = function (lineInfo) {
      return lineInfo.breakType === BreakType.Br && lineInfo.positions.length === 1
    }
    const isAtTableCellLine = function (getPositionsUntil, scope, pos) {
      const lineInfo = getPositionsUntil(scope, pos)
      if (startsWithWrapBreak(lineInfo) || !NodeType.isBr(pos.getNode()) && startsWithBrBreak(lineInfo)) {
        return !hasNextBreak(getPositionsUntil, scope, lineInfo)
      }
      return lineInfo.breakAt.isNone()
    }
    const isAtFirstTableCellLine = curry(isAtTableCellLine, getPositionsUntilPreviousLine)
    const isAtLastTableCellLine = curry(isAtTableCellLine, getPositionsUntilNextLine)
    const isCaretAtStartOrEndOfTable = function (forward, rng, table) {
      const caretPos = CaretPosition$1.fromRangeStart(rng)
      return CaretFinder.positionIn(!forward, table).map((pos) => pos.isEqual(caretPos)).getOr(false)
    }
    const navigateHorizontally = function (editor, forward, table, td) {
      const rng = editor.selection.getRng()
      const direction = forward ? 1 : -1
      if (isFakeCaretTableBrowser() && isCaretAtStartOrEndOfTable(forward, rng, table)) {
        const newRng = showCaret(direction, editor, table, !forward, true)
        moveToRange(editor, newRng)
        return true
      }
      return false
    }
    const getClosestAbovePosition = function (root, table, start) {
      return findClosestPositionInAboveCell(table, start).orThunk(() => head(start.getClientRects()).bind((rect) => findClosestHorizontalPositionFromPoint(getPositionsAbove(root, CaretPosition$1.before(table)), rect.left))).getOr(CaretPosition$1.before(table))
    }
    const getClosestBelowPosition = function (root, table, start) {
      return findClosestPositionInBelowCell(table, start).orThunk(() => head(start.getClientRects()).bind((rect) => findClosestHorizontalPositionFromPoint(getPositionsBelow(root, CaretPosition$1.after(table)), rect.left))).getOr(CaretPosition$1.after(table))
    }
    const getTable = function (previous, pos) {
      const node = pos.getNode(previous)
      return NodeType.isElement(node) && node.nodeName === 'TABLE' ? Option.some(node) : Option.none()
    }
    const renderBlock = function (down, editor, table, pos) {
      const forcedRootBlock = Settings.getForcedRootBlock(editor)
      if (forcedRootBlock) {
        editor.undoManager.transact(() => {
          const element = Element$$1.fromTag(forcedRootBlock)
          setAll(element, Settings.getForcedRootBlockAttrs(editor))
          append(element, Element$$1.fromTag('br'))
          if (down) {
            after(Element$$1.fromDom(table), element)
          } else {
            before(Element$$1.fromDom(table), element)
          }
          const rng = editor.dom.createRng()
          rng.setStart(element.dom(), 0)
          rng.setEnd(element.dom(), 0)
          moveToRange(editor, rng)
        })
      } else {
        moveToRange(editor, pos.toRange())
      }
    }
    const moveCaret = function (editor, down, pos) {
      const table = down ? getTable(true, pos) : getTable(false, pos)
      const last$$1 = down === false
      table.fold(() => moveToRange(editor, pos.toRange()), (table) => CaretFinder.positionIn(last$$1, editor.getBody()).filter((lastPos) => lastPos.isEqual(pos)).fold(() => moveToRange(editor, pos.toRange()), (_) => renderBlock(down, editor, table, pos)))
    }
    const navigateVertically = function (editor, down, table, td) {
      const rng = editor.selection.getRng()
      const pos = CaretPosition$1.fromRangeStart(rng)
      const root = editor.getBody()
      if (!down && isAtFirstTableCellLine(td, pos)) {
        var newPos = getClosestAbovePosition(root, table, pos)
        moveCaret(editor, down, newPos)
        return true
      } if (down && isAtLastTableCellLine(td, pos)) {
        var newPos = getClosestBelowPosition(root, table, pos)
        moveCaret(editor, down, newPos)
        return true
      }
      return false
    }
    const moveH$1 = function (editor, forward) {
      return function () {
        return Option.from(editor.dom.getParent(editor.selection.getNode(), 'td,th')).bind((td) => Option.from(editor.dom.getParent(td, 'table')).map((table) => navigateHorizontally(editor, forward, table, td))).getOr(false)
      }
    }
    const moveV$1 = function (editor, forward) {
      return function () {
        return Option.from(editor.dom.getParent(editor.selection.getNode(), 'td,th')).bind((td) => Option.from(editor.dom.getParent(td, 'table')).map((table) => navigateVertically(editor, forward, table, td))).getOr(false)
      }
    }

    const isTarget = function (node) {
      return contains(['figcaption'], name(node))
    }
    const rangeBefore = function (target) {
      const rng = document.createRange()
      rng.setStartBefore(target.dom())
      rng.setEndBefore(target.dom())
      return rng
    }
    const insertElement = function (root, elm, forward) {
      if (forward) {
        append(root, elm)
      } else {
        prepend(root, elm)
      }
    }
    const insertBr = function (root, forward) {
      const br = Element$$1.fromTag('br')
      insertElement(root, br, forward)
      return rangeBefore(br)
    }
    const insertBlock$1 = function (root, forward, blockName, attrs) {
      const block = Element$$1.fromTag(blockName)
      const br = Element$$1.fromTag('br')
      setAll(block, attrs)
      append(block, br)
      insertElement(root, block, forward)
      return rangeBefore(br)
    }
    const insertEmptyLine = function (root, rootBlockName, attrs, forward) {
      if (rootBlockName === '') {
        return insertBr(root, forward)
      }
      return insertBlock$1(root, forward, rootBlockName, attrs)
    }
    const getClosestTargetBlock = function (pos, root) {
      const isRoot = curry(eq, root)
      return closest(Element$$1.fromDom(pos.container()), isBlock, isRoot).filter(isTarget)
    }
    const isAtFirstOrLastLine = function (root, forward, pos) {
      return forward ? isAtLastLine(root.dom(), pos) : isAtFirstLine(root.dom(), pos)
    }
    const moveCaretToNewEmptyLine = function (editor, forward) {
      const root = Element$$1.fromDom(editor.getBody())
      const pos = CaretPosition$1.fromRangeStart(editor.selection.getRng())
      const rootBlock = Settings.getForcedRootBlock(editor)
      const rootBlockAttrs = Settings.getForcedRootBlockAttrs(editor)
      return getClosestTargetBlock(pos, root).exists(() => {
        if (isAtFirstOrLastLine(root, forward, pos)) {
          const rng = insertEmptyLine(root, rootBlock, rootBlockAttrs, forward)
          editor.selection.setRng(rng)
          return true
        }
        return false
      })
    }
    const moveV$2 = function (editor, forward) {
      return function () {
        if (editor.selection.isCollapsed()) {
          return moveCaretToNewEmptyLine(editor, forward)
        }
        return false
      }
    }

    const defaultPatterns = function (patterns) {
      return map(patterns, (pattern) => merge({
        shiftKey: false,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
        keyCode: 0,
        action: noop,
      }, pattern))
    }
    const matchesEvent = function (pattern, evt) {
      return evt.keyCode === pattern.keyCode && evt.shiftKey === pattern.shiftKey && evt.altKey === pattern.altKey && evt.ctrlKey === pattern.ctrlKey && evt.metaKey === pattern.metaKey
    }
    const match$1 = function (patterns, evt) {
      return bind(defaultPatterns(patterns), (pattern) => matchesEvent(pattern, evt) ? [pattern] : [])
    }
    const action = function (f) {
      const x = []
      for (let _i = 1; _i < arguments.length; _i++) {
        x[_i - 1] = arguments[_i]
      }
      const args = Array.prototype.slice.call(arguments, 1)
      return function () {
        return f.apply(null, args)
      }
    }
    const execute = function (patterns, evt) {
      return find(match$1(patterns, evt), (pattern) => pattern.action())
    }
    const MatchKeys = {
      match: match$1,
      action,
      execute,
    }

    const executeKeydownOverride = function (editor, caret, evt) {
      const { os } = PlatformDetection$1.detect()
      MatchKeys.execute([
        {
          keyCode: VK.RIGHT,
          action: moveH(editor, true),
        },
        {
          keyCode: VK.LEFT,
          action: moveH(editor, false),
        },
        {
          keyCode: VK.UP,
          action: moveV(editor, false),
        },
        {
          keyCode: VK.DOWN,
          action: moveV(editor, true),
        },
        {
          keyCode: VK.RIGHT,
          action: moveH$1(editor, true),
        },
        {
          keyCode: VK.LEFT,
          action: moveH$1(editor, false),
        },
        {
          keyCode: VK.UP,
          action: moveV$1(editor, false),
        },
        {
          keyCode: VK.DOWN,
          action: moveV$1(editor, true),
        },
        {
          keyCode: VK.RIGHT,
          action: BoundarySelection.move(editor, caret, true),
        },
        {
          keyCode: VK.LEFT,
          action: BoundarySelection.move(editor, caret, false),
        },
        {
          keyCode: VK.RIGHT,
          ctrlKey: !os.isOSX(),
          altKey: os.isOSX(),
          action: BoundarySelection.moveNextWord(editor, caret),
        },
        {
          keyCode: VK.LEFT,
          ctrlKey: !os.isOSX(),
          altKey: os.isOSX(),
          action: BoundarySelection.movePrevWord(editor, caret),
        },
        {
          keyCode: VK.UP,
          action: moveV$2(editor, false),
        },
        {
          keyCode: VK.DOWN,
          action: moveV$2(editor, true),
        },
      ], evt).each((_) => {
        evt.preventDefault()
      })
    }
    const setup$7 = function (editor, caret) {
      editor.on('keydown', (evt) => {
        if (evt.isDefaultPrevented() === false) {
          executeKeydownOverride(editor, caret, evt)
        }
      })
    }
    const ArrowKeys = { setup: setup$7 }

    const isBeforeRoot = function (rootNode) {
      return function (elm) {
        return eq(rootNode, Element$$1.fromDom(elm.dom().parentNode))
      }
    }
    const getParentBlock$1 = function (rootNode, elm) {
      return contains$3(rootNode, elm) ? closest(elm, (element) => isTextBlock(element) || isListItem(element), isBeforeRoot(rootNode)) : Option.none()
    }
    const placeCaretInEmptyBody = function (editor) {
      const body = editor.getBody()
      const node = body.firstChild && editor.dom.isBlock(body.firstChild) ? body.firstChild : body
      editor.selection.setCursorLocation(node, 0)
    }
    const paddEmptyBody = function (editor) {
      if (editor.dom.isEmpty(editor.getBody())) {
        editor.setContent('')
        placeCaretInEmptyBody(editor)
      }
    }
    const willDeleteLastPositionInElement = function (forward, fromPos, elm) {
      return liftN([
        CaretFinder.firstPositionIn(elm),
        CaretFinder.lastPositionIn(elm),
      ], (firstPos, lastPos) => {
        const normalizedFirstPos = InlineUtils.normalizePosition(true, firstPos)
        const normalizedLastPos = InlineUtils.normalizePosition(false, lastPos)
        const normalizedFromPos = InlineUtils.normalizePosition(false, fromPos)
        if (forward) {
          return CaretFinder.nextPosition(elm, normalizedFromPos).map((nextPos) => nextPos.isEqual(normalizedLastPos) && fromPos.isEqual(normalizedFirstPos)).getOr(false)
        }
        return CaretFinder.prevPosition(elm, normalizedFromPos).map((prevPos) => prevPos.isEqual(normalizedFirstPos) && fromPos.isEqual(normalizedLastPos)).getOr(false)
      }).getOr(true)
    }
    const DeleteUtils = {
      getParentBlock: getParentBlock$1,
      paddEmptyBody,
      willDeleteLastPositionInElement,
    }

    const BlockPosition = Immutable('block', 'position')
    const BlockBoundary = Immutable('from', 'to')
    const getBlockPosition = function (rootNode, pos) {
      const rootElm = Element$$1.fromDom(rootNode)
      const containerElm = Element$$1.fromDom(pos.container())
      return DeleteUtils.getParentBlock(rootElm, containerElm).map((block) => BlockPosition(block, pos))
    }
    const isDifferentBlocks = function (blockBoundary) {
      return eq(blockBoundary.from().block(), blockBoundary.to().block()) === false
    }
    const hasSameParent = function (blockBoundary) {
      return parent(blockBoundary.from().block()).bind((parent1) => parent(blockBoundary.to().block()).filter((parent2) => eq(parent1, parent2))).isSome()
    }
    const isEditable = function (blockBoundary) {
      return NodeType.isContentEditableFalse(blockBoundary.from().block()) === false && NodeType.isContentEditableFalse(blockBoundary.to().block()) === false
    }
    const skipLastBr = function (rootNode, forward, blockPosition) {
      if (NodeType.isBr(blockPosition.position().getNode()) && Empty.isEmpty(blockPosition.block()) === false) {
        return CaretFinder.positionIn(false, blockPosition.block().dom()).bind((lastPositionInBlock) => {
          if (lastPositionInBlock.isEqual(blockPosition.position())) {
            return CaretFinder.fromPosition(forward, rootNode, lastPositionInBlock).bind((to) => getBlockPosition(rootNode, to))
          }
          return Option.some(blockPosition)
        }).getOr(blockPosition)
      }
      return blockPosition
    }
    const readFromRange = function (rootNode, forward, rng) {
      const fromBlockPos = getBlockPosition(rootNode, CaretPosition$1.fromRangeStart(rng))
      const toBlockPos = fromBlockPos.bind((blockPos) => CaretFinder.fromPosition(forward, rootNode, blockPos.position()).bind((to) => getBlockPosition(rootNode, to).map((blockPos) => skipLastBr(rootNode, forward, blockPos))))
      return liftN([
        fromBlockPos,
        toBlockPos,
      ], BlockBoundary).filter((blockBoundary) => isDifferentBlocks(blockBoundary) && hasSameParent(blockBoundary) && isEditable(blockBoundary))
    }
    const read$3 = function (rootNode, forward, rng) {
      return rng.collapsed ? readFromRange(rootNode, forward, rng) : Option.none()
    }
    const BlockMergeBoundary = { read: read$3 }

    const getChildrenUntilBlockBoundary = function (block) {
      const children$$1 = children(block)
      return findIndex(children$$1, isBlock).fold(() => children$$1, (index) => children$$1.slice(0, index))
    }
    const extractChildren = function (block) {
      const children$$1 = getChildrenUntilBlockBoundary(block)
      each(children$$1, remove$2)
      return children$$1
    }
    const removeEmptyRoot = function (rootNode, block) {
      const parents$$1 = Parents.parentsAndSelf(block, rootNode)
      return find(parents$$1.reverse(), Empty.isEmpty).each(remove$2)
    }
    const isEmptyBefore = function (el) {
      return filter(prevSiblings(el), (el) => !Empty.isEmpty(el)).length === 0
    }
    const nestedBlockMerge = function (rootNode, fromBlock, toBlock, insertionPoint) {
      if (Empty.isEmpty(toBlock)) {
        PaddingBr.fillWithPaddingBr(toBlock)
        return CaretFinder.firstPositionIn(toBlock.dom())
      }
      if (isEmptyBefore(insertionPoint) && Empty.isEmpty(fromBlock)) {
        before(insertionPoint, Element$$1.fromTag('br'))
      }
      const position = CaretFinder.prevPosition(toBlock.dom(), CaretPosition$1.before(insertionPoint.dom()))
      each(extractChildren(fromBlock), (child$$1) => {
        before(insertionPoint, child$$1)
      })
      removeEmptyRoot(rootNode, fromBlock)
      return position
    }
    const sidelongBlockMerge = function (rootNode, fromBlock, toBlock) {
      if (Empty.isEmpty(toBlock)) {
        remove$2(toBlock)
        if (Empty.isEmpty(fromBlock)) {
          PaddingBr.fillWithPaddingBr(fromBlock)
        }
        return CaretFinder.firstPositionIn(fromBlock.dom())
      }
      const position = CaretFinder.lastPositionIn(toBlock.dom())
      each(extractChildren(fromBlock), (child$$1) => {
        append(toBlock, child$$1)
      })
      removeEmptyRoot(rootNode, fromBlock)
      return position
    }
    const findInsertionPoint = function (toBlock, block) {
      const parentsAndSelf = Parents.parentsAndSelf(block, toBlock)
      return Option.from(parentsAndSelf[parentsAndSelf.length - 1])
    }
    const getInsertionPoint = function (fromBlock, toBlock) {
      return contains$3(toBlock, fromBlock) ? findInsertionPoint(toBlock, fromBlock) : Option.none()
    }
    const trimBr = function (first, block) {
      CaretFinder.positionIn(first, block.dom()).map((position) => position.getNode()).map(Element$$1.fromDom).filter(isBr).each(remove$2)
    }
    const mergeBlockInto = function (rootNode, fromBlock, toBlock) {
      trimBr(true, fromBlock)
      trimBr(false, toBlock)
      return getInsertionPoint(fromBlock, toBlock).fold(curry(sidelongBlockMerge, rootNode, fromBlock, toBlock), curry(nestedBlockMerge, rootNode, fromBlock, toBlock))
    }
    const mergeBlocks = function (rootNode, forward, block1, block2) {
      return forward ? mergeBlockInto(rootNode, block2, block1) : mergeBlockInto(rootNode, block1, block2)
    }
    const MergeBlocks = { mergeBlocks }

    const backspaceDelete = function (editor, forward) {
      let position
      const rootNode = Element$$1.fromDom(editor.getBody())
      position = BlockMergeBoundary.read(rootNode.dom(), forward, editor.selection.getRng()).bind((blockBoundary) => MergeBlocks.mergeBlocks(rootNode, forward, blockBoundary.from().block(), blockBoundary.to().block()))
      position.each((pos) => {
        editor.selection.setRng(pos.toRange())
      })
      return position.isSome()
    }
    const BlockBoundaryDelete = { backspaceDelete }

    const deleteRangeMergeBlocks = function (rootNode, selection) {
      const rng = selection.getRng()
      return liftN([
        DeleteUtils.getParentBlock(rootNode, Element$$1.fromDom(rng.startContainer)),
        DeleteUtils.getParentBlock(rootNode, Element$$1.fromDom(rng.endContainer)),
      ], (block1, block2) => {
        if (eq(block1, block2) === false) {
          rng.deleteContents()
          MergeBlocks.mergeBlocks(rootNode, true, block1, block2).each((pos) => {
            selection.setRng(pos.toRange())
          })
          return true
        }
        return false
      }).getOr(false)
    }
    const isRawNodeInTable = function (root, rawNode) {
      const node = Element$$1.fromDom(rawNode)
      const isRoot = curry(eq, root)
      return ancestor(node, isTableCell, isRoot).isSome()
    }
    const isSelectionInTable = function (root, rng) {
      return isRawNodeInTable(root, rng.startContainer) || isRawNodeInTable(root, rng.endContainer)
    }
    const isEverythingSelected = function (root, rng) {
      const noPrevious = CaretFinder.prevPosition(root.dom(), CaretPosition$1.fromRangeStart(rng)).isNone()
      const noNext = CaretFinder.nextPosition(root.dom(), CaretPosition$1.fromRangeEnd(rng)).isNone()
      return !isSelectionInTable(root, rng) && noPrevious && noNext
    }
    const emptyEditor = function (editor) {
      editor.setContent('')
      editor.selection.setCursorLocation()
      return true
    }
    const deleteRange = function (editor) {
      const rootNode = Element$$1.fromDom(editor.getBody())
      const rng = editor.selection.getRng()
      return isEverythingSelected(rootNode, rng) ? emptyEditor(editor) : deleteRangeMergeBlocks(rootNode, editor.selection)
    }
    const backspaceDelete$1 = function (editor, forward) {
      return editor.selection.isCollapsed() ? false : deleteRange(editor)
    }
    const BlockRangeDelete = { backspaceDelete: backspaceDelete$1 }

    const isBr$5 = function (pos) {
      return getElementFromPosition(pos).exists(isBr)
    }
    const findBr = function (forward, root, pos) {
      const parentBlocks = filter(Parents.parentsAndSelf(Element$$1.fromDom(pos.container()), root), isBlock)
      const scope = head(parentBlocks).getOr(root)
      return CaretFinder.fromPosition(forward, scope.dom(), pos).filter(isBr$5)
    }
    const isBeforeBr = function (root, pos) {
      return getElementFromPosition(pos).exists(isBr) || findBr(true, root, pos).isSome()
    }
    const isAfterBr = function (root, pos) {
      return getElementFromPrevPosition(pos).exists(isBr) || findBr(false, root, pos).isSome()
    }
    const findPreviousBr = curry(findBr, false)
    const findNextBr = curry(findBr, true)

    const isCompoundElement = function (node) {
      return isTableCell(Element$$1.fromDom(node)) || isListItem(Element$$1.fromDom(node))
    }
    const DeleteAction = Adt.generate([
      { remove: ['element'] },
      { moveToElement: ['element'] },
      { moveToPosition: ['position'] },
    ])
    const isAtContentEditableBlockCaret = function (forward, from) {
      const elm = from.getNode(forward === false)
      const caretLocation = forward ? 'after' : 'before'
      return NodeType.isElement(elm) && elm.getAttribute('data-mce-caret') === caretLocation
    }
    const isDeleteFromCefDifferentBlocks = function (root, forward, from, to) {
      const inSameBlock = function (elm) {
        return isInline(Element$$1.fromDom(elm)) && !isInSameBlock(from, to, root)
      }
      return getRelativeCefElm(!forward, from).fold(() => getRelativeCefElm(forward, to).fold(constant(false), inSameBlock), inSameBlock)
    }
    const deleteEmptyBlockOrMoveToCef = function (root, forward, from, to) {
      const toCefElm = to.getNode(forward === false)
      return DeleteUtils.getParentBlock(Element$$1.fromDom(root), Element$$1.fromDom(from.getNode())).map((blockElm) => Empty.isEmpty(blockElm) ? DeleteAction.remove(blockElm.dom()) : DeleteAction.moveToElement(toCefElm)).orThunk(() => Option.some(DeleteAction.moveToElement(toCefElm)))
    }
    const findCefPosition = function (root, forward, from) {
      return CaretFinder.fromPosition(forward, root, from).bind((to) => {
        if (isCompoundElement(to.getNode())) {
          return Option.none()
        } if (isDeleteFromCefDifferentBlocks(root, forward, from, to)) {
          return Option.none()
        } if (forward && NodeType.isContentEditableFalse(to.getNode())) {
          return deleteEmptyBlockOrMoveToCef(root, forward, from, to)
        } if (forward === false && NodeType.isContentEditableFalse(to.getNode(true))) {
          return deleteEmptyBlockOrMoveToCef(root, forward, from, to)
        } if (forward && isAfterContentEditableFalse(from)) {
          return Option.some(DeleteAction.moveToPosition(to))
        } if (forward === false && isBeforeContentEditableFalse(from)) {
          return Option.some(DeleteAction.moveToPosition(to))
        }
        return Option.none()
      })
    }
    const getContentEditableBlockAction = function (forward, elm) {
      if (forward && NodeType.isContentEditableFalse(elm.nextSibling)) {
        return Option.some(DeleteAction.moveToElement(elm.nextSibling))
      } if (forward === false && NodeType.isContentEditableFalse(elm.previousSibling)) {
        return Option.some(DeleteAction.moveToElement(elm.previousSibling))
      }
      return Option.none()
    }
    const skipMoveToActionFromInlineCefToContent = function (root, from, deleteAction) {
      return deleteAction.fold((elm) => Option.some(DeleteAction.remove(elm)), (elm) => Option.some(DeleteAction.moveToElement(elm)), (to) => {
        if (isInSameBlock(from, to, root)) {
          return Option.none()
        }
        return Option.some(DeleteAction.moveToPosition(to))
      })
    }
    const getContentEditableAction = function (root, forward, from) {
      if (isAtContentEditableBlockCaret(forward, from)) {
        return getContentEditableBlockAction(forward, from.getNode(forward === false)).fold(() => findCefPosition(root, forward, from), Option.some)
      }
      return findCefPosition(root, forward, from).bind((deleteAction) => skipMoveToActionFromInlineCefToContent(root, from, deleteAction))
    }
    const read$4 = function (root, forward, rng) {
      const normalizedRange = normalizeRange(forward ? 1 : -1, root, rng)
      const from = CaretPosition$1.fromRangeStart(normalizedRange)
      const rootElement = Element$$1.fromDom(root)
      if (forward === false && isAfterContentEditableFalse(from)) {
        return Option.some(DeleteAction.remove(from.getNode(true)))
      } if (forward && isBeforeContentEditableFalse(from)) {
        return Option.some(DeleteAction.remove(from.getNode()))
      } if (forward === false && isBeforeContentEditableFalse(from) && isAfterBr(rootElement, from)) {
        return findPreviousBr(rootElement, from).map((br) => DeleteAction.remove(br.getNode()))
      } if (forward && isAfterContentEditableFalse(from) && isBeforeBr(rootElement, from)) {
        return findNextBr(rootElement, from).map((br) => DeleteAction.remove(br.getNode()))
      }
      return getContentEditableAction(root, forward, from)
    }

    const deleteElement$1 = function (editor, forward) {
      return function (element) {
        editor._selectionOverrides.hideFakeCaret()
        DeleteElement.deleteElement(editor, forward, Element$$1.fromDom(element))
        return true
      }
    }
    const moveToElement = function (editor, forward) {
      return function (element) {
        const pos = forward ? CaretPosition$1.before(element) : CaretPosition$1.after(element)
        editor.selection.setRng(pos.toRange())
        return true
      }
    }
    const moveToPosition = function (editor) {
      return function (pos) {
        editor.selection.setRng(pos.toRange())
        return true
      }
    }
    const backspaceDeleteCaret = function (editor, forward) {
      const result = read$4(editor.getBody(), forward, editor.selection.getRng()).map((deleteAction) => deleteAction.fold(deleteElement$1(editor, forward), moveToElement(editor, forward), moveToPosition(editor)))
      return result.getOr(false)
    }
    const deleteOffscreenSelection = function (rootElement) {
      each(descendants$1(rootElement, '.mce-offscreen-selection'), remove$2)
    }
    const backspaceDeleteRange = function (editor, forward) {
      const selectedElement = editor.selection.getNode()
      if (NodeType.isContentEditableFalse(selectedElement)) {
        deleteOffscreenSelection(Element$$1.fromDom(editor.getBody()))
        DeleteElement.deleteElement(editor, forward, Element$$1.fromDom(editor.selection.getNode()))
        DeleteUtils.paddEmptyBody(editor)
        return true
      }
      return false
    }
    const getContentEditableRoot$2 = function (root, node) {
      while (node && node !== root) {
        if (NodeType.isContentEditableTrue(node) || NodeType.isContentEditableFalse(node)) {
          return node
        }
        node = node.parentNode
      }
      return null
    }
    const paddEmptyElement = function (editor) {
      let br
      const ceRoot = getContentEditableRoot$2(editor.getBody(), editor.selection.getNode())
      if (NodeType.isContentEditableTrue(ceRoot) && editor.dom.isBlock(ceRoot) && editor.dom.isEmpty(ceRoot)) {
        br = editor.dom.create('br', { 'data-mce-bogus': '1' })
        editor.dom.setHTML(ceRoot, '')
        ceRoot.appendChild(br)
        editor.selection.setRng(CaretPosition$1.before(br).toRange())
      }
      return true
    }
    const backspaceDelete$2 = function (editor, forward) {
      if (editor.selection.isCollapsed()) {
        return backspaceDeleteCaret(editor, forward)
      }
      return backspaceDeleteRange(editor, forward)
    }
    const CefDelete = {
      backspaceDelete: backspaceDelete$2,
      paddEmptyElement,
    }

    const isFeatureEnabled$1 = function (editor) {
      return editor.settings.inline_boundaries !== false
    }
    const rangeFromPositions = function (from, to) {
      const range = document.createRange()
      range.setStart(from.container(), from.offset())
      range.setEnd(to.container(), to.offset())
      return range
    }
    const hasOnlyTwoOrLessPositionsLeft = function (elm) {
      return liftN([
        CaretFinder.firstPositionIn(elm),
        CaretFinder.lastPositionIn(elm),
      ], (firstPos, lastPos) => {
        const normalizedFirstPos = InlineUtils.normalizePosition(true, firstPos)
        const normalizedLastPos = InlineUtils.normalizePosition(false, lastPos)
        return CaretFinder.nextPosition(elm, normalizedFirstPos).map((pos) => pos.isEqual(normalizedLastPos)).getOr(true)
      }).getOr(true)
    }
    const setCaretLocation = function (editor, caret) {
      return function (location$$1) {
        return BoundaryCaret.renderCaret(caret, location$$1).map((pos) => {
          BoundarySelection.setCaretPosition(editor, pos)
          return true
        }).getOr(false)
      }
    }
    const deleteFromTo = function (editor, caret, from, to) {
      const rootNode = editor.getBody()
      const isInlineTarget = curry(InlineUtils.isInlineTarget, editor)
      editor.undoManager.ignore(() => {
        editor.selection.setRng(rangeFromPositions(from, to))
        editor.execCommand('Delete')
        BoundaryLocation.readLocation(isInlineTarget, rootNode, CaretPosition$1.fromRangeStart(editor.selection.getRng())).map(BoundaryLocation.inside).map(setCaretLocation(editor, caret))
      })
      editor.nodeChanged()
    }
    const rescope$1 = function (rootNode, node) {
      const parentBlock = getParentBlock(node, rootNode)
      return parentBlock || rootNode
    }
    const backspaceDeleteCollapsed = function (editor, caret, forward, from) {
      const rootNode = rescope$1(editor.getBody(), from.container())
      const isInlineTarget = curry(InlineUtils.isInlineTarget, editor)
      const fromLocation = BoundaryLocation.readLocation(isInlineTarget, rootNode, from)
      return fromLocation.bind((location$$1) => {
        if (forward) {
          return location$$1.fold(constant(Option.some(BoundaryLocation.inside(location$$1))), Option.none, constant(Option.some(BoundaryLocation.outside(location$$1))), Option.none)
        }
        return location$$1.fold(Option.none, constant(Option.some(BoundaryLocation.outside(location$$1))), Option.none, constant(Option.some(BoundaryLocation.inside(location$$1))))
      }).map(setCaretLocation(editor, caret)).getOrThunk(() => {
        const toPosition = CaretFinder.navigate(forward, rootNode, from)
        const toLocation = toPosition.bind((pos) => BoundaryLocation.readLocation(isInlineTarget, rootNode, pos))
        if (fromLocation.isSome() && toLocation.isSome()) {
          return InlineUtils.findRootInline(isInlineTarget, rootNode, from).map((elm) => {
            if (hasOnlyTwoOrLessPositionsLeft(elm)) {
              DeleteElement.deleteElement(editor, forward, Element$$1.fromDom(elm))
              return true
            }
            return false
          }).getOr(false)
        }
        return toLocation.bind((_) => toPosition.map((to) => {
          if (forward) {
            deleteFromTo(editor, caret, from, to)
          } else {
            deleteFromTo(editor, caret, to, from)
          }
          return true
        })).getOr(false)
      })
    }
    const backspaceDelete$3 = function (editor, caret, forward) {
      if (editor.selection.isCollapsed() && isFeatureEnabled$1(editor)) {
        const from = CaretPosition$1.fromRangeStart(editor.selection.getRng())
        return backspaceDeleteCollapsed(editor, caret, forward, from)
      }
      return false
    }
    const InlineBoundaryDelete = { backspaceDelete: backspaceDelete$3 }

    const getParentInlines = function (rootElm, startElm) {
      const parents$$1 = Parents.parentsAndSelf(startElm, rootElm)
      return findIndex(parents$$1, isBlock).fold(constant(parents$$1), (index) => parents$$1.slice(0, index))
    }
    const hasOnlyOneChild = function (elm) {
      return children(elm).length === 1
    }
    const deleteLastPosition = function (forward, editor, target, parentInlines) {
      const isFormatElement$$1 = curry(isFormatElement, editor)
      const formatNodes = map(filter(parentInlines, isFormatElement$$1), (elm) => elm.dom())
      if (formatNodes.length === 0) {
        DeleteElement.deleteElement(editor, forward, target)
      } else {
        const pos = replaceWithCaretFormat(target.dom(), formatNodes)
        editor.selection.setRng(pos.toRange())
      }
    }
    const deleteCaret = function (editor, forward) {
      const rootElm = Element$$1.fromDom(editor.getBody())
      const startElm = Element$$1.fromDom(editor.selection.getStart())
      const parentInlines = filter(getParentInlines(rootElm, startElm), hasOnlyOneChild)
      return last(parentInlines).map((target) => {
        const fromPos = CaretPosition$1.fromRangeStart(editor.selection.getRng())
        if (DeleteUtils.willDeleteLastPositionInElement(forward, fromPos, target.dom()) && !isEmptyCaretFormatElement(target)) {
          deleteLastPosition(forward, editor, target, parentInlines)
          return true
        }
        return false
      }).getOr(false)
    }
    const backspaceDelete$4 = function (editor, forward) {
      return editor.selection.isCollapsed() ? deleteCaret(editor, forward) : false
    }
    const InlineFormatDelete = { backspaceDelete: backspaceDelete$4 }

    const tableCellRng = Immutable('start', 'end')
    const tableSelection = Immutable('rng', 'table', 'cells')
    const deleteAction = Adt.generate([
      { removeTable: ['element'] },
      { emptyCells: ['cells'] },
    ])
    const isRootFromElement = function (root) {
      return curry(eq, root)
    }
    const getClosestCell$1 = function (container, isRoot) {
      return closest$1(Element$$1.fromDom(container), 'td,th', isRoot)
    }
    const getClosestTable = function (cell, isRoot) {
      return ancestor$1(cell, 'table', isRoot)
    }
    const isExpandedCellRng = function (cellRng) {
      return eq(cellRng.start(), cellRng.end()) === false
    }
    const getTableFromCellRng = function (cellRng, isRoot) {
      return getClosestTable(cellRng.start(), isRoot).bind((startParentTable) => getClosestTable(cellRng.end(), isRoot).bind((endParentTable) => eq(startParentTable, endParentTable) ? Option.some(startParentTable) : Option.none()))
    }
    const getTableCells = function (table) {
      return descendants$1(table, 'td,th')
    }
    const getCellRangeFromStartTable = function (cellRng, isRoot) {
      return getClosestTable(cellRng.start(), isRoot).bind((table) => last(getTableCells(table)).map((endCell) => tableCellRng(cellRng.start(), endCell)))
    }
    const partialSelection = function (isRoot, rng) {
      const startCell = getClosestCell$1(rng.startContainer, isRoot)
      const endCell = getClosestCell$1(rng.endContainer, isRoot)
      return rng.collapsed ? Option.none() : liftN([
        startCell,
        endCell,
      ], tableCellRng).fold(() => startCell.fold(() => endCell.bind((endCell) => getClosestTable(endCell, isRoot).bind((table) => head(getTableCells(table)).map((startCell) => tableCellRng(startCell, endCell)))), (startCell) => getClosestTable(startCell, isRoot).bind((table) => last(getTableCells(table)).map((endCell) => tableCellRng(startCell, endCell)))), (cellRng) => isWithinSameTable(isRoot, cellRng) ? Option.none() : getCellRangeFromStartTable(cellRng, isRoot))
    }
    var isWithinSameTable = function (isRoot, cellRng) {
      return getTableFromCellRng(cellRng, isRoot).isSome()
    }
    const getCellRng = function (rng, isRoot) {
      const startCell = getClosestCell$1(rng.startContainer, isRoot)
      const endCell = getClosestCell$1(rng.endContainer, isRoot)
      return liftN([
        startCell,
        endCell,
      ], tableCellRng).filter(isExpandedCellRng).filter((cellRng) => isWithinSameTable(isRoot, cellRng)).orThunk(() => partialSelection(isRoot, rng))
    }
    const getTableSelectionFromCellRng = function (cellRng, isRoot) {
      return getTableFromCellRng(cellRng, isRoot).map((table) => tableSelection(cellRng, table, getTableCells(table)))
    }
    const getTableSelectionFromRng = function (root, rng) {
      const isRoot = isRootFromElement(root)
      return getCellRng(rng, isRoot).bind((cellRng) => getTableSelectionFromCellRng(cellRng, isRoot))
    }
    const getCellIndex = function (cells, cell) {
      return findIndex(cells, (x) => eq(x, cell))
    }
    const getSelectedCells = function (tableSelection) {
      return liftN([
        getCellIndex(tableSelection.cells(), tableSelection.rng().start()),
        getCellIndex(tableSelection.cells(), tableSelection.rng().end()),
      ], (startIndex, endIndex) => tableSelection.cells().slice(startIndex, endIndex + 1))
    }
    const getAction = function (tableSelection) {
      return getSelectedCells(tableSelection).map((selected) => {
        const cells = tableSelection.cells()
        return selected.length === cells.length ? deleteAction.removeTable(tableSelection.table()) : deleteAction.emptyCells(selected)
      })
    }
    const getActionFromCells = function (cells) {
      return deleteAction.emptyCells(cells)
    }
    const getActionFromRange = function (root, rng) {
      return getTableSelectionFromRng(root, rng).bind(getAction)
    }
    const TableDeleteAction = {
      getActionFromRange,
      getActionFromCells,
    }

    const emptyCells = function (editor, cells) {
      each(cells, PaddingBr.fillWithPaddingBr)
      editor.selection.setCursorLocation(cells[0].dom(), 0)
      return true
    }
    const deleteTableElement = function (editor, table) {
      DeleteElement.deleteElement(editor, false, table)
      return true
    }
    const deleteCellRange = function (editor, rootElm, rng) {
      return TableDeleteAction.getActionFromRange(rootElm, rng).map((action) => action.fold(curry(deleteTableElement, editor), curry(emptyCells, editor)))
    }
    const deleteCaptionRange = function (editor, caption) {
      return emptyElement(editor, caption)
    }
    const deleteTableRange = function (editor, rootElm, rng, startElm) {
      return getParentCaption(rootElm, startElm).fold(() => deleteCellRange(editor, rootElm, rng), (caption) => deleteCaptionRange(editor, caption)).getOr(false)
    }
    const deleteRange$1 = function (editor, startElm) {
      const rootNode = Element$$1.fromDom(editor.getBody())
      const rng = editor.selection.getRng()
      const selectedCells = TableCellSelection.getCellsFromEditor(editor)
      return selectedCells.length !== 0 ? emptyCells(editor, selectedCells) : deleteTableRange(editor, rootNode, rng, startElm)
    }
    const getParentCell = function (rootElm, elm) {
      return find(Parents.parentsAndSelf(elm, rootElm), isTableCell)
    }
    var getParentCaption = function (rootElm, elm) {
      return find(Parents.parentsAndSelf(elm, rootElm), (elm) => name(elm) === 'caption')
    }
    const deleteBetweenCells = function (editor, rootElm, forward, fromCell, from) {
      return CaretFinder.navigate(forward, editor.getBody(), from).bind((to) => getParentCell(rootElm, Element$$1.fromDom(to.getNode())).map((toCell) => eq(toCell, fromCell) === false))
    }
    var emptyElement = function (editor, elm) {
      PaddingBr.fillWithPaddingBr(elm)
      editor.selection.setCursorLocation(elm.dom(), 0)
      return Option.some(true)
    }
    const isDeleteOfLastCharPos = function (fromCaption, forward, from, to) {
      return CaretFinder.firstPositionIn(fromCaption.dom()).bind((first) => CaretFinder.lastPositionIn(fromCaption.dom()).map((last$$1) => forward ? from.isEqual(first) && to.isEqual(last$$1) : from.isEqual(last$$1) && to.isEqual(first))).getOr(true)
    }
    const emptyCaretCaption = function (editor, elm) {
      return emptyElement(editor, elm)
    }
    const validateCaretCaption = function (rootElm, fromCaption, to) {
      return getParentCaption(rootElm, Element$$1.fromDom(to.getNode())).map((toCaption) => eq(toCaption, fromCaption) === false)
    }
    const deleteCaretInsideCaption = function (editor, rootElm, forward, fromCaption, from) {
      return CaretFinder.navigate(forward, editor.getBody(), from).bind((to) => isDeleteOfLastCharPos(fromCaption, forward, from, to) ? emptyCaretCaption(editor, fromCaption) : validateCaretCaption(rootElm, fromCaption, to)).or(Option.some(true))
    }
    const deleteCaretCells = function (editor, forward, rootElm, startElm) {
      const from = CaretPosition$1.fromRangeStart(editor.selection.getRng())
      return getParentCell(rootElm, startElm).bind((fromCell) => Empty.isEmpty(fromCell) ? emptyElement(editor, fromCell) : deleteBetweenCells(editor, rootElm, forward, fromCell, from))
    }
    const deleteCaretCaption = function (editor, forward, rootElm, fromCaption) {
      const from = CaretPosition$1.fromRangeStart(editor.selection.getRng())
      return Empty.isEmpty(fromCaption) ? emptyElement(editor, fromCaption) : deleteCaretInsideCaption(editor, rootElm, forward, fromCaption, from)
    }
    const deleteCaret$1 = function (editor, forward, startElm) {
      const rootElm = Element$$1.fromDom(editor.getBody())
      return getParentCaption(rootElm, startElm).fold(() => deleteCaretCells(editor, forward, rootElm, startElm), (fromCaption) => deleteCaretCaption(editor, forward, rootElm, fromCaption)).getOr(false)
    }
    const backspaceDelete$5 = function (editor, forward) {
      const startElm = Element$$1.fromDom(editor.selection.getStart(true))
      const cells = TableCellSelection.getCellsFromEditor(editor)
      return editor.selection.isCollapsed() && cells.length === 0 ? deleteCaret$1(editor, forward, startElm) : deleteRange$1(editor, startElm)
    }
    const TableDelete = { backspaceDelete: backspaceDelete$5 }

    const executeKeydownOverride$1 = function (editor, caret, evt) {
      MatchKeys.execute([
        {
          keyCode: VK.BACKSPACE,
          action: MatchKeys.action(CefDelete.backspaceDelete, editor, false),
        },
        {
          keyCode: VK.DELETE,
          action: MatchKeys.action(CefDelete.backspaceDelete, editor, true),
        },
        {
          keyCode: VK.BACKSPACE,
          action: MatchKeys.action(InlineBoundaryDelete.backspaceDelete, editor, caret, false),
        },
        {
          keyCode: VK.DELETE,
          action: MatchKeys.action(InlineBoundaryDelete.backspaceDelete, editor, caret, true),
        },
        {
          keyCode: VK.BACKSPACE,
          action: MatchKeys.action(TableDelete.backspaceDelete, editor, false),
        },
        {
          keyCode: VK.DELETE,
          action: MatchKeys.action(TableDelete.backspaceDelete, editor, true),
        },
        {
          keyCode: VK.BACKSPACE,
          action: MatchKeys.action(BlockRangeDelete.backspaceDelete, editor, false),
        },
        {
          keyCode: VK.DELETE,
          action: MatchKeys.action(BlockRangeDelete.backspaceDelete, editor, true),
        },
        {
          keyCode: VK.BACKSPACE,
          action: MatchKeys.action(BlockBoundaryDelete.backspaceDelete, editor, false),
        },
        {
          keyCode: VK.DELETE,
          action: MatchKeys.action(BlockBoundaryDelete.backspaceDelete, editor, true),
        },
        {
          keyCode: VK.BACKSPACE,
          action: MatchKeys.action(InlineFormatDelete.backspaceDelete, editor, false),
        },
        {
          keyCode: VK.DELETE,
          action: MatchKeys.action(InlineFormatDelete.backspaceDelete, editor, true),
        },
      ], evt).each((_) => {
        evt.preventDefault()
      })
    }
    const executeKeyupOverride = function (editor, evt) {
      MatchKeys.execute([
        {
          keyCode: VK.BACKSPACE,
          action: MatchKeys.action(CefDelete.paddEmptyElement, editor),
        },
        {
          keyCode: VK.DELETE,
          action: MatchKeys.action(CefDelete.paddEmptyElement, editor),
        },
      ], evt)
    }
    const setup$8 = function (editor, caret) {
      editor.on('keydown', (evt) => {
        if (evt.isDefaultPrevented() === false) {
          executeKeydownOverride$1(editor, caret, evt)
        }
      })
      editor.on('keyup', (evt) => {
        if (evt.isDefaultPrevented() === false) {
          executeKeyupOverride(editor, evt)
        }
      })
    }
    const DeleteBackspaceKeys = { setup: setup$8 }

    const firstNonWhiteSpaceNodeSibling = function (node) {
      while (node) {
        if (node.nodeType === 1 || node.nodeType === 3 && node.data && /[\r\n\s]/.test(node.data)) {
          return node
        }
        node = node.nextSibling
      }
    }
    const moveToCaretPosition = function (editor, root) {
      let walker; let node; let rng; let lastNode = root; let tempElm
      const { dom } = editor
      const moveCaretBeforeOnEnterElementsMap = editor.schema.getMoveCaretBeforeOnEnterElements()
      if (!root) {
        return
      }
      if (/^(LI|DT|DD)$/.test(root.nodeName)) {
        const firstChild = firstNonWhiteSpaceNodeSibling(root.firstChild)
        if (firstChild && /^(UL|OL|DL)$/.test(firstChild.nodeName)) {
          root.insertBefore(dom.doc.createTextNode('\xA0'), root.firstChild)
        }
      }
      rng = dom.createRng()
      root.normalize()
      if (root.hasChildNodes()) {
        walker = new TreeWalker(root, root)
        while (node = walker.current()) {
          if (NodeType.isText(node)) {
            rng.setStart(node, 0)
            rng.setEnd(node, 0)
            break
          }
          if (moveCaretBeforeOnEnterElementsMap[node.nodeName.toLowerCase()]) {
            rng.setStartBefore(node)
            rng.setEndBefore(node)
            break
          }
          lastNode = node
          node = walker.next()
        }
        if (!node) {
          rng.setStart(lastNode, 0)
          rng.setEnd(lastNode, 0)
        }
      } else if (NodeType.isBr(root)) {
        if (root.nextSibling && dom.isBlock(root.nextSibling)) {
          rng.setStartBefore(root)
          rng.setEndBefore(root)
        } else {
          rng.setStartAfter(root)
          rng.setEndAfter(root)
        }
      } else {
        rng.setStart(root, 0)
        rng.setEnd(root, 0)
      }
      editor.selection.setRng(rng)
      dom.remove(tempElm)
      editor.selection.scrollIntoView(root)
    }
    const getEditableRoot = function (dom, node) {
      const root = dom.getRoot()
      let parent, editableRoot
      parent = node
      while (parent !== root && dom.getContentEditable(parent) !== 'false') {
        if (dom.getContentEditable(parent) === 'true') {
          editableRoot = parent
        }
        parent = parent.parentNode
      }
      return parent !== root ? editableRoot : root
    }
    const getParentBlock$2 = function (editor) {
      return Option.from(editor.dom.getParent(editor.selection.getStart(true), editor.dom.isBlock))
    }
    const getParentBlockName = function (editor) {
      return getParentBlock$2(editor).fold(constant(''), (parentBlock) => parentBlock.nodeName.toUpperCase())
    }
    const isListItemParentBlock = function (editor) {
      return getParentBlock$2(editor).filter((elm) => isListItem(Element$$1.fromDom(elm))).isSome()
    }
    const NewLineUtils = {
      moveToCaretPosition,
      getEditableRoot,
      getParentBlock: getParentBlock$2,
      getParentBlockName,
      isListItemParentBlock,
    }

    const hasFirstChild = function (elm, name) {
      return elm.firstChild && elm.firstChild.nodeName === name
    }
    const hasParent$1 = function (elm, parentName) {
      return elm && elm.parentNode && elm.parentNode.nodeName === parentName
    }
    const isListBlock = function (elm) {
      return elm && /^(OL|UL|LI)$/.test(elm.nodeName)
    }
    const isNestedList = function (elm) {
      return isListBlock(elm) && isListBlock(elm.parentNode)
    }
    const getContainerBlock = function (containerBlock) {
      const containerBlockParent = containerBlock.parentNode
      if (/^(LI|DT|DD)$/.test(containerBlockParent.nodeName)) {
        return containerBlockParent
      }
      return containerBlock
    }
    const isFirstOrLastLi = function (containerBlock, parentBlock, first) {
      let node = containerBlock[first ? 'firstChild' : 'lastChild']
      while (node) {
        if (NodeType.isElement(node)) {
          break
        }
        node = node[first ? 'nextSibling' : 'previousSibling']
      }
      return node === parentBlock
    }
    const insert = function (editor, createNewBlock, containerBlock, parentBlock, newBlockName) {
      const { dom } = editor
      const rng = editor.selection.getRng()
      if (containerBlock === editor.getBody()) {
        return
      }
      if (isNestedList(containerBlock)) {
        newBlockName = 'LI'
      }
      let newBlock = newBlockName ? createNewBlock(newBlockName) : dom.create('BR')
      if (isFirstOrLastLi(containerBlock, parentBlock, true) && isFirstOrLastLi(containerBlock, parentBlock, false)) {
        if (hasParent$1(containerBlock, 'LI')) {
          dom.insertAfter(newBlock, getContainerBlock(containerBlock))
        } else {
          dom.replace(newBlock, containerBlock)
        }
      } else if (isFirstOrLastLi(containerBlock, parentBlock, true)) {
        if (hasParent$1(containerBlock, 'LI')) {
          dom.insertAfter(newBlock, getContainerBlock(containerBlock))
          newBlock.appendChild(dom.doc.createTextNode(' '))
          newBlock.appendChild(containerBlock)
        } else {
          containerBlock.parentNode.insertBefore(newBlock, containerBlock)
        }
      } else if (isFirstOrLastLi(containerBlock, parentBlock, false)) {
        dom.insertAfter(newBlock, getContainerBlock(containerBlock))
      } else {
        containerBlock = getContainerBlock(containerBlock)
        const tmpRng = rng.cloneRange()
        tmpRng.setStartAfter(parentBlock)
        tmpRng.setEndAfter(containerBlock)
        const fragment = tmpRng.extractContents()
        if (newBlockName === 'LI' && hasFirstChild(fragment, 'LI')) {
          newBlock = fragment.firstChild
          dom.insertAfter(fragment, containerBlock)
        } else {
          dom.insertAfter(fragment, containerBlock)
          dom.insertAfter(newBlock, containerBlock)
        }
      }
      dom.remove(parentBlock)
      NewLineUtils.moveToCaretPosition(editor, newBlock)
    }
    const InsertLi = { insert }

    const trimZwsp = function (fragment) {
      each(descendants(Element$$1.fromDom(fragment), isText), (text) => {
        const rawNode = text.dom()
        rawNode.nodeValue = Zwsp.trim(rawNode.nodeValue)
      })
    }
    const isEmptyAnchor = function (dom, elm) {
      return elm && elm.nodeName === 'A' && dom.isEmpty(elm)
    }
    const isTableCell$4 = function (node) {
      return node && /^(TD|TH|CAPTION)$/.test(node.nodeName)
    }
    const emptyBlock = function (elm) {
      elm.innerHTML = '<br data-mce-bogus="1">'
    }
    const containerAndSiblingName = function (container, nodeName) {
      return container.nodeName === nodeName || container.previousSibling && container.previousSibling.nodeName === nodeName
    }
    const canSplitBlock = function (dom, node) {
      return node && dom.isBlock(node) && !/^(TD|TH|CAPTION|FORM)$/.test(node.nodeName) && !/^(fixed|absolute)/i.test(node.style.position) && dom.getContentEditable(node) !== 'true'
    }
    const trimInlineElementsOnLeftSideOfBlock = function (dom, nonEmptyElementsMap, block) {
      let node = block
      const firstChilds = []
      let i
      if (!node) {
        return
      }
      while (node = node.firstChild) {
        if (dom.isBlock(node)) {
          return
        }
        if (NodeType.isElement(node) && !nonEmptyElementsMap[node.nodeName.toLowerCase()]) {
          firstChilds.push(node)
        }
      }
      i = firstChilds.length
      while (i--) {
        node = firstChilds[i]
        if (!node.hasChildNodes() || node.firstChild === node.lastChild && node.firstChild.nodeValue === '') {
          dom.remove(node)
        } else if (isEmptyAnchor(dom, node)) {
          dom.remove(node)
        }
      }
    }
    const normalizeZwspOffset = function (start, container, offset) {
      if (NodeType.isText(container) === false) {
        return offset
      } if (start) {
        return offset === 1 && container.data.charAt(offset - 1) === Zwsp.ZWSP ? 0 : offset
      }
      return offset === container.data.length - 1 && container.data.charAt(offset) === Zwsp.ZWSP ? container.data.length : offset
    }
    const includeZwspInRange = function (rng) {
      const newRng = rng.cloneRange()
      newRng.setStart(rng.startContainer, normalizeZwspOffset(true, rng.startContainer, rng.startOffset))
      newRng.setEnd(rng.endContainer, normalizeZwspOffset(false, rng.endContainer, rng.endOffset))
      return newRng
    }
    const trimLeadingLineBreaks = function (node) {
      do {
        if (NodeType.isText(node)) {
          node.nodeValue = node.nodeValue.replace(/^[\r\n]+/, '')
        }
        node = node.firstChild
      } while (node)
    }
    const getEditableRoot$1 = function (dom, node) {
      const root = dom.getRoot()
      let parent, editableRoot
      parent = node
      while (parent !== root && dom.getContentEditable(parent) !== 'false') {
        if (dom.getContentEditable(parent) === 'true') {
          editableRoot = parent
        }
        parent = parent.parentNode
      }
      return parent !== root ? editableRoot : root
    }
    const setForcedBlockAttrs = function (editor, node) {
      const forcedRootBlockName = Settings.getForcedRootBlock(editor)
      if (forcedRootBlockName && forcedRootBlockName.toLowerCase() === node.tagName.toLowerCase()) {
        editor.dom.setAttribs(node, Settings.getForcedRootBlockAttrs(editor))
      }
    }
    const wrapSelfAndSiblingsInDefaultBlock = function (editor, newBlockName, rng, container, offset) {
      let newBlock, parentBlock, startNode, node, next, rootBlockName
      const blockName = newBlockName || 'P'
      const { dom } = editor; const editableRoot = getEditableRoot$1(dom, container)
      parentBlock = dom.getParent(container, dom.isBlock)
      if (!parentBlock || !canSplitBlock(dom, parentBlock)) {
        parentBlock = parentBlock || editableRoot
        if (parentBlock === editor.getBody() || isTableCell$4(parentBlock)) {
          rootBlockName = parentBlock.nodeName.toLowerCase()
        } else {
          rootBlockName = parentBlock.parentNode.nodeName.toLowerCase()
        }
        if (!parentBlock.hasChildNodes()) {
          newBlock = dom.create(blockName)
          setForcedBlockAttrs(editor, newBlock)
          parentBlock.appendChild(newBlock)
          rng.setStart(newBlock, 0)
          rng.setEnd(newBlock, 0)
          return newBlock
        }
        node = container
        while (node.parentNode !== parentBlock) {
          node = node.parentNode
        }
        while (node && !dom.isBlock(node)) {
          startNode = node
          node = node.previousSibling
        }
        if (startNode && editor.schema.isValidChild(rootBlockName, blockName.toLowerCase())) {
          newBlock = dom.create(blockName)
          setForcedBlockAttrs(editor, newBlock)
          startNode.parentNode.insertBefore(newBlock, startNode)
          node = startNode
          while (node && !dom.isBlock(node)) {
            next = node.nextSibling
            newBlock.appendChild(node)
            node = next
          }
          rng.setStart(container, offset)
          rng.setEnd(container, offset)
        }
      }
      return container
    }
    const addBrToBlockIfNeeded = function (dom, block) {
      let lastChild
      block.normalize()
      lastChild = block.lastChild
      if (!lastChild || /^(left|right)$/gi.test(dom.getStyle(lastChild, 'float', true))) {
        dom.add(block, 'br')
      }
    }
    const insert$1 = function (editor, evt) {
      let tmpRng, editableRoot, container, offset, parentBlock, shiftKey
      let newBlock, fragment, containerBlock, parentBlockName, containerBlockName, newBlockName, isAfterLastNodeInContainer
      const { dom } = editor
      const { schema } = editor; const nonEmptyElementsMap = schema.getNonEmptyElements()
      const rng = editor.selection.getRng()
      const createNewBlock = function (name$$1) {
        let node = container; let block; let clonedNode; let caretNode
        const textInlineElements = schema.getTextInlineElements()
        if (name$$1 || parentBlockName === 'TABLE' || parentBlockName === 'HR') {
          block = dom.create(name$$1 || newBlockName)
          setForcedBlockAttrs(editor, block)
        } else {
          block = parentBlock.cloneNode(false)
        }
        caretNode = block
        if (Settings.shouldKeepStyles(editor) === false) {
          dom.setAttrib(block, 'style', null)
          dom.setAttrib(block, 'class', null)
        } else {
          do {
            if (textInlineElements[node.nodeName]) {
              if (isCaretNode(node)) {
                continue
              }
              clonedNode = node.cloneNode(false)
              dom.setAttrib(clonedNode, 'id', '')
              if (block.hasChildNodes()) {
                clonedNode.appendChild(block.firstChild)
                block.appendChild(clonedNode)
              } else {
                caretNode = clonedNode
                block.appendChild(clonedNode)
              }
            }
          } while ((node = node.parentNode) && node !== editableRoot)
        }
        emptyBlock(caretNode)
        return block
      }
      const isCaretAtStartOrEndOfBlock = function (start) {
        let walker, node, name$$1, normalizedOffset
        normalizedOffset = normalizeZwspOffset(start, container, offset)
        if (NodeType.isText(container) && (start ? normalizedOffset > 0 : normalizedOffset < container.nodeValue.length)) {
          return false
        }
        if (container.parentNode === parentBlock && isAfterLastNodeInContainer && !start) {
          return true
        }
        if (start && NodeType.isElement(container) && container === parentBlock.firstChild) {
          return true
        }
        if (containerAndSiblingName(container, 'TABLE') || containerAndSiblingName(container, 'HR')) {
          return isAfterLastNodeInContainer && !start || !isAfterLastNodeInContainer && start
        }
        walker = new TreeWalker(container, parentBlock)
        if (NodeType.isText(container)) {
          if (start && normalizedOffset === 0) {
            walker.prev()
          } else if (!start && normalizedOffset === container.nodeValue.length) {
            walker.next()
          }
        }
        while (node = walker.current()) {
          if (NodeType.isElement(node)) {
            if (!node.getAttribute('data-mce-bogus')) {
              name$$1 = node.nodeName.toLowerCase()
              if (nonEmptyElementsMap[name$$1] && name$$1 !== 'br') {
                return false
              }
            }
          } else if (NodeType.isText(node) && !/^[ \t\r\n]*$/.test(node.nodeValue)) {
            return false
          }
          if (start) {
            walker.prev()
          } else {
            walker.next()
          }
        }
        return true
      }
      const insertNewBlockAfter = function () {
        if (/^(H[1-6]|PRE|FIGURE)$/.test(parentBlockName) && containerBlockName !== 'HGROUP') {
          newBlock = createNewBlock(newBlockName)
        } else {
          newBlock = createNewBlock()
        }
        if (Settings.shouldEndContainerOnEmptyBlock(editor) && canSplitBlock(dom, containerBlock) && dom.isEmpty(parentBlock)) {
          newBlock = dom.split(containerBlock, parentBlock)
        } else {
          dom.insertAfter(newBlock, parentBlock)
        }
        NewLineUtils.moveToCaretPosition(editor, newBlock)
      }
      NormalizeRange.normalize(dom, rng).each((normRng) => {
        rng.setStart(normRng.startContainer, normRng.startOffset)
        rng.setEnd(normRng.endContainer, normRng.endOffset)
      })
      container = rng.startContainer
      offset = rng.startOffset
      newBlockName = Settings.getForcedRootBlock(editor)
      shiftKey = evt.shiftKey
      if (NodeType.isElement(container) && container.hasChildNodes()) {
        isAfterLastNodeInContainer = offset > container.childNodes.length - 1
        container = container.childNodes[Math.min(offset, container.childNodes.length - 1)] || container
        if (isAfterLastNodeInContainer && NodeType.isText(container)) {
          offset = container.nodeValue.length
        } else {
          offset = 0
        }
      }
      editableRoot = getEditableRoot$1(dom, container)
      if (!editableRoot) {
        return
      }
      if (newBlockName && !shiftKey || !newBlockName && shiftKey) {
        container = wrapSelfAndSiblingsInDefaultBlock(editor, newBlockName, rng, container, offset)
      }
      parentBlock = dom.getParent(container, dom.isBlock)
      containerBlock = parentBlock ? dom.getParent(parentBlock.parentNode, dom.isBlock) : null
      parentBlockName = parentBlock ? parentBlock.nodeName.toUpperCase() : ''
      containerBlockName = containerBlock ? containerBlock.nodeName.toUpperCase() : ''
      if (containerBlockName === 'LI' && !evt.ctrlKey) {
        parentBlock = containerBlock
        containerBlock = containerBlock.parentNode
        parentBlockName = containerBlockName
      }
      if (/^(LI|DT|DD)$/.test(parentBlockName)) {
        if (dom.isEmpty(parentBlock)) {
          InsertLi.insert(editor, createNewBlock, containerBlock, parentBlock, newBlockName)
          return
        }
      }
      if (newBlockName && parentBlock === editor.getBody()) {
        return
      }
      newBlockName = newBlockName || 'P'
      if (isCaretContainerBlock(parentBlock)) {
        newBlock = showCaretContainerBlock(parentBlock)
        if (dom.isEmpty(parentBlock)) {
          emptyBlock(parentBlock)
        }
        NewLineUtils.moveToCaretPosition(editor, newBlock)
      } else if (isCaretAtStartOrEndOfBlock()) {
        insertNewBlockAfter()
      } else if (isCaretAtStartOrEndOfBlock(true)) {
        newBlock = parentBlock.parentNode.insertBefore(createNewBlock(), parentBlock)
        NewLineUtils.moveToCaretPosition(editor, containerAndSiblingName(parentBlock, 'HR') ? newBlock : parentBlock)
      } else {
        tmpRng = includeZwspInRange(rng).cloneRange()
        tmpRng.setEndAfter(parentBlock)
        fragment = tmpRng.extractContents()
        trimZwsp(fragment)
        trimLeadingLineBreaks(fragment)
        newBlock = fragment.firstChild
        dom.insertAfter(fragment, parentBlock)
        trimInlineElementsOnLeftSideOfBlock(dom, nonEmptyElementsMap, newBlock)
        addBrToBlockIfNeeded(dom, parentBlock)
        if (dom.isEmpty(parentBlock)) {
          emptyBlock(parentBlock)
        }
        newBlock.normalize()
        if (dom.isEmpty(newBlock)) {
          dom.remove(newBlock)
          insertNewBlockAfter()
        } else {
          NewLineUtils.moveToCaretPosition(editor, newBlock)
        }
      }
      dom.setAttrib(newBlock, 'id', '')
      editor.fire('NewBlock', { newBlock })
    }
    const InsertBlock = { insert: insert$1 }

    const hasRightSideContent = function (schema, container, parentBlock) {
      const walker = new TreeWalker(container, parentBlock)
      let node
      const nonEmptyElementsMap = schema.getNonEmptyElements()
      while (node = walker.next()) {
        if (nonEmptyElementsMap[node.nodeName.toLowerCase()] || node.length > 0) {
          return true
        }
      }
    }
    const scrollToBr = function (dom, selection, brElm) {
      const marker = dom.create('span', {}, '&nbsp;')
      brElm.parentNode.insertBefore(marker, brElm)
      selection.scrollIntoView(marker)
      dom.remove(marker)
    }
    const moveSelectionToBr = function (dom, selection, brElm, extraBr) {
      const rng = dom.createRng()
      if (!extraBr) {
        rng.setStartAfter(brElm)
        rng.setEndAfter(brElm)
      } else {
        rng.setStartBefore(brElm)
        rng.setEndBefore(brElm)
      }
      selection.setRng(rng)
    }
    const insertBrAtCaret = function (editor, evt) {
      const { selection } = editor; const { dom } = editor
      let brElm, extraBr
      const rng = selection.getRng()
      NormalizeRange.normalize(dom, rng).each((normRng) => {
        rng.setStart(normRng.startContainer, normRng.startOffset)
        rng.setEnd(normRng.endContainer, normRng.endOffset)
      })
      let offset = rng.startOffset
      let container = rng.startContainer
      if (container.nodeType === 1 && container.hasChildNodes()) {
        const isAfterLastNodeInContainer = offset > container.childNodes.length - 1
        container = container.childNodes[Math.min(offset, container.childNodes.length - 1)] || container
        if (isAfterLastNodeInContainer && container.nodeType === 3) {
          offset = container.nodeValue.length
        } else {
          offset = 0
        }
      }
      let parentBlock = dom.getParent(container, dom.isBlock)
      const containerBlock = parentBlock ? dom.getParent(parentBlock.parentNode, dom.isBlock) : null
      const containerBlockName = containerBlock ? containerBlock.nodeName.toUpperCase() : ''
      const isControlKey = evt && evt.ctrlKey
      if (containerBlockName === 'LI' && !isControlKey) {
        parentBlock = containerBlock
      }
      if (container && container.nodeType === 3 && offset >= container.nodeValue.length) {
        if (!hasRightSideContent(editor.schema, container, parentBlock)) {
          brElm = dom.create('br')
          rng.insertNode(brElm)
          rng.setStartAfter(brElm)
          rng.setEndAfter(brElm)
          extraBr = true
        }
      }
      brElm = dom.create('br')
      rng.insertNode(brElm)
      scrollToBr(dom, selection, brElm)
      moveSelectionToBr(dom, selection, brElm, extraBr)
      editor.undoManager.add()
    }
    const insertBrBefore = function (editor, inline) {
      const br = Element$$1.fromTag('br')
      before(Element$$1.fromDom(inline), br)
      editor.undoManager.add()
    }
    const insertBrAfter = function (editor, inline) {
      if (!hasBrAfter(editor.getBody(), inline)) {
        after(Element$$1.fromDom(inline), Element$$1.fromTag('br'))
      }
      const br = Element$$1.fromTag('br')
      after(Element$$1.fromDom(inline), br)
      scrollToBr(editor.dom, editor.selection, br.dom())
      moveSelectionToBr(editor.dom, editor.selection, br.dom(), false)
      editor.undoManager.add()
    }
    const isBeforeBr$1 = function (pos) {
      return NodeType.isBr(pos.getNode())
    }
    var hasBrAfter = function (rootNode, startNode) {
      if (isBeforeBr$1(CaretPosition$1.after(startNode))) {
        return true
      }
      return CaretFinder.nextPosition(rootNode, CaretPosition$1.after(startNode)).map((pos) => NodeType.isBr(pos.getNode())).getOr(false)
    }
    const isAnchorLink = function (elm) {
      return elm && elm.nodeName === 'A' && 'href' in elm
    }
    const isInsideAnchor = function (location) {
      return location.fold(constant(false), isAnchorLink, isAnchorLink, constant(false))
    }
    const readInlineAnchorLocation = function (editor) {
      const isInlineTarget = curry(InlineUtils.isInlineTarget, editor)
      const position = CaretPosition$1.fromRangeStart(editor.selection.getRng())
      return BoundaryLocation.readLocation(isInlineTarget, editor.getBody(), position).filter(isInsideAnchor)
    }
    const insertBrOutsideAnchor = function (editor, location) {
      location.fold(noop, curry(insertBrBefore, editor), curry(insertBrAfter, editor), noop)
    }
    const insert$2 = function (editor, evt) {
      const anchorLocation = readInlineAnchorLocation(editor)
      if (anchorLocation.isSome()) {
        anchorLocation.each(curry(insertBrOutsideAnchor, editor))
      } else {
        insertBrAtCaret(editor, evt)
      }
    }
    const InsertBr = { insert: insert$2 }

    const matchesSelector = function (editor, selector) {
      return NewLineUtils.getParentBlock(editor).filter((parentBlock) => selector.length > 0 && is$1(Element$$1.fromDom(parentBlock), selector)).isSome()
    }
    const shouldInsertBr = function (editor) {
      return matchesSelector(editor, Settings.getBrNewLineSelector(editor))
    }
    const shouldBlockNewLine = function (editor) {
      return matchesSelector(editor, Settings.getNoNewLineSelector(editor))
    }
    const ContextSelectors = {
      shouldInsertBr,
      shouldBlockNewLine,
    }

    const newLineAction = Adt.generate([
      { br: [] },
      { block: [] },
      { none: [] },
    ])
    const shouldBlockNewLine$1 = function (editor, shiftKey) {
      return ContextSelectors.shouldBlockNewLine(editor)
    }
    const isBrMode = function (requiredState) {
      return function (editor, shiftKey) {
        const brMode = Settings.getForcedRootBlock(editor) === ''
        return brMode === requiredState
      }
    }
    const inListBlock = function (requiredState) {
      return function (editor, shiftKey) {
        return NewLineUtils.isListItemParentBlock(editor) === requiredState
      }
    }
    const inBlock = function (blockName, requiredState) {
      return function (editor, shiftKey) {
        const state = NewLineUtils.getParentBlockName(editor) === blockName.toUpperCase()
        return state === requiredState
      }
    }
    const inPreBlock = function (requiredState) {
      return inBlock('pre', requiredState)
    }
    const inSummaryBlock = function () {
      return inBlock('summary', true)
    }
    const shouldPutBrInPre$1 = function (requiredState) {
      return function (editor, shiftKey) {
        return Settings.shouldPutBrInPre(editor) === requiredState
      }
    }
    const inBrContext = function (editor, shiftKey) {
      return ContextSelectors.shouldInsertBr(editor)
    }
    const hasShiftKey = function (editor, shiftKey) {
      return shiftKey
    }
    const canInsertIntoEditableRoot = function (editor) {
      const forcedRootBlock = Settings.getForcedRootBlock(editor)
      const rootEditable = NewLineUtils.getEditableRoot(editor.dom, editor.selection.getStart())
      return rootEditable && editor.schema.isValidChild(rootEditable.nodeName, forcedRootBlock || 'P')
    }
    const match$2 = function (predicates, action) {
      return function (editor, shiftKey) {
        const isMatch = foldl(predicates, (res, p) => res && p(editor, shiftKey), true)
        return isMatch ? Option.some(action) : Option.none()
      }
    }
    const getAction$1 = function (editor, evt) {
      return LazyEvaluator.evaluateUntil([
        match$2([shouldBlockNewLine$1], newLineAction.none()),
        match$2([inSummaryBlock()], newLineAction.br()),
        match$2([
          inPreBlock(true),
          shouldPutBrInPre$1(false),
          hasShiftKey,
        ], newLineAction.br()),
        match$2([
          inPreBlock(true),
          shouldPutBrInPre$1(false),
        ], newLineAction.block()),
        match$2([
          inPreBlock(true),
          shouldPutBrInPre$1(true),
          hasShiftKey,
        ], newLineAction.block()),
        match$2([
          inPreBlock(true),
          shouldPutBrInPre$1(true),
        ], newLineAction.br()),
        match$2([
          inListBlock(true),
          hasShiftKey,
        ], newLineAction.br()),
        match$2([inListBlock(true)], newLineAction.block()),
        match$2([
          isBrMode(true),
          hasShiftKey,
          canInsertIntoEditableRoot,
        ], newLineAction.block()),
        match$2([isBrMode(true)], newLineAction.br()),
        match$2([inBrContext], newLineAction.br()),
        match$2([
          isBrMode(false),
          hasShiftKey,
        ], newLineAction.br()),
        match$2([canInsertIntoEditableRoot], newLineAction.block()),
      ], [
        editor,
        evt.shiftKey,
      ]).getOr(newLineAction.none())
    }
    const NewLineAction = { getAction: getAction$1 }

    const insert$3 = function (editor, evt) {
      NewLineAction.getAction(editor, evt).fold(() => {
        InsertBr.insert(editor, evt)
      }, () => {
        InsertBlock.insert(editor, evt)
      }, noop)
    }
    const InsertNewLine = { insert: insert$3 }

    const endTypingLevel = function (undoManager) {
      if (undoManager.typing) {
        undoManager.typing = false
        undoManager.add()
      }
    }
    const handleEnterKeyEvent = function (editor, event) {
      if (event.isDefaultPrevented()) {
        return
      }
      event.preventDefault()
      endTypingLevel(editor.undoManager)
      editor.undoManager.transact(() => {
        if (editor.selection.isCollapsed() === false) {
          editor.execCommand('Delete')
        }
        InsertNewLine.insert(editor, event)
      })
    }
    const setup$9 = function (editor) {
      editor.on('keydown', (event) => {
        if (event.keyCode === VK.ENTER) {
          handleEnterKeyEvent(editor, event)
        }
      })
    }
    const EnterKey = { setup: setup$9 }

    const insertTextAtPosition = function (text, pos) {
      const container = pos.container()
      const offset = pos.offset()
      if (NodeType.isText(container)) {
        container.insertData(offset, text)
        return Option.some(CaretPosition(container, offset + text.length))
      }
      return getElementFromPosition(pos).map((elm) => {
        const textNode = Element$$1.fromText(text)
        if (pos.isAtEnd()) {
          after(elm, textNode)
        } else {
          before(elm, textNode)
        }
        return CaretPosition(textNode.dom(), text.length)
      })
    }
    const insertNbspAtPosition = curry(insertTextAtPosition, '\xA0')
    const insertSpaceAtPosition = curry(insertTextAtPosition, ' ')

    const isAtBlockBoundary = function (forward, root, pos) {
      const parentBlocks = filter(Parents.parentsAndSelf(Element$$1.fromDom(pos.container()), root), isBlock)
      return head(parentBlocks).fold(() => CaretFinder.navigate(forward, root.dom(), pos).forall((newPos) => isInSameBlock(newPos, pos, root.dom()) === false), (parent) => CaretFinder.navigate(forward, parent.dom(), pos).isNone())
    }
    const isAtStartOfBlock = curry(isAtBlockBoundary, false)
    const isAtEndOfBlock = curry(isAtBlockBoundary, true)

    const nbsp = '\xA0'
    const isInMiddleOfText = function (pos) {
      return CaretPosition.isTextPosition(pos) && !pos.isAtStart() && !pos.isAtEnd()
    }
    const getClosestBlock = function (root, pos) {
      const parentBlocks = filter(Parents.parentsAndSelf(Element$$1.fromDom(pos.container()), root), isBlock)
      return head(parentBlocks).getOr(root)
    }
    const hasSpaceBefore = function (root, pos) {
      if (isInMiddleOfText(pos)) {
        return isAfterSpace(pos)
      }
      return isAfterSpace(pos) || CaretFinder.prevPosition(getClosestBlock(root, pos).dom(), pos).exists(isAfterSpace)
    }
    const hasSpaceAfter = function (root, pos) {
      if (isInMiddleOfText(pos)) {
        return isBeforeSpace(pos)
      }
      return isBeforeSpace(pos) || CaretFinder.nextPosition(getClosestBlock(root, pos).dom(), pos).exists(isBeforeSpace)
    }
    const isPreValue = function (value$$1) {
      return contains([
        'pre',
        'pre-line',
        'pre-wrap',
      ], value$$1)
    }
    const isInPre = function (pos) {
      return getElementFromPosition(pos).bind((elm) => closest(elm, isElement)).exists((elm) => isPreValue(get$2(elm, 'white-space')))
    }
    const isAtBeginningOfBody = function (root, pos) {
      return CaretFinder.prevPosition(root.dom(), pos).isNone()
    }
    const isAtEndOfBody = function (root, pos) {
      return CaretFinder.nextPosition(root.dom(), pos).isNone()
    }
    const isAtLineBoundary = function (root, pos) {
      return isAtBeginningOfBody(root, pos) || isAtEndOfBody(root, pos) || isAtStartOfBlock(root, pos) || isAtEndOfBlock(root, pos) || isAfterBr(root, pos) || isBeforeBr(root, pos)
    }
    const needsToHaveNbsp = function (root, pos) {
      if (isInPre(pos)) {
        return false
      }
      return isAtLineBoundary(root, pos) || hasSpaceBefore(root, pos) || hasSpaceAfter(root, pos)
    }
    const needsToBeNbspLeft = function (root, pos) {
      if (isInPre(pos)) {
        return false
      }
      return isAtStartOfBlock(root, pos) || isAfterBr(root, pos) || hasSpaceBefore(root, pos)
    }
    const needsToBeNbspRight = function (root, pos) {
      if (isInPre(pos)) {
        return false
      }
      return isAtEndOfBlock(root, pos) || isBeforeBr(root, pos) || hasSpaceAfter(root, pos)
    }
    const isNbspAt = function (text, offset) {
      return isNbsp(text.charAt(offset))
    }
    const hasNbsp = function (pos) {
      const container = pos.container()
      return NodeType.isText(container) && contains$2(container.data, nbsp)
    }
    const normalizeNbspAtStart = function (root, node, text) {
      const firstPos = CaretPosition(node, 0)
      if (isNbspAt(text, 0) && !needsToBeNbspLeft(root, firstPos)) {
        return ` ${text.slice(1)}`
      }
      return text
    }
    const normalizeNbspMiddle = function (text) {
      return map(text.split(''), (chr, i, chars) => {
        if (isNbsp(chr) && i > 0 && i < chars.length - 1 && isContent(chars[i - 1]) && isContent(chars[i + 1])) {
          return ' '
        }
        return chr
      }).join('')
    }
    const normalizeNbspAtEnd = function (root, node, text) {
      const lastPos = CaretPosition(node, text.length)
      if (isNbspAt(text, text.length - 1) && !needsToBeNbspRight(root, lastPos)) {
        return `${text.slice(0, -1)} `
      }
      return text
    }
    const normalizeNbsps = function (root, pos) {
      return Option.some(pos).filter(hasNbsp).bind((pos) => {
        const container = pos.container()
        const text = container.nodeValue
        const newText = normalizeNbspAtStart(root, container, normalizeNbspMiddle(normalizeNbspAtEnd(root, container, text)))
        if (text !== newText) {
          pos.container().nodeValue = newText
          return Option.some(pos)
        }
        return Option.none()
      })
    }
    const normalizeNbspsInEditor = function (editor) {
      const root = Element$$1.fromDom(editor.getBody())
      if (editor.selection.isCollapsed()) {
        normalizeNbsps(root, CaretPosition.fromRangeStart(editor.selection.getRng())).each((pos) => {
          editor.selection.setRng(pos.toRange())
        })
      }
    }

    const locationToCaretPosition = function (root) {
      return function (location) {
        return location.fold((element) => CaretFinder.prevPosition(root.dom(), CaretPosition$1.before(element)), (element) => CaretFinder.firstPositionIn(element), (element) => CaretFinder.lastPositionIn(element), (element) => CaretFinder.nextPosition(root.dom(), CaretPosition$1.after(element)))
      }
    }
    const insertInlineBoundarySpaceOrNbsp = function (root, pos) {
      return function (checkPos) {
        return needsToHaveNbsp(root, checkPos) ? insertNbspAtPosition(pos) : insertSpaceAtPosition(pos)
      }
    }
    const setSelection$1 = function (editor) {
      return function (pos) {
        editor.selection.setRng(pos.toRange())
        editor.nodeChanged()
        return true
      }
    }
    const insertSpaceOrNbspAtSelection = function (editor) {
      const pos = CaretPosition$1.fromRangeStart(editor.selection.getRng())
      const root = Element$$1.fromDom(editor.getBody())
      if (editor.selection.isCollapsed()) {
        const isInlineTarget = curry(InlineUtils.isInlineTarget, editor)
        const caretPosition = CaretPosition$1.fromRangeStart(editor.selection.getRng())
        return BoundaryLocation.readLocation(isInlineTarget, editor.getBody(), caretPosition).bind(locationToCaretPosition(root)).bind(insertInlineBoundarySpaceOrNbsp(root, pos)).exists(setSelection$1(editor))
      }
      return false
    }

    const executeKeydownOverride$2 = function (editor, evt) {
      MatchKeys.execute([{
        keyCode: VK.SPACEBAR,
        action: MatchKeys.action(insertSpaceOrNbspAtSelection, editor),
      }], evt).each((_) => {
        evt.preventDefault()
      })
    }
    const setup$a = function (editor) {
      editor.on('keydown', (evt) => {
        if (evt.isDefaultPrevented() === false) {
          executeKeydownOverride$2(editor, evt)
        }
      })
    }
    const SpaceKey = { setup: setup$a }

    const findBlockCaretContainer = function (editor) {
      return descendant$1(Element$$1.fromDom(editor.getBody()), '*[data-mce-caret]').fold(constant(null), (elm) => elm.dom())
    }
    const removeIeControlRect = function (editor) {
      editor.selection.setRng(editor.selection.getRng())
    }
    const showBlockCaretContainer = function (editor, blockCaretContainer) {
      if (blockCaretContainer.hasAttribute('data-mce-caret')) {
        showCaretContainerBlock(blockCaretContainer)
        removeIeControlRect(editor)
        editor.selection.scrollIntoView(blockCaretContainer)
      }
    }
    const handleBlockContainer = function (editor, e) {
      const blockCaretContainer = findBlockCaretContainer(editor)
      if (!blockCaretContainer) {
        return
      }
      if (e.type === 'compositionstart') {
        e.preventDefault()
        e.stopPropagation()
        showBlockCaretContainer(editor, blockCaretContainer)
        return
      }
      if (hasContent(blockCaretContainer)) {
        showBlockCaretContainer(editor, blockCaretContainer)
        editor.undoManager.add()
      }
    }
    const setup$b = function (editor) {
      editor.on('keyup compositionstart', curry(handleBlockContainer, editor))
    }
    const CaretContainerInput = { setup: setup$b }

    const browser$4 = PlatformDetection$1.detect().browser
    const setupIeInput = function (editor) {
      const keypressThrotter = first$1(() => {
        if (!editor.composing) {
          normalizeNbspsInEditor(editor)
        }
      }, 0)
      if (browser$4.isIE()) {
        editor.on('keypress', (e) => {
          keypressThrotter.throttle()
        })
        editor.on('remove', (e) => {
          keypressThrotter.cancel()
        })
      }
    }
    const setup$c = function (editor) {
      setupIeInput(editor)
      editor.on('input', (e) => {
        if (e.isComposing === false) {
          normalizeNbspsInEditor(editor)
        }
      })
    }

    const setup$d = function (editor) {
      const caret = BoundarySelection.setupSelectedState(editor)
      CaretContainerInput.setup(editor)
      ArrowKeys.setup(editor, caret)
      DeleteBackspaceKeys.setup(editor, caret)
      EnterKey.setup(editor)
      SpaceKey.setup(editor)
      setup$c(editor)
    }
    const KeyboardOverrides = { setup: setup$d }

    function Quirks(editor) {
      const { each } = Tools
      const { BACKSPACE } = VK; const { DELETE } = VK; const { dom } = editor; const { selection } = editor; const { settings } = editor; const { parser } = editor
      const isGecko = Env.gecko; const isIE = Env.ie; const isWebKit = Env.webkit
      const mceInternalUrlPrefix = 'data:text/mce-internal,'
      const mceInternalDataType = isIE ? 'Text' : 'URL'
      const setEditorCommandState = function (cmd, state) {
        try {
          editor.getDoc().execCommand(cmd, false, state)
        } catch (ex) {
        }
      }
      const isDefaultPrevented = function (e) {
        return e.isDefaultPrevented()
      }
      const setMceInternalContent = function (e) {
        let selectionHtml, internalContent
        if (e.dataTransfer) {
          if (editor.selection.isCollapsed() && e.target.tagName === 'IMG') {
            selection.select(e.target)
          }
          selectionHtml = editor.selection.getContent()
          if (selectionHtml.length > 0) {
            internalContent = `${mceInternalUrlPrefix + escape(editor.id)},${escape(selectionHtml)}`
            e.dataTransfer.setData(mceInternalDataType, internalContent)
          }
        }
      }
      const getMceInternalContent = function (e) {
        let internalContent
        if (e.dataTransfer) {
          internalContent = e.dataTransfer.getData(mceInternalDataType)
          if (internalContent && internalContent.indexOf(mceInternalUrlPrefix) >= 0) {
            internalContent = internalContent.substr(mceInternalUrlPrefix.length).split(',')
            return {
              id: unescape(internalContent[0]),
              html: unescape(internalContent[1]),
            }
          }
        }
        return null
      }
      const insertClipboardContents = function (content, internal) {
        if (editor.queryCommandSupported('mceInsertClipboardContent')) {
          editor.execCommand('mceInsertClipboardContent', false, {
            content,
            internal,
          })
        } else {
          editor.execCommand('mceInsertContent', false, content)
        }
      }
      const emptyEditorWhenDeleting = function () {
        const serializeRng = function (rng) {
          const body = dom.create('body')
          const contents = rng.cloneContents()
          body.appendChild(contents)
          return selection.serializer.serialize(body, { format: 'html' })
        }
        const allContentsSelected = function (rng) {
          const selection = serializeRng(rng)
          const allRng = dom.createRng()
          allRng.selectNode(editor.getBody())
          const allSelection = serializeRng(allRng)
          return selection === allSelection
        }
        editor.on('keydown', (e) => {
          const { keyCode } = e
          let isCollapsed, body
          if (!isDefaultPrevented(e) && (keyCode === DELETE || keyCode === BACKSPACE)) {
            isCollapsed = editor.selection.isCollapsed()
            body = editor.getBody()
            if (isCollapsed && !dom.isEmpty(body)) {
              return
            }
            if (!isCollapsed && !allContentsSelected(editor.selection.getRng())) {
              return
            }
            e.preventDefault()
            editor.setContent('')
            if (body.firstChild && dom.isBlock(body.firstChild)) {
              editor.selection.setCursorLocation(body.firstChild, 0)
            } else {
              editor.selection.setCursorLocation(body, 0)
            }
            editor.nodeChanged()
          }
        })
      }
      const selectAll = function () {
        editor.shortcuts.add('meta+a', null, 'SelectAll')
      }
      const inputMethodFocus = function () {
        if (!editor.inline) {
          dom.bind(editor.getDoc(), 'mousedown mouseup', (e) => {
            let rng
            if (e.target === editor.getDoc().documentElement) {
              rng = selection.getRng()
              editor.getBody().focus()
              if (e.type === 'mousedown') {
                if (isCaretContainer(rng.startContainer)) {
                  return
                }
                selection.placeCaretAt(e.clientX, e.clientY)
              } else {
                selection.setRng(rng)
              }
            }
          })
        }
      }
      const removeHrOnBackspace = function () {
        editor.on('keydown', (e) => {
          if (!isDefaultPrevented(e) && e.keyCode === BACKSPACE) {
            if (!editor.getBody().getElementsByTagName('hr').length) {
              return
            }
            if (selection.isCollapsed() && selection.getRng().startOffset === 0) {
              const node = selection.getNode()
              const { previousSibling } = node
              if (node.nodeName === 'HR') {
                dom.remove(node)
                e.preventDefault()
                return
              }
              if (previousSibling && previousSibling.nodeName && previousSibling.nodeName.toLowerCase() === 'hr') {
                dom.remove(previousSibling)
                e.preventDefault()
              }
            }
          }
        })
      }
      const focusBody = function () {
        if (!Range.prototype.getClientRects) {
          editor.on('mousedown', (e) => {
            if (!isDefaultPrevented(e) && e.target.nodeName === 'HTML') {
              const body_1 = editor.getBody()
              body_1.blur()
              Delay.setEditorTimeout(editor, () => {
                body_1.focus()
              })
            }
          })
        }
      }
      const selectControlElements = function () {
        editor.on('click', (e) => {
          const { target } = e
          if (/^(IMG|HR)$/.test(target.nodeName) && dom.getContentEditableParent(target) !== 'false') {
            e.preventDefault()
            editor.selection.select(target)
            editor.nodeChanged()
          }
          if (target.nodeName === 'A' && dom.hasClass(target, 'mce-item-anchor')) {
            e.preventDefault()
            selection.select(target)
          }
        })
      }
      const removeStylesWhenDeletingAcrossBlockElements = function () {
        const getAttributeApplyFunction = function () {
          const template = dom.getAttribs(selection.getStart().cloneNode(false))
          return function () {
            const target = selection.getStart()
            if (target !== editor.getBody()) {
              dom.setAttrib(target, 'style', null)
              each(template, (attr) => {
                target.setAttributeNode(attr.cloneNode(true))
              })
            }
          }
        }
        const isSelectionAcrossElements = function () {
          return !selection.isCollapsed() && dom.getParent(selection.getStart(), dom.isBlock) !== dom.getParent(selection.getEnd(), dom.isBlock)
        }
        editor.on('keypress', (e) => {
          let applyAttributes
          if (!isDefaultPrevented(e) && (e.keyCode === 8 || e.keyCode === 46) && isSelectionAcrossElements()) {
            applyAttributes = getAttributeApplyFunction()
            editor.getDoc().execCommand('delete', false, null)
            applyAttributes()
            e.preventDefault()
            return false
          }
        })
        dom.bind(editor.getDoc(), 'cut', (e) => {
          let applyAttributes
          if (!isDefaultPrevented(e) && isSelectionAcrossElements()) {
            applyAttributes = getAttributeApplyFunction()
            Delay.setEditorTimeout(editor, () => {
              applyAttributes()
            })
          }
        })
      }
      const disableBackspaceIntoATable = function () {
        editor.on('keydown', (e) => {
          if (!isDefaultPrevented(e) && e.keyCode === BACKSPACE) {
            if (selection.isCollapsed() && selection.getRng().startOffset === 0) {
              const { previousSibling } = selection.getNode()
              if (previousSibling && previousSibling.nodeName && previousSibling.nodeName.toLowerCase() === 'table') {
                e.preventDefault()
                return false
              }
            }
          }
        })
      }
      const removeBlockQuoteOnBackSpace = function () {
        editor.on('keydown', (e) => {
          let rng, container, offset, root, parent$$1
          if (isDefaultPrevented(e) || e.keyCode !== VK.BACKSPACE) {
            return
          }
          rng = selection.getRng()
          container = rng.startContainer
          offset = rng.startOffset
          root = dom.getRoot()
          parent$$1 = container
          if (!rng.collapsed || offset !== 0) {
            return
          }
          while (parent$$1 && parent$$1.parentNode && parent$$1.parentNode.firstChild === parent$$1 && parent$$1.parentNode !== root) {
            parent$$1 = parent$$1.parentNode
          }
          if (parent$$1.tagName === 'BLOCKQUOTE') {
            editor.formatter.toggle('blockquote', null, parent$$1)
            rng = dom.createRng()
            rng.setStart(container, 0)
            rng.setEnd(container, 0)
            selection.setRng(rng)
          }
        })
      }
      const setGeckoEditingOptions = function () {
        const setOpts = function () {
          setEditorCommandState('StyleWithCSS', false)
          setEditorCommandState('enableInlineTableEditing', false)
          if (!settings.object_resizing) {
            setEditorCommandState('enableObjectResizing', false)
          }
        }
        if (!settings.readonly) {
          editor.on('BeforeExecCommand MouseDown', setOpts)
        }
      }
      const addBrAfterLastLinks = function () {
        const fixLinks = function () {
          each(dom.select('a'), (node) => {
            let { parentNode } = node
            const root = dom.getRoot()
            if (parentNode.lastChild === node) {
              while (parentNode && !dom.isBlock(parentNode)) {
                if (parentNode.parentNode.lastChild !== parentNode || parentNode === root) {
                  return
                }
                parentNode = parentNode.parentNode
              }
              dom.add(parentNode, 'br', { 'data-mce-bogus': 1 })
            }
          })
        }
        editor.on('SetContent ExecCommand', (e) => {
          if (e.type === 'setcontent' || e.command === 'mceInsertLink') {
            fixLinks()
          }
        })
      }
      const setDefaultBlockType = function () {
        if (settings.forced_root_block) {
          editor.on('init', () => {
            setEditorCommandState('DefaultParagraphSeparator', Settings.getForcedRootBlock(editor))
          })
        }
      }
      const normalizeSelection = function () {
        editor.on('keyup focusin mouseup', (e) => {
          if (!VK.modifierPressed(e)) {
            selection.normalize()
          }
        }, true)
      }
      const showBrokenImageIcon = function () {
        editor.contentStyles.push('img:-moz-broken {' + '-moz-force-broken-image-icon:1;' + 'min-width:24px;' + 'min-height:24px' + '}')
      }
      const restoreFocusOnKeyDown = function () {
        if (!editor.inline) {
          editor.on('keydown', () => {
            if (document.activeElement === document.body) {
              editor.getWin().focus()
            }
          })
        }
      }
      const bodyHeight = function () {
        if (!editor.inline) {
          editor.contentStyles.push('body {min-height: 150px}')
          editor.on('click', (e) => {
            let rng
            if (e.target.nodeName === 'HTML') {
              if (Env.ie > 11) {
                editor.getBody().focus()
                return
              }
              rng = editor.selection.getRng()
              editor.getBody().focus()
              editor.selection.setRng(rng)
              editor.selection.normalize()
              editor.nodeChanged()
            }
          })
        }
      }
      const blockCmdArrowNavigation = function () {
        if (Env.mac) {
          editor.on('keydown', (e) => {
            if (VK.metaKeyPressed(e) && !e.shiftKey && (e.keyCode === 37 || e.keyCode === 39)) {
              e.preventDefault()
              editor.selection.getSel().modify('move', e.keyCode === 37 ? 'backward' : 'forward', 'lineboundary')
            }
          })
        }
      }
      const disableAutoUrlDetect = function () {
        setEditorCommandState('AutoUrlDetect', false)
      }
      const tapLinksAndImages = function () {
        editor.on('click', (e) => {
          let elm = e.target
          do {
            if (elm.tagName === 'A') {
              e.preventDefault()
              return
            }
          } while (elm = elm.parentNode)
        })
        editor.contentStyles.push('.mce-content-body {-webkit-touch-callout: none}')
      }
      const blockFormSubmitInsideEditor = function () {
        editor.on('init', () => {
          editor.dom.bind(editor.getBody(), 'submit', (e) => {
            e.preventDefault()
          })
        })
      }
      const removeAppleInterchangeBrs = function () {
        parser.addNodeFilter('br', (nodes) => {
          let i = nodes.length
          while (i--) {
            if (nodes[i].attr('class') === 'Apple-interchange-newline') {
              nodes[i].remove()
            }
          }
        })
      }
      const ieInternalDragAndDrop = function () {
        editor.on('dragstart', (e) => {
          setMceInternalContent(e)
        })
        editor.on('drop', (e) => {
          if (!isDefaultPrevented(e)) {
            const internalContent = getMceInternalContent(e)
            if (internalContent && internalContent.id !== editor.id) {
              e.preventDefault()
              const rng = CaretRangeFromPoint.fromPoint(e.x, e.y, editor.getDoc())
              selection.setRng(rng)
              insertClipboardContents(internalContent.html, true)
            }
          }
        })
      }
      const refreshContentEditable = function () {
      }
      const isHidden = function () {
        let sel
        if (!isGecko || editor.removed) {
          return 0
        }
        sel = editor.selection.getSel()
        return !sel || !sel.rangeCount || sel.rangeCount === 0
      }
      removeBlockQuoteOnBackSpace()
      emptyEditorWhenDeleting()
      if (!Env.windowsPhone) {
        normalizeSelection()
      }
      if (isWebKit) {
        inputMethodFocus()
        selectControlElements()
        setDefaultBlockType()
        blockFormSubmitInsideEditor()
        disableBackspaceIntoATable()
        removeAppleInterchangeBrs()
        if (Env.iOS) {
          restoreFocusOnKeyDown()
          bodyHeight()
          tapLinksAndImages()
        } else {
          selectAll()
        }
      }
      if (Env.ie >= 11) {
        bodyHeight()
        disableBackspaceIntoATable()
      }
      if (Env.ie) {
        selectAll()
        disableAutoUrlDetect()
        ieInternalDragAndDrop()
      }
      if (isGecko) {
        removeHrOnBackspace()
        focusBody()
        removeStylesWhenDeletingAcrossBlockElements()
        setGeckoEditingOptions()
        addBrAfterLastLinks()
        showBrokenImageIcon()
        blockCmdArrowNavigation()
        disableBackspaceIntoATable()
      }
      return {
        refreshContentEditable,
        isHidden,
      }
    }

    const isTextBlockNode = function (node) {
      return NodeType.isElement(node) && isTextBlock(Element$$1.fromDom(node))
    }
    const normalizeSelection$1 = function (editor) {
      const rng = editor.selection.getRng()
      const startPos = CaretPosition.fromRangeStart(rng)
      const endPos = CaretPosition.fromRangeEnd(rng)
      if (CaretPosition.isElementPosition(startPos)) {
        var container = startPos.container()
        if (isTextBlockNode(container)) {
          CaretFinder.firstPositionIn(container).each((pos) => rng.setStart(pos.container(), pos.offset()))
        }
      }
      if (CaretPosition.isElementPosition(endPos)) {
        var container = startPos.container()
        if (isTextBlockNode(container)) {
          CaretFinder.lastPositionIn(container).each((pos) => rng.setEnd(pos.container(), pos.offset()))
        }
      }
      editor.selection.setRng(RangeNormalizer.normalize(rng))
    }
    const setup$e = function (editor) {
      editor.on('click', (e) => {
        if (e.detail >= 3) {
          normalizeSelection$1(editor)
        }
      })
    }

    const preventSummaryToggle = function (editor) {
      editor.on('click', (e) => {
        if (editor.dom.getParent(e.target, 'details')) {
          e.preventDefault()
        }
      })
    }
    const filterDetails = function (editor) {
      editor.parser.addNodeFilter('details', (elms) => {
        each(elms, (details) => {
          details.attr('data-mce-open', details.attr('open'))
          details.attr('open', 'open')
        })
      })
      editor.serializer.addNodeFilter('details', (elms) => {
        each(elms, (details) => {
          const open = details.attr('data-mce-open')
          details.attr('open', isString(open) ? open : null)
          details.attr('data-mce-open', null)
        })
      })
    }
    const setup$f = function (editor) {
      preventSummaryToggle(editor)
      filterDetails(editor)
    }

    const DOM$2 = DOMUtils$1.DOM
    const appendStyle = function (editor, text) {
      const head = Element$$1.fromDom(editor.getDoc().head)
      const tag = Element$$1.fromTag('style')
      set(tag, 'type', 'text/css')
      append(tag, Element$$1.fromText(text))
      append(head, tag)
    }
    const createParser = function (editor) {
      const parser = DomParser(editor.settings, editor.schema)
      parser.addAttributeFilter('src,href,style,tabindex', (nodes, name$$1) => {
        let i = nodes.length; let node
        const { dom } = editor
        let value, internalName
        while (i--) {
          node = nodes[i]
          value = node.attr(name$$1)
          internalName = `data-mce-${name$$1}`
          if (!node.attributes.map[internalName]) {
            if (value.indexOf('data:') === 0 || value.indexOf('blob:') === 0) {
              continue
            }
            if (name$$1 === 'style') {
              value = dom.serializeStyle(dom.parseStyle(value), node.name)
              if (!value.length) {
                value = null
              }
              node.attr(internalName, value)
              node.attr(name$$1, value)
            } else if (name$$1 === 'tabindex') {
              node.attr(internalName, value)
              node.attr(name$$1, null)
            } else {
              node.attr(internalName, editor.convertURL(value, name$$1, node.name))
            }
          }
        }
      })
      parser.addNodeFilter('script', (nodes) => {
        let i = nodes.length; let node; let type
        while (i--) {
          node = nodes[i]
          type = node.attr('type') || 'no/type'
          if (type.indexOf('mce-') !== 0) {
            node.attr('type', `mce-${type}`)
          }
        }
      })
      parser.addNodeFilter('#cdata', (nodes) => {
        let i = nodes.length; let node
        while (i--) {
          node = nodes[i]
          node.type = 8
          node.name = '#comment'
          node.value = `[CDATA[${node.value}]]`
        }
      })
      parser.addNodeFilter('p,h1,h2,h3,h4,h5,h6,div', (nodes) => {
        let i = nodes.length; let node
        const nonEmptyElements = editor.schema.getNonEmptyElements()
        while (i--) {
          node = nodes[i]
          if (node.isEmpty(nonEmptyElements) && node.getAll('br').length === 0) {
            node.append(new Node$2('br', 1)).shortEnded = true
          }
        }
      })
      return parser
    }
    const autoFocus = function (editor) {
      if (editor.settings.auto_focus) {
        Delay.setEditorTimeout(editor, () => {
          let focusEditor
          if (editor.settings.auto_focus === true) {
            focusEditor = editor
          } else {
            focusEditor = editor.editorManager.get(editor.settings.auto_focus)
          }
          if (!focusEditor.destroyed) {
            focusEditor.focus()
          }
        }, 100)
      }
    }
    const initEditor = function (editor) {
      editor.bindPendingEventDelegates()
      editor.initialized = true
      editor.fire('init')
      editor.focus(true)
      editor.nodeChanged({ initial: true })
      editor.execCallback('init_instance_callback', editor)
      autoFocus(editor)
    }
    const getStyleSheetLoader = function (editor) {
      return editor.inline ? DOM$2.styleSheetLoader : editor.dom.styleSheetLoader
    }
    const initContentBody = function (editor, skipWrite) {
      const { settings } = editor
      const targetElm = editor.getElement()
      let doc = editor.getDoc(); let body; let contentCssText
      if (!settings.inline) {
        editor.getElement().style.visibility = editor.orgVisibility
      }
      if (!skipWrite && !editor.inline) {
        doc.open()
        doc.write(editor.iframeHTML)
        doc.close()
      }
      if (editor.inline) {
        editor.on('remove', function () {
          const bodyEl = this.getBody()
          DOM$2.removeClass(bodyEl, 'mce-content-body')
          DOM$2.removeClass(bodyEl, 'mce-edit-focus')
          DOM$2.setAttrib(bodyEl, 'contentEditable', null)
        })
        DOM$2.addClass(targetElm, 'mce-content-body')
        editor.contentDocument = doc = settings.content_document || document
        editor.contentWindow = settings.content_window || window
        editor.bodyElement = targetElm
        editor.contentAreaContainer = targetElm
        settings.content_document = settings.content_window = null
        settings.root_name = targetElm.nodeName.toLowerCase()
      }
      body = editor.getBody()
      body.disabled = true
      editor.readonly = settings.readonly
      if (!editor.readonly) {
        if (editor.inline && DOM$2.getStyle(body, 'position', true) === 'static') {
          body.style.position = 'relative'
        }
        body.contentEditable = editor.getParam('content_editable_state', true)
      }
      body.disabled = false
      editor.editorUpload = EditorUpload(editor)
      editor.schema = Schema(settings)
      editor.dom = DOMUtils$1(doc, {
        keep_values: true,
        url_converter: editor.convertURL,
        url_converter_scope: editor,
        hex_colors: settings.force_hex_style_colors,
        class_filter: settings.class_filter,
        update_styles: true,
        root_element: editor.inline ? editor.getBody() : null,
        collect() {
          return editor.inline
        },
        schema: editor.schema,
        contentCssCors: Settings.shouldUseContentCssCors(editor),
        onSetAttrib(e) {
          editor.fire('SetAttrib', e)
        },
      })
      editor.parser = createParser(editor)
      editor.serializer = Serializer$1(settings, editor)
      editor.selection = Selection(editor.dom, editor.getWin(), editor.serializer, editor)
      editor.annotator = Annotator(editor)
      editor.formatter = Formatter(editor)
      editor.undoManager = UndoManager(editor)
      editor._nodeChangeDispatcher = new NodeChange(editor)
      editor._selectionOverrides = SelectionOverrides(editor)
      setup$f(editor)
      setup$e(editor)
      KeyboardOverrides.setup(editor)
      ForceBlocks.setup(editor)
      editor.fire('PreInit')
      if (!settings.browser_spellcheck && !settings.gecko_spellcheck) {
        doc.body.spellcheck = false
        DOM$2.setAttrib(body, 'spellcheck', 'false')
      }
      editor.quirks = Quirks(editor)
      editor.fire('PostRender')
      if (settings.directionality) {
        body.dir = settings.directionality
      }
      if (settings.protect) {
        editor.on('BeforeSetContent', (e) => {
          Tools.each(settings.protect, (pattern) => {
            e.content = e.content.replace(pattern, (str) => `<!--mce:protected ${escape(str)}-->`)
          })
        })
      }
      editor.on('SetContent', () => {
        editor.addVisual(editor.getBody())
      })
      editor.load({
        initial: true,
        format: 'html',
      })
      editor.startContent = editor.getContent({ format: 'raw' })
      editor.on('compositionstart compositionend', (e) => {
        editor.composing = e.type === 'compositionstart'
      })
      if (editor.contentStyles.length > 0) {
        contentCssText = ''
        Tools.each(editor.contentStyles, (style) => {
          contentCssText += `${style}\r\n`
        })
        editor.dom.addStyle(contentCssText)
      }
      getStyleSheetLoader(editor).loadAll(editor.contentCSS, (_) => {
        initEditor(editor)
      }, (urls) => {
        initEditor(editor)
      })
      if (settings.content_style) {
        appendStyle(editor, settings.content_style)
      }
    }
    const InitContentBody = { initContentBody }

    const DOM$3 = DOMUtils$1.DOM
    const relaxDomain = function (editor, ifr) {
      if (document.domain !== window.location.hostname && Env.ie && Env.ie < 12) {
        const bodyUuid = Uuid.uuid('mce')
        editor[bodyUuid] = function () {
          InitContentBody.initContentBody(editor)
        }
        const domainRelaxUrl = `${'javascript:(function(){' + 'document.open();document.domain="'}${document.domain}";` + `var ed = window.parent.tinymce.get("${editor.id}");document.write(ed.iframeHTML);` + `document.close();ed.${bodyUuid}(true);})()`
        DOM$3.setAttrib(ifr, 'src', domainRelaxUrl)
        return true
      }
      return false
    }
    const createIframeElement = function (id, title, height, customAttrs) {
      const iframe = Element$$1.fromTag('iframe')
      setAll(iframe, customAttrs)
      setAll(iframe, {
        id: `${id}_ifr`,
        frameBorder: '0',
        allowTransparency: 'true',
        title,
      })
      add$3(iframe, 'tox-edit-area__iframe')
      return iframe
    }
    const getIframeHtml = function (editor) {
      let bodyId, bodyClass, iframeHTML
      iframeHTML = `${Settings.getDocType(editor)}<html><head>`
      if (Settings.getDocumentBaseUrl(editor) !== editor.documentBaseUrl) {
        iframeHTML += `<base href="${editor.documentBaseURI.getURI()}" />`
      }
      iframeHTML += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
      bodyId = Settings.getBodyId(editor)
      bodyClass = Settings.getBodyClass(editor)
      if (Settings.getContentSecurityPolicy(editor)) {
        iframeHTML += `<meta http-equiv="Content-Security-Policy" content="${Settings.getContentSecurityPolicy(editor)}" />`
      }
      iframeHTML += `</head><body id="${bodyId}" class="mce-content-body ${bodyClass}" data-id="${editor.id}"><br></body></html>`
      return iframeHTML
    }
    const createIframe = function (editor, o) {
      const title = editor.editorManager.translate('Rich Text Area. Press ALT-0 for help.')
      const ifr = createIframeElement(editor.id, title, o.height, Settings.getIframeAttrs(editor)).dom()
      ifr.onload = function () {
        ifr.onload = null
        editor.fire('load')
      }
      const isDomainRelaxed = relaxDomain(editor, ifr)
      editor.contentAreaContainer = o.iframeContainer
      editor.iframeElement = ifr
      editor.iframeHTML = getIframeHtml(editor)
      DOM$3.add(o.iframeContainer, ifr)
      return isDomainRelaxed
    }
    const init$1 = function (editor, boxInfo) {
      const isDomainRelaxed = createIframe(editor, boxInfo)
      if (boxInfo.editorContainer) {
        DOM$3.get(boxInfo.editorContainer).style.display = editor.orgDisplay
        editor.hidden = DOM$3.isHidden(boxInfo.editorContainer)
      }
      editor.getElement().style.display = 'none'
      DOM$3.setAttrib(editor.id, 'aria-hidden', 'true')
      if (!isDomainRelaxed) {
        InitContentBody.initContentBody(editor)
      }
    }
    const InitIframe = { init: init$1 }

    const isContentCssSkinName = function (url) {
      return /^[a-z0-9\-]+$/i.test(url)
    }
    const getContentCssUrls = function (editor) {
      const contentCss = Settings.getContentCss(editor)
      const skinUrl = `${editor.editorManager.baseURL}/skins/content`
      const { suffix } = editor.editorManager
      const contentCssFile = `content${suffix}.css`
      const inline = editor.inline === true
      return map(contentCss, (url) => {
        if (isContentCssSkinName(url) && !inline) {
          return `${skinUrl}/${url}/${contentCssFile}`
        }
        return editor.documentBaseURI.toAbsolute(url)
      })
    }
    const appendContentCssFromSettings = function (editor) {
      editor.contentCSS = editor.contentCSS.concat(getContentCssUrls(editor))
    }

    const DOM$4 = DOMUtils$1.DOM
    var initPlugin = function (editor, initializedPlugins, plugin) {
      const Plugin = PluginManager$1.get(plugin)
      const pluginUrl = PluginManager$1.urls[plugin] || editor.documentBaseUrl.replace(/\/$/, '')
      plugin = Tools.trim(plugin)
      if (Plugin && Tools.inArray(initializedPlugins, plugin) === -1) {
        Tools.each(PluginManager$1.dependencies(plugin), (dep) => {
          initPlugin(editor, initializedPlugins, dep)
        })
        if (editor.plugins[plugin]) {
          return
        }
        const pluginInstance = new Plugin(editor, pluginUrl, editor.$)
        editor.plugins[plugin] = pluginInstance
        if (pluginInstance.init) {
          pluginInstance.init(editor, pluginUrl)
          initializedPlugins.push(plugin)
        }
      }
    }
    const trimLegacyPrefix = function (name) {
      return name.replace(/^\-/, '')
    }
    const initPlugins = function (editor) {
      const initializedPlugins = []
      Tools.each(editor.settings.plugins.split(/[ ,]/), (name) => {
        initPlugin(editor, initializedPlugins, trimLegacyPrefix(name))
      })
    }
    const initIcons = function (editor) {
      const iconPackName = Tools.trim(editor.settings.icons)
      each$3(IconManager.get(iconPackName).icons, (svgData, name) => {
        editor.ui.registry.addIcon(name, svgData)
      })
    }
    const initTheme = function (editor) {
      const { theme } = editor.settings
      if (isString(theme)) {
        editor.settings.theme = trimLegacyPrefix(theme)
        const Theme = ThemeManager.get(theme)
        editor.theme = new Theme(editor, ThemeManager.urls[theme])
        if (editor.theme.init) {
          editor.theme.init(editor, ThemeManager.urls[theme] || editor.documentBaseUrl.replace(/\/$/, ''), editor.$)
        }
      } else {
        editor.theme = {}
      }
    }
    const renderFromLoadedTheme = function (editor) {
      return editor.theme.renderUI()
    }
    const renderFromThemeFunc = function (editor) {
      const elm = editor.getElement()
      const info = editor.settings.theme(editor, elm)
      if (info.editorContainer.nodeType) {
        info.editorContainer.id = info.editorContainer.id || `${editor.id}_parent`
      }
      if (info.iframeContainer && info.iframeContainer.nodeType) {
        info.iframeContainer.id = info.iframeContainer.id || `${editor.id}_iframecontainer`
      }
      info.height = info.iframeHeight ? info.iframeHeight : elm.offsetHeight
      return info
    }
    const createThemeFalseResult = function (element) {
      return {
        editorContainer: element,
        iframeContainer: element,
      }
    }
    const renderThemeFalseIframe = function (targetElement) {
      const iframeContainer = DOM$4.create('div')
      DOM$4.insertAfter(iframeContainer, targetElement)
      return createThemeFalseResult(iframeContainer)
    }
    const renderThemeFalse = function (editor) {
      const targetElement = editor.getElement()
      return editor.inline ? createThemeFalseResult(null) : renderThemeFalseIframe(targetElement)
    }
    const renderThemeUi = function (editor) {
      const { settings } = editor; const elm = editor.getElement()
      editor.orgDisplay = elm.style.display
      if (isString(settings.theme)) {
        return renderFromLoadedTheme(editor)
      } if (isFunction(settings.theme)) {
        return renderFromThemeFunc(editor)
      }
      return renderThemeFalse(editor)
    }
    const init$2 = function (editor) {
      editor.fire('ScriptsLoaded')
      initTheme(editor)
      initPlugins(editor)
      initIcons(editor)
      const boxInfo = renderThemeUi(editor)
      editor.editorContainer = boxInfo.editorContainer ? boxInfo.editorContainer : null
      appendContentCssFromSettings(editor)
      if (editor.inline) {
        return InitContentBody.initContentBody(editor)
      }
      return InitIframe.init(editor, boxInfo)
    }
    const Init = { init: init$2 }

    const DOM$5 = DOMUtils$1.DOM
    const hasSkipLoadPrefix = function (name$$1) {
      return name$$1.charAt(0) === '-'
    }
    const loadLanguage = function (scriptLoader, editor) {
      const languageCode = Settings.getLanguageCode(editor)
      const languageUrl = Settings.getLanguageUrl(editor)
      if (I18n.hasCode(languageCode) === false && languageCode !== 'en') {
        if (languageUrl !== '') {
          scriptLoader.add(languageUrl)
        } else {
          scriptLoader.add(`${editor.editorManager.baseURL}/langs/${languageCode}.js`)
        }
      }
    }
    const loadTheme = function (scriptLoader, editor, suffix, callback) {
      const { settings } = editor; const { theme } = settings
      if (isString(theme)) {
        if (!hasSkipLoadPrefix(theme) && !ThemeManager.urls.hasOwnProperty(theme)) {
          const themeUrl = settings.theme_url
          if (themeUrl) {
            ThemeManager.load(theme, editor.documentBaseURI.toAbsolute(themeUrl))
          } else {
            ThemeManager.load(theme, `themes/${theme}/theme${suffix}.js`)
          }
        }
        scriptLoader.loadQueue(() => {
          ThemeManager.waitFor(theme, callback)
        })
      } else {
        callback()
      }
    }
    const loadIcons = function (settings, editor) {
      const iconPackName = settings.icons
      if (isString(iconPackName)) {
        const urlString = `${editor.editorManager.baseURL}/icons/${Tools.trim(iconPackName)}/icons.js`
        ScriptLoader.ScriptLoader.add(urlString)
      }
    }
    const loadPlugins = function (settings, suffix) {
      if (Tools.isArray(settings.plugins)) {
        settings.plugins = settings.plugins.join(' ')
      }
      Tools.each(settings.external_plugins, (url, name$$1) => {
        PluginManager$1.load(name$$1, url)
        settings.plugins += ` ${name$$1}`
      })
      Tools.each(settings.plugins.split(/[ ,]/), (plugin) => {
        plugin = Tools.trim(plugin)
        if (plugin && !PluginManager$1.urls[plugin]) {
          if (hasSkipLoadPrefix(plugin)) {
            plugin = plugin.substr(1, plugin.length)
            const dependencies = PluginManager$1.dependencies(plugin)
            Tools.each(dependencies, (dep) => {
              const defaultSettings = {
                prefix: 'plugins/',
                resource: dep,
                suffix: `/plugin${suffix}.js`,
              }
              dep = PluginManager$1.createUrl(defaultSettings, dep)
              PluginManager$1.load(dep.resource, dep)
            })
          } else {
            PluginManager$1.load(plugin, {
              prefix: 'plugins/',
              resource: plugin,
              suffix: `/plugin${suffix}.js`,
            })
          }
        }
      })
    }
    const loadScripts = function (editor, suffix) {
      const scriptLoader = ScriptLoader.ScriptLoader
      loadTheme(scriptLoader, editor, suffix, () => {
        loadLanguage(scriptLoader, editor)
        loadIcons(editor.settings, editor)
        loadPlugins(editor.settings, suffix)
        scriptLoader.loadQueue(() => {
          if (!editor.removed) {
            Init.init(editor)
          }
        }, editor, (urls) => {
          ErrorReporter.pluginLoadError(editor, urls[0])
          if (!editor.removed) {
            Init.init(editor)
          }
        })
      })
    }
    const render = function (editor) {
      const { settings } = editor; const { id } = editor
      I18n.setCode(Settings.getLanguageCode(editor))
      var readyHandler = function () {
        DOM$5.unbind(window, 'ready', readyHandler)
        editor.render()
      }
      if (!EventUtils.Event.domLoaded) {
        DOM$5.bind(window, 'ready', readyHandler)
        return
      }
      if (!editor.getElement()) {
        return
      }
      if (!Env.contentEditable) {
        return
      }
      if (!settings.inline) {
        editor.orgVisibility = editor.getElement().style.visibility
        editor.getElement().style.visibility = 'hidden'
      } else {
        editor.inline = true
      }
      const form = editor.getElement().form || DOM$5.getParent(id, 'form')
      if (form) {
        editor.formElement = form
        if (settings.hidden_input && !/TEXTAREA|INPUT/i.test(editor.getElement().nodeName)) {
          DOM$5.insertAfter(DOM$5.create('input', {
            type: 'hidden',
            name: id,
          }), id)
          editor.hasHiddenInput = true
        }
        editor.formEventDelegate = function (e) {
          editor.fire(e.type, e)
        }
        DOM$5.bind(form, 'submit reset', editor.formEventDelegate)
        editor.on('reset', () => {
          editor.setContent(editor.startContent, { format: 'raw' })
        })
        if (settings.submit_patch && !form.submit.nodeType && !form.submit.length && !form._mceOldSubmit) {
          form._mceOldSubmit = form.submit
          form.submit = function () {
            editor.editorManager.triggerSave()
            editor.setDirty(false)
            return form._mceOldSubmit(form)
          }
        }
      }
      editor.windowManager = WindowManager(editor)
      editor.notificationManager = NotificationManager(editor)
      if (settings.encoding === 'xml') {
        editor.on('GetContent', (e) => {
          if (e.save) {
            e.content = DOM$5.encode(e.content)
          }
        })
      }
      if (settings.add_form_submit_trigger) {
        editor.on('submit', () => {
          if (editor.initialized) {
            editor.save()
          }
        })
      }
      if (settings.add_unload_trigger) {
        editor._beforeUnload = function () {
          if (editor.initialized && !editor.destroyed && !editor.isHidden()) {
            editor.save({
              format: 'raw',
              no_events: true,
              set_dirty: false,
            })
          }
        }
        editor.editorManager.on('BeforeUnload', editor._beforeUnload)
      }
      editor.editorManager.add(editor)
      loadScripts(editor, editor.suffix)
    }
    const Render = { render }

    const setEditorCommandState = function (editor, cmd, state) {
      try {
        editor.getDoc().execCommand(cmd, false, state)
      } catch (ex) {
      }
    }
    const toggleClass = function (elm, cls, state) {
      if (has$2(elm, cls) && state === false) {
        remove$5(elm, cls)
      } else if (state) {
        add$3(elm, cls)
      }
    }
    const toggleReadOnly = function (editor, state) {
      toggleClass(Element$$1.fromDom(editor.getBody()), 'mce-content-readonly', state)
      if (state) {
        editor.selection.controlSelection.hideResizeRect()
        editor.readonly = true
        editor.getBody().contentEditable = 'false'
      } else {
        editor.readonly = false
        editor.getBody().contentEditable = 'true'
        setEditorCommandState(editor, 'StyleWithCSS', false)
        setEditorCommandState(editor, 'enableInlineTableEditing', false)
        setEditorCommandState(editor, 'enableObjectResizing', false)
        editor.focus()
        editor.nodeChanged()
      }
    }
    const setMode = function (editor, mode) {
      if (mode === getMode(editor)) {
        return
      }
      if (editor.initialized) {
        toggleReadOnly(editor, mode === 'readonly')
      } else {
        editor.on('init', () => {
          toggleReadOnly(editor, mode === 'readonly')
        })
      }
      Events.fireSwitchMode(editor, mode)
    }
    var getMode = function (editor) {
      return editor.readonly ? 'readonly' : 'design'
    }
    const isReadOnly = function (editor) {
      return editor.readonly === true
    }

    const hasOnlyOneChild$1 = function (node) {
      return node.firstChild && node.firstChild === node.lastChild
    }
    const isPaddingNode = function (node) {
      return node.name === 'br' || node.value === '\xA0'
    }
    const isPaddedEmptyBlock = function (schema, node) {
      const blockElements = schema.getBlockElements()
      return blockElements[node.name] && hasOnlyOneChild$1(node) && isPaddingNode(node.firstChild)
    }
    const isEmptyFragmentElement = function (schema, node) {
      const nonEmptyElements = schema.getNonEmptyElements()
      return node && (node.isEmpty(nonEmptyElements) || isPaddedEmptyBlock(schema, node))
    }
    const isListFragment = function (schema, fragment) {
      let { firstChild } = fragment
      let { lastChild } = fragment
      if (firstChild && firstChild.name === 'meta') {
        firstChild = firstChild.next
      }
      if (lastChild && lastChild.attr('id') === 'mce_marker') {
        lastChild = lastChild.prev
      }
      if (isEmptyFragmentElement(schema, lastChild)) {
        lastChild = lastChild.prev
      }
      if (!firstChild || firstChild !== lastChild) {
        return false
      }
      return firstChild.name === 'ul' || firstChild.name === 'ol'
    }
    const cleanupDomFragment = function (domFragment) {
      const { firstChild } = domFragment
      const { lastChild } = domFragment
      if (firstChild && firstChild.nodeName === 'META') {
        firstChild.parentNode.removeChild(firstChild)
      }
      if (lastChild && lastChild.id === 'mce_marker') {
        lastChild.parentNode.removeChild(lastChild)
      }
      return domFragment
    }
    const toDomFragment = function (dom, serializer, fragment) {
      const html = serializer.serialize(fragment)
      const domFragment = dom.createFragment(html)
      return cleanupDomFragment(domFragment)
    }
    const listItems$1 = function (elm) {
      return Tools.grep(elm.childNodes, (child) => child.nodeName === 'LI')
    }
    const isPadding = function (node) {
      return node.data === '\xA0' || NodeType.isBr(node)
    }
    const isListItemPadded = function (node) {
      return node && node.firstChild && node.firstChild === node.lastChild && isPadding(node.firstChild)
    }
    const isEmptyOrPadded = function (elm) {
      return !elm.firstChild || isListItemPadded(elm)
    }
    const trimListItems = function (elms) {
      return elms.length > 0 && isEmptyOrPadded(elms[elms.length - 1]) ? elms.slice(0, -1) : elms
    }
    const getParentLi = function (dom, node) {
      const parentBlock = dom.getParent(node, dom.isBlock)
      return parentBlock && parentBlock.nodeName === 'LI' ? parentBlock : null
    }
    const isParentBlockLi = function (dom, node) {
      return !!getParentLi(dom, node)
    }
    const getSplit = function (parentNode, rng) {
      const beforeRng = rng.cloneRange()
      const afterRng = rng.cloneRange()
      beforeRng.setStartBefore(parentNode)
      afterRng.setEndAfter(parentNode)
      return [
        beforeRng.cloneContents(),
        afterRng.cloneContents(),
      ]
    }
    const findFirstIn = function (node, rootNode) {
      const caretPos = CaretPosition$1.before(node)
      const caretWalker = CaretWalker(rootNode)
      const newCaretPos = caretWalker.next(caretPos)
      return newCaretPos ? newCaretPos.toRange() : null
    }
    const findLastOf = function (node, rootNode) {
      const caretPos = CaretPosition$1.after(node)
      const caretWalker = CaretWalker(rootNode)
      const newCaretPos = caretWalker.prev(caretPos)
      return newCaretPos ? newCaretPos.toRange() : null
    }
    const insertMiddle = function (target, elms, rootNode, rng) {
      const parts = getSplit(target, rng)
      const parentElm = target.parentNode
      parentElm.insertBefore(parts[0], target)
      Tools.each(elms, (li) => {
        parentElm.insertBefore(li, target)
      })
      parentElm.insertBefore(parts[1], target)
      parentElm.removeChild(target)
      return findLastOf(elms[elms.length - 1], rootNode)
    }
    const insertBefore$1 = function (target, elms, rootNode) {
      const parentElm = target.parentNode
      Tools.each(elms, (elm) => {
        parentElm.insertBefore(elm, target)
      })
      return findFirstIn(target, rootNode)
    }
    const insertAfter$1 = function (target, elms, rootNode, dom) {
      dom.insertAfter(elms.reverse(), target)
      return findLastOf(elms[0], rootNode)
    }
    const insertAtCaret = function (serializer, dom, rng, fragment) {
      const domFragment = toDomFragment(dom, serializer, fragment)
      const liTarget = getParentLi(dom, rng.startContainer)
      const liElms = trimListItems(listItems$1(domFragment.firstChild))
      const BEGINNING = 1; const END = 2
      const rootNode = dom.getRoot()
      const isAt = function (location) {
        const caretPos = CaretPosition$1.fromRangeStart(rng)
        const caretWalker = CaretWalker(dom.getRoot())
        const newPos = location === BEGINNING ? caretWalker.prev(caretPos) : caretWalker.next(caretPos)
        return newPos ? getParentLi(dom, newPos.getNode()) !== liTarget : true
      }
      if (isAt(BEGINNING)) {
        return insertBefore$1(liTarget, liElms, rootNode)
      } if (isAt(END)) {
        return insertAfter$1(liTarget, liElms, rootNode, dom)
      }
      return insertMiddle(liTarget, liElms, rootNode, rng)
    }
    const InsertList = {
      isListFragment,
      insertAtCaret,
      isParentBlockLi,
      trimListItems,
      listItems: listItems$1,
    }

    const isAfterNbsp = function (container, offset) {
      return NodeType.isText(container) && container.nodeValue[offset - 1] === '\xA0'
    }
    const trimOrPadLeftRight = function (rng, html) {
      let container, offset
      container = rng.startContainer
      offset = rng.startOffset
      const hasSiblingText = function (siblingName) {
        return container[siblingName] && container[siblingName].nodeType === 3
      }
      if (container.nodeType === 3) {
        if (offset > 0) {
          html = html.replace(/^&nbsp;/, ' ')
        } else if (!hasSiblingText('previousSibling')) {
          html = html.replace(/^ /, '&nbsp;')
        }
        if (offset < container.length) {
          html = html.replace(/&nbsp;(<br>|)$/, ' ')
        } else if (!hasSiblingText('nextSibling')) {
          html = html.replace(/(&nbsp;| )(<br>|)$/, '&nbsp;')
        }
      }
      return html
    }
    const trimNbspAfterDeleteAndPadValue = function (rng, value) {
      let container, offset
      container = rng.startContainer
      offset = rng.startOffset
      if (container.nodeType === 3 && rng.collapsed) {
        if (container.data[offset] === '\xA0') {
          container.deleteData(offset, 1)
          if (!/[\u00a0| ]$/.test(value)) {
            value += ' '
          }
        } else if (container.data[offset - 1] === '\xA0') {
          container.deleteData(offset - 1, 1)
          if (!/[\u00a0| ]$/.test(value)) {
            value = ` ${value}`
          }
        }
      }
      return value
    }

    const isTableCell$5 = NodeType.matchNodeNames('td th')
    const selectionSetContent = function (editor, content) {
      const rng = editor.selection.getRng()
      const container = rng.startContainer
      const offset = rng.startOffset
      if (rng.collapsed && isAfterNbsp(container, offset) && NodeType.isText(container)) {
        container.insertData(offset - 1, ' ')
        container.deleteData(offset, 1)
        rng.setStart(container, offset)
        rng.setEnd(container, offset)
        editor.selection.setRng(rng)
      }
      editor.selection.setContent(content)
    }
    const validInsertion = function (editor, value, parentNode) {
      if (parentNode.getAttribute('data-mce-bogus') === 'all') {
        parentNode.parentNode.insertBefore(editor.dom.createFragment(value), parentNode)
      } else {
        const node = parentNode.firstChild
        const node2 = parentNode.lastChild
        if (!node || node === node2 && node.nodeName === 'BR') {
          editor.dom.setHTML(parentNode, value)
        } else {
          selectionSetContent(editor, value)
        }
      }
    }
    const trimBrsFromTableCell = function (dom, elm) {
      Option.from(dom.getParent(elm, 'td,th')).map(Element$$1.fromDom).each(PaddingBr.trimBlockTrailingBr)
    }
    const reduceInlineTextElements = function (editor, merge) {
      const textInlineElements = editor.schema.getTextInlineElements()
      const { dom } = editor
      if (merge) {
        const root_1 = editor.getBody(); const elementUtils_1 = new ElementUtils(dom)
        Tools.each(dom.select('*[data-mce-fragment]'), (node) => {
          for (let testNode = node.parentNode; testNode && testNode !== root_1; testNode = testNode.parentNode) {
            if (textInlineElements[node.nodeName.toLowerCase()] && elementUtils_1.compare(testNode, node)) {
              dom.remove(node, true)
            }
          }
        })
      }
    }
    const markFragmentElements = function (fragment) {
      let node = fragment
      while (node = node.walk()) {
        if (node.type === 1) {
          node.attr('data-mce-fragment', '1')
        }
      }
    }
    const umarkFragmentElements = function (elm) {
      Tools.each(elm.getElementsByTagName('*'), (elm) => {
        elm.removeAttribute('data-mce-fragment')
      })
    }
    const isPartOfFragment = function (node) {
      return !!node.getAttribute('data-mce-fragment')
    }
    const canHaveChildren = function (editor, node) {
      return node && !editor.schema.getShortEndedElements()[node.nodeName]
    }
    const moveSelectionToMarker = function (editor, marker) {
      let parentEditableFalseElm, parentBlock, nextRng
      const { dom } = editor; const { selection } = editor
      let node, node2
      const getContentEditableFalseParent = function (node) {
        const root = editor.getBody()
        for (; node && node !== root; node = node.parentNode) {
          if (editor.dom.getContentEditable(node) === 'false') {
            return node
          }
        }
        return null
      }
      if (!marker) {
        return
      }
      editor.selection.scrollIntoView(marker)
      parentEditableFalseElm = getContentEditableFalseParent(marker)
      if (parentEditableFalseElm) {
        dom.remove(marker)
        selection.select(parentEditableFalseElm)
        return
      }
      let rng = dom.createRng()
      node = marker.previousSibling
      if (node && node.nodeType === 3) {
        rng.setStart(node, node.nodeValue.length)
        if (!Env.ie) {
          node2 = marker.nextSibling
          if (node2 && node2.nodeType === 3) {
            node.appendData(node2.data)
            node2.parentNode.removeChild(node2)
          }
        }
      } else {
        rng.setStartBefore(marker)
        rng.setEndBefore(marker)
      }
      const findNextCaretRng = function (rng) {
        let caretPos = CaretPosition$1.fromRangeStart(rng)
        const caretWalker = CaretWalker(editor.getBody())
        caretPos = caretWalker.next(caretPos)
        if (caretPos) {
          return caretPos.toRange()
        }
      }
      parentBlock = dom.getParent(marker, dom.isBlock)
      dom.remove(marker)
      if (parentBlock && dom.isEmpty(parentBlock)) {
        editor.$(parentBlock).empty()
        rng.setStart(parentBlock, 0)
        rng.setEnd(parentBlock, 0)
        if (!isTableCell$5(parentBlock) && !isPartOfFragment(parentBlock) && (nextRng = findNextCaretRng(rng))) {
          rng = nextRng
          dom.remove(parentBlock)
        } else {
          dom.add(parentBlock, dom.create('br', { 'data-mce-bogus': '1' }))
        }
      }
      selection.setRng(rng)
    }
    const insertHtmlAtCaret = function (editor, value, details) {
      let parser, serializer, parentNode, rootNode, fragment, args
      let marker, rng, node, bookmarkHtml, merge
      const { selection } = editor; const { dom } = editor
      if (/^ | $/.test(value)) {
        value = trimOrPadLeftRight(selection.getRng(), value)
      }
      parser = editor.parser
      merge = details.merge
      serializer = Serializer({ validate: editor.settings.validate }, editor.schema)
      bookmarkHtml = '<span id="mce_marker" data-mce-type="bookmark">&#xFEFF;&#x200B;</span>'
      args = {
        content: value,
        format: 'html',
        selection: true,
        paste: details.paste,
      }
      args = editor.fire('BeforeSetContent', args)
      if (args.isDefaultPrevented()) {
        editor.fire('SetContent', {
          content: args.content,
          format: 'html',
          selection: true,
          paste: details.paste,
        })
        return
      }
      value = args.content
      if (value.indexOf('{$caret}') === -1) {
        value += '{$caret}'
      }
      value = value.replace(/\{\$caret\}/, bookmarkHtml)
      rng = selection.getRng()
      const caretElement = rng.startContainer || (rng.parentElement ? rng.parentElement() : null)
      const body = editor.getBody()
      if (caretElement === body && selection.isCollapsed()) {
        if (dom.isBlock(body.firstChild) && canHaveChildren(editor, body.firstChild) && dom.isEmpty(body.firstChild)) {
          rng = dom.createRng()
          rng.setStart(body.firstChild, 0)
          rng.setEnd(body.firstChild, 0)
          selection.setRng(rng)
        }
      }
      if (!selection.isCollapsed()) {
        editor.selection.setRng(RangeNormalizer.normalize(editor.selection.getRng()))
        editor.getDoc().execCommand('Delete', false, null)
        value = trimNbspAfterDeleteAndPadValue(editor.selection.getRng(), value)
      }
      parentNode = selection.getNode()
      const parserArgs = {
        context: parentNode.nodeName.toLowerCase(),
        data: details.data,
        insert: true,
      }
      fragment = parser.parse(value, parserArgs)
      if (details.paste === true && InsertList.isListFragment(editor.schema, fragment) && InsertList.isParentBlockLi(dom, parentNode)) {
        rng = InsertList.insertAtCaret(serializer, dom, editor.selection.getRng(), fragment)
        editor.selection.setRng(rng)
        editor.fire('SetContent', args)
        return
      }
      markFragmentElements(fragment)
      node = fragment.lastChild
      if (node.attr('id') === 'mce_marker') {
        marker = node
        for (node = node.prev; node; node = node.walk(true)) {
          if (node.type === 3 || !dom.isBlock(node.name)) {
            if (editor.schema.isValidChild(node.parent.name, 'span')) {
              node.parent.insert(marker, node, node.name === 'br')
            }
            break
          }
        }
      }
      editor._selectionOverrides.showBlockCaretContainer(parentNode)
      if (!parserArgs.invalid) {
        value = serializer.serialize(fragment)
        validInsertion(editor, value, parentNode)
      } else {
        selectionSetContent(editor, bookmarkHtml)
        parentNode = selection.getNode()
        rootNode = editor.getBody()
        if (parentNode.nodeType === 9) {
          parentNode = node = rootNode
        } else {
          node = parentNode
        }
        while (node !== rootNode) {
          parentNode = node
          node = node.parentNode
        }
        value = parentNode === rootNode ? rootNode.innerHTML : dom.getOuterHTML(parentNode)
        value = serializer.serialize(parser.parse(value.replace(/<span (id="mce_marker"|id=mce_marker).+?<\/span>/i, () => serializer.serialize(fragment))))
        if (parentNode === rootNode) {
          dom.setHTML(rootNode, value)
        } else {
          dom.setOuterHTML(parentNode, value)
        }
      }
      reduceInlineTextElements(editor, merge)
      moveSelectionToMarker(editor, dom.get('mce_marker'))
      umarkFragmentElements(editor.getBody())
      trimBrsFromTableCell(editor.dom, editor.selection.getStart())
      editor.fire('SetContent', args)
      editor.addVisual()
    }
    const processValue = function (value) {
      let details
      if (typeof value !== 'string') {
        details = Tools.extend({
          paste: value.paste,
          data: { paste: value.paste },
        }, value)
        return {
          content: value.content,
          details,
        }
      }
      return {
        content: value,
        details: {},
      }
    }
    const insertAtCaret$1 = function (editor, value) {
      const result = processValue(value)
      insertHtmlAtCaret(editor, result.content, result.details)
    }
    const InsertContent = { insertAtCaret: insertAtCaret$1 }

    const nativeCommand = function (editor, command) {
      editor.getDoc().execCommand(command, false, null)
    }
    const deleteCommand = function (editor) {
      if (CefDelete.backspaceDelete(editor, false)) {

      } else if (InlineBoundaryDelete.backspaceDelete(editor, false)) {

      } else if (BlockBoundaryDelete.backspaceDelete(editor, false)) {

      } else if (TableDelete.backspaceDelete(editor)) {

      } else if (BlockRangeDelete.backspaceDelete(editor, false)) {

      } else {
        nativeCommand(editor, 'Delete')
        DeleteUtils.paddEmptyBody(editor)
      }
    }
    const forwardDeleteCommand = function (editor) {
      if (CefDelete.backspaceDelete(editor, true)) {

      } else if (InlineBoundaryDelete.backspaceDelete(editor, true)) {

      } else if (BlockBoundaryDelete.backspaceDelete(editor, true)) {

      } else if (TableDelete.backspaceDelete(editor)) {

      } else if (BlockRangeDelete.backspaceDelete(editor, true)) {

      } else {
        nativeCommand(editor, 'ForwardDelete')
      }
    }
    const DeleteCommands = {
      deleteCommand,
      forwardDeleteCommand,
    }

    const getSpecifiedFontProp = function (propName, rootElm, elm) {
      const getProperty = function (elm) {
        return getRaw(elm, propName)
      }
      const isRoot = function (elm) {
        return eq(Element$$1.fromDom(rootElm), elm)
      }
      return closest(Element$$1.fromDom(elm), (elm) => getProperty(elm).isSome(), isRoot).bind(getProperty)
    }
    const round$1 = function (number, precision) {
      const factor = Math.pow(10, precision)
      return Math.round(number * factor) / factor
    }
    const toPt = function (fontSize, precision) {
      if (/[0-9.]+px$/.test(fontSize)) {
        return `${round$1(parseInt(fontSize, 10) * 72 / 96, precision || 0)}pt`
      }
      return fontSize
    }
    const normalizeFontFamily = function (fontFamily) {
      return fontFamily.replace(/[\'\"\\]/g, '').replace(/,\s+/g, ',')
    }
    const getComputedFontProp = function (propName, elm) {
      return Option.from(DOMUtils$1.DOM.getStyle(elm, propName, true))
    }
    const getFontProp = function (propName) {
      return function (rootElm, elm) {
        return Option.from(elm).map(Element$$1.fromDom).filter(isElement).bind((element) => getSpecifiedFontProp(propName, rootElm, element.dom()).or(getComputedFontProp(propName, element.dom()))).getOr('')
      }
    }
    const FontInfo = {
      getFontSize: getFontProp('font-size'),
      getFontFamily: compose(normalizeFontFamily, getFontProp('font-family')),
      toPt,
    }

    const findFirstCaretElement = function (editor) {
      return CaretFinder.firstPositionIn(editor.getBody()).map((caret) => {
        const container = caret.container()
        return NodeType.isText(container) ? container.parentNode : container
      })
    }
    const isRangeAtStartOfNode = function (rng, root) {
      return rng.startContainer === root && rng.startOffset === 0
    }
    const getCaretElement = function (editor) {
      return Option.from(editor.selection.getRng()).bind((rng) => {
        const root = editor.getBody()
        return isRangeAtStartOfNode(rng, root) ? Option.none() : Option.from(editor.selection.getStart(true))
      })
    }
    const fromFontSizeNumber = function (editor, value) {
      if (/^[0-9\.]+$/.test(value)) {
        const fontSizeNumber = parseInt(value, 10)
        if (fontSizeNumber >= 1 && fontSizeNumber <= 7) {
          const fontSizes = Settings.getFontStyleValues(editor)
          const fontClasses = Settings.getFontSizeClasses(editor)
          if (fontClasses) {
            return fontClasses[fontSizeNumber - 1] || value
          }
          return fontSizes[fontSizeNumber - 1] || value
        }
        return value
      }
      return value
    }
    const fontNameAction = function (editor, value) {
      editor.formatter.toggle('fontname', { value: fromFontSizeNumber(editor, value) })
      editor.nodeChanged()
    }
    const fontNameQuery = function (editor) {
      return getCaretElement(editor).fold(() => findFirstCaretElement(editor).map((caretElement) => FontInfo.getFontFamily(editor.getBody(), caretElement)).getOr(''), (caretElement) => FontInfo.getFontFamily(editor.getBody(), caretElement))
    }
    const fontSizeAction = function (editor, value) {
      editor.formatter.toggle('fontsize', { value: fromFontSizeNumber(editor, value) })
      editor.nodeChanged()
    }
    const fontSizeQuery = function (editor) {
      return getCaretElement(editor).fold(() => findFirstCaretElement(editor).map((caretElement) => FontInfo.getFontSize(editor.getBody(), caretElement)).getOr(''), (caretElement) => FontInfo.getFontSize(editor.getBody(), caretElement))
    }

    const isEditable$1 = function (target) {
      return closest(target, (elm) => NodeType.isContentEditableTrue(elm.dom()) || NodeType.isContentEditableFalse(elm.dom())).exists((elm) => NodeType.isContentEditableTrue(elm.dom()))
    }
    const parseIndentValue = function (value) {
      const number = parseInt(value, 10)
      return isNaN(number) ? 0 : number
    }
    const getIndentStyleName = function (useMargin, element) {
      const indentStyleName = useMargin || isTable(element) ? 'margin' : 'padding'
      const suffix = get$2(element, 'direction') === 'rtl' ? '-right' : '-left'
      return indentStyleName + suffix
    }
    const indentElement = function (dom, command, useMargin, value, unit, element) {
      const indentStyleName = getIndentStyleName(useMargin, Element$$1.fromDom(element))
      if (command === 'outdent') {
        var styleValue = Math.max(0, parseIndentValue(element.style[indentStyleName]) - value)
        dom.setStyle(element, indentStyleName, styleValue ? styleValue + unit : '')
      } else {
        var styleValue = parseIndentValue(element.style[indentStyleName]) + value + unit
        dom.setStyle(element, indentStyleName, styleValue)
      }
    }
    const validateBlocks = function (editor, blocks) {
      return forall(blocks, (block) => {
        const indentStyleName = getIndentStyleName(Settings.shouldIndentUseMargin(editor), block)
        const intentValue = getRaw(block, indentStyleName).map(parseIndentValue).getOr(0)
        const contentEditable = editor.dom.getContentEditable(block.dom())
        return contentEditable !== 'false' && intentValue > 0
      })
    }
    const canOutdent = function (editor) {
      const blocks = getBlocksToIndent(editor)
      return editor.readonly !== true && (blocks.length > 1 || validateBlocks(editor, blocks))
    }
    const isListComponent = function (el) {
      return isList(el) || isListItem(el)
    }
    const parentIsListComponent = function (el) {
      return parent(el).map(isListComponent).getOr(false)
    }
    var getBlocksToIndent = function (editor) {
      return filter(map(editor.selection.getSelectedBlocks(), Element$$1.fromDom), (el) => !isListComponent(el) && !parentIsListComponent(el) && isEditable$1(el))
    }
    const handle = function (editor, command) {
      const { dom } = editor; const { selection } = editor; const { formatter } = editor
      const indentation = Settings.getIndentation(editor)
      const indentUnit = /[a-z%]+$/i.exec(indentation)[0]
      const indentValue = parseInt(indentation, 10)
      const useMargin = Settings.shouldIndentUseMargin(editor)
      const forcedRootBlock = Settings.getForcedRootBlock(editor)
      if (!editor.queryCommandState('InsertUnorderedList') && !editor.queryCommandState('InsertOrderedList')) {
        if (forcedRootBlock === '' && !dom.getParent(selection.getNode(), dom.isBlock)) {
          formatter.apply('div')
        }
      }
      each(getBlocksToIndent(editor), (block) => {
        indentElement(dom, command, useMargin, indentValue, indentUnit, block.dom())
      })
    }

    const each$h = Tools.each; const extend$3 = Tools.extend
    const map$3 = Tools.map; const inArray$2 = Tools.inArray
    function EditorCommands(editor) {
      let dom, selection, formatter
      const commands = {
        state: {},
        exec: {},
        value: {},
      }
      let bookmark
      editor.on('PreInit', () => {
        dom = editor.dom
        selection = editor.selection
        formatter = editor.formatter
      })
      const execCommand = function (command, ui, value, args) {
        let func; let customCommand; let state = false
        if (editor.removed) {
          return
        }
        if (!/^(mceAddUndoLevel|mceEndUndoLevel|mceBeginUndoLevel|mceRepaint)$/.test(command) && (!args || !args.skip_focus)) {
          editor.focus()
        } else {
          SelectionBookmark.restore(editor)
        }
        args = editor.fire('BeforeExecCommand', {
          command,
          ui,
          value,
        })
        if (args.isDefaultPrevented()) {
          return false
        }
        customCommand = command.toLowerCase()
        if (func = commands.exec[customCommand]) {
          func(customCommand, ui, value)
          editor.fire('ExecCommand', {
            command,
            ui,
            value,
          })
          return true
        }
        each$h(editor.plugins, (p) => {
          if (p.execCommand && p.execCommand(command, ui, value)) {
            editor.fire('ExecCommand', {
              command,
              ui,
              value,
            })
            state = true
            return false
          }
        })
        if (state) {
          return state
        }
        if (editor.theme && editor.theme.execCommand && editor.theme.execCommand(command, ui, value)) {
          editor.fire('ExecCommand', {
            command,
            ui,
            value,
          })
          return true
        }
        try {
          state = editor.getDoc().execCommand(command, ui, value)
        } catch (ex) {
        }
        if (state) {
          editor.fire('ExecCommand', {
            command,
            ui,
            value,
          })
          return true
        }
        return false
      }
      const queryCommandState = function (command) {
        let func
        if (editor.quirks.isHidden() || editor.removed) {
          return
        }
        command = command.toLowerCase()
        if (func = commands.state[command]) {
          return func(command)
        }
        try {
          return editor.getDoc().queryCommandState(command)
        } catch (ex) {
        }
        return false
      }
      const queryCommandValue = function (command) {
        let func
        if (editor.quirks.isHidden() || editor.removed) {
          return
        }
        command = command.toLowerCase()
        if (func = commands.value[command]) {
          return func(command)
        }
        try {
          return editor.getDoc().queryCommandValue(command)
        } catch (ex) {
        }
      }
      const addCommands = function (commandList, type) {
        type = type || 'exec'
        each$h(commandList, (callback, command) => {
          each$h(command.toLowerCase().split(','), (command) => {
            commands[type][command] = callback
          })
        })
      }
      const addCommand = function (command, callback, scope) {
        command = command.toLowerCase()
        commands.exec[command] = function (command, ui, value, args) {
          return callback.call(scope || editor, ui, value, args)
        }
      }
      const queryCommandSupported = function (command) {
        command = command.toLowerCase()
        if (commands.exec[command]) {
          return true
        }
        try {
          return editor.getDoc().queryCommandSupported(command)
        } catch (ex) {
        }
        return false
      }
      const addQueryStateHandler = function (command, callback, scope) {
        command = command.toLowerCase()
        commands.state[command] = function () {
          return callback.call(scope || editor)
        }
      }
      const addQueryValueHandler = function (command, callback, scope) {
        command = command.toLowerCase()
        commands.value[command] = function () {
          return callback.call(scope || editor)
        }
      }
      const hasCustomCommand = function (command) {
        command = command.toLowerCase()
        return !!commands.exec[command]
      }
      extend$3(this, {
        execCommand,
        queryCommandState,
        queryCommandValue,
        queryCommandSupported,
        addCommands,
        addCommand,
        addQueryStateHandler,
        addQueryValueHandler,
        hasCustomCommand,
      })
      const execNativeCommand = function (command, ui, value) {
        if (ui === undefined) {
          ui = false
        }
        if (value === undefined) {
          value = null
        }
        return editor.getDoc().execCommand(command, ui, value)
      }
      const isFormatMatch = function (name) {
        return formatter.match(name)
      }
      const toggleFormat = function (name, value) {
        formatter.toggle(name, value ? { value } : undefined)
        editor.nodeChanged()
      }
      const storeSelection = function (type) {
        bookmark = selection.getBookmark(type)
      }
      const restoreSelection = function () {
        selection.moveToBookmark(bookmark)
      }
      addCommands({
        'mceResetDesignMode,mceBeginUndoLevel': function () {
        },
        'mceEndUndoLevel,mceAddUndoLevel': function () {
          editor.undoManager.add()
        },
        'Cut,Copy,Paste': function (command) {
          const doc = editor.getDoc()
          let failed
          try {
            execNativeCommand(command)
          } catch (ex) {
            failed = true
          }
          if (command === 'paste' && !doc.queryCommandEnabled(command)) {
            failed = true
          }
          if (failed || !doc.queryCommandSupported(command)) {
            let msg = editor.translate('Your browser doesn\'t support direct access to the clipboard. ' + 'Please use the Ctrl+X/C/V keyboard shortcuts instead.')
            if (Env.mac) {
              msg = msg.replace(/Ctrl\+/g, '\u2318+')
            }
            editor.notificationManager.open({
              text: msg,
              type: 'error',
            })
          }
        },
        unlink() {
          if (selection.isCollapsed()) {
            const elm = editor.dom.getParent(editor.selection.getStart(), 'a')
            if (elm) {
              editor.dom.remove(elm, true)
            }
            return
          }
          formatter.remove('link')
        },
        'JustifyLeft,JustifyCenter,JustifyRight,JustifyFull,JustifyNone': function (command) {
          let align = command.substring(7)
          if (align === 'full') {
            align = 'justify'
          }
          each$h('left,center,right,justify'.split(','), (name) => {
            if (align !== name) {
              formatter.remove(`align${name}`)
            }
          })
          if (align !== 'none') {
            toggleFormat(`align${align}`)
          }
        },
        'InsertUnorderedList,InsertOrderedList': function (command) {
          let listElm, listParent
          execNativeCommand(command)
          listElm = dom.getParent(selection.getNode(), 'ol,ul')
          if (listElm) {
            listParent = listElm.parentNode
            if (/^(H[1-6]|P|ADDRESS|PRE)$/.test(listParent.nodeName)) {
              storeSelection()
              dom.split(listParent, listElm)
              restoreSelection()
            }
          }
        },
        'Bold,Italic,Underline,Strikethrough,Superscript,Subscript': function (command) {
          toggleFormat(command)
        },
        'ForeColor,HiliteColor': function (command, ui, value) {
          toggleFormat(command, value)
        },
        FontName(command, ui, value) {
          fontNameAction(editor, value)
        },
        FontSize(command, ui, value) {
          fontSizeAction(editor, value)
        },
        RemoveFormat(command) {
          formatter.remove(command)
        },
        mceBlockQuote() {
          toggleFormat('blockquote')
        },
        FormatBlock(command, ui, value) {
          return toggleFormat(value || 'p')
        },
        mceCleanup() {
          const bookmark = selection.getBookmark()
          editor.setContent(editor.getContent())
          selection.moveToBookmark(bookmark)
        },
        mceRemoveNode(command, ui, value) {
          const node = value || selection.getNode()
          if (node !== editor.getBody()) {
            storeSelection()
            editor.dom.remove(node, true)
            restoreSelection()
          }
        },
        mceSelectNodeDepth(command, ui, value) {
          let counter = 0
          dom.getParent(selection.getNode(), (node) => {
            if (node.nodeType === 1 && counter++ === value) {
              selection.select(node)
              return false
            }
          }, editor.getBody())
        },
        mceSelectNode(command, ui, value) {
          selection.select(value)
        },
        mceInsertContent(command, ui, value) {
          InsertContent.insertAtCaret(editor, value)
        },
        mceInsertRawHTML(command, ui, value) {
          selection.setContent('tiny_mce_marker')
          const content = editor.getContent()
          editor.setContent(content.replace(/tiny_mce_marker/g, () => value))
        },
        mceToggleFormat(command, ui, value) {
          toggleFormat(value)
        },
        mceSetContent(command, ui, value) {
          editor.setContent(value)
        },
        'Indent,Outdent': function (command) {
          handle(editor, command)
        },
        mceRepaint() {
        },
        InsertHorizontalRule() {
          editor.execCommand('mceInsertContent', false, '<hr />')
        },
        mceToggleVisualAid() {
          editor.hasVisual = !editor.hasVisual
          editor.addVisual()
        },
        mceReplaceContent(command, ui, value) {
          editor.execCommand('mceInsertContent', false, value.replace(/\{\$selection\}/g, selection.getContent({ format: 'text' })))
        },
        mceInsertLink(command, ui, value) {
          let anchor
          if (typeof value === 'string') {
            value = { href: value }
          }
          anchor = dom.getParent(selection.getNode(), 'a')
          value.href = value.href.replace(' ', '%20')
          if (!anchor || !value.href) {
            formatter.remove('link')
          }
          if (value.href) {
            formatter.apply('link', value, anchor)
          }
        },
        selectAll() {
          const editingHost = dom.getParent(selection.getStart(), NodeType.isContentEditableTrue)
          if (editingHost) {
            const rng = dom.createRng()
            rng.selectNodeContents(editingHost)
            selection.setRng(rng)
          }
        },
        delete() {
          DeleteCommands.deleteCommand(editor)
        },
        forwardDelete() {
          DeleteCommands.forwardDeleteCommand(editor)
        },
        mceNewDocument() {
          editor.setContent('')
        },
        InsertLineBreak(command, ui, value) {
          InsertBr.insert(editor, value)
          return true
        },
      })
      const alignStates = function (name) {
        return function () {
          const nodes = selection.isCollapsed() ? [dom.getParent(selection.getNode(), dom.isBlock)] : selection.getSelectedBlocks()
          const matches = map$3(nodes, (node) => !!formatter.matchNode(node, name))
          return inArray$2(matches, true) !== -1
        }
      }
      addCommands({
        JustifyLeft: alignStates('alignleft'),
        JustifyCenter: alignStates('aligncenter'),
        JustifyRight: alignStates('alignright'),
        JustifyFull: alignStates('alignjustify'),
        'Bold,Italic,Underline,Strikethrough,Superscript,Subscript': function (command) {
          return isFormatMatch(command)
        },
        mceBlockQuote() {
          return isFormatMatch('blockquote')
        },
        Outdent() {
          return canOutdent(editor)
        },
        'InsertUnorderedList,InsertOrderedList': function (command) {
          const list = dom.getParent(selection.getNode(), 'ul,ol')
          return list && (command === 'insertunorderedlist' && list.tagName === 'UL' || command === 'insertorderedlist' && list.tagName === 'OL')
        },
      }, 'state')
      addCommands({
        Undo() {
          editor.undoManager.undo()
        },
        Redo() {
          editor.undoManager.redo()
        },
      })
      addQueryValueHandler('FontName', () => fontNameQuery(editor), this)
      addQueryValueHandler('FontSize', () => fontSizeQuery(editor), this)
    }

    const nativeEvents = Tools.makeMap('focus blur focusin focusout click dblclick mousedown mouseup mousemove mouseover beforepaste paste cut copy selectionchange ' + 'mouseout mouseenter mouseleave wheel keydown keypress keyup input contextmenu dragstart dragend dragover ' + 'draggesture dragdrop drop drag submit ' + 'compositionstart compositionend compositionupdate touchstart touchmove touchend', ' ')
    const Dispatcher = function (settings) {
      const self = this
      let scope; let bindings = {}; let toggleEvent
      const returnFalse = function () {
        return false
      }
      const returnTrue = function () {
        return true
      }
      settings = settings || {}
      scope = settings.scope || self
      toggleEvent = settings.toggleEvent || returnFalse
      const fire = function (name, args) {
        let handlers, i, l, callback
        name = name.toLowerCase()
        args = args || {}
        args.type = name
        if (!args.target) {
          args.target = scope
        }
        if (!args.preventDefault) {
          args.preventDefault = function () {
            args.isDefaultPrevented = returnTrue
          }
          args.stopPropagation = function () {
            args.isPropagationStopped = returnTrue
          }
          args.stopImmediatePropagation = function () {
            args.isImmediatePropagationStopped = returnTrue
          }
          args.isDefaultPrevented = returnFalse
          args.isPropagationStopped = returnFalse
          args.isImmediatePropagationStopped = returnFalse
        }
        if (settings.beforeFire) {
          settings.beforeFire(args)
        }
        handlers = bindings[name]
        if (handlers) {
          for (i = 0, l = handlers.length; i < l; i++) {
            callback = handlers[i]
            if (callback.once) {
              off(name, callback.func)
            }
            if (args.isImmediatePropagationStopped()) {
              args.stopPropagation()
              return args
            }
            if (callback.func.call(scope, args) === false) {
              args.preventDefault()
              return args
            }
          }
        }
        return args
      }
      const on = function (name, callback, prepend, extra) {
        let handlers, names, i
        if (callback === false) {
          callback = returnFalse
        }
        if (callback) {
          callback = { func: callback }
          if (extra) {
            Tools.extend(callback, extra)
          }
          names = name.toLowerCase().split(' ')
          i = names.length
          while (i--) {
            name = names[i]
            handlers = bindings[name]
            if (!handlers) {
              handlers = bindings[name] = []
              toggleEvent(name, true)
            }
            if (prepend) {
              handlers.unshift(callback)
            } else {
              handlers.push(callback)
            }
          }
        }
        return self
      }
      var off = function (name, callback) {
        let i, handlers, bindingName, names, hi
        if (name) {
          names = name.toLowerCase().split(' ')
          i = names.length
          while (i--) {
            name = names[i]
            handlers = bindings[name]
            if (!name) {
              for (bindingName in bindings) {
                toggleEvent(bindingName, false)
                delete bindings[bindingName]
              }
              return self
            }
            if (handlers) {
              if (!callback) {
                handlers.length = 0
              } else {
                hi = handlers.length
                while (hi--) {
                  if (handlers[hi].func === callback) {
                    handlers = handlers.slice(0, hi).concat(handlers.slice(hi + 1))
                    bindings[name] = handlers
                  }
                }
              }
              if (!handlers.length) {
                toggleEvent(name, false)
                delete bindings[name]
              }
            }
          }
        } else {
          for (name in bindings) {
            toggleEvent(name, false)
          }
          bindings = {}
        }
        return self
      }
      const once = function (name, callback, prepend) {
        return on(name, callback, prepend, { once: true })
      }
      const has = function (name) {
        name = name.toLowerCase()
        return !(!bindings[name] || bindings[name].length === 0)
      }
      self.fire = fire
      self.on = on
      self.off = off
      self.once = once
      self.has = has
    }
    Dispatcher.isNative = function (name) {
      return !!nativeEvents[name.toLowerCase()]
    }

    const getEventDispatcher = function (obj) {
      if (!obj._eventDispatcher) {
        obj._eventDispatcher = new Dispatcher({
          scope: obj,
          toggleEvent(name, state) {
            if (Dispatcher.isNative(name) && obj.toggleNativeEvent) {
              obj.toggleNativeEvent(name, state)
            }
          },
        })
      }
      return obj._eventDispatcher
    }
    const Observable = {
      fire(name, args, bubble) {
        const self = this
        if (self.removed && name !== 'remove' && name !== 'detach') {
          return args
        }
        args = getEventDispatcher(self).fire(name, args, bubble)
        if (bubble !== false && self.parent) {
          let parent = self.parent()
          while (parent && !args.isPropagationStopped()) {
            parent.fire(name, args, false)
            parent = parent.parent()
          }
        }
        return args
      },
      on(name, callback, prepend) {
        return getEventDispatcher(this).on(name, callback, prepend)
      },
      off(name, callback) {
        return getEventDispatcher(this).off(name, callback)
      },
      once(name, callback) {
        return getEventDispatcher(this).once(name, callback)
      },
      hasEventListeners(name) {
        return getEventDispatcher(this).has(name)
      },
    }

    const DOM$6 = DOMUtils$1.DOM
    let customEventRootDelegates
    const getEventTarget = function (editor, eventName) {
      if (eventName === 'selectionchange') {
        return editor.getDoc()
      }
      if (!editor.inline && /^mouse|touch|click|contextmenu|drop|dragover|dragend/.test(eventName)) {
        return editor.getDoc().documentElement
      }
      if (editor.settings.event_root) {
        if (!editor.eventRoot) {
          editor.eventRoot = DOM$6.select(editor.settings.event_root)[0]
        }
        return editor.eventRoot
      }
      return editor.getBody()
    }
    const isListening = function (editor) {
      return !editor.hidden && !editor.readonly
    }
    const fireEvent = function (editor, eventName, e) {
      if (isListening(editor)) {
        editor.fire(eventName, e)
      } else if (isReadOnly(editor)) {
        e.preventDefault()
      }
    }
    const bindEventDelegate = function (editor, eventName) {
      let eventRootElm, delegate
      if (!editor.delegates) {
        editor.delegates = {}
      }
      if (editor.delegates[eventName] || editor.removed) {
        return
      }
      eventRootElm = getEventTarget(editor, eventName)
      if (editor.settings.event_root) {
        if (!customEventRootDelegates) {
          customEventRootDelegates = {}
          editor.editorManager.on('removeEditor', () => {
            let name
            if (!editor.editorManager.activeEditor) {
              if (customEventRootDelegates) {
                for (name in customEventRootDelegates) {
                  editor.dom.unbind(getEventTarget(editor, name))
                }
                customEventRootDelegates = null
              }
            }
          })
        }
        if (customEventRootDelegates[eventName]) {
          return
        }
        delegate = function (e) {
          const { target } = e
          const editors = editor.editorManager.get()
          let i = editors.length
          while (i--) {
            const body = editors[i].getBody()
            if (body === target || DOM$6.isChildOf(target, body)) {
              fireEvent(editors[i], eventName, e)
            }
          }
        }
        customEventRootDelegates[eventName] = delegate
        DOM$6.bind(eventRootElm, eventName, delegate)
      } else {
        delegate = function (e) {
          fireEvent(editor, eventName, e)
        }
        DOM$6.bind(eventRootElm, eventName, delegate)
        editor.delegates[eventName] = delegate
      }
    }
    let EditorObservable = {
      bindPendingEventDelegates() {
        const self = this
        Tools.each(self._pendingNativeEvents, (name) => {
          bindEventDelegate(self, name)
        })
      },
      toggleNativeEvent(name, state) {
        const self = this
        if (name === 'focus' || name === 'blur') {
          return
        }
        if (state) {
          if (self.initialized) {
            bindEventDelegate(self, name)
          } else if (!self._pendingNativeEvents) {
            self._pendingNativeEvents = [name]
          } else {
            self._pendingNativeEvents.push(name)
          }
        } else if (self.initialized) {
          self.dom.unbind(getEventTarget(self, name), name, self.delegates[name])
          delete self.delegates[name]
        }
      },
      unbindAllNativeEvents() {
        const self = this
        const body = self.getBody()
        const { dom } = self
        let name
        if (self.delegates) {
          for (name in self.delegates) {
            self.dom.unbind(getEventTarget(self, name), name, self.delegates[name])
          }
          delete self.delegates
        }
        if (!self.inline && body && dom) {
          body.onload = null
          dom.unbind(self.getWin())
          dom.unbind(self.getDoc())
        }
        if (dom) {
          dom.unbind(body)
          dom.unbind(self.getContainer())
        }
      },
    }
    EditorObservable = Tools.extend({}, Observable, EditorObservable)
    const EditorObservable$1 = EditorObservable

    const each$i = Tools.each; const explode$3 = Tools.explode
    const keyCodeLookup = {
      f9: 120,
      f10: 121,
      f11: 122,
    }
    const modifierNames = Tools.makeMap('alt,ctrl,shift,meta,access')
    function Shortcuts(editor) {
      const self = this
      const shortcuts = {}
      let pendingPatterns = []
      const parseShortcut = function (pattern) {
        let id, key
        const shortcut = {}
        each$i(explode$3(pattern, '+'), (value) => {
          if (value in modifierNames) {
            shortcut[value] = true
          } else if (/^[0-9]{2,}$/.test(value)) {
            shortcut.keyCode = parseInt(value, 10)
          } else {
            shortcut.charCode = value.charCodeAt(0)
            shortcut.keyCode = keyCodeLookup[value] || value.toUpperCase().charCodeAt(0)
          }
        })
        id = [shortcut.keyCode]
        for (key in modifierNames) {
          if (shortcut[key]) {
            id.push(key)
          } else {
            shortcut[key] = false
          }
        }
        shortcut.id = id.join(',')
        if (shortcut.access) {
          shortcut.alt = true
          if (Env.mac) {
            shortcut.ctrl = true
          } else {
            shortcut.shift = true
          }
        }
        if (shortcut.meta) {
          if (Env.mac) {
            shortcut.meta = true
          } else {
            shortcut.ctrl = true
            shortcut.meta = false
          }
        }
        return shortcut
      }
      const createShortcut = function (pattern, desc, cmdFunc, scope) {
        let shortcuts
        shortcuts = Tools.map(explode$3(pattern, '>'), parseShortcut)
        shortcuts[shortcuts.length - 1] = Tools.extend(shortcuts[shortcuts.length - 1], {
          func: cmdFunc,
          scope: scope || editor,
        })
        return Tools.extend(shortcuts[0], {
          desc: editor.translate(desc),
          subpatterns: shortcuts.slice(1),
        })
      }
      const hasModifier = function (e) {
        return e.altKey || e.ctrlKey || e.metaKey
      }
      const isFunctionKey = function (e) {
        return e.type === 'keydown' && e.keyCode >= 112 && e.keyCode <= 123
      }
      const matchShortcut = function (e, shortcut) {
        if (!shortcut) {
          return false
        }
        if (shortcut.ctrl !== e.ctrlKey || shortcut.meta !== e.metaKey) {
          return false
        }
        if (shortcut.alt !== e.altKey || shortcut.shift !== e.shiftKey) {
          return false
        }
        if (e.keyCode === shortcut.keyCode || e.charCode && e.charCode === shortcut.charCode) {
          e.preventDefault()
          return true
        }
        return false
      }
      const executeShortcutAction = function (shortcut) {
        return shortcut.func ? shortcut.func.call(shortcut.scope) : null
      }
      editor.on('keyup keypress keydown', (e) => {
        if ((hasModifier(e) || isFunctionKey(e)) && !e.isDefaultPrevented()) {
          each$i(shortcuts, (shortcut) => {
            if (matchShortcut(e, shortcut)) {
              pendingPatterns = shortcut.subpatterns.slice(0)
              if (e.type === 'keydown') {
                executeShortcutAction(shortcut)
              }
              return true
            }
          })
          if (matchShortcut(e, pendingPatterns[0])) {
            if (pendingPatterns.length === 1) {
              if (e.type === 'keydown') {
                executeShortcutAction(pendingPatterns[0])
              }
            }
            pendingPatterns.shift()
          }
        }
      })
      self.add = function (pattern, desc, cmdFunc, scope) {
        let cmd
        cmd = cmdFunc
        if (typeof cmdFunc === 'string') {
          cmdFunc = function () {
            editor.execCommand(cmd, false, null)
          }
        } else if (Tools.isArray(cmd)) {
          cmdFunc = function () {
            editor.execCommand(cmd[0], cmd[1], cmd[2])
          }
        }
        each$i(explode$3(Tools.trim(pattern.toLowerCase())), (pattern) => {
          const shortcut = createShortcut(pattern, desc, cmdFunc, scope)
          shortcuts[shortcut.id] = shortcut
        })
        return true
      }
      self.remove = function (pattern) {
        const shortcut = createShortcut(pattern)
        if (shortcuts[shortcut.id]) {
          delete shortcuts[shortcut.id]
          return true
        }
        return false
      }
    }

    const each$j = Tools.each; const trim$4 = Tools.trim
    const queryParts = 'source protocol authority userInfo user password host port relative path directory file query anchor'.split(' ')
    const DEFAULT_PORTS = {
      ftp: 21,
      http: 80,
      https: 443,
      mailto: 25,
    }
    var URI = function (url, settings) {
      const self$$1 = this
      let baseUri, baseUrl
      url = trim$4(url)
      settings = self$$1.settings = settings || {}
      baseUri = settings.base_uri
      if (/^([\w\-]+):([^\/]{2})/i.test(url) || /^\s*#/.test(url)) {
        self$$1.source = url
        return
      }
      const isProtocolRelative = url.indexOf('//') === 0
      if (url.indexOf('/') === 0 && !isProtocolRelative) {
        url = `${baseUri ? baseUri.protocol || 'http' : 'http'}://mce_host${url}`
      }
      if (!/^[\w\-]*:?\/\//.test(url)) {
        baseUrl = settings.base_uri ? settings.base_uri.path : new URI(document.location.href).directory
        if (settings.base_uri.protocol == '') {
          url = `//mce_host${self$$1.toAbsPath(baseUrl, url)}`
        } else {
          url = /([^#?]*)([#?]?.*)/.exec(url)
          url = `${baseUri && baseUri.protocol || 'http'}://mce_host${self$$1.toAbsPath(baseUrl, url[1])}${url[2]}`
        }
      }
      url = url.replace(/@@/g, '(mce_at)')
      url = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(url)
      each$j(queryParts, (v, i) => {
        let part = url[i]
        if (part) {
          part = part.replace(/\(mce_at\)/g, '@@')
        }
        self$$1[v] = part
      })
      if (baseUri) {
        if (!self$$1.protocol) {
          self$$1.protocol = baseUri.protocol
        }
        if (!self$$1.userInfo) {
          self$$1.userInfo = baseUri.userInfo
        }
        if (!self$$1.port && self$$1.host === 'mce_host') {
          self$$1.port = baseUri.port
        }
        if (!self$$1.host || self$$1.host === 'mce_host') {
          self$$1.host = baseUri.host
        }
        self$$1.source = ''
      }
      if (isProtocolRelative) {
        self$$1.protocol = ''
      }
    }
    URI.prototype = {
      setPath(path) {
        const self$$1 = this
        path = /^(.*?)\/?(\w+)?$/.exec(path)
        self$$1.path = path[0]
        self$$1.directory = path[1]
        self$$1.file = path[2]
        self$$1.source = ''
        self$$1.getURI()
      },
      toRelative(uri) {
        const self$$1 = this
        let output
        if (uri === './') {
          return uri
        }
        uri = new URI(uri, { base_uri: self$$1 })
        if (uri.host !== 'mce_host' && self$$1.host !== uri.host && uri.host || self$$1.port !== uri.port || self$$1.protocol !== uri.protocol && uri.protocol !== '') {
          return uri.getURI()
        }
        const tu = self$$1.getURI(); const uu = uri.getURI()
        if (tu === uu || tu.charAt(tu.length - 1) === '/' && tu.substr(0, tu.length - 1) === uu) {
          return tu
        }
        output = self$$1.toRelPath(self$$1.path, uri.path)
        if (uri.query) {
          output += `?${uri.query}`
        }
        if (uri.anchor) {
          output += `#${uri.anchor}`
        }
        return output
      },
      toAbsolute(uri, noHost) {
        uri = new URI(uri, { base_uri: this })
        return uri.getURI(noHost && this.isSameOrigin(uri))
      },
      isSameOrigin(uri) {
        if (this.host == uri.host && this.protocol == uri.protocol) {
          if (this.port == uri.port) {
            return true
          }
          const defaultPort = DEFAULT_PORTS[this.protocol]
          if (defaultPort && (this.port || defaultPort) == (uri.port || defaultPort)) {
            return true
          }
        }
        return false
      },
      toRelPath(base, path) {
        let items; let breakPoint = 0; let out = ''; let i; let l
        base = base.substring(0, base.lastIndexOf('/'))
        base = base.split('/')
        items = path.split('/')
        if (base.length >= items.length) {
          for (i = 0, l = base.length; i < l; i++) {
            if (i >= items.length || base[i] !== items[i]) {
              breakPoint = i + 1
              break
            }
          }
        }
        if (base.length < items.length) {
          for (i = 0, l = items.length; i < l; i++) {
            if (i >= base.length || base[i] !== items[i]) {
              breakPoint = i + 1
              break
            }
          }
        }
        if (breakPoint === 1) {
          return path
        }
        for (i = 0, l = base.length - (breakPoint - 1); i < l; i++) {
          out += '../'
        }
        for (i = breakPoint - 1, l = items.length; i < l; i++) {
          if (i !== breakPoint - 1) {
            out += `/${items[i]}`
          } else {
            out += items[i]
          }
        }
        return out
      },
      toAbsPath(base, path) {
        let i; let nb = 0; let o = []; let tr; let outPath
        tr = /\/$/.test(path) ? '/' : ''
        base = base.split('/')
        path = path.split('/')
        each$j(base, (k) => {
          if (k) {
            o.push(k)
          }
        })
        base = o
        for (i = path.length - 1, o = []; i >= 0; i--) {
          if (path[i].length === 0 || path[i] === '.') {
            continue
          }
          if (path[i] === '..') {
            nb++
            continue
          }
          if (nb > 0) {
            nb--
            continue
          }
          o.push(path[i])
        }
        i = base.length - nb
        if (i <= 0) {
          outPath = o.reverse().join('/')
        } else {
          outPath = `${base.slice(0, i).join('/')}/${o.reverse().join('/')}`
        }
        if (outPath.indexOf('/') !== 0) {
          outPath = `/${outPath}`
        }
        if (tr && outPath.lastIndexOf('/') !== outPath.length - 1) {
          outPath += tr
        }
        return outPath
      },
      getURI(noProtoHost) {
        let s
        const self$$1 = this
        if (!self$$1.source || noProtoHost) {
          s = ''
          if (!noProtoHost) {
            if (self$$1.protocol) {
              s += `${self$$1.protocol}://`
            } else {
              s += '//'
            }
            if (self$$1.userInfo) {
              s += `${self$$1.userInfo}@`
            }
            if (self$$1.host) {
              s += self$$1.host
            }
            if (self$$1.port) {
              s += `:${self$$1.port}`
            }
          }
          if (self$$1.path) {
            s += self$$1.path
          }
          if (self$$1.query) {
            s += `?${self$$1.query}`
          }
          if (self$$1.anchor) {
            s += `#${self$$1.anchor}`
          }
          self$$1.source = s
        }
        return self$$1.source
      },
    }
    URI.parseDataUri = function (uri) {
      let type, matches
      uri = decodeURIComponent(uri).split(',')
      matches = /data:([^;]+)/.exec(uri[0])
      if (matches) {
        type = matches[1]
      }
      return {
        type,
        data: uri[1],
      }
    }
    URI.getDocumentBaseUrl = function (loc) {
      let baseUrl
      if (loc.protocol.indexOf('http') !== 0 && loc.protocol !== 'file:') {
        baseUrl = loc.href
      } else {
        baseUrl = `${loc.protocol}//${loc.host}${loc.pathname}`
      }
      if (/^[^:]+:\/\/\/?[^\/]+\//.test(baseUrl)) {
        baseUrl = baseUrl.replace(/[\?#].*$/, '').replace(/[\/\\][^\/]+$/, '')
        if (!/[\/\\]$/.test(baseUrl)) {
          baseUrl += '/'
        }
      }
      return baseUrl
    }

    const add$5 = function (editor, name, settings) {
      const isActive = function () {
        return Option.from(editor.queryCommandValue('ToggleSidebar')).is(name)
      }
      const sidebars = editor.sidebars ? editor.sidebars : []
      sidebars.push({
        name,
        settings,
      })
      editor.sidebars = sidebars
      editor.ui.registry.addToggleButton(name, {
        icon: settings.icon,
        tooltip: settings.tooltip,
        onAction(buttonApi) {
          editor.execCommand('ToggleSidebar', false, name)
          buttonApi.setActive(isActive())
        },
        onSetup(buttonApi) {
          const handleToggle = function () {
            return buttonApi.setActive(isActive())
          }
          editor.on('ToggleSidebar', handleToggle)
          return function () {
            editor.off('ToggleSidebar', handleToggle)
          }
        },
      })
    }
    const Sidebar = { add: add$5 }

    const DOM$7 = DOMUtils$1.DOM
    const extend$4 = Tools.extend; const each$k = Tools.each
    const resolve$4 = Tools.resolve
    const ie$2 = Env.ie
    const Editor = function (id, settings, editorManager) {
      const self = this
      const documentBaseUrl = self.documentBaseUrl = editorManager.documentBaseURL
      const baseUri = editorManager.baseURI
      settings = getEditorSettings(self, id, documentBaseUrl, editorManager.defaultSettings, settings)
      self.settings = settings
      AddOnManager.languageLoad = settings.language_load
      AddOnManager.baseURL = editorManager.baseURL
      self.id = id
      self.setDirty(false)
      self.plugins = {}
      self.documentBaseURI = new URI(settings.document_base_url, { base_uri: baseUri })
      self.baseURI = baseUri
      self.contentCSS = []
      self.contentStyles = []
      self.shortcuts = new Shortcuts(self)
      self.loadedCSS = {}
      self.editorCommands = new EditorCommands(self)
      self.suffix = editorManager.suffix
      self.editorManager = editorManager
      self.inline = settings.inline
      self.buttons = {}
      self.menuItems = {}
      if (settings.cache_suffix) {
        Env.cacheSuffix = settings.cache_suffix.replace(/^[\?\&]+/, '')
      }
      if (settings.override_viewport === false) {
        Env.overrideViewPort = false
      }
      const registry = create$3()
      self.ui = { registry }
      editorManager.fire('SetupEditor', { editor: self })
      self.execCallback('setup', self)
      self.$ = DomQuery.overrideDefaults(() => ({
        context: self.inline ? self.getBody() : self.getDoc(),
        element: self.getBody(),
      }))
    }
    Editor.prototype = {
      render() {
        Render.render(this)
      },
      focus(skipFocus) {
        EditorFocus.focus(this, skipFocus)
      },
      hasFocus() {
        return EditorFocus.hasFocus(this)
      },
      execCallback(name) {
        const x = []
        for (let _i = 1; _i < arguments.length; _i++) {
          x[_i - 1] = arguments[_i]
        }
        const self = this
        let callback = self.settings[name]; let scope
        if (!callback) {
          return
        }
        if (self.callbackLookup && (scope = self.callbackLookup[name])) {
          callback = scope.func
          scope = scope.scope
        }
        if (typeof callback === 'string') {
          scope = callback.replace(/\.\w+$/, '')
          scope = scope ? resolve$4(scope) : 0
          callback = resolve$4(callback)
          self.callbackLookup = self.callbackLookup || {}
          self.callbackLookup[name] = {
            func: callback,
            scope,
          }
        }
        return callback.apply(scope || self, Array.prototype.slice.call(arguments, 1))
      },
      translate(text) {
        return I18n.translate(text)
      },
      getParam(name, defaultVal, type) {
        return getParam(this, name, defaultVal, type)
      },
      nodeChanged(args) {
        this._nodeChangeDispatcher.nodeChanged(args)
      },
      addButton(name, settings) {
        console.error('editor.addButton is deprecated in tinymce 5x, use editor.ui.registry.addButton or editor.ui.registry.addToggleButton or editor.ui.registry.addSplitButton instead')
      },
      addSidebar(name, settings) {
        return Sidebar.add(this, name, settings)
      },
      addMenuItem(name, settings) {
        console.error('editor.addMenuItem is deprecated in tinymce 5x, use editor.ui.registry.addMenuItem instead')
      },
      addContextToolbar(predicate, items) {
        console.error('editor.addContextToolbar is deprecated in tinymce 5x, use editor.ui.registry.addContextToolbar instead')
      },
      addCommand(name, callback, scope) {
        this.editorCommands.addCommand(name, callback, scope)
      },
      addQueryStateHandler(name, callback, scope) {
        this.editorCommands.addQueryStateHandler(name, callback, scope)
      },
      addQueryValueHandler(name, callback, scope) {
        this.editorCommands.addQueryValueHandler(name, callback, scope)
      },
      addShortcut(pattern, desc, cmdFunc, scope) {
        this.shortcuts.add(pattern, desc, cmdFunc, scope)
      },
      execCommand(cmd, ui, value, args) {
        return this.editorCommands.execCommand(cmd, ui, value, args)
      },
      queryCommandState(cmd) {
        return this.editorCommands.queryCommandState(cmd)
      },
      queryCommandValue(cmd) {
        return this.editorCommands.queryCommandValue(cmd)
      },
      queryCommandSupported(cmd) {
        return this.editorCommands.queryCommandSupported(cmd)
      },
      show() {
        const self = this
        if (self.hidden) {
          self.hidden = false
          if (self.inline) {
            self.getBody().contentEditable = true
          } else {
            DOM$7.show(self.getContainer())
            DOM$7.hide(self.id)
          }
          self.load()
          self.fire('show')
        }
      },
      hide() {
        const self = this; const doc = self.getDoc()
        if (!self.hidden) {
          if (ie$2 && doc && !self.inline) {
            doc.execCommand('SelectAll')
          }
          self.save()
          if (self.inline) {
            self.getBody().contentEditable = false
            if (self === self.editorManager.focusedEditor) {
              self.editorManager.focusedEditor = null
            }
          } else {
            DOM$7.hide(self.getContainer())
            DOM$7.setStyle(self.id, 'display', self.orgDisplay)
          }
          self.hidden = true
          self.fire('hide')
        }
      },
      isHidden() {
        return !!this.hidden
      },
      setProgressState(state, time) {
        this.fire('ProgressState', {
          state,
          time,
        })
      },
      load(args) {
        const self = this
        let elm = self.getElement(); let html
        if (self.removed) {
          return ''
        }
        if (elm) {
          args = args || {}
          args.load = true
          html = self.setContent(elm.value !== undefined ? elm.value : elm.innerHTML, args)
          args.element = elm
          if (!args.no_events) {
            self.fire('LoadContent', args)
          }
          args.element = elm = null
          return html
        }
      },
      save(args) {
        const self = this
        let elm = self.getElement(); let html; let form
        if (!elm || !self.initialized || self.removed) {
          return
        }
        args = args || {}
        args.save = true
        args.element = elm
        html = args.content = self.getContent(args)
        if (!args.no_events) {
          self.fire('SaveContent', args)
        }
        if (args.format === 'raw') {
          self.fire('RawSaveContent', args)
        }
        html = args.content
        if (!/TEXTAREA|INPUT/i.test(elm.nodeName)) {
          if (args.is_removing || !self.inline) {
            elm.innerHTML = html
          }
          if (form = DOM$7.getParent(self.id, 'form')) {
            each$k(form.elements, (elm) => {
              if (elm.name === self.id) {
                elm.value = html
                return false
              }
            })
          }
        } else {
          elm.value = html
        }
        args.element = elm = null
        if (args.set_dirty !== false) {
          self.setDirty(false)
        }
        return html
      },
      setContent(content, args) {
        return setContent(this, content, args)
      },
      getContent(args) {
        return getContent(this, args)
      },
      insertContent(content, args) {
        if (args) {
          content = extend$4({ content }, args)
        }
        this.execCommand('mceInsertContent', false, content)
      },
      isDirty() {
        return !this.isNotDirty
      },
      setDirty(state) {
        const oldState = !this.isNotDirty
        this.isNotDirty = !state
        if (state && state !== oldState) {
          this.fire('dirty')
        }
      },
      setMode(mode) {
        setMode(this, mode)
      },
      getContainer() {
        const self = this
        if (!self.container) {
          self.container = DOM$7.get(self.editorContainer || `${self.id}_parent`)
        }
        return self.container
      },
      getContentAreaContainer() {
        return this.contentAreaContainer
      },
      getElement() {
        if (!this.targetElm) {
          this.targetElm = DOM$7.get(this.id)
        }
        return this.targetElm
      },
      getWin() {
        const self = this
        let elm
        if (!self.contentWindow) {
          elm = self.iframeElement
          if (elm) {
            self.contentWindow = elm.contentWindow
          }
        }
        return self.contentWindow
      },
      getDoc() {
        const self = this
        let win
        if (!self.contentDocument) {
          win = self.getWin()
          if (win) {
            self.contentDocument = win.document
          }
        }
        return self.contentDocument
      },
      getBody() {
        const doc = this.getDoc()
        return this.bodyElement || (doc ? doc.body : null)
      },
      convertURL(url, name, elm) {
        const self = this; const { settings } = self
        if (settings.urlconverter_callback) {
          return self.execCallback('urlconverter_callback', url, elm, true, name)
        }
        if (!settings.convert_urls || elm && elm.nodeName === 'LINK' || url.indexOf('file:') === 0 || url.length === 0) {
          return url
        }
        if (settings.relative_urls) {
          return self.documentBaseURI.toRelative(url)
        }
        url = self.documentBaseURI.toAbsolute(url, settings.remove_script_host)
        return url
      },
      addVisual(elm) {
        const self = this
        const { settings } = self
        const { dom } = self
        let cls
        elm = elm || self.getBody()
        if (self.hasVisual === undefined) {
          self.hasVisual = settings.visual
        }
        each$k(dom.select('table,a', elm), (elm) => {
          let value
          switch (elm.nodeName) {
            case 'TABLE':
              cls = settings.visual_table_class || 'mce-item-table'
              value = dom.getAttrib(elm, 'border')
              if ((!value || value === '0') && self.hasVisual) {
                dom.addClass(elm, cls)
              } else {
                dom.removeClass(elm, cls)
              }
              return
            case 'A':
              if (!dom.getAttrib(elm, 'href')) {
                value = dom.getAttrib(elm, 'name') || elm.id
                cls = settings.visual_anchor_class || 'mce-item-anchor'
                if (value && self.hasVisual) {
                  dom.addClass(elm, cls)
                } else {
                  dom.removeClass(elm, cls)
                }
              }
          }
        })
        self.fire('VisualAid', {
          element: elm,
          hasVisual: self.hasVisual,
        })
      },
      remove() {
        remove$8(this)
      },
      destroy(automatic) {
        destroy(this, automatic)
      },
      uploadImages(callback) {
        return this.editorUpload.uploadImages(callback)
      },
      _scanForImages() {
        return this.editorUpload.scanForImages()
      },
    }
    extend$4(Editor.prototype, EditorObservable$1)

    const isEditorUIElement = function (elm) {
      return elm.className.toString().indexOf('tox-') !== -1 || elm.className.toString().indexOf('mce-') !== -1
    }
    const FocusManager = { isEditorUIElement }

    const isManualNodeChange = function (e) {
      return e.type === 'nodechange' && e.selectionChange
    }
    const registerPageMouseUp = function (editor, throttledStore) {
      const mouseUpPage = function () {
        throttledStore.throttle()
      }
      DOMUtils$1.DOM.bind(document, 'mouseup', mouseUpPage)
      editor.on('remove', () => {
        DOMUtils$1.DOM.unbind(document, 'mouseup', mouseUpPage)
      })
    }
    const registerFocusOut = function (editor) {
      editor.on('focusout', () => {
        SelectionBookmark.store(editor)
      })
    }
    const registerMouseUp = function (editor, throttledStore) {
      editor.on('mouseup touchend', (e) => {
        throttledStore.throttle()
      })
    }
    const registerEditorEvents = function (editor, throttledStore) {
      const { browser } = PlatformDetection$1.detect()
      if (browser.isIE()) {
        registerFocusOut(editor)
      } else {
        registerMouseUp(editor, throttledStore)
      }
      editor.on('keyup nodechange', (e) => {
        if (!isManualNodeChange(e)) {
          SelectionBookmark.store(editor)
        }
      })
    }
    const register$3 = function (editor) {
      const throttledStore = first$1(() => {
        SelectionBookmark.store(editor)
      }, 0)
      if (editor.inline) {
        registerPageMouseUp(editor, throttledStore)
      }
      editor.on('init', () => {
        registerEditorEvents(editor, throttledStore)
      })
      editor.on('remove', () => {
        throttledStore.cancel()
      })
    }
    const SelectionRestore = { register: register$3 }

    let documentFocusInHandler
    const DOM$8 = DOMUtils$1.DOM
    const isEditorUIElement$1 = function (elm) {
      return FocusManager.isEditorUIElement(elm)
    }
    const isUIElement = function (editor, elm) {
      const customSelector = editor ? editor.settings.custom_ui_selector : ''
      const parent$$1 = DOM$8.getParent(elm, (elm) => isEditorUIElement$1(elm) || (customSelector ? editor.dom.is(elm, customSelector) : false))
      return parent$$1 !== null
    }
    const getActiveElement = function () {
      try {
        return document.activeElement
      } catch (ex) {
        return document.body
      }
    }
    const registerEvents = function (editorManager, e) {
      const { editor } = e
      SelectionRestore.register(editor)
      editor.on('focusin', function () {
        const self$$1 = this
        const { focusedEditor } = editorManager
        if (focusedEditor !== self$$1) {
          if (focusedEditor) {
            focusedEditor.fire('blur', { focusedEditor: self$$1 })
          }
          editorManager.setActive(self$$1)
          editorManager.focusedEditor = self$$1
          self$$1.fire('focus', { blurredEditor: focusedEditor })
          self$$1.focus(true)
        }
      })
      editor.on('focusout', function () {
        const self$$1 = this
        Delay.setEditorTimeout(self$$1, () => {
          const { focusedEditor } = editorManager
          if (!isUIElement(self$$1, getActiveElement()) && focusedEditor === self$$1) {
            self$$1.fire('blur', { focusedEditor: null })
            editorManager.focusedEditor = null
          }
        })
      })
      if (!documentFocusInHandler) {
        documentFocusInHandler = function (e) {
          const { activeEditor } = editorManager
          let target
          target = e.target
          if (activeEditor && target.ownerDocument === document) {
            if (target !== document.body && !isUIElement(activeEditor, target) && editorManager.focusedEditor === activeEditor) {
              activeEditor.fire('blur', { focusedEditor: null })
              editorManager.focusedEditor = null
            }
          }
        }
        DOM$8.bind(document, 'focusin', documentFocusInHandler)
      }
    }
    const unregisterDocumentEvents = function (editorManager, e) {
      if (editorManager.focusedEditor === e.editor) {
        editorManager.focusedEditor = null
      }
      if (!editorManager.activeEditor) {
        DOM$8.unbind(document, 'focusin', documentFocusInHandler)
        documentFocusInHandler = null
      }
    }
    const setup$g = function (editorManager) {
      editorManager.on('AddEditor', curry(registerEvents, editorManager))
      editorManager.on('RemoveEditor', curry(unregisterDocumentEvents, editorManager))
    }
    const FocusController = {
      setup: setup$g,
      isEditorUIElement: isEditorUIElement$1,
      isUIElement,
    }

    const DOM$9 = DOMUtils$1.DOM
    const explode$4 = Tools.explode; const each$l = Tools.each; const extend$5 = Tools.extend
    let instanceCounter = 0; let beforeUnloadDelegate; let EditorManager; let boundGlobalEvents = false
    const legacyEditors = []
    let editors = []
    const isValidLegacyKey = function (id) {
      return id !== 'length'
    }
    const globalEventDelegate = function (e) {
      each$l(EditorManager.get(), (editor) => {
        if (e.type === 'scroll') {
          editor.fire('ScrollWindow', e)
        } else {
          editor.fire('ResizeWindow', e)
        }
      })
    }
    const toggleGlobalEvents = function (state) {
      if (state !== boundGlobalEvents) {
        if (state) {
          DomQuery(window).on('resize scroll', globalEventDelegate)
        } else {
          DomQuery(window).off('resize scroll', globalEventDelegate)
        }
        boundGlobalEvents = state
      }
    }
    const removeEditorFromList = function (targetEditor) {
      const oldEditors = editors
      delete legacyEditors[targetEditor.id]
      for (let i = 0; i < legacyEditors.length; i++) {
        if (legacyEditors[i] === targetEditor) {
          legacyEditors.splice(i, 1)
          break
        }
      }
      editors = filter(editors, (editor) => targetEditor !== editor)
      if (EditorManager.activeEditor === targetEditor) {
        EditorManager.activeEditor = editors.length > 0 ? editors[0] : null
      }
      if (EditorManager.focusedEditor === targetEditor) {
        EditorManager.focusedEditor = null
      }
      return oldEditors.length !== editors.length
    }
    const purgeDestroyedEditor = function (editor) {
      if (editor && editor.initialized && !(editor.getContainer() || editor.getBody()).parentNode) {
        removeEditorFromList(editor)
        editor.unbindAllNativeEvents()
        editor.destroy(true)
        editor.removed = true
        editor = null
      }
      return editor
    }
    EditorManager = {
      defaultSettings: {},
      $: DomQuery,
      majorVersion: '5',
      minorVersion: '0.0-rc-1-build.3',
      releaseDate: 'TBD',
      editors: legacyEditors,
      i18n: I18n,
      activeEditor: null,
      settings: {},
      setup() {
        const self$$1 = this
        let baseURL; let documentBaseURL; let suffix = ''; let preInit; let src
        documentBaseURL = URI.getDocumentBaseUrl(document.location)
        if (/^[^:]+:\/\/\/?[^\/]+\//.test(documentBaseURL)) {
          documentBaseURL = documentBaseURL.replace(/[\?#].*$/, '').replace(/[\/\\][^\/]+$/, '')
          if (!/[\/\\]$/.test(documentBaseURL)) {
            documentBaseURL += '/'
          }
        }
        preInit = window.tinymce || window.tinyMCEPreInit
        if (preInit) {
          baseURL = preInit.base || preInit.baseURL
          suffix = preInit.suffix
        } else {
          const scripts = document.getElementsByTagName('script')
          for (let i = 0; i < scripts.length; i++) {
            src = scripts[i].src
            const srcScript = src.substring(src.lastIndexOf('/'))
            if (/tinymce(\.full|\.jquery|)(\.min|\.dev|)\.js/.test(src)) {
              if (srcScript.indexOf('.min') !== -1) {
                suffix = '.min'
              }
              baseURL = src.substring(0, src.lastIndexOf('/'))
              break
            }
          }
          if (!baseURL && document.currentScript) {
            src = document.currentScript.src
            if (src.indexOf('.min') !== -1) {
              suffix = '.min'
            }
            baseURL = src.substring(0, src.lastIndexOf('/'))
          }
        }
        self$$1.baseURL = new URI(documentBaseURL).toAbsolute(baseURL)
        self$$1.documentBaseURL = documentBaseURL
        self$$1.baseURI = new URI(self$$1.baseURL)
        self$$1.suffix = suffix
        FocusController.setup(self$$1)
      },
      overrideDefaults(defaultSettings) {
        let baseUrl, suffix
        baseUrl = defaultSettings.base_url
        if (baseUrl) {
          this.baseURL = new URI(this.documentBaseURL).toAbsolute(baseUrl.replace(/\/+$/, ''))
          this.baseURI = new URI(this.baseURL)
        }
        suffix = defaultSettings.suffix
        if (defaultSettings.suffix) {
          this.suffix = suffix
        }
        this.defaultSettings = defaultSettings
        const pluginBaseUrls = defaultSettings.plugin_base_urls
        for (const name$$1 in pluginBaseUrls) {
          AddOnManager.PluginManager.urls[name$$1] = pluginBaseUrls[name$$1]
        }
      },
      init(settings) {
        const self$$1 = this
        let result, invalidInlineTargets
        invalidInlineTargets = Tools.makeMap('area base basefont br col frame hr img input isindex link meta param embed source wbr track ' + 'colgroup option tbody tfoot thead tr script noscript style textarea video audio iframe object menu', ' ')
        const isInvalidInlineTarget = function (settings, elm) {
          return settings.inline && elm.tagName.toLowerCase() in invalidInlineTargets
        }
        const createId = function (elm) {
          let { id } = elm
          if (!id) {
            id = elm.name
            if (id && !DOM$9.get(id)) {
              id = elm.name
            } else {
              id = DOM$9.uniqueId()
            }
            elm.setAttribute('id', id)
          }
          return id
        }
        const execCallback = function (name$$1) {
          const callback = settings[name$$1]
          if (!callback) {
            return
          }
          return callback.apply(self$$1, Array.prototype.slice.call(arguments, 2))
        }
        const hasClass = function (elm, className) {
          return className.constructor === RegExp ? className.test(elm.className) : DOM$9.hasClass(elm, className)
        }
        const findTargets = function (settings) {
          let l; let targets = []
          if (Env.ie && Env.ie < 11) {
            ErrorReporter.initError('TinyMCE does not support the browser you are using. For a list of supported' + ' browsers please see: https://www.tinymce.com/docs/get-started/system-requirements/')
            return []
          }
          if (settings.types) {
            each$l(settings.types, (type) => {
              targets = targets.concat(DOM$9.select(type.selector))
            })
            return targets
          } if (settings.selector) {
            return DOM$9.select(settings.selector)
          } if (settings.target) {
            return [settings.target]
          }
          switch (settings.mode) {
            case 'exact':
              l = settings.elements || ''
              if (l.length > 0) {
                each$l(explode$4(l), (id) => {
                  let elm
                  if (elm = DOM$9.get(id)) {
                    targets.push(elm)
                  } else {
                    each$l(document.forms, (f) => {
                      each$l(f.elements, (e) => {
                        if (e.name === id) {
                          id = `mce_editor_${instanceCounter++}`
                          DOM$9.setAttrib(e, 'id', id)
                          targets.push(e)
                        }
                      })
                    })
                  }
                })
              }
              break
            case 'textareas':
            case 'specific_textareas':
              each$l(DOM$9.select('textarea'), (elm) => {
                if (settings.editor_deselector && hasClass(elm, settings.editor_deselector)) {
                  return
                }
                if (!settings.editor_selector || hasClass(elm, settings.editor_selector)) {
                  targets.push(elm)
                }
              })
              break
          }
          return targets
        }
        let provideResults = function (editors) {
          result = editors
        }
        var initEditors = function () {
          let initCount = 0
          const editors = []
          let targets
          const createEditor = function (id, settings, targetElm) {
            const editor = new Editor(id, settings, self$$1)
            editors.push(editor)
            editor.on('init', () => {
              if (++initCount === targets.length) {
                provideResults(editors)
              }
            })
            editor.targetElm = editor.targetElm || targetElm
            editor.render()
          }
          DOM$9.unbind(window, 'ready', initEditors)
          execCallback('onpageload')
          targets = DomQuery.unique(findTargets(settings))
          if (settings.types) {
            each$l(settings.types, (type) => {
              Tools.each(targets, (elm) => {
                if (DOM$9.is(elm, type.selector)) {
                  createEditor(createId(elm), extend$5({}, settings, type), elm)
                  return false
                }
                return true
              })
            })
            return
          }
          Tools.each(targets, (elm) => {
            purgeDestroyedEditor(self$$1.get(elm.id))
          })
          targets = Tools.grep(targets, (elm) => !self$$1.get(elm.id))
          if (targets.length === 0) {
            provideResults([])
          } else {
            each$l(targets, (elm) => {
              if (isInvalidInlineTarget(settings, elm)) {
                ErrorReporter.initError('Could not initialize inline editor on invalid inline target element', elm)
              } else {
                createEditor(createId(elm), settings, elm)
              }
            })
          }
        }
        self$$1.settings = settings
        DOM$9.bind(window, 'ready', initEditors)
        return new promiseObj((resolve) => {
          if (result) {
            resolve(result)
          } else {
            provideResults = function (editors) {
              resolve(editors)
            }
          }
        })
      },
      get(id) {
        if (arguments.length === 0) {
          return editors.slice(0)
        } if (isString(id)) {
          return find(editors, (editor) => editor.id === id).getOr(null)
        } if (isNumber(id)) {
          return editors[id] ? editors[id] : null
        }
        return null
      },
      add(editor) {
        const self$$1 = this
        let existingEditor
        existingEditor = legacyEditors[editor.id]
        if (existingEditor === editor) {
          return editor
        }
        if (self$$1.get(editor.id) === null) {
          if (isValidLegacyKey(editor.id)) {
            legacyEditors[editor.id] = editor
          }
          legacyEditors.push(editor)
          editors.push(editor)
        }
        toggleGlobalEvents(true)
        self$$1.activeEditor = editor
        self$$1.fire('AddEditor', { editor })
        if (!beforeUnloadDelegate) {
          beforeUnloadDelegate = function () {
            self$$1.fire('BeforeUnload')
          }
          DOM$9.bind(window, 'beforeunload', beforeUnloadDelegate)
        }
        return editor
      },
      createEditor(id, settings) {
        return this.add(new Editor(id, settings, this))
      },
      remove(selector) {
        const self$$1 = this
        let i, editor
        if (!selector) {
          for (i = editors.length - 1; i >= 0; i--) {
            self$$1.remove(editors[i])
          }
          return
        }
        if (isString(selector)) {
          each$l(DOM$9.select(selector), (elm) => {
            editor = self$$1.get(elm.id)
            if (editor) {
              self$$1.remove(editor)
            }
          })
          return
        }
        editor = selector
        if (isNull(self$$1.get(editor.id))) {
          return null
        }
        if (removeEditorFromList(editor)) {
          self$$1.fire('RemoveEditor', { editor })
        }
        if (editors.length === 0) {
          DOM$9.unbind(window, 'beforeunload', beforeUnloadDelegate)
        }
        editor.remove()
        toggleGlobalEvents(editors.length > 0)
        return editor
      },
      execCommand(cmd, ui, value) {
        const self$$1 = this; const editor = self$$1.get(value)
        switch (cmd) {
          case 'mceAddEditor':
            if (!self$$1.get(value)) {
              new Editor(value, self$$1.settings, self$$1).render()
            }
            return true
          case 'mceRemoveEditor':
            if (editor) {
              editor.remove()
            }
            return true
          case 'mceToggleEditor':
            if (!editor) {
              self$$1.execCommand('mceAddEditor', 0, value)
              return true
            }
            if (editor.isHidden()) {
              editor.show()
            } else {
              editor.hide()
            }
            return true
        }
        if (self$$1.activeEditor) {
          return self$$1.activeEditor.execCommand(cmd, ui, value)
        }
        return false
      },
      triggerSave() {
        each$l(editors, (editor) => {
          editor.save()
        })
      },
      addI18n(code, items) {
        I18n.add(code, items)
      },
      translate(text) {
        return I18n.translate(text)
      },
      setActive(editor) {
        const { activeEditor } = this
        if (this.activeEditor !== editor) {
          if (activeEditor) {
            activeEditor.fire('deactivate', { relatedTarget: editor })
          }
          editor.fire('activate', { relatedTarget: activeEditor })
        }
        this.activeEditor = editor
      },
    }
    extend$5(EditorManager, Observable)
    EditorManager.setup()
    const EditorManager$1 = EditorManager

    function RangeUtils(dom) {
      const walk = function (rng, callback) {
        return RangeWalk.walk(dom, rng, callback)
      }
      const { split } = SplitRange
      const normalize = function (rng) {
        return NormalizeRange.normalize(dom, rng).fold(constant(false), (normalizedRng) => {
          rng.setStart(normalizedRng.startContainer, normalizedRng.startOffset)
          rng.setEnd(normalizedRng.endContainer, normalizedRng.endOffset)
          return true
        })
      }
      return {
        walk,
        split,
        normalize,
      }
    }
    (function (RangeUtils) {
      RangeUtils.compareRanges = RangeCompare.isEq
      RangeUtils.getCaretRangeFromPoint = CaretRangeFromPoint.fromPoint
      RangeUtils.getSelectedNode = getSelectedNode
      RangeUtils.getNode = getNode
    }(RangeUtils || (RangeUtils = {})))
    const RangeUtils$1 = RangeUtils

    const { min } = Math; const { max } = Math; const round$2 = Math.round
    const relativePosition = function (rect, targetRect, rel) {
      let x, y, w, h, targetW, targetH
      x = targetRect.x
      y = targetRect.y
      w = rect.w
      h = rect.h
      targetW = targetRect.w
      targetH = targetRect.h
      rel = (rel || '').split('')
      if (rel[0] === 'b') {
        y += targetH
      }
      if (rel[1] === 'r') {
        x += targetW
      }
      if (rel[0] === 'c') {
        y += round$2(targetH / 2)
      }
      if (rel[1] === 'c') {
        x += round$2(targetW / 2)
      }
      if (rel[3] === 'b') {
        y -= h
      }
      if (rel[4] === 'r') {
        x -= w
      }
      if (rel[3] === 'c') {
        y -= round$2(h / 2)
      }
      if (rel[4] === 'c') {
        x -= round$2(w / 2)
      }
      return create$4(x, y, w, h)
    }
    const findBestRelativePosition = function (rect, targetRect, constrainRect, rels) {
      let pos, i
      for (i = 0; i < rels.length; i++) {
        pos = relativePosition(rect, targetRect, rels[i])
        if (pos.x >= constrainRect.x && pos.x + pos.w <= constrainRect.w + constrainRect.x && pos.y >= constrainRect.y && pos.y + pos.h <= constrainRect.h + constrainRect.y) {
          return rels[i]
        }
      }
      return null
    }
    const inflate = function (rect, w, h) {
      return create$4(rect.x - w, rect.y - h, rect.w + w * 2, rect.h + h * 2)
    }
    const intersect = function (rect, cropRect) {
      let x1, y1, x2, y2
      x1 = max(rect.x, cropRect.x)
      y1 = max(rect.y, cropRect.y)
      x2 = min(rect.x + rect.w, cropRect.x + cropRect.w)
      y2 = min(rect.y + rect.h, cropRect.y + cropRect.h)
      if (x2 - x1 < 0 || y2 - y1 < 0) {
        return null
      }
      return create$4(x1, y1, x2 - x1, y2 - y1)
    }
    const clamp$1 = function (rect, clampRect, fixedSize) {
      let underflowX1, underflowY1, overflowX2, overflowY2, x1, y1, x2, y2, cx2, cy2
      x1 = rect.x
      y1 = rect.y
      x2 = rect.x + rect.w
      y2 = rect.y + rect.h
      cx2 = clampRect.x + clampRect.w
      cy2 = clampRect.y + clampRect.h
      underflowX1 = max(0, clampRect.x - x1)
      underflowY1 = max(0, clampRect.y - y1)
      overflowX2 = max(0, x2 - cx2)
      overflowY2 = max(0, y2 - cy2)
      x1 += underflowX1
      y1 += underflowY1
      if (fixedSize) {
        x2 += underflowX1
        y2 += underflowY1
        x1 -= overflowX2
        y1 -= overflowY2
      }
      x2 -= overflowX2
      y2 -= overflowY2
      return create$4(x1, y1, x2 - x1, y2 - y1)
    }
    var create$4 = function (x, y, w, h) {
      return {
        x,
        y,
        w,
        h,
      }
    }
    const fromClientRect = function (clientRect) {
      return create$4(clientRect.left, clientRect.top, clientRect.width, clientRect.height)
    }
    const Rect = {
      inflate,
      relativePosition,
      findBestRelativePosition,
      intersect,
      clamp: clamp$1,
      create: create$4,
      fromClientRect,
    }

    const types = {}
    const Factory = {
      add(type, typeClass) {
        types[type.toLowerCase()] = typeClass
      },
      has(type) {
        return !!types[type.toLowerCase()]
      },
      get(type) {
        const lctype = type.toLowerCase()
        const controlType = types.hasOwnProperty(lctype) ? types[lctype] : null
        if (controlType === null) {
          throw new Error(`Could not find module for type: ${type}`)
        }
        return controlType
      },
      create(type, settings) {
        let ControlType
        if (typeof type === 'string') {
          settings = settings || {}
          settings.type = type
        } else {
          settings = type
          type = settings.type
        }
        type = type.toLowerCase()
        ControlType = types[type]
        if (!ControlType) {
          throw new Error(`Could not find control by type: ${type}`)
        }
        ControlType = new ControlType(settings)
        ControlType.type = type
        return ControlType
      },
    }

    const each$m = Tools.each; const extend$6 = Tools.extend
    let extendClass, initializing
    const Class = function () {
    }
    Class.extend = extendClass = function (prop) {
      const self = this
      const _super = self.prototype
      let prototype, name, member
      const Class = function () {
        let i, mixins, mixin
        const self = this
        if (!initializing) {
          if (self.init) {
            self.init.apply(self, arguments)
          }
          mixins = self.Mixins
          if (mixins) {
            i = mixins.length
            while (i--) {
              mixin = mixins[i]
              if (mixin.init) {
                mixin.init.apply(self, arguments)
              }
            }
          }
        }
      }
      const dummy = function () {
        return this
      }
      const createMethod = function (name, fn) {
        return function () {
          const self = this
          const tmp = self._super
          let ret
          self._super = _super[name]
          ret = fn.apply(self, arguments)
          self._super = tmp
          return ret
        }
      }
      initializing = true
      prototype = new self()
      initializing = false
      if (prop.Mixins) {
        each$m(prop.Mixins, (mixin) => {
          for (const name_1 in mixin) {
            if (name_1 !== 'init') {
              prop[name_1] = mixin[name_1]
            }
          }
        })
        if (_super.Mixins) {
          prop.Mixins = _super.Mixins.concat(prop.Mixins)
        }
      }
      if (prop.Methods) {
        each$m(prop.Methods.split(','), (name) => {
          prop[name] = dummy
        })
      }
      if (prop.Properties) {
        each$m(prop.Properties.split(','), (name) => {
          const fieldName = `_${name}`
          prop[name] = function (value) {
            const self = this
            if (value !== undefined) {
              self[fieldName] = value
              return self
            }
            return self[fieldName]
          }
        })
      }
      if (prop.Statics) {
        each$m(prop.Statics, (func, name) => {
          Class[name] = func
        })
      }
      if (prop.Defaults && _super.Defaults) {
        prop.Defaults = extend$6({}, _super.Defaults, prop.Defaults)
      }
      for (name in prop) {
        member = prop[name]
        if (typeof member === 'function' && _super[name]) {
          prototype[name] = createMethod(name, member)
        } else {
          prototype[name] = member
        }
      }
      Class.prototype = prototype
      Class.constructor = Class
      Class.extend = extendClass
      return Class
    }

    const min$1 = Math.min; const max$1 = Math.max; const round$3 = Math.round
    const Color = function (value) {
      const self = {}
      let r = 0; let g = 0; let b = 0
      const rgb2hsv = function (r, g, b) {
        let h, s, v, d, minRGB, maxRGB
        h = 0
        s = 0
        v = 0
        r /= 255
        g /= 255
        b /= 255
        minRGB = min$1(r, min$1(g, b))
        maxRGB = max$1(r, max$1(g, b))
        if (minRGB === maxRGB) {
          v = minRGB
          return {
            h: 0,
            s: 0,
            v: v * 100,
          }
        }
        d = r === minRGB ? g - b : b === minRGB ? r - g : b - r
        h = r === minRGB ? 3 : b === minRGB ? 1 : 5
        h = 60 * (h - d / (maxRGB - minRGB))
        s = (maxRGB - minRGB) / maxRGB
        v = maxRGB
        return {
          h: round$3(h),
          s: round$3(s * 100),
          v: round$3(v * 100),
        }
      }
      const hsvToRgb = function (hue, saturation, brightness) {
        let side, chroma, x, match
        hue = (parseInt(hue, 10) || 0) % 360
        saturation = parseInt(saturation, 10) / 100
        brightness = parseInt(brightness, 10) / 100
        saturation = max$1(0, min$1(saturation, 1))
        brightness = max$1(0, min$1(brightness, 1))
        if (saturation === 0) {
          r = g = b = round$3(255 * brightness)
          return
        }
        side = hue / 60
        chroma = brightness * saturation
        x = chroma * (1 - Math.abs(side % 2 - 1))
        match = brightness - chroma
        switch (Math.floor(side)) {
          case 0:
            r = chroma
            g = x
            b = 0
            break
          case 1:
            r = x
            g = chroma
            b = 0
            break
          case 2:
            r = 0
            g = chroma
            b = x
            break
          case 3:
            r = 0
            g = x
            b = chroma
            break
          case 4:
            r = x
            g = 0
            b = chroma
            break
          case 5:
            r = chroma
            g = 0
            b = x
            break
          default:
            r = g = b = 0
        }
        r = round$3(255 * (r + match))
        g = round$3(255 * (g + match))
        b = round$3(255 * (b + match))
      }
      const toHex = function () {
        const hex = function (val) {
          val = parseInt(val, 10).toString(16)
          return val.length > 1 ? val : `0${val}`
        }
        return `#${hex(r)}${hex(g)}${hex(b)}`
      }
      const toRgb = function () {
        return {
          r,
          g,
          b,
        }
      }
      const toHsv = function () {
        return rgb2hsv(r, g, b)
      }
      const parse = function (value) {
        let matches
        if (typeof value === 'object') {
          if ('r' in value) {
            r = value.r
            g = value.g
            b = value.b
          } else if ('v' in value) {
            hsvToRgb(value.h, value.s, value.v)
          }
        } else if (matches = /rgb\s*\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)[^\)]*\)/gi.exec(value)) {
          r = parseInt(matches[1], 10)
          g = parseInt(matches[2], 10)
          b = parseInt(matches[3], 10)
        } else if (matches = /#([0-F]{2})([0-F]{2})([0-F]{2})/gi.exec(value)) {
          r = parseInt(matches[1], 16)
          g = parseInt(matches[2], 16)
          b = parseInt(matches[3], 16)
        } else if (matches = /#([0-F])([0-F])([0-F])/gi.exec(value)) {
          r = parseInt(matches[1] + matches[1], 16)
          g = parseInt(matches[2] + matches[2], 16)
          b = parseInt(matches[3] + matches[3], 16)
        }
        r = r < 0 ? 0 : r > 255 ? 255 : r
        g = g < 0 ? 0 : g > 255 ? 255 : g
        b = b < 0 ? 0 : b > 255 ? 255 : b
        return self
      }
      if (value) {
        parse(value)
      }
      self.toRgb = toRgb
      self.toHsv = toHsv
      self.toHex = toHex
      self.parse = parse
      return self
    }

    var serialize = function (o, quote) {
      let i, v, t, name
      quote = quote || '"'
      if (o === null) {
        return 'null'
      }
      t = typeof o
      if (t === 'string') {
        v = '\bb\tt\nn\ff\rr""\'\'\\\\'
        return quote + o.replace(/([\u0080-\uFFFF\x00-\x1f\"\'\\])/g, (a, b) => {
          if (quote === '"' && a === '\'') {
            return a
          }
          i = v.indexOf(b)
          if (i + 1) {
            return `\\${v.charAt(i + 1)}`
          }
          a = b.charCodeAt().toString(16)
          return `\\u${'0000'.substring(a.length)}${a}`
        }) + quote
      }
      if (t === 'object') {
        if (o.hasOwnProperty && Object.prototype.toString.call(o) === '[object Array]') {
          for (i = 0, v = '['; i < o.length; i++) {
            v += (i > 0 ? ',' : '') + serialize(o[i], quote)
          }
          return `${v}]`
        }
        v = '{'
        for (name in o) {
          if (o.hasOwnProperty(name)) {
            v += typeof o[name] !== 'function' ? `${(v.length > 1 ? `,${quote}` : quote) + name + quote}:${serialize(o[name], quote)}` : ''
          }
        }
        return `${v}}`
      }
      return `${o}`
    }
    const JSON$1 = {
      serialize,
      parse(text) {
        try {
          return JSON.parse(text)
        } catch (ex) {
        }
      },
    }

    const JSONP = {
      callbacks: {},
      count: 0,
      send(settings) {
        const self = this; const dom = DOMUtils$1.DOM; const count = settings.count !== undefined ? settings.count : self.count
        const id = `tinymce_jsonp_${count}`
        self.callbacks[count] = function (json) {
          dom.remove(id)
          delete self.callbacks[count]
          settings.callback(json)
        }
        dom.add(dom.doc.body, 'script', {
          id,
          src: settings.url,
          type: 'text/javascript',
        })
        self.count++
      },
    }

    var XHR = {
      send(settings) {
        let xhr; let count = 0
        var ready = function () {
          if (!settings.async || xhr.readyState === 4 || count++ > 10000) {
            if (settings.success && count < 10000 && xhr.status === 200) {
              settings.success.call(settings.success_scope, `${xhr.responseText}`, xhr, settings)
            } else if (settings.error) {
              settings.error.call(settings.error_scope, count > 10000 ? 'TIMED_OUT' : 'GENERAL', xhr, settings)
            }
            xhr = null
          } else {
            setTimeout(ready, 10)
          }
        }
        settings.scope = settings.scope || this
        settings.success_scope = settings.success_scope || settings.scope
        settings.error_scope = settings.error_scope || settings.scope
        settings.async = settings.async !== false
        settings.data = settings.data || ''
        XHR.fire('beforeInitialize', { settings })
        xhr = XMLHttpRequest()
        if (xhr) {
          if (xhr.overrideMimeType) {
            xhr.overrideMimeType(settings.content_type)
          }
          xhr.open(settings.type || (settings.data ? 'POST' : 'GET'), settings.url, settings.async)
          if (settings.crossDomain) {
            xhr.withCredentials = true
          }
          if (settings.content_type) {
            xhr.setRequestHeader('Content-Type', settings.content_type)
          }
          if (settings.requestheaders) {
            Tools.each(settings.requestheaders, (header) => {
              xhr.setRequestHeader(header.key, header.value)
            })
          }
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
          xhr = XHR.fire('beforeSend', {
            xhr,
            settings,
          }).xhr
          xhr.send(settings.data)
          if (!settings.async) {
            return ready()
          }
          setTimeout(ready, 10)
        }
      },
    }
    Tools.extend(XHR, Observable)

    const extend$7 = Tools.extend
    const JSONRequest = function (settings) {
      this.settings = extend$7({}, settings)
      this.count = 0
    }
    JSONRequest.sendRPC = function (o) {
      return new JSONRequest().send(o)
    }
    JSONRequest.prototype = {
      send(args) {
        const ecb = args.error; const scb = args.success
        args = extend$7(this.settings, args)
        args.success = function (c, x) {
          c = JSON$1.parse(c)
          if (typeof c === 'undefined') {
            c = { error: 'JSON Parse error.' }
          }
          if (c.error) {
            ecb.call(args.error_scope || args.scope, c.error, x)
          } else {
            scb.call(args.success_scope || args.scope, c.result)
          }
        }
        args.error = function (ty, x) {
          if (ecb) {
            ecb.call(args.error_scope || args.scope, ty, x)
          }
        }
        args.data = JSON$1.serialize({
          id: args.id || `c${this.count++}`,
          method: args.method,
          params: args.params,
        })
        args.content_type = 'application/json'
        XHR.send(args)
      },
    }

    const create$5 = function () {
      return (function () {
        let data = {}
        let keys = []
        const storage = {
          getItem(key) {
            const item = data[key]
            return item || null
          },
          setItem(key, value) {
            keys.push(key)
            data[key] = String(value)
          },
          key(index) {
            return keys[index]
          },
          removeItem(key) {
            keys = keys.filter((k) => k === key)
            delete data[key]
          },
          clear() {
            keys = []
            data = {}
          },
          length: 0,
        }
        Object.defineProperty(storage, 'length', {
          get() {
            return keys.length
          },
          configurable: false,
          enumerable: false,
        })
        return storage
      }())
    }

    let localStorage$$1
    try {
      localStorage$$1 = window.localStorage
    } catch (e) {
      localStorage$$1 = create$5()
    }
    const LocalStorage = localStorage$$1

    let tinymce = EditorManager$1
    const publicApi = {
      geom: { Rect },
      util: {
        Promise: promiseObj,
        Delay,
        Tools,
        VK,
        URI,
        Class,
        EventDispatcher: Dispatcher,
        Observable,
        I18n,
        XHR,
        JSON: JSON$1,
        JSONRequest,
        JSONP,
        LocalStorage,
        Color,
      },
      dom: {
        EventUtils,
        Sizzle,
        DomQuery,
        TreeWalker,
        DOMUtils: DOMUtils$1,
        ScriptLoader,
        RangeUtils: RangeUtils$1,
        Serializer: Serializer$1,
        ControlSelection,
        BookmarkManager: BookmarkManager$1,
        Selection,
        Event: EventUtils.Event,
      },
      html: {
        Styles,
        Entities,
        Node: Node$2,
        Schema,
        SaxParser: SaxParser$1,
        DomParser,
        Writer,
        Serializer,
      },
      ui: { Factory },
      Env,
      AddOnManager,
      Annotator,
      Formatter,
      UndoManager,
      EditorCommands,
      WindowManager,
      NotificationManager,
      EditorObservable: EditorObservable$1,
      Shortcuts,
      Editor,
      FocusManager,
      EditorManager: EditorManager$1,
      DOM: DOMUtils$1.DOM,
      ScriptLoader: ScriptLoader.ScriptLoader,
      PluginManager: AddOnManager.PluginManager,
      ThemeManager: AddOnManager.ThemeManager,
      IconManager,
      trim: Tools.trim,
      isArray: Tools.isArray,
      is: Tools.is,
      toArray: Tools.toArray,
      makeMap: Tools.makeMap,
      each: Tools.each,
      map: Tools.map,
      grep: Tools.grep,
      inArray: Tools.inArray,
      extend: Tools.extend,
      create: Tools.create,
      walk: Tools.walk,
      createNS: Tools.createNS,
      resolve: Tools.resolve,
      explode: Tools.explode,
      _addCacheSuffix: Tools._addCacheSuffix,
      isOpera: Env.opera,
      isWebKit: Env.webkit,
      isIE: Env.ie,
      isGecko: Env.gecko,
      isMac: Env.mac,
    }
    tinymce = Tools.extend(tinymce, publicApi)
    const Tinymce = tinymce

    const exportToModuleLoaders = function (tinymce) {
      if (typeof module === 'object') {
        try {
          module.exports = tinymce
        } catch (_) {
        }
      }
    }
    const exportToWindowGlobal = function (tinymce) {
      window.tinymce = tinymce
      window.tinyMCE = tinymce
    }
    exportToWindowGlobal(Tinymce)
    exportToModuleLoaders(Tinymce)
  }())
})()
