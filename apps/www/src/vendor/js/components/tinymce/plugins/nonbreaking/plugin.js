(function () {
  const nonbreaking = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    const stringRepeat = function (string, repeats) {
      let str = ''
      for (let index = 0; index < repeats; index++) {
        str += string
      }
      return str
    }
    const isVisualCharsEnabled = function (editor) {
      return editor.plugins.visualchars ? editor.plugins.visualchars.isEnabled() : false
    }
    const insertNbsp = function (editor, times) {
      const nbsp = isVisualCharsEnabled(editor) ? '<span class="mce-nbsp">&nbsp;</span>' : '&nbsp;'
      editor.insertContent(stringRepeat(nbsp, times))
      editor.dom.setAttrib(editor.dom.select('span.mce-nbsp'), 'data-mce-bogus', '1')
    }
    const Actions = { insertNbsp }

    const register = function (editor) {
      editor.addCommand('mceNonBreaking', () => {
        Actions.insertNbsp(editor, 1)
      })
    }
    const Commands = { register }

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.VK')

    const getKeyboardSpaces = function (editor) {
      const spaces = editor.getParam('nonbreaking_force_tab', 0)
      if (typeof spaces === 'boolean') {
        return spaces === true ? 3 : 0
      }
      return spaces
    }
    const Settings = { getKeyboardSpaces }

    const setup = function (editor) {
      const spaces = Settings.getKeyboardSpaces(editor)
      if (spaces > 0) {
        editor.on('keydown', (e) => {
          if (e.keyCode === global$1.TAB && !e.isDefaultPrevented()) {
            if (e.shiftKey) {
              return
            }
            e.preventDefault()
            e.stopImmediatePropagation()
            Actions.insertNbsp(editor, spaces)
          }
        })
      }
    }
    const Keyboard = { setup }

    const register$1 = function (editor) {
      editor.ui.registry.addButton('nonbreaking', {
        icon: 'non-breaking',
        tooltip: 'Nonbreaking space',
        onAction() {
          return editor.execCommand('mceNonBreaking')
        },
      })
      editor.ui.registry.addMenuItem('nonbreaking', {
        icon: 'non-breaking',
        text: 'Nonbreaking space',
        onAction() {
          return editor.execCommand('mceNonBreaking')
        },
      })
    }
    const Buttons = { register: register$1 }

    global.add('nonbreaking', (editor) => {
      Commands.register(editor)
      Buttons.register(editor)
      Keyboard.setup(editor)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
