import { RoadshowViewElement } from '@hydrofoil/roadshow/roadshow-view'
import CanvasShellBase from './canvas-shell/CanvasShellBase'

customElements.define('app-view', class extends CanvasShellBase(RoadshowViewElement) {})
