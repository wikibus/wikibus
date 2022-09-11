import * as CSSwhat from 'css-what'

export function applyTokens(element: Element, tokens: CSSwhat.Selector[]) {
  /* eslint-disable no-param-reassign */
  for (const token of tokens) {
    if (token.type === 'attribute') {
      if (token.name === 'id') {
        element.id = token.value
      } else if (token.name === 'class') {
        element.classList.add(token.value)
      } else if (token.action === 'exists') {
        element.setAttribute(token.name, '')
      } else if (token.action === 'equals') {
        element.setAttribute(token.name, token.value)
      } else {
        // eslint-disable-next-line no-console
        console.warn('Unsupported CSS token', token)
      }
    }
  }
}
