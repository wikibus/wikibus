import * as Header from './header'
import * as Main from './main'
import * as Footer from './footer'

export const renderers = [
  ...Main.renderers,
  ...Header.renderers,
  ...Footer.renderers,
]

export const viewers = [
  ...Main.viewers,
  ...Header.viewers,
  ...Footer.viewers,
]

export const { decorators } = Main
