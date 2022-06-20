import { ResourceLoader } from '@hydrofoil/roadshow/ResourcesController'
import type { HydraClient } from 'alcaeus/alcaeus'

export function resourceLoader(client: HydraClient): ResourceLoader {
  return async (term) => {
    const { representation } = await client.loadResource(term)
    return representation?.root?.pointer
  }
}
