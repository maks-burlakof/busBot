import {
    d as y,
    o as p,
    e as f,
    p as z,
    n as $,
    b as s,
    S as M,
    q as U,
    h as g,
    i as P,
    t as T,
    j as L,
    c as R,
    f as b,
    w,
    s as O,
    r as D,
    v as N,
    x as q,
    k as A,
    g as K,
    y as S,
    z as G,
    A as J,
    a as v,
    F as Q,
    l as W,
    m as B,
    B as X,
    C as Y,
    D as Z
} from "./index-c82c5f39.js";
import {
    g as j
} from "./getElementId-5f791855.js";
const ee = [{
        id: "id1",
        placeholder: "placeholder for type: text",
        type: "text"
    }],
    te = {
        form: () => ee
    },
    se = {
        placeholder: "",
        size: "m"
    },
    oe = y({
        __name: "PrimitiveCheckbox",
        props: {
            value: {
                type: [Boolean, null]
            }
        },
        setup(_) {
            return (o, r) => (p(), f("div", {
                class: $([o.$style.checkbox, !!o.value && o.$style.checkbox_checked])
            }, [z(s(M), {
                name: "checkmark-fill",
                class: $([o.$style.mark, o.value !== !1 && o.$style.mark_on])
            }, null, 8, ["class"]), U(o.$slots, "default")], 2))
        }
    }),
    ae = "_checkbox_1il37_1",
    le = "_checkbox_checked_1il37_10",
    ne = "_mark_1il37_14",
    ce = "_mark_on_1il37_19",
    de = {
        checkbox: ae,
        checkbox_checked: le,
        mark: ne,
        mark_on: ce
    },
    ue = {
        $style: de
    },
    re = g(oe, [
        ["__cssModules", ue]
    ]),
    ie = ["for", "data-size", "data-shape", "data-state"],
    pe = ["innerHTML"],
    me = ["id", "checked", "disabled"],
    _e = y({
        __name: "CheckboxBlock",
        props: P({
            modelValue: {
                type: [Boolean, null]
            },
            placeholder: {},
            size: {},
            shape: {},
            disabled: {
                type: Boolean
            },
            invalid: {
                type: Boolean
            }
        }, se),
        emits: ["update:modelValue"],
        setup(_, {
            emit: o
        }) {
            const r = _,
                {
                    invalid: a,
                    disabled: c,
                    modelValue: e,
                    placeholder: m
                } = T(r),
                h = L().useTranslated(m),
                l = j(),
                d = R(() => {
                    if (c.value) return "disabled";
                    if (a.value) return "invalid";
                    if (e.value) return "checked"
                }),
                t = u => {
                    const V = u.target.checked;
                    o("update:modelValue", V)
                };
            return (u, x) => (p(), f("label", {
                for: s(l),
                class: "tok-checkboxblock",
                "data-size": u.size,
                "data-shape": u.shape,
                "data-state": d.value
            }, [U(u.$slots, "default", {}, () => [b("span", {
                innerHTML: s(h)
            }, null, 8, pe)], !0), z(s(re), {
                class: "tok-checkboxblock-check",
                value: s(e)
            }, {
                default: w(() => [b("input", {
                    id: s(l),
                    class: "tok-checkboxblock-native",
                    type: "checkbox",
                    checked: !!s(e),
                    disabled: s(c),
                    onChange: t
                }, null, 40, me)]),
                _: 1
            }, 8, ["value"])], 8, ie))
        }
    });
const he = g(_e, [
        ["__scopeId", "data-v-a93f180a"]
    ]),
    ke = {
        type: "text",
        size: "m",
        inputmode: "text",
        hasCleaner: !0,
        placeholder: ""
    };

function fe(_) {
    const o = O(_),
        r = D(!1),
        a = () => r.value = !0,
        c = () => {
            r.value = !1
        };
    return N(o, (e, m, i) => {
        e == null || e.addEventListener("focusin", a), e == null || e.addEventListener("focusout", c), i(() => {
            e == null || e.removeEventListener("focusin", a), e == null || e.removeEventListener("focusout", c)
        })
    }, {
        immediate: !0
    }), q(r)
}
const be = ["for", "data-size", "data-state"],
    ve = {
        class: "wrapper"
    },
    ye = ["id", "placeholder", "type", "name", "autocomplete", "inputmode", "value", "disabled"],
    ge = ["onClick"],
    xe = y({
        __name: "InputText",
        props: P({
            modelValue: {},
            size: {},
            placeholder: {},
            type: {},
            autocomplete: {},
            name: {},
            disabled: {
                type: Boolean
            },
            invalid: {
                type: Boolean
            },
            inputmode: {},
            hasCleaner: {
                type: Boolean
            }
        }, ke),
        emits: ["update:modelValue"],
        setup(_, {
            expose: o,
            emit: r
        }) {
            const a = _,
                {
                    placeholder: c,
                    invalid: e,
                    disabled: m
                } = T(a),
                i = D(null),
                l = L().useTranslated(c),
                d = fe(i),
                t = j(),
                u = R(() => {
                    if (m.value) return "disabled";
                    if (e.value) return "invalid";
                    if (d.value) return "focused"
                }),
                x = n => {
                    const F = n.target.value;
                    r("update:modelValue", F || "")
                },
                V = () => {
                    r("update:modelValue", null), I()
                },
                I = () => {
                    var n;
                    (n = i.value) == null || n.focus()
                };
            let C;
            return N([d, i], ([n, k], F, H) => {
                H(() => {
                    C && clearTimeout(C)
                }), n && k && (C = setTimeout(() => {
                    k == null || k.scrollIntoView({
                        behavior: "smooth"
                    })
                }, 200))
            }), o({
                focus: I
            }), (n, k) => (p(), f("label", {
                ref_key: "nativeRef",
                ref: i,
                for: s(t),
                class: "tok-input",
                "data-size": n.size,
                "data-state": u.value
            }, [b("div", ve, [b("input", {
                id: s(t),
                class: "native",
                placeholder: s(l),
                type: n.type,
                name: n.name,
                autocomplete: n.autocomplete,
                inputmode: n.inputmode,
                value: n.modelValue,
                disabled: s(m),
                onInput: x
            }, null, 40, ye)]), n.hasCleaner && n.modelValue && !s(m) ? (p(), f("button", {
                key: 0,
                tabindex: "-1",
                type: "button",
                class: "icon",
                title: "Clear input",
                onClick: A(V, ["stop", "prevent"])
            }, [z(s(M), {
                name: "close"
            })], 8, ge)) : K("", !0)], 8, be))
        }
    });
const E = g(xe, [
        ["__scopeId", "data-v-830ac83f"]
    ]),
    Ve = y({
        __name: "form.preset",
        props: P({
            media: {},
            title: {},
            description: {},
            pagination: {},
            shape: {},
            textAlign: {},
            background: {},
            list: {},
            button: {},
            form: {}
        }, te),
        setup(_) {
            const o = _,
                {
                    form: r
                } = T(o),
                a = S(G, null),
                c = a == null ? void 0 : a.state,
                e = l => l.type === "checkbox" ? (c == null ? void 0 : c.value[l.id]) ?? !1 : (c == null ? void 0 : c.value[l.id]) ?? null,
                m = r.value.reduce((l, d) => {
                    const t = e(d);
                    return l[d.id] = t, l
                }, {});
            a == null || a.update(m);
            const i = J(m),
                h = (l, d) => {
                    i[l] = d, a == null || a.update({
                        [l]: d
                    })
                };
            return (l, d) => (p(), v(s(Z), X(Y(o)), {
                default: w(() => [b("form", {
                    onSubmit: d[0] || (d[0] = A(() => {}, ["prevent"]))
                }, [(p(!0), f(Q, null, W(s(r), t => (p(), f("div", {
                    key: t.id,
                    class: $(l.$style.control)
                }, [t.type === "checkbox" ? (p(), v(s(he), B({
                    key: 0
                }, t, {
                    "model-value": !!i[t.id],
                    "onUpdate:modelValue": u => h(t.id, u)
                }), null, 16, ["model-value", "onUpdate:modelValue"])) : t.type === "number" ? (p(), v(s(E), B({
                    key: 1
                }, t, {
                    type: "number",
                    inputmode: "decimal",
                    "model-value": i[t.id],
                    "onUpdate:modelValue": u => h(t.id, u)
                }), null, 16, ["model-value", "onUpdate:modelValue"])) : (p(), v(s(E), B({
                    key: 2
                }, t, {
                    "model-value": i[t.id],
                    "onUpdate:modelValue": u => h(t.id, u)
                }), null, 16, ["model-value", "onUpdate:modelValue"]))], 2))), 128))], 32)]),
                _: 1
            }, 16))
        }
    }),
    Ce = "_control_b4tdi_1",
    Be = {
        control: Ce
    },
    $e = {
        $style: Be
    },
    Te = g(Ve, [
        ["__cssModules", $e]
    ]);
export {
    Te as FormPreset, te as FormPresetDefaultProps
};