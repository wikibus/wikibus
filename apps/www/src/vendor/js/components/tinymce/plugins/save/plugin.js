(function () {
  const save = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    const global$1 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils')

    const global$2 = tinymce.util.Tools.resolve('tinymce.util.Tools')

    const enableWhenDirty = function (editor) {
      return editor.getParam('save_enablewhendirty', true)
    }
    const hasOnSaveCallback = function (editor) {
      return !!editor.getParam('save_onsavecallback')
    }
    const hasOnCancelCallback = function (editor) {
      return !!editor.getParam('save_oncancelcallback')
    }
    const Settings = {
      enableWhenDirty,
      hasOnSaveCallback,
      hasOnCancelCallback,
    }

    const displayErrorMessage = function (editor, message) {
      editor.notificationManager.open({
        text: message,
        type: 'error',
      })
    }
    const save = function (editor) {
      let formObj
      formObj = global$1.DOM.getParent(editor.id, 'form')
      if (Settings.enableWhenDirty(editor) && !editor.isDirty()) {
        return
      }
      editor.save()
      if (Settings.hasOnSaveCallback(editor)) {
        editor.execCallback('save_onsavecallback', editor)
        editor.nodeChanged()
        return
      }
      if (formObj) {
        editor.setDirty(false)
        if (!formObj.onsubmit || formObj.onsubmit()) {
          if (typeof formObj.submit === 'function') {
            formObj.submit()
          } else {
            displayErrorMessage(editor, 'Error: Form submit field collision.')
          }
        }
        editor.nodeChanged()
      } else {
        displayErrorMessage(editor, 'Error: No form element found.')
      }
    }
    const cancel = function (editor) {
      const h = global$2.trim(editor.startContent)
      if (Settings.hasOnCancelCallback(editor)) {
        editor.execCallback('save_oncancelcallback', editor)
        return
      }
      editor.setContent(h)
      editor.undoManager.clear()
      editor.nodeChanged()
    }
    const Actions = {
      save,
      cancel,
    }

    const register = function (editor) {
      editor.addCommand('mceSave', () => {
        Actions.save(editor)
      })
      editor.addCommand('mceCancel', () => {
        Actions.cancel(editor)
      })
    }
    const Commands = { register }

    const stateToggle = function (editor) {
      return function (api) {
        const handler = function () {
          api.setDisabled(Settings.enableWhenDirty(editor) && !editor.isDirty())
        }
        editor.on('nodeChange dirty', handler)
        return function () {
          return editor.off('nodeChange dirty', handler)
        }
      }
    }
    const register$1 = function (editor) {
      editor.ui.registry.addButton('save', {
        icon: 'save',
        tooltip: 'Save',
        disabled: true,
        onAction() {
          return editor.execCommand('mceSave')
        },
        onSetup: stateToggle(editor),
      })
      editor.ui.registry.addButton('cancel', {
        icon: 'cancel',
        tooltip: 'Cancel',
        disabled: true,
        onAction() {
          return editor.execCommand('mceCancel')
        },
        onSetup: stateToggle(editor),
      })
      editor.addShortcut('Meta+S', '', 'mceSave')
    }
    const Buttons = { register: register$1 }

    global.add('save', (editor) => {
      Buttons.register(editor)
      Commands.register(editor)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
