(function () {
  const preview = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools')

    const getPreviewDialogWidth = function (editor) {
      return parseInt(editor.getParam('plugin_preview_width', '650'), 10)
    }
    const getPreviewDialogHeight = function (editor) {
      return parseInt(editor.getParam('plugin_preview_height', '500'), 10)
    }
    const getContentStyle = function (editor) {
      return editor.getParam('content_style', '')
    }
    const Settings = {
      getPreviewDialogWidth,
      getPreviewDialogHeight,
      getContentStyle,
    }

    const getPreviewHtml = function (editor) {
      let headHtml = ''
      const { encode } = editor.dom
      const contentStyle = Settings.getContentStyle(editor)
      headHtml += `<base href="${encode(editor.documentBaseURI.getURI())}">`
      if (contentStyle) {
        headHtml += `<style type="text/css">${contentStyle}</style>`
      }
      global$1.each(editor.contentCSS, (url) => {
        headHtml += `<link type="text/css" rel="stylesheet" href="${encode(editor.documentBaseURI.toAbsolute(url))}">`
      })
      let bodyId = editor.settings.body_id || 'tinymce'
      if (bodyId.indexOf('=') !== -1) {
        bodyId = editor.getParam('body_id', '', 'hash')
        bodyId = bodyId[editor.id] || bodyId
      }
      let bodyClass = editor.settings.body_class || ''
      if (bodyClass.indexOf('=') !== -1) {
        bodyClass = editor.getParam('body_class', '', 'hash')
        bodyClass = bodyClass[editor.id] || ''
      }
      const preventClicksOnLinksScript = '<script>' + 'document.addEventListener && document.addEventListener("click", function(e) {' + 'for (var elm = e.target; elm; elm = elm.parentNode) {' + 'if (elm.nodeName === "A") {' + 'e.preventDefault();' + '}' + '}' + '}, false);' + '</script> '
      const dirAttr = editor.settings.directionality ? ` dir="${editor.settings.directionality}"` : ''
      const previewHtml = `${'<!DOCTYPE html>' + '<html>' + '<head>'}${headHtml}</head>` + `<body id="${encode(bodyId)}" class="mce-content-body ${encode(bodyClass)}"${encode(dirAttr)}>${editor.getContent()}${preventClicksOnLinksScript}</body>` + `</html>`
      return previewHtml
    }
    const IframeContent = { getPreviewHtml }

    const open = function (editor) {
      const content = IframeContent.getPreviewHtml(editor)
      const dataApi = editor.windowManager.open({
        title: 'Preview',
        size: 'large',
        body: {
          type: 'panel',
          items: [{
            name: 'preview',
            type: 'iframe',
            sandboxed: true,
            flex: true,
          }],
        },
        buttons: [{
          type: 'cancel',
          name: 'close',
          text: 'Close',
          primary: true,
        }],
        initialData: { preview: content },
      })
      dataApi.focus('close')
    }

    const register = function (editor) {
      editor.addCommand('mcePreview', () => {
        open(editor)
      })
    }
    const Commands = { register }

    const register$1 = function (editor) {
      editor.ui.registry.addButton('preview', {
        icon: 'preview',
        tooltip: 'Preview',
        onAction() {
          return editor.execCommand('mcePreview')
        },
      })
      editor.ui.registry.addMenuItem('preview', {
        icon: 'preview',
        text: 'Preview',
        onAction() {
          return editor.execCommand('mcePreview')
        },
      })
    }
    const Buttons = { register: register$1 }

    global.add('preview', (editor) => {
      Commands.register(editor)
      Buttons.register(editor)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
