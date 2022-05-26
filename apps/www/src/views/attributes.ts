import { directive, Directive, PartInfo, PartType } from 'lit/directive.js'
import { ElementPart, nothing } from 'lit'
import type { PropertyShape } from '@rdfine/shacl'
import { roadshow } from '@hydrofoil/vocabularies/builders'
import * as CSSwhat from 'css-what'
import { applyTokens } from '../lib/css'

class AttributesDirective extends Directive {
  constructor(partInfo: PartInfo) {
    super(partInfo)
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('templateContent can only be used in element bindings')
    }
  }

  render(_group: PropertyShape | undefined) {
    return nothing
  }

  override update(_part: ElementPart, [group]: Parameters<this['render']>) {
    const rsAttributes = group?.getString(roadshow.attributes, { strict: false })
    if (rsAttributes) {
      const [tokens] = CSSwhat.parse(rsAttributes)

      applyTokens(_part.element, tokens)
    }
  }
}

export const attributes = directive(AttributesDirective)
