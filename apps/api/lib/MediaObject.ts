import type { RequestHandler } from 'express'
import { uploadImage } from '@wikibus/cloudinary'
import { rdf, schema } from '@tpluscode/rdf-ns-builders'
import { asyncMiddleware } from 'middleware-async'
import $rdf from 'rdf-ext'
import clownface, { AnyPointer } from 'clownface'
import error from 'http-errors'

export const upload: RequestHandler = asyncMiddleware(async (req, res, next) => {
  const cloudinarySettings = req.knossos.config.out(req.rdf.namedNode('/api#cloudinary'))
  const _default = getSetting(cloudinarySettings, 'default_transformation')
  const thumbnail = getSetting(cloudinarySettings, 'thumbnail_transformation')
  const folder = getSetting(cloudinarySettings, `${req.query.folder}-folder`)

  if (!folder) {
    return next(new error.BadRequest(`Missing setting value "cloudinary:${req.query.folder}-folder"`))
  }

  if (!(_default && thumbnail)) {
    return next(new Error('Incomplete cloudinary configuration'))
  }

  const uploaded = await uploadImage(req, {
    folder,
    transformations: {
      default: _default,
      thumbnail,
    },
  })

  const imageId = req.rdf.namedNode(`/image/${uploaded.externalId}`)
  const image = clownface({ dataset: $rdf.dataset() }).node(imageId)
  image
    .addOut(rdf.type, req.rdf.namedNode('/api/ImageObject'))
    .addOut(schema.contentUrl, image.namedNode(uploaded.original))
    .addOut(schema.thumbnail, (ptr) => {
      ptr.addOut(schema.contentUrl, image.namedNode(uploaded.thumbnail))
    })

  await req.knossos.store.save(image)

  res.setHeader('Location', imageId.value)
  return res.sendStatus(201)
})

function getSetting(config: AnyPointer, name: string) {
  return config.out(schema.hasPart)
    .has(schema.name, `cloudinary:${name}`)
    .out(schema.value).value
}
