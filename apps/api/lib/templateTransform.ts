import { TransformVariable } from '@hydrofoil/knossos/collection'
import slug from 'slug'
import $rdf from 'rdf-ext'
import { nanoid } from 'nanoid'

interface Options {
  prependUniqueChars?: boolean
}

export const slugify: TransformVariable<[Options]> = ({ term }, options: Options = {}) => {
  let value = slug(term.value)
  if (options.prependUniqueChars) {
    value = `${nanoid(5)}-${value}`
  }

  return $rdf.literal(value)
}
