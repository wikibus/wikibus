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

  private async show(key: string, notification: Notification) {
    if (!this.alerts.has(key)) {
      await import('@shoelace-style/shoelace/dist/components/alert/alert.js')
      this.alerts.add(key)

      const slAlert = document.createElement('sl-alert')
      slAlert.closable = true
      slAlert.variant = notification.variant || 'neutral' as any
      if (notification.autoHide) {
        slAlert.duration = 2000
      }
      render(notification.content, slAlert)

      slAlert.addEventListener('sl-hide', () => {
        this.alerts.delete(key)
        store.dispatch.alerts.hide(key)
      })

      this.renderRoot.append(slAlert)
      slAlert.toast()
    }
  }
}

customElements.define('app-notifications', AppNotifications)
