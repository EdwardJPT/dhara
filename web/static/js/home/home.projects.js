// node_modules/preact/dist/preact.module.js
var n;
var l;
var u;
var t;
var i;
var o;
var r;
var e;
var f;
var c;
var s;
var a;
var h;
var p = {};
var v = [];
var y = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var d = Array.isArray;
function w(n3, l5) {
  for (var u5 in l5) n3[u5] = l5[u5];
  return n3;
}
function g(n3) {
  n3 && n3.parentNode && n3.parentNode.removeChild(n3);
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
  var a4, h4, y5, d4, w5, g4, _3, m5 = t4 && t4.__k || v, b3 = l5.length;
  for (f5 = P(u5, l5, m5, f5, b3), a4 = 0; a4 < b3; a4++) null != (y5 = u5.__k[a4]) && (h4 = -1 == y5.__i ? p : m5[y5.__i] || p, y5.__i = a4, g4 = O(n3, y5, h4, i4, o4, r4, e4, f5, c4, s4), d4 = y5.__e, y5.ref && h4.ref != y5.ref && (h4.ref && B(h4.ref, null, y5), s4.push(y5.ref, y5.__c || d4, y5)), null == w5 && null != d4 && (w5 = d4), (_3 = !!(4 & y5.__u)) || h4.__k === y5.__k ? f5 = A(y5, f5, n3, _3) : "function" == typeof y5.type && void 0 !== g4 ? f5 = g4 : d4 && (f5 = d4.nextSibling), y5.__u &= -7);
  return u5.__e = w5, f5;
}
function P(n3, l5, u5, t4, i4) {
  var o4, r4, e4, f5, c4, s4 = u5.length, a4 = s4, h4 = 0;
  for (n3.__k = new Array(i4), o4 = 0; o4 < i4; o4++) null != (r4 = l5[o4]) && "boolean" != typeof r4 && "function" != typeof r4 ? ("string" == typeof r4 || "number" == typeof r4 || "bigint" == typeof r4 || r4.constructor == String ? r4 = n3.__k[o4] = m(null, r4, null, null, null) : d(r4) ? r4 = n3.__k[o4] = m(k, { children: r4 }, null, null, null) : void 0 === r4.constructor && r4.__b > 0 ? r4 = n3.__k[o4] = m(r4.type, r4.props, r4.key, r4.ref ? r4.ref : null, r4.__v) : n3.__k[o4] = r4, f5 = o4 + h4, r4.__ = n3, r4.__b = n3.__b + 1, e4 = null, -1 != (c4 = r4.__i = L(r4, u5, f5, a4)) && (a4--, (e4 = u5[c4]) && (e4.__u |= 2)), null == e4 || null == e4.__v ? (-1 == c4 && (i4 > s4 ? h4-- : i4 < s4 && h4++), "function" != typeof r4.type && (r4.__u |= 4)) : c4 != f5 && (c4 == f5 - 1 ? h4-- : c4 == f5 + 1 ? h4++ : (c4 > f5 ? h4-- : h4++, r4.__u |= 4))) : n3.__k[o4] = null;
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
  var a4, h4, p5, v4, y5, _3, m5, b3, S3, C3, M2, $2, P2, A4, H, L2, T4, j3 = u5.type;
  if (void 0 !== u5.constructor) return null;
  128 & t4.__u && (c4 = !!(32 & t4.__u), r4 = [f5 = u5.__e = t4.__e]), (a4 = l.__b) && a4(u5);
  n: if ("function" == typeof j3) try {
    if (b3 = u5.props, S3 = "prototype" in j3 && j3.prototype.render, C3 = (a4 = j3.contextType) && i4[a4.__c], M2 = a4 ? C3 ? C3.props.value : a4.__ : i4, t4.__c ? m5 = (h4 = u5.__c = t4.__c).__ = h4.__E : (S3 ? u5.__c = h4 = new j3(b3, M2) : (u5.__c = h4 = new x(b3, M2), h4.constructor = j3, h4.render = E), C3 && C3.sub(h4), h4.state || (h4.state = {}), h4.__n = i4, p5 = h4.__d = true, h4.__h = [], h4._sb = []), S3 && null == h4.__s && (h4.__s = h4.state), S3 && null != j3.getDerivedStateFromProps && (h4.__s == h4.state && (h4.__s = w({}, h4.__s)), w(h4.__s, j3.getDerivedStateFromProps(b3, h4.__s))), v4 = h4.props, y5 = h4.state, h4.__v = u5, p5) S3 && null == j3.getDerivedStateFromProps && null != h4.componentWillMount && h4.componentWillMount(), S3 && null != h4.componentDidMount && h4.__h.push(h4.componentDidMount);
    else {
      if (S3 && null == j3.getDerivedStateFromProps && b3 !== v4 && null != h4.componentWillReceiveProps && h4.componentWillReceiveProps(b3, M2), u5.__v == t4.__v || !h4.__e && null != h4.shouldComponentUpdate && false === h4.shouldComponentUpdate(b3, h4.__s, M2)) {
        for (u5.__v != t4.__v && (h4.props = b3, h4.state = h4.__s, h4.__d = false), u5.__e = t4.__e, u5.__k = t4.__k, u5.__k.some(function(n4) {
          n4 && (n4.__ = u5);
        }), $2 = 0; $2 < h4._sb.length; $2++) h4.__h.push(h4._sb[$2]);
        h4._sb = [], h4.__h.length && e4.push(h4);
        break n;
      }
      null != h4.componentWillUpdate && h4.componentWillUpdate(b3, h4.__s, M2), S3 && null != h4.componentDidUpdate && h4.__h.push(function() {
        h4.componentDidUpdate(v4, y5, _3);
      });
    }
    if (h4.context = M2, h4.props = b3, h4.__P = n3, h4.__e = false, P2 = l.__r, A4 = 0, S3) {
      for (h4.state = h4.__s, h4.__d = false, P2 && P2(u5), a4 = h4.render(h4.props, h4.state, h4.context), H = 0; H < h4._sb.length; H++) h4.__h.push(h4._sb[H]);
      h4._sb = [];
    } else do {
      h4.__d = false, P2 && P2(u5), a4 = h4.render(h4.props, h4.state, h4.context), h4.state = h4.__s;
    } while (h4.__d && ++A4 < 25);
    h4.state = h4.__s, null != h4.getChildContext && (i4 = w(w({}, i4), h4.getChildContext())), S3 && !p5 && null != h4.getSnapshotBeforeUpdate && (_3 = h4.getSnapshotBeforeUpdate(v4, y5)), L2 = a4, null != a4 && a4.type === k && null == a4.key && (L2 = V(a4.props.children)), f5 = I(n3, d(L2) ? L2 : [L2], u5, t4, i4, o4, r4, e4, f5, c4, s4), h4.base = u5.__e, u5.__u &= -161, h4.__h.length && e4.push(h4), m5 && (h4.__E = h4.__ = null);
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
  var a4, h4, v4, y5, w5, _3, m5, b3 = i4.props || p, k4 = t4.props, x3 = t4.type;
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
    for (a4 in k4) w5 = k4[a4], "children" == a4 ? y5 = w5 : "dangerouslySetInnerHTML" == a4 ? h4 = w5 : "value" == a4 ? _3 = w5 : "checked" == a4 ? m5 = w5 : c4 && "function" != typeof w5 || b3[a4] === w5 || j(u5, a4, w5, b3[a4], r4);
    if (h4) c4 || v4 && (h4.__html == v4.__html || h4.__html == u5.innerHTML) || (u5.innerHTML = h4.__html), t4.__k = [];
    else if (v4 && (u5.innerHTML = ""), I("template" == t4.type ? u5.content : u5, d(y5) ? y5 : [y5], t4, i4, o4, "foreignObject" == x3 ? "http://www.w3.org/1999/xhtml" : r4, e4, f5, e4 ? e4[0] : i4.__k && S(i4, 0), c4, s4), null != e4) for (a4 = e4.length; a4--; ) g(e4[a4]);
    c4 || (a4 = "value", "progress" == x3 && null == _3 ? u5.removeAttribute("value") : null != _3 && (_3 !== u5[a4] || "progress" == x3 && !_3 || "option" == x3 && _3 != b3[a4]) && j(u5, a4, _3, b3[a4], r4), a4 = "checked", null != m5 && m5 != u5[a4] && j(u5, a4, m5, b3[a4], r4));
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

// node_modules/preact/hooks/dist/hooks.module.js
var t2;
var r2;
var u2;
var i2;
var o2 = 0;
var f2 = [];
var c2 = l;
var e2 = c2.__b;
var a2 = c2.__r;
var v2 = c2.diffed;
var l2 = c2.__c;
var m2 = c2.unmount;
var s2 = c2.__;
function p2(n3, t4) {
  c2.__h && c2.__h(r2, n3, o2 || t4), o2 = 0;
  var u5 = r2.__H || (r2.__H = { __: [], __h: [] });
  return n3 >= u5.__.length && u5.__.push({}), u5.__[n3];
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
var k2 = "function" == typeof requestAnimationFrame;
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

// node_modules/@preact/signals-core/dist/signals-core.module.js
var i3 = Symbol.for("preact-signals");
function t3() {
  if (!(s3 > 1)) {
    var i4, t4 = false;
    while (void 0 !== h2) {
      var n3 = h2;
      h2 = void 0;
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
var r3 = void 0;
function o3(i4) {
  var t4 = r3;
  r3 = void 0;
  try {
    return i4();
  } finally {
    r3 = t4;
  }
}
var f3;
var h2 = void 0;
var s3 = 0;
var v3 = 0;
var u3 = 0;
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
function d2(i4, t4) {
  this.v = i4;
  this.i = 0;
  this.n = void 0;
  this.t = void 0;
  this.W = null == t4 ? void 0 : t4.watched;
  this.Z = null == t4 ? void 0 : t4.unwatched;
  this.name = null == t4 ? void 0 : t4.name;
}
d2.prototype.brand = i3;
d2.prototype.h = function() {
  return true;
};
d2.prototype.S = function(i4) {
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
d2.prototype.U = function(i4) {
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
d2.prototype.subscribe = function(i4) {
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
d2.prototype.valueOf = function() {
  return this.value;
};
d2.prototype.toString = function() {
  return this.value + "";
};
d2.prototype.toJSON = function() {
  return this.value;
};
d2.prototype.peek = function() {
  var i4 = r3;
  r3 = void 0;
  try {
    return this.value;
  } finally {
    r3 = i4;
  }
};
Object.defineProperty(d2.prototype, "value", { get: function() {
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
function c3(i4, t4) {
  return new d2(i4, t4);
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
  d2.call(this, void 0);
  this.x = i4;
  this.s = void 0;
  this.g = u3 - 1;
  this.f = 4;
  this.W = null == t4 ? void 0 : t4.watched;
  this.Z = null == t4 ? void 0 : t4.unwatched;
  this.name = null == t4 ? void 0 : t4.name;
}
w3.prototype = new d2();
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
  d2.prototype.S.call(this, i4);
};
w3.prototype.U = function(i4) {
  if (void 0 !== this.t) {
    d2.prototype.U.call(this, i4);
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
function b(i4, t4) {
  return new w3(i4, t4);
}
function _(i4) {
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
  _(i4);
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
  _(this);
  l3(this);
  s3++;
  var i4 = r3;
  r3 = this;
  return g2.bind(this, i4);
};
S2.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 2;
    this.o = h2;
    h2 = this;
  }
};
S2.prototype.d = function() {
  this.f |= 8;
  if (!(1 & this.f)) p3(this);
};
S2.prototype.dispose = function() {
  this.d();
};
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

// node_modules/@preact/signals/dist/signals.module.js
var l4;
var h3;
var d3;
var p4 = "undefined" != typeof window && !!window.__PREACT_SIGNALS_DEVTOOLS__;
var m4 = [];
var _2 = [];
m3(function() {
  l4 = this.N;
})();
function g3(i4, t4) {
  l[i4] = t4.bind(null, l[i4] || function() {
  });
}
function b2(i4) {
  if (d3) {
    var n3 = d3;
    d3 = void 0;
    n3();
  }
  d3 = i4 && i4.S();
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
y4.displayName = "ReactiveTextNode";
Object.defineProperties(d2.prototype, { constructor: { configurable: true, value: void 0 }, type: { configurable: true, value: y4 }, props: { configurable: true, get: function() {
  return { data: this };
} }, __b: { configurable: true, value: 1 } });
g3("__b", function(i4, n3) {
  if ("string" == typeof n3.type) {
    var t4, r4 = n3.props;
    for (var o4 in r4) if ("children" !== o4) {
      var f5 = r4[o4];
      if (f5 instanceof d2) {
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
    h3 = o4;
    b2(t4);
  }
});
g3("__e", function(i4, n3, t4, r4) {
  b2();
  h3 = void 0;
  i4(n3, t4, r4);
});
g3("diffed", function(i4, n3) {
  b2();
  h3 = void 0;
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
function useSignal(i4, n3) {
  return T2(function() {
    return c3(i4, n3);
  }, []);
}
function useComputed(i4, n3) {
  var t4 = A2(i4);
  t4.current = i4;
  h3.__$f |= 4;
  return T2(function() {
    return b(function() {
      return t4.current();
    }, n3);
  }, []);
}
var k3 = "undefined" == typeof requestAnimationFrame ? setTimeout : function(i4) {
  var n3 = function() {
    clearTimeout(t4);
    cancelAnimationFrame(r4);
    i4();
  }, t4 = setTimeout(n3, 35), r4 = requestAnimationFrame(n3);
};
var q2 = function(i4) {
  queueMicrotask(function() {
    queueMicrotask(i4);
  });
};
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
    while (i4 = _2.shift()) l4.call(i4);
  });
}
function F2() {
  if (1 === _2.push(this)) (l.requestAnimationFrame || q2)(x2);
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

// web/src/components/constants.js
var ALL = "all";
var Priority = "priority";
var ProjectFilters = Object.freeze({
  ALL,
  Unfinished: "unfinished",
  Finished: "finished",
  Overdue: "overdue"
});
var ProjectSorter = Object.freeze({
  Skip: "",
  DueDateAsc: "dueDateAsc",
  DueDateDesc: "dueDateDesc",
  DoneDateAsc: "doneDateAsc",
  DoneDateDesc: "doneDateDesc",
  Priority
});
var TaskFiltersPriority = Object.freeze({ ALL, Priority });
var TaskFiltersStatus = Object.freeze({
  ALL,
  Unfinished: "unfinished",
  Finished: "finished",
  Overdue: "overdue"
});
var TaskFiltersTime = Object.freeze({
  ALL,
  Today: "today",
  ThisWeek: "week",
  SevenDays: "7days",
  ThisMonth: "month",
  ThirtyDays: "30days",
  ThisQuarter: "quarter"
});
var TaskSorter = Object.freeze({
  Skip: "",
  DueDateAsc: "dueDateAsc",
  DueDateDesc: "dueDateDesc",
  DoneDateAsc: "doneDateAsc",
  DoneDateDesc: "doneDateDesc",
  Priority: "priority"
});
var defaultTaskFilters = Object.freeze({
  selectedProject: ALL,
  priority: ALL,
  status: ALL,
  time: TaskFiltersTime.Today
});
var monthNames = [
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
function formattingDateProject(date) {
  if (!date) return "";
  let dateArray = date.split("-");
  let formattedDate = dateArray[2] + " " + monthNames[dateArray[1] - 1].slice(0, 3) + " " + dateArray[0];
  return formattedDate ? formattedDate : "";
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
  const today = new Date(todayUserTimeZone());
  const daysAgo = (today - startDate) / (1e3 * 60 * 60 * 24);
  if (daysAgo > 1) return `${daysAgo} days ago`;
  if (daysAgo == 1) return "Yesterday";
  if (daysAgo == 0) return "Today";
  if (daysAgo == -1) return "Tomorrow";
  return `${-daysAgo} days from now`;
}
function nDaysLeft(dateString) {
  if (!dateString) return "Has no deadline";
  const deadline = new Date(dateString);
  const today = new Date(todayUserTimeZone());
  const daysLeft = (deadline - today) / (1e3 * 60 * 60 * 24);
  if (daysLeft > 1) return `${daysLeft} days left`;
  if (daysLeft == 1) return "Tomorrow";
  if (daysLeft == 0) return "Today";
  if (daysLeft == -1) return "Overdue yesterday";
  return `${-daysLeft} days overdue`;
}
var ReportsTimeRange = Object.freeze({
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
var TaskStatsKeyMap = Object.freeze({
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

// node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
var f4 = 0;
function u4(e4, t4, n3, o4, i4, u5) {
  t4 || (t4 = {});
  var a4, c4, p5 = t4;
  if ("ref" in p5) for (c4 in p5 = {}, t4) "ref" == c4 ? a4 = t4[c4] : p5[c4] = t4[c4];
  var l5 = { type: e4, props: p5, key: n3, ref: a4, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f4, __i: -1, __u: 0, __source: i4, __self: u5 };
  if ("function" == typeof e4 && (a4 = e4.defaultProps)) for (c4 in a4) void 0 === p5[c4] && (p5[c4] = a4[c4]);
  return l.vnode && l.vnode(l5), l5;
}

// web/src/home/home.projects.tsx
var ProjectCard = ({ project, setSelectedProject, isDemo }) => {
  return /* @__PURE__ */ u4(
    "div",
    {
      onClick: () => setSelectedProject(project.project_id),
      class: `${project.is_done ? "bg-pink-300 opacity-50" : "bg-white"} group flex h-64 cursor-pointer snap-start flex-col rounded-lg border-l-4 border-background p-6 shadow hover:bg-pink-50`,
      children: [
        /* @__PURE__ */ u4("div", { class: "flex flex-col justify-start", children: [
          /* @__PURE__ */ u4("div", { class: "mb-2 flex justify-between", children: [
            /* @__PURE__ */ u4(
              "a",
              {
                href: isDemo ? `/demo/project/${project.public_id}` : `/project/${project.public_id}`,
                target: "_blank",
                class: "block h-fit max-h-10 items-center overflow-y-auto text-lg font-semibold text-slate-600 hover:underline",
                onClick: (e4) => e4.stopPropagation(),
                children: project.project_title
              }
            ),
            project.priority && /* @__PURE__ */ u4("span", { class: "p-2 my-auto inline-flex max-h-6 w-fit items-center rounded-full bg-red-100 text-xs font-medium text-red-800", children: "Priority" })
          ] }),
          /* @__PURE__ */ u4("div", { class: "overflow-y-auto", children: /* @__PURE__ */ u4("p", { class: "h-25 min-h-20 text-base text-ellipsis text-gray-700", children: project.project_desc }) })
        ] }),
        /* @__PURE__ */ u4("div", { class: "hidden flex-row items-center justify-between pt-1 group-hover:flex", children: [
          /* @__PURE__ */ u4("p", { class: "text-sm text-gray-500 font-medium", children: [
            "Start: ",
            formattingDateProject(project.start_date)
          ] }),
          /* @__PURE__ */ u4("p", { class: "flex flex-row items-center text-sm text-hover", children: [
            /* @__PURE__ */ u4("img", { src: "/static/images/clock.svg", alt: "clock icon", class: "h-3 w-3" }),
            "\xA0",
            nDaysAgo(project.start_date)
          ] })
        ] }),
        project.done_date ? /* @__PURE__ */ u4("div", { class: "flex items-center justify-between py-2 group-hover:py-0", children: /* @__PURE__ */ u4("p", { class: "bg-white text-sm font-extrabold text-gray-800 no-underline opacity-100", children: [
          "DONE : ",
          formattingDateProject(new Date(project.done_date * 1e3).toLocaleDateString("en-CA"))
        ] }) }) : /* @__PURE__ */ u4("div", { class: "flex items-center justify-between py-2 group-hover:py-0", children: [
          /* @__PURE__ */ u4("p", { class: "text-sm text-gray-500 font-medium", children: [
            "Due : ",
            formattingDateProject(project.due_date)
          ] }),
          /* @__PURE__ */ u4("p", { class: "flex flex-row items-center text-sm text-hover", children: [
            /* @__PURE__ */ u4("img", { src: "/static/images/clock.svg", alt: "clock icon", class: "h-3 w-3" }),
            "\xA0",
            nDaysLeft(project.due_date)
          ] })
        ] }),
        /* @__PURE__ */ u4("div", { class: "flex items-center", children: [
          /* @__PURE__ */ u4("div", { class: "mr-2 h-2 w-full bg-slate-200", children: /* @__PURE__ */ u4("div", { class: "h-full bg-linear-to-r from-blue-400 to-blue-700", style: { width: `calc(100% * ${project.to_dos_done} / ${project.to_dos_all})` } }) }),
          /* @__PURE__ */ u4("span", { class: "text-sm font-medium text-gray-500", children: [
            project.to_dos_done,
            "/",
            project.to_dos_all
          ] })
        ] })
      ]
    }
  );
};
function ProjectsDisplay({
  projects,
  setSelectedProject,
  showUnsorted,
  unfinishedUnsorted,
  isDemo
}) {
  const showFilter = useSignal(false);
  const isViewMore = useSignal(false);
  const getInitialProjectFilter = () => {
    const storedFilter = localStorage.getItem("projectFilter");
    if (storedFilter) {
      try {
        return JSON.parse(storedFilter);
      } catch (e4) {
        console.error("No stored projectFilter from LocalStorage", e4);
      }
    }
    return ProjectFilters.ALL;
  };
  const projectFilter = useSignal(getInitialProjectFilter());
  useSignalEffect(() => {
    localStorage.setItem("projectFilter", JSON.stringify(projectFilter.value));
  });
  const getInitialProjectSorter = () => {
    const storedSorter = localStorage.getItem("projectSorter");
    if (storedSorter) {
      try {
        return JSON.parse(storedSorter);
      } catch (e4) {
        console.error("No stored projectSorter from LocalStorage", e4);
      }
    }
    return ProjectSorter.Skip;
  };
  const projectSorter = useSignal(getInitialProjectSorter());
  useSignalEffect(() => {
    localStorage.setItem("projectSorter", JSON.stringify(projectSorter.value));
  });
  const sortFunctions = T2(() => ({
    [ProjectSorter.DueDateAsc]: (a4, b3) => {
      return new Date(a4.due_date).getTime() - new Date(b3.due_date).getTime();
    },
    [ProjectSorter.DueDateDesc]: (a4, b3) => {
      return new Date(b3.due_date).getTime() - new Date(a4.due_date).getTime();
    },
    [ProjectSorter.DoneDateAsc]: (a4, b3) => {
      return new Date(a4.done_date).getTime() - new Date(b3.done_date).getTime();
    },
    [ProjectSorter.DoneDateDesc]: (a4, b3) => {
      return new Date(b3.done_date).getTime() - new Date(a4.done_date).getTime();
    },
    [ProjectSorter.Priority]: (a4, b3) => {
      return Number(b3.priority) - Number(a4.priority);
    }
  }), []);
  const shownProjects = useComputed(() => {
    let result = projects.value;
    const today = todayUserTimeZone();
    if (projectFilter.value !== ProjectFilters.ALL) {
      if (projectFilter.value === ProjectFilters.Unfinished) {
        result = result.filter((p5) => !p5.is_done);
      }
      if (projectFilter.value === ProjectFilters.Finished) {
        result = result.filter((p5) => p5.is_done);
      }
      if (projectFilter.value === ProjectFilters.Overdue) {
        result = result.filter((p5) => !p5.is_done && new Date(today) > new Date(p5.due_date));
      }
    }
    if (!projectSorter.value) return result;
    return [...result].sort(sortFunctions[projectSorter.value]);
  });
  return /* @__PURE__ */ u4(k, { children: [
    /* @__PURE__ */ u4("div", { class: "mb-0 flex flex-col items-center justify-around md:mb-6 md:flex-row md:justify-between", children: [
      shownProjects.value.length > 0 && /* @__PURE__ */ u4(
        "div",
        {
          onClick: () => showFilter.value = !showFilter.value,
          class: `${showFilter.value ? "" : "mb-6"} mt-2.5 mb-4 flex cursor-pointer flex-row items-center sm:hidden`,
          children: showFilter.value ? "Collapse \u2303" : "Expand \u2304"
        }
      ),
      /* @__PURE__ */ u4(
        "div",
        {
          class: `${showFilter.value || !shownProjects.value.length ? "" : "hidden"} mb-5 flex w-full flex-row justify-evenly sm:flex md:mb-0 md:justify-start`,
          children: [
            /* @__PURE__ */ u4(
              "button",
              {
                "hx-get": `${isDemo ? "/demo" : ""}/home/create-project-form`,
                "hx-target": "#form-container",
                "hx-swap": "innerHTML",
                class: "flex min-w-35 cursor-pointer items-center justify-center rounded-xl bg-background p-1.25 text-center text-base font-semibold text-white hover:bg-hover md:mr-5 md:px-2.5 md:py-1 md:text-lg",
                children: "+ New Project"
              }
            ),
            /* @__PURE__ */ u4(
              "button",
              {
                onClick: () => showUnsorted.value = true,
                class: "flex cursor-pointer items-center justify-center rounded-xl bg-background p-1.25 text-center text-base font-semibold text-white hover:bg-hover md:px-2.5 md:py-1 md:text-lg",
                children: [
                  /* @__PURE__ */ u4("img", { src: "/static/images/list.svg", alt: "list of unsorted tasks", class: "h-3.5 w-3.5" }),
                  "\xA0Unsorted (",
                  unfinishedUnsorted.value,
                  ")"
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ u4(
        "div",
        {
          class: `${showFilter.value ? "" : "hidden"} mb-5 flex w-full flex-row justify-evenly sm:flex md:mb-0 md:justify-end`,
          children: [
            /* @__PURE__ */ u4("div", { class: "flex w-35 cursor-pointer flex-row items-center justify-center text-center text-base md:mr-5 hover:text-background md:w-30", children: [
              /* @__PURE__ */ u4("img", { src: "/static/images/filter2.png", alt: "", class: "h-4 w-4" }),
              "\xA0",
              /* @__PURE__ */ u4(
                "select",
                {
                  onChange: (e4) => projectFilter.value = e4.currentTarget.value,
                  id: "tasksFilterStatus",
                  name: "tasksFilterStatus",
                  class: "w-full px-2 py-3 text-center text-nowrap text-ellipsis",
                  children: [
                    /* @__PURE__ */ u4("option", { selected: true, disabled: true, children: "Filter" }),
                    /* @__PURE__ */ u4("option", { value: ProjectFilters.ALL, children: "All" }),
                    /* @__PURE__ */ u4("option", { value: ProjectFilters.Unfinished, children: "Unfinished" }),
                    /* @__PURE__ */ u4("option", { value: ProjectFilters.Finished, children: "Finished" }),
                    /* @__PURE__ */ u4("option", { value: ProjectFilters.Overdue, children: "Overdue" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ u4("div", { class: "flex w-35 cursor-pointer flex-row items-center justify-center text-center text-base hover:text-background md:w-fit", children: [
              /* @__PURE__ */ u4("img", { src: "/static/images/sort.png", alt: "", class: "h-5 w-3" }),
              /* @__PURE__ */ u4(
                "select",
                {
                  onChange: (e4) => projectSorter.value = e4.currentTarget.value,
                  id: "projectsFilterPriority",
                  name: "projectsFilterPriority",
                  class: "w-full px-2 py-3 text-center text-nowrap text-ellipsis md:w-35",
                  children: [
                    /* @__PURE__ */ u4("option", { value: ProjectSorter.Skip, disabled: true, selected: true, children: "Sort by" }),
                    /* @__PURE__ */ u4("option", { value: ProjectSorter.DueDateAsc, children: [
                      "Due Date",
                      /* @__PURE__ */ u4("span", { class: "flex items-start text-3xl", children: "\u2197" })
                    ] }),
                    /* @__PURE__ */ u4("option", { value: ProjectSorter.DueDateDesc, children: [
                      "Due Date",
                      /* @__PURE__ */ u4("span", { class: "flex items-start text-3xl", children: "\u2198" })
                    ] }),
                    /* @__PURE__ */ u4("option", { value: ProjectSorter.DoneDateAsc, children: [
                      "Done Date",
                      /* @__PURE__ */ u4("span", { class: "flex items-start text-3xl", children: "\u2197" })
                    ] }),
                    /* @__PURE__ */ u4("option", { value: ProjectSorter.DoneDateDesc, children: [
                      "Done Date",
                      /* @__PURE__ */ u4("span", { class: "flex items-start text-3xl", children: "\u2198" })
                    ] }),
                    /* @__PURE__ */ u4("option", { value: ProjectSorter.Priority, children: "Priority" })
                  ]
                }
              )
            ] })
          ]
        }
      )
    ] }),
    shownProjects.value.length > 0 ? /* @__PURE__ */ u4(k, { children: [
      /* @__PURE__ */ u4(
        "div",
        {
          id: "projectsContainer",
          class: `${isViewMore.value ? "h-132.5" : "h-64"} grid snap-y snap-mandatory grid-cols-1 gap-3 overflow-hidden overflow-y-auto transition-all duration-300 ease-in-out md:grid-cols-2 lg:grid-cols-3`,
          children: shownProjects.value.map((project) => /* @__PURE__ */ u4(
            ProjectCard,
            {
              project,
              setSelectedProject,
              isDemo
            },
            project.project_id
          ))
        }
      ),
      shownProjects.value.length > 3 && /* @__PURE__ */ u4("div", { class: "flex flex-row items-center justify-end", children: isViewMore.value ? /* @__PURE__ */ u4(
        "button",
        {
          onClick: () => isViewMore.value = false,
          class: "mt-5 mr-5 w-full cursor-pointer text-base font-medium hover:underline",
          children: "Hide"
        }
      ) : /* @__PURE__ */ u4(
        "button",
        {
          onClick: () => isViewMore.value = true,
          class: "mt-5 w-full cursor-pointer text-base font-medium text-nowrap hover:underline",
          children: "View more"
        }
      ) })
    ] }) : /* @__PURE__ */ u4(k, { children: /* @__PURE__ */ u4("h3", { class: "mb-5 bg-background p-3 text-lg font-extrabold text-white md:my-10 md:text-2xl", children: "You don't have any project yet." }) })
  ] });
}
export {
  ProjectsDisplay
};
