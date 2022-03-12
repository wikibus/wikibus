/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/
!(function (t) {
  t.fn.fitVids = function (e) { const i = { customSelector: null, ignore: null }; if (!document.getElementById('fit-vids-style')) { const r = document.head || document.getElementsByTagName('head')[0]; const a = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}'; const d = document.createElement('div'); d.innerHTML = `<p>x</p><style id="fit-vids-style">${a}</style>`, r.appendChild(d.childNodes[1]) } return e && t.extend(i, e), this.each(function () { const e = ['iframe[src*="player.vimeo.com"]', 'iframe[src*="youtube.com"]', 'iframe[src*="youtube-nocookie.com"]', 'iframe[src*="kickstarter.com"][src*="video.html"]', 'object', 'embed']; i.customSelector && e.push(i.customSelector); let r = '.fitvidsignore'; i.ignore && (r = `${r}, ${i.ignore}`); let a = t(this).find(e.join(',')); a = a.not('object object'), a = a.not(r), a.each(function (e) { const i = t(this); if (!(i.parents(r).length > 0 || this.tagName.toLowerCase() === 'embed' && i.parent('object').length || i.parent('.fluid-width-video-wrapper').length)) { i.css('height') || i.css('width') || !isNaN(i.attr('height')) && !isNaN(i.attr('width')) || (i.attr('height', 9), i.attr('width', 16)); const a = this.tagName.toLowerCase() === 'object' || i.attr('height') && !isNaN(parseInt(i.attr('height'), 10)) ? parseInt(i.attr('height'), 10) : i.height(); const d = isNaN(parseInt(i.attr('width'), 10)) ? i.width() : parseInt(i.attr('width'), 10); const o = a / d; if (!i.attr('id')) { const h = `fitvid${e}`; i.attr('id', h) }i.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', `${100 * o}%`), i.removeAttr('height').removeAttr('width') } }) }) }
}(window.jQuery || window.Zepto))
