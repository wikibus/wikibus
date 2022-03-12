(function () {
  const mobile = (function (exports) {
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
    const apply = function (f) {
      return f()
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

    const { keys } = Object
    const { hasOwnProperty } = Object
    const each = function (obj, f) {
      const props = keys(obj)
      for (let k = 0, len = props.length; k < len; k++) {
        const i = props[k]
        const x = obj[i]
        f(x, i, obj)
      }
    }
    const map = function (obj, f) {
      return tupleMap(obj, (x, i, obj) => ({
        k: i,
        v: f(x, i, obj),
      }))
    }
    var tupleMap = function (obj, f) {
      const r = {}
      each(obj, (x, i) => {
        const tuple = f(x, i, obj)
        r[tuple.k] = tuple.v
      })
      return r
    }
    const mapToArray = function (obj, f) {
      const r = []
      each(obj, (value, name) => {
        r.push(f(value, name))
      })
      return r
    }
    const has = function (obj, key) {
      return hasOwnProperty.call(obj, key)
    }

    const touchstart = constant('touchstart')
    const touchmove = constant('touchmove')
    const touchend = constant('touchend')
    const mousedown = constant('mousedown')
    const mousemove = constant('mousemove')
    const mouseup = constant('mouseup')
    const mouseover = constant('mouseover')
    const keydown = constant('keydown')
    const keyup = constant('keyup')
    const input = constant('input')
    const change = constant('change')
    const click = constant('click')
    const transitionend = constant('transitionend')
    const selectstart = constant('selectstart')

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
    const find$1 = function (regexes, agent) {
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
      return find$1(versionRegexes, cleanedAgent)
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
        isIE: isBrowser(ie, current),
        isOpera: isBrowser(opera, current),
        isFirefox: isBrowser(firefox, current),
        isSafari: isBrowser(safari, current),
      }
    }
    const Browser = {
      unknown: unknown$1,
      nu: nu$1,
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
        isAndroid: isOS(android, current),
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
    const contains = function (xs, x) {
      return rawIndexOf(xs, x) > -1
    }
    const exists = function (xs, pred) {
      return findIndex(xs, pred).isSome()
    }
    const map$1 = function (xs, f) {
      const len = xs.length
      const r = new Array(len)
      for (let i = 0; i < len; i++) {
        const x = xs[i]
        r[i] = f(x, i, xs)
      }
      return r
    }
    const each$1 = function (xs, f) {
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
      each$1(xs, (x) => {
        acc = f(acc, x)
      })
      return acc
    }
    const find$2 = function (xs, pred) {
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
      const output = map$1(xs, f)
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
    const pure = function (x) {
      return [x]
    }
    const from$1 = isFunction(Array.from) ? Array.from : function (x) {
      return slice.call(x)
    }

    const detect$1 = function (candidates, userAgent) {
      const agent = String(userAgent).toLowerCase()
      return find$2(candidates, (candidate) => candidate.search(agent))
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

    const checkRange = function (str, substr, start) {
      if (substr === '') { return true }
      if (str.length < substr.length) { return false }
      const x = str.substr(start, start + substr.length)
      return x === substr
    }
    const supplant = function (str, obj) {
      const isStringOrNumber = function (a) {
        const t = typeof a
        return t === 'string' || t === 'number'
      }
      return str.replace(/\$\{([^{}]*)\}/g, (fullMatch, key) => {
        const value = obj[key]
        return isStringOrNumber(value) ? value.toString() : fullMatch
      })
    }
    const contains$1 = function (str, substr) {
      return str.indexOf(substr) !== -1
    }
    const endsWith = function (str, suffix) {
      return checkRange(str, suffix, str.length - suffix.length)
    }
    const trim = function (str) {
      return str.replace(/^\s+|\s+$/g, '')
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

    const alloy = { tap: constant('alloy.tap') }
    const focus$1 = constant('alloy.focus')
    const postBlur = constant('alloy.blur.post')
    const receive = constant('alloy.receive')
    const execute = constant('alloy.execute')
    const focusItem = constant('alloy.focus.item')
    const { tap } = alloy
    const tapOrClick = PlatformDetection$1.detect().deviceType.isTouch() ? alloy.tap : click
    const longpress = constant('alloy.longpress')
    const systemInit = constant('alloy.system.init')
    const attachedToDom = constant('alloy.system.attached')
    const detachedFromDom = constant('alloy.system.detached')
    const focusShifted = constant('alloy.focusmanager.shifted')

    const emit = function (component, event) {
      dispatchWith(component, component.element(), event, {})
    }
    const emitWith = function (component, event, properties) {
      dispatchWith(component, component.element(), event, properties)
    }
    const emitExecute = function (component) {
      emit(component, execute())
    }
    const dispatch = function (component, target, event) {
      dispatchWith(component, target, event, {})
    }
    var dispatchWith = function (component, target, event, properties) {
      const data = __assign({ target }, properties)
      component.getSystem().triggerEvent(event, target, map(data, constant))
    }
    const dispatchEvent = function (component, target, event, simulatedEvent) {
      component.getSystem().triggerEvent(event, target, simulatedEvent.event())
    }
    const dispatchFocus = function (component, target) {
      component.getSystem().triggerFocus(target, component.element())
    }

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

    const inBody = function (element) {
      const dom = isText(element) ? element.dom().parentNode : element.dom()
      return dom !== undefined && dom !== null && dom.ownerDocument.body.contains(dom)
    }
    const body = cached(() => getBody(Element$$1.fromDom(document)))
    var getBody = function (doc) {
      const b = doc.dom().body
      if (b === null || b === undefined) {
        throw new Error('Body is not available yet')
      }
      return Element$$1.fromDom(b)
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
        each$1(fields, (name, i) => {
          struct[name] = constant(values[i])
        })
        return struct
      }
    }

    const sort$1 = function (arr) {
      return arr.slice(0).sort()
    }
    const reqMessage = function (required, keys) {
      throw new Error(`All required keys (${sort$1(required).join(', ')}) were not specified. Specified keys were: ${sort$1(keys).join(', ')}.`)
    }
    const unsuppMessage = function (unsupported) {
      throw new Error(`Unsupported keys for object: ${sort$1(unsupported).join(', ')}`)
    }
    const validateStrArr = function (label, array) {
      if (!isArray(array)) { throw new Error(`The ${label} fields must be an array. Was: ${array}.`) }
      each$1(array, (a) => {
        if (!isString(a)) { throw new Error(`The value ${a} in the ${label} fields was not a string.`) }
      })
    }
    const checkDupes = function (everything) {
      const sorted = sort$1(everything)
      const dupe = find$2(sorted, (s, i) => i < sorted.length - 1 && s === sorted[i + 1])
      dupe.each((d) => {
        throw new Error(`The field: ${d} occurs more than once in the combined fields: [${sorted.join(', ')}].`)
      })
    }

    const MixedBag = function (required, optional) {
      const everything = required.concat(optional)
      if (everything.length === 0) { throw new Error('You must specify at least one required or optional field.') }
      validateStrArr('required', required)
      validateStrArr('optional', optional)
      checkDupes(everything)
      return function (obj) {
        const keys$$1 = keys(obj)
        const allReqd = forall(required, (req) => contains(keys$$1, req))
        if (!allReqd) { reqMessage(required, keys$$1) }
        const unsupported = filter(keys$$1, (key) => !contains(everything, key))
        if (unsupported.length > 0) { unsuppMessage(unsupported) }
        const r = {}
        each$1(required, (req) => {
          r[req] = constant(obj[req])
        })
        each$1(optional, (opt) => {
          r[opt] = constant(Object.prototype.hasOwnProperty.call(obj, opt) ? Option.some(obj[opt]) : Option.none())
        })
        return r
      }
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
    const is = function (element, selector) {
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
      return bypassSelector(base) ? [] : map$1(base.querySelectorAll(selector), Element$$1.fromDom)
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
    const contains$2 = browser.isIE() ? ieContains : regularContains

    const owner = function (element) {
      return Element$$1.fromDom(element.dom().ownerDocument)
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
    const siblings = function (element) {
      const filterSelf = function (elements) {
        return filter(elements, (x) => !eq(element, x))
      }
      return parent(element).map(children).map(filterSelf).getOr([])
    }
    const nextSibling = function (element) {
      const dom = element.dom()
      return Option.from(dom.nextSibling).map(Element$$1.fromDom)
    }
    var children = function (element) {
      const dom = element.dom()
      return map$1(dom.childNodes, Element$$1.fromDom)
    }
    const child = function (element, index) {
      const cs = element.dom().childNodes
      return Option.from(cs[index]).map(Element$$1.fromDom)
    }
    const firstChild = function (element) {
      return child(element, 0)
    }
    const spot = Immutable('element', 'offset')

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
    const appendAt = function (parent$$1, element, index) {
      child(parent$$1, index).fold(() => {
        append(parent$$1, element)
      }, (v) => {
        before(v, element)
      })
    }

    const append$1 = function (parent, elements) {
      each$1(elements, (x) => {
        append(parent, x)
      })
    }

    const empty = function (element) {
      element.dom().textContent = ''
      each$1(children(element), (rogue) => {
        remove(rogue)
      })
    }
    var remove = function (element) {
      const dom = element.dom()
      if (dom.parentNode !== null) {
        dom.parentNode.removeChild(dom)
      }
    }

    var fireDetaching = function (component) {
      emit(component, detachedFromDom())
      const children$$1 = component.components()
      each$1(children$$1, fireDetaching)
    }
    var fireAttaching = function (component) {
      const children$$1 = component.components()
      each$1(children$$1, fireAttaching)
      emit(component, attachedToDom())
    }
    const attach = function (parent$$1, child$$1) {
      attachWith(parent$$1, child$$1, append)
    }
    var attachWith = function (parent$$1, child$$1, insertion) {
      parent$$1.getSystem().addToWorld(child$$1)
      insertion(parent$$1.element(), child$$1.element())
      if (inBody(parent$$1.element())) {
        fireAttaching(child$$1)
      }
      parent$$1.syncComponents()
    }
    const doDetach = function (component) {
      fireDetaching(component)
      remove(component.element())
      component.getSystem().removeFromWorld(component)
    }
    const detach = function (component) {
      const parent$$1 = parent(component.element()).bind((p) => component.getSystem().getByDom(p).fold(Option.none, Option.some))
      doDetach(component)
      parent$$1.each((p) => {
        p.syncComponents()
      })
    }
    const detachChildren = function (component) {
      const subs = component.components()
      each$1(subs, doDetach)
      empty(component.element())
      component.syncComponents()
    }
    const attachSystem = function (element, guiSystem) {
      attachSystemInternal(element, guiSystem, append)
    }
    var attachSystemInternal = function (element, guiSystem, inserter) {
      inserter(element, guiSystem.element())
      const children$$1 = children(guiSystem.element())
      each$1(children$$1, (child$$1) => {
        guiSystem.getByDom(child$$1).each(fireAttaching)
      })
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

    const generate = function (cases) {
      if (!isArray(cases)) {
        throw new Error('cases must be an array')
      }
      if (cases.length === 0) {
        throw new Error('there must be at least one case')
      }
      const constructors = []
      const adt = {}
      each$1(cases, (acase, count) => {
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
    const Adt = { generate }

    const hasOwnProperty$1 = Object.prototype.hasOwnProperty
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
            if (hasOwnProperty$1.call(curObject, key)) {
              ret[key] = merger(ret[key], curObject[key])
            }
          }
        }
        return ret
      }
    }
    var deepMerge = baseMerge(deep)
    const merge = baseMerge(shallow)

    const adt = Adt.generate([
      { strict: [] },
      { defaultedThunk: ['fallbackThunk'] },
      { asOption: [] },
      { asDefaultedOptionThunk: ['fallbackThunk'] },
      { mergeWithThunk: ['baseThunk'] },
    ])
    const defaulted = function (fallback) {
      return adt.defaultedThunk(constant(fallback))
    }
    const mergeWith = function (base) {
      return adt.mergeWithThunk(constant(base))
    }
    const { strict } = adt
    const { asOption } = adt
    const { defaultedThunk } = adt
    const { asDefaultedOptionThunk } = adt
    const { mergeWithThunk } = adt

    const exclude = function (obj, fields) {
      const r = {}
      each(obj, (v, k) => {
        if (!contains(fields, k)) {
          r[k] = v
        }
      })
      return r
    }

    const readOpt = function (key) {
      return function (obj) {
        return has(obj, key) ? Option.from(obj[key]) : Option.none()
      }
    }
    const readOr = function (key, fallback) {
      return function (obj) {
        return has(obj, key) ? obj[key] : fallback
      }
    }
    const readOptFrom = function (obj, key) {
      return readOpt(key)(obj)
    }
    const hasKey = function (obj, key) {
      return has(obj, key) && obj[key] !== undefined && obj[key] !== null
    }

    const wrap$1 = function (key, value) {
      const r = {}
      r[key] = value
      return r
    }
    const wrapAll = function (keyvalues) {
      const r = {}
      each$1(keyvalues, (kv) => {
        r[kv.key] = kv.value
      })
      return r
    }

    const comparison = Adt.generate([
      {
        bothErrors: [
          'error1',
          'error2',
        ],
      },
      {
        firstError: [
          'error1',
          'value2',
        ],
      },
      {
        secondError: [
          'value1',
          'error2',
        ],
      },
      {
        bothValues: [
          'value1',
          'value2',
        ],
      },
    ])
    const partition$1 = function (results) {
      const errors = []
      const values = []
      each$1(results, (result) => {
        result.fold((err) => {
          errors.push(err)
        }, (value) => {
          values.push(value)
        })
      })
      return {
        errors,
        values,
      }
    }

    const exclude$1 = function (obj, fields) {
      return exclude(obj, fields)
    }
    const readOpt$1 = function (key) {
      return readOpt(key)
    }
    const readOr$1 = function (key, fallback) {
      return readOr(key, fallback)
    }
    const readOptFrom$1 = function (obj, key) {
      return readOptFrom(obj, key)
    }
    const wrap$2 = function (key, value) {
      return wrap$1(key, value)
    }
    const wrapAll$1 = function (keyvalues) {
      return wrapAll(keyvalues)
    }
    const mergeValues = function (values, base) {
      return values.length === 0 ? Result.value(base) : Result.value(deepMerge(base, merge.apply(undefined, values)))
    }
    const mergeErrors = function (errors) {
      return compose(Result.error, flatten)(errors)
    }
    const consolidate = function (objs, base) {
      const partitions = partition$1(objs)
      return partitions.errors.length > 0 ? mergeErrors(partitions.errors) : mergeValues(partitions.values, base)
    }
    const hasKey$1 = function (obj, key) {
      return hasKey(obj, key)
    }

    let SimpleResultType;
    (function (SimpleResultType) {
      SimpleResultType[SimpleResultType.Error = 0] = 'Error'
      SimpleResultType[SimpleResultType.Value = 1] = 'Value'
    }(SimpleResultType || (SimpleResultType = {})))
    const fold = function (res, onError, onValue) {
      return res.stype === SimpleResultType.Error ? onError(res.serror) : onValue(res.svalue)
    }
    const partition$2 = function (results) {
      const values = []
      const errors = []
      each$1(results, (obj) => {
        fold(obj, (err) => errors.push(err), (val) => values.push(val))
      })
      return {
        values,
        errors,
      }
    }
    const mapError = function (res, f) {
      if (res.stype === SimpleResultType.Error) {
        return {
          stype: SimpleResultType.Error,
          serror: f(res.serror),
        }
      }
      return res
    }
    const map$2 = function (res, f) {
      if (res.stype === SimpleResultType.Value) {
        return {
          stype: SimpleResultType.Value,
          svalue: f(res.svalue),
        }
      }
      return res
    }
    const bind$1 = function (res, f) {
      if (res.stype === SimpleResultType.Value) {
        return f(res.svalue)
      }
      return res
    }
    const bindError = function (res, f) {
      if (res.stype === SimpleResultType.Error) {
        return f(res.serror)
      }
      return res
    }
    const svalue = function (v) {
      return {
        stype: SimpleResultType.Value,
        svalue: v,
      }
    }
    const serror = function (e) {
      return {
        stype: SimpleResultType.Error,
        serror: e,
      }
    }
    const toResult = function (res) {
      return fold(res, Result.error, Result.value)
    }
    const fromResult = function (res) {
      return res.fold(serror, svalue)
    }
    const SimpleResult = {
      fromResult,
      toResult,
      svalue,
      partition: partition$2,
      serror,
      bind: bind$1,
      bindError,
      map: map$2,
      mapError,
      fold,
    }

    const mergeValues$1 = function (values, base) {
      return values.length > 0 ? SimpleResult.svalue(deepMerge(base, merge.apply(undefined, values))) : SimpleResult.svalue(base)
    }
    const mergeErrors$1 = function (errors) {
      return compose(SimpleResult.serror, flatten)(errors)
    }
    const consolidateObj = function (objects, base) {
      const partition$$1 = SimpleResult.partition(objects)
      return partition$$1.errors.length > 0 ? mergeErrors$1(partition$$1.errors) : mergeValues$1(partition$$1.values, base)
    }
    const consolidateArr = function (objects) {
      const partitions = SimpleResult.partition(objects)
      return partitions.errors.length > 0 ? mergeErrors$1(partitions.errors) : SimpleResult.svalue(partitions.values)
    }
    const ResultCombine = {
      consolidateObj,
      consolidateArr,
    }

    const typeAdt = Adt.generate([
      {
        setOf: [
          'validator',
          'valueType',
        ],
      },
      { arrOf: ['valueType'] },
      { objOf: ['fields'] },
      { itemOf: ['validator'] },
      {
        choiceOf: [
          'key',
          'branches',
        ],
      },
      { thunk: ['description'] },
      {
        func: [
          'args',
          'outputSchema',
        ],
      },
    ])
    const fieldAdt = Adt.generate([
      {
        field: [
          'name',
          'presence',
          'type',
        ],
      },
      { state: ['name'] },
    ])

    const json = function () {
      return Global$1.getOrDie('JSON')
    }
    const parse = function (text) {
      return json().parse(text)
    }
    const stringify = function (obj, replacer, space) {
      return json().stringify(obj, replacer, space)
    }
    const Json = {
      parse,
      stringify,
    }

    const formatObj = function (input) {
      return isObject(input) && keys(input).length > 100 ? ' removed due to size' : Json.stringify(input, null, 2)
    }
    const formatErrors = function (errors) {
      const es = errors.length > 10 ? errors.slice(0, 10).concat([{
        path: [],
        getErrorInfo() {
          return '... (only showing first ten failures)'
        },
      }]) : errors
      return map$1(es, (e) => `Failed path: (${e.path.join(' > ')})\n${e.getErrorInfo()}`)
    }

    const nu$3 = function (path, getErrorInfo) {
      return SimpleResult.serror([{
        path,
        getErrorInfo,
      }])
    }
    const missingStrict = function (path, key, obj) {
      return nu$3(path, () => `Could not find valid *strict* value for "${key}" in ${formatObj(obj)}`)
    }
    const missingKey = function (path, key) {
      return nu$3(path, () => `Choice schema did not contain choice key: "${key}"`)
    }
    const missingBranch = function (path, branches, branch) {
      return nu$3(path, () => `The chosen schema: "${branch}" did not exist in branches: ${formatObj(branches)}`)
    }
    const unsupportedFields = function (path, unsupported) {
      return nu$3(path, () => `There are unsupported fields: [${unsupported.join(', ')}] specified`)
    }
    const custom = function (path, err) {
      return nu$3(path, () => err)
    }

    const adt$1 = Adt.generate([
      {
        field: [
          'key',
          'okey',
          'presence',
          'prop',
        ],
      },
      {
        state: [
          'okey',
          'instantiator',
        ],
      },
    ])
    const strictAccess = function (path, obj, key) {
      return readOptFrom(obj, key).fold(() => missingStrict(path, key, obj), SimpleResult.svalue)
    }
    const fallbackAccess = function (obj, key, fallbackThunk) {
      const v = readOptFrom(obj, key).fold(() => fallbackThunk(obj), identity)
      return SimpleResult.svalue(v)
    }
    const optionAccess = function (obj, key) {
      return SimpleResult.svalue(readOptFrom(obj, key))
    }
    const optionDefaultedAccess = function (obj, key, fallback) {
      const opt = readOptFrom(obj, key).map((val) => val === true ? fallback(obj) : val)
      return SimpleResult.svalue(opt)
    }
    const cExtractOne = function (path, obj, field, strength) {
      return field.fold((key, okey, presence, prop) => {
        const bundle = function (av) {
          const result = prop.extract(path.concat([key]), strength, av)
          return SimpleResult.map(result, (res) => wrap$1(okey, strength(res)))
        }
        const bundleAsOption = function (optValue) {
          return optValue.fold(() => {
            const outcome = wrap$1(okey, strength(Option.none()))
            return SimpleResult.svalue(outcome)
          }, (ov) => {
            const result = prop.extract(path.concat([key]), strength, ov)
            return SimpleResult.map(result, (res) => wrap$1(okey, strength(Option.some(res))))
          })
        }
        return (function () {
          return presence.fold(() => SimpleResult.bind(strictAccess(path, obj, key), bundle), (fallbackThunk) => SimpleResult.bind(fallbackAccess(obj, key, fallbackThunk), bundle), () => SimpleResult.bind(optionAccess(obj, key), bundleAsOption), (fallbackThunk) => SimpleResult.bind(optionDefaultedAccess(obj, key, fallbackThunk), bundleAsOption), (baseThunk) => {
            const base = baseThunk(obj)
            const result = SimpleResult.map(fallbackAccess(obj, key, constant({})), (v) => deepMerge(base, v))
            return SimpleResult.bind(result, bundle)
          })
        }())
      }, (okey, instantiator) => {
        const state = instantiator(obj)
        return SimpleResult.svalue(wrap$1(okey, strength(state)))
      })
    }
    const cExtract = function (path, obj, fields, strength) {
      const results = map$1(fields, (field) => cExtractOne(path, obj, field, strength))
      return ResultCombine.consolidateObj(results, {})
    }
    const value$2 = function (validator) {
      const extract = function (path, strength, val) {
        return SimpleResult.bindError(validator(val, strength), (err) => custom(path, err))
      }
      const toString$$1 = function () {
        return 'val'
      }
      const toDsl = function () {
        return typeAdt.itemOf(validator)
      }
      return {
        extract,
        toString: toString$$1,
        toDsl,
      }
    }
    const getSetKeys = function (obj) {
      const keys$$1 = keys(obj)
      return filter(keys$$1, (k) => hasKey$1(obj, k))
    }
    const objOfOnly = function (fields) {
      const delegate = objOf(fields)
      const fieldNames = foldr(fields, (acc, f) => f.fold((key) => deepMerge(acc, wrap$2(key, true)), constant(acc)), {})
      const extract = function (path, strength, o) {
        const keys$$1 = isBoolean(o) ? [] : getSetKeys(o)
        const extra = filter(keys$$1, (k) => !hasKey$1(fieldNames, k))
        return extra.length === 0 ? delegate.extract(path, strength, o) : unsupportedFields(path, extra)
      }
      return {
        extract,
        toString: delegate.toString,
        toDsl: delegate.toDsl,
      }
    }
    var objOf = function (fields) {
      const extract = function (path, strength, o) {
        return cExtract(path, o, fields, strength)
      }
      const toString$$1 = function () {
        const fieldStrings = map$1(fields, (field) => field.fold((key, okey, presence, prop) => `${key} -> ${prop.toString()}`, (okey, instantiator) => `state(${okey})`))
        return `obj{\n${fieldStrings.join('\n')}}`
      }
      const toDsl = function () {
        return typeAdt.objOf(map$1(fields, (f) => f.fold((key, okey, presence, prop) => fieldAdt.field(key, presence, prop), (okey, instantiator) => fieldAdt.state(okey))))
      }
      return {
        extract,
        toString: toString$$1,
        toDsl,
      }
    }
    const arrOf = function (prop) {
      const extract = function (path, strength, array) {
        const results = map$1(array, (a, i) => prop.extract(path.concat([`[${i}]`]), strength, a))
        return ResultCombine.consolidateArr(results)
      }
      const toString$$1 = function () {
        return `array(${prop.toString()})`
      }
      const toDsl = function () {
        return typeAdt.arrOf(prop)
      }
      return {
        extract,
        toString: toString$$1,
        toDsl,
      }
    }
    const setOf = function (validator, prop) {
      const validateKeys = function (path, keys$$1) {
        return arrOf(value$2(validator)).extract(path, identity, keys$$1)
      }
      const extract = function (path, strength, o) {
        const keys$$1 = keys(o)
        const validatedKeys = validateKeys(path, keys$$1)
        return SimpleResult.bind(validatedKeys, (validKeys) => {
          const schema = map$1(validKeys, (vk) => adt$1.field(vk, vk, strict(), prop))
          return objOf(schema).extract(path, strength, o)
        })
      }
      const toString$$1 = function () {
        return `setOf(${prop.toString()})`
      }
      const toDsl = function () {
        return typeAdt.setOf(validator, prop)
      }
      return {
        extract,
        toString: toString$$1,
        toDsl,
      }
    }
    const anyValue = constant(value$2(SimpleResult.svalue))
    const { state } = adt$1
    const { field } = adt$1

    const chooseFrom = function (path, strength, input, branches, ch) {
      const fields = readOptFrom$1(branches, ch)
      return fields.fold(() => missingBranch(path, branches, ch), (fs) => objOf(fs).extract(path.concat([`branch: ${ch}`]), strength, input))
    }
    const choose = function (key, branches) {
      const extract = function (path, strength, input) {
        const choice = readOptFrom$1(input, key)
        return choice.fold(() => missingKey(path, key), (chosen) => chooseFrom(path, strength, input, branches, chosen))
      }
      const toString$$1 = function () {
        return `chooseOn(${key}). Possible values: ${keys(branches)}`
      }
      const toDsl = function () {
        return typeAdt.choiceOf(key, branches)
      }
      return {
        extract,
        toString: toString$$1,
        toDsl,
      }
    }

    const _anyValue = value$2(SimpleResult.svalue)
    const valueOf = function (validator) {
      return value$2((v) => validator(v).fold(SimpleResult.serror, SimpleResult.svalue))
    }
    const setOf$1 = function (validator, prop) {
      return setOf((v) => SimpleResult.fromResult(validator(v)), prop)
    }
    const extract = function (label, prop, strength, obj) {
      const res = prop.extract([label], strength, obj)
      return SimpleResult.mapError(res, (errs) => ({
        input: obj,
        errors: errs,
      }))
    }
    const asRaw = function (label, prop, obj) {
      return SimpleResult.toResult(extract(label, prop, identity, obj))
    }
    const getOrDie$1 = function (extraction) {
      return extraction.fold((errInfo) => {
        throw new Error(formatError(errInfo))
      }, identity)
    }
    const asRawOrDie = function (label, prop, obj) {
      return getOrDie$1(asRaw(label, prop, obj))
    }
    var formatError = function (errInfo) {
      return `Errors: \n${formatErrors(errInfo.errors)}\n\nInput object: ${formatObj(errInfo.input)}`
    }
    const choose$1 = function (key, branches) {
      return choose(key, branches)
    }
    const anyValue$1 = constant(_anyValue)
    const typedValue = function (validator, expectedType) {
      return value$2((a) => {
        const actualType = typeof a
        return validator(a) ? SimpleResult.svalue(a) : SimpleResult.serror(`Expected type: ${expectedType} but got: ${actualType}`)
      })
    }
    const functionProcessor = typedValue(isFunction, 'function')

    const strict$1 = function (key) {
      return field(key, key, strict(), anyValue())
    }
    const strictOf = function (key, schema) {
      return field(key, key, strict(), schema)
    }
    const strictFunction = function (key) {
      return strictOf(key, functionProcessor)
    }
    const forbid = function (key, message) {
      return field(key, key, asOption(), value$2((v) => SimpleResult.serror(`The field: ${key} is forbidden. ${message}`)))
    }
    const strictObjOf = function (key, objSchema) {
      return field(key, key, strict(), objOf(objSchema))
    }
    const option = function (key) {
      return field(key, key, asOption(), anyValue())
    }
    const optionOf = function (key, schema) {
      return field(key, key, asOption(), schema)
    }
    const optionObjOf = function (key, objSchema) {
      return field(key, key, asOption(), objOf(objSchema))
    }
    const optionObjOfOnly = function (key, objSchema) {
      return field(key, key, asOption(), objOfOnly(objSchema))
    }
    const defaulted$1 = function (key, fallback) {
      return field(key, key, defaulted(fallback), anyValue())
    }
    const defaultedOf = function (key, fallback, schema) {
      return field(key, key, defaulted(fallback), schema)
    }
    const defaultedObjOf = function (key, fallback, objSchema) {
      return field(key, key, defaulted(fallback), objOf(objSchema))
    }
    const state$1 = function (okey, instantiator) {
      return state(okey, instantiator)
    }

    const isSource = function (component, simulatedEvent) {
      return eq(component.element(), simulatedEvent.event().target())
    }

    const nu$4 = function (parts) {
      if (!hasKey$1(parts, 'can') && !hasKey$1(parts, 'abort') && !hasKey$1(parts, 'run')) {
        throw new Error(`EventHandler defined by: ${Json.stringify(parts, null, 2)} does not have can, abort, or run!`)
      }
      return asRawOrDie('Extracting event.handler', objOfOnly([
        defaulted$1('can', constant(true)),
        defaulted$1('abort', constant(false)),
        defaulted$1('run', noop),
      ]), parts)
    }
    const all$1 = function (handlers, f) {
      return function () {
        const args = []
        for (let _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i]
        }
        return foldl(handlers, (acc, handler) => acc && f(handler).apply(undefined, args), true)
      }
    }
    const any = function (handlers, f) {
      return function () {
        const args = []
        for (let _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i]
        }
        return foldl(handlers, (acc, handler) => acc || f(handler).apply(undefined, args), false)
      }
    }
    const read = function (handler) {
      return isFunction(handler) ? {
        can: constant(true),
        abort: constant(false),
        run: handler,
      } : handler
    }
    const fuse = function (handlers) {
      const can = all$1(handlers, (handler) => handler.can)
      const abort = any(handlers, (handler) => handler.abort)
      const run = function () {
        const args = []
        for (let _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i]
        }
        each$1(handlers, (handler) => {
          handler.run.apply(undefined, args)
        })
      }
      return nu$4({
        can,
        abort,
        run,
      })
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
    const descendant = function (scope, predicate) {
      var descend = function (node) {
        for (let i = 0; i < node.childNodes.length; i++) {
          if (predicate(Element$$1.fromDom(node.childNodes[i]))) {
            return Option.some(Element$$1.fromDom(node.childNodes[i]))
          }
          const res = descend(node.childNodes[i])
          if (res.isSome()) {
            return res
          }
        }
        return Option.none()
      }
      return descend(scope.dom())
    }

    const closest$1 = function (target, transform, isRoot) {
      const delegate = closest(target, (elem) => transform(elem).isSome(), isRoot)
      return delegate.bind(transform)
    }

    const derive = function (configs) {
      return wrapAll$1(configs)
    }
    const abort = function (name, predicate) {
      return {
        key: name,
        value: nu$4({ abort: predicate }),
      }
    }
    const can = function (name, predicate) {
      return {
        key: name,
        value: nu$4({ can: predicate }),
      }
    }
    const run = function (name, handler) {
      return {
        key: name,
        value: nu$4({ run: handler }),
      }
    }
    const runActionExtra = function (name, action, extra) {
      return {
        key: name,
        value: nu$4({
          run(component) {
            action.apply(undefined, [component].concat(extra))
          },
        }),
      }
    }
    const runOnName = function (name) {
      return function (handler) {
        return run(name, handler)
      }
    }
    const runOnSourceName = function (name) {
      return function (handler) {
        return {
          key: name,
          value: nu$4({
            run(component, simulatedEvent) {
              if (isSource(component, simulatedEvent)) {
                handler(component, simulatedEvent)
              }
            },
          }),
        }
      }
    }
    const redirectToUid = function (name, uid) {
      return run(name, (component, simulatedEvent) => {
        component.getSystem().getByUid(uid).each((redirectee) => {
          dispatchEvent(redirectee, redirectee.element(), name, simulatedEvent)
        })
      })
    }
    const redirectToPart = function (name, detail, partName) {
      const uid = detail.partUids[partName]
      return redirectToUid(name, uid)
    }
    const cutter = function (name) {
      return run(name, (component, simulatedEvent) => {
        simulatedEvent.cut()
      })
    }
    const stopper = function (name) {
      return run(name, (component, simulatedEvent) => {
        simulatedEvent.stop()
      })
    }
    const runOnSource = function (name, f) {
      return runOnSourceName(name)(f)
    }
    const runOnAttached = runOnSourceName(attachedToDom())
    const runOnDetached = runOnSourceName(detachedFromDom())
    const runOnInit = runOnSourceName(systemInit())
    const runOnExecute = runOnName(execute())

    const markAsBehaviourApi = function (f, apiName, apiFunction) {
      const delegate = apiFunction.toString()
      const endIndex = delegate.indexOf(')') + 1
      const openBracketIndex = delegate.indexOf('(')
      const parameters = delegate.substring(openBracketIndex + 1, endIndex - 1).split(/,\s*/)
      f.toFunctionAnnotation = function () {
        return {
          name: apiName,
          parameters: cleanParameters(parameters.slice(0, 1).concat(parameters.slice(3))),
        }
      }
      return f
    }
    var cleanParameters = function (parameters) {
      return map$1(parameters, (p) => endsWith(p, '/*') ? p.substring(0, p.length - '/*'.length) : p)
    }
    const markAsExtraApi = function (f, extraName) {
      const delegate = f.toString()
      const endIndex = delegate.indexOf(')') + 1
      const openBracketIndex = delegate.indexOf('(')
      const parameters = delegate.substring(openBracketIndex + 1, endIndex - 1).split(/,\s*/)
      f.toFunctionAnnotation = function () {
        return {
          name: extraName,
          parameters: cleanParameters(parameters),
        }
      }
      return f
    }
    const markAsSketchApi = function (f, apiFunction) {
      const delegate = apiFunction.toString()
      const endIndex = delegate.indexOf(')') + 1
      const openBracketIndex = delegate.indexOf('(')
      const parameters = delegate.substring(openBracketIndex + 1, endIndex - 1).split(/,\s*/)
      f.toFunctionAnnotation = function () {
        return {
          name: 'OVERRIDE',
          parameters: cleanParameters(parameters.slice(1)),
        }
      }
      return f
    }

    const nu$5 = function (s) {
      return {
        classes: s.classes !== undefined ? s.classes : [],
        attributes: s.attributes !== undefined ? s.attributes : {},
        styles: s.styles !== undefined ? s.styles : {},
      }
    }
    const merge$1 = function (defnA, mod) {
      return __assign({}, defnA, {
        attributes: __assign({}, defnA.attributes, mod.attributes),
        styles: __assign({}, defnA.styles, mod.styles),
        classes: defnA.classes.concat(mod.classes),
      })
    }

    const executeEvent = function (bConfig, bState, executor) {
      return runOnExecute((component) => {
        executor(component, bConfig, bState)
      })
    }
    const loadEvent = function (bConfig, bState, f) {
      return runOnInit((component, simulatedEvent) => {
        f(component, bConfig, bState)
      })
    }
    const create = function (schema, name, active, apis, extra, state) {
      const configSchema = objOfOnly(schema)
      const schemaSchema = optionObjOf(name, [optionObjOfOnly('config', schema)])
      return doCreate(configSchema, schemaSchema, name, active, apis, extra, state)
    }
    const createModes = function (modes, name, active, apis, extra, state) {
      const configSchema = modes
      const schemaSchema = optionObjOf(name, [optionOf('config', modes)])
      return doCreate(configSchema, schemaSchema, name, active, apis, extra, state)
    }
    const wrapApi = function (bName, apiFunction, apiName) {
      const f = function (component) {
        const rest = []
        for (let _i = 1; _i < arguments.length; _i++) {
          rest[_i - 1] = arguments[_i]
        }
        const args = [component].concat(rest)
        return component.config({ name: constant(bName) }).fold(() => {
          throw new Error(`We could not find any behaviour configuration for: ${bName}. Using API: ${apiName}`)
        }, (info) => {
          const rest = Array.prototype.slice.call(args, 1)
          return apiFunction.apply(undefined, [
            component,
            info.config,
            info.state,
          ].concat(rest))
        })
      }
      return markAsBehaviourApi(f, apiName, apiFunction)
    }
    const revokeBehaviour = function (name) {
      return {
        key: name,
        value: undefined,
      }
    }
    var doCreate = function (configSchema, schemaSchema, name, active, apis, extra, state) {
      const getConfig = function (info) {
        return hasKey$1(info, name) ? info[name]() : Option.none()
      }
      const wrappedApis = map(apis, (apiF, apiName) => wrapApi(name, apiF, apiName))
      const wrappedExtra = map(extra, (extraF, extraName) => markAsExtraApi(extraF, extraName))
      var me = __assign({}, wrappedExtra, wrappedApis, {
        revoke: curry(revokeBehaviour, name),
        config(spec) {
          const prepared = asRawOrDie(`${name}-config`, configSchema, spec)
          return {
            key: name,
            value: {
              config: prepared,
              me,
              configAsRaw: cached(() => asRawOrDie(`${name}-config`, configSchema, spec)),
              initialConfig: spec,
              state,
            },
          }
        },
        schema() {
          return schemaSchema
        },
        exhibit(info, base) {
          return getConfig(info).bind((behaviourInfo) => readOptFrom$1(active, 'exhibit').map((exhibitor) => exhibitor(base, behaviourInfo.config, behaviourInfo.state))).getOr(nu$5({}))
        },
        name() {
          return name
        },
        handlers(info) {
          return getConfig(info).map((behaviourInfo) => {
            const getEvents = readOr$1('events', (a, b) => ({}))(active)
            return getEvents(behaviourInfo.config, behaviourInfo.state)
          }).getOr({})
        },
      })
      return me
    }

    const NoState = {
      init() {
        return nu$6({
          readState() {
            return 'No State required'
          },
        })
      },
    }
    var nu$6 = function (spec) {
      return spec
    }

    const derive$1 = function (capabilities) {
      return wrapAll$1(capabilities)
    }
    const simpleSchema = objOfOnly([
      strict$1('fields'),
      strict$1('name'),
      defaulted$1('active', {}),
      defaulted$1('apis', {}),
      defaulted$1('state', NoState),
      defaulted$1('extra', {}),
    ])
    const create$1 = function (data) {
      const value = asRawOrDie(`Creating behaviour: ${data.name}`, simpleSchema, data)
      return create(value.fields, value.name, value.active, value.apis, value.extra, value.state)
    }
    const modeSchema = objOfOnly([
      strict$1('branchKey'),
      strict$1('branches'),
      strict$1('name'),
      defaulted$1('active', {}),
      defaulted$1('apis', {}),
      defaulted$1('state', NoState),
      defaulted$1('extra', {}),
    ])
    const createModes$1 = function (data) {
      const value = asRawOrDie(`Creating behaviour: ${data.name}`, modeSchema, data)
      return createModes(choose$1(value.branchKey, value.branches), value.name, value.active, value.apis, value.extra, value.state)
    }
    const revoke = constant(undefined)

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
      each(attrs, (v, k) => {
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
    const remove$1 = function (element, key) {
      element.dom().removeAttribute(key)
    }

    const read$1 = function (element, attr) {
      const value = get$1(element, attr)
      return value === undefined || value === '' ? [] : value.split(' ')
    }
    const add = function (element, attr, id) {
      const old = read$1(element, attr)
      const nu = old.concat([id])
      set(element, attr, nu.join(' '))
      return true
    }
    const remove$2 = function (element, attr, id) {
      const nu = filter(read$1(element, attr), (v) => v !== id)
      if (nu.length > 0) {
        set(element, attr, nu.join(' '))
      } else {
        remove$1(element, attr)
      }
      return false
    }

    const supports = function (element) {
      return element.dom().classList !== undefined
    }
    const get$2 = function (element) {
      return read$1(element, 'class')
    }
    const add$1 = function (element, clazz) {
      return add(element, 'class', clazz)
    }
    const remove$3 = function (element, clazz) {
      return remove$2(element, 'class', clazz)
    }

    const add$2 = function (element, clazz) {
      if (supports(element)) {
        element.dom().classList.add(clazz)
      } else {
        add$1(element, clazz)
      }
    }
    const cleanClass = function (element) {
      const classList = supports(element) ? element.dom().classList : get$2(element)
      if (classList.length === 0) {
        remove$1(element, 'class')
      }
    }
    const remove$4 = function (element, clazz) {
      if (supports(element)) {
        const { classList } = element.dom()
        classList.remove(clazz)
      } else {
        remove$3(element, clazz)
      }
      cleanClass(element)
    }
    const has$2 = function (element, clazz) {
      return supports(element) && element.dom().classList.contains(clazz)
    }

    const swap = function (element, addCls, removeCls) {
      remove$4(element, removeCls)
      add$2(element, addCls)
    }
    const toAlpha = function (component, swapConfig, swapState) {
      swap(component.element(), swapConfig.alpha, swapConfig.omega)
    }
    const toOmega = function (component, swapConfig, swapState) {
      swap(component.element(), swapConfig.omega, swapConfig.alpha)
    }
    const clear = function (component, swapConfig, swapState) {
      remove$4(component.element(), swapConfig.alpha)
      remove$4(component.element(), swapConfig.omega)
    }
    const isAlpha = function (component, swapConfig, swapState) {
      return has$2(component.element(), swapConfig.alpha)
    }
    const isOmega = function (component, swapConfig, swapState) {
      return has$2(component.element(), swapConfig.omega)
    }

    const SwapApis = /* #__PURE__ */Object.freeze({
      toAlpha,
      toOmega,
      isAlpha,
      isOmega,
      clear,
    })

    const SwapSchema = [
      strict$1('alpha'),
      strict$1('omega'),
    ]

    const Swapping = create$1({
      fields: SwapSchema,
      name: 'swapping',
      apis: SwapApis,
    })

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

    const focus$2 = function (element) {
      element.dom().focus()
    }
    const blur$$1 = function (element) {
      element.dom().blur()
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

    const global = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils')

    const global$1 = tinymce.util.Tools.resolve('tinymce.ThemeManager')

    const openLink = function (target) {
      const link = document.createElement('a')
      link.target = '_blank'
      link.href = target.href
      link.rel = 'noreferrer noopener'
      const nuEvt = document.createEvent('MouseEvents')
      nuEvt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      document.body.appendChild(link)
      link.dispatchEvent(nuEvt)
      document.body.removeChild(link)
    }
    const TinyCodeDupe = { openLink }

    const isSkinDisabled = function (editor) {
      return editor.settings.skin === false
    }
    const readOnlyOnInit = function (editor) {
      return false
    }

    const formatChanged = 'formatChanged'
    const orientationChanged = 'orientationChanged'
    const dropupDismissed = 'dropupDismissed'
    const TinyChannels = {
      formatChanged: constant(formatChanged),
      orientationChanged: constant(orientationChanged),
      dropupDismissed: constant(dropupDismissed),
    }

    const fromHtml$1 = function (html, scope) {
      const doc = scope || document
      const div = doc.createElement('div')
      div.innerHTML = html
      return children(Element$$1.fromDom(div))
    }

    const get$3 = function (element) {
      return element.dom().innerHTML
    }
    const set$1 = function (element, content) {
      const owner$$1 = owner(element)
      const docDom = owner$$1.dom()
      const fragment = Element$$1.fromDom(docDom.createDocumentFragment())
      const contentElements = fromHtml$1(content, docDom)
      append$1(fragment, contentElements)
      empty(element)
      append(element, fragment)
    }
    const getOuter = function (element) {
      const container = Element$$1.fromTag('div')
      const clone = Element$$1.fromDom(element.dom().cloneNode(true))
      append(container, clone)
      return get$3(container)
    }

    const clone$1 = function (original, isDeep) {
      return Element$$1.fromDom(original.dom().cloneNode(isDeep))
    }
    const shallow$1 = function (original) {
      return clone$1(original, false)
    }

    const getHtml = function (element) {
      const clone = shallow$1(element)
      return getOuter(clone)
    }

    const element = function (elem) {
      return getHtml(elem)
    }

    const chooseChannels = function (channels, message) {
      return message.universal() ? channels : filter(channels, (ch) => contains(message.channels(), ch))
    }
    const events = function (receiveConfig) {
      return derive([run(receive(), (component, message) => {
        const channelMap = receiveConfig.channels
        const channels = keys(channelMap)
        const targetChannels = chooseChannels(channels, message)
        each$1(targetChannels, (ch) => {
          const channelInfo = channelMap[ch]
          const channelSchema = channelInfo.schema
          const data = asRawOrDie(`channel[${ch}] data\nReceiver: ${element(component.element())}`, channelSchema, message.data())
          channelInfo.onReceive(component, data)
        })
      })])
    }

    const ActiveReceiving = /* #__PURE__ */Object.freeze({
      events,
    })

    const cat = function (arr) {
      const r = []
      const push = function (x) {
        r.push(x)
      }
      for (let i = 0; i < arr.length; i++) {
        arr[i].each(push)
      }
      return r
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

    const unknown$3 = 'unknown'
    let EventConfiguration;
    (function (EventConfiguration) {
      EventConfiguration[EventConfiguration.STOP = 0] = 'STOP'
      EventConfiguration[EventConfiguration.NORMAL = 1] = 'NORMAL'
      EventConfiguration[EventConfiguration.LOGGING = 2] = 'LOGGING'
    }(EventConfiguration || (EventConfiguration = {})))
    const eventConfig = Cell({})
    const makeEventLogger = function (eventName, initialTarget) {
      const sequence = []
      const startTime = new Date().getTime()
      return {
        logEventCut(name$$1, target, purpose) {
          sequence.push({
            outcome: 'cut',
            target,
            purpose,
          })
        },
        logEventStopped(name$$1, target, purpose) {
          sequence.push({
            outcome: 'stopped',
            target,
            purpose,
          })
        },
        logNoParent(name$$1, target, purpose) {
          sequence.push({
            outcome: 'no-parent',
            target,
            purpose,
          })
        },
        logEventNoHandlers(name$$1, target) {
          sequence.push({
            outcome: 'no-handlers-left',
            target,
          })
        },
        logEventResponse(name$$1, target, purpose) {
          sequence.push({
            outcome: 'response',
            purpose,
            target,
          })
        },
        write() {
          const finishTime = new Date().getTime()
          if (contains([
            'mousemove',
            'mouseover',
            'mouseout',
            systemInit(),
          ], eventName)) {
            return
          }
          console.log(eventName, {
            event: eventName,
            time: finishTime - startTime,
            target: initialTarget.dom(),
            sequence: map$1(sequence, (s) => {
              if (!contains([
                'cut',
                'stopped',
                'response',
              ], s.outcome)) {
                return s.outcome
              }
              return `{${s.purpose}} ${s.outcome} at (${element(s.target)})`
            }),
          })
        },
      }
    }
    const processEvent = function (eventName, initialTarget, f) {
      const status$$1 = readOptFrom$1(eventConfig.get(), eventName).orThunk(() => {
        const patterns = keys(eventConfig.get())
        return findMap(patterns, (p) => eventName.indexOf(p) > -1 ? Option.some(eventConfig.get()[p]) : Option.none())
      }).getOr(EventConfiguration.NORMAL)
      switch (status$$1) {
        case EventConfiguration.NORMAL:
          return f(noLogger())
        case EventConfiguration.LOGGING: {
          const logger = makeEventLogger(eventName, initialTarget)
          const output = f(logger)
          logger.write()
          return output
        }
        case EventConfiguration.STOP:
          return true
      }
    }
    const path$1 = [
      'alloy/data/Fields',
      'alloy/debugging/Debugging',
    ]
    const getTrace = function () {
      const err = new Error()
      if (err.stack !== undefined) {
        const lines = err.stack.split('\n')
        return find$2(lines, (line) => line.indexOf('alloy') > 0 && !exists(path$1, (p) => line.indexOf(p) > -1)).getOr(unknown$3)
      }
      return unknown$3
    }
    const ignoreEvent = {
      logEventCut: noop,
      logEventStopped: noop,
      logNoParent: noop,
      logEventNoHandlers: noop,
      logEventResponse: noop,
      write: noop,
    }
    const monitorEvent = function (eventName, initialTarget, f) {
      return processEvent(eventName, initialTarget, f)
    }
    var noLogger = constant(ignoreEvent)

    const menuFields = constant([
      strict$1('menu'),
      strict$1('selectedMenu'),
    ])
    const itemFields = constant([
      strict$1('item'),
      strict$1('selectedItem'),
    ])
    const schema = constant(objOf(itemFields().concat(menuFields())))
    const itemSchema = constant(objOf(itemFields()))

    const _initSize = strictObjOf('initSize', [
      strict$1('numColumns'),
      strict$1('numRows'),
    ])
    const itemMarkers = function () {
      return strictOf('markers', itemSchema())
    }
    const tieredMenuMarkers = function () {
      return strictObjOf('markers', [strict$1('backgroundMenu')].concat(menuFields()).concat(itemFields()))
    }
    const markers = function (required) {
      return strictObjOf('markers', map$1(required, strict$1))
    }
    const onPresenceHandler = function (label, fieldName, presence) {
      const trace = getTrace()
      return field(fieldName, fieldName, presence, valueOf((f) => Result.value(function () {
        const args = []
        for (let _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i]
        }
        return f.apply(undefined, args)
      })))
    }
    const onHandler = function (fieldName) {
      return onPresenceHandler('onHandler', fieldName, defaulted(noop))
    }
    const onKeyboardHandler = function (fieldName) {
      return onPresenceHandler('onKeyboardHandler', fieldName, defaulted(Option.none))
    }
    const onStrictHandler = function (fieldName) {
      return onPresenceHandler('onHandler', fieldName, strict())
    }
    const onStrictKeyboardHandler = function (fieldName) {
      return onPresenceHandler('onKeyboardHandler', fieldName, strict())
    }
    const output$1 = function (name, value) {
      return state$1(name, constant(value))
    }
    const snapshot$1 = function (name) {
      return state$1(name, identity)
    }
    const initSize = constant(_initSize)

    const ReceivingSchema = [strictOf('channels', setOf$1(Result.value, objOfOnly([
      onStrictHandler('onReceive'),
      defaulted$1('schema', anyValue$1()),
    ])))]

    const Receiving = create$1({
      fields: ReceivingSchema,
      name: 'receiving',
      active: ActiveReceiving,
    })

    const updateAriaState = function (component, toggleConfig, toggleState) {
      const ariaInfo = toggleConfig.aria
      ariaInfo.update(component, ariaInfo, toggleState.get())
    }
    const updateClass = function (component, toggleConfig, toggleState) {
      toggleConfig.toggleClass.each((toggleClass) => {
        if (toggleState.get()) {
          add$2(component.element(), toggleClass)
        } else {
          remove$4(component.element(), toggleClass)
        }
      })
    }
    const toggle$2 = function (component, toggleConfig, toggleState) {
      set$2(component, toggleConfig, toggleState, !toggleState.get())
    }
    const on = function (component, toggleConfig, toggleState) {
      toggleState.set(true)
      updateClass(component, toggleConfig, toggleState)
      updateAriaState(component, toggleConfig, toggleState)
    }
    const off = function (component, toggleConfig, toggleState) {
      toggleState.set(false)
      updateClass(component, toggleConfig, toggleState)
      updateAriaState(component, toggleConfig, toggleState)
    }
    var set$2 = function (component, toggleConfig, toggleState, state) {
      const action = state ? on : off
      action(component, toggleConfig, toggleState)
    }
    const isOn = function (component, toggleConfig, toggleState) {
      return toggleState.get()
    }
    const onLoad = function (component, toggleConfig, toggleState) {
      set$2(component, toggleConfig, toggleState, toggleConfig.selected)
    }

    const ToggleApis = /* #__PURE__ */Object.freeze({
      onLoad,
      toggle: toggle$2,
      isOn,
      on,
      off,
      set: set$2,
    })

    const exhibit = function (base, toggleConfig, toggleState) {
      return nu$5({})
    }
    const events$1 = function (toggleConfig, toggleState) {
      const execute = executeEvent(toggleConfig, toggleState, toggle$2)
      const load = loadEvent(toggleConfig, toggleState, onLoad)
      return derive(flatten([
        toggleConfig.toggleOnExecute ? [execute] : [],
        [load],
      ]))
    }

    const ActiveToggle = /* #__PURE__ */Object.freeze({
      exhibit,
      events: events$1,
    })

    const init = function (spec) {
      const cell = Cell(false)
      const set = function (state) {
        return cell.set(state)
      }
      const clear = function () {
        return cell.set(false)
      }
      const get = function () {
        return cell.get()
      }
      const readState = function () {
        return cell.get()
      }
      return {
        readState,
        get,
        set,
        clear,
      }
    }

    const TogglingState = /* #__PURE__ */Object.freeze({
      init,
    })

    const updatePressed = function (component, ariaInfo, status) {
      set(component.element(), 'aria-pressed', status)
      if (ariaInfo.syncWithExpanded) {
        updateExpanded(component, ariaInfo, status)
      }
    }
    const updateSelected = function (component, ariaInfo, status) {
      set(component.element(), 'aria-selected', status)
    }
    const updateChecked = function (component, ariaInfo, status) {
      set(component.element(), 'aria-checked', status)
    }
    var updateExpanded = function (component, ariaInfo, status) {
      set(component.element(), 'aria-expanded', status)
    }

    const ToggleSchema = [
      defaulted$1('selected', false),
      option('toggleClass'),
      defaulted$1('toggleOnExecute', true),
      defaultedOf('aria', { mode: 'none' }, choose$1('mode', {
        pressed: [
          defaulted$1('syncWithExpanded', false),
          output$1('update', updatePressed),
        ],
        checked: [output$1('update', updateChecked)],
        expanded: [output$1('update', updateExpanded)],
        selected: [output$1('update', updateSelected)],
        none: [output$1('update', noop)],
      })),
    ]

    const Toggling = create$1({
      fields: ToggleSchema,
      name: 'toggling',
      active: ActiveToggle,
      apis: ToggleApis,
      state: TogglingState,
    })

    const format = function (command, update) {
      return Receiving.config({
        channels: wrap$2(TinyChannels.formatChanged(), {
          onReceive(button, data) {
            if (data.command === command) {
              update(button, data.state)
            }
          },
        }),
      })
    }
    const orientation = function (onReceive) {
      return Receiving.config({ channels: wrap$2(TinyChannels.orientationChanged(), { onReceive }) })
    }
    const receive$1 = function (channel, onReceive) {
      return {
        key: channel,
        value: { onReceive },
      }
    }
    const Receivers = {
      format,
      orientation,
      receive: receive$1,
    }

    const prefix = 'tinymce-mobile'
    const resolve$1 = function (p) {
      return `${prefix}-${p}`
    }
    const Styles = {
      resolve: resolve$1,
      prefix: constant(prefix),
    }

    const events$2 = function (optAction) {
      const executeHandler = function (action) {
        return run(execute(), (component, simulatedEvent) => {
          action(component)
          simulatedEvent.stop()
        })
      }
      const onClick = function (component, simulatedEvent) {
        simulatedEvent.stop()
        emitExecute(component)
      }
      const onMousedown = function (component, simulatedEvent) {
        simulatedEvent.cut()
      }
      const pointerEvents = PlatformDetection$1.detect().deviceType.isTouch() ? [run(tap(), onClick)] : [
        run(click(), onClick),
        run(mousedown(), onMousedown),
      ]
      return derive(flatten([
        optAction.map(executeHandler).toArray(),
        pointerEvents,
      ]))
    }

    const focus$3 = function (component, focusConfig) {
      if (!focusConfig.ignore) {
        focus$2(component.element())
        focusConfig.onFocus(component)
      }
    }
    const blur$1 = function (component, focusConfig) {
      if (!focusConfig.ignore) {
        blur$$1(component.element())
      }
    }
    const isFocused = function (component) {
      return hasFocus(component.element())
    }

    const FocusApis = /* #__PURE__ */Object.freeze({
      focus: focus$3,
      blur: blur$1,
      isFocused,
    })

    const exhibit$1 = function (base, focusConfig) {
      const mod = focusConfig.ignore ? {} : { attributes: { tabindex: '-1' } }
      return nu$5(mod)
    }
    const events$3 = function (focusConfig) {
      return derive([run(focus$1(), (component, simulatedEvent) => {
        focus$3(component, focusConfig)
        simulatedEvent.stop()
      })].concat(focusConfig.stopMousedown ? [run(mousedown(), (_, simulatedEvent) => {
        simulatedEvent.event().prevent()
      })] : []))
    }

    const ActiveFocus = /* #__PURE__ */Object.freeze({
      exhibit: exhibit$1,
      events: events$3,
    })

    const FocusSchema = [
      onHandler('onFocus'),
      defaulted$1('stopMousedown', false),
      defaulted$1('ignore', false),
    ]

    const Focusing = create$1({
      fields: FocusSchema,
      name: 'focusing',
      active: ActiveFocus,
      apis: FocusApis,
    })

    const isSupported = function (dom) {
      return dom.style !== undefined
    }

    const internalSet = function (dom, property, value$$1) {
      if (!isString(value$$1)) {
        console.error('Invalid call to CSS.set. Property ', property, ':: Value ', value$$1, ':: Element ', dom)
        throw new Error(`CSS value must be a string: ${value$$1}`)
      }
      if (isSupported(dom)) {
        dom.style.setProperty(property, value$$1)
      }
    }
    const internalRemove = function (dom, property) {
      if (isSupported(dom)) {
        dom.style.removeProperty(property)
      }
    }
    const set$3 = function (element, property, value$$1) {
      const dom = element.dom()
      internalSet(dom, property, value$$1)
    }
    const setAll$1 = function (element, css) {
      const dom = element.dom()
      each(css, (v, k) => {
        internalSet(dom, k, v)
      })
    }
    const get$4 = function (element, property) {
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
    const remove$5 = function (element, property) {
      const dom = element.dom()
      internalRemove(dom, property)
      if (has$1(element, 'style') && trim(get$1(element, 'style')) === '') {
        remove$1(element, 'style')
      }
    }
    const reflow = function (e) {
      return e.dom().offsetWidth
    }

    function Dimension(name, getOffset) {
      const set = function (element, h) {
        if (!isNumber(h) && !h.match(/^[0-9]+$/)) {
          throw new Error(`${name}.set accepts only positive integer values. Value was ${h}`)
        }
        const dom = element.dom()
        if (isSupported(dom)) {
          dom.style[name] = `${h}px`
        }
      }
      const get = function (element) {
        const r = getOffset(element)
        if (r <= 0 || r === null) {
          const css = get$4(element, name)
          return parseFloat(css) || 0
        }
        return r
      }
      const getOuter = get
      const aggregate = function (element, properties) {
        return foldl(properties, (acc, property) => {
          const val = get$4(element, property)
          const value = val === undefined ? 0 : parseInt(val, 10)
          return isNaN(value) ? acc : acc + value
        }, 0)
      }
      const max = function (element, value, properties) {
        const cumulativeInclusions = aggregate(element, properties)
        const absoluteMax = value > cumulativeInclusions ? value - cumulativeInclusions : 0
        return absoluteMax
      }
      return {
        set,
        get,
        getOuter,
        aggregate,
        max,
      }
    }

    const api = Dimension('height', (element) => {
      const dom = element.dom()
      return inBody(element) ? dom.getBoundingClientRect().height : dom.offsetHeight
    })
    const get$5 = function (element) {
      return api.get(element)
    }

    const ancestors = function (scope, predicate, isRoot) {
      return filter(parents(scope, isRoot), predicate)
    }
    const siblings$1 = function (scope, predicate) {
      return filter(siblings(scope), predicate)
    }

    const all$3 = function (selector) {
      return all(selector)
    }
    const ancestors$1 = function (scope, selector, isRoot) {
      return ancestors(scope, (e) => is(e, selector), isRoot)
    }
    const siblings$2 = function (scope, selector) {
      return siblings$1(scope, (e) => is(e, selector))
    }
    const descendants$1 = function (scope, selector) {
      return all(selector, scope)
    }

    const first$2 = function (selector) {
      return one(selector)
    }
    const ancestor$2 = function (scope, selector, isRoot) {
      return ancestor(scope, (e) => is(e, selector), isRoot)
    }
    const descendant$2 = function (scope, selector) {
      return one(selector, scope)
    }
    const closest$3 = function (scope, selector, isRoot) {
      return ClosestOrAncestor(is, ancestor$2, scope, selector, isRoot)
    }

    const BACKSPACE = function () {
      return [8]
    }
    const TAB = function () {
      return [9]
    }
    const ENTER = function () {
      return [13]
    }
    const ESCAPE = function () {
      return [27]
    }
    const SPACE = function () {
      return [32]
    }
    const LEFT = function () {
      return [37]
    }
    const UP = function () {
      return [38]
    }
    const RIGHT = function () {
      return [39]
    }
    const DOWN = function () {
      return [40]
    }

    const cyclePrev = function (values, index, predicate) {
      const before = reverse(values.slice(0, index))
      const after = reverse(values.slice(index + 1))
      return find$2(before.concat(after), predicate)
    }
    const tryPrev = function (values, index, predicate) {
      const before = reverse(values.slice(0, index))
      return find$2(before, predicate)
    }
    const cycleNext = function (values, index, predicate) {
      const before = values.slice(0, index)
      const after = values.slice(index + 1)
      return find$2(after.concat(before), predicate)
    }
    const tryNext = function (values, index, predicate) {
      const after = values.slice(index + 1)
      return find$2(after, predicate)
    }

    const inSet = function (keys) {
      return function (event) {
        const raw = event.raw()
        return contains(keys, raw.which)
      }
    }
    const and = function (preds) {
      return function (event) {
        return forall(preds, (pred) => pred(event))
      }
    }
    const isShift = function (event) {
      const raw = event.raw()
      return raw.shiftKey === true
    }
    const isControl = function (event) {
      const raw = event.raw()
      return raw.ctrlKey === true
    }
    const isNotShift = not(isShift)

    const rule = function (matches, action) {
      return {
        matches,
        classification: action,
      }
    }
    const choose$2 = function (transitions, event) {
      const transition = find$2(transitions, (t) => t.matches(event))
      return transition.map((t) => t.classification)
    }

    const cycleBy = function (value, delta, min, max) {
      const r = value + delta
      if (r > max) {
        return min
      }
      return r < min ? max : r
    }
    const cap = function (value, min, max) {
      if (value <= min) {
        return min
      }
      return value >= max ? max : value
    }

    const dehighlightAll = function (component, hConfig, hState) {
      const highlighted = descendants$1(component.element(), `.${hConfig.highlightClass}`)
      each$1(highlighted, (h) => {
        remove$4(h, hConfig.highlightClass)
        component.getSystem().getByDom(h).each((target) => {
          hConfig.onDehighlight(component, target)
        })
      })
    }
    const dehighlight = function (component, hConfig, hState, target) {
      const wasHighlighted = isHighlighted(component, hConfig, hState, target)
      remove$4(target.element(), hConfig.highlightClass)
      if (wasHighlighted) {
        hConfig.onDehighlight(component, target)
      }
    }
    const highlight = function (component, hConfig, hState, target) {
      const wasHighlighted = isHighlighted(component, hConfig, hState, target)
      dehighlightAll(component, hConfig, hState)
      add$2(target.element(), hConfig.highlightClass)
      if (!wasHighlighted) {
        hConfig.onHighlight(component, target)
      }
    }
    const highlightFirst = function (component, hConfig, hState) {
      getFirst(component, hConfig, hState).each((firstComp) => {
        highlight(component, hConfig, hState, firstComp)
      })
    }
    const highlightLast = function (component, hConfig, hState) {
      getLast(component, hConfig, hState).each((lastComp) => {
        highlight(component, hConfig, hState, lastComp)
      })
    }
    const highlightAt = function (component, hConfig, hState, index) {
      getByIndex(component, hConfig, hState, index).fold((err) => {
        throw new Error(err)
      }, (firstComp) => {
        highlight(component, hConfig, hState, firstComp)
      })
    }
    const highlightBy = function (component, hConfig, hState, predicate) {
      const candidates = getCandidates(component, hConfig, hState)
      const targetComp = find$2(candidates, predicate)
      targetComp.each((c) => {
        highlight(component, hConfig, hState, c)
      })
    }
    var isHighlighted = function (component, hConfig, hState, queryTarget) {
      return has$2(queryTarget.element(), hConfig.highlightClass)
    }
    const getHighlighted = function (component, hConfig, hState) {
      return descendant$2(component.element(), `.${hConfig.highlightClass}`).bind((e) => component.getSystem().getByDom(e).toOption())
    }
    var getByIndex = function (component, hConfig, hState, index) {
      const items = descendants$1(component.element(), `.${hConfig.itemClass}`)
      return Option.from(items[index]).fold(() => Result.error(`No element found with index ${index}`), component.getSystem().getByDom)
    }
    var getFirst = function (component, hConfig, hState) {
      return descendant$2(component.element(), `.${hConfig.itemClass}`).bind((e) => component.getSystem().getByDom(e).toOption())
    }
    var getLast = function (component, hConfig, hState) {
      const items = descendants$1(component.element(), `.${hConfig.itemClass}`)
      const last$$1 = items.length > 0 ? Option.some(items[items.length - 1]) : Option.none()
      return last$$1.bind((c) => component.getSystem().getByDom(c).toOption())
    }
    const getDelta = function (component, hConfig, hState, delta) {
      const items = descendants$1(component.element(), `.${hConfig.itemClass}`)
      const current = findIndex(items, (item) => has$2(item, hConfig.highlightClass))
      return current.bind((selected) => {
        const dest = cycleBy(selected, delta, 0, items.length - 1)
        return component.getSystem().getByDom(items[dest]).toOption()
      })
    }
    const getPrevious = function (component, hConfig, hState) {
      return getDelta(component, hConfig, hState, -1)
    }
    const getNext = function (component, hConfig, hState) {
      return getDelta(component, hConfig, hState, +1)
    }
    var getCandidates = function (component, hConfig, hState) {
      const items = descendants$1(component.element(), `.${hConfig.itemClass}`)
      return cat(map$1(items, (i) => component.getSystem().getByDom(i).toOption()))
    }

    const HighlightApis = /* #__PURE__ */Object.freeze({
      dehighlightAll,
      dehighlight,
      highlight,
      highlightFirst,
      highlightLast,
      highlightAt,
      highlightBy,
      isHighlighted,
      getHighlighted,
      getFirst,
      getLast,
      getPrevious,
      getNext,
      getCandidates,
    })

    const HighlightSchema = [
      strict$1('highlightClass'),
      strict$1('itemClass'),
      onHandler('onHighlight'),
      onHandler('onDehighlight'),
    ]

    const Highlighting = create$1({
      fields: HighlightSchema,
      name: 'highlighting',
      apis: HighlightApis,
    })

    const reportFocusShifting = function (component, prevFocus, newFocus) {
      const noChange = prevFocus.exists((p) => newFocus.exists((n) => eq(n, p)))
      if (!noChange) {
        emitWith(component, focusShifted(), {
          prevFocus,
          newFocus,
        })
      }
    }
    const dom = function () {
      const get = function (component) {
        return search(component.element())
      }
      const set = function (component, focusee) {
        const prevFocus = get(component)
        component.getSystem().triggerFocus(focusee, component.element())
        const newFocus = get(component)
        reportFocusShifting(component, prevFocus, newFocus)
      }
      return {
        get,
        set,
      }
    }
    const highlights = function () {
      const get = function (component) {
        return Highlighting.getHighlighted(component).map((item) => item.element())
      }
      const set = function (component, element) {
        const prevFocus = get(component)
        component.getSystem().getByDom(element).fold(noop, (item) => {
          Highlighting.highlight(component, item)
        })
        const newFocus = get(component)
        reportFocusShifting(component, prevFocus, newFocus)
      }
      return {
        get,
        set,
      }
    }

    let FocusInsideModes;
    (function (FocusInsideModes) {
      FocusInsideModes.OnFocusMode = 'onFocus'
      FocusInsideModes.OnEnterOrSpaceMode = 'onEnterOrSpace'
      FocusInsideModes.OnApiMode = 'onApi'
    }(FocusInsideModes || (FocusInsideModes = {})))

    const typical = function (infoSchema, stateInit, getKeydownRules, getKeyupRules, optFocusIn) {
      const schema = function () {
        return infoSchema.concat([
          defaulted$1('focusManager', dom()),
          defaultedOf('focusInside', 'onFocus', valueOf((val) => contains([
            'onFocus',
            'onEnterOrSpace',
            'onApi',
          ], val) ? Result.value(val) : Result.error('Invalid value for focusInside'))),
          output$1('handler', me),
          output$1('state', stateInit),
          output$1('sendFocusIn', optFocusIn),
        ])
      }
      const processKey = function (component, simulatedEvent, getRules, keyingConfig, keyingState) {
        const rules = getRules(component, simulatedEvent, keyingConfig, keyingState)
        return choose$2(rules, simulatedEvent.event()).bind((rule$$1) => rule$$1(component, simulatedEvent, keyingConfig, keyingState))
      }
      const toEvents = function (keyingConfig, keyingState) {
        const onFocusHandler = keyingConfig.focusInside !== FocusInsideModes.OnFocusMode ? Option.none() : optFocusIn(keyingConfig).map((focusIn) => run(focus$1(), (component, simulatedEvent) => {
          focusIn(component, keyingConfig, keyingState)
          simulatedEvent.stop()
        }))
        const tryGoInsideComponent = function (component, simulatedEvent) {
          const isEnterOrSpace = inSet(SPACE().concat(ENTER()))(simulatedEvent.event())
          if (keyingConfig.focusInside === FocusInsideModes.OnEnterOrSpaceMode && isEnterOrSpace && isSource(component, simulatedEvent)) {
            optFocusIn(keyingConfig).each((focusIn) => {
              focusIn(component, keyingConfig, keyingState)
              simulatedEvent.stop()
            })
          }
        }
        return derive(onFocusHandler.toArray().concat([
          run(keydown(), (component, simulatedEvent) => {
            processKey(component, simulatedEvent, getKeydownRules, keyingConfig, keyingState).fold(() => {
              tryGoInsideComponent(component, simulatedEvent)
            }, (_) => {
              simulatedEvent.stop()
            })
          }),
          run(keyup(), (component, simulatedEvent) => {
            processKey(component, simulatedEvent, getKeyupRules, keyingConfig, keyingState).each((_) => {
              simulatedEvent.stop()
            })
          }),
        ]))
      }
      var me = {
        schema,
        processKey,
        toEvents,
      }
      return me
    }

    const create$2 = function (cyclicField) {
      const schema = [
        option('onEscape'),
        option('onEnter'),
        defaulted$1('selector', '[data-alloy-tabstop="true"]'),
        defaulted$1('firstTabstop', 0),
        defaulted$1('useTabstopAt', constant(true)),
        option('visibilitySelector'),
      ].concat([cyclicField])
      const isVisible = function (tabbingConfig, element) {
        const target = tabbingConfig.visibilitySelector.bind((sel) => closest$3(element, sel)).getOr(element)
        return get$5(target) > 0
      }
      const findInitial = function (component, tabbingConfig) {
        const tabstops = descendants$1(component.element(), tabbingConfig.selector)
        const visibles = filter(tabstops, (elem) => isVisible(tabbingConfig, elem))
        return Option.from(visibles[tabbingConfig.firstTabstop])
      }
      const findCurrent = function (component, tabbingConfig) {
        return tabbingConfig.focusManager.get(component).bind((elem) => closest$3(elem, tabbingConfig.selector))
      }
      const isTabstop = function (tabbingConfig, element) {
        return isVisible(tabbingConfig, element) && tabbingConfig.useTabstopAt(element)
      }
      const focusIn = function (component, tabbingConfig) {
        findInitial(component, tabbingConfig).each((target) => {
          tabbingConfig.focusManager.set(component, target)
        })
      }
      const goFromTabstop = function (component, tabstops, stopIndex, tabbingConfig, cycle) {
        return cycle(tabstops, stopIndex, (elem) => isTabstop(tabbingConfig, elem)).fold(() => tabbingConfig.cyclic ? Option.some(true) : Option.none(), (target) => {
          tabbingConfig.focusManager.set(component, target)
          return Option.some(true)
        })
      }
      const go = function (component, simulatedEvent, tabbingConfig, cycle) {
        const tabstops = descendants$1(component.element(), tabbingConfig.selector)
        return findCurrent(component, tabbingConfig).bind((tabstop) => {
          const optStopIndex = findIndex(tabstops, curry(eq, tabstop))
          return optStopIndex.bind((stopIndex) => goFromTabstop(component, tabstops, stopIndex, tabbingConfig, cycle))
        })
      }
      const goBackwards = function (component, simulatedEvent, tabbingConfig, tabbingState) {
        const navigate = tabbingConfig.cyclic ? cyclePrev : tryPrev
        return go(component, simulatedEvent, tabbingConfig, navigate)
      }
      const goForwards = function (component, simulatedEvent, tabbingConfig, tabbingState) {
        const navigate = tabbingConfig.cyclic ? cycleNext : tryNext
        return go(component, simulatedEvent, tabbingConfig, navigate)
      }
      const execute = function (component, simulatedEvent, tabbingConfig, tabbingState) {
        return tabbingConfig.onEnter.bind((f) => f(component, simulatedEvent))
      }
      const exit = function (component, simulatedEvent, tabbingConfig, tabbingState) {
        return tabbingConfig.onEscape.bind((f) => f(component, simulatedEvent))
      }
      const getKeydownRules = constant([
        rule(and([
          isShift,
          inSet(TAB()),
        ]), goBackwards),
        rule(inSet(TAB()), goForwards),
        rule(inSet(ESCAPE()), exit),
        rule(and([
          isNotShift,
          inSet(ENTER()),
        ]), execute),
      ])
      const getKeyupRules = constant([])
      return typical(schema, NoState.init, getKeydownRules, getKeyupRules, () => Option.some(focusIn))
    }

    const AcyclicType = create$2(state$1('cyclic', constant(false)))

    const CyclicType = create$2(state$1('cyclic', constant(true)))

    const inside = function (target) {
      return name(target) === 'input' && get$1(target, 'type') !== 'radio' || name(target) === 'textarea'
    }

    const doDefaultExecute = function (component, simulatedEvent, focused) {
      dispatch(component, focused, execute())
      return Option.some(true)
    }
    const defaultExecute = function (component, simulatedEvent, focused) {
      return inside(focused) && inSet(SPACE())(simulatedEvent.event()) ? Option.none() : doDefaultExecute(component, simulatedEvent, focused)
    }
    const stopEventForFirefox = function (component, simulatedEvent) {
      return Option.some(true)
    }

    const schema$1 = [
      defaulted$1('execute', defaultExecute),
      defaulted$1('useSpace', false),
      defaulted$1('useEnter', true),
      defaulted$1('useControlEnter', false),
      defaulted$1('useDown', false),
    ]
    const execute$1 = function (component, simulatedEvent, executeConfig) {
      return executeConfig.execute(component, simulatedEvent, component.element())
    }
    const getKeydownRules = function (component, simulatedEvent, executeConfig, executeState) {
      const spaceExec = executeConfig.useSpace && !inside(component.element()) ? SPACE() : []
      const enterExec = executeConfig.useEnter ? ENTER() : []
      const downExec = executeConfig.useDown ? DOWN() : []
      const execKeys = spaceExec.concat(enterExec).concat(downExec)
      return [rule(inSet(execKeys), execute$1)].concat(executeConfig.useControlEnter ? [rule(and([
        isControl,
        inSet(ENTER()),
      ]), execute$1)] : [])
    }
    const getKeyupRules = function (component, simulatedEvent, executeConfig, executeState) {
      return executeConfig.useSpace && !inside(component.element()) ? [rule(inSet(SPACE()), stopEventForFirefox)] : []
    }
    const ExecutionType = typical(schema$1, NoState.init, getKeydownRules, getKeyupRules, () => Option.none())

    const flatgrid = function (spec) {
      const dimensions = Cell(Option.none())
      const setGridSize = function (numRows, numColumns) {
        dimensions.set(Option.some({
          numRows: constant(numRows),
          numColumns: constant(numColumns),
        }))
      }
      const getNumRows = function () {
        return dimensions.get().map((d) => d.numRows())
      }
      const getNumColumns = function () {
        return dimensions.get().map((d) => d.numColumns())
      }
      return nu$6({
        readState() {
          return dimensions.get().map((d) => ({
            numRows: d.numRows(),
            numColumns: d.numColumns(),
          })).getOr({
            numRows: '?',
            numColumns: '?',
          })
        },
        setGridSize,
        getNumRows,
        getNumColumns,
      })
    }
    const init$1 = function (spec) {
      return spec.state(spec)
    }

    const KeyingState = /* #__PURE__ */Object.freeze({
      flatgrid,
      init: init$1,
    })

    const onDirection = function (isLtr, isRtl) {
      return function (element) {
        return getDirection(element) === 'rtl' ? isRtl : isLtr
      }
    }
    var getDirection = function (element) {
      return get$4(element, 'direction') === 'rtl' ? 'rtl' : 'ltr'
    }

    const useH = function (movement) {
      return function (component, simulatedEvent, config, state) {
        const move = movement(component.element())
        return use(move, component, simulatedEvent, config, state)
      }
    }
    const west = function (moveLeft, moveRight) {
      const movement = onDirection(moveLeft, moveRight)
      return useH(movement)
    }
    const east = function (moveLeft, moveRight) {
      const movement = onDirection(moveRight, moveLeft)
      return useH(movement)
    }
    const useV = function (move) {
      return function (component, simulatedEvent, config, state) {
        return use(move, component, simulatedEvent, config, state)
      }
    }
    var use = function (move, component, simulatedEvent, config, state) {
      const outcome = config.focusManager.get(component).bind((focused) => move(component.element(), focused, config, state))
      return outcome.map((newFocus) => {
        config.focusManager.set(component, newFocus)
        return true
      })
    }
    const north = useV
    const south = useV
    const move = useV

    const isHidden = function (dom) {
      return dom.offsetWidth <= 0 && dom.offsetHeight <= 0
    }
    const isVisible = function (element) {
      const dom = element.dom()
      return !isHidden(dom)
    }

    const indexInfo = MixedBag([
      'index',
      'candidates',
    ], [])
    const locate = function (candidates, predicate) {
      return findIndex(candidates, predicate).map((index) => indexInfo({
        index,
        candidates,
      }))
    }

    const locateVisible = function (container, current, selector) {
      const filter$$1 = isVisible
      return locateIn(container, current, selector, filter$$1)
    }
    var locateIn = function (container, current, selector, filter$$1) {
      const predicate = curry(eq, current)
      const candidates = descendants$1(container, selector)
      const visible = filter(candidates, isVisible)
      return locate(visible, predicate)
    }
    const findIndex$2 = function (elements, target) {
      return findIndex(elements, (elem) => eq(target, elem))
    }

    const withGrid = function (values, index, numCols, f) {
      const oldRow = Math.floor(index / numCols)
      const oldColumn = index % numCols
      return f(oldRow, oldColumn).bind((address) => {
        const newIndex = address.row() * numCols + address.column()
        return newIndex >= 0 && newIndex < values.length ? Option.some(values[newIndex]) : Option.none()
      })
    }
    const cycleHorizontal = function (values, index, numRows, numCols, delta) {
      return withGrid(values, index, numCols, (oldRow, oldColumn) => {
        const onLastRow = oldRow === numRows - 1
        const colsInRow = onLastRow ? values.length - oldRow * numCols : numCols
        const newColumn = cycleBy(oldColumn, delta, 0, colsInRow - 1)
        return Option.some({
          row: constant(oldRow),
          column: constant(newColumn),
        })
      })
    }
    const cycleVertical = function (values, index, numRows, numCols, delta) {
      return withGrid(values, index, numCols, (oldRow, oldColumn) => {
        const newRow = cycleBy(oldRow, delta, 0, numRows - 1)
        const onLastRow = newRow === numRows - 1
        const colsInRow = onLastRow ? values.length - newRow * numCols : numCols
        const newCol = cap(oldColumn, 0, colsInRow - 1)
        return Option.some({
          row: constant(newRow),
          column: constant(newCol),
        })
      })
    }
    const cycleRight = function (values, index, numRows, numCols) {
      return cycleHorizontal(values, index, numRows, numCols, +1)
    }
    const cycleLeft = function (values, index, numRows, numCols) {
      return cycleHorizontal(values, index, numRows, numCols, -1)
    }
    const cycleUp = function (values, index, numRows, numCols) {
      return cycleVertical(values, index, numRows, numCols, -1)
    }
    const cycleDown = function (values, index, numRows, numCols) {
      return cycleVertical(values, index, numRows, numCols, +1)
    }

    const schema$2 = [
      strict$1('selector'),
      defaulted$1('execute', defaultExecute),
      onKeyboardHandler('onEscape'),
      defaulted$1('captureTab', false),
      initSize(),
    ]
    const focusIn = function (component, gridConfig, gridState) {
      descendant$2(component.element(), gridConfig.selector).each((first) => {
        gridConfig.focusManager.set(component, first)
      })
    }
    const findCurrent = function (component, gridConfig) {
      return gridConfig.focusManager.get(component).bind((elem) => closest$3(elem, gridConfig.selector))
    }
    const execute$2 = function (component, simulatedEvent, gridConfig, gridState) {
      return findCurrent(component, gridConfig).bind((focused) => gridConfig.execute(component, simulatedEvent, focused))
    }
    const doMove = function (cycle) {
      return function (element, focused, gridConfig, gridState) {
        return locateVisible(element, focused, gridConfig.selector).bind((identified) => cycle(identified.candidates(), identified.index(), gridState.getNumRows().getOr(gridConfig.initSize.numRows), gridState.getNumColumns().getOr(gridConfig.initSize.numColumns)))
      }
    }
    const handleTab = function (component, simulatedEvent, gridConfig, gridState) {
      return gridConfig.captureTab ? Option.some(true) : Option.none()
    }
    const doEscape = function (component, simulatedEvent, gridConfig, gridState) {
      return gridConfig.onEscape(component, simulatedEvent)
    }
    const moveLeft = doMove(cycleLeft)
    const moveRight = doMove(cycleRight)
    const moveNorth = doMove(cycleUp)
    const moveSouth = doMove(cycleDown)
    const getKeydownRules$1 = constant([
      rule(inSet(LEFT()), west(moveLeft, moveRight)),
      rule(inSet(RIGHT()), east(moveLeft, moveRight)),
      rule(inSet(UP()), north(moveNorth)),
      rule(inSet(DOWN()), south(moveSouth)),
      rule(and([
        isShift,
        inSet(TAB()),
      ]), handleTab),
      rule(and([
        isNotShift,
        inSet(TAB()),
      ]), handleTab),
      rule(inSet(ESCAPE()), doEscape),
      rule(inSet(SPACE().concat(ENTER())), execute$2),
    ])
    const getKeyupRules$1 = constant([rule(inSet(SPACE()), stopEventForFirefox)])
    const FlatgridType = typical(schema$2, flatgrid, getKeydownRules$1, getKeyupRules$1, () => Option.some(focusIn))

    const horizontal = function (container, selector, current, delta) {
      const isDisabledButton = function (candidate) {
        return name(candidate) === 'button' && get$1(candidate, 'disabled') === 'disabled'
      }
      var tryCycle = function (initial, index, candidates) {
        const newIndex = cycleBy(index, delta, 0, candidates.length - 1)
        if (newIndex === initial) {
          return Option.none()
        }
        return isDisabledButton(candidates[newIndex]) ? tryCycle(initial, newIndex, candidates) : Option.from(candidates[newIndex])
      }
      return locateVisible(container, current, selector).bind((identified) => {
        const index = identified.index()
        const candidates = identified.candidates()
        return tryCycle(index, index, candidates)
      })
    }

    const schema$3 = [
      strict$1('selector'),
      defaulted$1('getInitial', Option.none),
      defaulted$1('execute', defaultExecute),
      onKeyboardHandler('onEscape'),
      defaulted$1('executeOnMove', false),
      defaulted$1('allowVertical', true),
    ]
    const findCurrent$1 = function (component, flowConfig) {
      return flowConfig.focusManager.get(component).bind((elem) => closest$3(elem, flowConfig.selector))
    }
    const execute$3 = function (component, simulatedEvent, flowConfig) {
      return findCurrent$1(component, flowConfig).bind((focused) => flowConfig.execute(component, simulatedEvent, focused))
    }
    const focusIn$1 = function (component, flowConfig) {
      flowConfig.getInitial(component).orThunk(() => descendant$2(component.element(), flowConfig.selector)).each((first) => {
        flowConfig.focusManager.set(component, first)
      })
    }
    const moveLeft$1 = function (element, focused, info) {
      return horizontal(element, info.selector, focused, -1)
    }
    const moveRight$1 = function (element, focused, info) {
      return horizontal(element, info.selector, focused, +1)
    }
    const doMove$1 = function (movement) {
      return function (component, simulatedEvent, flowConfig) {
        return movement(component, simulatedEvent, flowConfig).bind(() => flowConfig.executeOnMove ? execute$3(component, simulatedEvent, flowConfig) : Option.some(true))
      }
    }
    const doEscape$1 = function (component, simulatedEvent, flowConfig, _flowState) {
      return flowConfig.onEscape(component, simulatedEvent)
    }
    const getKeydownRules$2 = function (_component, _se, flowConfig, _flowState) {
      const westMovers = LEFT().concat(flowConfig.allowVertical ? UP() : [])
      const eastMovers = RIGHT().concat(flowConfig.allowVertical ? DOWN() : [])
      return [
        rule(inSet(westMovers), doMove$1(west(moveLeft$1, moveRight$1))),
        rule(inSet(eastMovers), doMove$1(east(moveLeft$1, moveRight$1))),
        rule(inSet(ENTER()), execute$3),
        rule(inSet(SPACE()), execute$3),
        rule(inSet(ESCAPE()), doEscape$1),
      ]
    }
    const getKeyupRules$2 = constant([rule(inSet(SPACE()), stopEventForFirefox)])
    const FlowType = typical(schema$3, NoState.init, getKeydownRules$2, getKeyupRules$2, () => Option.some(focusIn$1))

    const outcome = MixedBag([
      'rowIndex',
      'columnIndex',
      'cell',
    ], [])
    const toCell = function (matrix, rowIndex, columnIndex) {
      return Option.from(matrix[rowIndex]).bind((row) => Option.from(row[columnIndex]).map((cell) => outcome({
        rowIndex,
        columnIndex,
        cell,
      })))
    }
    const cycleHorizontal$1 = function (matrix, rowIndex, startCol, deltaCol) {
      const row = matrix[rowIndex]
      const colsInRow = row.length
      const newColIndex = cycleBy(startCol, deltaCol, 0, colsInRow - 1)
      return toCell(matrix, rowIndex, newColIndex)
    }
    const cycleVertical$1 = function (matrix, colIndex, startRow, deltaRow) {
      const nextRowIndex = cycleBy(startRow, deltaRow, 0, matrix.length - 1)
      const colsInNextRow = matrix[nextRowIndex].length
      const nextColIndex = cap(colIndex, 0, colsInNextRow - 1)
      return toCell(matrix, nextRowIndex, nextColIndex)
    }
    const moveHorizontal = function (matrix, rowIndex, startCol, deltaCol) {
      const row = matrix[rowIndex]
      const colsInRow = row.length
      const newColIndex = cap(startCol + deltaCol, 0, colsInRow - 1)
      return toCell(matrix, rowIndex, newColIndex)
    }
    const moveVertical = function (matrix, colIndex, startRow, deltaRow) {
      const nextRowIndex = cap(startRow + deltaRow, 0, matrix.length - 1)
      const colsInNextRow = matrix[nextRowIndex].length
      const nextColIndex = cap(colIndex, 0, colsInNextRow - 1)
      return toCell(matrix, nextRowIndex, nextColIndex)
    }
    const cycleRight$1 = function (matrix, startRow, startCol) {
      return cycleHorizontal$1(matrix, startRow, startCol, +1)
    }
    const cycleLeft$1 = function (matrix, startRow, startCol) {
      return cycleHorizontal$1(matrix, startRow, startCol, -1)
    }
    const cycleUp$1 = function (matrix, startRow, startCol) {
      return cycleVertical$1(matrix, startCol, startRow, -1)
    }
    const cycleDown$1 = function (matrix, startRow, startCol) {
      return cycleVertical$1(matrix, startCol, startRow, +1)
    }
    const moveLeft$2 = function (matrix, startRow, startCol) {
      return moveHorizontal(matrix, startRow, startCol, -1)
    }
    const moveRight$2 = function (matrix, startRow, startCol) {
      return moveHorizontal(matrix, startRow, startCol, +1)
    }
    const moveUp = function (matrix, startRow, startCol) {
      return moveVertical(matrix, startCol, startRow, -1)
    }
    const moveDown = function (matrix, startRow, startCol) {
      return moveVertical(matrix, startCol, startRow, +1)
    }

    const schema$4 = [
      strictObjOf('selectors', [
        strict$1('row'),
        strict$1('cell'),
      ]),
      defaulted$1('cycles', true),
      defaulted$1('previousSelector', Option.none),
      defaulted$1('execute', defaultExecute),
    ]
    const focusIn$2 = function (component, matrixConfig) {
      const focused = matrixConfig.previousSelector(component).orThunk(() => {
        const { selectors } = matrixConfig
        return descendant$2(component.element(), selectors.cell)
      })
      focused.each((cell) => {
        matrixConfig.focusManager.set(component, cell)
      })
    }
    const execute$4 = function (component, simulatedEvent, matrixConfig) {
      return search(component.element()).bind((focused) => matrixConfig.execute(component, simulatedEvent, focused))
    }
    const toMatrix = function (rows, matrixConfig) {
      return map$1(rows, (row) => descendants$1(row, matrixConfig.selectors.cell))
    }
    const doMove$2 = function (ifCycle, ifMove) {
      return function (element, focused, matrixConfig) {
        const move$$1 = matrixConfig.cycles ? ifCycle : ifMove
        return closest$3(focused, matrixConfig.selectors.row).bind((inRow) => {
          const cellsInRow = descendants$1(inRow, matrixConfig.selectors.cell)
          return findIndex$2(cellsInRow, focused).bind((colIndex) => {
            const allRows = descendants$1(element, matrixConfig.selectors.row)
            return findIndex$2(allRows, inRow).bind((rowIndex) => {
              const matrix = toMatrix(allRows, matrixConfig)
              return move$$1(matrix, rowIndex, colIndex).map((next) => next.cell())
            })
          })
        })
      }
    }
    const moveLeft$3 = doMove$2(cycleLeft$1, moveLeft$2)
    const moveRight$3 = doMove$2(cycleRight$1, moveRight$2)
    const moveNorth$1 = doMove$2(cycleUp$1, moveUp)
    const moveSouth$1 = doMove$2(cycleDown$1, moveDown)
    const getKeydownRules$3 = constant([
      rule(inSet(LEFT()), west(moveLeft$3, moveRight$3)),
      rule(inSet(RIGHT()), east(moveLeft$3, moveRight$3)),
      rule(inSet(UP()), north(moveNorth$1)),
      rule(inSet(DOWN()), south(moveSouth$1)),
      rule(inSet(SPACE().concat(ENTER())), execute$4),
    ])
    const getKeyupRules$3 = constant([rule(inSet(SPACE()), stopEventForFirefox)])
    const MatrixType = typical(schema$4, NoState.init, getKeydownRules$3, getKeyupRules$3, () => Option.some(focusIn$2))

    const schema$5 = [
      strict$1('selector'),
      defaulted$1('execute', defaultExecute),
      defaulted$1('moveOnTab', false),
    ]
    const execute$5 = function (component, simulatedEvent, menuConfig) {
      return menuConfig.focusManager.get(component).bind((focused) => menuConfig.execute(component, simulatedEvent, focused))
    }
    const focusIn$3 = function (component, menuConfig) {
      descendant$2(component.element(), menuConfig.selector).each((first) => {
        menuConfig.focusManager.set(component, first)
      })
    }
    const moveUp$1 = function (element, focused, info) {
      return horizontal(element, info.selector, focused, -1)
    }
    const moveDown$1 = function (element, focused, info) {
      return horizontal(element, info.selector, focused, +1)
    }
    const fireShiftTab = function (component, simulatedEvent, menuConfig) {
      return menuConfig.moveOnTab ? move(moveUp$1)(component, simulatedEvent, menuConfig) : Option.none()
    }
    const fireTab = function (component, simulatedEvent, menuConfig) {
      return menuConfig.moveOnTab ? move(moveDown$1)(component, simulatedEvent, menuConfig) : Option.none()
    }
    const getKeydownRules$4 = constant([
      rule(inSet(UP()), move(moveUp$1)),
      rule(inSet(DOWN()), move(moveDown$1)),
      rule(and([
        isShift,
        inSet(TAB()),
      ]), fireShiftTab),
      rule(and([
        isNotShift,
        inSet(TAB()),
      ]), fireTab),
      rule(inSet(ENTER()), execute$5),
      rule(inSet(SPACE()), execute$5),
    ])
    const getKeyupRules$4 = constant([rule(inSet(SPACE()), stopEventForFirefox)])
    const MenuType = typical(schema$5, NoState.init, getKeydownRules$4, getKeyupRules$4, () => Option.some(focusIn$3))

    const schema$6 = [
      onKeyboardHandler('onSpace'),
      onKeyboardHandler('onEnter'),
      onKeyboardHandler('onShiftEnter'),
      onKeyboardHandler('onLeft'),
      onKeyboardHandler('onRight'),
      onKeyboardHandler('onTab'),
      onKeyboardHandler('onShiftTab'),
      onKeyboardHandler('onUp'),
      onKeyboardHandler('onDown'),
      onKeyboardHandler('onEscape'),
      defaulted$1('stopSpaceKeyup', false),
      option('focusIn'),
    ]
    const getKeydownRules$5 = function (component, simulatedEvent, specialInfo) {
      return [
        rule(inSet(SPACE()), specialInfo.onSpace),
        rule(and([
          isNotShift,
          inSet(ENTER()),
        ]), specialInfo.onEnter),
        rule(and([
          isShift,
          inSet(ENTER()),
        ]), specialInfo.onShiftEnter),
        rule(and([
          isShift,
          inSet(TAB()),
        ]), specialInfo.onShiftTab),
        rule(and([
          isNotShift,
          inSet(TAB()),
        ]), specialInfo.onTab),
        rule(inSet(UP()), specialInfo.onUp),
        rule(inSet(DOWN()), specialInfo.onDown),
        rule(inSet(LEFT()), specialInfo.onLeft),
        rule(inSet(RIGHT()), specialInfo.onRight),
        rule(inSet(SPACE()), specialInfo.onSpace),
        rule(inSet(ESCAPE()), specialInfo.onEscape),
      ]
    }
    const getKeyupRules$5 = function (component, simulatedEvent, specialInfo) {
      return specialInfo.stopSpaceKeyup ? [rule(inSet(SPACE()), stopEventForFirefox)] : []
    }
    const SpecialType = typical(schema$6, NoState.init, getKeydownRules$5, getKeyupRules$5, (specialInfo) => specialInfo.focusIn)

    const acyclic = AcyclicType.schema()
    const cyclic = CyclicType.schema()
    const flow = FlowType.schema()
    const flatgrid$1 = FlatgridType.schema()
    const matrix = MatrixType.schema()
    const execution = ExecutionType.schema()
    const menu = MenuType.schema()
    const special = SpecialType.schema()

    const KeyboardBranches = /* #__PURE__ */Object.freeze({
      acyclic,
      cyclic,
      flow,
      flatgrid: flatgrid$1,
      matrix,
      execution,
      menu,
      special,
    })

    const Keying = createModes$1({
      branchKey: 'mode',
      branches: KeyboardBranches,
      name: 'keying',
      active: {
        events(keyingConfig, keyingState) {
          const { handler } = keyingConfig
          return handler.toEvents(keyingConfig, keyingState)
        },
      },
      apis: {
        focusIn(component, keyConfig, keyState) {
          keyConfig.sendFocusIn(keyConfig).fold(() => {
            component.getSystem().triggerFocus(component.element(), component.element())
          }, (sendFocusIn) => {
            sendFocusIn(component, keyConfig, keyState)
          })
        },
        setGridSize(component, keyConfig, keyState, numRows, numColumns) {
          if (!hasKey$1(keyState, 'setGridSize')) {
            console.error('Layout does not support setGridSize')
          } else {
            keyState.setGridSize(numRows, numColumns)
          }
        },
      },
      state: KeyingState,
    })

    const field$1 = function (name, forbidden) {
      return defaultedObjOf(name, {}, map$1(forbidden, (f) => forbid(f.name(), `Cannot configure ${f.name()} for ${name}`)).concat([state$1('dump', identity)]))
    }
    const get$6 = function (data) {
      return data.dump
    }
    const augment = function (data, original) {
      return __assign({}, data.dump, derive$1(original))
    }
    const SketchBehaviours = {
      field: field$1,
      augment,
      get: get$6,
    }

    const _placeholder = 'placeholder'
    const adt$2 = Adt.generate([
      {
        single: [
          'required',
          'valueThunk',
        ],
      },
      {
        multiple: [
          'required',
          'valueThunks',
        ],
      },
    ])
    const subPlaceholder = function (owner, detail, compSpec, placeholders) {
      if (owner.exists((o) => o !== compSpec.owner)) {
        return adt$2.single(true, constant(compSpec))
      }
      return readOptFrom$1(placeholders, compSpec.name).fold(() => {
        throw new Error(`Unknown placeholder component: ${compSpec.name}\nKnown: [${keys(placeholders)}]\nNamespace: ${owner.getOr('none')}\nSpec: ${Json.stringify(compSpec, null, 2)}`)
      }, (newSpec) => newSpec.replace())
    }
    const scan = function (owner, detail, compSpec, placeholders) {
      if (compSpec.uiType === _placeholder) {
        return subPlaceholder(owner, detail, compSpec, placeholders)
      }
      return adt$2.single(false, constant(compSpec))
    }
    var substitute = function (owner, detail, compSpec, placeholders) {
      const base = scan(owner, detail, compSpec, placeholders)
      return base.fold((req, valueThunk) => {
        const value = valueThunk(detail, compSpec.config, compSpec.validated)
        const childSpecs = readOptFrom$1(value, 'components').getOr([])
        const substituted = bind(childSpecs, (c) => substitute(owner, detail, c, placeholders))
        return [__assign({}, value, { components: substituted })]
      }, (req, valuesThunk) => {
        const values$$1 = valuesThunk(detail, compSpec.config, compSpec.validated)
        const preprocessor = compSpec.validated.preprocess.getOr(identity)
        return preprocessor(values$$1)
      })
    }
    const substituteAll = function (owner, detail, components, placeholders) {
      return bind(components, (c) => substitute(owner, detail, c, placeholders))
    }
    const oneReplace = function (label, replacements) {
      let called = false
      const used = function () {
        return called
      }
      const replace = function () {
        if (called === true) {
          throw new Error(`Trying to use the same placeholder more than once: ${label}`)
        }
        called = true
        return replacements
      }
      const required = function () {
        return replacements.fold((req, _) => req, (req, _) => req)
      }
      return {
        name: constant(label),
        required,
        used,
        replace,
      }
    }
    const substitutePlaces = function (owner, detail, components, placeholders) {
      const ps = map(placeholders, (ph, name) => oneReplace(name, ph))
      const outcome = substituteAll(owner, detail, components, ps)
      each(ps, (p) => {
        if (p.used() === false && p.required()) {
          throw new Error(`Placeholder: ${p.name()} was not found in components list\nNamespace: ${owner.getOr('none')}\nComponents: ${Json.stringify(detail.components, null, 2)}`)
        }
      })
      return outcome
    }
    const { single } = adt$2
    const { multiple } = adt$2
    const placeholder = constant(_placeholder)

    let unique = 0
    const generate$1 = function (prefix) {
      const date = new Date()
      const time = date.getTime()
      const random = Math.floor(Math.random() * 1000000000)
      unique++
      return `${prefix}_${random}${unique}${String(time)}`
    }

    const adt$3 = Adt.generate([
      { required: ['data'] },
      { external: ['data'] },
      { optional: ['data'] },
      { group: ['data'] },
    ])
    const fFactory = defaulted$1('factory', { sketch: identity })
    const fSchema = defaulted$1('schema', [])
    const fName = strict$1('name')
    const fPname = field('pname', 'pname', defaultedThunk((typeSpec) => `<alloy.${generate$1(typeSpec.name)}>`), anyValue$1())
    const fGroupSchema = state$1('schema', () => [option('preprocess')])
    const fDefaults = defaulted$1('defaults', constant({}))
    const fOverrides = defaulted$1('overrides', constant({}))
    const requiredSpec = objOf([
      fFactory,
      fSchema,
      fName,
      fPname,
      fDefaults,
      fOverrides,
    ])
    const optionalSpec = objOf([
      fFactory,
      fSchema,
      fName,
      fPname,
      fDefaults,
      fOverrides,
    ])
    const groupSpec = objOf([
      fFactory,
      fGroupSchema,
      fName,
      strict$1('unit'),
      fPname,
      fDefaults,
      fOverrides,
    ])
    const asNamedPart = function (part) {
      return part.fold(Option.some, Option.none, Option.some, Option.some)
    }
    const name$1 = function (part) {
      const get = function (data) {
        return data.name
      }
      return part.fold(get, get, get, get)
    }
    const convert = function (adtConstructor, partSchema) {
      return function (spec) {
        const data = asRawOrDie('Converting part type', partSchema, spec)
        return adtConstructor(data)
      }
    }
    const required = convert(adt$3.required, requiredSpec)
    const optional = convert(adt$3.optional, optionalSpec)
    const group = convert(adt$3.group, groupSpec)
    const original = constant('entirety')

    const combine = function (detail, data, partSpec, partValidated) {
      return deepMerge(data.defaults(detail, partSpec, partValidated), partSpec, { uid: detail.partUids[data.name] }, data.overrides(detail, partSpec, partValidated))
    }
    const subs = function (owner, detail, parts) {
      const internals = {}
      const externals = {}
      each$1(parts, (part) => {
        part.fold((data) => {
          internals[data.pname] = single(true, (detail, partSpec, partValidated) => data.factory.sketch(combine(detail, data, partSpec, partValidated)))
        }, (data) => {
          const partSpec = detail.parts[data.name]
          externals[data.name] = constant(data.factory.sketch(combine(detail, data, partSpec[original()]), partSpec))
        }, (data) => {
          internals[data.pname] = single(false, (detail, partSpec, partValidated) => data.factory.sketch(combine(detail, data, partSpec, partValidated)))
        }, (data) => {
          internals[data.pname] = multiple(true, (detail, _partSpec, _partValidated) => {
            const units = detail[data.name]
            return map$1(units, (u) => data.factory.sketch(deepMerge(data.defaults(detail, u, _partValidated), u, data.overrides(detail, u))))
          })
        })
      })
      return {
        internals: constant(internals),
        externals: constant(externals),
      }
    }

    const generate$2 = function (owner, parts) {
      const r = {}
      each$1(parts, (part) => {
        asNamedPart(part).each((np) => {
          const g = doGenerateOne(owner, np.pname)
          r[np.name] = function (config) {
            const validated = asRawOrDie(`Part: ${np.name} in ${owner}`, objOf(np.schema), config)
            return __assign({}, g, {
              config,
              validated,
            })
          }
        })
      })
      return r
    }
    var doGenerateOne = function (owner, pname) {
      return {
        uiType: placeholder(),
        owner,
        name: pname,
      }
    }
    const generateOne = function (owner, pname, config) {
      return {
        uiType: placeholder(),
        owner,
        name: pname,
        config,
        validated: {},
      }
    }
    const schemas = function (parts) {
      return bind(parts, (part) => part.fold(Option.none, Option.some, Option.none, Option.none).map((data) => strictObjOf(data.name, data.schema.concat([snapshot$1(original())]))).toArray())
    }
    const names = function (parts) {
      return map$1(parts, name$1)
    }
    const substitutes = function (owner, detail, parts) {
      return subs(owner, detail, parts)
    }
    const components = function (owner, detail, internals) {
      return substitutePlaces(Option.some(owner), detail, detail.components, internals)
    }
    const getPart = function (component, detail, partKey) {
      const uid = detail.partUids[partKey]
      return component.getSystem().getByUid(uid).toOption()
    }
    const getPartOrDie = function (component, detail, partKey) {
      return getPart(component, detail, partKey).getOrDie(`Could not find part: ${partKey}`)
    }
    const getAllParts = function (component, detail) {
      const system = component.getSystem()
      return map(detail.partUids, (pUid, k) => constant(system.getByUid(pUid)))
    }
    const defaultUids = function (baseUid, partTypes) {
      const partNames = names(partTypes)
      return wrapAll$1(map$1(partNames, (pn) => ({
        key: pn,
        value: `${baseUid}-${pn}`,
      })))
    }
    const defaultUidsSchema = function (partTypes) {
      return field('partUids', 'partUids', mergeWithThunk((spec) => defaultUids(spec.uid, partTypes)), anyValue$1())
    }

    const premadeTag = generate$1('alloy-premade')
    const premade = function (comp) {
      return wrap$2(premadeTag, comp)
    }
    const getPremade = function (spec) {
      return readOptFrom$1(spec, premadeTag)
    }
    const makeApi = function (f) {
      return markAsSketchApi(function (component) {
        const rest = []
        for (let _i = 1; _i < arguments.length; _i++) {
          rest[_i - 1] = arguments[_i]
        }
        return f.apply(undefined, [component.getApis()].concat([component].concat(rest)))
      }, f)
    }

    const prefix$1 = constant('alloy-id-')
    const idAttr = constant('data-alloy-id')

    const prefix$2 = prefix$1()
    const idAttr$1 = idAttr()
    const write = function (label, elem) {
      const id = generate$1(prefix$2 + label)
      writeOnly(elem, id)
      return id
    }
    var writeOnly = function (elem, uid) {
      Object.defineProperty(elem.dom(), idAttr$1, {
        value: uid,
        writable: true,
      })
    }
    const read$2 = function (elem) {
      const id = isElement(elem) ? elem.dom()[idAttr$1] : null
      return Option.from(id)
    }
    const generate$3 = function (prefix) {
      return generate$1(prefix)
    }

    const base = function (label, partSchemas, partUidsSchemas, spec) {
      const ps = partSchemas.length > 0 ? [strictObjOf('parts', partSchemas)] : []
      return ps.concat([
        strict$1('uid'),
        defaulted$1('dom', {}),
        defaulted$1('components', []),
        snapshot$1('originalSpec'),
        defaulted$1('debug.sketcher', {}),
      ]).concat(partUidsSchemas)
    }
    const asRawOrDie$1 = function (label, schema, spec, partSchemas, partUidsSchemas) {
      const baseS = base(label, partSchemas, partUidsSchemas, spec)
      return asRawOrDie(`${label} [SpecSchema]`, objOfOnly(baseS.concat(schema)), spec)
    }

    const single$1 = function (owner, schema, factory, spec) {
      const specWithUid = supplyUid(spec)
      const detail = asRawOrDie$1(owner, schema, specWithUid, [], [])
      return factory(detail, specWithUid)
    }
    const composite = function (owner, schema, partTypes, factory, spec) {
      const specWithUid = supplyUid(spec)
      const partSchemas = schemas(partTypes)
      const partUidsSchema = defaultUidsSchema(partTypes)
      const detail = asRawOrDie$1(owner, schema, specWithUid, partSchemas, [partUidsSchema])
      const subs = substitutes(owner, detail, partTypes)
      const components$$1 = components(owner, detail, subs.internals())
      return factory(detail, components$$1, specWithUid, subs.externals())
    }
    var supplyUid = function (spec) {
      return spec.hasOwnProperty('uid') ? spec : __assign({}, spec, { uid: generate$3('uid') })
    }

    function isSketchSpec(spec) {
      return spec.uid !== undefined
    }
    const singleSchema = objOfOnly([
      strict$1('name'),
      strict$1('factory'),
      strict$1('configFields'),
      defaulted$1('apis', {}),
      defaulted$1('extraApis', {}),
    ])
    const compositeSchema = objOfOnly([
      strict$1('name'),
      strict$1('factory'),
      strict$1('configFields'),
      strict$1('partFields'),
      defaulted$1('apis', {}),
      defaulted$1('extraApis', {}),
    ])
    const single$2 = function (rawConfig) {
      const config = asRawOrDie(`Sketcher for ${rawConfig.name}`, singleSchema, rawConfig)
      const sketch = function (spec) {
        return single$1(config.name, config.configFields, config.factory, spec)
      }
      const apis = map(config.apis, makeApi)
      const extraApis = map(config.extraApis, (f, k) => markAsExtraApi(f, k))
      return __assign({
        name: constant(config.name),
        partFields: constant([]),
        configFields: constant(config.configFields),
        sketch,
      }, apis, extraApis)
    }
    const composite$1 = function (rawConfig) {
      const config = asRawOrDie(`Sketcher for ${rawConfig.name}`, compositeSchema, rawConfig)
      const sketch = function (spec) {
        return composite(config.name, config.configFields, config.partFields, config.factory, spec)
      }
      const parts = generate$2(config.name, config.partFields)
      const apis = map(config.apis, makeApi)
      const extraApis = map(config.extraApis, (f, k) => markAsExtraApi(f, k))
      return __assign({
        name: constant(config.name),
        partFields: constant(config.partFields),
        configFields: constant(config.configFields),
        sketch,
        parts: constant(parts),
      }, apis, extraApis)
    }

    const factory = function (detail) {
      const events = events$2(detail.action)
      const { tag } = detail.dom
      const lookupAttr = function (attr) {
        return readOptFrom$1(detail.dom, 'attributes').bind((attrs) => readOptFrom$1(attrs, attr))
      }
      const getModAttributes = function () {
        if (tag === 'button') {
          const type = lookupAttr('type').getOr('button')
          const roleAttrs = lookupAttr('role').map((role) => ({ role })).getOr({})
          return __assign({ type }, roleAttrs)
        }
        const role = lookupAttr('role').getOr('button')
        return { role }
      }
      return {
        uid: detail.uid,
        dom: detail.dom,
        components: detail.components,
        events,
        behaviours: SketchBehaviours.augment(detail.buttonBehaviours, [
          Focusing.config({}),
          Keying.config({
            mode: 'execution',
            useSpace: true,
            useEnter: true,
          }),
        ]),
        domModification: { attributes: getModAttributes() },
        eventOrder: detail.eventOrder,
      }
    }
    const Button = single$2({
      name: 'Button',
      factory,
      configFields: [
        defaulted$1('uid', undefined),
        strict$1('dom'),
        defaulted$1('components', []),
        SketchBehaviours.field('buttonBehaviours', [
          Focusing,
          Keying,
        ]),
        option('action'),
        option('role'),
        defaulted$1('eventOrder', {}),
      ],
    })

    const exhibit$2 = function (base, unselectConfig) {
      return nu$5({
        styles: {
          '-webkit-user-select': 'none',
          'user-select': 'none',
          '-ms-user-select': 'none',
          '-moz-user-select': '-moz-none',
        },
        attributes: { unselectable: 'on' },
      })
    }
    const events$4 = function (unselectConfig) {
      return derive([abort(selectstart(), constant(true))])
    }

    const ActiveUnselecting = /* #__PURE__ */Object.freeze({
      events: events$4,
      exhibit: exhibit$2,
    })

    const Unselecting = create$1({
      fields: [],
      name: 'unselecting',
      active: ActiveUnselecting,
    })

    const getAttrs = function (elem) {
      const attributes = elem.dom().attributes !== undefined ? elem.dom().attributes : []
      return foldl(attributes, (b, attr) => {
        let _a
        if (attr.name === 'class') {
          return b
        }
        return __assign({}, b, (_a = {}, _a[attr.name] = attr.value, _a))
      }, {})
    }
    const getClasses = function (elem) {
      return Array.prototype.slice.call(elem.dom().classList, 0)
    }
    const fromHtml$2 = function (html) {
      const elem = Element$$1.fromHtml(html)
      const children$$1 = children(elem)
      const attrs = getAttrs(elem)
      const classes = getClasses(elem)
      const contents = children$$1.length === 0 ? {} : { innerHtml: get$3(elem) }
      return __assign({
        tag: name(elem),
        classes,
        attributes: attrs,
      }, contents)
    }

    const dom$2 = function (rawHtml) {
      const html = supplant(rawHtml, { prefix: Styles.prefix() })
      return fromHtml$2(html)
    }
    const spec = function (rawHtml) {
      const sDom = dom$2(rawHtml)
      return { dom: sDom }
    }

    const forToolbarCommand = function (editor, command) {
      return forToolbar(command, () => {
        editor.execCommand(command)
      }, {})
    }
    const getToggleBehaviours = function (command) {
      return derive$1([
        Toggling.config({
          toggleClass: Styles.resolve('toolbar-button-selected'),
          toggleOnExecute: false,
          aria: { mode: 'pressed' },
        }),
        Receivers.format(command, (button, status) => {
          const toggle = status ? Toggling.on : Toggling.off
          toggle(button)
        }),
      ])
    }
    const forToolbarStateCommand = function (editor, command) {
      const extraBehaviours = getToggleBehaviours(command)
      return forToolbar(command, () => {
        editor.execCommand(command)
      }, extraBehaviours)
    }
    const forToolbarStateAction = function (editor, clazz, command, action) {
      const extraBehaviours = getToggleBehaviours(command)
      return forToolbar(clazz, action, extraBehaviours)
    }
    var forToolbar = function (clazz, action, extraBehaviours) {
      return Button.sketch({
        dom: dom$2(`<span class="\${prefix}-toolbar-button \${prefix}-toolbar-group-item \${prefix}-icon-${clazz} \${prefix}-icon"></span>`),
        action,
        buttonBehaviours: deepMerge(derive$1([Unselecting.config({})]), extraBehaviours),
      })
    }
    const Buttons = {
      forToolbar,
      forToolbarCommand,
      forToolbarStateAction,
      forToolbarStateCommand,
    }

    const platform = PlatformDetection$1.detect()
    const isTouch = platform.deviceType.isTouch()
    const labelPart = optional({
      schema: [strict$1('dom')],
      name: 'label',
    })
    const edgePart = function (name) {
      return optional({
        name: `${name}-edge`,
        overrides(detail) {
          const action = detail.model.manager.edgeActions[name]
          return action.fold(() => ({}), (a) => {
            const touchEvents = derive([runActionExtra(touchstart(), a, [detail])])
            const mouseEvents = derive([
              runActionExtra(mousedown(), a, [detail]),
              runActionExtra(mousemove(), (l, det) => {
                if (det.mouseIsDown.get()) {
                  a(l, det)
                }
              }, [detail]),
            ])
            return { events: isTouch ? touchEvents : mouseEvents }
          })
        },
      })
    }
    const tlEdgePart = edgePart('top-left')
    const tedgePart = edgePart('top')
    const trEdgePart = edgePart('top-right')
    const redgePart = edgePart('right')
    const brEdgePart = edgePart('bottom-right')
    const bedgePart = edgePart('bottom')
    const blEdgePart = edgePart('bottom-left')
    const ledgePart = edgePart('left')
    const thumbPart = required({
      name: 'thumb',
      defaults: constant({ dom: { styles: { position: 'absolute' } } }),
      overrides(detail) {
        return {
          events: derive([
            redirectToPart(touchstart(), detail, 'spectrum'),
            redirectToPart(touchmove(), detail, 'spectrum'),
            redirectToPart(touchend(), detail, 'spectrum'),
            redirectToPart(mousedown(), detail, 'spectrum'),
            redirectToPart(mousemove(), detail, 'spectrum'),
            redirectToPart(mouseup(), detail, 'spectrum'),
          ]),
        }
      },
    })
    const spectrumPart = required({
      schema: [state$1('mouseIsDown', () => Cell(false))],
      name: 'spectrum',
      overrides(detail) {
        const modelDetail = detail.model
        const model = modelDetail.manager
        const setValueFrom = function (component, simulatedEvent) {
          return model.getValueFromEvent(simulatedEvent).map((value) => model.setValueFrom(component, detail, value))
        }
        const touchEvents = derive([
          run(touchstart(), setValueFrom),
          run(touchmove(), setValueFrom),
        ])
        const mouseEvents = derive([
          run(mousedown(), setValueFrom),
          run(mousemove(), (spectrum, se) => {
            if (detail.mouseIsDown.get()) {
              setValueFrom(spectrum, se)
            }
          }),
        ])
        return {
          behaviours: derive$1(isTouch ? [] : [
            Keying.config({
              mode: 'special',
              onLeft(spectrum) {
                return model.onLeft(spectrum, detail)
              },
              onRight(spectrum) {
                return model.onRight(spectrum, detail)
              },
              onUp(spectrum) {
                return model.onUp(spectrum, detail)
              },
              onDown(spectrum) {
                return model.onDown(spectrum, detail)
              },
            }),
            Focusing.config({}),
          ]),
          events: isTouch ? touchEvents : mouseEvents,
        }
      },
    })
    const SliderParts = [
      labelPart,
      ledgePart,
      redgePart,
      tedgePart,
      bedgePart,
      tlEdgePart,
      trEdgePart,
      blEdgePart,
      brEdgePart,
      thumbPart,
      spectrumPart,
    ]

    const onLoad$1 = function (component, repConfig, repState) {
      repConfig.store.manager.onLoad(component, repConfig, repState)
    }
    const onUnload = function (component, repConfig, repState) {
      repConfig.store.manager.onUnload(component, repConfig, repState)
    }
    const setValue = function (component, repConfig, repState, data) {
      repConfig.store.manager.setValue(component, repConfig, repState, data)
    }
    const getValue = function (component, repConfig, repState) {
      return repConfig.store.manager.getValue(component, repConfig, repState)
    }
    const getState = function (component, repConfig, repState) {
      return repState
    }

    const RepresentApis = /* #__PURE__ */Object.freeze({
      onLoad: onLoad$1,
      onUnload,
      setValue,
      getValue,
      getState,
    })

    const events$5 = function (repConfig, repState) {
      const es = repConfig.resetOnDom ? [
        runOnAttached((comp, se) => {
          onLoad$1(comp, repConfig, repState)
        }),
        runOnDetached((comp, se) => {
          onUnload(comp, repConfig, repState)
        }),
      ] : [loadEvent(repConfig, repState, onLoad$1)]
      return derive(es)
    }

    const ActiveRepresenting = /* #__PURE__ */Object.freeze({
      events: events$5,
    })

    const memory = function () {
      const data = Cell(null)
      const readState = function () {
        return {
          mode: 'memory',
          value: data.get(),
        }
      }
      const isNotSet = function () {
        return data.get() === null
      }
      const clear = function () {
        data.set(null)
      }
      return nu$6({
        set: data.set,
        get: data.get,
        isNotSet,
        clear,
        readState,
      })
    }
    const manual = function () {
      const readState = function () {
      }
      return nu$6({ readState })
    }
    const dataset = function () {
      const dataByValue = Cell({})
      const dataByText = Cell({})
      const readState = function () {
        return {
          mode: 'dataset',
          dataByValue: dataByValue.get(),
          dataByText: dataByText.get(),
        }
      }
      const clear = function () {
        dataByValue.set({})
        dataByText.set({})
      }
      const lookup = function (itemString) {
        return readOptFrom$1(dataByValue.get(), itemString).orThunk(() => readOptFrom$1(dataByText.get(), itemString))
      }
      const update = function (items) {
        const currentDataByValue = dataByValue.get()
        const currentDataByText = dataByText.get()
        const newDataByValue = {}
        const newDataByText = {}
        each$1(items, (item) => {
          newDataByValue[item.value] = item
          readOptFrom$1(item, 'meta').each((meta) => {
            readOptFrom$1(meta, 'text').each((text) => {
              newDataByText[text] = item
            })
          })
        })
        dataByValue.set(__assign({}, currentDataByValue, newDataByValue))
        dataByText.set(__assign({}, currentDataByText, newDataByText))
      }
      return nu$6({
        readState,
        lookup,
        update,
        clear,
      })
    }
    const init$2 = function (spec) {
      return spec.store.manager.state(spec)
    }

    const RepresentState = /* #__PURE__ */Object.freeze({
      memory,
      dataset,
      manual,
      init: init$2,
    })

    const setValue$1 = function (component, repConfig, repState, data) {
      const { store } = repConfig
      repState.update([data])
      store.setValue(component, data)
      repConfig.onSetValue(component, data)
    }
    const getValue$1 = function (component, repConfig, repState) {
      const { store } = repConfig
      const key = store.getDataKey(component)
      return repState.lookup(key).fold(() => store.getFallbackEntry(key), (data) => data)
    }
    const onLoad$2 = function (component, repConfig, repState) {
      const { store } = repConfig
      store.initialValue.each((data) => {
        setValue$1(component, repConfig, repState, data)
      })
    }
    const onUnload$1 = function (component, repConfig, repState) {
      repState.clear()
    }
    const DatasetStore = [
      option('initialValue'),
      strict$1('getFallbackEntry'),
      strict$1('getDataKey'),
      strict$1('setValue'),
      output$1('manager', {
        setValue: setValue$1,
        getValue: getValue$1,
        onLoad: onLoad$2,
        onUnload: onUnload$1,
        state: dataset,
      }),
    ]

    const getValue$2 = function (component, repConfig, repState) {
      return repConfig.store.getValue(component)
    }
    const setValue$2 = function (component, repConfig, repState, data) {
      repConfig.store.setValue(component, data)
      repConfig.onSetValue(component, data)
    }
    const onLoad$3 = function (component, repConfig, repState) {
      repConfig.store.initialValue.each((data) => {
        repConfig.store.setValue(component, data)
      })
    }
    const ManualStore = [
      strict$1('getValue'),
      defaulted$1('setValue', noop),
      option('initialValue'),
      output$1('manager', {
        setValue: setValue$2,
        getValue: getValue$2,
        onLoad: onLoad$3,
        onUnload: noop,
        state: NoState.init,
      }),
    ]

    const setValue$3 = function (component, repConfig, repState, data) {
      repState.set(data)
      repConfig.onSetValue(component, data)
    }
    const getValue$3 = function (component, repConfig, repState) {
      return repState.get()
    }
    const onLoad$4 = function (component, repConfig, repState) {
      repConfig.store.initialValue.each((initVal) => {
        if (repState.isNotSet()) {
          repState.set(initVal)
        }
      })
    }
    const onUnload$2 = function (component, repConfig, repState) {
      repState.clear()
    }
    const MemoryStore = [
      option('initialValue'),
      output$1('manager', {
        setValue: setValue$3,
        getValue: getValue$3,
        onLoad: onLoad$4,
        onUnload: onUnload$2,
        state: memory,
      }),
    ]

    const RepresentSchema = [
      defaultedOf('store', { mode: 'memory' }, choose$1('mode', {
        memory: MemoryStore,
        manual: ManualStore,
        dataset: DatasetStore,
      })),
      onHandler('onSetValue'),
      defaulted$1('resetOnDom', false),
    ]

    var Representing = create$1({
      fields: RepresentSchema,
      name: 'representing',
      active: ActiveRepresenting,
      apis: RepresentApis,
      extra: {
        setValueFrom(component, source) {
          const value = Representing.getValue(source)
          Representing.setValue(component, value)
        },
      },
      state: RepresentState,
    })

    var r = function (left, top) {
      const translate = function (x, y) {
        return r(left + x, top + y)
      }
      return {
        left: constant(left),
        top: constant(top),
        translate,
      }
    }
    const Position = r

    const isTouch$1 = PlatformDetection$1.detect().deviceType.isTouch()
    const _sliderChangeEvent = 'slider.change.value'
    const sliderChangeEvent = constant(_sliderChangeEvent)
    const getEventSource = function (simulatedEvent) {
      const evt = simulatedEvent.event().raw()
      if (isTouch$1) {
        const touchEvent = evt
        return touchEvent.touches !== undefined && touchEvent.touches.length === 1 ? Option.some(touchEvent.touches[0]).map((t) => Position(t.clientX, t.clientY)) : Option.none()
      }
      const mouseEvent = evt
      return mouseEvent.clientX !== undefined ? Option.some(mouseEvent).map((me) => Position(me.clientX, me.clientY)) : Option.none()
    }

    const reduceBy = function (value, min, max, step) {
      if (value < min) {
        return value
      } if (value > max) {
        return max
      } if (value === min) {
        return min - 1
      }
      return Math.max(min, value - step)
    }
    const increaseBy = function (value, min, max, step) {
      if (value > max) {
        return value
      } if (value < min) {
        return min
      } if (value === max) {
        return max + 1
      }
      return Math.min(max, value + step)
    }
    const capValue = function (value, min, max) {
      return Math.max(min, Math.min(max, value))
    }
    const snapValueOf = function (value, min, max, step, snapStart) {
      return snapStart.fold(() => {
        const initValue = value - min
        const extraValue = Math.round(initValue / step) * step
        return capValue(min + extraValue, min - 1, max + 1)
      }, (start) => {
        const remainder = (value - start) % step
        const adjustment = Math.round(remainder / step)
        const rawSteps = Math.floor((value - start) / step)
        const maxSteps = Math.floor((max - start) / step)
        const numSteps = Math.min(maxSteps, rawSteps + adjustment)
        const r = start + numSteps * step
        return Math.max(start, r)
      })
    }
    const findOffsetOf = function (value, min, max) {
      return Math.min(max, Math.max(value, min)) - min
    }
    const findValueOf = function (args) {
      const { min } = args; const { max } = args; const { range } = args; const { value } = args; const { step } = args; const { snap } = args; const { snapStart } = args; const { rounded } = args; const { hasMinEdge } = args; const { hasMaxEdge } = args; const { minBound } = args; const { maxBound } = args; const { screenRange } = args
      const capMin = hasMinEdge ? min - 1 : min
      const capMax = hasMaxEdge ? max + 1 : max
      if (value < minBound) {
        return capMin
      } if (value > maxBound) {
        return capMax
      }
      const offset = findOffsetOf(value, minBound, maxBound)
      const newValue = capValue(offset / screenRange * range + min, capMin, capMax)
      if (snap && newValue >= min && newValue <= max) {
        return snapValueOf(newValue, min, max, step, snapStart)
      } if (rounded) {
        return Math.round(newValue)
      }
      return newValue
    }
    const findOffsetOfValue = function (args) {
      const { min } = args; const { max } = args; const { range } = args; const { value } = args; const { hasMinEdge } = args; const { hasMaxEdge } = args; const { maxBound } = args; const { maxOffset } = args; const { centerMinEdge } = args; const { centerMaxEdge } = args
      if (value < min) {
        return hasMinEdge ? 0 : centerMinEdge
      } if (value > max) {
        return hasMaxEdge ? maxBound : centerMaxEdge
      }
      return (value - min) / range * maxOffset
    }

    const api$1 = Dimension('width', (element) => element.dom().offsetWidth)
    const set$5 = function (element, h) {
      api$1.set(element, h)
    }
    const get$7 = function (element) {
      return api$1.get(element)
    }

    const t = 'top'; const r$1 = 'right'; const b = 'bottom'; const l = 'left'
    const minX = function (detail) {
      return detail.model.minX
    }
    const minY = function (detail) {
      return detail.model.minY
    }
    const min1X = function (detail) {
      return detail.model.minX - 1
    }
    const min1Y = function (detail) {
      return detail.model.minY - 1
    }
    const maxX = function (detail) {
      return detail.model.maxX
    }
    const maxY = function (detail) {
      return detail.model.maxY
    }
    const max1X = function (detail) {
      return detail.model.maxX + 1
    }
    const max1Y = function (detail) {
      return detail.model.maxY + 1
    }
    const range$1 = function (detail, max, min) {
      return max(detail) - min(detail)
    }
    const xRange = function (detail) {
      return range$1(detail, maxX, minX)
    }
    const yRange = function (detail) {
      return range$1(detail, maxY, minY)
    }
    const halfX = function (detail) {
      return xRange(detail) / 2
    }
    const halfY = function (detail) {
      return yRange(detail) / 2
    }
    const step$1 = function (detail) {
      return detail.stepSize
    }
    const snap = function (detail) {
      return detail.snapToGrid
    }
    const snapStart = function (detail) {
      return detail.snapStart
    }
    const rounded = function (detail) {
      return detail.rounded
    }
    const hasEdge = function (detail, edgeName) {
      return detail[`${edgeName}-edge`] !== undefined
    }
    const hasLEdge = function (detail) {
      return hasEdge(detail, l)
    }
    const hasREdge = function (detail) {
      return hasEdge(detail, r$1)
    }
    const hasTEdge = function (detail) {
      return hasEdge(detail, t)
    }
    const hasBEdge = function (detail) {
      return hasEdge(detail, b)
    }
    const currentValue = function (detail) {
      return detail.model.value.get()
    }

    const xValue = function (x) {
      return { x: constant(x) }
    }
    const yValue = function (y) {
      return { y: constant(y) }
    }
    const xyValue = function (x, y) {
      return {
        x: constant(x),
        y: constant(y),
      }
    }
    const fireSliderChange = function (component, value) {
      emitWith(component, sliderChangeEvent(), { value })
    }
    const setToTLEdgeXY = function (edge, detail) {
      fireSliderChange(edge, xyValue(min1X(detail), min1Y(detail)))
    }
    const setToTEdge = function (edge, detail) {
      fireSliderChange(edge, yValue(min1Y(detail)))
    }
    const setToTEdgeXY = function (edge, detail) {
      fireSliderChange(edge, xyValue(halfX(detail), min1Y(detail)))
    }
    const setToTREdgeXY = function (edge, detail) {
      fireSliderChange(edge, xyValue(max1X(detail), min1Y(detail)))
    }
    const setToREdge = function (edge, detail) {
      fireSliderChange(edge, xValue(max1X(detail)))
    }
    const setToREdgeXY = function (edge, detail) {
      fireSliderChange(edge, xyValue(max1X(detail), halfY(detail)))
    }
    const setToBREdgeXY = function (edge, detail) {
      fireSliderChange(edge, xyValue(max1X(detail), max1Y(detail)))
    }
    const setToBEdge = function (edge, detail) {
      fireSliderChange(edge, yValue(max1Y(detail)))
    }
    const setToBEdgeXY = function (edge, detail) {
      fireSliderChange(edge, xyValue(halfX(detail), max1Y(detail)))
    }
    const setToBLEdgeXY = function (edge, detail) {
      fireSliderChange(edge, xyValue(min1X(detail), max1Y(detail)))
    }
    const setToLEdge = function (edge, detail) {
      fireSliderChange(edge, xValue(min1X(detail)))
    }
    const setToLEdgeXY = function (edge, detail) {
      fireSliderChange(edge, xyValue(min1X(detail), halfY(detail)))
    }

    const top = 'top'; const right = 'right'; const bottom = 'bottom'; const left = 'left'; const width = 'width'; const height = 'height'
    const getBounds = function (component) {
      return component.element().dom().getBoundingClientRect()
    }
    const getBoundsProperty = function (bounds, property) {
      return bounds[property]
    }
    const getMinXBounds = function (component) {
      const bounds = getBounds(component)
      return getBoundsProperty(bounds, left)
    }
    const getMaxXBounds = function (component) {
      const bounds = getBounds(component)
      return getBoundsProperty(bounds, right)
    }
    const getMinYBounds = function (component) {
      const bounds = getBounds(component)
      return getBoundsProperty(bounds, top)
    }
    const getMaxYBounds = function (component) {
      const bounds = getBounds(component)
      return getBoundsProperty(bounds, bottom)
    }
    const getXScreenRange = function (component) {
      const bounds = getBounds(component)
      return getBoundsProperty(bounds, width)
    }
    const getYScreenRange = function (component) {
      const bounds = getBounds(component)
      return getBoundsProperty(bounds, height)
    }
    const getCenterOffsetOf = function (componentMinEdge, componentMaxEdge, spectrumMinEdge) {
      return (componentMinEdge + componentMaxEdge) / 2 - spectrumMinEdge
    }
    const getXCenterOffSetOf = function (component, spectrum) {
      const componentBounds = getBounds(component)
      const spectrumBounds = getBounds(spectrum)
      const componentMinEdge = getBoundsProperty(componentBounds, left)
      const componentMaxEdge = getBoundsProperty(componentBounds, right)
      const spectrumMinEdge = getBoundsProperty(spectrumBounds, left)
      return getCenterOffsetOf(componentMinEdge, componentMaxEdge, spectrumMinEdge)
    }
    const getYCenterOffSetOf = function (component, spectrum) {
      const componentBounds = getBounds(component)
      const spectrumBounds = getBounds(spectrum)
      const componentMinEdge = getBoundsProperty(componentBounds, top)
      const componentMaxEdge = getBoundsProperty(componentBounds, bottom)
      const spectrumMinEdge = getBoundsProperty(spectrumBounds, top)
      return getCenterOffsetOf(componentMinEdge, componentMaxEdge, spectrumMinEdge)
    }

    const fireSliderChange$1 = function (spectrum, value) {
      emitWith(spectrum, sliderChangeEvent(), { value })
    }
    const sliderValue = function (x) {
      return { x: constant(x) }
    }
    const findValueOfOffset = function (spectrum, detail, left) {
      const args = {
        min: minX(detail),
        max: maxX(detail),
        range: xRange(detail),
        value: left,
        step: step$1(detail),
        snap: snap(detail),
        snapStart: snapStart(detail),
        rounded: rounded(detail),
        hasMinEdge: hasLEdge(detail),
        hasMaxEdge: hasREdge(detail),
        minBound: getMinXBounds(spectrum),
        maxBound: getMaxXBounds(spectrum),
        screenRange: getXScreenRange(spectrum),
      }
      return findValueOf(args)
    }
    const setValueFrom = function (spectrum, detail, value) {
      const xValue = findValueOfOffset(spectrum, detail, value)
      const sliderVal = sliderValue(xValue)
      fireSliderChange$1(spectrum, sliderVal)
      return xValue
    }
    const setToMin = function (spectrum, detail) {
      const min = minX(detail)
      fireSliderChange$1(spectrum, sliderValue(min))
    }
    const setToMax = function (spectrum, detail) {
      const max = maxX(detail)
      fireSliderChange$1(spectrum, sliderValue(max))
    }
    const moveBy = function (direction, spectrum, detail) {
      const f = direction > 0 ? increaseBy : reduceBy
      const xValue = f(currentValue(detail).x(), minX(detail), maxX(detail), step$1(detail))
      fireSliderChange$1(spectrum, sliderValue(xValue))
      return Option.some(xValue)
    }
    const handleMovement = function (direction) {
      return function (spectrum, detail) {
        return moveBy(direction, spectrum, detail).map(() => true)
      }
    }
    const getValueFromEvent = function (simulatedEvent) {
      const pos = getEventSource(simulatedEvent)
      return pos.map((p) => p.left())
    }
    const findOffsetOfValue$1 = function (spectrum, detail, value, minEdge, maxEdge) {
      const minOffset = 0
      const maxOffset = getXScreenRange(spectrum)
      const centerMinEdge = minEdge.bind((edge) => Option.some(getXCenterOffSetOf(edge, spectrum))).getOr(minOffset)
      const centerMaxEdge = maxEdge.bind((edge) => Option.some(getXCenterOffSetOf(edge, spectrum))).getOr(maxOffset)
      const args = {
        min: minX(detail),
        max: maxX(detail),
        range: xRange(detail),
        value,
        hasMinEdge: hasLEdge(detail),
        hasMaxEdge: hasREdge(detail),
        minBound: getMinXBounds(spectrum),
        minOffset,
        maxBound: getMaxXBounds(spectrum),
        maxOffset,
        centerMinEdge,
        centerMaxEdge,
      }
      return findOffsetOfValue(args)
    }
    const findPositionOfValue = function (slider, spectrum, value, minEdge, maxEdge, detail) {
      const offset = findOffsetOfValue$1(spectrum, detail, value, minEdge, maxEdge)
      return getMinXBounds(spectrum) - getMinXBounds(slider) + offset
    }
    const setPositionFromValue = function (slider, thumb, detail, edges) {
      const value = currentValue(detail)
      const pos = findPositionOfValue(slider, edges.getSpectrum(slider), value.x(), edges.getLeftEdge(slider), edges.getRightEdge(slider), detail)
      const thumbRadius = get$7(thumb.element()) / 2
      set$3(thumb.element(), 'left', `${pos - thumbRadius}px`)
    }
    const onLeft = handleMovement(-1)
    const onRight = handleMovement(1)
    const onUp = Option.none
    const onDown = Option.none
    const edgeActions = {
      'top-left': Option.none(),
      top: Option.none(),
      'top-right': Option.none(),
      right: Option.some(setToREdge),
      'bottom-right': Option.none(),
      bottom: Option.none(),
      'bottom-left': Option.none(),
      left: Option.some(setToLEdge),
    }

    const HorizontalModel = /* #__PURE__ */Object.freeze({
      setValueFrom,
      setToMin,
      setToMax,
      findValueOfOffset,
      getValueFromEvent,
      findPositionOfValue,
      setPositionFromValue,
      onLeft,
      onRight,
      onUp,
      onDown,
      edgeActions,
    })

    const fireSliderChange$2 = function (spectrum, value) {
      emitWith(spectrum, sliderChangeEvent(), { value })
    }
    const sliderValue$1 = function (y) {
      return { y: constant(y) }
    }
    const findValueOfOffset$1 = function (spectrum, detail, top) {
      const args = {
        min: minY(detail),
        max: maxY(detail),
        range: yRange(detail),
        value: top,
        step: step$1(detail),
        snap: snap(detail),
        snapStart: snapStart(detail),
        rounded: rounded(detail),
        hasMinEdge: hasTEdge(detail),
        hasMaxEdge: hasBEdge(detail),
        minBound: getMinYBounds(spectrum),
        maxBound: getMaxYBounds(spectrum),
        screenRange: getYScreenRange(spectrum),
      }
      return findValueOf(args)
    }
    const setValueFrom$1 = function (spectrum, detail, value) {
      const yValue = findValueOfOffset$1(spectrum, detail, value)
      const sliderVal = sliderValue$1(yValue)
      fireSliderChange$2(spectrum, sliderVal)
      return yValue
    }
    const setToMin$1 = function (spectrum, detail) {
      const min = minY(detail)
      fireSliderChange$2(spectrum, sliderValue$1(min))
    }
    const setToMax$1 = function (spectrum, detail) {
      const max = maxY(detail)
      fireSliderChange$2(spectrum, sliderValue$1(max))
    }
    const moveBy$1 = function (direction, spectrum, detail) {
      const f = direction > 0 ? increaseBy : reduceBy
      const yValue = f(currentValue(detail).y(), minY(detail), maxY(detail), step$1(detail))
      fireSliderChange$2(spectrum, sliderValue$1(yValue))
      return Option.some(yValue)
    }
    const handleMovement$1 = function (direction) {
      return function (spectrum, detail) {
        return moveBy$1(direction, spectrum, detail).map(() => true)
      }
    }
    const getValueFromEvent$1 = function (simulatedEvent) {
      const pos = getEventSource(simulatedEvent)
      return pos.map((p) => p.top())
    }
    const findOffsetOfValue$2 = function (spectrum, detail, value, minEdge, maxEdge) {
      const minOffset = 0
      const maxOffset = getYScreenRange(spectrum)
      const centerMinEdge = minEdge.bind((edge) => Option.some(getYCenterOffSetOf(edge, spectrum))).getOr(minOffset)
      const centerMaxEdge = maxEdge.bind((edge) => Option.some(getYCenterOffSetOf(edge, spectrum))).getOr(maxOffset)
      const args = {
        min: minY(detail),
        max: maxY(detail),
        range: yRange(detail),
        value,
        hasMinEdge: hasTEdge(detail),
        hasMaxEdge: hasBEdge(detail),
        minBound: getMinYBounds(spectrum),
        minOffset,
        maxBound: getMaxYBounds(spectrum),
        maxOffset,
        centerMinEdge,
        centerMaxEdge,
      }
      return findOffsetOfValue(args)
    }
    const findPositionOfValue$1 = function (slider, spectrum, value, minEdge, maxEdge, detail) {
      const offset = findOffsetOfValue$2(spectrum, detail, value, minEdge, maxEdge)
      return getMinYBounds(spectrum) - getMinYBounds(slider) + offset
    }
    const setPositionFromValue$1 = function (slider, thumb, detail, edges) {
      const value = currentValue(detail)
      const pos = findPositionOfValue$1(slider, edges.getSpectrum(slider), value.y(), edges.getTopEdge(slider), edges.getBottomEdge(slider), detail)
      const thumbRadius = get$5(thumb.element()) / 2
      set$3(thumb.element(), 'top', `${pos - thumbRadius}px`)
    }
    const onLeft$1 = Option.none
    const onRight$1 = Option.none
    const onUp$1 = handleMovement$1(-1)
    const onDown$1 = handleMovement$1(1)
    const edgeActions$1 = {
      'top-left': Option.none(),
      top: Option.some(setToTEdge),
      'top-right': Option.none(),
      right: Option.none(),
      'bottom-right': Option.none(),
      bottom: Option.some(setToBEdge),
      'bottom-left': Option.none(),
      left: Option.none(),
    }

    const VerticalModel = /* #__PURE__ */Object.freeze({
      setValueFrom: setValueFrom$1,
      setToMin: setToMin$1,
      setToMax: setToMax$1,
      findValueOfOffset: findValueOfOffset$1,
      getValueFromEvent: getValueFromEvent$1,
      findPositionOfValue: findPositionOfValue$1,
      setPositionFromValue: setPositionFromValue$1,
      onLeft: onLeft$1,
      onRight: onRight$1,
      onUp: onUp$1,
      onDown: onDown$1,
      edgeActions: edgeActions$1,
    })

    const fireSliderChange$3 = function (spectrum, value) {
      emitWith(spectrum, sliderChangeEvent(), { value })
    }
    const sliderValue$2 = function (x, y) {
      return {
        x: constant(x),
        y: constant(y),
      }
    }
    const setValueFrom$2 = function (spectrum, detail, value) {
      const xValue = findValueOfOffset(spectrum, detail, value.left())
      const yValue = findValueOfOffset$1(spectrum, detail, value.top())
      const val = sliderValue$2(xValue, yValue)
      fireSliderChange$3(spectrum, val)
      return val
    }
    const moveBy$2 = function (direction, isVerticalMovement, spectrum, detail) {
      const f = direction > 0 ? increaseBy : reduceBy
      const xValue = isVerticalMovement ? currentValue(detail).x() : f(currentValue(detail).x(), minX(detail), maxX(detail), step$1(detail))
      const yValue = !isVerticalMovement ? currentValue(detail).y() : f(currentValue(detail).y(), minY(detail), maxY(detail), step$1(detail))
      fireSliderChange$3(spectrum, sliderValue$2(xValue, yValue))
      return Option.some(xValue)
    }
    const handleMovement$2 = function (direction, isVerticalMovement) {
      return function (spectrum, detail) {
        return moveBy$2(direction, isVerticalMovement, spectrum, detail).map(() => true)
      }
    }
    const setToMin$2 = function (spectrum, detail) {
      const mX = minX(detail)
      const mY = minY(detail)
      fireSliderChange$3(spectrum, sliderValue$2(mX, mY))
    }
    const setToMax$2 = function (spectrum, detail) {
      const mX = maxX(detail)
      const mY = maxY(detail)
      fireSliderChange$3(spectrum, sliderValue$2(mX, mY))
    }
    const getValueFromEvent$2 = function (simulatedEvent) {
      return getEventSource(simulatedEvent)
    }
    const setPositionFromValue$2 = function (slider, thumb, detail, edges) {
      const value = currentValue(detail)
      const xPos = findPositionOfValue(slider, edges.getSpectrum(slider), value.x(), edges.getLeftEdge(slider), edges.getRightEdge(slider), detail)
      const yPos = findPositionOfValue$1(slider, edges.getSpectrum(slider), value.y(), edges.getTopEdge(slider), edges.getBottomEdge(slider), detail)
      const thumbXRadius = get$7(thumb.element()) / 2
      const thumbYRadius = get$5(thumb.element()) / 2
      set$3(thumb.element(), 'left', `${xPos - thumbXRadius}px`)
      set$3(thumb.element(), 'top', `${yPos - thumbYRadius}px`)
    }
    const onLeft$2 = handleMovement$2(-1, false)
    const onRight$2 = handleMovement$2(1, false)
    const onUp$2 = handleMovement$2(-1, true)
    const onDown$2 = handleMovement$2(1, true)
    const edgeActions$2 = {
      'top-left': Option.some(setToTLEdgeXY),
      top: Option.some(setToTEdgeXY),
      'top-right': Option.some(setToTREdgeXY),
      right: Option.some(setToREdgeXY),
      'bottom-right': Option.some(setToBREdgeXY),
      bottom: Option.some(setToBEdgeXY),
      'bottom-left': Option.some(setToBLEdgeXY),
      left: Option.some(setToLEdgeXY),
    }

    const TwoDModel = /* #__PURE__ */Object.freeze({
      setValueFrom: setValueFrom$2,
      setToMin: setToMin$2,
      setToMax: setToMax$2,
      getValueFromEvent: getValueFromEvent$2,
      setPositionFromValue: setPositionFromValue$2,
      onLeft: onLeft$2,
      onRight: onRight$2,
      onUp: onUp$2,
      onDown: onDown$2,
      edgeActions: edgeActions$2,
    })

    const isTouch$2 = PlatformDetection$1.detect().deviceType.isTouch()
    const SliderSchema = [
      defaulted$1('stepSize', 1),
      defaulted$1('onChange', noop),
      defaulted$1('onChoose', noop),
      defaulted$1('onInit', noop),
      defaulted$1('onDragStart', noop),
      defaulted$1('onDragEnd', noop),
      defaulted$1('snapToGrid', false),
      defaulted$1('rounded', true),
      option('snapStart'),
      strictOf('model', choose$1('mode', {
        x: [
          defaulted$1('minX', 0),
          defaulted$1('maxX', 100),
          state$1('value', (spec) => Cell(spec.mode.minX)),
          strict$1('getInitialValue'),
          output$1('manager', HorizontalModel),
        ],
        y: [
          defaulted$1('minY', 0),
          defaulted$1('maxY', 100),
          state$1('value', (spec) => Cell(spec.mode.minY)),
          strict$1('getInitialValue'),
          output$1('manager', VerticalModel),
        ],
        xy: [
          defaulted$1('minX', 0),
          defaulted$1('maxX', 100),
          defaulted$1('minY', 0),
          defaulted$1('maxY', 100),
          state$1('value', (spec) => Cell({
            x: constant(spec.mode.minX),
            y: constant(spec.mode.minY),
          })),
          strict$1('getInitialValue'),
          output$1('manager', TwoDModel),
        ],
      })),
      field$1('sliderBehaviours', [
        Keying,
        Representing,
      ]),
    ].concat(!isTouch$2 ? [state$1('mouseIsDown', () => Cell(false))] : [])

    const isTouch$3 = PlatformDetection$1.detect().deviceType.isTouch()
    const sketch$1 = function (detail, components$$1, _spec, _externals) {
      const getThumb = function (component) {
        return getPartOrDie(component, detail, 'thumb')
      }
      const getSpectrum = function (component) {
        return getPartOrDie(component, detail, 'spectrum')
      }
      const getLeftEdge = function (component) {
        return getPart(component, detail, 'left-edge')
      }
      const getRightEdge = function (component) {
        return getPart(component, detail, 'right-edge')
      }
      const getTopEdge = function (component) {
        return getPart(component, detail, 'top-edge')
      }
      const getBottomEdge = function (component) {
        return getPart(component, detail, 'bottom-edge')
      }
      const modelDetail = detail.model
      const model = modelDetail.manager
      const refresh = function (slider, thumb) {
        model.setPositionFromValue(slider, thumb, detail, {
          getLeftEdge,
          getRightEdge,
          getTopEdge,
          getBottomEdge,
          getSpectrum,
        })
      }
      const changeValue = function (slider, newValue) {
        modelDetail.value.set(newValue)
        const thumb = getThumb(slider)
        refresh(slider, thumb)
        detail.onChange(slider, thumb, newValue)
        return Option.some(true)
      }
      const resetToMin = function (slider) {
        model.setToMin(slider, detail)
      }
      const resetToMax = function (slider) {
        model.setToMax(slider, detail)
      }
      const touchEvents = [
        run(touchstart(), (slider, _simulatedEvent) => {
          detail.onDragStart(slider, getThumb(slider))
        }),
        run(touchend(), (slider, _simulatedEvent) => {
          detail.onDragEnd(slider, getThumb(slider))
        }),
      ]
      const mouseEvents = [
        run(mousedown(), (slider, simulatedEvent) => {
          simulatedEvent.stop()
          detail.onDragStart(slider, getThumb(slider))
          detail.mouseIsDown.set(true)
        }),
        run(mouseup(), (slider, _simulatedEvent) => {
          detail.onDragEnd(slider, getThumb(slider))
        }),
      ]
      const uiEventsArr = isTouch$3 ? touchEvents : mouseEvents
      return {
        uid: detail.uid,
        dom: detail.dom,
        components: components$$1,
        behaviours: augment(detail.sliderBehaviours, flatten([
          !isTouch$3 ? [Keying.config({
            mode: 'special',
            focusIn(slider) {
              return getPart(slider, detail, 'spectrum').map(Keying.focusIn).map(constant(true))
            },
          })] : [],
          [
            Representing.config({
              store: {
                mode: 'manual',
                getValue(_) {
                  return modelDetail.value.get()
                },
              },
            }),
            Receiving.config({
              channels: {
                'mouse.released': {
                  onReceive(slider, se) {
                    const wasDown = detail.mouseIsDown.get()
                    detail.mouseIsDown.set(false)
                    if (wasDown) {
                      getPart(slider, detail, 'thumb').each((thumb) => {
                        const value = modelDetail.value.get()
                        detail.onChoose(slider, thumb, value)
                      })
                    }
                  },
                },
              },
            }),
          ],
        ])),
        events: derive([
          run(sliderChangeEvent(), (slider, simulatedEvent) => {
            changeValue(slider, simulatedEvent.event().value())
          }),
          runOnAttached((slider, simulatedEvent) => {
            const getInitial = modelDetail.getInitialValue()
            modelDetail.value.set(getInitial)
            const thumb = getThumb(slider)
            refresh(slider, thumb)
            const spectrum = getSpectrum(slider)
            detail.onInit(slider, thumb, spectrum, modelDetail.value.get())
          }),
        ].concat(uiEventsArr)),
        apis: {
          resetToMin,
          resetToMax,
          changeValue,
          refresh,
        },
        domModification: { styles: { position: 'relative' } },
      }
    }

    const Slider = composite$1({
      name: 'Slider',
      configFields: SliderSchema,
      partFields: SliderParts,
      factory: sketch$1,
      apis: {
        resetToMin(apis, slider) {
          apis.resetToMin(slider)
        },
        resetToMax(apis, slider) {
          apis.resetToMax(slider)
        },
        refresh(apis, slider) {
          apis.refresh(slider)
        },
      },
    })

    const button = function (realm, clazz, makeItems) {
      return Buttons.forToolbar(clazz, () => {
        const items = makeItems()
        realm.setContextToolbar([{
          label: `${clazz} group`,
          items,
        }])
      }, {})
    }

    const BLACK = -1
    const makeSlider = function (spec$$1) {
      const getColor = function (hue) {
        if (hue < 0) {
          return 'black'
        } if (hue > 360) {
          return 'white'
        }
        return `hsl(${hue}, 100%, 50%)`
      }
      const onInit = function (slider, thumb, spectrum, value) {
        const color = getColor(value.x())
        set$3(thumb.element(), 'background-color', color)
      }
      const onChange = function (slider, thumb, value) {
        const color = getColor(value.x())
        set$3(thumb.element(), 'background-color', color)
        spec$$1.onChange(slider, thumb, color)
      }
      return Slider.sketch({
        dom: dom$2('<div class="${prefix}-slider ${prefix}-hue-slider-container"></div>'),
        components: [
          Slider.parts()['left-edge'](spec('<div class="${prefix}-hue-slider-black"></div>')),
          Slider.parts().spectrum({
            dom: dom$2('<div class="${prefix}-slider-gradient-container"></div>'),
            components: [spec('<div class="${prefix}-slider-gradient"></div>')],
            behaviours: derive$1([Toggling.config({ toggleClass: Styles.resolve('thumb-active') })]),
          }),
          Slider.parts()['right-edge'](spec('<div class="${prefix}-hue-slider-white"></div>')),
          Slider.parts().thumb({
            dom: dom$2('<div class="${prefix}-slider-thumb"></div>'),
            behaviours: derive$1([Toggling.config({ toggleClass: Styles.resolve('thumb-active') })]),
          }),
        ],
        onChange,
        onDragStart(slider, thumb) {
          Toggling.on(thumb)
        },
        onDragEnd(slider, thumb) {
          Toggling.off(thumb)
        },
        onInit,
        stepSize: 10,
        model: {
          mode: 'x',
          minX: 0,
          maxX: 360,
          getInitialValue() {
            return {
              x() {
                return spec$$1.getInitialValue()
              },
            }
          },
        },
        sliderBehaviours: derive$1([Receivers.orientation(Slider.refresh)]),
      })
    }
    const makeItems = function (spec$$1) {
      return [makeSlider(spec$$1)]
    }
    const sketch$2 = function (realm, editor) {
      const spec$$1 = {
        onChange(slider, thumb, color) {
          editor.undoManager.transact(() => {
            editor.formatter.apply('forecolor', { value: color })
            editor.nodeChanged()
          })
        },
        getInitialValue() {
          return BLACK
        },
      }
      return button(realm, 'color', () => makeItems(spec$$1))
    }
    const ColorSlider = {
      makeItems,
      sketch: sketch$2,
    }

    const schema$7 = objOfOnly([
      strict$1('getInitialValue'),
      strict$1('onChange'),
      strict$1('category'),
      strict$1('sizes'),
    ])
    const sketch$3 = function (rawSpec) {
      const spec$$1 = asRawOrDie('SizeSlider', schema$7, rawSpec)
      const isValidValue = function (valueIndex) {
        return valueIndex >= 0 && valueIndex < spec$$1.sizes.length
      }
      const onChange = function (slider, thumb, valueIndex) {
        const index = valueIndex.x()
        if (isValidValue(index)) {
          spec$$1.onChange(index)
        }
      }
      return Slider.sketch({
        dom: {
          tag: 'div',
          classes: [
            Styles.resolve(`slider-${spec$$1.category}-size-container`),
            Styles.resolve('slider'),
            Styles.resolve('slider-size-container'),
          ],
        },
        onChange,
        onDragStart(slider, thumb) {
          Toggling.on(thumb)
        },
        onDragEnd(slider, thumb) {
          Toggling.off(thumb)
        },
        model: {
          mode: 'x',
          minX: 0,
          maxX: spec$$1.sizes.length - 1,
          getInitialValue() {
            return {
              x() {
                return spec$$1.getInitialValue()
              },
            }
          },
        },
        stepSize: 1,
        snapToGrid: true,
        sliderBehaviours: derive$1([Receivers.orientation(Slider.refresh)]),
        components: [
          Slider.parts().spectrum({
            dom: dom$2('<div class="${prefix}-slider-size-container"></div>'),
            components: [spec('<div class="${prefix}-slider-size-line"></div>')],
          }),
          Slider.parts().thumb({
            dom: dom$2('<div class="${prefix}-slider-thumb"></div>'),
            behaviours: derive$1([Toggling.config({ toggleClass: Styles.resolve('thumb-active') })]),
          }),
        ],
      })
    }
    const SizeSlider = { sketch: sketch$3 }

    const candidates = [
      '9px',
      '10px',
      '11px',
      '12px',
      '14px',
      '16px',
      '18px',
      '20px',
      '24px',
      '32px',
      '36px',
    ]
    const defaultSize = 'medium'
    const defaultIndex = 2
    const indexToSize = function (index) {
      return Option.from(candidates[index])
    }
    const sizeToIndex = function (size) {
      return findIndex(candidates, (v) => v === size)
    }
    const getRawOrComputed = function (isRoot, rawStart) {
      const optStart = isElement(rawStart) ? Option.some(rawStart) : parent(rawStart)
      return optStart.map((start) => {
        const inline = closest(start, (elem) => getRaw(elem, 'font-size').isSome(), isRoot).bind((elem) => getRaw(elem, 'font-size'))
        return inline.getOrThunk(() => get$4(start, 'font-size'))
      }).getOr('')
    }
    const getSize = function (editor) {
      const node = editor.selection.getStart()
      const elem = Element$$1.fromDom(node)
      const root = Element$$1.fromDom(editor.getBody())
      const isRoot = function (e) {
        return eq(root, e)
      }
      const elemSize = getRawOrComputed(isRoot, elem)
      return find$2(candidates, (size) => elemSize === size).getOr(defaultSize)
    }
    const applySize = function (editor, value$$1) {
      const currentValue = getSize(editor)
      if (currentValue !== value$$1) {
        editor.execCommand('fontSize', false, value$$1)
      }
    }
    const get$8 = function (editor) {
      const size = getSize(editor)
      return sizeToIndex(size).getOr(defaultIndex)
    }
    const apply$1 = function (editor, index) {
      indexToSize(index).each((size) => {
        applySize(editor, size)
      })
    }
    const FontSizes = {
      candidates: constant(candidates),
      get: get$8,
      apply: apply$1,
    }

    const sizes = FontSizes.candidates()
    const makeSlider$1 = function (spec$$1) {
      return SizeSlider.sketch({
        onChange: spec$$1.onChange,
        sizes,
        category: 'font',
        getInitialValue: spec$$1.getInitialValue,
      })
    }
    const makeItems$1 = function (spec$$1) {
      return [
        spec('<span class="${prefix}-toolbar-button ${prefix}-icon-small-font ${prefix}-icon"></span>'),
        makeSlider$1(spec$$1),
        spec('<span class="${prefix}-toolbar-button ${prefix}-icon-large-font ${prefix}-icon"></span>'),
      ]
    }
    const sketch$4 = function (realm, editor) {
      const spec$$1 = {
        onChange(value) {
          FontSizes.apply(editor, value)
        },
        getInitialValue() {
          return FontSizes.get(editor)
        },
      }
      return button(realm, 'font-size', () => makeItems$1(spec$$1))
    }

    const record = function (spec) {
      const uid = isSketchSpec(spec) && hasKey$1(spec, 'uid') ? spec.uid : generate$3('memento')
      const get = function (anyInSystem) {
        return anyInSystem.getSystem().getByUid(uid).getOrDie()
      }
      const getOpt = function (anyInSystem) {
        return anyInSystem.getSystem().getByUid(uid).fold(Option.none, Option.some)
      }
      const asSpec = function () {
        return __assign({}, spec, { uid })
      }
      return {
        get,
        getOpt,
        asSpec,
      }
    }

    function create$3(width, height) {
      return resize(document.createElement('canvas'), width, height)
    }
    function clone$2(canvas) {
      let tCanvas, ctx
      tCanvas = create$3(canvas.width, canvas.height)
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
      create: create$3,
      clone: clone$2,
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
    const Promise$1 = window.Promise ? window.Promise : promise()

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
      return new Promise$1((resolve, reject) => {
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
      return new Promise$1((resolve, reject) => {
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
      return new Promise$1((resolve, reject) => {
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
        return new Promise$1((resolve) => {
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
      return new Promise$1((resolve) => {
        const reader = FileReader()
        reader.onloadend = function () {
          resolve(reader.result)
        }
        reader.readAsDataURL(blob)
      })
    }
    function blobToArrayBuffer(blob) {
      return new Promise$1((resolve) => {
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

    const addImage = function (editor, blob) {
      BlobConversions.blobToBase64(blob).then((base64) => {
        editor.undoManager.transact(() => {
          const cache = editor.editorUpload.blobCache
          const info = cache.create(generate$1('mceu'), blob, base64)
          cache.add(info)
          const img = editor.dom.createHTML('img', { src: info.blobUri() })
          editor.insertContent(img)
        })
      })
    }
    const extractBlob = function (simulatedEvent) {
      const event = simulatedEvent.event()
      const files = event.raw().target.files || event.raw().dataTransfer.files
      return Option.from(files[0])
    }
    const sketch$5 = function (editor) {
      const pickerDom = {
        tag: 'input',
        attributes: {
          accept: 'image/*',
          type: 'file',
          title: '',
        },
        styles: {
          visibility: 'hidden',
          position: 'absolute',
        },
      }
      const memPicker = record({
        dom: pickerDom,
        events: derive([
          cutter(click()),
          run(change(), (picker, simulatedEvent) => {
            extractBlob(simulatedEvent).each((blob) => {
              addImage(editor, blob)
            })
          }),
        ]),
      })
      return Button.sketch({
        dom: dom$2('<span class="${prefix}-toolbar-button ${prefix}-icon-image ${prefix}-icon"></span>'),
        components: [memPicker.asSpec()],
        action(button) {
          const picker = memPicker.get(button)
          picker.element().dom().click()
        },
      })
    }

    const get$9 = function (element) {
      return element.dom().textContent
    }
    const set$6 = function (element, value) {
      element.dom().textContent = value
    }

    const isNotEmpty = function (val) {
      return val.length > 0
    }
    const defaultToEmpty = function (str) {
      return str === undefined || str === null ? '' : str
    }
    const noLink = function (editor) {
      const text = editor.selection.getContent({ format: 'text' })
      return {
        url: '',
        text,
        title: '',
        target: '',
        link: Option.none(),
      }
    }
    const fromLink = function (link) {
      const text = get$9(link)
      const url = get$1(link, 'href')
      const title = get$1(link, 'title')
      const target = get$1(link, 'target')
      return {
        url: defaultToEmpty(url),
        text: text !== url ? defaultToEmpty(text) : '',
        title: defaultToEmpty(title),
        target: defaultToEmpty(target),
        link: Option.some(link),
      }
    }
    const getInfo = function (editor) {
      return query(editor).fold(() => noLink(editor), (link) => fromLink(link))
    }
    const wasSimple = function (link) {
      const prevHref = get$1(link, 'href')
      const prevText = get$9(link)
      return prevHref === prevText
    }
    const getTextToApply = function (link, url, info) {
      return info.text.toOption().filter(isNotEmpty).fold(() => wasSimple(link) ? Option.some(url) : Option.none(), Option.some)
    }
    const unlinkIfRequired = function (editor, info) {
      const activeLink = info.link.bind(identity)
      activeLink.each((link) => {
        editor.execCommand('unlink')
      })
    }
    const getAttrs$1 = function (url, info) {
      const attrs = {}
      attrs.href = url
      info.title.toOption().filter(isNotEmpty).each((title) => {
        attrs.title = title
      })
      info.target.toOption().filter(isNotEmpty).each((target) => {
        attrs.target = target
      })
      return attrs
    }
    const applyInfo = function (editor, info) {
      info.url.toOption().filter(isNotEmpty).fold(() => {
        unlinkIfRequired(editor, info)
      }, (url) => {
        const attrs = getAttrs$1(url, info)
        const activeLink = info.link.bind(identity)
        activeLink.fold(() => {
          const text = info.text.toOption().filter(isNotEmpty).getOr(url)
          editor.insertContent(editor.dom.createHTML('a', attrs, editor.dom.encode(text)))
        }, (link) => {
          const text = getTextToApply(link, url, info)
          setAll(link, attrs)
          text.each((newText) => {
            set$6(link, newText)
          })
        })
      })
    }
    var query = function (editor) {
      const start = Element$$1.fromDom(editor.selection.getStart())
      return closest$3(start, 'a')
    }
    const LinkBridge = {
      getInfo,
      applyInfo,
      query,
    }

    const platform$1 = PlatformDetection$1.detect()
    const preserve$1 = function (f, editor) {
      const rng = editor.selection.getRng()
      f()
      editor.selection.setRng(rng)
    }
    const forAndroid = function (editor, f) {
      const wrapper = platform$1.os.isAndroid() ? preserve$1 : apply
      wrapper(f, editor)
    }
    const RangePreserver = { forAndroid }

    const events$6 = function (name, eventHandlers) {
      const events = derive(eventHandlers)
      return create$1({
        fields: [strict$1('enabled')],
        name,
        active: { events: constant(events) },
      })
    }
    const config = function (name, eventHandlers) {
      const me = events$6(name, eventHandlers)
      return {
        key: name,
        value: {
          config: {},
          me,
          configAsRaw: constant({}),
          initialConfig: {},
          state: NoState,
        },
      }
    }

    const getCurrent = function (component, composeConfig, composeState) {
      return composeConfig.find(component)
    }

    const ComposeApis = /* #__PURE__ */Object.freeze({
      getCurrent,
    })

    const ComposeSchema = [strict$1('find')]

    const Composing = create$1({
      fields: ComposeSchema,
      name: 'composing',
      apis: ComposeApis,
    })

    const factory$1 = function (detail) {
      const _a = detail.dom; const { attributes } = _a; const domWithoutAttributes = __rest(_a, ['attributes'])
      return {
        uid: detail.uid,
        dom: __assign({
          tag: 'div',
          attributes: __assign({ role: 'presentation' }, attributes),
        }, domWithoutAttributes),
        components: detail.components,
        behaviours: get$6(detail.containerBehaviours),
        events: detail.events,
        domModification: detail.domModification,
        eventOrder: detail.eventOrder,
      }
    }
    const Container = single$2({
      name: 'Container',
      factory: factory$1,
      configFields: [
        defaulted$1('components', []),
        field$1('containerBehaviours', []),
        defaulted$1('events', {}),
        defaulted$1('domModification', {}),
        defaulted$1('eventOrder', {}),
      ],
    })

    const factory$2 = function (detail) {
      return {
        uid: detail.uid,
        dom: detail.dom,
        behaviours: SketchBehaviours.augment(detail.dataBehaviours, [
          Representing.config({
            store: {
              mode: 'memory',
              initialValue: detail.getInitialValue(),
            },
          }),
          Composing.config({ find: Option.some }),
        ]),
        events: derive([runOnAttached((component, simulatedEvent) => {
          Representing.setValue(component, detail.getInitialValue())
        })]),
      }
    }
    const DataField = single$2({
      name: 'DataField',
      factory: factory$2,
      configFields: [
        strict$1('uid'),
        strict$1('dom'),
        strict$1('getInitialValue'),
        SketchBehaviours.field('dataBehaviours', [
          Representing,
          Composing,
        ]),
      ],
    })

    const get$a = function (element) {
      return element.dom().value
    }
    const set$7 = function (element, value) {
      if (value === undefined) {
        throw new Error('Value.set was undefined')
      }
      element.dom().value = value
    }

    const schema$8 = constant([
      option('data'),
      defaulted$1('inputAttributes', {}),
      defaulted$1('inputStyles', {}),
      defaulted$1('tag', 'input'),
      defaulted$1('inputClasses', []),
      onHandler('onSetValue'),
      defaulted$1('styles', {}),
      defaulted$1('eventOrder', {}),
      field$1('inputBehaviours', [
        Representing,
        Focusing,
      ]),
      defaulted$1('selectOnFocus', true),
    ])
    const focusBehaviours = function (detail) {
      return derive$1([Focusing.config({
        onFocus: detail.selectOnFocus === false ? noop : function (component) {
          const input = component.element()
          const value = get$a(input)
          input.dom().setSelectionRange(0, value.length)
        },
      })])
    }
    const behaviours = function (detail) {
      return __assign({}, focusBehaviours(detail), augment(detail.inputBehaviours, [Representing.config({
        store: {
          mode: 'manual',
          initialValue: detail.data.getOr(undefined),
          getValue(input) {
            return get$a(input.element())
          },
          setValue(input, data) {
            const current = get$a(input.element())
            if (current !== data) {
              set$7(input.element(), data)
            }
          },
        },
        onSetValue: detail.onSetValue,
      })]))
    }
    const dom$3 = function (detail) {
      return {
        tag: detail.tag,
        attributes: __assign({ type: 'input' }, detail.inputAttributes),
        styles: detail.inputStyles,
        classes: detail.inputClasses,
      }
    }

    const factory$3 = function (detail, spec) {
      return {
        uid: detail.uid,
        dom: dom$3(detail),
        components: [],
        behaviours: behaviours(detail),
        eventOrder: detail.eventOrder,
      }
    }
    const Input = single$2({
      name: 'Input',
      configFields: schema$8(),
      factory: factory$3,
    })

    const exhibit$3 = function (base, tabConfig) {
      return nu$5({
        attributes: wrapAll$1([{
          key: tabConfig.tabAttr,
          value: 'true',
        }]),
      })
    }

    const ActiveTabstopping = /* #__PURE__ */Object.freeze({
      exhibit: exhibit$3,
    })

    const TabstopSchema = [defaulted$1('tabAttr', 'data-alloy-tabstop')]

    const Tabstopping = create$1({
      fields: TabstopSchema,
      name: 'tabstopping',
      active: ActiveTabstopping,
    })

    const clearInputBehaviour = 'input-clearing'
    const field$2 = function (name, placeholder) {
      const inputSpec = record(Input.sketch({
        inputAttributes: { placeholder },
        onSetValue(input$$1, data) {
          emit(input$$1, input())
        },
        inputBehaviours: derive$1([
          Composing.config({ find: Option.some }),
          Tabstopping.config({}),
          Keying.config({ mode: 'execution' }),
        ]),
        selectOnFocus: false,
      }))
      const buttonSpec = record(Button.sketch({
        dom: dom$2('<button class="${prefix}-input-container-x ${prefix}-icon-cancel-circle ${prefix}-icon"></button>'),
        action(button) {
          const input$$1 = inputSpec.get(button)
          Representing.setValue(input$$1, '')
        },
      }))
      return {
        name,
        spec: Container.sketch({
          dom: dom$2('<div class="${prefix}-input-container"></div>'),
          components: [
            inputSpec.asSpec(),
            buttonSpec.asSpec(),
          ],
          containerBehaviours: derive$1([
            Toggling.config({ toggleClass: Styles.resolve('input-container-empty') }),
            Composing.config({
              find(comp) {
                return Option.some(inputSpec.get(comp))
              },
            }),
            config(clearInputBehaviour, [run(input(), (iContainer) => {
              const input$$1 = inputSpec.get(iContainer)
              const val = Representing.getValue(input$$1)
              const f = val.length > 0 ? Toggling.off : Toggling.on
              f(iContainer)
            })]),
          ]),
        }),
      }
    }
    const hidden = function (name) {
      return {
        name,
        spec: DataField.sketch({
          dom: {
            tag: 'span',
            styles: { display: 'none' },
          },
          getInitialValue() {
            return Option.none()
          },
        }),
      }
    }

    const nativeDisabled = [
      'input',
      'button',
      'textarea',
    ]
    const onLoad$5 = function (component, disableConfig, disableState) {
      if (disableConfig.disabled) {
        disable(component, disableConfig, disableState)
      }
    }
    const hasNative = function (component) {
      return contains(nativeDisabled, name(component.element()))
    }
    const nativeIsDisabled = function (component) {
      return has$1(component.element(), 'disabled')
    }
    const nativeDisable = function (component) {
      set(component.element(), 'disabled', 'disabled')
    }
    const nativeEnable = function (component) {
      remove$1(component.element(), 'disabled')
    }
    const ariaIsDisabled = function (component) {
      return get$1(component.element(), 'aria-disabled') === 'true'
    }
    const ariaDisable = function (component) {
      set(component.element(), 'aria-disabled', 'true')
    }
    const ariaEnable = function (component) {
      set(component.element(), 'aria-disabled', 'false')
    }
    var disable = function (component, disableConfig, disableState) {
      disableConfig.disableClass.each((disableClass) => {
        add$2(component.element(), disableClass)
      })
      const f = hasNative(component) ? nativeDisable : ariaDisable
      f(component)
    }
    const enable = function (component, disableConfig, disableState) {
      disableConfig.disableClass.each((disableClass) => {
        remove$4(component.element(), disableClass)
      })
      const f = hasNative(component) ? nativeEnable : ariaEnable
      f(component)
    }
    const isDisabled = function (component) {
      return hasNative(component) ? nativeIsDisabled(component) : ariaIsDisabled(component)
    }

    const DisableApis = /* #__PURE__ */Object.freeze({
      enable,
      disable,
      isDisabled,
      onLoad: onLoad$5,
    })

    const exhibit$4 = function (base, disableConfig, disableState) {
      return nu$5({ classes: disableConfig.disabled ? disableConfig.disableClass.map(pure).getOr([]) : [] })
    }
    const events$7 = function (disableConfig, disableState) {
      return derive([
        abort(execute(), (component, simulatedEvent) => isDisabled(component)),
        loadEvent(disableConfig, disableState, onLoad$5),
      ])
    }

    const ActiveDisable = /* #__PURE__ */Object.freeze({
      exhibit: exhibit$4,
      events: events$7,
    })

    const DisableSchema = [
      defaulted$1('disabled', false),
      option('disableClass'),
    ]

    const Disabling = create$1({
      fields: DisableSchema,
      name: 'disabling',
      active: ActiveDisable,
      apis: DisableApis,
    })

    const owner$1 = 'form'
    const schema$9 = [field$1('formBehaviours', [Representing])]
    const getPartName = function (name) {
      return `<alloy.field.${name}>`
    }
    const sketch$6 = function (fSpec) {
      const parts = (function () {
        const record = []
        const field = function (name, config) {
          record.push(name)
          return generateOne(owner$1, getPartName(name), config)
        }
        return {
          field,
          record() {
            return record
          },
        }
      }())
      const spec = fSpec(parts)
      const partNames = parts.record()
      const fieldParts = map$1(partNames, (n) => required({
        name: n,
        pname: getPartName(n),
      }))
      return composite(owner$1, schema$9, fieldParts, make, spec)
    }
    const toResult$1 = function (o, e) {
      return o.fold(() => Result.error(e), Result.value)
    }
    var make = function (detail, components$$1, spec) {
      return {
        uid: detail.uid,
        dom: detail.dom,
        components: components$$1,
        behaviours: augment(detail.formBehaviours, [Representing.config({
          store: {
            mode: 'manual',
            getValue(form) {
              const resPs = getAllParts(form, detail)
              return map(resPs, (resPThunk, pName) => resPThunk().bind((v) => {
                const opt = Composing.getCurrent(v)
                return toResult$1(opt, 'missing current')
              }).map(Representing.getValue))
            },
            setValue(form, values$$1) {
              each(values$$1, (newValue, key) => {
                getPart(form, detail, key).each((wrapper) => {
                  Composing.getCurrent(wrapper).each((field) => {
                    Representing.setValue(field, newValue)
                  })
                })
              })
            },
          },
        })]),
        apis: {
          getField(form, key) {
            return getPart(form, detail, key).bind(Composing.getCurrent)
          },
        },
      }
    }
    const Form = {
      getField: makeApi((apis, component, key) => apis.getField(component, key)),
      sketch: sketch$6,
    }

    const api$2 = function () {
      const subject = Cell(Option.none())
      const revoke = function () {
        subject.get().each((s) => {
          s.destroy()
        })
      }
      const clear = function () {
        revoke()
        subject.set(Option.none())
      }
      const set = function (s) {
        revoke()
        subject.set(Option.some(s))
      }
      const run = function (f) {
        subject.get().each(f)
      }
      const isSet = function () {
        return subject.get().isSome()
      }
      return {
        clear,
        isSet,
        set,
        run,
      }
    }
    const value$3 = function () {
      const subject = Cell(Option.none())
      const clear = function () {
        subject.set(Option.none())
      }
      const set = function (s) {
        subject.set(Option.some(s))
      }
      const on = function (f) {
        subject.get().each(f)
      }
      const isSet = function () {
        return subject.get().isSome()
      }
      return {
        clear,
        set,
        isSet,
        on,
      }
    }

    const SWIPING_LEFT = 1
    const SWIPING_RIGHT = -1
    const SWIPING_NONE = 0
    const init$3 = function (xValue) {
      return {
        xValue,
        points: [],
      }
    }
    const move$1 = function (model, xValue) {
      if (xValue === model.xValue) {
        return model
      }
      const currentDirection = xValue - model.xValue > 0 ? SWIPING_LEFT : SWIPING_RIGHT
      const newPoint = {
        direction: currentDirection,
        xValue,
      }
      const priorPoints = (function () {
        if (model.points.length === 0) {
          return []
        }
        const prev = model.points[model.points.length - 1]
        return prev.direction === currentDirection ? model.points.slice(0, model.points.length - 1) : model.points
      }())
      return {
        xValue,
        points: priorPoints.concat([newPoint]),
      }
    }
    const complete = function (model) {
      if (model.points.length === 0) {
        return SWIPING_NONE
      }
      const firstDirection = model.points[0].direction
      const lastDirection = model.points[model.points.length - 1].direction
      return firstDirection === SWIPING_RIGHT && lastDirection === SWIPING_RIGHT ? SWIPING_RIGHT : firstDirection === SWIPING_LEFT && lastDirection === SWIPING_LEFT ? SWIPING_LEFT : SWIPING_NONE
    }
    const SwipingModel = {
      init: init$3,
      move: move$1,
      complete,
    }

    const sketch$7 = function (rawSpec) {
      const navigateEvent = 'navigateEvent'
      const wrapperAdhocEvents = 'serializer-wrapper-events'
      const formAdhocEvents = 'form-events'
      const schema = objOf([
        strict$1('fields'),
        defaulted$1('maxFieldIndex', rawSpec.fields.length - 1),
        strict$1('onExecute'),
        strict$1('getInitialValue'),
        state$1('state', () => ({
          dialogSwipeState: value$3(),
          currentScreen: Cell(0),
        })),
      ])
      const spec$$1 = asRawOrDie('SerialisedDialog', schema, rawSpec)
      const navigationButton = function (direction, directionName, enabled) {
        return Button.sketch({
          dom: dom$2(`<span class="\${prefix}-icon-${directionName} \${prefix}-icon"></span>`),
          action(button) {
            emitWith(button, navigateEvent, { direction })
          },
          buttonBehaviours: derive$1([Disabling.config({
            disableClass: Styles.resolve('toolbar-navigation-disabled'),
            disabled: !enabled,
          })]),
        })
      }
      const reposition = function (dialog, message) {
        descendant$2(dialog.element(), `.${Styles.resolve('serialised-dialog-chain')}`).each((parent) => {
          set$3(parent, 'left', `${-spec$$1.state.currentScreen.get() * message.width}px`)
        })
      }
      const navigate = function (dialog, direction) {
        const screens = descendants$1(dialog.element(), `.${Styles.resolve('serialised-dialog-screen')}`)
        descendant$2(dialog.element(), `.${Styles.resolve('serialised-dialog-chain')}`).each((parent) => {
          if (spec$$1.state.currentScreen.get() + direction >= 0 && spec$$1.state.currentScreen.get() + direction < screens.length) {
            getRaw(parent, 'left').each((left) => {
              const currentLeft = parseInt(left, 10)
              const w = get$7(screens[0])
              set$3(parent, 'left', `${currentLeft - direction * w}px`)
            })
            spec$$1.state.currentScreen.set(spec$$1.state.currentScreen.get() + direction)
          }
        })
      }
      const focusInput = function (dialog) {
        const inputs = descendants$1(dialog.element(), 'input')
        const optInput = Option.from(inputs[spec$$1.state.currentScreen.get()])
        optInput.each((input$$1) => {
          dialog.getSystem().getByDom(input$$1).each((inputComp) => {
            dispatchFocus(dialog, inputComp.element())
          })
        })
        const dotitems = memDots.get(dialog)
        Highlighting.highlightAt(dotitems, spec$$1.state.currentScreen.get())
      }
      const resetState = function () {
        spec$$1.state.currentScreen.set(0)
        spec$$1.state.dialogSwipeState.clear()
      }
      const memForm = record(Form.sketch((parts) => ({
        dom: dom$2('<div class="${prefix}-serialised-dialog"></div>'),
        components: [Container.sketch({
          dom: dom$2('<div class="${prefix}-serialised-dialog-chain" style="left: 0px; position: absolute;"></div>'),
          components: map$1(spec$$1.fields, (field$$1, i) => i <= spec$$1.maxFieldIndex ? Container.sketch({
            dom: dom$2('<div class="${prefix}-serialised-dialog-screen"></div>'),
            components: [
              navigationButton(-1, 'previous', i > 0),
              parts.field(field$$1.name, field$$1.spec),
              navigationButton(+1, 'next', i < spec$$1.maxFieldIndex),
            ],
          }) : parts.field(field$$1.name, field$$1.spec)),
        })],
        formBehaviours: derive$1([
          Receivers.orientation((dialog, message) => {
            reposition(dialog, message)
          }),
          Keying.config({
            mode: 'special',
            focusIn(dialog) {
              focusInput(dialog)
            },
            onTab(dialog) {
              navigate(dialog, +1)
              return Option.some(true)
            },
            onShiftTab(dialog) {
              navigate(dialog, -1)
              return Option.some(true)
            },
          }),
          config(formAdhocEvents, [
            runOnAttached((dialog, simulatedEvent) => {
              resetState()
              const dotitems = memDots.get(dialog)
              Highlighting.highlightFirst(dotitems)
              spec$$1.getInitialValue(dialog).each((v) => {
                Representing.setValue(dialog, v)
              })
            }),
            runOnExecute(spec$$1.onExecute),
            run(transitionend(), (dialog, simulatedEvent) => {
              const event = simulatedEvent.event()
              if (event.raw().propertyName === 'left') {
                focusInput(dialog)
              }
            }),
            run(navigateEvent, (dialog, simulatedEvent) => {
              const event = simulatedEvent.event()
              const direction = event.direction()
              navigate(dialog, direction)
            }),
          ]),
        ]),
      })))
      var memDots = record({
        dom: dom$2('<div class="${prefix}-dot-container"></div>'),
        behaviours: derive$1([Highlighting.config({
          highlightClass: Styles.resolve('dot-active'),
          itemClass: Styles.resolve('dot-item'),
        })]),
        components: bind(spec$$1.fields, (_f, i) => i <= spec$$1.maxFieldIndex ? [spec('<div class="${prefix}-dot-item ${prefix}-icon-full-dot ${prefix}-icon"></div>')] : []),
      })
      return {
        dom: dom$2('<div class="${prefix}-serializer-wrapper"></div>'),
        components: [
          memForm.asSpec(),
          memDots.asSpec(),
        ],
        behaviours: derive$1([
          Keying.config({
            mode: 'special',
            focusIn(wrapper) {
              const form = memForm.get(wrapper)
              Keying.focusIn(form)
            },
          }),
          config(wrapperAdhocEvents, [
            run(touchstart(), (wrapper, simulatedEvent) => {
              const event = simulatedEvent.event()
              spec$$1.state.dialogSwipeState.set(SwipingModel.init(event.raw().touches[0].clientX))
            }),
            run(touchmove(), (wrapper, simulatedEvent) => {
              const event = simulatedEvent.event()
              spec$$1.state.dialogSwipeState.on((state) => {
                simulatedEvent.event().prevent()
                spec$$1.state.dialogSwipeState.set(SwipingModel.move(state, event.raw().touches[0].clientX))
              })
            }),
            run(touchend(), (wrapper) => {
              spec$$1.state.dialogSwipeState.on((state) => {
                const dialog = memForm.get(wrapper)
                const direction = -1 * SwipingModel.complete(state)
                navigate(dialog, direction)
              })
            }),
          ]),
        ]),
      }
    }

    const getGroups = cached((realm, editor) => [{
      label: 'the link group',
      items: [sketch$7({
        fields: [
          field$2('url', 'Type or paste URL'),
          field$2('text', 'Link text'),
          field$2('title', 'Link title'),
          field$2('target', 'Link target'),
          hidden('link'),
        ],
        maxFieldIndex: [
          'url',
          'text',
          'title',
          'target',
        ].length - 1,
        getInitialValue() {
          return Option.some(LinkBridge.getInfo(editor))
        },
        onExecute(dialog) {
          const info = Representing.getValue(dialog)
          LinkBridge.applyInfo(editor, info)
          realm.restoreToolbar()
          editor.focus()
        },
      })],
    }])
    const sketch$8 = function (realm, editor) {
      return Buttons.forToolbarStateAction(editor, 'link', 'link', () => {
        const groups = getGroups(realm, editor)
        realm.setContextToolbar(groups)
        RangePreserver.forAndroid(editor, () => {
          realm.focusToolbar()
        })
        LinkBridge.query(editor).each((link) => {
          editor.selection.select(link.dom())
        })
      })
    }

    const DefaultStyleFormats = [
      {
        title: 'Headings',
        items: [
          {
            title: 'Heading 1',
            format: 'h1',
          },
          {
            title: 'Heading 2',
            format: 'h2',
          },
          {
            title: 'Heading 3',
            format: 'h3',
          },
          {
            title: 'Heading 4',
            format: 'h4',
          },
          {
            title: 'Heading 5',
            format: 'h5',
          },
          {
            title: 'Heading 6',
            format: 'h6',
          },
        ],
      },
      {
        title: 'Inline',
        items: [
          {
            title: 'Bold',
            icon: 'bold',
            format: 'bold',
          },
          {
            title: 'Italic',
            icon: 'italic',
            format: 'italic',
          },
          {
            title: 'Underline',
            icon: 'underline',
            format: 'underline',
          },
          {
            title: 'Strikethrough',
            icon: 'strikethrough',
            format: 'strikethrough',
          },
          {
            title: 'Superscript',
            icon: 'superscript',
            format: 'superscript',
          },
          {
            title: 'Subscript',
            icon: 'subscript',
            format: 'subscript',
          },
          {
            title: 'Code',
            icon: 'code',
            format: 'code',
          },
        ],
      },
      {
        title: 'Blocks',
        items: [
          {
            title: 'Paragraph',
            format: 'p',
          },
          {
            title: 'Blockquote',
            format: 'blockquote',
          },
          {
            title: 'Div',
            format: 'div',
          },
          {
            title: 'Pre',
            format: 'pre',
          },
        ],
      },
      {
        title: 'Alignment',
        items: [
          {
            title: 'Left',
            icon: 'alignleft',
            format: 'alignleft',
          },
          {
            title: 'Center',
            icon: 'aligncenter',
            format: 'aligncenter',
          },
          {
            title: 'Right',
            icon: 'alignright',
            format: 'alignright',
          },
          {
            title: 'Justify',
            icon: 'alignjustify',
            format: 'alignjustify',
          },
        ],
      },
    ]

    const isRecursive = function (component, originator, target) {
      return eq(originator, component.element()) && !eq(originator, target)
    }
    const events$8 = derive([can(focus$1(), (component, simulatedEvent) => {
      const originator = simulatedEvent.event().originator()
      const target = simulatedEvent.event().target()
      if (isRecursive(component, originator, target)) {
        console.warn(`${focus$1()} did not get interpreted by the desired target. ` + `\nOriginator: ${element(originator)}\nTarget: ${element(target)}\nCheck the ${focus$1()} event handlers`)
        return false
      }
      return true
    })])

    const DefaultEvents = /* #__PURE__ */Object.freeze({
      events: events$8,
    })

    const make$1 = identity

    const NoContextApi = function (getComp) {
      const fail = function (event) {
        return function () {
          throw new Error(`The component must be in a context to send: ${event}\n${element(getComp().element())} is not in context.`)
        }
      }
      return {
        debugInfo: constant('fake'),
        triggerEvent: fail('triggerEvent'),
        triggerFocus: fail('triggerFocus'),
        triggerEscape: fail('triggerEscape'),
        build: fail('build'),
        addToWorld: fail('addToWorld'),
        removeFromWorld: fail('removeFromWorld'),
        addToGui: fail('addToGui'),
        removeFromGui: fail('removeFromGui'),
        getByUid: fail('getByUid'),
        getByDom: fail('getByDom'),
        broadcast: fail('broadcast'),
        broadcastOn: fail('broadcastOn'),
        broadcastEvent: fail('broadcastEvent'),
        isConnected: constant(false),
      }
    }
    const singleton = NoContextApi()

    const generateFrom = function (spec, all) {
      const schema = map$1(all, (a) => optionObjOf(a.name(), [
        strict$1('config'),
        defaulted$1('state', NoState),
      ]))
      const validated = asRaw('component.behaviours', objOf(schema), spec.behaviours).fold((errInfo) => {
        throw new Error(`${formatError(errInfo)}\nComplete spec:\n${Json.stringify(spec, null, 2)}`)
      }, (v) => v)
      return {
        list: all,
        data: map(validated, (optBlobThunk) => {
          const optBlob = optBlobThunk
          const output = optBlob.map((blob) => ({
            config: blob.config,
            state: blob.state.init(blob.config),
          }))
          return function () {
            return output
          }
        }),
      }
    }
    const getBehaviours = function (bData) {
      return bData.list
    }
    const getData = function (bData) {
      return bData.data
    }

    const byInnerKey = function (data, tuple) {
      const r = {}
      each(data, (detail, key) => {
        each(detail, (value, indexKey) => {
          const chain = readOr$1(indexKey, [])(r)
          r[indexKey] = chain.concat([tuple(key, value)])
        })
      })
      return r
    }

    const combine$1 = function (info, baseMod, behaviours, base) {
      const modsByBehaviour = __assign({}, baseMod)
      each$1(behaviours, (behaviour) => {
        modsByBehaviour[behaviour.name()] = behaviour.exhibit(info, base)
      })
      const nameAndMod = function (name, modification) {
        return {
          name,
          modification,
        }
      }
      const byAspect = byInnerKey(modsByBehaviour, nameAndMod)
      const combineObjects = function (objects) {
        return foldr(objects, (b, a) => __assign({}, a.modification, b), {})
      }
      const combinedClasses = foldr(byAspect.classes, (b, a) => a.modification.concat(b), [])
      const combinedAttributes = combineObjects(byAspect.attributes)
      const combinedStyles = combineObjects(byAspect.styles)
      return nu$5({
        classes: combinedClasses,
        attributes: combinedAttributes,
        styles: combinedStyles,
      })
    }

    const sortKeys = function (label, keyName, array, order) {
      const sliced = array.slice(0)
      try {
        const sorted = sliced.sort((a, b) => {
          const aKey = a[keyName]()
          const bKey = b[keyName]()
          const aIndex = order.indexOf(aKey)
          const bIndex = order.indexOf(bKey)
          if (aIndex === -1) {
            throw new Error(`The ordering for ${label} does not have an entry for ${aKey}.\nOrder specified: ${Json.stringify(order, null, 2)}`)
          }
          if (bIndex === -1) {
            throw new Error(`The ordering for ${label} does not have an entry for ${bKey}.\nOrder specified: ${Json.stringify(order, null, 2)}`)
          }
          if (aIndex < bIndex) {
            return -1
          } if (bIndex < aIndex) {
            return 1
          }
          return 0
        })
        return Result.value(sorted)
      } catch (err) {
        return Result.error([err])
      }
    }

    const uncurried = function (handler, purpose) {
      return {
        handler,
        purpose: constant(purpose),
      }
    }
    const curried = function (handler, purpose) {
      return {
        cHandler: handler,
        purpose: constant(purpose),
      }
    }
    const curryArgs = function (descHandler, extraArgs) {
      return curried(curry.apply(undefined, [descHandler.handler].concat(extraArgs)), descHandler.purpose())
    }
    const getCurried = function (descHandler) {
      return descHandler.cHandler
    }

    const behaviourTuple = function (name, handler) {
      return {
        name: constant(name),
        handler: constant(handler),
      }
    }
    const nameToHandlers = function (behaviours, info) {
      const r = {}
      each$1(behaviours, (behaviour) => {
        r[behaviour.name()] = behaviour.handlers(info)
      })
      return r
    }
    const groupByEvents = function (info, behaviours, base) {
      const behaviourEvents = __assign({}, base, nameToHandlers(behaviours, info))
      return byInnerKey(behaviourEvents, behaviourTuple)
    }
    const combine$2 = function (info, eventOrder, behaviours, base) {
      const byEventName = groupByEvents(info, behaviours, base)
      return combineGroups(byEventName, eventOrder)
    }
    const assemble = function (rawHandler) {
      const handler = read(rawHandler)
      return function (component, simulatedEvent) {
        const rest = []
        for (let _i = 2; _i < arguments.length; _i++) {
          rest[_i - 2] = arguments[_i]
        }
        const args = [
          component,
          simulatedEvent,
        ].concat(rest)
        if (handler.abort.apply(undefined, args)) {
          simulatedEvent.stop()
        } else if (handler.can.apply(undefined, args)) {
          handler.run.apply(undefined, args)
        }
      }
    }
    const missingOrderError = function (eventName, tuples) {
      return Result.error([`The event (${eventName}) has more than one behaviour that listens to it.\nWhen this occurs, you must ` + `specify an event ordering for the behaviours in your spec (e.g. [ "listing", "toggling" ]).\nThe behaviours that ` + `can trigger it are: ${Json.stringify(map$1(tuples, (c) => c.name()), null, 2)}`])
    }
    const fuse$1 = function (tuples, eventOrder, eventName) {
      const order = eventOrder[eventName]
      if (!order) {
        return missingOrderError(eventName, tuples)
      }
      return sortKeys(`Event: ${eventName}`, 'name', tuples, order).map((sortedTuples) => {
        const handlers = map$1(sortedTuples, (tuple) => tuple.handler())
        return fuse(handlers)
      })
    }
    var combineGroups = function (byEventName, eventOrder) {
      const r = mapToArray(byEventName, (tuples, eventName) => {
        const combined = tuples.length === 1 ? Result.value(tuples[0].handler()) : fuse$1(tuples, eventOrder, eventName)
        return combined.map((handler) => {
          const assembled = assemble(handler)
          const purpose = tuples.length > 1 ? filter(eventOrder, (o) => contains(tuples, (t) => t.name() === o)).join(' > ') : tuples[0].name()
          return wrap$2(eventName, uncurried(assembled, purpose))
        })
      })
      return consolidate(r, {})
    }

    const toInfo = function (spec) {
      return asRaw('custom.definition', objOf([
        field('dom', 'dom', strict(), objOf([
          strict$1('tag'),
          defaulted$1('styles', {}),
          defaulted$1('classes', []),
          defaulted$1('attributes', {}),
          option('value'),
          option('innerHtml'),
        ])),
        strict$1('components'),
        strict$1('uid'),
        defaulted$1('events', {}),
        defaulted$1('apis', {}),
        field('eventOrder', 'eventOrder', mergeWith({
          'alloy.execute': [
            'disabling',
            'alloy.base.behaviour',
            'toggling',
            'typeaheadevents',
          ],
          'alloy.focus': [
            'alloy.base.behaviour',
            'focusing',
            'keying',
          ],
          'alloy.system.init': [
            'alloy.base.behaviour',
            'disabling',
            'toggling',
            'representing',
          ],
          input: [
            'alloy.base.behaviour',
            'representing',
            'streaming',
            'invalidating',
          ],
          'alloy.system.detached': [
            'alloy.base.behaviour',
            'representing',
          ],
          mousedown: [
            'focusing',
            'alloy.base.behaviour',
            'item-type-events',
          ],
        }), anyValue$1()),
        option('domModification'),
      ]), spec)
    }
    const toDefinition = function (detail) {
      return __assign({}, detail.dom, {
        uid: detail.uid,
        domChildren: map$1(detail.components, (comp) => comp.element()),
      })
    }
    const toModification = function (detail) {
      return detail.domModification.fold(() => nu$5({}), nu$5)
    }
    const toEvents = function (info) {
      return info.events
    }

    const add$3 = function (element, classes) {
      each$1(classes, (x) => {
        add$2(element, x)
      })
    }
    const remove$6 = function (element, classes) {
      each$1(classes, (x) => {
        remove$4(element, x)
      })
    }

    const renderToDom = function (definition) {
      const subject = Element$$1.fromTag(definition.tag)
      setAll(subject, definition.attributes)
      add$3(subject, definition.classes)
      setAll$1(subject, definition.styles)
      definition.innerHtml.each((html) => set$1(subject, html))
      const children = definition.domChildren
      append$1(subject, children)
      definition.value.each((value) => {
        set$7(subject, value)
      })
      if (!definition.uid) {
        debugger
      }
      writeOnly(subject, definition.uid)
      return subject
    }

    const getBehaviours$1 = function (spec) {
      const behaviours = readOr$1('behaviours', {})(spec)
      const keys$$1 = filter(keys(behaviours), (k) => behaviours[k] !== undefined)
      return map$1(keys$$1, (k) => behaviours[k].me)
    }
    const generateFrom$1 = function (spec, all) {
      return generateFrom(spec, all)
    }
    const generate$4 = function (spec) {
      const all = getBehaviours$1(spec)
      return generateFrom$1(spec, all)
    }

    const getDomDefinition = function (info, bList, bData) {
      const definition = toDefinition(info)
      const infoModification = toModification(info)
      const baseModification = { 'alloy.base.modification': infoModification }
      const modification = bList.length > 0 ? combine$1(bData, baseModification, bList, definition) : infoModification
      return merge$1(definition, modification)
    }
    const getEvents = function (info, bList, bData) {
      const baseEvents = { 'alloy.base.behaviour': toEvents(info) }
      return combine$2(bData, info.eventOrder, bList, baseEvents).getOrDie()
    }
    const build = function (spec) {
      const getMe = function () {
        return me
      }
      const systemApi = Cell(singleton)
      const info = getOrDie$1(toInfo(spec))
      const bBlob = generate$4(spec)
      const bList = getBehaviours(bBlob)
      const bData = getData(bBlob)
      const modDefinition = getDomDefinition(info, bList, bData)
      const item = renderToDom(modDefinition)
      const events = getEvents(info, bList, bData)
      const subcomponents = Cell(info.components)
      const connect = function (newApi) {
        systemApi.set(newApi)
      }
      const disconnect = function () {
        systemApi.set(NoContextApi(getMe))
      }
      const syncComponents = function () {
        const children$$1 = children(item)
        const subs = bind(children$$1, (child$$1) => systemApi.get().getByDom(child$$1).fold(() => [], (c) => [c]))
        subcomponents.set(subs)
      }
      const config = function (behaviour) {
        const b = bData
        const f = isFunction(b[behaviour.name()]) ? b[behaviour.name()] : function () {
          throw new Error(`Could not find ${behaviour.name()} in ${Json.stringify(spec, null, 2)}`)
        }
        return f()
      }
      const hasConfigured = function (behaviour) {
        return isFunction(bData[behaviour.name()])
      }
      const getApis = function () {
        return info.apis
      }
      const readState = function (behaviourName) {
        return bData[behaviourName]().map((b) => b.state.readState()).getOr('not enabled')
      }
      var me = {
        getSystem: systemApi.get,
        config,
        hasConfigured,
        spec: constant(spec),
        readState,
        getApis,
        connect,
        disconnect,
        element: constant(item),
        syncComponents,
        components: subcomponents.get,
        events: constant(events),
      }
      return me
    }

    const buildSubcomponents = function (spec) {
      const components = readOr$1('components', [])(spec)
      return map$1(components, build$1)
    }
    const buildFromSpec = function (userSpec) {
      const _a = make$1(userSpec); const specEvents = _a.events; const spec = __rest(_a, ['events'])
      const components = buildSubcomponents(spec)
      const completeSpec = __assign({}, spec, {
        events: __assign({}, DefaultEvents, specEvents),
        components,
      })
      return Result.value(build(completeSpec))
    }
    const text = function (textContent) {
      const element = Element$$1.fromText(textContent)
      return external$1({ element })
    }
    var external$1 = function (spec) {
      const extSpec = asRawOrDie('external.component', objOfOnly([
        strict$1('element'),
        option('uid'),
      ]), spec)
      const systemApi = Cell(NoContextApi())
      const connect = function (newApi) {
        systemApi.set(newApi)
      }
      const disconnect = function () {
        systemApi.set(NoContextApi(() => me))
      }
      extSpec.uid.each((uid) => {
        writeOnly(extSpec.element, uid)
      })
      var me = {
        getSystem: systemApi.get,
        config: Option.none,
        hasConfigured: constant(false),
        connect,
        disconnect,
        getApis() {
          return {}
        },
        element: constant(extSpec.element),
        spec: constant(spec),
        readState: constant('No state'),
        syncComponents: noop,
        components: constant([]),
        events: constant({}),
      }
      return premade(me)
    }
    const uids = generate$3
    var build$1 = function (spec) {
      return getPremade(spec).fold(() => {
        const userSpecWithUid = spec.hasOwnProperty('uid') ? spec : __assign({ uid: uids('') }, spec)
        return buildFromSpec(userSpecWithUid).getOrDie()
      }, (prebuilt) => prebuilt)
    }
    const premade$1 = premade

    const hoverEvent = 'alloy.item-hover'
    const focusEvent = 'alloy.item-focus'
    const onHover = function (item) {
      if (search(item.element()).isNone() || Focusing.isFocused(item)) {
        if (!Focusing.isFocused(item)) {
          Focusing.focus(item)
        }
        emitWith(item, hoverEvent, { item })
      }
    }
    const onFocus = function (item) {
      emitWith(item, focusEvent, { item })
    }
    const hover = constant(hoverEvent)
    const focus$4 = constant(focusEvent)

    const builder = function (detail) {
      return {
        dom: detail.dom,
        domModification: __assign({}, detail.domModification, { attributes: __assign({ role: detail.toggling.isSome() ? 'menuitemcheckbox' : 'menuitem' }, detail.domModification.attributes, { 'aria-haspopup': detail.hasSubmenu }, detail.hasSubmenu ? { 'aria-expanded': false } : {}) }),
        behaviours: SketchBehaviours.augment(detail.itemBehaviours, [
          detail.toggling.fold(Toggling.revoke, (tConfig) => Toggling.config(__assign({ aria: { mode: 'checked' } }, tConfig))),
          Focusing.config({
            ignore: detail.ignoreFocus,
            stopMousedown: detail.ignoreFocus,
            onFocus(component) {
              onFocus(component)
            },
          }),
          Keying.config({ mode: 'execution' }),
          Representing.config({
            store: {
              mode: 'memory',
              initialValue: detail.data,
            },
          }),
          config('item-type-events', [
            run(tapOrClick(), emitExecute),
            cutter(mousedown()),
            run(mouseover(), onHover),
            run(focusItem(), Focusing.focus),
          ]),
        ]),
        components: detail.components,
        eventOrder: detail.eventOrder,
      }
    }
    const schema$a = [
      strict$1('data'),
      strict$1('components'),
      strict$1('dom'),
      defaulted$1('hasSubmenu', false),
      option('toggling'),
      SketchBehaviours.field('itemBehaviours', [
        Toggling,
        Focusing,
        Keying,
        Representing,
      ]),
      defaulted$1('ignoreFocus', false),
      defaulted$1('domModification', {}),
      output$1('builder', builder),
      defaulted$1('eventOrder', {}),
    ]

    const builder$1 = function (detail) {
      return {
        dom: detail.dom,
        components: detail.components,
        events: derive([stopper(focusItem())]),
      }
    }
    const schema$b = [
      strict$1('dom'),
      strict$1('components'),
      output$1('builder', builder$1),
    ]

    const owner$2 = function () {
      return 'item-widget'
    }
    const parts = constant([required({
      name: 'widget',
      overrides(detail) {
        return {
          behaviours: derive$1([Representing.config({
            store: {
              mode: 'manual',
              getValue(component) {
                return detail.data
              },
              setValue() {
              },
            },
          })]),
        }
      },
    })])

    const builder$2 = function (detail) {
      const subs = substitutes(owner$2(), detail, parts())
      const components$$1 = components(owner$2(), detail, subs.internals())
      const focusWidget = function (component) {
        return getPart(component, detail, 'widget').map((widget) => {
          Keying.focusIn(widget)
          return widget
        })
      }
      const onHorizontalArrow = function (component, simulatedEvent) {
        return inside(simulatedEvent.event().target()) ? Option.none() : (function () {
          if (detail.autofocus) {
            simulatedEvent.setSource(component.element())
            return Option.none()
          }
          return Option.none()
        }())
      }
      return {
        dom: detail.dom,
        components: components$$1,
        domModification: detail.domModification,
        events: derive([
          runOnExecute((component, simulatedEvent) => {
            focusWidget(component).each((widget) => {
              simulatedEvent.stop()
            })
          }),
          run(mouseover(), onHover),
          run(focusItem(), (component, simulatedEvent) => {
            if (detail.autofocus) {
              focusWidget(component)
            } else {
              Focusing.focus(component)
            }
          }),
        ]),
        behaviours: SketchBehaviours.augment(detail.widgetBehaviours, [
          Representing.config({
            store: {
              mode: 'memory',
              initialValue: detail.data,
            },
          }),
          Focusing.config({
            ignore: detail.ignoreFocus,
            onFocus(component) {
              onFocus(component)
            },
          }),
          Keying.config({
            mode: 'special',
            focusIn: detail.autofocus ? function (component) {
              focusWidget(component)
            } : revoke(),
            onLeft: onHorizontalArrow,
            onRight: onHorizontalArrow,
            onEscape(component, simulatedEvent) {
              if (!Focusing.isFocused(component) && !detail.autofocus) {
                Focusing.focus(component)
                return Option.some(true)
              } if (detail.autofocus) {
                simulatedEvent.setSource(component.element())
                return Option.none()
              }
              return Option.none()
            },
          }),
        ]),
      }
    }
    const schema$c = [
      strict$1('uid'),
      strict$1('data'),
      strict$1('components'),
      strict$1('dom'),
      defaulted$1('autofocus', false),
      defaulted$1('ignoreFocus', false),
      SketchBehaviours.field('widgetBehaviours', [
        Representing,
        Focusing,
        Keying,
      ]),
      defaulted$1('domModification', {}),
      defaultUidsSchema(parts()),
      output$1('builder', builder$2),
    ]

    const itemSchema$1 = choose$1('type', {
      widget: schema$c,
      item: schema$a,
      separator: schema$b,
    })
    const configureGrid = function (detail, movementInfo) {
      return {
        mode: 'flatgrid',
        selector: `.${detail.markers.item}`,
        initSize: {
          numColumns: movementInfo.initSize.numColumns,
          numRows: movementInfo.initSize.numRows,
        },
        focusManager: detail.focusManager,
      }
    }
    const configureMatrix = function (detail, movementInfo) {
      return {
        mode: 'matrix',
        selectors: {
          row: movementInfo.rowSelector,
          cell: `.${detail.markers.item}`,
        },
        focusManager: detail.focusManager,
      }
    }
    const configureMenu = function (detail, movementInfo) {
      return {
        mode: 'menu',
        selector: `.${detail.markers.item}`,
        moveOnTab: movementInfo.moveOnTab,
        focusManager: detail.focusManager,
      }
    }
    const parts$1 = constant([group({
      factory: {
        sketch(spec) {
          const itemInfo = asRawOrDie('menu.spec item', itemSchema$1, spec)
          return itemInfo.builder(itemInfo)
        },
      },
      name: 'items',
      unit: 'item',
      defaults(detail, u) {
        return u.hasOwnProperty('uid') ? u : __assign({}, u, { uid: generate$3('item') })
      },
      overrides(detail, u) {
        return {
          type: u.type,
          ignoreFocus: detail.fakeFocus,
          domModification: { classes: [detail.markers.item] },
        }
      },
    })])
    const schema$d = constant([
      strict$1('value'),
      strict$1('items'),
      strict$1('dom'),
      strict$1('components'),
      defaulted$1('eventOrder', {}),
      field$1('menuBehaviours', [
        Highlighting,
        Representing,
        Composing,
        Keying,
      ]),
      defaultedOf('movement', {
        mode: 'menu',
        moveOnTab: true,
      }, choose$1('mode', {
        grid: [
          initSize(),
          output$1('config', configureGrid),
        ],
        matrix: [
          output$1('config', configureMatrix),
          strict$1('rowSelector'),
        ],
        menu: [
          defaulted$1('moveOnTab', true),
          output$1('config', configureMenu),
        ],
      })),
      itemMarkers(),
      defaulted$1('fakeFocus', false),
      defaulted$1('focusManager', dom()),
      onHandler('onHighlight'),
    ])

    const focus$5 = constant('alloy.menu-focus')

    const make$2 = function (detail, components, spec, externals) {
      return {
        uid: detail.uid,
        dom: detail.dom,
        markers: detail.markers,
        behaviours: augment(detail.menuBehaviours, [
          Highlighting.config({
            highlightClass: detail.markers.selectedItem,
            itemClass: detail.markers.item,
            onHighlight: detail.onHighlight,
          }),
          Representing.config({
            store: {
              mode: 'memory',
              initialValue: detail.value,
            },
          }),
          Composing.config({ find: Option.some }),
          Keying.config(detail.movement.config(detail, detail.movement)),
        ]),
        events: derive([
          run(focus$4(), (menu, simulatedEvent) => {
            const event = simulatedEvent.event()
            menu.getSystem().getByDom(event.target()).each((item) => {
              Highlighting.highlight(menu, item)
              simulatedEvent.stop()
              emitWith(menu, focus$5(), {
                menu,
                item,
              })
            })
          }),
          run(hover(), (menu, simulatedEvent) => {
            const item = simulatedEvent.event().item()
            Highlighting.highlight(menu, item)
          }),
        ]),
        components,
        eventOrder: detail.eventOrder,
        domModification: { attributes: { role: 'menu' } },
      }
    }

    const Menu = composite$1({
      name: 'Menu',
      configFields: schema$d(),
      partFields: parts$1(),
      factory: make$2,
    })

    const preserve$2 = function (f, container) {
      const ownerDoc = owner(container)
      const refocus = active(ownerDoc).bind((focused) => {
        const hasFocus$$1 = function (elem) {
          return eq(focused, elem)
        }
        return hasFocus$$1(container) ? Option.some(container) : descendant(container, hasFocus$$1)
      })
      const result = f(container)
      refocus.each((oldFocus) => {
        active(ownerDoc).filter((newFocus) => eq(newFocus, oldFocus)).fold(() => {
          focus$2(oldFocus)
        }, noop)
      })
      return result
    }

    const set$8 = function (component, replaceConfig, replaceState, data) {
      detachChildren(component)
      preserve$2(() => {
        const children = map$1(data, component.getSystem().build)
        each$1(children, (l) => {
          attach(component, l)
        })
      }, component.element())
    }
    const insert = function (component, replaceConfig, insertion, childSpec) {
      const child = component.getSystem().build(childSpec)
      attachWith(component, child, insertion)
    }
    const append$2 = function (component, replaceConfig, replaceState, appendee) {
      insert(component, replaceConfig, append, appendee)
    }
    const prepend$2 = function (component, replaceConfig, replaceState, prependee) {
      insert(component, replaceConfig, prepend, prependee)
    }
    const remove$7 = function (component, replaceConfig, replaceState, removee) {
      const children = contents(component, replaceConfig)
      const foundChild = find$2(children, (child) => eq(removee.element(), child.element()))
      foundChild.each(detach)
    }
    var contents = function (component, replaceConfig) {
      return component.components()
    }
    const replaceAt = function (component, replaceConfig, replaceState, replaceeIndex, replacer) {
      const children = contents(component, replaceConfig)
      return Option.from(children[replaceeIndex]).map((replacee) => {
        remove$7(component, replaceConfig, replaceState, replacee)
        replacer.each((r) => {
          insert(component, replaceConfig, (p, c) => {
            appendAt(p, c, replaceeIndex)
          }, r)
        })
        return replacee
      })
    }
    const replaceBy = function (component, replaceConfig, replaceState, replaceePred, replacer) {
      const children = contents(component, replaceConfig)
      return findIndex(children, replaceePred).bind((replaceeIndex) => replaceAt(component, replaceConfig, replaceState, replaceeIndex, replacer))
    }

    const ReplaceApis = /* #__PURE__ */Object.freeze({
      append: append$2,
      prepend: prepend$2,
      remove: remove$7,
      replaceAt,
      replaceBy,
      set: set$8,
      contents,
    })

    const Replacing = create$1({
      fields: [],
      name: 'replacing',
      apis: ReplaceApis,
    })

    const transpose = function (obj) {
      return tupleMap(obj, (v, k) => ({
        k: v,
        v: k,
      }))
    }
    var trace = function (items, byItem, byMenu, finish) {
      return readOptFrom$1(byMenu, finish).bind((triggerItem) => readOptFrom$1(items, triggerItem).bind((triggerMenu) => {
        const rest = trace(items, byItem, byMenu, triggerMenu)
        return Option.some([triggerMenu].concat(rest))
      })).getOr([])
    }
    const generate$5 = function (menus, expansions) {
      const items = {}
      each(menus, (menuItems, menu) => {
        each$1(menuItems, (item) => {
          items[item] = menu
        })
      })
      const byItem = expansions
      const byMenu = transpose(expansions)
      const menuPaths = map(byMenu, (_triggerItem, submenu) => [submenu].concat(trace(items, byItem, byMenu, submenu)))
      return map(items, (menu) => readOptFrom$1(menuPaths, menu).getOr([menu]))
    }

    const init$4 = function () {
      const expansions = Cell({})
      const menus = Cell({})
      const paths = Cell({})
      const primary = Cell(Option.none())
      const directory = Cell({})
      const clear = function () {
        expansions.set({})
        menus.set({})
        paths.set({})
        primary.set(Option.none())
      }
      const isClear = function () {
        return primary.get().isNone()
      }
      const setMenuBuilt = function (menuName, built) {
        let _a
        menus.set(__assign({}, menus.get(), (_a = {}, _a[menuName] = {
          type: 'prepared',
          menu: built,
        }, _a)))
      }
      const setContents = function (sPrimary, sMenus, sExpansions, dir) {
        primary.set(Option.some(sPrimary))
        expansions.set(sExpansions)
        menus.set(sMenus)
        directory.set(dir)
        const sPaths = generate$5(dir, sExpansions)
        paths.set(sPaths)
      }
      const expand = function (itemValue) {
        return readOptFrom$1(expansions.get(), itemValue).map((menu) => {
          const current = readOptFrom$1(paths.get(), itemValue).getOr([])
          return [menu].concat(current)
        })
      }
      const collapse = function (itemValue) {
        return readOptFrom$1(paths.get(), itemValue).bind((path) => path.length > 1 ? Option.some(path.slice(1)) : Option.none())
      }
      const refresh = function (itemValue) {
        return readOptFrom$1(paths.get(), itemValue)
      }
      const lookupMenu = function (menuValue) {
        return readOptFrom$1(menus.get(), menuValue)
      }
      const otherMenus = function (path) {
        const menuValues = directory.get()
        return difference(keys(menuValues), path)
      }
      const getPrimary = function () {
        return primary.get().bind((primaryName) => lookupMenu(primaryName).bind((prep) => prep.type === 'prepared' ? Option.some(prep.menu) : Option.none()))
      }
      const getMenus = function () {
        return menus.get()
      }
      return {
        setMenuBuilt,
        setContents,
        expand,
        refresh,
        collapse,
        lookupMenu,
        otherMenus,
        getPrimary,
        getMenus,
        clear,
        isClear,
      }
    }
    const LayeredState = { init: init$4 }

    const make$3 = function (detail, rawUiSpec) {
      const submenuParentItems = Cell(Option.none())
      const buildMenus = function (container, primaryName, menus) {
        return map(menus, (spec, name) => {
          const makeSketch = function () {
            return Menu.sketch(__assign({ dom: spec.dom }, spec, {
              value: name,
              items: spec.items,
              markers: detail.markers,
              fakeFocus: detail.fakeFocus,
              onHighlight: detail.onHighlight,
              focusManager: detail.fakeFocus ? highlights() : dom(),
            }))
          }
          return name === primaryName ? {
            type: 'prepared',
            menu: container.getSystem().build(makeSketch()),
          } : {
            type: 'notbuilt',
            nbMenu: makeSketch,
          }
        })
      }
      const layeredState = LayeredState.init()
      const setup = function (container) {
        const componentMap = buildMenus(container, detail.data.primary, detail.data.menus)
        const directory = toDirectory(container)
        layeredState.setContents(detail.data.primary, componentMap, detail.data.expansions, directory)
        return layeredState.getPrimary()
      }
      const getItemValue = function (item) {
        return Representing.getValue(item).value
      }
      var toDirectory = function (container) {
        return map(detail.data.menus, (data, menuName) => bind(data.items, (item) => item.type === 'separator' ? [] : [item.data.value]))
      }
      const setActiveMenu = function (container, menu) {
        Highlighting.highlight(container, menu)
        Highlighting.getHighlighted(menu).orThunk(() => Highlighting.getFirst(menu)).each((item) => {
          dispatch(container, item.element(), focusItem())
        })
      }
      const getMenus = function (state, menuValues) {
        return cat(map$1(menuValues, (mv) => state.lookupMenu(mv).bind((prep) => prep.type === 'prepared' ? Option.some(prep.menu) : Option.none())))
      }
      const closeOthers = function (container, state, path) {
        const others = getMenus(state, state.otherMenus(path))
        each$1(others, (o) => {
          remove$6(o.element(), [detail.markers.backgroundMenu])
          if (!detail.stayInDom) {
            Replacing.remove(container, o)
          }
        })
      }
      const getSubmenuParents = function (container) {
        return submenuParentItems.get().getOrThunk(() => {
          const r = {}
          const items = descendants$1(container.element(), `.${detail.markers.item}`)
          const parentItems = filter(items, (i) => get$1(i, 'aria-haspopup') === 'true')
          each$1(parentItems, (i) => {
            container.getSystem().getByDom(i).each((itemComp) => {
              const key = getItemValue(itemComp)
              r[key] = itemComp
            })
          })
          submenuParentItems.set(Option.some(r))
          return r
        })
      }
      const updateAriaExpansions = function (container, path) {
        const parentItems = getSubmenuParents(container)
        each(parentItems, (v, k) => {
          const expanded = contains(path, k)
          set(v.element(), 'aria-expanded', expanded)
        })
      }
      const updateMenuPath = function (container, state, path) {
        return Option.from(path[0]).bind((latestMenuName) => state.lookupMenu(latestMenuName).bind((menuPrep) => {
          if (menuPrep.type === 'notbuilt') {
            return Option.none()
          }
          const activeMenu = menuPrep.menu
          const rest = getMenus(state, path.slice(1))
          each$1(rest, (r) => {
            add$2(r.element(), detail.markers.backgroundMenu)
          })
          if (!inBody(activeMenu.element())) {
            Replacing.append(container, premade$1(activeMenu))
          }
          remove$6(activeMenu.element(), [detail.markers.backgroundMenu])
          setActiveMenu(container, activeMenu)
          closeOthers(container, state, path)
          return Option.some(activeMenu)
        }))
      }
      let ExpandHighlightDecision;
      (function (ExpandHighlightDecision) {
        ExpandHighlightDecision[ExpandHighlightDecision.HighlightSubmenu = 0] = 'HighlightSubmenu'
        ExpandHighlightDecision[ExpandHighlightDecision.HighlightParent = 1] = 'HighlightParent'
      }(ExpandHighlightDecision || (ExpandHighlightDecision = {})))
      const buildIfRequired = function (container, menuName, menuPrep) {
        if (menuPrep.type === 'notbuilt') {
          const menu = container.getSystem().build(menuPrep.nbMenu())
          layeredState.setMenuBuilt(menuName, menu)
          return menu
        }
        return menuPrep.menu
      }
      const expandRight = function (container, item, decision) {
        if (decision === void 0) {
          decision = ExpandHighlightDecision.HighlightSubmenu
        }
        const value = getItemValue(item)
        return layeredState.expand(value).bind((path) => {
          updateAriaExpansions(container, path)
          return Option.from(path[0]).bind((menuName) => layeredState.lookupMenu(menuName).bind((activeMenuPrep) => {
            const activeMenu = buildIfRequired(container, menuName, activeMenuPrep)
            if (!inBody(activeMenu.element())) {
              Replacing.append(container, premade$1(activeMenu))
            }
            detail.onOpenSubmenu(container, item, activeMenu)
            if (decision === ExpandHighlightDecision.HighlightSubmenu) {
              Highlighting.highlightFirst(activeMenu)
              return updateMenuPath(container, layeredState, path)
            }
            Highlighting.dehighlightAll(activeMenu)
            return Option.some(item)
          }))
        })
      }
      const collapseLeft = function (container, item) {
        const value = getItemValue(item)
        return layeredState.collapse(value).bind((path) => {
          updateAriaExpansions(container, path)
          return updateMenuPath(container, layeredState, path).map((activeMenu) => {
            detail.onCollapseMenu(container, item, activeMenu)
            return activeMenu
          })
        })
      }
      const updateView = function (container, item) {
        const value = getItemValue(item)
        return layeredState.refresh(value).bind((path) => {
          updateAriaExpansions(container, path)
          return updateMenuPath(container, layeredState, path)
        })
      }
      const onRight = function (container, item) {
        return inside(item.element()) ? Option.none() : expandRight(container, item, ExpandHighlightDecision.HighlightSubmenu)
      }
      const onLeft = function (container, item) {
        return inside(item.element()) ? Option.none() : collapseLeft(container, item)
      }
      const onEscape = function (container, item) {
        return collapseLeft(container, item).orThunk(() => detail.onEscape(container, item).map(() => container))
      }
      const keyOnItem = function (f) {
        return function (container, simulatedEvent) {
          return closest$3(simulatedEvent.getSource(), `.${detail.markers.item}`).bind((target) => container.getSystem().getByDom(target).toOption().bind((item) => f(container, item).map(() => true)))
        }
      }
      const events = derive([
        run(focus$5(), (sandbox, simulatedEvent) => {
          const menu = simulatedEvent.event().menu()
          Highlighting.highlight(sandbox, menu)
          const value = getItemValue(simulatedEvent.event().item())
          layeredState.refresh(value).each((path) => closeOthers(sandbox, layeredState, path))
        }),
        runOnExecute((component, simulatedEvent) => {
          const target = simulatedEvent.event().target()
          component.getSystem().getByDom(target).each((item) => {
            const itemValue = getItemValue(item)
            if (itemValue.indexOf('collapse-item') === 0) {
              collapseLeft(component, item)
            }
            expandRight(component, item, ExpandHighlightDecision.HighlightSubmenu).fold(() => {
              detail.onExecute(component, item)
            }, () => {
            })
          })
        }),
        runOnAttached((container, simulatedEvent) => {
          setup(container).each((primary) => {
            Replacing.append(container, premade$1(primary))
            detail.onOpenMenu(container, primary)
            if (detail.highlightImmediately) {
              setActiveMenu(container, primary)
            }
          })
        }),
      ].concat(detail.navigateOnHover ? [run(hover(), (sandbox, simulatedEvent) => {
        const item = simulatedEvent.event().item()
        updateView(sandbox, item)
        expandRight(sandbox, item, ExpandHighlightDecision.HighlightParent)
        detail.onHover(sandbox, item)
      })] : []))
      const collapseMenuApi = function (container) {
        Highlighting.getHighlighted(container).each((currentMenu) => {
          Highlighting.getHighlighted(currentMenu).each((currentItem) => {
            collapseLeft(container, currentItem)
          })
        })
      }
      const highlightPrimary = function (container) {
        layeredState.getPrimary().each((primary) => {
          setActiveMenu(container, primary)
        })
      }
      const apis = {
        collapseMenu: collapseMenuApi,
        highlightPrimary,
      }
      return {
        uid: detail.uid,
        dom: detail.dom,
        markers: detail.markers,
        behaviours: augment(detail.tmenuBehaviours, [
          Keying.config({
            mode: 'special',
            onRight: keyOnItem(onRight),
            onLeft: keyOnItem(onLeft),
            onEscape: keyOnItem(onEscape),
            focusIn(container, keyInfo) {
              layeredState.getPrimary().each((primary) => {
                dispatch(container, primary.element(), focusItem())
              })
            },
          }),
          Highlighting.config({
            highlightClass: detail.markers.selectedMenu,
            itemClass: detail.markers.menu,
          }),
          Composing.config({
            find(container) {
              return Highlighting.getHighlighted(container)
            },
          }),
          Replacing.config({}),
        ]),
        eventOrder: detail.eventOrder,
        apis,
        events,
      }
    }
    const collapseItem = constant('collapse-item')

    const tieredData = function (primary, menus, expansions) {
      return {
        primary,
        menus,
        expansions,
      }
    }
    const singleData = function (name, menu) {
      return {
        primary: name,
        menus: wrap$2(name, menu),
        expansions: {},
      }
    }
    const collapseItem$1 = function (text) {
      return {
        value: generate$1(collapseItem()),
        meta: { text },
      }
    }
    const tieredMenu = single$2({
      name: 'TieredMenu',
      configFields: [
        onStrictKeyboardHandler('onExecute'),
        onStrictKeyboardHandler('onEscape'),
        onStrictHandler('onOpenMenu'),
        onStrictHandler('onOpenSubmenu'),
        onHandler('onCollapseMenu'),
        defaulted$1('highlightImmediately', true),
        strictObjOf('data', [
          strict$1('primary'),
          strict$1('menus'),
          strict$1('expansions'),
        ]),
        defaulted$1('fakeFocus', false),
        onHandler('onHighlight'),
        onHandler('onHover'),
        tieredMenuMarkers(),
        strict$1('dom'),
        defaulted$1('navigateOnHover', true),
        defaulted$1('stayInDom', false),
        field$1('tmenuBehaviours', [
          Keying,
          Highlighting,
          Composing,
          Replacing,
        ]),
        defaulted$1('eventOrder', {}),
      ],
      apis: {
        collapseMenu(apis, tmenu) {
          apis.collapseMenu(tmenu)
        },
        highlightPrimary(apis, tmenu) {
          apis.highlightPrimary(tmenu)
        },
      },
      factory: make$3,
      extraApis: {
        tieredData,
        singleData,
        collapseItem: collapseItem$1,
      },
    })

    const findRoute = function (component, transConfig, transState, route) {
      return readOptFrom$1(transConfig.routes, route.start).bind((sConfig) => readOptFrom$1(sConfig, route.destination))
    }
    const getTransition = function (comp, transConfig, transState) {
      const route = getCurrentRoute(comp, transConfig, transState)
      return route.bind((r) => getTransitionOf(comp, transConfig, transState, r))
    }
    var getTransitionOf = function (comp, transConfig, transState, route) {
      return findRoute(comp, transConfig, transState, route).bind((r) => r.transition.map((t) => ({
        transition: t,
        route: r,
      })))
    }
    const disableTransition = function (comp, transConfig, transState) {
      getTransition(comp, transConfig, transState).each((routeTransition) => {
        const t = routeTransition.transition
        remove$4(comp.element(), t.transitionClass)
        remove$1(comp.element(), transConfig.destinationAttr)
      })
    }
    const getNewRoute = function (comp, transConfig, transState, destination) {
      return {
        start: get$1(comp.element(), transConfig.stateAttr),
        destination,
      }
    }
    var getCurrentRoute = function (comp, transConfig, transState) {
      const el = comp.element()
      return has$1(el, transConfig.destinationAttr) ? Option.some({
        start: get$1(comp.element(), transConfig.stateAttr),
        destination: get$1(comp.element(), transConfig.destinationAttr),
      }) : Option.none()
    }
    const jumpTo = function (comp, transConfig, transState, destination) {
      disableTransition(comp, transConfig, transState)
      if (has$1(comp.element(), transConfig.stateAttr) && get$1(comp.element(), transConfig.stateAttr) !== destination) {
        transConfig.onFinish(comp, destination)
      }
      set(comp.element(), transConfig.stateAttr, destination)
    }
    const fasttrack = function (comp, transConfig, transState, destination) {
      if (has$1(comp.element(), transConfig.destinationAttr)) {
        set(comp.element(), transConfig.stateAttr, get$1(comp.element(), transConfig.destinationAttr))
        remove$1(comp.element(), transConfig.destinationAttr)
      }
    }
    const progressTo = function (comp, transConfig, transState, destination) {
      fasttrack(comp, transConfig, transState, destination)
      const route = getNewRoute(comp, transConfig, transState, destination)
      getTransitionOf(comp, transConfig, transState, route).fold(() => {
        jumpTo(comp, transConfig, transState, destination)
      }, (routeTransition) => {
        disableTransition(comp, transConfig, transState)
        const t = routeTransition.transition
        add$2(comp.element(), t.transitionClass)
        set(comp.element(), transConfig.destinationAttr, destination)
      })
    }
    const getState$1 = function (comp, transConfig, transState) {
      const e = comp.element()
      return has$1(e, transConfig.stateAttr) ? Option.some(get$1(e, transConfig.stateAttr)) : Option.none()
    }

    const TransitionApis = /* #__PURE__ */Object.freeze({
      findRoute,
      disableTransition,
      getCurrentRoute,
      jumpTo,
      progressTo,
      getState: getState$1,
    })

    const events$9 = function (transConfig, transState) {
      return derive([
        run(transitionend(), (component, simulatedEvent) => {
          const raw = simulatedEvent.event().raw()
          getCurrentRoute(component, transConfig, transState).each((route) => {
            findRoute(component, transConfig, transState, route).each((rInfo) => {
              rInfo.transition.each((rTransition) => {
                if (raw.propertyName === rTransition.property) {
                  jumpTo(component, transConfig, transState, route.destination)
                  transConfig.onTransition(component, route)
                }
              })
            })
          })
        }),
        runOnAttached((comp, se) => {
          jumpTo(comp, transConfig, transState, transConfig.initialState)
        }),
      ])
    }

    const ActiveTransitioning = /* #__PURE__ */Object.freeze({
      events: events$9,
    })

    const TransitionSchema = [
      defaulted$1('destinationAttr', 'data-transitioning-destination'),
      defaulted$1('stateAttr', 'data-transitioning-state'),
      strict$1('initialState'),
      onHandler('onTransition'),
      onHandler('onFinish'),
      strictOf('routes', setOf$1(Result.value, setOf$1(Result.value, objOfOnly([optionObjOfOnly('transition', [
        strict$1('property'),
        strict$1('transitionClass'),
      ])])))),
    ]

    const createRoutes = function (routes) {
      const r = {}
      each(routes, (v, k) => {
        const waypoints = k.split('<->')
        r[waypoints[0]] = wrap$2(waypoints[1], v)
        r[waypoints[1]] = wrap$2(waypoints[0], v)
      })
      return r
    }
    const createBistate = function (first, second, transitions) {
      return wrapAll$1([
        {
          key: first,
          value: wrap$2(second, transitions),
        },
        {
          key: second,
          value: wrap$2(first, transitions),
        },
      ])
    }
    const createTristate = function (first, second, third, transitions) {
      return wrapAll$1([
        {
          key: first,
          value: wrapAll$1([
            {
              key: second,
              value: transitions,
            },
            {
              key: third,
              value: transitions,
            },
          ]),
        },
        {
          key: second,
          value: wrapAll$1([
            {
              key: first,
              value: transitions,
            },
            {
              key: third,
              value: transitions,
            },
          ]),
        },
        {
          key: third,
          value: wrapAll$1([
            {
              key: first,
              value: transitions,
            },
            {
              key: second,
              value: transitions,
            },
          ]),
        },
      ])
    }
    const Transitioning = create$1({
      fields: TransitionSchema,
      name: 'transitioning',
      active: ActiveTransitioning,
      apis: TransitionApis,
      extra: {
        createRoutes,
        createBistate,
        createTristate,
      },
    })

    const scrollable = Styles.resolve('scrollable')
    const register = function (element) {
      add$2(element, scrollable)
    }
    const deregister = function (element) {
      remove$4(element, scrollable)
    }
    const Scrollable = {
      register,
      deregister,
      scrollable: constant(scrollable),
    }

    const getValue$4 = function (item) {
      return readOptFrom$1(item, 'format').getOr(item.title)
    }
    const convert$1 = function (formats, memMenuThunk) {
      const mainMenu = makeMenu('Styles', [].concat(map$1(formats.items, (k) => makeItem(getValue$4(k), k.title, k.isSelected(), k.getPreview(), hasKey$1(formats.expansions, getValue$4(k))))), memMenuThunk, false)
      const submenus = map(formats.menus, (menuItems, menuName) => {
        const items = map$1(menuItems, (item) => makeItem(getValue$4(item), item.title, item.isSelected !== undefined ? item.isSelected() : false, item.getPreview !== undefined ? item.getPreview() : '', hasKey$1(formats.expansions, getValue$4(item))))
        return makeMenu(menuName, items, memMenuThunk, true)
      })
      const menus = deepMerge(submenus, wrap$2('styles', mainMenu))
      const tmenu = tieredMenu.tieredData('styles', menus, formats.expansions)
      return { tmenu }
    }
    var makeItem = function (value, text$$1, selected, preview, isMenu) {
      return {
        data: {
          value,
          text: text$$1,
        },
        type: 'item',
        dom: {
          tag: 'div',
          classes: isMenu ? [Styles.resolve('styles-item-is-menu')] : [],
        },
        toggling: {
          toggleOnExecute: false,
          toggleClass: Styles.resolve('format-matches'),
          selected,
        },
        itemBehaviours: derive$1(isMenu ? [] : [Receivers.format(value, (comp, status) => {
          const toggle = status ? Toggling.on : Toggling.off
          toggle(comp)
        })]),
        components: [{
          dom: {
            tag: 'div',
            attributes: { style: preview },
            innerHtml: text$$1,
          },
        }],
      }
    }
    var makeMenu = function (value, items, memMenuThunk, collapsable) {
      return {
        value,
        dom: { tag: 'div' },
        components: [
          Button.sketch({
            dom: {
              tag: 'div',
              classes: [Styles.resolve('styles-collapser')],
            },
            components: collapsable ? [
              {
                dom: {
                  tag: 'span',
                  classes: [Styles.resolve('styles-collapse-icon')],
                },
              },
              text(value),
            ] : [text(value)],
            action(item) {
              if (collapsable) {
                const comp = memMenuThunk().get(item)
                tieredMenu.collapseMenu(comp)
              }
            },
          }),
          {
            dom: {
              tag: 'div',
              classes: [Styles.resolve('styles-menu-items-container')],
            },
            components: [Menu.parts().items({})],
            behaviours: derive$1([config('adhoc-scrollable-menu', [
              runOnAttached((component, simulatedEvent) => {
                set$3(component.element(), 'overflow-y', 'auto')
                set$3(component.element(), '-webkit-overflow-scrolling', 'touch')
                Scrollable.register(component.element())
              }),
              runOnDetached((component) => {
                remove$5(component.element(), 'overflow-y')
                remove$5(component.element(), '-webkit-overflow-scrolling')
                Scrollable.deregister(component.element())
              }),
            ])]),
          },
        ],
        items,
        menuBehaviours: derive$1([Transitioning.config({
          initialState: 'after',
          routes: Transitioning.createTristate('before', 'current', 'after', {
            transition: {
              property: 'transform',
              transitionClass: 'transitioning',
            },
          }),
        })]),
      }
    }
    const sketch$9 = function (settings) {
      const dataset = convert$1(settings.formats, () => memMenu)
      var memMenu = record(tieredMenu.sketch({
        dom: {
          tag: 'div',
          classes: [Styles.resolve('styles-menu')],
        },
        components: [],
        fakeFocus: true,
        stayInDom: true,
        onExecute(tmenu, item) {
          const v = Representing.getValue(item)
          settings.handle(item, v.value)
          return Option.none()
        },
        onEscape() {
          return Option.none()
        },
        onOpenMenu(container, menu) {
          const w = get$7(container.element())
          set$5(menu.element(), w)
          Transitioning.jumpTo(menu, 'current')
        },
        onOpenSubmenu(container, item, submenu) {
          const w = get$7(container.element())
          const menu = ancestor$2(item.element(), '[role="menu"]').getOrDie('hacky')
          const menuComp = container.getSystem().getByDom(menu).getOrDie()
          set$5(submenu.element(), w)
          Transitioning.progressTo(menuComp, 'before')
          Transitioning.jumpTo(submenu, 'after')
          Transitioning.progressTo(submenu, 'current')
        },
        onCollapseMenu(container, item, menu) {
          const submenu = ancestor$2(item.element(), '[role="menu"]').getOrDie('hacky')
          const submenuComp = container.getSystem().getByDom(submenu).getOrDie()
          Transitioning.progressTo(submenuComp, 'after')
          Transitioning.progressTo(menu, 'current')
        },
        navigateOnHover: false,
        highlightImmediately: true,
        data: dataset.tmenu,
        markers: {
          backgroundMenu: Styles.resolve('styles-background-menu'),
          menu: Styles.resolve('styles-menu'),
          selectedMenu: Styles.resolve('styles-selected-menu'),
          item: Styles.resolve('styles-item'),
          selectedItem: Styles.resolve('styles-selected-item'),
        },
      }))
      return memMenu.asSpec()
    }
    const StylesMenu = { sketch: sketch$9 }

    const getFromExpandingItem = function (item) {
      const newItem = deepMerge(exclude$1(item, ['items']), { menu: true })
      const rest = expand(item.items)
      const newMenus = deepMerge(rest.menus, wrap$2(item.title, rest.items))
      const newExpansions = deepMerge(rest.expansions, wrap$2(item.title, item.title))
      return {
        item: newItem,
        menus: newMenus,
        expansions: newExpansions,
      }
    }
    const getFromItem = function (item) {
      return hasKey$1(item, 'items') ? getFromExpandingItem(item) : {
        item,
        menus: {},
        expansions: {},
      }
    }
    var expand = function (items) {
      return foldr(items, (acc, item) => {
        const newData = getFromItem(item)
        return {
          menus: deepMerge(acc.menus, newData.menus),
          items: [newData.item].concat(acc.items),
          expansions: deepMerge(acc.expansions, newData.expansions),
        }
      }, {
        menus: {},
        expansions: {},
        items: [],
      })
    }
    const StyleConversions = { expand }

    const register$1 = function (editor, settings) {
      const isSelectedFor = function (format) {
        return function () {
          return editor.formatter.match(format)
        }
      }
      const getPreview = function (format) {
        return function () {
          const styles = editor.formatter.getCssText(format)
          return styles
        }
      }
      const enrichSupported = function (item) {
        return deepMerge(item, {
          isSelected: isSelectedFor(item.format),
          getPreview: getPreview(item.format),
        })
      }
      const enrichMenu = function (item) {
        return deepMerge(item, {
          isSelected: constant(false),
          getPreview: constant(''),
        })
      }
      const enrichCustom = function (item) {
        const formatName = generate$1(item.title)
        const newItem = deepMerge(item, {
          format: formatName,
          isSelected: isSelectedFor(formatName),
          getPreview: getPreview(formatName),
        })
        editor.formatter.register(formatName, newItem)
        return newItem
      }
      const formats = readOptFrom$1(settings, 'style_formats').getOr(DefaultStyleFormats)
      var doEnrich = function (items) {
        return map$1(items, (item) => {
          if (hasKey$1(item, 'items')) {
            const newItems = doEnrich(item.items)
            return deepMerge(enrichMenu(item), { items: newItems })
          } if (hasKey$1(item, 'format')) {
            return enrichSupported(item)
          }
          return enrichCustom(item)
        })
      }
      return doEnrich(formats)
    }
    const prune = function (editor, formats) {
      var doPrune = function (items) {
        return bind(items, (item) => {
          if (item.items !== undefined) {
            const newItems = doPrune(item.items)
            return newItems.length > 0 ? [item] : []
          }
          const keep = hasKey$1(item, 'format') ? editor.formatter.canApply(item.format) : true
          return keep ? [item] : []
        })
      }
      const prunedItems = doPrune(formats)
      return StyleConversions.expand(prunedItems)
    }
    const ui = function (editor, formats, onDone) {
      const pruned = prune(editor, formats)
      return StylesMenu.sketch({
        formats: pruned,
        handle(item, value) {
          editor.undoManager.transact(() => {
            if (Toggling.isOn(item)) {
              editor.formatter.remove(value)
            } else {
              editor.formatter.apply(value)
            }
          })
          onDone()
        },
      })
    }
    const StyleFormats = {
      register: register$1,
      ui,
    }

    const defaults = [
      'undo',
      'bold',
      'italic',
      'link',
      'image',
      'bullist',
      'styleselect',
    ]
    const extract$1 = function (rawToolbar) {
      const toolbar = rawToolbar.replace(/\|/g, ' ').trim()
      return toolbar.length > 0 ? toolbar.split(/\s+/) : []
    }
    var identifyFromArray = function (toolbar) {
      return bind(toolbar, (item) => isArray(item) ? identifyFromArray(item) : extract$1(item))
    }
    const identify = function (settings) {
      const toolbar = settings.toolbar !== undefined ? settings.toolbar : defaults
      return isArray(toolbar) ? identifyFromArray(toolbar) : extract$1(toolbar)
    }
    const setup = function (realm, editor) {
      const commandSketch = function (name) {
        return function () {
          return Buttons.forToolbarCommand(editor, name)
        }
      }
      const stateCommandSketch = function (name) {
        return function () {
          return Buttons.forToolbarStateCommand(editor, name)
        }
      }
      const actionSketch = function (name, query, action) {
        return function () {
          return Buttons.forToolbarStateAction(editor, name, query, action)
        }
      }
      const undo = commandSketch('undo')
      const redo = commandSketch('redo')
      const bold = stateCommandSketch('bold')
      const italic = stateCommandSketch('italic')
      const underline = stateCommandSketch('underline')
      const removeformat = commandSketch('removeformat')
      const link = function () {
        return sketch$8(realm, editor)
      }
      const unlink = actionSketch('unlink', 'link', () => {
        editor.execCommand('unlink', null, false)
      })
      const image = function () {
        return sketch$5(editor)
      }
      const bullist = actionSketch('unordered-list', 'ul', () => {
        editor.execCommand('InsertUnorderedList', null, false)
      })
      const numlist = actionSketch('ordered-list', 'ol', () => {
        editor.execCommand('InsertOrderedList', null, false)
      })
      const fontsizeselect = function () {
        return sketch$4(realm, editor)
      }
      const forecolor = function () {
        return ColorSlider.sketch(realm, editor)
      }
      const styleFormats = StyleFormats.register(editor, editor.settings)
      const styleFormatsMenu = function () {
        return StyleFormats.ui(editor, styleFormats, () => {
          editor.fire('scrollIntoView')
        })
      }
      const styleselect = function () {
        return Buttons.forToolbar('style-formats', (button) => {
          editor.fire('toReading')
          realm.dropup().appear(styleFormatsMenu, Toggling.on, button)
        }, derive$1([
          Toggling.config({
            toggleClass: Styles.resolve('toolbar-button-selected'),
            toggleOnExecute: false,
            aria: { mode: 'pressed' },
          }),
          Receiving.config({
            channels: wrapAll$1([
              Receivers.receive(TinyChannels.orientationChanged(), Toggling.off),
              Receivers.receive(TinyChannels.dropupDismissed(), Toggling.off),
            ]),
          }),
        ]))
      }
      const feature = function (prereq, sketch) {
        return {
          isSupported() {
            return prereq.forall((p) => hasKey$1(editor.buttons, p))
          },
          sketch,
        }
      }
      return {
        undo: feature(Option.none(), undo),
        redo: feature(Option.none(), redo),
        bold: feature(Option.none(), bold),
        italic: feature(Option.none(), italic),
        underline: feature(Option.none(), underline),
        removeformat: feature(Option.none(), removeformat),
        link: feature(Option.none(), link),
        unlink: feature(Option.none(), unlink),
        image: feature(Option.none(), image),
        bullist: feature(Option.some('bullist'), bullist),
        numlist: feature(Option.some('numlist'), numlist),
        fontsizeselect: feature(Option.none(), fontsizeselect),
        forecolor: feature(Option.none(), forecolor),
        styleselect: feature(Option.none(), styleselect),
      }
    }
    const detect$4 = function (settings, features) {
      const itemNames = identify(settings)
      const present = {}
      return bind(itemNames, (iName) => {
        const r = !hasKey$1(present, iName) && hasKey$1(features, iName) && features[iName].isSupported() ? [features[iName].sketch()] : []
        present[iName] = true
        return r
      })
    }
    const Features = {
      identify,
      setup,
      detect: detect$4,
    }

    const mkEvent = function (target, x, y, stop, prevent, kill, raw) {
      return {
        target: constant(target),
        x: constant(x),
        y: constant(y),
        stop,
        prevent,
        kill,
        raw: constant(raw),
      }
    }
    const handle = function (filter, handler) {
      return function (rawEvent) {
        if (!filter(rawEvent)) {
          return
        }
        const target = Element$$1.fromDom(rawEvent.target)
        const stop = function () {
          rawEvent.stopPropagation()
        }
        const prevent = function () {
          rawEvent.preventDefault()
        }
        const kill = compose(prevent, stop)
        const evt = mkEvent(target, rawEvent.clientX, rawEvent.clientY, stop, prevent, kill, rawEvent)
        handler(evt)
      }
    }
    const binder = function (element, event, filter, handler, useCapture) {
      const wrapped = handle(filter, handler)
      element.dom().addEventListener(event, wrapped, useCapture)
      return { unbind: curry(unbind, element, event, wrapped, useCapture) }
    }
    const bind$2 = function (element, event, filter, handler) {
      return binder(element, event, filter, handler, false)
    }
    const capture = function (element, event, filter, handler) {
      return binder(element, event, filter, handler, true)
    }
    var unbind = function (element, event, handler, useCapture) {
      element.dom().removeEventListener(event, handler, useCapture)
    }

    const filter$1 = constant(true)
    const bind$3 = function (element, event, handler) {
      return bind$2(element, event, filter$1, handler)
    }
    const capture$1 = function (element, event, handler) {
      return capture(element, event, filter$1, handler)
    }

    const INTERVAL = 50
    const INSURANCE = 1000 / INTERVAL
    const get$c = function (outerWindow) {
      const isPortrait = outerWindow.matchMedia('(orientation: portrait)').matches
      return { isPortrait: constant(isPortrait) }
    }
    const getActualWidth = function (outerWindow) {
      const isIos = PlatformDetection$1.detect().os.isiOS()
      const isPortrait = get$c(outerWindow).isPortrait()
      return isIos && !isPortrait ? outerWindow.screen.height : outerWindow.screen.width
    }
    const onChange = function (outerWindow, listeners) {
      const win = Element$$1.fromDom(outerWindow)
      let poller = null
      const change = function () {
        clearInterval(poller)
        const orientation = get$c(outerWindow)
        listeners.onChange(orientation)
        onAdjustment(() => {
          listeners.onReady(orientation)
        })
      }
      const orientationHandle = bind$3(win, 'orientationchange', change)
      var onAdjustment = function (f) {
        clearInterval(poller)
        const flag = outerWindow.innerHeight
        let insurance = 0
        poller = setInterval(() => {
          if (flag !== outerWindow.innerHeight) {
            clearInterval(poller)
            f(Option.some(outerWindow.innerHeight))
          } else if (insurance > INSURANCE) {
            clearInterval(poller)
            f(Option.none())
          }
          insurance++
        }, INTERVAL)
      }
      const destroy = function () {
        orientationHandle.unbind()
      }
      return {
        onAdjustment,
        destroy,
      }
    }
    const Orientation = {
      get: get$c,
      onChange,
      getActualWidth,
    }

    function DelayedFunction(fun, delay) {
      let ref = null
      const schedule = function () {
        const args = []
        for (let _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i]
        }
        ref = setTimeout(() => {
          fun.apply(null, args)
          ref = null
        }, delay)
      }
      const cancel = function () {
        if (ref !== null) {
          clearTimeout(ref)
          ref = null
        }
      }
      return {
        cancel,
        schedule,
      }
    }

    const SIGNIFICANT_MOVE = 5
    const LONGPRESS_DELAY = 400
    const getTouch = function (event) {
      const raw = event.raw()
      if (raw.touches === undefined || raw.touches.length !== 1) {
        return Option.none()
      }
      return Option.some(raw.touches[0])
    }
    const isFarEnough = function (touch, data) {
      const distX = Math.abs(touch.clientX - data.x())
      const distY = Math.abs(touch.clientY - data.y())
      return distX > SIGNIFICANT_MOVE || distY > SIGNIFICANT_MOVE
    }
    const monitor = function (settings) {
      const startData = Cell(Option.none())
      const longpress$$1 = DelayedFunction((event) => {
        startData.set(Option.none())
        settings.triggerEvent(longpress(), event)
      }, LONGPRESS_DELAY)
      const handleTouchstart = function (event) {
        getTouch(event).each((touch) => {
          longpress$$1.cancel()
          const data = {
            x: constant(touch.clientX),
            y: constant(touch.clientY),
            target: event.target,
          }
          longpress$$1.schedule(event)
          startData.set(Option.some(data))
        })
        return Option.none()
      }
      const handleTouchmove = function (event) {
        longpress$$1.cancel()
        getTouch(event).each((touch) => {
          startData.get().each((data) => {
            if (isFarEnough(touch, data)) {
              startData.set(Option.none())
            }
          })
        })
        return Option.none()
      }
      const handleTouchend = function (event) {
        longpress$$1.cancel()
        const isSame = function (data) {
          return eq(data.target(), event.target())
        }
        return startData.get().filter(isSame).map((data) => settings.triggerEvent(tap(), event))
      }
      const handlers = wrapAll$1([
        {
          key: touchstart(),
          value: handleTouchstart,
        },
        {
          key: touchmove(),
          value: handleTouchmove,
        },
        {
          key: touchend(),
          value: handleTouchend,
        },
      ])
      const fireIfReady = function (event, type) {
        return readOptFrom$1(handlers, type).bind((handler) => handler(event))
      }
      return { fireIfReady }
    }

    const monitor$1 = function (editorApi) {
      const tapEvent = monitor({
        triggerEvent(type, evt) {
          editorApi.onTapContent(evt)
        },
      })
      const onTouchend = function () {
        return bind$3(editorApi.body(), 'touchend', (evt) => {
          tapEvent.fireIfReady(evt, 'touchend')
        })
      }
      const onTouchmove = function () {
        return bind$3(editorApi.body(), 'touchmove', (evt) => {
          tapEvent.fireIfReady(evt, 'touchmove')
        })
      }
      const fireTouchstart = function (evt) {
        tapEvent.fireIfReady(evt, 'touchstart')
      }
      return {
        fireTouchstart,
        onTouchend,
        onTouchmove,
      }
    }
    const TappingEvent = { monitor: monitor$1 }

    const isAndroid6 = PlatformDetection$1.detect().os.version.major >= 6
    const initEvents = function (editorApi, toolstrip, alloy) {
      const tapping = TappingEvent.monitor(editorApi)
      const outerDoc = owner(toolstrip)
      const isRanged = function (sel) {
        return !eq(sel.start(), sel.finish()) || sel.soffset() !== sel.foffset()
      }
      const hasRangeInUi = function () {
        return active(outerDoc).filter((input) => name(input) === 'input').exists((input) => input.dom().selectionStart !== input.dom().selectionEnd)
      }
      const updateMargin = function () {
        const rangeInContent = editorApi.doc().dom().hasFocus() && editorApi.getSelection().exists(isRanged)
        alloy.getByDom(toolstrip).each((rangeInContent || hasRangeInUi()) === true ? Toggling.on : Toggling.off)
      }
      const listeners = [
        bind$3(editorApi.body(), 'touchstart', (evt) => {
          editorApi.onTouchContent()
          tapping.fireTouchstart(evt)
        }),
        tapping.onTouchmove(),
        tapping.onTouchend(),
        bind$3(toolstrip, 'touchstart', (evt) => {
          editorApi.onTouchToolstrip()
        }),
        editorApi.onToReading(() => {
          blur$$1(editorApi.body())
        }),
        editorApi.onToEditing(noop),
        editorApi.onScrollToCursor((tinyEvent) => {
          tinyEvent.preventDefault()
          editorApi.getCursorBox().each((bounds) => {
            const cWin = editorApi.win()
            const isOutside = bounds.top() > cWin.innerHeight || bounds.bottom() > cWin.innerHeight
            const cScrollBy = isOutside ? bounds.bottom() - cWin.innerHeight + 50 : 0
            if (cScrollBy !== 0) {
              cWin.scrollTo(cWin.pageXOffset, cWin.pageYOffset + cScrollBy)
            }
          })
        }),
      ].concat(isAndroid6 === true ? [] : [
        bind$3(Element$$1.fromDom(editorApi.win()), 'blur', () => {
          alloy.getByDom(toolstrip).each(Toggling.off)
        }),
        bind$3(outerDoc, 'select', updateMargin),
        bind$3(editorApi.doc(), 'selectionchange', updateMargin),
      ])
      const destroy = function () {
        each$1(listeners, (l) => {
          l.unbind()
        })
      }
      return { destroy }
    }
    const AndroidEvents = { initEvents }

    const safeParse = function (element, attribute) {
      const parsed = parseInt(get$1(element, attribute), 10)
      return isNaN(parsed) ? 0 : parsed
    }
    const DataAttributes = { safeParse }

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

    const api$3 = NodeValue(isText, 'text')
    const get$d = function (element) {
      return api$3.get(element)
    }
    const getOption = function (element) {
      return api$3.getOption(element)
    }

    const getEnd = function (element) {
      return name(element) === 'img' ? 1 : getOption(element).fold(() => children(element).length, (v) => v.length)
    }
    const NBSP = '\xA0'
    const isTextNodeWithCursorPosition = function (el) {
      return getOption(el).filter((text) => text.trim().length !== 0 || text.indexOf(NBSP) > -1).isSome()
    }
    const elementsWithCursorPosition = [
      'img',
      'br',
    ]
    const isCursorPosition = function (elem) {
      const hasCursorPosition = isTextNodeWithCursorPosition(elem)
      return hasCursorPosition || contains(elementsWithCursorPosition, name(elem))
    }

    const adt$4 = Adt.generate([
      { before: ['element'] },
      {
        on: [
          'element',
          'offset',
        ],
      },
      { after: ['element'] },
    ])
    const cata = function (subject, onBefore, onOn, onAfter) {
      return subject.fold(onBefore, onOn, onAfter)
    }
    const getStart = function (situ) {
      return situ.fold(identity, identity, identity)
    }
    const before$2 = adt$4.before
    const on$1 = adt$4.on
    const after$2 = adt$4.after
    const Situ = {
      before: before$2,
      on: on$1,
      after: after$2,
      cata,
      getStart,
    }

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
    const range$2 = Immutable('start', 'soffset', 'finish', 'foffset')
    const { relative } = type$1
    const { exact } = type$1

    const makeRange = function (start, soffset, finish, foffset) {
      const doc = owner(start)
      const rng = doc.dom().createRange()
      rng.setStart(start.dom(), soffset)
      rng.setEnd(finish.dom(), foffset)
      return rng
    }
    const after$3 = function (start, soffset, finish, foffset) {
      const r = makeRange(start, soffset, finish, foffset)
      const same = eq(start, finish) && soffset === foffset
      return r.collapsed && !same
    }

    const setStart = function (rng, situ) {
      situ.fold((e) => {
        rng.setStartBefore(e.dom())
      }, (e, o) => {
        rng.setStart(e.dom(), o)
      }, (e) => {
        rng.setStartAfter(e.dom())
      })
    }
    const setFinish = function (rng, situ) {
      situ.fold((e) => {
        rng.setEndBefore(e.dom())
      }, (e, o) => {
        rng.setEnd(e.dom(), o)
      }, (e) => {
        rng.setEndAfter(e.dom())
      })
    }
    const relativeToNative = function (win, startSitu, finishSitu) {
      const range = win.document.createRange()
      setStart(range, startSitu)
      setFinish(range, finishSitu)
      return range
    }
    const exactToNative = function (win, start, soffset, finish, foffset) {
      const rng = win.document.createRange()
      rng.setStart(start.dom(), soffset)
      rng.setEnd(finish.dom(), foffset)
      return rng
    }
    const toRect = function (rect) {
      return {
        left: constant(rect.left),
        top: constant(rect.top),
        right: constant(rect.right),
        bottom: constant(rect.bottom),
        width: constant(rect.width),
        height: constant(rect.height),
      }
    }
    const getFirstRect = function (rng) {
      const rects = rng.getClientRects()
      const rect = rects.length > 0 ? rects[0] : rng.getBoundingClientRect()
      return rect.width > 0 || rect.height > 0 ? Option.some(rect).map(toRect) : Option.none()
    }

    const adt$5 = Adt.generate([
      {
        ltr: [
          'start',
          'soffset',
          'finish',
          'foffset',
        ],
      },
      {
        rtl: [
          'start',
          'soffset',
          'finish',
          'foffset',
        ],
      },
    ])
    const fromRange = function (win, type, range) {
      return type(Element$$1.fromDom(range.startContainer), range.startOffset, Element$$1.fromDom(range.endContainer), range.endOffset)
    }
    const getRanges = function (win, selection) {
      return selection.match({
        domRange(rng) {
          return {
            ltr: constant(rng),
            rtl: Option.none,
          }
        },
        relative(startSitu, finishSitu) {
          return {
            ltr: cached(() => relativeToNative(win, startSitu, finishSitu)),
            rtl: cached(() => Option.some(relativeToNative(win, finishSitu, startSitu))),
          }
        },
        exact(start, soffset, finish, foffset) {
          return {
            ltr: cached(() => exactToNative(win, start, soffset, finish, foffset)),
            rtl: cached(() => Option.some(exactToNative(win, finish, foffset, start, soffset))),
          }
        },
      })
    }
    const doDiagnose = function (win, ranges) {
      const rng = ranges.ltr()
      if (rng.collapsed) {
        const reversed = ranges.rtl().filter((rev) => rev.collapsed === false)
        return reversed.map((rev) => adt$5.rtl(Element$$1.fromDom(rev.endContainer), rev.endOffset, Element$$1.fromDom(rev.startContainer), rev.startOffset)).getOrThunk(() => fromRange(win, adt$5.ltr, rng))
      }
      return fromRange(win, adt$5.ltr, rng)
    }
    const diagnose = function (win, selection) {
      const ranges = getRanges(win, selection)
      return doDiagnose(win, ranges)
    }
    const asLtrRange = function (win, selection) {
      const diagnosis = diagnose(win, selection)
      return diagnosis.match({
        ltr(start, soffset, finish, foffset) {
          const rng = win.document.createRange()
          rng.setStart(start.dom(), soffset)
          rng.setEnd(finish.dom(), foffset)
          return rng
        },
        rtl(start, soffset, finish, foffset) {
          const rng = win.document.createRange()
          rng.setStart(finish.dom(), foffset)
          rng.setEnd(start.dom(), soffset)
          return rng
        },
      })
    }

    const searchForPoint = function (rectForOffset, x, y, maxX, length) {
      if (length === 0) {
        return 0
      } if (x === maxX) {
        return length - 1
      }
      let xDelta = maxX
      for (let i = 1; i < length; i++) {
        const rect = rectForOffset(i)
        const curDeltaX = Math.abs(x - rect.left)
        if (y <= rect.bottom) {
          if (y < rect.top || curDeltaX > xDelta) {
            return i - 1
          }
          xDelta = curDeltaX
        }
      }
      return 0
    }
    const inRect = function (rect, x, y) {
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    }

    const locateOffset = function (doc, textnode, x, y, rect) {
      const rangeForOffset = function (o) {
        const r = doc.dom().createRange()
        r.setStart(textnode.dom(), o)
        r.collapse(true)
        return r
      }
      const rectForOffset = function (o) {
        const r = rangeForOffset(o)
        return r.getBoundingClientRect()
      }
      const { length } = get$d(textnode)
      const offset = searchForPoint(rectForOffset, x, y, rect.right, length)
      return rangeForOffset(offset)
    }
    const locate$1 = function (doc, node, x, y) {
      const r = doc.dom().createRange()
      r.selectNode(node.dom())
      const rects = r.getClientRects()
      const foundRect = findMap(rects, (rect) => inRect(rect, x, y) ? Option.some(rect) : Option.none())
      return foundRect.map((rect) => locateOffset(doc, node, x, y, rect))
    }

    const searchInChildren = function (doc, node, x, y) {
      const r = doc.dom().createRange()
      const nodes = children(node)
      return findMap(nodes, (n) => {
        r.selectNode(n.dom())
        return inRect(r.getBoundingClientRect(), x, y) ? locateNode(doc, n, x, y) : Option.none()
      })
    }
    var locateNode = function (doc, node, x, y) {
      const locator = isText(node) ? locate$1 : searchInChildren
      return locator(doc, node, x, y)
    }
    const locate$2 = function (doc, node, x, y) {
      const r = doc.dom().createRange()
      r.selectNode(node.dom())
      const rect = r.getBoundingClientRect()
      const boundedX = Math.max(rect.left, Math.min(rect.right, x))
      const boundedY = Math.max(rect.top, Math.min(rect.bottom, y))
      return locateNode(doc, node, boundedX, boundedY)
    }

    const first$3 = function (element) {
      return descendant(element, isCursorPosition)
    }
    const last$2 = function (element) {
      return descendantRtl(element, isCursorPosition)
    }
    var descendantRtl = function (scope, predicate) {
      var descend = function (element) {
        const children$$1 = children(element)
        for (let i = children$$1.length - 1; i >= 0; i--) {
          const child$$1 = children$$1[i]
          if (predicate(child$$1)) {
            return Option.some(child$$1)
          }
          const res = descend(child$$1)
          if (res.isSome()) {
            return res
          }
        }
        return Option.none()
      }
      return descend(scope)
    }

    const COLLAPSE_TO_LEFT = true
    const COLLAPSE_TO_RIGHT = false
    const getCollapseDirection = function (rect, x) {
      return x - rect.left < rect.right - x ? COLLAPSE_TO_LEFT : COLLAPSE_TO_RIGHT
    }
    const createCollapsedNode = function (doc, target, collapseDirection) {
      const r = doc.dom().createRange()
      r.selectNode(target.dom())
      r.collapse(collapseDirection)
      return r
    }
    const locateInElement = function (doc, node, x) {
      const cursorRange = doc.dom().createRange()
      cursorRange.selectNode(node.dom())
      const rect = cursorRange.getBoundingClientRect()
      const collapseDirection = getCollapseDirection(rect, x)
      const f = collapseDirection === COLLAPSE_TO_LEFT ? first$3 : last$2
      return f(node).map((target) => createCollapsedNode(doc, target, collapseDirection))
    }
    const locateInEmpty = function (doc, node, x) {
      const rect = node.dom().getBoundingClientRect()
      const collapseDirection = getCollapseDirection(rect, x)
      return Option.some(createCollapsedNode(doc, node, collapseDirection))
    }
    const search$1 = function (doc, node, x) {
      const f = children(node).length === 0 ? locateInEmpty : locateInElement
      return f(doc, node, x)
    }

    const caretPositionFromPoint = function (doc, x, y) {
      return Option.from(doc.dom().caretPositionFromPoint(x, y)).bind((pos) => {
        if (pos.offsetNode === null) {
          return Option.none()
        }
        const r = doc.dom().createRange()
        r.setStart(pos.offsetNode, pos.offset)
        r.collapse()
        return Option.some(r)
      })
    }
    const caretRangeFromPoint = function (doc, x, y) {
      return Option.from(doc.dom().caretRangeFromPoint(x, y))
    }
    const searchTextNodes = function (doc, node, x, y) {
      const r = doc.dom().createRange()
      r.selectNode(node.dom())
      const rect = r.getBoundingClientRect()
      const boundedX = Math.max(rect.left, Math.min(rect.right, x))
      const boundedY = Math.max(rect.top, Math.min(rect.bottom, y))
      return locate$2(doc, node, boundedX, boundedY)
    }
    const searchFromPoint = function (doc, x, y) {
      return Element$$1.fromPoint(doc, x, y).bind((elem) => {
        const fallback = function () {
          return search$1(doc, elem, x)
        }
        return children(elem).length === 0 ? fallback() : searchTextNodes(doc, elem, x, y).orThunk(fallback)
      })
    }
    const availableSearch = document.caretPositionFromPoint ? caretPositionFromPoint : document.caretRangeFromPoint ? caretRangeFromPoint : searchFromPoint

    const beforeSpecial = function (element, offset) {
      const name$$1 = name(element)
      if (name$$1 === 'input') {
        return Situ.after(element)
      } if (!contains([
        'br',
        'img',
      ], name$$1)) {
        return Situ.on(element, offset)
      }
      return offset === 0 ? Situ.before(element) : Situ.after(element)
    }
    const preprocessExact = function (start, soffset, finish, foffset) {
      const startSitu = beforeSpecial(start, soffset)
      const finishSitu = beforeSpecial(finish, foffset)
      return relative(startSitu, finishSitu)
    }

    const doSetNativeRange = function (win, rng) {
      Option.from(win.getSelection()).each((selection) => {
        selection.removeAllRanges()
        selection.addRange(rng)
      })
    }
    const doSetRange = function (win, start, soffset, finish, foffset) {
      const rng = exactToNative(win, start, soffset, finish, foffset)
      doSetNativeRange(win, rng)
    }
    const setLegacyRtlRange = function (win, selection, start, soffset, finish, foffset) {
      selection.collapse(start.dom(), soffset)
      selection.extend(finish.dom(), foffset)
    }
    const setRangeFromRelative = function (win, relative$$1) {
      return diagnose(win, relative$$1).match({
        ltr(start, soffset, finish, foffset) {
          doSetRange(win, start, soffset, finish, foffset)
        },
        rtl(start, soffset, finish, foffset) {
          const selection = win.getSelection()
          if (selection.setBaseAndExtent) {
            selection.setBaseAndExtent(start.dom(), soffset, finish.dom(), foffset)
          } else if (selection.extend) {
            try {
              setLegacyRtlRange(win, selection, start, soffset, finish, foffset)
            } catch (e) {
              doSetRange(win, finish, foffset, start, soffset)
            }
          } else {
            doSetRange(win, finish, foffset, start, soffset)
          }
        },
      })
    }
    const setExact = function (win, start, soffset, finish, foffset) {
      const relative$$1 = preprocessExact(start, soffset, finish, foffset)
      setRangeFromRelative(win, relative$$1)
    }
    const readRange = function (selection) {
      if (selection.rangeCount > 0) {
        const firstRng = selection.getRangeAt(0)
        const lastRng = selection.getRangeAt(selection.rangeCount - 1)
        return Option.some(range$2(Element$$1.fromDom(firstRng.startContainer), firstRng.startOffset, Element$$1.fromDom(lastRng.endContainer), lastRng.endOffset))
      }
      return Option.none()
    }
    const doGetExact = function (selection) {
      const anchorNode = Element$$1.fromDom(selection.anchorNode)
      const focusNode = Element$$1.fromDom(selection.focusNode)
      return after$3(anchorNode, selection.anchorOffset, focusNode, selection.focusOffset) ? Option.some(range$2(Element$$1.fromDom(selection.anchorNode), selection.anchorOffset, Element$$1.fromDom(selection.focusNode), selection.focusOffset)) : readRange(selection)
    }
    const getExact = function (win) {
      return Option.from(win.getSelection()).filter((sel) => sel.rangeCount > 0).bind(doGetExact)
    }
    const get$e = function (win) {
      return getExact(win).map((range) => exact(range.start(), range.soffset(), range.finish(), range.foffset()))
    }
    const getFirstRect$1 = function (win, selection) {
      const rng = asLtrRange(win, selection)
      return getFirstRect(rng)
    }
    const clear$1 = function (win) {
      const selection = win.getSelection()
      selection.removeAllRanges()
    }

    const COLLAPSED_WIDTH = 2
    const collapsedRect = function (rect) {
      return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: constant(COLLAPSED_WIDTH),
        height: rect.height,
      }
    }
    const toRect$1 = function (rawRect) {
      return {
        left: constant(rawRect.left),
        top: constant(rawRect.top),
        right: constant(rawRect.right),
        bottom: constant(rawRect.bottom),
        width: constant(rawRect.width),
        height: constant(rawRect.height),
      }
    }
    const getRectsFromRange = function (range$$1) {
      if (!range$$1.collapsed) {
        return map$1(range$$1.getClientRects(), toRect$1)
      }
      const start_1 = Element$$1.fromDom(range$$1.startContainer)
      return parent(start_1).bind((parent$$1) => {
        const selection = exact(start_1, range$$1.startOffset, parent$$1, getEnd(parent$$1))
        const optRect = getFirstRect$1(range$$1.startContainer.ownerDocument.defaultView, selection)
        return optRect.map(collapsedRect).map(pure)
      }).getOr([])
    }
    const getRectangles = function (cWin) {
      const sel = cWin.getSelection()
      return sel !== undefined && sel.rangeCount > 0 ? getRectsFromRange(sel.getRangeAt(0)) : []
    }
    const Rectangles = { getRectangles }

    const autocompleteHack = function () {
      return function (f) {
        setTimeout(() => {
          f()
        }, 0)
      }
    }
    const resume = function (cWin) {
      cWin.focus()
      const iBody = Element$$1.fromDom(cWin.document.body)
      const inInput = active().exists((elem) => contains([
        'input',
        'textarea',
      ], name(elem)))
      const transaction = inInput ? autocompleteHack() : apply
      transaction(() => {
        active().each(blur$$1)
        focus$2(iBody)
      })
    }
    const ResumeEditing = { resume }

    const EXTRA_SPACING = 50
    const data = `data-${Styles.resolve('last-outer-height')}`
    const setLastHeight = function (cBody, value) {
      set(cBody, data, value)
    }
    const getLastHeight = function (cBody) {
      return DataAttributes.safeParse(cBody, data)
    }
    const getBoundsFrom = function (rect) {
      return {
        top: constant(rect.top()),
        bottom: constant(rect.top() + rect.height()),
      }
    }
    const getBounds$3 = function (cWin) {
      const rects = Rectangles.getRectangles(cWin)
      return rects.length > 0 ? Option.some(rects[0]).map(getBoundsFrom) : Option.none()
    }
    const findDelta = function (outerWindow, cBody) {
      const last = getLastHeight(cBody)
      const current = outerWindow.innerHeight
      return last > current ? Option.some(last - current) : Option.none()
    }
    const calculate = function (cWin, bounds, delta) {
      const isOutside = bounds.top() > cWin.innerHeight || bounds.bottom() > cWin.innerHeight
      return isOutside ? Math.min(delta, bounds.bottom() - cWin.innerHeight + EXTRA_SPACING) : 0
    }
    const setup$1 = function (outerWindow, cWin) {
      const cBody = Element$$1.fromDom(cWin.document.body)
      const toEditing = function () {
        ResumeEditing.resume(cWin)
      }
      const onResize = bind$3(Element$$1.fromDom(outerWindow), 'resize', () => {
        findDelta(outerWindow, cBody).each((delta) => {
          getBounds$3(cWin).each((bounds) => {
            const cScrollBy = calculate(cWin, bounds, delta)
            if (cScrollBy !== 0) {
              cWin.scrollTo(cWin.pageXOffset, cWin.pageYOffset + cScrollBy)
            }
          })
        })
        setLastHeight(cBody, outerWindow.innerHeight)
      })
      setLastHeight(cBody, outerWindow.innerHeight)
      const destroy = function () {
        onResize.unbind()
      }
      return {
        toEditing,
        destroy,
      }
    }
    const AndroidSetup = { setup: setup$1 }

    const getBodyFromFrame = function (frame) {
      return Option.some(Element$$1.fromDom(frame.dom().contentWindow.document.body))
    }
    const getDocFromFrame = function (frame) {
      return Option.some(Element$$1.fromDom(frame.dom().contentWindow.document))
    }
    const getWinFromFrame = function (frame) {
      return Option.from(frame.dom().contentWindow)
    }
    const getSelectionFromFrame = function (frame) {
      const optWin = getWinFromFrame(frame)
      return optWin.bind(getExact)
    }
    const getFrame = function (editor) {
      return editor.getFrame()
    }
    const getOrDerive = function (name, f) {
      return function (editor) {
        const g = editor[name].getOrThunk(() => {
          const frame = getFrame(editor)
          return function () {
            return f(frame)
          }
        })
        return g()
      }
    }
    const getOrListen = function (editor, doc, name, type) {
      return editor[name].getOrThunk(() => function (handler) {
        return bind$3(doc, type, handler)
      })
    }
    const toRect$2 = function (rect) {
      return {
        left: constant(rect.left),
        top: constant(rect.top),
        right: constant(rect.right),
        bottom: constant(rect.bottom),
        width: constant(rect.width),
        height: constant(rect.height),
      }
    }
    const getActiveApi = function (editor) {
      const frame = getFrame(editor)
      const tryFallbackBox = function (win) {
        const isCollapsed$$1 = function (sel) {
          return eq(sel.start(), sel.finish()) && sel.soffset() === sel.foffset()
        }
        const toStartRect = function (sel) {
          const rect = sel.start().dom().getBoundingClientRect()
          return rect.width > 0 || rect.height > 0 ? Option.some(rect).map(toRect$2) : Option.none()
        }
        return getExact(win).filter(isCollapsed$$1).bind(toStartRect)
      }
      return getBodyFromFrame(frame).bind((body) => getDocFromFrame(frame).bind((doc) => getWinFromFrame(frame).map((win) => {
        const html = Element$$1.fromDom(doc.dom().documentElement)
        const getCursorBox = editor.getCursorBox.getOrThunk(() => function () {
          return get$e(win).bind((sel) => getFirstRect$1(win, sel).orThunk(() => tryFallbackBox(win)))
        })
        const setSelection = editor.setSelection.getOrThunk(() => function (start, soffset, finish, foffset) {
          setExact(win, start, soffset, finish, foffset)
        })
        const clearSelection = editor.clearSelection.getOrThunk(() => function () {
          clear$1(win)
        })
        return {
          body: constant(body),
          doc: constant(doc),
          win: constant(win),
          html: constant(html),
          getSelection: curry(getSelectionFromFrame, frame),
          setSelection,
          clearSelection,
          frame: constant(frame),
          onKeyup: getOrListen(editor, doc, 'onKeyup', 'keyup'),
          onNodeChanged: getOrListen(editor, doc, 'onNodeChanged', 'selectionchange'),
          onDomChanged: editor.onDomChanged,
          onScrollToCursor: editor.onScrollToCursor,
          onScrollToElement: editor.onScrollToElement,
          onToReading: editor.onToReading,
          onToEditing: editor.onToEditing,
          onToolbarScrollStart: editor.onToolbarScrollStart,
          onTouchContent: editor.onTouchContent,
          onTapContent: editor.onTapContent,
          onTouchToolstrip: editor.onTouchToolstrip,
          getCursorBox,
        }
      })))
    }
    const PlatformEditor = {
      getBody: getOrDerive('getBody', getBodyFromFrame),
      getDoc: getOrDerive('getDoc', getDocFromFrame),
      getWin: getOrDerive('getWin', getWinFromFrame),
      getSelection: getOrDerive('getSelection', getSelectionFromFrame),
      getFrame,
      getActiveApi,
    }

    const attr = 'data-ephox-mobile-fullscreen-style'
    const siblingStyles = 'display:none!important;'
    const ancestorPosition = 'position:absolute!important;'
    const ancestorStyles = 'top:0!important;left:0!important;margin:0' + '!important;padding:0!important;width:100%!important;'
    const bgFallback = 'background-color:rgb(255,255,255)!important;'
    const isAndroid = PlatformDetection$1.detect().os.isAndroid()
    const matchColor = function (editorBody) {
      const color = get$4(editorBody, 'background-color')
      return color !== undefined && color !== '' ? `background-color:${color}!important` : bgFallback
    }
    const clobberStyles = function (container, editorBody) {
      const gatherSibilings = function (element) {
        const siblings = siblings$2(element, '*')
        return siblings
      }
      const clobber = function (clobberStyle) {
        return function (element) {
          const styles = get$1(element, 'style')
          const backup = styles === undefined ? 'no-styles' : styles.trim()
          if (backup === clobberStyle) {

          } else {
            set(element, attr, backup)
            set(element, 'style', clobberStyle)
          }
        }
      }
      const ancestors = ancestors$1(container, '*')
      const siblings = bind(ancestors, gatherSibilings)
      const bgColor = matchColor(editorBody)
      each$1(siblings, clobber(siblingStyles))
      each$1(ancestors, clobber(ancestorPosition + ancestorStyles + bgColor))
      const containerStyles = isAndroid === true ? '' : ancestorPosition
      clobber(containerStyles + ancestorStyles + bgColor)(container)
    }
    const restoreStyles = function () {
      const clobberedEls = all$3(`[${attr}]`)
      each$1(clobberedEls, (element) => {
        const restore = get$1(element, attr)
        if (restore !== 'no-styles') {
          set(element, 'style', restore)
        } else {
          remove$1(element, 'style')
        }
        remove$1(element, attr)
      })
    }
    const Thor = {
      clobberStyles,
      restoreStyles,
    }

    const tag = function () {
      const head = first$2('head').getOrDie()
      const nu = function () {
        const meta = Element$$1.fromTag('meta')
        set(meta, 'name', 'viewport')
        append(head, meta)
        return meta
      }
      const element = first$2('meta[name="viewport"]').getOrThunk(nu)
      const backup = get$1(element, 'content')
      const maximize = function () {
        set(element, 'content', 'width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0')
      }
      const restore = function () {
        if (backup !== undefined && backup !== null && backup.length > 0) {
          set(element, 'content', backup)
        } else {
          set(element, 'content', 'user-scalable=yes')
        }
      }
      return {
        maximize,
        restore,
      }
    }
    const MetaViewport = { tag }

    const create$5 = function (platform, mask) {
      const meta = MetaViewport.tag()
      const androidApi = api$2()
      const androidEvents = api$2()
      const enter = function () {
        mask.hide()
        add$2(platform.container, Styles.resolve('fullscreen-maximized'))
        add$2(platform.container, Styles.resolve('android-maximized'))
        meta.maximize()
        add$2(platform.body, Styles.resolve('android-scroll-reload'))
        androidApi.set(AndroidSetup.setup(platform.win, PlatformEditor.getWin(platform.editor).getOrDie('no')))
        PlatformEditor.getActiveApi(platform.editor).each((editorApi) => {
          Thor.clobberStyles(platform.container, editorApi.body())
          androidEvents.set(AndroidEvents.initEvents(editorApi, platform.toolstrip, platform.alloy))
        })
      }
      const exit = function () {
        meta.restore()
        mask.show()
        remove$4(platform.container, Styles.resolve('fullscreen-maximized'))
        remove$4(platform.container, Styles.resolve('android-maximized'))
        Thor.restoreStyles()
        remove$4(platform.body, Styles.resolve('android-scroll-reload'))
        androidEvents.clear()
        androidApi.clear()
      }
      return {
        enter,
        exit,
      }
    }
    const AndroidMode = { create: create$5 }

    const first$4 = function (fn, rate) {
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

    const sketch$a = function (onView, translate) {
      const memIcon = record(Container.sketch({
        dom: dom$2('<div aria-hidden="true" class="${prefix}-mask-tap-icon"></div>'),
        containerBehaviours: derive$1([Toggling.config({
          toggleClass: Styles.resolve('mask-tap-icon-selected'),
          toggleOnExecute: false,
        })]),
      }))
      const onViewThrottle = first$4(onView, 200)
      return Container.sketch({
        dom: dom$2('<div class="${prefix}-disabled-mask"></div>'),
        components: [Container.sketch({
          dom: dom$2('<div class="${prefix}-content-container"></div>'),
          components: [Button.sketch({
            dom: dom$2('<div class="${prefix}-content-tap-section"></div>'),
            components: [memIcon.asSpec()],
            action(button) {
              onViewThrottle.throttle()
            },
            buttonBehaviours: derive$1([Toggling.config({ toggleClass: Styles.resolve('mask-tap-icon-selected') })]),
          })],
        })],
      })
    }
    const TapToEditMask = { sketch: sketch$a }

    const MobileSchema = objOf([
      strictObjOf('editor', [
        strict$1('getFrame'),
        option('getBody'),
        option('getDoc'),
        option('getWin'),
        option('getSelection'),
        option('setSelection'),
        option('clearSelection'),
        option('cursorSaver'),
        option('onKeyup'),
        option('onNodeChanged'),
        option('getCursorBox'),
        strict$1('onDomChanged'),
        defaulted$1('onTouchContent', noop),
        defaulted$1('onTapContent', noop),
        defaulted$1('onTouchToolstrip', noop),
        defaulted$1('onScrollToCursor', constant({ unbind: noop })),
        defaulted$1('onScrollToElement', constant({ unbind: noop })),
        defaulted$1('onToEditing', constant({ unbind: noop })),
        defaulted$1('onToReading', constant({ unbind: noop })),
        defaulted$1('onToolbarScrollStart', identity),
      ]),
      strict$1('socket'),
      strict$1('toolstrip'),
      strict$1('dropup'),
      strict$1('toolbar'),
      strict$1('container'),
      strict$1('alloy'),
      state$1('win', (spec) => owner(spec.socket).dom().defaultView),
      state$1('body', (spec) => Element$$1.fromDom(spec.socket.dom().ownerDocument.body)),
      defaulted$1('translate', identity),
      defaulted$1('setReadOnly', noop),
      defaulted$1('readOnlyOnInit', constant(true)),
    ])

    const produce = function (raw) {
      const mobile = asRawOrDie('Getting AndroidWebapp schema', MobileSchema, raw)
      set$3(mobile.toolstrip, 'width', '100%')
      const onTap = function () {
        mobile.setReadOnly(mobile.readOnlyOnInit())
        mode.enter()
      }
      const mask = build$1(TapToEditMask.sketch(onTap, mobile.translate))
      mobile.alloy.add(mask)
      const maskApi = {
        show() {
          mobile.alloy.add(mask)
        },
        hide() {
          mobile.alloy.remove(mask)
        },
      }
      append(mobile.container, mask.element())
      var mode = AndroidMode.create(mobile, maskApi)
      return {
        setReadOnly: mobile.setReadOnly,
        refreshStructure: noop,
        enter: mode.enter,
        exit: mode.exit,
        destroy: noop,
      }
    }
    const AndroidWebapp = { produce }

    const schema$e = constant([
      defaulted$1('shell', true),
      field$1('toolbarBehaviours', [Replacing]),
    ])
    const enhanceGroups = function (detail) {
      return { behaviours: derive$1([Replacing.config({})]) }
    }
    const parts$2 = constant([optional({
      name: 'groups',
      overrides: enhanceGroups,
    })])

    const factory$4 = function (detail, components$$1, spec, _externals) {
      const setGroups = function (toolbar$$1, groups) {
        getGroupContainer(toolbar$$1).fold(() => {
          console.error('Toolbar was defined to not be a shell, but no groups container was specified in components')
          throw new Error('Toolbar was defined to not be a shell, but no groups container was specified in components')
        }, (container) => {
          Replacing.set(container, groups)
        })
      }
      var getGroupContainer = function (component) {
        return detail.shell ? Option.some(component) : getPart(component, detail, 'groups')
      }
      const extra = detail.shell ? {
        behaviours: [Replacing.config({})],
        components: [],
      } : {
        behaviours: [],
        components: components$$1,
      }
      return {
        uid: detail.uid,
        dom: detail.dom,
        components: extra.components,
        behaviours: augment(detail.toolbarBehaviours, extra.behaviours),
        apis: { setGroups },
        domModification: { attributes: { role: 'group' } },
      }
    }
    const Toolbar = composite$1({
      name: 'Toolbar',
      configFields: schema$e(),
      partFields: parts$2(),
      factory: factory$4,
      apis: {
        setGroups(apis, toolbar$$1, groups) {
          apis.setGroups(toolbar$$1, groups)
        },
      },
    })

    const schema$f = constant([
      strict$1('items'),
      markers(['itemSelector']),
      field$1('tgroupBehaviours', [Keying]),
    ])
    const parts$3 = constant([group({
      name: 'items',
      unit: 'item',
    })])

    const factory$5 = function (detail, components, spec, _externals) {
      return {
        uid: detail.uid,
        dom: detail.dom,
        components,
        behaviours: augment(detail.tgroupBehaviours, [Keying.config({
          mode: 'flow',
          selector: detail.markers.itemSelector,
        })]),
        domModification: { attributes: { role: 'toolbar' } },
      }
    }
    const ToolbarGroup = composite$1({
      name: 'ToolbarGroup',
      configFields: schema$f(),
      partFields: parts$3(),
      factory: factory$5,
    })

    const dataHorizontal = `data-${Styles.resolve('horizontal-scroll')}`
    const canScrollVertically = function (container) {
      container.dom().scrollTop = 1
      const result = container.dom().scrollTop !== 0
      container.dom().scrollTop = 0
      return result
    }
    const canScrollHorizontally = function (container) {
      container.dom().scrollLeft = 1
      const result = container.dom().scrollLeft !== 0
      container.dom().scrollLeft = 0
      return result
    }
    const hasVerticalScroll = function (container) {
      return container.dom().scrollTop > 0 || canScrollVertically(container)
    }
    const hasHorizontalScroll = function (container) {
      return container.dom().scrollLeft > 0 || canScrollHorizontally(container)
    }
    const markAsHorizontal = function (container) {
      set(container, dataHorizontal, 'true')
    }
    const hasScroll = function (container) {
      return get$1(container, dataHorizontal) === 'true' ? hasHorizontalScroll(container) : hasVerticalScroll(container)
    }
    const exclusive = function (scope, selector) {
      return bind$3(scope, 'touchmove', (event) => {
        closest$3(event.target(), selector).filter(hasScroll).fold(() => {
          event.raw().preventDefault()
        }, noop)
      })
    }
    const Scrollables = {
      exclusive,
      markAsHorizontal,
    }

    function ScrollingToolbar() {
      const makeGroup = function (gSpec) {
        const scrollClass = gSpec.scrollable === true ? '${prefix}-toolbar-scrollable-group' : ''
        return {
          dom: dom$2(`<div aria-label="${gSpec.label}" class="\${prefix}-toolbar-group ${scrollClass}"></div>`),
          tgroupBehaviours: derive$1([config('adhoc-scrollable-toolbar', gSpec.scrollable === true ? [runOnInit((component, simulatedEvent) => {
            set$3(component.element(), 'overflow-x', 'auto')
            Scrollables.markAsHorizontal(component.element())
            Scrollable.register(component.element())
          })] : [])]),
          components: [Container.sketch({ components: [ToolbarGroup.parts().items({})] })],
          markers: { itemSelector: `.${Styles.resolve('toolbar-group-item')}` },
          items: gSpec.items,
        }
      }
      const toolbar = build$1(Toolbar.sketch({
        dom: dom$2('<div class="${prefix}-toolbar"></div>'),
        components: [Toolbar.parts().groups({})],
        toolbarBehaviours: derive$1([
          Toggling.config({
            toggleClass: Styles.resolve('context-toolbar'),
            toggleOnExecute: false,
            aria: { mode: 'none' },
          }),
          Keying.config({ mode: 'cyclic' }),
        ]),
        shell: true,
      }))
      const wrapper = build$1(Container.sketch({
        dom: { classes: [Styles.resolve('toolstrip')] },
        components: [premade$1(toolbar)],
        containerBehaviours: derive$1([Toggling.config({
          toggleClass: Styles.resolve('android-selection-context-toolbar'),
          toggleOnExecute: false,
        })]),
      }))
      const resetGroups = function () {
        Toolbar.setGroups(toolbar, initGroups.get())
        Toggling.off(toolbar)
      }
      var initGroups = Cell([])
      const setGroups = function (gs) {
        initGroups.set(gs)
        resetGroups()
      }
      const createGroups = function (gs) {
        return map$1(gs, compose(ToolbarGroup.sketch, makeGroup))
      }
      const refresh = function () {
      }
      const setContextToolbar = function (gs) {
        Toggling.on(toolbar)
        Toolbar.setGroups(toolbar, gs)
      }
      const restoreToolbar = function () {
        if (Toggling.isOn(toolbar)) {
          resetGroups()
        }
      }
      const focus = function () {
        Keying.focusIn(toolbar)
      }
      return {
        wrapper: constant(wrapper),
        toolbar: constant(toolbar),
        createGroups,
        setGroups,
        setContextToolbar,
        restoreToolbar,
        refresh,
        focus,
      }
    }

    const makeEditSwitch = function (webapp) {
      return build$1(Button.sketch({
        dom: dom$2('<div class="${prefix}-mask-edit-icon ${prefix}-icon"></div>'),
        action() {
          webapp.run((w) => {
            w.setReadOnly(false)
          })
        },
      }))
    }
    const makeSocket = function () {
      return build$1(Container.sketch({
        dom: dom$2('<div class="${prefix}-editor-socket"></div>'),
        components: [],
        containerBehaviours: derive$1([Replacing.config({})]),
      }))
    }
    const showEdit = function (socket, switchToEdit) {
      Replacing.append(socket, premade$1(switchToEdit))
    }
    const hideEdit = function (socket, switchToEdit) {
      Replacing.remove(socket, switchToEdit)
    }
    const updateMode = function (socket, switchToEdit, readOnly, root) {
      const swap = readOnly === true ? Swapping.toAlpha : Swapping.toOmega
      swap(root)
      const f = readOnly ? showEdit : hideEdit
      f(socket, switchToEdit)
    }
    const CommonRealm = {
      makeEditSwitch,
      makeSocket,
      updateMode,
    }

    const getAnimationRoot = function (component, slideConfig) {
      return slideConfig.getAnimationRoot.fold(() => component.element(), (get) => get(component))
    }

    const getDimensionProperty = function (slideConfig) {
      return slideConfig.dimension.property
    }
    const getDimension = function (slideConfig, elem) {
      return slideConfig.dimension.getDimension(elem)
    }
    const disableTransitions = function (component, slideConfig) {
      const root = getAnimationRoot(component, slideConfig)
      remove$6(root, [
        slideConfig.shrinkingClass,
        slideConfig.growingClass,
      ])
    }
    const setShrunk = function (component, slideConfig) {
      remove$4(component.element(), slideConfig.openClass)
      add$2(component.element(), slideConfig.closedClass)
      set$3(component.element(), getDimensionProperty(slideConfig), '0px')
      reflow(component.element())
    }
    const setGrown = function (component, slideConfig) {
      remove$4(component.element(), slideConfig.closedClass)
      add$2(component.element(), slideConfig.openClass)
      remove$5(component.element(), getDimensionProperty(slideConfig))
    }
    const doImmediateShrink = function (component, slideConfig, slideState, _calculatedSize) {
      slideState.setCollapsed()
      set$3(component.element(), getDimensionProperty(slideConfig), getDimension(slideConfig, component.element()))
      reflow(component.element())
      disableTransitions(component, slideConfig)
      setShrunk(component, slideConfig)
      slideConfig.onStartShrink(component)
      slideConfig.onShrunk(component)
    }
    const doStartShrink = function (component, slideConfig, slideState, calculatedSize) {
      const size = calculatedSize.getOrThunk(() => getDimension(slideConfig, component.element()))
      slideState.setCollapsed()
      set$3(component.element(), getDimensionProperty(slideConfig), size)
      reflow(component.element())
      const root = getAnimationRoot(component, slideConfig)
      remove$4(root, slideConfig.growingClass)
      add$2(root, slideConfig.shrinkingClass)
      setShrunk(component, slideConfig)
      slideConfig.onStartShrink(component)
    }
    const doStartSmartShrink = function (component, slideConfig, slideState) {
      const size = getDimension(slideConfig, component.element())
      const shrinker = size === '0px' ? doImmediateShrink : doStartShrink
      shrinker(component, slideConfig, slideState, Option.some(size))
    }
    const doStartGrow = function (component, slideConfig, slideState) {
      const root = getAnimationRoot(component, slideConfig)
      const wasShrinking = has$2(root, slideConfig.shrinkingClass)
      const beforeSize = getDimension(slideConfig, component.element())
      setGrown(component, slideConfig)
      const fullSize = getDimension(slideConfig, component.element())
      const startPartialGrow = function () {
        set$3(component.element(), getDimensionProperty(slideConfig), beforeSize)
        reflow(component.element())
      }
      const startCompleteGrow = function () {
        setShrunk(component, slideConfig)
      }
      const setStartSize = wasShrinking ? startPartialGrow : startCompleteGrow
      setStartSize()
      remove$4(root, slideConfig.shrinkingClass)
      add$2(root, slideConfig.growingClass)
      setGrown(component, slideConfig)
      set$3(component.element(), getDimensionProperty(slideConfig), fullSize)
      slideState.setExpanded()
      slideConfig.onStartGrow(component)
    }
    const grow = function (component, slideConfig, slideState) {
      if (!slideState.isExpanded()) {
        doStartGrow(component, slideConfig, slideState)
      }
    }
    const shrink = function (component, slideConfig, slideState) {
      if (slideState.isExpanded()) {
        doStartSmartShrink(component, slideConfig, slideState)
      }
    }
    const immediateShrink = function (component, slideConfig, slideState) {
      if (slideState.isExpanded()) {
        doImmediateShrink(component, slideConfig, slideState, Option.none())
      }
    }
    const hasGrown = function (component, slideConfig, slideState) {
      return slideState.isExpanded()
    }
    const hasShrunk = function (component, slideConfig, slideState) {
      return slideState.isCollapsed()
    }
    const isGrowing = function (component, slideConfig, slideState) {
      const root = getAnimationRoot(component, slideConfig)
      return has$2(root, slideConfig.growingClass) === true
    }
    const isShrinking = function (component, slideConfig, slideState) {
      const root = getAnimationRoot(component, slideConfig)
      return has$2(root, slideConfig.shrinkingClass) === true
    }
    const isTransitioning = function (component, slideConfig, slideState) {
      return isGrowing(component, slideConfig, slideState) === true || isShrinking(component, slideConfig, slideState) === true
    }
    const toggleGrow = function (component, slideConfig, slideState) {
      const f = slideState.isExpanded() ? doStartSmartShrink : doStartGrow
      f(component, slideConfig, slideState)
    }

    const SlidingApis = /* #__PURE__ */Object.freeze({
      grow,
      shrink,
      immediateShrink,
      hasGrown,
      hasShrunk,
      isGrowing,
      isShrinking,
      isTransitioning,
      toggleGrow,
      disableTransitions,
    })

    const exhibit$5 = function (base, slideConfig) {
      const { expanded } = slideConfig
      return expanded ? nu$5({
        classes: [slideConfig.openClass],
        styles: {},
      }) : nu$5({
        classes: [slideConfig.closedClass],
        styles: wrap$2(slideConfig.dimension.property, '0px'),
      })
    }
    const events$a = function (slideConfig, slideState) {
      return derive([runOnSource(transitionend(), (component, simulatedEvent) => {
        const raw = simulatedEvent.event().raw()
        if (raw.propertyName === slideConfig.dimension.property) {
          disableTransitions(component, slideConfig)
          if (slideState.isExpanded()) {
            remove$5(component.element(), slideConfig.dimension.property)
          }
          const notify = slideState.isExpanded() ? slideConfig.onGrown : slideConfig.onShrunk
          notify(component)
        }
      })])
    }

    const ActiveSliding = /* #__PURE__ */Object.freeze({
      exhibit: exhibit$5,
      events: events$a,
    })

    const SlidingSchema = [
      strict$1('closedClass'),
      strict$1('openClass'),
      strict$1('shrinkingClass'),
      strict$1('growingClass'),
      option('getAnimationRoot'),
      onHandler('onShrunk'),
      onHandler('onStartShrink'),
      onHandler('onGrown'),
      onHandler('onStartGrow'),
      defaulted$1('expanded', false),
      strictOf('dimension', choose$1('property', {
        width: [
          output$1('property', 'width'),
          output$1('getDimension', (elem) => `${get$7(elem)}px`),
        ],
        height: [
          output$1('property', 'height'),
          output$1('getDimension', (elem) => `${get$5(elem)}px`),
        ],
      })),
    ]

    const init$5 = function (spec) {
      const state = Cell(spec.expanded)
      const readState = function () {
        return `expanded: ${state.get()}`
      }
      return nu$6({
        isExpanded() {
          return state.get() === true
        },
        isCollapsed() {
          return state.get() === false
        },
        setCollapsed: curry(state.set, false),
        setExpanded: curry(state.set, true),
        readState,
      })
    }

    const SlidingState = /* #__PURE__ */Object.freeze({
      init: init$5,
    })

    const Sliding = create$1({
      fields: SlidingSchema,
      name: 'sliding',
      active: ActiveSliding,
      apis: SlidingApis,
      state: SlidingState,
    })

    const build$2 = function (refresh, scrollIntoView) {
      const dropup = build$1(Container.sketch({
        dom: {
          tag: 'div',
          classes: [Styles.resolve('dropup')],
        },
        components: [],
        containerBehaviours: derive$1([
          Replacing.config({}),
          Sliding.config({
            closedClass: Styles.resolve('dropup-closed'),
            openClass: Styles.resolve('dropup-open'),
            shrinkingClass: Styles.resolve('dropup-shrinking'),
            growingClass: Styles.resolve('dropup-growing'),
            dimension: { property: 'height' },
            onShrunk(component) {
              refresh()
              scrollIntoView()
              Replacing.set(component, [])
            },
            onGrown(component) {
              refresh()
              scrollIntoView()
            },
          }),
          Receivers.orientation((component, data) => {
            disappear(noop)
          }),
        ]),
      }))
      const appear = function (menu, update, component) {
        if (Sliding.hasShrunk(dropup) === true && Sliding.isTransitioning(dropup) === false) {
          window.requestAnimationFrame(() => {
            update(component)
            Replacing.set(dropup, [menu()])
            Sliding.grow(dropup)
          })
        }
      }
      var disappear = function (onReadyToShrink) {
        window.requestAnimationFrame(() => {
          onReadyToShrink()
          Sliding.shrink(dropup)
        })
      }
      return {
        appear,
        disappear,
        component: constant(dropup),
        element: dropup.element,
      }
    }

    const closest$4 = function (scope, selector, isRoot) {
      return closest$3(scope, selector, isRoot).isSome()
    }

    const isDangerous = function (event$$1) {
      const keyEv = event$$1.raw()
      return keyEv.which === BACKSPACE()[0] && !contains([
        'input',
        'textarea',
      ], name(event$$1.target())) && !closest$4(event$$1.target(), '[contenteditable="true"]')
    }
    const isFirefox = PlatformDetection$1.detect().browser.isFirefox()
    const settingsSchema = objOfOnly([
      strictFunction('triggerEvent'),
      defaulted$1('stopBackspace', true),
    ])
    const bindFocus = function (container, handler) {
      if (isFirefox) {
        return capture$1(container, 'focus', handler)
      }
      return bind$3(container, 'focusin', handler)
    }
    const bindBlur = function (container, handler) {
      if (isFirefox) {
        return capture$1(container, 'blur', handler)
      }
      return bind$3(container, 'focusout', handler)
    }
    const setup$2 = function (container, rawSettings) {
      const settings = asRawOrDie('Getting GUI events settings', settingsSchema, rawSettings)
      const pointerEvents = PlatformDetection$1.detect().deviceType.isTouch() ? [
        'touchstart',
        'touchmove',
        'touchend',
        'gesturestart',
      ] : [
        'mousedown',
        'mouseup',
        'mouseover',
        'mousemove',
        'mouseout',
        'click',
      ]
      const tapEvent = monitor(settings)
      const simpleEvents = map$1(pointerEvents.concat([
        'selectstart',
        'input',
        'contextmenu',
        'change',
        'paste',
        'transitionend',
        'drag',
        'dragstart',
        'dragend',
        'dragenter',
        'dragleave',
        'dragover',
        'drop',
        'keyup',
      ]), (type$$1) => bind$3(container, type$$1, (event$$1) => {
        tapEvent.fireIfReady(event$$1, type$$1).each((tapStopped) => {
          if (tapStopped) {
            event$$1.kill()
          }
        })
        const stopped = settings.triggerEvent(type$$1, event$$1)
        if (stopped) {
          event$$1.kill()
        }
      }))
      const onKeydown = bind$3(container, 'keydown', (event$$1) => {
        const stopped = settings.triggerEvent('keydown', event$$1)
        if (stopped) {
          event$$1.kill()
        } else if (settings.stopBackspace === true && isDangerous(event$$1)) {
          event$$1.prevent()
        }
      })
      const onFocusIn = bindFocus(container, (event$$1) => {
        const stopped = settings.triggerEvent('focusin', event$$1)
        if (stopped) {
          event$$1.kill()
        }
      })
      const onFocusOut = bindBlur(container, (event$$1) => {
        const stopped = settings.triggerEvent('focusout', event$$1)
        if (stopped) {
          event$$1.kill()
        }
        setTimeout(() => {
          settings.triggerEvent(postBlur(), event$$1)
        }, 0)
      })
      const unbind = function () {
        each$1(simpleEvents, (e) => {
          e.unbind()
        })
        onKeydown.unbind()
        onFocusIn.unbind()
        onFocusOut.unbind()
      }
      return { unbind }
    }

    const derive$2 = function (rawEvent, rawTarget) {
      const source = readOptFrom$1(rawEvent, 'target').map((getTarget) => getTarget()).getOr(rawTarget)
      return Cell(source)
    }

    const fromSource = function (event, source) {
      const stopper = Cell(false)
      const cutter = Cell(false)
      const stop = function () {
        stopper.set(true)
      }
      const cut = function () {
        cutter.set(true)
      }
      return {
        stop,
        cut,
        isStopped: stopper.get,
        isCut: cutter.get,
        event: constant(event),
        setSource: source.set,
        getSource: source.get,
      }
    }
    const fromExternal = function (event) {
      const stopper = Cell(false)
      const stop = function () {
        stopper.set(true)
      }
      return {
        stop,
        cut: noop,
        isStopped: stopper.get,
        isCut: constant(false),
        event: constant(event),
        setSource: die('Cannot set source of a broadcasted event'),
        getSource: die('Cannot get source of a broadcasted event'),
      }
    }

    const adt$6 = Adt.generate([
      { stopped: [] },
      { resume: ['element'] },
      { complete: [] },
    ])
    const doTriggerHandler = function (lookup, eventType, rawEvent, target, source, logger) {
      const handler = lookup(eventType, target)
      const simulatedEvent = fromSource(rawEvent, source)
      return handler.fold(() => {
        logger.logEventNoHandlers(eventType, target)
        return adt$6.complete()
      }, (handlerInfo) => {
        const descHandler = handlerInfo.descHandler()
        const eventHandler = getCurried(descHandler)
        eventHandler(simulatedEvent)
        if (simulatedEvent.isStopped()) {
          logger.logEventStopped(eventType, handlerInfo.element(), descHandler.purpose())
          return adt$6.stopped()
        } if (simulatedEvent.isCut()) {
          logger.logEventCut(eventType, handlerInfo.element(), descHandler.purpose())
          return adt$6.complete()
        }
        return parent(handlerInfo.element()).fold(() => {
          logger.logNoParent(eventType, handlerInfo.element(), descHandler.purpose())
          return adt$6.complete()
        }, (parent$$1) => {
          logger.logEventResponse(eventType, handlerInfo.element(), descHandler.purpose())
          return adt$6.resume(parent$$1)
        })
      })
    }
    var doTriggerOnUntilStopped = function (lookup, eventType, rawEvent, rawTarget, source, logger) {
      return doTriggerHandler(lookup, eventType, rawEvent, rawTarget, source, logger).fold(() => true, (parent$$1) => doTriggerOnUntilStopped(lookup, eventType, rawEvent, parent$$1, source, logger), () => false)
    }
    const triggerHandler = function (lookup, eventType, rawEvent, target, logger) {
      const source = derive$2(rawEvent, target)
      return doTriggerHandler(lookup, eventType, rawEvent, target, source, logger)
    }
    const broadcast = function (listeners, rawEvent, logger) {
      const simulatedEvent = fromExternal(rawEvent)
      each$1(listeners, (listener) => {
        const descHandler = listener.descHandler()
        const handler = getCurried(descHandler)
        handler(simulatedEvent)
      })
      return simulatedEvent.isStopped()
    }
    const triggerUntilStopped = function (lookup, eventType, rawEvent, logger) {
      const rawTarget = rawEvent.target()
      return triggerOnUntilStopped(lookup, eventType, rawEvent, rawTarget, logger)
    }
    var triggerOnUntilStopped = function (lookup, eventType, rawEvent, rawTarget, logger) {
      const source = derive$2(rawEvent, rawTarget)
      return doTriggerOnUntilStopped(lookup, eventType, rawEvent, rawTarget, source, logger)
    }

    const eventHandler = Immutable('element', 'descHandler')
    const broadcastHandler = function (id, handler) {
      return {
        id: constant(id),
        descHandler: constant(handler),
      }
    }
    function EventRegistry() {
      const registry = {}
      const registerId = function (extraArgs, id, events) {
        each(events, (v, k) => {
          const handlers = registry[k] !== undefined ? registry[k] : {}
          handlers[id] = curryArgs(v, extraArgs)
          registry[k] = handlers
        })
      }
      const findHandler = function (handlers, elem) {
        return read$2(elem).fold(() => Option.none(), (id) => {
          const reader = readOpt$1(id)
          return handlers.bind(reader).map((descHandler) => eventHandler(elem, descHandler))
        })
      }
      const filterByType = function (type) {
        return readOptFrom$1(registry, type).map((handlers) => mapToArray(handlers, (f, id) => broadcastHandler(id, f))).getOr([])
      }
      const find$$1 = function (isAboveRoot, type, target) {
        const readType = readOpt$1(type)
        const handlers = readType(registry)
        return closest$1(target, (elem) => findHandler(handlers, elem), isAboveRoot)
      }
      const unregisterId = function (id) {
        each(registry, (handlersById, eventName) => {
          if (handlersById.hasOwnProperty(id)) {
            delete handlersById[id]
          }
        })
      }
      return {
        registerId,
        unregisterId,
        filterByType,
        find: find$$1,
      }
    }

    function Registry() {
      const events = EventRegistry()
      const components = {}
      const readOrTag = function (component) {
        const elem = component.element()
        return read$2(elem).fold(() => write('uid-', component.element()), (uid) => uid)
      }
      const failOnDuplicate = function (component, tagId) {
        const conflict = components[tagId]
        if (conflict === component) {
          unregister(component)
        } else {
          throw new Error(`The tagId "${tagId}" is already used by: ${element(conflict.element())}\nCannot use it for: ${element(component.element())}\n` + `The conflicting element is${inBody(conflict.element()) ? ' ' : ' not '}already in the DOM`)
        }
      }
      const register = function (component) {
        const tagId = readOrTag(component)
        if (hasKey$1(components, tagId)) {
          failOnDuplicate(component, tagId)
        }
        const extraArgs = [component]
        events.registerId(extraArgs, tagId, component.events())
        components[tagId] = component
      }
      var unregister = function (component) {
        read$2(component.element()).each((tagId) => {
          components[tagId] = undefined
          events.unregisterId(tagId)
        })
      }
      const filter = function (type) {
        return events.filterByType(type)
      }
      const find = function (isAboveRoot, type, target) {
        return events.find(isAboveRoot, type, target)
      }
      const getById = function (id) {
        return readOpt$1(id)(components)
      }
      return {
        find,
        filter,
        register,
        unregister,
        getById,
      }
    }

    const takeover = function (root) {
      const isAboveRoot = function (el) {
        return parent(root.element()).fold(() => true, (parent$$1) => eq(el, parent$$1))
      }
      const registry = Registry()
      const lookup = function (eventName, target) {
        return registry.find(isAboveRoot, eventName, target)
      }
      const domEvents = setup$2(root.element(), {
        triggerEvent(eventName, event) {
          return monitorEvent(eventName, event.target(), (logger) => triggerUntilStopped(lookup, eventName, event, logger))
        },
      })
      var systemApi = {
        debugInfo: constant('real'),
        triggerEvent(eventName, target, data) {
          monitorEvent(eventName, target, (logger) => {
            triggerOnUntilStopped(lookup, eventName, data, target, logger)
          })
        },
        triggerFocus(target, originator) {
          read$2(target).fold(() => {
            focus$2(target)
          }, (_alloyId) => {
            monitorEvent(focus$1(), target, (logger) => {
              triggerHandler(lookup, focus$1(), {
                originator: constant(originator),
                kill: noop,
                prevent: noop,
                target: constant(target),
              }, target, logger)
            })
          })
        },
        triggerEscape(comp, simulatedEvent) {
          systemApi.triggerEvent('keydown', comp.element(), simulatedEvent.event())
        },
        getByUid(uid) {
          return getByUid(uid)
        },
        getByDom(elem) {
          return getByDom(elem)
        },
        build: build$1,
        addToGui(c) {
          add(c)
        },
        removeFromGui(c) {
          remove$$1(c)
        },
        addToWorld(c) {
          addToWorld(c)
        },
        removeFromWorld(c) {
          removeFromWorld(c)
        },
        broadcast(message) {
          broadcast$$1(message)
        },
        broadcastOn(channels, message) {
          broadcastOn(channels, message)
        },
        broadcastEvent(eventName, event) {
          broadcastEvent(eventName, event)
        },
        isConnected: constant(true),
      }
      var addToWorld = function (component) {
        component.connect(systemApi)
        if (!isText(component.element())) {
          registry.register(component)
          each$1(component.components(), addToWorld)
          systemApi.triggerEvent(systemInit(), component.element(), { target: constant(component.element()) })
        }
      }
      var removeFromWorld = function (component) {
        if (!isText(component.element())) {
          each$1(component.components(), removeFromWorld)
          registry.unregister(component)
        }
        component.disconnect()
      }
      var add = function (component) {
        attach(root, component)
      }
      var remove$$1 = function (component) {
        detach(component)
      }
      const destroy = function () {
        domEvents.unbind()
        remove(root.element())
      }
      const broadcastData = function (data) {
        const receivers = registry.filter(receive())
        each$1(receivers, (receiver) => {
          const descHandler = receiver.descHandler()
          const handler = getCurried(descHandler)
          handler(data)
        })
      }
      var broadcast$$1 = function (message) {
        broadcastData({
          universal: constant(true),
          data: constant(message),
        })
      }
      var broadcastOn = function (channels, message) {
        broadcastData({
          universal: constant(false),
          channels: constant(channels),
          data: constant(message),
        })
      }
      var broadcastEvent = function (eventName, event) {
        const listeners = registry.filter(eventName)
        return broadcast(listeners, event)
      }
      var getByUid = function (uid) {
        return registry.getById(uid).fold(() => Result.error(new Error(`Could not find component with uid: "${uid}" in system.`)), Result.value)
      }
      var getByDom = function (elem) {
        const uid = read$2(elem).getOr('not found')
        return getByUid(uid)
      }
      addToWorld(root)
      return {
        root: constant(root),
        element: root.element,
        destroy,
        add,
        remove: remove$$1,
        getByUid,
        getByDom,
        addToWorld,
        removeFromWorld,
        broadcast: broadcast$$1,
        broadcastOn,
        broadcastEvent,
      }
    }

    const READ_ONLY_MODE_CLASS = constant(Styles.resolve('readonly-mode'))
    const EDIT_MODE_CLASS = constant(Styles.resolve('edit-mode'))
    function OuterContainer(spec) {
      const root = build$1(Container.sketch({
        dom: { classes: [Styles.resolve('outer-container')].concat(spec.classes) },
        containerBehaviours: derive$1([Swapping.config({
          alpha: READ_ONLY_MODE_CLASS(),
          omega: EDIT_MODE_CLASS(),
        })]),
      }))
      return takeover(root)
    }

    function AndroidRealm(scrollIntoView) {
      const alloy = OuterContainer({ classes: [Styles.resolve('android-container')] })
      const toolbar = ScrollingToolbar()
      const webapp = api$2()
      const switchToEdit = CommonRealm.makeEditSwitch(webapp)
      const socket = CommonRealm.makeSocket()
      const dropup = build$2(noop, scrollIntoView)
      alloy.add(toolbar.wrapper())
      alloy.add(socket)
      alloy.add(dropup.component())
      const setToolbarGroups = function (rawGroups) {
        const groups = toolbar.createGroups(rawGroups)
        toolbar.setGroups(groups)
      }
      const setContextToolbar = function (rawGroups) {
        const groups = toolbar.createGroups(rawGroups)
        toolbar.setContextToolbar(groups)
      }
      const focusToolbar = function () {
        toolbar.focus()
      }
      const restoreToolbar = function () {
        toolbar.restoreToolbar()
      }
      const init = function (spec) {
        webapp.set(AndroidWebapp.produce(spec))
      }
      const exit = function () {
        webapp.run((w) => {
          w.exit()
          Replacing.remove(socket, switchToEdit)
        })
      }
      const updateMode = function (readOnly) {
        CommonRealm.updateMode(socket, switchToEdit, readOnly, alloy.root())
      }
      return {
        system: constant(alloy),
        element: alloy.element,
        init,
        exit,
        setToolbarGroups,
        setContextToolbar,
        focusToolbar,
        restoreToolbar,
        updateMode,
        socket: constant(socket),
        dropup: constant(dropup),
      }
    }

    const input$1 = function (parent, operation) {
      const input = Element$$1.fromTag('input')
      setAll$1(input, {
        opacity: '0',
        position: 'absolute',
        top: '-1000px',
        left: '-1000px',
      })
      append(parent, input)
      focus$2(input)
      operation(input)
      remove(input)
    }
    const CaptureBin = { input: input$1 }

    const refreshInput = function (input) {
      const start = input.dom().selectionStart
      const end = input.dom().selectionEnd
      const dir = input.dom().selectionDirection
      setTimeout(() => {
        input.dom().setSelectionRange(start, end, dir)
        focus$2(input)
      }, 50)
    }
    const refresh = function (winScope) {
      const sel = winScope.getSelection()
      if (sel.rangeCount > 0) {
        const br = sel.getRangeAt(0)
        const r = winScope.document.createRange()
        r.setStart(br.startContainer, br.startOffset)
        r.setEnd(br.endContainer, br.endOffset)
        sel.removeAllRanges()
        sel.addRange(r)
      }
    }
    const CursorRefresh = {
      refreshInput,
      refresh,
    }

    const resume$1 = function (cWin, frame) {
      active().each((active$$1) => {
        if (!eq(active$$1, frame)) {
          blur$$1(active$$1)
        }
      })
      cWin.focus()
      focus$2(Element$$1.fromDom(cWin.document.body))
      CursorRefresh.refresh(cWin)
    }
    const ResumeEditing$1 = { resume: resume$1 }

    const stubborn = function (outerBody, cWin, page, frame) {
      const toEditing = function () {
        ResumeEditing$1.resume(cWin, frame)
      }
      const toReading = function () {
        CaptureBin.input(outerBody, blur$$1)
      }
      const captureInput = bind$3(page, 'keydown', (evt) => {
        if (!contains([
          'input',
          'textarea',
        ], name(evt.target()))) {
          toEditing()
        }
      })
      const onToolbarTouch = function () {
      }
      const destroy = function () {
        captureInput.unbind()
      }
      return {
        toReading,
        toEditing,
        onToolbarTouch,
        destroy,
      }
    }
    const timid = function (outerBody, cWin, page, frame) {
      const dismissKeyboard = function () {
        blur$$1(frame)
      }
      const onToolbarTouch = function () {
        dismissKeyboard()
      }
      const toReading = function () {
        dismissKeyboard()
      }
      const toEditing = function () {
        ResumeEditing$1.resume(cWin, frame)
      }
      return {
        toReading,
        toEditing,
        onToolbarTouch,
        destroy: noop,
      }
    }
    const IosKeyboard = {
      stubborn,
      timid,
    }

    const initEvents$1 = function (editorApi, iosApi, toolstrip, socket, dropup) {
      const saveSelectionFirst = function () {
        iosApi.run((api) => {
          api.highlightSelection()
        })
      }
      const refreshIosSelection = function () {
        iosApi.run((api) => {
          api.refreshSelection()
        })
      }
      const scrollToY = function (yTop, height) {
        const y = yTop - socket.dom().scrollTop
        iosApi.run((api) => {
          api.scrollIntoView(y, y + height)
        })
      }
      const scrollToElement = function (target) {
        scrollToY(iosApi, socket)
      }
      const scrollToCursor = function () {
        editorApi.getCursorBox().each((box) => {
          scrollToY(box.top(), box.height())
        })
      }
      const clearSelection = function () {
        iosApi.run((api) => {
          api.clearSelection()
        })
      }
      const clearAndRefresh = function () {
        clearSelection()
        refreshThrottle.throttle()
      }
      const refreshView = function () {
        scrollToCursor()
        iosApi.run((api) => {
          api.syncHeight()
        })
      }
      const reposition = function () {
        const toolbarHeight = get$5(toolstrip)
        iosApi.run((api) => {
          api.setViewportOffset(toolbarHeight)
        })
        refreshIosSelection()
        refreshView()
      }
      const toEditing = function () {
        iosApi.run((api) => {
          api.toEditing()
        })
      }
      const toReading = function () {
        iosApi.run((api) => {
          api.toReading()
        })
      }
      const onToolbarTouch = function (event) {
        iosApi.run((api) => {
          api.onToolbarTouch(event)
        })
      }
      const tapping = TappingEvent.monitor(editorApi)
      var refreshThrottle = last$3(refreshView, 300)
      const listeners = [
        editorApi.onKeyup(clearAndRefresh),
        editorApi.onNodeChanged(refreshIosSelection),
        editorApi.onDomChanged(refreshThrottle.throttle),
        editorApi.onDomChanged(refreshIosSelection),
        editorApi.onScrollToCursor((tinyEvent) => {
          tinyEvent.preventDefault()
          refreshThrottle.throttle()
        }),
        editorApi.onScrollToElement((event) => {
          scrollToElement(event.element())
        }),
        editorApi.onToEditing(toEditing),
        editorApi.onToReading(toReading),
        bind$3(editorApi.doc(), 'touchend', (touchEvent) => {
          if (eq(editorApi.html(), touchEvent.target()) || eq(editorApi.body(), touchEvent.target())) ;
        }),
        bind$3(toolstrip, 'transitionend', (transitionEvent) => {
          if (transitionEvent.raw().propertyName === 'height') {
            reposition()
          }
        }),
        capture$1(toolstrip, 'touchstart', (touchEvent) => {
          saveSelectionFirst()
          onToolbarTouch(touchEvent)
          editorApi.onTouchToolstrip()
        }),
        bind$3(editorApi.body(), 'touchstart', (evt) => {
          clearSelection()
          editorApi.onTouchContent()
          tapping.fireTouchstart(evt)
        }),
        tapping.onTouchmove(),
        tapping.onTouchend(),
        bind$3(editorApi.body(), 'click', (event) => {
          event.kill()
        }),
        bind$3(toolstrip, 'touchmove', () => {
          editorApi.onToolbarScrollStart()
        }),
      ]
      const destroy = function () {
        each$1(listeners, (l) => {
          l.unbind()
        })
      }
      return { destroy }
    }
    const IosEvents = { initEvents: initEvents$1 }

    function FakeSelection(win, frame) {
      const doc = win.document
      const container = Element$$1.fromTag('div')
      add$2(container, Styles.resolve('unfocused-selections'))
      append(Element$$1.fromDom(doc.documentElement), container)
      const onTouch = bind$3(container, 'touchstart', (event) => {
        event.prevent()
        ResumeEditing$1.resume(win, frame)
        clear()
      })
      const make = function (rectangle) {
        const span = Element$$1.fromTag('span')
        add$3(span, [
          Styles.resolve('layer-editor'),
          Styles.resolve('unfocused-selection'),
        ])
        setAll$1(span, {
          left: `${rectangle.left()}px`,
          top: `${rectangle.top()}px`,
          width: `${rectangle.width()}px`,
          height: `${rectangle.height()}px`,
        })
        return span
      }
      const update = function () {
        clear()
        const rectangles = Rectangles.getRectangles(win)
        const spans = map$1(rectangles, make)
        append$1(container, spans)
      }
      var clear = function () {
        empty(container)
      }
      const destroy = function () {
        onTouch.unbind()
        remove(container)
      }
      const isActive = function () {
        return children(container).length > 0
      }
      return {
        update,
        isActive,
        destroy,
        clear,
      }
    }

    var nu$7 = function (baseFn) {
      let data = Option.none()
      let callbacks = []
      const map = function (f) {
        return nu$7((nCallback) => {
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
        each$1(cbs, call)
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
        map,
        isReady,
      }
    }
    const pure$1 = function (a) {
      return nu$7((callback) => {
        callback(a)
      })
    }
    const LazyValue = {
      nu: nu$7,
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

    var nu$8 = function (baseFn) {
      const get = function (callback) {
        baseFn(bounce(callback))
      }
      const map = function (fab) {
        return nu$8((callback) => {
          get((a) => {
            const value = fab(a)
            callback(value)
          })
        })
      }
      const bind = function (aFutureB) {
        return nu$8((callback) => {
          get((a) => {
            aFutureB(a).get(callback)
          })
        })
      }
      const anonBind = function (futureB) {
        return nu$8((callback) => {
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
        return nu$8((callback) => {
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
      return nu$8((callback) => {
        callback(a)
      })
    }
    const Future = {
      nu: nu$8,
      pure: pure$2,
    }

    const adjust = function (value, destination, amount) {
      if (Math.abs(value - destination) <= amount) {
        return Option.none()
      } if (value < destination) {
        return Option.some(value + amount)
      }
      return Option.some(value - amount)
    }
    const create$7 = function () {
      let interval = null
      const animate = function (getCurrent, destination, amount, increment, doFinish, rate) {
        let finished = false
        const finish = function (v) {
          finished = true
          doFinish(v)
        }
        clearInterval(interval)
        const abort = function (v) {
          clearInterval(interval)
          finish(v)
        }
        interval = setInterval(() => {
          const value = getCurrent()
          adjust(value, destination, amount).fold(() => {
            clearInterval(interval)
            finish(destination)
          }, (s) => {
            increment(s, abort)
            if (!finished) {
              const newValue = getCurrent()
              if (newValue !== s || Math.abs(newValue - destination) > Math.abs(value - destination)) {
                clearInterval(interval)
                finish(destination)
              }
            }
          })
        }, rate)
      }
      return { animate }
    }
    const SmoothAnimation = {
      create: create$7,
      adjust,
    }

    const findDevice = function (deviceWidth, deviceHeight) {
      const devices = [
        {
          width: 320,
          height: 480,
          keyboard: {
            portrait: 300,
            landscape: 240,
          },
        },
        {
          width: 320,
          height: 568,
          keyboard: {
            portrait: 300,
            landscape: 240,
          },
        },
        {
          width: 375,
          height: 667,
          keyboard: {
            portrait: 305,
            landscape: 240,
          },
        },
        {
          width: 414,
          height: 736,
          keyboard: {
            portrait: 320,
            landscape: 240,
          },
        },
        {
          width: 768,
          height: 1024,
          keyboard: {
            portrait: 320,
            landscape: 400,
          },
        },
        {
          width: 1024,
          height: 1366,
          keyboard: {
            portrait: 380,
            landscape: 460,
          },
        },
      ]
      return findMap(devices, (device) => deviceWidth <= device.width && deviceHeight <= device.height ? Option.some(device.keyboard) : Option.none()).getOr({
        portrait: deviceHeight / 5,
        landscape: deviceWidth / 4,
      })
    }
    const Devices = { findDevice }

    const softKeyboardLimits = function (outerWindow) {
      return Devices.findDevice(outerWindow.screen.width, outerWindow.screen.height)
    }
    const accountableKeyboardHeight = function (outerWindow) {
      const portrait = Orientation.get(outerWindow).isPortrait()
      const limits = softKeyboardLimits(outerWindow)
      const keyboard = portrait ? limits.portrait : limits.landscape
      const visualScreenHeight = portrait ? outerWindow.screen.height : outerWindow.screen.width
      return visualScreenHeight - outerWindow.innerHeight > keyboard ? 0 : keyboard
    }
    const getGreenzone = function (socket, dropup) {
      const outerWindow = owner(socket).dom().defaultView
      const viewportHeight = get$5(socket) + get$5(dropup)
      const acc = accountableKeyboardHeight(outerWindow)
      return viewportHeight - acc
    }
    const updatePadding = function (contentBody, socket, dropup) {
      const greenzoneHeight = getGreenzone(socket, dropup)
      const deltaHeight = get$5(socket) + get$5(dropup) - greenzoneHeight
      set$3(contentBody, 'padding-bottom', `${deltaHeight}px`)
    }
    const DeviceZones = {
      getGreenzone,
      updatePadding,
    }

    const fixture = Adt.generate([
      {
        fixed: [
          'element',
          'property',
          'offsetY',
        ],
      },
      {
        scroller: [
          'element',
          'offsetY',
        ],
      },
    ])
    const yFixedData = `data-${Styles.resolve('position-y-fixed')}`
    const yFixedProperty = `data-${Styles.resolve('y-property')}`
    const yScrollingData = `data-${Styles.resolve('scrolling')}`
    const windowSizeData = `data-${Styles.resolve('last-window-height')}`
    const getYFixedData = function (element) {
      return DataAttributes.safeParse(element, yFixedData)
    }
    const getYFixedProperty = function (element) {
      return get$1(element, yFixedProperty)
    }
    const getLastWindowSize = function (element) {
      return DataAttributes.safeParse(element, windowSizeData)
    }
    const classifyFixed = function (element, offsetY) {
      const prop = getYFixedProperty(element)
      return fixture.fixed(element, prop, offsetY)
    }
    const classifyScrolling = function (element, offsetY) {
      return fixture.scroller(element, offsetY)
    }
    const classify = function (element) {
      const offsetY = getYFixedData(element)
      const classifier = get$1(element, yScrollingData) === 'true' ? classifyScrolling : classifyFixed
      return classifier(element, offsetY)
    }
    const findFixtures = function (container) {
      const candidates = descendants$1(container, `[${yFixedData}]`)
      return map$1(candidates, classify)
    }
    const takeoverToolbar = function (toolbar) {
      const oldToolbarStyle = get$1(toolbar, 'style')
      setAll$1(toolbar, {
        position: 'absolute',
        top: '0px',
      })
      set(toolbar, yFixedData, '0px')
      set(toolbar, yFixedProperty, 'top')
      const restore = function () {
        set(toolbar, 'style', oldToolbarStyle || '')
        remove$1(toolbar, yFixedData)
        remove$1(toolbar, yFixedProperty)
      }
      return { restore }
    }
    const takeoverViewport = function (toolbarHeight, height, viewport) {
      const oldViewportStyle = get$1(viewport, 'style')
      Scrollable.register(viewport)
      setAll$1(viewport, {
        position: 'absolute',
        height: `${height}px`,
        width: '100%',
        top: `${toolbarHeight}px`,
      })
      set(viewport, yFixedData, `${toolbarHeight}px`)
      set(viewport, yScrollingData, 'true')
      set(viewport, yFixedProperty, 'top')
      const restore = function () {
        Scrollable.deregister(viewport)
        set(viewport, 'style', oldViewportStyle || '')
        remove$1(viewport, yFixedData)
        remove$1(viewport, yScrollingData)
        remove$1(viewport, yFixedProperty)
      }
      return { restore }
    }
    const takeoverDropup = function (dropup, toolbarHeight, viewportHeight) {
      const oldDropupStyle = get$1(dropup, 'style')
      setAll$1(dropup, {
        position: 'absolute',
        bottom: '0px',
      })
      set(dropup, yFixedData, '0px')
      set(dropup, yFixedProperty, 'bottom')
      const restore = function () {
        set(dropup, 'style', oldDropupStyle || '')
        remove$1(dropup, yFixedData)
        remove$1(dropup, yFixedProperty)
      }
      return { restore }
    }
    const deriveViewportHeight = function (viewport, toolbarHeight, dropupHeight) {
      const outerWindow = owner(viewport).dom().defaultView
      const winH = outerWindow.innerHeight
      set(viewport, windowSizeData, `${winH}px`)
      return winH - toolbarHeight - dropupHeight
    }
    const takeover$1 = function (viewport, contentBody, toolbar, dropup) {
      const outerWindow = owner(viewport).dom().defaultView
      const toolbarSetup = takeoverToolbar(toolbar)
      const toolbarHeight = get$5(toolbar)
      const dropupHeight = get$5(dropup)
      const viewportHeight = deriveViewportHeight(viewport, toolbarHeight, dropupHeight)
      const viewportSetup = takeoverViewport(toolbarHeight, viewportHeight, viewport)
      const dropupSetup = takeoverDropup(dropup, toolbarHeight, viewportHeight)
      let isActive = true
      const restore = function () {
        isActive = false
        toolbarSetup.restore()
        viewportSetup.restore()
        dropupSetup.restore()
      }
      const isExpanding = function () {
        const currentWinHeight = outerWindow.innerHeight
        const lastWinHeight = getLastWindowSize(viewport)
        return currentWinHeight > lastWinHeight
      }
      const refresh = function () {
        if (isActive) {
          const newToolbarHeight = get$5(toolbar)
          const dropupHeight_1 = get$5(dropup)
          const newHeight = deriveViewportHeight(viewport, newToolbarHeight, dropupHeight_1)
          set(viewport, yFixedData, `${newToolbarHeight}px`)
          set$3(viewport, 'height', `${newHeight}px`)
          set$3(dropup, 'bottom', `${-(newToolbarHeight + newHeight + dropupHeight_1)}px`)
          DeviceZones.updatePadding(contentBody, viewport, dropup)
        }
      }
      const setViewportOffset = function (newYOffset) {
        const offsetPx = `${newYOffset}px`
        set(viewport, yFixedData, offsetPx)
        refresh()
      }
      DeviceZones.updatePadding(contentBody, viewport, dropup)
      return {
        setViewportOffset,
        isExpanding,
        isShrinking: not(isExpanding),
        refresh,
        restore,
      }
    }
    const IosViewport = {
      findFixtures,
      takeover: takeover$1,
      getYFixedData,
    }

    const animator = SmoothAnimation.create()
    const ANIMATION_STEP = 15
    const NUM_TOP_ANIMATION_FRAMES = 10
    const ANIMATION_RATE = 10
    const lastScroll = `data-${Styles.resolve('last-scroll-top')}`
    const getTop = function (element) {
      const raw = getRaw(element, 'top').getOr('0')
      return parseInt(raw, 10)
    }
    const getScrollTop = function (element) {
      return parseInt(element.dom().scrollTop, 10)
    }
    const moveScrollAndTop = function (element, destination, finalTop) {
      return Future.nu((callback) => {
        const getCurrent = curry(getScrollTop, element)
        const update = function (newScroll) {
          element.dom().scrollTop = newScroll
          set$3(element, 'top', `${getTop(element) + ANIMATION_STEP}px`)
        }
        const finish = function () {
          element.dom().scrollTop = destination
          set$3(element, 'top', `${finalTop}px`)
          callback(destination)
        }
        animator.animate(getCurrent, destination, ANIMATION_STEP, update, finish, ANIMATION_RATE)
      })
    }
    const moveOnlyScroll = function (element, destination) {
      return Future.nu((callback) => {
        const getCurrent = curry(getScrollTop, element)
        set(element, lastScroll, getCurrent())
        const update = function (newScroll, abort) {
          const previous = DataAttributes.safeParse(element, lastScroll)
          if (previous !== element.dom().scrollTop) {
            abort(element.dom().scrollTop)
          } else {
            element.dom().scrollTop = newScroll
            set(element, lastScroll, newScroll)
          }
        }
        const finish = function () {
          element.dom().scrollTop = destination
          set(element, lastScroll, destination)
          callback(destination)
        }
        const distance = Math.abs(destination - getCurrent())
        const step = Math.ceil(distance / NUM_TOP_ANIMATION_FRAMES)
        animator.animate(getCurrent, destination, step, update, finish, ANIMATION_RATE)
      })
    }
    const moveOnlyTop = function (element, destination) {
      return Future.nu((callback) => {
        const getCurrent = curry(getTop, element)
        const update = function (newTop) {
          set$3(element, 'top', `${newTop}px`)
        }
        const finish = function () {
          update(destination)
          callback(destination)
        }
        const distance = Math.abs(destination - getCurrent())
        const step = Math.ceil(distance / NUM_TOP_ANIMATION_FRAMES)
        animator.animate(getCurrent, destination, step, update, finish, ANIMATION_RATE)
      })
    }
    const updateTop = function (element, amount) {
      const newTop = `${amount + IosViewport.getYFixedData(element)}px`
      set$3(element, 'top', newTop)
    }
    const moveWindowScroll = function (toolbar, viewport, destY) {
      const outerWindow = owner(toolbar).dom().defaultView
      return Future.nu((callback) => {
        updateTop(toolbar, destY)
        updateTop(viewport, destY)
        outerWindow.scrollTo(0, destY)
        callback(destY)
      })
    }
    const IosScrolling = {
      moveScrollAndTop,
      moveOnlyScroll,
      moveOnlyTop,
      moveWindowScroll,
    }

    function BackgroundActivity(doAction) {
      const action = Cell(LazyValue.pure({}))
      const start = function (value) {
        const future = LazyValue.nu((callback) => doAction(value).get(callback))
        action.set(future)
      }
      const idle = function (g) {
        action.get().get(() => {
          g()
        })
      }
      return {
        start,
        idle,
      }
    }

    const scrollIntoView = function (cWin, socket, dropup, top, bottom) {
      const greenzone = DeviceZones.getGreenzone(socket, dropup)
      const refreshCursor = curry(CursorRefresh.refresh, cWin)
      if (top > greenzone || bottom > greenzone) {
        IosScrolling.moveOnlyScroll(socket, socket.dom().scrollTop - greenzone + bottom).get(refreshCursor)
      } else if (top < 0) {
        IosScrolling.moveOnlyScroll(socket, socket.dom().scrollTop + top).get(refreshCursor)
      }
    }
    const Greenzone = { scrollIntoView }

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
          each$1(asyncValues, (asyncValue, i) => {
            asyncValue.get(cb(i))
          })
        }
      })
    }

    const par$1 = function (futures) {
      return par(futures, Future.nu)
    }

    const updateFixed = function (element, property, winY, offsetY) {
      const destination = winY + offsetY
      set$3(element, property, `${destination}px`)
      return Future.pure(offsetY)
    }
    const updateScrollingFixed = function (element, winY, offsetY) {
      const destTop = winY + offsetY
      const oldProp = getRaw(element, 'top').getOr(offsetY)
      const delta = destTop - parseInt(oldProp, 10)
      const destScroll = element.dom().scrollTop + delta
      return IosScrolling.moveScrollAndTop(element, destScroll, destTop)
    }
    const updateFixture = function (fixture, winY) {
      return fixture.fold((element, property, offsetY) => updateFixed(element, property, winY, offsetY), (element, offsetY) => updateScrollingFixed(element, winY, offsetY))
    }
    const updatePositions = function (container, winY) {
      const fixtures = IosViewport.findFixtures(container)
      const updates = map$1(fixtures, (fixture) => updateFixture(fixture, winY))
      return par$1(updates)
    }
    const IosUpdates = { updatePositions }

    const VIEW_MARGIN = 5
    const register$2 = function (toolstrip, socket, container, outerWindow, structure, cWin) {
      const scroller = BackgroundActivity((y) => IosScrolling.moveWindowScroll(toolstrip, socket, y))
      const scrollBounds = function () {
        const rects = Rectangles.getRectangles(cWin)
        return Option.from(rects[0]).bind((rect) => {
          const viewTop = rect.top() - socket.dom().scrollTop
          const outside = viewTop > outerWindow.innerHeight + VIEW_MARGIN || viewTop < -VIEW_MARGIN
          return outside ? Option.some({
            top: constant(viewTop),
            bottom: constant(viewTop + rect.height()),
          }) : Option.none()
        })
      }
      const scrollThrottle = last$3(() => {
        scroller.idle(() => {
          IosUpdates.updatePositions(container, outerWindow.pageYOffset).get(() => {
            const extraScroll = scrollBounds()
            extraScroll.each((extra) => {
              socket.dom().scrollTop = socket.dom().scrollTop + extra.top()
            })
            scroller.start(0)
            structure.refresh()
          })
        })
      }, 1000)
      const onScroll = bind$3(Element$$1.fromDom(outerWindow), 'scroll', () => {
        if (outerWindow.pageYOffset < 0) {
          return
        }
        scrollThrottle.throttle()
      })
      IosUpdates.updatePositions(container, outerWindow.pageYOffset).get(identity)
      return { unbind: onScroll.unbind }
    }
    const setup$3 = function (bag) {
      const cWin = bag.cWin()
      const ceBody = bag.ceBody()
      const socket = bag.socket()
      const toolstrip = bag.toolstrip()
      const toolbar = bag.toolbar()
      const contentElement = bag.contentElement()
      const keyboardType = bag.keyboardType()
      const outerWindow = bag.outerWindow()
      const dropup = bag.dropup()
      const structure = IosViewport.takeover(socket, ceBody, toolstrip, dropup)
      const keyboardModel = keyboardType(bag.outerBody(), cWin, body(), contentElement, toolstrip, toolbar)
      const toEditing = function () {
        keyboardModel.toEditing()
        clearSelection()
      }
      const toReading = function () {
        keyboardModel.toReading()
      }
      const onToolbarTouch = function (event) {
        keyboardModel.onToolbarTouch(event)
      }
      const onOrientation = Orientation.onChange(outerWindow, {
        onChange: noop,
        onReady: structure.refresh,
      })
      onOrientation.onAdjustment(() => {
        structure.refresh()
      })
      const onResize = bind$3(Element$$1.fromDom(outerWindow), 'resize', () => {
        if (structure.isExpanding()) {
          structure.refresh()
        }
      })
      const onScroll = register$2(toolstrip, socket, bag.outerBody(), outerWindow, structure, cWin)
      const unfocusedSelection = FakeSelection(cWin, contentElement)
      const refreshSelection = function () {
        if (unfocusedSelection.isActive()) {
          unfocusedSelection.update()
        }
      }
      const highlightSelection = function () {
        unfocusedSelection.update()
      }
      var clearSelection = function () {
        unfocusedSelection.clear()
      }
      const scrollIntoView = function (top, bottom) {
        Greenzone.scrollIntoView(cWin, socket, dropup, top, bottom)
      }
      const syncHeight = function () {
        set$3(contentElement, 'height', `${contentElement.dom().contentWindow.document.body.scrollHeight}px`)
      }
      const setViewportOffset = function (newYOffset) {
        structure.setViewportOffset(newYOffset)
        IosScrolling.moveOnlyTop(socket, newYOffset).get(identity)
      }
      const destroy = function () {
        structure.restore()
        onOrientation.destroy()
        onScroll.unbind()
        onResize.unbind()
        keyboardModel.destroy()
        unfocusedSelection.destroy()
        CaptureBin.input(body(), blur$$1)
      }
      return {
        toEditing,
        toReading,
        onToolbarTouch,
        refreshSelection,
        clearSelection,
        highlightSelection,
        scrollIntoView,
        updateToolbarPadding: noop,
        setViewportOffset,
        syncHeight,
        refreshStructure: structure.refresh,
        destroy,
      }
    }
    const IosSetup = { setup: setup$3 }

    const create$8 = function (platform, mask) {
      const meta = MetaViewport.tag()
      const priorState = value$3()
      const scrollEvents = value$3()
      const iosApi = api$2()
      const iosEvents = api$2()
      const enter = function () {
        mask.hide()
        const doc = Element$$1.fromDom(document)
        PlatformEditor.getActiveApi(platform.editor).each((editorApi) => {
          priorState.set({
            socketHeight: getRaw(platform.socket, 'height'),
            iframeHeight: getRaw(editorApi.frame(), 'height'),
            outerScroll: document.body.scrollTop,
          })
          scrollEvents.set({ exclusives: Scrollables.exclusive(doc, `.${Scrollable.scrollable()}`) })
          add$2(platform.container, Styles.resolve('fullscreen-maximized'))
          Thor.clobberStyles(platform.container, editorApi.body())
          meta.maximize()
          set$3(platform.socket, 'overflow', 'scroll')
          set$3(platform.socket, '-webkit-overflow-scrolling', 'touch')
          focus$2(editorApi.body())
          const setupBag = MixedBag([
            'cWin',
            'ceBody',
            'socket',
            'toolstrip',
            'toolbar',
            'dropup',
            'contentElement',
            'cursor',
            'keyboardType',
            'isScrolling',
            'outerWindow',
            'outerBody',
          ], [])
          iosApi.set(IosSetup.setup(setupBag({
            cWin: editorApi.win(),
            ceBody: editorApi.body(),
            socket: platform.socket,
            toolstrip: platform.toolstrip,
            toolbar: platform.toolbar,
            dropup: platform.dropup.element(),
            contentElement: editorApi.frame(),
            cursor: noop,
            outerBody: platform.body,
            outerWindow: platform.win,
            keyboardType: IosKeyboard.stubborn,
            isScrolling() {
              const scrollValue = scrollEvents
              return scrollValue.get().exists((s) => s.socket.isScrolling())
            },
          })))
          iosApi.run((api) => {
            api.syncHeight()
          })
          iosEvents.set(IosEvents.initEvents(editorApi, iosApi, platform.toolstrip, platform.socket, platform.dropup))
        })
      }
      const exit = function () {
        meta.restore()
        iosEvents.clear()
        iosApi.clear()
        mask.show()
        priorState.on((s) => {
          s.socketHeight.each((h) => {
            set$3(platform.socket, 'height', h)
          })
          s.iframeHeight.each((h) => {
            set$3(platform.editor.getFrame(), 'height', h)
          })
          document.body.scrollTop = s.scrollTop
        })
        priorState.clear()
        scrollEvents.on((s) => {
          s.exclusives.unbind()
        })
        scrollEvents.clear()
        remove$4(platform.container, Styles.resolve('fullscreen-maximized'))
        Thor.restoreStyles()
        Scrollable.deregister(platform.toolbar)
        remove$5(platform.socket, 'overflow')
        remove$5(platform.socket, '-webkit-overflow-scrolling')
        blur$$1(platform.editor.getFrame())
        PlatformEditor.getActiveApi(platform.editor).each((editorApi) => {
          editorApi.clearSelection()
        })
      }
      const refreshStructure = function () {
        iosApi.run((api) => {
          api.refreshStructure()
        })
      }
      return {
        enter,
        refreshStructure,
        exit,
      }
    }
    const IosMode = { create: create$8 }

    const produce$1 = function (raw) {
      const mobile = asRawOrDie('Getting IosWebapp schema', MobileSchema, raw)
      set$3(mobile.toolstrip, 'width', '100%')
      set$3(mobile.container, 'position', 'relative')
      const onView = function () {
        mobile.setReadOnly(mobile.readOnlyOnInit())
        mode.enter()
      }
      const mask = build$1(TapToEditMask.sketch(onView, mobile.translate))
      mobile.alloy.add(mask)
      const maskApi = {
        show() {
          mobile.alloy.add(mask)
        },
        hide() {
          mobile.alloy.remove(mask)
        },
      }
      var mode = IosMode.create(mobile, maskApi)
      return {
        setReadOnly: mobile.setReadOnly,
        refreshStructure: mode.refreshStructure,
        enter: mode.enter,
        exit: mode.exit,
        destroy: noop,
      }
    }
    const IosWebapp = { produce: produce$1 }

    function IosRealm(scrollIntoView) {
      const alloy = OuterContainer({ classes: [Styles.resolve('ios-container')] })
      const toolbar = ScrollingToolbar()
      const webapp = api$2()
      const switchToEdit = CommonRealm.makeEditSwitch(webapp)
      const socket = CommonRealm.makeSocket()
      const dropup = build$2(() => {
        webapp.run((w) => {
          w.refreshStructure()
        })
      }, scrollIntoView)
      alloy.add(toolbar.wrapper())
      alloy.add(socket)
      alloy.add(dropup.component())
      const setToolbarGroups = function (rawGroups) {
        const groups = toolbar.createGroups(rawGroups)
        toolbar.setGroups(groups)
      }
      const setContextToolbar = function (rawGroups) {
        const groups = toolbar.createGroups(rawGroups)
        toolbar.setContextToolbar(groups)
      }
      const focusToolbar = function () {
        toolbar.focus()
      }
      const restoreToolbar = function () {
        toolbar.restoreToolbar()
      }
      const init = function (spec) {
        webapp.set(IosWebapp.produce(spec))
      }
      const exit = function () {
        webapp.run((w) => {
          Replacing.remove(socket, switchToEdit)
          w.exit()
        })
      }
      const updateMode = function (readOnly) {
        CommonRealm.updateMode(socket, switchToEdit, readOnly, alloy.root())
      }
      return {
        system: constant(alloy),
        element: alloy.element,
        init,
        exit,
        setToolbarGroups,
        setContextToolbar,
        focusToolbar,
        restoreToolbar,
        updateMode,
        socket: constant(socket),
        dropup: constant(dropup),
      }
    }

    const global$2 = tinymce.util.Tools.resolve('tinymce.EditorManager')

    const derive$3 = function (editor) {
      const base = readOptFrom$1(editor.settings, 'skin_url').fold(() => `${global$2.baseURL}/skins/ui/oxide`, (url) => url)
      return {
        content: `${base}/content.mobile.min.css`,
        ui: `${base}/skin.mobile.min.css`,
      }
    }
    const CssUrls = { derive: derive$3 }

    const fontSizes = [
      'x-small',
      'small',
      'medium',
      'large',
      'x-large',
    ]
    const fireChange = function (realm, command, state) {
      realm.system().broadcastOn([TinyChannels.formatChanged()], {
        command,
        state,
      })
    }
    const init$6 = function (realm, editor) {
      const allFormats = keys(editor.formatter.get())
      each$1(allFormats, (command) => {
        editor.formatter.formatChanged(command, (state) => {
          fireChange(realm, command, state)
        })
      })
      each$1([
        'ul',
        'ol',
      ], (command) => {
        editor.selection.selectorChanged(command, (state, data) => {
          fireChange(realm, command, state)
        })
      })
    }
    const FormatChangers = {
      init: init$6,
      fontSizes: constant(fontSizes),
    }

    const fireSkinLoaded = function (editor) {
      const done = function () {
        editor._skinLoaded = true
        editor.fire('SkinLoaded')
      }
      return function () {
        if (editor.initialized) {
          done()
        } else {
          editor.on('init', done)
        }
      }
    }
    const SkinLoaded = { fireSkinLoaded }

    const READING = constant('toReading')
    const EDITING = constant('toEditing')
    const renderMobileTheme = function (editor) {
      const renderUI = function () {
        const targetNode = editor.getElement()
        const cssUrls = CssUrls.derive(editor)
        if (isSkinDisabled(editor) === false) {
          editor.contentCSS.push(cssUrls.content)
          global.DOM.styleSheetLoader.load(cssUrls.ui, SkinLoaded.fireSkinLoaded(editor))
        } else {
          SkinLoaded.fireSkinLoaded(editor)()
        }
        const doScrollIntoView = function () {
          editor.fire('scrollIntoView')
        }
        const wrapper = Element$$1.fromTag('div')
        const realm = PlatformDetection$1.detect().os.isAndroid() ? AndroidRealm(doScrollIntoView) : IosRealm(doScrollIntoView)
        const original = Element$$1.fromDom(targetNode)
        after(original, wrapper)
        attachSystem(wrapper, realm.system())
        const findFocusIn = function (elem) {
          return search(elem).bind((focused) => realm.system().getByDom(focused).toOption())
        }
        const outerWindow = targetNode.ownerDocument.defaultView
        const orientation = Orientation.onChange(outerWindow, {
          onChange() {
            const alloy = realm.system()
            alloy.broadcastOn([TinyChannels.orientationChanged()], { width: Orientation.getActualWidth(outerWindow) })
          },
          onReady: noop,
        })
        const setReadOnly = function (dynamicGroup, readOnlyGroups, mainGroups, ro) {
          if (ro === false) {
            editor.selection.collapse()
          }
          const toolbars = configureToolbar(dynamicGroup, readOnlyGroups, mainGroups)
          realm.setToolbarGroups(ro === true ? toolbars.readOnly : toolbars.main)
          editor.setMode(ro === true ? 'readonly' : 'design')
          editor.fire(ro === true ? READING() : EDITING())
          realm.updateMode(ro)
        }
        var configureToolbar = function (dynamicGroup, readOnlyGroups, mainGroups) {
          const dynamic = dynamicGroup.get()
          const toolbars = {
            readOnly: dynamic.backToMask.concat(readOnlyGroups.get()),
            main: dynamic.backToMask.concat(mainGroups.get()),
          }
          return toolbars
        }
        const bindHandler = function (label, handler) {
          editor.on(label, handler)
          return {
            unbind() {
              editor.off(label)
            },
          }
        }
        editor.on('init', () => {
          realm.init({
            editor: {
              getFrame() {
                return Element$$1.fromDom(editor.contentAreaContainer.querySelector('iframe'))
              },
              onDomChanged() {
                return { unbind: noop }
              },
              onToReading(handler) {
                return bindHandler(READING(), handler)
              },
              onToEditing(handler) {
                return bindHandler(EDITING(), handler)
              },
              onScrollToCursor(handler) {
                editor.on('scrollIntoView', (tinyEvent) => {
                  handler(tinyEvent)
                })
                const unbind = function () {
                  editor.off('scrollIntoView')
                  orientation.destroy()
                }
                return { unbind }
              },
              onTouchToolstrip() {
                hideDropup()
              },
              onTouchContent() {
                const toolbar = Element$$1.fromDom(editor.editorContainer.querySelector(`.${Styles.resolve('toolbar')}`))
                findFocusIn(toolbar).each(emitExecute)
                realm.restoreToolbar()
                hideDropup()
              },
              onTapContent(evt) {
                const target = evt.target()
                if (name(target) === 'img') {
                  editor.selection.select(target.dom())
                  evt.kill()
                } else if (name(target) === 'a') {
                  const component = realm.system().getByDom(Element$$1.fromDom(editor.editorContainer))
                  component.each((container) => {
                    if (Swapping.isAlpha(container)) {
                      TinyCodeDupe.openLink(target.dom())
                    }
                  })
                }
              },
            },
            container: Element$$1.fromDom(editor.editorContainer),
            socket: Element$$1.fromDom(editor.contentAreaContainer),
            toolstrip: Element$$1.fromDom(editor.editorContainer.querySelector(`.${Styles.resolve('toolstrip')}`)),
            toolbar: Element$$1.fromDom(editor.editorContainer.querySelector(`.${Styles.resolve('toolbar')}`)),
            dropup: realm.dropup(),
            alloy: realm.system(),
            translate: noop,
            setReadOnly(ro) {
              setReadOnly(dynamicGroup, readOnlyGroups, mainGroups, ro)
            },
            readOnlyOnInit() {
              return readOnlyOnInit(editor)
            },
          })
          var hideDropup = function () {
            realm.dropup().disappear(() => {
              realm.system().broadcastOn([TinyChannels.dropupDismissed()], {})
            })
          }
          const backToMaskGroup = {
            label: 'The first group',
            scrollable: false,
            items: [Buttons.forToolbar('back', () => {
              editor.selection.collapse()
              realm.exit()
            }, {})],
          }
          const backToReadOnlyGroup = {
            label: 'Back to read only',
            scrollable: false,
            items: [Buttons.forToolbar('readonly-back', () => {
              setReadOnly(dynamicGroup, readOnlyGroups, mainGroups, true)
            }, {})],
          }
          const readOnlyGroup = {
            label: 'The read only mode group',
            scrollable: true,
            items: [],
          }
          const features = Features.setup(realm, editor)
          const items = Features.detect(editor.settings, features)
          const actionGroup = {
            label: 'the action group',
            scrollable: true,
            items,
          }
          const extraGroup = {
            label: 'The extra group',
            scrollable: false,
            items: [],
          }
          var mainGroups = Cell([
            actionGroup,
            extraGroup,
          ])
          var readOnlyGroups = Cell([
            readOnlyGroup,
            extraGroup,
          ])
          var dynamicGroup = Cell({
            backToMask: [backToMaskGroup],
            backToReadOnly: [backToReadOnlyGroup],
          })
          FormatChangers.init(realm, editor)
        })
        return {
          iframeContainer: realm.socket().element().dom(),
          editorContainer: realm.element().dom(),
        }
      }
      return {
        getNotificationManagerImpl() {
          return {
            open: constant({
              progressBar: { value: noop },
              close: noop,
            }),
            close: noop,
            reposition: noop,
            getArgs: identity,
          }
        },
        renderUI,
      }
    }
    global$1.add('mobile', renderMobileTheme)
    function Theme() {
    }

    exports.renderMobileTheme = renderMobileTheme
    exports.default = Theme

    return exports
  }({}))
})()
