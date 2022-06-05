import { html } from '@hydrofoil/shaperone-wc'
import { PropertyTemplate } from '@hydrofoil/shaperone-wc/templates'
import { repeat } from 'lit/directives/repeat.js'

export const property: PropertyTemplate = (renderer, current) => html`${repeat(current.property.objects, object => html`${renderer.renderObject({ object })}`)}`
