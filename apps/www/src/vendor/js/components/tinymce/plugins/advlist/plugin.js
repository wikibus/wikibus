(function () {
  const advlist = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools')

    const applyListFormat = function (editor, listName, styleValue) {
      const cmd = listName === 'UL' ? 'InsertUnorderedList' : 'InsertOrderedList'
      editor.execCommand(cmd, false, styleValue === false ? null : { 'list-style-type': styleValue })
    }
    const Actions = { applyListFormat }

    const register = function (editor) {
      editor.addCommand('ApplyUnorderedListStyle', (ui, value) => {
        Actions.applyListFormat(editor, 'UL', value['list-style-type'])
      })
      editor.addCommand('ApplyOrderedListStyle', (ui, value) => {
        Actions.applyListFormat(editor, 'OL', value['list-style-type'])
      })
    }
    const Commands = { register }

    const getNumberStyles = function (editor) {
      const styles = editor.getParam('advlist_number_styles', 'default,lower-alpha,lower-greek,lower-roman,upper-alpha,upper-roman')
      return styles ? styles.split(/[ ,]/) : []
    }
    const getBulletStyles = function (editor) {
      const styles = editor.getParam('advlist_bullet_styles', 'default,circle,square')
      return styles ? styles.split(/[ ,]/) : []
    }
    const Settings = {
      getNumberStyles,
      getBulletStyles,
    }

    const constant = function (value) {
      return function () {
        return value
      }
    }
    const never = constant(false)
    const always = constant(true)

    const never$1 = never
    const always$1 = always
    const none = function () {
      return NONE
    }
    var NONE = (function () {
      const eq = function (o) {
        return o.isNone()
      }
      const call$$1 = function (thunk) {
        return thunk()
      }
      const id = function (n) {
        return n
      }
      const noop$$1 = function () {
      }
      const nul = function () {
        return null
      }
      const undef = function () {
        return undefined
      }
      const me = {
        fold(n, s) {
          return n()
        },
        is: never$1,
        isSome: never$1,
        isNone: always$1,
        getOr: id,
        getOrThunk: call$$1,
        getOrDie(msg) {
          throw new Error(msg || 'error: getOrDie called on none.')
        },
        getOrNull: nul,
        getOrUndefined: undef,
        or: id,
        orThunk: call$$1,
        map: none,
        ap: none,
        each: noop$$1,
        bind: none,
        flatten: none,
        exists: never$1,
        forall: always$1,
        filter: none,
        equals: eq,
        equals_: eq,
        toArray() {
          return []
        },
        toString: constant('none()'),
      }
      if (Object.freeze) { Object.freeze(me) }
      return me
    }())
    var some = function (a) {
      const constant_a = function () {
        return a
      }
      const self = function () {
        return me
      }
      const map = function (f) {
        return some(f(a))
      }
      const bind = function (f) {
        return f(a)
      }
      var me = {
        fold(n, s) {
          return s(a)
        },
        is(v) {
          return a === v
        },
        isSome: always$1,
        isNone: never$1,
        getOr: constant_a,
        getOrThunk: constant_a,
        getOrDie: constant_a,
        getOrNull: constant_a,
        getOrUndefined: constant_a,
        or: self,
        orThunk: self,
        map,
        ap(optfab) {
          return optfab.fold(none, (fab) => some(fab(a)))
        },
        each(f) {
          f(a)
        },
        bind,
        flatten: constant_a,
        exists: bind,
        forall: bind,
        filter(f) {
          return f(a) ? me : NONE
        },
        equals(o) {
          return o.is(a)
        },
        equals_(o, elementEq) {
          return o.fold(never$1, (b) => elementEq(a, b))
        },
        toArray() {
          return [a]
        },
        toString() {
          return `some(${a})`
        },
      }
      return me
    }
    const from = function (value) {
      return value === null || value === undefined ? NONE : some(value)
    }
    const Option = {
      some,
      none,
      from,
    }

    const isChildOfBody = function (editor, elm) {
      return editor.$.contains(editor.getBody(), elm)
    }
    const isTableCellNode = function (node) {
      return node && /^(TH|TD)$/.test(node.nodeName)
    }
    const isListNode = function (editor) {
      return function (node) {
        return node && /^(OL|UL|DL)$/.test(node.nodeName) && isChildOfBody(editor, node)
      }
    }
    const getSelectedStyleType = function (editor) {
      const listElm = editor.dom.getParent(editor.selection.getNode(), 'ol,ul')
      const style = editor.dom.getStyle(listElm, 'listStyleType')
      return Option.from(style)
    }
    const ListUtils = {
      isTableCellNode,
      isListNode,
      getSelectedStyleType,
    }

    const findIndex = function (list, predicate) {
      for (let index = 0; index < list.length; index++) {
        const element = list[index]
        if (predicate(element)) {
          return index
        }
      }
      return -1
    }
    const styleValueToText = function (styleValue) {
      return styleValue.replace(/\-/g, ' ').replace(/\b\w/g, (chr) => chr.toUpperCase())
    }
    const isWithinList = function (editor, e, nodeName) {
      const tableCellIndex = findIndex(e.parents, ListUtils.isTableCellNode)
      const parents = tableCellIndex !== -1 ? e.parents.slice(0, tableCellIndex) : e.parents
      const lists = global$1.grep(parents, ListUtils.isListNode(editor))
      return lists.length > 0 && lists[0].nodeName === nodeName
    }
    const addSplitButton = function (editor, id, tooltip, cmd, nodeName, styles) {
      editor.ui.registry.addSplitButton(id, {
        tooltip,
        icon: nodeName === 'OL' ? 'ordered-list' : 'unordered-list',
        presets: 'toolbar',
        columns: 3,
        fetch(callback) {
          const items = global$1.map(styles, (styleValue) => {
            const iconStyle = nodeName === 'OL' ? 'num' : 'bull'
            const iconName = styleValue === 'disc' || styleValue === 'decimal' ? 'default' : styleValue
            const itemValue = styleValue === 'default' ? '' : styleValue
            const displayText = styleValueToText(styleValue)
            return {
              type: 'choiceitem',
              value: itemValue,
              icon: `list-${iconStyle}-${iconName}`,
              text: displayText,
              ariaLabel: displayText,
            }
          })
          callback(items)
        },
        onAction() {
          return editor.execCommand(cmd)
        },
        onItemAction(splitButtonApi, value) {
          Actions.applyListFormat(editor, nodeName, value)
        },
        select(value) {
          const listStyleType = ListUtils.getSelectedStyleType(editor)
          return listStyleType.map((listStyle) => value === listStyle).getOr(false)
        },
        onSetup(api) {
          const nodeChangeHandler = function (e) {
            api.setActive(isWithinList(editor, e, nodeName))
          }
          editor.on('nodeChange', nodeChangeHandler)
          return function () {
            return editor.off('nodeChange', nodeChangeHandler)
          }
        },
      })
    }
    const addButton = function (editor, id, tooltip, cmd, nodeName, styles) {
      editor.ui.registry.addToggleButton(id, {
        active: false,
        tooltip,
        icon: nodeName === 'OL' ? 'ordered-list' : 'unordered-list',
        onSetup(api) {
          const nodeChangeHandler = function (e) {
            api.setActive(isWithinList(editor, e, nodeName))
          }
          editor.on('nodeChange', nodeChangeHandler)
          return function () {
            return editor.off('nodeChange', nodeChangeHandler)
          }
        },
        onAction() {
          return editor.execCommand(cmd)
        },
      })
    }
    const addControl = function (editor, id, tooltip, cmd, nodeName, styles) {
      if (styles.length > 0) {
        addSplitButton(editor, id, tooltip, cmd, nodeName, styles)
      } else {
        addButton(editor, id, tooltip, cmd, nodeName, styles)
      }
    }
    const register$1 = function (editor) {
      addControl(editor, 'numlist', 'Numbered list', 'InsertOrderedList', 'OL', Settings.getNumberStyles(editor))
      addControl(editor, 'bullist', 'Bullet list', 'InsertUnorderedList', 'UL', Settings.getBulletStyles(editor))
    }
    const Buttons = { register: register$1 }

    global.add('advlist', (editor) => {
      const hasPlugin = function (editor, plugin) {
        const plugins = editor.settings.plugins ? editor.settings.plugins : ''
        return global$1.inArray(plugins.split(/[ ,]/), plugin) !== -1
      }
      if (hasPlugin(editor, 'lists')) {
        Buttons.register(editor)
        Commands.register(editor)
      }
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
