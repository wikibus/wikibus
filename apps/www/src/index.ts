import App from './components/App'
import type { State } from './state/store'
import './forms'

declare module '@hydrofoil/roadshow/lib/ViewContext' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  interface Params extends State {}
}

customElements.define('wikibus-app', App)
