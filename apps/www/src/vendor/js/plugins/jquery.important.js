/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing.jswing = jQuery.easing.swing

jQuery.extend(jQuery.easing,
  {
    def: 'easeOutQuad',
    swing(x, t, b, c, d) {
      // alert(jQuery.easing.default);
      return jQuery.easing[jQuery.easing.def](x, t, b, c, d)
    },
    easeInQuad(x, t, b, c, d) {
      return c * (t /= d) * t + b
    },
    easeOutQuad(x, t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b
    },
    easeInOutQuad(x, t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t + b
      return -c / 2 * ((--t) * (t - 2) - 1) + b
    },
    easeInCubic(x, t, b, c, d) {
      return c * (t /= d) * t * t + b
    },
    easeOutCubic(x, t, b, c, d) {
      return c * ((t = t / d - 1) * t * t + 1) + b
    },
    easeInOutCubic(x, t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t + b
      return c / 2 * ((t -= 2) * t * t + 2) + b
    },
    easeInQuart(x, t, b, c, d) {
      return c * (t /= d) * t * t * t + b
    },
    easeOutQuart(x, t, b, c, d) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b
    },
    easeInOutQuart(x, t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b
      return -c / 2 * ((t -= 2) * t * t * t - 2) + b
    },
    easeInQuint(x, t, b, c, d) {
      return c * (t /= d) * t * t * t * t + b
    },
    easeOutQuint(x, t, b, c, d) {
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b
    },
    easeInOutQuint(x, t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b
      return c / 2 * ((t -= 2) * t * t * t * t + 2) + b
    },
    easeInSine(x, t, b, c, d) {
      return -c * Math.cos(t / d * (Math.PI / 2)) + c + b
    },
    easeOutSine(x, t, b, c, d) {
      return c * Math.sin(t / d * (Math.PI / 2)) + b
    },
    easeInOutSine(x, t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
    },
    easeInExpo(x, t, b, c, d) {
      return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
    },
    easeOutExpo(x, t, b, c, d) {
      return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b
    },
    easeInOutExpo(x, t, b, c, d) {
      if (t == 0) return b
      if (t == d) return b + c
      if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b
      return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b
    },
    easeInCirc(x, t, b, c, d) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
    },
    easeOutCirc(x, t, b, c, d) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
    },
    easeInOutCirc(x, t, b, c, d) {
      if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b
      return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
    },
    easeInElastic(x, t, b, c, d) {
      var s = 1.70158; let p = 0; let a = c
      if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * 0.3
      if (a < Math.abs(c)) { a = c; var s = p / 4 } else var s = p / (2 * Math.PI) * Math.asin(c / a)
      return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b
    },
    easeOutElastic(x, t, b, c, d) {
      var s = 1.70158; let p = 0; let a = c
      if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * 0.3
      if (a < Math.abs(c)) { a = c; var s = p / 4 } else var s = p / (2 * Math.PI) * Math.asin(c / a)
      return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b
    },
    easeInOutElastic(x, t, b, c, d) {
      var s = 1.70158; let p = 0; let a = c
      if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (0.3 * 1.5)
      if (a < Math.abs(c)) { a = c; var s = p / 4 } else var s = p / (2 * Math.PI) * Math.asin(c / a)
      if (t < 1) return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b
      return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b
    },
    easeInBack(x, t, b, c, d, s) {
      if (s == undefined) s = 1.70158
      return c * (t /= d) * t * ((s + 1) * t - s) + b
    },
    easeOutBack(x, t, b, c, d, s) {
      if (s == undefined) s = 1.70158
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
    },
    easeInOutBack(x, t, b, c, d, s) {
      if (s == undefined) s = 1.70158
      if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b
      return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b
    },
    easeInBounce(x, t, b, c, d) {
      return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b
    },
    easeOutBounce(x, t, b, c, d) {
      if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b
      } if (t < (2 / 2.75)) {
        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b
      } if (t < (2.5 / 2.75)) {
        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b
      }
      return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b
    },
    easeInOutBounce(x, t, b, c, d) {
      if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * 0.5 + b
      return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
    },
  })

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

!(function (t, e) { typeof define === 'function' && define.amd ? define(['jquery'], e) : typeof exports === 'object' ? module.exports = e(require('jquery')) : e(t.jQuery) }(this, (t) => { function e(t) { if (t in p.style) return t; for (let e = ['Moz', 'Webkit', 'O', 'ms'], n = t.charAt(0).toUpperCase() + t.substr(1), i = 0; i < e.length; ++i) { const r = e[i] + n; if (r in p.style) return r } } function n() { return p.style[d.transform] = '', p.style[d.transform] = 'rotateY(90deg)', p.style[d.transform] !== '' } function i(t) { return typeof t === 'string' && this.parse(t), this } function r(t, e, n) { e === !0 ? t.queue(n) : e ? t.queue(e, n) : t.each(function () { n.call(this) }) } function s(e) { const n = []; return t.each(e, (e) => { e = t.camelCase(e), e = t.transit.propertyMap[e] || t.cssProps[e] || e, e = u(e), d[e] && (e = u(d[e])), t.inArray(e, n) === -1 && n.push(e) }), n } function a(e, n, i, r) { const a = s(e); t.cssEase[i] && (i = t.cssEase[i]); let o = `${f(n)} ${i}`; parseInt(r, 10) > 0 && (o += ` ${f(r)}`); const u = []; return t.each(a, (t, e) => { u.push(`${e} ${o}`) }), u.join(', ') } function o(e, n) { n || (t.cssNumber[e] = !0), t.transit.propertyMap[e] = d.transform, t.cssHooks[e] = { get(n) { const i = t(n).css('transit:transform'); return i.get(e) }, set(n, i) { const r = t(n).css('transit:transform'); r.setFromString(e, i), t(n).css({ 'transit:transform': r }) } } } function u(t) { return t.replace(/([A-Z])/g, (t) => `-${t.toLowerCase()}`) } function c(t, e) { return typeof t !== 'string' || t.match(/^[\-0-9\.]+$/) ? `${t}${e}` : t } function f(e) { let n = e; return typeof n !== 'string' || n.match(/^[\-0-9\.]+/) || (n = t.fx.speeds[n] || t.fx.speeds._default), c(n, 'ms') }t.transit = { version: '0.9.12', propertyMap: { marginLeft: 'margin', marginRight: 'margin', marginBottom: 'margin', marginTop: 'margin', paddingLeft: 'padding', paddingRight: 'padding', paddingBottom: 'padding', paddingTop: 'padding' }, enabled: !0, useTransitionEnd: !1 }; var p = document.createElement('div'); var d = {}; const l = navigator.userAgent.toLowerCase().indexOf('chrome') > -1; d.transition = e('transition'), d.transitionDelay = e('transitionDelay'), d.transform = e('transform'), d.transformOrigin = e('transformOrigin'), d.filter = e('Filter'), d.transform3d = n(); const h = { transition: 'transitionend', MozTransition: 'transitionend', OTransition: 'oTransitionEnd', WebkitTransition: 'webkitTransitionEnd', msTransition: 'MSTransitionEnd' }; const b = d.transitionEnd = h[d.transition] || null; for (const y in d)d.hasOwnProperty(y) && typeof t.support[y] === 'undefined' && (t.support[y] = d[y]); return p = null, t.cssEase = { _default: 'ease', in: 'ease-in', out: 'ease-out', 'in-out': 'ease-in-out', snap: 'cubic-bezier(0,1,.5,1)', easeInCubic: 'cubic-bezier(.550,.055,.675,.190)', easeOutCubic: 'cubic-bezier(.215,.61,.355,1)', easeInOutCubic: 'cubic-bezier(.645,.045,.355,1)', easeInCirc: 'cubic-bezier(.6,.04,.98,.335)', easeOutCirc: 'cubic-bezier(.075,.82,.165,1)', easeInOutCirc: 'cubic-bezier(.785,.135,.15,.86)', easeInExpo: 'cubic-bezier(.95,.05,.795,.035)', easeOutExpo: 'cubic-bezier(.19,1,.22,1)', easeInOutExpo: 'cubic-bezier(1,0,0,1)', easeInQuad: 'cubic-bezier(.55,.085,.68,.53)', easeOutQuad: 'cubic-bezier(.25,.46,.45,.94)', easeInOutQuad: 'cubic-bezier(.455,.03,.515,.955)', easeInQuart: 'cubic-bezier(.895,.03,.685,.22)', easeOutQuart: 'cubic-bezier(.165,.84,.44,1)', easeInOutQuart: 'cubic-bezier(.77,0,.175,1)', easeInQuint: 'cubic-bezier(.755,.05,.855,.06)', easeOutQuint: 'cubic-bezier(.23,1,.32,1)', easeInOutQuint: 'cubic-bezier(.86,0,.07,1)', easeInSine: 'cubic-bezier(.47,0,.745,.715)', easeOutSine: 'cubic-bezier(.39,.575,.565,1)', easeInOutSine: 'cubic-bezier(.445,.05,.55,.95)', easeInBack: 'cubic-bezier(.6,-.28,.735,.045)', easeOutBack: 'cubic-bezier(.175, .885,.32,1.275)', easeInOutBack: 'cubic-bezier(.68,-.55,.265,1.55)' }, t.cssHooks['transit:transform'] = { get(e) { return t(e).data('transform') || new i() }, set(e, n) { let r = n; r instanceof i || (r = new i(r)), e.style[d.transform] = d.transform !== 'WebkitTransform' || l ? r.toString() : r.toString(!0), t(e).data('transform', r) } }, t.cssHooks.transform = { set: t.cssHooks['transit:transform'].set }, t.cssHooks.filter = { get(t) { return t.style[d.filter] }, set(t, e) { t.style[d.filter] = e } }, t.fn.jquery < '1.8' && (t.cssHooks.transformOrigin = { get(t) { return t.style[d.transformOrigin] }, set(t, e) { t.style[d.transformOrigin] = e } }, t.cssHooks.transition = { get(t) { return t.style[d.transition] }, set(t, e) { t.style[d.transition] = e } }), o('scale'), o('scaleX'), o('scaleY'), o('translate'), o('rotate'), o('rotateX'), o('rotateY'), o('rotate3d'), o('perspective'), o('skewX'), o('skewY'), o('x', !0), o('y', !0), i.prototype = { setFromString(t, e) { const n = typeof e === 'string' ? e.split(',') : e.constructor === Array ? e : [e]; n.unshift(t), i.prototype.set.apply(this, n) }, set(t) { const e = Array.prototype.slice.apply(arguments, [1]); this.setter[t] ? this.setter[t].apply(this, e) : this[t] = e.join(',') }, get(t) { return this.getter[t] ? this.getter[t].apply(this) : this[t] || 0 }, setter: { rotate(t) { this.rotate = c(t, 'deg') }, rotateX(t) { this.rotateX = c(t, 'deg') }, rotateY(t) { this.rotateY = c(t, 'deg') }, scale(t, e) { void 0 === e && (e = t), this.scale = `${t},${e}` }, skewX(t) { this.skewX = c(t, 'deg') }, skewY(t) { this.skewY = c(t, 'deg') }, perspective(t) { this.perspective = c(t, 'px') }, x(t) { this.set('translate', t, null) }, y(t) { this.set('translate', null, t) }, translate(t, e) { void 0 === this._translateX && (this._translateX = 0), void 0 === this._translateY && (this._translateY = 0), t !== null && void 0 !== t && (this._translateX = c(t, 'px')), e !== null && void 0 !== e && (this._translateY = c(e, 'px')), this.translate = `${this._translateX},${this._translateY}` } }, getter: { x() { return this._translateX || 0 }, y() { return this._translateY || 0 }, scale() { const t = (this.scale || '1,1').split(','); return t[0] && (t[0] = parseFloat(t[0])), t[1] && (t[1] = parseFloat(t[1])), t[0] === t[1] ? t[0] : t }, rotate3d() { for (var t = (this.rotate3d || '0,0,0,0deg').split(','), e = 0; e <= 3; ++e)t[e] && (t[e] = parseFloat(t[e])); return t[3] && (t[3] = c(t[3], 'deg')), t } }, parse(t) { const e = this; t.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, (t, n, i) => { e.setFromString(n, i) }) }, toString(t) { const e = []; for (const n in this) if (this.hasOwnProperty(n)) { if (!d.transform3d && (n === 'rotateX' || n === 'rotateY' || n === 'perspective' || n === 'transformOrigin')) continue; n[0] !== '_' && e.push(t && n === 'scale' ? `${n}3d(${this[n]},1)` : t && n === 'translate' ? `${n}3d(${this[n]},0)` : `${n}(${this[n]})`) } return e.join(' ') } }, t.fn.transition = t.fn.transit = function (e, n, i, s) { const o = this; let u = 0; let c = !0; const p = t.extend(!0, {}, e); typeof n === 'function' && (s = n, n = void 0), typeof n === 'object' && (i = n.easing, u = n.delay || 0, c = typeof n.queue === 'undefined' ? !0 : n.queue, s = n.complete, n = n.duration), typeof i === 'function' && (s = i, i = void 0), typeof p.easing !== 'undefined' && (i = p.easing, delete p.easing), typeof p.duration !== 'undefined' && (n = p.duration, delete p.duration), typeof p.complete !== 'undefined' && (s = p.complete, delete p.complete), typeof p.queue !== 'undefined' && (c = p.queue, delete p.queue), typeof p.delay !== 'undefined' && (u = p.delay, delete p.delay), typeof n === 'undefined' && (n = t.fx.speeds._default), typeof i === 'undefined' && (i = t.cssEase._default), n = f(n); const l = a(p, n, i, u); const h = t.transit.enabled && d.transition; const y = h ? parseInt(n, 10) + parseInt(u, 10) : 0; if (y === 0) { const g = function (t) { o.css(p), s && s.apply(o), t && t() }; return r(o, c, g), o } const m = {}; const v = function (e) { let n = !1; var i = function () { n && o.unbind(b, i), y > 0 && o.each(function () { this.style[d.transition] = m[this] || null }), typeof s === 'function' && s.apply(o), typeof e === 'function' && e() }; y > 0 && b && t.transit.useTransitionEnd ? (n = !0, o.bind(b, i)) : window.setTimeout(i, y), o.each(function () { y > 0 && (this.style[d.transition] = l), t(this).css(p) }) }; const z = function (t) { this.offsetWidth, v(t) }; return r(o, c, z), this }, t.transit.getTransitionValue = a, t }))

// SmoothScroll v0.9.9
// Licensed under the terms of the MIT license.

// People involved
// - Balazs Galambosi: maintainer (CHANGELOG.txt)
// - Patrick Brunner (patrickb1991@gmail.com)
// - Michael Herf: ssc_pulse Algorithm
if (navigator.platform.toUpperCase().indexOf('MAC') === -1 && !navigator.userAgent.match(/(Android|iPod|iPhone|iPad|IEMobile|Opera Mini|BlackBerry)/) && jQuery(window).width() > 991 && !jQuery('body').hasClass('no-smooth-scroll')) {
  function ssc_init() { if (!document.body) return; const e = document.body; const t = document.documentElement; const n = window.innerHeight; const r = e.scrollHeight; ssc_root = document.compatMode.indexOf('CSS') >= 0 ? t : e; ssc_activeElement = e; ssc_initdone = true; if (top != self) { ssc_frame = true } else if (r > n && (e.offsetHeight <= n || t.offsetHeight <= n)) { ssc_root.style.height = 'auto'; if (ssc_root.offsetHeight <= n) { const i = document.createElement('div'); i.style.clear = 'both'; e.appendChild(i) } } if (!ssc_fixedback) { e.style.backgroundAttachment = 'scroll'; t.style.backgroundAttachment = 'scroll' } if (ssc_keyboardsupport) { ssc_addEvent('keydown', ssc_keydown) } } function ssc_scrollArray(e, t, n, r) { r || (r = 1e3); ssc_directionCheck(t, n); ssc_que.push({ x: t, y: n, lastX: t < 0 ? 0.99 : -0.99, lastY: n < 0 ? 0.99 : -0.99, start: +(new Date()) }); if (ssc_pending) { return } var i = function () { const s = +(new Date()); let o = 0; let u = 0; for (let a = 0; a < ssc_que.length; a++) { const f = ssc_que[a]; const l = s - f.start; const c = l >= ssc_animtime; let h = c ? 1 : l / ssc_animtime; if (ssc_pulseAlgorithm) { h = ssc_pulse(h) } const p = f.x * h - f.lastX >> 0; const d = f.y * h - f.lastY >> 0; o += p; u += d; f.lastX += p; f.lastY += d; if (c) { ssc_que.splice(a, 1); a-- } } if (t) { const v = e.scrollLeft; e.scrollLeft += o; if (o && e.scrollLeft === v) { t = 0 } } if (n) { const m = e.scrollTop; e.scrollTop += u; if (u && e.scrollTop === m) { n = 0 } } if (!t && !n) { ssc_que = [] } if (ssc_que.length) { setTimeout(i, r / ssc_framerate + 1) } else { ssc_pending = false } }; setTimeout(i, 0); ssc_pending = true } function ssc_wheel(e) { if (!ssc_initdone) { ssc_init() } const t = e.target; const n = ssc_overflowingAncestor(t); if (!n || e.defaultPrevented || ssc_isNodeName(ssc_activeElement, 'embed') || ssc_isNodeName(t, 'embed') && /\.pdf/i.test(t.src)) { return true } let r = e.wheelDeltaX || 0; let i = e.wheelDeltaY || 0; if (!r && !i) { i = e.wheelDelta || 0 } if (Math.abs(r) > 1.2) { r *= ssc_stepsize / 120 } if (Math.abs(i) > 1.2) { i *= ssc_stepsize / 120 }ssc_scrollArray(n, -r, -i); e.preventDefault() } function ssc_keydown(e) { const t = e.target; const n = e.ctrlKey || e.altKey || e.metaKey; if (/input|textarea|embed/i.test(t.nodeName) || t.isContentEditable || e.defaultPrevented || n) { return true } if (ssc_isNodeName(t, 'button') && e.keyCode === ssc_key.spacebar) { return true } let r; let i = 0; let s = 0; const o = ssc_overflowingAncestor(ssc_activeElement); let u = o.clientHeight; if (o == document.body) { u = window.innerHeight } switch (e.keyCode) { case ssc_key.up:s = -ssc_arrowscroll; break; case ssc_key.down:s = ssc_arrowscroll; break; case ssc_key.spacebar:r = e.shiftKey ? 1 : -1; s = -r * u * 0.9; break; case ssc_key.pageup:s = -u * 0.9; break; case ssc_key.pagedown:s = u * 0.9; break; case ssc_key.home:s = -o.scrollTop; break; case ssc_key.end:var a = o.scrollHeight - o.scrollTop - u; s = a > 0 ? a + 10 : 0; break; case ssc_key.left:i = -ssc_arrowscroll; break; case ssc_key.right:i = ssc_arrowscroll; break; default:return true }ssc_scrollArray(o, i, s); e.preventDefault() } function ssc_mousedown(e) { ssc_activeElement = e.target } function ssc_setCache(e, t) { for (let n = e.length; n--;)ssc_cache[ssc_uniqueID(e[n])] = t; return t } function ssc_overflowingAncestor(e) { const t = []; const n = ssc_root.scrollHeight; do { const r = ssc_cache[ssc_uniqueID(e)]; if (r) { return ssc_setCache(t, r) }t.push(e); if (n === e.scrollHeight) { if (!ssc_frame || ssc_root.clientHeight + 10 < n) { return ssc_setCache(t, document.body) } } else if (e.clientHeight + 10 < e.scrollHeight) { overflow = getComputedStyle(e, '').getPropertyValue('overflow'); if (overflow === 'scroll' || overflow === 'auto') { return ssc_setCache(t, e) } } } while (e = e.parentNode) } function ssc_addEvent(e, t, n) { window.addEventListener(e, t, n || false) } function ssc_removeEvent(e, t, n) { window.removeEventListener(e, t, n || false) } function ssc_isNodeName(e, t) { return e.nodeName.toLowerCase() === t.toLowerCase() } function ssc_directionCheck(e, t) { e = e > 0 ? 1 : -1; t = t > 0 ? 1 : -1; if (ssc_direction.x !== e || ssc_direction.y !== t) { ssc_direction.x = e; ssc_direction.y = t; ssc_que = [] } } function ssc_pulse_(e) { let t, n, r; e *= ssc_pulseScale; if (e < 1) { t = e - (1 - Math.exp(-e)) } else { n = Math.exp(-1); e -= 1; r = 1 - Math.exp(-e); t = n + r * (1 - n) } return t * ssc_pulseNormalize } function ssc_pulse(e) { if (e >= 1) return 1; if (e <= 0) return 0; if (ssc_pulseNormalize == 1) { ssc_pulseNormalize /= ssc_pulse_(1) } return ssc_pulse_(e) } var ssc_framerate = 150; var ssc_animtime = 500; var ssc_stepsize = 150; var ssc_pulseAlgorithm = true; var ssc_pulseScale = 6; var ssc_pulseNormalize = 1; var ssc_keyboardsupport = true; var ssc_arrowscroll = 50; var ssc_frame = false; var ssc_direction = { x: 0, y: 0 }; var ssc_initdone = false; var ssc_fixedback = true; var ssc_root = document.documentElement; let ssc_activeElement; var ssc_key = { left: 37, up: 38, right: 39, down: 40, spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36 }; var ssc_que = []; var ssc_pending = false; var ssc_cache = {}; setInterval(() => { ssc_cache = {} }, 10 * 1e3); var ssc_uniqueID = (function () { let e = 0; return function (t) { return t.ssc_uniqueID || (t.ssc_uniqueID = e++) } }()); const ischrome = /chrome/.test(navigator.userAgent.toLowerCase()); if (ischrome) { ssc_addEvent('mousedown', ssc_mousedown); ssc_addEvent('mousewheel', ssc_wheel); ssc_addEvent('load', ssc_init) }
}

!(function (t) { let o = 0; t.fn.scrolled = function (a, n) { typeof a === 'function' && (n = a, a = 300); const c = `scrollTimer${o++}`; this.scroll(function () { const o = t(this); let e = o.data(c); e && clearTimeout(e), e = setTimeout(() => { o.removeData(c), n.call(o[0]) }, a), o.data(c, e) }) } }(jQuery));

/*
 * jQuery.appear
 * https://github.com/bas2k/jquery.appear/
 * http://code.google.com/p/jquery-appear/
 *
 * Copyright (c) 2009 Michael Hixson
 * Copyright (c) 2012 Alexander Brovikov
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 */
(function (e) { e.fn.appear = function (t, n) { const r = e.extend({ data: undefined, one: true, accX: 0, accY: 0 }, n); return this.each(function () { const n = e(this); n.appeared = false; if (!t) { n.trigger('appear', r.data); return } const i = e(window); const s = function () { if (!n.is(':visible')) { n.appeared = false; return } const e = i.scrollLeft(); const t = i.scrollTop(); const s = n.offset(); const o = s.left; const u = s.top; const a = r.accX; const f = r.accY; const l = n.height(); const c = i.height(); const h = n.width(); const p = i.width(); if (u + l + f >= t && u <= t + c + f && o + h + a >= e && o <= e + p + a) { if (!n.appeared)n.trigger('appear', r.data) } else { n.appeared = false } }; const o = function () { n.appeared = true; if (r.one) { i.unbind('scroll', s); const o = e.inArray(s, e.fn.appear.checks); if (o >= 0)e.fn.appear.checks.splice(o, 1) }t.apply(this, arguments) }; if (r.one)n.one('appear', r.data, o); else n.bind('appear', r.data, o); i.scroll(s); e.fn.appear.checks.push(s); s() }) }; e.extend(e.fn.appear, { checks: [], timeout: null, checkAll() { let t = e.fn.appear.checks.length; if (t > 0) while (t--)e.fn.appear.checks[t]() }, run() { if (e.fn.appear.timeout)clearTimeout(e.fn.appear.timeout); e.fn.appear.timeout = setTimeout(e.fn.appear.checkAll, 20) } }); e.each(['append', 'prepend', 'after', 'before', 'attr', 'removeAttr', 'addClass', 'removeClass', 'toggleClass', 'remove', 'css', 'show', 'hide'], (t, n) => { const r = e.fn[n]; if (r) { e.fn[n] = function () { const t = r.apply(this, arguments); e.fn.appear.run(); return t } } }) })(jQuery)
