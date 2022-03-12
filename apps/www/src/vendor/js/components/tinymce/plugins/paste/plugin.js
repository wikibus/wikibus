(function () {
  const paste = (function () {
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
      if (/(^|[ ,])powerpaste([, ]|$)/.test(editor.settings.plugins) && global.get('powerpaste')) {
        if (typeof window.console !== 'undefined' && window.console.log) {
          window.console.log('PowerPaste is incompatible with Paste plugin! Remove \'paste\' from the \'plugins\' option.')
        }
        return true
      }
      return false
    }
    const DetectProPlugin = { hasProPlugin }

    const get = function (clipboard, quirks) {
      return {
        clipboard,
        quirks,
      }
    }
    const Api = { get }

    const firePastePreProcess = function (editor, html, internal, isWordHtml) {
      return editor.fire('PastePreProcess', {
        content: html,
        internal,
        wordContent: isWordHtml,
      })
    }
    const firePastePostProcess = function (editor, node, internal, isWordHtml) {
      return editor.fire('PastePostProcess', {
        node,
        internal,
        wordContent: isWordHtml,
      })
    }
    const firePastePlainTextToggle = function (editor, state) {
      return editor.fire('PastePlainTextToggle', { state })
    }
    const firePaste = function (editor, ieFake) {
      return editor.fire('paste', { ieFake })
    }
    const Events = {
      firePastePreProcess,
      firePastePostProcess,
      firePastePlainTextToggle,
      firePaste,
    }

    const shouldPlainTextInform = function (editor) {
      return editor.getParam('paste_plaintext_inform', true)
    }
    const shouldBlockDrop = function (editor) {
      return editor.getParam('paste_block_drop', false)
    }
    const shouldPasteDataImages = function (editor) {
      return editor.getParam('paste_data_images', false)
    }
    const shouldFilterDrop = function (editor) {
      return editor.getParam('paste_filter_drop', true)
    }
    const getPreProcess = function (editor) {
      return editor.getParam('paste_preprocess')
    }
    const getPostProcess = function (editor) {
      return editor.getParam('paste_postprocess')
    }
    const getWebkitStyles = function (editor) {
      return editor.getParam('paste_webkit_styles')
    }
    const shouldRemoveWebKitStyles = function (editor) {
      return editor.getParam('paste_remove_styles_if_webkit', true)
    }
    const shouldMergeFormats = function (editor) {
      return editor.getParam('paste_merge_formats', true)
    }
    const isSmartPasteEnabled = function (editor) {
      return editor.getParam('smart_paste', true)
    }
    const isPasteAsTextEnabled = function (editor) {
      return editor.getParam('paste_as_text', false)
    }
    const getRetainStyleProps = function (editor) {
      return editor.getParam('paste_retain_style_properties')
    }
    const getWordValidElements = function (editor) {
      const defaultValidElements = '-strong/b,-em/i,-u,-span,-p,-ol,-ul,-li,-h1,-h2,-h3,-h4,-h5,-h6,' + '-p/div,-a[href|name],sub,sup,strike,br,del,table[width],tr,' + 'td[colspan|rowspan|width],th[colspan|rowspan|width],thead,tfoot,tbody'
      return editor.getParam('paste_word_valid_elements', defaultValidElements)
    }
    const shouldConvertWordFakeLists = function (editor) {
      return editor.getParam('paste_convert_word_fake_lists', true)
    }
    const shouldUseDefaultFilters = function (editor) {
      return editor.getParam('paste_enable_default_filters', true)
    }
    const Settings = {
      shouldPlainTextInform,
      shouldBlockDrop,
      shouldPasteDataImages,
      shouldFilterDrop,
      getPreProcess,
      getPostProcess,
      getWebkitStyles,
      shouldRemoveWebKitStyles,
      shouldMergeFormats,
      isSmartPasteEnabled,
      isPasteAsTextEnabled,
      getRetainStyleProps,
      getWordValidElements,
      shouldConvertWordFakeLists,
      shouldUseDefaultFilters,
    }

    const shouldInformUserAboutPlainText = function (editor, userIsInformedState) {
      return userIsInformedState.get() === false && Settings.shouldPlainTextInform(editor)
    }
    const displayNotification = function (editor, message) {
      editor.notificationManager.open({
        text: message,
        type: 'info',
      })
    }
    const togglePlainTextPaste = function (editor, clipboard, userIsInformedState) {
      if (clipboard.pasteFormat.get() === 'text') {
        clipboard.pasteFormat.set('html')
        Events.firePastePlainTextToggle(editor, false)
      } else {
        clipboard.pasteFormat.set('text')
        Events.firePastePlainTextToggle(editor, true)
        if (shouldInformUserAboutPlainText(editor, userIsInformedState)) {
          displayNotification(editor, 'Paste is now in plain text mode. Contents will now be pasted as plain text until you toggle this option off.')
          userIsInformedState.set(true)
        }
      }
      editor.focus()
    }
    const Actions = { togglePlainTextPaste }

    const register = function (editor, clipboard, userIsInformedState) {
      editor.addCommand('mceTogglePlainTextPaste', () => {
        Actions.togglePlainTextPaste(editor, clipboard, userIsInformedState)
      })
      editor.addCommand('mceInsertClipboardContent', (ui, value) => {
        if (value.content) {
          clipboard.pasteHtml(value.content, value.internal)
        }
        if (value.text) {
          clipboard.pasteText(value.text)
        }
      })
    }
    const Commands = { register }

    const global$1 = tinymce.util.Tools.resolve('tinymce.Env')

    const global$2 = tinymce.util.Tools.resolve('tinymce.util.Delay')

    const global$3 = tinymce.util.Tools.resolve('tinymce.util.Tools')

    const global$4 = tinymce.util.Tools.resolve('tinymce.util.VK')

    const internalMimeType = 'x-tinymce/html'
    const internalMark = `<!-- ${internalMimeType} -->`
    const mark = function (html) {
      return internalMark + html
    }
    const unmark = function (html) {
      return html.replace(internalMark, '')
    }
    const isMarked = function (html) {
      return html.indexOf(internalMark) !== -1
    }
    const InternalHtml = {
      mark,
      unmark,
      isMarked,
      internalHtmlMime() {
        return internalMimeType
      },
    }

    const global$5 = tinymce.util.Tools.resolve('tinymce.html.Entities')

    const isPlainText = function (text) {
      return !/<(?:\/?(?!(?:div|p|br|span)>)\w+|(?:(?!(?:span style="white-space:\s?pre;?">)|br\s?\/>))\w+\s[^>]+)>/i.test(text)
    }
    const toBRs = function (text) {
      return text.replace(/\r?\n/g, '<br>')
    }
    const openContainer = function (rootTag, rootAttrs) {
      let key
      const attrs = []
      let tag = `<${rootTag}`
      if (typeof rootAttrs === 'object') {
        for (key in rootAttrs) {
          if (rootAttrs.hasOwnProperty(key)) {
            attrs.push(`${key}="${global$5.encodeAllRaw(rootAttrs[key])}"`)
          }
        }
        if (attrs.length) {
          tag += ` ${attrs.join(' ')}`
        }
      }
      return `${tag}>`
    }
    const toBlockElements = function (text, rootTag, rootAttrs) {
      const blocks = text.split(/\n\n/)
      const tagOpen = openContainer(rootTag, rootAttrs)
      const tagClose = `</${rootTag}>`
      const paragraphs = global$3.map(blocks, (p) => p.split(/\n/).join('<br />'))
      const stitch = function (p) {
        return tagOpen + p + tagClose
      }
      return paragraphs.length === 1 ? paragraphs[0] : global$3.map(paragraphs, stitch).join('')
    }
    const convert = function (text, rootTag, rootAttrs) {
      return rootTag ? toBlockElements(text, rootTag, rootAttrs) : toBRs(text)
    }
    const Newlines = {
      isPlainText,
      convert,
      toBRs,
      toBlockElements,
    }

    const global$6 = tinymce.util.Tools.resolve('tinymce.html.DomParser')

    const global$7 = tinymce.util.Tools.resolve('tinymce.html.Node')

    const global$8 = tinymce.util.Tools.resolve('tinymce.html.Schema')

    const global$9 = tinymce.util.Tools.resolve('tinymce.html.Serializer')

    function filter(content, items) {
      global$3.each(items, (v) => {
        if (v.constructor === RegExp) {
          content = content.replace(v, '')
        } else {
          content = content.replace(v[0], v[1])
        }
      })
      return content
    }
    function innerText(html) {
      const schema = global$8()
      const domParser = global$6({}, schema)
      let text = ''
      const shortEndedElements = schema.getShortEndedElements()
      const ignoreElements = global$3.makeMap('script noscript style textarea video audio iframe object', ' ')
      const blockElements = schema.getBlockElements()
      function walk(node) {
        const name$$1 = node.name; const currentNode = node
        if (name$$1 === 'br') {
          text += '\n'
          return
        }
        if (name$$1 === 'wbr') {
          return
        }
        if (shortEndedElements[name$$1]) {
          text += ' '
        }
        if (ignoreElements[name$$1]) {
          text += ' '
          return
        }
        if (node.type === 3) {
          text += node.value
        }
        if (!node.shortEnded) {
          if (node = node.firstChild) {
            do {
              walk(node)
            } while (node = node.next)
          }
        }
        if (blockElements[name$$1] && currentNode.next) {
          text += '\n'
          if (name$$1 === 'p') {
            text += '\n'
          }
        }
      }
      html = filter(html, [/<!\[[^\]]+\]>/g])
      walk(domParser.parse(html))
      return text
    }
    function trimHtml(html) {
      function trimSpaces(all, s1, s2) {
        if (!s1 && !s2) {
          return ' '
        }
        return '\xA0'
      }
      html = filter(html, [
        /^[\s\S]*<body[^>]*>\s*|\s*<\/body[^>]*>[\s\S]*$/ig,
        /<!--StartFragment-->|<!--EndFragment-->/g,
        [
          /( ?)<span class="Apple-converted-space">\u00a0<\/span>( ?)/g,
          trimSpaces,
        ],
        /<br class="Apple-interchange-newline">/g,
        /<br>$/i,
      ])
      return html
    }
    function createIdGenerator(prefix) {
      let count = 0
      return function () {
        return prefix + count++
      }
    }
    const isMsEdge = function () {
      return navigator.userAgent.indexOf(' Edge/') !== -1
    }
    const Utils = {
      filter,
      innerText,
      trimHtml,
      createIdGenerator,
      isMsEdge,
    }

    function isWordContent(content) {
      return /<font face="Times New Roman"|class="?Mso|style="[^"]*\bmso-|style='[^'']*\bmso-|w:WordDocument/i.test(content) || /class="OutlineElement/.test(content) || /id="?docs\-internal\-guid\-/.test(content)
    }
    function isNumericList(text) {
      let found, patterns
      patterns = [
        /^[IVXLMCD]{1,2}\.[ \u00a0]/,
        /^[ivxlmcd]{1,2}\.[ \u00a0]/,
        /^[a-z]{1,2}[\.\)][ \u00a0]/,
        /^[A-Z]{1,2}[\.\)][ \u00a0]/,
        /^[0-9]+\.[ \u00a0]/,
        /^[\u3007\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d]+\.[ \u00a0]/,
        /^[\u58f1\u5f10\u53c2\u56db\u4f0d\u516d\u4e03\u516b\u4e5d\u62fe]+\.[ \u00a0]/,
      ]
      text = text.replace(/^[\u00a0 ]+/, '')
      global$3.each(patterns, (pattern) => {
        if (pattern.test(text)) {
          found = true
          return false
        }
      })
      return found
    }
    function isBulletList(text) {
      return /^[\s\u00a0]*[\u2022\u00b7\u00a7\u25CF]\s*/.test(text)
    }
    function convertFakeListsToProperLists(node) {
      let currentListNode; let prevListNode; let lastLevel = 1
      function getText(node) {
        let txt = ''
        if (node.type === 3) {
          return node.value
        }
        if (node = node.firstChild) {
          do {
            txt += getText(node)
          } while (node = node.next)
        }
        return txt
      }
      function trimListStart(node, regExp) {
        if (node.type === 3) {
          if (regExp.test(node.value)) {
            node.value = node.value.replace(regExp, '')
            return false
          }
        }
        if (node = node.firstChild) {
          do {
            if (!trimListStart(node, regExp)) {
              return false
            }
          } while (node = node.next)
        }
        return true
      }
      function removeIgnoredNodes(node) {
        if (node._listIgnore) {
          node.remove()
          return
        }
        if (node = node.firstChild) {
          do {
            removeIgnoredNodes(node)
          } while (node = node.next)
        }
      }
      function convertParagraphToLi(paragraphNode, listName, start) {
        const level = paragraphNode._listLevel || lastLevel
        if (level !== lastLevel) {
          if (level < lastLevel) {
            if (currentListNode) {
              currentListNode = currentListNode.parent.parent
            }
          } else {
            prevListNode = currentListNode
            currentListNode = null
          }
        }
        if (!currentListNode || currentListNode.name !== listName) {
          prevListNode = prevListNode || currentListNode
          currentListNode = new global$7(listName, 1)
          if (start > 1) {
            currentListNode.attr('start', `${start}`)
          }
          paragraphNode.wrap(currentListNode)
        } else {
          currentListNode.append(paragraphNode)
        }
        paragraphNode.name = 'li'
        if (level > lastLevel && prevListNode) {
          prevListNode.lastChild.append(currentListNode)
        }
        lastLevel = level
        removeIgnoredNodes(paragraphNode)
        trimListStart(paragraphNode, /^\u00a0+/)
        trimListStart(paragraphNode, /^\s*([\u2022\u00b7\u00a7\u25CF]|\w+\.)/)
        trimListStart(paragraphNode, /^\u00a0+/)
      }
      const elements = []
      let child = node.firstChild
      while (typeof child !== 'undefined' && child !== null) {
        elements.push(child)
        child = child.walk()
        if (child !== null) {
          while (typeof child !== 'undefined' && child.parent !== node) {
            child = child.walk()
          }
        }
      }
      for (let i = 0; i < elements.length; i++) {
        node = elements[i]
        if (node.name === 'p' && node.firstChild) {
          const nodeText = getText(node)
          if (isBulletList(nodeText)) {
            convertParagraphToLi(node, 'ul')
            continue
          }
          if (isNumericList(nodeText)) {
            const matches = /([0-9]+)\./.exec(nodeText)
            let start = 1
            if (matches) {
              start = parseInt(matches[1], 10)
            }
            convertParagraphToLi(node, 'ol', start)
            continue
          }
          if (node._listLevel) {
            convertParagraphToLi(node, 'ul', 1)
            continue
          }
          currentListNode = null
        } else {
          prevListNode = currentListNode
          currentListNode = null
        }
      }
    }
    function filterStyles(editor, validStyles, node, styleValue) {
      let outputStyles = {}; let matches
      const styles = editor.dom.parseStyle(styleValue)
      global$3.each(styles, (value, name) => {
        switch (name) {
          case 'mso-list':
            matches = /\w+ \w+([0-9]+)/i.exec(styleValue)
            if (matches) {
              node._listLevel = parseInt(matches[1], 10)
            }
            if (/Ignore/i.test(value) && node.firstChild) {
              node._listIgnore = true
              node.firstChild._listIgnore = true
            }
            break
          case 'horiz-align':
            name = 'text-align'
            break
          case 'vert-align':
            name = 'vertical-align'
            break
          case 'font-color':
          case 'mso-foreground':
            name = 'color'
            break
          case 'mso-background':
          case 'mso-highlight':
            name = 'background'
            break
          case 'font-weight':
          case 'font-style':
            if (value !== 'normal') {
              outputStyles[name] = value
            }
            return
          case 'mso-element':
            if (/^(comment|comment-list)$/i.test(value)) {
              node.remove()
              return
            }
            break
        }
        if (name.indexOf('mso-comment') === 0) {
          node.remove()
          return
        }
        if (name.indexOf('mso-') === 0) {
          return
        }
        if (Settings.getRetainStyleProps(editor) === 'all' || validStyles && validStyles[name]) {
          outputStyles[name] = value
        }
      })
      if (/(bold)/i.test(outputStyles['font-weight'])) {
        delete outputStyles['font-weight']
        node.wrap(new global$7('b', 1))
      }
      if (/(italic)/i.test(outputStyles['font-style'])) {
        delete outputStyles['font-style']
        node.wrap(new global$7('i', 1))
      }
      outputStyles = editor.dom.serializeStyle(outputStyles, node.name)
      if (outputStyles) {
        return outputStyles
      }
      return null
    }
    const filterWordContent = function (editor, content) {
      let retainStyleProperties, validStyles
      retainStyleProperties = Settings.getRetainStyleProps(editor)
      if (retainStyleProperties) {
        validStyles = global$3.makeMap(retainStyleProperties.split(/[, ]/))
      }
      content = Utils.filter(content, [
        /<br class="?Apple-interchange-newline"?>/gi,
        /<b[^>]+id="?docs-internal-[^>]*>/gi,
        /<!--[\s\S]+?-->/gi,
        /<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|img|meta|link|style|\w:\w+)(?=[\s\/>]))[^>]*>/gi,
        [
          /<(\/?)s>/gi,
          '<$1strike>',
        ],
        [
          /&nbsp;/gi,
          '\xA0',
        ],
        [
          /<span\s+style\s*=\s*"\s*mso-spacerun\s*:\s*yes\s*;?\s*"\s*>([\s\u00a0]*)<\/span>/gi,
          function (str, spaces) {
            return spaces.length > 0 ? spaces.replace(/./, ' ').slice(Math.floor(spaces.length / 2)).split('').join('\xA0') : ''
          },
        ],
      ])
      const validElements = Settings.getWordValidElements(editor)
      const schema = global$8({
        valid_elements: validElements,
        valid_children: '-li[p]',
      })
      global$3.each(schema.elements, (rule) => {
        if (!rule.attributes.class) {
          rule.attributes.class = {}
          rule.attributesOrder.push('class')
        }
        if (!rule.attributes.style) {
          rule.attributes.style = {}
          rule.attributesOrder.push('style')
        }
      })
      const domParser = global$6({}, schema)
      domParser.addAttributeFilter('style', (nodes) => {
        let i = nodes.length; let node
        while (i--) {
          node = nodes[i]
          node.attr('style', filterStyles(editor, validStyles, node, node.attr('style')))
          if (node.name === 'span' && node.parent && !node.attributes.length) {
            node.unwrap()
          }
        }
      })
      domParser.addAttributeFilter('class', (nodes) => {
        let i = nodes.length; let node; let className
        while (i--) {
          node = nodes[i]
          className = node.attr('class')
          if (/^(MsoCommentReference|MsoCommentText|msoDel)$/i.test(className)) {
            node.remove()
          }
          node.attr('class', null)
        }
      })
      domParser.addNodeFilter('del', (nodes) => {
        let i = nodes.length
        while (i--) {
          nodes[i].remove()
        }
      })
      domParser.addNodeFilter('a', (nodes) => {
        let i = nodes.length; let node; let href; let name
        while (i--) {
          node = nodes[i]
          href = node.attr('href')
          name = node.attr('name')
          if (href && href.indexOf('#_msocom_') !== -1) {
            node.remove()
            continue
          }
          if (href && href.indexOf('file://') === 0) {
            href = href.split('#')[1]
            if (href) {
              href = `#${href}`
            }
          }
          if (!href && !name) {
            node.unwrap()
          } else {
            if (name && !/^_?(?:toc|edn|ftn)/i.test(name)) {
              node.unwrap()
              continue
            }
            node.attr({
              href,
              name,
            })
          }
        }
      })
      const rootNode = domParser.parse(content)
      if (Settings.shouldConvertWordFakeLists(editor)) {
        convertFakeListsToProperLists(rootNode)
      }
      content = global$9({ validate: editor.settings.validate }, schema).serialize(rootNode)
      return content
    }
    const preProcess = function (editor, content) {
      return Settings.shouldUseDefaultFilters(editor) ? filterWordContent(editor, content) : content
    }
    const WordFilter = {
      preProcess,
      isWordContent,
    }

    const processResult = function (content, cancelled) {
      return {
        content,
        cancelled,
      }
    }
    const postProcessFilter = function (editor, html, internal, isWordHtml) {
      const tempBody = editor.dom.create('div', { style: 'display:none' }, html)
      const postProcessArgs = Events.firePastePostProcess(editor, tempBody, internal, isWordHtml)
      return processResult(postProcessArgs.node.innerHTML, postProcessArgs.isDefaultPrevented())
    }
    const filterContent = function (editor, content, internal, isWordHtml) {
      const preProcessArgs = Events.firePastePreProcess(editor, content, internal, isWordHtml)
      if (editor.hasEventListeners('PastePostProcess') && !preProcessArgs.isDefaultPrevented()) {
        return postProcessFilter(editor, preProcessArgs.content, internal, isWordHtml)
      }
      return processResult(preProcessArgs.content, preProcessArgs.isDefaultPrevented())
    }
    const process = function (editor, html, internal) {
      const isWordHtml = WordFilter.isWordContent(html)
      const content = isWordHtml ? WordFilter.preProcess(editor, html) : html
      return filterContent(editor, content, internal, isWordHtml)
    }
    const ProcessFilters = { process }

    const removeMeta = function (editor, html) {
      const body = editor.dom.create('body', {}, html)
      global$3.each(body.querySelectorAll('meta'), (elm) => elm.parentNode.removeChild(elm))
      return body.innerHTML
    }
    const pasteHtml = function (editor, html) {
      editor.insertContent(removeMeta(editor, html), {
        merge: Settings.shouldMergeFormats(editor),
        paste: true,
      })
      return true
    }
    const isAbsoluteUrl = function (url) {
      return /^https?:\/\/[\w\?\-\/+=.&%@~#]+$/i.test(url)
    }
    const isImageUrl = function (url) {
      return isAbsoluteUrl(url) && /.(gif|jpe?g|png)$/.test(url)
    }
    const createImage = function (editor, url, pasteHtmlFn) {
      editor.undoManager.extra(() => {
        pasteHtmlFn(editor, url)
      }, () => {
        editor.insertContent(`<img src="${url}">`)
      })
      return true
    }
    const createLink = function (editor, url, pasteHtmlFn) {
      editor.undoManager.extra(() => {
        pasteHtmlFn(editor, url)
      }, () => {
        editor.execCommand('mceInsertLink', false, url)
      })
      return true
    }
    const linkSelection = function (editor, html, pasteHtmlFn) {
      return editor.selection.isCollapsed() === false && isAbsoluteUrl(html) ? createLink(editor, html, pasteHtmlFn) : false
    }
    const insertImage = function (editor, html, pasteHtmlFn) {
      return isImageUrl(html) ? createImage(editor, html, pasteHtmlFn) : false
    }
    const smartInsertContent = function (editor, html) {
      global$3.each([
        linkSelection,
        insertImage,
        pasteHtml,
      ], (action) => action(editor, html, pasteHtml) !== true)
    }
    const insertContent = function (editor, html) {
      if (Settings.isSmartPasteEnabled(editor) === false) {
        pasteHtml(editor, html)
      } else {
        smartInsertContent(editor, html)
      }
    }
    const SmartPaste = {
      isImageUrl,
      isAbsoluteUrl,
      insertContent,
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

    const map = function (xs, f) {
      const len = xs.length
      const r = new Array(len)
      for (let i = 0; i < len; i++) {
        const x = xs[i]
        r[i] = f(x, i, xs)
      }
      return r
    }
    const each = function (xs, f) {
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i]
        f(x, i, xs)
      }
    }
    const filter$1 = function (xs, pred) {
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
    const from$1 = isFunction(Array.from) ? Array.from : function (x) {
      return slice.call(x)
    }

    var nu = function (baseFn) {
      let data = Option.none()
      let callbacks = []
      const map$$1 = function (f) {
        return nu((nCallback) => {
          get((data) => {
            nCallback(f(data))
          })
        })
      }
      var get = function (nCallback) {
        if (isReady()) { call(nCallback) } else { callbacks.push(nCallback) }
      }
      const set = function (x) {
        data = Option.some(x)
        run(callbacks)
        callbacks = []
      }
      var isReady = function () {
        return data.isSome()
      }
      var run = function (cbs) {
        each(cbs, call)
      }
      var call = function (cb) {
        data.each((x) => {
          setTimeout(() => {
            cb(x)
          }, 0)
        })
      }
      baseFn(set)
      return {
        get,
        map: map$$1,
        isReady,
      }
    }
    const pure$1 = function (a) {
      return nu((callback) => {
        callback(a)
      })
    }
    const LazyValue = {
      nu,
      pure: pure$1,
    }

    const bounce = function (f) {
      return function () {
        const args = []
        for (let _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i]
        }
        const me = this
        setTimeout(() => {
          f.apply(me, args)
        }, 0)
      }
    }

    var nu$1 = function (baseFn) {
      const get = function (callback) {
        baseFn(bounce(callback))
      }
      const map = function (fab) {
        return nu$1((callback) => {
          get((a) => {
            const value = fab(a)
            callback(value)
          })
        })
      }
      const bind = function (aFutureB) {
        return nu$1((callback) => {
          get((a) => {
            aFutureB(a).get(callback)
          })
        })
      }
      const anonBind = function (futureB) {
        return nu$1((callback) => {
          get((a) => {
            futureB.get(callback)
          })
        })
      }
      const toLazy = function () {
        return LazyValue.nu(get)
      }
      const toCached = function () {
        let cache = null
        return nu$1((callback) => {
          if (cache === null) {
            cache = toLazy()
          }
          cache.get(callback)
        })
      }
      return {
        map,
        bind,
        anonBind,
        toLazy,
        toCached,
        get,
      }
    }
    const pure$2 = function (a) {
      return nu$1((callback) => {
        callback(a)
      })
    }
    const Future = {
      nu: nu$1,
      pure: pure$2,
    }

    const par = function (asyncValues, nu) {
      return nu((callback) => {
        const r = []
        let count = 0
        const cb = function (i) {
          return function (value) {
            r[i] = value
            count++
            if (count >= asyncValues.length) {
              callback(r)
            }
          }
        }
        if (asyncValues.length === 0) {
          callback([])
        } else {
          each(asyncValues, (asyncValue, i) => {
            asyncValue.get(cb(i))
          })
        }
      })
    }

    const par$1 = function (futures) {
      return par(futures, Future.nu)
    }
    const mapM = function (array, fn) {
      const futures = map(array, fn)
      return par$1(futures)
    }

    const pasteHtml$1 = function (editor, html, internalFlag) {
      const internal = internalFlag || InternalHtml.isMarked(html)
      const args = ProcessFilters.process(editor, InternalHtml.unmark(html), internal)
      if (args.cancelled === false) {
        SmartPaste.insertContent(editor, args.content)
      }
    }
    const pasteText = function (editor, text) {
      text = editor.dom.encode(text).replace(/\r\n/g, '\n')
      text = Newlines.convert(text, editor.settings.forced_root_block, editor.settings.forced_root_block_attrs)
      pasteHtml$1(editor, text, false)
    }
    const getDataTransferItems = function (dataTransfer) {
      const items = {}
      const mceInternalUrlPrefix = 'data:text/mce-internal,'
      if (dataTransfer) {
        if (dataTransfer.getData) {
          const legacyText = dataTransfer.getData('Text')
          if (legacyText && legacyText.length > 0) {
            if (legacyText.indexOf(mceInternalUrlPrefix) === -1) {
              items['text/plain'] = legacyText
            }
          }
        }
        if (dataTransfer.types) {
          for (let i = 0; i < dataTransfer.types.length; i++) {
            const contentType = dataTransfer.types[i]
            try {
              items[contentType] = dataTransfer.getData(contentType)
            } catch (ex) {
              items[contentType] = ''
            }
          }
        }
      }
      return items
    }
    const getClipboardContent = function (editor, clipboardEvent) {
      const content = getDataTransferItems(clipboardEvent.clipboardData || editor.getDoc().dataTransfer)
      return Utils.isMsEdge() ? global$3.extend(content, { 'text/html': '' }) : content
    }
    const hasContentType = function (clipboardContent, mimeType) {
      return mimeType in clipboardContent && clipboardContent[mimeType].length > 0
    }
    const hasHtmlOrText = function (content) {
      return hasContentType(content, 'text/html') || hasContentType(content, 'text/plain')
    }
    const getBase64FromUri = function (uri) {
      let idx
      idx = uri.indexOf(',')
      if (idx !== -1) {
        return uri.substr(idx + 1)
      }
      return null
    }
    const isValidDataUriImage = function (settings, imgElm) {
      return settings.images_dataimg_filter ? settings.images_dataimg_filter(imgElm) : true
    }
    const extractFilename = function (editor, str) {
      const m = str.match(/([\s\S]+?)\.(?:jpeg|jpg|png|gif)$/i)
      return m ? editor.dom.encode(m[1]) : null
    }
    const uniqueId = Utils.createIdGenerator('mceclip')
    const pasteImage = function (editor, imageItem) {
      const base64 = getBase64FromUri(imageItem.uri)
      const id = uniqueId()
      const name$$1 = editor.settings.images_reuse_filename && imageItem.blob.name ? extractFilename(editor, imageItem.blob.name) : id
      const img = new Image()
      img.src = imageItem.uri
      if (isValidDataUriImage(editor.settings, img)) {
        const { blobCache } = editor.editorUpload
        let blobInfo = void 0; let existingBlobInfo = void 0
        existingBlobInfo = blobCache.findFirst((cachedBlobInfo) => cachedBlobInfo.base64() === base64)
        if (!existingBlobInfo) {
          blobInfo = blobCache.create(id, imageItem.blob, base64, name$$1)
          blobCache.add(blobInfo)
        } else {
          blobInfo = existingBlobInfo
        }
        pasteHtml$1(editor, `<img src="${blobInfo.blobUri()}">`, false)
      } else {
        pasteHtml$1(editor, `<img src="${imageItem.uri}">`, false)
      }
    }
    const isClipboardEvent = function (event$$1) {
      return event$$1.type === 'paste'
    }
    const readBlobsAsDataUris = function (items) {
      return mapM(items, (item) => Future.nu((resolve) => {
        const blob = item.getAsFile ? item.getAsFile() : item
        const reader = new window.FileReader()
        reader.onload = function () {
          resolve({
            blob,
            uri: reader.result,
          })
        }
        reader.readAsDataURL(blob)
      }))
    }
    const getImagesFromDataTransfer = function (dataTransfer) {
      const items = dataTransfer.items ? map(from$1(dataTransfer.items), (item) => item.getAsFile()) : []
      const files = dataTransfer.files ? from$1(dataTransfer.files) : []
      const images = filter$1(items.length > 0 ? items : files, (file) => /^image\/(jpeg|png|gif|bmp)$/.test(file.type))
      return images
    }
    const pasteImageData = function (editor, e, rng) {
      const dataTransfer = isClipboardEvent(e) ? e.clipboardData : e.dataTransfer
      if (editor.settings.paste_data_images && dataTransfer) {
        const images = getImagesFromDataTransfer(dataTransfer)
        if (images.length > 0) {
          e.preventDefault()
          readBlobsAsDataUris(images).get((blobResults) => {
            if (rng) {
              editor.selection.setRng(rng)
            }
            each(blobResults, (result) => {
              pasteImage(editor, result)
            })
          })
          return true
        }
      }
      return false
    }
    const isBrokenAndroidClipboardEvent = function (e) {
      const { clipboardData } = e
      return navigator.userAgent.indexOf('Android') !== -1 && clipboardData && clipboardData.items && clipboardData.items.length === 0
    }
    const isKeyboardPasteEvent = function (e) {
      return global$4.metaKeyPressed(e) && e.keyCode === 86 || e.shiftKey && e.keyCode === 45
    }
    const registerEventHandlers = function (editor, pasteBin, pasteFormat) {
      let keyboardPasteTimeStamp = 0
      let keyboardPastePlainTextState
      editor.on('keydown', (e) => {
        function removePasteBinOnKeyUp(e) {
          if (isKeyboardPasteEvent(e) && !e.isDefaultPrevented()) {
            pasteBin.remove()
          }
        }
        if (isKeyboardPasteEvent(e) && !e.isDefaultPrevented()) {
          keyboardPastePlainTextState = e.shiftKey && e.keyCode === 86
          if (keyboardPastePlainTextState && global$1.webkit && navigator.userAgent.indexOf('Version/') !== -1) {
            return
          }
          e.stopImmediatePropagation()
          keyboardPasteTimeStamp = new Date().getTime()
          if (global$1.ie && keyboardPastePlainTextState) {
            e.preventDefault()
            Events.firePaste(editor, true)
            return
          }
          pasteBin.remove()
          pasteBin.create()
          editor.once('keyup', removePasteBinOnKeyUp)
          editor.once('paste', () => {
            editor.off('keyup', removePasteBinOnKeyUp)
          })
        }
      })
      function insertClipboardContent(clipboardContent, isKeyBoardPaste, plainTextMode, internal) {
        let content, isPlainTextHtml
        if (hasContentType(clipboardContent, 'text/html')) {
          content = clipboardContent['text/html']
        } else {
          content = pasteBin.getHtml()
          internal = internal || InternalHtml.isMarked(content)
          if (pasteBin.isDefaultContent(content)) {
            plainTextMode = true
          }
        }
        content = Utils.trimHtml(content)
        pasteBin.remove()
        isPlainTextHtml = internal === false && Newlines.isPlainText(content)
        if (!content.length || isPlainTextHtml) {
          plainTextMode = true
        }
        if (plainTextMode) {
          if (hasContentType(clipboardContent, 'text/plain') && isPlainTextHtml) {
            content = clipboardContent['text/plain']
          } else {
            content = Utils.innerText(content)
          }
        }
        if (pasteBin.isDefaultContent(content)) {
          if (!isKeyBoardPaste) {
            editor.windowManager.alert('Please use Ctrl+V/Cmd+V keyboard shortcuts to paste contents.')
          }
          return
        }
        if (plainTextMode) {
          pasteText(editor, content)
        } else {
          pasteHtml$1(editor, content, internal)
        }
      }
      const getLastRng = function () {
        return pasteBin.getLastRng() || editor.selection.getRng()
      }
      editor.on('paste', (e) => {
        const clipboardTimer = new Date().getTime()
        const clipboardContent = getClipboardContent(editor, e)
        const clipboardDelay = new Date().getTime() - clipboardTimer
        const isKeyBoardPaste = new Date().getTime() - keyboardPasteTimeStamp - clipboardDelay < 1000
        const plainTextMode = pasteFormat.get() === 'text' || keyboardPastePlainTextState
        let internal = hasContentType(clipboardContent, InternalHtml.internalHtmlMime())
        keyboardPastePlainTextState = false
        if (e.isDefaultPrevented() || isBrokenAndroidClipboardEvent(e)) {
          pasteBin.remove()
          return
        }
        if (!hasHtmlOrText(clipboardContent) && pasteImageData(editor, e, getLastRng())) {
          pasteBin.remove()
          return
        }
        if (!isKeyBoardPaste) {
          e.preventDefault()
        }
        if (global$1.ie && (!isKeyBoardPaste || e.ieFake) && !hasContentType(clipboardContent, 'text/html')) {
          pasteBin.create()
          editor.dom.bind(pasteBin.getEl(), 'paste', (e) => {
            e.stopPropagation()
          })
          editor.getDoc().execCommand('Paste', false, null)
          clipboardContent['text/html'] = pasteBin.getHtml()
        }
        if (hasContentType(clipboardContent, 'text/html')) {
          e.preventDefault()
          if (!internal) {
            internal = InternalHtml.isMarked(clipboardContent['text/html'])
          }
          insertClipboardContent(clipboardContent, isKeyBoardPaste, plainTextMode, internal)
        } else {
          global$2.setEditorTimeout(editor, () => {
            insertClipboardContent(clipboardContent, isKeyBoardPaste, plainTextMode, internal)
          }, 0)
        }
      })
    }
    const registerEventsAndFilters = function (editor, pasteBin, pasteFormat) {
      registerEventHandlers(editor, pasteBin, pasteFormat)
      let src
      editor.parser.addNodeFilter('img', (nodes, name$$1, args) => {
        const isPasteInsert = function (args) {
          return args.data && args.data.paste === true
        }
        const remove = function (node) {
          if (!node.attr('data-mce-object') && src !== global$1.transparentSrc) {
            node.remove()
          }
        }
        const isWebKitFakeUrl = function (src) {
          return src.indexOf('webkit-fake-url') === 0
        }
        const isDataUri = function (src) {
          return src.indexOf('data:') === 0
        }
        if (!editor.settings.paste_data_images && isPasteInsert(args)) {
          let i = nodes.length
          while (i--) {
            src = nodes[i].attributes.map.src
            if (!src) {
              continue
            }
            if (isWebKitFakeUrl(src)) {
              remove(nodes[i])
            } else if (!editor.settings.allow_html_data_urls && isDataUri(src)) {
              remove(nodes[i])
            }
          }
        }
      })
    }

    const getPasteBinParent = function (editor) {
      return global$1.ie && editor.inline ? document.body : editor.getBody()
    }
    const isExternalPasteBin = function (editor) {
      return getPasteBinParent(editor) !== editor.getBody()
    }
    const delegatePasteEvents = function (editor, pasteBinElm, pasteBinDefaultContent) {
      if (isExternalPasteBin(editor)) {
        editor.dom.bind(pasteBinElm, 'paste keyup', (e) => {
          if (!isDefault(editor, pasteBinDefaultContent)) {
            editor.fire('paste')
          }
        })
      }
    }
    const create = function (editor, lastRngCell, pasteBinDefaultContent) {
      const { dom } = editor; const body = editor.getBody()
      let pasteBinElm
      lastRngCell.set(editor.selection.getRng())
      pasteBinElm = editor.dom.add(getPasteBinParent(editor), 'div', {
        id: 'mcepastebin',
        class: 'mce-pastebin',
        contentEditable: true,
        'data-mce-bogus': 'all',
        style: 'position: fixed; top: 50%; width: 10px; height: 10px; overflow: hidden; opacity: 0',
      }, pasteBinDefaultContent)
      if (global$1.ie || global$1.gecko) {
        dom.setStyle(pasteBinElm, 'left', dom.getStyle(body, 'direction', true) === 'rtl' ? 65535 : -65535)
      }
      dom.bind(pasteBinElm, 'beforedeactivate focusin focusout', (e) => {
        e.stopPropagation()
      })
      delegatePasteEvents(editor, pasteBinElm, pasteBinDefaultContent)
      pasteBinElm.focus()
      editor.selection.select(pasteBinElm, true)
    }
    const remove = function (editor, lastRngCell) {
      if (getEl(editor)) {
        let pasteBinClone = void 0
        const lastRng = lastRngCell.get()
        while (pasteBinClone = editor.dom.get('mcepastebin')) {
          editor.dom.remove(pasteBinClone)
          editor.dom.unbind(pasteBinClone)
        }
        if (lastRng) {
          editor.selection.setRng(lastRng)
        }
      }
      lastRngCell.set(null)
    }
    var getEl = function (editor) {
      return editor.dom.get('mcepastebin')
    }
    const getHtml = function (editor) {
      let pasteBinElm, pasteBinClones, i, dirtyWrappers, cleanWrapper
      const copyAndRemove = function (toElm, fromElm) {
        toElm.appendChild(fromElm)
        editor.dom.remove(fromElm, true)
      }
      pasteBinClones = global$3.grep(getPasteBinParent(editor).childNodes, (elm) => elm.id === 'mcepastebin')
      pasteBinElm = pasteBinClones.shift()
      global$3.each(pasteBinClones, (pasteBinClone) => {
        copyAndRemove(pasteBinElm, pasteBinClone)
      })
      dirtyWrappers = editor.dom.select('div[id=mcepastebin]', pasteBinElm)
      for (i = dirtyWrappers.length - 1; i >= 0; i--) {
        cleanWrapper = editor.dom.create('div')
        pasteBinElm.insertBefore(cleanWrapper, dirtyWrappers[i])
        copyAndRemove(cleanWrapper, dirtyWrappers[i])
      }
      return pasteBinElm ? pasteBinElm.innerHTML : ''
    }
    const getLastRng = function (lastRng) {
      return lastRng.get()
    }
    const isDefaultContent = function (pasteBinDefaultContent, content) {
      return content === pasteBinDefaultContent
    }
    const isPasteBin = function (elm) {
      return elm && elm.id === 'mcepastebin'
    }
    var isDefault = function (editor, pasteBinDefaultContent) {
      const pasteBinElm = getEl(editor)
      return isPasteBin(pasteBinElm) && isDefaultContent(pasteBinDefaultContent, pasteBinElm.innerHTML)
    }
    const PasteBin = function (editor) {
      const lastRng = Cell(null)
      const pasteBinDefaultContent = '%MCEPASTEBIN%'
      return {
        create() {
          return create(editor, lastRng, pasteBinDefaultContent)
        },
        remove() {
          return remove(editor, lastRng)
        },
        getEl() {
          return getEl(editor)
        },
        getHtml() {
          return getHtml(editor)
        },
        getLastRng() {
          return getLastRng(lastRng)
        },
        isDefault() {
          return isDefault(editor, pasteBinDefaultContent)
        },
        isDefaultContent(content) {
          return isDefaultContent(pasteBinDefaultContent, content)
        },
      }
    }

    const Clipboard = function (editor, pasteFormat) {
      const pasteBin = PasteBin(editor)
      editor.on('preInit', () => registerEventsAndFilters(editor, pasteBin, pasteFormat))
      return {
        pasteFormat,
        pasteHtml(html, internalFlag) {
          return pasteHtml$1(editor, html, internalFlag)
        },
        pasteText(text) {
          return pasteText(editor, text)
        },
        pasteImageData(e, rng) {
          return pasteImageData(editor, e, rng)
        },
        getDataTransferItems,
        hasHtmlOrText,
        hasContentType,
      }
    }

    const noop$1 = function () {
    }
    const hasWorkingClipboardApi = function (clipboardData) {
      return global$1.iOS === false && clipboardData !== undefined && typeof clipboardData.setData === 'function' && Utils.isMsEdge() !== true
    }
    const setHtml5Clipboard = function (clipboardData, html, text) {
      if (hasWorkingClipboardApi(clipboardData)) {
        try {
          clipboardData.clearData()
          clipboardData.setData('text/html', html)
          clipboardData.setData('text/plain', text)
          clipboardData.setData(InternalHtml.internalHtmlMime(), html)
          return true
        } catch (e) {
          return false
        }
      } else {
        return false
      }
    }
    const setClipboardData = function (evt, data, fallback, done) {
      if (setHtml5Clipboard(evt.clipboardData, data.html, data.text)) {
        evt.preventDefault()
        done()
      } else {
        fallback(data.html, done)
      }
    }
    const fallback = function (editor) {
      return function (html, done) {
        const markedHtml = InternalHtml.mark(html)
        const outer = editor.dom.create('div', {
          contenteditable: 'false',
          'data-mce-bogus': 'all',
        })
        const inner = editor.dom.create('div', { contenteditable: 'true' }, markedHtml)
        editor.dom.setStyles(outer, {
          position: 'fixed',
          top: '0',
          left: '-3000px',
          width: '1000px',
          overflow: 'hidden',
        })
        outer.appendChild(inner)
        editor.dom.add(editor.getBody(), outer)
        const range = editor.selection.getRng()
        inner.focus()
        const offscreenRange = editor.dom.createRng()
        offscreenRange.selectNodeContents(inner)
        editor.selection.setRng(offscreenRange)
        setTimeout(() => {
          editor.selection.setRng(range)
          outer.parentNode.removeChild(outer)
          done()
        }, 0)
      }
    }
    const getData = function (editor) {
      return {
        html: editor.selection.getContent({ contextual: true }),
        text: editor.selection.getContent({ format: 'text' }),
      }
    }
    const isTableSelection = function (editor) {
      return !!editor.dom.getParent(editor.selection.getStart(), 'td[data-mce-selected],th[data-mce-selected]', editor.getBody())
    }
    const hasSelectedContent = function (editor) {
      return !editor.selection.isCollapsed() || isTableSelection(editor)
    }
    const cut = function (editor) {
      return function (evt) {
        if (hasSelectedContent(editor)) {
          setClipboardData(evt, getData(editor), fallback(editor), () => {
            setTimeout(() => {
              editor.execCommand('Delete')
            }, 0)
          })
        }
      }
    }
    const copy = function (editor) {
      return function (evt) {
        if (hasSelectedContent(editor)) {
          setClipboardData(evt, getData(editor), fallback(editor), noop$1)
        }
      }
    }
    const register$1 = function (editor) {
      editor.on('cut', cut(editor))
      editor.on('copy', copy(editor))
    }
    const CutCopy = { register: register$1 }

    const global$a = tinymce.util.Tools.resolve('tinymce.dom.RangeUtils')

    const getCaretRangeFromEvent = function (editor, e) {
      return global$a.getCaretRangeFromPoint(e.clientX, e.clientY, editor.getDoc())
    }
    const isPlainTextFileUrl = function (content) {
      const plainTextContent = content['text/plain']
      return plainTextContent ? plainTextContent.indexOf('file://') === 0 : false
    }
    const setFocusedRange = function (editor, rng) {
      editor.focus()
      editor.selection.setRng(rng)
    }
    const setup = function (editor, clipboard, draggingInternallyState) {
      if (Settings.shouldBlockDrop(editor)) {
        editor.on('dragend dragover draggesture dragdrop drop drag', (e) => {
          e.preventDefault()
          e.stopPropagation()
        })
      }
      if (!Settings.shouldPasteDataImages(editor)) {
        editor.on('drop', (e) => {
          const { dataTransfer } = e
          if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
            e.preventDefault()
          }
        })
      }
      editor.on('drop', (e) => {
        let dropContent, rng
        rng = getCaretRangeFromEvent(editor, e)
        if (e.isDefaultPrevented() || draggingInternallyState.get()) {
          return
        }
        dropContent = clipboard.getDataTransferItems(e.dataTransfer)
        const internal = clipboard.hasContentType(dropContent, InternalHtml.internalHtmlMime())
        if ((!clipboard.hasHtmlOrText(dropContent) || isPlainTextFileUrl(dropContent)) && clipboard.pasteImageData(e, rng)) {
          return
        }
        if (rng && Settings.shouldFilterDrop(editor)) {
          let content_1 = dropContent['mce-internal'] || dropContent['text/html'] || dropContent['text/plain']
          if (content_1) {
            e.preventDefault()
            global$2.setEditorTimeout(editor, () => {
              editor.undoManager.transact(() => {
                if (dropContent['mce-internal']) {
                  editor.execCommand('Delete')
                }
                setFocusedRange(editor, rng)
                content_1 = Utils.trimHtml(content_1)
                if (!dropContent['text/html']) {
                  clipboard.pasteText(content_1)
                } else {
                  clipboard.pasteHtml(content_1, internal)
                }
              })
            })
          }
        }
      })
      editor.on('dragstart', (e) => {
        draggingInternallyState.set(true)
      })
      editor.on('dragover dragend', (e) => {
        if (Settings.shouldPasteDataImages(editor) && draggingInternallyState.get() === false) {
          e.preventDefault()
          setFocusedRange(editor, getCaretRangeFromEvent(editor, e))
        }
        if (e.type === 'dragend') {
          draggingInternallyState.set(false)
        }
      })
    }
    const DragDrop = { setup }

    const setup$1 = function (editor) {
      const plugin = editor.plugins.paste
      const preProcess = Settings.getPreProcess(editor)
      if (preProcess) {
        editor.on('PastePreProcess', (e) => {
          preProcess.call(plugin, plugin, e)
        })
      }
      const postProcess = Settings.getPostProcess(editor)
      if (postProcess) {
        editor.on('PastePostProcess', (e) => {
          postProcess.call(plugin, plugin, e)
        })
      }
    }
    const PrePostProcess = { setup: setup$1 }

    function addPreProcessFilter(editor, filterFunc) {
      editor.on('PastePreProcess', (e) => {
        e.content = filterFunc(editor, e.content, e.internal, e.wordContent)
      })
    }
    function addPostProcessFilter(editor, filterFunc) {
      editor.on('PastePostProcess', (e) => {
        filterFunc(editor, e.node)
      })
    }
    function removeExplorerBrElementsAfterBlocks(editor, html) {
      if (!WordFilter.isWordContent(html)) {
        return html
      }
      const blockElements = []
      global$3.each(editor.schema.getBlockElements(), (block, blockName) => {
        blockElements.push(blockName)
      })
      const explorerBlocksRegExp = new RegExp(`(?:<br>&nbsp;[\\s\\r\\n]+|<br>)*(<\\/?(${blockElements.join('|')})[^>]*>)(?:<br>&nbsp;[\\s\\r\\n]+|<br>)*`, 'g')
      html = Utils.filter(html, [[
        explorerBlocksRegExp,
        '$1',
      ]])
      html = Utils.filter(html, [
        [
          /<br><br>/g,
          '<BR><BR>',
        ],
        [
          /<br>/g,
          ' ',
        ],
        [
          /<BR><BR>/g,
          '<br>',
        ],
      ])
      return html
    }
    function removeWebKitStyles(editor, content, internal, isWordHtml) {
      if (isWordHtml || internal) {
        return content
      }
      const webKitStylesSetting = Settings.getWebkitStyles(editor)
      let webKitStyles
      if (Settings.shouldRemoveWebKitStyles(editor) === false || webKitStylesSetting === 'all') {
        return content
      }
      if (webKitStylesSetting) {
        webKitStyles = webKitStylesSetting.split(/[, ]/)
      }
      if (webKitStyles) {
        const dom_1 = editor.dom; const node_1 = editor.selection.getNode()
        content = content.replace(/(<[^>]+) style="([^"]*)"([^>]*>)/gi, (all, before, value, after) => {
          const inputStyles = dom_1.parseStyle(dom_1.decode(value))
          let outputStyles = {}
          if (webKitStyles === 'none') {
            return before + after
          }
          for (let i = 0; i < webKitStyles.length; i++) {
            let inputValue = inputStyles[webKitStyles[i]]; let currentValue = dom_1.getStyle(node_1, webKitStyles[i], true)
            if (/color/.test(webKitStyles[i])) {
              inputValue = dom_1.toHex(inputValue)
              currentValue = dom_1.toHex(currentValue)
            }
            if (currentValue !== inputValue) {
              outputStyles[webKitStyles[i]] = inputValue
            }
          }
          outputStyles = dom_1.serializeStyle(outputStyles, 'span')
          if (outputStyles) {
            return `${before} style="${outputStyles}"${after}`
          }
          return before + after
        })
      } else {
        content = content.replace(/(<[^>]+) style="([^"]*)"([^>]*>)/gi, '$1$3')
      }
      content = content.replace(/(<[^>]+) data-mce-style="([^"]+)"([^>]*>)/gi, (all, before, value, after) => `${before} style="${value}"${after}`)
      return content
    }
    function removeUnderlineAndFontInAnchor(editor, root) {
      editor.$('a', root).find('font,u').each((i, node) => {
        editor.dom.remove(node, true)
      })
    }
    const setup$2 = function (editor) {
      if (global$1.webkit) {
        addPreProcessFilter(editor, removeWebKitStyles)
      }
      if (global$1.ie) {
        addPreProcessFilter(editor, removeExplorerBrElementsAfterBlocks)
        addPostProcessFilter(editor, removeUnderlineAndFontInAnchor)
      }
    }
    const Quirks = { setup: setup$2 }

    const makeSetupHandler = function (editor, clipboard) {
      return function (api) {
        api.setActive(clipboard.pasteFormat.get() === 'text')
        const pastePlainTextToggleHandler = function (e) {
          return api.setActive(e.state)
        }
        editor.on('PastePlainTextToggle', pastePlainTextToggleHandler)
        return function () {
          return editor.off('PastePlainTextToggle', pastePlainTextToggleHandler)
        }
      }
    }
    const register$2 = function (editor, clipboard) {
      editor.ui.registry.addToggleButton('pastetext', {
        active: false,
        icon: 'paste-text',
        tooltip: 'Paste as text',
        onAction() {
          return editor.execCommand('mceTogglePlainTextPaste')
        },
        onSetup: makeSetupHandler(editor, clipboard),
      })
      editor.ui.registry.addToggleMenuItem('pastetext', {
        text: 'Paste as text',
        onAction() {
          return editor.execCommand('mceTogglePlainTextPaste')
        },
        onSetup: makeSetupHandler(editor, clipboard),
      })
    }
    const Buttons = { register: register$2 }

    global.add('paste', (editor) => {
      if (DetectProPlugin.hasProPlugin(editor) === false) {
        const userIsInformedState = Cell(false)
        const draggingInternallyState = Cell(false)
        const pasteFormat = Cell(Settings.isPasteAsTextEnabled(editor) ? 'text' : 'html')
        const clipboard = Clipboard(editor, pasteFormat)
        const quirks = Quirks.setup(editor)
        Buttons.register(editor, clipboard)
        Commands.register(editor, clipboard, userIsInformedState)
        PrePostProcess.setup(editor)
        CutCopy.register(editor)
        DragDrop.setup(editor, clipboard, draggingInternallyState)
        return Api.get(clipboard, quirks)
      }
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
