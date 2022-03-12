(function () {
  const anchor = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    const isValidId = function (id) {
      return /^[A-Za-z][A-Za-z0-9\-:._]*$/.test(id)
    }
    const getId = function (editor) {
      const selectedNode = editor.selection.getNode()
      const isAnchor = selectedNode.tagName === 'A' && editor.dom.getAttrib(selectedNode, 'href') === ''
      return isAnchor ? selectedNode.getAttribute('id') || selectedNode.getAttribute('name') : ''
    }
    const insert = function (editor, id) {
      const selectedNode = editor.selection.getNode()
      const isAnchor = selectedNode.tagName === 'A' && editor.dom.getAttrib(selectedNode, 'href') === ''
      if (isAnchor) {
        selectedNode.removeAttribute('name')
        selectedNode.id = id
        editor.undoManager.add()
      } else {
        editor.focus()
        editor.selection.collapse(true)
        editor.execCommand('mceInsertContent', false, editor.dom.createHTML('a', { id }))
      }
    }
    const Anchor = {
      isValidId,
      getId,
      insert,
    }

    const insertAnchor = function (editor, newId) {
      if (!Anchor.isValidId(newId)) {
        editor.windowManager.alert('Id should start with a letter, followed only by letters, numbers, dashes, dots, colons or underscores.')
        return true
      }
      Anchor.insert(editor, newId)
      return false
    }
    const open = function (editor) {
      const currentId = Anchor.getId(editor)
      editor.windowManager.open({
        title: 'Anchor',
        size: 'normal',
        body: {
          type: 'panel',
          items: [{
            name: 'id',
            type: 'input',
            label: 'ID',
            placeholder: 'example',
          }],
        },
        buttons: [
          {
            type: 'cancel',
            name: 'cancel',
            text: 'Cancel',
          },
          {
            type: 'submit',
            name: 'save',
            text: 'Save',
            primary: true,
          },
        ],
        initialData: { id: currentId },
        onSubmit(api) {
          if (!insertAnchor(editor, api.getData().id)) {
            api.close()
          }
        },
      })
    }
    const Dialog = { open }

    const register = function (editor) {
      editor.addCommand('mceAnchor', () => {
        Dialog.open(editor)
      })
    }
    const Commands = { register }

    const isAnchorNode = function (node) {
      return !node.attr('href') && (node.attr('id') || node.attr('name')) && !node.firstChild
    }
    const setContentEditable = function (state) {
      return function (nodes) {
        for (let i = 0; i < nodes.length; i++) {
          if (isAnchorNode(nodes[i])) {
            nodes[i].attr('contenteditable', state)
          }
        }
      }
    }
    const setup = function (editor) {
      editor.on('PreInit', () => {
        editor.parser.addNodeFilter('a', setContentEditable('false'))
        editor.serializer.addNodeFilter('a', setContentEditable(null))
      })
    }
    const FilterContent = { setup }

    const register$1 = function (editor) {
      editor.ui.registry.addToggleButton('anchor', {
        icon: 'bookmark',
        tooltip: 'Anchor',
        onAction() {
          return editor.execCommand('mceAnchor')
        },
        onSetup(buttonApi) {
          return editor.selection.selectorChangedWithUnbind('a:not([href])', buttonApi.setActive).unbind
        },
      })
      editor.ui.registry.addMenuItem('anchor', {
        icon: 'bookmark',
        text: 'Anchor...',
        onAction() {
          return editor.execCommand('mceAnchor')
        },
      })
    }
    const Buttons = { register: register$1 }

    global.add('anchor', (editor) => {
      FilterContent.setup(editor)
      Commands.register(editor)
      Buttons.register(editor)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
