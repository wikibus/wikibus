import { html, ObjectViewContext, Renderer } from '@hydrofoil/roadshow'
import { getAllProperties } from '@hydrofoil/roadshow/lib/shape'
import { dash, schema, sh } from '@tpluscode/rdf-ns-builders'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { findNodes } from 'clownface-shacl-path'

function interpolate(template: string, params = {}) {
  const names = ['html', ...Object.keys(params)]
  const vals = Object.values(params)
  // eslint-disable-next-line no-new-func
  return new Function('tag', ...names, `return tag\`${template}\`;`)(html, ...[html, ...vals])
}

export const renderer: Renderer<ObjectViewContext> = {
  viewer: dash.HTMLViewer,
  render() {
    const template = this.node.out(dash.js).value
    if (!template) {
      return html`${unsafeHTML(this.node.value)}`
    }

    let focusNode: Record<string, any> = {}
    if (this.parent?.focusNodeShape && this.parent?.focusNode) {
      focusNode = [...getAllProperties(this.parent.focusNodeShape)].reduce((map, property) => {
        const identifier = property.pointer.out(schema.identifier).value
        const path = property.pointer.out(sh.path)
        let { values } = findNodes(this.parent!.focusNode!, path)
        const { maxCount } = property
        if (maxCount) {
          values = values.slice(0, maxCount)
        }
        if (identifier) {
          return {
            ...map,
            [identifier]: values,
          }
        }

        return map
      }, {} as Record<string, any>)
    }

    return interpolate(template, {
      focusNode,
    })
  },
}
