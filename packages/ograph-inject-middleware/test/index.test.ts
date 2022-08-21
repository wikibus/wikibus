import express from 'express'
import sinon from 'sinon'
import request from 'supertest'
import { expect } from 'chai'
import $rdf from 'rdf-ext'
import middleware from '..'

const client = {} as any

describe('@wikibus/ograph-inject-middleware', () => {
  let getPageMeta: sinon.SinonStub

  beforeEach(() => {
    getPageMeta = sinon.stub()
  })

  it('calls getPageMeta with correct params', async () => {
    // given
    const app = express()
    app.use(middleware({
      client,
      getPageMeta,
      index: '',
    }))

    // when
    await request(app)
      .get('/app/foo/bar')
      .set('host', 'wikibus.org')

    // then
    expect(getPageMeta).to.have.been.calledWith({
      appUrl: $rdf.namedNode('http://wikibus.org/app/foo/bar'),
      base: 'http://wikibus.org/',
      client,
    })
  })

  it('sets last-modified', async () => {
    // given
    getPageMeta.resolves({
      lastModified: new Date('2022-09-10T09:30:05Z'),
    })

    const app = express()
    app.use(middleware({
      client,
      getPageMeta,
      index: '',
    }))

    // when
    const response = request(app)
      .get('/app/foo/bar')
      .set('host', 'wikibus.org')

    // then
    await response.expect('last-modified', 'Sat, 10 Sep 2022 09:30:05 GMT')
  })

  it('fills in the template', async () => {
    // given
    const index = `<meta property="og:title" content="{{title}}">
<meta property="og:url" content="{{url}}">
<meta property="og:description" content="{{description}}">
<meta property="og:image" content="{{image}}">`
    getPageMeta.resolves({
      title: 'Foo Bar page',
      url: 'https://example.com/foo-bar',
      description: 'A page about foo and bar and friends',
      image: 'https://example.com/foo-bar.jpg',
    })

    const app = express()
    app.use(middleware({
      client,
      getPageMeta,
      index,
    }))

    // when
    const response = request(app)
      .get('/app/foo/bar')
      .set('host', 'wikibus.org')

    // then
    await response.expect(`<meta property="og:title" content="Foo Bar page">
<meta property="og:url" content="https://example.com/foo-bar">
<meta property="og:description" content="A page about foo and bar and friends">
<meta property="og:image" content="https://example.com/foo-bar.jpg">`)
  })
})
