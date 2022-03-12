(function () {
  const autosave = (function () {
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

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.LocalStorage')

    const global$2 = tinymce.util.Tools.resolve('tinymce.util.Tools')

    const fireRestoreDraft = function (editor) {
      return editor.fire('RestoreDraft')
    }
    const fireStoreDraft = function (editor) {
      return editor.fire('StoreDraft')
    }
    const fireRemoveDraft = function (editor) {
      return editor.fire('RemoveDraft')
    }

    const parse = function (timeString, defaultTime) {
      const multiples = {
        s: 1000,
        m: 60000,
      }
      const toParse = timeString || defaultTime
      const parsedTime = /^(\d+)([ms]?)$/.exec(`${toParse}`)
      return (parsedTime[2] ? multiples[parsedTime[2]] : 1) * parseInt(toParse, 10)
    }

    const shouldAskBeforeUnload = function (editor) {
      return editor.getParam('autosave_ask_before_unload', true)
    }
    const getAutoSavePrefix = function (editor) {
      let prefix = editor.getParam('autosave_prefix', 'tinymce-autosave-{path}{query}{hash}-{id}-')
      prefix = prefix.replace(/\{path\}/g, document.location.pathname)
      prefix = prefix.replace(/\{query\}/g, document.location.search)
      prefix = prefix.replace(/\{hash\}/g, document.location.hash)
      prefix = prefix.replace(/\{id\}/g, editor.id)
      return prefix
    }
    const shouldRestoreWhenEmpty = function (editor) {
      return editor.getParam('autosave_restore_when_empty', false)
    }
    const getAutoSaveInterval = function (editor) {
      return parse(editor.settings.autosave_interval, '30s')
    }
    const getAutoSaveRetention = function (editor) {
      return parse(editor.settings.autosave_retention, '20m')
    }

    const isEmpty = function (editor, html) {
      const forcedRootBlockName = editor.settings.forced_root_block
      html = global$2.trim(typeof html === 'undefined' ? editor.getBody().innerHTML : html)
      return html === '' || new RegExp(`^<${forcedRootBlockName}[^>]*>((\xA0|&nbsp;|[ \t]|<br[^>]*>)+?|)</${forcedRootBlockName}>|<br>$`, 'i').test(html)
    }
    const hasDraft = function (editor) {
      const time = parseInt(global$1.getItem(`${getAutoSavePrefix(editor)}time`), 10) || 0
      if (new Date().getTime() - time > getAutoSaveRetention(editor)) {
        removeDraft(editor, false)
        return false
      }
      return true
    }
    var removeDraft = function (editor, fire) {
      const prefix = getAutoSavePrefix(editor)
      global$1.removeItem(`${prefix}draft`)
      global$1.removeItem(`${prefix}time`)
      if (fire !== false) {
        fireRemoveDraft(editor)
      }
    }
    const storeDraft = function (editor) {
      const prefix = getAutoSavePrefix(editor)
      if (!isEmpty(editor) && editor.isDirty()) {
        global$1.setItem(`${prefix}draft`, editor.getContent({
          format: 'raw',
          no_events: true,
        }))
        global$1.setItem(`${prefix}time`, new Date().getTime().toString())
        fireStoreDraft(editor)
      }
    }
    const restoreDraft = function (editor) {
      const prefix = getAutoSavePrefix(editor)
      if (hasDraft(editor)) {
        editor.setContent(global$1.getItem(`${prefix}draft`), { format: 'raw' })
        fireRestoreDraft(editor)
      }
    }
    const startStoreDraft = function (editor, started) {
      const interval = getAutoSaveInterval(editor)
      if (!started.get()) {
        setInterval(() => {
          if (!editor.removed) {
            storeDraft(editor)
          }
        }, interval)
        started.set(true)
      }
    }
    const restoreLastDraft = function (editor) {
      editor.undoManager.transact(() => {
        restoreDraft(editor)
        removeDraft(editor)
      })
      editor.focus()
    }

    function curry(fn) {
      const initialArgs = []
      for (let _i = 1; _i < arguments.length; _i++) {
        initialArgs[_i - 1] = arguments[_i]
      }
      return function () {
        const restArgs = []
        for (let _i = 0; _i < arguments.length; _i++) {
          restArgs[_i] = arguments[_i]
        }
        const all = initialArgs.concat(restArgs)
        return fn.apply(null, all)
      }
    }

    const get = function (editor) {
      return {
        hasDraft: curry(hasDraft, editor),
        storeDraft: curry(storeDraft, editor),
        restoreDraft: curry(restoreDraft, editor),
        removeDraft: curry(removeDraft, editor),
        isEmpty: curry(isEmpty, editor),
      }
    }

    const global$3 = tinymce.util.Tools.resolve('tinymce.EditorManager')

    global$3._beforeUnloadHandler = function () {
      let msg
      global$2.each(global$3.get(), (editor) => {
        if (editor.plugins.autosave) {
          editor.plugins.autosave.storeDraft()
        }
        if (!msg && editor.isDirty() && shouldAskBeforeUnload(editor)) {
          msg = editor.translate('You have unsaved changes are you sure you want to navigate away?')
        }
      })
      return msg
    }
    const setup = function (editor) {
      window.onbeforeunload = global$3._beforeUnloadHandler
    }

    const makeSetupHandler = function (editor, started) {
      return function (api) {
        api.setDisabled(!hasDraft(editor))
        const editorEventCallback = function () {
          return api.setDisabled(!hasDraft(editor))
        }
        editor.on('StoreDraft RestoreDraft RemoveDraft', editorEventCallback)
        return function () {
          return editor.off('StoreDraft RestoreDraft RemoveDraft', editorEventCallback)
        }
      }
    }
    const register = function (editor, started) {
      startStoreDraft(editor, started)
      editor.ui.registry.addButton('restoredraft', {
        tooltip: 'Restore last draft',
        icon: 'restore-draft',
        onAction() {
          restoreLastDraft(editor)
        },
        onSetup: makeSetupHandler(editor, started),
      })
      editor.ui.registry.addMenuItem('restoredraft', {
        text: 'Restore last draft',
        icon: 'restore-draft',
        onAction() {
          restoreLastDraft(editor)
        },
        onSetup: makeSetupHandler(editor, started),
      })
    }

    global.add('autosave', (editor) => {
      const started = Cell(false)
      setup(editor)
      register(editor, started)
      editor.on('init', () => {
        if (shouldRestoreWhenEmpty(editor) && editor.dom.isEmpty(editor.getBody())) {
          restoreDraft(editor)
        }
      })
      return get(editor)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
