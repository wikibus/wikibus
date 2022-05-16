import { ResourceLoader } from '@hydrofoil/roadshow/ResourcesController'
import type { HydraClient } from 'alcaeus/alcaeus'
import TermMap from '@rdfjs/term-map'

export function resourceLoader(client: HydraClient): ResourceLoader {
  const cache = new TermMap<any, any>()

  return async (term) => {
    let r = cache.get(term)
    if (!r) {
      const { representation } = await client.loadResource(term)
      r = representation?.root?.pointer
      cache.set(term, r)
    }

    return r
  }
}
