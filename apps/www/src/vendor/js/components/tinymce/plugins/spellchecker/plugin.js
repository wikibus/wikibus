(function () {
  const spellchecker = (function () {
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

    const hasProPlugin = function (editor) {
      if (/(^|[ ,])tinymcespellchecker([, ]|$)/.test(editor.settings.plugins) && global.get('tinymcespellchecker')) {
        if (typeof window.console !== 'undefined' && window.console.log) {
          window.console.log('Spell Checker Pro is incompatible with Spell Checker plugin! ' + 'Remove \'spellchecker\' from the \'plugins\' option.')
        }
        return true
      }
      return false
    }
    const DetectProPlugin = { hasProPlugin }

    const getLanguages = function (editor) {
      const defaultLanguages = 'English=en,Danish=da,Dutch=nl,Finnish=fi,French=fr_FR,German=de,Italian=it,Polish=pl,Portuguese=pt_BR,Spanish=es,Swedish=sv'
      return editor.getParam('spellchecker_languages', defaultLanguages)
    }
    const getLanguage = function (editor) {
      const defaultLanguage = editor.getParam('language', 'en')
      return editor.getParam('spellchecker_language', defaultLanguage)
    }
    const getRpcUrl = function (editor) {
      return editor.getParam('spellchecker_rpc_url')
    }
    const getSpellcheckerCallback = function (editor) {
      return editor.getParam('spellchecker_callback')
    }
    const getSpellcheckerWordcharPattern = function (editor) {
      const defaultPattern = new RegExp('[^' + '\\s!"#$%&()*+,-./:;<=>?@[\\]^_{|}`' + '\xA7\xA9\xAB\xAE\xB1\xB6\xB7\xB8\xBB' + '\xBC\xBD\xBE\xBF\xD7\xF7\xA4\u201D\u201C\u201E\xA0\u2002\u2003\u2009' + ']+', 'g')
      return editor.getParam('spellchecker_wordchar_pattern', defaultPattern)
    }
    const Settings = {
      getLanguages,
      getLanguage,
      getRpcUrl,
      getSpellcheckerCallback,
      getSpellcheckerWordcharPattern,
    }

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools')

    const global$2 = tinymce.util.Tools.resolve('tinymce.util.URI')

    const global$3 = tinymce.util.Tools.resolve('tinymce.util.XHR')

    const fireSpellcheckStart = function (editor) {
      return editor.fire('SpellcheckStart')
    }
    const fireSpellcheckEnd = function (editor) {
      return editor.fire('SpellcheckEnd')
    }
    const Events = {
      fireSpellcheckStart,
      fireSpellcheckEnd,
    }

    function isContentEditableFalse(node) {
      return node && node.nodeType === 1 && node.contentEditable === 'false'
    }
    const DomTextMatcher = function (node, editor) {
      let m; let matches = []; let text
      const { dom } = editor
      let blockElementsMap, hiddenTextElementsMap, shortEndedElementsMap
      blockElementsMap = editor.schema.getBlockElements()
      hiddenTextElementsMap = editor.schema.getWhiteSpaceElements()
      shortEndedElementsMap = editor.schema.getShortEndedElements()
      function createMatch(m, data) {
        if (!m[0]) {
          throw new Error('findAndReplaceDOMText cannot handle zero-length matches')
        }
        return {
          start: m.index,
          end: m.index + m[0].length,
          text: m[0],
          data,
        }
      }
      function getText(node) {
        let txt
        if (node.nodeType === 3) {
          return node.data
        }
        if (hiddenTextElementsMap[node.nodeName] && !blockElementsMap[node.nodeName]) {
          return ''
        }
        if (isContentEditableFalse(node)) {
          return '\n'
        }
        txt = ''
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
        let startNode; let endNode; let startNodeIndex; let endNodeIndex; let innerNodes = []; let atIndex = 0; let curNode = node; let matchLocation; let matchIndex = 0
        matches = matches.slice(0)
        matches.sort((a, b) => a.start - b.start)
        matchLocation = matches.shift()
        out:
        while (true) {
          if (blockElementsMap[curNode.nodeName] || shortEndedElementsMap[curNode.nodeName] || isContentEditableFalse(curNode)) {
            atIndex++
          }
          if (curNode.nodeType === 3) {
            if (!endNode && curNode.length + atIndex >= matchLocation.end) {
              endNode = curNode
              endNodeIndex = matchLocation.end - atIndex
            } else if (startNode) {
              innerNodes.push(curNode)
            }
            if (!startNode && curNode.length + atIndex > matchLocation.start) {
              startNode = curNode
              startNodeIndex = matchLocation.start - atIndex
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
              match: matchLocation.text,
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
      function genReplacer(callback) {
        function makeReplacementNode(fill, matchIndex) {
          const match = matches[matchIndex]
          if (!match.stencil) {
            match.stencil = callback(match)
          }
          const clone = match.stencil.cloneNode(false)
          clone.setAttribute('data-mce-index', matchIndex)
          if (fill) {
            clone.appendChild(dom.doc.createTextNode(fill))
          }
          return clone
        }
        return function (range) {
          let before
          let after
          let parentNode
          const { startNode } = range
          const { endNode } = range
          const { matchIndex } = range
          const { doc } = dom
          if (startNode === endNode) {
            const node_1 = startNode
            parentNode = node_1.parentNode
            if (range.startNodeIndex > 0) {
              before = doc.createTextNode(node_1.data.substring(0, range.startNodeIndex))
              parentNode.insertBefore(before, node_1)
            }
            const el = makeReplacementNode(range.match, matchIndex)
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
      function unwrapElement(element) {
        const { parentNode } = element
        parentNode.insertBefore(element.firstChild, element)
        element.parentNode.removeChild(element)
      }
      function hasClass(elm) {
        return elm.className.indexOf('mce-spellchecker-word') !== -1
      }
      function getWrappersByIndex(index) {
        const elements = node.getElementsByTagName('*'); const wrappers = []
        index = typeof index === 'number' ? `${index}` : null
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i]; const dataIndex = element.getAttribute('data-mce-index')
          if (dataIndex !== null && dataIndex.length && hasClass(element)) {
            if (dataIndex === index || index === null) {
              wrappers.push(element)
            }
          }
        }
        return wrappers
      }
      function indexOf(match) {
        let i = matches.length
        while (i--) {
          if (matches[i] === match) {
            return i
          }
        }
        return -1
      }
      function filter(callback) {
        const filteredMatches = []
        each((match, i) => {
          if (callback(match, i)) {
            filteredMatches.push(match)
          }
        })
        matches = filteredMatches
        return this
      }
      function each(callback) {
        for (let i = 0, l = matches.length; i < l; i++) {
          if (callback(matches[i], i) === false) {
            break
          }
        }
        return this
      }
      function wrap(callback) {
        if (matches.length) {
          stepThroughMatches(node, matches, genReplacer(callback))
        }
        return this
      }
      function find(regex, data) {
        if (text && regex.global) {
          while (m = regex.exec(text)) {
            matches.push(createMatch(m, data))
          }
        }
        return this
      }
      function unwrap(match) {
        let i
        const elements = getWrappersByIndex(match ? indexOf(match) : null)
        i = elements.length
        while (i--) {
          unwrapElement(elements[i])
        }
        return this
      }
      function matchFromElement(element) {
        return matches[element.getAttribute('data-mce-index')]
      }
      function elementFromMatch(match) {
        return getWrappersByIndex(indexOf(match))[0]
      }
      function add(start, length, data) {
        matches.push({
          start,
          end: start + length,
          text: text.substr(start, length),
          data,
        })
        return this
      }
      function rangeFromMatch(match) {
        const wrappers = getWrappersByIndex(indexOf(match))
        const rng = editor.dom.createRng()
        rng.setStartBefore(wrappers[0])
        rng.setEndAfter(wrappers[wrappers.length - 1])
        return rng
      }
      function replace(match, text) {
        const rng = rangeFromMatch(match)
        rng.deleteContents()
        if (text.length > 0) {
          rng.insertNode(editor.dom.doc.createTextNode(text))
        }
        return rng
      }
      function reset() {
        matches.splice(0, matches.length)
        unwrap()
        return this
      }
      text = getText(node)
      return {
        text,
        matches,
        each,
        filter,
        reset,
        matchFromElement,
        elementFromMatch,
        find,
        add,
        wrap,
        unwrap,
        replace,
        rangeFromMatch,
        indexOf,
      }
    }

    const getTextMatcher = function (editor, textMatcherState) {
      if (!textMatcherState.get()) {
        const textMatcher = DomTextMatcher(editor.getBody(), editor)
        textMatcherState.set(textMatcher)
      }
      return textMatcherState.get()
    }
    const isEmpty = function (obj) {
      for (const _ in obj) {
        return false
      }
      return true
    }
    const defaultSpellcheckCallback = function (editor, pluginUrl, currentLanguageState) {
      return function (method, text, doneCallback, errorCallback) {
        const data = {
          method,
          lang: currentLanguageState.get(),
        }
        let postData = ''
        data[method === 'addToDictionary' ? 'word' : 'text'] = text
        global$1.each(data, (value, key) => {
          if (postData) {
            postData += '&'
          }
          postData += `${key}=${encodeURIComponent(value)}`
        })
        global$3.send({
          url: new global$2(pluginUrl).toAbsolute(Settings.getRpcUrl(editor)),
          type: 'post',
          content_type: 'application/x-www-form-urlencoded',
          data: postData,
          success(result) {
            result = JSON.parse(result)
            if (!result) {
              const message = editor.translate('Server response wasn\'t proper JSON.')
              errorCallback(message)
            } else if (result.error) {
              errorCallback(result.error)
            } else {
              doneCallback(result)
            }
          },
          error() {
            const message = editor.translate('The spelling service was not found: (') + Settings.getRpcUrl(editor) + editor.translate(')')
            errorCallback(message)
          },
        })
      }
    }
    const sendRpcCall = function (editor, pluginUrl, currentLanguageState, name, data, successCallback, errorCallback) {
      const userSpellcheckCallback = Settings.getSpellcheckerCallback(editor)
      const spellCheckCallback = userSpellcheckCallback || defaultSpellcheckCallback(editor, pluginUrl, currentLanguageState)
      spellCheckCallback.call(editor.plugins.spellchecker, name, data, successCallback, errorCallback)
    }
    const spellcheck = function (editor, pluginUrl, startedState, textMatcherState, lastSuggestionsState, currentLanguageState) {
      if (finish(editor, startedState, textMatcherState)) {
        return
      }
      const errorCallback = function (message) {
        editor.notificationManager.open({
          text: message,
          type: 'error',
        })
        editor.setProgressState(false)
        finish(editor, startedState, textMatcherState)
      }
      const successCallback = function (data) {
        markErrors(editor, startedState, textMatcherState, lastSuggestionsState, data)
      }
      editor.setProgressState(true)
      sendRpcCall(editor, pluginUrl, currentLanguageState, 'spellcheck', getTextMatcher(editor, textMatcherState).text, successCallback, errorCallback)
      editor.focus()
    }
    const checkIfFinished = function (editor, startedState, textMatcherState) {
      if (!editor.dom.select('span.mce-spellchecker-word').length) {
        finish(editor, startedState, textMatcherState)
      }
    }
    const addToDictionary = function (editor, pluginUrl, startedState, textMatcherState, currentLanguageState, word, spans) {
      editor.setProgressState(true)
      sendRpcCall(editor, pluginUrl, currentLanguageState, 'addToDictionary', word, () => {
        editor.setProgressState(false)
        editor.dom.remove(spans, true)
        checkIfFinished(editor, startedState, textMatcherState)
      }, (message) => {
        editor.notificationManager.open({
          text: message,
          type: 'error',
        })
        editor.setProgressState(false)
      })
    }
    const ignoreWord = function (editor, startedState, textMatcherState, word, spans, all) {
      editor.selection.collapse()
      if (all) {
        global$1.each(editor.dom.select('span.mce-spellchecker-word'), (span) => {
          if (span.getAttribute('data-mce-word') === word) {
            editor.dom.remove(span, true)
          }
        })
      } else {
        editor.dom.remove(spans, true)
      }
      checkIfFinished(editor, startedState, textMatcherState)
    }
    var finish = function (editor, startedState, textMatcherState) {
      const bookmark = editor.selection.getBookmark()
      getTextMatcher(editor, textMatcherState).reset()
      editor.selection.moveToBookmark(bookmark)
      textMatcherState.set(null)
      if (startedState.get()) {
        startedState.set(false)
        Events.fireSpellcheckEnd(editor)
        return true
      }
    }
    const getElmIndex = function (elm) {
      const value = elm.getAttribute('data-mce-index')
      if (typeof value === 'number') {
        return `${value}`
      }
      return value
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
    var markErrors = function (editor, startedState, textMatcherState, lastSuggestionsState, data) {
      const hasDictionarySupport = !!data.dictionary
      const suggestions = data.words
      editor.setProgressState(false)
      if (isEmpty(suggestions)) {
        const message = editor.translate('No misspellings found.')
        editor.notificationManager.open({
          text: message,
          type: 'info',
        })
        startedState.set(false)
        return
      }
      lastSuggestionsState.set({
        suggestions,
        hasDictionarySupport,
      })
      const bookmark = editor.selection.getBookmark()
      getTextMatcher(editor, textMatcherState).find(Settings.getSpellcheckerWordcharPattern(editor)).filter((match) => !!suggestions[match.text]).wrap((match) => editor.dom.create('span', {
        class: 'mce-spellchecker-word',
        'aria-invalid': 'spelling',
        'data-mce-bogus': 1,
        'data-mce-word': match.text,
      }))
      editor.selection.moveToBookmark(bookmark)
      startedState.set(true)
      Events.fireSpellcheckStart(editor)
    }
    const Actions = {
      spellcheck,
      checkIfFinished,
      addToDictionary,
      ignoreWord,
      findSpansByIndex,
      getElmIndex,
      markErrors,
    }

    const get = function (editor, startedState, lastSuggestionsState, textMatcherState, currentLanguageState, url) {
      const getLanguage = function () {
        return currentLanguageState.get()
      }
      const getWordCharPattern = function () {
        return Settings.getSpellcheckerWordcharPattern(editor)
      }
      const markErrors = function (data) {
        Actions.markErrors(editor, startedState, textMatcherState, lastSuggestionsState, data)
      }
      const getTextMatcher = function () {
        return textMatcherState.get()
      }
      return {
        getTextMatcher,
        getWordCharPattern,
        markErrors,
        getLanguage,
      }
    }
    const Api = { get }

    const register = function (editor, pluginUrl, startedState, textMatcherState, lastSuggestionsState, currentLanguageState) {
      editor.addCommand('mceSpellCheck', () => {
        Actions.spellcheck(editor, pluginUrl, startedState, textMatcherState, lastSuggestionsState, currentLanguageState)
      })
    }
    const Commands = { register }

    const { hasOwnProperty } = Object.prototype
    const shallow = function (old, nu) {
      return nu
    }
    const baseMerge = function (merger) {
      return function () {
        const objects = new Array(arguments.length)
        for (let i = 0; i < objects.length; i++) { objects[i] = arguments[i] }
        if (objects.length === 0) { throw new Error('Can\'t merge zero objects') }
        const ret = {}
        for (let j = 0; j < objects.length; j++) {
          const curObject = objects[j]
          for (const key in curObject) {
            if (hasOwnProperty.call(curObject, key)) {
              ret[key] = merger(ret[key], curObject[key])
            }
          }
        }
        return ret
      }
    }
    const merge = baseMerge(shallow)

    const spellcheckerEvents = 'SpellcheckStart SpellcheckEnd'
    const buildMenuItems = function (listName, languageValues) {
      const items = []
      global$1.each(languageValues, (languageValue) => {
        items.push({
          selectable: true,
          text: languageValue.name,
          data: languageValue.value,
        })
      })
      return items
    }
    const getItems = function (editor) {
      return global$1.map(Settings.getLanguages(editor).split(','), (langPair) => {
        langPair = langPair.split('=')
        return {
          name: langPair[0],
          value: langPair[1],
        }
      })
    }
    const register$1 = function (editor, pluginUrl, startedState, textMatcherState, currentLanguageState, lastSuggestionsState) {
      const languageMenuItems = buildMenuItems('Language', getItems(editor))
      const startSpellchecking = function () {
        Actions.spellcheck(editor, pluginUrl, startedState, textMatcherState, lastSuggestionsState, currentLanguageState)
      }
      const buttonArgs = {
        tooltip: 'Spellcheck',
        onAction: startSpellchecking,
        icon: 'spell-check',
        onSetup(buttonApi) {
          const setButtonState = function () {
            buttonApi.setActive(startedState.get())
          }
          editor.on(spellcheckerEvents, setButtonState)
          return function () {
            editor.off(spellcheckerEvents, setButtonState)
          }
        },
      }
      const getSplitButtonArgs = function () {
        return {
          type: 'splitbutton',
          menu: languageMenuItems,
          select(value) {
            return value === currentLanguageState.get()
          },
          fetch(callback) {
            const items = global$1.map(languageMenuItems, (languageItem) => ({
              type: 'choiceitem',
              value: languageItem.data,
              text: languageItem.text,
            }))
            callback(items)
          },
          onItemAction(splitButtonApi, value) {
            currentLanguageState.set(value)
          },
        }
      }
      editor.ui.registry.addButton('spellchecker', merge(buttonArgs, languageMenuItems.length > 1 ? getSplitButtonArgs() : { type: 'togglebutton' }))
      editor.ui.registry.addToggleMenuItem('spellchecker', {
        text: 'Spellcheck',
        onSetup(menuApi) {
          menuApi.setActive(startedState.get())
          const setMenuItemCheck = function () {
            menuApi.setActive(startedState.get())
          }
          editor.on(spellcheckerEvents, setMenuItemCheck)
          return function () {
            editor.off(spellcheckerEvents, setMenuItemCheck)
          }
        },
        onAction: startSpellchecking,
      })
    }
    const Buttons = { register: register$1 }

    const ignoreAll = true
    const getSuggestions = function (editor, pluginUrl, lastSuggestionsState, startedState, textMatcherState, currentLanguageState, word, spans) {
      const items = []; const suggestions = lastSuggestionsState.get().suggestions[word]
      global$1.each(suggestions, (suggestion) => {
        items.push({
          text: suggestion,
          onAction() {
            editor.insertContent(editor.dom.encode(suggestion))
            editor.dom.remove(spans)
            Actions.checkIfFinished(editor, startedState, textMatcherState)
          },
        })
      })
      const { hasDictionarySupport } = lastSuggestionsState.get()
      if (hasDictionarySupport) {
        items.push({
          text: 'Add to Dictionary',
          onAction() {
            Actions.addToDictionary(editor, pluginUrl, startedState, textMatcherState, currentLanguageState, word, spans)
          },
        })
      }
      items.push.apply(items, [
        {
          text: 'Ignore',
          onAction() {
            Actions.ignoreWord(editor, startedState, textMatcherState, word, spans)
          },
        },
        {
          text: 'Ignore all',
          onAction() {
            Actions.ignoreWord(editor, startedState, textMatcherState, word, spans, ignoreAll)
          },
        },
      ])
      return items
    }
    const setup = function (editor, pluginUrl, lastSuggestionsState, startedState, textMatcherState, currentLanguageState) {
      const update = function (element) {
        const target = element
        if (target.className === 'mce-spellchecker-word') {
          const spans = Actions.findSpansByIndex(editor, Actions.getElmIndex(target))
          if (spans.length > 0) {
            const rng = editor.dom.createRng()
            rng.setStartBefore(spans[0])
            rng.setEndAfter(spans[spans.length - 1])
            editor.selection.setRng(rng)
            return getSuggestions(editor, pluginUrl, lastSuggestionsState, startedState, textMatcherState, currentLanguageState, target.getAttribute('data-mce-word'), spans)
          }
        } else {
          return []
        }
      }
      editor.ui.registry.addContextMenu('spellchecker', { update })
    }
    const SuggestionsMenu = { setup }

    global.add('spellchecker', (editor, pluginUrl) => {
      if (DetectProPlugin.hasProPlugin(editor) === false) {
        const startedState = Cell(false)
        const currentLanguageState = Cell(Settings.getLanguage(editor))
        const textMatcherState = Cell(null)
        const lastSuggestionsState = Cell(null)
        Buttons.register(editor, pluginUrl, startedState, textMatcherState, currentLanguageState, lastSuggestionsState)
        SuggestionsMenu.setup(editor, pluginUrl, lastSuggestionsState, startedState, textMatcherState, currentLanguageState)
        Commands.register(editor, pluginUrl, startedState, textMatcherState, lastSuggestionsState, currentLanguageState)
        return Api.get(editor, startedState, lastSuggestionsState, textMatcherState, currentLanguageState, pluginUrl)
      }
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
