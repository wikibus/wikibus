import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import CanvasShellBase from './CanvasShellBase'
import { Facebook, GitHub, Linkedin, Pinterest, Twitter, Instagram } from '../icons'

@customElement('canvas-footer')
export class CanvasFooter extends CanvasShellBase(LitElement) {
  @property({ type: Number })
  public iconSize = 20

  public render() {
    return html`
      <footer id="footer" class="dark">
        <div id="copyrights">
          <div class="container clearfix">
            <div class="col_half">
              <img src="images/footer-logo.png" alt="" class="footer-logo" />

              Copyrights &copy; 2021 Some Rights Reserved.
            </div>

            <div class="col_half col_last tright">
              <div class="copyrights-menu copyright-links clearfix">
                <a href="/">Home</a>/<a href="#">About</a>
              </div>
              <div class="fright clearfix">
                <a
                  href="https://www.facebook.com/wikibus"
                  class="social-icon si-small si-borderless nobottommargin si-facebook"
                >
                  ${Facebook(this.iconSize)}
                </a>

                <a
                  href="https://twitter.com/WikibusOrg"
                  class="social-icon si-small si-borderless nobottommargin si-twitter"
                >
                  ${Twitter(this.iconSize)}
                </a>

                <a
                  href="https://instagram.com/wikibusorg/"
                  class="social-icon si-small si-borderless nobottommargin si-instagram"
                >
                  ${Instagram(this.iconSize)}
                </a>

                <a
                  href="https://pinterest.com/wikibus/"
                  class="social-icon si-small si-borderless nobottommargin si-pinterest"
                >
                  ${Pinterest}
                </a>

                <a
                  href="https://github.com/wikibus/www.wikibus.org"
                  class="social-icon si-small si-borderless nobottommargin si-github"
                >
                  ${GitHub(this.iconSize)}
                </a>

                <a
                  href="https://www.linkedin.com/in/tpluskiewicz/"
                  class="social-icon si-small si-borderless nobottommargin si-linkedin"
                >
                  ${Linkedin(this.iconSize)}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    `
  }
}
