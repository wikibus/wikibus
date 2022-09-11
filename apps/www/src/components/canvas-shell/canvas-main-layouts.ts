// eslint-disable-next-line max-classes-per-file
import { html, LitElement, TemplateResult } from 'lit'
import { customElement } from 'lit/decorators.js'
import CanvasShellBase from './CanvasShellBase'

@customElement('canvas-page-both-sidebars')
export class CanvasBothSidebars extends CanvasShellBase(LitElement) {
  render() {
    return renderWrappers(html`
      <div class="sidebar col-lg-3">
        <slot name="left"></slot>
      </div>
      <div class="postcontent bothsidebar col-lg-6">
        <slot></slot>
      </div>
      <div class="sidebar col-lg-3">
        <slot name="right"></slot>
      </div>`)
  }
}

@customElement('canvas-page-right-sidebar')
export class CanvasRightSidebar extends CanvasShellBase(LitElement) {
  render() {
    return renderWrappers(html`
      <div class="postcontent col-lg-9">
        <slot></slot>
      </div>
      <div class="sidebar col-lg-3">
        <div class="sidebar-widgets-wrap">
          <slot name="sidebar"></slot>
        </div>
      </div>`)
  }
}

@customElement('canvas-page-left-sidebar')
export class CanvasLeftSidebar extends CanvasShellBase(LitElement) {
  render() {
    return renderWrappers(html`
      <div class="sidebar col-lg-3">
        <div class="sidebar-widgets-wrap">
          <slot name="sidebar"></slot>
        </div>
      </div>
      <div class="postcontent col-lg-9 order-lg-last">
        <slot></slot>
      </div>
    `)
  }
}

function renderWrappers(content: TemplateResult) {
  return html`<section id="content">
      <div class="content-wrap">
        <div class="container clearfix">
          <div class="row gutter-40 col-mb-80">
            ${content}
          </div>
        </div>
      </div>
    </section>`
}
