import { DataFactory } from 'rdf-js'
import $rdf from '@rdfjs/data-model'

const factory: DataFactory = new Proxy($rdf, {
  get(target: any, prop): any {
    return target[prop].bind(target)
  },
})

export default factory
