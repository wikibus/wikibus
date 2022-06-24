import $rdf from '@rdfjs/data-model'
import { hydra, rdf, schema, sh } from '@tpluscode/rdf-ns-builders/strict'
import type { DispatchParam, Store } from '../store'

export default function effects(store: Store) {
  const dispatch = store.getDispatch()

  return {
    'core/clientReady': (Hydra: DispatchParam<'core', 'clientReady'>) => {
      /* eslint-disable no-param-reassign */
      Hydra.cacheStrategy.shouldLoad = function shouldLoad({ representation }) {
        return !representation.root?.hasType(hydra.ApiDocumentation) &&
          // TODO: implement proper resource cache headers
          !representation.root?.hasType(sh.NodeShape) &&
          !representation.root?.pointer
            .out(hydra.manages)
            .has(hydra.property, rdf.type)
            .has(hydra.object, sh.NodeShape)
            .terms.length
      }
      Hydra.defaultHeaders = async ({ uri }): Promise<HeadersInit> => {
        const { auth0 } = store.getState().auth
        const sameOrigin = new URL(uri).origin === window.location.origin
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
    'operation/succeeded': ({ response, operation }: DispatchParam<'operation', 'succeeded'>) => {
      const created = response.xhr.status === 201 && response.xhr.headers.get('location')
      if (created) {
        dispatch.routing.goTo(created)
        return
      }

      if (operation.types.has(schema.ReplaceAction)) {
        dispatch.routing.goTo(operation.target.id.value)
      }
    },
  }
}
