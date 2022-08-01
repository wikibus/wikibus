import { directive, Directive, PartInfo, PartType } from 'lit/directive.js'
import { render, TemplateResult } from 'lit'
import type { RdfResource } from 'alcaeus'
import { roadshow } from '@hydrofoil/vocabularies/builders'
import * as CSSwhat from 'css-what'
import type { NamedNode } from '@rdfjs/types'
import { applyTokens } from '../lib/css'

class WrapperDirective extends Directive {
  private _element?: HTMLElement
  private _wrapped?: HTMLElement
  private _selector: string | null = null

  constructor(partInfo: PartInfo) {
    super(partInfo)
    if (partInfo.type !== PartType.CHILD) {
      throw new Error('templateContent can only be used in child bindings')
    }
  }

  render(
    group: RdfResource | undefined,
    inner: TemplateResult | string,
    property: NamedNode | NamedNode[] = [roadshow.selector, roadshow.container],
  ) {
    const selector = group?.pointer.out(property).value
    if (!selector) {
      return inner
    }

    if (this._element && this._selector === selector) {
      render(inner, this._element)
      return this._wrapped
    }

    let element: HTMLElement | undefined | null
    let parents: HTMLElement[] = []
    this._selector = selector
    if (selector) {
      [element, ...parents] = WrapperDirective.__createElementTree(selector)
    }
    if (!element) {
      element = document.createElement('section')
    }

    this._element = element
    this._wrapped = parents.reduce((wrapped, parent) => {
      if (!parent) {
        return wrapped
      }

      parent.appendChild(wrapped)
      return parent
    }, element)

    return this._wrapped
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
