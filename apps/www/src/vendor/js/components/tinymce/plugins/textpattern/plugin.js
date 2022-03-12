(function () {
  const textpattern = (function () {
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

    const filter = function (xs, pred) {
      const r = []
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i]
        if (pred(x, i, xs)) {
          r.push(x)
        }
      }
      return r
    }
    const { slice } = Array.prototype
    const sort = function (xs, comparator) {
      const copy = slice.call(xs, 0)
      copy.sort(comparator)
      return copy
    }
    const from$1 = isFunction(Array.from) ? Array.from : function (x) {
      return slice.call(x)
    }

    const { hasOwnProperty } = Object
    const get = function (obj, key) {
      return has(obj, key) ? Option.some(obj[key]) : Option.none()
    }
    var has = function (obj, key) {
      return hasOwnProperty.call(obj, key)
    }

    const isInlinePattern = function (pattern) {
      return has(pattern, 'start') && has(pattern, 'end')
    }
    const isBlockPattern = function (pattern) {
      return !has(pattern, 'end') && !has(pattern, 'replacement')
    }
    const isReplacementPattern = function (pattern) {
      return has(pattern, 'replacement')
    }
    const sortPatterns = function (patterns) {
      return sort(patterns, (a, b) => {
        if (a.start.length === b.start.length) {
          return 0
        }
        return a.start.length > b.start.length ? -1 : 1
      })
    }
    const createPatternSet = function (patterns) {
      return {
        inlinePatterns: sortPatterns(filter(patterns, isInlinePattern)),
        blockPatterns: sortPatterns(filter(patterns, isBlockPattern)),
        replacementPatterns: filter(patterns, isReplacementPattern),
      }
    }

    const get$1 = function (patternsState) {
      const setPatterns = function (newPatterns) {
        patternsState.set(createPatternSet(newPatterns))
      }
      const getPatterns = function () {
        return patternsState.get().inlinePatterns.concat(patternsState.get().blockPatterns, patternsState.get().replacementPatterns)
      }
      return {
        setPatterns,
        getPatterns,
      }
    }
    const Api = { get: get$1 }

    const defaultPatterns = [
      {
        start: '*',
        end: '*',
        format: 'italic',
      },
      {
        start: '**',
        end: '**',
        format: 'bold',
      },
      {
        start: '***',
        end: '***',
        format: [
          'bold',
          'italic',
        ],
      },
      {
        start: '#',
        format: 'h1',
      },
      {
        start: '##',
        format: 'h2',
      },
      {
        start: '###',
        format: 'h3',
      },
      {
        start: '####',
        format: 'h4',
      },
      {
        start: '#####',
        format: 'h5',
      },
      {
        start: '######',
        format: 'h6',
      },
      {
        start: '1. ',
        cmd: 'InsertOrderedList',
      },
      {
        start: '* ',
        cmd: 'InsertUnorderedList',
      },
      {
        start: '- ',
        cmd: 'InsertUnorderedList',
      },
    ]
    const getPatternSet = function (editorSettings) {
      const patterns = get(editorSettings, 'textpattern_patterns').getOr(defaultPatterns)
      return createPatternSet(patterns)
    }

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.Delay')

    const global$2 = tinymce.util.Tools.resolve('tinymce.util.VK')

    const global$3 = tinymce.util.Tools.resolve('tinymce.dom.TreeWalker')

    const global$4 = tinymce.util.Tools.resolve('tinymce.util.Tools')

    const findPattern = function (patterns, text) {
      for (let i = 0; i < patterns.length; i++) {
        const pattern = patterns[i]
        if (text.indexOf(pattern.start) !== 0) {
          continue
        }
        if (pattern.end && text.lastIndexOf(pattern.end) !== text.length - pattern.end.length) {
          continue
        }
        return pattern
      }
    }
    const isMatchingPattern = function (pattern, text, offset, delta) {
      const textEnd = text.substr(offset - pattern.end.length - delta, pattern.end.length)
      return textEnd === pattern.end
    }
    const hasContent = function (offset, delta, pattern) {
      return offset - delta - pattern.end.length - pattern.start.length > 0
    }
    const findEndPattern = function (patterns, text, offset, delta) {
      let pattern, i
      for (i = 0; i < patterns.length; i++) {
        pattern = patterns[i]
        if (pattern.end !== undefined && isMatchingPattern(pattern, text, offset, delta) && hasContent(offset, delta, pattern)) {
          return pattern
        }
      }
    }
    const findInlinePattern = function (patterns, rng, space) {
      if (rng.collapsed === false) {
        return
      }
      const container = rng.startContainer
      const text = container.data
      const delta = space === true ? 1 : 0
      if (container.nodeType !== 3) {
        return
      }
      const endPattern = findEndPattern(patterns, text, rng.startOffset, delta)
      if (endPattern === undefined) {
        return
      }
      let endOffset = text.lastIndexOf(endPattern.end, rng.startOffset - delta)
      const startOffset = text.lastIndexOf(endPattern.start, endOffset - endPattern.end.length)
      endOffset = text.indexOf(endPattern.end, startOffset + endPattern.start.length)
      if (startOffset === -1) {
        return
      }
      const patternRng = document.createRange()
      patternRng.setStart(container, startOffset)
      patternRng.setEnd(container, endOffset + endPattern.end.length)
      const startPattern = findPattern(patterns, patternRng.toString())
      if (endPattern === undefined || startPattern !== endPattern || container.data.length <= endPattern.start.length + endPattern.end.length) {
        return
      }
      return {
        pattern: endPattern,
        startOffset,
        endOffset,
      }
    }
    const findReplacementPattern = function (patterns, startSearch, text) {
      for (let i = 0; i < patterns.length; i++) {
        const index = text.lastIndexOf(patterns[i].start, startSearch)
        if (index !== -1) {
          return Option.some({
            pattern: patterns[i],
            startOffset: index,
          })
        }
      }
      return Option.none()
    }

    const isText = function (node) {
      return node && node.nodeType === 3
    }
    const setSelection = function (editor, textNode, offset) {
      const newRng = editor.dom.createRng()
      newRng.setStart(textNode, offset)
      newRng.setEnd(textNode, offset)
      editor.selection.setRng(newRng)
    }
    const splitContainer = function (container, pattern, endOffset, startOffset) {
      container = startOffset > 0 ? container.splitText(startOffset) : container
      container.splitText(endOffset - startOffset + pattern.end.length)
      container.deleteData(0, pattern.start.length)
      container.deleteData(container.data.length - pattern.end.length, pattern.end.length)
      return container
    }
    const splitAndApply = function (editor, container, found, inline) {
      const formatArray = global$4.isArray(found.pattern.format) ? found.pattern.format : [found.pattern.format]
      const validFormats = global$4.grep(formatArray, (formatName) => {
        const format = editor.formatter.get(formatName)
        return format && format[0].inline
      })
      if (validFormats.length !== 0) {
        editor.undoManager.transact(() => {
          container = splitContainer(container, found.pattern, found.endOffset, found.startOffset)
          if (inline) {
            editor.selection.setCursorLocation(container.nextSibling, 1)
          }
          formatArray.forEach((format) => {
            editor.formatter.apply(format, {}, container)
          })
        })
        return container
      }
    }
    const applyInlinePattern = function (editor, patterns, inline) {
      const rng = editor.selection.getRng()
      return Option.from(findInlinePattern(patterns, rng, inline)).map((foundPattern) => splitAndApply(editor, rng.startContainer, foundPattern, inline))
    }
    const applyInlinePatternSpace = function (editor, patterns) {
      applyInlinePattern(editor, patterns, true).each((wrappedTextNode) => {
        const lastChar = wrappedTextNode.data.slice(-1)
        if (/[\u00a0 ]/.test(lastChar)) {
          wrappedTextNode.deleteData(wrappedTextNode.data.length - 1, 1)
          const lastCharNode = editor.dom.doc.createTextNode(lastChar)
          editor.dom.insertAfter(lastCharNode, wrappedTextNode.parentNode)
          setSelection(editor, lastCharNode, 1)
        }
      })
    }
    const applyInlinePatternEnter = function (editor, patterns) {
      applyInlinePattern(editor, patterns, false).each((wrappedTextNode) => {
        setSelection(editor, wrappedTextNode, wrappedTextNode.data.length)
      })
    }
    const applyBlockPattern = function (editor, patterns) {
      let selection, dom, container, firstTextNode, node, format, textBlockElm, pattern, walker, rng, offset
      selection = editor.selection
      dom = editor.dom
      if (!selection.isCollapsed()) {
        return
      }
      textBlockElm = dom.getParent(selection.getStart(), 'p')
      if (textBlockElm) {
        walker = new global$3(textBlockElm, textBlockElm)
        while (node = walker.next()) {
          if (isText(node)) {
            firstTextNode = node
            break
          }
        }
        if (firstTextNode) {
          pattern = findPattern(patterns, firstTextNode.data)
          if (!pattern) {
            return
          }
          rng = selection.getRng(true)
          container = rng.startContainer
          offset = rng.startOffset
          if (firstTextNode === container) {
            offset = Math.max(0, offset - pattern.start.length)
          }
          if (global$4.trim(firstTextNode.data).length === pattern.start.length) {
            return
          }
          if (pattern.format) {
            format = editor.formatter.get(pattern.format)
            if (format && format[0].block) {
              firstTextNode.deleteData(0, pattern.start.length)
              editor.formatter.apply(pattern.format, {}, firstTextNode)
              rng.setStart(container, offset)
              rng.collapse(true)
              selection.setRng(rng)
            }
          }
          if (pattern.cmd) {
            editor.undoManager.transact(() => {
              firstTextNode.deleteData(0, pattern.start.length)
              editor.execCommand(pattern.cmd)
            })
          }
        }
      }
    }
    const selectionInsertText = function (editor, string) {
      const rng = editor.selection.getRng()
      const container = rng.startContainer
      if (isText(container)) {
        const offset = rng.startOffset
        container.insertData(offset, string)
        setSelection(editor, container, offset + string.length)
      } else {
        const newNode = editor.dom.doc.createTextNode(string)
        rng.insertNode(newNode)
        setSelection(editor, newNode, newNode.length)
      }
    }
    const applyReplacement = function (editor, target, match) {
      target.deleteData(match.startOffset, match.pattern.start.length)
      editor.insertContent(match.pattern.replacement)
      Option.from(target.nextSibling).filter(isText).each((nextSibling) => {
        nextSibling.insertData(0, target.data)
        editor.dom.remove(target)
      })
    }
    const extractChar = function (node, match) {
      const offset = match.startOffset + match.pattern.start.length
      const char = node.data.slice(offset, offset + 1)
      node.deleteData(offset, 1)
      return char
    }
    const applyReplacementPattern = function (editor, patterns, inline) {
      const rng = editor.selection.getRng()
      const container = rng.startContainer
      if (rng.collapsed && isText(container)) {
        findReplacementPattern(patterns, rng.startOffset, container.data).each((match) => {
          const char = inline ? Option.some(extractChar(container, match)) : Option.none()
          applyReplacement(editor, container, match)
          char.each((ch) => selectionInsertText(editor, ch))
        })
      }
    }
    const applyReplacementPatternSpace = function (editor, patterns) {
      applyReplacementPattern(editor, patterns, true)
    }
    const applyReplacementPatternEnter = function (editor, patterns) {
      applyReplacementPattern(editor, patterns, false)
    }

    const handleEnter = function (editor, patternSet) {
      applyReplacementPatternEnter(editor, patternSet.replacementPatterns)
      applyInlinePatternEnter(editor, patternSet.inlinePatterns)
      applyBlockPattern(editor, patternSet.blockPatterns)
    }
    const handleInlineKey = function (editor, patternSet) {
      applyReplacementPatternSpace(editor, patternSet.replacementPatterns)
      applyInlinePatternSpace(editor, patternSet.inlinePatterns)
    }
    const checkKeyEvent = function (codes, event, predicate) {
      for (let i = 0; i < codes.length; i++) {
        if (predicate(codes[i], event)) {
          return true
        }
      }
    }
    const checkKeyCode = function (codes, event) {
      return checkKeyEvent(codes, event, (code, event) => code === event.keyCode && global$2.modifierPressed(event) === false)
    }
    const checkCharCode = function (chars, event) {
      return checkKeyEvent(chars, event, (chr, event) => chr.charCodeAt(0) === event.charCode)
    }
    const KeyHandler = {
      handleEnter,
      handleInlineKey,
      checkCharCode,
      checkKeyCode,
    }

    const setup = function (editor, patternsState) {
      const charCodes = [
        ',',
        '.',
        ';',
        ':',
        '!',
        '?',
      ]
      const keyCodes = [32]
      editor.on('keydown', (e) => {
        if (e.keyCode === 13 && !global$2.modifierPressed(e)) {
          KeyHandler.handleEnter(editor, patternsState.get())
        }
      }, true)
      editor.on('keyup', (e) => {
        if (KeyHandler.checkKeyCode(keyCodes, e)) {
          KeyHandler.handleInlineKey(editor, patternsState.get())
        }
      })
      editor.on('keypress', (e) => {
        if (KeyHandler.checkCharCode(charCodes, e)) {
          global$1.setEditorTimeout(editor, () => {
            KeyHandler.handleInlineKey(editor, patternsState.get())
          })
        }
      })
    }
    const Keyboard = { setup }

    global.add('textpattern', (editor) => {
      const patternsState = Cell(getPatternSet(editor.settings))
      Keyboard.setup(editor, patternsState)
      return Api.get(patternsState)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
