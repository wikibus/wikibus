import namespace from '@rdfjs/namespace'
import ParsingClient from 'sparql-http-client/ParsingClient'
import { expect } from 'chai'
import { getPageMeta } from '../../lib/findMeta'

const base = 'https://wikibus.lndo.site/'
const app = namespace(`${base}app/`)
const res = namespace(`${base}`)

const client = new ParsingClient({
  endpointUrl: `${process.env.SPARQL_ENDPOINT}`,
  user: process.env.SPARQL_USER,
  password: process.env.SPARQL_PASSWORD,
})

describe('@wikibus/ograph-inject-middleware/lib/findMeta', function () {
  this.timeout(10000)

  describe('getPageMeta', () => {
    it('finds meta for static page', async () => {
      // when
      const vehiclesUrl = app('vehicles')

      // when
      const meta = await getPageMeta({ appUrl: vehiclesUrl, base, client })

      // then
      expect(meta).to.deep.eq({
        description: 'Browse and discover buses, trams, trolleys, and others',
        image: 'https://res.cloudinary.com/dytcmwide/image/upload/v1661026437/da2aaxofs6hy1bxru7af.png',
        title: 'Vehicles',
        url: res('vehicles').value,
      })
    })

    describe('finds meta for dynamic page', () => {
      it('Brand', async () => {
        // when
        const brandUrl = app('brand/solaris')

        // when
        const meta = await getPageMeta({ appUrl: brandUrl, base, client })

        // then
        expect(meta).to.deep.eq({
          description: 'A brand of Polish buses, coaches and trams',
          title: 'Solaris',
          image: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Solaris_logo.jpg',
          url: res('brand/solaris').value,
        })
      })
    })
  })
})
