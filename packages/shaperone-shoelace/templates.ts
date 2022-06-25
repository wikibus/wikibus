import { html } from '@hydrofoil/shaperone-wc'
import { PropertyTemplate, ObjectTemplate, FocusNodeTemplate } from '@hydrofoil/shaperone-wc/templates'
import { repeat } from 'lit/directives/repeat.js'
import { taggedLiteral } from '@rdfjs-elements/lit-helpers/taggedLiteral.js'
import { sh } from '@tpluscode/rdf-ns-builders'

export const property: PropertyTemplate = (renderer, current) => html`
      <sh-sl-property .label="${taggedLiteral(current.property.shape, { property: sh.name })}"
                      .helpText="${taggedLiteral(current.property.shape, { property: sh.description })}"
                      .canAddValue="${current.property.canAdd}"
                      @added="${renderer.actions.addObject}"
      >
        ${repeat(current.property.objects, object => html`${renderer.renderObject({ object })}`)}
      </sh-sl-property>
    `

property.loadDependencies = () => [
  import('./components/sh-sl-property'),
]

export const object: ObjectTemplate = renderer => html`
  <sh-sl-object .canBeRemoved="${renderer.property.canRemove}" @removed="${renderer.actions.remove}">
    ${renderer.renderEditor()}
  </sh-sl-object>
`

object.loadDependencies = () => [
  import('./components/sh-sl-object'),
]

export const focusNode: FocusNodeTemplate = (renderer, { focusNode: { groups } }) => html`<sl-tab-group>
      ${repeat(groups, (group) => {
    const groupName = group.group?.id.value || 'default'

    return html`
          <sl-tab slot="nav" panel="${groupName}" ?active="${group.selected}">${taggedLiteral(group.group)}</sl-tab>
          <sl-tab-panel name="${groupName}" ?active="${group.selected}">
            ${renderer.renderGroup({ group })}
          </sl-tab-panel>
        `
  })}
    </sl-tab-group>`

focusNode.loadDependencies = () => [
  import('@shoelace-style/shoelace/dist/components/tab-group/tab-group.js'),
  import('@shoelace-style/shoelace/dist/components/tab/tab.js'),
  import('@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js'),
]
