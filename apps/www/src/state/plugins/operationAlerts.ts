import { html } from 'lit'
import { schema } from '@tpluscode/rdf-ns-builders'
import { Store } from '@hydrofoil/shell'
import { turtle } from '@tpluscode/rdf-string'

export const operationAlerts = {
  model: {
    state: {
    },
    reducers: {
    },
    effects(store: Store) {
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
        'operation/failed': ({ payload, response }: any) => {
          function logIn() {
            const resourceUrl = store.getState().core.contentResource?.id.value
            if (resourceUrl) {
              const returnTo = new URL(resourceUrl)
              returnTo.hash = turtle`${payload.dataset}`.toString()
              auth.logInWithRedirect({
                returnTo: returnTo.toString(),
              })
            } else {
              auth.logIn()
            }
          }

          if (response?.xhr.status === 401) {
            alerts.show({
              content: html`Please <sl-button variant="text" @click="${logIn}">log in</sl-button>`,
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
