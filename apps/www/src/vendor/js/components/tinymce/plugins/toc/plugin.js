(function () {
  const toc = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    const global$1 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils')

    const global$2 = tinymce.util.Tools.resolve('tinymce.util.I18n')

    const global$3 = tinymce.util.Tools.resolve('tinymce.util.Tools')

    const getTocClass = function (editor) {
      return editor.getParam('toc_class', 'mce-toc')
    }
    const getTocHeader = function (editor) {
      const tagName = editor.getParam('toc_header', 'h2')
      return /^h[1-6]$/.test(tagName) ? tagName : 'h2'
    }
    const getTocDepth = function (editor) {
      const depth = parseInt(editor.getParam('toc_depth', '3'), 10)
      return depth >= 1 && depth <= 9 ? depth : 3
    }
    const Settings = {
      getTocClass,
      getTocHeader,
      getTocDepth,
    }

    const create = function (prefix) {
      let counter = 0
      return function () {
        const guid = new Date().getTime().toString(32)
        return prefix + guid + (counter++).toString(32)
      }
    }
    const Guid = { create }

    const tocId = Guid.create('mcetoc_')
    const generateSelector = function generateSelector(depth) {
      let i
      const selector = []
      for (i = 1; i <= depth; i++) {
        selector.push(`h${i}`)
      }
      return selector.join(',')
    }
    const hasHeaders = function (editor) {
      return readHeaders(editor).length > 0
    }
    var readHeaders = function (editor) {
      const tocClass = Settings.getTocClass(editor)
      const headerTag = Settings.getTocHeader(editor)
      const selector = generateSelector(Settings.getTocDepth(editor))
      let headers = editor.$(selector)
      if (headers.length && /^h[1-9]$/i.test(headerTag)) {
        headers = headers.filter((i, el) => !editor.dom.hasClass(el.parentNode, tocClass))
      }
      return global$3.map(headers, (h) => ({
        id: h.id ? h.id : tocId(),
        level: parseInt(h.nodeName.replace(/^H/i, ''), 10),
        title: editor.$.text(h),
        element: h,
      }))
    }
    const getMinLevel = function (headers) {
      let i; let minLevel = 9
      for (i = 0; i < headers.length; i++) {
        if (headers[i].level < minLevel) {
          minLevel = headers[i].level
        }
        if (minLevel === 1) {
          return minLevel
        }
      }
      return minLevel
    }
    const generateTitle = function (tag, title) {
      const openTag = `<${tag} contenteditable="true">`
      const closeTag = `</${tag}>`
      return openTag + global$1.DOM.encode(title) + closeTag
    }
    const generateTocHtml = function (editor) {
      const html = generateTocContentHtml(editor)
      return `<div class="${editor.dom.encode(Settings.getTocClass(editor))}" contenteditable="false">${html}</div>`
    }
    var generateTocContentHtml = function (editor) {
      let html = ''
      const headers = readHeaders(editor)
      let prevLevel = getMinLevel(headers) - 1
      let i, ii, h, nextLevel
      if (!headers.length) {
        return ''
      }
      html += generateTitle(Settings.getTocHeader(editor), global$2.translate('Table of Contents'))
      for (i = 0; i < headers.length; i++) {
        h = headers[i]
        h.element.id = h.id
        nextLevel = headers[i + 1] && headers[i + 1].level
        if (prevLevel === h.level) {
          html += '<li>'
        } else {
          for (ii = prevLevel; ii < h.level; ii++) {
            html += '<ul><li>'
          }
        }
        html += `<a href="#${h.id}">${h.title}</a>`
        if (nextLevel === h.level || !nextLevel) {
          html += '</li>'
          if (!nextLevel) {
            html += '</ul>'
          }
        } else {
          for (ii = h.level; ii > nextLevel; ii--) {
            html += '</li></ul><li>'
          }
        }
        prevLevel = h.level
      }
      return html
    }
    const isEmptyOrOffscren = function (editor, nodes) {
      return !nodes.length || editor.dom.getParents(nodes[0], '.mce-offscreen-selection').length > 0
    }
    const insertToc = function (editor) {
      const tocClass = Settings.getTocClass(editor)
      const $tocElm = editor.$(`.${tocClass}`)
      if (isEmptyOrOffscren(editor, $tocElm)) {
        editor.insertContent(generateTocHtml(editor))
      } else {
        updateToc(editor)
      }
    }
    var updateToc = function (editor) {
      const tocClass = Settings.getTocClass(editor)
      const $tocElm = editor.$(`.${tocClass}`)
      if ($tocElm.length) {
        editor.undoManager.transact(() => {
          $tocElm.html(generateTocContentHtml(editor))
        })
      }
    }
    const Toc = {
      hasHeaders,
      insertToc,
      updateToc,
    }

    const register = function (editor) {
      editor.addCommand('mceInsertToc', () => {
        Toc.insertToc(editor)
      })
      editor.addCommand('mceUpdateToc', () => {
        Toc.updateToc(editor)
      })
    }
    const Commands = { register }

    const setup = function (editor) {
      const { $ } = editor; const tocClass = Settings.getTocClass(editor)
      editor.on('PreProcess', (e) => {
        const $tocElm = $(`.${tocClass}`, e.node)
        if ($tocElm.length) {
          $tocElm.removeAttr('contentEditable')
          $tocElm.find('[contenteditable]').removeAttr('contentEditable')
        }
      })
      editor.on('SetContent', () => {
        const $tocElm = $(`.${tocClass}`)
        if ($tocElm.length) {
          $tocElm.attr('contentEditable', false)
          $tocElm.children(':first-child').attr('contentEditable', true)
        }
      })
    }
    const FilterContent = { setup }

    const toggleState = function (editor) {
      return function (api) {
        const toggleDisabledState = function () {
          return api.setDisabled(editor.readonly || !Toc.hasHeaders(editor))
        }
        toggleDisabledState()
        editor.on('LoadContent SetContent change', toggleDisabledState)
        return function () {
          return editor.on('LoadContent SetContent change', toggleDisabledState)
        }
      }
    }
    const isToc = function (editor) {
      return function (elm) {
        return elm && editor.dom.is(elm, `.${Settings.getTocClass(editor)}`) && editor.getBody().contains(elm)
      }
    }
    const register$1 = function (editor) {
      editor.ui.registry.addButton('toc', {
        icon: 'toc',
        tooltip: 'Table of contents',
        onAction() {
          return editor.execCommand('mceInsertToc')
        },
        onSetup: toggleState(editor),
      })
      editor.ui.registry.addButton('tocupdate', {
        icon: 'reload',
        tooltip: 'Update',
        onAction() {
          return editor.execCommand('mceUpdateToc')
        },
      })
      editor.ui.registry.addMenuItem('toc', {
        icon: 'toc',
        text: 'Table of contents',
        onAction() {
          return editor.execCommand('mceInsertToc')
        },
        onSetup: toggleState(editor),
      })
      editor.ui.registry.addContextToolbar('toc', {
        items: 'tocupdate',
        predicate: isToc(editor),
        scope: 'node',
        position: 'node',
      })
    }
    const Buttons = { register: register$1 }

    global.add('toc', (editor) => {
      Commands.register(editor)
      Buttons.register(editor)
      FilterContent.setup(editor)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
