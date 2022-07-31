import type { SlInput } from '@shoelace-style/shoelace'
import type { SingleEditorActions } from '@hydrofoil/shaperone-core/models/components'
import { html, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import '@shoelace-style/shoelace/dist/components/input/input.js'

interface InputRenderer {
  type?: SlInput['type']
  onChange?(value: string, actions: SingleEditorActions): void
}

export function inputRenderer(arg: InputRenderer = {}): SingleEditorComponent['render'] {
  return ({ value }, actions) => {
    const onChange = arg.onChange || actions.update

    return html`<sl-input .value="${value.object?.value || ''}"
                          .type="${arg.type}"
                          @sl-change="${(e: any) => onChange(e.target.value, actions)}"></sl-input>`
  }
}
