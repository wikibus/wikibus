import { v2 as Cloudinary } from 'cloudinary'
import { Readable } from 'stream'

interface UploadedImage {
  original: string
  thumbnail: string
  externalId: string
}

interface UploadImageOptions {
  folder: string
  transformations: {
    thumbnail: string
    default: string
  }
}

export async function uploadImage(body: Readable, { folder, ...opts }: UploadImageOptions) {
  const transformations = <UploadImageOptions['transformations']>Object.fromEntries(
    Object.entries(opts.transformations).map(([k, v]) => [k, `t_${v}`]),
  )
  const publicId = await uploadAndGetId(body, { folder, transformations })
  const image = await Cloudinary.api.resource(publicId)

  const original = image.derived
    .find(({ transformation }: any) => transformation === transformations.default) || image

  const thumbnail = image.derived
    .find(({ transformation }: any) => transformation === transformations.thumbnail) || image

  return <UploadedImage>{
    original: original.secure_url,
    thumbnail: thumbnail.secure_url,
    externalId: publicId,
  }
}

function uploadAndGetId(body: Readable, opts: UploadImageOptions): Promise<string> {
  const { folder, transformations } = opts
  return new Promise((resolve, reject) => {
    const uploadStream = Cloudinary.uploader.upload_stream({
      folder,
      eager: Object.values(transformations),
    }, (err, callResult) => {
      if (err) {
        return reject(new Error(err.message))
      }

      if (!callResult) {
        return reject(new Error('Upload did not return result'))
      }

      return resolve(callResult.public_id)
    })

    body.pipe(uploadStream)
  })
}
