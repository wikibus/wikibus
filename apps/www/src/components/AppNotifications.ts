import { css, LitElement, render } from 'lit'
import { connect } from '@captaincodeman/rdx'
import { Notification } from '../state/plugins/alerts'
import { State, store } from '../state/store'

export class AppNotifications extends connect(store, LitElement) {
  private alerts = new Set()

  static get styles() {
    return css`
      :host {
        display: none;
      }
    `
  }

  mapState(state: State) {
    for (const [key, notification] of state.alerts.notifications.entries()) {
      this.show(key, notification)
    }

    return {}
  }

  private show(key: string, { variant = 'neutral', content, autoHide = true }: Notification) {
    if (!this.alerts.has(key)) {
      this.alerts.add(key)
      import('@shoelace-style/shoelace/dist/components/alert/alert.js')
        .then(() => {
          const slAlert = document.createElement('sl-alert')
          slAlert.closable = true
          slAlert.variant = variant as any
          if (autoHide) {
            slAlert.duration = 2000
          }
          render(content, slAlert)

          slAlert.addEventListener('sl-hide', () => {
            this.alerts.delete(key)
            store.dispatch.alerts.hide(key)
          })

          this.renderRoot.append(slAlert)
          slAlert.toast()
        })
    }
  }
}

customElements.define('app-notifications', AppNotifications)
