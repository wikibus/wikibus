import { Decorator, FocusNodeViewContext } from '@hydrofoil/roadshow'
import { hydra } from '@tpluscode/rdf-ns-builders'
import { getLocalizedLabel } from '@rdfjs-elements/lit-helpers'

export const extractRootResourceTitle: Decorator<FocusNodeViewContext> = {
  decorates: ['focusNode'],
  appliesTo({ depth }) {
    return depth === 0
  },
  decorate(inner, context) {
    const title = getLocalizedLabel(context.node.out(hydra.title))
    if (title) {
      document.title = `${title} | Wikibus | Public Transport Encyclopedia`
    } else {
      document.title = 'Loading... | Wikibus | Public Transport Encyclopedia'
    }

    return inner
  },
}
