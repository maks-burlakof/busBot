(function() {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload"))
        return;
    for (const r of document.querySelectorAll('link[rel="modulepreload"]'))
        o(r);
    new MutationObserver(r=>{
        for (const s of r)
            if (s.type === "childList")
                for (const i of s.addedNodes)
                    i.tagName === "LINK" && i.rel === "modulepreload" && o(i)
    }
    ).observe(document, {
        childList: !0,
        subtree: !0
    });
    function n(r) {
        const s = {};
        return r.integrity && (s.integrity = r.integrity),
        r.referrerPolicy && (s.referrerPolicy = r.referrerPolicy),
        r.crossOrigin === "use-credentials" ? s.credentials = "include" : r.crossOrigin === "anonymous" ? s.credentials = "omit" : s.credentials = "same-origin",
        s
    }
    function o(r) {
        if (r.ep)
            return;
        r.ep = !0;
        const s = n(r);
        fetch(r.href, s)
    }
}
)();
const yl = "modulepreload"
  , wl = function(e) {
    return "/telegram-onboarding-kit/" + e
}
  , Hr = {}
  , _e = function(t, n, o) {
    if (!n || n.length === 0)
        return t();
    const r = document.getElementsByTagName("link");
    return Promise.all(n.map(s=>{
        if (s = wl(s),
        s in Hr)
            return;
        Hr[s] = !0;
        const i = s.endsWith(".css")
          , l = i ? '[rel="stylesheet"]' : "";
        if (!!o)
            for (let u = r.length - 1; u >= 0; u--) {
                const f = r[u];
                if (f.href === s && (!i || f.rel === "stylesheet"))
                    return
            }
        else if (document.querySelector(`link[href="${s}"]${l}`))
            return;
        const a = document.createElement("link");
        if (a.rel = i ? "stylesheet" : yl,
        i || (a.as = "script",
        a.crossOrigin = ""),
        a.href = s,
        document.head.appendChild(a),
        i)
            return new Promise((u,f)=>{
                a.addEventListener("load", u),
                a.addEventListener("error", ()=>f(new Error(`Unable to preload CSS for ${s}`)))
            }
            )
    }
    )).then(()=>t()).catch(s=>{
        const i = new Event("vite:preloadError",{
            cancelable: !0
        });
        if (i.payload = s,
        window.dispatchEvent(i),
        !i.defaultPrevented)
            throw s
    }
    )
};
const El = {
    slides: ()=>[]
};
function cr(e, t) {
    const n = Object.create(null)
      , o = e.split(",");
    for (let r = 0; r < o.length; r++)
        n[o[r]] = !0;
    return t ? r=>!!n[r.toLowerCase()] : r=>!!n[r]
}
const Ae = {}
  , tn = []
  , ft = ()=>{}
  , Cl = ()=>!1
  , Al = /^on[^a-z]/
  , uo = e=>Al.test(e)
  , ar = e=>e.startsWith("onUpdate:")
  , Me = Object.assign
  , ur = (e,t)=>{
    const n = e.indexOf(t);
    n > -1 && e.splice(n, 1)
}
  , Pl = Object.prototype.hasOwnProperty
  , ae = (e,t)=>Pl.call(e, t)
  , X = Array.isArray
  , nn = e=>fo(e) === "[object Map]"
  , qs = e=>fo(e) === "[object Set]"
  , ne = e=>typeof e == "function"
  , Ie = e=>typeof e == "string"
  , fr = e=>typeof e == "symbol"
  , Te = e=>e !== null && typeof e == "object"
  , Us = e=>Te(e) && ne(e.then) && ne(e.catch)
  , Vs = Object.prototype.toString
  , fo = e=>Vs.call(e)
  , Tl = e=>fo(e).slice(8, -1)
  , zs = e=>fo(e) === "[object Object]"
  , pr = e=>Ie(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e
  , Jn = cr(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted")
  , po = e=>{
    const t = Object.create(null);
    return n=>t[n] || (t[n] = e(n))
}
  , xl = /-(\w)/g
  , vt = po(e=>e.replace(xl, (t,n)=>n ? n.toUpperCase() : ""))
  , kl = /\B([A-Z])/g
  , pn = po(e=>e.replace(kl, "-$1").toLowerCase())
  , ho = po(e=>e.charAt(0).toUpperCase() + e.slice(1))
  , xo = po(e=>e ? `on${ho(e)}` : "")
  , Rn = (e,t)=>!Object.is(e, t)
  , ko = (e,t)=>{
    for (let n = 0; n < e.length; n++)
        e[n](t)
}
  , to = (e,t,n)=>{
    Object.defineProperty(e, t, {
        configurable: !0,
        enumerable: !1,
        value: n
    })
}
  , Sl = e=>{
    const t = parseFloat(e);
    return isNaN(t) ? e : t
}
  , Ol = e=>{
    const t = Ie(e) ? Number(e) : NaN;
    return isNaN(t) ? e : t
}
;
let jr;
const Do = ()=>jr || (jr = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Wt(e) {
    if (X(e)) {
        const t = {};
        for (let n = 0; n < e.length; n++) {
            const o = e[n]
              , r = Ie(o) ? $l(o) : Wt(o);
            if (r)
                for (const s in r)
                    t[s] = r[s]
        }
        return t
    } else {
        if (Ie(e))
            return e;
        if (Te(e))
            return e
    }
}
const Rl = /;(?![^(]*\))/g
  , Il = /:([^]+)/
  , Ll = /\/\*[^]*?\*\//g;
function $l(e) {
    const t = {};
    return e.replace(Ll, "").split(Rl).forEach(n=>{
        if (n) {
            const o = n.split(Il);
            o.length > 1 && (t[o[0].trim()] = o[1].trim())
        }
    }
    ),
    t
}
function Pe(e) {
    let t = "";
    if (Ie(e))
        t = e;
    else if (X(e))
        for (let n = 0; n < e.length; n++) {
            const o = Pe(e[n]);
            o && (t += o + " ")
        }
    else if (Te(e))
        for (const n in e)
            e[n] && (t += n + " ");
    return t.trim()
}
function _n(e) {
    if (!e)
        return null;
    let {class: t, style: n} = e;
    return t && !Ie(t) && (e.class = Pe(t)),
    n && (e.style = Wt(n)),
    e
}
const Ml = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly"
  , Wl = cr(Ml);
function Ks(e) {
    return !!e || e === ""
}
const dr = e=>Ie(e) ? e : e == null ? "" : X(e) || Te(e) && (e.toString === Vs || !ne(e.toString)) ? JSON.stringify(e, Qs, 2) : String(e)
  , Qs = (e,t)=>t && t.__v_isRef ? Qs(e, t.value) : nn(t) ? {
    [`Map(${t.size})`]: [...t.entries()].reduce((n,[o,r])=>(n[`${o} =>`] = r,
    n), {})
} : qs(t) ? {
    [`Set(${t.size})`]: [...t.values()]
} : Te(t) && !X(t) && !zs(t) ? String(t) : t;
let ct;
class Bl {
    constructor(t=!1) {
        this.detached = t,
        this._active = !0,
        this.effects = [],
        this.cleanups = [],
        this.parent = ct,
        !t && ct && (this.index = (ct.scopes || (ct.scopes = [])).push(this) - 1)
    }
    get active() {
        return this._active
    }
    run(t) {
        if (this._active) {
            const n = ct;
            try {
                return ct = this,
                t()
            } finally {
                ct = n
            }
        }
    }
    on() {
        ct = this
    }
    off() {
        ct = this.parent
    }
    stop(t) {
        if (this._active) {
            let n, o;
            for (n = 0,
            o = this.effects.length; n < o; n++)
                this.effects[n].stop();
            for (n = 0,
            o = this.cleanups.length; n < o; n++)
                this.cleanups[n]();
            if (this.scopes)
                for (n = 0,
                o = this.scopes.length; n < o; n++)
                    this.scopes[n].stop(!0);
            if (!this.detached && this.parent && !t) {
                const r = this.parent.scopes.pop();
                r && r !== this && (this.parent.scopes[this.index] = r,
                r.index = this.index)
            }
            this.parent = void 0,
            this._active = !1
        }
    }
}
function Nl(e, t=ct) {
    t && t.active && t.effects.push(e)
}
function Fl() {
    return ct
}
const hr = e=>{
    const t = new Set(e);
    return t.w = 0,
    t.n = 0,
    t
}
  , Ys = e=>(e.w & Bt) > 0
  , Xs = e=>(e.n & Bt) > 0
  , Dl = ({deps: e})=>{
    if (e.length)
        for (let t = 0; t < e.length; t++)
            e[t].w |= Bt
}
  , Hl = e=>{
    const {deps: t} = e;
    if (t.length) {
        let n = 0;
        for (let o = 0; o < t.length; o++) {
            const r = t[o];
            Ys(r) && !Xs(r) ? r.delete(e) : t[n++] = r,
            r.w &= ~Bt,
            r.n &= ~Bt
        }
        t.length = n
    }
}
  , no = new WeakMap;
let wn = 0
  , Bt = 1;
const Ho = 30;
let at;
const Yt = Symbol("")
  , jo = Symbol("");
class mr {
    constructor(t, n=null, o) {
        this.fn = t,
        this.scheduler = n,
        this.active = !0,
        this.deps = [],
        this.parent = void 0,
        Nl(this, o)
    }
    run() {
        if (!this.active)
            return this.fn();
        let t = at
          , n = $t;
        for (; t; ) {
            if (t === this)
                return;
            t = t.parent
        }
        try {
            return this.parent = at,
            at = this,
            $t = !0,
            Bt = 1 << ++wn,
            wn <= Ho ? Dl(this) : qr(this),
            this.fn()
        } finally {
            wn <= Ho && Hl(this),
            Bt = 1 << --wn,
            at = this.parent,
            $t = n,
            this.parent = void 0,
            this.deferStop && this.stop()
        }
    }
    stop() {
        at === this ? this.deferStop = !0 : this.active && (qr(this),
        this.onStop && this.onStop(),
        this.active = !1)
    }
}
function qr(e) {
    const {deps: t} = e;
    if (t.length) {
        for (let n = 0; n < t.length; n++)
            t[n].delete(e);
        t.length = 0
    }
}
let $t = !0;
const Js = [];
function dn() {
    Js.push($t),
    $t = !1
}
function hn() {
    const e = Js.pop();
    $t = e === void 0 ? !0 : e
}
function Ge(e, t, n) {
    if ($t && at) {
        let o = no.get(e);
        o || no.set(e, o = new Map);
        let r = o.get(n);
        r || o.set(n, r = hr()),
        Gs(r)
    }
}
function Gs(e, t) {
    let n = !1;
    wn <= Ho ? Xs(e) || (e.n |= Bt,
    n = !Ys(e)) : n = !e.has(at),
    n && (e.add(at),
    at.deps.push(e))
}
function Ct(e, t, n, o, r, s) {
    const i = no.get(e);
    if (!i)
        return;
    let l = [];
    if (t === "clear")
        l = [...i.values()];
    else if (n === "length" && X(e)) {
        const c = Number(o);
        i.forEach((a,u)=>{
            (u === "length" || u >= c) && l.push(a)
        }
        )
    } else
        switch (n !== void 0 && l.push(i.get(n)),
        t) {
        case "add":
            X(e) ? pr(n) && l.push(i.get("length")) : (l.push(i.get(Yt)),
            nn(e) && l.push(i.get(jo)));
            break;
        case "delete":
            X(e) || (l.push(i.get(Yt)),
            nn(e) && l.push(i.get(jo)));
            break;
        case "set":
            nn(e) && l.push(i.get(Yt));
            break
        }
    if (l.length === 1)
        l[0] && qo(l[0]);
    else {
        const c = [];
        for (const a of l)
            a && c.push(...a);
        qo(hr(c))
    }
}
function qo(e, t) {
    const n = X(e) ? e : [...e];
    for (const o of n)
        o.computed && Ur(o);
    for (const o of n)
        o.computed || Ur(o)
}
function Ur(e, t) {
    (e !== at || e.allowRecurse) && (e.scheduler ? e.scheduler() : e.run())
}
function jl(e, t) {
    var n;
    return (n = no.get(e)) == null ? void 0 : n.get(t)
}
const ql = cr("__proto__,__v_isRef,__isVue")
  , Zs = new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e !== "arguments" && e !== "caller").map(e=>Symbol[e]).filter(fr))
  , Ul = gr()
  , Vl = gr(!1, !0)
  , zl = gr(!0)
  , Vr = Kl();
function Kl() {
    const e = {};
    return ["includes", "indexOf", "lastIndexOf"].forEach(t=>{
        e[t] = function(...n) {
            const o = ce(this);
            for (let s = 0, i = this.length; s < i; s++)
                Ge(o, "get", s + "");
            const r = o[t](...n);
            return r === -1 || r === !1 ? o[t](...n.map(ce)) : r
        }
    }
    ),
    ["push", "pop", "shift", "unshift", "splice"].forEach(t=>{
        e[t] = function(...n) {
            dn();
            const o = ce(this)[t].apply(this, n);
            return hn(),
            o
        }
    }
    ),
    e
}
function Ql(e) {
    const t = ce(this);
    return Ge(t, "has", e),
    t.hasOwnProperty(e)
}
function gr(e=!1, t=!1) {
    return function(o, r, s) {
        if (r === "__v_isReactive")
            return !e;
        if (r === "__v_isReadonly")
            return e;
        if (r === "__v_isShallow")
            return t;
        if (r === "__v_raw" && s === (e ? t ? uc : ri : t ? oi : ni).get(o))
            return o;
        const i = X(o);
        if (!e) {
            if (i && ae(Vr, r))
                return Reflect.get(Vr, r, s);
            if (r === "hasOwnProperty")
                return Ql
        }
        const l = Reflect.get(o, r, s);
        return (fr(r) ? Zs.has(r) : ql(r)) || (e || Ge(o, "get", r),
        t) ? l : je(l) ? i && pr(r) ? l : l.value : Te(l) ? e ? br(l) : go(l) : l
    }
}
const Yl = ei()
  , Xl = ei(!0);
function ei(e=!1) {
    return function(n, o, r, s) {
        let i = n[o];
        if (ln(i) && je(i) && !je(r))
            return !1;
        if (!e && (!oo(r) && !ln(r) && (i = ce(i),
        r = ce(r)),
        !X(n) && je(i) && !je(r)))
            return i.value = r,
            !0;
        const l = X(n) && pr(o) ? Number(o) < n.length : ae(n, o)
          , c = Reflect.set(n, o, r, s);
        return n === ce(s) && (l ? Rn(r, i) && Ct(n, "set", o, r) : Ct(n, "add", o, r)),
        c
    }
}
function Jl(e, t) {
    const n = ae(e, t);
    e[t];
    const o = Reflect.deleteProperty(e, t);
    return o && n && Ct(e, "delete", t, void 0),
    o
}
function Gl(e, t) {
    const n = Reflect.has(e, t);
    return (!fr(t) || !Zs.has(t)) && Ge(e, "has", t),
    n
}
function Zl(e) {
    return Ge(e, "iterate", X(e) ? "length" : Yt),
    Reflect.ownKeys(e)
}
const ti = {
    get: Ul,
    set: Yl,
    deleteProperty: Jl,
    has: Gl,
    ownKeys: Zl
}
  , ec = {
    get: zl,
    set(e, t) {
        return !0
    },
    deleteProperty(e, t) {
        return !0
    }
}
  , tc = Me({}, ti, {
    get: Vl,
    set: Xl
})
  , vr = e=>e
  , mo = e=>Reflect.getPrototypeOf(e);
function qn(e, t, n=!1, o=!1) {
    e = e.__v_raw;
    const r = ce(e)
      , s = ce(t);
    n || (t !== s && Ge(r, "get", t),
    Ge(r, "get", s));
    const {has: i} = mo(r)
      , l = o ? vr : n ? wr : In;
    if (i.call(r, t))
        return l(e.get(t));
    if (i.call(r, s))
        return l(e.get(s));
    e !== r && e.get(t)
}
function Un(e, t=!1) {
    const n = this.__v_raw
      , o = ce(n)
      , r = ce(e);
    return t || (e !== r && Ge(o, "has", e),
    Ge(o, "has", r)),
    e === r ? n.has(e) : n.has(e) || n.has(r)
}
function Vn(e, t=!1) {
    return e = e.__v_raw,
    !t && Ge(ce(e), "iterate", Yt),
    Reflect.get(e, "size", e)
}
function zr(e) {
    e = ce(e);
    const t = ce(this);
    return mo(t).has.call(t, e) || (t.add(e),
    Ct(t, "add", e, e)),
    this
}
function Kr(e, t) {
    t = ce(t);
    const n = ce(this)
      , {has: o, get: r} = mo(n);
    let s = o.call(n, e);
    s || (e = ce(e),
    s = o.call(n, e));
    const i = r.call(n, e);
    return n.set(e, t),
    s ? Rn(t, i) && Ct(n, "set", e, t) : Ct(n, "add", e, t),
    this
}
function Qr(e) {
    const t = ce(this)
      , {has: n, get: o} = mo(t);
    let r = n.call(t, e);
    r || (e = ce(e),
    r = n.call(t, e)),
    o && o.call(t, e);
    const s = t.delete(e);
    return r && Ct(t, "delete", e, void 0),
    s
}
function Yr() {
    const e = ce(this)
      , t = e.size !== 0
      , n = e.clear();
    return t && Ct(e, "clear", void 0, void 0),
    n
}
function zn(e, t) {
    return function(o, r) {
        const s = this
          , i = s.__v_raw
          , l = ce(i)
          , c = t ? vr : e ? wr : In;
        return !e && Ge(l, "iterate", Yt),
        i.forEach((a,u)=>o.call(r, c(a), c(u), s))
    }
}
function Kn(e, t, n) {
    return function(...o) {
        const r = this.__v_raw
          , s = ce(r)
          , i = nn(s)
          , l = e === "entries" || e === Symbol.iterator && i
          , c = e === "keys" && i
          , a = r[e](...o)
          , u = n ? vr : t ? wr : In;
        return !t && Ge(s, "iterate", c ? jo : Yt),
        {
            next() {
                const {value: f, done: p} = a.next();
                return p ? {
                    value: f,
                    done: p
                } : {
                    value: l ? [u(f[0]), u(f[1])] : u(f),
                    done: p
                }
            },
            [Symbol.iterator]() {
                return this
            }
        }
    }
}
function xt(e) {
    return function(...t) {
        return e === "delete" ? !1 : this
    }
}
function nc() {
    const e = {
        get(s) {
            return qn(this, s)
        },
        get size() {
            return Vn(this)
        },
        has: Un,
        add: zr,
        set: Kr,
        delete: Qr,
        clear: Yr,
        forEach: zn(!1, !1)
    }
      , t = {
        get(s) {
            return qn(this, s, !1, !0)
        },
        get size() {
            return Vn(this)
        },
        has: Un,
        add: zr,
        set: Kr,
        delete: Qr,
        clear: Yr,
        forEach: zn(!1, !0)
    }
      , n = {
        get(s) {
            return qn(this, s, !0)
        },
        get size() {
            return Vn(this, !0)
        },
        has(s) {
            return Un.call(this, s, !0)
        },
        add: xt("add"),
        set: xt("set"),
        delete: xt("delete"),
        clear: xt("clear"),
        forEach: zn(!0, !1)
    }
      , o = {
        get(s) {
            return qn(this, s, !0, !0)
        },
        get size() {
            return Vn(this, !0)
        },
        has(s) {
            return Un.call(this, s, !0)
        },
        add: xt("add"),
        set: xt("set"),
        delete: xt("delete"),
        clear: xt("clear"),
        forEach: zn(!0, !0)
    };
    return ["keys", "values", "entries", Symbol.iterator].forEach(s=>{
        e[s] = Kn(s, !1, !1),
        n[s] = Kn(s, !0, !1),
        t[s] = Kn(s, !1, !0),
        o[s] = Kn(s, !0, !0)
    }
    ),
    [e, n, t, o]
}
const [oc,rc,sc,ic] = nc();
function _r(e, t) {
    const n = t ? e ? ic : sc : e ? rc : oc;
    return (o,r,s)=>r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? o : Reflect.get(ae(n, r) && r in o ? n : o, r, s)
}
const lc = {
    get: _r(!1, !1)
}
  , cc = {
    get: _r(!1, !0)
}
  , ac = {
    get: _r(!0, !1)
}
  , ni = new WeakMap
  , oi = new WeakMap
  , ri = new WeakMap
  , uc = new WeakMap;
function fc(e) {
    switch (e) {
    case "Object":
    case "Array":
        return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
        return 2;
    default:
        return 0
    }
}
function pc(e) {
    return e.__v_skip || !Object.isExtensible(e) ? 0 : fc(Tl(e))
}
function go(e) {
    return ln(e) ? e : yr(e, !1, ti, lc, ni)
}
function si(e) {
    return yr(e, !1, tc, cc, oi)
}
function br(e) {
    return yr(e, !0, ec, ac, ri)
}
function yr(e, t, n, o, r) {
    if (!Te(e) || e.__v_raw && !(t && e.__v_isReactive))
        return e;
    const s = r.get(e);
    if (s)
        return s;
    const i = pc(e);
    if (i === 0)
        return e;
    const l = new Proxy(e,i === 2 ? o : n);
    return r.set(e, l),
    l
}
function on(e) {
    return ln(e) ? on(e.__v_raw) : !!(e && e.__v_isReactive)
}
function ln(e) {
    return !!(e && e.__v_isReadonly)
}
function oo(e) {
    return !!(e && e.__v_isShallow)
}
function ii(e) {
    return on(e) || ln(e)
}
function ce(e) {
    const t = e && e.__v_raw;
    return t ? ce(t) : e
}
function li(e) {
    return to(e, "__v_skip", !0),
    e
}
const In = e=>Te(e) ? go(e) : e
  , wr = e=>Te(e) ? br(e) : e;
function ci(e) {
    $t && at && (e = ce(e),
    Gs(e.dep || (e.dep = hr())))
}
function ai(e, t) {
    e = ce(e);
    const n = e.dep;
    n && qo(n)
}
function je(e) {
    return !!(e && e.__v_isRef === !0)
}
function we(e) {
    return ui(e, !1)
}
function dc(e) {
    return ui(e, !0)
}
function ui(e, t) {
    return je(e) ? e : new hc(e,t)
}
class hc {
    constructor(t, n) {
        this.__v_isShallow = n,
        this.dep = void 0,
        this.__v_isRef = !0,
        this._rawValue = n ? t : ce(t),
        this._value = n ? t : In(t)
    }
    get value() {
        return ci(this),
        this._value
    }
    set value(t) {
        const n = this.__v_isShallow || oo(t) || ln(t);
        t = n ? t : ce(t),
        Rn(t, this._rawValue) && (this._rawValue = t,
        this._value = n ? t : In(t),
        ai(this))
    }
}
function K(e) {
    return je(e) ? e.value : e
}
const mc = {
    get: (e,t,n)=>K(Reflect.get(e, t, n)),
    set: (e,t,n,o)=>{
        const r = e[t];
        return je(r) && !je(n) ? (r.value = n,
        !0) : Reflect.set(e, t, n, o)
    }
};
function fi(e) {
    return on(e) ? e : new Proxy(e,mc)
}
function Ke(e) {
    const t = X(e) ? new Array(e.length) : {};
    for (const n in e)
        t[n] = vc(e, n);
    return t
}
class gc {
    constructor(t, n, o) {
        this._object = t,
        this._key = n,
        this._defaultValue = o,
        this.__v_isRef = !0
    }
    get value() {
        const t = this._object[this._key];
        return t === void 0 ? this._defaultValue : t
    }
    set value(t) {
        this._object[this._key] = t
    }
    get dep() {
        return jl(ce(this._object), this._key)
    }
}
function vc(e, t, n) {
    const o = e[t];
    return je(o) ? o : new gc(e,t,n)
}
class _c {
    constructor(t, n, o, r) {
        this._setter = n,
        this.dep = void 0,
        this.__v_isRef = !0,
        this.__v_isReadonly = !1,
        this._dirty = !0,
        this.effect = new mr(t,()=>{
            this._dirty || (this._dirty = !0,
            ai(this))
        }
        ),
        this.effect.computed = this,
        this.effect.active = this._cacheable = !r,
        this.__v_isReadonly = o
    }
    get value() {
        const t = ce(this);
        return ci(t),
        (t._dirty || !t._cacheable) && (t._dirty = !1,
        t._value = t.effect.run()),
        t._value
    }
    set value(t) {
        this._setter(t)
    }
}
function bc(e, t, n=!1) {
    let o, r;
    const s = ne(e);
    return s ? (o = e,
    r = ft) : (o = e.get,
    r = e.set),
    new _c(o,r,s || !r,n)
}
function Mt(e, t, n, o) {
    let r;
    try {
        r = o ? e(...o) : e()
    } catch (s) {
        Fn(s, t, n)
    }
    return r
}
function rt(e, t, n, o) {
    if (ne(e)) {
        const s = Mt(e, t, n, o);
        return s && Us(s) && s.catch(i=>{
            Fn(i, t, n)
        }
        ),
        s
    }
    const r = [];
    for (let s = 0; s < e.length; s++)
        r.push(rt(e[s], t, n, o));
    return r
}
function Fn(e, t, n, o=!0) {
    const r = t ? t.vnode : null;
    if (t) {
        let s = t.parent;
        const i = t.proxy
          , l = n;
        for (; s; ) {
            const a = s.ec;
            if (a) {
                for (let u = 0; u < a.length; u++)
                    if (a[u](e, i, l) === !1)
                        return
            }
            s = s.parent
        }
        const c = t.appContext.config.errorHandler;
        if (c) {
            Mt(c, null, 10, [e, i, l]);
            return
        }
    }
    yc(e, n, r, o)
}
function yc(e, t, n, o=!0) {
    console.error(e)
}
let Ln = !1
  , Uo = !1;
const ze = [];
let gt = 0;
const rn = [];
let Et = null
  , Ut = 0;
const pi = Promise.resolve();
let Er = null;
function di(e) {
    const t = Er || pi;
    return e ? t.then(this ? e.bind(this) : e) : t
}
function wc(e) {
    let t = gt + 1
      , n = ze.length;
    for (; t < n; ) {
        const o = t + n >>> 1;
        $n(ze[o]) < e ? t = o + 1 : n = o
    }
    return t
}
function vo(e) {
    (!ze.length || !ze.includes(e, Ln && e.allowRecurse ? gt + 1 : gt)) && (e.id == null ? ze.push(e) : ze.splice(wc(e.id), 0, e),
    hi())
}
function hi() {
    !Ln && !Uo && (Uo = !0,
    Er = pi.then(gi))
}
function Ec(e) {
    const t = ze.indexOf(e);
    t > gt && ze.splice(t, 1)
}
function Cc(e) {
    X(e) ? rn.push(...e) : (!Et || !Et.includes(e, e.allowRecurse ? Ut + 1 : Ut)) && rn.push(e),
    hi()
}
function Xr(e, t=Ln ? gt + 1 : 0) {
    for (; t < ze.length; t++) {
        const n = ze[t];
        n && n.pre && (ze.splice(t, 1),
        t--,
        n())
    }
}
function mi(e) {
    if (rn.length) {
        const t = [...new Set(rn)];
        if (rn.length = 0,
        Et) {
            Et.push(...t);
            return
        }
        for (Et = t,
        Et.sort((n,o)=>$n(n) - $n(o)),
        Ut = 0; Ut < Et.length; Ut++)
            Et[Ut]();
        Et = null,
        Ut = 0
    }
}
const $n = e=>e.id == null ? 1 / 0 : e.id
  , Ac = (e,t)=>{
    const n = $n(e) - $n(t);
    if (n === 0) {
        if (e.pre && !t.pre)
            return -1;
        if (t.pre && !e.pre)
            return 1
    }
    return n
}
;
function gi(e) {
    Uo = !1,
    Ln = !0,
    ze.sort(Ac);
    const t = ft;
    try {
        for (gt = 0; gt < ze.length; gt++) {
            const n = ze[gt];
            n && n.active !== !1 && Mt(n, null, 14)
        }
    } finally {
        gt = 0,
        ze.length = 0,
        mi(),
        Ln = !1,
        Er = null,
        (ze.length || rn.length) && gi()
    }
}
function Pc(e, t, ...n) {
    if (e.isUnmounted)
        return;
    const o = e.vnode.props || Ae;
    let r = n;
    const s = t.startsWith("update:")
      , i = s && t.slice(7);
    if (i && i in o) {
        const u = `${i === "modelValue" ? "model" : i}Modifiers`
          , {number: f, trim: p} = o[u] || Ae;
        p && (r = n.map(g=>Ie(g) ? g.trim() : g)),
        f && (r = n.map(Sl))
    }
    let l, c = o[l = xo(t)] || o[l = xo(vt(t))];
    !c && s && (c = o[l = xo(pn(t))]),
    c && rt(c, e, 6, r);
    const a = o[l + "Once"];
    if (a) {
        if (!e.emitted)
            e.emitted = {};
        else if (e.emitted[l])
            return;
        e.emitted[l] = !0,
        rt(a, e, 6, r)
    }
}
function vi(e, t, n=!1) {
    const o = t.emitsCache
      , r = o.get(e);
    if (r !== void 0)
        return r;
    const s = e.emits;
    let i = {}
      , l = !1;
    if (!ne(e)) {
        const c = a=>{
            const u = vi(a, t, !0);
            u && (l = !0,
            Me(i, u))
        }
        ;
        !n && t.mixins.length && t.mixins.forEach(c),
        e.extends && c(e.extends),
        e.mixins && e.mixins.forEach(c)
    }
    return !s && !l ? (Te(e) && o.set(e, null),
    null) : (X(s) ? s.forEach(c=>i[c] = null) : Me(i, s),
    Te(e) && o.set(e, i),
    i)
}
function _o(e, t) {
    return !e || !uo(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""),
    ae(e, t[0].toLowerCase() + t.slice(1)) || ae(e, pn(t)) || ae(e, t))
}
let qe = null
  , _i = null;
function ro(e) {
    const t = qe;
    return qe = e,
    _i = e && e.type.__scopeId || null,
    t
}
function At(e, t=qe, n) {
    if (!t || e._n)
        return e;
    const o = (...r)=>{
        o._d && cs(-1);
        const s = ro(t);
        let i;
        try {
            i = e(...r)
        } finally {
            ro(s),
            o._d && cs(1)
        }
        return i
    }
    ;
    return o._n = !0,
    o._c = !0,
    o._d = !0,
    o
}
function So(e) {
    const {type: t, vnode: n, proxy: o, withProxy: r, props: s, propsOptions: [i], slots: l, attrs: c, emit: a, render: u, renderCache: f, data: p, setupState: g, ctx: w, inheritAttrs: S} = e;
    let O, L;
    const y = ro(e);
    try {
        if (n.shapeFlag & 4) {
            const P = r || o;
            O = mt(u.call(P, P, f, s, g, p, w)),
            L = c
        } else {
            const P = t;
            O = mt(P.length > 1 ? P(s, {
                attrs: c,
                slots: l,
                emit: a
            }) : P(s, null)),
            L = t.props ? c : Tc(c)
        }
    } catch (P) {
        Tn.length = 0,
        Fn(P, e, 1),
        O = Ee(st)
    }
    let k = O;
    if (L && S !== !1) {
        const P = Object.keys(L)
          , {shapeFlag: D} = k;
        P.length && D & 7 && (i && P.some(ar) && (L = xc(L, i)),
        k = Nt(k, L))
    }
    return n.dirs && (k = Nt(k),
    k.dirs = k.dirs ? k.dirs.concat(n.dirs) : n.dirs),
    n.transition && (k.transition = n.transition),
    O = k,
    ro(y),
    O
}
const Tc = e=>{
    let t;
    for (const n in e)
        (n === "class" || n === "style" || uo(n)) && ((t || (t = {}))[n] = e[n]);
    return t
}
  , xc = (e,t)=>{
    const n = {};
    for (const o in e)
        (!ar(o) || !(o.slice(9)in t)) && (n[o] = e[o]);
    return n
}
;
function kc(e, t, n) {
    const {props: o, children: r, component: s} = e
      , {props: i, children: l, patchFlag: c} = t
      , a = s.emitsOptions;
    if (t.dirs || t.transition)
        return !0;
    if (n && c >= 0) {
        if (c & 1024)
            return !0;
        if (c & 16)
            return o ? Jr(o, i, a) : !!i;
        if (c & 8) {
            const u = t.dynamicProps;
            for (let f = 0; f < u.length; f++) {
                const p = u[f];
                if (i[p] !== o[p] && !_o(a, p))
                    return !0
            }
        }
    } else
        return (r || l) && (!l || !l.$stable) ? !0 : o === i ? !1 : o ? i ? Jr(o, i, a) : !0 : !!i;
    return !1
}
function Jr(e, t, n) {
    const o = Object.keys(t);
    if (o.length !== Object.keys(e).length)
        return !0;
    for (let r = 0; r < o.length; r++) {
        const s = o[r];
        if (t[s] !== e[s] && !_o(n, s))
            return !0
    }
    return !1
}
function Sc({vnode: e, parent: t}, n) {
    for (; t && t.subTree === e; )
        (e = t.vnode).el = n,
        t = t.parent
}
const Oc = e=>e.__isSuspense;
function Rc(e, t) {
    t && t.pendingBranch ? X(e) ? t.effects.push(...e) : t.effects.push(e) : Cc(e)
}
function Ic(e, t) {
    return Cr(e, null, {
        flush: "post"
    })
}
const Qn = {};
function He(e, t, n) {
    return Cr(e, t, n)
}
function Cr(e, t, {immediate: n, deep: o, flush: r, onTrack: s, onTrigger: i}=Ae) {
    var l;
    const c = Fl() === ((l = Ne) == null ? void 0 : l.scope) ? Ne : null;
    let a, u = !1, f = !1;
    if (je(e) ? (a = ()=>e.value,
    u = oo(e)) : on(e) ? (a = ()=>e,
    o = !0) : X(e) ? (f = !0,
    u = e.some(P=>on(P) || oo(P)),
    a = ()=>e.map(P=>{
        if (je(P))
            return P.value;
        if (on(P))
            return Qt(P);
        if (ne(P))
            return Mt(P, c, 2)
    }
    )) : ne(e) ? t ? a = ()=>Mt(e, c, 2) : a = ()=>{
        if (!(c && c.isUnmounted))
            return p && p(),
            rt(e, c, 3, [g])
    }
    : a = ft,
    t && o) {
        const P = a;
        a = ()=>Qt(P())
    }
    let p, g = P=>{
        p = y.onStop = ()=>{
            Mt(P, c, 4)
        }
    }
    , w;
    if (an)
        if (g = ft,
        t ? n && rt(t, c, 3, [a(), f ? [] : void 0, g]) : a(),
        r === "sync") {
            const P = Aa();
            w = P.__watcherHandles || (P.__watcherHandles = [])
        } else
            return ft;
    let S = f ? new Array(e.length).fill(Qn) : Qn;
    const O = ()=>{
        if (y.active)
            if (t) {
                const P = y.run();
                (o || u || (f ? P.some((D,ee)=>Rn(D, S[ee])) : Rn(P, S))) && (p && p(),
                rt(t, c, 3, [P, S === Qn ? void 0 : f && S[0] === Qn ? [] : S, g]),
                S = P)
            } else
                y.run()
    }
    ;
    O.allowRecurse = !!t;
    let L;
    r === "sync" ? L = O : r === "post" ? L = ()=>Xe(O, c && c.suspense) : (O.pre = !0,
    c && (O.id = c.uid),
    L = ()=>vo(O));
    const y = new mr(a,L);
    t ? n ? O() : S = y.run() : r === "post" ? Xe(y.run.bind(y), c && c.suspense) : y.run();
    const k = ()=>{
        y.stop(),
        c && c.scope && ur(c.scope.effects, y)
    }
    ;
    return w && w.push(k),
    k
}
function Lc(e, t, n) {
    const o = this.proxy
      , r = Ie(e) ? e.includes(".") ? bi(o, e) : ()=>o[e] : e.bind(o, o);
    let s;
    ne(t) ? s = t : (s = t.handler,
    n = t);
    const i = Ne;
    cn(this);
    const l = Cr(r, s.bind(o), n);
    return i ? cn(i) : Jt(),
    l
}
function bi(e, t) {
    const n = t.split(".");
    return ()=>{
        let o = e;
        for (let r = 0; r < n.length && o; r++)
            o = o[n[r]];
        return o
    }
}
function Qt(e, t) {
    if (!Te(e) || e.__v_skip || (t = t || new Set,
    t.has(e)))
        return e;
    if (t.add(e),
    je(e))
        Qt(e.value, t);
    else if (X(e))
        for (let n = 0; n < e.length; n++)
            Qt(e[n], t);
    else if (qs(e) || nn(e))
        e.forEach(n=>{
            Qt(n, t)
        }
        );
    else if (zs(e))
        for (const n in e)
            Qt(e[n], t);
    return e
}
function Gn(e, t) {
    const n = qe;
    if (n === null)
        return e;
    const o = Eo(n) || n.proxy
      , r = e.dirs || (e.dirs = []);
    for (let s = 0; s < t.length; s++) {
        let[i,l,c,a=Ae] = t[s];
        i && (ne(i) && (i = {
            mounted: i,
            updated: i
        }),
        i.deep && Qt(l),
        r.push({
            dir: i,
            instance: o,
            value: l,
            oldValue: void 0,
            arg: c,
            modifiers: a
        }))
    }
    return e
}
function Ht(e, t, n, o) {
    const r = e.dirs
      , s = t && t.dirs;
    for (let i = 0; i < r.length; i++) {
        const l = r[i];
        s && (l.oldValue = s[i].value);
        let c = l.dir[o];
        c && (dn(),
        rt(c, n, 8, [e.el, l, e, t]),
        hn())
    }
}
function yi() {
    const e = {
        isMounted: !1,
        isLeaving: !1,
        isUnmounting: !1,
        leavingVNodes: new Map
    };
    return Gt(()=>{
        e.isMounted = !0
    }
    ),
    mn(()=>{
        e.isUnmounting = !0
    }
    ),
    e
}
const ot = [Function, Array]
  , wi = {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    onBeforeEnter: ot,
    onEnter: ot,
    onAfterEnter: ot,
    onEnterCancelled: ot,
    onBeforeLeave: ot,
    onLeave: ot,
    onAfterLeave: ot,
    onLeaveCancelled: ot,
    onBeforeAppear: ot,
    onAppear: ot,
    onAfterAppear: ot,
    onAppearCancelled: ot
}
  , $c = {
    name: "BaseTransition",
    props: wi,
    setup(e, {slots: t}) {
        const n = Ir()
          , o = yi();
        let r;
        return ()=>{
            const s = t.default && Ar(t.default(), !0);
            if (!s || !s.length)
                return;
            let i = s[0];
            if (s.length > 1) {
                for (const S of s)
                    if (S.type !== st) {
                        i = S;
                        break
                    }
            }
            const l = ce(e)
              , {mode: c} = l;
            if (o.isLeaving)
                return Oo(i);
            const a = Gr(i);
            if (!a)
                return Oo(i);
            const u = Mn(a, l, o, n);
            Wn(a, u);
            const f = n.subTree
              , p = f && Gr(f);
            let g = !1;
            const {getTransitionKey: w} = a.type;
            if (w) {
                const S = w();
                r === void 0 ? r = S : S !== r && (r = S,
                g = !0)
            }
            if (p && p.type !== st && (!Vt(a, p) || g)) {
                const S = Mn(p, l, o, n);
                if (Wn(p, S),
                c === "out-in")
                    return o.isLeaving = !0,
                    S.afterLeave = ()=>{
                        o.isLeaving = !1,
                        n.update.active !== !1 && n.update()
                    }
                    ,
                    Oo(i);
                c === "in-out" && a.type !== st && (S.delayLeave = (O,L,y)=>{
                    const k = Ei(o, p);
                    k[String(p.key)] = p,
                    O._leaveCb = ()=>{
                        L(),
                        O._leaveCb = void 0,
                        delete u.delayedLeave
                    }
                    ,
                    u.delayedLeave = y
                }
                )
            }
            return i
        }
    }
}
  , Mc = $c;
function Ei(e, t) {
    const {leavingVNodes: n} = e;
    let o = n.get(t.type);
    return o || (o = Object.create(null),
    n.set(t.type, o)),
    o
}
function Mn(e, t, n, o) {
    const {appear: r, mode: s, persisted: i=!1, onBeforeEnter: l, onEnter: c, onAfterEnter: a, onEnterCancelled: u, onBeforeLeave: f, onLeave: p, onAfterLeave: g, onLeaveCancelled: w, onBeforeAppear: S, onAppear: O, onAfterAppear: L, onAppearCancelled: y} = t
      , k = String(e.key)
      , P = Ei(n, e)
      , D = (j,oe)=>{
        j && rt(j, o, 9, oe)
    }
      , ee = (j,oe)=>{
        const G = oe[1];
        D(j, oe),
        X(j) ? j.every(de=>de.length <= 1) && G() : j.length <= 1 && G()
    }
      , se = {
        mode: s,
        persisted: i,
        beforeEnter(j) {
            let oe = l;
            if (!n.isMounted)
                if (r)
                    oe = S || l;
                else
                    return;
            j._leaveCb && j._leaveCb(!0);
            const G = P[k];
            G && Vt(e, G) && G.el._leaveCb && G.el._leaveCb(),
            D(oe, [j])
        },
        enter(j) {
            let oe = c
              , G = a
              , de = u;
            if (!n.isMounted)
                if (r)
                    oe = O || c,
                    G = L || a,
                    de = y || u;
                else
                    return;
            let H = !1;
            const ie = j._enterCb = We=>{
                H || (H = !0,
                We ? D(de, [j]) : D(G, [j]),
                se.delayedLeave && se.delayedLeave(),
                j._enterCb = void 0)
            }
            ;
            oe ? ee(oe, [j, ie]) : ie()
        },
        leave(j, oe) {
            const G = String(e.key);
            if (j._enterCb && j._enterCb(!0),
            n.isUnmounting)
                return oe();
            D(f, [j]);
            let de = !1;
            const H = j._leaveCb = ie=>{
                de || (de = !0,
                oe(),
                ie ? D(w, [j]) : D(g, [j]),
                j._leaveCb = void 0,
                P[G] === e && delete P[G])
            }
            ;
            P[G] = e,
            p ? ee(p, [j, H]) : H()
        },
        clone(j) {
            return Mn(j, t, n, o)
        }
    };
    return se
}
function Oo(e) {
    if (Dn(e))
        return e = Nt(e),
        e.children = null,
        e
}
function Gr(e) {
    return Dn(e) ? e.children ? e.children[0] : void 0 : e
}
function Wn(e, t) {
    e.shapeFlag & 6 && e.component ? Wn(e.component.subTree, t) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent),
    e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t
}
function Ar(e, t=!1, n) {
    let o = []
      , r = 0;
    for (let s = 0; s < e.length; s++) {
        let i = e[s];
        const l = n == null ? i.key : String(n) + String(i.key != null ? i.key : s);
        i.type === Fe ? (i.patchFlag & 128 && r++,
        o = o.concat(Ar(i.children, t, l))) : (t || i.type !== st) && o.push(l != null ? Nt(i, {
            key: l
        }) : i)
    }
    if (r > 1)
        for (let s = 0; s < o.length; s++)
            o[s].patchFlag = -2;
    return o
}
function xe(e, t) {
    return ne(e) ? (()=>Me({
        name: e.name
    }, t, {
        setup: e
    }))() : e
}
const Cn = e=>!!e.type.__asyncLoader;
function Lt(e) {
    ne(e) && (e = {
        loader: e
    });
    const {loader: t, loadingComponent: n, errorComponent: o, delay: r=200, timeout: s, suspensible: i=!0, onError: l} = e;
    let c = null, a, u = 0;
    const f = ()=>(u++,
    c = null,
    p())
      , p = ()=>{
        let g;
        return c || (g = c = t().catch(w=>{
            if (w = w instanceof Error ? w : new Error(String(w)),
            l)
                return new Promise((S,O)=>{
                    l(w, ()=>S(f()), ()=>O(w), u + 1)
                }
                );
            throw w
        }
        ).then(w=>g !== c && c ? c : (w && (w.__esModule || w[Symbol.toStringTag] === "Module") && (w = w.default),
        a = w,
        w)))
    }
    ;
    return xe({
        name: "AsyncComponentWrapper",
        __asyncLoader: p,
        get __asyncResolved() {
            return a
        },
        setup() {
            const g = Ne;
            if (a)
                return ()=>Ro(a, g);
            const w = y=>{
                c = null,
                Fn(y, g, 13, !o)
            }
            ;
            if (i && g.suspense || an)
                return p().then(y=>()=>Ro(y, g)).catch(y=>(w(y),
                ()=>o ? Ee(o, {
                    error: y
                }) : null));
            const S = we(!1)
              , O = we()
              , L = we(!!r);
            return r && setTimeout(()=>{
                L.value = !1
            }
            , r),
            s != null && setTimeout(()=>{
                if (!S.value && !O.value) {
                    const y = new Error(`Async component timed out after ${s}ms.`);
                    w(y),
                    O.value = y
                }
            }
            , s),
            p().then(()=>{
                S.value = !0,
                g.parent && Dn(g.parent.vnode) && vo(g.parent.update)
            }
            ).catch(y=>{
                w(y),
                O.value = y
            }
            ),
            ()=>{
                if (S.value && a)
                    return Ro(a, g);
                if (O.value && o)
                    return Ee(o, {
                        error: O.value
                    });
                if (n && !L.value)
                    return Ee(n)
            }
        }
    })
}
function Ro(e, t) {
    const {ref: n, props: o, children: r, ce: s} = t.vnode
      , i = Ee(e, o, r);
    return i.ref = n,
    i.ce = s,
    delete t.vnode.ce,
    i
}
const Dn = e=>e.type.__isKeepAlive;
function Wc(e, t) {
    Ci(e, "a", t)
}
function Bc(e, t) {
    Ci(e, "da", t)
}
function Ci(e, t, n=Ne) {
    const o = e.__wdc || (e.__wdc = ()=>{
        let r = n;
        for (; r; ) {
            if (r.isDeactivated)
                return;
            r = r.parent
        }
        return e()
    }
    );
    if (bo(t, o, n),
    n) {
        let r = n.parent;
        for (; r && r.parent; )
            Dn(r.parent.vnode) && Nc(o, t, n, r),
            r = r.parent
    }
}
function Nc(e, t, n, o) {
    const r = bo(t, e, o, !0);
    Pr(()=>{
        ur(o[t], r)
    }
    , n)
}
function bo(e, t, n=Ne, o=!1) {
    if (n) {
        const r = n[e] || (n[e] = [])
          , s = t.__weh || (t.__weh = (...i)=>{
            if (n.isUnmounted)
                return;
            dn(),
            cn(n);
            const l = rt(t, n, e, i);
            return Jt(),
            hn(),
            l
        }
        );
        return o ? r.unshift(s) : r.push(s),
        s
    }
}
const Pt = e=>(t,n=Ne)=>(!an || e === "sp") && bo(e, (...o)=>t(...o), n)
  , Fc = Pt("bm")
  , Gt = Pt("m")
  , Dc = Pt("bu")
  , Ai = Pt("u")
  , mn = Pt("bum")
  , Pr = Pt("um")
  , Hc = Pt("sp")
  , jc = Pt("rtg")
  , qc = Pt("rtc");
function Uc(e, t=Ne) {
    bo("ec", e, t)
}
const Tr = "components";
function Vc(e, t) {
    return Ti(Tr, e, !0, t) || e
}
const Pi = Symbol.for("v-ndc");
function gn(e) {
    return Ie(e) ? Ti(Tr, e, !1) || e : e || Pi
}
function Ti(e, t, n=!0, o=!1) {
    const r = qe || Ne;
    if (r) {
        const s = r.type;
        if (e === Tr) {
            const l = wa(s, !1);
            if (l && (l === t || l === vt(t) || l === ho(vt(t))))
                return s
        }
        const i = Zr(r[e] || s[e], t) || Zr(r.appContext[e], t);
        return !i && o ? s : i
    }
}
function Zr(e, t) {
    return e && (e[t] || e[vt(t)] || e[ho(vt(t))])
}
function xr(e, t, n, o) {
    let r;
    const s = n && n[o];
    if (X(e) || Ie(e)) {
        r = new Array(e.length);
        for (let i = 0, l = e.length; i < l; i++)
            r[i] = t(e[i], i, void 0, s && s[i])
    } else if (typeof e == "number") {
        r = new Array(e);
        for (let i = 0; i < e; i++)
            r[i] = t(i + 1, i, void 0, s && s[i])
    } else if (Te(e))
        if (e[Symbol.iterator])
            r = Array.from(e, (i,l)=>t(i, l, void 0, s && s[l]));
        else {
            const i = Object.keys(e);
            r = new Array(i.length);
            for (let l = 0, c = i.length; l < c; l++) {
                const a = i[l];
                r[l] = t(e[a], a, l, s && s[l])
            }
        }
    else
        r = [];
    return n && (n[o] = r),
    r
}
function Je(e, t, n={}, o, r) {
    if (qe.isCE || qe.parent && Cn(qe.parent) && qe.parent.isCE)
        return t !== "default" && (n.name = t),
        Ee("slot", n, o && o());
    let s = e[t];
    s && s._c && (s._d = !1),
    Q();
    const i = s && xi(s(n))
      , l = ge(Fe, {
        key: n.key || i && i.key || `_${t}`
    }, i || (o ? o() : []), i && e._ === 1 ? 64 : -2);
    return !r && l.scopeId && (l.slotScopeIds = [l.scopeId + "-s"]),
    s && s._c && (s._d = !0),
    l
}
function xi(e) {
    return e.some(t=>lo(t) ? !(t.type === st || t.type === Fe && !xi(t.children)) : !0) ? e : null
}
const Vo = e=>e ? Ni(e) ? Eo(e) || e.proxy : Vo(e.parent) : null
  , An = Me(Object.create(null), {
    $: e=>e,
    $el: e=>e.vnode.el,
    $data: e=>e.data,
    $props: e=>e.props,
    $attrs: e=>e.attrs,
    $slots: e=>e.slots,
    $refs: e=>e.refs,
    $parent: e=>Vo(e.parent),
    $root: e=>Vo(e.root),
    $emit: e=>e.emit,
    $options: e=>kr(e),
    $forceUpdate: e=>e.f || (e.f = ()=>vo(e.update)),
    $nextTick: e=>e.n || (e.n = di.bind(e.proxy)),
    $watch: e=>Lc.bind(e)
})
  , Io = (e,t)=>e !== Ae && !e.__isScriptSetup && ae(e, t)
  , zc = {
    get({_: e}, t) {
        const {ctx: n, setupState: o, data: r, props: s, accessCache: i, type: l, appContext: c} = e;
        let a;
        if (t[0] !== "$") {
            const g = i[t];
            if (g !== void 0)
                switch (g) {
                case 1:
                    return o[t];
                case 2:
                    return r[t];
                case 4:
                    return n[t];
                case 3:
                    return s[t]
                }
            else {
                if (Io(o, t))
                    return i[t] = 1,
                    o[t];
                if (r !== Ae && ae(r, t))
                    return i[t] = 2,
                    r[t];
                if ((a = e.propsOptions[0]) && ae(a, t))
                    return i[t] = 3,
                    s[t];
                if (n !== Ae && ae(n, t))
                    return i[t] = 4,
                    n[t];
                Ko && (i[t] = 0)
            }
        }
        const u = An[t];
        let f, p;
        if (u)
            return t === "$attrs" && Ge(e, "get", t),
            u(e);
        if ((f = l.__cssModules) && (f = f[t]))
            return f;
        if (n !== Ae && ae(n, t))
            return i[t] = 4,
            n[t];
        if (p = c.config.globalProperties,
        ae(p, t))
            return p[t]
    },
    set({_: e}, t, n) {
        const {data: o, setupState: r, ctx: s} = e;
        return Io(r, t) ? (r[t] = n,
        !0) : o !== Ae && ae(o, t) ? (o[t] = n,
        !0) : ae(e.props, t) || t[0] === "$" && t.slice(1)in e ? !1 : (s[t] = n,
        !0)
    },
    has({_: {data: e, setupState: t, accessCache: n, ctx: o, appContext: r, propsOptions: s}}, i) {
        let l;
        return !!n[i] || e !== Ae && ae(e, i) || Io(t, i) || (l = s[0]) && ae(l, i) || ae(o, i) || ae(An, i) || ae(r.config.globalProperties, i)
    },
    defineProperty(e, t, n) {
        return n.get != null ? e._.accessCache[t] = 0 : ae(n, "value") && this.set(e, t, n.value, null),
        Reflect.defineProperty(e, t, n)
    }
};
function zo(e) {
    return X(e) ? e.reduce((t,n)=>(t[n] = null,
    t), {}) : e
}
function Ft(e, t) {
    const n = zo(e);
    for (const o in t) {
        if (o.startsWith("__skip"))
            continue;
        let r = n[o];
        r ? X(r) || ne(r) ? r = n[o] = {
            type: r,
            default: t[o]
        } : r.default = t[o] : r === null && (r = n[o] = {
            default: t[o]
        }),
        r && t[`__skip_${o}`] && (r.skipFactory = !0)
    }
    return n
}
let Ko = !0;
function Kc(e) {
    const t = kr(e)
      , n = e.proxy
      , o = e.ctx;
    Ko = !1,
    t.beforeCreate && es(t.beforeCreate, e, "bc");
    const {data: r, computed: s, methods: i, watch: l, provide: c, inject: a, created: u, beforeMount: f, mounted: p, beforeUpdate: g, updated: w, activated: S, deactivated: O, beforeDestroy: L, beforeUnmount: y, destroyed: k, unmounted: P, render: D, renderTracked: ee, renderTriggered: se, errorCaptured: j, serverPrefetch: oe, expose: G, inheritAttrs: de, components: H, directives: ie, filters: We} = t;
    if (a && Qc(a, o, null),
    i)
        for (const fe in i) {
            const R = i[fe];
            ne(R) && (o[fe] = R.bind(n))
        }
    if (r) {
        const fe = r.call(n, n);
        Te(fe) && (e.data = go(fe))
    }
    if (Ko = !0,
    s)
        for (const fe in s) {
            const R = s[fe]
              , le = ne(R) ? R.bind(n, n) : ne(R.get) ? R.get.bind(n, n) : ft
              , Oe = !ne(R) && ne(R.set) ? R.set.bind(n) : ft
              , ke = J({
                get: le,
                set: Oe
            });
            Object.defineProperty(o, fe, {
                enumerable: !0,
                configurable: !0,
                get: ()=>ke.value,
                set: Re=>ke.value = Re
            })
        }
    if (l)
        for (const fe in l)
            ki(l[fe], o, n, fe);
    if (c) {
        const fe = ne(c) ? c.call(n) : c;
        Reflect.ownKeys(fe).forEach(R=>{
            Xt(R, fe[R])
        }
        )
    }
    u && es(u, e, "c");
    function ve(fe, R) {
        X(R) ? R.forEach(le=>fe(le.bind(n))) : R && fe(R.bind(n))
    }
    if (ve(Fc, f),
    ve(Gt, p),
    ve(Dc, g),
    ve(Ai, w),
    ve(Wc, S),
    ve(Bc, O),
    ve(Uc, j),
    ve(qc, ee),
    ve(jc, se),
    ve(mn, y),
    ve(Pr, P),
    ve(Hc, oe),
    X(G))
        if (G.length) {
            const fe = e.exposed || (e.exposed = {});
            G.forEach(R=>{
                Object.defineProperty(fe, R, {
                    get: ()=>n[R],
                    set: le=>n[R] = le
                })
            }
            )
        } else
            e.exposed || (e.exposed = {});
    D && e.render === ft && (e.render = D),
    de != null && (e.inheritAttrs = de),
    H && (e.components = H),
    ie && (e.directives = ie)
}
function Qc(e, t, n=ft) {
    X(e) && (e = Qo(e));
    for (const o in e) {
        const r = e[o];
        let s;
        Te(r) ? "default"in r ? s = Ue(r.from || o, r.default, !0) : s = Ue(r.from || o) : s = Ue(r),
        je(s) ? Object.defineProperty(t, o, {
            enumerable: !0,
            configurable: !0,
            get: ()=>s.value,
            set: i=>s.value = i
        }) : t[o] = s
    }
}
function es(e, t, n) {
    rt(X(e) ? e.map(o=>o.bind(t.proxy)) : e.bind(t.proxy), t, n)
}
function ki(e, t, n, o) {
    const r = o.includes(".") ? bi(n, o) : ()=>n[o];
    if (Ie(e)) {
        const s = t[e];
        ne(s) && He(r, s)
    } else if (ne(e))
        He(r, e.bind(n));
    else if (Te(e))
        if (X(e))
            e.forEach(s=>ki(s, t, n, o));
        else {
            const s = ne(e.handler) ? e.handler.bind(n) : t[e.handler];
            ne(s) && He(r, s, e)
        }
}
function kr(e) {
    const t = e.type
      , {mixins: n, extends: o} = t
      , {mixins: r, optionsCache: s, config: {optionMergeStrategies: i}} = e.appContext
      , l = s.get(t);
    let c;
    return l ? c = l : !r.length && !n && !o ? c = t : (c = {},
    r.length && r.forEach(a=>so(c, a, i, !0)),
    so(c, t, i)),
    Te(t) && s.set(t, c),
    c
}
function so(e, t, n, o=!1) {
    const {mixins: r, extends: s} = t;
    s && so(e, s, n, !0),
    r && r.forEach(i=>so(e, i, n, !0));
    for (const i in t)
        if (!(o && i === "expose")) {
            const l = Yc[i] || n && n[i];
            e[i] = l ? l(e[i], t[i]) : t[i]
        }
    return e
}
const Yc = {
    data: ts,
    props: ns,
    emits: ns,
    methods: En,
    computed: En,
    beforeCreate: Ye,
    created: Ye,
    beforeMount: Ye,
    mounted: Ye,
    beforeUpdate: Ye,
    updated: Ye,
    beforeDestroy: Ye,
    beforeUnmount: Ye,
    destroyed: Ye,
    unmounted: Ye,
    activated: Ye,
    deactivated: Ye,
    errorCaptured: Ye,
    serverPrefetch: Ye,
    components: En,
    directives: En,
    watch: Jc,
    provide: ts,
    inject: Xc
};
function ts(e, t) {
    return t ? e ? function() {
        return Me(ne(e) ? e.call(this, this) : e, ne(t) ? t.call(this, this) : t)
    }
    : t : e
}
function Xc(e, t) {
    return En(Qo(e), Qo(t))
}
function Qo(e) {
    if (X(e)) {
        const t = {};
        for (let n = 0; n < e.length; n++)
            t[e[n]] = e[n];
        return t
    }
    return e
}
function Ye(e, t) {
    return e ? [...new Set([].concat(e, t))] : t
}
function En(e, t) {
    return e ? Me(Object.create(null), e, t) : t
}
function ns(e, t) {
    return e ? X(e) && X(t) ? [...new Set([...e, ...t])] : Me(Object.create(null), zo(e), zo(t ?? {})) : t
}
function Jc(e, t) {
    if (!e)
        return t;
    if (!t)
        return e;
    const n = Me(Object.create(null), e);
    for (const o in t)
        n[o] = Ye(e[o], t[o]);
    return n
}
function Si() {
    return {
        app: null,
        config: {
            isNativeTag: Cl,
            performance: !1,
            globalProperties: {},
            optionMergeStrategies: {},
            errorHandler: void 0,
            warnHandler: void 0,
            compilerOptions: {}
        },
        mixins: [],
        components: {},
        directives: {},
        provides: Object.create(null),
        optionsCache: new WeakMap,
        propsCache: new WeakMap,
        emitsCache: new WeakMap
    }
}
let Gc = 0;
function Zc(e, t) {
    return function(o, r=null) {
        ne(o) || (o = Me({}, o)),
        r != null && !Te(r) && (r = null);
        const s = Si()
          , i = new Set;
        let l = !1;
        const c = s.app = {
            _uid: Gc++,
            _component: o,
            _props: r,
            _container: null,
            _context: s,
            _instance: null,
            version: Pa,
            get config() {
                return s.config
            },
            set config(a) {},
            use(a, ...u) {
                return i.has(a) || (a && ne(a.install) ? (i.add(a),
                a.install(c, ...u)) : ne(a) && (i.add(a),
                a(c, ...u))),
                c
            },
            mixin(a) {
                return s.mixins.includes(a) || s.mixins.push(a),
                c
            },
            component(a, u) {
                return u ? (s.components[a] = u,
                c) : s.components[a]
            },
            directive(a, u) {
                return u ? (s.directives[a] = u,
                c) : s.directives[a]
            },
            mount(a, u, f) {
                if (!l) {
                    const p = Ee(o, r);
                    return p.appContext = s,
                    u && t ? t(p, a) : e(p, a, f),
                    l = !0,
                    c._container = a,
                    a.__vue_app__ = c,
                    Eo(p.component) || p.component.proxy
                }
            },
            unmount() {
                l && (e(null, c._container),
                delete c._container.__vue_app__)
            },
            provide(a, u) {
                return s.provides[a] = u,
                c
            },
            runWithContext(a) {
                io = c;
                try {
                    return a()
                } finally {
                    io = null
                }
            }
        };
        return c
    }
}
let io = null;
function Xt(e, t) {
    if (Ne) {
        let n = Ne.provides;
        const o = Ne.parent && Ne.parent.provides;
        o === n && (n = Ne.provides = Object.create(o)),
        n[e] = t
    }
}
function Ue(e, t, n=!1) {
    const o = Ne || qe;
    if (o || io) {
        const r = o ? o.parent == null ? o.vnode.appContext && o.vnode.appContext.provides : o.parent.provides : io._context.provides;
        if (r && e in r)
            return r[e];
        if (arguments.length > 1)
            return n && ne(t) ? t.call(o && o.proxy) : t
    }
}
function ea(e, t, n, o=!1) {
    const r = {}
      , s = {};
    to(s, wo, 1),
    e.propsDefaults = Object.create(null),
    Oi(e, t, r, s);
    for (const i in e.propsOptions[0])
        i in r || (r[i] = void 0);
    n ? e.props = o ? r : si(r) : e.type.props ? e.props = r : e.props = s,
    e.attrs = s
}
function ta(e, t, n, o) {
    const {props: r, attrs: s, vnode: {patchFlag: i}} = e
      , l = ce(r)
      , [c] = e.propsOptions;
    let a = !1;
    if ((o || i > 0) && !(i & 16)) {
        if (i & 8) {
            const u = e.vnode.dynamicProps;
            for (let f = 0; f < u.length; f++) {
                let p = u[f];
                if (_o(e.emitsOptions, p))
                    continue;
                const g = t[p];
                if (c)
                    if (ae(s, p))
                        g !== s[p] && (s[p] = g,
                        a = !0);
                    else {
                        const w = vt(p);
                        r[w] = Yo(c, l, w, g, e, !1)
                    }
                else
                    g !== s[p] && (s[p] = g,
                    a = !0)
            }
        }
    } else {
        Oi(e, t, r, s) && (a = !0);
        let u;
        for (const f in l)
            (!t || !ae(t, f) && ((u = pn(f)) === f || !ae(t, u))) && (c ? n && (n[f] !== void 0 || n[u] !== void 0) && (r[f] = Yo(c, l, f, void 0, e, !0)) : delete r[f]);
        if (s !== l)
            for (const f in s)
                (!t || !ae(t, f)) && (delete s[f],
                a = !0)
    }
    a && Ct(e, "set", "$attrs")
}
function Oi(e, t, n, o) {
    const [r,s] = e.propsOptions;
    let i = !1, l;
    if (t)
        for (let c in t) {
            if (Jn(c))
                continue;
            const a = t[c];
            let u;
            r && ae(r, u = vt(c)) ? !s || !s.includes(u) ? n[u] = a : (l || (l = {}))[u] = a : _o(e.emitsOptions, c) || (!(c in o) || a !== o[c]) && (o[c] = a,
            i = !0)
        }
    if (s) {
        const c = ce(n)
          , a = l || Ae;
        for (let u = 0; u < s.length; u++) {
            const f = s[u];
            n[f] = Yo(r, c, f, a[f], e, !ae(a, f))
        }
    }
    return i
}
function Yo(e, t, n, o, r, s) {
    const i = e[n];
    if (i != null) {
        const l = ae(i, "default");
        if (l && o === void 0) {
            const c = i.default;
            if (i.type !== Function && !i.skipFactory && ne(c)) {
                const {propsDefaults: a} = r;
                n in a ? o = a[n] : (cn(r),
                o = a[n] = c.call(null, t),
                Jt())
            } else
                o = c
        }
        i[0] && (s && !l ? o = !1 : i[1] && (o === "" || o === pn(n)) && (o = !0))
    }
    return o
}
function Ri(e, t, n=!1) {
    const o = t.propsCache
      , r = o.get(e);
    if (r)
        return r;
    const s = e.props
      , i = {}
      , l = [];
    let c = !1;
    if (!ne(e)) {
        const u = f=>{
            c = !0;
            const [p,g] = Ri(f, t, !0);
            Me(i, p),
            g && l.push(...g)
        }
        ;
        !n && t.mixins.length && t.mixins.forEach(u),
        e.extends && u(e.extends),
        e.mixins && e.mixins.forEach(u)
    }
    if (!s && !c)
        return Te(e) && o.set(e, tn),
        tn;
    if (X(s))
        for (let u = 0; u < s.length; u++) {
            const f = vt(s[u]);
            os(f) && (i[f] = Ae)
        }
    else if (s)
        for (const u in s) {
            const f = vt(u);
            if (os(f)) {
                const p = s[u]
                  , g = i[f] = X(p) || ne(p) ? {
                    type: p
                } : Me({}, p);
                if (g) {
                    const w = is(Boolean, g.type)
                      , S = is(String, g.type);
                    g[0] = w > -1,
                    g[1] = S < 0 || w < S,
                    (w > -1 || ae(g, "default")) && l.push(f)
                }
            }
        }
    const a = [i, l];
    return Te(e) && o.set(e, a),
    a
}
function os(e) {
    return e[0] !== "$"
}
function rs(e) {
    const t = e && e.toString().match(/^\s*(function|class) (\w+)/);
    return t ? t[2] : e === null ? "null" : ""
}
function ss(e, t) {
    return rs(e) === rs(t)
}
function is(e, t) {
    return X(t) ? t.findIndex(n=>ss(n, e)) : ne(t) && ss(t, e) ? 0 : -1
}
const Ii = e=>e[0] === "_" || e === "$stable"
  , Sr = e=>X(e) ? e.map(mt) : [mt(e)]
  , na = (e,t,n)=>{
    if (t._n)
        return t;
    const o = At((...r)=>Sr(t(...r)), n);
    return o._c = !1,
    o
}
  , Li = (e,t,n)=>{
    const o = e._ctx;
    for (const r in e) {
        if (Ii(r))
            continue;
        const s = e[r];
        if (ne(s))
            t[r] = na(r, s, o);
        else if (s != null) {
            const i = Sr(s);
            t[r] = ()=>i
        }
    }
}
  , $i = (e,t)=>{
    const n = Sr(t);
    e.slots.default = ()=>n
}
  , oa = (e,t)=>{
    if (e.vnode.shapeFlag & 32) {
        const n = t._;
        n ? (e.slots = ce(t),
        to(t, "_", n)) : Li(t, e.slots = {})
    } else
        e.slots = {},
        t && $i(e, t);
    to(e.slots, wo, 1)
}
  , ra = (e,t,n)=>{
    const {vnode: o, slots: r} = e;
    let s = !0
      , i = Ae;
    if (o.shapeFlag & 32) {
        const l = t._;
        l ? n && l === 1 ? s = !1 : (Me(r, t),
        !n && l === 1 && delete r._) : (s = !t.$stable,
        Li(t, r)),
        i = t
    } else
        t && ($i(e, t),
        i = {
            default: 1
        });
    if (s)
        for (const l in r)
            !Ii(l) && !(l in i) && delete r[l]
}
;
function Xo(e, t, n, o, r=!1) {
    if (X(e)) {
        e.forEach((p,g)=>Xo(p, t && (X(t) ? t[g] : t), n, o, r));
        return
    }
    if (Cn(o) && !r)
        return;
    const s = o.shapeFlag & 4 ? Eo(o.component) || o.component.proxy : o.el
      , i = r ? null : s
      , {i: l, r: c} = e
      , a = t && t.r
      , u = l.refs === Ae ? l.refs = {} : l.refs
      , f = l.setupState;
    if (a != null && a !== c && (Ie(a) ? (u[a] = null,
    ae(f, a) && (f[a] = null)) : je(a) && (a.value = null)),
    ne(c))
        Mt(c, l, 12, [i, u]);
    else {
        const p = Ie(c)
          , g = je(c);
        if (p || g) {
            const w = ()=>{
                if (e.f) {
                    const S = p ? ae(f, c) ? f[c] : u[c] : c.value;
                    r ? X(S) && ur(S, s) : X(S) ? S.includes(s) || S.push(s) : p ? (u[c] = [s],
                    ae(f, c) && (f[c] = u[c])) : (c.value = [s],
                    e.k && (u[e.k] = c.value))
                } else
                    p ? (u[c] = i,
                    ae(f, c) && (f[c] = i)) : g && (c.value = i,
                    e.k && (u[e.k] = i))
            }
            ;
            i ? (w.id = -1,
            Xe(w, n)) : w()
        }
    }
}
const Xe = Rc;
function sa(e) {
    return ia(e)
}
function ia(e, t) {
    const n = Do();
    n.__VUE__ = !0;
    const {insert: o, remove: r, patchProp: s, createElement: i, createText: l, createComment: c, setText: a, setElementText: u, parentNode: f, nextSibling: p, setScopeId: g=ft, insertStaticContent: w} = e
      , S = (d,h,_,E=null,C=null,x=null,B=!1,I=null,W=!!h.dynamicChildren)=>{
        if (d === h)
            return;
        d && !Vt(d, h) && (E = A(d),
        Re(d, C, x, !0),
        d = null),
        h.patchFlag === -2 && (W = !1,
        h.dynamicChildren = null);
        const {type: T, ref: V, shapeFlag: F} = h;
        switch (T) {
        case yo:
            O(d, h, _, E);
            break;
        case st:
            L(d, h, _, E);
            break;
        case Zn:
            d == null && y(h, _, E, B);
            break;
        case Fe:
            H(d, h, _, E, C, x, B, I, W);
            break;
        default:
            F & 1 ? D(d, h, _, E, C, x, B, I, W) : F & 6 ? ie(d, h, _, E, C, x, B, I, W) : (F & 64 || F & 128) && T.process(d, h, _, E, C, x, B, I, W, M)
        }
        V != null && C && Xo(V, d && d.ref, x, h || d, !h)
    }
      , O = (d,h,_,E)=>{
        if (d == null)
            o(h.el = l(h.children), _, E);
        else {
            const C = h.el = d.el;
            h.children !== d.children && a(C, h.children)
        }
    }
      , L = (d,h,_,E)=>{
        d == null ? o(h.el = c(h.children || ""), _, E) : h.el = d.el
    }
      , y = (d,h,_,E)=>{
        [d.el,d.anchor] = w(d.children, h, _, E, d.el, d.anchor)
    }
      , k = ({el: d, anchor: h},_,E)=>{
        let C;
        for (; d && d !== h; )
            C = p(d),
            o(d, _, E),
            d = C;
        o(h, _, E)
    }
      , P = ({el: d, anchor: h})=>{
        let _;
        for (; d && d !== h; )
            _ = p(d),
            r(d),
            d = _;
        r(h)
    }
      , D = (d,h,_,E,C,x,B,I,W)=>{
        B = B || h.type === "svg",
        d == null ? ee(h, _, E, C, x, B, I, W) : oe(d, h, C, x, B, I, W)
    }
      , ee = (d,h,_,E,C,x,B,I)=>{
        let W, T;
        const {type: V, props: F, shapeFlag: z, transition: Y, dirs: re} = d;
        if (W = d.el = i(d.type, x, F && F.is, F),
        z & 8 ? u(W, d.children) : z & 16 && j(d.children, W, null, E, C, x && V !== "foreignObject", B, I),
        re && Ht(d, null, E, "created"),
        se(W, d, d.scopeId, B, E),
        F) {
            for (const pe in F)
                pe !== "value" && !Jn(pe) && s(W, pe, null, F[pe], x, d.children, E, C, Be);
            "value"in F && s(W, "value", null, F.value),
            (T = F.onVnodeBeforeMount) && ht(T, E, d)
        }
        re && Ht(d, null, E, "beforeMount");
        const me = (!C || C && !C.pendingBranch) && Y && !Y.persisted;
        me && Y.beforeEnter(W),
        o(W, h, _),
        ((T = F && F.onVnodeMounted) || me || re) && Xe(()=>{
            T && ht(T, E, d),
            me && Y.enter(W),
            re && Ht(d, null, E, "mounted")
        }
        , C)
    }
      , se = (d,h,_,E,C)=>{
        if (_ && g(d, _),
        E)
            for (let x = 0; x < E.length; x++)
                g(d, E[x]);
        if (C) {
            let x = C.subTree;
            if (h === x) {
                const B = C.vnode;
                se(d, B, B.scopeId, B.slotScopeIds, C.parent)
            }
        }
    }
      , j = (d,h,_,E,C,x,B,I,W=0)=>{
        for (let T = W; T < d.length; T++) {
            const V = d[T] = I ? Rt(d[T]) : mt(d[T]);
            S(null, V, h, _, E, C, x, B, I)
        }
    }
      , oe = (d,h,_,E,C,x,B)=>{
        const I = h.el = d.el;
        let {patchFlag: W, dynamicChildren: T, dirs: V} = h;
        W |= d.patchFlag & 16;
        const F = d.props || Ae
          , z = h.props || Ae;
        let Y;
        _ && jt(_, !1),
        (Y = z.onVnodeBeforeUpdate) && ht(Y, _, h, d),
        V && Ht(h, d, _, "beforeUpdate"),
        _ && jt(_, !0);
        const re = C && h.type !== "foreignObject";
        if (T ? G(d.dynamicChildren, T, I, _, E, re, x) : B || R(d, h, I, null, _, E, re, x, !1),
        W > 0) {
            if (W & 16)
                de(I, h, F, z, _, E, C);
            else if (W & 2 && F.class !== z.class && s(I, "class", null, z.class, C),
            W & 4 && s(I, "style", F.style, z.style, C),
            W & 8) {
                const me = h.dynamicProps;
                for (let pe = 0; pe < me.length; pe++) {
                    const ye = me[pe]
                      , et = F[ye]
                      , nt = z[ye];
                    (nt !== et || ye === "value") && s(I, ye, et, nt, C, d.children, _, E, Be)
                }
            }
            W & 1 && d.children !== h.children && u(I, h.children)
        } else
            !B && T == null && de(I, h, F, z, _, E, C);
        ((Y = z.onVnodeUpdated) || V) && Xe(()=>{
            Y && ht(Y, _, h, d),
            V && Ht(h, d, _, "updated")
        }
        , E)
    }
      , G = (d,h,_,E,C,x,B)=>{
        for (let I = 0; I < h.length; I++) {
            const W = d[I]
              , T = h[I]
              , V = W.el && (W.type === Fe || !Vt(W, T) || W.shapeFlag & 70) ? f(W.el) : _;
            S(W, T, V, null, E, C, x, B, !0)
        }
    }
      , de = (d,h,_,E,C,x,B)=>{
        if (_ !== E) {
            if (_ !== Ae)
                for (const I in _)
                    !Jn(I) && !(I in E) && s(d, I, _[I], null, B, h.children, C, x, Be);
            for (const I in E) {
                if (Jn(I))
                    continue;
                const W = E[I]
                  , T = _[I];
                W !== T && I !== "value" && s(d, I, T, W, B, h.children, C, x, Be)
            }
            "value"in E && s(d, "value", _.value, E.value)
        }
    }
      , H = (d,h,_,E,C,x,B,I,W)=>{
        const T = h.el = d ? d.el : l("")
          , V = h.anchor = d ? d.anchor : l("");
        let {patchFlag: F, dynamicChildren: z, slotScopeIds: Y} = h;
        Y && (I = I ? I.concat(Y) : Y),
        d == null ? (o(T, _, E),
        o(V, _, E),
        j(h.children, _, V, C, x, B, I, W)) : F > 0 && F & 64 && z && d.dynamicChildren ? (G(d.dynamicChildren, z, _, C, x, B, I),
        (h.key != null || C && h === C.subTree) && Or(d, h, !0)) : R(d, h, _, V, C, x, B, I, W)
    }
      , ie = (d,h,_,E,C,x,B,I,W)=>{
        h.slotScopeIds = I,
        d == null ? h.shapeFlag & 512 ? C.ctx.activate(h, _, E, B, W) : We(h, _, E, C, x, B, W) : Qe(d, h, W)
    }
      , We = (d,h,_,E,C,x,B)=>{
        const I = d.component = ga(d, E, C);
        if (Dn(d) && (I.ctx.renderer = M),
        va(I),
        I.asyncDep) {
            if (C && C.registerDep(I, ve),
            !d.el) {
                const W = I.subTree = Ee(st);
                L(null, W, h, _)
            }
            return
        }
        ve(I, d, h, _, C, x, B)
    }
      , Qe = (d,h,_)=>{
        const E = h.component = d.component;
        if (kc(d, h, _))
            if (E.asyncDep && !E.asyncResolved) {
                fe(E, h, _);
                return
            } else
                E.next = h,
                Ec(E.update),
                E.update();
        else
            h.el = d.el,
            E.vnode = h
    }
      , ve = (d,h,_,E,C,x,B)=>{
        const I = ()=>{
            if (d.isMounted) {
                let {next: V, bu: F, u: z, parent: Y, vnode: re} = d, me = V, pe;
                jt(d, !1),
                V ? (V.el = re.el,
                fe(d, V, B)) : V = re,
                F && ko(F),
                (pe = V.props && V.props.onVnodeBeforeUpdate) && ht(pe, Y, V, re),
                jt(d, !0);
                const ye = So(d)
                  , et = d.subTree;
                d.subTree = ye,
                S(et, ye, f(et.el), A(et), d, C, x),
                V.el = ye.el,
                me === null && Sc(d, ye.el),
                z && Xe(z, C),
                (pe = V.props && V.props.onVnodeUpdated) && Xe(()=>ht(pe, Y, V, re), C)
            } else {
                let V;
                const {el: F, props: z} = h
                  , {bm: Y, m: re, parent: me} = d
                  , pe = Cn(h);
                if (jt(d, !1),
                Y && ko(Y),
                !pe && (V = z && z.onVnodeBeforeMount) && ht(V, me, h),
                jt(d, !0),
                F && ue) {
                    const ye = ()=>{
                        d.subTree = So(d),
                        ue(F, d.subTree, d, C, null)
                    }
                    ;
                    pe ? h.type.__asyncLoader().then(()=>!d.isUnmounted && ye()) : ye()
                } else {
                    const ye = d.subTree = So(d);
                    S(null, ye, _, E, d, C, x),
                    h.el = ye.el
                }
                if (re && Xe(re, C),
                !pe && (V = z && z.onVnodeMounted)) {
                    const ye = h;
                    Xe(()=>ht(V, me, ye), C)
                }
                (h.shapeFlag & 256 || me && Cn(me.vnode) && me.vnode.shapeFlag & 256) && d.a && Xe(d.a, C),
                d.isMounted = !0,
                h = _ = E = null
            }
        }
          , W = d.effect = new mr(I,()=>vo(T),d.scope)
          , T = d.update = ()=>W.run();
        T.id = d.uid,
        jt(d, !0),
        T()
    }
      , fe = (d,h,_)=>{
        h.component = d;
        const E = d.vnode.props;
        d.vnode = h,
        d.next = null,
        ta(d, h.props, E, _),
        ra(d, h.children, _),
        dn(),
        Xr(),
        hn()
    }
      , R = (d,h,_,E,C,x,B,I,W=!1)=>{
        const T = d && d.children
          , V = d ? d.shapeFlag : 0
          , F = h.children
          , {patchFlag: z, shapeFlag: Y} = h;
        if (z > 0) {
            if (z & 128) {
                Oe(T, F, _, E, C, x, B, I, W);
                return
            } else if (z & 256) {
                le(T, F, _, E, C, x, B, I, W);
                return
            }
        }
        Y & 8 ? (V & 16 && Be(T, C, x),
        F !== T && u(_, F)) : V & 16 ? Y & 16 ? Oe(T, F, _, E, C, x, B, I, W) : Be(T, C, x, !0) : (V & 8 && u(_, ""),
        Y & 16 && j(F, _, E, C, x, B, I, W))
    }
      , le = (d,h,_,E,C,x,B,I,W)=>{
        d = d || tn,
        h = h || tn;
        const T = d.length
          , V = h.length
          , F = Math.min(T, V);
        let z;
        for (z = 0; z < F; z++) {
            const Y = h[z] = W ? Rt(h[z]) : mt(h[z]);
            S(d[z], Y, _, null, C, x, B, I, W)
        }
        T > V ? Be(d, C, x, !0, !1, F) : j(h, _, E, C, x, B, I, W, F)
    }
      , Oe = (d,h,_,E,C,x,B,I,W)=>{
        let T = 0;
        const V = h.length;
        let F = d.length - 1
          , z = V - 1;
        for (; T <= F && T <= z; ) {
            const Y = d[T]
              , re = h[T] = W ? Rt(h[T]) : mt(h[T]);
            if (Vt(Y, re))
                S(Y, re, _, null, C, x, B, I, W);
            else
                break;
            T++
        }
        for (; T <= F && T <= z; ) {
            const Y = d[F]
              , re = h[z] = W ? Rt(h[z]) : mt(h[z]);
            if (Vt(Y, re))
                S(Y, re, _, null, C, x, B, I, W);
            else
                break;
            F--,
            z--
        }
        if (T > F) {
            if (T <= z) {
                const Y = z + 1
                  , re = Y < V ? h[Y].el : E;
                for (; T <= z; )
                    S(null, h[T] = W ? Rt(h[T]) : mt(h[T]), _, re, C, x, B, I, W),
                    T++
            }
        } else if (T > z)
            for (; T <= F; )
                Re(d[T], C, x, !0),
                T++;
        else {
            const Y = T
              , re = T
              , me = new Map;
            for (T = re; T <= z; T++) {
                const m = h[T] = W ? Rt(h[T]) : mt(h[T]);
                m.key != null && me.set(m.key, T)
            }
            let pe, ye = 0;
            const et = z - re + 1;
            let nt = !1
              , jn = 0;
            const Dt = new Array(et);
            for (T = 0; T < et; T++)
                Dt[T] = 0;
            for (T = Y; T <= F; T++) {
                const m = d[T];
                if (ye >= et) {
                    Re(m, C, x, !0);
                    continue
                }
                let v;
                if (m.key != null)
                    v = me.get(m.key);
                else
                    for (pe = re; pe <= z; pe++)
                        if (Dt[pe - re] === 0 && Vt(m, h[pe])) {
                            v = pe;
                            break
                        }
                v === void 0 ? Re(m, C, x, !0) : (Dt[v - re] = T + 1,
                v >= jn ? jn = v : nt = !0,
                S(m, h[v], _, null, C, x, B, I, W),
                ye++)
            }
            const vn = nt ? la(Dt) : tn;
            for (pe = vn.length - 1,
            T = et - 1; T >= 0; T--) {
                const m = re + T
                  , v = h[m]
                  , b = m + 1 < V ? h[m + 1].el : E;
                Dt[T] === 0 ? S(null, v, _, b, C, x, B, I, W) : nt && (pe < 0 || T !== vn[pe] ? ke(v, _, b, 2) : pe--)
            }
        }
    }
      , ke = (d,h,_,E,C=null)=>{
        const {el: x, type: B, transition: I, children: W, shapeFlag: T} = d;
        if (T & 6) {
            ke(d.component.subTree, h, _, E);
            return
        }
        if (T & 128) {
            d.suspense.move(h, _, E);
            return
        }
        if (T & 64) {
            B.move(d, h, _, M);
            return
        }
        if (B === Fe) {
            o(x, h, _);
            for (let F = 0; F < W.length; F++)
                ke(W[F], h, _, E);
            o(d.anchor, h, _);
            return
        }
        if (B === Zn) {
            k(d, h, _);
            return
        }
        if (E !== 2 && T & 1 && I)
            if (E === 0)
                I.beforeEnter(x),
                o(x, h, _),
                Xe(()=>I.enter(x), C);
            else {
                const {leave: F, delayLeave: z, afterLeave: Y} = I
                  , re = ()=>o(x, h, _)
                  , me = ()=>{
                    F(x, ()=>{
                        re(),
                        Y && Y()
                    }
                    )
                }
                ;
                z ? z(x, re, me) : me()
            }
        else
            o(x, h, _)
    }
      , Re = (d,h,_,E=!1,C=!1)=>{
        const {type: x, props: B, ref: I, children: W, dynamicChildren: T, shapeFlag: V, patchFlag: F, dirs: z} = d;
        if (I != null && Xo(I, null, _, d, !0),
        V & 256) {
            h.ctx.deactivate(d);
            return
        }
        const Y = V & 1 && z
          , re = !Cn(d);
        let me;
        if (re && (me = B && B.onVnodeBeforeUnmount) && ht(me, h, d),
        V & 6)
            bt(d.component, _, E);
        else {
            if (V & 128) {
                d.suspense.unmount(_, E);
                return
            }
            Y && Ht(d, null, h, "beforeUnmount"),
            V & 64 ? d.type.remove(d, h, _, C, M, E) : T && (x !== Fe || F > 0 && F & 64) ? Be(T, h, _, !1, !0) : (x === Fe && F & 384 || !C && V & 16) && Be(W, h, _),
            E && tt(d)
        }
        (re && (me = B && B.onVnodeUnmounted) || Y) && Xe(()=>{
            me && ht(me, h, d),
            Y && Ht(d, null, h, "unmounted")
        }
        , _)
    }
      , tt = d=>{
        const {type: h, el: _, anchor: E, transition: C} = d;
        if (h === Fe) {
            _t(_, E);
            return
        }
        if (h === Zn) {
            P(d);
            return
        }
        const x = ()=>{
            r(_),
            C && !C.persisted && C.afterLeave && C.afterLeave()
        }
        ;
        if (d.shapeFlag & 1 && C && !C.persisted) {
            const {leave: B, delayLeave: I} = C
              , W = ()=>B(_, x);
            I ? I(d.el, x, W) : W()
        } else
            x()
    }
      , _t = (d,h)=>{
        let _;
        for (; d !== h; )
            _ = p(d),
            r(d),
            d = _;
        r(h)
    }
      , bt = (d,h,_)=>{
        const {bum: E, scope: C, update: x, subTree: B, um: I} = d;
        E && ko(E),
        C.stop(),
        x && (x.active = !1,
        Re(B, d, h, _)),
        I && Xe(I, h),
        Xe(()=>{
            d.isUnmounted = !0
        }
        , h),
        h && h.pendingBranch && !h.isUnmounted && d.asyncDep && !d.asyncResolved && d.suspenseId === h.pendingId && (h.deps--,
        h.deps === 0 && h.resolve())
    }
      , Be = (d,h,_,E=!1,C=!1,x=0)=>{
        for (let B = x; B < d.length; B++)
            Re(d[B], h, _, E, C)
    }
      , A = d=>d.shapeFlag & 6 ? A(d.component.subTree) : d.shapeFlag & 128 ? d.suspense.next() : p(d.anchor || d.el)
      , N = (d,h,_)=>{
        d == null ? h._vnode && Re(h._vnode, null, null, !0) : S(h._vnode || null, d, h, null, null, null, _),
        Xr(),
        mi(),
        h._vnode = d
    }
      , M = {
        p: S,
        um: Re,
        m: ke,
        r: tt,
        mt: We,
        mc: j,
        pc: R,
        pbc: G,
        n: A,
        o: e
    };
    let q, ue;
    return t && ([q,ue] = t(M)),
    {
        render: N,
        hydrate: q,
        createApp: Zc(N, q)
    }
}
function jt({effect: e, update: t}, n) {
    e.allowRecurse = t.allowRecurse = n
}
function Or(e, t, n=!1) {
    const o = e.children
      , r = t.children;
    if (X(o) && X(r))
        for (let s = 0; s < o.length; s++) {
            const i = o[s];
            let l = r[s];
            l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = r[s] = Rt(r[s]),
            l.el = i.el),
            n || Or(i, l)),
            l.type === yo && (l.el = i.el)
        }
}
function la(e) {
    const t = e.slice()
      , n = [0];
    let o, r, s, i, l;
    const c = e.length;
    for (o = 0; o < c; o++) {
        const a = e[o];
        if (a !== 0) {
            if (r = n[n.length - 1],
            e[r] < a) {
                t[o] = r,
                n.push(o);
                continue
            }
            for (s = 0,
            i = n.length - 1; s < i; )
                l = s + i >> 1,
                e[n[l]] < a ? s = l + 1 : i = l;
            a < e[n[s]] && (s > 0 && (t[o] = n[s - 1]),
            n[s] = o)
        }
    }
    for (s = n.length,
    i = n[s - 1]; s-- > 0; )
        n[s] = i,
        i = t[i];
    return n
}
const ca = e=>e.__isTeleport
  , Pn = e=>e && (e.disabled || e.disabled === "")
  , ls = e=>typeof SVGElement < "u" && e instanceof SVGElement
  , Jo = (e,t)=>{
    const n = e && e.to;
    return Ie(n) ? t ? t(n) : null : n
}
  , aa = {
    __isTeleport: !0,
    process(e, t, n, o, r, s, i, l, c, a) {
        const {mc: u, pc: f, pbc: p, o: {insert: g, querySelector: w, createText: S, createComment: O}} = a
          , L = Pn(t.props);
        let {shapeFlag: y, children: k, dynamicChildren: P} = t;
        if (e == null) {
            const D = t.el = S("")
              , ee = t.anchor = S("");
            g(D, n, o),
            g(ee, n, o);
            const se = t.target = Jo(t.props, w)
              , j = t.targetAnchor = S("");
            se && (g(j, se),
            i = i || ls(se));
            const oe = (G,de)=>{
                y & 16 && u(k, G, de, r, s, i, l, c)
            }
            ;
            L ? oe(n, ee) : se && oe(se, j)
        } else {
            t.el = e.el;
            const D = t.anchor = e.anchor
              , ee = t.target = e.target
              , se = t.targetAnchor = e.targetAnchor
              , j = Pn(e.props)
              , oe = j ? n : ee
              , G = j ? D : se;
            if (i = i || ls(ee),
            P ? (p(e.dynamicChildren, P, oe, r, s, i, l),
            Or(e, t, !0)) : c || f(e, t, oe, G, r, s, i, l, !1),
            L)
                j || Yn(t, n, D, a, 1);
            else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
                const de = t.target = Jo(t.props, w);
                de && Yn(t, de, null, a, 0)
            } else
                j && Yn(t, ee, se, a, 1)
        }
        Mi(t)
    },
    remove(e, t, n, o, {um: r, o: {remove: s}}, i) {
        const {shapeFlag: l, children: c, anchor: a, targetAnchor: u, target: f, props: p} = e;
        if (f && s(u),
        (i || !Pn(p)) && (s(a),
        l & 16))
            for (let g = 0; g < c.length; g++) {
                const w = c[g];
                r(w, t, n, !0, !!w.dynamicChildren)
            }
    },
    move: Yn,
    hydrate: ua
};
function Yn(e, t, n, {o: {insert: o}, m: r}, s=2) {
    s === 0 && o(e.targetAnchor, t, n);
    const {el: i, anchor: l, shapeFlag: c, children: a, props: u} = e
      , f = s === 2;
    if (f && o(i, t, n),
    (!f || Pn(u)) && c & 16)
        for (let p = 0; p < a.length; p++)
            r(a[p], t, n, 2);
    f && o(l, t, n)
}
function ua(e, t, n, o, r, s, {o: {nextSibling: i, parentNode: l, querySelector: c}}, a) {
    const u = t.target = Jo(t.props, c);
    if (u) {
        const f = u._lpa || u.firstChild;
        if (t.shapeFlag & 16)
            if (Pn(t.props))
                t.anchor = a(i(e), t, l(e), n, o, r, s),
                t.targetAnchor = f;
            else {
                t.anchor = i(e);
                let p = f;
                for (; p; )
                    if (p = i(p),
                    p && p.nodeType === 8 && p.data === "teleport anchor") {
                        t.targetAnchor = p,
                        u._lpa = t.targetAnchor && i(t.targetAnchor);
                        break
                    }
                a(f, t, u, n, o, r, s)
            }
        Mi(t)
    }
    return t.anchor && i(t.anchor)
}
const uh = aa;
function Mi(e) {
    const t = e.ctx;
    if (t && t.ut) {
        let n = e.children[0].el;
        for (; n !== e.targetAnchor; )
            n.nodeType === 1 && n.setAttribute("data-v-owner", t.uid),
            n = n.nextSibling;
        t.ut()
    }
}
const Fe = Symbol.for("v-fgt")
  , yo = Symbol.for("v-txt")
  , st = Symbol.for("v-cmt")
  , Zn = Symbol.for("v-stc")
  , Tn = [];
let ut = null;
function Q(e=!1) {
    Tn.push(ut = e ? null : [])
}
function fa() {
    Tn.pop(),
    ut = Tn[Tn.length - 1] || null
}
let Bn = 1;
function cs(e) {
    Bn += e
}
function Wi(e) {
    return e.dynamicChildren = Bn > 0 ? ut || tn : null,
    fa(),
    Bn > 0 && ut && ut.push(e),
    e
}
function be(e, t, n, o, r, s) {
    return Wi(it(e, t, n, o, r, s, !0))
}
function ge(e, t, n, o, r) {
    return Wi(Ee(e, t, n, o, r, !0))
}
function lo(e) {
    return e ? e.__v_isVNode === !0 : !1
}
function Vt(e, t) {
    return e.type === t.type && e.key === t.key
}
const wo = "__vInternal"
  , Bi = ({key: e})=>e ?? null
  , eo = ({ref: e, ref_key: t, ref_for: n})=>(typeof e == "number" && (e = "" + e),
e != null ? Ie(e) || je(e) || ne(e) ? {
    i: qe,
    r: e,
    k: t,
    f: !!n
} : e : null);
function it(e, t=null, n=null, o=0, r=null, s=e === Fe ? 0 : 1, i=!1, l=!1) {
    const c = {
        __v_isVNode: !0,
        __v_skip: !0,
        type: e,
        props: t,
        key: t && Bi(t),
        ref: t && eo(t),
        scopeId: _i,
        slotScopeIds: null,
        children: n,
        component: null,
        suspense: null,
        ssContent: null,
        ssFallback: null,
        dirs: null,
        transition: null,
        el: null,
        anchor: null,
        target: null,
        targetAnchor: null,
        staticCount: 0,
        shapeFlag: s,
        patchFlag: o,
        dynamicProps: r,
        dynamicChildren: null,
        appContext: null,
        ctx: qe
    };
    return l ? (Rr(c, n),
    s & 128 && e.normalize(c)) : n && (c.shapeFlag |= Ie(n) ? 8 : 16),
    Bn > 0 && !i && ut && (c.patchFlag > 0 || s & 6) && c.patchFlag !== 32 && ut.push(c),
    c
}
const Ee = pa;
function pa(e, t=null, n=null, o=0, r=null, s=!1) {
    if ((!e || e === Pi) && (e = st),
    lo(e)) {
        const l = Nt(e, t, !0);
        return n && Rr(l, n),
        Bn > 0 && !s && ut && (l.shapeFlag & 6 ? ut[ut.indexOf(e)] = l : ut.push(l)),
        l.patchFlag |= -2,
        l
    }
    if (Ea(e) && (e = e.__vccOpts),
    t) {
        t = da(t);
        let {class: l, style: c} = t;
        l && !Ie(l) && (t.class = Pe(l)),
        Te(c) && (ii(c) && !X(c) && (c = Me({}, c)),
        t.style = Wt(c))
    }
    const i = Ie(e) ? 1 : Oc(e) ? 128 : ca(e) ? 64 : Te(e) ? 4 : ne(e) ? 2 : 0;
    return it(e, t, n, o, r, i, s, !0)
}
function da(e) {
    return e ? ii(e) || wo in e ? Me({}, e) : e : null
}
function Nt(e, t, n=!1) {
    const {props: o, ref: r, patchFlag: s, children: i} = e
      , l = t ? De(o || {}, t) : o;
    return {
        __v_isVNode: !0,
        __v_skip: !0,
        type: e.type,
        props: l,
        key: l && Bi(l),
        ref: t && t.ref ? n && r ? X(r) ? r.concat(eo(t)) : [r, eo(t)] : eo(t) : r,
        scopeId: e.scopeId,
        slotScopeIds: e.slotScopeIds,
        children: i,
        target: e.target,
        targetAnchor: e.targetAnchor,
        staticCount: e.staticCount,
        shapeFlag: e.shapeFlag,
        patchFlag: t && e.type !== Fe ? s === -1 ? 16 : s | 16 : s,
        dynamicProps: e.dynamicProps,
        dynamicChildren: e.dynamicChildren,
        appContext: e.appContext,
        dirs: e.dirs,
        transition: e.transition,
        component: e.component,
        suspense: e.suspense,
        ssContent: e.ssContent && Nt(e.ssContent),
        ssFallback: e.ssFallback && Nt(e.ssFallback),
        el: e.el,
        anchor: e.anchor,
        ctx: e.ctx,
        ce: e.ce
    }
}
function xn(e=" ", t=0) {
    return Ee(yo, null, e, t)
}
function $e(e="", t=!1) {
    return t ? (Q(),
    ge(st, null, e)) : Ee(st, null, e)
}
function mt(e) {
    return e == null || typeof e == "boolean" ? Ee(st) : X(e) ? Ee(Fe, null, e.slice()) : typeof e == "object" ? Rt(e) : Ee(yo, null, String(e))
}
function Rt(e) {
    return e.el === null && e.patchFlag !== -1 || e.memo ? e : Nt(e)
}
function Rr(e, t) {
    let n = 0;
    const {shapeFlag: o} = e;
    if (t == null)
        t = null;
    else if (X(t))
        n = 16;
    else if (typeof t == "object")
        if (o & 65) {
            const r = t.default;
            r && (r._c && (r._d = !1),
            Rr(e, r()),
            r._c && (r._d = !0));
            return
        } else {
            n = 32;
            const r = t._;
            !r && !(wo in t) ? t._ctx = qe : r === 3 && qe && (qe.slots._ === 1 ? t._ = 1 : (t._ = 2,
            e.patchFlag |= 1024))
        }
    else
        ne(t) ? (t = {
            default: t,
            _ctx: qe
        },
        n = 32) : (t = String(t),
        o & 64 ? (n = 16,
        t = [xn(t)]) : n = 8);
    e.children = t,
    e.shapeFlag |= n
}
function De(...e) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
        const o = e[n];
        for (const r in o)
            if (r === "class")
                t.class !== o.class && (t.class = Pe([t.class, o.class]));
            else if (r === "style")
                t.style = Wt([t.style, o.style]);
            else if (uo(r)) {
                const s = t[r]
                  , i = o[r];
                i && s !== i && !(X(s) && s.includes(i)) && (t[r] = s ? [].concat(s, i) : i)
            } else
                r !== "" && (t[r] = o[r])
    }
    return t
}
function ht(e, t, n, o=null) {
    rt(e, t, 7, [n, o])
}
const ha = Si();
let ma = 0;
function ga(e, t, n) {
    const o = e.type
      , r = (t ? t.appContext : e.appContext) || ha
      , s = {
        uid: ma++,
        vnode: e,
        type: o,
        parent: t,
        appContext: r,
        root: null,
        next: null,
        subTree: null,
        effect: null,
        update: null,
        scope: new Bl(!0),
        render: null,
        proxy: null,
        exposed: null,
        exposeProxy: null,
        withProxy: null,
        provides: t ? t.provides : Object.create(r.provides),
        accessCache: null,
        renderCache: [],
        components: null,
        directives: null,
        propsOptions: Ri(o, r),
        emitsOptions: vi(o, r),
        emit: null,
        emitted: null,
        propsDefaults: Ae,
        inheritAttrs: o.inheritAttrs,
        ctx: Ae,
        data: Ae,
        props: Ae,
        attrs: Ae,
        slots: Ae,
        refs: Ae,
        setupState: Ae,
        setupContext: null,
        attrsProxy: null,
        slotsProxy: null,
        suspense: n,
        suspenseId: n ? n.pendingId : 0,
        asyncDep: null,
        asyncResolved: !1,
        isMounted: !1,
        isUnmounted: !1,
        isDeactivated: !1,
        bc: null,
        c: null,
        bm: null,
        m: null,
        bu: null,
        u: null,
        um: null,
        bum: null,
        da: null,
        a: null,
        rtg: null,
        rtc: null,
        ec: null,
        sp: null
    };
    return s.ctx = {
        _: s
    },
    s.root = t ? t.root : s,
    s.emit = Pc.bind(null, s),
    e.ce && e.ce(s),
    s
}
let Ne = null;
const Ir = ()=>Ne || qe;
let Lr, Zt, as = "__VUE_INSTANCE_SETTERS__";
(Zt = Do()[as]) || (Zt = Do()[as] = []),
Zt.push(e=>Ne = e),
Lr = e=>{
    Zt.length > 1 ? Zt.forEach(t=>t(e)) : Zt[0](e)
}
;
const cn = e=>{
    Lr(e),
    e.scope.on()
}
  , Jt = ()=>{
    Ne && Ne.scope.off(),
    Lr(null)
}
;
function Ni(e) {
    return e.vnode.shapeFlag & 4
}
let an = !1;
function va(e, t=!1) {
    an = t;
    const {props: n, children: o} = e.vnode
      , r = Ni(e);
    ea(e, n, r, t),
    oa(e, o);
    const s = r ? _a(e, t) : void 0;
    return an = !1,
    s
}
function _a(e, t) {
    const n = e.type;
    e.accessCache = Object.create(null),
    e.proxy = li(new Proxy(e.ctx,zc));
    const {setup: o} = n;
    if (o) {
        const r = e.setupContext = o.length > 1 ? ya(e) : null;
        cn(e),
        dn();
        const s = Mt(o, e, 0, [e.props, r]);
        if (hn(),
        Jt(),
        Us(s)) {
            if (s.then(Jt, Jt),
            t)
                return s.then(i=>{
                    us(e, i, t)
                }
                ).catch(i=>{
                    Fn(i, e, 0)
                }
                );
            e.asyncDep = s
        } else
            us(e, s, t)
    } else
        Fi(e, t)
}
function us(e, t, n) {
    ne(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : Te(t) && (e.setupState = fi(t)),
    Fi(e, n)
}
let fs;
function Fi(e, t, n) {
    const o = e.type;
    if (!e.render) {
        if (!t && fs && !o.render) {
            const r = o.template || kr(e).template;
            if (r) {
                const {isCustomElement: s, compilerOptions: i} = e.appContext.config
                  , {delimiters: l, compilerOptions: c} = o
                  , a = Me(Me({
                    isCustomElement: s,
                    delimiters: l
                }, i), c);
                o.render = fs(r, a)
            }
        }
        e.render = o.render || ft
    }
    cn(e),
    dn(),
    Kc(e),
    hn(),
    Jt()
}
function ba(e) {
    return e.attrsProxy || (e.attrsProxy = new Proxy(e.attrs,{
        get(t, n) {
            return Ge(e, "get", "$attrs"),
            t[n]
        }
    }))
}
function ya(e) {
    const t = n=>{
        e.exposed = n || {}
    }
    ;
    return {
        get attrs() {
            return ba(e)
        },
        slots: e.slots,
        emit: e.emit,
        expose: t
    }
}
function Eo(e) {
    if (e.exposed)
        return e.exposeProxy || (e.exposeProxy = new Proxy(fi(li(e.exposed)),{
            get(t, n) {
                if (n in t)
                    return t[n];
                if (n in An)
                    return An[n](e)
            },
            has(t, n) {
                return n in t || n in An
            }
        }))
}
function wa(e, t=!0) {
    return ne(e) ? e.displayName || e.name : e.name || t && e.__name
}
function Ea(e) {
    return ne(e) && "__vccOpts"in e
}
const J = (e,t)=>bc(e, t, an);
function $r(e, t, n) {
    const o = arguments.length;
    return o === 2 ? Te(t) && !X(t) ? lo(t) ? Ee(e, null, [t]) : Ee(e, t) : Ee(e, null, t) : (o > 3 ? n = Array.prototype.slice.call(arguments, 2) : o === 3 && lo(n) && (n = [n]),
    Ee(e, t, n))
}
const Ca = Symbol.for("v-scx")
  , Aa = ()=>Ue(Ca)
  , Pa = "3.3.4"
  , Ta = "http://www.w3.org/2000/svg"
  , zt = typeof document < "u" ? document : null
  , ps = zt && zt.createElement("template")
  , xa = {
    insert: (e,t,n)=>{
        t.insertBefore(e, n || null)
    }
    ,
    remove: e=>{
        const t = e.parentNode;
        t && t.removeChild(e)
    }
    ,
    createElement: (e,t,n,o)=>{
        const r = t ? zt.createElementNS(Ta, e) : zt.createElement(e, n ? {
            is: n
        } : void 0);
        return e === "select" && o && o.multiple != null && r.setAttribute("multiple", o.multiple),
        r
    }
    ,
    createText: e=>zt.createTextNode(e),
    createComment: e=>zt.createComment(e),
    setText: (e,t)=>{
        e.nodeValue = t
    }
    ,
    setElementText: (e,t)=>{
        e.textContent = t
    }
    ,
    parentNode: e=>e.parentNode,
    nextSibling: e=>e.nextSibling,
    querySelector: e=>zt.querySelector(e),
    setScopeId(e, t) {
        e.setAttribute(t, "")
    },
    insertStaticContent(e, t, n, o, r, s) {
        const i = n ? n.previousSibling : t.lastChild;
        if (r && (r === s || r.nextSibling))
            for (; t.insertBefore(r.cloneNode(!0), n),
            !(r === s || !(r = r.nextSibling)); )
                ;
        else {
            ps.innerHTML = o ? `<svg>${e}</svg>` : e;
            const l = ps.content;
            if (o) {
                const c = l.firstChild;
                for (; c.firstChild; )
                    l.appendChild(c.firstChild);
                l.removeChild(c)
            }
            t.insertBefore(l, n)
        }
        return [i ? i.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild]
    }
};
function ka(e, t, n) {
    const o = e._vtc;
    o && (t = (t ? [t, ...o] : [...o]).join(" ")),
    t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t
}
function Sa(e, t, n) {
    const o = e.style
      , r = Ie(n);
    if (n && !r) {
        if (t && !Ie(t))
            for (const s in t)
                n[s] == null && Go(o, s, "");
        for (const s in n)
            Go(o, s, n[s])
    } else {
        const s = o.display;
        r ? t !== n && (o.cssText = n) : t && e.removeAttribute("style"),
        "_vod"in e && (o.display = s)
    }
}
const ds = /\s*!important$/;
function Go(e, t, n) {
    if (X(n))
        n.forEach(o=>Go(e, t, o));
    else if (n == null && (n = ""),
    t.startsWith("--"))
        e.setProperty(t, n);
    else {
        const o = Oa(e, t);
        ds.test(n) ? e.setProperty(pn(o), n.replace(ds, ""), "important") : e[o] = n
    }
}
const hs = ["Webkit", "Moz", "ms"]
  , Lo = {};
function Oa(e, t) {
    const n = Lo[t];
    if (n)
        return n;
    let o = vt(t);
    if (o !== "filter" && o in e)
        return Lo[t] = o;
    o = ho(o);
    for (let r = 0; r < hs.length; r++) {
        const s = hs[r] + o;
        if (s in e)
            return Lo[t] = s
    }
    return t
}
const ms = "http://www.w3.org/1999/xlink";
function Ra(e, t, n, o, r) {
    if (o && t.startsWith("xlink:"))
        n == null ? e.removeAttributeNS(ms, t.slice(6, t.length)) : e.setAttributeNS(ms, t, n);
    else {
        const s = Wl(t);
        n == null || s && !Ks(n) ? e.removeAttribute(t) : e.setAttribute(t, s ? "" : n)
    }
}
function Ia(e, t, n, o, r, s, i) {
    if (t === "innerHTML" || t === "textContent") {
        o && i(o, r, s),
        e[t] = n ?? "";
        return
    }
    const l = e.tagName;
    if (t === "value" && l !== "PROGRESS" && !l.includes("-")) {
        e._value = n;
        const a = l === "OPTION" ? e.getAttribute("value") : e.value
          , u = n ?? "";
        a !== u && (e.value = u),
        n == null && e.removeAttribute(t);
        return
    }
    let c = !1;
    if (n === "" || n == null) {
        const a = typeof e[t];
        a === "boolean" ? n = Ks(n) : n == null && a === "string" ? (n = "",
        c = !0) : a === "number" && (n = 0,
        c = !0)
    }
    try {
        e[t] = n
    } catch {}
    c && e.removeAttribute(t)
}
function La(e, t, n, o) {
    e.addEventListener(t, n, o)
}
function $a(e, t, n, o) {
    e.removeEventListener(t, n, o)
}
function Ma(e, t, n, o, r=null) {
    const s = e._vei || (e._vei = {})
      , i = s[t];
    if (o && i)
        i.value = o;
    else {
        const [l,c] = Wa(t);
        if (o) {
            const a = s[t] = Fa(o, r);
            La(e, l, a, c)
        } else
            i && ($a(e, l, i, c),
            s[t] = void 0)
    }
}
const gs = /(?:Once|Passive|Capture)$/;
function Wa(e) {
    let t;
    if (gs.test(e)) {
        t = {};
        let o;
        for (; o = e.match(gs); )
            e = e.slice(0, e.length - o[0].length),
            t[o[0].toLowerCase()] = !0
    }
    return [e[2] === ":" ? e.slice(3) : pn(e.slice(2)), t]
}
let $o = 0;
const Ba = Promise.resolve()
  , Na = ()=>$o || (Ba.then(()=>$o = 0),
$o = Date.now());
function Fa(e, t) {
    const n = o=>{
        if (!o._vts)
            o._vts = Date.now();
        else if (o._vts <= n.attached)
            return;
        rt(Da(o, n.value), t, 5, [o])
    }
    ;
    return n.value = e,
    n.attached = Na(),
    n
}
function Da(e, t) {
    if (X(t)) {
        const n = e.stopImmediatePropagation;
        return e.stopImmediatePropagation = ()=>{
            n.call(e),
            e._stopped = !0
        }
        ,
        t.map(o=>r=>!r._stopped && o && o(r))
    } else
        return t
}
const vs = /^on[a-z]/
  , Ha = (e,t,n,o,r=!1,s,i,l,c)=>{
    t === "class" ? ka(e, o, r) : t === "style" ? Sa(e, n, o) : uo(t) ? ar(t) || Ma(e, t, n, o, i) : (t[0] === "." ? (t = t.slice(1),
    !0) : t[0] === "^" ? (t = t.slice(1),
    !1) : ja(e, t, o, r)) ? Ia(e, t, o, s, i, l, c) : (t === "true-value" ? e._trueValue = o : t === "false-value" && (e._falseValue = o),
    Ra(e, t, o, r))
}
;
function ja(e, t, n, o) {
    return o ? !!(t === "innerHTML" || t === "textContent" || t in e && vs.test(t) && ne(n)) : t === "spellcheck" || t === "draggable" || t === "translate" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA" || vs.test(t) && Ie(n) ? !1 : t in e
}
function Mr(e) {
    const t = Ir();
    if (!t)
        return;
    const n = t.ut = (r=e(t.proxy))=>{
        Array.from(document.querySelectorAll(`[data-v-owner="${t.uid}"]`)).forEach(s=>er(s, r))
    }
      , o = ()=>{
        const r = e(t.proxy);
        Zo(t.subTree, r),
        n(r)
    }
    ;
    Ic(o),
    Gt(()=>{
        const r = new MutationObserver(o);
        r.observe(t.subTree.el.parentNode, {
            childList: !0
        }),
        Pr(()=>r.disconnect())
    }
    )
}
function Zo(e, t) {
    if (e.shapeFlag & 128) {
        const n = e.suspense;
        e = n.activeBranch,
        n.pendingBranch && !n.isHydrating && n.effects.push(()=>{
            Zo(n.activeBranch, t)
        }
        )
    }
    for (; e.component; )
        e = e.component.subTree;
    if (e.shapeFlag & 1 && e.el)
        er(e.el, t);
    else if (e.type === Fe)
        e.children.forEach(n=>Zo(n, t));
    else if (e.type === Zn) {
        let {el: n, anchor: o} = e;
        for (; n && (er(n, t),
        n !== o); )
            n = n.nextSibling
    }
}
function er(e, t) {
    if (e.nodeType === 1) {
        const n = e.style;
        for (const o in t)
            n.setProperty(`--${o}`, t[o])
    }
}
const kt = "transition"
  , bn = "animation"
  , Di = (e,{slots: t})=>$r(Mc, ji(e), t);
Di.displayName = "Transition";
const Hi = {
    name: String,
    type: String,
    css: {
        type: Boolean,
        default: !0
    },
    duration: [String, Number, Object],
    enterFromClass: String,
    enterActiveClass: String,
    enterToClass: String,
    appearFromClass: String,
    appearActiveClass: String,
    appearToClass: String,
    leaveFromClass: String,
    leaveActiveClass: String,
    leaveToClass: String
}
  , qa = Di.props = Me({}, wi, Hi)
  , qt = (e,t=[])=>{
    X(e) ? e.forEach(n=>n(...t)) : e && e(...t)
}
  , _s = e=>e ? X(e) ? e.some(t=>t.length > 1) : e.length > 1 : !1;
function ji(e) {
    const t = {};
    for (const H in e)
        H in Hi || (t[H] = e[H]);
    if (e.css === !1)
        return t;
    const {name: n="v", type: o, duration: r, enterFromClass: s=`${n}-enter-from`, enterActiveClass: i=`${n}-enter-active`, enterToClass: l=`${n}-enter-to`, appearFromClass: c=s, appearActiveClass: a=i, appearToClass: u=l, leaveFromClass: f=`${n}-leave-from`, leaveActiveClass: p=`${n}-leave-active`, leaveToClass: g=`${n}-leave-to`} = e
      , w = Ua(r)
      , S = w && w[0]
      , O = w && w[1]
      , {onBeforeEnter: L, onEnter: y, onEnterCancelled: k, onLeave: P, onLeaveCancelled: D, onBeforeAppear: ee=L, onAppear: se=y, onAppearCancelled: j=k} = t
      , oe = (H,ie,We)=>{
        Ot(H, ie ? u : l),
        Ot(H, ie ? a : i),
        We && We()
    }
      , G = (H,ie)=>{
        H._isLeaving = !1,
        Ot(H, f),
        Ot(H, g),
        Ot(H, p),
        ie && ie()
    }
      , de = H=>(ie,We)=>{
        const Qe = H ? se : y
          , ve = ()=>oe(ie, H, We);
        qt(Qe, [ie, ve]),
        bs(()=>{
            Ot(ie, H ? c : s),
            wt(ie, H ? u : l),
            _s(Qe) || ys(ie, o, S, ve)
        }
        )
    }
    ;
    return Me(t, {
        onBeforeEnter(H) {
            qt(L, [H]),
            wt(H, s),
            wt(H, i)
        },
        onBeforeAppear(H) {
            qt(ee, [H]),
            wt(H, c),
            wt(H, a)
        },
        onEnter: de(!1),
        onAppear: de(!0),
        onLeave(H, ie) {
            H._isLeaving = !0;
            const We = ()=>G(H, ie);
            wt(H, f),
            Ui(),
            wt(H, p),
            bs(()=>{
                H._isLeaving && (Ot(H, f),
                wt(H, g),
                _s(P) || ys(H, o, O, We))
            }
            ),
            qt(P, [H, We])
        },
        onEnterCancelled(H) {
            oe(H, !1),
            qt(k, [H])
        },
        onAppearCancelled(H) {
            oe(H, !0),
            qt(j, [H])
        },
        onLeaveCancelled(H) {
            G(H),
            qt(D, [H])
        }
    })
}
function Ua(e) {
    if (e == null)
        return null;
    if (Te(e))
        return [Mo(e.enter), Mo(e.leave)];
    {
        const t = Mo(e);
        return [t, t]
    }
}
function Mo(e) {
    return Ol(e)
}
function wt(e, t) {
    t.split(/\s+/).forEach(n=>n && e.classList.add(n)),
    (e._vtc || (e._vtc = new Set)).add(t)
}
function Ot(e, t) {
    t.split(/\s+/).forEach(o=>o && e.classList.remove(o));
    const {_vtc: n} = e;
    n && (n.delete(t),
    n.size || (e._vtc = void 0))
}
function bs(e) {
    requestAnimationFrame(()=>{
        requestAnimationFrame(e)
    }
    )
}
let Va = 0;
function ys(e, t, n, o) {
    const r = e._endId = ++Va
      , s = ()=>{
        r === e._endId && o()
    }
    ;
    if (n)
        return setTimeout(s, n);
    const {type: i, timeout: l, propCount: c} = qi(e, t);
    if (!i)
        return o();
    const a = i + "end";
    let u = 0;
    const f = ()=>{
        e.removeEventListener(a, p),
        s()
    }
      , p = g=>{
        g.target === e && ++u >= c && f()
    }
    ;
    setTimeout(()=>{
        u < c && f()
    }
    , l + 1),
    e.addEventListener(a, p)
}
function qi(e, t) {
    const n = window.getComputedStyle(e)
      , o = w=>(n[w] || "").split(", ")
      , r = o(`${kt}Delay`)
      , s = o(`${kt}Duration`)
      , i = ws(r, s)
      , l = o(`${bn}Delay`)
      , c = o(`${bn}Duration`)
      , a = ws(l, c);
    let u = null
      , f = 0
      , p = 0;
    t === kt ? i > 0 && (u = kt,
    f = i,
    p = s.length) : t === bn ? a > 0 && (u = bn,
    f = a,
    p = c.length) : (f = Math.max(i, a),
    u = f > 0 ? i > a ? kt : bn : null,
    p = u ? u === kt ? s.length : c.length : 0);
    const g = u === kt && /\b(transform|all)(,|$)/.test(o(`${kt}Property`).toString());
    return {
        type: u,
        timeout: f,
        propCount: p,
        hasTransform: g
    }
}
function ws(e, t) {
    for (; e.length < t.length; )
        e = e.concat(e);
    return Math.max(...t.map((n,o)=>Es(n) + Es(e[o])))
}
function Es(e) {
    return Number(e.slice(0, -1).replace(",", ".")) * 1e3
}
function Ui() {
    return document.body.offsetHeight
}
const Vi = new WeakMap
  , zi = new WeakMap
  , Ki = {
    name: "TransitionGroup",
    props: Me({}, qa, {
        tag: String,
        moveClass: String
    }),
    setup(e, {slots: t}) {
        const n = Ir()
          , o = yi();
        let r, s;
        return Ai(()=>{
            if (!r.length)
                return;
            const i = e.moveClass || `${e.name || "v"}-move`;
            if (!Ja(r[0].el, n.vnode.el, i))
                return;
            r.forEach(Qa),
            r.forEach(Ya);
            const l = r.filter(Xa);
            Ui(),
            l.forEach(c=>{
                const a = c.el
                  , u = a.style;
                wt(a, i),
                u.transform = u.webkitTransform = u.transitionDuration = "";
                const f = a._moveCb = p=>{
                    p && p.target !== a || (!p || /transform$/.test(p.propertyName)) && (a.removeEventListener("transitionend", f),
                    a._moveCb = null,
                    Ot(a, i))
                }
                ;
                a.addEventListener("transitionend", f)
            }
            )
        }
        ),
        ()=>{
            const i = ce(e)
              , l = ji(i);
            let c = i.tag || Fe;
            r = s,
            s = t.default ? Ar(t.default()) : [];
            for (let a = 0; a < s.length; a++) {
                const u = s[a];
                u.key != null && Wn(u, Mn(u, l, o, n))
            }
            if (r)
                for (let a = 0; a < r.length; a++) {
                    const u = r[a];
                    Wn(u, Mn(u, l, o, n)),
                    Vi.set(u, u.el.getBoundingClientRect())
                }
            return Ee(c, null, s)
        }
    }
}
  , za = e=>delete e.mode;
Ki.props;
const Ka = Ki;
function Qa(e) {
    const t = e.el;
    t._moveCb && t._moveCb(),
    t._enterCb && t._enterCb()
}
function Ya(e) {
    zi.set(e, e.el.getBoundingClientRect())
}
function Xa(e) {
    const t = Vi.get(e)
      , n = zi.get(e)
      , o = t.left - n.left
      , r = t.top - n.top;
    if (o || r) {
        const s = e.el.style;
        return s.transform = s.webkitTransform = `translate(${o}px,${r}px)`,
        s.transitionDuration = "0s",
        e
    }
}
function Ja(e, t, n) {
    const o = e.cloneNode();
    e._vtc && e._vtc.forEach(i=>{
        i.split(/\s+/).forEach(l=>l && o.classList.remove(l))
    }
    ),
    n.split(/\s+/).forEach(i=>i && o.classList.add(i)),
    o.style.display = "none";
    const r = t.nodeType === 1 ? t : t.parentNode;
    r.appendChild(o);
    const {hasTransform: s} = qi(o);
    return r.removeChild(o),
    s
}
const Ga = ["ctrl", "shift", "alt", "meta"]
  , Za = {
    stop: e=>e.stopPropagation(),
    prevent: e=>e.preventDefault(),
    self: e=>e.target !== e.currentTarget,
    ctrl: e=>!e.ctrlKey,
    shift: e=>!e.shiftKey,
    alt: e=>!e.altKey,
    meta: e=>!e.metaKey,
    left: e=>"button"in e && e.button !== 0,
    middle: e=>"button"in e && e.button !== 1,
    right: e=>"button"in e && e.button !== 2,
    exact: (e,t)=>Ga.some(n=>e[`${n}Key`] && !t.includes(n))
}
  , fh = (e,t)=>(n,...o)=>{
    for (let r = 0; r < t.length; r++) {
        const s = Za[t[r]];
        if (s && s(n, t))
            return
    }
    return e(n, ...o)
}
  , eu = Me({
    patchProp: Ha
}, xa);
let Cs;
function tu() {
    return Cs || (Cs = sa(eu))
}
const nu = (...e)=>{
    const t = tu().createApp(...e)
      , {mount: n} = t;
    return t.mount = o=>{
        const r = ou(o);
        if (!r)
            return;
        const s = t._component;
        !ne(s) && !s.render && !s.template && (s.template = r.innerHTML),
        r.innerHTML = "";
        const i = n(r, !1, r instanceof SVGElement);
        return r instanceof Element && (r.removeAttribute("v-cloak"),
        r.setAttribute("data-v-app", "")),
        i
    }
    ,
    t
}
;
function ou(e) {
    return Ie(e) ? document.querySelector(e) : e
}
const ru = xe({
    __name: "DrawPreset",
    props: {
        extends: {}
    },
    setup(e) {
        const t = e
          , {extends: n} = Ke(t)
          , o = Ue(dl, {})
          , r = J(()=>{
            const s = n.value;
            return o[s]
        }
        );
        return (s,i)=>(Q(),
        ge(gn(r.value)))
    }
})
  , Qi = Symbol();
function Yi() {
    const e = Ue(Qi, null);
    return e === null && console.warn("You are using carousel methods outside of the carousel component"),
    e
}
const su = {
    draggable: !1,
    threshold: 0,
    paddingPx: 8
}
  , kn = new Map
  , tr = new Map
  , As = e=>e instanceof MouseEvent ? !0 : e.touches.length < 2
  , Ps = e=>e instanceof MouseEvent ? {
    clientX: e.clientX,
    clientY: e.clientY
} : {
    clientX: e.touches[0].clientX,
    clientY: e.touches[0].clientX
}
  , iu = (e,{value: t})=>{
    const n = o=>{
        if (!As(o))
            return;
        const r = Ps(o);
        let s = {
            x: r.clientX,
            y: r.clientY
        };
        const i = c=>{
            if (!As(c))
                return;
            const a = Ps(c);
            t.onEvent(e, [a.clientX - s.x, a.clientY - s.y]),
            s = {
                x: a.clientX,
                y: a.clientY
            }
        }
          , l = ()=>{
            document.removeEventListener("touchmove", i),
            document.removeEventListener("mousemove", i),
            document.removeEventListener("touchend", l),
            document.removeEventListener("mouseup", l),
            kn.delete(e)
        }
        ;
        document.removeEventListener("touchmove", i),
        document.removeEventListener("mousemove", i),
        document.removeEventListener("mouseup", l),
        document.removeEventListener("touchend", l),
        kn.delete(e),
        document.addEventListener("touchmove", i, {
            passive: !0
        }),
        document.addEventListener("mousemove", i, {
            passive: !0
        }),
        document.addEventListener("touchend", l, {
            passive: !0
        }),
        document.addEventListener("mouseup", l, {
            passive: !0
        }),
        kn.set(e, [i, l])
    }
    ;
    e.addEventListener("touchstart", n, {
        passive: !0
    }),
    e.addEventListener("mousedown", n, {
        passive: !0
    }),
    tr.set(e, n)
}
  , lu = e=>{
    const t = tr.get(e);
    t && (e.removeEventListener("touchstart", t),
    e.removeEventListener("mousedown", t),
    tr.delete(e));
    const n = kn.get(e);
    n && (document.removeEventListener("touchmove", n[0]),
    document.removeEventListener("mousemove", n[0]),
    document.removeEventListener("mouseup", n[1]),
    document.removeEventListener("touchend", n[1]),
    kn.delete(e))
}
  , cu = {
    beforeMount: iu,
    beforeUnmount: lu
}
  , au = {
    threshold: 1
}
  , nr = new Map;
function uu(e, {value: t}) {
    if (!(window && "IntersectionObserver"in window))
        return;
    const {options: n=au} = t
      , o = new IntersectionObserver(t.onEvent,n);
    o.observe(e),
    nr.set(e, o)
}
function fu(e) {
    const t = nr.get(e);
    t == null || t.disconnect(),
    nr.delete(e)
}
const pu = {
    mounted: uu,
    beforeUnmount: fu
}
  , du = 30
  , hu = 500;
function mu(e, t) {
    return Math.abs(t) > Math.abs(e) ? t > 0 ? "top" : "bottom" : e > 0 ? "left" : "right"
}
const Xi = new Map;
function gu(e, {value: t}) {
    const n = [null, null]
      , o = typeof t.threshold == "number" ? t.threshold : du
      , r = typeof t.timeout == "number" ? t.timeout : hu
      , s = ()=>{
        const c = n[0]
          , a = n[1];
        if (c === null || a === null || !(!!c.touches.length && c.touches[0].identifier === a.changedTouches[0].identifier))
            return;
        const {clientX: f, clientY: p} = c.touches[0]
          , {clientX: g, clientY: w} = a.changedTouches[0]
          , S = f - g
          , O = p - w
          , L = a.timeStamp - c.timeStamp;
        if ((Math.abs(S) > o || Math.abs(O) > o) && L < r) {
            const k = {
                direction: mu(S, O),
                events: [c, a]
            };
            t.onEvent(e, k)
        }
    }
      , i = c=>{
        n[0] = c
    }
      , l = c=>{
        n[1] = c,
        s()
    }
    ;
    Xi.set(e, [i, l]),
    e.addEventListener("touchstart", i, {
        passive: !0
    }),
    document.addEventListener("touchend", l, {
        passive: !0
    })
}
function vu(e) {
    const t = Xi.get(e);
    if (!t)
        return;
    const [n,o] = t;
    e.removeEventListener("touchstart", n),
    document.removeEventListener("touchend", o)
}
const _u = {
    beforeMount: gu,
    beforeUnmount: vu
}
  , bu = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/
  , yu = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/;
let Ts = !1
  , Wo = !1;
function Ji() {
    if (Ts)
        return Wo;
    const e = navigator.userAgent;
    return Wo = bu.test(e.toLowerCase()) || yu.test(e.substring(0, 4).toLowerCase()),
    Ts = !0,
    Wo
}
function Kt(e, t, n) {
    return Math.min(n, Math.max(t, e))
}
const or = new Map
  , wu = (e,t)=>{
    let n = 0;
    return (...r)=>{
        const s = Date.now();
        if (s - n > t)
            return n = s,
            e(...r)
    }
}
  , Eu = (e,{value: t})=>{
    const n = wu(r=>{
        t.onEvent(r)
    }
    , 500)
      , o = ({deltaX: r})=>{
        Math.abs(r) <= 20 || (n(Math.sign(r)),
        e.scrollLeft = 10)
    }
    ;
    Ji() || (e.addEventListener("wheel", o, {
        passive: !0
    }),
    or.set(e, o))
}
  , Cu = e=>{
    const t = or.get(e);
    t && (e.removeEventListener("wheel", t),
    or.delete(e))
}
  , Au = {
    beforeMount: Eu,
    beforeUnmount: Cu
}
  , Pu = xe({
    __name: "Carousel",
    props: Ft({
        modelValue: {},
        itemsCount: {},
        items: {},
        draggable: {
            type: Boolean
        },
        threshold: {},
        paddingPx: {}
    }, su),
    emits: ["update:modelValue"],
    setup(e, {expose: t, emit: n}) {
        const o = e;
        Mr(R=>({
            "37ab9a7a": fe.value
        }));
        const {itemsCount: r, modelValue: s, items: i, draggable: l, threshold: c, paddingPx: a} = Ke(o)
          , u = we(!0)
          , f = we(0)
          , p = we(null)
          , g = J(()=>{
            const R = r.value
              , le = 100 / R
              , Oe = a.value * 2 / R
              , ke = `calc(${le}% + ${Oe}px)`
              , tt = `translateX(${O.value.start * 100}%)`;
            return {
                minWidth: ke,
                maxWidth: ke,
                flexBasis: ke,
                transform: tt
            }
        }
        )
          , w = J(()=>-s.value / r.value)
          , S = J(()=>{
            const R = u.value ? w.value : f.value
              , Oe = a.value * (1 - 2 * R);
            return {
                transform: `translateX(${100 * R}%) translateX(-${Oe}px)`
            }
        }
        )
          , O = J(()=>{
            const R = s.value
              , le = i.value.length;
            return {
                start: Kt(R - 1, 0, le - 1),
                end: Kt(R + r.value + 1, 0, le - 1)
            }
        }
        )
          , L = J(()=>{
            const R = s.value;
            return (R === 0 ? 0 : -1) + R
        }
        )
          , y = J(()=>{
            const {start: R, end: le} = O.value;
            return i.value.slice(R, le + 1)
        }
        )
          , k = J(()=>Ji() || l.value);
        Gt(()=>{
            const R = p.value;
            R && (R.addEventListener("touchstart", j, {
                passive: !0
            }),
            R.addEventListener("touchend", oe, {
                passive: !0
            }),
            R.addEventListener("mousedown", j, {
                passive: !0
            }),
            document.addEventListener("mouseup", oe, {
                passive: !0
            }))
        }
        );
        const P = R=>{
            const le = Kt(i.value.length - 1, 0, Math.max(0, i.value.length - r.value));
            n("update:modelValue", Kt(R, 0, le))
        }
        ;
        He(r, ()=>{
            P(0)
        }
        );
        const D = ()=>{
            P(s.value + 1)
        }
          , ee = ()=>{
            P(s.value - 1)
        }
          , se = (R,[le])=>{
            const Oe = Math.abs(le) < c.value;
            if (!k.value || !R || Oe)
                return;
            const {clientWidth: ke} = R
              , Re = 1 - i.value.length / r.value;
            f.value = Kt(le / ke + f.value, Re, 0)
        }
          , j = ()=>{
            u.value = !1,
            f.value = w.value
        }
          , oe = ()=>{
            u.value = !0
        }
          , G = new Map
          , de = R=>{
            if (G.has(R))
                return G.get(R);
            const le = {
                onEvent: Oe=>{
                    const {isIntersecting: ke, intersectionRatio: Re} = Oe[0];
                    ke && Re && Re !== 1 && !u.value && P(s.value < R ? R - r.value + 1 : R)
                }
                ,
                options: {
                    threshold: .01
                }
            };
            return G.set(R, le),
            le
        }
          , H = R=>{
            P(s.value + R)
        }
          , ie = (R,le)=>{
            const Oe = le.direction;
            Math.round(f.value) !== -s.value || !k.value || (Oe === "left" ? D() : Oe === "right" && ee())
        }
          , We = {
            onEvent: H
        }
          , Qe = {
            onEvent: se
        }
          , ve = {
            onEvent: ie
        }
          , fe = J(()=>`${a.value}px`);
        return mn(()=>{
            const R = p.value;
            G.clear(),
            R && (R.removeEventListener("touchstart", j),
            R.removeEventListener("touchend", oe),
            R.removeEventListener("mousedown", j),
            document.removeEventListener("mouseup", oe))
        }
        ),
        t({
            next: D,
            back: ee
        }),
        (R,le)=>(Q(),
        be("div", {
            ref_key: "host",
            ref: p,
            ondragstart: "return false;",
            class: Pe([R.$style.container, K(l) && R.$style.container_draggable])
        }, [Gn((Q(),
        be("div", {
            class: Pe(R.$style.scroller)
        }, [it("div", {
            class: Pe(R.$style.wrapper)
        }, [Gn((Q(),
        be("div", {
            class: Pe([R.$style.items, u.value && R.$style.items_transitioned]),
            style: Wt(S.value)
        }, [(Q(!0),
        be(Fe, null, xr(y.value, (Oe,ke)=>Gn((Q(),
        be("div", {
            key: ke + L.value,
            style: Wt(g.value),
            class: Pe(R.$style.item)
        }, [Je(R.$slots, "default", {
            item: Oe,
            index: ke + L.value
        })], 6)), [[K(pu), de(ke + L.value)]])), 128))], 6)), [[K(cu), Qe], [K(_u), ve]])], 2)], 2)), [[K(Au), We]])], 2))
    }
})
  , Tu = "_container_18c61_1"
  , xu = "_container_draggable_18c61_6"
  , ku = "_scroller_18c61_16"
  , Su = "_items_18c61_39"
  , Ou = "_items_transitioned_18c61_43"
  , Ru = "_wrapper_18c61_47"
  , Iu = "_item_18c61_39"
  , Lu = {
    container: Tu,
    container_draggable: xu,
    scroller: ku,
    items: Su,
    items_transitioned: Ou,
    wrapper: Ru,
    item: Iu
}
  , Ze = (e,t)=>{
    const n = e.__vccOpts || e;
    for (const [o,r] of t)
        n[o] = r;
    return n
}
  , $u = {
    $style: Lu
}
  , Mu = Ze(Pu, [["__cssModules", $u]]);
/*!
  * vue-router v4.2.5
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */
const en = typeof window < "u";
function Wu(e) {
    return e.__esModule || e[Symbol.toStringTag] === "Module"
}
const he = Object.assign;
function Bo(e, t) {
    const n = {};
    for (const o in t) {
        const r = t[o];
        n[o] = pt(r) ? r.map(e) : e(r)
    }
    return n
}
const Sn = ()=>{}
  , pt = Array.isArray
  , Bu = /\/$/
  , Nu = e=>e.replace(Bu, "");
function No(e, t, n="/") {
    let o, r = {}, s = "", i = "";
    const l = t.indexOf("#");
    let c = t.indexOf("?");
    return l < c && l >= 0 && (c = -1),
    c > -1 && (o = t.slice(0, c),
    s = t.slice(c + 1, l > -1 ? l : t.length),
    r = e(s)),
    l > -1 && (o = o || t.slice(0, l),
    i = t.slice(l, t.length)),
    o = ju(o ?? t, n),
    {
        fullPath: o + (s && "?") + s + i,
        path: o,
        query: r,
        hash: i
    }
}
function Fu(e, t) {
    const n = t.query ? e(t.query) : "";
    return t.path + (n && "?") + n + (t.hash || "")
}
function xs(e, t) {
    return !t || !e.toLowerCase().startsWith(t.toLowerCase()) ? e : e.slice(t.length) || "/"
}
function Du(e, t, n) {
    const o = t.matched.length - 1
      , r = n.matched.length - 1;
    return o > -1 && o === r && un(t.matched[o], n.matched[r]) && Gi(t.params, n.params) && e(t.query) === e(n.query) && t.hash === n.hash
}
function un(e, t) {
    return (e.aliasOf || e) === (t.aliasOf || t)
}
function Gi(e, t) {
    if (Object.keys(e).length !== Object.keys(t).length)
        return !1;
    for (const n in e)
        if (!Hu(e[n], t[n]))
            return !1;
    return !0
}
function Hu(e, t) {
    return pt(e) ? ks(e, t) : pt(t) ? ks(t, e) : e === t
}
function ks(e, t) {
    return pt(t) ? e.length === t.length && e.every((n,o)=>n === t[o]) : e.length === 1 && e[0] === t
}
function ju(e, t) {
    if (e.startsWith("/"))
        return e;
    if (!e)
        return t;
    const n = t.split("/")
      , o = e.split("/")
      , r = o[o.length - 1];
    (r === ".." || r === ".") && o.push("");
    let s = n.length - 1, i, l;
    for (i = 0; i < o.length; i++)
        if (l = o[i],
        l !== ".")
            if (l === "..")
                s > 1 && s--;
            else
                break;
    return n.slice(0, s).join("/") + "/" + o.slice(i - (i === o.length ? 1 : 0)).join("/")
}
var Nn;
(function(e) {
    e.pop = "pop",
    e.push = "push"
}
)(Nn || (Nn = {}));
var On;
(function(e) {
    e.back = "back",
    e.forward = "forward",
    e.unknown = ""
}
)(On || (On = {}));
function qu(e) {
    if (!e)
        if (en) {
            const t = document.querySelector("base");
            e = t && t.getAttribute("href") || "/",
            e = e.replace(/^\w+:\/\/[^\/]+/, "")
        } else
            e = "/";
    return e[0] !== "/" && e[0] !== "#" && (e = "/" + e),
    Nu(e)
}
const Uu = /^[^#]+#/;
function Vu(e, t) {
    return e.replace(Uu, "#") + t
}
function zu(e, t) {
    const n = document.documentElement.getBoundingClientRect()
      , o = e.getBoundingClientRect();
    return {
        behavior: t.behavior,
        left: o.left - n.left - (t.left || 0),
        top: o.top - n.top - (t.top || 0)
    }
}
const Co = ()=>({
    left: window.pageXOffset,
    top: window.pageYOffset
});
function Ku(e) {
    let t;
    if ("el"in e) {
        const n = e.el
          , o = typeof n == "string" && n.startsWith("#")
          , r = typeof n == "string" ? o ? document.getElementById(n.slice(1)) : document.querySelector(n) : n;
        if (!r)
            return;
        t = zu(r, e)
    } else
        t = e;
    "scrollBehavior"in document.documentElement.style ? window.scrollTo(t) : window.scrollTo(t.left != null ? t.left : window.pageXOffset, t.top != null ? t.top : window.pageYOffset)
}
function Ss(e, t) {
    return (history.state ? history.state.position - t : -1) + e
}
const rr = new Map;
function Qu(e, t) {
    rr.set(e, t)
}
function Yu(e) {
    const t = rr.get(e);
    return rr.delete(e),
    t
}
let Xu = ()=>location.protocol + "//" + location.host;
function Zi(e, t) {
    const {pathname: n, search: o, hash: r} = t
      , s = e.indexOf("#");
    if (s > -1) {
        let l = r.includes(e.slice(s)) ? e.slice(s).length : 1
          , c = r.slice(l);
        return c[0] !== "/" && (c = "/" + c),
        xs(c, "")
    }
    return xs(n, e) + o + r
}
function Ju(e, t, n, o) {
    let r = []
      , s = []
      , i = null;
    const l = ({state: p})=>{
        const g = Zi(e, location)
          , w = n.value
          , S = t.value;
        let O = 0;
        if (p) {
            if (n.value = g,
            t.value = p,
            i && i === w) {
                i = null;
                return
            }
            O = S ? p.position - S.position : 0
        } else
            o(g);
        r.forEach(L=>{
            L(n.value, w, {
                delta: O,
                type: Nn.pop,
                direction: O ? O > 0 ? On.forward : On.back : On.unknown
            })
        }
        )
    }
    ;
    function c() {
        i = n.value
    }
    function a(p) {
        r.push(p);
        const g = ()=>{
            const w = r.indexOf(p);
            w > -1 && r.splice(w, 1)
        }
        ;
        return s.push(g),
        g
    }
    function u() {
        const {history: p} = window;
        p.state && p.replaceState(he({}, p.state, {
            scroll: Co()
        }), "")
    }
    function f() {
        for (const p of s)
            p();
        s = [],
        window.removeEventListener("popstate", l),
        window.removeEventListener("beforeunload", u)
    }
    return window.addEventListener("popstate", l),
    window.addEventListener("beforeunload", u, {
        passive: !0
    }),
    {
        pauseListeners: c,
        listen: a,
        destroy: f
    }
}
function Os(e, t, n, o=!1, r=!1) {
    return {
        back: e,
        current: t,
        forward: n,
        replaced: o,
        position: window.history.length,
        scroll: r ? Co() : null
    }
}
function Gu(e) {
    const {history: t, location: n} = window
      , o = {
        value: Zi(e, n)
    }
      , r = {
        value: t.state
    };
    r.value || s(o.value, {
        back: null,
        current: o.value,
        forward: null,
        position: t.length - 1,
        replaced: !0,
        scroll: null
    }, !0);
    function s(c, a, u) {
        const f = e.indexOf("#")
          , p = f > -1 ? (n.host && document.querySelector("base") ? e : e.slice(f)) + c : Xu() + e + c;
        try {
            t[u ? "replaceState" : "pushState"](a, "", p),
            r.value = a
        } catch (g) {
            console.error(g),
            n[u ? "replace" : "assign"](p)
        }
    }
    function i(c, a) {
        const u = he({}, t.state, Os(r.value.back, c, r.value.forward, !0), a, {
            position: r.value.position
        });
        s(c, u, !0),
        o.value = c
    }
    function l(c, a) {
        const u = he({}, r.value, t.state, {
            forward: c,
            scroll: Co()
        });
        s(u.current, u, !0);
        const f = he({}, Os(o.value, c, null), {
            position: u.position + 1
        }, a);
        s(c, f, !1),
        o.value = c
    }
    return {
        location: o,
        state: r,
        push: l,
        replace: i
    }
}
function Zu(e) {
    e = qu(e);
    const t = Gu(e)
      , n = Ju(e, t.state, t.location, t.replace);
    function o(s, i=!0) {
        i || n.pauseListeners(),
        history.go(s)
    }
    const r = he({
        location: "",
        base: e,
        go: o,
        createHref: Vu.bind(null, e)
    }, t, n);
    return Object.defineProperty(r, "location", {
        enumerable: !0,
        get: ()=>t.location.value
    }),
    Object.defineProperty(r, "state", {
        enumerable: !0,
        get: ()=>t.state.value
    }),
    r
}
function ef(e) {
    return typeof e == "string" || e && typeof e == "object"
}
function el(e) {
    return typeof e == "string" || typeof e == "symbol"
}
const St = {
    path: "/",
    name: void 0,
    params: {},
    query: {},
    hash: "",
    fullPath: "/",
    matched: [],
    meta: {},
    redirectedFrom: void 0
}
  , tl = Symbol("");
var Rs;
(function(e) {
    e[e.aborted = 4] = "aborted",
    e[e.cancelled = 8] = "cancelled",
    e[e.duplicated = 16] = "duplicated"
}
)(Rs || (Rs = {}));
function fn(e, t) {
    return he(new Error, {
        type: e,
        [tl]: !0
    }, t)
}
function yt(e, t) {
    return e instanceof Error && tl in e && (t == null || !!(e.type & t))
}
const Is = "[^/]+?"
  , tf = {
    sensitive: !1,
    strict: !1,
    start: !0,
    end: !0
}
  , nf = /[.+*?^${}()[\]/\\]/g;
function of(e, t) {
    const n = he({}, tf, t)
      , o = [];
    let r = n.start ? "^" : "";
    const s = [];
    for (const a of e) {
        const u = a.length ? [] : [90];
        n.strict && !a.length && (r += "/");
        for (let f = 0; f < a.length; f++) {
            const p = a[f];
            let g = 40 + (n.sensitive ? .25 : 0);
            if (p.type === 0)
                f || (r += "/"),
                r += p.value.replace(nf, "\\$&"),
                g += 40;
            else if (p.type === 1) {
                const {value: w, repeatable: S, optional: O, regexp: L} = p;
                s.push({
                    name: w,
                    repeatable: S,
                    optional: O
                });
                const y = L || Is;
                if (y !== Is) {
                    g += 10;
                    try {
                        new RegExp(`(${y})`)
                    } catch (P) {
                        throw new Error(`Invalid custom RegExp for param "${w}" (${y}): ` + P.message)
                    }
                }
                let k = S ? `((?:${y})(?:/(?:${y}))*)` : `(${y})`;
                f || (k = O && a.length < 2 ? `(?:/${k})` : "/" + k),
                O && (k += "?"),
                r += k,
                g += 20,
                O && (g += -8),
                S && (g += -20),
                y === ".*" && (g += -50)
            }
            u.push(g)
        }
        o.push(u)
    }
    if (n.strict && n.end) {
        const a = o.length - 1;
        o[a][o[a].length - 1] += .7000000000000001
    }
    n.strict || (r += "/?"),
    n.end ? r += "$" : n.strict && (r += "(?:/|$)");
    const i = new RegExp(r,n.sensitive ? "" : "i");
    function l(a) {
        const u = a.match(i)
          , f = {};
        if (!u)
            return null;
        for (let p = 1; p < u.length; p++) {
            const g = u[p] || ""
              , w = s[p - 1];
            f[w.name] = g && w.repeatable ? g.split("/") : g
        }
        return f
    }
    function c(a) {
        let u = ""
          , f = !1;
        for (const p of e) {
            (!f || !u.endsWith("/")) && (u += "/"),
            f = !1;
            for (const g of p)
                if (g.type === 0)
                    u += g.value;
                else if (g.type === 1) {
                    const {value: w, repeatable: S, optional: O} = g
                      , L = w in a ? a[w] : "";
                    if (pt(L) && !S)
                        throw new Error(`Provided param "${w}" is an array but it is not repeatable (* or + modifiers)`);
                    const y = pt(L) ? L.join("/") : L;
                    if (!y)
                        if (O)
                            p.length < 2 && (u.endsWith("/") ? u = u.slice(0, -1) : f = !0);
                        else
                            throw new Error(`Missing required param "${w}"`);
                    u += y
                }
        }
        return u || "/"
    }
    return {
        re: i,
        score: o,
        keys: s,
        parse: l,
        stringify: c
    }
}
function rf(e, t) {
    let n = 0;
    for (; n < e.length && n < t.length; ) {
        const o = t[n] - e[n];
        if (o)
            return o;
        n++
    }
    return e.length < t.length ? e.length === 1 && e[0] === 40 + 40 ? -1 : 1 : e.length > t.length ? t.length === 1 && t[0] === 40 + 40 ? 1 : -1 : 0
}
function sf(e, t) {
    let n = 0;
    const o = e.score
      , r = t.score;
    for (; n < o.length && n < r.length; ) {
        const s = rf(o[n], r[n]);
        if (s)
            return s;
        n++
    }
    if (Math.abs(r.length - o.length) === 1) {
        if (Ls(o))
            return 1;
        if (Ls(r))
            return -1
    }
    return r.length - o.length
}
function Ls(e) {
    const t = e[e.length - 1];
    return e.length > 0 && t[t.length - 1] < 0
}
const lf = {
    type: 0,
    value: ""
}
  , cf = /[a-zA-Z0-9_]/;
function af(e) {
    if (!e)
        return [[]];
    if (e === "/")
        return [[lf]];
    if (!e.startsWith("/"))
        throw new Error(`Invalid path "${e}"`);
    function t(g) {
        throw new Error(`ERR (${n})/"${a}": ${g}`)
    }
    let n = 0
      , o = n;
    const r = [];
    let s;
    function i() {
        s && r.push(s),
        s = []
    }
    let l = 0, c, a = "", u = "";
    function f() {
        a && (n === 0 ? s.push({
            type: 0,
            value: a
        }) : n === 1 || n === 2 || n === 3 ? (s.length > 1 && (c === "*" || c === "+") && t(`A repeatable param (${a}) must be alone in its segment. eg: '/:ids+.`),
        s.push({
            type: 1,
            value: a,
            regexp: u,
            repeatable: c === "*" || c === "+",
            optional: c === "*" || c === "?"
        })) : t("Invalid state to consume buffer"),
        a = "")
    }
    function p() {
        a += c
    }
    for (; l < e.length; ) {
        if (c = e[l++],
        c === "\\" && n !== 2) {
            o = n,
            n = 4;
            continue
        }
        switch (n) {
        case 0:
            c === "/" ? (a && f(),
            i()) : c === ":" ? (f(),
            n = 1) : p();
            break;
        case 4:
            p(),
            n = o;
            break;
        case 1:
            c === "(" ? n = 2 : cf.test(c) ? p() : (f(),
            n = 0,
            c !== "*" && c !== "?" && c !== "+" && l--);
            break;
        case 2:
            c === ")" ? u[u.length - 1] == "\\" ? u = u.slice(0, -1) + c : n = 3 : u += c;
            break;
        case 3:
            f(),
            n = 0,
            c !== "*" && c !== "?" && c !== "+" && l--,
            u = "";
            break;
        default:
            t("Unknown state");
            break
        }
    }
    return n === 2 && t(`Unfinished custom RegExp for param "${a}"`),
    f(),
    i(),
    r
}
function uf(e, t, n) {
    const o = of(af(e.path), n)
      , r = he(o, {
        record: e,
        parent: t,
        children: [],
        alias: []
    });
    return t && !r.record.aliasOf == !t.record.aliasOf && t.children.push(r),
    r
}
function ff(e, t) {
    const n = []
      , o = new Map;
    t = Ws({
        strict: !1,
        end: !0,
        sensitive: !1
    }, t);
    function r(u) {
        return o.get(u)
    }
    function s(u, f, p) {
        const g = !p
          , w = pf(u);
        w.aliasOf = p && p.record;
        const S = Ws(t, u)
          , O = [w];
        if ("alias"in u) {
            const k = typeof u.alias == "string" ? [u.alias] : u.alias;
            for (const P of k)
                O.push(he({}, w, {
                    components: p ? p.record.components : w.components,
                    path: P,
                    aliasOf: p ? p.record : w
                }))
        }
        let L, y;
        for (const k of O) {
            const {path: P} = k;
            if (f && P[0] !== "/") {
                const D = f.record.path
                  , ee = D[D.length - 1] === "/" ? "" : "/";
                k.path = f.record.path + (P && ee + P)
            }
            if (L = uf(k, f, S),
            p ? p.alias.push(L) : (y = y || L,
            y !== L && y.alias.push(L),
            g && u.name && !Ms(L) && i(u.name)),
            w.children) {
                const D = w.children;
                for (let ee = 0; ee < D.length; ee++)
                    s(D[ee], L, p && p.children[ee])
            }
            p = p || L,
            (L.record.components && Object.keys(L.record.components).length || L.record.name || L.record.redirect) && c(L)
        }
        return y ? ()=>{
            i(y)
        }
        : Sn
    }
    function i(u) {
        if (el(u)) {
            const f = o.get(u);
            f && (o.delete(u),
            n.splice(n.indexOf(f), 1),
            f.children.forEach(i),
            f.alias.forEach(i))
        } else {
            const f = n.indexOf(u);
            f > -1 && (n.splice(f, 1),
            u.record.name && o.delete(u.record.name),
            u.children.forEach(i),
            u.alias.forEach(i))
        }
    }
    function l() {
        return n
    }
    function c(u) {
        let f = 0;
        for (; f < n.length && sf(u, n[f]) >= 0 && (u.record.path !== n[f].record.path || !nl(u, n[f])); )
            f++;
        n.splice(f, 0, u),
        u.record.name && !Ms(u) && o.set(u.record.name, u)
    }
    function a(u, f) {
        let p, g = {}, w, S;
        if ("name"in u && u.name) {
            if (p = o.get(u.name),
            !p)
                throw fn(1, {
                    location: u
                });
            S = p.record.name,
            g = he($s(f.params, p.keys.filter(y=>!y.optional).map(y=>y.name)), u.params && $s(u.params, p.keys.map(y=>y.name))),
            w = p.stringify(g)
        } else if ("path"in u)
            w = u.path,
            p = n.find(y=>y.re.test(w)),
            p && (g = p.parse(w),
            S = p.record.name);
        else {
            if (p = f.name ? o.get(f.name) : n.find(y=>y.re.test(f.path)),
            !p)
                throw fn(1, {
                    location: u,
                    currentLocation: f
                });
            S = p.record.name,
            g = he({}, f.params, u.params),
            w = p.stringify(g)
        }
        const O = [];
        let L = p;
        for (; L; )
            O.unshift(L.record),
            L = L.parent;
        return {
            name: S,
            path: w,
            params: g,
            matched: O,
            meta: hf(O)
        }
    }
    return e.forEach(u=>s(u)),
    {
        addRoute: s,
        resolve: a,
        removeRoute: i,
        getRoutes: l,
        getRecordMatcher: r
    }
}
function $s(e, t) {
    const n = {};
    for (const o of t)
        o in e && (n[o] = e[o]);
    return n
}
function pf(e) {
    return {
        path: e.path,
        redirect: e.redirect,
        name: e.name,
        meta: e.meta || {},
        aliasOf: void 0,
        beforeEnter: e.beforeEnter,
        props: df(e),
        children: e.children || [],
        instances: {},
        leaveGuards: new Set,
        updateGuards: new Set,
        enterCallbacks: {},
        components: "components"in e ? e.components || null : e.component && {
            default: e.component
        }
    }
}
function df(e) {
    const t = {}
      , n = e.props || !1;
    if ("component"in e)
        t.default = n;
    else
        for (const o in e.components)
            t[o] = typeof n == "object" ? n[o] : n;
    return t
}
function Ms(e) {
    for (; e; ) {
        if (e.record.aliasOf)
            return !0;
        e = e.parent
    }
    return !1
}
function hf(e) {
    return e.reduce((t,n)=>he(t, n.meta), {})
}
function Ws(e, t) {
    const n = {};
    for (const o in e)
        n[o] = o in t ? t[o] : e[o];
    return n
}
function nl(e, t) {
    return t.children.some(n=>n === e || nl(e, n))
}
const ol = /#/g
  , mf = /&/g
  , gf = /\//g
  , vf = /=/g
  , _f = /\?/g
  , rl = /\+/g
  , bf = /%5B/g
  , yf = /%5D/g
  , sl = /%5E/g
  , wf = /%60/g
  , il = /%7B/g
  , Ef = /%7C/g
  , ll = /%7D/g
  , Cf = /%20/g;
function Wr(e) {
    return encodeURI("" + e).replace(Ef, "|").replace(bf, "[").replace(yf, "]")
}
function Af(e) {
    return Wr(e).replace(il, "{").replace(ll, "}").replace(sl, "^")
}
function sr(e) {
    return Wr(e).replace(rl, "%2B").replace(Cf, "+").replace(ol, "%23").replace(mf, "%26").replace(wf, "`").replace(il, "{").replace(ll, "}").replace(sl, "^")
}
function Pf(e) {
    return sr(e).replace(vf, "%3D")
}
function Tf(e) {
    return Wr(e).replace(ol, "%23").replace(_f, "%3F")
}
function xf(e) {
    return e == null ? "" : Tf(e).replace(gf, "%2F")
}
function co(e) {
    try {
        return decodeURIComponent("" + e)
    } catch {}
    return "" + e
}
function kf(e) {
    const t = {};
    if (e === "" || e === "?")
        return t;
    const o = (e[0] === "?" ? e.slice(1) : e).split("&");
    for (let r = 0; r < o.length; ++r) {
        const s = o[r].replace(rl, " ")
          , i = s.indexOf("=")
          , l = co(i < 0 ? s : s.slice(0, i))
          , c = i < 0 ? null : co(s.slice(i + 1));
        if (l in t) {
            let a = t[l];
            pt(a) || (a = t[l] = [a]),
            a.push(c)
        } else
            t[l] = c
    }
    return t
}
function Bs(e) {
    let t = "";
    for (let n in e) {
        const o = e[n];
        if (n = Pf(n),
        o == null) {
            o !== void 0 && (t += (t.length ? "&" : "") + n);
            continue
        }
        (pt(o) ? o.map(s=>s && sr(s)) : [o && sr(o)]).forEach(s=>{
            s !== void 0 && (t += (t.length ? "&" : "") + n,
            s != null && (t += "=" + s))
        }
        )
    }
    return t
}
function Sf(e) {
    const t = {};
    for (const n in e) {
        const o = e[n];
        o !== void 0 && (t[n] = pt(o) ? o.map(r=>r == null ? null : "" + r) : o == null ? o : "" + o)
    }
    return t
}
const Of = Symbol("")
  , Ns = Symbol("")
  , Ao = Symbol("")
  , cl = Symbol("")
  , ir = Symbol("");
function yn() {
    let e = [];
    function t(o) {
        return e.push(o),
        ()=>{
            const r = e.indexOf(o);
            r > -1 && e.splice(r, 1)
        }
    }
    function n() {
        e = []
    }
    return {
        add: t,
        list: ()=>e.slice(),
        reset: n
    }
}
function It(e, t, n, o, r) {
    const s = o && (o.enterCallbacks[r] = o.enterCallbacks[r] || []);
    return ()=>new Promise((i,l)=>{
        const c = f=>{
            f === !1 ? l(fn(4, {
                from: n,
                to: t
            })) : f instanceof Error ? l(f) : ef(f) ? l(fn(2, {
                from: t,
                to: f
            })) : (s && o.enterCallbacks[r] === s && typeof f == "function" && s.push(f),
            i())
        }
          , a = e.call(o && o.instances[r], t, n, c);
        let u = Promise.resolve(a);
        e.length < 3 && (u = u.then(c)),
        u.catch(f=>l(f))
    }
    )
}
function Fo(e, t, n, o) {
    const r = [];
    for (const s of e)
        for (const i in s.components) {
            let l = s.components[i];
            if (!(t !== "beforeRouteEnter" && !s.instances[i]))
                if (Rf(l)) {
                    const a = (l.__vccOpts || l)[t];
                    a && r.push(It(a, n, o, s, i))
                } else {
                    let c = l();
                    r.push(()=>c.then(a=>{
                        if (!a)
                            return Promise.reject(new Error(`Couldn't resolve component "${i}" at "${s.path}"`));
                        const u = Wu(a) ? a.default : a;
                        s.components[i] = u;
                        const p = (u.__vccOpts || u)[t];
                        return p && It(p, n, o, s, i)()
                    }
                    ))
                }
        }
    return r
}
function Rf(e) {
    return typeof e == "object" || "displayName"in e || "props"in e || "__vccOpts"in e
}
function Fs(e) {
    const t = Ue(Ao)
      , n = Ue(cl)
      , o = J(()=>t.resolve(K(e.to)))
      , r = J(()=>{
        const {matched: c} = o.value
          , {length: a} = c
          , u = c[a - 1]
          , f = n.matched;
        if (!u || !f.length)
            return -1;
        const p = f.findIndex(un.bind(null, u));
        if (p > -1)
            return p;
        const g = Ds(c[a - 2]);
        return a > 1 && Ds(u) === g && f[f.length - 1].path !== g ? f.findIndex(un.bind(null, c[a - 2])) : p
    }
    )
      , s = J(()=>r.value > -1 && Mf(n.params, o.value.params))
      , i = J(()=>r.value > -1 && r.value === n.matched.length - 1 && Gi(n.params, o.value.params));
    function l(c={}) {
        return $f(c) ? t[K(e.replace) ? "replace" : "push"](K(e.to)).catch(Sn) : Promise.resolve()
    }
    return {
        route: o,
        href: J(()=>o.value.href),
        isActive: s,
        isExactActive: i,
        navigate: l
    }
}
const If = xe({
    name: "RouterLink",
    compatConfig: {
        MODE: 3
    },
    props: {
        to: {
            type: [String, Object],
            required: !0
        },
        replace: Boolean,
        activeClass: String,
        exactActiveClass: String,
        custom: Boolean,
        ariaCurrentValue: {
            type: String,
            default: "page"
        }
    },
    useLink: Fs,
    setup(e, {slots: t}) {
        const n = go(Fs(e))
          , {options: o} = Ue(Ao)
          , r = J(()=>({
            [Hs(e.activeClass, o.linkActiveClass, "router-link-active")]: n.isActive,
            [Hs(e.exactActiveClass, o.linkExactActiveClass, "router-link-exact-active")]: n.isExactActive
        }));
        return ()=>{
            const s = t.default && t.default(n);
            return e.custom ? s : $r("a", {
                "aria-current": n.isExactActive ? e.ariaCurrentValue : null,
                href: n.href,
                onClick: n.navigate,
                class: r.value
            }, s)
        }
    }
})
  , Lf = If;
function $f(e) {
    if (!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && !e.defaultPrevented && !(e.button !== void 0 && e.button !== 0)) {
        if (e.currentTarget && e.currentTarget.getAttribute) {
            const t = e.currentTarget.getAttribute("target");
            if (/\b_blank\b/i.test(t))
                return
        }
        return e.preventDefault && e.preventDefault(),
        !0
    }
}
function Mf(e, t) {
    for (const n in t) {
        const o = t[n]
          , r = e[n];
        if (typeof o == "string") {
            if (o !== r)
                return !1
        } else if (!pt(r) || r.length !== o.length || o.some((s,i)=>s !== r[i]))
            return !1
    }
    return !0
}
function Ds(e) {
    return e ? e.aliasOf ? e.aliasOf.path : e.path : ""
}
const Hs = (e,t,n)=>e ?? t ?? n
  , Wf = xe({
    name: "RouterView",
    inheritAttrs: !1,
    props: {
        name: {
            type: String,
            default: "default"
        },
        route: Object
    },
    compatConfig: {
        MODE: 3
    },
    setup(e, {attrs: t, slots: n}) {
        const o = Ue(ir)
          , r = J(()=>e.route || o.value)
          , s = Ue(Ns, 0)
          , i = J(()=>{
            let a = K(s);
            const {matched: u} = r.value;
            let f;
            for (; (f = u[a]) && !f.components; )
                a++;
            return a
        }
        )
          , l = J(()=>r.value.matched[i.value]);
        Xt(Ns, J(()=>i.value + 1)),
        Xt(Of, l),
        Xt(ir, r);
        const c = we();
        return He(()=>[c.value, l.value, e.name], ([a,u,f],[p,g,w])=>{
            u && (u.instances[f] = a,
            g && g !== u && a && a === p && (u.leaveGuards.size || (u.leaveGuards = g.leaveGuards),
            u.updateGuards.size || (u.updateGuards = g.updateGuards))),
            a && u && (!g || !un(u, g) || !p) && (u.enterCallbacks[f] || []).forEach(S=>S(a))
        }
        , {
            flush: "post"
        }),
        ()=>{
            const a = r.value
              , u = e.name
              , f = l.value
              , p = f && f.components[u];
            if (!p)
                return js(n.default, {
                    Component: p,
                    route: a
                });
            const g = f.props[u]
              , w = g ? g === !0 ? a.params : typeof g == "function" ? g(a) : g : null
              , O = $r(p, he({}, w, t, {
                onVnodeUnmounted: L=>{
                    L.component.isUnmounted && (f.instances[u] = null)
                }
                ,
                ref: c
            }));
            return js(n.default, {
                Component: O,
                route: a
            }) || O
        }
    }
});
function js(e, t) {
    if (!e)
        return null;
    const n = e(t);
    return n.length === 1 ? n[0] : n
}
const Bf = Wf;
function Nf(e) {
    const t = ff(e.routes, e)
      , n = e.parseQuery || kf
      , o = e.stringifyQuery || Bs
      , r = e.history
      , s = yn()
      , i = yn()
      , l = yn()
      , c = dc(St);
    let a = St;
    en && e.scrollBehavior && "scrollRestoration"in history && (history.scrollRestoration = "manual");
    const u = Bo.bind(null, A=>"" + A)
      , f = Bo.bind(null, xf)
      , p = Bo.bind(null, co);
    function g(A, N) {
        let M, q;
        return el(A) ? (M = t.getRecordMatcher(A),
        q = N) : q = A,
        t.addRoute(q, M)
    }
    function w(A) {
        const N = t.getRecordMatcher(A);
        N && t.removeRoute(N)
    }
    function S() {
        return t.getRoutes().map(A=>A.record)
    }
    function O(A) {
        return !!t.getRecordMatcher(A)
    }
    function L(A, N) {
        if (N = he({}, N || c.value),
        typeof A == "string") {
            const _ = No(n, A, N.path)
              , E = t.resolve({
                path: _.path
            }, N)
              , C = r.createHref(_.fullPath);
            return he(_, E, {
                params: p(E.params),
                hash: co(_.hash),
                redirectedFrom: void 0,
                href: C
            })
        }
        let M;
        if ("path"in A)
            M = he({}, A, {
                path: No(n, A.path, N.path).path
            });
        else {
            const _ = he({}, A.params);
            for (const E in _)
                _[E] == null && delete _[E];
            M = he({}, A, {
                params: f(_)
            }),
            N.params = f(N.params)
        }
        const q = t.resolve(M, N)
          , ue = A.hash || "";
        q.params = u(p(q.params));
        const d = Fu(o, he({}, A, {
            hash: Af(ue),
            path: q.path
        }))
          , h = r.createHref(d);
        return he({
            fullPath: d,
            hash: ue,
            query: o === Bs ? Sf(A.query) : A.query || {}
        }, q, {
            redirectedFrom: void 0,
            href: h
        })
    }
    function y(A) {
        return typeof A == "string" ? No(n, A, c.value.path) : he({}, A)
    }
    function k(A, N) {
        if (a !== A)
            return fn(8, {
                from: N,
                to: A
            })
    }
    function P(A) {
        return se(A)
    }
    function D(A) {
        return P(he(y(A), {
            replace: !0
        }))
    }
    function ee(A) {
        const N = A.matched[A.matched.length - 1];
        if (N && N.redirect) {
            const {redirect: M} = N;
            let q = typeof M == "function" ? M(A) : M;
            return typeof q == "string" && (q = q.includes("?") || q.includes("#") ? q = y(q) : {
                path: q
            },
            q.params = {}),
            he({
                query: A.query,
                hash: A.hash,
                params: "path"in q ? {} : A.params
            }, q)
        }
    }
    function se(A, N) {
        const M = a = L(A)
          , q = c.value
          , ue = A.state
          , d = A.force
          , h = A.replace === !0
          , _ = ee(M);
        if (_)
            return se(he(y(_), {
                state: typeof _ == "object" ? he({}, ue, _.state) : ue,
                force: d,
                replace: h
            }), N || M);
        const E = M;
        E.redirectedFrom = N;
        let C;
        return !d && Du(o, q, M) && (C = fn(16, {
            to: E,
            from: q
        }),
        ke(q, q, !0, !1)),
        (C ? Promise.resolve(C) : G(E, q)).catch(x=>yt(x) ? yt(x, 2) ? x : Oe(x) : R(x, E, q)).then(x=>{
            if (x) {
                if (yt(x, 2))
                    return se(he({
                        replace: h
                    }, y(x.to), {
                        state: typeof x.to == "object" ? he({}, ue, x.to.state) : ue,
                        force: d
                    }), N || E)
            } else
                x = H(E, q, !0, h, ue);
            return de(E, q, x),
            x
        }
        )
    }
    function j(A, N) {
        const M = k(A, N);
        return M ? Promise.reject(M) : Promise.resolve()
    }
    function oe(A) {
        const N = _t.values().next().value;
        return N && typeof N.runWithContext == "function" ? N.runWithContext(A) : A()
    }
    function G(A, N) {
        let M;
        const [q,ue,d] = Ff(A, N);
        M = Fo(q.reverse(), "beforeRouteLeave", A, N);
        for (const _ of q)
            _.leaveGuards.forEach(E=>{
                M.push(It(E, A, N))
            }
            );
        const h = j.bind(null, A, N);
        return M.push(h),
        Be(M).then(()=>{
            M = [];
            for (const _ of s.list())
                M.push(It(_, A, N));
            return M.push(h),
            Be(M)
        }
        ).then(()=>{
            M = Fo(ue, "beforeRouteUpdate", A, N);
            for (const _ of ue)
                _.updateGuards.forEach(E=>{
                    M.push(It(E, A, N))
                }
                );
            return M.push(h),
            Be(M)
        }
        ).then(()=>{
            M = [];
            for (const _ of d)
                if (_.beforeEnter)
                    if (pt(_.beforeEnter))
                        for (const E of _.beforeEnter)
                            M.push(It(E, A, N));
                    else
                        M.push(It(_.beforeEnter, A, N));
            return M.push(h),
            Be(M)
        }
        ).then(()=>(A.matched.forEach(_=>_.enterCallbacks = {}),
        M = Fo(d, "beforeRouteEnter", A, N),
        M.push(h),
        Be(M))).then(()=>{
            M = [];
            for (const _ of i.list())
                M.push(It(_, A, N));
            return M.push(h),
            Be(M)
        }
        ).catch(_=>yt(_, 8) ? _ : Promise.reject(_))
    }
    function de(A, N, M) {
        l.list().forEach(q=>oe(()=>q(A, N, M)))
    }
    function H(A, N, M, q, ue) {
        const d = k(A, N);
        if (d)
            return d;
        const h = N === St
          , _ = en ? history.state : {};
        M && (q || h ? r.replace(A.fullPath, he({
            scroll: h && _ && _.scroll
        }, ue)) : r.push(A.fullPath, ue)),
        c.value = A,
        ke(A, N, M, h),
        Oe()
    }
    let ie;
    function We() {
        ie || (ie = r.listen((A,N,M)=>{
            if (!bt.listening)
                return;
            const q = L(A)
              , ue = ee(q);
            if (ue) {
                se(he(ue, {
                    replace: !0
                }), q).catch(Sn);
                return
            }
            a = q;
            const d = c.value;
            en && Qu(Ss(d.fullPath, M.delta), Co()),
            G(q, d).catch(h=>yt(h, 12) ? h : yt(h, 2) ? (se(h.to, q).then(_=>{
                yt(_, 20) && !M.delta && M.type === Nn.pop && r.go(-1, !1)
            }
            ).catch(Sn),
            Promise.reject()) : (M.delta && r.go(-M.delta, !1),
            R(h, q, d))).then(h=>{
                h = h || H(q, d, !1),
                h && (M.delta && !yt(h, 8) ? r.go(-M.delta, !1) : M.type === Nn.pop && yt(h, 20) && r.go(-1, !1)),
                de(q, d, h)
            }
            ).catch(Sn)
        }
        ))
    }
    let Qe = yn(), ve = yn(), fe;
    function R(A, N, M) {
        Oe(A);
        const q = ve.list();
        return q.length ? q.forEach(ue=>ue(A, N, M)) : console.error(A),
        Promise.reject(A)
    }
    function le() {
        return fe && c.value !== St ? Promise.resolve() : new Promise((A,N)=>{
            Qe.add([A, N])
        }
        )
    }
    function Oe(A) {
        return fe || (fe = !A,
        We(),
        Qe.list().forEach(([N,M])=>A ? M(A) : N()),
        Qe.reset()),
        A
    }
    function ke(A, N, M, q) {
        const {scrollBehavior: ue} = e;
        if (!en || !ue)
            return Promise.resolve();
        const d = !M && Yu(Ss(A.fullPath, 0)) || (q || !M) && history.state && history.state.scroll || null;
        return di().then(()=>ue(A, N, d)).then(h=>h && Ku(h)).catch(h=>R(h, A, N))
    }
    const Re = A=>r.go(A);
    let tt;
    const _t = new Set
      , bt = {
        currentRoute: c,
        listening: !0,
        addRoute: g,
        removeRoute: w,
        hasRoute: O,
        getRoutes: S,
        resolve: L,
        options: e,
        push: P,
        replace: D,
        go: Re,
        back: ()=>Re(-1),
        forward: ()=>Re(1),
        beforeEach: s.add,
        beforeResolve: i.add,
        afterEach: l.add,
        onError: ve.add,
        isReady: le,
        install(A) {
            const N = this;
            A.component("RouterLink", Lf),
            A.component("RouterView", Bf),
            A.config.globalProperties.$router = N,
            Object.defineProperty(A.config.globalProperties, "$route", {
                enumerable: !0,
                get: ()=>K(c)
            }),
            en && !tt && c.value === St && (tt = !0,
            P(r.location).catch(ue=>{}
            ));
            const M = {};
            for (const ue in St)
                Object.defineProperty(M, ue, {
                    get: ()=>c.value[ue],
                    enumerable: !0
                });
            A.provide(Ao, N),
            A.provide(cl, si(M)),
            A.provide(ir, c);
            const q = A.unmount;
            _t.add(A),
            A.unmount = function() {
                _t.delete(A),
                _t.size < 1 && (a = St,
                ie && ie(),
                ie = null,
                c.value = St,
                tt = !1,
                fe = !1),
                q()
            }
        }
    };
    function Be(A) {
        return A.reduce((N,M)=>N.then(()=>oe(M)), Promise.resolve())
    }
    return bt
}
function Ff(e, t) {
    const n = []
      , o = []
      , r = []
      , s = Math.max(t.matched.length, e.matched.length);
    for (let i = 0; i < s; i++) {
        const l = t.matched[i];
        l && (e.matched.find(a=>un(a, l)) ? o.push(l) : n.push(l));
        const c = e.matched[i];
        c && (t.matched.find(a=>un(a, c)) || r.push(c))
    }
    return [n, o, r]
}
function Br() {
    return Ue(Ao)
}
const Df = xe({
    __name: "base.preset",
    props: Ft({
        extends: {},
        slides: {}
    }, El),
    setup(e) {
        const t = e
          , {slides: n} = Ke(t)
          , o = Br()
          , r = J(()=>n.value.length)
          , s = J(()=>{
            const p = o.currentRoute.value.query.page || 0
              , g = Number(p);
            return Number.isNaN(g) ? 0 : Kt(g, 0, r.value - 1)
        }
        )
          , i = we(s.value);
        He(s, f=>{
            i.value = f
        }
        , {
            immediate: !0
        }),
        He(i, (f,p)=>{
            if (f === p || p === void 0)
                return;
            const g = o.currentRoute.value.query;
            o.push({
                query: {
                    ...g,
                    page: f === 0 ? void 0 : f
                }
            })
        }
        , {
            immediate: !0
        });
        const l = f=>{
            i.value = Kt(f, 0, r.value - 1)
        }
        ;
        return Xt(Qi, {
            set: l,
            next: ()=>{
                l(i.value + 1)
            }
            ,
            back: ()=>{
                l(i.value - 1)
            }
            ,
            index: i,
            length: r
        }),
        (f,p)=>(Q(),
        ge(K(Mu), {
            modelValue: i.value,
            "onUpdate:modelValue": p[0] || (p[0] = g=>i.value = g),
            "items-count": 1,
            items: K(n)
        }, {
            default: At(({item: g, index: w})=>[Ee(K(ru), De(g, {
                active: i.value === w,
                extends: String(g.extends || "slide")
            }), null, 16, ["active", "extends"])]),
            _: 1
        }, 8, ["modelValue", "items"]))
    }
})
  , Hf = {
    type: "icon",
    src: "checkmark-fill"
}
  , jf = {
    title: "Title",
    description: "",
    list: ()=>[]
}
  , qf = {
    text: ""
}
  , Uf = xe({
    __name: "Emodji",
    props: {
        type: {},
        src: {},
        size: {},
        style: {}
    },
    setup(e) {
        const t = e;
        Mr(i=>({
            a01775ae: r.value,
            "34c56624": s.value
        }));
        const {size: n} = Ke(t)
          , o = J(()=>{
            const i = n == null ? void 0 : n.value;
            return i ? typeof i == "number" ? {
                width: `${i}px`,
                height: `${i}px`
            } : {
                width: `${i[0]}px`,
                height: `${i[1]}px`
            } : {
                width: "1.625em",
                height: "1.625em"
            }
        }
        )
          , r = J(()=>o.value.width)
          , s = J(()=>o.value.height);
        return (i,l)=>(Q(),
        be("div", De(t, {
            class: i.$style.emodji
        }), [it("span", {
            class: Pe(i.$style.text)
        }, dr(i.src), 3)], 16))
    }
})
  , Vf = "_emodji_wlgoy_1"
  , zf = "_text_wlgoy_16"
  , Kf = {
    emodji: Vf,
    text: zf
}
  , Qf = {
    $style: Kf
}
  , Yf = Ze(Uf, [["__cssModules", Qf]])
  , al = Symbol()
  , Xf = {
    install(e, t) {
        const n = we(t.default)
          , o = we(t.messages || {});
        e.provide(al, {
            fallbackLocale: t.default,
            locale: n,
            loaders: t.asyncLocales,
            messages: o
        })
    }
}
  , Jf = e=>typeof e == "function" ? J(e) : we(e)
  , lr = (e,t)=>{
    const [n,...o] = t.split(".");
    if (n in e && o.length === 0)
        return e[n];
    if (n in e)
        return lr(e[n], o.join("."))
}
;
function Hn() {
    const e = Ue(al)
      , t = Object.keys(e.loaders || {})
      , n = Object.keys(e.messages.value || {})
      , o = new Set([...t, ...n])
      , r = a=>{
        if (!e)
            return Promise.reject("Not found i18n instance");
        const u = e.loaders[a];
        return u ? u.then(f=>f.default) : Promise.reject("Not found locale")
    }
      , s = (a,u)=>{
        if (!e)
            return;
        const f = e.messages.value;
        e.messages.value = {
            ...f,
            [a]: u
        }
    }
      , i = J(()=>{
        var f, p;
        const a = (f = e == null ? void 0 : e.locale) == null ? void 0 : f.value;
        return a ? ((p = e == null ? void 0 : e.messages.value) == null ? void 0 : p[a]) || {} : {}
    }
    )
      , l = (a,u)=>{
        var O, L, y;
        if (typeof a != "string")
            return a;
        if (!a)
            return u ?? a;
        const f = (O = e == null ? void 0 : e.locale) == null ? void 0 : O.value
          , p = ((L = e == null ? void 0 : e.messages.value) == null ? void 0 : L[f]) || {}
          , g = lr(p, `${a}`);
        if (g)
            return g;
        const w = ((y = e.messages.value) == null ? void 0 : y[e.fallbackLocale]) || {};
        return lr(w, `${a}`) ?? u ?? a
    }
      , c = (a,u)=>{
        const f = Jf(a);
        return J(()=>{
            i.value,
            e.messages.value;
            const p = f.value;
            return typeof p != "string" ? p : l(p, u)
        }
        )
    }
    ;
    return {
        fallbackLocale: e.fallbackLocale || "en",
        available: Array.from(o),
        load: r,
        setMessages: s,
        locale: e.locale,
        messages: e.messages,
        useTranslated: c,
        translate: l
    }
}
const Gf = (e,t)=>{
    const n = e[t];
    return n ? typeof n == "function" ? n() : Promise.resolve(n) : new Promise((o,r)=>{
        (typeof queueMicrotask == "function" ? queueMicrotask : setTimeout)(r.bind(null, new Error("Unknown variable dynamic import: " + t)))
    }
    )
}
;
function ul() {}
const Zf = 5e3
  , Xn = {
    type: "success",
    autoClose: 5e3,
    data: void 0,
    hasClose: !0,
    onClose: ul
};
function ep() {
    const e = we([])
      , t = new Map
      , n = s=>{
        const i = t.get(s);
        i && clearTimeout(i),
        t.delete(s),
        e.value = e.value.filter(({id: l})=>l !== s)
    }
    ;
    return {
        alerts: e,
        close: n,
        closeLast: ()=>{
            const s = e.value[0];
            s && n(s.id)
        }
        ,
        show: (s,i,l=Xn)=>{
            const {type: c=Xn.type, autoClose: a=Xn.autoClose, hasClose: u=Xn.hasClose, onClose: f} = l;
            if (e.value = e.value.concat({
                id: s,
                content: i,
                type: c,
                closable: u,
                data: l.data,
                onClose: f
            }),
            a) {
                const g = setTimeout(()=>{
                    n(s)
                }
                , typeof a == "number" ? a : Zf);
                t.set(s, g)
            }
        }
    }
}
const fl = Symbol()
  , tp = " "
  , ph = ","
  , np = {
    align: "left",
    currency: "USD",
    decimalSeparator: ".",
    thousandSeparator: tp
}
  , op = Symbol()
  , rp = Symbol()
  , sp = Symbol()
  , ip = xe({
    __name: "SvgIcon",
    props: {
        name: {},
        size: {},
        rotate: {
            type: Boolean
        }
    },
    setup(e) {
        const t = e
          , {name: n, size: o} = Ke(t)
          , r = Ue(rp, {})
          , s = J(()=>{
            const c = n.value;
            return c ? r[c] ?? Lt(()=>Gf(Object.assign({
                "./icons/arrow-left.svg": ()=>_e(()=>import("./arrow-left-9934111f.js"), []),
                "./icons/arrow-right.svg": ()=>_e(()=>import("./arrow-right-eea6f530.js"), []),
                "./icons/checkmark-fill.svg": ()=>_e(()=>import("./checkmark-fill-8f956851.js"), []),
                "./icons/checkmark.svg": ()=>_e(()=>import("./checkmark-49c990fd.js"), []),
                "./icons/close.svg": ()=>_e(()=>import("./close-732477c8.js"), []),
                "./icons/spinner.svg": ()=>_e(()=>import("./spinner-18a2299f.js"), []),
                "./icons/warning-fill.svg": ()=>_e(()=>import("./warning-fill-3a638dd4.js"), [])
            }), `./icons/${c}.svg`)) : void 0
        }
        )
          , i = c=>`${c}px`
          , l = J(()=>{
            const c = o == null ? void 0 : o.value
              , [a,u] = c ? typeof c == "number" ? [i(c), i(c)] : [i(c[0]), i(c[1])] : ["1.5em", "1.5em"];
            return {
                "--tok-svg-icon-width": a,
                "--tok-svg-icon-height": u
            }
        }
        );
        return (c,a)=>(Q(),
        be("span", {
            class: Pe([c.$style.icon, c.rotate && c.$style.icon_rotate]),
            style: Wt(l.value)
        }, [Je(c.$slots, "default", {}, ()=>[(Q(),
        ge(gn(s.value), {
            tabindex: "-1",
            focusable: "false",
            "aria-hidden": "true",
            width: "100%",
            height: "100%"
        }))])], 6))
    }
})
  , lp = "_icon_1jtq6_1"
  , cp = "_icon_rotate_1jtq6_12"
  , ap = {
    icon: lp,
    icon_rotate: cp
}
  , up = {
    $style: ap
}
  , sn = Ze(ip, [["__cssModules", up]])
  , fp = xe({
    __name: "Icon",
    props: {
        type: {},
        src: {
            default: ""
        },
        style: {},
        size: {},
        rotate: {
            type: Boolean
        }
    },
    setup(e) {
        const t = e
          , {src: n} = Ke(t)
          , o = J(()=>n.value && typeof n.value == "string" ? n.value : "")
          , s = Hn().useTranslated(o)
          , i = J(()=>{
            const c = s.value;
            if (typeof c == "object" && "then"in c)
                return Lt(()=>c);
            const a = n.value;
            return typeof a == "object" && "then"in a ? Lt(()=>a) : null
        }
        )
          , l = J(()=>{
            const c = s.value;
            return typeof c == "string" ? c : ""
        }
        );
        return (c,a)=>(Q(),
        ge(K(sn), De(t, {
            name: l.value
        }), {
            default: At(()=>[i.value ? (Q(),
            ge(gn(i.value), {
                key: 0,
                tabindex: "-1",
                focusable: "false",
                "aria-hidden": "true",
                width: "100%",
                height: "100%"
            })) : $e("", !0)]),
            _: 1
        }, 16, ["name"]))
    }
});
function pp(e) {
    return typeof e == "function" ? J(e) : we(e)
}
function ao(e="") {
    const t = pp(e)
      , n = J(()=>{
        const s = t.value;
        return s && typeof s == "object" && "then"in s ? s : null
    }
    )
      , o = we()
      , r = s=>{
        s.then(i=>{
            o.value = i.default
        }
        )
    }
    ;
    return He(n, s=>{
        s && r(s)
    }
    , {
        immediate: !0
    }),
    o
}
const dp = ["srcset"]
  , hp = ["src"]
  , mp = xe({
    __name: "Image",
    props: {
        type: {},
        src: {},
        webp: {},
        style: {},
        static: {
            type: Boolean
        }
    },
    setup(e) {
        const t = e
          , {src: n, webp: o} = Ke(t)
          , r = ao(n)
          , s = ao(o);
        return (i,l)=>i.type === "image" ? (Q(),
        be("picture", De({
            key: 0
        }, t, {
            class: i.$style.container
        }), [K(o) ? (Q(),
        be("source", {
            key: 0,
            type: "image/webp",
            srcset: K(s)
        }, null, 8, dp)) : $e("", !0), it("img", De({
            ...i.$attrs,
            ...t
        }, {
            src: K(r),
            class: [i.$style.img, i.static && i.$style.img_static]
        }), null, 16, hp)], 16)) : $e("", !0)
    }
})
  , gp = "_container_148ou_1"
  , vp = "_img_148ou_5"
  , _p = "_img_static_148ou_9"
  , bp = {
    container: gp,
    img: vp,
    img_static: _p
}
  , yp = {
    $style: bp
}
  , wp = Ze(mp, [["__cssModules", yp]])
  , Ep = xe({
    __name: "Sticker",
    props: {
        type: {},
        src: {
            default: null
        },
        size: {},
        style: {},
        speed: {}
    },
    setup(e) {
        const t = e;
        Mr(u=>({
            "66e92362": c.value,
            "6a870b9e": l.value
        }));
        const n = Lt(()=>_e(()=>import("./index-25cf66ac.js"), []).then(u=>u.Sticker))
          , {src: o, size: r} = Ke(t)
          , s = we()
          , i = J(()=>{
            const u = r == null ? void 0 : r.value;
            return u ? typeof u == "number" ? {
                width: `${u}px`,
                height: `${u}px`
            } : {
                width: `${u[0]}px`,
                height: `${u[1]}px`
            } : {
                width: "100%",
                height: "100%"
            }
        }
        )
          , l = J(()=>i.value.width)
          , c = J(()=>i.value.height)
          , a = u=>{
            u.then(f=>{
                s.value = f.default
            }
            )
        }
        ;
        return He(o, u=>{
            if (u && typeof u == "string") {
                console.error('Sticker Preset: The sticker src is string. You need to use import like that: `import("./assets/.tgs")`. Otherwise it won\'t loaded');
                return
            }
            u && typeof u == "object" && "then"in u && a(u)
        }
        , {
            immediate: !0
        }),
        (u,f)=>(Q(),
        be("div", De(t, {
            class: u.$style.container
        }), [s.value ? (Q(),
        ge(gn(K(n)), De({
            key: 0
        }, t, {
            json: s.value,
            class: u.$style.sticker
        }), null, 16, ["json", "class"])) : $e("", !0)], 16))
    }
})
  , Cp = "_container_1ev5v_1"
  , Ap = "_sticker_1ev5v_7"
  , Pp = {
    container: Cp,
    sticker: Ap
}
  , Tp = {
    $style: Pp
}
  , xp = Ze(Ep, [["__cssModules", Tp]])
  , kp = ["poster"]
  , Sp = ["src"]
  , Op = it("br", null, null, -1)
  , Rp = xe({
    __name: "VideoPreset",
    props: {
        type: {},
        src: {},
        poster: {},
        style: {}
    },
    setup(e) {
        const t = e
          , {src: n, poster: o} = Ke(t)
          , r = ao(n)
          , s = ao(o)
          , i = we(null)
          , l = Ue(ml, we(!1))
          , c = we(NaN)
          , a = we(!1)
          , u = ()=>{
            c.value = Date.now()
        }
          , f = ()=>{
            a.value = !0
        }
        ;
        return He([i, r, l, c], ([p],g,w)=>{
            w(()=>{
                p == null || p.removeEventListener("play", f)
            }
            ),
            p && (p.addEventListener("play", f),
            p.play().catch(ul))
        }
        , {
            immediate: !0
        }),
        (p,g)=>(Q(),
        be("div", De(t, {
            class: p.$style.container
        }), [K(r) ? (Q(),
        be("video", {
            key: 0,
            ref_key: "videoRef",
            ref: i,
            playsinline: "",
            muted: "",
            loop: "",
            controls: !1,
            class: Pe(p.$style.video),
            poster: K(s)
        }, [it("source", {
            src: K(r),
            type: "video/mp4"
        }, null, 8, Sp), xn(" Your browser does not support the video tag. ")], 10, kp)) : $e("", !0), a.value ? $e("", !0) : (Q(),
        be("div", {
            key: 1,
            class: Pe(p.$style.tapAnimation)
        }, null, 2)), a.value ? $e("", !0) : (Q(),
        be("button", {
            key: 2,
            class: Pe(p.$style.fallback),
            onClick: u
        }, [xn(" Video not playing?"), Op, xn("Tap here ")], 2))], 16))
    }
})
  , Ip = "_container_1q2x9_1"
  , Lp = "_video_1q2x9_6"
  , $p = "_fallback_1q2x9_16"
  , Mp = "_tapAnimation_1q2x9_35"
  , Wp = "__tapAnimation_1q2x9_1"
  , Bp = {
    container: Ip,
    video: Lp,
    fallback: $p,
    tapAnimation: Mp,
    _tapAnimation: Wp
}
  , Np = {
    $style: Bp
}
  , Fp = Ze(Rp, [["__cssModules", Np]])
  , pl = xe({
    __name: "Media.preset",
    props: {
        type: {},
        src: {},
        style: {},
        size: {},
        rotate: {
            type: Boolean
        },
        speed: {},
        webp: {},
        static: {
            type: Boolean
        },
        poster: {}
    },
    setup(e) {
        const t = e;
        return (n,o)=>n.type === "image" ? (Q(),
        ge(wp, _n(De({
            key: 0
        }, t)), null, 16)) : n.type === "sticker" ? (Q(),
        ge(xp, _n(De({
            key: 1
        }, t)), null, 16)) : n.type === "icon" ? (Q(),
        ge(fp, _n(De({
            key: 2
        }, t)), null, 16)) : n.type === "video" ? (Q(),
        ge(Fp, _n(De({
            key: 3
        }, t)), null, 16)) : n.type === "emodji" ? (Q(),
        ge(Yf, _n(De({
            key: 4
        }, t)), null, 16)) : $e("", !0)
    }
})
  , Dp = ["innerHTML"]
  , Hp = xe({
    __name: "ListItem",
    props: Ft({
        text: {},
        media: {}
    }, qf),
    setup(e) {
        const t = e
          , {text: n} = Ke(t)
          , r = Hn().useTranslated(n);
        return (s,i)=>(Q(),
        be("li", {
            class: Pe(s.$style.li)
        }, [s.media ? (Q(),
        ge(K(pl), De({
            key: 0
        }, s.media, {
            static: "",
            class: s.$style.media
        }), null, 16, ["class"])) : $e("", !0), it("span", {
            innerHTML: K(r)
        }, null, 8, Dp)], 2))
    }
})
  , jp = "_li_19yp8_1"
  , qp = "_media_19yp8_7"
  , Up = {
    li: jp,
    media: qp
}
  , Vp = {
    $style: Up
}
  , zp = Ze(Hp, [["__cssModules", Vp]])
  , Kp = {
    button: "Next",
    textAlign: "left",
    shape: "square"
};
(function() {
    var e = {}
      , t = "";
    try {
        t = location.hash.toString()
    } catch {}
    var n = c(t)
      , o = L("initParams");
    if (o)
        for (var r in o)
            typeof n[r] > "u" && (n[r] = o[r]);
    O("initParams", n);
    var s = !1, i;
    try {
        if (s = window.parent != null && window != window.parent,
        s) {
            window.addEventListener("message", function(y) {
                if (y.source === window.parent) {
                    try {
                        var k = JSON.parse(y.data)
                    } catch {
                        return
                    }
                    !k || !k.eventType || (k.eventType == "set_custom_style" ? i.innerHTML = k.eventData : p(k.eventType, k.eventData))
                }
            }),
            i = document.createElement("style"),
            document.head.appendChild(i);
            try {
                window.parent.postMessage(JSON.stringify({
                    eventType: "iframe_ready"
                }), "*")
            } catch {}
        }
    } catch {}
    function l(y) {
        try {
            return y = y.replace(/\+/g, "%20"),
            decodeURIComponent(y)
        } catch {
            return y
        }
    }
    function c(y) {
        y = y.replace(/^#/, "");
        var k = {};
        if (!y.length)
            return k;
        if (y.indexOf("=") < 0 && y.indexOf("?") < 0)
            return k._path = l(y),
            k;
        var P = y.indexOf("?");
        if (P >= 0) {
            var D = y.substr(0, P);
            k._path = l(D),
            y = y.substr(P + 1)
        }
        var ee = a(y);
        for (var se in ee)
            k[se] = ee[se];
        return k
    }
    function a(y) {
        var k = {};
        if (!y.length)
            return k;
        var P = y.split("&"), D, ee, se, j;
        for (D = 0; D < P.length; D++)
            ee = P[D].split("="),
            se = l(ee[0]),
            j = ee[1] == null ? null : l(ee[1]),
            k[se] = j;
        return k
    }
    function u(y, k) {
        var P = y.indexOf("#");
        if (P < 0)
            return y + "#" + k;
        var D = y.substr(P + 1);
        return D.indexOf("=") >= 0 || D.indexOf("?") >= 0 ? y + "&" + k : D.length > 0 ? y + "?" + k : y + k
    }
    function f(y, k, P) {
        if (k || (k = function() {}
        ),
        P === void 0 && (P = ""),
        console.log("[Telegram.WebView] > postEvent", y, P),
        window.TelegramWebviewProxy !== void 0)
            TelegramWebviewProxy.postEvent(y, JSON.stringify(P)),
            k();
        else if (window.external && "notify"in window.external)
            window.external.notify(JSON.stringify({
                eventType: y,
                eventData: P
            })),
            k();
        else if (s)
            try {
                var D = "https://web.telegram.org";
                D = "*",
                window.parent.postMessage(JSON.stringify({
                    eventType: y,
                    eventData: P
                }), D),
                k()
            } catch (ee) {
                k(ee)
            }
        else
            k({
                notAvailable: !0
            })
    }
    function p(y, k) {
        console.log("[Telegram.WebView] < receiveEvent", y, k),
        g(y, function(P) {
            P(y, k)
        })
    }
    function g(y, k) {
        var P = e[y];
        if (!(P === void 0 || !P.length))
            for (var D = 0; D < P.length; D++)
                try {
                    k(P[D])
                } catch {}
    }
    function w(y, k) {
        e[y] === void 0 && (e[y] = []);
        var P = e[y].indexOf(k);
        P === -1 && e[y].push(k)
    }
    function S(y, k) {
        if (e[y] !== void 0) {
            var P = e[y].indexOf(k);
            P !== -1 && e[y].splice(P, 1)
        }
    }
    function O(y, k) {
        try {
            return window.sessionStorage.setItem("__telegram__" + y, JSON.stringify(k)),
            !0
        } catch {}
        return !1
    }
    function L(y) {
        try {
            return JSON.parse(window.sessionStorage.getItem("__telegram__" + y))
        } catch {}
        return null
    }
    window.Telegram || (window.Telegram = {}),
    window.Telegram.WebView = {
        initParams: n,
        isIframe: s,
        onEvent: w,
        offEvent: S,
        postEvent: f,
        receiveEvent: p,
        callEventCallbacks: g
    },
    window.Telegram.Utils = {
        urlSafeDecode: l,
        urlParseQueryString: a,
        urlParseHashParams: c,
        urlAppendHashParams: u,
        sessionStorageSet: O,
        sessionStorageGet: L
    },
    window.TelegramGameProxy_receiveEvent = p,
    window.TelegramGameProxy = {
        receiveEvent: p
    }
}
)();
(function() {
    var e = window.Telegram.Utils
      , t = window.Telegram.WebView
      , n = t.initParams
      , o = t.isIframe
      , r = {}
      , s = ""
      , i = {}
      , l = {}
      , c = "light"
      , a = "6.0"
      , u = "unknown";
    if (n.tgWebAppData && n.tgWebAppData.length) {
        s = n.tgWebAppData,
        i = e.urlParseQueryString(s);
        for (var f in i) {
            var p = i[f];
            try {
                (p.substr(0, 1) == "{" && p.substr(-1) == "}" || p.substr(0, 1) == "[" && p.substr(-1) == "]") && (i[f] = JSON.parse(p))
            } catch {}
        }
    }
    if (n.tgWebAppThemeParams && n.tgWebAppThemeParams.length) {
        var g = n.tgWebAppThemeParams;
        try {
            var w = JSON.parse(g);
            w && oe(w)
        } catch {}
    }
    var w = e.sessionStorageGet("themeParams");
    w && oe(w),
    n.tgWebAppVersion && (a = n.tgWebAppVersion),
    n.tgWebAppPlatform && (u = n.tgWebAppPlatform);
    function S(m, v) {
        v.theme_params && (oe(v.theme_params),
        window.Telegram.WebApp.MainButton.setParams({}),
        M(),
        D("themeChanged"))
    }
    var O = window.innerHeight;
    function L(m, v) {
        v.height && (window.removeEventListener("resize", y),
        Qe(v))
    }
    function y(m) {
        O != window.innerHeight && (O = window.innerHeight,
        D("viewportChanged", {
            isStateStable: !0
        }))
    }
    function k(m) {
        if (!(m.metaKey || m.ctrlKey)) {
            for (var v = m.target; v.tagName != "A" && v.parentNode; )
                v = v.parentNode;
            v.tagName == "A" && v.target != "_blank" && (v.protocol == "http:" || v.protocol == "https:") && v.hostname == "t.me" && (r.openTgLink(v.href),
            m.preventDefault())
        }
    }
    function P(m) {
        return m.toString().replace(/^\s+|\s+$/g, "")
    }
    function D(m) {
        var v = Array.prototype.slice.call(arguments);
        m = v.shift(),
        t.callEventCallbacks("webview:" + m, function(b) {
            b.apply(r, v)
        })
    }
    function ee(m, v) {
        t.onEvent("webview:" + m, v)
    }
    function se(m, v) {
        t.offEvent("webview:" + m, v)
    }
    function j(m, v) {
        var b = document.documentElement;
        b && b.style && b.style.setProperty && b.style.setProperty("--tg-" + m, v)
    }
    function oe(m) {
        m.bg_color == "#1c1c1d" && m.bg_color == m.secondary_bg_color && (m.secondary_bg_color = "#2c2c2e");
        var v;
        for (var b in m)
            (v = q(m[b])) && (l[b] = v,
            b == "bg_color" && (c = ue(v) ? "dark" : "light",
            j("color-scheme", c)),
            b = "theme-" + b.split("_").join("-"),
            j(b, v));
        e.sessionStorageSet("themeParams", l)
    }
    var G = {};
    function de(m) {
        for (var v = 100; --v; ) {
            for (var b = "", $ = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", Z = $.length, Ce = 0; Ce < m; Ce++)
                b += $[Math.floor(Math.random() * Z)];
            if (!G[b])
                return G[b] = {},
                b
        }
        throw Error("WebAppCallbackIdGenerateFailed")
    }
    var H = !1
      , ie = !1
      , We = !0;
    function Qe(m) {
        typeof m < "u" && (We = !!m.is_expanded,
        H = m.height,
        m.is_state_stable && (ie = m.height),
        D("viewportChanged", {
            isStateStable: !!m.is_state_stable
        }));
        var v, b;
        H !== !1 ? v = H - C + "px" : v = C ? "calc(100vh - " + C + "px)" : "100vh",
        ie !== !1 ? b = ie - C + "px" : b = C ? "calc(100vh - " + C + "px)" : "100vh",
        j("viewport-height", v),
        j("viewport-stable-height", b)
    }
    var ve = !1;
    function fe(m) {
        if (!h("6.2")) {
            console.warn("[Telegram.WebApp] Closing confirmation is not supported in version " + a);
            return
        }
        ve = !!m,
        t.postEvent("web_app_setup_closing_behavior", !1, {
            need_confirmation: ve
        })
    }
    var R = "bg_color"
      , le = null;
    function Oe() {
        return R == "secondary_bg_color" ? l.secondary_bg_color : R == "bg_color" ? l.bg_color : le
    }
    function ke(m) {
        if (!h("6.1")) {
            console.warn("[Telegram.WebApp] Header color is not supported in version " + a);
            return
        }
        h("6.9") || (l.bg_color && l.bg_color == m ? m = "bg_color" : l.secondary_bg_color && l.secondary_bg_color == m && (m = "secondary_bg_color"));
        var v = null
          , b = null;
        if (m == "bg_color" || m == "secondary_bg_color")
            b = m;
        else if (h("6.9") && (v = q(m),
        !v))
            throw console.error("[Telegram.WebApp] Header color format is invalid", m),
            Error("WebAppHeaderColorInvalid");
        if (!h("6.9") && b != "bg_color" && b != "secondary_bg_color")
            throw console.error("[Telegram.WebApp] Header color key should be one of Telegram.WebApp.themeParams.bg_color, Telegram.WebApp.themeParams.secondary_bg_color, 'bg_color', 'secondary_bg_color'", m),
            Error("WebAppHeaderColorKeyInvalid");
        R = b,
        le = v,
        _t()
    }
    var Re = null
      , tt = null;
    function _t() {
        (Re != R || tt != le) && (Re = R,
        tt = le,
        tt ? t.postEvent("web_app_set_header_color", !1, {
            color: le
        }) : t.postEvent("web_app_set_header_color", !1, {
            color_key: R
        }))
    }
    var bt = "bg_color";
    function Be() {
        return bt == "secondary_bg_color" ? l.secondary_bg_color : bt == "bg_color" ? l.bg_color : bt
    }
    function A(m) {
        if (!h("6.1")) {
            console.warn("[Telegram.WebApp] Background color is not supported in version " + a);
            return
        }
        var v;
        if (m == "bg_color" || m == "secondary_bg_color")
            v = m;
        else if (v = q(m),
        !v)
            throw console.error("[Telegram.WebApp] Background color format is invalid", m),
            Error("WebAppBackgroundColorInvalid");
        bt = v,
        M()
    }
    var N = null;
    function M() {
        var m = Be();
        N != m && (N = m,
        t.postEvent("web_app_set_background_color", !1, {
            color: m
        }))
    }
    function q(m) {
        m += "";
        var v;
        if (v = /^\s*#([0-9a-f]{6})\s*$/i.exec(m))
            return "#" + v[1].toLowerCase();
        if (v = /^\s*#([0-9a-f])([0-9a-f])([0-9a-f])\s*$/i.exec(m))
            return ("#" + v[1] + v[1] + v[2] + v[2] + v[3] + v[3]).toLowerCase();
        if (v = /^\s*rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)\s*$/.exec(m)) {
            var b = parseInt(v[1])
              , $ = parseInt(v[2])
              , Z = parseInt(v[3]);
            return b = (b < 16 ? "0" : "") + b.toString(16),
            $ = ($ < 16 ? "0" : "") + $.toString(16),
            Z = (Z < 16 ? "0" : "") + Z.toString(16),
            "#" + b + $ + Z
        }
        return !1
    }
    function ue(m) {
        m = m.replace(/[\s#]/g, ""),
        m.length == 3 && (m = m[0] + m[0] + m[1] + m[1] + m[2] + m[2]);
        var v = parseInt(m.substr(0, 2), 16)
          , b = parseInt(m.substr(2, 2), 16)
          , $ = parseInt(m.substr(4, 2), 16)
          , Z = Math.sqrt(.299 * (v * v) + .587 * (b * b) + .114 * ($ * $));
        return Z < 120
    }
    function d(m, v) {
        typeof m != "string" && (m = ""),
        typeof v != "string" && (v = ""),
        m = m.replace(/^\s+|\s+$/g, "").split("."),
        v = v.replace(/^\s+|\s+$/g, "").split(".");
        var b = Math.max(m.length, v.length), $, Z, Ce;
        for ($ = 0; $ < b; $++)
            if (Z = parseInt(m[$]) || 0,
            Ce = parseInt(v[$]) || 0,
            Z != Ce)
                return Z > Ce ? 1 : -1;
        return 0
    }
    function h(m) {
        return d(a, m) >= 0
    }
    function _(m) {
        if (window.Blob)
            try {
                return new Blob([m]).size
            } catch {}
        for (var v = m.length, b = m.length - 1; b >= 0; b--) {
            var $ = m.charCodeAt(b);
            $ > 127 && $ <= 2047 ? v++ : $ > 2047 && $ <= 65535 && (v += 2),
            $ >= 56320 && $ <= 57343 && b--
        }
        return v
    }
    var E = function() {
        var m = !1
          , v = {};
        Object.defineProperty(v, "isVisible", {
            set: function(Se) {
                Le({
                    is_visible: Se
                })
            },
            get: function() {
                return m
            },
            enumerable: !0
        });
        var b = null;
        t.onEvent("back_button_pressed", $);
        function $() {
            D("backButtonClicked")
        }
        function Z() {
            return {
                is_visible: m
            }
        }
        function Ce(Se) {
            return typeof Se > "u" && (Se = Z()),
            JSON.stringify(Se)
        }
        function te() {
            return h("6.1") ? !0 : (console.warn("[Telegram.WebApp] BackButton is not supported in version " + a),
            !1)
        }
        function lt() {
            var Se = Z()
              , Ve = Ce(Se);
            b !== Ve && (b = Ve,
            t.postEvent("web_app_setup_back_button", !1, Se))
        }
        function Le(Se) {
            return te() && (typeof Se.is_visible < "u" && (m = !!Se.is_visible),
            lt()),
            v
        }
        return v.onClick = function(Se) {
            return te() && ee("backButtonClicked", Se),
            v
        }
        ,
        v.offClick = function(Se) {
            return te() && se("backButtonClicked", Se),
            v
        }
        ,
        v.show = function() {
            return Le({
                is_visible: !0
            })
        }
        ,
        v.hide = function() {
            return Le({
                is_visible: !1
            })
        }
        ,
        v
    }()
      , C = 0
      , x = function() {
        var m = !1
          , v = !0
          , b = !1
          , $ = "CONTINUE"
          , Z = !1
          , Ce = !1
          , te = {};
        Object.defineProperty(te, "text", {
            set: function(U) {
                te.setParams({
                    text: U
                })
            },
            get: function() {
                return $
            },
            enumerable: !0
        }),
        Object.defineProperty(te, "color", {
            set: function(U) {
                te.setParams({
                    color: U
                })
            },
            get: function() {
                return Z || l.button_color || "#2481cc"
            },
            enumerable: !0
        }),
        Object.defineProperty(te, "textColor", {
            set: function(U) {
                te.setParams({
                    text_color: U
                })
            },
            get: function() {
                return Ce || l.button_text_color || "#ffffff"
            },
            enumerable: !0
        }),
        Object.defineProperty(te, "isVisible", {
            set: function(U) {
                te.setParams({
                    is_visible: U
                })
            },
            get: function() {
                return m
            },
            enumerable: !0
        }),
        Object.defineProperty(te, "isProgressVisible", {
            get: function() {
                return b
            },
            enumerable: !0
        }),
        Object.defineProperty(te, "isActive", {
            set: function(U) {
                te.setParams({
                    is_active: U
                })
            },
            get: function() {
                return v
            },
            enumerable: !0
        });
        var lt = null;
        t.onEvent("main_button_pressed", Tt);
        var Le = null
          , Se = {};
        if (n.tgWebAppDebug) {
            Le = document.createElement("tg-main-button"),
            Se = {
                font: "600 14px/18px sans-serif",
                display: "none",
                width: "100%",
                height: "48px",
                borderRadius: "0",
                background: "no-repeat right center",
                position: "fixed",
                left: "0",
                right: "0",
                bottom: "0",
                margin: "0",
                padding: "15px 20px",
                textAlign: "center",
                boxSizing: "border-box",
                zIndex: "10000"
            };
            for (var Ve in Se)
                Le.style[Ve] = Se[Ve];
            document.addEventListener("DOMContentLoaded", function U(dt) {
                document.removeEventListener("DOMContentLoaded", U),
                document.body.appendChild(Le),
                Le.addEventListener("click", Tt, !1)
            })
        }
        function Tt() {
            v && D("mainButtonClicked")
        }
        function Nr() {
            var U = te.color
              , dt = te.textColor;
            return m ? {
                is_visible: !0,
                is_active: v,
                is_progress_visible: b,
                text: $,
                color: U,
                text_color: dt
            } : {
                is_visible: !1
            }
        }
        function vl(U) {
            return typeof U > "u" && (U = Nr()),
            JSON.stringify(U)
        }
        function To() {
            var U = Nr()
              , dt = vl(U);
            lt !== dt && (lt = dt,
            t.postEvent("web_app_setup_main_button", !1, U),
            n.tgWebAppDebug && _l(U))
        }
        function _l(U) {
            U.is_visible ? (Le.style.display = "block",
            C = 48,
            Le.style.opacity = U.is_active ? "1" : "0.8",
            Le.style.cursor = U.is_active ? "pointer" : "auto",
            Le.disabled = !U.is_active,
            Le.innerText = U.text,
            Le.style.backgroundImage = U.is_progress_visible ? "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20viewport%3D%220%200%2048%2048%22%20width%3D%2248px%22%20height%3D%2248px%22%3E%3Ccircle%20cx%3D%2250%25%22%20cy%3D%2250%25%22%20stroke%3D%22%23fff%22%20stroke-width%3D%222.25%22%20stroke-linecap%3D%22round%22%20fill%3D%22none%22%20stroke-dashoffset%3D%22106%22%20r%3D%229%22%20stroke-dasharray%3D%2256.52%22%20rotate%3D%22-90%22%3E%3Canimate%20attributeName%3D%22stroke-dashoffset%22%20attributeType%3D%22XML%22%20dur%3D%22360s%22%20from%3D%220%22%20to%3D%2212500%22%20repeatCount%3D%22indefinite%22%3E%3C%2Fanimate%3E%3CanimateTransform%20attributeName%3D%22transform%22%20attributeType%3D%22XML%22%20type%3D%22rotate%22%20dur%3D%221s%22%20from%3D%22-90%2024%2024%22%20to%3D%22630%2024%2024%22%20repeatCount%3D%22indefinite%22%3E%3C%2FanimateTransform%3E%3C%2Fcircle%3E%3C%2Fsvg%3E')" : "none",
            Le.style.backgroundColor = U.color,
            Le.style.color = U.text_color) : (Le.style.display = "none",
            C = 0),
            document.documentElement && (document.documentElement.style.boxSizing = "border-box",
            document.documentElement.style.paddingBottom = C + "px"),
            Qe()
        }
        function bl(U) {
            if (typeof U.text < "u") {
                var dt = P(U.text);
                if (!dt.length)
                    throw console.error("[Telegram.WebApp] Main button text is required", U.text),
                    Error("WebAppMainButtonParamInvalid");
                if (dt.length > 64)
                    throw console.error("[Telegram.WebApp] Main button text is too long", dt),
                    Error("WebAppMainButtonParamInvalid");
                $ = dt
            }
            if (typeof U.color < "u")
                if (U.color === !1 || U.color === null)
                    Z = !1;
                else {
                    var Fr = q(U.color);
                    if (!Fr)
                        throw console.error("[Telegram.WebApp] Main button color format is invalid", U.color),
                        Error("WebAppMainButtonParamInvalid");
                    Z = Fr
                }
            if (typeof U.text_color < "u")
                if (U.text_color === !1 || U.text_color === null)
                    Ce = !1;
                else {
                    var Dr = q(U.text_color);
                    if (!Dr)
                        throw console.error("[Telegram.WebApp] Main button text color format is invalid", U.text_color),
                        Error("WebAppMainButtonParamInvalid");
                    Ce = Dr
                }
            if (typeof U.is_visible < "u") {
                if (U.is_visible && !te.text.length)
                    throw console.error("[Telegram.WebApp] Main button text is required"),
                    Error("WebAppMainButtonParamInvalid");
                m = !!U.is_visible
            }
            return typeof U.is_active < "u" && (v = !!U.is_active),
            To(),
            te
        }
        return te.setText = function(U) {
            return te.setParams({
                text: U
            })
        }
        ,
        te.onClick = function(U) {
            return ee("mainButtonClicked", U),
            te
        }
        ,
        te.offClick = function(U) {
            return se("mainButtonClicked", U),
            te
        }
        ,
        te.show = function() {
            return te.setParams({
                is_visible: !0
            })
        }
        ,
        te.hide = function() {
            return te.setParams({
                is_visible: !1
            })
        }
        ,
        te.enable = function() {
            return te.setParams({
                is_active: !0
            })
        }
        ,
        te.disable = function() {
            return te.setParams({
                is_active: !1
            })
        }
        ,
        te.showProgress = function(U) {
            return v = !!U,
            b = !0,
            To(),
            te
        }
        ,
        te.hideProgress = function() {
            return te.isActive || (v = !0),
            b = !1,
            To(),
            te
        }
        ,
        te.setParams = bl,
        te
    }();
    function B() {
        D("settingsButtonClicked")
    }
    t.onEvent("settings_button_pressed", B);
    var I = function() {
        var m = {};
        function v(b) {
            if (!h("6.1"))
                return console.warn("[Telegram.WebApp] HapticFeedback is not supported in version " + a),
                m;
            if (b.type == "impact") {
                if (b.impact_style != "light" && b.impact_style != "medium" && b.impact_style != "heavy" && b.impact_style != "rigid" && b.impact_style != "soft")
                    throw console.error("[Telegram.WebApp] Haptic impact style is invalid", b.impact_style),
                    Error("WebAppHapticImpactStyleInvalid")
            } else if (b.type == "notification") {
                if (b.notification_type != "error" && b.notification_type != "success" && b.notification_type != "warning")
                    throw console.error("[Telegram.WebApp] Haptic notification type is invalid", b.notification_type),
                    Error("WebAppHapticNotificationTypeInvalid")
            } else if (b.type != "selection_change")
                throw console.error("[Telegram.WebApp] Haptic feedback type is invalid", b.type),
                Error("WebAppHapticFeedbackTypeInvalid");
            return t.postEvent("web_app_trigger_haptic_feedback", !1, b),
            m
        }
        return m.impactOccurred = function(b) {
            return v({
                type: "impact",
                impact_style: b
            })
        }
        ,
        m.notificationOccurred = function(b) {
            return v({
                type: "notification",
                notification_type: b
            })
        }
        ,
        m.selectionChanged = function() {
            return v({
                type: "selection_change"
            })
        }
        ,
        m
    }()
      , W = function() {
        var m = {};
        function v(b, $, Z) {
            if (!h("6.9"))
                throw console.error("[Telegram.WebApp] CloudStorage is not supported in version " + a),
                Error("WebAppMethodUnsupported");
            return vn(b, $, Z),
            m
        }
        return m.setItem = function(b, $, Z) {
            return v("saveStorageValue", {
                key: b,
                value: $
            }, Z)
        }
        ,
        m.getItem = function(b, $) {
            return m.getItems([b], $ ? function(Z, Ce) {
                Z ? $(Z) : $(null, Ce[b])
            }
            : null)
        }
        ,
        m.getItems = function(b, $) {
            return v("getStorageValues", {
                keys: b
            }, $)
        }
        ,
        m.removeItem = function(b, $) {
            return m.removeItems([b], $)
        }
        ,
        m.removeItems = function(b, $) {
            return v("deleteStorageValues", {
                keys: b
            }, $)
        }
        ,
        m.getKeys = function(b) {
            return v("getStorageKeys", {}, b)
        }
        ,
        m
    }()
      , T = {};
    function V(m, v) {
        if (v.slug && T[v.slug]) {
            var b = T[v.slug];
            delete T[v.slug],
            b.callback && b.callback(v.status),
            D("invoiceClosed", {
                url: b.url,
                status: v.status
            })
        }
    }
    var F = !1;
    function z(m, v) {
        if (F) {
            var b = F;
            F = !1;
            var $ = null;
            typeof v.button_id < "u" && ($ = v.button_id),
            b.callback && b.callback($),
            D("popupClosed", {
                button_id: $
            })
        }
    }
    var Y = !1;
    function re(m, v) {
        if (Y) {
            var b = Y
              , $ = null;
            typeof v.data < "u" && ($ = v.data),
            b.callback && b.callback($) && (Y = !1,
            t.postEvent("web_app_close_scan_qr_popup", !1)),
            D("qrTextReceived", {
                data: $
            })
        }
    }
    function me(m, v) {
        Y = !1
    }
    function pe(m, v) {
        if (v.req_id && G[v.req_id]) {
            var b = G[v.req_id];
            delete G[v.req_id];
            var $ = null;
            typeof v.data < "u" && ($ = v.data),
            b.callback && b.callback($),
            D("clipboardTextReceived", {
                data: $
            })
        }
    }
    var ye = !1;
    function et(m, v) {
        if (ye) {
            var b = ye;
            ye = !1,
            b.callback && b.callback(v.status == "allowed"),
            D("writeAccessRequested", {
                status: v.status
            })
        }
    }
    var nt = !1;
    function jn(m, v) {
        if (nt) {
            var b = nt;
            nt = !1,
            b.callback && b.callback(v.status == "sent"),
            D("contactRequested", {
                status: v.status
            })
        }
    }
    function Dt(m, v) {
        if (v.req_id && G[v.req_id]) {
            var b = G[v.req_id];
            delete G[v.req_id];
            var $ = null
              , Z = null;
            typeof v.result < "u" && ($ = v.result),
            typeof v.error < "u" && (Z = v.error),
            b.callback && b.callback(Z, $)
        }
    }
    function vn(m, v, b) {
        if (!h("6.9"))
            throw console.error("[Telegram.WebApp] Method invokeCustomMethod is not supported in version " + a),
            Error("WebAppMethodUnsupported");
        var $ = de(16)
          , Z = {
            req_id: $,
            method: m,
            params: v || {}
        };
        G[$] = {
            callback: b
        },
        t.postEvent("web_app_invoke_custom_method", !1, Z)
    }
    window.Telegram || (window.Telegram = {}),
    Object.defineProperty(r, "initData", {
        get: function() {
            return s
        },
        enumerable: !0
    }),
    Object.defineProperty(r, "initDataUnsafe", {
        get: function() {
            return i
        },
        enumerable: !0
    }),
    Object.defineProperty(r, "version", {
        get: function() {
            return a
        },
        enumerable: !0
    }),
    Object.defineProperty(r, "platform", {
        get: function() {
            return u
        },
        enumerable: !0
    }),
    Object.defineProperty(r, "colorScheme", {
        get: function() {
            return c
        },
        enumerable: !0
    }),
    Object.defineProperty(r, "themeParams", {
        get: function() {
            return l
        },
        enumerable: !0
    }),
    Object.defineProperty(r, "isExpanded", {
        get: function() {
            return We
        },
        enumerable: !0
    }),
    Object.defineProperty(r, "viewportHeight", {
        get: function() {
            return (H === !1 ? window.innerHeight : H) - C
        },
        enumerable: !0
    }),
    Object.defineProperty(r, "viewportStableHeight", {
        get: function() {
            return (ie === !1 ? window.innerHeight : ie) - C
        },
        enumerable: !0
    }),
    Object.defineProperty(r, "isClosingConfirmationEnabled", {
        set: function(m) {
            fe(m)
        },
        get: function() {
            return ve
        },
        enumerable: !0
    }),
    Object.defineProperty(r, "headerColor", {
        set: function(m) {
            ke(m)
        },
        get: function() {
            return Oe()
        },
        enumerable: !0
    }),
    Object.defineProperty(r, "backgroundColor", {
        set: function(m) {
            A(m)
        },
        get: function() {
            return Be()
        },
        enumerable: !0
    }),
    Object.defineProperty(r, "BackButton", {
        value: E,
        enumerable: !0
    }),
    Object.defineProperty(r, "MainButton", {
        value: x,
        enumerable: !0
    }),
    Object.defineProperty(r, "HapticFeedback", {
        value: I,
        enumerable: !0
    }),
    Object.defineProperty(r, "CloudStorage", {
        value: W,
        enumerable: !0
    }),
    r.setHeaderColor = function(m) {
        r.headerColor = m
    }
    ,
    r.setBackgroundColor = function(m) {
        r.backgroundColor = m
    }
    ,
    r.enableClosingConfirmation = function() {
        r.isClosingConfirmationEnabled = !0
    }
    ,
    r.disableClosingConfirmation = function() {
        r.isClosingConfirmationEnabled = !1
    }
    ,
    r.isVersionAtLeast = function(m) {
        return h(m)
    }
    ,
    r.onEvent = function(m, v) {
        ee(m, v)
    }
    ,
    r.offEvent = function(m, v) {
        se(m, v)
    }
    ,
    r.sendData = function(m) {
        if (!m || !m.length)
            throw console.error("[Telegram.WebApp] Data is required", m),
            Error("WebAppDataInvalid");
        if (_(m) > 4096)
            throw console.error("[Telegram.WebApp] Data is too long", m),
            Error("WebAppDataInvalid");
        t.postEvent("web_app_data_send", !1, {
            data: m
        })
    }
    ,
    r.switchInlineQuery = function(m, v) {
        if (!h("6.6"))
            throw console.error("[Telegram.WebApp] Method switchInlineQuery is not supported in version " + a),
            Error("WebAppMethodUnsupported");
        if (!n.tgWebAppBotInline)
            throw console.error("[Telegram.WebApp] Inline mode is disabled for this bot. Read more about inline mode: https://core.telegram.org/bots/inline"),
            Error("WebAppInlineModeDisabled");
        if (m = m || "",
        m.length > 256)
            throw console.error("[Telegram.WebApp] Inline query is too long", m),
            Error("WebAppInlineQueryInvalid");
        var b = [];
        if (v) {
            if (!Array.isArray(v))
                throw console.error("[Telegram.WebApp] Choose chat types should be an array", v),
                Error("WebAppInlineChooseChatTypesInvalid");
            for (var $ = {
                users: 1,
                bots: 1,
                groups: 1,
                channels: 1
            }, Z = 0; Z < v.length; Z++) {
                var Ce = v[Z];
                if (!$[Ce])
                    throw console.error("[Telegram.WebApp] Choose chat type is invalid", Ce),
                    Error("WebAppInlineChooseChatTypeInvalid");
                $[Ce] != 2 && ($[Ce] = 2,
                b.push(Ce))
            }
        }
        t.postEvent("web_app_switch_inline_query", !1, {
            query: m,
            chat_types: b
        })
    }
    ,
    r.openLink = function($, v) {
        var b = document.createElement("A");
        if (b.href = $,
        b.protocol != "http:" && b.protocol != "https:")
            throw console.error("[Telegram.WebApp] Url protocol is not supported", $),
            Error("WebAppTgUrlInvalid");
        var $ = b.href;
        v = v || {},
        h("6.1") ? t.postEvent("web_app_open_link", !1, {
            url: $,
            try_instant_view: h("6.4") && !!v.try_instant_view
        }) : window.open($, "_blank")
    }
    ,
    r.openTelegramLink = function(m) {
        var v = document.createElement("A");
        if (v.href = m,
        v.protocol != "http:" && v.protocol != "https:")
            throw console.error("[Telegram.WebApp] Url protocol is not supported", m),
            Error("WebAppTgUrlInvalid");
        if (v.hostname != "t.me")
            throw console.error("[Telegram.WebApp] Url host is not supported", m),
            Error("WebAppTgUrlInvalid");
        var b = v.pathname + v.search;
        o || h("6.1") ? t.postEvent("web_app_open_tg_link", !1, {
            path_full: b
        }) : location.href = "https://t.me" + b
    }
    ,
    r.openInvoice = function(m, v) {
        var b = document.createElement("A"), $, Z;
        if (b.href = m,
        b.protocol != "http:" && b.protocol != "https:" || b.hostname != "t.me" || !($ = b.pathname.match(/^\/(\$|invoice\/)([A-Za-z0-9\-_=]+)$/)) || !(Z = $[2]))
            throw console.error("[Telegram.WebApp] Invoice url is invalid", m),
            Error("WebAppInvoiceUrlInvalid");
        if (!h("6.1"))
            throw console.error("[Telegram.WebApp] Method openInvoice is not supported in version " + a),
            Error("WebAppMethodUnsupported");
        if (T[Z])
            throw console.error("[Telegram.WebApp] Invoice is already opened"),
            Error("WebAppInvoiceOpened");
        T[Z] = {
            url: m,
            callback: v
        },
        t.postEvent("web_app_open_invoice", !1, {
            slug: Z
        })
    }
    ,
    r.showPopup = function(m, v) {
        if (!h("6.2"))
            throw console.error("[Telegram.WebApp] Method showPopup is not supported in version " + a),
            Error("WebAppMethodUnsupported");
        if (F)
            throw console.error("[Telegram.WebApp] Popup is already opened"),
            Error("WebAppPopupOpened");
        var b = ""
          , $ = ""
          , Z = []
          , Ce = {};
        if (typeof m.title < "u") {
            if (b = P(m.title),
            b.length > 64)
                throw console.error("[Telegram.WebApp] Popup title is too long", b),
                Error("WebAppPopupParamInvalid");
            b.length > 0 && (Ce.title = b)
        }
        if (typeof m.message < "u" && ($ = P(m.message)),
        !$.length)
            throw console.error("[Telegram.WebApp] Popup message is required", m.message),
            Error("WebAppPopupParamInvalid");
        if ($.length > 256)
            throw console.error("[Telegram.WebApp] Popup message is too long", $),
            Error("WebAppPopupParamInvalid");
        if (Ce.message = $,
        typeof m.buttons < "u") {
            if (!Array.isArray(m.buttons))
                throw console.error("[Telegram.WebApp] Popup buttons should be an array", m.buttons),
                Error("WebAppPopupParamInvalid");
            for (var te = 0; te < m.buttons.length; te++) {
                var lt = m.buttons[te]
                  , Le = {}
                  , Se = "";
                if (typeof lt.id < "u" && (Se = lt.id.toString(),
                Se.length > 64))
                    throw console.error("[Telegram.WebApp] Popup button id is too long", Se),
                    Error("WebAppPopupParamInvalid");
                Le.id = Se;
                var Ve = lt.type;
                if (typeof Ve > "u" && (Ve = "default"),
                Le.type = Ve,
                !(Ve == "ok" || Ve == "close" || Ve == "cancel"))
                    if (Ve == "default" || Ve == "destructive") {
                        var Tt = "";
                        if (typeof lt.text < "u" && (Tt = P(lt.text)),
                        !Tt.length)
                            throw console.error("[Telegram.WebApp] Popup button text is required for type " + Ve, lt.text),
                            Error("WebAppPopupParamInvalid");
                        if (Tt.length > 64)
                            throw console.error("[Telegram.WebApp] Popup button text is too long", Tt),
                            Error("WebAppPopupParamInvalid");
                        Le.text = Tt
                    } else
                        throw console.error("[Telegram.WebApp] Popup button type is invalid", Ve),
                        Error("WebAppPopupParamInvalid");
                Z.push(Le)
            }
        } else
            Z.push({
                id: "",
                type: "close"
            });
        if (Z.length < 1)
            throw console.error("[Telegram.WebApp] Popup should have at least one button"),
            Error("WebAppPopupParamInvalid");
        if (Z.length > 3)
            throw console.error("[Telegram.WebApp] Popup should not have more than 3 buttons"),
            Error("WebAppPopupParamInvalid");
        Ce.buttons = Z,
        F = {
            callback: v
        },
        t.postEvent("web_app_open_popup", !1, Ce)
    }
    ,
    r.showAlert = function(m, v) {
        r.showPopup({
            message: m
        }, v ? function() {
            v()
        }
        : null)
    }
    ,
    r.showConfirm = function(m, v) {
        r.showPopup({
            message: m,
            buttons: [{
                type: "ok",
                id: "ok"
            }, {
                type: "cancel"
            }]
        }, v ? function(b) {
            v(b == "ok")
        }
        : null)
    }
    ,
    r.showScanQrPopup = function(m, v) {
        if (!h("6.4"))
            throw console.error("[Telegram.WebApp] Method showScanQrPopup is not supported in version " + a),
            Error("WebAppMethodUnsupported");
        if (Y)
            throw console.error("[Telegram.WebApp] Popup is already opened"),
            Error("WebAppScanQrPopupOpened");
        var b = ""
          , $ = {};
        if (typeof m.text < "u") {
            if (b = P(m.text),
            b.length > 64)
                throw console.error("[Telegram.WebApp] Scan QR popup text is too long", b),
                Error("WebAppScanQrPopupParamInvalid");
            b.length > 0 && ($.text = b)
        }
        Y = {
            callback: v
        },
        t.postEvent("web_app_open_scan_qr_popup", !1, $)
    }
    ,
    r.closeScanQrPopup = function() {
        if (!h("6.4"))
            throw console.error("[Telegram.WebApp] Method closeScanQrPopup is not supported in version " + a),
            Error("WebAppMethodUnsupported");
        Y = !1,
        t.postEvent("web_app_close_scan_qr_popup", !1)
    }
    ,
    r.readTextFromClipboard = function(m) {
        if (!h("6.4"))
            throw console.error("[Telegram.WebApp] Method readTextFromClipboard is not supported in version " + a),
            Error("WebAppMethodUnsupported");
        var v = de(16)
          , b = {
            req_id: v
        };
        G[v] = {
            callback: m
        },
        t.postEvent("web_app_read_text_from_clipboard", !1, b)
    }
    ,
    r.requestWriteAccess = function(m) {
        if (!h("6.9"))
            throw console.error("[Telegram.WebApp] Method requestWriteAccess is not supported in version " + a),
            Error("WebAppMethodUnsupported");
        if (ye)
            throw console.error("[Telegram.WebApp] Write access is already requested"),
            Error("WebAppWriteAccessRequested");
        ye = {
            callback: m
        },
        t.postEvent("web_app_request_write_access")
    }
    ,
    r.requestContact = function(m) {
        if (!h("6.9"))
            throw console.error("[Telegram.WebApp] Method requestContact is not supported in version " + a),
            Error("WebAppMethodUnsupported");
        if (nt)
            throw console.error("[Telegram.WebApp] Contact is already requested"),
            Error("WebAppContactRequested");
        nt = {
            callback: m
        },
        t.postEvent("web_app_request_phone")
    }
    ,
    r.invokeCustomMethod = function(m, v, b) {
        vn(m, v, b)
    }
    ,
    r.ready = function() {
        t.postEvent("web_app_ready")
    }
    ,
    r.expand = function() {
        t.postEvent("web_app_expand")
    }
    ,
    r.close = function() {
        t.postEvent("web_app_close")
    }
    ,
    window.Telegram.WebApp = r,
    _t(),
    M(),
    Qe(),
    window.addEventListener("resize", y),
    o && document.addEventListener("click", k),
    t.onEvent("theme_changed", S),
    t.onEvent("viewport_changed", L),
    t.onEvent("invoice_closed", V),
    t.onEvent("popup_closed", z),
    t.onEvent("qr_text_received", re),
    t.onEvent("scan_qr_popup_closed", me),
    t.onEvent("clipboard_text_received", pe),
    t.onEvent("write_access_requested", et),
    t.onEvent("phone_requested", jn),
    t.onEvent("custom_method_invoked", Dt),
    t.postEvent("web_app_request_theme"),
    t.postEvent("web_app_request_viewport")
}
)();
var Qp = window
  , Yp = Qp.Telegram.WebApp;
function Po() {
    return Yp
}
const Xp = xe({
    __name: "MainButton",
    props: {
        text: {},
        disabled: {
            type: Boolean
        },
        progress: {
            type: Boolean
        },
        color: {},
        textColor: {},
        keepAlive: {
            type: Boolean
        },
        haptic: {}
    },
    emits: ["onClick"],
    setup(e, {emit: t}) {
        const n = e
          , {text: o, color: r, textColor: s, disabled: i, progress: l, keepAlive: c, haptic: a} = Ke(n)
          , u = Po()
          , f = u.MainButton
          , p = ()=>{
            const g = a == null ? void 0 : a.value;
            g && u.HapticFeedback.impactOccurred(g),
            t("onClick")
        }
        ;
        return Gt(()=>{
            f.onClick(p)
        }
        ),
        mn(()=>{
            f.offClick(p),
            c.value || f.hide()
        }
        ),
        He([i, l], ([g,w])=>{
            w ? f.showProgress() : f.hideProgress(),
            g || w ? f.disable() : f.enable()
        }
        , {
            immediate: !0
        }),
        He([s, r], ()=>{
            f.setParams({
                color: r == null ? void 0 : r.value,
                text_color: s == null ? void 0 : s.value
            })
        }
        , {
            immediate: !0
        }),
        He(o, g=>{
            if (!g) {
                f.isVisible && f.hide();
                return
            }
            f.setText(g),
            !f.isVisible && f.show()
        }
        , {
            immediate: !0
        }),
        (g,w)=>Je(g.$slots, "default")
    }
});
function Jp(e, t=!0, n=!1) {
    t ? e.focus({
        preventScroll: n
    }) : e.blur()
}
const Gp = xe({
    inheritAttrs: !1,
    __name: "PrimitiveSlide",
    props: Ft({
        media: {},
        textAlign: {},
        shape: {},
        background: {},
        button: {},
        extends: {},
        active: {
            type: Boolean
        }
    }, Kp),
    emits: ["onClick"],
    setup(e, {emit: t}) {
        const n = e
          , {button: o, active: r} = Ke(n)
          , s = Yi()
          , i = Br()
          , l = we(null)
          , c = J(()=>{
            const g = o.value;
            return typeof g == "string" ? g : g ? g.content : ""
        }
        )
          , a = J(()=>{
            const g = o.value;
            return typeof g == "string" ? {} : g || {}
        }
        )
          , f = Hn().useTranslated(c);
        He([r, l], ([g,w])=>{
            g && w && Jp(w, !0, !0)
        }
        , {
            immediate: !0
        });
        const p = ()=>{
            const g = a.value;
            if (g.to) {
                i.push(g.to);
                return
            }
            t("onClick")
        }
        ;
        return (g,w)=>(Q(),
        be("div", {
            class: Pe(g.$style.slide)
        }, [it("div", {
            ref_key: "focusTrapRef",
            ref: l,
            tabindex: "0",
            class: Pe(g.$style.focustrap)
        }, null, 2), g.media ? (Q(),
        ge(K(pl), De({
            key: 0
        }, g.media, {
            class: [g.$style.media, g.$style["media_" + g.shape]]
        }), null, 16, ["class"])) : $e("", !0), it("div", {
            class: Pe([g.$style.content, g.$style["content_" + g.shape]]),
            style: Wt({
                textAlign: g.textAlign,
                background: g.background
            })
        }, [Je(g.$slots, "default"), K(r) && c.value ? (Q(),
        ge(K(Xp), {
            key: 0,
            haptic: "light",
            "keep-alive": !!K(s),
            text: K(f),
            onOnClick: p
        }, null, 8, ["keep-alive", "text"])) : $e("", !0)], 6)], 2))
    }
})
  , Zp = "_focustrap_x38xz_1"
  , ed = "_slide_x38xz_6"
  , td = "_media_x38xz_18"
  , nd = "_media_stacked_x38xz_21"
  , od = "_content_x38xz_29"
  , rd = "_content_rounded_x38xz_37"
  , sd = "_content_stacked_x38xz_45"
  , id = {
    focustrap: Zp,
    slide: ed,
    media: td,
    media_stacked: nd,
    content: od,
    content_rounded: rd,
    content_stacked: sd
}
  , ld = {
    $style: id
}
  , cd = Ze(Gp, [["__cssModules", ld]])
  , ad = ["innerHTML"]
  , ud = ["innerHTML"]
  , fd = {
    key: 2
}
  , pd = xe({
    __name: "slide.preset",
    props: Ft({
        media: {},
        textAlign: {},
        shape: {},
        background: {},
        button: {},
        extends: {},
        active: {
            type: Boolean
        },
        title: {},
        description: {},
        pagination: {},
        list: {}
    }, jf),
    setup(e) {
        const t = e
          , {title: n, description: o, list: r} = Ke(t)
          , s = Hn()
          , i = Yi()
          , l = s.useTranslated(n)
          , c = s.useTranslated(o)
          , a = J(()=>i ? `${i.index.value + 1} / ${i.length.value}` : null)
          , u = J(()=>((r == null ? void 0 : r.value) || []).map(p=>typeof p == "string" ? {
            media: Hf,
            text: p
        } : p))
          , f = ()=>{
            i == null || i.next()
        }
        ;
        return (p,g)=>(Q(),
        ge(K(cd), De(t, {
            onOnClick: f
        }), {
            default: At(()=>[K(i) && p.pagination === "count" ? (Q(),
            be("p", {
                key: 0,
                class: Pe(p.$style.count)
            }, dr(a.value), 3)) : $e("", !0), it("h2", {
                innerHTML: K(l),
                class: Pe(p.$style.title)
            }, null, 10, ad), K(c) ? (Q(),
            be("p", {
                key: 1,
                innerHTML: K(c),
                class: Pe(p.$style.description)
            }, null, 10, ud)) : $e("", !0), u.value.length > 0 ? (Q(),
            be("ul", fd, [(Q(!0),
            be(Fe, null, xr(u.value, (w,S)=>(Q(),
            ge(K(zp), De({
                key: S
            }, w, {
                class: p.$style.listItem
            }), null, 16, ["class"]))), 128))])) : $e("", !0), Je(p.$slots, "default")]),
            _: 3
        }, 16))
    }
})
  , dd = "_count_1opq7_1"
  , hd = "_listItem_1opq7_7"
  , md = {
    count: dd,
    listItem: hd
}
  , gd = {
    $style: md
}
  , vd = Ze(pd, [["__cssModules", gd]])
  , _d = {
    base: Df,
    slide: vd,
    paywall: Lt(()=>_e(()=>import("./index-6a080129.js"), ["assets/index-6a080129.js", "assets/Money.vue_vue_type_script_setup_true_lang-accf0010.js", "assets/getElementId-5f791855.js", "assets/Money-9b4a5dd4.css", "assets/index-a00b295d.css"]).then(e=>e.PaywallPreset)),
    form: Lt(()=>_e(()=>import("./index-777000e0.js"), ["assets/index-777000e0.js", "assets/getElementId-5f791855.js", "assets/index-850dc196.css"]).then(e=>e.FormPreset)),
    paywall_single: Lt(()=>_e(()=>import("./index-6856d246.js"), ["assets/index-6856d246.js", "assets/Money.vue_vue_type_script_setup_true_lang-accf0010.js", "assets/getElementId-5f791855.js", "assets/Money-9b4a5dd4.css", "assets/index-f05383dd.css"]).then(e=>e.PaywallSinglePreset)),
    paywall_row: Lt(()=>_e(()=>import("./index-0439a8cf.js"), ["assets/index-0439a8cf.js", "assets/Money.vue_vue_type_script_setup_true_lang-accf0010.js", "assets/getElementId-5f791855.js", "assets/Money-9b4a5dd4.css", "assets/index-2474c0bd.css"]).then(e=>e.PaywallRowPreset))
}
  , dl = Symbol()
  , bd = Symbol()
  , hl = Symbol()
  , ml = Symbol()
  , yd = {
    install(e, t) {
        e.provide(dl, {
            ..._d,
            ...t
        })
    }
}
  , wd = {
    install(e) {
        const t = we({})
          , n = o=>{
            t.value = {
                ...t.value,
                ...o
            }
        }
        ;
        e.provide(bd, {
            state: t,
            update: n
        })
    }
}
  , Ed = {
    install(e, t) {
        e.provide(hl, t)
    }
}
  , Cd = e=>{
    const t = ep();
    e.provide(fl, t)
}
  , Ad = {
    install: Cd
}
  , Pd = {
    install(e, t) {
        e.provide(op, {
            ...np,
            ...t
        })
    }
};
function Td(e, t) {
    const {fallback: n, ...o} = t.locale || {}
      , r = {
        default: n || "en",
        asyncLocales: o
    }
      , s = t.pages.map((l,c)=>({
        path: c === 0 ? "/" : l.path || `/${c}`,
        component: ()=>_e(()=>import("./Route-c50b3783.js"), []),
        meta: {
            config: l
        }
    }))
      , i = Nf({
        history: Zu("/telegram-onboarding-kit"),
        routes: [].concat(s).concat({
            path: "/not-found",
            alias: "/:catchAll(.*)*",
            redirect: "/"
        })
    });
    return i.afterEach(l=>{
        l.params.savedPosition || window.scrollTo({
            top: 0
        })
    }
    ),
    i.onError((l,c)=>{
        const a = l.message.includes("Failed to fetch dynamically imported module") || l.message.includes("Importing a module script failed");
        (l.name === "ChunkLoadError" || a) && (location.href = c.fullPath)
    }
    ),
    nu(e).use(i).use(Ad).use(Xf, r).use(Ed, t.theme || "auto").use(wd).use(yd, t.definePresets || {}).use(Pd, t.currencyConfig || {}).mount("#app")
}
const xd = {
    type: "telegram",
    appearance: "ghost"
}
  , kd = {
    size: "m",
    appearance: "primary",
    shape: null
};
function gl(e) {
    const t = e.currentTarget;
    if (!t)
        return;
    const n = t.querySelector("[data-ripple-ink='true']");
    if (!n)
        return;
    const o = t.getBoundingClientRect()
      , r = {
        top: o.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
        left: o.left + (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0)
    };
    let s = n.offsetHeight
      , i = n.offsetWidth;
    const l = getComputedStyle(n);
    s -= parseFloat(l.paddingTop) + parseFloat(l.paddingBottom) + parseFloat(l.borderTopWidth) + parseFloat(l.borderBottomWidth),
    i -= parseFloat(l.paddingLeft) + parseFloat(l.paddingRight) + parseFloat(l.borderLeftWidth) + parseFloat(l.borderRightWidth);
    const c = Math.max(o.width, o.height);
    n.style.width = `${c}px`,
    n.style.height = `${c}px`;
    const a = (e instanceof MouseEvent ? e.pageX : e.touches[0].pageX) - r.left + document.body.scrollTop - i / 2
      , u = (e instanceof MouseEvent ? e.pageY : e.touches[0].pageY) - r.top + document.body.scrollLeft - s / 2;
    n.style.left = `${a}px`,
    n.style.top = `${u}px`,
    n.classList.add("tok-ripple-ink_active"),
    n.addEventListener("animationend", ()=>{
        n.classList.remove("tok-ripple-ink_active")
    }
    , {
        once: !0
    })
}
function Sd(e) {
    e.removeEventListener("mousedown", gl)
}
function Od(e) {
    const t = document.createElement("span");
    t.setAttribute("role", "presentation"),
    t.setAttribute("aria-hidden", "true"),
    t.setAttribute("data-ripple-ink", "true"),
    t.classList.add("tok-ripple-ink"),
    e.appendChild(t),
    e.classList.add("tok-ripple");
    const n = e.getBoundingClientRect()
      , o = Math.max(n.width, n.height);
    t.style.width = `${o}px`,
    t.style.height = `${o}px`,
    e.addEventListener("mousedown", gl)
}
function Rd(e) {
    Sd(e)
}
const Id = {
    mounted: Od,
    beforeUnmount: Rd
}
  , Ld = xe({
    __name: "FlatButton",
    props: Ft({
        size: {},
        icon: {},
        rotate: {
            type: Boolean
        },
        iconRight: {},
        rightRotate: {
            type: Boolean
        },
        shape: {},
        appearance: {},
        loading: {
            type: Boolean
        },
        disabled: {
            type: Boolean
        },
        iconButton: {
            type: Boolean
        },
        href: {},
        to: {},
        iconSize: {}
    }, kd),
    setup(e) {
        const t = e
          , {icon: n, size: o, iconRight: r, shape: s, iconButton: i, href: l, to: c} = Ke(t)
          , a = J(()=>{
            const f = s.value;
            return f === "square" ? "square" : i.value ? "icon" : f
        }
        )
          , u = J(()=>l != null && l.value ? "a" : !!(c != null && c.value) ? "router-link" : "button");
        return (f,p)=>Gn((Q(),
        ge(gn(u.value), {
            class: "tok-button",
            "data-appearance": f.appearance,
            "data-size": K(o),
            "data-shape": a.value,
            "data-loading": f.loading,
            disabled: f.disabled,
            href: K(l),
            to: K(c)
        }, {
            default: At(()=>[Je(f.$slots, "icon", {}, ()=>[K(n) ? (Q(),
            ge(K(sn), {
                key: 0,
                name: K(n),
                rotate: f.rotate,
                size: f.iconSize
            }, null, 8, ["name", "rotate", "size"])) : $e("", !0)]), K(i) ? $e("", !0) : Je(f.$slots, "default", {
                key: 0
            }), Je(f.$slots, "iconRight", {}, ()=>[K(r) ? (Q(),
            ge(K(sn), {
                key: 0,
                name: K(r),
                rotate: f.rightRotate,
                size: f.iconSize
            }, null, 8, ["name", "rotate", "size"])) : $e("", !0)]), f.loading ? (Q(),
            ge(K(sn), {
                key: 1,
                name: "spinner",
                class: "spinner"
            })) : $e("", !0)]),
            _: 3
        }, 8, ["data-appearance", "data-size", "data-shape", "data-loading", "disabled", "href", "to"])), [[K(Id)]])
    }
});
const $d = xe({
    __name: "BackButton",
    props: Ft({
        type: {},
        show: {
            type: Boolean
        },
        appearance: {}
    }, xd),
    emits: ["onClick"],
    setup(e, {emit: t}) {
        const n = e
          , {show: o, type: r} = Ke(n)
          , i = Po().BackButton
          , l = we(NaN)
          , c = J(()=>o.value ? (l.value,
        r.value === "web" || !i.isVisible) : !1)
          , a = ()=>{
            t("onClick")
        }
        ;
        return He([o, r], ([u,f],[p,g],w)=>{
            w(()=>{
                i.offClick(a)
            }
            ),
            g === "telegram" && g !== f && i.hide(),
            f === "telegram" && (u ? (i.show(),
            i.onClick(a)) : i.hide())
        }
        , {
            immediate: !0
        }),
        (u,f)=>c.value ? (Q(),
        ge(K(Ld), {
            key: 0,
            size: "s",
            icon: "arrow-left",
            appearance: u.appearance,
            class: Pe(u.$style.button),
            "icon-size": 16,
            onClick: a
        }, {
            default: At(()=>[Je(u.$slots, "default", {}, ()=>[xn("Back")])]),
            _: 3
        }, 8, ["appearance", "class"])) : $e("", !0)
    }
})
  , Md = "_button_17wy4_1"
  , Wd = {
    button: Md
}
  , Bd = {
    $style: Wd
}
  , Nd = Ze($d, [["__cssModules", Bd]]);
function Fd(e="auto") {
    const t = Po()
      , n = e === "auto" ? t.colorScheme : e
      , o = we(n)
      , r = ()=>{
        o.value = t.colorScheme
    }
    ;
    return Gt(()=>{
        e === "auto" && t.onEvent("themeChanged", r)
    }
    ),
    mn(()=>{
        t.offEvent("themeChanged", r)
    }
    ),
    o
}
const Dd = {
    type: "success"
}
  , Hd = ["data-type"]
  , jd = {
    key: 1,
    class: "tok-alert-text"
}
  , qd = xe({
    name: "Alert",
    __name: "Alert",
    props: Ft({
        type: {},
        content: {
            type: [String, Object, Function]
        },
        closable: {
            type: Boolean
        },
        data: {}
    }, Dd),
    emits: ["close"],
    setup(e, {emit: t}) {
        const n = e
          , {type: o} = Ke(n)
          , r = J(()=>{
            const l = o.value;
            return l === "success" ? "checkmark-fill" : l === "error" ? "warning-fill" : null
        }
        )
          , s = ()=>{
            t("close")
        }
          , i = {
            data: n.data,
            close: s
        };
        return (l,c)=>(Q(),
        be("div", {
            class: "tok-alert",
            "data-type": K(o)
        }, [r.value ? (Q(),
        ge(K(sn), {
            key: 0,
            class: "tok-alert-icon",
            name: r.value
        }, null, 8, ["name"])) : $e("", !0), typeof l.content == "string" ? (Q(),
        be("span", jd, dr(l.content), 1)) : (Q(),
        ge(gn(l.content), {
            key: 2,
            context: i
        })), l.closable ? (Q(),
        be("button", {
            key: 3,
            "aria-label": "close alert",
            title: "close alert",
            class: "tok-alert-close",
            onClick: s
        }, [Ee(K(sn), {
            name: "close"
        })])) : $e("", !0)], 8, Hd))
    }
});
const Ud = Ze(qd, [["__scopeId", "data-v-8e03c41c"]])
  , Vd = {
    id: "tok-alerts-host"
}
  , zd = "top"
  , Kd = xe({
    name: "AlertsHost",
    __name: "AlertsHost",
    setup(e) {
        const t = Ue(fl, null)
          , n = J(()=>(t == null ? void 0 : t.alerts.value) || [])
          , o = (r,s)=>{
            t == null || t.close(r),
            s == null || s()
        }
        ;
        return (r,s)=>(Q(),
        be("div", Vd, [it("div", {
            class: Pe(`root root_${zd}`)
        }, [Ee(Ka, {
            tag: "ul",
            class: "container",
            "enter-from-class": "alert-enter-from",
            "enter-active-class": "alert-enter-active",
            "leave-active-class": "alert-leave-active",
            "leave-to-class": "alert-leave-to"
        }, {
            default: At(()=>[(Q(!0),
            be(Fe, null, xr(n.value, i=>(Q(),
            ge(K(Ud), {
                key: i.id,
                class: "alert",
                type: i.type,
                content: i.content,
                data: i.data,
                closable: i.closable,
                onClose: l=>o(i.id, i.onClose)
            }, null, 8, ["type", "content", "data", "closable", "onClose"]))), 128))]),
            _: 1
        })], 2)]))
    }
});
const Qd = Ze(Kd, [["__scopeId", "data-v-fb17e916"]])
  , Yd = xe({
    __name: "PopupsHost",
    setup(e, {expose: t}) {
        const n = we([])
          , o = J(()=>n.value.length > 0)
          , r = (l,c)=>{
            c ? s(l) : i(l)
        }
          , s = l=>{
            const c = n.value;
            n.value = [...c, l]
        }
          , i = l=>{
            const c = n.value;
            n.value = c.filter(a=>a !== l)
        }
        ;
        return t({
            isShown: o,
            setOpened: r,
            remove: i
        }),
        (l,c)=>(Q(),
        be("div", {
            id: "tok-popups-host",
            class: Pe([l.$style.host, o.value && l.$style.host_overlay])
        }, null, 2))
    }
})
  , Xd = "_host_vrsdn_1"
  , Jd = "_host_overlay_vrsdn_9"
  , Gd = "_tokPopupOverlay_vrsdn_1"
  , Zd = {
    host: Xd,
    host_overlay: Jd,
    tokPopupOverlay: Gd
}
  , eh = {
    $style: Zd
}
  , th = Ze(Yd, [["__cssModules", eh]])
  , nh = xe({
    __name: "Root",
    setup(e) {
        const t = we(null);
        return Xt(sp, br(t)),
        (n,o)=>(Q(),
        be(Fe, null, [Je(n.$slots, "default"), Je(n.$slots, "overContent"), Ee(th, {
            ref_key: "popupsHostRef",
            ref: t,
            class: Pe(n.$style.host)
        }, null, 8, ["class"]), Je(n.$slots, "overPopups"), Ee(Qd), Je(n.$slots, "overAlerts")], 64))
    }
})
  , oh = "_host_uuhkl_1"
  , rh = {
    host: oh
}
  , sh = {
    $style: rh
}
  , ih = Ze(nh, [["__cssModules", sh]])
  , lh = xe({
    __name: "Root",
    setup(e) {
        var S;
        const t = Ue(hl, "auto")
          , n = Fd(t)
          , o = Po()
          , r = Br()
          , s = Hn()
          , i = we(!1);
        Xt(ml, i);
        const l = O=>s.available.includes(O)
          , c = (S = o.initDataUnsafe.user) == null ? void 0 : S.language_code;
        c && l(c) && (s.locale.value = c),
        He(r.currentRoute, O=>{
            const L = O.query.language_code
              , y = typeof L == "string" ? L : void 0
              , k = y && l(y) ? y : void 0;
            !c && k && (s.locale.value = k)
        }
        );
        const a = ()=>{
            i.value = !0
        }
        ;
        Gt(()=>{
            o.expand(),
            window.addEventListener("mousedown", a),
            window.addEventListener("touchstart", a),
            window.addEventListener("touchend", a)
        }
        ),
        mn(()=>{
            window.removeEventListener("mousedown", a),
            window.removeEventListener("touchstart", a),
            window.removeEventListener("touchend", a)
        }
        );
        let u = !1;
        const f = O=>{
            if (s.available.length === 0) {
                o.ready(),
                u = !0;
                return
            }
            s.load(O).then(L=>{
                s.setMessages(O, L)
            }
            ).finally(()=>{
                u || (o.ready(),
                u = !0)
            }
            )
        }
        ;
        He(s.locale, f, {
            immediate: !0
        });
        const p = ()=>{
            window.history.length > 2 ? r.back() : r.replace("/")
        }
          , g = J(()=>{
            const O = r.currentRoute.value;
            return O.path === "/" ? !!O.query.page : !0
        }
        );
        return He(n, O=>{
            document.documentElement.setAttribute("data-theme", O)
        }
        , {
            immediate: !0
        }),
        (O,L)=>{
            const y = Vc("router-view");
            return Q(),
            ge(K(ih), null, {
                overContent: At(()=>[Ee(K(Nd), {
                    show: g.value,
                    onOnClick: p
                }, null, 8, ["show"]), Je(O.$slots, "overContent")]),
                default: At(()=>[Ee(y)]),
                _: 3
            })
        }
    }
});
const ch = xe({
    __name: "App",
    setup(e) {
        return (t,n)=>(Q(),
        ge(K(lh)))
    }
})
  , ah = {
    pages: [{
        slides: [{
            media: {
                type: "sticker",
                src: _e(()=>import("./duck_hello-34d911d1.js"), []),
                size: 250
            },
            shape: "square",
            pagination: "count",
            title: "Welcome to Telegram Onboarding Kit",
            description: "Create stunning onboarding and paywall for your Telegram Bot using the full power of Mini Apps<br><br>It's <b>simple</b>, <b>fast</b>, highly <b>customizable</b> and <a href='https://github.com/Easterok/telegram-onboarding-kit' target='_blank'>open-source</a>!",
            button: "Next"
        }, {
            media: {
                type: "image",
                src: _e(()=>import("./durov-f85869f4.js"), [])
            },
            shape: "rounded",
            pagination: "count",
            title: "Onboarding supports many types of content",
            description: "Here you can see <b>Image</b>. But it's just the beginning...",
            button: "Next"
        }, {
            media: {
                type: "sticker",
                src: _e(()=>import("./duck_love-1aae9982.js"), []),
                size: 250
            },
            shape: "square",
            pagination: "count",
            title: "Telegram stickers",
            description: "Just download any <b>.tgs</b> sticker from Telegram and use it in your onboardings",
            button: "Next"
        }, {
            extends: "form",
            media: {
                type: "sticker",
                src: _e(()=>import("./duck_spy-78f8fda4.js"), []),
                size: 150
            },
            shape: "square",
            pagination: "count",
            title: "Forms",
            description: "User fills in the form – the bot receives the data",
            form: [{
                id: "text_from_form",
                placeholder: "Text input",
                type: "text"
            }, {
                id: "number_from_form",
                placeholder: "Number input",
                type: "number"
            }, {
                id: "checkbox_from_form",
                placeholder: "Checkbox",
                type: "checkbox"
            }],
            button: "Next"
        }, {
            media: {
                type: "video",
                src: _e(()=>import("./spongebob-d9af6bdc.js"), []),
                poster: _e(()=>import("./spongebob_poster-ca0a96bf.js"), []),
                style: "aspect-ratio: 400/287"
            },
            shape: "rounded",
            pagination: "count",
            title: "Videos",
            description: "Typically, video starts <b>automatically</b><br><br>However, on iOS, it will only autoplay upon any prior tap on the page ('Next' button doesn't count). If video doesn't autoplay, user will see preview and pretty animation, inviting them to tap to play the video",
            button: "Next"
        }, {
            media: {
                type: "sticker",
                src: _e(()=>import("./duck_juggling-45a41320.js"), []),
                size: 150
            },
            shape: "square",
            pagination: "count",
            title: "Lists",
            description: "Lists can be used to showcase <b>features</b> of your product. Items support customizable icons",
            list: [{
                media: {
                    type: "icon",
                    src: _e(()=>import("./guide-1064f981.js"), []),
                    size: 30
                },
                text: "Some cool feature"
            }, {
                media: {
                    type: "icon",
                    src: _e(()=>import("./track-f55d81b8.js"), []),
                    size: 30
                },
                text: "Some very cool feature"
            }, {
                media: {
                    type: "icon",
                    src: _e(()=>import("./time-2f9d9e4c.js"), []),
                    size: 30
                },
                text: "Some extremely cool feature"
            }],
            button: "Next"
        }, {
            media: {
                type: "sticker",
                src: _e(()=>import("./duck_xray-6c79f4a0.js"), []),
                size: 250
            },
            shape: "square",
            pagination: "count",
            title: "Everything is customizable",
            description: "",
            textAlign: "center",
            list: ["<b>CSS styles</b>: extend primary colors from Telegram or set yours", "Button text and actions (look down)", "Use our carefully crafted <b>presets</b> or easily create your own"],
            button: "Super-Duper Next"
        }, {
            media: {
                type: "sticker",
                src: _e(()=>import("./duck_cool-2b31ec35.js"), []),
                size: 150
            },
            shape: "square",
            pagination: "count",
            title: "Some other features:",
            description: "",
            list: ["One-click 0$ <b>deploy</b> on GitHub Pages", "Language and currency localization", "Buttons with <b>haptic</b> feedback", "Content pre-loading for high speed", "<b>Low-code</b> approach to building onboardings", "Many examples/presets", "And many more... (see <a href='https://github.com/Easterok/telegram-onboarding-kit' target='_blank'>GitHub</a>)"],
            button: "Next"
        }, {
            media: {
                type: "sticker",
                src: _e(()=>import("./duck_knife-574371fe.js"), []),
                size: 250
            },
            shape: "square",
            pagination: "count",
            textAlign: "center",
            title: "But onboarding slides are not enough...",
            description: "Let's go to Paywall",
            button: {
                content: "Go to Paywall",
                to: "/paywall"
            }
        }]
    }, {
        extends: "paywall",
        path: "/paywall",
        media: {
            type: "sticker",
            src: _e(()=>import("./duck_money-b1a0f157.js"), []),
            size: 150
        },
        shape: "square",
        title: "Your beautiful Paywall",
        list: ["Adjustable product cards", "<b>👛 Wallet Pay</b> and <b>Telegram Payments</b> ready. Add custom methods easily", "Subscriptions or One-time payments"],
        products: [{
            id: "1_month_subscription",
            title: "1 month subscription",
            description: "2$/month",
            discount: "",
            price: 2
        }, {
            id: "1_year_subscription",
            title: "1 year subscription",
            description: "1$/month",
            discount: "Discount 50%",
            price: 12
        }, {
            id: "lifetime_access",
            title: "Lifetime access",
            description: "20$ once",
            discount: "Best offer",
            price: 20
        }],
        mainButtonText: "Buy for {price}",
        popup: {
            type: "web"
        },
        links: [{
            text: "Privacy policy",
            href: "https://google.com"
        }, {
            text: "Terms of use",
            href: "https://google.com"
        }]
    }]
};
Td(ch, ah);
export {go as A, _n as B, da as C, vd as D, pl as E, Fe as F, Wt as G, mn as H, Di as I, Ld as J, Gn as K, dr as L, Po as M, Fl as N, fl as O, sp as P, ph as Q, Id as R, sn as S, uh as T, tp as U, np as V, op as W, Yi as X, Xp as Y, ru as _, ge as a, K as b, J as c, xe as d, be as e, it as f, $e as g, Ze as h, Ft as i, Hn as j, fh as k, xr as l, De as m, Pe as n, Q as o, Ee as p, Je as q, we as r, pp as s, Ke as t, Br as u, He as v, At as w, br as x, Ue as y, bd as z};
