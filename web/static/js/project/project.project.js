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
var nDaysAgoDone = (dateString) => {
  if (!dateString) return "Has no done date";
  const doneDate = new Date(
    formattingDateProject(
      new Date(dateString * 1e3).toLocaleDateString("en-CA")
    )
  );
  const today = new Date(todayUserTimeZone());
  const daysAgo = Math.floor((today - doneDate) / (1e3 * 60 * 60 * 24));
  if (daysAgo > 1) return `${daysAgo} days ago`;
  if (daysAgo == 1) return "Yesterday";
  if (daysAgo == 0) return "Today";
  if (daysAgo == -1) return "Tomorrow";
  return `${-daysAgo} days from now`;
};
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
function w(n2, l2) {
  for (var u3 in l2) n2[u3] = l2[u3];
  return n2;
}
function g(n2) {
  n2 && n2.parentNode && n2.parentNode.removeChild(n2);
}
function m(n2, t2, i2, o2, r2) {
  var e2 = { type: n2, props: t2, key: i2, ref: o2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == r2 ? ++u : r2, __i: -1, __u: 0 };
  return null == r2 && null != l.vnode && l.vnode(e2), e2;
}
function k(n2) {
  return n2.children;
}
function x(n2, l2) {
  this.props = n2, this.context = l2;
}
function S(n2, l2) {
  if (null == l2) return n2.__ ? S(n2.__, n2.__i + 1) : null;
  for (var u3; l2 < n2.__k.length; l2++) if (null != (u3 = n2.__k[l2]) && null != u3.__e) return u3.__e;
  return "function" == typeof n2.type ? S(n2) : null;
}
function C(n2) {
  var l2, u3;
  if (null != (n2 = n2.__) && null != n2.__c) {
    for (n2.__e = n2.__c.base = null, l2 = 0; l2 < n2.__k.length; l2++) if (null != (u3 = n2.__k[l2]) && null != u3.__e) {
      n2.__e = n2.__c.base = u3.__e;
      break;
    }
    return C(n2);
  }
}
function M(n2) {
  (!n2.__d && (n2.__d = true) && i.push(n2) && !$.__r++ || o != l.debounceRendering) && ((o = l.debounceRendering) || r)($);
}
function $() {
  for (var n2, u3, t2, o2, r2, f3, c2, s2 = 1; i.length; ) i.length > s2 && i.sort(e), n2 = i.shift(), s2 = i.length, n2.__d && (t2 = void 0, o2 = void 0, r2 = (o2 = (u3 = n2).__v).__e, f3 = [], c2 = [], u3.__P && ((t2 = w({}, o2)).__v = o2.__v + 1, l.vnode && l.vnode(t2), O(u3.__P, t2, o2, u3.__n, u3.__P.namespaceURI, 32 & o2.__u ? [r2] : null, f3, null == r2 ? S(o2) : r2, !!(32 & o2.__u), c2), t2.__v = o2.__v, t2.__.__k[t2.__i] = t2, N(f3, t2, c2), o2.__e = o2.__ = null, t2.__e != r2 && C(t2)));
  $.__r = 0;
}
function I(n2, l2, u3, t2, i2, o2, r2, e2, f3, c2, s2) {
  var a2, h2, y2, d2, w2, g2, _, m2 = t2 && t2.__k || v, b = l2.length;
  for (f3 = P(u3, l2, m2, f3, b), a2 = 0; a2 < b; a2++) null != (y2 = u3.__k[a2]) && (h2 = -1 == y2.__i ? p : m2[y2.__i] || p, y2.__i = a2, g2 = O(n2, y2, h2, i2, o2, r2, e2, f3, c2, s2), d2 = y2.__e, y2.ref && h2.ref != y2.ref && (h2.ref && B(h2.ref, null, y2), s2.push(y2.ref, y2.__c || d2, y2)), null == w2 && null != d2 && (w2 = d2), (_ = !!(4 & y2.__u)) || h2.__k === y2.__k ? f3 = A(y2, f3, n2, _) : "function" == typeof y2.type && void 0 !== g2 ? f3 = g2 : d2 && (f3 = d2.nextSibling), y2.__u &= -7);
  return u3.__e = w2, f3;
}
function P(n2, l2, u3, t2, i2) {
  var o2, r2, e2, f3, c2, s2 = u3.length, a2 = s2, h2 = 0;
  for (n2.__k = new Array(i2), o2 = 0; o2 < i2; o2++) null != (r2 = l2[o2]) && "boolean" != typeof r2 && "function" != typeof r2 ? ("string" == typeof r2 || "number" == typeof r2 || "bigint" == typeof r2 || r2.constructor == String ? r2 = n2.__k[o2] = m(null, r2, null, null, null) : d(r2) ? r2 = n2.__k[o2] = m(k, { children: r2 }, null, null, null) : void 0 === r2.constructor && r2.__b > 0 ? r2 = n2.__k[o2] = m(r2.type, r2.props, r2.key, r2.ref ? r2.ref : null, r2.__v) : n2.__k[o2] = r2, f3 = o2 + h2, r2.__ = n2, r2.__b = n2.__b + 1, e2 = null, -1 != (c2 = r2.__i = L(r2, u3, f3, a2)) && (a2--, (e2 = u3[c2]) && (e2.__u |= 2)), null == e2 || null == e2.__v ? (-1 == c2 && (i2 > s2 ? h2-- : i2 < s2 && h2++), "function" != typeof r2.type && (r2.__u |= 4)) : c2 != f3 && (c2 == f3 - 1 ? h2-- : c2 == f3 + 1 ? h2++ : (c2 > f3 ? h2-- : h2++, r2.__u |= 4))) : n2.__k[o2] = null;
  if (a2) for (o2 = 0; o2 < s2; o2++) null != (e2 = u3[o2]) && 0 == (2 & e2.__u) && (e2.__e == t2 && (t2 = S(e2)), D(e2, e2));
  return t2;
}
function A(n2, l2, u3, t2) {
  var i2, o2;
  if ("function" == typeof n2.type) {
    for (i2 = n2.__k, o2 = 0; i2 && o2 < i2.length; o2++) i2[o2] && (i2[o2].__ = n2, l2 = A(i2[o2], l2, u3, t2));
    return l2;
  }
  n2.__e != l2 && (t2 && (l2 && n2.type && !l2.parentNode && (l2 = S(n2)), u3.insertBefore(n2.__e, l2 || null)), l2 = n2.__e);
  do {
    l2 = l2 && l2.nextSibling;
  } while (null != l2 && 8 == l2.nodeType);
  return l2;
}
function L(n2, l2, u3, t2) {
  var i2, o2, r2, e2 = n2.key, f3 = n2.type, c2 = l2[u3], s2 = null != c2 && 0 == (2 & c2.__u);
  if (null === c2 && null == e2 || s2 && e2 == c2.key && f3 == c2.type) return u3;
  if (t2 > (s2 ? 1 : 0)) {
    for (i2 = u3 - 1, o2 = u3 + 1; i2 >= 0 || o2 < l2.length; ) if (null != (c2 = l2[r2 = i2 >= 0 ? i2-- : o2++]) && 0 == (2 & c2.__u) && e2 == c2.key && f3 == c2.type) return r2;
  }
  return -1;
}
function T(n2, l2, u3) {
  "-" == l2[0] ? n2.setProperty(l2, null == u3 ? "" : u3) : n2[l2] = null == u3 ? "" : "number" != typeof u3 || y.test(l2) ? u3 : u3 + "px";
}
function j(n2, l2, u3, t2, i2) {
  var o2, r2;
  n: if ("style" == l2) if ("string" == typeof u3) n2.style.cssText = u3;
  else {
    if ("string" == typeof t2 && (n2.style.cssText = t2 = ""), t2) for (l2 in t2) u3 && l2 in u3 || T(n2.style, l2, "");
    if (u3) for (l2 in u3) t2 && u3[l2] == t2[l2] || T(n2.style, l2, u3[l2]);
  }
  else if ("o" == l2[0] && "n" == l2[1]) o2 = l2 != (l2 = l2.replace(f, "$1")), r2 = l2.toLowerCase(), l2 = r2 in n2 || "onFocusOut" == l2 || "onFocusIn" == l2 ? r2.slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + o2] = u3, u3 ? t2 ? u3.u = t2.u : (u3.u = c, n2.addEventListener(l2, o2 ? a : s, o2)) : n2.removeEventListener(l2, o2 ? a : s, o2);
  else {
    if ("http://www.w3.org/2000/svg" == i2) l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l2 && "height" != l2 && "href" != l2 && "list" != l2 && "form" != l2 && "tabIndex" != l2 && "download" != l2 && "rowSpan" != l2 && "colSpan" != l2 && "role" != l2 && "popover" != l2 && l2 in n2) try {
      n2[l2] = null == u3 ? "" : u3;
      break n;
    } catch (n3) {
    }
    "function" == typeof u3 || (null == u3 || false === u3 && "-" != l2[4] ? n2.removeAttribute(l2) : n2.setAttribute(l2, "popover" == l2 && 1 == u3 ? "" : u3));
  }
}
function F(n2) {
  return function(u3) {
    if (this.l) {
      var t2 = this.l[u3.type + n2];
      if (null == u3.t) u3.t = c++;
      else if (u3.t < t2.u) return;
      return t2(l.event ? l.event(u3) : u3);
    }
  };
}
function O(n2, u3, t2, i2, o2, r2, e2, f3, c2, s2) {
  var a2, h2, p2, v2, y2, _, m2, b, S2, C2, M2, $2, P2, A2, H, L2, T2, j2 = u3.type;
  if (void 0 !== u3.constructor) return null;
  128 & t2.__u && (c2 = !!(32 & t2.__u), r2 = [f3 = u3.__e = t2.__e]), (a2 = l.__b) && a2(u3);
  n: if ("function" == typeof j2) try {
    if (b = u3.props, S2 = "prototype" in j2 && j2.prototype.render, C2 = (a2 = j2.contextType) && i2[a2.__c], M2 = a2 ? C2 ? C2.props.value : a2.__ : i2, t2.__c ? m2 = (h2 = u3.__c = t2.__c).__ = h2.__E : (S2 ? u3.__c = h2 = new j2(b, M2) : (u3.__c = h2 = new x(b, M2), h2.constructor = j2, h2.render = E), C2 && C2.sub(h2), h2.state || (h2.state = {}), h2.__n = i2, p2 = h2.__d = true, h2.__h = [], h2._sb = []), S2 && null == h2.__s && (h2.__s = h2.state), S2 && null != j2.getDerivedStateFromProps && (h2.__s == h2.state && (h2.__s = w({}, h2.__s)), w(h2.__s, j2.getDerivedStateFromProps(b, h2.__s))), v2 = h2.props, y2 = h2.state, h2.__v = u3, p2) S2 && null == j2.getDerivedStateFromProps && null != h2.componentWillMount && h2.componentWillMount(), S2 && null != h2.componentDidMount && h2.__h.push(h2.componentDidMount);
    else {
      if (S2 && null == j2.getDerivedStateFromProps && b !== v2 && null != h2.componentWillReceiveProps && h2.componentWillReceiveProps(b, M2), u3.__v == t2.__v || !h2.__e && null != h2.shouldComponentUpdate && false === h2.shouldComponentUpdate(b, h2.__s, M2)) {
        for (u3.__v != t2.__v && (h2.props = b, h2.state = h2.__s, h2.__d = false), u3.__e = t2.__e, u3.__k = t2.__k, u3.__k.some(function(n3) {
          n3 && (n3.__ = u3);
        }), $2 = 0; $2 < h2._sb.length; $2++) h2.__h.push(h2._sb[$2]);
        h2._sb = [], h2.__h.length && e2.push(h2);
        break n;
      }
      null != h2.componentWillUpdate && h2.componentWillUpdate(b, h2.__s, M2), S2 && null != h2.componentDidUpdate && h2.__h.push(function() {
        h2.componentDidUpdate(v2, y2, _);
      });
    }
    if (h2.context = M2, h2.props = b, h2.__P = n2, h2.__e = false, P2 = l.__r, A2 = 0, S2) {
      for (h2.state = h2.__s, h2.__d = false, P2 && P2(u3), a2 = h2.render(h2.props, h2.state, h2.context), H = 0; H < h2._sb.length; H++) h2.__h.push(h2._sb[H]);
      h2._sb = [];
    } else do {
      h2.__d = false, P2 && P2(u3), a2 = h2.render(h2.props, h2.state, h2.context), h2.state = h2.__s;
    } while (h2.__d && ++A2 < 25);
    h2.state = h2.__s, null != h2.getChildContext && (i2 = w(w({}, i2), h2.getChildContext())), S2 && !p2 && null != h2.getSnapshotBeforeUpdate && (_ = h2.getSnapshotBeforeUpdate(v2, y2)), L2 = a2, null != a2 && a2.type === k && null == a2.key && (L2 = V(a2.props.children)), f3 = I(n2, d(L2) ? L2 : [L2], u3, t2, i2, o2, r2, e2, f3, c2, s2), h2.base = u3.__e, u3.__u &= -161, h2.__h.length && e2.push(h2), m2 && (h2.__E = h2.__ = null);
  } catch (n3) {
    if (u3.__v = null, c2 || null != r2) if (n3.then) {
      for (u3.__u |= c2 ? 160 : 128; f3 && 8 == f3.nodeType && f3.nextSibling; ) f3 = f3.nextSibling;
      r2[r2.indexOf(f3)] = null, u3.__e = f3;
    } else {
      for (T2 = r2.length; T2--; ) g(r2[T2]);
      z(u3);
    }
    else u3.__e = t2.__e, u3.__k = t2.__k, n3.then || z(u3);
    l.__e(n3, u3, t2);
  }
  else null == r2 && u3.__v == t2.__v ? (u3.__k = t2.__k, u3.__e = t2.__e) : f3 = u3.__e = q(t2.__e, u3, t2, i2, o2, r2, e2, c2, s2);
  return (a2 = l.diffed) && a2(u3), 128 & u3.__u ? void 0 : f3;
}
function z(n2) {
  n2 && n2.__c && (n2.__c.__e = true), n2 && n2.__k && n2.__k.forEach(z);
}
function N(n2, u3, t2) {
  for (var i2 = 0; i2 < t2.length; i2++) B(t2[i2], t2[++i2], t2[++i2]);
  l.__c && l.__c(u3, n2), n2.some(function(u4) {
    try {
      n2 = u4.__h, u4.__h = [], n2.some(function(n3) {
        n3.call(u4);
      });
    } catch (n3) {
      l.__e(n3, u4.__v);
    }
  });
}
function V(n2) {
  return "object" != typeof n2 || null == n2 || n2.__b && n2.__b > 0 ? n2 : d(n2) ? n2.map(V) : w({}, n2);
}
function q(u3, t2, i2, o2, r2, e2, f3, c2, s2) {
  var a2, h2, v2, y2, w2, _, m2, b = i2.props || p, k2 = t2.props, x2 = t2.type;
  if ("svg" == x2 ? r2 = "http://www.w3.org/2000/svg" : "math" == x2 ? r2 = "http://www.w3.org/1998/Math/MathML" : r2 || (r2 = "http://www.w3.org/1999/xhtml"), null != e2) {
    for (a2 = 0; a2 < e2.length; a2++) if ((w2 = e2[a2]) && "setAttribute" in w2 == !!x2 && (x2 ? w2.localName == x2 : 3 == w2.nodeType)) {
      u3 = w2, e2[a2] = null;
      break;
    }
  }
  if (null == u3) {
    if (null == x2) return document.createTextNode(k2);
    u3 = document.createElementNS(r2, x2, k2.is && k2), c2 && (l.__m && l.__m(t2, e2), c2 = false), e2 = null;
  }
  if (null == x2) b === k2 || c2 && u3.data == k2 || (u3.data = k2);
  else {
    if (e2 = e2 && n.call(u3.childNodes), !c2 && null != e2) for (b = {}, a2 = 0; a2 < u3.attributes.length; a2++) b[(w2 = u3.attributes[a2]).name] = w2.value;
    for (a2 in b) if (w2 = b[a2], "children" == a2) ;
    else if ("dangerouslySetInnerHTML" == a2) v2 = w2;
    else if (!(a2 in k2)) {
      if ("value" == a2 && "defaultValue" in k2 || "checked" == a2 && "defaultChecked" in k2) continue;
      j(u3, a2, null, w2, r2);
    }
    for (a2 in k2) w2 = k2[a2], "children" == a2 ? y2 = w2 : "dangerouslySetInnerHTML" == a2 ? h2 = w2 : "value" == a2 ? _ = w2 : "checked" == a2 ? m2 = w2 : c2 && "function" != typeof w2 || b[a2] === w2 || j(u3, a2, w2, b[a2], r2);
    if (h2) c2 || v2 && (h2.__html == v2.__html || h2.__html == u3.innerHTML) || (u3.innerHTML = h2.__html), t2.__k = [];
    else if (v2 && (u3.innerHTML = ""), I("template" == t2.type ? u3.content : u3, d(y2) ? y2 : [y2], t2, i2, o2, "foreignObject" == x2 ? "http://www.w3.org/1999/xhtml" : r2, e2, f3, e2 ? e2[0] : i2.__k && S(i2, 0), c2, s2), null != e2) for (a2 = e2.length; a2--; ) g(e2[a2]);
    c2 || (a2 = "value", "progress" == x2 && null == _ ? u3.removeAttribute("value") : null != _ && (_ !== u3[a2] || "progress" == x2 && !_ || "option" == x2 && _ != b[a2]) && j(u3, a2, _, b[a2], r2), a2 = "checked", null != m2 && m2 != u3[a2] && j(u3, a2, m2, b[a2], r2));
  }
  return u3;
}
function B(n2, u3, t2) {
  try {
    if ("function" == typeof n2) {
      var i2 = "function" == typeof n2.__u;
      i2 && n2.__u(), i2 && null == u3 || (n2.__u = n2(u3));
    } else n2.current = u3;
  } catch (n3) {
    l.__e(n3, t2);
  }
}
function D(n2, u3, t2) {
  var i2, o2;
  if (l.unmount && l.unmount(n2), (i2 = n2.ref) && (i2.current && i2.current != n2.__e || B(i2, null, u3)), null != (i2 = n2.__c)) {
    if (i2.componentWillUnmount) try {
      i2.componentWillUnmount();
    } catch (n3) {
      l.__e(n3, u3);
    }
    i2.base = i2.__P = null;
  }
  if (i2 = n2.__k) for (o2 = 0; o2 < i2.length; o2++) i2[o2] && D(i2[o2], u3, t2 || "function" != typeof n2.type);
  t2 || g(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
}
function E(n2, l2, u3) {
  return this.constructor(n2, u3);
}
n = v.slice, l = { __e: function(n2, l2, u3, t2) {
  for (var i2, o2, r2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((o2 = i2.constructor) && null != o2.getDerivedStateFromError && (i2.setState(o2.getDerivedStateFromError(n2)), r2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), r2 = i2.__d), r2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, u = 0, t = function(n2) {
  return null != n2 && void 0 === n2.constructor;
}, x.prototype.setState = function(n2, l2) {
  var u3;
  u3 = null != this.__s && this.__s != this.state ? this.__s : this.__s = w({}, this.state), "function" == typeof n2 && (n2 = n2(w({}, u3), this.props)), n2 && w(u3, n2), null != n2 && this.__v && (l2 && this._sb.push(l2), M(this));
}, x.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), M(this));
}, x.prototype.render = k, i = [], r = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n2, l2) {
  return n2.__v.__b - l2.__v.__b;
}, $.__r = 0, f = /(PointerCapture)$|Capture$/i, c = 0, s = F(false), a = F(true), h = 0;

// node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
var f2 = 0;
function u2(e2, t2, n2, o2, i2, u3) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f2, __i: -1, __u: 0, __source: i2, __self: u3 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l.vnode && l.vnode(l2), l2;
}

// web/src/project/project.project.tsx
function ProjectDisplay({ project }) {
  return /* @__PURE__ */ u2("div", { class: "h-fit mx-auto flex w-full flex-col rounded-lg border-l-4 border-background bg-white p-4 shadow hover:bg-pink-50 md:w-3xl md:p-6", children: [
    /* @__PURE__ */ u2("div", { class: "mb-2 flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ u2(
        "h2",
        {
          id: "tasksFilterTime",
          class: "h-fit max-w-[70%] overflow-hidden text-ellipsis text-nowrap text-left text-xl font-extrabold text-background md:max-w-none md:py-3 md:text-2xl",
          children: project.value.project_title
        }
      ),
      project.value.priority && /* @__PURE__ */ u2("span", { class: "my-auto inline-flex max-h-6 w-fit shrink-0 items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 md:p-2 md:text-sm", children: "Priority" })
    ] }),
    /* @__PURE__ */ u2("div", { class: "mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3", children: [
      /* @__PURE__ */ u2("div", { class: "flex flex-col items-center justify-between border border-background p-2", children: [
        /* @__PURE__ */ u2("p", { class: "flex flex-row text-center text-sm text-gray-800 md:text-base", children: [
          "Start: ",
          formattingDateProject(project.value.start_date)
        ] }),
        /* @__PURE__ */ u2("p", { class: "mt-1 flex flex-row items-center text-xs text-hover sm:mt-0 md:text-sm", children: [
          /* @__PURE__ */ u2(
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
      /* @__PURE__ */ u2("div", { class: "flex flex-col items-center justify-between border border-background p-2", children: [
        /* @__PURE__ */ u2("p", { class: "flex flex-row text-center text-sm text-gray-800 md:text-base", children: [
          "Due:\xA0",
          formattingDateProject(project.value.due_date)
        ] }),
        /* @__PURE__ */ u2("p", { class: "mt-1 flex flex-row items-center text-xs text-hover sm:mt-0 md:text-sm", children: [
          /* @__PURE__ */ u2(
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
      project.value.done_date > 0 && /* @__PURE__ */ u2("div", { class: "flex flex-col items-center justify-between border border-background p-2", children: [
        /* @__PURE__ */ u2("p", { class: "bg-white text-center text-sm font-extrabold text-gray-800 no-underline opacity-100 md:text-base", children: [
          "DONE :",
          " ",
          formattingDateProject(
            new Date(project.value.done_date * 1e3).toLocaleDateString(
              "en-CA"
            )
          )
        ] }),
        /* @__PURE__ */ u2("p", { class: "mt-1 flex flex-row items-center text-xs text-hover sm:mt-0 md:text-sm", children: [
          /* @__PURE__ */ u2(
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
    /* @__PURE__ */ u2("p", { class: "my-2.5 h-fit max-h-32.5 overflow-y-auto text-base text-[#28536a] md:text-lg", children: project.value.project_desc }),
    /* @__PURE__ */ u2("div", { class: "mt-2.5 flex items-center", children: [
      /* @__PURE__ */ u2("div", { class: "mr-2 h-2 w-full bg-slate-200", children: /* @__PURE__ */ u2(
        "div",
        {
          class: "h-full bg-linear-to-r from-blue-400 to-blue-700",
          style: {
            width: `calc(100% * ${project.value.to_dos_done} / ${project.value.to_dos_all})`
          }
        }
      ) }),
      /* @__PURE__ */ u2("span", { class: "ml-2 whitespace-nowrap text-xs font-medium text-gray-700 md:text-sm", children: [
        project.value.to_dos_done,
        "/",
        project.value.to_dos_all
      ] })
    ] })
  ] });
}
export {
  ProjectDisplay
};
