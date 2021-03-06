import { Renderer, ViewerMatcher } from '@hydrofoil/roadshow'
import * as DetailsViewer from './main/DetailsViewer'
import * as HTMLViewer from './main/HTMLViewer'
import * as BreadcrumbViewer from './main/BreadcrumbViewer'
import * as BreadcrumbItemViewer from './main/BreadcrumbItemViewer'
import * as FeaturedBoxViewer from './main/FeaturedBoxViewer'

export const renderers: Renderer<any>[] = [
  DetailsViewer.renderer,
  HTMLViewer.renderer,
  BreadcrumbViewer.renderer,
  BreadcrumbItemViewer.renderer,
  FeaturedBoxViewer.renderer,
]

export const viewers: ViewerMatcher[] = [
  BreadcrumbViewer.matcher,
]

export const decorators = []
