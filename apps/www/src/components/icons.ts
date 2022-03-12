import * as icons from 'feather-icon-literals'
import SimplePinterest from 'simple-icons/icons/pinterest'
import SimplePdf from 'simple-icons/icons/adobeacrobatreader'
import { html, TemplateResult } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'

icons.setCustomTemplateLiteralTag(html)

export type IconFunction = (size?: number) => TemplateResult

function wrap(featherIcon: (...args: any[]) => any): IconFunction {
  return (size?: number) => featherIcon({ width: size, height: size })
}

export const Menu = wrap(icons.Menu)
export const Search = wrap(icons.Search)
export const ChevronUp = wrap(icons.ChevronUp)
export const Facebook = wrap(icons.Facebook)
export const Twitter = wrap(icons.Twitter)
export const GitHub = wrap(icons.GitHub)
export const Linkedin = wrap(icons.Linkedin)
export const BookOpen = wrap(icons.BookOpen)
export const Pinterest = html` ${unsafeHTML(SimplePinterest.svg)} `
export const Box = wrap(icons.Box)
export const Instagram = wrap(icons.Instagram)
export const FileText = wrap(icons.FileText)
export const Layers = wrap(icons.Layers)
export const MoreHorizontal = wrap(icons.MoreHorizontal)
export const ZoomIn = wrap(icons.ZoomIn)
export const AlertTriangle = wrap(icons.AlertTriangle)
export const Share2 = wrap(icons.Share2)
export const Clock = wrap(icons.Clock)
export const CornerRightDown = wrap(icons.CornerRightDown)
export const User = wrap(icons.User)
export const Loader = wrap(icons.Loader)
export const ShoppingCart = wrap(icons.ShoppingCart)
export const Pdf = html` ${unsafeHTML(SimplePdf.svg)} `
export const Command = wrap(icons.Command)
export const PlusCircle = wrap(icons.PlusCircle)
export const MinusCircle = wrap(icons.MinusCircle)
export const UploadCloud = wrap(icons.UploadCloud)
export const Edit = wrap(icons.Edit)
