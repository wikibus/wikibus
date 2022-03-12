(function () {
  const quickbars = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    let unique = 0
    const generate = function (prefix) {
      const date = new Date()
      const time = date.getTime()
      const random = Math.floor(Math.random() * 1000000000)
      unique++
      return `${prefix}_${random}${unique}${String(time)}`
    }

    const createTableHtml = function (cols, rows) {
      let x, y, html
      html = '<table data-mce-id="mce" style="width: 100%">'
      html += '<tbody>'
      for (y = 0; y < rows; y++) {
        html += '<tr>'
        for (x = 0; x < cols; x++) {
          html += '<td><br></td>'
        }
        html += '</tr>'
      }
      html += '</tbody>'
      html += '</table>'
      return html
    }
    const getInsertedElement = function (editor) {
      const elms = editor.dom.select('*[data-mce-id]')
      return elms[0]
    }
    const insertTableHtml = function (editor, cols, rows) {
      editor.undoManager.transact(() => {
        let tableElm, cellElm
        editor.insertContent(createTableHtml(cols, rows))
        tableElm = getInsertedElement(editor)
        tableElm.removeAttribute('data-mce-id')
        cellElm = editor.dom.select('td,th', tableElm)
        editor.selection.setCursorLocation(cellElm[0], 0)
      })
    }
    const insertTable = function (editor, cols, rows) {
      editor.plugins.table ? editor.plugins.table.insertTable(cols, rows) : insertTableHtml(editor, cols, rows)
    }
    const insertBlob = function (editor, base64, blob) {
      let blobCache, blobInfo
      blobCache = editor.editorUpload.blobCache
      blobInfo = blobCache.create(generate('mceu'), blob, base64)
      blobCache.add(blobInfo)
      editor.insertContent(editor.dom.createHTML('img', { src: blobInfo.blobUri() }))
    }
    const Actions = {
      insertTable,
      insertBlob,
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

    function FileReader() {
      const f = Global$1.getOrDie('FileReader')
      return new f()
    }

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.Promise')

    const blobToBase64 = function (blob) {
      return new global$1((resolve) => {
        const reader = FileReader()
        reader.onloadend = function () {
          resolve(reader.result.split(',')[1])
        }
        reader.readAsDataURL(blob)
      })
    }
    const Conversions = { blobToBase64 }

    const pickFile = function () {
      return new global$1((resolve) => {
        let fileInput
        fileInput = document.createElement('input')
        fileInput.type = 'file'
        fileInput.style.position = 'fixed'
        fileInput.style.left = 0
        fileInput.style.top = 0
        fileInput.style.opacity = 0.001
        document.body.appendChild(fileInput)
        fileInput.onchange = function (e) {
          resolve(Array.prototype.slice.call(e.target.files))
        }
        fileInput.click()
        fileInput.parentNode.removeChild(fileInput)
      })
    }
    const Picker = { pickFile }

    const setupButtons = function (editor) {
      editor.ui.registry.addButton('quickimage', {
        icon: 'image',
        tooltip: 'Insert image',
        onAction() {
          Picker.pickFile().then((files) => {
            const blob = files[0]
            Conversions.blobToBase64(blob).then((base64) => {
              Actions.insertBlob(editor, base64, blob)
            })
          })
        },
      })
      editor.ui.registry.addButton('quicktable', {
        icon: 'table',
        tooltip: 'Insert table',
        onAction() {
          Actions.insertTable(editor, 2, 2)
        },
      })
    }
    const InsertButtons = { setupButtons }

    const constant = function (value) {
      return function () {
        return value
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

    const typeOf = function (x) {
      if (x === null) { return 'null' }
      const t = typeof x
      if (t === 'object' && Array.prototype.isPrototypeOf(x)) { return 'array' }
      if (t === 'object' && String.prototype.isPrototypeOf(x)) { return 'string' }
      return t
    }
    const isType$1 = function (type) {
      return function (value) {
        return typeOf(value) === type
      }
    }
    const isString = isType$1('string')
    const isObject = isType$1('object')
    const isArray = isType$1('array')
    const isBoolean = isType$1('boolean')
    const isUndefined = isType$1('undefined')
    const isFunction = isType$1('function')

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

    function ClosestOrAncestor(is, ancestor, scope, a, isRoot) {
      return is(scope, a) ? Option.some(scope) : isFunction(isRoot) && isRoot(scope) ? Option.none() : ancestor(scope, a, isRoot)
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

    const ELEMENT$1 = ELEMENT
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
      return ancestor(scope, (e) => is(e, selector), isRoot)
    }
    const closest$1 = function (scope, selector, isRoot) {
      return ClosestOrAncestor(is, ancestor$1, scope, selector, isRoot)
    }

    const validDefaultOrDie = function (value, predicate) {
      if (predicate(value)) {
        return true
      }
      throw new Error('Default value doesn\'t match requested type.')
    }
    const items = function (value, defaultValue) {
      if (isArray(value) || isObject(value)) {
        throw new Error(`expected a string but found: ${value}`)
      }
      if (isUndefined(value)) {
        return defaultValue
      }
      if (isBoolean(value)) {
        return value === false ? '' : defaultValue
      }
      return value
    }
    const getToolbarItemsOr = function (predicate) {
      return function (editor, name, defaultValue) {
        const value = name in editor.settings ? editor.settings[name] : defaultValue
        validDefaultOrDie(defaultValue, predicate)
        return items(value, defaultValue)
      }
    }
    const EditorSettings = { getToolbarItemsOr: getToolbarItemsOr(isString) }

    const getTextSelectionToolbarItems = function (editor) {
      return EditorSettings.getToolbarItemsOr(editor, 'quickbars_selection_toolbar', 'bold forecolor italic | form:link-form h2 h3 blockquote')
    }
    const getInsertToolbarItems = function (editor) {
      return EditorSettings.getToolbarItemsOr(editor, 'quickbars_insert_toolbar', 'quickimage quicktable')
    }
    const Settings = {
      getTextSelectionToolbarItems,
      getInsertToolbarItems,
    }

    const addToEditor = function (editor) {
      editor.ui.registry.addContextToolbar('quickblock', {
        predicate(node) {
          const sugarNode = Element$$1.fromDom(node)
          const textBlockElementsMap = editor.schema.getTextBlockElements()
          const isRoot = function (elem) {
            return elem.dom() === editor.getBody()
          }
          return closest$1(sugarNode, 'table', isRoot).fold(() => closest(sugarNode, (elem) => name(elem) in textBlockElementsMap && editor.dom.isEmpty(elem.dom()), isRoot).isSome(), () => false)
        },
        items: Settings.getInsertToolbarItems(editor),
        position: 'line',
        scope: 'editor',
      })
    }
    const InsertToolbars = { addToEditor }

    const create = function (dom, rng) {
      const bookmark = {}
      function setupEndPoint(start) {
        let offsetNode, container, offset
        container = rng[start ? 'startContainer' : 'endContainer']
        offset = rng[start ? 'startOffset' : 'endOffset']
        if (container.nodeType === 1) {
          offsetNode = dom.create('span', { 'data-mce-type': 'bookmark' })
          if (container.hasChildNodes()) {
            offset = Math.min(offset, container.childNodes.length - 1)
            if (start) {
              container.insertBefore(offsetNode, container.childNodes[offset])
            } else {
              dom.insertAfter(offsetNode, container.childNodes[offset])
            }
          } else {
            container.appendChild(offsetNode)
          }
          container = offsetNode
          offset = 0
        }
        bookmark[start ? 'startContainer' : 'endContainer'] = container
        bookmark[start ? 'startOffset' : 'endOffset'] = offset
      }
      setupEndPoint(true)
      if (!rng.collapsed) {
        setupEndPoint()
      }
      return bookmark
    }
    const resolve$1 = function (dom, bookmark) {
      function restoreEndPoint(start) {
        let container, offset, node
        function nodeIndex(container) {
          let node = container.parentNode.firstChild; let idx = 0
          while (node) {
            if (node === container) {
              return idx
            }
            if (node.nodeType !== 1 || node.getAttribute('data-mce-type') !== 'bookmark') {
              idx++
            }
            node = node.nextSibling
          }
          return -1
        }
        container = node = bookmark[start ? 'startContainer' : 'endContainer']
        offset = bookmark[start ? 'startOffset' : 'endOffset']
        if (!container) {
          return
        }
        if (container.nodeType === 1) {
          offset = nodeIndex(container)
          container = container.parentNode
          dom.remove(node)
        }
        bookmark[start ? 'startContainer' : 'endContainer'] = container
        bookmark[start ? 'startOffset' : 'endOffset'] = offset
      }
      restoreEndPoint(true)
      restoreEndPoint()
      const rng = dom.createRng()
      rng.setStart(bookmark.startContainer, bookmark.startOffset)
      if (bookmark.endContainer) {
        rng.setEnd(bookmark.endContainer, bookmark.endOffset)
      }
      return rng
    }
    const Bookmark = {
      create,
      resolve: resolve$1,
    }

    const global$2 = tinymce.util.Tools.resolve('tinymce.util.Tools')

    const global$3 = tinymce.util.Tools.resolve('tinymce.dom.TreeWalker')

    const global$4 = tinymce.util.Tools.resolve('tinymce.dom.RangeUtils')

    const getSelectedElements = function (rootElm, startNode, endNode) {
      let walker, node
      const elms = []
      walker = new global$3(startNode, rootElm)
      for (node = startNode; node; node = walker.next()) {
        if (node.nodeType === 1) {
          elms.push(node)
        }
        if (node === endNode) {
          break
        }
      }
      return elms
    }
    const unwrapElements = function (editor, elms) {
      let bookmark, dom, selection
      dom = editor.dom
      selection = editor.selection
      bookmark = Bookmark.create(dom, selection.getRng())
      global$2.each(elms, (elm) => {
        editor.dom.remove(elm, true)
      })
      selection.setRng(Bookmark.resolve(dom, bookmark))
    }
    const isLink = function (elm) {
      return elm.nodeName === 'A' && elm.hasAttribute('href')
    }
    const getParentAnchorOrSelf = function (dom, elm) {
      const anchorElm = dom.getParent(elm, isLink)
      return anchorElm || elm
    }
    const getSelectedAnchors = function (editor) {
      let startElm, endElm, rootElm, anchorElms, selection, dom, rng
      selection = editor.selection
      dom = editor.dom
      rng = selection.getRng()
      startElm = getParentAnchorOrSelf(dom, global$4.getNode(rng.startContainer, rng.startOffset))
      endElm = global$4.getNode(rng.endContainer, rng.endOffset)
      rootElm = editor.getBody()
      anchorElms = global$2.grep(getSelectedElements(rootElm, startElm, endElm), isLink)
      return anchorElms
    }
    const unlinkSelection = function (editor) {
      unwrapElements(editor, getSelectedAnchors(editor))
    }
    const Unlink = { unlinkSelection }

    const formatBlock = function (editor, formatName) {
      editor.execCommand('FormatBlock', false, formatName)
    }
    const collapseSelectionToEnd = function (editor) {
      editor.selection.collapse(false)
    }
    const unlink = function (editor) {
      editor.focus()
      Unlink.unlinkSelection(editor)
      collapseSelectionToEnd(editor)
    }
    const changeHref = function (editor, elm, url) {
      editor.focus()
      editor.dom.setAttrib(elm, 'href', url)
      collapseSelectionToEnd(editor)
    }
    const insertLink = function (editor, url) {
      editor.execCommand('mceInsertLink', false, { href: url })
      collapseSelectionToEnd(editor)
    }
    const updateOrInsertLink = function (editor, url) {
      const elm = editor.dom.getParent(editor.selection.getStart(), 'a[href]')
      elm ? changeHref(editor, elm, url) : insertLink(editor, url)
    }
    const createLink = function (editor, url) {
      url.trim().length === 0 ? unlink(editor) : updateOrInsertLink(editor, url)
    }
    const Actions$1 = {
      formatBlock,
      createLink,
      unlink,
    }

    const setupButtons$1 = function (editor) {
      const formatBlock = function (name) {
        return function () {
          Actions$1.formatBlock(editor, name)
        }
      }
      const _loop_1 = function (i) {
        const name = `h${i}`
        editor.ui.registry.addToggleButton(name, {
          text: name.toUpperCase(),
          tooltip: `Heading ${i}`,
          onSetup(buttonApi) {
            return editor.selection.selectorChangedWithUnbind(name, buttonApi.setActive).unbind
          },
          onAction: formatBlock(name),
        })
      }
      for (let i = 1; i < 6; i++) {
        _loop_1(i)
      }
    }
    const SelectionButtons = { setupButtons: setupButtons$1 }

    const addToEditor$1 = function (editor) {
      editor.ui.registry.addContextToolbar('textselection', {
        predicate(node) {
          return !editor.selection.isCollapsed()
        },
        items: Settings.getTextSelectionToolbarItems(editor),
        position: 'selection',
      })
    }
    const SelectionToolbars = { addToEditor: addToEditor$1 }

    global.add('quickbars', (editor) => {
      InsertButtons.setupButtons(editor)
      InsertToolbars.addToEditor(editor)
      SelectionButtons.setupButtons(editor)
      SelectionToolbars.addToEditor(editor)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
