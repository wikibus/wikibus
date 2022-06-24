import { Decorator, Renderer, ViewerMatcher } from '@hydrofoil/roadshow'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js'
import { ViewersController } from '@hydrofoil/roadshow/ViewersController'
import { hex } from '@hydrofoil/vocabularies/builders'
import { dash, rdf } from '@tpluscode/rdf-ns-builders'
import * as DetailsViewer from './main/DetailsViewer'
import * as HTMLViewer from './main/HTMLViewer'
import * as BreadcrumbViewer from './main/BreadcrumbViewer'
import * as BreadcrumbItemViewer from './main/BreadcrumbItemViewer'
import * as FeaturedBoxViewer from './main/FeaturedBoxViewer'
import * as OperationFormDialogViewer from './main/OperationFormDialogViewer'
import * as OperationFormInlineViewer from './main/OperationFormInlineViewer'
import * as ResponseLinkViewer from './main/ResponseLinkViewer'
import * as CommentsViewer from './main/CommentsViewer'
import * as ImageViewer from './main/ImageViewer'
import * as PortfolioGridViewer from './main/PortfolioGridViewer'

setBasePath('/app')

ViewersController.viewerMeta
  .node(hex.CollectionMembersViewer)
  .addOut(rdf.type, dash.MultiViewer)

export const renderers: Renderer<any>[] = [
  DetailsViewer.renderer,
  HTMLViewer.renderer,
  BreadcrumbViewer.renderer,
  BreadcrumbItemViewer.renderer,
  FeaturedBoxViewer.renderer,
  OperationFormDialogViewer.renderer,
  OperationFormInlineViewer.renderer,
  ResponseLinkViewer.renderer,
  CommentsViewer.renderer,
  ImageViewer.renderer,
  PortfolioGridViewer.renderer,
]

export const viewers: ViewerMatcher[] = [
  BreadcrumbViewer.matcher,
  ImageViewer.matcher,
]

export const decorators: Decorator[] = []
