(function () {
  const imagetools = (function () {
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

    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools')

    function create(width, height) {
      return resize(document.createElement('canvas'), width, height)
    }
    function clone(canvas) {
      let tCanvas, ctx
      tCanvas = create(canvas.width, canvas.height)
      ctx = get2dContext(tCanvas)
      ctx.drawImage(canvas, 0, 0)
      return tCanvas
    }
    function get2dContext(canvas) {
      return canvas.getContext('2d')
    }
    function get3dContext(canvas) {
      let gl = null
      try {
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      } catch (e) {
      }
      if (!gl) {
        gl = null
      }
      return gl
    }
    function resize(canvas, width, height) {
      canvas.width = width
      canvas.height = height
      return canvas
    }
    const Canvas = {
      create,
      clone,
      resize,
      get2dContext,
      get3dContext,
    }

    function getWidth(image) {
      return image.naturalWidth || image.width
    }
    function getHeight(image) {
      return image.naturalHeight || image.height
    }
    const ImageSize = {
      getWidth,
      getHeight,
    }

    const promise = function () {
      const Promise = function (fn) {
        if (typeof this !== 'object') { throw new TypeError('Promises must be constructed via new') }
        if (typeof fn !== 'function') { throw new TypeError('not a function') }
        this._state = null
        this._value = null
        this._deferreds = []
        doResolve(fn, bind(resolve, this), bind(reject, this))
      }
      const asap = Promise.immediateFn || typeof window.setImmediate === 'function' && window.setImmediate || function (fn) {
        setTimeout(fn, 1)
      }
      function bind(fn, thisArg) {
        return function () {
          fn.apply(thisArg, arguments)
        }
      }
      const isArray = Array.isArray || function (value) {
        return Object.prototype.toString.call(value) === '[object Array]'
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
          if (newValue === this) { throw new TypeError('A promise cannot be resolved with itself.') }
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
            if (done) { return }
            done = true
            onFulfilled(value)
          }, (reason) => {
            if (done) { return }
            done = true
            onRejected(reason)
          })
        } catch (ex) {
          if (done) { return }
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
          if (args.length === 0) { return resolve([]) }
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
    const Promise = window.Promise ? window.Promise : promise()

    const constant = function (value) {
      return function () {
        return value
      }
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

    function Blob(parts, properties) {
      const f = Global$1.getOrDie('Blob')
      return new f(parts, properties)
    }

    function FileReader() {
      const f = Global$1.getOrDie('FileReader')
      return new f()
    }

    function Uint8Array(arr) {
      const f = Global$1.getOrDie('Uint8Array')
      return new f(arr)
    }

    const requestAnimationFrame = function (callback) {
      const f = Global$1.getOrDie('requestAnimationFrame')
      f(callback)
    }
    const atob = function (base64) {
      const f = Global$1.getOrDie('atob')
      return f(base64)
    }
    const Window = {
      atob,
      requestAnimationFrame,
    }

    function imageToBlob(image) {
      const { src } = image
      if (src.indexOf('data:') === 0) {
        return dataUriToBlob(src)
      }
      return anyUriToBlob(src)
    }
    function blobToImage(blob) {
      return new Promise((resolve, reject) => {
        const blobUrl = URL.createObjectURL(blob)
        const image = new Image()
        const removeListeners = function () {
          image.removeEventListener('load', loaded)
          image.removeEventListener('error', error)
        }
        function loaded() {
          removeListeners()
          resolve(image)
        }
        function error() {
          removeListeners()
          reject(`Unable to load data of type ${blob.type}: ${blobUrl}`)
        }
        image.addEventListener('load', loaded)
        image.addEventListener('error', error)
        image.src = blobUrl
        if (image.complete) {
          loaded()
        }
      })
    }
    function anyUriToBlob(url) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.responseType = 'blob'
        xhr.onload = function () {
          if (this.status == 200) {
            resolve(this.response)
          }
        }
        xhr.onerror = function () {
          const _this = this
          const corsError = function () {
            const obj = new Error('No access to download image')
            obj.code = 18
            obj.name = 'SecurityError'
            return obj
          }
          const genericError = function () {
            return new Error(`Error ${_this.status} downloading image`)
          }
          reject(this.status === 0 ? corsError() : genericError())
        }
        xhr.send()
      })
    }
    function dataUriToBlobSync(uri) {
      const data = uri.split(',')
      const matches = /data:([^;]+)/.exec(data[0])
      if (!matches) { return Option.none() }
      const mimetype = matches[1]
      const base64 = data[1]
      const sliceSize = 1024
      const byteCharacters = Window.atob(base64)
      const bytesLength = byteCharacters.length
      const slicesCount = Math.ceil(bytesLength / sliceSize)
      const byteArrays = new Array(slicesCount)
      for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        const begin = sliceIndex * sliceSize
        const end = Math.min(begin + sliceSize, bytesLength)
        const bytes = new Array(end - begin)
        for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
          bytes[i] = byteCharacters[offset].charCodeAt(0)
        }
        byteArrays[sliceIndex] = Uint8Array(bytes)
      }
      return Option.some(Blob(byteArrays, { type: mimetype }))
    }
    function dataUriToBlob(uri) {
      return new Promise((resolve, reject) => {
        dataUriToBlobSync(uri).fold(() => {
          reject(`uri is not base64: ${uri}`)
        }, resolve)
      })
    }
    function uriToBlob(url) {
      if (url.indexOf('blob:') === 0) {
        return anyUriToBlob(url)
      }
      if (url.indexOf('data:') === 0) {
        return dataUriToBlob(url)
      }
      return null
    }
    function canvasToBlob(canvas, type, quality) {
      type = type || 'image/png'
      if (HTMLCanvasElement.prototype.toBlob) {
        return new Promise((resolve) => {
          canvas.toBlob((blob) => {
            resolve(blob)
          }, type, quality)
        })
      }
      return dataUriToBlob(canvas.toDataURL(type, quality))
    }
    function canvasToDataURL(getCanvas, type, quality) {
      type = type || 'image/png'
      return getCanvas.then((canvas) => canvas.toDataURL(type, quality))
    }
    function blobToCanvas(blob) {
      return blobToImage(blob).then((image) => {
        revokeImageUrl(image)
        let context, canvas
        canvas = Canvas.create(ImageSize.getWidth(image), ImageSize.getHeight(image))
        context = Canvas.get2dContext(canvas)
        context.drawImage(image, 0, 0)
        return canvas
      })
    }
    function blobToDataUri(blob) {
      return new Promise((resolve) => {
        const reader = FileReader()
        reader.onloadend = function () {
          resolve(reader.result)
        }
        reader.readAsDataURL(blob)
      })
    }
    function blobToArrayBuffer(blob) {
      return new Promise((resolve) => {
        const reader = FileReader()
        reader.onloadend = function () {
          resolve(reader.result)
        }
        reader.readAsArrayBuffer(blob)
      })
    }
    function blobToBase64(blob) {
      return blobToDataUri(blob).then((dataUri) => dataUri.split(',')[1])
    }
    function revokeImageUrl(image) {
      URL.revokeObjectURL(image.src)
    }
    const Conversions = {
      blobToImage,
      imageToBlob,
      blobToArrayBuffer,
      blobToDataUri,
      blobToBase64,
      dataUriToBlobSync,
      canvasToBlob,
      canvasToDataURL,
      blobToCanvas,
      uriToBlob,
    }

    const blobToImage$1 = function (image) {
      return Conversions.blobToImage(image)
    }
    const imageToBlob$1 = function (blob) {
      return Conversions.imageToBlob(blob)
    }
    const blobToDataUri$1 = function (blob) {
      return Conversions.blobToDataUri(blob)
    }
    const blobToBase64$1 = function (blob) {
      return Conversions.blobToBase64(blob)
    }
    const dataUriToBlobSync$1 = function (uri) {
      return Conversions.dataUriToBlobSync(uri)
    }
    const uriToBlob$1 = function (uri) {
      return Option.from(Conversions.uriToBlob(uri))
    }
    const BlobConversions = {
      blobToImage: blobToImage$1,
      imageToBlob: imageToBlob$1,
      blobToDataUri: blobToDataUri$1,
      blobToBase64: blobToBase64$1,
      dataUriToBlobSync: dataUriToBlobSync$1,
      uriToBlob: uriToBlob$1,
    }

    function create$1(getCanvas, blob, uri) {
      const initialType = blob.type
      const getType = constant(initialType)
      function toBlob() {
        return Promise.resolve(blob)
      }
      function toDataURL() {
        return uri
      }
      function toBase64() {
        return uri.split(',')[1]
      }
      function toAdjustedBlob(type, quality) {
        return getCanvas.then((canvas) => Conversions.canvasToBlob(canvas, type, quality))
      }
      function toAdjustedDataURL(type, quality) {
        return getCanvas.then((canvas) => Conversions.canvasToDataURL(canvas, type, quality))
      }
      function toAdjustedBase64(type, quality) {
        return toAdjustedDataURL(type, quality).then((dataurl) => dataurl.split(',')[1])
      }
      function toCanvas() {
        return getCanvas.then(Canvas.clone)
      }
      return {
        getType,
        toBlob,
        toDataURL,
        toBase64,
        toAdjustedBlob,
        toAdjustedDataURL,
        toAdjustedBase64,
        toCanvas,
      }
    }
    function fromBlob(blob) {
      return Conversions.blobToDataUri(blob).then((uri) => create$1(Conversions.blobToCanvas(blob), blob, uri))
    }
    function fromCanvas(canvas, type) {
      return Conversions.canvasToBlob(canvas, type).then((blob) => create$1(Promise.resolve(canvas), blob, canvas.toDataURL()))
    }
    function fromImage(image) {
      return Conversions.imageToBlob(image).then((blob) => fromBlob(blob))
    }
    const fromBlobAndUrlSync = function (blob, url) {
      return create$1(Conversions.blobToCanvas(blob), blob, url)
    }
    const ImageResult = {
      fromBlob,
      fromCanvas,
      fromImage,
      fromBlobAndUrlSync,
    }

    function clamp(value, min, max) {
      value = parseFloat(value)
      if (value > max) {
        value = max
      } else if (value < min) {
        value = min
      }
      return value
    }
    function identity$1() {
      return [
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
      ]
    }
    const DELTA_INDEX = [
      0,
      0.01,
      0.02,
      0.04,
      0.05,
      0.06,
      0.07,
      0.08,
      0.1,
      0.11,
      0.12,
      0.14,
      0.15,
      0.16,
      0.17,
      0.18,
      0.2,
      0.21,
      0.22,
      0.24,
      0.25,
      0.27,
      0.28,
      0.3,
      0.32,
      0.34,
      0.36,
      0.38,
      0.4,
      0.42,
      0.44,
      0.46,
      0.48,
      0.5,
      0.53,
      0.56,
      0.59,
      0.62,
      0.65,
      0.68,
      0.71,
      0.74,
      0.77,
      0.8,
      0.83,
      0.86,
      0.89,
      0.92,
      0.95,
      0.98,
      1,
      1.06,
      1.12,
      1.18,
      1.24,
      1.3,
      1.36,
      1.42,
      1.48,
      1.54,
      1.6,
      1.66,
      1.72,
      1.78,
      1.84,
      1.9,
      1.96,
      2,
      2.12,
      2.25,
      2.37,
      2.5,
      2.62,
      2.75,
      2.87,
      3,
      3.2,
      3.4,
      3.6,
      3.8,
      4,
      4.3,
      4.7,
      4.9,
      5,
      5.5,
      6,
      6.5,
      6.8,
      7,
      7.3,
      7.5,
      7.8,
      8,
      8.4,
      8.7,
      9,
      9.4,
      9.6,
      9.8,
      10,
    ]
    function multiply(matrix1, matrix2) {
      let i; let j; let k; let val; const col = []; const out = new Array(10)
      for (i = 0; i < 5; i++) {
        for (j = 0; j < 5; j++) {
          col[j] = matrix2[j + i * 5]
        }
        for (j = 0; j < 5; j++) {
          val = 0
          for (k = 0; k < 5; k++) {
            val += matrix1[j + k * 5] * col[k]
          }
          out[j + i * 5] = val
        }
      }
      return out
    }
    function adjust(matrix, adjustValue) {
      adjustValue = clamp(adjustValue, 0, 1)
      return matrix.map((value, index) => {
        if (index % 6 === 0) {
          value = 1 - (1 - value) * adjustValue
        } else {
          value *= adjustValue
        }
        return clamp(value, 0, 1)
      })
    }
    function adjustContrast(matrix, value) {
      let x
      value = clamp(value, -1, 1)
      value *= 100
      if (value < 0) {
        x = 127 + value / 100 * 127
      } else {
        x = value % 1
        if (x === 0) {
          x = DELTA_INDEX[value]
        } else {
          x = DELTA_INDEX[Math.floor(value)] * (1 - x) + DELTA_INDEX[Math.floor(value) + 1] * x
        }
        x = x * 127 + 127
      }
      return multiply(matrix, [
        x / 127,
        0,
        0,
        0,
        0.5 * (127 - x),
        0,
        x / 127,
        0,
        0,
        0.5 * (127 - x),
        0,
        0,
        x / 127,
        0,
        0.5 * (127 - x),
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
      ])
    }
    function adjustSaturation(matrix, value) {
      let x, lumR, lumG, lumB
      value = clamp(value, -1, 1)
      x = 1 + (value > 0 ? 3 * value : value)
      lumR = 0.3086
      lumG = 0.6094
      lumB = 0.082
      return multiply(matrix, [
        lumR * (1 - x) + x,
        lumG * (1 - x),
        lumB * (1 - x),
        0,
        0,
        lumR * (1 - x),
        lumG * (1 - x) + x,
        lumB * (1 - x),
        0,
        0,
        lumR * (1 - x),
        lumG * (1 - x),
        lumB * (1 - x) + x,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
      ])
    }
    function adjustHue(matrix, angle) {
      let cosVal, sinVal, lumR, lumG, lumB
      angle = clamp(angle, -180, 180) / 180 * Math.PI
      cosVal = Math.cos(angle)
      sinVal = Math.sin(angle)
      lumR = 0.213
      lumG = 0.715
      lumB = 0.072
      return multiply(matrix, [
        lumR + cosVal * (1 - lumR) + sinVal * -lumR,
        lumG + cosVal * -lumG + sinVal * -lumG,
        lumB + cosVal * -lumB + sinVal * (1 - lumB),
        0,
        0,
        lumR + cosVal * -lumR + sinVal * 0.143,
        lumG + cosVal * (1 - lumG) + sinVal * 0.14,
        lumB + cosVal * -lumB + sinVal * -0.283,
        0,
        0,
        lumR + cosVal * -lumR + sinVal * -(1 - lumR),
        lumG + cosVal * -lumG + sinVal * lumG,
        lumB + cosVal * (1 - lumB) + sinVal * lumB,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
      ])
    }
    function adjustBrightness(matrix, value) {
      value = clamp(255 * value, -255, 255)
      return multiply(matrix, [
        1,
        0,
        0,
        0,
        value,
        0,
        1,
        0,
        0,
        value,
        0,
        0,
        1,
        0,
        value,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
      ])
    }
    function adjustColors(matrix, adjustR, adjustG, adjustB) {
      adjustR = clamp(adjustR, 0, 2)
      adjustG = clamp(adjustG, 0, 2)
      adjustB = clamp(adjustB, 0, 2)
      return multiply(matrix, [
        adjustR,
        0,
        0,
        0,
        0,
        0,
        adjustG,
        0,
        0,
        0,
        0,
        0,
        adjustB,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
      ])
    }
    function adjustSepia(matrix, value) {
      value = clamp(value, 0, 1)
      return multiply(matrix, adjust([
        0.393,
        0.769,
        0.189,
        0,
        0,
        0.349,
        0.686,
        0.168,
        0,
        0,
        0.272,
        0.534,
        0.131,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
      ], value))
    }
    function adjustGrayscale(matrix, value) {
      value = clamp(value, 0, 1)
      return multiply(matrix, adjust([
        0.33,
        0.34,
        0.33,
        0,
        0,
        0.33,
        0.34,
        0.33,
        0,
        0,
        0.33,
        0.34,
        0.33,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
      ], value))
    }
    const ColorMatrix = {
      identity: identity$1,
      adjust,
      multiply,
      adjustContrast,
      adjustBrightness,
      adjustSaturation,
      adjustHue,
      adjustColors,
      adjustSepia,
      adjustGrayscale,
    }

    function colorFilter(ir, matrix) {
      return ir.toCanvas().then((canvas) => applyColorFilter(canvas, ir.getType(), matrix))
    }
    function applyColorFilter(canvas, type, matrix) {
      const context = Canvas.get2dContext(canvas)
      let pixels
      function applyMatrix(pixels, m) {
        const d = pixels.data; let r; let g; let b; let a; let i; const m0 = m[0]; const m1 = m[1]; const m2 = m[2]; const m3 = m[3]; const m4 = m[4]; const m5 = m[5]; const m6 = m[6]; const m7 = m[7]; const m8 = m[8]; const m9 = m[9]; const m10 = m[10]; const m11 = m[11]; const m12 = m[12]; const m13 = m[13]; const m14 = m[14]; const m15 = m[15]; const m16 = m[16]; const m17 = m[17]; const m18 = m[18]; const m19 = m[19]
        for (i = 0; i < d.length; i += 4) {
          r = d[i]
          g = d[i + 1]
          b = d[i + 2]
          a = d[i + 3]
          d[i] = r * m0 + g * m1 + b * m2 + a * m3 + m4
          d[i + 1] = r * m5 + g * m6 + b * m7 + a * m8 + m9
          d[i + 2] = r * m10 + g * m11 + b * m12 + a * m13 + m14
          d[i + 3] = r * m15 + g * m16 + b * m17 + a * m18 + m19
        }
        return pixels
      }
      pixels = applyMatrix(context.getImageData(0, 0, canvas.width, canvas.height), matrix)
      context.putImageData(pixels, 0, 0)
      return ImageResult.fromCanvas(canvas, type)
    }
    function convoluteFilter(ir, matrix) {
      return ir.toCanvas().then((canvas) => applyConvoluteFilter(canvas, ir.getType(), matrix))
    }
    function applyConvoluteFilter(canvas, type, matrix) {
      const context = Canvas.get2dContext(canvas)
      let pixelsIn, pixelsOut
      function applyMatrix(pixelsIn, pixelsOut, matrix) {
        let rgba, drgba, side, halfSide, x, y, r, g, b, cx, cy, scx, scy, offset, wt, w, h
        function clamp(value, min, max) {
          if (value > max) {
            value = max
          } else if (value < min) {
            value = min
          }
          return value
        }
        side = Math.round(Math.sqrt(matrix.length))
        halfSide = Math.floor(side / 2)
        rgba = pixelsIn.data
        drgba = pixelsOut.data
        w = pixelsIn.width
        h = pixelsIn.height
        for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
            r = g = b = 0
            for (cy = 0; cy < side; cy++) {
              for (cx = 0; cx < side; cx++) {
                scx = clamp(x + cx - halfSide, 0, w - 1)
                scy = clamp(y + cy - halfSide, 0, h - 1)
                offset = (scy * w + scx) * 4
                wt = matrix[cy * side + cx]
                r += rgba[offset] * wt
                g += rgba[offset + 1] * wt
                b += rgba[offset + 2] * wt
              }
            }
            offset = (y * w + x) * 4
            drgba[offset] = clamp(r, 0, 255)
            drgba[offset + 1] = clamp(g, 0, 255)
            drgba[offset + 2] = clamp(b, 0, 255)
          }
        }
        return pixelsOut
      }
      pixelsIn = context.getImageData(0, 0, canvas.width, canvas.height)
      pixelsOut = context.getImageData(0, 0, canvas.width, canvas.height)
      pixelsOut = applyMatrix(pixelsIn, pixelsOut, matrix)
      context.putImageData(pixelsOut, 0, 0)
      return ImageResult.fromCanvas(canvas, type)
    }
    function functionColorFilter(colorFn) {
      const filterImpl = function (canvas, type, value) {
        const context = Canvas.get2dContext(canvas)
        let pixels; let i; const lookup = new Array(256)
        function applyLookup(pixels, lookup) {
          const d = pixels.data; let i
          for (i = 0; i < d.length; i += 4) {
            d[i] = lookup[d[i]]
            d[i + 1] = lookup[d[i + 1]]
            d[i + 2] = lookup[d[i + 2]]
          }
          return pixels
        }
        for (i = 0; i < lookup.length; i++) {
          lookup[i] = colorFn(i, value)
        }
        pixels = applyLookup(context.getImageData(0, 0, canvas.width, canvas.height), lookup)
        context.putImageData(pixels, 0, 0)
        return ImageResult.fromCanvas(canvas, type)
      }
      return function (ir, value) {
        return ir.toCanvas().then((canvas) => filterImpl(canvas, ir.getType(), value))
      }
    }
    function complexAdjustableColorFilter(matrixAdjustFn) {
      return function (ir, adjust) {
        return colorFilter(ir, matrixAdjustFn(ColorMatrix.identity(), adjust))
      }
    }
    function basicColorFilter(matrix) {
      return function (ir) {
        return colorFilter(ir, matrix)
      }
    }
    function basicConvolutionFilter(kernel) {
      return function (ir) {
        return convoluteFilter(ir, kernel)
      }
    }
    const Filters = {
      invert: basicColorFilter([
        -1,
        0,
        0,
        0,
        255,
        0,
        -1,
        0,
        0,
        255,
        0,
        0,
        -1,
        0,
        255,
        0,
        0,
        0,
        1,
        0,
      ]),
      brightness: complexAdjustableColorFilter(ColorMatrix.adjustBrightness),
      hue: complexAdjustableColorFilter(ColorMatrix.adjustHue),
      saturate: complexAdjustableColorFilter(ColorMatrix.adjustSaturation),
      contrast: complexAdjustableColorFilter(ColorMatrix.adjustContrast),
      grayscale: complexAdjustableColorFilter(ColorMatrix.adjustGrayscale),
      sepia: complexAdjustableColorFilter(ColorMatrix.adjustSepia),
      colorize(ir, adjustR, adjustG, adjustB) {
        return colorFilter(ir, ColorMatrix.adjustColors(ColorMatrix.identity(), adjustR, adjustG, adjustB))
      },
      sharpen: basicConvolutionFilter([
        0,
        -1,
        0,
        -1,
        5,
        -1,
        0,
        -1,
        0,
      ]),
      emboss: basicConvolutionFilter([
        -2,
        -1,
        0,
        -1,
        1,
        1,
        0,
        1,
        2,
      ]),
      gamma: functionColorFilter((color, value) => Math.pow(color / 255, 1 - value) * 255),
      exposure: functionColorFilter((color, value) => 255 * (1 - Math.exp(-(color / 255) * value))),
      colorFilter,
      convoluteFilter,
    }

    function scale(image, dW, dH) {
      const sW = ImageSize.getWidth(image)
      const sH = ImageSize.getHeight(image)
      let wRatio = dW / sW
      let hRatio = dH / sH
      let scaleCapped = false
      if (wRatio < 0.5 || wRatio > 2) {
        wRatio = wRatio < 0.5 ? 0.5 : 2
        scaleCapped = true
      }
      if (hRatio < 0.5 || hRatio > 2) {
        hRatio = hRatio < 0.5 ? 0.5 : 2
        scaleCapped = true
      }
      const scaled = _scale(image, wRatio, hRatio)
      return !scaleCapped ? scaled : scaled.then((tCanvas) => scale(tCanvas, dW, dH))
    }
    function _scale(image, wRatio, hRatio) {
      return new Promise((resolve) => {
        const sW = ImageSize.getWidth(image)
        const sH = ImageSize.getHeight(image)
        const dW = Math.floor(sW * wRatio)
        const dH = Math.floor(sH * hRatio)
        const canvas = Canvas.create(dW, dH)
        const context = Canvas.get2dContext(canvas)
        context.drawImage(image, 0, 0, sW, sH, 0, 0, dW, dH)
        resolve(canvas)
      })
    }
    const ImageResizerCanvas = { scale }

    function rotate(ir, angle) {
      return ir.toCanvas().then((canvas) => applyRotate(canvas, ir.getType(), angle))
    }
    function applyRotate(image, type, angle) {
      const canvas = Canvas.create(image.width, image.height)
      const context = Canvas.get2dContext(canvas)
      let translateX = 0; let translateY = 0
      angle = angle < 0 ? 360 + angle : angle
      if (angle == 90 || angle == 270) {
        Canvas.resize(canvas, canvas.height, canvas.width)
      }
      if (angle == 90 || angle == 180) {
        translateX = canvas.width
      }
      if (angle == 270 || angle == 180) {
        translateY = canvas.height
      }
      context.translate(translateX, translateY)
      context.rotate(angle * Math.PI / 180)
      context.drawImage(image, 0, 0)
      return ImageResult.fromCanvas(canvas, type)
    }
    function flip(ir, axis) {
      return ir.toCanvas().then((canvas) => applyFlip(canvas, ir.getType(), axis))
    }
    function applyFlip(image, type, axis) {
      const canvas = Canvas.create(image.width, image.height)
      const context = Canvas.get2dContext(canvas)
      if (axis == 'v') {
        context.scale(1, -1)
        context.drawImage(image, 0, -canvas.height)
      } else {
        context.scale(-1, 1)
        context.drawImage(image, -canvas.width, 0)
      }
      return ImageResult.fromCanvas(canvas, type)
    }
    function crop(ir, x, y, w, h) {
      return ir.toCanvas().then((canvas) => applyCrop(canvas, ir.getType(), x, y, w, h))
    }
    function applyCrop(image, type, x, y, w, h) {
      const canvas = Canvas.create(w, h)
      const context = Canvas.get2dContext(canvas)
      context.drawImage(image, -x, -y)
      return ImageResult.fromCanvas(canvas, type)
    }
    function resize$1(ir, w, h) {
      return ir.toCanvas().then((canvas) => ImageResizerCanvas.scale(canvas, w, h).then((newCanvas) => ImageResult.fromCanvas(newCanvas, ir.getType())))
    }
    const ImageTools = {
      rotate,
      flip,
      crop,
      resize: resize$1,
    }

    const BinaryReader = (function () {
      function BinaryReader(ar) {
        this.littleEndian = false
        this._dv = new DataView(ar)
      }
      BinaryReader.prototype.readByteAt = function (idx) {
        return this._dv.getUint8(idx)
      }
      BinaryReader.prototype.read = function (idx, size) {
        if (idx + size > this.length()) {
          return null
        }
        const mv = this.littleEndian ? 0 : -8 * (size - 1)
        for (var i = 0, sum = 0; i < size; i++) {
          sum |= this.readByteAt(idx + i) << Math.abs(mv + i * 8)
        }
        return sum
      }
      BinaryReader.prototype.BYTE = function (idx) {
        return this.read(idx, 1)
      }
      BinaryReader.prototype.SHORT = function (idx) {
        return this.read(idx, 2)
      }
      BinaryReader.prototype.LONG = function (idx) {
        return this.read(idx, 4)
      }
      BinaryReader.prototype.SLONG = function (idx) {
        const num = this.read(idx, 4)
        return num > 2147483647 ? num - 4294967296 : num
      }
      BinaryReader.prototype.CHAR = function (idx) {
        return String.fromCharCode(this.read(idx, 1))
      }
      BinaryReader.prototype.STRING = function (idx, count) {
        return this.asArray('CHAR', idx, count).join('')
      }
      BinaryReader.prototype.SEGMENT = function (idx, size) {
        const ar = this._dv.buffer
        switch (arguments.length) {
          case 2:
            return ar.slice(idx, idx + size)
          case 1:
            return ar.slice(idx)
          default:
            return ar
        }
      }
      BinaryReader.prototype.asArray = function (type, idx, count) {
        const values = []
        for (let i = 0; i < count; i++) {
          values[i] = this[type](idx + i)
        }
        return values
      }
      BinaryReader.prototype.length = function () {
        return this._dv ? this._dv.byteLength : 0
      }
      return BinaryReader
    }())

    const tags = {
      tiff: {
        274: 'Orientation',
        270: 'ImageDescription',
        271: 'Make',
        272: 'Model',
        305: 'Software',
        34665: 'ExifIFDPointer',
        34853: 'GPSInfoIFDPointer',
      },
      exif: {
        36864: 'ExifVersion',
        40961: 'ColorSpace',
        40962: 'PixelXDimension',
        40963: 'PixelYDimension',
        36867: 'DateTimeOriginal',
        33434: 'ExposureTime',
        33437: 'FNumber',
        34855: 'ISOSpeedRatings',
        37377: 'ShutterSpeedValue',
        37378: 'ApertureValue',
        37383: 'MeteringMode',
        37384: 'LightSource',
        37385: 'Flash',
        37386: 'FocalLength',
        41986: 'ExposureMode',
        41987: 'WhiteBalance',
        41990: 'SceneCaptureType',
        41988: 'DigitalZoomRatio',
        41992: 'Contrast',
        41993: 'Saturation',
        41994: 'Sharpness',
      },
      gps: {
        0: 'GPSVersionID',
        1: 'GPSLatitudeRef',
        2: 'GPSLatitude',
        3: 'GPSLongitudeRef',
        4: 'GPSLongitude',
      },
      thumb: {
        513: 'JPEGInterchangeFormat',
        514: 'JPEGInterchangeFormatLength',
      },
    }
    const tagDescs = {
      ColorSpace: {
        1: 'sRGB',
        0: 'Uncalibrated',
      },
      MeteringMode: {
        0: 'Unknown',
        1: 'Average',
        2: 'CenterWeightedAverage',
        3: 'Spot',
        4: 'MultiSpot',
        5: 'Pattern',
        6: 'Partial',
        255: 'Other',
      },
      LightSource: {
        1: 'Daylight',
        2: 'Fliorescent',
        3: 'Tungsten',
        4: 'Flash',
        9: 'Fine weather',
        10: 'Cloudy weather',
        11: 'Shade',
        12: 'Daylight fluorescent (D 5700 - 7100K)',
        13: 'Day white fluorescent (N 4600 -5400K)',
        14: 'Cool white fluorescent (W 3900 - 4500K)',
        15: 'White fluorescent (WW 3200 - 3700K)',
        17: 'Standard light A',
        18: 'Standard light B',
        19: 'Standard light C',
        20: 'D55',
        21: 'D65',
        22: 'D75',
        23: 'D50',
        24: 'ISO studio tungsten',
        255: 'Other',
      },
      Flash: {
        0: 'Flash did not fire',
        1: 'Flash fired',
        5: 'Strobe return light not detected',
        7: 'Strobe return light detected',
        9: 'Flash fired, compulsory flash mode',
        13: 'Flash fired, compulsory flash mode, return light not detected',
        15: 'Flash fired, compulsory flash mode, return light detected',
        16: 'Flash did not fire, compulsory flash mode',
        24: 'Flash did not fire, auto mode',
        25: 'Flash fired, auto mode',
        29: 'Flash fired, auto mode, return light not detected',
        31: 'Flash fired, auto mode, return light detected',
        32: 'No flash function',
        65: 'Flash fired, red-eye reduction mode',
        69: 'Flash fired, red-eye reduction mode, return light not detected',
        71: 'Flash fired, red-eye reduction mode, return light detected',
        73: 'Flash fired, compulsory flash mode, red-eye reduction mode',
        77: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected',
        79: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light detected',
        89: 'Flash fired, auto mode, red-eye reduction mode',
        93: 'Flash fired, auto mode, return light not detected, red-eye reduction mode',
        95: 'Flash fired, auto mode, return light detected, red-eye reduction mode',
      },
      ExposureMode: {
        0: 'Auto exposure',
        1: 'Manual exposure',
        2: 'Auto bracket',
      },
      WhiteBalance: {
        0: 'Auto white balance',
        1: 'Manual white balance',
      },
      SceneCaptureType: {
        0: 'Standard',
        1: 'Landscape',
        2: 'Portrait',
        3: 'Night scene',
      },
      Contrast: {
        0: 'Normal',
        1: 'Soft',
        2: 'Hard',
      },
      Saturation: {
        0: 'Normal',
        1: 'Low saturation',
        2: 'High saturation',
      },
      Sharpness: {
        0: 'Normal',
        1: 'Soft',
        2: 'Hard',
      },
      GPSLatitudeRef: {
        N: 'North latitude',
        S: 'South latitude',
      },
      GPSLongitudeRef: {
        E: 'East longitude',
        W: 'West longitude',
      },
    }
    const ExifReader = (function () {
      function ExifReader(ar) {
        this._offsets = {
          tiffHeader: 10,
          IFD0: null,
          IFD1: null,
          exifIFD: null,
          gpsIFD: null,
        }
        this._tiffTags = {}
        const self = this
        self._reader = new BinaryReader(ar)
        self._idx = self._offsets.tiffHeader
        if (self.SHORT(0) !== 65505 || self.STRING(4, 5).toUpperCase() !== 'EXIF\0') {
          throw new Error('Exif data cannot be read or not available.')
        }
        self._reader.littleEndian = self.SHORT(self._idx) == 18761
        if (self.SHORT(self._idx += 2) !== 42) {
          throw new Error('Invalid Exif data.')
        }
        self._offsets.IFD0 = self._offsets.tiffHeader + self.LONG(self._idx += 2)
        self._tiffTags = self.extractTags(self._offsets.IFD0, tags.tiff)
        if ('ExifIFDPointer' in self._tiffTags) {
          self._offsets.exifIFD = self._offsets.tiffHeader + self._tiffTags.ExifIFDPointer
          delete self._tiffTags.ExifIFDPointer
        }
        if ('GPSInfoIFDPointer' in self._tiffTags) {
          self._offsets.gpsIFD = self._offsets.tiffHeader + self._tiffTags.GPSInfoIFDPointer
          delete self._tiffTags.GPSInfoIFDPointer
        }
        const IFD1Offset = self.LONG(self._offsets.IFD0 + self.SHORT(self._offsets.IFD0) * 12 + 2)
        if (IFD1Offset) {
          self._offsets.IFD1 = self._offsets.tiffHeader + IFD1Offset
        }
      }
      ExifReader.prototype.BYTE = function (idx) {
        return this._reader.BYTE(idx)
      }
      ExifReader.prototype.SHORT = function (idx) {
        return this._reader.SHORT(idx)
      }
      ExifReader.prototype.LONG = function (idx) {
        return this._reader.LONG(idx)
      }
      ExifReader.prototype.SLONG = function (idx) {
        return this._reader.SLONG(idx)
      }
      ExifReader.prototype.CHAR = function (idx) {
        return this._reader.CHAR(idx)
      }
      ExifReader.prototype.STRING = function (idx, count) {
        return this._reader.STRING(idx, count)
      }
      ExifReader.prototype.SEGMENT = function (idx, size) {
        return this._reader.SEGMENT(idx, size)
      }
      ExifReader.prototype.asArray = function (type, idx, count) {
        const values = []
        for (let i = 0; i < count; i++) {
          values[i] = this[type](idx + i)
        }
        return values
      }
      ExifReader.prototype.length = function () {
        return this._reader.length()
      }
      ExifReader.prototype.UNDEFINED = function () {
        return this.BYTE.apply(this, arguments)
      }
      ExifReader.prototype.RATIONAL = function (idx) {
        return this.LONG(idx) / this.LONG(idx + 4)
      }
      ExifReader.prototype.SRATIONAL = function (idx) {
        return this.SLONG(idx) / this.SLONG(idx + 4)
      }
      ExifReader.prototype.ASCII = function (idx) {
        return this.CHAR(idx)
      }
      ExifReader.prototype.TIFF = function () {
        return this._tiffTags
      }
      ExifReader.prototype.EXIF = function () {
        const self = this
        let Exif = null
        if (self._offsets.exifIFD) {
          try {
            Exif = self.extractTags(self._offsets.exifIFD, tags.exif)
          } catch (ex) {
            return null
          }
          if (Exif.ExifVersion && Array.isArray(Exif.ExifVersion)) {
            for (var i = 0, exifVersion = ''; i < Exif.ExifVersion.length; i++) {
              exifVersion += String.fromCharCode(Exif.ExifVersion[i])
            }
            Exif.ExifVersion = exifVersion
          }
        }
        return Exif
      }
      ExifReader.prototype.GPS = function () {
        const self = this
        let GPS = null
        if (self._offsets.gpsIFD) {
          try {
            GPS = self.extractTags(self._offsets.gpsIFD, tags.gps)
          } catch (ex) {
            return null
          }
          if (GPS.GPSVersionID && Array.isArray(GPS.GPSVersionID)) {
            GPS.GPSVersionID = GPS.GPSVersionID.join('.')
          }
        }
        return GPS
      }
      ExifReader.prototype.thumb = function () {
        const self = this
        if (self._offsets.IFD1) {
          try {
            const IFD1Tags = self.extractTags(self._offsets.IFD1, tags.thumb)
            if ('JPEGInterchangeFormat' in IFD1Tags) {
              return self.SEGMENT(self._offsets.tiffHeader + IFD1Tags.JPEGInterchangeFormat, IFD1Tags.JPEGInterchangeFormatLength)
            }
          } catch (ex) {
          }
        }
        return null
      }
      ExifReader.prototype.extractTags = function (IFD_offset, tags2extract) {
        const self = this
        let length; let i; let tag; let type; let count; let size; let offset; let value; let values = []; const hash = {}
        const types = {
          1: 'BYTE',
          7: 'UNDEFINED',
          2: 'ASCII',
          3: 'SHORT',
          4: 'LONG',
          5: 'RATIONAL',
          9: 'SLONG',
          10: 'SRATIONAL',
        }
        const sizes = {
          BYTE: 1,
          UNDEFINED: 1,
          ASCII: 1,
          SHORT: 2,
          LONG: 4,
          RATIONAL: 8,
          SLONG: 4,
          SRATIONAL: 8,
        }
        length = self.SHORT(IFD_offset)
        for (i = 0; i < length; i++) {
          values = []
          offset = IFD_offset + 2 + i * 12
          tag = tags2extract[self.SHORT(offset)]
          if (tag === undefined) {
            continue
          }
          type = types[self.SHORT(offset += 2)]
          count = self.LONG(offset += 2)
          size = sizes[type]
          if (!size) {
            throw new Error('Invalid Exif data.')
          }
          offset += 4
          if (size * count > 4) {
            offset = self.LONG(offset) + self._offsets.tiffHeader
          }
          if (offset + size * count >= self.length()) {
            throw new Error('Invalid Exif data.')
          }
          if (type === 'ASCII') {
            hash[tag] = self.STRING(offset, count).replace(/\0$/, '').trim()
            continue
          } else {
            values = self.asArray(type, offset, count)
            value = count == 1 ? values[0] : values
            if (tagDescs.hasOwnProperty(tag) && typeof value !== 'object') {
              hash[tag] = tagDescs[tag][value]
            } else {
              hash[tag] = value
            }
          }
        }
        return hash
      }
      return ExifReader
    }())

    const extractFrom = function (blob) {
      return Conversions.blobToArrayBuffer(blob).then((ar) => {
        try {
          const br = new BinaryReader(ar)
          if (br.SHORT(0) === 65496) {
            const headers = extractHeaders(br)
            const app1 = headers.filter((header) => header.name === 'APP1')
            let meta = {}
            if (app1.length) {
              const exifReader = new ExifReader(app1[0].segment)
              meta = {
                tiff: exifReader.TIFF(),
                exif: exifReader.EXIF(),
                gps: exifReader.GPS(),
                thumb: exifReader.thumb(),
              }
            } else {
              return Promise.reject('Headers did not include required information')
            }
            meta.rawHeaders = headers
            return meta
          }
          return Promise.reject('Image was not a jpeg')
        } catch (ex) {
          return Promise.reject(`Unsupported format or not an image: ${blob.type} (Exception: ${ex.message})`)
        }
      })
    }
    var extractHeaders = function (br) {
      const headers = []; let idx; let marker; let length = 0
      idx = 2
      while (idx <= br.length()) {
        marker = br.SHORT(idx)
        if (marker >= 65488 && marker <= 65495) {
          idx += 2
          continue
        }
        if (marker === 65498 || marker === 65497) {
          break
        }
        length = br.SHORT(idx + 2) + 2
        if (marker >= 65505 && marker <= 65519) {
          headers.push({
            hex: marker,
            name: `APP${marker & 15}`,
            start: idx,
            length,
            segment: br.SEGMENT(idx, length),
          })
        }
        idx += length
      }
      return headers
    }
    const JPEGMeta = { extractFrom }

    const invert = function (ir) {
      return Filters.invert(ir)
    }
    const sharpen = function (ir) {
      return Filters.sharpen(ir)
    }
    const emboss = function (ir) {
      return Filters.emboss(ir)
    }
    const gamma = function (ir, value) {
      return Filters.gamma(ir, value)
    }
    const exposure = function (ir, value) {
      return Filters.exposure(ir, value)
    }
    const colorize = function (ir, adjustR, adjustG, adjustB) {
      return Filters.colorize(ir, adjustR, adjustG, adjustB)
    }
    const brightness = function (ir, adjust) {
      return Filters.brightness(ir, adjust)
    }
    const hue = function (ir, adjust) {
      return Filters.hue(ir, adjust)
    }
    const saturate = function (ir, adjust) {
      return Filters.saturate(ir, adjust)
    }
    const contrast = function (ir, adjust) {
      return Filters.contrast(ir, adjust)
    }
    const grayscale = function (ir, adjust) {
      return Filters.grayscale(ir, adjust)
    }
    const sepia = function (ir, adjust) {
      return Filters.sepia(ir, adjust)
    }
    const flip$1 = function (ir, axis) {
      return ImageTools.flip(ir, axis)
    }
    const crop$1 = function (ir, x, y, w, h) {
      return ImageTools.crop(ir, x, y, w, h)
    }
    const resize$2 = function (ir, w, h) {
      return ImageTools.resize(ir, w, h)
    }
    const rotate$1 = function (ir, angle) {
      return ImageTools.rotate(ir, angle)
    }
    const exifRotate = function (ir) {
      const ROTATE_90 = 6
      const ROTATE_180 = 3
      const ROTATE_270 = 8
      const checkRotation = function (data) {
        const orientation = data.tiff.Orientation
        switch (orientation) {
          case ROTATE_90:
            return rotate$1(ir, 90)
          case ROTATE_180:
            return rotate$1(ir, 180)
          case ROTATE_270:
            return rotate$1(ir, 270)
          default:
            return ir
        }
      }
      const notJpeg = function () {
        return ir
      }
      return ir.toBlob().then(JPEGMeta.extractFrom).then(checkRotation, notJpeg)
    }
    const ImageTransformations = {
      invert,
      sharpen,
      emboss,
      brightness,
      hue,
      saturate,
      contrast,
      grayscale,
      sepia,
      colorize,
      gamma,
      exposure,
      flip: flip$1,
      crop: crop$1,
      resize: resize$2,
      rotate: rotate$1,
      exifRotate,
    }

    const blobToImageResult = function (blob) {
      return ImageResult.fromBlob(blob)
    }
    const fromBlobAndUrlSync$1 = function (blob, uri) {
      return ImageResult.fromBlobAndUrlSync(blob, uri)
    }
    const imageToImageResult = function (image) {
      return ImageResult.fromImage(image)
    }
    const imageResultToBlob = function (ir, type, quality) {
      if (type === undefined && quality === undefined) {
        return imageResultToOriginalBlob(ir)
      }
      return ir.toAdjustedBlob(type, quality)
    }
    var imageResultToOriginalBlob = function (ir) {
      return ir.toBlob()
    }
    const imageResultToDataURL = function (ir) {
      return ir.toDataURL()
    }
    const ResultConversions = {
      blobToImageResult,
      fromBlobAndUrlSync: fromBlobAndUrlSync$1,
      imageToImageResult,
      imageResultToBlob,
      imageResultToOriginalBlob,
      imageResultToDataURL,
    }

    const url = function () {
      return Global$1.getOrDie('URL')
    }
    const createObjectURL = function (blob) {
      return url().createObjectURL(blob)
    }
    const revokeObjectURL = function (u) {
      url().revokeObjectURL(u)
    }
    const URL$1 = {
      createObjectURL,
      revokeObjectURL,
    }

    const global$2 = tinymce.util.Tools.resolve('tinymce.util.Delay')

    const global$3 = tinymce.util.Tools.resolve('tinymce.util.Promise')

    const global$4 = tinymce.util.Tools.resolve('tinymce.util.URI')

    const getToolbarItems = function (editor) {
      return editor.getParam('imagetools_toolbar', 'rotateleft rotateright flipv fliph crop editimage imageoptions')
    }
    const getProxyUrl = function (editor) {
      return editor.getParam('imagetools_proxy')
    }
    const getCorsHosts = function (editor) {
      return editor.getParam('imagetools_cors_hosts', [], 'string[]')
    }
    const getCredentialsHosts = function (editor) {
      return editor.getParam('imagetools_credentials_hosts', [], 'string[]')
    }
    const getApiKey = function (editor) {
      return editor.getParam('api_key', editor.getParam('imagetools_api_key', '', 'string'), 'string')
    }
    const getUploadTimeout = function (editor) {
      return editor.getParam('images_upload_timeout', 30000, 'number')
    }
    const shouldReuseFilename = function (editor) {
      return editor.getParam('images_reuse_filename', false, 'boolean')
    }

    function getImageSize(img) {
      let width, height
      function isPxValue(value) {
        return /^[0-9\.]+px$/.test(value)
      }
      width = img.style.width
      height = img.style.height
      if (width || height) {
        if (isPxValue(width) && isPxValue(height)) {
          return {
            w: parseInt(width, 10),
            h: parseInt(height, 10),
          }
        }
        return null
      }
      width = img.width
      height = img.height
      if (width && height) {
        return {
          w: parseInt(width, 10),
          h: parseInt(height, 10),
        }
      }
      return null
    }
    function setImageSize(img, size) {
      let width, height
      if (size) {
        width = img.style.width
        height = img.style.height
        if (width || height) {
          img.style.width = `${size.w}px`
          img.style.height = `${size.h}px`
          img.removeAttribute('data-mce-style')
        }
        width = img.width
        height = img.height
        if (width || height) {
          img.setAttribute('width', size.w)
          img.setAttribute('height', size.h)
        }
      }
    }
    function getNaturalImageSize(img) {
      return {
        w: img.naturalWidth,
        h: img.naturalHeight,
      }
    }
    const ImageSize$1 = {
      getImageSize,
      setImageSize,
      getNaturalImageSize,
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
    const isFunction = isType('function')

    const find = function (xs, pred) {
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i]
        if (pred(x, i, xs)) {
          return Option.some(x)
        }
      }
      return Option.none()
    }
    const { slice } = Array.prototype
    const from$1 = isFunction(Array.from) ? Array.from : function (x) {
      return slice.call(x)
    }

    function XMLHttpRequest$1() {
      const f = Global$1.getOrDie('XMLHttpRequest')
      return new f()
    }

    const isValue = function (obj) {
      return obj !== null && obj !== undefined
    }
    const traverse = function (json, path) {
      let value
      value = path.reduce((result, key) => isValue(result) ? result[key] : undefined, json)
      return isValue(value) ? value : null
    }
    const requestUrlAsBlob = function (url, headers, withCredentials) {
      return new global$3((resolve) => {
        let xhr
        xhr = XMLHttpRequest$1()
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            resolve({
              status: xhr.status,
              blob: this.response,
            })
          }
        }
        xhr.open('GET', url, true)
        xhr.withCredentials = withCredentials
        global$1.each(headers, (value, key) => {
          xhr.setRequestHeader(key, value)
        })
        xhr.responseType = 'blob'
        xhr.send()
      })
    }
    const readBlob = function (blob) {
      return new global$3((resolve) => {
        const fr = FileReader()
        fr.onload = function (e) {
          const data = e.target
          resolve(data.result)
        }
        fr.readAsText(blob)
      })
    }
    const parseJson = function (text) {
      let json
      try {
        json = JSON.parse(text)
      } catch (ex) {
      }
      return json
    }
    const Utils = {
      traverse,
      readBlob,
      requestUrlAsBlob,
      parseJson,
    }

    const friendlyHttpErrors = [
      {
        code: 404,
        message: 'Could not find Image Proxy',
      },
      {
        code: 403,
        message: 'Rejected request',
      },
      {
        code: 0,
        message: 'Incorrect Image Proxy URL',
      },
    ]
    const friendlyServiceErrors = [
      {
        type: 'key_missing',
        message: 'The request did not include an api key.',
      },
      {
        type: 'key_not_found',
        message: 'The provided api key could not be found.',
      },
      {
        type: 'domain_not_trusted',
        message: 'The api key is not valid for the request origins.',
      },
    ]
    const isServiceErrorCode = function (code) {
      return code === 400 || code === 403 || code === 500
    }
    const getHttpErrorMsg = function (status) {
      const message = find(friendlyHttpErrors, (error) => status === error.code).fold(constant('Unknown ImageProxy error'), (error) => error.message)
      return `ImageProxy HTTP error: ${message}`
    }
    const handleHttpError = function (status) {
      const message = getHttpErrorMsg(status)
      return global$3.reject(message)
    }
    const getServiceErrorMsg = function (type) {
      return find(friendlyServiceErrors, (error) => error.type === type).fold(constant('Unknown service error'), (error) => error.message)
    }
    const getServiceError = function (text) {
      const serviceError = Utils.parseJson(text)
      const errorType = Utils.traverse(serviceError, [
        'error',
        'type',
      ])
      const errorMsg = errorType ? getServiceErrorMsg(errorType) : 'Invalid JSON in service error message'
      return `ImageProxy Service error: ${errorMsg}`
    }
    const handleServiceError = function (status, blob) {
      return Utils.readBlob(blob).then((text) => {
        const serviceError = getServiceError(text)
        return global$3.reject(serviceError)
      })
    }
    const handleServiceErrorResponse = function (status, blob) {
      return isServiceErrorCode(status) ? handleServiceError(status, blob) : handleHttpError(status)
    }
    const Errors = {
      handleServiceErrorResponse,
      handleHttpError,
      getHttpErrorMsg,
      getServiceErrorMsg,
    }

    const appendApiKey = function (url, apiKey) {
      const separator = url.indexOf('?') === -1 ? '?' : '&'
      if (/[?&]apiKey=/.test(url) || !apiKey) {
        return url
      }
      return `${url + separator}apiKey=${encodeURIComponent(apiKey)}`
    }
    const requestServiceBlob = function (url, apiKey) {
      const headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'tiny-api-key': apiKey,
      }
      return Utils.requestUrlAsBlob(appendApiKey(url, apiKey), headers, false).then((result) => result.status < 200 || result.status >= 300 ? Errors.handleServiceErrorResponse(result.status, result.blob) : global$3.resolve(result.blob))
    }
    function requestBlob(url, withCredentials) {
      return Utils.requestUrlAsBlob(url, {}, withCredentials).then((result) => result.status < 200 || result.status >= 300 ? Errors.handleHttpError(result.status) : global$3.resolve(result.blob))
    }
    const getUrl = function (url, apiKey, withCredentials) {
      return apiKey ? requestServiceBlob(url, apiKey) : requestBlob(url, withCredentials)
    }

    let count = 0
    const isEditableImage = function (editor, img) {
      const selectorMatched = editor.dom.is(img, 'img:not([data-mce-object],[data-mce-placeholder])')
      return selectorMatched && (isLocalImage(editor, img) || isCorsImage(editor, img) || editor.settings.imagetools_proxy)
    }
    const displayError = function (editor, error) {
      editor.notificationManager.open({
        text: error,
        type: 'error',
      })
    }
    const getSelectedImage = function (editor) {
      return editor.selection.getNode()
    }
    const extractFilename = function (editor, url) {
      const m = url.match(/\/([^\/\?]+)?\.(?:jpeg|jpg|png|gif)(?:\?|$)/i)
      if (m) {
        return editor.dom.encode(m[1])
      }
      return null
    }
    const createId = function () {
      return `imagetools${count++}`
    }
    var isLocalImage = function (editor, img) {
      const url = img.src
      return url.indexOf('data:') === 0 || url.indexOf('blob:') === 0 || new global$4(url).host === editor.documentBaseURI.host
    }
    var isCorsImage = function (editor, img) {
      return global$1.inArray(getCorsHosts(editor), new global$4(img.src).host) !== -1
    }
    const isCorsWithCredentialsImage = function (editor, img) {
      return global$1.inArray(getCredentialsHosts(editor), new global$4(img.src).host) !== -1
    }
    const imageToBlob$2 = function (editor, img) {
      let { src } = img; let apiKey
      if (isCorsImage(editor, img)) {
        return getUrl(img.src, null, isCorsWithCredentialsImage(editor, img))
      }
      if (!isLocalImage(editor, img)) {
        src = getProxyUrl(editor)
        src += `${src.indexOf('?') === -1 ? '?' : '&'}url=${encodeURIComponent(img.src)}`
        apiKey = getApiKey(editor)
        return getUrl(src, apiKey, false)
      }
      return BlobConversions.imageToBlob(img)
    }
    const findSelectedBlob = function (editor) {
      let blobInfo
      blobInfo = editor.editorUpload.blobCache.getByUri(getSelectedImage(editor).src)
      if (blobInfo) {
        return global$3.resolve(blobInfo.blob())
      }
      return imageToBlob$2(editor, getSelectedImage(editor))
    }
    const startTimedUpload = function (editor, imageUploadTimerState) {
      const imageUploadTimer = global$2.setEditorTimeout(editor, () => {
        editor.editorUpload.uploadImagesAuto()
      }, getUploadTimeout(editor))
      imageUploadTimerState.set(imageUploadTimer)
    }
    const cancelTimedUpload = function (imageUploadTimerState) {
      clearTimeout(imageUploadTimerState.get())
    }
    const updateSelectedImage = function (editor, ir, uploadImmediately, imageUploadTimerState, size) {
      return ir.toBlob().then((blob) => {
        let uri, name, blobCache, blobInfo, selectedImage
        blobCache = editor.editorUpload.blobCache
        selectedImage = getSelectedImage(editor)
        uri = selectedImage.src
        if (shouldReuseFilename(editor)) {
          blobInfo = blobCache.getByUri(uri)
          if (blobInfo) {
            uri = blobInfo.uri()
            name = blobInfo.name()
          } else {
            name = extractFilename(editor, uri)
          }
        }
        blobInfo = blobCache.create({
          id: createId(),
          blob,
          base64: ir.toBase64(),
          uri,
          name,
        })
        blobCache.add(blobInfo)
        editor.undoManager.transact(() => {
          function imageLoadedHandler() {
            editor.$(selectedImage).off('load', imageLoadedHandler)
            editor.nodeChanged()
            if (uploadImmediately) {
              editor.editorUpload.uploadImagesAuto()
            } else {
              cancelTimedUpload(imageUploadTimerState)
              startTimedUpload(editor, imageUploadTimerState)
            }
          }
          editor.$(selectedImage).on('load', imageLoadedHandler)
          if (size) {
            editor.$(selectedImage).attr({
              width: size.w,
              height: size.h,
            })
          }
          editor.$(selectedImage).attr({ src: blobInfo.blobUri() }).removeAttr('data-mce-src')
        })
        return blobInfo
      })
    }
    const selectedImageOperation = function (editor, imageUploadTimerState, fn, size) {
      return function () {
        return editor._scanForImages().then(curry(findSelectedBlob, editor)).then(ResultConversions.blobToImageResult).then(fn).then((imageResult) => updateSelectedImage(editor, imageResult, false, imageUploadTimerState, size), (error) => {
          displayError(editor, error)
        })
      }
    }
    const rotate$2 = function (editor, imageUploadTimerState, angle) {
      return function () {
        const size = ImageSize$1.getImageSize(getSelectedImage(editor))
        const flippedSize = size ? {
          w: size.h,
          h: size.w,
        } : null
        return selectedImageOperation(editor, imageUploadTimerState, (imageResult) => ImageTransformations.rotate(imageResult, angle), flippedSize)()
      }
    }
    const flip$2 = function (editor, imageUploadTimerState, axis) {
      return function () {
        return selectedImageOperation(editor, imageUploadTimerState, (imageResult) => ImageTransformations.flip(imageResult, axis))()
      }
    }
    const handleDialogBlob = function (editor, imageUploadTimerState, img, originalSize, blob) {
      return new global$3((resolve) => {
        BlobConversions.blobToImage(blob).then((newImage) => {
          const newSize = ImageSize$1.getNaturalImageSize(newImage)
          if (originalSize.w !== newSize.w || originalSize.h !== newSize.h) {
            if (ImageSize$1.getImageSize(img)) {
              ImageSize$1.setImageSize(img, newSize)
            }
          }
          URL$1.revokeObjectURL(newImage.src)
          return blob
        }).then(ResultConversions.blobToImageResult).then((imageResult) => updateSelectedImage(editor, imageResult, true, imageUploadTimerState), () => {
        })
      })
    }
    const Actions = {
      rotate: rotate$2,
      flip: flip$2,
      isEditableImage,
      cancelTimedUpload,
      findSelectedBlob,
      getSelectedImage,
      handleDialogBlob,
    }

    const saveState = constant('save-state')
    const disable = constant('disable')
    const enable = constant('enable')

    const createState = function (blob) {
      return {
        blob,
        url: URL$1.createObjectURL(blob),
      }
    }
    const makeOpen = function (editor, imageUploadTimerState) {
      return function () {
        const getLoadedSpec = function (currentState) {
          return {
            title: 'Edit Image',
            size: 'large',
            body: {
              type: 'panel',
              items: [{
                type: 'imagetools',
                name: 'imagetools',
                label: 'Edit Image',
                currentState,
              }],
            },
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
                disabled: true,
              },
            ],
            onSubmit(api) {
              const { blob } = api.getData().imagetools
              Actions.handleDialogBlob(editor, imageUploadTimerState, originalImg, originalSize, blob)
              api.close()
            },
            onCancel() {
            },
            onAction(api, details) {
              switch (details.name) {
                case saveState():
                  if (details.value) {
                    api.enable('save')
                  } else {
                    api.disable('save')
                  }
                  break
                case disable():
                  api.block('Updating image')
                  api.disable('save')
                  api.disable('cancel')
                  break
                case enable():
                  api.unblock()
                  api.enable('cancel')
                  break
              }
            },
          }
        }
        var originalImg = Actions.getSelectedImage(editor)
        var originalSize = ImageSize$1.getNaturalImageSize(originalImg)
        const img = Actions.getSelectedImage(editor)
        if (Actions.isEditableImage(editor, img)) {
          Actions.findSelectedBlob(editor).then((blob) => {
            const state = createState(blob)
            editor.windowManager.open(getLoadedSpec(state))
          })
        }
      }
    }
    const Dialog = { makeOpen }

    const register = function (editor, imageUploadTimerState) {
      global$1.each({
        mceImageRotateLeft: Actions.rotate(editor, imageUploadTimerState, -90),
        mceImageRotateRight: Actions.rotate(editor, imageUploadTimerState, 90),
        mceImageFlipVertical: Actions.flip(editor, imageUploadTimerState, 'v'),
        mceImageFlipHorizontal: Actions.flip(editor, imageUploadTimerState, 'h'),
        mceEditImage: Dialog.makeOpen(editor, imageUploadTimerState),
      }, (fn, cmd) => {
        editor.addCommand(cmd, fn)
      })
    }
    const Commands = { register }

    const setup = function (editor, imageUploadTimerState, lastSelectedImageState) {
      editor.on('NodeChange', (e) => {
        const lastSelectedImage = lastSelectedImageState.get()
        if (lastSelectedImage && lastSelectedImage.src !== e.element.src) {
          Actions.cancelTimedUpload(imageUploadTimerState)
          editor.editorUpload.uploadImagesAuto()
          lastSelectedImageState.set(null)
        }
        if (Actions.isEditableImage(editor, e.element)) {
          lastSelectedImageState.set(e.element)
        }
      })
    }
    const UploadSelectedImage = { setup }

    const register$1 = function (editor) {
      const cmd = function (command) {
        return function () {
          return editor.execCommand(command)
        }
      }
      editor.ui.registry.addButton('rotateleft', {
        tooltip: 'Rotate counterclockwise',
        icon: 'rotate-left',
        onAction: cmd('mceImageRotateLeft'),
      })
      editor.ui.registry.addButton('rotateright', {
        tooltip: 'Rotate clockwise',
        icon: 'rotate-right',
        onAction: cmd('mceImageRotateRight'),
      })
      editor.ui.registry.addButton('flipv', {
        tooltip: 'Flip vertically',
        icon: 'flip-vertically',
        onAction: cmd('mceImageFlipVertical'),
      })
      editor.ui.registry.addButton('fliph', {
        tooltip: 'Flip horizontally',
        icon: 'flip-horizontally',
        onAction: cmd('mceImageFlipHorizontal'),
      })
      editor.ui.registry.addButton('editimage', {
        tooltip: 'Edit image',
        icon: 'edit-image',
        onAction: cmd('mceEditImage'),
        onSetup(buttonApi) {
          const setDisabled = function () {
            const element = Actions.getSelectedImage(editor)
            const disabled = !Actions.isEditableImage(editor, element)
            buttonApi.setDisabled(disabled)
          }
          editor.on('NodeChange', setDisabled)
          return function () {
            editor.off('NodeChange', setDisabled)
          }
        },
      })
      editor.ui.registry.addButton('imageoptions', {
        tooltip: 'Image options',
        icon: 'image-options',
        onAction: cmd('mceImage'),
      })
      editor.ui.registry.addContextMenu('imagetools', {
        update(element) {
          return !Actions.isEditableImage(editor, element) ? [] : [{
            text: 'Edit image',
            icon: 'edit-image',
            onAction: cmd('mceEditImage'),
          }]
        },
      })
    }
    const Buttons = { register: register$1 }

    const register$2 = function (editor) {
      editor.ui.registry.addContextToolbar('imagetools', {
        items: getToolbarItems(editor),
        predicate: curry(Actions.isEditableImage, editor),
        position: 'node',
        scope: 'node',
      })
    }
    const ContextToolbar = { register: register$2 }

    global.add('imagetools', (editor) => {
      const imageUploadTimerState = Cell(0)
      const lastSelectedImageState = Cell(null)
      Commands.register(editor, imageUploadTimerState)
      Buttons.register(editor)
      ContextToolbar.register(editor)
      UploadSelectedImage.setup(editor, imageUploadTimerState, lastSelectedImageState)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
