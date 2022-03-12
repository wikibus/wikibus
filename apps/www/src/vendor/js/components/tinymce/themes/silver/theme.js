(function () {
  const silver = (function () {
    const noop = function () {
      const args = []
      for (let _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i]
      }
    }
    const noarg = function (f) {
      return function () {
        const args = []
        for (let _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i]
        }
        return f()
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
    const chunk = function (array, size) {
      const r = []
      for (let i = 0; i < array.length; i += size) {
        const s = array.slice(i, i + size)
        r.push(s)
      }
      return r
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
    const pure = function (x) {
      return [x]
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
    const mapToArray = function (obj, f) {
      const r = []
      each$1(obj, (value, name) => {
        r.push(f(value, name))
      })
      return r
    }
    const find$1 = function (obj, pred) {
      const props = keys(obj)
      for (let k = 0, len = props.length; k < len; k++) {
        const i = props[k]
        const x = obj[i]
        if (pred(x, i, obj)) {
          return Option.some(x)
        }
      }
      return Option.none()
    }
    const values = function (obj) {
      return mapToArray(obj, (v) => v)
    }
    const get = function (obj, key) {
      return has(obj, key) ? Option.some(obj[key]) : Option.none()
    }
    var has = function (obj, key) {
      return hasOwnProperty.call(obj, key)
    }

    const exclude = function (obj, fields) {
      const r = {}
      each$1(obj, (v, k) => {
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

    const wrap = function (key, value) {
      const r = {}
      r[key] = value
      return r
    }
    const wrapAll = function (keyvalues) {
      const r = {}
      each(keyvalues, (kv) => {
        r[kv.key] = kv.value
      })
      return r
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

    const generate = function (cases) {
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
    const Adt = { generate }

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
      each(results, (result) => {
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
    const wrap$1 = function (key, value) {
      return wrap(key, value)
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

    const touchstart = constant('touchstart')
    const touchmove = constant('touchmove')
    const touchend = constant('touchend')
    const mousedown = constant('mousedown')
    const mousemove = constant('mousemove')
    const mouseout = constant('mouseout')
    const mouseup = constant('mouseup')
    const mouseover = constant('mouseover')
    const focusin = constant('focusin')
    const focusout = constant('focusout')
    const keydown = constant('keydown')
    const keyup = constant('keyup')
    const input = constant('input')
    const change = constant('change')
    const click = constant('click')
    const transitionend = constant('transitionend')
    const selectstart = constant('selectstart')
    const paste = constant('paste')

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
    const sandboxClose = constant('alloy.sandbox.close')
    const typeaheadCancel = constant('alloy.typeahead.cancel')
    const systemInit = constant('alloy.system.init')
    const windowScroll = constant('alloy.system.scroll')
    const attachedToDom = constant('alloy.system.attached')
    const detachedFromDom = constant('alloy.system.detached')
    const dismissRequested = constant('alloy.system.dismissRequested')
    const focusShifted = constant('alloy.focusmanager.shifted')
    const slotVisibility = constant('alloy.slotcontainer.visibility')
    const changeTab = constant('alloy.change.tab')
    const dismissTab = constant('alloy.dismiss.tab')

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
    const defaultView = function (element) {
      const el = element.dom()
      const defView = el.ownerDocument.defaultView
      return Element$$1.fromDom(defView)
    }
    const parent = function (element) {
      const dom = element.dom()
      return Option.from(dom.parentNode).map(Element$$1.fromDom)
    }
    const offsetParent = function (element) {
      const dom = element.dom()
      return Option.from(dom.offsetParent).map(Element$$1.fromDom)
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

    const fromHtml$1 = function (html, scope) {
      const doc = scope || document
      const div = doc.createElement('div')
      div.innerHTML = html
      return children(Element$$1.fromDom(div))
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
    const appendAt = function (parent$$1, element, index) {
      child(parent$$1, index).fold(() => {
        append(parent$$1, element)
      }, (v) => {
        before(v, element)
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
        remove(rogue)
      })
    }
    var remove = function (element) {
      const dom = element.dom()
      if (dom.parentNode !== null) {
        dom.parentNode.removeChild(dom)
      }
    }

    const get$1 = function (element) {
      return element.dom().innerHTML
    }
    const set = function (element, content) {
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
      return get$1(container)
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
    const isElement = isType$1(ELEMENT)
    const isText = isType$1(TEXT)
    const isDocument = isType$1(DOCUMENT)

    const rawSet = function (dom, key, value) {
      if (isString(value) || isBoolean(value) || isNumber(value)) {
        dom.setAttribute(key, `${value}`)
      } else {
        console.error('Invalid call to Attr.set. Key ', key, ':: Value ', value, ':: Element ', dom)
        throw new Error('Attribute value was not simple')
      }
    }
    const set$1 = function (element, key, value) {
      rawSet(element.dom(), key, value)
    }
    const setAll = function (element, attrs) {
      const dom = element.dom()
      each$1(attrs, (v, k) => {
        rawSet(dom, k, v)
      })
    }
    const get$2 = function (element, key) {
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

    const unknown$3 = 'unknown'
    const CHROME_INSPECTOR_GLOBAL = '__CHROME_INSPECTOR_CONNECTION_TO_ALLOY__'
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
            sequence: map(sequence, (s) => {
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
        return find(lines, (line) => line.indexOf('alloy') > 0 && !exists(path$1, (p) => line.indexOf(p) > -1)).getOr(unknown$3)
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
    const inspectorInfo = function (comp) {
      var go = function (c) {
        const cSpec = c.spec()
        return {
          '(original.spec)': cSpec,
          '(dom.ref)': c.element().dom(),
          '(element)': element(c.element()),
          '(initComponents)': map(cSpec.components !== undefined ? cSpec.components : [], go),
          '(components)': map(c.components(), go),
          '(bound.events)': mapToArray(c.events(), (v, k) => [k]).join(', '),
          '(behaviours)': cSpec.behaviours !== undefined ? map$1(cSpec.behaviours, (v, k) => v === undefined ? '--revoked--' : {
            config: v.configAsRaw(),
            'original-config': v.initialConfig,
            state: c.readState(k),
          }) : 'none',
        }
      }
      return go(comp)
    }
    const getOrInitConnection = function () {
      if (window[CHROME_INSPECTOR_GLOBAL] !== undefined) {
        return window[CHROME_INSPECTOR_GLOBAL]
      }
      const setEventStatus_1 = function (eventName, status$$1) {
        const evs = eventConfig.get()
        evs[eventName] = status$$1
        eventConfig.set(evs)
      }
      window[CHROME_INSPECTOR_GLOBAL] = {
        systems: {},
        lookup(uid) {
          const { systems } = window[CHROME_INSPECTOR_GLOBAL]
          const connections = keys(systems)
          return findMap(connections, (conn) => {
            const connGui = systems[conn]
            return connGui.getByUid(uid).toOption().map((comp) => wrap$1(element(comp.element()), inspectorInfo(comp)))
          }).orThunk(() => Option.some({ error: `Systems (${connections.join(', ')}) did not contain uid: ${uid}` }))
        },
        events: {
          setToNormal(eventName) {
            setEventStatus_1(eventName, EventConfiguration.NORMAL)
          },
          setToLogging(eventName) {
            setEventStatus_1(eventName, EventConfiguration.LOGGING)
          },
          setToStop(eventName) {
            setEventStatus_1(eventName, EventConfiguration.STOP)
          },
        },
      }
      return window[CHROME_INSPECTOR_GLOBAL]
    }
    const registerInspector = function (name$$1, gui) {
      const connection = getOrInitConnection()
      connection.systems[name$$1] = gui
    }
    var noLogger = constant(ignoreEvent)

    let unique = 0
    const generate$1 = function (prefix) {
      const date = new Date()
      const time = date.getTime()
      const random = Math.floor(Math.random() * 1000000000)
      unique++
      return `${prefix}_${random}${unique}${String(time)}`
    }

    const global = tinymce.util.Tools.resolve('tinymce.ThemeManager')

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
    const { mergeWithThunk } = adt

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
      each(results, (obj) => {
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
    const JSON$1 = {
      parse,
      stringify,
    }

    const formatObj = function (input) {
      return isObject(input) && keys(input).length > 100 ? ' removed due to size' : JSON$1.stringify(input, null, 2)
    }
    const formatErrors = function (errors) {
      const es = errors.length > 10 ? errors.slice(0, 10).concat([{
        path: [],
        getErrorInfo() {
          return '... (only showing first ten failures)'
        },
      }]) : errors
      return map(es, (e) => `Failed path: (${e.path.join(' > ')})\n${e.getErrorInfo()}`)
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
          return SimpleResult.map(result, (res) => wrap(okey, strength(res)))
        }
        const bundleAsOption = function (optValue) {
          return optValue.fold(() => {
            const outcome = wrap(okey, strength(Option.none()))
            return SimpleResult.svalue(outcome)
          }, (ov) => {
            const result = prop.extract(path.concat([key]), strength, ov)
            return SimpleResult.map(result, (res) => wrap(okey, strength(Option.some(res))))
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
        return SimpleResult.svalue(wrap(okey, strength(state)))
      })
    }
    const cExtract = function (path, obj, fields, strength) {
      const results = map(fields, (field) => cExtractOne(path, obj, field, strength))
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
      const fieldNames = foldr(fields, (acc, f) => f.fold((key) => deepMerge(acc, wrap$1(key, true)), constant(acc)), {})
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
        const fieldStrings = map(fields, (field) => field.fold((key, okey, presence, prop) => `${key} -> ${prop.toString()}`, (okey, instantiator) => `state(${okey})`))
        return `obj{\n${fieldStrings.join('\n')}}`
      }
      const toDsl = function () {
        return typeAdt.objOf(map(fields, (f) => f.fold((key, okey, presence, prop) => fieldAdt.field(key, presence, prop), (okey, instantiator) => fieldAdt.state(okey))))
      }
      return {
        extract,
        toString: toString$$1,
        toDsl,
      }
    }
    const arrOf = function (prop) {
      const extract = function (path, strength, array) {
        const results = map(array, (a, i) => prop.extract(path.concat([`[${i}]`]), strength, a))
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
          const schema = map(validKeys, (vk) => adt$1.field(vk, vk, strict(), prop))
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
    const arrOfObj = compose(arrOf, objOf)
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
    const arrOfObj$1 = function (objFields) {
      return arrOfObj(objFields)
    }
    const arrOfVal = function () {
      return arrOf(_anyValue)
    }
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
    const number = typedValue(isNumber, 'number')
    const string = typedValue(isString, 'string')
    const boolean = typedValue(isBoolean, 'boolean')
    const functionProcessor = typedValue(isFunction, 'function')

    const validateEnum = function (values) {
      return valueOf((value) => contains(values, value) ? Result.value(value) : Result.error(`Unsupported value: "${value}", choose one of "${values.join(', ')}".`))
    }
    const strict$1 = function (key) {
      return field(key, key, strict(), anyValue())
    }
    const strictOf = function (key, schema) {
      return field(key, key, strict(), schema)
    }
    const strictNumber = function (key) {
      return strictOf(key, number)
    }
    const strictString = function (key) {
      return strictOf(key, string)
    }
    const strictStringEnum = function (key, values) {
      return field(key, key, strict(), validateEnum(values))
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
    const strictArrayOfObj = function (key, objFields) {
      return field(key, key, strict(), arrOfObj(objFields))
    }
    const strictArrayOf = function (key, schema) {
      return field(key, key, strict(), arrOf(schema))
    }
    const option = function (key) {
      return field(key, key, asOption(), anyValue())
    }
    const optionOf = function (key, schema) {
      return field(key, key, asOption(), schema)
    }
    const optionString = function (key) {
      return optionOf(key, string)
    }
    const optionFunction = function (key) {
      return optionOf(key, functionProcessor)
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
    const defaultedNumber = function (key, fallback) {
      return defaultedOf(key, fallback, number)
    }
    const defaultedString = function (key, fallback) {
      return defaultedOf(key, fallback, string)
    }
    const defaultedStringEnum = function (key, fallback, values) {
      return defaultedOf(key, fallback, validateEnum(values))
    }
    const defaultedBoolean = function (key, fallback) {
      return defaultedOf(key, fallback, boolean)
    }
    const defaultedFunction = function (key, fallback) {
      return defaultedOf(key, fallback, functionProcessor)
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
        throw new Error(`EventHandler defined by: ${JSON$1.stringify(parts, null, 2)} does not have can, abort, or run!`)
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
        each(handlers, (handler) => {
          handler.run.apply(undefined, args)
        })
      }
      return nu$4({
        can,
        abort,
        run,
      })
    }

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
      component.getSystem().triggerEvent(event, target, map$1(data, constant))
    }
    const dispatchEvent = function (component, target, event, simulatedEvent) {
      component.getSystem().triggerEvent(event, target, simulatedEvent.event())
    }

    function ClosestOrAncestor(is, ancestor, scope, a, isRoot) {
      return is(scope, a) ? Option.some(scope) : isFunction(isRoot) && isRoot(scope) ? Option.none() : ancestor(scope, a, isRoot)
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
    const preventDefault = function (name) {
      return {
        key: name,
        value: nu$4({
          run(component, simulatedEvent) {
            simulatedEvent.event().prevent()
          },
        }),
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
    const runWithTarget = function (name, f) {
      return run(name, (component, simulatedEvent) => {
        const ev = simulatedEvent.event()
        const target = component.getSystem().getByDom(ev.target()).fold(() => {
          const closest = closest$1(ev.target(), (el) => component.getSystem().getByDom(el).toOption(), constant(false))
          return closest.getOr(component)
        }, (c) => c)
        f(component, target, simulatedEvent)
      })
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

    const isRecursive = function (component, originator, target) {
      return eq(originator, component.element()) && !eq(originator, target)
    }
    const events = derive([can(focus$1(), (component, simulatedEvent) => {
      const originator = simulatedEvent.event().originator()
      const target = simulatedEvent.event().target()
      if (isRecursive(component, originator, target)) {
        console.warn(`${focus$1()} did not get interpreted by the desired target. ` + `\nOriginator: ${element(originator)}\nTarget: ${element(target)}\nCheck the ${focus$1()} event handlers`)
        return false
      }
      return true
    })])

    const DefaultEvents = /* #__PURE__ */Object.freeze({
      events,
    })

    const prefix = constant('alloy-id-')
    const idAttr = constant('data-alloy-id')

    const prefix$1 = prefix()
    const idAttr$1 = idAttr()
    const write = function (label, elem) {
      const id = generate$1(prefix$1 + label)
      writeOnly(elem, id)
      return id
    }
    var writeOnly = function (elem, uid) {
      Object.defineProperty(elem.dom(), idAttr$1, {
        value: uid,
        writable: true,
      })
    }
    const read$1 = function (elem) {
      const id = isElement(elem) ? elem.dom()[idAttr$1] : null
      return Option.from(id)
    }
    const generate$2 = function (prefix$$1) {
      return generate$1(prefix$$1)
    }

    const make = identity

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
      return map(parameters, (p) => endsWith(p, '/*') ? p.substring(0, p.length - '/*'.length) : p)
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

    const premadeTag = generate$1('alloy-premade')
    const premade = function (comp) {
      return wrap$1(premadeTag, comp)
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

    const NoState = {
      init() {
        return nu$5({
          readState() {
            return 'No State required'
          },
        })
      },
    }
    var nu$5 = function (spec) {
      return spec
    }

    const generateFrom = function (spec, all) {
      const schema = map(all, (a) => optionObjOf(a.name(), [
        strict$1('config'),
        defaulted$1('state', NoState),
      ]))
      const validated = asRaw('component.behaviours', objOf(schema), spec.behaviours).fold((errInfo) => {
        throw new Error(`${formatError(errInfo)}\nComplete spec:\n${JSON$1.stringify(spec, null, 2)}`)
      }, (v) => v)
      return {
        list: all,
        data: map$1(validated, (optBlobThunk) => {
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
      each$1(data, (detail, key) => {
        each$1(detail, (value, indexKey) => {
          const chain = readOr$1(indexKey, [])(r)
          r[indexKey] = chain.concat([tuple(key, value)])
        })
      })
      return r
    }

    const nu$6 = function (s) {
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

    const combine = function (info, baseMod, behaviours, base) {
      const modsByBehaviour = __assign({}, baseMod)
      each(behaviours, (behaviour) => {
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
      return nu$6({
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
            throw new Error(`The ordering for ${label} does not have an entry for ${aKey}.\nOrder specified: ${JSON$1.stringify(order, null, 2)}`)
          }
          if (bIndex === -1) {
            throw new Error(`The ordering for ${label} does not have an entry for ${bKey}.\nOrder specified: ${JSON$1.stringify(order, null, 2)}`)
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
      each(behaviours, (behaviour) => {
        r[behaviour.name()] = behaviour.handlers(info)
      })
      return r
    }
    const groupByEvents = function (info, behaviours, base) {
      const behaviourEvents = __assign({}, base, nameToHandlers(behaviours, info))
      return byInnerKey(behaviourEvents, behaviourTuple)
    }
    const combine$1 = function (info, eventOrder, behaviours, base) {
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
      return Result.error([`The event (${eventName}) has more than one behaviour that listens to it.\nWhen this occurs, you must ` + `specify an event ordering for the behaviours in your spec (e.g. [ "listing", "toggling" ]).\nThe behaviours that ` + `can trigger it are: ${JSON$1.stringify(map(tuples, (c) => c.name()), null, 2)}`])
    }
    const fuse$1 = function (tuples, eventOrder, eventName) {
      const order = eventOrder[eventName]
      if (!order) {
        return missingOrderError(eventName, tuples)
      }
      return sortKeys(`Event: ${eventName}`, 'name', tuples, order).map((sortedTuples) => {
        const handlers = map(sortedTuples, (tuple) => tuple.handler())
        return fuse(handlers)
      })
    }
    var combineGroups = function (byEventName, eventOrder) {
      const r = mapToArray(byEventName, (tuples, eventName) => {
        const combined = tuples.length === 1 ? Result.value(tuples[0].handler()) : fuse$1(tuples, eventOrder, eventName)
        return combined.map((handler) => {
          const assembled = assemble(handler)
          const purpose = tuples.length > 1 ? filter(eventOrder, (o) => contains(tuples, (t) => t.name() === o)).join(' > ') : tuples[0].name()
          return wrap$1(eventName, uncurried(assembled, purpose))
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
        domChildren: map(detail.components, (comp) => comp.element()),
      })
    }
    const toModification = function (detail) {
      return detail.domModification.fold(() => nu$6({}), nu$6)
    }
    const toEvents = function (info) {
      return info.events
    }

    const read$2 = function (element, attr) {
      const value = get$2(element, attr)
      return value === undefined || value === '' ? [] : value.split(' ')
    }
    const add = function (element, attr, id) {
      const old = read$2(element, attr)
      const nu = old.concat([id])
      set$1(element, attr, nu.join(' '))
      return true
    }
    const remove$2 = function (element, attr, id) {
      const nu = filter(read$2(element, attr), (v) => v !== id)
      if (nu.length > 0) {
        set$1(element, attr, nu.join(' '))
      } else {
        remove$1(element, attr)
      }
      return false
    }

    const supports = function (element) {
      return element.dom().classList !== undefined
    }
    const get$3 = function (element) {
      return read$2(element, 'class')
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
      const classList = supports(element) ? element.dom().classList : get$3(element)
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

    const add$3 = function (element, classes) {
      each(classes, (x) => {
        add$2(element, x)
      })
    }
    const remove$5 = function (element, classes) {
      each(classes, (x) => {
        remove$4(element, x)
      })
    }

    const isSupported = function (dom) {
      return dom.style !== undefined
    }

    const internalSet = function (dom, property, value) {
      if (!isString(value)) {
        console.error('Invalid call to CSS.set. Property ', property, ':: Value ', value, ':: Element ', dom)
        throw new Error(`CSS value must be a string: ${value}`)
      }
      if (isSupported(dom)) {
        dom.style.setProperty(property, value)
      }
    }
    const internalRemove = function (dom, property) {
      if (isSupported(dom)) {
        dom.style.removeProperty(property)
      }
    }
    const set$2 = function (element, property, value) {
      const dom = element.dom()
      internalSet(dom, property, value)
    }
    const setAll$1 = function (element, css) {
      const dom = element.dom()
      each$1(css, (v, k) => {
        internalSet(dom, k, v)
      })
    }
    const setOptions = function (element, css) {
      const dom = element.dom()
      each$1(css, (v, k) => {
        v.fold(() => {
          internalRemove(dom, k)
        }, (value) => {
          internalSet(dom, k, value)
        })
      })
    }
    const get$5 = function (element, property) {
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
    const isValidValue = function (tag, property, value) {
      const element = Element$$1.fromTag(tag)
      set$2(element, property, value)
      const style = getRaw(element, property)
      return style.isSome()
    }
    const remove$6 = function (element, property) {
      const dom = element.dom()
      internalRemove(dom, property)
      if (has$1(element, 'style') && trim(get$2(element, 'style')) === '') {
        remove$1(element, 'style')
      }
    }
    const reflow = function (e) {
      return e.dom().offsetWidth
    }

    const get$6 = function (element) {
      return element.dom().value
    }
    const set$3 = function (element, value) {
      if (value === undefined) {
        throw new Error('Value.set was undefined')
      }
      element.dom().value = value
    }

    const renderToDom = function (definition) {
      const subject = Element$$1.fromTag(definition.tag)
      setAll(subject, definition.attributes)
      add$3(subject, definition.classes)
      setAll$1(subject, definition.styles)
      definition.innerHtml.each((html) => set(subject, html))
      const children = definition.domChildren
      append$1(subject, children)
      definition.value.each((value) => {
        set$3(subject, value)
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
      return map(keys$$1, (k) => behaviours[k].me)
    }
    const generateFrom$1 = function (spec, all) {
      return generateFrom(spec, all)
    }
    const generate$3 = function (spec) {
      const all = getBehaviours$1(spec)
      return generateFrom$1(spec, all)
    }

    const getDomDefinition = function (info, bList, bData) {
      const definition = toDefinition(info)
      const infoModification = toModification(info)
      const baseModification = { 'alloy.base.modification': infoModification }
      const modification = bList.length > 0 ? combine(bData, baseModification, bList, definition) : infoModification
      return merge$1(definition, modification)
    }
    const getEvents = function (info, bList, bData) {
      const baseEvents = { 'alloy.base.behaviour': toEvents(info) }
      return combine$1(bData, info.eventOrder, bList, baseEvents).getOrDie()
    }
    const build = function (spec) {
      const getMe = function () {
        return me
      }
      const systemApi = Cell(singleton)
      const info = getOrDie$1(toInfo(spec))
      const bBlob = generate$3(spec)
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
          throw new Error(`Could not find ${behaviour.name()} in ${JSON$1.stringify(spec, null, 2)}`)
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
      return map(components, build$1)
    }
    const buildFromSpec = function (userSpec) {
      const _a = make(userSpec); const specEvents = _a.events; const spec = __rest(_a, ['events'])
      const components = buildSubcomponents(spec)
      const completeSpec = __assign({}, spec, {
        events: __assign({}, DefaultEvents, specEvents),
        components,
      })
      return Result.value(build(completeSpec))
    }
    const text = function (textContent) {
      const element = Element$$1.fromText(textContent)
      return external({ element })
    }
    var external = function (spec) {
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
    const uids = generate$2
    var build$1 = function (spec) {
      return getPremade(spec).fold(() => {
        const userSpecWithUid = spec.hasOwnProperty('uid') ? spec : __assign({ uid: uids('') }, spec)
        return buildFromSpec(userSpecWithUid).getOrDie()
      }, (prebuilt) => prebuilt)
    }
    const premade$1 = premade

    const closest$2 = function (scope, predicate, isRoot) {
      return closest(scope, predicate, isRoot).isSome()
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

    const find$3 = function (queryElem) {
      const dependent = closest(queryElem, (elem) => {
        if (!isElement(elem)) {
          return false
        }
        const id = get$2(elem, 'id')
        return id !== undefined && id.indexOf('aria-owns') > -1
      })
      return dependent.bind((dep) => {
        const id = get$2(dep, 'id')
        const doc = owner(dep)
        return descendant$2(doc, `[aria-owns="${id}"]`)
      })
    }
    const manager = function () {
      const ariaId = generate$1('aria-owns')
      const link = function (elem) {
        set$1(elem, 'aria-owns', ariaId)
      }
      const unlink = function (elem) {
        remove$1(elem, 'aria-owns')
      }
      return {
        id: constant(ariaId),
        link,
        unlink,
      }
    }

    const isAriaPartOf = function (component, queryElem) {
      return find$3(queryElem).exists((owner) => isPartOf(component, owner))
    }
    var isPartOf = function (component, queryElem) {
      return closest$2(queryElem, (el) => eq(el, component.element()), constant(false)) || isAriaPartOf(component, queryElem)
    }

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
      return strictObjOf('markers', map(required, strict$1))
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
      const wrappedApis = map$1(apis, (apiF, apiName) => wrapApi(name, apiF, apiName))
      const wrappedExtra = map$1(extra, (extraF, extraName) => markAsExtraApi(extraF, extraName))
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
          return getConfig(info).bind((behaviourInfo) => readOptFrom$1(active, 'exhibit').map((exhibitor) => exhibitor(base, behaviourInfo.config, behaviourInfo.state))).getOr(nu$6({}))
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
    const revoke$1 = constant(undefined)

    const chooseChannels = function (channels, message) {
      return message.universal() ? channels : filter(channels, (ch) => contains(message.channels(), ch))
    }
    const events$1 = function (receiveConfig) {
      return derive([run(receive(), (component, message) => {
        const channelMap = receiveConfig.channels
        const channels = keys(channelMap)
        const targetChannels = chooseChannels(channels, message)
        each(targetChannels, (ch) => {
          const channelInfo = channelMap[ch]
          const channelSchema = channelInfo.schema
          const data = asRawOrDie(`channel[${ch}] data\nReceiver: ${element(component.element())}`, channelSchema, message.data())
          channelInfo.onReceive(component, data)
        })
      })])
    }

    const ActiveReceiving = /* #__PURE__ */Object.freeze({
      events: events$1,
    })

    const ReceivingSchema = [strictOf('channels', setOf$1(Result.value, objOfOnly([
      onStrictHandler('onReceive'),
      defaulted$1('schema', anyValue$1()),
    ])))]

    const Receiving = create$1({
      fields: ReceivingSchema,
      name: 'receiving',
      active: ActiveReceiving,
    })

    const exhibit = function (base, posConfig) {
      return nu$6({
        classes: [],
        styles: posConfig.useFixed ? {} : { position: 'relative' },
      })
    }

    const ActivePosition = /* #__PURE__ */Object.freeze({
      exhibit,
    })

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

    const isSafari = PlatformDetection$1.detect().browser.isSafari()
    const get$7 = function (_DOC) {
      const doc = _DOC !== undefined ? _DOC.dom() : document
      const x = doc.body.scrollLeft || doc.documentElement.scrollLeft
      const y = doc.body.scrollTop || doc.documentElement.scrollTop
      return Position(x, y)
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
          const css = get$5(element, name)
          return parseFloat(css) || 0
        }
        return r
      }
      const getOuter = get
      const aggregate = function (element, properties) {
        return foldl(properties, (acc, property) => {
          const val = get$5(element, property)
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

    const api = Dimension('width', (element) => element.dom().offsetWidth)
    const set$4 = function (element, h) {
      api.set(element, h)
    }
    const get$8 = function (element) {
      return api.get(element)
    }
    const getOuter$1 = function (element) {
      return api.getOuter(element)
    }

    const api$1 = Dimension('height', (element) => {
      const dom = element.dom()
      return inBody(element) ? dom.getBoundingClientRect().height : dom.offsetHeight
    })
    const get$9 = function (element) {
      return api$1.get(element)
    }
    const getOuter$2 = function (element) {
      return api$1.getOuter(element)
    }
    const setMax$1 = function (element, value) {
      const inclusions = [
        'margin-top',
        'border-top-width',
        'padding-top',
        'padding-bottom',
        'border-bottom-width',
        'margin-bottom',
      ]
      const absMax = api$1.max(element, value, inclusions)
      set$2(element, 'max-height', `${absMax}px`)
    }

    const decision = MixedBag([
      'x',
      'y',
      'width',
      'height',
      'maxHeight',
      'direction',
      'classes',
      'label',
      'candidateYforTest',
    ], [])
    const css = Immutable('position', 'left', 'top', 'right', 'bottom')

    const adt$2 = Adt.generate([
      { southeast: [] },
      { southwest: [] },
      { northeast: [] },
      { northwest: [] },
      { south: [] },
      { north: [] },
      { east: [] },
      { west: [] },
    ])
    const cata = function (subject, southeast, southwest, northeast, northwest, south, north, east, west) {
      return subject.fold(southeast, southwest, northeast, northwest, south, north, east, west)
    }
    const cataVertical = function (subject, south, middle, north) {
      return subject.fold(south, south, north, north, south, north, middle, middle)
    }
    const { southeast } = adt$2
    const { southwest } = adt$2
    const { northeast } = adt$2
    const { northwest } = adt$2
    const { south } = adt$2
    const { north } = adt$2
    const { east } = adt$2
    const { west } = adt$2

    const pointed = Immutable('point', 'width', 'height')
    const rect = Immutable('x', 'y', 'width', 'height')
    const bounds = function (x, y, width, height) {
      return {
        x: constant(x),
        y: constant(y),
        width: constant(width),
        height: constant(height),
        right: constant(x + width),
        bottom: constant(y + height),
      }
    }
    const box = function (element) {
      const xy = absolute(element)
      const w = getOuter$1(element)
      const h = getOuter$2(element)
      return bounds(xy.left(), xy.top(), w, h)
    }

    var walkUp = function (navigation, doc) {
      const frame = navigation.view(doc)
      return frame.fold(constant([]), (f) => {
        const parent = navigation.owner(f)
        const rest = walkUp(navigation, parent)
        return [f].concat(rest)
      })
    }
    const pathTo = function (element, navigation) {
      const d = navigation.owner(element)
      const paths = walkUp(navigation, d)
      return Option.some(paths)
    }

    const view = function (doc) {
      const element = doc.dom() === document ? Option.none() : Option.from(doc.dom().defaultView.frameElement)
      return element.map(Element$$1.fromDom)
    }
    const owner$1 = function (element) {
      return owner(element)
    }

    const Navigation = /* #__PURE__ */Object.freeze({
      view,
      owner: owner$1,
    })

    const find$4 = function (element) {
      const doc = Element$$1.fromDom(document)
      const scroll$$1 = get$7(doc)
      const path = pathTo(element, Navigation)
      return path.fold(curry(absolute, element), (frames$$1) => {
        const offset = viewport(element)
        const r = foldr(frames$$1, (b, a) => {
          const loc = viewport(a)
          return {
            left: b.left + loc.left(),
            top: b.top + loc.top(),
          }
        }, {
          left: 0,
          top: 0,
        })
        return Position(r.left + offset.left() + scroll$$1.left(), r.top + offset.top() + scroll$$1.top())
      })
    }

    const win = function () {
      const width = window.innerWidth
      const height = window.innerHeight
      const doc = Element$$1.fromDom(document)
      const scroll$$1 = get$7(doc)
      return bounds(scroll$$1.left(), scroll$$1.top(), width, height)
    }

    const adt$3 = Adt.generate([
      { none: [] },
      {
        relative: [
          'x',
          'y',
          'width',
          'height',
        ],
      },
      {
        fixed: [
          'x',
          'y',
          'width',
          'height',
        ],
      },
    ])
    const positionWithDirection = function (posName, decision$$1, x, y, width, height) {
      const decisionX = decision$$1.x() - x
      const decisionY = decision$$1.y() - y
      const decisionWidth = decision$$1.width()
      const decisionHeight = decision$$1.height()
      const decisionRight = width - (decisionX + decisionWidth)
      const decisionBottom = height - (decisionY + decisionHeight)
      const left = Option.some(decisionX)
      const top = Option.some(decisionY)
      const right = Option.some(decisionRight)
      const bottom = Option.some(decisionBottom)
      const none = Option.none()
      return cata(decision$$1.direction(), () => css(posName, left, top, none, none), () => css(posName, none, top, right, none), () => css(posName, left, none, none, bottom), () => css(posName, none, none, right, bottom), () => css(posName, left, top, none, none), () => css(posName, left, none, none, bottom), () => css(posName, left, top, none, none), () => css(posName, none, top, right, none))
    }
    const reposition = function (origin, decision$$1) {
      return origin.fold(() => css('absolute', Option.some(decision$$1.x()), Option.some(decision$$1.y()), Option.none(), Option.none()), (x, y, width, height) => positionWithDirection('absolute', decision$$1, x, y, width, height), (x, y, width, height) => positionWithDirection('fixed', decision$$1, x, y, width, height))
    }
    const toBox = function (origin, element) {
      const rel = curry(find$4, element)
      const position = origin.fold(rel, rel, () => {
        const scroll = get$7()
        return find$4(element).translate(-scroll.left(), -scroll.top())
      })
      const width = getOuter$1(element)
      const height = getOuter$2(element)
      return bounds(position.left(), position.top(), width, height)
    }
    const viewport$1 = function (origin, getBounds) {
      return getBounds.fold(() => origin.fold(win, win, bounds), (b) => origin.fold(b, b, bounds))
    }
    const cata$1 = function (subject, onNone, onRelative, onFixed) {
      return subject.fold(onNone, onRelative, onFixed)
    }
    const relative$1 = adt$3.relative
    const { fixed } = adt$3

    const anchor = Immutable('anchorBox', 'origin')
    const box$1 = function (anchorBox, origin) {
      return anchor(anchorBox, origin)
    }

    const adt$4 = Adt.generate([
      { fit: ['reposition'] },
      {
        nofit: [
          'reposition',
          'deltaW',
          'deltaH',
        ],
      },
    ])
    const attempt = function (candidate, width, height, bounds) {
      const candidateX = candidate.x()
      const candidateY = candidate.y()
      const bubbleLeft = candidate.bubble().offset().left()
      const bubbleTop = candidate.bubble().offset().top()
      const boundsX = bounds.x()
      const boundsY = bounds.y()
      const boundsWidth = bounds.width()
      const boundsHeight = bounds.height()
      const newX = candidateX + bubbleLeft
      const newY = candidateY + bubbleTop
      const xInBounds = newX >= boundsX
      const yInBounds = newY >= boundsY
      const originInBounds = xInBounds && yInBounds
      const xFit = newX + width <= boundsX + boundsWidth
      const yFit = newY + height <= boundsY + boundsHeight
      const sizeInBounds = xFit && yFit
      const deltaW = xInBounds ? Math.min(width, boundsX + boundsWidth - newX) : Math.abs(boundsX - (newX + width))
      const deltaH = yInBounds ? Math.min(height, boundsY + boundsHeight - newY) : Math.abs(boundsY - (newY + height))
      const maxX = bounds.x() + bounds.width()
      const minX = Math.max(bounds.x(), newX)
      const limitX = Math.min(minX, maxX)
      const limitY = yInBounds ? newY : newY + (height - deltaH)
      const upAvailable = constant(limitY + deltaH - boundsY)
      const downAvailable = constant(boundsY + boundsHeight - limitY)
      const maxHeight = cataVertical(candidate.direction(), downAvailable, downAvailable, upAvailable)
      const reposition = decision({
        x: limitX,
        y: limitY,
        width: deltaW,
        height: deltaH,
        maxHeight,
        direction: candidate.direction(),
        classes: {
          on: candidate.bubble().classesOn(),
          off: candidate.bubble().classesOff(),
        },
        label: candidate.label(),
        candidateYforTest: newY,
      })
      return originInBounds && sizeInBounds ? adt$4.fit(reposition) : adt$4.nofit(reposition, deltaW, deltaH)
    }
    const attempts = function (candidates, anchorBox, elementBox, bubbles, bounds) {
      const panelWidth = elementBox.width()
      const panelHeight = elementBox.height()
      const attemptBestFit = function (layout, reposition, deltaW, deltaH) {
        const next = layout(anchorBox, elementBox, bubbles)
        const attemptLayout = attempt(next, panelWidth, panelHeight, bounds)
        return attemptLayout.fold(adt$4.fit, (newReposition, newDeltaW, newDeltaH) => {
          const improved = newDeltaH > deltaH || newDeltaW > deltaW
          return improved ? adt$4.nofit(newReposition, newDeltaW, newDeltaH) : adt$4.nofit(reposition, deltaW, deltaH)
        })
      }
      const abc = foldl(candidates, (b, a) => {
        const bestNext = curry(attemptBestFit, a)
        return b.fold(adt$4.fit, bestNext)
      }, adt$4.nofit(decision({
        x: anchorBox.x(),
        y: anchorBox.y(),
        width: elementBox.width(),
        height: elementBox.height(),
        maxHeight: elementBox.height(),
        direction: southeast(),
        classes: [],
        label: 'none',
        candidateYforTest: anchorBox.y(),
      }), -1, -1))
      return abc.fold(identity, identity)
    }

    const elementSize = function (p) {
      return {
        width: constant(getOuter$1(p)),
        height: constant(getOuter$2(p)),
      }
    }
    const layout = function (anchorBox, element, bubbles, options) {
      remove$6(element, 'max-height')
      const elementBox = elementSize(element)
      return attempts(options.preference(), anchorBox, elementBox, bubbles, options.bounds())
    }
    const setClasses = function (element, decision) {
      const classInfo = decision.classes()
      remove$5(element, classInfo.off)
      add$3(element, classInfo.on)
    }
    const setHeight = function (element, decision, options) {
      const maxHeightFunction = options.maxHeightFunction()
      maxHeightFunction(element, decision.maxHeight())
    }
    const position = function (element, decision, options) {
      const addPx = function (num) {
        return `${num}px`
      }
      const newPosition = reposition(options.origin(), decision)
      setOptions(element, {
        position: Option.some(newPosition.position()),
        left: newPosition.left().map(addPx),
        top: newPosition.top().map(addPx),
        right: newPosition.right().map(addPx),
        bottom: newPosition.bottom().map(addPx),
      })
    }

    const setMaxHeight = function (element, maxHeight) {
      setMax$1(element, Math.floor(maxHeight))
    }
    const anchored = constant((element, available) => {
      setMaxHeight(element, available)
      setAll$1(element, {
        'overflow-x': 'hidden',
        'overflow-y': 'auto',
      })
    })
    const expandable = constant((element, available) => {
      setMaxHeight(element, available)
    })

    const reparteeOptions = MixedBag([
      'bounds',
      'origin',
      'preference',
      'maxHeightFunction',
    ], [])
    const defaultOr = function (options, key, dephault) {
      return options[key] === undefined ? dephault : options[key]
    }
    const simple = function (anchor, element, bubble, layouts, getBounds, overrideOptions) {
      const maxHeightFunction = defaultOr(overrideOptions, 'maxHeightFunction', anchored())
      const anchorBox = anchor.anchorBox()
      const origin = anchor.origin()
      const options = reparteeOptions({
        bounds: viewport$1(origin, getBounds),
        origin,
        preference: layouts,
        maxHeightFunction,
      })
      go(anchorBox, element, bubble, options)
    }
    var go = function (anchorBox, element, bubble, options) {
      const decision = layout(anchorBox, element, bubble, options)
      position(element, decision, options)
      setClasses(element, decision)
      setHeight(element, decision, options)
    }

    const allAlignments = [
      'valignCentre',
      'alignLeft',
      'alignRight',
      'alignCentre',
      'top',
      'bottom',
      'left',
      'right',
    ]
    const nu$7 = function (width, yoffset, classes) {
      const getClasses = function (prop) {
        return readOptFrom$1(classes, prop).getOr([])
      }
      const make = function (xDelta, yDelta, alignmentsOn) {
        const alignmentsOff = difference(allAlignments, alignmentsOn)
        return {
          offset() {
            return Position(xDelta, yDelta)
          },
          classesOn() {
            return bind(alignmentsOn, getClasses)
          },
          classesOff() {
            return bind(alignmentsOff, getClasses)
          },
        }
      }
      return {
        southeast() {
          return make(-width, yoffset, [
            'top',
            'alignLeft',
          ])
        },
        southwest() {
          return make(width, yoffset, [
            'top',
            'alignRight',
          ])
        },
        south() {
          return make(-width / 2, yoffset, [
            'top',
            'alignCentre',
          ])
        },
        northeast() {
          return make(-width, -yoffset, [
            'bottom',
            'alignLeft',
          ])
        },
        northwest() {
          return make(width, -yoffset, [
            'bottom',
            'alignRight',
          ])
        },
        north() {
          return make(-width / 2, -yoffset, [
            'bottom',
            'alignCentre',
          ])
        },
        east() {
          return make(width, -yoffset / 2, [
            'valignCentre',
            'left',
          ])
        },
        west() {
          return make(-width, -yoffset / 2, [
            'valignCentre',
            'right',
          ])
        },
      }
    }
    const fallback = function () {
      return nu$7(0, 0, {})
    }

    const nu$8 = Immutable('x', 'y', 'bubble', 'direction', 'label')

    const eastX = function (anchor) {
      return anchor.x()
    }
    const middleX = function (anchor, element) {
      return anchor.x() + anchor.width() / 2 - element.width() / 2
    }
    const westX = function (anchor, element) {
      return anchor.x() + anchor.width() - element.width()
    }
    const northY = function (anchor, element) {
      return anchor.y() - element.height()
    }
    const southY = function (anchor) {
      return anchor.y() + anchor.height()
    }
    const centreY = function (anchor, element) {
      return anchor.y() + anchor.height() / 2 - element.height() / 2
    }
    const eastEdgeX = function (anchor) {
      return anchor.x() + anchor.width()
    }
    const westEdgeX = function (anchor, element) {
      return anchor.x() - element.width()
    }
    const southeast$1 = function (anchor, element, bubbles) {
      return nu$8(eastX(anchor), southY(anchor), bubbles.southeast(), southeast(), 'layout-se')
    }
    const southwest$1 = function (anchor, element, bubbles) {
      return nu$8(westX(anchor, element), southY(anchor), bubbles.southwest(), southwest(), 'layout-sw')
    }
    const northeast$1 = function (anchor, element, bubbles) {
      return nu$8(eastX(anchor), northY(anchor, element), bubbles.northeast(), northeast(), 'layout-ne')
    }
    const northwest$1 = function (anchor, element, bubbles) {
      return nu$8(westX(anchor, element), northY(anchor, element), bubbles.northwest(), northwest(), 'layout-nw')
    }
    const north$1 = function (anchor, element, bubbles) {
      return nu$8(middleX(anchor, element), northY(anchor, element), bubbles.north(), north(), 'layout-n')
    }
    const south$1 = function (anchor, element, bubbles) {
      return nu$8(middleX(anchor, element), southY(anchor), bubbles.south(), south(), 'layout-s')
    }
    const east$1 = function (anchor, element, bubbles) {
      return nu$8(eastEdgeX(anchor), centreY(anchor, element), bubbles.east(), east(), 'layout-e')
    }
    const west$1 = function (anchor, element, bubbles) {
      return nu$8(westEdgeX(anchor, element), centreY(anchor, element), bubbles.west(), west(), 'layout-w')
    }
    const all$2 = function () {
      return [
        southeast$1,
        southwest$1,
        northeast$1,
        northwest$1,
        south$1,
        north$1,
        east$1,
        west$1,
      ]
    }
    const allRtl = function () {
      return [
        southwest$1,
        southeast$1,
        northwest$1,
        northeast$1,
        south$1,
        north$1,
        east$1,
        west$1,
      ]
    }

    const nu$9 = function (x) {
      return x
    }

    const onDirection = function (isLtr, isRtl) {
      return function (element) {
        return getDirection(element) === 'rtl' ? isRtl : isLtr
      }
    }
    var getDirection = function (element) {
      return get$5(element, 'direction') === 'rtl' ? 'rtl' : 'ltr'
    }

    const schema$1 = function () {
      return optionObjOf('layouts', [
        strict$1('onLtr'),
        strict$1('onRtl'),
      ])
    }
    const get$a = function (elem, info, defaultLtr, defaultRtl) {
      const ltr = info.layouts.map((ls) => ls.onLtr(elem)).getOr(defaultLtr)
      const rtl = info.layouts.map((ls) => ls.onRtl(elem)).getOr(defaultRtl)
      const f = onDirection(ltr, rtl)
      return f(elem)
    }

    const placement = function (component, anchorInfo, origin) {
      const { hotspot } = anchorInfo
      const anchorBox = toBox(origin, hotspot.element())
      const layouts = get$a(component.element(), anchorInfo, all$2(), allRtl())
      return Option.some(nu$9({
        anchorBox,
        bubble: fallback(),
        overrides: {},
        layouts,
        placer: Option.none(),
      }))
    }
    const HotspotAnchor = [
      strict$1('hotspot'),
      schema$1(),
      output$1('placement', placement),
    ]

    const placement$1 = function (component, anchorInfo, origin) {
      const anchorBox = bounds(anchorInfo.x, anchorInfo.y, anchorInfo.width, anchorInfo.height)
      const layouts = get$a(component.element(), anchorInfo, all$2(), allRtl())
      return Option.some(nu$9({
        anchorBox,
        bubble: anchorInfo.bubble,
        overrides: {},
        layouts,
        placer: Option.none(),
      }))
    }
    const MakeshiftAnchor = [
      strict$1('x'),
      strict$1('y'),
      defaulted$1('height', 0),
      defaulted$1('width', 0),
      defaulted$1('bubble', fallback()),
      schema$1(),
      output$1('placement', placement$1),
    ]

    const zeroWidth = function () {
      return '\uFEFF'
    }

    const adt$5 = Adt.generate([
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
    const exactFromRange = function (simRange) {
      return type$1.exact(simRange.start(), simRange.soffset(), simRange.finish(), simRange.foffset())
    }
    const { domRange } = type$1
    const relative$2 = type$1.relative
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

    const adt$6 = Adt.generate([
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
        return reversed.map((rev) => adt$6.rtl(Element$$1.fromDom(rev.endContainer), rev.endOffset, Element$$1.fromDom(rev.startContainer), rev.startOffset)).getOrThunk(() => fromRange(win, adt$6.ltr, rng))
      }
      return fromRange(win, adt$6.ltr, rng)
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

    const api$2 = NodeValue(isText, 'text')
    const get$b = function (element) {
      return api$2.get(element)
    }
    const getOption = function (element) {
      return api$2.getOption(element)
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
      const { length } = get$b(textnode)
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

    const descendants$1 = function (scope, selector) {
      return all(selector, scope)
    }

    const readRange = function (selection) {
      if (selection.rangeCount > 0) {
        const firstRng = selection.getRangeAt(0)
        const lastRng = selection.getRangeAt(selection.rangeCount - 1)
        return Option.some(range$1(Element$$1.fromDom(firstRng.startContainer), firstRng.startOffset, Element$$1.fromDom(lastRng.endContainer), lastRng.endOffset))
      }
      return Option.none()
    }
    const doGetExact = function (selection) {
      const anchorNode = Element$$1.fromDom(selection.anchorNode)
      const focusNode = Element$$1.fromDom(selection.focusNode)
      return after$3(anchorNode, selection.anchorOffset, focusNode, selection.focusOffset) ? Option.some(range$1(Element$$1.fromDom(selection.anchorNode), selection.anchorOffset, Element$$1.fromDom(selection.focusNode), selection.focusOffset)) : readRange(selection)
    }
    const getExact = function (win) {
      return Option.from(win.getSelection()).filter((sel) => sel.rangeCount > 0).bind(doGetExact)
    }
    const getFirstRect$1 = function (win, selection) {
      const rng = asLtrRange(win, selection)
      return getFirstRect(rng)
    }

    const point = Immutable('element', 'offset')
    const descendOnce = function (element, offset) {
      const children$$1 = children(element)
      if (children$$1.length === 0) {
        return point(element, offset)
      } if (offset < children$$1.length) {
        return point(children$$1[offset], 0)
      }
      const last = children$$1[children$$1.length - 1]
      const len = isText(last) ? get$b(last).length : children(last).length
      return point(last, len)
    }

    const adt$7 = Adt.generate([
      { screen: ['point'] },
      {
        absolute: [
          'point',
          'scrollLeft',
          'scrollTop',
        ],
      },
    ])
    const toFixed = function (pos) {
      return pos.fold((point) => point, (point, scrollLeft, scrollTop) => point.translate(-scrollLeft, -scrollTop))
    }
    const toAbsolute = function (pos) {
      return pos.fold((point) => point, (point, scrollLeft, scrollTop) => point)
    }
    const sum = function (points) {
      return foldl(points, (b, a) => b.translate(a.left(), a.top()), Position(0, 0))
    }
    const sumAsFixed = function (positions) {
      const points = map(positions, toFixed)
      return sum(points)
    }
    const sumAsAbsolute = function (positions) {
      const points = map(positions, toAbsolute)
      return sum(points)
    }
    const { screen } = adt$7
    const absolute$2 = adt$7.absolute

    const getOffset = function (component, origin, anchorInfo) {
      const win = defaultView(anchorInfo.root).dom()
      const hasSameOwner = function (frame) {
        const frameOwner = owner(frame)
        const compOwner = owner(component.element())
        return eq(frameOwner, compOwner)
      }
      return Option.from(win.frameElement).map(Element$$1.fromDom).filter(hasSameOwner).map(absolute)
    }
    const getRootPoint = function (component, origin, anchorInfo) {
      const doc = owner(component.element())
      const outerScroll = get$7(doc)
      const offset = getOffset(component, origin, anchorInfo).getOr(outerScroll)
      return absolute$2(offset, outerScroll.left(), outerScroll.top())
    }

    const capRect = function (left, top, width, height) {
      let newLeft = left; let newTop = top; let newWidth = width; let newHeight = height
      if (left < 0) {
        newLeft = 0
        newWidth = width + left
      }
      if (top < 0) {
        newTop = 0
        newHeight = height + top
      }
      const point = screen(Position(newLeft, newTop))
      return Option.some(pointed(point, newWidth, newHeight))
    }
    const calcNewAnchor = function (optBox, rootPoint, anchorInfo, origin, elem) {
      return optBox.map((box$$1) => {
        const points = [
          rootPoint,
          box$$1.point(),
        ]
        const topLeft = cata$1(origin, () => sumAsAbsolute(points), () => sumAsAbsolute(points), () => sumAsFixed(points))
        const anchorBox = rect(topLeft.left(), topLeft.top(), box$$1.width(), box$$1.height())
        const layoutsLtr = function () {
          return anchorInfo.showAbove ? [
            northeast$1,
            northwest$1,
            southeast$1,
            southwest$1,
            north$1,
            south$1,
          ] : [
            southeast$1,
            southwest$1,
            northeast$1,
            northwest$1,
            south$1,
            south$1,
          ]
        }
        const layoutsRtl = function () {
          return anchorInfo.showAbove ? [
            northwest$1,
            northeast$1,
            southwest$1,
            southeast$1,
            north$1,
            south$1,
          ] : [
            southwest$1,
            southeast$1,
            northwest$1,
            northeast$1,
            south$1,
            north$1,
          ]
        }
        const layouts = get$a(elem, anchorInfo, layoutsLtr(), layoutsRtl())
        return nu$9({
          anchorBox,
          bubble: anchorInfo.bubble.getOr(fallback()),
          overrides: anchorInfo.overrides,
          layouts,
          placer: Option.none(),
        })
      })
    }
    const ContentAnchorCommon = {
      capRect,
      calcNewAnchor,
    }

    const point$1 = Immutable('element', 'offset')
    const descendOnce$1 = function (element, offset) {
      return isText(element) ? point$1(element, offset) : descendOnce(element, offset)
    }
    const getAnchorSelection = function (win, anchorInfo) {
      const getSelection = anchorInfo.getSelection.getOrThunk(() => function () {
        return getExact(win)
      })
      return getSelection().map((sel) => {
        const modStart = descendOnce$1(sel.start(), sel.soffset())
        const modFinish = descendOnce$1(sel.finish(), sel.foffset())
        return range$1(modStart.element(), modStart.offset(), modFinish.element(), modFinish.offset())
      })
    }
    const placement$2 = function (component, anchorInfo, origin) {
      const win = defaultView(anchorInfo.root).dom()
      const rootPoint = getRootPoint(component, origin, anchorInfo)
      const selectionBox = getAnchorSelection(win, anchorInfo).bind((sel) => {
        const optRect = getFirstRect$1(win, exactFromRange(sel)).orThunk(() => {
          const x = Element$$1.fromText(zeroWidth())
          before(sel.start(), x)
          return getFirstRect$1(win, exact(x, 0, x, 1)).map((rect) => {
            remove(x)
            return rect
          })
        })
        return optRect.bind((rawRect) => ContentAnchorCommon.capRect(rawRect.left(), rawRect.top(), rawRect.width(), rawRect.height()))
      })
      const targetElement = getAnchorSelection(win, anchorInfo).bind((sel) => isElement(sel.start()) ? Option.some(sel.start()) : parent(sel.start()))
      const elem = targetElement.getOr(component.element())
      return ContentAnchorCommon.calcNewAnchor(selectionBox, rootPoint, anchorInfo, origin, elem)
    }
    const SelectionAnchor = [
      option('getSelection'),
      strict$1('root'),
      option('bubble'),
      schema$1(),
      defaulted$1('overrides', {}),
      defaulted$1('showAbove', false),
      output$1('placement', placement$2),
    ]

    const placement$3 = function (component, anchorInfo, origin) {
      const rootPoint = getRootPoint(component, origin, anchorInfo)
      return anchorInfo.node.bind((target) => {
        const rect = target.dom().getBoundingClientRect()
        const nodeBox = ContentAnchorCommon.capRect(rect.left, rect.top, rect.width, rect.height)
        const elem = anchorInfo.node.getOr(component.element())
        return ContentAnchorCommon.calcNewAnchor(nodeBox, rootPoint, anchorInfo, origin, elem)
      })
    }
    const NodeAnchor = [
      strict$1('node'),
      strict$1('root'),
      option('bubble'),
      schema$1(),
      defaulted$1('overrides', {}),
      defaulted$1('showAbove', false),
      output$1('placement', placement$3),
    ]

    const eastX$1 = function (anchor) {
      return anchor.x() + anchor.width()
    }
    const westX$1 = function (anchor, element) {
      return anchor.x() - element.width()
    }
    const northY$1 = function (anchor, element) {
      return anchor.y() - element.height() + anchor.height()
    }
    const southY$1 = function (anchor) {
      return anchor.y()
    }
    const southeast$2 = function (anchor, element, bubbles) {
      return nu$8(eastX$1(anchor), southY$1(anchor), bubbles.southeast(), southeast(), 'link-layout-se')
    }
    const southwest$2 = function (anchor, element, bubbles) {
      return nu$8(westX$1(anchor, element), southY$1(anchor), bubbles.southwest(), southwest(), 'link-layout-sw')
    }
    const northeast$2 = function (anchor, element, bubbles) {
      return nu$8(eastX$1(anchor), northY$1(anchor, element), bubbles.northeast(), northeast(), 'link-layout-ne')
    }
    const northwest$2 = function (anchor, element, bubbles) {
      return nu$8(westX$1(anchor, element), northY$1(anchor, element), bubbles.northwest(), northwest(), 'link-layout-nw')
    }
    const all$5 = function () {
      return [
        southeast$2,
        southwest$2,
        northeast$2,
        northwest$2,
      ]
    }
    const allRtl$1 = function () {
      return [
        southwest$2,
        southeast$2,
        northwest$2,
        northeast$2,
      ]
    }

    const placement$4 = function (component, submenuInfo, origin) {
      const anchorBox = toBox(origin, submenuInfo.item.element())
      const layouts = get$a(component.element(), submenuInfo, all$5(), allRtl$1())
      return Option.some(nu$9({
        anchorBox,
        bubble: fallback(),
        overrides: {},
        layouts,
        placer: Option.none(),
      }))
    }
    const SubmenuAnchor = [
      strict$1('item'),
      schema$1(),
      output$1('placement', placement$4),
    ]

    const AnchorSchema = choose$1('anchor', {
      selection: SelectionAnchor,
      node: NodeAnchor,
      hotspot: HotspotAnchor,
      submenu: SubmenuAnchor,
      makeshift: MakeshiftAnchor,
    })

    const getFixedOrigin = function () {
      return fixed(0, 0, window.innerWidth, window.innerHeight)
    }
    const getRelativeOrigin = function (component) {
      const position = absolute(component.element())
      const bounds$$1 = component.element().dom().getBoundingClientRect()
      return relative$1(position.left(), position.top(), bounds$$1.width, bounds$$1.height)
    }
    const place = function (component, origin, anchoring, getBounds, placee) {
      const anchor = box$1(anchoring.anchorBox, origin)
      simple(anchor, placee.element(), anchoring.bubble, anchoring.layouts, getBounds, anchoring.overrides)
    }
    const position$1 = function (component, posConfig, posState, anchor, placee) {
      const boxElement = Option.none()
      positionWithin(component, posConfig, posState, anchor, placee, boxElement)
    }
    var positionWithin = function (component, posConfig, posState, anchor, placee, boxElement) {
      const anchorage = asRawOrDie('positioning anchor.info', AnchorSchema, anchor)
      set$2(placee.element(), 'position', 'fixed')
      const oldVisibility = getRaw(placee.element(), 'visibility')
      set$2(placee.element(), 'visibility', 'hidden')
      const origin = posConfig.useFixed ? getFixedOrigin() : getRelativeOrigin(component)
      const placer = anchorage.placement
      const getBounds = boxElement.map((boxElem) => function () {
        return box(boxElem)
      }).or(posConfig.getBounds)
      placer(component, anchorage, origin).each((anchoring) => {
        const doPlace = anchoring.placer.getOr(place)
        doPlace(component, origin, anchoring, getBounds, placee)
      })
      oldVisibility.fold(() => {
        remove$6(placee.element(), 'visibility')
      }, (vis) => {
        set$2(placee.element(), 'visibility', vis)
      })
      if (getRaw(placee.element(), 'left').isNone() && getRaw(placee.element(), 'top').isNone() && getRaw(placee.element(), 'right').isNone() && getRaw(placee.element(), 'bottom').isNone() && getRaw(placee.element(), 'position').is('fixed')) {
        remove$6(placee.element(), 'position')
      }
    }
    const getMode = function (component, pConfig, pState) {
      return pConfig.useFixed ? 'fixed' : 'absolute'
    }

    const PositionApis = /* #__PURE__ */Object.freeze({
      position: position$1,
      positionWithin,
      getMode,
    })

    const PositionSchema = [
      defaulted$1('useFixed', false),
      option('getBounds'),
    ]

    const Positioning = create$1({
      fields: PositionSchema,
      name: 'positioning',
      active: ActivePosition,
      apis: PositionApis,
    })

    var fireDetaching = function (component) {
      emit(component, detachedFromDom())
      const children$$1 = component.components()
      each(children$$1, fireDetaching)
    }
    var fireAttaching = function (component) {
      const children$$1 = component.components()
      each(children$$1, fireAttaching)
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
      each(subs, doDetach)
      empty(component.element())
      component.syncComponents()
    }
    const attachSystem = function (element, guiSystem) {
      attachSystemInternal(element, guiSystem, append)
    }
    const attachSystemAfter = function (element, guiSystem) {
      attachSystemInternal(element, guiSystem, after)
    }
    var attachSystemInternal = function (element, guiSystem, inserter) {
      inserter(element, guiSystem.element())
      const children$$1 = children(guiSystem.element())
      each(children$$1, (child$$1) => {
        guiSystem.getByDom(child$$1).each(fireAttaching)
      })
    }
    const detachSystem = function (guiSystem) {
      const children$$1 = children(guiSystem.element())
      each(children$$1, (child$$1) => {
        guiSystem.getByDom(child$$1).each(fireDetaching)
      })
      remove(guiSystem.element())
    }

    const rebuild = function (sandbox, sConfig, sState, data) {
      sState.get().each((data) => {
        detachChildren(sandbox)
      })
      const point = sConfig.getAttachPoint(sandbox)
      attach(point, sandbox)
      const built = sandbox.getSystem().build(data)
      attach(sandbox, built)
      sState.set(built)
      return built
    }
    const open = function (sandbox, sConfig, sState, data) {
      const newState = rebuild(sandbox, sConfig, sState, data)
      sConfig.onOpen(sandbox, newState)
      return newState
    }
    const openWhileCloaked = function (sandbox, sConfig, sState, data, transaction) {
      cloak(sandbox, sConfig, sState)
      open(sandbox, sConfig, sState, data)
      transaction()
      decloak(sandbox, sConfig, sState)
    }
    const close = function (sandbox, sConfig, sState) {
      sState.get().each((data) => {
        detachChildren(sandbox)
        detach(sandbox)
        sConfig.onClose(sandbox, data)
        sState.clear()
      })
    }
    const isOpen = function (sandbox, sConfig, sState) {
      return sState.isOpen()
    }
    const isPartOf$1 = function (sandbox, sConfig, sState, queryElem) {
      return isOpen(sandbox, sConfig, sState) && sState.get().exists((data) => sConfig.isPartOf(sandbox, data, queryElem))
    }
    const getState = function (sandbox, sConfig, sState) {
      return sState.get()
    }
    const store = function (sandbox, cssKey, attr, newValue) {
      getRaw(sandbox.element(), cssKey).fold(() => {
        remove$1(sandbox.element(), attr)
      }, (v) => {
        set$1(sandbox.element(), attr, v)
      })
      set$2(sandbox.element(), cssKey, newValue)
    }
    const restore = function (sandbox, cssKey, attr) {
      if (has$1(sandbox.element(), attr)) {
        const oldValue = get$2(sandbox.element(), attr)
        set$2(sandbox.element(), cssKey, oldValue)
      } else {
        remove$6(sandbox.element(), cssKey)
      }
    }
    var cloak = function (sandbox, sConfig, sState) {
      const sink = sConfig.getAttachPoint(sandbox)
      set$2(sandbox.element(), 'position', Positioning.getMode(sink))
      store(sandbox, 'visibility', sConfig.cloakVisibilityAttr, 'hidden')
    }
    const hasPosition = function (element) {
      return exists([
        'top',
        'left',
        'right',
        'bottom',
      ], (pos) => getRaw(element, pos).isSome())
    }
    var decloak = function (sandbox, sConfig, sState) {
      if (!hasPosition(sandbox.element())) {
        remove$6(sandbox.element(), 'position')
      }
      restore(sandbox, 'visibility', sConfig.cloakVisibilityAttr)
    }

    const SandboxApis = /* #__PURE__ */Object.freeze({
      cloak,
      decloak,
      open,
      openWhileCloaked,
      close,
      isOpen,
      isPartOf: isPartOf$1,
      getState,
    })

    const events$2 = function (sandboxConfig, sandboxState) {
      return derive([run(sandboxClose(), (sandbox, simulatedEvent) => {
        close(sandbox, sandboxConfig, sandboxState)
      })])
    }

    const ActiveSandbox = /* #__PURE__ */Object.freeze({
      events: events$2,
    })

    const SandboxSchema = [
      onHandler('onOpen'),
      onHandler('onClose'),
      strict$1('isPartOf'),
      strict$1('getAttachPoint'),
      defaulted$1('cloakVisibilityAttr', 'data-precloak-visibility'),
    ]

    const init = function () {
      const contents = Cell(Option.none())
      const readState = constant('not-implemented')
      const isOpen = function () {
        return contents.get().isSome()
      }
      const set = function (c) {
        contents.set(Option.some(c))
      }
      const get = function (c) {
        return contents.get()
      }
      const clear = function () {
        contents.set(Option.none())
      }
      return nu$5({
        readState,
        isOpen,
        clear,
        set,
        get,
      })
    }

    const SandboxState = /* #__PURE__ */Object.freeze({
      init,
    })

    const Sandboxing = create$1({
      fields: SandboxSchema,
      name: 'sandboxing',
      active: ActiveSandbox,
      apis: SandboxApis,
      state: SandboxState,
    })

    const dismissPopups = constant('dismiss.popups')
    const mouseReleased = constant('mouse.released')

    const schema$2 = objOfOnly([
      defaulted$1('isExtraPart', constant(false)),
      optionObjOf('fireEventInstead', [defaulted$1('event', dismissRequested())]),
    ])
    const receivingConfig = function (rawSpec) {
      const c = receiving(rawSpec)
      return Receiving.config(c)
    }
    var receiving = function (rawSpec) {
      const spec = asRawOrDie('Dismissal', schema$2, rawSpec)
      return {
        channels: wrap$1(dismissPopups(), {
          schema: objOfOnly([strict$1('target')]),
          onReceive(sandbox, data) {
            if (Sandboxing.isOpen(sandbox)) {
              const isPart = Sandboxing.isPartOf(sandbox, data.target) || spec.isExtraPart(sandbox, data.target)
              if (!isPart) {
                spec.fireEventInstead.fold(() => Sandboxing.close(sandbox), (fe) => emit(sandbox, fe.event))
              }
            }
          },
        }),
      }
    }

    const field$1 = function (name, forbidden) {
      return defaultedObjOf(name, {}, map(forbidden, (f) => forbid(f.name(), `Cannot configure ${f.name()} for ${name}`)).concat([state$1('dump', identity)]))
    }
    const get$d = function (data) {
      return data.dump
    }
    const augment = function (data, original) {
      return __assign({}, data.dump, derive$1(original))
    }
    const SketchBehaviours = {
      field: field$1,
      augment,
      get: get$d,
    }

    const _placeholder = 'placeholder'
    const adt$8 = Adt.generate([
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
        return adt$8.single(true, constant(compSpec))
      }
      return readOptFrom$1(placeholders, compSpec.name).fold(() => {
        throw new Error(`Unknown placeholder component: ${compSpec.name}\nKnown: [${keys(placeholders)}]\nNamespace: ${owner.getOr('none')}\nSpec: ${JSON$1.stringify(compSpec, null, 2)}`)
      }, (newSpec) => newSpec.replace())
    }
    const scan = function (owner, detail, compSpec, placeholders) {
      if (compSpec.uiType === _placeholder) {
        return subPlaceholder(owner, detail, compSpec, placeholders)
      }
      return adt$8.single(false, constant(compSpec))
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
      const ps = map$1(placeholders, (ph, name) => oneReplace(name, ph))
      const outcome = substituteAll(owner, detail, components, ps)
      each$1(ps, (p) => {
        if (p.used() === false && p.required()) {
          throw new Error(`Placeholder: ${p.name()} was not found in components list\nNamespace: ${owner.getOr('none')}\nComponents: ${JSON$1.stringify(detail.components, null, 2)}`)
        }
      })
      return outcome
    }
    const { single } = adt$8
    const { multiple } = adt$8
    const placeholder = constant(_placeholder)

    const adt$9 = Adt.generate([
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
    const externalSpec = objOf([
      fFactory,
      fSchema,
      fName,
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
    const asCommon = function (part) {
      return part.fold(identity, identity, identity, identity)
    }
    const convert = function (adtConstructor, partSchema) {
      return function (spec) {
        const data = asRawOrDie('Converting part type', partSchema, spec)
        return adtConstructor(data)
      }
    }
    const required = convert(adt$9.required, requiredSpec)
    const external$1 = convert(adt$9.external, externalSpec)
    const optional = convert(adt$9.optional, optionalSpec)
    const group = convert(adt$9.group, groupSpec)
    const original = constant('entirety')

    const PartType = /* #__PURE__ */Object.freeze({
      required,
      external: external$1,
      optional,
      group,
      asNamedPart,
      name: name$1,
      asCommon,
      original,
    })

    const combine$2 = function (detail, data, partSpec, partValidated) {
      return deepMerge(data.defaults(detail, partSpec, partValidated), partSpec, { uid: detail.partUids[data.name] }, data.overrides(detail, partSpec, partValidated))
    }
    const subs = function (owner, detail, parts) {
      const internals = {}
      const externals = {}
      each(parts, (part) => {
        part.fold((data) => {
          internals[data.pname] = single(true, (detail, partSpec, partValidated) => data.factory.sketch(combine$2(detail, data, partSpec, partValidated)))
        }, (data) => {
          const partSpec = detail.parts[data.name]
          externals[data.name] = constant(data.factory.sketch(combine$2(detail, data, partSpec[original()]), partSpec))
        }, (data) => {
          internals[data.pname] = single(false, (detail, partSpec, partValidated) => data.factory.sketch(combine$2(detail, data, partSpec, partValidated)))
        }, (data) => {
          internals[data.pname] = multiple(true, (detail, _partSpec, _partValidated) => {
            const units = detail[data.name]
            return map(units, (u) => data.factory.sketch(deepMerge(data.defaults(detail, u, _partValidated), u, data.overrides(detail, u))))
          })
        })
      })
      return {
        internals: constant(internals),
        externals: constant(externals),
      }
    }

    const generate$4 = function (owner, parts) {
      const r = {}
      each(parts, (part) => {
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
      return map(parts, name$1)
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
    const getParts = function (component, detail, partKeys) {
      const r = {}
      const uids = detail.partUids
      const system = component.getSystem()
      each(partKeys, (pk) => {
        r[pk] = system.getByUid(uids[pk])
      })
      return map$1(r, constant)
    }
    const getAllParts = function (component, detail) {
      const system = component.getSystem()
      return map$1(detail.partUids, (pUid, k) => constant(system.getByUid(pUid)))
    }
    const getAllPartNames = function (detail) {
      return keys(detail.partUids)
    }
    const getPartsOrDie = function (component, detail, partKeys) {
      const r = {}
      const uids = detail.partUids
      const system = component.getSystem()
      each(partKeys, (pk) => {
        r[pk] = system.getByUid(uids[pk]).getOrDie()
      })
      return map$1(r, constant)
    }
    const defaultUids = function (baseUid, partTypes) {
      const partNames = names(partTypes)
      return wrapAll$1(map(partNames, (pn) => ({
        key: pn,
        value: `${baseUid}-${pn}`,
      })))
    }
    const defaultUidsSchema = function (partTypes) {
      return field('partUids', 'partUids', mergeWithThunk((spec) => defaultUids(spec.uid, partTypes)), anyValue$1())
    }

    const AlloyParts = /* #__PURE__ */Object.freeze({
      generate: generate$4,
      generateOne,
      schemas,
      names,
      substitutes,
      components,
      defaultUids,
      defaultUidsSchema,
      getAllParts,
      getAllPartNames,
      getPart,
      getPartOrDie,
      getParts,
      getPartsOrDie,
    })

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
      return spec.hasOwnProperty('uid') ? spec : __assign({}, spec, { uid: generate$2('uid') })
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
      const apis = map$1(config.apis, makeApi)
      const extraApis = map$1(config.extraApis, (f, k) => markAsExtraApi(f, k))
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
      const parts = generate$4(config.name, config.partFields)
      const apis = map$1(config.apis, makeApi)
      const extraApis = map$1(config.extraApis, (f, k) => markAsExtraApi(f, k))
      return __assign({
        name: constant(config.name),
        partFields: constant(config.partFields),
        configFields: constant(config.configFields),
        sketch,
        parts: constant(parts),
      }, apis, extraApis)
    }

    const inside = function (target) {
      return name(target) === 'input' && get$2(target, 'type') !== 'radio' || name(target) === 'textarea'
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
      each(highlighted, (h) => {
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
      const targetComp = find(candidates, predicate)
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
      return cat(map(items, (i) => component.getSystem().getByDom(i).toOption()))
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
      return find(before.concat(after), predicate)
    }
    const tryPrev = function (values, index, predicate) {
      const before = reverse(values.slice(0, index))
      return find(before, predicate)
    }
    const cycleNext = function (values, index, predicate) {
      const before = values.slice(0, index)
      const after = values.slice(index + 1)
      return find(after.concat(before), predicate)
    }
    const tryNext = function (values, index, predicate) {
      const after = values.slice(index + 1)
      return find(after, predicate)
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
      const transition = find(transitions, (t) => t.matches(event))
      return transition.map((t) => t.classification)
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
    const search$1 = function (element) {
      return active(owner(element)).filter((e) => element.dom().contains(e.dom()))
    }

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
        return search$1(component.element())
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

    const create$3 = function (cyclicField) {
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
        return get$9(target) > 0
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

    const AcyclicType = create$3(state$1('cyclic', constant(false)))

    const CyclicType = create$3(state$1('cyclic', constant(true)))

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

    const schema$3 = [
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
    const ExecutionType = typical(schema$3, NoState.init, getKeydownRules, getKeyupRules, () => Option.none())

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
      return nu$5({
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

    const useH = function (movement) {
      return function (component, simulatedEvent, config, state) {
        const move = movement(component.element())
        return use(move, component, simulatedEvent, config, state)
      }
    }
    const west$2 = function (moveLeft, moveRight) {
      const movement = onDirection(moveLeft, moveRight)
      return useH(movement)
    }
    const east$2 = function (moveLeft, moveRight) {
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
    const north$2 = useV
    const south$2 = useV
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
    const locate$2 = function (candidates, predicate) {
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
      return locate$2(visible, predicate)
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

    const schema$4 = [
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
      rule(inSet(LEFT()), west$2(moveLeft, moveRight)),
      rule(inSet(RIGHT()), east$2(moveLeft, moveRight)),
      rule(inSet(UP()), north$2(moveNorth)),
      rule(inSet(DOWN()), south$2(moveSouth)),
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
    const FlatgridType = typical(schema$4, flatgrid, getKeydownRules$1, getKeyupRules$1, () => Option.some(focusIn))

    const horizontal = function (container, selector, current, delta) {
      const isDisabledButton = function (candidate) {
        return name(candidate) === 'button' && get$2(candidate, 'disabled') === 'disabled'
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

    const schema$5 = [
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
        rule(inSet(westMovers), doMove$1(west$2(moveLeft$1, moveRight$1))),
        rule(inSet(eastMovers), doMove$1(east$2(moveLeft$1, moveRight$1))),
        rule(inSet(ENTER()), execute$3),
        rule(inSet(SPACE()), execute$3),
        rule(inSet(ESCAPE()), doEscape$1),
      ]
    }
    const getKeyupRules$2 = constant([rule(inSet(SPACE()), stopEventForFirefox)])
    const FlowType = typical(schema$5, NoState.init, getKeydownRules$2, getKeyupRules$2, () => Option.some(focusIn$1))

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

    const schema$6 = [
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
      return search$1(component.element()).bind((focused) => matrixConfig.execute(component, simulatedEvent, focused))
    }
    const toMatrix = function (rows, matrixConfig) {
      return map(rows, (row) => descendants$1(row, matrixConfig.selectors.cell))
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
      rule(inSet(LEFT()), west$2(moveLeft$3, moveRight$3)),
      rule(inSet(RIGHT()), east$2(moveLeft$3, moveRight$3)),
      rule(inSet(UP()), north$2(moveNorth$1)),
      rule(inSet(DOWN()), south$2(moveSouth$1)),
      rule(inSet(SPACE().concat(ENTER())), execute$4),
    ])
    const getKeyupRules$3 = constant([rule(inSet(SPACE()), stopEventForFirefox)])
    const MatrixType = typical(schema$6, NoState.init, getKeydownRules$3, getKeyupRules$3, () => Option.some(focusIn$2))

    const schema$7 = [
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
    const MenuType = typical(schema$7, NoState.init, getKeydownRules$4, getKeyupRules$4, () => Option.some(focusIn$3))

    const schema$8 = [
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
    const SpecialType = typical(schema$8, NoState.init, getKeydownRules$5, getKeyupRules$5, (specialInfo) => specialInfo.focusIn)

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

    const set$7 = function (component, replaceConfig, replaceState, data) {
      detachChildren(component)
      preserve$2(() => {
        const children = map(data, component.getSystem().build)
        each(children, (l) => {
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
      const foundChild = find(children, (child) => eq(removee.element(), child.element()))
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
      set: set$7,
      contents,
    })

    const Replacing = create$1({
      fields: [],
      name: 'replacing',
      apis: ReplaceApis,
    })

    const onLoad = function (component, repConfig, repState) {
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
    const getState$1 = function (component, repConfig, repState) {
      return repState
    }

    const RepresentApis = /* #__PURE__ */Object.freeze({
      onLoad,
      onUnload,
      setValue,
      getValue,
      getState: getState$1,
    })

    const events$3 = function (repConfig, repState) {
      const es = repConfig.resetOnDom ? [
        runOnAttached((comp, se) => {
          onLoad(comp, repConfig, repState)
        }),
        runOnDetached((comp, se) => {
          onUnload(comp, repConfig, repState)
        }),
      ] : [loadEvent(repConfig, repState, onLoad)]
      return derive(es)
    }

    const ActiveRepresenting = /* #__PURE__ */Object.freeze({
      events: events$3,
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
      return nu$5({
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
      return nu$5({ readState })
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
        each(items, (item) => {
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
      return nu$5({
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
    const onLoad$1 = function (component, repConfig, repState) {
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
        onLoad: onLoad$1,
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
    const onLoad$2 = function (component, repConfig, repState) {
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
        onLoad: onLoad$2,
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
    const onLoad$3 = function (component, repConfig, repState) {
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
        onLoad: onLoad$3,
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
      return nu$6(mod)
    }
    const events$4 = function (focusConfig) {
      return derive([run(focus$1(), (component, simulatedEvent) => {
        focus$3(component, focusConfig)
        simulatedEvent.stop()
      })].concat(focusConfig.stopMousedown ? [run(mousedown(), (_, simulatedEvent) => {
        simulatedEvent.event().prevent()
      })] : []))
    }

    const ActiveFocus = /* #__PURE__ */Object.freeze({
      exhibit: exhibit$1,
      events: events$4,
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
    const toggle$3 = function (component, toggleConfig, toggleState) {
      set$8(component, toggleConfig, toggleState, !toggleState.get())
    }
    const on$1 = function (component, toggleConfig, toggleState) {
      toggleState.set(true)
      updateClass(component, toggleConfig, toggleState)
      updateAriaState(component, toggleConfig, toggleState)
    }
    const off = function (component, toggleConfig, toggleState) {
      toggleState.set(false)
      updateClass(component, toggleConfig, toggleState)
      updateAriaState(component, toggleConfig, toggleState)
    }
    var set$8 = function (component, toggleConfig, toggleState, state) {
      const action = state ? on$1 : off
      action(component, toggleConfig, toggleState)
    }
    const isOn = function (component, toggleConfig, toggleState) {
      return toggleState.get()
    }
    const onLoad$4 = function (component, toggleConfig, toggleState) {
      set$8(component, toggleConfig, toggleState, toggleConfig.selected)
    }

    const ToggleApis = /* #__PURE__ */Object.freeze({
      onLoad: onLoad$4,
      toggle: toggle$3,
      isOn,
      on: on$1,
      off,
      set: set$8,
    })

    const exhibit$2 = function (base, toggleConfig, toggleState) {
      return nu$6({})
    }
    const events$5 = function (toggleConfig, toggleState) {
      const execute = executeEvent(toggleConfig, toggleState, toggle$3)
      const load = loadEvent(toggleConfig, toggleState, onLoad$4)
      return derive(flatten([
        toggleConfig.toggleOnExecute ? [execute] : [],
        [load],
      ]))
    }

    const ActiveToggle = /* #__PURE__ */Object.freeze({
      exhibit: exhibit$2,
      events: events$5,
    })

    const init$3 = function (spec) {
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
      init: init$3,
    })

    const updatePressed = function (component, ariaInfo, status) {
      set$1(component.element(), 'aria-pressed', status)
      if (ariaInfo.syncWithExpanded) {
        updateExpanded(component, ariaInfo, status)
      }
    }
    const updateSelected = function (component, ariaInfo, status) {
      set$1(component.element(), 'aria-selected', status)
    }
    const updateChecked = function (component, ariaInfo, status) {
      set$1(component.element(), 'aria-checked', status)
    }
    var updateExpanded = function (component, ariaInfo, status) {
      set$1(component.element(), 'aria-expanded', status)
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

    const hoverEvent = 'alloy.item-hover'
    const focusEvent = 'alloy.item-focus'
    const onHover = function (item) {
      if (search$1(item.element()).isNone() || Focusing.isFocused(item)) {
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
    const schema$9 = [
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
    const schema$a = [
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
            } : revoke$1(),
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
    const schema$b = [
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
      widget: schema$b,
      item: schema$9,
      separator: schema$a,
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
        return u.hasOwnProperty('uid') ? u : __assign({}, u, { uid: generate$2('item') })
      },
      overrides(detail, u) {
        return {
          type: u.type,
          ignoreFocus: detail.fakeFocus,
          domModification: { classes: [detail.markers.item] },
        }
      },
    })])
    const schema$c = constant([
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

    const make$1 = function (detail, components, spec, externals) {
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
      configFields: schema$c(),
      partFields: parts$1(),
      factory: make$1,
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
      each$1(menus, (menuItems, menu) => {
        each(menuItems, (item) => {
          items[item] = menu
        })
      })
      const byItem = expansions
      const byMenu = transpose(expansions)
      const menuPaths = map$1(byMenu, (_triggerItem, submenu) => [submenu].concat(trace(items, byItem, byMenu, submenu)))
      return map$1(items, (menu) => readOptFrom$1(menuPaths, menu).getOr([menu]))
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

    const make$2 = function (detail, rawUiSpec) {
      const submenuParentItems = Cell(Option.none())
      const buildMenus = function (container, primaryName, menus) {
        return map$1(menus, (spec, name) => {
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
        return map$1(detail.data.menus, (data, menuName) => bind(data.items, (item) => item.type === 'separator' ? [] : [item.data.value]))
      }
      const setActiveMenu = function (container, menu) {
        Highlighting.highlight(container, menu)
        Highlighting.getHighlighted(menu).orThunk(() => Highlighting.getFirst(menu)).each((item) => {
          dispatch(container, item.element(), focusItem())
        })
      }
      const getMenus = function (state, menuValues) {
        return cat(map(menuValues, (mv) => state.lookupMenu(mv).bind((prep) => prep.type === 'prepared' ? Option.some(prep.menu) : Option.none())))
      }
      const closeOthers = function (container, state, path) {
        const others = getMenus(state, state.otherMenus(path))
        each(others, (o) => {
          remove$5(o.element(), [detail.markers.backgroundMenu])
          if (!detail.stayInDom) {
            Replacing.remove(container, o)
          }
        })
      }
      const getSubmenuParents = function (container) {
        return submenuParentItems.get().getOrThunk(() => {
          const r = {}
          const items = descendants$1(container.element(), `.${detail.markers.item}`)
          const parentItems = filter(items, (i) => get$2(i, 'aria-haspopup') === 'true')
          each(parentItems, (i) => {
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
        each$1(parentItems, (v, k) => {
          const expanded = contains(path, k)
          set$1(v.element(), 'aria-expanded', expanded)
        })
      }
      const updateMenuPath = function (container, state, path) {
        return Option.from(path[0]).bind((latestMenuName) => state.lookupMenu(latestMenuName).bind((menuPrep) => {
          if (menuPrep.type === 'notbuilt') {
            return Option.none()
          }
          const activeMenu = menuPrep.menu
          const rest = getMenus(state, path.slice(1))
          each(rest, (r) => {
            add$2(r.element(), detail.markers.backgroundMenu)
          })
          if (!inBody(activeMenu.element())) {
            Replacing.append(container, premade$1(activeMenu))
          }
          remove$5(activeMenu.element(), [detail.markers.backgroundMenu])
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
        menus: wrap$1(name, menu),
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
      factory: make$2,
      extraApis: {
        tieredData,
        singleData,
        collapseItem: collapseItem$1,
      },
    })

    const makeMenu = function (detail, menuSandbox, anchor, menuSpec) {
      const lazySink = function () {
        return detail.lazySink(menuSandbox)
      }
      return tieredMenu.sketch({
        dom: { tag: 'div' },
        data: menuSpec.data,
        markers: menuSpec.menu.markers,
        onEscape() {
          Sandboxing.close(menuSandbox)
          detail.onEscape.map((handler) => handler(menuSandbox))
          return Option.some(true)
        },
        onExecute() {
          return Option.some(true)
        },
        onOpenMenu(tmenu, menu) {
          Positioning.position(lazySink().getOrDie(), anchor, menu)
        },
        onOpenSubmenu(tmenu, item, submenu) {
          const sink = lazySink().getOrDie()
          Positioning.position(sink, {
            anchor: 'submenu',
            item,
          }, submenu)
        },
      })
    }
    const factory = function (detail, spec) {
      const isPartOfRelated = function (sandbox, queryElem) {
        const related = detail.getRelated(sandbox)
        return related.exists((rel) => isPartOf(rel, queryElem))
      }
      const setContent = function (sandbox, thing) {
        Sandboxing.open(sandbox, thing)
      }
      const showAt = function (sandbox, anchor, thing) {
        const getBounds = Option.none()
        showWithin(sandbox, anchor, thing, getBounds)
      }
      var showWithin = function (sandbox, anchor, thing, boxElement) {
        const sink = detail.lazySink(sandbox).getOrDie()
        Sandboxing.openWhileCloaked(sandbox, thing, () => Positioning.positionWithin(sink, anchor, sandbox, boxElement))
        detail.onShow(sandbox)
      }
      const showMenuAt = function (sandbox, anchor, menuSpec) {
        const menu = makeMenu(detail, sandbox, anchor, menuSpec)
        Sandboxing.open(sandbox, menu)
        detail.onShow(sandbox)
      }
      const hide = function (sandbox) {
        Sandboxing.close(sandbox)
        detail.onHide(sandbox)
      }
      const getContent = function (sandbox) {
        return Sandboxing.getState(sandbox)
      }
      const apis = {
        setContent,
        showAt,
        showWithin,
        showMenuAt,
        hide,
        getContent,
        isOpen: Sandboxing.isOpen,
      }
      return {
        uid: detail.uid,
        dom: detail.dom,
        behaviours: augment(detail.inlineBehaviours, [
          Sandboxing.config({
            isPartOf(sandbox, data, queryElem) {
              return isPartOf(data, queryElem) || isPartOfRelated(sandbox, queryElem)
            },
            getAttachPoint(sandbox) {
              return detail.lazySink(sandbox).getOrDie()
            },
          }),
          receivingConfig(__assign({ isExtraPart: constant(false) }, detail.fireDismissalEventInstead.map((fe) => ({ fireEventInstead: { event: fe.event } })).getOr({}))),
        ]),
        eventOrder: detail.eventOrder,
        apis,
      }
    }
    const InlineView = single$2({
      name: 'InlineView',
      configFields: [
        strict$1('lazySink'),
        onHandler('onShow'),
        onHandler('onHide'),
        optionFunction('onEscape'),
        field$1('inlineBehaviours', [
          Sandboxing,
          Receiving,
        ]),
        optionObjOf('fireDismissalEventInstead', [defaulted$1('event', dismissRequested())]),
        defaulted$1('getRelated', Option.none),
        defaulted$1('eventOrder', Option.none),
      ],
      factory,
      apis: {
        showAt(apis, component, anchor, thing) {
          apis.showAt(component, anchor, thing)
        },
        showWithin(apis, component, anchor, thing, boxElement) {
          apis.showWithin(component, anchor, thing, boxElement)
        },
        showMenuAt(apis, component, anchor, menuSpec) {
          apis.showMenuAt(component, anchor, menuSpec)
        },
        hide(apis, component) {
          apis.hide(component)
        },
        isOpen(apis, component) {
          return apis.isOpen(component)
        },
        getContent(apis, component) {
          return apis.getContent(component)
        },
        setContent(apis, component, thing) {
          apis.setContent(component, thing)
        },
      },
    })

    const events$7 = function (optAction) {
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

    const factory$1 = function (detail) {
      const events = events$7(detail.action)
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
      factory: factory$1,
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

    const record = function (spec) {
      const uid = isSketchSpec(spec) && hasKey$1(spec, 'uid') ? spec.uid : generate$2('memento')
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

    const getAll = function () {
      return {
        'accessibility-check': '<svg width="24" height="24"><path d="M12 2a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2c0-1.1.9-2 2-2zm8 7h-5v12c0 .6-.4 1-1 1a1 1 0 0 1-1-1v-5c0-.6-.4-1-1-1a1 1 0 0 0-1 1v5c0 .6-.4 1-1 1a1 1 0 0 1-1-1V9H4a1 1 0 1 1 0-2h16c.6 0 1 .4 1 1s-.4 1-1 1z" fill-rule="nonzero"/></svg>',
        'align-center': '<svg width="24" height="24"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2zm3 4h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 1 1 0-2zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2zm-3-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2z" fill-rule="evenodd"/></svg>',
        'align-justify': '<svg width="24" height="24"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2zm0 4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2zm0 4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2zm0 4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2z" fill-rule="evenodd"/></svg>',
        'align-left': '<svg width="24" height="24"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2z" fill-rule="evenodd"/></svg>',
        'align-none': '<svg width="24" height="24"><path d="M14.2 5L13 7H5a1 1 0 1 1 0-2h9.2zm4 0h.8a1 1 0 0 1 0 2h-2l1.2-2zm-6.4 4l-1.2 2H5a1 1 0 0 1 0-2h6.8zm4 0H19a1 1 0 0 1 0 2h-4.4l1.2-2zm-6.4 4l-1.2 2H5a1 1 0 0 1 0-2h4.4zm4 0H19a1 1 0 0 1 0 2h-6.8l1.2-2zM7 17l-1.2 2H5a1 1 0 0 1 0-2h2zm4 0h8a1 1 0 0 1 0 2H9.8l1.2-2zm5.2-13.5l1.3.7-9.7 16.3-1.3-.7 9.7-16.3z" fill-rule="evenodd"/></svg>',
        'align-right': '<svg width="24" height="24"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2zm6 4h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2zm-6-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2z" fill-rule="evenodd"/></svg>',
        'arrow-left': '<svg width="24" height="24"><path d="M5.6 13l12 6a1 1 0 0 0 1.4-1V6a1 1 0 0 0-1.4-.9l-12 6a1 1 0 0 0 0 1.8z" fill-rule="evenodd"/></svg>',
        'arrow-right': '<svg width="24" height="24"><path d="M18.5 13l-12 6A1 1 0 0 1 5 18V6a1 1 0 0 1 1.4-.9l12 6a1 1 0 0 1 0 1.8z" fill-rule="evenodd"/></svg>',
        bold: '<svg width="24" height="24"><path d="M7.8 19c-.3 0-.5 0-.6-.2l-.2-.5V5.7c0-.2 0-.4.2-.5l.6-.2h5c1.5 0 2.7.3 3.5 1 .7.6 1.1 1.4 1.1 2.5a3 3 0 0 1-.6 1.9c-.4.6-1 1-1.6 1.2.4.1.9.3 1.3.6s.8.7 1 1.2c.4.4.5 1 .5 1.6 0 1.3-.4 2.3-1.3 3-.8.7-2.1 1-3.8 1H7.8zm5-8.3c.6 0 1.2-.1 1.6-.5.4-.3.6-.7.6-1.3 0-1.1-.8-1.7-2.3-1.7H9.3v3.5h3.4zm.5 6c.7 0 1.3-.1 1.7-.4.4-.4.6-.9.6-1.5s-.2-1-.7-1.4c-.4-.3-1-.4-2-.4H9.4v3.8h4z" fill-rule="evenodd"/></svg>',
        bookmark: '<svg width="24" height="24"><path d="M6 4v17l6-4 6 4V4c0-.6-.4-1-1-1H7a1 1 0 0 0-1 1z" fill-rule="nonzero"/></svg>',
        'border-width': '<svg width="24" height="24"><path d="M5 14.8h14a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2zm-.5 3.7h15c.3 0 .5.2.5.5s-.2.5-.5.5h-15a.5.5 0 1 1 0-1zm.5-8.3h14c.6 0 1 .4 1 1v1c0 .5-.4 1-1 1H5a1 1 0 0 1-1-1v-1c0-.6.4-1 1-1zm0-5.7h14c.6 0 1 .4 1 1v2c0 .6-.4 1-1 1H5a1 1 0 0 1-1-1v-2c0-.6.4-1 1-1z" fill-rule="evenodd"/></svg>',
        brightness: '<svg width="24" height="24"><path d="M12 17c.3 0 .5.1.7.3.2.2.3.4.3.7v1c0 .3-.1.5-.3.7a1 1 0 0 1-.7.3 1 1 0 0 1-.7-.3 1 1 0 0 1-.3-.7v-1c0-.3.1-.5.3-.7.2-.2.4-.3.7-.3zm0-10a1 1 0 0 1-.7-.3A1 1 0 0 1 11 6V5c0-.3.1-.5.3-.7.2-.2.4-.3.7-.3.3 0 .5.1.7.3.2.2.3.4.3.7v1c0 .3-.1.5-.3.7a1 1 0 0 1-.7.3zm7 4c.3 0 .5.1.7.3.2.2.3.4.3.7 0 .3-.1.5-.3.7a1 1 0 0 1-.7.3h-1a1 1 0 0 1-.7-.3 1 1 0 0 1-.3-.7c0-.3.1-.5.3-.7.2-.2.4-.3.7-.3h1zM7 12c0 .3-.1.5-.3.7a1 1 0 0 1-.7.3H5a1 1 0 0 1-.7-.3A1 1 0 0 1 4 12c0-.3.1-.5.3-.7.2-.2.4-.3.7-.3h1c.3 0 .5.1.7.3.2.2.3.4.3.7zm10 3.5l.7.8c.2.1.3.4.3.6 0 .3-.1.6-.3.8a1 1 0 0 1-.8.3 1 1 0 0 1-.6-.3l-.8-.7a1 1 0 0 1-.3-.8c0-.2.1-.5.3-.7a1 1 0 0 1 1.4 0zm-10-7l-.7-.8a1 1 0 0 1-.3-.6c0-.3.1-.6.3-.8.2-.2.5-.3.8-.3.2 0 .5.1.7.3l.7.7c.2.2.3.5.3.8 0 .2-.1.5-.3.7a1 1 0 0 1-.7.3 1 1 0 0 1-.8-.3zm10 0a1 1 0 0 1-.8.3 1 1 0 0 1-.7-.3 1 1 0 0 1-.3-.7c0-.3.1-.6.3-.8l.8-.7c.1-.2.4-.3.6-.3.3 0 .6.1.8.3.2.2.3.5.3.8 0 .2-.1.5-.3.7l-.7.7zm-10 7c.2-.2.5-.3.8-.3.2 0 .5.1.7.3a1 1 0 0 1 0 1.4l-.8.8a1 1 0 0 1-.6.3 1 1 0 0 1-.8-.3 1 1 0 0 1-.3-.8c0-.2.1-.5.3-.6l.7-.8zM12 8a4 4 0 0 1 3.7 2.4 4 4 0 0 1 0 3.2A4 4 0 0 1 12 16a4 4 0 0 1-3.7-2.4 4 4 0 0 1 0-3.2A4 4 0 0 1 12 8zm0 6.5c.7 0 1.3-.2 1.8-.7.5-.5.7-1.1.7-1.8s-.2-1.3-.7-1.8c-.5-.5-1.1-.7-1.8-.7s-1.3.2-1.8.7c-.5.5-.7 1.1-.7 1.8s.2 1.3.7 1.8c.5.5 1.1.7 1.8.7z" fill-rule="evenodd"/></svg>',
        browse: '<svg width="24" height="24"><path d="M19 4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4v-2h4V8H5v10h4v2H5a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h14zm-8 9.4l-2.3 2.3a1 1 0 1 1-1.4-1.4l4-4a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1-1.4 1.4L13 13.4V20a1 1 0 0 1-2 0v-6.6z" fill-rule="nonzero"/></svg>',
        cancel: '<svg width="24" height="24"><path d="M12 4.6a7.4 7.4 0 1 1 0 14.8 7.4 7.4 0 0 1 0-14.8zM12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 8L14.8 8l1 1.1-2.7 2.8 2.7 2.7-1.1 1.1-2.7-2.7-2.7 2.7-1-1.1 2.6-2.7-2.7-2.7 1-1.1 2.8 2.7z" fill-rule="nonzero"/></svg>',
        'change-case': '<svg width="24" height="24"><path d="M18.4 18.2v-.6c-.5.8-1.3 1.2-2.4 1.2-2.2 0-3.3-1.6-3.3-4.8 0-3.1 1-4.7 3.3-4.7 1.1 0 1.8.3 2.4 1.1v-.6c0-.5.4-.8.8-.8s.8.3.8.8v8.4c0 .5-.4.8-.8.8a.8.8 0 0 1-.8-.8zm-2-7.4c-1.3 0-1.8.9-1.8 3.2 0 2.4.5 3.3 1.7 3.3 1.3 0 1.8-.9 1.8-3.2 0-2.4-.5-3.3-1.7-3.3zM10 15.7H5.5l-.8 2.6a1 1 0 0 1-1 .7h-.2a.7.7 0 0 1-.7-1l4-12a1 1 0 1 1 2 0l4 12a.7.7 0 0 1-.8 1h-.2a1 1 0 0 1-1-.7l-.8-2.6zm-.3-1.5l-2-6.5-1.9 6.5h3.9z" fill-rule="evenodd"/></svg>',
        'character-count': '<svg width="24" height="24"><path d="M4 11.5h16v1H4v-1zm4.8-6.8V10H7.7V5.8h-1v-1h2zM11 8.3V9h2v1h-3V7.7l2-1v-.9h-2v-1h3v2.4l-2 1zm6.3-3.4V10h-3.1V9h2.1V8h-2.1V6.8h2.1v-1h-2.1v-1h3.1zM5.8 16.4c0-.5.2-.8.5-1 .2-.2.6-.3 1.2-.3l.8.1c.2 0 .4.2.5.3l.4.4v2.8l.2.3H8.2v-.1-.2l-.6.3H7c-.4 0-.7 0-1-.2a1 1 0 0 1-.3-.9c0-.3 0-.6.3-.8.3-.2.7-.4 1.2-.4l.6-.2h.3v-.2l-.1-.2a.8.8 0 0 0-.5-.1 1 1 0 0 0-.4 0l-.3.4h-1zm2.3.8h-.2l-.2.1-.4.1a1 1 0 0 0-.4.2l-.2.2.1.3.5.1h.4l.4-.4v-.6zm2-3.4h1.2v1.7l.5-.3h.5c.5 0 .9.1 1.2.5.3.4.5.8.5 1.4 0 .6-.2 1.1-.5 1.5-.3.4-.7.6-1.3.6l-.6-.1-.4-.4v.4h-1.1v-5.4zm1.1 3.3c0 .3 0 .6.2.8a.7.7 0 0 0 1.2 0l.2-.8c0-.4 0-.6-.2-.8a.7.7 0 0 0-.6-.3l-.6.3-.2.8zm6.1-.5c0-.2 0-.3-.2-.4a.8.8 0 0 0-.5-.2c-.3 0-.5.1-.6.3l-.2.9c0 .3 0 .6.2.8.1.2.3.3.6.3.2 0 .4 0 .5-.2l.2-.4h1.1c0 .5-.3.8-.6 1.1a2 2 0 0 1-1.3.4c-.5 0-1-.2-1.3-.6a2 2 0 0 1-.5-1.4c0-.6.1-1.1.5-1.5.3-.4.8-.5 1.4-.5.5 0 1 0 1.2.3.4.3.5.7.5 1.2h-1v-.1z" fill-rule="evenodd"/></svg>',
        checklist: '<svg width="24" height="24"><path d="M11 17h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2zm0-6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2zm0-6h8a1 1 0 0 1 0 2h-8a1 1 0 0 1 0-2zM7.2 16c.2-.4.6-.5.9-.3.3.2.4.6.2 1L6 20c-.2.3-.7.4-1 0l-1.3-1.3a.7.7 0 0 1 0-1c.3-.2.7-.2 1 0l.7.9 1.7-2.8zm0-6c.2-.4.6-.5.9-.3.3.2.4.6.2 1L6 14c-.2.3-.7.4-1 0l-1.3-1.3a.7.7 0 0 1 0-1c.3-.2.7-.2 1 0l.7.9 1.7-2.8zm0-6c.2-.4.6-.5.9-.3.3.2.4.6.2 1L6 8c-.2.3-.7.4-1 0L3.8 6.9a.7.7 0 0 1 0-1c.3-.2.7-.2 1 0l.7.9 1.7-2.8z" fill-rule="evenodd"/></svg>',
        checkmark: '<svg width="24" height="24"><path d="M18.2 5.4a1 1 0 0 1 1.6 1.2l-8 12a1 1 0 0 1-1.5.1l-5-5a1 1 0 1 1 1.4-1.4l4.1 4.1 7.4-11z" fill-rule="nonzero"/></svg>',
        'chevron-down': '<svg width="10" height="10"><path d="M8.7 2.2c.3-.3.8-.3 1 0 .4.4.4.9 0 1.2L5.7 7.8c-.3.3-.9.3-1.2 0L.2 3.4a.8.8 0 0 1 0-1.2c.3-.3.8-.3 1.1 0L5 6l3.7-3.8z" fill-rule="nonzero"/></svg>',
        'chevron-left': '<svg width="10" height="10"><path d="M7.8 1.3L4 5l3.8 3.7c.3.3.3.8 0 1-.4.4-.9.4-1.2 0L2.2 5.7a.8.8 0 0 1 0-1.2L6.6.2C7 0 7.4 0 7.8.2c.3.3.3.8 0 1.1z" fill-rule="nonzero"/></svg>',
        'chevron-right': '<svg width="10" height="10"><path d="M2.2 1.3a.8.8 0 0 1 0-1c.4-.4.9-.4 1.2 0l4.4 4.1c.3.4.3.9 0 1.2L3.4 9.8c-.3.3-.8.3-1.2 0a.8.8 0 0 1 0-1.1L6 5 2.2 1.3z" fill-rule="nonzero"/></svg>',
        'chevron-up': '<svg width="10" height="10"><path d="M8.7 7.8L5 4 1.3 7.8c-.3.3-.8.3-1 0a.8.8 0 0 1 0-1.2l4.1-4.4c.3-.3.9-.3 1.2 0l4.2 4.4c.3.3.3.9 0 1.2-.3.3-.8.3-1.1 0z" fill-rule="nonzero"/></svg>',
        close: '<svg width="24" height="24"><path d="M17.3 8.2L13.4 12l3.9 3.8a1 1 0 0 1-1.5 1.5L12 13.4l-3.8 3.9a1 1 0 0 1-1.5-1.5l3.9-3.8-3.9-3.8a1 1 0 0 1 1.5-1.5l3.8 3.9 3.8-3.9a1 1 0 0 1 1.5 1.5z" fill-rule="evenodd"/></svg>',
        'code-sample': '<svg width="24" height="26"><path d="M7.1 11a2.8 2.8 0 0 1-.8 2 2.8 2.8 0 0 1 .8 2v1.7c0 .3.1.6.4.8.2.3.5.4.8.4.3 0 .4.2.4.4v.8c0 .2-.1.4-.4.4-.7 0-1.4-.3-2-.8-.5-.6-.8-1.3-.8-2V15c0-.3-.1-.6-.4-.8-.2-.3-.5-.4-.8-.4a.4.4 0 0 1-.4-.4v-.8c0-.2.2-.4.4-.4.3 0 .6-.1.8-.4.3-.2.4-.5.4-.8V9.3c0-.7.3-1.4.8-2 .6-.5 1.3-.8 2-.8.3 0 .4.2.4.4v.8c0 .2-.1.4-.4.4-.3 0-.6.1-.8.4-.3.2-.4.5-.4.8V11zm9.8 0V9.3c0-.3-.1-.6-.4-.8-.2-.3-.5-.4-.8-.4a.4.4 0 0 1-.4-.4V7c0-.2.1-.4.4-.4.7 0 1.4.3 2 .8.5.6.8 1.3.8 2V11c0 .3.1.6.4.8.2.3.5.4.8.4.2 0 .4.2.4.4v.8c0 .2-.2.4-.4.4-.3 0-.6.1-.8.4-.3.2-.4.5-.4.8v1.7c0 .7-.3 1.4-.8 2-.6.5-1.3.8-2 .8a.4.4 0 0 1-.4-.4v-.8c0-.2.1-.4.4-.4.3 0 .6-.1.8-.4.3-.2.4-.5.4-.8V15a2.8 2.8 0 0 1 .8-2 2.8 2.8 0 0 1-.8-2zm-3.3-.4c0 .4-.1.8-.5 1.1-.3.3-.7.5-1.1.5-.4 0-.8-.2-1.1-.5-.4-.3-.5-.7-.5-1.1 0-.5.1-.9.5-1.2.3-.3.7-.4 1.1-.4.4 0 .8.1 1.1.4.4.3.5.7.5 1.2zM12 13c.4 0 .8.1 1.1.5.4.3.5.7.5 1.1 0 1-.1 1.6-.5 2a3 3 0 0 1-1.1 1c-.4.3-.8.4-1.1.4a.5.5 0 0 1-.5-.5V17a3 3 0 0 0 1-.2l.6-.6c-.6 0-1-.2-1.3-.5-.2-.3-.3-.7-.3-1 0-.5.1-1 .5-1.2.3-.4.7-.5 1.1-.5z" fill-rule="evenodd"/></svg>',
        'color-levels': '<svg width="24" height="24"><path d="M17.5 11.4A9 9 0 0 1 18 14c0 .5 0 1-.2 1.4 0 .4-.3.9-.5 1.3a6.2 6.2 0 0 1-3.7 3 5.7 5.7 0 0 1-3.2 0A5.9 5.9 0 0 1 7.6 18a6.2 6.2 0 0 1-1.4-2.6 6.7 6.7 0 0 1 0-2.8c0-.4.1-.9.3-1.3a13.6 13.6 0 0 1 2.3-4A20 20 0 0 1 12 4a26.4 26.4 0 0 1 3.2 3.4 18.2 18.2 0 0 1 2.3 4zm-2 4.5c.4-.7.5-1.4.5-2a7.3 7.3 0 0 0-1-3.2c.2.6.2 1.2.2 1.9a4.5 4.5 0 0 1-1.3 3 5.3 5.3 0 0 1-2.3 1.5 4.9 4.9 0 0 1-2 .1 4.3 4.3 0 0 0 2.4.8 4 4 0 0 0 2-.6 4 4 0 0 0 1.5-1.5z" fill-rule="evenodd"/></svg>',
        'color-picker': '<svg width="24" height="24"><path d="M12 3a9 9 0 0 0 0 18 1.5 1.5 0 0 0 1.1-2.5c-.2-.3-.4-.6-.4-1 0-.8.7-1.5 1.5-1.5H16a5 5 0 0 0 5-5c0-4.4-4-8-9-8zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill-rule="nonzero"/></svg>',
        'color-swatch-remove-color': '<svg width="24" height="24"><path stroke="#000" stroke-width="2" d="M21 3L3 21" fill-rule="evenodd"/></svg>',
        'color-swatch': '<svg width="24" height="24"><rect x="3" y="3" width="18" height="18" rx="1" fill-rule="evenodd"/></svg>',
        comment: '<svg width="24" height="24"><path d="M9 19l3-2h7c.6 0 1-.4 1-1V6c0-.6-.4-1-1-1H5a1 1 0 0 0-1 1v10c0 .6.4 1 1 1h4v2zm-2 4v-4H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-6.4L7 23z" fill-rule="nonzero"/></svg>',
        contrast: '<svg width="24" height="24"><path d="M12 4a7.8 7.8 0 0 1 5.7 2.3A8 8 0 1 1 12 4zm-6 8a6 6 0 0 0 6 6V6a6 6 0 0 0-6 6z" fill-rule="evenodd"/></svg>',
        copy: '<svg width="24" height="24"><path d="M16 3H6a2 2 0 0 0-2 2v11h2V5h10V3zm1 4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2V9c0-1.2.9-2 2-2h7zm0 12V9h-7v10h7z" fill-rule="nonzero"/></svg>',
        crop: '<svg width="24" height="24"><path d="M17 8v7h2c.6 0 1 .4 1 1s-.4 1-1 1h-2v2c0 .6-.4 1-1 1a1 1 0 0 1-1-1v-2H7V9H5a1 1 0 1 1 0-2h2V5c0-.6.4-1 1-1s1 .4 1 1v2h7l3-3 1 1-3 3zM9 9v5l5-5H9zm1 6h5v-5l-5 5z" fill-rule="evenodd"/></svg>',
        cut: '<svg width="24" height="24"><path d="M18 15c.6.7 1 1.4 1 2.3 0 .8-.2 1.5-.7 2l-.8.5-1 .2c-.4 0-.8 0-1.2-.3a3.9 3.9 0 0 1-2.1-2.2c-.2-.5-.3-1-.2-1.5l-1-1-1 1c0 .5 0 1-.2 1.5-.1.5-.4 1-.9 1.4-.3.4-.7.6-1.2.8l-1.2.3c-.4 0-.7 0-1-.2-.3 0-.6-.3-.8-.5-.5-.5-.8-1.2-.7-2 0-.9.4-1.6 1-2.2A3.7 3.7 0 0 1 8.6 14H9l1-1-4-4-.5-1a3.3 3.3 0 0 1 0-2c0-.4.3-.7.5-1l6 6 6-6 .5 1a3.3 3.3 0 0 1 0 2c0 .4-.3.7-.5 1l-4 4 1 1h.5c.4 0 .8 0 1.2.3.5.2.9.4 1.2.8zm-8.5 2.2l.1-.4v-.3-.4a1 1 0 0 0-.2-.5 1 1 0 0 0-.4-.2 1.6 1.6 0 0 0-.8 0 2.6 2.6 0 0 0-.8.3 2.5 2.5 0 0 0-.9 1.1l-.1.4v.7l.2.5.5.2h.7a2.5 2.5 0 0 0 .8-.3 2.8 2.8 0 0 0 1-1zm2.5-2.8c.4 0 .7-.1 1-.4.3-.3.4-.6.4-1s-.1-.7-.4-1c-.3-.3-.6-.4-1-.4s-.7.1-1 .4c-.3.3-.4.6-.4 1s.1.7.4 1c.3.3.6.4 1 .4zm5.4 4l.2-.5v-.4-.3a2.6 2.6 0 0 0-.3-.8 2.4 2.4 0 0 0-.7-.7 2.5 2.5 0 0 0-.8-.3 1.5 1.5 0 0 0-.8 0 1 1 0 0 0-.4.2 1 1 0 0 0-.2.5 1.5 1.5 0 0 0 0 .7v.4l.3.4.3.4a2.8 2.8 0 0 0 .8.5l.4.1h.7l.5-.2z" fill-rule="evenodd"/></svg>',
        'document-properties': '<svg width="24" height="24"><path d="M14.4 3H7a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h10a2 2 0 0 0 2-2V7.6L14.4 3zM17 19H7V5h6v4h4v10z" fill-rule="nonzero"/></svg>',
        drag: '<svg width="24" height="24"><path d="M13 5h2v2h-2V5zm0 4h2v2h-2V9zM9 9h2v2H9V9zm4 4h2v2h-2v-2zm-4 0h2v2H9v-2zm0 4h2v2H9v-2zm4 0h2v2h-2v-2zM9 5h2v2H9V5z" fill-rule="evenodd"/></svg>',
        duplicate: '<svg width="24" height="24"><g fill-rule="nonzero"><path d="M16 3v2H6v11H4V5c0-1.1.9-2 2-2h10zm3 8h-2V9h-7v10h9a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2V9c0-1.2.9-2 2-2h7a2 2 0 0 1 2 2v2z"/><path d="M17 14h1a1 1 0 0 1 0 2h-1v1a1 1 0 0 1-2 0v-1h-1a1 1 0 0 1 0-2h1v-1a1 1 0 0 1 2 0v1z"/></g></svg>',
        'edit-image': '<svg width="24" height="24"><path d="M18 16h2V7a2 2 0 0 0-2-2H7v2h11v9zM6 17h15a1 1 0 0 1 0 2h-1v1a1 1 0 0 1-2 0v-1H6a2 2 0 0 1-2-2V7H3a1 1 0 1 1 0-2h1V4a1 1 0 1 1 2 0v13zm3-5.3l1.3 2 3-4.7 3.7 6H7l2-3.3z" fill-rule="nonzero"/></svg>',
        'embed-page': '<svg width="24" height="24"><path d="M19 6V5H5v14h2A13 13 0 0 1 19 6zm0 1.4c-.8.8-1.6 2.4-2.2 4.6H19V7.4zm0 5.6h-2.4c-.4 1.8-.6 3.8-.6 6h3v-6zm-4 6c0-2.2.2-4.2.6-6H13c-.7 1.8-1.1 3.8-1.1 6h3zm-4 0c0-2.2.4-4.2 1-6H9.6A12 12 0 0 0 8 19h3zM4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1zm11.8 9c.4-1.9 1-3.4 1.8-4.5a9.2 9.2 0 0 0-4 4.5h2.2zm-3.4 0a12 12 0 0 1 2.8-4 12 12 0 0 0-5 4h2.2z" fill-rule="nonzero"/></svg>',
        embed: '<svg width="24" height="24"><path d="M4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1zm1 2v14h14V5H5zm4.8 2.6l5.6 4a.5.5 0 0 1 0 .8l-5.6 4A.5.5 0 0 1 9 16V8a.5.5 0 0 1 .8-.4z" fill-rule="nonzero"/></svg>',
        emoji: '<svg width="24" height="24"><path d="M9 11c.6 0 1-.4 1-1s-.4-1-1-1a1 1 0 0 0-1 1c0 .6.4 1 1 1zm6 0c.6 0 1-.4 1-1s-.4-1-1-1a1 1 0 0 0-1 1c0 .6.4 1 1 1zm-3 5.5c2.1 0 4-1.5 4.4-3.5H7.6c.5 2 2.3 3.5 4.4 3.5zM12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z" fill-rule="nonzero"/></svg>',
        fill: '<svg width="24" height="26"><path d="M16.6 12l-9-9-1.4 1.4 2.4 2.4-5.2 5.1c-.5.6-.5 1.6 0 2.2L9 19.6a1.5 1.5 0 0 0 2.2 0l5.5-5.5c.5-.6.5-1.6 0-2.2zM5.2 13L10 8.2l4.8 4.8H5.2zM19 14.5s-2 2.2-2 3.5c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.3-2-3.5-2-3.5z" fill-rule="nonzero"/></svg>',
        'flip-horizontally': '<svg width="24" height="24"><path d="M14 19h2v-2h-2v2zm4-8h2V9h-2v2zM4 7v10c0 1.1.9 2 2 2h3v-2H6V7h3V5H6a2 2 0 0 0-2 2zm14-2v2h2a2 2 0 0 0-2-2zm-7 16h2V3h-2v18zm7-6h2v-2h-2v2zm-4-8h2V5h-2v2zm4 12a2 2 0 0 0 2-2h-2v2z" fill-rule="nonzero"/></svg>',
        'flip-vertically': '<svg width="24" height="24"><path d="M5 14v2h2v-2H5zm8 4v2h2v-2h-2zm4-14H7a2 2 0 0 0-2 2v3h2V6h10v3h2V6a2 2 0 0 0-2-2zm2 14h-2v2a2 2 0 0 0 2-2zM3 11v2h18v-2H3zm6 7v2h2v-2H9zm8-4v2h2v-2h-2zM5 18c0 1.1.9 2 2 2v-2H5z" fill-rule="nonzero"/></svg>',
        'format-painter': '<svg width="24" height="24"><path d="M18 5V4c0-.5-.4-1-1-1H5a1 1 0 0 0-1 1v4c0 .6.5 1 1 1h12c.6 0 1-.4 1-1V7h1v4H9v9c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-7h8V5h-3z" fill-rule="nonzero"/></svg>',
        fullscreen: '<svg width="24" height="24"><path d="M15.3 10l-1.2-1.3 2.9-3h-2.3a.9.9 0 1 1 0-1.7H19c.5 0 .9.4.9.9v4.4a.9.9 0 1 1-1.8 0V7l-2.9 3zm0 4l3 3v-2.3a.9.9 0 1 1 1.7 0V19c0 .5-.4.9-.9.9h-4.4a.9.9 0 1 1 0-1.8H17l-3-2.9 1.3-1.2zM10 15.4l-2.9 3h2.3a.9.9 0 1 1 0 1.7H5a.9.9 0 0 1-.9-.9v-4.4a.9.9 0 1 1 1.8 0V17l2.9-3 1.2 1.3zM8.7 10L5.7 7v2.3a.9.9 0 0 1-1.7 0V5c0-.5.4-.9.9-.9h4.4a.9.9 0 0 1 0 1.8H7l3 2.9-1.3 1.2z" fill-rule="nonzero"/></svg>',
        gamma: '<svg width="24" height="24"><path d="M4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1zm1 2v14h14V5H5zm6.5 11.8V14L9.2 8.7a5.1 5.1 0 0 0-.4-.8l-.1-.2H8 8v-1l.3-.1.3-.1h.7a1 1 0 0 1 .6.5l.1.3a8.5 8.5 0 0 1 .3.6l1.9 4.6 2-5.2a1 1 0 0 1 1-.6.5.5 0 0 1 .5.6L13 14v2.8a.7.7 0 0 1-1.4 0z" fill-rule="nonzero"/></svg>',
        help: '<svg width="24" height="24"><g fill-rule="evenodd"><path d="M12 5.5a6.5 6.5 0 0 0-6 9 6.3 6.3 0 0 0 1.4 2l1 1a6.3 6.3 0 0 0 3.6 1 6.5 6.5 0 0 0 6-9 6.3 6.3 0 0 0-1.4-2l-1-1a6.3 6.3 0 0 0-3.6-1zM12 4a7.8 7.8 0 0 1 5.7 2.3A8 8 0 1 1 12 4z"/><path d="M9.6 9.7a.7.7 0 0 1-.7-.8c0-1.1 1.5-1.8 3.2-1.8 1.8 0 3.2.8 3.2 2.4 0 1.4-.4 2.1-1.5 2.8-.2 0-.3.1-.3.2a2 2 0 0 0-.8.8.8.8 0 0 1-1.4-.6c.3-.7.8-1 1.3-1.5l.4-.2c.7-.4.8-.6.8-1.5 0-.5-.6-.9-1.7-.9-.5 0-1 .1-1.4.3-.2 0-.3.1-.3.2v-.2c0 .4-.4.8-.8.8z" fill-rule="nonzero"/><circle cx="12" cy="16" r="1"/></g></svg>',
        'highlight-bg-color': '<svg width="24" height="24"><g fill-rule="evenodd"><path id="tox-icon-highlight-bg-color__color" d="M3 18h18v3H3z"/><path fill-rule="nonzero" d="M7.7 16.7H3l3.3-3.3-.7-.8L10.2 8l4 4.1-4 4.2c-.2.2-.6.2-.8 0l-.6-.7-1.1 1.1zm5-7.5L11 7.4l3-2.9a2 2 0 0 1 2.6 0L18 6c.7.7.7 2 0 2.7l-2.9 2.9-1.8-1.8-.5-.6"/></g></svg>',
        home: '<svg width="24" height="24"><path fill-rule="nonzero" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
        'horizontal-rule': '<svg width="24" height="24"><path d="M4 11h16v2H4z" fill-rule="evenodd"/></svg>',
        'image-options': '<svg width="24" height="24"><path d="M6 10a2 2 0 0 0-2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2 2 2 0 0 0-2-2zm12 0a2 2 0 0 0-2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2 2 2 0 0 0-2-2zm-6 0a2 2 0 0 0-2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2 2 2 0 0 0-2-2z" fill-rule="nonzero"/></svg>',
        image: '<svg width="24" height="24"><path d="M5 15.7l3.3-3.2c.3-.3.7-.3 1 0L12 15l4.1-4c.3-.4.8-.4 1 0l2 1.9V5H5v10.7zM5 18V19h3l2.8-2.9-2-2L5 17.9zm14-3l-2.5-2.4-6.4 6.5H19v-4zM4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1zm6 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill-rule="nonzero"/></svg>',
        indent: '<svg width="24" height="24"><path d="M7 5h12c.6 0 1 .4 1 1s-.4 1-1 1H7a1 1 0 1 1 0-2zm5 4h7c.6 0 1 .4 1 1s-.4 1-1 1h-7a1 1 0 0 1 0-2zm0 4h7c.6 0 1 .4 1 1s-.4 1-1 1h-7a1 1 0 0 1 0-2zm-5 4h12a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm-2.6-3.8L6.2 12l-1.8-1.2a1 1 0 0 1 1.2-1.6l3 2a1 1 0 0 1 0 1.6l-3 2a1 1 0 1 1-1.2-1.6z" fill-rule="evenodd"/></svg>',
        indeterminate: '<svg width="24" height="24"><path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM9 11a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2H9z" fill-rule="evenodd"/></svg>',
        info: '<svg width="24" height="24"><path d="M12 4a7.8 7.8 0 0 1 5.7 2.3A8 8 0 1 1 12 4zm-1 3v2h2V7h-2zm3 10v-1h-1v-5h-3v1h1v4h-1v1h4z" fill-rule="evenodd"/></svg>',
        'insert-character': '<svg width="24" height="24"><path d="M15 18h4l1-2v4h-6v-3.3l1.4-1a6 6 0 0 0 1.8-2.9 6.3 6.3 0 0 0-.1-4.1 5.8 5.8 0 0 0-3-3.2c-.6-.3-1.3-.5-2.1-.5a5.1 5.1 0 0 0-3.9 1.8 6.3 6.3 0 0 0-1.3 6 6.2 6.2 0 0 0 1.8 3l1.4.9V20H4v-4l1 2h4v-.5l-2-1L5.4 15A6.5 6.5 0 0 1 4 11c0-1 .2-1.9.6-2.7A7 7 0 0 1 6.3 6C7.1 5.4 8 5 9 4.5c1-.3 2-.5 3.1-.5a8.8 8.8 0 0 1 5.7 2 7 7 0 0 1 1.7 2.3 6 6 0 0 1 .2 4.8c-.2.7-.6 1.3-1 1.9a7.6 7.6 0 0 1-3.6 2.5v.5z" fill-rule="evenodd"/></svg>',
        'insert-time': '<svg width="24" height="24"><g fill-rule="nonzero"><path d="M19 2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3zm-7 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/><path d="M15 12h-3V7a.5.5 0 0 0-1 0v6h4a.5.5 0 0 0 0-1z"/></g></svg>',
        invert: '<svg width="24" height="24"><path d="M18 19.3L16.5 18a5.8 5.8 0 0 1-3.1 1.9 6.1 6.1 0 0 1-5.5-1.6A5.8 5.8 0 0 1 6 14v-.3l.1-1.2A13.9 13.9 0 0 1 7.7 9l-3-3 .7-.8 2.8 2.9 9 8.9 1.5 1.6-.7.6zm0-5.5v.3l-.1 1.1-.4 1-1.2-1.2a4.3 4.3 0 0 0 .2-1v-.2c0-.4 0-.8-.2-1.3l-.5-1.4a14.8 14.8 0 0 0-3-4.2L12 6a26.1 26.1 0 0 0-2.2 2.5l-1-1a20.9 20.9 0 0 1 2.9-3.3L12 4l1 .8a22.2 22.2 0 0 1 4 5.4c.6 1.2 1 2.4 1 3.6z" fill-rule="evenodd"/></svg>',
        italic: '<svg width="24" height="24"><path d="M16.7 4.7l-.1.9h-.3c-.6 0-1 0-1.4.3-.3.3-.4.6-.5 1.1l-2.1 9.8v.6c0 .5.4.8 1.4.8h.2l-.2.8H8l.2-.8h.2c1.1 0 1.8-.5 2-1.5l2-9.8.1-.5c0-.6-.4-.8-1.4-.8h-.3l.2-.9h5.8z" fill-rule="evenodd"/></svg>',
        line: '<svg width="24" height="24"><path d="M15 9l-8 8H4v-3l8-8 3 3zm1-1l-3-3 1-1h1c-.2 0 0 0 0 0l2 2s0 .2 0 0v1l-1 1zM4 18h16v2H4v-2z" fill-rule="evenodd"/></svg>',
        link: '<svg width="24" height="24"><path d="M6.2 12.3a1 1 0 0 1 1.4 1.4l-2.1 2a2 2 0 1 0 2.7 2.8l4.8-4.8a1 1 0 0 0 0-1.4 1 1 0 1 1 1.4-1.3 2.9 2.9 0 0 1 0 4L9.6 20a3.9 3.9 0 0 1-5.5-5.5l2-2zm11.6-.6a1 1 0 0 1-1.4-1.4l2-2a2 2 0 1 0-2.6-2.8L11 10.3a1 1 0 0 0 0 1.4A1 1 0 1 1 9.6 13a2.9 2.9 0 0 1 0-4L14.4 4a3.9 3.9 0 0 1 5.5 5.5l-2 2z" fill-rule="nonzero"/></svg>',
        'list-bull-circle': '<svg width="48" height="48"><g fill-rule="evenodd"><path d="M11 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 1a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM11 26a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 1a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM11 36a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 1a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" fill-rule="nonzero"/><path opacity=".2" d="M18 12h22v4H18zM18 22h22v4H18zM18 32h22v4H18z"/></g></svg>',
        'list-bull-default': '<svg width="48" height="48"><g fill-rule="evenodd"><circle cx="11" cy="14" r="3"/><circle cx="11" cy="24" r="3"/><circle cx="11" cy="34" r="3"/><path opacity=".2" d="M18 12h22v4H18zM18 22h22v4H18zM18 32h22v4H18z"/></g></svg>',
        'list-bull-square': '<svg width="48" height="48"><g fill-rule="evenodd"><path d="M8 11h6v6H8zM8 21h6v6H8zM8 31h6v6H8z"/><path opacity=".2" d="M18 12h22v4H18zM18 22h22v4H18zM18 32h22v4H18z"/></g></svg>',
        'list-num-default': '<svg width="48" height="48"><g fill-rule="evenodd"><path opacity=".2" d="M18 12h22v4H18zM18 22h22v4H18zM18 32h22v4H18z"/><path d="M10 17v-4.8l-1.5 1v-1.1l1.6-1h1.2V17h-1.2zm3.6.1c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7.5 0 .7.3.7.7 0 .4-.2.7-.7.7zm-5 5.7c0-1.2.8-2 2.1-2s2.1.8 2.1 1.8c0 .7-.3 1.2-1.4 2.2l-1.1 1v.2h2.6v1H8.6v-.9l2-1.9c.8-.8 1-1.1 1-1.5 0-.5-.4-.8-1-.8-.5 0-.9.3-.9.9H8.5zm6.3 4.3c-.5 0-.7-.3-.7-.7 0-.4.2-.7.7-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7zM10 34.4v-1h.7c.6 0 1-.3 1-.8 0-.4-.4-.7-1-.7s-1 .3-1 .8H8.6c0-1.1 1-1.8 2.2-1.8 1.3 0 2.1.6 2.1 1.6 0 .7-.4 1.2-1 1.3v.1c.8.1 1.3.7 1.3 1.4 0 1-1 1.9-2.4 1.9-1.3 0-2.2-.8-2.3-2h1.2c0 .6.5 1 1.1 1 .7 0 1-.4 1-1 0-.5-.3-.8-1-.8h-.7zm4.7 2.7c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7.5 0 .8.3.8.7 0 .4-.3.7-.8.7z"/></g></svg>',
        'list-num-lower-alpha': '<svg width="48" height="48"><g fill-rule="evenodd"><path opacity=".2" d="M18 12h22v4H18zM18 22h22v4H18zM18 32h22v4H18z"/><path d="M10.3 15.2c.5 0 1-.4 1-.9V14h-1c-.5.1-.8.3-.8.6 0 .4.3.6.8.6zm-.4.9c-1 0-1.5-.6-1.5-1.4 0-.8.6-1.3 1.7-1.4h1.1v-.4c0-.4-.2-.6-.7-.6-.5 0-.8.1-.9.4h-1c0-.8.8-1.4 2-1.4 1.1 0 1.8.6 1.8 1.6V16h-1.1v-.6h-.1c-.2.4-.7.7-1.3.7zm4.6 0c-.5 0-.7-.3-.7-.7 0-.4.2-.7.7-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7zm-3.2 10c-.6 0-1.2-.3-1.4-.8v.7H8.5v-6.3H10v2.5c.3-.5.8-.9 1.4-.9 1.2 0 1.9 1 1.9 2.4 0 1.5-.7 2.4-1.9 2.4zm-.4-3.7c-.7 0-1 .5-1 1.3s.3 1.4 1 1.4c.6 0 1-.6 1-1.4 0-.8-.4-1.3-1-1.3zm4 3.7c-.5 0-.7-.3-.7-.7 0-.4.2-.7.7-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7zm-2.2 7h-1.2c0-.5-.4-.8-.9-.8-.6 0-1 .5-1 1.4 0 1 .4 1.4 1 1.4.5 0 .8-.2 1-.7h1c0 1-.8 1.7-2 1.7-1.4 0-2.2-.9-2.2-2.4s.8-2.4 2.2-2.4c1.2 0 2 .7 2 1.7zm1.8 3c-.5 0-.8-.3-.8-.7 0-.4.3-.7.8-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7z"/></g></svg>',
        'list-num-lower-greek': '<svg width="48" height="48"><g fill-rule="evenodd"><path opacity=".2" d="M18 12h22v4H18zM18 22h22v4H18zM18 32h22v4H18z"/><path d="M10.5 15c.7 0 1-.5 1-1.3s-.3-1.3-1-1.3c-.5 0-.9.5-.9 1.3s.4 1.4 1 1.4zm-.3 1c-1.1 0-1.8-.8-1.8-2.3 0-1.5.7-2.4 1.8-2.4.7 0 1.1.4 1.3 1h.1v-.9h1.2v3.2c0 .4.1.5.4.5h.2v.9h-.6c-.6 0-1-.2-1.1-.7h-.1c-.2.4-.7.8-1.4.8zm5 .1c-.5 0-.8-.3-.8-.7 0-.4.3-.7.7-.7.5 0 .8.3.8.7 0 .4-.3.7-.8.7zm-4.9 7v-1h.3c.6 0 1-.2 1-.7 0-.5-.4-.8-1-.8-.5 0-.8.3-.8 1v2.2c0 .8.4 1.3 1.1 1.3.6 0 1-.4 1-1s-.5-1-1.3-1h-.3zM8.6 22c0-1.5.7-2.3 2-2.3 1.2 0 2 .6 2 1.6 0 .6-.3 1-.8 1.3.8.3 1.3.8 1.3 1.7 0 1.2-.8 1.9-1.9 1.9-.6 0-1.1-.3-1.3-.8v2.2H8.5V22zm6.2 4.2c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7.5 0 .7.3.7.7 0 .4-.2.7-.7.7zm-4.5 8.5L8 30h1.4l1.7 3.5 1.7-3.5h1.1l-2.2 4.6v.1c.5.8.7 1.4.7 1.8 0 .4-.1.8-.4 1-.2.2-.6.3-1 .3-.9 0-1.3-.4-1.3-1.2 0-.5.2-1 .5-1.7l.1-.2zm.7 1a2 2 0 0 0-.4.9c0 .3.1.4.4.4.3 0 .4-.1.4-.4 0-.2-.1-.6-.4-1zm4.5.5c-.5 0-.8-.3-.8-.7 0-.4.3-.7.8-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7z"/></g></svg>',
        'list-num-lower-roman': '<svg width="48" height="48"><g fill-rule="evenodd"><path opacity=".2" d="M18 12h22v4H18zM18 22h22v4H18zM18 32h22v4H18z"/><path d="M15.1 16v-1.2h1.3V16H15zm0 10v-1.2h1.3V26H15zm0 10v-1.2h1.3V36H15z"/><path fill-rule="nonzero" d="M12 21h1.5v5H12zM12 31h1.5v5H12zM9 21h1.5v5H9zM9 31h1.5v5H9zM6 31h1.5v5H6zM12 11h1.5v5H12zM12 19h1.5v1H12zM12 29h1.5v1H12zM9 19h1.5v1H9zM9 29h1.5v1H9zM6 29h1.5v1H6zM12 9h1.5v1H12z"/></g></svg>',
        'list-num-upper-alpha': '<svg width="48" height="48"><g fill-rule="evenodd"><path opacity=".2" d="M18 12h22v4H18zM18 22h22v4H18zM18 32h22v4H18z"/><path d="M12.6 17l-.5-1.4h-2L9.5 17H8.3l2-6H12l2 6h-1.3zM11 12.3l-.7 2.3h1.6l-.8-2.3zm4.7 4.8c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7.5 0 .7.3.7.7 0 .4-.2.7-.7.7zM11.4 27H8.7v-6h2.6c1.2 0 1.9.6 1.9 1.5 0 .6-.5 1.2-1 1.3.7.1 1.3.7 1.3 1.5 0 1-.8 1.7-2 1.7zM10 22v1.5h1c.6 0 1-.3 1-.8 0-.4-.4-.7-1-.7h-1zm0 4H11c.7 0 1.1-.3 1.1-.8 0-.6-.4-.9-1.1-.9H10V26zm5.4 1.1c-.5 0-.8-.3-.8-.7 0-.4.3-.7.8-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7zm-4.1 10c-1.8 0-2.8-1.1-2.8-3.1s1-3.1 2.8-3.1c1.4 0 2.5.9 2.6 2.2h-1.3c0-.7-.6-1.1-1.3-1.1-1 0-1.6.7-1.6 2s.6 2 1.6 2c.7 0 1.2-.4 1.4-1h1.2c-.1 1.3-1.2 2.2-2.6 2.2zm4.5 0c-.5 0-.8-.3-.8-.7 0-.4.3-.7.8-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7z"/></g></svg>',
        'list-num-upper-roman': '<svg width="48" height="48"><g fill-rule="evenodd"><path opacity=".2" d="M18 12h22v4H18zM18 22h22v4H18zM18 32h22v4H18z"/><path d="M15.1 17v-1.2h1.3V17H15zm0 10v-1.2h1.3V27H15zm0 10v-1.2h1.3V37H15z"/><path fill-rule="nonzero" d="M12 20h1.5v7H12zM12 30h1.5v7H12zM9 20h1.5v7H9zM9 30h1.5v7H9zM6 30h1.5v7H6zM12 10h1.5v7H12z"/></g></svg>',
        lock: '<svg width="24" height="24"><path d="M16.3 11c.2 0 .3 0 .5.2l.2.6v7.4c0 .3 0 .4-.2.6l-.6.2H7.8c-.3 0-.4 0-.6-.2a.7.7 0 0 1-.2-.6v-7.4c0-.3 0-.4.2-.6l.5-.2H8V8c0-.8.3-1.5.9-2.1.6-.6 1.3-.9 2.1-.9h2c.8 0 1.5.3 2.1.9.6.6.9 1.3.9 2.1v3h.3zM10 8v3h4V8a1 1 0 0 0-.3-.7A1 1 0 0 0 13 7h-2a1 1 0 0 0-.7.3 1 1 0 0 0-.3.7z" fill-rule="evenodd"/></svg>',
        ltr: '<svg width="24" height="24"><path d="M11 5h7a1 1 0 0 1 0 2h-1v11a1 1 0 0 1-2 0V7h-2v11a1 1 0 0 1-2 0v-6c-.5 0-1 0-1.4-.3A3.4 3.4 0 0 1 7.8 10a3.3 3.3 0 0 1 0-2.8 3.4 3.4 0 0 1 1.8-1.8L11 5zM4.4 16.2L6.2 15l-1.8-1.2a1 1 0 0 1 1.2-1.6l3 2a1 1 0 0 1 0 1.6l-3 2a1 1 0 1 1-1.2-1.6z" fill-rule="evenodd"/></svg>',
        'new-document': '<svg width="24" height="24"><path d="M14.4 3H7a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h10a2 2 0 0 0 2-2V7.6L14.4 3zM17 19H7V5h6v4h4v10z" fill-rule="nonzero"/></svg>',
        'new-tab': '<svg width="24" height="24"><path d="M15 13l2-2v8H5V7h8l-2 2H7v8h8v-4zm4-8v5.5l-2-2-5.6 5.5H10v-1.4L15.5 7l-2-2H19z" fill-rule="evenodd"/></svg>',
        'non-breaking': '<svg width="24" height="24"><path d="M11 11H8a1 1 0 1 1 0-2h3V6c0-.6.4-1 1-1s1 .4 1 1v3h3c.6 0 1 .4 1 1s-.4 1-1 1h-3v3c0 .6-.4 1-1 1a1 1 0 0 1-1-1v-3zm10 4v5H3v-5c0-.6.4-1 1-1s1 .4 1 1v3h14v-3c0-.6.4-1 1-1s1 .4 1 1z" fill-rule="evenodd"/></svg>',
        notice: '<svg width="24" height="24"><path d="M17.8 9.8L15.4 4 20 8.5v7L15.5 20h-7L4 15.5v-7L8.5 4h7l2.3 5.8zm0 0l2.2 5.7-2.3-5.8zM13 17v-2h-2v2h2zm0-4V7h-2v6h2z" fill-rule="evenodd"/></svg>',
        'ordered-list': '<svg width="24" height="24"><path d="M10 17h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2zm0-6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2zm0-6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 1 1 0-2zM6 4v3.5c0 .3-.2.5-.5.5a.5.5 0 0 1-.5-.5V5h-.5a.5.5 0 0 1 0-1H6zm-1 8.8l.2.2h1.3c.3 0 .5.2.5.5s-.2.5-.5.5H4.9a1 1 0 0 1-.9-1V13c0-.4.3-.8.6-1l1.2-.4.2-.3a.2.2 0 0 0-.2-.2H4.5a.5.5 0 0 1-.5-.5c0-.3.2-.5.5-.5h1.6c.5 0 .9.4.9 1v.1c0 .4-.3.8-.6 1l-1.2.4-.2.3zM7 17v2c0 .6-.4 1-1 1H4.5a.5.5 0 0 1 0-1h1.2c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3H4.4a.4.4 0 1 1 0-.8h1.3c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3H4.5a.5.5 0 1 1 0-1H6c.6 0 1 .4 1 1z" fill-rule="evenodd"/></svg>',
        orientation: '<svg width="24" height="24"><path d="M7.3 6.4L1 13l6.4 6.5 6.5-6.5-6.5-6.5zM3.7 13l3.6-3.7L11 13l-3.7 3.7-3.6-3.7zM12 6l2.8 2.7c.3.3.3.8 0 1-.3.4-.9.4-1.2 0L9.2 5.7a.8.8 0 0 1 0-1.2L13.6.2c.3-.3.9-.3 1.2 0 .3.3.3.8 0 1.1L12 4h1a9 9 0 1 1-4.3 16.9l1.5-1.5A7 7 0 1 0 13 6h-1z" fill-rule="nonzero"/></svg>',
        outdent: '<svg width="24" height="24"><path d="M7 5h12c.6 0 1 .4 1 1s-.4 1-1 1H7a1 1 0 1 1 0-2zm5 4h7c.6 0 1 .4 1 1s-.4 1-1 1h-7a1 1 0 0 1 0-2zm0 4h7c.6 0 1 .4 1 1s-.4 1-1 1h-7a1 1 0 0 1 0-2zm-5 4h12a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm1.6-3.8a1 1 0 0 1-1.2 1.6l-3-2a1 1 0 0 1 0-1.6l3-2a1 1 0 0 1 1.2 1.6L6.8 12l1.8 1.2z" fill-rule="evenodd"/></svg>',
        'page-break': '<svg width="24" height="24"><g fill-rule="evenodd"><path d="M5 11c.6 0 1 .4 1 1s-.4 1-1 1a1 1 0 0 1 0-2zm3 0h1c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2zm4 0c.6 0 1 .4 1 1s-.4 1-1 1a1 1 0 0 1 0-2zm3 0h1c.6 0 1 .4 1 1s-.4 1-1 1h-1a1 1 0 0 1 0-2zm4 0c.6 0 1 .4 1 1s-.4 1-1 1a1 1 0 0 1 0-2zM7 3v5h10V3c0-.6.4-1 1-1s1 .4 1 1v7H5V3c0-.6.4-1 1-1s1 .4 1 1zM6 22a1 1 0 0 1-1-1v-7h14v7c0 .6-.4 1-1 1a1 1 0 0 1-1-1v-5H7v5c0 .6-.4 1-1 1z"/></g></svg>',
        paragraph: '<svg width="24" height="24"><path d="M10 5h7a1 1 0 0 1 0 2h-1v11a1 1 0 0 1-2 0V7h-2v11a1 1 0 0 1-2 0v-6c-.5 0-1 0-1.4-.3A3.4 3.4 0 0 1 6.8 10a3.3 3.3 0 0 1 0-2.8 3.4 3.4 0 0 1 1.8-1.8L10 5z" fill-rule="evenodd"/></svg>',
        'paste-text': '<svg width="24" height="24"><path d="M18 9V5h-2v1c0 .6-.4 1-1 1H9a1 1 0 0 1-1-1V5H6v13h3V9h9zM9 20H6a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.2A3 3 0 0 1 12 1a3 3 0 0 1 2.8 2H18a2 2 0 0 1 2 2v4h1v12H9v-1zm1.5-9.5v9h9v-9h-9zM12 3a1 1 0 0 0-1 1c0 .5.4 1 1 1s1-.5 1-1-.4-1-1-1zm0 9h6v2h-.5l-.5-1h-1v4h.8v1h-3.6v-1h.8v-4h-1l-.5 1H12v-2z" fill-rule="nonzero"/></svg>',
        paste: '<svg width="24" height="24"><path d="M18 9V5h-2v1c0 .6-.4 1-1 1H9a1 1 0 0 1-1-1V5H6v13h3V9h9zM9 20H6a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.2A3 3 0 0 1 12 1a3 3 0 0 1 2.8 2H18a2 2 0 0 1 2 2v4h1v12H9v-1zm1.5-9.5v9h9v-9h-9zM12 3a1 1 0 0 0-1 1c0 .5.4 1 1 1s1-.5 1-1-.4-1-1-1z" fill-rule="nonzero"/></svg>',
        'permanent-pen': '<svg width="24" height="24"><path d="M10.5 17.5L8 20H3v-3l3.5-3.5a2 2 0 0 1 0-3L14 3l1 1-7.3 7.3a1 1 0 0 0 0 1.4l3.6 3.6c.4.4 1 .4 1.4 0L20 9l1 1-7.6 7.6a2 2 0 0 1-2.8 0l-.1-.1z" fill-rule="nonzero"/></svg>',
        plus: '<svg width="24" height="24"><g fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke="#000" stroke-width="2"><path d="M12 5v14M5 12h14"/></g></svg>',
        preferences: '<svg width="24" height="24"><path d="M20.1 13.5l-1.9.2a5.8 5.8 0 0 1-.6 1.5l1.2 1.5c.4.4.3 1 0 1.4l-.7.7a1 1 0 0 1-1.4 0l-1.5-1.2a6.2 6.2 0 0 1-1.5.6l-.2 1.9c0 .5-.5.9-1 .9h-1a1 1 0 0 1-1-.9l-.2-1.9a5.8 5.8 0 0 1-1.5-.6l-1.5 1.2a1 1 0 0 1-1.4 0l-.7-.7a1 1 0 0 1 0-1.4l1.2-1.5a6.2 6.2 0 0 1-.6-1.5l-1.9-.2a1 1 0 0 1-.9-1v-1c0-.5.4-1 .9-1l1.9-.2a5.8 5.8 0 0 1 .6-1.5L5.2 7.3a1 1 0 0 1 0-1.4l.7-.7a1 1 0 0 1 1.4 0l1.5 1.2a6.2 6.2 0 0 1 1.5-.6l.2-1.9c0-.5.5-.9 1-.9h1c.5 0 1 .4 1 .9l.2 1.9a5.8 5.8 0 0 1 1.5.6l1.5-1.2a1 1 0 0 1 1.4 0l.7.7c.3.4.4 1 0 1.4l-1.2 1.5a6.2 6.2 0 0 1 .6 1.5l1.9.2c.5 0 .9.5.9 1v1c0 .5-.4 1-.9 1zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill-rule="evenodd"/></svg>',
        preview: '<svg width="24" height="24"><path d="M3.5 12.5c.5.8 1.1 1.6 1.8 2.3 2 2 4.2 3.2 6.7 3.2s4.7-1.2 6.7-3.2a16.2 16.2 0 0 0 2.1-2.8 15.7 15.7 0 0 0-2.1-2.8c-2-2-4.2-3.2-6.7-3.2a9.3 9.3 0 0 0-6.7 3.2A16.2 16.2 0 0 0 3.2 12c0 .2.2.3.3.5zm-2.4-1l.7-1.2L4 7.8C6.2 5.4 8.9 4 12 4c3 0 5.8 1.4 8.1 3.8a18.2 18.2 0 0 1 2.8 3.7v1l-.7 1.2-2.1 2.5c-2.3 2.4-5 3.8-8.1 3.8-3 0-5.8-1.4-8.1-3.8a18.2 18.2 0 0 1-2.8-3.7 1 1 0 0 1 0-1zm12-3.3a2 2 0 1 0 2.7 2.6 4 4 0 1 1-2.6-2.6z" fill-rule="nonzero"/></svg>',
        print: '<svg width="24" height="24"><path d="M18 8H6a3 3 0 0 0-3 3v6h2v3h14v-3h2v-6a3 3 0 0 0-3-3zm-1 10H7v-4h10v4zm.5-5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm.5-8H6v2h12V5z" fill-rule="nonzero"/></svg>',
        quote: '<svg width="24" height="24"><path d="M7.5 17h.9c.4 0 .7-.2.9-.6L11 13V8c0-.6-.4-1-1-1H6a1 1 0 0 0-1 1v4c0 .6.4 1 1 1h2l-1.3 2.7a1 1 0 0 0 .8 1.3zm8 0h.9c.4 0 .7-.2.9-.6L19 13V8c0-.6-.4-1-1-1h-4a1 1 0 0 0-1 1v4c0 .6.4 1 1 1h2l-1.3 2.7a1 1 0 0 0 .8 1.3z" fill-rule="nonzero"/></svg>',
        redo: '<svg width="24" height="24"><path d="M17.6 10H12c-2.8 0-4.4 1.4-4.9 3.5-.4 2 .3 4 1.4 4.6a1 1 0 1 1-1 1.8c-2-1.2-2.9-4.1-2.3-6.8.6-3 3-5.1 6.8-5.1h5.6l-3.3-3.3a1 1 0 1 1 1.4-1.4l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4l3.3-3.3z" fill-rule="nonzero"/></svg>',
        reload: '<svg width="24" height="24"><g fill-rule="nonzero"><path d="M5 22.1l-1.2-4.7v-.2a1 1 0 0 1 1-1l5 .4a1 1 0 1 1-.2 2l-2.2-.2a7.8 7.8 0 0 0 8.4.2 7.5 7.5 0 0 0 3.5-6.4 1 1 0 1 1 2 0 9.5 9.5 0 0 1-4.5 8 9.9 9.9 0 0 1-10.2 0l.4 1.4a1 1 0 1 1-2 .5zM13.6 7.4c0-.5.5-1 1-.9l2.8.2a8 8 0 0 0-9.5-1 7.5 7.5 0 0 0-3.6 7 1 1 0 0 1-2 0 9.5 9.5 0 0 1 4.5-8.6 10 10 0 0 1 10.9.3l-.3-1a1 1 0 0 1 2-.5l1.1 4.8a1 1 0 0 1-1 1.2l-5-.4a1 1 0 0 1-.9-1z"/></g></svg>',
        'remove-formatting': '<svg width="24" height="24"><path d="M13.2 6a1 1 0 0 1 0 .2l-2.6 10a1 1 0 0 1-1 .8h-.2a.8.8 0 0 1-.8-1l2.6-10H8a1 1 0 1 1 0-2h9a1 1 0 0 1 0 2h-3.8zM5 18h7a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2zm13 1.5L16.5 18 15 19.5a.7.7 0 0 1-1-1l1.5-1.5-1.5-1.5a.7.7 0 0 1 1-1l1.5 1.5 1.5-1.5a.7.7 0 0 1 1 1L17.5 17l1.5 1.5a.7.7 0 0 1-1 1z" fill-rule="evenodd"/></svg>',
        remove: '<svg width="24" height="24"><path d="M16 7h3a1 1 0 0 1 0 2h-1v9a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9H5a1 1 0 1 1 0-2h3V6a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v1zm-2 0V6c0-.6-.4-1-1-1h-2a1 1 0 0 0-1 1v1h4zm2 2H8v9c0 .6.4 1 1 1h6c.6 0 1-.4 1-1V9zm-7 3a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0v-4zm4 0a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0v-4z" fill-rule="nonzero"/></svg>',
        'resize-handle': '<svg width="10" height="10"><g fill-rule="nonzero"><path d="M8.1 1.1A.5.5 0 1 1 9 2l-7 7A.5.5 0 1 1 1 8l7-7zM8.1 5.1A.5.5 0 1 1 9 6l-3 3A.5.5 0 1 1 5 8l3-3z"/></g></svg>',
        resize: '<svg width="24" height="24"><path d="M4 5c0-.3.1-.5.3-.7.2-.2.4-.3.7-.3h6c.3 0 .5.1.7.3.2.2.3.4.3.7 0 .3-.1.5-.3.7a1 1 0 0 1-.7.3H7.4L18 16.6V13c0-.3.1-.5.3-.7.2-.2.4-.3.7-.3.3 0 .5.1.7.3.2.2.3.4.3.7v6c0 .3-.1.5-.3.7a1 1 0 0 1-.7.3h-6a1 1 0 0 1-.7-.3 1 1 0 0 1-.3-.7c0-.3.1-.5.3-.7.2-.2.4-.3.7-.3h3.6L6 7.4V11c0 .3-.1.5-.3.7a1 1 0 0 1-.7.3 1 1 0 0 1-.7-.3A1 1 0 0 1 4 11V5z" fill-rule="evenodd"/></svg>',
        'restore-draft': '<svg width="24" height="24"><g fill-rule="evenodd"><path d="M17 13c0 .6-.4 1-1 1h-4V8c0-.6.4-1 1-1s1 .4 1 1v4h2c.6 0 1 .4 1 1z"/><path d="M4.7 10H9a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1V5a1 1 0 1 1 2 0v3l2.5-2.4a9.2 9.2 0 0 1 10.8-1.5A9 9 0 0 1 13.4 21c-2.4.1-4.7-.7-6.5-2.2a1 1 0 1 1 1.3-1.5 7.2 7.2 0 0 0 11.6-3.7 7 7 0 0 0-3.5-7.7A7.2 7.2 0 0 0 8 7L4.7 10z" fill-rule="nonzero"/></g></svg>',
        'rotate-left': '<svg width="24" height="24"><path d="M4.7 10H9a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1V5a1 1 0 1 1 2 0v3l2.5-2.4a9.2 9.2 0 0 1 10.8-1.5A9 9 0 0 1 13.4 21c-2.4.1-4.7-.7-6.5-2.2a1 1 0 1 1 1.3-1.5 7.2 7.2 0 0 0 11.6-3.7 7 7 0 0 0-3.5-7.7A7.2 7.2 0 0 0 8 7L4.7 10z" fill-rule="nonzero"/></svg>',
        'rotate-right': '<svg width="24" height="24"><path d="M20 8V5a1 1 0 0 1 2 0v6c0 .6-.4 1-1 1h-6a1 1 0 0 1 0-2h4.3L16 7A7.2 7.2 0 0 0 7.7 6a7 7 0 0 0 3 13.1c1.9.1 3.7-.5 5-1.7a1 1 0 0 1 1.4 1.5A9.2 9.2 0 0 1 2.2 14c-.9-3.9 1-8 4.5-9.9 3.5-1.9 8-1.3 10.8 1.5L20 8z" fill-rule="nonzero"/></svg>',
        rtl: '<svg width="24" height="24"><path d="M8 5h8v2h-2v12h-2V7h-2v12H8v-7c-.5 0-1 0-1.4-.3A3.4 3.4 0 0 1 4.8 10a3.3 3.3 0 0 1 0-2.8 3.4 3.4 0 0 1 1.8-1.8L8 5zm12 11.2a1 1 0 1 1-1 1.6l-3-2a1 1 0 0 1 0-1.6l3-2a1 1 0 1 1 1 1.6L18.4 15l1.8 1.2z" fill-rule="evenodd"/></svg>',
        save: '<svg width="24" height="24"><path d="M5 16h14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2zm0 2v2h14v-2H5zm10 0h2v2h-2v-2zm-4-6.4L8.7 9.3a1 1 0 1 0-1.4 1.4l4 4c.4.4 1 .4 1.4 0l4-4a1 1 0 1 0-1.4-1.4L13 11.6V4a1 1 0 0 0-2 0v7.6z" fill-rule="nonzero"/></svg>',
        search: '<svg width="24" height="24"><path d="M16 17.3a8 8 0 1 1 1.4-1.4l4.3 4.4a1 1 0 0 1-1.4 1.4l-4.4-4.3zm-5-.3a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" fill-rule="nonzero"/></svg>',
        'select-all': '<svg width="24" height="24"><path d="M3 5h2V3a2 2 0 0 0-2 2zm0 8h2v-2H3v2zm4 8h2v-2H7v2zM3 9h2V7H3v2zm10-6h-2v2h2V3zm6 0v2h2a2 2 0 0 0-2-2zM5 21v-2H3c0 1.1.9 2 2 2zm-2-4h2v-2H3v2zM9 3H7v2h2V3zm2 18h2v-2h-2v2zm8-8h2v-2h-2v2zm0 8a2 2 0 0 0 2-2h-2v2zm0-12h2V7h-2v2zm0 8h2v-2h-2v2zm-4 4h2v-2h-2v2zm0-16h2V3h-2v2zM7 17h10V7H7v10zm2-8h6v6H9V9z" fill-rule="nonzero"/></svg>',
        selected: '<svg width="24" height="24"><path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm-2.4-6.1L7 12.3a.7.7 0 0 0-1 1L9.6 17 18 8.6a.7.7 0 0 0 0-1 .7.7 0 0 0-1 0l-7.4 7.3z" fill-rule="evenodd"/></svg>',
        settings: '<svg width="24" height="24"><path d="M11 6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8v.3c0 .2 0 .3-.2.5l-.6.2H7.8c-.3 0-.4 0-.6-.2a.7.7 0 0 1-.2-.6V8H5a1 1 0 1 1 0-2h2v-.3c0-.2 0-.3.2-.5l.5-.2h2.5c.3 0 .4 0 .6.2l.2.5V6zM8 8h2V6H8v2zm9 2.8v.2h2c.6 0 1 .4 1 1s-.4 1-1 1h-2v.3c0 .2 0 .3-.2.5l-.6.2h-2.4c-.3 0-.4 0-.6-.2a.7.7 0 0 1-.2-.6V13H5a1 1 0 0 1 0-2h8v-.3c0-.2 0-.3.2-.5l.6-.2h2.4c.3 0 .4 0 .6.2l.2.6zM14 13h2v-2h-2v2zm-3 2.8v.2h8c.6 0 1 .4 1 1s-.4 1-1 1h-8v.3c0 .2 0 .3-.2.5l-.6.2H7.8c-.3 0-.4 0-.6-.2a.7.7 0 0 1-.2-.6V18H5a1 1 0 0 1 0-2h2v-.3c0-.2 0-.3.2-.5l.5-.2h2.5c.3 0 .4 0 .6.2l.2.6zM8 18h2v-2H8v2z" fill-rule="evenodd"/></svg>',
        sharpen: '<svg width="24" height="24"><path d="M16 6l4 4-8 9-8-9 4-4h8zm-4 10.2l5.5-6.2-.1-.1H12v-.3h5.1l-.2-.2H12V9h4.6l-.2-.2H12v-.3h4.1l-.2-.2H12V8h3.6l-.2-.2H8.7L6.5 10l.1.1H12v.3H6.9l.2.2H12v.3H7.3l.2.2H12v.3H7.7l.3.2h4v.3H8.2l.2.2H12v.3H8.6l.3.2H12v.3H9l.3.2H12v.3H9.5l.2.2H12v.3h-2l.2.2H12v.3h-1.6l.2.2H12v.3h-1.1l.2.2h.9v.3h-.7l.2.2h.5v.3h-.3l.3.2z" fill-rule="evenodd"/></svg>',
        sourcecode: '<svg width="24" height="24"><g fill-rule="nonzero"><path d="M9.8 15.7c.3.3.3.8 0 1-.3.4-.9.4-1.2 0l-4.4-4.1a.8.8 0 0 1 0-1.2l4.4-4.2c.3-.3.9-.3 1.2 0 .3.3.3.8 0 1.1L6 12l3.8 3.7zM14.2 15.7c-.3.3-.3.8 0 1 .4.4.9.4 1.2 0l4.4-4.1c.3-.3.3-.9 0-1.2l-4.4-4.2a.8.8 0 0 0-1.2 0c-.3.3-.3.8 0 1.1L18 12l-3.8 3.7z"/></g></svg>',
        'spell-check': '<svg width="24" height="24"><path d="M6 8v3H5V5c0-.3.1-.5.3-.7.2-.2.4-.3.7-.3h2c.3 0 .5.1.7.3.2.2.3.4.3.7v6H8V8H6zm0-3v2h2V5H6zm13 0h-3v5h3v1h-3a1 1 0 0 1-.7-.3 1 1 0 0 1-.3-.7V5c0-.3.1-.5.3-.7.2-.2.4-.3.7-.3h3v1zm-5 1.5l-.1.7c-.1.2-.3.3-.6.3.3 0 .5.1.6.3l.1.7V10c0 .3-.1.5-.3.7a1 1 0 0 1-.7.3h-3V4h3c.3 0 .5.1.7.3.2.2.3.4.3.7v1.5zM13 10V8h-2v2h2zm0-3V5h-2v2h2zm3 5l1 1-6.5 7L7 15.5l1.3-1 2.2 2.2L16 12z" fill-rule="evenodd"/></svg>',
        'strike-through': '<svg width="24" height="24"><g fill-rule="evenodd"><path d="M15.6 8.5c-.5-.7-1-1.1-1.3-1.3-.6-.4-1.3-.6-2-.6-2.7 0-2.8 1.7-2.8 2.1 0 1.6 1.8 2 3.2 2.3 4.4.9 4.6 2.8 4.6 3.9 0 1.4-.7 4.1-5 4.1A6.2 6.2 0 0 1 7 16.4l1.5-1.1c.4.6 1.6 2 3.7 2 1.6 0 2.5-.4 3-1.2.4-.8.3-2-.8-2.6-.7-.4-1.6-.7-2.9-1-1-.2-3.9-.8-3.9-3.6C7.6 6 10.3 5 12.4 5c2.9 0 4.2 1.6 4.7 2.4l-1.5 1.1z"/><path d="M5 11h14a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2z" fill-rule="nonzero"/></g></svg>',
        subscript: '<svg width="24" height="24"><path d="M10.4 10l4.6 4.6-1.4 1.4L9 11.4 4.4 16 3 14.6 7.6 10 3 5.4 4.4 4 9 8.6 13.6 4 15 5.4 10.4 10zM21 19h-5v-1l1-.8 1.7-1.6c.3-.4.5-.8.5-1.2 0-.3 0-.6-.2-.7-.2-.2-.5-.3-.9-.3a2 2 0 0 0-.8.2l-.7.3-.4-1.1 1-.6 1.2-.2c.8 0 1.4.3 1.8.7.4.4.6.9.6 1.5s-.2 1.1-.5 1.6a8 8 0 0 1-1.3 1.3l-.6.6h2.6V19z" fill-rule="nonzero"/></svg>',
        superscript: '<svg width="24" height="24"><path d="M15 9.4L10.4 14l4.6 4.6-1.4 1.4L9 15.4 4.4 20 3 18.6 7.6 14 3 9.4 4.4 8 9 12.6 13.6 8 15 9.4zm5.9 1.6h-5v-1l1-.8 1.7-1.6c.3-.5.5-.9.5-1.3 0-.3 0-.5-.2-.7-.2-.2-.5-.3-.9-.3l-.8.2-.7.4-.4-1.2c.2-.2.5-.4 1-.5.3-.2.8-.2 1.2-.2.8 0 1.4.2 1.8.6.4.4.6 1 .6 1.6 0 .5-.2 1-.5 1.5l-1.3 1.4-.6.5h2.6V11z" fill-rule="nonzero"/></svg>',
        'table-cell-properties': '<svg width="24" height="24"><path d="M4 5h16v14H4V5zm10 10h-4v3h4v-3zm0-8h-4v3h4V7zM9 7H5v3h4V7zm-4 4v3h4v-3H5zm10 0v3h4v-3h-4zm0-1h4V7h-4v3zM5 15v3h4v-3H5zm10 3h4v-3h-4v3z" fill-rule="evenodd"/></svg>',
        'table-cell-select-all': '<svg width="24" height="24"><path d="M12.5 5.5v6h6v-6h-6zm-1 0h-6v6h6v-6zm1 13h6v-6h-6v6zm-1 0v-6h-6v6h6zm-7-14h15v15h-15v-15z" fill-rule="nonzero"/></svg>',
        'table-cell-select-inner': '<svg width="24" height="24"><g fill-rule="nonzero"><path d="M5.5 5.5v13h13v-13h-13zm-1-1h15v15h-15v-15z" opacity=".2"/><path d="M11.5 11.5v-7h1v7h7v1h-7v7h-1v-7h-7v-1h7z"/></g></svg>',
        'table-delete-column': '<svg width="24" height="24"><path d="M9 11.2l1 1v.2l-1 1v-2.2zm5 1l1-1v2.2l-1-1v-.2zM20 5v14H4V5h16zm-1 2h-4v.8l-.2-.2-.8.8V7h-4v1.4l-.8-.8-.2.2V7H5v11h4v-1.8l.5.5.5-.4V18h4v-1.8l.8.8.2-.3V18h4V7zm-3.9 3.4l-1.8 1.9 1.8 1.9c.4.3.4.9 0 1.2-.3.3-.8.3-1.2 0L12 13.5l-1.8 1.9a.8.8 0 0 1-1.2 0 .9.9 0 0 1 0-1.2l1.8-1.9-1.9-2a.9.9 0 0 1 1.2-1.2l2 2 1.8-1.8c.3-.4.9-.4 1.2 0a.8.8 0 0 1 0 1.1z" fill-rule="evenodd"/></svg>',
        'table-delete-row': '<svg width="24" height="24"><path d="M16.7 8.8l1.1 1.2-2.4 2.5L18 15l-1.2 1.2-2.5-2.5-2.4 2.5-1.3-1.2 2.5-2.5-2.5-2.5 1.2-1.3 2.6 2.6 2.4-2.5zM4 5h16v14H4V5zm15 5V7H5v3h4.8l1 1H5v3h5.8l-1 1H5v3h14v-3h-.4l-1-1H19v-3h-1.3l1-1h.3z" fill-rule="evenodd"/></svg>',
        'table-delete-table': '<svg width="24" height="26"><path d="M4 6h16v14H4V6zm1 2v11h14V8H5zm11.7 8.7l-1.5 1.5L12 15l-3.3 3.2-1.4-1.5 3.2-3.2-3.3-3.2 1.5-1.5L12 12l3.2-3.2 1.5 1.5-3.2 3.2 3.2 3.2z" fill-rule="evenodd"/></svg>',
        'table-insert-column-after': '<svg width="24" height="24"><path d="M14.3 9c.4 0 .7.3.7.6v2.2h2.1c.4 0 .7.3.7.7 0 .4-.3.7-.7.7H15v2.2c0 .3-.3.6-.7.6a.7.7 0 0 1-.6-.6v-2.2h-2.2a.7.7 0 0 1 0-1.4h2.2V9.6c0-.3.3-.6.6-.6zM4 5h16v14H4V5zm5 13v-3H5v3h4zm0-4v-3H5v3h4zm0-4V7H5v3h4zm10 8V7h-9v11h9z" fill-rule="evenodd"/></svg>',
        'table-insert-column-before': '<svg width="24" height="24"><path d="M9.7 16a.7.7 0 0 1-.7-.6v-2.2H6.9a.7.7 0 0 1 0-1.4H9V9.6c0-.3.3-.6.7-.6.3 0 .6.3.6.6v2.2h2.2c.4 0 .8.3.8.7 0 .4-.4.7-.8.7h-2.2v2.2c0 .3-.3.6-.6.6zM4 5h16v14H4V5zm10 13V7H5v11h9zm5 0v-3h-4v3h4zm0-4v-3h-4v3h4zm0-4V7h-4v3h4z" fill-rule="evenodd"/></svg>',
        'table-insert-row-above': '<svg width="24" height="24"><path d="M14.8 10.5c0 .3-.2.5-.5.5h-1.8v1.8c0 .3-.2.5-.5.5a.5.5 0 0 1-.5-.6V11H9.7a.5.5 0 0 1 0-1h1.8V8.3c0-.3.2-.6.5-.6s.5.3.5.6V10h1.8c.3 0 .5.2.5.5zM4 5h16v14H4V5zm5 13v-3H5v3h4zm5 0v-3h-4v3h4zm5 0v-3h-4v3h4zm0-4V7H5v7h14z" fill-rule="evenodd"/></svg>',
        'table-insert-row-after': '<svg width="24" height="24"><path d="M9.2 14.5c0-.3.2-.5.5-.5h1.8v-1.8c0-.3.2-.5.5-.5s.5.2.5.6V14h1.8c.3 0 .5.2.5.5s-.2.5-.5.5h-1.8v1.7c0 .3-.2.6-.5.6a.5.5 0 0 1-.5-.6V15H9.7a.5.5 0 0 1-.5-.5zM4 5h16v14H4V5zm6 2v3h4V7h-4zM5 7v3h4V7H5zm14 11v-7H5v7h14zm0-8V7h-4v3h4z" fill-rule="evenodd"/></svg>',
        'table-left-header': '<svg width="24" height="24"><path d="M4 5h16v13H4V5zm10 12v-3h-4v3h4zm0-4v-3h-4v3h4zm0-4V6h-4v3h4zm5 8v-3h-4v3h4zm0-4v-3h-4v3h4zm0-4V6h-4v3h4z" fill-rule="evenodd"/></svg>',
        'table-merge-cells': '<svg width="24" height="24"><path d="M4 5h16v14H4V5zm6 13h9v-7h-9v7zm4-11h-4v3h4V7zM9 7H5v3h4V7zm-4 4v3h4v-3H5zm10-1h4V7h-4v3zM5 15v3h4v-3H5z" fill-rule="evenodd"/></svg>',
        'table-row-properties': '<svg width="24" height="24"><path d="M4 5h16v14H4V5zm10 10h-4v3h4v-3zm0-8h-4v3h4V7zM9 7H5v3h4V7zm6 3h4V7h-4v3zM5 15v3h4v-3H5zm10 3h4v-3h-4v3z" fill-rule="evenodd"/></svg>',
        'table-split-cells': '<svg width="24" height="24"><path d="M4 5h16v14H4V5zm6 2v3h4V7h-4zM9 18v-3H5v3h4zm0-4v-3H5v3h4zm0-4V7H5v3h4zm10 8v-7h-9v7h9zm0-8V7h-4v3h4zm-3.5 4.5l1.5 1.6c.3.2.3.7 0 1-.2.2-.7.2-1 0l-1.5-1.6-1.6 1.5c-.2.3-.7.3-1 0a.7.7 0 0 1 0-1l1.6-1.5-1.5-1.6a.7.7 0 0 1 1-1l1.5 1.6 1.6-1.5c.2-.3.7-.3 1 0 .2.2.2.7 0 1l-1.6 1.5z" fill-rule="evenodd"/></svg>',
        'table-top-header': '<svg width="24" height="24"><path d="M4 5h16v13H4V5zm5 12v-3H5v3h4zm0-4v-3H5v3h4zm5 4v-3h-4v3h4zm0-4v-3h-4v3h4zm5 4v-3h-4v3h4zm0-4v-3h-4v3h4z" fill-rule="evenodd"/></svg>',
        table: '<svg width="24" height="24"><path d="M4 5h16v14H4V5zm6 9h4v-3h-4v3zm4 1h-4v3h4v-3zm0-8h-4v3h4V7zM9 7H5v3h4V7zm-4 4v3h4v-3H5zm10 0v3h4v-3h-4zm0-1h4V7h-4v3zM5 15v3h4v-3H5zm10 3h4v-3h-4v3z" fill-rule="evenodd"/></svg>',
        template: '<svg width="24" height="24"><path d="M19 19v-1H5v1h14zM9 16v-4a5 5 0 1 1 6 0v4h4a2 2 0 0 1 2 2v3H3v-3c0-1.1.9-2 2-2h4zm4 0v-5l.8-.6a3 3 0 1 0-3.6 0l.8.6v5h2z" fill-rule="nonzero"/></svg>',
        'temporary-placeholder': '<svg width="24" height="24"><path d="M20.5 2.5c-.8 0-1.5.7-1.5 1.5a1.5 1.5 0 0 1-3 0 3 3 0 0 0-6 0v2H8.5c-.3 0-.5.2-.5.5v1a8 8 0 1 0 6 0v-1c0-.3-.2-.5-.5-.5H11V4a2 2 0 0 1 4 0 2.5 2.5 0 0 0 5 0c0-.3.2-.5.5-.5a.5.5 0 0 0 0-1zM8.1 10.9a5 5 0 0 0-1.2 7 .5.5 0 0 1-.8.5 6 6 0 0 1 1.5-8.3.5.5 0 1 1 .5.8z" fill-rule="nonzero"/></svg>',
        'text-color': '<svg width="24" height="24"><g fill-rule="evenodd"><path id="tox-icon-text-color__color" d="M3 18h18v3H3z"/><path d="M8.7 16h-.8a.5.5 0 0 1-.5-.6l2.7-9c.1-.3.3-.4.5-.4h2.8c.2 0 .4.1.5.4l2.7 9a.5.5 0 0 1-.5.6h-.8a.5.5 0 0 1-.4-.4l-.7-2.2c0-.3-.3-.4-.5-.4h-3.4c-.2 0-.4.1-.5.4l-.7 2.2c0 .3-.2.4-.4.4zm2.6-7.6l-.6 2a.5.5 0 0 0 .5.6h1.6a.5.5 0 0 0 .5-.6l-.6-2c0-.3-.3-.4-.5-.4h-.4c-.2 0-.4.1-.5.4z"/></g></svg>',
        toc: '<svg width="24" height="24"><path d="M5 5c.6 0 1 .4 1 1s-.4 1-1 1a1 1 0 1 1 0-2zm3 0h11c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 1 1 0-2zm-3 8c.6 0 1 .4 1 1s-.4 1-1 1a1 1 0 0 1 0-2zm3 0h11c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2zm0-4c.6 0 1 .4 1 1s-.4 1-1 1a1 1 0 1 1 0-2zm3 0h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2zm-3 8c.6 0 1 .4 1 1s-.4 1-1 1a1 1 0 0 1 0-2zm3 0h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2z" fill-rule="evenodd"/></svg>',
        translate: '<svg width="24" height="24"><path d="M12.7 14.3l-.3.7-.4.7-2.2-2.2-3.1 3c-.3.4-.8.4-1 0a.7.7 0 0 1 0-1l3.1-3A12.4 12.4 0 0 1 6.7 9H8a10.1 10.1 0 0 0 1.7 2.4c.5-.5 1-1.1 1.4-1.8l.9-2H4.7a.7.7 0 1 1 0-1.5h4.4v-.7c0-.4.3-.8.7-.8.4 0 .7.4.7.8v.7H15c.4 0 .8.3.8.7 0 .4-.4.8-.8.8h-1.4a12.3 12.3 0 0 1-1 2.4 13.5 13.5 0 0 1-1.7 2.3l1.9 1.8zm4.3-3l2.7 7.3a.5.5 0 0 1-.4.7 1 1 0 0 1-1-.7l-.6-1.5h-3.4l-.6 1.5a1 1 0 0 1-1 .7.5.5 0 0 1-.4-.7l2.7-7.4a1 1 0 1 1 2 0zm-2.2 4.4h2.4L16 12.5l-1.2 3.2z" fill-rule="evenodd"/></svg>',
        underline: '<svg width="24" height="24"><path d="M16 5c.6 0 1 .4 1 1v5.5a4 4 0 0 1-.4 1.8l-1 1.4a5.3 5.3 0 0 1-5.5 1 5 5 0 0 1-1.6-1c-.5-.4-.8-.9-1.1-1.4a4 4 0 0 1-.4-1.8V6c0-.6.4-1 1-1s1 .4 1 1v5.5c0 .3 0 .6.2 1l.6.7a3.3 3.3 0 0 0 2.2.8 3.4 3.4 0 0 0 2.2-.8c.3-.2.4-.5.6-.8l.2-.9V6c0-.6.4-1 1-1zM8 17h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2z" fill-rule="evenodd"/></svg>',
        undo: '<svg width="24" height="24"><path d="M6.4 8H12c3.7 0 6.2 2 6.8 5.1.6 2.7-.4 5.6-2.3 6.8a1 1 0 0 1-1-1.8c1.1-.6 1.8-2.7 1.4-4.6-.5-2.1-2.1-3.5-4.9-3.5H6.4l3.3 3.3a1 1 0 1 1-1.4 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 1.4L6.4 8z" fill-rule="nonzero"/></svg>',
        unlink: '<svg width="24" height="24"><path d="M6.2 12.3a1 1 0 0 1 1.4 1.4l-2 2a2 2 0 1 0 2.6 2.8l4.8-4.8a1 1 0 0 0 0-1.4 1 1 0 1 1 1.4-1.3 2.9 2.9 0 0 1 0 4L9.6 20a3.9 3.9 0 0 1-5.5-5.5l2-2zm11.6-.6a1 1 0 0 1-1.4-1.4l2.1-2a2 2 0 1 0-2.7-2.8L11 10.3a1 1 0 0 0 0 1.4A1 1 0 1 1 9.6 13a2.9 2.9 0 0 1 0-4L14.4 4a3.9 3.9 0 0 1 5.5 5.5l-2 2zM7.6 6.3a.8.8 0 0 1-1 1.1L3.3 4.2a.7.7 0 1 1 1-1l3.2 3.1zM5.1 8.6a.8.8 0 0 1 0 1.5H3a.8.8 0 0 1 0-1.5H5zm5-3.5a.8.8 0 0 1-1.5 0V3a.8.8 0 0 1 1.5 0V5zm6 11.8a.8.8 0 0 1 1-1l3.2 3.2a.8.8 0 0 1-1 1L16 17zm-2.2 2a.8.8 0 0 1 1.5 0V21a.8.8 0 0 1-1.5 0V19zm5-3.5a.7.7 0 1 1 0-1.5H21a.8.8 0 0 1 0 1.5H19z" fill-rule="nonzero"/></svg>',
        unlock: '<svg width="24" height="24"><path d="M16 5c.8 0 1.5.3 2.1.9.6.6.9 1.3.9 2.1v3h-2V8a1 1 0 0 0-.3-.7A1 1 0 0 0 16 7h-2a1 1 0 0 0-.7.3 1 1 0 0 0-.3.7v3h.3c.2 0 .3 0 .5.2l.2.6v7.4c0 .3 0 .4-.2.6l-.6.2H4.8c-.3 0-.4 0-.6-.2a.7.7 0 0 1-.2-.6v-7.4c0-.3 0-.4.2-.6l.5-.2H11V8c0-.8.3-1.5.9-2.1.6-.6 1.3-.9 2.1-.9h2z" fill-rule="evenodd"/></svg>',
        'unordered-list': '<svg width="24" height="24"><path d="M11 5h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2zm0 6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2zm0 6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2zM4.5 6c0-.4.1-.8.4-1 .3-.4.7-.5 1.1-.5.4 0 .8.1 1 .4.4.3.5.7.5 1.1 0 .4-.1.8-.4 1-.3.4-.7.5-1.1.5-.4 0-.8-.1-1-.4-.4-.3-.5-.7-.5-1.1zm0 6c0-.4.1-.8.4-1 .3-.4.7-.5 1.1-.5.4 0 .8.1 1 .4.4.3.5.7.5 1.1 0 .4-.1.8-.4 1-.3.4-.7.5-1.1.5-.4 0-.8-.1-1-.4-.4-.3-.5-.7-.5-1.1zm0 6c0-.4.1-.8.4-1 .3-.4.7-.5 1.1-.5.4 0 .8.1 1 .4.4.3.5.7.5 1.1 0 .4-.1.8-.4 1-.3.4-.7.5-1.1.5-.4 0-.8-.1-1-.4-.4-.3-.5-.7-.5-1.1z" fill-rule="evenodd"/></svg>',
        unselected: '<svg width="24" height="24"><path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-1a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" fill-rule="evenodd"/></svg>',
        upload: '<svg width="24" height="24"><path d="M18 19v-2a1 1 0 0 1 2 0v3c0 .6-.4 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 2 0v2h12zM11 6.4L8.7 8.7a1 1 0 0 1-1.4-1.4l4-4a1 1 0 0 1 1.4 0l4 4a1 1 0 1 1-1.4 1.4L13 6.4V16a1 1 0 0 1-2 0V6.4z" fill-rule="nonzero"/></svg>',
        user: '<svg width="24" height="24"><path d="M12 24a12 12 0 1 1 0-24 12 12 0 0 1 0 24zm-8.7-5.3a11 11 0 0 0 17.4 0C19.4 16.3 14.6 15 12 15c-2.6 0-7.4 1.3-8.7 3.7zM12 13c2.2 0 4-2 4-4.5S14.2 4 12 4 8 6 8 8.5 9.8 13 12 13z" fill-rule="nonzero"/></svg>',
        warning: '<svg width="24" height="24"><path d="M19.8 18.3c.2.5.3.9 0 1.2-.1.3-.5.5-1 .5H5.2c-.5 0-.9-.2-1-.5-.3-.3-.2-.7 0-1.2L11 4.7l.5-.5.5-.2c.2 0 .3 0 .5.2.2 0 .3.3.5.5l6.8 13.6zM12 18c.3 0 .5-.1.7-.3.2-.2.3-.4.3-.7a1 1 0 0 0-.3-.7 1 1 0 0 0-.7-.3 1 1 0 0 0-.7.3 1 1 0 0 0-.3.7c0 .3.1.5.3.7.2.2.4.3.7.3zm.7-3l.3-4a1 1 0 0 0-.3-.7 1 1 0 0 0-.7-.3 1 1 0 0 0-.7.3 1 1 0 0 0-.3.7l.3 4h1.4z" fill-rule="evenodd"/></svg>',
        'zoom-in': '<svg width="24" height="24"><path d="M16 17.3a8 8 0 1 1 1.4-1.4l4.3 4.4a1 1 0 0 1-1.4 1.4l-4.4-4.3zm-5-.3a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm-1-9a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V8zm-2 4a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2H8z" fill-rule="nonzero"/></svg>',
        'zoom-out': '<svg width="24" height="24"><path d="M16 17.3a8 8 0 1 1 1.4-1.4l4.3 4.4a1 1 0 0 1-1.4 1.4l-4.4-4.3zm-5-.3a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm-3-5a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2H8z" fill-rule="nonzero"/></svg>',
      }
    }

    const defaultIcons = getAll()
    const defaultIcon = Option.from(defaultIcons['temporary-placeholder']).getOr('!not found!')
    const getDefault = function (name) {
      return Option.from(defaultIcons[name]).getOr(defaultIcon)
    }
    const getDefaultOr = function (name, fallback) {
      return Option.from(defaultIcons[name]).getOrThunk(() => fallback.getOr(defaultIcon))
    }
    const get$e = function (name, icons) {
      return Option.from(icons()[name]).getOrThunk(() => getDefault(name))
    }
    const getOr = function (name, icons, fallback) {
      return Option.from(icons()[name]).getOrThunk(() => getDefaultOr(name, fallback))
    }
    const getDefaultFirst = function (names) {
      return findMap(names, (name) => Option.from(defaultIcons[name])).getOr(defaultIcon)
    }
    const getFirst$1 = function (names, icons) {
      return findMap(names, (name) => Option.from(icons()[name])).getOrThunk(() => getDefaultFirst(names))
    }

    const notificationIconMap = {
      success: 'checkmark',
      error: 'warning',
      err: 'error',
      warning: 'warning',
      warn: 'warning',
      info: 'info',
    }
    const factory$2 = function (detail) {
      const memBannerText = record({
        dom: {
          tag: 'p',
          innerHtml: detail.translationProvider(detail.text),
        },
        behaviours: derive$1([Replacing.config({})]),
      })
      const renderPercentBar = function (percent) {
        return {
          dom: {
            tag: 'div',
            classes: ['tox-bar'],
            attributes: { style: `width: ${percent}%` },
          },
        }
      }
      const renderPercentText = function (percent) {
        return {
          dom: {
            tag: 'div',
            classes: ['tox-text'],
            innerHtml: `${percent}%`,
          },
        }
      }
      const memBannerProgress = record({
        dom: {
          tag: 'div',
          classes: detail.progress ? [
            'tox-progress-bar',
            'tox-progress-indicator',
          ] : ['tox-progress-bar'],
        },
        components: [
          {
            dom: {
              tag: 'div',
              classes: ['tox-bar-container'],
            },
            components: [renderPercentBar(0)],
          },
          renderPercentText(0),
        ],
        behaviours: derive$1([Replacing.config({})]),
      })
      const updateProgress = function (comp, percent) {
        if (comp.getSystem().isConnected()) {
          memBannerProgress.getOpt(comp).each((progress) => {
            Replacing.set(progress, [
              {
                dom: {
                  tag: 'div',
                  classes: ['tox-bar-container'],
                },
                components: [renderPercentBar(percent)],
              },
              renderPercentText(percent),
            ])
          })
        }
      }
      const updateText = function (comp, text$$1) {
        if (comp.getSystem().isConnected()) {
          const banner = memBannerText.get(comp)
          Replacing.set(banner, [text(text$$1)])
        }
      }
      const apis = {
        updateProgress,
        updateText,
      }
      const iconChoices = flatten([
        detail.icon.toArray(),
        detail.level.toArray(),
        detail.level.bind((level) => Option.from(notificationIconMap[level])).toArray(),
      ])
      return {
        uid: detail.uid,
        dom: {
          tag: 'div',
          attributes: { role: 'alert' },
          classes: detail.level.map((level) => [
            'tox-notification',
            'tox-notification--in',
            `tox-notification--${level}`,
          ]).getOr([
            'tox-notification',
            'tox-notification--in',
          ]),
        },
        components: [
          {
            dom: {
              tag: 'div',
              classes: ['tox-notification__icon'],
              innerHtml: getFirst$1(iconChoices, detail.iconProvider),
            },
          },
          {
            dom: {
              tag: 'div',
              classes: ['tox-notification__body'],
            },
            components: [memBannerText.asSpec()],
            behaviours: derive$1([Replacing.config({})]),
          },
        ].concat(detail.progress ? [memBannerProgress.asSpec()] : []).concat(Button.sketch({
          dom: {
            tag: 'button',
            classes: [
              'tox-notification__dismiss',
              'tox-button',
              'tox-button--naked',
              'tox-button--icon',
            ],
          },
          components: [{
            dom: {
              tag: 'div',
              classes: ['tox-icon'],
              innerHtml: get$e('close', detail.iconProvider),
              attributes: { 'aria-label': detail.translationProvider('Close') },
            },
          }],
          action(comp) {
            detail.onAction(comp)
          },
        })),
        apis,
      }
    }
    const Notification = single$2({
      name: 'Notification',
      factory: factory$2,
      configFields: [
        option('level'),
        strict$1('progress'),
        strict$1('icon'),
        strict$1('onAction'),
        strict$1('text'),
        strict$1('iconProvider'),
        strict$1('translationProvider'),
      ],
      apis: {
        updateProgress(apis, comp, percent) {
          apis.updateProgress(comp, percent)
        },
        updateText(apis, comp, text$$1) {
          apis.updateText(comp, text$$1)
        },
      },
    })

    function NotificationManagerImpl(editor, extras, uiMothership) {
      const { backstage } = extras
      const getEditorContainer = function (editor) {
        return editor.inline ? editor.getElement() : editor.getContentAreaContainer()
      }
      const prePositionNotifications = function (notifications) {
        each(notifications, (notification) => {
          notification.moveTo(0, 0)
        })
      }
      const positionNotifications = function (notifications) {
        if (notifications.length > 0) {
          const firstItem = notifications.slice(0, 1)[0]
          const container = getEditorContainer(editor)
          firstItem.moveRel(container, 'tc-tc')
          each(notifications, (notification, index) => {
            if (index > 0) {
              notification.moveRel(notifications[index - 1].getEl(), 'bc-tc')
            }
          })
        }
      }
      const reposition = function (notifications) {
        prePositionNotifications(notifications)
        positionNotifications(notifications)
      }
      const open = function (settings, closeCallback) {
        const close = function () {
          closeCallback()
          InlineView.hide(notificationWrapper)
        }
        const notification = build$1(Notification.sketch({
          text: settings.text,
          level: contains([
            'success',
            'error',
            'warning',
            'info',
          ], settings.type) ? settings.type : undefined,
          progress: settings.progressBar === true,
          icon: Option.from(settings.icon),
          onAction: close,
          iconProvider: backstage.shared.providers.icons,
          translationProvider: backstage.shared.providers.translate,
        }))
        var notificationWrapper = build$1(InlineView.sketch({
          dom: {
            tag: 'div',
            classes: ['tox-notifications-container'],
          },
          lazySink: extras.backstage.shared.getSink,
          fireDismissalEventInstead: {},
        }))
        uiMothership.add(notificationWrapper)
        if (settings.timeout) {
          setTimeout(() => {
            close()
          }, settings.timeout)
        }
        return {
          close,
          moveTo(x, y) {
            InlineView.showAt(notificationWrapper, {
              anchor: 'makeshift',
              x,
              y,
            }, premade$1(notification))
          },
          moveRel(element, rel) {
            InlineView.showAt(notificationWrapper, extras.backstage.shared.anchors.banner(), premade$1(notification))
          },
          text(nuText) {
            Notification.updateText(notification, nuText)
          },
          settings,
          getEl() {
          },
          progressBar: {
            value(percent) {
              Notification.updateProgress(notification, percent)
            },
          },
        }
      }
      const close = function (notification) {
        notification.close()
      }
      const getArgs = function (notification) {
        return notification.settings
      }
      return {
        open,
        close,
        reposition,
        getArgs,
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

    const isValidTextRange = function (rng) {
      return rng.collapsed && rng.startContainer.nodeType === 3
    }
    const whiteSpace = /[\u00a0 \t\r\n]/
    const parse$1 = function (text, index, ch, minChars) {
      let i
      for (i = index - 1; i >= 0; i--) {
        if (whiteSpace.test(text.charAt(i))) {
          return Option.none()
        }
        if (text.charAt(i) === ch) {
          break
        }
      }
      if (i === -1 || index - i < minChars) {
        return Option.none()
      }
      return Option.some(text.substring(i + 1, index))
    }
    const getContext = function (initRange, ch, text, index, minChars) {
      if (minChars === void 0) {
        minChars = 0
      }
      if (!isValidTextRange(initRange)) {
        return Option.none()
      }
      return parse$1(text, index, ch, minChars).map((newText) => {
        const rng = initRange.cloneRange()
        rng.setStart(initRange.startContainer, initRange.startOffset - newText.length - 1)
        rng.setEnd(initRange.startContainer, initRange.startOffset)
        return {
          text: newText,
          rng,
        }
      })
    }

    const setup = function (api, editor) {
      editor.on('keypress', api.onKeypress.throttle)
      editor.on('remove', api.onKeypress.cancel)
      const redirectKeyToItem = function (item, e) {
        emitWith(item, keydown(), { raw: e })
      }
      editor.on('keydown', (e) => {
        const getItem = function () {
          return api.getView().bind(Highlighting.getHighlighted)
        }
        if (e.which === 8) {
          api.onKeypress.throttle(e)
        }
        if (api.isActive()) {
          if (e.which === 27) {
            api.closeIfNecessary()
          } else if (e.which === 32) {
            api.closeIfNecessary()
          } else if (e.which === 13) {
            getItem().each(emitExecute)
            e.preventDefault()
          } else if (e.which === 40) {
            getItem().fold(() => {
              api.getView().each(Highlighting.highlightFirst)
            }, (item) => {
              redirectKeyToItem(item, e)
            })
            e.preventDefault()
          } else if (e.which === 37 || e.which === 38 || e.which === 39) {
            getItem().each((item) => {
              redirectKeyToItem(item, e)
              e.preventDefault()
            })
          }
        }
      })
    }
    const AutocompleterEditorEvents = { setup }

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.Promise')

    const getTriggerContext = function (initRange, initText, database) {
      return findMap(database.triggerChars, (ch) => getContext(initRange, ch, initText, initRange.startOffset).map((_a) => {
        const { rng } = _a; const { text } = _a
        return {
          range: rng,
          text,
          triggerChar: ch,
        }
      }))
    }
    const lookup = function (editor, getDatabase) {
      const database = getDatabase()
      const rng = editor.selection.getRng()
      const startText = rng.startContainer.nodeValue
      return getTriggerContext(rng, startText, database).map((context) => {
        const autocompleters = filter(database.lookupByChar(context.triggerChar), (autocompleter) => context.text.length >= autocompleter.minChars && autocompleter.matches(context.range, startText, context.text))
        const lookupData = global$1.all(map(autocompleters, (ac) => {
          const fetchResult = ac.fetch(context.text, ac.maxResults)
          return fetchResult.then((results) => ({
            items: results,
            columns: ac.columns,
            onAction: ac.onAction,
          }))
        }))
        return {
          lookupData,
          triggerChar: context.triggerChar,
          range: context.range,
        }
      })
    }

    const autocompleterItemSchema = objOf([
      state$1('type', () => 'autocompleteitem'),
      state$1('active', () => false),
      state$1('disabled', () => false),
      defaulted$1('meta', {}),
      strictString('value'),
      optionString('text'),
      optionString('icon'),
    ])
    const autocompleterSchema = objOf([
      strictString('type'),
      strictString('ch'),
      defaultedNumber('minChars', 0),
      defaulted$1('columns', 1),
      defaultedNumber('maxResults', 10),
      defaultedFunction('matches', () => true),
      strictFunction('fetch'),
      strictFunction('onAction'),
    ])
    const createAutocompleterItem = function (spec) {
      return asRaw('Autocompleter.Item', autocompleterItemSchema, spec)
    }
    const createAutocompleter = function (spec) {
      return asRaw('Autocompleter', autocompleterSchema, spec)
    }

    const stringArray = function (a) {
      const all = {}
      each(a, (key) => {
        all[key] = {}
      })
      return keys(all)
    }

    const register = function (editor) {
      const { popups } = editor.ui.registry.getAll()
      const dataset = map$1(popups, (popup) => createAutocompleter(popup).fold((err) => {
        throw new Error(formatError(err))
      }, (x) => x))
      const triggerChars = stringArray(mapToArray(dataset, (v) => v.ch))
      const datasetValues = values(dataset)
      const lookupByChar = function (ch) {
        return filter(datasetValues, (dv) => dv.ch === ch)
      }
      return {
        dataset,
        triggerChars,
        lookupByChar,
      }
    }

    const commonMenuItemFields = [
      defaultedBoolean('disabled', false),
      optionString('text'),
      optionString('shortcut'),
      field('value', 'value', defaultedThunk(() => generate$1('menuitem-value')), anyValue$1()),
      defaulted$1('meta', {}),
    ]

    const menuItemSchema = objOf([
      strictString('type'),
      defaultedFunction('onSetup', () => noop),
      defaultedFunction('onAction', noop),
      optionString('icon'),
    ].concat(commonMenuItemFields))
    const createMenuItem = function (spec) {
      return asRaw('menuitem', menuItemSchema, spec)
    }

    const nestedMenuItemSchema = objOf([
      strictString('type'),
      strictFunction('getSubmenuItems'),
      defaultedFunction('onSetup', () => noop),
      optionString('icon'),
    ].concat(commonMenuItemFields))
    const createNestedMenuItem = function (spec) {
      return asRaw('nestedmenuitem', nestedMenuItemSchema, spec)
    }

    const toggleMenuItemSchema = objOf([
      strictString('type'),
      defaultedBoolean('active', false),
      defaultedFunction('onSetup', () => noop),
      strictFunction('onAction'),
    ].concat(commonMenuItemFields))
    const createToggleMenuItem = function (spec) {
      return asRaw('togglemenuitem', toggleMenuItemSchema, spec)
    }

    const choiceMenuItemSchema = objOf([
      strictString('type'),
      defaultedBoolean('active', false),
      optionString('icon'),
    ].concat(commonMenuItemFields))
    const createChoiceMenuItem = function (spec) {
      return asRaw('choicemenuitem', choiceMenuItemSchema, spec)
    }

    const separatorMenuItemSchema = objOf([
      strictString('type'),
      optionString('text'),
    ])
    const createSeparatorMenuItem = function (spec) {
      return asRaw('separatormenuitem', separatorMenuItemSchema, spec)
    }

    const fancyMenuItemSchema = objOf([
      strictString('type'),
      strictStringEnum('fancytype', ['inserttable']),
      defaultedFunction('onAction', noop),
    ])
    const createFancyMenuItem = function (spec) {
      return asRaw('fancymenuitem', fancyMenuItemSchema, spec)
    }

    const detectSize = function (comp, margin, selectorClass) {
      const descendants = descendants$1(comp.element(), `.${selectorClass}`)
      if (descendants.length > 0) {
        const columnLength = findIndex(descendants, (c) => {
          const thisTop = c.dom().getBoundingClientRect().top
          const cTop = descendants[0].dom().getBoundingClientRect().top
          return Math.abs(thisTop - cTop) > margin
        }).getOr(descendants.length)
        return Option.some({
          numColumns: columnLength,
          numRows: Math.ceil(descendants.length / columnLength),
        })
      }
      return Option.none()
    }

    const namedEvents = function (name, handlers) {
      return derive$1([config(name, handlers)])
    }
    const unnamedEvents = function (handlers) {
      return namedEvents(generate$1('unnamed-events'), handlers)
    }
    const SimpleBehaviours = {
      namedEvents,
      unnamedEvents,
    }

    const navClass = 'tox-menu-nav__js'
    const selectableClass = 'tox-collection__item'
    const colorClass = 'tox-swatch'
    const presetClasses = {
      normal: navClass,
      color: colorClass,
    }
    const tickedClass = 'tox-collection__item--enabled'
    const groupHeadingClass = 'tox-collection__group-heading'
    const iconClass = 'tox-collection__item-icon'
    const textClass = 'tox-collection__item-label'
    const accessoryClass = 'tox-collection__item-accessory'
    const caretClass = 'tox-collection__item-caret'
    const checkmarkClass = 'tox-collection__item-checkmark'
    const activeClass = 'tox-collection__item--active'
    const classForPreset = function (presets) {
      return readOptFrom$1(presetClasses, presets).getOr(navClass)
    }

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
      const contents = children$$1.length === 0 ? {} : { innerHtml: get$1(elem) }
      return __assign({
        tag: name(elem),
        classes,
        attributes: attrs,
      }, contents)
    }
    const simple$1 = function (tag, classes, components) {
      return {
        dom: {
          tag,
          classes,
        },
        components,
      }
    }

    const global$2 = tinymce.util.Tools.resolve('tinymce.util.I18n')

    const global$3 = tinymce.util.Tools.resolve('tinymce.Env')

    const convertText = function (source) {
      const mac = {
        alt: '&#x2325;',
        ctrl: '&#x2303;',
        shift: '&#x21E7;',
        meta: '&#x2318;',
      }
      const other = { meta: 'Ctrl' }
      const replace = global$3.mac ? mac : other
      const shortcut = source.split('+')
      const updated = map(shortcut, (segment) => {
        const search = segment.toLowerCase().trim()
        return has(replace, search) ? replace[search] : segment
      })
      return global$3.mac ? updated.join('') : updated.join('+')
    }
    const ConvertShortcut = { convertText }

    const renderIcon = function (iconHtml) {
      return {
        dom: {
          tag: 'span',
          classes: [iconClass],
          innerHtml: iconHtml,
        },
      }
    }
    const renderText = function (text$$1) {
      return {
        dom: {
          tag: 'span',
          classes: [textClass],
        },
        components: [text(global$2.translate(text$$1))],
      }
    }
    const renderShortcut = function (shortcut) {
      return {
        dom: {
          tag: 'span',
          classes: [accessoryClass],
          innerHtml: ConvertShortcut.convertText(shortcut),
        },
      }
    }
    const renderCheckmark = function (icons) {
      return {
        dom: {
          tag: 'span',
          classes: [
            iconClass,
            checkmarkClass,
          ],
          innerHtml: get$e('checkmark', icons),
        },
      }
    }
    const renderSubmenuCaret = function (icons) {
      return {
        dom: {
          tag: 'span',
          classes: [caretClass],
          innerHtml: get$e('chevron-right', icons),
        },
      }
    }

    const renderColorStructure = function (itemText, itemValue, iconSvg) {
      const colorPickerCommand = 'custom'
      const removeColorCommand = 'remove'
      const getDom = function () {
        const common = colorClass
        const icon = iconSvg.getOr('')
        const title = itemText.map((text) => ` title="${text}"`).getOr('')
        if (itemValue === colorPickerCommand) {
          return fromHtml$2(`<button class="${common} tox-swatches__picker-btn"${title}>${icon}</button>`)
        } if (itemValue === removeColorCommand) {
          return fromHtml$2(`<div class="${common} tox-swatch--remove"${title}>${icon}</div>`)
        }
        return fromHtml$2(`<div class="${common}" style="background-color: ${itemValue}" data-mce-color="${itemValue}"${title}></div>`)
      }
      return {
        dom: getDom(),
        optComponents: [],
      }
    }
    const renderNormalItemStructure = function (info, icon) {
      const leftIcon = info.checkMark.orThunk(() => icon.or(Option.some('')).map(renderIcon))
      const domTitle = info.ariaLabel.map((label) => ({ attributes: { title: global$2.translate(label) } })).getOr({})
      const dom = merge({
        tag: 'div',
        classes: [
          navClass,
          selectableClass,
        ],
      }, domTitle)
      const menuItem = {
        dom,
        optComponents: [
          leftIcon,
          info.textContent.map(renderText),
          info.shortcutContent.map(renderShortcut),
          info.caret,
        ],
      }
      return menuItem
    }
    const renderItemStructure = function (info, providersBackstage, fallbackIcon) {
      if (fallbackIcon === void 0) {
        fallbackIcon = Option.none()
      }
      const icon = info.iconContent.map((iconName) => getOr(iconName, providersBackstage.icons, fallbackIcon))
      if (info.presets === 'color') {
        return renderColorStructure(info.ariaLabel, info.value, icon)
      }
      return renderNormalItemStructure(info, icon)
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
      set$1(component.element(), 'disabled', 'disabled')
    }
    const nativeEnable = function (component) {
      remove$1(component.element(), 'disabled')
    }
    const ariaIsDisabled = function (component) {
      return get$2(component.element(), 'aria-disabled') === 'true'
    }
    const ariaDisable = function (component) {
      set$1(component.element(), 'aria-disabled', 'true')
    }
    const ariaEnable = function (component) {
      set$1(component.element(), 'aria-disabled', 'false')
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

    const exhibit$3 = function (base, disableConfig, disableState) {
      return nu$6({ classes: disableConfig.disabled ? disableConfig.disableClass.map(pure).getOr([]) : [] })
    }
    const events$8 = function (disableConfig, disableState) {
      return derive([
        abort(execute(), (component, simulatedEvent) => isDisabled(component)),
        loadEvent(disableConfig, disableState, onLoad$5),
      ])
    }

    const ActiveDisable = /* #__PURE__ */Object.freeze({
      exhibit: exhibit$3,
      events: events$8,
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

    const item = function (disabled) {
      return Disabling.config({
        disabled,
        disableClass: 'tox-collection__item--state-disabled',
      })
    }
    const button = function (disabled) {
      return Disabling.config({ disabled })
    }
    const splitButton = function (disabled) {
      return Disabling.config({
        disabled,
        disableClass: 'tox-tbtn--disabled',
      })
    }
    const DisablingConfigs = {
      item,
      button,
      splitButton,
    }

    const runWithApi = function (info, comp) {
      const api = info.getApi(comp)
      return function (f) {
        f(api)
      }
    }
    const onControlAttached = function (info, editorOffCell) {
      return runOnAttached((comp) => {
        const run$$1 = runWithApi(info, comp)
        run$$1((api) => {
          const onDestroy = info.onSetup(api)
          if (onDestroy !== null && onDestroy !== undefined) {
            editorOffCell.set(onDestroy)
          }
        })
      })
    }
    const onControlDetached = function (getApi, editorOffCell) {
      return runOnDetached((comp) => runWithApi(getApi, comp)(editorOffCell.get()))
    }

    let ItemResponse;
    (function (ItemResponse) {
      ItemResponse[ItemResponse.CLOSE_ON_EXECUTE = 0] = 'CLOSE_ON_EXECUTE'
      ItemResponse[ItemResponse.BUBBLE_TO_SANDBOX = 1] = 'BUBBLE_TO_SANDBOX'
    }(ItemResponse || (ItemResponse = {})))
    const ItemResponse$1 = ItemResponse

    const onMenuItemExecute = function (info, itemResponse) {
      return runOnExecute((comp, simulatedEvent) => {
        runWithApi(info, comp)(info.onAction)
        if (!info.triggersSubmenu && itemResponse === ItemResponse$1.CLOSE_ON_EXECUTE) {
          emit(comp, sandboxClose())
          simulatedEvent.stop()
        }
      })
    }
    const menuItemEventOrder = {
      'alloy.execute': [
        'disabling',
        'alloy.base.behaviour',
        'toggling',
        'item-events',
      ],
    }

    const componentRenderPipeline = function (xs) {
      return bind(xs, (o) => o.toArray())
    }
    const renderCommonItem = function (spec, structure, itemResponse) {
      const editorOffCell = Cell(noop)
      return {
        type: 'item',
        dom: structure.dom,
        components: componentRenderPipeline(structure.optComponents),
        data: spec.data,
        eventOrder: menuItemEventOrder,
        hasSubmenu: spec.triggersSubmenu,
        itemBehaviours: derive$1([
          config('item-events', [
            onMenuItemExecute(spec, itemResponse),
            onControlAttached(spec, editorOffCell),
            onControlDetached(spec, editorOffCell),
          ]),
          DisablingConfigs.item(spec.disabled),
          Replacing.config({}),
        ].concat(spec.itemBehaviours)),
      }
    }
    const buildData = function (source) {
      return {
        value: source.value,
        meta: merge({ text: source.text.getOr('') }, source.meta),
      }
    }

    const renderAutocompleteItem = function (spec, useText, presets, onItemValueHandler, itemResponse, providersBackstage) {
      const structure = renderItemStructure({
        presets,
        textContent: useText ? spec.text : Option.none(),
        ariaLabel: spec.text,
        iconContent: spec.icon,
        shortcutContent: Option.none(),
        checkMark: Option.none(),
        caret: Option.none(),
        value: spec.value,
      }, providersBackstage, spec.icon)
      return renderCommonItem({
        data: buildData(spec),
        disabled: spec.disabled,
        getApi() {
          return {}
        },
        onAction(_api) {
          return onItemValueHandler(spec.value, spec.meta)
        },
        onSetup() {
          return function () {
          }
        },
        triggersSubmenu: false,
        itemBehaviours: [],
      }, structure, itemResponse)
    }
    const renderChoiceItem = function (spec, useText, presets, onItemValueHandler, isSelected, itemResponse, providersBackstage) {
      const getApi = function (component) {
        return {
          setActive(state) {
            Toggling.set(component, state)
          },
          isActive() {
            return Toggling.isOn(component)
          },
          isDisabled() {
            return Disabling.isDisabled(component)
          },
          setDisabled(state) {
            return state ? Disabling.disable(component) : Disabling.enable(component)
          },
        }
      }
      const structure = renderItemStructure({
        presets,
        textContent: useText ? spec.text : Option.none(),
        ariaLabel: spec.text,
        iconContent: spec.icon,
        shortcutContent: useText ? spec.shortcut : Option.none(),
        checkMark: useText ? Option.some(renderCheckmark(providersBackstage.icons)) : Option.none(),
        caret: Option.none(),
        value: spec.value,
      }, providersBackstage)
      return deepMerge(renderCommonItem({
        data: buildData(spec),
        disabled: spec.disabled,
        getApi,
        onAction(_api) {
          return onItemValueHandler(spec.value)
        },
        onSetup(api) {
          api.setActive(isSelected)
          return function () {
          }
        },
        triggersSubmenu: false,
        itemBehaviours: [],
      }, structure, itemResponse), {
        toggling: {
          toggleClass: tickedClass,
          toggleOnExecute: false,
          selected: spec.active,
        },
      })
    }

    const parts$2 = constant(generate$4(owner$2(), parts()))

    const cellOverEvent = generate$1('cell-over')
    const cellExecuteEvent = generate$1('cell-execute')
    const makeCell = function (row, col, labelId) {
      let _a
      const emitCellOver = function (c) {
        return emitWith(c, cellOverEvent, {
          row,
          col,
        })
      }
      const emitExecute$$1 = function (c) {
        return emitWith(c, cellExecuteEvent, {
          row,
          col,
        })
      }
      return build$1({
        dom: {
          tag: 'div',
          attributes: (_a = { role: 'button' }, _a['aria-labelledby'] = labelId, _a),
        },
        behaviours: derive$1([
          config('insert-table-picker-cell', [
            run(mouseover(), Focusing.focus),
            run(execute(), emitExecute$$1),
            run(tapOrClick(), emitExecute$$1),
          ]),
          Toggling.config({
            toggleClass: 'tox-insert-table-picker__selected',
            toggleOnExecute: false,
          }),
          Focusing.config({ onFocus: emitCellOver }),
        ]),
      })
    }
    const makeCells = function (labelId, numRows, numCols) {
      const cells = []
      for (let i = 0; i < numRows; i++) {
        const row = []
        for (let j = 0; j < numCols; j++) {
          row.push(makeCell(i, j, labelId))
        }
        cells.push(row)
      }
      return cells
    }
    const selectCells = function (cells, selectedRow, selectedColumn, numRows, numColumns) {
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
          Toggling.set(cells[i][j], i <= selectedRow && j <= selectedColumn)
        }
      }
    }
    const makeComponents = function (cells) {
      return bind(cells, (cellRow) => map(cellRow, premade$1))
    }
    const makeLabelText = function (row, col) {
      return text(`${col + 1}x${row + 1}`)
    }
    function renderInsertTableMenuItem(spec) {
      const numRows = 10
      const numColumns = 10
      const sizeLabelId = generate$1('size-label')
      const cells = makeCells(sizeLabelId, numRows, numColumns)
      const memLabel = record({
        dom: {
          tag: 'span',
          classes: ['tox-insert-table-picker__label'],
          attributes: { id: sizeLabelId },
        },
        components: [text('0x0')],
        behaviours: derive$1([Replacing.config({})]),
      })
      return {
        type: 'widget',
        data: { value: generate$1('widget-id') },
        dom: {
          tag: 'div',
          classes: ['tox-fancymenuitem'],
        },
        autofocus: true,
        components: [parts$2().widget({
          dom: {
            tag: 'div',
            classes: ['tox-insert-table-picker'],
          },
          components: makeComponents(cells).concat(memLabel.asSpec()),
          behaviours: derive$1([
            config('insert-table-picker', [
              runWithTarget(cellOverEvent, (c, t, e) => {
                const row = e.event().row()
                const col = e.event().col()
                selectCells(cells, row, col, numRows, numColumns)
                Replacing.set(memLabel.get(c), [makeLabelText(row, col)])
              }),
              runWithTarget(cellExecuteEvent, (c, _, e) => {
                spec.onAction({
                  numRows: e.event().row() + 1,
                  numColumns: e.event().col() + 1,
                })
                emit(c, sandboxClose())
              }),
            ]),
            Keying.config({
              initSize: {
                numRows,
                numColumns,
              },
              mode: 'flatgrid',
              selector: '[role="button"]',
            }),
          ]),
        })],
      }
    }

    const fancyMenuItems = { inserttable: renderInsertTableMenuItem }
    const valueOpt = function (obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key) ? Option.some(obj[key]) : Option.none()
    }
    const renderFancyMenuItem = function (spec) {
      return valueOpt(fancyMenuItems, spec.fancytype).map((render) => render(spec))
    }

    const renderNormalItem = function (spec, itemResponse, providersBackstage) {
      const getApi = function (component) {
        return {
          isDisabled() {
            return Disabling.isDisabled(component)
          },
          setDisabled(state) {
            return state ? Disabling.disable(component) : Disabling.enable(component)
          },
        }
      }
      const structure = renderItemStructure({
        presets: 'normal',
        iconContent: spec.icon,
        textContent: spec.text,
        ariaLabel: spec.text,
        caret: Option.none(),
        checkMark: Option.none(),
        shortcutContent: spec.shortcut,
      }, providersBackstage)
      return renderCommonItem({
        data: buildData(spec),
        getApi,
        disabled: spec.disabled,
        onAction: spec.onAction,
        onSetup: spec.onSetup,
        triggersSubmenu: false,
        itemBehaviours: [],
      }, structure, itemResponse)
    }

    const renderNestedItem = function (spec, itemResponse, providersBackstage) {
      const caret = renderSubmenuCaret(providersBackstage.icons)
      const getApi = function (component) {
        return {
          isDisabled() {
            return Disabling.isDisabled(component)
          },
          setDisabled(state) {
            return state ? Disabling.disable(component) : Disabling.enable(component)
          },
        }
      }
      const structure = renderItemStructure({
        presets: 'normal',
        iconContent: spec.icon,
        textContent: spec.text,
        ariaLabel: spec.text,
        caret: Option.some(caret),
        checkMark: Option.none(),
        shortcutContent: spec.shortcut,
      }, providersBackstage)
      return renderCommonItem({
        data: buildData(spec),
        getApi,
        disabled: spec.disabled,
        onAction: noop,
        onSetup: spec.onSetup,
        triggersSubmenu: true,
        itemBehaviours: [],
      }, structure, itemResponse)
    }

    const renderSeparatorItem = function (spec) {
      const innerHtml = spec.text.fold(() => ({}), (text) => ({ innerHtml: text }))
      return {
        type: 'separator',
        dom: __assign({
          tag: 'div',
          classes: [
            selectableClass,
            groupHeadingClass,
          ],
        }, innerHtml),
        components: [],
      }
    }

    const renderStyledText = function (tag, styleAttr, text$$1) {
      return simple$1('span', [textClass], [{
        dom: {
          tag,
          attributes: { style: styleAttr },
        },
        components: [text(text$$1)],
      }])
    }
    const renderStyleStructure = function (optTextContent, meta, checkMark) {
      return {
        dom: {
          tag: 'div',
          classes: [
            navClass,
            selectableClass,
          ],
        },
        optComponents: [
          Option.some(checkMark),
          optTextContent.map((text$$1) => renderStyledText(meta.tag, meta.styleAttr, text$$1)),
        ],
      }
    }

    const renderStyleItem = function (spec, itemResponse, providersBackstage) {
      const checkMark = spec.type === 'togglemenuitem' && spec.active ? renderCheckmark(providersBackstage.icons) : renderIcon('')
      const structure = renderStyleStructure(spec.text, spec.meta, checkMark)
      return deepMerge(renderCommonItem({
        data: buildData(spec),
        disabled: spec.disabled,
        getApi() {
          return 10
        },
        onAction: spec.onAction,
        onSetup() {
          return function () {
          }
        },
        triggersSubmenu: false,
        itemBehaviours: [],
      }, structure, itemResponse), spec.type === 'togglemenuitem' ? {
        toggling: {
          toggleClass: tickedClass,
          toggleOnExecute: false,
          selected: spec.active,
        },
      } : {})
    }

    const renderToggleMenuItem = function (spec, itemResponse, providersBackstage) {
      const getApi = function (component) {
        return {
          setActive(state) {
            Toggling.set(component, state)
          },
          isActive() {
            return Toggling.isOn(component)
          },
          isDisabled() {
            return Disabling.isDisabled(component)
          },
          setDisabled(state) {
            return state ? Disabling.disable(component) : Disabling.enable(component)
          },
        }
      }
      const structure = renderItemStructure({
        iconContent: Option.none(),
        textContent: spec.text,
        ariaLabel: spec.text,
        checkMark: Option.some(renderCheckmark(providersBackstage.icons)),
        caret: Option.none(),
        shortcutContent: spec.shortcut,
        presets: 'normal',
      }, providersBackstage)
      return deepMerge(renderCommonItem({
        data: buildData(spec),
        disabled: spec.disabled,
        getApi,
        onAction: spec.onAction,
        onSetup: spec.onSetup,
        triggersSubmenu: false,
        itemBehaviours: [],
      }, structure, itemResponse), {
        toggling: {
          toggleClass: tickedClass,
          toggleOnExecute: false,
          selected: spec.active,
        },
      })
    }

    const choice = renderChoiceItem
    const autocomplete = renderAutocompleteItem
    const separator = renderSeparatorItem
    const style = renderStyleItem
    const normal = renderNormalItem
    const nested = renderNestedItem
    const toggle$4 = renderToggleMenuItem
    const fancy = renderFancyMenuItem

    const forMenu = function (presets) {
      if (presets === 'color') {
        return 'tox-swatches'
      }
      return 'tox-menu'
    }
    const classes = function (presets) {
      return {
        backgroundMenu: 'tox-background-menu',
        selectedMenu: 'tox-selected-menu',
        selectedItem: 'tox-collection__item--active',
        hasIcons: 'tox-menu--has-icons',
        menu: forMenu(presets),
        tieredMenu: 'tox-tiered-menu',
      }
    }

    const markers$1 = function (presets) {
      const menuClasses = classes(presets)
      return {
        backgroundMenu: menuClasses.backgroundMenu,
        selectedMenu: menuClasses.selectedMenu,
        menu: menuClasses.menu,
        selectedItem: menuClasses.selectedItem,
        item: classForPreset(presets),
      }
    }
    const dom$2 = function (hasIcons, columns, presets) {
      const menuClasses = classes(presets)
      return {
        tag: 'div',
        classes: flatten([
          [
            menuClasses.menu,
            `tox-menu-${columns}-column`,
          ],
          hasIcons ? [menuClasses.hasIcons] : [],
        ]),
      }
    }
    const components$1 = [Menu.parts().items({})]
    const part = function (hasIcons, columns, presets) {
      const menuClasses = classes(presets)
      const d = {
        tag: 'div',
        classes: flatten([[menuClasses.tieredMenu]]),
      }
      return {
        dom: d,
        markers: markers$1(presets),
      }
    }

    const deriveMenuMovement = function (columns, presets) {
      const menuMarkers = markers$1(presets)
      if (columns === 1) {
        return {
          mode: 'menu',
          moveOnTab: true,
        }
      } if (columns === 'auto') {
        return {
          mode: 'grid',
          selector: `.${menuMarkers.item}`,
          initSize: {
            numColumns: 1,
            numRows: 1,
          },
        }
      }
      const rowClass = presets === 'color' ? 'tox-swatches__row' : 'tox-collection__group'
      return {
        mode: 'matrix',
        rowSelector: `.${rowClass}`,
      }
    }
    const deriveCollectionMovement = function (columns, presets) {
      if (columns === 1) {
        return {
          mode: 'menu',
          moveOnTab: false,
          selector: '.tox-collection__item',
        }
      } if (columns === 'auto') {
        return {
          mode: 'flatgrid',
          selector: '.' + 'tox-collection__item',
          initSize: {
            numColumns: 1,
            numRows: 1,
          },
        }
      }
      return {
        mode: 'matrix',
        selectors: {
          row: presets === 'color' ? '.tox-swatches__row' : '.tox-collection__group',
          cell: presets === 'color' ? `.${colorClass}` : `.${selectableClass}`,
        },
      }
    }

    const chunk$1 = function (rowDom, numColumns) {
      return function (items) {
        const chunks = chunk(items, numColumns)
        return map(chunks, (c) => ({
          dom: rowDom,
          components: c,
        }))
      }
    }
    const forSwatch = function (columns) {
      return {
        dom: {
          tag: 'div',
          classes: ['tox-menu'],
        },
        components: [{
          dom: {
            tag: 'div',
            classes: ['tox-swatches'],
          },
          components: [Menu.parts().items({
            preprocess: columns !== 'auto' ? chunk$1({
              tag: 'div',
              classes: ['tox-swatches__row'],
            }, columns) : identity,
          })],
        }],
      }
    }
    const forToolbar = function (columns) {
      return {
        dom: {
          tag: 'div',
          classes: [
            'tox-menu',
            'tox-collection',
            'tox-collection--toolbar',
            'tox-collection--toolbar-lg',
          ],
        },
        components: [Menu.parts().items({
          preprocess: chunk$1({
            tag: 'div',
            classes: ['tox-collection__group'],
          }, columns),
        })],
      }
    }
    const preprocessCollection = function (items, isSeparator) {
      const allSplits = []
      let currentSplit = []
      each(items, (item, i) => {
        if (isSeparator(item, i)) {
          if (currentSplit.length > 0) {
            allSplits.push(currentSplit)
          }
          currentSplit = []
          if (has(item.dom, 'innerHtml')) {
            currentSplit.push(item)
          }
        } else {
          currentSplit.push(item)
        }
      })
      if (currentSplit.length > 0) {
        allSplits.push(currentSplit)
      }
      return map(allSplits, (s) => ({
        dom: {
          tag: 'div',
          classes: ['tox-collection__group'],
        },
        components: s,
      }))
    }
    const forCollection = function (columns, initItems) {
      return {
        dom: {
          tag: 'div',
          classes: [
            'tox-menu',
            'tox-collection',
          ].concat(columns === 1 ? ['tox-collection--list'] : ['tox-collection--grid']),
        },
        components: [Menu.parts().items({
          preprocess(items) {
            if (columns !== 'auto' && columns > 1) {
              return chunk$1({
                tag: 'div',
                classes: ['tox-collection__group'],
              }, columns)(items)
            }
            return preprocessCollection(items, (item, i) => initItems[i].type === 'separator')
          },
        })],
      }
    }

    let FocusMode;
    (function (FocusMode) {
      FocusMode[FocusMode.ContentFocus = 0] = 'ContentFocus'
      FocusMode[FocusMode.UiFocus = 1] = 'UiFocus'
    }(FocusMode || (FocusMode = {})))
    const handleError = function (error) {
      console.error(formatError(error))
      console.log(error)
      return Option.none()
    }
    const hasIcon = function (item) {
      return item.icon !== undefined
    }
    const menuHasIcons = function (xs) {
      return exists(xs, hasIcon)
    }
    const createMenuItemFromBridge = function (item, itemResponse, providersBackstage) {
      switch (item.type) {
        case 'menuitem':
          return createMenuItem(item).fold(handleError, (d) => Option.some(normal(d, itemResponse, providersBackstage)))
        case 'nestedmenuitem':
          return createNestedMenuItem(item).fold(handleError, (d) => Option.some(nested(d, itemResponse, providersBackstage)))
        case 'styleitem': {
          if (item.item.type === 'menuitem') {
            return createMenuItem(item.item).fold(handleError, (d) => Option.some(style(d, itemResponse, providersBackstage)))
          } if (item.item.type === 'togglemenuitem') {
            return createToggleMenuItem(item.item).fold(handleError, (d) => Option.some(style(d, itemResponse, providersBackstage)))
          }
          console.error('Unsupported style item delegate', item.item)
          return Option.none()
        }
        case 'togglemenuitem':
          return createToggleMenuItem(item).fold(handleError, (d) => Option.some(toggle$4(d, itemResponse, providersBackstage)))
        case 'separator':
          return createSeparatorMenuItem(item).fold(handleError, (d) => Option.some(separator(d)))
        case 'fancymenuitem':
          return createFancyMenuItem(item).fold(handleError, (d) => fancy(d))
        default: {
          console.error('Unknown item in general menu', item)
          return Option.none()
        }
      }
    }
    const createPartialMenuWithAlloyItems = function (value, hasIcons, items, columns, presets) {
      if (presets === 'color') {
        var structure = forSwatch(columns)
        return {
          value,
          dom: structure.dom,
          components: structure.components,
          items,
        }
      }
      if (presets === 'normal' && columns === 'auto') {
        var structure = forCollection(columns, items)
        return {
          value,
          dom: structure.dom,
          components: structure.components,
          items,
        }
      }
      if (presets === 'normal' && columns === 1) {
        var structure = forCollection(1, items)
        return {
          value,
          dom: structure.dom,
          components: structure.components,
          items,
        }
      }
      if (presets === 'normal') {
        var structure = forCollection(columns, items)
        return {
          value,
          dom: structure.dom,
          components: structure.components,
          items,
        }
      }
      if (presets === 'toolbar' && columns !== 'auto') {
        var structure = forToolbar(columns)
        return {
          value,
          dom: structure.dom,
          components: structure.components,
          items,
        }
      }
      return {
        value,
        dom: dom$2(hasIcons, columns, presets),
        components: components$1,
        items,
      }
    }
    const createChoiceItems = function (items, onItemValueHandler, columns, itemPresets, itemResponse, select, providersBackstage) {
      return cat(map(items, (item) => {
        if (item.type === 'choiceitem') {
          return createChoiceMenuItem(item).fold(handleError, (d) => Option.some(choice(d, columns === 1, itemPresets, onItemValueHandler, select(item.value), itemResponse, providersBackstage)))
        }
        return Option.none()
      }))
    }
    const createAutocompleteItems = function (items, onItemValueHandler, columns, itemResponse, providersBackstage) {
      return cat(map(items, (item) => createAutocompleterItem(item).fold(handleError, (d) => Option.some(autocomplete(d, columns === 1, 'normal', onItemValueHandler, itemResponse, providersBackstage)))))
    }
    const createPartialChoiceMenu = function (value, items, onItemValueHandler, columns, presets, itemResponse, select, providersBackstage) {
      const hasIcons = menuHasIcons(items)
      const presetItemTypes = presets !== 'color' ? 'normal' : 'color'
      const alloyItems = createChoiceItems(items, onItemValueHandler, columns, presetItemTypes, itemResponse, select, providersBackstage)
      return createPartialMenuWithAlloyItems(value, hasIcons, alloyItems, columns, presets)
    }
    const createPartialMenu = function (value, items, itemResponse, providersBackstage) {
      const hasIcons = menuHasIcons(items)
      const alloyItems = cat(map(items, (item) => createMenuItemFromBridge(item, itemResponse, providersBackstage)))
      return createPartialMenuWithAlloyItems(value, hasIcons, alloyItems, 1, 'normal')
    }
    const createTieredDataFrom = function (partialMenu) {
      return tieredMenu.singleData(partialMenu.value, partialMenu)
    }
    const createMenuFrom = function (partialMenu, columns, focusMode, presets) {
      const focusManager = focusMode === FocusMode.ContentFocus ? highlights() : dom()
      const movement = deriveMenuMovement(columns, presets)
      const menuMarkers = markers$1(presets)
      return {
        dom: partialMenu.dom,
        components: partialMenu.components,
        items: partialMenu.items,
        value: partialMenu.value,
        markers: {
          selectedItem: menuMarkers.selectedItem,
          item: menuMarkers.item,
        },
        movement,
        fakeFocus: focusMode === FocusMode.ContentFocus,
        focusManager,
        menuBehaviours: SimpleBehaviours.unnamedEvents(columns !== 'auto' ? [] : [runOnAttached((comp, se) => {
          detectSize(comp, 4, menuMarkers.item).each((_a) => {
            const { numColumns } = _a; const { numRows } = _a
            Keying.setGridSize(comp, numRows, numColumns)
          })
        })]),
      }
    }

    const register$1 = function (editor, sharedBackstage) {
      const autocompleter = build$1(InlineView.sketch({
        dom: {
          tag: 'div',
          classes: ['tox-autocompleter'],
        },
        components: [],
        lazySink: sharedBackstage.getSink,
      }))
      const isActive = function () {
        return InlineView.isOpen(autocompleter)
      }
      const closeIfNecessary = function () {
        if (isActive()) {
          InlineView.hide(autocompleter)
        }
      }
      const getAutocompleters = cached(() => register(editor))
      const getCombinedItems = function (triggerChar, matches) {
        const columns = findMap(matches, (m) => Option.from(m.columns)).getOr(1)
        return bind(matches, (match) => {
          const choices = match.items
          return createAutocompleteItems(choices, (itemValue, itemMeta) => {
            const nr = editor.selection.getRng()
            const textNode = nr.startContainer
            getContext(nr, triggerChar, textNode.data, nr.startOffset).fold(() => console.error('Lost context. Cursor probably moved'), (_a) => {
              const { rng } = _a
              const autocompleterApi = { hide: closeIfNecessary }
              match.onAction(autocompleterApi, rng, itemValue, itemMeta)
            })
          }, columns, ItemResponse$1.BUBBLE_TO_SANDBOX, sharedBackstage.providers)
        })
      }
      const onKeypress = last$3((e) => {
        const optMatches = e.key === ' ' ? Option.none() : lookup(editor, getAutocompleters)
        optMatches.fold(closeIfNecessary, (lookupInfo) => {
          lookupInfo.lookupData.then((lookupData) => {
            const combinedItems = getCombinedItems(lookupInfo.triggerChar, lookupData)
            if (combinedItems.length > 0) {
              const columns = findMap(lookupData, (ld) => Option.from(ld.columns)).getOr(1)
              InlineView.showAt(autocompleter, {
                anchor: 'selection',
                root: Element$$1.fromDom(editor.getBody()),
                getSelection() {
                  return Option.some({
                    start() {
                      return Element$$1.fromDom(lookupInfo.range.startContainer)
                    },
                    soffset() {
                      return lookupInfo.range.startOffset
                    },
                    finish() {
                      return Element$$1.fromDom(lookupInfo.range.endContainer)
                    },
                    foffset() {
                      return lookupInfo.range.endOffset
                    },
                  })
                },
              }, Menu.sketch(createMenuFrom(createPartialMenuWithAlloyItems('autocompleter-value', true, combinedItems, columns, 'normal'), columns, FocusMode.ContentFocus, 'normal')))
              InlineView.getContent(autocompleter).each(Highlighting.highlightFirst)
            } else {
              closeIfNecessary()
            }
          })
        })
      }, 50)
      const autocompleterUiApi = {
        onKeypress,
        closeIfNecessary,
        isActive,
        getView() {
          return InlineView.getContent(autocompleter)
        },
      }
      AutocompleterEditorEvents.setup(autocompleterUiApi, editor)
    }
    const Autocompleter = { register: register$1 }

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
    const capture$1 = function (element, event, filter, handler) {
      return binder(element, event, filter, handler, true)
    }
    var unbind = function (element, event, handler, useCapture) {
      element.dom().removeEventListener(event, handler, useCapture)
    }

    const filter$1 = constant(true)
    const bind$3 = function (element, event, handler) {
      return bind$2(element, event, filter$1, handler)
    }
    const capture$2 = function (element, event, handler) {
      return capture$1(element, event, filter$1, handler)
    }

    const closest$4 = function (scope, selector, isRoot) {
      return closest$3(scope, selector, isRoot).isSome()
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
        return capture$2(container, 'focus', handler)
      }
      return bind$3(container, 'focusin', handler)
    }
    const bindBlur = function (container, handler) {
      if (isFirefox) {
        return capture$2(container, 'blur', handler)
      }
      return bind$3(container, 'focusout', handler)
    }
    const setup$1 = function (container, rawSettings) {
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
      const simpleEvents = map(pointerEvents.concat([
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
        each(simpleEvents, (e) => {
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

    const adt$a = Adt.generate([
      { stopped: [] },
      { resume: ['element'] },
      { complete: [] },
    ])
    const doTriggerHandler = function (lookup, eventType, rawEvent, target, source, logger) {
      const handler = lookup(eventType, target)
      const simulatedEvent = fromSource(rawEvent, source)
      return handler.fold(() => {
        logger.logEventNoHandlers(eventType, target)
        return adt$a.complete()
      }, (handlerInfo) => {
        const descHandler = handlerInfo.descHandler()
        const eventHandler = getCurried(descHandler)
        eventHandler(simulatedEvent)
        if (simulatedEvent.isStopped()) {
          logger.logEventStopped(eventType, handlerInfo.element(), descHandler.purpose())
          return adt$a.stopped()
        } if (simulatedEvent.isCut()) {
          logger.logEventCut(eventType, handlerInfo.element(), descHandler.purpose())
          return adt$a.complete()
        }
        return parent(handlerInfo.element()).fold(() => {
          logger.logNoParent(eventType, handlerInfo.element(), descHandler.purpose())
          return adt$a.complete()
        }, (parent$$1) => {
          logger.logEventResponse(eventType, handlerInfo.element(), descHandler.purpose())
          return adt$a.resume(parent$$1)
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
      each(listeners, (listener) => {
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
        each$1(events, (v, k) => {
          const handlers = registry[k] !== undefined ? registry[k] : {}
          handlers[id] = curryArgs(v, extraArgs)
          registry[k] = handlers
        })
      }
      const findHandler = function (handlers, elem) {
        return read$1(elem).fold(() => Option.none(), (id) => {
          const reader = readOpt$1(id)
          return handlers.bind(reader).map((descHandler) => eventHandler(elem, descHandler))
        })
      }
      const filterByType = function (type) {
        return readOptFrom$1(registry, type).map((handlers) => mapToArray(handlers, (f, id) => broadcastHandler(id, f))).getOr([])
      }
      const find = function (isAboveRoot, type, target) {
        const readType = readOpt$1(type)
        const handlers = readType(registry)
        return closest$1(target, (elem) => findHandler(handlers, elem), isAboveRoot)
      }
      const unregisterId = function (id) {
        each$1(registry, (handlersById, eventName) => {
          if (handlersById.hasOwnProperty(id)) {
            delete handlersById[id]
          }
        })
      }
      return {
        registerId,
        unregisterId,
        filterByType,
        find,
      }
    }

    function Registry() {
      const events = EventRegistry()
      const components = {}
      const readOrTag = function (component) {
        const elem = component.element()
        return read$1(elem).fold(() => write('uid-', component.element()), (uid) => uid)
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
        read$1(component.element()).each((tagId) => {
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

    const factory$3 = function (detail) {
      const _a = detail.dom; const { attributes } = _a; const domWithoutAttributes = __rest(_a, ['attributes'])
      return {
        uid: detail.uid,
        dom: __assign({
          tag: 'div',
          attributes: __assign({ role: 'presentation' }, attributes),
        }, domWithoutAttributes),
        components: detail.components,
        behaviours: get$d(detail.containerBehaviours),
        events: detail.events,
        domModification: detail.domModification,
        eventOrder: detail.eventOrder,
      }
    }
    const Container = single$2({
      name: 'Container',
      factory: factory$3,
      configFields: [
        defaulted$1('components', []),
        field$1('containerBehaviours', []),
        defaulted$1('events', {}),
        defaulted$1('domModification', {}),
        defaulted$1('eventOrder', {}),
      ],
    })

    const takeover = function (root) {
      const isAboveRoot = function (el) {
        return parent(root.element()).fold(() => true, (parent$$1) => eq(el, parent$$1))
      }
      const registry = Registry()
      const lookup = function (eventName, target) {
        return registry.find(isAboveRoot, eventName, target)
      }
      const domEvents = setup$1(root.element(), {
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
          read$1(target).fold(() => {
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
          each(component.components(), addToWorld)
          systemApi.triggerEvent(systemInit(), component.element(), { target: constant(component.element()) })
        }
      }
      var removeFromWorld = function (component) {
        if (!isText(component.element())) {
          each(component.components(), removeFromWorld)
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
        each(receivers, (receiver) => {
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
        const uid = read$1(elem).getOr('not found')
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

    const global$4 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils')

    const global$5 = tinymce.util.Tools.resolve('tinymce.EditorManager')

    const getSkinUrl = function (editor) {
      const { settings } = editor
      const { skin } = settings
      let skinUrl = settings.skin_url
      if (skin !== false) {
        const skinName = skin || 'oxide'
        if (skinUrl) {
          skinUrl = editor.documentBaseURI.toAbsolute(skinUrl)
        } else {
          skinUrl = `${global$5.baseURL}/skins/ui/${skinName}`
        }
      }
      return skinUrl
    }
    const isReadOnly = function (editor) {
      return editor.getParam('readonly', false, 'boolean')
    }
    const isSkinDisabled = function (editor) {
      return editor.getParam('skin') === false
    }
    const getHeightSetting = function (editor) {
      return editor.getParam('height', Math.max(editor.getElement().offsetHeight, 200))
    }
    const getMinWidthSetting = function (editor) {
      return Option.from(editor.settings.min_width).filter(isNumber)
    }
    const getMinHeightSetting = function (editor) {
      return Option.from(editor.settings.min_height).filter(isNumber)
    }
    const getMaxWidthSetting = function (editor) {
      return Option.from(editor.getParam('max_width')).filter(isNumber)
    }
    const getMaxHeightSetting = function (editor) {
      return Option.from(editor.getParam('max_height')).filter(isNumber)
    }
    const getUserStyleFormats = function (editor) {
      return Option.from(editor.getParam('style_formats')).filter(isArray)
    }
    const isMergeStyleFormats = function (editor) {
      return editor.getParam('style_formats_merge', false, 'boolean')
    }
    const getRemovedMenuItems = function (editor) {
      return editor.getParam('removed_menuitems', '')
    }
    const isMenubarEnabled = function (editor) {
      return editor.getParam('menubar', true, 'boolean') !== false
    }
    const isToolbarEnabled = function (editor) {
      const toolbarConfig = editor.getParam('toolbar')
      if (isArray(toolbarConfig)) {
        return toolbarConfig.length > 0
      }
      return editor.getParam('toolbar', true, 'boolean') !== false
    }
    const getMultipleToolbarsSetting = function (editor) {
      const keys$$1 = keys(editor.settings)
      const toolbarKeys = filter(keys$$1, (key) => /^toolbar([1-9])$/.test(key))
      const toolbars = map(toolbarKeys, (key) => editor.getParam(key, false, 'string'))
      const toolbarArray = filter(toolbars, (toolbar) => typeof toolbar === 'string')
      return toolbarArray.length > 0 ? Option.some(toolbarArray) : Option.none()
    }

    const formChangeEvent = generate$1('form-component-change')
    const formCloseEvent = generate$1('form-close')
    const formCancelEvent = generate$1('form-cancel')
    const formActionEvent = generate$1('form-action')
    const formSubmitEvent = generate$1('form-submit')
    const formBlockEvent = generate$1('form-block')
    const formUnblockEvent = generate$1('form-unblock')
    const formTabChangeEvent = generate$1('form-tabchange')
    const formResizeEvent = generate$1('form-resize')

    const renderAlertBanner = function (spec, providersBackstage) {
      return Container.sketch({
        dom: {
          tag: 'div',
          attributes: { role: 'alert' },
          classes: [
            'tox-notification',
            'tox-notification--in',
            `tox-notification--${spec.level}`,
          ],
        },
        components: [
          {
            dom: {
              tag: 'div',
              classes: ['tox-notification__body'],
              innerHtml: providersBackstage.translate(spec.text),
            },
          },
          Button.sketch({
            dom: {
              tag: 'button',
              classes: [
                'tox-notification__right-icon',
                'tox-button',
                'tox-button--naked',
                'tox-button--icon',
              ],
              innerHtml: get$e(spec.icon, providersBackstage.icons),
              attributes: { title: providersBackstage.translate(spec.actionLabel) },
            },
            action(comp) {
              emitWith(comp, formActionEvent, {
                name: 'alert-banner',
                value: spec.url,
              })
            },
          }),
        ],
      })
    }

    const schema$d = constant([
      defaulted$1('prefix', 'form-field'),
      field$1('fieldBehaviours', [
        Composing,
        Representing,
      ]),
    ])
    const parts$3 = constant([
      optional({
        schema: [strict$1('dom')],
        name: 'label',
      }),
      optional({
        factory: {
          sketch(spec) {
            return {
              uid: spec.uid,
              dom: {
                tag: 'span',
                styles: { display: 'none' },
                attributes: { 'aria-hidden': 'true' },
                innerHtml: spec.text,
              },
            }
          },
        },
        schema: [strict$1('text')],
        name: 'aria-descriptor',
      }),
      required({
        factory: {
          sketch(spec) {
            const excludeFactory = exclude$1(spec, ['factory'])
            return spec.factory.sketch(excludeFactory)
          },
        },
        schema: [strict$1('factory')],
        name: 'field',
      }),
    ])

    const factory$4 = function (detail, components$$1, spec, externals) {
      const behaviours = augment(detail.fieldBehaviours, [
        Composing.config({
          find(container) {
            return getPart(container, detail, 'field')
          },
        }),
        Representing.config({
          store: {
            mode: 'manual',
            getValue(field) {
              return Composing.getCurrent(field).bind(Representing.getValue)
            },
            setValue(field, value) {
              Composing.getCurrent(field).each((current) => {
                Representing.setValue(current, value)
              })
            },
          },
        }),
      ])
      const events = derive([runOnAttached((component, simulatedEvent) => {
        const ps = getParts(component, detail, [
          'label',
          'field',
          'aria-descriptor',
        ])
        ps.field().each((field) => {
          const id = generate$1(detail.prefix)
          ps.label().each((label) => {
            set$1(label.element(), 'for', id)
            set$1(field.element(), 'id', id)
          })
          ps['aria-descriptor']().each((descriptor) => {
            const descriptorId = generate$1(detail.prefix)
            set$1(descriptor.element(), 'id', descriptorId)
            set$1(field.element(), 'aria-describedby', descriptorId)
          })
        })
      })])
      const apis = {
        getField(container) {
          return getPart(container, detail, 'field')
        },
        getLabel(container) {
          return getPart(container, detail, 'label')
        },
      }
      return {
        uid: detail.uid,
        dom: detail.dom,
        components: components$$1,
        behaviours,
        events,
        apis,
      }
    }
    const FormField = composite$1({
      name: 'FormField',
      configFields: schema$d(),
      partFields: parts$3(),
      factory: factory$4,
      apis: {
        getField(apis, comp) {
          return apis.getField(comp)
        },
        getLabel(apis, comp) {
          return apis.getLabel(comp)
        },
      },
    })

    const getCoupled = function (component, coupleConfig, coupleState, name) {
      return coupleState.getOrCreate(component, coupleConfig, name)
    }

    const CouplingApis = /* #__PURE__ */Object.freeze({
      getCoupled,
    })

    const CouplingSchema = [strictOf('others', setOf$1(Result.value, anyValue$1()))]

    const init$5 = function (spec) {
      const coupled = {}
      const getOrCreate = function (component, coupleConfig, name) {
        const available = keys(coupleConfig.others)
        if (!available) {
          throw new Error(`Cannot find coupled component: ${name}. Known coupled components: ${JSON$1.stringify(available, null, 2)}`)
        } else {
          return readOptFrom$1(coupled, name).getOrThunk(() => {
            const builder = readOptFrom$1(coupleConfig.others, name).getOrDie(`No information found for coupled component: ${name}`)
            const spec = builder(component)
            const built = component.getSystem().build(spec)
            coupled[name] = built
            return built
          })
        }
      }
      const readState = constant({})
      return nu$5({
        readState,
        getOrCreate,
      })
    }

    const CouplingState = /* #__PURE__ */Object.freeze({
      init: init$5,
    })

    const Coupling = create$1({
      fields: CouplingSchema,
      name: 'coupling',
      apis: CouplingApis,
      state: CouplingState,
    })

    const events$9 = function (streamConfig, streamState) {
      const { streams } = streamConfig.stream
      const processor = streams.setup(streamConfig, streamState)
      return derive([
        run(streamConfig.event, processor),
        runOnDetached(() => streamState.cancel()),
      ].concat(streamConfig.cancelEvent.map((e) => [run(e, () => streamState.cancel())]).getOr([])))
    }

    const ActiveStreaming = /* #__PURE__ */Object.freeze({
      events: events$9,
    })

    const throttle = function (_config) {
      const state = Cell(null)
      const readState = function () {
        return { timer: state.get() !== null ? 'set' : 'unset' }
      }
      const setTimer = function (t) {
        state.set(t)
      }
      const cancel = function () {
        const t = state.get()
        if (t !== null) {
          t.cancel()
        }
      }
      return nu$5({
        readState,
        setTimer,
        cancel,
      })
    }
    const init$6 = function (spec) {
      return spec.stream.streams.state(spec)
    }

    const StreamingState = /* #__PURE__ */Object.freeze({
      throttle,
      init: init$6,
    })

    const setup$2 = function (streamInfo, streamState) {
      const sInfo = streamInfo.stream
      const throttler = last$3(streamInfo.onStream, sInfo.delay)
      streamState.setTimer(throttler)
      return function (component, simulatedEvent) {
        throttler.throttle(component, simulatedEvent)
        if (sInfo.stopEvent) {
          simulatedEvent.stop()
        }
      }
    }
    const StreamingSchema = [
      strictOf('stream', choose$1('mode', {
        throttle: [
          strict$1('delay'),
          defaulted$1('stopEvent', true),
          output$1('streams', {
            setup: setup$2,
            state: throttle,
          }),
        ],
      })),
      defaulted$1('event', 'input'),
      option('cancelEvent'),
      onStrictHandler('onStream'),
    ]

    const Streaming = create$1({
      fields: StreamingSchema,
      name: 'streaming',
      active: ActiveStreaming,
      state: StreamingState,
    })

    var nu$a = function (baseFn) {
      let data = Option.none()
      let callbacks = []
      const map$$1 = function (f) {
        return nu$a((nCallback) => {
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
      return nu$a((callback) => {
        callback(a)
      })
    }
    const LazyValue = {
      nu: nu$a,
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

    var nu$b = function (baseFn) {
      const get = function (callback) {
        baseFn(bounce(callback))
      }
      const map = function (fab) {
        return nu$b((callback) => {
          get((a) => {
            const value = fab(a)
            callback(value)
          })
        })
      }
      const bind = function (aFutureB) {
        return nu$b((callback) => {
          get((a) => {
            aFutureB(a).get(callback)
          })
        })
      }
      const anonBind = function (futureB) {
        return nu$b((callback) => {
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
        return nu$b((callback) => {
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
      return nu$b((callback) => {
        callback(a)
      })
    }
    const Future = {
      nu: nu$b,
      pure: pure$2,
    }

    const suffix = constant('sink')
    const partType = constant(optional({
      name: suffix(),
      overrides: constant({
        dom: { tag: 'div' },
        behaviours: derive$1([Positioning.config({ useFixed: true })]),
        events: derive([
          cutter(keydown()),
          cutter(mousedown()),
          cutter(click()),
        ]),
      }),
    }))

    let HighlightOnOpen;
    (function (HighlightOnOpen) {
      HighlightOnOpen[HighlightOnOpen.HighlightFirst = 0] = 'HighlightFirst'
      HighlightOnOpen[HighlightOnOpen.HighlightNone = 1] = 'HighlightNone'
    }(HighlightOnOpen || (HighlightOnOpen = {})))
    const getAnchor = function (detail, component) {
      const ourHotspot = detail.getHotspot(component).getOr(component)
      const anchor = 'hotspot'
      return detail.layouts.fold(() => ({
        anchor,
        hotspot: ourHotspot,
      }), (layouts) => ({
        anchor,
        hotspot: ourHotspot,
        layouts,
      }))
    }
    const fetch = function (detail, mapFetch, component) {
      const fetcher = detail.fetch
      return fetcher(component).map(mapFetch)
    }
    const openF = function (detail, mapFetch, anchor, component, sandbox, externals, highlightOnOpen) {
      const futureData = fetch(detail, mapFetch, component)
      const getLazySink = getSink(component, detail)
      return futureData.map((data) => tieredMenu.sketch(__assign({}, externals.menu(), {
        uid: generate$2(''),
        data,
        highlightImmediately: highlightOnOpen === HighlightOnOpen.HighlightFirst,
        onOpenMenu(tmenu, menu) {
          const sink = getLazySink().getOrDie()
          Positioning.position(sink, anchor, menu)
          Sandboxing.decloak(sandbox)
        },
        onOpenSubmenu(tmenu, item, submenu) {
          const sink = getLazySink().getOrDie()
          Positioning.position(sink, {
            anchor: 'submenu',
            item,
          }, submenu)
          Sandboxing.decloak(sandbox)
        },
        onEscape() {
          Focusing.focus(component)
          Sandboxing.close(sandbox)
          return Option.some(true)
        },
      })))
    }
    const open$1 = function (detail, mapFetch, hotspot, sandbox, externals, onOpenSync, highlightOnOpen) {
      const anchor = getAnchor(detail, hotspot)
      const processed = openF(detail, mapFetch, anchor, hotspot, sandbox, externals, highlightOnOpen)
      return processed.map((data) => {
        Sandboxing.cloak(sandbox)
        Sandboxing.open(sandbox, data)
        onOpenSync(sandbox)
        return sandbox
      })
    }
    const close$1 = function (detail, mapFetch, component, sandbox, _externals, _onOpenSync, _highlightOnOpen) {
      Sandboxing.close(sandbox)
      return Future.pure(sandbox)
    }
    const togglePopup = function (detail, mapFetch, hotspot, externals, onOpenSync, highlightOnOpen) {
      const sandbox = Coupling.getCoupled(hotspot, 'sandbox')
      const showing = Sandboxing.isOpen(sandbox)
      const action = showing ? close$1 : open$1
      return action(detail, mapFetch, hotspot, sandbox, externals, onOpenSync, highlightOnOpen)
    }
    const matchWidth = function (hotspot, container, useMinWidth) {
      const menu = Composing.getCurrent(container).getOr(container)
      const buttonWidth = get$8(hotspot.element())
      if (useMinWidth) {
        set$2(menu.element(), 'min-width', `${buttonWidth}px`)
      } else {
        set$4(menu.element(), buttonWidth)
      }
    }
    var getSink = function (anyInSystem, sinkDetail) {
      return anyInSystem.getSystem().getByUid(`${sinkDetail.uid}-${suffix()}`).map((internalSink) => function () {
        return Result.value(internalSink)
      }).getOrThunk(() => sinkDetail.lazySink.fold(() => function () {
        return Result.error(new Error('No internal sink is specified, nor could an external sink be found'))
      }, (lazySinkFn) => function () {
        return lazySinkFn(anyInSystem)
      }))
    }
    const makeSandbox = function (detail, hotspot, extras) {
      const ariaOwner = manager()
      const onOpen = function (component, menu) {
        const anchor = getAnchor(detail, hotspot)
        ariaOwner.link(hotspot.element())
        if (detail.matchWidth) {
          matchWidth(anchor.hotspot, menu, detail.useMinWidth)
        }
        detail.onOpen(anchor, component, menu)
        if (extras !== undefined && extras.onOpen !== undefined) {
          extras.onOpen(component, menu)
        }
      }
      const onClose = function (component, menu) {
        ariaOwner.unlink(hotspot.element())
        if (extras !== undefined && extras.onClose !== undefined) {
          extras.onClose(component, menu)
        }
      }
      const lazySink = getSink(hotspot, detail)
      return {
        dom: {
          tag: 'div',
          classes: detail.sandboxClasses,
          attributes: { id: ariaOwner.id() },
        },
        behaviours: SketchBehaviours.augment(detail.sandboxBehaviours, [
          Representing.config({
            store: {
              mode: 'memory',
              initialValue: hotspot,
            },
          }),
          Sandboxing.config({
            onOpen,
            onClose,
            isPartOf(container, data, queryElem) {
              return isPartOf(data, queryElem) || isPartOf(hotspot, queryElem)
            },
            getAttachPoint() {
              return lazySink().getOrDie()
            },
          }),
          Composing.config({
            find(sandbox) {
              return Sandboxing.getState(sandbox).bind((menu) => Composing.getCurrent(menu))
            },
          }),
          receivingConfig({ isExtraPart: constant(false) }),
        ]),
      }
    }

    const setValueFromItem = function (model, input, item) {
      const itemData = Representing.getValue(item)
      Representing.setValue(input, itemData)
      setCursorAtEnd(input)
    }
    const setSelectionOn = function (input, f) {
      const el = input.element()
      const value = get$6(el)
      const node = el.dom()
      if (get$2(el, 'type') !== 'number') {
        f(node, value)
      }
    }
    var setCursorAtEnd = function (input) {
      setSelectionOn(input, (node, value) => node.setSelectionRange(value.length, value.length))
    }
    const setSelectionToEnd = function (input, startOffset) {
      setSelectionOn(input, (node, value) => node.setSelectionRange(startOffset, value.length))
    }
    const attemptSelectOver = function (model, input, item) {
      if (!model.selectsOver) {
        return Option.none()
      }
      const currentValue = Representing.getValue(input)
      const inputDisplay_1 = model.getDisplayText(currentValue)
      const itemValue = Representing.getValue(item)
      const itemDisplay = model.getDisplayText(itemValue)
      return itemDisplay.indexOf(inputDisplay_1) === 0 ? Option.some(() => {
        setValueFromItem(model, input, item)
        setSelectionToEnd(input, inputDisplay_1.length)
      }) : Option.none()
    }

    const schema$e = constant([
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
          const value = get$6(input)
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
            return get$6(input.element())
          },
          setValue(input, data) {
            const current = get$6(input.element())
            if (current !== data) {
              set$3(input.element(), data)
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

    const itemExecute = constant('alloy.typeahead.itemexecute')

    const make$3 = function (detail, components, spec, externals) {
      const navigateList = function (comp, simulatedEvent, highlighter) {
        detail.previewing.set(false)
        const sandbox = Coupling.getCoupled(comp, 'sandbox')
        if (Sandboxing.isOpen(sandbox)) {
          Composing.getCurrent(sandbox).each((menu) => {
            Highlighting.getHighlighted(menu).fold(() => {
              highlighter(menu)
            }, () => {
              dispatchEvent(sandbox, menu.element(), 'keydown', simulatedEvent)
            })
          })
        } else {
          const onOpenSync = function (sandbox) {
            Composing.getCurrent(sandbox).each(highlighter)
          }
          open$1(detail, mapFetch(comp), comp, sandbox, externals, onOpenSync, HighlightOnOpen.HighlightFirst).get(noop)
        }
      }
      const focusBehaviours$$1 = focusBehaviours(detail)
      var mapFetch = function (comp) {
        return function (tdata) {
          const menus = values(tdata.menus)
          const items = bind(menus, (menu) => filter(menu.items, (item) => item.type === 'item'))
          const repState = Representing.getState(comp)
          repState.update(map(items, (item) => item.data))
          return tdata
        }
      }
      const behaviours$$1 = [
        Focusing.config({}),
        Representing.config({
          onSetValue: detail.onSetValue,
          store: __assign({
            mode: 'dataset',
            getDataKey(comp) {
              return get$6(comp.element())
            },
            getFallbackEntry(itemString) {
              return {
                value: itemString,
                meta: {},
              }
            },
            setValue(comp, data) {
              set$3(comp.element(), detail.model.getDisplayText(data))
            },
          }, detail.initialData.map((d) => wrap$1('initialValue', d)).getOr({})),
        }),
        Streaming.config({
          stream: {
            mode: 'throttle',
            delay: detail.responseTime,
            stopEvent: false,
          },
          onStream(component, simulatedEvent) {
            const sandbox = Coupling.getCoupled(component, 'sandbox')
            const focusInInput = Focusing.isFocused(component)
            if (focusInInput) {
              if (get$6(component.element()).length >= detail.minChars) {
                const previousValue_1 = Composing.getCurrent(sandbox).bind((menu) => Highlighting.getHighlighted(menu).map(Representing.getValue))
                detail.previewing.set(true)
                const onOpenSync = function (_sandbox) {
                  Composing.getCurrent(sandbox).each((menu) => {
                    previousValue_1.fold(() => {
                      if (detail.model.selectsOver) {
                        Highlighting.highlightFirst(menu)
                      }
                    }, (pv) => {
                      Highlighting.highlightBy(menu, (item) => {
                        const itemData = Representing.getValue(item)
                        return itemData.value === pv.value
                      })
                      Highlighting.getHighlighted(menu).orThunk(() => {
                        Highlighting.highlightFirst(menu)
                        return Option.none()
                      })
                    })
                  })
                }
                open$1(detail, mapFetch(component), component, sandbox, externals, onOpenSync, HighlightOnOpen.HighlightFirst).get(noop)
              }
            }
          },
          cancelEvent: typeaheadCancel(),
        }),
        Keying.config({
          mode: 'special',
          onDown(comp, simulatedEvent) {
            navigateList(comp, simulatedEvent, Highlighting.highlightFirst)
            return Option.some(true)
          },
          onEscape(comp) {
            const sandbox = Coupling.getCoupled(comp, 'sandbox')
            if (Sandboxing.isOpen(sandbox)) {
              Sandboxing.close(sandbox)
              return Option.some(true)
            }
            return Option.none()
          },
          onUp(comp, simulatedEvent) {
            navigateList(comp, simulatedEvent, Highlighting.highlightLast)
            return Option.some(true)
          },
          onEnter(comp) {
            const sandbox = Coupling.getCoupled(comp, 'sandbox')
            const sandboxIsOpen = Sandboxing.isOpen(sandbox)
            if (sandboxIsOpen && !detail.previewing.get()) {
              return Composing.getCurrent(sandbox).bind((menu) => Highlighting.getHighlighted(menu)).map((item) => {
                emitWith(comp, itemExecute(), { item })
                return true
              })
            }
            const currentValue = Representing.getValue(comp)
            emit(comp, typeaheadCancel())
            detail.onExecute(sandbox, comp, currentValue)
            if (sandboxIsOpen) {
              Sandboxing.close(sandbox)
            }
            return Option.some(true)
          },
        }),
        Toggling.config({
          toggleClass: detail.markers.openClass,
          aria: {
            mode: 'pressed',
            syncWithExpanded: true,
          },
        }),
        Coupling.config({
          others: {
            sandbox(hotspot) {
              return makeSandbox(detail, hotspot, {
                onOpen: identity,
                onClose: identity,
              })
            },
          },
        }),
        config('typeaheadevents', [
          runOnExecute((comp) => {
            const onOpenSync = noop
            togglePopup(detail, mapFetch(comp), comp, externals, onOpenSync, HighlightOnOpen.HighlightFirst).get(noop)
          }),
          run(itemExecute(), (comp, se) => {
            const sandbox = Coupling.getCoupled(comp, 'sandbox')
            setValueFromItem(detail.model, comp, se.event().item())
            emit(comp, typeaheadCancel())
            detail.onItemExecute(comp, sandbox, se.event().item(), Representing.getValue(comp))
            Sandboxing.close(sandbox)
            setCursorAtEnd(comp)
          }),
        ].concat(detail.dismissOnBlur ? [run(postBlur(), (typeahead) => {
          const sandbox = Coupling.getCoupled(typeahead, 'sandbox')
          if (search$1(sandbox.element()).isNone()) {
            Sandboxing.close(sandbox)
          }
        })] : [])),
      ]
      return {
        uid: detail.uid,
        dom: dom$3(detail),
        behaviours: __assign({}, focusBehaviours$$1, augment(detail.typeaheadBehaviours, behaviours$$1)),
        eventOrder: detail.eventOrder,
      }
    }

    const sandboxFields = function () {
      return [
        defaulted$1('sandboxClasses', []),
        SketchBehaviours.field('sandboxBehaviours', [
          Composing,
          Receiving,
          Sandboxing,
          Representing,
        ]),
      ]
    }

    const schema$f = constant([
      option('lazySink'),
      strict$1('fetch'),
      defaulted$1('minChars', 5),
      defaulted$1('responseTime', 1000),
      onHandler('onOpen'),
      defaulted$1('getHotspot', Option.some),
      defaulted$1('layouts', Option.none()),
      defaulted$1('eventOrder', {}),
      defaultedObjOf('model', {}, [
        defaulted$1('getDisplayText', (itemData) => itemData.meta !== undefined && itemData.meta.text !== undefined ? itemData.meta.text : itemData.value),
        defaulted$1('selectsOver', true),
        defaulted$1('populateFromBrowse', true),
      ]),
      onHandler('onSetValue'),
      onKeyboardHandler('onExecute'),
      onHandler('onItemExecute'),
      defaulted$1('inputClasses', []),
      defaulted$1('inputAttributes', {}),
      defaulted$1('inputStyles', {}),
      defaulted$1('matchWidth', true),
      defaulted$1('useMinWidth', false),
      defaulted$1('dismissOnBlur', true),
      markers(['openClass']),
      option('initialData'),
      field$1('typeaheadBehaviours', [
        Focusing,
        Representing,
        Streaming,
        Keying,
        Toggling,
        Coupling,
      ]),
      state$1('previewing', () => Cell(true)),
    ].concat(schema$e()).concat(sandboxFields()))
    const parts$4 = constant([external$1({
      schema: [tieredMenuMarkers()],
      name: 'menu',
      overrides(detail) {
        return {
          fakeFocus: true,
          onHighlight(menu, item) {
            if (!detail.previewing.get()) {
              menu.getSystem().getByUid(detail.uid).each((input) => {
                if (detail.model.populateFromBrowse) {
                  setValueFromItem(detail.model, input, item)
                }
              })
            } else {
              menu.getSystem().getByUid(detail.uid).each((input) => {
                attemptSelectOver(detail.model, input, item).fold(() => Highlighting.dehighlight(menu, item), (fn) => fn())
              })
            }
            detail.previewing.set(false)
          },
          onExecute(menu, item) {
            return menu.getSystem().getByUid(detail.uid).toOption().map((typeahead) => {
              emitWith(typeahead, itemExecute(), { item })
              return true
            })
          },
          onHover(menu, item) {
            detail.previewing.set(false)
            menu.getSystem().getByUid(detail.uid).each((input) => {
              if (detail.model.populateFromBrowse) {
                setValueFromItem(detail.model, input, item)
              }
            })
          },
        }
      },
    })])

    const Typeahead = composite$1({
      name: 'Typeahead',
      configFields: schema$f(),
      partFields: parts$4(),
      factory: make$3,
    })

    const renderFormFieldWith = function (pLabel, pField, extraClasses) {
      const spec = renderFormFieldSpecWith(pLabel, pField, extraClasses)
      return FormField.sketch(spec)
    }
    const renderFormField = function (pLabel, pField) {
      return renderFormFieldWith(pLabel, pField, [])
    }
    var renderFormFieldSpecWith = function (pLabel, pField, extraClasses) {
      return {
        dom: renderFormFieldDomWith(extraClasses),
        components: pLabel.toArray().concat([pField]),
      }
    }
    const renderFormFieldDom = function () {
      return renderFormFieldDomWith([])
    }
    var renderFormFieldDomWith = function (extraClasses) {
      return {
        tag: 'div',
        classes: ['tox-form__group'].concat(extraClasses),
      }
    }
    const renderLabel = function (label, providersBackstage) {
      return FormField.parts().label({
        dom: {
          tag: 'label',
          classes: ['tox-label'],
          innerHtml: providersBackstage.translate(label),
        },
      })
    }

    const isMenuItemReference = function (item) {
      return isString(item)
    }
    const isSeparator = function (item) {
      return item.type === 'separator'
    }
    const isExpandingMenuItem = function (item) {
      return has(item, 'getSubmenuItems')
    }
    const separator$1 = { type: 'separator' }
    const unwrapReferences = function (items, menuItems) {
      const realItems = foldl(items, (acc, item) => {
        if (isMenuItemReference(item)) {
          if (item === '') {
            return acc
          } if (item === '|') {
            return acc.length > 0 && !isSeparator(acc[acc.length - 1]) ? acc.concat([separator$1]) : acc
          } if (has(menuItems, item.toLowerCase())) {
            return acc.concat([menuItems[item.toLowerCase()]])
          }
          console.error(`No representation for menuItem: ${item}`)
          return acc
        }
        return acc.concat([item])
      }, [])
      if (realItems.length > 0 && isSeparator(realItems[realItems.length - 1])) {
        realItems.pop()
      }
      return realItems
    }
    const getFromExpandingItem = function (item, menuItems) {
      const submenuItems = item.getSubmenuItems()
      const rest = expand(submenuItems, menuItems)
      const newMenus = deepMerge(rest.menus, wrap$1(item.value, rest.items))
      const newExpansions = deepMerge(rest.expansions, wrap$1(item.value, item.value))
      return {
        item,
        menus: newMenus,
        expansions: newExpansions,
      }
    }
    const getFromItem = function (item, menuItems) {
      return isExpandingMenuItem(item) ? getFromExpandingItem(item, menuItems) : {
        item,
        menus: {},
        expansions: {},
      }
    }
    const generateValueIfRequired = function (item) {
      if (isSeparator(item)) {
        return item
      }
      const itemValue = readOptFrom$1(item, 'value').getOrThunk(() => generate$1('generated-menu-item'))
      return deepMerge({ value: itemValue }, item)
    }
    var expand = function (items, menuItems) {
      const realItems = unwrapReferences(isString(items) ? items.split(' ') : items, menuItems)
      return foldr(realItems, (acc, item) => {
        const itemWithValue = generateValueIfRequired(item)
        const newData = getFromItem(itemWithValue, menuItems)
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

    const build$2 = function (items, itemResponse, providersBackstage) {
      const primary = generate$1('primary-menu')
      const data = expand(items, providersBackstage.menuItems())
      const mainMenu = createPartialMenu(primary, data.items, itemResponse, providersBackstage)
      const submenus = map$1(data.menus, (menuItems, menuName) => createPartialMenu(menuName, menuItems, itemResponse, providersBackstage))
      const menus = deepMerge(submenus, wrap$1(primary, mainMenu))
      return tieredMenu.tieredData(primary, menus, data.expansions)
    }

    const renderAutocomplete = function (spec, sharedBackstage) {
      const pLabel = renderLabel(spec.label.getOr('?'), sharedBackstage.providers)
      const pField = FormField.parts().field({
        factory: Typeahead,
        dismissOnBlur: false,
        inputClasses: ['tox-textfield'],
        minChars: 1,
        fetch(input) {
          const value = Representing.getValue(input)
          const items = spec.getItems(value)
          const tdata = build$2(items, ItemResponse$1.BUBBLE_TO_SANDBOX, sharedBackstage.providers)
          return Future.pure(tdata)
        },
        markers: { openClass: 'dog' },
        lazySink: sharedBackstage.getSink,
        parts: { menu: part(false, 1, 'normal') },
      })
      return renderFormField(Option.some(pLabel), pField)
    }

    const renderBar = function (spec, backstage) {
      return {
        dom: {
          tag: 'div',
          classes: ['tox-bar'],
        },
        components: map(spec.items, backstage.interpreter),
      }
    }

    const factory$5 = function (detail, spec) {
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
      configFields: schema$e(),
      factory: factory$5,
    })

    const isFirefox$1 = PlatformDetection$1.detect().browser.isFirefox()
    const offscreen = {
      position: 'absolute',
      left: '-9999px',
    }
    const create$5 = function (doc, text) {
      const span = Element$$1.fromTag('span', doc.dom())
      set$1(span, 'role', 'presentation')
      const contents = Element$$1.fromText(text, doc.dom())
      append(span, contents)
      return span
    }
    const linkToDescription = function (item, token) {
      const id = generate$1('ephox-alloy-aria-voice')
      set$1(token, 'id', id)
      set$1(item, 'aria-describedby', id)
    }
    const base$1 = function (getAttrs, parent$$1, text) {
      const doc = owner(parent$$1)
      const token = create$5(doc, text)
      if (isFirefox$1) {
        linkToDescription(parent$$1, token)
      }
      setAll(token, getAttrs(text))
      setAll$1(token, offscreen)
      append(parent$$1, token)
      setTimeout(() => {
        remove$1(token, 'aria-live')
        remove(token)
      }, 1000)
    }
    const getShoutAttrs = function (_text) {
      return {
        'aria-live': 'assertive',
        'aria-atomic': 'true',
        role: 'alert',
      }
    }
    const shout = function (parent$$1, text) {
      return base$1(getShoutAttrs, parent$$1, text)
    }

    const ariaElements = [
      'input',
      'textarea',
    ]
    const isAriaElement = function (elem) {
      const name$$1 = name(elem)
      return contains(ariaElements, name$$1)
    }
    const markValid = function (component, invalidConfig) {
      const elem = invalidConfig.getRoot(component).getOr(component.element())
      remove$4(elem, invalidConfig.invalidClass)
      invalidConfig.notify.each((notifyInfo) => {
        if (isAriaElement(component.element())) {
          remove$1(elem, 'title')
        }
        notifyInfo.getContainer(component).each((container) => {
          set(container, notifyInfo.validHtml)
        })
        notifyInfo.onValid(component)
      })
    }
    const markInvalid = function (component, invalidConfig, invalidState, text) {
      const elem = invalidConfig.getRoot(component).getOr(component.element())
      add$2(elem, invalidConfig.invalidClass)
      invalidConfig.notify.each((notifyInfo) => {
        if (isAriaElement(component.element())) {
          set$1(component.element(), 'title', text)
        }
        shout(body(), text)
        notifyInfo.getContainer(component).each((container) => {
          set(container, text)
        })
        notifyInfo.onInvalid(component, text)
      })
    }
    const query = function (component, invalidConfig, invalidState) {
      return invalidConfig.validator.fold(() => Future.pure(Result.value(true)), (validatorInfo) => validatorInfo.validate(component))
    }
    const run$1 = function (component, invalidConfig, invalidState) {
      invalidConfig.notify.each((notifyInfo) => {
        notifyInfo.onValidate(component)
      })
      return query(component, invalidConfig, invalidState).map((valid) => {
        if (component.getSystem().isConnected()) {
          return valid.fold((err) => {
            markInvalid(component, invalidConfig, invalidState, err)
            return Result.error(err)
          }, (v) => {
            markValid(component, invalidConfig)
            return Result.value(v)
          })
        }
        return Result.error('No longer in system')
      })
    }
    const isInvalid = function (component, invalidConfig) {
      const elem = invalidConfig.getRoot(component).getOr(component.element())
      return has$2(elem, invalidConfig.invalidClass)
    }

    const InvalidateApis = /* #__PURE__ */Object.freeze({
      markValid,
      markInvalid,
      query,
      run: run$1,
      isInvalid,
    })

    const events$a = function (invalidConfig, invalidState) {
      return invalidConfig.validator.map((validatorInfo) => derive([run(validatorInfo.onEvent, (component) => {
        run$1(component, invalidConfig, invalidState).get(identity)
      })].concat(validatorInfo.validateOnLoad ? [runOnAttached((component) => {
        run$1(component, invalidConfig, invalidState).get(noop)
      })] : []))).getOr({})
    }

    const ActiveInvalidate = /* #__PURE__ */Object.freeze({
      events: events$a,
    })

    const InvalidateSchema = [
      strict$1('invalidClass'),
      defaulted$1('getRoot', Option.none),
      optionObjOf('notify', [
        defaulted$1('aria', 'alert'),
        defaulted$1('getContainer', Option.none),
        defaulted$1('validHtml', ''),
        onHandler('onValid'),
        onHandler('onInvalid'),
        onHandler('onValidate'),
      ]),
      optionObjOf('validator', [
        strict$1('validate'),
        defaulted$1('onEvent', 'input'),
        defaulted$1('validateOnLoad', true),
      ]),
    ]

    const Invalidating = create$1({
      fields: InvalidateSchema,
      name: 'invalidating',
      active: ActiveInvalidate,
      apis: InvalidateApis,
      extra: {
        validation(validator) {
          return function (component) {
            const v = Representing.getValue(component)
            return Future.pure(validator(v))
          }
        },
      },
    })

    const exhibit$4 = function (base, tabConfig) {
      return nu$6({
        attributes: wrapAll$1([{
          key: tabConfig.tabAttr,
          value: 'true',
        }]),
      })
    }

    const ActiveTabstopping = /* #__PURE__ */Object.freeze({
      exhibit: exhibit$4,
    })

    const TabstopSchema = [defaulted$1('tabAttr', 'data-alloy-tabstop')]

    const Tabstopping = create$1({
      fields: TabstopSchema,
      name: 'tabstopping',
      active: ActiveTabstopping,
    })

    const hexColour = function (hexString) {
      return { value: constant(hexString) }
    }
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    const longformRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
    const isHexString = function (hex) {
      return shorthandRegex.test(hex) || longformRegex.test(hex)
    }
    const getLongForm = function (hexColour) {
      const hexString = hexColour.value().replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)
      return { value: constant(hexString) }
    }
    const extractValues = function (hexColour) {
      const longForm = getLongForm(hexColour)
      return longformRegex.exec(longForm.value())
    }
    const toHex = function (component) {
      const hex = component.toString(16)
      return hex.length == 1 ? `0${hex}` : hex
    }
    const fromRgba = function (rgbaColour) {
      const value = toHex(rgbaColour.red()) + toHex(rgbaColour.green()) + toHex(rgbaColour.blue())
      return hexColour(value)
    }

    const { min } = Math; const { max } = Math; const { round } = Math
    const rgbRegex = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)/
    const rgbaRegex = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d?(?:\.\d+)?)\)/
    const rgbaColour = function (red, green, blue, alpha) {
      return {
        red: constant(red),
        green: constant(green),
        blue: constant(blue),
        alpha: constant(alpha),
      }
    }
    const isRgbaComponent = function (value) {
      const num = parseInt(value, 10)
      return num.toString() === value && num >= 0 && num <= 255
    }
    const fromHsv = function (hsv) {
      let side, chroma, x, match, hue, saturation, brightness, r, g, b
      hue = (hsv.hue() || 0) % 360
      saturation = hsv.saturation() / 100
      brightness = hsv.value() / 100
      saturation = max(0, min(saturation, 1))
      brightness = max(0, min(brightness, 1))
      if (saturation === 0) {
        r = g = b = round(255 * brightness)
        return rgbaColour(r, g, b, 1)
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
      r = round(255 * (r + match))
      g = round(255 * (g + match))
      b = round(255 * (b + match))
      return rgbaColour(r, g, b, 1)
    }
    const fromHex = function (hexColour$$1) {
      const result = extractValues(hexColour$$1)
      const red = parseInt(result[1], 16)
      const green = parseInt(result[2], 16)
      const blue = parseInt(result[3], 16)
      return rgbaColour(red, green, blue, 1)
    }
    const fromStringValues = function (red, green, blue, alpha) {
      const r = parseInt(red, 10)
      const g = parseInt(green, 10)
      const b = parseInt(blue, 10)
      const a = parseFloat(alpha)
      return rgbaColour(r, g, b, a)
    }
    const fromString$1 = function (rgbaString) {
      if (rgbaString === 'transparent') {
        return Option.some(rgbaColour(0, 0, 0, 0))
      } if (rgbRegex.test(rgbaString)) {
        const rgbMatch = rgbRegex.exec(rgbaString)
        return Option.some(fromStringValues(rgbMatch[1], rgbMatch[2], rgbMatch[3], '1'))
      } if (rgbaRegex.test(rgbaString)) {
        const rgbaMatch = rgbRegex.exec(rgbaString)
        return Option.some(fromStringValues(rgbaMatch[1], rgbaMatch[2], rgbaMatch[3], rgbaMatch[4]))
      }
      return Option.none()
    }
    const toString$2 = function (rgba) {
      return `rgba(${rgba.red()},${rgba.green()},${rgba.blue()},${rgba.alpha()})`
    }
    const red = constant(rgbaColour(255, 0, 0, 1))

    const global$6 = tinymce.util.Tools.resolve('tinymce.util.LocalStorage')

    const storageName = 'tinymce-custom-colors'
    function ColorCache(max) {
      if (max === void 0) {
        max = 10
      }
      const storageString = global$6.getItem(storageName)
      const localstorage = isString(storageString) ? JSON.parse(storageString) : []
      const prune = function (list) {
        const diff = max - list.length
        return diff < 0 ? list.slice(0, max) : list
      }
      const cache = prune(localstorage)
      const add = function (key) {
        indexOf(cache, key).each(remove)
        cache.unshift(key)
        if (cache.length > max) {
          cache.pop()
        }
        global$6.setItem(storageName, JSON.stringify(cache))
      }
      var remove = function (idx) {
        cache.splice(idx, 1)
      }
      const state = function () {
        return cache.slice(0)
      }
      return {
        add,
        state,
      }
    }

    const choiceItem = 'choiceitem'
    const defaultColors = [
      {
        type: choiceItem,
        text: 'Turquoise',
        value: '#18BC9B',
      },
      {
        type: choiceItem,
        text: 'Green',
        value: '#2FCC71',
      },
      {
        type: choiceItem,
        text: 'Blue',
        value: '#3598DB',
      },
      {
        type: choiceItem,
        text: 'Purple',
        value: '#9B59B6',
      },
      {
        type: choiceItem,
        text: 'Navy Blue',
        value: '#34495E',
      },
      {
        type: choiceItem,
        text: 'Dark Turquoise',
        value: '#18A085',
      },
      {
        type: choiceItem,
        text: 'Dark Green',
        value: '#27AE60',
      },
      {
        type: choiceItem,
        text: 'Medium Blue',
        value: '#2880B9',
      },
      {
        type: choiceItem,
        text: 'Medium Purple',
        value: '#8E44AD',
      },
      {
        type: choiceItem,
        text: 'Midnight Blue',
        value: '#2B3E50',
      },
      {
        type: choiceItem,
        text: 'Yellow',
        value: '#F1C40F',
      },
      {
        type: choiceItem,
        text: 'Orange',
        value: '#E67E23',
      },
      {
        type: choiceItem,
        text: 'Red',
        value: '#E74C3C',
      },
      {
        type: choiceItem,
        text: 'Light Gray',
        value: '#ECF0F1',
      },
      {
        type: choiceItem,
        text: 'Gray',
        value: '#95A5A6',
      },
      {
        type: choiceItem,
        text: 'Dark Yellow',
        value: '#F29D12',
      },
      {
        type: choiceItem,
        text: 'Dark Orange',
        value: '#D35400',
      },
      {
        type: choiceItem,
        text: 'Dark Red',
        value: '#E74C3C',
      },
      {
        type: choiceItem,
        text: 'Medium Gray',
        value: '#BDC3C7',
      },
      {
        type: choiceItem,
        text: 'Dark Gray',
        value: '#7E8C8D',
      },
      {
        type: choiceItem,
        text: 'Black',
        value: '#000000',
      },
      {
        type: choiceItem,
        text: 'White',
        value: '#ffffff',
      },
    ]
    const colorCache = ColorCache(10)
    const mapColors = function (colorMap) {
      let i
      const colors = []
      for (i = 0; i < colorMap.length; i += 2) {
        colors.push({
          text: colorMap[i + 1],
          value: `#${colorMap[i]}`,
          type: 'choiceitem',
        })
      }
      return colors
    }
    const getColorCols = function (editor, defaultCols) {
      return editor.getParam('color_cols', defaultCols, 'number')
    }
    const hasCustomColors = function (editor) {
      return editor.getParam('custom_colors') !== false
    }
    const getColorMap = function (editor) {
      return editor.getParam('color_map')
    }
    const getColors = function (editor) {
      const unmapped = getColorMap(editor)
      return unmapped !== undefined ? mapColors(unmapped) : defaultColors
    }
    const getCurrentColors = function () {
      return map(colorCache.state(), (color) => ({
        type: choiceItem,
        text: color,
        value: color,
      }))
    }
    const addColor = function (color) {
      colorCache.add(color)
    }
    const Settings = {
      mapColors,
      getColorCols,
      hasCustomColors,
      getColorMap,
      getColors,
      getCurrentColors,
      addColor,
    }

    const getCurrentColor = function (editor, format) {
      let color
      editor.dom.getParents(editor.selection.getStart(), (elm) => {
        let value
        if (value = elm.style[format === 'forecolor' ? 'color' : 'background-color']) {
          color = color || value
        }
      })
      return color
    }
    const applyFormat = function (editor, format, value) {
      editor.undoManager.transact(() => {
        editor.focus()
        editor.formatter.apply(format, { value })
        editor.nodeChanged()
      })
    }
    const removeFormat = function (editor, format) {
      editor.undoManager.transact(() => {
        editor.focus()
        editor.formatter.remove(format, { value: null }, null, true)
        editor.nodeChanged()
      })
    }
    const registerCommands = function (editor) {
      editor.addCommand('mceApplyTextcolor', (format, value) => {
        applyFormat(editor, format, value)
      })
      editor.addCommand('mceRemoveTextcolor', (format) => {
        removeFormat(editor, format)
      })
    }
    const calcCols = function (colors) {
      return Math.max(5, Math.ceil(Math.sqrt(colors)))
    }
    const getColorCols$1 = function (editor) {
      const colors = Settings.getColors(editor)
      const defaultCols = calcCols(colors.length)
      return Settings.getColorCols(editor, defaultCols)
    }
    const getAdditionalColors = function (hasCustom) {
      const type = 'choiceitem'
      const remove = {
        type,
        text: 'Remove color',
        icon: 'color-swatch-remove-color',
        value: 'remove',
      }
      const custom = {
        type,
        text: 'Custom color',
        icon: 'color-picker',
        value: 'custom',
      }
      return hasCustom ? [
        remove,
        custom,
      ] : [remove]
    }
    const applyColour = function (editor, format, value, onChoice) {
      if (value === 'custom') {
        const dialog = colorPickerDialog(editor)
        dialog((colorOpt) => {
          colorOpt.each((color) => {
            Settings.addColor(color)
            editor.execCommand('mceApplyTextcolor', format, color)
            onChoice(color)
          })
        }, '#000000')
      } else if (value === 'remove') {
        onChoice('')
        editor.execCommand('mceRemoveTextcolor', format)
      } else {
        onChoice(value)
        editor.execCommand('mceApplyTextcolor', format, value)
      }
    }
    const getFetch = function (colors, hasCustom) {
      return function (callback) {
        callback(colors.concat(Settings.getCurrentColors().concat(getAdditionalColors(hasCustom))))
      }
    }
    const registerTextColorButton = function (editor, name, format, tooltip) {
      editor.ui.registry.addSplitButton(name, (function () {
        const lastColour = Cell(null)
        return {
          type: 'splitbutton',
          tooltip,
          presets: 'color',
          icon: name === 'forecolor' ? 'text-color' : 'highlight-bg-color',
          select(value) {
            const optCurrentRgb = Option.from(getCurrentColor(editor, format))
            return optCurrentRgb.bind((currentRgb) => fromString$1(currentRgb).map((rgba) => {
              const currentHex = fromRgba(rgba).value()
              return contains$1(value.toLowerCase(), currentHex)
            })).getOr(false)
          },
          columns: getColorCols$1(editor),
          fetch: getFetch(Settings.getColors(editor), Settings.hasCustomColors(editor)),
          onAction(splitButtonApi) {
            if (lastColour.get() !== null) {
              applyColour(editor, format, lastColour.get(), () => {
              })
            }
          },
          onItemAction(splitButtonApi, value) {
            applyColour(editor, format, value, (newColour) => {
              const setIconFillAndStroke = function (pathId, colour) {
                splitButtonApi.setIconFill(pathId, colour)
                splitButtonApi.setIconStroke(pathId, colour)
              }
              lastColour.set(newColour)
              const id = name === 'forecolor' ? 'tox-icon-text-color__color' : 'tox-icon-highlight-bg-color__color'
              setIconFillAndStroke(id, newColour)
            })
          },
        }
      }()))
    }
    var colorPickerDialog = function (editor) {
      return function (callback, value) {
        const getOnSubmit = function (callback) {
          return function (api) {
            const data = api.getData()
            callback(Option.from(data.colorpicker))
            api.close()
          }
        }
        const onAction = function (api, details) {
          if (details.name === 'hex-valid') {
            if (details.value) {
              api.enable('ok')
            } else {
              api.disable('ok')
            }
          }
        }
        const initialData = { colorpicker: value }
        const submit = getOnSubmit(callback)
        editor.windowManager.open({
          title: 'Color Picker',
          size: 'normal',
          body: {
            type: 'panel',
            items: [{
              type: 'colorpicker',
              name: 'colorpicker',
              label: 'Color',
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
            },
          ],
          initialData,
          onAction,
          onSubmit: submit,
          onClose() {
          },
          onCancel() {
            callback(Option.none())
          },
        })
      }
    }
    const register$2 = function (editor) {
      registerCommands(editor)
      registerTextColorButton(editor, 'forecolor', 'forecolor', 'Text color')
      registerTextColorButton(editor, 'backcolor', 'hilitecolor', 'Background color')
    }
    const ColorSwatch = {
      register: register$2,
      getFetch,
      colorPickerDialog,
      getCurrentColor,
      getColorCols: getColorCols$1,
      calcCols,
    }

    const schema$g = constant([
      strict$1('dom'),
      strict$1('fetch'),
      onHandler('onOpen'),
      onKeyboardHandler('onExecute'),
      defaulted$1('getHotspot', Option.some),
      defaulted$1('layouts', Option.none()),
      field$1('dropdownBehaviours', [
        Toggling,
        Coupling,
        Keying,
        Focusing,
      ]),
      strict$1('toggleClass'),
      defaulted$1('eventOrder', {}),
      option('lazySink'),
      defaulted$1('matchWidth', false),
      defaulted$1('useMinWidth', false),
      option('role'),
    ].concat(sandboxFields()))
    const parts$5 = constant([
      external$1({
        schema: [tieredMenuMarkers()],
        name: 'menu',
        defaults(detail) {
          return { onExecute: detail.onExecute }
        },
      }),
      partType(),
    ])

    const factory$6 = function (detail, components, _spec, externals) {
      let _a
      const switchToMenu = function (sandbox) {
        Sandboxing.getState(sandbox).each((tmenu) => {
          tieredMenu.highlightPrimary(tmenu)
        })
      }
      const action = function (component) {
        const onOpenSync = switchToMenu
        togglePopup(detail, (x) => x, component, externals, onOpenSync, HighlightOnOpen.HighlightFirst).get(noop)
      }
      const apis = {
        expand(comp) {
          if (!Toggling.isOn(comp)) {
            togglePopup(detail, (x) => x, comp, externals, noop, HighlightOnOpen.HighlightNone).get(noop)
          }
        },
        open(comp) {
          if (!Toggling.isOn(comp)) {
            togglePopup(detail, (x) => x, comp, externals, noop, HighlightOnOpen.HighlightFirst).get(noop)
          }
        },
        isOpen: Toggling.isOn,
        close(comp) {
          if (Toggling.isOn(comp)) {
            togglePopup(detail, (x) => x, comp, externals, noop, HighlightOnOpen.HighlightFirst).get(noop)
          }
        },
      }
      const triggerExecute = function (comp, se) {
        emitExecute(comp)
        return Option.some(true)
      }
      const attributes = detail.role.fold(() => ({ 'aria-haspopup': 'true' }), (role) => ({
        role,
        'aria-haspopup': 'true',
      }))
      return {
        uid: detail.uid,
        dom: detail.dom,
        components,
        behaviours: augment(detail.dropdownBehaviours, [
          Toggling.config({
            toggleClass: detail.toggleClass,
            aria: { mode: 'expanded' },
          }),
          Coupling.config({
            others: {
              sandbox(hotspot) {
                return makeSandbox(detail, hotspot, {
                  onOpen() {
                    Toggling.on(hotspot)
                  },
                  onClose() {
                    Toggling.off(hotspot)
                  },
                })
              },
            },
          }),
          Keying.config({
            mode: 'special',
            onSpace: triggerExecute,
            onEnter: triggerExecute,
            onDown(comp, se) {
              if (Dropdown.isOpen(comp)) {
                const sandbox = Coupling.getCoupled(comp, 'sandbox')
                switchToMenu(sandbox)
              } else {
                Dropdown.open(comp)
              }
              return Option.some(true)
            },
            onEscape(comp, se) {
              if (Dropdown.isOpen(comp)) {
                Dropdown.close(comp)
                return Option.some(true)
              }
              return Option.none()
            },
          }),
          Focusing.config({}),
        ]),
        events: events$7(Option.some(action)),
        eventOrder: __assign({}, detail.eventOrder, (_a = {}, _a[execute()] = [
          'disabling',
          'toggling',
          'alloy.base.behaviour',
        ], _a)),
        apis,
        domModification: { attributes },
      }
    }
    var Dropdown = composite$1({
      name: 'Dropdown',
      configFields: schema$g(),
      partFields: parts$5(),
      factory: factory$6,
      apis: {
        open(apis, comp) {
          return apis.open(comp)
        },
        expand(apis, comp) {
          return apis.expand(comp)
        },
        close(apis, comp) {
          return apis.close(comp)
        },
        isOpen(apis, comp) {
          return apis.isOpen(comp)
        },
      },
    })

    const exhibit$5 = function (base, unselectConfig) {
      return nu$6({
        styles: {
          '-webkit-user-select': 'none',
          'user-select': 'none',
          '-ms-user-select': 'none',
          '-moz-user-select': '-moz-none',
        },
        attributes: { unselectable: 'on' },
      })
    }
    const events$b = function (unselectConfig) {
      return derive([abort(selectstart(), constant(true))])
    }

    const ActiveUnselecting = /* #__PURE__ */Object.freeze({
      events: events$b,
      exhibit: exhibit$5,
    })

    const Unselecting = create$1({
      fields: [],
      name: 'unselecting',
      active: ActiveUnselecting,
    })

    const renderPanelButton = function (spec, sharedBackstage) {
      return Dropdown.sketch({
        dom: spec.dom,
        components: spec.components,
        toggleClass: 'mce-active',
        dropdownBehaviours: derive$1([
          Unselecting.config({}),
          Tabstopping.config({}),
        ]),
        layouts: spec.layouts,
        sandboxClasses: ['tox-dialog__popups'],
        lazySink: sharedBackstage.getSink,
        fetch() {
          return Future.nu((callback) => spec.fetch(callback)).map((items) => createTieredDataFrom(deepMerge(createPartialChoiceMenu(generate$1('menu-value'), items, (value) => {
            spec.onItemAction(value)
          }, 5, 'color', ItemResponse$1.CLOSE_ON_EXECUTE, () => false, sharedBackstage.providers), { movement: deriveMenuMovement(5, 'color') })))
        },
        parts: { menu: part(false, 1, 'color') },
      })
    }

    const colorInputChangeEvent = generate$1('color-input-change')
    const colorSwatchChangeEvent = generate$1('color-swatch-change')
    const colorPickerCancelEvent = generate$1('color-picker-cancel')
    const renderColorInput = function (spec, sharedBackstage, colorInputBackstage) {
      const pField = FormField.parts().field({
        factory: Input,
        inputClasses: ['tox-textfield'],
        onSetValue(c) {
          return Invalidating.run(c).get(() => {
          })
        },
        inputBehaviours: derive$1([
          Tabstopping.config({}),
          Invalidating.config({
            invalidClass: 'tox-textbox-field-invalid',
            getRoot(comp) {
              return parent(comp.element())
            },
            notify: {
              onValid(comp) {
                const val = Representing.getValue(comp)
                emitWith(comp, colorInputChangeEvent, { color: val })
              },
            },
            validator: {
              validateOnLoad: false,
              validate(input) {
                const inputValue = Representing.getValue(input)
                if (inputValue.length === 0) {
                  return Future.pure(Result.value(true))
                }
                const span = Element$$1.fromTag('span')
                set$2(span, 'background-color', inputValue)
                const res = getRaw(span, 'background-color').fold(() => Result.error('blah'), (_) => Result.value(inputValue))
                return Future.pure(res)
              },
            },
          }),
        ]),
        selectOnFocus: false,
      })
      const pLabel = spec.label.map((label) => renderLabel(label, sharedBackstage.providers))
      const emitSwatchChange = function (colorBit, value) {
        emitWith(colorBit, colorSwatchChangeEvent, { value })
      }
      const onItemAction = function (value) {
        sharedBackstage.getSink().each((sink) => {
          memColorButton.getOpt(sink).each((colorBit) => {
            if (value === 'custom') {
              colorInputBackstage.colorPicker((valueOpt) => {
                valueOpt.fold(() => emit(colorBit, colorPickerCancelEvent), (value) => {
                  emitSwatchChange(colorBit, value)
                  Settings.addColor(value)
                })
              }, '#ffffff')
            } else if (value === 'remove') {
              emitSwatchChange(colorBit, '')
            } else {
              emitSwatchChange(colorBit, value)
            }
          })
        })
      }
      var memColorButton = record(renderPanelButton({
        dom: {
          tag: 'span',
          attributes: { 'aria-label': sharedBackstage.providers.translate('Color swatch') },
        },
        layouts: Option.some({
          onRtl() {
            return [southeast$1]
          },
          onLtr() {
            return [southwest$1]
          },
        }),
        components: [],
        fetch: ColorSwatch.getFetch(colorInputBackstage.getColors(), colorInputBackstage.hasCustomColors()),
        onItemAction,
      }, sharedBackstage))
      return FormField.sketch({
        dom: {
          tag: 'div',
          classes: ['tox-form__group'],
        },
        components: pLabel.toArray().concat([{
          dom: {
            tag: 'div',
            classes: ['tox-color-input'],
          },
          components: [
            pField,
            memColorButton.asSpec(),
          ],
        }]),
        fieldBehaviours: derive$1([config('form-field-events', [
          run(colorInputChangeEvent, (comp, se) => {
            memColorButton.getOpt(comp).each((colorButton) => {
              set$2(colorButton.element(), 'background-color', se.event().color())
            })
          }),
          run(colorSwatchChangeEvent, (comp, se) => {
            FormField.getField(comp).each((field) => {
              Representing.setValue(field, se.event().value())
              Composing.getCurrent(comp).each(Focusing.focus)
            })
          }),
          run(colorPickerCancelEvent, (comp, se) => {
            FormField.getField(comp).each((field) => {
              Composing.getCurrent(comp).each(Focusing.focus)
            })
          }),
        ])]),
      })
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
    const range$2 = function (detail, max, min) {
      return max(detail) - min(detail)
    }
    const xRange = function (detail) {
      return range$2(detail, maxX, minX)
    }
    const yRange = function (detail) {
      return range$2(detail, maxY, minY)
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
    const getBounds$2 = function (component) {
      return component.element().dom().getBoundingClientRect()
    }
    const getBoundsProperty = function (bounds, property) {
      return bounds[property]
    }
    const getMinXBounds = function (component) {
      const bounds = getBounds$2(component)
      return getBoundsProperty(bounds, left)
    }
    const getMaxXBounds = function (component) {
      const bounds = getBounds$2(component)
      return getBoundsProperty(bounds, right)
    }
    const getMinYBounds = function (component) {
      const bounds = getBounds$2(component)
      return getBoundsProperty(bounds, top)
    }
    const getMaxYBounds = function (component) {
      const bounds = getBounds$2(component)
      return getBoundsProperty(bounds, bottom)
    }
    const getXScreenRange = function (component) {
      const bounds = getBounds$2(component)
      return getBoundsProperty(bounds, width)
    }
    const getYScreenRange = function (component) {
      const bounds = getBounds$2(component)
      return getBoundsProperty(bounds, height)
    }
    const getCenterOffsetOf = function (componentMinEdge, componentMaxEdge, spectrumMinEdge) {
      return (componentMinEdge + componentMaxEdge) / 2 - spectrumMinEdge
    }
    const getXCenterOffSetOf = function (component, spectrum) {
      const componentBounds = getBounds$2(component)
      const spectrumBounds = getBounds$2(spectrum)
      const componentMinEdge = getBoundsProperty(componentBounds, left)
      const componentMaxEdge = getBoundsProperty(componentBounds, right)
      const spectrumMinEdge = getBoundsProperty(spectrumBounds, left)
      return getCenterOffsetOf(componentMinEdge, componentMaxEdge, spectrumMinEdge)
    }
    const getYCenterOffSetOf = function (component, spectrum) {
      const componentBounds = getBounds$2(component)
      const spectrumBounds = getBounds$2(spectrum)
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
      const thumbRadius = get$8(thumb.element()) / 2
      set$2(thumb.element(), 'left', `${pos - thumbRadius}px`)
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
      const thumbRadius = get$9(thumb.element()) / 2
      set$2(thumb.element(), 'top', `${pos - thumbRadius}px`)
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
      const thumbXRadius = get$8(thumb.element()) / 2
      const thumbYRadius = get$9(thumb.element()) / 2
      set$2(thumb.element(), 'left', `${xPos - thumbXRadius}px`)
      set$2(thumb.element(), 'top', `${yPos - thumbYRadius}px`)
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

    const fieldsUpdate = constant(generate$1('rgb-hex-update'))
    const sliderUpdate = constant(generate$1('slider-update'))
    const paletteUpdate = constant(generate$1('palette-update'))

    const paletteFactory = function (translate, getClass) {
      const spectrum = Slider.parts().spectrum({
        dom: {
          tag: 'canvas',
          attributes: { role: 'presentation' },
          classes: [getClass('sv-palette-spectrum')],
        },
      })
      const thumb = Slider.parts().thumb({
        dom: {
          tag: 'div',
          attributes: { role: 'presentation' },
          classes: [getClass('sv-palette-thumb')],
          innerHtml: `<div class=${getClass('sv-palette-inner-thumb')} role="presentation"></div>`,
        },
      })
      const setColour = function (canvas, rgba) {
        const { width } = canvas; const { height } = canvas
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = rgba
        ctx.fillRect(0, 0, width, height)
        const grdWhite = ctx.createLinearGradient(0, 0, width, 0)
        grdWhite.addColorStop(0, 'rgba(255,255,255,1)')
        grdWhite.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = grdWhite
        ctx.fillRect(0, 0, width, height)
        const grdBlack = ctx.createLinearGradient(0, 0, 0, height)
        grdBlack.addColorStop(0, 'rgba(0,0,0,0)')
        grdBlack.addColorStop(1, 'rgba(0,0,0,1)')
        ctx.fillStyle = grdBlack
        ctx.fillRect(0, 0, width, height)
      }
      const setSliderColour = function (slider, rgba) {
        const canvas = slider.components()[0].element().dom()
        setColour(canvas, toString$2(rgba))
      }
      const factory = function (detail) {
        const getInitialValue = constant({
          x: constant(0),
          y: constant(0),
        })
        const onChange = function (slider, _thumb, value) {
          emitWith(slider, paletteUpdate(), { value })
        }
        const onInit = function (_slider, _thumb, spectrum, _value) {
          setColour(spectrum.element().dom(), toString$2(red()))
        }
        const sliderBehaviours = derive$1([
          Composing.config({ find: Option.some }),
          Focusing.config({}),
        ])
        return Slider.sketch({
          dom: {
            tag: 'div',
            attributes: { role: 'presentation' },
            classes: [getClass('sv-palette')],
          },
          model: {
            mode: 'xy',
            getInitialValue,
          },
          rounded: false,
          components: [
            spectrum,
            thumb,
          ],
          onChange,
          onInit,
          sliderBehaviours,
        })
      }
      const SaturationBrightnessPalette = single$2({
        factory,
        name: 'SaturationBrightnessPalette',
        configFields: [],
        apis: {
          setRgba(apis, slider, rgba) {
            setSliderColour(slider, rgba)
          },
        },
        extraApis: {},
      })
      return SaturationBrightnessPalette
    }
    const SaturationBrightnessPalette = { paletteFactory }

    const sliderFactory = function (translate, getClass) {
      const spectrum = Slider.parts().spectrum({
        dom: {
          tag: 'div',
          classes: [getClass('hue-slider-spectrum')],
          attributes: { role: 'presentation' },
        },
      })
      const thumb = Slider.parts().thumb({
        dom: {
          tag: 'div',
          classes: [getClass('hue-slider-thumb')],
          attributes: { role: 'presentation' },
        },
      })
      return Slider.sketch({
        dom: {
          tag: 'div',
          classes: [getClass('hue-slider')],
          attributes: { role: 'presentation' },
        },
        rounded: false,
        model: {
          mode: 'y',
          getInitialValue: constant({ y: constant(0) }),
        },
        components: [
          spectrum,
          thumb,
        ],
        sliderBehaviours: derive$1([Focusing.config({})]),
        onChange(slider, thumb, value) {
          emitWith(slider, sliderUpdate(), { value })
        },
      })
    }
    const HueSlider = { sliderFactory }

    const owner$3 = 'form'
    const schema$h = [field$1('formBehaviours', [Representing])]
    const getPartName = function (name) {
      return `<alloy.field.${name}>`
    }
    const sketch$2 = function (fSpec) {
      const parts = (function () {
        const record = []
        const field = function (name, config) {
          record.push(name)
          return generateOne(owner$3, getPartName(name), config)
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
      const fieldParts = map(partNames, (n) => required({
        name: n,
        pname: getPartName(n),
      }))
      return composite(owner$3, schema$h, fieldParts, make$4, spec)
    }
    const toResult$1 = function (o, e) {
      return o.fold(() => Result.error(e), Result.value)
    }
    var make$4 = function (detail, components$$1, spec) {
      return {
        uid: detail.uid,
        dom: detail.dom,
        components: components$$1,
        behaviours: augment(detail.formBehaviours, [Representing.config({
          store: {
            mode: 'manual',
            getValue(form) {
              const resPs = getAllParts(form, detail)
              return map$1(resPs, (resPThunk, pName) => resPThunk().bind((v) => {
                const opt = Composing.getCurrent(v)
                return toResult$1(opt, 'missing current')
              }).map(Representing.getValue))
            },
            setValue(form, values$$1) {
              each$1(values$$1, (newValue, key) => {
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
      sketch: sketch$2,
    }

    const validInput = generate$1('valid-input')
    const invalidInput = generate$1('invalid-input')
    const validatingInput = generate$1('validating-input')
    const translatePrefix = 'colorcustom.rgb.'
    const rgbFormFactory = function (translate, getClass, onValidHexx, onInvalidHexx) {
      const invalidation = function (label, isValid) {
        return Invalidating.config({
          invalidClass: getClass('invalid'),
          notify: {
            onValidate(comp) {
              emitWith(comp, validatingInput, { type: label })
            },
            onValid(comp) {
              emitWith(comp, validInput, {
                type: label,
                value: Representing.getValue(comp),
              })
            },
            onInvalid(comp) {
              emitWith(comp, invalidInput, {
                type: label,
                value: Representing.getValue(comp),
              })
            },
          },
          validator: {
            validate(comp) {
              const value = Representing.getValue(comp)
              const res = isValid(value) ? Result.value(true) : Result.error(translate('aria.input.invalid'))
              return Future.pure(res)
            },
            validateOnLoad: false,
          },
        })
      }
      const renderTextField = function (isValid, name, label, description, data) {
        const helptext = translate(`${translatePrefix}range`)
        const pLabel = FormField.parts().label({
          dom: {
            tag: 'label',
            innerHtml: label,
            attributes: { 'aria-label': description },
          },
        })
        const pField = FormField.parts().field({
          data,
          factory: Input,
          inputAttributes: __assign({ type: 'text' }, name === 'hex' ? { 'aria-live': 'polite' } : {}),
          inputClasses: [getClass('textfield')],
          inputBehaviours: derive$1([
            invalidation(name, isValid),
            Tabstopping.config({}),
          ]),
          onSetValue(input) {
            if (Invalidating.isInvalid(input)) {
              const run$$1 = Invalidating.run(input)
              run$$1.get(noop)
            }
          },
        })
        const comps = [
          pLabel,
          pField,
        ]
        const concats = name !== 'hex' ? [FormField.parts()['aria-descriptor']({ text: helptext })] : []
        const components = comps.concat(concats)
        return {
          dom: {
            tag: 'div',
            attributes: { role: 'presentation' },
          },
          components,
        }
      }
      const copyRgbToHex = function (form, rgba) {
        const hex = fromRgba(rgba)
        Form.getField(form, 'hex').each((hexField) => {
          if (!Focusing.isFocused(hexField)) {
            Representing.setValue(form, { hex: hex.value() })
          }
        })
        return hex
      }
      const copyRgbToForm = function (form, rgb) {
        const red$$1 = rgb.red(); const green = rgb.green(); const blue = rgb.blue()
        Representing.setValue(form, {
          red: red$$1,
          green,
          blue,
        })
      }
      const memPreview = record({
        dom: {
          tag: 'div',
          classes: [getClass('rgba-preview')],
          styles: { 'background-color': 'white' },
          attributes: { role: 'presentation' },
        },
      })
      const updatePreview = function (anyInSystem, hex) {
        memPreview.getOpt(anyInSystem).each((preview) => {
          set$2(preview.element(), 'background-color', `#${hex.value()}`)
        })
      }
      const factory = function (detail) {
        const state = {
          red: constant(Cell(Option.some(255))),
          green: constant(Cell(Option.some(255))),
          blue: constant(Cell(Option.some(255))),
          hex: constant(Cell(Option.some('ffffff'))),
        }
        const copyHexToRgb = function (form, hex) {
          const rgb = fromHex(hex)
          copyRgbToForm(form, rgb)
          setValueRgb(rgb)
        }
        const get = function (prop) {
          return state[prop]().get()
        }
        const set = function (prop, value) {
          state[prop]().set(value)
        }
        const getValueRgb = function () {
          return get('red').bind((red$$1) => get('green').bind((green) => get('blue').map((blue) => rgbaColour(red$$1, green, blue, 1))))
        }
        var setValueRgb = function (rgb) {
          const red$$1 = rgb.red(); const green = rgb.green(); const blue = rgb.blue()
          set('red', Option.some(red$$1))
          set('green', Option.some(green))
          set('blue', Option.some(blue))
        }
        const onInvalidInput = function (form, simulatedEvent) {
          const data = simulatedEvent.event()
          if (data.type() !== 'hex') {
            set(data.type(), Option.none())
          } else {
            onInvalidHexx(form)
          }
        }
        const onValidHex = function (form, value) {
          onValidHexx(form)
          const hex = hexColour(value)
          set('hex', Option.some(value))
          const rgb = fromHex(hex)
          copyRgbToForm(form, rgb)
          setValueRgb(rgb)
          emitWith(form, fieldsUpdate(), { hex })
          updatePreview(form, hex)
        }
        const onValidRgb = function (form, prop, value) {
          const val = parseInt(value, 10)
          set(prop, Option.some(val))
          getValueRgb().each((rgb) => {
            const hex = copyRgbToHex(form, rgb)
            updatePreview(form, hex)
          })
        }
        const onValidInput = function (form, simulatedEvent) {
          const data = simulatedEvent.event()
          if (data.type() === 'hex') {
            onValidHex(form, data.value())
          } else {
            onValidRgb(form, data.type(), data.value())
          }
        }
        const formPartStrings = function (key) {
          return {
            label: translate(`${translatePrefix + key}.label`),
            description: translate(`${translatePrefix + key}.description`),
          }
        }
        const redStrings = formPartStrings('red')
        const greenStrings = formPartStrings('green')
        const blueStrings = formPartStrings('blue')
        const hexStrings = formPartStrings('hex')
        return deepMerge(Form.sketch((parts) => ({
          dom: {
            tag: 'form',
            classes: [getClass('rgb-form')],
            attributes: { 'aria-label': translate('aria.color.picker') },
          },
          components: [
            parts.field('red', FormField.sketch(renderTextField(isRgbaComponent, 'red', redStrings.label, redStrings.description, 255))),
            parts.field('green', FormField.sketch(renderTextField(isRgbaComponent, 'green', greenStrings.label, greenStrings.description, 255))),
            parts.field('blue', FormField.sketch(renderTextField(isRgbaComponent, 'blue', blueStrings.label, blueStrings.description, 255))),
            parts.field('hex', FormField.sketch(renderTextField(isHexString, 'hex', hexStrings.label, hexStrings.description, 'ffffff'))),
            memPreview.asSpec(),
          ],
          formBehaviours: derive$1([
            Invalidating.config({ invalidClass: getClass('form-invalid') }),
            config('rgb-form-events', [
              run(validInput, onValidInput),
              run(invalidInput, onInvalidInput),
              run(validatingInput, onInvalidInput),
            ]),
          ]),
        })), {
          apis: {
            updateHex(form, hex) {
              Representing.setValue(form, { hex: hex.value() })
              copyHexToRgb(form, hex)
              updatePreview(form, hex)
            },
          },
        })
      }
      const RgbForm = single$2({
        factory,
        name: 'RgbForm',
        configFields: [],
        apis: {
          updateHex(apis, form, hex) {
            apis.updateHex(form, hex)
          },
        },
        extraApis: {},
      })
      return RgbForm
    }
    const RgbForm = { rgbFormFactory }

    const hsvColour = function (hue, saturation, value) {
      return {
        hue: constant(hue),
        saturation: constant(saturation),
        value: constant(value),
      }
    }
    const fromRgb = function (rgbaColour) {
      let r, g, b, h, s, v, d, minRGB, maxRGB
      h = 0
      s = 0
      v = 0
      r = rgbaColour.red() / 255
      g = rgbaColour.green() / 255
      b = rgbaColour.blue() / 255
      minRGB = Math.min(r, Math.min(g, b))
      maxRGB = Math.max(r, Math.max(g, b))
      if (minRGB === maxRGB) {
        v = minRGB
        return hsvColour(0, 0, v * 100)
      }
      d = r === minRGB ? g - b : b === minRGB ? r - g : b - r
      h = r === minRGB ? 3 : b === minRGB ? 1 : 5
      h = 60 * (h - d / (maxRGB - minRGB))
      s = (maxRGB - minRGB) / maxRGB
      v = maxRGB
      return hsvColour(Math.round(h), Math.round(s * 100), Math.round(v * 100))
    }

    const calcHex = function (value) {
      const hue = (100 - value / 100) * 360
      const hsv = hsvColour(hue, 100, 100)
      const rgb = fromHsv(hsv)
      return fromRgba(rgb)
    }

    const makeFactory = function (translate, getClass) {
      const factory = function (detail) {
        const rgbForm = RgbForm.rgbFormFactory(translate, getClass, detail.onValidHex, detail.onInvalidHex)
        const sbPalette = SaturationBrightnessPalette.paletteFactory(translate, getClass)
        const state = { paletteRgba: constant(Cell(red())) }
        const memPalette = record(sbPalette.sketch({}))
        const memRgb = record(rgbForm.sketch({}))
        const updatePalette = function (anyInSystem, hex) {
          memPalette.getOpt(anyInSystem).each((palette) => {
            const rgba = fromHex(hex)
            state.paletteRgba().set(rgba)
            sbPalette.setRgba(palette, rgba)
          })
        }
        const updateFields = function (anyInSystem, hex) {
          memRgb.getOpt(anyInSystem).each((form) => {
            rgbForm.updateHex(form, hex)
          })
        }
        const runUpdates = function (anyInSystem, hex, updates) {
          each(updates, (update) => {
            update(anyInSystem, hex)
          })
        }
        const paletteUpdates = function () {
          const updates = [updateFields]
          return function (form, simulatedEvent) {
            const value = simulatedEvent.event().value()
            const oldRgb = state.paletteRgba().get()
            const hsvColour$$1 = fromRgb(oldRgb)
            const newHsvColour = hsvColour(hsvColour$$1.hue(), value.x(), 100 - value.y())
            const rgb = fromHsv(newHsvColour)
            const nuHex = fromRgba(rgb)
            runUpdates(form, nuHex, updates)
          }
        }
        const sliderUpdates = function () {
          const updates = [
            updatePalette,
            updateFields,
          ]
          return function (form, simulatedEvent) {
            const value = simulatedEvent.event().value()
            const hex = calcHex(value.y())
            runUpdates(form, hex, updates)
          }
        }
        return {
          uid: detail.uid,
          dom: detail.dom,
          components: [
            memPalette.asSpec(),
            HueSlider.sliderFactory(translate, getClass),
            memRgb.asSpec(),
          ],
          behaviours: derive$1([
            config('colour-picker-events', [
              run(paletteUpdate(), paletteUpdates()),
              run(sliderUpdate(), sliderUpdates()),
            ]),
            Composing.config({
              find(comp) {
                return memRgb.getOpt(comp)
              },
            }),
            Keying.config({ mode: 'acyclic' }),
          ]),
        }
      }
      const ColourPicker = single$2({
        name: 'ColourPicker',
        configFields: [
          defaulted$1('onValidHex', noop),
          defaulted$1('onInvalidHex', noop),
          optionString('formChangeEvent'),
        ],
        factory,
      })
      return ColourPicker
    }
    const ColourPicker = { makeFactory }

    const self = function () {
      return Composing.config({ find: Option.some })
    }
    const memento = function (mem) {
      return Composing.config({ find: mem.getOpt })
    }
    const childAt = function (index) {
      return Composing.config({
        find(comp) {
          return child(comp.element(), index).bind((element) => comp.getSystem().getByDom(element).toOption())
        },
      })
    }
    const ComposingConfigs = {
      self,
      memento,
      childAt,
    }

    const english = {
      'colorcustom.rgb.red.label': 'R',
      'colorcustom.rgb.red.description': 'Red component',
      'colorcustom.rgb.green.label': 'G',
      'colorcustom.rgb.green.description': 'Green component',
      'colorcustom.rgb.blue.label': 'B',
      'colorcustom.rgb.blue.description': 'Blue component',
      'colorcustom.rgb.hex.label': '#',
      'colorcustom.rgb.hex.description': 'Hex color code',
      'colorcustom.rgb.range': 'Range 0 to 255',
      'colorcustom.sb.saturation': 'Saturation',
      'colorcustom.sb.brightness': 'Brightness',
      'colorcustom.sb.picker': 'Saturation and Brightness Picker',
      'colorcustom.sb.palette': 'Saturation and Brightness Palette',
      'colorcustom.sb.instructions': 'Use arrow keys to select saturation and brightness, on x and y axes',
      'colorcustom.hue.hue': 'Hue',
      'colorcustom.hue.slider': 'Hue Slider',
      'colorcustom.hue.palette': 'Hue Palette',
      'colorcustom.hue.instructions': 'Use arrow keys to select a hue',
      'aria.color.picker': 'Color Picker',
      'aria.input.invalid': 'Invalid input',
    }
    const getEnglishText = function (key) {
      return english[key]
    }
    const translate$1 = function (key) {
      return getEnglishText(key)
    }
    const renderColorPicker = function (spec) {
      const getClass = function (key) {
        return `tox-${key}`
      }
      const colourPickerFactory = ColourPicker.makeFactory(translate$1, getClass)
      const onValidHex = function (form) {
        emitWith(form, formActionEvent, {
          name: 'hex-valid',
          value: true,
        })
      }
      const onInvalidHex = function (form) {
        emitWith(form, formActionEvent, {
          name: 'hex-valid',
          value: false,
        })
      }
      const memPicker = record(colourPickerFactory.sketch({
        dom: {
          tag: 'div',
          classes: [getClass('color-picker-container')],
          attributes: { role: 'presentation' },
        },
        onValidHex,
        onInvalidHex,
      }))
      return {
        dom: { tag: 'div' },
        components: [memPicker.asSpec()],
        behaviours: derive$1([
          Representing.config({
            store: {
              mode: 'manual',
              getValue(comp) {
                const picker = memPicker.get(comp)
                const optRgbForm = Composing.getCurrent(picker)
                const optHex = optRgbForm.bind((rgbForm) => {
                  const formValues = Representing.getValue(rgbForm)
                  return formValues.hex
                })
                return optHex.map((hex) => `#${hex}`).getOr('')
              },
              setValue(comp, newValue) {
                const pattern = /^#([a-fA-F0-9]{3}(?:[a-fA-F0-9]{3})?)/
                const m = pattern.exec(newValue)
                const picker = memPicker.get(comp)
                const optRgbForm = Composing.getCurrent(picker)
                optRgbForm.fold(() => {
                  console.log('Can not find form')
                }, (rgbForm) => {
                  Representing.setValue(rgbForm, { hex: Option.from(m[1]).getOr('') })
                  Form.getField(rgbForm, 'hex').each((hexField) => {
                    emit(hexField, input())
                  })
                })
              },
            },
          }),
          ComposingConfigs.self(),
        ]),
      }
    }

    const renderCustomEditor = function (spec) {
      const editorApi = Cell(Option.none())
      const memReplaced = record({ dom: { tag: spec.tag } })
      const initialValue = Cell(Option.none())
      return {
        dom: {
          tag: 'div',
          classes: ['tox-custom-editor'],
        },
        behaviours: derive$1([
          config('editor-foo-events', [runOnAttached((component) => {
            memReplaced.getOpt(component).each((ta) => {
              spec.init(ta.element().dom()).then((ea) => {
                initialValue.get().each((cvalue) => {
                  ea.setValue(cvalue)
                })
                initialValue.set(Option.none())
                editorApi.set(Option.some(ea))
              })
            })
          })]),
          Representing.config({
            store: {
              mode: 'manual',
              getValue() {
                return editorApi.get().fold(() => initialValue.get().getOr(''), (ed) => ed.getValue())
              },
              setValue(component, value) {
                editorApi.get().fold(() => {
                  initialValue.set(Option.some(value))
                }, (ed) => ed.setValue(value))
              },
            },
          }),
          ComposingConfigs.self(),
        ]),
        components: [memReplaced.asSpec()],
      }
    }

    const processors = objOf([
      defaulted$1('preprocess', identity),
      defaulted$1('postprocess', identity),
    ])
    const memento$1 = function (mem, rawProcessors) {
      const ps = asRawOrDie('RepresentingConfigs.memento processors', processors, rawProcessors)
      return Representing.config({
        store: {
          mode: 'manual',
          getValue(comp) {
            const other = mem.get(comp)
            const rawValue = Representing.getValue(other)
            return ps.postprocess(rawValue)
          },
          setValue(comp, rawValue) {
            const newValue = ps.preprocess(rawValue)
            const other = mem.get(comp)
            Representing.setValue(other, newValue)
          },
        },
      })
    }
    const withComp = function (optInitialValue, getter, setter) {
      return Representing.config(deepMerge({
        store: {
          mode: 'manual',
          getValue: getter,
          setValue: setter,
        },
      }, optInitialValue.map((initialValue) => ({ store: { initialValue } })).getOr({})))
    }
    const withElement = function (initialValue, getter, setter) {
      return withComp(initialValue, (c) => getter(c.element()), (c, v) => setter(c.element(), v))
    }
    const domValue = function (optInitialValue) {
      return withElement(optInitialValue, get$6, set$3)
    }
    const domHtml = function (optInitialValue) {
      return withElement(optInitialValue, get$1, set)
    }
    const memory$1 = function (initialValue) {
      return Representing.config({
        store: {
          mode: 'memory',
          initialValue,
        },
      })
    }
    const RepresentingConfigs = {
      memento: memento$1,
      withElement,
      withComp,
      domValue,
      domHtml,
      memory: memory$1,
    }

    const extensionsAccepted = '.jpg,.jpeg,.png,.gif'
    const filterByExtension = function (files) {
      const re = new RegExp(`(${extensionsAccepted.split(/\s*,\s*/).join('|')})$`, 'i')
      return filter(from$1(files), (file) => re.test(file.name))
    }
    const renderDropZone = function (spec, providersBackstage) {
      const stopper$$1 = function (_, se) {
        se.stop()
      }
      const sequence = function (actions) {
        return function (comp, se) {
          each(actions, (a) => {
            a(comp, se)
          })
        }
      }
      const onDrop = function (comp, se) {
        if (!Disabling.isDisabled(comp)) {
          const transferEvent = se.event().raw()
          handleFiles(comp, transferEvent.dataTransfer.files)
        }
      }
      const onSelect = function (component, simulatedEvent) {
        const { files } = simulatedEvent.event().raw().target
        handleFiles(component, files)
      }
      var handleFiles = function (component, files) {
        Representing.setValue(component, filterByExtension(files))
        emitWith(component, formChangeEvent, { name: spec.name })
      }
      const memInput = record({
        dom: {
          tag: 'input',
          attributes: {
            type: 'file',
            multiple: 'multiple',
          },
          styles: { display: 'none' },
        },
        behaviours: derive$1([config('input-file-events', [cutter(click())])]),
      })
      const renderField = function (s) {
        return {
          uid: s.uid,
          dom: {
            tag: 'div',
            classes: ['tox-dropzone-container'],
          },
          behaviours: derive$1([
            RepresentingConfigs.memory([]),
            ComposingConfigs.self(),
            Disabling.config({}),
            Toggling.config({
              toggleClass: 'dragenter',
              toggleOnExecute: false,
            }),
            config('dropzone-events', [
              run('dragenter', sequence([
                stopper$$1,
                Toggling.toggle,
              ])),
              run('dragleave', sequence([
                stopper$$1,
                Toggling.toggle,
              ])),
              run('dragover', stopper$$1),
              run('drop', sequence([
                stopper$$1,
                onDrop,
              ])),
              run(change(), onSelect),
            ]),
          ]),
          components: [{
            dom: {
              tag: 'div',
              classes: ['tox-dropzone'],
              styles: {},
            },
            components: [
              {
                dom: {
                  tag: 'p',
                  innerHtml: providersBackstage.translate('Drop an image here'),
                },
              },
              Button.sketch({
                dom: {
                  tag: 'button',
                  innerHtml: providersBackstage.translate('Browse for an image'),
                  styles: { position: 'relative' },
                  classes: [
                    'tox-button',
                    'tox-button--secondary',
                  ],
                },
                components: [memInput.asSpec()],
                action(comp) {
                  const inputComp = memInput.get(comp)
                  inputComp.element().dom().click()
                },
                buttonBehaviours: derive$1([Tabstopping.config({})]),
              }),
            ],
          }],
        }
      }
      const pLabel = spec.label.map((label) => renderLabel(label, providersBackstage))
      const pField = FormField.parts().field({ factory: { sketch: renderField } })
      const extraClasses = spec.flex ? ['tox-form__group--stretched'] : []
      return renderFormFieldWith(pLabel, pField, extraClasses)
    }

    const renderGrid = function (spec, backstage) {
      return {
        dom: {
          tag: 'div',
          classes: [
            'tox-form__grid',
            `tox-form__grid--${spec.columns}col`,
          ],
        },
        components: map(spec.items, backstage.interpreter),
      }
    }

    const beforeObject = generate$1('alloy-fake-before-tabstop')
    const afterObject = generate$1('alloy-fake-after-tabstop')
    const craftWithClasses = function (classes) {
      return {
        dom: {
          tag: 'div',
          styles: {
            width: '1px',
            height: '1px',
            outline: 'none',
          },
          attributes: { tabindex: '0' },
          classes,
        },
        behaviours: derive$1([
          Focusing.config({ ignore: true }),
          Tabstopping.config({}),
        ]),
      }
    }
    const craft = function (spec) {
      return {
        dom: {
          tag: 'div',
          classes: ['tox-navobj'],
        },
        components: [
          craftWithClasses([beforeObject]),
          spec,
          craftWithClasses([afterObject]),
        ],
        behaviours: derive$1([ComposingConfigs.childAt(1)]),
      }
    }
    const triggerTab = function (placeholder, shiftKey) {
      emitWith(placeholder, keydown(), {
        raw: {
          which: 9,
          shiftKey,
        },
      })
    }
    const onFocus$1 = function (container, targetComp) {
      const target = targetComp.element()
      if (has$2(target, beforeObject)) {
        triggerTab(container, true)
      } else if (has$2(target, afterObject)) {
        triggerTab(container, false)
      }
    }
    const isPseudoStop = function (element) {
      return closest$4(element, [
        `.${beforeObject}`,
        `.${afterObject}`,
      ].join(','), constant(false))
    }
    const NavigableObject = {
      isPseudoStop,
      onFocus: onFocus$1,
      craft,
    }

    const platformNeedsSandboxing = !(PlatformDetection$1.detect().browser.isIE() || PlatformDetection$1.detect().browser.isEdge())
    const getDynamicSource = function (isSandbox) {
      const cachedValue = Cell('')
      return {
        getValue(frameComponent) {
          return cachedValue.get()
        },
        setValue(frameComponent, html) {
          if (!isSandbox) {
            set$1(frameComponent.element(), 'src', 'javascript:\'\'')
            const doc = frameComponent.element().dom().contentWindow.document
            doc.open()
            doc.write(html)
            doc.close()
          } else {
            set$1(frameComponent.element(), 'src', `data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
          }
          cachedValue.set(html)
        },
      }
    }
    const renderIFrame = function (spec, providersBackstage) {
      const isSandbox = platformNeedsSandboxing && spec.sandboxed
      const attributes = __assign({}, spec.label.map((title) => ({ title })).getOr({}), isSandbox ? { sandbox: 'allow-scripts' } : {})
      const sourcing = getDynamicSource(isSandbox)
      const pLabel = spec.label.map((label) => renderLabel(label, providersBackstage))
      const factory = function (newSpec) {
        return NavigableObject.craft({
          uid: newSpec.uid,
          dom: {
            tag: 'iframe',
            attributes,
          },
          behaviours: derive$1([
            Tabstopping.config({}),
            Focusing.config({}),
            RepresentingConfigs.withComp(Option.none(), sourcing.getValue, sourcing.setValue),
          ]),
        })
      }
      const pField = FormField.parts().field({ factory: { sketch: factory } })
      const extraClasses = spec.flex ? ['tox-form__group--stretched'] : []
      return renderFormFieldWith(pLabel, pField, extraClasses)
    }

    function create$6(width, height) {
      return resize(document.createElement('canvas'), width, height)
    }
    function clone$3(canvas) {
      let tCanvas, ctx
      tCanvas = create$6(canvas.width, canvas.height)
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
      create: create$6,
      clone: clone$3,
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
    const Promise$2 = window.Promise ? window.Promise : promise()

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
    const Window$1 = {
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
      return new Promise$2((resolve, reject) => {
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
      return new Promise$2((resolve, reject) => {
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
      const byteCharacters = Window$1.atob(base64)
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
      return new Promise$2((resolve, reject) => {
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
        return new Promise$2((resolve) => {
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
      return new Promise$2((resolve) => {
        const reader = FileReader()
        reader.onloadend = function () {
          resolve(reader.result)
        }
        reader.readAsDataURL(blob)
      })
    }
    function blobToArrayBuffer(blob) {
      return new Promise$2((resolve) => {
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

    function create$7(getCanvas, blob, uri) {
      const initialType = blob.type
      const getType = constant(initialType)
      function toBlob() {
        return Promise$2.resolve(blob)
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
      return Conversions.blobToDataUri(blob).then((uri) => create$7(Conversions.blobToCanvas(blob), blob, uri))
    }
    function fromCanvas(canvas, type) {
      return Conversions.canvasToBlob(canvas, type).then((blob) => create$7(Promise$2.resolve(canvas), blob, canvas.toDataURL()))
    }
    function fromImage(image) {
      return Conversions.imageToBlob(image).then((blob) => fromBlob(blob))
    }
    const fromBlobAndUrlSync = function (blob, url) {
      return create$7(Conversions.blobToCanvas(blob), blob, url)
    }
    const ImageResult = {
      fromBlob,
      fromCanvas,
      fromImage,
      fromBlobAndUrlSync,
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
      return new Promise$2((resolve) => {
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
              return Promise$2.reject('Headers did not include required information')
            }
            meta.rawHeaders = headers
            return meta
          }
          return Promise$2.reject('Image was not a jpeg')
        } catch (ex) {
          return Promise$2.reject(`Unsupported format or not an image: ${blob.type} (Exception: ${ex.message})`)
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

    const renderIcon$1 = function (iconHtml) {
      return {
        dom: {
          tag: 'span',
          innerHtml: iconHtml,
          classes: [
            'tox-icon',
            'tox-tbtn__icon-wrap',
          ],
        },
      }
    }
    const renderIconFromPack = function (iconName, iconsProvider) {
      return renderIcon$1(get$e(iconName, iconsProvider))
    }
    const renderLabel$1 = function (text, prefix, providersBackstage) {
      return {
        dom: {
          tag: 'span',
          innerHtml: providersBackstage.translate(text),
          classes: [`${prefix}__select-label`],
        },
        behaviours: derive$1([Replacing.config({})]),
      }
    }

    const renderCommon = function (spec, action, extraBehaviours, dom, components) {
      if (extraBehaviours === void 0) {
        extraBehaviours = []
      }
      const common = {
        buttonBehaviours: derive$1([
          DisablingConfigs.button(spec.disabled),
          Tabstopping.config({}),
          config('button press', [
            preventDefault('click'),
            preventDefault('mousedown'),
          ]),
        ].concat(extraBehaviours)),
        eventOrder: {
          click: [
            'button press',
            'alloy.base.behaviour',
          ],
          mousedown: [
            'button press',
            'alloy.base.behaviour',
          ],
        },
        action,
      }
      const domFinal = deepMerge(common, { dom })
      const specFinal = deepMerge(domFinal, { components })
      return Button.sketch(specFinal)
    }
    const renderIconButton = function (spec, action, providersBackstage, extraBehaviours) {
      if (extraBehaviours === void 0) {
        extraBehaviours = []
      }
      const tooltipAttributes = spec.tooltip.map((tooltip) => ({
        'aria-label': providersBackstage.translate(tooltip),
        title: providersBackstage.translate(tooltip),
      })).getOr({})
      const dom = {
        tag: 'button',
        classes: ['tox-tbtn'],
        attributes: tooltipAttributes,
      }
      const icon = spec.icon.map((iconName) => renderIconFromPack(iconName, providersBackstage.icons))
      const components = componentRenderPipeline([icon])
      return renderCommon(spec, action, extraBehaviours, dom, components)
    }
    const renderButton = function (spec, action, providersBackstage, extraBehaviours) {
      if (extraBehaviours === void 0) {
        extraBehaviours = []
      }
      const translatedText = providersBackstage.translate(spec.text)
      const icon = spec.icon ? spec.icon.map((iconName) => renderIconFromPack(iconName, providersBackstage.icons)) : Option.none()
      const components = icon.isSome() ? componentRenderPipeline([icon]) : []
      const innerHtml = icon.isSome() ? {} : { innerHtml: translatedText }
      const classes = (spec.primary ? ['tox-button'] : [
        'tox-button',
        'tox-button--secondary',
      ]).concat(icon.isSome() ? ['tox-button--icon'] : [])
      const dom = __assign({
        tag: 'button',
        classes,
      }, innerHtml, { attributes: { title: translatedText } })
      return renderCommon(spec, action, extraBehaviours, dom, components)
    }
    const getAction = function (name, buttonType) {
      return function (comp) {
        if (buttonType === 'custom') {
          emitWith(comp, formActionEvent, {
            name,
            value: {},
          })
        } else if (buttonType === 'submit') {
          emit(comp, formSubmitEvent)
        } else if (buttonType === 'cancel') {
          emit(comp, formCancelEvent)
        } else {
          console.error('Unknown button type: ', buttonType)
        }
      }
    }
    const renderFooterButton = function (spec, buttonType, providersBackstage) {
      const action = getAction(spec.name, buttonType)
      return renderButton(spec, action, providersBackstage, [])
    }
    const renderDialogButton = function (spec, providersBackstage) {
      const action = getAction(spec.name, 'custom')
      return renderButton(spec, action, providersBackstage, [
        RepresentingConfigs.memory(''),
        ComposingConfigs.self(),
      ])
    }

    const schema$i = constant([
      defaulted$1('field1Name', 'field1'),
      defaulted$1('field2Name', 'field2'),
      onStrictHandler('onLockedChange'),
      markers(['lockClass']),
      defaulted$1('locked', false),
      SketchBehaviours.field('coupledFieldBehaviours', [
        Composing,
        Representing,
      ]),
    ])
    const getField = function (comp, detail, partName) {
      return getPart(comp, detail, partName).bind(Composing.getCurrent)
    }
    const coupledPart = function (selfName, otherName) {
      return required({
        factory: FormField,
        name: selfName,
        overrides(detail) {
          return {
            fieldBehaviours: derive$1([config('coupled-input-behaviour', [run(input(), (me) => {
              getField(me, detail, otherName).each((other) => {
                getPart(me, detail, 'lock').each((lock) => {
                  if (Toggling.isOn(lock)) {
                    detail.onLockedChange(me, other, lock)
                  }
                })
              })
            })])]),
          }
        },
      })
    }
    const parts$6 = constant([
      coupledPart('field1', 'field2'),
      coupledPart('field2', 'field1'),
      required({
        factory: Button,
        schema: [strict$1('dom')],
        name: 'lock',
        overrides(detail) {
          return {
            buttonBehaviours: derive$1([Toggling.config({
              selected: detail.locked,
              toggleClass: detail.markers.lockClass,
              aria: { mode: 'pressed' },
            })]),
          }
        },
      }),
    ])

    const factory$7 = function (detail, components$$1, spec, externals) {
      return {
        uid: detail.uid,
        dom: detail.dom,
        components: components$$1,
        behaviours: SketchBehaviours.augment(detail.coupledFieldBehaviours, [
          Composing.config({ find: Option.some }),
          Representing.config({
            store: {
              mode: 'manual',
              getValue(comp) {
                let _a
                const parts = getPartsOrDie(comp, detail, [
                  'field1',
                  'field2',
                ])
                return _a = {}, _a[detail.field1Name] = Representing.getValue(parts.field1()), _a[detail.field2Name] = Representing.getValue(parts.field2()), _a
              },
              setValue(comp, value) {
                const parts = getPartsOrDie(comp, detail, [
                  'field1',
                  'field2',
                ])
                if (hasKey$1(value, detail.field1Name)) {
                  Representing.setValue(parts.field1(), value[detail.field1Name])
                }
                if (hasKey$1(value, detail.field2Name)) {
                  Representing.setValue(parts.field2(), value[detail.field2Name])
                }
              },
            },
          }),
        ]),
        apis: {
          getField1(component) {
            return getPart(component, detail, 'field1')
          },
          getField2(component) {
            return getPart(component, detail, 'field2')
          },
          getLock(component) {
            return getPart(component, detail, 'lock')
          },
        },
      }
    }
    const FormCoupledInputs = composite$1({
      name: 'FormCoupledInputs',
      configFields: schema$i(),
      partFields: parts$6(),
      factory: factory$7,
      apis: {
        getField1(apis, component) {
          return apis.getField1(component)
        },
        getField2(apis, component) {
          return apis.getField2(component)
        },
        getLock(apis, component) {
          return apis.getLock(component)
        },
      },
    })

    const formatSize = function (size) {
      const unitDec = {
        '': 0,
        px: 0,
        pt: 1,
        mm: 1,
        pc: 2,
        ex: 2,
        em: 2,
        ch: 2,
        rem: 2,
        cm: 3,
        in: 4,
        '%': 4,
      }
      const maxDecimal = function (unit) {
        return unit in unitDec ? unitDec[unit] : 1
      }
      let numText = size.value.toFixed(maxDecimal(size.unit))
      if (numText.indexOf('.') !== -1) {
        numText = numText.replace(/\.?0*$/, '')
      }
      return numText + size.unit
    }
    const parseSize = function (sizeText) {
      const numPattern = /^\s*(\d+(?:\.\d+)?)\s*(|cm|mm|in|px|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|%)\s*$/
      const match = numPattern.exec(sizeText)
      if (match !== null) {
        const value = parseFloat(match[1])
        const unit = match[2]
        return Result.value({
          value,
          unit,
        })
      }
      return Result.error(sizeText)
    }
    const convertUnit = function (size, unit) {
      const inInch = {
        '': 96,
        px: 96,
        pt: 72,
        cm: 2.54,
        pc: 12,
        mm: 25.4,
        in: 1,
      }
      const supported = function (u) {
        return Object.prototype.hasOwnProperty.call(inInch, u)
      }
      if (size.unit === unit) {
        return Option.some(size.value)
      } if (supported(size.unit) && supported(unit)) {
        if (inInch[size.unit] === inInch[unit]) {
          return Option.some(size.value)
        }
        return Option.some(size.value / inInch[size.unit] * inInch[unit])
      }
      return Option.none()
    }
    const noSizeConversion = function (input) {
      return Option.none()
    }
    const ratioSizeConversion = function (scale, unit) {
      return function (size) {
        return convertUnit(size, unit).map((value) => ({
          value: value * scale,
          unit,
        }))
      }
    }
    const makeRatioConverter = function (currentFieldText, otherFieldText) {
      const cValue = parseSize(currentFieldText).toOption()
      const oValue = parseSize(otherFieldText).toOption()
      return liftN([
        cValue,
        oValue,
      ], (cSize, oSize) => convertUnit(cSize, oSize.unit).map((val) => oSize.value / val).map((r) => ratioSizeConversion(r, oSize.unit)).getOr(noSizeConversion)).getOr(noSizeConversion)
    }

    const renderSizeInput = function (spec, providersBackstage) {
      let converter = noSizeConversion
      const ratioEvent = generate$1('ratio-event')
      const pLock = FormCoupledInputs.parts().lock({
        dom: {
          tag: 'button',
          classes: [
            'tox-lock',
            'tox-button',
            'tox-button--naked',
            'tox-button--icon',
          ],
          attributes: { title: providersBackstage.translate(spec.label.getOr('Constrain proportions')) },
        },
        components: [
          {
            dom: {
              tag: 'span',
              classes: [
                'tox-icon',
                'tox-lock-icon__lock',
              ],
              innerHtml: get$e('lock', providersBackstage.icons),
            },
          },
          {
            dom: {
              tag: 'span',
              classes: [
                'tox-icon',
                'tox-lock-icon__unlock',
              ],
              innerHtml: get$e('unlock', providersBackstage.icons),
            },
          },
        ],
        buttonBehaviours: derive$1([Tabstopping.config({})]),
      })
      const formGroup = function (components) {
        return {
          dom: {
            tag: 'div',
            classes: ['tox-form__group'],
          },
          components,
        }
      }
      const getFieldPart = function (isField1) {
        return FormField.parts().field({
          factory: Input,
          inputClasses: ['tox-textfield'],
          inputBehaviours: derive$1([
            Tabstopping.config({}),
            config('size-input-events', [
              run(focusin(), (component, simulatedEvent) => {
                emitWith(component, ratioEvent, { isField1 })
              }),
              run(change(), (component, simulatedEvent) => {
                emitWith(component, formChangeEvent, { name: spec.name })
              }),
            ]),
          ]),
          selectOnFocus: false,
        })
      }
      const getLabelPart = function (label) {
        return FormField.parts().label({
          dom: {
            tag: 'label',
            classes: ['tox-label'],
            innerHtml: providersBackstage.translate(label),
          },
        })
      }
      const widthField = FormCoupledInputs.parts().field1(formGroup([
        getLabelPart('Width'),
        getFieldPart(true),
      ]))
      const hStack = function (components) {
        return {
          dom: {
            tag: 'div',
            classes: ['tox-form__controls-h-stack'],
          },
          components,
        }
      }
      const heightField = FormCoupledInputs.parts().field2(formGroup([
        getLabelPart('Height'),
        hStack([
          getFieldPart(false),
          pLock,
        ]),
      ]))
      return FormCoupledInputs.sketch({
        dom: {
          tag: 'div',
          classes: ['tox-form__group'],
        },
        components: [hStack([
          widthField,
          heightField,
        ])],
        field1Name: 'width',
        field2Name: 'height',
        locked: true,
        markers: { lockClass: 'tox-locked' },
        onLockedChange(current, other, lock) {
          parseSize(Representing.getValue(current)).each((size) => {
            converter(size).each((newSize) => {
              Representing.setValue(other, formatSize(newSize))
            })
          })
        },
        coupledFieldBehaviours: derive$1([config('size-input-events2', [run(ratioEvent, (component, simulatedEvent) => {
          const isField1 = simulatedEvent.event().isField1()
          const optCurrent = isField1 ? FormCoupledInputs.getField1(component) : FormCoupledInputs.getField2(component)
          const optOther = isField1 ? FormCoupledInputs.getField2(component) : FormCoupledInputs.getField1(component)
          const value1 = optCurrent.map(Representing.getValue).getOr('')
          const value2 = optOther.map(Representing.getValue).getOr('')
          converter = makeRatioConverter(value1, value2)
        })])]),
      })
    }

    const undo = constant(generate$1('undo'))
    const redo = constant(generate$1('redo'))
    const zoom = constant(generate$1('zoom'))
    const back = constant(generate$1('back'))
    const apply$1 = constant(generate$1('apply'))
    const swap = constant(generate$1('swap'))
    const transform = constant(generate$1('transform'))
    const tempTransform = constant(generate$1('temp-transform'))
    const transformApply = constant(generate$1('transform-apply'))
    const internal = {
      undo,
      redo,
      zoom,
      back,
      apply: apply$1,
      swap,
      transform,
      tempTransform,
      transformApply,
    }
    const saveState = constant('save-state')
    const disable$1 = constant('disable')
    const enable$1 = constant('enable')
    const external$2 = {
      formActionEvent,
      saveState,
      disable: disable$1,
      enable: enable$1,
    }

    const renderEditPanel = function (imagePanel, providersBackstage) {
      const createButton = function (text, action, disabled, primary) {
        return renderButton({
          name: text,
          text,
          disabled,
          primary,
        }, action, providersBackstage)
      }
      const createIconButton = function (icon, tooltip, action, disabled) {
        return renderIconButton({
          name: icon,
          icon: Option.some(icon),
          tooltip: Option.some(tooltip),
          disabled,
        }, action, providersBackstage)
      }
      const panelDom = {
        tag: 'div',
        classes: [
          'tox-image-tools__toolbar',
          'tox-image-tools-edit-panel',
        ],
      }
      const none = Option.none()
      const noop$$1 = noop
      const emit$$1 = function (comp, event, data) {
        emitWith(comp, event, data)
      }
      const emitTransform = function (comp, transform) {
        emit$$1(comp, internal.transform(), { transform })
      }
      const emitTempTransform = function (comp, transform) {
        emit$$1(comp, internal.tempTransform(), { transform })
      }
      const getBackSwap = function (anyInSystem) {
        return function () {
          memContainer.getOpt(anyInSystem).each((container) => {
            Replacing.set(container, [ButtonPanel])
          })
        }
      }
      const emitTransformApply = function (comp, transform) {
        emit$$1(comp, internal.transformApply(), {
          transform,
          swap: getBackSwap(comp),
        })
      }
      const createBackButton = function () {
        return createButton('Back', (button) => emit$$1(button, internal.back(), { swap: getBackSwap(button) }), false, false)
      }
      const createSpacer = function () {
        return {
          dom: {
            tag: 'div',
            classes: ['tox-spacer'],
          },
        }
      }
      const createApplyButton = function () {
        return createButton('Apply', (button) => emit$$1(button, internal.apply(), { swap: getBackSwap(button) }), true, true)
      }
      const makeCropTransform = function () {
        return function (ir) {
          const rect = imagePanel.getRect()
          return ImageTransformations.crop(ir, rect.x, rect.y, rect.w, rect.h)
        }
      }
      const CropPanel = Container.sketch({
        dom: panelDom,
        components: [
          createBackButton(),
          createSpacer(),
          createButton('Apply', (button) => {
            const transform = makeCropTransform()
            emitTransformApply(button, transform)
            imagePanel.hideCrop()
          }, false, true),
        ],
      })
      const memSize = record(renderSizeInput({
        name: 'size',
        label: none,
        colspan: none,
        type: 'sizeinput',
        constrain: true,
      }, providersBackstage))
      const makeResizeTransform = function (width, height) {
        return function (ir) {
          return ImageTransformations.resize(ir, width, height)
        }
      }
      const ResizePanel = Container.sketch({
        dom: panelDom,
        components: [
          createBackButton(),
          createSpacer(),
          memSize.asSpec(),
          createSpacer(),
          createButton('Apply', (button) => {
            memSize.getOpt(button).each((sizeInput) => {
              const value = Representing.getValue(sizeInput)
              const width = parseInt(value.width, 10)
              const height = parseInt(value.height, 10)
              const transform = makeResizeTransform(width, height)
              emitTransformApply(button, transform)
            })
          }, false, true),
        ],
      })
      const makeValueTransform = function (transform, value) {
        return function (ir) {
          return transform(ir, value)
        }
      }
      const horizontalFlip = makeValueTransform(ImageTransformations.flip, 'h')
      const verticalFlip = makeValueTransform(ImageTransformations.flip, 'v')
      const counterclockwiseRotate = makeValueTransform(ImageTransformations.rotate, -90)
      const clockwiseRotate = makeValueTransform(ImageTransformations.rotate, 90)
      const FlipRotatePanel = Container.sketch({
        dom: panelDom,
        components: [
          createBackButton(),
          createSpacer(),
          createIconButton('flip-horizontally', 'Flip horizontally', (button) => {
            emitTempTransform(button, horizontalFlip)
          }, false),
          createIconButton('flip-vertically', 'Flip vertically', (button) => {
            emitTempTransform(button, verticalFlip)
          }, false),
          createIconButton('rotate-left', 'Rotate counterclockwise', (button) => {
            emitTempTransform(button, counterclockwiseRotate)
          }, false),
          createIconButton('rotate-right', 'Rotate clockwise', (button) => {
            emitTempTransform(button, clockwiseRotate)
          }, false),
          createSpacer(),
          createApplyButton(),
        ],
      })
      const makeSlider = function (label, onChoose, min, value, max) {
        const labelPart = Slider.parts().label({
          dom: {
            tag: 'label',
            innerHtml: providersBackstage.translate(label),
          },
        })
        const spectrum = Slider.parts().spectrum({
          dom: {
            tag: 'div',
            classes: ['tox-slider__rail'],
            attributes: { role: 'presentation' },
          },
        })
        const thumb = Slider.parts().thumb({
          dom: {
            tag: 'div',
            classes: ['tox-slider__handle'],
            attributes: { role: 'presentation' },
          },
        })
        return Slider.sketch({
          dom: {
            tag: 'div',
            classes: ['tox-slider'],
            attributes: { role: 'presentation' },
          },
          model: {
            mode: 'x',
            minX: min,
            maxX: max,
            getInitialValue: constant({ x: constant(value) }),
          },
          components: [
            labelPart,
            spectrum,
            thumb,
          ],
          sliderBehaviours: derive$1([Focusing.config({})]),
          onChoose,
        })
      }
      const makeVariableSlider = function (label, transform, min, value, max) {
        const onChoose = function (slider, thumb, value) {
          const valTransform = makeValueTransform(transform, value.x() / 100)
          emitTransform(slider, valTransform)
        }
        return makeSlider(label, onChoose, min, value, max)
      }
      const createVariableFilterPanel = function (label, transform, min, value, max) {
        return Container.sketch({
          dom: panelDom,
          components: [
            createBackButton(),
            makeVariableSlider(label, transform, min, value, max),
            createApplyButton(),
          ],
        })
      }
      const FilterPanel = Container.sketch({
        dom: panelDom,
        components: [
          createBackButton(),
          createSpacer(),
          createApplyButton(),
        ],
      })
      const BrightnessPanel = createVariableFilterPanel('Brightness', ImageTransformations.brightness, -100, 0, 100)
      const ContrastPanel = createVariableFilterPanel('Contrast', ImageTransformations.contrast, -100, 0, 100)
      const GammaPanel = createVariableFilterPanel('Gamma', ImageTransformations.gamma, -100, 0, 100)
      const makeColorTransform = function (red, green, blue) {
        return function (ir) {
          return ImageTransformations.colorize(ir, red, green, blue)
        }
      }
      const makeColorSlider = function (label) {
        const onChoose = function (slider, thumb, value) {
          const redOpt = memRed.getOpt(slider)
          const blueOpt = memBlue.getOpt(slider)
          const greenOpt = memGreen.getOpt(slider)
          redOpt.each((red) => {
            blueOpt.each((blue) => {
              greenOpt.each((green) => {
                const r = Representing.getValue(red).x() / 100
                const g = Representing.getValue(green).x() / 100
                const b = Representing.getValue(blue).x() / 100
                const transform = makeColorTransform(r, g, b)
                emitTransform(slider, transform)
              })
            })
          })
        }
        return makeSlider(label, onChoose, 0, 100, 200)
      }
      var memRed = record(makeColorSlider('R'))
      var memGreen = record(makeColorSlider('G'))
      var memBlue = record(makeColorSlider('B'))
      const ColorizePanel = Container.sketch({
        dom: panelDom,
        components: [
          createBackButton(),
          memRed.asSpec(),
          memGreen.asSpec(),
          memBlue.asSpec(),
          createApplyButton(),
        ],
      })
      const getTransformPanelEvent = function (panel, transform, update) {
        return function (button) {
          const swap = function () {
            memContainer.getOpt(button).each((container) => {
              Replacing.set(container, [panel])
              update(container)
            })
          }
          emit$$1(button, internal.swap(), {
            transform,
            swap,
          })
        }
      }
      const cropPanelUpdate = function (_anyInSystem) {
        imagePanel.showCrop()
      }
      const resizePanelUpdate = function (anyInSystem) {
        memSize.getOpt(anyInSystem).each((sizeInput) => {
          const measurements = imagePanel.getMeasurements()
          const { width } = measurements
          const { height } = measurements
          Representing.setValue(sizeInput, {
            width,
            height,
          })
        })
      }
      const sharpenTransform = Option.some(ImageTransformations.sharpen)
      const invertTransform = Option.some(ImageTransformations.invert)
      var ButtonPanel = Container.sketch({
        dom: panelDom,
        components: [
          createIconButton('crop', 'Crop', getTransformPanelEvent(CropPanel, none, cropPanelUpdate), false),
          createIconButton('resize', 'Resize', getTransformPanelEvent(ResizePanel, none, resizePanelUpdate), false),
          createIconButton('orientation', 'Orientation', getTransformPanelEvent(FlipRotatePanel, none, noop$$1), false),
          createIconButton('brightness', 'Brightness', getTransformPanelEvent(BrightnessPanel, none, noop$$1), false),
          createIconButton('sharpen', 'Sharpen', getTransformPanelEvent(FilterPanel, sharpenTransform, noop$$1), false),
          createIconButton('contrast', 'Contrast', getTransformPanelEvent(ContrastPanel, none, noop$$1), false),
          createIconButton('color-levels', 'Color levels', getTransformPanelEvent(ColorizePanel, none, noop$$1), false),
          createIconButton('gamma', 'Gamma', getTransformPanelEvent(GammaPanel, none, noop$$1), false),
          createIconButton('invert', 'Invert', getTransformPanelEvent(FilterPanel, invertTransform, noop$$1), false),
        ],
      })
      const container = Container.sketch({
        dom: { tag: 'div' },
        components: [ButtonPanel],
        containerBehaviours: derive$1([Replacing.config({})]),
      })
      var memContainer = record(container)
      const getApplyButton = function (anyInSystem) {
        return memContainer.getOpt(anyInSystem).map((container) => {
          const panel = container.components()[0]
          return panel.components()[panel.components().length - 1]
        })
      }
      return {
        memContainer,
        getApplyButton,
      }
    }

    const global$7 = tinymce.util.Tools.resolve('tinymce.dom.DomQuery')

    const global$8 = tinymce.util.Tools.resolve('tinymce.geom.Rect')

    const global$9 = tinymce.util.Tools.resolve('tinymce.util.Observable')

    const global$a = tinymce.util.Tools.resolve('tinymce.util.Tools')

    const global$b = tinymce.util.Tools.resolve('tinymce.util.VK')

    function getDocumentSize(doc) {
      let documentElement, body, scrollWidth, clientWidth
      let offsetWidth, scrollHeight, clientHeight, offsetHeight
      const { max } = Math
      documentElement = doc.documentElement
      body = doc.body
      scrollWidth = max(documentElement.scrollWidth, body.scrollWidth)
      clientWidth = max(documentElement.clientWidth, body.clientWidth)
      offsetWidth = max(documentElement.offsetWidth, body.offsetWidth)
      scrollHeight = max(documentElement.scrollHeight, body.scrollHeight)
      clientHeight = max(documentElement.clientHeight, body.clientHeight)
      offsetHeight = max(documentElement.offsetHeight, body.offsetHeight)
      return {
        width: scrollWidth < offsetWidth ? clientWidth : scrollWidth,
        height: scrollHeight < offsetHeight ? clientHeight : scrollHeight,
      }
    }
    function updateWithTouchData(e) {
      let keys, i
      if (e.changedTouches) {
        keys = 'screenX screenY pageX pageY clientX clientY'.split(' ')
        for (i = 0; i < keys.length; i++) {
          e[keys[i]] = e.changedTouches[0][keys[i]]
        }
      }
    }
    function DragHelper(id, settings) {
      let $eventOverlay
      const doc = settings.document || document
      let downButton
      let start, stop$$1, drag, startX, startY
      settings = settings || {}
      const handleElement = doc.getElementById(settings.handle || id)
      start = function (e) {
        const docSize = getDocumentSize(doc)
        let handleElm, cursor
        updateWithTouchData(e)
        e.preventDefault()
        downButton = e.button
        handleElm = handleElement
        startX = e.screenX
        startY = e.screenY
        if (window.getComputedStyle) {
          cursor = window.getComputedStyle(handleElm, null).getPropertyValue('cursor')
        } else {
          cursor = handleElm.runtimeStyle.cursor
        }
        $eventOverlay = global$7('<div></div>').css({
          position: 'absolute',
          top: 0,
          left: 0,
          width: docSize.width,
          height: docSize.height,
          zIndex: 2147483647,
          opacity: 0.0001,
          cursor,
        }).appendTo(doc.body)
        global$7(doc).on('mousemove touchmove', drag).on('mouseup touchend', stop$$1)
        settings.start(e)
      }
      drag = function (e) {
        updateWithTouchData(e)
        if (e.button !== downButton) {
          return stop$$1(e)
        }
        e.deltaX = e.screenX - startX
        e.deltaY = e.screenY - startY
        e.preventDefault()
        settings.drag(e)
      }
      stop$$1 = function (e) {
        updateWithTouchData(e)
        global$7(doc).off('mousemove touchmove', drag).off('mouseup touchend', stop$$1)
        $eventOverlay.remove()
        if (settings.stop) {
          settings.stop(e)
        }
      }
      this.destroy = function () {
        global$7(handleElement).off()
      }
      global$7(handleElement).on('mousedown touchstart', start)
    }

    let count = 0
    function CropRect(currentRect, viewPortRect, clampRect, containerElm, action) {
      let instance
      let handles
      let dragHelpers
      let blockers
      const prefix = 'tox-'
      const id = `${prefix}crid-${count++}`
      handles = [
        {
          name: 'move',
          xMul: 0,
          yMul: 0,
          deltaX: 1,
          deltaY: 1,
          deltaW: 0,
          deltaH: 0,
          label: 'Crop Mask',
        },
        {
          name: 'nw',
          xMul: 0,
          yMul: 0,
          deltaX: 1,
          deltaY: 1,
          deltaW: -1,
          deltaH: -1,
          label: 'Top Left Crop Handle',
        },
        {
          name: 'ne',
          xMul: 1,
          yMul: 0,
          deltaX: 0,
          deltaY: 1,
          deltaW: 1,
          deltaH: -1,
          label: 'Top Right Crop Handle',
        },
        {
          name: 'sw',
          xMul: 0,
          yMul: 1,
          deltaX: 1,
          deltaY: 0,
          deltaW: -1,
          deltaH: 1,
          label: 'Bottom Left Crop Handle',
        },
        {
          name: 'se',
          xMul: 1,
          yMul: 1,
          deltaX: 0,
          deltaY: 0,
          deltaW: 1,
          deltaH: 1,
          label: 'Bottom Right Crop Handle',
        },
      ]
      blockers = [
        'top',
        'right',
        'bottom',
        'left',
      ]
      function getAbsoluteRect(outerRect, relativeRect) {
        return {
          x: relativeRect.x + outerRect.x,
          y: relativeRect.y + outerRect.y,
          w: relativeRect.w,
          h: relativeRect.h,
        }
      }
      function getRelativeRect(outerRect, innerRect) {
        return {
          x: innerRect.x - outerRect.x,
          y: innerRect.y - outerRect.y,
          w: innerRect.w,
          h: innerRect.h,
        }
      }
      function getInnerRect() {
        return getRelativeRect(clampRect, currentRect)
      }
      function moveRect(handle, startRect, deltaX, deltaY) {
        let x, y, w, h, rect
        x = startRect.x
        y = startRect.y
        w = startRect.w
        h = startRect.h
        x += deltaX * handle.deltaX
        y += deltaY * handle.deltaY
        w += deltaX * handle.deltaW
        h += deltaY * handle.deltaH
        if (w < 20) {
          w = 20
        }
        if (h < 20) {
          h = 20
        }
        rect = currentRect = global$8.clamp({
          x,
          y,
          w,
          h,
        }, clampRect, handle.name === 'move')
        rect = getRelativeRect(clampRect, rect)
        instance.fire('updateRect', { rect })
        setInnerRect(rect)
      }
      function render() {
        function createDragHelper(handle) {
          let startRect
          return new DragHelper(id, {
            document: containerElm.ownerDocument,
            handle: `${id}-${handle.name}`,
            start() {
              startRect = currentRect
            },
            drag(e) {
              moveRect(handle, startRect, e.deltaX, e.deltaY)
            },
          })
        }
        global$7(`<div id="${id}" class="${prefix}croprect-container"` + ` role="grid" aria-dropeffect="execute">`).appendTo(containerElm)
        global$a.each(blockers, (blocker) => {
          global$7(`#${id}`, containerElm).append(`<div id="${id}-${blocker}"class="${prefix}croprect-block" style="display: none" data-mce-bogus="all">`)
        })
        global$a.each(handles, (handle) => {
          global$7(`#${id}`, containerElm).append(`<div id="${id}-${handle.name}" class="${prefix}croprect-handle ${prefix}croprect-handle-${handle.name}"` + `style="display: none" data-mce-bogus="all" role="gridcell" tabindex="-1"` + ` aria-label="${handle.label}" aria-grabbed="false" title="${handle.label}">`)
        })
        dragHelpers = global$a.map(handles, createDragHelper)
        repaint(currentRect)
        global$7(containerElm).on('focusin focusout', (e) => {
          global$7(e.target).attr('aria-grabbed', e.type === 'focus')
        })
        global$7(containerElm).on('keydown', (e) => {
          let activeHandle
          global$a.each(handles, (handle) => {
            if (e.target.id === `${id}-${handle.name}`) {
              activeHandle = handle
              return false
            }
          })
          function moveAndBlock(evt, handle, startRect, deltaX, deltaY) {
            evt.stopPropagation()
            evt.preventDefault()
            moveRect(activeHandle, startRect, deltaX, deltaY)
          }
          switch (e.keyCode) {
            case global$b.LEFT:
              moveAndBlock(e, activeHandle, currentRect, -10, 0)
              break
            case global$b.RIGHT:
              moveAndBlock(e, activeHandle, currentRect, 10, 0)
              break
            case global$b.UP:
              moveAndBlock(e, activeHandle, currentRect, 0, -10)
              break
            case global$b.DOWN:
              moveAndBlock(e, activeHandle, currentRect, 0, 10)
              break
            case global$b.ENTER:
            case global$b.SPACEBAR:
              e.preventDefault()
              action()
              break
          }
        })
      }
      function toggleVisibility(state) {
        let selectors
        selectors = global$a.map(handles, (handle) => `#${id}-${handle.name}`).concat(global$a.map(blockers, (blocker) => `#${id}-${blocker}`)).join(',')
        if (state) {
          global$7(selectors, containerElm).show()
        } else {
          global$7(selectors, containerElm).hide()
        }
      }
      function repaint(rect) {
        function updateElementRect(name, rect) {
          if (rect.h < 0) {
            rect.h = 0
          }
          if (rect.w < 0) {
            rect.w = 0
          }
          global$7(`#${id}-${name}`, containerElm).css({
            left: rect.x,
            top: rect.y,
            width: rect.w,
            height: rect.h,
          })
        }
        global$a.each(handles, (handle) => {
          global$7(`#${id}-${handle.name}`, containerElm).css({
            left: rect.w * handle.xMul + rect.x,
            top: rect.h * handle.yMul + rect.y,
          })
        })
        updateElementRect('top', {
          x: viewPortRect.x,
          y: viewPortRect.y,
          w: viewPortRect.w,
          h: rect.y - viewPortRect.y,
        })
        updateElementRect('right', {
          x: rect.x + rect.w,
          y: rect.y,
          w: viewPortRect.w - rect.x - rect.w + viewPortRect.x,
          h: rect.h,
        })
        updateElementRect('bottom', {
          x: viewPortRect.x,
          y: rect.y + rect.h,
          w: viewPortRect.w,
          h: viewPortRect.h - rect.y - rect.h + viewPortRect.y,
        })
        updateElementRect('left', {
          x: viewPortRect.x,
          y: rect.y,
          w: rect.x - viewPortRect.x,
          h: rect.h,
        })
        updateElementRect('move', rect)
      }
      function setRect(rect) {
        currentRect = rect
        repaint(currentRect)
      }
      function setViewPortRect(rect) {
        viewPortRect = rect
        repaint(currentRect)
      }
      function setInnerRect(rect) {
        setRect(getAbsoluteRect(clampRect, rect))
      }
      function setClampRect(rect) {
        clampRect = rect
        repaint(currentRect)
      }
      function destroy() {
        global$a.each(dragHelpers, (helper) => {
          helper.destroy()
        })
        dragHelpers = []
      }
      render()
      instance = global$a.extend({
        toggleVisibility,
        setClampRect,
        setRect,
        getInnerRect,
        setInnerRect,
        setViewPortRect,
        destroy,
      }, global$9)
      return instance
    }

    const loadImage$1 = function (image) {
      return new global$1((resolve) => {
        var loaded = function () {
          image.removeEventListener('load', loaded)
          resolve(image)
        }
        if (image.complete) {
          resolve(image)
        } else {
          image.addEventListener('load', loaded)
        }
      })
    }
    const renderImagePanel = function (initialUrl) {
      const memBg = record({
        dom: {
          tag: 'div',
          classes: ['tox-image-tools__image-bg'],
          attributes: { role: 'presentation' },
        },
      })
      const zoomState = Cell(1)
      const cropRect = Cell(Option.none())
      const rectState = Cell({
        x: 0,
        y: 0,
        w: 1,
        h: 1,
      })
      const viewRectState = Cell({
        x: 0,
        y: 0,
        w: 1,
        h: 1,
      })
      const repaintImg = function (anyInSystem, img) {
        memContainer.getOpt(anyInSystem).each((panel) => {
          const zoom = zoomState.get()
          const panelW = get$8(panel.element())
          const panelH = get$9(panel.element())
          const width = img.dom().naturalWidth * zoom
          const height = img.dom().naturalHeight * zoom
          const left = Math.max(0, panelW / 2 - width / 2)
          const top = Math.max(0, panelH / 2 - height / 2)
          const css = {
            left: `${left.toString()}px`,
            top: `${top.toString()}px`,
            width: `${width.toString()}px`,
            height: `${height.toString()}px`,
            position: 'absolute',
          }
          setAll$1(img, css)
          memBg.getOpt(panel).each((bg) => {
            setAll$1(bg.element(), css)
          })
          cropRect.get().each((cRect) => {
            const rect = rectState.get()
            cRect.setRect({
              x: rect.x * zoom + left,
              y: rect.y * zoom + top,
              w: rect.w * zoom,
              h: rect.h * zoom,
            })
            cRect.setClampRect({
              x: left,
              y: top,
              w: width,
              h: height,
            })
            cRect.setViewPortRect({
              x: 0,
              y: 0,
              w: panelW,
              h: panelH,
            })
          })
        })
      }
      const zoomFit = function (anyInSystem, img) {
        memContainer.getOpt(anyInSystem).each((panel) => {
          const panelW = get$8(panel.element())
          const panelH = get$9(panel.element())
          const width = img.dom().naturalWidth
          const height = img.dom().naturalHeight
          const zoom = Math.min(panelW / width, panelH / height)
          if (zoom >= 1) {
            zoomState.set(1)
          } else {
            zoomState.set(zoom)
          }
        })
      }
      const updateSrc = function (anyInSystem, url) {
        const img = Element$$1.fromTag('img')
        set$1(img, 'src', url)
        return loadImage$1(img.dom()).then(() => memContainer.getOpt(anyInSystem).map((panel) => {
          const aImg = external({ element: img })
          Replacing.replaceAt(panel, 1, Option.some(aImg))
          const lastViewRect = viewRectState.get()
          const viewRect = {
            x: 0,
            y: 0,
            w: img.dom().naturalWidth,
            h: img.dom().naturalHeight,
          }
          viewRectState.set(viewRect)
          const rect = global$8.inflate(viewRect, -20, -20)
          rectState.set(rect)
          if (lastViewRect.w !== viewRect.w || lastViewRect.h !== viewRect.h) {
            zoomFit(panel, img)
          }
          repaintImg(panel, img)
          return img
        }))
      }
      const zoom = function (anyInSystem, direction) {
        const currentZoom = zoomState.get()
        const newZoom = direction > 0 ? Math.min(2, currentZoom + 0.1) : Math.max(0.1, currentZoom - 0.1)
        zoomState.set(newZoom)
        memContainer.getOpt(anyInSystem).each((panel) => {
          const img = panel.components()[1].element()
          repaintImg(panel, img)
        })
      }
      const showCrop = function () {
        cropRect.get().each((cRect) => {
          cRect.toggleVisibility(true)
        })
      }
      const hideCrop = function () {
        cropRect.get().each((cRect) => {
          cRect.toggleVisibility(false)
        })
      }
      const getRect = function () {
        return rectState.get()
      }
      const container = Container.sketch({
        dom: {
          tag: 'div',
          classes: ['tox-image-tools__image'],
        },
        components: [
          memBg.asSpec(),
          {
            dom: {
              tag: 'img',
              attributes: { src: initialUrl },
            },
          },
          {
            dom: { tag: 'div' },
            behaviours: derive$1([config('image-panel-crop-events', [runOnAttached((comp) => {
              memContainer.getOpt(comp).each((container) => {
                const el = container.element().dom()
                const cRect = CropRect({
                  x: 10,
                  y: 10,
                  w: 100,
                  h: 100,
                }, {
                  x: 0,
                  y: 0,
                  w: 200,
                  h: 200,
                }, {
                  x: 0,
                  y: 0,
                  w: 200,
                  h: 200,
                }, el, () => {
                })
                cRect.toggleVisibility(false)
                cRect.on('updateRect', (e) => {
                  const { rect } = e
                  const zoom = zoomState.get()
                  const newRect = {
                    x: Math.round(rect.x / zoom),
                    y: Math.round(rect.y / zoom),
                    w: Math.round(rect.w / zoom),
                    h: Math.round(rect.h / zoom),
                  }
                  rectState.set(newRect)
                })
                cropRect.set(Option.some(cRect))
              })
            })])]),
          },
        ],
        containerBehaviours: derive$1([
          Replacing.config({}),
          config('image-panel-events', [runOnAttached((comp) => {
            updateSrc(comp, initialUrl)
          })]),
        ]),
      })
      var memContainer = record(container)
      const getMeasurements = function () {
        const viewRect = viewRectState.get()
        return {
          width: viewRect.w,
          height: viewRect.h,
        }
      }
      return {
        memContainer,
        updateSrc,
        zoom,
        showCrop,
        hideCrop,
        getRect,
        getMeasurements,
      }
    }

    const createButton = function (innerHtml, icon, disabled, action, providersBackstage) {
      return renderIconButton({
        name: innerHtml,
        icon: Option.some(icon),
        disabled,
        tooltip: Option.some(innerHtml),
      }, action, providersBackstage)
    }
    const setButtonEnabled = function (button, enabled) {
      if (enabled) {
        Disabling.enable(button)
      } else {
        Disabling.disable(button)
      }
    }
    const renderSideBar = function (providersBackstage) {
      const updateButtonUndoStates = function (anyInSystem, undoEnabled, redoEnabled) {
        memUndo.getOpt(anyInSystem).each((undo) => {
          setButtonEnabled(undo, undoEnabled)
        })
        memRedo.getOpt(anyInSystem).each((redo) => {
          setButtonEnabled(redo, redoEnabled)
        })
      }
      var memUndo = record(createButton('Undo', 'undo', true, (button) => {
        emitWith(button, internal.undo(), { direction: 1 })
      }, providersBackstage))
      var memRedo = record(createButton('Redo', 'redo', true, (button) => {
        emitWith(button, internal.redo(), { direction: 1 })
      }, providersBackstage))
      const container = Container.sketch({
        dom: {
          tag: 'div',
          classes: [
            'tox-image-tools__toolbar',
            'tox-image-tools__sidebar',
          ],
        },
        components: [
          memUndo.asSpec(),
          memRedo.asSpec(),
          createButton('Zoom in', 'zoom-in', false, (button) => {
            emitWith(button, internal.zoom(), { direction: 1 })
          }, providersBackstage),
          createButton('Zoom out', 'zoom-out', false, (button) => {
            emitWith(button, internal.zoom(), { direction: -1 })
          }, providersBackstage),
        ],
      })
      return {
        container,
        updateButtonUndoStates,
      }
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

    function UndoStack() {
      const data = []
      let index = -1
      function add(state) {
        let removed
        removed = data.splice(++index)
        data.push(state)
        return {
          state,
          removed,
        }
      }
      function undo() {
        if (canUndo()) {
          return data[--index]
        }
      }
      function redo() {
        if (canRedo()) {
          return data[++index]
        }
      }
      function canUndo() {
        return index > 0
      }
      function canRedo() {
        return index !== -1 && index < data.length - 1
      }
      return {
        data,
        add,
        undo,
        redo,
        canUndo,
        canRedo,
      }
    }

    const makeState = function (initialState) {
      const blobState = Cell(initialState)
      const tempState = Cell(Option.none())
      const undoStack = UndoStack()
      undoStack.add(initialState)
      const getBlobState = function () {
        return blobState.get()
      }
      const setBlobState = function (state) {
        blobState.set(state)
      }
      const getTempState = function () {
        return tempState.get().fold(() => blobState.get(), (temp) => temp)
      }
      const updateTempState = function (blob) {
        const newTempState = createState(blob)
        destroyTempState()
        tempState.set(Option.some(newTempState))
        return newTempState.url
      }
      var createState = function (blob) {
        return {
          blob,
          url: URL$1.createObjectURL(blob),
        }
      }
      const destroyState = function (state) {
        URL$1.revokeObjectURL(state.url)
      }
      const destroyStates = function (states) {
        global$a.each(states, destroyState)
      }
      var destroyTempState = function () {
        tempState.get().each(destroyState)
        tempState.set(Option.none())
      }
      const addBlobState = function (blob) {
        const newState = createState(blob)
        setBlobState(newState)
        const { removed } = undoStack.add(newState)
        destroyStates(removed)
        return newState.url
      }
      const addTempState = function (blob) {
        const newState = createState(blob)
        tempState.set(Option.some(newState))
        return newState.url
      }
      const applyTempState = function (postApply) {
        return tempState.get().fold(() => {
        }, (temp) => {
          addBlobState(temp.blob)
          postApply()
        })
      }
      const undo = function () {
        const currentState = undoStack.undo()
        setBlobState(currentState)
        return currentState.url
      }
      const redo = function () {
        const currentState = undoStack.redo()
        setBlobState(currentState)
        return currentState.url
      }
      const getHistoryStates = function () {
        const undoEnabled = undoStack.canUndo()
        const redoEnabled = undoStack.canRedo()
        return {
          undoEnabled,
          redoEnabled,
        }
      }
      return {
        getBlobState,
        setBlobState,
        addBlobState,
        getTempState,
        updateTempState,
        addTempState,
        applyTempState,
        destroyTempState,
        undo,
        redo,
        getHistoryStates,
      }
    }

    const renderImageTools = function (detail, providersBackstage) {
      const state = makeState(detail.currentState)
      const zoom = function (anyInSystem, simulatedEvent) {
        const direction = simulatedEvent.event().direction()
        imagePanel.zoom(anyInSystem, direction)
      }
      const updateButtonUndoStates = function (anyInSystem) {
        const historyStates = state.getHistoryStates()
        sideBar.updateButtonUndoStates(anyInSystem, historyStates.undoEnabled, historyStates.redoEnabled)
        emitWith(anyInSystem, external$2.formActionEvent, {
          name: external$2.saveState(),
          value: historyStates.undoEnabled,
        })
      }
      const disableUndoRedo = function (anyInSystem) {
        sideBar.updateButtonUndoStates(anyInSystem, false, false)
      }
      const undo = function (anyInSystem, _simulatedEvent) {
        const url = state.undo()
        updateSrc(anyInSystem, url).then((oImg) => {
          unblock(anyInSystem)
          updateButtonUndoStates(anyInSystem)
        })
      }
      const redo = function (anyInSystem, _simulatedEvent) {
        const url = state.redo()
        updateSrc(anyInSystem, url).then((oImg) => {
          unblock(anyInSystem)
          updateButtonUndoStates(anyInSystem)
        })
      }
      const imageResultToBlob = function (ir) {
        return ir.toBlob()
      }
      const block = function (anyInSystem) {
        emitWith(anyInSystem, external$2.formActionEvent, {
          name: external$2.disable(),
          value: {},
        })
      }
      var unblock = function (anyInSystem) {
        editPanel.getApplyButton(anyInSystem).each((applyButton) => {
          Disabling.enable(applyButton)
        })
        emitWith(anyInSystem, external$2.formActionEvent, {
          name: external$2.enable(),
          value: {},
        })
      }
      var updateSrc = function (anyInSystem, src) {
        block(anyInSystem)
        return imagePanel.updateSrc(anyInSystem, src)
      }
      const blobManipulate = function (anyInSystem, blob, filter, action, swap) {
        block(anyInSystem)
        return ResultConversions.blobToImageResult(blob).then(filter).then(imageResultToBlob).then(action).then((url) => updateSrc(anyInSystem, url).then((oImg) => {
          updateButtonUndoStates(anyInSystem)
          swap()
          unblock(anyInSystem)
          return oImg
        })).catch((err) => {
          console.log(err)
          unblock(anyInSystem)
        })
      }
      const manipulate = function (anyInSystem, filter, swap) {
        const { blob } = state.getBlobState()
        const action = function (blob) {
          return state.updateTempState(blob)
        }
        blobManipulate(anyInSystem, blob, filter, action, swap)
      }
      const tempManipulate = function (anyInSystem, filter) {
        const { blob } = state.getTempState()
        const action = function (blob) {
          return state.addTempState(blob)
        }
        blobManipulate(anyInSystem, blob, filter, action, noop)
      }
      const manipulateApply = function (anyInSystem, filter, swap) {
        const { blob } = state.getBlobState()
        const action = function (blob) {
          const url = state.addBlobState(blob)
          destroyTempState(anyInSystem)
          return url
        }
        blobManipulate(anyInSystem, blob, filter, action, swap)
      }
      const apply$$1 = function (anyInSystem, simulatedEvent) {
        const postApply = function () {
          destroyTempState(anyInSystem)
          const swap = simulatedEvent.event().swap()
          swap()
        }
        state.applyTempState(postApply)
      }
      var destroyTempState = function (anyInSystem) {
        const currentUrl = state.getBlobState().url
        state.destroyTempState()
        updateButtonUndoStates(anyInSystem)
        return currentUrl
      }
      const cancel = function (anyInSystem) {
        const currentUrl = destroyTempState(anyInSystem)
        updateSrc(anyInSystem, currentUrl).then((oImg) => {
          unblock(anyInSystem)
        })
      }
      const back = function (anyInSystem, simulatedEvent) {
        cancel(anyInSystem)
        const swap = simulatedEvent.event().swap()
        swap()
        imagePanel.hideCrop()
      }
      const transform = function (anyInSystem, simulatedEvent) {
        return manipulate(anyInSystem, simulatedEvent.event().transform(), noop)
      }
      const tempTransform = function (anyInSystem, simulatedEvent) {
        return tempManipulate(anyInSystem, simulatedEvent.event().transform())
      }
      const transformApply = function (anyInSystem, simulatedEvent) {
        return manipulateApply(anyInSystem, simulatedEvent.event().transform(), simulatedEvent.event().swap())
      }
      var imagePanel = renderImagePanel(detail.currentState.url)
      var sideBar = renderSideBar(providersBackstage)
      var editPanel = renderEditPanel(imagePanel, providersBackstage)
      const swap = function (anyInSystem, simulatedEvent) {
        disableUndoRedo(anyInSystem)
        const transform = simulatedEvent.event().transform()
        const swap = simulatedEvent.event().swap()
        transform.fold(() => {
          swap()
        }, (transform) => {
          manipulate(anyInSystem, transform, swap)
        })
      }
      return {
        dom: {
          tag: 'div',
          attributes: { role: 'presentation' },
        },
        components: [
          editPanel.memContainer.asSpec(),
          imagePanel.memContainer.asSpec(),
          sideBar.container,
        ],
        behaviours: derive$1([
          Representing.config({
            store: {
              mode: 'manual',
              getValue() {
                return state.getBlobState()
              },
            },
          }),
          config('image-tools-events', [
            run(internal.undo(), undo),
            run(internal.redo(), redo),
            run(internal.zoom(), zoom),
            run(internal.back(), back),
            run(internal.apply(), apply$$1),
            run(internal.transform(), transform),
            run(internal.tempTransform(), tempTransform),
            run(internal.transformApply(), transformApply),
            run(internal.swap(), swap),
          ]),
          ComposingConfigs.self(),
        ]),
      }
    }

    const factory$8 = function (detail, spec) {
      const options = map(detail.options, (option$$1) => ({
        dom: {
          tag: 'option',
          value: option$$1.value,
          innerHtml: option$$1.text,
        },
      }))
      const initialValues = detail.data.map((v) => wrap$1('initialValue', v)).getOr({})
      return {
        uid: detail.uid,
        dom: {
          tag: 'select',
          classes: detail.selectClasses,
          attributes: detail.selectAttributes,
        },
        components: options,
        behaviours: augment(detail.selectBehaviours, [
          Focusing.config({}),
          Representing.config({
            store: __assign({
              mode: 'manual',
              getValue(select) {
                return get$6(select.element())
              },
              setValue(select, newValue) {
                const found = find(detail.options, (opt) => opt.value === newValue)
                if (found.isSome()) {
                  set$3(select.element(), newValue)
                }
              },
            }, initialValues),
          }),
        ]),
      }
    }
    const HtmlSelect = single$2({
      name: 'HtmlSelect',
      configFields: [
        strict$1('options'),
        field$1('selectBehaviours', [
          Focusing,
          Representing,
        ]),
        defaulted$1('selectClasses', []),
        defaulted$1('selectAttributes', {}),
        option('data'),
      ],
      factory: factory$8,
    })

    const renderSelectBox = function (spec, providersBackstage) {
      const pLabel = spec.label.map((label) => renderLabel(label, providersBackstage))
      const pField = FormField.parts().field({
        dom: {},
        selectAttributes: { size: spec.size },
        options: spec.items,
        factory: HtmlSelect,
        selectBehaviours: derive$1([
          Tabstopping.config({}),
          config('selectbox-change', [run(change(), (component, _) => {
            emitWith(component, formChangeEvent, { name: spec.name })
          })]),
        ]),
      })
      const chevron = spec.size > 1 ? Option.none() : Option.some({
        dom: {
          tag: 'div',
          classes: ['tox-selectfield__icon-js'],
          innerHtml: get$e('chevron-down', providersBackstage.icons),
        },
      })
      const selectWrap = {
        dom: {
          tag: 'div',
          classes: ['tox-selectfield'],
        },
        components: flatten([
          [pField],
          chevron.toArray(),
        ]),
      }
      return FormField.sketch({
        dom: {
          tag: 'div',
          classes: ['tox-form__group'],
        },
        components: flatten([
          pLabel.toArray(),
          [selectWrap],
        ]),
      })
    }

    const renderTextField = function (spec, providersBackstage) {
      const pLabel = spec.label.map((label) => renderLabel(label, providersBackstage))
      const baseInputBehaviours = [
        Keying.config({
          mode: 'execution',
          useEnter: spec.multiline !== true,
          useControlEnter: spec.multiline === true,
          execute(comp) {
            emit(comp, formSubmitEvent)
            return Option.some(true)
          },
        }),
        config('textfield-change', [
          run(input(), (component, _) => {
            emitWith(component, formChangeEvent, { name: spec.name })
          }),
          run(paste(), (component, _) => {
            emitWith(component, formChangeEvent, { name: spec.name })
          }),
        ]),
        Tabstopping.config({}),
      ]
      const validatingBehaviours = spec.validation.map((vl) => Invalidating.config({
        getRoot(input$$1) {
          return parent(input$$1.element())
        },
        invalidClass: 'tox-invalid',
        validator: {
          validate(input$$1) {
            const v = Representing.getValue(input$$1)
            const result = vl.validator(v)
            return Future.pure(result === true ? Result.value(v) : Result.error(result))
          },
          validateOnLoad: vl.validateOnLoad,
        },
      })).toArray()
      const pField = FormField.parts().field({
        tag: spec.multiline === true ? 'textarea' : 'input',
        inputAttributes: spec.placeholder.fold(() => {
        }, (placeholder) => ({ placeholder: providersBackstage.translate(placeholder) })),
        inputClasses: [spec.classname],
        inputBehaviours: derive$1(flatten([
          baseInputBehaviours,
          validatingBehaviours,
        ])),
        selectOnFocus: false,
        factory: Input,
      })
      const extraClasses = spec.flex ? ['tox-form__group--stretched'] : []
      return renderFormFieldWith(pLabel, pField, extraClasses)
    }
    const renderInput = function (spec, providersBackstage) {
      return renderTextField({
        name: spec.name,
        multiline: false,
        label: spec.label,
        placeholder: spec.placeholder,
        flex: false,
        classname: 'tox-textfield',
        validation: Option.none(),
      }, providersBackstage)
    }
    const renderTextarea = function (spec, providersBackstage) {
      return renderTextField({
        name: spec.name,
        multiline: true,
        label: spec.label,
        placeholder: spec.placeholder,
        flex: spec.flex,
        classname: 'tox-textarea',
        validation: Option.none(),
      }, providersBackstage)
    }

    var wrap$3 = function (delegate) {
      const toCached = function () {
        return wrap$3(delegate.toCached())
      }
      const bindFuture = function (f) {
        return wrap$3(delegate.bind((resA) => resA.fold((err) => Future.pure(Result.error(err)), (a) => f(a))))
      }
      const bindResult = function (f) {
        return wrap$3(delegate.map((resA) => resA.bind(f)))
      }
      const mapResult = function (f) {
        return wrap$3(delegate.map((resA) => resA.map(f)))
      }
      const mapError = function (f) {
        return wrap$3(delegate.map((resA) => resA.mapError(f)))
      }
      const foldResult = function (whenError, whenValue) {
        return delegate.map((res) => res.fold(whenError, whenValue))
      }
      const withTimeout = function (timeout, errorThunk) {
        return wrap$3(Future.nu((callback) => {
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
    const nu$c = function (worker) {
      return wrap$3(Future.nu(worker))
    }
    const value$3 = function (value) {
      return wrap$3(Future.pure(Result.value(value)))
    }
    const error$1 = function (error) {
      return wrap$3(Future.pure(Result.error(error)))
    }
    const fromResult$1 = function (result) {
      return wrap$3(Future.pure(result))
    }
    const fromFuture = function (future) {
      return wrap$3(future.map(Result.value))
    }
    const fromPromise = function (promise) {
      return nu$c((completer) => {
        promise.then((value) => {
          completer(Result.value(value))
        }, (error) => {
          completer(Result.error(error))
        })
      })
    }
    const FutureResult = {
      nu: nu$c,
      wrap: wrap$3,
      pure: value$3,
      value: value$3,
      error: error$1,
      fromResult: fromResult$1,
      fromFuture,
      fromPromise,
    }

    const separator$2 = { type: 'separator' }
    const toMenuItem = function (target) {
      return {
        type: 'menuitem',
        value: target.url,
        text: target.title,
        meta: { attach: target.attach },
        onAction() {
        },
      }
    }
    const staticMenuItem = function (title, url) {
      return {
        type: 'menuitem',
        value: url,
        text: title,
        meta: { attach: noop },
        onAction() {
        },
      }
    }
    const toMenuItems = function (targets) {
      return map(targets, toMenuItem)
    }
    const filterLinkTargets = function (type, targets) {
      return filter(targets, (target) => target.type === type)
    }
    const filteredTargets = function (type, targets) {
      return toMenuItems(filterLinkTargets(type, targets))
    }
    const headerTargets = function (linkInfo) {
      return filteredTargets('header', linkInfo.targets)
    }
    const anchorTargets = function (linkInfo) {
      return filteredTargets('anchor', linkInfo.targets)
    }
    const anchorTargetTop = function (linkInfo) {
      return linkInfo.anchorTop.map((url) => staticMenuItem('<top>', url)).toArray()
    }
    const anchorTargetBottom = function (linkInfo) {
      return linkInfo.anchorBottom.map((url) => staticMenuItem('<bottom>', url)).toArray()
    }
    const historyTargets = function (history) {
      return map(history, (url) => staticMenuItem(url, url))
    }
    const joinMenuLists = function (items) {
      return foldl(items, (a, b) => {
        const bothEmpty = a.length === 0 || b.length === 0
        return bothEmpty ? a.concat(b) : a.concat(separator$2, b)
      }, [])
    }
    const filterByQuery = function (term, menuItems) {
      const lowerCaseTerm = term.toLowerCase()
      return filter(menuItems, (item) => {
        const text = item.meta !== undefined && item.meta.text !== undefined ? item.meta.text : item.text
        return contains$1(text.toLowerCase(), lowerCaseTerm) || contains$1(item.value.toLowerCase(), lowerCaseTerm)
      })
    }

    const getItems = function (fileType, input$$1, urlBackstage) {
      const urlInputValue = Representing.getValue(input$$1)
      const term = urlInputValue.meta.text !== undefined ? urlInputValue.meta.text : urlInputValue.value
      const info = urlBackstage.getLinkInformation()
      return info.fold(() => [], (linkInfo) => {
        const history = filterByQuery(term, historyTargets(urlBackstage.getHistory(fileType)))
        return fileType === 'file' ? joinMenuLists([
          history,
          filterByQuery(term, headerTargets(linkInfo)),
          filterByQuery(term, flatten([
            anchorTargetTop(linkInfo),
            anchorTargets(linkInfo),
            anchorTargetBottom(linkInfo),
          ])),
        ]) : history
      })
    }
    const renderInputButton = function (label, eventName, className, iconName, providersBackstage) {
      return Button.sketch({
        dom: {
          tag: 'button',
          classes: [
            'tox-tbtn',
            className,
          ],
          innerHtml: get$e(iconName, providersBackstage.icons),
          attributes: { title: providersBackstage.translate(label.getOr('')) },
        },
        buttonBehaviours: derive$1([Tabstopping.config({})]),
        action(component) {
          emit(component, eventName)
        },
      })
    }
    const renderUrlInput = function (spec, sharedBackstage, urlBackstage) {
      let _a
      const updateHistory = function (component) {
        const urlEntry = Representing.getValue(component)
        urlBackstage.addToHistory(urlEntry.value, spec.filetype)
      }
      const pField = FormField.parts().field({
        factory: Typeahead,
        dismissOnBlur: true,
        inputClasses: ['tox-textfield'],
        sandboxClasses: ['tox-dialog__popups'],
        minChars: 0,
        responseTime: 0,
        fetch(input$$1) {
          const items = getItems(spec.filetype, input$$1, urlBackstage)
          const tdata = build$2(items, ItemResponse$1.BUBBLE_TO_SANDBOX, sharedBackstage.providers)
          return Future.pure(tdata)
        },
        getHotspot(comp) {
          return memUrlBox.getOpt(comp)
        },
        onSetValue(comp, newValue) {
          if (comp.hasConfigured(Invalidating)) {
            Invalidating.run(comp).get(noop)
          }
        },
        typeaheadBehaviours: derive$1(flatten([
          urlBackstage.getValidationHandler().map((handler) => Invalidating.config({
            getRoot(comp) {
              return parent(comp.element())
            },
            invalidClass: 'tox-control-wrap--status-invalid',
            notify: {},
            validator: {
              validate(input$$1) {
                const urlEntry = Representing.getValue(input$$1)
                return FutureResult.nu((completer) => {
                  handler({
                    type: spec.filetype,
                    url: urlEntry.value,
                  }, (validation) => {
                    memUrlBox.getOpt(input$$1).each((urlBox) => {
                      const toggle = function (component, clazz, b) {
                        (b ? add$2 : remove$4)(component.element(), clazz)
                      }
                      toggle(urlBox, 'tox-control-wrap--status-valid', validation.status === 'valid')
                      toggle(urlBox, 'tox-control-wrap--status-unknown', validation.status === 'unknown')
                    })
                    completer((validation.status === 'invalid' ? Result.error : Result.value)(validation.message))
                  })
                })
              },
              validateOnLoad: false,
            },
          })).toArray(),
          [
            Tabstopping.config({}),
            config('urlinput-events', flatten([
              spec.filetype === 'file' ? [run(input(), (comp) => {
                emitWith(comp, formChangeEvent, { name: spec.name })
              })] : [],
              [
                run(change(), (comp) => {
                  emitWith(comp, formChangeEvent, { name: spec.name })
                  updateHistory(comp)
                }),
                run(paste(), (comp) => {
                  emitWith(comp, formChangeEvent, { name: spec.name })
                  updateHistory(comp)
                }),
              ],
            ])),
          ],
        ])),
        eventOrder: (_a = {}, _a[input()] = [
          'streaming',
          'urlinput-events',
          'invalidating',
        ], _a),
        model: {
          getDisplayText(itemData) {
            return itemData.value
          },
          selectsOver: false,
          populateFromBrowse: false,
        },
        markers: { openClass: 'dog' },
        lazySink: sharedBackstage.getSink,
        parts: { menu: part(false, 1, 'normal') },
        onExecute(_menu, component, _entry) {
          emitWith(component, formSubmitEvent, {})
        },
        onItemExecute(typeahead, _sandbox, _item, _value) {
          updateHistory(typeahead)
          emitWith(typeahead, formChangeEvent, { name: spec.name })
        },
      })
      const pLabel = spec.label.map((label) => renderLabel(label, sharedBackstage.providers))
      const makeIcon = function (name, icon, label) {
        if (icon === void 0) {
          icon = name
        }
        if (label === void 0) {
          label = name
        }
        return {
          dom: {
            tag: 'div',
            classes: [
              'tox-icon',
              `tox-control-wrap__status-icon-${name}`,
            ],
            innerHtml: get$e(icon, sharedBackstage.providers.icons),
            attributes: { title: sharedBackstage.providers.translate(label) },
          },
        }
      }
      const memStatus = record({
        dom: {
          tag: 'div',
          classes: ['tox-control-wrap__status-icon-wrap'],
        },
        components: [
          makeIcon('valid', 'checkmark', 'valid'),
          makeIcon('unknown', 'warning'),
          makeIcon('invalid', 'warning'),
        ],
      })
      const optUrlPicker = urlBackstage.getUrlPicker(spec.filetype)
      const browseUrlEvent = generate$1('browser.url.event')
      var memUrlBox = record({
        dom: {
          tag: 'div',
          classes: ['tox-control-wrap'],
        },
        components: [
          pField,
          memStatus.asSpec(),
        ],
      })
      const controlHWrapper = function () {
        return {
          dom: {
            tag: 'div',
            classes: ['tox-form__controls-h-stack'],
          },
          components: flatten([
            [memUrlBox.asSpec()],
            optUrlPicker.map(() => renderInputButton(spec.label, browseUrlEvent, 'tox-browse-url', 'browse', sharedBackstage.providers)).toArray(),
          ]),
        }
      }
      const openUrlPicker = function (comp) {
        Composing.getCurrent(comp).each((field) => {
          const urlData = Representing.getValue(field)
          optUrlPicker.each((picker) => {
            picker(urlData).get((chosenData) => {
              Representing.setValue(field, chosenData)
              emitWith(comp, formChangeEvent, { name: spec.name })
            })
          })
        })
      }
      return FormField.sketch({
        dom: renderFormFieldDom(),
        components: pLabel.toArray().concat([controlHWrapper()]),
        fieldBehaviours: derive$1([config('url-input-events', [run(browseUrlEvent, openUrlPicker)])]),
      })
    }

    const renderCheckbox = function (spec, providerBackstage) {
      const repBehaviour = Representing.config({
        store: {
          mode: 'manual',
          getValue(comp) {
            const el = comp.element().dom()
            return el.indeterminate ? 'indeterminate' : el.checked ? 'checked' : 'unchecked'
          },
          setValue(comp, value) {
            const el = comp.element().dom()
            switch (value) {
              case 'indeterminate':
                el.indeterminate = true
                break
              case 'checked':
                el.checked = true
                el.indeterminate = false
                break
              default:
                el.checked = false
                el.indeterminate = false
                break
            }
          },
        },
      })
      const toggleCheckboxHandler = function (comp) {
        comp.element().dom().click()
        return Option.some(true)
      }
      const pField = FormField.parts().field({
        factory: { sketch: identity },
        dom: {
          tag: 'input',
          classes: ['tox-checkbox__input'],
          attributes: { type: 'checkbox' },
        },
        behaviours: derive$1([
          ComposingConfigs.self(),
          Tabstopping.config({}),
          Focusing.config({}),
          repBehaviour,
          Keying.config({
            mode: 'special',
            onEnter: toggleCheckboxHandler,
            onSpace: toggleCheckboxHandler,
          }),
          config('checkbox-events', [run(change(), (component, _) => {
            emitWith(component, formChangeEvent, { name: spec.name })
          })]),
        ]),
      })
      const pLabel = FormField.parts().label({
        dom: {
          tag: 'span',
          classes: ['tox-checkbox__label'],
          innerHtml: providerBackstage.translate(spec.label),
        },
        behaviours: derive$1([Unselecting.config({})]),
      })
      const makeIcon = function (className) {
        const iconName = className === 'checked' ? 'selected' : className === 'unchecked' ? 'unselected' : 'indeterminate'
        return {
          dom: {
            tag: 'span',
            classes: [
              'tox-icon',
              `tox-checkbox-icon__${className}`,
            ],
            innerHtml: get$e(iconName, providerBackstage.icons),
          },
        }
      }
      const memIcons = record({
        dom: {
          tag: 'div',
          classes: ['tox-checkbox__icons'],
        },
        components: [
          makeIcon('checked'),
          makeIcon('unchecked'),
          makeIcon('indeterminate'),
        ],
      })
      return FormField.sketch({
        dom: {
          tag: 'label',
          classes: ['tox-checkbox'],
        },
        components: [
          pField,
          memIcons.asSpec(),
          pLabel,
        ],
      })
    }

    const renderHtmlPanel = function (spec) {
      return Container.sketch({
        dom: {
          tag: 'div',
          innerHtml: spec.html,
        },
        containerBehaviours: derive$1([
          Tabstopping.config({}),
          Focusing.config({}),
        ]),
      })
    }

    const renderListbox = function (spec, providersBackstage) {
      const pLabel = renderLabel(spec.label, providersBackstage)
      const pField = FormField.parts().field({
        factory: HtmlSelect,
        dom: { classes: ['mce-select-field'] },
        selectBehaviours: derive$1([Tabstopping.config({})]),
        options: spec.values,
        data: spec.initialValue.getOr(undefined),
      })
      return renderFormField(Option.some(pLabel), pField)
    }

    const renderLabel$2 = function (spec, backstageShared) {
      const label = {
        dom: {
          tag: 'label',
          innerHtml: backstageShared.providers.translate(spec.label),
          classes: ['tox-label'],
        },
      }
      const comps = map(spec.items, backstageShared.interpreter)
      return {
        dom: {
          tag: 'div',
          classes: ['tox-form__group'],
        },
        components: [label].concat(comps),
        behaviours: derive$1([
          ComposingConfigs.self(),
          Replacing.config({}),
          RepresentingConfigs.domHtml(Option.none()),
          Keying.config({ mode: 'acyclic' }),
        ]),
      }
    }

    const renderCollection = function (spec, providersBackstage) {
      const pLabel = spec.label.map((label) => renderLabel(label, providersBackstage))
      const runOnItem = function (f) {
        return function (comp, se) {
          closest$3(se.event().target(), '[data-collection-item-value]').each((target) => {
            f(comp, target, get$2(target, 'data-collection-item-value'))
          })
        }
      }
      const escapeAttribute = function (ch) {
        if (ch === '"') {
          return '&quot;'
        }
        return ch
      }
      const setContents = function (comp, items) {
        const htmlLines = map(items, (item) => {
          const textContent = spec.columns === 1 ? item.text.map((text) => `<span class="tox-collection__item-label">${text}</span>`).getOr('') : ''
          const iconContent = item.icon.map((icon) => `<span class="tox-collection__item-icon">${icon}</span>`).getOr('')
          const mapItemName = {
            _: ' ',
            ' - ': ' ',
            '-': ' ',
          }
          const ariaLabel = item.text.getOr('').replace(/\_| \- |\-/g, (match) => mapItemName[match])
          return `<div class="tox-collection__item" tabindex="-1" data-collection-item-value="${escapeAttribute(item.value)}" title="${ariaLabel}" aria-label="${ariaLabel}">${iconContent}${textContent}</div>`
        })
        const chunks = spec.columns > 1 && spec.columns !== 'auto' ? chunk(htmlLines, spec.columns) : [htmlLines]
        const html = map(chunks, (ch) => `<div class="tox-collection__group">${ch.join('')}</div>`)
        set(comp.element(), html.join(''))
      }
      const collectionEvents = [
        run(mouseover(), runOnItem((comp, tgt) => {
          focus$2(tgt)
        })),
        run(click(), runOnItem((comp, tgt, itemValue) => {
          emitWith(comp, formActionEvent, {
            name: spec.name,
            value: itemValue,
          })
        })),
        run(focusin(), runOnItem((comp, tgt, itemValue) => {
          descendant$2(comp.element(), `.${activeClass}`).each((currentActive) => {
            remove$4(currentActive, activeClass)
          })
          add$2(tgt, activeClass)
        })),
        run(focusout(), runOnItem((comp, tgt, itemValue) => {
          descendant$2(comp.element(), `.${activeClass}`).each((currentActive) => {
            remove$4(currentActive, activeClass)
          })
        })),
        runOnExecute(runOnItem((comp, tgt, itemValue) => {
          emitWith(comp, formActionEvent, {
            name: spec.name,
            value: itemValue,
          })
        })),
      ]
      const pField = FormField.parts().field({
        dom: {
          tag: 'div',
          classes: ['tox-collection'].concat(spec.columns !== 1 ? ['tox-collection--grid'] : ['tox-collection--list']),
        },
        components: [],
        factory: { sketch: identity },
        behaviours: derive$1([
          Replacing.config({}),
          Representing.config({
            store: {
              mode: 'memory',
              initialValue: [],
            },
            onSetValue(comp, items) {
              setContents(comp, items)
              if (spec.columns === 'auto') {
                detectSize(comp, 5, 'tox-collection__item').each((_a) => {
                  const { numRows } = _a; const { numColumns } = _a
                  Keying.setGridSize(comp, numRows, numColumns)
                })
              }
              emit(comp, formResizeEvent)
            },
          }),
          Tabstopping.config({}),
          Keying.config(deriveCollectionMovement(spec.columns, 'normal')),
          config('collection-events', collectionEvents),
        ]),
      })
      const extraClasses = ['tox-form__group--collection']
      return renderFormFieldWith(pLabel, pField, extraClasses)
    }

    const renderTable = function (spec, providersBackstage) {
      const renderTh = function (text) {
        return {
          dom: {
            tag: 'th',
            innerHtml: providersBackstage.translate(text),
          },
        }
      }
      const renderHeader = function (header) {
        return {
          dom: { tag: 'thead' },
          components: [{
            dom: { tag: 'tr' },
            components: map(header, renderTh),
          }],
        }
      }
      const renderTd = function (text) {
        return {
          dom: {
            tag: 'td',
            innerHtml: providersBackstage.translate(text),
          },
        }
      }
      const renderTr = function (row) {
        return {
          dom: { tag: 'tr' },
          components: map(row, renderTd),
        }
      }
      const renderRows = function (rows) {
        return {
          dom: { tag: 'tbody' },
          components: map(rows, renderTr),
        }
      }
      return {
        dom: {
          tag: 'table',
          classes: ['tox-dialog__table'],
        },
        components: [
          renderHeader(spec.header),
          renderRows(spec.cells),
        ],
        behaviours: derive$1([
          Tabstopping.config({}),
          Focusing.config({}),
        ]),
      }
    }

    const make$5 = function (render) {
      return function (parts, spec, backstage) {
        return readOptFrom$1(spec, 'name').fold(() => render(spec, backstage), (fieldName) => parts.field(fieldName, render(spec, backstage)))
      }
    }
    const makeIframe = function (render) {
      return function (parts, spec, backstage) {
        const iframeSpec = deepMerge(spec, { source: 'dynamic' })
        return make$5(render)(parts, iframeSpec, backstage)
      }
    }
    const factories = {
      bar: make$5((spec, backstage) => renderBar(spec, backstage.shared)),
      collection: make$5((spec, backstage) => renderCollection(spec, backstage.shared.providers)),
      alloy: make$5(identity),
      alertbanner: make$5((spec, backstage) => renderAlertBanner(spec, backstage.shared.providers)),
      input: make$5((spec, backstage) => renderInput(spec, backstage.shared.providers)),
      textarea: make$5((spec, backstage) => renderTextarea(spec, backstage.shared.providers)),
      listbox: make$5((spec, backstage) => renderListbox(spec, backstage.shared.providers)),
      label: make$5((spec, backstage) => renderLabel$2(spec, backstage.shared)),
      iframe: makeIframe((spec, backstage) => renderIFrame(spec, backstage.shared.providers)),
      autocomplete: make$5((spec, backstage) => renderAutocomplete(spec, backstage.shared)),
      button: make$5((spec, backstage) => renderDialogButton(spec, backstage.shared.providers)),
      checkbox: make$5((spec, backstage) => renderCheckbox(spec, backstage.shared.providers)),
      colorinput: make$5((spec, backstage) => renderColorInput(spec, backstage.shared, backstage.colorinput)),
      colorpicker: make$5(renderColorPicker),
      dropzone: make$5((spec, backstage) => renderDropZone(spec, backstage.shared.providers)),
      grid: make$5((spec, backstage) => renderGrid(spec, backstage.shared)),
      selectbox: make$5((spec, backstage) => renderSelectBox(spec, backstage.shared.providers)),
      sizeinput: make$5((spec, backstage) => renderSizeInput(spec, backstage.shared.providers)),
      urlinput: make$5((spec, backstage) => renderUrlInput(spec, backstage.shared, backstage.urlinput)),
      customeditor: make$5(renderCustomEditor),
      htmlpanel: make$5(renderHtmlPanel),
      imagetools: make$5((spec, backstage) => renderImageTools(spec, backstage.shared.providers)),
      table: make$5((spec, backstage) => renderTable(spec, backstage.shared.providers)),
    }
    const noFormParts = {
      field(_name, spec) {
        return spec
      },
    }
    const interpretInForm = function (parts, spec, oldBackstage) {
      var newBackstage = deepMerge(oldBackstage, {
        shared: {
          interpreter(childSpec) {
            return interpretParts(parts, childSpec, newBackstage)
          },
        },
      })
      return interpretParts(parts, spec, newBackstage)
    }
    var interpretParts = function (parts, spec, backstage) {
      return readOptFrom$1(factories, spec.type).fold(() => {
        console.error(`Unknown factory type "${spec.type}", defaulting to container: `, spec)
        return spec
      }, (factory) => factory(parts, spec, backstage))
    }
    const interpretWithoutForm = function (spec, backstage) {
      const parts = noFormParts
      return interpretParts(parts, spec, backstage)
    }

    const colorPicker = function (editor) {
      return function (callback, value) {
        const dialog = ColorSwatch.colorPickerDialog(editor)
        dialog(callback, value)
      }
    }
    const hasCustomColors$1 = function (editor) {
      return function () {
        return Settings.hasCustomColors(editor)
      }
    }
    const getColors$1 = function (editor) {
      return function () {
        return Settings.getColors(editor)
      }
    }
    const ColorInputBackstage = function (editor) {
      return {
        colorPicker: colorPicker(editor),
        hasCustomColors: hasCustomColors$1(editor),
        getColors: getColors$1(editor),
      }
    }

    const defaultStyleFormats = [
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
            icon: 'strike-through',
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
            icon: 'align-left',
            format: 'alignleft',
          },
          {
            title: 'Center',
            icon: 'align-center',
            format: 'aligncenter',
          },
          {
            title: 'Right',
            icon: 'align-right',
            format: 'alignright',
          },
          {
            title: 'Justify',
            icon: 'align-justify',
            format: 'alignjustify',
          },
        ],
      },
    ]
    const isNestedFormat = function (format) {
      return has(format, 'items')
    }
    const isBlockFormat = function (format) {
      return has(format, 'block')
    }
    const isInlineFormat = function (format) {
      return has(format, 'inline')
    }
    const isSelectorFormat = function (format) {
      return has(format, 'selector')
    }
    var mapFormats = function (userFormats) {
      return foldl(userFormats, (acc, fmt) => {
        if (isNestedFormat(fmt)) {
          const result = mapFormats(fmt.items)
          return {
            customFormats: acc.customFormats.concat(result.customFormats),
            formats: acc.formats.concat([{
              title: fmt.title,
              items: result.formats,
            }]),
          }
        } if (isInlineFormat(fmt) || isBlockFormat(fmt) || isSelectorFormat(fmt)) {
          const formatName = `custom-${fmt.title.toLowerCase()}`
          return {
            customFormats: acc.customFormats.concat([{
              name: formatName,
              format: fmt,
            }]),
            formats: acc.formats.concat([{
              title: fmt.title,
              format: formatName,
              icon: fmt.icon,
            }]),
          }
        }
        return __assign({}, acc, { formats: acc.formats.concat(fmt) })
      }, {
        customFormats: [],
        formats: [],
      })
    }
    const registerCustomFormats = function (editor, userFormats) {
      const result = mapFormats(userFormats)
      const registerFormats = function (customFormats) {
        each(customFormats, (fmt) => {
          if (!editor.formatter.has(fmt.name)) {
            editor.formatter.register(fmt.name, fmt.format)
          }
        })
      }
      if (editor.formatter) {
        registerFormats(result.customFormats)
      } else {
        editor.on('init', () => {
          registerFormats(result.customFormats)
        })
      }
      return result.formats
    }
    const getStyleFormats = function (editor) {
      return getUserStyleFormats(editor).map((userFormats) => {
        const registeredUserFormats = registerCustomFormats(editor, userFormats)
        return isMergeStyleFormats(editor) ? defaultStyleFormats.concat(registeredUserFormats) : registeredUserFormats
      }).getOr(defaultStyleFormats)
    }

    const processBasic = function (item, isSelectedFor, getPreviewFor) {
      const formatterSpec = {
        type: 'formatter',
        isSelected: isSelectedFor(item.format),
        getStylePreview: getPreviewFor(item.format),
      }
      return deepMerge(item, formatterSpec)
    }
    const register$3 = function (editor, formats, isSelectedFor, getPreviewFor) {
      const enrichSupported = function (item) {
        return processBasic(item, isSelectedFor, getPreviewFor)
      }
      const enrichMenu = function (item) {
        const submenuSpec = {
          type: 'submenu',
          isSelected: constant(false),
          getStylePreview() {
            return Option.none()
          },
        }
        return deepMerge(item, submenuSpec)
      }
      const enrichCustom = function (item) {
        const formatName = generate$1(item.title)
        const customSpec = {
          type: 'formatter',
          format: formatName,
          isSelected: isSelectedFor(formatName),
          getStylePreview: getPreviewFor(formatName),
        }
        const newItem = deepMerge(item, customSpec)
        editor.formatter.register(formatName, newItem)
        return newItem
      }
      var doEnrich = function (items) {
        return map(items, (item) => {
          const keys$$1 = keys(item)
          if (hasKey$1(item, 'items')) {
            const newItems_1 = doEnrich(item.items)
            return deepMerge(enrichMenu(item), {
              getStyleItems() {
                return newItems_1
              },
            })
          } if (hasKey$1(item, 'format')) {
            return enrichSupported(item)
          } if (keys$$1.length === 1 && contains(keys$$1, 'title')) {
            return deepMerge(item, { type: 'separator' })
          }
          return enrichCustom(item)
        })
      }
      return doEnrich(formats)
    }

    const init$7 = function (editor) {
      const isSelectedFor = function (format) {
        return function () {
          return editor.formatter.match(format)
        }
      }
      const getPreviewFor = function (format) {
        return function () {
          const fmt = editor.formatter.get(format)
          return fmt !== undefined ? Option.some({
            tag: fmt.length > 0 ? fmt[0].inline || fmt[0].block || 'div' : 'div',
            styleAttr: editor.formatter.getCssText(format),
          }) : Option.none()
        }
      }
      var flatten$$1 = function (fmt) {
        const subs = fmt.items
        return subs !== undefined && subs.length > 0 ? bind(subs, flatten$$1) : [fmt.format]
      }
      const settingsFormats = Cell([])
      const settingsFlattenedFormats = Cell([])
      const eventsFormats = Cell([])
      const eventsFlattenedFormats = Cell([])
      const replaceSettings = Cell(false)
      editor.on('init', () => {
        const formats = getStyleFormats(editor)
        const enriched = register$3(editor, formats, isSelectedFor, getPreviewFor)
        settingsFormats.set(enriched)
        settingsFlattenedFormats.set(bind(enriched, flatten$$1))
      })
      editor.on('addStyleModifications', (e) => {
        const modifications = register$3(editor, e.items, isSelectedFor, getPreviewFor)
        eventsFormats.set(modifications)
        replaceSettings.set(e.replace)
        eventsFlattenedFormats.set(bind(modifications, flatten$$1))
      })
      const getData = function () {
        const fromSettings = replaceSettings.get() ? [] : settingsFormats.get()
        const fromEvents = eventsFormats.get()
        return fromSettings.concat(fromEvents)
      }
      const getFlattenedKeys = function () {
        const fromSettings = replaceSettings.get() ? [] : settingsFlattenedFormats.get()
        const fromEvents = eventsFlattenedFormats.get()
        return fromSettings.concat(fromEvents)
      }
      return {
        getData,
        getFlattenedKeys,
      }
    }

    const trim$1 = global$a.trim
    const hasContentEditableState = function (value) {
      return function (node) {
        if (node && node.nodeType === 1) {
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
    const isContentEditableTrue = hasContentEditableState('true')
    const isContentEditableFalse = hasContentEditableState('false')
    const create$8 = function (type, title, url, level, attach) {
      return {
        type,
        title,
        url,
        level,
        attach,
      }
    }
    const isChildOfContentEditableTrue = function (node) {
      while (node = node.parentNode) {
        const value = node.contentEditable
        if (value && value !== 'inherit') {
          return isContentEditableTrue(node)
        }
      }
      return false
    }
    const select = function (selector, root) {
      return map(descendants$1(Element$$1.fromDom(root), selector), (element) => element.dom())
    }
    const getElementText = function (elm) {
      return elm.innerText || elm.textContent
    }
    const getOrGenerateId = function (elm) {
      return elm.id ? elm.id : generate$1('h')
    }
    const isAnchor = function (elm) {
      return elm && elm.nodeName === 'A' && (elm.id || elm.name) !== undefined
    }
    const isValidAnchor = function (elm) {
      return isAnchor(elm) && isEditable(elm)
    }
    const isHeader = function (elm) {
      return elm && /^(H[1-6])$/.test(elm.nodeName)
    }
    var isEditable = function (elm) {
      return isChildOfContentEditableTrue(elm) && !isContentEditableFalse(elm)
    }
    const isValidHeader = function (elm) {
      return isHeader(elm) && isEditable(elm)
    }
    const getLevel = function (elm) {
      return isHeader(elm) ? parseInt(elm.nodeName.substr(1), 10) : 0
    }
    const headerTarget = function (elm) {
      const headerId = getOrGenerateId(elm)
      const attach = function () {
        elm.id = headerId
      }
      return create$8('header', getElementText(elm), `#${headerId}`, getLevel(elm), attach)
    }
    const anchorTarget = function (elm) {
      const anchorId = elm.id || elm.name
      const anchorText = getElementText(elm)
      return create$8('anchor', anchorText || `#${anchorId}`, `#${anchorId}`, 0, noop)
    }
    const getHeaderTargets = function (elms) {
      return map(filter(elms, isValidHeader), headerTarget)
    }
    const getAnchorTargets = function (elms) {
      return map(filter(elms, isValidAnchor), anchorTarget)
    }
    const getTargetElements = function (elm) {
      const elms = select('h1,h2,h3,h4,h5,h6,a:not([href])', elm)
      return elms
    }
    const hasTitle = function (target) {
      return trim$1(target.title).length > 0
    }
    const find$6 = function (elm) {
      const elms = getTargetElements(elm)
      return filter(getHeaderTargets(elms).concat(getAnchorTargets(elms)), hasTitle)
    }
    const LinkTargets = { find: find$6 }

    const STORAGE_KEY = 'tinymce-url-history'
    const HISTORY_LENGTH = 5
    const isHttpUrl = function (url) {
      return isString(url) && /^https?/.test(url)
    }
    const isArrayOfUrl = function (a) {
      return isArray(a) && a.length <= HISTORY_LENGTH && forall(a, isHttpUrl)
    }
    const isRecordOfUrlArray = function (r) {
      return isObject(r) && find$1(r, (value) => !isArrayOfUrl(value)).isNone()
    }
    const getAllHistory = function () {
      const unparsedHistory = localStorage.getItem(STORAGE_KEY)
      if (unparsedHistory === null) {
        return {}
      }
      let history$$1
      try {
        history$$1 = JSON.parse(unparsedHistory)
      } catch (e) {
        if (e instanceof SyntaxError) {
          console.log(`Local storage ${STORAGE_KEY} was not valid JSON`, e)
          return {}
        }
        throw e
      }
      if (!isRecordOfUrlArray(history$$1)) {
        console.log(`Local storage ${STORAGE_KEY} was not valid format`, history$$1)
        return {}
      }
      return history$$1
    }
    const setAllHistory = function (history$$1) {
      if (!isRecordOfUrlArray(history$$1)) {
        throw new Error(`Bad format for history:\n${JSON.stringify(history$$1)}`)
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history$$1))
    }
    const getHistory = function (fileType) {
      const history$$1 = getAllHistory()
      return Object.prototype.hasOwnProperty.call(history$$1, fileType) ? history$$1[fileType] : []
    }
    const addToHistory = function (url, fileType) {
      if (!isHttpUrl(url)) {
        return
      }
      const history$$1 = getAllHistory()
      const items = Object.prototype.hasOwnProperty.call(history$$1, fileType) ? history$$1[fileType] : []
      const itemsWithoutUrl = filter(items, (item) => item !== url)
      history$$1[fileType] = [url].concat(itemsWithoutUrl).slice(0, HISTORY_LENGTH)
      setAllHistory(history$$1)
    }

    const hasOwnProperty$2 = Object.prototype.hasOwnProperty
    const isTruthy = function (value) {
      return !!value
    }
    const makeMap = function (value) {
      return map$1(global$a.makeMap(value, /[, ]/), isTruthy)
    }
    const getOpt$1 = function (obj, key) {
      return hasOwnProperty$2.call(obj, key) ? Option.some(obj[key]) : Option.none()
    }
    const getTextSetting = function (settings, name, defaultValue) {
      const value = getOpt$1(settings, name).getOr(defaultValue)
      return isString(value) ? Option.some(value) : Option.none()
    }
    const getPickerSetting = function (settings, filetype) {
      const optFileTypes = Option.some(settings.file_picker_types).filter(isTruthy)
      const optLegacyTypes = Option.some(settings.file_browser_callback_types).filter(isTruthy)
      const optTypes = optFileTypes.or(optLegacyTypes).map(makeMap)
      const on = optTypes.fold(() => true, (types) => getOpt$1(types, filetype).getOr(false))
      const optPicker = Option.some(settings.file_picker_callback).filter(isFunction)
      return !on ? Option.none() : optPicker
    }
    const getLinkInformation = function (editor) {
      return function () {
        if (editor.settings.typeahead_urls === false) {
          return Option.none()
        }
        return Option.some({
          targets: LinkTargets.find(editor.getBody()),
          anchorTop: getTextSetting(editor.settings, 'anchor_top', '#top'),
          anchorBottom: getTextSetting(editor.settings, 'anchor_bottom', '#bottom'),
        })
      }
    }
    const getValidationHandler = function (editor) {
      return function () {
        const validatorHandler = editor.settings.filepicker_validator_handler
        return isFunction(validatorHandler) ? Option.some(validatorHandler) : Option.none()
      }
    }
    const getUrlPicker = function (editor) {
      return function (filetype) {
        return getPickerSetting(editor.settings, filetype).map((picker) => function (entry) {
          return Future.nu((completer) => {
            const handler = function (value, meta) {
              if (!isString(value)) {
                throw new Error('Expected value to be string')
              }
              if (meta !== undefined && !isObject(meta)) {
                throw new Error('Expected meta to be a object')
              }
              const r = {
                value,
                meta,
              }
              completer(r)
            }
            const meta = global$a.extend({ filetype }, Option.from(entry.meta).getOr({}))
            picker.call(editor, handler, entry.value, meta)
          })
        })
      }
    }
    const UrlInputBackstage = function (editor) {
      return {
        getHistory,
        addToHistory,
        getLinkInformation: getLinkInformation(editor),
        getValidationHandler: getValidationHandler(editor),
        getUrlPicker: getUrlPicker(editor),
      }
    }

    const bubbleAlignments = {
      valignCentre: [],
      alignCentre: [],
      alignLeft: [],
      alignRight: [],
      right: [],
      left: [],
      bottom: [],
      top: [],
    }
    const init$8 = function (sink, editor, lazyAnchorbar) {
      var backstage = {
        shared: {
          providers: {
            icons() {
              return editor.ui.registry.getAll().icons
            },
            menuItems() {
              return editor.ui.registry.getAll().menuItems
            },
            translate: global$2.translate,
          },
          interpreter(s) {
            return interpretWithoutForm(s, backstage)
          },
          anchors: {
            toolbar() {
              return {
                anchor: 'hotspot',
                hotspot: lazyAnchorbar(),
                bubble: nu$7(-12, 12, bubbleAlignments),
                layouts: {
                  onRtl() {
                    return [southeast$1]
                  },
                  onLtr() {
                    return [southwest$1]
                  },
                },
              }
            },
            banner() {
              return {
                anchor: 'hotspot',
                hotspot: lazyAnchorbar(),
                layouts: {
                  onRtl() {
                    return [south$1]
                  },
                  onLtr() {
                    return [south$1]
                  },
                },
              }
            },
            cursor() {
              return {
                anchor: 'selection',
                root: Element$$1.fromDom(editor.getBody()),
                getSelection() {
                  const rng = editor.selection.getRng()
                  return Option.some(range$1(Element$$1.fromDom(rng.startContainer), rng.startOffset, Element$$1.fromDom(rng.endContainer), rng.endOffset))
                },
              }
            },
            node(element) {
              return {
                anchor: 'node',
                root: Element$$1.fromDom(editor.getBody()),
                node: element,
              }
            },
          },
          getSink() {
            return Result.value(sink)
          },
        },
        urlinput: UrlInputBackstage(editor),
        styleselect: init$7(editor),
        colorinput: ColorInputBackstage(editor),
      }
      return backstage
    }

    const global$c = tinymce.util.Tools.resolve('tinymce.util.Delay')

    const showContextToolbarEvent = 'contexttoolbar-show'

    const schema$j = constant([
      defaulted$1('shell', true),
      field$1('toolbarBehaviours', [Replacing]),
    ])
    const enhanceGroups = function (detail) {
      return { behaviours: derive$1([Replacing.config({})]) }
    }
    const parts$7 = constant([optional({
      name: 'groups',
      overrides: enhanceGroups,
    })])

    const factory$9 = function (detail, components$$1, spec, _externals) {
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
      configFields: schema$j(),
      partFields: parts$7(),
      factory: factory$9,
      apis: {
        setGroups(apis, toolbar$$1, groups) {
          apis.setGroups(toolbar$$1, groups)
        },
      },
    })

    const schema$k = constant([
      strict$1('items'),
      markers(['itemSelector']),
      field$1('tgroupBehaviours', [Keying]),
    ])
    const parts$8 = constant([group({
      name: 'items',
      unit: 'item',
    })])

    const factory$a = function (detail, components, spec, _externals) {
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
      configFields: schema$k(),
      partFields: parts$8(),
      factory: factory$a,
    })

    const renderToolbarGroup = function (foo) {
      const attributes = foo.title.fold(() => ({}), (title) => ({ attributes: { title } }))
      return ToolbarGroup.sketch({
        dom: __assign({
          tag: 'div',
          classes: ['tox-toolbar__group'],
        }, attributes),
        components: [ToolbarGroup.parts().items({})],
        items: foo.items,
        markers: { itemSelector: '*:not(.tox-split-button) > .tox-tbtn:not([disabled]), .tox-split-button:not([disabled]), .tox-toolbar-nav-js:not([disabled])' },
        tgroupBehaviours: derive$1([
          Tabstopping.config({}),
          Focusing.config({}),
        ]),
      })
    }
    const renderToolbar = function (foo) {
      const modeName = foo.cyclicKeying ? 'cyclic' : 'acyclic'
      return Toolbar.sketch({
        uid: foo.uid,
        dom: {
          tag: 'div',
          classes: ['tox-toolbar'],
        },
        components: [Toolbar.parts().groups({})],
        toolbarBehaviours: derive$1([
          Keying.config({
            mode: modeName,
            onEscape: foo.onEscape,
            selector: '.tox-toolbar__group',
          }),
          config('toolbar-events', [runOnAttached((component) => {
            const groups = map(foo.initGroups, renderToolbarGroup)
            Toolbar.setGroups(component, groups)
          })]),
        ]),
      })
    }

    const baseToolbarButtonFields = [
      defaultedBoolean('disabled', false),
      optionString('tooltip'),
      optionString('icon'),
      optionString('text'),
      defaultedFunction('onSetup', () => noop),
    ]
    const toolbarButtonSchema = objOf([
      strictString('type'),
      strictFunction('onAction'),
    ].concat(baseToolbarButtonFields))
    const createToolbarButton = function (spec) {
      return asRaw('toolbarbutton', toolbarButtonSchema, spec)
    }

    const MenuButtonSchema = objOf([
      strictString('type'),
      optionString('tooltip'),
      optionString('icon'),
      optionString('text'),
      strictFunction('fetch'),
      defaultedFunction('onSetup', () => noop),
    ])
    const createMenuButton = function (spec) {
      return asRaw('menubutton', MenuButtonSchema, spec)
    }

    const splitButtonSchema = objOf([
      strictString('type'),
      optionString('tooltip'),
      optionString('icon'),
      optionString('text'),
      optionFunction('select'),
      strictFunction('fetch'),
      defaultedFunction('onSetup', () => noop),
      defaultedStringEnum('presets', 'normal', [
        'normal',
        'color',
        'toolbar',
      ]),
      defaulted$1('columns', 1),
      strictFunction('onAction'),
      strictFunction('onItemAction'),
    ])
    const createSplitButton = function (spec) {
      return asRaw('SplitButton', splitButtonSchema, spec)
    }

    const baseToolbarToggleButtonFields = [defaultedBoolean('active', false)].concat(baseToolbarButtonFields)
    const toggleButtonSchema = objOf(baseToolbarToggleButtonFields.concat([
      strictString('type'),
      strictFunction('onAction'),
    ]))
    const createToggleButton = function (spec) {
      return asRaw('ToggleButton', toggleButtonSchema, spec)
    }

    const contextBarFields = [
      defaultedFunction('predicate', () => false),
      defaultedStringEnum('scope', 'node', [
        'node',
        'editor',
      ]),
      defaultedStringEnum('position', 'selection', [
        'node',
        'selection',
        'line',
      ]),
    ]
    const contextButtonFields = baseToolbarButtonFields.concat([
      defaulted$1('type', 'contextformbutton'),
      defaulted$1('primary', false),
      strictFunction('onAction'),
      state$1('original', identity),
    ])
    const contextToggleButtonFields = baseToolbarToggleButtonFields.concat([
      defaulted$1('type', 'contextformbutton'),
      defaulted$1('primary', false),
      strictFunction('onAction'),
      state$1('original', identity),
    ])
    const launchButtonFields = baseToolbarButtonFields.concat([defaulted$1('type', 'contextformbutton')])
    const launchToggleButtonFields = baseToolbarToggleButtonFields.concat([defaulted$1('type', 'contextformtogglebutton')])
    const toggleOrNormal = choose$1('type', {
      contextformbutton: contextButtonFields,
      contextformtogglebutton: contextToggleButtonFields,
    })
    const contextFormSchema = objOf([
      defaulted$1('type', 'contextform'),
      defaultedFunction('initValue', () => ''),
      optionString('label'),
      strictArrayOf('commands', toggleOrNormal),
      optionOf('launch', choose$1('type', {
        contextformbutton: launchButtonFields,
        contextformtogglebutton: launchToggleButtonFields,
      })),
    ].concat(contextBarFields))
    const contextToolbarSchema = objOf([
      defaulted$1('type', 'contexttoolbar'),
      strictString('items'),
    ].concat(contextBarFields))
    const createContextToolbar = function (spec) {
      return asRaw('ContextToolbar', contextToolbarSchema, spec)
    }
    const createContextForm = function (spec) {
      return asRaw('ContextForm', contextFormSchema, spec)
    }

    const internalToolbarButtonExecute = generate$1('toolbar.button.execute')
    const onToolbarButtonExecute = function (info) {
      return runOnExecute((comp, simulatedEvent) => {
        runWithApi(info, comp)((itemApi) => {
          emitWith(comp, internalToolbarButtonExecute, { buttonApi: itemApi })
          info.onAction(itemApi)
        })
      })
    }
    const toolbarButtonEventOrder = {
      'alloy.execute': [
        'disabling',
        'alloy.base.behaviour',
        'toggling',
        'toolbar-button-events',
      ],
    }

    const getState$2 = function (component, replaceConfig, reflectState) {
      return reflectState
    }

    const ReflectingApis = /* #__PURE__ */Object.freeze({
      getState: getState$2,
    })

    const events$c = function (reflectingConfig, reflectingState) {
      const update = function (component, data) {
        reflectingConfig.updateState.each((updateState) => {
          const newState = updateState(component, data)
          reflectingState.set(newState)
        })
        reflectingConfig.renderComponents.each((renderComponents) => {
          const newComponents = renderComponents(data, reflectingState.get())
          detachChildren(component)
          each(newComponents, (c) => {
            attach(component, component.getSystem().build(c))
          })
        })
      }
      return derive([
        run(receive(), (component, message) => {
          const { channel } = reflectingConfig
          if (contains(message.channels(), channel)) {
            update(component, message.data())
          }
        }),
        runOnAttached((comp, se) => {
          reflectingConfig.initialData.each((rawData) => {
            update(comp, rawData)
          })
        }),
      ])
    }

    const ActiveReflecting = /* #__PURE__ */Object.freeze({
      events: events$c,
    })

    const init$9 = function (spec) {
      const cell = Cell(Option.none())
      const set = function (optS) {
        return cell.set(optS)
      }
      const clear = function () {
        return cell.set(Option.none())
      }
      const get = function () {
        return cell.get()
      }
      const readState = function () {
        return cell.get().getOr('none')
      }
      return {
        readState,
        get,
        set,
        clear,
      }
    }

    const ReflectingState = /* #__PURE__ */Object.freeze({
      init: init$9,
    })

    const ReflectingSchema = [
      strict$1('channel'),
      option('renderComponents'),
      option('updateState'),
      option('initialData'),
    ]

    const Reflecting = create$1({
      fields: ReflectingSchema,
      name: 'reflecting',
      active: ActiveReflecting,
      apis: ReflectingApis,
      state: ReflectingState,
    })

    const schema$l = constant([
      strict$1('toggleClass'),
      strict$1('fetch'),
      onStrictHandler('onExecute'),
      defaulted$1('getHotspot', Option.some),
      defaulted$1('layouts', Option.none()),
      onStrictHandler('onItemExecute'),
      option('lazySink'),
      strict$1('dom'),
      onHandler('onOpen'),
      field$1('splitDropdownBehaviours', [
        Coupling,
        Keying,
        Focusing,
      ]),
      defaulted$1('matchWidth', false),
      defaulted$1('useMinWidth', false),
      defaulted$1('eventOrder', {}),
      option('role'),
    ].concat(sandboxFields()))
    const arrowPart = required({
      factory: Button,
      schema: [strict$1('dom')],
      name: 'arrow',
      defaults(detail) {
        return { buttonBehaviours: derive$1([Focusing.revoke()]) }
      },
      overrides(detail) {
        return {
          dom: {
            tag: 'span',
            attributes: { role: 'presentation' },
          },
          action(arrow) {
            arrow.getSystem().getByUid(detail.uid).each(emitExecute)
          },
          buttonBehaviours: derive$1([Toggling.config({
            toggleOnExecute: false,
            toggleClass: detail.toggleClass,
          })]),
        }
      },
    })
    const buttonPart = required({
      factory: Button,
      schema: [strict$1('dom')],
      name: 'button',
      defaults(detail) {
        return { buttonBehaviours: derive$1([Focusing.revoke()]) }
      },
      overrides(detail) {
        return {
          dom: {
            tag: 'span',
            attributes: { role: 'presentation' },
          },
          action(btn) {
            btn.getSystem().getByUid(detail.uid).each((splitDropdown) => {
              detail.onExecute(splitDropdown, btn)
            })
          },
        }
      },
    })
    const parts$9 = constant([
      arrowPart,
      buttonPart,
      optional({
        factory: {
          sketch(spec) {
            return {
              uid: spec.uid,
              dom: {
                tag: 'span',
                styles: { display: 'none' },
                attributes: { 'aria-hidden': 'true' },
                innerHtml: spec.text,
              },
            }
          },
        },
        schema: [strict$1('text')],
        name: 'aria-descriptor',
      }),
      external$1({
        schema: [tieredMenuMarkers()],
        name: 'menu',
        defaults(detail) {
          return {
            onExecute(tmenu, item) {
              tmenu.getSystem().getByUid(detail.uid).each((splitDropdown) => {
                detail.onItemExecute(splitDropdown, tmenu, item)
              })
            },
          }
        },
      }),
      partType(),
    ])

    const factory$b = function (detail, components$$1, spec, externals) {
      const switchToMenu = function (sandbox) {
        Composing.getCurrent(sandbox).each((current) => {
          Highlighting.highlightFirst(current)
          Keying.focusIn(current)
        })
      }
      const action = function (component) {
        const onOpenSync = switchToMenu
        togglePopup(detail, (x) => x, component, externals, onOpenSync, HighlightOnOpen.HighlightFirst).get(noop)
      }
      const openMenu = function (comp) {
        action(comp)
        return Option.some(true)
      }
      const executeOnButton = function (comp) {
        const button = getPartOrDie(comp, detail, 'button')
        emitExecute(button)
        return Option.some(true)
      }
      const buttonEvents = merge(derive([runOnAttached((component, simulatedEvent) => {
        const ariaDescriptor = getPart(component, detail, 'aria-descriptor')
        ariaDescriptor.each((descriptor) => {
          const descriptorId = generate$1('aria')
          set$1(descriptor.element(), 'id', descriptorId)
          set$1(component.element(), 'aria-describedby', descriptorId)
        })
      })]), events$7(Option.some(action)))
      return {
        uid: detail.uid,
        dom: detail.dom,
        components: components$$1,
        eventOrder: __assign({}, detail.eventOrder, {
          'alloy.execute': [
            'disabling',
            'toggling',
            'alloy.base.behaviour',
          ],
        }),
        events: buttonEvents,
        behaviours: augment(detail.splitDropdownBehaviours, [
          Coupling.config({
            others: {
              sandbox(hotspot) {
                const arrow = getPartOrDie(hotspot, detail, 'arrow')
                const extras = {
                  onOpen() {
                    Toggling.on(arrow)
                    Toggling.on(hotspot)
                  },
                  onClose() {
                    Toggling.off(arrow)
                    Toggling.off(hotspot)
                  },
                }
                return makeSandbox(detail, hotspot, extras)
              },
            },
          }),
          Keying.config({
            mode: 'special',
            onSpace: executeOnButton,
            onEnter: executeOnButton,
            onDown: openMenu,
          }),
          Focusing.config({}),
          Toggling.config({
            toggleOnExecute: false,
            aria: { mode: 'expanded' },
          }),
        ]),
        domModification: {
          attributes: {
            role: detail.role.getOr('button'),
            'aria-haspopup': true,
          },
        },
      }
    }
    const SplitDropdown = composite$1({
      name: 'SplitDropdown',
      configFields: schema$l(),
      partFields: parts$9(),
      factory: factory$b,
    })

    const getButtonApi = function (component) {
      return {
        isDisabled() {
          return Disabling.isDisabled(component)
        },
        setDisabled(state) {
          return state ? Disabling.disable(component) : Disabling.enable(component)
        },
      }
    }
    const getToggleApi = function (component) {
      return {
        setActive(state) {
          Toggling.set(component, state)
        },
        isActive() {
          return Toggling.isOn(component)
        },
        isDisabled() {
          return Disabling.isDisabled(component)
        },
        setDisabled(state) {
          return state ? Disabling.disable(component) : Disabling.enable(component)
        },
      }
    }
    const getTooltipAttributes = function (tooltip, providersBackstage) {
      return tooltip.map((tooltip) => ({
        'aria-label': providersBackstage.translate(tooltip),
        title: providersBackstage.translate(tooltip),
      })).getOr({})
    }
    const focusButtonEvent = generate$1('focus-button')
    const renderCommonStructure = function (icon, text, tooltip, receiver, behaviours, providersBackstage) {
      let _a
      return {
        dom: {
          tag: 'button',
          classes: ['tox-tbtn'].concat(text.isSome() ? ['tox-tbtn--select'] : []),
          attributes: getTooltipAttributes(tooltip, providersBackstage),
        },
        components: componentRenderPipeline([
          icon.map((iconName) => renderIconFromPack(iconName, providersBackstage.icons)),
          text.map((text) => renderLabel$1(text, 'tox-tbtn', providersBackstage)),
        ]),
        eventOrder: (_a = {}, _a[mousedown()] = [
          'focusing',
          'alloy.base.behaviour',
          'common-button-display-events',
        ], _a),
        buttonBehaviours: derive$1([config('common-button-display-events', [run(mousedown(), (button, se) => {
          se.event().prevent()
          emit(button, focusButtonEvent)
        })])].concat(receiver.map((r) => Reflecting.config({
          channel: r,
          initialData: {
            icon,
            text,
          },
          renderComponents(data, _state) {
            return componentRenderPipeline([
              data.icon.map((iconName) => renderIconFromPack(iconName, providersBackstage.icons)),
              data.text.map((text) => renderLabel$1(text, 'tox-tbtn', providersBackstage)),
            ])
          },
        })).toArray()).concat(behaviours.getOr([]))),
      }
    }
    const renderCommonToolbarButton = function (spec, specialisation, providersBackstage) {
      const editorOffCell = Cell(noop)
      const structure = renderCommonStructure(spec.icon, spec.text, spec.tooltip, Option.none(), Option.none(), providersBackstage)
      return Button.sketch({
        dom: structure.dom,
        components: structure.components,
        eventOrder: toolbarButtonEventOrder,
        buttonBehaviours: derive$1([
          config('toolbar-button-events', [
            onToolbarButtonExecute({
              onAction: spec.onAction,
              getApi: specialisation.getApi,
            }),
            onControlAttached(specialisation, editorOffCell),
            onControlDetached(specialisation, editorOffCell),
          ]),
          DisablingConfigs.button(spec.disabled),
        ].concat(specialisation.toolbarButtonBehaviours)),
      })
    }
    const renderToolbarButton = function (spec, providersBackstage) {
      return renderToolbarButtonWith(spec, providersBackstage, [])
    }
    var renderToolbarButtonWith = function (spec, providersBackstage, bonusEvents) {
      return renderCommonToolbarButton(spec, {
        toolbarButtonBehaviours: [].concat(bonusEvents.length > 0 ? [config('toolbarButtonWith', bonusEvents)] : []),
        getApi: getButtonApi,
        onSetup: spec.onSetup,
      }, providersBackstage)
    }
    const renderToolbarToggleButton = function (spec, providersBackstage) {
      return renderToolbarToggleButtonWith(spec, providersBackstage, [])
    }
    var renderToolbarToggleButtonWith = function (spec, providersBackstage, bonusEvents) {
      return deepMerge(renderCommonToolbarButton(spec, {
        toolbarButtonBehaviours: [
          Replacing.config({}),
          Toggling.config({
            toggleClass: 'tox-tbtn--enabled',
            aria: { mode: 'pressed' },
            toggleOnExecute: false,
          }),
        ].concat(bonusEvents.length > 0 ? [config('toolbarToggleButtonWith', bonusEvents)] : []),
        getApi: getToggleApi,
        onSetup: spec.onSetup,
      }, providersBackstage))
    }
    const fetchChoices = function (getApi, spec, providersBackstage) {
      return function (comp) {
        return Future.nu((callback) => spec.fetch(callback)).map((items) => createTieredDataFrom(deepMerge(createPartialChoiceMenu(generate$1('menu-value'), items, (value) => {
          spec.onItemAction(getApi(comp), value)
        }, spec.columns, spec.presets, ItemResponse$1.CLOSE_ON_EXECUTE, spec.select.getOr(() => false), providersBackstage), {
          movement: deriveMenuMovement(spec.columns, spec.presets),
          menuBehaviours: SimpleBehaviours.unnamedEvents(spec.columns !== 'auto' ? [] : [runOnAttached((comp, se) => {
            detectSize(comp, 4, classForPreset(spec.presets)).each((_a) => {
              const { numRows } = _a; const { numColumns } = _a
              Keying.setGridSize(comp, numRows, numColumns)
            })
          })]),
        })))
      }
    }
    const renderSplitButton = function (spec, sharedBackstage) {
      let _a
      const displayChannel = generate$1('channel-update-split-dropdown-display')
      const getApi = function (comp) {
        return {
          isDisabled() {
            return true
          },
          setDisabled() {
          },
          setIconFill(id, value) {
            descendant$2(comp.element(), `svg path[id="${id}"], rect[id="${id}"]`).each((underlinePath) => {
              set$1(underlinePath, 'fill', value)
            })
          },
          setIconStroke(id, value) {
            descendant$2(comp.element(), `svg path[id="${id}"], rect[id="${id}"]`).each((underlinePath) => {
              set$1(underlinePath, 'stroke', value)
            })
          },
          setActive(state) {
            set$1(comp.element(), 'aria-pressed', state)
            descendant$2(comp.element(), 'span').each((button) => {
              comp.getSystem().getByDom(button).each((buttonComp) => Toggling.set(buttonComp, state))
            })
          },
          isActive() {
            return descendant$2(comp.element(), 'span').exists((button) => comp.getSystem().getByDom(button).exists(Toggling.isOn))
          },
        }
      }
      const editorOffCell = Cell(noop)
      const specialisation = {
        getApi,
        onSetup: spec.onSetup,
      }
      return SplitDropdown.sketch({
        dom: {
          tag: 'div',
          classes: ['tox-split-button'],
          attributes: merge({ 'aria-pressed': false }, getTooltipAttributes(spec.tooltip, sharedBackstage.providers)),
        },
        onExecute(button) {
          spec.onAction(getApi(button))
        },
        onItemExecute(a, b, c) {
        },
        splitDropdownBehaviours: derive$1([
          DisablingConfigs.splitButton(false),
          config('split-dropdown-events', [
            run(focusButtonEvent, Focusing.focus),
            onControlAttached(specialisation, editorOffCell),
            onControlDetached(specialisation, editorOffCell),
          ]),
        ]),
        eventOrder: (_a = {}, _a[attachedToDom()] = [
          'alloy.base.behaviour',
          'split-dropdown-events',
        ], _a),
        toggleClass: 'tox-tbtn--enabled',
        lazySink: sharedBackstage.getSink,
        fetch: fetchChoices(getApi, spec, sharedBackstage.providers),
        parts: { menu: part(false, spec.columns, spec.presets) },
        components: [
          SplitDropdown.parts().button(renderCommonStructure(spec.icon, spec.text, Option.none(), Option.some(displayChannel), Option.some([Toggling.config({
            toggleClass: 'tox-tbtn--enabled',
            toggleOnExecute: false,
          })]), sharedBackstage.providers)),
          SplitDropdown.parts().arrow({
            dom: {
              tag: 'button',
              classes: [
                'tox-tbtn',
                'tox-split-button__chevron',
              ],
              innerHtml: get$e('chevron-down', sharedBackstage.providers.icons),
            },
          }),
          SplitDropdown.parts()['aria-descriptor']({ text: sharedBackstage.providers.translate('To open the popup, press Shift+Enter') }),
        ],
      })
    }

    const getFormApi = function (input) {
      return {
        hide() {
          return emit(input, sandboxClose())
        },
        getValue() {
          return Representing.getValue(input)
        },
      }
    }
    const runOnExecute$1 = function (memInput, original) {
      return run(internalToolbarButtonExecute, (comp, se) => {
        const input = memInput.get(comp)
        const formApi = getFormApi(input)
        original.onAction(formApi, se.event().buttonApi())
      })
    }
    const renderContextButton = function (memInput, button, extras) {
      const _a = button.original; const { primary } = _a; const rest = __rest(_a, ['primary'])
      const bridged = getOrDie$1(createToolbarButton(__assign({}, rest, {
        type: 'button',
        onAction() {
        },
      })))
      return renderToolbarButtonWith(bridged, extras.backstage.shared.providers, [runOnExecute$1(memInput, button)])
    }
    const renderContextToggleButton = function (memInput, button, extras) {
      const _a = button.original; const { primary } = _a; const rest = __rest(_a, ['primary'])
      const bridged = getOrDie$1(createToggleButton(__assign({}, rest, {
        type: 'togglebutton',
        onAction() {
        },
      })))
      return renderToolbarToggleButtonWith(bridged, extras.backstage.shared.providers, [runOnExecute$1(memInput, button)])
    }
    const generateOne$1 = function (memInput, button, providersBackstage) {
      const extras = { backstage: { shared: { providers: providersBackstage } } }
      if (button.type === 'contextformtogglebutton') {
        return renderContextToggleButton(memInput, button, extras)
      }
      return renderContextButton(memInput, button, extras)
    }
    const generate$6 = function (memInput, buttons, providersBackstage) {
      const mementos = map(buttons, (button) => record(generateOne$1(memInput, button, providersBackstage)))
      const asSpecs = function () {
        return map(mementos, (mem) => mem.asSpec())
      }
      const findPrimary = function (compInSystem) {
        return findMap(buttons, (button, i) => {
          if (button.primary) {
            return Option.from(mementos[i]).bind((mem) => mem.getOpt(compInSystem)).filter(not(Disabling.isDisabled))
          }
          return Option.none()
        })
      }
      return {
        asSpecs,
        findPrimary,
      }
    }

    const renderContextForm = function (ctx, providersBackstage) {
      const inputAttributes = ctx.label.fold(() => ({}), (label) => ({ 'aria-label': label }))
      const memInput = record(Input.sketch({
        inputClasses: [
          'tox-toolbar-textfield',
          'tox-toolbar-nav-js',
        ],
        data: ctx.initValue(),
        inputAttributes,
        selectOnFocus: true,
        inputBehaviours: derive$1([Keying.config({
          mode: 'special',
          onEnter(input) {
            return commands.findPrimary(input).map((primary) => {
              emitExecute(primary)
              return true
            })
          },
          onLeft(comp, se) {
            se.cut()
            return Option.none()
          },
          onRight(comp, se) {
            se.cut()
            return Option.none()
          },
        })]),
      }))
      var commands = generate$6(memInput, ctx.commands, providersBackstage)
      return renderToolbar({
        uid: generate$1('context-toolbar'),
        initGroups: [
          {
            title: Option.none(),
            items: [memInput.asSpec()],
          },
          {
            title: Option.none(),
            items: commands.asSpecs(),
          },
        ],
        onEscape: Option.none,
        cyclicKeying: true,
      })
    }
    const ContextForm = { renderContextForm }

    const forwardSlideEvent = generate$1('forward-slide')
    const backSlideEvent = generate$1('backward-slide')
    const changeSlideEvent = generate$1('change-slide-event')
    const resizingClass = 'tox-pop--resizing'
    const renderContextToolbar = function (spec) {
      const stack = Cell([])
      return InlineView.sketch({
        dom: {
          tag: 'div',
          classes: ['tox-pop'],
        },
        fireDismissalEventInstead: { event: 'doNotDismissYet' },
        onShow(comp) {
          stack.set([])
          InlineView.getContent(comp).each((c) => {
            remove$6(c.element(), 'visibility')
          })
          remove$4(comp.element(), resizingClass)
          remove$6(comp.element(), 'width')
        },
        inlineBehaviours: derive$1([
          config('context-toolbar-events', [
            runOnSource(transitionend(), (comp, se) => {
              InlineView.getContent(comp).each((c) => {
              })
              remove$4(comp.element(), resizingClass)
              remove$6(comp.element(), 'width')
            }),
            run(changeSlideEvent, (comp, se) => {
              remove$6(comp.element(), 'width')
              const currentWidth = get$8(comp.element())
              InlineView.setContent(comp, se.event().contents())
              add$2(comp.element(), resizingClass)
              const newWidth = get$8(comp.element())
              set$2(comp.element(), 'width', `${currentWidth}px`)
              InlineView.getContent(comp).each((newContents) => {
                se.event().focus().bind((f) => {
                  focus$2(f)
                  return search$1(comp.element())
                }).orThunk(() => {
                  Keying.focusIn(newContents)
                  return active()
                })
              })
              setTimeout(() => {
                set$2(comp.element(), 'width', `${newWidth}px`)
              }, 0)
            }),
            run(forwardSlideEvent, (comp, se) => {
              InlineView.getContent(comp).each((oldContents) => {
                stack.set(stack.get().concat([{
                  bar: oldContents,
                  focus: active(),
                }]))
              })
              emitWith(comp, changeSlideEvent, {
                contents: se.event().forwardContents(),
                focus: Option.none(),
              })
            }),
            run(backSlideEvent, (comp, se) => {
              last(stack.get()).each((last$$1) => {
                stack.set(stack.get().slice(0, stack.get().length - 1))
                emitWith(comp, changeSlideEvent, {
                  contents: premade$1(last$$1.bar),
                  focus: last$$1.focus,
                })
              })
            }),
          ]),
          Keying.config({
            mode: 'special',
            onEscape(comp) {
              return last(stack.get()).fold(() => spec.onEscape(), (_) => {
                emit(comp, backSlideEvent)
                return Option.some(true)
              })
            },
          }),
        ]),
        lazySink() {
          return Result.value(spec.sink)
        },
      })
    }

    const ancestor$4 = function (scope, transform, isRoot) {
      let element = scope.dom()
      const stop = isFunction(isRoot) ? isRoot : constant(false)
      while (element.parentNode) {
        element = element.parentNode
        const el = Element$$1.fromDom(element)
        const transformed = transform(el)
        if (transformed.isSome()) {
          return transformed
        } if (stop(el)) {
          break
        }
      }
      return Option.none()
    }

    const matchTargetWith = function (elem, toolbars) {
      return findMap(toolbars, (toolbarApi) => toolbarApi.predicate(elem.dom()) ? Option.some({
        toolbarApi,
        elem,
      }) : Option.none())
    }
    const lookup$1 = function (scopes, editor) {
      const isRoot = function (elem) {
        return elem.dom() === editor.getBody()
      }
      const startNode = Element$$1.fromDom(editor.selection.getNode())
      return matchTargetWith(startNode, scopes.inNodeScope).orThunk(() => matchTargetWith(startNode, scopes.inEditorScope).orThunk(() => ancestor$4(startNode, (elem) => matchTargetWith(elem, scopes.inNodeScope), isRoot)))
    }
    const ToolbarLookup = { lookup: lookup$1 }

    const categorise = function (contextToolbars, navigate) {
      const forms = {}
      const inNodeScope = []
      const inEditorScope = []
      const formNavigators = {}
      const lookupTable = {}
      const registerForm = function (key, toolbarApi) {
        const contextForm = getOrDie$1(createContextForm(toolbarApi))
        forms[key] = contextForm
        contextForm.launch.map((launch) => {
          formNavigators[`form:${key}`] = __assign({}, toolbarApi.launch, {
            type: launch.type === 'contextformtogglebutton' ? 'togglebutton' : 'button',
            onAction() {
              navigate(contextForm)
            },
          })
        })
        if (contextForm.scope === 'editor') {
          inEditorScope.push(contextForm)
        } else {
          inNodeScope.push(contextForm)
        }
        lookupTable[key] = contextForm
      }
      const registerToolbar = function (key, toolbarApi) {
        createContextToolbar(toolbarApi).each((contextToolbar) => {
          if (toolbarApi.scope === 'editor') {
            inEditorScope.push(contextToolbar)
          } else {
            inNodeScope.push(contextToolbar)
          }
          lookupTable[key] = contextToolbar
        })
      }
      const keys$$1 = keys(contextToolbars)
      each(keys$$1, (key) => {
        const toolbarApi = contextToolbars[key]
        if (toolbarApi.type === 'contextform') {
          registerForm(key, toolbarApi)
        } else if (toolbarApi.type === 'contexttoolbar') {
          registerToolbar(key, toolbarApi)
        }
      })
      return {
        forms,
        inNodeScope,
        inEditorScope,
        lookupTable,
        formNavigators,
      }
    }
    const ToolbarScopes = { categorise }

    const updateMenuText = generate$1('update-menu-text')
    const renderCommonDropdown = function (spec, prefix, sharedBackstage) {
      const optMemDisplayText = spec.text.map((text$$1) => record(renderLabel$1(text$$1, prefix, sharedBackstage.providers)))
      const onLeftOrRightInMenu = function (comp, se) {
        const dropdown = Representing.getValue(comp)
        Focusing.focus(dropdown)
        emitWith(dropdown, 'keydown', { raw: se.event().raw() })
        Dropdown.close(dropdown)
        return Option.some(true)
      }
      const role = spec.role.fold(() => ({}), (role) => ({ role }))
      const memDropdown = record(Dropdown.sketch(__assign({}, role, {
        dom: {
          tag: 'button',
          classes: [
            prefix,
            `${prefix}--select`,
          ].concat(map(spec.classes, (c) => `${prefix}--${c}`)),
          attributes: spec.tooltip.fold(() => ({}), (tooltip) => {
            const translatedTooltip = sharedBackstage.providers.translate(tooltip)
            return {
              title: translatedTooltip,
              'aria-label': translatedTooltip,
            }
          }),
        },
        components: componentRenderPipeline([
          spec.icon.map((iconName) => renderIconFromPack(iconName, sharedBackstage.providers.icons)),
          optMemDisplayText.map((mem) => mem.asSpec()),
          Option.some({
            dom: {
              tag: 'div',
              classes: [`${prefix}__select-chevron`],
              innerHtml: get$e('chevron-down', sharedBackstage.providers.icons),
            },
          }),
        ]),
        matchWidth: true,
        useMinWidth: true,
        dropdownBehaviours: derive$1([
          DisablingConfigs.button(spec.disabled),
          Unselecting.config({}),
          Replacing.config({}),
          config('menubutton-update-display-text', [
            runOnAttached(spec.onAttach),
            runOnDetached(spec.onDetach),
            run(updateMenuText, (comp, se) => {
              optMemDisplayText.bind((mem) => mem.getOpt(comp)).each((displayText) => {
                Replacing.set(displayText, [text(sharedBackstage.providers.translate(se.event().text()))])
              })
            }),
          ]),
        ]),
        eventOrder: deepMerge(toolbarButtonEventOrder, {
          mousedown: [
            'focusing',
            'alloy.base.behaviour',
            'item-type-events',
            'normal-dropdown-events',
          ],
        }),
        sandboxBehaviours: derive$1([Keying.config({
          mode: 'special',
          onLeft: onLeftOrRightInMenu,
          onRight: onLeftOrRightInMenu,
        })]),
        lazySink: sharedBackstage.getSink,
        toggleClass: `${prefix}--active`,
        parts: { menu: part(false, spec.columns, spec.presets) },
        fetch() {
          return Future.nu(spec.fetch)
        },
      })))
      return memDropdown.asSpec()
    }

    const generateSelectItems = function (editor, backstage, spec) {
      const generateItem = function (rawItem, response, disabled) {
        const translatedText = backstage.shared.providers.translate(rawItem.title)
        if (rawItem.type === 'separator') {
          return {
            type: 'separator',
            text: translatedText,
          }
        } if (rawItem.type === 'submenu') {
          return {
            type: 'nestedmenuitem',
            text: translatedText,
            disabled,
            getSubmenuItems() {
              return bind(rawItem.getStyleItems(), (si) => validate(si, response))
            },
          }
        }
        return rawItem.getStylePreview().fold(() => ({
          type: 'togglemenuitem',
          text: translatedText,
          active: rawItem.isSelected(),
          disabled,
          onAction: spec.onAction(rawItem),
        }), (preview) => ({
          type: 'styleitem',
          item: {
            type: 'togglemenuitem',
            text: translatedText,
            disabled,
            active: rawItem.isSelected(),
            onAction: spec.onAction(rawItem),
            meta: preview,
          },
        }))
      }
      var validate = function (item, response) {
        const invalid = item.type === 'formatter' && spec.isInvalid(item)
        if (response === 0) {
          return invalid ? [] : [generateItem(item, response, false)]
        }
        return [generateItem(item, response, invalid)]
      }
      const validateItems = function (preItems) {
        const response = spec.shouldHide ? 0 : 1
        return bind(preItems, (item) => validate(item, response))
      }
      const getFetch = function (backstage, getStyleItems) {
        return function (callback) {
          const preItems = getStyleItems()
          const items = validateItems(preItems)
          const menu = build$2(items, ItemResponse$1.CLOSE_ON_EXECUTE, backstage.shared.providers)
          callback(menu)
        }
      }
      return {
        validateItems,
        getFetch,
      }
    }
    const createMenuItems = function (editor, backstage, dataset, spec) {
      const getStyleItems = dataset.type === 'basic' ? function () {
        return map(dataset.data, (d) => processBasic(d, spec.isSelectedFor, spec.getPreviewFor))
      } : dataset.getData
      return {
        items: generateSelectItems(editor, backstage, spec),
        getStyleItems,
      }
    }
    const createSelectButton = function (editor, backstage, dataset, spec) {
      const _a = createMenuItems(editor, backstage, dataset, spec); const { items } = _a; const { getStyleItems } = _a
      return renderCommonDropdown({
        text: Option.some(''),
        icon: Option.none(),
        tooltip: Option.from(spec.tooltip),
        role: Option.none(),
        fetch: items.getFetch(backstage, getStyleItems),
        onAttach: spec.nodeChangeHandler.map((f) => function (comp) {
          return editor.on('nodeChange', f(comp))
        }).getOr(() => {
        }),
        onDetach: spec.nodeChangeHandler.map((f) => function (comp) {
          return editor.off('nodeChange', f(comp))
        }).getOr(() => {
        }),
        columns: 1,
        presets: 'normal',
        classes: ['bespoke'],
      }, 'tox-tbtn', backstage.shared)
    }

    const process = function (rawFormats) {
      return map(rawFormats, (item) => {
        let title = item; let format = item
        const values = item.split('=')
        if (values.length > 1) {
          title = values[0]
          format = values[1]
        }
        return {
          title,
          format,
        }
      })
    }
    const buildBasicStaticDataset = function (data) {
      return {
        type: 'basic',
        data,
      }
    }
    let Delimiter;
    (function (Delimiter) {
      Delimiter[Delimiter.SemiColon = 0] = 'SemiColon'
      Delimiter[Delimiter.Space = 1] = 'Space'
    }(Delimiter || (Delimiter = {})))
    const split = function (rawFormats, delimiter) {
      if (delimiter === Delimiter.SemiColon) {
        return rawFormats.replace(/;$/, '').split(';')
      }
      return rawFormats.split(' ')
    }
    const buildBasicSettingsDataset = function (editor, settingName, defaults, delimiter) {
      const rawFormats = readOptFrom$1(editor.settings, settingName).getOr(defaults)
      const data = process(split(rawFormats, delimiter))
      return {
        type: 'basic',
        data,
      }
    }

    const alignMenuItems = [
      {
        title: 'Left',
        icon: 'align-left',
        format: 'alignleft',
      },
      {
        title: 'Center',
        icon: 'align-center',
        format: 'aligncenter',
      },
      {
        title: 'Right',
        icon: 'align-right',
        format: 'alignright',
      },
      {
        title: 'Justify',
        icon: 'align-justify',
        format: 'alignjustify',
      },
    ]
    const createAlignSelect = function (editor, backstage) {
      const getMatchingValue = function () {
        return find(alignMenuItems, (item) => editor.formatter.match(item.format))
      }
      const isSelectedFor = function (format) {
        return function () {
          return editor.formatter.match(format)
        }
      }
      const getPreviewFor = function (format) {
        return function () {
          return Option.none()
        }
      }
      const onAction = function (rawItem) {
        return function () {
          editor.undoManager.transact(() => {
            editor.focus()
            if (editor.formatter.match(rawItem.format)) {
              editor.formatter.remove(rawItem.format)
            } else {
              editor.formatter.apply(rawItem.format)
            }
          })
        }
      }
      const nodeChangeHandler = Option.some((comp) => function () {
        const match = getMatchingValue()
        const text = match.fold(() => 'Align', (item) => item.title)
        emitWith(comp, updateMenuText, { text: backstage.shared.providers.translate(text) })
      })
      const dataset = buildBasicStaticDataset(alignMenuItems)
      return createSelectButton(editor, backstage, dataset, {
        tooltip: 'Align',
        isSelectedFor,
        getPreviewFor,
        onAction,
        nodeChangeHandler,
        shouldHide: false,
        isInvalid(item) {
          return !editor.formatter.canApply(item.format)
        },
      })
    }

    const defaultFontsFormats = 'Andale Mono=andale mono,monospace;' + 'Arial=arial,helvetica,sans-serif;' + 'Arial Black=arial black,sans-serif;' + 'Book Antiqua=book antiqua,palatino,serif;' + 'Comic Sans MS=comic sans ms,sans-serif;' + 'Courier New=courier new,courier,monospace;' + 'Georgia=georgia,palatino,serif;' + 'Helvetica=helvetica,arial,sans-serif;' + 'Impact=impact,sans-serif;' + 'Symbol=symbol;' + 'Tahoma=tahoma,arial,helvetica,sans-serif;' + 'Terminal=terminal,monaco,monospace;' + 'Times New Roman=times new roman,times,serif;' + 'Trebuchet MS=trebuchet ms,geneva,sans-serif;' + 'Verdana=verdana,geneva,sans-serif;' + 'Webdings=webdings;' + 'Wingdings=wingdings,zapf dingbats'
    const systemStackFonts = [
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'sans-serif',
    ]
    const isSystemFontStack = function (fontFamily) {
      const matchesSystemStack = function () {
        const fonts = fontFamily.toLowerCase().split(/['"]?\s*,\s*['"]?/)
        return forall(systemStackFonts, (font) => fonts.indexOf(font.toLowerCase()) > -1)
      }
      return fontFamily.indexOf('-apple-system') === 0 && matchesSystemStack()
    }
    const getSpec = function (editor) {
      const getMatchingValue = function () {
        const getFirstFont = function (fontFamily) {
          return fontFamily ? fontFamily.split(',')[0] : ''
        }
        const fontFamily = editor.queryCommandValue('FontName')
        const items = dataset.data
        const font = fontFamily ? fontFamily.toLowerCase() : ''
        return find(items, (item) => {
          const { format } = item
          return format.toLowerCase() === font || getFirstFont(format).toLowerCase() === getFirstFont(font).toLowerCase()
        }).orThunk(() => {
          if (isSystemFontStack(font)) {
            return Option.from({
              title: 'System Font',
              format: font,
            })
          }
          return Option.none()
        })
      }
      const isSelectedFor = function (item) {
        return function () {
          return getMatchingValue().exists((match) => match.format === item)
        }
      }
      const getPreviewFor = function (item) {
        return function () {
          return Option.some({
            tag: 'div',
            styleAttr: item.indexOf('dings') === -1 ? `font-family:${item}` : '',
          })
        }
      }
      const onAction = function (rawItem) {
        return function () {
          editor.undoManager.transact(() => {
            editor.focus()
            editor.execCommand('FontName', false, rawItem.format)
          })
        }
      }
      const nodeChangeHandler = Option.some((comp) => function () {
        const fontFamily = editor.queryCommandValue('FontName')
        const match = getMatchingValue()
        const text = match.fold(() => fontFamily, (item) => item.title)
        emitWith(comp, updateMenuText, { text })
      })
      var dataset = buildBasicSettingsDataset(editor, 'font_formats', defaultFontsFormats, Delimiter.SemiColon)
      return {
        tooltip: 'Fonts',
        isSelectedFor,
        getPreviewFor,
        onAction,
        nodeChangeHandler,
        dataset,
        shouldHide: false,
        isInvalid() {
          return false
        },
      }
    }
    const createFontSelect = function (editor, backstage) {
      const spec = getSpec(editor)
      return createSelectButton(editor, backstage, spec.dataset, spec)
    }
    const fontSelectMenu = function (editor, backstage) {
      const spec = getSpec(editor)
      const menuItems = createMenuItems(editor, backstage, spec.dataset, spec)
      return {
        type: 'nestedmenuitem',
        text: backstage.shared.providers.translate('Fonts'),
        getSubmenuItems() {
          return menuItems.items.validateItems(menuItems.getStyleItems())
        },
      }
    }

    const defaultFontsizeFormats = '8pt 10pt 12pt 14pt 18pt 24pt 36pt'
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
    const getSpec$1 = function (editor) {
      const getMatchingValue = function () {
        let matchOpt = Option.none()
        const items = dataset.data
        const px = editor.queryCommandValue('FontSize')
        if (px) {
          const _loop_1 = function (precision) {
            const pt = toPt(px, precision)
            matchOpt = find(items, (item) => item.format === px || item.format === pt)
          }
          for (let precision = 3; matchOpt.isNone() && precision >= 0; precision--) {
            _loop_1(precision)
          }
        }
        return {
          matchOpt,
          px,
        }
      }
      const isSelectedFor = function (item) {
        return function () {
          const { matchOpt } = getMatchingValue()
          return matchOpt.exists((match) => match.format === item)
        }
      }
      const getPreviewFor = function () {
        return function () {
          return Option.none()
        }
      }
      const onAction = function (rawItem) {
        return function () {
          editor.undoManager.transact(() => {
            editor.focus()
            editor.execCommand('FontSize', false, rawItem.format)
          })
        }
      }
      const nodeChangeHandler = Option.some((comp) => function () {
        const _a = getMatchingValue(); const { matchOpt } = _a; const { px } = _a
        const text = matchOpt.fold(() => px, (match) => match.title)
        emitWith(comp, updateMenuText, { text })
      })
      var dataset = buildBasicSettingsDataset(editor, 'fontsize_formats', defaultFontsizeFormats, Delimiter.Space)
      return {
        tooltip: 'Font Sizes',
        isSelectedFor,
        getPreviewFor,
        onAction,
        nodeChangeHandler,
        dataset,
        shouldHide: false,
        isInvalid() {
          return false
        },
      }
    }
    const createFontsizeSelect = function (editor, backstage) {
      const spec = getSpec$1(editor)
      return createSelectButton(editor, backstage, spec.dataset, spec)
    }
    const fontsizeSelectMenu = function (editor, backstage) {
      const spec = getSpec$1(editor)
      const menuItems = createMenuItems(editor, backstage, spec.dataset, spec)
      return {
        type: 'nestedmenuitem',
        text: 'Font Sizes',
        getSubmenuItems() {
          return menuItems.items.validateItems(menuItems.getStyleItems())
        },
      }
    }

    const findNearest = function (editor, getStyles, nodeChangeEvent) {
      const { parents } = nodeChangeEvent
      const styles = getStyles()
      return findMap(parents, (parent) => find(styles, (fmt) => editor.formatter.matchNode(parent, fmt.format))).orThunk(() => {
        if (editor.formatter.match('p')) {
          return Option.some({
            title: 'Paragraph',
            format: 'p',
          })
        }
        return Option.none()
      })
    }

    const defaultBlocks = 'Paragraph=p;' + 'Heading 1=h1;' + 'Heading 2=h2;' + 'Heading 3=h3;' + 'Heading 4=h4;' + 'Heading 5=h5;' + 'Heading 6=h6;' + 'Preformatted=pre'
    const getSpec$2 = function (editor) {
      const getMatchingValue = function (nodeChangeEvent) {
        return findNearest(editor, () => dataset.data, nodeChangeEvent)
      }
      const isSelectedFor = function (format) {
        return function () {
          return editor.formatter.match(format)
        }
      }
      const getPreviewFor = function (format) {
        return function () {
          const fmt = editor.formatter.get(format)
          return Option.some({
            tag: fmt.length > 0 ? fmt[0].inline || fmt[0].block || 'div' : 'div',
            styleAttr: editor.formatter.getCssText(format),
          })
        }
      }
      const onAction = function (rawItem) {
        return function () {
          editor.undoManager.transact(() => {
            editor.focus()
            if (editor.formatter.match(rawItem.format)) {
              editor.formatter.remove(rawItem.format)
            } else {
              editor.formatter.apply(rawItem.format)
            }
          })
        }
      }
      const nodeChangeHandler = Option.some((comp) => function (e) {
        const detectedFormat = getMatchingValue(e)
        const text = detectedFormat.fold(() => 'Paragraph', (fmt) => fmt.title)
        emitWith(comp, updateMenuText, { text })
      })
      var dataset = buildBasicSettingsDataset(editor, 'block_formats', defaultBlocks, Delimiter.SemiColon)
      return {
        tooltip: 'Blocks',
        isSelectedFor,
        getPreviewFor,
        onAction,
        nodeChangeHandler,
        dataset,
        shouldHide: false,
        isInvalid(item) {
          return !editor.formatter.canApply(item.format)
        },
      }
    }
    const createFormatSelect = function (editor, backstage) {
      const spec = getSpec$2(editor)
      return createSelectButton(editor, backstage, spec.dataset, spec)
    }
    const formatSelectMenu = function (editor, backstage) {
      const spec = getSpec$2(editor)
      const menuItems = createMenuItems(editor, backstage, spec.dataset, spec)
      return {
        type: 'nestedmenuitem',
        text: 'Blocks',
        getSubmenuItems() {
          return menuItems.items.validateItems(menuItems.getStyleItems())
        },
      }
    }

    const getSpec$3 = function (editor) {
      const isSelectedFor = function (format) {
        return function () {
          return editor.formatter.match(format)
        }
      }
      const getPreviewFor = function (format) {
        return function () {
          const fmt = editor.formatter.get(format)
          return fmt !== undefined ? Option.some({
            tag: fmt.length > 0 ? fmt[0].inline || fmt[0].block || 'div' : 'div',
            styleAttr: editor.formatter.getCssText(format),
          }) : Option.none()
        }
      }
      const onAction = function (rawItem) {
        return function () {
          editor.undoManager.transact(() => {
            editor.focus()
            if (editor.formatter.match(rawItem.format)) {
              editor.formatter.remove(rawItem.format)
            } else {
              editor.formatter.apply(rawItem.format)
            }
          })
        }
      }
      const nodeChangeHandler = Option.some((comp) => {
        var getFormatItems = function (fmt) {
          const subs = fmt.items
          return subs !== undefined && subs.length > 0 ? bind(subs, getFormatItems) : [{
            title: fmt.title,
            format: fmt.format,
          }]
        }
        const flattenedItems = bind(getStyleFormats(editor), getFormatItems)
        return function (e) {
          const detectedFormat = findNearest(editor, () => flattenedItems, e)
          const text = detectedFormat.fold(() => 'Paragraph', (fmt) => fmt.title)
          emitWith(comp, updateMenuText, { text })
        }
      })
      return {
        tooltip: 'Formats',
        isSelectedFor,
        getPreviewFor,
        onAction,
        nodeChangeHandler,
        shouldHide: editor.getParam('style_formats_autohide', false, 'boolean'),
        isInvalid(item) {
          return !editor.formatter.canApply(item.format)
        },
      }
    }
    const createStyleSelect = function (editor, backstage) {
      const data = backstage.styleselect
      return createSelectButton(editor, backstage, data, getSpec$3(editor))
    }
    const styleSelectMenu = function (editor, backstage) {
      const data = backstage.styleselect
      const menuItems = createMenuItems(editor, backstage, data, getSpec$3(editor))
      return {
        type: 'nestedmenuitem',
        text: 'Formats',
        getSubmenuItems() {
          return menuItems.items.validateItems(menuItems.getStyleItems())
        },
      }
    }

    const defaultMenubar = 'file edit view insert format tools table help'
    const defaultMenus = {
      file: {
        title: 'File',
        items: 'newdocument restoredraft | preview | print | deleteallconversations',
      },
      edit: {
        title: 'Edit',
        items: 'undo redo | cut copy paste pastetext | selectall | searchreplace',
      },
      view: {
        title: 'View',
        items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments',
      },
      insert: {
        title: 'Insert',
        items: 'image link media addcomment pageembed template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime',
      },
      format: {
        title: 'Format',
        items: 'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align | removeformat',
      },
      tools: {
        title: 'Tools',
        items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount',
      },
      table: {
        title: 'Table',
        items: 'inserttable tableprops deletetable row column cell',
      },
      help: {
        title: 'Help',
        items: 'help',
      },
    }
    const renderMenuButton = function (spec, prefix, sharedBackstage, role) {
      return renderCommonDropdown({
        text: spec.text,
        icon: spec.icon,
        tooltip: spec.tooltip,
        role,
        fetch(callback) {
          spec.fetch((items) => {
            callback(build$2(items, ItemResponse$1.CLOSE_ON_EXECUTE, sharedBackstage.providers))
          })
        },
        onAttach() {
        },
        onDetach() {
        },
        columns: 1,
        presets: 'normal',
        classes: [],
      }, prefix, sharedBackstage)
    }
    const bespokeItems = {
      formats: styleSelectMenu,
      blockformats: formatSelectMenu,
      fontformats: fontSelectMenu,
      fontsizes: fontsizeSelectMenu,
    }
    const make$6 = function (menu, registry, editor, backstage) {
      const removedMenuItems = getRemovedMenuItems(editor).split(/[ ,]/)
      return {
        text: menu.title,
        getItems() {
          return bind(menu.items, (i) => {
            if (i.trim().length === 0) {
              return []
            } if (exists(removedMenuItems, (removedMenuItem) => removedMenuItem === i)) {
              return []
            } if (i === 'separator' || i === '|') {
              return [{ type: 'separator' }]
            } if (registry.menuItems[i]) {
              return [registry.menuItems[i]]
            } if (bespokeItems[i]) {
              return [bespokeItems[i](editor, backstage)]
            }
            return []
          })
        },
      }
    }
    const parseItemsString = function (items) {
      if (typeof items === 'string') {
        return items.split(' ')
      }
      return items
    }
    const identifyMenus = function (editor, registry, backstage) {
      const rawMenuData = merge(defaultMenus, registry.menus)
      const userDefinedMenus = keys(registry.menus).length > 0
      const menubar = registry.menubar === undefined || registry.menubar === true ? parseItemsString(defaultMenubar) : parseItemsString(registry.menubar === false ? '' : registry.menubar)
      const validMenus = filter(menubar, (menuName) => userDefinedMenus ? registry.menus.hasOwnProperty(menuName) && registry.menus[menuName].hasOwnProperty('items') || defaultMenus.hasOwnProperty(menuName) : defaultMenus.hasOwnProperty(menuName))
      const menus = map(validMenus, (menuName) => {
        const menuData = rawMenuData[menuName]
        return make$6({
          title: menuData.title,
          items: parseItemsString(menuData.items),
        }, registry, editor, backstage)
      })
      return filter(menus, (menu) => menu.getItems().length > 0)
    }

    const defaultToolbar = [
      {
        name: 'history',
        items: [
          'undo',
          'redo',
        ],
      },
      {
        name: 'styles',
        items: ['styleselect'],
      },
      {
        name: 'formatting',
        items: [
          'bold',
          'italic',
        ],
      },
      {
        name: 'alignment',
        items: [
          'alignleft',
          'aligncenter',
          'alignright',
          'alignjustify',
        ],
      },
      {
        name: 'indentation',
        items: [
          'outdent',
          'indent',
        ],
      },
      {
        name: 'permanent pen',
        items: ['permanentpen'],
      },
      {
        name: 'comments',
        items: ['addcomment'],
      },
    ]
    const renderFromBridge = function (bridgeBuilder, render) {
      return function (spec, extras) {
        const internal = bridgeBuilder(spec).fold(compose(Result.error, formatError), Result.value).getOrDie()
        return render(internal, extras)
      }
    }
    const types = {
      button: renderFromBridge(createToolbarButton, (s, extras) => renderToolbarButton(s, extras.backstage.shared.providers)),
      togglebutton: renderFromBridge(createToggleButton, (s, extras) => renderToolbarToggleButton(s, extras.backstage.shared.providers)),
      menubutton: renderFromBridge(createMenuButton, (s, extras) => renderMenuButton(s, 'tox-tbtn', extras.backstage.shared, Option.none())),
      splitbutton: renderFromBridge(createSplitButton, (s, extras) => renderSplitButton(s, extras.backstage.shared)),
      styleSelectButton(editor, extras) {
        return createStyleSelect(editor, extras.backstage)
      },
      fontsizeSelectButton(editor, extras) {
        return createFontsizeSelect(editor, extras.backstage)
      },
      fontSelectButton(editor, extras) {
        return createFontSelect(editor, extras.backstage)
      },
      formatButton(editor, extras) {
        return createFormatSelect(editor, extras.backstage)
      },
      alignMenuButton(editor, extras) {
        return createAlignSelect(editor, extras.backstage)
      },
    }
    const extractFrom$1 = function (spec, extras) {
      return readOptFrom$1(types, spec.type).fold(() => {
        console.error('skipping button defined by', spec)
        return Option.none()
      }, (render) => Option.some(render(spec, extras)))
    }
    const bespokeButtons = {
      styleselect: types.styleSelectButton,
      fontsizeselect: types.fontsizeSelectButton,
      fontselect: types.fontSelectButton,
      formatselect: types.formatButton,
      align: types.alignMenuButton,
    }
    const removeUnusedDefaults = function (buttons) {
      const filteredItemGroups = map(defaultToolbar, (group) => {
        const items = filter(group.items, (subItem) => has(buttons, subItem) || has(bespokeButtons, subItem))
        return {
          name: group.name,
          items,
        }
      })
      return filter(filteredItemGroups, (group) => group.items.length > 0)
    }
    const convertStringToolbar = function (strToolbar) {
      const groupsStrings = strToolbar.split('|')
      return map(groupsStrings, (g) => ({ items: g.trim().split(' ') }))
    }
    const createToolbar = function (toolbarConfig) {
      if (toolbarConfig.toolbar === false) {
        return []
      } if (toolbarConfig.toolbar === undefined || toolbarConfig.toolbar === true) {
        return removeUnusedDefaults(toolbarConfig.buttons)
      } if (isString(toolbarConfig.toolbar)) {
        return convertStringToolbar(toolbarConfig.toolbar)
      } if (isArray(toolbarConfig.toolbar) && isString(toolbarConfig.toolbar[0])) {
        return convertStringToolbar(toolbarConfig.toolbar.join(' | '))
      }
      return toolbarConfig.toolbar
    }
    const identifyButtons = function (editor, toolbarConfig, extras) {
      const toolbarGroups = createToolbar(toolbarConfig)
      const groups = map(toolbarGroups, (group) => {
        const items = bind(group.items, (toolbarItem) => toolbarItem.trim().length === 0 ? [] : readOptFrom$1(toolbarConfig.buttons, toolbarItem.toLowerCase()).fold(() => readOptFrom$1(bespokeButtons, toolbarItem.toLowerCase()).map((r) => r(editor, extras)).orThunk(() => {
          console.error(`No representation for toolbarItem: ${toolbarItem}`)
          return Option.none()
        }), (spec) => extractFrom$1(spec, extras)).toArray())
        return {
          title: Option.from(editor.translate(group.name)),
          items,
        }
      })
      return filter(groups, (group) => group.items.length > 0)
    }

    const register$4 = function (editor, registryContextToolbars, sink, extras) {
      const contextbar = build$1(renderContextToolbar({
        sink,
        onEscape() {
          editor.focus()
          return Option.some(true)
        },
      }))
      const getBoxElement = function () {
        return Option.some(Element$$1.fromDom(editor.contentAreaContainer))
      }
      editor.on('init', () => {
        const scroller = editor.getBody().ownerDocument.defaultView
        const onScroll = bind$3(Element$$1.fromDom(scroller), 'scroll', () => {
          lastAnchor.get().each((anchor) => {
            const elem = lastElement.get().getOr(editor.selection.getNode())
            const nodeBounds = elem.getBoundingClientRect()
            const contentAreaBounds = editor.contentAreaContainer.getBoundingClientRect()
            const aboveEditor = nodeBounds.bottom < 0
            const belowEditor = nodeBounds.top > contentAreaBounds.height
            if (aboveEditor || belowEditor) {
              set$2(contextbar.element(), 'display', 'none')
            } else {
              remove$6(contextbar.element(), 'display')
              Positioning.positionWithin(sink, anchor, contextbar, getBoxElement())
            }
          })
        })
        editor.on('remove', () => {
          onScroll.unbind()
        })
      })
      var lastAnchor = Cell(Option.none())
      var lastElement = Cell(Option.none())
      const timer = Cell(null)
      const wrapInPopDialog = function (toolbarSpec) {
        return {
          dom: {
            tag: 'div',
            classes: ['tox-pop__dialog'],
          },
          components: [toolbarSpec],
          behaviours: derive$1([
            Keying.config({ mode: 'acyclic' }),
            config('pop-dialog-wrap-events', [
              runOnAttached((comp) => {
                editor.shortcuts.add('ctrl+F9', 'focus statusbar', () => Keying.focusIn(comp))
              }),
              runOnDetached((comp) => {
                editor.shortcuts.remove('ctrl+F9')
              }),
            ]),
          ]),
        }
      }
      const getScopes = cached(() => ToolbarScopes.categorise(registryContextToolbars, (toolbarApi) => {
        const alloySpec = buildToolbar(toolbarApi)
        emitWith(contextbar, forwardSlideEvent, { forwardContents: wrapInPopDialog(alloySpec) })
      }))
      var buildToolbar = function (ctx) {
        const { buttons } = editor.ui.registry.getAll()
        const scopes = getScopes()
        return ctx.type === 'contexttoolbar' ? (function () {
          const allButtons = merge(buttons, scopes.formNavigators)
          const initGroups = identifyButtons(editor, {
            buttons: allButtons,
            toolbar: ctx.items,
          }, extras)
          return renderToolbar({
            uid: generate$1('context-toolbar'),
            initGroups,
            onEscape: Option.none,
            cyclicKeying: true,
          })
        }()) : (function () {
          return ContextForm.renderContextForm(ctx, extras.backstage.shared.providers)
        }())
      }
      editor.on(showContextToolbarEvent, (e) => {
        const scopes = getScopes()
        readOptFrom$1(scopes.lookupTable, e.toolbarKey).each((ctx) => {
          launchContext(ctx, e.target === editor ? Option.none() : Option.some(e))
          InlineView.getContent(contextbar).each(Keying.focusIn)
        })
      })
      const bubbleAlignments = {
        valignCentre: [],
        alignCentre: [],
        alignLeft: ['tox-pop--align-left'],
        alignRight: ['tox-pop--align-right'],
        right: ['tox-pop--right'],
        left: ['tox-pop--left'],
        bottom: ['tox-pop--bottom'],
        top: ['tox-pop--top'],
      }
      const anchorOverrides = { maxHeightFunction: expandable() }
      const lineAnchorSpec = {
        bubble: nu$7(12, 0, bubbleAlignments),
        layouts: {
          onLtr() {
            return [east$1]
          },
          onRtl() {
            return [west$1]
          },
        },
        overrides: anchorOverrides,
      }
      const anchorSpec = {
        bubble: nu$7(0, 12, bubbleAlignments),
        layouts: {
          onLtr() {
            return [
              north$1,
              south$1,
              northeast$1,
              southeast$1,
              northwest$1,
              southwest$1,
            ]
          },
          onRtl() {
            return [
              north$1,
              south$1,
              northwest$1,
              southwest$1,
              northeast$1,
              southeast$1,
            ]
          },
        },
        overrides: anchorOverrides,
      }
      const getAnchor = function (position, element) {
        const anchorage = position === 'node' ? extras.backstage.shared.anchors.node(element) : extras.backstage.shared.anchors.cursor()
        const anchor = deepMerge(anchorage, position === 'line' ? lineAnchorSpec : anchorSpec)
        return anchor
      }
      var launchContext = function (toolbarApi, elem) {
        clearTimer()
        const toolbarSpec = buildToolbar(toolbarApi)
        const sElem = elem.map(Element$$1.fromDom)
        const anchor = getAnchor(toolbarApi.position, sElem)
        lastAnchor.set(Option.some(anchor))
        lastElement.set(elem)
        InlineView.showWithin(contextbar, anchor, wrapInPopDialog(toolbarSpec), getBoxElement())
        remove$6(contextbar.element(), 'display')
      }
      const launchContextToolbar = function () {
        const scopes = getScopes()
        ToolbarLookup.lookup(scopes, editor).fold(() => {
          lastAnchor.set(Option.none())
          InlineView.hide(contextbar)
        }, (info) => {
          launchContext(info.toolbarApi, Option.some(info.elem.dom()))
        })
      }
      var clearTimer = function () {
        const current = timer.get()
        if (current !== null) {
          clearTimeout(current)
          timer.set(null)
        }
      }
      const resetTimer = function (t) {
        clearTimer()
        timer.set(t)
      }
      editor.on('click keyup setContent ObjectResized ResizeEditor', (e) => {
        resetTimer(global$c.setEditorTimeout(editor, launchContextToolbar, 0))
      })
      editor.on('nodeChange', (e) => {
        search$1(contextbar.element()).fold(() => {
          resetTimer(global$c.setEditorTimeout(editor, launchContextToolbar, 0))
        }, (_) => {
        })
      })
    }
    const ContextToolbar = { register: register$4 }

    const setup$3 = function (editor, mothership, uiMothership) {
      const onMousedown = bind$3(Element$$1.fromDom(document), 'mousedown', (evt) => {
        each([
          mothership,
          uiMothership,
        ], (ship) => {
          ship.broadcastOn([dismissPopups()], { target: evt.target() })
        })
      })
      const onTouchstart = bind$3(Element$$1.fromDom(document), 'touchstart', (evt) => {
        each([
          mothership,
          uiMothership,
        ], (ship) => {
          ship.broadcastOn([dismissPopups()], { target: evt.target() })
        })
      })
      const onMouseup = bind$3(Element$$1.fromDom(document), 'mouseup', (evt) => {
        if (evt.raw().button === 0) {
          each([
            mothership,
            uiMothership,
          ], (ship) => {
            ship.broadcastOn([mouseReleased()], { target: evt.target() })
          })
        }
      })
      const onContentMousedown = function (raw) {
        each([
          mothership,
          uiMothership,
        ], (ship) => {
          ship.broadcastOn([dismissPopups()], { target: Element$$1.fromDom(raw.target) })
        })
      }
      editor.on('mousedown', onContentMousedown)
      editor.on('touchstart', onContentMousedown)
      const onContentMouseup = function (raw) {
        if (raw.button === 0) {
          each([
            mothership,
            uiMothership,
          ], (ship) => {
            ship.broadcastOn([mouseReleased()], { target: Element$$1.fromDom(raw.target) })
          })
        }
      }
      editor.on('mouseup', onContentMouseup)
      const onWindowScroll = bind$3(Element$$1.fromDom(window), 'scroll', (evt) => {
        each([
          mothership,
          uiMothership,
        ], (ship) => {
          ship.broadcastEvent(windowScroll(), evt)
        })
      })
      editor.on('remove', () => {
        editor.off('mousedown', onContentMousedown)
        editor.off('touchstart', onContentMousedown)
        editor.off('mouseup', onContentMouseup)
        onMousedown.unbind()
        onTouchstart.unbind()
        onMouseup.unbind()
        onWindowScroll.unbind()
      })
      editor.on('detach', () => {
        detachSystem(mothership)
        detachSystem(uiMothership)
        mothership.destroy()
        uiMothership.destroy()
      })
    }
    const Events = { setup: setup$3 }

    const parts$a = AlloyParts
    const partType$1 = PartType

    const factory$c = function (detail, spec) {
      const setMenus = function (comp, menus) {
        const newMenus = map(menus, (m) => {
          const buttonSpec = {
            text: Option.some(m.text),
            icon: Option.none(),
            tooltip: Option.none(),
            fetch(callback) {
              callback(m.getItems())
            },
          }
          return renderMenuButton(buttonSpec, 'tox-mbtn', {
            getSink: detail.getSink,
            providers: detail.providers,
          }, Option.some('menuitem'))
        })
        Replacing.set(comp, newMenus)
      }
      const apis = {
        focus: Keying.focusIn,
        setMenus,
      }
      return {
        uid: detail.uid,
        dom: detail.dom,
        components: [],
        behaviours: derive$1([
          Replacing.config({}),
          config('menubar-events', [
            runOnAttached((component) => {
              detail.onSetup(component)
            }),
            run(mouseover(), (comp, se) => {
              descendant$2(comp.element(), '.' + 'tox-mbtn--active').each((activeButton) => {
                closest$3(se.event().target(), '.' + 'tox-mbtn').each((hoveredButton) => {
                  if (!eq(activeButton, hoveredButton)) {
                    comp.getSystem().getByDom(activeButton).each((activeComp) => {
                      comp.getSystem().getByDom(hoveredButton).each((hoveredComp) => {
                        Dropdown.expand(hoveredComp)
                        Dropdown.close(activeComp)
                        Focusing.focus(hoveredComp)
                      })
                    })
                  }
                })
              })
            }),
            run(focusShifted(), (comp, se) => {
              se.event().prevFocus().bind((prev) => comp.getSystem().getByDom(prev).toOption()).each((prev) => {
                se.event().newFocus().bind((nu) => comp.getSystem().getByDom(nu).toOption()).each((nu) => {
                  if (Dropdown.isOpen(prev)) {
                    Dropdown.expand(nu)
                    Dropdown.close(prev)
                  }
                })
              })
            }),
          ]),
          Keying.config({
            mode: 'flow',
            selector: '.' + 'tox-mbtn',
            onEscape(comp) {
              detail.onEscape(comp)
              return Option.some(true)
            },
          }),
          Tabstopping.config({}),
        ]),
        apis,
        domModification: { attributes: { role: 'menubar' } },
      }
    }
    const SilverMenubar = single$2({
      factory: factory$c,
      name: 'silver.Menubar',
      configFields: [
        strict$1('dom'),
        strict$1('uid'),
        strict$1('onEscape'),
        strict$1('getSink'),
        strict$1('providers'),
        defaulted$1('onSetup', noop),
      ],
      apis: {
        focus(apis, comp) {
          apis.focus(comp)
        },
        setMenus(apis, comp, menus) {
          apis.setMenus(comp, menus)
        },
      },
    })

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
      remove$5(root, [
        slideConfig.shrinkingClass,
        slideConfig.growingClass,
      ])
    }
    const setShrunk = function (component, slideConfig) {
      remove$4(component.element(), slideConfig.openClass)
      add$2(component.element(), slideConfig.closedClass)
      set$2(component.element(), getDimensionProperty(slideConfig), '0px')
      reflow(component.element())
    }
    const setGrown = function (component, slideConfig) {
      remove$4(component.element(), slideConfig.closedClass)
      add$2(component.element(), slideConfig.openClass)
      remove$6(component.element(), getDimensionProperty(slideConfig))
    }
    const doImmediateShrink = function (component, slideConfig, slideState, _calculatedSize) {
      slideState.setCollapsed()
      set$2(component.element(), getDimensionProperty(slideConfig), getDimension(slideConfig, component.element()))
      reflow(component.element())
      disableTransitions(component, slideConfig)
      setShrunk(component, slideConfig)
      slideConfig.onStartShrink(component)
      slideConfig.onShrunk(component)
    }
    const doStartShrink = function (component, slideConfig, slideState, calculatedSize) {
      const size = calculatedSize.getOrThunk(() => getDimension(slideConfig, component.element()))
      slideState.setCollapsed()
      set$2(component.element(), getDimensionProperty(slideConfig), size)
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
        set$2(component.element(), getDimensionProperty(slideConfig), beforeSize)
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
      set$2(component.element(), getDimensionProperty(slideConfig), fullSize)
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

    const exhibit$6 = function (base, slideConfig) {
      const { expanded } = slideConfig
      return expanded ? nu$6({
        classes: [slideConfig.openClass],
        styles: {},
      }) : nu$6({
        classes: [slideConfig.closedClass],
        styles: wrap$1(slideConfig.dimension.property, '0px'),
      })
    }
    const events$d = function (slideConfig, slideState) {
      return derive([runOnSource(transitionend(), (component, simulatedEvent) => {
        const raw = simulatedEvent.event().raw()
        if (raw.propertyName === slideConfig.dimension.property) {
          disableTransitions(component, slideConfig)
          if (slideState.isExpanded()) {
            remove$6(component.element(), slideConfig.dimension.property)
          }
          const notify = slideState.isExpanded() ? slideConfig.onGrown : slideConfig.onShrunk
          notify(component)
        }
      })])
    }

    const ActiveSliding = /* #__PURE__ */Object.freeze({
      exhibit: exhibit$6,
      events: events$d,
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
          output$1('getDimension', (elem) => `${get$8(elem)}px`),
        ],
        height: [
          output$1('property', 'height'),
          output$1('getDimension', (elem) => `${get$9(elem)}px`),
        ],
      })),
    ]

    const init$a = function (spec) {
      const state = Cell(spec.expanded)
      const readState = function () {
        return `expanded: ${state.get()}`
      }
      return nu$5({
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
      init: init$a,
    })

    const Sliding = create$1({
      fields: SlidingSchema,
      name: 'sliding',
      active: ActiveSliding,
      apis: SlidingApis,
      state: SlidingState,
    })

    const owner$4 = 'container'
    const schema$m = [field$1('slotBehaviours', [])]
    const getPartName$1 = function (name) {
      return `<alloy.field.${name}>`
    }
    const sketch$3 = function (sSpec) {
      const parts = (function () {
        const record = []
        const slot = function (name, config) {
          record.push(name)
          return generateOne(owner$4, getPartName$1(name), config)
        }
        return {
          slot,
          record() {
            return record
          },
        }
      }())
      const spec = sSpec(parts)
      const partNames = parts.record()
      const fieldParts = map(partNames, (n) => required({
        name: n,
        pname: getPartName$1(n),
      }))
      return composite(owner$4, schema$m, fieldParts, make$7, spec)
    }
    var make$7 = function (detail, components$$1, spec) {
      const getSlotNames = function (_) {
        return getAllPartNames(detail)
      }
      const getSlot = function (container, key) {
        return getPart(container, detail, key)
      }
      const onSlot = function (f, def) {
        if (def === void 0) {
          def = undefined
        }
        return function (container, key) {
          return getPart(container, detail, key).map((slot) => f(slot, key)).getOr(def)
        }
      }
      const onSlots = function (f) {
        return function (container, keys$$1) {
          each(keys$$1, (key) => f(container, key))
        }
      }
      const doShowing = function (comp, key) {
        return get$2(comp.element(), 'aria-hidden') !== 'true'
      }
      const doShow = function (comp, key) {
        if (!doShowing(comp, key)) {
          const element = comp.element()
          remove$6(element, 'display')
          remove$1(element, 'aria-hidden')
          emitWith(comp, slotVisibility(), {
            name: key,
            visible: true,
          })
        }
      }
      const doHide = function (comp, key) {
        if (doShowing(comp, key)) {
          const element = comp.element()
          set$2(element, 'display', 'none')
          set$1(element, 'aria-hidden', 'true')
          emitWith(comp, slotVisibility(), {
            name: key,
            visible: false,
          })
        }
      }
      const isShowing = onSlot(doShowing, false)
      const hideSlot = onSlot(doHide)
      const hideSlots = onSlots(hideSlot)
      const hideAllSlots = function (container) {
        return hideSlots(container, getSlotNames(container))
      }
      const showSlot = onSlot(doShow)
      const apis = {
        getSlotNames,
        getSlot,
        isShowing,
        hideSlot,
        hideAllSlots,
        showSlot,
      }
      return {
        uid: detail.uid,
        dom: detail.dom,
        components: components$$1,
        behaviours: get$d(detail.slotBehaviours),
        apis,
      }
    }
    const slotApis = map$1({
      getSlotNames(apis, c) {
        return apis.getSlotNames(c)
      },
      getSlot(apis, c, key) {
        return apis.getSlot(c, key)
      },
      isShowing(apis, c, key) {
        return apis.isShowing(c, key)
      },
      hideSlot(apis, c, key) {
        return apis.hideSlot(c, key)
      },
      hideAllSlots(apis, c) {
        return apis.hideAllSlots(c)
      },
      showSlot(apis, c, key) {
        return apis.showSlot(c, key)
      },
    }, makeApi)
    const SlotContainer = __assign({}, slotApis, { sketch: sketch$3 })

    const api$3 = function (comp) {
      return {
        element() {
          return comp.element().dom()
        },
      }
    }
    const makePanels = function (parts, panelConfigs) {
      return map(panelConfigs, (config$$1) => {
        const { name } = config$$1
        const { settings } = config$$1
        return parts.slot(name, {
          dom: {
            tag: 'div',
            classes: ['tox-sidebar__pane'],
          },
          behaviours: SimpleBehaviours.unnamedEvents([
            runOnAttached((sidepanel) => {
              if (settings.onrender) {
                settings.onrender(api$3(sidepanel))
              }
            }),
            run(slotVisibility(), (sidepanel, se) => {
              const data = se.event()
              const optSidePanelConfig = find(panelConfigs, (config$$1) => config$$1.name === data.name())
              optSidePanelConfig.each((sidePanelConfig) => {
                const { settings } = sidePanelConfig
                const handler = data.visible() ? settings.onshow : settings.onhide
                if (handler) {
                  handler(api$3(sidepanel))
                }
              })
            }),
          ]),
        })
      })
    }
    const makeSidebar = function (panelConfigs) {
      return SlotContainer.sketch((parts) => ({
        dom: {
          tag: 'div',
          classes: ['tox-sidebar__pane-container'],
        },
        components: makePanels(parts, panelConfigs),
        slotBehaviours: SimpleBehaviours.unnamedEvents([runOnAttached((slotContainer) => SlotContainer.hideAllSlots(slotContainer))]),
      }))
    }
    const setSidebar = function (sidebar, panelConfigs) {
      const optSlider = Composing.getCurrent(sidebar)
      optSlider.each((slider) => Replacing.set(slider, [makeSidebar(panelConfigs)]))
    }
    const toggleSidebar = function (sidebar, name) {
      const optSlider = Composing.getCurrent(sidebar)
      optSlider.each((slider) => {
        const optSlotContainer = Composing.getCurrent(slider)
        optSlotContainer.each((slotContainer) => {
          if (Sliding.hasGrown(slider)) {
            if (SlotContainer.isShowing(slotContainer, name)) {
              Sliding.shrink(slider)
            } else {
              SlotContainer.hideAllSlots(slotContainer)
              SlotContainer.showSlot(slotContainer, name)
            }
          } else {
            SlotContainer.hideAllSlots(slotContainer)
            SlotContainer.showSlot(slotContainer, name)
            Sliding.grow(slider)
          }
        })
      })
    }
    const whichSidebar = function (sidebar) {
      const optSlider = Composing.getCurrent(sidebar)
      return optSlider.bind((slider) => {
        const sidebarOpen = Sliding.isGrowing(slider) || Sliding.hasGrown(slider)
        if (sidebarOpen) {
          const optSlotContainer = Composing.getCurrent(slider)
          return optSlotContainer.bind((slotContainer) => find(SlotContainer.getSlotNames(slotContainer), (name) => SlotContainer.isShowing(slotContainer, name)))
        }
        return Option.none()
      })
    }
    const fixSize = generate$1('FixSizeEvent')
    const autoSize = generate$1('AutoSizeEvent')
    const renderSidebar = function (spec) {
      return {
        uid: spec.uid,
        dom: {
          tag: 'div',
          classes: ['tox-sidebar'],
        },
        components: [{
          dom: {
            tag: 'div',
            classes: ['tox-sidebar__slider'],
          },
          components: [],
          behaviours: derive$1([
            Tabstopping.config({}),
            Focusing.config({}),
            Sliding.config({
              dimension: { property: 'width' },
              closedClass: 'tox-sidebar--sliding-closed',
              openClass: 'tox-sidebar--sliding-open',
              shrinkingClass: 'tox-sidebar--sliding-shrinking',
              growingClass: 'tox-sidebar--sliding-growing',
              onShrunk(slider) {
                const optSlotContainer = Composing.getCurrent(slider)
                optSlotContainer.each(SlotContainer.hideAllSlots)
                emit(slider, autoSize)
              },
              onGrown(slider) {
                emit(slider, autoSize)
              },
              onStartGrow(slider) {
                emitWith(slider, fixSize, { width: getRaw(slider.element(), 'width').getOr('') })
              },
              onStartShrink(slider) {
                emitWith(slider, fixSize, { width: `${get$8(slider.element())}px` })
              },
            }),
            Replacing.config({}),
            Composing.config({
              find(comp) {
                const children = Replacing.contents(comp)
                return head(children)
              },
            }),
          ]),
        }],
        behaviours: derive$1([
          ComposingConfigs.childAt(0),
          config('sidebar-sliding-events', [
            run(fixSize, (comp, se) => {
              set$2(comp.element(), 'width', se.event().width())
            }),
            run(autoSize, (comp, se) => {
              remove$6(comp.element(), 'width')
            }),
          ]),
        ]),
      }
    }
    const Sidebar = {
      setSidebar,
      toggleSidebar,
      whichSidebar,
      renderSidebar,
    }

    const factory$d = function (detail, components, spec) {
      const apis = {
        getSocket(comp) {
          return parts$a.getPart(comp, detail, 'socket')
        },
        setSidebar(comp, panelConfigs) {
          parts$a.getPart(comp, detail, 'sidebar').each((sidebar) => Sidebar.setSidebar(sidebar, panelConfigs))
        },
        toggleSidebar(comp, name) {
          parts$a.getPart(comp, detail, 'sidebar').each((sidebar) => Sidebar.toggleSidebar(sidebar, name))
        },
        whichSidebar(comp) {
          return parts$a.getPart(comp, detail, 'sidebar').bind(Sidebar.whichSidebar).getOrNull()
        },
        getToolbar(comp) {
          return parts$a.getPart(comp, detail, 'toolbar')
        },
        setToolbar(comp, groups) {
          parts$a.getPart(comp, detail, 'toolbar').each((toolbar) => {
            Toolbar.setGroups(toolbar, groups)
          })
        },
        focusToolbar(comp) {
          parts$a.getPart(comp, detail, 'toolbar').each((toolbar) => {
            Keying.focusIn(toolbar)
          })
        },
        setMenubar(comp, menus) {
          parts$a.getPart(comp, detail, 'menubar').each((menubar) => {
            SilverMenubar.setMenus(menubar, menus)
          })
        },
        focusMenubar(comp) {
          parts$a.getPart(comp, detail, 'menubar').each((menubar) => {
            SilverMenubar.focus(menubar)
          })
        },
      }
      return {
        uid: detail.uid,
        dom: detail.dom,
        components,
        apis,
        behaviours: detail.behaviours,
      }
    }
    const partMenubar = partType$1.optional({
      factory: SilverMenubar,
      name: 'menubar',
      schema: [
        strict$1('dom'),
        strict$1('getSink'),
      ],
    })
    const partToolbar = partType$1.optional({
      factory: {
        sketch(spec) {
          return renderToolbar({
            uid: spec.uid,
            onEscape() {
              spec.onEscape()
              return Option.some(true)
            },
            cyclicKeying: false,
            initGroups: [],
          })
        },
      },
      name: 'toolbar',
      schema: [
        strict$1('dom'),
        strict$1('onEscape'),
      ],
    })
    const partSocket = partType$1.optional({
      name: 'socket',
      schema: [strict$1('dom')],
    })
    const partSidebar = partType$1.optional({
      factory: { sketch: Sidebar.renderSidebar },
      name: 'sidebar',
      schema: [strict$1('dom')],
    })
    const OuterContainer = composite$1({
      name: 'OuterContainer',
      factory: factory$d,
      configFields: [
        strict$1('dom'),
        strict$1('behaviours'),
      ],
      partFields: [
        partMenubar,
        partToolbar,
        partSocket,
        partSidebar,
      ],
      apis: {
        getSocket(apis, comp) {
          return apis.getSocket(comp)
        },
        setSidebar(apis, comp, panelConfigs) {
          apis.setSidebar(comp, panelConfigs)
        },
        toggleSidebar(apis, comp, name) {
          apis.toggleSidebar(comp, name)
        },
        whichSidebar(apis, comp) {
          return apis.whichSidebar(comp)
        },
        getToolbar(apis, comp) {
          return apis.getToolbar(comp)
        },
        setToolbar(apis, comp, grps) {
          const groups = map(grps, (grp) => renderToolbarGroup(grp))
          apis.setToolbar(comp, groups)
        },
        setMenubar(apis, comp, menus) {
          apis.setMenubar(comp, menus)
        },
        focusMenubar(apis, comp) {
          apis.focusMenubar(comp)
        },
        focusToolbar(apis, comp) {
          apis.focusToolbar(comp)
        },
      },
    })

    const fireSkinLoaded = function (editor) {
      return editor.fire('SkinLoaded')
    }
    const fireResizeEditor = function (editor) {
      return editor.fire('ResizeEditor')
    }
    const fireBeforeRenderUI = function (editor) {
      return editor.fire('BeforeRenderUI')
    }
    const Events$1 = {
      fireSkinLoaded,
      fireResizeEditor,
      fireBeforeRenderUI,
    }

    const fireSkinLoaded$1 = function (editor) {
      const done = function () {
        editor._skinLoaded = true
        Events$1.fireSkinLoaded(editor)
      }
      return function () {
        if (editor.initialized) {
          done()
        } else {
          editor.on('init', done)
        }
      }
    }
    const SkinLoaded = { fireSkinLoaded: fireSkinLoaded$1 }

    const loadSkin = function (isInline, editor) {
      const skinUrl = getSkinUrl(editor)
      let skinUiCss
      if (skinUrl) {
        skinUiCss = `${skinUrl}/skin.min.css`
        editor.contentCSS.push(`${skinUrl + (isInline ? '/content.inline' : '/content')}.min.css`)
      }
      if (isSkinDisabled(editor) === false && skinUiCss) {
        global$4.DOM.styleSheetLoader.load(skinUiCss, SkinLoaded.fireSkinLoaded(editor))
      } else {
        SkinLoaded.fireSkinLoaded(editor)()
      }
    }
    const iframe = curry(loadSkin, false)
    const inline = curry(loadSkin, true)

    const handleSwitchMode = function (uiComponents) {
      return function (e) {
        const { outerContainer } = uiComponents
        all('*', outerContainer.element()).forEach((elm) => {
          outerContainer.getSystem().getByDom(elm).each((comp) => {
            if (comp.hasConfigured(Disabling)) {
              if (e.mode === 'readonly') {
                Disabling.disable(comp)
              } else {
                Disabling.enable(comp)
              }
            }
          })
        })
      }
    }
    const render = function (editor, uiComponents, rawUiConfig, backstage, args) {
      iframe(editor)
      attachSystemAfter(Element$$1.fromDom(args.targetNode), uiComponents.mothership)
      attachSystem(body(), uiComponents.uiMothership)
      editor.on('init', () => {
        OuterContainer.setToolbar(uiComponents.outerContainer, identifyButtons(editor, rawUiConfig, { backstage }))
        OuterContainer.setMenubar(uiComponents.outerContainer, identifyMenus(editor, rawUiConfig, backstage))
        OuterContainer.setSidebar(uiComponents.outerContainer, editor.sidebars || [])
        if (editor.readonly) {
          handleSwitchMode(uiComponents)({ mode: 'readonly' })
        }
      })
      const socket = OuterContainer.getSocket(uiComponents.outerContainer).getOrDie('Could not find expected socket element')
      editor.on('SwitchMode', handleSwitchMode(uiComponents))
      if (isReadOnly(editor)) {
        editor.setMode('readonly')
      }
      editor.addCommand('ToggleSidebar', (ui, value) => {
        OuterContainer.toggleSidebar(uiComponents.outerContainer, value)
        editor.fire('ToggleSidebar')
      })
      editor.addQueryValueHandler('ToggleSidebar', () => OuterContainer.whichSidebar(uiComponents.outerContainer))
      return {
        iframeContainer: socket.element().dom(),
        editorContainer: uiComponents.outerContainer.element().dom(),
      }
    }
    const Iframe = {
      render,
      getBehaviours(_) {
        return []
      },
    }

    const getOrigin = function (element, scroll) {
      return offsetParent(element).orThunk(() => {
        const marker = Element$$1.fromTag('span')
        before(element, marker)
        const offsetParent$$1 = offsetParent(marker)
        remove(marker)
        return offsetParent$$1
      }).map((offsetP) => {
        const loc = absolute(offsetP)
        return loc.translate(-scroll.left(), -scroll.top())
      }).getOrThunk(() => Position(0, 0))
    }

    const adt$b = Adt.generate([
      {
        offset: [
          'x',
          'y',
        ],
      },
      {
        absolute: [
          'x',
          'y',
        ],
      },
      {
        fixed: [
          'x',
          'y',
        ],
      },
    ])
    const subtract = function (change) {
      return function (point) {
        return point.translate(-change.left(), -change.top())
      }
    }
    const add$4 = function (change) {
      return function (point) {
        return point.translate(change.left(), change.top())
      }
    }
    const transform$1 = function (changes) {
      return function (x, y) {
        return foldl(changes, (rest, f) => f(rest), Position(x, y))
      }
    }
    const asFixed = function (coord, scroll, origin) {
      return coord.fold(transform$1([
        add$4(origin),
        subtract(scroll),
      ]), transform$1([subtract(scroll)]), transform$1([]))
    }
    const asAbsolute = function (coord, scroll, origin) {
      return coord.fold(transform$1([add$4(origin)]), transform$1([]), transform$1([add$4(scroll)]))
    }
    const asOffset = function (coord, scroll, origin) {
      return coord.fold(transform$1([]), transform$1([subtract(origin)]), transform$1([
        add$4(scroll),
        subtract(origin),
      ]))
    }
    const withinRange = function (coord1, coord2, xRange, yRange, scroll, origin) {
      const a1 = asAbsolute(coord1, scroll, origin)
      const a2 = asAbsolute(coord2, scroll, origin)
      return Math.abs(a1.left() - a2.left()) <= xRange && Math.abs(a1.top() - a2.top()) <= yRange
    }
    const toStyles = function (coord, scroll, origin) {
      return coord.fold((x, y) => ({
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
      }), (x, y) => ({
        position: 'absolute',
        left: `${x - origin.left()}px`,
        top: `${y - origin.top()}px`,
      }), (x, y) => ({
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
      }))
    }
    const translate$2 = function (coord, deltaX, deltaY) {
      return coord.fold((x, y) => adt$b.offset(x + deltaX, y + deltaY), (x, y) => adt$b.absolute(x + deltaX, y + deltaY), (x, y) => adt$b.fixed(x + deltaX, y + deltaY))
    }
    const absorb = function (partialCoord, originalCoord, scroll, origin) {
      const absorbOne = function (stencil, nu) {
        return function (optX, optY) {
          const original = stencil(originalCoord, scroll, origin)
          return nu(optX.getOr(original.left()), optY.getOr(original.top()))
        }
      }
      return partialCoord.fold(absorbOne(asOffset, adt$b.offset), absorbOne(asAbsolute, adt$b.absolute), absorbOne(asFixed, adt$b.fixed))
    }
    const { offset } = adt$b
    const absolute$3 = adt$b.absolute
    const fixed$1 = adt$b.fixed

    const appear = function (component, contextualInfo) {
      add$2(component.element(), contextualInfo.transitionClass)
      remove$4(component.element(), contextualInfo.fadeOutClass)
      add$2(component.element(), contextualInfo.fadeInClass)
    }
    const disappear = function (component, contextualInfo) {
      add$2(component.element(), contextualInfo.transitionClass)
      remove$4(component.element(), contextualInfo.fadeInClass)
      add$2(component.element(), contextualInfo.fadeOutClass)
    }
    const isPartiallyVisible = function (box$$1, viewport$$1) {
      return box$$1.y() < viewport$$1.bottom() && box$$1.bottom() > viewport$$1.y()
    }
    const isCompletelyVisible = function (box$$1, viewport$$1) {
      return box$$1.y() >= viewport$$1.y() && box$$1.bottom() <= viewport$$1.bottom()
    }
    const getAttr = function (elem, attr) {
      return has$1(elem, attr) ? Option.some(parseInt(get$2(elem, attr), 10)) : Option.none()
    }
    const getPrior = function (component, dockInfo) {
      const elem = component.element()
      return getAttr(elem, dockInfo.leftAttr).bind((left) => getAttr(elem, dockInfo.topAttr).map((top) => {
        const w = get$8(component.element())
        const h = get$9(component.element())
        return bounds(left, top, w, h)
      }))
    }
    const setPrior = function (component, dockInfo, absLeft, absTop) {
      const elem = component.element()
      set$1(elem, dockInfo.leftAttr, absLeft)
      set$1(elem, dockInfo.topAttr, absTop)
    }
    const clearPrior = function (component, dockInfo) {
      const elem = component.element()
      remove$1(elem, dockInfo.leftAttr)
      remove$1(elem, dockInfo.topAttr)
    }
    const morphToAbsolute = function (component, dockInfo, viewport$$1) {
      return getPrior(component, dockInfo).bind((box$$1) => {
        if (isCompletelyVisible(box$$1, viewport$$1)) {
          clearPrior(component, dockInfo)
          return Option.some(absolute$3(box$$1.x(), box$$1.y()))
        }
        return Option.none()
      })
    }
    const morphToFixed = function (component, dockInfo, viewport$$1, scroll, origin) {
      const loc = absolute(component.element())
      const box$$1 = bounds(loc.left(), loc.top(), get$8(component.element()), get$9(component.element()))
      if (!isCompletelyVisible(box$$1, viewport$$1)) {
        setPrior(component, dockInfo, loc.left(), loc.top())
        const coord = absolute$3(loc.left(), loc.top())
        const asFixed$$1 = asFixed(coord, scroll, origin)
        const viewportPt = absolute$3(viewport$$1.x(), viewport$$1.y())
        const fixedViewport = asFixed(viewportPt, scroll, origin)
        const fixedY = box$$1.y() <= viewport$$1.y() ? fixedViewport.top() : fixedViewport.top() + viewport$$1.height() - box$$1.height()
        return Option.some(fixed$1(asFixed$$1.left(), fixedY))
      }
      return Option.none()
    }
    const getMorph = function (component, dockInfo, viewport$$1, scroll, origin) {
      const isDocked = getRaw(component.element(), 'position').is('fixed')
      return isDocked ? morphToAbsolute(component, dockInfo, viewport$$1) : morphToFixed(component, dockInfo, viewport$$1, scroll, origin)
    }

    const refresh = function (component, config, state) {
      const viewport = config.lazyViewport(component)
      config.contextual.each((contextInfo) => {
        contextInfo.lazyContext(component).each((elem) => {
          const box$$1 = box(elem)
          const isVisible = isPartiallyVisible(box$$1, viewport)
          const method = isVisible ? appear : disappear
          method(component, contextInfo)
        })
      })
      const doc = owner(component.element())
      const scroll = get$7(doc)
      const origin = getOrigin(component.element(), scroll)
      getMorph(component, config, viewport, scroll, origin).each((morph) => {
        const styles = toStyles(morph, scroll, origin)
        setAll$1(component.element(), styles)
      })
    }

    const DockingApis = /* #__PURE__ */Object.freeze({
      refresh,
    })

    const events$e = function (dockInfo, dockState) {
      return derive([
        run(transitionend(), (component, simulatedEvent) => {
          dockInfo.contextual.each((contextInfo) => {
            if (eq(component.element(), simulatedEvent.event().target())) {
              remove$4(component.element(), contextInfo.transitionClass)
              simulatedEvent.stop()
            }
          })
        }),
        run(windowScroll(), (component, _) => {
          refresh(component, dockInfo, dockState)
        }),
      ])
    }

    const ActiveDocking = /* #__PURE__ */Object.freeze({
      events: events$e,
    })

    const defaultLazyViewport = function (_component) {
      const scroll$$1 = get$7()
      return bounds(scroll$$1.left(), scroll$$1.top(), window.innerWidth, window.innerHeight)
    }
    const DockingSchema = [
      optionObjOf('contextual', [
        strict$1('fadeInClass'),
        strict$1('fadeOutClass'),
        strict$1('transitionClass'),
        strict$1('lazyContext'),
      ]),
      defaulted$1('lazyViewport', defaultLazyViewport),
      strict$1('leftAttr'),
      strict$1('topAttr'),
    ]

    const Docking = create$1({
      fields: DockingSchema,
      name: 'docking',
      active: ActiveDocking,
      apis: DockingApis,
    })

    const render$1 = function (editor, uiComponents, rawUiConfig, backstage, args) {
      let floatContainer
      const { DOM } = global$4
      inline(editor)
      const setPosition = function () {
        const isDocked = getRaw(floatContainer.element(), 'position').is('fixed')
        if (!isDocked) {
          setAll$1(floatContainer.element(), {
            top: `${absolute(Element$$1.fromDom(editor.getBody())).top() - get$9(floatContainer.element())}px`,
            left: `${absolute(Element$$1.fromDom(editor.getBody())).left()}px`,
          })
        }
        Docking.refresh(floatContainer)
      }
      const show = function () {
        set$2(uiComponents.outerContainer.element(), 'display', 'flex')
        DOM.addClass(editor.getBody(), 'mce-edit-focus')
        setPosition()
        Docking.refresh(floatContainer)
      }
      const hide = function () {
        if (uiComponents.outerContainer) {
          set$2(uiComponents.outerContainer.element(), 'display', 'none')
          DOM.removeClass(editor.getBody(), 'mce-edit-focus')
        }
      }
      const render = function () {
        if (floatContainer) {
          show()
          return
        }
        floatContainer = uiComponents.outerContainer
        attachSystem(body(), uiComponents.mothership)
        attachSystem(body(), uiComponents.uiMothership)
        OuterContainer.setToolbar(uiComponents.outerContainer, identifyButtons(editor, rawUiConfig, { backstage }))
        OuterContainer.setMenubar(uiComponents.outerContainer, identifyMenus(editor, rawUiConfig, backstage))
        setAll$1(floatContainer.element(), {
          position: 'absolute',
          top: `${absolute(Element$$1.fromDom(editor.getBody())).top() - get$9(floatContainer.element())}px`,
          left: `${absolute(Element$$1.fromDom(editor.getBody())).left()}px`,
        })
        setPosition()
        show()
        editor.on('nodeChange ResizeWindow', setPosition)
        editor.on('activate', show)
        editor.on('deactivate', hide)
        editor.nodeChanged()
      }
      editor.on('focus', render)
      editor.on('blur hide', hide)
      return { editorContainer: uiComponents.outerContainer.element().dom() }
    }
    const getBehaviours$2 = function (editor) {
      return [
        Docking.config({
          leftAttr: 'data-dock-left',
          topAttr: 'data-dock-top',
          contextual: {
            lazyContext(_) {
              return Option.from(editor).map((ed) => Element$$1.fromDom(ed.getBody()))
            },
            fadeInClass: 'tox-toolbar-dock-fadein',
            fadeOutClass: 'tox-toolbar-dock-fadeout',
            transitionClass: 'tox-toolbar-dock-transition',
          },
        }),
        Focusing.config({}),
      ]
    }
    const Inline = {
      render: render$1,
      getBehaviours: getBehaviours$2,
    }

    const nu$d = function (x, y) {
      return {
        anchor: 'makeshift',
        x,
        y,
      }
    }
    const transpose$1 = function (pos, dx, dy) {
      return nu$d(pos.x + dx, pos.y + dy)
    }
    const fromPageXY = function (e) {
      return nu$d(e.pageX, e.pageY)
    }
    const fromClientXY = function (e) {
      return nu$d(e.clientX, e.clientY)
    }
    const transposeContentAreaContainer = function (element, pos) {
      const containerPos = global$4.DOM.getPos(element)
      return transpose$1(pos, containerPos.x, containerPos.y)
    }
    const getPointAnchor = function (editor, e) {
      if (e.type === 'contextmenu') {
        if (editor.inline) {
          return fromPageXY(e)
        }
        return transposeContentAreaContainer(editor.getContentAreaContainer(), fromClientXY(e))
      }
      return getSelectionAnchor(editor)
    }
    var getSelectionAnchor = function (editor) {
      return {
        anchor: 'selection',
        root: Element$$1.fromDom(editor.selection.getNode()),
      }
    }
    const getNodeAnchor = function (editor) {
      return {
        anchor: 'node',
        node: Option.some(Element$$1.fromDom(editor.selection.getNode())),
        root: Element$$1.fromDom(editor.getBody()),
      }
    }

    const patchPipeConfig = function (config) {
      return typeof config === 'string' ? config.split(/[ ,]/) : config
    }
    const shouldNeverUseNative = function (editor) {
      return editor.settings.contextmenu_never_use_native || false
    }
    const getMenuItems = function (editor, name, defaultItems) {
      const { contextMenus } = editor.ui.registry.getAll()
      return get(editor.settings, name).map(patchPipeConfig).getOrThunk(() => filter(patchPipeConfig(defaultItems), (item) => has(contextMenus, item)))
    }
    const getContextMenu = function (editor) {
      return getMenuItems(editor, 'contextmenu', 'link image imagetools table spellchecker configurepermanentpen')
    }
    const Settings$1 = {
      shouldNeverUseNative,
      getContextMenu,
    }

    const isSeparator$1 = function (item) {
      return isString(item) ? item === '|' : item.type === 'separator'
    }
    const separator$3 = { type: 'separator' }
    var makeContextItem = function (item) {
      if (isString(item)) {
        return item
      }
      switch (item.type) {
        case 'separator':
          return separator$3
        case 'submenu':
          return {
            type: 'nestedmenuitem',
            text: item.text,
            icon: item.icon,
            getSubmenuItems() {
              const items = item.getSubmenuItems()
              if (isString(items)) {
                return items
              }
              return map(items, makeContextItem)
            },
          }
        default:
          return {
            type: 'menuitem',
            text: item.text,
            icon: item.icon,
            onAction: noarg(item.onAction),
          }
      }
    }
    const addContextMenuGroup = function (xs, groupItems) {
      if (groupItems.length === 0) {
        return xs
      }
      const lastMenuItem = last(xs).filter((item) => !isSeparator$1(item))
      const before = lastMenuItem.fold(() => [], (_) => [separator$3])
      return xs.concat(before).concat(groupItems).concat([separator$3])
    }
    const generateContextMenu = function (contextMenus, menuConfig, selectedElement) {
      const items = foldl(menuConfig, (acc, name) => {
        if (has(contextMenus, name)) {
          const items_1 = contextMenus[name].update(selectedElement)
          if (isString(items_1)) {
            return addContextMenuGroup(acc, items_1.split(' '))
          } if (items_1.length > 0) {
            const allItems = map(items_1, makeContextItem)
            return addContextMenuGroup(acc, allItems)
          }
          return acc
        }
        return acc.concat([name])
      }, [])
      if (items.length > 0 && isSeparator$1(items[items.length - 1])) {
        items.pop()
      }
      return items
    }
    const isNativeOverrideKeyEvent = function (editor, e) {
      return e.ctrlKey && !Settings$1.shouldNeverUseNative(editor)
    }
    const setup$4 = function (editor, lazySink, sharedBackstage) {
      const contextmenu = build$1(InlineView.sketch({
        dom: { tag: 'div' },
        lazySink,
        onEscape() {
          return editor.focus()
        },
      }))
      editor.on('contextmenu', (e) => {
        if (isNativeOverrideKeyEvent(editor, e)) {
          return
        }
        const isTriggeredByKeyboardEvent = e.button !== 2 || e.target === editor.getBody()
        const anchorSpec = isTriggeredByKeyboardEvent ? getNodeAnchor(editor) : getPointAnchor(editor, e)
        const registry = editor.ui.registry.getAll()
        const menuConfig = Settings$1.getContextMenu(editor)
        const selectedElement = isTriggeredByKeyboardEvent ? editor.selection.getStart(true) : e.target
        const items = generateContextMenu(registry.contextMenus, menuConfig, selectedElement)
        if (items.length > 0) {
          e.preventDefault()
          InlineView.showMenuAt(contextmenu, anchorSpec, {
            menu: { markers: markers$1('normal') },
            data: build$2(items, ItemResponse$1.CLOSE_ON_EXECUTE, sharedBackstage.providers),
          })
        }
      })
    }

    const parseToInt = function (val) {
      const re = /^[0-9\.]+(|px)$/i
      if (re.test(`${val}`)) {
        return Option.some(parseInt(val, 10))
      }
      return Option.none()
    }
    const numToPx = function (val) {
      return isNumber(val) ? `${val}px` : val
    }
    const Utils = {
      parseToInt,
      numToPx,
    }

    const initialAttribute = 'data-initial-z-index'
    const resetZIndex = function (blocker) {
      parent(blocker.element()).each((root) => {
        const initZIndex = get$2(root, initialAttribute)
        if (has$1(root, initialAttribute)) {
          set$2(root, 'z-index', initZIndex)
        } else {
          remove$6(root, 'z-index')
        }
        remove$1(root, initialAttribute)
      })
    }
    const changeZIndex = function (blocker) {
      parent(blocker.element()).each((root) => {
        getRaw(root, 'z-index').each((zindex) => {
          set$1(root, initialAttribute, zindex)
        })
        set$2(root, 'z-index', get$5(blocker.element(), 'z-index'))
      })
    }
    const instigate = function (anyComponent, blocker) {
      anyComponent.getSystem().addToGui(blocker)
      changeZIndex(blocker)
    }
    const discard = function (blocker) {
      resetZIndex(blocker)
      blocker.getSystem().removeFromGui(blocker)
    }

    const get$f = function (component, snapsInfo) {
      const element = component.element()
      const x = parseInt(get$2(element, snapsInfo.leftAttr), 10)
      const y = parseInt(get$2(element, snapsInfo.topAttr), 10)
      return isNaN(x) || isNaN(y) ? Option.none() : Option.some(Position(x, y))
    }
    const set$9 = function (component, snapsInfo, pt) {
      const element = component.element()
      set$1(element, snapsInfo.leftAttr, `${pt.left()}px`)
      set$1(element, snapsInfo.topAttr, `${pt.top()}px`)
    }
    const clear$1 = function (component, snapsInfo) {
      const element = component.element()
      remove$1(element, snapsInfo.leftAttr)
      remove$1(element, snapsInfo.topAttr)
    }

    const getCoords = function (component, snapInfo, coord, delta) {
      return get$f(component, snapInfo).fold(() => coord, (fixed) => fixed$1(fixed.left() + delta.left(), fixed.top() + delta.top()))
    }
    const moveOrSnap = function (component, snapInfo, coord, delta, scroll, origin) {
      const newCoord = getCoords(component, snapInfo, coord, delta)
      const snap = findSnap(component, snapInfo, newCoord, scroll, origin)
      const fixedCoord = asFixed(newCoord, scroll, origin)
      set$9(component, snapInfo, fixedCoord)
      return snap.fold(() => ({
        coord: fixed$1(fixedCoord.left(), fixedCoord.top()),
        extra: Option.none(),
      }), (spanned) => ({
        coord: spanned.output(),
        extra: spanned.extra(),
      }))
    }
    const stopDrag = function (component, snapInfo) {
      clear$1(component, snapInfo)
    }
    var findSnap = function (component, snapInfo, newCoord, scroll, origin) {
      const snaps = snapInfo.getSnapPoints(component)
      return findMap(snaps, (snap) => {
        const sensor = snap.sensor()
        const inRange = withinRange(newCoord, sensor, snap.range().left(), snap.range().top(), scroll, origin)
        return inRange ? Option.some({
          output: constant(absorb(snap.output(), newCoord, scroll, origin)),
          extra: snap.extra,
        }) : Option.none()
      })
    }

    const getCurrentCoord = function (target) {
      return getRaw(target, 'left').bind((left) => getRaw(target, 'top').bind((top) => getRaw(target, 'position').map((position) => {
        const nu = position === 'fixed' ? fixed$1 : offset
        return nu(parseInt(left, 10), parseInt(top, 10))
      }))).getOrThunk(() => {
        const location = absolute(target)
        return absolute$3(location.left(), location.top())
      })
    }
    const calcNewCoord = function (component, optSnaps, currentCoord, scroll, origin, delta) {
      return optSnaps.fold(() => {
        const translated = translate$2(currentCoord, delta.left(), delta.top())
        const fixedCoord = asFixed(translated, scroll, origin)
        return fixed$1(fixedCoord.left(), fixedCoord.top())
      }, (snapInfo) => {
        const snapping = moveOrSnap(component, snapInfo, currentCoord, delta, scroll, origin)
        snapping.extra.each((extra) => {
          snapInfo.onSensor(component, extra)
        })
        return snapping.coord
      })
    }
    const dragBy = function (component, dragConfig, delta) {
      const target = dragConfig.getTarget(component.element())
      if (dragConfig.repositionTarget) {
        const doc = owner(component.element())
        const scroll = get$7(doc)
        const origin = getOrigin(target, scroll)
        const currentCoord = getCurrentCoord(target)
        const newCoord = calcNewCoord(component, dragConfig.snaps, currentCoord, scroll, origin, delta)
        const styles = toStyles(newCoord, scroll, origin)
        setAll$1(target, styles)
      }
      dragConfig.onDrag(component, target, delta)
    }

    const defaultLazyViewport$1 = function () {
      const scroll$$1 = get$7()
      return {
        x: scroll$$1.left,
        y: scroll$$1.top,
        width: constant(window.innerWidth),
        height: constant(window.innerHeight),
        bottom: constant(scroll$$1.top() + window.innerHeight),
        right: constant(scroll$$1.left() + window.innerWidth),
      }
    }
    const SnapSchema = optionObjOf('snaps', [
      strict$1('getSnapPoints'),
      onHandler('onSensor'),
      strict$1('leftAttr'),
      strict$1('topAttr'),
      defaulted$1('lazyViewport', defaultLazyViewport$1),
    ])

    const init$b = function (dragApi) {
      return derive([
        run(mousedown(), dragApi.forceDrop),
        run(mouseup(), dragApi.drop),
        run(mousemove(), (comp, simulatedEvent) => {
          dragApi.move(simulatedEvent.event())
        }),
        run(mouseout(), dragApi.delayDrop),
      ])
    }

    const getData$1 = function (event) {
      return Option.from(Position(event.x(), event.y()))
    }
    const getDelta$1 = function (old, nu) {
      return Position(nu.left() - old.left(), nu.top() - old.top())
    }

    const MouseData = /* #__PURE__ */Object.freeze({
      getData: getData$1,
      getDelta: getDelta$1,
    })

    const handlers = function (dragConfig, dragState) {
      return derive([run(mousedown(), (component, simulatedEvent) => {
        const raw = simulatedEvent.event().raw()
        if (raw.button !== 0) {
          return
        }
        simulatedEvent.stop()
        const dragApi = {
          drop() {
            stop()
          },
          delayDrop() {
            delayDrop.schedule()
          },
          forceDrop() {
            stop()
          },
          move(event) {
            delayDrop.cancel()
            const delta = dragState.update(MouseData, event)
            delta.each((dlt) => {
              dragBy(component, dragConfig, dlt)
            })
          },
        }
        const blocker = component.getSystem().build(Container.sketch({
          dom: {
            styles: {
              left: '0px',
              top: '0px',
              width: '100%',
              height: '100%',
              position: 'fixed',
              'z-index': '1000000000000000',
            },
            classes: [dragConfig.blockerClass],
          },
          events: init$b(dragApi),
        }))
        var stop = function () {
          discard(blocker)
          dragConfig.snaps.each((snapInfo) => {
            stopDrag(component, snapInfo)
          })
          const target = dragConfig.getTarget(component.element())
          dragConfig.onDrop(component, target)
        }
        var delayDrop = DelayedFunction(stop, 200)
        const start = function () {
          dragState.reset()
          instigate(component, blocker)
        }
        start()
      })])
    }
    const schema$n = [
      defaulted$1('useFixed', false),
      strict$1('blockerClass'),
      defaulted$1('getTarget', identity),
      defaulted$1('onDrag', noop),
      defaulted$1('repositionTarget', true),
      onHandler('onDrop'),
      SnapSchema,
      output$1('dragger', { handlers }),
    ]

    const getDataFrom = function (touches) {
      const touch = touches[0]
      return Option.some(Position(touch.clientX, touch.clientY))
    }
    const getData$2 = function (event) {
      const raw = event.raw()
      const { touches } = raw
      return touches.length === 1 ? getDataFrom(touches) : Option.none()
    }
    const getDelta$2 = function (old, nu) {
      return Position(nu.left() - old.left(), nu.top() - old.top())
    }

    const TouchData = /* #__PURE__ */Object.freeze({
      getData: getData$2,
      getDelta: getDelta$2,
    })

    const handlers$1 = function (dragConfig, dragState) {
      return derive([
        stopper(touchstart()),
        run(touchmove(), (component, simulatedEvent) => {
          simulatedEvent.stop()
          const delta = dragState.update(TouchData, simulatedEvent.event())
          delta.each((dlt) => {
            dragBy(component, dragConfig, dlt)
          })
        }),
        run(touchend(), (component, simulatedEvent) => {
          dragConfig.snaps.each((snapInfo) => {
            stopDrag(component, snapInfo)
          })
          const target = dragConfig.getTarget(component.element())
          dragState.reset()
          dragConfig.onDrop(component, target)
        }),
      ])
    }
    const schema$o = [
      defaulted$1('useFixed', false),
      defaulted$1('getTarget', identity),
      defaulted$1('onDrag', noop),
      defaulted$1('repositionTarget', true),
      defaulted$1('onDrop', noop),
      SnapSchema,
      output$1('dragger', { handlers: handlers$1 }),
    ]

    const mouse = schema$n
    const touch = schema$o

    const DraggingBranches = /* #__PURE__ */Object.freeze({
      mouse,
      touch,
    })

    const init$c = function () {
      let previous = Option.none()
      const reset = function () {
        previous = Option.none()
      }
      const calculateDelta = function (mode, nu) {
        const result = previous.map((old) => mode.getDelta(old, nu))
        previous = Option.some(nu)
        return result
      }
      const update = function (mode, dragEvent) {
        return mode.getData(dragEvent).bind((nuData) => calculateDelta(mode, nuData))
      }
      const readState = constant({})
      return nu$5({
        readState,
        reset,
        update,
      })
    }

    const DragState = /* #__PURE__ */Object.freeze({
      init: init$c,
    })

    const Dragging = createModes$1({
      branchKey: 'mode',
      branches: DraggingBranches,
      name: 'dragging',
      active: {
        events(dragConfig, dragState) {
          const { dragger } = dragConfig
          return dragger.handlers(dragConfig, dragState)
        },
      },
      extra: {
        snap: MixedBag([
          'sensor',
          'range',
          'output',
        ], ['extra']),
      },
      state: DragState,
    })

    let ResizeTypes;
    (function (ResizeTypes) {
      ResizeTypes[ResizeTypes.None = 0] = 'None'
      ResizeTypes[ResizeTypes.Both = 1] = 'Both'
      ResizeTypes[ResizeTypes.Vertical = 2] = 'Vertical'
    }(ResizeTypes || (ResizeTypes = {})))
    const calcCappedSize = function (originalSize, delta, minSize, maxSize) {
      const newSize = originalSize + delta
      const minOverride = minSize.filter((min) => newSize < min)
      const maxOverride = maxSize.filter((max) => newSize > max)
      return minOverride.or(maxOverride).getOr(newSize)
    }
    const getDimensions = function (editor, deltas, resizeType, originalHeight, originalWidth) {
      const dimensions = {}
      dimensions.height = calcCappedSize(originalHeight, deltas.top(), getMinHeightSetting(editor), getMaxHeightSetting(editor))
      if (resizeType === ResizeTypes.Both) {
        dimensions.width = calcCappedSize(originalWidth, deltas.left(), getMinWidthSetting(editor), getMaxWidthSetting(editor))
      }
      return dimensions
    }
    const resize$3 = function (editor, deltas, resizeType) {
      const container = Element$$1.fromDom(editor.getContainer())
      const dimensions = getDimensions(editor, deltas, resizeType, editor.getContainer().scrollHeight, get$8(container))
      each$1(dimensions, (val, dim) => set$2(container, dim, `${val}px`))
      Events$1.fireResizeEditor(editor)
    }

    const isHidden$1 = function (elm) {
      if (elm.nodeType === 1) {
        if (elm.nodeName === 'BR' || !!elm.getAttribute('data-mce-bogus')) {
          return true
        }
        if (elm.getAttribute('data-mce-type') === 'bookmark') {
          return true
        }
      }
      return false
    }
    const renderElementPath = function (editor, settings) {
      if (!settings.delimiter) {
        settings.delimiter = '\xBB'
      }
      const getDataPath = function (data) {
        const parts = data || []
        const newPathElements = map(parts, (part, index) => Button.sketch({
          dom: {
            tag: 'div',
            classes: ['tox-statusbar__path-item'],
            attributes: {
              role: 'button',
              'data-index': index,
              'tab-index': -1,
              'aria-level': index + 1,
            },
            innerHtml: part.name,
          },
          action(btn) {
            editor.focus()
            editor.selection.select(part.element)
            editor.nodeChanged()
          },
        }))
        const divider = {
          dom: {
            tag: 'div',
            classes: ['tox-statusbar__path-divider'],
            attributes: { 'aria-hidden': true },
            innerHtml: ` ${settings.delimiter} `,
          },
        }
        return foldl(newPathElements.slice(1), (acc, element) => {
          const newAcc = acc
          newAcc.push(divider)
          newAcc.push(element)
          return newAcc
        }, [newPathElements[0]])
      }
      const updatePath = function (parents) {
        const newPath = []
        let i = parents.length
        while (i-- > 0) {
          const parent = parents[i]
          if (parent.nodeType === 1 && !isHidden$1(parent)) {
            const args = editor.fire('ResolveName', {
              name: parent.nodeName.toLowerCase(),
              target: parent,
            })
            if (!args.isDefaultPrevented()) {
              newPath.push({
                name: args.name,
                element: parent,
              })
            }
            if (args.isPropagationStopped()) {
              break
            }
          }
        }
        return newPath
      }
      return {
        dom: {
          tag: 'div',
          classes: ['tox-statusbar__path'],
        },
        behaviours: derive$1([
          Keying.config({
            mode: 'flow',
            selector: 'div[role=button]',
          }),
          Tabstopping.config({}),
          Replacing.config({}),
          config('elementPathEvents', [runOnAttached((comp, e) => {
            editor.shortcuts.add('alt+F11', 'focus statusbar elementpath', () => Keying.focusIn(comp))
            editor.on('nodeChange', (e) => {
              const newPath = updatePath(e.parents)
              if (newPath.length > 0) {
                Replacing.set(comp, getDataPath(newPath))
              }
            })
          })]),
        ]),
        components: [],
      }
    }
    const ElementPath = { renderElementPath }

    const renderWordCount = function (editor, providersBackstage) {
      const replaceCountText = function (comp, count, mode) {
        return Replacing.set(comp, [text(providersBackstage.translate([
          `{0} ${mode}`,
          count[mode],
        ]))])
      }
      return {
        dom: {
          tag: 'span',
          classes: ['tox-statusbar__wordcount'],
        },
        components: [],
        behaviours: derive$1([
          Replacing.config({}),
          Representing.config({
            store: {
              mode: 'memory',
              initialValue: {
                mode: 'words',
                count: {
                  words: 0,
                  characters: 0,
                },
              },
            },
          }),
          config('wordcount-events', [
            run(click(), (comp) => {
              const currentVal = Representing.getValue(comp)
              const newMode = currentVal.mode === 'words' ? 'characters' : 'words'
              Representing.setValue(comp, {
                mode: newMode,
                count: currentVal.count,
              })
              replaceCountText(comp, currentVal.count, newMode)
            }),
            runOnAttached((comp) => {
              editor.on('wordCountUpdate', (e) => {
                const { mode } = Representing.getValue(comp)
                Representing.setValue(comp, {
                  mode,
                  count: e.wordCount,
                })
                replaceCountText(comp, e.wordCount, mode)
              })
            }),
          ]),
        ]),
      }
    }

    const renderStatusbar = function (editor, providersBackstage) {
      const renderResizeHandlerIcon = function (resizeType) {
        return {
          dom: {
            tag: 'div',
            classes: ['tox-statusbar__resize-handle'],
            attributes: { title: providersBackstage.translate('Resize') },
            innerHtml: get$e('resize-handle', providersBackstage.icons),
          },
          behaviours: derive$1([Dragging.config({
            mode: 'mouse',
            repositionTarget: false,
            onDrag(comp, target, delta) {
              resize$3(editor, delta, resizeType)
            },
            blockerClass: 'tox-blocker',
          })]),
        }
      }
      const renderBranding = function () {
        const linkHtml = '<a href="https://www.tiny.cloud/?utm_campaign=editor_referral&amp;utm_medium=poweredby&amp;utm_source=tinymce&amp;utm_content=v5" rel="noopener" target="_blank" tabindex="-1">Tiny</a>'
        const html = global$2.translate([
          'Powered by {0}',
          linkHtml,
        ])
        return {
          dom: {
            tag: 'span',
            classes: ['tox-statusbar__branding'],
            innerHtml: html,
          },
        }
      }
      const getResizeType = function (editor) {
        const fallback = !contains$1(editor.settings.plugins, 'autoresize')
        const resize = editor.getParam('resize', fallback)
        if (resize === false) {
          return ResizeTypes.None
        } if (resize === 'both') {
          return ResizeTypes.Both
        }
        return ResizeTypes.Vertical
      }
      const getTextComponents = function () {
        const components = []
        if (editor.getParam('elementpath', true, 'boolean')) {
          components.push(ElementPath.renderElementPath(editor, {}))
        }
        if (contains$1(editor.settings.plugins, 'wordcount')) {
          components.push(renderWordCount(editor, providersBackstage))
        }
        if (editor.getParam('branding', true, 'boolean')) {
          components.push(renderBranding())
        }
        if (components.length > 0) {
          return [{
            dom: {
              tag: 'div',
              classes: ['tox-statusbar__text-container'],
            },
            components,
          }]
        }
        return []
      }
      const getComponents = function () {
        const components = getTextComponents()
        const resizeType = getResizeType(editor)
        if (resizeType !== ResizeTypes.None) {
          components.push(renderResizeHandlerIcon(resizeType))
        }
        return components
      }
      return {
        dom: {
          tag: 'div',
          classes: ['tox-statusbar'],
        },
        components: getComponents(),
      }
    }

    const setup$5 = function (editor) {
      const isInline = editor.getParam('inline', false, 'boolean')
      const mode = isInline ? Inline : Iframe
      let lazyOuterContainer = Option.none()
      const dirAttributes = global$2.isRtl() ? { attributes: { dir: 'rtl' } } : {}
      const sink = build$1({
        dom: __assign({
          tag: 'div',
          classes: [
            'tox',
            'tox-silver-sink',
            'tox-tinymce-aux',
          ],
        }, dirAttributes),
        behaviours: derive$1([Positioning.config({ useFixed: false })]),
      })
      const memAnchorBar = record({
        dom: {
          tag: 'div',
          classes: ['tox-anchorbar'],
        },
      })
      const lazyAnchorBar = function () {
        return lazyOuterContainer.bind((container) => memAnchorBar.getOpt(container)).getOrDie('Could not find a toolbar element')
      }
      const backstage = init$8(sink, editor, lazyAnchorBar)
      const lazySink = function () {
        return Result.value(sink)
      }
      const partMenubar = OuterContainer.parts().menubar({
        dom: {
          tag: 'div',
          classes: ['tox-menubar'],
        },
        getSink: lazySink,
        providers: backstage.shared.providers,
        onEscape() {
          editor.focus()
        },
      })
      const partToolbar = OuterContainer.parts().toolbar({
        dom: {
          tag: 'div',
          classes: ['tox-toolbar'],
        },
        onEscape() {
          editor.focus()
        },
      })
      const partSocket = OuterContainer.parts().socket({
        dom: {
          tag: 'div',
          classes: ['tox-edit-area'],
        },
      })
      const partSidebar = OuterContainer.parts().sidebar({
        dom: {
          tag: 'div',
          classes: ['tox-sidebar'],
        },
      })
      const statusbar = editor.getParam('statusbar', true, 'boolean') && !isInline ? Option.some(renderStatusbar(editor, backstage.shared.providers)) : Option.none()
      const socketSidebarContainer = {
        dom: {
          tag: 'div',
          classes: ['tox-sidebar-wrap'],
        },
        components: [
          partSocket,
          partSidebar,
        ],
      }
      const hasToolbar = isToolbarEnabled(editor) || getMultipleToolbarsSetting(editor).isSome()
      const hasMenubar = isMenubarEnabled(editor)
      const editorComponents = flatten([
        hasMenubar ? [partMenubar] : [],
        hasToolbar ? [partToolbar] : [],
        [memAnchorBar.asSpec()],
        isInline ? [] : [socketSidebarContainer],
      ])
      const editorContainer = {
        dom: {
          tag: 'div',
          classes: ['tox-editor-container'],
        },
        components: editorComponents,
      }
      const containerComponents = flatten([
        [editorContainer],
        isInline ? [] : statusbar.toArray(),
      ])
      const attributes = __assign({ role: 'application' }, global$2.isRtl() ? { dir: 'rtl' } : {})
      const outerContainer = build$1(OuterContainer.sketch({
        dom: {
          tag: 'div',
          classes: [
            'tox',
            'tox-tinymce',
          ].concat(isInline ? ['tox-tinymce-inline'] : []),
          styles: { visibility: 'hidden' },
          attributes,
        },
        components: containerComponents,
        behaviours: derive$1(mode.getBehaviours(editor).concat([Keying.config({
          mode: 'cyclic',
          selector: '.tox-menubar, .tox-toolbar, .tox-sidebar--sliding-open, .tox-statusbar__path',
        })])),
      }))
      lazyOuterContainer = Option.some(outerContainer)
      editor.shortcuts.add('alt+F9', 'focus menubar', () => {
        OuterContainer.focusMenubar(outerContainer)
      })
      editor.shortcuts.add('alt+F10', 'focus toolbar', () => {
        OuterContainer.focusToolbar(outerContainer)
      })
      const mothership = takeover(outerContainer)
      const uiMothership = takeover(sink)
      Events.setup(editor, mothership, uiMothership)
      const getUi = function () {
        const channels = {
          broadcastAll: uiMothership.broadcast,
          broadcastOn: uiMothership.broadcastOn,
          register() {
          },
        }
        return { channels }
      }
      const setEditorSize = function (elm) {
        const { DOM } = global$4
        const baseWidth = editor.getParam('width', DOM.getStyle(elm, 'width'))
        const baseHeight = getHeightSetting(editor)
        const minWidth = getMinWidthSetting(editor)
        const minHeight = getMinHeightSetting(editor)
        const parsedWidth = Utils.parseToInt(baseWidth).bind((w) => Utils.numToPx(minWidth.map((mw) => Math.max(w, mw)))).getOr(Utils.numToPx(baseWidth))
        const parsedHeight = Utils.parseToInt(baseHeight).bind((h) => minHeight.map((mh) => Math.max(h, mh))).getOr(baseHeight)
        const stringWidth = Utils.numToPx(parsedWidth)
        if (isValidValue('div', 'width', stringWidth)) {
          set$2(outerContainer.element(), 'width', stringWidth)
        }
        if (!editor.inline) {
          const stringHeight = Utils.numToPx(parsedHeight)
          if (isValidValue('div', 'height', stringHeight)) {
            set$2(outerContainer.element(), 'height', stringHeight)
          } else {
            set$2(outerContainer.element(), 'height', '200px')
          }
        }
        return parsedHeight
      }
      const renderUI = function () {
        setup$4(editor, lazySink, backstage.shared)
        const _a = editor.ui.registry.getAll(); const { buttons } = _a; const { menuItems } = _a; const { contextToolbars } = _a
        const rawUiConfig = {
          menuItems,
          buttons,
          menus: !editor.settings.menu ? {} : map$1(editor.settings.menu, (menu) => merge(menu, { items: menu.items })),
          menubar: editor.settings.menubar,
          toolbar: getMultipleToolbarsSetting(editor).getOr(editor.getParam('toolbar', true)),
          sidebar: editor.sidebars ? editor.sidebars : [],
        }
        ContextToolbar.register(editor, contextToolbars, sink, { backstage })
        const elm = editor.getElement()
        const height = setEditorSize(elm)
        const uiComponents = {
          mothership,
          uiMothership,
          outerContainer,
        }
        const args = {
          targetNode: elm,
          height,
        }
        return mode.render(editor, uiComponents, rawUiConfig, backstage, args)
      }
      return {
        mothership,
        uiMothership,
        backstage,
        renderUI,
        getUi,
      }
    }
    const Render = { setup: setup$5 }

    const toggleFormat = function (editor, fmt) {
      return function () {
        editor.execCommand('mceToggleFormat', false, fmt)
      }
    }
    const register$5 = function (editor) {
      const defaultAlignIcon = 'align-left'
      const alignMenuItems = [
        {
          type: 'menuitem',
          text: 'Left',
          icon: 'align-left',
          onAction: toggleFormat(editor, 'alignleft'),
        },
        {
          type: 'menuitem',
          text: 'Center',
          icon: 'align-center',
          onAction: toggleFormat(editor, 'aligncenter'),
        },
        {
          type: 'menuitem',
          text: 'Right',
          icon: 'align-right',
          onAction: toggleFormat(editor, 'alignright'),
        },
        {
          type: 'menuitem',
          text: 'Justify',
          icon: 'align-justify',
          onAction: toggleFormat(editor, 'alignjustify'),
        },
      ]
      editor.ui.registry.addNestedMenuItem('align', {
        text: 'Align',
        icon: defaultAlignIcon,
        getSubmenuItems() {
          return alignMenuItems
        },
      })
      const alignToolbarButtons = [
        {
          name: 'alignleft',
          text: 'Align left',
          cmd: 'JustifyLeft',
          icon: 'align-left',
        },
        {
          name: 'aligncenter',
          text: 'Align center',
          cmd: 'JustifyCenter',
          icon: 'align-center',
        },
        {
          name: 'alignright',
          text: 'Align right',
          cmd: 'JustifyRight',
          icon: 'align-right',
        },
        {
          name: 'alignjustify',
          text: 'Justify',
          cmd: 'JustifyFull',
          icon: 'align-justify',
        },
      ]
      const onSetup = function (item) {
        return function (api) {
          if (editor.formatter) {
            editor.formatter.formatChanged(item.name, api.setActive)
          } else {
            editor.on('init', () => {
              editor.formatter.formatChanged(item.name, api.setActive)
            })
          }
          return function () {
          }
        }
      }
      global$a.each(alignToolbarButtons, (item) => {
        editor.ui.registry.addToggleButton(item.name, {
          tooltip: item.text,
          onAction() {
            return editor.execCommand(item.cmd)
          },
          icon: item.icon,
          onSetup: onSetup(item),
        })
      })
      const alignNoneToolbarButton = {
        name: 'alignnone',
        text: 'No alignment',
        cmd: 'JustifyNone',
        icon: 'align-justify',
      }
      editor.ui.registry.addButton(alignNoneToolbarButton.name, {
        tooltip: alignNoneToolbarButton.text,
        onAction() {
          return editor.execCommand(alignNoneToolbarButton.cmd)
        },
        icon: alignNoneToolbarButton.icon,
        onSetup: onSetup(alignNoneToolbarButton),
      })
    }
    const Align = { register: register$5 }

    const toggleFormat$1 = function (editor, fmt) {
      return function () {
        editor.execCommand('mceToggleFormat', false, fmt)
      }
    }
    const addFormatChangedListener = function (editor, name, changed) {
      const handler = function (state) {
        changed(state, name)
      }
      if (editor.formatter) {
        editor.formatter.formatChanged(name, handler)
      } else {
        editor.on('init', () => {
          editor.formatter.formatChanged(name, handler)
        })
      }
    }
    const postRenderFormatToggle = function (editor, name) {
      return function (api) {
        addFormatChangedListener(editor, name, (state) => {
          api.setActive(state)
        })
        return function () {
        }
      }
    }
    const registerFormatButtons = function (editor) {
      global$a.each([
        {
          name: 'bold',
          text: 'Bold',
          icon: 'bold',
        },
        {
          name: 'italic',
          text: 'Italic',
          icon: 'italic',
        },
        {
          name: 'underline',
          text: 'Underline',
          icon: 'underline',
        },
        {
          name: 'strikethrough',
          text: 'Strikethrough',
          icon: 'strike-through',
        },
        {
          name: 'subscript',
          text: 'Subscript',
          icon: 'subscript',
        },
        {
          name: 'superscript',
          text: 'Superscript',
          icon: 'superscript',
        },
      ], (btn) => {
        editor.ui.registry.addToggleButton(btn.name, {
          tooltip: btn.text,
          icon: btn.icon,
          onSetup: postRenderFormatToggle(editor, btn.name),
          onAction: toggleFormat$1(editor, btn.name),
        })
      })
    }
    const registerCommandButtons = function (editor) {
      global$a.each([
        {
          name: 'cut',
          text: 'Cut',
          action: 'Cut',
          icon: 'cut',
        },
        {
          name: 'copy',
          text: 'Copy',
          action: 'Copy',
          icon: 'copy',
        },
        {
          name: 'paste',
          text: 'Paste',
          action: 'Paste',
          icon: 'paste',
        },
        {
          name: 'help',
          text: 'Help',
          action: 'mceHelp',
          icon: 'help',
        },
        {
          name: 'selectall',
          text: 'Select all',
          action: 'SelectAll',
          icon: 'select-all',
        },
        {
          name: 'newdocument',
          text: 'New document',
          action: 'mceNewDocument',
          icon: 'new-document',
        },
        {
          name: 'removeformat',
          text: 'Clear formatting',
          action: 'RemoveFormat',
          icon: 'remove-formatting',
        },
        {
          name: 'remove',
          text: 'Remove',
          action: 'Delete',
          icon: 'remove',
        },
      ], (btn) => {
        editor.ui.registry.addButton(btn.name, {
          tooltip: btn.text,
          icon: btn.icon,
          onAction() {
            return editor.execCommand(btn.action)
          },
        })
      })
    }
    const registerCommandToggleButtons = function (editor) {
      global$a.each([{
        name: 'blockquote',
        text: 'Blockquote',
        action: 'mceBlockQuote',
        icon: 'quote',
      }], (btn) => {
        editor.ui.registry.addToggleButton(btn.name, {
          tooltip: btn.text,
          icon: btn.icon,
          onAction() {
            return editor.execCommand(btn.action)
          },
          onSetup: postRenderFormatToggle(editor, btn.name),
        })
      })
    }
    const registerButtons = function (editor) {
      registerFormatButtons(editor)
      registerCommandButtons(editor)
      registerCommandToggleButtons(editor)
    }
    const registerMenuItems = function (editor) {
      global$a.each([
        {
          name: 'bold',
          text: 'Bold',
          action: 'Bold',
          icon: 'bold',
          shortcut: 'Meta+B',
        },
        {
          name: 'italic',
          text: 'Italic',
          action: 'Italic',
          icon: 'italic',
          shortcut: 'Meta+I',
        },
        {
          name: 'underline',
          text: 'Underline',
          action: 'Underline',
          icon: 'underline',
          shortcut: 'Meta+U',
        },
        {
          name: 'strikethrough',
          text: 'Strikethrough',
          action: 'Strikethrough',
          icon: 'strike-through',
          shortcut: '',
        },
        {
          name: 'subscript',
          text: 'Subscript',
          action: 'Subscript',
          icon: 'subscript',
          shortcut: '',
        },
        {
          name: 'superscript',
          text: 'Superscript',
          action: 'Superscript',
          icon: 'superscript',
          shortcut: '',
        },
        {
          name: 'removeformat',
          text: 'Clear formatting',
          action: 'RemoveFormat',
          icon: 'remove-formatting',
          shortcut: '',
        },
        {
          name: 'newdocument',
          text: 'New document',
          action: 'mceNewDocument',
          icon: 'new-document',
          shortcut: '',
        },
        {
          name: 'cut',
          text: 'Cut',
          action: 'Cut',
          icon: 'cut',
          shortcut: 'Meta+X',
        },
        {
          name: 'copy',
          text: 'Copy',
          action: 'Copy',
          icon: 'copy',
          shortcut: 'Meta+C',
        },
        {
          name: 'paste',
          text: 'Paste',
          action: 'Paste',
          icon: 'paste',
          shortcut: 'Meta+V',
        },
        {
          name: 'selectall',
          text: 'Select all',
          action: 'SelectAll',
          icon: 'select-all',
          shortcut: 'Meta+A',
        },
      ], (btn) => {
        editor.ui.registry.addMenuItem(btn.name, {
          text: btn.text,
          icon: btn.icon,
          shortcut: btn.shortcut,
          onAction() {
            return editor.execCommand(btn.action)
          },
        })
      })
      editor.ui.registry.addMenuItem('codeformat', {
        text: 'Code',
        icon: 'sourcecode',
        onAction: toggleFormat$1(editor, 'code'),
      })
    }
    const register$6 = function (editor) {
      registerButtons(editor)
      registerMenuItems(editor)
    }
    const SimpleControls = { register: register$6 }

    const toggleUndoRedoState = function (api, editor, type) {
      const checkState = function () {
        return editor.undoManager ? editor.undoManager[type]() : false
      }
      const onUndoStateChange = function () {
        api.setDisabled(editor.readonly || !checkState())
      }
      api.setDisabled(!checkState())
      editor.on('Undo Redo AddUndo TypingUndo ClearUndos SwitchMode', onUndoStateChange)
      return function () {
        return editor.off('Undo Redo AddUndo TypingUndo ClearUndos SwitchMode', onUndoStateChange)
      }
    }
    const registerMenuItems$1 = function (editor) {
      editor.ui.registry.addMenuItem('undo', {
        text: 'Undo',
        icon: 'undo',
        shortcut: 'Meta+Z',
        onSetup(api) {
          return toggleUndoRedoState(api, editor, 'hasUndo')
        },
        onAction() {
          return editor.execCommand('undo')
        },
      })
      editor.ui.registry.addMenuItem('redo', {
        text: 'Redo',
        icon: 'redo',
        shortcut: 'Meta+Y',
        onSetup(api) {
          return toggleUndoRedoState(api, editor, 'hasRedo')
        },
        onAction() {
          return editor.execCommand('redo')
        },
      })
    }
    const registerButtons$1 = function (editor) {
      editor.ui.registry.addButton('undo', {
        tooltip: 'Undo',
        icon: 'undo',
        onSetup(api) {
          return toggleUndoRedoState(api, editor, 'hasUndo')
        },
        onAction() {
          return editor.execCommand('undo')
        },
      })
      editor.ui.registry.addButton('redo', {
        tooltip: 'Redo',
        icon: 'redo',
        onSetup(api) {
          return toggleUndoRedoState(api, editor, 'hasRedo')
        },
        onAction() {
          return editor.execCommand('redo')
        },
      })
    }
    const register$7 = function (editor) {
      registerMenuItems$1(editor)
      registerButtons$1(editor)
    }
    const UndoRedo = { register: register$7 }

    const toggleVisualAidState = function (api, editor) {
      api.setActive(editor.hasVisual)
      const onVisualAid = function (e) {
        api.setActive(e.hasVisual)
      }
      editor.on('VisualAid', onVisualAid)
      return function () {
        return editor.off('VisualAid', onVisualAid)
      }
    }
    const registerMenuItems$2 = function (editor) {
      editor.ui.registry.addToggleMenuItem('visualaid', {
        text: 'Visual aids',
        onSetup(api) {
          return toggleVisualAidState(api, editor)
        },
        onAction() {
          editor.execCommand('mceToggleVisualAid')
        },
      })
    }
    const registerToolbarButton = function (editor) {
      editor.ui.registry.addButton('visualaid', {
        tooltip: 'Visual aids',
        text: 'Visual aids',
        onAction() {
          return editor.execCommand('mceToggleVisualAid')
        },
      })
    }
    const register$8 = function (editor) {
      registerToolbarButton(editor)
      registerMenuItems$2(editor)
    }
    const VisualAid = { register: register$8 }

    const toggleOutdentState = function (api, editor) {
      const onNodeChange = function () {
        api.setDisabled(!editor.queryCommandState('outdent'))
      }
      editor.on('NodeChange', onNodeChange)
      return function () {
        return editor.off('NodeChange', onNodeChange)
      }
    }
    const registerButtons$2 = function (editor) {
      editor.ui.registry.addButton('outdent', {
        tooltip: 'Decrease indent',
        icon: 'outdent',
        onSetup(api) {
          return toggleOutdentState(api, editor)
        },
        onAction() {
          return editor.execCommand('outdent')
        },
      })
      editor.ui.registry.addButton('indent', {
        tooltip: 'Increase indent',
        icon: 'indent',
        onAction() {
          return editor.execCommand('indent')
        },
      })
    }
    const register$9 = function (editor) {
      registerButtons$2(editor)
    }
    const IndentOutdent = { register: register$9 }

    const setup$6 = function (editor) {
      Align.register(editor)
      SimpleControls.register(editor)
      UndoRedo.register(editor)
      ColorSwatch.register(editor)
      VisualAid.register(editor)
      IndentOutdent.register(editor)
    }
    const FormatControls = { setup: setup$6 }

    const AriaLabel = {
      labelledBy(labelledElement, labelElement) {
        const labelId = Option.from(get$2(labelledElement, 'id')).fold(() => {
          const id = generate$1('dialog-label')
          set$1(labelElement, 'id', id)
          return id
        }, identity)
        set$1(labelledElement, 'aria-labelledby', labelId)
      },
    }

    const schema$p = constant([
      strict$1('lazySink'),
      option('dragBlockClass'),
      defaulted$1('useTabstopAt', constant(true)),
      defaulted$1('eventOrder', {}),
      field$1('modalBehaviours', [Keying]),
      onKeyboardHandler('onExecute'),
      onStrictKeyboardHandler('onEscape'),
    ])
    const basic$1 = { sketch: identity }
    const parts$b = constant([
      optional({
        name: 'draghandle',
        overrides(detail, spec) {
          return {
            behaviours: derive$1([Dragging.config({
              mode: 'mouse',
              getTarget(handle) {
                return ancestor$2(handle, '[role="dialog"]').getOr(handle)
              },
              blockerClass: detail.dragBlockClass.getOrDie(new Error(`The drag blocker class was not specified for a dialog with a drag handle: \n${JSON$1.stringify(spec, null, 2)}`).message),
            })]),
          }
        },
      }),
      required({
        schema: [strict$1('dom')],
        name: 'title',
      }),
      required({
        factory: basic$1,
        schema: [strict$1('dom')],
        name: 'close',
      }),
      required({
        factory: basic$1,
        schema: [strict$1('dom')],
        name: 'body',
      }),
      required({
        factory: basic$1,
        schema: [strict$1('dom')],
        name: 'footer',
      }),
      external$1({
        factory: {
          sketch(spec, detail) {
            return __assign({}, spec, {
              dom: detail.dom,
              components: detail.components,
            })
          },
        },
        schema: [
          defaulted$1('dom', {
            tag: 'div',
            styles: {
              position: 'fixed',
              left: '0px',
              top: '0px',
              right: '0px',
              bottom: '0px',
            },
          }),
          defaulted$1('components', []),
        ],
        name: 'blocker',
      }),
    ])

    const factory$e = function (detail, components$$1, spec, externals) {
      const dialogBusyEvent = generate$1('alloy.dialog.busy')
      const dialogIdleEvent = generate$1('alloy.dialog.idle')
      const busyBehaviours = derive$1([
        Keying.config({
          mode: 'special',
          onTab() {
            return Option.some(true)
          },
          onShiftTab() {
            return Option.some(true)
          },
        }),
        Focusing.config({}),
      ])
      const showDialog = function (dialog) {
        const sink = detail.lazySink(dialog).getOrDie()
        const busyComp = Cell(Option.none())
        const externalBlocker = externals.blocker()
        const blocker = sink.getSystem().build(__assign({}, externalBlocker, {
          components: externalBlocker.components.concat([premade$1(dialog)]),
          behaviours: derive$1([config('dialog-blocker-events', [
            run(dialogIdleEvent, (blocker, se) => {
              if (has$1(dialog.element(), 'aria-busy')) {
                remove$1(dialog.element(), 'aria-busy')
                busyComp.get().each((bc) => Replacing.remove(dialog, bc))
              }
            }),
            run(dialogBusyEvent, (blocker, se) => {
              set$1(dialog.element(), 'aria-busy', 'true')
              const getBusySpec = se.event().getBusySpec()
              busyComp.get().each((bc) => {
                Replacing.remove(dialog, bc)
              })
              const busySpec = getBusySpec(dialog, busyBehaviours)
              const busy = blocker.getSystem().build(busySpec)
              busyComp.set(Option.some(busy))
              Replacing.append(dialog, premade$1(busy))
              if (busy.hasConfigured(Keying)) {
                Keying.focusIn(busy)
              }
            }),
          ])]),
        }))
        attach(sink, blocker)
        Keying.focusIn(dialog)
      }
      const hideDialog = function (dialog) {
        parent(dialog.element()).each((blockerDom) => {
          dialog.getSystem().getByDom(blockerDom).each((blocker) => {
            detach(blocker)
          })
        })
      }
      const getDialogBody = function (dialog) {
        return getPartOrDie(dialog, detail, 'body')
      }
      const getDialogFooter = function (dialog) {
        return getPartOrDie(dialog, detail, 'footer')
      }
      const setBusy = function (dialog, getBusySpec) {
        emitWith(dialog, dialogBusyEvent, { getBusySpec })
      }
      const setIdle = function (dialog) {
        emit(dialog, dialogIdleEvent)
      }
      const modalEventsId = generate$1('modal-events')
      const eventOrder = __assign({}, detail.eventOrder, { 'alloy.system.attached': [modalEventsId].concat(detail.eventOrder['alloy.system.attached'] || []) })
      return {
        uid: detail.uid,
        dom: detail.dom,
        components: components$$1,
        apis: {
          show: showDialog,
          hide: hideDialog,
          getBody: getDialogBody,
          getFooter: getDialogFooter,
          setIdle,
          setBusy,
        },
        eventOrder,
        domModification: {
          attributes: {
            role: 'dialog',
            'aria-modal': 'true',
          },
        },
        behaviours: augment(detail.modalBehaviours, [
          Replacing.config({}),
          Keying.config({
            mode: 'cyclic',
            onEnter: detail.onExecute,
            onEscape: detail.onEscape,
            useTabstopAt: detail.useTabstopAt,
          }),
          config(modalEventsId, [runOnAttached((c) => {
            AriaLabel.labelledBy(c.element(), getPartOrDie(c, detail, 'title').element())
          })]),
        ]),
      }
    }
    const ModalDialog = composite$1({
      name: 'ModalDialog',
      configFields: schema$p(),
      partFields: parts$b(),
      factory: factory$e,
      apis: {
        show(apis, dialog) {
          apis.show(dialog)
        },
        hide(apis, dialog) {
          apis.hide(dialog)
        },
        getBody(apis, dialog) {
          return apis.getBody(dialog)
        },
        getFooter(apis, dialog) {
          return apis.getFooter(dialog)
        },
        setBusy(apis, dialog, getBusySpec) {
          apis.setBusy(dialog, getBusySpec)
        },
        setIdle(apis, dialog) {
          apis.setIdle(dialog)
        },
      },
    })

    const alertBannerFields = [
      strictString('type'),
      strictString('text'),
      strictStringEnum('level', [
        'info',
        'warn',
        'error',
        'success',
      ]),
      strictString('icon'),
      defaulted$1('url', ''),
    ]

    const createBarFields = function (itemsField) {
      return [
        strictString('type'),
        itemsField,
      ]
    }

    const buttonFields = [
      strictString('type'),
      strictString('text'),
      defaultedBoolean('primary', false),
      field('name', 'name', defaultedThunk(() => generate$1('button-name')), string),
      optionString('icon'),
    ]

    const checkboxFields = [
      strictString('type'),
      strictString('name'),
      strictString('label'),
    ]
    const validOptions = [
      'checked',
      'unchecked',
      'indeterminate',
    ]
    const checkboxDataProcessor = valueOf((value) => {
      if (contains(validOptions, value)) {
        return Result.value(value)
      }
      return Result.error(`Checkbox data: can only be a string of either "${validOptions.join('" | "')}" `)
    })

    const formComponentFields = [
      strictString('type'),
      strictString('name'),
      optionString('label'),
    ]

    const colorInputFields = formComponentFields
    const colorInputDataProcessor = string

    const colorPickerFields = formComponentFields
    const colorPickerDataProcessor = string

    const dropZoneFields = formComponentFields.concat([defaulted$1('flex', false)])
    const dropZoneDataProcessor = arrOfVal()

    const createGridFields = function (itemsField) {
      return [
        strictString('type'),
        strictNumber('columns'),
        itemsField,
      ]
    }

    const iframeFields = formComponentFields.concat([
      defaultedBoolean('sandboxed', true),
      defaultedBoolean('flex', false),
    ])
    const iframeDataProcessor = string

    const inputFields = formComponentFields.concat([optionString('placeholder')])
    const inputDataProcessor = string

    const selectBoxFields = formComponentFields.concat([
      strictArrayOfObj('items', [
        strictString('text'),
        strictString('value'),
      ]),
      defaultedNumber('size', 1),
    ])
    const selectBoxDataProcessor = string

    const sizeInputFields = formComponentFields.concat([defaultedBoolean('constrain', true)])
    const sizeInputDataProcessor = objOf([
      strictString('width'),
      strictString('height'),
    ])

    const textAreaFields = formComponentFields.concat([
      defaulted$1('flex', false),
      optionString('placeholder'),
    ])
    const textAreaDataProcessor = string

    const urlInputFields = formComponentFields.concat([defaultedStringEnum('filetype', 'file', [
      'image',
      'media',
      'file',
    ])])
    const urlInputDataProcessor = objOf([
      strictString('value'),
      defaulted$1('meta', {}),
    ])

    const customEditorFields = formComponentFields.concat([
      strictString('type'),
      defaultedString('tag', 'textarea'),
      strictFunction('init'),
    ])
    const customEditorDataProcessor = string

    const htmlPanelFields = [
      strictString('type'),
      strictString('html'),
    ]

    const imageToolsFields = formComponentFields.concat([strictOf('currentState', objOf([
      strict$1('blob'),
      strictString('url'),
    ]))])

    const collectionFields = formComponentFields.concat([defaulted$1('columns', 1)])
    const collectionDataProcessor = arrOfObj$1([
      strictString('value'),
      optionString('text'),
      optionString('icon'),
    ])

    const createLabelFields = function (itemsField) {
      return [
        strictString('type'),
        strictString('label'),
        itemsField,
      ]
    }

    const tableFields = [
      strictString('type'),
      strictArrayOf('header', string),
      strictArrayOf('cells', arrOf(string)),
    ]

    const createItemsField = function (name) {
      return field('items', 'items', strict(), arrOf(valueOf((v) => asRaw(`Checking item of ${name}`, itemSchema$2, v).fold((sErr) => Result.error(formatError(sErr)), (passValue) => Result.value(passValue)))))
    }
    var itemSchema$2 = choose$1('type', {
      alertbanner: alertBannerFields,
      bar: createBarFields(createItemsField('bar')),
      button: buttonFields,
      checkbox: checkboxFields,
      colorinput: colorInputFields,
      colorpicker: colorPickerFields,
      dropzone: dropZoneFields,
      grid: createGridFields(createItemsField('grid')),
      iframe: iframeFields,
      input: inputFields,
      selectbox: selectBoxFields,
      sizeinput: sizeInputFields,
      textarea: textAreaFields,
      urlinput: urlInputFields,
      customeditor: customEditorFields,
      htmlpanel: htmlPanelFields,
      imagetools: imageToolsFields,
      collection: collectionFields,
      label: createLabelFields(createItemsField('label')),
      table: tableFields,
    })

    const panelFields = [
      strictString('type'),
      strictArrayOf('items', itemSchema$2),
    ]

    const tabFields = [
      strictString('title'),
      strictArrayOf('items', itemSchema$2),
    ]
    const tabPanelFields = [
      strictString('type'),
      strictArrayOfObj('tabs', tabFields),
    ]

    const dialogButtonSchema = objOf([
      strictStringEnum('type', [
        'submit',
        'cancel',
        'custom',
      ]),
      field('name', 'name', defaultedThunk(() => generate$1('button-name')), string),
      strictString('text'),
      optionString('icon'),
      defaultedStringEnum('align', 'end', [
        'start',
        'end',
      ]),
      defaultedBoolean('primary', false),
      defaultedBoolean('disabled', false),
    ])
    const dialogSchema = objOf([
      strictString('title'),
      strictOf('body', choose$1('type', {
        panel: panelFields,
        tabpanel: tabPanelFields,
      })),
      defaultedString('size', 'normal'),
      strictArrayOf('buttons', dialogButtonSchema),
      defaulted$1('initialData', {}),
      defaultedFunction('onAction', noop),
      defaultedFunction('onChange', noop),
      defaultedFunction('onSubmit', noop),
      defaultedFunction('onClose', noop),
      defaultedFunction('onCancel', noop),
      defaulted$1('onTabChange', noop),
      option('readyWhen'),
    ])
    const createDialog = function (spec) {
      return asRaw('dialog', dialogSchema, spec)
    }

    var getAllObjects = function (obj) {
      if (isObject(obj)) {
        return [obj].concat(bind(values(obj), getAllObjects))
      } if (isArray(obj)) {
        return bind(obj, getAllObjects)
      }
      return []
    }

    const isNamedItem = function (obj) {
      return isString(obj.type) && isString(obj.name)
    }
    const dataProcessors = {
      checkbox: checkboxDataProcessor,
      colorinput: colorInputDataProcessor,
      colorpicker: colorPickerDataProcessor,
      dropzone: dropZoneDataProcessor,
      input: inputDataProcessor,
      iframe: iframeDataProcessor,
      sizeinput: sizeInputDataProcessor,
      selectbox: selectBoxDataProcessor,
      size: sizeInputDataProcessor,
      textarea: textAreaDataProcessor,
      urlinput: urlInputDataProcessor,
      customeditor: customEditorDataProcessor,
      collection: collectionDataProcessor,
    }
    const getDataProcessor = function (item) {
      return Option.from(dataProcessors[item.type])
    }
    const getNamedItems = function (structure) {
      return filter(getAllObjects(structure), isNamedItem)
    }

    const createDataValidator = function (structure) {
      const fields = bind(getNamedItems(structure), (item) => getDataProcessor(item).fold(() => [], (schema) => [strictOf(item.name, schema)]))
      return objOf(fields)
    }

    const extract$1 = function (structure) {
      const internalDialog = getOrDie$1(createDialog(structure))
      const dataValidator = createDataValidator(structure)
      const { initialData } = structure
      return {
        internalDialog,
        dataValidator,
        initialData,
      }
    }
    const DialogManager = {
      open(factory, structure) {
        const extraction = extract$1(structure)
        return factory(extraction.internalDialog, extraction.initialData, extraction.dataValidator)
      },
      redial(structure) {
        return extract$1(structure)
      },
    }

    const dialogChannel = generate$1('update-dialog')
    const titleChannel = generate$1('update-title')
    const bodyChannel = generate$1('update-body')
    const footerChannel = generate$1('update-footer')

    const toValidValues = function (values$$1) {
      const errors = []
      const result = {}
      each$1(values$$1, (value, name) => {
        value.fold(() => {
          errors.push(name)
        }, (v) => {
          result[name] = v
        })
      })
      return errors.length > 0 ? Result.error(errors) : Result.value(result)
    }

    const renderBodyPanel = function (spec, backstage) {
      const memForm = record(Form.sketch((parts) => ({
        dom: {
          tag: 'div',
          classes: ['tox-dialog__body-content'],
        },
        components: map(spec.items, (item) => interpretInForm(parts, item, backstage)),
      })))
      return {
        dom: {
          tag: 'div',
          classes: ['tox-dialog__body'],
        },
        components: [memForm.asSpec()],
        behaviours: derive$1([
          Keying.config({
            mode: 'acyclic',
            useTabstopAt: not(NavigableObject.isPseudoStop),
          }),
          ComposingConfigs.memento(memForm),
          RepresentingConfigs.memento(memForm, {
            postprocess(formValue) {
              return toValidValues(formValue).fold((err) => {
                console.error(err)
                return {}
              }, (vals) => vals)
            },
          }),
        ]),
      }
    }

    const factory$f = function (detail, spec) {
      return {
        uid: detail.uid,
        dom: detail.dom,
        components: detail.components,
        events: events$7(detail.action),
        behaviours: augment(detail.tabButtonBehaviours, [
          Focusing.config({}),
          Keying.config({
            mode: 'execution',
            useSpace: true,
            useEnter: true,
          }),
          Representing.config({
            store: {
              mode: 'memory',
              initialValue: detail.value,
            },
          }),
        ]),
        domModification: detail.domModification,
      }
    }
    const TabButton = single$2({
      name: 'TabButton',
      configFields: [
        defaulted$1('uid', undefined),
        strict$1('value'),
        field('dom', 'dom', mergeWithThunk((spec) => ({
          attributes: {
            role: 'tab',
            id: generate$1('aria'),
            'aria-selected': 'false',
          },
        })), anyValue$1()),
        option('action'),
        defaulted$1('domModification', {}),
        field$1('tabButtonBehaviours', [
          Focusing,
          Keying,
          Representing,
        ]),
        strict$1('view'),
      ],
      factory: factory$f,
    })

    const schema$q = constant([
      strict$1('tabs'),
      strict$1('dom'),
      defaulted$1('clickToDismiss', false),
      field$1('tabbarBehaviours', [
        Highlighting,
        Keying,
      ]),
      markers([
        'tabClass',
        'selectedClass',
      ]),
    ])
    const tabsPart = group({
      factory: TabButton,
      name: 'tabs',
      unit: 'tab',
      overrides(barDetail, tabSpec) {
        const dismissTab$$1 = function (tabbar, button) {
          Highlighting.dehighlight(tabbar, button)
          emitWith(tabbar, dismissTab(), {
            tabbar,
            button,
          })
        }
        const changeTab$$1 = function (tabbar, button) {
          Highlighting.highlight(tabbar, button)
          emitWith(tabbar, changeTab(), {
            tabbar,
            button,
          })
        }
        return {
          action(button) {
            const tabbar = button.getSystem().getByUid(barDetail.uid).getOrDie()
            const activeButton = Highlighting.isHighlighted(tabbar, button)
            const response = (function () {
              if (activeButton && barDetail.clickToDismiss) {
                return dismissTab$$1
              } if (!activeButton) {
                return changeTab$$1
              }
              return noop
            }())
            response(tabbar, button)
          },
          domModification: { classes: [barDetail.markers.tabClass] },
        }
      },
    })
    const parts$c = constant([tabsPart])

    const factory$g = function (detail, components, spec, externals) {
      return {
        uid: detail.uid,
        dom: detail.dom,
        components,
        'debug.sketcher': 'Tabbar',
        domModification: { attributes: { role: 'tablist' } },
        behaviours: augment(detail.tabbarBehaviours, [
          Highlighting.config({
            highlightClass: detail.markers.selectedClass,
            itemClass: detail.markers.tabClass,
            onHighlight(tabbar, tab) {
              set$1(tab.element(), 'aria-selected', 'true')
            },
            onDehighlight(tabbar, tab) {
              set$1(tab.element(), 'aria-selected', 'false')
            },
          }),
          Keying.config({
            mode: 'flow',
            getInitial(tabbar) {
              return Highlighting.getHighlighted(tabbar).map((tab) => tab.element())
            },
            selector: `.${detail.markers.tabClass}`,
            executeOnMove: true,
          }),
        ]),
      }
    }
    const Tabbar = composite$1({
      name: 'Tabbar',
      configFields: schema$q(),
      partFields: parts$c(),
      factory: factory$g,
    })

    const factory$h = function (detail, spec) {
      return {
        uid: detail.uid,
        dom: detail.dom,
        behaviours: augment(detail.tabviewBehaviours, [Replacing.config({})]),
        domModification: { attributes: { role: 'tabpanel' } },
      }
    }
    const Tabview = single$2({
      name: 'Tabview',
      configFields: [field$1('tabviewBehaviours', [Replacing])],
      factory: factory$h,
    })

    const schema$r = constant([
      defaulted$1('selectFirst', true),
      onHandler('onChangeTab'),
      onHandler('onDismissTab'),
      defaulted$1('tabs', []),
      field$1('tabSectionBehaviours', []),
    ])
    const barPart = required({
      factory: Tabbar,
      schema: [
        strict$1('dom'),
        strictObjOf('markers', [
          strict$1('tabClass'),
          strict$1('selectedClass'),
        ]),
      ],
      name: 'tabbar',
      defaults(detail) {
        return { tabs: detail.tabs }
      },
    })
    const viewPart = required({
      factory: Tabview,
      name: 'tabview',
    })
    const parts$d = constant([
      barPart,
      viewPart,
    ])

    const factory$i = function (detail, components$$1, spec, externals) {
      const changeTab$$1 = function (button) {
        const tabValue = Representing.getValue(button)
        getPart(button, detail, 'tabview').each((tabview) => {
          const tabWithValue = find(detail.tabs, (t) => t.value === tabValue)
          tabWithValue.each((tabData) => {
            const panel = tabData.view()
            set$1(tabview.element(), 'aria-labelledby', get$2(button.element(), 'id'))
            Replacing.set(tabview, panel)
            detail.onChangeTab(tabview, button, panel)
          })
        })
      }
      const changeTabBy = function (section, byPred) {
        getPart(section, detail, 'tabbar').each((tabbar) => {
          byPred(tabbar).each(emitExecute)
        })
      }
      return {
        uid: detail.uid,
        dom: detail.dom,
        components: components$$1,
        behaviours: get$d(detail.tabSectionBehaviours),
        events: derive(flatten([
          detail.selectFirst ? [runOnAttached((section, simulatedEvent) => {
            changeTabBy(section, Highlighting.getFirst)
          })] : [],
          [
            run(changeTab(), (section, simulatedEvent) => {
              const button = simulatedEvent.event().button()
              changeTab$$1(button)
            }),
            run(dismissTab(), (section, simulatedEvent) => {
              const button = simulatedEvent.event().button()
              detail.onDismissTab(section, button)
            }),
          ],
        ])),
        apis: {
          getViewItems(section) {
            return getPart(section, detail, 'tabview').map((tabview) => Replacing.contents(tabview)).getOr([])
          },
          showTab(section, tabKey) {
            const getTabIfNotActive = function (tabbar) {
              const candidates = Highlighting.getCandidates(tabbar)
              const optTab = find(candidates, (c) => Representing.getValue(c) === tabKey)
              return optTab.filter((tab) => !Highlighting.isHighlighted(tabbar, tab))
            }
            changeTabBy(section, getTabIfNotActive)
          },
        },
      }
    }
    const TabSection = composite$1({
      name: 'TabSection',
      configFields: schema$r(),
      partFields: parts$d(),
      factory: factory$i,
      apis: {
        getViewItems(apis, component) {
          return apis.getViewItems(component)
        },
        showTab(apis, component, tabKey) {
          apis.showTab(component, tabKey)
        },
      },
    })

    const measureHeights = function (allTabs, tabview, tabviewComp) {
      return map(allTabs, (tab, i) => {
        Replacing.set(tabviewComp, allTabs[i].view())
        const rect = tabview.dom().getBoundingClientRect()
        Replacing.set(tabviewComp, [])
        return rect.height
      })
    }
    const getMaxHeight = function (heights) {
      return head(sort(heights, (a, b) => {
        if (a > b) {
          return -1
        } if (a < b) {
          return +1
        }
        return 0
      }))
    }
    const showTab = function (allTabs, comp) {
      head(allTabs).each((tab) => TabSection.showTab(comp, tab.value))
    }
    const setMode = function (allTabs) {
      const smartTabHeight = (function () {
        const extraEvents = [
          runOnAttached((comp) => {
            descendant$2(comp.element(), '[role="tabpanel"]').each((tabview) => {
              set$2(tabview, 'visibility', 'hidden')
              const optHeight = comp.getSystem().getByDom(tabview).toOption().bind((tabviewComp) => {
                const heights = measureHeights(allTabs, tabview, tabviewComp)
                return getMaxHeight(heights)
              })
              optHeight.each((height) => {
                set$2(tabview, 'height', `${height}px`)
              })
              remove$6(tabview, 'visibility')
              showTab(allTabs, comp)
            })
          }),
          run(formResizeEvent, (comp, se) => {
            descendant$2(comp.element(), '[role="tabpanel"]').each((tabview) => {
              const oldFocus = active()
              set$2(tabview, 'visibility', 'hidden')
              const oldHeight = getRaw(tabview, 'height').map((h) => parseInt(h, 10))
              remove$6(tabview, 'height')
              const newHeight = tabview.dom().getBoundingClientRect().height
              const hasGrown = oldHeight.forall((h) => newHeight > h)
              if (hasGrown) {
                set$2(tabview, 'height', `${newHeight}px`)
              } else {
                oldHeight.each((h) => {
                  set$2(tabview, 'height', `${h}px`)
                })
              }
              remove$6(tabview, 'visibility')
              oldFocus.each(focus$2)
            })
          }),
        ]
        const selectFirst = false
        return {
          extraEvents,
          selectFirst,
        }
      }())
      const naiveTabHeight = (function () {
        const extraEvents = []
        const selectFirst = true
        return {
          extraEvents,
          selectFirst,
        }
      }())
      return {
        smartTabHeight,
        naiveTabHeight,
      }
    }

    const SendDataToSectionChannel = 'send-data-to-section'
    const SendDataToViewChannel = 'send-data-to-view'
    const renderTabPanel = function (spec, backstage) {
      const storedValue = Cell({})
      const updateDataWithForm = function (form) {
        const formData = Representing.getValue(form)
        const validData = toValidValues(formData).getOr({})
        const currentData = storedValue.get()
        const newData = deepMerge(currentData, validData)
        storedValue.set(newData)
      }
      const setDataOnForm = function (form) {
        const tabData = storedValue.get()
        Representing.setValue(form, tabData)
      }
      const oldTab = Cell(null)
      const allTabs = map(spec.tabs, (tab) => ({
        value: tab.title,
        dom: {
          tag: 'div',
          classes: ['tox-dialog__body-nav-item'],
          innerHtml: backstage.shared.providers.translate(tab.title),
        },
        view() {
          return [Form.sketch((parts) => ({
            dom: {
              tag: 'div',
              classes: ['tox-form'],
            },
            components: map(tab.items, (item) => interpretInForm(parts, item, backstage)),
            formBehaviours: derive$1([
              Keying.config({
                mode: 'acyclic',
                useTabstopAt: not(NavigableObject.isPseudoStop),
              }),
              config('TabView.form.events', [
                runOnAttached(setDataOnForm),
                runOnDetached(updateDataWithForm),
              ]),
              Receiving.config({
                channels: wrapAll$1([
                  {
                    key: SendDataToSectionChannel,
                    value: { onReceive: updateDataWithForm },
                  },
                  {
                    key: SendDataToViewChannel,
                    value: { onReceive: setDataOnForm },
                  },
                ]),
              }),
            ]),
          }))]
        },
      }))
      const tabMode = setMode(allTabs).smartTabHeight
      return TabSection.sketch({
        dom: {
          tag: 'div',
          classes: ['tox-dialog__body'],
        },
        onChangeTab(section, button, _viewItems) {
          const title = Representing.getValue(button)
          emitWith(section, formTabChangeEvent, {
            title,
            oldTitle: oldTab.get(),
          })
          oldTab.set(title)
        },
        tabs: allTabs,
        components: [
          TabSection.parts().tabbar({
            dom: {
              tag: 'div',
              classes: ['tox-dialog__body-nav'],
            },
            components: [Tabbar.parts().tabs({})],
            markers: {
              tabClass: 'tox-tab',
              selectedClass: 'tox-dialog__body-nav-item--active',
            },
            tabbarBehaviours: derive$1([Tabstopping.config({})]),
          }),
          TabSection.parts().tabview({
            dom: {
              tag: 'div',
              classes: ['tox-dialog__body-content'],
            },
          }),
        ],
        selectFirst: tabMode.selectFirst,
        tabSectionBehaviours: derive$1([
          config('tabpanel', tabMode.extraEvents),
          Keying.config({ mode: 'acyclic' }),
          Composing.config({
            find(comp) {
              return head(TabSection.getViewItems(comp))
            },
          }),
          Representing.config({
            store: {
              mode: 'manual',
              getValue(tsection) {
                tsection.getSystem().broadcastOn([SendDataToSectionChannel], {})
                return storedValue.get()
              },
              setValue(tsection, value) {
                storedValue.set(value)
                tsection.getSystem().broadcastOn([SendDataToViewChannel], {})
              },
            },
          }),
        ]),
      })
    }

    const renderBody = function (foo, backstage) {
      const renderComponents = function (incoming) {
        switch (incoming.body.type) {
          case 'tabpanel': {
            return [renderTabPanel({ tabs: incoming.body.tabs }, backstage)]
          }
          default: {
            return [renderBodyPanel({ items: incoming.body.items }, backstage)]
          }
        }
      }
      const updateState = function (_comp, incoming) {
        return Option.some({
          isTabPanel() {
            return incoming.body.type === 'tabpanel'
          },
        })
      }
      return {
        dom: {
          tag: 'div',
          classes: ['tox-dialog__content-js'],
        },
        components: [],
        behaviours: derive$1([
          ComposingConfigs.childAt(0),
          Reflecting.config({
            channel: bodyChannel,
            updateState,
            renderComponents,
            initialData: foo,
          }),
        ]),
      }
    }
    const renderInlineBody = function (foo, backstage) {
      return renderBody(foo, backstage)
    }
    const renderModalBody = function (foo, backstage) {
      return ModalDialog.parts().body(renderBody(foo, backstage))
    }

    const init$d = function (getInstanceApi, extras) {
      const fireApiEvent = function (eventName, f) {
        return run(eventName, (c, se) => {
          withSpec(c, (spec, _c) => {
            f(spec, se.event(), c)
          })
        })
      }
      var withSpec = function (c, f) {
        Reflecting.getState(c).get().each((currentDialogInit) => {
          f(currentDialogInit.internalDialog, c)
        })
      }
      return [
        runWithTarget(focusin(), NavigableObject.onFocus),
        fireApiEvent(formSubmitEvent, (spec) => spec.onSubmit(getInstanceApi())),
        fireApiEvent(formChangeEvent, (spec, event) => {
          spec.onChange(getInstanceApi(), { name: event.name() })
        }),
        fireApiEvent(formActionEvent, (spec, event) => {
          spec.onAction(getInstanceApi(), {
            name: event.name(),
            value: event.value(),
          })
        }),
        fireApiEvent(formTabChangeEvent, (spec, event) => {
          spec.onTabChange(getInstanceApi(), event.title())
        }),
        fireApiEvent(formCloseEvent, (spec) => {
          extras.onClose()
          spec.onClose()
        }),
        fireApiEvent(formCancelEvent, (spec, _event, self) => {
          spec.onCancel(getInstanceApi())
          emit(self, formCloseEvent)
        }),
        runOnDetached((component) => {
          const api = getInstanceApi()
          Representing.setValue(component, api.getData())
        }),
        run(formUnblockEvent, (c, se) => extras.onUnblock()),
        run(formBlockEvent, (c, se) => extras.onBlock(se.event())),
      ]
    }
    const SilverDialogEvents = { init: init$d }

    const makeButton = function (button, providersBackstage) {
      return renderFooterButton(button, button.type, providersBackstage)
    }
    const lookup$2 = function (compInSystem, footerButtons, buttonName) {
      return find(footerButtons, (button) => button.name === buttonName).bind((memButton) => memButton.memento.getOpt(compInSystem))
    }
    const renderComponents = function (_data, state) {
      const footerButtons = state.map((s) => s.footerButtons).getOr([])
      const buttonGroups = partition(footerButtons, (button) => button.align === 'start')
      const makeGroup = function (edge, buttons) {
        return Container.sketch({
          dom: {
            tag: 'div',
            classes: [`tox-dialog__footer-${edge}`],
          },
          components: map(buttons, (button) => button.memento.asSpec()),
        })
      }
      const startButtons = makeGroup('start', buttonGroups.pass)
      const endButtons = makeGroup('end', buttonGroups.fail)
      return [
        startButtons,
        endButtons,
      ]
    }
    const renderFooter = function (initFoo, providersBackstage) {
      const updateState = function (_comp, data) {
        const footerButtons = map(data.buttons, (button) => {
          const memButton = record(makeButton(button, providersBackstage))
          return {
            name: button.name,
            align: button.align,
            memento: memButton,
          }
        })
        const lookupByName = function (compInSystem, buttonName) {
          return lookup$2(compInSystem, footerButtons, buttonName)
        }
        return Option.some({
          lookupByName,
          footerButtons,
        })
      }
      return {
        dom: fromHtml$2('<div class="tox-dialog__footer"></div>'),
        components: [],
        behaviours: derive$1([Reflecting.config({
          channel: footerChannel,
          initialData: initFoo,
          updateState,
          renderComponents,
        })]),
      }
    }
    const renderInlineFooter = function (initFoo, providersBackstage) {
      return renderFooter(initFoo, providersBackstage)
    }
    const renderModalFooter = function (initFoo, providersBackstage) {
      return ModalDialog.parts().footer(renderFooter(initFoo, providersBackstage))
    }

    const renderClose = function (providersBackstage) {
      return Button.sketch({
        dom: {
          tag: 'button',
          classes: [
            'tox-button',
            'tox-button--icon',
            'tox-button--naked',
          ],
          attributes: {
            type: 'button',
            'aria-label': providersBackstage.translate('Close'),
            title: providersBackstage.translate('Close'),
          },
        },
        components: [{
          dom: {
            tag: 'div',
            classes: ['tox-icon'],
            innerHtml: '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M17.953 7.453L13.422 12l4.531 4.547-1.406 1.406L12 13.422l-4.547 4.531-1.406-1.406L10.578 12 6.047 7.453l1.406-1.406L12 10.578l4.547-4.531z" fill-rule="evenodd"></path></svg>',
          },
        }],
        action(comp) {
          emit(comp, formCancelEvent)
        },
      })
    }
    const renderTitle = function (foo, id, providersBackstage) {
      const renderComponents = function (data) {
        return [text(providersBackstage.translate(data.title))]
      }
      return {
        dom: {
          tag: 'div',
          classes: ['tox-dialog__title'],
          attributes: __assign({}, id.map((x) => ({ id: x })).getOr({})),
        },
        components: renderComponents(foo),
        behaviours: derive$1([Reflecting.config({
          channel: titleChannel,
          renderComponents,
        })]),
      }
    }
    const renderInlineHeader = function (foo, titleId, providersBackstage) {
      return Container.sketch({
        dom: fromHtml$2('<div class="tox-dialog__header"></div>'),
        components: [
          renderTitle(foo, Option.some(titleId), providersBackstage),
          renderClose(providersBackstage),
        ],
        containerBehaviours: derive$1([Dragging.config({
          mode: 'mouse',
          blockerClass: 'blocker',
          getTarget(handle) {
            return closest$3(handle, '[role="dialog"]').getOrDie()
          },
          snaps: {
            getSnapPoints() {
              return []
            },
            leftAttr: 'data-drag-left',
            topAttr: 'data-drag-top',
          },
        })]),
      })
    }
    const renderModalHeader = function (foo, providersBackstage) {
      const pTitle = ModalDialog.parts().title(renderTitle(foo, Option.none(), providersBackstage))
      const pHandle = ModalDialog.parts().draghandle({ dom: fromHtml$2('<div class="tox-dialog__draghandle"></div>') })
      const pClose = ModalDialog.parts().close(renderClose(providersBackstage))
      const components = [pTitle].concat(foo.draggable ? [pHandle] : []).concat([pClose])
      return Container.sketch({
        dom: fromHtml$2('<div class="tox-dialog__header"></div>'),
        components,
      })
    }

    const getCompByName = function (access, name) {
      const root = access.getRoot()
      if (root.getSystem().isConnected()) {
        const form_1 = Composing.getCurrent(access.getFormWrapper()).getOr(access.getFormWrapper())
        return Form.getField(form_1, name).fold(() => {
          const footer = access.getFooter()
          const footerState = Reflecting.getState(footer)
          return footerState.get().bind((f) => f.lookupByName(form_1, name))
        }, (comp) => Option.some(comp))
      }
      return Option.none()
    }
    const validateData = function (access, data) {
      const root = access.getRoot()
      return Reflecting.getState(root).get().map((dialogState) => getOrDie$1(asRaw('data', dialogState.dataValidator, data))).getOr(data)
    }
    const getDialogApi = function (access, doRedial) {
      const withRoot = function (f) {
        const root = access.getRoot()
        if (root.getSystem().isConnected()) {
          f(root)
        }
      }
      const getData = function () {
        const root = access.getRoot()
        const valueComp = root.getSystem().isConnected() ? access.getFormWrapper() : root
        return Representing.getValue(valueComp)
      }
      const setData = function (newData) {
        withRoot((_) => {
          const prevData = instanceApi.getData()
          const mergedData = merge(prevData, newData)
          const newInternalData = validateData(access, mergedData)
          const form = access.getFormWrapper()
          Representing.setValue(form, newInternalData)
        })
      }
      const disable = function (name) {
        getCompByName(access, name).each(Disabling.disable)
      }
      const enable = function (name) {
        getCompByName(access, name).each(Disabling.enable)
      }
      const focus = function (name) {
        getCompByName(access, name).each(Focusing.focus)
      }
      const block = function (message) {
        withRoot((root) => {
          emitWith(root, formBlockEvent, { message })
        })
      }
      const unblock = function () {
        withRoot((root) => {
          emit(root, formUnblockEvent)
        })
      }
      const showTab = function (title) {
        withRoot((_) => {
          const body = access.getBody()
          const bodyState = Reflecting.getState(body)
          if (bodyState.get().exists((b) => b.isTabPanel())) {
            Composing.getCurrent(body).each((tabSection) => {
              TabSection.showTab(tabSection, title)
            })
          }
        })
      }
      const redial = function (d) {
        withRoot((root) => {
          const dialogInit = doRedial(d)
          root.getSystem().broadcastOn([dialogChannel], dialogInit)
          root.getSystem().broadcastOn([titleChannel], dialogInit.internalDialog)
          root.getSystem().broadcastOn([bodyChannel], dialogInit.internalDialog)
          root.getSystem().broadcastOn([footerChannel], dialogInit.internalDialog)
          instanceApi.setData(dialogInit.initialData)
        })
      }
      const close = function () {
        withRoot((root) => {
          emit(root, formCloseEvent)
        })
      }
      var instanceApi = {
        getData,
        setData,
        disable,
        enable,
        focus,
        block,
        unblock,
        showTab,
        redial,
        close,
      }
      return instanceApi
    }

    const renderDialog = function (dialogInit, extra, backstage) {
      let _a
      const updateState = function (_comp, incoming) {
        return Option.some(incoming)
      }
      const header = renderModalHeader({
        title: backstage.shared.providers.translate(dialogInit.internalDialog.title),
        draggable: true,
      }, backstage.shared.providers)
      const body = renderModalBody({ body: dialogInit.internalDialog.body }, backstage)
      const footer = renderModalFooter({ buttons: dialogInit.internalDialog.buttons }, backstage.shared.providers)
      const dialogEvents = SilverDialogEvents.init(() => instanceApi, {
        onClose() {
          return extra.closeWindow()
        },
        onBlock(blockEvent) {
          ModalDialog.setBusy(dialog, (d, bs) => ({
            dom: {
              tag: 'div',
              classes: ['tox-dialog__busy-spinner'],
              attributes: { 'aria-label': blockEvent.message() },
              styles: {
                left: '0px',
                right: '0px',
                bottom: '0px',
                top: '0px',
                position: 'absolute',
              },
            },
            behaviours: bs,
            components: [{ dom: fromHtml$2('<div class="tox-spinner"><div></div><div></div><div></div></div>') }],
          }))
        },
        onUnblock() {
          ModalDialog.setIdle(dialog)
        },
      })
      const dialogSize = dialogInit.internalDialog.size !== 'normal' ? dialogInit.internalDialog.size === 'large' ? 'tox-dialog--width-lg' : 'tox-dialog--width-md' : []
      var dialog = build$1(ModalDialog.sketch({
        lazySink: backstage.shared.getSink,
        onEscape(c) {
          emit(c, formCancelEvent)
          return Option.some(true)
        },
        useTabstopAt(elem) {
          return !NavigableObject.isPseudoStop(elem) && (name(elem) !== 'button' || get$2(elem, 'disabled') !== 'disabled')
        },
        modalBehaviours: derive$1([
          Reflecting.config({
            channel: dialogChannel,
            updateState,
            initialData: dialogInit,
          }),
          Focusing.config({}),
          config('execute-on-form', dialogEvents.concat([runOnSource(focusin(), (comp, se) => {
            Keying.focusIn(comp)
          })])),
          RepresentingConfigs.memory({}),
        ]),
        eventOrder: (_a = {}, _a[execute()] = ['execute-on-form'], _a[attachedToDom()] = [
          'reflecting',
          'execute-on-form',
        ], _a),
        dom: {
          tag: 'div',
          classes: ['tox-dialog'].concat(dialogSize),
          styles: { position: 'relative' },
        },
        components: [
          header,
          body,
          footer,
        ],
        dragBlockClass: 'tox-dialog-wrap',
        parts: {
          blocker: {
            dom: fromHtml$2('<div class="tox-dialog-wrap"></div>'),
            components: [{
              dom: {
                tag: 'div',
                classes: ['tox-dialog-wrap__backdrop'],
              },
            }],
          },
        },
      }))
      const modalAccess = (function () {
        const getForm = function () {
          const outerForm = ModalDialog.getBody(dialog)
          return Composing.getCurrent(outerForm).getOr(outerForm)
        }
        return {
          getRoot() {
            return dialog
          },
          getBody() {
            return ModalDialog.getBody(dialog)
          },
          getFooter() {
            return ModalDialog.getFooter(dialog)
          },
          getFormWrapper: getForm,
        }
      }())
      var instanceApi = getDialogApi(modalAccess, extra.redial)
      return {
        dialog,
        instanceApi,
      }
    }

    const renderInlineDialog = function (dialogInit, extra, backstage) {
      let _a, _b
      const dialogLabelId = generate$1('dialog-label')
      const updateState = function (_comp, incoming) {
        return Option.some(incoming)
      }
      const memHeader = record(renderInlineHeader({
        title: dialogInit.internalDialog.title,
        draggable: true,
      }, dialogLabelId, backstage.shared.providers))
      const memBody = record(renderInlineBody({ body: dialogInit.internalDialog.body }, backstage))
      const memFooter = record(renderInlineFooter({ buttons: dialogInit.internalDialog.buttons }, backstage.shared.providers))
      const dialogEvents = SilverDialogEvents.init(() => instanceApi, {
        onBlock() {
        },
        onUnblock() {
        },
        onClose() {
          return extra.closeWindow()
        },
      })
      const dialog = build$1({
        dom: {
          tag: 'div',
          classes: ['tox-dialog'],
          attributes: (_a = { role: 'dialog' }, _a['aria-labelledby'] = dialogLabelId, _a),
        },
        eventOrder: (_b = {}, _b[receive()] = [
          Reflecting.name(),
          Receiving.name(),
        ], _b[execute()] = ['execute-on-form'], _b[attachedToDom()] = [
          'reflecting',
          'execute-on-form',
        ], _b),
        behaviours: derive$1([
          Keying.config({
            mode: 'cyclic',
            onEscape(c) {
              emit(c, formCloseEvent)
              return Option.some(true)
            },
            useTabstopAt(elem) {
              return !NavigableObject.isPseudoStop(elem) && (name(elem) !== 'button' || get$2(elem, 'disabled') !== 'disabled')
            },
          }),
          Reflecting.config({
            channel: dialogChannel,
            updateState,
            initialData: dialogInit,
          }),
          config('execute-on-form', dialogEvents),
          RepresentingConfigs.memory({}),
        ]),
        components: [
          memHeader.asSpec(),
          memBody.asSpec(),
          memFooter.asSpec(),
        ],
      })
      var instanceApi = getDialogApi({
        getRoot() {
          return dialog
        },
        getFooter() {
          return memFooter.get(dialog)
        },
        getBody() {
          return memBody.get(dialog)
        },
        getFormWrapper() {
          const body = memBody.get(dialog)
          return Composing.getCurrent(body).getOr(body)
        },
      }, extra.redial)
      return {
        dialog,
        instanceApi,
      }
    }

    const pClose = function (onClose, providersBackstage) {
      return ModalDialog.parts().close(Button.sketch({
        dom: {
          tag: 'button',
          classes: [
            'tox-button',
            'tox-button--icon',
            'tox-button--naked',
          ],
          attributes: {
            type: 'button',
            'aria-label': providersBackstage.translate('Close'),
          },
        },
        action: onClose,
        buttonBehaviours: derive$1([Tabstopping.config({})]),
      }))
    }
    const pUntitled = function () {
      return ModalDialog.parts().title({
        dom: {
          tag: 'div',
          classes: ['tox-dialog__title'],
          innerHtml: '',
          styles: { display: 'none' },
        },
      })
    }
    const pBodyMessage = function (message, providersBackstage) {
      return ModalDialog.parts().body({
        dom: {
          tag: 'div',
          classes: [
            'tox-dialog__body',
            'todo-tox-fit',
          ],
        },
        components: [{ dom: fromHtml$2(`<p>${providersBackstage.translate(message)}</p>`) }],
      })
    }
    const pFooter = function (buttons) {
      return ModalDialog.parts().footer({
        dom: {
          tag: 'div',
          classes: ['tox-dialog__footer'],
        },
        components: buttons,
      })
    }
    const pFooterGroup = function (startButtons, endButtons) {
      return [
        Container.sketch({
          dom: {
            tag: 'div',
            classes: ['tox-dialog__footer-start'],
          },
          components: startButtons,
        }),
        Container.sketch({
          dom: {
            tag: 'div',
            classes: ['tox-dialog__footer-end'],
          },
          components: endButtons,
        }),
      ]
    }
    const renderDialog$1 = function (spec) {
      return ModalDialog.sketch({
        lazySink: spec.lazySink,
        onEscape() {
          spec.onCancel()
          return Option.some(true)
        },
        dom: {
          tag: 'div',
          classes: ['tox-dialog'].concat(spec.extraClasses),
        },
        components: [
          {
            dom: {
              tag: 'div',
              classes: ['tox-dialog__header'],
            },
            components: [
              spec.partSpecs.title,
              spec.partSpecs.close,
            ],
          },
          spec.partSpecs.body,
          spec.partSpecs.footer,
        ],
        parts: {
          blocker: {
            dom: fromHtml$2('<div class="tox-dialog-wrap"></div>'),
            components: [{
              dom: {
                tag: 'div',
                classes: ['tox-dialog-wrap__backdrop'],
              },
            }],
          },
        },
        modalBehaviours: derive$1([config('basic-dialog-events', [
          run(formCancelEvent, (comp, se) => {
            spec.onCancel()
          }),
          run(formSubmitEvent, (comp, se) => {
            spec.onSubmit()
          }),
        ])]),
      })
    }

    const setup$7 = function (extras) {
      const sharedBackstage = extras.backstage.shared
      const open = function (message, callback) {
        const closeDialog = function () {
          ModalDialog.hide(alertDialog)
          callback()
        }
        const memFooterClose = record(renderFooterButton({
          name: 'close-alert',
          text: 'OK',
          primary: true,
          icon: Option.none(),
        }, 'cancel', sharedBackstage.providers))
        var alertDialog = build$1(renderDialog$1({
          lazySink() {
            return sharedBackstage.getSink()
          },
          partSpecs: {
            title: pUntitled(),
            close: pClose(() => {
              closeDialog()
            }, sharedBackstage.providers),
            body: pBodyMessage(message, sharedBackstage.providers),
            footer: pFooter(pFooterGroup([], [memFooterClose.asSpec()])),
          },
          onCancel() {
            return closeDialog()
          },
          onSubmit: noop,
          extraClasses: ['tox-alert-dialog'],
        }))
        ModalDialog.show(alertDialog)
        const footerCloseButton = memFooterClose.get(alertDialog)
        Focusing.focus(footerCloseButton)
      }
      return { open }
    }

    const setup$8 = function (extras) {
      const sharedBackstage = extras.backstage.shared
      const open = function (message, callback) {
        const closeDialog = function (state) {
          ModalDialog.hide(confirmDialog)
          callback(state)
        }
        const memFooterYes = record(renderFooterButton({
          name: 'yes',
          text: 'Yes',
          primary: true,
          icon: Option.none(),
        }, 'submit', sharedBackstage.providers))
        const footerNo = renderFooterButton({
          name: 'no',
          text: 'No',
          primary: true,
          icon: Option.none(),
        }, 'cancel', sharedBackstage.providers)
        var confirmDialog = build$1(renderDialog$1({
          lazySink() {
            return sharedBackstage.getSink()
          },
          partSpecs: {
            title: pUntitled(),
            close: pClose(() => {
              closeDialog(false)
            }, sharedBackstage.providers),
            body: pBodyMessage(message, sharedBackstage.providers),
            footer: pFooter(pFooterGroup([], [
              footerNo,
              memFooterYes.asSpec(),
            ])),
          },
          onCancel() {
            return closeDialog(false)
          },
          onSubmit() {
            return closeDialog(true)
          },
          extraClasses: ['tox-confirm-dialog'],
        }))
        ModalDialog.show(confirmDialog)
        const footerYesButton = memFooterYes.get(confirmDialog)
        Focusing.focus(footerYesButton)
      }
      return { open }
    }

    const validateData$1 = function (data, validator) {
      return getOrDie$1(asRaw('data', validator, data))
    }
    const setup$9 = function (extras) {
      const alertDialog = setup$7(extras)
      const confirmDialog = setup$8(extras)
      const open = function (config$$1, params, closeWindow) {
        if (params !== undefined && params.inline === 'toolbar') {
          return openInlineDialog(config$$1, extras.backstage.shared.anchors.toolbar(), closeWindow)
        } if (params !== undefined && params.inline === 'cursor') {
          return openInlineDialog(config$$1, extras.backstage.shared.anchors.cursor(), closeWindow)
        }
        return openModalDialog(config$$1, closeWindow)
      }
      var openModalDialog = function (config$$1, closeWindow) {
        const factory = function (contents, internalInitialData, dataValidator) {
          const initialData = internalInitialData
          const dialogInit = {
            dataValidator,
            initialData,
            internalDialog: contents,
          }
          var dialog = renderDialog(dialogInit, {
            redial: DialogManager.redial,
            closeWindow() {
              ModalDialog.hide(dialog.dialog)
              closeWindow(dialog.instanceApi)
            },
          }, extras.backstage)
          ModalDialog.show(dialog.dialog)
          dialog.instanceApi.setData(initialData)
          return dialog.instanceApi
        }
        return DialogManager.open(factory, config$$1)
      }
      var openInlineDialog = function (config$$1, anchor, closeWindow) {
        const factory = function (contents, internalInitialData, dataValidator) {
          const initialData = validateData$1(internalInitialData, dataValidator)
          const dialogInit = {
            dataValidator,
            initialData,
            internalDialog: contents,
          }
          var dialogUi = renderInlineDialog(dialogInit, {
            redial: DialogManager.redial,
            closeWindow() {
              InlineView.hide(inlineDialog)
              closeWindow(dialogUi.instanceApi)
            },
          }, extras.backstage)
          var inlineDialog = build$1(InlineView.sketch({
            lazySink: extras.backstage.shared.getSink,
            dom: {
              tag: 'div',
              classes: [],
            },
            fireDismissalEventInstead: {},
            inlineBehaviours: derive$1([config('window-manager-inline-events', [run(dismissRequested(), (comp, se) => {
              emit(dialogUi.dialog, formCancelEvent)
            })])]),
          }))
          InlineView.showAt(inlineDialog, anchor, premade$1(dialogUi.dialog))
          dialogUi.instanceApi.setData(initialData)
          Keying.focusIn(dialogUi.dialog)
          return dialogUi.instanceApi
        }
        return DialogManager.open(factory, config$$1)
      }
      const confirm = function (message, callback) {
        confirmDialog.open(message, (state) => {
          callback(state)
        })
      }
      const alert = function (message, callback) {
        alertDialog.open(message, () => {
          callback()
        })
      }
      const close = function (instanceApi) {
        instanceApi.close()
      }
      return {
        open,
        alert,
        close,
        confirm,
      }
    }
    const WindowManager = { setup: setup$9 }

    global.add('silver', (editor) => {
      const _a = Render.setup(editor); const { mothership } = _a; const { uiMothership } = _a; const { backstage } = _a; const { renderUI } = _a; const { getUi } = _a
      FormatControls.setup(editor)
      registerInspector(generate$1('silver-demo'), mothership)
      registerInspector(generate$1('silver-ui-demo'), uiMothership)
      Autocompleter.register(editor, backstage.shared)
      const windowMgr = WindowManager.setup({ backstage })
      return {
        renderUI,
        getWindowManagerImpl: constant(windowMgr),
        getNotificationManagerImpl() {
          return NotificationManagerImpl(editor, { backstage }, uiMothership)
        },
        ui: getUi(),
      }
    })
    function Theme() {
    }

    return Theme
  }())
})()
