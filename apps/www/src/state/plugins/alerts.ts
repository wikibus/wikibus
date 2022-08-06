import { nanoid } from 'nanoid'
import { TemplateResult } from 'lit'

export interface Notification {
  content: string | TemplateResult
  variant?: string
  autoHide?: boolean
}

interface AlertsState {
  notifications: Map<string, Notification>
}

export const alerts = {
  model: {
    state: <AlertsState>{
      notifications: new Map(),
    },
    reducers: {
      show(state: AlertsState, notification: Notification) {
        state.notifications.set(nanoid(), notification)
        return state
      },
      hide(state: AlertsState, id: string) {
        state.notifications.delete(id)
        return state
      },
    },
  },
}
