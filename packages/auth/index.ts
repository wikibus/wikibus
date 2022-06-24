import type {} from 'express-rdf-request'
import type { MiddlewareFactory } from '@hydrofoil/knossos/configuration'
import type { StreamClient } from 'sparql-http-client'
import express from 'express'
import { expressjwt as jwt } from 'express-jwt'
import jwksRsa from 'jwks-rsa'
import { DESCRIBE } from '@tpluscode/sparql-builder'
import $rdf from 'rdf-ext'
import clownface from 'clownface'
import { acl, vcard, rdf, hydra } from '@tpluscode/rdf-ns-builders'
import type { Context } from '@hydrofoil/knossos'
import fetch from 'node-fetch'
import { isNamedNode } from 'is-graph-pointer'
import { asyncMiddleware } from 'middleware-async'

declare module 'express-serve-static-core' {
  interface Request {
    user: {
      sub?: string
    }
  }
}

const setUser = (client: StreamClient) => asyncMiddleware(async (req, res, next) => {
  if (req.user?.sub) {
    const userQuery = await DESCRIBE`?user`
      .WHERE`?user ${vcard.hasUID} "${req.user.sub}"`
      .execute(client.query)
    const dataset = await $rdf.dataset().import(userQuery)

    let [foundUser] = clownface({ dataset })
      .has(vcard.hasUID, req.user.sub)
      .toArray()
      .filter(isNamedNode)

    if (foundUser) {
      req.knossos.log(`Current user ${foundUser.value}`)
    } else {
      const id = req.rdf.namedNode(`/user/${encodeURIComponent(req.user.sub)}`)
      foundUser = clownface({ dataset: $rdf.dataset() })
        .namedNode(id)
        .addOut(rdf.type, [acl.AuthenticatedAgent, hydra.Resource])
        .addOut(vcard.hasUID, req.user.sub)
        .addOut(acl.owner, id)
      await req.knossos.store.save(foundUser)
        .then(() => req.knossos.log(`Created user resource ${foundUser.value}`))
        .catch(req.knossos.log)
    }

    // eslint-disable-next-line no-param-reassign
    req.agent = foundUser
  }

  next()
})

const createJwtHandler = (jwksUri: string, { client }: Context) => {
  const authorize = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri,
    }) as any,

    // Validate the audience and the issuer.
    audience: process.env.OIDC_AUDIENCE,
    issuer: process.env.OIDC_ISSUER,
    algorithms: ['RS256'],
    credentialsRequired: false,
    requestProperty: 'user',
  })

  return express.Router()
    .use(authorize)
    .use(setUser(client))
}

export const oidc: MiddlewareFactory = async (context) => {
  const response = await fetch(`${process.env.OIDC_URL}/.well-known/openid-configuration`)

  if (response.ok) {
    const oidcConfig: any = await response.json()
    return createJwtHandler(oidcConfig.jwks_uri, context)
  }

  throw new Error('Failed to initialize authentication middleware')
}
