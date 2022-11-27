import type { PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import { html } from '@hydrofoil/shaperone-wc'
import '../components/sh-sl-add-object-buttons'

export function addObject({ shape }: PropertyState) {
  if (shape.or.length) {
    return html`<sh-sl-add-object-buttons .shapes="${shape.or}"></sh-sl-add-object-buttons>`
  }

  return ''
}
