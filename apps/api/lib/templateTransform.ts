import { TransformVariable } from '@hydrofoil/knossos/collection'
import slug from 'slug'
import $rdf from 'rdf-ext'

export const slugify: TransformVariable = term => $rdf.literal(slug(term.value))
