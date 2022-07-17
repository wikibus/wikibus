import { SparqlQueryLoader } from '@hydrofoil/labyrinth/lib/loader.js'
import { DESCRIBE } from '@tpluscode/sparql-builder'
import { knossos } from '@hydrofoil/vocabularies/builders'
import type { ResourceLoaderFactory } from '@hydrofoil/knossos/lib/settings'
import $rdf from 'rdf-ext'
import { Result, Router } from 'uri-template-router'
import { hydra, rdf } from '@tpluscode/rdf-ns-builders'
import clownface, { GraphPointer } from 'clownface'
import { isLiteral, isNamedNode } from 'is-graph-pointer'
import type * as express from 'express'
import { loadImplementations } from '@hydrofoil/labyrinth/lib/code.js'

declare module 'hydra-box' {
  interface Resource {
    uriTemplateVariables?: GraphPointer
  }
}

declare module 'uri-template-router' {
  interface RouteOptions {
    template?: GraphPointer
  }
}

export const factory: ResourceLoaderFactory = async (
  { sparql, client },
  inner = new SparqlQueryLoader(sparql as any),
) => {
  const dataset = await $rdf.dataset().import(await DESCRIBE`?template`
    .WHERE` ?template a ${knossos.TemplatedResource}`
    .execute(client.query))
  const templates = clownface({ dataset }).has(rdf.type, knossos.TemplatedResource)

  const router = new Router()
  templates.forEach((template) => {
    const uriTemplate = template.out(knossos.resourceTemplate).out(hydra.template)
    if (isLiteral(uriTemplate)) {
      router.addTemplate(uriTemplate.value, { template }, template.value)
    }
  })

  return {
    async forClassOperation(term, req) {
      const dbResource = await inner.forClassOperation(term)
      if (dbResource.length) {
        return dbResource
      }

      const { pathname } = new URL(term.value)
      const found = router.resolveURI(pathname, {})

      if (found && isNamedNode(found.route.options.template)) {
        const templateResource = found.route.options.template
        const [boxResource] = await inner.forClassOperation(templateResource.term)
        if (boxResource) {
          boxResource.uriTemplateVariables = await processVariables(templateResource, found, req)
          return [boxResource]
        }
        return []
      }

      return []
    },
    forPropertyOperation(term) {
      return inner.forPropertyOperation(term)
    },
  }
}

interface VariableTransform {
  (value: string, req: express.Request): string
}

async function processVariables(template: GraphPointer, routeResult: Result, req: express.Request) {
  const variables = clownface({ dataset: $rdf.dataset() }).blankNode()

  const promises = template
    .out(knossos.resourceTemplate)
    .out(hydra.mapping)
    .map(async (variableMapping) => {
      const predicate = variableMapping.out(hydra.property).term
      const variable = variableMapping.out(hydra.variable).value
      if (!(predicate && variable)) {
        return
      }
      const routeVariable = routeResult.route.variables.find(({ varname }) => varname === variable)
      if (!routeVariable) {
        return
      }
      let value = routeVariable.expand(routeResult.params)

      if (!value) {
        return
      }
      const [transform] = await loadImplementations<VariableTransform>(
        variableMapping.out(knossos.transformVariable),
        req,
        { single: true },
      )
      if (transform) {
        value = transform[0](value, req)
      }

      variables.addOut(predicate, value)
    })

  await Promise.all(promises)

  return variables
}
