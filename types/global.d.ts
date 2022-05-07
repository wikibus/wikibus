declare module '*.ttl' {
  import { Quad, DataFactory } from 'rdf-js'

  export default function ({ factory }: { factory: DataFactory }): Quad[]
}
