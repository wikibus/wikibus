(function () {
  const visualblocks = (function () {
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

    const fireVisualBlocks = function (editor, state) {
      editor.fire('VisualBlocks', { state })
    }
    const Events = { fireVisualBlocks }

    const toggleVisualBlocks = function (editor, pluginUrl, enabledState) {
      const { dom } = editor
      dom.toggleClass(editor.getBody(), 'mce-visualblocks')
      enabledState.set(!enabledState.get())
      Events.fireVisualBlocks(editor, enabledState.get())
    }
    const VisualBlocks = { toggleVisualBlocks }

    const register = function (editor, pluginUrl, enabledState) {
      editor.addCommand('mceVisualBlocks', () => {
        VisualBlocks.toggleVisualBlocks(editor, pluginUrl, enabledState)
      })
    }
    const Commands = { register }

    const isEnabledByDefault = function (editor) {
      return editor.getParam('visualblocks_default_state', false, 'boolean')
    }
    const Settings = { isEnabledByDefault }

    const setup = function (editor, pluginUrl, enabledState) {
      editor.on('PreviewFormats AfterPreviewFormats', (e) => {
        if (enabledState.get()) {
          editor.dom.toggleClass(editor.getBody(), 'mce-visualblocks', e.type === 'afterpreviewformats')
        }
      })
      editor.on('init', () => {
        if (Settings.isEnabledByDefault(editor)) {
          VisualBlocks.toggleVisualBlocks(editor, pluginUrl, enabledState)
        }
      })
      editor.on('remove', () => {
        editor.dom.removeClass(editor.getBody(), 'mce-visualblocks')
      })
    }
    const Bindings = { setup }

    const toggleActiveState = function (editor, enabledState) {
      return function (api) {
        api.setActive(enabledState.get())
        const editorEventCallback = function (e) {
          return api.setActive(e.state)
        }
        editor.on('VisualBlocks', editorEventCallback)
        return function () {
          return editor.off('VisualBlocks', editorEventCallback)
        }
      }
    }
    const register$1 = function (editor, enabledState) {
      editor.ui.registry.addToggleButton('visualblocks', {
        icon: 'paragraph',
        tooltip: 'Show blocks',
        onAction() {
          return editor.execCommand('mceVisualBlocks')
        },
        onSetup: toggleActiveState(editor, enabledState),
      })
      editor.ui.registry.addToggleMenuItem('visualblocks', {
        text: 'Show blocks',
        onAction() {
          return editor.execCommand('mceVisualBlocks')
        },
        onSetup: toggleActiveState(editor, enabledState),
      })
    }
    const Buttons = { register: register$1 }

    global.add('visualblocks', (editor, pluginUrl) => {
      const enabledState = Cell(false)
      Commands.register(editor, pluginUrl, enabledState)
      Buttons.register(editor, enabledState)
      Bindings.setup(editor, pluginUrl, enabledState)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
