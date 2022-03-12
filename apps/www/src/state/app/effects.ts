import $rdf from '@rdfjs/data-model'
import { hydra, rdf, sh } from '@tpluscode/rdf-ns-builders/strict'
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

      const { resource } = store.getState().routing
      dispatch.resource.load(resource)
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
  }
}
