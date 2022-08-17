import { html } from 'lit'
import { schema } from '@tpluscode/rdf-ns-builders'

export const operationAlerts = {
  model: {
    state: {
    },
    reducers: {
    },
    effects(store: any) {
      const { auth, alerts, routing } = store.getDispatch()

      return {
        'operation/succeeded': ({ response, operation }: any) => {
          if (response.xhr.status === 201) {
            const created = response.xhr.headers.get('location')

            alerts.show({
              content: html`
                Resource created successfully.
                <sl-button variant="text" @click="${() => routing.goTo(created)}">Show it</sl-button>
                <sl-icon slot="icon" name="check2-circle"></sl-icon>
              `,
              variant: 'success',
              autoHide: false,
            })
          } else if (operation.types.has(schema.ReplaceAction)) {
            alerts.show({
              content: html`
                Resource updated successfully.
                <sl-icon slot="icon" name="check2-circle"></sl-icon>
              `,
              variant: 'success',
            })
          }
        },
        'operation/failed': ({ response }: any) => {
          if (response?.xhr.status === 401) {
            alerts.show({
              content: html`Please <sl-button variant="text" @click="${auth.logIn}">log in</sl-button>`,
              variant: 'danger',
              autoHide: false,
            })
          } else if (response?.xhr.status === 403) {
            alerts.show({
              content: 'Insufficient permissions',
              variant: 'danger',
              autoHide: false,
            })
          } else if (response?.xhr.status === 400) {
            alerts.show({
              content: 'The request data was incorrect',
              variant: 'danger',
            })
          } else {
            alerts.show({
              content: 'An error occurred',
              variant: 'danger',
            })
          }
        },
      }
    },
  },
}
