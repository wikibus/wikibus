(function () {
  const contextmenu = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    global.add('contextmenu', () => {
      console.warn('Context menu plugin is now built in to the core editor, please remove it from your editor configuration')
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
