var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/preact/dist/preact.module.js
function w(n3, l5) {
  for (var u5 in l5) n3[u5] = l5[u5];
  return n3;
}
function g(n3) {
  n3 && n3.parentNode && n3.parentNode.removeChild(n3);
}
function _(l5, u5, t4) {
  var i4, o4, r4, e4 = {};
  for (r4 in u5) "key" == r4 ? i4 = u5[r4] : "ref" == r4 ? o4 = u5[r4] : e4[r4] = u5[r4];
  if (arguments.length > 2 && (e4.children = arguments.length > 3 ? n.call(arguments, 2) : t4), "function" == typeof l5 && null != l5.defaultProps) for (r4 in l5.defaultProps) void 0 === e4[r4] && (e4[r4] = l5.defaultProps[r4]);
  return m(l5, e4, i4, o4, null);
}
function m(n3, t4, i4, o4, r4) {
  var e4 = { type: n3, props: t4, key: i4, ref: o4, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == r4 ? ++u : r4, __i: -1, __u: 0 };
  return null == r4 && null != l.vnode && l.vnode(e4), e4;
}
function k(n3) {
  return n3.children;
}
function x(n3, l5) {
  this.props = n3, this.context = l5;
}
function S(n3, l5) {
  if (null == l5) return n3.__ ? S(n3.__, n3.__i + 1) : null;
  for (var u5; l5 < n3.__k.length; l5++) if (null != (u5 = n3.__k[l5]) && null != u5.__e) return u5.__e;
  return "function" == typeof n3.type ? S(n3) : null;
}
function C(n3) {
  var l5, u5;
  if (null != (n3 = n3.__) && null != n3.__c) {
    for (n3.__e = n3.__c.base = null, l5 = 0; l5 < n3.__k.length; l5++) if (null != (u5 = n3.__k[l5]) && null != u5.__e) {
      n3.__e = n3.__c.base = u5.__e;
      break;
    }
    return C(n3);
  }
}
function M(n3) {
  (!n3.__d && (n3.__d = true) && i.push(n3) && !$.__r++ || o != l.debounceRendering) && ((o = l.debounceRendering) || r)($);
}
function $() {
  for (var n3, u5, t4, o4, r4, f5, c4, s4 = 1; i.length; ) i.length > s4 && i.sort(e), n3 = i.shift(), s4 = i.length, n3.__d && (t4 = void 0, o4 = void 0, r4 = (o4 = (u5 = n3).__v).__e, f5 = [], c4 = [], u5.__P && ((t4 = w({}, o4)).__v = o4.__v + 1, l.vnode && l.vnode(t4), O(u5.__P, t4, o4, u5.__n, u5.__P.namespaceURI, 32 & o4.__u ? [r4] : null, f5, null == r4 ? S(o4) : r4, !!(32 & o4.__u), c4), t4.__v = o4.__v, t4.__.__k[t4.__i] = t4, N(f5, t4, c4), o4.__e = o4.__ = null, t4.__e != r4 && C(t4)));
  $.__r = 0;
}
function I(n3, l5, u5, t4, i4, o4, r4, e4, f5, c4, s4) {
  var a4, h5, y5, d5, w5, g4, _4, m5 = t4 && t4.__k || v, b3 = l5.length;
  for (f5 = P(u5, l5, m5, f5, b3), a4 = 0; a4 < b3; a4++) null != (y5 = u5.__k[a4]) && (h5 = -1 == y5.__i ? p : m5[y5.__i] || p, y5.__i = a4, g4 = O(n3, y5, h5, i4, o4, r4, e4, f5, c4, s4), d5 = y5.__e, y5.ref && h5.ref != y5.ref && (h5.ref && B(h5.ref, null, y5), s4.push(y5.ref, y5.__c || d5, y5)), null == w5 && null != d5 && (w5 = d5), (_4 = !!(4 & y5.__u)) || h5.__k === y5.__k ? f5 = A(y5, f5, n3, _4) : "function" == typeof y5.type && void 0 !== g4 ? f5 = g4 : d5 && (f5 = d5.nextSibling), y5.__u &= -7);
  return u5.__e = w5, f5;
}
function P(n3, l5, u5, t4, i4) {
  var o4, r4, e4, f5, c4, s4 = u5.length, a4 = s4, h5 = 0;
  for (n3.__k = new Array(i4), o4 = 0; o4 < i4; o4++) null != (r4 = l5[o4]) && "boolean" != typeof r4 && "function" != typeof r4 ? ("string" == typeof r4 || "number" == typeof r4 || "bigint" == typeof r4 || r4.constructor == String ? r4 = n3.__k[o4] = m(null, r4, null, null, null) : d(r4) ? r4 = n3.__k[o4] = m(k, { children: r4 }, null, null, null) : void 0 === r4.constructor && r4.__b > 0 ? r4 = n3.__k[o4] = m(r4.type, r4.props, r4.key, r4.ref ? r4.ref : null, r4.__v) : n3.__k[o4] = r4, f5 = o4 + h5, r4.__ = n3, r4.__b = n3.__b + 1, e4 = null, -1 != (c4 = r4.__i = L(r4, u5, f5, a4)) && (a4--, (e4 = u5[c4]) && (e4.__u |= 2)), null == e4 || null == e4.__v ? (-1 == c4 && (i4 > s4 ? h5-- : i4 < s4 && h5++), "function" != typeof r4.type && (r4.__u |= 4)) : c4 != f5 && (c4 == f5 - 1 ? h5-- : c4 == f5 + 1 ? h5++ : (c4 > f5 ? h5-- : h5++, r4.__u |= 4))) : n3.__k[o4] = null;
  if (a4) for (o4 = 0; o4 < s4; o4++) null != (e4 = u5[o4]) && 0 == (2 & e4.__u) && (e4.__e == t4 && (t4 = S(e4)), D(e4, e4));
  return t4;
}
function A(n3, l5, u5, t4) {
  var i4, o4;
  if ("function" == typeof n3.type) {
    for (i4 = n3.__k, o4 = 0; i4 && o4 < i4.length; o4++) i4[o4] && (i4[o4].__ = n3, l5 = A(i4[o4], l5, u5, t4));
    return l5;
  }
  n3.__e != l5 && (t4 && (l5 && n3.type && !l5.parentNode && (l5 = S(n3)), u5.insertBefore(n3.__e, l5 || null)), l5 = n3.__e);
  do {
    l5 = l5 && l5.nextSibling;
  } while (null != l5 && 8 == l5.nodeType);
  return l5;
}
function L(n3, l5, u5, t4) {
  var i4, o4, r4, e4 = n3.key, f5 = n3.type, c4 = l5[u5], s4 = null != c4 && 0 == (2 & c4.__u);
  if (null === c4 && null == e4 || s4 && e4 == c4.key && f5 == c4.type) return u5;
  if (t4 > (s4 ? 1 : 0)) {
    for (i4 = u5 - 1, o4 = u5 + 1; i4 >= 0 || o4 < l5.length; ) if (null != (c4 = l5[r4 = i4 >= 0 ? i4-- : o4++]) && 0 == (2 & c4.__u) && e4 == c4.key && f5 == c4.type) return r4;
  }
  return -1;
}
function T(n3, l5, u5) {
  "-" == l5[0] ? n3.setProperty(l5, null == u5 ? "" : u5) : n3[l5] = null == u5 ? "" : "number" != typeof u5 || y.test(l5) ? u5 : u5 + "px";
}
function j(n3, l5, u5, t4, i4) {
  var o4, r4;
  n: if ("style" == l5) if ("string" == typeof u5) n3.style.cssText = u5;
  else {
    if ("string" == typeof t4 && (n3.style.cssText = t4 = ""), t4) for (l5 in t4) u5 && l5 in u5 || T(n3.style, l5, "");
    if (u5) for (l5 in u5) t4 && u5[l5] == t4[l5] || T(n3.style, l5, u5[l5]);
  }
  else if ("o" == l5[0] && "n" == l5[1]) o4 = l5 != (l5 = l5.replace(f, "$1")), r4 = l5.toLowerCase(), l5 = r4 in n3 || "onFocusOut" == l5 || "onFocusIn" == l5 ? r4.slice(2) : l5.slice(2), n3.l || (n3.l = {}), n3.l[l5 + o4] = u5, u5 ? t4 ? u5.u = t4.u : (u5.u = c, n3.addEventListener(l5, o4 ? a : s, o4)) : n3.removeEventListener(l5, o4 ? a : s, o4);
  else {
    if ("http://www.w3.org/2000/svg" == i4) l5 = l5.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l5 && "height" != l5 && "href" != l5 && "list" != l5 && "form" != l5 && "tabIndex" != l5 && "download" != l5 && "rowSpan" != l5 && "colSpan" != l5 && "role" != l5 && "popover" != l5 && l5 in n3) try {
      n3[l5] = null == u5 ? "" : u5;
      break n;
    } catch (n4) {
    }
    "function" == typeof u5 || (null == u5 || false === u5 && "-" != l5[4] ? n3.removeAttribute(l5) : n3.setAttribute(l5, "popover" == l5 && 1 == u5 ? "" : u5));
  }
}
function F(n3) {
  return function(u5) {
    if (this.l) {
      var t4 = this.l[u5.type + n3];
      if (null == u5.t) u5.t = c++;
      else if (u5.t < t4.u) return;
      return t4(l.event ? l.event(u5) : u5);
    }
  };
}
function O(n3, u5, t4, i4, o4, r4, e4, f5, c4, s4) {
  var a4, h5, p5, v4, y5, _4, m5, b3, S3, C3, M2, $2, P2, A4, H, L2, T4, j3 = u5.type;
  if (void 0 !== u5.constructor) return null;
  128 & t4.__u && (c4 = !!(32 & t4.__u), r4 = [f5 = u5.__e = t4.__e]), (a4 = l.__b) && a4(u5);
  n: if ("function" == typeof j3) try {
    if (b3 = u5.props, S3 = "prototype" in j3 && j3.prototype.render, C3 = (a4 = j3.contextType) && i4[a4.__c], M2 = a4 ? C3 ? C3.props.value : a4.__ : i4, t4.__c ? m5 = (h5 = u5.__c = t4.__c).__ = h5.__E : (S3 ? u5.__c = h5 = new j3(b3, M2) : (u5.__c = h5 = new x(b3, M2), h5.constructor = j3, h5.render = E), C3 && C3.sub(h5), h5.state || (h5.state = {}), h5.__n = i4, p5 = h5.__d = true, h5.__h = [], h5._sb = []), S3 && null == h5.__s && (h5.__s = h5.state), S3 && null != j3.getDerivedStateFromProps && (h5.__s == h5.state && (h5.__s = w({}, h5.__s)), w(h5.__s, j3.getDerivedStateFromProps(b3, h5.__s))), v4 = h5.props, y5 = h5.state, h5.__v = u5, p5) S3 && null == j3.getDerivedStateFromProps && null != h5.componentWillMount && h5.componentWillMount(), S3 && null != h5.componentDidMount && h5.__h.push(h5.componentDidMount);
    else {
      if (S3 && null == j3.getDerivedStateFromProps && b3 !== v4 && null != h5.componentWillReceiveProps && h5.componentWillReceiveProps(b3, M2), u5.__v == t4.__v || !h5.__e && null != h5.shouldComponentUpdate && false === h5.shouldComponentUpdate(b3, h5.__s, M2)) {
        for (u5.__v != t4.__v && (h5.props = b3, h5.state = h5.__s, h5.__d = false), u5.__e = t4.__e, u5.__k = t4.__k, u5.__k.some(function(n4) {
          n4 && (n4.__ = u5);
        }), $2 = 0; $2 < h5._sb.length; $2++) h5.__h.push(h5._sb[$2]);
        h5._sb = [], h5.__h.length && e4.push(h5);
        break n;
      }
      null != h5.componentWillUpdate && h5.componentWillUpdate(b3, h5.__s, M2), S3 && null != h5.componentDidUpdate && h5.__h.push(function() {
        h5.componentDidUpdate(v4, y5, _4);
      });
    }
    if (h5.context = M2, h5.props = b3, h5.__P = n3, h5.__e = false, P2 = l.__r, A4 = 0, S3) {
      for (h5.state = h5.__s, h5.__d = false, P2 && P2(u5), a4 = h5.render(h5.props, h5.state, h5.context), H = 0; H < h5._sb.length; H++) h5.__h.push(h5._sb[H]);
      h5._sb = [];
    } else do {
      h5.__d = false, P2 && P2(u5), a4 = h5.render(h5.props, h5.state, h5.context), h5.state = h5.__s;
    } while (h5.__d && ++A4 < 25);
    h5.state = h5.__s, null != h5.getChildContext && (i4 = w(w({}, i4), h5.getChildContext())), S3 && !p5 && null != h5.getSnapshotBeforeUpdate && (_4 = h5.getSnapshotBeforeUpdate(v4, y5)), L2 = a4, null != a4 && a4.type === k && null == a4.key && (L2 = V(a4.props.children)), f5 = I(n3, d(L2) ? L2 : [L2], u5, t4, i4, o4, r4, e4, f5, c4, s4), h5.base = u5.__e, u5.__u &= -161, h5.__h.length && e4.push(h5), m5 && (h5.__E = h5.__ = null);
  } catch (n4) {
    if (u5.__v = null, c4 || null != r4) if (n4.then) {
      for (u5.__u |= c4 ? 160 : 128; f5 && 8 == f5.nodeType && f5.nextSibling; ) f5 = f5.nextSibling;
      r4[r4.indexOf(f5)] = null, u5.__e = f5;
    } else {
      for (T4 = r4.length; T4--; ) g(r4[T4]);
      z(u5);
    }
    else u5.__e = t4.__e, u5.__k = t4.__k, n4.then || z(u5);
    l.__e(n4, u5, t4);
  }
  else null == r4 && u5.__v == t4.__v ? (u5.__k = t4.__k, u5.__e = t4.__e) : f5 = u5.__e = q(t4.__e, u5, t4, i4, o4, r4, e4, c4, s4);
  return (a4 = l.diffed) && a4(u5), 128 & u5.__u ? void 0 : f5;
}
function z(n3) {
  n3 && n3.__c && (n3.__c.__e = true), n3 && n3.__k && n3.__k.forEach(z);
}
function N(n3, u5, t4) {
  for (var i4 = 0; i4 < t4.length; i4++) B(t4[i4], t4[++i4], t4[++i4]);
  l.__c && l.__c(u5, n3), n3.some(function(u6) {
    try {
      n3 = u6.__h, u6.__h = [], n3.some(function(n4) {
        n4.call(u6);
      });
    } catch (n4) {
      l.__e(n4, u6.__v);
    }
  });
}
function V(n3) {
  return "object" != typeof n3 || null == n3 || n3.__b && n3.__b > 0 ? n3 : d(n3) ? n3.map(V) : w({}, n3);
}
function q(u5, t4, i4, o4, r4, e4, f5, c4, s4) {
  var a4, h5, v4, y5, w5, _4, m5, b3 = i4.props || p, k4 = t4.props, x3 = t4.type;
  if ("svg" == x3 ? r4 = "http://www.w3.org/2000/svg" : "math" == x3 ? r4 = "http://www.w3.org/1998/Math/MathML" : r4 || (r4 = "http://www.w3.org/1999/xhtml"), null != e4) {
    for (a4 = 0; a4 < e4.length; a4++) if ((w5 = e4[a4]) && "setAttribute" in w5 == !!x3 && (x3 ? w5.localName == x3 : 3 == w5.nodeType)) {
      u5 = w5, e4[a4] = null;
      break;
    }
  }
  if (null == u5) {
    if (null == x3) return document.createTextNode(k4);
    u5 = document.createElementNS(r4, x3, k4.is && k4), c4 && (l.__m && l.__m(t4, e4), c4 = false), e4 = null;
  }
  if (null == x3) b3 === k4 || c4 && u5.data == k4 || (u5.data = k4);
  else {
    if (e4 = e4 && n.call(u5.childNodes), !c4 && null != e4) for (b3 = {}, a4 = 0; a4 < u5.attributes.length; a4++) b3[(w5 = u5.attributes[a4]).name] = w5.value;
    for (a4 in b3) if (w5 = b3[a4], "children" == a4) ;
    else if ("dangerouslySetInnerHTML" == a4) v4 = w5;
    else if (!(a4 in k4)) {
      if ("value" == a4 && "defaultValue" in k4 || "checked" == a4 && "defaultChecked" in k4) continue;
      j(u5, a4, null, w5, r4);
    }
    for (a4 in k4) w5 = k4[a4], "children" == a4 ? y5 = w5 : "dangerouslySetInnerHTML" == a4 ? h5 = w5 : "value" == a4 ? _4 = w5 : "checked" == a4 ? m5 = w5 : c4 && "function" != typeof w5 || b3[a4] === w5 || j(u5, a4, w5, b3[a4], r4);
    if (h5) c4 || v4 && (h5.__html == v4.__html || h5.__html == u5.innerHTML) || (u5.innerHTML = h5.__html), t4.__k = [];
    else if (v4 && (u5.innerHTML = ""), I("template" == t4.type ? u5.content : u5, d(y5) ? y5 : [y5], t4, i4, o4, "foreignObject" == x3 ? "http://www.w3.org/1999/xhtml" : r4, e4, f5, e4 ? e4[0] : i4.__k && S(i4, 0), c4, s4), null != e4) for (a4 = e4.length; a4--; ) g(e4[a4]);
    c4 || (a4 = "value", "progress" == x3 && null == _4 ? u5.removeAttribute("value") : null != _4 && (_4 !== u5[a4] || "progress" == x3 && !_4 || "option" == x3 && _4 != b3[a4]) && j(u5, a4, _4, b3[a4], r4), a4 = "checked", null != m5 && m5 != u5[a4] && j(u5, a4, m5, b3[a4], r4));
  }
  return u5;
}
function B(n3, u5, t4) {
  try {
    if ("function" == typeof n3) {
      var i4 = "function" == typeof n3.__u;
      i4 && n3.__u(), i4 && null == u5 || (n3.__u = n3(u5));
    } else n3.current = u5;
  } catch (n4) {
    l.__e(n4, t4);
  }
}
function D(n3, u5, t4) {
  var i4, o4;
  if (l.unmount && l.unmount(n3), (i4 = n3.ref) && (i4.current && i4.current != n3.__e || B(i4, null, u5)), null != (i4 = n3.__c)) {
    if (i4.componentWillUnmount) try {
      i4.componentWillUnmount();
    } catch (n4) {
      l.__e(n4, u5);
    }
    i4.base = i4.__P = null;
  }
  if (i4 = n3.__k) for (o4 = 0; o4 < i4.length; o4++) i4[o4] && D(i4[o4], u5, t4 || "function" != typeof n3.type);
  t4 || g(n3.__e), n3.__c = n3.__ = n3.__e = void 0;
}
function E(n3, l5, u5) {
  return this.constructor(n3, u5);
}
function G(u5, t4, i4) {
  var o4, r4, e4, f5;
  t4 == document && (t4 = document.documentElement), l.__ && l.__(u5, t4), r4 = (o4 = "function" == typeof i4) ? null : i4 && i4.__k || t4.__k, e4 = [], f5 = [], O(t4, u5 = (!o4 && i4 || t4).__k = _(k, null, [u5]), r4 || p, p, t4.namespaceURI, !o4 && i4 ? [i4] : r4 ? null : t4.firstChild ? n.call(t4.childNodes) : null, e4, !o4 && i4 ? i4 : r4 ? r4.__e : t4.firstChild, o4, f5), N(e4, u5, f5);
}
var n, l, u, t, i, o, r, e, f, c, s, a, h, p, v, y, d;
var init_preact_module = __esm({
  "node_modules/preact/dist/preact.module.js"() {
    p = {};
    v = [];
    y = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
    d = Array.isArray;
    n = v.slice, l = { __e: function(n3, l5, u5, t4) {
      for (var i4, o4, r4; l5 = l5.__; ) if ((i4 = l5.__c) && !i4.__) try {
        if ((o4 = i4.constructor) && null != o4.getDerivedStateFromError && (i4.setState(o4.getDerivedStateFromError(n3)), r4 = i4.__d), null != i4.componentDidCatch && (i4.componentDidCatch(n3, t4 || {}), r4 = i4.__d), r4) return i4.__E = i4;
      } catch (l6) {
        n3 = l6;
      }
      throw n3;
    } }, u = 0, t = function(n3) {
      return null != n3 && void 0 === n3.constructor;
    }, x.prototype.setState = function(n3, l5) {
      var u5;
      u5 = null != this.__s && this.__s != this.state ? this.__s : this.__s = w({}, this.state), "function" == typeof n3 && (n3 = n3(w({}, u5), this.props)), n3 && w(u5, n3), null != n3 && this.__v && (l5 && this._sb.push(l5), M(this));
    }, x.prototype.forceUpdate = function(n3) {
      this.__v && (this.__e = true, n3 && this.__h.push(n3), M(this));
    }, x.prototype.render = k, i = [], r = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n3, l5) {
      return n3.__v.__b - l5.__v.__b;
    }, $.__r = 0, f = /(PointerCapture)$|Capture$/i, c = 0, s = F(false), a = F(true), h = 0;
  }
});

// node_modules/preact/hooks/dist/hooks.module.js
function p2(n3, t4) {
  c2.__h && c2.__h(r2, n3, o2 || t4), o2 = 0;
  var u5 = r2.__H || (r2.__H = { __: [], __h: [] });
  return n3 >= u5.__.length && u5.__.push({}), u5.__[n3];
}
function d2(n3) {
  return o2 = 1, h2(D2, n3);
}
function h2(n3, u5, i4) {
  var o4 = p2(t2++, 2);
  if (o4.t = n3, !o4.__c && (o4.__ = [i4 ? i4(u5) : D2(void 0, u5), function(n4) {
    var t4 = o4.__N ? o4.__N[0] : o4.__[0], r4 = o4.t(t4, n4);
    t4 !== r4 && (o4.__N = [r4, o4.__[1]], o4.__c.setState({}));
  }], o4.__c = r2, !r2.__f)) {
    var f5 = function(n4, t4, r4) {
      if (!o4.__c.__H) return true;
      var u6 = o4.__c.__H.__.filter(function(n5) {
        return !!n5.__c;
      });
      if (u6.every(function(n5) {
        return !n5.__N;
      })) return !c4 || c4.call(this, n4, t4, r4);
      var i5 = o4.__c.props !== n4;
      return u6.forEach(function(n5) {
        if (n5.__N) {
          var t5 = n5.__[0];
          n5.__ = n5.__N, n5.__N = void 0, t5 !== n5.__[0] && (i5 = true);
        }
      }), c4 && c4.call(this, n4, t4, r4) || i5;
    };
    r2.__f = true;
    var c4 = r2.shouldComponentUpdate, e4 = r2.componentWillUpdate;
    r2.componentWillUpdate = function(n4, t4, r4) {
      if (this.__e) {
        var u6 = c4;
        c4 = void 0, f5(n4, t4, r4), c4 = u6;
      }
      e4 && e4.call(this, n4, t4, r4);
    }, r2.shouldComponentUpdate = f5;
  }
  return o4.__N || o4.__;
}
function y2(n3, u5) {
  var i4 = p2(t2++, 3);
  !c2.__s && C2(i4.__H, u5) && (i4.__ = n3, i4.u = u5, r2.__H.__h.push(i4));
}
function A2(n3) {
  return o2 = 5, T2(function() {
    return { current: n3 };
  }, []);
}
function T2(n3, r4) {
  var u5 = p2(t2++, 7);
  return C2(u5.__H, r4) && (u5.__ = n3(), u5.__H = r4, u5.__h = n3), u5.__;
}
function j2() {
  for (var n3; n3 = f2.shift(); ) if (n3.__P && n3.__H) try {
    n3.__H.__h.forEach(z2), n3.__H.__h.forEach(B2), n3.__H.__h = [];
  } catch (t4) {
    n3.__H.__h = [], c2.__e(t4, n3.__v);
  }
}
function w2(n3) {
  var t4, r4 = function() {
    clearTimeout(u5), k2 && cancelAnimationFrame(t4), setTimeout(n3);
  }, u5 = setTimeout(r4, 35);
  k2 && (t4 = requestAnimationFrame(r4));
}
function z2(n3) {
  var t4 = r2, u5 = n3.__c;
  "function" == typeof u5 && (n3.__c = void 0, u5()), r2 = t4;
}
function B2(n3) {
  var t4 = r2;
  n3.__c = n3.__(), r2 = t4;
}
function C2(n3, t4) {
  return !n3 || n3.length !== t4.length || t4.some(function(t5, r4) {
    return t5 !== n3[r4];
  });
}
function D2(n3, t4) {
  return "function" == typeof t4 ? t4(n3) : t4;
}
var t2, r2, u2, i2, o2, f2, c2, e2, a2, v2, l2, m2, s2, k2;
var init_hooks_module = __esm({
  "node_modules/preact/hooks/dist/hooks.module.js"() {
    init_preact_module();
    o2 = 0;
    f2 = [];
    c2 = l;
    e2 = c2.__b;
    a2 = c2.__r;
    v2 = c2.diffed;
    l2 = c2.__c;
    m2 = c2.unmount;
    s2 = c2.__;
    c2.__b = function(n3) {
      r2 = null, e2 && e2(n3);
    }, c2.__ = function(n3, t4) {
      n3 && t4.__k && t4.__k.__m && (n3.__m = t4.__k.__m), s2 && s2(n3, t4);
    }, c2.__r = function(n3) {
      a2 && a2(n3), t2 = 0;
      var i4 = (r2 = n3.__c).__H;
      i4 && (u2 === r2 ? (i4.__h = [], r2.__h = [], i4.__.forEach(function(n4) {
        n4.__N && (n4.__ = n4.__N), n4.u = n4.__N = void 0;
      })) : (i4.__h.forEach(z2), i4.__h.forEach(B2), i4.__h = [], t2 = 0)), u2 = r2;
    }, c2.diffed = function(n3) {
      v2 && v2(n3);
      var t4 = n3.__c;
      t4 && t4.__H && (t4.__H.__h.length && (1 !== f2.push(t4) && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t4.__H.__.forEach(function(n4) {
        n4.u && (n4.__H = n4.u), n4.u = void 0;
      })), u2 = r2 = null;
    }, c2.__c = function(n3, t4) {
      t4.some(function(n4) {
        try {
          n4.__h.forEach(z2), n4.__h = n4.__h.filter(function(n5) {
            return !n5.__ || B2(n5);
          });
        } catch (r4) {
          t4.some(function(n5) {
            n5.__h && (n5.__h = []);
          }), t4 = [], c2.__e(r4, n4.__v);
        }
      }), l2 && l2(n3, t4);
    }, c2.unmount = function(n3) {
      m2 && m2(n3);
      var t4, r4 = n3.__c;
      r4 && r4.__H && (r4.__H.__.forEach(function(n4) {
        try {
          z2(n4);
        } catch (n5) {
          t4 = n5;
        }
      }), r4.__H = void 0, t4 && c2.__e(t4, r4.__v));
    };
    k2 = "function" == typeof requestAnimationFrame;
  }
});

// node_modules/@preact/signals-core/dist/signals-core.module.js
function t3() {
  if (!(s3 > 1)) {
    var i4, t4 = false;
    while (void 0 !== h3) {
      var n3 = h3;
      h3 = void 0;
      v3++;
      while (void 0 !== n3) {
        var r4 = n3.o;
        n3.o = void 0;
        n3.f &= -3;
        if (!(8 & n3.f) && a3(n3)) try {
          n3.c();
        } catch (n4) {
          if (!t4) {
            i4 = n4;
            t4 = true;
          }
        }
        n3 = r4;
      }
    }
    v3 = 0;
    s3--;
    if (t4) throw i4;
  } else s3--;
}
function n2(i4) {
  if (s3 > 0) return i4();
  s3++;
  try {
    return i4();
  } finally {
    t3();
  }
}
function o3(i4) {
  var t4 = r3;
  r3 = void 0;
  try {
    return i4();
  } finally {
    r3 = t4;
  }
}
function e3(i4) {
  if (void 0 !== r3) {
    var t4 = i4.n;
    if (void 0 === t4 || t4.t !== r3) {
      t4 = { i: 0, S: i4, p: r3.s, n: void 0, t: r3, e: void 0, x: void 0, r: t4 };
      if (void 0 !== r3.s) r3.s.n = t4;
      r3.s = t4;
      i4.n = t4;
      if (32 & r3.f) i4.S(t4);
      return t4;
    } else if (-1 === t4.i) {
      t4.i = 0;
      if (void 0 !== t4.n) {
        t4.n.p = t4.p;
        if (void 0 !== t4.p) t4.p.n = t4.n;
        t4.p = r3.s;
        t4.n = void 0;
        r3.s.n = t4;
        r3.s = t4;
      }
      return t4;
    }
  }
}
function d3(i4, t4) {
  this.v = i4;
  this.i = 0;
  this.n = void 0;
  this.t = void 0;
  this.W = null == t4 ? void 0 : t4.watched;
  this.Z = null == t4 ? void 0 : t4.unwatched;
  this.name = null == t4 ? void 0 : t4.name;
}
function c3(i4, t4) {
  return new d3(i4, t4);
}
function a3(i4) {
  for (var t4 = i4.s; void 0 !== t4; t4 = t4.n) if (t4.S.i !== t4.i || !t4.S.h() || t4.S.i !== t4.i) return true;
  return false;
}
function l3(i4) {
  for (var t4 = i4.s; void 0 !== t4; t4 = t4.n) {
    var n3 = t4.S.n;
    if (void 0 !== n3) t4.r = n3;
    t4.S.n = t4;
    t4.i = -1;
    if (void 0 === t4.n) {
      i4.s = t4;
      break;
    }
  }
}
function y3(i4) {
  var t4 = i4.s, n3 = void 0;
  while (void 0 !== t4) {
    var r4 = t4.p;
    if (-1 === t4.i) {
      t4.S.U(t4);
      if (void 0 !== r4) r4.n = t4.n;
      if (void 0 !== t4.n) t4.n.p = r4;
    } else n3 = t4;
    t4.S.n = t4.r;
    if (void 0 !== t4.r) t4.r = void 0;
    t4 = r4;
  }
  i4.s = n3;
}
function w3(i4, t4) {
  d3.call(this, void 0);
  this.x = i4;
  this.s = void 0;
  this.g = u3 - 1;
  this.f = 4;
  this.W = null == t4 ? void 0 : t4.watched;
  this.Z = null == t4 ? void 0 : t4.unwatched;
  this.name = null == t4 ? void 0 : t4.name;
}
function b(i4, t4) {
  return new w3(i4, t4);
}
function _2(i4) {
  var n3 = i4.u;
  i4.u = void 0;
  if ("function" == typeof n3) {
    s3++;
    var o4 = r3;
    r3 = void 0;
    try {
      n3();
    } catch (t4) {
      i4.f &= -2;
      i4.f |= 8;
      p3(i4);
      throw t4;
    } finally {
      r3 = o4;
      t3();
    }
  }
}
function p3(i4) {
  for (var t4 = i4.s; void 0 !== t4; t4 = t4.n) t4.S.U(t4);
  i4.x = void 0;
  i4.s = void 0;
  _2(i4);
}
function g2(i4) {
  if (r3 !== this) throw new Error("Out-of-order effect");
  y3(this);
  r3 = i4;
  this.f &= -2;
  if (8 & this.f) p3(this);
  t3();
}
function S2(i4, t4) {
  this.x = i4;
  this.u = void 0;
  this.s = void 0;
  this.o = void 0;
  this.f = 32;
  this.name = null == t4 ? void 0 : t4.name;
  if (f3) f3.push(this);
}
function m3(i4, t4) {
  var n3 = new S2(i4, t4);
  try {
    n3.c();
  } catch (i5) {
    n3.d();
    throw i5;
  }
  var r4 = n3.d.bind(n3);
  r4[Symbol.dispose] = r4;
  return r4;
}
var i3, r3, f3, h3, s3, v3, u3;
var init_signals_core_module = __esm({
  "node_modules/@preact/signals-core/dist/signals-core.module.js"() {
    i3 = Symbol.for("preact-signals");
    r3 = void 0;
    h3 = void 0;
    s3 = 0;
    v3 = 0;
    u3 = 0;
    d3.prototype.brand = i3;
    d3.prototype.h = function() {
      return true;
    };
    d3.prototype.S = function(i4) {
      var t4 = this, n3 = this.t;
      if (n3 !== i4 && void 0 === i4.e) {
        i4.x = n3;
        this.t = i4;
        if (void 0 !== n3) n3.e = i4;
        else o3(function() {
          var i5;
          null == (i5 = t4.W) || i5.call(t4);
        });
      }
    };
    d3.prototype.U = function(i4) {
      var t4 = this;
      if (void 0 !== this.t) {
        var n3 = i4.e, r4 = i4.x;
        if (void 0 !== n3) {
          n3.x = r4;
          i4.e = void 0;
        }
        if (void 0 !== r4) {
          r4.e = n3;
          i4.x = void 0;
        }
        if (i4 === this.t) {
          this.t = r4;
          if (void 0 === r4) o3(function() {
            var i5;
            null == (i5 = t4.Z) || i5.call(t4);
          });
        }
      }
    };
    d3.prototype.subscribe = function(i4) {
      var t4 = this;
      return m3(function() {
        var n3 = t4.value, o4 = r3;
        r3 = void 0;
        try {
          i4(n3);
        } finally {
          r3 = o4;
        }
      }, { name: "sub" });
    };
    d3.prototype.valueOf = function() {
      return this.value;
    };
    d3.prototype.toString = function() {
      return this.value + "";
    };
    d3.prototype.toJSON = function() {
      return this.value;
    };
    d3.prototype.peek = function() {
      var i4 = r3;
      r3 = void 0;
      try {
        return this.value;
      } finally {
        r3 = i4;
      }
    };
    Object.defineProperty(d3.prototype, "value", { get: function() {
      var i4 = e3(this);
      if (void 0 !== i4) i4.i = this.i;
      return this.v;
    }, set: function(i4) {
      if (i4 !== this.v) {
        if (v3 > 100) throw new Error("Cycle detected");
        this.v = i4;
        this.i++;
        u3++;
        s3++;
        try {
          for (var n3 = this.t; void 0 !== n3; n3 = n3.x) n3.t.N();
        } finally {
          t3();
        }
      }
    } });
    w3.prototype = new d3();
    w3.prototype.h = function() {
      this.f &= -3;
      if (1 & this.f) return false;
      if (32 == (36 & this.f)) return true;
      this.f &= -5;
      if (this.g === u3) return true;
      this.g = u3;
      this.f |= 1;
      if (this.i > 0 && !a3(this)) {
        this.f &= -2;
        return true;
      }
      var i4 = r3;
      try {
        l3(this);
        r3 = this;
        var t4 = this.x();
        if (16 & this.f || this.v !== t4 || 0 === this.i) {
          this.v = t4;
          this.f &= -17;
          this.i++;
        }
      } catch (i5) {
        this.v = i5;
        this.f |= 16;
        this.i++;
      }
      r3 = i4;
      y3(this);
      this.f &= -2;
      return true;
    };
    w3.prototype.S = function(i4) {
      if (void 0 === this.t) {
        this.f |= 36;
        for (var t4 = this.s; void 0 !== t4; t4 = t4.n) t4.S.S(t4);
      }
      d3.prototype.S.call(this, i4);
    };
    w3.prototype.U = function(i4) {
      if (void 0 !== this.t) {
        d3.prototype.U.call(this, i4);
        if (void 0 === this.t) {
          this.f &= -33;
          for (var t4 = this.s; void 0 !== t4; t4 = t4.n) t4.S.U(t4);
        }
      }
    };
    w3.prototype.N = function() {
      if (!(2 & this.f)) {
        this.f |= 6;
        for (var i4 = this.t; void 0 !== i4; i4 = i4.x) i4.t.N();
      }
    };
    Object.defineProperty(w3.prototype, "value", { get: function() {
      if (1 & this.f) throw new Error("Cycle detected");
      var i4 = e3(this);
      this.h();
      if (void 0 !== i4) i4.i = this.i;
      if (16 & this.f) throw this.v;
      return this.v;
    } });
    S2.prototype.c = function() {
      var i4 = this.S();
      try {
        if (8 & this.f) return;
        if (void 0 === this.x) return;
        var t4 = this.x();
        if ("function" == typeof t4) this.u = t4;
      } finally {
        i4();
      }
    };
    S2.prototype.S = function() {
      if (1 & this.f) throw new Error("Cycle detected");
      this.f |= 1;
      this.f &= -9;
      _2(this);
      l3(this);
      s3++;
      var i4 = r3;
      r3 = this;
      return g2.bind(this, i4);
    };
    S2.prototype.N = function() {
      if (!(2 & this.f)) {
        this.f |= 2;
        this.o = h3;
        h3 = this;
      }
    };
    S2.prototype.d = function() {
      this.f |= 8;
      if (!(1 & this.f)) p3(this);
    };
    S2.prototype.dispose = function() {
      this.d();
    };
  }
});

// node_modules/@preact/signals/dist/signals.module.js
function g3(i4, t4) {
  l[i4] = t4.bind(null, l[i4] || function() {
  });
}
function b2(i4) {
  if (d4) {
    var n3 = d4;
    d4 = void 0;
    n3();
  }
  d4 = i4 && i4.S();
}
function y4(i4) {
  var n3 = this, r4 = i4.data, f5 = useSignal(r4);
  f5.value = r4;
  var e4 = T2(function() {
    var i5 = n3, r5 = n3.__v;
    while (r5 = r5.__) if (r5.__c) {
      r5.__c.__$f |= 4;
      break;
    }
    var o4 = b(function() {
      var i6 = f5.value.value;
      return 0 === i6 ? 0 : true === i6 ? "" : i6 || "";
    }), e5 = b(function() {
      return !Array.isArray(o4.value) && !t(o4.value);
    }), a5 = m3(function() {
      this.N = F2;
      if (e5.value) {
        var n4 = o4.value;
        if (i5.__v && i5.__v.__e && 3 === i5.__v.__e.nodeType) i5.__v.__e.data = n4;
      }
    }), v5 = n3.__$u.d;
    n3.__$u.d = function() {
      a5();
      v5.call(this);
    };
    return [e5, o4];
  }, []), a4 = e4[0], v4 = e4[1];
  return a4.value ? v4.peek() : v4.value;
}
function w4(i4, n3, t4, r4) {
  var o4 = n3 in i4 && void 0 === i4.ownerSVGElement, f5 = c3(t4);
  return { o: function(i5, n4) {
    f5.value = i5;
    r4 = n4;
  }, d: m3(function() {
    this.N = F2;
    var t5 = f5.value.value;
    if (r4[n3] !== t5) {
      r4[n3] = t5;
      if (o4) i4[n3] = t5;
      else if (null != t5 && (false !== t5 || "-" === n3[4])) i4.setAttribute(n3, t5);
      else i4.removeAttribute(n3);
    }
  }) };
}
function useSignal(i4, n3) {
  return T2(function() {
    return c3(i4, n3);
  }, []);
}
function useComputed(i4, n3) {
  var t4 = A2(i4);
  t4.current = i4;
  h4.__$f |= 4;
  return T2(function() {
    return b(function() {
      return t4.current();
    }, n3);
  }, []);
}
function A3() {
  n2(function() {
    var i4;
    while (i4 = m4.shift()) l4.call(i4);
  });
}
function T3() {
  if (1 === m4.push(this)) (l.requestAnimationFrame || k3)(A3);
}
function x2() {
  n2(function() {
    var i4;
    while (i4 = _3.shift()) l4.call(i4);
  });
}
function F2() {
  if (1 === _3.push(this)) (l.requestAnimationFrame || q2)(x2);
}
function useSignalEffect(i4, n3) {
  var t4 = A2(i4);
  t4.current = i4;
  y2(function() {
    return m3(function() {
      this.N = T3;
      return t4.current();
    }, n3);
  }, []);
}
var l4, h4, d4, p4, m4, _3, k3, q2;
var init_signals_module = __esm({
  "node_modules/@preact/signals/dist/signals.module.js"() {
    init_preact_module();
    init_hooks_module();
    init_signals_core_module();
    p4 = "undefined" != typeof window && !!window.__PREACT_SIGNALS_DEVTOOLS__;
    m4 = [];
    _3 = [];
    m3(function() {
      l4 = this.N;
    })();
    y4.displayName = "ReactiveTextNode";
    Object.defineProperties(d3.prototype, { constructor: { configurable: true, value: void 0 }, type: { configurable: true, value: y4 }, props: { configurable: true, get: function() {
      return { data: this };
    } }, __b: { configurable: true, value: 1 } });
    g3("__b", function(i4, n3) {
      if ("string" == typeof n3.type) {
        var t4, r4 = n3.props;
        for (var o4 in r4) if ("children" !== o4) {
          var f5 = r4[o4];
          if (f5 instanceof d3) {
            if (!t4) n3.__np = t4 = {};
            t4[o4] = f5;
            r4[o4] = f5.peek();
          }
        }
      }
      i4(n3);
    });
    g3("__r", function(i4, n3) {
      i4(n3);
      if (n3.type !== k) {
        b2();
        var t4, o4 = n3.__c;
        if (o4) {
          o4.__$f &= -2;
          if (void 0 === (t4 = o4.__$u)) o4.__$u = t4 = (function(i5, n4) {
            var t5;
            m3(function() {
              t5 = this;
            }, { name: n4 });
            t5.c = i5;
            return t5;
          })(function() {
            var i5;
            if (p4) null == (i5 = t4.y) || i5.call(t4);
            o4.__$f |= 1;
            o4.setState({});
          }, "function" == typeof n3.type ? n3.type.displayName || n3.type.name : "");
        }
        h4 = o4;
        b2(t4);
      }
    });
    g3("__e", function(i4, n3, t4, r4) {
      b2();
      h4 = void 0;
      i4(n3, t4, r4);
    });
    g3("diffed", function(i4, n3) {
      b2();
      h4 = void 0;
      var t4;
      if ("string" == typeof n3.type && (t4 = n3.__e)) {
        var r4 = n3.__np, o4 = n3.props;
        if (r4) {
          var f5 = t4.U;
          if (f5) for (var e4 in f5) {
            var u5 = f5[e4];
            if (void 0 !== u5 && !(e4 in r4)) {
              u5.d();
              f5[e4] = void 0;
            }
          }
          else {
            f5 = {};
            t4.U = f5;
          }
          for (var a4 in r4) {
            var c4 = f5[a4], v4 = r4[a4];
            if (void 0 === c4) {
              c4 = w4(t4, a4, v4, o4);
              f5[a4] = c4;
            } else c4.o(v4, o4);
          }
        }
      }
      i4(n3);
    });
    g3("unmount", function(i4, n3) {
      if ("string" == typeof n3.type) {
        var t4 = n3.__e;
        if (t4) {
          var r4 = t4.U;
          if (r4) {
            t4.U = void 0;
            for (var o4 in r4) {
              var f5 = r4[o4];
              if (f5) f5.d();
            }
          }
        }
      } else {
        var e4 = n3.__c;
        if (e4) {
          var u5 = e4.__$u;
          if (u5) {
            e4.__$u = void 0;
            u5.d();
          }
        }
      }
      i4(n3);
    });
    g3("__h", function(i4, n3, t4, r4) {
      if (r4 < 3 || 9 === r4) n3.__$f |= 2;
      i4(n3, t4, r4);
    });
    x.prototype.shouldComponentUpdate = function(i4, n3) {
      if (this.__R) return true;
      var t4 = this.__$u, r4 = t4 && void 0 !== t4.s;
      for (var o4 in n3) return true;
      if (this.__f || "boolean" == typeof this.u && true === this.u) {
        var f5 = 2 & this.__$f;
        if (!(r4 || f5 || 4 & this.__$f)) return true;
        if (1 & this.__$f) return true;
      } else {
        if (!(r4 || 4 & this.__$f)) return true;
        if (3 & this.__$f) return true;
      }
      for (var e4 in i4) if ("__source" !== e4 && i4[e4] !== this.props[e4]) return true;
      for (var u5 in this.props) if (!(u5 in i4)) return true;
      return false;
    };
    k3 = "undefined" == typeof requestAnimationFrame ? setTimeout : function(i4) {
      var n3 = function() {
        clearTimeout(t4);
        cancelAnimationFrame(r4);
        i4();
      }, t4 = setTimeout(n3, 35), r4 = requestAnimationFrame(n3);
    };
    q2 = function(i4) {
      queueMicrotask(function() {
        queueMicrotask(i4);
      });
    };
  }
});

// web/src/components/constants.js
function todayUserTimeZone() {
  const now = /* @__PURE__ */ new Date();
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    // Dynamically get the user"s browser timezone
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
  return now.toLocaleDateString("en-CA", options);
}
function formattingDateObj(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const date = String(dateObj.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + date;
}
var ALL, Priority, ProjectFilters, ProjectSorter, TaskFiltersPriority, TaskFiltersStatus, TaskFiltersTime, TaskSorter, defaultTaskFilters, monthNames, daysInitial, daysName, ReportsTimeRange, TaskStatsKeyMap;
var init_constants = __esm({
  "web/src/components/constants.js"() {
    "use strict";
    ALL = "all";
    Priority = "priority";
    ProjectFilters = Object.freeze({
      ALL,
      Unfinished: "unfinished",
      Finished: "finished",
      Overdue: "overdue"
    });
    ProjectSorter = Object.freeze({
      Skip: "",
      DueDateAsc: "dueDateAsc",
      DueDateDesc: "dueDateDesc",
      DoneDateAsc: "doneDateAsc",
      DoneDateDesc: "doneDateDesc",
      Priority
    });
    TaskFiltersPriority = Object.freeze({ ALL, Priority });
    TaskFiltersStatus = Object.freeze({
      ALL,
      Unfinished: "unfinished",
      Finished: "finished",
      Overdue: "overdue"
    });
    TaskFiltersTime = Object.freeze({
      ALL,
      Today: "today",
      ThisWeek: "week",
      SevenDays: "7days",
      ThisMonth: "month",
      ThirtyDays: "30days",
      ThisQuarter: "quarter"
    });
    TaskSorter = Object.freeze({
      Skip: "",
      DueDateAsc: "dueDateAsc",
      DueDateDesc: "dueDateDesc",
      DoneDateAsc: "doneDateAsc",
      DoneDateDesc: "doneDateDesc",
      Priority: "priority"
    });
    defaultTaskFilters = Object.freeze({
      selectedProject: ALL,
      priority: ALL,
      status: ALL,
      time: TaskFiltersTime.Today
    });
    monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    daysInitial = ["S", "M", "T", "W", "T", "F", "S"];
    daysName = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    ReportsTimeRange = Object.freeze({
      ThisWeek: "Week",
      ThisMonth: "Month",
      ThreeMonths: "3 Months",
      SixMonths: "6 Months",
      SevenDays: "Last 7 days",
      ThirtyDays: "Last 30 days",
      NinetyDays: "Last 90 days",
      HundredEightyDays: "Last 180 days",
      ThisYear: "This Year",
      ALL: "All"
    });
    TaskStatsKeyMap = Object.freeze({
      [ReportsTimeRange.ThisWeek]: { total: "thisWeekTotal", done: "thisWeekDone" },
      [ReportsTimeRange.ThisMonth]: { total: "thisMonthTotal", done: "thisMonthDone" },
      [ReportsTimeRange.ThreeMonths]: { total: "currentQuarterTotal", done: "currentQuarterDone" },
      [ReportsTimeRange.SixMonths]: { total: "currentSemesterTotal", done: "currentSemesterDone" },
      [ReportsTimeRange.SevenDays]: { total: "last7DaysTotal", done: "last7DaysDone" },
      [ReportsTimeRange.ThirtyDays]: { total: "last30DaysTotal", done: "last30DaysDone" },
      [ReportsTimeRange.NinetyDays]: { total: "last90DaysTotal", done: "last90DaysDone" },
      [ReportsTimeRange.HundredEightyDays]: { total: "last180DaysTotal", done: "last180DaysDone" },
      [ReportsTimeRange.ThisYear]: { total: "thisYearTotal", done: "thisYearDone" },
      [ReportsTimeRange.ALL]: { total: "allTimeTotal", done: "allTimeDone" }
    });
  }
});

// node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
function u4(e4, t4, n3, o4, i4, u5) {
  t4 || (t4 = {});
  var a4, c4, p5 = t4;
  if ("ref" in p5) for (c4 in p5 = {}, t4) "ref" == c4 ? a4 = t4[c4] : p5[c4] = t4[c4];
  var l5 = { type: e4, props: p5, key: n3, ref: a4, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f4, __i: -1, __u: 0, __source: i4, __self: u5 };
  if ("function" == typeof e4 && (a4 = e4.defaultProps)) for (c4 in a4) void 0 === p5[c4] && (p5[c4] = a4[c4]);
  return l.vnode && l.vnode(l5), l5;
}
var f4;
var init_jsxRuntime_module = __esm({
  "node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js"() {
    init_preact_module();
    init_preact_module();
    f4 = 0;
  }
});

// web/src/habits/habits.stats.tsx
var SummaryStats;
var init_habits_stats = __esm({
  "web/src/habits/habits.stats.tsx"() {
    "use strict";
    init_signals_module();
    init_constants();
    init_jsxRuntime_module();
    SummaryStats = ({
      habitsDoneDates,
      dateRange,
      hiddenHabitsGroup,
      calendarRange
    }) => {
      const today = /* @__PURE__ */ new Date();
      today.setHours(0, 0, 0, 0);
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      const currentDate = today.getDate();
      const tomorrow = new Date(currentYear, currentMonth, currentDate + 1);
      const stats = useComputed(() => {
        const habitsLength = habitsDoneDates.value.length;
        const hiddenGroupIds = hiddenHabitsGroup.value;
        const shownHabits = [];
        for (let i4 = 0; i4 < habitsLength; i4++) {
          const habit = habitsDoneDates.value[i4].habit;
          if (!hiddenGroupIds.includes(habit.habits_group_id)) {
            shownHabits.push(habitsDoneDates.value[i4]);
          }
        }
        const shownHabitsLength = shownHabits.length;
        const createdAtArr = [];
        for (let i4 = 0; i4 < shownHabitsLength; i4++) {
          const habit = shownHabits[i4].habit;
          let createdAt;
          const habitCreatedAt = habit.created_at.slice(0, 10);
          const firstCheckIn = Object.keys(shownHabits[i4].done_dates)[0];
          if (habitCreatedAt < firstCheckIn) {
            createdAt = /* @__PURE__ */ new Date(`${habitCreatedAt}T00:00:00`);
          } else {
            createdAt = /* @__PURE__ */ new Date(`${firstCheckIn}T00:00:00`);
          }
          createdAtArr.push(createdAt);
        }
        let totalOpportunities = 0;
        let totalCompleted = 0;
        let perfectDays = 0;
        const dates = dateRange.value;
        for (const date of dates) {
          if (date >= tomorrow) break;
          let todayDoneCounter = 0;
          let todayMaxHabit = 0;
          const dateKey = formattingDateObj(date);
          for (let i4 = 0; i4 < shownHabitsLength; i4++) {
            const doneDates = shownHabits[i4].done_dates;
            const isAfterCreated = date >= createdAtArr[i4];
            const isBeforeTomorrow = date < tomorrow;
            if (isAfterCreated && isBeforeTomorrow) {
              totalOpportunities += 1;
              totalCompleted += doneDates[dateKey] ? 1 : 0;
              todayMaxHabit += 1;
              todayDoneCounter += doneDates[dateKey] ? 1 : 0;
            }
          }
          if (todayDoneCounter == todayMaxHabit && todayMaxHabit != 0) {
            perfectDays += 1;
          }
        }
        const percentage = Math.round(totalCompleted / totalOpportunities * 100) || 0;
        return { percentage, perfectDays };
      });
      return /* @__PURE__ */ u4("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ u4("div", { className: "bg-background p-6 text-white shadow-lg flex items-center justify-between", children: [
          /* @__PURE__ */ u4("div", { children: [
            /* @__PURE__ */ u4("p", { className: "text-white text-md font-semibold mb-1", children: [
              calendarRange.value == "" || calendarRange.value == "1" ? "" : Number(calendarRange.value) + " ",
              "Monthly Completion"
            ] }),
            /* @__PURE__ */ u4("h2", { className: "text-4xl font-bold", children: [
              stats.value.percentage,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ u4("div", { className: "h-16 w-16 rounded-full border-4 border-white flex items-center justify-center", children: /* @__PURE__ */ u4("span", { className: "text-3xl", children: "\u{1F4C8}" }) })
        ] }),
        /* @__PURE__ */ u4("div", { className: "bg-white p-6 border border-slate-200 shadow-sm flex items-center justify-between", children: [
          /* @__PURE__ */ u4("div", { children: [
            /* @__PURE__ */ u4("p", { className: "text-slate-500 text-sm font-medium mb-1", children: "Perfect Days" }),
            /* @__PURE__ */ u4("h2", { className: "text-4xl font-bold text-slate-800", children: stats.value.perfectDays })
          ] }),
          /* @__PURE__ */ u4("div", { className: "h-16 w-16 rounded-full bg-hover flex items-center justify-center text-yellow-600", children: /* @__PURE__ */ u4("span", { className: "text-3xl", children: "\u2B50" }) })
        ] })
      ] });
    };
  }
});

// web/src/habits/habits.card.tsx
function countDayApart(date1, date2) {
  const d1 = new Date(date1);
  const d22 = new Date(date2);
  if (isNaN(d1.getTime()) || isNaN(d22.getTime())) {
    return 0;
  }
  const diffMs = Math.abs(d1.getTime() - d22.getTime());
  const oneDayMs = 24 * 60 * 60 * 1e3;
  return Number(diffMs === oneDayMs);
}
var HabitCard;
var init_habits_card = __esm({
  "web/src/habits/habits.card.tsx"() {
    "use strict";
    init_signals_module();
    init_constants();
    init_jsxRuntime_module();
    HabitCard = ({
      habitObj,
      dateRange,
      errorMessage,
      habitsDoneDates,
      isDemo = false
    }) => {
      const habit = useSignal(habitObj);
      const today = todayUserTimeZone();
      const freq = habit.value.habit.frequency;
      const longestStreak = useComputed(() => {
        const doneDates = Object.keys(habit.value.done_dates);
        const dateRangeLength = dateRange.value.length;
        const doneDatesFiltered = doneDates.filter((dateStr) => {
          const doneDate = new Date(dateStr);
          if (doneDate >= dateRange.value[0] && doneDate <= dateRange.value[dateRangeLength - 1]) {
            return dateStr;
          }
        });
        const firstStreak = doneDatesFiltered.length > 0 ? 1 : 0;
        const len = doneDatesFiltered.length;
        let tempMax = firstStreak;
        let max = firstStreak;
        for (let i4 = 0; i4 < len - 1; i4++) {
          const nDaysApart = countDayApart(
            doneDatesFiltered[i4],
            doneDatesFiltered[i4 + 1]
          );
          tempMax = nDaysApart ? tempMax + nDaysApart : firstStreak;
          if (tempMax > max) max = tempMax;
        }
        return Math.ceil(max / freq);
      });
      const habitCheckIn = async () => {
        try {
          if (habit.value.done_dates[today]) {
            let title = habit.value.habit.habit_title;
            errorMessage.value = `You already did ${title}!`;
            setTimeout(() => errorMessage.value = "", 5e3);
            return;
          }
          const habit_id = habit.value.habit.habit_id;
          const habits_group_id = habit.value.habit.habits_group_id;
          if (isDemo) {
            const doneDateKeys = Object.keys(habit.value.done_dates).sort();
            const lastCheckIn = doneDateKeys.length > 0 ? doneDateKeys[doneDateKeys.length - 1] : "";
            let daysAgo = 0;
            if (lastCheckIn !== "") {
              const dNow = new Date(today);
              const dLast = new Date(lastCheckIn);
              const diffTime = dLast.getTime() - dNow.getTime();
              daysAgo = Math.round(diffTime / (1e3 * 3600 * 24));
            }
            if (-daysAgo > freq || lastCheckIn === "") {
              daysAgo = -freq;
            }
            const mockDoneDates = {};
            for (let i4 = 0; i4 < freq; i4++) {
              const d5 = new Date(today);
              d5.setDate(d5.getDate() + daysAgo + i4 + 1);
              const dateStr = formattingDateObj(d5);
              mockDoneDates[dateStr] = {
                habit_date_id: Date.now() + i4,
                // Generate unique mock IDs for each checked day
                done_date: dateStr,
                check_in_created_at: (/* @__PURE__ */ new Date()).toISOString()
              };
            }
            habit.value = {
              ...habit.value,
              done_dates: {
                ...habit.value.done_dates,
                ...mockDoneDates
              }
            };
            habitsDoneDates.value = habitsDoneDates.value.map((entry) => {
              if (entry.habit.habit_id === habit_id) {
                return {
                  ...entry,
                  done_dates: {
                    ...entry.done_dates,
                    ...mockDoneDates
                  }
                };
              }
              return entry;
            });
            return;
          }
          const response = await fetch(`/habits/check-in/${habits_group_id}/${habit_id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ habit_id, habits_group_id })
          });
          if (response.redirected) window.location.replace(response.url);
          const data = await response.json();
          if (data.success) {
            habit.value = {
              ...habit.value,
              done_dates: {
                ...habit.value.done_dates,
                ...data.done_dates
              }
            };
            habitsDoneDates.value = habitsDoneDates.value.map((entry) => {
              if (entry.habit.habit_id === habit_id) {
                return {
                  ...entry,
                  done_dates: {
                    ...entry.done_dates,
                    ...data.done_dates
                  }
                };
              }
              return entry;
            });
          }
          if (!data.success) errorMessage.value = "There's error in the backend.";
        } catch (error) {
          console.log(error);
          errorMessage.value = "There's error in the backend.";
        }
      };
      return /* @__PURE__ */ u4("div", { className: "bg-white rounded-sm shadow-sm border border-slate-200 py-5 px-2.5 flex flex-col h-full w-full hover:shadow-md transition-shadow", children: [
        /* @__PURE__ */ u4("div", { className: "flex justify-between items-start mb-4", children: /* @__PURE__ */ u4("div", { className: "flex items-center gap-3 group", children: [
          /* @__PURE__ */ u4(
            "div",
            {
              className: `h-10 w-10 rounded-sm bg-cyan-100 flex items-center justify-center text-cyan-600 cursor-pointer`,
              title: `${habit.value.done_dates[today] ? "You already checked in!" : "Click for today's check in!"}`,
              onClick: () => habitCheckIn(),
              children: /* @__PURE__ */ u4("i", { className: "text-xl not-italic", children: habit.value.habit.habit_icon })
            }
          ),
          /* @__PURE__ */ u4("div", { children: [
            /* @__PURE__ */ u4("h3", { className: "text-lg font-bold text-slate-800 leading-tight", children: [
              habit.value.habit.habit_title,
              /* @__PURE__ */ u4("span", { className: "hidden group-hover:flex text-base text-slate-500 font-medium", children: [
                /* @__PURE__ */ u4("span", { className: "min-w-23", children: "Frequency" }),
                ": per ",
                freq,
                " day",
                freq > 1 ? "s" : ""
              ] })
            ] }),
            /* @__PURE__ */ u4("p", { className: "text-base text-slate-500 font-medium flex flex-row", children: [
              /* @__PURE__ */ u4("span", { className: "min-w-23", children: "Best streak" }),
              ": ",
              longestStreak,
              " time",
              longestStreak.value > 1 ? "s" : ""
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ u4("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ u4("div", { className: "flex flex-col justify-between text-base font-bold text-slate-600 h-fit select-none", children: daysInitial.map((day, i4) => /* @__PURE__ */ u4(
            "div",
            {
              className: "h-8 w-8 flex items-center justify-center border border-slate-300",
              title: daysName[i4],
              children: day
            },
            i4
          )) }),
          /* @__PURE__ */ u4("div", { className: "grid grid-rows-7 grid-flow-col gap-x-px h-56 flex-1 w-fit pb-1", children: dateRange.value.map((date, index) => {
            const dateKey = formattingDateObj(date);
            const doneDate = habit.value.done_dates[dateKey];
            const isDone = !(doneDate === void 0);
            const isToday = dateKey === today;
            let tooltipStatus = isDone ? "Completed" : "Missed";
            const localCreatedAt = habit.value.habit.created_at.replace(" ", "T") + "Z";
            const localDateCreatedAt = new Date(localCreatedAt);
            const createdAt = formattingDateObj(localDateCreatedAt).slice(0, 10);
            const createdDate = new Date(createdAt);
            createdDate.setHours(0);
            if (isDone) {
              createdDate.setDate(createdDate.getDate() - (freq - 1));
            }
            const isStarted = date >= createdDate || isDone;
            const todayDate = new Date(today);
            todayDate.setHours(0);
            const isTomorrow = date > todayDate;
            let bgClass;
            let textClass;
            let borderClass = "border-transparent";
            if (!isStarted) {
              bgClass = date.getMonth() % 2 == 1 ? "bg-slate-200" : "bg-gray-100";
              tooltipStatus = "Not Started";
            }
            if (isDone && isStarted) {
              bgClass = date.getMonth() % 2 == 0 ? "bg-cyan-200" : "bg-blue-200";
              textClass = "text-slate-700 font-semibold";
            }
            if (!isDone && isStarted) {
              bgClass = date.getMonth() % 2 == 0 ? "bg-rose-200" : "bg-red-100";
              textClass = "text-rose-700";
            }
            if (isToday) {
              bgClass = isDone ? "bg-cyan-200" : "bg-slate-100";
              borderClass = "border-background";
              textClass = "text-slate-800 font-bold";
            }
            if (isTomorrow) {
              bgClass = date.getMonth() % 2 == 1 ? "bg-slate-200" : "bg-gray-100";
              textClass = "";
              tooltipStatus = "Soon";
            }
            return /* @__PURE__ */ u4(
              "button",
              {
                style: { gridRowStart: index === 0 ? date.getDay() + 1 : "auto" },
                className: `
                  h-8 w-8 flex items-center justify-center text-base transition-all duration-200 border
                  ${bgClass} ${textClass} ${borderClass}
                  hover:scale-110 active:scale-95
                `,
                title: date.toDateString() + (isToday ? " - Today" : "") + " - " + tooltipStatus,
                children: date.getDate()
              },
              dateKey
            );
          }) })
        ] })
      ] });
    };
  }
});

// web/src/habits/habits.toggle.tsx
function Toggle({
  habitsGroupId,
  habitsGroupTitle,
  isShow,
  handleToggleHide,
  errorMessage,
  isDemo = false
}) {
  const isShowGroup = useSignal(isShow);
  const toggleHabitGroupIsShow = async (checked, habitsGroupId2) => {
    try {
      if (isDemo) {
        isShowGroup.value = checked;
        handleToggleHide(habitsGroupId2, checked);
        return;
      }
      const response = await fetch(`/habits/group/${habitsGroupId2}/is-show`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checked, habits_group_id: habitsGroupId2 })
      });
      if (response.redirected) window.location.replace(response.url);
      const data = await response.json();
      if (data.success) {
        isShowGroup.value = checked;
        handleToggleHide(habitsGroupId2, checked);
      }
      if (!data.success) errorMessage.value = "There's error in the backend.";
    } catch (error) {
      console.log(error);
      errorMessage.value = "There's error in the backend.";
    }
  };
  return /* @__PURE__ */ u4(
    "label",
    {
      htmlFor: habitsGroupTitle + "-" + String(habitsGroupId),
      class: "flex items-center cursor-pointer",
      children: [
        /* @__PURE__ */ u4("div", { class: "relative", children: [
          /* @__PURE__ */ u4(
            "input",
            {
              type: "checkbox",
              id: habitsGroupTitle + "-" + String(habitsGroupId),
              class: "sr-only peer",
              checked: isShowGroup.value,
              onChange: () => toggleHabitGroupIsShow(!isShowGroup.value, habitsGroupId)
            }
          ),
          /* @__PURE__ */ u4(
            "div",
            {
              class: `block w-11 h-6 rounded-full transition ${isShowGroup.value ? "bg-background" : "bg-gray-400"}`
            }
          ),
          /* @__PURE__ */ u4(
            "div",
            {
              class: `dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${isShowGroup.value ? "translate-x-5" : ""}`
            }
          )
        ] }),
        /* @__PURE__ */ u4("h4", { class: "ml-3 text-base font-medium text-background", children: habitsGroupTitle })
      ]
    }
  );
}
var init_habits_toggle = __esm({
  "web/src/habits/habits.toggle.tsx"() {
    "use strict";
    init_signals_module();
    init_jsxRuntime_module();
  }
});

// node_modules/emoji-picker-element/database.js
function assertNonEmptyString(str) {
  if (typeof str !== "string" || !str) {
    throw new Error("expected a non-empty string, got: " + str);
  }
}
function assertNumber(number) {
  if (typeof number !== "number") {
    throw new Error("expected a number, got: " + number);
  }
}
function uniqBy(arr, func) {
  const set2 = /* @__PURE__ */ new Set();
  const res = [];
  for (const item of arr) {
    const key = func(item);
    if (!set2.has(key)) {
      set2.add(key);
      res.push(item);
    }
  }
  return res;
}
function uniqEmoji(emojis) {
  return uniqBy(emojis, (_4) => _4.unicode);
}
function initialMigration(db) {
  function createObjectStore(name, keyPath, indexes) {
    const store = keyPath ? db.createObjectStore(name, { keyPath }) : db.createObjectStore(name);
    if (indexes) {
      for (const [indexName, [keyPath2, multiEntry]] of Object.entries(indexes)) {
        store.createIndex(indexName, keyPath2, { multiEntry });
      }
    }
    return store;
  }
  createObjectStore(STORE_KEYVALUE);
  createObjectStore(
    STORE_EMOJI,
    /* keyPath */
    FIELD_UNICODE,
    {
      [INDEX_TOKENS]: [
        FIELD_TOKENS,
        /* multiEntry */
        true
      ],
      [INDEX_GROUP_AND_ORDER]: [[FIELD_GROUP, FIELD_ORDER]],
      [INDEX_SKIN_UNICODE]: [
        FIELD_SKIN_UNICODE,
        /* multiEntry */
        true
      ]
    }
  );
  createObjectStore(STORE_FAVORITES, void 0, {
    [INDEX_COUNT]: [""]
  });
}
function handleOpenOrDeleteReq(resolve, reject, req) {
  req.onerror = () => reject(req.error);
  req.onblocked = () => reject(new Error("IDB blocked"));
  req.onsuccess = () => resolve(req.result);
}
async function createDatabase(dbName) {
  const db = await new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName, DB_VERSION_CURRENT);
    openIndexedDBRequests[dbName] = req;
    req.onupgradeneeded = (e4) => {
      if (e4.oldVersion < DB_VERSION_INITIAL) {
        initialMigration(req.result);
      }
    };
    handleOpenOrDeleteReq(resolve, reject, req);
  });
  db.onclose = () => closeDatabase(dbName);
  return db;
}
function openDatabase(dbName) {
  if (!databaseCache[dbName]) {
    databaseCache[dbName] = createDatabase(dbName);
  }
  return databaseCache[dbName];
}
function dbPromise(db, storeName, readOnlyOrReadWrite, cb) {
  return new Promise((resolve, reject) => {
    const txn = db.transaction(storeName, readOnlyOrReadWrite, { durability: "relaxed" });
    const store = typeof storeName === "string" ? txn.objectStore(storeName) : storeName.map((name) => txn.objectStore(name));
    let res;
    cb(store, txn, (result) => {
      res = result;
    });
    txn.oncomplete = () => resolve(res);
    txn.onerror = () => reject(txn.error);
  });
}
function closeDatabase(dbName) {
  const req = openIndexedDBRequests[dbName];
  const db = req && req.result;
  if (db) {
    db.close();
    const listeners = onCloseListeners[dbName];
    if (listeners) {
      for (const listener of listeners) {
        listener();
      }
    }
  }
  delete openIndexedDBRequests[dbName];
  delete databaseCache[dbName];
  delete onCloseListeners[dbName];
}
function deleteDatabase(dbName) {
  return new Promise((resolve, reject) => {
    closeDatabase(dbName);
    const req = indexedDB.deleteDatabase(dbName);
    handleOpenOrDeleteReq(resolve, reject, req);
  });
}
function addOnCloseListener(dbName, listener) {
  let listeners = onCloseListeners[dbName];
  if (!listeners) {
    listeners = onCloseListeners[dbName] = [];
  }
  listeners.push(listener);
}
function extractTokens(str) {
  return str.split(/[\s_]+/).map((word) => {
    if (!word.match(/\w/) || irregularEmoticons.has(word)) {
      return word.toLowerCase();
    }
    return word.replace(/[)(:,]/g, "").replace(/’/g, "'").toLowerCase();
  }).filter(Boolean);
}
function normalizeTokens(str) {
  return str.filter(Boolean).map((_4) => _4.toLowerCase()).filter((_4) => _4.length >= MIN_SEARCH_TEXT_LENGTH);
}
function transformEmojiData(emojiData) {
  const res = emojiData.map(({ annotation, emoticon, group, order, shortcodes, skins, tags, emoji, version }) => {
    const tokens = [...new Set(
      normalizeTokens([
        ...(shortcodes || []).map(extractTokens).flat(),
        ...(tags || []).map(extractTokens).flat(),
        ...extractTokens(annotation),
        emoticon
      ])
    )].sort();
    const res2 = {
      annotation,
      group,
      order,
      tags,
      tokens,
      unicode: emoji,
      version
    };
    if (emoticon) {
      res2.emoticon = emoticon;
    }
    if (shortcodes) {
      res2.shortcodes = shortcodes;
    }
    if (skins) {
      res2.skinTones = [];
      res2.skinUnicodes = [];
      res2.skinVersions = [];
      for (const { tone, emoji: emoji2, version: version2 } of skins) {
        res2.skinTones.push(tone);
        res2.skinUnicodes.push(emoji2);
        res2.skinVersions.push(version2);
      }
    }
    return res2;
  });
  return res;
}
function callStore(store, method, key, cb) {
  store[method](key).onsuccess = (e4) => cb && cb(e4.target.result);
}
function getIDB(store, key, cb) {
  callStore(store, "get", key, cb);
}
function getAllIDB(store, key, cb) {
  callStore(store, "getAll", key, cb);
}
function commit(txn) {
  if (txn.commit) {
    txn.commit();
  }
}
function minBy(array, func) {
  let minItem = array[0];
  for (let i4 = 1; i4 < array.length; i4++) {
    const item = array[i4];
    if (func(minItem) > func(item)) {
      minItem = item;
    }
  }
  return minItem;
}
function findCommonMembers(arrays, uniqByFunc) {
  const shortestArray = minBy(arrays, (_4) => _4.length);
  const results = [];
  for (const item of shortestArray) {
    if (!arrays.some((array) => array.findIndex((_4) => uniqByFunc(_4) === uniqByFunc(item)) === -1)) {
      results.push(item);
    }
  }
  return results;
}
async function isEmpty(db) {
  return !await get(db, STORE_KEYVALUE, KEY_URL);
}
async function hasData(db, url, eTag) {
  const [oldETag, oldUrl] = await Promise.all([KEY_ETAG, KEY_URL].map((key) => get(db, STORE_KEYVALUE, key)));
  return oldETag === eTag && oldUrl === url;
}
async function doFullDatabaseScanForSingleResult(db, predicate) {
  const BATCH_SIZE = 50;
  return dbPromise(db, STORE_EMOJI, MODE_READONLY, (emojiStore, txn, cb) => {
    let lastKey;
    const processNextBatch = () => {
      emojiStore.getAll(lastKey && IDBKeyRange.lowerBound(lastKey, true), BATCH_SIZE).onsuccess = (e4) => {
        const results = e4.target.result;
        for (const result of results) {
          lastKey = result.unicode;
          if (predicate(result)) {
            return cb(result);
          }
        }
        if (results.length < BATCH_SIZE) {
          return cb();
        }
        processNextBatch();
      };
    };
    processNextBatch();
  });
}
async function loadData(db, emojiData, url, eTag) {
  try {
    const transformedData = transformEmojiData(emojiData);
    await dbPromise(db, [STORE_EMOJI, STORE_KEYVALUE], MODE_READWRITE, ([emojiStore, metaStore], txn) => {
      let oldETag;
      let oldUrl;
      let todo = 0;
      function checkFetched() {
        if (++todo === 2) {
          onFetched();
        }
      }
      function onFetched() {
        if (oldETag === eTag && oldUrl === url) {
          return;
        }
        emojiStore.clear();
        for (const data of transformedData) {
          emojiStore.put(data);
        }
        metaStore.put(eTag, KEY_ETAG);
        metaStore.put(url, KEY_URL);
        commit(txn);
      }
      getIDB(metaStore, KEY_ETAG, (result) => {
        oldETag = result;
        checkFetched();
      });
      getIDB(metaStore, KEY_URL, (result) => {
        oldUrl = result;
        checkFetched();
      });
    });
  } finally {
  }
}
async function getEmojiByGroup(db, group) {
  return dbPromise(db, STORE_EMOJI, MODE_READONLY, (emojiStore, txn, cb) => {
    const range = IDBKeyRange.bound([group, 0], [group + 1, 0], false, true);
    getAllIDB(emojiStore.index(INDEX_GROUP_AND_ORDER), range, cb);
  });
}
async function getEmojiBySearchQuery(db, query) {
  const tokens = normalizeTokens(extractTokens(query));
  if (!tokens.length) {
    return [];
  }
  return dbPromise(db, STORE_EMOJI, MODE_READONLY, (emojiStore, txn, cb) => {
    const intermediateResults = [];
    const checkDone = () => {
      if (intermediateResults.length === tokens.length) {
        onDone();
      }
    };
    const onDone = () => {
      const results = findCommonMembers(intermediateResults, (_4) => _4.unicode);
      cb(results.sort((a4, b3) => a4.order < b3.order ? -1 : 1));
    };
    for (let i4 = 0; i4 < tokens.length; i4++) {
      const token = tokens[i4];
      const range = i4 === tokens.length - 1 ? IDBKeyRange.bound(token, token + "\uFFFF", false, true) : IDBKeyRange.only(token);
      getAllIDB(emojiStore.index(INDEX_TOKENS), range, (result) => {
        intermediateResults.push(result);
        checkDone();
      });
    }
  });
}
async function getEmojiByShortcode(db, shortcode) {
  const emojis = await getEmojiBySearchQuery(db, shortcode);
  if (!emojis.length) {
    const predicate = (_4) => (_4.shortcodes || []).includes(shortcode.toLowerCase());
    return await doFullDatabaseScanForSingleResult(db, predicate) || null;
  }
  return emojis.filter((_4) => {
    const lowerShortcodes = (_4.shortcodes || []).map((_5) => _5.toLowerCase());
    return lowerShortcodes.includes(shortcode.toLowerCase());
  })[0] || null;
}
async function getEmojiByUnicode(db, unicode) {
  return dbPromise(db, STORE_EMOJI, MODE_READONLY, (emojiStore, txn, cb) => getIDB(emojiStore, unicode, (result) => {
    if (result) {
      return cb(result);
    }
    getIDB(emojiStore.index(INDEX_SKIN_UNICODE), unicode, (result2) => cb(result2 || null));
  }));
}
function get(db, storeName, key) {
  return dbPromise(db, storeName, MODE_READONLY, (store, txn, cb) => getIDB(store, key, cb));
}
function set(db, storeName, key, value) {
  return dbPromise(db, storeName, MODE_READWRITE, (store, txn) => {
    store.put(value, key);
    commit(txn);
  });
}
function incrementFavoriteEmojiCount(db, unicode) {
  return dbPromise(db, STORE_FAVORITES, MODE_READWRITE, (store, txn) => getIDB(store, unicode, (result) => {
    store.put((result || 0) + 1, unicode);
    commit(txn);
  }));
}
function getTopFavoriteEmoji(db, customEmojiIndex2, limit) {
  if (limit === 0) {
    return [];
  }
  return dbPromise(db, [STORE_FAVORITES, STORE_EMOJI], MODE_READONLY, ([favoritesStore, emojiStore], txn, cb) => {
    const results = [];
    favoritesStore.index(INDEX_COUNT).openCursor(void 0, "prev").onsuccess = (e4) => {
      const cursor = e4.target.result;
      if (!cursor) {
        return cb(results);
      }
      function addResult(result) {
        results.push(result);
        if (results.length === limit) {
          return cb(results);
        }
        cursor.continue();
      }
      const unicodeOrName = cursor.primaryKey;
      const custom = customEmojiIndex2.byName(unicodeOrName);
      if (custom) {
        return addResult(custom);
      }
      getIDB(emojiStore, unicodeOrName, (emoji) => {
        if (emoji) {
          return addResult(emoji);
        }
        cursor.continue();
      });
    };
  });
}
function trie(arr, itemToTokens) {
  const map = /* @__PURE__ */ new Map();
  for (const item of arr) {
    const tokens = itemToTokens(item);
    for (const token of tokens) {
      let currentMap = map;
      for (let i4 = 0; i4 < token.length; i4++) {
        const char = token.charAt(i4);
        let nextMap = currentMap.get(char);
        if (!nextMap) {
          nextMap = /* @__PURE__ */ new Map();
          currentMap.set(char, nextMap);
        }
        currentMap = nextMap;
      }
      let valuesAtCoda = currentMap.get(CODA_MARKER);
      if (!valuesAtCoda) {
        valuesAtCoda = [];
        currentMap.set(CODA_MARKER, valuesAtCoda);
      }
      valuesAtCoda.push(item);
    }
  }
  const search = (query, exact) => {
    let currentMap = map;
    for (let i4 = 0; i4 < query.length; i4++) {
      const char = query.charAt(i4);
      const nextMap = currentMap.get(char);
      if (nextMap) {
        currentMap = nextMap;
      } else {
        return [];
      }
    }
    if (exact) {
      const results2 = currentMap.get(CODA_MARKER);
      return results2 || [];
    }
    const results = [];
    const queue = [currentMap];
    while (queue.length) {
      const currentMap2 = queue.shift();
      const entriesSortedByKey = [...currentMap2.entries()].sort((a4, b3) => a4[0] < b3[0] ? -1 : 1);
      for (const [key, value] of entriesSortedByKey) {
        if (key === CODA_MARKER) {
          results.push(...value);
        } else {
          queue.push(value);
        }
      }
    }
    return results;
  };
  return search;
}
function assertCustomEmojis(customEmojis) {
  const isArray = customEmojis && Array.isArray(customEmojis);
  const firstItemIsFaulty = isArray && customEmojis.length && (!customEmojis[0] || requiredKeys$1.some((key) => !(key in customEmojis[0])));
  if (!isArray || firstItemIsFaulty) {
    throw new Error("Custom emojis are in the wrong format");
  }
}
function customEmojiIndex(customEmojis) {
  assertCustomEmojis(customEmojis);
  const sortByName = (a4, b3) => a4.name.toLowerCase() < b3.name.toLowerCase() ? -1 : 1;
  const all = customEmojis.sort(sortByName);
  const emojiToTokens = (emoji) => {
    const set2 = /* @__PURE__ */ new Set();
    if (emoji.shortcodes) {
      for (const shortcode of emoji.shortcodes) {
        for (const token of extractTokens(shortcode)) {
          set2.add(token);
        }
      }
    }
    return set2;
  };
  const searchTrie = trie(customEmojis, emojiToTokens);
  const searchByExactMatch = (_4) => searchTrie(_4, true);
  const searchByPrefix = (_4) => searchTrie(_4, false);
  const search = (query) => {
    const tokens = extractTokens(query);
    const intermediateResults = tokens.map((token, i4) => (i4 < tokens.length - 1 ? searchByExactMatch : searchByPrefix)(token));
    return findCommonMembers(intermediateResults, (_4) => _4.name).sort(sortByName);
  };
  const shortcodeToEmoji = /* @__PURE__ */ new Map();
  const nameToEmoji = /* @__PURE__ */ new Map();
  for (const customEmoji of customEmojis) {
    nameToEmoji.set(customEmoji.name.toLowerCase(), customEmoji);
    for (const shortcode of customEmoji.shortcodes || []) {
      shortcodeToEmoji.set(shortcode.toLowerCase(), customEmoji);
    }
  }
  const byShortcode = (shortcode) => shortcodeToEmoji.get(shortcode.toLowerCase());
  const byName = (name) => nameToEmoji.get(name.toLowerCase());
  return {
    all,
    search,
    byShortcode,
    byName
  };
}
function cleanEmoji(emoji) {
  if (!emoji) {
    return emoji;
  }
  if (isFirefoxContentScript) {
    emoji = structuredClone(emoji);
  }
  delete emoji.tokens;
  if (emoji.skinTones) {
    const len = emoji.skinTones.length;
    emoji.skins = Array(len);
    for (let i4 = 0; i4 < len; i4++) {
      emoji.skins[i4] = {
        tone: emoji.skinTones[i4],
        unicode: emoji.skinUnicodes[i4],
        version: emoji.skinVersions[i4]
      };
    }
    delete emoji.skinTones;
    delete emoji.skinUnicodes;
    delete emoji.skinVersions;
  }
  return emoji;
}
function warnETag(eTag) {
  if (!eTag) {
    console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.");
  }
}
function assertEmojiData(emojiData) {
  if (!emojiData || !Array.isArray(emojiData) || !emojiData[0] || typeof emojiData[0] !== "object" || requiredKeys.some((key) => !(key in emojiData[0]))) {
    throw new Error("Emoji data is in the wrong format");
  }
}
function assertStatus(response, dataSource) {
  if (Math.floor(response.status / 100) !== 2) {
    throw new Error("Failed to fetch: " + dataSource + ":  " + response.status);
  }
}
async function getETag(dataSource) {
  const response = await fetch(dataSource, { method: "HEAD" });
  assertStatus(response, dataSource);
  const eTag = response.headers.get("etag");
  warnETag(eTag);
  return eTag;
}
async function getETagAndData(dataSource) {
  const response = await fetch(dataSource);
  assertStatus(response, dataSource);
  const eTag = response.headers.get("etag");
  warnETag(eTag);
  const emojiData = await response.json();
  assertEmojiData(emojiData);
  return [eTag, emojiData];
}
function arrayBufferToBinaryString(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var length = bytes.byteLength;
  var i4 = -1;
  while (++i4 < length) {
    binary += String.fromCharCode(bytes[i4]);
  }
  return binary;
}
function binaryStringToArrayBuffer(binary) {
  var length = binary.length;
  var buf = new ArrayBuffer(length);
  var arr = new Uint8Array(buf);
  var i4 = -1;
  while (++i4 < length) {
    arr[i4] = binary.charCodeAt(i4);
  }
  return buf;
}
async function jsonChecksum(object) {
  const inString = JSON.stringify(object);
  let inBuffer = binaryStringToArrayBuffer(inString);
  const outBuffer = await crypto.subtle.digest("SHA-1", inBuffer);
  const outBinString = arrayBufferToBinaryString(outBuffer);
  const res = btoa(outBinString);
  return res;
}
async function doCheckForUpdates(db, dataSource) {
  let emojiData;
  let eTag = await getETag(dataSource);
  if (!eTag) {
    const eTagAndData = await getETagAndData(dataSource);
    eTag = eTagAndData[0];
    emojiData = eTagAndData[1];
    if (!eTag) {
      eTag = await jsonChecksum(emojiData);
    }
  }
  if (await hasData(db, dataSource, eTag)) ;
  else {
    if (!emojiData) {
      const eTagAndData = await getETagAndData(dataSource);
      emojiData = eTagAndData[1];
    }
    await loadData(db, emojiData, dataSource, eTag);
  }
}
async function loadDataForFirstTime(db, dataSource) {
  let [eTag, emojiData] = await getETagAndData(dataSource);
  if (!eTag) {
    eTag = await jsonChecksum(emojiData);
  }
  await loadData(db, emojiData, dataSource, eTag);
}
async function checkForUpdates(db, dataSource) {
  try {
    await doCheckForUpdates(db, dataSource);
  } catch (err) {
    if (err.name !== "InvalidStateError") {
      throw err;
    }
  }
}
var DB_VERSION_CURRENT, DB_VERSION_INITIAL, STORE_EMOJI, STORE_KEYVALUE, STORE_FAVORITES, FIELD_TOKENS, INDEX_TOKENS, FIELD_UNICODE, INDEX_COUNT, FIELD_GROUP, FIELD_ORDER, INDEX_GROUP_AND_ORDER, KEY_ETAG, KEY_URL, KEY_PREFERRED_SKINTONE, MODE_READONLY, MODE_READWRITE, INDEX_SKIN_UNICODE, FIELD_SKIN_UNICODE, DEFAULT_DATA_SOURCE, DEFAULT_LOCALE, openIndexedDBRequests, databaseCache, onCloseListeners, irregularEmoticons, MIN_SEARCH_TEXT_LENGTH, CODA_MARKER, requiredKeys$1, isFirefoxContentScript, requiredKeys, Database;
var init_database = __esm({
  "node_modules/emoji-picker-element/database.js"() {
    DB_VERSION_CURRENT = 1;
    DB_VERSION_INITIAL = 1;
    STORE_EMOJI = "emoji";
    STORE_KEYVALUE = "keyvalue";
    STORE_FAVORITES = "favorites";
    FIELD_TOKENS = "tokens";
    INDEX_TOKENS = "tokens";
    FIELD_UNICODE = "unicode";
    INDEX_COUNT = "count";
    FIELD_GROUP = "group";
    FIELD_ORDER = "order";
    INDEX_GROUP_AND_ORDER = "group-order";
    KEY_ETAG = "eTag";
    KEY_URL = "url";
    KEY_PREFERRED_SKINTONE = "skinTone";
    MODE_READONLY = "readonly";
    MODE_READWRITE = "readwrite";
    INDEX_SKIN_UNICODE = "skinUnicodes";
    FIELD_SKIN_UNICODE = "skinUnicodes";
    DEFAULT_DATA_SOURCE = "https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json";
    DEFAULT_LOCALE = "en";
    openIndexedDBRequests = {};
    databaseCache = {};
    onCloseListeners = {};
    irregularEmoticons = /* @__PURE__ */ new Set([
      ":D",
      "XD",
      ":'D",
      "O:)",
      ":X",
      ":P",
      ";P",
      "XP",
      ":L",
      ":Z",
      ":j",
      "8D",
      "XO",
      "8)",
      ":B",
      ":O",
      ":S",
      ":'o",
      "Dx",
      "X(",
      "D:",
      ":C",
      ">0)",
      ":3",
      "</3",
      "<3",
      "\\M/",
      ":E",
      "8#"
    ]);
    MIN_SEARCH_TEXT_LENGTH = 2;
    CODA_MARKER = "";
    requiredKeys$1 = [
      "name",
      "url"
    ];
    isFirefoxContentScript = typeof wrappedJSObject !== "undefined";
    requiredKeys = [
      "annotation",
      "emoji",
      "group",
      "order",
      "version"
    ];
    Database = class {
      constructor({ dataSource = DEFAULT_DATA_SOURCE, locale = DEFAULT_LOCALE, customEmoji = [] } = {}) {
        this.dataSource = dataSource;
        this.locale = locale;
        this._dbName = `emoji-picker-element-${this.locale}`;
        this._db = void 0;
        this._lazyUpdate = void 0;
        this._custom = customEmojiIndex(customEmoji);
        this._clear = this._clear.bind(this);
        this._ready = this._init();
      }
      async _init() {
        const db = this._db = await openDatabase(this._dbName);
        addOnCloseListener(this._dbName, this._clear);
        const dataSource = this.dataSource;
        const empty = await isEmpty(db);
        if (empty) {
          await loadDataForFirstTime(db, dataSource);
        } else {
          this._lazyUpdate = checkForUpdates(db, dataSource);
        }
      }
      async ready() {
        const checkReady = async () => {
          if (!this._ready) {
            this._ready = this._init();
          }
          return this._ready;
        };
        await checkReady();
        if (!this._db) {
          await checkReady();
        }
      }
      async getEmojiByGroup(group) {
        assertNumber(group);
        await this.ready();
        return uniqEmoji(await getEmojiByGroup(this._db, group)).map(cleanEmoji);
      }
      async getEmojiBySearchQuery(query) {
        assertNonEmptyString(query);
        await this.ready();
        const customs = this._custom.search(query);
        const natives = uniqEmoji(await getEmojiBySearchQuery(this._db, query)).map(cleanEmoji);
        return [
          ...customs,
          ...natives
        ];
      }
      async getEmojiByShortcode(shortcode) {
        assertNonEmptyString(shortcode);
        await this.ready();
        const custom = this._custom.byShortcode(shortcode);
        if (custom) {
          return custom;
        }
        return cleanEmoji(await getEmojiByShortcode(this._db, shortcode));
      }
      async getEmojiByUnicodeOrName(unicodeOrName) {
        assertNonEmptyString(unicodeOrName);
        await this.ready();
        const custom = this._custom.byName(unicodeOrName);
        if (custom) {
          return custom;
        }
        return cleanEmoji(await getEmojiByUnicode(this._db, unicodeOrName));
      }
      async getPreferredSkinTone() {
        await this.ready();
        return await get(this._db, STORE_KEYVALUE, KEY_PREFERRED_SKINTONE) || 0;
      }
      async setPreferredSkinTone(skinTone) {
        assertNumber(skinTone);
        await this.ready();
        return set(this._db, STORE_KEYVALUE, KEY_PREFERRED_SKINTONE, skinTone);
      }
      async incrementFavoriteEmojiCount(unicodeOrName) {
        assertNonEmptyString(unicodeOrName);
        await this.ready();
        return incrementFavoriteEmojiCount(this._db, unicodeOrName);
      }
      async getTopFavoriteEmoji(limit) {
        assertNumber(limit);
        await this.ready();
        return (await getTopFavoriteEmoji(this._db, this._custom, limit)).map(cleanEmoji);
      }
      set customEmoji(customEmojis) {
        this._custom = customEmojiIndex(customEmojis);
      }
      get customEmoji() {
        return this._custom.all;
      }
      async _shutdown() {
        await this.ready();
        try {
          await this._lazyUpdate;
        } catch (err) {
        }
      }
      // clear references to IDB, e.g. during a close event
      _clear() {
        this._db = this._ready = this._lazyUpdate = void 0;
      }
      async close() {
        await this._shutdown();
        await closeDatabase(this._dbName);
      }
      async delete() {
        await this._shutdown();
        await deleteDatabase(this._dbName);
      }
    };
  }
});

// node_modules/emoji-picker-element/picker.js
function hasZwj(emoji) {
  return emoji.unicode.includes("\u200D");
}
function testColorEmojiSupported(text) {
  const feature1 = getTextFeature(text, "#000");
  const feature2 = getTextFeature(text, "#fff");
  return feature1 && feature2 && compareFeatures(feature1, feature2);
}
function determineEmojiSupportLevel() {
  const entries = Object.entries(versionsAndTestEmoji);
  try {
    for (const [emoji, version] of entries) {
      if (testColorEmojiSupported(emoji)) {
        return version;
      }
    }
  } catch (e4) {
  } finally {
  }
  return entries[0][1];
}
function applySkinTone(str, skinTone) {
  if (skinTone === 0) {
    return str;
  }
  const zwjIndex = str.indexOf(ZWJ);
  if (zwjIndex !== -1) {
    return str.substring(0, zwjIndex) + String.fromCodePoint(LIGHT_SKIN_TONE + skinTone - 1) + str.substring(zwjIndex);
  }
  if (str.endsWith(VARIATION_SELECTOR)) {
    str = str.substring(0, str.length - 1);
  }
  return str + SKINTONE_MODIFIER + String.fromCodePoint(LIGHT_SKIN_TONE_MODIFIER + skinTone - 1);
}
function halt(event) {
  event.preventDefault();
  event.stopPropagation();
}
function incrementOrDecrement(decrement, val, arr) {
  val += decrement ? -1 : 1;
  if (val < 0) {
    val = arr.length - 1;
  } else if (val >= arr.length) {
    val = 0;
  }
  return val;
}
function uniqBy2(arr, func) {
  const set2 = /* @__PURE__ */ new Set();
  const res = [];
  for (const item of arr) {
    const key = func(item);
    if (!set2.has(key)) {
      set2.add(key);
      res.push(item);
    }
  }
  return res;
}
function summarizeEmojisForUI(emojis, emojiSupportLevel) {
  const toSimpleSkinsMap = (skins) => {
    const res = {};
    for (const skin of skins) {
      if (typeof skin.tone === "number" && skin.version <= emojiSupportLevel) {
        res[skin.tone] = skin.unicode;
      }
    }
    return res;
  };
  return emojis.map(({ unicode, skins, shortcodes, url, name, category, annotation }) => ({
    unicode,
    name,
    shortcodes,
    url,
    category,
    annotation,
    id: unicode || name,
    skins: skins && toSimpleSkinsMap(skins)
  }));
}
function resizeObserverAction(node, abortSignal, onUpdate) {
  let resizeObserver;
  if (resizeObserverSupported) {
    resizeObserver = new ResizeObserver(onUpdate);
    resizeObserver.observe(node);
  } else {
    rAF(onUpdate);
  }
  abortSignal.addEventListener("abort", () => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });
}
function calculateTextWidth(node) {
  {
    const range = document.createRange();
    range.selectNode(node.firstChild);
    return range.getBoundingClientRect().width;
  }
}
function checkZwjSupport(zwjEmojisToCheck, baselineEmoji, emojiToDomNode) {
  let allSupported = true;
  let shouldWarn = false;
  for (const emoji of zwjEmojisToCheck) {
    const domNode = emojiToDomNode(emoji);
    if (!domNode) {
      continue;
    }
    const emojiWidth = calculateTextWidth(domNode);
    if (emojiWidth === 0) {
      shouldWarn = true;
    }
    if (typeof baselineEmojiWidth === "undefined") {
      baselineEmojiWidth = calculateTextWidth(baselineEmoji);
    }
    const supported = emojiWidth / 1.8 < baselineEmojiWidth;
    supportedZwjEmojis.set(emoji.unicode, supported);
    if (!supported) {
      allSupported = false;
    }
  }
  if (shouldWarn) {
    console.warn(
      "Emoji support detection failed - emoji character is 0 width.\nThis is likely due to using `display:none` which is unsupported.\nIf this is a Jest/Vitest environment, you can ignore this warning.\nFor details see: https://github.com/nolanlawson/emoji-picker-element/issues/514"
    );
  }
  return allSupported;
}
function uniq(arr) {
  return uniqBy2(arr, (_4) => _4);
}
function resetScrollTopIfPossible(element) {
  if (element) {
    element.scrollTop = 0;
  }
}
function getFromMap(cache, key, func) {
  let cached = cache.get(key);
  if (!cached) {
    cached = func();
    cache.set(key, cached);
  }
  return cached;
}
function toString(value) {
  return "" + value;
}
function parseTemplate(htmlString) {
  const template = document.createElement("template");
  template.innerHTML = htmlString;
  return template;
}
function replaceChildren(parentNode, newChildren) {
  if (hasReplaceChildren) {
    parentNode.replaceChildren(...newChildren);
  } else {
    parentNode.innerHTML = "";
    parentNode.append(...newChildren);
  }
}
function doChildrenNeedRerender(parentNode, newChildren) {
  let oldChild = parentNode.firstChild;
  let oldChildrenCount = 0;
  while (oldChild) {
    const newChild = newChildren[oldChildrenCount];
    if (newChild !== oldChild) {
      return true;
    }
    oldChild = oldChild.nextSibling;
    oldChildrenCount++;
  }
  return oldChildrenCount !== newChildren.length;
}
function patchChildren(newChildren, instanceBinding) {
  const { targetNode } = instanceBinding;
  let { targetParentNode } = instanceBinding;
  let needsRerender = false;
  if (targetParentNode) {
    needsRerender = doChildrenNeedRerender(targetParentNode, newChildren);
  } else {
    needsRerender = true;
    instanceBinding.targetNode = void 0;
    instanceBinding.targetParentNode = targetParentNode = targetNode.parentNode;
  }
  if (needsRerender) {
    replaceChildren(targetParentNode, newChildren);
  }
}
function patch(expressions, instanceBindings) {
  for (const instanceBinding of instanceBindings) {
    const {
      targetNode,
      currentExpression,
      binding: {
        expressionIndex,
        attributeName,
        attributeValuePre,
        attributeValuePost
      }
    } = instanceBinding;
    const expression = expressions[expressionIndex];
    if (currentExpression === expression) {
      continue;
    }
    instanceBinding.currentExpression = expression;
    if (attributeName) {
      if (expression === null) {
        targetNode.removeAttribute(attributeName);
      } else {
        const newValue = attributeValuePre + toString(expression) + attributeValuePost;
        targetNode.setAttribute(attributeName, newValue);
      }
    } else {
      let newNode;
      if (Array.isArray(expression)) {
        patchChildren(expression, instanceBinding);
      } else if (expression instanceof Element) {
        newNode = expression;
        targetNode.replaceWith(newNode);
      } else {
        targetNode.nodeValue = toString(expression);
      }
      if (newNode) {
        instanceBinding.targetNode = newNode;
      }
    }
  }
}
function parse(tokens) {
  let htmlString = "";
  let withinTag = false;
  let withinAttribute = false;
  let elementIndexCounter = -1;
  const elementsToBindings = /* @__PURE__ */ new Map();
  const elementIndexes = [];
  let skipTokenChars = 0;
  for (let i4 = 0, len = tokens.length; i4 < len; i4++) {
    const token = tokens[i4];
    htmlString += token.slice(skipTokenChars);
    if (i4 === len - 1) {
      break;
    }
    for (let j3 = 0; j3 < token.length; j3++) {
      const char = token.charAt(j3);
      switch (char) {
        case "<": {
          const nextChar = token.charAt(j3 + 1);
          if (nextChar === "/") {
            elementIndexes.pop();
          } else {
            withinTag = true;
            elementIndexes.push(++elementIndexCounter);
          }
          break;
        }
        case ">": {
          withinTag = false;
          withinAttribute = false;
          break;
        }
        case "=": {
          withinAttribute = true;
          break;
        }
      }
    }
    const elementIndex = elementIndexes[elementIndexes.length - 1];
    const bindings = getFromMap(elementsToBindings, elementIndex, () => []);
    let attributeName;
    let attributeValuePre;
    let attributeValuePost;
    if (withinAttribute) {
      const attributePreMatch = /(\S+)="?([^"=]*)$/.exec(token);
      attributeName = attributePreMatch[1];
      attributeValuePre = attributePreMatch[2];
      const attributePostMatch = /^([^">]*)("?)/.exec(tokens[i4 + 1]);
      attributeValuePost = attributePostMatch[1];
      htmlString = htmlString.slice(0, -1 * attributePreMatch[0].length);
      skipTokenChars = attributePostMatch[0].length;
    } else {
      skipTokenChars = 0;
    }
    const binding = {
      attributeName,
      attributeValuePre,
      attributeValuePost,
      expressionIndex: i4
    };
    bindings.push(binding);
    if (!withinTag && !withinAttribute) {
      htmlString += " ";
    }
  }
  const template = parseTemplate(htmlString);
  return {
    template,
    elementsToBindings
  };
}
function applyBindings(bindings, element, instanceBindings) {
  for (let i4 = 0; i4 < bindings.length; i4++) {
    const binding = bindings[i4];
    const targetNode = binding.attributeName ? element : element.firstChild;
    const instanceBinding = {
      binding,
      targetNode,
      targetParentNode: void 0,
      currentExpression: void 0
    };
    instanceBindings.push(instanceBinding);
  }
}
function traverseAndSetupBindings(rootElement, elementsToBindings) {
  const instanceBindings = [];
  let topLevelBindings;
  if (elementsToBindings.size === 1 && (topLevelBindings = elementsToBindings.get(0))) {
    applyBindings(topLevelBindings, rootElement, instanceBindings);
  } else {
    const treeWalker = document.createTreeWalker(rootElement, NodeFilter.SHOW_ELEMENT);
    let element = rootElement;
    let elementIndex = -1;
    do {
      const bindings = elementsToBindings.get(++elementIndex);
      if (bindings) {
        applyBindings(bindings, element, instanceBindings);
      }
    } while (element = treeWalker.nextNode());
  }
  return instanceBindings;
}
function parseHtml(tokens) {
  const { template, elementsToBindings } = getFromMap(parseCache, tokens, () => parse(tokens));
  const dom = template.cloneNode(true).content.firstElementChild;
  const instanceBindings = traverseAndSetupBindings(dom, elementsToBindings);
  return function updateDomInstance(expressions) {
    patch(expressions, instanceBindings);
    return dom;
  };
}
function createFramework(state) {
  const domInstances = getFromMap(domInstancesCache, state, () => /* @__PURE__ */ new Map());
  let domInstanceCacheKey = unkeyedSymbol;
  function html(tokens, ...expressions) {
    const domInstancesForTokens = getFromMap(domInstances, tokens, () => /* @__PURE__ */ new Map());
    const updateDomInstance = getFromMap(domInstancesForTokens, domInstanceCacheKey, () => parseHtml(tokens));
    return updateDomInstance(expressions);
  }
  function map(array, callback, keyFunction) {
    return array.map((item, index) => {
      const originalCacheKey = domInstanceCacheKey;
      domInstanceCacheKey = keyFunction(item);
      try {
        return callback(item, index);
      } finally {
        domInstanceCacheKey = originalCacheKey;
      }
    });
  }
  return { map, html };
}
function render(container, state, helpers, events, actions, refs, abortSignal, actionContext, firstRender) {
  const { labelWithSkin, titleForEmoji, unicodeWithSkin } = helpers;
  const { html, map } = createFramework(state);
  function emojiList(emojis, searchMode, prefix) {
    return map(emojis, (emoji, i4) => {
      return html`<button role="${searchMode ? "option" : "menuitem"}" aria-selected="${searchMode ? i4 === state.activeSearchItem : null}" aria-label="${labelWithSkin(emoji, state.currentSkinTone)}" title="${titleForEmoji(emoji)}" class="${"emoji" + (searchMode && i4 === state.activeSearchItem ? " active" : "") + (emoji.unicode ? "" : " custom-emoji")}" id="${`${prefix}-${emoji.id}`}" style="${emoji.unicode ? null : `--custom-emoji-background: url(${JSON.stringify(emoji.url)})`}">${emoji.unicode ? unicodeWithSkin(emoji, state.currentSkinTone) : ""}</button>`;
    }, (emoji) => `${prefix}-${emoji.id}`);
  }
  const section = () => {
    return html`<section data-ref="rootElement" class="picker" aria-label="${state.i18n.regionLabel}" style="${state.pickerStyle || ""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${state.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(state.searchMode && state.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${state.activeSearchItemId ? `emo-${state.activeSearchItemId}` : null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${state.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${state.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${state.skinTonePickerExpandedAfterAnimation ? "expanded" : ""}"><button id="skintone-button" class="emoji ${state.skinTonePickerExpanded ? "hide-focus" : ""}" aria-label="${state.skinToneButtonLabel}" title="${state.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${state.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${state.skinToneButtonText || ""}</button></div><span id="skintone-description" class="sr-only">${state.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${state.skinTonePickerExpanded ? "" : "hidden no-animate"}" style="transform:translateY(${state.skinTonePickerExpanded ? 0 : "calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${state.i18n.skinTonesLabel}" aria-activedescendant="skintone-${state.activeSkinTone}" aria-hidden="${!state.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${map(state.skinTones, (skinTone, i4) => {
      return html`<div id="skintone-${i4}" class="emoji ${i4 === state.activeSkinTone ? "active" : ""}" aria-selected="${i4 === state.activeSkinTone}" role="option" title="${state.i18n.skinTones[i4]}" aria-label="${state.i18n.skinTones[i4]}">${skinTone}</div>`;
    }, (skinTone) => skinTone)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${state.groups.length},1fr)" aria-label="${state.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${map(state.groups, (group) => {
      return html`<button role="tab" class="nav-button" aria-controls="tab-${group.id}" aria-label="${state.i18n.categories[group.name]}" aria-selected="${!state.searchMode && state.currentGroup.id === group.id}" title="${state.i18n.categories[group.name]}" data-group-id="${group.id}"><div class="nav-emoji emoji">${group.emoji}</div></button>`;
    }, (group) => group.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${/* istanbul ignore next */
    (state.isRtl ? -1 : 1) * state.currentGroupIndex * 100}%)"></div></div><div class="message ${state.message ? "" : "gone"}" role="alert" aria-live="polite">${state.message || ""}</div><div data-ref="tabpanelElement" class="tabpanel ${!state.databaseLoaded || state.message ? "gone" : ""}" role="${state.searchMode ? "region" : "tabpanel"}" aria-label="${state.searchMode ? state.i18n.searchResultsLabel : state.i18n.categories[state.currentGroup.name]}" id="${state.searchMode ? null : `tab-${state.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${map(state.currentEmojisWithCategories, (emojiWithCategory, i4) => {
      return html`<div><div id="menu-label-${i4}" class="category ${state.currentEmojisWithCategories.length === 1 && state.currentEmojisWithCategories[0].category === "" ? "gone" : ""}" aria-hidden="true">${state.searchMode ? state.i18n.searchResultsLabel : emojiWithCategory.category ? emojiWithCategory.category : state.currentEmojisWithCategories.length > 1 ? state.i18n.categories.custom : state.i18n.categories[state.currentGroup.name]}</div><div class="emoji-menu ${i4 !== 0 && !state.searchMode && state.currentGroup.id === -1 ? "visibility-auto" : ""}" style="${`--num-rows: ${Math.ceil(emojiWithCategory.emojis.length / state.numColumns)}`}" data-action="updateOnIntersection" role="${state.searchMode ? "listbox" : "menu"}" aria-labelledby="menu-label-${i4}" id="${state.searchMode ? "search-results" : null}">${emojiList(
        emojiWithCategory.emojis,
        state.searchMode,
        /* prefix */
        "emo"
      )}</div></div>`;
    }, (emojiWithCategory) => emojiWithCategory.category)}</div></div><div class="favorites onscreen emoji-menu ${state.message ? "gone" : ""}" role="menu" aria-label="${state.i18n.favoritesLabel}" data-on-click="onEmojiClick">${emojiList(
      state.currentFavorites,
      /* searchMode */
      false,
      /* prefix */
      "fav"
    )}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`;
  };
  const rootDom = section();
  const forElementWithAttribute = (attributeName, callback) => {
    for (const element of container.querySelectorAll(`[${attributeName}]`)) {
      callback(element, element.getAttribute(attributeName));
    }
  };
  if (firstRender) {
    container.appendChild(rootDom);
    for (const eventName of ["click", "focusout", "input", "keydown", "keyup"]) {
      forElementWithAttribute(`data-on-${eventName}`, (element, listenerName) => {
        element.addEventListener(eventName, events[listenerName]);
      });
    }
    forElementWithAttribute("data-ref", (element, ref) => {
      refs[ref] = element;
    });
    abortSignal.addEventListener("abort", () => {
      container.removeChild(rootDom);
    });
  }
  forElementWithAttribute("data-action", (element, action) => {
    let boundActions = actionContext.get(action);
    if (!boundActions) {
      actionContext.set(action, boundActions = /* @__PURE__ */ new WeakSet());
    }
    if (!boundActions.has(element)) {
      boundActions.add(element);
      actions[action](element);
    }
  });
}
function createState(abortSignal) {
  let destroyed = false;
  let currentObserver;
  const propsToObservers = /* @__PURE__ */ new Map();
  const dirtyObservers = /* @__PURE__ */ new Set();
  let queued;
  const flush = () => {
    if (destroyed) {
      return;
    }
    const observersToRun = [...dirtyObservers];
    dirtyObservers.clear();
    try {
      for (const observer of observersToRun) {
        observer();
      }
    } finally {
      queued = false;
      if (dirtyObservers.size) {
        queued = true;
        qM(flush);
      }
    }
  };
  const state = new Proxy({}, {
    get(target, prop) {
      if (currentObserver) {
        let observers = propsToObservers.get(prop);
        if (!observers) {
          observers = /* @__PURE__ */ new Set();
          propsToObservers.set(prop, observers);
        }
        observers.add(currentObserver);
      }
      return target[prop];
    },
    set(target, prop, newValue) {
      if (target[prop] !== newValue) {
        target[prop] = newValue;
        const observers = propsToObservers.get(prop);
        if (observers) {
          for (const observer of observers) {
            dirtyObservers.add(observer);
          }
          if (!queued) {
            queued = true;
            qM(flush);
          }
        }
      }
      return true;
    }
  });
  const createEffect = (callback) => {
    const runnable = () => {
      const oldObserver = currentObserver;
      currentObserver = runnable;
      try {
        return callback();
      } finally {
        currentObserver = oldObserver;
      }
    };
    return runnable();
  };
  abortSignal.addEventListener("abort", () => {
    destroyed = true;
  });
  return {
    state,
    createEffect
  };
}
function arraysAreEqualByFunction(left, right, areEqualFunc) {
  if (left.length !== right.length) {
    return false;
  }
  for (let i4 = 0; i4 < left.length; i4++) {
    if (!areEqualFunc(left[i4], right[i4])) {
      return false;
    }
  }
  return true;
}
function intersectionObserverAction(node, abortSignal, listener) {
  {
    const root = node.closest(".tabpanel");
    let observer = intersectionObserverCache.get(root);
    if (!observer) {
      observer = new IntersectionObserver(listener, {
        root,
        // trigger if we are 1/2 scroll container height away so that the images load a bit quicker while scrolling
        rootMargin: "50% 0px 50% 0px",
        // trigger if any part of the emoji grid is intersecting
        threshold: 0
      });
      intersectionObserverCache.set(root, observer);
      abortSignal.addEventListener("abort", () => {
        observer.disconnect();
      });
    }
    observer.observe(node);
  }
}
function createRoot(shadowRoot, props) {
  const refs = {};
  const abortController = new AbortController();
  const abortSignal = abortController.signal;
  const { state, createEffect } = createState(abortSignal);
  const actionContext = /* @__PURE__ */ new Map();
  assign(state, {
    skinToneEmoji: void 0,
    i18n: void 0,
    database: void 0,
    customEmoji: void 0,
    customCategorySorting: void 0,
    emojiVersion: void 0
  });
  assign(state, props);
  assign(state, {
    initialLoad: true,
    currentEmojis: [],
    currentEmojisWithCategories: [],
    rawSearchText: "",
    searchText: "",
    searchMode: false,
    activeSearchItem: -1,
    message: void 0,
    skinTonePickerExpanded: false,
    skinTonePickerExpandedAfterAnimation: false,
    currentSkinTone: 0,
    activeSkinTone: 0,
    skinToneButtonText: void 0,
    pickerStyle: void 0,
    skinToneButtonLabel: "",
    skinTones: [],
    currentFavorites: [],
    defaultFavoriteEmojis: void 0,
    numColumns: DEFAULT_NUM_COLUMNS,
    isRtl: false,
    currentGroupIndex: 0,
    groups,
    databaseLoaded: false,
    activeSearchItemId: void 0
  });
  createEffect(() => {
    if (state.currentGroup !== state.groups[state.currentGroupIndex]) {
      state.currentGroup = state.groups[state.currentGroupIndex];
    }
  });
  const focus = (id) => {
    shadowRoot.getElementById(id).focus();
  };
  const emojiToDomNode = (emoji) => shadowRoot.getElementById(`emo-${emoji.id}`);
  const fireEvent = (name, detail) => {
    refs.rootElement.dispatchEvent(new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true
    }));
  };
  const compareEmojiArrays = (a4, b3) => a4.id === b3.id;
  const compareCurrentEmojisWithCategories = (a4, b3) => {
    const { category: aCategory, emojis: aEmojis } = a4;
    const { category: bCategory, emojis: bEmojis } = b3;
    if (aCategory !== bCategory) {
      return false;
    }
    return arraysAreEqualByFunction(aEmojis, bEmojis, compareEmojiArrays);
  };
  const updateCurrentEmojis = (newEmojis) => {
    if (!arraysAreEqualByFunction(state.currentEmojis, newEmojis, compareEmojiArrays)) {
      state.currentEmojis = newEmojis;
    }
  };
  const updateSearchMode = (newSearchMode) => {
    if (state.searchMode !== newSearchMode) {
      state.searchMode = newSearchMode;
    }
  };
  const updateCurrentEmojisWithCategories = (newEmojisWithCategories) => {
    if (!arraysAreEqualByFunction(state.currentEmojisWithCategories, newEmojisWithCategories, compareCurrentEmojisWithCategories)) {
      state.currentEmojisWithCategories = newEmojisWithCategories;
    }
  };
  const unicodeWithSkin = (emoji, currentSkinTone) => currentSkinTone && emoji.skins && emoji.skins[currentSkinTone] || emoji.unicode;
  const labelWithSkin = (emoji, currentSkinTone) => uniq([
    emoji.name || unicodeWithSkin(emoji, currentSkinTone),
    emoji.annotation,
    ...emoji.shortcodes || EMPTY_ARRAY
  ].filter(Boolean)).join(", ");
  const titleForEmoji = (emoji) => emoji.annotation || (emoji.shortcodes || EMPTY_ARRAY).join(", ");
  const helpers = {
    labelWithSkin,
    titleForEmoji,
    unicodeWithSkin
  };
  const events = {
    onClickSkinToneButton,
    onEmojiClick,
    onNavClick,
    onNavKeydown,
    onSearchKeydown,
    onSkinToneOptionsClick,
    onSkinToneOptionsFocusOut,
    onSkinToneOptionsKeydown,
    onSkinToneOptionsKeyup,
    onSearchInput
  };
  const actions = {
    calculateEmojiGridStyle,
    updateOnIntersection
  };
  let firstRender = true;
  createEffect(() => {
    render(shadowRoot, state, helpers, events, actions, refs, abortSignal, actionContext, firstRender);
    firstRender = false;
  });
  if (!state.emojiVersion) {
    detectEmojiSupportLevel().then((level) => {
      if (!level) {
        state.message = state.i18n.emojiUnsupportedMessage;
      }
    });
  }
  createEffect(() => {
    async function handleDatabaseLoading() {
      let showingLoadingMessage = false;
      const timeoutHandle = setTimeout(() => {
        showingLoadingMessage = true;
        state.message = state.i18n.loadingMessage;
      }, TIMEOUT_BEFORE_LOADING_MESSAGE);
      try {
        await state.database.ready();
        state.databaseLoaded = true;
      } catch (err) {
        console.error(err);
        state.message = state.i18n.networkErrorMessage;
      } finally {
        clearTimeout(timeoutHandle);
        if (showingLoadingMessage) {
          showingLoadingMessage = false;
          state.message = "";
        }
      }
    }
    if (state.database) {
      handleDatabaseLoading();
    }
  });
  createEffect(() => {
    state.pickerStyle = `
      --num-groups: ${state.groups.length}; 
      --indicator-opacity: ${state.searchMode ? 0 : 1}; 
      --num-skintones: ${NUM_SKIN_TONES};`;
  });
  createEffect(() => {
    if (state.customEmoji && state.database) {
      updateCustomEmoji();
    }
  });
  createEffect(() => {
    if (state.customEmoji && state.customEmoji.length) {
      if (state.groups !== allGroups) {
        state.groups = allGroups;
      }
    } else if (state.groups !== groups) {
      if (state.currentGroupIndex) {
        state.currentGroupIndex--;
      }
      state.groups = groups;
    }
  });
  createEffect(() => {
    async function updatePreferredSkinTone() {
      if (state.databaseLoaded) {
        state.currentSkinTone = await state.database.getPreferredSkinTone();
      }
    }
    updatePreferredSkinTone();
  });
  createEffect(() => {
    state.skinTones = Array(NUM_SKIN_TONES).fill().map((_4, i4) => applySkinTone(state.skinToneEmoji, i4));
  });
  createEffect(() => {
    state.skinToneButtonText = state.skinTones[state.currentSkinTone];
  });
  createEffect(() => {
    state.skinToneButtonLabel = state.i18n.skinToneLabel.replace("{skinTone}", state.i18n.skinTones[state.currentSkinTone]);
  });
  createEffect(() => {
    async function updateDefaultFavoriteEmojis() {
      const { database } = state;
      const favs = (await Promise.all(MOST_COMMONLY_USED_EMOJI.map((unicode) => database.getEmojiByUnicodeOrName(unicode)))).filter(Boolean);
      state.defaultFavoriteEmojis = favs;
    }
    if (state.databaseLoaded) {
      updateDefaultFavoriteEmojis();
    }
  });
  function updateCustomEmoji() {
    const { customEmoji, database } = state;
    const databaseCustomEmoji = customEmoji || EMPTY_ARRAY;
    if (database.customEmoji !== databaseCustomEmoji) {
      database.customEmoji = databaseCustomEmoji;
    }
  }
  createEffect(() => {
    async function updateFavorites() {
      updateCustomEmoji();
      const { database, defaultFavoriteEmojis, numColumns } = state;
      const dbFavorites = await database.getTopFavoriteEmoji(numColumns);
      const favorites = await summarizeEmojis(uniqBy2([
        ...dbFavorites,
        ...defaultFavoriteEmojis
      ], (_4) => _4.unicode || _4.name).slice(0, numColumns));
      state.currentFavorites = favorites;
    }
    if (state.databaseLoaded && state.defaultFavoriteEmojis) {
      updateFavorites();
    }
  });
  function calculateEmojiGridStyle(node) {
    resizeObserverAction(node, abortSignal, () => {
      {
        const style = getComputedStyle(refs.rootElement);
        const newNumColumns = parseInt(style.getPropertyValue("--num-columns"), 10);
        const newIsRtl = style.getPropertyValue("direction") === "rtl";
        state.numColumns = newNumColumns;
        state.isRtl = newIsRtl;
      }
    });
  }
  function updateOnIntersection(node) {
    intersectionObserverAction(node, abortSignal, (entries) => {
      for (const { target, isIntersecting } of entries) {
        target.classList.toggle("onscreen", isIntersecting);
      }
    });
  }
  createEffect(() => {
    async function updateEmojis() {
      const { searchText, currentGroup, databaseLoaded, customEmoji } = state;
      if (!databaseLoaded) {
        state.currentEmojis = [];
        state.searchMode = false;
      } else if (searchText.length >= MIN_SEARCH_TEXT_LENGTH2) {
        const newEmojis = await getEmojisBySearchQuery(searchText);
        if (state.searchText === searchText) {
          updateCurrentEmojis(newEmojis);
          updateSearchMode(true);
        }
      } else {
        const { id: currentGroupId } = currentGroup;
        if (currentGroupId !== -1 || customEmoji && customEmoji.length) {
          const newEmojis = await getEmojisByGroup(currentGroupId);
          if (state.currentGroup.id === currentGroupId) {
            updateCurrentEmojis(newEmojis);
            updateSearchMode(false);
          }
        }
      }
    }
    updateEmojis();
  });
  const resetScrollTopInRaf = () => {
    rAF(() => resetScrollTopIfPossible(refs.tabpanelElement));
  };
  createEffect(() => {
    const { currentEmojis, emojiVersion } = state;
    const zwjEmojisToCheck = currentEmojis.filter((emoji) => emoji.unicode).filter((emoji) => hasZwj(emoji) && !supportedZwjEmojis.has(emoji.unicode));
    if (!emojiVersion && zwjEmojisToCheck.length) {
      updateCurrentEmojis(currentEmojis);
      rAF(() => checkZwjSupportAndUpdate(zwjEmojisToCheck));
    } else {
      const newEmojis = emojiVersion ? currentEmojis : currentEmojis.filter(isZwjSupported);
      updateCurrentEmojis(newEmojis);
      resetScrollTopInRaf();
    }
  });
  function checkZwjSupportAndUpdate(zwjEmojisToCheck) {
    const allSupported = checkZwjSupport(zwjEmojisToCheck, refs.baselineEmoji, emojiToDomNode);
    if (allSupported) {
      resetScrollTopInRaf();
    } else {
      state.currentEmojis = [...state.currentEmojis];
    }
  }
  function isZwjSupported(emoji) {
    return !emoji.unicode || !hasZwj(emoji) || supportedZwjEmojis.get(emoji.unicode);
  }
  async function filterEmojisByVersion(emojis) {
    const emojiSupportLevel = state.emojiVersion || await detectEmojiSupportLevel();
    return emojis.filter(({ version }) => !version || version <= emojiSupportLevel);
  }
  async function summarizeEmojis(emojis) {
    return summarizeEmojisForUI(emojis, state.emojiVersion || await detectEmojiSupportLevel());
  }
  async function getEmojisByGroup(group) {
    const emoji = group === -1 ? state.customEmoji : await state.database.getEmojiByGroup(group);
    return summarizeEmojis(await filterEmojisByVersion(emoji));
  }
  async function getEmojisBySearchQuery(query) {
    return summarizeEmojis(await filterEmojisByVersion(await state.database.getEmojiBySearchQuery(query)));
  }
  createEffect(() => {
  });
  createEffect(() => {
    function calculateCurrentEmojisWithCategories() {
      const { searchMode, currentEmojis } = state;
      if (searchMode) {
        return [
          {
            category: "",
            emojis: currentEmojis
          }
        ];
      }
      const categoriesToEmoji = /* @__PURE__ */ new Map();
      for (const emoji of currentEmojis) {
        const category = emoji.category || "";
        let emojis = categoriesToEmoji.get(category);
        if (!emojis) {
          emojis = [];
          categoriesToEmoji.set(category, emojis);
        }
        emojis.push(emoji);
      }
      return [...categoriesToEmoji.entries()].map(([category, emojis]) => ({ category, emojis })).sort((a4, b3) => state.customCategorySorting(a4.category, b3.category));
    }
    const newEmojisWithCategories = calculateCurrentEmojisWithCategories();
    updateCurrentEmojisWithCategories(newEmojisWithCategories);
  });
  createEffect(() => {
    state.activeSearchItemId = state.activeSearchItem !== -1 && state.currentEmojis[state.activeSearchItem].id;
  });
  createEffect(() => {
    const { rawSearchText } = state;
    rIC(() => {
      state.searchText = (rawSearchText || "").trim();
      state.activeSearchItem = -1;
    });
  });
  function onSearchKeydown(event) {
    if (!state.searchMode || !state.currentEmojis.length) {
      return;
    }
    const goToNextOrPrevious = (previous) => {
      halt(event);
      state.activeSearchItem = incrementOrDecrement(previous, state.activeSearchItem, state.currentEmojis);
    };
    switch (event.key) {
      case "ArrowDown":
        return goToNextOrPrevious(false);
      case "ArrowUp":
        return goToNextOrPrevious(true);
      case "Enter":
        if (state.activeSearchItem === -1) {
          state.activeSearchItem = 0;
        } else {
          halt(event);
          return clickEmoji(state.currentEmojis[state.activeSearchItem].id);
        }
    }
  }
  function onNavClick(event) {
    const { target } = event;
    const closestTarget = target.closest(".nav-button");
    if (!closestTarget) {
      return;
    }
    const groupId = parseInt(closestTarget.dataset.groupId, 10);
    refs.searchElement.value = "";
    state.rawSearchText = "";
    state.searchText = "";
    state.activeSearchItem = -1;
    state.currentGroupIndex = state.groups.findIndex((_4) => _4.id === groupId);
  }
  function onNavKeydown(event) {
    const { target, key } = event;
    const doFocus = (el) => {
      if (el) {
        halt(event);
        el.focus();
      }
    };
    switch (key) {
      case "ArrowLeft":
        return doFocus(target.previousElementSibling);
      case "ArrowRight":
        return doFocus(target.nextElementSibling);
      case "Home":
        return doFocus(target.parentElement.firstElementChild);
      case "End":
        return doFocus(target.parentElement.lastElementChild);
    }
  }
  async function getDetailForClickEvent(unicodeOrName) {
    const emoji = await state.database.getEmojiByUnicodeOrName(unicodeOrName);
    const emojiSummary = [...state.currentEmojis, ...state.currentFavorites].find((_4) => _4.id === unicodeOrName);
    const skinTonedUnicode = emojiSummary.unicode && unicodeWithSkin(emojiSummary, state.currentSkinTone);
    await state.database.incrementFavoriteEmojiCount(unicodeOrName);
    return {
      emoji,
      skinTone: state.currentSkinTone,
      ...skinTonedUnicode && { unicode: skinTonedUnicode },
      ...emojiSummary.name && { name: emojiSummary.name }
    };
  }
  async function clickEmoji(unicodeOrName) {
    const promiseForDetail = getDetailForClickEvent(unicodeOrName);
    fireEvent("emoji-click-sync", promiseForDetail);
    fireEvent("emoji-click", await promiseForDetail);
  }
  function onEmojiClick(event) {
    const { target } = event;
    if (!target.classList.contains("emoji")) {
      return;
    }
    halt(event);
    const id = target.id.substring(4);
    clickEmoji(id);
  }
  function changeSkinTone(skinTone) {
    state.currentSkinTone = skinTone;
    state.skinTonePickerExpanded = false;
    focus("skintone-button");
    fireEvent("skin-tone-change", { skinTone });
    state.database.setPreferredSkinTone(skinTone);
  }
  function onSkinToneOptionsClick(event) {
    const { target: { id } } = event;
    const match = id && id.match(/^skintone-(\d)/);
    if (!match) {
      return;
    }
    halt(event);
    const skinTone = parseInt(match[1], 10);
    changeSkinTone(skinTone);
  }
  function onClickSkinToneButton(event) {
    state.skinTonePickerExpanded = !state.skinTonePickerExpanded;
    state.activeSkinTone = state.currentSkinTone;
    if (state.skinTonePickerExpanded) {
      halt(event);
      rAF(() => focus("skintone-list"));
    }
  }
  createEffect(() => {
    if (state.skinTonePickerExpanded) {
      refs.skinToneDropdown.addEventListener("transitionend", () => {
        state.skinTonePickerExpandedAfterAnimation = true;
      }, { once: true });
    } else {
      state.skinTonePickerExpandedAfterAnimation = false;
    }
  });
  function onSkinToneOptionsKeydown(event) {
    if (!state.skinTonePickerExpanded) {
      return;
    }
    const changeActiveSkinTone = async (nextSkinTone) => {
      halt(event);
      state.activeSkinTone = nextSkinTone;
    };
    switch (event.key) {
      case "ArrowUp":
        return changeActiveSkinTone(incrementOrDecrement(true, state.activeSkinTone, state.skinTones));
      case "ArrowDown":
        return changeActiveSkinTone(incrementOrDecrement(false, state.activeSkinTone, state.skinTones));
      case "Home":
        return changeActiveSkinTone(0);
      case "End":
        return changeActiveSkinTone(state.skinTones.length - 1);
      case "Enter":
        halt(event);
        return changeSkinTone(state.activeSkinTone);
      case "Escape":
        halt(event);
        state.skinTonePickerExpanded = false;
        return focus("skintone-button");
    }
  }
  function onSkinToneOptionsKeyup(event) {
    if (!state.skinTonePickerExpanded) {
      return;
    }
    switch (event.key) {
      case " ":
        halt(event);
        return changeSkinTone(state.activeSkinTone);
    }
  }
  async function onSkinToneOptionsFocusOut(event) {
    const { relatedTarget } = event;
    if (!relatedTarget || relatedTarget.id !== "skintone-list") {
      state.skinTonePickerExpanded = false;
    }
  }
  function onSearchInput(event) {
    state.rawSearchText = event.target.value;
  }
  return {
    $set(newState) {
      assign(state, newState);
    },
    $destroy() {
      abortController.abort();
    }
  };
}
function rescueElementPrototype(element) {
  if (!(element instanceof PickerElement)) {
    Object.setPrototypeOf(element, customElements.get(element.tagName.toLowerCase()).prototype);
  }
}
var allGroups, groups, MIN_SEARCH_TEXT_LENGTH2, NUM_SKIN_TONES, rIC, versionsAndTestEmoji, TIMEOUT_BEFORE_LOADING_MESSAGE, DEFAULT_SKIN_TONE_EMOJI, DEFAULT_NUM_COLUMNS, MOST_COMMONLY_USED_EMOJI, FONT_FAMILY, DEFAULT_CATEGORY_SORTING, getTextFeature, compareFeatures, promise, detectEmojiSupportLevel, supportedZwjEmojis, VARIATION_SELECTOR, SKINTONE_MODIFIER, ZWJ, LIGHT_SKIN_TONE, LIGHT_SKIN_TONE_MODIFIER, rAF, resizeObserverSupported, baselineEmojiWidth, parseCache, domInstancesCache, unkeyedSymbol, hasReplaceChildren, qM, intersectionObserverCache, EMPTY_ARRAY, assign, DEFAULT_DATA_SOURCE2, DEFAULT_LOCALE2, enI18n, baseStyles, PROPS, EXTRA_STYLES, PickerElement, definitions;
var init_picker = __esm({
  "node_modules/emoji-picker-element/picker.js"() {
    init_database();
    allGroups = [
      [-1, "\u2728", "custom"],
      [0, "\u{1F600}", "smileys-emotion"],
      [1, "\u{1F44B}", "people-body"],
      [3, "\u{1F431}", "animals-nature"],
      [4, "\u{1F34E}", "food-drink"],
      [5, "\u{1F3E0}\uFE0F", "travel-places"],
      [6, "\u26BD", "activities"],
      [7, "\u{1F4DD}", "objects"],
      [8, "\u26D4\uFE0F", "symbols"],
      [9, "\u{1F3C1}", "flags"]
    ].map(([id, emoji, name]) => ({ id, emoji, name }));
    groups = allGroups.slice(1);
    MIN_SEARCH_TEXT_LENGTH2 = 2;
    NUM_SKIN_TONES = 6;
    rIC = typeof requestIdleCallback === "function" ? requestIdleCallback : setTimeout;
    versionsAndTestEmoji = {
      "\u{1FAEA}": 17,
      // distorted face
      "\u{1FAE9}": 16,
      // face with bags under eyes
      "\u{1FAE8}": 15.1,
      // shaking head, technically from v15 but see note above
      "\u{1FAE0}": 14,
      "\u{1F972}": 13.1,
      // smiling face with tear, technically from v13 but see note above
      "\u{1F97B}": 12.1,
      // sari, technically from v12 but see note above
      "\u{1F970}": 11,
      "\u{1F929}": 5,
      "\u{1F471}\u200D\u2640\uFE0F": 4,
      "\u{1F923}": 3,
      "\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F": 2,
      "\u{1F600}": 1,
      "\u{1F610}\uFE0F": 0.7,
      "\u{1F603}": 0.6
    };
    TIMEOUT_BEFORE_LOADING_MESSAGE = 1e3;
    DEFAULT_SKIN_TONE_EMOJI = "\u{1F590}\uFE0F";
    DEFAULT_NUM_COLUMNS = 8;
    MOST_COMMONLY_USED_EMOJI = [
      "\u{1F60A}",
      "\u{1F612}",
      "\u2764\uFE0F",
      "\u{1F44D}\uFE0F",
      "\u{1F60D}",
      "\u{1F602}",
      "\u{1F62D}",
      "\u263A\uFE0F",
      "\u{1F614}",
      "\u{1F629}",
      "\u{1F60F}",
      "\u{1F495}",
      "\u{1F64C}",
      "\u{1F618}"
    ];
    FONT_FAMILY = '"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif';
    DEFAULT_CATEGORY_SORTING = (a4, b3) => a4 < b3 ? -1 : a4 > b3 ? 1 : 0;
    getTextFeature = (text, color) => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d", {
        // Improves the performance of `getImageData()`
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getContextAttributes#willreadfrequently
        willReadFrequently: true
      });
      ctx.textBaseline = "top";
      ctx.font = `100px ${FONT_FAMILY}`;
      ctx.fillStyle = color;
      ctx.scale(0.01, 0.01);
      ctx.fillText(text, 0, 0);
      return ctx.getImageData(0, 0, 1, 1).data;
    };
    compareFeatures = (feature1, feature2) => {
      const feature1Str = [...feature1].join(",");
      const feature2Str = [...feature2].join(",");
      return feature1Str === feature2Str && !feature1Str.startsWith("0,0,0,");
    };
    detectEmojiSupportLevel = () => {
      if (!promise) {
        promise = new Promise((resolve) => rIC(() => resolve(determineEmojiSupportLevel())));
      }
      return promise;
    };
    supportedZwjEmojis = /* @__PURE__ */ new Map();
    VARIATION_SELECTOR = "\uFE0F";
    SKINTONE_MODIFIER = "\uD83C";
    ZWJ = "\u200D";
    LIGHT_SKIN_TONE = 127995;
    LIGHT_SKIN_TONE_MODIFIER = 57339;
    rAF = requestAnimationFrame;
    resizeObserverSupported = typeof ResizeObserver === "function";
    parseCache = /* @__PURE__ */ new WeakMap();
    domInstancesCache = /* @__PURE__ */ new WeakMap();
    unkeyedSymbol = Symbol("un-keyed");
    hasReplaceChildren = "replaceChildren" in Element.prototype;
    qM = typeof queueMicrotask === "function" ? queueMicrotask : (callback) => Promise.resolve().then(callback);
    intersectionObserverCache = /* @__PURE__ */ new WeakMap();
    EMPTY_ARRAY = [];
    ({ assign } = Object);
    DEFAULT_DATA_SOURCE2 = "https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json";
    DEFAULT_LOCALE2 = "en";
    enI18n = {
      categoriesLabel: "Categories",
      emojiUnsupportedMessage: "Your browser does not support color emoji.",
      favoritesLabel: "Favorites",
      loadingMessage: "Loading\u2026",
      networkErrorMessage: "Could not load emoji.",
      regionLabel: "Emoji picker",
      searchDescription: "When search results are available, press up or down to select and enter to choose.",
      searchLabel: "Search",
      searchResultsLabel: "Search results",
      skinToneDescription: "When expanded, press up or down to select and enter to choose.",
      skinToneLabel: "Choose a skin tone (currently {skinTone})",
      skinTonesLabel: "Skin tones",
      skinTones: [
        "Default",
        "Light",
        "Medium-Light",
        "Medium",
        "Medium-Dark",
        "Dark"
      ],
      categories: {
        custom: "Custom",
        "smileys-emotion": "Smileys and emoticons",
        "people-body": "People and body",
        "animals-nature": "Animals and nature",
        "food-drink": "Food and drink",
        "travel-places": "Travel and places",
        activities: "Activities",
        objects: "Objects",
        symbols: "Symbols",
        flags: "Flags"
      }
    };
    baseStyles = ':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}';
    PROPS = [
      "customEmoji",
      "customCategorySorting",
      "database",
      "dataSource",
      "i18n",
      "locale",
      "skinToneEmoji",
      "emojiVersion"
    ];
    EXTRA_STYLES = `:host{--emoji-font-family:${FONT_FAMILY}}`;
    PickerElement = class extends HTMLElement {
      constructor(props) {
        super();
        this.attachShadow({ mode: "open" });
        const style = document.createElement("style");
        style.textContent = baseStyles + EXTRA_STYLES;
        this.shadowRoot.appendChild(style);
        this._ctx = {
          // Set defaults
          locale: DEFAULT_LOCALE2,
          dataSource: DEFAULT_DATA_SOURCE2,
          skinToneEmoji: DEFAULT_SKIN_TONE_EMOJI,
          customCategorySorting: DEFAULT_CATEGORY_SORTING,
          customEmoji: null,
          i18n: enI18n,
          emojiVersion: null,
          ...props
        };
        for (const prop of PROPS) {
          if (prop !== "database" && Object.prototype.hasOwnProperty.call(this, prop)) {
            this._ctx[prop] = this[prop];
            delete this[prop];
          }
        }
        this._dbFlush();
      }
      connectedCallback() {
        rescueElementPrototype(this);
        if (!this._cmp) {
          this._cmp = createRoot(this.shadowRoot, this._ctx);
        }
      }
      disconnectedCallback() {
        rescueElementPrototype(this);
        qM(() => {
          if (!this.isConnected && this._cmp) {
            this._cmp.$destroy();
            this._cmp = void 0;
            const { database } = this._ctx;
            database.close().catch((err) => console.error(err));
          }
        });
      }
      static get observedAttributes() {
        return ["locale", "data-source", "skin-tone-emoji", "emoji-version"];
      }
      attributeChangedCallback(attrName, oldValue, newValue) {
        this._set(
          // convert from kebab-case to camelcase
          // see https://github.com/sveltejs/svelte/issues/3852#issuecomment-665037015
          attrName.replace(/-([a-z])/g, (_4, up) => up.toUpperCase()),
          // convert string attribute to float if necessary
          attrName === "emoji-version" ? parseFloat(newValue) : newValue
        );
      }
      _set(prop, newValue) {
        this._ctx[prop] = newValue;
        if (this._cmp) {
          this._cmp.$set({ [prop]: newValue });
        }
        if (["locale", "dataSource"].includes(prop)) {
          this._dbFlush();
        }
      }
      _dbCreate() {
        const { locale, dataSource, database } = this._ctx;
        if (!database || database.locale !== locale || database.dataSource !== dataSource) {
          this._set("database", new Database({ locale, dataSource }));
        }
      }
      // Update the Database in one microtask if the locale/dataSource change. We do one microtask
      // so we don't create two Databases if e.g. both the locale and the dataSource change
      _dbFlush() {
        qM(() => this._dbCreate());
      }
    };
    definitions = {};
    for (const prop of PROPS) {
      definitions[prop] = {
        get() {
          if (prop === "database") {
            this._dbCreate();
          }
          return this._ctx[prop];
        },
        set(val) {
          if (prop === "database") {
            throw new Error("database is read-only");
          }
          this._set(prop, val);
        }
      };
    }
    Object.defineProperties(PickerElement.prototype, definitions);
    if (!customElements.get("emoji-picker")) {
      customElements.define("emoji-picker", PickerElement);
    }
  }
});

// node_modules/emoji-picker-element/index.js
var init_emoji_picker_element = __esm({
  "node_modules/emoji-picker-element/index.js"() {
    init_picker();
    init_database();
  }
});

// web/src/habits/habits.form.tsx
function NewHabitForm({
  showHabitForm,
  groupList,
  errorMessage,
  isDemo = false
}) {
  const exist = "exist";
  const newGroup = "new";
  const groupHabits = useSignal("exist");
  const pickerRef = A2(null);
  const [emoji, setEmoji] = d2("");
  y2(() => {
    const picker = pickerRef.current;
    if (!picker) return;
    const onEmojiClick = (event) => {
      const customEvent = event;
      setEmoji(customEvent.detail.unicode);
    };
    picker.addEventListener("emoji-click", onEmojiClick);
    return () => picker.removeEventListener("emoji-click", onEmojiClick);
  }, []);
  function getRandomEmoji() {
    const arr = ["\u{1F504}", "\u{1F600}", "\u{1F3AF}", "\u{1F680}", "\u{1F4AA}"];
    const randomIndex = Math.floor(Math.random() * arr.length);
    const item = arr[randomIndex];
    return item;
  }
  const handleSubmit = async (e4) => {
    e4.preventDefault();
    try {
      const formData = new FormData(e4.currentTarget);
      const data = Object.fromEntries(formData);
      const { habit_title, habits_group_title, frequency } = data;
      const habits_group_id = Number(data.habits_group_id);
      const finalEmoji = emoji === "" ? getRandomEmoji() : emoji;
      if (isDemo) {
        const newHabitId = Date.now();
        const finalGroupId = groupHabits.value === newGroup ? Date.now() + 1 : habits_group_id;
        const newHabit = {
          habit_id: newHabitId,
          habits_group_id: finalGroupId,
          user_id: Date.now() + 2,
          // Mock User ID
          habit_title,
          habit_icon: finalEmoji,
          frequency: Number(frequency),
          is_show: true,
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        const storedGroups = localStorage.getItem("demo_habits_groups");
        let currentGroups = storedGroups ? JSON.parse(storedGroups) : [];
        if (groupHabits.value === newGroup) {
          currentGroups.push({
            habits_group_id: finalGroupId,
            habits_group_title,
            is_show: true,
            created_at: (/* @__PURE__ */ new Date()).toISOString(),
            habits: [newHabit]
          });
        } else {
          currentGroups = currentGroups.map((group) => {
            if (group.habits_group_id === habits_group_id) {
              return {
                ...group,
                habits: [...group.habits, newHabit]
              };
            }
            return group;
          });
        }
        localStorage.setItem("demo_habits_groups", JSON.stringify(currentGroups));
        const storedDoneDates = localStorage.getItem("demo_habits_done_dates");
        const currentDoneDates = storedDoneDates ? JSON.parse(storedDoneDates) : [];
        currentDoneDates.push({
          habit: newHabit,
          done_dates: {}
          // Brand new habit has no done dates yet
        });
        localStorage.setItem("demo_habits_done_dates", JSON.stringify(currentDoneDates));
        window.location.reload();
        return;
      }
      const response = await fetch("/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habit_title,
          habits_group_id,
          habits_group_title,
          emoji: finalEmoji,
          frequency: Number(frequency)
        })
      });
      if (response.redirected) {
        window.location.replace(response.url);
      }
      const resp_data = await response.json();
      if (resp_data.success) window.location.reload();
      if (!resp_data.success) {
        errorMessage.value = "There's an error. Failed to create the habit.";
        showHabitForm.value = false;
      }
    } catch (error) {
      errorMessage.value = "There's an error. Failed to create the habit.";
      showHabitForm.value = false;
      console.log(error);
    }
  };
  return /* @__PURE__ */ u4("div", { class: "fixed top-1/2 left-1/2 z-11 pb-5 md:pb-0 max-h-9/10 w-9/10 overflow-y-auto -translate-1/2 rounded-xl border border-background bg-white shadow-lg h-fit md:max-w-105", children: [
    /* @__PURE__ */ u4("div", { class: "flex h-1/10 items-center justify-start rounded-t-xl bg-linear-to-r from-hover to-background p-5", children: /* @__PURE__ */ u4("h2", { class: "text-2xl font-bold text-white", children: "Create New Habit" }) }),
    /* @__PURE__ */ u4(
      "span",
      {
        onClick: () => showHabitForm.value = false,
        class: "absolute top-5 right-5 cursor-pointer text-2xl font-extrabold text-white",
        children: "\u2715"
      }
    ),
    /* @__PURE__ */ u4(
      "form",
      {
        id: "newHabit",
        onSubmit: handleSubmit,
        class: "p-7.5 flex flex-col gap-3",
        children: [
          /* @__PURE__ */ u4("div", { class: "flex", children: /* @__PURE__ */ u4(
            "input",
            {
              type: "text",
              id: "habit_title",
              placeholder: "Habit's Name",
              name: "habit_title",
              style: "flex: 2; padding: 8px; border: 1px solid #ccc; border-radius: 4px;",
              required: true
            }
          ) }),
          /* @__PURE__ */ u4("div", { class: "flex flex-col gap-3", children: [
            /* @__PURE__ */ u4("div", { class: `${groupHabits.value == newGroup ? "" : "opacity-60"} flex flex-col`, children: [
              /* @__PURE__ */ u4(
                "div",
                {
                  className: "flex flex-row py-1 items-center cursor-pointer",
                  onClick: () => groupHabits.value = newGroup,
                  children: [
                    /* @__PURE__ */ u4("div", { class: "w-4 h-4 rounded-full border-2 border-gray-400 group-has-checked:border-blue-500 flex items-center justify-center", children: /* @__PURE__ */ u4("div", { class: `${groupHabits.value == newGroup ? "block" : "hidden"} w-2 h-2 rounded-full bg-blue-500` }) }),
                    /* @__PURE__ */ u4("span", { class: "ml-2 text-gray-700", children: "Create new habits group" })
                  ]
                }
              ),
              /* @__PURE__ */ u4(
                "input",
                {
                  type: "text",
                  id: "habits_group",
                  placeholder: "New Habit's Group Name",
                  name: "habits_group_title",
                  class: `${groupHabits.value == newGroup ? "" : "opacity-35"}`,
                  style: "flex: 2; padding: 8px; border: 1px solid #ccc; border-radius: 4px;",
                  required: groupHabits.value == newGroup,
                  disabled: groupHabits.value != newGroup
                }
              )
            ] }),
            /* @__PURE__ */ u4("div", { class: `${groupHabits.value == exist ? "" : "opacity-60"} flex flex-col`, children: [
              /* @__PURE__ */ u4(
                "div",
                {
                  className: "flex flex-row py-1 items-center cursor-pointer",
                  onClick: () => groupHabits.value = exist,
                  children: [
                    /* @__PURE__ */ u4("div", { class: "w-4 h-4 rounded-full border-2 border-gray-400 group-has-checked:border-blue-500 flex items-center justify-center", children: /* @__PURE__ */ u4("div", { class: `${groupHabits.value == exist ? "block" : "hidden"} w-2 h-2 rounded-full bg-blue-500` }) }),
                    /* @__PURE__ */ u4("span", { class: "ml-2 text-gray-700", children: "Add to the existing habits group" })
                  ]
                }
              ),
              /* @__PURE__ */ u4(
                "select",
                {
                  name: "habits_group_id",
                  class: `${groupHabits.value == exist ? "" : "opacity-35"} w-full cursor-pointer p-2 border border-[#ccc] hover:bg-gray-50`,
                  required: groupHabits.value == exist,
                  disabled: groupHabits.value != exist,
                  children: [
                    /* @__PURE__ */ u4("option", { value: "", children: "Select Habits Group" }),
                    /* @__PURE__ */ u4(GroupOptions, { groups: groupList })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ u4("div", { class: "flex flex-col", children: [
            /* @__PURE__ */ u4("p", { children: "Repeat the habit every __ days?" }),
            /* @__PURE__ */ u4(
              "input",
              {
                type: "number",
                id: "frequency",
                name: "frequency",
                defaultValue: "1",
                style: "flex: 2; padding: 8px; border: 1px solid #ccc; border-radius: 4px;",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ u4("div", { className: "flex flex-col items-center w-full", children: [
            /* @__PURE__ */ u4("div", { className: "flex flex-row items-center", children: [
              /* @__PURE__ */ u4("p", { children: "Pick an icon for the habit:" }),
              /* @__PURE__ */ u4("div", { className: "text-2xl", children: emoji })
            ] }),
            /* @__PURE__ */ u4("emoji-picker", { ref: pickerRef, className: "w-full h-64" })
          ] }),
          /* @__PURE__ */ u4(
            "button",
            {
              type: "submit",
              style: "background: #007bff; color: white; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer;",
              children: "Add Habit"
            }
          )
        ]
      }
    )
  ] });
}
var GroupOptions;
var init_habits_form = __esm({
  "web/src/habits/habits.form.tsx"() {
    "use strict";
    init_signals_module();
    init_hooks_module();
    init_emoji_picker_element();
    init_jsxRuntime_module();
    GroupOptions = ({ groups: groups2 }) => {
      return groups2.value.map((group) => /* @__PURE__ */ u4("option", { value: group.habits_group_id, children: group.habits_group_title }, group.habits_group_id));
    };
  }
});

// web/src/habits/habits.tsx
var require_habits = __commonJS({
  "web/src/habits/habits.tsx"() {
    init_preact_module();
    init_signals_module();
    init_habits_stats();
    init_habits_card();
    init_habits_toggle();
    init_habits_form();
    init_constants();
    init_jsxRuntime_module();
    function loadDemoData(key, backendData, isDemo) {
      if (!isDemo) return backendData;
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e4) {
          console.error("Error parsing " + key, e4);
        }
      }
      localStorage.setItem(key, JSON.stringify(backendData));
      return backendData;
    }
    function App({ habitsGroupList, habitsDoneDateList, isDemo = false }) {
      const habitsGroups = useSignal(
        loadDemoData("demo_habits_groups", habitsGroupList ?? [], isDemo)
      );
      useSignalEffect(() => {
        const currentGroups = habitsGroups.value;
        if (isDemo) {
          localStorage.setItem("demo_habits_groups", JSON.stringify(currentGroups));
        }
      });
      const habitsDoneDates = useSignal(
        loadDemoData("demo_habits_done_dates", habitsDoneDateList ?? [], isDemo)
      );
      useSignalEffect(() => {
        const currentDoneDates = habitsDoneDates.value;
        if (isDemo) {
          localStorage.setItem("demo_habits_done_dates", JSON.stringify(currentDoneDates));
        }
      });
      const today = /* @__PURE__ */ new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      const handleToggleHide = (habitGroupId, checked) => {
        habitsGroups.value = habitsGroups.value.map(
          (group) => group.habits_group_id === habitGroupId ? { ...group, is_show: checked } : group
        );
      };
      const expandGroupsDiv = useSignal(false);
      const hiddenHabitsGroup = useComputed(() => {
        const hiddenGroupIdArr = [];
        for (const group of habitsGroups.value) {
          if (!group.is_show) hiddenGroupIdArr.push(group.habits_group_id);
        }
        return hiddenGroupIdArr;
      });
      const calendarRange = useSignal("");
      const dateRange = useComputed(() => {
        const rangeMonth = calendarRange.value == "" ? 1 : Number(calendarRange.value);
        const firstDate = new Date(currentYear, currentMonth - (rangeMonth - 1), 1);
        const lastDate = new Date(currentYear, currentMonth + 1, 0);
        const len = (lastDate.getTime() - firstDate.getTime()) / (1e3 * 60 * 60 * 24) + 1;
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const days = [];
        for (let i4 = len; i4 > 0; i4--)
          days.push(new Date(currentYear, currentMonth, daysInMonth - i4 + 1));
        return days;
      });
      const period = useComputed(() => {
        const rangeMonth = calendarRange.value == "" ? 1 : Number(calendarRange.value);
        const period2 = monthNames[currentMonth] + " " + currentYear;
        if (rangeMonth === 1) return period2;
        const firstDate = new Date(currentYear, currentMonth - (rangeMonth - 1), 1);
        const firstMonth = monthNames[firstDate.getMonth()];
        const firstYear = firstDate.getFullYear();
        const isSameYear = firstYear === currentYear;
        return firstMonth + ` ${isSameYear ? "" : firstYear} - ` + period2;
      });
      const showHabitForm = useSignal(false);
      const errorMessage = useSignal("");
      return /* @__PURE__ */ u4("div", { className: "min-h-screen font-sans pb-12 mt-10 md:mt-0", children: [
        /* @__PURE__ */ u4("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-2", children: [
          /* @__PURE__ */ u4("div", { className: "pb-4 md:pb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
            /* @__PURE__ */ u4("div", { children: [
              /* @__PURE__ */ u4("h1", { className: "text-4xl text-background font-bold", children: "Habits Tracker" }),
              /* @__PURE__ */ u4("p", { className: "text-background font-bold", children: period })
            ] }),
            /* @__PURE__ */ u4(
              "button",
              {
                onClick: () => showHabitForm.value = true,
                className: "flex min-w-35 cursor-pointer items-center justify-center rounded-xl bg-background p-1.25 text-center text-base font-bold text-white hover:bg-hover md:py-1 md:text-lg",
                children: "+ New Habit"
              }
            )
          ] }),
          /* @__PURE__ */ u4(
            SummaryStats,
            {
              habitsDoneDates,
              dateRange,
              hiddenHabitsGroup,
              calendarRange
            }
          ),
          /* @__PURE__ */ u4("div", { className: "flex flex-col md:flex-row items-center justify-center md:gap-3", children: [
            /* @__PURE__ */ u4(
              "div",
              {
                class: `${expandGroupsDiv.value ? "max-h-24" : "max-h-14"}
            flex rounded-md overflow-y-auto flex-col p-4 mt-4 mb-4 bg-white w-full transition-all duration-300 ease-in-out sm:flex-row sm:flex-wrap gap-4 sm:gap-6`,
                children: [
                  habitsGroups.value.map((habitsGroup) => /* @__PURE__ */ u4(
                    Toggle,
                    {
                      habitsGroupId: habitsGroup.habits_group_id,
                      habitsGroupTitle: habitsGroup.habits_group_title,
                      isShow: habitsGroup.is_show,
                      handleToggleHide,
                      errorMessage,
                      isDemo
                    },
                    habitsGroup.habits_group_id
                  )),
                  habitsGroups.value.length == 0 && /* @__PURE__ */ u4("p", { className: "text-background font-semibold text-lg", children: "You haven\u2019t created any habits yet" })
                ]
              }
            ),
            /* @__PURE__ */ u4(
              "select",
              {
                onChange: (e4) => calendarRange.value = e4.currentTarget.value,
                value: calendarRange.value,
                name: "duration",
                className: "hidden md:block bg-white text-background font-semibold text-nowrap w-full md:w-fit h-14 px-5 mb-6 sm:mb-0",
                children: [
                  /* @__PURE__ */ u4("option", { value: "", disabled: true, selected: true, children: "Duration" }),
                  /* @__PURE__ */ u4("option", { value: "1", children: "1 month" }),
                  /* @__PURE__ */ u4("option", { value: "3", children: "3 months" }),
                  /* @__PURE__ */ u4("option", { value: "6", children: "6 months" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ u4("div", { className: `${habitsGroups.value.length > 4 ? "block" : "hidden"}`, children: expandGroupsDiv.value ? /* @__PURE__ */ u4(
            "div",
            {
              className: "cursor-pointer mx-auto flex justify-center mb-4",
              onClick: () => expandGroupsDiv.value = false,
              children: "Show less"
            }
          ) : /* @__PURE__ */ u4(
            "div",
            {
              className: "cursor-pointer mx-auto flex justify-center mb-4",
              onClick: () => expandGroupsDiv.value = true,
              children: "Show more"
            }
          ) }),
          errorMessage.value.length > 0 && /* @__PURE__ */ u4("div", { className: "text-background font-bold mx-auto py-2 px-5 border border-background w-fit flex justify-center mb-4", children: errorMessage }),
          /* @__PURE__ */ u4(
            "div",
            {
              className: `grid grid-cols-1 place-items-center gap-5
          ${calendarRange.value === "" ? "md:grid-cols-4" : ""}
          ${calendarRange.value === "1" ? "md:grid-cols-4" : ""}
          ${calendarRange.value === "3" ? "md:grid-cols-2" : ""}
          ${calendarRange.value === "6" ? "md:grid-cols-1" : ""}`,
              children: habitsDoneDates.value.map((habit) => {
                if (!hiddenHabitsGroup.value.includes(habit.habit.habits_group_id)) {
                  return /* @__PURE__ */ u4(
                    HabitCard,
                    {
                      habitObj: habit,
                      dateRange,
                      errorMessage,
                      habitsDoneDates,
                      isDemo
                    },
                    habit.habit.habit_id
                  );
                }
              })
            }
          )
        ] }),
        showHabitForm.value && /* @__PURE__ */ u4(
          NewHabitForm,
          {
            showHabitForm,
            groupList: habitsGroups,
            errorMessage,
            isDemo
          }
        )
      ] });
    }
    var dataWindow = window;
    G(
      /* @__PURE__ */ u4(
        App,
        {
          habitsGroupList: dataWindow.habitsGroupList,
          habitsDoneDateList: dataWindow.habitsDoneDateList,
          isDemo: dataWindow.isDemo || false
        }
      ),
      document.getElementById("habits")
    );
  }
});
export default require_habits();
