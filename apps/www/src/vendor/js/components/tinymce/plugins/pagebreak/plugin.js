(function () {
  const pagebreak = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    const global$1 = tinymce.util.Tools.resolve('tinymce.Env')

    const getSeparatorHtml = function (editor) {
      return editor.getParam('pagebreak_separator', '<!-- pagebreak -->')
    }
    const shouldSplitBlock = function (editor) {
      return editor.getParam('pagebreak_split_block', false)
    }
    const Settings = {
      getSeparatorHtml,
      shouldSplitBlock,
    }

    const getPageBreakClass = function () {
      return 'mce-pagebreak'
    }
    const getPlaceholderHtml = function () {
      return `<img src="${global$1.transparentSrc}" class="${getPageBreakClass()}" data-mce-resize="false" data-mce-placeholder />`
    }
    const setup = function (editor) {
      const separatorHtml = Settings.getSeparatorHtml(editor)
      const pageBreakSeparatorRegExp = new RegExp(separatorHtml.replace(/[\?\.\*\[\]\(\)\{\}\+\^\$\:]/g, (a) => `\\${a}`), 'gi')
      editor.on('BeforeSetContent', (e) => {
        e.content = e.content.replace(pageBreakSeparatorRegExp, getPlaceholderHtml())
      })
      editor.on('PreInit', () => {
        editor.serializer.addNodeFilter('img', (nodes) => {
          let i = nodes.length; let node; let className
          while (i--) {
            node = nodes[i]
            className = node.attr('class')
            if (className && className.indexOf('mce-pagebreak') !== -1) {
              const parentNode = node.parent
              if (editor.schema.getBlockElements()[parentNode.name] && Settings.shouldSplitBlock(editor)) {
                parentNode.type = 3
                parentNode.value = separatorHtml
                parentNode.raw = true
                node.remove()
                continue
              }
              node.type = 3
              node.value = separatorHtml
              node.raw = true
            }
          }
        })
      })
    }
    const FilterContent = {
      setup,
      getPlaceholderHtml,
      getPageBreakClass,
    }

    const register = function (editor) {
      editor.addCommand('mcePageBreak', () => {
        if (editor.settings.pagebreak_split_block) {
          editor.insertContent(`<p>${FilterContent.getPlaceholderHtml()}</p>`)
        } else {
          editor.insertContent(FilterContent.getPlaceholderHtml())
        }
      })
    }
    const Commands = { register }

    const setup$1 = function (editor) {
      editor.on('ResolveName', (e) => {
        if (e.target.nodeName === 'IMG' && editor.dom.hasClass(e.target, FilterContent.getPageBreakClass())) {
          e.name = 'pagebreak'
        }
      })
    }
    const ResolveName = { setup: setup$1 }

    const register$1 = function (editor) {
      editor.ui.registry.addButton('pagebreak', {
        icon: 'page-break',
        tooltip: 'Page break',
        onAction() {
          return editor.execCommand('mcePageBreak')
        },
      })
      editor.ui.registry.addMenuItem('pagebreak', {
        text: 'Page break',
        icon: 'page-break',
        onAction() {
          return editor.execCommand('mcePageBreak')
        },
      })
    }
    const Buttons = { register: register$1 }

    global.add('pagebreak', (editor) => {
      Commands.register(editor)
      Buttons.register(editor)
      FilterContent.setup(editor)
      ResolveName.setup(editor)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
