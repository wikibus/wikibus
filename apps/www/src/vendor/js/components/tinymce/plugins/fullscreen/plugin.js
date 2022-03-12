(function () {
  const fullscreen = (function () {
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

    const get = function (fullscreenState) {
      return {
        isFullscreen() {
          return fullscreenState.get() !== null
        },
      }
    }
    const Api = { get }

    const global$1 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils')

    const fireFullscreenStateChanged = function (editor, state) {
      editor.fire('FullscreenStateChanged', { state })
    }
    const Events = { fireFullscreenStateChanged }

    const { DOM } = global$1
    const getWindowSize = function () {
      let w
      let h
      const win = window
      const doc = document
      const { body } = doc
      if (body.offsetWidth) {
        w = body.offsetWidth
        h = body.offsetHeight
      }
      if (win.innerWidth && win.innerHeight) {
        w = win.innerWidth
        h = win.innerHeight
      }
      return {
        w,
        h,
      }
    }
    const getScrollPos = function () {
      const vp = DOM.getViewPort()
      return {
        x: vp.x,
        y: vp.y,
      }
    }
    const setScrollPos = function (pos) {
      window.scrollTo(pos.x, pos.y)
    }
    const toggleFullscreen = function (editor, fullscreenState) {
      const { body } = document
      const { documentElement } = document
      let editorContainerStyle
      let editorContainer, iframe, iframeStyle
      const fullscreenInfo = fullscreenState.get()
      const resize = function () {
        DOM.setStyle(iframe, 'height', getWindowSize().h - (editorContainer.clientHeight - iframe.clientHeight))
      }
      const removeResize = function () {
        DOM.unbind(window, 'resize', resize)
      }
      editorContainer = editor.getContainer()
      editorContainerStyle = editorContainer.style
      iframe = editor.getContentAreaContainer().firstChild
      iframeStyle = iframe.style
      if (!fullscreenInfo) {
        const newFullScreenInfo = {
          scrollPos: getScrollPos(),
          containerWidth: editorContainerStyle.width,
          containerHeight: editorContainerStyle.height,
          iframeWidth: iframeStyle.width,
          iframeHeight: iframeStyle.height,
          resizeHandler: resize,
          removeHandler: removeResize,
        }
        iframeStyle.width = iframeStyle.height = '100%'
        editorContainerStyle.width = editorContainerStyle.height = ''
        DOM.addClass(body, 'tox-fullscreen')
        DOM.addClass(documentElement, 'tox-fullscreen')
        DOM.addClass(editorContainer, 'tox-fullscreen')
        DOM.bind(window, 'resize', resize)
        editor.on('remove', removeResize)
        resize()
        fullscreenState.set(newFullScreenInfo)
        Events.fireFullscreenStateChanged(editor, true)
      } else {
        iframeStyle.width = fullscreenInfo.iframeWidth
        iframeStyle.height = fullscreenInfo.iframeHeight
        if (fullscreenInfo.containerWidth) {
          editorContainerStyle.width = fullscreenInfo.containerWidth
        }
        if (fullscreenInfo.containerHeight) {
          editorContainerStyle.height = fullscreenInfo.containerHeight
        }
        DOM.removeClass(body, 'tox-fullscreen')
        DOM.removeClass(documentElement, 'tox-fullscreen')
        DOM.removeClass(editorContainer, 'tox-fullscreen')
        setScrollPos(fullscreenInfo.scrollPos)
        DOM.unbind(window, 'resize', fullscreenInfo.resizeHandler)
        editor.off('remove', fullscreenInfo.removeHandler)
        fullscreenState.set(null)
        Events.fireFullscreenStateChanged(editor, false)
      }
    }
    const Actions = { toggleFullscreen }

    const register = function (editor, fullscreenState) {
      editor.addCommand('mceFullScreen', () => {
        Actions.toggleFullscreen(editor, fullscreenState)
      })
    }
    const Commands = { register }

    const makeSetupHandler = function (editor, fullscreenState) {
      return function (api) {
        api.setActive(fullscreenState.get() !== null)
        const editorEventCallback = function (e) {
          return api.setActive(e.state)
        }
        editor.on('FullscreenStateChanged', editorEventCallback)
        return function () {
          return editor.off('FullscreenStateChanged', editorEventCallback)
        }
      }
    }
    const register$1 = function (editor, fullscreenState) {
      editor.ui.registry.addToggleMenuItem('fullscreen', {
        text: 'Fullscreen',
        shortcut: 'Meta+Shift+F',
        onAction() {
          return editor.execCommand('mceFullScreen')
        },
        onSetup: makeSetupHandler(editor, fullscreenState),
      })
      editor.ui.registry.addToggleButton('fullscreen', {
        tooltip: 'Fullscreen',
        icon: 'fullscreen',
        onAction() {
          return editor.execCommand('mceFullScreen')
        },
        onSetup: makeSetupHandler(editor, fullscreenState),
      })
    }
    const Buttons = { register: register$1 }

    global.add('fullscreen', (editor) => {
      const fullscreenState = Cell(null)
      if (editor.settings.inline) {
        return Api.get(fullscreenState)
      }
      Commands.register(editor, fullscreenState)
      Buttons.register(editor, fullscreenState)
      editor.addShortcut('Meta+Shift+F', '', 'mceFullScreen')
      return Api.get(fullscreenState)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
