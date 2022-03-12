(function () {
  const template = (function () {
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
    const never = constant(false)
    const always = constant(true)

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools')

    const global$2 = tinymce.util.Tools.resolve('tinymce.util.XHR')

    const getCreationDateClasses = function (editor) {
      return editor.getParam('template_cdate_classes', 'cdate')
    }
    const getModificationDateClasses = function (editor) {
      return editor.getParam('template_mdate_classes', 'mdate')
    }
    const getSelectedContentClasses = function (editor) {
      return editor.getParam('template_selected_content_classes', 'selcontent')
    }
    const getPreviewReplaceValues = function (editor) {
      return editor.getParam('template_preview_replace_values')
    }
    const getTemplateReplaceValues = function (editor) {
      return editor.getParam('template_replace_values')
    }
    const getTemplates = function (editorSettings) {
      return editorSettings.templates
    }
    const getCdateFormat = function (editor) {
      return editor.getParam('template_cdate_format', editor.translate('%Y-%m-%d'))
    }
    const getMdateFormat = function (editor) {
      return editor.getParam('template_mdate_format', editor.translate('%Y-%m-%d'))
    }
    const Settings = {
      getCreationDateClasses,
      getModificationDateClasses,
      getSelectedContentClasses,
      getPreviewReplaceValues,
      getTemplateReplaceValues,
      getTemplates,
      getCdateFormat,
      getMdateFormat,
    }

    const addZeros = function (value, len) {
      value = `${value}`
      if (value.length < len) {
        for (let i = 0; i < len - value.length; i++) {
          value = `0${value}`
        }
      }
      return value
    }
    const getDateTime = function (editor, fmt, date) {
      const daysShort = 'Sun Mon Tue Wed Thu Fri Sat Sun'.split(' ')
      const daysLong = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday Sunday'.split(' ')
      const monthsShort = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')
      const monthsLong = 'January February March April May June July August September October November December'.split(' ')
      date = date || new Date()
      fmt = fmt.replace('%D', '%m/%d/%Y')
      fmt = fmt.replace('%r', '%I:%M:%S %p')
      fmt = fmt.replace('%Y', `${date.getFullYear()}`)
      fmt = fmt.replace('%y', `${date.getYear()}`)
      fmt = fmt.replace('%m', addZeros(date.getMonth() + 1, 2))
      fmt = fmt.replace('%d', addZeros(date.getDate(), 2))
      fmt = fmt.replace('%H', `${addZeros(date.getHours(), 2)}`)
      fmt = fmt.replace('%M', `${addZeros(date.getMinutes(), 2)}`)
      fmt = fmt.replace('%S', `${addZeros(date.getSeconds(), 2)}`)
      fmt = fmt.replace('%I', `${(date.getHours() + 11) % 12 + 1}`)
      fmt = fmt.replace('%p', `${date.getHours() < 12 ? 'AM' : 'PM'}`)
      fmt = fmt.replace('%B', `${editor.translate(monthsLong[date.getMonth()])}`)
      fmt = fmt.replace('%b', `${editor.translate(monthsShort[date.getMonth()])}`)
      fmt = fmt.replace('%A', `${editor.translate(daysLong[date.getDay()])}`)
      fmt = fmt.replace('%a', `${editor.translate(daysShort[date.getDay()])}`)
      fmt = fmt.replace('%%', '%')
      return fmt
    }
    const DateTimeHelper = { getDateTime }

    const createTemplateList = function (editorSettings, callback) {
      return function () {
        const templateList = Settings.getTemplates(editorSettings)
        if (typeof templateList === 'function') {
          templateList(callback)
          return
        }
        if (typeof templateList === 'string') {
          global$2.send({
            url: templateList,
            success(text) {
              callback(JSON.parse(text))
            },
          })
        } else {
          callback(templateList)
        }
      }
    }
    const replaceTemplateValues = function (html, templateValues) {
      global$1.each(templateValues, (v, k) => {
        if (typeof v === 'function') {
          v = v(k)
        }
        html = html.replace(new RegExp(`\\{\\$${k}\\}`, 'g'), v)
      })
      return html
    }
    const replaceVals = function (editor, e) {
      const { dom } = editor; const vl = Settings.getTemplateReplaceValues(editor)
      global$1.each(dom.select('*', e), (e) => {
        global$1.each(vl, (v, k) => {
          if (dom.hasClass(e, k)) {
            if (typeof vl[k] === 'function') {
              vl[k](e)
            }
          }
        })
      })
    }
    const hasClass = function (n, c) {
      return new RegExp(`\\b${c}\\b`, 'g').test(n.className)
    }
    const insertTemplate = function (editor, ui, html) {
      let el
      let n
      const { dom } = editor
      const sel = editor.selection.getContent()
      html = replaceTemplateValues(html, Settings.getTemplateReplaceValues(editor))
      el = dom.create('div', null, html)
      n = dom.select('.mceTmpl', el)
      if (n && n.length > 0) {
        el = dom.create('div', null)
        el.appendChild(n[0].cloneNode(true))
      }
      global$1.each(dom.select('*', el), (n) => {
        if (hasClass(n, Settings.getCreationDateClasses(editor).replace(/\s+/g, '|'))) {
          n.innerHTML = DateTimeHelper.getDateTime(editor, Settings.getCdateFormat(editor))
        }
        if (hasClass(n, Settings.getModificationDateClasses(editor).replace(/\s+/g, '|'))) {
          n.innerHTML = DateTimeHelper.getDateTime(editor, Settings.getMdateFormat(editor))
        }
        if (hasClass(n, Settings.getSelectedContentClasses(editor).replace(/\s+/g, '|'))) {
          n.innerHTML = sel
        }
      })
      replaceVals(editor, el)
      editor.execCommand('mceInsertContent', false, el.innerHTML)
      editor.addVisual()
    }
    const Templates = {
      createTemplateList,
      replaceTemplateValues,
      replaceVals,
      insertTemplate,
    }

    const register = function (editor) {
      editor.addCommand('mceInsertTemplate', curry(Templates.insertTemplate, editor))
    }
    const Commands = { register }

    const setup = function (editor) {
      editor.on('PreProcess', (o) => {
        const { dom } = editor; const dateFormat = Settings.getMdateFormat(editor)
        global$1.each(dom.select('div', o.node), (e) => {
          if (dom.hasClass(e, 'mceTmpl')) {
            global$1.each(dom.select('*', e), (e) => {
              if (dom.hasClass(e, editor.getParam('template_mdate_classes', 'mdate').replace(/\s+/g, '|'))) {
                e.innerHTML = DateTimeHelper.getDateTime(editor, dateFormat)
              }
            })
            Templates.replaceVals(editor, e)
          }
        })
      })
    }
    const FilterContent = { setup }

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

    const global$3 = tinymce.util.Tools.resolve('tinymce.util.Promise')

    const getPreviewContent = function (editor, html) {
      if (html.indexOf('<html>') === -1) {
        let contentCssLinks_1 = ''
        global$1.each(editor.contentCSS, (url) => {
          contentCssLinks_1 += `<link type="text/css" rel="stylesheet" href="${editor.documentBaseURI.toAbsolute(url)}">`
        })
        let bodyClass = editor.settings.body_class || ''
        if (bodyClass.indexOf('=') !== -1) {
          bodyClass = editor.getParam('body_class', '', 'hash')
          bodyClass = bodyClass[editor.id] || ''
        }
        html = `${'<!DOCTYPE html>' + '<html>' + '<head>'}${contentCssLinks_1}</head>` + `<body class="${bodyClass}">${html}</body>` + `</html>`
      }
      return Templates.replaceTemplateValues(html, Settings.getPreviewReplaceValues(editor))
    }
    const open = function (editor, templateList) {
      const createTemplates = function () {
        if (!templateList || templateList.length === 0) {
          const message = editor.translate('No templates defined.')
          editor.notificationManager.open({
            text: message,
            type: 'info',
          })
          return Option.none()
        }
        return Option.from(global$1.map(templateList, (template, index) => ({
          selected: index === 0,
          text: template.title,
          value: {
            url: template.url,
            content: template.content,
            description: template.description,
          },
        })))
      }
      const createSelectBoxItems = function (templates) {
        return map(templates, (v) => ({
          text: v.text,
          value: v.text,
        }))
      }
      const findTemplate = function (templates, templateTitle) {
        return find(templates, (t) => t.text === templateTitle)
      }
      const getTemplateContent = function (t) {
        return new global$3((resolve, reject) => {
          if (t.value.url) {
            global$2.send({
              url: t.value.url,
              success(html) {
                resolve(html)
              },
              error(e) {
                reject(e)
              },
            })
          } else {
            resolve(t.value.content)
          }
        })
      }
      const onChange = function (templates) {
        return function (api, change) {
          if (change.name === 'template') {
            const newTemplateTitle = api.getData().template
            findTemplate(templates, newTemplateTitle).each((t) => {
              api.block('Loading...')
              getTemplateContent(t).then((previewHtml) => {
                const previewContent = getPreviewContent(editor, previewHtml)
                api.setData({ preview: previewContent })
                api.unblock()
              })
            })
          }
        }
      }
      const onSubmit = function (templates) {
        return function (api) {
          const data = api.getData()
          findTemplate(templates, data.template).each((t) => {
            getTemplateContent(t).then((previewHtml) => {
              Templates.insertTemplate(editor, false, previewHtml)
              api.close()
            })
          })
        }
      }
      const openDialog = function (templates) {
        const selectBoxItems = createSelectBoxItems(templates)
        const dialogSpec = function (bodyItems, initialData) {
          return {
            title: 'Insert Template',
            size: 'large',
            body: {
              type: 'panel',
              items: bodyItems,
            },
            initialData,
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
            onSubmit: onSubmit(templates),
            onChange: onChange(templates),
          }
        }
        const dialogApi = editor.windowManager.open(dialogSpec([], {
          template: '',
          preview: '',
        }))
        dialogApi.block('Loading...')
        getTemplateContent(templates[0]).then((previewHtml) => {
          const content = getPreviewContent(editor, previewHtml)
          const bodyItems = [
            {
              type: 'selectbox',
              name: 'template',
              label: 'Templates',
              items: selectBoxItems,
            },
            {
              label: 'Preview',
              type: 'iframe',
              name: 'preview',
              flex: true,
              sandboxed: false,
            },
          ]
          const initialData = {
            template: templates[0].text,
            preview: content,
          }
          dialogApi.unblock()
          dialogApi.redial(dialogSpec(bodyItems, initialData))
          dialogApi.focus('template')
        })
      }
      const optTemplates = createTemplates()
      optTemplates.each(openDialog)
    }
    const Dialog = { open }

    const showDialog = function (editor) {
      return function (templates) {
        Dialog.open(editor, templates)
      }
    }
    const register$1 = function (editor) {
      editor.ui.registry.addButton('template', {
        icon: 'template',
        tooltip: 'Insert template',
        onAction: Templates.createTemplateList(editor.settings, showDialog(editor)),
      })
      editor.ui.registry.addMenuItem('template', {
        icon: 'template',
        text: 'Insert template...',
        onAction: Templates.createTemplateList(editor.settings, showDialog(editor)),
      })
    }
    const Buttons = { register: register$1 }

    global.add('template', (editor) => {
      Buttons.register(editor)
      Commands.register(editor)
      FilterContent.setup(editor)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
