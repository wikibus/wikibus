(function () {
  const emoticons = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    const noop = function () {
      const args = []
      for (let _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i]
      }
    }
    const constant = function (value) {
      return function () {
        return value
      }
    }
    const identity = function (x) {
      return x
    }
    const die = function (msg) {
      return function () {
        throw new Error(msg)
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

    const exists = function (xs, pred) {
      return findIndex(xs, pred).isSome()
    }
    const map = function (xs, f) {
      const len = xs.length
      const r = new Array(len)
      for (let i = 0; i < len; i++) {
        const x = xs[i]
        r[i] = f(x, i, xs)
      }
      return r
    }
    var findIndex = function (xs, pred) {
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i]
        if (pred(x, i, xs)) {
          return Option.some(i)
        }
      }
      return Option.none()
    }
    const { slice } = Array.prototype
    const from$1 = isFunction(Array.from) ? Array.from : function (x) {
      return slice.call(x)
    }

    const emojisFrom = function (list, pattern, maxResults) {
      const matches = []
      const reachedLimit = maxResults.fold(() => never, (max) => function (size) {
        return size >= max
      })
      for (let i = 0; i < list.length; i++) {
        if (pattern.length === 0 || list[i].title.indexOf(pattern) > -1 || exists(list[i].keywords, (k) => k.indexOf(pattern) > -1)) {
          matches.push({
            value: list[i].char,
            text: list[i].title,
            icon: list[i].char,
          })
          if (reachedLimit(matches.length)) {
            break
          }
        }
      }
      return matches
    }

    const isStartOfWord = function (rng, text) {
      return rng.startOffset === 0 || /\s/.test(text.charAt(rng.startOffset - 1))
    }
    const init = function (editor, database) {
      editor.ui.registry.addAutocompleter('emoticons', {
        ch: ':',
        columns: 'auto',
        minChars: 2,
        matches: isStartOfWord,
        fetch(pattern, maxResults) {
          return database.waitForLoad().then(() => {
            const candidates = database.listAll()
            return emojisFrom(candidates, pattern.toLowerCase(), Option.some(maxResults))
          })
        },
        onAction(autocompleteApi, rng, value) {
          editor.selection.setRng(rng)
          editor.insertContent(value)
          autocompleteApi.hide()
        },
      })
    }

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

    const last$1 = function (fn, rate) {
      let timer = null
      const cancel = function () {
        if (timer !== null) {
          clearTimeout(timer)
          timer = null
        }
      }
      const throttle = function () {
        const args = []
        for (let _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i]
        }
        if (timer !== null) { clearTimeout(timer) }
        timer = setTimeout(() => {
          fn.apply(null, args)
          timer = null
        }, rate)
      }
      return {
        cancel,
        throttle,
      }
    }

    const Global = typeof window !== 'undefined' ? window : Function('return this;')()

    const { keys } = Object
    const { hasOwnProperty } = Object
    const each$1 = function (obj, f) {
      const props = keys(obj)
      for (let k = 0, len = props.length; k < len; k++) {
        const i = props[k]
        const x = obj[i]
        f(x, i, obj)
      }
    }
    const has = function (obj, key) {
      return hasOwnProperty.call(obj, key)
    }

    var value = function (o) {
      const is = function (v) {
        return o === v
      }
      const or = function (opt) {
        return value(o)
      }
      const orThunk = function (f) {
        return value(o)
      }
      const map = function (f) {
        return value(f(o))
      }
      const mapError = function (f) {
        return value(o)
      }
      const each = function (f) {
        f(o)
      }
      const bind = function (f) {
        return f(o)
      }
      const fold = function (_, onValue) {
        return onValue(o)
      }
      const exists = function (f) {
        return f(o)
      }
      const forall = function (f) {
        return f(o)
      }
      const toOption = function () {
        return Option.some(o)
      }
      return {
        is,
        isValue: always,
        isError: never,
        getOr: constant(o),
        getOrThunk: constant(o),
        getOrDie: constant(o),
        or,
        orThunk,
        fold,
        map,
        mapError,
        each,
        bind,
        exists,
        forall,
        toOption,
      }
    }
    var error = function (message) {
      const getOrThunk = function (f) {
        return f()
      }
      const getOrDie = function () {
        return die(String(message))()
      }
      const or = function (opt) {
        return opt
      }
      const orThunk = function (f) {
        return f()
      }
      const map = function (f) {
        return error(message)
      }
      const mapError = function (f) {
        return error(f(message))
      }
      const bind = function (f) {
        return error(message)
      }
      const fold = function (onError, _) {
        return onError(message)
      }
      return {
        is: never,
        isValue: never,
        isError: always,
        getOr: identity,
        getOrThunk,
        getOrDie,
        or,
        orThunk,
        fold,
        map,
        mapError,
        each: noop,
        bind,
        exists: never,
        forall: always,
        toOption: Option.none,
      }
    }
    const Result = {
      value,
      error,
    }

    const global$1 = tinymce.util.Tools.resolve('tinymce.dom.ScriptLoader')

    const global$2 = tinymce.util.Tools.resolve('tinymce.util.Promise')

    const ALL_CATEGORY = 'All'
    const categoryNameMap = {
      symbols: 'Symbols',
      people: 'People',
      animals_and_nature: 'Animals and Nature',
      food_and_drink: 'Food and Drink',
      activity: 'Activity',
      travel_and_places: 'Travel and Places',
      objects: 'Objects',
      flags: 'Flags',
    }
    const GLOBAL_NAME = 'emoticons_plugin_database'
    const extractGlobal = function (url) {
      if (Global.tinymce[GLOBAL_NAME]) {
        const result = Result.value(Global.tinymce[GLOBAL_NAME])
        delete Global.tinymce[GLOBAL_NAME]
        return result
      }
      return Result.error(`URL ${url} did not contain the expected format for emoticons`)
    }
    const translateCategory = function (name) {
      return has(categoryNameMap, name) ? categoryNameMap[name] : name
    }
    const initDatabase = function (editor, databaseUrl) {
      const categories = Cell(Option.none())
      const all = Cell(Option.none())
      editor.on('init', () => {
        global$1.ScriptLoader.loadScript(databaseUrl, () => {
          const cats = {}
          const everything = []
          extractGlobal(databaseUrl).fold((err) => {
            console.log(err)
            categories.set(Option.some({}))
            all.set(Option.some([]))
          }, (emojis) => {
            each$1(emojis, (lib, n) => {
              const entry = {
                title: n,
                keywords: lib.keywords,
                char: lib.char,
                category: translateCategory(lib.category),
              }
              const current = cats[entry.category] !== undefined ? cats[entry.category] : []
              cats[entry.category] = current.concat([entry])
              everything.push(entry)
            })
            categories.set(Option.some(cats))
            all.set(Option.some(everything))
          })
        }, () => {
        })
      })
      const listCategory = function (category) {
        if (category === ALL_CATEGORY) {
          return listAll()
        }
        return categories.get().bind((cats) => Option.from(cats[category])).getOr([])
      }
      var listAll = function () {
        return all.get().getOr([])
      }
      const listCategories = function () {
        return [ALL_CATEGORY].concat(keys(categories.get().getOr({})))
      }
      const waitForLoad = function () {
        if (hasLoaded()) {
          return global$2.resolve(true)
        }
        return new global$2((resolve, reject) => {
          let numRetries = 3
          var interval = setInterval(() => {
            if (hasLoaded()) {
              clearInterval(interval)
              resolve(true)
            } else {
              numRetries--
              if (numRetries < 0) {
                console.log(`Could not load emojis from url: ${databaseUrl}`)
                clearInterval(interval)
                reject(false)
              }
            }
          }, 500)
        })
      }
      var hasLoaded = function () {
        return categories.get().isSome() && all.get().isSome()
      }
      return {
        listCategories,
        hasLoaded,
        waitForLoad,
        listAll,
        listCategory,
      }
    }

    const insertEmoticon = function (editor, ch) {
      editor.insertContent(ch)
    }

    const patternName = 'pattern'
    const open = function (editor, database) {
      const initialState = {
        pattern: '',
        results: emojisFrom(database.listAll(), '', Option.some(50)),
      }
      const scan = function (dialogApi, category) {
        const dialogData = dialogApi.getData()
        const candidates = database.listCategory(category)
        const results = emojisFrom(candidates, dialogData[patternName].toLowerCase(), category === ALL_CATEGORY ? Option.some(50) : Option.none())
        dialogApi.setData({ results })
      }
      const updateFilter = last$1((dialogApi) => {
        const category = currentTab.get()
        scan(dialogApi, category)
      }, 200)
      var currentTab = Cell(ALL_CATEGORY)
      const searchField = {
        label: 'Search',
        type: 'input',
        name: patternName,
      }
      const resultsField = {
        type: 'collection',
        name: 'results',
        columns: 'auto',
      }
      const getInitialState = function () {
        const body = {
          type: 'tabpanel',
          tabs: map(database.listCategories(), (cat) => ({
            title: cat,
            items: [
              searchField,
              resultsField,
            ],
          })),
        }
        return {
          title: 'Emoticons',
          size: 'normal',
          body,
          initialData: initialState,
          onTabChange(dialogApi, title) {
            currentTab.set(title)
            updateFilter.throttle(dialogApi)
          },
          onChange: updateFilter.throttle,
          onAction(dialogApi, actionData) {
            if (actionData.name === 'results') {
              insertEmoticon(editor, actionData.value)
              dialogApi.close()
            }
          },
          buttons: [{
            type: 'cancel',
            text: 'Close',
          }],
        }
      }
      const dialogApi = editor.windowManager.open(getInitialState())
      dialogApi.focus(patternName)
      if (!database.hasLoaded()) {
        dialogApi.block('Loading emoticons...')
        database.waitForLoad().then(() => {
          dialogApi.redial(getInitialState())
          updateFilter.throttle(dialogApi)
          dialogApi.focus(patternName)
          dialogApi.unblock()
        }).catch((err) => {
          dialogApi.redial({
            title: 'Emoticons',
            body: {
              type: 'panel',
              items: [{
                type: 'alertbanner',
                level: 'error',
                icon: 'warning',
                text: '<p>Could not load emoticons</p>',
              }],
            },
            buttons: [{
              type: 'cancel',
              text: 'Close',
            }],
            initialData: {
              pattern: '',
              results: [],
            },
          })
          dialogApi.focus(patternName)
          dialogApi.unblock()
        })
      }
    }
    const Dialog = { open }

    const register = function (editor, database) {
      const onAction = function () {
        return Dialog.open(editor, database)
      }
      editor.ui.registry.addButton('emoticons', {
        tooltip: 'Emoticons',
        icon: 'emoji',
        onAction,
      })
      editor.ui.registry.addMenuItem('emoticons', {
        text: 'Emoticons...',
        icon: 'emoji',
        onAction,
      })
    }
    const Buttons = { register }

    const getEmoticonDatabaseUrl = function (editor, pluginUrl) {
      return editor.getParam('emoticons_database_url', `${pluginUrl}/js/emojis${editor.suffix}.js`)
    }
    const Settings = { getEmoticonDatabaseUrl }

    global.add('emoticons', (editor, pluginUrl) => {
      const databaseUrl = Settings.getEmoticonDatabaseUrl(editor, pluginUrl)
      const database = initDatabase(editor, databaseUrl)
      Buttons.register(editor, database)
      init(editor, database)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
