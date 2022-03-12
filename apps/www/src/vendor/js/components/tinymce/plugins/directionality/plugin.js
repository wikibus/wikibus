(function () {
  const directionality = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools')

    const setDir = function (editor, dir) {
      const { dom } = editor
      let curDir
      const blocks = editor.selection.getSelectedBlocks()
      if (blocks.length) {
        curDir = dom.getAttrib(blocks[0], 'dir')
        global$1.each(blocks, (block) => {
          if (!dom.getParent(block.parentNode, `*[dir="${dir}"]`, dom.getRoot())) {
            dom.setAttrib(block, 'dir', curDir !== dir ? dir : null)
          }
        })
        editor.nodeChanged()
      }
    }
    const Direction = { setDir }

    const register = function (editor) {
      editor.addCommand('mceDirectionLTR', () => {
        Direction.setDir(editor, 'ltr')
      })
      editor.addCommand('mceDirectionRTL', () => {
        Direction.setDir(editor, 'rtl')
      })
    }
    const Commands = { register }

    const generateSelector = function (dir) {
      const selector = []
      global$1.each('h1 h2 h3 h4 h5 h6 div p'.split(' '), (name) => {
        selector.push(`${name}[dir=${dir}]`)
      })
      return selector.join(',')
    }
    const register$1 = function (editor) {
      editor.ui.registry.addToggleButton('ltr', {
        tooltip: 'Left to right',
        icon: 'ltr',
        onAction() {
          return editor.execCommand('mceDirectionLTR')
        },
        onSetup(buttonApi) {
          return editor.selection.selectorChangedWithUnbind(generateSelector('ltr'), buttonApi.setActive).unbind
        },
      })
      editor.ui.registry.addToggleButton('rtl', {
        tooltip: 'Right to left',
        icon: 'rtl',
        onAction() {
          return editor.execCommand('mceDirectionRTL')
        },
        onSetup(buttonApi) {
          return editor.selection.selectorChangedWithUnbind(generateSelector('rtl'), buttonApi.setActive).unbind
        },
      })
    }
    const Buttons = { register: register$1 }

    global.add('directionality', (editor) => {
      Commands.register(editor)
      Buttons.register(editor)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
