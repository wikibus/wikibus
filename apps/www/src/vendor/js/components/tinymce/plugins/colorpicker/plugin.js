(function () {
  const colorpicker = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    global.add('colorpicker', () => {
      console.warn('Color picker plugin is now built in to the core editor, please remove it from your editor configuration')
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
