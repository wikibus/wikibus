(function () {
  const insertdatetime = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    const getDateFormat = function (editor) {
      return editor.getParam('insertdatetime_dateformat', editor.translate('%Y-%m-%d'))
    }
    const getTimeFormat = function (editor) {
      return editor.getParam('insertdatetime_timeformat', editor.translate('%H:%M:%S'))
    }
    const getFormats = function (editor) {
      return editor.getParam('insertdatetime_formats', [
        '%H:%M:%S',
        '%Y-%m-%d',
        '%I:%M:%S %p',
        '%D',
      ])
    }
    const getDefaultDateTime = function (editor) {
      const formats = getFormats(editor)
      return formats.length > 0 ? formats[0] : getTimeFormat(editor)
    }
    const shouldInsertTimeElement = function (editor) {
      return editor.getParam('insertdatetime_element', false)
    }
    const Settings = {
      getDateFormat,
      getTimeFormat,
      getFormats,
      getDefaultDateTime,
      shouldInsertTimeElement,
    }

    const daysShort = 'Sun Mon Tue Wed Thu Fri Sat Sun'.split(' ')
    const daysLong = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday Sunday'.split(' ')
    const monthsShort = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')
    const monthsLong = 'January February March April May June July August September October November December'.split(' ')
    const addZeros = function (value, len) {
      value = `${value}`
      if (value.length < len) {
        for (let i = 0; i < len - value.length; i++) {
          value = `0${value}`
        }
      }
      return value
    }
    const getDateTime = function (editor, fmt, date) {
      date = date || new Date()
      fmt = fmt.replace('%D', '%m/%d/%Y')
      fmt = fmt.replace('%r', '%I:%M:%S %p')
      fmt = fmt.replace('%Y', `${date.getFullYear()}`)
      fmt = fmt.replace('%y', `${date.getYear()}`)
      fmt = fmt.replace('%m', addZeros(date.getMonth() + 1, 2))
      fmt = fmt.replace('%d', addZeros(date.getDate(), 2))
      fmt = fmt.replace('%H', `${addZeros(date.getHours(), 2)}`)
      fmt = fmt.replace('%M', `${addZeros(date.getMinutes(), 2)}`)
      fmt = fmt.replace('%S', `${addZeros(date.getSeconds(), 2)}`)
      fmt = fmt.replace('%I', `${(date.getHours() + 11) % 12 + 1}`)
      fmt = fmt.replace('%p', `${date.getHours() < 12 ? 'AM' : 'PM'}`)
      fmt = fmt.replace('%B', `${editor.translate(monthsLong[date.getMonth()])}`)
      fmt = fmt.replace('%b', `${editor.translate(monthsShort[date.getMonth()])}`)
      fmt = fmt.replace('%A', `${editor.translate(daysLong[date.getDay()])}`)
      fmt = fmt.replace('%a', `${editor.translate(daysShort[date.getDay()])}`)
      fmt = fmt.replace('%%', '%')
      return fmt
    }
    const updateElement = function (editor, timeElm, computerTime, userTime) {
      const newTimeElm = editor.dom.create('time', { datetime: computerTime }, userTime)
      timeElm.parentNode.insertBefore(newTimeElm, timeElm)
      editor.dom.remove(timeElm)
      editor.selection.select(newTimeElm, true)
      editor.selection.collapse(false)
    }
    const insertDateTime = function (editor, format) {
      if (Settings.shouldInsertTimeElement(editor)) {
        const userTime = getDateTime(editor, format)
        let computerTime = void 0
        if (/%[HMSIp]/.test(format)) {
          computerTime = getDateTime(editor, '%Y-%m-%dT%H:%M')
        } else {
          computerTime = getDateTime(editor, '%Y-%m-%d')
        }
        const timeElm = editor.dom.getParent(editor.selection.getStart(), 'time')
        if (timeElm) {
          updateElement(editor, timeElm, computerTime, userTime)
        } else {
          editor.insertContent(`<time datetime="${computerTime}">${userTime}</time>`)
        }
      } else {
        editor.insertContent(getDateTime(editor, format))
      }
    }
    const Actions = {
      insertDateTime,
      getDateTime,
    }

    const register = function (editor) {
      editor.addCommand('mceInsertDate', () => {
        Actions.insertDateTime(editor, Settings.getDateFormat(editor))
      })
      editor.addCommand('mceInsertTime', () => {
        Actions.insertDateTime(editor, Settings.getTimeFormat(editor))
      })
    }
    const Commands = { register }

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools')

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

    const register$1 = function (editor) {
      const formats = Settings.getFormats(editor)
      const defaultFormat = Cell(Settings.getDefaultDateTime(editor))
      editor.ui.registry.addSplitButton('insertdatetime', {
        icon: 'insert-time',
        tooltip: 'Insert date/time',
        fetch(done) {
          done(global$1.map(formats, (format) => ({
            type: 'choiceitem',
            text: Actions.getDateTime(editor, format),
            value: format,
          })))
        },
        onAction() {
          const args = []
          for (let _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i]
          }
          Actions.insertDateTime(editor, defaultFormat.get())
        },
        onItemAction(_, value) {
          defaultFormat.set(value)
          Actions.insertDateTime(editor, value)
        },
      })
      const makeMenuItemHandler = function (format) {
        return function () {
          defaultFormat.set(format)
          Actions.insertDateTime(editor, format)
        }
      }
      editor.ui.registry.addNestedMenuItem('insertdatetime', {
        icon: 'insert-time',
        text: 'Date/time',
        getSubmenuItems() {
          return global$1.map(formats, (format) => ({
            type: 'menuitem',
            text: Actions.getDateTime(editor, format),
            onAction: makeMenuItemHandler(format),
          }))
        },
      })
    }
    const Buttons = { register: register$1 }

    global.add('insertdatetime', (editor) => {
      Commands.register(editor)
      Buttons.register(editor)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
