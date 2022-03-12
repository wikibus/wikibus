(function () {
  const searchreplace = (function () {
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

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools')

    function isContentEditableFalse(node) {
      return node && node.nodeType === 1 && node.contentEditable === 'false'
    }
    function findAndReplaceDOMText(regex, node, replacementNode, captureGroup, schema) {
      let m
      const matches = []
      let text; let count = 0; let doc
      let blockElementsMap, hiddenTextElementsMap, shortEndedElementsMap
      doc = node.ownerDocument
      blockElementsMap = schema.getBlockElements()
      hiddenTextElementsMap = schema.getWhiteSpaceElements()
      shortEndedElementsMap = schema.getShortEndedElements()
      function getMatchIndexes(m, captureGroup) {
        captureGroup = captureGroup || 0
        if (!m[0]) {
          throw new Error('findAndReplaceDOMText cannot handle zero-length matches')
        }
        let { index } = m
        if (captureGroup > 0) {
          const cg = m[captureGroup]
          if (!cg) {
            throw new Error('Invalid capture group')
          }
          index += m[0].indexOf(cg)
          m[0] = cg
        }
        return [
          index,
          index + m[0].length,
          [m[0]],
        ]
      }
      function getText(node) {
        let txt
        if (node.nodeType === 3) {
          return node.data
        }
        if (hiddenTextElementsMap[node.nodeName] && !blockElementsMap[node.nodeName]) {
          return ''
        }
        txt = ''
        if (isContentEditableFalse(node)) {
          return '\n'
        }
        if (blockElementsMap[node.nodeName] || shortEndedElementsMap[node.nodeName]) {
          txt += '\n'
        }
        if (node = node.firstChild) {
          do {
            txt += getText(node)
          } while (node = node.nextSibling)
        }
        return txt
      }
      function stepThroughMatches(node, matches, replaceFn) {
        let startNode; let endNode; let startNodeIndex; let endNodeIndex; let innerNodes = []; let atIndex = 0; let curNode = node; let matchLocation = matches.shift(); let matchIndex = 0
        out:
        while (true) {
          if (blockElementsMap[curNode.nodeName] || shortEndedElementsMap[curNode.nodeName] || isContentEditableFalse(curNode)) {
            atIndex++
          }
          if (curNode.nodeType === 3) {
            if (!endNode && curNode.length + atIndex >= matchLocation[1]) {
              endNode = curNode
              endNodeIndex = matchLocation[1] - atIndex
            } else if (startNode) {
              innerNodes.push(curNode)
            }
            if (!startNode && curNode.length + atIndex > matchLocation[0]) {
              startNode = curNode
              startNodeIndex = matchLocation[0] - atIndex
            }
            atIndex += curNode.length
          }
          if (startNode && endNode) {
            curNode = replaceFn({
              startNode,
              startNodeIndex,
              endNode,
              endNodeIndex,
              innerNodes,
              match: matchLocation[2],
              matchIndex,
            })
            atIndex -= endNode.length - endNodeIndex
            startNode = null
            endNode = null
            innerNodes = []
            matchLocation = matches.shift()
            matchIndex++
            if (!matchLocation) {
              break
            }
          } else if ((!hiddenTextElementsMap[curNode.nodeName] || blockElementsMap[curNode.nodeName]) && curNode.firstChild) {
            if (!isContentEditableFalse(curNode)) {
              curNode = curNode.firstChild
              continue
            }
          } else if (curNode.nextSibling) {
            curNode = curNode.nextSibling
            continue
          }
          while (true) {
            if (curNode.nextSibling) {
              curNode = curNode.nextSibling
              break
            } else if (curNode.parentNode !== node) {
              curNode = curNode.parentNode
            } else {
              break out
            }
          }
        }
      }
      function genReplacer(nodeName) {
        let makeReplacementNode
        if (typeof nodeName !== 'function') {
          const stencilNode_1 = nodeName.nodeType ? nodeName : doc.createElement(nodeName)
          makeReplacementNode = function (fill, matchIndex) {
            const clone = stencilNode_1.cloneNode(false)
            clone.setAttribute('data-mce-index', matchIndex)
            if (fill) {
              clone.appendChild(doc.createTextNode(fill))
            }
            return clone
          }
        } else {
          makeReplacementNode = nodeName
        }
        return function (range) {
          let before
          let after
          let parentNode
          const { startNode } = range
          const { endNode } = range
          const { matchIndex } = range
          if (startNode === endNode) {
            const node_1 = startNode
            parentNode = node_1.parentNode
            if (range.startNodeIndex > 0) {
              before = doc.createTextNode(node_1.data.substring(0, range.startNodeIndex))
              parentNode.insertBefore(before, node_1)
            }
            const el = makeReplacementNode(range.match[0], matchIndex)
            parentNode.insertBefore(el, node_1)
            if (range.endNodeIndex < node_1.length) {
              after = doc.createTextNode(node_1.data.substring(range.endNodeIndex))
              parentNode.insertBefore(after, node_1)
            }
            node_1.parentNode.removeChild(node_1)
            return el
          }
          before = doc.createTextNode(startNode.data.substring(0, range.startNodeIndex))
          after = doc.createTextNode(endNode.data.substring(range.endNodeIndex))
          const elA = makeReplacementNode(startNode.data.substring(range.startNodeIndex), matchIndex)
          for (let i = 0, l = range.innerNodes.length; i < l; ++i) {
            const innerNode = range.innerNodes[i]
            const innerEl = makeReplacementNode(innerNode.data, matchIndex)
            innerNode.parentNode.replaceChild(innerEl, innerNode)
          }
          const elB = makeReplacementNode(endNode.data.substring(0, range.endNodeIndex), matchIndex)
          parentNode = startNode.parentNode
          parentNode.insertBefore(before, startNode)
          parentNode.insertBefore(elA, startNode)
          parentNode.removeChild(startNode)
          parentNode = endNode.parentNode
          parentNode.insertBefore(elB, endNode)
          parentNode.insertBefore(after, endNode)
          parentNode.removeChild(endNode)
          return elB
        }
      }
      text = getText(node)
      if (!text) {
        return
      }
      if (regex.global) {
        while (m = regex.exec(text)) {
          matches.push(getMatchIndexes(m, captureGroup))
        }
      } else {
        m = text.match(regex)
        matches.push(getMatchIndexes(m, captureGroup))
      }
      if (matches.length) {
        count = matches.length
        stepThroughMatches(node, matches, genReplacer(replacementNode))
      }
      return count
    }
    const FindReplaceText = { findAndReplaceDOMText }

    const getElmIndex = function (elm) {
      const value = elm.getAttribute('data-mce-index')
      if (typeof value === 'number') {
        return `${value}`
      }
      return value
    }
    const markAllMatches = function (editor, currentIndexState, regex) {
      let node, marker
      marker = editor.dom.create('span', { 'data-mce-bogus': 1 })
      marker.className = 'mce-match-marker'
      node = editor.getBody()
      done(editor, currentIndexState, false)
      return FindReplaceText.findAndReplaceDOMText(regex, node, marker, false, editor.schema)
    }
    const unwrap = function (node) {
      const { parentNode } = node
      if (node.firstChild) {
        parentNode.insertBefore(node.firstChild, node)
      }
      node.parentNode.removeChild(node)
    }
    const findSpansByIndex = function (editor, index) {
      let nodes
      const spans = []
      nodes = global$1.toArray(editor.getBody().getElementsByTagName('span'))
      if (nodes.length) {
        for (let i = 0; i < nodes.length; i++) {
          const nodeIndex = getElmIndex(nodes[i])
          if (nodeIndex === null || !nodeIndex.length) {
            continue
          }
          if (nodeIndex === index.toString()) {
            spans.push(nodes[i])
          }
        }
      }
      return spans
    }
    const moveSelection = function (editor, currentIndexState, forward) {
      let testIndex = currentIndexState.get()
      const { dom } = editor
      forward = forward !== false
      if (forward) {
        testIndex++
      } else {
        testIndex--
      }
      dom.removeClass(findSpansByIndex(editor, currentIndexState.get()), 'mce-match-marker-selected')
      const spans = findSpansByIndex(editor, testIndex)
      if (spans.length) {
        dom.addClass(findSpansByIndex(editor, testIndex), 'mce-match-marker-selected')
        editor.selection.scrollIntoView(spans[0])
        return testIndex
      }
      return -1
    }
    const removeNode = function (dom, node) {
      const parent = node.parentNode
      dom.remove(node)
      if (dom.isEmpty(parent)) {
        dom.remove(parent)
      }
    }
    const find = function (editor, currentIndexState, text, matchCase, wholeWord) {
      text = text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
      text = text.replace(/\s/g, '[^\\S\\r\\n]')
      text = wholeWord ? `\\b${text}\\b` : text
      const count = markAllMatches(editor, currentIndexState, new RegExp(text, matchCase ? 'g' : 'gi'))
      if (count) {
        currentIndexState.set(-1)
        currentIndexState.set(moveSelection(editor, currentIndexState, true))
      }
      return count
    }
    const next = function (editor, currentIndexState) {
      const index = moveSelection(editor, currentIndexState, true)
      if (index !== -1) {
        currentIndexState.set(index)
      }
    }
    const prev = function (editor, currentIndexState) {
      const index = moveSelection(editor, currentIndexState, false)
      if (index !== -1) {
        currentIndexState.set(index)
      }
    }
    const isMatchSpan = function (node) {
      const matchIndex = getElmIndex(node)
      return matchIndex !== null && matchIndex.length > 0
    }
    const replace = function (editor, currentIndexState, text, forward, all) {
      let i; let nodes; let node; let matchIndex; let currentMatchIndex; let nextIndex = currentIndexState.get(); let hasMore
      forward = forward !== false
      node = editor.getBody()
      nodes = global$1.grep(global$1.toArray(node.getElementsByTagName('span')), isMatchSpan)
      for (i = 0; i < nodes.length; i++) {
        const nodeIndex = getElmIndex(nodes[i])
        matchIndex = currentMatchIndex = parseInt(nodeIndex, 10)
        if (all || matchIndex === currentIndexState.get()) {
          if (text.length) {
            nodes[i].firstChild.nodeValue = text
            unwrap(nodes[i])
          } else {
            removeNode(editor.dom, nodes[i])
          }
          while (nodes[++i]) {
            matchIndex = parseInt(getElmIndex(nodes[i]), 10)
            if (matchIndex === currentMatchIndex) {
              removeNode(editor.dom, nodes[i])
            } else {
              i--
              break
            }
          }
          if (forward) {
            nextIndex--
          }
        } else if (currentMatchIndex > currentIndexState.get()) {
          nodes[i].setAttribute('data-mce-index', currentMatchIndex - 1)
        }
      }
      currentIndexState.set(nextIndex)
      if (forward) {
        hasMore = hasNext(editor, currentIndexState)
        next(editor, currentIndexState)
      } else {
        hasMore = hasPrev(editor, currentIndexState)
        prev(editor, currentIndexState)
      }
      return !all && hasMore
    }
    var done = function (editor, currentIndexState, keepEditorSelection) {
      let i, nodes, startContainer, endContainer
      nodes = global$1.toArray(editor.getBody().getElementsByTagName('span'))
      for (i = 0; i < nodes.length; i++) {
        const nodeIndex = getElmIndex(nodes[i])
        if (nodeIndex !== null && nodeIndex.length) {
          if (nodeIndex === currentIndexState.get().toString()) {
            if (!startContainer) {
              startContainer = nodes[i].firstChild
            }
            endContainer = nodes[i].firstChild
          }
          unwrap(nodes[i])
        }
      }
      if (startContainer && endContainer) {
        const rng = editor.dom.createRng()
        rng.setStart(startContainer, 0)
        rng.setEnd(endContainer, endContainer.data.length)
        if (keepEditorSelection !== false) {
          editor.selection.setRng(rng)
        }
        return rng
      }
    }
    var hasNext = function (editor, currentIndexState) {
      return findSpansByIndex(editor, currentIndexState.get() + 1).length > 0
    }
    var hasPrev = function (editor, currentIndexState) {
      return findSpansByIndex(editor, currentIndexState.get() - 1).length > 0
    }
    const Actions = {
      done,
      find,
      next,
      prev,
      replace,
      hasNext,
      hasPrev,
    }

    const get = function (editor, currentIndexState) {
      const done = function (keepEditorSelection) {
        return Actions.done(editor, currentIndexState, keepEditorSelection)
      }
      const find = function (text, matchCase, wholeWord) {
        return Actions.find(editor, currentIndexState, text, matchCase, wholeWord)
      }
      const next = function () {
        return Actions.next(editor, currentIndexState)
      }
      const prev = function () {
        return Actions.prev(editor, currentIndexState)
      }
      const replace = function (text, forward, all) {
        return Actions.replace(editor, currentIndexState, text, forward, all)
      }
      return {
        done,
        find,
        next,
        prev,
        replace,
      }
    }
    const Api = { get }

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

    const typeOf = function (x) {
      if (x === null) { return 'null' }
      const t = typeof x
      if (t === 'object' && Array.prototype.isPrototypeOf(x)) { return 'array' }
      if (t === 'object' && String.prototype.isPrototypeOf(x)) { return 'string' }
      return t
    }
    const isType = function (type) {
      return function (value) {
        return typeOf(value) === type
      }
    }
    const isFunction = isType('function')

    const each = function (xs, f) {
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i]
        f(x, i, xs)
      }
    }
    const { slice } = Array.prototype
    const from$1 = isFunction(Array.from) ? Array.from : function (x) {
      return slice.call(x)
    }

    const open = function (editor, currentIndexState) {
      let last$$1 = {}; let selectedText
      editor.undoManager.add()
      selectedText = global$1.trim(editor.selection.getContent({ format: 'text' }))
      function updateButtonStates(api) {
        const updateNext = Actions.hasNext(editor, currentIndexState) ? api.enable : api.disable
        updateNext('next')
        const updatePrev = Actions.hasPrev(editor, currentIndexState) ? api.enable : api.disable
        updatePrev('prev')
      }
      const disableAll = function (api, disable) {
        const buttons = [
          'replace',
          'replaceall',
          'prev',
          'next',
        ]
        const toggle = disable ? api.disable : api.enable
        each(buttons, toggle)
      }
      function notFoundAlert(api) {
        editor.windowManager.alert('Could not find the specified string.', () => {
          api.focus('findtext')
        })
      }
      const doSubmit = function (api) {
        const data = api.getData()
        if (!data.findtext.length) {
          Actions.done(editor, currentIndexState, false)
          disableAll(api, true)
          updateButtonStates(api)
          return
        }
        if (last$$1.text === data.findtext && last$$1.caseState === data.matchcase && last$$1.wholeWord === data.wholewords) {
          if (!Actions.hasNext(editor, currentIndexState)) {
            notFoundAlert(api)
            return
          }
          Actions.next(editor, currentIndexState)
          updateButtonStates(api)
          return
        }
        const count = Actions.find(editor, currentIndexState, data.findtext, checkToBool(data.matchcase), checkToBool(data.wholewords))
        if (!count) {
          notFoundAlert(api)
        }
        disableAll(api, count === 0)
        updateButtonStates(api)
        last$$1 = {
          text: data.findtext,
          caseState: data.matchcase,
          wholeWord: data.wholewords,
        }
      }
      const initialData = {
        findtext: selectedText,
        replacetext: '',
        matchcase: 'unchecked',
        wholewords: 'unchecked',
      }
      editor.windowManager.open({
        title: 'Find and Replace',
        size: 'normal',
        body: {
          type: 'panel',
          items: [
            {
              type: 'input',
              name: 'findtext',
              label: 'Find',
            },
            {
              type: 'input',
              name: 'replacetext',
              label: 'Replace with',
            },
            {
              type: 'grid',
              columns: 2,
              items: [
                {
                  type: 'checkbox',
                  name: 'matchcase',
                  label: 'Match case',
                },
                {
                  type: 'checkbox',
                  name: 'wholewords',
                  label: 'Find whole words only',
                },
              ],
            },
          ],
        },
        buttons: [
          {
            type: 'custom',
            name: 'find',
            text: 'Find',
            align: 'start',
            primary: true,
          },
          {
            type: 'custom',
            name: 'replace',
            text: 'Replace',
            align: 'start',
            disabled: true,
          },
          {
            type: 'custom',
            name: 'replaceall',
            text: 'Replace All',
            align: 'start',
            disabled: true,
          },
          {
            type: 'custom',
            name: 'prev',
            text: 'Previous',
            align: 'end',
            icon: 'arrow-left',
            disabled: true,
          },
          {
            type: 'custom',
            name: 'next',
            text: 'Next',
            align: 'end',
            icon: 'arrow-right',
            disabled: true,
          },
        ],
        initialData,
        onAction(api, details) {
          const data = api.getData()
          switch (details.name) {
            case 'find':
              doSubmit(api)
              break
            case 'replace':
              if (!Actions.replace(editor, currentIndexState, data.replacetext)) {
                disableAll(api, true)
                currentIndexState.set(-1)
                last$$1 = {}
              }
              break
            case 'replaceall':
              Actions.replace(editor, currentIndexState, data.replacetext, true, true)
              disableAll(api, true)
              last$$1 = {}
              break
            case 'prev':
              Actions.prev(editor, currentIndexState)
              updateButtonStates(api)
              break
            case 'next':
              Actions.next(editor, currentIndexState)
              updateButtonStates(api)
              break
            default:
              break
          }
        },
        onSubmit: doSubmit,
        onClose() {
          editor.focus()
          Actions.done(editor, currentIndexState)
          editor.undoManager.add()
        },
      })
    }
    var checkToBool = function (value) {
      return value === 'checked'
    }
    const Dialog = { open }

    const register = function (editor, currentIndexState) {
      editor.addCommand('SearchReplace', () => {
        Dialog.open(editor, currentIndexState)
      })
    }
    const Commands = { register }

    const showDialog = function (editor, currentIndexState) {
      return function () {
        Dialog.open(editor, currentIndexState)
      }
    }
    const register$1 = function (editor, currentIndexState) {
      editor.ui.registry.addMenuItem('searchreplace', {
        text: 'Find and replace...',
        shortcut: 'Meta+F',
        onAction: showDialog(editor, currentIndexState),
        icon: 'search',
      })
      editor.ui.registry.addButton('searchreplace', {
        tooltip: 'Find and replace',
        onAction: showDialog(editor, currentIndexState),
        icon: 'search',
      })
      editor.shortcuts.add('Meta+F', '', showDialog(editor, currentIndexState))
    }
    const Buttons = { register: register$1 }

    global.add('searchreplace', (editor) => {
      const currentIndexState = Cell(-1)
      Commands.register(editor, currentIndexState)
      Buttons.register(editor, currentIndexState)
      return Api.get(editor, currentIndexState)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
