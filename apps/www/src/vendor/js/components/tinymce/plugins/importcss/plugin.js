(function () {
  const importcss = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    const global$1 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils')

    const global$2 = tinymce.util.Tools.resolve('tinymce.EditorManager')

    const global$3 = tinymce.util.Tools.resolve('tinymce.Env')

    const global$4 = tinymce.util.Tools.resolve('tinymce.util.Tools')

    const shouldMergeClasses = function (editor) {
      return editor.getParam('importcss_merge_classes')
    }
    const shouldImportExclusive = function (editor) {
      return editor.getParam('importcss_exclusive')
    }
    const getSelectorConverter = function (editor) {
      return editor.getParam('importcss_selector_converter')
    }
    const getSelectorFilter = function (editor) {
      return editor.getParam('importcss_selector_filter')
    }
    const getCssGroups = function (editor) {
      return editor.getParam('importcss_groups')
    }
    const shouldAppend = function (editor) {
      return editor.getParam('importcss_append')
    }
    const getFileFilter = function (editor) {
      return editor.getParam('importcss_file_filter')
    }
    const Settings = {
      shouldMergeClasses,
      shouldImportExclusive,
      getSelectorConverter,
      getSelectorFilter,
      getCssGroups,
      shouldAppend,
      getFileFilter,
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

    const generate = function () {
      const ungroupedOrder = []
      const groupOrder = []
      const groups = {}
      const addItemToGroup = function (groupTitle, itemInfo) {
        if (groups[groupTitle]) {
          groups[groupTitle].push(itemInfo)
        } else {
          groupOrder.push(groupTitle)
          groups[groupTitle] = [itemInfo]
        }
      }
      const addItem = function (itemInfo) {
        ungroupedOrder.push(itemInfo)
      }
      const toFormats = function () {
        const groupItems = bind(groupOrder, (g) => {
          const items = groups[g]
          return items.length === 0 ? [] : [{
            title: g,
            items,
          }]
        })
        return groupItems.concat(ungroupedOrder)
      }
      return {
        addItemToGroup,
        addItem,
        toFormats,
      }
    }

    const removeCacheSuffix = function (url) {
      const { cacheSuffix } = global$3
      if (typeof url === 'string') {
        url = url.replace(`?${cacheSuffix}`, '').replace(`&${cacheSuffix}`, '')
      }
      return url
    }
    const isSkinContentCss = function (editor, href) {
      const { settings } = editor; const skin = settings.skin !== false ? settings.skin || 'oxide' : false
      if (skin) {
        const skinUrl = settings.skin_url ? editor.documentBaseURI.toAbsolute(settings.skin_url) : `${global$2.baseURL}/skins/ui/${skin}`
        const contentSkinUrlPart = `${global$2.baseURL}/skins/content/`
        return href === `${skinUrl}/content${editor.inline ? '.inline' : ''}.min.css` || href.indexOf(contentSkinUrlPart) !== -1
      }
      return false
    }
    const compileFilter = function (filter) {
      if (typeof filter === 'string') {
        return function (value) {
          return value.indexOf(filter) !== -1
        }
      } if (filter instanceof RegExp) {
        return function (value) {
          return filter.test(value)
        }
      }
      return filter
    }
    const getSelectors = function (editor, doc, fileFilter) {
      const selectors = []; const contentCSSUrls = {}
      function append(styleSheet, imported) {
        let { href } = styleSheet; let rules
        href = removeCacheSuffix(href)
        if (!href || !fileFilter(href, imported) || isSkinContentCss(editor, href)) {
          return
        }
        global$4.each(styleSheet.imports, (styleSheet) => {
          append(styleSheet, true)
        })
        try {
          rules = styleSheet.cssRules || styleSheet.rules
        } catch (e) {
        }
        global$4.each(rules, (cssRule) => {
          if (cssRule.styleSheet) {
            append(cssRule.styleSheet, true)
          } else if (cssRule.selectorText) {
            global$4.each(cssRule.selectorText.split(','), (selector) => {
              selectors.push(global$4.trim(selector))
            })
          }
        })
      }
      global$4.each(editor.contentCSS, (url) => {
        contentCSSUrls[url] = true
      })
      if (!fileFilter) {
        fileFilter = function (href, imported) {
          return imported || contentCSSUrls[href]
        }
      }
      try {
        global$4.each(doc.styleSheets, (styleSheet) => {
          append(styleSheet)
        })
      } catch (e) {
      }
      return selectors
    }
    const defaultConvertSelectorToFormat = function (editor, selectorText) {
      let format
      const selector = /^(?:([a-z0-9\-_]+))?(\.[a-z0-9_\-\.]+)$/i.exec(selectorText)
      if (!selector) {
        return
      }
      const elementName = selector[1]
      const classes = selector[2].substr(1).split('.').join(' ')
      const inlineSelectorElements = global$4.makeMap('a,img')
      if (selector[1]) {
        format = { title: selectorText }
        if (editor.schema.getTextBlockElements()[elementName]) {
          format.block = elementName
        } else if (editor.schema.getBlockElements()[elementName] || inlineSelectorElements[elementName.toLowerCase()]) {
          format.selector = elementName
        } else {
          format.inline = elementName
        }
      } else if (selector[2]) {
        format = {
          inline: 'span',
          title: selectorText.substr(1),
          classes,
        }
      }
      if (Settings.shouldMergeClasses(editor) !== false) {
        format.classes = classes
      } else {
        format.attributes = { class: classes }
      }
      return format
    }
    const getGroupsBySelector = function (groups, selector) {
      return global$4.grep(groups, (group) => !group.filter || group.filter(selector))
    }
    const compileUserDefinedGroups = function (groups) {
      return global$4.map(groups, (group) => global$4.extend({}, group, {
        original: group,
        selectors: {},
        filter: compileFilter(group.filter),
        item: {
          text: group.title,
          menu: [],
        },
      }))
    }
    const isExclusiveMode = function (editor, group) {
      return group === null || Settings.shouldImportExclusive(editor) !== false
    }
    const isUniqueSelector = function (editor, selector, group, globallyUniqueSelectors) {
      return !(isExclusiveMode(editor, group) ? selector in globallyUniqueSelectors : selector in group.selectors)
    }
    const markUniqueSelector = function (editor, selector, group, globallyUniqueSelectors) {
      if (isExclusiveMode(editor, group)) {
        globallyUniqueSelectors[selector] = true
      } else {
        group.selectors[selector] = true
      }
    }
    const convertSelectorToFormat = function (editor, plugin, selector, group) {
      let selectorConverter
      if (group && group.selector_converter) {
        selectorConverter = group.selector_converter
      } else if (Settings.getSelectorConverter(editor)) {
        selectorConverter = Settings.getSelectorConverter(editor)
      } else {
        selectorConverter = function () {
          return defaultConvertSelectorToFormat(editor, selector)
        }
      }
      return selectorConverter.call(plugin, selector, group)
    }
    const setup = function (editor) {
      editor.on('init', (e) => {
        const model = generate()
        const globallyUniqueSelectors = {}
        const selectorFilter = compileFilter(Settings.getSelectorFilter(editor))
        const groups = compileUserDefinedGroups(Settings.getCssGroups(editor))
        const processSelector = function (selector, group) {
          if (isUniqueSelector(editor, selector, group, globallyUniqueSelectors)) {
            markUniqueSelector(editor, selector, group, globallyUniqueSelectors)
            const format = convertSelectorToFormat(editor, editor.plugins.importcss, selector, group)
            if (format) {
              const formatName = format.name || global$1.DOM.uniqueId()
              editor.formatter.register(formatName, format)
              return global$4.extend({}, {
                title: format.title,
                format: formatName,
              })
            }
          }
          return null
        }
        global$4.each(getSelectors(editor, e.doc || editor.getDoc(), compileFilter(Settings.getFileFilter(editor))), (selector) => {
          if (selector.indexOf('.mce-') === -1) {
            if (!selectorFilter || selectorFilter(selector)) {
              const selectorGroups = getGroupsBySelector(groups, selector)
              if (selectorGroups.length > 0) {
                global$4.each(selectorGroups, (group) => {
                  const menuItem = processSelector(selector, group)
                  if (menuItem) {
                    model.addItemToGroup(group.title, menuItem)
                  }
                })
              } else {
                const menuItem = processSelector(selector, null)
                if (menuItem) {
                  model.addItem(menuItem)
                }
              }
            }
          }
        })
        const items = model.toFormats()
        editor.fire('addStyleModifications', {
          items,
          replace: !Settings.shouldAppend(editor),
        })
      })
    }
    const ImportCss = {
      defaultConvertSelectorToFormat,
      setup,
    }

    const get = function (editor) {
      const convertSelectorToFormat = function (selectorText) {
        return ImportCss.defaultConvertSelectorToFormat(editor, selectorText)
      }
      return { convertSelectorToFormat }
    }
    const Api = { get }

    global.add('importcss', (editor) => {
      ImportCss.setup(editor)
      return Api.get(editor)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
