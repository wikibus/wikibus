(function () {
  const noneditable = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools')

    const getNonEditableClass = function (editor) {
      return editor.getParam('noneditable_noneditable_class', 'mceNonEditable')
    }
    const getEditableClass = function (editor) {
      return editor.getParam('noneditable_editable_class', 'mceEditable')
    }
    const getNonEditableRegExps = function (editor) {
      const nonEditableRegExps = editor.getParam('noneditable_regexp', [])
      if (nonEditableRegExps && nonEditableRegExps.constructor === RegExp) {
        return [nonEditableRegExps]
      }
      return nonEditableRegExps
    }
    const Settings = {
      getNonEditableClass,
      getEditableClass,
      getNonEditableRegExps,
    }

    const hasClass = function (checkClassName) {
      return function (node) {
        return (` ${node.attr('class')} `).indexOf(checkClassName) !== -1
      }
    }
    const replaceMatchWithSpan = function (editor, content, cls) {
      return function (match) {
        const args = arguments; const index = args[args.length - 2]
        const prevChar = index > 0 ? content.charAt(index - 1) : ''
        if (prevChar === '"') {
          return match
        }
        if (prevChar === '>') {
          const findStartTagIndex = content.lastIndexOf('<', index)
          if (findStartTagIndex !== -1) {
            const tagHtml = content.substring(findStartTagIndex, index)
            if (tagHtml.indexOf('contenteditable="false"') !== -1) {
              return match
            }
          }
        }
        return `<span class="${cls}" data-mce-content="${editor.dom.encode(args[0])}">${editor.dom.encode(typeof args[1] === 'string' ? args[1] : args[0])}</span>`
      }
    }
    const convertRegExpsToNonEditable = function (editor, nonEditableRegExps, e) {
      let i = nonEditableRegExps.length; let { content } = e
      if (e.format === 'raw') {
        return
      }
      while (i--) {
        content = content.replace(nonEditableRegExps[i], replaceMatchWithSpan(editor, content, Settings.getNonEditableClass(editor)))
      }
      e.content = content
    }
    const setup = function (editor) {
      let editClass, nonEditClass
      const contentEditableAttrName = 'contenteditable'
      editClass = ` ${global$1.trim(Settings.getEditableClass(editor))} `
      nonEditClass = ` ${global$1.trim(Settings.getNonEditableClass(editor))} `
      const hasEditClass = hasClass(editClass)
      const hasNonEditClass = hasClass(nonEditClass)
      const nonEditableRegExps = Settings.getNonEditableRegExps(editor)
      editor.on('PreInit', () => {
        if (nonEditableRegExps.length > 0) {
          editor.on('BeforeSetContent', (e) => {
            convertRegExpsToNonEditable(editor, nonEditableRegExps, e)
          })
        }
        editor.parser.addAttributeFilter('class', (nodes) => {
          let i = nodes.length; let node
          while (i--) {
            node = nodes[i]
            if (hasEditClass(node)) {
              node.attr(contentEditableAttrName, 'true')
            } else if (hasNonEditClass(node)) {
              node.attr(contentEditableAttrName, 'false')
            }
          }
        })
        editor.serializer.addAttributeFilter(contentEditableAttrName, (nodes) => {
          let i = nodes.length; let node
          while (i--) {
            node = nodes[i]
            if (!hasEditClass(node) && !hasNonEditClass(node)) {
              continue
            }
            if (nonEditableRegExps.length > 0 && node.attr('data-mce-content')) {
              node.name = '#text'
              node.type = 3
              node.raw = true
              node.value = node.attr('data-mce-content')
            } else {
              node.attr(contentEditableAttrName, null)
            }
          }
        })
      })
    }
    const FilterContent = { setup }

    global.add('noneditable', (editor) => {
      FilterContent.setup(editor)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
