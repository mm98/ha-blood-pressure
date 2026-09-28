/* Blood pressure 0.1.0, https://github.com/mm98/ha-blood-pressure */
"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name);
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __decoratorStart = (base) => [, , , __create(base?.[__knownSymbol("metadata")] ?? null)];
  var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
  var __expectFn = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
  var __decoratorContext = (kind, name, done, metadata, fns) => ({ kind: __decoratorStrings[kind], name, metadata, addInitializer: (fn) => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null)) });
  var __decoratorMetadata = (array, target) => __defNormalProp(target, __knownSymbol("metadata"), array[3]);
  var __runInitializers = (array, flags, self, value) => {
    for (var i5 = 0, fns = array[flags >> 1], n5 = fns && fns.length; i5 < n5; i5++) flags & 1 ? fns[i5].call(self) : value = fns[i5].call(self, value);
    return value;
  };
  var __decorateElement = (array, flags, name, decorators, target, extra) => {
    var fn, it, done, ctx, access, k2 = flags & 7, s4 = !!(flags & 8), p3 = !!(flags & 16);
    var j = k2 > 3 ? array.length + 1 : k2 ? s4 ? 1 : 2 : 0, key = __decoratorStrings[k2 + 5];
    var initializers = k2 > 3 && (array[j - 1] = []), extraInitializers = array[j] || (array[j] = []);
    var desc = k2 && (!p3 && !s4 && (target = target.prototype), k2 < 5 && (k2 > 3 || !p3) && __getOwnPropDesc(k2 < 4 ? target : { get [name]() {
      return __privateGet(this, extra);
    }, set [name](x2) {
      return __privateSet(this, extra, x2);
    } }, name));
    k2 ? p3 && k2 < 4 && __name(extra, (k2 > 2 ? "set " : k2 > 1 ? "get " : "") + name) : __name(target, name);
    for (var i5 = decorators.length - 1; i5 >= 0; i5--) {
      ctx = __decoratorContext(k2, name, done = {}, array[3], extraInitializers);
      if (k2) {
        ctx.static = s4, ctx.private = p3, access = ctx.access = { has: p3 ? (x2) => __privateIn(target, x2) : (x2) => name in x2 };
        if (k2 ^ 3) access.get = p3 ? (x2) => (k2 ^ 1 ? __privateGet : __privateMethod)(x2, target, k2 ^ 4 ? extra : desc.get) : (x2) => x2[name];
        if (k2 > 2) access.set = p3 ? (x2, y3) => __privateSet(x2, target, y3, k2 ^ 4 ? extra : desc.set) : (x2, y3) => x2[name] = y3;
      }
      it = (0, decorators[i5])(k2 ? k2 < 4 ? p3 ? extra : desc[key] : k2 > 4 ? void 0 : { get: desc.get, set: desc.set } : target, ctx), done._ = 1;
      if (k2 ^ 4 || it === void 0) __expectFn(it) && (k2 > 4 ? initializers.unshift(it) : k2 ? p3 ? extra = it : desc[key] = it : target = it);
      else if (typeof it !== "object" || it === null) __typeError("Object expected");
      else __expectFn(fn = it.get) && (desc.get = fn), __expectFn(fn = it.set) && (desc.set = fn), __expectFn(fn = it.init) && initializers.unshift(fn);
    }
    return k2 || __decoratorMetadata(array, target), desc && __defProp(target, name, desc), p3 ? k2 ^ 4 ? extra : desc : target;
  };
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError('Cannot use the "in" operator on this value') : member.has(obj);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

  // node_modules/@lit/reactive-element/css-tag.js
  var t = globalThis;
  var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
  var s = /* @__PURE__ */ Symbol();
  var o = /* @__PURE__ */ new WeakMap();
  var n = class {
    constructor(t3, e5, o6) {
      if (this._$cssResult$ = true, o6 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t3, this.t = e5;
    }
    get styleSheet() {
      let t3 = this.o;
      const s4 = this.t;
      if (e && void 0 === t3) {
        const e5 = void 0 !== s4 && 1 === s4.length;
        e5 && (t3 = o.get(s4)), void 0 === t3 && ((this.o = t3 = new CSSStyleSheet()).replaceSync(this.cssText), e5 && o.set(s4, t3));
      }
      return t3;
    }
    toString() {
      return this.cssText;
    }
  };
  var r = (t3) => new n("string" == typeof t3 ? t3 : t3 + "", void 0, s);
  var i = (t3, ...e5) => {
    const o6 = 1 === t3.length ? t3[0] : e5.reduce((e6, s4, o7) => e6 + ((t4) => {
      if (true === t4._$cssResult$) return t4.cssText;
      if ("number" == typeof t4) return t4;
      throw Error("Value passed to 'css' function must be a 'css' function result: " + t4 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
    })(s4) + t3[o7 + 1], t3[0]);
    return new n(o6, t3, s);
  };
  var S = (s4, o6) => {
    if (e) s4.adoptedStyleSheets = o6.map((t3) => t3 instanceof CSSStyleSheet ? t3 : t3.styleSheet);
    else for (const e5 of o6) {
      const o7 = document.createElement("style"), n5 = t.litNonce;
      void 0 !== n5 && o7.setAttribute("nonce", n5), o7.textContent = e5.cssText, s4.appendChild(o7);
    }
  };
  var c = e ? (t3) => t3 : (t3) => t3 instanceof CSSStyleSheet ? ((t4) => {
    let e5 = "";
    for (const s4 of t4.cssRules) e5 += s4.cssText;
    return r(e5);
  })(t3) : t3;

  // node_modules/@lit/reactive-element/reactive-element.js
  var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
  var a = globalThis;
  var c2 = a.trustedTypes;
  var l = c2 ? c2.emptyScript : "";
  var p = a.reactiveElementPolyfillSupport;
  var d = (t3, s4) => t3;
  var u = { toAttribute(t3, s4) {
    switch (s4) {
      case Boolean:
        t3 = t3 ? l : null;
        break;
      case Object:
      case Array:
        t3 = null == t3 ? t3 : JSON.stringify(t3);
    }
    return t3;
  }, fromAttribute(t3, s4) {
    let i5 = t3;
    switch (s4) {
      case Boolean:
        i5 = null !== t3;
        break;
      case Number:
        i5 = null === t3 ? null : Number(t3);
        break;
      case Object:
      case Array:
        try {
          i5 = JSON.parse(t3);
        } catch (t4) {
          i5 = null;
        }
    }
    return i5;
  } };
  var f = (t3, s4) => !i2(t3, s4);
  var b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
  Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
  var y = class extends HTMLElement {
    static addInitializer(t3) {
      this._$Ei(), (this.l ??= []).push(t3);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(t3, s4 = b) {
      if (s4.state && (s4.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t3) && ((s4 = Object.create(s4)).wrapped = true), this.elementProperties.set(t3, s4), !s4.noAccessor) {
        const i5 = /* @__PURE__ */ Symbol(), h3 = this.getPropertyDescriptor(t3, i5, s4);
        void 0 !== h3 && e2(this.prototype, t3, h3);
      }
    }
    static getPropertyDescriptor(t3, s4, i5) {
      const { get: e5, set: r6 } = h(this.prototype, t3) ?? { get() {
        return this[s4];
      }, set(t4) {
        this[s4] = t4;
      } };
      return { get: e5, set(s5) {
        const h3 = e5?.call(this);
        r6?.call(this, s5), this.requestUpdate(t3, h3, i5);
      }, configurable: true, enumerable: true };
    }
    static getPropertyOptions(t3) {
      return this.elementProperties.get(t3) ?? b;
    }
    static _$Ei() {
      if (this.hasOwnProperty(d("elementProperties"))) return;
      const t3 = n2(this);
      t3.finalize(), void 0 !== t3.l && (this.l = [...t3.l]), this.elementProperties = new Map(t3.elementProperties);
    }
    static finalize() {
      if (this.hasOwnProperty(d("finalized"))) return;
      if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
        const t4 = this.properties, s4 = [...r2(t4), ...o2(t4)];
        for (const i5 of s4) this.createProperty(i5, t4[i5]);
      }
      const t3 = this[Symbol.metadata];
      if (null !== t3) {
        const s4 = litPropertyMetadata.get(t3);
        if (void 0 !== s4) for (const [t4, i5] of s4) this.elementProperties.set(t4, i5);
      }
      this._$Eh = /* @__PURE__ */ new Map();
      for (const [t4, s4] of this.elementProperties) {
        const i5 = this._$Eu(t4, s4);
        void 0 !== i5 && this._$Eh.set(i5, t4);
      }
      this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(s4) {
      const i5 = [];
      if (Array.isArray(s4)) {
        const e5 = new Set(s4.flat(1 / 0).reverse());
        for (const s5 of e5) i5.unshift(c(s5));
      } else void 0 !== s4 && i5.push(c(s4));
      return i5;
    }
    static _$Eu(t3, s4) {
      const i5 = s4.attribute;
      return false === i5 ? void 0 : "string" == typeof i5 ? i5 : "string" == typeof t3 ? t3.toLowerCase() : void 0;
    }
    constructor() {
      super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
    }
    _$Ev() {
      this._$ES = new Promise((t3) => this.enableUpdating = t3), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t3) => t3(this));
    }
    addController(t3) {
      (this._$EO ??= /* @__PURE__ */ new Set()).add(t3), void 0 !== this.renderRoot && this.isConnected && t3.hostConnected?.();
    }
    removeController(t3) {
      this._$EO?.delete(t3);
    }
    _$E_() {
      const t3 = /* @__PURE__ */ new Map(), s4 = this.constructor.elementProperties;
      for (const i5 of s4.keys()) this.hasOwnProperty(i5) && (t3.set(i5, this[i5]), delete this[i5]);
      t3.size > 0 && (this._$Ep = t3);
    }
    createRenderRoot() {
      const t3 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
      return S(t3, this.constructor.elementStyles), t3;
    }
    connectedCallback() {
      this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t3) => t3.hostConnected?.());
    }
    enableUpdating(t3) {
    }
    disconnectedCallback() {
      this._$EO?.forEach((t3) => t3.hostDisconnected?.());
    }
    attributeChangedCallback(t3, s4, i5) {
      this._$AK(t3, i5);
    }
    _$ET(t3, s4) {
      const i5 = this.constructor.elementProperties.get(t3), e5 = this.constructor._$Eu(t3, i5);
      if (void 0 !== e5 && true === i5.reflect) {
        const h3 = (void 0 !== i5.converter?.toAttribute ? i5.converter : u).toAttribute(s4, i5.type);
        this._$Em = t3, null == h3 ? this.removeAttribute(e5) : this.setAttribute(e5, h3), this._$Em = null;
      }
    }
    _$AK(t3, s4) {
      const i5 = this.constructor, e5 = i5._$Eh.get(t3);
      if (void 0 !== e5 && this._$Em !== e5) {
        const t4 = i5.getPropertyOptions(e5), h3 = "function" == typeof t4.converter ? { fromAttribute: t4.converter } : void 0 !== t4.converter?.fromAttribute ? t4.converter : u;
        this._$Em = e5;
        const r6 = h3.fromAttribute(s4, t4.type);
        this[e5] = r6 ?? this._$Ej?.get(e5) ?? r6, this._$Em = null;
      }
    }
    requestUpdate(t3, s4, i5, e5 = false, h3) {
      if (void 0 !== t3) {
        const r6 = this.constructor;
        if (false === e5 && (h3 = this[t3]), i5 ??= r6.getPropertyOptions(t3), !((i5.hasChanged ?? f)(h3, s4) || i5.useDefault && i5.reflect && h3 === this._$Ej?.get(t3) && !this.hasAttribute(r6._$Eu(t3, i5)))) return;
        this.C(t3, s4, i5);
      }
      false === this.isUpdatePending && (this._$ES = this._$EP());
    }
    C(t3, s4, { useDefault: i5, reflect: e5, wrapped: h3 }, r6) {
      i5 && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t3) && (this._$Ej.set(t3, r6 ?? s4 ?? this[t3]), true !== h3 || void 0 !== r6) || (this._$AL.has(t3) || (this.hasUpdated || i5 || (s4 = void 0), this._$AL.set(t3, s4)), true === e5 && this._$Em !== t3 && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t3));
    }
    async _$EP() {
      this.isUpdatePending = true;
      try {
        await this._$ES;
      } catch (t4) {
        Promise.reject(t4);
      }
      const t3 = this.scheduleUpdate();
      return null != t3 && await t3, !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      if (!this.isUpdatePending) return;
      if (!this.hasUpdated) {
        if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
          for (const [t5, s5] of this._$Ep) this[t5] = s5;
          this._$Ep = void 0;
        }
        const t4 = this.constructor.elementProperties;
        if (t4.size > 0) for (const [s5, i5] of t4) {
          const { wrapped: t5 } = i5, e5 = this[s5];
          true !== t5 || this._$AL.has(s5) || void 0 === e5 || this.C(s5, void 0, i5, e5);
        }
      }
      let t3 = false;
      const s4 = this._$AL;
      try {
        t3 = this.shouldUpdate(s4), t3 ? (this.willUpdate(s4), this._$EO?.forEach((t4) => t4.hostUpdate?.()), this.update(s4)) : this._$EM();
      } catch (s5) {
        throw t3 = false, this._$EM(), s5;
      }
      t3 && this._$AE(s4);
    }
    willUpdate(t3) {
    }
    _$AE(t3) {
      this._$EO?.forEach((t4) => t4.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t3)), this.updated(t3);
    }
    _$EM() {
      this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$ES;
    }
    shouldUpdate(t3) {
      return true;
    }
    update(t3) {
      this._$Eq &&= this._$Eq.forEach((t4) => this._$ET(t4, this[t4])), this._$EM();
    }
    updated(t3) {
    }
    firstUpdated(t3) {
    }
  };
  y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ??= []).push("2.1.2");

  // node_modules/lit-html/lit-html.js
  var t2 = globalThis;
  var i3 = (t3) => t3;
  var s2 = t2.trustedTypes;
  var e3 = s2 ? s2.createPolicy("lit-html", { createHTML: (t3) => t3 }) : void 0;
  var h2 = "$lit$";
  var o3 = `lit$${Math.random().toFixed(9).slice(2)}$`;
  var n3 = "?" + o3;
  var r3 = `<${n3}>`;
  var l2 = document;
  var c3 = () => l2.createComment("");
  var a2 = (t3) => null === t3 || "object" != typeof t3 && "function" != typeof t3;
  var u2 = Array.isArray;
  var d2 = (t3) => u2(t3) || "function" == typeof t3?.[Symbol.iterator];
  var f2 = "[ 	\n\f\r]";
  var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var _ = /-->/g;
  var m = />/g;
  var p2 = RegExp(`>|${f2}(?:([^\\s"'>=/]+)(${f2}*=${f2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
  var g = /'/g;
  var $ = /"/g;
  var y2 = /^(?:script|style|textarea|title)$/i;
  var x = (t3) => (i5, ...s4) => ({ _$litType$: t3, strings: i5, values: s4 });
  var b2 = x(1);
  var w = x(2);
  var T = x(3);
  var E = /* @__PURE__ */ Symbol.for("lit-noChange");
  var A = /* @__PURE__ */ Symbol.for("lit-nothing");
  var C = /* @__PURE__ */ new WeakMap();
  var P = l2.createTreeWalker(l2, 129);
  function V(t3, i5) {
    if (!u2(t3) || !t3.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== e3 ? e3.createHTML(i5) : i5;
  }
  var N = (t3, i5) => {
    const s4 = t3.length - 1, e5 = [];
    let n5, l3 = 2 === i5 ? "<svg>" : 3 === i5 ? "<math>" : "", c4 = v;
    for (let i6 = 0; i6 < s4; i6++) {
      const s5 = t3[i6];
      let a3, u3, d3 = -1, f3 = 0;
      for (; f3 < s5.length && (c4.lastIndex = f3, u3 = c4.exec(s5), null !== u3); ) f3 = c4.lastIndex, c4 === v ? "!--" === u3[1] ? c4 = _ : void 0 !== u3[1] ? c4 = m : void 0 !== u3[2] ? (y2.test(u3[2]) && (n5 = RegExp("</" + u3[2], "g")), c4 = p2) : void 0 !== u3[3] && (c4 = p2) : c4 === p2 ? ">" === u3[0] ? (c4 = n5 ?? v, d3 = -1) : void 0 === u3[1] ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a3 = u3[1], c4 = void 0 === u3[3] ? p2 : '"' === u3[3] ? $ : g) : c4 === $ || c4 === g ? c4 = p2 : c4 === _ || c4 === m ? c4 = v : (c4 = p2, n5 = void 0);
      const x2 = c4 === p2 && t3[i6 + 1].startsWith("/>") ? " " : "";
      l3 += c4 === v ? s5 + r3 : d3 >= 0 ? (e5.push(a3), s5.slice(0, d3) + h2 + s5.slice(d3) + o3 + x2) : s5 + o3 + (-2 === d3 ? i6 : x2);
    }
    return [V(t3, l3 + (t3[s4] || "<?>") + (2 === i5 ? "</svg>" : 3 === i5 ? "</math>" : "")), e5];
  };
  var S2 = class _S {
    constructor({ strings: t3, _$litType$: i5 }, e5) {
      let r6;
      this.parts = [];
      let l3 = 0, a3 = 0;
      const u3 = t3.length - 1, d3 = this.parts, [f3, v2] = N(t3, i5);
      if (this.el = _S.createElement(f3, e5), P.currentNode = this.el.content, 2 === i5 || 3 === i5) {
        const t4 = this.el.content.firstChild;
        t4.replaceWith(...t4.childNodes);
      }
      for (; null !== (r6 = P.nextNode()) && d3.length < u3; ) {
        if (1 === r6.nodeType) {
          if (r6.hasAttributes()) for (const t4 of r6.getAttributeNames()) if (t4.endsWith(h2)) {
            const i6 = v2[a3++], s4 = r6.getAttribute(t4).split(o3), e6 = /([.?@])?(.*)/.exec(i6);
            d3.push({ type: 1, index: l3, name: e6[2], strings: s4, ctor: "." === e6[1] ? I : "?" === e6[1] ? L : "@" === e6[1] ? z : H }), r6.removeAttribute(t4);
          } else t4.startsWith(o3) && (d3.push({ type: 6, index: l3 }), r6.removeAttribute(t4));
          if (y2.test(r6.tagName)) {
            const t4 = r6.textContent.split(o3), i6 = t4.length - 1;
            if (i6 > 0) {
              r6.textContent = s2 ? s2.emptyScript : "";
              for (let s4 = 0; s4 < i6; s4++) r6.append(t4[s4], c3()), P.nextNode(), d3.push({ type: 2, index: ++l3 });
              r6.append(t4[i6], c3());
            }
          }
        } else if (8 === r6.nodeType) if (r6.data === n3) d3.push({ type: 2, index: l3 });
        else {
          let t4 = -1;
          for (; -1 !== (t4 = r6.data.indexOf(o3, t4 + 1)); ) d3.push({ type: 7, index: l3 }), t4 += o3.length - 1;
        }
        l3++;
      }
    }
    static createElement(t3, i5) {
      const s4 = l2.createElement("template");
      return s4.innerHTML = t3, s4;
    }
  };
  function M(t3, i5, s4 = t3, e5) {
    if (i5 === E) return i5;
    let h3 = void 0 !== e5 ? s4._$Co?.[e5] : s4._$Cl;
    const o6 = a2(i5) ? void 0 : i5._$litDirective$;
    return h3?.constructor !== o6 && (h3?._$AO?.(false), void 0 === o6 ? h3 = void 0 : (h3 = new o6(t3), h3._$AT(t3, s4, e5)), void 0 !== e5 ? (s4._$Co ??= [])[e5] = h3 : s4._$Cl = h3), void 0 !== h3 && (i5 = M(t3, h3._$AS(t3, i5.values), h3, e5)), i5;
  }
  var R = class {
    constructor(t3, i5) {
      this._$AV = [], this._$AN = void 0, this._$AD = t3, this._$AM = i5;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t3) {
      const { el: { content: i5 }, parts: s4 } = this._$AD, e5 = (t3?.creationScope ?? l2).importNode(i5, true);
      P.currentNode = e5;
      let h3 = P.nextNode(), o6 = 0, n5 = 0, r6 = s4[0];
      for (; void 0 !== r6; ) {
        if (o6 === r6.index) {
          let i6;
          2 === r6.type ? i6 = new k(h3, h3.nextSibling, this, t3) : 1 === r6.type ? i6 = new r6.ctor(h3, r6.name, r6.strings, this, t3) : 6 === r6.type && (i6 = new Z(h3, this, t3)), this._$AV.push(i6), r6 = s4[++n5];
        }
        o6 !== r6?.index && (h3 = P.nextNode(), o6++);
      }
      return P.currentNode = l2, e5;
    }
    p(t3) {
      let i5 = 0;
      for (const s4 of this._$AV) void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t3, s4, i5), i5 += s4.strings.length - 2) : s4._$AI(t3[i5])), i5++;
    }
  };
  var k = class _k {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t3, i5, s4, e5) {
      this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t3, this._$AB = i5, this._$AM = s4, this.options = e5, this._$Cv = e5?.isConnected ?? true;
    }
    get parentNode() {
      let t3 = this._$AA.parentNode;
      const i5 = this._$AM;
      return void 0 !== i5 && 11 === t3?.nodeType && (t3 = i5.parentNode), t3;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t3, i5 = this) {
      t3 = M(this, t3, i5), a2(t3) ? t3 === A || null == t3 || "" === t3 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t3 !== this._$AH && t3 !== E && this._(t3) : void 0 !== t3._$litType$ ? this.$(t3) : void 0 !== t3.nodeType ? this.T(t3) : d2(t3) ? this.k(t3) : this._(t3);
    }
    O(t3) {
      return this._$AA.parentNode.insertBefore(t3, this._$AB);
    }
    T(t3) {
      this._$AH !== t3 && (this._$AR(), this._$AH = this.O(t3));
    }
    _(t3) {
      this._$AH !== A && a2(this._$AH) ? this._$AA.nextSibling.data = t3 : this.T(l2.createTextNode(t3)), this._$AH = t3;
    }
    $(t3) {
      const { values: i5, _$litType$: s4 } = t3, e5 = "number" == typeof s4 ? this._$AC(t3) : (void 0 === s4.el && (s4.el = S2.createElement(V(s4.h, s4.h[0]), this.options)), s4);
      if (this._$AH?._$AD === e5) this._$AH.p(i5);
      else {
        const t4 = new R(e5, this), s5 = t4.u(this.options);
        t4.p(i5), this.T(s5), this._$AH = t4;
      }
    }
    _$AC(t3) {
      let i5 = C.get(t3.strings);
      return void 0 === i5 && C.set(t3.strings, i5 = new S2(t3)), i5;
    }
    k(t3) {
      u2(this._$AH) || (this._$AH = [], this._$AR());
      const i5 = this._$AH;
      let s4, e5 = 0;
      for (const h3 of t3) e5 === i5.length ? i5.push(s4 = new _k(this.O(c3()), this.O(c3()), this, this.options)) : s4 = i5[e5], s4._$AI(h3), e5++;
      e5 < i5.length && (this._$AR(s4 && s4._$AB.nextSibling, e5), i5.length = e5);
    }
    _$AR(t3 = this._$AA.nextSibling, s4) {
      for (this._$AP?.(false, true, s4); t3 !== this._$AB; ) {
        const s5 = i3(t3).nextSibling;
        i3(t3).remove(), t3 = s5;
      }
    }
    setConnected(t3) {
      void 0 === this._$AM && (this._$Cv = t3, this._$AP?.(t3));
    }
  };
  var H = class {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t3, i5, s4, e5, h3) {
      this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t3, this.name = i5, this._$AM = e5, this.options = h3, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = A;
    }
    _$AI(t3, i5 = this, s4, e5) {
      const h3 = this.strings;
      let o6 = false;
      if (void 0 === h3) t3 = M(this, t3, i5, 0), o6 = !a2(t3) || t3 !== this._$AH && t3 !== E, o6 && (this._$AH = t3);
      else {
        const e6 = t3;
        let n5, r6;
        for (t3 = h3[0], n5 = 0; n5 < h3.length - 1; n5++) r6 = M(this, e6[s4 + n5], i5, n5), r6 === E && (r6 = this._$AH[n5]), o6 ||= !a2(r6) || r6 !== this._$AH[n5], r6 === A ? t3 = A : t3 !== A && (t3 += (r6 ?? "") + h3[n5 + 1]), this._$AH[n5] = r6;
      }
      o6 && !e5 && this.j(t3);
    }
    j(t3) {
      t3 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t3 ?? "");
    }
  };
  var I = class extends H {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t3) {
      this.element[this.name] = t3 === A ? void 0 : t3;
    }
  };
  var L = class extends H {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t3) {
      this.element.toggleAttribute(this.name, !!t3 && t3 !== A);
    }
  };
  var z = class extends H {
    constructor(t3, i5, s4, e5, h3) {
      super(t3, i5, s4, e5, h3), this.type = 5;
    }
    _$AI(t3, i5 = this) {
      if ((t3 = M(this, t3, i5, 0) ?? A) === E) return;
      const s4 = this._$AH, e5 = t3 === A && s4 !== A || t3.capture !== s4.capture || t3.once !== s4.once || t3.passive !== s4.passive, h3 = t3 !== A && (s4 === A || e5);
      e5 && this.element.removeEventListener(this.name, this, s4), h3 && this.element.addEventListener(this.name, this, t3), this._$AH = t3;
    }
    handleEvent(t3) {
      "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t3) : this._$AH.handleEvent(t3);
    }
  };
  var Z = class {
    constructor(t3, i5, s4) {
      this.element = t3, this.type = 6, this._$AN = void 0, this._$AM = i5, this.options = s4;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t3) {
      M(this, t3);
    }
  };
  var B = t2.litHtmlPolyfillSupport;
  B?.(S2, k), (t2.litHtmlVersions ??= []).push("3.3.3");
  var D = (t3, i5, s4) => {
    const e5 = s4?.renderBefore ?? i5;
    let h3 = e5._$litPart$;
    if (void 0 === h3) {
      const t4 = s4?.renderBefore ?? null;
      e5._$litPart$ = h3 = new k(i5.insertBefore(c3(), t4), t4, void 0, s4 ?? {});
    }
    return h3._$AI(t3), h3;
  };

  // node_modules/lit-element/lit-element.js
  var s3 = globalThis;
  var i4 = class extends y {
    constructor() {
      super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
    }
    createRenderRoot() {
      const t3 = super.createRenderRoot();
      return this.renderOptions.renderBefore ??= t3.firstChild, t3;
    }
    update(t3) {
      const r6 = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t3), this._$Do = D(r6, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      super.connectedCallback(), this._$Do?.setConnected(true);
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this._$Do?.setConnected(false);
    }
    render() {
      return E;
    }
  };
  i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i4 });
  var o4 = s3.litElementPolyfillSupport;
  o4?.({ LitElement: i4 });
  (s3.litElementVersions ??= []).push("4.2.2");

  // node_modules/@lit/reactive-element/decorators/property.js
  var o5 = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
  var r4 = (t3 = o5, e5, r6) => {
    const { kind: n5, metadata: i5 } = r6;
    let s4 = globalThis.litPropertyMetadata.get(i5);
    if (void 0 === s4 && globalThis.litPropertyMetadata.set(i5, s4 = /* @__PURE__ */ new Map()), "setter" === n5 && ((t3 = Object.create(t3)).wrapped = true), s4.set(r6.name, t3), "accessor" === n5) {
      const { name: o6 } = r6;
      return { set(r7) {
        const n6 = e5.get.call(this);
        e5.set.call(this, r7), this.requestUpdate(o6, n6, t3, true, r7);
      }, init(e6) {
        return void 0 !== e6 && this.C(o6, void 0, t3, e6), e6;
      } };
    }
    if ("setter" === n5) {
      const { name: o6 } = r6;
      return function(r7) {
        const n6 = this[o6];
        e5.call(this, r7), this.requestUpdate(o6, n6, t3, true, r7);
      };
    }
    throw Error("Unsupported decorator location: " + n5);
  };
  function n4(t3) {
    return (e5, o6) => "object" == typeof o6 ? r4(t3, e5, o6) : ((t4, e6, o7) => {
      const r6 = e6.hasOwnProperty(o7);
      return e6.constructor.createProperty(o7, t4), r6 ? Object.getOwnPropertyDescriptor(e6, o7) : void 0;
    })(t3, e5, o6);
  }

  // node_modules/@lit/reactive-element/decorators/state.js
  function r5(r6) {
    return n4({ ...r6, state: true, attribute: false });
  }

  // src/config.ts
  var CHART_TYPES = ["bars", "lines", "daily", "split", "calendar", "pie"];
  var GUIDELINE_IDS = ["esc_2024", "esc_esh_2018", "acc_aha_2017"];
  var DEFAULT_DAYS = 10;
  var SHOW_KEYS = [
    "show_name",
    "show_icon",
    "show_state",
    "show_category",
    "show_average",
    "show_pulse",
    "show_scales",
    "show_chart",
    "show_legend"
  ];
  var shows = (config, key) => config[key] !== false;
  var DEFAULTS = {
    chart_type: "bars",
    days_to_show: DEFAULT_DAYS,
    guideline: "esc_2024",
    ...Object.fromEntries(SHOW_KEYS.map((key) => [key, true]))
  };
  var PULSE_RANGE = [60, 100];
  var isSet = (value) => value !== void 0 && value !== null && value !== "";

  // src/guidelines.ts
  var color = (name, fallback) => `var(--${name}-color, ${fallback})`;
  var GREEN = color("green", "#4caf50");
  var LIGHT_GREEN = color("light-green", "#8bc34a");
  var AMBER = color("amber", "#ffc107");
  var ORANGE = color("orange", "#ff9800");
  var DEEP_ORANGE = color("deep-orange", "#ff5722");
  var RED = color("red", "#f44336");
  var LOW = { key: "low", systolic: 90, diastolic: 60, color: color("blue", "#2196f3") };
  var ABOVE = 1e-9;
  var GUIDELINES = {
    // 2024 ESC Guidelines for the management of elevated blood pressure and hypertension.
    esc_2024: [
      { key: "non_elevated", systolic: 0, diastolic: 0, color: GREEN },
      { key: "elevated", systolic: 120, diastolic: 70, color: AMBER },
      { key: "hypertension", systolic: 140, diastolic: 90, color: RED }
    ],
    // 2018 ESC/ESH Guidelines for the management of arterial hypertension.
    esc_esh_2018: [
      { key: "optimal", systolic: 0, diastolic: 0, color: GREEN },
      { key: "normal", systolic: 120, diastolic: 80, color: LIGHT_GREEN },
      { key: "high_normal", systolic: 130, diastolic: 85, color: AMBER },
      { key: "grade_1", systolic: 140, diastolic: 90, color: ORANGE },
      { key: "grade_2", systolic: 160, diastolic: 100, color: DEEP_ORANGE },
      { key: "grade_3", systolic: 180, diastolic: 110, color: RED }
    ],
    // 2017 ACC/AHA Guideline for high blood pressure in adults. Elevated is
    // set by the systolic value alone, and a crisis starts above 180 or above 120.
    acc_aha_2017: [
      { key: "normal", systolic: 0, diastolic: 0, color: GREEN },
      { key: "elevated", systolic: 120, diastolic: Infinity, color: AMBER },
      { key: "stage_1", systolic: 130, diastolic: 80, color: ORANGE },
      { key: "stage_2", systolic: 140, diastolic: 90, color: DEEP_ORANGE },
      { key: "crisis", systolic: 180 + ABOVE, diastolic: 120 + ABOVE, color: RED }
    ]
  };
  var levelOf = (categories, value, axis) => categories.reduce((level, category, index) => value >= category[axis] ? index : level, 0);
  var classify = (categories, systolic, diastolic) => {
    const level = Math.max(levelOf(categories, systolic, "systolic"), levelOf(categories, diastolic, "diastolic"));
    if (level === 0 && (systolic < LOW.systolic || diastolic < LOW.diastolic)) {
      return LOW;
    }
    return categories[level];
  };
  var classifyValue = (categories, axis, value) => {
    const level = levelOf(categories, value, axis);
    return level === 0 && value < LOW[axis] ? LOW : categories[level];
  };
  var normalRange = (categories, axis) => [
    LOW[axis],
    Math.min(...categories.slice(1).map((category) => category[axis]))
  ];
  var scaleOf = (categories, axis) => [
    { from: -Infinity, category: LOW },
    { from: LOW[axis], category: categories[0] },
    ...categories.slice(1).filter((category) => Number.isFinite(category[axis])).map((category) => ({ from: category[axis], category }))
  ];

  // src/i18n/da.json
  var da_default = {
    card: {
      description: "Dine blodtryksmålinger over tid, farvet efter kategorierne i en retningslinje for blodtryk."
    },
    label: {
      systolic: "Sensor for den systoliske (øverste) værdi",
      diastolic: "Sensor for den diastoliske (nederste) værdi",
      pulse: "Sensor for pulsen",
      chart: "Diagram",
      chart_type: "Diagram",
      days_to_show: "Antal dage",
      guideline: "Retningslinje",
      show: "Vis",
      show_name: "Navn",
      show_icon: "Ikon",
      show_state: "Seneste værdi",
      show_category: "Kategori for seneste måling",
      show_average: "Gennemsnit og laveste til højeste værdi",
      show_pulse: "Puls",
      show_scales: "Skalaer for seneste måling",
      show_chart: "Diagram",
      show_legend: "Kategorier under diagrammet"
    },
    helper: {
      pulse: "Valgfri.",
      days_to_show: "Recorder gemmer som standard 10 dage.",
      guideline: "Bestemmer kategorien og farven for hver måling.",
      show_pulse: "Seneste puls og en pulslinje under diagrammet."
    },
    chart_type: {
      bars: "Søjler (standard)",
      lines: "Linjer",
      daily: "Gennemsnit pr. dag",
      split: "Separate diagrammer",
      calendar: "Kalender",
      pie: "Cirkeldiagram"
    },
    guideline: {
      esc_2024: "ESC 2024, Europa (standard)",
      esc_esh_2018: "ESC/ESH 2018, Europa",
      acc_aha_2017: "ACC/AHA 2017, USA"
    },
    category: {
      low: "Lavt",
      non_elevated: "Ikke forhøjet",
      elevated: "Forhøjet",
      hypertension: "Hypertension",
      optimal: "Optimalt",
      normal: "Normalt",
      high_normal: "Højt normalt",
      grade_1: "Hypertension grad 1",
      grade_2: "Hypertension grad 2",
      grade_3: "Hypertension grad 3",
      stage_1: "Hypertension stadie 1",
      stage_2: "Hypertension stadie 2",
      crisis: "Hypertensiv krise"
    },
    text: {
      name: "Blodtryk",
      pulse: "Puls {pulse}",
      average: "gennemsnit {systolic}/{diastolic} af {count} målinger",
      average_one: "gennemsnit {systolic}/{diastolic} af 1 måling",
      reading: "måling",
      readings: "målinger",
      no_readings: "Ingen målinger de seneste {days} dage. Recorder skal gemme historikken for disse sensorer.",
      no_history: "Historikken for sensorerne kunne ikke læses.",
      systolic: "Systolisk",
      diastolic: "Diastolisk",
      pulse_name: "Puls",
      ranges: "systolisk {systolic}, diastolisk {diastolic}"
    }
  };

  // src/i18n/de.json
  var de_default = {
    card: {
      description: "Deine Blutdruckwerte im Zeitverlauf, gefärbt nach den Kategorien einer Blutdruck-Leitlinie."
    },
    label: {
      systolic: "Sensor für den systolischen (oberen) Wert",
      diastolic: "Sensor für den diastolischen (unteren) Wert",
      pulse: "Sensor für den Puls",
      chart: "Diagramm",
      chart_type: "Diagramm",
      days_to_show: "Anzuzeigende Tage",
      guideline: "Leitlinie",
      show: "Anzeigen",
      show_name: "Name",
      show_icon: "Symbol",
      show_state: "Letzter Wert",
      show_category: "Kategorie der letzten Messung",
      show_average: "Durchschnitt und niedrigster bis höchster Wert",
      show_pulse: "Puls",
      show_scales: "Skalen für die letzte Messung",
      show_chart: "Diagramm",
      show_legend: "Kategorien unter dem Diagramm"
    },
    helper: {
      pulse: "Optional.",
      days_to_show: "Der Recorder speichert standardmäßig 10 Tage.",
      guideline: "Bestimmt die Kategorie und die Farbe jeder Messung.",
      show_pulse: "Der letzte Puls und eine Pulslinie unter dem Diagramm."
    },
    chart_type: {
      bars: "Balken (Standard)",
      lines: "Linien",
      daily: "Tagesdurchschnitte",
      split: "Getrennte Diagramme",
      calendar: "Kalender",
      pie: "Kreisdiagramm"
    },
    guideline: {
      esc_2024: "ESC 2024, Europa (Standard)",
      esc_esh_2018: "ESC/ESH 2018, Europa",
      acc_aha_2017: "ACC/AHA 2017, USA"
    },
    category: {
      low: "Niedrig",
      non_elevated: "Nicht erhöht",
      elevated: "Erhöht",
      hypertension: "Hypertonie",
      optimal: "Optimal",
      normal: "Normal",
      high_normal: "Hoch normal",
      grade_1: "Hypertonie Grad 1",
      grade_2: "Hypertonie Grad 2",
      grade_3: "Hypertonie Grad 3",
      stage_1: "Hypertonie Stadium 1",
      stage_2: "Hypertonie Stadium 2",
      crisis: "Hypertensive Krise"
    },
    text: {
      name: "Blutdruck",
      pulse: "Puls {pulse}",
      average: "Durchschnitt {systolic}/{diastolic} aus {count} Messungen",
      average_one: "Durchschnitt {systolic}/{diastolic} aus 1 Messung",
      reading: "Messung",
      readings: "Messungen",
      no_readings: "Keine Messungen in den letzten {days} Tagen. Der Recorder muss den Verlauf dieser Sensoren speichern.",
      no_history: "Der Verlauf der Sensoren konnte nicht gelesen werden.",
      systolic: "Systolisch",
      diastolic: "Diastolisch",
      pulse_name: "Puls",
      ranges: "systolisch {systolic}, diastolisch {diastolic}"
    }
  };

  // src/i18n/en.json
  var en_default = {
    card: {
      description: "Your blood pressure readings over time, colored by the categories of a blood pressure guideline."
    },
    label: {
      systolic: "Sensor for the systolic (upper) value",
      diastolic: "Sensor for the diastolic (lower) value",
      pulse: "Sensor for the pulse",
      chart: "Chart",
      chart_type: "Chart",
      days_to_show: "Days to show",
      guideline: "Guideline",
      show: "Show",
      show_name: "Name",
      show_icon: "Icon",
      show_state: "Latest value",
      show_category: "Category of the latest reading",
      show_average: "Average and lowest to highest value",
      show_pulse: "Pulse",
      show_scales: "Scales for the latest reading",
      show_chart: "Chart",
      show_legend: "Categories below the chart"
    },
    helper: {
      pulse: "Optional.",
      days_to_show: "The recorder keeps 10 days by default.",
      guideline: "Decides the category and the color of each reading.",
      show_pulse: "The latest pulse, and a pulse line below the chart."
    },
    chart_type: {
      bars: "Bars (default)",
      lines: "Lines",
      daily: "Daily averages",
      split: "Separate charts",
      calendar: "Calendar",
      pie: "Pie chart"
    },
    guideline: {
      esc_2024: "ESC 2024, Europe (default)",
      esc_esh_2018: "ESC/ESH 2018, Europe",
      acc_aha_2017: "ACC/AHA 2017, United States"
    },
    category: {
      low: "Low",
      non_elevated: "Non-elevated",
      elevated: "Elevated",
      hypertension: "Hypertension",
      optimal: "Optimal",
      normal: "Normal",
      high_normal: "High normal",
      grade_1: "Grade 1 hypertension",
      grade_2: "Grade 2 hypertension",
      grade_3: "Grade 3 hypertension",
      stage_1: "Stage 1 hypertension",
      stage_2: "Stage 2 hypertension",
      crisis: "Hypertensive crisis"
    },
    text: {
      name: "Blood pressure",
      pulse: "Pulse {pulse}",
      average: "average {systolic}/{diastolic} of {count} readings",
      average_one: "average {systolic}/{diastolic} of 1 reading",
      reading: "reading",
      readings: "readings",
      no_readings: "No readings in the last {days} days. The recorder must keep the history of these sensors.",
      no_history: "The history of the sensors could not be read.",
      systolic: "Systolic",
      diastolic: "Diastolic",
      pulse_name: "Pulse",
      ranges: "systolic {systolic}, diastolic {diastolic}"
    }
  };

  // src/i18n/es.json
  var es_default = {
    card: {
      description: "Tus mediciones de presión arterial a lo largo del tiempo, con los colores de las categorías de una guía de presión arterial."
    },
    label: {
      systolic: "Sensor del valor sistólico (superior)",
      diastolic: "Sensor del valor diastólico (inferior)",
      pulse: "Sensor del pulso",
      chart: "Gráfico",
      chart_type: "Gráfico",
      days_to_show: "Días a mostrar",
      guideline: "Guía",
      show: "Mostrar",
      show_name: "Nombre",
      show_icon: "Icono",
      show_state: "Último valor",
      show_category: "Categoría de la última medición",
      show_average: "Promedio y valor más bajo a más alto",
      show_pulse: "Pulso",
      show_scales: "Escalas de la última medición",
      show_chart: "Gráfico",
      show_legend: "Categorías debajo del gráfico"
    },
    helper: {
      pulse: "Opcional.",
      days_to_show: "El recorder guarda 10 días de forma predeterminada.",
      guideline: "Decide la categoría y el color de cada medición.",
      show_pulse: "El último pulso y una línea de pulso debajo del gráfico."
    },
    chart_type: {
      bars: "Barras (predeterminado)",
      lines: "Líneas",
      daily: "Promedios diarios",
      split: "Gráficos separados",
      calendar: "Calendario",
      pie: "Gráfico circular"
    },
    guideline: {
      esc_2024: "ESC 2024, Europa (predeterminada)",
      esc_esh_2018: "ESC/ESH 2018, Europa",
      acc_aha_2017: "ACC/AHA 2017, Estados Unidos"
    },
    category: {
      low: "Baja",
      non_elevated: "No elevada",
      elevated: "Elevada",
      hypertension: "Hipertensión",
      optimal: "Óptima",
      normal: "Normal",
      high_normal: "Normal alta",
      grade_1: "Hipertensión grado 1",
      grade_2: "Hipertensión grado 2",
      grade_3: "Hipertensión grado 3",
      stage_1: "Hipertensión estadio 1",
      stage_2: "Hipertensión estadio 2",
      crisis: "Crisis hipertensiva"
    },
    text: {
      name: "Presión arterial",
      pulse: "Pulso {pulse}",
      average: "promedio {systolic}/{diastolic} de {count} mediciones",
      average_one: "promedio {systolic}/{diastolic} de 1 medición",
      reading: "medición",
      readings: "mediciones",
      no_readings: "No hay mediciones en los últimos {days} días. El recorder debe guardar el historial de estos sensores.",
      no_history: "No se pudo leer el historial de los sensores.",
      systolic: "Sistólica",
      diastolic: "Diastólica",
      pulse_name: "Pulso",
      ranges: "sistólica {systolic}, diastólica {diastolic}"
    }
  };

  // src/i18n/index.ts
  var TRANSLATIONS = { da: da_default, de: de_default, en: en_default, es: es_default };
  var find = (translation, key) => {
    let found = translation;
    for (const part of key.split(".")) {
      found = found?.[part];
    }
    return typeof found === "string" ? found : void 0;
  };
  var hasTranslation = (key) => find(en_default, key) !== void 0;
  var translate = (key, language, values = {}) => (find(TRANSLATIONS[language.split("-")[0]], key) ?? find(en_default, key) ?? key).replace(
    /\{(\w+)\}/g,
    (text, name) => name in values ? String(values[name]) : text
  );
  var languageOf = (hass) => hass?.locale.language ?? hass?.language ?? document.documentElement.lang;

  // src/readings.ts
  var PAIR_MS = 60 * 1e3;
  var SITTING_MS = 10 * 60 * 1e3;
  var mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
  var meanPulse = (items) => {
    const pulses = items.flatMap((item) => item.pulse === void 0 ? [] : [item.pulse]);
    return pulses.length ? mean(pulses) : void 0;
  };
  var changesOf = (role, states = []) => {
    const changes = [];
    let last;
    let available = true;
    for (const state of states) {
      const value = state.s === "" ? NaN : Number(state.s);
      if (!Number.isFinite(value)) {
        available = false;
        continue;
      }
      const returned = !available && value === last;
      available = true;
      if (!returned) {
        last = value;
        changes.push({ time: (state.lc ?? state.lu) * 1e3, role, value });
      }
    }
    return changes;
  };
  var pairChanges = (changes, roles) => {
    const measurements = [];
    const known = {};
    let pending;
    let pendingAt = 0;
    const commit = () => {
      if (pending && known.systolic !== void 0 && known.diastolic !== void 0) {
        measurements.push({ time: pendingAt, systolic: known.systolic, diastolic: known.diastolic, pulse: known.pulse });
      }
      pending = void 0;
    };
    for (const change of [...changes].sort((a3, b3) => a3.time - b3.time)) {
      if (pending && (pending.has(change.role) || change.time - pendingAt > PAIR_MS)) {
        commit();
      }
      if (!pending) {
        pending = /* @__PURE__ */ new Set();
        pendingAt = change.time;
      }
      pending.add(change.role);
      known[change.role] = change.value;
      if (roles.every((role) => pending?.has(role))) {
        commit();
      }
    }
    commit();
    return measurements;
  };
  var mergeSittings = (measurements) => {
    const sittings = [];
    for (const measurement of measurements) {
      const sitting = sittings.at(-1);
      if (sitting && measurement.time - sitting[0].time <= SITTING_MS) {
        sitting.push(measurement);
      } else {
        sittings.push([measurement]);
      }
    }
    return sittings.map((sitting) => averageReading(sitting[0].time, sitting));
  };
  var averageReading = (time, measurements) => ({
    time,
    systolic: mean(measurements.map((measurement) => measurement.systolic)),
    diastolic: mean(measurements.map((measurement) => measurement.diastolic)),
    pulse: meanPulse(measurements),
    measurements
  });
  var rangeOf = (reading, axis) => {
    const values = reading.measurements.flatMap((measurement) => measurement[axis] === void 0 ? [] : [measurement[axis]]);
    return values.length ? [Math.min(...values), Math.max(...values)] : void 0;
  };
  var averageOf = (readings) => readings.length ? {
    systolic: mean(readings.map((reading) => reading.systolic)),
    diastolic: mean(readings.map((reading) => reading.diastolic)),
    pulse: meanPulse(readings),
    readings: readings.length
  } : void 0;
  var fetchReadings = async (hass, config, days) => {
    const sensors = [
      ["systolic", config.systolic],
      ["diastolic", config.diastolic],
      ["pulse", config.pulse]
    ];
    const used = sensors.filter((sensor) => Boolean(sensor[1]));
    const end = /* @__PURE__ */ new Date();
    const start = new Date(end.getTime() - days * 24 * 3600 * 1e3);
    const history = await hass.callWS({
      type: "history/history_during_period",
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      entity_ids: used.map(([, entityId]) => entityId),
      include_start_time_state: false,
      significant_changes_only: false,
      minimal_response: true,
      no_attributes: true
    });
    const changes = used.flatMap(([role, entityId]) => changesOf(role, history[entityId]));
    return mergeSittings(pairChanges(changes, used.map(([role]) => role)));
  };

  // src/charts.ts
  var WIDTH = 500;
  var LEFT = 4;
  var RIGHT = 468;
  var DAY_MS = 24 * 3600 * 1e3;
  var TOP = 10;
  var BOTTOM = 190;
  var PULSE_TOP = 206;
  var PULSE_BOTTOM = 252;
  var DATES = 18;
  var scale = (low, high, top, bottom) => ({
    low,
    high,
    y: (value) => bottom - (value - low) / (high - low) * (bottom - top)
  });
  var valueScale = (values, min, max, top, bottom) => scale(Math.min(min, ...values) - 5, Math.max(max, ...values) + 5, top, bottom);
  var timeScale = ({ start, end }) => (time) => LEFT + (time - start) / Math.max(end - start, 1) * (RIGHT - LEFT);
  var valuesOf = (readings, axis) => readings.flatMap((reading) => reading.measurements.flatMap((measurement) => measurement[axis] ?? []));
  var grid = (area, step) => {
    const lines2 = [];
    for (let value = Math.ceil(area.low / step) * step; value <= area.high; value += step) {
      lines2.push(w`
			<line class="grid" x1=${LEFT} x2=${RIGHT} y1=${area.y(value)} y2=${area.y(value)}></line>
			<text class="axis" x=${RIGHT + 6} y=${area.y(value) + 4}>${value}</text>
		`);
    }
    return lines2;
  };
  var gridAt = (area, values) => values.map(
    (value) => w`
			<line class="grid" x1=${LEFT} x2=${RIGHT} y1=${area.y(value)} y2=${area.y(value)}></line>
			<text class="axis" x=${RIGHT + 6} y=${area.y(value) + 4}>${value}</text>
		`
  );
  var band = (area, [from, to]) => {
    const top = area.y(Math.min(to, area.high));
    return w`<rect class="normal" x=${LEFT} width=${RIGHT - LEFT} y=${top} height=${Math.max(area.y(Math.max(from, area.low)) - top, 0)}></rect>`;
  };
  var polyline = (points) => w`<polyline class="line" points=${points.map(([x2, y3]) => `${x2},${y3}`).join(" ")}></polyline>`;
  var fill = (category) => `fill: ${category.color}`;
  var pulseArea = (input, x2, top = PULSE_TOP, bottom = PULSE_BOTTOM) => {
    const readings = input.readings.filter((reading) => reading.pulse !== void 0);
    const area = valueScale(valuesOf(readings, "pulse"), PULSE_RANGE[0], PULSE_RANGE[1], top, bottom);
    return w`
		${band(area, PULSE_RANGE)}
		${gridAt(area, PULSE_RANGE)}
		${polyline(readings.map((reading) => [x2(reading), area.y(reading.pulse)]))}
		${readings.map((reading) => w`<circle class="pulse" cx=${x2(reading)} cy=${area.y(reading.pulse)} r="3"></circle>`)}
	`;
  };
  var dates = ({ start, end, language, timeZone }, y3) => {
    const format = new Intl.DateTimeFormat(language, { day: "numeric", month: "short", timeZone });
    return w`
		<text class="axis" x=${LEFT} y=${y3}>${format.format(start)}</text>
		<text class="axis" x=${RIGHT} y=${y3} text-anchor="end">${format.format(end)}</text>
	`;
  };
  var timeChartHeight = (input) => (input.pulse ? PULSE_BOTTOM : BOTTOM) + DATES + 10;
  var bars = {
    height: timeChartHeight,
    draw: (input) => {
      const x2 = timeScale(input);
      const area = valueScale([...valuesOf(input.readings, "systolic"), ...valuesOf(input.readings, "diastolic")], 60, 150, TOP, BOTTOM);
      const width = Math.max(2, Math.min(10, (RIGHT - LEFT) / Math.max(input.readings.length, 1) * 0.6));
      return w`
			${grid(area, 20)}
			${input.readings.map((reading) => {
        const top = area.y(reading.systolic);
        return w`<rect x=${x2(reading.time) - width / 2} y=${top} width=${width} rx="2"
					height=${Math.max(area.y(reading.diastolic) - top, 2)}
					style=${fill(classify(input.categories, reading.systolic, reading.diastolic))}></rect>`;
      })}
			${input.pulse ? pulseArea(input, (reading) => x2(reading.time)) : A}
			${dates(input, timeChartHeight(input) - 6)}
		`;
    }
  };
  var lines = {
    height: timeChartHeight,
    draw: (input) => {
      const x2 = timeScale(input);
      const area = valueScale([...valuesOf(input.readings, "systolic"), ...valuesOf(input.readings, "diastolic")], 60, 150, TOP, BOTTOM);
      const line = (axis) => polyline(input.readings.map((reading) => [x2(reading.time), area.y(reading[axis])]));
      return w`
			${band(area, normalRange(input.categories, "systolic"))}
			${band(area, normalRange(input.categories, "diastolic"))}
			${grid(area, 20)}
			${line("systolic")}
			${line("diastolic")}
			${input.readings.map((reading) => {
        const style = fill(classify(input.categories, reading.systolic, reading.diastolic));
        return w`
					<circle cx=${x2(reading.time)} cy=${area.y(reading.systolic)} r="4" style=${style}></circle>
					<circle cx=${x2(reading.time)} cy=${area.y(reading.diastolic)} r="4" style=${style}></circle>
				`;
      })}
			${input.pulse ? pulseArea(input, (reading) => x2(reading.time)) : A}
			${dates(input, timeChartHeight(input) - 6)}
		`;
    }
  };
  var dayOf = (time, timeZone) => new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone }).format(time);
  var daysOf = ({ start, end, timeZone }) => {
    const noon = (time) => {
      const [year, month, date] = dayOf(time, timeZone).split("-").map(Number);
      return Date.UTC(year, month - 1, date, 12);
    };
    const days = [];
    for (let day = noon(end); day > noon(start); day -= DAY_MS) {
      days.unshift(day);
    }
    return days;
  };
  var dailyReadings = (input) => {
    const byDay = /* @__PURE__ */ new Map();
    for (const reading of input.readings) {
      const day = dayOf(reading.time, input.timeZone);
      byDay.set(day, [...byDay.get(day) ?? [], reading]);
    }
    return new Map(
      [...byDay].map(([day, readings]) => [day, averageReading(readings[0].time, readings.flatMap((reading) => reading.measurements))])
    );
  };
  var diamond = (x2, y3, style) => w`<rect x=${x2 - 3.5} y=${y3 - 3.5} width="7" height="7" transform=${`rotate(45 ${x2} ${y3})`} style=${style}></rect>`;
  var daily = {
    height: (input) => (input.pulse ? PULSE_BOTTOM : BOTTOM) + 40,
    draw: (input) => {
      const days = daysOf(input);
      const byDay = dailyReadings(input);
      const slot = (RIGHT - LEFT) / days.length;
      const x2 = (index) => LEFT + slot * (index + 0.5);
      const area = valueScale([...valuesOf(input.readings, "systolic"), ...valuesOf(input.readings, "diastolic")], 60, 150, TOP, BOTTOM);
      const shown = days.map((day, index) => ({ index, reading: byDay.get(dayOf(day, "UTC")) }));
      const withReadings = shown.filter((item) => Boolean(item.reading));
      const labelEvery = Math.ceil(days.length / 10);
      const date = new Intl.DateTimeFormat(input.language, { day: "numeric", timeZone: "UTC" });
      const weekday = new Intl.DateTimeFormat(input.language, { weekday: "short", timeZone: "UTC" });
      const labelsY = (input.pulse ? PULSE_BOTTOM : BOTTOM) + 18;
      return w`
			${band(area, normalRange(input.categories, "systolic"))}
			${band(area, normalRange(input.categories, "diastolic"))}
			${grid(area, 20)}
			${["systolic", "diastolic"].map((axis) => polyline(withReadings.map(({ index, reading }) => [x2(index), area.y(reading[axis])])))}
			${withReadings.map(({ index, reading }) => {
        const style = fill(classify(input.categories, reading.systolic, reading.diastolic));
        return w`
					${["systolic", "diastolic"].map((axis) => {
          const [low, high] = rangeOf(reading, axis);
          return w`<line class="range" x1=${x2(index)} x2=${x2(index)} y1=${area.y(low)} y2=${area.y(high)}></line>`;
        })}
					<circle cx=${x2(index)} cy=${area.y(reading.systolic)} r="4" style=${style}></circle>
					${diamond(x2(index), area.y(reading.diastolic), style)}
				`;
      })}
			${input.pulse ? pulseArea({ ...input, readings: withReadings.map(({ reading }) => reading) }, (reading) => x2(withReadings.find((item) => item.reading === reading).index)) : A}
			${days.map(
        (day, index) => (days.length - 1 - index) % labelEvery ? A : w`
						<text class="axis" x=${x2(index)} y=${labelsY} text-anchor="middle">${date.format(day)}</text>
						<text class="axis" x=${x2(index)} y=${labelsY + 14} text-anchor="middle">${weekday.format(day)}</text>
					`
      )}
		`;
    }
  };
  var SPLIT_HEIGHT = 70;
  var SPLIT_GAP = 14;
  var split = {
    height: (input) => (input.pulse ? 3 : 2) * (SPLIT_HEIGHT + SPLIT_GAP) + DATES,
    draw: (input) => {
      const x2 = timeScale(input);
      const areas = ["systolic", "diastolic"].map((axis, index) => {
        const top = TOP + index * (SPLIT_HEIGHT + SPLIT_GAP);
        const [low, high] = normalRange(input.categories, axis);
        const area = valueScale(valuesOf(input.readings, axis), low, high, top, top + SPLIT_HEIGHT);
        return w`
				${band(area, [low, high])}
				<line class="limit" x1=${LEFT} x2=${RIGHT} y1=${area.y(high)} y2=${area.y(high)}></line>
				<text class="axis" x=${RIGHT + 6} y=${area.y(high) + 4}>${high}</text>
				<text class="axis" x=${LEFT} y=${top + 2}>${translate(`text.${axis}`, input.language)}</text>
				${polyline(input.readings.map((reading) => [x2(reading.time), area.y(reading[axis])]))}
				${input.readings.map((reading) => {
          const [from, to] = rangeOf(reading, axis);
          const style = fill(classifyValue(input.categories, axis, reading[axis]));
          return w`
						${to > from ? w`<line class="range" x1=${x2(reading.time)} x2=${x2(reading.time)} y1=${area.y(from)} y2=${area.y(to)}></line>` : A}
						<circle cx=${x2(reading.time)} cy=${area.y(reading[axis])} r="3.5" style=${style}></circle>
					`;
        })}
			`;
      });
      const pulseTop = TOP + 2 * (SPLIT_HEIGHT + SPLIT_GAP);
      return w`
			${areas}
			${input.pulse ? w`
					<text class="axis" x=${LEFT} y=${pulseTop + 2}>${translate("text.pulse_name", input.language)}</text>
					${pulseArea(input, (reading) => x2(reading.time), pulseTop, pulseTop + SPLIT_HEIGHT)}
				` : A}
			${dates(input, split.height(input) - 4)}
		`;
    }
  };
  var CALENDAR_WEEKS = 5;
  var CALENDAR_GAP = 6;
  var CALENDAR_ROW = 40;
  var CALENDAR_TOP = 22;
  var calendar = {
    height: () => CALENDAR_TOP + CALENDAR_WEEKS * (CALENDAR_ROW + CALENDAR_GAP),
    draw: (input) => {
      const byDay = dailyReadings(input);
      const [year, month, date] = dayOf(input.end, input.timeZone).split("-").map(Number);
      const today = Date.UTC(year, month - 1, date, 12);
      const first = today - ((new Date(today).getUTCDay() + 6) % 7 + (CALENDAR_WEEKS - 1) * 7) * DAY_MS;
      const weekday = new Intl.DateTimeFormat(input.language, { weekday: "short", timeZone: "UTC" });
      const dayNumber = new Intl.DateTimeFormat(input.language, { day: "numeric", timeZone: "UTC" });
      const width = (WIDTH - 6 * CALENDAR_GAP) / 7;
      const cells = [];
      for (let index = 0; index < CALENDAR_WEEKS * 7; index++) {
        const day = first + index * DAY_MS;
        const x2 = index % 7 * (width + CALENDAR_GAP);
        const y3 = CALENDAR_TOP + Math.floor(index / 7) * (CALENDAR_ROW + CALENDAR_GAP);
        if (index < 7) {
          cells.push(w`<text class="axis" x=${x2 + width / 2} y="12" text-anchor="middle">${weekday.format(day)}</text>`);
        }
        if (day > today) {
          continue;
        }
        const reading = byDay.get(dayOf(day, "UTC"));
        cells.push(w`
				<rect class=${reading ? "day" : "day empty"} x=${x2} y=${y3} width=${width} height=${CALENDAR_ROW} rx="6"
					style=${reading ? fill(classify(input.categories, reading.systolic, reading.diastolic)) : A}></rect>
				<text class="date" x=${x2 + 8} y=${y3 + 16}>${dayNumber.format(day)}</text>
			`);
      }
      return cells;
    }
  };
  var sharesOf = (readings, categories) => [LOW, ...categories].map((category) => ({
    category,
    count: readings.filter((reading) => classify(categories, reading.systolic, reading.diastolic) === category).length
  })).filter((share) => share.count > 0);
  var pie = {
    height: () => 200,
    draw: ({ readings, categories, language }) => {
      const radius = 72;
      const circumference = 2 * Math.PI * radius;
      let offset = 0;
      const slices = sharesOf(readings, categories).map(({ category, count }) => {
        const length = count / readings.length * circumference;
        const slice = w`<circle class="slice" cx=${WIDTH / 2} cy="100" r=${radius}
				stroke-dasharray=${`${length} ${circumference - length}`} stroke-dashoffset=${-offset}
				transform=${`rotate(-90 ${WIDTH / 2} 100)`} style=${`stroke: ${category.color}`}></circle>`;
        offset += length;
        return slice;
      });
      return w`
			${slices}
			<text class="total" x=${WIDTH / 2} y="104" text-anchor="middle">${readings.length}</text>
			<text class="axis" x=${WIDTH / 2} y="124" text-anchor="middle">
				${translate(readings.length === 1 ? "text.reading" : "text.readings", language)}
			</text>
		`;
    }
  };
  var CHARTS = { bars, lines, daily, split, calendar, pie };

  // src/home-assistant.ts
  var fireEvent = (node, type, detail, options) => {
    options = options || {};
    const event = new Event(type, {
      bubbles: options.bubbles === void 0 ? true : options.bubbles,
      cancelable: Boolean(options.cancelable),
      composed: options.composed === void 0 ? true : options.composed
    });
    event.detail = detail === null || detail === void 0 ? {} : detail;
    node.dispatchEvent(event);
    return event;
  };
  var DISPLAY_KEYS = ["connected", "themes", "locale", "localize"];
  var hasHassChanged = (old, hass, entityIds) => !old || DISPLAY_KEYS.some((key) => old[key] !== hass[key]) || old.config.state !== hass.config.state || old.config.time_zone !== hass.config.time_zone || entityIds.some((entityId) => old.states[entityId] !== hass.states[entityId]);
  var createEntityNotFoundWarning = (hass, entityId) => hass.config.state !== "NOT_RUNNING" ? hass.localize("ui.panel.lovelace.warning.entity_not_found", { entity: entityId }) : hass.localize("ui.panel.lovelace.warning.starting");
  var loading = /* @__PURE__ */ new Map();
  var loadOnce = (key, tags, load) => {
    let promise = loading.get(key);
    if (!promise) {
      promise = (async () => {
        if (!tags.every((tag) => customElements.get(tag))) {
          await load();
          await Promise.all(tags.map((tag) => customElements.whenDefined(tag)));
        }
      })();
      promise.catch(() => loading.delete(key));
      loading.set(key, promise);
    }
    return promise;
  };
  var loadCardElements = () => loadOnce("card", ["hui-warning"], async () => {
    (await window.loadCardHelpers()).createCardElement({ type: "entity", entity: "sun.sun" });
  });
  var loadEditorElements = () => loadOnce("editor", ["ha-form"], async () => {
    (await window.loadCardHelpers()).createCardElement({ type: "entities", entities: [] });
    await customElements.whenDefined("hui-entities-card");
    const card = customElements.get("hui-entities-card");
    await card.getConfigElement();
  });

  // src/validators.ts
  function validateEditorConfig(config) {
    if (!config || typeof config !== "object") {
      throw new Error("The settings must be a map.");
    }
    const values = config;
    for (const key of ["systolic", "diastolic", "pulse", "name"]) {
      if (isSet(values[key]) && typeof values[key] !== "string") {
        throw new Error(`${key} must be text.`);
      }
    }
    if (isSet(values.chart_type) && !CHART_TYPES.includes(values.chart_type)) {
      throw new Error(`chart_type must be one of: ${CHART_TYPES.join(", ")}.`);
    }
    if (isSet(values.guideline) && !GUIDELINE_IDS.includes(values.guideline)) {
      throw new Error(`guideline must be one of: ${GUIDELINE_IDS.join(", ")}.`);
    }
    if (isSet(values.days_to_show) && !(typeof values.days_to_show === "number" && values.days_to_show > 0)) {
      throw new Error("days_to_show must be a number above 0.");
    }
    for (const key of SHOW_KEYS) {
      if (isSet(values[key]) && typeof values[key] !== "boolean") {
        throw new Error(`${key} must be true or false.`);
      }
    }
  }
  function validateConfig(config) {
    validateEditorConfig(config);
    if (!config.systolic || !config.diastolic) {
      throw new Error("Set both systolic and diastolic.");
    }
    if (config.systolic === config.diastolic) {
      throw new Error("systolic and diastolic must be two different sensors.");
    }
  }

  // src/blood-pressure-editor.ts
  var EDITOR_TAG = "blood-pressure-editor";
  var selectSelector = (options, group, language) => ({
    select: {
      mode: "dropdown",
      options: options.map((value) => ({ value, label: translate(`${group}.${value}`, language) }))
    }
  });
  var sensorSelector = (unit) => ({ entity: { filter: { domain: "sensor", unit_of_measurement: unit } } });
  var buildSchema = (language) => [
    { name: "systolic", required: true, selector: sensorSelector("mmHg") },
    { name: "diastolic", required: true, selector: sensorSelector("mmHg") },
    { name: "pulse", selector: sensorSelector("bpm") },
    {
      name: "chart",
      type: "expandable",
      flatten: true,
      expanded: true,
      icon: "mdi:chart-bar",
      schema: [
        { name: "name", selector: { text: {} } },
        { name: "chart_type", selector: selectSelector(CHART_TYPES, "chart_type", language) },
        {
          name: "",
          type: "grid",
          schema: [
            { name: "days_to_show", selector: { number: { mode: "box", min: 1, step: 1 } } },
            { name: "guideline", selector: selectSelector(GUIDELINE_IDS, "guideline", language) }
          ]
        }
      ]
    },
    {
      name: "show",
      type: "expandable",
      flatten: true,
      icon: "mdi:eye-outline",
      schema: [
        {
          name: "",
          type: "grid",
          schema: SHOW_KEYS.map((key) => ({ name: key, selector: { boolean: {} } }))
        }
      ]
    }
  ];
  var __ready_dec, __config_dec, _hass_dec, _a, _init, _hass, __config, __ready;
  var BloodPressureEditor = class extends (_a = i4, _hass_dec = [n4({ attribute: false })], __config_dec = [r5()], __ready_dec = [r5()], _a) {
    constructor() {
      super(...arguments);
      __privateAdd(this, _hass, __runInitializers(_init, 8, this)), __runInitializers(_init, 11, this);
      __privateAdd(this, __config, __runInitializers(_init, 12, this)), __runInitializers(_init, 15, this);
      __privateAdd(this, __ready, __runInitializers(_init, 16, this, false)), __runInitializers(_init, 19, this);
      __publicField(this, "_schemaLanguage");
      __publicField(this, "_schema");
      // The card's own texts, else Home Assistant's labels for its generic
      // fields, like its form editor for cards does.
      __publicField(this, "_computeLabel", (schema) => {
        const key = `label.${schema.name}`;
        if (hasTranslation(key)) {
          return translate(key, languageOf(this.hass));
        }
        return this.hass.localize(`ui.panel.lovelace.editor.card.generic.${schema.name}`);
      });
      __publicField(this, "_computeHelper", (schema) => {
        const key = `helper.${schema.name}`;
        return hasTranslation(key) ? translate(key, languageOf(this.hass)) : void 0;
      });
    }
    setConfig(config) {
      validateEditorConfig(config);
      this._config = config;
    }
    connectedCallback() {
      super.connectedCallback();
      loadEditorElements().then(
        () => {
          this._ready = true;
        },
        () => {
        }
      );
    }
    render() {
      if (!this.hass || !this._config || !this._ready) {
        return A;
      }
      const language = languageOf(this.hass);
      if (language !== this._schemaLanguage) {
        this._schemaLanguage = language;
        this._schema = buildSchema(language);
      }
      return b2`
			<ha-form
				.hass=${this.hass}
				.data=${{ ...DEFAULTS, ...this._config }}
				.schema=${this._schema}
				.computeLabel=${this._computeLabel}
				.computeHelper=${this._computeHelper}
				@value-changed=${this._valueChanged}
			></ha-form>
		`;
    }
    // The form holds the defaults too. They are left out, so the saved YAML
    // only holds what differs from them.
    _valueChanged(ev) {
      ev.stopPropagation();
      const config = Object.fromEntries(
        Object.entries(ev.detail.value).filter(([key, value]) => DEFAULTS[key] !== value)
      );
      fireEvent(this, "config-changed", { config });
    }
  };
  _init = __decoratorStart(_a);
  _hass = new WeakMap();
  __config = new WeakMap();
  __ready = new WeakMap();
  __decorateElement(_init, 4, "hass", _hass_dec, BloodPressureEditor, _hass);
  __decorateElement(_init, 4, "_config", __config_dec, BloodPressureEditor, __config);
  __decorateElement(_init, 4, "_ready", __ready_dec, BloodPressureEditor, __ready);
  __decoratorMetadata(_init, BloodPressureEditor);

  // src/sensors.ts
  var WORDS = {
    systolic: ["systolic", "systolisk", "systolisch", "sistolica"],
    diastolic: ["diastolic", "diastolisk", "diastolisch", "diastolica"],
    pulse: ["pulse", "puls", "pulso", "heart"]
  };
  var UNITS = { systolic: "mmHg", diastolic: "mmHg", pulse: "bpm" };
  var holds = (hass, entityId, role) => entityId.startsWith("sensor.") && hass.states[entityId]?.attributes.unit_of_measurement === UNITS[role] && WORDS[role].some((word) => entityId.includes(word));
  var shared = (first, second) => {
    let length = 0;
    while (length < first.length && first[length] === second[length]) {
      length++;
    }
    return length;
  };
  var find2 = (hass, role, near = "") => Object.keys(hass.states).filter((entityId) => holds(hass, entityId, role)).sort((a3, b3) => shared(b3, near) - shared(a3, near))[0];
  var around = (hass, systolic = "", diastolic = find2(hass, "diastolic", systolic) ?? "") => {
    const pulse = find2(hass, "pulse", systolic || diastolic);
    return pulse ? { systolic, diastolic, pulse } : { systolic, diastolic };
  };
  var stubConfig = (hass) => around(hass, find2(hass, "systolic"));
  var sensorsFor = (hass, entityId) => {
    const sensors = holds(hass, entityId, "systolic") ? around(hass, entityId) : holds(hass, entityId, "diastolic") ? around(hass, find2(hass, "systolic", entityId), entityId) : void 0;
    return sensors?.systolic && sensors.diastolic ? sensors : null;
  };

  // src/blood-pressure-card.ts
  var CARD_TAG = "blood-pressure";
  var DAY_MS2 = 24 * 3600 * 1e3;
  var SCALE_LIMITS = { systolic: [70, 200], diastolic: [40, 130] };
  var numberOf = (stateObj) => {
    const value = stateObj.state === "" ? NaN : Number(stateObj.state);
    return Number.isFinite(value) ? value : void 0;
  };
  var __failed_dec, __readings_dec, __ready_dec2, __config_dec2, _hass_dec2, _a2, _init2, _hass2, __config2, __ready2, __readings, __failed;
  var BloodPressureCard = class extends (_a2 = i4, _hass_dec2 = [n4({ attribute: false })], __config_dec2 = [r5()], __ready_dec2 = [r5()], __readings_dec = [r5()], __failed_dec = [r5()], _a2) {
    constructor() {
      super(...arguments);
      __privateAdd(this, _hass2, __runInitializers(_init2, 8, this)), __runInitializers(_init2, 11, this);
      __privateAdd(this, __config2, __runInitializers(_init2, 12, this)), __runInitializers(_init2, 15, this);
      __privateAdd(this, __ready2, __runInitializers(_init2, 16, this, false)), __runInitializers(_init2, 19, this);
      __privateAdd(this, __readings, __runInitializers(_init2, 20, this)), __runInitializers(_init2, 23, this);
      __privateAdd(this, __failed, __runInitializers(_init2, 24, this, false)), __runInitializers(_init2, 27, this);
      __publicField(this, "_drawnHass");
      // What the readings belong to: the settings and the last changes of the
      // sensors. The history is read again when it changes.
      __publicField(this, "_loadedFor");
      // Counts the reads, so only the newest one is shown.
      __publicField(this, "_readCount", 0);
    }
    static getConfigElement() {
      return document.createElement(EDITOR_TAG);
    }
    static getStubConfig(hass) {
      return stubConfig(hass);
    }
    setConfig(config) {
      validateConfig(config);
      this._config = config;
    }
    getCardSize() {
      return 6;
    }
    getGridOptions() {
      return { columns: 12, min_columns: 6 };
    }
    connectedCallback() {
      super.connectedCallback();
      loadCardElements().then(
        () => {
          this._ready = true;
        },
        () => {
        }
      );
    }
    get _entityIds() {
      const { systolic, diastolic, pulse } = this._config;
      return pulse ? [systolic, diastolic, pulse] : [systolic, diastolic];
    }
    shouldUpdate(changed) {
      if (!this._config || !this.hass) {
        return false;
      }
      return ["_config", "_ready", "_readings", "_failed"].some((key) => changed.has(key)) || hasHassChanged(this._drawnHass, this.hass, this._entityIds);
    }
    // shouldUpdate only lets an update through with _config and hass set, so
    // the ! below in willUpdate, render and updated are safe.
    willUpdate() {
      this._drawnHass = this.hass;
    }
    updated() {
      const config = this._config;
      const hass = this.hass;
      const key = JSON.stringify([
        this._entityIds,
        config.days_to_show,
        this._entityIds.map((entityId) => hass.states[entityId]?.last_changed)
      ]);
      if (key !== this._loadedFor) {
        this._loadedFor = key;
        void this._read(hass, config);
      }
    }
    async _read(hass, config) {
      const read = ++this._readCount;
      try {
        const readings = await fetchReadings(hass, config, config.days_to_show ?? DEFAULT_DAYS);
        if (read === this._readCount) {
          this._readings = readings;
          this._failed = false;
        }
      } catch {
        if (read === this._readCount) {
          this._failed = true;
        }
      }
    }
    render() {
      const config = this._config;
      const hass = this.hass;
      const language = languageOf(hass);
      const missing = this._entityIds.find((entityId) => !hass.states[entityId]);
      if (missing) {
        return b2`<hui-warning .hass=${hass}>${createEntityNotFoundWarning(hass, missing)}</hui-warning>`;
      }
      const categories = GUIDELINES[config.guideline ?? "esc_2024"];
      const systolicState = hass.states[config.systolic];
      const systolic = numberOf(systolicState);
      const diastolic = numberOf(hass.states[config.diastolic]);
      const pulseState = config.pulse ? hass.states[config.pulse] : void 0;
      const pulse = pulseState ? numberOf(pulseState) : void 0;
      const category = systolic !== void 0 && diastolic !== void 0 ? classify(categories, systolic, diastolic) : void 0;
      const readings = this._readings ?? [];
      const average = averageOf(readings);
      const range = (axis) => {
        const values = readings.flatMap((reading) => reading.measurements.map((measurement) => measurement[axis]));
        return values.length ? `${Math.round(Math.min(...values))}-${Math.round(Math.max(...values))}` : "";
      };
      const scales = shows(config, "show_scales") && systolic !== void 0 && diastolic !== void 0;
      const showAverage = shows(config, "show_average") && average !== void 0;
      const details = [
        shows(config, "show_pulse") && pulse !== void 0 ? translate("text.pulse", language, {
          pulse: `${Math.round(pulse)} ${pulseState.attributes.unit_of_measurement ?? "bpm"}`
        }) : "",
        showAverage ? translate(average.readings === 1 ? "text.average_one" : "text.average", language, {
          systolic: Math.round(average.systolic),
          diastolic: Math.round(average.diastolic),
          count: average.readings
        }) : ""
      ].filter(Boolean).join(", ");
      const ranges = showAverage && !scales ? translate("text.ranges", language, { systolic: range("systolic"), diastolic: range("diastolic") }) : "";
      const header = shows(config, "show_name") || shows(config, "show_icon");
      const categoryShown = shows(config, "show_category") && category;
      return b2`
			<ha-card>
				${header ? b2`<div class="header">
							<div class="name">${shows(config, "show_name") ? config.name || translate("text.name", language) : A}</div>
							${shows(config, "show_icon") ? b2`<div class="icon"><ha-icon icon="mdi:heart-pulse"></ha-icon></div>` : A}
						</div>` : A}
				${shows(config, "show_state") || categoryShown ? b2`<div class="info">
							${shows(config, "show_state") ? b2`<span class="value">
											${systolic !== void 0 && diastolic !== void 0 ? `${Math.round(systolic)}/${Math.round(diastolic)}` : hass.localize("state.default.unavailable")}
										</span>
										<span class="measurement">${systolicState.attributes.unit_of_measurement ?? "mmHg"}</span>` : A}
							${categoryShown ? b2`<span class="category" style=${`--category-color: ${category.color}`}>
										${translate(`category.${category.key}`, language)}
									</span>` : A}
						</div>` : A}
				${details || ranges ? b2`<div class="details">
							${[details, ranges].filter(Boolean).map((line) => b2`<div>${line.charAt(0).toUpperCase()}${line.slice(1)}</div>`)}
						</div>` : A}
				${scales ? b2`<div class="scales">
							${this._renderScale(categories, "systolic", systolic, range("systolic"), language)}
							${this._renderScale(categories, "diastolic", diastolic, range("diastolic"), language)}
						</div>` : A}
				${this._renderChart(hass, config, categories, language)}
			</ha-card>
		`;
    }
    // A bar with the categories one value can reach, a mark at the value, and
    // the lowest and the highest value of the period after it.
    _renderScale(categories, axis, value, range, language) {
      const [min, max] = SCALE_LIMITS[axis];
      const steps = scaleOf(categories, axis);
      const at = (limit) => Math.min(Math.max(limit, min), max);
      return b2`
			<span>${translate(`text.${axis}`, language)}</span>
			<div class="scale">
				${steps.map(
        ({ from, category }, index) => b2`<i style=${`flex: ${at(steps[index + 1]?.from ?? max) - at(from)}; --category-color: ${category.color}`}></i>`
      )}
				<b style=${`left: ${(at(value) - min) / (max - min) * 100}%`}></b>
			</div>
			<span class="range-text">${shows(this._config, "show_average") ? range : A}</span>
		`;
    }
    _renderChart(hass, config, categories, language) {
      const days = config.days_to_show ?? DEFAULT_DAYS;
      const showChart = shows(config, "show_chart");
      if (this._failed) {
        return showChart ? b2`<div class="message">${translate("text.no_history", language)}</div>` : b2`<div class="end"></div>`;
      }
      if (!this._readings) {
        return A;
      }
      if (!this._readings.length) {
        return showChart ? b2`<div class="message">${translate("text.no_readings", language, { days })}</div>` : b2`<div class="end"></div>`;
      }
      const end = Date.now();
      const input = {
        readings: this._readings,
        categories,
        start: end - days * DAY_MS2,
        end,
        pulse: Boolean(config.pulse) && shows(config, "show_pulse") && this._readings.some((reading) => reading.pulse !== void 0),
        language,
        timeZone: hass.locale.time_zone === "server" ? hass.config.time_zone : void 0
      };
      const type = config.chart_type ?? "bars";
      const chart = CHARTS[type];
      const shares = sharesOf(this._readings, categories);
      return b2`
			${showChart ? b2`<svg viewBox=${`0 0 ${WIDTH} ${chart.height(input)}`}>${chart.draw(input)}</svg>` : A}
			${shows(config, "show_legend") ? b2`<div class="legend">
						${shares.map(
        ({ category, count }) => b2`<span style=${`--category-color: ${category.color}`}>
								<i></i>${translate(`category.${category.key}`, language)}${type === "pie" ? ` ${Math.round(count / this._readings.length * 100)}%` : ""}
							</span>`
      )}
					</div>` : b2`<div class="end"></div>`}
		`;
    }
  };
  _init2 = __decoratorStart(_a2);
  _hass2 = new WeakMap();
  __config2 = new WeakMap();
  __ready2 = new WeakMap();
  __readings = new WeakMap();
  __failed = new WeakMap();
  __decorateElement(_init2, 4, "hass", _hass_dec2, BloodPressureCard, _hass2);
  __decorateElement(_init2, 4, "_config", __config_dec2, BloodPressureCard, __config2);
  __decorateElement(_init2, 4, "_ready", __ready_dec2, BloodPressureCard, __ready2);
  __decorateElement(_init2, 4, "_readings", __readings_dec, BloodPressureCard, __readings);
  __decorateElement(_init2, 4, "_failed", __failed_dec, BloodPressureCard, __failed);
  __decoratorMetadata(_init2, BloodPressureCard);
  // The header copies Home Assistant's entity card
  // (src/panels/lovelace/cards/hui-entity-card.ts). The additions are marked.
  __publicField(BloodPressureCard, "styles", i`
		ha-card {
			height: 100%;
			display: flex;
			flex-direction: column;
		}
		.header {
			display: flex;
			padding: 8px 16px 0;
			justify-content: space-between;
		}
		.name {
			color: var(--secondary-text-color);
			line-height: 40px;
			font-size: var(--ha-font-size-l);
			font-weight: var(--ha-font-weight-medium);
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.icon {
			color: var(--state-icon-color);
			line-height: 40px;
		}
		.info {
			display: flex;
			align-items: baseline;
			padding: 0px 16px 16px;
			margin-top: -4px;
			line-height: var(--ha-line-height-condensed);
		}
		.info > * {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.value {
			font-size: var(--ha-font-size-3xl);
			margin-right: 4px;
			margin-inline-end: 4px;
			margin-inline-start: initial;
		}
		.measurement {
			font-size: var(--ha-font-size-l);
			color: var(--secondary-text-color);
		}
		/* Added: the category of the latest reading at the end of the line. */
		.category {
			margin-inline-start: auto;
			align-self: center;
			flex-shrink: 0;
			padding: 2px 10px;
			border-radius: 12px;
			font-size: var(--ha-font-size-s);
			font-weight: var(--ha-font-weight-medium);
			background-color: color-mix(in srgb, var(--category-color) 30%, transparent);
		}
		/* Added: the pulse and the average below the value, the chart and its legend. */
		.details {
			padding: 0 16px 8px;
			font-size: var(--ha-font-size-s);
			color: var(--secondary-text-color);
		}
		.info + .details {
			margin-top: -12px;
		}
		/* Added: the first part keeps the card's top padding when the parts
		   above it are turned off. */
		.details:first-child,
		.scales:first-child,
		svg:first-child {
			padding-top: 16px;
		}
		.range-text {
			min-width: 52px;
			text-align: end;
			font-variant-numeric: tabular-nums;
		}
		.scales {
			display: grid;
			grid-template-columns: auto minmax(0, 1fr) auto;
			align-items: center;
			gap: 10px 12px;
			padding: 4px 16px 12px;
			font-size: var(--ha-font-size-s);
			color: var(--secondary-text-color);
		}
		.scale {
			position: relative;
			display: flex;
			gap: 2px;
			height: 8px;
		}
		.scale i {
			background-color: var(--category-color);
		}
		.scale i:first-child {
			border-radius: 4px 0 0 4px;
		}
		.scale i:last-of-type {
			border-radius: 0 4px 4px 0;
		}
		.scale b {
			position: absolute;
			top: -4px;
			width: 3px;
			height: 16px;
			margin-inline-start: -1.5px;
			border-radius: 2px;
			background-color: var(--primary-text-color);
		}
		svg {
			display: block;
			width: 100%;
			height: auto;
			padding: 0 16px;
			box-sizing: border-box;
		}
		.grid {
			stroke: var(--divider-color);
			stroke-dasharray: 3 3;
		}
		.axis {
			fill: var(--secondary-text-color);
			font-size: 11px;
		}
		.normal {
			fill: var(--green-color, #4caf50);
			opacity: 0.12;
		}
		.line {
			fill: none;
			stroke: var(--secondary-text-color);
			stroke-opacity: 0.5;
			stroke-width: 1.5;
			stroke-linejoin: round;
		}
		.day.empty {
			fill: var(--divider-color);
		}
		.date {
			fill: var(--primary-text-color);
			font-size: 12px;
		}
		.range {
			stroke: var(--secondary-text-color);
			stroke-opacity: 0.35;
			stroke-width: 6;
			stroke-linecap: round;
		}
		.limit {
			stroke: var(--secondary-text-color);
			stroke-opacity: 0.6;
			stroke-dasharray: 3 3;
		}
		.pulse {
			fill: var(--secondary-text-color);
		}
		.slice {
			fill: none;
			stroke-width: 28;
		}
		.total {
			fill: var(--primary-text-color);
			font-size: 28px;
		}
		.message {
			padding: 0 16px 16px;
			color: var(--secondary-text-color);
		}
		/* Added: the bottom padding of the card when there is no legend. */
		.end {
			height: 16px;
		}
		.legend {
			display: flex;
			flex-wrap: wrap;
			gap: 4px 12px;
			padding: 8px 16px 16px;
			font-size: var(--ha-font-size-s);
			color: var(--secondary-text-color);
		}
		.legend span {
			display: flex;
			align-items: center;
			gap: 6px;
		}
		.legend i {
			width: 10px;
			height: 10px;
			border-radius: 2px;
			background-color: var(--category-color);
		}
	`);

  // src/blood-pressure.ts
  var VERSION = "0.1.0";
  var REPOSITORY = "https://github.com/mm98/ha-blood-pressure";
  var defineOnce = (tag, element) => {
    if (!customElements.get(tag)) {
      customElements.define(tag, element);
    }
  };
  defineOnce(EDITOR_TAG, BloodPressureEditor);
  defineOnce(CARD_TAG, BloodPressureCard);
  window.customCards ??= [];
  if (!window.customCards.some((card) => card.type === CARD_TAG)) {
    window.customCards.push({
      type: CARD_TAG,
      // The product name, the same in every language.
      name: "Blood pressure",
      // Read when the card picker opens, so it follows the current language.
      get description() {
        return translate("card.description", languageOf());
      },
      preview: true,
      documentationURL: REPOSITORY,
      getEntitySuggestion: (hass, entityId) => {
        const sensors = sensorsFor(hass, entityId);
        return sensors ? { config: { type: `custom:${CARD_TAG}`, ...sensors } } : null;
      }
    });
  }
  console.info(`blood-pressure ${VERSION}`);
})();
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
