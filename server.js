/* eslint-disable @typescript-eslint/no-var-requires,no-console */
const express = require('express')
const conditional = require('express-conditional-middleware')
const knossos = require('@hydrofoil/knossos')
const compression = require('compression')
const injectMeta = require('@wikibus/ograph-inject-middleware')
const fs = require('fs')
const path = require('path')
const ParsingClient = require('sparql-http-client/ParsingClient')

const sparqlEndpoint = {
  endpointUrl: `${process.env.SPARQL_ENDPOINT}`,
  user: process.env.SPARQL_USER,
  password: process.env.SPARQL_PASSWORD,
}

const app = express()

app.enable('trust proxy')
app.use(compression())

const root = './apps/www/dist'
app.use('/app', express.static(root))

const appIndex = path.resolve(__dirname, root, 'index.html')
app.use('/app', conditional(
  req => req.accepts('html'),
  injectMeta(fs.readFileSync(appIndex).toString(), new ParsingClient(sparqlEndpoint)),
))

const apis = knossos.default({
  name: 'wikibus',
  ...sparqlEndpoint,
})
app.use('/', apis)

app.listen(parseInt(process.env.PORT, 10) || 8080)
