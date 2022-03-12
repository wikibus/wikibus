(function () {
  const fullpage = (function () {
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

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools')

    const global$2 = tinymce.util.Tools.resolve('tinymce.html.DomParser')

    const global$3 = tinymce.util.Tools.resolve('tinymce.html.Node')

    const global$4 = tinymce.util.Tools.resolve('tinymce.html.Serializer')

    const shouldHideInSourceView = function (editor) {
      return editor.getParam('fullpage_hide_in_source_view')
    }
    const getDefaultXmlPi = function (editor) {
      return editor.getParam('fullpage_default_xml_pi')
    }
    const getDefaultEncoding = function (editor) {
      return editor.getParam('fullpage_default_encoding')
    }
    const getDefaultFontFamily = function (editor) {
      return editor.getParam('fullpage_default_font_family')
    }
    const getDefaultFontSize = function (editor) {
      return editor.getParam('fullpage_default_font_size')
    }
    const getDefaultTextColor = function (editor) {
      return editor.getParam('fullpage_default_text_color')
    }
    const getDefaultTitle = function (editor) {
      return editor.getParam('fullpage_default_title')
    }
    const getDefaultDocType = function (editor) {
      return editor.getParam('fullpage_default_doctype', '<!DOCTYPE html>')
    }
    const Settings = {
      shouldHideInSourceView,
      getDefaultXmlPi,
      getDefaultEncoding,
      getDefaultFontFamily,
      getDefaultFontSize,
      getDefaultTextColor,
      getDefaultTitle,
      getDefaultDocType,
    }

    const parseHeader = function (head) {
      return global$2({
        validate: false,
        root_name: '#document',
      }).parse(head)
    }
    const htmlToData = function (editor, head) {
      const headerFragment = parseHeader(head)
      const data = {}
      let elm, matches
      function getAttr(elm, name) {
        const value = elm.attr(name)
        return value || ''
      }
      data.fontface = Settings.getDefaultFontFamily(editor)
      data.fontsize = Settings.getDefaultFontSize(editor)
      elm = headerFragment.firstChild
      if (elm.type === 7) {
        data.xml_pi = true
        matches = /encoding="([^"]+)"/.exec(elm.value)
        if (matches) {
          data.docencoding = matches[1]
        }
      }
      elm = headerFragment.getAll('#doctype')[0]
      if (elm) {
        data.doctype = `<!DOCTYPE${elm.value}>`
      }
      elm = headerFragment.getAll('title')[0]
      if (elm && elm.firstChild) {
        data.title = elm.firstChild.value
      }
      global$1.each(headerFragment.getAll('meta'), (meta) => {
        const name = meta.attr('name')
        const httpEquiv = meta.attr('http-equiv')
        let matches
        if (name) {
          data[name.toLowerCase()] = meta.attr('content')
        } else if (httpEquiv === 'Content-Type') {
          matches = /charset\s*=\s*(.*)\s*/gi.exec(meta.attr('content'))
          if (matches) {
            data.docencoding = matches[1]
          }
        }
      })
      elm = headerFragment.getAll('html')[0]
      if (elm) {
        data.langcode = getAttr(elm, 'lang') || getAttr(elm, 'xml:lang')
      }
      data.stylesheets = []
      global$1.each(headerFragment.getAll('link'), (link) => {
        if (link.attr('rel') === 'stylesheet') {
          data.stylesheets.push(link.attr('href'))
        }
      })
      elm = headerFragment.getAll('body')[0]
      if (elm) {
        data.langdir = getAttr(elm, 'dir')
        data.style = getAttr(elm, 'style')
        data.visited_color = getAttr(elm, 'vlink')
        data.link_color = getAttr(elm, 'link')
        data.active_color = getAttr(elm, 'alink')
      }
      return data
    }
    const dataToHtml = function (editor, data, head) {
      let headerFragment, headElement, html, elm, value
      const { dom } = editor
      function setAttr(elm, name, value) {
        elm.attr(name, value || undefined)
      }
      function addHeadNode(node) {
        if (headElement.firstChild) {
          headElement.insert(node, headElement.firstChild)
        } else {
          headElement.append(node)
        }
      }
      headerFragment = parseHeader(head)
      headElement = headerFragment.getAll('head')[0]
      if (!headElement) {
        elm = headerFragment.getAll('html')[0]
        headElement = new global$3('head', 1)
        if (elm.firstChild) {
          elm.insert(headElement, elm.firstChild, true)
        } else {
          elm.append(headElement)
        }
      }
      elm = headerFragment.firstChild
      if (data.xml_pi) {
        value = 'version="1.0"'
        if (data.docencoding) {
          value += ` encoding="${data.docencoding}"`
        }
        if (elm.type !== 7) {
          elm = new global$3('xml', 7)
          headerFragment.insert(elm, headerFragment.firstChild, true)
        }
        elm.value = value
      } else if (elm && elm.type === 7) {
        elm.remove()
      }
      elm = headerFragment.getAll('#doctype')[0]
      if (data.doctype) {
        if (!elm) {
          elm = new global$3('#doctype', 10)
          if (data.xml_pi) {
            headerFragment.insert(elm, headerFragment.firstChild)
          } else {
            addHeadNode(elm)
          }
        }
        elm.value = data.doctype.substring(9, data.doctype.length - 1)
      } else if (elm) {
        elm.remove()
      }
      elm = null
      global$1.each(headerFragment.getAll('meta'), (meta) => {
        if (meta.attr('http-equiv') === 'Content-Type') {
          elm = meta
        }
      })
      if (data.docencoding) {
        if (!elm) {
          elm = new global$3('meta', 1)
          elm.attr('http-equiv', 'Content-Type')
          elm.shortEnded = true
          addHeadNode(elm)
        }
        elm.attr('content', `text/html; charset=${data.docencoding}`)
      } else if (elm) {
        elm.remove()
      }
      elm = headerFragment.getAll('title')[0]
      if (data.title) {
        if (!elm) {
          elm = new global$3('title', 1)
          addHeadNode(elm)
        } else {
          elm.empty()
        }
        elm.append(new global$3('#text', 3)).value = data.title
      } else if (elm) {
        elm.remove()
      }
      global$1.each('keywords,description,author,copyright,robots'.split(','), (name) => {
        const nodes = headerFragment.getAll('meta')
        let i, meta
        const value = data[name]
        for (i = 0; i < nodes.length; i++) {
          meta = nodes[i]
          if (meta.attr('name') === name) {
            if (value) {
              meta.attr('content', value)
            } else {
              meta.remove()
            }
            return
          }
        }
        if (value) {
          elm = new global$3('meta', 1)
          elm.attr('name', name)
          elm.attr('content', value)
          elm.shortEnded = true
          addHeadNode(elm)
        }
      })
      const currentStyleSheetsMap = {}
      global$1.each(headerFragment.getAll('link'), (stylesheet) => {
        if (stylesheet.attr('rel') === 'stylesheet') {
          currentStyleSheetsMap[stylesheet.attr('href')] = stylesheet
        }
      })
      global$1.each(data.stylesheets, (stylesheet) => {
        if (!currentStyleSheetsMap[stylesheet]) {
          elm = new global$3('link', 1)
          elm.attr({
            rel: 'stylesheet',
            text: 'text/css',
            href: stylesheet,
          })
          elm.shortEnded = true
          addHeadNode(elm)
        }
        delete currentStyleSheetsMap[stylesheet]
      })
      global$1.each(currentStyleSheetsMap, (stylesheet) => {
        stylesheet.remove()
      })
      elm = headerFragment.getAll('body')[0]
      if (elm) {
        setAttr(elm, 'dir', data.langdir)
        setAttr(elm, 'style', data.style)
        setAttr(elm, 'vlink', data.visited_color)
        setAttr(elm, 'link', data.link_color)
        setAttr(elm, 'alink', data.active_color)
        dom.setAttribs(editor.getBody(), {
          style: data.style,
          dir: data.dir,
          vLink: data.visited_color,
          link: data.link_color,
          aLink: data.active_color,
        })
      }
      elm = headerFragment.getAll('html')[0]
      if (elm) {
        setAttr(elm, 'lang', data.langcode)
        setAttr(elm, 'xml:lang', data.langcode)
      }
      if (!headElement.firstChild) {
        headElement.remove()
      }
      html = global$4({
        validate: false,
        indent: true,
        apply_source_formatting: true,
        indent_before: 'head,html,body,meta,title,script,link,style',
        indent_after: 'head,html,body,meta,title,script,link,style',
      }).serialize(headerFragment)
      return html.substring(0, html.indexOf('</body>'))
    }
    const Parser = {
      parseHeader,
      htmlToData,
      dataToHtml,
    }

    const { hasOwnProperty } = Object.prototype
    const shallow = function (old, nu) {
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
            if (hasOwnProperty.call(curObject, key)) {
              ret[key] = merger(ret[key], curObject[key])
            }
          }
        }
        return ret
      }
    }
    const merge = baseMerge(shallow)

    const open = function (editor, headState) {
      const data = Parser.htmlToData(editor, headState.get())
      const defaultData = {
        title: '',
        keywords: '',
        description: '',
        robots: '',
        author: '',
        docencoding: '',
      }
      const initialData = merge(defaultData, data)
      editor.windowManager.open({
        title: 'Metadata and Document Properties',
        size: 'normal',
        body: {
          type: 'panel',
          items: [
            {
              name: 'title',
              type: 'input',
              label: 'Title',
            },
            {
              name: 'keywords',
              type: 'input',
              label: 'Keywords',
            },
            {
              name: 'description',
              type: 'input',
              label: 'Description',
            },
            {
              name: 'robots',
              type: 'input',
              label: 'Robots',
            },
            {
              name: 'author',
              type: 'input',
              label: 'Author',
            },
            {
              name: 'docencoding',
              type: 'input',
              label: 'Encoding',
            },
          ],
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
        onSubmit(api) {
          const nuData = api.getData()
          const headHtml = Parser.dataToHtml(editor, global$1.extend(data, nuData), headState.get())
          headState.set(headHtml)
          api.close()
        },
      })
    }
    const Dialog = { open }

    const register = function (editor, headState) {
      editor.addCommand('mceFullPageProperties', () => {
        Dialog.open(editor, headState)
      })
    }
    const Commands = { register }

    const protectHtml = function (protect, html) {
      global$1.each(protect, (pattern) => {
        html = html.replace(pattern, (str) => `<!--mce:protected ${escape(str)}-->`)
      })
      return html
    }
    const unprotectHtml = function (html) {
      return html.replace(/<!--mce:protected ([\s\S]*?)-->/g, (a, m) => unescape(m))
    }
    const Protect = {
      protectHtml,
      unprotectHtml,
    }

    const { each } = global$1
    const low = function (s) {
      return s.replace(/<\/?[A-Z]+/g, (a) => a.toLowerCase())
    }
    const handleSetContent = function (editor, headState, footState, evt) {
      let startPos; let endPos; let content; let headerFragment; let styles = ''
      const { dom } = editor
      let elm
      if (evt.selection) {
        return
      }
      content = Protect.protectHtml(editor.settings.protect, evt.content)
      if (evt.format === 'raw' && headState.get()) {
        return
      }
      if (evt.source_view && Settings.shouldHideInSourceView(editor)) {
        return
      }
      if (content.length === 0 && !evt.source_view) {
        content = `${global$1.trim(headState.get())}\n${global$1.trim(content)}\n${global$1.trim(footState.get())}`
      }
      content = content.replace(/<(\/?)BODY/gi, '<$1body')
      startPos = content.indexOf('<body')
      if (startPos !== -1) {
        startPos = content.indexOf('>', startPos)
        headState.set(low(content.substring(0, startPos + 1)))
        endPos = content.indexOf('</body', startPos)
        if (endPos === -1) {
          endPos = content.length
        }
        evt.content = global$1.trim(content.substring(startPos + 1, endPos))
        footState.set(low(content.substring(endPos)))
      } else {
        headState.set(getDefaultHeader(editor))
        footState.set('\n</body>\n</html>')
      }
      headerFragment = Parser.parseHeader(headState.get())
      each(headerFragment.getAll('style'), (node) => {
        if (node.firstChild) {
          styles += node.firstChild.value
        }
      })
      elm = headerFragment.getAll('body')[0]
      if (elm) {
        dom.setAttribs(editor.getBody(), {
          style: elm.attr('style') || '',
          dir: elm.attr('dir') || '',
          vLink: elm.attr('vlink') || '',
          link: elm.attr('link') || '',
          aLink: elm.attr('alink') || '',
        })
      }
      dom.remove('fullpage_styles')
      const headElm = editor.getDoc().getElementsByTagName('head')[0]
      if (styles) {
        dom.add(headElm, 'style', { id: 'fullpage_styles' }, styles)
        elm = dom.get('fullpage_styles')
        if (elm.styleSheet) {
          elm.styleSheet.cssText = styles
        }
      }
      const currentStyleSheetsMap = {}
      global$1.each(headElm.getElementsByTagName('link'), (stylesheet) => {
        if (stylesheet.rel === 'stylesheet' && stylesheet.getAttribute('data-mce-fullpage')) {
          currentStyleSheetsMap[stylesheet.href] = stylesheet
        }
      })
      global$1.each(headerFragment.getAll('link'), (stylesheet) => {
        const href = stylesheet.attr('href')
        if (!href) {
          return true
        }
        if (!currentStyleSheetsMap[href] && stylesheet.attr('rel') === 'stylesheet') {
          dom.add(headElm, 'link', {
            rel: 'stylesheet',
            text: 'text/css',
            href,
            'data-mce-fullpage': '1',
          })
        }
        delete currentStyleSheetsMap[href]
      })
      global$1.each(currentStyleSheetsMap, (stylesheet) => {
        stylesheet.parentNode.removeChild(stylesheet)
      })
    }
    var getDefaultHeader = function (editor) {
      let header = ''; let value; let styles = ''
      if (Settings.getDefaultXmlPi(editor)) {
        const piEncoding = Settings.getDefaultEncoding(editor)
        header += `<?xml version="1.0" encoding="${piEncoding || 'ISO-8859-1'}" ?>\n`
      }
      header += Settings.getDefaultDocType(editor)
      header += '\n<html>\n<head>\n'
      if (value = Settings.getDefaultTitle(editor)) {
        header += `<title>${value}</title>\n`
      }
      if (value = Settings.getDefaultEncoding(editor)) {
        header += `<meta http-equiv="Content-Type" content="text/html; charset=${value}" />\n`
      }
      if (value = Settings.getDefaultFontFamily(editor)) {
        styles += `font-family: ${value};`
      }
      if (value = Settings.getDefaultFontSize(editor)) {
        styles += `font-size: ${value};`
      }
      if (value = Settings.getDefaultTextColor(editor)) {
        styles += `color: ${value};`
      }
      header += `</head>\n<body${styles ? ` style="${styles}"` : ''}>\n`
      return header
    }
    const handleGetContent = function (editor, head, foot, evt) {
      if (!evt.selection && (!evt.source_view || !Settings.shouldHideInSourceView(editor))) {
        evt.content = Protect.unprotectHtml(`${global$1.trim(head)}\n${global$1.trim(evt.content)}\n${global$1.trim(foot)}`)
      }
    }
    const setup = function (editor, headState, footState) {
      editor.on('BeforeSetContent', (evt) => {
        handleSetContent(editor, headState, footState, evt)
      })
      editor.on('GetContent', (evt) => {
        handleGetContent(editor, headState.get(), footState.get(), evt)
      })
    }
    const FilterContent = { setup }

    const register$1 = function (editor) {
      editor.ui.registry.addButton('fullpage', {
        tooltip: 'Metadata and document properties',
        icon: 'new-document',
        onAction() {
          editor.execCommand('mceFullPageProperties')
        },
      })
      editor.ui.registry.addMenuItem('fullpage', {
        text: 'Metadata and document properties',
        icon: 'new-document',
        onAction() {
          editor.execCommand('mceFullPageProperties')
        },
      })
    }
    const Buttons = { register: register$1 }

    global.add('fullpage', (editor) => {
      const headState = Cell(''); const footState = Cell('')
      Commands.register(editor, headState)
      Buttons.register(editor)
      FilterContent.setup(editor, headState, footState)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
