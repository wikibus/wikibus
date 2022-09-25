import $rdf from '@rdfjs/data-model'
import { hydra, schema } from '@tpluscode/rdf-ns-builders'
import type { DispatchParam, Store } from '../store'

export default function effects(store: Store) {
  const dispatch = store.getDispatch()

  return {
    'core/clientReady': (Hydra: DispatchParam<'core', 'clientReady'>) => {
      /* eslint-disable no-param-reassign */
      // Disables the default behaviour which sends conditional headers
      Hydra.cacheStrategy.requestCacheHeaders = () => ({})

      Hydra.defaultHeaders = async ({ uri }): Promise<HeadersInit> => {
        const { auth0 } = store.getState().auth
        const sameOrigin = new URL(uri, window.location.origin).origin === window.location.origin
        if (sameOrigin && auth0 && await auth0.isAuthenticated()) {
          return {
            Authorization: `Bearer ${await auth0.getTokenSilently()}`,
          }
        }

        return {}
      }

      const { resource } = store.getState().routing
      dispatch.resource.load(resource)
      dispatch.auth.initialize()
    },
    'auth/setClient': ({ redirected, referrer }: DispatchParam<'auth', 'setClient'>) => {
      if (redirected && referrer) {
        dispatch.routing.goTo(referrer)
      }
    },
    'resource/succeeded': ({ id, representation }: DispatchParam<'resource', 'succeeded'>) => {
      const { resource } = store.getState().routing
      if (id.value === resource && representation?.root) {
        dispatch.core.setContentResource({
          id: $rdf.namedNode(resource),
          pointer: representation.root.pointer,
        })
      }
    },
    'core/setContentResource': async ({ id, pointer }: DispatchParam<'core', 'setContentResource'>) => {
      const { entrypoint } = store.getState().core
      const { representations } = store.getState().resource
      const { resource } = store.getState().routing

      const representation = representations.get(id || pointer.term) ||
        representations.get($rdf.namedNode(resource))

      const newEntrypoint = representation
        ?.root?.apiDocumentation?.getArray(hydra.entrypoint)
        .shift()
      if (newEntrypoint && newEntrypoint.load && !newEntrypoint.equals(entrypoint)) {
        const loaded = await newEntrypoint.load()
        if (loaded.representation?.root) {
          dispatch.core.setEntrypoint(loaded.representation.root.pointer)
        }
      }
    },
    'operation/succeeded': ({ operation }: DispatchParam<'operation', 'succeeded'>) => {
      if (operation.types.has(schema.ReplaceAction)) {
        dispatch.routing.goTo(operation.target.id.value)
      }
    },
  }
}
