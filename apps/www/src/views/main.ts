import { Decorator, Renderer, ViewerMatcher } from '@hydrofoil/roadshow'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js'
import { ViewersController } from '@hydrofoil/roadshow/ViewersController'
import { hex } from '@hydrofoil/vocabularies/builders'
import { rdf } from '@tpluscode/rdf-ns-builders'
import { dash } from '@tpluscode/rdf-ns-builders/loose'
import * as DetailsViewer from './main/DetailsViewer'
import * as HTMLViewer from './main/HTMLViewer'
import * as BreadcrumbViewer from './main/BreadcrumbViewer'
import * as BreadcrumbItemViewer from './main/BreadcrumbItemViewer'
import * as FeaturedBoxViewer from './main/FeaturedBoxViewer'
import * as OperationFormDialogViewer from './main/OperationFormDialogViewer'
import * as OperationFormInlineViewer from './main/OperationFormInlineViewer'
import * as SearchFormViewer from './main/SearchFormViewer'
import * as ResponseLinkViewer from './main/ResponseLinkViewer'
import * as CommentsViewer from './main/CommentsViewer'
import * as ImageViewer from './main/ImageViewer'
import * as PortfolioGridViewer from './main/PortfolioGridViewer'
import * as SidebarRelatedResourceViewer from './main/SidebarRelatedResourceViewer'
import * as SubMenuLink from './main/SubMenuLink'
import * as SingleLiteralViewer from './main/SingleLiteralViewer'
import * as IconListItem from './main/IconListItem'
import * as IframelyEmbed from './main/IframelyEmbed'
import * as AlphabeticallyPagedViewViewer from './main/AlphabeticallyPagedViewViewer'
import { canvas } from '../lib/ns'
import { wrapperDecorator } from './decorators/wrapper'
import { extractRootResourceTitle } from './decorators/extractRootResourceTitle'
import { socialPostingDecorator } from './decorators/socialPostingDecorator'
import { sidebarWidget } from './decorators/sidebarWidget'

setBasePath('/app')

ViewersController.viewerMeta
  .node(hex.CollectionMembersViewer)
  .addOut(rdf.type, dash.MultiViewer)
  .node(canvas.SidebarRelatedResourceViewer)
  .addOut(rdf.type, dash.MultiViewer)
  .node(dash.SingleLiteralViewer)
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
  SidebarRelatedResourceViewer.renderer,
  SearchFormViewer.renderer,
  SubMenuLink.renderer,
  SingleLiteralViewer.renderer,
  IconListItem.renderer,
  IframelyEmbed.renderer,
  AlphabeticallyPagedViewViewer.renderer,
]

export const viewers: ViewerMatcher[] = [
  BreadcrumbViewer.matcher,
  ImageViewer.matcher,
]

export const decorators: Decorator[] = [
  wrapperDecorator,
  extractRootResourceTitle,
  socialPostingDecorator,
  sidebarWidget,
]
