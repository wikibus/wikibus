import namespace from '@rdfjs/namespace'
import ParsingClient from 'sparql-http-client/ParsingClient.js'
import { expect } from 'chai'
import { getPageMeta } from '../../lib/findMeta.js'

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
        image: {
          url: 'https://res.cloudinary.com/dytcmwide/image/upload/v1661026437/da2aaxofs6hy1bxru7af.png',
          width: '600',
          height: '600',
        },
        title: 'Vehicles',
        url: res('vehicles').value,
      })
    })

    describe('finds meta for dynamic page', () => {
      it('of Brand', async () => {
        // when
        const brandUrl = app('brand/solaris')

        // when
        const meta = await getPageMeta({ appUrl: brandUrl, base, client })

        // then
        expect(meta).to.deep.eq({
          description: 'A brand of Polish buses, coaches and trams',
          title: 'Solaris',
          image: {
            url: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Solaris_logo.jpg',
            width: undefined,
            height: undefined,
          },
          url: res('brand/solaris').value,
        })
      })

      it('with multilingual label', async () => {
        // when
        const brandUrl = app('brand/laz')

        // when
        const meta = await getPageMeta({ appUrl: brandUrl, base, client })

        // then
        expect(meta).to.deep.eq({
          description: undefined,
          title: 'LAZ',
          image: {
            url: 'https://res.cloudinary.com/dytcmwide/image/upload/v1661026437/da2aaxofs6hy1bxru7af.png',
            width: '600',
            height: '600',
          },
          url: res('brand/laz').value,
        })
      })
    })
  })
})
