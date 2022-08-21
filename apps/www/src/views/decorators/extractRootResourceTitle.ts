import { Decorator, FocusNodeViewContext } from '@hydrofoil/roadshow'
import { hydra } from '@tpluscode/rdf-ns-builders'

export const extractRootResourceTitle: Decorator<FocusNodeViewContext> = {
  decorates: ['focusNode'],
  appliesTo({ depth }) {
    return depth === 0
  },
  decorate(inner, context) {
    const title = context.node.out(hydra.title)
    if (title) {
      document.title = `${title} | Wikibus | Public Transport Encyclopedia`
    } else {
      document.title = 'Wikibus | Public Transport Encyclopedia'
    }

    return inner
  },
}
