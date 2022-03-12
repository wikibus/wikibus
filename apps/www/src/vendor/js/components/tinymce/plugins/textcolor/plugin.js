(function () {
  const textcolor = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    global.add('textcolor', () => {
      console.warn('Text color plugin is now built in to the core editor, please remove it from your editor configuration')
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
