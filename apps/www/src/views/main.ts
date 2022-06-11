import { Renderer, ViewerMatcher } from '@hydrofoil/roadshow'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js'
import * as DetailsViewer from './main/DetailsViewer'
import * as HTMLViewer from './main/HTMLViewer'
import * as BreadcrumbViewer from './main/BreadcrumbViewer'
import * as BreadcrumbItemViewer from './main/BreadcrumbItemViewer'
import * as FeaturedBoxViewer from './main/FeaturedBoxViewer'
import * as OperationFormDialogViewer from './main/OperationFormDialogViewer'
import * as OperationFormInlineViewer from './main/OperationFormInlineViewer'
import * as ResponseLinkViewer from './main/ResponseLinkViewer'

setBasePath('/app')

export const renderers: Renderer<any>[] = [
  DetailsViewer.renderer,
  HTMLViewer.renderer,
  BreadcrumbViewer.renderer,
  BreadcrumbItemViewer.renderer,
  FeaturedBoxViewer.renderer,
  OperationFormDialogViewer.renderer,
  OperationFormInlineViewer.renderer,
  ResponseLinkViewer.renderer,
]

export const viewers: ViewerMatcher[] = [
  BreadcrumbViewer.matcher,
]

export const decorators = []
