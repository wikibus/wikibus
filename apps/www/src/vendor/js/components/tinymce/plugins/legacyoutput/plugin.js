(function () {
  const legacyoutput = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools')

    const getFontSizeFormats = function (editor) {
      return editor.getParam('fontsize_formats')
    }
    const setFontSizeFormats = function (editor, fontsize_formats) {
      editor.settings.fontsize_formats = fontsize_formats
    }
    const getFontFormats = function (editor) {
      return editor.getParam('font_formats')
    }
    const setFontFormats = function (editor, font_formats) {
      editor.settings.font_formats = font_formats
    }
    const getFontSizeStyleValues = function (editor) {
      return editor.getParam('font_size_style_values')
    }
    const setInlineStyles = function (editor, inline_styles) {
      editor.settings.inline_styles = inline_styles
    }
    const Settings = {
      getFontFormats,
      getFontSizeFormats,
      setFontSizeFormats,
      setFontFormats,
      getFontSizeStyleValues,
      setInlineStyles,
    }

    const overrideFormats = function (editor) {
      const alignElements = 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img'; const fontSizes = global$1.explode(Settings.getFontSizeStyleValues(editor)); const { schema } = editor
      editor.formatter.register({
        alignleft: {
          selector: alignElements,
          attributes: { align: 'left' },
        },
        aligncenter: {
          selector: alignElements,
          attributes: { align: 'center' },
        },
        alignright: {
          selector: alignElements,
          attributes: { align: 'right' },
        },
        alignjustify: {
          selector: alignElements,
          attributes: { align: 'justify' },
        },
        bold: [
          {
            inline: 'b',
            remove: 'all',
          },
          {
            inline: 'strong',
            remove: 'all',
          },
          {
            inline: 'span',
            styles: { fontWeight: 'bold' },
          },
        ],
        italic: [
          {
            inline: 'i',
            remove: 'all',
          },
          {
            inline: 'em',
            remove: 'all',
          },
          {
            inline: 'span',
            styles: { fontStyle: 'italic' },
          },
        ],
        underline: [
          {
            inline: 'u',
            remove: 'all',
          },
          {
            inline: 'span',
            styles: { textDecoration: 'underline' },
            exact: true,
          },
        ],
        strikethrough: [
          {
            inline: 'strike',
            remove: 'all',
          },
          {
            inline: 'span',
            styles: { textDecoration: 'line-through' },
            exact: true,
          },
        ],
        fontname: {
          inline: 'font',
          attributes: { face: '%value' },
        },
        fontsize: {
          inline: 'font',
          attributes: {
            size(vars) {
              return global$1.inArray(fontSizes, vars.value) + 1
            },
          },
        },
        forecolor: {
          inline: 'font',
          attributes: { color: '%value' },
        },
        hilitecolor: {
          inline: 'font',
          styles: { backgroundColor: '%value' },
        },
      })
      global$1.each('b,i,u,strike'.split(','), (name) => {
        schema.addValidElements(`${name}[*]`)
      })
      if (!schema.getElementRule('font')) {
        schema.addValidElements('font[face|size|color|style]')
      }
      global$1.each(alignElements.split(','), (name) => {
        const rule = schema.getElementRule(name)
        if (rule) {
          if (!rule.attributes.align) {
            rule.attributes.align = {}
            rule.attributesOrder.push('align')
          }
        }
      })
    }
    const overrideSettings = function (editor) {
      const defaultFontsizeFormats = '8pt=1 10pt=2 12pt=3 14pt=4 18pt=5 24pt=6 36pt=7'
      const defaultFontsFormats = 'Andale Mono=andale mono,monospace;' + 'Arial=arial,helvetica,sans-serif;' + 'Arial Black=arial black,sans-serif;' + 'Book Antiqua=book antiqua,palatino,serif;' + 'Comic Sans MS=comic sans ms,sans-serif;' + 'Courier New=courier new,courier,monospace;' + 'Georgia=georgia,palatino,serif;' + 'Helvetica=helvetica,arial,sans-serif;' + 'Impact=impact,sans-serif;' + 'Symbol=symbol;' + 'Tahoma=tahoma,arial,helvetica,sans-serif;' + 'Terminal=terminal,monaco,monospace;' + 'Times New Roman=times new roman,times,serif;' + 'Trebuchet MS=trebuchet ms,geneva,sans-serif;' + 'Verdana=verdana,geneva,sans-serif;' + 'Webdings=webdings;' + 'Wingdings=wingdings,zapf dingbats'
      Settings.setInlineStyles(editor, false)
      if (!Settings.getFontSizeFormats(editor)) {
        Settings.setFontSizeFormats(editor, defaultFontsizeFormats)
      }
      if (!Settings.getFontFormats(editor)) {
        Settings.setFontFormats(editor, defaultFontsFormats)
      }
    }
    const setup = function (editor) {
      overrideSettings(editor)
      editor.on('init', () => overrideFormats(editor))
    }
    const Formats = { setup }

    global.add('legacyoutput', (editor) => {
      Formats.setup(editor)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
