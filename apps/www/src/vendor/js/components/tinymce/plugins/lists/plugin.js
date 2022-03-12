(function () {
  const lists = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    const global$1 = tinymce.util.Tools.resolve('tinymce.dom.RangeUtils')

    const global$2 = tinymce.util.Tools.resolve('tinymce.dom.TreeWalker')

    const global$3 = tinymce.util.Tools.resolve('tinymce.util.VK')

    const global$4 = tinymce.util.Tools.resolve('tinymce.dom.BookmarkManager')

    const global$5 = tinymce.util.Tools.resolve('tinymce.util.Tools')

    const global$6 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils')

    const isTextNode = function (node) {
      return node && node.nodeType === 3
    }
    const isListNode = function (node) {
      return node && /^(OL|UL|DL)$/.test(node.nodeName)
    }
    const isOlUlNode = function (node) {
      return node && /^(OL|UL)$/.test(node.nodeName)
    }
    const isListItemNode = function (node) {
      return node && /^(LI|DT|DD)$/.test(node.nodeName)
    }
    const isDlItemNode = function (node) {
      return node && /^(DT|DD)$/.test(node.nodeName)
    }
    const isTableCellNode = function (node) {
      return node && /^(TH|TD)$/.test(node.nodeName)
    }
    const isBr = function (node) {
      return node && node.nodeName === 'BR'
    }
    const isFirstChild = function (node) {
      return node.parentNode.firstChild === node
    }
    const isLastChild = function (node) {
      return node.parentNode.lastChild === node
    }
    const isTextBlock = function (editor, node) {
      return node && !!editor.schema.getTextBlockElements()[node.nodeName]
    }
    const isBlock = function (node, blockElements) {
      return node && node.nodeName in blockElements
    }
    const isBogusBr = function (dom, node) {
      if (!isBr(node)) {
        return false
      }
      if (dom.isBlock(node.nextSibling) && !isBr(node.previousSibling)) {
        return true
      }
      return false
    }
    const isEmpty = function (dom, elm, keepBookmarks) {
      const empty = dom.isEmpty(elm)
      if (keepBookmarks && dom.select('span[data-mce-type=bookmark]', elm).length > 0) {
        return false
      }
      return empty
    }
    const isChildOfBody = function (dom, elm) {
      return dom.isChildOf(elm, dom.getRoot())
    }
    const NodeType = {
      isTextNode,
      isListNode,
      isOlUlNode,
      isDlItemNode,
      isListItemNode,
      isTableCellNode,
      isBr,
      isFirstChild,
      isLastChild,
      isTextBlock,
      isBlock,
      isBogusBr,
      isEmpty,
      isChildOfBody,
    }

    const getNormalizedPoint = function (container, offset) {
      if (NodeType.isTextNode(container)) {
        return {
          container,
          offset,
        }
      }
      const node = global$1.getNode(container, offset)
      if (NodeType.isTextNode(node)) {
        return {
          container: node,
          offset: offset >= container.childNodes.length ? node.data.length : 0,
        }
      } if (node.previousSibling && NodeType.isTextNode(node.previousSibling)) {
        return {
          container: node.previousSibling,
          offset: node.previousSibling.data.length,
        }
      } if (node.nextSibling && NodeType.isTextNode(node.nextSibling)) {
        return {
          container: node.nextSibling,
          offset: 0,
        }
      }
      return {
        container,
        offset,
      }
    }
    const normalizeRange = function (rng) {
      const outRng = rng.cloneRange()
      const rangeStart = getNormalizedPoint(rng.startContainer, rng.startOffset)
      outRng.setStart(rangeStart.container, rangeStart.offset)
      const rangeEnd = getNormalizedPoint(rng.endContainer, rng.endOffset)
      outRng.setEnd(rangeEnd.container, rangeEnd.offset)
      return outRng
    }
    const Range = {
      getNormalizedPoint,
      normalizeRange,
    }

    const { DOM } = global$6
    const createBookmark = function (rng) {
      const bookmark = {}
      const setupEndPoint = function (start) {
        let offsetNode, container, offset
        container = rng[start ? 'startContainer' : 'endContainer']
        offset = rng[start ? 'startOffset' : 'endOffset']
        if (container.nodeType === 1) {
          offsetNode = DOM.create('span', { 'data-mce-type': 'bookmark' })
          if (container.hasChildNodes()) {
            offset = Math.min(offset, container.childNodes.length - 1)
            if (start) {
              container.insertBefore(offsetNode, container.childNodes[offset])
            } else {
              DOM.insertAfter(offsetNode, container.childNodes[offset])
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
    const resolveBookmark = function (bookmark) {
      function restoreEndPoint(start) {
        let container, offset, node
        const nodeIndex = function (container) {
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
          DOM.remove(node)
          if (!container.hasChildNodes() && DOM.isBlock(container)) {
            container.appendChild(DOM.create('br'))
          }
        }
        bookmark[start ? 'startContainer' : 'endContainer'] = container
        bookmark[start ? 'startOffset' : 'endOffset'] = offset
      }
      restoreEndPoint(true)
      restoreEndPoint()
      const rng = DOM.createRng()
      rng.setStart(bookmark.startContainer, bookmark.startOffset)
      if (bookmark.endContainer) {
        rng.setEnd(bookmark.endContainer, bookmark.endOffset)
      }
      return Range.normalizeRange(rng)
    }
    const Bookmark = {
      createBookmark,
      resolveBookmark,
    }

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
    const not = function (f) {
      return function () {
        const args = []
        for (let _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i]
        }
        return !f.apply(null, args)
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
    const isBoolean = isType('boolean')
    const isFunction = isType('function')
    const isNumber = isType('number')

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
    const groupBy = function (xs, f) {
      if (xs.length === 0) {
        return []
      }
      let wasType = f(xs[0])
      const r = []
      let group = []
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i]
        const type = f(x)
        if (type !== wasType) {
          r.push(group)
          group = []
        }
        wasType = type
        group.push(x)
      }
      if (group.length !== 0) {
        r.push(group)
      }
      return r
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
    const { slice } = Array.prototype
    const reverse = function (xs) {
      const r = slice.call(xs, 0)
      r.reverse()
      return r
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

    const htmlElement = function (scope) {
      return Global$1.getOrDie('HTMLElement', scope)
    }
    const isPrototypeOf = function (x) {
      const scope = resolve('ownerDocument.defaultView', x)
      return htmlElement(scope).prototype.isPrototypeOf(x)
    }
    const HTMLElement = { isPrototypeOf }

    const global$7 = tinymce.util.Tools.resolve('tinymce.dom.DomQuery')

    const getParentList = function (editor) {
      const selectionStart = editor.selection.getStart(true)
      return editor.dom.getParent(selectionStart, 'OL,UL,DL', getClosestListRootElm(editor, selectionStart))
    }
    const isParentListSelected = function (parentList, selectedBlocks) {
      return parentList && selectedBlocks.length === 1 && selectedBlocks[0] === parentList
    }
    const findSubLists = function (parentList) {
      return global$5.grep(parentList.querySelectorAll('ol,ul,dl'), (elm) => NodeType.isListNode(elm))
    }
    const getSelectedSubLists = function (editor) {
      const parentList = getParentList(editor)
      const selectedBlocks = editor.selection.getSelectedBlocks()
      if (isParentListSelected(parentList, selectedBlocks)) {
        return findSubLists(parentList)
      }
      return global$5.grep(selectedBlocks, (elm) => NodeType.isListNode(elm) && parentList !== elm)
    }
    const findParentListItemsNodes = function (editor, elms) {
      const listItemsElms = global$5.map(elms, (elm) => {
        const parentLi = editor.dom.getParent(elm, 'li,dd,dt', getClosestListRootElm(editor, elm))
        return parentLi || elm
      })
      return global$7.unique(listItemsElms)
    }
    const getSelectedListItems = function (editor) {
      const selectedBlocks = editor.selection.getSelectedBlocks()
      return global$5.grep(findParentListItemsNodes(editor, selectedBlocks), (block) => NodeType.isListItemNode(block))
    }
    const getSelectedDlItems = function (editor) {
      return filter(getSelectedListItems(editor), NodeType.isDlItemNode)
    }
    var getClosestListRootElm = function (editor, elm) {
      const parentTableCell = editor.dom.getParents(elm, 'TD,TH')
      const root = parentTableCell.length > 0 ? parentTableCell[0] : editor.getBody()
      return root
    }
    const findLastParentListNode = function (editor, elm) {
      const parentLists = editor.dom.getParents(elm, 'ol,ul', getClosestListRootElm(editor, elm))
      return last(parentLists)
    }
    const getSelectedLists = function (editor) {
      const firstList = findLastParentListNode(editor, editor.selection.getStart())
      const subsequentLists = filter(editor.selection.getSelectedBlocks(), NodeType.isOlUlNode)
      return firstList.toArray().concat(subsequentLists)
    }
    const getSelectedListRoots = function (editor) {
      const selectedLists = getSelectedLists(editor)
      return getUniqueListRoots(editor, selectedLists)
    }
    var getUniqueListRoots = function (editor, lists) {
      const listRoots = map(lists, (list) => findLastParentListNode(editor, list).getOr(list))
      return global$7.unique(listRoots)
    }
    const isList = function (editor) {
      const list = getParentList(editor)
      return HTMLElement.isPrototypeOf(list)
    }
    const Selection = {
      isList,
      getParentList,
      getSelectedSubLists,
      getSelectedListItems,
      getClosestListRootElm,
      getSelectedDlItems,
      getSelectedListRoots,
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

    const { keys } = Object
    const each$1 = function (obj, f) {
      const props = keys(obj)
      for (let k = 0, len = props.length; k < len; k++) {
        const i = props[k]
        const x = obj[i]
        f(x, i, obj)
      }
    }

    const name = function (element) {
      const r = element.dom().nodeName
      return r.toLowerCase()
    }

    const rawSet = function (dom, key, value$$1) {
      if (isString(value$$1) || isBoolean(value$$1) || isNumber(value$$1)) {
        dom.setAttribute(key, `${value$$1}`)
      } else {
        console.error('Invalid call to Attr.set. Key ', key, ':: Value ', value$$1, ':: Element ', dom)
        throw new Error('Attribute value was not simple')
      }
    }
    const setAll = function (element, attrs) {
      const dom = element.dom()
      each$1(attrs, (v, k) => {
        rawSet(dom, k, v)
      })
    }
    const clone = function (element) {
      return foldl(element.dom().attributes, (acc, attr) => {
        acc[attr.name] = attr.value
        return acc
      }, {})
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

    const parent = function (element) {
      const dom = element.dom()
      return Option.from(dom.parentNode).map(Element$$1.fromDom)
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
    const spot = Immutable('element', 'offset')

    const before = function (marker, element) {
      const parent$$1 = parent(marker)
      parent$$1.each((v) => {
        v.dom().insertBefore(element.dom(), marker.dom())
      })
    }
    const append = function (parent$$1, element) {
      parent$$1.dom().appendChild(element.dom())
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

    const remove$1 = function (element) {
      const dom = element.dom()
      if (dom.parentNode !== null) {
        dom.parentNode.removeChild(dom)
      }
    }

    const clone$1 = function (original, isDeep) {
      return Element$$1.fromDom(original.dom().cloneNode(isDeep))
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
    const mutate = function (original, tag) {
      const nu = shallowAs(original, tag)
      before(original, nu)
      const children$$1 = children(original)
      append$1(nu, children$$1)
      remove$1(original)
      return nu
    }

    const global$8 = tinymce.util.Tools.resolve('tinymce.Env')

    const DOM$1 = global$6.DOM
    const createNewTextBlock = function (editor, contentNode, blockName) {
      let node, textBlock
      const fragment = DOM$1.createFragment()
      let hasContentNode
      const blockElements = editor.schema.getBlockElements()
      if (editor.settings.forced_root_block) {
        blockName = blockName || editor.settings.forced_root_block
      }
      if (blockName) {
        textBlock = DOM$1.create(blockName)
        if (textBlock.tagName === editor.settings.forced_root_block) {
          DOM$1.setAttribs(textBlock, editor.settings.forced_root_block_attrs)
        }
        if (!NodeType.isBlock(contentNode.firstChild, blockElements)) {
          fragment.appendChild(textBlock)
        }
      }
      if (contentNode) {
        while (node = contentNode.firstChild) {
          const { nodeName } = node
          if (!hasContentNode && (nodeName !== 'SPAN' || node.getAttribute('data-mce-type') !== 'bookmark')) {
            hasContentNode = true
          }
          if (NodeType.isBlock(node, blockElements)) {
            fragment.appendChild(node)
            textBlock = null
          } else if (blockName) {
            if (!textBlock) {
              textBlock = DOM$1.create(blockName)
              fragment.appendChild(textBlock)
            }
            textBlock.appendChild(node)
          } else {
            fragment.appendChild(node)
          }
        }
      }
      if (!editor.settings.forced_root_block) {
        fragment.appendChild(DOM$1.create('br'))
      } else if (!hasContentNode && (!global$8.ie || global$8.ie > 10)) {
        textBlock.appendChild(DOM$1.create('br', { 'data-mce-bogus': '1' }))
      }
      return fragment
    }
    const TextBlock = { createNewTextBlock }

    const DOM$2 = global$6.DOM
    const splitList = function (editor, ul, li, newBlock) {
      let tmpRng, fragment, bookmarks, node
      const removeAndKeepBookmarks = function (targetNode) {
        global$5.each(bookmarks, (node) => {
          targetNode.parentNode.insertBefore(node, li.parentNode)
        })
        DOM$2.remove(targetNode)
      }
      bookmarks = DOM$2.select('span[data-mce-type="bookmark"]', ul)
      newBlock = newBlock || TextBlock.createNewTextBlock(editor, li)
      tmpRng = DOM$2.createRng()
      tmpRng.setStartAfter(li)
      tmpRng.setEndAfter(ul)
      fragment = tmpRng.extractContents()
      for (node = fragment.firstChild; node; node = node.firstChild) {
        if (node.nodeName === 'LI' && editor.dom.isEmpty(node)) {
          DOM$2.remove(node)
          break
        }
      }
      if (!editor.dom.isEmpty(fragment)) {
        DOM$2.insertAfter(fragment, ul)
      }
      DOM$2.insertAfter(newBlock, ul)
      if (NodeType.isEmpty(editor.dom, li.parentNode)) {
        removeAndKeepBookmarks(li.parentNode)
      }
      DOM$2.remove(li)
      if (NodeType.isEmpty(editor.dom, ul)) {
        DOM$2.remove(ul)
      }
    }
    const SplitList = { splitList }

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

    const fromElements = function (elements, scope) {
      const doc = scope || document
      const fragment = doc.createDocumentFragment()
      each(elements, (element) => {
        fragment.appendChild(element.dom())
      })
      return Element$$1.fromDom(fragment)
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
    const set$1 = function (element, property, value$$1) {
      const dom = element.dom()
      internalSet(dom, property, value$$1)
    }

    const createSection = function (scope, listType) {
      const section = {
        list: Element$$1.fromTag(listType, scope),
        item: Element$$1.fromTag('li', scope),
      }
      append(section.list, section.item)
      return section
    }
    const joinSections = function (parent, appendor) {
      append(parent.item, appendor.list)
    }
    const createJoinedSections = function (scope, length, listType) {
      const sections = []
      const _loop_1 = function (i) {
        const newSection = createSection(scope, listType)
        last(sections).each((lastSection) => joinSections(lastSection, newSection))
        sections.push(newSection)
      }
      for (let i = 0; i < length; i++) {
        _loop_1(i)
      }
      return sections
    }
    const normalizeSection = function (section, entry) {
      if (name(section.list).toUpperCase() !== entry.listType) {
        section.list = mutate(section.list, entry.listType)
      }
      setAll(section.list, entry.listAttributes)
    }
    const createItem = function (scope, attr, content) {
      const item = Element$$1.fromTag('li', scope)
      setAll(item, attr)
      append$1(item, content)
      return item
    }
    const setItem = function (section, item) {
      append(section.list, item)
      section.item = item
    }
    const writeShallow = function (scope, outline, entry) {
      const newOutline = outline.slice(0, entry.depth)
      last(newOutline).each((section) => {
        setItem(section, createItem(scope, entry.itemAttributes, entry.content))
        normalizeSection(section, entry)
      })
      return newOutline
    }
    const populateSections = function (sections, entry) {
      last(sections).each((section) => {
        setAll(section.list, entry.listAttributes)
        setAll(section.item, entry.itemAttributes)
        append$1(section.item, entry.content)
      })
      for (let i = 0; i < sections.length - 1; i++) {
        set$1(sections[i].item, 'list-style-type', 'none')
      }
    }
    const writeDeep = function (scope, outline, entry) {
      const newSections = createJoinedSections(scope, entry.depth - outline.length, entry.listType)
      populateSections(newSections, entry)
      liftN([
        last(outline),
        head(newSections),
      ], joinSections)
      return outline.concat(newSections)
    }
    const composeList = function (scope, entries) {
      const outline = foldl(entries, (outline, entry) => entry.depth > outline.length ? writeDeep(scope, outline, entry) : writeShallow(scope, outline, entry), [])
      return head(outline).map((section) => section.list)
    }

    const isIndented = function (entry) {
      return entry.depth > 0
    }
    const isSelected = function (entry) {
      return entry.isSelected
    }

    const indentEntry = function (indentation, entry) {
      switch (indentation) {
        case 'Indent':
          entry.depth++
          break
        case 'Outdent':
          entry.depth--
          break
        case 'Flatten':
          entry.depth = 0
      }
    }

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
    const merge = baseMerge(shallow$1)

    const assimilateEntry = function (adherent, source) {
      adherent.listType = source.listType
      adherent.listAttributes = merge({}, source.listAttributes)
    }
    const normalizeShallow = function (outline, entry) {
      const matchingEntryDepth = entry.depth - 1
      outline[matchingEntryDepth].each((matchingEntry) => assimilateEntry(entry, matchingEntry))
      const newOutline = outline.slice(0, matchingEntryDepth)
      newOutline.push(Option.some(entry))
      return newOutline
    }
    const normalizeDeep = function (outline, entry) {
      const newOutline = outline.slice(0)
      const diff = entry.depth - outline.length
      for (let i = 1; i < diff; i++) {
        newOutline.push(Option.none())
      }
      newOutline.push(Option.some(entry))
      return newOutline
    }
    const normalizeEntries = function (entries) {
      foldl(entries, (outline, entry) => entry.depth > outline.length ? normalizeDeep(outline, entry) : normalizeShallow(outline, entry), [])
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

    let ListType;
    (function (ListType) {
      ListType.OL = 'OL'
      ListType.UL = 'UL'
      ListType.DL = 'DL'
    }(ListType || (ListType = {})))
    const getListType = function (list) {
      switch (name(list)) {
        case 'ol':
          return Option.some(ListType.OL)
        case 'ul':
          return Option.some(ListType.UL)
        case 'dl':
          return Option.some(ListType.DL)
        default:
          return Option.none()
      }
    }
    const isList$1 = function (el) {
      return is$1(el, 'OL,UL,DL')
    }

    const hasFirstChildList = function (li) {
      return firstChild(li).map(isList$1).getOr(false)
    }
    const hasLastChildList = function (li) {
      return lastChild(li).map(isList$1).getOr(false)
    }

    const getItemContent = function (li) {
      const childNodes = children(li)
      const contentLength = childNodes.length + (hasLastChildList(li) ? -1 : 0)
      return map(childNodes.slice(0, contentLength), deep)
    }
    const createEntry = function (li, depth, isSelected) {
      const list = parent(li)
      return {
        depth,
        isSelected,
        content: getItemContent(li),
        listType: list.bind(getListType).getOr(ListType.OL),
        listAttributes: list.map(clone).getOr({}),
        itemAttributes: clone(li),
      }
    }
    const parseItem = function (depth, itemSelection, selectionState, item) {
      const curriedParseList = curry(parseList, depth, itemSelection, selectionState)
      const updateSelectionState = function (itemRange) {
        return itemSelection.each((selection) => {
          if (eq(itemRange === 'Start' ? selection.start : selection.end, item)) {
            selectionState.set(itemRange === 'Start')
          }
        })
      }
      return firstChild(item).filter(isList$1).fold(() => {
        updateSelectionState('Start')
        const fromCurrentItem = createEntry(item, depth, selectionState.get())
        updateSelectionState('End')
        const fromChildList = lastChild(item).filter(isList$1).map(curriedParseList).getOr([])
        return [fromCurrentItem].concat(fromChildList)
      }, curriedParseList)
    }
    var parseList = function (depth, itemSelection, selectionState, list) {
      const newDepth = depth + 1
      return bind(children(list), (child$$1) => isList$1(child$$1) ? parseList(newDepth, itemSelection, selectionState, child$$1) : parseItem(newDepth, itemSelection, selectionState, child$$1))
    }
    const parseLists = function (lists, itemSelection) {
      const selectionState = Cell(false)
      const initialDepth = 0
      return map(lists, (list) => ({
        entries: parseList(initialDepth, itemSelection, selectionState, list),
        sourceList: list,
      }))
    }

    const fireListEvent = function (editor, action, element) {
      return editor.fire('ListMutation', {
        action,
        element,
      })
    }

    const outdentedComposer = function (editor, entries) {
      return map(entries, (entry) => {
        const content = fromElements(entry.content)
        return Element$$1.fromDom(TextBlock.createNewTextBlock(editor, content.dom()))
      })
    }
    const indentedComposer = function (editor, entries) {
      normalizeEntries(entries)
      return composeList(editor.contentDocument, entries).toArray()
    }
    const composeEntries = function (editor, entries) {
      return bind(groupBy(entries, isIndented), (entries) => {
        const groupIsIndented = head(entries).map(isIndented).getOr(false)
        return groupIsIndented ? indentedComposer(editor, entries) : outdentedComposer(editor, entries)
      })
    }
    const indentSelectedEntries = function (entries, indentation) {
      each(filter(entries, isSelected), (entry) => indentEntry(indentation, entry))
    }
    const getItemSelection = function (editor) {
      const selectedListItems = map(Selection.getSelectedListItems(editor), Element$$1.fromDom)
      return liftN([
        find(selectedListItems, not(hasFirstChildList)),
        find(reverse(selectedListItems), not(hasFirstChildList)),
      ], (start, end) => ({
        start,
        end,
      }))
    }
    const listsIndentation = function (editor, lists, indentation) {
      const parsedLists = parseLists(lists, getItemSelection(editor))
      each(parsedLists, (entrySet) => {
        indentSelectedEntries(entrySet.entries, indentation)
        const composedLists = composeEntries(editor, entrySet.entries)
        each(composedLists, (composedList) => {
          fireListEvent(editor, indentation === 'Indent' ? 'IndentList' : 'OutdentList', composedList.dom())
        })
        before$1(entrySet.sourceList, composedLists)
        remove$1(entrySet.sourceList)
      })
    }

    const outdentDlItem = function (editor, item) {
      if (is$1(item, 'DD')) {
        mutate(item, 'DT')
      } else if (is$1(item, 'DT')) {
        parent(item).each((dl) => SplitList.splitList(editor, dl.dom(), item.dom()))
      }
    }
    const indentDlItem = function (item) {
      if (is$1(item, 'DT')) {
        mutate(item, 'DD')
      }
    }
    const dlIndentation = function (editor, indentation, dlItems) {
      if (indentation === 'Indent') {
        each(dlItems, indentDlItem)
      } else {
        each(dlItems, (item) => outdentDlItem(editor, item))
      }
    }
    const selectionIndentation = function (editor, indentation) {
      const dlItems = map(Selection.getSelectedDlItems(editor), Element$$1.fromDom)
      const lists = map(Selection.getSelectedListRoots(editor), Element$$1.fromDom)
      if (dlItems.length || lists.length) {
        const bookmark = editor.selection.getBookmark()
        dlIndentation(editor, indentation, dlItems)
        listsIndentation(editor, lists, indentation)
        editor.selection.moveToBookmark(bookmark)
        editor.selection.setRng(Range.normalizeRange(editor.selection.getRng()))
        editor.nodeChanged()
      }
    }
    const indentListSelection = function (editor) {
      selectionIndentation(editor, 'Indent')
    }
    const outdentListSelection = function (editor) {
      selectionIndentation(editor, 'Outdent')
    }
    const flattenListSelection = function (editor) {
      selectionIndentation(editor, 'Flatten')
    }

    const isCustomList = function (list) {
      return /\btox\-/.test(list.className)
    }

    const listToggleActionFromListName = function (listName) {
      switch (listName) {
        case 'UL':
          return 'ToggleUlList'
        case 'OL':
          return 'ToggleOlList'
        case 'DL':
          return 'ToggleDLList'
      }
    }

    const updateListStyle = function (dom, el, detail) {
      const type = detail['list-style-type'] ? detail['list-style-type'] : null
      dom.setStyle(el, 'list-style-type', type)
    }
    const setAttribs = function (elm, attrs) {
      global$5.each(attrs, (value, key) => {
        elm.setAttribute(key, value)
      })
    }
    const updateListAttrs = function (dom, el, detail) {
      setAttribs(el, detail['list-attributes'])
      global$5.each(dom.select('li', el), (li) => {
        setAttribs(li, detail['list-item-attributes'])
      })
    }
    const updateListWithDetails = function (dom, el, detail) {
      updateListStyle(dom, el, detail)
      updateListAttrs(dom, el, detail)
    }
    const removeStyles = function (dom, element, styles) {
      global$5.each(styles, (style) => {
        let _a
        return dom.setStyle(element, (_a = {}, _a[style] = '', _a))
      })
    }
    const getEndPointNode = function (editor, rng, start, root) {
      let container, offset
      container = rng[start ? 'startContainer' : 'endContainer']
      offset = rng[start ? 'startOffset' : 'endOffset']
      if (container.nodeType === 1) {
        container = container.childNodes[Math.min(offset, container.childNodes.length - 1)] || container
      }
      if (!start && NodeType.isBr(container.nextSibling)) {
        container = container.nextSibling
      }
      while (container.parentNode !== root) {
        if (NodeType.isTextBlock(editor, container)) {
          return container
        }
        if (/^(TD|TH)$/.test(container.parentNode.nodeName)) {
          return container
        }
        container = container.parentNode
      }
      return container
    }
    const getSelectedTextBlocks = function (editor, rng, root) {
      const textBlocks = []; const { dom } = editor
      const startNode = getEndPointNode(editor, rng, true, root)
      const endNode = getEndPointNode(editor, rng, false, root)
      let block
      const siblings = []
      for (let node = startNode; node; node = node.nextSibling) {
        siblings.push(node)
        if (node === endNode) {
          break
        }
      }
      global$5.each(siblings, (node) => {
        if (NodeType.isTextBlock(editor, node)) {
          textBlocks.push(node)
          block = null
          return
        }
        if (dom.isBlock(node) || NodeType.isBr(node)) {
          if (NodeType.isBr(node)) {
            dom.remove(node)
          }
          block = null
          return
        }
        const { nextSibling } = node
        if (global$4.isBookmarkNode(node)) {
          if (NodeType.isTextBlock(editor, nextSibling) || !nextSibling && node.parentNode === root) {
            block = null
            return
          }
        }
        if (!block) {
          block = dom.create('p')
          node.parentNode.insertBefore(block, node)
          textBlocks.push(block)
        }
        block.appendChild(node)
      })
      return textBlocks
    }
    const hasCompatibleStyle = function (dom, sib, detail) {
      const sibStyle = dom.getStyle(sib, 'list-style-type')
      let detailStyle = detail ? detail['list-style-type'] : ''
      detailStyle = detailStyle === null ? '' : detailStyle
      return sibStyle === detailStyle
    }
    const applyList = function (editor, listName, detail) {
      if (detail === void 0) {
        detail = {}
      }
      const rng = editor.selection.getRng(true)
      let bookmark
      let listItemName = 'LI'
      const root = Selection.getClosestListRootElm(editor, editor.selection.getStart(true))
      const { dom } = editor
      if (dom.getContentEditable(editor.selection.getNode()) === 'false') {
        return
      }
      listName = listName.toUpperCase()
      if (listName === 'DL') {
        listItemName = 'DT'
      }
      bookmark = Bookmark.createBookmark(rng)
      global$5.each(getSelectedTextBlocks(editor, rng, root), (block) => {
        let listBlock, sibling
        sibling = block.previousSibling
        if (sibling && NodeType.isListNode(sibling) && sibling.nodeName === listName && hasCompatibleStyle(dom, sibling, detail)) {
          listBlock = sibling
          block = dom.rename(block, listItemName)
          sibling.appendChild(block)
        } else {
          listBlock = dom.create(listName)
          block.parentNode.insertBefore(listBlock, block)
          listBlock.appendChild(block)
          block = dom.rename(block, listItemName)
        }
        removeStyles(dom, block, [
          'margin',
          'margin-right',
          'margin-bottom',
          'margin-left',
          'margin-top',
          'padding',
          'padding-right',
          'padding-bottom',
          'padding-left',
          'padding-top',
        ])
        updateListWithDetails(dom, listBlock, detail)
        mergeWithAdjacentLists(editor.dom, listBlock)
      })
      editor.selection.setRng(Bookmark.resolveBookmark(bookmark))
    }
    const isValidLists = function (list1, list2) {
      return list1 && list2 && NodeType.isListNode(list1) && list1.nodeName === list2.nodeName
    }
    const hasSameListStyle = function (dom, list1, list2) {
      const targetStyle = dom.getStyle(list1, 'list-style-type', true)
      const style = dom.getStyle(list2, 'list-style-type', true)
      return targetStyle === style
    }
    const hasSameClasses = function (elm1, elm2) {
      return elm1.className === elm2.className
    }
    const shouldMerge = function (dom, list1, list2) {
      return isValidLists(list1, list2) && hasSameListStyle(dom, list1, list2) && hasSameClasses(list1, list2)
    }
    var mergeWithAdjacentLists = function (dom, listBlock) {
      let sibling, node
      sibling = listBlock.nextSibling
      if (shouldMerge(dom, listBlock, sibling)) {
        while (node = sibling.firstChild) {
          listBlock.appendChild(node)
        }
        dom.remove(sibling)
      }
      sibling = listBlock.previousSibling
      if (shouldMerge(dom, listBlock, sibling)) {
        while (node = sibling.lastChild) {
          listBlock.insertBefore(node, listBlock.firstChild)
        }
        dom.remove(sibling)
      }
    }
    const updateList = function (editor, list, listName, detail) {
      if (list.nodeName !== listName) {
        const newList = editor.dom.rename(list, listName)
        updateListWithDetails(editor.dom, newList, detail)
        fireListEvent(editor, listToggleActionFromListName(listName), newList)
      } else {
        updateListWithDetails(editor.dom, list, detail)
        fireListEvent(editor, listToggleActionFromListName(listName), list)
      }
    }
    const toggleMultipleLists = function (editor, parentList, lists, listName, detail) {
      if (parentList.nodeName === listName && !hasListStyleDetail(detail)) {
        flattenListSelection(editor)
      } else {
        const bookmark = Bookmark.createBookmark(editor.selection.getRng(true))
        global$5.each([parentList].concat(lists), (elm) => {
          updateList(editor, elm, listName, detail)
        })
        editor.selection.setRng(Bookmark.resolveBookmark(bookmark))
      }
    }
    var hasListStyleDetail = function (detail) {
      return 'list-style-type' in detail
    }
    const toggleSingleList = function (editor, parentList, listName, detail) {
      if (parentList === editor.getBody()) {
        return
      }
      if (parentList) {
        if (parentList.nodeName === listName && !hasListStyleDetail(detail) && !isCustomList(parentList)) {
          flattenListSelection(editor)
        } else {
          const bookmark = Bookmark.createBookmark(editor.selection.getRng(true))
          updateListWithDetails(editor.dom, parentList, detail)
          const newList = editor.dom.rename(parentList, listName)
          mergeWithAdjacentLists(editor.dom, newList)
          editor.selection.setRng(Bookmark.resolveBookmark(bookmark))
          fireListEvent(editor, listToggleActionFromListName(listName), newList)
        }
      } else {
        applyList(editor, listName, detail)
        fireListEvent(editor, listToggleActionFromListName(listName), parentList)
      }
    }
    const toggleList = function (editor, listName, detail) {
      const parentList = Selection.getParentList(editor)
      const selectedSubLists = Selection.getSelectedSubLists(editor)
      detail = detail || {}
      if (parentList && selectedSubLists.length > 0) {
        toggleMultipleLists(editor, parentList, selectedSubLists, listName, detail)
      } else {
        toggleSingleList(editor, parentList, listName, detail)
      }
    }
    const ToggleList = {
      toggleList,
      mergeWithAdjacentLists,
    }

    const DOM$3 = global$6.DOM
    const normalizeList = function (dom, ul) {
      let sibling
      const { parentNode } = ul
      if (parentNode.nodeName === 'LI' && parentNode.firstChild === ul) {
        sibling = parentNode.previousSibling
        if (sibling && sibling.nodeName === 'LI') {
          sibling.appendChild(ul)
          if (NodeType.isEmpty(dom, parentNode)) {
            DOM$3.remove(parentNode)
          }
        } else {
          DOM$3.setStyle(parentNode, 'listStyleType', 'none')
        }
      }
      if (NodeType.isListNode(parentNode)) {
        sibling = parentNode.previousSibling
        if (sibling && sibling.nodeName === 'LI') {
          sibling.appendChild(ul)
        }
      }
    }
    const normalizeLists = function (dom, element) {
      global$5.each(global$5.grep(dom.select('ol,ul', element)), (ul) => {
        normalizeList(dom, ul)
      })
    }
    const NormalizeLists = {
      normalizeList,
      normalizeLists,
    }

    const findNextCaretContainer = function (editor, rng, isForward, root) {
      let node = rng.startContainer
      const offset = rng.startOffset
      let nonEmptyBlocks, walker
      if (node.nodeType === 3 && (isForward ? offset < node.data.length : offset > 0)) {
        return node
      }
      nonEmptyBlocks = editor.schema.getNonEmptyElements()
      if (node.nodeType === 1) {
        node = global$1.getNode(node, offset)
      }
      walker = new global$2(node, root)
      if (isForward) {
        if (NodeType.isBogusBr(editor.dom, node)) {
          walker.next()
        }
      }
      while (node = walker[isForward ? 'next' : 'prev2']()) {
        if (node.nodeName === 'LI' && !node.hasChildNodes()) {
          return node
        }
        if (nonEmptyBlocks[node.nodeName]) {
          return node
        }
        if (node.nodeType === 3 && node.data.length > 0) {
          return node
        }
      }
    }
    const hasOnlyOneBlockChild = function (dom, elm) {
      const { childNodes } = elm
      return childNodes.length === 1 && !NodeType.isListNode(childNodes[0]) && dom.isBlock(childNodes[0])
    }
    const unwrapSingleBlockChild = function (dom, elm) {
      if (hasOnlyOneBlockChild(dom, elm)) {
        dom.remove(elm.firstChild, true)
      }
    }
    const moveChildren = function (dom, fromElm, toElm) {
      let node, targetElm
      targetElm = hasOnlyOneBlockChild(dom, toElm) ? toElm.firstChild : toElm
      unwrapSingleBlockChild(dom, fromElm)
      if (!NodeType.isEmpty(dom, fromElm, true)) {
        while (node = fromElm.firstChild) {
          targetElm.appendChild(node)
        }
      }
    }
    const mergeLiElements = function (dom, fromElm, toElm) {
      let node, listNode
      const ul = fromElm.parentNode
      if (!NodeType.isChildOfBody(dom, fromElm) || !NodeType.isChildOfBody(dom, toElm)) {
        return
      }
      if (NodeType.isListNode(toElm.lastChild)) {
        listNode = toElm.lastChild
      }
      if (ul === toElm.lastChild) {
        if (NodeType.isBr(ul.previousSibling)) {
          dom.remove(ul.previousSibling)
        }
      }
      node = toElm.lastChild
      if (node && NodeType.isBr(node) && fromElm.hasChildNodes()) {
        dom.remove(node)
      }
      if (NodeType.isEmpty(dom, toElm, true)) {
        dom.$(toElm).empty()
      }
      moveChildren(dom, fromElm, toElm)
      if (listNode) {
        toElm.appendChild(listNode)
      }
      dom.remove(fromElm)
      if (NodeType.isEmpty(dom, ul) && ul !== dom.getRoot()) {
        dom.remove(ul)
      }
    }
    const mergeIntoEmptyLi = function (editor, fromLi, toLi) {
      editor.dom.$(toLi).empty()
      mergeLiElements(editor.dom, fromLi, toLi)
      editor.selection.setCursorLocation(toLi)
    }
    const mergeForward = function (editor, rng, fromLi, toLi) {
      const { dom } = editor
      if (dom.isEmpty(toLi)) {
        mergeIntoEmptyLi(editor, fromLi, toLi)
      } else {
        const bookmark = Bookmark.createBookmark(rng)
        mergeLiElements(dom, fromLi, toLi)
        editor.selection.setRng(Bookmark.resolveBookmark(bookmark))
      }
    }
    const mergeBackward = function (editor, rng, fromLi, toLi) {
      const bookmark = Bookmark.createBookmark(rng)
      mergeLiElements(editor.dom, fromLi, toLi)
      const resolvedBookmark = Bookmark.resolveBookmark(bookmark)
      editor.selection.setRng(resolvedBookmark)
    }
    const backspaceDeleteFromListToListCaret = function (editor, isForward) {
      const { dom } = editor; const { selection } = editor
      const selectionStartElm = selection.getStart()
      const root = Selection.getClosestListRootElm(editor, selectionStartElm)
      const li = dom.getParent(selection.getStart(), 'LI', root)
      let ul, rng, otherLi
      if (li) {
        ul = li.parentNode
        if (ul === editor.getBody() && NodeType.isEmpty(dom, ul)) {
          return true
        }
        rng = Range.normalizeRange(selection.getRng(true))
        otherLi = dom.getParent(findNextCaretContainer(editor, rng, isForward, root), 'LI', root)
        if (otherLi && otherLi !== li) {
          if (isForward) {
            mergeForward(editor, rng, otherLi, li)
          } else {
            mergeBackward(editor, rng, li, otherLi)
          }
          return true
        } if (!otherLi) {
          if (!isForward) {
            flattenListSelection(editor)
            return true
          }
        }
      }
      return false
    }
    const removeBlock = function (dom, block, root) {
      const parentBlock = dom.getParent(block.parentNode, dom.isBlock, root)
      dom.remove(block)
      if (parentBlock && dom.isEmpty(parentBlock)) {
        dom.remove(parentBlock)
      }
    }
    const backspaceDeleteIntoListCaret = function (editor, isForward) {
      const { dom } = editor
      const selectionStartElm = editor.selection.getStart()
      const root = Selection.getClosestListRootElm(editor, selectionStartElm)
      const block = dom.getParent(selectionStartElm, dom.isBlock, root)
      if (block && dom.isEmpty(block)) {
        const rng = Range.normalizeRange(editor.selection.getRng(true))
        const otherLi_1 = dom.getParent(findNextCaretContainer(editor, rng, isForward, root), 'LI', root)
        if (otherLi_1) {
          editor.undoManager.transact(() => {
            removeBlock(dom, block, root)
            ToggleList.mergeWithAdjacentLists(dom, otherLi_1.parentNode)
            editor.selection.select(otherLi_1, true)
            editor.selection.collapse(isForward)
          })
          return true
        }
      }
      return false
    }
    const backspaceDeleteCaret = function (editor, isForward) {
      return backspaceDeleteFromListToListCaret(editor, isForward) || backspaceDeleteIntoListCaret(editor, isForward)
    }
    const backspaceDeleteRange = function (editor) {
      const selectionStartElm = editor.selection.getStart()
      const root = Selection.getClosestListRootElm(editor, selectionStartElm)
      const startListParent = editor.dom.getParent(selectionStartElm, 'LI,DT,DD', root)
      if (startListParent || Selection.getSelectedListItems(editor).length > 0) {
        editor.undoManager.transact(() => {
          editor.execCommand('Delete')
          NormalizeLists.normalizeLists(editor.dom, editor.getBody())
        })
        return true
      }
      return false
    }
    const backspaceDelete = function (editor, isForward) {
      return editor.selection.isCollapsed() ? backspaceDeleteCaret(editor, isForward) : backspaceDeleteRange(editor)
    }
    const setup = function (editor) {
      editor.on('keydown', (e) => {
        if (e.keyCode === global$3.BACKSPACE) {
          if (backspaceDelete(editor, false)) {
            e.preventDefault()
          }
        } else if (e.keyCode === global$3.DELETE) {
          if (backspaceDelete(editor, true)) {
            e.preventDefault()
          }
        }
      })
    }
    const Delete = {
      setup,
      backspaceDelete,
    }

    const get$3 = function (editor) {
      return {
        backspaceDelete(isForward) {
          Delete.backspaceDelete(editor, isForward)
        },
      }
    }
    const Api = { get: get$3 }

    const queryListCommandState = function (editor, listName) {
      return function () {
        const parentList = editor.dom.getParent(editor.selection.getStart(), 'UL,OL,DL')
        return parentList && parentList.nodeName === listName
      }
    }
    const register = function (editor) {
      editor.on('BeforeExecCommand', (e) => {
        const cmd = e.command.toLowerCase()
        if (cmd === 'indent') {
          indentListSelection(editor)
        } else if (cmd === 'outdent') {
          outdentListSelection(editor)
        }
      })
      editor.addCommand('InsertUnorderedList', (ui, detail) => {
        ToggleList.toggleList(editor, 'UL', detail)
      })
      editor.addCommand('InsertOrderedList', (ui, detail) => {
        ToggleList.toggleList(editor, 'OL', detail)
      })
      editor.addCommand('InsertDefinitionList', (ui, detail) => {
        ToggleList.toggleList(editor, 'DL', detail)
      })
      editor.addCommand('RemoveList', () => {
        flattenListSelection(editor)
      })
      editor.addQueryStateHandler('InsertUnorderedList', queryListCommandState(editor, 'UL'))
      editor.addQueryStateHandler('InsertOrderedList', queryListCommandState(editor, 'OL'))
      editor.addQueryStateHandler('InsertDefinitionList', queryListCommandState(editor, 'DL'))
    }
    const Commands = { register }

    const shouldIndentOnTab = function (editor) {
      return editor.getParam('lists_indent_on_tab', true)
    }
    const Settings = { shouldIndentOnTab }

    const setupTabKey = function (editor) {
      editor.on('keydown', (e) => {
        if (e.keyCode !== global$3.TAB || global$3.metaKeyPressed(e)) {
          return
        }
        if (Selection.isList(editor)) {
          e.preventDefault()
          editor.undoManager.transact(() => {
            if (e.shiftKey) {
              outdentListSelection(editor)
            } else {
              indentListSelection(editor)
            }
          })
        }
      })
    }
    const setup$1 = function (editor) {
      if (Settings.shouldIndentOnTab(editor)) {
        setupTabKey(editor)
      }
      Delete.setup(editor)
    }
    const Keyboard = { setup: setup$1 }

    const findIndex$2 = function (list, predicate) {
      for (let index = 0; index < list.length; index++) {
        const element = list[index]
        if (predicate(element)) {
          return index
        }
      }
      return -1
    }
    const listState = function (editor, listName) {
      return function (buttonApi) {
        const nodeChangeHandler = function (e) {
          const tableCellIndex = findIndex$2(e.parents, NodeType.isTableCellNode)
          const parents = tableCellIndex !== -1 ? e.parents.slice(0, tableCellIndex) : e.parents
          const lists = global$5.grep(parents, NodeType.isListNode)
          buttonApi.setActive(lists.length > 0 && lists[0].nodeName === listName && !isCustomList(lists[0]))
        }
        editor.on('NodeChange', nodeChangeHandler)
        return function () {
          return editor.off('NodeChange', nodeChangeHandler)
        }
      }
    }
    const register$1 = function (editor) {
      const hasPlugin = function (editor, plugin) {
        const plugins = editor.settings.plugins ? editor.settings.plugins : ''
        return global$5.inArray(plugins.split(/[ ,]/), plugin) !== -1
      }
      const exec = function (command) {
        return function () {
          return editor.execCommand(command)
        }
      }
      if (!hasPlugin(editor, 'advlist')) {
        editor.ui.registry.addToggleButton('numlist', {
          icon: 'ordered-list',
          active: false,
          tooltip: 'Numbered list',
          onAction: exec('InsertOrderedList'),
          onSetup: listState(editor, 'OL'),
        })
        editor.ui.registry.addToggleButton('bullist', {
          icon: 'unordered-list',
          active: false,
          tooltip: 'Bullet list',
          onAction: exec('InsertUnorderedList'),
          onSetup: listState(editor, 'UL'),
        })
      }
    }
    const Buttons = { register: register$1 }

    global.add('lists', (editor) => {
      Keyboard.setup(editor)
      Buttons.register(editor)
      Commands.register(editor)
      return Api.get(editor)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
