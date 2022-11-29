import type { PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import { html } from '@hydrofoil/shaperone-wc'
import '../components/sh-sl-add-object-buttons'
import { sh1 } from '../lib/ns'

export function addObject({ shape }: PropertyState) {
  const shapes = shape.or.filter(or => or.getBoolean(sh1.newObjectOverrides))

  if (shapes.length) {
    return html`<sh-sl-add-object-buttons .shapes="${shape.or}"></sh-sl-add-object-buttons>`
  }

  return ''
}
