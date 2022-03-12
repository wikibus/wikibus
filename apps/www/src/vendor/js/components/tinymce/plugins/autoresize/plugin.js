(function () {
  const autoresize = (function () {
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

    const global$1 = tinymce.util.Tools.resolve('tinymce.Env')

    const global$2 = tinymce.util.Tools.resolve('tinymce.util.Delay')

    const getAutoResizeMinHeight = function (editor) {
      return editor.getParam('min_height', editor.getElement().offsetHeight, 'number')
    }
    const getAutoResizeMaxHeight = function (editor) {
      return editor.getParam('max_height', 0, 'number')
    }
    const getAutoResizeOverflowPadding = function (editor) {
      return editor.getParam('autoresize_overflow_padding', 1, 'number')
    }
    const getAutoResizeBottomMargin = function (editor) {
      return editor.getParam('autoresize_bottom_margin', 50, 'number')
    }
    const shouldAutoResizeOnInit = function (editor) {
      return editor.getParam('autoresize_on_init', true, 'boolean')
    }
    const Settings = {
      getAutoResizeMinHeight,
      getAutoResizeMaxHeight,
      getAutoResizeOverflowPadding,
      getAutoResizeBottomMargin,
      shouldAutoResizeOnInit,
    }

    const isFullscreen = function (editor) {
      return editor.plugins.fullscreen && editor.plugins.fullscreen.isFullscreen()
    }
    var wait = function (editor, oldSize, times, interval, callback) {
      global$2.setEditorTimeout(editor, () => {
        resize(editor, oldSize)
        if (times--) {
          wait(editor, oldSize, times, interval, callback)
        } else if (callback) {
          callback()
        }
      }, interval)
    }
    const toggleScrolling = function (editor, state) {
      const body = editor.getBody()
      if (body) {
        body.style.overflowY = state ? '' : 'hidden'
        if (!state) {
          body.scrollTop = 0
        }
      }
    }
    const getMargin = function (dom, elm, pos, computed) {
      const value = parseInt(dom.getStyle(elm, `margin-${pos}`, computed), 10)
      return isNaN(value) ? 0 : value
    }
    var resize = function (editor, oldSize) {
      let deltaSize, resizeHeight, contentHeight
      const { dom } = editor
      const doc = editor.getDoc()
      if (!doc) {
        return
      }
      if (isFullscreen(editor)) {
        toggleScrolling(editor, true)
        return
      }
      const { body } = doc
      resizeHeight = Settings.getAutoResizeMinHeight(editor)
      const marginTop = getMargin(dom, body, 'top', true)
      const marginBottom = getMargin(dom, body, 'bottom', true)
      contentHeight = body.offsetHeight + marginTop + marginBottom
      if (contentHeight < 0) {
        contentHeight = 0
      }
      const containerHeight = editor.getContainer().scrollHeight
      const contentAreaHeight = editor.getContentAreaContainer().scrollHeight
      const chromeHeight = containerHeight - contentAreaHeight
      if (contentHeight + chromeHeight > Settings.getAutoResizeMinHeight(editor)) {
        resizeHeight = contentHeight + chromeHeight
      }
      const maxHeight = Settings.getAutoResizeMaxHeight(editor)
      if (maxHeight && resizeHeight > maxHeight) {
        resizeHeight = maxHeight
        toggleScrolling(editor, true)
      } else {
        toggleScrolling(editor, false)
      }
      if (resizeHeight !== oldSize.get()) {
        deltaSize = resizeHeight - oldSize.get()
        dom.setStyle(editor.getContainer(), 'height', `${resizeHeight}px`)
        oldSize.set(resizeHeight)
        if (global$1.webkit && deltaSize < 0) {
          resize(editor, oldSize)
        }
      }
    }
    const setup = function (editor, oldSize) {
      editor.on('init', () => {
        const overflowPadding = Settings.getAutoResizeOverflowPadding(editor)
        const bottomMargin = Settings.getAutoResizeBottomMargin(editor)
        const { dom } = editor
        dom.setStyles(editor.getBody(), {
          paddingLeft: overflowPadding,
          paddingRight: overflowPadding,
          paddingBottom: bottomMargin,
          'min-height': 0,
        })
      })
      editor.on('nodechange setcontent keyup FullscreenStateChanged', (e) => {
        resize(editor, oldSize)
      })
      if (Settings.shouldAutoResizeOnInit(editor)) {
        editor.on('init', () => {
          wait(editor, oldSize, 20, 100, () => {
            wait(editor, oldSize, 5, 1000)
          })
        })
      }
    }
    const Resize = {
      setup,
      resize,
    }

    const register = function (editor, oldSize) {
      editor.addCommand('mceAutoResize', () => {
        Resize.resize(editor, oldSize)
      })
    }
    const Commands = { register }

    global.add('autoresize', (editor) => {
      if (!editor.settings.hasOwnProperty('resize')) {
        editor.settings.resize = false
      }
      if (!editor.inline) {
        const oldSize = Cell(0)
        Commands.register(editor, oldSize)
        Resize.setup(editor, oldSize)
      }
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
