(function () {
  const link = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.VK')

    const assumeExternalTargets = function (editorSettings) {
      return typeof editorSettings.link_assume_external_targets === 'boolean' ? editorSettings.link_assume_external_targets : false
    }
    const hasContextToolbar = function (editorSettings) {
      return typeof editorSettings.link_context_toolbar === 'boolean' ? editorSettings.link_context_toolbar : false
    }
    const getLinkList = function (editorSettings) {
      return editorSettings.link_list
    }
    const hasDefaultLinkTarget = function (editorSettings) {
      return typeof editorSettings.default_link_target === 'string'
    }
    const useQuickLink = function (editorSettings) {
      return editorSettings.link_quicklink === true
    }
    const getDefaultLinkTarget = function (editorSettings) {
      return editorSettings.default_link_target
    }
    const getTargetList = function (editorSettings) {
      return editorSettings.target_list
    }
    const setTargetList = function (editor, list) {
      editor.settings.target_list = list
    }
    const shouldShowTargetList = function (editorSettings) {
      return getTargetList(editorSettings) !== false
    }
    const getRelList = function (editorSettings) {
      return editorSettings.rel_list
    }
    const hasRelList = function (editorSettings) {
      return getRelList(editorSettings) !== undefined
    }
    const getLinkClassList = function (editorSettings) {
      return editorSettings.link_class_list
    }
    const hasLinkClassList = function (editorSettings) {
      return getLinkClassList(editorSettings) !== undefined
    }
    const shouldShowLinkTitle = function (editorSettings) {
      return editorSettings.link_title !== false
    }
    const allowUnsafeLinkTarget = function (editorSettings) {
      return typeof editorSettings.allow_unsafe_link_target === 'boolean' ? editorSettings.allow_unsafe_link_target : false
    }
    const Settings = {
      assumeExternalTargets,
      hasContextToolbar,
      getLinkList,
      hasDefaultLinkTarget,
      getDefaultLinkTarget,
      getTargetList,
      setTargetList,
      shouldShowTargetList,
      getRelList,
      hasRelList,
      getLinkClassList,
      hasLinkClassList,
      shouldShowLinkTitle,
      allowUnsafeLinkTarget,
      useQuickLink,
    }

    const global$2 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils')

    const global$3 = tinymce.util.Tools.resolve('tinymce.Env')

    const appendClickRemove = function (link, evt) {
      document.body.appendChild(link)
      link.dispatchEvent(evt)
      document.body.removeChild(link)
    }
    const open$$1 = function (url) {
      if (!global$3.ie || global$3.ie > 10) {
        const link = document.createElement('a')
        link.target = '_blank'
        link.href = url
        link.rel = 'noreferrer noopener'
        const evt = document.createEvent('MouseEvents')
        evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        appendClickRemove(link, evt)
      } else {
        const win = window.open('', '_blank')
        if (win) {
          win.opener = null
          const doc = win.document
          doc.open()
          doc.write(`<meta http-equiv="refresh" content="0; url=${global$2.DOM.encode(url)}">`)
          doc.close()
        }
      }
    }
    const OpenUrl = { open: open$$1 }

    const global$4 = tinymce.util.Tools.resolve('tinymce.util.Tools')

    const getHref = function (elm) {
      const href = elm.getAttribute('data-mce-href')
      return href || elm.getAttribute('href')
    }
    const toggleTargetRules = function (rel, isUnsafe) {
      const rules = ['noopener']
      let newRel = rel ? rel.split(/\s+/) : []
      const toString = function (rel) {
        return global$4.trim(rel.sort().join(' '))
      }
      const addTargetRules = function (rel) {
        rel = removeTargetRules(rel)
        return rel.length ? rel.concat(rules) : rules
      }
      var removeTargetRules = function (rel) {
        return rel.filter((val) => global$4.inArray(rules, val) === -1)
      }
      newRel = isUnsafe ? addTargetRules(newRel) : removeTargetRules(newRel)
      return newRel.length ? toString(newRel) : null
    }
    const trimCaretContainers = function (text) {
      return text.replace(/\uFEFF/g, '')
    }
    const getAnchorElement = function (editor, selectedElm) {
      selectedElm = selectedElm || editor.selection.getNode()
      if (isImageFigure(selectedElm)) {
        return editor.dom.select('a[href]', selectedElm)[0]
      }
      return editor.dom.getParent(selectedElm, 'a[href]')
    }
    const getAnchorText = function (selection, anchorElm) {
      const text = anchorElm ? anchorElm.innerText || anchorElm.textContent : selection.getContent({ format: 'text' })
      return trimCaretContainers(text)
    }
    const isLink = function (elm) {
      return elm && elm.nodeName === 'A' && elm.href
    }
    const hasLinks = function (elements) {
      return global$4.grep(elements, isLink).length > 0
    }
    const isOnlyTextSelected = function (html) {
      if (/</.test(html) && (!/^<a [^>]+>[^<]+<\/a>$/.test(html) || html.indexOf('href=') === -1)) {
        return false
      }
      return true
    }
    var isImageFigure = function (node) {
      return node && node.nodeName === 'FIGURE' && /\bimage\b/i.test(node.className)
    }
    const link = function (editor, attachState) {
      return function (data) {
        editor.undoManager.transact(() => {
          const selectedElm = editor.selection.getNode()
          const anchorElm = getAnchorElement(editor, selectedElm)
          const linkAttrs = {
            href: data.href,
            target: data.target ? data.target : null,
            rel: data.rel ? data.rel : null,
            class: data.class ? data.class : null,
            title: data.title ? data.title : null,
          }
          if (!Settings.hasRelList(editor.settings) && Settings.allowUnsafeLinkTarget(editor.settings) === false) {
            linkAttrs.rel = toggleTargetRules(linkAttrs.rel, linkAttrs.target === '_blank')
          }
          if (data.href === attachState.href) {
            attachState.attach()
            attachState = {}
          }
          if (anchorElm) {
            editor.focus()
            if (data.hasOwnProperty('text')) {
              if ('innerText' in anchorElm) {
                anchorElm.innerText = data.text
              } else {
                anchorElm.textContent = data.text
              }
            }
            editor.dom.setAttribs(anchorElm, linkAttrs)
            editor.selection.select(anchorElm)
            editor.undoManager.add()
          } else if (isImageFigure(selectedElm)) {
            linkImageFigure(editor, selectedElm, linkAttrs)
          } else if (data.hasOwnProperty('text')) {
            editor.insertContent(editor.dom.createHTML('a', linkAttrs, editor.dom.encode(data.text)))
          } else {
            editor.execCommand('mceInsertLink', false, linkAttrs)
          }
        })
      }
    }
    const unlink = function (editor) {
      return function () {
        editor.undoManager.transact(() => {
          const node = editor.selection.getNode()
          if (isImageFigure(node)) {
            unlinkImageFigure(editor, node)
          } else {
            editor.execCommand('unlink')
          }
        })
      }
    }
    var unlinkImageFigure = function (editor, fig) {
      let a, img
      img = editor.dom.select('img', fig)[0]
      if (img) {
        a = editor.dom.getParents(img, 'a[href]', fig)[0]
        if (a) {
          a.parentNode.insertBefore(img, a)
          editor.dom.remove(a)
        }
      }
    }
    var linkImageFigure = function (editor, fig, attrs) {
      let a, img
      img = editor.dom.select('img', fig)[0]
      if (img) {
        a = editor.dom.create('a', attrs)
        img.parentNode.insertBefore(a, img)
        a.appendChild(img)
      }
    }
    const Utils = {
      link,
      unlink,
      isLink,
      hasLinks,
      getHref,
      isOnlyTextSelected,
      getAnchorElement,
      getAnchorText,
      toggleTargetRules,
    }

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
    const isFunction = isType('function')

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
    const { slice } = Array.prototype
    const from$1 = isFunction(Array.from) ? Array.from : function (x) {
      return slice.call(x)
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

    const getValue = function (item) {
      return isString(item.value) ? item.value : ''
    }
    const sanitizeList = function (list, extractValue) {
      const out = []
      global$4.each(list, (item) => {
        const text = isString(item.text) ? item.text : isString(item.title) ? item.title : ''
        if (item.menu !== undefined) ; else {
          const value = extractValue(item)
          out.push({
            text,
            value,
          })
        }
      })
      return out
    }
    const sanitizeWith = function (extracter) {
      if (extracter === void 0) {
        extracter = getValue
      }
      return function (list) {
        return Option.from(list).map((list) => sanitizeList(list, extracter))
      }
    }
    const sanitize = function (list) {
      return sanitizeWith(getValue)(list)
    }
    const createUi = function (name, label) {
      return function (items) {
        return {
          name,
          type: 'selectbox',
          label,
          items,
        }
      }
    }
    const ListOptions = {
      sanitize,
      sanitizeWith,
      createUi,
      getValue,
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

    const findTextByValue = function (value, catalog) {
      return findMap(catalog, (item) => Option.some(item).filter((i) => i.value === value))
    }
    const getDelta = function (persistentText, fieldName, catalog, data) {
      const value = data[fieldName]
      const hasPersistentText = persistentText.length > 0
      return value !== undefined ? findTextByValue(value, catalog).map((i) => ({
        url: {
          value: i.value,
          meta: {
            text: hasPersistentText ? persistentText : i.text,
            attach: noop,
          },
        },
        text: hasPersistentText ? persistentText : i.text,
      })) : Option.none()
    }
    const findCatalog = function (settings, fieldName) {
      if (fieldName === 'link') {
        return settings.catalogs.link
      } if (fieldName === 'anchor') {
        return settings.catalogs.anchor
      }
      return Option.none()
    }
    const init = function (initialData, linkSettings) {
      const persistentText = Cell(initialData.text)
      const onUrlChange = function (data) {
        if (persistentText.get().length <= 0) {
          const urlText = data.url.meta.text !== undefined ? data.url.meta.text : data.url.value
          return Option.some({ text: urlText })
        }
        return Option.none()
      }
      const onCatalogChange = function (data, change) {
        const catalog = findCatalog(linkSettings, change.name).getOr([])
        return getDelta(persistentText.get(), change.name, catalog, data)
      }
      const onChange = function (getData, change) {
        if (change.name === 'url') {
          return onUrlChange(getData())
        } if (contains([
          'anchor',
          'link',
        ], change.name)) {
          return onCatalogChange(getData(), change)
        } if (change.name === 'text') {
          persistentText.set(getData().text)
          return Option.none()
        }
        return Option.none()
      }
      return { onChange }
    }
    const DialogChanges = {
      init,
      getDelta,
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

    const global$5 = tinymce.util.Tools.resolve('tinymce.util.Delay')

    const delayedConfirm = function (editor, message, callback) {
      const rng = editor.selection.getRng()
      global$5.setEditorTimeout(editor, () => {
        editor.windowManager.confirm(message, (state) => {
          editor.selection.setRng(rng)
          callback(state)
        })
      })
    }
    const tryEmailTransform = function (data) {
      const url = data.href
      const suggestMailTo = url.indexOf('@') > 0 && url.indexOf('//') === -1 && url.indexOf('mailto:') === -1
      return suggestMailTo ? Option.some({
        message: 'The URL you entered seems to be an email address. Do you want to add the required mailto: prefix?',
        preprocess(oldData) {
          return __assign({}, oldData, { href: `mailto:${url}` })
        },
      }) : Option.none()
    }
    const tryProtocolTransform = function (assumeExternalTargets) {
      return function (data) {
        const url = data.href
        const suggestProtocol = assumeExternalTargets === true && !/^\w+:/i.test(url) || assumeExternalTargets === false && /^\s*www[\.|\d\.]/i.test(url)
        return suggestProtocol ? Option.some({
          message: 'The URL you entered seems to be an external link. Do you want to add the required http:// prefix?',
          preprocess(oldData) {
            return __assign({}, oldData, { href: `http://${url}` })
          },
        }) : Option.none()
      }
    }
    const preprocess = function (editor, assumeExternalTargets, data) {
      return findMap([
        tryEmailTransform,
        tryProtocolTransform(assumeExternalTargets),
      ], (f) => f(data)).fold(() => Future.pure(data), (transform) => Future.nu((callback) => {
        delayedConfirm(editor, transform.message, (state) => {
          console.log('state', state)
          callback(state ? transform.preprocess(data) : data)
        })
      }))
    }
    const DialogConfirms = { preprocess }

    const getAnchors = function (editor) {
      const anchorNodes = editor.dom.select('a:not([href])')
      const anchors = bind(anchorNodes, (anchor) => {
        const id = anchor.name || anchor.id
        return id ? [{
          text: id,
          value: `#${id}`,
        }] : []
      })
      return anchors.length > 0 ? Option.some([{
        text: 'None',
        value: '',
      }].concat(anchors)) : Option.none()
    }
    const AnchorListOptions = { getAnchors }

    const getClasses = function (editor) {
      if (Settings.hasLinkClassList(editor.settings)) {
        const list = Settings.getLinkClassList(editor.settings)
        return ListOptions.sanitize(list)
      }
      return Option.none()
    }
    const ClassListOptions = { getClasses }

    const global$6 = tinymce.util.Tools.resolve('tinymce.util.XHR')

    const parseJson = function (text) {
      try {
        return Option.some(JSON.parse(text))
      } catch (err) {
        return Option.none()
      }
    }
    const getLinks = function (editor) {
      const extractor = function (item) {
        return editor.convertURL(item.value || item.url, 'href')
      }
      const linkList = Settings.getLinkList(editor.settings)
      return Future.nu((callback) => {
        if (typeof linkList === 'string') {
          global$6.send({
            url: linkList,
            success(text) {
              return callback(parseJson(text))
            },
            error(_) {
              return callback(Option.none())
            },
          })
        } else if (typeof linkList === 'function') {
          linkList((output) => callback(Option.some(output)))
        } else {
          callback(Option.from(linkList))
        }
      }).map((opt) => opt.bind(ListOptions.sanitizeWith(extractor)))
    }
    const LinkListOptions = { getLinks }

    const getRels = function (editor, initialTarget) {
      if (Settings.hasRelList(editor.settings)) {
        const list = Settings.getRelList(editor.settings)
        const isTargetBlank_1 = initialTarget.is('_blank')
        const enforceSafe = Settings.allowUnsafeLinkTarget(editor.settings) === false
        const safeRelExtractor = function (item) {
          return Utils.toggleTargetRules(ListOptions.getValue(item), isTargetBlank_1)
        }
        const sanitizer = enforceSafe ? ListOptions.sanitizeWith(safeRelExtractor) : ListOptions.sanitize
        return sanitizer(list)
      }
      return Option.none()
    }
    const RelOptions = { getRels }

    const fallbacks = [
      {
        text: 'Current window',
        value: '',
      },
      {
        text: 'New window',
        value: '_blank',
      },
    ]
    const getTargets = function (editor) {
      if (Settings.shouldShowTargetList(editor.settings)) {
        const list = Settings.getTargetList(editor.settings)
        return ListOptions.sanitize(list).orThunk(() => Option.some(fallbacks))
      }
      return Option.none()
    }
    const TargetOptions = { getTargets }

    const nonEmptyAttr = function (dom, elem, name) {
      const val = dom.getAttrib(elem, name)
      return val !== null && val.length > 0 ? Option.some(val) : Option.none()
    }
    const extractFromAnchor = function (editor, settings, anchor, selection) {
      const { dom } = editor
      const onlyText = Utils.isOnlyTextSelected(selection.getContent())
      const text = onlyText ? Option.some(Utils.getAnchorText(selection, anchor)) : Option.none()
      const url = anchor ? Option.some(dom.getAttrib(anchor, 'href')) : Option.none()
      const defaultTarget = Settings.hasDefaultLinkTarget(settings) ? Option.some(Settings.getDefaultLinkTarget(settings)) : Option.none()
      const target = anchor ? Option.from(dom.getAttrib(anchor, 'target')) : defaultTarget
      const rel = nonEmptyAttr(dom, anchor, 'rel')
      const linkClass = nonEmptyAttr(dom, anchor, 'class')
      const title = nonEmptyAttr(dom, anchor, 'title')
      return {
        url,
        text,
        title,
        target,
        rel,
        linkClass,
      }
    }
    const collect = function (editor, settings, linkNode) {
      return LinkListOptions.getLinks(editor).map((links) => {
        const anchor = extractFromAnchor(editor, settings, linkNode, editor.selection)
        return {
          anchor,
          catalogs: {
            targets: TargetOptions.getTargets(editor),
            rels: RelOptions.getRels(editor, anchor.target),
            classes: ClassListOptions.getClasses(editor),
            anchor: AnchorListOptions.getAnchors(editor),
            link: links,
          },
          optNode: Option.from(linkNode),
          flags: { titleEnabled: Settings.shouldShowLinkTitle(settings) },
        }
      })
    }
    const DialogInfo = { collect }

    const handleSubmit = function (editor, info, text, assumeExternalTargets) {
      return function (api) {
        const data = api.getData()
        const resultData = {
          href: data.url.value,
          text: data.text ? data.text : text.getOr(undefined),
          target: data.target ? data.target : undefined,
          rel: data.rel ? data.rel : undefined,
          class: data.classz ? data.classz : undefined,
          title: data.title ? data.title : undefined,
        }
        const attachState = {
          href: data.url.value,
          attach: data.url.meta !== undefined && data.url.meta.attach ? data.url.meta.attach : function () {
          },
        }
        const insertLink = Utils.link(editor, attachState)
        const removeLink = Utils.unlink(editor)
        const url = data.url.value
        if (!url) {
          removeLink()
          api.close()
          return
        }
        if (text.is(data.text) || info.optNode.isNone() && !data.text) {
          delete resultData.text
        }
        DialogConfirms.preprocess(editor, assumeExternalTargets, resultData).get((pData) => {
          insertLink(pData)
        })
        api.close()
      }
    }
    const collectData = function (editor) {
      const { settings } = editor
      const anchorNode = Utils.getAnchorElement(editor)
      return DialogInfo.collect(editor, settings, anchorNode)
    }
    const getInitialData = function (settings) {
      return {
        url: {
          value: settings.anchor.url.getOr(''),
          meta: {
            attach() {
            },
            text: settings.anchor.url.fold(() => '', () => settings.anchor.text.getOr('')),
            original: { value: settings.anchor.url.getOr('') },
          },
        },
        text: settings.anchor.text.getOr(''),
        title: settings.anchor.title.getOr(''),
        anchor: settings.anchor.url.getOr(''),
        link: settings.anchor.url.getOr(''),
        rel: settings.anchor.rel.getOr(''),
        target: settings.anchor.target.getOr(''),
        classz: settings.anchor.linkClass.getOr(''),
      }
    }
    const makeDialog = function (settings, onSubmit) {
      const urlInput = [{
        name: 'url',
        type: 'urlinput',
        filetype: 'file',
        label: 'URL',
      }]
      const displayText = settings.anchor.text.map(() => ({
        name: 'text',
        type: 'input',
        label: 'Text to display',
      })).toArray()
      const titleText = settings.flags.titleEnabled ? [{
        name: 'title',
        type: 'input',
        label: 'Title',
      }] : []
      const initialData = getInitialData(settings)
      const dialogDelta = DialogChanges.init(initialData, settings)
      const { catalogs } = settings
      const body = {
        type: 'panel',
        items: flatten([
          urlInput,
          displayText,
          titleText,
          cat([
            catalogs.anchor.map(ListOptions.createUi('anchor', 'Anchors')),
            catalogs.rels.map(ListOptions.createUi('rel', 'Rel')),
            catalogs.targets.map(ListOptions.createUi('target', 'Open link in...')),
            catalogs.link.map(ListOptions.createUi('link', 'Link list')),
            catalogs.classes.map(ListOptions.createUi('classz', 'Class')),
          ]),
        ]),
      }
      return {
        title: 'Insert/Edit Link',
        size: 'normal',
        body,
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
        onChange(api, _a) {
          const { name } = _a
          dialogDelta.onChange(api.getData, { name }).each((newData) => {
            api.setData(newData)
          })
        },
        onSubmit,
      }
    }
    const open$1 = function (editor) {
      const data = collectData(editor)
      data.map((info) => {
        const onSubmit = handleSubmit(editor, info, info.anchor.text, Settings.assumeExternalTargets(editor.settings))
        return makeDialog(info, onSubmit)
      }).get((spec) => {
        editor.windowManager.open(spec)
      })
    }
    const Dialog = { open: open$1 }

    const getLink = function (editor, elm) {
      return editor.dom.getParent(elm, 'a[href]')
    }
    const getSelectedLink = function (editor) {
      return getLink(editor, editor.selection.getStart())
    }
    const hasOnlyAltModifier = function (e) {
      return e.altKey === true && e.shiftKey === false && e.ctrlKey === false && e.metaKey === false
    }
    const gotoLink = function (editor, a) {
      if (a) {
        const href = Utils.getHref(a)
        if (/^#/.test(href)) {
          const targetEl = editor.$(href)
          if (targetEl.length) {
            editor.selection.scrollIntoView(targetEl[0], true)
          }
        } else {
          OpenUrl.open(a.href)
        }
      }
    }
    const openDialog = function (editor) {
      return function () {
        Dialog.open(editor)
      }
    }
    const gotoSelectedLink = function (editor) {
      return function () {
        gotoLink(editor, getSelectedLink(editor))
      }
    }
    const leftClickedOnAHref = function (editor) {
      return function (elm) {
        let sel, rng, node
        if (Settings.hasContextToolbar(editor.settings) && Utils.isLink(elm)) {
          sel = editor.selection
          rng = sel.getRng()
          node = rng.startContainer
          if (node.nodeType === 3 && sel.isCollapsed() && rng.startOffset > 0 && rng.startOffset < node.data.length) {
            return true
          }
        }
        return false
      }
    }
    const setupGotoLinks = function (editor) {
      editor.on('click', (e) => {
        const link = getLink(editor, e.target)
        if (link && global$1.metaKeyPressed(e)) {
          e.preventDefault()
          gotoLink(editor, link)
        }
      })
      editor.on('keydown', (e) => {
        const link = getSelectedLink(editor)
        if (link && e.keyCode === 13 && hasOnlyAltModifier(e)) {
          e.preventDefault()
          gotoLink(editor, link)
        }
      })
    }
    const toggleActiveState = function (editor) {
      return function (api) {
        const nodeChangeHandler = function (e) {
          return api.setActive(!editor.readonly && !!Utils.getAnchorElement(editor, e.element))
        }
        editor.on('nodechange', nodeChangeHandler)
        return function () {
          return editor.off('nodechange', nodeChangeHandler)
        }
      }
    }
    const toggleEnabledState = function (editor) {
      return function (api) {
        api.setDisabled(!Utils.hasLinks(editor.dom.getParents(editor.selection.getStart())))
        const nodeChangeHandler = function (e) {
          return api.setDisabled(!Utils.hasLinks(e.parents))
        }
        editor.on('nodechange', nodeChangeHandler)
        return function () {
          return editor.off('nodechange', nodeChangeHandler)
        }
      }
    }
    const Actions = {
      openDialog,
      gotoSelectedLink,
      leftClickedOnAHref,
      setupGotoLinks,
      toggleActiveState,
      toggleEnabledState,
    }

    const register = function (editor) {
      editor.addCommand('mceLink', () => {
        if (Settings.useQuickLink(editor.settings)) {
          editor.fire('contexttoolbar-show', { toolbarKey: 'link-form' })
        } else {
          Actions.openDialog(editor)()
        }
      })
    }
    const Commands = { register }

    const setup = function (editor) {
      editor.addShortcut('Meta+K', '', () => {
        editor.execCommand('mceLink')
      })
    }
    const Keyboard = { setup }

    const setupButtons = function (editor) {
      editor.ui.registry.addToggleButton('link', {
        icon: 'link',
        tooltip: 'Insert/edit link',
        onAction: Actions.openDialog(editor),
        onSetup: Actions.toggleActiveState(editor),
      })
      editor.ui.registry.addButton('unlink', {
        icon: 'unlink',
        tooltip: 'Remove link',
        onAction: Utils.unlink(editor),
        onSetup: Actions.toggleEnabledState(editor),
      })
    }
    const setupMenuItems = function (editor) {
      editor.ui.registry.addMenuItem('openlink', {
        text: 'Open link',
        icon: 'new-tab',
        onAction: Actions.gotoSelectedLink(editor),
        onSetup: Actions.toggleEnabledState(editor),
      })
      editor.ui.registry.addMenuItem('link', {
        icon: 'link',
        text: 'Link...',
        shortcut: 'Meta+K',
        onAction: Actions.openDialog(editor),
      })
      editor.ui.registry.addMenuItem('unlink', {
        icon: 'unlink',
        text: 'Remove link',
        onAction: Utils.unlink(editor),
        onSetup: Actions.toggleEnabledState(editor),
      })
    }
    const setupContextMenu = function (editor) {
      const noLink = 'link'
      const inLink = 'link unlink openlink'
      editor.ui.registry.addContextMenu('link', {
        update(element) {
          return Utils.hasLinks(editor.dom.getParents(element, 'a')) ? inLink : noLink
        },
      })
    }
    const setupContextToolbars = function (editor) {
      const collapseSelectionToEnd = function (editor) {
        editor.selection.collapse(false)
      }
      editor.ui.registry.addContextForm('link-form', {
        launch: {
          type: 'contextformtogglebutton',
          icon: 'link',
          onSetup: Actions.toggleActiveState(editor),
        },
        label: 'Link',
        predicate(node) {
          return !!Utils.getAnchorElement(editor, node) && Settings.hasContextToolbar(editor.settings)
        },
        initValue() {
          const elm = Utils.getAnchorElement(editor)
          return elm ? Utils.getHref(elm) : ''
        },
        commands: [
          {
            type: 'contextformtogglebutton',
            icon: 'link',
            tooltip: 'Link',
            primary: true,
            onSetup(buttonApi) {
              const node = editor.selection.getNode()
              buttonApi.setActive(!!Utils.getAnchorElement(editor, node))
              return Actions.toggleActiveState(editor)(buttonApi)
            },
            onAction(formApi) {
              const anchor = Utils.getAnchorElement(editor)
              const value = formApi.getValue()
              if (!anchor) {
                const attachState = {
                  href: value,
                  attach() {
                  },
                }
                const onlyText = Utils.isOnlyTextSelected(editor.selection.getContent())
                const text = onlyText ? Option.some(Utils.getAnchorText(editor.selection, anchor)).filter((t) => t.length > 0) : Option.none()
                Utils.link(editor, attachState)({
                  href: value,
                  text: text.getOr(value),
                })
                formApi.hide()
              } else {
                editor.dom.setAttrib(anchor, 'href', value)
                collapseSelectionToEnd(editor)
                formApi.hide()
              }
            },
          },
          {
            type: 'contextformtogglebutton',
            icon: 'unlink',
            tooltip: 'Remove link',
            active: false,
            onSetup() {
              return function () {
              }
            },
            onAction(formApi) {
              Utils.unlink(editor)()
              formApi.hide()
            },
          },
        ],
      })
    }
    const Controls = {
      setupButtons,
      setupMenuItems,
      setupContextMenu,
      setupContextToolbars,
    }

    global.add('link', (editor) => {
      Controls.setupButtons(editor)
      Controls.setupMenuItems(editor)
      Controls.setupContextMenu(editor)
      Controls.setupContextToolbars(editor)
      Actions.setupGotoLinks(editor)
      Commands.register(editor)
      Keyboard.setup(editor)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
