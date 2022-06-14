import { Renderer } from '@hydrofoil/roadshow'
import { FocusNodeViewContext } from '@hydrofoil/roadshow/lib/ViewContext'
import { hex } from '@hydrofoil/vocabularies/builders'

export const renderer: Renderer<FocusNodeViewContext> = {
  viewer: hex.CommentsViewer,
  render() {
    return ''
  },
}
