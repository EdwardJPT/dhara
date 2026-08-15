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
function formattingDateProject(date) {
  if (!date) return "";
  let dateArray = date.split("-");
  let formattedDate = dateArray[2] + " " + monthNames[dateArray[1] - 1].slice(0, 3) + " " + dateArray[0];
  return formattedDate ? formattedDate : "";
}
function formattingDateTask(date) {
  let dateArray = date.split("-");
  let formattedDate = dateArray[2] + " " + monthNames[dateArray[1] - 1] + " " + dateArray[0];
  return formattedDate;
}
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
function nDaysAgo(dateString) {
  if (!dateString) return "Has no start date";
  const startDate = new Date(dateString);
  const today4 = new Date(todayUserTimeZone());
  const daysAgo = (today4 - startDate) / (1e3 * 60 * 60 * 24);
  if (daysAgo > 1) return `${daysAgo} days ago`;
  if (daysAgo == 1) return "Yesterday";
  if (daysAgo == 0) return "Today";
  if (daysAgo == -1) return "Tomorrow";
  return `${-daysAgo} days from now`;
}
function nDaysLeft(dateString) {
  if (!dateString) return "Has no deadline";
  const deadline = new Date(dateString);
  const today4 = new Date(todayUserTimeZone());
  const daysLeft = (deadline - today4) / (1e3 * 60 * 60 * 24);
  if (daysLeft > 1) return `${daysLeft} days left`;
  if (daysLeft == 1) return "Tomorrow";
  if (daysLeft == 0) return "Today";
  if (daysLeft == -1) return "Overdue yesterday";
  return `${-daysLeft} days overdue`;
}
function getWeekRange(date) {
  const day = date.getDay();
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - day);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return { startOfWeek, endOfWeek };
}
function getMonthRange(date) {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);
  return { startOfMonth, endOfMonth };
}
function getQuarterRange(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const quarterStartMonth = Math.floor(month / 3) * 3;
  const startOfQuarter = new Date(year, quarterStartMonth, 1);
  const quarterEndMonth = quarterStartMonth + 2;
  const endOfQuarter = new Date(year, quarterEndMonth + 1, 0);
  endOfQuarter.setHours(23, 59, 59, 999);
  return { startOfQuarter, endOfQuarter };
}
function formattingDateObj(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const date = String(dateObj.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + date;
}
var ALL, Priority, ProjectFilters, ProjectSorter, TaskFiltersPriority, TaskFiltersStatus, TaskFiltersTime, TaskSorter, defaultTaskFilters, monthNames, nDaysAgoDone, ReportsTimeRange, TaskStatsKeyMap;
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
    nDaysAgoDone = (dateString) => {
      if (!dateString) return "Has no done date";
      const doneDate = new Date(
        formattingDateProject(
          new Date(dateString * 1e3).toLocaleDateString("en-CA")
        )
      );
      const today4 = new Date(todayUserTimeZone());
      const daysAgo = Math.floor((today4 - doneDate) / (1e3 * 60 * 60 * 24));
      if (daysAgo > 1) return `${daysAgo} days ago`;
      if (daysAgo == 1) return "Yesterday";
      if (daysAgo == 0) return "Today";
      if (daysAgo == -1) return "Tomorrow";
      return `${-daysAgo} days from now`;
    };
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

// web/src/project/project.project.tsx
function ProjectDisplay({ project }) {
  return /* @__PURE__ */ u4("div", { class: "h-fit mx-auto flex w-full flex-col rounded-lg border-l-4 border-background bg-white p-4 shadow hover:bg-pink-50 md:w-3xl md:p-6", children: [
    /* @__PURE__ */ u4("div", { class: "mb-2 flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ u4(
        "h2",
        {
          id: "tasksFilterTime",
          class: "h-fit max-w-[70%] overflow-hidden text-ellipsis text-nowrap text-left text-xl font-extrabold text-background md:max-w-none md:py-3 md:text-2xl",
          children: project.value.project_title
        }
      ),
      project.value.priority && /* @__PURE__ */ u4("span", { class: "my-auto inline-flex max-h-6 w-fit shrink-0 items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 md:p-2 md:text-sm", children: "Priority" })
    ] }),
    /* @__PURE__ */ u4("div", { class: "mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3", children: [
      /* @__PURE__ */ u4("div", { class: "flex flex-col items-center justify-between border border-background p-2", children: [
        /* @__PURE__ */ u4("p", { class: "flex flex-row text-center text-sm text-gray-800 md:text-base", children: [
          "Start: ",
          formattingDateProject(project.value.start_date)
        ] }),
        /* @__PURE__ */ u4("p", { class: "mt-1 flex flex-row items-center text-xs text-hover sm:mt-0 md:text-sm", children: [
          /* @__PURE__ */ u4(
            "img",
            {
              src: "/static/images/clock.svg",
              alt: "clock icon",
              class: "h-3 w-3"
            }
          ),
          "\xA0",
          nDaysAgo(project.value.start_date)
        ] })
      ] }),
      /* @__PURE__ */ u4("div", { class: "flex flex-col items-center justify-between border border-background p-2", children: [
        /* @__PURE__ */ u4("p", { class: "flex flex-row text-center text-sm text-gray-800 md:text-base", children: [
          "Due:\xA0",
          formattingDateProject(project.value.due_date)
        ] }),
        /* @__PURE__ */ u4("p", { class: "mt-1 flex flex-row items-center text-xs text-hover sm:mt-0 md:text-sm", children: [
          /* @__PURE__ */ u4(
            "img",
            {
              src: "/static/images/clock.svg",
              alt: "clock icon",
              class: "h-3 w-3"
            }
          ),
          "\xA0",
          nDaysLeft(project.value.due_date)
        ] })
      ] }),
      project.value.done_date > 0 && /* @__PURE__ */ u4("div", { class: "flex flex-col items-center justify-between border border-background p-2", children: [
        /* @__PURE__ */ u4("p", { class: "bg-white text-center text-sm font-extrabold text-gray-800 no-underline opacity-100 md:text-base", children: [
          "DONE :",
          " ",
          formattingDateProject(
            new Date(project.value.done_date * 1e3).toLocaleDateString(
              "en-CA"
            )
          )
        ] }),
        /* @__PURE__ */ u4("p", { class: "mt-1 flex flex-row items-center text-xs text-hover sm:mt-0 md:text-sm", children: [
          /* @__PURE__ */ u4(
            "img",
            {
              src: "/static/images/clock.svg",
              alt: "clock icon",
              class: "h-3 w-3"
            }
          ),
          "\xA0",
          nDaysAgoDone(project.value.done_date)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ u4("p", { class: "my-2.5 h-fit max-h-32.5 overflow-y-auto text-base text-[#28536a] md:text-lg", children: project.value.project_desc }),
    /* @__PURE__ */ u4("div", { class: "mt-2.5 flex items-center", children: [
      /* @__PURE__ */ u4("div", { class: "mr-2 h-2 w-full bg-slate-200", children: /* @__PURE__ */ u4(
        "div",
        {
          class: "h-full bg-linear-to-r from-blue-400 to-blue-700",
          style: {
            width: `calc(100% * ${project.value.to_dos_done} / ${project.value.to_dos_all})`
          }
        }
      ) }),
      /* @__PURE__ */ u4("span", { class: "ml-2 whitespace-nowrap text-xs font-medium text-gray-700 md:text-sm", children: [
        project.value.to_dos_done,
        "/",
        project.value.to_dos_all
      ] })
    ] })
  ] });
}
var init_project_project = __esm({
  "web/src/project/project.project.tsx"() {
    "use strict";
    init_constants();
    init_jsxRuntime_module();
  }
});

// web/src/project/project.editForm.tsx
function EditProjectForm({
  project,
  isEditingProject,
  countPriorityProjects,
  setErrorMessage,
  isDemo
}) {
  const [formData, setFormData] = d2({
    project_id: project.project_id,
    project_title: project.project_title,
    project_desc: project.project_desc,
    priority: project.priority,
    start_date: project.start_date,
    due_date: project.due_date,
    is_done: project.is_done,
    done_date: project.done_date
  });
  const handleChange = (e4) => {
    const { name, value, type, checked } = e4.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? parseInt(value) || 0 : value
    }));
  };
  const handleEditProject = async (e4) => {
    e4.preventDefault();
    try {
      const doneDate = new Date(formData.done_date).getTime();
      const unixDoneDate = Math.floor(doneDate / 1e3);
      const newData = {
        ...formData,
        // Handle date conversions
        start_date: formData.start_date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        due_date: formData.due_date || "",
        done_date: formData.is_done && formData.done_date ? unixDoneDate : 0,
        // Ensure boolean fields are properly typed
        priority: !!formData.priority,
        is_done: !!formData.is_done
      };
      if (isDemo) {
        const storedProjectsStr = localStorage.getItem("demo_projects");
        if (storedProjectsStr) {
          try {
            const storedProjects = JSON.parse(storedProjectsStr);
            const updatedProjects = storedProjects.map(
              (p5) => p5.project_id === project.project_id ? { ...p5, ...newData } : p5
            );
            localStorage.setItem("demo_projects", JSON.stringify(updatedProjects));
          } catch (err) {
            console.error("Error updating demo_projects in localStorage", err);
          }
        } else {
          localStorage.setItem("demo_projects", JSON.stringify([{ ...project, ...newData }]));
        }
        window.location.reload();
        return;
      }
      const response = await fetch(`/project/${project.public_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData)
      });
      if (response.redirected) {
        window.location.replace(response.url);
      }
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const resp = await response.json();
      if (resp.success) window.location.reload();
      if (!resp.success) setErrorMessage(resp.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return /* @__PURE__ */ u4(
    "form",
    {
      onSubmit: handleEditProject,
      class: "fixed top-1/2 left-1/2 z-11 flex max-h-[95vh] w-[95%] -translate-1/2 flex-col rounded-xl border border-background bg-white shadow-lg sm:w-11/12 md:h-fit md:max-w-2xl",
      children: [
        /* @__PURE__ */ u4("div", { class: "flex shrink-0 items-center justify-start rounded-t-xl bg-linear-to-r from-hover to-background p-4 sm:p-5", children: /* @__PURE__ */ u4("h2", { class: "text-xl sm:text-2xl font-bold text-white", children: "Edit Project" }) }),
        /* @__PURE__ */ u4(
          "span",
          {
            class: "absolute right-4 top-4 cursor-pointer text-xl font-extrabold leading-none text-white sm:right-5 sm:top-5 sm:text-2xl",
            onClick: () => isEditingProject.value = false,
            children: "\u2715"
          }
        ),
        /* @__PURE__ */ u4("div", { class: "overflow-y-auto p-4 sm:p-6", children: [
          /* @__PURE__ */ u4("div", { class: "grid grid-cols-1 gap-2", children: [
            /* @__PURE__ */ u4("div", { class: "mb-4", children: [
              /* @__PURE__ */ u4(
                "label",
                {
                  class: "mb-2 block text-sm font-bold text-gray-700",
                  for: "project_title",
                  children: "Project Title *"
                }
              ),
              /* @__PURE__ */ u4(
                "input",
                {
                  type: "text",
                  id: "project_title",
                  name: "project_title",
                  value: formData.project_title,
                  onChange: handleChange,
                  required: true,
                  class: "w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                }
              )
            ] }),
            /* @__PURE__ */ u4("div", { class: "mb-4", children: [
              /* @__PURE__ */ u4(
                "label",
                {
                  class: "mb-2 block text-sm font-bold text-gray-700",
                  for: "project_desc",
                  children: "Description"
                }
              ),
              /* @__PURE__ */ u4(
                "textarea",
                {
                  id: "project_desc",
                  name: "project_desc",
                  value: formData.project_desc,
                  onChange: handleChange,
                  rows: 3,
                  class: "w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                }
              )
            ] }),
            /* @__PURE__ */ u4("div", { class: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 rounded-md bg-gray-100 p-3 sm:p-4", children: [
              /* @__PURE__ */ u4("div", { children: [
                /* @__PURE__ */ u4("label", { class: "block text-sm sm:text-base font-medium text-gray-700", children: "A priority project?" }),
                /* @__PURE__ */ u4("p", { class: "mt-1 text-xs sm:text-sm text-gray-500", children: "Only allowed to have 3 priority projects." }),
                /* @__PURE__ */ u4("p", { class: "mb-1 text-xs sm:text-sm text-gray-500", children: [
                  "You already have ",
                  countPriorityProjects,
                  " priority projects."
                ] })
              ] }),
              /* @__PURE__ */ u4("div", { class: "flex items-center", children: [
                /* @__PURE__ */ u4("span", { class: "mr-2 text-xs sm:text-sm text-gray-500", children: "No" }),
                /* @__PURE__ */ u4(
                  "button",
                  {
                    onClick: () => setFormData((prevData) => ({
                      ...prevData,
                      priority: countPriorityProjects - Number(project.priority) < 3 && !prevData.priority
                    })),
                    type: "button",
                    id: "priorityToggle",
                    class: `relative inline-flex h-6 w-11 items-center rounded-full transition 
                    ${formData.priority ? "bg-background" : "bg-gray-200"}`,
                    children: /* @__PURE__ */ u4(
                      "span",
                      {
                        class: `inline-block h-4 w-4 transform rounded-full bg-white transition ease-in-out
                    ${formData.priority ? "translate-x-6" : "translate-x-1"}`
                      }
                    )
                  }
                ),
                /* @__PURE__ */ u4("span", { class: "ml-2 text-xs sm:text-sm text-gray-500", children: "Yes" })
              ] })
            ] }),
            /* @__PURE__ */ u4("div", { class: "mt-2 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2", children: [
              /* @__PURE__ */ u4("div", { class: "mb-2 sm:mb-4", children: [
                /* @__PURE__ */ u4(
                  "label",
                  {
                    class: "mb-2 block text-sm font-bold text-gray-700",
                    for: "start_date",
                    children: "Start Date *"
                  }
                ),
                /* @__PURE__ */ u4(
                  "input",
                  {
                    type: "date",
                    id: "start_date",
                    name: "start_date",
                    value: formData.start_date,
                    onChange: handleChange,
                    required: true,
                    class: "w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  }
                )
              ] }),
              /* @__PURE__ */ u4("div", { class: "mb-4", children: [
                /* @__PURE__ */ u4(
                  "label",
                  {
                    class: "mb-2 block text-sm font-bold text-gray-700",
                    for: "due_date",
                    children: "Due Date"
                  }
                ),
                /* @__PURE__ */ u4(
                  "input",
                  {
                    type: "date",
                    id: "due_date",
                    name: "due_date",
                    value: formData.due_date,
                    onChange: handleChange,
                    min: today,
                    class: "w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  }
                )
              ] })
            ] }),
            project.to_dos_done < project.to_dos_all ? /* @__PURE__ */ u4("div", { class: "mb-4", children: [
              /* @__PURE__ */ u4("label", { class: "flex items-center cursor-pointer w-fit", children: [
                /* @__PURE__ */ u4(
                  "input",
                  {
                    type: "checkbox",
                    name: "is_done",
                    checked: formData.is_done,
                    onChange: handleChange,
                    class: "h-4 w-4 sm:h-5 sm:w-5 rounded text-blue-600 focus:ring-blue-500"
                  }
                ),
                /* @__PURE__ */ u4("span", { class: "ml-2 sm:ml-3 text-sm sm:text-base text-gray-700", children: "Mark as Completed" })
              ] }),
              formData.is_done && /* @__PURE__ */ u4("div", { class: "mt-3 sm:mt-4", children: [
                /* @__PURE__ */ u4(
                  "label",
                  {
                    class: "mb-2 block text-sm font-bold text-gray-700",
                    for: "done_date",
                    children: "Completion Date"
                  }
                ),
                /* @__PURE__ */ u4(
                  "input",
                  {
                    type: "date",
                    id: "done_date",
                    name: "done_date",
                    value: formData.done_date,
                    onChange: handleChange,
                    class: "w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  }
                )
              ] })
            ] }) : /* @__PURE__ */ u4("p", { class: "font-bold text-background text-sm sm:text-lg", children: "All tasks in this project are complete." })
          ] }),
          /* @__PURE__ */ u4("div", { class: "mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-3 sm:gap-0 sm:space-x-3", children: /* @__PURE__ */ u4(
            "button",
            {
              type: "submit",
              class: "w-full sm:w-auto rounded-md bg-blue-600 px-4 py-3 sm:py-2 text-sm sm:text-base text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none font-semibold",
              children: "Save Changes"
            }
          ) })
        ] })
      ]
    }
  );
}
var today;
var init_project_editForm = __esm({
  "web/src/project/project.editForm.tsx"() {
    "use strict";
    init_hooks_module();
    init_constants();
    init_jsxRuntime_module();
    today = todayUserTimeZone();
  }
});

// web/src/project/project.taskForm.tsx
function TaskForm({
  isAddingTasks,
  project,
  setErrorMessage,
  isDemo
}) {
  const [tasks, setTasks] = d2([
    {
      task_title: "",
      task_desc: "",
      priority: false,
      due_date: ""
    }
  ]);
  const addTaskField = () => {
    setTasks([
      ...tasks,
      {
        task_title: "",
        task_desc: "",
        priority: false,
        due_date: ""
      }
    ]);
  };
  const removeTaskField = (index) => {
    if (tasks.length > 1) {
      const newTasks = [...tasks];
      newTasks.splice(index, 1);
      setTasks(newTasks);
    }
  };
  const handleInputChange = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };
  const submitAddingTasks = async (e4) => {
    e4.preventDefault();
    try {
      if (isDemo) {
        let storedTasks = [];
        const storedTasksStr = localStorage.getItem("demo_tasks");
        if (storedTasksStr) {
          try {
            storedTasks = JSON.parse(storedTasksStr);
          } catch (err) {
            console.error("Error parsing demo_tasks in localStorage", err);
          }
        }
        const newMockTasks = tasks.map((t4, index) => ({
          task_id: Date.now() + index,
          // Generate a unique mock ID
          project_id: project.value.project_id,
          task_title: t4.task_title,
          task_desc: t4.task_desc,
          priority: t4.priority,
          is_done: false,
          done_date: 0,
          due_date: t4.due_date,
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        }));
        localStorage.setItem("demo_tasks", JSON.stringify([...newMockTasks, ...storedTasks]));
        const storedProjectsStr = localStorage.getItem("demo_projects");
        if (storedProjectsStr) {
          try {
            const storedProjects = JSON.parse(storedProjectsStr);
            const updatedProjects = storedProjects.map(
              (p5) => p5.project_id === project.value.project_id ? {
                ...p5,
                to_dos_all: p5.to_dos_all + tasks.length,
                is_done: false,
                // Mark project as not done since it has new tasks
                done_date: 0
                // Reset done date
              } : p5
            );
            localStorage.setItem("demo_projects", JSON.stringify(updatedProjects));
          } catch (err) {
            console.error("Error updating demo_projects in localStorage", err);
          }
        }
        window.location.reload();
        return;
      }
      const requestData = {
        task_data: tasks,
        projectId: project.value.project_id
      };
      const response = await fetch(`/project/${project.value.public_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
      });
      if (response.redirected) {
        window.location.replace(response.url);
      }
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const resp = await response.json();
      if (resp.success) window.location.reload();
      if (!resp.success) setErrorMessage(resp.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return /* @__PURE__ */ u4(
    "form",
    {
      onSubmit: submitAddingTasks,
      className: "mx-auto w-full md:w-3xl rounded-sm bg-white p-4 sm:p-6 font-sans shadow-md",
      children: [
        /* @__PURE__ */ u4("h2", { className: "mb-4 text-lg md:text-xl font-bold text-gray-800 flex items-center justify-between", children: [
          "Add Tasks",
          /* @__PURE__ */ u4(
            "span",
            {
              onClick: () => isAddingTasks.value = false,
              class: "cursor-pointer p-1 text-2xl leading-none",
              children: "\u2715"
            }
          )
        ] }),
        tasks.map((task, index) => /* @__PURE__ */ u4(
          "div",
          {
            className: "mb-4 last:mb-0 rounded-sm border border-gray-200 bg-gray-50 p-3 sm:px-4 sm:py-3",
            children: [
              /* @__PURE__ */ u4("div", { className: "flex items-center justify-end", children: tasks.length > 1 && /* @__PURE__ */ u4(
                "button",
                {
                  type: "button",
                  onClick: () => removeTaskField(index),
                  className: "cursor-pointer p-1 text-lg text-red-500 hover:text-red-700",
                  children: "\u2715"
                }
              ) }),
              /* @__PURE__ */ u4("div", { className: "space-y-3", children: [
                /* @__PURE__ */ u4("div", { children: /* @__PURE__ */ u4(
                  "input",
                  {
                    required: true,
                    type: "text",
                    placeholder: `Task ${index + 1} Title *`,
                    value: task.task_title,
                    onChange: (e4) => handleInputChange(index, "task_title", e4.target.value),
                    className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base outline-none focus:border-transparent focus:ring-1 focus:ring-blue-500"
                  }
                ) }),
                /* @__PURE__ */ u4("div", { children: /* @__PURE__ */ u4(
                  "textarea",
                  {
                    placeholder: "Description",
                    value: task.task_desc,
                    onChange: (e4) => handleInputChange(index, "task_desc", e4.target.value),
                    className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base outline-none focus:border-transparent focus:ring-1 focus:ring-blue-500",
                    rows: 2
                  }
                ) }),
                /* @__PURE__ */ u4("div", { className: "grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2", children: [
                  /* @__PURE__ */ u4("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-0", children: [
                    /* @__PURE__ */ u4("p", { className: "w-full sm:w-24 shrink-0 text-sm font-medium text-gray-700", children: "Due Date" }),
                    /* @__PURE__ */ u4(
                      "input",
                      {
                        required: true,
                        type: "date",
                        value: task.due_date,
                        onChange: (e4) => handleInputChange(index, "due_date", e4.target.value),
                        min: today2,
                        className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base transition outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ u4("div", { className: "flex items-center justify-between rounded-md bg-gray-100 p-2 sm:p-3", children: [
                    /* @__PURE__ */ u4("label", { className: "block text-sm sm:text-base font-medium text-gray-700", children: "A priority task?" }),
                    /* @__PURE__ */ u4("div", { className: "flex items-center", children: [
                      /* @__PURE__ */ u4("span", { className: "mr-2 text-sm text-gray-500", children: "No" }),
                      /* @__PURE__ */ u4(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleInputChange(index, "priority", !task.priority),
                          className: `${task.priority ? "bg-blue-600" : "bg-gray-200"} relative inline-flex h-6 w-11 items-center rounded-full
                      transition`,
                          children: /* @__PURE__ */ u4(
                            "span",
                            {
                              className: `${task.priority ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition
                        ease-in-out`
                            }
                          )
                        }
                      ),
                      /* @__PURE__ */ u4("span", { className: "ml-2 text-sm text-gray-500", children: "Yes" })
                    ] })
                  ] })
                ] })
              ] })
            ]
          },
          index
        )),
        /* @__PURE__ */ u4("div", { className: "mt-6 flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-0", children: [
          /* @__PURE__ */ u4(
            "button",
            {
              type: "button",
              onClick: addTaskField,
              className: "w-full sm:w-auto text-center rounded-md bg-gray-200 px-4 py-2 text-sm sm:text-base text-gray-700 transition-colors hover:bg-gray-300",
              children: "+ Add Another Task"
            }
          ),
          /* @__PURE__ */ u4(
            "button",
            {
              type: "submit",
              className: "w-full sm:w-auto text-center rounded-md bg-blue-600 px-6 py-2 text-sm sm:text-base text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none",
              children: "Submit Tasks"
            }
          )
        ] })
      ]
    }
  );
}
var today2;
var init_project_taskForm = __esm({
  "web/src/project/project.taskForm.tsx"() {
    "use strict";
    init_hooks_module();
    init_constants();
    init_jsxRuntime_module();
    today2 = todayUserTimeZone();
  }
});

// web/src/project/project.task.tsx
function TaskDetails({ taskSignal, setErrorMessage, isDemo }) {
  const task = taskSignal.value ?? {};
  const [formData, setFormData] = d2({
    task_id: task.task_id,
    task_title: task.task_title,
    task_desc: task.task_desc,
    task_priority: task.task_priority,
    task_due_date: task.task_due_date,
    task_is_done: task.task_is_done,
    task_done_date: task.task_done_date
  });
  const handleChange = (e4) => {
    const target = e4.target;
    const { name, value, type } = target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === "checkbox" ? target.checked : type === "number" ? parseInt(value) || 0 : value
      };
      if (name === "task_is_done") {
        newData.task_done_date = target.checked ? Math.floor(Date.now() / 1e3) : 0;
      }
      if (name === "task_done_date") {
        newData.task_done_date = Math.floor(new Date(value).getTime() / 1e3);
      }
      return newData;
    });
  };
  const submitEditTask = async (e4) => {
    e4.preventDefault();
    if (isDemo) {
      const storedTasksStr = localStorage.getItem("demo_tasks");
      if (storedTasksStr) {
        try {
          const storedTasks = JSON.parse(storedTasksStr);
          const updatedTasks = storedTasks.map(
            (t4) => t4.task_id === formData.task_id ? {
              ...t4,
              task_title: formData.task_title,
              task_desc: formData.task_desc,
              priority: formData.task_priority,
              due_date: formData.task_due_date,
              is_done: formData.task_is_done,
              done_date: formData.task_done_date
            } : t4
          );
          localStorage.setItem("demo_tasks", JSON.stringify(updatedTasks));
        } catch (err) {
          console.error("Error updating demo_tasks in localStorage", err);
        }
      }
      if (task.task_is_done !== formData.task_is_done) {
        const storedProjectsStr = localStorage.getItem("demo_projects");
        if (storedProjectsStr) {
          try {
            const storedProjects = JSON.parse(storedProjectsStr);
            const updatedProjects = storedProjects.map(
              (p5) => p5.project_title === task.project_title ? {
                ...p5,
                to_dos_done: formData.task_is_done ? p5.to_dos_done + 1 : p5.to_dos_done - 1
              } : p5
            );
            localStorage.setItem("demo_projects", JSON.stringify(updatedProjects));
          } catch (err) {
            console.error("Error updating demo_projects in localStorage", err);
          }
        }
      }
      window.location.reload();
      return;
    }
    try {
      const response = await fetch(`/task/${formData.task_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_title: formData.task_title,
          task_desc: formData.task_desc,
          task_priority: formData.task_priority,
          task_due_date: formData.task_due_date,
          task_is_done: formData.task_is_done,
          task_done_date: formData.task_done_date
        })
      });
      if (response.redirected) {
        window.location.replace(response.url);
      }
      const data = await response.json();
      if (data.success) window.location.reload();
      if (!data.success) setErrorMessage(data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  y2(() => {
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      taskSignal.value = null;
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return /* @__PURE__ */ u4(
    "form",
    {
      onSubmit: submitEditTask,
      class: "fixed top-1/2 left-1/2 z-13 h-9/10 w-9/10 -translate-1/2 rounded-xl border border-background bg-white shadow-lg md:h-fit md:max-w-2xl",
      children: [
        /* @__PURE__ */ u4("div", { class: "flex h-1/10 items-center justify-start rounded-t-xl bg-linear-to-r from-hover to-background p-5", children: /* @__PURE__ */ u4("h2", { class: "text-2xl font-bold text-white", children: "Task Details" }) }),
        /* @__PURE__ */ u4(
          "span",
          {
            class: "absolute top-5 right-5 cursor-pointer text-2xl font-extrabold text-white",
            onClick: () => taskSignal.value = null,
            children: "\u2715"
          }
        ),
        /* @__PURE__ */ u4("div", { class: "p-6", children: [
          /* @__PURE__ */ u4("div", { class: "mb-6 rounded-lg bg-gray-100 p-4", children: [
            /* @__PURE__ */ u4("h3", { class: "mb-1 text-lg font-semibold text-gray-800", children: "Project" }),
            /* @__PURE__ */ u4("div", { className: "flex flex-row items-center", children: [
              /* @__PURE__ */ u4("h2", { class: " text-xl font-bold text-background", children: task.project_title }),
              task.project_priority && /* @__PURE__ */ u4("span", { class: "ml-1 inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-background", children: "Priority Project" })
            ] })
          ] }),
          /* @__PURE__ */ u4("div", { class: "grid grid-cols-1 gap-2", children: [
            /* @__PURE__ */ u4("div", { class: "mb-4", children: [
              /* @__PURE__ */ u4(
                "label",
                {
                  class: "mb-2 block text-sm font-bold text-gray-700",
                  for: "task_title",
                  children: "Task Title"
                }
              ),
              /* @__PURE__ */ u4(
                "input",
                {
                  type: "text",
                  id: "task_title",
                  name: "task_title",
                  value: formData.task_title,
                  onChange: handleChange,
                  required: true,
                  class: "w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                }
              )
            ] }),
            /* @__PURE__ */ u4("div", { class: "mb-4", children: [
              /* @__PURE__ */ u4(
                "label",
                {
                  class: "mb-2 block text-sm font-bold text-gray-700",
                  for: "task_desc",
                  children: "Task Description"
                }
              ),
              /* @__PURE__ */ u4(
                "textarea",
                {
                  name: "task_desc",
                  value: formData.task_desc,
                  onChange: handleChange,
                  className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-base outline-none focus:border-transparent focus:ring-1 focus:ring-blue-500",
                  rows: 4
                }
              )
            ] }),
            /* @__PURE__ */ u4("div", { class: "mb-4 flex items-center justify-between rounded-md bg-gray-100 p-3", children: [
              /* @__PURE__ */ u4("label", { for: "priority-toggle", class: "text-base font-medium text-gray-700 cursor-pointer", children: "Priority" }),
              /* @__PURE__ */ u4("div", { class: "flex items-center", children: [
                /* @__PURE__ */ u4("span", { class: "mr-2 text-sm text-gray-500", children: "No" }),
                /* @__PURE__ */ u4(
                  "button",
                  {
                    id: "priority-toggle",
                    onClick: () => setFormData((prev) => ({
                      ...prev,
                      task_priority: !prev.task_priority
                    })),
                    type: "button",
                    class: `
                  relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer
                  ${formData.task_priority ? "bg-background" : "bg-gray-400"}
                `,
                    children: /* @__PURE__ */ u4(
                      "span",
                      {
                        class: `inline-block h-4 w-4 transform rounded-full bg-white transition ease-in-out
                    ${formData.task_priority ? "translate-x-6" : "translate-x-1"}`
                      }
                    )
                  }
                ),
                /* @__PURE__ */ u4("span", { class: "ml-2 text-sm text-gray-500", children: "Yes" })
              ] })
            ] }),
            /* @__PURE__ */ u4("div", { class: "mb-4", children: [
              /* @__PURE__ */ u4(
                "label",
                {
                  class: "mb-2 block text-sm font-bold text-gray-700",
                  for: "task_due_date",
                  children: "Due Date"
                }
              ),
              /* @__PURE__ */ u4(
                "input",
                {
                  type: "date",
                  id: "task_due_date",
                  name: "task_due_date",
                  value: formData.task_due_date,
                  onChange: handleChange,
                  class: "w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                }
              )
            ] }),
            /* @__PURE__ */ u4("div", { class: "mb-4", children: [
              /* @__PURE__ */ u4("label", { class: "flex items-center", children: [
                /* @__PURE__ */ u4(
                  "input",
                  {
                    id: "task-complete-button",
                    type: "checkbox",
                    name: "task_is_done",
                    checked: formData.task_is_done,
                    onChange: handleChange,
                    class: "h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  }
                ),
                formData.task_is_done ? /* @__PURE__ */ u4("label", { for: "task-complete-button", class: "ml-2 text-gray-800 cursor-pointer", children: "The task is complete." }) : /* @__PURE__ */ u4("span", { class: "ml-2 text-gray-700", children: "Mark this task as complete?" })
              ] }),
              formData.task_is_done && /* @__PURE__ */ u4("div", { class: "mt-2", children: [
                /* @__PURE__ */ u4(
                  "label",
                  {
                    class: "mb-2 block text-sm font-bold text-gray-700",
                    for: "task_done_date",
                    children: "Completion Date"
                  }
                ),
                /* @__PURE__ */ u4(
                  "input",
                  {
                    type: "date",
                    id: "task_done_date",
                    name: "task_done_date",
                    value: formattingDateObj(new Date(formData.task_done_date * 1e3)),
                    onChange: handleChange,
                    class: "w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ u4("div", { class: "mt-6 flex justify-end space-x-3", children: /* @__PURE__ */ u4(
            "button",
            {
              type: "submit",
              class: "rounded-md bg-blue-600 px-4 py-2 text-white cursor-pointer hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none",
              children: "Save Changes"
            }
          ) })
        ] })
      ]
    }
  );
}
var init_project_task = __esm({
  "web/src/project/project.task.tsx"() {
    "use strict";
    init_hooks_module();
    init_constants();
    init_jsxRuntime_module();
  }
});

// web/src/project/project.tasks.tsx
function TasksDisplay({
  tasks,
  shownTasks,
  project,
  setErrorMessage,
  isDemo
}) {
  const setTasks = (taskId, checked) => {
    const done_date = checked ? Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3) : 0;
    tasks.value = tasks.value.map(
      (task) => task.task_id === taskId ? { ...task, is_done: checked, done_date } : task
    );
  };
  const toggleTaskDoneStatus = async (checked, taskId, projectId) => {
    try {
      if (isDemo) {
        setTasks(taskId, checked);
        let newProject = project.value;
        let newToDosDone = checked ? newProject.to_dos_done + 1 : newProject.to_dos_done - 1;
        newProject = { ...newProject, to_dos_done: newToDosDone };
        project.value = newProject;
        const storedTasksStr = localStorage.getItem("demo_tasks");
        if (storedTasksStr) {
          try {
            const storedTasks = JSON.parse(storedTasksStr);
            const done_date = checked ? Math.floor(Date.now() / 1e3) : 0;
            const updatedTasks = storedTasks.map(
              (t4) => t4.task_id === taskId ? { ...t4, is_done: checked, done_date } : t4
            );
            localStorage.setItem("demo_tasks", JSON.stringify(updatedTasks));
          } catch (e4) {
            console.error("Error updating demo_tasks in localStorage", e4);
          }
        }
        const storedProjectsStr = localStorage.getItem("demo_projects");
        if (storedProjectsStr) {
          try {
            const storedProjects = JSON.parse(storedProjectsStr);
            const updatedProjects = storedProjects.map(
              (p5) => p5.project_id === projectId ? { ...p5, to_dos_done: newToDosDone } : p5
            );
            localStorage.setItem("demo_projects", JSON.stringify(updatedProjects));
          } catch (e4) {
            console.error("Error updating demo_projects in localStorage", e4);
          }
        }
        return;
      }
      const response = await fetch(`/task/${taskId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doneStatus: checked, taskId, projectId })
      });
      if (response.redirected) {
        window.location.replace(response.url);
      }
      const data = await response.json();
      if (data.success) {
        setTasks(taskId, checked);
        let newProject = project.value;
        let newToDosDone = checked ? newProject.to_dos_done + 1 : newProject.to_dos_done - 1;
        newProject = { ...newProject, to_dos_done: newToDosDone };
        project.value = newProject;
      }
      if (!data.success) setErrorMessage("There's an error.");
    } catch (error) {
      console.log(error);
      setTasks(taskId, !checked);
      setErrorMessage("There's an error in the server");
    }
  };
  const updateTasksDueDate = (taskId, due_date) => {
    tasks.value = tasks.value.map(
      (task) => task.task_id === taskId ? { ...task, due_date } : task
    );
  };
  const handleChangeDueDate = async (e4) => {
    e4.preventDefault();
    try {
      const taskId = parseInt(e4.target[0].name.split("-")[1]);
      const due_date = e4.target[0].value;
      if (isDemo) {
        updateTasksDueDate(taskId, due_date);
        const storedTasksStr = localStorage.getItem("demo_tasks");
        if (storedTasksStr) {
          try {
            const storedTasks = JSON.parse(storedTasksStr);
            const updatedTasks = storedTasks.map(
              (t4) => t4.task_id === taskId ? { ...t4, due_date } : t4
            );
            localStorage.setItem("demo_tasks", JSON.stringify(updatedTasks));
          } catch (err) {
            console.error("Error updating demo_tasks in localStorage", err);
          }
        }
        return;
      }
      const response = await fetch(`/task/${taskId}/due-date`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ due_date, taskId })
      });
      if (response.redirected) {
        window.location.replace(response.url);
      }
      const data = await response.json();
      if (data.success) updateTasksDueDate(taskId, due_date);
      if (!data.success) setErrorMessage("There's an error.");
    } catch (error) {
      console.log(error);
      setErrorMessage("There's an error in the server");
    }
  };
  const idToDelete = useSignal(0);
  const handleDelete = async (taskId) => {
    try {
      if (isDemo) {
        let isDone = false;
        tasks.value = tasks.value.filter((task) => {
          if (task.task_id === taskId) isDone = task.is_done;
          return task.task_id !== taskId;
        });
        project.value = {
          ...project.value,
          to_dos_all: project.value.to_dos_all - 1,
          to_dos_done: project.value.to_dos_done - (isDone ? 1 : 0)
        };
        const storedTasksStr = localStorage.getItem("demo_tasks");
        if (storedTasksStr) {
          try {
            const storedTasks = JSON.parse(storedTasksStr);
            const updatedTasks = storedTasks.filter((t4) => t4.task_id !== taskId);
            localStorage.setItem("demo_tasks", JSON.stringify(updatedTasks));
          } catch (e4) {
            console.error("Error deleting from demo_tasks in localStorage", e4);
          }
        }
        const storedProjectsStr = localStorage.getItem("demo_projects");
        if (storedProjectsStr) {
          try {
            const storedProjects = JSON.parse(storedProjectsStr);
            const updatedProjects = storedProjects.map(
              (p5) => p5.project_id === project.value.project_id ? {
                ...p5,
                to_dos_all: p5.to_dos_all - 1,
                to_dos_done: p5.to_dos_done - (isDone ? 1 : 0)
              } : p5
            );
            localStorage.setItem("demo_projects", JSON.stringify(updatedProjects));
          } catch (e4) {
            console.error("Error updating demo_projects in localStorage", e4);
          }
        }
        return;
      }
      const response = await fetch(`/task/${taskId}`, { method: "DELETE" });
      if (response.redirected) {
        window.location.replace(response.url);
      }
      const data = await response.json();
      if (data.success) {
        let isDone;
        tasks.value = tasks.value.filter((task) => {
          if (task.task_id === taskId) isDone = task.is_done;
          return task.task_id !== taskId;
        });
        project.value = {
          ...project.value,
          to_dos_all: project.value.to_dos_all - 1,
          to_dos_done: project.value.to_dos_done - (isDone ? 1 : 0)
        };
      }
      if (!data.success) setErrorMessage("There's an error.");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const shownTask = useSignal(null);
  return /* @__PURE__ */ u4("div", { class: "mx-auto max-w-3xl w-full overflow-hidden rounded-lg bg-white shadow", children: [
    /* @__PURE__ */ u4("div", { class: "max-h-[calc(100vh-100px)] w-full divide-y divide-gray-200 overflow-y-auto bg-white", children: shownTasks.value && shownTasks.value.map((task, i4) => /* @__PURE__ */ u4(
      "div",
      {
        id: `container-task-${task.task_id}`,
        class: `
              ${i4 % 2 == 0 ? "bg-[#e0fffd]" : ""}
              ${task.is_done && idToDelete.value != task.task_id ? "bg-pink-200 opacity-60" : ""}
              hover:${i4 % 2 == 0 ? "bg-[#e0fffd]" : "bg-white"} hover:opacity-100
              flex flex-col w-full
            `,
        children: [
          /* @__PURE__ */ u4(
            "div",
            {
              class: "group flex flex-row items-start cursor-pointer px-3 py-3 sm:px-6 sm:py-4 w-full sm:min-h-[6.25rem] md:min-w-[42rem] hover:bg-white hover:opacity-100",
              onClick: () => {
                shownTask.value = {
                  task_id: task.task_id,
                  task_title: task.task_title,
                  task_desc: task.task_desc,
                  task_priority: task.priority,
                  task_due_date: task.due_date,
                  task_is_done: task.is_done,
                  task_done_date: task.done_date,
                  project_title: project.value.project_title,
                  project_priority: false,
                  project_due_date: "",
                  project_is_done: false,
                  project_done_date: 0
                };
              },
              children: [
                /* @__PURE__ */ u4(
                  "input",
                  {
                    type: "checkbox",
                    class: "mt-1 sm:mt-1.5 h-4 w-4 sm:h-5 sm:w-5 shrink-0 rounded",
                    id: `task-${task.task_id}`,
                    checked: task.is_done,
                    "aria-label": `Mark task "${task.task_title}" as ${task.is_done ? "incomplete" : "complete"}`,
                    onClick: (e4) => {
                      e4.stopPropagation();
                      const inputElement = e4.target;
                      const checked = inputElement?.checked;
                      toggleTaskDoneStatus(checked, task.task_id, task.project_id);
                    }
                  }
                ),
                /* @__PURE__ */ u4("div", { class: "ml-2 sm:ml-3 flex-1 min-w-0 text-gray-900 group", children: [
                  /* @__PURE__ */ u4("p", { class: "text-base sm:text-lg font-medium break-words", children: [
                    task.task_title,
                    "\xA0",
                    task.priority && /* @__PURE__ */ u4("span", { class: "inline-flex items-center rounded-full bg-red-100 px-1.5 py-0.5 sm:p-1 text-[10px] sm:text-xs font-medium text-red-500 whitespace-nowrap", children: "Priority" })
                  ] }),
                  /* @__PURE__ */ u4("p", { class: "my-1 max-h-48 overflow-y-auto text-sm sm:text-base text-gray-500 break-words", children: task.task_desc }),
                  task.done_date > 0 && /* @__PURE__ */ u4("p", { class: "text-sm sm:text-base font-bold text-gray-500 break-words", children: [
                    "DONE :",
                    " ",
                    formattingDateTask(
                      new Date(task.done_date * 1e3).toLocaleDateString(
                        "en-CA"
                      )
                    )
                  ] })
                ] }),
                /* @__PURE__ */ u4("div", { class: "ml-2 sm:ml-4 flex flex-col shrink-0 w-fit sm:w-3/10 items-end justify-start sm:justify-center text-right text-xs sm:text-base font-semibold text-gray-600", children: [
                  "Due: ",
                  formattingDateTask(task.due_date),
                  !task.is_done && new Date(task.due_date) < dateToday && /* @__PURE__ */ u4(
                    "form",
                    {
                      id: "overdue-reschedule",
                      class: "mt-1 sm:mt-0 w-full sm:w-auto",
                      onSubmit: handleChangeDueDate,
                      children: /* @__PURE__ */ u4("div", { class: "group relative flex flex-col-reverse", children: [
                        /* @__PURE__ */ u4("div", { class: "flex flex-row items-center", children: [
                          /* @__PURE__ */ u4(
                            "input",
                            {
                              type: "date",
                              id: `unsorted_due_date-${task.task_id}`,
                              name: `unsorted_due_date-${task.task_id}`,
                              class: "p-1 sm:p-2 border border-solid border-gray-300 rounded flex-1 text-[10px] sm:text-sm w-24 sm:w-full max-w-[130px]",
                              required: true,
                              min: today3
                            }
                          ),
                          /* @__PURE__ */ u4(
                            "button",
                            {
                              type: "submit",
                              class: "cursor-pointer ml-1 sm:ml-2 text-lg sm:text-2xl font-extrabold text-background hover:text-white hover:bg-hover",
                              children: "\u2713"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ u4("span", { class: "hidden p-1 sm:p-2 z-10 bg-hover text-white w-full group-hover:flex text-[10px] sm:text-sm text-center rounded absolute sm:relative bottom-full mb-1 sm:mb-0", children: "Reschedule due date?" })
                      ] })
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ u4(
            "div",
            {
              class: `
                group-hover:flex flex-row items-center px-3 sm:px-6 py-2 sm:py-1 text-xs sm:text-base
                ${i4 % 2 == 0 ? "bg-ffg" : "bg-[#e0ffgd]"}
                ${idToDelete.value == task.task_id ? "flex" : "hidden "}
              `,
              children: [
                /* @__PURE__ */ u4(
                  "button",
                  {
                    onClick: () => idToDelete.value = task.task_id,
                    id: `delete-button-${task.task_id}`,
                    class: "flex shrink-0 items-center justify-center h-5 w-5 sm:h-5 sm:w-5",
                    children: /* @__PURE__ */ u4(
                      "img",
                      {
                        src: "/static/images/bin.svg",
                        alt: "delete button",
                        class: "h-3 w-3 sm:h-4 sm:w-4 cursor-pointer"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ u4(
                  "label",
                  {
                    class: `
                  cursor-pointer ml-2 sm:ml-3 flex-1 sm:w-full text-xs sm:text-base
                  ${idToDelete.value == task.task_id ? "w-fit" : "w-full"}
                `,
                    for: `delete-button-${task.task_id}`,
                    children: "Delete this task?"
                  }
                ),
                /* @__PURE__ */ u4(
                  "div",
                  {
                    class: `${idToDelete.value == task.task_id ? "flex" : "hidden "} flex-row gap-2`,
                    children: [
                      /* @__PURE__ */ u4(
                        "button",
                        {
                          type: "submit",
                          onClick: () => handleDelete(task.task_id),
                          class: "cursor-pointer px-2 sm:px-4 py-1 text-xs sm:text-base font-extrabold rounded text-background hover:text-white hover:bg-hover",
                          children: "\u2713Yes"
                        }
                      ),
                      /* @__PURE__ */ u4(
                        "button",
                        {
                          onClick: () => idToDelete.value = 0,
                          type: "submit",
                          class: "cursor-pointer px-2 sm:px-4 py-1 text-xs sm:text-base font-extrabold rounded text-background hover:text-white hover:bg-hover",
                          children: "\u2715No"
                        }
                      )
                    ]
                  }
                )
              ]
            }
          )
        ]
      },
      `task-${task.task_id}`
    )) }),
    shownTask.value && /* @__PURE__ */ u4(
      TaskDetails,
      {
        taskSignal: shownTask,
        setErrorMessage,
        isDemo
      }
    )
  ] });
}
var today3, dateToday;
var init_project_tasks = __esm({
  "web/src/project/project.tasks.tsx"() {
    "use strict";
    init_signals_module();
    init_constants();
    init_project_task();
    init_jsxRuntime_module();
    today3 = todayUserTimeZone();
    dateToday = new Date(today3);
  }
});

// web/src/project/project.tsx
var require_project = __commonJS({
  "web/src/project/project.tsx"() {
    init_preact_module();
    init_signals_module();
    init_hooks_module();
    init_project_project();
    init_project_editForm();
    init_project_taskForm();
    init_project_tasks();
    init_constants();
    init_jsxRuntime_module();
    function loadDemoProject(backendProject, isDemo) {
      if (!isDemo) return backendProject;
      const storedProjectsStr = localStorage.getItem("demo_projects");
      if (storedProjectsStr) {
        try {
          const storedProjects = JSON.parse(storedProjectsStr);
          const foundProject = storedProjects.find((p5) => p5.project_id === backendProject.project_id);
          if (foundProject) {
            return foundProject;
          }
        } catch (e4) {
          console.error("Error parsing demo_projects from LocalStorage", e4);
        }
      }
      return backendProject;
    }
    function loadDemoTasks(backendTasks, projectId, isDemo) {
      if (!isDemo) return backendTasks;
      const storedTasksStr = localStorage.getItem("demo_tasks");
      if (storedTasksStr) {
        try {
          const storedTasks = JSON.parse(storedTasksStr);
          const projectTasks = storedTasks.filter((t4) => t4.project_id === projectId);
          return projectTasks;
        } catch (e4) {
          console.error("Error parsing demo_tasks from LocalStorage", e4);
        }
      }
      return backendTasks;
    }
    function loadPrevData(key) {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        try {
          return JSON.parse(stored);
        } catch (e4) {
          console.error("Error parsing " + key, e4);
        }
      }
      return Math.random() >= 0.5;
    }
    function App({ projectData, taskList, countPriorityProjects, isDemo = false }) {
      const initialProject = loadDemoProject(projectData, isDemo);
      const project = useSignal(initialProject);
      const initialTasks = loadDemoTasks(taskList, initialProject.project_id, isDemo);
      const tasks = useSignal(initialTasks);
      const isEditingProject = useSignal(false);
      const isAddingTasks = useSignal(false);
      const errorMessage = useSignal("");
      const setErrorMessage = (message) => errorMessage.value = message;
      const getInitialTaskFilters = () => {
        const storedFilters = localStorage.getItem("projectTaskFilters");
        if (storedFilters) {
          try {
            return JSON.parse(storedFilters);
          } catch (e4) {
            console.error("Failed to parse stored task filters from LocalStorage", e4);
          }
        }
        return {
          selectedProject: ALL,
          priority: ALL,
          status: ALL,
          time: ALL
        };
      };
      const taskFilters = useSignal(getInitialTaskFilters());
      useSignalEffect(() => {
        localStorage.setItem("projectTaskFilters", JSON.stringify(taskFilters.value));
      });
      const showFilterDropdown = useSignal(loadPrevData("filterDropdown"));
      useSignalEffect(() => {
        const currentDropdown = showFilterDropdown.value;
        localStorage.setItem("filterDropdown", JSON.stringify(currentDropdown));
      });
      const getInitialSortCategory = () => {
        const storedSorter = localStorage.getItem("projectTaskSorter");
        if (storedSorter) {
          try {
            return JSON.parse(storedSorter);
          } catch (e4) {
            console.error("Failed to parse stored task sorter from LocalStorage", e4);
          }
        }
        return TaskSorter.Skip;
      };
      const sortCategory = useSignal(getInitialSortCategory());
      useSignalEffect(() => {
        localStorage.setItem("projectTaskSorter", JSON.stringify(sortCategory.value));
      });
      const sortFunctions = T2(
        () => ({
          [TaskSorter.DueDateAsc]: (a4, b3) => {
            return new Date(a4.due_date).getTime() - new Date(b3.due_date).getTime();
          },
          [TaskSorter.DueDateDesc]: (a4, b3) => {
            return new Date(b3.due_date).getTime() - new Date(a4.due_date).getTime();
          },
          [TaskSorter.DoneDateAsc]: (a4, b3) => {
            return new Date(a4.done_date).getTime() - new Date(b3.done_date).getTime();
          },
          [TaskSorter.DoneDateDesc]: (a4, b3) => {
            return new Date(b3.done_date).getTime() - new Date(a4.done_date).getTime();
          },
          [TaskSorter.Priority]: (a4, b3) => {
            return Number(b3.priority) - Number(a4.priority);
          }
        }),
        []
      );
      const shownTasks = useComputed(() => {
        let result = tasks.value;
        const today4 = todayUserTimeZone();
        if (!result) return [];
        if (taskFilters.value.priority !== TaskFiltersPriority.ALL) {
          result = result.filter((t4) => t4.priority);
        }
        if (taskFilters.value.status !== TaskFiltersStatus.ALL) {
          if (taskFilters.value.status === TaskFiltersStatus.Unfinished) {
            result = result.filter((t4) => !t4.is_done);
          }
          if (taskFilters.value.status === TaskFiltersStatus.Finished) {
            result = result.filter((t4) => t4.is_done);
          }
          if (taskFilters.value.status === TaskFiltersStatus.Overdue) {
            result = result.filter(
              (t4) => !t4.is_done && new Date(today4) > new Date(t4.due_date)
            );
          }
        }
        if (taskFilters.value.time !== ALL) {
          result = result.filter((t4) => {
            if (taskFilters.value.time == TaskFiltersTime.Today) {
              return t4.due_date == today4;
            }
            if (taskFilters.value.time == TaskFiltersTime.ThisWeek) {
              const { startOfWeek, endOfWeek } = getWeekRange(new Date(today4));
              return new Date(t4.due_date) >= startOfWeek && new Date(t4.due_date) <= endOfWeek;
            }
            if (taskFilters.value.time == TaskFiltersTime.SevenDays) {
              const thisDay = new Date(today4);
              const next7DaysEnd = new Date(today4);
              next7DaysEnd.setDate(thisDay.getDate() + 6);
              next7DaysEnd.setHours(23, 59, 59, 999);
              return new Date(t4.due_date) >= thisDay && new Date(t4.due_date) <= next7DaysEnd;
            }
            if (taskFilters.value.time == TaskFiltersTime.ThisMonth) {
              const { startOfMonth, endOfMonth } = getMonthRange(new Date(today4));
              return new Date(t4.due_date) >= startOfMonth && new Date(t4.due_date) <= endOfMonth;
            }
            if (taskFilters.value.time == TaskFiltersTime.ThirtyDays) {
              const thisDay = new Date(today4);
              const next30DaysEnd = new Date(today4);
              next30DaysEnd.setDate(thisDay.getDate() + 29);
              next30DaysEnd.setHours(23, 59, 59, 999);
              return new Date(t4.due_date) >= thisDay && new Date(t4.due_date) <= next30DaysEnd;
            }
            if (taskFilters.value.time == TaskFiltersTime.ThisQuarter) {
              const { startOfQuarter, endOfQuarter } = getQuarterRange(
                new Date(today4)
              );
              return new Date(t4.due_date) >= startOfQuarter && new Date(t4.due_date) <= endOfQuarter;
            }
            if (taskFilters.value.time) {
              return t4.due_date == taskFilters.value.time;
            }
          });
        }
        if (!sortCategory.value || sortCategory.value === TaskSorter.Skip) {
          return result;
        }
        return [...result].sort(sortFunctions[sortCategory.value]);
      });
      return /* @__PURE__ */ u4("div", { class: "flex w-full flex-col items-center px-3 sm:px-4 md:px-0", children: [
        /* @__PURE__ */ u4("h1", { class: "-mt-2.5 mb-5 md:mb-7.5 flex w-fit justify-center pt-3 text-center text-2xl font-bold text-gray-700 sm:text-3xl", children: "Project Details & Edit" }),
        /* @__PURE__ */ u4(ProjectDisplay, { project }),
        /* @__PURE__ */ u4("div", { class: "mx-auto mt-5 grid w-full max-w-3xl grid-cols-2 gap-2 text-sm sm:text-base md:text-lg", children: [
          /* @__PURE__ */ u4(
            "div",
            {
              onClick: () => isAddingTasks.value = !isAddingTasks.value,
              class: "flex w-full cursor-pointer items-center justify-center bg-white py-2 hover:bg-pink-50",
              children: "+ Add Task"
            }
          ),
          /* @__PURE__ */ u4(
            "div",
            {
              onClick: () => isEditingProject.value = true,
              class: "flex w-full cursor-pointer items-center justify-center bg-white py-2 hover:bg-pink-50",
              children: [
                /* @__PURE__ */ u4(
                  "img",
                  {
                    src: "/static/images/pencil.svg",
                    alt: "clock icon",
                    class: "h-4 w-4 sm:h-5 sm:w-5"
                  }
                ),
                "\xA0 Edit Project"
              ]
            }
          )
        ] }),
        isEditingProject.value && /* @__PURE__ */ u4(
          EditProjectForm,
          {
            project: project.value,
            isEditingProject,
            countPriorityProjects,
            setErrorMessage,
            isDemo
          }
        ),
        isAddingTasks.value && /* @__PURE__ */ u4(k, { children: [
          /* @__PURE__ */ u4("div", { class: "mx-auto my-5 w-full max-w-3xl border-t border-background" }),
          /* @__PURE__ */ u4(
            TaskForm,
            {
              isAddingTasks,
              project,
              setErrorMessage,
              isDemo
            }
          )
        ] }),
        /* @__PURE__ */ u4("div", { class: "mx-auto my-5 w-full max-w-3xl border-t border-background" }),
        /* @__PURE__ */ u4("div", { class: `mb-2 flex flex-row flex-wrap items-center justify-center gap-2 md:gap-0 ${showFilterDropdown.value ? "md:mb-0" : "md:mb-3"}`, children: [
          /* @__PURE__ */ u4(
            "button",
            {
              onClick: () => showFilterDropdown.value = !showFilterDropdown.value,
              class: "flex w-32 cursor-pointer flex-row items-center justify-center text-center text-sm font-medium hover:underline sm:w-35 sm:text-base md:mr-5 md:w-30",
              children: [
                /* @__PURE__ */ u4("img", { src: "/static/images/filter2.png", alt: "", class: "h-4 w-4" }),
                /* @__PURE__ */ u4("span", { class: "w-full px-2 py-2 text-center text-ellipsis text-nowrap sm:py-3", children: "\xA0Filters" })
              ]
            }
          ),
          /* @__PURE__ */ u4("div", { class: "flex w-32 cursor-pointer flex-row items-center justify-center text-center text-sm font-medium hover:underline sm:w-35 sm:text-lg md:w-fit", children: [
            /* @__PURE__ */ u4("img", { src: "/static/images/sort.png", alt: "", class: "h-4 w-2.5 sm:h-5 sm:w-3" }),
            /* @__PURE__ */ u4(
              "select",
              {
                onChange: (e4) => sortCategory.value = e4.currentTarget.value,
                value: sortCategory.value,
                id: "tasksFilterPriority",
                name: "tasksFilterPriority",
                class: "w-full px-2 py-2 text-center text-ellipsis text-nowrap text-sm sm:py-3 sm:text-base md:w-35",
                children: [
                  /* @__PURE__ */ u4("option", { value: TaskSorter.Skip, disabled: true, selected: true, children: "Sort by" }),
                  /* @__PURE__ */ u4("option", { value: TaskSorter.DueDateAsc, children: [
                    "Due Date",
                    /* @__PURE__ */ u4("span", { class: "flex items-start text-3xl", children: "\u2197" })
                  ] }),
                  /* @__PURE__ */ u4("option", { value: TaskSorter.DueDateDesc, children: [
                    "Due Date",
                    /* @__PURE__ */ u4("span", { class: "flex items-start text-3xl", children: "\u2198" })
                  ] }),
                  /* @__PURE__ */ u4("option", { value: TaskSorter.DoneDateAsc, children: [
                    "Done Date",
                    /* @__PURE__ */ u4("span", { class: "flex items-start text-3xl", children: "\u2197" })
                  ] }),
                  /* @__PURE__ */ u4("option", { value: TaskSorter.DoneDateDesc, children: [
                    "Done Date",
                    /* @__PURE__ */ u4("span", { class: "flex items-start text-3xl", children: "\u2198" })
                  ] }),
                  /* @__PURE__ */ u4("option", { value: TaskSorter.Priority, children: "Priority" })
                ]
              }
            )
          ] })
        ] }),
        showFilterDropdown.value && /* @__PURE__ */ u4("div", { class: "mb-4 flex w-full flex-row justify-center items-center", children: [
          /* @__PURE__ */ u4("div", { class: "flex w-1/3 cursor-pointer flex-col items-center justify-center text-base font-medium sm:w-30", children: [
            /* @__PURE__ */ u4("label", { class: "text-ellipsis text-nowrap", children: "Priority" }),
            /* @__PURE__ */ u4(
              "select",
              {
                onChange: (e4) => taskFilters.value = {
                  ...taskFilters.value,
                  priority: e4.currentTarget.value
                },
                value: taskFilters.value.priority,
                id: "tasksFilterPriority",
                name: "tasksFilterPriority",
                class: "border-border w-full rounded-sm border px-2 py-2 text-center text-ellipsis text-nowrap text-sm sm:py-3 sm:text-base",
                children: [
                  /* @__PURE__ */ u4("option", { value: TaskFiltersPriority.Priority, children: "Priority only" }),
                  /* @__PURE__ */ u4("option", { value: TaskFiltersPriority.ALL, selected: true, children: "All" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ u4("div", { class: "flex w-1/3 cursor-pointer flex-col items-center justify-center text-base font-medium sm:w-30", children: [
            /* @__PURE__ */ u4("label", { class: "text-ellipsis text-nowrap", children: "Status" }),
            /* @__PURE__ */ u4(
              "select",
              {
                onChange: (e4) => taskFilters.value = {
                  ...taskFilters.value,
                  status: e4.currentTarget.value
                },
                value: taskFilters.value.status,
                id: "tasksFilterStatus",
                name: "tasksFilterStatus",
                class: "border-border w-full rounded-sm border px-2 py-2 text-center text-ellipsis text-nowrap text-sm sm:py-3 sm:text-base",
                children: [
                  /* @__PURE__ */ u4("option", { value: TaskFiltersStatus.ALL, selected: true, children: "All" }),
                  /* @__PURE__ */ u4("option", { value: TaskFiltersStatus.Unfinished, children: "Unfinished" }),
                  /* @__PURE__ */ u4("option", { value: TaskFiltersStatus.Finished, children: "Finished" }),
                  /* @__PURE__ */ u4("option", { value: TaskFiltersStatus.Overdue, children: "Overdue" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ u4("div", { class: "flex w-1/3 cursor-pointer flex-col items-center justify-center text-base font-medium sm:w-30", children: [
            /* @__PURE__ */ u4("label", { class: "text-ellipsis text-nowrap", children: "Time Range" }),
            /* @__PURE__ */ u4(
              "select",
              {
                onChange: (e4) => taskFilters.value = {
                  ...taskFilters.value,
                  time: e4.currentTarget.value
                },
                value: taskFilters.value.time,
                id: "tasksFilterTime",
                name: "tasksFilterTime",
                class: "border-border w-full rounded-sm border px-2 py-2 text-center text-ellipsis text-nowrap text-sm sm:py-3 sm:text-base",
                children: [
                  /* @__PURE__ */ u4("option", { value: TaskFiltersTime.Today, selected: true, children: "Today" }),
                  /* @__PURE__ */ u4("option", { value: TaskFiltersTime.ThisWeek, children: "This Week" }),
                  /* @__PURE__ */ u4("option", { value: TaskFiltersTime.SevenDays, children: "Next 7 Days" }),
                  /* @__PURE__ */ u4("option", { value: TaskFiltersTime.ThisMonth, children: "This Month" }),
                  /* @__PURE__ */ u4("option", { value: TaskFiltersTime.ThirtyDays, children: "Next 30 Days" }),
                  /* @__PURE__ */ u4("option", { value: TaskFiltersTime.ThisQuarter, children: "This Quarter" }),
                  /* @__PURE__ */ u4("option", { value: TaskFiltersTime.ALL, children: "All" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ u4(
          TasksDisplay,
          {
            tasks,
            shownTasks,
            project,
            setErrorMessage,
            isDemo
          }
        ),
        errorMessage.value && /* @__PURE__ */ u4(
          ErrorMessage,
          {
            errorMessage,
            setErrorMessage
          }
        )
      ] });
    }
    function ErrorMessage({ errorMessage, setErrorMessage }) {
      return /* @__PURE__ */ u4("div", { class: "fixed top-1/2 left-1/2 z-11 flex min-h-40 w-[90%] max-w-md -translate-1/2 items-center justify-center rounded-md border border-background bg-background px-5 py-8 text-white shadow-lg sm:w-auto sm:min-w-80 md:w-fit", children: [
        /* @__PURE__ */ u4(
          "span",
          {
            onClick: () => {
              setErrorMessage("");
              setTimeout(() => {
                location.reload();
              }, 3500);
            },
            class: "absolute top-2 right-2 cursor-pointer text-2xl font-extrabold text-white",
            children: "\u2715"
          }
        ),
        /* @__PURE__ */ u4("div", { class: "flex flex-col items-center justify-center", children: /* @__PURE__ */ u4("p", { class: "wrap-break-words text-center text-lg font-extrabold sm:text-xl", children: errorMessage }) })
      ] });
    }
    var dataWindow = window;
    G(
      /* @__PURE__ */ u4(
        App,
        {
          projectData: dataWindow.projectData,
          taskList: dataWindow.taskList,
          countPriorityProjects: dataWindow.countPriorityProjects,
          isDemo: dataWindow.isDemo || false
        }
      ),
      document.getElementById("projects")
    );
  }
});
export default require_project();
