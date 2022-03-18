import { Renderer, ViewerMatcher } from '@hydrofoil/roadshow'
import * as DetailsViewer from './main/DetailsViewer'
import * as HTMLViewer from './main/HTMLViewer'

export const renderers: Renderer<any>[] = [
  DetailsViewer.renderer,
  HTMLViewer.renderer,
]

export const viewers: ViewerMatcher[] = []

export const decorators = []
