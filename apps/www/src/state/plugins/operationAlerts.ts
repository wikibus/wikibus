import { html } from 'lit'

export const operationAlerts = {
  model: {
    state: {
    },
    reducers: {
    },
    effects(store: any) {
      const { auth, alerts } = store.getDispatch()

      return {
        'operation/failed': ({ response }: any) => {
          if (response?.xhr.status === 401) {
            alerts.show({
              content: html`Please <sl-button variant="text" @click="${auth.logIn}">log in</sl-button>`,
              variant: 'danger',
            })
          }
          if (response?.xhr.status === 403) {
            alerts.show({
              content: 'Insufficient permissions',
              variant: 'danger',
            })
          }
          if (response?.xhr.status === 400) {
            alerts.show({
              content: 'The request data was incorrect',
              variant: 'danger',
              autoHide: true,
            })
          }
        },
      }
    },
  },
}
