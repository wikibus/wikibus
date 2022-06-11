import type { SlInput } from '@shoelace-style/shoelace'
import { html, SingleEditorComponent } from '@hydrofoil/shaperone-wc'

interface InputRenderer {
  type?: SlInput['type']
}

export const inputRenderer = async (arg: InputRenderer = {}): Promise<SingleEditorComponent['render']> => {
  await import('@shoelace-style/shoelace/dist/components/input/input.js')

  return ({ value }, { update }) => html`<sl-input .value="${value.object?.value || ''}"                                                    
                                                   .type="${arg.type}"
                                                   @sl-change="${(e: any) => update(e.target.value)}"></sl-input>`
}
