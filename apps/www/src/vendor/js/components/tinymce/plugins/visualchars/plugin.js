(function () {
  const visualchars = (function () {
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

    const get = function (toggleState) {
      const isEnabled = function () {
        return toggleState.get()
      }
      return { isEnabled }
    }
    const Api = { get }

    const fireVisualChars = function (editor, state) {
      return editor.fire('VisualChars', { state })
    }
    const Events = { fireVisualChars }

    const charMap = {
      '\xA0': 'nbsp',
      '\xAD': 'shy',
    }
    const charMapToRegExp = function (charMap, global) {
      let key; let regExp = ''
      for (key in charMap) {
        regExp += key
      }
      return new RegExp(`[${regExp}]`, global ? 'g' : '')
    }
    const charMapToSelector = function (charMap) {
      let key; let selector = ''
      for (key in charMap) {
        if (selector) {
          selector += ','
        }
        selector += `span.mce-${charMap[key]}`
      }
      return selector
    }
    const Data = {
      charMap,
      regExp: charMapToRegExp(charMap),
      regExpGlobal: charMapToRegExp(charMap, true),
      selector: charMapToSelector(charMap),
      charMapToRegExp,
      charMapToSelector,
    }

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
    const { slice } = Array.prototype
    const from$1 = isFunction(Array.from) ? Array.from : function (x) {
      return slice.call(x)
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

    const type = function (element) {
      return element.dom().nodeType
    }
    const value = function (element) {
      return element.dom().nodeValue
    }
    const isType$1 = function (t) {
      return function (element) {
        return type(element) === t
      }
    }
    const isText = isType$1(TEXT)

    const wrapCharWithSpan = function (value) {
      return `<span data-mce-bogus="1" class="mce-${Data.charMap[value]}">${value}</span>`
    }
    const Html = { wrapCharWithSpan }

    const isMatch = function (n) {
      return isText(n) && value(n) !== undefined && Data.regExp.test(value(n))
    }
    var filterDescendants = function (scope, predicate) {
      let result = []
      const dom = scope.dom()
      const children = map(dom.childNodes, Element$$1.fromDom)
      each(children, (x) => {
        if (predicate(x)) {
          result = result.concat([x])
        }
        result = result.concat(filterDescendants(x, predicate))
      })
      return result
    }
    const findParentElm = function (elm, rootElm) {
      while (elm.parentNode) {
        if (elm.parentNode === rootElm) {
          return elm
        }
        elm = elm.parentNode
      }
    }
    const replaceWithSpans = function (html) {
      return html.replace(Data.regExpGlobal, Html.wrapCharWithSpan)
    }
    const Nodes = {
      isMatch,
      filterDescendants,
      findParentElm,
      replaceWithSpans,
    }

    const show = function (editor, rootElm) {
      let node, div
      const nodeList = Nodes.filterDescendants(Element$$1.fromDom(rootElm), Nodes.isMatch)
      each(nodeList, (n) => {
        const withSpans = Nodes.replaceWithSpans(value(n))
        div = editor.dom.create('div', null, withSpans)
        while (node = div.lastChild) {
          editor.dom.insertAfter(node, n.dom())
        }
        editor.dom.remove(n.dom())
      })
    }
    const hide = function (editor, body) {
      const nodeList = editor.dom.select(Data.selector, body)
      each(nodeList, (node) => {
        editor.dom.remove(node, 1)
      })
    }
    const toggle = function (editor) {
      const body = editor.getBody()
      const bookmark = editor.selection.getBookmark()
      let parentNode = Nodes.findParentElm(editor.selection.getNode(), body)
      parentNode = parentNode !== undefined ? parentNode : body
      hide(editor, parentNode)
      show(editor, parentNode)
      editor.selection.moveToBookmark(bookmark)
    }
    const VisualChars = {
      show,
      hide,
      toggle,
    }

    const toggleVisualChars = function (editor, toggleState) {
      const body = editor.getBody()
      const { selection } = editor
      let bookmark
      toggleState.set(!toggleState.get())
      Events.fireVisualChars(editor, toggleState.get())
      bookmark = selection.getBookmark()
      if (toggleState.get() === true) {
        VisualChars.show(editor, body)
      } else {
        VisualChars.hide(editor, body)
      }
      selection.moveToBookmark(bookmark)
    }
    const Actions = { toggleVisualChars }

    const register = function (editor, toggleState) {
      editor.addCommand('mceVisualChars', () => {
        Actions.toggleVisualChars(editor, toggleState)
      })
    }
    const Commands = { register }

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.Delay')

    const setup = function (editor, toggleState) {
      const debouncedToggle = global$1.debounce(() => {
        VisualChars.toggle(editor)
      }, 300)
      if (editor.settings.forced_root_block !== false) {
        editor.on('keydown', (e) => {
          if (toggleState.get() === true) {
            e.keyCode === 13 ? VisualChars.toggle(editor) : debouncedToggle()
          }
        })
      }
    }
    const Keyboard = { setup }

    const toggleActiveState = function (editor, enabledStated) {
      return function (api) {
        api.setActive(enabledStated.get())
        const editorEventCallback = function (e) {
          return api.setActive(e.state)
        }
        editor.on('VisualChars', editorEventCallback)
        return function () {
          return editor.off('VisualChars', editorEventCallback)
        }
      }
    }
    const register$1 = function (editor, toggleState) {
      editor.ui.registry.addToggleButton('visualchars', {
        tooltip: 'Show invisible characters',
        icon: 'paragraph',
        onAction() {
          return editor.execCommand('mceVisualChars')
        },
        onSetup: toggleActiveState(editor, toggleState),
      })
      editor.ui.registry.addToggleMenuItem('visualchars', {
        text: 'Show invisible characters',
        onAction() {
          return editor.execCommand('mceVisualChars')
        },
        onSetup: toggleActiveState(editor, toggleState),
      })
    }

    global.add('visualchars', (editor) => {
      const toggleState = Cell(false)
      Commands.register(editor, toggleState)
      register$1(editor, toggleState)
      Keyboard.setup(editor, toggleState)
      return Api.get(toggleState)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
