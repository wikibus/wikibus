/* eslint-disable no-console */
import express from 'express'
import conditional from 'express-conditional-middleware'
import knossos from '@hydrofoil/knossos'
import compression from 'compression'
import injectMeta from '@wikibus/ograph-inject-middleware'
import fs from 'fs'
import path from 'path'
import ParsingClient from 'sparql-http-client/ParsingClient.js'
import { fileURLToPath } from 'url'
import * as Sentry from '@wikibus/sentry'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const sparqlEndpoint = {
  endpointUrl: `${process.env.SPARQL_ENDPOINT}`,
  user: process.env.SPARQL_USER,
  password: process.env.SPARQL_PASSWORD,
}

const app = express()

Sentry.setup(app)

app.enable('trust proxy')
app.use(compression())

const root = './apps/www/dist'
app.use('/app', express.static(root))

const appIndex = path.resolve(__dirname, root, 'index.html')
app.use('/app', conditional(
  req => !!req.accepts('html'),
  injectMeta({
    index: fs.readFileSync(appIndex).toString(),
    client: new ParsingClient(sparqlEndpoint),
  }),
))

// TODO: knossos should name-export or become ESM
const apis = (knossos as any).default({
  name: 'wikibus',
  ...sparqlEndpoint,
})
app.use('/', apis)

app.listen(parseInt(process.env.PORT!, 10) || 8080)
