import { directive, Directive, PartInfo, PartType } from 'lit/directive.js'
import { noChange, render, TemplateResult } from 'lit'
import type { PropertyGroup } from '@rdfine/shacl'
import { roadshow } from '@hydrofoil/vocabularies/builders'
import * as CSSwhat from 'css-what'
import { applyTokens } from '../lib/css'

class WrapperDirective extends Directive {
  private _element?: HTMLElement

  constructor(partInfo: PartInfo) {
    super(partInfo)
    if (partInfo.type !== PartType.CHILD) {
      throw new Error('templateContent can only be used in child bindings')
    }
  }

  render(group: PropertyGroup, inner: TemplateResult) {
    if (this._element) {
      render(inner, this._element)
      return noChange
    }

    let element: HTMLElement | undefined | null
    let parents: HTMLElement[] = []
    const selector = group.getString(roadshow.selector, { strict: false })
    if (selector) {
      [element, ...parents] = WrapperDirective.__createElementTree(selector)
    }
    if (!element) {
      element = document.createElement('section')
    }

    this._element = element
    return parents.reduce((wrapped, parent) => {
      if (!parent) {
        return wrapped
      }

      parent.appendChild(wrapped)
      return parent
    }, element)
  }

  private static __createElementTree(selectorString: string) {
    const [selector] = CSSwhat.parse(selectorString)
    return selector.reduce((elements, token) => {
      if (token.type === 'tag') {
        const next = document.createElement(token.name)
        return [next, ...elements]
      }

      const [current] = elements
      if (current) {
        applyTokens(current, [token])
      }

      return elements
    }, [] as HTMLElement[])
  }
}

export const wrapper = directive(WrapperDirective)
