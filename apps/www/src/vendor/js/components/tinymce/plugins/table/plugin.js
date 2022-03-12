(function () {
  const table = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

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
    const last = function (xs) {
      return xs.length === 0 ? Option.none() : Option.some(xs[xs.length - 1])
    }
    const from$1 = isFunction(Array.from) ? Array.from : function (x) {
      return slice.call(x)
    }

    const { keys } = Object
    const { hasOwnProperty } = Object
    const each$1 = function (obj, f) {
      const props = keys(obj)
      for (let k = 0, len = props.length; k < len; k++) {
        const i = props[k]
        const x = obj[i]
        f(x, i, obj)
      }
    }
    const map$1 = function (obj, f) {
      return tupleMap(obj, (x, i, obj) => ({
        k: i,
        v: f(x, i, obj),
      }))
    }
    var tupleMap = function (obj, f) {
      const r = {}
      each$1(obj, (x, i) => {
        const tuple = f(x, i, obj)
        r[tuple.k] = tuple.v
      })
      return r
    }
    const get = function (obj, key) {
      return has(obj, key) ? Option.some(obj[key]) : Option.none()
    }
    var has = function (obj, key) {
      return hasOwnProperty.call(obj, key)
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
      each(array, (a) => {
        if (!isString(a)) { throw new Error(`The value ${a} in the ${label} fields was not a string.`) }
      })
    }
    const invalidTypeMessage = function (incorrect, type) {
      throw new Error(`All values need to be of type: ${type}. Keys (${sort$1(incorrect).join(', ')}) were not.`)
    }
    const checkDupes = function (everything) {
      const sorted = sort$1(everything)
      const dupe = find(sorted, (s, i) => i < sorted.length - 1 && s === sorted[i + 1])
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
        each(required, (req) => {
          r[req] = constant(obj[req])
        })
        each(optional, (opt) => {
          r[opt] = constant(Object.prototype.hasOwnProperty.call(obj, opt) ? Option.some(obj[opt]) : Option.none())
        })
        return r
      }
    }

    const dimensions = Immutable('width', 'height')
    const grid = Immutable('rows', 'columns')
    const address = Immutable('row', 'column')
    const coords = Immutable('x', 'y')
    const detail = Immutable('element', 'rowspan', 'colspan')
    const detailnew = Immutable('element', 'rowspan', 'colspan', 'isNew')
    const extended = Immutable('element', 'rowspan', 'colspan', 'row', 'column')
    const rowdata = Immutable('element', 'cells', 'section')
    const elementnew = Immutable('element', 'isNew')
    const rowdatanew = Immutable('element', 'cells', 'section', 'isNew')
    const rowcells = Immutable('cells', 'section')
    const rowdetails = Immutable('details', 'section')
    const bounds = Immutable('startRow', 'startCol', 'finishRow', 'finishCol')
    const Structs = {
      dimensions,
      grid,
      address,
      coords,
      extended,
      detail,
      detailnew,
      rowdata,
      elementnew,
      rowdatanew,
      rowcells,
      rowdetails,
      bounds,
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
      return bypassSelector(base) ? [] : map(base.querySelectorAll(selector), Element$$1.fromDom)
    }
    const one = function (selector, scope) {
      const base = scope === undefined ? document : scope.dom()
      return bypassSelector(base) ? Option.none() : Option.from(base.querySelector(selector)).map(Element$$1.fromDom)
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

    const checkRange = function (str, substr, start) {
      if (substr === '') { return true }
      if (str.length < substr.length) { return false }
      const x = str.substr(start, start + substr.length)
      return x === substr
    }
    const contains$1 = function (str, substr) {
      return str.indexOf(substr) !== -1
    }
    const startsWith = function (str, prefix) {
      return checkRange(str, prefix, 0)
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
    const is$1 = is

    const owner = function (element) {
      return Element$$1.fromDom(element.dom().ownerDocument)
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
    const spot = Immutable('element', 'offset')

    const firstLayer = function (scope, selector) {
      return filterFirstLayer(scope, selector, constant(true))
    }
    var filterFirstLayer = function (scope, selector, predicate) {
      return bind(children(scope), (x) => is(x, selector) ? predicate(x) ? [x] : [] : filterFirstLayer(x, selector, predicate))
    }
    const LayerSelector = {
      firstLayer,
      filterFirstLayer,
    }

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
    const isComment = function (element) {
      return type(element) === COMMENT || name(element) === '#comment'
    }
    const isElement = isType$1(ELEMENT)
    const isText = isType$1(TEXT)
    const isDocument = isType$1(DOCUMENT)

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
      each$1(attrs, (v, k) => {
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
    const clone = function (element) {
      return foldl(element.dom().attributes, (acc, attr) => {
        acc[attr.name] = attr.value
        return acc
      }, {})
    }

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

    const ancestors = function (scope, predicate, isRoot) {
      return filter(parents(scope, isRoot), predicate)
    }
    const children$1 = function (scope, predicate) {
      return filter(children(scope), predicate)
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

    const ancestors$1 = function (scope, selector, isRoot) {
      return ancestors(scope, (e) => is(e, selector), isRoot)
    }
    const children$2 = function (scope, selector) {
      return children$1(scope, (e) => is(e, selector))
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
    const child$1 = function (scope, predicate) {
      const result = find(scope.dom().childNodes, compose(predicate, Element$$1.fromDom))
      return result.map(Element$$1.fromDom)
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

    const ancestor$1 = function (scope, selector, isRoot) {
      return ancestor(scope, (e) => is(e, selector), isRoot)
    }
    const child$2 = function (scope, selector) {
      return child$1(scope, (e) => is(e, selector))
    }
    const descendant$1 = function (scope, selector) {
      return one(selector, scope)
    }
    const closest$1 = function (scope, selector, isRoot) {
      return ClosestOrAncestor(is, ancestor$1, scope, selector, isRoot)
    }

    const lookup = function (tags, element, _isRoot) {
      const isRoot = _isRoot !== undefined ? _isRoot : constant(false)
      if (isRoot(element)) { return Option.none() }
      if (contains(tags, name(element))) { return Option.some(element) }
      const isRootOrUpperTable = function (element) {
        return is(element, 'table') || isRoot(element)
      }
      return ancestor$1(element, tags.join(','), isRootOrUpperTable)
    }
    const cell = function (element, isRoot) {
      return lookup([
        'td',
        'th',
      ], element, isRoot)
    }
    const cells = function (ancestor) {
      return LayerSelector.firstLayer(ancestor, 'th,td')
    }
    const notCell = function (element, isRoot) {
      return lookup([
        'caption',
        'tr',
        'tbody',
        'tfoot',
        'thead',
      ], element, isRoot)
    }
    const neighbours = function (selector, element) {
      return parent(element).map((parent$$1) => children$2(parent$$1, selector))
    }
    const neighbourCells = curry(neighbours, 'th,td')
    const neighbourRows = curry(neighbours, 'tr')
    const firstCell = function (ancestor) {
      return descendant$1(ancestor, 'th,td')
    }
    const table = function (element, isRoot) {
      return closest$1(element, 'table', isRoot)
    }
    const row = function (element, isRoot) {
      return lookup(['tr'], element, isRoot)
    }
    const rows = function (ancestor) {
      return LayerSelector.firstLayer(ancestor, 'tr')
    }
    const attr = function (element, property) {
      return parseInt(get$1(element, property), 10)
    }
    const grid$1 = function (element, rowProp, colProp) {
      const rows = attr(element, rowProp)
      const cols = attr(element, colProp)
      return Structs.grid(rows, cols)
    }
    const TableLookup = {
      cell,
      firstCell,
      cells,
      neighbourCells,
      table,
      row,
      rows,
      notCell,
      neighbourRows,
      attr,
      grid: grid$1,
    }

    const fromTable = function (table) {
      const rows = TableLookup.rows(table)
      return map(rows, (row) => {
        const element = row
        const parent$$1 = parent(element)
        const parentSection = parent$$1.map((parent$$1) => {
          const parentName = name(parent$$1)
          return parentName === 'tfoot' || parentName === 'thead' || parentName === 'tbody' ? parentName : 'tbody'
        }).getOr('tbody')
        const cells = map(TableLookup.cells(row), (cell) => {
          const rowspan = has$1(cell, 'rowspan') ? parseInt(get$1(cell, 'rowspan'), 10) : 1
          const colspan = has$1(cell, 'colspan') ? parseInt(get$1(cell, 'colspan'), 10) : 1
          return Structs.detail(cell, rowspan, colspan)
        })
        return Structs.rowdata(element, cells, parentSection)
      })
    }
    const fromPastedRows = function (rows, example) {
      return map(rows, (row) => {
        const cells = map(TableLookup.cells(row), (cell) => {
          const rowspan = has$1(cell, 'rowspan') ? parseInt(get$1(cell, 'rowspan'), 10) : 1
          const colspan = has$1(cell, 'colspan') ? parseInt(get$1(cell, 'colspan'), 10) : 1
          return Structs.detail(cell, rowspan, colspan)
        })
        return Structs.rowdata(row, cells, example.section())
      })
    }
    const DetailsList = {
      fromTable,
      fromPastedRows,
    }

    const key = function (row, column) {
      return `${row},${column}`
    }
    const getAt = function (warehouse, row, column) {
      const raw = warehouse.access()[key(row, column)]
      return raw !== undefined ? Option.some(raw) : Option.none()
    }
    const findItem = function (warehouse, item, comparator) {
      const filtered = filterItems(warehouse, (detail) => comparator(item, detail.element()))
      return filtered.length > 0 ? Option.some(filtered[0]) : Option.none()
    }
    var filterItems = function (warehouse, predicate) {
      const all = bind(warehouse.all(), (r) => r.cells())
      return filter(all, predicate)
    }
    const generate = function (list) {
      const access = {}
      const cells = []
      const maxRows = list.length
      let maxColumns = 0
      each(list, (details, r) => {
        const currentRow = []
        each(details.cells(), (detail, c) => {
          let start = 0
          while (access[key(r, start)] !== undefined) {
            start++
          }
          const current = Structs.extended(detail.element(), detail.rowspan(), detail.colspan(), r, start)
          for (let i = 0; i < detail.colspan(); i++) {
            for (let j = 0; j < detail.rowspan(); j++) {
              const cr = r + j
              const cc = start + i
              const newpos = key(cr, cc)
              access[newpos] = current
              maxColumns = Math.max(maxColumns, cc + 1)
            }
          }
          currentRow.push(current)
        })
        cells.push(Structs.rowdata(details.element(), currentRow, details.section()))
      })
      const grid = Structs.grid(maxRows, maxColumns)
      return {
        grid: constant(grid),
        access: constant(access),
        all: constant(cells),
      }
    }
    const justCells = function (warehouse) {
      const rows = map(warehouse.all(), (w) => w.cells())
      return flatten(rows)
    }
    const Warehouse = {
      generate,
      getAt,
      findItem,
      filterItems,
      justCells,
    }

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
    const set$1 = function (element, property, value$$1) {
      const dom = element.dom()
      internalSet(dom, property, value$$1)
    }
    const setAll$1 = function (element, css) {
      const dom = element.dom()
      each$1(css, (v, k) => {
        internalSet(dom, k, v)
      })
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
    const remove$1 = function (element, property) {
      const dom = element.dom()
      internalRemove(dom, property)
      if (has$1(element, 'style') && trim(get$1(element, 'style')) === '') {
        remove(element, 'style')
      }
    }
    const copy = function (source, target) {
      const sourceDom = source.dom()
      const targetDom = target.dom()
      if (isSupported(sourceDom) && isSupported(targetDom)) {
        targetDom.style.cssText = sourceDom.style.cssText
      }
    }

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
    const wrap = function (element, wrapper) {
      before(element, wrapper)
      append(wrapper, element)
    }

    const before$1 = function (marker, elements) {
      each(elements, (x) => {
        before(marker, x)
      })
    }
    const after$1 = function (marker, elements) {
      each(elements, (x, i) => {
        const e = i === 0 ? marker : elements[i - 1]
        after(e, x)
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

    const stats = Immutable('minRow', 'minCol', 'maxRow', 'maxCol')
    const findSelectedStats = function (house, isSelected) {
      const totalColumns = house.grid().columns()
      const totalRows = house.grid().rows()
      let minRow = totalRows
      let minCol = totalColumns
      let maxRow = 0
      let maxCol = 0
      each$1(house.access(), (detail) => {
        if (isSelected(detail)) {
          const startRow = detail.row()
          const endRow = startRow + detail.rowspan() - 1
          const startCol = detail.column()
          const endCol = startCol + detail.colspan() - 1
          if (startRow < minRow) { minRow = startRow } else if (endRow > maxRow) { maxRow = endRow }
          if (startCol < minCol) { minCol = startCol } else if (endCol > maxCol) { maxCol = endCol }
        }
      })
      return stats(minRow, minCol, maxRow, maxCol)
    }
    const makeCell = function (list, seenSelected, rowIndex) {
      const row = list[rowIndex].element()
      const td = Element$$1.fromTag('td')
      append(td, Element$$1.fromTag('br'))
      const f = seenSelected ? append : prepend
      f(row, td)
    }
    const fillInGaps = function (list, house, stats, isSelected) {
      const totalColumns = house.grid().columns()
      const totalRows = house.grid().rows()
      for (let i = 0; i < totalRows; i++) {
        let seenSelected = false
        for (let j = 0; j < totalColumns; j++) {
          if (!(i < stats.minRow() || i > stats.maxRow() || j < stats.minCol() || j > stats.maxCol())) {
            const needCell = Warehouse.getAt(house, i, j).filter(isSelected).isNone()
            if (needCell) { makeCell(list, seenSelected, i) } else { seenSelected = true }
          }
        }
      }
    }
    const clean = function (table, stats) {
      const emptyRows = filter(LayerSelector.firstLayer(table, 'tr'), (row) => row.dom().childElementCount === 0)
      each(emptyRows, remove$2)
      if (stats.minCol() === stats.maxCol() || stats.minRow() === stats.maxRow()) {
        each(LayerSelector.firstLayer(table, 'th,td'), (cell) => {
          remove(cell, 'rowspan')
          remove(cell, 'colspan')
        })
      }
      remove(table, 'width')
      remove(table, 'height')
      remove$1(table, 'width')
      remove$1(table, 'height')
    }
    const extract = function (table, selectedSelector) {
      const isSelected = function (detail) {
        return is(detail.element(), selectedSelector)
      }
      const list = DetailsList.fromTable(table)
      const house = Warehouse.generate(list)
      const stats = findSelectedStats(house, isSelected)
      const selector = `th:not(${selectedSelector})` + `,td:not(${selectedSelector})`
      const unselectedCells = LayerSelector.filterFirstLayer(table, 'th,td', (cell) => is(cell, selector))
      each(unselectedCells, remove$2)
      fillInGaps(list, house, stats, isSelected)
      clean(table, stats)
      return table
    }
    const CopySelected = { extract }

    const clone$1 = function (original, isDeep) {
      return Element$$1.fromDom(original.dom().cloneNode(isDeep))
    }
    const shallow = function (original) {
      return clone$1(original, false)
    }
    const deep = function (original) {
      return clone$1(original, true)
    }
    const shallowAs = function (original, tag) {
      const nu = Element$$1.fromTag(tag)
      const attributes = clone(original)
      setAll(nu, attributes)
      return nu
    }
    const copy$1 = function (original, tag) {
      const nu = shallowAs(original, tag)
      const cloneChildren = children(deep(original))
      append$1(nu, cloneChildren)
      return nu
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
    const get$3 = function (element) {
      return api.get(element)
    }
    const getOption = function (element) {
      return api.getOption(element)
    }
    const set$2 = function (element, value$$1) {
      api.set(element, value$$1)
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

    const cell$1 = function () {
      const td = Element$$1.fromTag('td')
      append(td, Element$$1.fromTag('br'))
      return td
    }
    const replace = function (cell, tag, attrs) {
      const replica = copy$1(cell, tag)
      each$1(attrs, (v, k) => {
        if (v === null) { remove(replica, k) } else { set(replica, k, v) }
      })
      return replica
    }
    const pasteReplace = function (cellContent) {
      return cellContent
    }
    const newRow = function (doc) {
      return function () {
        return Element$$1.fromTag('tr', doc.dom())
      }
    }
    const cloneFormats = function (oldCell, newCell, formats) {
      const first = first$3(oldCell)
      return first.map((firstText) => {
        const formatSelector = formats.join(',')
        const parents$$1 = ancestors$1(firstText, formatSelector, (element) => eq(element, oldCell))
        return foldr(parents$$1, (last$$1, parent$$1) => {
          const clonedFormat = shallow(parent$$1)
          remove(clonedFormat, 'contenteditable')
          append(last$$1, clonedFormat)
          return clonedFormat
        }, newCell)
      }).getOr(newCell)
    }
    const cellOperations = function (mutate$$1, doc, formatsToClone) {
      const newCell = function (prev) {
        const doc = owner(prev.element())
        const td = Element$$1.fromTag(name(prev.element()), doc.dom())
        const formats = formatsToClone.getOr([
          'strong',
          'em',
          'b',
          'i',
          'span',
          'font',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'p',
          'div',
        ])
        const lastNode = formats.length > 0 ? cloneFormats(prev.element(), td, formats) : td
        append(lastNode, Element$$1.fromTag('br'))
        copy(prev.element(), td)
        remove$1(td, 'height')
        if (prev.colspan() !== 1) { remove$1(prev.element(), 'width') }
        mutate$$1(prev.element(), td)
        return td
      }
      return {
        row: newRow(doc),
        cell: newCell,
        replace,
        gap: cell$1,
      }
    }
    const paste = function (doc) {
      return {
        row: newRow(doc),
        cell: cell$1,
        replace: pasteReplace,
        gap: cell$1,
      }
    }
    const TableFill = {
      cellOperations,
      paste,
    }

    const fromHtml$1 = function (html, scope) {
      const doc = scope || document
      const div = doc.createElement('div')
      div.innerHTML = html
      return children(Element$$1.fromDom(div))
    }

    const TagBoundaries = [
      'body',
      'p',
      'div',
      'article',
      'aside',
      'figcaption',
      'figure',
      'footer',
      'header',
      'nav',
      'section',
      'ol',
      'ul',
      'li',
      'table',
      'thead',
      'tbody',
      'tfoot',
      'caption',
      'tr',
      'td',
      'th',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'pre',
      'address',
    ]

    function DomUniverse() {
      const clone$$1 = function (element) {
        return Element$$1.fromDom(element.dom().cloneNode(false))
      }
      const isBoundary = function (element) {
        if (!isElement(element)) { return false }
        if (name(element) === 'body') { return true }
        return contains(TagBoundaries, name(element))
      }
      const isEmptyTag = function (element) {
        if (!isElement(element)) { return false }
        return contains([
          'br',
          'img',
          'hr',
          'input',
        ], name(element))
      }
      const comparePosition = function (element, other) {
        return element.dom().compareDocumentPosition(other.dom())
      }
      const copyAttributesTo = function (source, destination) {
        const as = clone(source)
        setAll(destination, as)
      }
      return {
        up: constant({
          selector: ancestor$1,
          closest: closest$1,
          predicate: ancestor,
          all: parents,
        }),
        down: constant({
          selector: descendants$1,
          predicate: descendants,
        }),
        styles: constant({
          get: get$2,
          getRaw,
          set: set$1,
          remove: remove$1,
        }),
        attrs: constant({
          get: get$1,
          set,
          remove,
          copyTo: copyAttributesTo,
        }),
        insert: constant({
          before,
          after,
          afterAll: after$1,
          append,
          appendAll: append$1,
          prepend,
          wrap,
        }),
        remove: constant({
          unwrap,
          remove: remove$2,
        }),
        create: constant({
          nu: Element$$1.fromTag,
          clone: clone$$1,
          text: Element$$1.fromText,
        }),
        query: constant({
          comparePosition,
          prevSibling,
          nextSibling,
        }),
        property: constant({
          children,
          name,
          parent,
          isText,
          isComment,
          isElement,
          getText: get$3,
          setText: set$2,
          isBoundary,
          isEmptyTag,
        }),
        eq,
        is: is$1,
      }
    }

    const leftRight = Immutable('left', 'right')
    const bisect = function (universe, parent, child) {
      const children = universe.property().children(parent)
      const index = findIndex(children, curry(universe.eq, child))
      return index.map((ind) => ({
        before: constant(children.slice(0, ind)),
        after: constant(children.slice(ind + 1)),
      }))
    }
    const breakToRight = function (universe, parent, child) {
      return bisect(universe, parent, child).map((parts) => {
        const second = universe.create().clone(parent)
        universe.insert().appendAll(second, parts.after())
        universe.insert().after(parent, second)
        return leftRight(parent, second)
      })
    }
    const breakToLeft = function (universe, parent, child) {
      return bisect(universe, parent, child).map((parts) => {
        const prior = universe.create().clone(parent)
        universe.insert().appendAll(prior, parts.before().concat([child]))
        universe.insert().appendAll(parent, parts.after())
        universe.insert().before(parent, prior)
        return leftRight(prior, parent)
      })
    }
    const breakPath = function (universe, item, isTop, breaker) {
      const result = Immutable('first', 'second', 'splits')
      var next = function (child, group, splits) {
        const fallback = result(child, Option.none(), splits)
        if (isTop(child)) { return result(child, group, splits) }

        return universe.property().parent(child).bind((parent) => breaker(universe, parent, child).map((breakage) => {
          const extra = [{
            first: breakage.left,
            second: breakage.right,
          }]
          const nextChild = isTop(parent) ? parent : breakage.left()
          return next(nextChild, Option.some(breakage.right()), splits.concat(extra))
        }).getOr(fallback))
      }
      return next(item, Option.none(), [])
    }
    const Breaker = {
      breakToLeft,
      breakToRight,
      breakPath,
    }

    const all$3 = function (universe, look, elements, f) {
      const head$$1 = elements[0]
      const tail = elements.slice(1)
      return f(universe, look, head$$1, tail)
    }
    const oneAll = function (universe, look, elements) {
      return elements.length > 0 ? all$3(universe, look, elements, unsafeOne) : Option.none()
    }
    var unsafeOne = function (universe, look, head$$1, tail) {
      const start = look(universe, head$$1)
      return foldr(tail, (b, a) => {
        const current = look(universe, a)
        return commonElement(universe, b, current)
      }, start)
    }
    var commonElement = function (universe, start, end) {
      return start.bind((s) => end.filter(curry(universe.eq, s)))
    }
    const Shared = { oneAll }

    const eq$1 = function (universe, item) {
      return curry(universe.eq, item)
    }
    const unsafeSubset = function (universe, common, ps1, ps2) {
      const children = universe.property().children(common)
      if (universe.eq(common, ps1[0])) { return Option.some([ps1[0]]) }
      if (universe.eq(common, ps2[0])) { return Option.some([ps2[0]]) }
      const finder = function (ps) {
        const topDown = reverse(ps)
        const index = findIndex(topDown, eq$1(universe, common)).getOr(-1)
        const item = index < topDown.length - 1 ? topDown[index + 1] : topDown[index]
        return findIndex(children, eq$1(universe, item))
      }
      const startIndex = finder(ps1)
      const endIndex = finder(ps2)
      return startIndex.bind((sIndex) => endIndex.map((eIndex) => {
        const first = Math.min(sIndex, eIndex)
        const last$$1 = Math.max(sIndex, eIndex)
        return children.slice(first, last$$1 + 1)
      }))
    }
    const ancestors$2 = function (universe, start, end, _isRoot) {
      const isRoot = _isRoot !== undefined ? _isRoot : constant(false)
      const ps1 = [start].concat(universe.up().all(start))
      const ps2 = [end].concat(universe.up().all(end))
      const prune = function (path) {
        const index = findIndex(path, isRoot)
        return index.fold(() => path, (ind) => path.slice(0, ind + 1))
      }
      const pruned1 = prune(ps1)
      const pruned2 = prune(ps2)
      const shared = find(pruned1, (x) => exists(pruned2, eq$1(universe, x)))
      return {
        firstpath: constant(pruned1),
        secondpath: constant(pruned2),
        shared: constant(shared),
      }
    }
    const subset = function (universe, start, end) {
      const ancs = ancestors$2(universe, start, end)
      return ancs.shared().bind((shared) => unsafeSubset(universe, shared, ancs.firstpath(), ancs.secondpath()))
    }
    const Subset = {
      subset,
      ancestors: ancestors$2,
    }

    const sharedOne = function (universe, look, elements) {
      return Shared.oneAll(universe, look, elements)
    }
    const subset$1 = function (universe, start, finish) {
      return Subset.subset(universe, start, finish)
    }
    const ancestors$3 = function (universe, start, finish, _isRoot) {
      return Subset.ancestors(universe, start, finish, _isRoot)
    }
    const breakToLeft$1 = function (universe, parent, child) {
      return Breaker.breakToLeft(universe, parent, child)
    }
    const breakToRight$1 = function (universe, parent, child) {
      return Breaker.breakToRight(universe, parent, child)
    }
    const breakPath$1 = function (universe, child, isTop, breaker) {
      return Breaker.breakPath(universe, child, isTop, breaker)
    }
    const Parent = {
      sharedOne,
      subset: subset$1,
      ancestors: ancestors$3,
      breakToLeft: breakToLeft$1,
      breakToRight: breakToRight$1,
      breakPath: breakPath$1,
    }

    const universe = DomUniverse()
    const sharedOne$1 = function (look, elements) {
      return Parent.sharedOne(universe, (universe, element) => look(element), elements)
    }
    const subset$2 = function (start, finish) {
      return Parent.subset(universe, start, finish)
    }
    const ancestors$4 = function (start, finish, _isRoot) {
      return Parent.ancestors(universe, start, finish, _isRoot)
    }
    const breakToLeft$2 = function (parent, child) {
      return Parent.breakToLeft(universe, parent, child)
    }
    const breakToRight$2 = function (parent, child) {
      return Parent.breakToRight(universe, parent, child)
    }
    const breakPath$2 = function (child, isTop, breaker) {
      return Parent.breakPath(universe, child, isTop, (u, p, c) => breaker(p, c))
    }
    const DomParent = {
      sharedOne: sharedOne$1,
      subset: subset$2,
      ancestors: ancestors$4,
      breakToLeft: breakToLeft$2,
      breakToRight: breakToRight$2,
      breakPath: breakPath$2,
    }

    const inSelection = function (bounds, detail) {
      const leftEdge = detail.column()
      const rightEdge = detail.column() + detail.colspan() - 1
      const topEdge = detail.row()
      const bottomEdge = detail.row() + detail.rowspan() - 1
      return leftEdge <= bounds.finishCol() && rightEdge >= bounds.startCol() && (topEdge <= bounds.finishRow() && bottomEdge >= bounds.startRow())
    }
    const isWithin = function (bounds, detail) {
      return detail.column() >= bounds.startCol() && detail.column() + detail.colspan() - 1 <= bounds.finishCol() && detail.row() >= bounds.startRow() && detail.row() + detail.rowspan() - 1 <= bounds.finishRow()
    }
    const isRectangular = function (warehouse, bounds) {
      let isRect = true
      const detailIsWithin = curry(isWithin, bounds)
      for (let i = bounds.startRow(); i <= bounds.finishRow(); i++) {
        for (let j = bounds.startCol(); j <= bounds.finishCol(); j++) {
          isRect = isRect && Warehouse.getAt(warehouse, i, j).exists(detailIsWithin)
        }
      }
      return isRect ? Option.some(bounds) : Option.none()
    }
    const CellBounds = {
      inSelection,
      isWithin,
      isRectangular,
    }

    const getBounds = function (detailA, detailB) {
      return Structs.bounds(Math.min(detailA.row(), detailB.row()), Math.min(detailA.column(), detailB.column()), Math.max(detailA.row() + detailA.rowspan() - 1, detailB.row() + detailB.rowspan() - 1), Math.max(detailA.column() + detailA.colspan() - 1, detailB.column() + detailB.colspan() - 1))
    }
    const getAnyBox = function (warehouse, startCell, finishCell) {
      const startCoords = Warehouse.findItem(warehouse, startCell, eq)
      const finishCoords = Warehouse.findItem(warehouse, finishCell, eq)
      return startCoords.bind((sc) => finishCoords.map((fc) => getBounds(sc, fc)))
    }
    const getBox = function (warehouse, startCell, finishCell) {
      return getAnyBox(warehouse, startCell, finishCell).bind((bounds) => CellBounds.isRectangular(warehouse, bounds))
    }
    const CellGroup = {
      getAnyBox,
      getBox,
    }

    const moveBy = function (warehouse, cell, row, column) {
      return Warehouse.findItem(warehouse, cell, eq).bind((detail) => {
        const startRow = row > 0 ? detail.row() + detail.rowspan() - 1 : detail.row()
        const startCol = column > 0 ? detail.column() + detail.colspan() - 1 : detail.column()
        const dest = Warehouse.getAt(warehouse, startRow + row, startCol + column)
        return dest.map((d) => d.element())
      })
    }
    const intercepts = function (warehouse, start, finish) {
      return CellGroup.getAnyBox(warehouse, start, finish).map((bounds) => {
        const inside = Warehouse.filterItems(warehouse, curry(CellBounds.inSelection, bounds))
        return map(inside, (detail) => detail.element())
      })
    }
    const parentCell = function (warehouse, innerCell) {
      const isContainedBy = function (c1, c2) {
        return contains$2(c2, c1)
      }
      return Warehouse.findItem(warehouse, innerCell, isContainedBy).bind((detail) => detail.element())
    }
    const CellFinder = {
      moveBy,
      intercepts,
      parentCell,
    }

    const moveBy$1 = function (cell, deltaRow, deltaColumn) {
      return TableLookup.table(cell).bind((table) => {
        const warehouse = getWarehouse(table)
        return CellFinder.moveBy(warehouse, cell, deltaRow, deltaColumn)
      })
    }
    const intercepts$1 = function (table, first, last) {
      const warehouse = getWarehouse(table)
      return CellFinder.intercepts(warehouse, first, last)
    }
    const nestedIntercepts = function (table, first, firstTable, last, lastTable) {
      const warehouse = getWarehouse(table)
      const startCell = eq(table, firstTable) ? first : CellFinder.parentCell(warehouse, first)
      const lastCell = eq(table, lastTable) ? last : CellFinder.parentCell(warehouse, last)
      return CellFinder.intercepts(warehouse, startCell, lastCell)
    }
    const getBox$1 = function (table, first, last) {
      const warehouse = getWarehouse(table)
      return CellGroup.getBox(warehouse, first, last)
    }
    var getWarehouse = function (table) {
      const list = DetailsList.fromTable(table)
      return Warehouse.generate(list)
    }
    const TablePositions = {
      moveBy: moveBy$1,
      intercepts: intercepts$1,
      nestedIntercepts,
      getBox: getBox$1,
    }

    const lookupTable = function (container, isRoot) {
      return ancestor$1(container, 'table')
    }
    const identified = MixedBag([
      'boxes',
      'start',
      'finish',
    ], [])
    const identify = function (start, finish, isRoot) {
      const getIsRoot = function (rootTable) {
        return function (element) {
          return isRoot(element) || eq(element, rootTable)
        }
      }
      if (eq(start, finish)) {
        return Option.some(identified({
          boxes: Option.some([start]),
          start,
          finish,
        }))
      }
      return lookupTable(start, isRoot).bind((startTable) => lookupTable(finish, isRoot).bind((finishTable) => {
        if (eq(startTable, finishTable)) {
          return Option.some(identified({
            boxes: TablePositions.intercepts(startTable, start, finish),
            start,
            finish,
          }))
        } if (contains$2(startTable, finishTable)) {
          var ancestorCells = ancestors$1(finish, 'td,th', getIsRoot(startTable))
          const finishCell = ancestorCells.length > 0 ? ancestorCells[ancestorCells.length - 1] : finish
          return Option.some(identified({
            boxes: TablePositions.nestedIntercepts(startTable, start, startTable, finish, finishTable),
            start,
            finish: finishCell,
          }))
        } if (contains$2(finishTable, startTable)) {
          var ancestorCells = ancestors$1(start, 'td,th', getIsRoot(finishTable))
          const startCell = ancestorCells.length > 0 ? ancestorCells[ancestorCells.length - 1] : start
          return Option.some(identified({
            boxes: TablePositions.nestedIntercepts(finishTable, start, startTable, finish, finishTable),
            start,
            finish: startCell,
          }))
        }
        return DomParent.ancestors(start, finish).shared().bind((lca) => closest$1(lca, 'table', isRoot).bind((lcaTable) => {
          const finishAncestorCells = ancestors$1(finish, 'td,th', getIsRoot(lcaTable))
          const finishCell = finishAncestorCells.length > 0 ? finishAncestorCells[finishAncestorCells.length - 1] : finish
          const startAncestorCells = ancestors$1(start, 'td,th', getIsRoot(lcaTable))
          const startCell = startAncestorCells.length > 0 ? startAncestorCells[startAncestorCells.length - 1] : start
          return Option.some(identified({
            boxes: TablePositions.nestedIntercepts(lcaTable, start, startTable, finish, finishTable),
            start: startCell,
            finish: finishCell,
          }))
        }))
      }))
    }
    const retrieve = function (container, selector) {
      const sels = descendants$1(container, selector)
      return sels.length > 0 ? Option.some(sels) : Option.none()
    }
    const getLast = function (boxes, lastSelectedSelector) {
      return find(boxes, (box) => is(box, lastSelectedSelector))
    }
    const getEdges = function (container, firstSelectedSelector, lastSelectedSelector) {
      return descendant$1(container, firstSelectedSelector).bind((first) => descendant$1(container, lastSelectedSelector).bind((last$$1) => DomParent.sharedOne(lookupTable, [
        first,
        last$$1,
      ]).map((tbl) => ({
        first: constant(first),
        last: constant(last$$1),
        table: constant(tbl),
      }))))
    }
    const expandTo = function (finish, firstSelectedSelector) {
      return ancestor$1(finish, 'table').bind((table) => descendant$1(table, firstSelectedSelector).bind((start) => identify(start, finish).bind((identified) => identified.boxes().map((boxes) => ({
        boxes: constant(boxes),
        start: constant(identified.start()),
        finish: constant(identified.finish()),
      })))))
    }
    const shiftSelection = function (boxes, deltaRow, deltaColumn, firstSelectedSelector, lastSelectedSelector) {
      return getLast(boxes, lastSelectedSelector).bind((last$$1) => TablePositions.moveBy(last$$1, deltaRow, deltaColumn).bind((finish) => expandTo(finish, firstSelectedSelector)))
    }
    const CellSelection = {
      identify,
      retrieve,
      shiftSelection,
      getEdges,
    }

    const retrieve$1 = function (container, selector) {
      return CellSelection.retrieve(container, selector)
    }
    const retrieveBox = function (container, firstSelectedSelector, lastSelectedSelector) {
      return CellSelection.getEdges(container, firstSelectedSelector, lastSelectedSelector).bind((edges) => {
        const isRoot = function (ancestor) {
          return eq(container, ancestor)
        }
        const firstAncestor = ancestor$1(edges.first(), 'thead,tfoot,tbody,table', isRoot)
        const lastAncestor = ancestor$1(edges.last(), 'thead,tfoot,tbody,table', isRoot)
        return firstAncestor.bind((fA) => lastAncestor.bind((lA) => eq(fA, lA) ? TablePositions.getBox(edges.table(), edges.first(), edges.last()) : Option.none()))
      })
    }
    const TableSelection = {
      retrieve: retrieve$1,
      retrieveBox,
    }

    const selected = 'data-mce-selected'
    const selectedSelector = `td[${selected}],th[${selected}]`
    const attributeSelector = `[${selected}]`
    const firstSelected = 'data-mce-first-selected'
    const firstSelectedSelector = `td[${firstSelected}],th[${firstSelected}]`
    const lastSelected = 'data-mce-last-selected'
    const lastSelectedSelector = `td[${lastSelected}],th[${lastSelected}]`
    const Ephemera = {
      selected: constant(selected),
      selectedSelector: constant(selectedSelector),
      attributeSelector: constant(attributeSelector),
      firstSelected: constant(firstSelected),
      firstSelectedSelector: constant(firstSelectedSelector),
      lastSelected: constant(lastSelected),
      lastSelectedSelector: constant(lastSelectedSelector),
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

    const type$1 = Adt.generate([
      { none: [] },
      { multiple: ['elements'] },
      { single: ['selection'] },
    ])
    const cata = function (subject, onNone, onMultiple, onSingle) {
      return subject.fold(onNone, onMultiple, onSingle)
    }
    const SelectionTypes = {
      cata,
      none: type$1.none,
      multiple: type$1.multiple,
      single: type$1.single,
    }

    const selection = function (cell, selections) {
      return SelectionTypes.cata(selections.get(), constant([]), identity, constant([cell]))
    }
    const unmergable = function (cell, selections) {
      const hasSpan = function (elem) {
        return has$1(elem, 'rowspan') && parseInt(get$1(elem, 'rowspan'), 10) > 1 || has$1(elem, 'colspan') && parseInt(get$1(elem, 'colspan'), 10) > 1
      }
      const candidates = selection(cell, selections)
      return candidates.length > 0 && forall(candidates, hasSpan) ? Option.some(candidates) : Option.none()
    }
    const mergable = function (table, selections) {
      return SelectionTypes.cata(selections.get(), Option.none, (cells, _env) => {
        if (cells.length === 0) {
          return Option.none()
        }
        return TableSelection.retrieveBox(table, Ephemera.firstSelectedSelector(), Ephemera.lastSelectedSelector()).bind((bounds) => cells.length > 1 ? Option.some({
          bounds: constant(bounds),
          cells: constant(cells),
        }) : Option.none())
      }, Option.none)
    }
    const CellOperations = {
      mergable,
      unmergable,
      selection,
    }

    const noMenu = function (cell) {
      return {
        element: constant(cell),
        mergable: Option.none,
        unmergable: Option.none,
        selection: constant([cell]),
      }
    }
    const forMenu = function (selections, table, cell) {
      return {
        element: constant(cell),
        mergable: constant(CellOperations.mergable(table, selections)),
        unmergable: constant(CellOperations.unmergable(cell, selections)),
        selection: constant(CellOperations.selection(cell, selections)),
      }
    }
    const notCell$1 = function (element) {
      return noMenu(element)
    }
    const paste$1 = Immutable('element', 'clipboard', 'generators')
    const pasteRows = function (selections, table, cell, clipboard, generators) {
      return {
        element: constant(cell),
        mergable: Option.none,
        unmergable: Option.none,
        selection: constant(CellOperations.selection(cell, selections)),
        clipboard: constant(clipboard),
        generators: constant(generators),
      }
    }
    const TableTargets = {
      noMenu,
      forMenu,
      notCell: notCell$1,
      paste: paste$1,
      pasteRows,
    }

    const extractSelected = function (cells) {
      return TableLookup.table(cells[0]).map(deep).map((replica) => [CopySelected.extract(replica, Ephemera.attributeSelector())])
    }
    const serializeElements = function (editor, elements) {
      return map(elements, (elm) => editor.selection.serializer.serialize(elm.dom(), {})).join('')
    }
    const getTextContent = function (elements) {
      return map(elements, (element) => element.dom().innerText).join('')
    }
    const registerEvents = function (editor, selections, actions, cellSelection) {
      editor.on('BeforeGetContent', (e) => {
        const multiCellContext = function (cells) {
          e.preventDefault()
          extractSelected(cells).each((elements) => {
            e.content = e.format === 'text' ? getTextContent(elements) : serializeElements(editor, elements)
          })
        }
        if (e.selection === true) {
          SelectionTypes.cata(selections.get(), noop, multiCellContext, noop)
        }
      })
      editor.on('BeforeSetContent', (e) => {
        if (e.selection === true && e.paste === true) {
          const cellOpt = Option.from(editor.dom.getParent(editor.selection.getStart(), 'th,td'))
          cellOpt.each((domCell) => {
            const cell = Element$$1.fromDom(domCell)
            const table = TableLookup.table(cell)
            table.bind((table) => {
              const elements = filter(fromHtml$1(e.content), (content) => name(content) !== 'meta')
              if (elements.length === 1 && name(elements[0]) === 'table') {
                e.preventDefault()
                const doc = Element$$1.fromDom(editor.getDoc())
                const generators = TableFill.paste(doc)
                const targets = TableTargets.paste(cell, elements[0], generators)
                actions.pasteCells(table, targets).each((rng) => {
                  editor.selection.setRng(rng)
                  editor.focus()
                  cellSelection.clear(table)
                })
              }
            })
          })
        }
      })
    }
    const Clipboard = { registerEvents }

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
          const css = get$2(element, name)
          return parseFloat(css) || 0
        }
        return r
      }
      const getOuter = get
      const aggregate = function (element, properties) {
        return foldl(properties, (acc, property) => {
          const val = get$2(element, property)
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

    const api$1 = Dimension('height', (element) => {
      const dom = element.dom()
      return inBody(element) ? dom.getBoundingClientRect().height : dom.offsetHeight
    })
    const get$4 = function (element) {
      return api$1.get(element)
    }
    const getOuter = function (element) {
      return api$1.getOuter(element)
    }

    const api$2 = Dimension('width', (element) => element.dom().offsetWidth)
    const get$5 = function (element) {
      return api$2.get(element)
    }
    const getOuter$1 = function (element) {
      return api$2.getOuter(element)
    }

    const platform = PlatformDetection$1.detect()
    const needManualCalc = function () {
      return platform.browser.isIE() || platform.browser.isEdge()
    }
    const toNumber = function (px, fallback) {
      const num = parseFloat(px)
      return isNaN(num) ? fallback : num
    }
    const getProp = function (elm, name, fallback) {
      return toNumber(get$2(elm, name), fallback)
    }
    const getCalculatedHeight = function (cell) {
      const paddingTop = getProp(cell, 'padding-top', 0)
      const paddingBottom = getProp(cell, 'padding-bottom', 0)
      const borderTop = getProp(cell, 'border-top-width', 0)
      const borderBottom = getProp(cell, 'border-bottom-width', 0)
      const { height } = cell.dom().getBoundingClientRect()
      const boxSizing = get$2(cell, 'box-sizing')
      const borders = borderTop + borderBottom
      return boxSizing === 'border-box' ? height : height - paddingTop - paddingBottom - borders
    }
    const getWidth = function (cell) {
      return getProp(cell, 'width', get$5(cell))
    }
    const getHeight = function (cell) {
      return needManualCalc() ? getCalculatedHeight(cell) : getProp(cell, 'height', get$4(cell))
    }
    const RuntimeSize = {
      getWidth,
      getHeight,
    }

    const genericSizeRegex = /(\d+(\.\d+)?)(\w|%)*/
    const percentageBasedSizeRegex = /(\d+(\.\d+)?)%/
    const pixelBasedSizeRegex = /(\d+(\.\d+)?)px|em/
    const setPixelWidth = function (cell, amount) {
      set$1(cell, 'width', `${amount}px`)
    }
    const setPercentageWidth = function (cell, amount) {
      set$1(cell, 'width', `${amount}%`)
    }
    const setHeight = function (cell, amount) {
      set$1(cell, 'height', `${amount}px`)
    }
    const getHeightValue = function (cell) {
      return getRaw(cell, 'height').getOrThunk(() => `${RuntimeSize.getHeight(cell)}px`)
    }
    const convert = function (cell, number, getter, setter) {
      const newSize = TableLookup.table(cell).map((table) => {
        const total = getter(table)
        return Math.floor(number / 100 * total)
      }).getOr(number)
      setter(cell, newSize)
      return newSize
    }
    const normalizePixelSize = function (value$$1, cell, getter, setter) {
      const number = parseInt(value$$1, 10)
      return endsWith(value$$1, '%') && name(cell) !== 'table' ? convert(cell, number, getter, setter) : number
    }
    const getTotalHeight = function (cell) {
      const value$$1 = getHeightValue(cell)
      if (!value$$1) { return get$4(cell) }
      return normalizePixelSize(value$$1, cell, get$4, setHeight)
    }
    const get$6 = function (cell, type$$1, f) {
      const v = f(cell)
      const span = getSpan(cell, type$$1)
      return v / span
    }
    var getSpan = function (cell, type$$1) {
      return has$1(cell, type$$1) ? parseInt(get$1(cell, type$$1), 10) : 1
    }
    const getRawWidth = function (element) {
      const cssWidth = getRaw(element, 'width')
      return cssWidth.fold(() => Option.from(get$1(element, 'width')), (width) => Option.some(width))
    }
    const normalizePercentageWidth = function (cellWidth, tableSize) {
      return cellWidth / tableSize.pixelWidth() * 100
    }
    const choosePercentageSize = function (element, width, tableSize) {
      if (percentageBasedSizeRegex.test(width)) {
        const percentMatch = percentageBasedSizeRegex.exec(width)
        return parseFloat(percentMatch[1])
      }
      const intWidth = get$5(element)
      return normalizePercentageWidth(intWidth, tableSize)
    }
    const getPercentageWidth = function (cell, tableSize) {
      const width = getRawWidth(cell)
      return width.fold(() => {
        const intWidth = get$5(cell)
        return normalizePercentageWidth(intWidth, tableSize)
      }, (width) => choosePercentageSize(cell, width, tableSize))
    }
    const normalizePixelWidth = function (cellWidth, tableSize) {
      return cellWidth / 100 * tableSize.pixelWidth()
    }
    const choosePixelSize = function (element, width, tableSize) {
      if (pixelBasedSizeRegex.test(width)) {
        const pixelMatch = pixelBasedSizeRegex.exec(width)
        return parseInt(pixelMatch[1], 10)
      } if (percentageBasedSizeRegex.test(width)) {
        const percentMatch = percentageBasedSizeRegex.exec(width)
        const floatWidth = parseFloat(percentMatch[1])
        return normalizePixelWidth(floatWidth, tableSize)
      }
      return get$5(element)
    }
    const getPixelWidth = function (cell, tableSize) {
      const width = getRawWidth(cell)
      return width.fold(() => get$5(cell), (width) => choosePixelSize(cell, width, tableSize))
    }
    const getHeight$1 = function (cell) {
      return get$6(cell, 'rowspan', getTotalHeight)
    }
    const getGenericWidth = function (cell) {
      const width = getRawWidth(cell)
      return width.bind((width) => {
        if (genericSizeRegex.test(width)) {
          const match = genericSizeRegex.exec(width)
          return Option.some({
            width: constant(match[1]),
            unit: constant(match[3]),
          })
        }
        return Option.none()
      })
    }
    const setGenericWidth = function (cell, amount, unit) {
      set$1(cell, 'width', amount + unit)
    }
    const Sizes = {
      percentageBasedSizeRegex: constant(percentageBasedSizeRegex),
      pixelBasedSizeRegex: constant(pixelBasedSizeRegex),
      setPixelWidth,
      setPercentageWidth,
      setHeight,
      getPixelWidth,
      getPercentageWidth,
      getGenericWidth,
      setGenericWidth,
      getHeight: getHeight$1,
      getRawWidth,
    }

    const halve = function (main, other) {
      const width = Sizes.getGenericWidth(main)
      width.each((width) => {
        const newWidth = width.width() / 2
        Sizes.setGenericWidth(main, newWidth, width.unit())
        Sizes.setGenericWidth(other, newWidth, width.unit())
      })
    }
    const CellMutations = { halve }

    const attached = function (element, scope) {
      const doc = scope || Element$$1.fromDom(document.documentElement)
      return ancestor(element, curry(eq, doc)).isSome()
    }
    const windowOf = function (element) {
      const dom = element.dom()
      if (dom === dom.window && element instanceof Window) {
        return element
      }
      return isDocument(element) ? dom.defaultView || dom.parentWindow : null
    }

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

    const boxPosition = function (dom) {
      const box = dom.getBoundingClientRect()
      return Position(box.left, box.top)
    }
    const firstDefinedOrZero = function (a, b) {
      return a !== undefined ? a : b !== undefined ? b : 0
    }
    const absolute = function (element) {
      const doc = element.dom().ownerDocument
      const { body } = doc
      const win = windowOf(Element$$1.fromDom(doc))
      const html = doc.documentElement
      const scrollTop = firstDefinedOrZero(win.pageYOffset, html.scrollTop)
      const scrollLeft = firstDefinedOrZero(win.pageXOffset, html.scrollLeft)
      const clientTop = firstDefinedOrZero(html.clientTop, body.clientTop)
      const clientLeft = firstDefinedOrZero(html.clientLeft, body.clientLeft)
      return viewport(element).translate(scrollLeft - clientLeft, scrollTop - clientTop)
    }
    var viewport = function (element) {
      const dom = element.dom()
      const doc = dom.ownerDocument
      const { body } = doc
      const html = Element$$1.fromDom(doc.documentElement)
      if (body === dom) {
        return Position(body.offsetLeft, body.offsetTop)
      }
      if (!attached(element, html)) {
        return Position(0, 0)
      }
      return boxPosition(dom)
    }

    const rowInfo = Immutable('row', 'y')
    const colInfo = Immutable('col', 'x')
    const rtlEdge = function (cell) {
      const pos = absolute(cell)
      return pos.left() + getOuter$1(cell)
    }
    const ltrEdge = function (cell) {
      return absolute(cell).left()
    }
    const getLeftEdge = function (index, cell) {
      return colInfo(index, ltrEdge(cell))
    }
    const getRightEdge = function (index, cell) {
      return colInfo(index, rtlEdge(cell))
    }
    const getTop = function (cell) {
      return absolute(cell).top()
    }
    const getTopEdge = function (index, cell) {
      return rowInfo(index, getTop(cell))
    }
    const getBottomEdge = function (index, cell) {
      return rowInfo(index, getTop(cell) + getOuter(cell))
    }
    const findPositions = function (getInnerEdge, getOuterEdge, array) {
      if (array.length === 0) { return [] }
      const lines = map(array.slice(1), (cellOption, index) => cellOption.map((cell) => getInnerEdge(index, cell)))
      const lastLine = array[array.length - 1].map((cell) => getOuterEdge(array.length - 1, cell))
      return lines.concat([lastLine])
    }
    const negate = function (step, _table) {
      return -step
    }
    const height = {
      delta: identity,
      positions: curry(findPositions, getTopEdge, getBottomEdge),
      edge: getTop,
    }
    const ltr = {
      delta: identity,
      edge: ltrEdge,
      positions: curry(findPositions, getLeftEdge, getRightEdge),
    }
    const rtl = {
      delta: negate,
      edge: rtlEdge,
      positions: curry(findPositions, getRightEdge, getLeftEdge),
    }
    const BarPositions = {
      height,
      rtl,
      ltr,
    }

    const ResizeDirection = {
      ltr: BarPositions.ltr,
      rtl: BarPositions.rtl,
    }

    function TableDirection(directionAt) {
      const auto = function (table) {
        return directionAt(table).isRtl() ? ResizeDirection.rtl : ResizeDirection.ltr
      }
      const delta = function (amount, table) {
        return auto(table).delta(amount, table)
      }
      const positions = function (cols, table) {
        return auto(table).positions(cols, table)
      }
      const edge = function (cell) {
        return auto(cell).edge(cell)
      }
      return {
        delta,
        edge,
        positions,
      }
    }

    const getGridSize = function (table) {
      const input = DetailsList.fromTable(table)
      const warehouse = Warehouse.generate(input)
      return warehouse.grid()
    }
    const TableGridSize = { getGridSize }

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

    const base = function (handleUnsupported, required) {
      return baseWith(handleUnsupported, required, {
        validate: isFunction,
        label: 'function',
      })
    }
    var baseWith = function (handleUnsupported, required, pred) {
      if (required.length === 0) { throw new Error('You must specify at least one required field.') }
      validateStrArr('required', required)
      checkDupes(required)
      return function (obj) {
        const keys$$1 = keys(obj)
        const allReqd = forall(required, (req) => contains(keys$$1, req))
        if (!allReqd) { reqMessage(required, keys$$1) }
        handleUnsupported(required, keys$$1)
        const invalidKeys = filter(required, (key) => !pred.validate(obj[key], key))
        if (invalidKeys.length > 0) { invalidTypeMessage(invalidKeys, pred.label) }
        return obj
      }
    }
    const handleExact = function (required, keys$$1) {
      const unsupported = filter(keys$$1, (key) => !contains(required, key))
      if (unsupported.length > 0) { unsuppMessage(unsupported) }
    }
    const exactly = function (required) {
      return base(handleExact, required)
    }

    const elementToData = function (element) {
      const colspan = has$1(element, 'colspan') ? parseInt(get$1(element, 'colspan'), 10) : 1
      const rowspan = has$1(element, 'rowspan') ? parseInt(get$1(element, 'rowspan'), 10) : 1
      return {
        element: constant(element),
        colspan: constant(colspan),
        rowspan: constant(rowspan),
      }
    }
    const modification = function (generators, _toData) {
      contract(generators)
      const position = Cell(Option.none())
      const toData = _toData !== undefined ? _toData : elementToData
      const nu = function (data) {
        return generators.cell(data)
      }
      const nuFrom = function (element) {
        const data = toData(element)
        return nu(data)
      }
      const add = function (element) {
        const replacement = nuFrom(element)
        if (position.get().isNone()) { position.set(Option.some(replacement)) }
        recent = Option.some({
          item: element,
          replacement,
        })
        return replacement
      }
      var recent = Option.none()
      const getOrInit = function (element, comparator) {
        return recent.fold(() => add(element), (p) => comparator(element, p.item) ? p.replacement : add(element))
      }
      return {
        getOrInit,
        cursor: position.get,
      }
    }
    const transform = function (scope, tag) {
      return function (generators) {
        const position = Cell(Option.none())
        contract(generators)
        const list = []
        const find$$1 = function (element, comparator) {
          return find(list, (x) => comparator(x.item, element))
        }
        const makeNew = function (element) {
          const cell = generators.replace(element, tag, { scope })
          list.push({
            item: element,
            sub: cell,
          })
          if (position.get().isNone()) { position.set(Option.some(cell)) }
          return cell
        }
        const replaceOrInit = function (element, comparator) {
          return find$$1(element, comparator).fold(() => makeNew(element), (p) => comparator(element, p.item) ? p.sub : makeNew(element))
        }
        return {
          replaceOrInit,
          cursor: position.get,
        }
      }
    }
    const merging = function (generators) {
      contract(generators)
      const position = Cell(Option.none())
      const combine = function (cell) {
        if (position.get().isNone()) { position.set(Option.some(cell)) }
        return function () {
          const raw = generators.cell({
            element: constant(cell),
            colspan: constant(1),
            rowspan: constant(1),
          })
          remove$1(raw, 'width')
          remove$1(cell, 'width')
          return raw
        }
      }
      return {
        combine,
        cursor: position.get,
      }
    }
    var contract = exactly([
      'cell',
      'row',
      'replace',
      'gap',
    ])
    const Generators = {
      modification,
      transform,
      merging,
    }

    const blockList = [
      'body',
      'p',
      'div',
      'article',
      'aside',
      'figcaption',
      'figure',
      'footer',
      'header',
      'nav',
      'section',
      'ol',
      'ul',
      'table',
      'thead',
      'tfoot',
      'tbody',
      'caption',
      'tr',
      'td',
      'th',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'pre',
      'address',
    ]
    const isList = function (universe, item) {
      const tagName = universe.property().name(item)
      return contains([
        'ol',
        'ul',
      ], tagName)
    }
    const isBlock = function (universe, item) {
      const tagName = universe.property().name(item)
      return contains(blockList, tagName)
    }
    const isFormatting = function (universe, item) {
      const tagName = universe.property().name(item)
      return contains([
        'address',
        'pre',
        'p',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
      ], tagName)
    }
    const isHeading = function (universe, item) {
      const tagName = universe.property().name(item)
      return contains([
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
      ], tagName)
    }
    const isContainer = function (universe, item) {
      return contains([
        'div',
        'li',
        'td',
        'th',
        'blockquote',
        'body',
        'caption',
      ], universe.property().name(item))
    }
    const isEmptyTag = function (universe, item) {
      return contains([
        'br',
        'img',
        'hr',
        'input',
      ], universe.property().name(item))
    }
    const isFrame = function (universe, item) {
      return universe.property().name(item) === 'iframe'
    }
    const isInline = function (universe, item) {
      return !(isBlock(universe, item) || isEmptyTag(universe, item)) && universe.property().name(item) !== 'li'
    }
    const Structure = {
      isBlock,
      isList,
      isFormatting,
      isHeading,
      isContainer,
      isEmptyTag,
      isFrame,
      isInline,
    }

    const universe$1 = DomUniverse()
    const isBlock$1 = function (element) {
      return Structure.isBlock(universe$1, element)
    }
    const isList$1 = function (element) {
      return Structure.isList(universe$1, element)
    }
    const isFormatting$1 = function (element) {
      return Structure.isFormatting(universe$1, element)
    }
    const isHeading$1 = function (element) {
      return Structure.isHeading(universe$1, element)
    }
    const isContainer$1 = function (element) {
      return Structure.isContainer(universe$1, element)
    }
    const isEmptyTag$1 = function (element) {
      return Structure.isEmptyTag(universe$1, element)
    }
    const isFrame$1 = function (element) {
      return Structure.isFrame(universe$1, element)
    }
    const isInline$1 = function (element) {
      return Structure.isInline(universe$1, element)
    }
    const DomStructure = {
      isBlock: isBlock$1,
      isList: isList$1,
      isFormatting: isFormatting$1,
      isHeading: isHeading$1,
      isContainer: isContainer$1,
      isEmptyTag: isEmptyTag$1,
      isFrame: isFrame$1,
      isInline: isInline$1,
    }

    const merge = function (cells) {
      const isBr = function (el) {
        return name(el) === 'br'
      }
      const advancedBr = function (children$$1) {
        return forall(children$$1, (c) => isBr(c) || isText(c) && get$3(c).trim().length === 0)
      }
      const isListItem = function (el) {
        return name(el) === 'li' || ancestor(el, DomStructure.isList).isSome()
      }
      const siblingIsBlock = function (el) {
        return nextSibling(el).map((rightSibling) => {
          if (DomStructure.isBlock(rightSibling)) { return true }
          if (DomStructure.isEmptyTag(rightSibling)) {
            return name(rightSibling) !== 'img'
          }
        }).getOr(false)
      }
      const markCell = function (cell) {
        return last$2(cell).bind((rightEdge) => {
          const rightSiblingIsBlock = siblingIsBlock(rightEdge)
          return parent(rightEdge).map((parent$$1) => rightSiblingIsBlock === true || isListItem(parent$$1) || isBr(rightEdge) || DomStructure.isBlock(parent$$1) && !eq(cell, parent$$1) ? [] : [Element$$1.fromTag('br')])
        }).getOr([])
      }
      const markContent = function () {
        const content = bind(cells, (cell) => {
          const children$$1 = children(cell)
          return advancedBr(children$$1) ? [] : children$$1.concat(markCell(cell))
        })
        return content.length === 0 ? [Element$$1.fromTag('br')] : content
      }
      const contents = markContent()
      empty(cells[0])
      append$1(cells[0], contents)
    }
    const TableContent = { merge }

    const hasOwnProperty$1 = Object.prototype.hasOwnProperty
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
            if (hasOwnProperty$1.call(curObject, key)) {
              ret[key] = merger(ret[key], curObject[key])
            }
          }
        }
        return ret
      }
    }
    const merge$1 = baseMerge(shallow$1)

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

    const addCell = function (gridRow, index, cell) {
      const cells = gridRow.cells()
      const before = cells.slice(0, index)
      const after = cells.slice(index)
      const newCells = before.concat([cell]).concat(after)
      return setCells(gridRow, newCells)
    }
    const mutateCell = function (gridRow, index, cell) {
      const cells = gridRow.cells()
      cells[index] = cell
    }
    var setCells = function (gridRow, cells) {
      return Structs.rowcells(cells, gridRow.section())
    }
    const mapCells = function (gridRow, f) {
      const cells = gridRow.cells()
      const r = map(cells, f)
      return Structs.rowcells(r, gridRow.section())
    }
    const getCell = function (gridRow, index) {
      return gridRow.cells()[index]
    }
    const getCellElement = function (gridRow, index) {
      return getCell(gridRow, index).element()
    }
    const cellLength = function (gridRow) {
      return gridRow.cells().length
    }
    const GridRow = {
      addCell,
      setCells,
      mutateCell,
      getCell,
      getCellElement,
      mapCells,
      cellLength,
    }

    const getColumn = function (grid, index) {
      return map(grid, (row) => GridRow.getCell(row, index))
    }
    const getRow = function (grid, index) {
      return grid[index]
    }
    const findDiff = function (xs, comp) {
      if (xs.length === 0) { return 0 }
      const first = xs[0]
      const index = findIndex(xs, (x) => !comp(first.element(), x.element()))
      return index.fold(() => xs.length, (ind) => ind)
    }
    const subgrid = function (grid, row, column, comparator) {
      const restOfRow = getRow(grid, row).cells().slice(column)
      const endColIndex = findDiff(restOfRow, comparator)
      const restOfColumn = getColumn(grid, column).slice(row)
      const endRowIndex = findDiff(restOfColumn, comparator)
      return {
        colspan: constant(endColIndex),
        rowspan: constant(endRowIndex),
      }
    }
    const TableGrid = { subgrid }

    const toDetails = function (grid, comparator) {
      const seen = map(grid, (row, ri) => map(row.cells(), (col, ci) => false))
      const updateSeen = function (ri, ci, rowspan, colspan) {
        for (let r = ri; r < ri + rowspan; r++) {
          for (let c = ci; c < ci + colspan; c++) {
            seen[r][c] = true
          }
        }
      }
      return map(grid, (row, ri) => {
        const details = bind(row.cells(), (cell, ci) => {
          if (seen[ri][ci] === false) {
            const result = TableGrid.subgrid(grid, ri, ci, comparator)
            updateSeen(ri, ci, result.rowspan(), result.colspan())
            return [Structs.detailnew(cell.element(), result.rowspan(), result.colspan(), cell.isNew())]
          }
          return []
        })
        return Structs.rowdetails(details, row.section())
      })
    }
    const toGrid = function (warehouse, generators, isNew) {
      const grid = []
      for (let i = 0; i < warehouse.grid().rows(); i++) {
        const rowCells = []
        for (let j = 0; j < warehouse.grid().columns(); j++) {
          const element = Warehouse.getAt(warehouse, i, j).map((item) => Structs.elementnew(item.element(), isNew)).getOrThunk(() => Structs.elementnew(generators.gap(), true))
          rowCells.push(element)
        }
        const row = Structs.rowcells(rowCells, warehouse.all()[i].section())
        grid.push(row)
      }
      return grid
    }
    const Transitions = {
      toDetails,
      toGrid,
    }

    const setIfNot = function (element, property, value, ignore) {
      if (value === ignore) { remove(element, property) } else { set(element, property, value) }
    }
    const render = function (table, grid) {
      const newRows = []
      const newCells = []
      const renderSection = function (gridSection, sectionName) {
        const section = child$2(table, sectionName).getOrThunk(() => {
          const tb = Element$$1.fromTag(sectionName, owner(table).dom())
          append(table, tb)
          return tb
        })
        empty(section)
        const rows = map(gridSection, (row) => {
          if (row.isNew()) {
            newRows.push(row.element())
          }
          const tr = row.element()
          empty(tr)
          each(row.cells(), (cell) => {
            if (cell.isNew()) {
              newCells.push(cell.element())
            }
            setIfNot(cell.element(), 'colspan', cell.colspan(), 1)
            setIfNot(cell.element(), 'rowspan', cell.rowspan(), 1)
            append(tr, cell.element())
          })
          return tr
        })
        append$1(section, rows)
      }
      const removeSection = function (sectionName) {
        child$2(table, sectionName).each(remove$2)
      }
      const renderOrRemoveSection = function (gridSection, sectionName) {
        if (gridSection.length > 0) {
          renderSection(gridSection, sectionName)
        } else {
          removeSection(sectionName)
        }
      }
      const headSection = []
      const bodySection = []
      const footSection = []
      each(grid, (row) => {
        switch (row.section()) {
          case 'thead':
            headSection.push(row)
            break
          case 'tbody':
            bodySection.push(row)
            break
          case 'tfoot':
            footSection.push(row)
            break
        }
      })
      renderOrRemoveSection(headSection, 'thead')
      renderOrRemoveSection(bodySection, 'tbody')
      renderOrRemoveSection(footSection, 'tfoot')
      return {
        newRows: constant(newRows),
        newCells: constant(newCells),
      }
    }
    const copy$2 = function (grid) {
      const rows = map(grid, (row) => {
        const tr = shallow(row.element())
        each(row.cells(), (cell) => {
          const clonedCell = deep(cell.element())
          setIfNot(clonedCell, 'colspan', cell.colspan(), 1)
          setIfNot(clonedCell, 'rowspan', cell.rowspan(), 1)
          append(tr, clonedCell)
        })
        return tr
      })
      return rows
    }
    const Redraw = {
      render,
      copy: copy$2,
    }

    const repeat = function (repititions, f) {
      const r = []
      for (let i = 0; i < repititions; i++) {
        r.push(f(i))
      }
      return r
    }
    const range$1 = function (start, end) {
      const r = []
      for (let i = start; i < end; i++) {
        r.push(i)
      }
      return r
    }
    const unique = function (xs, comparator) {
      const result = []
      each(xs, (x, i) => {
        if (i < xs.length - 1 && !comparator(x, xs[i + 1])) {
          result.push(x)
        } else if (i === xs.length - 1) {
          result.push(x)
        }
      })
      return result
    }
    const deduce = function (xs, index) {
      if (index < 0 || index >= xs.length - 1) { return Option.none() }
      const current = xs[index].fold(() => {
        const rest = reverse(xs.slice(0, index))
        return findMap(rest, (a, i) => a.map((aa) => ({
          value: aa,
          delta: i + 1,
        })))
      }, (c) => Option.some({
        value: c,
        delta: 0,
      }))
      const next = xs[index + 1].fold(() => {
        const rest = xs.slice(index + 1)
        return findMap(rest, (a, i) => a.map((aa) => ({
          value: aa,
          delta: i + 1,
        })))
      }, (n) => Option.some({
        value: n,
        delta: 1,
      }))
      return current.bind((c) => next.map((n) => {
        const extras = n.delta + c.delta
        return Math.abs(n.value - c.value) / extras
      }))
    }
    const Util = {
      repeat,
      range: range$1,
      unique,
      deduce,
    }

    const columns = function (warehouse) {
      const grid = warehouse.grid()
      const cols = Util.range(0, grid.columns())
      const rows = Util.range(0, grid.rows())
      return map(cols, (col) => {
        const getBlock = function () {
          return bind(rows, (r) => Warehouse.getAt(warehouse, r, col).filter((detail) => detail.column() === col).fold(constant([]), (detail) => [detail]))
        }
        const isSingle = function (detail) {
          return detail.colspan() === 1
        }
        const getFallback = function () {
          return Warehouse.getAt(warehouse, 0, col)
        }
        return decide(getBlock, isSingle, getFallback)
      })
    }
    var decide = function (getBlock, isSingle, getFallback) {
      const inBlock = getBlock()
      const singleInBlock = find(inBlock, isSingle)
      const detailOption = singleInBlock.orThunk(() => Option.from(inBlock[0]).orThunk(getFallback))
      return detailOption.map((detail) => detail.element())
    }
    const rows$1 = function (warehouse) {
      const grid = warehouse.grid()
      const rows = Util.range(0, grid.rows())
      const cols = Util.range(0, grid.columns())
      return map(rows, (row) => {
        const getBlock = function () {
          return bind(cols, (c) => Warehouse.getAt(warehouse, row, c).filter((detail) => detail.row() === row).fold(constant([]), (detail) => [detail]))
        }
        const isSingle = function (detail) {
          return detail.rowspan() === 1
        }
        const getFallback = function () {
          return Warehouse.getAt(warehouse, row, 0)
        }
        return decide(getBlock, isSingle, getFallback)
      })
    }
    const Blocks = {
      columns,
      rows: rows$1,
    }

    const col = function (column, x, y, w, h) {
      const blocker = Element$$1.fromTag('div')
      setAll$1(blocker, {
        position: 'absolute',
        left: `${x - w / 2}px`,
        top: `${y}px`,
        height: `${h}px`,
        width: `${w}px`,
      })
      setAll(blocker, {
        'data-column': column,
        role: 'presentation',
      })
      return blocker
    }
    const row$1 = function (row, x, y, w, h) {
      const blocker = Element$$1.fromTag('div')
      setAll$1(blocker, {
        position: 'absolute',
        left: `${x}px`,
        top: `${y - h / 2}px`,
        height: `${h}px`,
        width: `${w}px`,
      })
      setAll(blocker, {
        'data-row': row,
        role: 'presentation',
      })
      return blocker
    }
    const Bar = {
      col,
      row: row$1,
    }

    const css = function (namespace) {
      const dashNamespace = namespace.replace(/\./g, '-')
      const resolve = function (str) {
        return `${dashNamespace}-${str}`
      }
      return { resolve }
    }

    const styles = css('ephox-snooker')
    const Styles = { resolve: styles.resolve }

    const read = function (element, attr) {
      const value = get$1(element, attr)
      return value === undefined || value === '' ? [] : value.split(' ')
    }
    const add = function (element, attr, id) {
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
    const get$7 = function (element) {
      return read(element, 'class')
    }
    const add$1 = function (element, clazz) {
      return add(element, 'class', clazz)
    }
    const remove$4 = function (element, clazz) {
      return remove$3(element, 'class', clazz)
    }

    const add$2 = function (element, clazz) {
      if (supports(element)) {
        element.dom().classList.add(clazz)
      } else {
        add$1(element, clazz)
      }
    }
    const cleanClass = function (element) {
      const classList = supports(element) ? element.dom().classList : get$7(element)
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

    const resizeBar = Styles.resolve('resizer-bar')
    const resizeRowBar = Styles.resolve('resizer-rows')
    const resizeColBar = Styles.resolve('resizer-cols')
    const BAR_THICKNESS = 7
    const clear = function (wire) {
      const previous = descendants$1(wire.parent(), `.${resizeBar}`)
      each(previous, remove$2)
    }
    const drawBar = function (wire, positions, create) {
      const origin = wire.origin()
      each(positions, (cpOption, i) => {
        cpOption.each((cp) => {
          const bar = create(origin, cp)
          add$2(bar, resizeBar)
          append(wire.parent(), bar)
        })
      })
    }
    const refreshCol = function (wire, colPositions, position, tableHeight) {
      drawBar(wire, colPositions, (origin, cp) => {
        const colBar = Bar.col(cp.col(), cp.x() - origin.left(), position.top() - origin.top(), BAR_THICKNESS, tableHeight)
        add$2(colBar, resizeColBar)
        return colBar
      })
    }
    const refreshRow = function (wire, rowPositions, position, tableWidth) {
      drawBar(wire, rowPositions, (origin, cp) => {
        const rowBar = Bar.row(cp.row(), position.left() - origin.left(), cp.y() - origin.top(), tableWidth, BAR_THICKNESS)
        add$2(rowBar, resizeRowBar)
        return rowBar
      })
    }
    const refreshGrid = function (wire, table, rows, cols, hdirection, vdirection) {
      const position = absolute(table)
      const rowPositions = rows.length > 0 ? hdirection.positions(rows, table) : []
      refreshRow(wire, rowPositions, position, getOuter$1(table))
      const colPositions = cols.length > 0 ? vdirection.positions(cols, table) : []
      refreshCol(wire, colPositions, position, getOuter(table))
    }
    const refresh = function (wire, table, hdirection, vdirection) {
      clear(wire)
      const list = DetailsList.fromTable(table)
      const warehouse = Warehouse.generate(list)
      const rows = Blocks.rows(warehouse)
      const cols = Blocks.columns(warehouse)
      refreshGrid(wire, table, rows, cols, hdirection, vdirection)
    }
    const each$2 = function (wire, f) {
      const bars = descendants$1(wire.parent(), `.${resizeBar}`)
      each(bars, f)
    }
    const hide = function (wire) {
      each$2(wire, (bar) => {
        set$1(bar, 'display', 'none')
      })
    }
    const show = function (wire) {
      each$2(wire, (bar) => {
        set$1(bar, 'display', 'block')
      })
    }
    const isRowBar = function (element) {
      return has$2(element, resizeRowBar)
    }
    const isColBar = function (element) {
      return has$2(element, resizeColBar)
    }
    const Bars = {
      refresh,
      hide,
      show,
      destroy: clear,
      isRowBar,
      isColBar,
    }

    const fromWarehouse = function (warehouse, generators) {
      return Transitions.toGrid(warehouse, generators, false)
    }
    const deriveRows = function (rendered, generators) {
      const findRow = function (details) {
        const rowOfCells = findMap(details, (detail) => parent(detail.element()).map((row) => {
          const isNew = parent(row).isNone()
          return Structs.elementnew(row, isNew)
        }))
        return rowOfCells.getOrThunk(() => Structs.elementnew(generators.row(), true))
      }
      return map(rendered, (details) => {
        const row = findRow(details.details())
        return Structs.rowdatanew(row.element(), details.details(), details.section(), row.isNew())
      })
    }
    const toDetailList = function (grid, generators) {
      const rendered = Transitions.toDetails(grid, eq)
      return deriveRows(rendered, generators)
    }
    const findInWarehouse = function (warehouse, element) {
      const all = flatten(map(warehouse.all(), (r) => r.cells()))
      return find(all, (e) => eq(element, e.element()))
    }
    const run = function (operation, extract, adjustment, postAction, genWrappers) {
      return function (wire, table, target, generators, direction) {
        const input = DetailsList.fromTable(table)
        const warehouse = Warehouse.generate(input)
        const output = extract(warehouse, target).map((info) => {
          const model = fromWarehouse(warehouse, generators)
          const result = operation(model, info, eq, genWrappers(generators))
          const grid = toDetailList(result.grid(), generators)
          return {
            grid: constant(grid),
            cursor: result.cursor,
          }
        })
        return output.fold(() => Option.none(), (out) => {
          const newElements = Redraw.render(table, out.grid())
          adjustment(table, out.grid(), direction)
          postAction(table)
          Bars.refresh(wire, table, BarPositions.height, direction)
          return Option.some({
            cursor: out.cursor,
            newRows: newElements.newRows,
            newCells: newElements.newCells,
          })
        })
      }
    }
    const onCell = function (warehouse, target) {
      return TableLookup.cell(target.element()).bind((cell) => findInWarehouse(warehouse, cell))
    }
    const onPaste = function (warehouse, target) {
      return TableLookup.cell(target.element()).bind((cell) => findInWarehouse(warehouse, cell).map((details) => merge$1(details, {
        generators: target.generators,
        clipboard: target.clipboard,
      })))
    }
    const onPasteRows = function (warehouse, target) {
      const details = map(target.selection(), (cell) => TableLookup.cell(cell).bind((lc) => findInWarehouse(warehouse, lc)))
      const cells = cat(details)
      return cells.length > 0 ? Option.some(merge$1({ cells }, {
        generators: target.generators,
        clipboard: target.clipboard,
      })) : Option.none()
    }
    const onMergable = function (warehouse, target) {
      return target.mergable()
    }
    const onUnmergable = function (warehouse, target) {
      return target.unmergable()
    }
    const onCells = function (warehouse, target) {
      const details = map(target.selection(), (cell) => TableLookup.cell(cell).bind((lc) => findInWarehouse(warehouse, lc)))
      const cells = cat(details)
      return cells.length > 0 ? Option.some(cells) : Option.none()
    }
    const RunOperation = {
      run,
      toDetailList,
      onCell,
      onCells,
      onPaste,
      onPasteRows,
      onMergable,
      onUnmergable,
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

    const measure = function (startAddress, gridA, gridB) {
      if (startAddress.row() >= gridA.length || startAddress.column() > GridRow.cellLength(gridA[0])) { return Result.error(`invalid start address out of table bounds, row: ${startAddress.row()}, column: ${startAddress.column()}`) }
      const rowRemainder = gridA.slice(startAddress.row())
      const colRemainder = rowRemainder[0].cells().slice(startAddress.column())
      const colRequired = GridRow.cellLength(gridB[0])
      const rowRequired = gridB.length
      return Result.value({
        rowDelta: constant(rowRemainder.length - rowRequired),
        colDelta: constant(colRemainder.length - colRequired),
      })
    }
    const measureWidth = function (gridA, gridB) {
      const colLengthA = GridRow.cellLength(gridA[0])
      const colLengthB = GridRow.cellLength(gridB[0])
      return {
        rowDelta: constant(0),
        colDelta: constant(colLengthA - colLengthB),
      }
    }
    const fill = function (cells, generator) {
      return map(cells, () => Structs.elementnew(generator.cell(), true))
    }
    const rowFill = function (grid, amount, generator) {
      return grid.concat(Util.repeat(amount, (_row) => GridRow.setCells(grid[grid.length - 1], fill(grid[grid.length - 1].cells(), generator))))
    }
    const colFill = function (grid, amount, generator) {
      return map(grid, (row) => GridRow.setCells(row, row.cells().concat(fill(Util.range(0, amount), generator))))
    }
    const tailor = function (gridA, delta, generator) {
      const fillCols = delta.colDelta() < 0 ? colFill : identity
      const fillRows = delta.rowDelta() < 0 ? rowFill : identity
      const modifiedCols = fillCols(gridA, Math.abs(delta.colDelta()), generator)
      const tailoredGrid = fillRows(modifiedCols, Math.abs(delta.rowDelta()), generator)
      return tailoredGrid
    }
    const Fitment = {
      measure,
      measureWidth,
      tailor,
    }

    const merge$2 = function (grid, bounds, comparator, substitution) {
      if (grid.length === 0) { return grid }
      for (let i = bounds.startRow(); i <= bounds.finishRow(); i++) {
        for (let j = bounds.startCol(); j <= bounds.finishCol(); j++) {
          GridRow.mutateCell(grid[i], j, Structs.elementnew(substitution(), false))
        }
      }
      return grid
    }
    const unmerge = function (grid, target, comparator, substitution) {
      let first = true
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < GridRow.cellLength(grid[0]); j++) {
          const current = GridRow.getCellElement(grid[i], j)
          const isToReplace = comparator(current, target)
          if (isToReplace === true && first === false) {
            GridRow.mutateCell(grid[i], j, Structs.elementnew(substitution(), true))
          } else if (isToReplace === true) {
            first = false
          }
        }
      }
      return grid
    }
    const uniqueCells = function (row, comparator) {
      return foldl(row, (rest, cell) => exists(rest, (currentCell) => comparator(currentCell.element(), cell.element())) ? rest : rest.concat([cell]), [])
    }
    const splitRows = function (grid, index, comparator, substitution) {
      if (index > 0 && index < grid.length) {
        const rowPrevCells = grid[index - 1].cells()
        const cells = uniqueCells(rowPrevCells, comparator)
        each(cells, (cell) => {
          let replacement = Option.none()
          for (var i = index; i < grid.length; i++) {
            for (var j = 0; j < GridRow.cellLength(grid[0]); j++) {
              const current = grid[i].cells()[j]
              const isToReplace = comparator(current.element(), cell.element())
              if (isToReplace) {
                if (replacement.isNone()) {
                  replacement = Option.some(substitution())
                }
                replacement.each((sub) => {
                  GridRow.mutateCell(grid[i], j, Structs.elementnew(sub, true))
                })
              }
            }
          }
        })
      }
      return grid
    }
    const MergingOperations = {
      merge: merge$2,
      unmerge,
      splitRows,
    }

    const isSpanning = function (grid, row, col, comparator) {
      const candidate = GridRow.getCell(grid[row], col)
      const matching = curry(comparator, candidate.element())
      const currentRow = grid[row]
      return grid.length > 1 && GridRow.cellLength(currentRow) > 1 && (col > 0 && matching(GridRow.getCellElement(currentRow, col - 1)) || col < currentRow.length - 1 && matching(GridRow.getCellElement(currentRow, col + 1)) || row > 0 && matching(GridRow.getCellElement(grid[row - 1], col)) || row < grid.length - 1 && matching(GridRow.getCellElement(grid[row + 1], col)))
    }
    const mergeTables = function (startAddress, gridA, gridB, generator, comparator) {
      const startRow = startAddress.row()
      const startCol = startAddress.column()
      const mergeHeight = gridB.length
      const mergeWidth = GridRow.cellLength(gridB[0])
      const endRow = startRow + mergeHeight
      const endCol = startCol + mergeWidth
      for (let r = startRow; r < endRow; r++) {
        for (let c = startCol; c < endCol; c++) {
          if (isSpanning(gridA, r, c, comparator)) {
            MergingOperations.unmerge(gridA, GridRow.getCellElement(gridA[r], c), comparator, generator.cell)
          }
          const newCell = GridRow.getCellElement(gridB[r - startRow], c - startCol)
          const replacement = generator.replace(newCell)
          GridRow.mutateCell(gridA[r], c, Structs.elementnew(replacement, true))
        }
      }
      return gridA
    }
    const merge$3 = function (startAddress, gridA, gridB, generator, comparator) {
      const result = Fitment.measure(startAddress, gridA, gridB)
      return result.map((delta) => {
        const fittedGrid = Fitment.tailor(gridA, delta, generator)
        return mergeTables(startAddress, fittedGrid, gridB, generator, comparator)
      })
    }
    const insert = function (index, gridA, gridB, generator, comparator) {
      MergingOperations.splitRows(gridA, index, comparator, generator.cell)
      const delta = Fitment.measureWidth(gridB, gridA)
      const fittedNewGrid = Fitment.tailor(gridB, delta, generator)
      const secondDelta = Fitment.measureWidth(gridA, fittedNewGrid)
      const fittedOldGrid = Fitment.tailor(gridA, secondDelta, generator)
      return fittedOldGrid.slice(0, index).concat(fittedNewGrid).concat(fittedOldGrid.slice(index, fittedOldGrid.length))
    }
    const TableMerge = {
      merge: merge$3,
      insert,
    }

    const insertRowAt = function (grid, index, example, comparator, substitution) {
      const before = grid.slice(0, index)
      const after = grid.slice(index)
      const between = GridRow.mapCells(grid[example], (ex, c) => {
        const withinSpan = index > 0 && index < grid.length && comparator(GridRow.getCellElement(grid[index - 1], c), GridRow.getCellElement(grid[index], c))
        const ret = withinSpan ? GridRow.getCell(grid[index], c) : Structs.elementnew(substitution(ex.element(), comparator), true)
        return ret
      })
      return before.concat([between]).concat(after)
    }
    const insertColumnAt = function (grid, index, example, comparator, substitution) {
      return map(grid, (row) => {
        const withinSpan = index > 0 && index < GridRow.cellLength(row) && comparator(GridRow.getCellElement(row, index - 1), GridRow.getCellElement(row, index))
        const sub = withinSpan ? GridRow.getCell(row, index) : Structs.elementnew(substitution(GridRow.getCellElement(row, example), comparator), true)
        return GridRow.addCell(row, index, sub)
      })
    }
    const splitCellIntoColumns = function (grid, exampleRow, exampleCol, comparator, substitution) {
      const index = exampleCol + 1
      return map(grid, (row, i) => {
        const isTargetCell = i === exampleRow
        const sub = isTargetCell ? Structs.elementnew(substitution(GridRow.getCellElement(row, exampleCol), comparator), true) : GridRow.getCell(row, exampleCol)
        return GridRow.addCell(row, index, sub)
      })
    }
    const splitCellIntoRows = function (grid, exampleRow, exampleCol, comparator, substitution) {
      const index = exampleRow + 1
      const before = grid.slice(0, index)
      const after = grid.slice(index)
      const between = GridRow.mapCells(grid[exampleRow], (ex, i) => {
        const isTargetCell = i === exampleCol
        return isTargetCell ? Structs.elementnew(substitution(ex.element(), comparator), true) : ex
      })
      return before.concat([between]).concat(after)
    }
    const deleteColumnsAt = function (grid, start, finish) {
      const rows = map(grid, (row) => {
        const cells = row.cells().slice(0, start).concat(row.cells().slice(finish + 1))
        return Structs.rowcells(cells, row.section())
      })
      return filter(rows, (row) => row.cells().length > 0)
    }
    const deleteRowsAt = function (grid, start, finish) {
      return grid.slice(0, start).concat(grid.slice(finish + 1))
    }
    const ModificationOperations = {
      insertRowAt,
      insertColumnAt,
      splitCellIntoColumns,
      splitCellIntoRows,
      deleteRowsAt,
      deleteColumnsAt,
    }

    const replaceIn = function (grid, targets, comparator, substitution) {
      const isTarget = function (cell) {
        return exists(targets, (target) => comparator(cell.element(), target.element()))
      }
      return map(grid, (row) => GridRow.mapCells(row, (cell) => isTarget(cell) ? Structs.elementnew(substitution(cell.element(), comparator), true) : cell))
    }
    const notStartRow = function (grid, rowIndex, colIndex, comparator) {
      return GridRow.getCellElement(grid[rowIndex], colIndex) !== undefined && (rowIndex > 0 && comparator(GridRow.getCellElement(grid[rowIndex - 1], colIndex), GridRow.getCellElement(grid[rowIndex], colIndex)))
    }
    const notStartColumn = function (row, index, comparator) {
      return index > 0 && comparator(GridRow.getCellElement(row, index - 1), GridRow.getCellElement(row, index))
    }
    const replaceColumn = function (grid, index, comparator, substitution) {
      const targets = bind(grid, (row, i) => {
        const alreadyAdded = notStartRow(grid, i, index, comparator) || notStartColumn(row, index, comparator)
        return alreadyAdded ? [] : [GridRow.getCell(row, index)]
      })
      return replaceIn(grid, targets, comparator, substitution)
    }
    const replaceRow = function (grid, index, comparator, substitution) {
      const targetRow = grid[index]
      const targets = bind(targetRow.cells(), (item, i) => {
        const alreadyAdded = notStartRow(grid, index, i, comparator) || notStartColumn(targetRow, i, comparator)
        return alreadyAdded ? [] : [item]
      })
      return replaceIn(grid, targets, comparator, substitution)
    }
    const TransformOperations = {
      replaceColumn,
      replaceRow,
    }

    const none$1 = function () {
      return folder((n, o, l, m, r) => n())
    }
    const only = function (index) {
      return folder((n, o, l, m, r) => o(index))
    }
    const left = function (index, next) {
      return folder((n, o, l, m, r) => l(index, next))
    }
    const middle = function (prev, index, next) {
      return folder((n, o, l, m, r) => m(prev, index, next))
    }
    const right = function (prev, index) {
      return folder((n, o, l, m, r) => r(prev, index))
    }
    var folder = function (fold) {
      return { fold }
    }
    const ColumnContext = {
      none: none$1,
      only,
      left,
      middle,
      right,
    }

    const neighbours$1 = function (input, index) {
      if (input.length === 0) { return ColumnContext.none() }
      if (input.length === 1) { return ColumnContext.only(0) }
      if (index === 0) { return ColumnContext.left(0, 1) }
      if (index === input.length - 1) { return ColumnContext.right(index - 1, index) }
      if (index > 0 && index < input.length - 1) { return ColumnContext.middle(index - 1, index, index + 1) }
      return ColumnContext.none()
    }
    const determine = function (input, column, step, tableSize) {
      const result = input.slice(0)
      const context = neighbours$1(input, column)
      const zero = function (array) {
        return map(array, constant(0))
      }
      const onNone = constant(zero(result))
      const onOnly = function (index) {
        return tableSize.singleColumnWidth(result[index], step)
      }
      const onChange = function (index, next) {
        if (step >= 0) {
          const newNext = Math.max(tableSize.minCellWidth(), result[next] - step)
          return zero(result.slice(0, index)).concat([
            step,
            newNext - result[next],
          ]).concat(zero(result.slice(next + 1)))
        }
        const newThis = Math.max(tableSize.minCellWidth(), result[index] + step)
        const diffx = result[index] - newThis
        return zero(result.slice(0, index)).concat([
          newThis - result[index],
          diffx,
        ]).concat(zero(result.slice(next + 1)))
      }
      const onLeft = onChange
      const onMiddle = function (prev, index, next) {
        return onChange(index, next)
      }
      const onRight = function (prev, index) {
        if (step >= 0) {
          return zero(result.slice(0, index)).concat([step])
        }
        const size = Math.max(tableSize.minCellWidth(), result[index] + step)
        return zero(result.slice(0, index)).concat([size - result[index]])
      }
      return context.fold(onNone, onOnly, onLeft, onMiddle, onRight)
    }
    const Deltas = { determine }

    const getSpan$1 = function (cell, type) {
      return has$1(cell, type) && parseInt(get$1(cell, type), 10) > 1
    }
    const hasColspan = function (cell) {
      return getSpan$1(cell, 'colspan')
    }
    const hasRowspan = function (cell) {
      return getSpan$1(cell, 'rowspan')
    }
    const getInt = function (element, property) {
      return parseInt(get$2(element, property), 10)
    }
    const CellUtils = {
      hasColspan,
      hasRowspan,
      minWidth: constant(10),
      minHeight: constant(10),
      getInt,
    }

    const getRaw$1 = function (cell, property, getter) {
      return getRaw(cell, property).fold(() => `${getter(cell)}px`, (raw) => raw)
    }
    const getRawW = function (cell) {
      return getRaw$1(cell, 'width', Sizes.getPixelWidth)
    }
    const getRawH = function (cell) {
      return getRaw$1(cell, 'height', Sizes.getHeight)
    }
    const getWidthFrom = function (warehouse, direction, getWidth, fallback, tableSize) {
      const columns = Blocks.columns(warehouse)
      const backups = map(columns, (cellOption) => cellOption.map(direction.edge))
      return map(columns, (cellOption, c) => {
        const columnCell = cellOption.filter(not(CellUtils.hasColspan))
        return columnCell.fold(() => {
          const deduced = Util.deduce(backups, c)
          return fallback(deduced)
        }, (cell) => getWidth(cell, tableSize))
      })
    }
    const getDeduced = function (deduced) {
      return deduced.map((d) => `${d}px`).getOr('')
    }
    const getRawWidths = function (warehouse, direction) {
      return getWidthFrom(warehouse, direction, getRawW, getDeduced)
    }
    const getPercentageWidths = function (warehouse, direction, tableSize) {
      return getWidthFrom(warehouse, direction, Sizes.getPercentageWidth, (deduced) => deduced.fold(() => tableSize.minCellWidth(), (cellWidth) => cellWidth / tableSize.pixelWidth() * 100), tableSize)
    }
    const getPixelWidths = function (warehouse, direction, tableSize) {
      return getWidthFrom(warehouse, direction, Sizes.getPixelWidth, (deduced) => deduced.getOrThunk(tableSize.minCellWidth), tableSize)
    }
    const getHeightFrom = function (warehouse, direction, getHeight, fallback) {
      const rows = Blocks.rows(warehouse)
      const backups = map(rows, (cellOption) => cellOption.map(direction.edge))
      return map(rows, (cellOption, c) => {
        const rowCell = cellOption.filter(not(CellUtils.hasRowspan))
        return rowCell.fold(() => {
          const deduced = Util.deduce(backups, c)
          return fallback(deduced)
        }, (cell) => getHeight(cell))
      })
    }
    const getPixelHeights = function (warehouse, direction) {
      return getHeightFrom(warehouse, direction, Sizes.getHeight, (deduced) => deduced.getOrThunk(CellUtils.minHeight))
    }
    const getRawHeights = function (warehouse, direction) {
      return getHeightFrom(warehouse, direction, getRawH, getDeduced)
    }
    const ColumnSizes = {
      getRawWidths,
      getPixelWidths,
      getPercentageWidths,
      getPixelHeights,
      getRawHeights,
    }

    const total = function (start, end, measures) {
      let r = 0
      for (let i = start; i < end; i++) {
        r += measures[i] !== undefined ? measures[i] : 0
      }
      return r
    }
    const recalculateWidth = function (warehouse, widths) {
      const all = Warehouse.justCells(warehouse)
      return map(all, (cell) => {
        const width = total(cell.column(), cell.column() + cell.colspan(), widths)
        return {
          element: cell.element,
          width: constant(width),
          colspan: cell.colspan,
        }
      })
    }
    const recalculateHeight = function (warehouse, heights) {
      const all = Warehouse.justCells(warehouse)
      return map(all, (cell) => {
        const height = total(cell.row(), cell.row() + cell.rowspan(), heights)
        return {
          element: cell.element,
          height: constant(height),
          rowspan: cell.rowspan,
        }
      })
    }
    const matchRowHeight = function (warehouse, heights) {
      return map(warehouse.all(), (row, i) => ({
        element: row.element,
        height: constant(heights[i]),
      }))
    }
    const Recalculations = {
      recalculateWidth,
      recalculateHeight,
      matchRowHeight,
    }

    const percentageSize = function (width, element) {
      const floatWidth = parseFloat(width)
      const pixelWidth = get$5(element)
      const getCellDelta = function (delta) {
        return delta / pixelWidth * 100
      }
      const singleColumnWidth = function (width, _delta) {
        return [100 - width]
      }
      const minCellWidth = function () {
        return CellUtils.minWidth() / pixelWidth * 100
      }
      const setTableWidth = function (table, _newWidths, delta) {
        const total = floatWidth + delta
        Sizes.setPercentageWidth(table, total)
      }
      return {
        width: constant(floatWidth),
        pixelWidth: constant(pixelWidth),
        getWidths: ColumnSizes.getPercentageWidths,
        getCellDelta,
        singleColumnWidth,
        minCellWidth,
        setElementWidth: Sizes.setPercentageWidth,
        setTableWidth,
      }
    }
    const pixelSize = function (width) {
      const intWidth = parseInt(width, 10)
      const getCellDelta = identity
      const singleColumnWidth = function (width, delta) {
        const newNext = Math.max(CellUtils.minWidth(), width + delta)
        return [newNext - width]
      }
      const setTableWidth = function (table, newWidths, _delta) {
        const total = foldr(newWidths, (b, a) => b + a, 0)
        Sizes.setPixelWidth(table, total)
      }
      return {
        width: constant(intWidth),
        pixelWidth: constant(intWidth),
        getWidths: ColumnSizes.getPixelWidths,
        getCellDelta,
        singleColumnWidth,
        minCellWidth: CellUtils.minWidth,
        setElementWidth: Sizes.setPixelWidth,
        setTableWidth,
      }
    }
    const chooseSize = function (element, width) {
      if (Sizes.percentageBasedSizeRegex().test(width)) {
        const percentMatch = Sizes.percentageBasedSizeRegex().exec(width)
        return percentageSize(percentMatch[1], element)
      } if (Sizes.pixelBasedSizeRegex().test(width)) {
        const pixelMatch = Sizes.pixelBasedSizeRegex().exec(width)
        return pixelSize(pixelMatch[1])
      }
      const fallbackWidth = get$5(element)
      return pixelSize(fallbackWidth)
    }
    const getTableSize = function (element) {
      const width = Sizes.getRawWidth(element)
      return width.fold(() => {
        const fallbackWidth = get$5(element)
        return pixelSize(fallbackWidth)
      }, (width) => chooseSize(element, width))
    }
    const TableSize = { getTableSize }

    const getWarehouse$1 = function (list) {
      return Warehouse.generate(list)
    }
    const sumUp = function (newSize) {
      return foldr(newSize, (b, a) => b + a, 0)
    }
    const getTableWarehouse = function (table) {
      const list = DetailsList.fromTable(table)
      return getWarehouse$1(list)
    }
    const adjustWidth = function (table, delta, index, direction) {
      const tableSize = TableSize.getTableSize(table)
      const step = tableSize.getCellDelta(delta)
      const warehouse = getTableWarehouse(table)
      const widths = tableSize.getWidths(warehouse, direction, tableSize)
      const deltas = Deltas.determine(widths, index, step, tableSize)
      const newWidths = map(deltas, (dx, i) => dx + widths[i])
      const newSizes = Recalculations.recalculateWidth(warehouse, newWidths)
      each(newSizes, (cell) => {
        tableSize.setElementWidth(cell.element(), cell.width())
      })
      if (index === warehouse.grid().columns() - 1) {
        tableSize.setTableWidth(table, newWidths, step)
      }
    }
    const adjustHeight = function (table, delta, index, direction) {
      const warehouse = getTableWarehouse(table)
      const heights = ColumnSizes.getPixelHeights(warehouse, direction)
      const newHeights = map(heights, (dy, i) => index === i ? Math.max(delta + dy, CellUtils.minHeight()) : dy)
      const newCellSizes = Recalculations.recalculateHeight(warehouse, newHeights)
      const newRowSizes = Recalculations.matchRowHeight(warehouse, newHeights)
      each(newRowSizes, (row) => {
        Sizes.setHeight(row.element(), row.height())
      })
      each(newCellSizes, (cell) => {
        Sizes.setHeight(cell.element(), cell.height())
      })
      const total = sumUp(newHeights)
      Sizes.setHeight(table, total)
    }
    const adjustWidthTo = function (table, list, direction) {
      const tableSize = TableSize.getTableSize(table)
      const warehouse = getWarehouse$1(list)
      const widths = tableSize.getWidths(warehouse, direction, tableSize)
      const newSizes = Recalculations.recalculateWidth(warehouse, widths)
      each(newSizes, (cell) => {
        tableSize.setElementWidth(cell.element(), cell.width())
      })
      const total = foldr(widths, (b, a) => a + b, 0)
      if (newSizes.length > 0) {
        tableSize.setTableWidth(table, total)
      }
    }
    const Adjustments = {
      adjustWidth,
      adjustHeight,
      adjustWidthTo,
    }

    const prune = function (table) {
      const cells = TableLookup.cells(table)
      if (cells.length === 0) { remove$2(table) }
    }
    const outcome = Immutable('grid', 'cursor')
    const elementFromGrid = function (grid, row, column) {
      return findIn(grid, row, column).orThunk(() => findIn(grid, 0, 0))
    }
    var findIn = function (grid, row, column) {
      return Option.from(grid[row]).bind((r) => Option.from(r.cells()[column]).bind((c) => Option.from(c.element())))
    }
    const bundle = function (grid, row, column) {
      return outcome(grid, findIn(grid, row, column))
    }
    const uniqueRows = function (details) {
      return foldl(details, (rest, detail) => exists(rest, (currentDetail) => currentDetail.row() === detail.row()) ? rest : rest.concat([detail]), []).sort((detailA, detailB) => detailA.row() - detailB.row())
    }
    const uniqueColumns = function (details) {
      return foldl(details, (rest, detail) => exists(rest, (currentDetail) => currentDetail.column() === detail.column()) ? rest : rest.concat([detail]), []).sort((detailA, detailB) => detailA.column() - detailB.column())
    }
    const insertRowBefore = function (grid, detail, comparator, genWrappers) {
      const example = detail.row()
      const targetIndex = detail.row()
      const newGrid = ModificationOperations.insertRowAt(grid, targetIndex, example, comparator, genWrappers.getOrInit)
      return bundle(newGrid, targetIndex, detail.column())
    }
    const insertRowsBefore = function (grid, details, comparator, genWrappers) {
      const example = details[0].row()
      const targetIndex = details[0].row()
      const rows = uniqueRows(details)
      const newGrid = foldl(rows, (newGrid, _row) => ModificationOperations.insertRowAt(newGrid, targetIndex, example, comparator, genWrappers.getOrInit), grid)
      return bundle(newGrid, targetIndex, details[0].column())
    }
    const insertRowAfter = function (grid, detail, comparator, genWrappers) {
      const example = detail.row()
      const targetIndex = detail.row() + detail.rowspan()
      const newGrid = ModificationOperations.insertRowAt(grid, targetIndex, example, comparator, genWrappers.getOrInit)
      return bundle(newGrid, targetIndex, detail.column())
    }
    const insertRowsAfter = function (grid, details, comparator, genWrappers) {
      const rows = uniqueRows(details)
      const example = rows[rows.length - 1].row()
      const targetIndex = rows[rows.length - 1].row() + rows[rows.length - 1].rowspan()
      const newGrid = foldl(rows, (newGrid, _row) => ModificationOperations.insertRowAt(newGrid, targetIndex, example, comparator, genWrappers.getOrInit), grid)
      return bundle(newGrid, targetIndex, details[0].column())
    }
    const insertColumnBefore = function (grid, detail, comparator, genWrappers) {
      const example = detail.column()
      const targetIndex = detail.column()
      const newGrid = ModificationOperations.insertColumnAt(grid, targetIndex, example, comparator, genWrappers.getOrInit)
      return bundle(newGrid, detail.row(), targetIndex)
    }
    const insertColumnsBefore = function (grid, details, comparator, genWrappers) {
      const columns = uniqueColumns(details)
      const example = columns[0].column()
      const targetIndex = columns[0].column()
      const newGrid = foldl(columns, (newGrid, _row) => ModificationOperations.insertColumnAt(newGrid, targetIndex, example, comparator, genWrappers.getOrInit), grid)
      return bundle(newGrid, details[0].row(), targetIndex)
    }
    const insertColumnAfter = function (grid, detail, comparator, genWrappers) {
      const example = detail.column()
      const targetIndex = detail.column() + detail.colspan()
      const newGrid = ModificationOperations.insertColumnAt(grid, targetIndex, example, comparator, genWrappers.getOrInit)
      return bundle(newGrid, detail.row(), targetIndex)
    }
    const insertColumnsAfter = function (grid, details, comparator, genWrappers) {
      const example = details[details.length - 1].column()
      const targetIndex = details[details.length - 1].column() + details[details.length - 1].colspan()
      const columns = uniqueColumns(details)
      const newGrid = foldl(columns, (newGrid, _row) => ModificationOperations.insertColumnAt(newGrid, targetIndex, example, comparator, genWrappers.getOrInit), grid)
      return bundle(newGrid, details[0].row(), targetIndex)
    }
    const makeRowHeader = function (grid, detail, comparator, genWrappers) {
      const newGrid = TransformOperations.replaceRow(grid, detail.row(), comparator, genWrappers.replaceOrInit)
      return bundle(newGrid, detail.row(), detail.column())
    }
    const makeColumnHeader = function (grid, detail, comparator, genWrappers) {
      const newGrid = TransformOperations.replaceColumn(grid, detail.column(), comparator, genWrappers.replaceOrInit)
      return bundle(newGrid, detail.row(), detail.column())
    }
    const unmakeRowHeader = function (grid, detail, comparator, genWrappers) {
      const newGrid = TransformOperations.replaceRow(grid, detail.row(), comparator, genWrappers.replaceOrInit)
      return bundle(newGrid, detail.row(), detail.column())
    }
    const unmakeColumnHeader = function (grid, detail, comparator, genWrappers) {
      const newGrid = TransformOperations.replaceColumn(grid, detail.column(), comparator, genWrappers.replaceOrInit)
      return bundle(newGrid, detail.row(), detail.column())
    }
    const splitCellIntoColumns$1 = function (grid, detail, comparator, genWrappers) {
      const newGrid = ModificationOperations.splitCellIntoColumns(grid, detail.row(), detail.column(), comparator, genWrappers.getOrInit)
      return bundle(newGrid, detail.row(), detail.column())
    }
    const splitCellIntoRows$1 = function (grid, detail, comparator, genWrappers) {
      const newGrid = ModificationOperations.splitCellIntoRows(grid, detail.row(), detail.column(), comparator, genWrappers.getOrInit)
      return bundle(newGrid, detail.row(), detail.column())
    }
    const eraseColumns = function (grid, details, comparator, _genWrappers) {
      const columns = uniqueColumns(details)
      const newGrid = ModificationOperations.deleteColumnsAt(grid, columns[0].column(), columns[columns.length - 1].column())
      const cursor = elementFromGrid(newGrid, details[0].row(), details[0].column())
      return outcome(newGrid, cursor)
    }
    const eraseRows = function (grid, details, comparator, _genWrappers) {
      const rows = uniqueRows(details)
      const newGrid = ModificationOperations.deleteRowsAt(grid, rows[0].row(), rows[rows.length - 1].row())
      const cursor = elementFromGrid(newGrid, details[0].row(), details[0].column())
      return outcome(newGrid, cursor)
    }
    const mergeCells = function (grid, mergable, comparator, _genWrappers) {
      const cells = mergable.cells()
      TableContent.merge(cells)
      const newGrid = MergingOperations.merge(grid, mergable.bounds(), comparator, constant(cells[0]))
      return outcome(newGrid, Option.from(cells[0]))
    }
    const unmergeCells = function (grid, unmergable, comparator, genWrappers) {
      const newGrid = foldr(unmergable, (b, cell) => MergingOperations.unmerge(b, cell, comparator, genWrappers.combine(cell)), grid)
      return outcome(newGrid, Option.from(unmergable[0]))
    }
    const pasteCells = function (grid, pasteDetails, comparator, genWrappers) {
      const gridify = function (table, generators) {
        const list = DetailsList.fromTable(table)
        const wh = Warehouse.generate(list)
        return Transitions.toGrid(wh, generators, true)
      }
      const gridB = gridify(pasteDetails.clipboard(), pasteDetails.generators())
      const startAddress = Structs.address(pasteDetails.row(), pasteDetails.column())
      const mergedGrid = TableMerge.merge(startAddress, grid, gridB, pasteDetails.generators(), comparator)
      return mergedGrid.fold(() => outcome(grid, Option.some(pasteDetails.element())), (nuGrid) => {
        const cursor = elementFromGrid(nuGrid, pasteDetails.row(), pasteDetails.column())
        return outcome(nuGrid, cursor)
      })
    }
    const gridifyRows = function (rows, generators, example) {
      const pasteDetails = DetailsList.fromPastedRows(rows, example)
      const wh = Warehouse.generate(pasteDetails)
      return Transitions.toGrid(wh, generators, true)
    }
    const pasteRowsBefore = function (grid, pasteDetails, comparator, genWrappers) {
      const example = grid[pasteDetails.cells[0].row()]
      const index = pasteDetails.cells[0].row()
      const gridB = gridifyRows(pasteDetails.clipboard(), pasteDetails.generators(), example)
      const mergedGrid = TableMerge.insert(index, grid, gridB, pasteDetails.generators(), comparator)
      const cursor = elementFromGrid(mergedGrid, pasteDetails.cells[0].row(), pasteDetails.cells[0].column())
      return outcome(mergedGrid, cursor)
    }
    const pasteRowsAfter = function (grid, pasteDetails, comparator, genWrappers) {
      const example = grid[pasteDetails.cells[0].row()]
      const index = pasteDetails.cells[pasteDetails.cells.length - 1].row() + pasteDetails.cells[pasteDetails.cells.length - 1].rowspan()
      const gridB = gridifyRows(pasteDetails.clipboard(), pasteDetails.generators(), example)
      const mergedGrid = TableMerge.insert(index, grid, gridB, pasteDetails.generators(), comparator)
      const cursor = elementFromGrid(mergedGrid, pasteDetails.cells[0].row(), pasteDetails.cells[0].column())
      return outcome(mergedGrid, cursor)
    }
    const resize = Adjustments.adjustWidthTo
    const TableOperations = {
      insertRowBefore: RunOperation.run(insertRowBefore, RunOperation.onCell, noop, noop, Generators.modification),
      insertRowsBefore: RunOperation.run(insertRowsBefore, RunOperation.onCells, noop, noop, Generators.modification),
      insertRowAfter: RunOperation.run(insertRowAfter, RunOperation.onCell, noop, noop, Generators.modification),
      insertRowsAfter: RunOperation.run(insertRowsAfter, RunOperation.onCells, noop, noop, Generators.modification),
      insertColumnBefore: RunOperation.run(insertColumnBefore, RunOperation.onCell, resize, noop, Generators.modification),
      insertColumnsBefore: RunOperation.run(insertColumnsBefore, RunOperation.onCells, resize, noop, Generators.modification),
      insertColumnAfter: RunOperation.run(insertColumnAfter, RunOperation.onCell, resize, noop, Generators.modification),
      insertColumnsAfter: RunOperation.run(insertColumnsAfter, RunOperation.onCells, resize, noop, Generators.modification),
      splitCellIntoColumns: RunOperation.run(splitCellIntoColumns$1, RunOperation.onCell, resize, noop, Generators.modification),
      splitCellIntoRows: RunOperation.run(splitCellIntoRows$1, RunOperation.onCell, noop, noop, Generators.modification),
      eraseColumns: RunOperation.run(eraseColumns, RunOperation.onCells, resize, prune, Generators.modification),
      eraseRows: RunOperation.run(eraseRows, RunOperation.onCells, noop, prune, Generators.modification),
      makeColumnHeader: RunOperation.run(makeColumnHeader, RunOperation.onCell, noop, noop, Generators.transform('row', 'th')),
      unmakeColumnHeader: RunOperation.run(unmakeColumnHeader, RunOperation.onCell, noop, noop, Generators.transform(null, 'td')),
      makeRowHeader: RunOperation.run(makeRowHeader, RunOperation.onCell, noop, noop, Generators.transform('col', 'th')),
      unmakeRowHeader: RunOperation.run(unmakeRowHeader, RunOperation.onCell, noop, noop, Generators.transform(null, 'td')),
      mergeCells: RunOperation.run(mergeCells, RunOperation.onMergable, noop, noop, Generators.merging),
      unmergeCells: RunOperation.run(unmergeCells, RunOperation.onUnmergable, resize, noop, Generators.merging),
      pasteCells: RunOperation.run(pasteCells, RunOperation.onPaste, resize, noop, Generators.modification),
      pasteRowsBefore: RunOperation.run(pasteRowsBefore, RunOperation.onPasteRows, noop, noop, Generators.modification),
      pasteRowsAfter: RunOperation.run(pasteRowsAfter, RunOperation.onPasteRows, noop, noop, Generators.modification),
    }

    const getBody$1 = function (editor) {
      return Element$$1.fromDom(editor.getBody())
    }
    const getPixelWidth$1 = function (elm) {
      return elm.getBoundingClientRect().width
    }
    const getPixelHeight = function (elm) {
      return elm.getBoundingClientRect().height
    }
    const getIsRoot = function (editor) {
      return function (element) {
        return eq(element, getBody$1(editor))
      }
    }
    const removePxSuffix = function (size) {
      return size ? size.replace(/px$/, '') : ''
    }
    const addSizeSuffix = function (size) {
      if (/^[0-9]+$/.test(size)) {
        size += 'px'
      }
      return size
    }
    const removeDataStyle = function (table) {
      const dataStyleCells = descendants$1(table, 'td[data-mce-style],th[data-mce-style]')
      remove(table, 'data-mce-style')
      each(dataStyleCells, (cell) => {
        remove(cell, 'data-mce-style')
      })
    }

    const getDirection = function (element) {
      return get$2(element, 'direction') === 'rtl' ? 'rtl' : 'ltr'
    }

    const ltr$1 = { isRtl: constant(false) }
    const rtl$1 = { isRtl: constant(true) }
    const directionAt = function (element) {
      const dir = getDirection(element)
      return dir === 'rtl' ? rtl$1 : ltr$1
    }
    const Direction = { directionAt }

    const defaultTableToolbar = 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol'
    const defaultStyles = {
      'border-collapse': 'collapse',
      width: '100%',
    }
    const defaultAttributes = { border: '1' }
    const getDefaultAttributes = function (editor) {
      return editor.getParam('table_default_attributes', defaultAttributes, 'object')
    }
    const getDefaultStyles = function (editor) {
      return editor.getParam('table_default_styles', defaultStyles, 'object')
    }
    const hasTableResizeBars = function (editor) {
      return editor.getParam('table_resize_bars', true, 'boolean')
    }
    const hasTabNavigation = function (editor) {
      return editor.getParam('table_tab_navigation', true, 'boolean')
    }
    const hasAdvancedCellTab = function (editor) {
      return editor.getParam('table_cell_advtab', true, 'boolean')
    }
    const hasAdvancedRowTab = function (editor) {
      return editor.getParam('table_row_advtab', true, 'boolean')
    }
    const hasAdvancedTableTab = function (editor) {
      return editor.getParam('table_advtab', true, 'boolean')
    }
    const hasAppearanceOptions = function (editor) {
      return editor.getParam('table_appearance_options', true, 'boolean')
    }
    const hasTableGrid = function (editor) {
      return editor.getParam('table_grid', true, 'boolean')
    }
    const shouldStyleWithCss = function (editor) {
      return editor.getParam('table_style_by_css', false, 'boolean')
    }
    const getCellClassList = function (editor) {
      return editor.getParam('table_cell_class_list', [], 'array')
    }
    const getRowClassList = function (editor) {
      return editor.getParam('table_row_class_list', [], 'array')
    }
    const getTableClassList = function (editor) {
      return editor.getParam('table_class_list', [], 'array')
    }
    const isPixelsForced = function (editor) {
      return editor.getParam('table_responsive_width') === false
    }
    const getToolbar = function (editor) {
      return editor.getParam('table_toolbar', defaultTableToolbar)
    }
    const getCloneElements = function (editor) {
      const cloneElements = editor.getParam('table_clone_elements')
      if (isString(cloneElements)) {
        return Option.some(cloneElements.split(/[ ,]/))
      } if (Array.isArray(cloneElements)) {
        return Option.some(cloneElements)
      }
      return Option.none()
    }
    const hasObjectResizing = function (editor) {
      const objectResizing = editor.getParam('object_resizing', true)
      return objectResizing === 'table' || objectResizing
    }

    const fireNewRow = function (editor, row) {
      return editor.fire('newrow', { node: row })
    }
    const fireNewCell = function (editor, cell) {
      return editor.fire('newcell', { node: cell })
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

    const TableActions = function (editor, lazyWire) {
      const isTableBody = function (editor) {
        return name(getBody$1(editor)) === 'table'
      }
      const lastRowGuard = function (table) {
        const size = TableGridSize.getGridSize(table)
        return isTableBody(editor) === false || size.rows() > 1
      }
      const lastColumnGuard = function (table) {
        const size = TableGridSize.getGridSize(table)
        return isTableBody(editor) === false || size.columns() > 1
      }
      const cloneFormats = getCloneElements(editor)
      const execute = function (operation, guard, mutate, lazyWire) {
        return function (table, target) {
          removeDataStyle(table)
          const wire = lazyWire()
          const doc = Element$$1.fromDom(editor.getDoc())
          const direction = TableDirection(Direction.directionAt)
          const generators = TableFill.cellOperations(mutate, doc, cloneFormats)
          return guard(table) ? operation(wire, table, target, generators, direction).bind((result) => {
            each(result.newRows(), (row) => {
              fireNewRow(editor, row.dom())
            })
            each(result.newCells(), (cell) => {
              fireNewCell(editor, cell.dom())
            })
            return result.cursor().map((cell) => {
              const rng = editor.dom.createRng()
              rng.setStart(cell.dom(), 0)
              rng.setEnd(cell.dom(), 0)
              return rng
            })
          }) : Option.none()
        }
      }
      const deleteRow = execute(TableOperations.eraseRows, lastRowGuard, noop, lazyWire)
      const deleteColumn = execute(TableOperations.eraseColumns, lastColumnGuard, noop, lazyWire)
      const insertRowsBefore = execute(TableOperations.insertRowsBefore, always, noop, lazyWire)
      const insertRowsAfter = execute(TableOperations.insertRowsAfter, always, noop, lazyWire)
      const insertColumnsBefore = execute(TableOperations.insertColumnsBefore, always, CellMutations.halve, lazyWire)
      const insertColumnsAfter = execute(TableOperations.insertColumnsAfter, always, CellMutations.halve, lazyWire)
      const mergeCells = execute(TableOperations.mergeCells, always, noop, lazyWire)
      const unmergeCells = execute(TableOperations.unmergeCells, always, noop, lazyWire)
      const pasteRowsBefore = execute(TableOperations.pasteRowsBefore, always, noop, lazyWire)
      const pasteRowsAfter = execute(TableOperations.pasteRowsAfter, always, noop, lazyWire)
      const pasteCells = execute(TableOperations.pasteCells, always, noop, lazyWire)
      return {
        deleteRow,
        deleteColumn,
        insertRowsBefore,
        insertRowsAfter,
        insertColumnsBefore,
        insertColumnsAfter,
        mergeCells,
        unmergeCells,
        pasteRowsBefore,
        pasteRowsAfter,
        pasteCells,
      }
    }

    const copyRows = function (table, target, generators) {
      const list = DetailsList.fromTable(table)
      const house = Warehouse.generate(list)
      const details = RunOperation.onCells(house, target)
      return details.map((selectedCells) => {
        const grid = Transitions.toGrid(house, generators, false)
        const slicedGrid = grid.slice(selectedCells[0].row(), selectedCells[selectedCells.length - 1].row() + selectedCells[selectedCells.length - 1].rowspan())
        const slicedDetails = RunOperation.toDetailList(slicedGrid, generators)
        return Redraw.copy(slicedDetails)
      })
    }
    const CopyRows = { copyRows }

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools')

    const getTDTHOverallStyle = function (dom, elm, name) {
      const cells = dom.select('td,th', elm)
      let firstChildStyle
      const checkChildren = function (firstChildStyle, elms) {
        for (let i = 0; i < elms.length; i++) {
          const currentStyle = dom.getStyle(elms[i], name)
          if (typeof firstChildStyle === 'undefined') {
            firstChildStyle = currentStyle
          }
          if (firstChildStyle !== currentStyle) {
            return ''
          }
        }
        return firstChildStyle
      }
      firstChildStyle = checkChildren(firstChildStyle, cells)
      return firstChildStyle
    }
    const applyAlign = function (editor, elm, name) {
      if (name) {
        editor.formatter.apply(`align${name}`, {}, elm)
      }
    }
    const applyVAlign = function (editor, elm, name) {
      if (name) {
        editor.formatter.apply(`valign${name}`, {}, elm)
      }
    }
    const unApplyAlign = function (editor, elm) {
      global$1.each('left center right'.split(' '), (name) => {
        editor.formatter.remove(`align${name}`, {}, elm)
      })
    }
    const unApplyVAlign = function (editor, elm) {
      global$1.each('top middle bottom'.split(' '), (name) => {
        editor.formatter.remove(`valign${name}`, {}, elm)
      })
    }
    const Styles$1 = {
      applyAlign,
      applyVAlign,
      unApplyAlign,
      unApplyVAlign,
      getTDTHOverallStyle,
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

    const buildListItems = function (inputList, itemCallback, startItems) {
      var appendItems = function (values$$1, output) {
        output = output || []
        global$1.each(values$$1, (item) => {
          const menuItem = { text: item.text || item.title }
          if (item.menu) {
            menuItem.menu = appendItems(item.menu)
          } else {
            menuItem.value = item.value
            if (itemCallback) {
              itemCallback(menuItem)
            }
          }
          output.push(menuItem)
        })
        return output
      }
      return appendItems(inputList, startItems || [])
    }
    const extractAdvancedStyles = function (dom, elm) {
      const rgbToHex = function (value) {
        return startsWith(value, 'rgb') ? dom.toHex(value) : value
      }
      const borderStyle = getRaw(Element$$1.fromDom(elm), 'border-style').getOr('')
      const borderColor = getRaw(Element$$1.fromDom(elm), 'border-color').map(rgbToHex).getOr('')
      const bgColor = getRaw(Element$$1.fromDom(elm), 'background-color').map(rgbToHex).getOr('')
      return {
        borderstyle: borderStyle,
        bordercolor: borderColor,
        backgroundcolor: bgColor,
      }
    }
    const getSharedValues = function (data) {
      const baseData = data[0]
      const comparisonData = data.slice(1)
      const keys$$1 = keys(baseData)
      each(comparisonData, (items) => {
        each(keys$$1, (key) => {
          each$1(items, (itemValue, itemKey, _) => {
            const comparisonValue = baseData[key]
            if (comparisonValue !== '' && key === itemKey) {
              if (comparisonValue !== itemValue) {
                baseData[key] = ''
              }
            }
          })
        })
      })
      return baseData
    }
    const getAdvancedTab = function () {
      const items = [
        {
          name: 'borderstyle',
          type: 'selectbox',
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
        {
          name: 'bordercolor',
          type: 'colorinput',
          label: 'Border color',
        },
        {
          name: 'backgroundcolor',
          type: 'colorinput',
          label: 'Background color',
        },
      ]
      return {
        title: 'Advanced',
        items,
      }
    }
    const getAlignment = function (alignments, formatName, dataName, editor, elm) {
      const alignmentData = {}
      global$1.each(alignments.split(' '), (name) => {
        if (editor.formatter.matchNode(elm, formatName + name)) {
          alignmentData[dataName] = name
        }
      })
      if (!alignmentData[dataName]) {
        alignmentData[dataName] = ''
      }
      return alignmentData
    }
    const getHAlignment = curry(getAlignment, 'left center right')
    const getVAlignment = curry(getAlignment, 'top middle bottom')
    const extractDataFromSettings = function (editor, hasAdvTableTab) {
      const style = getDefaultStyles(editor)
      const attrs = getDefaultAttributes(editor)
      const extractAdvancedStyleData = function (dom) {
        const rgbToHex = function (value) {
          return startsWith(value, 'rgb') ? dom.toHex(value) : value
        }
        const borderStyle = get(style, 'border-style').getOr('')
        const borderColor = get(style, 'border-color').getOr('')
        const bgColor = get(style, 'background-color').getOr('')
        return {
          borderstyle: borderStyle,
          bordercolor: rgbToHex(borderColor),
          backgroundcolor: rgbToHex(bgColor),
        }
      }
      const defaultData = {
        height: '',
        width: '100%',
        cellspacing: '',
        cellpadding: '',
        caption: 'unchecked',
        class: '',
        align: '',
        border: '',
      }
      const getBorder = function () {
        const borderWidth = style['border-width']
        if (shouldStyleWithCss(editor) && borderWidth) {
          return { border: borderWidth }
        }
        return get(attrs, 'border').fold(() => ({}), (border) => ({ border }))
      }
      const { dom } = editor
      const advStyle = hasAdvTableTab ? extractAdvancedStyleData(dom) : {}
      const getCellPaddingCellSpacing = function () {
        const spacing = get(style, 'border-spacing').or(get(attrs, 'cellspacing')).fold(() => ({}), (cellspacing) => ({ cellspacing }))
        const padding = get(style, 'border-padding').or(get(attrs, 'cellpadding')).fold(() => ({}), (cellpadding) => ({ cellpadding }))
        return __assign({}, spacing, padding)
      }
      const data = __assign({}, defaultData, style, attrs, advStyle, getBorder(), getCellPaddingCellSpacing())
      return data
    }
    const extractDataFromTableElement = function (editor, elm, hasAdvTableTab) {
      const getBorder = function (dom, elm) {
        const optBorderWidth = getRaw(Element$$1.fromDom(elm), 'border-width')
        if (shouldStyleWithCss(editor) && optBorderWidth.isSome()) {
          return optBorderWidth.getOr('')
        }
        return dom.getAttrib(elm, 'border') || Styles$1.getTDTHOverallStyle(editor.dom, elm, 'border-width') || Styles$1.getTDTHOverallStyle(editor.dom, elm, 'border')
      }
      const { dom } = editor
      const data = __assign({
        width: dom.getStyle(elm, 'width') || dom.getAttrib(elm, 'width'),
        height: dom.getStyle(elm, 'height') || dom.getAttrib(elm, 'height'),
        cellspacing: dom.getStyle(elm, 'border-spacing') || dom.getAttrib(elm, 'cellspacing'),
        cellpadding: dom.getAttrib(elm, 'cellpadding') || Styles$1.getTDTHOverallStyle(editor.dom, elm, 'padding'),
        border: getBorder(dom, elm),
        caption: dom.select('caption', elm)[0] ? 'checked' : 'unchecked',
        class: dom.getAttrib(elm, 'class', ''),
      }, getHAlignment('align', 'align', editor, elm), hasAdvTableTab ? extractAdvancedStyles(dom, elm) : {})
      return data
    }
    const extractDataFromRowElement = function (editor, elm, hasAdvancedRowTab$$1) {
      const { dom } = editor
      const data = __assign({
        height: dom.getStyle(elm, 'height') || dom.getAttrib(elm, 'height'),
        scope: dom.getAttrib(elm, 'scope'),
        class: dom.getAttrib(elm, 'class', ''),
        align: '',
        type: elm.parentNode.nodeName.toLowerCase(),
      }, getHAlignment('align', 'align', editor, elm), hasAdvancedRowTab$$1 ? extractAdvancedStyles(dom, elm) : {})
      return data
    }
    const extractDataFromCellElement = function (editor, elm, hasAdvancedCellTab$$1) {
      const { dom } = editor
      const data = __assign({
        width: dom.getStyle(elm, 'width') || dom.getAttrib(elm, 'width'),
        height: dom.getStyle(elm, 'height') || dom.getAttrib(elm, 'height'),
        scope: dom.getAttrib(elm, 'scope'),
        celltype: elm.nodeName.toLowerCase(),
        class: dom.getAttrib(elm, 'class', ''),
      }, getHAlignment('align', 'halign', editor, elm), getVAlignment('valign', 'valign', editor, elm), hasAdvancedCellTab$$1 ? extractAdvancedStyles(dom, elm) : {})
      return data
    }
    const Helpers = {
      buildListItems,
      extractAdvancedStyles,
      getSharedValues,
      getAdvancedTab,
      extractDataFromTableElement,
      extractDataFromRowElement,
      extractDataFromCellElement,
      extractDataFromSettings,
    }

    const getClassList = function (editor) {
      const rowClassList = getCellClassList(editor)
      const classes = Helpers.buildListItems(rowClassList, (item) => {
        if (item.value) {
          item.textStyle = function () {
            return editor.formatter.getCssText({
              block: 'tr',
              classes: [item.value],
            })
          }
        }
      })
      if (rowClassList.length > 0) {
        return Option.some({
          name: 'class',
          type: 'selectbox',
          label: 'Class',
          items: classes,
        })
      }
      return Option.none()
    }
    const children$3 = [
      {
        name: 'width',
        type: 'input',
        label: 'Width',
      },
      {
        name: 'height',
        type: 'input',
        label: 'Height',
      },
      {
        name: 'celltype',
        type: 'selectbox',
        label: 'Cell type',
        items: [
          {
            text: 'Cell',
            value: 'td',
          },
          {
            text: 'Header cell',
            value: 'th',
          },
        ],
      },
      {
        name: 'scope',
        type: 'selectbox',
        label: 'Scope',
        items: [
          {
            text: 'None',
            value: '',
          },
          {
            text: 'Row',
            value: 'row',
          },
          {
            text: 'Column',
            value: 'col',
          },
          {
            text: 'Row group',
            value: 'rowgroup',
          },
          {
            text: 'Column group',
            value: 'colgroup',
          },
        ],
      },
      {
        name: 'halign',
        type: 'selectbox',
        label: 'H Align',
        items: [
          {
            text: 'None',
            value: '',
          },
          {
            text: 'Left',
            value: 'left',
          },
          {
            text: 'Center',
            value: 'center',
          },
          {
            text: 'Right',
            value: 'right',
          },
        ],
      },
      {
        name: 'valign',
        type: 'selectbox',
        label: 'V Align',
        items: [
          {
            text: 'None',
            value: '',
          },
          {
            text: 'Top',
            value: 'top',
          },
          {
            text: 'Middle',
            value: 'middle',
          },
          {
            text: 'Bottom',
            value: 'bottom',
          },
        ],
      },
    ]
    const items = function (editor) {
      return getClassList(editor).fold(() => children$3, (classlist) => children$3.concat(classlist))
    }
    const CellDialogGeneralTab = { items }

    const normal = function (dom, node) {
      const setAttrib = function (attr, value) {
        dom.setAttrib(node, attr, value)
      }
      const setStyle = function (prop, value) {
        dom.setStyle(node, prop, value)
      }
      return {
        setAttrib,
        setStyle,
      }
    }
    const ifTruthy = function (dom, node) {
      const setAttrib = function (attr, value) {
        if (value) {
          dom.setAttrib(node, attr, value)
        }
      }
      const setStyle = function (prop, value) {
        if (value) {
          dom.setStyle(node, prop, value)
        }
      }
      return {
        setAttrib,
        setStyle,
      }
    }
    const DomModifiers = {
      normal,
      ifTruthy,
    }

    const updateSimpleProps = function (modifiers, data) {
      modifiers.setAttrib('scope', data.scope)
      modifiers.setAttrib('class', data.class)
      modifiers.setStyle('width', addSizeSuffix(data.width))
      modifiers.setStyle('height', addSizeSuffix(data.height))
    }
    const updateAdvancedProps = function (modifiers, data) {
      modifiers.setStyle('background-color', data.backgroundcolor)
      modifiers.setStyle('border-color', data.bordercolor)
      modifiers.setStyle('border-style', data.borderstyle)
    }
    const applyToSingle = function (editor, cells, data) {
      const { dom } = editor
      const cellElm = data.celltype && cells[0].nodeName.toLowerCase() !== data.celltype ? dom.rename(cells[0], data.celltype) : cells[0]
      const modifiers = DomModifiers.normal(dom, cellElm)
      updateSimpleProps(modifiers, data)
      if (hasAdvancedCellTab(editor)) {
        updateAdvancedProps(modifiers, data)
      }
      Styles$1.unApplyAlign(editor, cellElm)
      Styles$1.unApplyVAlign(editor, cellElm)
      if (data.halign) {
        Styles$1.applyAlign(editor, cellElm, data.halign)
      }
      if (data.valign) {
        Styles$1.applyVAlign(editor, cellElm, data.valign)
      }
    }
    const applyToMultiple = function (editor, cells, data) {
      const { dom } = editor
      global$1.each(cells, (cellElm) => {
        if (data.celltype && cellElm.nodeName.toLowerCase() !== data.celltype) {
          cellElm = dom.rename(cellElm, data.celltype)
        }
        const modifiers = DomModifiers.ifTruthy(dom, cellElm)
        updateSimpleProps(modifiers, data)
        if (hasAdvancedCellTab(editor)) {
          updateAdvancedProps(modifiers, data)
        }
        if (data.halign) {
          Styles$1.applyAlign(editor, cellElm, data.halign)
        }
        if (data.valign) {
          Styles$1.applyVAlign(editor, cellElm, data.valign)
        }
      })
    }
    const onSubmitCellForm = function (editor, cells, api) {
      const data = api.getData()
      api.close()
      editor.undoManager.transact(() => {
        const applicator = cells.length === 1 ? applyToSingle : applyToMultiple
        applicator(editor, cells, data)
        editor.focus()
      })
    }
    const open = function (editor) {
      let cellElm; let cells = []
      cells = editor.dom.select('td[data-mce-selected],th[data-mce-selected]')
      cellElm = editor.dom.getParent(editor.selection.getStart(), 'td,th')
      if (!cells.length && cellElm) {
        cells.push(cellElm)
      }
      cellElm = cellElm || cells[0]
      if (!cellElm) {
        return
      }
      const cellsData = global$1.map(cells, (cellElm) => Helpers.extractDataFromCellElement(editor, cellElm, hasAdvancedCellTab(editor)))
      const data = Helpers.getSharedValues(cellsData)
      const dialogTabPanel = {
        type: 'tabpanel',
        tabs: [
          {
            title: 'General',
            items: CellDialogGeneralTab.items(editor),
          },
          Helpers.getAdvancedTab(),
        ],
      }
      const dialogPanel = {
        type: 'panel',
        items: [{
          type: 'grid',
          columns: 2,
          items: CellDialogGeneralTab.items(editor),
        }],
      }
      editor.windowManager.open({
        title: 'Cell Properties',
        size: 'normal',
        body: hasAdvancedCellTab(editor) ? dialogTabPanel : dialogPanel,
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
        initialData: data,
        onSubmit: curry(onSubmitCellForm, editor, cells),
      })
    }
    const CellDialog = { open }

    const getClassList$1 = function (editor) {
      const rowClassList = getRowClassList(editor)
      const classes = Helpers.buildListItems(rowClassList, (item) => {
        if (item.value) {
          item.textStyle = function () {
            return editor.formatter.getCssText({
              block: 'tr',
              classes: [item.value],
            })
          }
        }
      })
      if (rowClassList.length > 0) {
        return Option.some({
          name: 'class',
          type: 'selectbox',
          label: 'Class',
          items: classes,
        })
      }
      return Option.none()
    }
    const formChildren = [
      {
        type: 'selectbox',
        name: 'type',
        label: 'Row type',
        items: [
          {
            text: 'Header',
            value: 'thead',
          },
          {
            text: 'Body',
            value: 'tbody',
          },
          {
            text: 'Footer',
            value: 'tfoot',
          },
        ],
      },
      {
        type: 'selectbox',
        name: 'align',
        label: 'Alignment',
        items: [
          {
            text: 'None',
            value: '',
          },
          {
            text: 'Left',
            value: 'left',
          },
          {
            text: 'Center',
            value: 'center',
          },
          {
            text: 'Right',
            value: 'right',
          },
        ],
      },
      {
        label: 'Height',
        name: 'height',
        type: 'input',
      },
    ]
    const items$1 = function (editor) {
      return getClassList$1(editor).fold(() => formChildren, (classes) => formChildren.concat(classes))
    }
    const RowDialogGeneralTab = { items: items$1 }

    const switchRowType = function (dom, rowElm, toType) {
      const tableElm = dom.getParent(rowElm, 'table')
      const oldParentElm = rowElm.parentNode
      let parentElm = dom.select(toType, tableElm)[0]
      if (!parentElm) {
        parentElm = dom.create(toType)
        if (tableElm.firstChild) {
          if (tableElm.firstChild.nodeName === 'CAPTION') {
            dom.insertAfter(parentElm, tableElm.firstChild)
          } else {
            tableElm.insertBefore(parentElm, tableElm.firstChild)
          }
        } else {
          tableElm.appendChild(parentElm)
        }
      }
      parentElm.appendChild(rowElm)
      if (!oldParentElm.hasChildNodes()) {
        dom.remove(oldParentElm)
      }
    }
    const updateAdvancedProps$1 = function (modifiers, data) {
      modifiers.setStyle('background-color', data.backgroundcolor)
      modifiers.setStyle('border-color', data.bordercolor)
      modifiers.setStyle('border-style', data.borderstyle)
    }
    const onSubmitRowForm = function (editor, rows, oldData, api) {
      const { dom } = editor
      const data = api.getData()
      api.close()
      const createModifier = rows.length === 1 ? DomModifiers.normal : DomModifiers.ifTruthy
      editor.undoManager.transact(() => {
        global$1.each(rows, (rowElm) => {
          if (data.type !== rowElm.parentNode.nodeName.toLowerCase()) {
            switchRowType(editor.dom, rowElm, data.type)
          }
          const modifiers = createModifier(dom, rowElm)
          modifiers.setAttrib('scope', data.scope)
          modifiers.setAttrib('class', data.class)
          modifiers.setStyle('height', addSizeSuffix(data.height))
          if (hasAdvancedRowTab(editor)) {
            updateAdvancedProps$1(modifiers, data)
          }
          if (data.align !== oldData.align) {
            Styles$1.unApplyAlign(editor, rowElm)
            Styles$1.applyAlign(editor, rowElm, data.align)
          }
        })
        editor.focus()
      })
    }
    const open$1 = function (editor) {
      const { dom } = editor
      let tableElm, cellElm, rowElm
      const rows = []
      tableElm = dom.getParent(editor.selection.getStart(), 'table')
      if (!tableElm) {
        return
      }
      cellElm = dom.getParent(editor.selection.getStart(), 'td,th')
      global$1.each(tableElm.rows, (row) => {
        global$1.each(row.cells, (cell) => {
          if ((dom.getAttrib(cell, 'data-mce-selected') || cell === cellElm) && rows.indexOf(row) < 0) {
            rows.push(row)
            return false
          }
        })
      })
      rowElm = rows[0]
      if (!rowElm) {
        return
      }
      const rowsData = global$1.map(rows, (rowElm) => Helpers.extractDataFromRowElement(editor, rowElm, hasAdvancedRowTab(editor)))
      const data = Helpers.getSharedValues(rowsData)
      const dialogTabPanel = {
        type: 'tabpanel',
        tabs: [
          {
            title: 'General',
            items: RowDialogGeneralTab.items(editor),
          },
          Helpers.getAdvancedTab(),
        ],
      }
      const dialogPanel = {
        type: 'panel',
        items: [{
          type: 'grid',
          columns: 2,
          items: RowDialogGeneralTab.items(editor),
        }],
      }
      editor.windowManager.open({
        title: 'Row Properties',
        size: 'normal',
        body: hasAdvancedRowTab(editor) ? dialogTabPanel : dialogPanel,
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
        initialData: data,
        onSubmit: curry(onSubmitRowForm, editor, rows, data),
      })
    }
    const RowDialog = { open: open$1 }

    const global$2 = tinymce.util.Tools.resolve('tinymce.Env')

    const DefaultRenderOptions = {
      styles: {
        'border-collapse': 'collapse',
        width: '100%',
      },
      attributes: { border: '1' },
      percentages: true,
    }
    const makeTable = function () {
      return Element$$1.fromTag('table')
    }
    const tableBody = function () {
      return Element$$1.fromTag('tbody')
    }
    const tableRow = function () {
      return Element$$1.fromTag('tr')
    }
    const tableHeaderCell = function () {
      return Element$$1.fromTag('th')
    }
    const tableCell = function () {
      return Element$$1.fromTag('td')
    }
    const render$1 = function (rows, columns, rowHeaders, columnHeaders, renderOpts) {
      if (renderOpts === void 0) {
        renderOpts = DefaultRenderOptions
      }
      const table = makeTable()
      setAll$1(table, renderOpts.styles)
      setAll(table, renderOpts.attributes)
      const tbody = tableBody()
      append(table, tbody)
      const trs = []
      for (let i = 0; i < rows; i++) {
        const tr = tableRow()
        for (let j = 0; j < columns; j++) {
          const td = i < rowHeaders || j < columnHeaders ? tableHeaderCell() : tableCell()
          if (j < columnHeaders) {
            set(td, 'scope', 'row')
          }
          if (i < rowHeaders) {
            set(td, 'scope', 'col')
          }
          append(td, Element$$1.fromTag('br'))
          if (renderOpts.percentages) {
            set$1(td, 'width', `${100 / columns}%`)
          }
          append(tr, td)
        }
        trs.push(tr)
      }
      append$1(tbody, trs)
      return table
    }

    const get$8 = function (element) {
      return element.dom().innerHTML
    }
    const getOuter$2 = function (element) {
      const container = Element$$1.fromTag('div')
      const clone = Element$$1.fromDom(element.dom().cloneNode(true))
      append(container, clone)
      return get$8(container)
    }

    const placeCaretInCell = function (editor, cell) {
      editor.selection.select(cell.dom(), true)
      editor.selection.collapse(true)
    }
    const selectFirstCellInTable = function (editor, tableElm) {
      descendant$1(tableElm, 'td,th').each(curry(placeCaretInCell, editor))
    }
    const fireEvents = function (editor, table) {
      each(descendants$1(table, 'tr'), (row) => {
        fireNewRow(editor, row.dom())
        each(descendants$1(row, 'th,td'), (cell) => {
          fireNewCell(editor, cell.dom())
        })
      })
    }
    const isPercentage = function (width) {
      return isString(width) && width.indexOf('%') !== -1
    }
    const insert$1 = function (editor, columns, rows) {
      const defaultStyles = getDefaultStyles(editor)
      const options = {
        styles: defaultStyles,
        attributes: getDefaultAttributes(editor),
        percentages: isPercentage(defaultStyles.width) && !isPixelsForced(editor),
      }
      const table = render$1(rows, columns, 0, 0, options)
      set(table, 'data-mce-id', '__mce')
      const html = getOuter$2(table)
      editor.insertContent(html)
      return descendant$1(getBody$1(editor), 'table[data-mce-id="__mce"]').map((table) => {
        if (isPixelsForced(editor)) {
          set$1(table, 'width', get$2(table, 'width'))
        }
        remove(table, 'data-mce-id')
        fireEvents(editor, table)
        selectFirstCellInTable(editor, table)
        return table.dom()
      }).getOr(null)
    }
    const InsertTable = { insert: insert$1 }

    var styleTDTH = function (dom, elm, name, value) {
      if (elm.tagName === 'TD' || elm.tagName === 'TH') {
        dom.setStyle(elm, name, value)
      } else if (elm.children) {
        for (let i = 0; i < elm.children.length; i++) {
          styleTDTH(dom, elm.children[i], name, value)
        }
      }
    }
    const applyDataToElement = function (editor, tableElm, data) {
      const { dom } = editor
      const attrs = {}
      const styles = {}
      attrs.class = data.class
      styles.height = addSizeSuffix(data.height)
      if (dom.getAttrib(tableElm, 'width') && !shouldStyleWithCss(editor)) {
        attrs.width = removePxSuffix(data.width)
      } else {
        styles.width = addSizeSuffix(data.width)
      }
      if (shouldStyleWithCss(editor)) {
        styles['border-width'] = addSizeSuffix(data.border)
        styles['border-spacing'] = addSizeSuffix(data.cellspacing)
      } else {
        attrs.border = data.border
        attrs.cellpadding = data.cellpadding
        attrs.cellspacing = data.cellspacing
      }
      if (shouldStyleWithCss(editor) && tableElm.children) {
        for (let i = 0; i < tableElm.children.length; i++) {
          styleTDTH(dom, tableElm.children[i], {
            'border-width': addSizeSuffix(data.border),
            padding: addSizeSuffix(data.cellpadding),
          })
          if (hasAdvancedTableTab(editor)) {
            styleTDTH(dom, tableElm.children[i], { 'border-color': data.bordercolor })
          }
        }
      }
      if (hasAdvancedTableTab(editor)) {
        styles['background-color'] = data.backgroundcolor
        styles['border-color'] = data.bordercolor
        styles['border-style'] = data.borderstyle
      }
      attrs.style = dom.serializeStyle(merge$1(getDefaultStyles(editor), styles))
      dom.setAttribs(tableElm, merge$1(getDefaultAttributes(editor), attrs))
    }
    const onSubmitTableForm = function (editor, tableElm, api) {
      const { dom } = editor
      let captionElm
      const data = api.getData()
      api.close()
      if (data.class === '') {
        delete data.class
      }
      editor.undoManager.transact(() => {
        if (!tableElm) {
          const cols = parseInt(data.cols, 10) || 1
          const rows = parseInt(data.rows, 10) || 1
          tableElm = InsertTable.insert(editor, cols, rows)
        }
        applyDataToElement(editor, tableElm, data)
        captionElm = dom.select('caption', tableElm)[0]
        if (captionElm && data.caption !== 'checked') {
          dom.remove(captionElm)
        }
        if (!captionElm && data.caption === 'checked') {
          captionElm = dom.create('caption')
          captionElm.innerHTML = !global$2.ie ? '<br data-mce-bogus="1"/>' : '\xA0'
          tableElm.insertBefore(captionElm, tableElm.firstChild)
        }
        if (data.align === '') {
          Styles$1.unApplyAlign(editor, tableElm)
        } else {
          Styles$1.applyAlign(editor, tableElm, data.align)
        }
        editor.focus()
        editor.addVisual()
      })
    }
    const open$2 = function (editor, isNew) {
      const { dom } = editor
      let tableElm
      let data = Helpers.extractDataFromSettings(editor, hasAdvancedTableTab(editor))
      if (isNew === false) {
        tableElm = dom.getParent(editor.selection.getStart(), 'table')
        if (tableElm) {
          data = Helpers.extractDataFromTableElement(editor, tableElm, hasAdvancedTableTab(editor))
        } else if (hasAdvancedTableTab(editor)) {
          data.borderstyle = ''
          data.bordercolor = ''
          data.backgroundcolor = ''
        }
      } else {
        data.cols = '1'
        data.rows = '1'
        if (hasAdvancedTableTab(editor)) {
          data.borderstyle = ''
          data.bordercolor = ''
          data.backgroundcolor = ''
        }
      }
      const hasClasses = getTableClassList(editor).length > 0
      if (hasClasses) {
        if (data.class) {
          data.class = data.class.replace(/\s*mce\-item\-table\s*/g, '')
        }
      }
      const rowColCountItems = !isNew ? [] : [
        {
          type: 'input',
          name: 'cols',
          label: 'Cols',
        },
        {
          type: 'input',
          name: 'rows',
          label: 'Rows',
        },
      ]
      const alwaysItems = [
        {
          type: 'input',
          name: 'width',
          label: 'Width',
        },
        {
          type: 'input',
          name: 'height',
          label: 'Height',
        },
      ]
      const appearanceItems = hasAppearanceOptions(editor) ? [
        {
          type: 'input',
          name: 'cellspacing',
          label: 'Cell spacing',
        },
        {
          type: 'input',
          name: 'cellpadding',
          label: 'Cell padding',
        },
        {
          type: 'input',
          name: 'border',
          label: 'Border width',
        },
        {
          type: 'label',
          label: 'Caption',
          items: [{
            type: 'checkbox',
            name: 'caption',
            label: 'Show caption',
          }],
        },
      ] : []
      const alignmentItem = [{
        type: 'selectbox',
        name: 'align',
        label: 'Alignment',
        items: [
          {
            text: 'None',
            value: '',
          },
          {
            text: 'Left',
            value: 'left',
          },
          {
            text: 'Center',
            value: 'center',
          },
          {
            text: 'Right',
            value: 'right',
          },
        ],
      }]
      const classListItem = hasClasses ? [{
        type: 'selectbox',
        name: 'class',
        label: 'Class',
        items: Helpers.buildListItems(getTableClassList(editor), (item) => {
          if (item.value) {
            item.textStyle = function () {
              return editor.formatter.getCssText({
                block: 'table',
                classes: [item.value],
              })
            }
          }
        }),
      }] : []
      const generalTabItems = rowColCountItems.concat(alwaysItems).concat(appearanceItems).concat(alignmentItem).concat(classListItem)
      const generalPanel = {
        type: 'grid',
        columns: 2,
        items: generalTabItems,
      }
      const nonAdvancedForm = {
        type: 'panel',
        items: [generalPanel],
      }
      const advancedForm = {
        type: 'tabpanel',
        tabs: [
          {
            title: 'General',
            items: [generalPanel],
          },
          Helpers.getAdvancedTab(),
        ],
      }
      const dialogBody = hasAdvancedTableTab(editor) ? advancedForm : nonAdvancedForm
      editor.windowManager.open({
        title: 'Table Properties',
        size: 'normal',
        body: dialogBody,
        onSubmit: curry(onSubmitTableForm, editor, tableElm),
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
        initialData: data,
      })
    }
    const TableDialog = { open: open$2 }

    const each$3 = global$1.each
    const registerCommands = function (editor, actions, cellSelection, selections, clipboardRows) {
      const isRoot = getIsRoot(editor)
      const eraseTable = function () {
        const cell = Element$$1.fromDom(editor.dom.getParent(editor.selection.getStart(), 'th,td'))
        const table = TableLookup.table(cell, isRoot)
        table.filter(not(isRoot)).each((table) => {
          const cursor = Element$$1.fromText('')
          after(table, cursor)
          remove$2(table)
          const rng = editor.dom.createRng()
          rng.setStart(cursor.dom(), 0)
          rng.setEnd(cursor.dom(), 0)
          editor.selection.setRng(rng)
        })
      }
      const getSelectionStartCell = function () {
        return Element$$1.fromDom(editor.dom.getParent(editor.selection.getStart(), 'th,td'))
      }
      const getTableFromCell = function (cell) {
        return TableLookup.table(cell, isRoot)
      }
      const getSize = function (table) {
        return {
          width: getPixelWidth$1(table.dom()),
          height: getPixelWidth$1(table.dom()),
        }
      }
      const resizeChange = function (editor, oldSize, table) {
        const newSize = getSize(table)
        if (oldSize.width !== newSize.width || oldSize.height !== newSize.height) {
          fireObjectResizeStart(editor, table.dom(), oldSize.width, oldSize.height)
          fireObjectResized(editor, table.dom(), newSize.width, newSize.height)
        }
      }
      const actOnSelection = function (execute) {
        const cell = getSelectionStartCell()
        const table = getTableFromCell(cell)
        table.each((table) => {
          const targets = TableTargets.forMenu(selections, table, cell)
          const beforeSize = getSize(table)
          execute(table, targets).each((rng) => {
            resizeChange(editor, beforeSize, table)
            editor.selection.setRng(rng)
            editor.focus()
            cellSelection.clear(table)
            removeDataStyle(table)
          })
        })
      }
      const copyRowSelection = function (execute) {
        const cell = getSelectionStartCell()
        const table = getTableFromCell(cell)
        return table.bind((table) => {
          const doc = Element$$1.fromDom(editor.getDoc())
          const targets = TableTargets.forMenu(selections, table, cell)
          const generators = TableFill.cellOperations(noop, doc, Option.none())
          return CopyRows.copyRows(table, targets, generators)
        })
      }
      const pasteOnSelection = function (execute) {
        clipboardRows.get().each((rows) => {
          const clonedRows = map(rows, (row) => deep(row))
          const cell = getSelectionStartCell()
          const table = getTableFromCell(cell)
          table.bind((table) => {
            const doc = Element$$1.fromDom(editor.getDoc())
            const generators = TableFill.paste(doc)
            const targets = TableTargets.pasteRows(selections, table, cell, clonedRows, generators)
            execute(table, targets).each((rng) => {
              editor.selection.setRng(rng)
              editor.focus()
              cellSelection.clear(table)
            })
          })
        })
      }
      each$3({
        mceTableSplitCells() {
          actOnSelection(actions.unmergeCells)
        },
        mceTableMergeCells() {
          actOnSelection(actions.mergeCells)
        },
        mceTableInsertRowBefore() {
          actOnSelection(actions.insertRowsBefore)
        },
        mceTableInsertRowAfter() {
          actOnSelection(actions.insertRowsAfter)
        },
        mceTableInsertColBefore() {
          actOnSelection(actions.insertColumnsBefore)
        },
        mceTableInsertColAfter() {
          actOnSelection(actions.insertColumnsAfter)
        },
        mceTableDeleteCol() {
          actOnSelection(actions.deleteColumn)
        },
        mceTableDeleteRow() {
          actOnSelection(actions.deleteRow)
        },
        mceTableCutRow(grid) {
          clipboardRows.set(copyRowSelection())
          actOnSelection(actions.deleteRow)
        },
        mceTableCopyRow(grid) {
          clipboardRows.set(copyRowSelection())
        },
        mceTablePasteRowBefore(grid) {
          pasteOnSelection(actions.pasteRowsBefore)
        },
        mceTablePasteRowAfter(grid) {
          pasteOnSelection(actions.pasteRowsAfter)
        },
        mceTableDelete: eraseTable,
      }, (func, name) => {
        editor.addCommand(name, func)
      })
      each$3({
        mceInsertTable: curry(TableDialog.open, editor, true),
        mceTableProps: curry(TableDialog.open, editor, false),
        mceTableRowProps: curry(RowDialog.open, editor),
        mceTableCellProps: curry(CellDialog.open, editor),
      }, (func, name) => {
        editor.addCommand(name, (ui, val) => {
          func(val)
        })
      })
    }
    const Commands = { registerCommands }

    const only$1 = function (element) {
      const parent = Option.from(element.dom().documentElement).map(Element$$1.fromDom).getOr(element)
      return {
        parent: constant(parent),
        view: constant(element),
        origin: constant(Position(0, 0)),
      }
    }
    const detached = function (editable, chrome) {
      const origin = curry(absolute, chrome)
      return {
        parent: constant(chrome),
        view: constant(editable),
        origin,
      }
    }
    const body$1 = function (editable, chrome) {
      return {
        parent: constant(chrome),
        view: constant(editable),
        origin: constant(Position(0, 0)),
      }
    }
    const ResizeWire = {
      only: only$1,
      detached,
      body: body$1,
    }

    function Event(fields) {
      const struct = Immutable.apply(null, fields)
      let handlers = []
      const bind$$1 = function (handler) {
        if (handler === undefined) {
          throw 'Event bind error: undefined handler'
        }
        handlers.push(handler)
      }
      const unbind = function (handler) {
        handlers = filter(handlers, (h) => h !== handler)
      }
      const trigger = function () {
        const event = struct.apply(null, arguments)
        each(handlers, (handler) => {
          handler(event)
        })
      }
      return {
        bind: bind$$1,
        unbind,
        trigger,
      }
    }

    const create = function (typeDefs) {
      const registry = map$1(typeDefs, (event) => ({
        bind: event.bind,
        unbind: event.unbind,
      }))
      const trigger = map$1(typeDefs, (event) => event.trigger)
      return {
        registry,
        trigger,
      }
    }
    const Events = { create }

    const mode = exactly([
      'compare',
      'extract',
      'mutate',
      'sink',
    ])
    const sink = exactly([
      'element',
      'start',
      'stop',
      'destroy',
    ])
    const api$3 = exactly([
      'forceDrop',
      'drop',
      'move',
      'delayDrop',
    ])
    const DragApis = {
      mode,
      sink,
      api: api$3,
    }

    const styles$1 = css('ephox-dragster')
    const Styles$2 = { resolve: styles$1.resolve }

    function Blocker(options) {
      const settings = merge$1({ layerClass: Styles$2.resolve('blocker') }, options)
      const div = Element$$1.fromTag('div')
      set(div, 'role', 'presentation')
      setAll$1(div, {
        position: 'fixed',
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
      })
      add$2(div, Styles$2.resolve('blocker'))
      add$2(div, settings.layerClass)
      const element = function () {
        return div
      }
      const destroy = function () {
        remove$2(div)
      }
      return {
        element,
        destroy,
      }
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
    const bind$1 = function (element, event, filter, handler) {
      return binder(element, event, filter, handler, false)
    }
    var unbind = function (element, event, handler, useCapture) {
      element.dom().removeEventListener(event, handler, useCapture)
    }

    const filter$1 = constant(true)
    const bind$2 = function (element, event, handler) {
      return bind$1(element, event, filter$1, handler)
    }

    const compare = function (old, nu) {
      return Position(nu.left() - old.left(), nu.top() - old.top())
    }
    const extract$1 = function (event) {
      return Option.some(Position(event.x(), event.y()))
    }
    const mutate$1 = function (mutation, info) {
      mutation.mutate(info.left(), info.top())
    }
    const sink$1 = function (dragApi, settings) {
      const blocker = Blocker(settings)
      const mdown = bind$2(blocker.element(), 'mousedown', dragApi.forceDrop)
      const mup = bind$2(blocker.element(), 'mouseup', dragApi.drop)
      const mmove = bind$2(blocker.element(), 'mousemove', dragApi.move)
      const mout = bind$2(blocker.element(), 'mouseout', dragApi.delayDrop)
      const destroy = function () {
        blocker.destroy()
        mup.unbind()
        mmove.unbind()
        mout.unbind()
        mdown.unbind()
      }
      const start = function (parent) {
        append(parent, blocker.element())
      }
      const stop = function () {
        remove$2(blocker.element())
      }
      return DragApis.sink({
        element: blocker.element,
        start,
        stop,
        destroy,
      })
    }
    const MouseDrag = DragApis.mode({
      compare,
      extract: extract$1,
      sink: sink$1,
      mutate: mutate$1,
    })

    function InDrag() {
      let previous = Option.none()
      const reset = function () {
        previous = Option.none()
      }
      const update = function (mode, nu) {
        const result = previous.map((old) => mode.compare(old, nu))
        previous = Option.some(nu)
        return result
      }
      const onEvent = function (event, mode) {
        const dataOption = mode.extract(event)
        dataOption.each((data) => {
          const offset = update(mode, data)
          offset.each((d) => {
            events.trigger.move(d)
          })
        })
      }
      var events = Events.create({ move: Event(['info']) })
      return {
        onEvent,
        reset,
        events: events.registry,
      }
    }

    function NoDrag(anchor) {
      const onEvent = function (event, mode) {
      }
      return {
        onEvent,
        reset: noop,
      }
    }

    function Movement() {
      const noDragState = NoDrag()
      const inDragState = InDrag()
      let dragState = noDragState
      const on = function () {
        dragState.reset()
        dragState = inDragState
      }
      const off = function () {
        dragState.reset()
        dragState = noDragState
      }
      const onEvent = function (event, mode) {
        dragState.onEvent(event, mode)
      }
      const isOn = function () {
        return dragState === inDragState
      }
      return {
        on,
        off,
        isOn,
        onEvent,
        events: inDragState.events,
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

    const setup = function (mutation, mode, settings) {
      let active = false
      const events = Events.create({
        start: Event([]),
        stop: Event([]),
      })
      const movement = Movement()
      const drop = function () {
        sink.stop()
        if (movement.isOn()) {
          movement.off()
          events.trigger.stop()
        }
      }
      const throttledDrop = last$3(drop, 200)
      const go = function (parent) {
        sink.start(parent)
        movement.on()
        events.trigger.start()
      }
      const mousemove = function (event, ui) {
        throttledDrop.cancel()
        movement.onEvent(event, mode)
      }
      movement.events.move.bind((event) => {
        mode.mutate(mutation, event.info())
      })
      const on = function () {
        active = true
      }
      const off = function () {
        active = false
      }
      const runIfActive = function (f) {
        return function () {
          const args = Array.prototype.slice.call(arguments, 0)
          if (active) {
            return f.apply(null, args)
          }
        }
      }
      var sink = mode.sink(DragApis.api({
        forceDrop: drop,
        drop: runIfActive(drop),
        move: runIfActive(mousemove),
        delayDrop: runIfActive(throttledDrop.throttle),
      }), settings)
      const destroy = function () {
        sink.destroy()
      }
      return {
        element: sink.element,
        go,
        on,
        off,
        destroy,
        events: events.registry,
      }
    }
    const Dragging = { setup }

    const transform$1 = function (mutation, options) {
      const settings = options !== undefined ? options : {}
      const mode = settings.mode !== undefined ? settings.mode : MouseDrag
      return Dragging.setup(mutation, mode, options)
    }
    const Dragger = { transform: transform$1 }

    function Mutation() {
      const events = Events.create({
        drag: Event([
          'xDelta',
          'yDelta',
        ]),
      })
      const mutate = function (x, y) {
        events.trigger.drag(x, y)
      }
      return {
        mutate,
        events: events.registry,
      }
    }

    function BarMutation() {
      const events = Events.create({
        drag: Event([
          'xDelta',
          'yDelta',
          'target',
        ]),
      })
      let target = Option.none()
      const delegate = Mutation()
      delegate.events.drag.bind((event) => {
        target.each((t) => {
          events.trigger.drag(event.xDelta(), event.yDelta(), t)
        })
      })
      const assign = function (t) {
        target = Option.some(t)
      }
      const get = function () {
        return target
      }
      return {
        assign,
        get,
        mutate: delegate.mutate,
        events: events.registry,
      }
    }

    const closest$2 = function (scope, selector, isRoot) {
      return closest$1(scope, selector, isRoot).isSome()
    }

    const resizeBarDragging = Styles.resolve('resizer-bar-dragging')
    function BarManager(wire, direction, hdirection) {
      const mutation = BarMutation()
      const resizing = Dragger.transform(mutation, {})
      let hoverTable = Option.none()
      const getResizer = function (element, type$$1) {
        return Option.from(get$1(element, type$$1))
      }
      mutation.events.drag.bind((event) => {
        getResizer(event.target(), 'data-row').each((_dataRow) => {
          const currentRow = CellUtils.getInt(event.target(), 'top')
          set$1(event.target(), 'top', `${currentRow + event.yDelta()}px`)
        })
        getResizer(event.target(), 'data-column').each((_dataCol) => {
          const currentCol = CellUtils.getInt(event.target(), 'left')
          set$1(event.target(), 'left', `${currentCol + event.xDelta()}px`)
        })
      })
      const getDelta = function (target, direction) {
        const newX = CellUtils.getInt(target, direction)
        const oldX = parseInt(get$1(target, `data-initial-${direction}`), 10)
        return newX - oldX
      }
      resizing.events.stop.bind(() => {
        mutation.get().each((target) => {
          hoverTable.each((table) => {
            getResizer(target, 'data-row').each((row) => {
              const delta = getDelta(target, 'top')
              remove(target, 'data-initial-top')
              events.trigger.adjustHeight(table, delta, parseInt(row, 10))
            })
            getResizer(target, 'data-column').each((column) => {
              const delta = getDelta(target, 'left')
              remove(target, 'data-initial-left')
              events.trigger.adjustWidth(table, delta, parseInt(column, 10))
            })
            Bars.refresh(wire, table, hdirection, direction)
          })
        })
      })
      const handler = function (target, direction) {
        events.trigger.startAdjust()
        mutation.assign(target)
        set(target, `data-initial-${direction}`, parseInt(get$2(target, direction), 10))
        add$2(target, resizeBarDragging)
        set$1(target, 'opacity', '0.2')
        resizing.go(wire.parent())
      }
      const mousedown = bind$2(wire.parent(), 'mousedown', (event) => {
        if (Bars.isRowBar(event.target())) { handler(event.target(), 'top') }
        if (Bars.isColBar(event.target())) { handler(event.target(), 'left') }
      })
      const isRoot = function (e) {
        return eq(e, wire.view())
      }
      const mouseover = bind$2(wire.view(), 'mouseover', (event) => {
        if (name(event.target()) === 'table' || closest$2(event.target(), 'table', isRoot)) {
          hoverTable = name(event.target()) === 'table' ? Option.some(event.target()) : ancestor$1(event.target(), 'table', isRoot)
          hoverTable.each((ht) => {
            Bars.refresh(wire, ht, hdirection, direction)
          })
        } else if (inBody(event.target())) {
          Bars.destroy(wire)
        }
      })
      const destroy = function () {
        mousedown.unbind()
        mouseover.unbind()
        resizing.destroy()
        Bars.destroy(wire)
      }
      const refresh = function (tbl) {
        Bars.refresh(wire, tbl, hdirection, direction)
      }
      var events = Events.create({
        adjustHeight: Event([
          'table',
          'delta',
          'row',
        ]),
        adjustWidth: Event([
          'table',
          'delta',
          'column',
        ]),
        startAdjust: Event([]),
      })
      return {
        destroy,
        refresh,
        on: resizing.on,
        off: resizing.off,
        hideBars: curry(Bars.hide, wire),
        showBars: curry(Bars.show, wire),
        events: events.registry,
      }
    }

    function TableResize(wire, vdirection) {
      const hdirection = BarPositions.height
      const manager = BarManager(wire, vdirection, hdirection)
      const events = Events.create({
        beforeResize: Event(['table']),
        afterResize: Event(['table']),
        startDrag: Event([]),
      })
      manager.events.adjustHeight.bind((event) => {
        events.trigger.beforeResize(event.table())
        const delta = hdirection.delta(event.delta(), event.table())
        Adjustments.adjustHeight(event.table(), delta, event.row(), hdirection)
        events.trigger.afterResize(event.table())
      })
      manager.events.startAdjust.bind((event) => {
        events.trigger.startDrag()
      })
      manager.events.adjustWidth.bind((event) => {
        events.trigger.beforeResize(event.table())
        const delta = vdirection.delta(event.delta(), event.table())
        Adjustments.adjustWidth(event.table(), delta, event.column(), vdirection)
        events.trigger.afterResize(event.table())
      })
      return {
        on: manager.on,
        off: manager.off,
        hideBars: manager.hideBars,
        showBars: manager.showBars,
        destroy: manager.destroy,
        events: events.registry,
      }
    }

    const createContainer = function () {
      const container = Element$$1.fromTag('div')
      setAll$1(container, {
        position: 'static',
        height: '0',
        width: '0',
        padding: '0',
        margin: '0',
        border: '0',
      })
      append(body(), container)
      return container
    }
    const get$9 = function (editor, container) {
      return editor.inline ? ResizeWire.body(getBody$1(editor), createContainer()) : ResizeWire.only(Element$$1.fromDom(editor.getDoc()))
    }
    const remove$6 = function (editor, wire) {
      if (editor.inline) {
        remove$2(wire.parent())
      }
    }
    const TableWire = {
      get: get$9,
      remove: remove$6,
    }

    const ResizeHandler = function (editor) {
      let selectionRng = Option.none()
      let resize = Option.none()
      let wire = Option.none()
      const percentageBasedSizeRegex = /(\d+(\.\d+)?)%/
      let startW, startRawW
      const isTable = function (elm) {
        return elm.nodeName === 'TABLE'
      }
      const getRawWidth = function (elm) {
        return editor.dom.getStyle(elm, 'width') || editor.dom.getAttrib(elm, 'width')
      }
      const lazyResize = function () {
        return resize
      }
      const lazyWire = function () {
        return wire.getOr(ResizeWire.only(Element$$1.fromDom(editor.getBody())))
      }
      const destroy = function () {
        resize.each((sz) => {
          sz.destroy()
        })
        wire.each((w) => {
          TableWire.remove(editor, w)
        })
      }
      editor.on('init', () => {
        const direction = TableDirection(Direction.directionAt)
        const rawWire = TableWire.get(editor)
        wire = Option.some(rawWire)
        if (hasObjectResizing(editor) && hasTableResizeBars(editor)) {
          const sz = TableResize(rawWire, direction)
          sz.on()
          sz.events.startDrag.bind((event) => {
            selectionRng = Option.some(editor.selection.getRng())
          })
          sz.events.beforeResize.bind((event) => {
            const rawTable = event.table().dom()
            fireObjectResizeStart(editor, rawTable, getPixelWidth$1(rawTable), getPixelHeight(rawTable))
          })
          sz.events.afterResize.bind((event) => {
            const table = event.table()
            const rawTable = table.dom()
            removeDataStyle(table)
            selectionRng.each((rng) => {
              editor.selection.setRng(rng)
              editor.focus()
            })
            fireObjectResized(editor, rawTable, getPixelWidth$1(rawTable), getPixelHeight(rawTable))
            editor.undoManager.add()
          })
          resize = Option.some(sz)
        }
      })
      editor.on('ObjectResizeStart', (e) => {
        const targetElm = e.target
        if (isTable(targetElm)) {
          startW = e.width
          startRawW = getRawWidth(targetElm)
        }
      })
      editor.on('ObjectResized', (e) => {
        const targetElm = e.target
        if (isTable(targetElm)) {
          const table = targetElm
          if (percentageBasedSizeRegex.test(startRawW)) {
            const percentW = parseFloat(percentageBasedSizeRegex.exec(startRawW)[1])
            const targetPercentW = e.width * percentW / startW
            editor.dom.setStyle(table, 'width', `${targetPercentW}%`)
          } else {
            const newCellSizes_1 = []
            global$1.each(table.rows, (row) => {
              global$1.each(row.cells, (cell) => {
                const width = editor.dom.getStyle(cell, 'width', true)
                newCellSizes_1.push({
                  cell,
                  width,
                })
              })
            })
            global$1.each(newCellSizes_1, (newCellSize) => {
              editor.dom.setStyle(newCellSize.cell, 'width', newCellSize.width)
              editor.dom.setAttrib(newCellSize.cell, 'width', null)
            })
          }
        }
      })
      return {
        lazyResize,
        lazyWire,
        destroy,
      }
    }

    const none$2 = function (current) {
      return folder$1((n, f, m, l) => n(current))
    }
    const first$5 = function (current) {
      return folder$1((n, f, m, l) => f(current))
    }
    const middle$1 = function (current, target) {
      return folder$1((n, f, m, l) => m(current, target))
    }
    const last$4 = function (current) {
      return folder$1((n, f, m, l) => l(current))
    }
    var folder$1 = function (fold) {
      return { fold }
    }
    const CellLocation = {
      none: none$2,
      first: first$5,
      middle: middle$1,
      last: last$4,
    }

    const detect$4 = function (current, isRoot) {
      return TableLookup.table(current, isRoot).bind((table) => {
        const all = TableLookup.cells(table)
        const index = findIndex(all, (x) => eq(current, x))
        return index.map((ind) => ({
          index: constant(ind),
          all: constant(all),
        }))
      })
    }
    const next = function (current, isRoot) {
      const detection = detect$4(current, isRoot)
      return detection.fold(() => CellLocation.none(current), (info) => info.index() + 1 < info.all().length ? CellLocation.middle(current, info.all()[info.index() + 1]) : CellLocation.last(current))
    }
    const prev = function (current, isRoot) {
      const detection = detect$4(current, isRoot)
      return detection.fold(() => CellLocation.none(), (info) => info.index() - 1 >= 0 ? CellLocation.middle(current, info.all()[info.index() - 1]) : CellLocation.first(current))
    }
    const CellNavigation = {
      next,
      prev,
    }

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
    const cata$1 = function (subject, onBefore, onOn, onAfter) {
      return subject.fold(onBefore, onOn, onAfter)
    }
    const getStart = function (situ) {
      return situ.fold(identity, identity, identity)
    }
    const before$2 = adt.before
    const { on } = adt
    const after$2 = adt.after
    const Situ = {
      before: before$2,
      on,
      after: after$2,
      cata: cata$1,
      getStart,
    }

    const type$2 = Adt.generate([
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
    const getStart$1 = function (selection) {
      return selection.match({
        domRange(rng) {
          return Element$$1.fromDom(rng.startContainer)
        },
        relative(startSitu, finishSitu) {
          return Situ.getStart(startSitu)
        },
        exact(start, soffset, finish, foffset) {
          return start
        },
      })
    }
    const getWin = function (selection) {
      const start = getStart$1(selection)
      return defaultView(start)
    }
    const { domRange } = type$2
    const relative$1 = type$2.relative
    const { exact } = type$2

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

    const selectNodeContents = function (win, element) {
      const rng = win.document.createRange()
      selectNodeContentsUsing(rng, element)
      return rng
    }
    var selectNodeContentsUsing = function (rng, element) {
      rng.selectNodeContents(element.dom())
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

    const adt$1 = Adt.generate([
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
        return reversed.map((rev) => adt$1.rtl(Element$$1.fromDom(rev.endContainer), rev.endOffset, Element$$1.fromDom(rev.startContainer), rev.startOffset)).getOrThunk(() => fromRange(win, adt$1.ltr, rng))
      }
      return fromRange(win, adt$1.ltr, rng)
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
    const ltr$2 = adt$1.ltr
    const rtl$2 = adt$1.rtl

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
      const { length } = get$3(textnode)
      const offset = searchForPoint(rectForOffset, x, y, rect.right, length)
      return rangeForOffset(offset)
    }
    const locate = function (doc, node, x, y) {
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
      const locator = isText(node) ? locate : searchInChildren
      return locator(doc, node, x, y)
    }
    const locate$1 = function (doc, node, x, y) {
      const r = doc.dom().createRange()
      r.selectNode(node.dom())
      const rect = r.getBoundingClientRect()
      const boundedX = Math.max(rect.left, Math.min(rect.right, x))
      const boundedY = Math.max(rect.top, Math.min(rect.bottom, y))
      return locateNode(doc, node, boundedX, boundedY)
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
    const search = function (doc, node, x) {
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
      return locate$1(doc, node, boundedX, boundedY)
    }
    const searchFromPoint = function (doc, x, y) {
      return Element$$1.fromPoint(doc, x, y).bind((elem) => {
        const fallback = function () {
          return search(doc, elem, x)
        }
        return children(elem).length === 0 ? fallback() : searchTextNodes(doc, elem, x, y).orThunk(fallback)
      })
    }
    const availableSearch = document.caretPositionFromPoint ? caretPositionFromPoint : document.caretRangeFromPoint ? caretRangeFromPoint : searchFromPoint
    const fromPoint$1 = function (win, x, y) {
      const doc = Element$$1.fromDom(win.document)
      return availableSearch(doc, x, y).map((rng) => range$2(Element$$1.fromDom(rng.startContainer), rng.startOffset, Element$$1.fromDom(rng.endContainer), rng.endOffset))
    }

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
    const preprocessRelative = function (startSitu, finishSitu) {
      const start = startSitu.fold(Situ.before, beforeSpecial, Situ.after)
      const finish = finishSitu.fold(Situ.before, beforeSpecial, Situ.after)
      return relative$1(start, finish)
    }
    const preprocessExact = function (start, soffset, finish, foffset) {
      const startSitu = beforeSpecial(start, soffset)
      const finishSitu = beforeSpecial(finish, foffset)
      return relative$1(startSitu, finishSitu)
    }
    const preprocess = function (selection) {
      return selection.match({
        domRange(rng) {
          const start = Element$$1.fromDom(rng.startContainer)
          const finish = Element$$1.fromDom(rng.endContainer)
          return preprocessExact(start, rng.startOffset, finish, rng.endOffset)
        },
        relative: preprocessRelative,
        exact: preprocessExact,
      })
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
    const setRangeFromRelative = function (win, relative) {
      return diagnose(win, relative).match({
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
      const relative = preprocessExact(start, soffset, finish, foffset)
      setRangeFromRelative(win, relative)
    }
    const setRelative = function (win, startSitu, finishSitu) {
      const relative = preprocessRelative(startSitu, finishSitu)
      setRangeFromRelative(win, relative)
    }
    const toNative = function (selection) {
      const win = getWin(selection).dom()
      const getDomRange = function (start, soffset, finish, foffset) {
        return exactToNative(win, start, soffset, finish, foffset)
      }
      const filtered = preprocess(selection)
      return diagnose(win, filtered).match({
        ltr: getDomRange,
        rtl: getDomRange,
      })
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
    const setToElement = function (win, element) {
      const rng = selectNodeContents(win, element)
      doSetNativeRange(win, rng)
    }
    const getExact = function (win) {
      return Option.from(win.getSelection()).filter((sel) => sel.rangeCount > 0).bind(doGetExact)
    }
    const get$a = function (win) {
      return getExact(win).map((range) => exact(range.start(), range.soffset(), range.finish(), range.foffset()))
    }
    const getFirstRect$1 = function (win, selection) {
      const rng = asLtrRange(win, selection)
      return getFirstRect(rng)
    }
    const getAtPoint = function (win, x, y) {
      return fromPoint$1(win, x, y)
    }
    const clear$1 = function (win) {
      const selection = win.getSelection()
      selection.removeAllRanges()
    }

    const global$3 = tinymce.util.Tools.resolve('tinymce.util.VK')

    const forward = function (editor, isRoot, cell, lazyWire) {
      return go(editor, isRoot, CellNavigation.next(cell), lazyWire)
    }
    const backward = function (editor, isRoot, cell, lazyWire) {
      return go(editor, isRoot, CellNavigation.prev(cell), lazyWire)
    }
    const getCellFirstCursorPosition = function (editor, cell) {
      const selection = exact(cell, 0, cell, 0)
      return toNative(selection)
    }
    const getNewRowCursorPosition = function (editor, table) {
      const rows = descendants$1(table, 'tr')
      return last(rows).bind((last$$1) => descendant$1(last$$1, 'td,th').map((first) => getCellFirstCursorPosition(editor, first)))
    }
    var go = function (editor, isRoot, cell, actions, lazyWire) {
      return cell.fold(Option.none, Option.none, (current, next) => first$3(next).map((cell) => getCellFirstCursorPosition(editor, cell)), (current) => TableLookup.table(current, isRoot).bind((table) => {
        const targets = TableTargets.noMenu(current)
        editor.undoManager.transact(() => {
          actions.insertRowsAfter(table, targets)
        })
        return getNewRowCursorPosition(editor, table)
      }))
    }
    const rootElements = [
      'table',
      'li',
      'dl',
    ]
    const handle$1 = function (event, editor, actions, lazyWire) {
      if (event.keyCode === global$3.TAB) {
        const body_1 = getBody$1(editor)
        const isRoot_1 = function (element) {
          const name$$1 = name(element)
          return eq(element, body_1) || contains(rootElements, name$$1)
        }
        const rng = editor.selection.getRng()
        if (rng.collapsed) {
          const start = Element$$1.fromDom(rng.startContainer)
          TableLookup.cell(start, isRoot_1).each((cell) => {
            event.preventDefault()
            const navigation = event.shiftKey ? backward : forward
            const rng = navigation(editor, isRoot_1, cell, actions, lazyWire)
            rng.each((range$$1) => {
              editor.selection.setRng(range$$1)
            })
          })
        }
      }
    }
    const TabContext = { handle: handle$1 }

    const response = Immutable('selection', 'kill')
    const Responses = { response }

    const isKey = function (key) {
      return function (keycode) {
        return keycode === key
      }
    }
    const isUp = isKey(38)
    const isDown = isKey(40)
    const isNavigation = function (keycode) {
      return keycode >= 37 && keycode <= 40
    }
    const SelectionKeys = {
      ltr: {
        isBackward: isKey(37),
        isForward: isKey(39),
      },
      rtl: {
        isBackward: isKey(39),
        isForward: isKey(37),
      },
      isUp,
      isDown,
      isNavigation,
    }

    const convertToRange = function (win, selection) {
      const rng = asLtrRange(win, selection)
      return {
        start: constant(Element$$1.fromDom(rng.startContainer)),
        soffset: constant(rng.startOffset),
        finish: constant(Element$$1.fromDom(rng.endContainer)),
        foffset: constant(rng.endOffset),
      }
    }
    const makeSitus = function (start, soffset, finish, foffset) {
      return {
        start: constant(Situ.on(start, soffset)),
        finish: constant(Situ.on(finish, foffset)),
      }
    }
    const Util$1 = {
      convertToRange,
      makeSitus,
    }

    const isSafari = PlatformDetection$1.detect().browser.isSafari()
    const get$b = function (_DOC) {
      const doc = _DOC !== undefined ? _DOC.dom() : document
      const x = doc.body.scrollLeft || doc.documentElement.scrollLeft
      const y = doc.body.scrollTop || doc.documentElement.scrollTop
      return Position(x, y)
    }
    const by = function (x, y, _DOC) {
      const doc = _DOC !== undefined ? _DOC.dom() : document
      const win = doc.defaultView
      win.scrollBy(x, y)
    }

    function WindowBridge(win) {
      const elementFromPoint = function (x, y) {
        return Element$$1.fromPoint(Element$$1.fromDom(win.document), x, y)
      }
      const getRect = function (element) {
        return element.dom().getBoundingClientRect()
      }
      const getRangedRect = function (start, soffset, finish, foffset) {
        const sel = exact(start, soffset, finish, foffset)
        return getFirstRect$1(win, sel).map((structRect) => map$1(structRect, apply))
      }
      const getSelection = function () {
        return get$a(win).map((exactAdt) => Util$1.convertToRange(win, exactAdt))
      }
      const fromSitus = function (situs) {
        const relative = relative$1(situs.start(), situs.finish())
        return Util$1.convertToRange(win, relative)
      }
      const situsFromPoint = function (x, y) {
        return getAtPoint(win, x, y).map((exact$$1) => ({
          start: constant(Situ.on(exact$$1.start(), exact$$1.soffset())),
          finish: constant(Situ.on(exact$$1.finish(), exact$$1.foffset())),
        }))
      }
      const clearSelection = function () {
        clear$1(win)
      }
      const selectContents = function (element) {
        setToElement(win, element)
      }
      const setSelection = function (sel) {
        setExact(win, sel.start(), sel.soffset(), sel.finish(), sel.foffset())
      }
      const setRelativeSelection = function (start, finish) {
        setRelative(win, start, finish)
      }
      const getInnerHeight = function () {
        return win.innerHeight
      }
      const getScrollY = function () {
        const pos = get$b(Element$$1.fromDom(win.document))
        return pos.top()
      }
      const scrollBy = function (x, y) {
        by(x, y, Element$$1.fromDom(win.document))
      }
      return {
        elementFromPoint,
        getRect,
        getRangedRect,
        getSelection,
        fromSitus,
        situsFromPoint,
        clearSelection,
        setSelection,
        setRelativeSelection,
        selectContents,
        getInnerHeight,
        getScrollY,
        scrollBy,
      }
    }

    const sync = function (container, isRoot, start, soffset, finish, foffset, selectRange) {
      if (!(eq(start, finish) && soffset === foffset)) {
        return closest$1(start, 'td,th', isRoot).bind((s) => closest$1(finish, 'td,th', isRoot).bind((f) => detect$5(container, isRoot, s, f, selectRange)))
      }
      return Option.none()
    }
    var detect$5 = function (container, isRoot, start, finish, selectRange) {
      if (!eq(start, finish)) {
        return CellSelection.identify(start, finish, isRoot).bind((cellSel) => {
          const boxes = cellSel.boxes().getOr([])
          if (boxes.length > 0) {
            selectRange(container, boxes, cellSel.start(), cellSel.finish())
            return Option.some(Responses.response(Option.some(Util$1.makeSitus(start, 0, start, getEnd(start))), true))
          }
          return Option.none()
        })
      }
      return Option.none()
    }
    const update = function (rows, columns, container, selected, annotations) {
      const updateSelection = function (newSels) {
        annotations.clear(container)
        annotations.selectRange(container, newSels.boxes(), newSels.start(), newSels.finish())
        return newSels.boxes()
      }
      return CellSelection.shiftSelection(selected, rows, columns, annotations.firstSelectedSelector(), annotations.lastSelectedSelector()).map(updateSelection)
    }
    const KeySelection = {
      sync,
      detect: detect$5,
      update,
    }

    const nu$3 = MixedBag([
      'left',
      'top',
      'right',
      'bottom',
    ], [])
    const moveDown = function (caret, amount) {
      return nu$3({
        left: caret.left(),
        top: caret.top() + amount,
        right: caret.right(),
        bottom: caret.bottom() + amount,
      })
    }
    const moveUp = function (caret, amount) {
      return nu$3({
        left: caret.left(),
        top: caret.top() - amount,
        right: caret.right(),
        bottom: caret.bottom() - amount,
      })
    }
    const moveBottomTo = function (caret, bottom) {
      const height = caret.bottom() - caret.top()
      return nu$3({
        left: caret.left(),
        top: bottom - height,
        right: caret.right(),
        bottom,
      })
    }
    const moveTopTo = function (caret, top) {
      const height = caret.bottom() - caret.top()
      return nu$3({
        left: caret.left(),
        top,
        right: caret.right(),
        bottom: top + height,
      })
    }
    const translate = function (caret, xDelta, yDelta) {
      return nu$3({
        left: caret.left() + xDelta,
        top: caret.top() + yDelta,
        right: caret.right() + xDelta,
        bottom: caret.bottom() + yDelta,
      })
    }
    const getTop$1 = function (caret) {
      return caret.top()
    }
    const getBottom = function (caret) {
      return caret.bottom()
    }
    const toString$1 = function (caret) {
      return `(${caret.left()}, ${caret.top()}) -> (${caret.right()}, ${caret.bottom()})`
    }
    const Carets = {
      nu: nu$3,
      moveUp,
      moveDown,
      moveBottomTo,
      moveTopTo,
      getTop: getTop$1,
      getBottom,
      translate,
      toString: toString$1,
    }

    const getPartialBox = function (bridge, element, offset) {
      if (offset >= 0 && offset < getEnd(element)) { return bridge.getRangedRect(element, offset, element, offset + 1) }
      if (offset > 0) { return bridge.getRangedRect(element, offset - 1, element, offset) }
      return Option.none()
    }
    const toCaret = function (rect) {
      return Carets.nu({
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
      })
    }
    const getElemBox = function (bridge, element) {
      return Option.some(bridge.getRect(element))
    }
    const getBoxAt = function (bridge, element, offset) {
      if (isElement(element)) { return getElemBox(bridge, element).map(toCaret) }
      if (isText(element)) { return getPartialBox(bridge, element, offset).map(toCaret) }
      return Option.none()
    }
    const getEntireBox = function (bridge, element) {
      if (isElement(element)) { return getElemBox(bridge, element).map(toCaret) }
      if (isText(element)) { return bridge.getRangedRect(element, 0, element, getEnd(element)).map(toCaret) }
      return Option.none()
    }
    const Rectangles = {
      getBoxAt,
      getEntireBox,
    }

    const traverse = Immutable('item', 'mode')
    const backtrack = function (universe, item, direction, _transition) {
      const transition = _transition !== undefined ? _transition : sidestep
      return universe.property().parent(item).map((p) => traverse(p, transition))
    }
    var sidestep = function (universe, item, direction, _transition) {
      const transition = _transition !== undefined ? _transition : advance
      return direction.sibling(universe, item).map((p) => traverse(p, transition))
    }
    var advance = function (universe, item, direction, _transition) {
      const transition = _transition !== undefined ? _transition : advance
      const children = universe.property().children(item)
      const result = direction.first(children)
      return result.map((r) => traverse(r, transition))
    }
    const successors = [
      {
        current: backtrack,
        next: sidestep,
        fallback: Option.none(),
      },
      {
        current: sidestep,
        next: advance,
        fallback: Option.some(backtrack),
      },
      {
        current: advance,
        next: advance,
        fallback: Option.some(sidestep),
      },
    ]
    var go$1 = function (universe, item, mode, direction, rules) {
      var rules = rules !== undefined ? rules : successors
      const ruleOpt = find(rules, (succ) => succ.current === mode)
      return ruleOpt.bind((rule) => rule.current(universe, item, direction, rule.next).orThunk(() => rule.fallback.bind((fb) => go$1(universe, item, fb, direction))))
    }
    const Walker = {
      backtrack,
      sidestep,
      advance,
      go: go$1,
    }

    const left$1 = function () {
      const sibling = function (universe, item) {
        return universe.query().prevSibling(item)
      }
      const first = function (children) {
        return children.length > 0 ? Option.some(children[children.length - 1]) : Option.none()
      }
      return {
        sibling,
        first,
      }
    }
    const right$1 = function () {
      const sibling = function (universe, item) {
        return universe.query().nextSibling(item)
      }
      const first = function (children) {
        return children.length > 0 ? Option.some(children[0]) : Option.none()
      }
      return {
        sibling,
        first,
      }
    }
    const Walkers = {
      left: left$1,
      right: right$1,
    }

    var hone = function (universe, item, predicate, mode, direction, isRoot) {
      const next = Walker.go(universe, item, mode, direction)
      return next.bind((n) => {
        if (isRoot(n.item())) { return Option.none() }
        return predicate(n.item()) ? Option.some(n.item()) : hone(universe, n.item(), predicate, n.mode(), direction, isRoot)
      })
    }
    const left$2 = function (universe, item, predicate, isRoot) {
      return hone(universe, item, predicate, Walker.sidestep, Walkers.left(), isRoot)
    }
    const right$2 = function (universe, item, predicate, isRoot) {
      return hone(universe, item, predicate, Walker.sidestep, Walkers.right(), isRoot)
    }
    const Seeker = {
      left: left$2,
      right: right$2,
    }

    const isLeaf = function (universe, element) {
      return universe.property().children(element).length === 0
    }
    const before$3 = function (universe, item, isRoot) {
      return seekLeft(universe, item, curry(isLeaf, universe), isRoot)
    }
    const after$4 = function (universe, item, isRoot) {
      return seekRight(universe, item, curry(isLeaf, universe), isRoot)
    }
    var seekLeft = function (universe, item, predicate, isRoot) {
      return Seeker.left(universe, item, predicate, isRoot)
    }
    var seekRight = function (universe, item, predicate, isRoot) {
      return Seeker.right(universe, item, predicate, isRoot)
    }
    const walkers = function () {
      return {
        left: Walkers.left,
        right: Walkers.right,
      }
    }
    const walk = function (universe, item, mode, direction, _rules) {
      return Walker.go(universe, item, mode, direction, _rules)
    }
    const Gather = {
      before: before$3,
      after: after$4,
      seekLeft,
      seekRight,
      walkers,
      walk,
      backtrack: Walker.backtrack,
      sidestep: Walker.sidestep,
      advance: Walker.advance,
    }

    const universe$2 = DomUniverse()
    const gather = function (element, prune, transform) {
      return Gather.gather(universe$2, element, prune, transform)
    }
    const before$4 = function (element, isRoot) {
      return Gather.before(universe$2, element, isRoot)
    }
    const after$5 = function (element, isRoot) {
      return Gather.after(universe$2, element, isRoot)
    }
    const seekLeft$1 = function (element, predicate, isRoot) {
      return Gather.seekLeft(universe$2, element, predicate, isRoot)
    }
    const seekRight$1 = function (element, predicate, isRoot) {
      return Gather.seekRight(universe$2, element, predicate, isRoot)
    }
    const walkers$1 = function () {
      return Gather.walkers()
    }
    const walk$1 = function (item, mode, direction, _rules) {
      return Gather.walk(universe$2, item, mode, direction, _rules)
    }
    const DomGather = {
      gather,
      before: before$4,
      after: after$5,
      seekLeft: seekLeft$1,
      seekRight: seekRight$1,
      walkers: walkers$1,
      walk: walk$1,
    }

    const JUMP_SIZE = 5
    const NUM_RETRIES = 100
    const adt$2 = Adt.generate([
      { none: [] },
      { retry: ['caret'] },
    ])
    const isOutside = function (caret, box) {
      return caret.left() < box.left() || Math.abs(box.right() - caret.left()) < 1 || caret.left() > box.right()
    }
    const inOutsideBlock = function (bridge, element, caret) {
      return closest(element, DomStructure.isBlock).fold(constant(false), (cell) => Rectangles.getEntireBox(bridge, cell).exists((box) => isOutside(caret, box)))
    }
    const adjustDown = function (bridge, element, guessBox, original, caret) {
      const lowerCaret = Carets.moveDown(caret, JUMP_SIZE)
      if (Math.abs(guessBox.bottom() - original.bottom()) < 1) { return adt$2.retry(lowerCaret) }
      if (guessBox.top() > caret.bottom()) { return adt$2.retry(lowerCaret) }
      if (guessBox.top() === caret.bottom()) { return adt$2.retry(Carets.moveDown(caret, 1)) }
      return inOutsideBlock(bridge, element, caret) ? adt$2.retry(Carets.translate(lowerCaret, JUMP_SIZE, 0)) : adt$2.none()
    }
    const adjustUp = function (bridge, element, guessBox, original, caret) {
      const higherCaret = Carets.moveUp(caret, JUMP_SIZE)
      if (Math.abs(guessBox.top() - original.top()) < 1) { return adt$2.retry(higherCaret) }
      if (guessBox.bottom() < caret.top()) { return adt$2.retry(higherCaret) }
      if (guessBox.bottom() === caret.top()) { return adt$2.retry(Carets.moveUp(caret, 1)) }
      return inOutsideBlock(bridge, element, caret) ? adt$2.retry(Carets.translate(higherCaret, JUMP_SIZE, 0)) : adt$2.none()
    }
    const upMovement = {
      point: Carets.getTop,
      adjuster: adjustUp,
      move: Carets.moveUp,
      gather: DomGather.before,
    }
    const downMovement = {
      point: Carets.getBottom,
      adjuster: adjustDown,
      move: Carets.moveDown,
      gather: DomGather.after,
    }
    const isAtTable = function (bridge, x, y) {
      return bridge.elementFromPoint(x, y).filter((elm) => name(elm) === 'table').isSome()
    }
    const adjustForTable = function (bridge, movement, original, caret, numRetries) {
      return adjustTil(bridge, movement, original, movement.move(caret, JUMP_SIZE), numRetries)
    }
    var adjustTil = function (bridge, movement, original, caret, numRetries) {
      if (numRetries === 0) { return Option.some(caret) }
      if (isAtTable(bridge, caret.left(), movement.point(caret))) { return adjustForTable(bridge, movement, original, caret, numRetries - 1) }
      return bridge.situsFromPoint(caret.left(), movement.point(caret)).bind((guess) => guess.start().fold(Option.none, (element, offset) => Rectangles.getEntireBox(bridge, element, offset).bind((guessBox) => movement.adjuster(bridge, element, guessBox, original, caret).fold(Option.none, (newCaret) => adjustTil(bridge, movement, original, newCaret, numRetries - 1))).orThunk(() => Option.some(caret)), Option.none))
    }
    const ieTryDown = function (bridge, caret) {
      return bridge.situsFromPoint(caret.left(), caret.bottom() + JUMP_SIZE)
    }
    const ieTryUp = function (bridge, caret) {
      return bridge.situsFromPoint(caret.left(), caret.top() - JUMP_SIZE)
    }
    const checkScroll = function (movement, adjusted, bridge) {
      if (movement.point(adjusted) > bridge.getInnerHeight()) { return Option.some(movement.point(adjusted) - bridge.getInnerHeight()) }
      if (movement.point(adjusted) < 0) { return Option.some(-movement.point(adjusted)) }
      return Option.none()
    }
    const retry = function (movement, bridge, caret) {
      const moved = movement.move(caret, JUMP_SIZE)
      const adjusted = adjustTil(bridge, movement, caret, moved, NUM_RETRIES).getOr(moved)
      return checkScroll(movement, adjusted, bridge).fold(() => bridge.situsFromPoint(adjusted.left(), movement.point(adjusted)), (delta) => {
        bridge.scrollBy(0, delta)
        return bridge.situsFromPoint(adjusted.left(), movement.point(adjusted) - delta)
      })
    }
    const Retries = {
      tryUp: curry(retry, upMovement),
      tryDown: curry(retry, downMovement),
      ieTryUp,
      ieTryDown,
      getJumpSize: constant(JUMP_SIZE),
    }

    const adt$3 = Adt.generate([
      { none: ['message'] },
      { success: [] },
      { failedUp: ['cell'] },
      { failedDown: ['cell'] },
    ])
    const isOverlapping = function (bridge, before, after) {
      const beforeBounds = bridge.getRect(before)
      const afterBounds = bridge.getRect(after)
      return afterBounds.right > beforeBounds.left && afterBounds.left < beforeBounds.right
    }
    const verify = function (bridge, before, beforeOffset, after, afterOffset, failure, isRoot) {
      return closest$1(after, 'td,th', isRoot).bind((afterCell) => closest$1(before, 'td,th', isRoot).map((beforeCell) => {
        if (!eq(afterCell, beforeCell)) {
          return DomParent.sharedOne(isRow, [
            afterCell,
            beforeCell,
          ]).fold(() => isOverlapping(bridge, beforeCell, afterCell) ? adt$3.success() : failure(beforeCell), (sharedRow) => failure(beforeCell))
        }
        return eq(after, afterCell) && getEnd(afterCell) === afterOffset ? failure(beforeCell) : adt$3.none('in same cell')
      })).getOr(adt$3.none('default'))
    }
    var isRow = function (elem) {
      return closest$1(elem, 'tr')
    }
    const cata$2 = function (subject, onNone, onSuccess, onFailedUp, onFailedDown) {
      return subject.fold(onNone, onSuccess, onFailedUp, onFailedDown)
    }
    const BeforeAfter = {
      verify,
      cata: cata$2,
      adt: adt$3,
    }

    const point = Immutable('element', 'offset')
    const delta = Immutable('element', 'deltaOffset')
    const range$3 = Immutable('element', 'start', 'finish')
    const points = Immutable('begin', 'end')
    const text = Immutable('element', 'text')
    const Spot = {
      point,
      delta,
      range: range$3,
      points,
      text,
    }

    const inAncestor = Immutable('ancestor', 'descendants', 'element', 'index')
    const inParent = Immutable('parent', 'children', 'element', 'index')
    const indexInParent = function (element) {
      return parent(element).bind((parent$$1) => {
        const children$$1 = children(parent$$1)
        return indexOf$1(children$$1, element).map((index) => inParent(parent$$1, children$$1, element, index))
      })
    }
    var indexOf$1 = function (elements, element) {
      return findIndex(elements, curry(eq, element))
    }

    const isBr = function (elem) {
      return name(elem) === 'br'
    }
    var gatherer = function (cand, gather, isRoot) {
      return gather(cand, isRoot).bind((target) => isText(target) && get$3(target).trim().length === 0 ? gatherer(target, gather, isRoot) : Option.some(target))
    }
    const handleBr = function (isRoot, element, direction) {
      return direction.traverse(element).orThunk(() => gatherer(element, direction.gather, isRoot)).map(direction.relative)
    }
    const findBr = function (element, offset) {
      return child(element, offset).filter(isBr).orThunk(() => child(element, offset - 1).filter(isBr))
    }
    const handleParent = function (isRoot, element, offset, direction) {
      return findBr(element, offset).bind((br) => direction.traverse(br).fold(() => gatherer(br, direction.gather, isRoot).map(direction.relative), (adjacent) => indexInParent(adjacent).map((info) => Situ.on(info.parent(), info.index()))))
    }
    const tryBr = function (isRoot, element, offset, direction) {
      const target = isBr(element) ? handleBr(isRoot, element, direction) : handleParent(isRoot, element, offset, direction)
      return target.map((tgt) => ({
        start: constant(tgt),
        finish: constant(tgt),
      }))
    }
    const process = function (analysis) {
      return BeforeAfter.cata(analysis, (message) => Option.none(), () => Option.none(), (cell) => Option.some(Spot.point(cell, 0)), (cell) => Option.some(Spot.point(cell, getEnd(cell))))
    }
    const BrTags = {
      tryBr,
      process,
    }

    const MAX_RETRIES = 20
    const platform$1 = PlatformDetection$1.detect()
    const findSpot = function (bridge, isRoot, direction) {
      return bridge.getSelection().bind((sel) => BrTags.tryBr(isRoot, sel.finish(), sel.foffset(), direction).fold(() => Option.some(Spot.point(sel.finish(), sel.foffset())), (brNeighbour) => {
        const range = bridge.fromSitus(brNeighbour)
        const analysis = BeforeAfter.verify(bridge, sel.finish(), sel.foffset(), range.finish(), range.foffset(), direction.failure, isRoot)
        return BrTags.process(analysis)
      }))
    }
    var scan = function (bridge, isRoot, element, offset, direction, numRetries) {
      if (numRetries === 0) { return Option.none() }
      return tryCursor(bridge, isRoot, element, offset, direction).bind((situs) => {
        const range = bridge.fromSitus(situs)
        const analysis = BeforeAfter.verify(bridge, element, offset, range.finish(), range.foffset(), direction.failure, isRoot)
        return BeforeAfter.cata(analysis, () => Option.none(), () => Option.some(situs), (cell) => {
          if (eq(element, cell) && offset === 0) { return tryAgain(bridge, element, offset, Carets.moveUp, direction) }
          return scan(bridge, isRoot, cell, 0, direction, numRetries - 1)
        }, (cell) => {
          if (eq(element, cell) && offset === getEnd(cell)) { return tryAgain(bridge, element, offset, Carets.moveDown, direction) }
          return scan(bridge, isRoot, cell, getEnd(cell), direction, numRetries - 1)
        })
      })
    }
    var tryAgain = function (bridge, element, offset, move, direction) {
      return Rectangles.getBoxAt(bridge, element, offset).bind((box) => tryAt(bridge, direction, move(box, Retries.getJumpSize())))
    }
    var tryAt = function (bridge, direction, box) {
      if (platform$1.browser.isChrome() || platform$1.browser.isSafari() || platform$1.browser.isFirefox() || platform$1.browser.isEdge()) { return direction.otherRetry(bridge, box) }
      if (platform$1.browser.isIE()) { return direction.ieRetry(bridge, box) }
      return Option.none()
    }
    var tryCursor = function (bridge, isRoot, element, offset, direction) {
      return Rectangles.getBoxAt(bridge, element, offset).bind((box) => tryAt(bridge, direction, box))
    }
    const handle$2 = function (bridge, isRoot, direction) {
      return findSpot(bridge, isRoot, direction).bind((spot) => scan(bridge, isRoot, spot.element(), spot.offset(), direction, MAX_RETRIES).map(bridge.fromSitus))
    }
    const TableKeys = { handle: handle$2 }

    const ancestor$3 = function (scope, predicate, isRoot) {
      return ancestor(scope, predicate, isRoot).isSome()
    }

    const detection = PlatformDetection$1.detect()
    const inSameTable = function (elem, table) {
      return ancestor$3(elem, (e) => parent(e).exists((p) => eq(p, table)))
    }
    const simulate = function (bridge, isRoot, direction, initial, anchor) {
      return closest$1(initial, 'td,th', isRoot).bind((start) => closest$1(start, 'table', isRoot).bind((table) => {
        if (!inSameTable(anchor, table)) { return Option.none() }
        return TableKeys.handle(bridge, isRoot, direction).bind((range) => closest$1(range.finish(), 'td,th', isRoot).map((finish) => ({
          start: constant(start),
          finish: constant(finish),
          range: constant(range),
        })))
      }))
    }
    const navigate = function (bridge, isRoot, direction, initial, anchor, precheck) {
      if (detection.browser.isIE()) {
        return Option.none()
      }
      return precheck(initial, isRoot).orThunk(() => simulate(bridge, isRoot, direction, initial, anchor).map((info) => {
        const range = info.range()
        return Responses.response(Option.some(Util$1.makeSitus(range.start(), range.soffset(), range.finish(), range.foffset())), true)
      }))
    }
    const firstUpCheck = function (initial, isRoot) {
      return closest$1(initial, 'tr', isRoot).bind((startRow) => closest$1(startRow, 'table', isRoot).bind((table) => {
        const rows = descendants$1(table, 'tr')
        if (eq(startRow, rows[0])) {
          return DomGather.seekLeft(table, (element) => last$2(element).isSome(), isRoot).map((last) => {
            const lastOffset = getEnd(last)
            return Responses.response(Option.some(Util$1.makeSitus(last, lastOffset, last, lastOffset)), true)
          })
        }
        return Option.none()
      }))
    }
    const lastDownCheck = function (initial, isRoot) {
      return closest$1(initial, 'tr', isRoot).bind((startRow) => closest$1(startRow, 'table', isRoot).bind((table) => {
        const rows = descendants$1(table, 'tr')
        if (eq(startRow, rows[rows.length - 1])) {
          return DomGather.seekRight(table, (element) => first$3(element).isSome(), isRoot).map((first) => Responses.response(Option.some(Util$1.makeSitus(first, 0, first, 0)), true))
        }
        return Option.none()
      }))
    }
    const select = function (bridge, container, isRoot, direction, initial, anchor, selectRange) {
      return simulate(bridge, isRoot, direction, initial, anchor).bind((info) => KeySelection.detect(container, isRoot, info.start(), info.finish(), selectRange))
    }
    const VerticalMovement = {
      navigate,
      select,
      firstUpCheck,
      lastDownCheck,
    }

    const findCell = function (target, isRoot) {
      return closest$1(target, 'td,th', isRoot)
    }
    function MouseSelection(bridge, container, isRoot, annotations) {
      let cursor = Option.none()
      const clearState = function () {
        cursor = Option.none()
      }
      const mousedown = function (event) {
        annotations.clear(container)
        cursor = findCell(event.target(), isRoot)
      }
      const mouseover = function (event) {
        cursor.each((start) => {
          annotations.clear(container)
          findCell(event.target(), isRoot).each((finish) => {
            CellSelection.identify(start, finish, isRoot).each((cellSel) => {
              const boxes = cellSel.boxes().getOr([])
              if (boxes.length > 1 || boxes.length === 1 && !eq(start, finish)) {
                annotations.selectRange(container, boxes, cellSel.start(), cellSel.finish())
                bridge.selectContents(finish)
              }
            })
          })
        })
      }
      const mouseup = function () {
        cursor.each(clearState)
      }
      return {
        mousedown,
        mouseover,
        mouseup,
      }
    }

    const KeyDirection = {
      down: {
        traverse: nextSibling,
        gather: DomGather.after,
        relative: Situ.before,
        otherRetry: Retries.tryDown,
        ieRetry: Retries.ieTryDown,
        failure: BeforeAfter.adt.failedDown,
      },
      up: {
        traverse: prevSibling,
        gather: DomGather.before,
        relative: Situ.before,
        otherRetry: Retries.tryUp,
        ieRetry: Retries.ieTryUp,
        failure: BeforeAfter.adt.failedUp,
      },
    }

    const rc = Immutable('rows', 'cols')
    const mouse = function (win, container, isRoot, annotations) {
      const bridge = WindowBridge(win)
      const handlers = MouseSelection(bridge, container, isRoot, annotations)
      return {
        mousedown: handlers.mousedown,
        mouseover: handlers.mouseover,
        mouseup: handlers.mouseup,
      }
    }
    const keyboard = function (win, container, isRoot, annotations) {
      const bridge = WindowBridge(win)
      const clearToNavigate = function () {
        annotations.clear(container)
        return Option.none()
      }
      const keydown = function (event, start, soffset, finish, foffset, direction) {
        const keycode = event.raw().which
        const shiftKey = event.raw().shiftKey === true
        const handler = CellSelection.retrieve(container, annotations.selectedSelector()).fold(() => {
          if (SelectionKeys.isDown(keycode) && shiftKey) {
            return curry(VerticalMovement.select, bridge, container, isRoot, KeyDirection.down, finish, start, annotations.selectRange)
          } if (SelectionKeys.isUp(keycode) && shiftKey) {
            return curry(VerticalMovement.select, bridge, container, isRoot, KeyDirection.up, finish, start, annotations.selectRange)
          } if (SelectionKeys.isDown(keycode)) {
            return curry(VerticalMovement.navigate, bridge, isRoot, KeyDirection.down, finish, start, VerticalMovement.lastDownCheck)
          } if (SelectionKeys.isUp(keycode)) {
            return curry(VerticalMovement.navigate, bridge, isRoot, KeyDirection.up, finish, start, VerticalMovement.firstUpCheck)
          }
          return Option.none
        }, (selected) => {
          const update = function (attempts) {
            return function () {
              const navigation = findMap(attempts, (delta) => KeySelection.update(delta.rows(), delta.cols(), container, selected, annotations))
              return navigation.fold(() => CellSelection.getEdges(container, annotations.firstSelectedSelector(), annotations.lastSelectedSelector()).map((edges) => {
                const relative = SelectionKeys.isDown(keycode) || direction.isForward(keycode) ? Situ.after : Situ.before
                bridge.setRelativeSelection(Situ.on(edges.first(), 0), relative(edges.table()))
                annotations.clear(container)
                return Responses.response(Option.none(), true)
              }), (_) => Option.some(Responses.response(Option.none(), true)))
            }
          }
          if (SelectionKeys.isDown(keycode) && shiftKey) { return update([rc(+1, 0)]) }
          if (SelectionKeys.isUp(keycode) && shiftKey) { return update([rc(-1, 0)]) }
          if (direction.isBackward(keycode) && shiftKey) {
            return update([
              rc(0, -1),
              rc(-1, 0),
            ])
          }
          if (direction.isForward(keycode) && shiftKey) {
            return update([
              rc(0, +1),
              rc(+1, 0),
            ])
          }
          if (SelectionKeys.isNavigation(keycode) && shiftKey === false) { return clearToNavigate }
          return Option.none
        })
        return handler()
      }
      const keyup = function (event, start, soffset, finish, foffset) {
        return CellSelection.retrieve(container, annotations.selectedSelector()).fold(() => {
          const keycode = event.raw().which
          const shiftKey = event.raw().shiftKey === true
          if (shiftKey === false) { return Option.none() }
          if (SelectionKeys.isNavigation(keycode)) { return KeySelection.sync(container, isRoot, start, soffset, finish, foffset, annotations.selectRange) }
          return Option.none()
        }, Option.none)
      }
      return {
        keydown,
        keyup,
      }
    }
    const InputHandlers = {
      mouse,
      keyboard,
    }

    const remove$7 = function (element, classes) {
      each(classes, (x) => {
        remove$5(element, x)
      })
    }

    const addClass = function (clazz) {
      return function (element) {
        add$2(element, clazz)
      }
    }
    const removeClasses = function (classes) {
      return function (element) {
        remove$7(element, classes)
      }
    }

    const byClass = function (ephemera) {
      const addSelectionClass = addClass(ephemera.selected())
      const removeSelectionClasses = removeClasses([
        ephemera.selected(),
        ephemera.lastSelected(),
        ephemera.firstSelected(),
      ])
      const clear = function (container) {
        const sels = descendants$1(container, ephemera.selectedSelector())
        each(sels, removeSelectionClasses)
      }
      const selectRange = function (container, cells, start, finish) {
        clear(container)
        each(cells, addSelectionClass)
        add$2(start, ephemera.firstSelected())
        add$2(finish, ephemera.lastSelected())
      }
      return {
        clear,
        selectRange,
        selectedSelector: ephemera.selectedSelector,
        firstSelectedSelector: ephemera.firstSelectedSelector,
        lastSelectedSelector: ephemera.lastSelectedSelector,
      }
    }
    const byAttr = function (ephemera) {
      const removeSelectionAttributes = function (element) {
        remove(element, ephemera.selected())
        remove(element, ephemera.firstSelected())
        remove(element, ephemera.lastSelected())
      }
      const addSelectionAttribute = function (element) {
        set(element, ephemera.selected(), '1')
      }
      const clear = function (container) {
        const sels = descendants$1(container, ephemera.selectedSelector())
        each(sels, removeSelectionAttributes)
      }
      const selectRange = function (container, cells, start, finish) {
        clear(container)
        each(cells, addSelectionAttribute)
        set(start, ephemera.firstSelected(), '1')
        set(finish, ephemera.lastSelected(), '1')
      }
      return {
        clear,
        selectRange,
        selectedSelector: ephemera.selectedSelector,
        firstSelectedSelector: ephemera.firstSelectedSelector,
        lastSelectedSelector: ephemera.lastSelectedSelector,
      }
    }
    const SelectionAnnotation = {
      byClass,
      byAttr,
    }

    const hasInternalTarget = function (e) {
      return has$2(Element$$1.fromDom(e.target), 'ephox-snooker-resizer-bar') === false
    }
    function CellSelection$1(editor, lazyResize) {
      const handlerStruct = MixedBag([
        'mousedown',
        'mouseover',
        'mouseup',
        'keyup',
        'keydown',
      ], [])
      let handlers = Option.none()
      const annotations = SelectionAnnotation.byAttr(Ephemera)
      editor.on('init', (e) => {
        const win = editor.getWin()
        const body = getBody$1(editor)
        const isRoot = getIsRoot(editor)
        const syncSelection = function () {
          const sel = editor.selection
          const start = Element$$1.fromDom(sel.getStart())
          const end = Element$$1.fromDom(sel.getEnd())
          const shared = DomParent.sharedOne(TableLookup.table, [
            start,
            end,
          ])
          shared.fold(() => {
            annotations.clear(body)
          }, noop)
        }
        const mouseHandlers = InputHandlers.mouse(win, body, isRoot, annotations)
        const keyHandlers = InputHandlers.keyboard(win, body, isRoot, annotations)
        const hasShiftKey = function (event) {
          return event.raw().shiftKey === true
        }
        const handleResponse = function (event, response) {
          if (!hasShiftKey(event)) {
            return
          }
          if (response.kill()) {
            event.kill()
          }
          response.selection().each((ns) => {
            const relative = relative$1(ns.start(), ns.finish())
            const rng = asLtrRange(win, relative)
            editor.selection.setRng(rng)
          })
        }
        const keyup = function (event) {
          const wrappedEvent = wrapEvent(event)
          if (wrappedEvent.raw().shiftKey && SelectionKeys.isNavigation(wrappedEvent.raw().which)) {
            const rng = editor.selection.getRng()
            const start = Element$$1.fromDom(rng.startContainer)
            const end = Element$$1.fromDom(rng.endContainer)
            keyHandlers.keyup(wrappedEvent, start, rng.startOffset, end, rng.endOffset).each((response) => {
              handleResponse(wrappedEvent, response)
            })
          }
        }
        const keydown = function (event) {
          const wrappedEvent = wrapEvent(event)
          lazyResize().each((resize) => {
            resize.hideBars()
          })
          const rng = editor.selection.getRng()
          const startContainer = Element$$1.fromDom(editor.selection.getStart())
          const start = Element$$1.fromDom(rng.startContainer)
          const end = Element$$1.fromDom(rng.endContainer)
          const direction = Direction.directionAt(startContainer).isRtl() ? SelectionKeys.rtl : SelectionKeys.ltr
          keyHandlers.keydown(wrappedEvent, start, rng.startOffset, end, rng.endOffset, direction).each((response) => {
            handleResponse(wrappedEvent, response)
          })
          lazyResize().each((resize) => {
            resize.showBars()
          })
        }
        const isMouseEvent = function (event) {
          return event.hasOwnProperty('x') && event.hasOwnProperty('y')
        }
        var wrapEvent = function (event) {
          const target = Element$$1.fromDom(event.target)
          const stop = function () {
            event.stopPropagation()
          }
          const prevent = function () {
            event.preventDefault()
          }
          const kill = compose(prevent, stop)
          return {
            target: constant(target),
            x: constant(isMouseEvent(event) ? event.x : null),
            y: constant(isMouseEvent(event) ? event.y : null),
            stop,
            prevent,
            kill,
            raw: constant(event),
          }
        }
        const isLeftMouse = function (raw) {
          return raw.button === 0
        }
        const isLeftButtonPressed = function (raw) {
          if (raw.buttons === undefined) {
            return true
          }
          return (raw.buttons & 1) !== 0
        }
        const mouseDown = function (e) {
          if (isLeftMouse(e) && hasInternalTarget(e)) {
            mouseHandlers.mousedown(wrapEvent(e))
          }
        }
        const mouseOver = function (e) {
          if (isLeftButtonPressed(e) && hasInternalTarget(e)) {
            mouseHandlers.mouseover(wrapEvent(e))
          }
        }
        const mouseUp = function (e) {
          if (isLeftMouse(e) && hasInternalTarget(e)) {
            mouseHandlers.mouseup(wrapEvent(e))
          }
        }
        editor.on('mousedown', mouseDown)
        editor.on('mouseover', mouseOver)
        editor.on('mouseup', mouseUp)
        editor.on('keyup', keyup)
        editor.on('keydown', keydown)
        editor.on('nodechange', syncSelection)
        handlers = Option.some(handlerStruct({
          mousedown: mouseDown,
          mouseover: mouseOver,
          mouseup: mouseUp,
          keyup,
          keydown,
        }))
      })
      const destroy = function () {
        handlers.each((handlers) => {
        })
      }
      return {
        clear: annotations.clear,
        destroy,
      }
    }

    const Selections = function (editor) {
      const get = function () {
        const body = getBody$1(editor)
        return TableSelection.retrieve(body, Ephemera.selectedSelector()).fold(() => {
          if (editor.selection.getStart() === undefined) {
            return SelectionTypes.none()
          }
          return SelectionTypes.single(editor.selection)
        }, (cells) => SelectionTypes.multiple(cells))
      }
      return { get }
    }

    const addButtons = function (editor) {
      editor.ui.registry.addMenuButton('table', {
        tooltip: 'Table',
        icon: 'table',
        fetch(callback) {
          return callback('inserttable tableprops deletetable | cell row column')
        },
      })
      const cmd = function (command) {
        return function () {
          return editor.execCommand(command)
        }
      }
      editor.ui.registry.addButton('tableprops', {
        tooltip: 'Table properties',
        onAction: cmd('mceTableProps'),
        icon: 'table',
      })
      editor.ui.registry.addButton('tabledelete', {
        tooltip: 'Delete table',
        onAction: cmd('mceTableDelete'),
        icon: 'table-delete-table',
      })
      editor.ui.registry.addButton('tablecellprops', {
        tooltip: 'Cell properties',
        onAction: cmd('mceTableCellProps'),
        icon: 'table-cell-properties',
      })
      editor.ui.registry.addButton('tablemergecells', {
        tooltip: 'Merge cells',
        onAction: cmd('mceTableMergeCells'),
        icon: 'table-merge-cells',
      })
      editor.ui.registry.addButton('tablesplitcells', {
        tooltip: 'Split cell',
        onAction: cmd('mceTableSplitCells'),
        icon: 'table-split-cells',
      })
      editor.ui.registry.addButton('tableinsertrowbefore', {
        tooltip: 'Insert row before',
        onAction: cmd('mceTableInsertRowBefore'),
        icon: 'table-insert-row-above',
      })
      editor.ui.registry.addButton('tableinsertrowafter', {
        tooltip: 'Insert row after',
        onAction: cmd('mceTableInsertRowAfter'),
        icon: 'table-insert-row-after',
      })
      editor.ui.registry.addButton('tabledeleterow', {
        tooltip: 'Delete row',
        onAction: cmd('mceTableDeleteRow'),
        icon: 'table-delete-row',
      })
      editor.ui.registry.addButton('tablerowprops', {
        tooltip: 'Row properties',
        onAction: cmd('mceTableRowProps'),
        icon: 'table-row-properties',
      })
      editor.ui.registry.addButton('tableinsertcolbefore', {
        tooltip: 'Insert column before',
        onAction: cmd('mceTableInsertColBefore'),
        icon: 'table-insert-column-before',
      })
      editor.ui.registry.addButton('tableinsertcolafter', {
        tooltip: 'Insert column after',
        onAction: cmd('mceTableInsertColAfter'),
        icon: 'table-insert-column-after',
      })
      editor.ui.registry.addButton('tabledeletecol', {
        tooltip: 'Delete column',
        onAction: cmd('mceTableDeleteCol'),
        icon: 'table-delete-column',
      })
      editor.ui.registry.addButton('tablecutrow', {
        tooltip: 'Cut row',
        onAction: cmd('mceTableCutRow'),
        icon: 'temporary-placeholder',
      })
      editor.ui.registry.addButton('tablecopyrow', {
        tooltip: 'Copy row',
        onAction: cmd('mceTableCopyRow'),
        icon: 'temporary-placeholder',
      })
      editor.ui.registry.addButton('tablepasterowbefore', {
        tooltip: 'Paste row before',
        onAction: cmd('mceTablePasteRowBefore'),
        icon: 'temporary-placeholder',
      })
      editor.ui.registry.addButton('tablepasterowafter', {
        tooltip: 'Paste row after',
        onAction: cmd('mceTablePasteRowAfter'),
        icon: 'temporary-placeholder',
      })
    }
    const addToolbars = function (editor) {
      const isTable = function (table) {
        return editor.dom.is(table, 'table') && editor.getBody().contains(table)
      }
      const toolbar = getToolbar(editor)
      if (toolbar.length > 0) {
        editor.ui.registry.addContextToolbar('table', {
          predicate: isTable,
          items: toolbar,
          scope: 'node',
          position: 'node',
        })
      }
    }
    const Buttons = {
      addButtons,
      addToolbars,
    }

    const addMenuItems = function (editor, selections) {
      let targets = Option.none
      const noTargetDisable = function (ctrl) {
        ctrl.setDisabled(true)
      }
      const ctrlEnable = function (ctrl) {
        ctrl.setDisabled(false)
      }
      const setEnabled = function (api) {
        targets().fold(() => {
          noTargetDisable(api)
        }, (targets) => {
          ctrlEnable(api)
        })
        return function () {
        }
      }
      const setEnabledMerge = function (api) {
        targets().fold(() => {
          noTargetDisable(api)
        }, (targets) => {
          api.setDisabled(targets.mergable().isNone())
        })
        return function () {
        }
      }
      const setEnabledUnmerge = function (api) {
        targets().fold(() => {
          noTargetDisable(api)
        }, (targets) => {
          api.setDisabled(targets.unmergable().isNone())
        })
        return function () {
        }
      }
      const resetTargets = function () {
        targets = cached(() => {
          const cellOpt = Option.from(editor.dom.getParent(editor.selection.getStart(), 'th,td'))
          return cellOpt.bind((cellDom) => {
            const cell = Element$$1.fromDom(cellDom)
            const table = TableLookup.table(cell)
            return table.map((table) => TableTargets.forMenu(selections, table, cell))
          })
        })
      }
      editor.on('nodechange', resetTargets)
      const cmd = function (command) {
        return function () {
          return editor.execCommand(command)
        }
      }
      const insertTableAction = function (_a) {
        const { numRows } = _a; const { numColumns } = _a
        editor.undoManager.transact(() => {
          InsertTable.insert(editor, numColumns, numRows)
        })
        editor.addVisual()
      }
      const tableProperties = {
        text: 'Table properties',
        onSetup: setEnabled,
        onAction: cmd('mceTableProps'),
      }
      const deleteTable = {
        text: 'Delete table',
        icon: 'table-delete-table',
        onSetup: setEnabled,
        onAction: cmd('mceTableDelete'),
      }
      const row = {
        type: 'nestedmenuitem',
        text: 'Row',
        getSubmenuItems() {
          return [
            {
              type: 'menuitem',
              text: 'Insert row before',
              icon: 'table-insert-row-above',
              onAction: cmd('mceTableInsertRowBefore'),
              onSetup: setEnabled,
            },
            {
              type: 'menuitem',
              text: 'Insert row after',
              icon: 'table-insert-row-after',
              onAction: cmd('mceTableInsertRowAfter'),
              onSetup: setEnabled,
            },
            {
              type: 'menuitem',
              text: 'Delete row',
              icon: 'table-delete-row',
              onAction: cmd('mceTableDeleteRow'),
              onSetup: setEnabled,
            },
            {
              type: 'menuitem',
              text: 'Row properties',
              icon: 'table-row-properties',
              onAction: cmd('mceTableRowProps'),
              onSetup: setEnabled,
            },
            { type: 'separator' },
            {
              type: 'menuitem',
              text: 'Cut row',
              onAction: cmd('mceTableCutRow'),
              onSetup: setEnabled,
            },
            {
              type: 'menuitem',
              text: 'Copy row',
              onAction: cmd('mceTableCopyRow'),
              onSetup: setEnabled,
            },
            {
              type: 'menuitem',
              text: 'Paste row before',
              onAction: cmd('mceTablePasteRowBefore'),
              onSetup: setEnabled,
            },
            {
              type: 'menuitem',
              text: 'Paste row after',
              onAction: cmd('mceTablePasteRowAfter'),
              onSetup: setEnabled,
            },
          ]
        },
      }
      const column = {
        type: 'nestedmenuitem',
        text: 'Column',
        getSubmenuItems() {
          return [
            {
              type: 'menuitem',
              text: 'Insert column before',
              icon: 'table-insert-column-before',
              onAction: cmd('mceTableInsertColBefore'),
              onSetup: setEnabled,
            },
            {
              type: 'menuitem',
              text: 'Insert column after',
              icon: 'table-insert-column-after',
              onAction: cmd('mceTableInsertColAfter'),
              onSetup: setEnabled,
            },
            {
              type: 'menuitem',
              text: 'Delete column',
              icon: 'table-delete-column',
              onAction: cmd('mceTableDeleteCol'),
              onSetup: setEnabled,
            },
          ]
        },
      }
      const cell = {
        type: 'nestedmenuitem',
        text: 'Cell',
        getSubmenuItems() {
          return [
            {
              type: 'menuitem',
              text: 'Cell properties',
              icon: 'table-cell-properties',
              onAction: cmd('mceTableCellProps'),
              onSetup: setEnabled,
            },
            {
              type: 'menuitem',
              text: 'Merge cells',
              icon: 'table-merge-cells',
              onAction: cmd('mceTableMergeCells'),
              onSetup: setEnabledMerge,
            },
            {
              type: 'menuitem',
              text: 'Split cell',
              icon: 'table-split-cells',
              onAction: cmd('mceTableSplitCells'),
              onSetup: setEnabledUnmerge,
            },
          ]
        },
      }
      if (hasTableGrid(editor) === false) {
        editor.ui.registry.addMenuItem('inserttable', {
          text: 'Table',
          icon: 'table',
          onAction: cmd('mceInsertTable'),
        })
      } else {
        editor.ui.registry.addNestedMenuItem('inserttable', {
          text: 'Table',
          icon: 'table',
          getSubmenuItems() {
            return [{
              type: 'fancymenuitem',
              fancytype: 'inserttable',
              onAction: insertTableAction,
            }]
          },
        })
      }
      editor.ui.registry.addMenuItem('tableprops', tableProperties)
      editor.ui.registry.addMenuItem('deletetable', deleteTable)
      editor.ui.registry.addNestedMenuItem('row', row)
      editor.ui.registry.addNestedMenuItem('column', column)
      editor.ui.registry.addNestedMenuItem('cell', cell)
      editor.ui.registry.addContextMenu('table', {
        update() {
          resetTargets()
          return targets().fold(() => '', () => 'cell row column | tableprops deletetable')
        },
      })
    }
    const MenuItems = { addMenuItems }

    const getClipboardRows = function (clipboardRows) {
      return clipboardRows.get().fold(() => {

      }, (rows) => map(rows, (row) => row.dom()))
    }
    const setClipboardRows = function (rows, clipboardRows) {
      const sugarRows = map(rows, Element$$1.fromDom)
      clipboardRows.set(Option.from(sugarRows))
    }
    const getApi = function (editor, clipboardRows) {
      return {
        insertTable(columns, rows) {
          return InsertTable.insert(editor, columns, rows)
        },
        setClipboardRows(rows) {
          return setClipboardRows(rows, clipboardRows)
        },
        getClipboardRows() {
          return getClipboardRows(clipboardRows)
        },
      }
    }

    function Plugin(editor) {
      const resizeHandler = ResizeHandler(editor)
      const cellSelection = CellSelection$1(editor, resizeHandler.lazyResize)
      const actions = TableActions(editor, resizeHandler.lazyWire)
      const selections = Selections(editor)
      const clipboardRows = Cell(Option.none())
      Commands.registerCommands(editor, actions, cellSelection, selections, clipboardRows)
      Clipboard.registerEvents(editor, selections, actions, cellSelection)
      MenuItems.addMenuItems(editor, selections)
      Buttons.addButtons(editor)
      Buttons.addToolbars(editor)
      editor.on('PreInit', () => {
        editor.serializer.addTempAttr(Ephemera.firstSelected())
        editor.serializer.addTempAttr(Ephemera.lastSelected())
      })
      if (hasTabNavigation(editor)) {
        editor.on('keydown', (e) => {
          TabContext.handle(e, editor, actions, resizeHandler.lazyWire)
        })
      }
      editor.on('remove', () => {
        resizeHandler.destroy()
        cellSelection.destroy()
      })
      return getApi(editor, clipboardRows)
    }
    global.add('table', Plugin)
    function Plugin$1() {
    }

    return Plugin$1
  }())
})()
