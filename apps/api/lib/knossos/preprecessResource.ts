import type { ResourceHook } from '@hydrofoil/labyrinth/resource'
import $rdf from 'rdf-ext'

export const resourceWithQuery: ResourceHook = ({ req, pointer }) => {
  const requestedResource = req.rdf.namedNode(req.url)
  const storeResource = req.hydra.resource.term

  if (!storeResource.equals(requestedResource)) {
    [...pointer.dataset].forEach((quad) => {
      let replace = false
      let { subject, predicate, object } = quad

      if (subject.equals(storeResource)) {
        subject = requestedResource
        replace = true
      }
      if (object.equals(storeResource)) {
        object = requestedResource
        replace = true
      }

      if (replace) {
        pointer.dataset
          .delete(quad)
          .add($rdf.quad(subject, predicate, object))
      }
    })
  }
}
