(function () {
  const help = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

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
    const find = function (xs, pred) {
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i]
        if (pred(x, i, xs)) {
          return Option.some(x)
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
    const { slice } = Array.prototype
    const from$1 = isFunction(Array.from) ? Array.from : function (x) {
      return slice.call(x)
    }

    const shortcuts = [
      {
        shortcuts: ['Meta + B'],
        action: 'Bold',
      },
      {
        shortcuts: ['Meta + I'],
        action: 'Italic',
      },
      {
        shortcuts: ['Meta + U'],
        action: 'Underline',
      },
      {
        shortcuts: ['Meta + A'],
        action: 'Select all',
      },
      {
        shortcuts: [
          'Meta + Y',
          'Meta + Shift + Z',
        ],
        action: 'Redo',
      },
      {
        shortcuts: ['Meta + Z'],
        action: 'Undo',
      },
      {
        shortcuts: ['Ctrl + Alt + 1'],
        action: 'Header 1',
      },
      {
        shortcuts: ['Ctrl + Alt + 2'],
        action: 'Header 2',
      },
      {
        shortcuts: ['Ctrl + Alt + 3'],
        action: 'Header 3',
      },
      {
        shortcuts: ['Ctrl + Alt + 4'],
        action: 'Header 4',
      },
      {
        shortcuts: ['Ctrl + Alt + 5'],
        action: 'Header 5',
      },
      {
        shortcuts: ['Ctrl + Alt + 6'],
        action: 'Header 6',
      },
      {
        shortcuts: ['Ctrl + Alt + 7'],
        action: 'Paragraph',
      },
      {
        shortcuts: ['Ctrl + Alt + 8'],
        action: 'Div',
      },
      {
        shortcuts: ['Ctrl + Alt + 9'],
        action: 'Address',
      },
      {
        shortcuts: ['Alt + 0'],
        action: 'Open help dialog',
      },
      {
        shortcuts: ['Alt + F9'],
        action: 'Focus to menubar',
      },
      {
        shortcuts: ['Alt + F10'],
        action: 'Focus to toolbar',
      },
      {
        shortcuts: ['Alt + F11'],
        action: 'Focus to element path',
      },
      {
        shortcuts: ['Ctrl + F9'],
        action: 'Focus to contextual toolbar',
      },
      {
        shortcuts: ['Shift + Enter'],
        action: 'Open popup menu for split buttons',
      },
      {
        shortcuts: ['Meta + K'],
        action: 'Insert link (if link plugin activated)',
      },
      {
        shortcuts: ['Meta + S'],
        action: 'Save (if save plugin activated)',
      },
      {
        shortcuts: ['Meta + F'],
        action: 'Find (if searchreplace plugin activated)',
      },
      {
        shortcuts: ['Meta + Shift + F'],
        action: 'Switch to or from fullscreen mode',
      },
    ]
    const KeyboardShortcuts = { shortcuts }

    const { keys } = Object
    const { hasOwnProperty } = Object
    const has = function (obj, key) {
      return hasOwnProperty.call(obj, key)
    }

    const global$1 = tinymce.util.Tools.resolve('tinymce.Env')

    const convertText = function (source) {
      const mac = {
        alt: '&#x2325;',
        ctrl: '&#x2303;',
        shift: '&#x21E7;',
        meta: '&#x2318;',
      }
      const other = { meta: 'Ctrl ' }
      const replace = global$1.mac ? mac : other
      const shortcut = source.split('+')
      const updated = map(shortcut, (segment) => {
        const search = segment.toLowerCase().trim()
        return has(replace, search) ? replace[search] : segment
      })
      return global$1.mac ? updated.join('').replace(/\s/, '') : updated.join('+')
    }
    const ConvertShortcut = { convertText }

    const tab = function () {
      const shortcutList = map(KeyboardShortcuts.shortcuts, (shortcut) => {
        const shortcutText = map(shortcut.shortcuts, ConvertShortcut.convertText).join(' or ')
        return [
          shortcut.action,
          shortcutText,
        ]
      })
      const tablePanel = {
        type: 'table',
        header: [
          'Action',
          'Shortcut',
        ],
        cells: shortcutList,
      }
      return {
        title: 'Handy Shortcuts',
        items: [tablePanel],
      }
    }
    const KeyboardShortcutsTab = { tab }

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

    const global$2 = tinymce.util.Tools.resolve('tinymce.util.I18n')

    const urls = [
      {
        key: 'advlist',
        name: 'Advanced List',
      },
      {
        key: 'anchor',
        name: 'Anchor',
      },
      {
        key: 'autolink',
        name: 'Autolink',
      },
      {
        key: 'autoresize',
        name: 'Autoresize',
      },
      {
        key: 'autosave',
        name: 'Autosave',
      },
      {
        key: 'bbcode',
        name: 'BBCode',
      },
      {
        key: 'charmap',
        name: 'Character Map',
      },
      {
        key: 'code',
        name: 'Code',
      },
      {
        key: 'codesample',
        name: 'Code Sample',
      },
      {
        key: 'colorpicker',
        name: 'Color Picker',
      },
      {
        key: 'directionality',
        name: 'Directionality',
      },
      {
        key: 'emoticons',
        name: 'Emoticons',
      },
      {
        key: 'fullpage',
        name: 'Full Page',
      },
      {
        key: 'fullscreen',
        name: 'Full Screen',
      },
      {
        key: 'help',
        name: 'Help',
      },
      {
        key: 'hr',
        name: 'Horizontal Rule',
      },
      {
        key: 'image',
        name: 'Image',
      },
      {
        key: 'imagetools',
        name: 'Image Tools',
      },
      {
        key: 'importcss',
        name: 'Import CSS',
      },
      {
        key: 'insertdatetime',
        name: 'Insert Date/Time',
      },
      {
        key: 'legacyoutput',
        name: 'Legacy Output',
      },
      {
        key: 'link',
        name: 'Link',
      },
      {
        key: 'lists',
        name: 'Lists',
      },
      {
        key: 'media',
        name: 'Media',
      },
      {
        key: 'nonbreaking',
        name: 'Nonbreaking',
      },
      {
        key: 'noneditable',
        name: 'Noneditable',
      },
      {
        key: 'pagebreak',
        name: 'Page Break',
      },
      {
        key: 'paste',
        name: 'Paste',
      },
      {
        key: 'preview',
        name: 'Preview',
      },
      {
        key: 'print',
        name: 'Print',
      },
      {
        key: 'save',
        name: 'Save',
      },
      {
        key: 'searchreplace',
        name: 'Search and Replace',
      },
      {
        key: 'spellchecker',
        name: 'Spell Checker',
      },
      {
        key: 'tabfocus',
        name: 'Tab Focus',
      },
      {
        key: 'table',
        name: 'Table',
      },
      {
        key: 'template',
        name: 'Template',
      },
      {
        key: 'textcolor',
        name: 'Text Color',
      },
      {
        key: 'textpattern',
        name: 'Text Pattern',
      },
      {
        key: 'toc',
        name: 'Table of Contents',
      },
      {
        key: 'visualblocks',
        name: 'Visual Blocks',
      },
      {
        key: 'visualchars',
        name: 'Visual Characters',
      },
      {
        key: 'wordcount',
        name: 'Word Count',
      },
    ]
    const PluginUrls = { urls }

    const tab$1 = function (editor) {
      const availablePlugins = function () {
        const premiumPlugins = [
          'PowerPaste',
          'Spell Checker Pro',
          'Accessibility Checker',
          'Advanced Code Editor',
          'Enhanced Media Embed',
          'Link Checker',
        ]
        const premiumPluginList = map(premiumPlugins, (plugin) => `<li>${global$2.translate(plugin)}</li>`).join('')
        return `${'<div data-mce-tabstop="1" tabindex="-1">' + '<p><b>'}${global$2.translate('Premium plugins:')}</b></p>` + `<ul>${premiumPluginList}</ul><br />` + `<p style="float: right;"><a href="https://www.tiny.cloud/pricing/?utm_campaign=editor_referral&utm_medium=help_dialog&utm_source=tinymce" target="_blank">${global$2.translate('Learn more...')}</a></p>` + `</div>`
      }
      const makeLink = curry(supplant, '<a href="${url}" target="_blank" rel="noopener">${name}</a>')
      const maybeUrlize = function (editor, key) {
        return find(PluginUrls.urls, (x) => x.key === key).fold(() => {
          const { getMetadata } = editor.plugins[key]
          return typeof getMetadata === 'function' ? makeLink(getMetadata()) : key
        }, (x) => makeLink({
          name: x.name,
          url: `https://www.tiny.cloud/docs/plugins/${x.key}`,
        }))
      }
      const getPluginKeys = function (editor) {
        const keys$$1 = keys(editor.plugins)
        return editor.settings.forced_plugins === undefined ? keys$$1 : filter(keys$$1, not(curry(contains, editor.settings.forced_plugins)))
      }
      const pluginLister = function (editor) {
        const pluginKeys = getPluginKeys(editor)
        const pluginLis = map(pluginKeys, (key) => `<li>${maybeUrlize(editor, key)}</li>`)
        const count = pluginLis.length
        const pluginsString = pluginLis.join('')
        const html = `<p><b>${global$2.translate([
          'Plugins installed ({0}):',
          count,
        ])}</b></p>` + `<ul>${pluginsString}</ul>`
        return html
      }
      const installedPlugins = function (editor) {
        if (editor == null) {
          return ''
        }
        return `<div data-mce-tabstop="1" tabindex="-1">${pluginLister(editor)}</div>`
      }
      const htmlPanel = {
        type: 'htmlpanel',
        html: [
          installedPlugins(editor),
          availablePlugins(),
        ].join(''),
      }
      return {
        title: 'Plugins',
        items: [htmlPanel],
      }
    }
    const PluginsTab = { tab: tab$1 }

    const global$3 = tinymce.util.Tools.resolve('tinymce.EditorManager')

    const tab$2 = function () {
      const getVersion = function (major, minor) {
        return major.indexOf('@') === 0 ? 'X.X.X' : `${major}.${minor}`
      }
      const version = getVersion(global$3.majorVersion, global$3.minorVersion)
      const changeLogLink = `<a href="https://www.tinymce.com/docs/changelog/?utm_campaign=editor_referral&utm_medium=help_dialog&utm_source=tinymce" target="_blank">TinyMCE ${version}</a>`
      const htmlPanel = {
        type: 'htmlpanel',
        html: `<p>${global$2.translate([
          'You are using {0}',
          changeLogLink,
        ])}</p>`,
      }
      return {
        title: 'Version',
        items: [htmlPanel],
      }
    }
    const VersionTab = { tab: tab$2 }

    const opener = function (editor) {
      return function () {
        const body = {
          type: 'tabpanel',
          tabs: [
            KeyboardShortcutsTab.tab(),
            PluginsTab.tab(editor),
            VersionTab.tab(),
          ],
        }
        editor.windowManager.open({
          title: 'Help',
          size: 'medium',
          body,
          buttons: [{
            type: 'cancel',
            name: 'close',
            text: 'Close',
            primary: true,
          }],
          initialData: {},
        })
      }
    }
    const Dialog = { opener }

    const register = function (editor) {
      editor.addCommand('mceHelp', Dialog.opener(editor))
    }
    const Commands = { register }

    const register$1 = function (editor) {
      editor.ui.registry.addButton('help', {
        icon: 'help',
        tooltip: 'Help',
        onAction: Dialog.opener(editor),
      })
      editor.ui.registry.addMenuItem('help', {
        text: 'Help',
        icon: 'help',
        shortcut: 'Alt+0',
        onAction: Dialog.opener(editor),
      })
    }
    const Buttons = { register: register$1 }

    global.add('help', (editor) => {
      Buttons.register(editor)
      Commands.register(editor)
      editor.shortcuts.add('Alt+0', 'Open help dialog', 'mceHelp')
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
