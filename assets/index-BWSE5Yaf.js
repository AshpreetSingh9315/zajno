(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const r of document.querySelectorAll('link[rel="modulepreload"]')) n(r);
  new MutationObserver((r) => {
    for (const s of r)
      if (s.type === "childList")
        for (const a of s.addedNodes)
          a.tagName === "LINK" && a.rel === "modulepreload" && n(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function e(r) {
    const s = {};
    return (
      r.integrity && (s.integrity = r.integrity),
      r.referrerPolicy && (s.referrerPolicy = r.referrerPolicy),
      r.crossOrigin === "use-credentials"
        ? (s.credentials = "include")
        : r.crossOrigin === "anonymous"
        ? (s.credentials = "omit")
        : (s.credentials = "same-origin"),
      s
    );
  }
  function n(r) {
    if (r.ep) return;
    r.ep = !0;
    const s = e(r);
    fetch(r.href, s);
  }
})();
function ka(i, t, e) {
  return Math.max(i, Math.min(t, e));
}
class wo {
  constructor() {
    (this.isRunning = !1),
      (this.value = 0),
      (this.from = 0),
      (this.to = 0),
      (this.duration = 0),
      (this.currentTime = 0);
  }
  advance(t) {
    var e;
    if (!this.isRunning) return;
    let n = !1;
    if (this.duration && this.easing) {
      this.currentTime += t;
      const r = ka(0, this.currentTime / this.duration, 1);
      n = r >= 1;
      const s = n ? 1 : this.easing(r);
      this.value = this.from + (this.to - this.from) * s;
    } else
      this.lerp
        ? ((this.value = (function (s, a, o, l) {
            return (function (u, d, f) {
              return (1 - f) * u + f * d;
            })(s, a, 1 - Math.exp(-o * l));
          })(this.value, this.to, 60 * this.lerp, t)),
          Math.round(this.value) === this.to &&
            ((this.value = this.to), (n = !0)))
        : ((this.value = this.to), (n = !0));
    n && this.stop(),
      (e = this.onUpdate) === null ||
        e === void 0 ||
        e.call(this, this.value, n);
  }
  stop() {
    this.isRunning = !1;
  }
  fromTo(t, e, { lerp: n, duration: r, easing: s, onStart: a, onUpdate: o }) {
    (this.from = this.value = t),
      (this.to = e),
      (this.lerp = n),
      (this.duration = r),
      (this.easing = s),
      (this.currentTime = 0),
      (this.isRunning = !0),
      a == null || a(),
      (this.onUpdate = o);
  }
}
class Co {
  constructor({
    wrapper: t,
    content: e,
    autoResize: n = !0,
    debounce: r = 250,
  } = {}) {
    (this.width = 0),
      (this.height = 0),
      (this.scrollWidth = 0),
      (this.scrollHeight = 0),
      (this.resize = () => {
        this.onWrapperResize(), this.onContentResize();
      }),
      (this.onWrapperResize = () => {
        this.wrapper === window
          ? ((this.width = window.innerWidth),
            (this.height = window.innerHeight))
          : this.wrapper instanceof HTMLElement &&
            ((this.width = this.wrapper.clientWidth),
            (this.height = this.wrapper.clientHeight));
      }),
      (this.onContentResize = () => {
        this.wrapper === window
          ? ((this.scrollHeight = this.content.scrollHeight),
            (this.scrollWidth = this.content.scrollWidth))
          : this.wrapper instanceof HTMLElement &&
            ((this.scrollHeight = this.wrapper.scrollHeight),
            (this.scrollWidth = this.wrapper.scrollWidth));
      }),
      (this.wrapper = t),
      (this.content = e),
      n &&
        ((this.debouncedResize = (function (a, o) {
          let l;
          return function () {
            let c = arguments,
              u = this;
            clearTimeout(l),
              (l = setTimeout(function () {
                a.apply(u, c);
              }, o));
          };
        })(this.resize, r)),
        this.wrapper === window
          ? window.addEventListener("resize", this.debouncedResize, !1)
          : ((this.wrapperResizeObserver = new ResizeObserver(
              this.debouncedResize
            )),
            this.wrapperResizeObserver.observe(this.wrapper)),
        (this.contentResizeObserver = new ResizeObserver(this.debouncedResize)),
        this.contentResizeObserver.observe(this.content)),
      this.resize();
  }
  destroy() {
    var t, e;
    (t = this.wrapperResizeObserver) === null || t === void 0 || t.disconnect(),
      (e = this.contentResizeObserver) === null ||
        e === void 0 ||
        e.disconnect(),
      window.removeEventListener("resize", this.debouncedResize, !1);
  }
  get limit() {
    return {
      x: this.scrollWidth - this.width,
      y: this.scrollHeight - this.height,
    };
  }
}
class Wa {
  constructor() {
    this.events = {};
  }
  emit(t, ...e) {
    let n = this.events[t] || [];
    for (let r = 0, s = n.length; r < s; r++) n[r](...e);
  }
  on(t, e) {
    var n;
    return (
      (!((n = this.events[t]) === null || n === void 0) && n.push(e)) ||
        (this.events[t] = [e]),
      () => {
        var r;
        this.events[t] =
          (r = this.events[t]) === null || r === void 0
            ? void 0
            : r.filter((s) => e !== s);
      }
    );
  }
  off(t, e) {
    var n;
    this.events[t] =
      (n = this.events[t]) === null || n === void 0
        ? void 0
        : n.filter((r) => e !== r);
  }
  destroy() {
    this.events = {};
  }
}
const Vs = 100 / 6;
class Po {
  constructor(t, { wheelMultiplier: e = 1, touchMultiplier: n = 1 }) {
    (this.lastDelta = { x: 0, y: 0 }),
      (this.windowWidth = 0),
      (this.windowHeight = 0),
      (this.onTouchStart = (r) => {
        const { clientX: s, clientY: a } = r.targetTouches
          ? r.targetTouches[0]
          : r;
        (this.touchStart.x = s),
          (this.touchStart.y = a),
          (this.lastDelta = { x: 0, y: 0 }),
          this.emitter.emit("scroll", { deltaX: 0, deltaY: 0, event: r });
      }),
      (this.onTouchMove = (r) => {
        var s, a, o, l;
        const { clientX: c, clientY: u } = r.targetTouches
            ? r.targetTouches[0]
            : r,
          d =
            -(
              c -
              ((a =
                (s = this.touchStart) === null || s === void 0
                  ? void 0
                  : s.x) !== null && a !== void 0
                ? a
                : 0)
            ) * this.touchMultiplier,
          f =
            -(
              u -
              ((l =
                (o = this.touchStart) === null || o === void 0
                  ? void 0
                  : o.y) !== null && l !== void 0
                ? l
                : 0)
            ) * this.touchMultiplier;
        (this.touchStart.x = c),
          (this.touchStart.y = u),
          (this.lastDelta = { x: d, y: f }),
          this.emitter.emit("scroll", { deltaX: d, deltaY: f, event: r });
      }),
      (this.onTouchEnd = (r) => {
        this.emitter.emit("scroll", {
          deltaX: this.lastDelta.x,
          deltaY: this.lastDelta.y,
          event: r,
        });
      }),
      (this.onWheel = (r) => {
        let { deltaX: s, deltaY: a, deltaMode: o } = r;
        (s *= o === 1 ? Vs : o === 2 ? this.windowWidth : 1),
          (a *= o === 1 ? Vs : o === 2 ? this.windowHeight : 1),
          (s *= this.wheelMultiplier),
          (a *= this.wheelMultiplier),
          this.emitter.emit("scroll", { deltaX: s, deltaY: a, event: r });
      }),
      (this.onWindowResize = () => {
        (this.windowWidth = window.innerWidth),
          (this.windowHeight = window.innerHeight);
      }),
      (this.element = t),
      (this.wheelMultiplier = e),
      (this.touchMultiplier = n),
      (this.touchStart = { x: null, y: null }),
      (this.emitter = new Wa()),
      window.addEventListener("resize", this.onWindowResize, !1),
      this.onWindowResize(),
      this.element.addEventListener("wheel", this.onWheel, { passive: !1 }),
      this.element.addEventListener("touchstart", this.onTouchStart, {
        passive: !1,
      }),
      this.element.addEventListener("touchmove", this.onTouchMove, {
        passive: !1,
      }),
      this.element.addEventListener("touchend", this.onTouchEnd, {
        passive: !1,
      });
  }
  on(t, e) {
    return this.emitter.on(t, e);
  }
  destroy() {
    this.emitter.destroy(),
      window.removeEventListener("resize", this.onWindowResize, !1),
      this.element.removeEventListener("wheel", this.onWheel),
      this.element.removeEventListener("touchstart", this.onTouchStart),
      this.element.removeEventListener("touchmove", this.onTouchMove),
      this.element.removeEventListener("touchend", this.onTouchEnd);
  }
}
class Lo {
  constructor({
    wrapper: t = window,
    content: e = document.documentElement,
    wheelEventsTarget: n = t,
    eventsTarget: r = n,
    smoothWheel: s = !0,
    syncTouch: a = !1,
    syncTouchLerp: o = 0.075,
    touchInertiaMultiplier: l = 35,
    duration: c,
    easing: u = (O) => Math.min(1, 1.001 - Math.pow(2, -10 * O)),
    lerp: d = 0.1,
    infinite: f = !1,
    orientation: m = "vertical",
    gestureOrientation: v = "vertical",
    touchMultiplier: M = 1,
    wheelMultiplier: p = 1,
    autoResize: h = !0,
    prevent: b,
    virtualScroll: T,
    __experimental__naiveDimensions: E = !1,
  } = {}) {
    (this.__isScrolling = !1),
      (this.__isStopped = !1),
      (this.__isLocked = !1),
      (this.userData = {}),
      (this.lastVelocity = 0),
      (this.velocity = 0),
      (this.direction = 0),
      (this.onPointerDown = (O) => {
        O.button === 1 && this.reset();
      }),
      (this.onVirtualScroll = (O) => {
        if (
          typeof this.options.virtualScroll == "function" &&
          this.options.virtualScroll(O) === !1
        )
          return;
        const { deltaX: C, deltaY: A, event: D } = O;
        if (
          (this.emitter.emit("virtual-scroll", {
            deltaX: C,
            deltaY: A,
            event: D,
          }),
          D.ctrlKey)
        )
          return;
        const S = D.type.includes("touch"),
          x = D.type.includes("wheel");
        if (
          ((this.isTouching =
            D.type === "touchstart" || D.type === "touchmove"),
          this.options.syncTouch &&
            S &&
            D.type === "touchstart" &&
            !this.isStopped &&
            !this.isLocked)
        )
          return void this.reset();
        const R = C === 0 && A === 0,
          G =
            (this.options.gestureOrientation === "vertical" && A === 0) ||
            (this.options.gestureOrientation === "horizontal" && C === 0);
        if (R || G) return;
        let H = D.composedPath();
        H = H.slice(0, H.indexOf(this.rootElement));
        const $ = this.options.prevent;
        if (
          H.find((z) => {
            var et, ct, _t, Rt, Vt;
            return (
              z instanceof Element &&
              ((typeof $ == "function" && ($ == null ? void 0 : $(z))) ||
                ((et = z.hasAttribute) === null || et === void 0
                  ? void 0
                  : et.call(z, "data-lenis-prevent")) ||
                (S &&
                  ((ct = z.hasAttribute) === null || ct === void 0
                    ? void 0
                    : ct.call(z, "data-lenis-prevent-touch"))) ||
                (x &&
                  ((_t = z.hasAttribute) === null || _t === void 0
                    ? void 0
                    : _t.call(z, "data-lenis-prevent-wheel"))) ||
                (((Rt = z.classList) === null || Rt === void 0
                  ? void 0
                  : Rt.contains("lenis")) &&
                  !(
                    !((Vt = z.classList) === null || Vt === void 0) &&
                    Vt.contains("lenis-stopped")
                  )))
            );
          })
        )
          return;
        if (this.isStopped || this.isLocked) return void D.preventDefault();
        if (!((this.options.syncTouch && S) || (this.options.smoothWheel && x)))
          return (this.isScrolling = "native"), void this.animate.stop();
        D.preventDefault();
        let K = A;
        this.options.gestureOrientation === "both"
          ? (K = Math.abs(A) > Math.abs(C) ? A : C)
          : this.options.gestureOrientation === "horizontal" && (K = C);
        const X = S && this.options.syncTouch,
          Z = S && D.type === "touchend" && Math.abs(K) > 5;
        Z && (K = this.velocity * this.options.touchInertiaMultiplier),
          this.scrollTo(
            this.targetScroll + K,
            Object.assign(
              { programmatic: !1 },
              X
                ? { lerp: Z ? this.options.syncTouchLerp : 1 }
                : {
                    lerp: this.options.lerp,
                    duration: this.options.duration,
                    easing: this.options.easing,
                  }
            )
          );
      }),
      (this.onNativeScroll = () => {
        if (
          (clearTimeout(this.__resetVelocityTimeout),
          delete this.__resetVelocityTimeout,
          this.__preventNextNativeScrollEvent)
        )
          delete this.__preventNextNativeScrollEvent;
        else if (this.isScrolling === !1 || this.isScrolling === "native") {
          const O = this.animatedScroll;
          (this.animatedScroll = this.targetScroll = this.actualScroll),
            (this.lastVelocity = this.velocity),
            (this.velocity = this.animatedScroll - O),
            (this.direction = Math.sign(this.animatedScroll - O)),
            (this.isScrolling = "native"),
            this.emit(),
            this.velocity !== 0 &&
              (this.__resetVelocityTimeout = setTimeout(() => {
                (this.lastVelocity = this.velocity),
                  (this.velocity = 0),
                  (this.isScrolling = !1),
                  this.emit();
              }, 400));
        }
      }),
      (window.lenisVersion = "1.1.9"),
      (t && t !== document.documentElement && t !== document.body) ||
        (t = window),
      (this.options = {
        wrapper: t,
        content: e,
        wheelEventsTarget: n,
        eventsTarget: r,
        smoothWheel: s,
        syncTouch: a,
        syncTouchLerp: o,
        touchInertiaMultiplier: l,
        duration: c,
        easing: u,
        lerp: d,
        infinite: f,
        gestureOrientation: v,
        orientation: m,
        touchMultiplier: M,
        wheelMultiplier: p,
        autoResize: h,
        prevent: b,
        virtualScroll: T,
        __experimental__naiveDimensions: E,
      }),
      (this.animate = new wo()),
      (this.emitter = new Wa()),
      (this.dimensions = new Co({ wrapper: t, content: e, autoResize: h })),
      this.updateClassName(),
      (this.userData = {}),
      (this.time = 0),
      (this.velocity = this.lastVelocity = 0),
      (this.isLocked = !1),
      (this.isStopped = !1),
      (this.isScrolling = !1),
      (this.targetScroll = this.animatedScroll = this.actualScroll),
      this.options.wrapper.addEventListener("scroll", this.onNativeScroll, !1),
      this.options.wrapper.addEventListener(
        "pointerdown",
        this.onPointerDown,
        !1
      ),
      (this.virtualScroll = new Po(r, {
        touchMultiplier: M,
        wheelMultiplier: p,
      })),
      this.virtualScroll.on("scroll", this.onVirtualScroll);
  }
  destroy() {
    this.emitter.destroy(),
      this.options.wrapper.removeEventListener(
        "scroll",
        this.onNativeScroll,
        !1
      ),
      this.options.wrapper.removeEventListener(
        "pointerdown",
        this.onPointerDown,
        !1
      ),
      this.virtualScroll.destroy(),
      this.dimensions.destroy(),
      this.cleanUpClassName();
  }
  on(t, e) {
    return this.emitter.on(t, e);
  }
  off(t, e) {
    return this.emitter.off(t, e);
  }
  setScroll(t) {
    this.isHorizontal
      ? (this.rootElement.scrollLeft = t)
      : (this.rootElement.scrollTop = t);
  }
  resize() {
    this.dimensions.resize();
  }
  emit() {
    this.emitter.emit("scroll", this);
  }
  reset() {
    (this.isLocked = !1),
      (this.isScrolling = !1),
      (this.animatedScroll = this.targetScroll = this.actualScroll),
      (this.lastVelocity = this.velocity = 0),
      this.animate.stop();
  }
  start() {
    this.isStopped && ((this.isStopped = !1), this.reset());
  }
  stop() {
    this.isStopped ||
      ((this.isStopped = !0), this.animate.stop(), this.reset());
  }
  raf(t) {
    const e = t - (this.time || t);
    (this.time = t), this.animate.advance(0.001 * e);
  }
  scrollTo(
    t,
    {
      offset: e = 0,
      immediate: n = !1,
      lock: r = !1,
      duration: s = this.options.duration,
      easing: a = this.options.easing,
      lerp: o = this.options.lerp,
      onStart: l,
      onComplete: c,
      force: u = !1,
      programmatic: d = !0,
      userData: f = {},
    } = {}
  ) {
    if ((!this.isStopped && !this.isLocked) || u) {
      if (typeof t == "string" && ["top", "left", "start"].includes(t)) t = 0;
      else if (typeof t == "string" && ["bottom", "right", "end"].includes(t))
        t = this.limit;
      else {
        let m;
        if (
          (typeof t == "string"
            ? (m = document.querySelector(t))
            : t instanceof HTMLElement && t != null && t.nodeType && (m = t),
          m)
        ) {
          if (this.options.wrapper !== window) {
            const M = this.rootElement.getBoundingClientRect();
            e -= this.isHorizontal ? M.left : M.top;
          }
          const v = m.getBoundingClientRect();
          t = (this.isHorizontal ? v.left : v.top) + this.animatedScroll;
        }
      }
      if (
        typeof t == "number" &&
        ((t += e),
        (t = Math.round(t)),
        this.options.infinite
          ? d && (this.targetScroll = this.animatedScroll = this.scroll)
          : (t = ka(0, t, this.limit)),
        t !== this.targetScroll)
      ) {
        if (((this.userData = f), n))
          return (
            (this.animatedScroll = this.targetScroll = t),
            this.setScroll(this.scroll),
            this.reset(),
            this.preventNextNativeScrollEvent(),
            this.emit(),
            c == null || c(this),
            void (this.userData = {})
          );
        d || (this.targetScroll = t),
          this.animate.fromTo(this.animatedScroll, t, {
            duration: s,
            easing: a,
            lerp: o,
            onStart: () => {
              r && (this.isLocked = !0),
                (this.isScrolling = "smooth"),
                l == null || l(this);
            },
            onUpdate: (m, v) => {
              (this.isScrolling = "smooth"),
                (this.lastVelocity = this.velocity),
                (this.velocity = m - this.animatedScroll),
                (this.direction = Math.sign(this.velocity)),
                (this.animatedScroll = m),
                this.setScroll(this.scroll),
                d && (this.targetScroll = m),
                v || this.emit(),
                v &&
                  (this.reset(),
                  this.emit(),
                  c == null || c(this),
                  (this.userData = {}),
                  this.preventNextNativeScrollEvent());
            },
          });
      }
    }
  }
  preventNextNativeScrollEvent() {
    (this.__preventNextNativeScrollEvent = !0),
      requestAnimationFrame(() => {
        delete this.__preventNextNativeScrollEvent;
      });
  }
  get rootElement() {
    return this.options.wrapper === window
      ? document.documentElement
      : this.options.wrapper;
  }
  get limit() {
    return this.options.__experimental__naiveDimensions
      ? this.isHorizontal
        ? this.rootElement.scrollWidth - this.rootElement.clientWidth
        : this.rootElement.scrollHeight - this.rootElement.clientHeight
      : this.dimensions.limit[this.isHorizontal ? "x" : "y"];
  }
  get isHorizontal() {
    return this.options.orientation === "horizontal";
  }
  get actualScroll() {
    return this.isHorizontal
      ? this.rootElement.scrollLeft
      : this.rootElement.scrollTop;
  }
  get scroll() {
    return this.options.infinite
      ? (function (e, n) {
          return ((e % n) + n) % n;
        })(this.animatedScroll, this.limit)
      : this.animatedScroll;
  }
  get progress() {
    return this.limit === 0 ? 1 : this.scroll / this.limit;
  }
  get isScrolling() {
    return this.__isScrolling;
  }
  set isScrolling(t) {
    this.__isScrolling !== t &&
      ((this.__isScrolling = t), this.updateClassName());
  }
  get isStopped() {
    return this.__isStopped;
  }
  set isStopped(t) {
    this.__isStopped !== t && ((this.__isStopped = t), this.updateClassName());
  }
  get isLocked() {
    return this.__isLocked;
  }
  set isLocked(t) {
    this.__isLocked !== t && ((this.__isLocked = t), this.updateClassName());
  }
  get isSmooth() {
    return this.isScrolling === "smooth";
  }
  get className() {
    let t = "lenis";
    return (
      this.isStopped && (t += " lenis-stopped"),
      this.isLocked && (t += " lenis-locked"),
      this.isScrolling && (t += " lenis-scrolling"),
      this.isScrolling === "smooth" && (t += " lenis-smooth"),
      t
    );
  }
  updateClassName() {
    this.cleanUpClassName(),
      (this.rootElement.className =
        `${this.rootElement.className} ${this.className}`.trim());
  }
  cleanUpClassName() {
    this.rootElement.className = this.rootElement.className
      .replace(/lenis(-\w+)?/g, "")
      .trim();
  }
}
function Nr() {
  return (
    (Nr = Object.assign
      ? Object.assign.bind()
      : function (i) {
          for (var t = 1; t < arguments.length; t++) {
            var e = arguments[t];
            for (var n in e) ({}).hasOwnProperty.call(e, n) && (i[n] = e[n]);
          }
          return i;
        }),
    Nr.apply(null, arguments)
  );
}
class Gs {
  constructor({
    scrollElements: t,
    rootMargin: e = "-1px -1px -1px -1px",
    IORaf: n,
  }) {
    (this.scrollElements = void 0),
      (this.rootMargin = void 0),
      (this.IORaf = void 0),
      (this.observer = void 0),
      (this.scrollElements = t),
      (this.rootMargin = e),
      (this.IORaf = n),
      this._init();
  }
  _init() {
    this.observer = new IntersectionObserver(
      (t) => {
        t.forEach((e) => {
          const n = this.scrollElements.find((r) => r.$el === e.target);
          e.isIntersecting
            ? (n && (n.isAlreadyIntersected = !0), this._setInview(e))
            : n && n.isAlreadyIntersected && this._setOutOfView(e);
        });
      },
      { rootMargin: this.rootMargin }
    );
    for (const t of this.scrollElements) this.observe(t.$el);
  }
  destroy() {
    this.observer.disconnect();
  }
  observe(t) {
    t && this.observer.observe(t);
  }
  unobserve(t) {
    t && this.observer.unobserve(t);
  }
  _setInview(t) {
    const e = this.scrollElements.find((n) => n.$el === t.target);
    this.IORaf && (e == null || e.setInteractivityOn()),
      !this.IORaf && (e == null || e.setInview());
  }
  _setOutOfView(t) {
    const e = this.scrollElements.find((n) => n.$el === t.target);
    this.IORaf && (e == null || e.setInteractivityOff()),
      !this.IORaf && (e == null || e.setOutOfView()),
      (e != null && e.attributes.scrollRepeat) ||
        this.IORaf ||
        this.unobserve(t.target);
  }
}
function ks(i, t, e, n, r) {
  return e + (((r - i) / (t - i)) * (n - e) || 0);
}
function Ws(i, t) {
  return i.reduce((e, n) => (Math.abs(n - t) < Math.abs(e - t) ? n : e));
}
class Io {
  constructor({
    $el: t,
    id: e,
    modularInstance: n,
    subscribeElementUpdateFn: r,
    unsubscribeElementUpdateFn: s,
    needRaf: a,
    scrollOrientation: o,
  }) {
    var l, c, u, d, f;
    (this.$el = void 0),
      (this.id = void 0),
      (this.needRaf = void 0),
      (this.attributes = void 0),
      (this.scrollOrientation = void 0),
      (this.isAlreadyIntersected = void 0),
      (this.intersection = void 0),
      (this.metrics = void 0),
      (this.currentScroll = void 0),
      (this.translateValue = void 0),
      (this.progress = void 0),
      (this.lastProgress = void 0),
      (this.modularInstance = void 0),
      (this.progressModularModules = void 0),
      (this.isInview = void 0),
      (this.isInteractive = void 0),
      (this.isInFold = void 0),
      (this.isFirstResize = void 0),
      (this.subscribeElementUpdateFn = void 0),
      (this.unsubscribeElementUpdateFn = void 0),
      (this.$el = t),
      (this.id = e),
      (this.needRaf = a),
      (this.scrollOrientation = o),
      (this.modularInstance = n),
      (this.subscribeElementUpdateFn = r),
      (this.unsubscribeElementUpdateFn = s),
      (this.attributes = {
        scrollClass:
          (l = this.$el.dataset.scrollClass) != null ? l : "is-inview",
        scrollOffset: (c = this.$el.dataset.scrollOffset) != null ? c : "0,0",
        scrollPosition:
          (u = this.$el.dataset.scrollPosition) != null ? u : "start,end",
        scrollModuleProgress: this.$el.dataset.scrollModuleProgress != null,
        scrollCssProgress: this.$el.dataset.scrollCssProgress != null,
        scrollEventProgress:
          (d = this.$el.dataset.scrollEventProgress) != null ? d : null,
        scrollSpeed:
          this.$el.dataset.scrollSpeed != null
            ? parseFloat(this.$el.dataset.scrollSpeed)
            : null,
        scrollRepeat: this.$el.dataset.scrollRepeat != null,
        scrollCall: (f = this.$el.dataset.scrollCall) != null ? f : null,
        scrollCallSelf: this.$el.dataset.scrollCallSelf != null,
        scrollIgnoreFold: this.$el.dataset.scrollIgnoreFold != null,
        scrollEnableTouchSpeed: this.$el.dataset.scrollEnableTouchSpeed != null,
      }),
      (this.intersection = { start: 0, end: 0 }),
      (this.metrics = { offsetStart: 0, offsetEnd: 0, bcr: {} }),
      (this.currentScroll =
        this.scrollOrientation === "vertical"
          ? window.scrollY
          : window.scrollX),
      (this.translateValue = 0),
      (this.progress = 0),
      (this.lastProgress = null),
      (this.progressModularModules = []),
      (this.isInview = !1),
      (this.isInteractive = !1),
      (this.isAlreadyIntersected = !1),
      (this.isInFold = !1),
      (this.isFirstResize = !0),
      this._init();
  }
  _init() {
    this.needRaf &&
      (this.modularInstance &&
        this.attributes.scrollModuleProgress &&
        this._getProgressModularModules(),
      this._resize());
  }
  onResize({ currentScroll: t }) {
    (this.currentScroll = t), this._resize();
  }
  onRender({ currentScroll: t, smooth: e }) {
    const n =
      this.scrollOrientation === "vertical"
        ? window.innerHeight
        : window.innerWidth;
    if (
      ((this.currentScroll = t),
      this._computeProgress(),
      this.attributes.scrollSpeed && !isNaN(this.attributes.scrollSpeed))
    )
      if (this.attributes.scrollEnableTouchSpeed || e) {
        if (this.isInFold) {
          const r = Math.max(0, this.progress);
          this.translateValue = r * n * this.attributes.scrollSpeed * -1;
        } else {
          const r = ks(0, 1, -1, 1, this.progress);
          this.translateValue = r * n * this.attributes.scrollSpeed * -1;
        }
        this.$el.style.transform =
          this.scrollOrientation === "vertical"
            ? `translate3d(0, ${this.translateValue}px, 0)`
            : `translate3d(${this.translateValue}px, 0, 0)`;
      } else
        this.translateValue &&
          (this.$el.style.transform = "translate3d(0, 0, 0)"),
          (this.translateValue = 0);
  }
  setInview() {
    if (this.isInview) return;
    (this.isInview = !0), this.$el.classList.add(this.attributes.scrollClass);
    const t = this._getScrollCallFrom();
    this.attributes.scrollCall && this._dispatchCall("enter", t);
  }
  setOutOfView() {
    if (!this.isInview || !this.attributes.scrollRepeat) return;
    (this.isInview = !1),
      this.$el.classList.remove(this.attributes.scrollClass);
    const t = this._getScrollCallFrom();
    this.attributes.scrollCall && this._dispatchCall("leave", t);
  }
  setInteractivityOn() {
    this.isInteractive ||
      ((this.isInteractive = !0), this.subscribeElementUpdateFn(this));
  }
  setInteractivityOff() {
    this.isInteractive &&
      ((this.isInteractive = !1),
      this.unsubscribeElementUpdateFn(this),
      this.lastProgress != null &&
        this._computeProgress(Ws([0, 1], this.lastProgress)));
  }
  _resize() {
    (this.metrics.bcr = this.$el.getBoundingClientRect()),
      this._computeMetrics(),
      this._computeIntersection(),
      this.isFirstResize &&
        ((this.isFirstResize = !1), this.isInFold && this.setInview());
  }
  _computeMetrics() {
    const { top: t, left: e, height: n, width: r } = this.metrics.bcr,
      s =
        this.scrollOrientation === "vertical"
          ? window.innerHeight
          : window.innerWidth,
      a = this.scrollOrientation === "vertical" ? n : r;
    (this.metrics.offsetStart =
      this.currentScroll +
      (this.scrollOrientation === "vertical" ? t : e) -
      this.translateValue),
      (this.metrics.offsetEnd = this.metrics.offsetStart + a),
      (this.isInFold =
        this.metrics.offsetStart < s && !this.attributes.scrollIgnoreFold);
  }
  _computeIntersection() {
    const t =
        this.scrollOrientation === "vertical"
          ? window.innerHeight
          : window.innerWidth,
      e =
        this.scrollOrientation === "vertical"
          ? this.metrics.bcr.height
          : this.metrics.bcr.width,
      n = this.attributes.scrollOffset.split(","),
      r = n[0] != null ? n[0].trim() : "0",
      s = n[1] != null ? n[1].trim() : "0",
      a = this.attributes.scrollPosition.split(",");
    let o = a[0] != null ? a[0].trim() : "start";
    const l = a[1] != null ? a[1].trim() : "end",
      c = r.includes("%")
        ? t * parseInt(r.replace("%", "").trim()) * 0.01
        : parseInt(r),
      u = s.includes("%")
        ? t * parseInt(s.replace("%", "").trim()) * 0.01
        : parseInt(s);
    switch ((this.isInFold && (o = "fold"), o)) {
      case "start":
      default:
        this.intersection.start = this.metrics.offsetStart - t + c;
        break;
      case "middle":
        this.intersection.start = this.metrics.offsetStart - t + c + 0.5 * e;
        break;
      case "end":
        this.intersection.start = this.metrics.offsetStart - t + c + e;
        break;
      case "fold":
        this.intersection.start = 0;
    }
    switch (l) {
      case "start":
        this.intersection.end = this.metrics.offsetStart - u;
        break;
      case "middle":
        this.intersection.end = this.metrics.offsetStart - u + 0.5 * e;
        break;
      default:
        this.intersection.end = this.metrics.offsetStart - u + e;
    }
    if (this.intersection.end <= this.intersection.start)
      switch (l) {
        case "start":
        default:
          this.intersection.end = this.intersection.start + 1;
          break;
        case "middle":
          this.intersection.end = this.intersection.start + 0.5 * e;
          break;
        case "end":
          this.intersection.end = this.intersection.start + e;
      }
  }
  _computeProgress(t) {
    const e =
      t ??
      ((n = ks(
        this.intersection.start,
        this.intersection.end,
        0,
        1,
        this.currentScroll
      )) < 0
        ? 0
        : n > 1
        ? 1
        : n);
    var n;
    if (((this.progress = e), e != this.lastProgress)) {
      if (
        ((this.lastProgress = e),
        this.attributes.scrollCssProgress && this._setCssProgress(e),
        this.attributes.scrollEventProgress && this._setCustomEventProgress(e),
        this.attributes.scrollModuleProgress)
      )
        for (const r of this.progressModularModules)
          this.modularInstance &&
            this.modularInstance.call(
              "onScrollProgress",
              e,
              r.moduleName,
              r.moduleId
            );
      e > 0 && e < 1 && this.setInview(),
        e === 0 && this.setOutOfView(),
        e === 1 && this.setOutOfView();
    }
  }
  _setCssProgress(t = 0) {
    this.$el.style.setProperty("--progress", t.toString());
  }
  _setCustomEventProgress(t = 0) {
    const e = this.attributes.scrollEventProgress;
    if (!e) return;
    const n = new CustomEvent(e, { detail: { target: this.$el, progress: t } });
    window.dispatchEvent(n);
  }
  _getProgressModularModules() {
    if (!this.modularInstance) return;
    const t = Object.keys(this.$el.dataset).filter((n) => n.includes("module")),
      e = Object.entries(this.modularInstance.modules);
    if (t.length)
      for (const n of t) {
        const r = this.$el.dataset[n];
        if (!r) return;
        for (const s of e) {
          const [a, o] = s;
          r in o &&
            this.progressModularModules.push({ moduleName: a, moduleId: r });
        }
      }
  }
  _getScrollCallFrom() {
    const t = Ws(
      [this.intersection.start, this.intersection.end],
      this.currentScroll
    );
    return this.intersection.start === t ? "start" : "end";
  }
  _dispatchCall(t, e) {
    var n, r;
    const s = (n = this.attributes.scrollCall) == null ? void 0 : n.split(","),
      a = (r = this.attributes) == null ? void 0 : r.scrollCallSelf;
    if (s && s.length > 1) {
      var o;
      const [l, c, u] = s;
      let d;
      (d = a ? this.$el.dataset[`module${c.trim()}`] : u),
        this.modularInstance &&
          this.modularInstance.call(
            l.trim(),
            { target: this.$el, way: t, from: e },
            c.trim(),
            (o = d) == null ? void 0 : o.trim()
          );
    } else if (s) {
      const [l] = s,
        c = new CustomEvent(l, {
          detail: { target: this.$el, way: t, from: e },
        });
      window.dispatchEvent(c);
    }
  }
}
const Do = [
  "scrollOffset",
  "scrollPosition",
  "scrollModuleProgress",
  "scrollCssProgress",
  "scrollEventProgress",
  "scrollSpeed",
];
class Uo {
  constructor({
    $el: t,
    modularInstance: e,
    triggerRootMargin: n,
    rafRootMargin: r,
    scrollOrientation: s,
  }) {
    (this.$scrollContainer = void 0),
      (this.modularInstance = void 0),
      (this.triggerRootMargin = void 0),
      (this.rafRootMargin = void 0),
      (this.scrollElements = void 0),
      (this.triggeredScrollElements = void 0),
      (this.RAFScrollElements = void 0),
      (this.scrollElementsToUpdate = void 0),
      (this.IOTriggerInstance = void 0),
      (this.IORafInstance = void 0),
      (this.scrollOrientation = void 0),
      t
        ? ((this.$scrollContainer = t),
          (this.modularInstance = e),
          (this.scrollOrientation = s),
          (this.triggerRootMargin = n ?? "-1px -1px -1px -1px"),
          (this.rafRootMargin = r ?? "100% 100% 100% 100%"),
          (this.scrollElements = []),
          (this.triggeredScrollElements = []),
          (this.RAFScrollElements = []),
          (this.scrollElementsToUpdate = []),
          this._init())
        : console.error("Please provide a DOM Element as scrollContainer");
  }
  _init() {
    const t = this.$scrollContainer.querySelectorAll("[data-scroll]"),
      e = Array.from(t);
    this._subscribeScrollElements(e),
      (this.IOTriggerInstance = new Gs({
        scrollElements: [...this.triggeredScrollElements],
        rootMargin: this.triggerRootMargin,
        IORaf: !1,
      })),
      (this.IORafInstance = new Gs({
        scrollElements: [...this.RAFScrollElements],
        rootMargin: this.rafRootMargin,
        IORaf: !0,
      }));
  }
  destroy() {
    this.IOTriggerInstance.destroy(),
      this.IORafInstance.destroy(),
      this._unsubscribeAllScrollElements();
  }
  onResize({ currentScroll: t }) {
    for (const e of this.RAFScrollElements) e.onResize({ currentScroll: t });
  }
  onRender({ currentScroll: t, smooth: e }) {
    for (const n of this.scrollElementsToUpdate)
      n.onRender({ currentScroll: t, smooth: e });
  }
  removeScrollElements(t) {
    const e = t.querySelectorAll("[data-scroll]");
    if (e.length) {
      for (let n = 0; n < this.triggeredScrollElements.length; n++) {
        const r = this.triggeredScrollElements[n];
        Array.from(e).indexOf(r.$el) > -1 &&
          (this.IOTriggerInstance.unobserve(r.$el),
          this.triggeredScrollElements.splice(n, 1));
      }
      for (let n = 0; n < this.RAFScrollElements.length; n++) {
        const r = this.RAFScrollElements[n];
        Array.from(e).indexOf(r.$el) > -1 &&
          (this.IORafInstance.unobserve(r.$el),
          this.RAFScrollElements.splice(n, 1));
      }
      e.forEach((n) => {
        const r = this.scrollElementsToUpdate.find((a) => a.$el === n),
          s = this.scrollElements.find((a) => a.$el === n);
        r && this._unsubscribeElementUpdate(r),
          s &&
            (this.scrollElements = this.scrollElements.filter(
              (a) => a.id != s.id
            ));
      });
    }
  }
  addScrollElements(t) {
    const e = t.querySelectorAll("[data-scroll]"),
      n = [];
    this.scrollElements.forEach((a) => {
      n.push(a.id);
    });
    const r = Math.max(...n, 0) + 1,
      s = Array.from(e);
    this._subscribeScrollElements(s, r, !0);
  }
  _subscribeScrollElements(t, e = 0, n = !1) {
    for (let r = 0; r < t.length; r++) {
      const s = t[r],
        a = this._checkRafNeeded(s),
        o = new Io({
          $el: s,
          id: e + r,
          scrollOrientation: this.scrollOrientation,
          modularInstance: this.modularInstance,
          subscribeElementUpdateFn: this._subscribeElementUpdate.bind(this),
          unsubscribeElementUpdateFn: this._unsubscribeElementUpdate.bind(this),
          needRaf: a,
        });
      this.scrollElements.push(o),
        a
          ? (this.RAFScrollElements.push(o),
            n &&
              (this.IORafInstance.scrollElements.push(o),
              this.IORafInstance.observe(o.$el)))
          : (this.triggeredScrollElements.push(o),
            n &&
              (this.IOTriggerInstance.scrollElements.push(o),
              this.IOTriggerInstance.observe(o.$el)));
    }
  }
  _unsubscribeAllScrollElements() {
    (this.scrollElements = []),
      (this.RAFScrollElements = []),
      (this.triggeredScrollElements = []),
      (this.scrollElementsToUpdate = []);
  }
  _subscribeElementUpdate(t) {
    this.scrollElementsToUpdate.push(t);
  }
  _unsubscribeElementUpdate(t) {
    this.scrollElementsToUpdate = this.scrollElementsToUpdate.filter(
      (e) => e.id != t.id
    );
  }
  _checkRafNeeded(t) {
    let e = [...Do];
    const n = (r) => {
      e = e.filter((s) => s != r);
    };
    if (t.dataset.scrollOffset) {
      if (
        t.dataset.scrollOffset
          .split(",")
          .map((r) => r.replace("%", "").trim())
          .join(",") != "0,0"
      )
        return !0;
      n("scrollOffset");
    } else n("scrollOffset");
    if (t.dataset.scrollPosition) {
      if (t.dataset.scrollPosition.trim() != "top,bottom") return !0;
      n("scrollPosition");
    } else n("scrollPosition");
    if (t.dataset.scrollSpeed && !isNaN(parseFloat(t.dataset.scrollSpeed)))
      return !0;
    n("scrollSpeed");
    for (const r of e) if (r in t.dataset) return !0;
    return !1;
  }
}
class No {
  constructor({ resizeElements: t, resizeCallback: e = () => {} }) {
    (this.$resizeElements = void 0),
      (this.isFirstObserve = void 0),
      (this.observer = void 0),
      (this.resizeCallback = void 0),
      (this.$resizeElements = t),
      (this.resizeCallback = e),
      (this.isFirstObserve = !0),
      this._init();
  }
  _init() {
    this.observer = new ResizeObserver((t) => {
      var e;
      !this.isFirstObserve &&
        ((e = this.resizeCallback) == null || e.call(this)),
        (this.isFirstObserve = !1);
    });
    for (const t of this.$resizeElements) this.observer.observe(t);
  }
  destroy() {
    this.observer.disconnect();
  }
}
class Fo {
  constructor({
    lenisOptions: t = {},
    modularInstance: e,
    triggerRootMargin: n,
    rafRootMargin: r,
    autoResize: s = !0,
    autoStart: a = !0,
    scrollCallback: o = () => {},
    initCustomTicker: l,
    destroyCustomTicker: c,
  } = {}) {
    (this.rafPlaying = void 0),
      (this.lenisInstance = void 0),
      (this.coreInstance = void 0),
      (this.lenisOptions = void 0),
      (this.modularInstance = void 0),
      (this.triggerRootMargin = void 0),
      (this.rafRootMargin = void 0),
      (this.rafInstance = void 0),
      (this.autoResize = void 0),
      (this.autoStart = void 0),
      (this.ROInstance = void 0),
      (this.initCustomTicker = void 0),
      (this.destroyCustomTicker = void 0),
      (this._onRenderBind = void 0),
      (this._onResizeBind = void 0),
      (this._onScrollToBind = void 0);
    for (const [u] of Object.entries(t))
      ["wrapper", "content", "infinite"].includes(u) &&
        console.warn(
          `Warning: Key "${u}" is not possible to edit in Locomotive Scroll.`
        );
    Object.assign(this, {
      lenisOptions: t,
      modularInstance: e,
      triggerRootMargin: n,
      rafRootMargin: r,
      autoResize: s,
      autoStart: a,
      scrollCallback: o,
      initCustomTicker: l,
      destroyCustomTicker: c,
    }),
      (this._onRenderBind = this._onRender.bind(this)),
      (this._onScrollToBind = this._onScrollTo.bind(this)),
      (this._onResizeBind = this._onResize.bind(this)),
      (this.rafPlaying = !1),
      this._init();
  }
  _init() {
    var t;
    (this.lenisInstance = new Lo(
      Nr({}, this.lenisOptions, {
        wrapper: window,
        content: document.documentElement,
        infinite: !1,
      })
    )),
      (t = this.lenisInstance) == null || t.on("scroll", this.scrollCallback),
      document.documentElement.setAttribute(
        "data-scroll-orientation",
        this.lenisInstance.options.orientation
      ),
      requestAnimationFrame(() => {
        (this.coreInstance = new Uo({
          $el: this.lenisInstance.rootElement,
          modularInstance: this.modularInstance,
          triggerRootMargin: this.triggerRootMargin,
          rafRootMargin: this.rafRootMargin,
          scrollOrientation: this.lenisInstance.options.orientation,
        })),
          this._bindEvents(),
          this.initCustomTicker && !this.destroyCustomTicker
            ? console.warn(
                "initCustomTicker callback is declared, but destroyCustomTicker is not. Please pay attention. It could cause trouble."
              )
            : !this.initCustomTicker &&
              this.destroyCustomTicker &&
              console.warn(
                "destroyCustomTicker callback is declared, but initCustomTicker is not. Please pay attention. It could cause trouble."
              ),
          this.autoStart && this.start();
      });
  }
  destroy() {
    var t;
    this.stop(),
      this._unbindEvents(),
      this.lenisInstance.destroy(),
      (t = this.coreInstance) == null || t.destroy(),
      requestAnimationFrame(() => {
        var e;
        (e = this.coreInstance) == null || e.destroy();
      });
  }
  _bindEvents() {
    this._bindScrollToEvents(),
      this.autoResize &&
        ("ResizeObserver" in window
          ? (this.ROInstance = new No({
              resizeElements: [document.body],
              resizeCallback: this._onResizeBind,
            }))
          : window.addEventListener("resize", this._onResizeBind));
  }
  _unbindEvents() {
    this._unbindScrollToEvents(),
      this.autoResize &&
        ("ResizeObserver" in window
          ? this.ROInstance && this.ROInstance.destroy()
          : window.removeEventListener("resize", this._onResizeBind));
  }
  _bindScrollToEvents(t) {
    const e = t || this.lenisInstance.rootElement,
      n = e == null ? void 0 : e.querySelectorAll("[data-scroll-to]");
    n != null &&
      n.length &&
      n.forEach((r) => {
        r.addEventListener("click", this._onScrollToBind, !1);
      });
  }
  _unbindScrollToEvents(t) {
    const e = t || this.lenisInstance.rootElement,
      n = e == null ? void 0 : e.querySelectorAll("[data-scroll-to]");
    n != null &&
      n.length &&
      n.forEach((r) => {
        r.removeEventListener("click", this._onScrollToBind, !1);
      });
  }
  _onResize() {
    requestAnimationFrame(() => {
      var t;
      (t = this.coreInstance) == null ||
        t.onResize({ currentScroll: this.lenisInstance.scroll });
    });
  }
  _onRender() {
    var t, e;
    (t = this.lenisInstance) == null || t.raf(Date.now()),
      (e = this.coreInstance) == null ||
        e.onRender({
          currentScroll: this.lenisInstance.scroll,
          smooth: this.lenisInstance.options.smoothWheel,
        });
  }
  _onScrollTo(t) {
    var e;
    t.preventDefault();
    const n = (e = t.currentTarget) != null ? e : null;
    if (!n) return;
    const r = n.getAttribute("data-scroll-to-href") || n.getAttribute("href"),
      s = n.getAttribute("data-scroll-to-offset") || 0,
      a =
        n.getAttribute("data-scroll-to-duration") ||
        this.lenisInstance.options.duration;
    r &&
      this.scrollTo(r, {
        offset: typeof s == "string" ? parseInt(s) : s,
        duration: typeof a == "string" ? parseInt(a) : a,
      });
  }
  start() {
    var t;
    this.rafPlaying ||
      ((t = this.lenisInstance) == null || t.start(),
      (this.rafPlaying = !0),
      this.initCustomTicker
        ? this.initCustomTicker(this._onRenderBind)
        : this._raf());
  }
  stop() {
    var t;
    this.rafPlaying &&
      ((t = this.lenisInstance) == null || t.stop(),
      (this.rafPlaying = !1),
      this.destroyCustomTicker
        ? this.destroyCustomTicker(this._onRenderBind)
        : this.rafInstance && cancelAnimationFrame(this.rafInstance));
  }
  removeScrollElements(t) {
    var e;
    t
      ? (this._unbindScrollToEvents(t),
        (e = this.coreInstance) == null || e.removeScrollElements(t))
      : console.error("Please provide a DOM Element as $oldContainer");
  }
  addScrollElements(t) {
    var e;
    t
      ? ((e = this.coreInstance) == null || e.addScrollElements(t),
        requestAnimationFrame(() => {
          this._bindScrollToEvents(t);
        }))
      : console.error("Please provide a DOM Element as $newContainer");
  }
  resize() {
    this._onResizeBind();
  }
  scrollTo(t, e) {
    var n;
    (n = this.lenisInstance) == null ||
      n.scrollTo(t, {
        offset: e == null ? void 0 : e.offset,
        lerp: e == null ? void 0 : e.lerp,
        duration: e == null ? void 0 : e.duration,
        immediate: e == null ? void 0 : e.immediate,
        lock: e == null ? void 0 : e.lock,
        force: e == null ? void 0 : e.force,
        easing: e == null ? void 0 : e.easing,
        onComplete: e == null ? void 0 : e.onComplete,
      });
  }
  _raf() {
    this._onRenderBind(),
      (this.rafInstance = requestAnimationFrame(() => this._raf()));
  }
}
/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */ const ys = "170",
  Oo = 0,
  Xs = 1,
  Bo = 2,
  Xa = 1,
  zo = 2,
  qe = 3,
  un = 0,
  me = 1,
  Ye = 2,
  cn = 0,
  qn = 1,
  qs = 2,
  Ys = 3,
  $s = 4,
  Ho = 5,
  En = 100,
  Vo = 101,
  Go = 102,
  ko = 103,
  Wo = 104,
  Xo = 200,
  qo = 201,
  Yo = 202,
  $o = 203,
  Fr = 204,
  Or = 205,
  Ko = 206,
  Zo = 207,
  jo = 208,
  Jo = 209,
  Qo = 210,
  tl = 211,
  el = 212,
  nl = 213,
  il = 214,
  Br = 0,
  zr = 1,
  Hr = 2,
  Kn = 3,
  Vr = 4,
  Gr = 5,
  kr = 6,
  Wr = 7,
  qa = 0,
  rl = 1,
  sl = 2,
  hn = 0,
  al = 1,
  ol = 2,
  ll = 3,
  cl = 4,
  hl = 5,
  ul = 6,
  dl = 7,
  Ya = 300,
  Zn = 301,
  jn = 302,
  Xr = 303,
  qr = 304,
  Qi = 306,
  Yr = 1e3,
  Tn = 1001,
  $r = 1002,
  De = 1003,
  fl = 1004,
  Ei = 1005,
  Fe = 1006,
  sr = 1007,
  bn = 1008,
  je = 1009,
  $a = 1010,
  Ka = 1011,
  fi = 1012,
  Ts = 1013,
  Rn = 1014,
  $e = 1015,
  pi = 1016,
  bs = 1017,
  As = 1018,
  Jn = 1020,
  Za = 35902,
  ja = 1021,
  Ja = 1022,
  Ie = 1023,
  Qa = 1024,
  to = 1025,
  Yn = 1026,
  Qn = 1027,
  eo = 1028,
  Rs = 1029,
  no = 1030,
  ws = 1031,
  Cs = 1033,
  Wi = 33776,
  Xi = 33777,
  qi = 33778,
  Yi = 33779,
  Kr = 35840,
  Zr = 35841,
  jr = 35842,
  Jr = 35843,
  Qr = 36196,
  ts = 37492,
  es = 37496,
  ns = 37808,
  is = 37809,
  rs = 37810,
  ss = 37811,
  as = 37812,
  os = 37813,
  ls = 37814,
  cs = 37815,
  hs = 37816,
  us = 37817,
  ds = 37818,
  fs = 37819,
  ps = 37820,
  ms = 37821,
  $i = 36492,
  _s = 36494,
  gs = 36495,
  io = 36283,
  vs = 36284,
  xs = 36285,
  Ms = 36286,
  pl = 3200,
  ml = 3201,
  _l = 0,
  gl = 1,
  ln = "",
  Te = "srgb",
  ei = "srgb-linear",
  tr = "linear",
  Xt = "srgb",
  Ln = 7680,
  Ks = 519,
  vl = 512,
  xl = 513,
  Ml = 514,
  ro = 515,
  Sl = 516,
  El = 517,
  yl = 518,
  Tl = 519,
  Zs = 35044,
  js = "300 es",
  Ke = 2e3,
  Zi = 2001;
class ni {
  addEventListener(t, e) {
    this._listeners === void 0 && (this._listeners = {});
    const n = this._listeners;
    n[t] === void 0 && (n[t] = []), n[t].indexOf(e) === -1 && n[t].push(e);
  }
  hasEventListener(t, e) {
    if (this._listeners === void 0) return !1;
    const n = this._listeners;
    return n[t] !== void 0 && n[t].indexOf(e) !== -1;
  }
  removeEventListener(t, e) {
    if (this._listeners === void 0) return;
    const r = this._listeners[t];
    if (r !== void 0) {
      const s = r.indexOf(e);
      s !== -1 && r.splice(s, 1);
    }
  }
  dispatchEvent(t) {
    if (this._listeners === void 0) return;
    const n = this._listeners[t.type];
    if (n !== void 0) {
      t.target = this;
      const r = n.slice(0);
      for (let s = 0, a = r.length; s < a; s++) r[s].call(this, t);
      t.target = null;
    }
  }
}
const ce = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "0a",
    "0b",
    "0c",
    "0d",
    "0e",
    "0f",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "1a",
    "1b",
    "1c",
    "1d",
    "1e",
    "1f",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "2a",
    "2b",
    "2c",
    "2d",
    "2e",
    "2f",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "3a",
    "3b",
    "3c",
    "3d",
    "3e",
    "3f",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "4a",
    "4b",
    "4c",
    "4d",
    "4e",
    "4f",
    "50",
    "51",
    "52",
    "53",
    "54",
    "55",
    "56",
    "57",
    "58",
    "59",
    "5a",
    "5b",
    "5c",
    "5d",
    "5e",
    "5f",
    "60",
    "61",
    "62",
    "63",
    "64",
    "65",
    "66",
    "67",
    "68",
    "69",
    "6a",
    "6b",
    "6c",
    "6d",
    "6e",
    "6f",
    "70",
    "71",
    "72",
    "73",
    "74",
    "75",
    "76",
    "77",
    "78",
    "79",
    "7a",
    "7b",
    "7c",
    "7d",
    "7e",
    "7f",
    "80",
    "81",
    "82",
    "83",
    "84",
    "85",
    "86",
    "87",
    "88",
    "89",
    "8a",
    "8b",
    "8c",
    "8d",
    "8e",
    "8f",
    "90",
    "91",
    "92",
    "93",
    "94",
    "95",
    "96",
    "97",
    "98",
    "99",
    "9a",
    "9b",
    "9c",
    "9d",
    "9e",
    "9f",
    "a0",
    "a1",
    "a2",
    "a3",
    "a4",
    "a5",
    "a6",
    "a7",
    "a8",
    "a9",
    "aa",
    "ab",
    "ac",
    "ad",
    "ae",
    "af",
    "b0",
    "b1",
    "b2",
    "b3",
    "b4",
    "b5",
    "b6",
    "b7",
    "b8",
    "b9",
    "ba",
    "bb",
    "bc",
    "bd",
    "be",
    "bf",
    "c0",
    "c1",
    "c2",
    "c3",
    "c4",
    "c5",
    "c6",
    "c7",
    "c8",
    "c9",
    "ca",
    "cb",
    "cc",
    "cd",
    "ce",
    "cf",
    "d0",
    "d1",
    "d2",
    "d3",
    "d4",
    "d5",
    "d6",
    "d7",
    "d8",
    "d9",
    "da",
    "db",
    "dc",
    "dd",
    "de",
    "df",
    "e0",
    "e1",
    "e2",
    "e3",
    "e4",
    "e5",
    "e6",
    "e7",
    "e8",
    "e9",
    "ea",
    "eb",
    "ec",
    "ed",
    "ee",
    "ef",
    "f0",
    "f1",
    "f2",
    "f3",
    "f4",
    "f5",
    "f6",
    "f7",
    "f8",
    "f9",
    "fa",
    "fb",
    "fc",
    "fd",
    "fe",
    "ff",
  ],
  ar = Math.PI / 180,
  Ss = 180 / Math.PI;
function mi() {
  const i = (Math.random() * 4294967295) | 0,
    t = (Math.random() * 4294967295) | 0,
    e = (Math.random() * 4294967295) | 0,
    n = (Math.random() * 4294967295) | 0;
  return (
    ce[i & 255] +
    ce[(i >> 8) & 255] +
    ce[(i >> 16) & 255] +
    ce[(i >> 24) & 255] +
    "-" +
    ce[t & 255] +
    ce[(t >> 8) & 255] +
    "-" +
    ce[((t >> 16) & 15) | 64] +
    ce[(t >> 24) & 255] +
    "-" +
    ce[(e & 63) | 128] +
    ce[(e >> 8) & 255] +
    "-" +
    ce[(e >> 16) & 255] +
    ce[(e >> 24) & 255] +
    ce[n & 255] +
    ce[(n >> 8) & 255] +
    ce[(n >> 16) & 255] +
    ce[(n >> 24) & 255]
  ).toLowerCase();
}
function pe(i, t, e) {
  return Math.max(t, Math.min(e, i));
}
function bl(i, t) {
  return ((i % t) + t) % t;
}
function or(i, t, e) {
  return (1 - e) * i + e * t;
}
function ai(i, t) {
  switch (t.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return i / 4294967295;
    case Uint16Array:
      return i / 65535;
    case Uint8Array:
      return i / 255;
    case Int32Array:
      return Math.max(i / 2147483647, -1);
    case Int16Array:
      return Math.max(i / 32767, -1);
    case Int8Array:
      return Math.max(i / 127, -1);
    default:
      throw new Error("Invalid component type.");
  }
}
function fe(i, t) {
  switch (t.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return Math.round(i * 4294967295);
    case Uint16Array:
      return Math.round(i * 65535);
    case Uint8Array:
      return Math.round(i * 255);
    case Int32Array:
      return Math.round(i * 2147483647);
    case Int16Array:
      return Math.round(i * 32767);
    case Int8Array:
      return Math.round(i * 127);
    default:
      throw new Error("Invalid component type.");
  }
}
class Yt {
  constructor(t = 0, e = 0) {
    (Yt.prototype.isVector2 = !0), (this.x = t), (this.y = e);
  }
  get width() {
    return this.x;
  }
  set width(t) {
    this.x = t;
  }
  get height() {
    return this.y;
  }
  set height(t) {
    this.y = t;
  }
  set(t, e) {
    return (this.x = t), (this.y = e), this;
  }
  setScalar(t) {
    return (this.x = t), (this.y = t), this;
  }
  setX(t) {
    return (this.x = t), this;
  }
  setY(t) {
    return (this.y = t), this;
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y);
  }
  copy(t) {
    return (this.x = t.x), (this.y = t.y), this;
  }
  add(t) {
    return (this.x += t.x), (this.y += t.y), this;
  }
  addScalar(t) {
    return (this.x += t), (this.y += t), this;
  }
  addVectors(t, e) {
    return (this.x = t.x + e.x), (this.y = t.y + e.y), this;
  }
  addScaledVector(t, e) {
    return (this.x += t.x * e), (this.y += t.y * e), this;
  }
  sub(t) {
    return (this.x -= t.x), (this.y -= t.y), this;
  }
  subScalar(t) {
    return (this.x -= t), (this.y -= t), this;
  }
  subVectors(t, e) {
    return (this.x = t.x - e.x), (this.y = t.y - e.y), this;
  }
  multiply(t) {
    return (this.x *= t.x), (this.y *= t.y), this;
  }
  multiplyScalar(t) {
    return (this.x *= t), (this.y *= t), this;
  }
  divide(t) {
    return (this.x /= t.x), (this.y /= t.y), this;
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  applyMatrix3(t) {
    const e = this.x,
      n = this.y,
      r = t.elements;
    return (
      (this.x = r[0] * e + r[3] * n + r[6]),
      (this.y = r[1] * e + r[4] * n + r[7]),
      this
    );
  }
  min(t) {
    return (
      (this.x = Math.min(this.x, t.x)), (this.y = Math.min(this.y, t.y)), this
    );
  }
  max(t) {
    return (
      (this.x = Math.max(this.x, t.x)), (this.y = Math.max(this.y, t.y)), this
    );
  }
  clamp(t, e) {
    return (
      (this.x = Math.max(t.x, Math.min(e.x, this.x))),
      (this.y = Math.max(t.y, Math.min(e.y, this.y))),
      this
    );
  }
  clampScalar(t, e) {
    return (
      (this.x = Math.max(t, Math.min(e, this.x))),
      (this.y = Math.max(t, Math.min(e, this.y))),
      this
    );
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(
      Math.max(t, Math.min(e, n))
    );
  }
  floor() {
    return (this.x = Math.floor(this.x)), (this.y = Math.floor(this.y)), this;
  }
  ceil() {
    return (this.x = Math.ceil(this.x)), (this.y = Math.ceil(this.y)), this;
  }
  round() {
    return (this.x = Math.round(this.x)), (this.y = Math.round(this.y)), this;
  }
  roundToZero() {
    return (this.x = Math.trunc(this.x)), (this.y = Math.trunc(this.y)), this;
  }
  negate() {
    return (this.x = -this.x), (this.y = -this.y), this;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y;
  }
  cross(t) {
    return this.x * t.y - this.y * t.x;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  angle() {
    return Math.atan2(-this.y, -this.x) + Math.PI;
  }
  angleTo(t) {
    const e = Math.sqrt(this.lengthSq() * t.lengthSq());
    if (e === 0) return Math.PI / 2;
    const n = this.dot(t) / e;
    return Math.acos(pe(n, -1, 1));
  }
  distanceTo(t) {
    return Math.sqrt(this.distanceToSquared(t));
  }
  distanceToSquared(t) {
    const e = this.x - t.x,
      n = this.y - t.y;
    return e * e + n * n;
  }
  manhattanDistanceTo(t) {
    return Math.abs(this.x - t.x) + Math.abs(this.y - t.y);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return (this.x += (t.x - this.x) * e), (this.y += (t.y - this.y) * e), this;
  }
  lerpVectors(t, e, n) {
    return (
      (this.x = t.x + (e.x - t.x) * n), (this.y = t.y + (e.y - t.y) * n), this
    );
  }
  equals(t) {
    return t.x === this.x && t.y === this.y;
  }
  fromArray(t, e = 0) {
    return (this.x = t[e]), (this.y = t[e + 1]), this;
  }
  toArray(t = [], e = 0) {
    return (t[e] = this.x), (t[e + 1] = this.y), t;
  }
  fromBufferAttribute(t, e) {
    return (this.x = t.getX(e)), (this.y = t.getY(e)), this;
  }
  rotateAround(t, e) {
    const n = Math.cos(e),
      r = Math.sin(e),
      s = this.x - t.x,
      a = this.y - t.y;
    return (this.x = s * n - a * r + t.x), (this.y = s * r + a * n + t.y), this;
  }
  random() {
    return (this.x = Math.random()), (this.y = Math.random()), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y;
  }
}
class Pt {
  constructor(t, e, n, r, s, a, o, l, c) {
    (Pt.prototype.isMatrix3 = !0),
      (this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1]),
      t !== void 0 && this.set(t, e, n, r, s, a, o, l, c);
  }
  set(t, e, n, r, s, a, o, l, c) {
    const u = this.elements;
    return (
      (u[0] = t),
      (u[1] = r),
      (u[2] = o),
      (u[3] = e),
      (u[4] = s),
      (u[5] = l),
      (u[6] = n),
      (u[7] = a),
      (u[8] = c),
      this
    );
  }
  identity() {
    return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this;
  }
  copy(t) {
    const e = this.elements,
      n = t.elements;
    return (
      (e[0] = n[0]),
      (e[1] = n[1]),
      (e[2] = n[2]),
      (e[3] = n[3]),
      (e[4] = n[4]),
      (e[5] = n[5]),
      (e[6] = n[6]),
      (e[7] = n[7]),
      (e[8] = n[8]),
      this
    );
  }
  extractBasis(t, e, n) {
    return (
      t.setFromMatrix3Column(this, 0),
      e.setFromMatrix3Column(this, 1),
      n.setFromMatrix3Column(this, 2),
      this
    );
  }
  setFromMatrix4(t) {
    const e = t.elements;
    return (
      this.set(e[0], e[4], e[8], e[1], e[5], e[9], e[2], e[6], e[10]), this
    );
  }
  multiply(t) {
    return this.multiplyMatrices(this, t);
  }
  premultiply(t) {
    return this.multiplyMatrices(t, this);
  }
  multiplyMatrices(t, e) {
    const n = t.elements,
      r = e.elements,
      s = this.elements,
      a = n[0],
      o = n[3],
      l = n[6],
      c = n[1],
      u = n[4],
      d = n[7],
      f = n[2],
      m = n[5],
      v = n[8],
      M = r[0],
      p = r[3],
      h = r[6],
      b = r[1],
      T = r[4],
      E = r[7],
      O = r[2],
      C = r[5],
      A = r[8];
    return (
      (s[0] = a * M + o * b + l * O),
      (s[3] = a * p + o * T + l * C),
      (s[6] = a * h + o * E + l * A),
      (s[1] = c * M + u * b + d * O),
      (s[4] = c * p + u * T + d * C),
      (s[7] = c * h + u * E + d * A),
      (s[2] = f * M + m * b + v * O),
      (s[5] = f * p + m * T + v * C),
      (s[8] = f * h + m * E + v * A),
      this
    );
  }
  multiplyScalar(t) {
    const e = this.elements;
    return (
      (e[0] *= t),
      (e[3] *= t),
      (e[6] *= t),
      (e[1] *= t),
      (e[4] *= t),
      (e[7] *= t),
      (e[2] *= t),
      (e[5] *= t),
      (e[8] *= t),
      this
    );
  }
  determinant() {
    const t = this.elements,
      e = t[0],
      n = t[1],
      r = t[2],
      s = t[3],
      a = t[4],
      o = t[5],
      l = t[6],
      c = t[7],
      u = t[8];
    return (
      e * a * u - e * o * c - n * s * u + n * o * l + r * s * c - r * a * l
    );
  }
  invert() {
    const t = this.elements,
      e = t[0],
      n = t[1],
      r = t[2],
      s = t[3],
      a = t[4],
      o = t[5],
      l = t[6],
      c = t[7],
      u = t[8],
      d = u * a - o * c,
      f = o * l - u * s,
      m = c * s - a * l,
      v = e * d + n * f + r * m;
    if (v === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const M = 1 / v;
    return (
      (t[0] = d * M),
      (t[1] = (r * c - u * n) * M),
      (t[2] = (o * n - r * a) * M),
      (t[3] = f * M),
      (t[4] = (u * e - r * l) * M),
      (t[5] = (r * s - o * e) * M),
      (t[6] = m * M),
      (t[7] = (n * l - c * e) * M),
      (t[8] = (a * e - n * s) * M),
      this
    );
  }
  transpose() {
    let t;
    const e = this.elements;
    return (
      (t = e[1]),
      (e[1] = e[3]),
      (e[3] = t),
      (t = e[2]),
      (e[2] = e[6]),
      (e[6] = t),
      (t = e[5]),
      (e[5] = e[7]),
      (e[7] = t),
      this
    );
  }
  getNormalMatrix(t) {
    return this.setFromMatrix4(t).invert().transpose();
  }
  transposeIntoArray(t) {
    const e = this.elements;
    return (
      (t[0] = e[0]),
      (t[1] = e[3]),
      (t[2] = e[6]),
      (t[3] = e[1]),
      (t[4] = e[4]),
      (t[5] = e[7]),
      (t[6] = e[2]),
      (t[7] = e[5]),
      (t[8] = e[8]),
      this
    );
  }
  setUvTransform(t, e, n, r, s, a, o) {
    const l = Math.cos(s),
      c = Math.sin(s);
    return (
      this.set(
        n * l,
        n * c,
        -n * (l * a + c * o) + a + t,
        -r * c,
        r * l,
        -r * (-c * a + l * o) + o + e,
        0,
        0,
        1
      ),
      this
    );
  }
  scale(t, e) {
    return this.premultiply(lr.makeScale(t, e)), this;
  }
  rotate(t) {
    return this.premultiply(lr.makeRotation(-t)), this;
  }
  translate(t, e) {
    return this.premultiply(lr.makeTranslation(t, e)), this;
  }
  makeTranslation(t, e) {
    return (
      t.isVector2
        ? this.set(1, 0, t.x, 0, 1, t.y, 0, 0, 1)
        : this.set(1, 0, t, 0, 1, e, 0, 0, 1),
      this
    );
  }
  makeRotation(t) {
    const e = Math.cos(t),
      n = Math.sin(t);
    return this.set(e, -n, 0, n, e, 0, 0, 0, 1), this;
  }
  makeScale(t, e) {
    return this.set(t, 0, 0, 0, e, 0, 0, 0, 1), this;
  }
  equals(t) {
    const e = this.elements,
      n = t.elements;
    for (let r = 0; r < 9; r++) if (e[r] !== n[r]) return !1;
    return !0;
  }
  fromArray(t, e = 0) {
    for (let n = 0; n < 9; n++) this.elements[n] = t[n + e];
    return this;
  }
  toArray(t = [], e = 0) {
    const n = this.elements;
    return (
      (t[e] = n[0]),
      (t[e + 1] = n[1]),
      (t[e + 2] = n[2]),
      (t[e + 3] = n[3]),
      (t[e + 4] = n[4]),
      (t[e + 5] = n[5]),
      (t[e + 6] = n[6]),
      (t[e + 7] = n[7]),
      (t[e + 8] = n[8]),
      t
    );
  }
  clone() {
    return new this.constructor().fromArray(this.elements);
  }
}
const lr = new Pt();
function so(i) {
  for (let t = i.length - 1; t >= 0; --t) if (i[t] >= 65535) return !0;
  return !1;
}
function ji(i) {
  return document.createElementNS("http://www.w3.org/1999/xhtml", i);
}
function Al() {
  const i = ji("canvas");
  return (i.style.display = "block"), i;
}
const Js = {};
function ui(i) {
  i in Js || ((Js[i] = !0), console.warn(i));
}
function Rl(i, t, e) {
  return new Promise(function (n, r) {
    function s() {
      switch (i.clientWaitSync(t, i.SYNC_FLUSH_COMMANDS_BIT, 0)) {
        case i.WAIT_FAILED:
          r();
          break;
        case i.TIMEOUT_EXPIRED:
          setTimeout(s, e);
          break;
        default:
          n();
      }
    }
    setTimeout(s, e);
  });
}
function wl(i) {
  const t = i.elements;
  (t[2] = 0.5 * t[2] + 0.5 * t[3]),
    (t[6] = 0.5 * t[6] + 0.5 * t[7]),
    (t[10] = 0.5 * t[10] + 0.5 * t[11]),
    (t[14] = 0.5 * t[14] + 0.5 * t[15]);
}
function Cl(i) {
  const t = i.elements;
  t[11] === -1
    ? ((t[10] = -t[10] - 1), (t[14] = -t[14]))
    : ((t[10] = -t[10]), (t[14] = -t[14] + 1));
}
const zt = {
  enabled: !0,
  workingColorSpace: ei,
  spaces: {},
  convert: function (i, t, e) {
    return (
      this.enabled === !1 ||
        t === e ||
        !t ||
        !e ||
        (this.spaces[t].transfer === Xt &&
          ((i.r = Ze(i.r)), (i.g = Ze(i.g)), (i.b = Ze(i.b))),
        this.spaces[t].primaries !== this.spaces[e].primaries &&
          (i.applyMatrix3(this.spaces[t].toXYZ),
          i.applyMatrix3(this.spaces[e].fromXYZ)),
        this.spaces[e].transfer === Xt &&
          ((i.r = $n(i.r)), (i.g = $n(i.g)), (i.b = $n(i.b)))),
      i
    );
  },
  fromWorkingColorSpace: function (i, t) {
    return this.convert(i, this.workingColorSpace, t);
  },
  toWorkingColorSpace: function (i, t) {
    return this.convert(i, t, this.workingColorSpace);
  },
  getPrimaries: function (i) {
    return this.spaces[i].primaries;
  },
  getTransfer: function (i) {
    return i === ln ? tr : this.spaces[i].transfer;
  },
  getLuminanceCoefficients: function (i, t = this.workingColorSpace) {
    return i.fromArray(this.spaces[t].luminanceCoefficients);
  },
  define: function (i) {
    Object.assign(this.spaces, i);
  },
  _getMatrix: function (i, t, e) {
    return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ);
  },
  _getDrawingBufferColorSpace: function (i) {
    return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace;
  },
  _getUnpackColorSpace: function (i = this.workingColorSpace) {
    return this.spaces[i].workingColorSpaceConfig.unpackColorSpace;
  },
};
function Ze(i) {
  return i < 0.04045
    ? i * 0.0773993808
    : Math.pow(i * 0.9478672986 + 0.0521327014, 2.4);
}
function $n(i) {
  return i < 0.0031308 ? i * 12.92 : 1.055 * Math.pow(i, 0.41666) - 0.055;
}
const Qs = [0.64, 0.33, 0.3, 0.6, 0.15, 0.06],
  ta = [0.2126, 0.7152, 0.0722],
  ea = [0.3127, 0.329],
  na = new Pt().set(
    0.4123908,
    0.3575843,
    0.1804808,
    0.212639,
    0.7151687,
    0.0721923,
    0.0193308,
    0.1191948,
    0.9505322
  ),
  ia = new Pt().set(
    3.2409699,
    -1.5373832,
    -0.4986108,
    -0.9692436,
    1.8759675,
    0.0415551,
    0.0556301,
    -0.203977,
    1.0569715
  );
zt.define({
  [ei]: {
    primaries: Qs,
    whitePoint: ea,
    transfer: tr,
    toXYZ: na,
    fromXYZ: ia,
    luminanceCoefficients: ta,
    workingColorSpaceConfig: { unpackColorSpace: Te },
    outputColorSpaceConfig: { drawingBufferColorSpace: Te },
  },
  [Te]: {
    primaries: Qs,
    whitePoint: ea,
    transfer: Xt,
    toXYZ: na,
    fromXYZ: ia,
    luminanceCoefficients: ta,
    outputColorSpaceConfig: { drawingBufferColorSpace: Te },
  },
});
let In;
class Pl {
  static getDataURL(t) {
    if (/^data:/i.test(t.src) || typeof HTMLCanvasElement > "u") return t.src;
    let e;
    if (t instanceof HTMLCanvasElement) e = t;
    else {
      In === void 0 && (In = ji("canvas")),
        (In.width = t.width),
        (In.height = t.height);
      const n = In.getContext("2d");
      t instanceof ImageData
        ? n.putImageData(t, 0, 0)
        : n.drawImage(t, 0, 0, t.width, t.height),
        (e = In);
    }
    return e.width > 2048 || e.height > 2048
      ? (console.warn(
          "THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",
          t
        ),
        e.toDataURL("image/jpeg", 0.6))
      : e.toDataURL("image/png");
  }
  static sRGBToLinear(t) {
    if (
      (typeof HTMLImageElement < "u" && t instanceof HTMLImageElement) ||
      (typeof HTMLCanvasElement < "u" && t instanceof HTMLCanvasElement) ||
      (typeof ImageBitmap < "u" && t instanceof ImageBitmap)
    ) {
      const e = ji("canvas");
      (e.width = t.width), (e.height = t.height);
      const n = e.getContext("2d");
      n.drawImage(t, 0, 0, t.width, t.height);
      const r = n.getImageData(0, 0, t.width, t.height),
        s = r.data;
      for (let a = 0; a < s.length; a++) s[a] = Ze(s[a] / 255) * 255;
      return n.putImageData(r, 0, 0), e;
    } else if (t.data) {
      const e = t.data.slice(0);
      for (let n = 0; n < e.length; n++)
        e instanceof Uint8Array || e instanceof Uint8ClampedArray
          ? (e[n] = Math.floor(Ze(e[n] / 255) * 255))
          : (e[n] = Ze(e[n]));
      return { data: e, width: t.width, height: t.height };
    } else
      return (
        console.warn(
          "THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."
        ),
        t
      );
  }
}
let Ll = 0;
class ao {
  constructor(t = null) {
    (this.isSource = !0),
      Object.defineProperty(this, "id", { value: Ll++ }),
      (this.uuid = mi()),
      (this.data = t),
      (this.dataReady = !0),
      (this.version = 0);
  }
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    if (!e && t.images[this.uuid] !== void 0) return t.images[this.uuid];
    const n = { uuid: this.uuid, url: "" },
      r = this.data;
    if (r !== null) {
      let s;
      if (Array.isArray(r)) {
        s = [];
        for (let a = 0, o = r.length; a < o; a++)
          r[a].isDataTexture ? s.push(cr(r[a].image)) : s.push(cr(r[a]));
      } else s = cr(r);
      n.url = s;
    }
    return e || (t.images[this.uuid] = n), n;
  }
}
function cr(i) {
  return (typeof HTMLImageElement < "u" && i instanceof HTMLImageElement) ||
    (typeof HTMLCanvasElement < "u" && i instanceof HTMLCanvasElement) ||
    (typeof ImageBitmap < "u" && i instanceof ImageBitmap)
    ? Pl.getDataURL(i)
    : i.data
    ? {
        data: Array.from(i.data),
        width: i.width,
        height: i.height,
        type: i.data.constructor.name,
      }
    : (console.warn("THREE.Texture: Unable to serialize Texture."), {});
}
let Il = 0;
class _e extends ni {
  constructor(
    t = _e.DEFAULT_IMAGE,
    e = _e.DEFAULT_MAPPING,
    n = Tn,
    r = Tn,
    s = Fe,
    a = bn,
    o = Ie,
    l = je,
    c = _e.DEFAULT_ANISOTROPY,
    u = ln
  ) {
    super(),
      (this.isTexture = !0),
      Object.defineProperty(this, "id", { value: Il++ }),
      (this.uuid = mi()),
      (this.name = ""),
      (this.source = new ao(t)),
      (this.mipmaps = []),
      (this.mapping = e),
      (this.channel = 0),
      (this.wrapS = n),
      (this.wrapT = r),
      (this.magFilter = s),
      (this.minFilter = a),
      (this.anisotropy = c),
      (this.format = o),
      (this.internalFormat = null),
      (this.type = l),
      (this.offset = new Yt(0, 0)),
      (this.repeat = new Yt(1, 1)),
      (this.center = new Yt(0, 0)),
      (this.rotation = 0),
      (this.matrixAutoUpdate = !0),
      (this.matrix = new Pt()),
      (this.generateMipmaps = !0),
      (this.premultiplyAlpha = !1),
      (this.flipY = !0),
      (this.unpackAlignment = 4),
      (this.colorSpace = u),
      (this.userData = {}),
      (this.version = 0),
      (this.onUpdate = null),
      (this.isRenderTargetTexture = !1),
      (this.pmremVersion = 0);
  }
  get image() {
    return this.source.data;
  }
  set image(t = null) {
    this.source.data = t;
  }
  updateMatrix() {
    this.matrix.setUvTransform(
      this.offset.x,
      this.offset.y,
      this.repeat.x,
      this.repeat.y,
      this.rotation,
      this.center.x,
      this.center.y
    );
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return (
      (this.name = t.name),
      (this.source = t.source),
      (this.mipmaps = t.mipmaps.slice(0)),
      (this.mapping = t.mapping),
      (this.channel = t.channel),
      (this.wrapS = t.wrapS),
      (this.wrapT = t.wrapT),
      (this.magFilter = t.magFilter),
      (this.minFilter = t.minFilter),
      (this.anisotropy = t.anisotropy),
      (this.format = t.format),
      (this.internalFormat = t.internalFormat),
      (this.type = t.type),
      this.offset.copy(t.offset),
      this.repeat.copy(t.repeat),
      this.center.copy(t.center),
      (this.rotation = t.rotation),
      (this.matrixAutoUpdate = t.matrixAutoUpdate),
      this.matrix.copy(t.matrix),
      (this.generateMipmaps = t.generateMipmaps),
      (this.premultiplyAlpha = t.premultiplyAlpha),
      (this.flipY = t.flipY),
      (this.unpackAlignment = t.unpackAlignment),
      (this.colorSpace = t.colorSpace),
      (this.userData = JSON.parse(JSON.stringify(t.userData))),
      (this.needsUpdate = !0),
      this
    );
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    if (!e && t.textures[this.uuid] !== void 0) return t.textures[this.uuid];
    const n = {
      metadata: { version: 4.6, type: "Texture", generator: "Texture.toJSON" },
      uuid: this.uuid,
      name: this.name,
      image: this.source.toJSON(t).uuid,
      mapping: this.mapping,
      channel: this.channel,
      repeat: [this.repeat.x, this.repeat.y],
      offset: [this.offset.x, this.offset.y],
      center: [this.center.x, this.center.y],
      rotation: this.rotation,
      wrap: [this.wrapS, this.wrapT],
      format: this.format,
      internalFormat: this.internalFormat,
      type: this.type,
      colorSpace: this.colorSpace,
      minFilter: this.minFilter,
      magFilter: this.magFilter,
      anisotropy: this.anisotropy,
      flipY: this.flipY,
      generateMipmaps: this.generateMipmaps,
      premultiplyAlpha: this.premultiplyAlpha,
      unpackAlignment: this.unpackAlignment,
    };
    return (
      Object.keys(this.userData).length > 0 && (n.userData = this.userData),
      e || (t.textures[this.uuid] = n),
      n
    );
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  transformUv(t) {
    if (this.mapping !== Ya) return t;
    if ((t.applyMatrix3(this.matrix), t.x < 0 || t.x > 1))
      switch (this.wrapS) {
        case Yr:
          t.x = t.x - Math.floor(t.x);
          break;
        case Tn:
          t.x = t.x < 0 ? 0 : 1;
          break;
        case $r:
          Math.abs(Math.floor(t.x) % 2) === 1
            ? (t.x = Math.ceil(t.x) - t.x)
            : (t.x = t.x - Math.floor(t.x));
          break;
      }
    if (t.y < 0 || t.y > 1)
      switch (this.wrapT) {
        case Yr:
          t.y = t.y - Math.floor(t.y);
          break;
        case Tn:
          t.y = t.y < 0 ? 0 : 1;
          break;
        case $r:
          Math.abs(Math.floor(t.y) % 2) === 1
            ? (t.y = Math.ceil(t.y) - t.y)
            : (t.y = t.y - Math.floor(t.y));
          break;
      }
    return this.flipY && (t.y = 1 - t.y), t;
  }
  set needsUpdate(t) {
    t === !0 && (this.version++, (this.source.needsUpdate = !0));
  }
  set needsPMREMUpdate(t) {
    t === !0 && this.pmremVersion++;
  }
}
_e.DEFAULT_IMAGE = null;
_e.DEFAULT_MAPPING = Ya;
_e.DEFAULT_ANISOTROPY = 1;
class ne {
  constructor(t = 0, e = 0, n = 0, r = 1) {
    (ne.prototype.isVector4 = !0),
      (this.x = t),
      (this.y = e),
      (this.z = n),
      (this.w = r);
  }
  get width() {
    return this.z;
  }
  set width(t) {
    this.z = t;
  }
  get height() {
    return this.w;
  }
  set height(t) {
    this.w = t;
  }
  set(t, e, n, r) {
    return (this.x = t), (this.y = e), (this.z = n), (this.w = r), this;
  }
  setScalar(t) {
    return (this.x = t), (this.y = t), (this.z = t), (this.w = t), this;
  }
  setX(t) {
    return (this.x = t), this;
  }
  setY(t) {
    return (this.y = t), this;
  }
  setZ(t) {
    return (this.z = t), this;
  }
  setW(t) {
    return (this.w = t), this;
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      case 2:
        this.z = e;
        break;
      case 3:
        this.w = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z, this.w);
  }
  copy(t) {
    return (
      (this.x = t.x),
      (this.y = t.y),
      (this.z = t.z),
      (this.w = t.w !== void 0 ? t.w : 1),
      this
    );
  }
  add(t) {
    return (
      (this.x += t.x), (this.y += t.y), (this.z += t.z), (this.w += t.w), this
    );
  }
  addScalar(t) {
    return (this.x += t), (this.y += t), (this.z += t), (this.w += t), this;
  }
  addVectors(t, e) {
    return (
      (this.x = t.x + e.x),
      (this.y = t.y + e.y),
      (this.z = t.z + e.z),
      (this.w = t.w + e.w),
      this
    );
  }
  addScaledVector(t, e) {
    return (
      (this.x += t.x * e),
      (this.y += t.y * e),
      (this.z += t.z * e),
      (this.w += t.w * e),
      this
    );
  }
  sub(t) {
    return (
      (this.x -= t.x), (this.y -= t.y), (this.z -= t.z), (this.w -= t.w), this
    );
  }
  subScalar(t) {
    return (this.x -= t), (this.y -= t), (this.z -= t), (this.w -= t), this;
  }
  subVectors(t, e) {
    return (
      (this.x = t.x - e.x),
      (this.y = t.y - e.y),
      (this.z = t.z - e.z),
      (this.w = t.w - e.w),
      this
    );
  }
  multiply(t) {
    return (
      (this.x *= t.x), (this.y *= t.y), (this.z *= t.z), (this.w *= t.w), this
    );
  }
  multiplyScalar(t) {
    return (this.x *= t), (this.y *= t), (this.z *= t), (this.w *= t), this;
  }
  applyMatrix4(t) {
    const e = this.x,
      n = this.y,
      r = this.z,
      s = this.w,
      a = t.elements;
    return (
      (this.x = a[0] * e + a[4] * n + a[8] * r + a[12] * s),
      (this.y = a[1] * e + a[5] * n + a[9] * r + a[13] * s),
      (this.z = a[2] * e + a[6] * n + a[10] * r + a[14] * s),
      (this.w = a[3] * e + a[7] * n + a[11] * r + a[15] * s),
      this
    );
  }
  divide(t) {
    return (
      (this.x /= t.x), (this.y /= t.y), (this.z /= t.z), (this.w /= t.w), this
    );
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  setAxisAngleFromQuaternion(t) {
    this.w = 2 * Math.acos(t.w);
    const e = Math.sqrt(1 - t.w * t.w);
    return (
      e < 1e-4
        ? ((this.x = 1), (this.y = 0), (this.z = 0))
        : ((this.x = t.x / e), (this.y = t.y / e), (this.z = t.z / e)),
      this
    );
  }
  setAxisAngleFromRotationMatrix(t) {
    let e, n, r, s;
    const l = t.elements,
      c = l[0],
      u = l[4],
      d = l[8],
      f = l[1],
      m = l[5],
      v = l[9],
      M = l[2],
      p = l[6],
      h = l[10];
    if (
      Math.abs(u - f) < 0.01 &&
      Math.abs(d - M) < 0.01 &&
      Math.abs(v - p) < 0.01
    ) {
      if (
        Math.abs(u + f) < 0.1 &&
        Math.abs(d + M) < 0.1 &&
        Math.abs(v + p) < 0.1 &&
        Math.abs(c + m + h - 3) < 0.1
      )
        return this.set(1, 0, 0, 0), this;
      e = Math.PI;
      const T = (c + 1) / 2,
        E = (m + 1) / 2,
        O = (h + 1) / 2,
        C = (u + f) / 4,
        A = (d + M) / 4,
        D = (v + p) / 4;
      return (
        T > E && T > O
          ? T < 0.01
            ? ((n = 0), (r = 0.707106781), (s = 0.707106781))
            : ((n = Math.sqrt(T)), (r = C / n), (s = A / n))
          : E > O
          ? E < 0.01
            ? ((n = 0.707106781), (r = 0), (s = 0.707106781))
            : ((r = Math.sqrt(E)), (n = C / r), (s = D / r))
          : O < 0.01
          ? ((n = 0.707106781), (r = 0.707106781), (s = 0))
          : ((s = Math.sqrt(O)), (n = A / s), (r = D / s)),
        this.set(n, r, s, e),
        this
      );
    }
    let b = Math.sqrt(
      (p - v) * (p - v) + (d - M) * (d - M) + (f - u) * (f - u)
    );
    return (
      Math.abs(b) < 0.001 && (b = 1),
      (this.x = (p - v) / b),
      (this.y = (d - M) / b),
      (this.z = (f - u) / b),
      (this.w = Math.acos((c + m + h - 1) / 2)),
      this
    );
  }
  setFromMatrixPosition(t) {
    const e = t.elements;
    return (
      (this.x = e[12]),
      (this.y = e[13]),
      (this.z = e[14]),
      (this.w = e[15]),
      this
    );
  }
  min(t) {
    return (
      (this.x = Math.min(this.x, t.x)),
      (this.y = Math.min(this.y, t.y)),
      (this.z = Math.min(this.z, t.z)),
      (this.w = Math.min(this.w, t.w)),
      this
    );
  }
  max(t) {
    return (
      (this.x = Math.max(this.x, t.x)),
      (this.y = Math.max(this.y, t.y)),
      (this.z = Math.max(this.z, t.z)),
      (this.w = Math.max(this.w, t.w)),
      this
    );
  }
  clamp(t, e) {
    return (
      (this.x = Math.max(t.x, Math.min(e.x, this.x))),
      (this.y = Math.max(t.y, Math.min(e.y, this.y))),
      (this.z = Math.max(t.z, Math.min(e.z, this.z))),
      (this.w = Math.max(t.w, Math.min(e.w, this.w))),
      this
    );
  }
  clampScalar(t, e) {
    return (
      (this.x = Math.max(t, Math.min(e, this.x))),
      (this.y = Math.max(t, Math.min(e, this.y))),
      (this.z = Math.max(t, Math.min(e, this.z))),
      (this.w = Math.max(t, Math.min(e, this.w))),
      this
    );
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(
      Math.max(t, Math.min(e, n))
    );
  }
  floor() {
    return (
      (this.x = Math.floor(this.x)),
      (this.y = Math.floor(this.y)),
      (this.z = Math.floor(this.z)),
      (this.w = Math.floor(this.w)),
      this
    );
  }
  ceil() {
    return (
      (this.x = Math.ceil(this.x)),
      (this.y = Math.ceil(this.y)),
      (this.z = Math.ceil(this.z)),
      (this.w = Math.ceil(this.w)),
      this
    );
  }
  round() {
    return (
      (this.x = Math.round(this.x)),
      (this.y = Math.round(this.y)),
      (this.z = Math.round(this.z)),
      (this.w = Math.round(this.w)),
      this
    );
  }
  roundToZero() {
    return (
      (this.x = Math.trunc(this.x)),
      (this.y = Math.trunc(this.y)),
      (this.z = Math.trunc(this.z)),
      (this.w = Math.trunc(this.w)),
      this
    );
  }
  negate() {
    return (
      (this.x = -this.x),
      (this.y = -this.y),
      (this.z = -this.z),
      (this.w = -this.w),
      this
    );
  }
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z + this.w * t.w;
  }
  lengthSq() {
    return (
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
  }
  length() {
    return Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
  }
  manhattanLength() {
    return (
      Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w)
    );
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return (
      (this.x += (t.x - this.x) * e),
      (this.y += (t.y - this.y) * e),
      (this.z += (t.z - this.z) * e),
      (this.w += (t.w - this.w) * e),
      this
    );
  }
  lerpVectors(t, e, n) {
    return (
      (this.x = t.x + (e.x - t.x) * n),
      (this.y = t.y + (e.y - t.y) * n),
      (this.z = t.z + (e.z - t.z) * n),
      (this.w = t.w + (e.w - t.w) * n),
      this
    );
  }
  equals(t) {
    return t.x === this.x && t.y === this.y && t.z === this.z && t.w === this.w;
  }
  fromArray(t, e = 0) {
    return (
      (this.x = t[e]),
      (this.y = t[e + 1]),
      (this.z = t[e + 2]),
      (this.w = t[e + 3]),
      this
    );
  }
  toArray(t = [], e = 0) {
    return (
      (t[e] = this.x),
      (t[e + 1] = this.y),
      (t[e + 2] = this.z),
      (t[e + 3] = this.w),
      t
    );
  }
  fromBufferAttribute(t, e) {
    return (
      (this.x = t.getX(e)),
      (this.y = t.getY(e)),
      (this.z = t.getZ(e)),
      (this.w = t.getW(e)),
      this
    );
  }
  random() {
    return (
      (this.x = Math.random()),
      (this.y = Math.random()),
      (this.z = Math.random()),
      (this.w = Math.random()),
      this
    );
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z, yield this.w;
  }
}
class Dl extends ni {
  constructor(t = 1, e = 1, n = {}) {
    super(),
      (this.isRenderTarget = !0),
      (this.width = t),
      (this.height = e),
      (this.depth = 1),
      (this.scissor = new ne(0, 0, t, e)),
      (this.scissorTest = !1),
      (this.viewport = new ne(0, 0, t, e));
    const r = { width: t, height: e, depth: 1 };
    n = Object.assign(
      {
        generateMipmaps: !1,
        internalFormat: null,
        minFilter: Fe,
        depthBuffer: !0,
        stencilBuffer: !1,
        resolveDepthBuffer: !0,
        resolveStencilBuffer: !0,
        depthTexture: null,
        samples: 0,
        count: 1,
      },
      n
    );
    const s = new _e(
      r,
      n.mapping,
      n.wrapS,
      n.wrapT,
      n.magFilter,
      n.minFilter,
      n.format,
      n.type,
      n.anisotropy,
      n.colorSpace
    );
    (s.flipY = !1),
      (s.generateMipmaps = n.generateMipmaps),
      (s.internalFormat = n.internalFormat),
      (this.textures = []);
    const a = n.count;
    for (let o = 0; o < a; o++)
      (this.textures[o] = s.clone()),
        (this.textures[o].isRenderTargetTexture = !0);
    (this.depthBuffer = n.depthBuffer),
      (this.stencilBuffer = n.stencilBuffer),
      (this.resolveDepthBuffer = n.resolveDepthBuffer),
      (this.resolveStencilBuffer = n.resolveStencilBuffer),
      (this.depthTexture = n.depthTexture),
      (this.samples = n.samples);
  }
  get texture() {
    return this.textures[0];
  }
  set texture(t) {
    this.textures[0] = t;
  }
  setSize(t, e, n = 1) {
    if (this.width !== t || this.height !== e || this.depth !== n) {
      (this.width = t), (this.height = e), (this.depth = n);
      for (let r = 0, s = this.textures.length; r < s; r++)
        (this.textures[r].image.width = t),
          (this.textures[r].image.height = e),
          (this.textures[r].image.depth = n);
      this.dispose();
    }
    this.viewport.set(0, 0, t, e), this.scissor.set(0, 0, t, e);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    (this.width = t.width),
      (this.height = t.height),
      (this.depth = t.depth),
      this.scissor.copy(t.scissor),
      (this.scissorTest = t.scissorTest),
      this.viewport.copy(t.viewport),
      (this.textures.length = 0);
    for (let n = 0, r = t.textures.length; n < r; n++)
      (this.textures[n] = t.textures[n].clone()),
        (this.textures[n].isRenderTargetTexture = !0);
    const e = Object.assign({}, t.texture.image);
    return (
      (this.texture.source = new ao(e)),
      (this.depthBuffer = t.depthBuffer),
      (this.stencilBuffer = t.stencilBuffer),
      (this.resolveDepthBuffer = t.resolveDepthBuffer),
      (this.resolveStencilBuffer = t.resolveStencilBuffer),
      t.depthTexture !== null && (this.depthTexture = t.depthTexture.clone()),
      (this.samples = t.samples),
      this
    );
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
class wn extends Dl {
  constructor(t = 1, e = 1, n = {}) {
    super(t, e, n), (this.isWebGLRenderTarget = !0);
  }
}
class oo extends _e {
  constructor(t = null, e = 1, n = 1, r = 1) {
    super(null),
      (this.isDataArrayTexture = !0),
      (this.image = { data: t, width: e, height: n, depth: r }),
      (this.magFilter = De),
      (this.minFilter = De),
      (this.wrapR = Tn),
      (this.generateMipmaps = !1),
      (this.flipY = !1),
      (this.unpackAlignment = 1),
      (this.layerUpdates = new Set());
  }
  addLayerUpdate(t) {
    this.layerUpdates.add(t);
  }
  clearLayerUpdates() {
    this.layerUpdates.clear();
  }
}
class Ul extends _e {
  constructor(t = null, e = 1, n = 1, r = 1) {
    super(null),
      (this.isData3DTexture = !0),
      (this.image = { data: t, width: e, height: n, depth: r }),
      (this.magFilter = De),
      (this.minFilter = De),
      (this.wrapR = Tn),
      (this.generateMipmaps = !1),
      (this.flipY = !1),
      (this.unpackAlignment = 1);
  }
}
class _i {
  constructor(t = 0, e = 0, n = 0, r = 1) {
    (this.isQuaternion = !0),
      (this._x = t),
      (this._y = e),
      (this._z = n),
      (this._w = r);
  }
  static slerpFlat(t, e, n, r, s, a, o) {
    let l = n[r + 0],
      c = n[r + 1],
      u = n[r + 2],
      d = n[r + 3];
    const f = s[a + 0],
      m = s[a + 1],
      v = s[a + 2],
      M = s[a + 3];
    if (o === 0) {
      (t[e + 0] = l), (t[e + 1] = c), (t[e + 2] = u), (t[e + 3] = d);
      return;
    }
    if (o === 1) {
      (t[e + 0] = f), (t[e + 1] = m), (t[e + 2] = v), (t[e + 3] = M);
      return;
    }
    if (d !== M || l !== f || c !== m || u !== v) {
      let p = 1 - o;
      const h = l * f + c * m + u * v + d * M,
        b = h >= 0 ? 1 : -1,
        T = 1 - h * h;
      if (T > Number.EPSILON) {
        const O = Math.sqrt(T),
          C = Math.atan2(O, h * b);
        (p = Math.sin(p * C) / O), (o = Math.sin(o * C) / O);
      }
      const E = o * b;
      if (
        ((l = l * p + f * E),
        (c = c * p + m * E),
        (u = u * p + v * E),
        (d = d * p + M * E),
        p === 1 - o)
      ) {
        const O = 1 / Math.sqrt(l * l + c * c + u * u + d * d);
        (l *= O), (c *= O), (u *= O), (d *= O);
      }
    }
    (t[e] = l), (t[e + 1] = c), (t[e + 2] = u), (t[e + 3] = d);
  }
  static multiplyQuaternionsFlat(t, e, n, r, s, a) {
    const o = n[r],
      l = n[r + 1],
      c = n[r + 2],
      u = n[r + 3],
      d = s[a],
      f = s[a + 1],
      m = s[a + 2],
      v = s[a + 3];
    return (
      (t[e] = o * v + u * d + l * m - c * f),
      (t[e + 1] = l * v + u * f + c * d - o * m),
      (t[e + 2] = c * v + u * m + o * f - l * d),
      (t[e + 3] = u * v - o * d - l * f - c * m),
      t
    );
  }
  get x() {
    return this._x;
  }
  set x(t) {
    (this._x = t), this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(t) {
    (this._y = t), this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(t) {
    (this._z = t), this._onChangeCallback();
  }
  get w() {
    return this._w;
  }
  set w(t) {
    (this._w = t), this._onChangeCallback();
  }
  set(t, e, n, r) {
    return (
      (this._x = t),
      (this._y = e),
      (this._z = n),
      (this._w = r),
      this._onChangeCallback(),
      this
    );
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._w);
  }
  copy(t) {
    return (
      (this._x = t.x),
      (this._y = t.y),
      (this._z = t.z),
      (this._w = t.w),
      this._onChangeCallback(),
      this
    );
  }
  setFromEuler(t, e = !0) {
    const n = t._x,
      r = t._y,
      s = t._z,
      a = t._order,
      o = Math.cos,
      l = Math.sin,
      c = o(n / 2),
      u = o(r / 2),
      d = o(s / 2),
      f = l(n / 2),
      m = l(r / 2),
      v = l(s / 2);
    switch (a) {
      case "XYZ":
        (this._x = f * u * d + c * m * v),
          (this._y = c * m * d - f * u * v),
          (this._z = c * u * v + f * m * d),
          (this._w = c * u * d - f * m * v);
        break;
      case "YXZ":
        (this._x = f * u * d + c * m * v),
          (this._y = c * m * d - f * u * v),
          (this._z = c * u * v - f * m * d),
          (this._w = c * u * d + f * m * v);
        break;
      case "ZXY":
        (this._x = f * u * d - c * m * v),
          (this._y = c * m * d + f * u * v),
          (this._z = c * u * v + f * m * d),
          (this._w = c * u * d - f * m * v);
        break;
      case "ZYX":
        (this._x = f * u * d - c * m * v),
          (this._y = c * m * d + f * u * v),
          (this._z = c * u * v - f * m * d),
          (this._w = c * u * d + f * m * v);
        break;
      case "YZX":
        (this._x = f * u * d + c * m * v),
          (this._y = c * m * d + f * u * v),
          (this._z = c * u * v - f * m * d),
          (this._w = c * u * d - f * m * v);
        break;
      case "XZY":
        (this._x = f * u * d - c * m * v),
          (this._y = c * m * d - f * u * v),
          (this._z = c * u * v + f * m * d),
          (this._w = c * u * d + f * m * v);
        break;
      default:
        console.warn(
          "THREE.Quaternion: .setFromEuler() encountered an unknown order: " + a
        );
    }
    return e === !0 && this._onChangeCallback(), this;
  }
  setFromAxisAngle(t, e) {
    const n = e / 2,
      r = Math.sin(n);
    return (
      (this._x = t.x * r),
      (this._y = t.y * r),
      (this._z = t.z * r),
      (this._w = Math.cos(n)),
      this._onChangeCallback(),
      this
    );
  }
  setFromRotationMatrix(t) {
    const e = t.elements,
      n = e[0],
      r = e[4],
      s = e[8],
      a = e[1],
      o = e[5],
      l = e[9],
      c = e[2],
      u = e[6],
      d = e[10],
      f = n + o + d;
    if (f > 0) {
      const m = 0.5 / Math.sqrt(f + 1);
      (this._w = 0.25 / m),
        (this._x = (u - l) * m),
        (this._y = (s - c) * m),
        (this._z = (a - r) * m);
    } else if (n > o && n > d) {
      const m = 2 * Math.sqrt(1 + n - o - d);
      (this._w = (u - l) / m),
        (this._x = 0.25 * m),
        (this._y = (r + a) / m),
        (this._z = (s + c) / m);
    } else if (o > d) {
      const m = 2 * Math.sqrt(1 + o - n - d);
      (this._w = (s - c) / m),
        (this._x = (r + a) / m),
        (this._y = 0.25 * m),
        (this._z = (l + u) / m);
    } else {
      const m = 2 * Math.sqrt(1 + d - n - o);
      (this._w = (a - r) / m),
        (this._x = (s + c) / m),
        (this._y = (l + u) / m),
        (this._z = 0.25 * m);
    }
    return this._onChangeCallback(), this;
  }
  setFromUnitVectors(t, e) {
    let n = t.dot(e) + 1;
    return (
      n < Number.EPSILON
        ? ((n = 0),
          Math.abs(t.x) > Math.abs(t.z)
            ? ((this._x = -t.y), (this._y = t.x), (this._z = 0), (this._w = n))
            : ((this._x = 0), (this._y = -t.z), (this._z = t.y), (this._w = n)))
        : ((this._x = t.y * e.z - t.z * e.y),
          (this._y = t.z * e.x - t.x * e.z),
          (this._z = t.x * e.y - t.y * e.x),
          (this._w = n)),
      this.normalize()
    );
  }
  angleTo(t) {
    return 2 * Math.acos(Math.abs(pe(this.dot(t), -1, 1)));
  }
  rotateTowards(t, e) {
    const n = this.angleTo(t);
    if (n === 0) return this;
    const r = Math.min(1, e / n);
    return this.slerp(t, r), this;
  }
  identity() {
    return this.set(0, 0, 0, 1);
  }
  invert() {
    return this.conjugate();
  }
  conjugate() {
    return (
      (this._x *= -1),
      (this._y *= -1),
      (this._z *= -1),
      this._onChangeCallback(),
      this
    );
  }
  dot(t) {
    return this._x * t._x + this._y * t._y + this._z * t._z + this._w * t._w;
  }
  lengthSq() {
    return (
      this._x * this._x +
      this._y * this._y +
      this._z * this._z +
      this._w * this._w
    );
  }
  length() {
    return Math.sqrt(
      this._x * this._x +
        this._y * this._y +
        this._z * this._z +
        this._w * this._w
    );
  }
  normalize() {
    let t = this.length();
    return (
      t === 0
        ? ((this._x = 0), (this._y = 0), (this._z = 0), (this._w = 1))
        : ((t = 1 / t),
          (this._x = this._x * t),
          (this._y = this._y * t),
          (this._z = this._z * t),
          (this._w = this._w * t)),
      this._onChangeCallback(),
      this
    );
  }
  multiply(t) {
    return this.multiplyQuaternions(this, t);
  }
  premultiply(t) {
    return this.multiplyQuaternions(t, this);
  }
  multiplyQuaternions(t, e) {
    const n = t._x,
      r = t._y,
      s = t._z,
      a = t._w,
      o = e._x,
      l = e._y,
      c = e._z,
      u = e._w;
    return (
      (this._x = n * u + a * o + r * c - s * l),
      (this._y = r * u + a * l + s * o - n * c),
      (this._z = s * u + a * c + n * l - r * o),
      (this._w = a * u - n * o - r * l - s * c),
      this._onChangeCallback(),
      this
    );
  }
  slerp(t, e) {
    if (e === 0) return this;
    if (e === 1) return this.copy(t);
    const n = this._x,
      r = this._y,
      s = this._z,
      a = this._w;
    let o = a * t._w + n * t._x + r * t._y + s * t._z;
    if (
      (o < 0
        ? ((this._w = -t._w),
          (this._x = -t._x),
          (this._y = -t._y),
          (this._z = -t._z),
          (o = -o))
        : this.copy(t),
      o >= 1)
    )
      return (this._w = a), (this._x = n), (this._y = r), (this._z = s), this;
    const l = 1 - o * o;
    if (l <= Number.EPSILON) {
      const m = 1 - e;
      return (
        (this._w = m * a + e * this._w),
        (this._x = m * n + e * this._x),
        (this._y = m * r + e * this._y),
        (this._z = m * s + e * this._z),
        this.normalize(),
        this
      );
    }
    const c = Math.sqrt(l),
      u = Math.atan2(c, o),
      d = Math.sin((1 - e) * u) / c,
      f = Math.sin(e * u) / c;
    return (
      (this._w = a * d + this._w * f),
      (this._x = n * d + this._x * f),
      (this._y = r * d + this._y * f),
      (this._z = s * d + this._z * f),
      this._onChangeCallback(),
      this
    );
  }
  slerpQuaternions(t, e, n) {
    return this.copy(t).slerp(e, n);
  }
  random() {
    const t = 2 * Math.PI * Math.random(),
      e = 2 * Math.PI * Math.random(),
      n = Math.random(),
      r = Math.sqrt(1 - n),
      s = Math.sqrt(n);
    return this.set(
      r * Math.sin(t),
      r * Math.cos(t),
      s * Math.sin(e),
      s * Math.cos(e)
    );
  }
  equals(t) {
    return (
      t._x === this._x &&
      t._y === this._y &&
      t._z === this._z &&
      t._w === this._w
    );
  }
  fromArray(t, e = 0) {
    return (
      (this._x = t[e]),
      (this._y = t[e + 1]),
      (this._z = t[e + 2]),
      (this._w = t[e + 3]),
      this._onChangeCallback(),
      this
    );
  }
  toArray(t = [], e = 0) {
    return (
      (t[e] = this._x),
      (t[e + 1] = this._y),
      (t[e + 2] = this._z),
      (t[e + 3] = this._w),
      t
    );
  }
  fromBufferAttribute(t, e) {
    return (
      (this._x = t.getX(e)),
      (this._y = t.getY(e)),
      (this._z = t.getZ(e)),
      (this._w = t.getW(e)),
      this._onChangeCallback(),
      this
    );
  }
  toJSON() {
    return this.toArray();
  }
  _onChange(t) {
    return (this._onChangeCallback = t), this;
  }
  _onChangeCallback() {}
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._w;
  }
}
class B {
  constructor(t = 0, e = 0, n = 0) {
    (B.prototype.isVector3 = !0), (this.x = t), (this.y = e), (this.z = n);
  }
  set(t, e, n) {
    return (
      n === void 0 && (n = this.z),
      (this.x = t),
      (this.y = e),
      (this.z = n),
      this
    );
  }
  setScalar(t) {
    return (this.x = t), (this.y = t), (this.z = t), this;
  }
  setX(t) {
    return (this.x = t), this;
  }
  setY(t) {
    return (this.y = t), this;
  }
  setZ(t) {
    return (this.z = t), this;
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      case 2:
        this.z = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z);
  }
  copy(t) {
    return (this.x = t.x), (this.y = t.y), (this.z = t.z), this;
  }
  add(t) {
    return (this.x += t.x), (this.y += t.y), (this.z += t.z), this;
  }
  addScalar(t) {
    return (this.x += t), (this.y += t), (this.z += t), this;
  }
  addVectors(t, e) {
    return (
      (this.x = t.x + e.x), (this.y = t.y + e.y), (this.z = t.z + e.z), this
    );
  }
  addScaledVector(t, e) {
    return (this.x += t.x * e), (this.y += t.y * e), (this.z += t.z * e), this;
  }
  sub(t) {
    return (this.x -= t.x), (this.y -= t.y), (this.z -= t.z), this;
  }
  subScalar(t) {
    return (this.x -= t), (this.y -= t), (this.z -= t), this;
  }
  subVectors(t, e) {
    return (
      (this.x = t.x - e.x), (this.y = t.y - e.y), (this.z = t.z - e.z), this
    );
  }
  multiply(t) {
    return (this.x *= t.x), (this.y *= t.y), (this.z *= t.z), this;
  }
  multiplyScalar(t) {
    return (this.x *= t), (this.y *= t), (this.z *= t), this;
  }
  multiplyVectors(t, e) {
    return (
      (this.x = t.x * e.x), (this.y = t.y * e.y), (this.z = t.z * e.z), this
    );
  }
  applyEuler(t) {
    return this.applyQuaternion(ra.setFromEuler(t));
  }
  applyAxisAngle(t, e) {
    return this.applyQuaternion(ra.setFromAxisAngle(t, e));
  }
  applyMatrix3(t) {
    const e = this.x,
      n = this.y,
      r = this.z,
      s = t.elements;
    return (
      (this.x = s[0] * e + s[3] * n + s[6] * r),
      (this.y = s[1] * e + s[4] * n + s[7] * r),
      (this.z = s[2] * e + s[5] * n + s[8] * r),
      this
    );
  }
  applyNormalMatrix(t) {
    return this.applyMatrix3(t).normalize();
  }
  applyMatrix4(t) {
    const e = this.x,
      n = this.y,
      r = this.z,
      s = t.elements,
      a = 1 / (s[3] * e + s[7] * n + s[11] * r + s[15]);
    return (
      (this.x = (s[0] * e + s[4] * n + s[8] * r + s[12]) * a),
      (this.y = (s[1] * e + s[5] * n + s[9] * r + s[13]) * a),
      (this.z = (s[2] * e + s[6] * n + s[10] * r + s[14]) * a),
      this
    );
  }
  applyQuaternion(t) {
    const e = this.x,
      n = this.y,
      r = this.z,
      s = t.x,
      a = t.y,
      o = t.z,
      l = t.w,
      c = 2 * (a * r - o * n),
      u = 2 * (o * e - s * r),
      d = 2 * (s * n - a * e);
    return (
      (this.x = e + l * c + a * d - o * u),
      (this.y = n + l * u + o * c - s * d),
      (this.z = r + l * d + s * u - a * c),
      this
    );
  }
  project(t) {
    return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(
      t.projectionMatrix
    );
  }
  unproject(t) {
    return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(
      t.matrixWorld
    );
  }
  transformDirection(t) {
    const e = this.x,
      n = this.y,
      r = this.z,
      s = t.elements;
    return (
      (this.x = s[0] * e + s[4] * n + s[8] * r),
      (this.y = s[1] * e + s[5] * n + s[9] * r),
      (this.z = s[2] * e + s[6] * n + s[10] * r),
      this.normalize()
    );
  }
  divide(t) {
    return (this.x /= t.x), (this.y /= t.y), (this.z /= t.z), this;
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  min(t) {
    return (
      (this.x = Math.min(this.x, t.x)),
      (this.y = Math.min(this.y, t.y)),
      (this.z = Math.min(this.z, t.z)),
      this
    );
  }
  max(t) {
    return (
      (this.x = Math.max(this.x, t.x)),
      (this.y = Math.max(this.y, t.y)),
      (this.z = Math.max(this.z, t.z)),
      this
    );
  }
  clamp(t, e) {
    return (
      (this.x = Math.max(t.x, Math.min(e.x, this.x))),
      (this.y = Math.max(t.y, Math.min(e.y, this.y))),
      (this.z = Math.max(t.z, Math.min(e.z, this.z))),
      this
    );
  }
  clampScalar(t, e) {
    return (
      (this.x = Math.max(t, Math.min(e, this.x))),
      (this.y = Math.max(t, Math.min(e, this.y))),
      (this.z = Math.max(t, Math.min(e, this.z))),
      this
    );
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(
      Math.max(t, Math.min(e, n))
    );
  }
  floor() {
    return (
      (this.x = Math.floor(this.x)),
      (this.y = Math.floor(this.y)),
      (this.z = Math.floor(this.z)),
      this
    );
  }
  ceil() {
    return (
      (this.x = Math.ceil(this.x)),
      (this.y = Math.ceil(this.y)),
      (this.z = Math.ceil(this.z)),
      this
    );
  }
  round() {
    return (
      (this.x = Math.round(this.x)),
      (this.y = Math.round(this.y)),
      (this.z = Math.round(this.z)),
      this
    );
  }
  roundToZero() {
    return (
      (this.x = Math.trunc(this.x)),
      (this.y = Math.trunc(this.y)),
      (this.z = Math.trunc(this.z)),
      this
    );
  }
  negate() {
    return (this.x = -this.x), (this.y = -this.y), (this.z = -this.z), this;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return (
      (this.x += (t.x - this.x) * e),
      (this.y += (t.y - this.y) * e),
      (this.z += (t.z - this.z) * e),
      this
    );
  }
  lerpVectors(t, e, n) {
    return (
      (this.x = t.x + (e.x - t.x) * n),
      (this.y = t.y + (e.y - t.y) * n),
      (this.z = t.z + (e.z - t.z) * n),
      this
    );
  }
  cross(t) {
    return this.crossVectors(this, t);
  }
  crossVectors(t, e) {
    const n = t.x,
      r = t.y,
      s = t.z,
      a = e.x,
      o = e.y,
      l = e.z;
    return (
      (this.x = r * l - s * o),
      (this.y = s * a - n * l),
      (this.z = n * o - r * a),
      this
    );
  }
  projectOnVector(t) {
    const e = t.lengthSq();
    if (e === 0) return this.set(0, 0, 0);
    const n = t.dot(this) / e;
    return this.copy(t).multiplyScalar(n);
  }
  projectOnPlane(t) {
    return hr.copy(this).projectOnVector(t), this.sub(hr);
  }
  reflect(t) {
    return this.sub(hr.copy(t).multiplyScalar(2 * this.dot(t)));
  }
  angleTo(t) {
    const e = Math.sqrt(this.lengthSq() * t.lengthSq());
    if (e === 0) return Math.PI / 2;
    const n = this.dot(t) / e;
    return Math.acos(pe(n, -1, 1));
  }
  distanceTo(t) {
    return Math.sqrt(this.distanceToSquared(t));
  }
  distanceToSquared(t) {
    const e = this.x - t.x,
      n = this.y - t.y,
      r = this.z - t.z;
    return e * e + n * n + r * r;
  }
  manhattanDistanceTo(t) {
    return (
      Math.abs(this.x - t.x) + Math.abs(this.y - t.y) + Math.abs(this.z - t.z)
    );
  }
  setFromSpherical(t) {
    return this.setFromSphericalCoords(t.radius, t.phi, t.theta);
  }
  setFromSphericalCoords(t, e, n) {
    const r = Math.sin(e) * t;
    return (
      (this.x = r * Math.sin(n)),
      (this.y = Math.cos(e) * t),
      (this.z = r * Math.cos(n)),
      this
    );
  }
  setFromCylindrical(t) {
    return this.setFromCylindricalCoords(t.radius, t.theta, t.y);
  }
  setFromCylindricalCoords(t, e, n) {
    return (
      (this.x = t * Math.sin(e)), (this.y = n), (this.z = t * Math.cos(e)), this
    );
  }
  setFromMatrixPosition(t) {
    const e = t.elements;
    return (this.x = e[12]), (this.y = e[13]), (this.z = e[14]), this;
  }
  setFromMatrixScale(t) {
    const e = this.setFromMatrixColumn(t, 0).length(),
      n = this.setFromMatrixColumn(t, 1).length(),
      r = this.setFromMatrixColumn(t, 2).length();
    return (this.x = e), (this.y = n), (this.z = r), this;
  }
  setFromMatrixColumn(t, e) {
    return this.fromArray(t.elements, e * 4);
  }
  setFromMatrix3Column(t, e) {
    return this.fromArray(t.elements, e * 3);
  }
  setFromEuler(t) {
    return (this.x = t._x), (this.y = t._y), (this.z = t._z), this;
  }
  setFromColor(t) {
    return (this.x = t.r), (this.y = t.g), (this.z = t.b), this;
  }
  equals(t) {
    return t.x === this.x && t.y === this.y && t.z === this.z;
  }
  fromArray(t, e = 0) {
    return (this.x = t[e]), (this.y = t[e + 1]), (this.z = t[e + 2]), this;
  }
  toArray(t = [], e = 0) {
    return (t[e] = this.x), (t[e + 1] = this.y), (t[e + 2] = this.z), t;
  }
  fromBufferAttribute(t, e) {
    return (
      (this.x = t.getX(e)), (this.y = t.getY(e)), (this.z = t.getZ(e)), this
    );
  }
  random() {
    return (
      (this.x = Math.random()),
      (this.y = Math.random()),
      (this.z = Math.random()),
      this
    );
  }
  randomDirection() {
    const t = Math.random() * Math.PI * 2,
      e = Math.random() * 2 - 1,
      n = Math.sqrt(1 - e * e);
    return (
      (this.x = n * Math.cos(t)), (this.y = e), (this.z = n * Math.sin(t)), this
    );
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z;
  }
}
const hr = new B(),
  ra = new _i();
class gi {
  constructor(
    t = new B(1 / 0, 1 / 0, 1 / 0),
    e = new B(-1 / 0, -1 / 0, -1 / 0)
  ) {
    (this.isBox3 = !0), (this.min = t), (this.max = e);
  }
  set(t, e) {
    return this.min.copy(t), this.max.copy(e), this;
  }
  setFromArray(t) {
    this.makeEmpty();
    for (let e = 0, n = t.length; e < n; e += 3)
      this.expandByPoint(we.fromArray(t, e));
    return this;
  }
  setFromBufferAttribute(t) {
    this.makeEmpty();
    for (let e = 0, n = t.count; e < n; e++)
      this.expandByPoint(we.fromBufferAttribute(t, e));
    return this;
  }
  setFromPoints(t) {
    this.makeEmpty();
    for (let e = 0, n = t.length; e < n; e++) this.expandByPoint(t[e]);
    return this;
  }
  setFromCenterAndSize(t, e) {
    const n = we.copy(e).multiplyScalar(0.5);
    return this.min.copy(t).sub(n), this.max.copy(t).add(n), this;
  }
  setFromObject(t, e = !1) {
    return this.makeEmpty(), this.expandByObject(t, e);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.min.copy(t.min), this.max.copy(t.max), this;
  }
  makeEmpty() {
    return (
      (this.min.x = this.min.y = this.min.z = 1 / 0),
      (this.max.x = this.max.y = this.max.z = -1 / 0),
      this
    );
  }
  isEmpty() {
    return (
      this.max.x < this.min.x ||
      this.max.y < this.min.y ||
      this.max.z < this.min.z
    );
  }
  getCenter(t) {
    return this.isEmpty()
      ? t.set(0, 0, 0)
      : t.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  getSize(t) {
    return this.isEmpty() ? t.set(0, 0, 0) : t.subVectors(this.max, this.min);
  }
  expandByPoint(t) {
    return this.min.min(t), this.max.max(t), this;
  }
  expandByVector(t) {
    return this.min.sub(t), this.max.add(t), this;
  }
  expandByScalar(t) {
    return this.min.addScalar(-t), this.max.addScalar(t), this;
  }
  expandByObject(t, e = !1) {
    t.updateWorldMatrix(!1, !1);
    const n = t.geometry;
    if (n !== void 0) {
      const s = n.getAttribute("position");
      if (e === !0 && s !== void 0 && t.isInstancedMesh !== !0)
        for (let a = 0, o = s.count; a < o; a++)
          t.isMesh === !0
            ? t.getVertexPosition(a, we)
            : we.fromBufferAttribute(s, a),
            we.applyMatrix4(t.matrixWorld),
            this.expandByPoint(we);
      else
        t.boundingBox !== void 0
          ? (t.boundingBox === null && t.computeBoundingBox(),
            yi.copy(t.boundingBox))
          : (n.boundingBox === null && n.computeBoundingBox(),
            yi.copy(n.boundingBox)),
          yi.applyMatrix4(t.matrixWorld),
          this.union(yi);
    }
    const r = t.children;
    for (let s = 0, a = r.length; s < a; s++) this.expandByObject(r[s], e);
    return this;
  }
  containsPoint(t) {
    return (
      t.x >= this.min.x &&
      t.x <= this.max.x &&
      t.y >= this.min.y &&
      t.y <= this.max.y &&
      t.z >= this.min.z &&
      t.z <= this.max.z
    );
  }
  containsBox(t) {
    return (
      this.min.x <= t.min.x &&
      t.max.x <= this.max.x &&
      this.min.y <= t.min.y &&
      t.max.y <= this.max.y &&
      this.min.z <= t.min.z &&
      t.max.z <= this.max.z
    );
  }
  getParameter(t, e) {
    return e.set(
      (t.x - this.min.x) / (this.max.x - this.min.x),
      (t.y - this.min.y) / (this.max.y - this.min.y),
      (t.z - this.min.z) / (this.max.z - this.min.z)
    );
  }
  intersectsBox(t) {
    return (
      t.max.x >= this.min.x &&
      t.min.x <= this.max.x &&
      t.max.y >= this.min.y &&
      t.min.y <= this.max.y &&
      t.max.z >= this.min.z &&
      t.min.z <= this.max.z
    );
  }
  intersectsSphere(t) {
    return (
      this.clampPoint(t.center, we),
      we.distanceToSquared(t.center) <= t.radius * t.radius
    );
  }
  intersectsPlane(t) {
    let e, n;
    return (
      t.normal.x > 0
        ? ((e = t.normal.x * this.min.x), (n = t.normal.x * this.max.x))
        : ((e = t.normal.x * this.max.x), (n = t.normal.x * this.min.x)),
      t.normal.y > 0
        ? ((e += t.normal.y * this.min.y), (n += t.normal.y * this.max.y))
        : ((e += t.normal.y * this.max.y), (n += t.normal.y * this.min.y)),
      t.normal.z > 0
        ? ((e += t.normal.z * this.min.z), (n += t.normal.z * this.max.z))
        : ((e += t.normal.z * this.max.z), (n += t.normal.z * this.min.z)),
      e <= -t.constant && n >= -t.constant
    );
  }
  intersectsTriangle(t) {
    if (this.isEmpty()) return !1;
    this.getCenter(oi),
      Ti.subVectors(this.max, oi),
      Dn.subVectors(t.a, oi),
      Un.subVectors(t.b, oi),
      Nn.subVectors(t.c, oi),
      en.subVectors(Un, Dn),
      nn.subVectors(Nn, Un),
      pn.subVectors(Dn, Nn);
    let e = [
      0,
      -en.z,
      en.y,
      0,
      -nn.z,
      nn.y,
      0,
      -pn.z,
      pn.y,
      en.z,
      0,
      -en.x,
      nn.z,
      0,
      -nn.x,
      pn.z,
      0,
      -pn.x,
      -en.y,
      en.x,
      0,
      -nn.y,
      nn.x,
      0,
      -pn.y,
      pn.x,
      0,
    ];
    return !ur(e, Dn, Un, Nn, Ti) ||
      ((e = [1, 0, 0, 0, 1, 0, 0, 0, 1]), !ur(e, Dn, Un, Nn, Ti))
      ? !1
      : (bi.crossVectors(en, nn),
        (e = [bi.x, bi.y, bi.z]),
        ur(e, Dn, Un, Nn, Ti));
  }
  clampPoint(t, e) {
    return e.copy(t).clamp(this.min, this.max);
  }
  distanceToPoint(t) {
    return this.clampPoint(t, we).distanceTo(t);
  }
  getBoundingSphere(t) {
    return (
      this.isEmpty()
        ? t.makeEmpty()
        : (this.getCenter(t.center),
          (t.radius = this.getSize(we).length() * 0.5)),
      t
    );
  }
  intersect(t) {
    return (
      this.min.max(t.min),
      this.max.min(t.max),
      this.isEmpty() && this.makeEmpty(),
      this
    );
  }
  union(t) {
    return this.min.min(t.min), this.max.max(t.max), this;
  }
  applyMatrix4(t) {
    return this.isEmpty()
      ? this
      : (Ve[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(t),
        Ve[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(t),
        Ve[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(t),
        Ve[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(t),
        Ve[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(t),
        Ve[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(t),
        Ve[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(t),
        Ve[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(t),
        this.setFromPoints(Ve),
        this);
  }
  translate(t) {
    return this.min.add(t), this.max.add(t), this;
  }
  equals(t) {
    return t.min.equals(this.min) && t.max.equals(this.max);
  }
}
const Ve = [
    new B(),
    new B(),
    new B(),
    new B(),
    new B(),
    new B(),
    new B(),
    new B(),
  ],
  we = new B(),
  yi = new gi(),
  Dn = new B(),
  Un = new B(),
  Nn = new B(),
  en = new B(),
  nn = new B(),
  pn = new B(),
  oi = new B(),
  Ti = new B(),
  bi = new B(),
  mn = new B();
function ur(i, t, e, n, r) {
  for (let s = 0, a = i.length - 3; s <= a; s += 3) {
    mn.fromArray(i, s);
    const o =
        r.x * Math.abs(mn.x) + r.y * Math.abs(mn.y) + r.z * Math.abs(mn.z),
      l = t.dot(mn),
      c = e.dot(mn),
      u = n.dot(mn);
    if (Math.max(-Math.max(l, c, u), Math.min(l, c, u)) > o) return !1;
  }
  return !0;
}
const Nl = new gi(),
  li = new B(),
  dr = new B();
class Ps {
  constructor(t = new B(), e = -1) {
    (this.isSphere = !0), (this.center = t), (this.radius = e);
  }
  set(t, e) {
    return this.center.copy(t), (this.radius = e), this;
  }
  setFromPoints(t, e) {
    const n = this.center;
    e !== void 0 ? n.copy(e) : Nl.setFromPoints(t).getCenter(n);
    let r = 0;
    for (let s = 0, a = t.length; s < a; s++)
      r = Math.max(r, n.distanceToSquared(t[s]));
    return (this.radius = Math.sqrt(r)), this;
  }
  copy(t) {
    return this.center.copy(t.center), (this.radius = t.radius), this;
  }
  isEmpty() {
    return this.radius < 0;
  }
  makeEmpty() {
    return this.center.set(0, 0, 0), (this.radius = -1), this;
  }
  containsPoint(t) {
    return t.distanceToSquared(this.center) <= this.radius * this.radius;
  }
  distanceToPoint(t) {
    return t.distanceTo(this.center) - this.radius;
  }
  intersectsSphere(t) {
    const e = this.radius + t.radius;
    return t.center.distanceToSquared(this.center) <= e * e;
  }
  intersectsBox(t) {
    return t.intersectsSphere(this);
  }
  intersectsPlane(t) {
    return Math.abs(t.distanceToPoint(this.center)) <= this.radius;
  }
  clampPoint(t, e) {
    const n = this.center.distanceToSquared(t);
    return (
      e.copy(t),
      n > this.radius * this.radius &&
        (e.sub(this.center).normalize(),
        e.multiplyScalar(this.radius).add(this.center)),
      e
    );
  }
  getBoundingBox(t) {
    return this.isEmpty()
      ? (t.makeEmpty(), t)
      : (t.set(this.center, this.center), t.expandByScalar(this.radius), t);
  }
  applyMatrix4(t) {
    return (
      this.center.applyMatrix4(t),
      (this.radius = this.radius * t.getMaxScaleOnAxis()),
      this
    );
  }
  translate(t) {
    return this.center.add(t), this;
  }
  expandByPoint(t) {
    if (this.isEmpty()) return this.center.copy(t), (this.radius = 0), this;
    li.subVectors(t, this.center);
    const e = li.lengthSq();
    if (e > this.radius * this.radius) {
      const n = Math.sqrt(e),
        r = (n - this.radius) * 0.5;
      this.center.addScaledVector(li, r / n), (this.radius += r);
    }
    return this;
  }
  union(t) {
    return t.isEmpty()
      ? this
      : this.isEmpty()
      ? (this.copy(t), this)
      : (this.center.equals(t.center) === !0
          ? (this.radius = Math.max(this.radius, t.radius))
          : (dr.subVectors(t.center, this.center).setLength(t.radius),
            this.expandByPoint(li.copy(t.center).add(dr)),
            this.expandByPoint(li.copy(t.center).sub(dr))),
        this);
  }
  equals(t) {
    return t.center.equals(this.center) && t.radius === this.radius;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const Ge = new B(),
  fr = new B(),
  Ai = new B(),
  rn = new B(),
  pr = new B(),
  Ri = new B(),
  mr = new B();
class Fl {
  constructor(t = new B(), e = new B(0, 0, -1)) {
    (this.origin = t), (this.direction = e);
  }
  set(t, e) {
    return this.origin.copy(t), this.direction.copy(e), this;
  }
  copy(t) {
    return this.origin.copy(t.origin), this.direction.copy(t.direction), this;
  }
  at(t, e) {
    return e.copy(this.origin).addScaledVector(this.direction, t);
  }
  lookAt(t) {
    return this.direction.copy(t).sub(this.origin).normalize(), this;
  }
  recast(t) {
    return this.origin.copy(this.at(t, Ge)), this;
  }
  closestPointToPoint(t, e) {
    e.subVectors(t, this.origin);
    const n = e.dot(this.direction);
    return n < 0
      ? e.copy(this.origin)
      : e.copy(this.origin).addScaledVector(this.direction, n);
  }
  distanceToPoint(t) {
    return Math.sqrt(this.distanceSqToPoint(t));
  }
  distanceSqToPoint(t) {
    const e = Ge.subVectors(t, this.origin).dot(this.direction);
    return e < 0
      ? this.origin.distanceToSquared(t)
      : (Ge.copy(this.origin).addScaledVector(this.direction, e),
        Ge.distanceToSquared(t));
  }
  distanceSqToSegment(t, e, n, r) {
    fr.copy(t).add(e).multiplyScalar(0.5),
      Ai.copy(e).sub(t).normalize(),
      rn.copy(this.origin).sub(fr);
    const s = t.distanceTo(e) * 0.5,
      a = -this.direction.dot(Ai),
      o = rn.dot(this.direction),
      l = -rn.dot(Ai),
      c = rn.lengthSq(),
      u = Math.abs(1 - a * a);
    let d, f, m, v;
    if (u > 0)
      if (((d = a * l - o), (f = a * o - l), (v = s * u), d >= 0))
        if (f >= -v)
          if (f <= v) {
            const M = 1 / u;
            (d *= M),
              (f *= M),
              (m = d * (d + a * f + 2 * o) + f * (a * d + f + 2 * l) + c);
          } else
            (f = s),
              (d = Math.max(0, -(a * f + o))),
              (m = -d * d + f * (f + 2 * l) + c);
        else
          (f = -s),
            (d = Math.max(0, -(a * f + o))),
            (m = -d * d + f * (f + 2 * l) + c);
      else
        f <= -v
          ? ((d = Math.max(0, -(-a * s + o))),
            (f = d > 0 ? -s : Math.min(Math.max(-s, -l), s)),
            (m = -d * d + f * (f + 2 * l) + c))
          : f <= v
          ? ((d = 0),
            (f = Math.min(Math.max(-s, -l), s)),
            (m = f * (f + 2 * l) + c))
          : ((d = Math.max(0, -(a * s + o))),
            (f = d > 0 ? s : Math.min(Math.max(-s, -l), s)),
            (m = -d * d + f * (f + 2 * l) + c));
    else
      (f = a > 0 ? -s : s),
        (d = Math.max(0, -(a * f + o))),
        (m = -d * d + f * (f + 2 * l) + c);
    return (
      n && n.copy(this.origin).addScaledVector(this.direction, d),
      r && r.copy(fr).addScaledVector(Ai, f),
      m
    );
  }
  intersectSphere(t, e) {
    Ge.subVectors(t.center, this.origin);
    const n = Ge.dot(this.direction),
      r = Ge.dot(Ge) - n * n,
      s = t.radius * t.radius;
    if (r > s) return null;
    const a = Math.sqrt(s - r),
      o = n - a,
      l = n + a;
    return l < 0 ? null : o < 0 ? this.at(l, e) : this.at(o, e);
  }
  intersectsSphere(t) {
    return this.distanceSqToPoint(t.center) <= t.radius * t.radius;
  }
  distanceToPlane(t) {
    const e = t.normal.dot(this.direction);
    if (e === 0) return t.distanceToPoint(this.origin) === 0 ? 0 : null;
    const n = -(this.origin.dot(t.normal) + t.constant) / e;
    return n >= 0 ? n : null;
  }
  intersectPlane(t, e) {
    const n = this.distanceToPlane(t);
    return n === null ? null : this.at(n, e);
  }
  intersectsPlane(t) {
    const e = t.distanceToPoint(this.origin);
    return e === 0 || t.normal.dot(this.direction) * e < 0;
  }
  intersectBox(t, e) {
    let n, r, s, a, o, l;
    const c = 1 / this.direction.x,
      u = 1 / this.direction.y,
      d = 1 / this.direction.z,
      f = this.origin;
    return (
      c >= 0
        ? ((n = (t.min.x - f.x) * c), (r = (t.max.x - f.x) * c))
        : ((n = (t.max.x - f.x) * c), (r = (t.min.x - f.x) * c)),
      u >= 0
        ? ((s = (t.min.y - f.y) * u), (a = (t.max.y - f.y) * u))
        : ((s = (t.max.y - f.y) * u), (a = (t.min.y - f.y) * u)),
      n > a ||
      s > r ||
      ((s > n || isNaN(n)) && (n = s),
      (a < r || isNaN(r)) && (r = a),
      d >= 0
        ? ((o = (t.min.z - f.z) * d), (l = (t.max.z - f.z) * d))
        : ((o = (t.max.z - f.z) * d), (l = (t.min.z - f.z) * d)),
      n > l || o > r) ||
      ((o > n || n !== n) && (n = o), (l < r || r !== r) && (r = l), r < 0)
        ? null
        : this.at(n >= 0 ? n : r, e)
    );
  }
  intersectsBox(t) {
    return this.intersectBox(t, Ge) !== null;
  }
  intersectTriangle(t, e, n, r, s) {
    pr.subVectors(e, t), Ri.subVectors(n, t), mr.crossVectors(pr, Ri);
    let a = this.direction.dot(mr),
      o;
    if (a > 0) {
      if (r) return null;
      o = 1;
    } else if (a < 0) (o = -1), (a = -a);
    else return null;
    rn.subVectors(this.origin, t);
    const l = o * this.direction.dot(Ri.crossVectors(rn, Ri));
    if (l < 0) return null;
    const c = o * this.direction.dot(pr.cross(rn));
    if (c < 0 || l + c > a) return null;
    const u = -o * rn.dot(mr);
    return u < 0 ? null : this.at(u / a, s);
  }
  applyMatrix4(t) {
    return (
      this.origin.applyMatrix4(t), this.direction.transformDirection(t), this
    );
  }
  equals(t) {
    return t.origin.equals(this.origin) && t.direction.equals(this.direction);
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class re {
  constructor(t, e, n, r, s, a, o, l, c, u, d, f, m, v, M, p) {
    (re.prototype.isMatrix4 = !0),
      (this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
      t !== void 0 && this.set(t, e, n, r, s, a, o, l, c, u, d, f, m, v, M, p);
  }
  set(t, e, n, r, s, a, o, l, c, u, d, f, m, v, M, p) {
    const h = this.elements;
    return (
      (h[0] = t),
      (h[4] = e),
      (h[8] = n),
      (h[12] = r),
      (h[1] = s),
      (h[5] = a),
      (h[9] = o),
      (h[13] = l),
      (h[2] = c),
      (h[6] = u),
      (h[10] = d),
      (h[14] = f),
      (h[3] = m),
      (h[7] = v),
      (h[11] = M),
      (h[15] = p),
      this
    );
  }
  identity() {
    return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
  }
  clone() {
    return new re().fromArray(this.elements);
  }
  copy(t) {
    const e = this.elements,
      n = t.elements;
    return (
      (e[0] = n[0]),
      (e[1] = n[1]),
      (e[2] = n[2]),
      (e[3] = n[3]),
      (e[4] = n[4]),
      (e[5] = n[5]),
      (e[6] = n[6]),
      (e[7] = n[7]),
      (e[8] = n[8]),
      (e[9] = n[9]),
      (e[10] = n[10]),
      (e[11] = n[11]),
      (e[12] = n[12]),
      (e[13] = n[13]),
      (e[14] = n[14]),
      (e[15] = n[15]),
      this
    );
  }
  copyPosition(t) {
    const e = this.elements,
      n = t.elements;
    return (e[12] = n[12]), (e[13] = n[13]), (e[14] = n[14]), this;
  }
  setFromMatrix3(t) {
    const e = t.elements;
    return (
      this.set(
        e[0],
        e[3],
        e[6],
        0,
        e[1],
        e[4],
        e[7],
        0,
        e[2],
        e[5],
        e[8],
        0,
        0,
        0,
        0,
        1
      ),
      this
    );
  }
  extractBasis(t, e, n) {
    return (
      t.setFromMatrixColumn(this, 0),
      e.setFromMatrixColumn(this, 1),
      n.setFromMatrixColumn(this, 2),
      this
    );
  }
  makeBasis(t, e, n) {
    return (
      this.set(
        t.x,
        e.x,
        n.x,
        0,
        t.y,
        e.y,
        n.y,
        0,
        t.z,
        e.z,
        n.z,
        0,
        0,
        0,
        0,
        1
      ),
      this
    );
  }
  extractRotation(t) {
    const e = this.elements,
      n = t.elements,
      r = 1 / Fn.setFromMatrixColumn(t, 0).length(),
      s = 1 / Fn.setFromMatrixColumn(t, 1).length(),
      a = 1 / Fn.setFromMatrixColumn(t, 2).length();
    return (
      (e[0] = n[0] * r),
      (e[1] = n[1] * r),
      (e[2] = n[2] * r),
      (e[3] = 0),
      (e[4] = n[4] * s),
      (e[5] = n[5] * s),
      (e[6] = n[6] * s),
      (e[7] = 0),
      (e[8] = n[8] * a),
      (e[9] = n[9] * a),
      (e[10] = n[10] * a),
      (e[11] = 0),
      (e[12] = 0),
      (e[13] = 0),
      (e[14] = 0),
      (e[15] = 1),
      this
    );
  }
  makeRotationFromEuler(t) {
    const e = this.elements,
      n = t.x,
      r = t.y,
      s = t.z,
      a = Math.cos(n),
      o = Math.sin(n),
      l = Math.cos(r),
      c = Math.sin(r),
      u = Math.cos(s),
      d = Math.sin(s);
    if (t.order === "XYZ") {
      const f = a * u,
        m = a * d,
        v = o * u,
        M = o * d;
      (e[0] = l * u),
        (e[4] = -l * d),
        (e[8] = c),
        (e[1] = m + v * c),
        (e[5] = f - M * c),
        (e[9] = -o * l),
        (e[2] = M - f * c),
        (e[6] = v + m * c),
        (e[10] = a * l);
    } else if (t.order === "YXZ") {
      const f = l * u,
        m = l * d,
        v = c * u,
        M = c * d;
      (e[0] = f + M * o),
        (e[4] = v * o - m),
        (e[8] = a * c),
        (e[1] = a * d),
        (e[5] = a * u),
        (e[9] = -o),
        (e[2] = m * o - v),
        (e[6] = M + f * o),
        (e[10] = a * l);
    } else if (t.order === "ZXY") {
      const f = l * u,
        m = l * d,
        v = c * u,
        M = c * d;
      (e[0] = f - M * o),
        (e[4] = -a * d),
        (e[8] = v + m * o),
        (e[1] = m + v * o),
        (e[5] = a * u),
        (e[9] = M - f * o),
        (e[2] = -a * c),
        (e[6] = o),
        (e[10] = a * l);
    } else if (t.order === "ZYX") {
      const f = a * u,
        m = a * d,
        v = o * u,
        M = o * d;
      (e[0] = l * u),
        (e[4] = v * c - m),
        (e[8] = f * c + M),
        (e[1] = l * d),
        (e[5] = M * c + f),
        (e[9] = m * c - v),
        (e[2] = -c),
        (e[6] = o * l),
        (e[10] = a * l);
    } else if (t.order === "YZX") {
      const f = a * l,
        m = a * c,
        v = o * l,
        M = o * c;
      (e[0] = l * u),
        (e[4] = M - f * d),
        (e[8] = v * d + m),
        (e[1] = d),
        (e[5] = a * u),
        (e[9] = -o * u),
        (e[2] = -c * u),
        (e[6] = m * d + v),
        (e[10] = f - M * d);
    } else if (t.order === "XZY") {
      const f = a * l,
        m = a * c,
        v = o * l,
        M = o * c;
      (e[0] = l * u),
        (e[4] = -d),
        (e[8] = c * u),
        (e[1] = f * d + M),
        (e[5] = a * u),
        (e[9] = m * d - v),
        (e[2] = v * d - m),
        (e[6] = o * u),
        (e[10] = M * d + f);
    }
    return (
      (e[3] = 0),
      (e[7] = 0),
      (e[11] = 0),
      (e[12] = 0),
      (e[13] = 0),
      (e[14] = 0),
      (e[15] = 1),
      this
    );
  }
  makeRotationFromQuaternion(t) {
    return this.compose(Ol, t, Bl);
  }
  lookAt(t, e, n) {
    const r = this.elements;
    return (
      ve.subVectors(t, e),
      ve.lengthSq() === 0 && (ve.z = 1),
      ve.normalize(),
      sn.crossVectors(n, ve),
      sn.lengthSq() === 0 &&
        (Math.abs(n.z) === 1 ? (ve.x += 1e-4) : (ve.z += 1e-4),
        ve.normalize(),
        sn.crossVectors(n, ve)),
      sn.normalize(),
      wi.crossVectors(ve, sn),
      (r[0] = sn.x),
      (r[4] = wi.x),
      (r[8] = ve.x),
      (r[1] = sn.y),
      (r[5] = wi.y),
      (r[9] = ve.y),
      (r[2] = sn.z),
      (r[6] = wi.z),
      (r[10] = ve.z),
      this
    );
  }
  multiply(t) {
    return this.multiplyMatrices(this, t);
  }
  premultiply(t) {
    return this.multiplyMatrices(t, this);
  }
  multiplyMatrices(t, e) {
    const n = t.elements,
      r = e.elements,
      s = this.elements,
      a = n[0],
      o = n[4],
      l = n[8],
      c = n[12],
      u = n[1],
      d = n[5],
      f = n[9],
      m = n[13],
      v = n[2],
      M = n[6],
      p = n[10],
      h = n[14],
      b = n[3],
      T = n[7],
      E = n[11],
      O = n[15],
      C = r[0],
      A = r[4],
      D = r[8],
      S = r[12],
      x = r[1],
      R = r[5],
      G = r[9],
      H = r[13],
      $ = r[2],
      K = r[6],
      X = r[10],
      Z = r[14],
      z = r[3],
      et = r[7],
      ct = r[11],
      _t = r[15];
    return (
      (s[0] = a * C + o * x + l * $ + c * z),
      (s[4] = a * A + o * R + l * K + c * et),
      (s[8] = a * D + o * G + l * X + c * ct),
      (s[12] = a * S + o * H + l * Z + c * _t),
      (s[1] = u * C + d * x + f * $ + m * z),
      (s[5] = u * A + d * R + f * K + m * et),
      (s[9] = u * D + d * G + f * X + m * ct),
      (s[13] = u * S + d * H + f * Z + m * _t),
      (s[2] = v * C + M * x + p * $ + h * z),
      (s[6] = v * A + M * R + p * K + h * et),
      (s[10] = v * D + M * G + p * X + h * ct),
      (s[14] = v * S + M * H + p * Z + h * _t),
      (s[3] = b * C + T * x + E * $ + O * z),
      (s[7] = b * A + T * R + E * K + O * et),
      (s[11] = b * D + T * G + E * X + O * ct),
      (s[15] = b * S + T * H + E * Z + O * _t),
      this
    );
  }
  multiplyScalar(t) {
    const e = this.elements;
    return (
      (e[0] *= t),
      (e[4] *= t),
      (e[8] *= t),
      (e[12] *= t),
      (e[1] *= t),
      (e[5] *= t),
      (e[9] *= t),
      (e[13] *= t),
      (e[2] *= t),
      (e[6] *= t),
      (e[10] *= t),
      (e[14] *= t),
      (e[3] *= t),
      (e[7] *= t),
      (e[11] *= t),
      (e[15] *= t),
      this
    );
  }
  determinant() {
    const t = this.elements,
      e = t[0],
      n = t[4],
      r = t[8],
      s = t[12],
      a = t[1],
      o = t[5],
      l = t[9],
      c = t[13],
      u = t[2],
      d = t[6],
      f = t[10],
      m = t[14],
      v = t[3],
      M = t[7],
      p = t[11],
      h = t[15];
    return (
      v *
        (+s * l * d -
          r * c * d -
          s * o * f +
          n * c * f +
          r * o * m -
          n * l * m) +
      M *
        (+e * l * m -
          e * c * f +
          s * a * f -
          r * a * m +
          r * c * u -
          s * l * u) +
      p *
        (+e * c * d -
          e * o * m -
          s * a * d +
          n * a * m +
          s * o * u -
          n * c * u) +
      h *
        (-r * o * u - e * l * d + e * o * f + r * a * d - n * a * f + n * l * u)
    );
  }
  transpose() {
    const t = this.elements;
    let e;
    return (
      (e = t[1]),
      (t[1] = t[4]),
      (t[4] = e),
      (e = t[2]),
      (t[2] = t[8]),
      (t[8] = e),
      (e = t[6]),
      (t[6] = t[9]),
      (t[9] = e),
      (e = t[3]),
      (t[3] = t[12]),
      (t[12] = e),
      (e = t[7]),
      (t[7] = t[13]),
      (t[13] = e),
      (e = t[11]),
      (t[11] = t[14]),
      (t[14] = e),
      this
    );
  }
  setPosition(t, e, n) {
    const r = this.elements;
    return (
      t.isVector3
        ? ((r[12] = t.x), (r[13] = t.y), (r[14] = t.z))
        : ((r[12] = t), (r[13] = e), (r[14] = n)),
      this
    );
  }
  invert() {
    const t = this.elements,
      e = t[0],
      n = t[1],
      r = t[2],
      s = t[3],
      a = t[4],
      o = t[5],
      l = t[6],
      c = t[7],
      u = t[8],
      d = t[9],
      f = t[10],
      m = t[11],
      v = t[12],
      M = t[13],
      p = t[14],
      h = t[15],
      b = d * p * c - M * f * c + M * l * m - o * p * m - d * l * h + o * f * h,
      T = v * f * c - u * p * c - v * l * m + a * p * m + u * l * h - a * f * h,
      E = u * M * c - v * d * c + v * o * m - a * M * m - u * o * h + a * d * h,
      O = v * d * l - u * M * l - v * o * f + a * M * f + u * o * p - a * d * p,
      C = e * b + n * T + r * E + s * O;
    if (C === 0)
      return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const A = 1 / C;
    return (
      (t[0] = b * A),
      (t[1] =
        (M * f * s -
          d * p * s -
          M * r * m +
          n * p * m +
          d * r * h -
          n * f * h) *
        A),
      (t[2] =
        (o * p * s -
          M * l * s +
          M * r * c -
          n * p * c -
          o * r * h +
          n * l * h) *
        A),
      (t[3] =
        (d * l * s -
          o * f * s -
          d * r * c +
          n * f * c +
          o * r * m -
          n * l * m) *
        A),
      (t[4] = T * A),
      (t[5] =
        (u * p * s -
          v * f * s +
          v * r * m -
          e * p * m -
          u * r * h +
          e * f * h) *
        A),
      (t[6] =
        (v * l * s -
          a * p * s -
          v * r * c +
          e * p * c +
          a * r * h -
          e * l * h) *
        A),
      (t[7] =
        (a * f * s -
          u * l * s +
          u * r * c -
          e * f * c -
          a * r * m +
          e * l * m) *
        A),
      (t[8] = E * A),
      (t[9] =
        (v * d * s -
          u * M * s -
          v * n * m +
          e * M * m +
          u * n * h -
          e * d * h) *
        A),
      (t[10] =
        (a * M * s -
          v * o * s +
          v * n * c -
          e * M * c -
          a * n * h +
          e * o * h) *
        A),
      (t[11] =
        (u * o * s -
          a * d * s -
          u * n * c +
          e * d * c +
          a * n * m -
          e * o * m) *
        A),
      (t[12] = O * A),
      (t[13] =
        (u * M * r -
          v * d * r +
          v * n * f -
          e * M * f -
          u * n * p +
          e * d * p) *
        A),
      (t[14] =
        (v * o * r -
          a * M * r -
          v * n * l +
          e * M * l +
          a * n * p -
          e * o * p) *
        A),
      (t[15] =
        (a * d * r -
          u * o * r +
          u * n * l -
          e * d * l -
          a * n * f +
          e * o * f) *
        A),
      this
    );
  }
  scale(t) {
    const e = this.elements,
      n = t.x,
      r = t.y,
      s = t.z;
    return (
      (e[0] *= n),
      (e[4] *= r),
      (e[8] *= s),
      (e[1] *= n),
      (e[5] *= r),
      (e[9] *= s),
      (e[2] *= n),
      (e[6] *= r),
      (e[10] *= s),
      (e[3] *= n),
      (e[7] *= r),
      (e[11] *= s),
      this
    );
  }
  getMaxScaleOnAxis() {
    const t = this.elements,
      e = t[0] * t[0] + t[1] * t[1] + t[2] * t[2],
      n = t[4] * t[4] + t[5] * t[5] + t[6] * t[6],
      r = t[8] * t[8] + t[9] * t[9] + t[10] * t[10];
    return Math.sqrt(Math.max(e, n, r));
  }
  makeTranslation(t, e, n) {
    return (
      t.isVector3
        ? this.set(1, 0, 0, t.x, 0, 1, 0, t.y, 0, 0, 1, t.z, 0, 0, 0, 1)
        : this.set(1, 0, 0, t, 0, 1, 0, e, 0, 0, 1, n, 0, 0, 0, 1),
      this
    );
  }
  makeRotationX(t) {
    const e = Math.cos(t),
      n = Math.sin(t);
    return this.set(1, 0, 0, 0, 0, e, -n, 0, 0, n, e, 0, 0, 0, 0, 1), this;
  }
  makeRotationY(t) {
    const e = Math.cos(t),
      n = Math.sin(t);
    return this.set(e, 0, n, 0, 0, 1, 0, 0, -n, 0, e, 0, 0, 0, 0, 1), this;
  }
  makeRotationZ(t) {
    const e = Math.cos(t),
      n = Math.sin(t);
    return this.set(e, -n, 0, 0, n, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
  }
  makeRotationAxis(t, e) {
    const n = Math.cos(e),
      r = Math.sin(e),
      s = 1 - n,
      a = t.x,
      o = t.y,
      l = t.z,
      c = s * a,
      u = s * o;
    return (
      this.set(
        c * a + n,
        c * o - r * l,
        c * l + r * o,
        0,
        c * o + r * l,
        u * o + n,
        u * l - r * a,
        0,
        c * l - r * o,
        u * l + r * a,
        s * l * l + n,
        0,
        0,
        0,
        0,
        1
      ),
      this
    );
  }
  makeScale(t, e, n) {
    return this.set(t, 0, 0, 0, 0, e, 0, 0, 0, 0, n, 0, 0, 0, 0, 1), this;
  }
  makeShear(t, e, n, r, s, a) {
    return this.set(1, n, s, 0, t, 1, a, 0, e, r, 1, 0, 0, 0, 0, 1), this;
  }
  compose(t, e, n) {
    const r = this.elements,
      s = e._x,
      a = e._y,
      o = e._z,
      l = e._w,
      c = s + s,
      u = a + a,
      d = o + o,
      f = s * c,
      m = s * u,
      v = s * d,
      M = a * u,
      p = a * d,
      h = o * d,
      b = l * c,
      T = l * u,
      E = l * d,
      O = n.x,
      C = n.y,
      A = n.z;
    return (
      (r[0] = (1 - (M + h)) * O),
      (r[1] = (m + E) * O),
      (r[2] = (v - T) * O),
      (r[3] = 0),
      (r[4] = (m - E) * C),
      (r[5] = (1 - (f + h)) * C),
      (r[6] = (p + b) * C),
      (r[7] = 0),
      (r[8] = (v + T) * A),
      (r[9] = (p - b) * A),
      (r[10] = (1 - (f + M)) * A),
      (r[11] = 0),
      (r[12] = t.x),
      (r[13] = t.y),
      (r[14] = t.z),
      (r[15] = 1),
      this
    );
  }
  decompose(t, e, n) {
    const r = this.elements;
    let s = Fn.set(r[0], r[1], r[2]).length();
    const a = Fn.set(r[4], r[5], r[6]).length(),
      o = Fn.set(r[8], r[9], r[10]).length();
    this.determinant() < 0 && (s = -s),
      (t.x = r[12]),
      (t.y = r[13]),
      (t.z = r[14]),
      Ce.copy(this);
    const c = 1 / s,
      u = 1 / a,
      d = 1 / o;
    return (
      (Ce.elements[0] *= c),
      (Ce.elements[1] *= c),
      (Ce.elements[2] *= c),
      (Ce.elements[4] *= u),
      (Ce.elements[5] *= u),
      (Ce.elements[6] *= u),
      (Ce.elements[8] *= d),
      (Ce.elements[9] *= d),
      (Ce.elements[10] *= d),
      e.setFromRotationMatrix(Ce),
      (n.x = s),
      (n.y = a),
      (n.z = o),
      this
    );
  }
  makePerspective(t, e, n, r, s, a, o = Ke) {
    const l = this.elements,
      c = (2 * s) / (e - t),
      u = (2 * s) / (n - r),
      d = (e + t) / (e - t),
      f = (n + r) / (n - r);
    let m, v;
    if (o === Ke) (m = -(a + s) / (a - s)), (v = (-2 * a * s) / (a - s));
    else if (o === Zi) (m = -a / (a - s)), (v = (-a * s) / (a - s));
    else
      throw new Error(
        "THREE.Matrix4.makePerspective(): Invalid coordinate system: " + o
      );
    return (
      (l[0] = c),
      (l[4] = 0),
      (l[8] = d),
      (l[12] = 0),
      (l[1] = 0),
      (l[5] = u),
      (l[9] = f),
      (l[13] = 0),
      (l[2] = 0),
      (l[6] = 0),
      (l[10] = m),
      (l[14] = v),
      (l[3] = 0),
      (l[7] = 0),
      (l[11] = -1),
      (l[15] = 0),
      this
    );
  }
  makeOrthographic(t, e, n, r, s, a, o = Ke) {
    const l = this.elements,
      c = 1 / (e - t),
      u = 1 / (n - r),
      d = 1 / (a - s),
      f = (e + t) * c,
      m = (n + r) * u;
    let v, M;
    if (o === Ke) (v = (a + s) * d), (M = -2 * d);
    else if (o === Zi) (v = s * d), (M = -1 * d);
    else
      throw new Error(
        "THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + o
      );
    return (
      (l[0] = 2 * c),
      (l[4] = 0),
      (l[8] = 0),
      (l[12] = -f),
      (l[1] = 0),
      (l[5] = 2 * u),
      (l[9] = 0),
      (l[13] = -m),
      (l[2] = 0),
      (l[6] = 0),
      (l[10] = M),
      (l[14] = -v),
      (l[3] = 0),
      (l[7] = 0),
      (l[11] = 0),
      (l[15] = 1),
      this
    );
  }
  equals(t) {
    const e = this.elements,
      n = t.elements;
    for (let r = 0; r < 16; r++) if (e[r] !== n[r]) return !1;
    return !0;
  }
  fromArray(t, e = 0) {
    for (let n = 0; n < 16; n++) this.elements[n] = t[n + e];
    return this;
  }
  toArray(t = [], e = 0) {
    const n = this.elements;
    return (
      (t[e] = n[0]),
      (t[e + 1] = n[1]),
      (t[e + 2] = n[2]),
      (t[e + 3] = n[3]),
      (t[e + 4] = n[4]),
      (t[e + 5] = n[5]),
      (t[e + 6] = n[6]),
      (t[e + 7] = n[7]),
      (t[e + 8] = n[8]),
      (t[e + 9] = n[9]),
      (t[e + 10] = n[10]),
      (t[e + 11] = n[11]),
      (t[e + 12] = n[12]),
      (t[e + 13] = n[13]),
      (t[e + 14] = n[14]),
      (t[e + 15] = n[15]),
      t
    );
  }
}
const Fn = new B(),
  Ce = new re(),
  Ol = new B(0, 0, 0),
  Bl = new B(1, 1, 1),
  sn = new B(),
  wi = new B(),
  ve = new B(),
  sa = new re(),
  aa = new _i();
class Je {
  constructor(t = 0, e = 0, n = 0, r = Je.DEFAULT_ORDER) {
    (this.isEuler = !0),
      (this._x = t),
      (this._y = e),
      (this._z = n),
      (this._order = r);
  }
  get x() {
    return this._x;
  }
  set x(t) {
    (this._x = t), this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(t) {
    (this._y = t), this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(t) {
    (this._z = t), this._onChangeCallback();
  }
  get order() {
    return this._order;
  }
  set order(t) {
    (this._order = t), this._onChangeCallback();
  }
  set(t, e, n, r = this._order) {
    return (
      (this._x = t),
      (this._y = e),
      (this._z = n),
      (this._order = r),
      this._onChangeCallback(),
      this
    );
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._order);
  }
  copy(t) {
    return (
      (this._x = t._x),
      (this._y = t._y),
      (this._z = t._z),
      (this._order = t._order),
      this._onChangeCallback(),
      this
    );
  }
  setFromRotationMatrix(t, e = this._order, n = !0) {
    const r = t.elements,
      s = r[0],
      a = r[4],
      o = r[8],
      l = r[1],
      c = r[5],
      u = r[9],
      d = r[2],
      f = r[6],
      m = r[10];
    switch (e) {
      case "XYZ":
        (this._y = Math.asin(pe(o, -1, 1))),
          Math.abs(o) < 0.9999999
            ? ((this._x = Math.atan2(-u, m)), (this._z = Math.atan2(-a, s)))
            : ((this._x = Math.atan2(f, c)), (this._z = 0));
        break;
      case "YXZ":
        (this._x = Math.asin(-pe(u, -1, 1))),
          Math.abs(u) < 0.9999999
            ? ((this._y = Math.atan2(o, m)), (this._z = Math.atan2(l, c)))
            : ((this._y = Math.atan2(-d, s)), (this._z = 0));
        break;
      case "ZXY":
        (this._x = Math.asin(pe(f, -1, 1))),
          Math.abs(f) < 0.9999999
            ? ((this._y = Math.atan2(-d, m)), (this._z = Math.atan2(-a, c)))
            : ((this._y = 0), (this._z = Math.atan2(l, s)));
        break;
      case "ZYX":
        (this._y = Math.asin(-pe(d, -1, 1))),
          Math.abs(d) < 0.9999999
            ? ((this._x = Math.atan2(f, m)), (this._z = Math.atan2(l, s)))
            : ((this._x = 0), (this._z = Math.atan2(-a, c)));
        break;
      case "YZX":
        (this._z = Math.asin(pe(l, -1, 1))),
          Math.abs(l) < 0.9999999
            ? ((this._x = Math.atan2(-u, c)), (this._y = Math.atan2(-d, s)))
            : ((this._x = 0), (this._y = Math.atan2(o, m)));
        break;
      case "XZY":
        (this._z = Math.asin(-pe(a, -1, 1))),
          Math.abs(a) < 0.9999999
            ? ((this._x = Math.atan2(f, c)), (this._y = Math.atan2(o, s)))
            : ((this._x = Math.atan2(-u, m)), (this._y = 0));
        break;
      default:
        console.warn(
          "THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " +
            e
        );
    }
    return (this._order = e), n === !0 && this._onChangeCallback(), this;
  }
  setFromQuaternion(t, e, n) {
    return (
      sa.makeRotationFromQuaternion(t), this.setFromRotationMatrix(sa, e, n)
    );
  }
  setFromVector3(t, e = this._order) {
    return this.set(t.x, t.y, t.z, e);
  }
  reorder(t) {
    return aa.setFromEuler(this), this.setFromQuaternion(aa, t);
  }
  equals(t) {
    return (
      t._x === this._x &&
      t._y === this._y &&
      t._z === this._z &&
      t._order === this._order
    );
  }
  fromArray(t) {
    return (
      (this._x = t[0]),
      (this._y = t[1]),
      (this._z = t[2]),
      t[3] !== void 0 && (this._order = t[3]),
      this._onChangeCallback(),
      this
    );
  }
  toArray(t = [], e = 0) {
    return (
      (t[e] = this._x),
      (t[e + 1] = this._y),
      (t[e + 2] = this._z),
      (t[e + 3] = this._order),
      t
    );
  }
  _onChange(t) {
    return (this._onChangeCallback = t), this;
  }
  _onChangeCallback() {}
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._order;
  }
}
Je.DEFAULT_ORDER = "XYZ";
class lo {
  constructor() {
    this.mask = 1;
  }
  set(t) {
    this.mask = ((1 << t) | 0) >>> 0;
  }
  enable(t) {
    this.mask |= (1 << t) | 0;
  }
  enableAll() {
    this.mask = -1;
  }
  toggle(t) {
    this.mask ^= (1 << t) | 0;
  }
  disable(t) {
    this.mask &= ~((1 << t) | 0);
  }
  disableAll() {
    this.mask = 0;
  }
  test(t) {
    return (this.mask & t.mask) !== 0;
  }
  isEnabled(t) {
    return (this.mask & ((1 << t) | 0)) !== 0;
  }
}
let zl = 0;
const oa = new B(),
  On = new _i(),
  ke = new re(),
  Ci = new B(),
  ci = new B(),
  Hl = new B(),
  Vl = new _i(),
  la = new B(1, 0, 0),
  ca = new B(0, 1, 0),
  ha = new B(0, 0, 1),
  ua = { type: "added" },
  Gl = { type: "removed" },
  Bn = { type: "childadded", child: null },
  _r = { type: "childremoved", child: null };
class Me extends ni {
  constructor() {
    super(),
      (this.isObject3D = !0),
      Object.defineProperty(this, "id", { value: zl++ }),
      (this.uuid = mi()),
      (this.name = ""),
      (this.type = "Object3D"),
      (this.parent = null),
      (this.children = []),
      (this.up = Me.DEFAULT_UP.clone());
    const t = new B(),
      e = new Je(),
      n = new _i(),
      r = new B(1, 1, 1);
    function s() {
      n.setFromEuler(e, !1);
    }
    function a() {
      e.setFromQuaternion(n, void 0, !1);
    }
    e._onChange(s),
      n._onChange(a),
      Object.defineProperties(this, {
        position: { configurable: !0, enumerable: !0, value: t },
        rotation: { configurable: !0, enumerable: !0, value: e },
        quaternion: { configurable: !0, enumerable: !0, value: n },
        scale: { configurable: !0, enumerable: !0, value: r },
        modelViewMatrix: { value: new re() },
        normalMatrix: { value: new Pt() },
      }),
      (this.matrix = new re()),
      (this.matrixWorld = new re()),
      (this.matrixAutoUpdate = Me.DEFAULT_MATRIX_AUTO_UPDATE),
      (this.matrixWorldAutoUpdate = Me.DEFAULT_MATRIX_WORLD_AUTO_UPDATE),
      (this.matrixWorldNeedsUpdate = !1),
      (this.layers = new lo()),
      (this.visible = !0),
      (this.castShadow = !1),
      (this.receiveShadow = !1),
      (this.frustumCulled = !0),
      (this.renderOrder = 0),
      (this.animations = []),
      (this.userData = {});
  }
  onBeforeShadow() {}
  onAfterShadow() {}
  onBeforeRender() {}
  onAfterRender() {}
  applyMatrix4(t) {
    this.matrixAutoUpdate && this.updateMatrix(),
      this.matrix.premultiply(t),
      this.matrix.decompose(this.position, this.quaternion, this.scale);
  }
  applyQuaternion(t) {
    return this.quaternion.premultiply(t), this;
  }
  setRotationFromAxisAngle(t, e) {
    this.quaternion.setFromAxisAngle(t, e);
  }
  setRotationFromEuler(t) {
    this.quaternion.setFromEuler(t, !0);
  }
  setRotationFromMatrix(t) {
    this.quaternion.setFromRotationMatrix(t);
  }
  setRotationFromQuaternion(t) {
    this.quaternion.copy(t);
  }
  rotateOnAxis(t, e) {
    return On.setFromAxisAngle(t, e), this.quaternion.multiply(On), this;
  }
  rotateOnWorldAxis(t, e) {
    return On.setFromAxisAngle(t, e), this.quaternion.premultiply(On), this;
  }
  rotateX(t) {
    return this.rotateOnAxis(la, t);
  }
  rotateY(t) {
    return this.rotateOnAxis(ca, t);
  }
  rotateZ(t) {
    return this.rotateOnAxis(ha, t);
  }
  translateOnAxis(t, e) {
    return (
      oa.copy(t).applyQuaternion(this.quaternion),
      this.position.add(oa.multiplyScalar(e)),
      this
    );
  }
  translateX(t) {
    return this.translateOnAxis(la, t);
  }
  translateY(t) {
    return this.translateOnAxis(ca, t);
  }
  translateZ(t) {
    return this.translateOnAxis(ha, t);
  }
  localToWorld(t) {
    return this.updateWorldMatrix(!0, !1), t.applyMatrix4(this.matrixWorld);
  }
  worldToLocal(t) {
    return (
      this.updateWorldMatrix(!0, !1),
      t.applyMatrix4(ke.copy(this.matrixWorld).invert())
    );
  }
  lookAt(t, e, n) {
    t.isVector3 ? Ci.copy(t) : Ci.set(t, e, n);
    const r = this.parent;
    this.updateWorldMatrix(!0, !1),
      ci.setFromMatrixPosition(this.matrixWorld),
      this.isCamera || this.isLight
        ? ke.lookAt(ci, Ci, this.up)
        : ke.lookAt(Ci, ci, this.up),
      this.quaternion.setFromRotationMatrix(ke),
      r &&
        (ke.extractRotation(r.matrixWorld),
        On.setFromRotationMatrix(ke),
        this.quaternion.premultiply(On.invert()));
  }
  add(t) {
    if (arguments.length > 1) {
      for (let e = 0; e < arguments.length; e++) this.add(arguments[e]);
      return this;
    }
    return t === this
      ? (console.error(
          "THREE.Object3D.add: object can't be added as a child of itself.",
          t
        ),
        this)
      : (t && t.isObject3D
          ? (t.removeFromParent(),
            (t.parent = this),
            this.children.push(t),
            t.dispatchEvent(ua),
            (Bn.child = t),
            this.dispatchEvent(Bn),
            (Bn.child = null))
          : console.error(
              "THREE.Object3D.add: object not an instance of THREE.Object3D.",
              t
            ),
        this);
  }
  remove(t) {
    if (arguments.length > 1) {
      for (let n = 0; n < arguments.length; n++) this.remove(arguments[n]);
      return this;
    }
    const e = this.children.indexOf(t);
    return (
      e !== -1 &&
        ((t.parent = null),
        this.children.splice(e, 1),
        t.dispatchEvent(Gl),
        (_r.child = t),
        this.dispatchEvent(_r),
        (_r.child = null)),
      this
    );
  }
  removeFromParent() {
    const t = this.parent;
    return t !== null && t.remove(this), this;
  }
  clear() {
    return this.remove(...this.children);
  }
  attach(t) {
    return (
      this.updateWorldMatrix(!0, !1),
      ke.copy(this.matrixWorld).invert(),
      t.parent !== null &&
        (t.parent.updateWorldMatrix(!0, !1), ke.multiply(t.parent.matrixWorld)),
      t.applyMatrix4(ke),
      t.removeFromParent(),
      (t.parent = this),
      this.children.push(t),
      t.updateWorldMatrix(!1, !0),
      t.dispatchEvent(ua),
      (Bn.child = t),
      this.dispatchEvent(Bn),
      (Bn.child = null),
      this
    );
  }
  getObjectById(t) {
    return this.getObjectByProperty("id", t);
  }
  getObjectByName(t) {
    return this.getObjectByProperty("name", t);
  }
  getObjectByProperty(t, e) {
    if (this[t] === e) return this;
    for (let n = 0, r = this.children.length; n < r; n++) {
      const a = this.children[n].getObjectByProperty(t, e);
      if (a !== void 0) return a;
    }
  }
  getObjectsByProperty(t, e, n = []) {
    this[t] === e && n.push(this);
    const r = this.children;
    for (let s = 0, a = r.length; s < a; s++)
      r[s].getObjectsByProperty(t, e, n);
    return n;
  }
  getWorldPosition(t) {
    return (
      this.updateWorldMatrix(!0, !1), t.setFromMatrixPosition(this.matrixWorld)
    );
  }
  getWorldQuaternion(t) {
    return (
      this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(ci, t, Hl), t
    );
  }
  getWorldScale(t) {
    return (
      this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(ci, Vl, t), t
    );
  }
  getWorldDirection(t) {
    this.updateWorldMatrix(!0, !1);
    const e = this.matrixWorld.elements;
    return t.set(e[8], e[9], e[10]).normalize();
  }
  raycast() {}
  traverse(t) {
    t(this);
    const e = this.children;
    for (let n = 0, r = e.length; n < r; n++) e[n].traverse(t);
  }
  traverseVisible(t) {
    if (this.visible === !1) return;
    t(this);
    const e = this.children;
    for (let n = 0, r = e.length; n < r; n++) e[n].traverseVisible(t);
  }
  traverseAncestors(t) {
    const e = this.parent;
    e !== null && (t(e), e.traverseAncestors(t));
  }
  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale),
      (this.matrixWorldNeedsUpdate = !0);
  }
  updateMatrixWorld(t) {
    this.matrixAutoUpdate && this.updateMatrix(),
      (this.matrixWorldNeedsUpdate || t) &&
        (this.matrixWorldAutoUpdate === !0 &&
          (this.parent === null
            ? this.matrixWorld.copy(this.matrix)
            : this.matrixWorld.multiplyMatrices(
                this.parent.matrixWorld,
                this.matrix
              )),
        (this.matrixWorldNeedsUpdate = !1),
        (t = !0));
    const e = this.children;
    for (let n = 0, r = e.length; n < r; n++) e[n].updateMatrixWorld(t);
  }
  updateWorldMatrix(t, e) {
    const n = this.parent;
    if (
      (t === !0 && n !== null && n.updateWorldMatrix(!0, !1),
      this.matrixAutoUpdate && this.updateMatrix(),
      this.matrixWorldAutoUpdate === !0 &&
        (this.parent === null
          ? this.matrixWorld.copy(this.matrix)
          : this.matrixWorld.multiplyMatrices(
              this.parent.matrixWorld,
              this.matrix
            )),
      e === !0)
    ) {
      const r = this.children;
      for (let s = 0, a = r.length; s < a; s++) r[s].updateWorldMatrix(!1, !0);
    }
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string",
      n = {};
    e &&
      ((t = {
        geometries: {},
        materials: {},
        textures: {},
        images: {},
        shapes: {},
        skeletons: {},
        animations: {},
        nodes: {},
      }),
      (n.metadata = {
        version: 4.6,
        type: "Object",
        generator: "Object3D.toJSON",
      }));
    const r = {};
    (r.uuid = this.uuid),
      (r.type = this.type),
      this.name !== "" && (r.name = this.name),
      this.castShadow === !0 && (r.castShadow = !0),
      this.receiveShadow === !0 && (r.receiveShadow = !0),
      this.visible === !1 && (r.visible = !1),
      this.frustumCulled === !1 && (r.frustumCulled = !1),
      this.renderOrder !== 0 && (r.renderOrder = this.renderOrder),
      Object.keys(this.userData).length > 0 && (r.userData = this.userData),
      (r.layers = this.layers.mask),
      (r.matrix = this.matrix.toArray()),
      (r.up = this.up.toArray()),
      this.matrixAutoUpdate === !1 && (r.matrixAutoUpdate = !1),
      this.isInstancedMesh &&
        ((r.type = "InstancedMesh"),
        (r.count = this.count),
        (r.instanceMatrix = this.instanceMatrix.toJSON()),
        this.instanceColor !== null &&
          (r.instanceColor = this.instanceColor.toJSON())),
      this.isBatchedMesh &&
        ((r.type = "BatchedMesh"),
        (r.perObjectFrustumCulled = this.perObjectFrustumCulled),
        (r.sortObjects = this.sortObjects),
        (r.drawRanges = this._drawRanges),
        (r.reservedRanges = this._reservedRanges),
        (r.visibility = this._visibility),
        (r.active = this._active),
        (r.bounds = this._bounds.map((o) => ({
          boxInitialized: o.boxInitialized,
          boxMin: o.box.min.toArray(),
          boxMax: o.box.max.toArray(),
          sphereInitialized: o.sphereInitialized,
          sphereRadius: o.sphere.radius,
          sphereCenter: o.sphere.center.toArray(),
        }))),
        (r.maxInstanceCount = this._maxInstanceCount),
        (r.maxVertexCount = this._maxVertexCount),
        (r.maxIndexCount = this._maxIndexCount),
        (r.geometryInitialized = this._geometryInitialized),
        (r.geometryCount = this._geometryCount),
        (r.matricesTexture = this._matricesTexture.toJSON(t)),
        this._colorsTexture !== null &&
          (r.colorsTexture = this._colorsTexture.toJSON(t)),
        this.boundingSphere !== null &&
          (r.boundingSphere = {
            center: r.boundingSphere.center.toArray(),
            radius: r.boundingSphere.radius,
          }),
        this.boundingBox !== null &&
          (r.boundingBox = {
            min: r.boundingBox.min.toArray(),
            max: r.boundingBox.max.toArray(),
          }));
    function s(o, l) {
      return o[l.uuid] === void 0 && (o[l.uuid] = l.toJSON(t)), l.uuid;
    }
    if (this.isScene)
      this.background &&
        (this.background.isColor
          ? (r.background = this.background.toJSON())
          : this.background.isTexture &&
            (r.background = this.background.toJSON(t).uuid)),
        this.environment &&
          this.environment.isTexture &&
          this.environment.isRenderTargetTexture !== !0 &&
          (r.environment = this.environment.toJSON(t).uuid);
    else if (this.isMesh || this.isLine || this.isPoints) {
      r.geometry = s(t.geometries, this.geometry);
      const o = this.geometry.parameters;
      if (o !== void 0 && o.shapes !== void 0) {
        const l = o.shapes;
        if (Array.isArray(l))
          for (let c = 0, u = l.length; c < u; c++) {
            const d = l[c];
            s(t.shapes, d);
          }
        else s(t.shapes, l);
      }
    }
    if (
      (this.isSkinnedMesh &&
        ((r.bindMode = this.bindMode),
        (r.bindMatrix = this.bindMatrix.toArray()),
        this.skeleton !== void 0 &&
          (s(t.skeletons, this.skeleton), (r.skeleton = this.skeleton.uuid))),
      this.material !== void 0)
    )
      if (Array.isArray(this.material)) {
        const o = [];
        for (let l = 0, c = this.material.length; l < c; l++)
          o.push(s(t.materials, this.material[l]));
        r.material = o;
      } else r.material = s(t.materials, this.material);
    if (this.children.length > 0) {
      r.children = [];
      for (let o = 0; o < this.children.length; o++)
        r.children.push(this.children[o].toJSON(t).object);
    }
    if (this.animations.length > 0) {
      r.animations = [];
      for (let o = 0; o < this.animations.length; o++) {
        const l = this.animations[o];
        r.animations.push(s(t.animations, l));
      }
    }
    if (e) {
      const o = a(t.geometries),
        l = a(t.materials),
        c = a(t.textures),
        u = a(t.images),
        d = a(t.shapes),
        f = a(t.skeletons),
        m = a(t.animations),
        v = a(t.nodes);
      o.length > 0 && (n.geometries = o),
        l.length > 0 && (n.materials = l),
        c.length > 0 && (n.textures = c),
        u.length > 0 && (n.images = u),
        d.length > 0 && (n.shapes = d),
        f.length > 0 && (n.skeletons = f),
        m.length > 0 && (n.animations = m),
        v.length > 0 && (n.nodes = v);
    }
    return (n.object = r), n;
    function a(o) {
      const l = [];
      for (const c in o) {
        const u = o[c];
        delete u.metadata, l.push(u);
      }
      return l;
    }
  }
  clone(t) {
    return new this.constructor().copy(this, t);
  }
  copy(t, e = !0) {
    if (
      ((this.name = t.name),
      this.up.copy(t.up),
      this.position.copy(t.position),
      (this.rotation.order = t.rotation.order),
      this.quaternion.copy(t.quaternion),
      this.scale.copy(t.scale),
      this.matrix.copy(t.matrix),
      this.matrixWorld.copy(t.matrixWorld),
      (this.matrixAutoUpdate = t.matrixAutoUpdate),
      (this.matrixWorldAutoUpdate = t.matrixWorldAutoUpdate),
      (this.matrixWorldNeedsUpdate = t.matrixWorldNeedsUpdate),
      (this.layers.mask = t.layers.mask),
      (this.visible = t.visible),
      (this.castShadow = t.castShadow),
      (this.receiveShadow = t.receiveShadow),
      (this.frustumCulled = t.frustumCulled),
      (this.renderOrder = t.renderOrder),
      (this.animations = t.animations.slice()),
      (this.userData = JSON.parse(JSON.stringify(t.userData))),
      e === !0)
    )
      for (let n = 0; n < t.children.length; n++) {
        const r = t.children[n];
        this.add(r.clone());
      }
    return this;
  }
}
Me.DEFAULT_UP = new B(0, 1, 0);
Me.DEFAULT_MATRIX_AUTO_UPDATE = !0;
Me.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
const Pe = new B(),
  We = new B(),
  gr = new B(),
  Xe = new B(),
  zn = new B(),
  Hn = new B(),
  da = new B(),
  vr = new B(),
  xr = new B(),
  Mr = new B(),
  Sr = new ne(),
  Er = new ne(),
  yr = new ne();
class Le {
  constructor(t = new B(), e = new B(), n = new B()) {
    (this.a = t), (this.b = e), (this.c = n);
  }
  static getNormal(t, e, n, r) {
    r.subVectors(n, e), Pe.subVectors(t, e), r.cross(Pe);
    const s = r.lengthSq();
    return s > 0 ? r.multiplyScalar(1 / Math.sqrt(s)) : r.set(0, 0, 0);
  }
  static getBarycoord(t, e, n, r, s) {
    Pe.subVectors(r, e), We.subVectors(n, e), gr.subVectors(t, e);
    const a = Pe.dot(Pe),
      o = Pe.dot(We),
      l = Pe.dot(gr),
      c = We.dot(We),
      u = We.dot(gr),
      d = a * c - o * o;
    if (d === 0) return s.set(0, 0, 0), null;
    const f = 1 / d,
      m = (c * l - o * u) * f,
      v = (a * u - o * l) * f;
    return s.set(1 - m - v, v, m);
  }
  static containsPoint(t, e, n, r) {
    return this.getBarycoord(t, e, n, r, Xe) === null
      ? !1
      : Xe.x >= 0 && Xe.y >= 0 && Xe.x + Xe.y <= 1;
  }
  static getInterpolation(t, e, n, r, s, a, o, l) {
    return this.getBarycoord(t, e, n, r, Xe) === null
      ? ((l.x = 0),
        (l.y = 0),
        "z" in l && (l.z = 0),
        "w" in l && (l.w = 0),
        null)
      : (l.setScalar(0),
        l.addScaledVector(s, Xe.x),
        l.addScaledVector(a, Xe.y),
        l.addScaledVector(o, Xe.z),
        l);
  }
  static getInterpolatedAttribute(t, e, n, r, s, a) {
    return (
      Sr.setScalar(0),
      Er.setScalar(0),
      yr.setScalar(0),
      Sr.fromBufferAttribute(t, e),
      Er.fromBufferAttribute(t, n),
      yr.fromBufferAttribute(t, r),
      a.setScalar(0),
      a.addScaledVector(Sr, s.x),
      a.addScaledVector(Er, s.y),
      a.addScaledVector(yr, s.z),
      a
    );
  }
  static isFrontFacing(t, e, n, r) {
    return Pe.subVectors(n, e), We.subVectors(t, e), Pe.cross(We).dot(r) < 0;
  }
  set(t, e, n) {
    return this.a.copy(t), this.b.copy(e), this.c.copy(n), this;
  }
  setFromPointsAndIndices(t, e, n, r) {
    return this.a.copy(t[e]), this.b.copy(t[n]), this.c.copy(t[r]), this;
  }
  setFromAttributeAndIndices(t, e, n, r) {
    return (
      this.a.fromBufferAttribute(t, e),
      this.b.fromBufferAttribute(t, n),
      this.c.fromBufferAttribute(t, r),
      this
    );
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.a.copy(t.a), this.b.copy(t.b), this.c.copy(t.c), this;
  }
  getArea() {
    return (
      Pe.subVectors(this.c, this.b),
      We.subVectors(this.a, this.b),
      Pe.cross(We).length() * 0.5
    );
  }
  getMidpoint(t) {
    return t
      .addVectors(this.a, this.b)
      .add(this.c)
      .multiplyScalar(1 / 3);
  }
  getNormal(t) {
    return Le.getNormal(this.a, this.b, this.c, t);
  }
  getPlane(t) {
    return t.setFromCoplanarPoints(this.a, this.b, this.c);
  }
  getBarycoord(t, e) {
    return Le.getBarycoord(t, this.a, this.b, this.c, e);
  }
  getInterpolation(t, e, n, r, s) {
    return Le.getInterpolation(t, this.a, this.b, this.c, e, n, r, s);
  }
  containsPoint(t) {
    return Le.containsPoint(t, this.a, this.b, this.c);
  }
  isFrontFacing(t) {
    return Le.isFrontFacing(this.a, this.b, this.c, t);
  }
  intersectsBox(t) {
    return t.intersectsTriangle(this);
  }
  closestPointToPoint(t, e) {
    const n = this.a,
      r = this.b,
      s = this.c;
    let a, o;
    zn.subVectors(r, n), Hn.subVectors(s, n), vr.subVectors(t, n);
    const l = zn.dot(vr),
      c = Hn.dot(vr);
    if (l <= 0 && c <= 0) return e.copy(n);
    xr.subVectors(t, r);
    const u = zn.dot(xr),
      d = Hn.dot(xr);
    if (u >= 0 && d <= u) return e.copy(r);
    const f = l * d - u * c;
    if (f <= 0 && l >= 0 && u <= 0)
      return (a = l / (l - u)), e.copy(n).addScaledVector(zn, a);
    Mr.subVectors(t, s);
    const m = zn.dot(Mr),
      v = Hn.dot(Mr);
    if (v >= 0 && m <= v) return e.copy(s);
    const M = m * c - l * v;
    if (M <= 0 && c >= 0 && v <= 0)
      return (o = c / (c - v)), e.copy(n).addScaledVector(Hn, o);
    const p = u * v - m * d;
    if (p <= 0 && d - u >= 0 && m - v >= 0)
      return (
        da.subVectors(s, r),
        (o = (d - u) / (d - u + (m - v))),
        e.copy(r).addScaledVector(da, o)
      );
    const h = 1 / (p + M + f);
    return (
      (a = M * h),
      (o = f * h),
      e.copy(n).addScaledVector(zn, a).addScaledVector(Hn, o)
    );
  }
  equals(t) {
    return t.a.equals(this.a) && t.b.equals(this.b) && t.c.equals(this.c);
  }
}
const co = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074,
  },
  an = { h: 0, s: 0, l: 0 },
  Pi = { h: 0, s: 0, l: 0 };
function Tr(i, t, e) {
  return (
    e < 0 && (e += 1),
    e > 1 && (e -= 1),
    e < 1 / 6
      ? i + (t - i) * 6 * e
      : e < 1 / 2
      ? t
      : e < 2 / 3
      ? i + (t - i) * 6 * (2 / 3 - e)
      : i
  );
}
class qt {
  constructor(t, e, n) {
    return (
      (this.isColor = !0),
      (this.r = 1),
      (this.g = 1),
      (this.b = 1),
      this.set(t, e, n)
    );
  }
  set(t, e, n) {
    if (e === void 0 && n === void 0) {
      const r = t;
      r && r.isColor
        ? this.copy(r)
        : typeof r == "number"
        ? this.setHex(r)
        : typeof r == "string" && this.setStyle(r);
    } else this.setRGB(t, e, n);
    return this;
  }
  setScalar(t) {
    return (this.r = t), (this.g = t), (this.b = t), this;
  }
  setHex(t, e = Te) {
    return (
      (t = Math.floor(t)),
      (this.r = ((t >> 16) & 255) / 255),
      (this.g = ((t >> 8) & 255) / 255),
      (this.b = (t & 255) / 255),
      zt.toWorkingColorSpace(this, e),
      this
    );
  }
  setRGB(t, e, n, r = zt.workingColorSpace) {
    return (
      (this.r = t),
      (this.g = e),
      (this.b = n),
      zt.toWorkingColorSpace(this, r),
      this
    );
  }
  setHSL(t, e, n, r = zt.workingColorSpace) {
    if (((t = bl(t, 1)), (e = pe(e, 0, 1)), (n = pe(n, 0, 1)), e === 0))
      this.r = this.g = this.b = n;
    else {
      const s = n <= 0.5 ? n * (1 + e) : n + e - n * e,
        a = 2 * n - s;
      (this.r = Tr(a, s, t + 1 / 3)),
        (this.g = Tr(a, s, t)),
        (this.b = Tr(a, s, t - 1 / 3));
    }
    return zt.toWorkingColorSpace(this, r), this;
  }
  setStyle(t, e = Te) {
    function n(s) {
      s !== void 0 &&
        parseFloat(s) < 1 &&
        console.warn(
          "THREE.Color: Alpha component of " + t + " will be ignored."
        );
    }
    let r;
    if ((r = /^(\w+)\(([^\)]*)\)/.exec(t))) {
      let s;
      const a = r[1],
        o = r[2];
      switch (a) {
        case "rgb":
        case "rgba":
          if (
            (s =
              /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
                o
              ))
          )
            return (
              n(s[4]),
              this.setRGB(
                Math.min(255, parseInt(s[1], 10)) / 255,
                Math.min(255, parseInt(s[2], 10)) / 255,
                Math.min(255, parseInt(s[3], 10)) / 255,
                e
              )
            );
          if (
            (s =
              /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
                o
              ))
          )
            return (
              n(s[4]),
              this.setRGB(
                Math.min(100, parseInt(s[1], 10)) / 100,
                Math.min(100, parseInt(s[2], 10)) / 100,
                Math.min(100, parseInt(s[3], 10)) / 100,
                e
              )
            );
          break;
        case "hsl":
        case "hsla":
          if (
            (s =
              /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
                o
              ))
          )
            return (
              n(s[4]),
              this.setHSL(
                parseFloat(s[1]) / 360,
                parseFloat(s[2]) / 100,
                parseFloat(s[3]) / 100,
                e
              )
            );
          break;
        default:
          console.warn("THREE.Color: Unknown color model " + t);
      }
    } else if ((r = /^\#([A-Fa-f\d]+)$/.exec(t))) {
      const s = r[1],
        a = s.length;
      if (a === 3)
        return this.setRGB(
          parseInt(s.charAt(0), 16) / 15,
          parseInt(s.charAt(1), 16) / 15,
          parseInt(s.charAt(2), 16) / 15,
          e
        );
      if (a === 6) return this.setHex(parseInt(s, 16), e);
      console.warn("THREE.Color: Invalid hex color " + t);
    } else if (t && t.length > 0) return this.setColorName(t, e);
    return this;
  }
  setColorName(t, e = Te) {
    const n = co[t.toLowerCase()];
    return (
      n !== void 0
        ? this.setHex(n, e)
        : console.warn("THREE.Color: Unknown color " + t),
      this
    );
  }
  clone() {
    return new this.constructor(this.r, this.g, this.b);
  }
  copy(t) {
    return (this.r = t.r), (this.g = t.g), (this.b = t.b), this;
  }
  copySRGBToLinear(t) {
    return (this.r = Ze(t.r)), (this.g = Ze(t.g)), (this.b = Ze(t.b)), this;
  }
  copyLinearToSRGB(t) {
    return (this.r = $n(t.r)), (this.g = $n(t.g)), (this.b = $n(t.b)), this;
  }
  convertSRGBToLinear() {
    return this.copySRGBToLinear(this), this;
  }
  convertLinearToSRGB() {
    return this.copyLinearToSRGB(this), this;
  }
  getHex(t = Te) {
    return (
      zt.fromWorkingColorSpace(he.copy(this), t),
      Math.round(pe(he.r * 255, 0, 255)) * 65536 +
        Math.round(pe(he.g * 255, 0, 255)) * 256 +
        Math.round(pe(he.b * 255, 0, 255))
    );
  }
  getHexString(t = Te) {
    return ("000000" + this.getHex(t).toString(16)).slice(-6);
  }
  getHSL(t, e = zt.workingColorSpace) {
    zt.fromWorkingColorSpace(he.copy(this), e);
    const n = he.r,
      r = he.g,
      s = he.b,
      a = Math.max(n, r, s),
      o = Math.min(n, r, s);
    let l, c;
    const u = (o + a) / 2;
    if (o === a) (l = 0), (c = 0);
    else {
      const d = a - o;
      switch (((c = u <= 0.5 ? d / (a + o) : d / (2 - a - o)), a)) {
        case n:
          l = (r - s) / d + (r < s ? 6 : 0);
          break;
        case r:
          l = (s - n) / d + 2;
          break;
        case s:
          l = (n - r) / d + 4;
          break;
      }
      l /= 6;
    }
    return (t.h = l), (t.s = c), (t.l = u), t;
  }
  getRGB(t, e = zt.workingColorSpace) {
    return (
      zt.fromWorkingColorSpace(he.copy(this), e),
      (t.r = he.r),
      (t.g = he.g),
      (t.b = he.b),
      t
    );
  }
  getStyle(t = Te) {
    zt.fromWorkingColorSpace(he.copy(this), t);
    const e = he.r,
      n = he.g,
      r = he.b;
    return t !== Te
      ? `color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`
      : `rgb(${Math.round(e * 255)},${Math.round(n * 255)},${Math.round(
          r * 255
        )})`;
  }
  offsetHSL(t, e, n) {
    return this.getHSL(an), this.setHSL(an.h + t, an.s + e, an.l + n);
  }
  add(t) {
    return (this.r += t.r), (this.g += t.g), (this.b += t.b), this;
  }
  addColors(t, e) {
    return (
      (this.r = t.r + e.r), (this.g = t.g + e.g), (this.b = t.b + e.b), this
    );
  }
  addScalar(t) {
    return (this.r += t), (this.g += t), (this.b += t), this;
  }
  sub(t) {
    return (
      (this.r = Math.max(0, this.r - t.r)),
      (this.g = Math.max(0, this.g - t.g)),
      (this.b = Math.max(0, this.b - t.b)),
      this
    );
  }
  multiply(t) {
    return (this.r *= t.r), (this.g *= t.g), (this.b *= t.b), this;
  }
  multiplyScalar(t) {
    return (this.r *= t), (this.g *= t), (this.b *= t), this;
  }
  lerp(t, e) {
    return (
      (this.r += (t.r - this.r) * e),
      (this.g += (t.g - this.g) * e),
      (this.b += (t.b - this.b) * e),
      this
    );
  }
  lerpColors(t, e, n) {
    return (
      (this.r = t.r + (e.r - t.r) * n),
      (this.g = t.g + (e.g - t.g) * n),
      (this.b = t.b + (e.b - t.b) * n),
      this
    );
  }
  lerpHSL(t, e) {
    this.getHSL(an), t.getHSL(Pi);
    const n = or(an.h, Pi.h, e),
      r = or(an.s, Pi.s, e),
      s = or(an.l, Pi.l, e);
    return this.setHSL(n, r, s), this;
  }
  setFromVector3(t) {
    return (this.r = t.x), (this.g = t.y), (this.b = t.z), this;
  }
  applyMatrix3(t) {
    const e = this.r,
      n = this.g,
      r = this.b,
      s = t.elements;
    return (
      (this.r = s[0] * e + s[3] * n + s[6] * r),
      (this.g = s[1] * e + s[4] * n + s[7] * r),
      (this.b = s[2] * e + s[5] * n + s[8] * r),
      this
    );
  }
  equals(t) {
    return t.r === this.r && t.g === this.g && t.b === this.b;
  }
  fromArray(t, e = 0) {
    return (this.r = t[e]), (this.g = t[e + 1]), (this.b = t[e + 2]), this;
  }
  toArray(t = [], e = 0) {
    return (t[e] = this.r), (t[e + 1] = this.g), (t[e + 2] = this.b), t;
  }
  fromBufferAttribute(t, e) {
    return (
      (this.r = t.getX(e)), (this.g = t.getY(e)), (this.b = t.getZ(e)), this
    );
  }
  toJSON() {
    return this.getHex();
  }
  *[Symbol.iterator]() {
    yield this.r, yield this.g, yield this.b;
  }
}
const he = new qt();
qt.NAMES = co;
let kl = 0;
class er extends ni {
  static get type() {
    return "Material";
  }
  get type() {
    return this.constructor.type;
  }
  set type(t) {}
  constructor() {
    super(),
      (this.isMaterial = !0),
      Object.defineProperty(this, "id", { value: kl++ }),
      (this.uuid = mi()),
      (this.name = ""),
      (this.blending = qn),
      (this.side = un),
      (this.vertexColors = !1),
      (this.opacity = 1),
      (this.transparent = !1),
      (this.alphaHash = !1),
      (this.blendSrc = Fr),
      (this.blendDst = Or),
      (this.blendEquation = En),
      (this.blendSrcAlpha = null),
      (this.blendDstAlpha = null),
      (this.blendEquationAlpha = null),
      (this.blendColor = new qt(0, 0, 0)),
      (this.blendAlpha = 0),
      (this.depthFunc = Kn),
      (this.depthTest = !0),
      (this.depthWrite = !0),
      (this.stencilWriteMask = 255),
      (this.stencilFunc = Ks),
      (this.stencilRef = 0),
      (this.stencilFuncMask = 255),
      (this.stencilFail = Ln),
      (this.stencilZFail = Ln),
      (this.stencilZPass = Ln),
      (this.stencilWrite = !1),
      (this.clippingPlanes = null),
      (this.clipIntersection = !1),
      (this.clipShadows = !1),
      (this.shadowSide = null),
      (this.colorWrite = !0),
      (this.precision = null),
      (this.polygonOffset = !1),
      (this.polygonOffsetFactor = 0),
      (this.polygonOffsetUnits = 0),
      (this.dithering = !1),
      (this.alphaToCoverage = !1),
      (this.premultipliedAlpha = !1),
      (this.forceSinglePass = !1),
      (this.visible = !0),
      (this.toneMapped = !0),
      (this.userData = {}),
      (this.version = 0),
      (this._alphaTest = 0);
  }
  get alphaTest() {
    return this._alphaTest;
  }
  set alphaTest(t) {
    this._alphaTest > 0 != t > 0 && this.version++, (this._alphaTest = t);
  }
  onBeforeRender() {}
  onBeforeCompile() {}
  customProgramCacheKey() {
    return this.onBeforeCompile.toString();
  }
  setValues(t) {
    if (t !== void 0)
      for (const e in t) {
        const n = t[e];
        if (n === void 0) {
          console.warn(
            `THREE.Material: parameter '${e}' has value of undefined.`
          );
          continue;
        }
        const r = this[e];
        if (r === void 0) {
          console.warn(
            `THREE.Material: '${e}' is not a property of THREE.${this.type}.`
          );
          continue;
        }
        r && r.isColor
          ? r.set(n)
          : r && r.isVector3 && n && n.isVector3
          ? r.copy(n)
          : (this[e] = n);
      }
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    e && (t = { textures: {}, images: {} });
    const n = {
      metadata: {
        version: 4.6,
        type: "Material",
        generator: "Material.toJSON",
      },
    };
    (n.uuid = this.uuid),
      (n.type = this.type),
      this.name !== "" && (n.name = this.name),
      this.color && this.color.isColor && (n.color = this.color.getHex()),
      this.roughness !== void 0 && (n.roughness = this.roughness),
      this.metalness !== void 0 && (n.metalness = this.metalness),
      this.sheen !== void 0 && (n.sheen = this.sheen),
      this.sheenColor &&
        this.sheenColor.isColor &&
        (n.sheenColor = this.sheenColor.getHex()),
      this.sheenRoughness !== void 0 &&
        (n.sheenRoughness = this.sheenRoughness),
      this.emissive &&
        this.emissive.isColor &&
        (n.emissive = this.emissive.getHex()),
      this.emissiveIntensity !== void 0 &&
        this.emissiveIntensity !== 1 &&
        (n.emissiveIntensity = this.emissiveIntensity),
      this.specular &&
        this.specular.isColor &&
        (n.specular = this.specular.getHex()),
      this.specularIntensity !== void 0 &&
        (n.specularIntensity = this.specularIntensity),
      this.specularColor &&
        this.specularColor.isColor &&
        (n.specularColor = this.specularColor.getHex()),
      this.shininess !== void 0 && (n.shininess = this.shininess),
      this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat),
      this.clearcoatRoughness !== void 0 &&
        (n.clearcoatRoughness = this.clearcoatRoughness),
      this.clearcoatMap &&
        this.clearcoatMap.isTexture &&
        (n.clearcoatMap = this.clearcoatMap.toJSON(t).uuid),
      this.clearcoatRoughnessMap &&
        this.clearcoatRoughnessMap.isTexture &&
        (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(t).uuid),
      this.clearcoatNormalMap &&
        this.clearcoatNormalMap.isTexture &&
        ((n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(t).uuid),
        (n.clearcoatNormalScale = this.clearcoatNormalScale.toArray())),
      this.dispersion !== void 0 && (n.dispersion = this.dispersion),
      this.iridescence !== void 0 && (n.iridescence = this.iridescence),
      this.iridescenceIOR !== void 0 &&
        (n.iridescenceIOR = this.iridescenceIOR),
      this.iridescenceThicknessRange !== void 0 &&
        (n.iridescenceThicknessRange = this.iridescenceThicknessRange),
      this.iridescenceMap &&
        this.iridescenceMap.isTexture &&
        (n.iridescenceMap = this.iridescenceMap.toJSON(t).uuid),
      this.iridescenceThicknessMap &&
        this.iridescenceThicknessMap.isTexture &&
        (n.iridescenceThicknessMap =
          this.iridescenceThicknessMap.toJSON(t).uuid),
      this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy),
      this.anisotropyRotation !== void 0 &&
        (n.anisotropyRotation = this.anisotropyRotation),
      this.anisotropyMap &&
        this.anisotropyMap.isTexture &&
        (n.anisotropyMap = this.anisotropyMap.toJSON(t).uuid),
      this.map && this.map.isTexture && (n.map = this.map.toJSON(t).uuid),
      this.matcap &&
        this.matcap.isTexture &&
        (n.matcap = this.matcap.toJSON(t).uuid),
      this.alphaMap &&
        this.alphaMap.isTexture &&
        (n.alphaMap = this.alphaMap.toJSON(t).uuid),
      this.lightMap &&
        this.lightMap.isTexture &&
        ((n.lightMap = this.lightMap.toJSON(t).uuid),
        (n.lightMapIntensity = this.lightMapIntensity)),
      this.aoMap &&
        this.aoMap.isTexture &&
        ((n.aoMap = this.aoMap.toJSON(t).uuid),
        (n.aoMapIntensity = this.aoMapIntensity)),
      this.bumpMap &&
        this.bumpMap.isTexture &&
        ((n.bumpMap = this.bumpMap.toJSON(t).uuid),
        (n.bumpScale = this.bumpScale)),
      this.normalMap &&
        this.normalMap.isTexture &&
        ((n.normalMap = this.normalMap.toJSON(t).uuid),
        (n.normalMapType = this.normalMapType),
        (n.normalScale = this.normalScale.toArray())),
      this.displacementMap &&
        this.displacementMap.isTexture &&
        ((n.displacementMap = this.displacementMap.toJSON(t).uuid),
        (n.displacementScale = this.displacementScale),
        (n.displacementBias = this.displacementBias)),
      this.roughnessMap &&
        this.roughnessMap.isTexture &&
        (n.roughnessMap = this.roughnessMap.toJSON(t).uuid),
      this.metalnessMap &&
        this.metalnessMap.isTexture &&
        (n.metalnessMap = this.metalnessMap.toJSON(t).uuid),
      this.emissiveMap &&
        this.emissiveMap.isTexture &&
        (n.emissiveMap = this.emissiveMap.toJSON(t).uuid),
      this.specularMap &&
        this.specularMap.isTexture &&
        (n.specularMap = this.specularMap.toJSON(t).uuid),
      this.specularIntensityMap &&
        this.specularIntensityMap.isTexture &&
        (n.specularIntensityMap = this.specularIntensityMap.toJSON(t).uuid),
      this.specularColorMap &&
        this.specularColorMap.isTexture &&
        (n.specularColorMap = this.specularColorMap.toJSON(t).uuid),
      this.envMap &&
        this.envMap.isTexture &&
        ((n.envMap = this.envMap.toJSON(t).uuid),
        this.combine !== void 0 && (n.combine = this.combine)),
      this.envMapRotation !== void 0 &&
        (n.envMapRotation = this.envMapRotation.toArray()),
      this.envMapIntensity !== void 0 &&
        (n.envMapIntensity = this.envMapIntensity),
      this.reflectivity !== void 0 && (n.reflectivity = this.reflectivity),
      this.refractionRatio !== void 0 &&
        (n.refractionRatio = this.refractionRatio),
      this.gradientMap &&
        this.gradientMap.isTexture &&
        (n.gradientMap = this.gradientMap.toJSON(t).uuid),
      this.transmission !== void 0 && (n.transmission = this.transmission),
      this.transmissionMap &&
        this.transmissionMap.isTexture &&
        (n.transmissionMap = this.transmissionMap.toJSON(t).uuid),
      this.thickness !== void 0 && (n.thickness = this.thickness),
      this.thicknessMap &&
        this.thicknessMap.isTexture &&
        (n.thicknessMap = this.thicknessMap.toJSON(t).uuid),
      this.attenuationDistance !== void 0 &&
        this.attenuationDistance !== 1 / 0 &&
        (n.attenuationDistance = this.attenuationDistance),
      this.attenuationColor !== void 0 &&
        (n.attenuationColor = this.attenuationColor.getHex()),
      this.size !== void 0 && (n.size = this.size),
      this.shadowSide !== null && (n.shadowSide = this.shadowSide),
      this.sizeAttenuation !== void 0 &&
        (n.sizeAttenuation = this.sizeAttenuation),
      this.blending !== qn && (n.blending = this.blending),
      this.side !== un && (n.side = this.side),
      this.vertexColors === !0 && (n.vertexColors = !0),
      this.opacity < 1 && (n.opacity = this.opacity),
      this.transparent === !0 && (n.transparent = !0),
      this.blendSrc !== Fr && (n.blendSrc = this.blendSrc),
      this.blendDst !== Or && (n.blendDst = this.blendDst),
      this.blendEquation !== En && (n.blendEquation = this.blendEquation),
      this.blendSrcAlpha !== null && (n.blendSrcAlpha = this.blendSrcAlpha),
      this.blendDstAlpha !== null && (n.blendDstAlpha = this.blendDstAlpha),
      this.blendEquationAlpha !== null &&
        (n.blendEquationAlpha = this.blendEquationAlpha),
      this.blendColor &&
        this.blendColor.isColor &&
        (n.blendColor = this.blendColor.getHex()),
      this.blendAlpha !== 0 && (n.blendAlpha = this.blendAlpha),
      this.depthFunc !== Kn && (n.depthFunc = this.depthFunc),
      this.depthTest === !1 && (n.depthTest = this.depthTest),
      this.depthWrite === !1 && (n.depthWrite = this.depthWrite),
      this.colorWrite === !1 && (n.colorWrite = this.colorWrite),
      this.stencilWriteMask !== 255 &&
        (n.stencilWriteMask = this.stencilWriteMask),
      this.stencilFunc !== Ks && (n.stencilFunc = this.stencilFunc),
      this.stencilRef !== 0 && (n.stencilRef = this.stencilRef),
      this.stencilFuncMask !== 255 &&
        (n.stencilFuncMask = this.stencilFuncMask),
      this.stencilFail !== Ln && (n.stencilFail = this.stencilFail),
      this.stencilZFail !== Ln && (n.stencilZFail = this.stencilZFail),
      this.stencilZPass !== Ln && (n.stencilZPass = this.stencilZPass),
      this.stencilWrite === !0 && (n.stencilWrite = this.stencilWrite),
      this.rotation !== void 0 &&
        this.rotation !== 0 &&
        (n.rotation = this.rotation),
      this.polygonOffset === !0 && (n.polygonOffset = !0),
      this.polygonOffsetFactor !== 0 &&
        (n.polygonOffsetFactor = this.polygonOffsetFactor),
      this.polygonOffsetUnits !== 0 &&
        (n.polygonOffsetUnits = this.polygonOffsetUnits),
      this.linewidth !== void 0 &&
        this.linewidth !== 1 &&
        (n.linewidth = this.linewidth),
      this.dashSize !== void 0 && (n.dashSize = this.dashSize),
      this.gapSize !== void 0 && (n.gapSize = this.gapSize),
      this.scale !== void 0 && (n.scale = this.scale),
      this.dithering === !0 && (n.dithering = !0),
      this.alphaTest > 0 && (n.alphaTest = this.alphaTest),
      this.alphaHash === !0 && (n.alphaHash = !0),
      this.alphaToCoverage === !0 && (n.alphaToCoverage = !0),
      this.premultipliedAlpha === !0 && (n.premultipliedAlpha = !0),
      this.forceSinglePass === !0 && (n.forceSinglePass = !0),
      this.wireframe === !0 && (n.wireframe = !0),
      this.wireframeLinewidth > 1 &&
        (n.wireframeLinewidth = this.wireframeLinewidth),
      this.wireframeLinecap !== "round" &&
        (n.wireframeLinecap = this.wireframeLinecap),
      this.wireframeLinejoin !== "round" &&
        (n.wireframeLinejoin = this.wireframeLinejoin),
      this.flatShading === !0 && (n.flatShading = !0),
      this.visible === !1 && (n.visible = !1),
      this.toneMapped === !1 && (n.toneMapped = !1),
      this.fog === !1 && (n.fog = !1),
      Object.keys(this.userData).length > 0 && (n.userData = this.userData);
    function r(s) {
      const a = [];
      for (const o in s) {
        const l = s[o];
        delete l.metadata, a.push(l);
      }
      return a;
    }
    if (e) {
      const s = r(t.textures),
        a = r(t.images);
      s.length > 0 && (n.textures = s), a.length > 0 && (n.images = a);
    }
    return n;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    (this.name = t.name),
      (this.blending = t.blending),
      (this.side = t.side),
      (this.vertexColors = t.vertexColors),
      (this.opacity = t.opacity),
      (this.transparent = t.transparent),
      (this.blendSrc = t.blendSrc),
      (this.blendDst = t.blendDst),
      (this.blendEquation = t.blendEquation),
      (this.blendSrcAlpha = t.blendSrcAlpha),
      (this.blendDstAlpha = t.blendDstAlpha),
      (this.blendEquationAlpha = t.blendEquationAlpha),
      this.blendColor.copy(t.blendColor),
      (this.blendAlpha = t.blendAlpha),
      (this.depthFunc = t.depthFunc),
      (this.depthTest = t.depthTest),
      (this.depthWrite = t.depthWrite),
      (this.stencilWriteMask = t.stencilWriteMask),
      (this.stencilFunc = t.stencilFunc),
      (this.stencilRef = t.stencilRef),
      (this.stencilFuncMask = t.stencilFuncMask),
      (this.stencilFail = t.stencilFail),
      (this.stencilZFail = t.stencilZFail),
      (this.stencilZPass = t.stencilZPass),
      (this.stencilWrite = t.stencilWrite);
    const e = t.clippingPlanes;
    let n = null;
    if (e !== null) {
      const r = e.length;
      n = new Array(r);
      for (let s = 0; s !== r; ++s) n[s] = e[s].clone();
    }
    return (
      (this.clippingPlanes = n),
      (this.clipIntersection = t.clipIntersection),
      (this.clipShadows = t.clipShadows),
      (this.shadowSide = t.shadowSide),
      (this.colorWrite = t.colorWrite),
      (this.precision = t.precision),
      (this.polygonOffset = t.polygonOffset),
      (this.polygonOffsetFactor = t.polygonOffsetFactor),
      (this.polygonOffsetUnits = t.polygonOffsetUnits),
      (this.dithering = t.dithering),
      (this.alphaTest = t.alphaTest),
      (this.alphaHash = t.alphaHash),
      (this.alphaToCoverage = t.alphaToCoverage),
      (this.premultipliedAlpha = t.premultipliedAlpha),
      (this.forceSinglePass = t.forceSinglePass),
      (this.visible = t.visible),
      (this.toneMapped = t.toneMapped),
      (this.userData = JSON.parse(JSON.stringify(t.userData))),
      this
    );
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
  onBuild() {
    console.warn("Material: onBuild() has been removed.");
  }
}
class Ls extends er {
  static get type() {
    return "MeshBasicMaterial";
  }
  constructor(t) {
    super(),
      (this.isMeshBasicMaterial = !0),
      (this.color = new qt(16777215)),
      (this.map = null),
      (this.lightMap = null),
      (this.lightMapIntensity = 1),
      (this.aoMap = null),
      (this.aoMapIntensity = 1),
      (this.specularMap = null),
      (this.alphaMap = null),
      (this.envMap = null),
      (this.envMapRotation = new Je()),
      (this.combine = qa),
      (this.reflectivity = 1),
      (this.refractionRatio = 0.98),
      (this.wireframe = !1),
      (this.wireframeLinewidth = 1),
      (this.wireframeLinecap = "round"),
      (this.wireframeLinejoin = "round"),
      (this.fog = !0),
      this.setValues(t);
  }
  copy(t) {
    return (
      super.copy(t),
      this.color.copy(t.color),
      (this.map = t.map),
      (this.lightMap = t.lightMap),
      (this.lightMapIntensity = t.lightMapIntensity),
      (this.aoMap = t.aoMap),
      (this.aoMapIntensity = t.aoMapIntensity),
      (this.specularMap = t.specularMap),
      (this.alphaMap = t.alphaMap),
      (this.envMap = t.envMap),
      this.envMapRotation.copy(t.envMapRotation),
      (this.combine = t.combine),
      (this.reflectivity = t.reflectivity),
      (this.refractionRatio = t.refractionRatio),
      (this.wireframe = t.wireframe),
      (this.wireframeLinewidth = t.wireframeLinewidth),
      (this.wireframeLinecap = t.wireframeLinecap),
      (this.wireframeLinejoin = t.wireframeLinejoin),
      (this.fog = t.fog),
      this
    );
  }
}
const ie = new B(),
  Li = new Yt();
class Be {
  constructor(t, e, n = !1) {
    if (Array.isArray(t))
      throw new TypeError(
        "THREE.BufferAttribute: array should be a Typed Array."
      );
    (this.isBufferAttribute = !0),
      (this.name = ""),
      (this.array = t),
      (this.itemSize = e),
      (this.count = t !== void 0 ? t.length / e : 0),
      (this.normalized = n),
      (this.usage = Zs),
      (this.updateRanges = []),
      (this.gpuType = $e),
      (this.version = 0);
  }
  onUploadCallback() {}
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
  setUsage(t) {
    return (this.usage = t), this;
  }
  addUpdateRange(t, e) {
    this.updateRanges.push({ start: t, count: e });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  copy(t) {
    return (
      (this.name = t.name),
      (this.array = new t.array.constructor(t.array)),
      (this.itemSize = t.itemSize),
      (this.count = t.count),
      (this.normalized = t.normalized),
      (this.usage = t.usage),
      (this.gpuType = t.gpuType),
      this
    );
  }
  copyAt(t, e, n) {
    (t *= this.itemSize), (n *= e.itemSize);
    for (let r = 0, s = this.itemSize; r < s; r++)
      this.array[t + r] = e.array[n + r];
    return this;
  }
  copyArray(t) {
    return this.array.set(t), this;
  }
  applyMatrix3(t) {
    if (this.itemSize === 2)
      for (let e = 0, n = this.count; e < n; e++)
        Li.fromBufferAttribute(this, e),
          Li.applyMatrix3(t),
          this.setXY(e, Li.x, Li.y);
    else if (this.itemSize === 3)
      for (let e = 0, n = this.count; e < n; e++)
        ie.fromBufferAttribute(this, e),
          ie.applyMatrix3(t),
          this.setXYZ(e, ie.x, ie.y, ie.z);
    return this;
  }
  applyMatrix4(t) {
    for (let e = 0, n = this.count; e < n; e++)
      ie.fromBufferAttribute(this, e),
        ie.applyMatrix4(t),
        this.setXYZ(e, ie.x, ie.y, ie.z);
    return this;
  }
  applyNormalMatrix(t) {
    for (let e = 0, n = this.count; e < n; e++)
      ie.fromBufferAttribute(this, e),
        ie.applyNormalMatrix(t),
        this.setXYZ(e, ie.x, ie.y, ie.z);
    return this;
  }
  transformDirection(t) {
    for (let e = 0, n = this.count; e < n; e++)
      ie.fromBufferAttribute(this, e),
        ie.transformDirection(t),
        this.setXYZ(e, ie.x, ie.y, ie.z);
    return this;
  }
  set(t, e = 0) {
    return this.array.set(t, e), this;
  }
  getComponent(t, e) {
    let n = this.array[t * this.itemSize + e];
    return this.normalized && (n = ai(n, this.array)), n;
  }
  setComponent(t, e, n) {
    return (
      this.normalized && (n = fe(n, this.array)),
      (this.array[t * this.itemSize + e] = n),
      this
    );
  }
  getX(t) {
    let e = this.array[t * this.itemSize];
    return this.normalized && (e = ai(e, this.array)), e;
  }
  setX(t, e) {
    return (
      this.normalized && (e = fe(e, this.array)),
      (this.array[t * this.itemSize] = e),
      this
    );
  }
  getY(t) {
    let e = this.array[t * this.itemSize + 1];
    return this.normalized && (e = ai(e, this.array)), e;
  }
  setY(t, e) {
    return (
      this.normalized && (e = fe(e, this.array)),
      (this.array[t * this.itemSize + 1] = e),
      this
    );
  }
  getZ(t) {
    let e = this.array[t * this.itemSize + 2];
    return this.normalized && (e = ai(e, this.array)), e;
  }
  setZ(t, e) {
    return (
      this.normalized && (e = fe(e, this.array)),
      (this.array[t * this.itemSize + 2] = e),
      this
    );
  }
  getW(t) {
    let e = this.array[t * this.itemSize + 3];
    return this.normalized && (e = ai(e, this.array)), e;
  }
  setW(t, e) {
    return (
      this.normalized && (e = fe(e, this.array)),
      (this.array[t * this.itemSize + 3] = e),
      this
    );
  }
  setXY(t, e, n) {
    return (
      (t *= this.itemSize),
      this.normalized && ((e = fe(e, this.array)), (n = fe(n, this.array))),
      (this.array[t + 0] = e),
      (this.array[t + 1] = n),
      this
    );
  }
  setXYZ(t, e, n, r) {
    return (
      (t *= this.itemSize),
      this.normalized &&
        ((e = fe(e, this.array)),
        (n = fe(n, this.array)),
        (r = fe(r, this.array))),
      (this.array[t + 0] = e),
      (this.array[t + 1] = n),
      (this.array[t + 2] = r),
      this
    );
  }
  setXYZW(t, e, n, r, s) {
    return (
      (t *= this.itemSize),
      this.normalized &&
        ((e = fe(e, this.array)),
        (n = fe(n, this.array)),
        (r = fe(r, this.array)),
        (s = fe(s, this.array))),
      (this.array[t + 0] = e),
      (this.array[t + 1] = n),
      (this.array[t + 2] = r),
      (this.array[t + 3] = s),
      this
    );
  }
  onUpload(t) {
    return (this.onUploadCallback = t), this;
  }
  clone() {
    return new this.constructor(this.array, this.itemSize).copy(this);
  }
  toJSON() {
    const t = {
      itemSize: this.itemSize,
      type: this.array.constructor.name,
      array: Array.from(this.array),
      normalized: this.normalized,
    };
    return (
      this.name !== "" && (t.name = this.name),
      this.usage !== Zs && (t.usage = this.usage),
      t
    );
  }
}
class ho extends Be {
  constructor(t, e, n) {
    super(new Uint16Array(t), e, n);
  }
}
class uo extends Be {
  constructor(t, e, n) {
    super(new Uint32Array(t), e, n);
  }
}
class An extends Be {
  constructor(t, e, n) {
    super(new Float32Array(t), e, n);
  }
}
let Wl = 0;
const ye = new re(),
  br = new Me(),
  Vn = new B(),
  xe = new gi(),
  hi = new gi(),
  oe = new B();
class Cn extends ni {
  constructor() {
    super(),
      (this.isBufferGeometry = !0),
      Object.defineProperty(this, "id", { value: Wl++ }),
      (this.uuid = mi()),
      (this.name = ""),
      (this.type = "BufferGeometry"),
      (this.index = null),
      (this.indirect = null),
      (this.attributes = {}),
      (this.morphAttributes = {}),
      (this.morphTargetsRelative = !1),
      (this.groups = []),
      (this.boundingBox = null),
      (this.boundingSphere = null),
      (this.drawRange = { start: 0, count: 1 / 0 }),
      (this.userData = {});
  }
  getIndex() {
    return this.index;
  }
  setIndex(t) {
    return (
      Array.isArray(t)
        ? (this.index = new (so(t) ? uo : ho)(t, 1))
        : (this.index = t),
      this
    );
  }
  setIndirect(t) {
    return (this.indirect = t), this;
  }
  getIndirect() {
    return this.indirect;
  }
  getAttribute(t) {
    return this.attributes[t];
  }
  setAttribute(t, e) {
    return (this.attributes[t] = e), this;
  }
  deleteAttribute(t) {
    return delete this.attributes[t], this;
  }
  hasAttribute(t) {
    return this.attributes[t] !== void 0;
  }
  addGroup(t, e, n = 0) {
    this.groups.push({ start: t, count: e, materialIndex: n });
  }
  clearGroups() {
    this.groups = [];
  }
  setDrawRange(t, e) {
    (this.drawRange.start = t), (this.drawRange.count = e);
  }
  applyMatrix4(t) {
    const e = this.attributes.position;
    e !== void 0 && (e.applyMatrix4(t), (e.needsUpdate = !0));
    const n = this.attributes.normal;
    if (n !== void 0) {
      const s = new Pt().getNormalMatrix(t);
      n.applyNormalMatrix(s), (n.needsUpdate = !0);
    }
    const r = this.attributes.tangent;
    return (
      r !== void 0 && (r.transformDirection(t), (r.needsUpdate = !0)),
      this.boundingBox !== null && this.computeBoundingBox(),
      this.boundingSphere !== null && this.computeBoundingSphere(),
      this
    );
  }
  applyQuaternion(t) {
    return ye.makeRotationFromQuaternion(t), this.applyMatrix4(ye), this;
  }
  rotateX(t) {
    return ye.makeRotationX(t), this.applyMatrix4(ye), this;
  }
  rotateY(t) {
    return ye.makeRotationY(t), this.applyMatrix4(ye), this;
  }
  rotateZ(t) {
    return ye.makeRotationZ(t), this.applyMatrix4(ye), this;
  }
  translate(t, e, n) {
    return ye.makeTranslation(t, e, n), this.applyMatrix4(ye), this;
  }
  scale(t, e, n) {
    return ye.makeScale(t, e, n), this.applyMatrix4(ye), this;
  }
  lookAt(t) {
    return br.lookAt(t), br.updateMatrix(), this.applyMatrix4(br.matrix), this;
  }
  center() {
    return (
      this.computeBoundingBox(),
      this.boundingBox.getCenter(Vn).negate(),
      this.translate(Vn.x, Vn.y, Vn.z),
      this
    );
  }
  setFromPoints(t) {
    const e = this.getAttribute("position");
    if (e === void 0) {
      const n = [];
      for (let r = 0, s = t.length; r < s; r++) {
        const a = t[r];
        n.push(a.x, a.y, a.z || 0);
      }
      this.setAttribute("position", new An(n, 3));
    } else {
      for (let n = 0, r = e.count; n < r; n++) {
        const s = t[n];
        e.setXYZ(n, s.x, s.y, s.z || 0);
      }
      t.length > e.count &&
        console.warn(
          "THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."
        ),
        (e.needsUpdate = !0);
    }
    return this;
  }
  computeBoundingBox() {
    this.boundingBox === null && (this.boundingBox = new gi());
    const t = this.attributes.position,
      e = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute) {
      console.error(
        "THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",
        this
      ),
        this.boundingBox.set(
          new B(-1 / 0, -1 / 0, -1 / 0),
          new B(1 / 0, 1 / 0, 1 / 0)
        );
      return;
    }
    if (t !== void 0) {
      if ((this.boundingBox.setFromBufferAttribute(t), e))
        for (let n = 0, r = e.length; n < r; n++) {
          const s = e[n];
          xe.setFromBufferAttribute(s),
            this.morphTargetsRelative
              ? (oe.addVectors(this.boundingBox.min, xe.min),
                this.boundingBox.expandByPoint(oe),
                oe.addVectors(this.boundingBox.max, xe.max),
                this.boundingBox.expandByPoint(oe))
              : (this.boundingBox.expandByPoint(xe.min),
                this.boundingBox.expandByPoint(xe.max));
        }
    } else this.boundingBox.makeEmpty();
    (isNaN(this.boundingBox.min.x) ||
      isNaN(this.boundingBox.min.y) ||
      isNaN(this.boundingBox.min.z)) &&
      console.error(
        'THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',
        this
      );
  }
  computeBoundingSphere() {
    this.boundingSphere === null && (this.boundingSphere = new Ps());
    const t = this.attributes.position,
      e = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute) {
      console.error(
        "THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",
        this
      ),
        this.boundingSphere.set(new B(), 1 / 0);
      return;
    }
    if (t) {
      const n = this.boundingSphere.center;
      if ((xe.setFromBufferAttribute(t), e))
        for (let s = 0, a = e.length; s < a; s++) {
          const o = e[s];
          hi.setFromBufferAttribute(o),
            this.morphTargetsRelative
              ? (oe.addVectors(xe.min, hi.min),
                xe.expandByPoint(oe),
                oe.addVectors(xe.max, hi.max),
                xe.expandByPoint(oe))
              : (xe.expandByPoint(hi.min), xe.expandByPoint(hi.max));
        }
      xe.getCenter(n);
      let r = 0;
      for (let s = 0, a = t.count; s < a; s++)
        oe.fromBufferAttribute(t, s),
          (r = Math.max(r, n.distanceToSquared(oe)));
      if (e)
        for (let s = 0, a = e.length; s < a; s++) {
          const o = e[s],
            l = this.morphTargetsRelative;
          for (let c = 0, u = o.count; c < u; c++)
            oe.fromBufferAttribute(o, c),
              l && (Vn.fromBufferAttribute(t, c), oe.add(Vn)),
              (r = Math.max(r, n.distanceToSquared(oe)));
        }
      (this.boundingSphere.radius = Math.sqrt(r)),
        isNaN(this.boundingSphere.radius) &&
          console.error(
            'THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',
            this
          );
    }
  }
  computeTangents() {
    const t = this.index,
      e = this.attributes;
    if (
      t === null ||
      e.position === void 0 ||
      e.normal === void 0 ||
      e.uv === void 0
    ) {
      console.error(
        "THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)"
      );
      return;
    }
    const n = e.position,
      r = e.normal,
      s = e.uv;
    this.hasAttribute("tangent") === !1 &&
      this.setAttribute("tangent", new Be(new Float32Array(4 * n.count), 4));
    const a = this.getAttribute("tangent"),
      o = [],
      l = [];
    for (let D = 0; D < n.count; D++) (o[D] = new B()), (l[D] = new B());
    const c = new B(),
      u = new B(),
      d = new B(),
      f = new Yt(),
      m = new Yt(),
      v = new Yt(),
      M = new B(),
      p = new B();
    function h(D, S, x) {
      c.fromBufferAttribute(n, D),
        u.fromBufferAttribute(n, S),
        d.fromBufferAttribute(n, x),
        f.fromBufferAttribute(s, D),
        m.fromBufferAttribute(s, S),
        v.fromBufferAttribute(s, x),
        u.sub(c),
        d.sub(c),
        m.sub(f),
        v.sub(f);
      const R = 1 / (m.x * v.y - v.x * m.y);
      isFinite(R) &&
        (M.copy(u)
          .multiplyScalar(v.y)
          .addScaledVector(d, -m.y)
          .multiplyScalar(R),
        p
          .copy(d)
          .multiplyScalar(m.x)
          .addScaledVector(u, -v.x)
          .multiplyScalar(R),
        o[D].add(M),
        o[S].add(M),
        o[x].add(M),
        l[D].add(p),
        l[S].add(p),
        l[x].add(p));
    }
    let b = this.groups;
    b.length === 0 && (b = [{ start: 0, count: t.count }]);
    for (let D = 0, S = b.length; D < S; ++D) {
      const x = b[D],
        R = x.start,
        G = x.count;
      for (let H = R, $ = R + G; H < $; H += 3)
        h(t.getX(H + 0), t.getX(H + 1), t.getX(H + 2));
    }
    const T = new B(),
      E = new B(),
      O = new B(),
      C = new B();
    function A(D) {
      O.fromBufferAttribute(r, D), C.copy(O);
      const S = o[D];
      T.copy(S),
        T.sub(O.multiplyScalar(O.dot(S))).normalize(),
        E.crossVectors(C, S);
      const R = E.dot(l[D]) < 0 ? -1 : 1;
      a.setXYZW(D, T.x, T.y, T.z, R);
    }
    for (let D = 0, S = b.length; D < S; ++D) {
      const x = b[D],
        R = x.start,
        G = x.count;
      for (let H = R, $ = R + G; H < $; H += 3)
        A(t.getX(H + 0)), A(t.getX(H + 1)), A(t.getX(H + 2));
    }
  }
  computeVertexNormals() {
    const t = this.index,
      e = this.getAttribute("position");
    if (e !== void 0) {
      let n = this.getAttribute("normal");
      if (n === void 0)
        (n = new Be(new Float32Array(e.count * 3), 3)),
          this.setAttribute("normal", n);
      else for (let f = 0, m = n.count; f < m; f++) n.setXYZ(f, 0, 0, 0);
      const r = new B(),
        s = new B(),
        a = new B(),
        o = new B(),
        l = new B(),
        c = new B(),
        u = new B(),
        d = new B();
      if (t)
        for (let f = 0, m = t.count; f < m; f += 3) {
          const v = t.getX(f + 0),
            M = t.getX(f + 1),
            p = t.getX(f + 2);
          r.fromBufferAttribute(e, v),
            s.fromBufferAttribute(e, M),
            a.fromBufferAttribute(e, p),
            u.subVectors(a, s),
            d.subVectors(r, s),
            u.cross(d),
            o.fromBufferAttribute(n, v),
            l.fromBufferAttribute(n, M),
            c.fromBufferAttribute(n, p),
            o.add(u),
            l.add(u),
            c.add(u),
            n.setXYZ(v, o.x, o.y, o.z),
            n.setXYZ(M, l.x, l.y, l.z),
            n.setXYZ(p, c.x, c.y, c.z);
        }
      else
        for (let f = 0, m = e.count; f < m; f += 3)
          r.fromBufferAttribute(e, f + 0),
            s.fromBufferAttribute(e, f + 1),
            a.fromBufferAttribute(e, f + 2),
            u.subVectors(a, s),
            d.subVectors(r, s),
            u.cross(d),
            n.setXYZ(f + 0, u.x, u.y, u.z),
            n.setXYZ(f + 1, u.x, u.y, u.z),
            n.setXYZ(f + 2, u.x, u.y, u.z);
      this.normalizeNormals(), (n.needsUpdate = !0);
    }
  }
  normalizeNormals() {
    const t = this.attributes.normal;
    for (let e = 0, n = t.count; e < n; e++)
      oe.fromBufferAttribute(t, e),
        oe.normalize(),
        t.setXYZ(e, oe.x, oe.y, oe.z);
  }
  toNonIndexed() {
    function t(o, l) {
      const c = o.array,
        u = o.itemSize,
        d = o.normalized,
        f = new c.constructor(l.length * u);
      let m = 0,
        v = 0;
      for (let M = 0, p = l.length; M < p; M++) {
        o.isInterleavedBufferAttribute
          ? (m = l[M] * o.data.stride + o.offset)
          : (m = l[M] * u);
        for (let h = 0; h < u; h++) f[v++] = c[m++];
      }
      return new Be(f, u, d);
    }
    if (this.index === null)
      return (
        console.warn(
          "THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."
        ),
        this
      );
    const e = new Cn(),
      n = this.index.array,
      r = this.attributes;
    for (const o in r) {
      const l = r[o],
        c = t(l, n);
      e.setAttribute(o, c);
    }
    const s = this.morphAttributes;
    for (const o in s) {
      const l = [],
        c = s[o];
      for (let u = 0, d = c.length; u < d; u++) {
        const f = c[u],
          m = t(f, n);
        l.push(m);
      }
      e.morphAttributes[o] = l;
    }
    e.morphTargetsRelative = this.morphTargetsRelative;
    const a = this.groups;
    for (let o = 0, l = a.length; o < l; o++) {
      const c = a[o];
      e.addGroup(c.start, c.count, c.materialIndex);
    }
    return e;
  }
  toJSON() {
    const t = {
      metadata: {
        version: 4.6,
        type: "BufferGeometry",
        generator: "BufferGeometry.toJSON",
      },
    };
    if (
      ((t.uuid = this.uuid),
      (t.type = this.type),
      this.name !== "" && (t.name = this.name),
      Object.keys(this.userData).length > 0 && (t.userData = this.userData),
      this.parameters !== void 0)
    ) {
      const l = this.parameters;
      for (const c in l) l[c] !== void 0 && (t[c] = l[c]);
      return t;
    }
    t.data = { attributes: {} };
    const e = this.index;
    e !== null &&
      (t.data.index = {
        type: e.array.constructor.name,
        array: Array.prototype.slice.call(e.array),
      });
    const n = this.attributes;
    for (const l in n) {
      const c = n[l];
      t.data.attributes[l] = c.toJSON(t.data);
    }
    const r = {};
    let s = !1;
    for (const l in this.morphAttributes) {
      const c = this.morphAttributes[l],
        u = [];
      for (let d = 0, f = c.length; d < f; d++) {
        const m = c[d];
        u.push(m.toJSON(t.data));
      }
      u.length > 0 && ((r[l] = u), (s = !0));
    }
    s &&
      ((t.data.morphAttributes = r),
      (t.data.morphTargetsRelative = this.morphTargetsRelative));
    const a = this.groups;
    a.length > 0 && (t.data.groups = JSON.parse(JSON.stringify(a)));
    const o = this.boundingSphere;
    return (
      o !== null &&
        (t.data.boundingSphere = {
          center: o.center.toArray(),
          radius: o.radius,
        }),
      t
    );
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    (this.index = null),
      (this.attributes = {}),
      (this.morphAttributes = {}),
      (this.groups = []),
      (this.boundingBox = null),
      (this.boundingSphere = null);
    const e = {};
    this.name = t.name;
    const n = t.index;
    n !== null && this.setIndex(n.clone(e));
    const r = t.attributes;
    for (const c in r) {
      const u = r[c];
      this.setAttribute(c, u.clone(e));
    }
    const s = t.morphAttributes;
    for (const c in s) {
      const u = [],
        d = s[c];
      for (let f = 0, m = d.length; f < m; f++) u.push(d[f].clone(e));
      this.morphAttributes[c] = u;
    }
    this.morphTargetsRelative = t.morphTargetsRelative;
    const a = t.groups;
    for (let c = 0, u = a.length; c < u; c++) {
      const d = a[c];
      this.addGroup(d.start, d.count, d.materialIndex);
    }
    const o = t.boundingBox;
    o !== null && (this.boundingBox = o.clone());
    const l = t.boundingSphere;
    return (
      l !== null && (this.boundingSphere = l.clone()),
      (this.drawRange.start = t.drawRange.start),
      (this.drawRange.count = t.drawRange.count),
      (this.userData = t.userData),
      this
    );
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
const fa = new re(),
  _n = new Fl(),
  Ii = new Ps(),
  pa = new B(),
  Di = new B(),
  Ui = new B(),
  Ni = new B(),
  Ar = new B(),
  Fi = new B(),
  ma = new B(),
  Oi = new B();
class Oe extends Me {
  constructor(t = new Cn(), e = new Ls()) {
    super(),
      (this.isMesh = !0),
      (this.type = "Mesh"),
      (this.geometry = t),
      (this.material = e),
      this.updateMorphTargets();
  }
  copy(t, e) {
    return (
      super.copy(t, e),
      t.morphTargetInfluences !== void 0 &&
        (this.morphTargetInfluences = t.morphTargetInfluences.slice()),
      t.morphTargetDictionary !== void 0 &&
        (this.morphTargetDictionary = Object.assign(
          {},
          t.morphTargetDictionary
        )),
      (this.material = Array.isArray(t.material)
        ? t.material.slice()
        : t.material),
      (this.geometry = t.geometry),
      this
    );
  }
  updateMorphTargets() {
    const e = this.geometry.morphAttributes,
      n = Object.keys(e);
    if (n.length > 0) {
      const r = e[n[0]];
      if (r !== void 0) {
        (this.morphTargetInfluences = []), (this.morphTargetDictionary = {});
        for (let s = 0, a = r.length; s < a; s++) {
          const o = r[s].name || String(s);
          this.morphTargetInfluences.push(0),
            (this.morphTargetDictionary[o] = s);
        }
      }
    }
  }
  getVertexPosition(t, e) {
    const n = this.geometry,
      r = n.attributes.position,
      s = n.morphAttributes.position,
      a = n.morphTargetsRelative;
    e.fromBufferAttribute(r, t);
    const o = this.morphTargetInfluences;
    if (s && o) {
      Fi.set(0, 0, 0);
      for (let l = 0, c = s.length; l < c; l++) {
        const u = o[l],
          d = s[l];
        u !== 0 &&
          (Ar.fromBufferAttribute(d, t),
          a ? Fi.addScaledVector(Ar, u) : Fi.addScaledVector(Ar.sub(e), u));
      }
      e.add(Fi);
    }
    return e;
  }
  raycast(t, e) {
    const n = this.geometry,
      r = this.material,
      s = this.matrixWorld;
    r !== void 0 &&
      (n.boundingSphere === null && n.computeBoundingSphere(),
      Ii.copy(n.boundingSphere),
      Ii.applyMatrix4(s),
      _n.copy(t.ray).recast(t.near),
      !(
        Ii.containsPoint(_n.origin) === !1 &&
        (_n.intersectSphere(Ii, pa) === null ||
          _n.origin.distanceToSquared(pa) > (t.far - t.near) ** 2)
      ) &&
        (fa.copy(s).invert(),
        _n.copy(t.ray).applyMatrix4(fa),
        !(n.boundingBox !== null && _n.intersectsBox(n.boundingBox) === !1) &&
          this._computeIntersections(t, e, _n)));
  }
  _computeIntersections(t, e, n) {
    let r;
    const s = this.geometry,
      a = this.material,
      o = s.index,
      l = s.attributes.position,
      c = s.attributes.uv,
      u = s.attributes.uv1,
      d = s.attributes.normal,
      f = s.groups,
      m = s.drawRange;
    if (o !== null)
      if (Array.isArray(a))
        for (let v = 0, M = f.length; v < M; v++) {
          const p = f[v],
            h = a[p.materialIndex],
            b = Math.max(p.start, m.start),
            T = Math.min(
              o.count,
              Math.min(p.start + p.count, m.start + m.count)
            );
          for (let E = b, O = T; E < O; E += 3) {
            const C = o.getX(E),
              A = o.getX(E + 1),
              D = o.getX(E + 2);
            (r = Bi(this, h, t, n, c, u, d, C, A, D)),
              r &&
                ((r.faceIndex = Math.floor(E / 3)),
                (r.face.materialIndex = p.materialIndex),
                e.push(r));
          }
        }
      else {
        const v = Math.max(0, m.start),
          M = Math.min(o.count, m.start + m.count);
        for (let p = v, h = M; p < h; p += 3) {
          const b = o.getX(p),
            T = o.getX(p + 1),
            E = o.getX(p + 2);
          (r = Bi(this, a, t, n, c, u, d, b, T, E)),
            r && ((r.faceIndex = Math.floor(p / 3)), e.push(r));
        }
      }
    else if (l !== void 0)
      if (Array.isArray(a))
        for (let v = 0, M = f.length; v < M; v++) {
          const p = f[v],
            h = a[p.materialIndex],
            b = Math.max(p.start, m.start),
            T = Math.min(
              l.count,
              Math.min(p.start + p.count, m.start + m.count)
            );
          for (let E = b, O = T; E < O; E += 3) {
            const C = E,
              A = E + 1,
              D = E + 2;
            (r = Bi(this, h, t, n, c, u, d, C, A, D)),
              r &&
                ((r.faceIndex = Math.floor(E / 3)),
                (r.face.materialIndex = p.materialIndex),
                e.push(r));
          }
        }
      else {
        const v = Math.max(0, m.start),
          M = Math.min(l.count, m.start + m.count);
        for (let p = v, h = M; p < h; p += 3) {
          const b = p,
            T = p + 1,
            E = p + 2;
          (r = Bi(this, a, t, n, c, u, d, b, T, E)),
            r && ((r.faceIndex = Math.floor(p / 3)), e.push(r));
        }
      }
  }
}
function Xl(i, t, e, n, r, s, a, o) {
  let l;
  if (
    (t.side === me
      ? (l = n.intersectTriangle(a, s, r, !0, o))
      : (l = n.intersectTriangle(r, s, a, t.side === un, o)),
    l === null)
  )
    return null;
  Oi.copy(o), Oi.applyMatrix4(i.matrixWorld);
  const c = e.ray.origin.distanceTo(Oi);
  return c < e.near || c > e.far
    ? null
    : { distance: c, point: Oi.clone(), object: i };
}
function Bi(i, t, e, n, r, s, a, o, l, c) {
  i.getVertexPosition(o, Di),
    i.getVertexPosition(l, Ui),
    i.getVertexPosition(c, Ni);
  const u = Xl(i, t, e, n, Di, Ui, Ni, ma);
  if (u) {
    const d = new B();
    Le.getBarycoord(ma, Di, Ui, Ni, d),
      r && (u.uv = Le.getInterpolatedAttribute(r, o, l, c, d, new Yt())),
      s && (u.uv1 = Le.getInterpolatedAttribute(s, o, l, c, d, new Yt())),
      a &&
        ((u.normal = Le.getInterpolatedAttribute(a, o, l, c, d, new B())),
        u.normal.dot(n.direction) > 0 && u.normal.multiplyScalar(-1));
    const f = { a: o, b: l, c, normal: new B(), materialIndex: 0 };
    Le.getNormal(Di, Ui, Ni, f.normal), (u.face = f), (u.barycoord = d);
  }
  return u;
}
class vi extends Cn {
  constructor(t = 1, e = 1, n = 1, r = 1, s = 1, a = 1) {
    super(),
      (this.type = "BoxGeometry"),
      (this.parameters = {
        width: t,
        height: e,
        depth: n,
        widthSegments: r,
        heightSegments: s,
        depthSegments: a,
      });
    const o = this;
    (r = Math.floor(r)), (s = Math.floor(s)), (a = Math.floor(a));
    const l = [],
      c = [],
      u = [],
      d = [];
    let f = 0,
      m = 0;
    v("z", "y", "x", -1, -1, n, e, t, a, s, 0),
      v("z", "y", "x", 1, -1, n, e, -t, a, s, 1),
      v("x", "z", "y", 1, 1, t, n, e, r, a, 2),
      v("x", "z", "y", 1, -1, t, n, -e, r, a, 3),
      v("x", "y", "z", 1, -1, t, e, n, r, s, 4),
      v("x", "y", "z", -1, -1, t, e, -n, r, s, 5),
      this.setIndex(l),
      this.setAttribute("position", new An(c, 3)),
      this.setAttribute("normal", new An(u, 3)),
      this.setAttribute("uv", new An(d, 2));
    function v(M, p, h, b, T, E, O, C, A, D, S) {
      const x = E / A,
        R = O / D,
        G = E / 2,
        H = O / 2,
        $ = C / 2,
        K = A + 1,
        X = D + 1;
      let Z = 0,
        z = 0;
      const et = new B();
      for (let ct = 0; ct < X; ct++) {
        const _t = ct * R - H;
        for (let Rt = 0; Rt < K; Rt++) {
          const Vt = Rt * x - G;
          (et[M] = Vt * b),
            (et[p] = _t * T),
            (et[h] = $),
            c.push(et.x, et.y, et.z),
            (et[M] = 0),
            (et[p] = 0),
            (et[h] = C > 0 ? 1 : -1),
            u.push(et.x, et.y, et.z),
            d.push(Rt / A),
            d.push(1 - ct / D),
            (Z += 1);
        }
      }
      for (let ct = 0; ct < D; ct++)
        for (let _t = 0; _t < A; _t++) {
          const Rt = f + _t + K * ct,
            Vt = f + _t + K * (ct + 1),
            W = f + (_t + 1) + K * (ct + 1),
            tt = f + (_t + 1) + K * ct;
          l.push(Rt, Vt, tt), l.push(Vt, W, tt), (z += 6);
        }
      o.addGroup(m, z, S), (m += z), (f += Z);
    }
  }
  copy(t) {
    return (
      super.copy(t), (this.parameters = Object.assign({}, t.parameters)), this
    );
  }
  static fromJSON(t) {
    return new vi(
      t.width,
      t.height,
      t.depth,
      t.widthSegments,
      t.heightSegments,
      t.depthSegments
    );
  }
}
function ti(i) {
  const t = {};
  for (const e in i) {
    t[e] = {};
    for (const n in i[e]) {
      const r = i[e][n];
      r &&
      (r.isColor ||
        r.isMatrix3 ||
        r.isMatrix4 ||
        r.isVector2 ||
        r.isVector3 ||
        r.isVector4 ||
        r.isTexture ||
        r.isQuaternion)
        ? r.isRenderTargetTexture
          ? (console.warn(
              "UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."
            ),
            (t[e][n] = null))
          : (t[e][n] = r.clone())
        : Array.isArray(r)
        ? (t[e][n] = r.slice())
        : (t[e][n] = r);
    }
  }
  return t;
}
function ue(i) {
  const t = {};
  for (let e = 0; e < i.length; e++) {
    const n = ti(i[e]);
    for (const r in n) t[r] = n[r];
  }
  return t;
}
function ql(i) {
  const t = [];
  for (let e = 0; e < i.length; e++) t.push(i[e].clone());
  return t;
}
function fo(i) {
  const t = i.getRenderTarget();
  return t === null
    ? i.outputColorSpace
    : t.isXRRenderTarget === !0
    ? t.texture.colorSpace
    : zt.workingColorSpace;
}
const Yl = { clone: ti, merge: ue };
var $l = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,
  Kl = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;
class dn extends er {
  static get type() {
    return "ShaderMaterial";
  }
  constructor(t) {
    super(),
      (this.isShaderMaterial = !0),
      (this.defines = {}),
      (this.uniforms = {}),
      (this.uniformsGroups = []),
      (this.vertexShader = $l),
      (this.fragmentShader = Kl),
      (this.linewidth = 1),
      (this.wireframe = !1),
      (this.wireframeLinewidth = 1),
      (this.fog = !1),
      (this.lights = !1),
      (this.clipping = !1),
      (this.forceSinglePass = !0),
      (this.extensions = { clipCullDistance: !1, multiDraw: !1 }),
      (this.defaultAttributeValues = {
        color: [1, 1, 1],
        uv: [0, 0],
        uv1: [0, 0],
      }),
      (this.index0AttributeName = void 0),
      (this.uniformsNeedUpdate = !1),
      (this.glslVersion = null),
      t !== void 0 && this.setValues(t);
  }
  copy(t) {
    return (
      super.copy(t),
      (this.fragmentShader = t.fragmentShader),
      (this.vertexShader = t.vertexShader),
      (this.uniforms = ti(t.uniforms)),
      (this.uniformsGroups = ql(t.uniformsGroups)),
      (this.defines = Object.assign({}, t.defines)),
      (this.wireframe = t.wireframe),
      (this.wireframeLinewidth = t.wireframeLinewidth),
      (this.fog = t.fog),
      (this.lights = t.lights),
      (this.clipping = t.clipping),
      (this.extensions = Object.assign({}, t.extensions)),
      (this.glslVersion = t.glslVersion),
      this
    );
  }
  toJSON(t) {
    const e = super.toJSON(t);
    (e.glslVersion = this.glslVersion), (e.uniforms = {});
    for (const r in this.uniforms) {
      const a = this.uniforms[r].value;
      a && a.isTexture
        ? (e.uniforms[r] = { type: "t", value: a.toJSON(t).uuid })
        : a && a.isColor
        ? (e.uniforms[r] = { type: "c", value: a.getHex() })
        : a && a.isVector2
        ? (e.uniforms[r] = { type: "v2", value: a.toArray() })
        : a && a.isVector3
        ? (e.uniforms[r] = { type: "v3", value: a.toArray() })
        : a && a.isVector4
        ? (e.uniforms[r] = { type: "v4", value: a.toArray() })
        : a && a.isMatrix3
        ? (e.uniforms[r] = { type: "m3", value: a.toArray() })
        : a && a.isMatrix4
        ? (e.uniforms[r] = { type: "m4", value: a.toArray() })
        : (e.uniforms[r] = { value: a });
    }
    Object.keys(this.defines).length > 0 && (e.defines = this.defines),
      (e.vertexShader = this.vertexShader),
      (e.fragmentShader = this.fragmentShader),
      (e.lights = this.lights),
      (e.clipping = this.clipping);
    const n = {};
    for (const r in this.extensions) this.extensions[r] === !0 && (n[r] = !0);
    return Object.keys(n).length > 0 && (e.extensions = n), e;
  }
}
class po extends Me {
  constructor() {
    super(),
      (this.isCamera = !0),
      (this.type = "Camera"),
      (this.matrixWorldInverse = new re()),
      (this.projectionMatrix = new re()),
      (this.projectionMatrixInverse = new re()),
      (this.coordinateSystem = Ke);
  }
  copy(t, e) {
    return (
      super.copy(t, e),
      this.matrixWorldInverse.copy(t.matrixWorldInverse),
      this.projectionMatrix.copy(t.projectionMatrix),
      this.projectionMatrixInverse.copy(t.projectionMatrixInverse),
      (this.coordinateSystem = t.coordinateSystem),
      this
    );
  }
  getWorldDirection(t) {
    return super.getWorldDirection(t).negate();
  }
  updateMatrixWorld(t) {
    super.updateMatrixWorld(t),
      this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  updateWorldMatrix(t, e) {
    super.updateWorldMatrix(t, e),
      this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const on = new B(),
  _a = new Yt(),
  ga = new Yt();
class be extends po {
  constructor(t = 50, e = 1, n = 0.1, r = 2e3) {
    super(),
      (this.isPerspectiveCamera = !0),
      (this.type = "PerspectiveCamera"),
      (this.fov = t),
      (this.zoom = 1),
      (this.near = n),
      (this.far = r),
      (this.focus = 10),
      (this.aspect = e),
      (this.view = null),
      (this.filmGauge = 35),
      (this.filmOffset = 0),
      this.updateProjectionMatrix();
  }
  copy(t, e) {
    return (
      super.copy(t, e),
      (this.fov = t.fov),
      (this.zoom = t.zoom),
      (this.near = t.near),
      (this.far = t.far),
      (this.focus = t.focus),
      (this.aspect = t.aspect),
      (this.view = t.view === null ? null : Object.assign({}, t.view)),
      (this.filmGauge = t.filmGauge),
      (this.filmOffset = t.filmOffset),
      this
    );
  }
  setFocalLength(t) {
    const e = (0.5 * this.getFilmHeight()) / t;
    (this.fov = Ss * 2 * Math.atan(e)), this.updateProjectionMatrix();
  }
  getFocalLength() {
    const t = Math.tan(ar * 0.5 * this.fov);
    return (0.5 * this.getFilmHeight()) / t;
  }
  getEffectiveFOV() {
    return Ss * 2 * Math.atan(Math.tan(ar * 0.5 * this.fov) / this.zoom);
  }
  getFilmWidth() {
    return this.filmGauge * Math.min(this.aspect, 1);
  }
  getFilmHeight() {
    return this.filmGauge / Math.max(this.aspect, 1);
  }
  getViewBounds(t, e, n) {
    on.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse),
      e.set(on.x, on.y).multiplyScalar(-t / on.z),
      on.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse),
      n.set(on.x, on.y).multiplyScalar(-t / on.z);
  }
  getViewSize(t, e) {
    return this.getViewBounds(t, _a, ga), e.subVectors(ga, _a);
  }
  setViewOffset(t, e, n, r, s, a) {
    (this.aspect = t / e),
      this.view === null &&
        (this.view = {
          enabled: !0,
          fullWidth: 1,
          fullHeight: 1,
          offsetX: 0,
          offsetY: 0,
          width: 1,
          height: 1,
        }),
      (this.view.enabled = !0),
      (this.view.fullWidth = t),
      (this.view.fullHeight = e),
      (this.view.offsetX = n),
      (this.view.offsetY = r),
      (this.view.width = s),
      (this.view.height = a),
      this.updateProjectionMatrix();
  }
  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1),
      this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const t = this.near;
    let e = (t * Math.tan(ar * 0.5 * this.fov)) / this.zoom,
      n = 2 * e,
      r = this.aspect * n,
      s = -0.5 * r;
    const a = this.view;
    if (this.view !== null && this.view.enabled) {
      const l = a.fullWidth,
        c = a.fullHeight;
      (s += (a.offsetX * r) / l),
        (e -= (a.offsetY * n) / c),
        (r *= a.width / l),
        (n *= a.height / c);
    }
    const o = this.filmOffset;
    o !== 0 && (s += (t * o) / this.getFilmWidth()),
      this.projectionMatrix.makePerspective(
        s,
        s + r,
        e,
        e - n,
        t,
        this.far,
        this.coordinateSystem
      ),
      this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return (
      (e.object.fov = this.fov),
      (e.object.zoom = this.zoom),
      (e.object.near = this.near),
      (e.object.far = this.far),
      (e.object.focus = this.focus),
      (e.object.aspect = this.aspect),
      this.view !== null && (e.object.view = Object.assign({}, this.view)),
      (e.object.filmGauge = this.filmGauge),
      (e.object.filmOffset = this.filmOffset),
      e
    );
  }
}
const Gn = -90,
  kn = 1;
class Zl extends Me {
  constructor(t, e, n) {
    super(),
      (this.type = "CubeCamera"),
      (this.renderTarget = n),
      (this.coordinateSystem = null),
      (this.activeMipmapLevel = 0);
    const r = new be(Gn, kn, t, e);
    (r.layers = this.layers), this.add(r);
    const s = new be(Gn, kn, t, e);
    (s.layers = this.layers), this.add(s);
    const a = new be(Gn, kn, t, e);
    (a.layers = this.layers), this.add(a);
    const o = new be(Gn, kn, t, e);
    (o.layers = this.layers), this.add(o);
    const l = new be(Gn, kn, t, e);
    (l.layers = this.layers), this.add(l);
    const c = new be(Gn, kn, t, e);
    (c.layers = this.layers), this.add(c);
  }
  updateCoordinateSystem() {
    const t = this.coordinateSystem,
      e = this.children.concat(),
      [n, r, s, a, o, l] = e;
    for (const c of e) this.remove(c);
    if (t === Ke)
      n.up.set(0, 1, 0),
        n.lookAt(1, 0, 0),
        r.up.set(0, 1, 0),
        r.lookAt(-1, 0, 0),
        s.up.set(0, 0, -1),
        s.lookAt(0, 1, 0),
        a.up.set(0, 0, 1),
        a.lookAt(0, -1, 0),
        o.up.set(0, 1, 0),
        o.lookAt(0, 0, 1),
        l.up.set(0, 1, 0),
        l.lookAt(0, 0, -1);
    else if (t === Zi)
      n.up.set(0, -1, 0),
        n.lookAt(-1, 0, 0),
        r.up.set(0, -1, 0),
        r.lookAt(1, 0, 0),
        s.up.set(0, 0, 1),
        s.lookAt(0, 1, 0),
        a.up.set(0, 0, -1),
        a.lookAt(0, -1, 0),
        o.up.set(0, -1, 0),
        o.lookAt(0, 0, 1),
        l.up.set(0, -1, 0),
        l.lookAt(0, 0, -1);
    else
      throw new Error(
        "THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " +
          t
      );
    for (const c of e) this.add(c), c.updateMatrixWorld();
  }
  update(t, e) {
    this.parent === null && this.updateMatrixWorld();
    const { renderTarget: n, activeMipmapLevel: r } = this;
    this.coordinateSystem !== t.coordinateSystem &&
      ((this.coordinateSystem = t.coordinateSystem),
      this.updateCoordinateSystem());
    const [s, a, o, l, c, u] = this.children,
      d = t.getRenderTarget(),
      f = t.getActiveCubeFace(),
      m = t.getActiveMipmapLevel(),
      v = t.xr.enabled;
    t.xr.enabled = !1;
    const M = n.texture.generateMipmaps;
    (n.texture.generateMipmaps = !1),
      t.setRenderTarget(n, 0, r),
      t.render(e, s),
      t.setRenderTarget(n, 1, r),
      t.render(e, a),
      t.setRenderTarget(n, 2, r),
      t.render(e, o),
      t.setRenderTarget(n, 3, r),
      t.render(e, l),
      t.setRenderTarget(n, 4, r),
      t.render(e, c),
      (n.texture.generateMipmaps = M),
      t.setRenderTarget(n, 5, r),
      t.render(e, u),
      t.setRenderTarget(d, f, m),
      (t.xr.enabled = v),
      (n.texture.needsPMREMUpdate = !0);
  }
}
class mo extends _e {
  constructor(t, e, n, r, s, a, o, l, c, u) {
    (t = t !== void 0 ? t : []),
      (e = e !== void 0 ? e : Zn),
      super(t, e, n, r, s, a, o, l, c, u),
      (this.isCubeTexture = !0),
      (this.flipY = !1);
  }
  get images() {
    return this.image;
  }
  set images(t) {
    this.image = t;
  }
}
class jl extends wn {
  constructor(t = 1, e = {}) {
    super(t, t, e), (this.isWebGLCubeRenderTarget = !0);
    const n = { width: t, height: t, depth: 1 },
      r = [n, n, n, n, n, n];
    (this.texture = new mo(
      r,
      e.mapping,
      e.wrapS,
      e.wrapT,
      e.magFilter,
      e.minFilter,
      e.format,
      e.type,
      e.anisotropy,
      e.colorSpace
    )),
      (this.texture.isRenderTargetTexture = !0),
      (this.texture.generateMipmaps =
        e.generateMipmaps !== void 0 ? e.generateMipmaps : !1),
      (this.texture.minFilter = e.minFilter !== void 0 ? e.minFilter : Fe);
  }
  fromEquirectangularTexture(t, e) {
    (this.texture.type = e.type),
      (this.texture.colorSpace = e.colorSpace),
      (this.texture.generateMipmaps = e.generateMipmaps),
      (this.texture.minFilter = e.minFilter),
      (this.texture.magFilter = e.magFilter);
    const n = {
        uniforms: { tEquirect: { value: null } },
        vertexShader: `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,
        fragmentShader: `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`,
      },
      r = new vi(5, 5, 5),
      s = new dn({
        name: "CubemapFromEquirect",
        uniforms: ti(n.uniforms),
        vertexShader: n.vertexShader,
        fragmentShader: n.fragmentShader,
        side: me,
        blending: cn,
      });
    s.uniforms.tEquirect.value = e;
    const a = new Oe(r, s),
      o = e.minFilter;
    return (
      e.minFilter === bn && (e.minFilter = Fe),
      new Zl(1, 10, this).update(t, a),
      (e.minFilter = o),
      a.geometry.dispose(),
      a.material.dispose(),
      this
    );
  }
  clear(t, e, n, r) {
    const s = t.getRenderTarget();
    for (let a = 0; a < 6; a++) t.setRenderTarget(this, a), t.clear(e, n, r);
    t.setRenderTarget(s);
  }
}
const Rr = new B(),
  Jl = new B(),
  Ql = new Pt();
class Mn {
  constructor(t = new B(1, 0, 0), e = 0) {
    (this.isPlane = !0), (this.normal = t), (this.constant = e);
  }
  set(t, e) {
    return this.normal.copy(t), (this.constant = e), this;
  }
  setComponents(t, e, n, r) {
    return this.normal.set(t, e, n), (this.constant = r), this;
  }
  setFromNormalAndCoplanarPoint(t, e) {
    return this.normal.copy(t), (this.constant = -e.dot(this.normal)), this;
  }
  setFromCoplanarPoints(t, e, n) {
    const r = Rr.subVectors(n, e).cross(Jl.subVectors(t, e)).normalize();
    return this.setFromNormalAndCoplanarPoint(r, t), this;
  }
  copy(t) {
    return this.normal.copy(t.normal), (this.constant = t.constant), this;
  }
  normalize() {
    const t = 1 / this.normal.length();
    return this.normal.multiplyScalar(t), (this.constant *= t), this;
  }
  negate() {
    return (this.constant *= -1), this.normal.negate(), this;
  }
  distanceToPoint(t) {
    return this.normal.dot(t) + this.constant;
  }
  distanceToSphere(t) {
    return this.distanceToPoint(t.center) - t.radius;
  }
  projectPoint(t, e) {
    return e.copy(t).addScaledVector(this.normal, -this.distanceToPoint(t));
  }
  intersectLine(t, e) {
    const n = t.delta(Rr),
      r = this.normal.dot(n);
    if (r === 0)
      return this.distanceToPoint(t.start) === 0 ? e.copy(t.start) : null;
    const s = -(t.start.dot(this.normal) + this.constant) / r;
    return s < 0 || s > 1 ? null : e.copy(t.start).addScaledVector(n, s);
  }
  intersectsLine(t) {
    const e = this.distanceToPoint(t.start),
      n = this.distanceToPoint(t.end);
    return (e < 0 && n > 0) || (n < 0 && e > 0);
  }
  intersectsBox(t) {
    return t.intersectsPlane(this);
  }
  intersectsSphere(t) {
    return t.intersectsPlane(this);
  }
  coplanarPoint(t) {
    return t.copy(this.normal).multiplyScalar(-this.constant);
  }
  applyMatrix4(t, e) {
    const n = e || Ql.getNormalMatrix(t),
      r = this.coplanarPoint(Rr).applyMatrix4(t),
      s = this.normal.applyMatrix3(n).normalize();
    return (this.constant = -r.dot(s)), this;
  }
  translate(t) {
    return (this.constant -= t.dot(this.normal)), this;
  }
  equals(t) {
    return t.normal.equals(this.normal) && t.constant === this.constant;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const gn = new Ps(),
  zi = new B();
class _o {
  constructor(
    t = new Mn(),
    e = new Mn(),
    n = new Mn(),
    r = new Mn(),
    s = new Mn(),
    a = new Mn()
  ) {
    this.planes = [t, e, n, r, s, a];
  }
  set(t, e, n, r, s, a) {
    const o = this.planes;
    return (
      o[0].copy(t),
      o[1].copy(e),
      o[2].copy(n),
      o[3].copy(r),
      o[4].copy(s),
      o[5].copy(a),
      this
    );
  }
  copy(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++) e[n].copy(t.planes[n]);
    return this;
  }
  setFromProjectionMatrix(t, e = Ke) {
    const n = this.planes,
      r = t.elements,
      s = r[0],
      a = r[1],
      o = r[2],
      l = r[3],
      c = r[4],
      u = r[5],
      d = r[6],
      f = r[7],
      m = r[8],
      v = r[9],
      M = r[10],
      p = r[11],
      h = r[12],
      b = r[13],
      T = r[14],
      E = r[15];
    if (
      (n[0].setComponents(l - s, f - c, p - m, E - h).normalize(),
      n[1].setComponents(l + s, f + c, p + m, E + h).normalize(),
      n[2].setComponents(l + a, f + u, p + v, E + b).normalize(),
      n[3].setComponents(l - a, f - u, p - v, E - b).normalize(),
      n[4].setComponents(l - o, f - d, p - M, E - T).normalize(),
      e === Ke)
    )
      n[5].setComponents(l + o, f + d, p + M, E + T).normalize();
    else if (e === Zi) n[5].setComponents(o, d, M, T).normalize();
    else
      throw new Error(
        "THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " +
          e
      );
    return this;
  }
  intersectsObject(t) {
    if (t.boundingSphere !== void 0)
      t.boundingSphere === null && t.computeBoundingSphere(),
        gn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);
    else {
      const e = t.geometry;
      e.boundingSphere === null && e.computeBoundingSphere(),
        gn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld);
    }
    return this.intersectsSphere(gn);
  }
  intersectsSprite(t) {
    return (
      gn.center.set(0, 0, 0),
      (gn.radius = 0.7071067811865476),
      gn.applyMatrix4(t.matrixWorld),
      this.intersectsSphere(gn)
    );
  }
  intersectsSphere(t) {
    const e = this.planes,
      n = t.center,
      r = -t.radius;
    for (let s = 0; s < 6; s++) if (e[s].distanceToPoint(n) < r) return !1;
    return !0;
  }
  intersectsBox(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++) {
      const r = e[n];
      if (
        ((zi.x = r.normal.x > 0 ? t.max.x : t.min.x),
        (zi.y = r.normal.y > 0 ? t.max.y : t.min.y),
        (zi.z = r.normal.z > 0 ? t.max.z : t.min.z),
        r.distanceToPoint(zi) < 0)
      )
        return !1;
    }
    return !0;
  }
  containsPoint(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++) if (e[n].distanceToPoint(t) < 0) return !1;
    return !0;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
function go() {
  let i = null,
    t = !1,
    e = null,
    n = null;
  function r(s, a) {
    e(s, a), (n = i.requestAnimationFrame(r));
  }
  return {
    start: function () {
      t !== !0 && e !== null && ((n = i.requestAnimationFrame(r)), (t = !0));
    },
    stop: function () {
      i.cancelAnimationFrame(n), (t = !1);
    },
    setAnimationLoop: function (s) {
      e = s;
    },
    setContext: function (s) {
      i = s;
    },
  };
}
function tc(i) {
  const t = new WeakMap();
  function e(o, l) {
    const c = o.array,
      u = o.usage,
      d = c.byteLength,
      f = i.createBuffer();
    i.bindBuffer(l, f), i.bufferData(l, c, u), o.onUploadCallback();
    let m;
    if (c instanceof Float32Array) m = i.FLOAT;
    else if (c instanceof Uint16Array)
      o.isFloat16BufferAttribute ? (m = i.HALF_FLOAT) : (m = i.UNSIGNED_SHORT);
    else if (c instanceof Int16Array) m = i.SHORT;
    else if (c instanceof Uint32Array) m = i.UNSIGNED_INT;
    else if (c instanceof Int32Array) m = i.INT;
    else if (c instanceof Int8Array) m = i.BYTE;
    else if (c instanceof Uint8Array) m = i.UNSIGNED_BYTE;
    else if (c instanceof Uint8ClampedArray) m = i.UNSIGNED_BYTE;
    else
      throw new Error(
        "THREE.WebGLAttributes: Unsupported buffer data format: " + c
      );
    return {
      buffer: f,
      type: m,
      bytesPerElement: c.BYTES_PER_ELEMENT,
      version: o.version,
      size: d,
    };
  }
  function n(o, l, c) {
    const u = l.array,
      d = l.updateRanges;
    if ((i.bindBuffer(c, o), d.length === 0)) i.bufferSubData(c, 0, u);
    else {
      d.sort((m, v) => m.start - v.start);
      let f = 0;
      for (let m = 1; m < d.length; m++) {
        const v = d[f],
          M = d[m];
        M.start <= v.start + v.count + 1
          ? (v.count = Math.max(v.count, M.start + M.count - v.start))
          : (++f, (d[f] = M));
      }
      d.length = f + 1;
      for (let m = 0, v = d.length; m < v; m++) {
        const M = d[m];
        i.bufferSubData(c, M.start * u.BYTES_PER_ELEMENT, u, M.start, M.count);
      }
      l.clearUpdateRanges();
    }
    l.onUploadCallback();
  }
  function r(o) {
    return o.isInterleavedBufferAttribute && (o = o.data), t.get(o);
  }
  function s(o) {
    o.isInterleavedBufferAttribute && (o = o.data);
    const l = t.get(o);
    l && (i.deleteBuffer(l.buffer), t.delete(o));
  }
  function a(o, l) {
    if (
      (o.isInterleavedBufferAttribute && (o = o.data), o.isGLBufferAttribute)
    ) {
      const u = t.get(o);
      (!u || u.version < o.version) &&
        t.set(o, {
          buffer: o.buffer,
          type: o.type,
          bytesPerElement: o.elementSize,
          version: o.version,
        });
      return;
    }
    const c = t.get(o);
    if (c === void 0) t.set(o, e(o, l));
    else if (c.version < o.version) {
      if (c.size !== o.array.byteLength)
        throw new Error(
          "THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported."
        );
      n(c.buffer, o, l), (c.version = o.version);
    }
  }
  return { get: r, remove: s, update: a };
}
class xi extends Cn {
  constructor(t = 1, e = 1, n = 1, r = 1) {
    super(),
      (this.type = "PlaneGeometry"),
      (this.parameters = {
        width: t,
        height: e,
        widthSegments: n,
        heightSegments: r,
      });
    const s = t / 2,
      a = e / 2,
      o = Math.floor(n),
      l = Math.floor(r),
      c = o + 1,
      u = l + 1,
      d = t / o,
      f = e / l,
      m = [],
      v = [],
      M = [],
      p = [];
    for (let h = 0; h < u; h++) {
      const b = h * f - a;
      for (let T = 0; T < c; T++) {
        const E = T * d - s;
        v.push(E, -b, 0), M.push(0, 0, 1), p.push(T / o), p.push(1 - h / l);
      }
    }
    for (let h = 0; h < l; h++)
      for (let b = 0; b < o; b++) {
        const T = b + c * h,
          E = b + c * (h + 1),
          O = b + 1 + c * (h + 1),
          C = b + 1 + c * h;
        m.push(T, E, C), m.push(E, O, C);
      }
    this.setIndex(m),
      this.setAttribute("position", new An(v, 3)),
      this.setAttribute("normal", new An(M, 3)),
      this.setAttribute("uv", new An(p, 2));
  }
  copy(t) {
    return (
      super.copy(t), (this.parameters = Object.assign({}, t.parameters)), this
    );
  }
  static fromJSON(t) {
    return new xi(t.width, t.height, t.widthSegments, t.heightSegments);
  }
}
var ec = `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,
  nc = `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,
  ic = `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,
  rc = `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,
  sc = `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,
  ac = `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,
  oc = `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,
  lc = `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,
  cc = `#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,
  hc = `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,
  uc = `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,
  dc = `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,
  fc = `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,
  pc = `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,
  mc = `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,
  _c = `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,
  gc = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,
  vc = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,
  xc = `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,
  Mc = `#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,
  Sc = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,
  Ec = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,
  yc = `#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,
  Tc = `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,
  bc = `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,
  Ac = `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,
  Rc = `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,
  wc = `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,
  Cc = `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,
  Pc = `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,
  Lc = "gl_FragColor = linearToOutputTexel( gl_FragColor );",
  Ic = `vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,
  Dc = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,
  Uc = `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,
  Nc = `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,
  Fc = `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,
  Oc = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,
  Bc = `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,
  zc = `#ifdef USE_FOG
	varying float vFogDepth;
#endif`,
  Hc = `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,
  Vc = `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,
  Gc = `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,
  kc = `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,
  Wc = `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,
  Xc = `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,
  qc = `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,
  Yc = `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,
  $c = `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,
  Kc = `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,
  Zc = `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,
  jc = `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,
  Jc = `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,
  Qc = `struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,
  th = `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,
  eh = `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,
  nh = `#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,
  ih = `#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,
  rh = `#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,
  sh = `#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,
  ah = `#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,
  oh = `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,
  lh = `#ifdef USE_MAP
	uniform sampler2D map;
#endif`,
  ch = `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,
  hh = `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,
  uh = `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,
  dh = `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,
  fh = `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,
  ph = `#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,
  mh = `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,
  _h = `#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,
  gh = `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,
  vh = `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,
  xh = `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,
  Mh = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,
  Sh = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,
  Eh = `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,
  yh = `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,
  Th = `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,
  bh = `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,
  Ah = `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,
  Rh = `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,
  wh = `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
  Ch = `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,
  Ph = `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,
  Lh = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,
  Ih = `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,
  Dh = `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,
  Uh = `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,
  Nh = `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,
  Fh = `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,
  Oh = `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,
  Bh = `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,
  zh = `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,
  Hh = `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,
  Vh = `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,
  Gh = `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,
  kh = `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,
  Wh = `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,
  Xh = `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,
  qh = `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,
  Yh = `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,
  $h = `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,
  Kh = `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,
  Zh = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,
  jh = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,
  Jh = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,
  Qh = `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;
const tu = `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,
  eu = `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
  nu = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,
  iu = `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
  ru = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,
  su = `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
  au = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,
  ou = `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,
  lu = `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,
  cu = `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,
  hu = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,
  uu = `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
  du = `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,
  fu = `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,
  pu = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,
  mu = `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  _u = `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
  gu = `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  vu = `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,
  xu = `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  Mu = `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,
  Su = `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,
  Eu = `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
  yu = `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  Tu = `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,
  bu = `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  Au = `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
  Ru = `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  wu = `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,
  Cu = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,
  Pu = `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
  Lu = `uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,
  Iu = `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,
  Du = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,
  It = {
    alphahash_fragment: ec,
    alphahash_pars_fragment: nc,
    alphamap_fragment: ic,
    alphamap_pars_fragment: rc,
    alphatest_fragment: sc,
    alphatest_pars_fragment: ac,
    aomap_fragment: oc,
    aomap_pars_fragment: lc,
    batching_pars_vertex: cc,
    batching_vertex: hc,
    begin_vertex: uc,
    beginnormal_vertex: dc,
    bsdfs: fc,
    iridescence_fragment: pc,
    bumpmap_pars_fragment: mc,
    clipping_planes_fragment: _c,
    clipping_planes_pars_fragment: gc,
    clipping_planes_pars_vertex: vc,
    clipping_planes_vertex: xc,
    color_fragment: Mc,
    color_pars_fragment: Sc,
    color_pars_vertex: Ec,
    color_vertex: yc,
    common: Tc,
    cube_uv_reflection_fragment: bc,
    defaultnormal_vertex: Ac,
    displacementmap_pars_vertex: Rc,
    displacementmap_vertex: wc,
    emissivemap_fragment: Cc,
    emissivemap_pars_fragment: Pc,
    colorspace_fragment: Lc,
    colorspace_pars_fragment: Ic,
    envmap_fragment: Dc,
    envmap_common_pars_fragment: Uc,
    envmap_pars_fragment: Nc,
    envmap_pars_vertex: Fc,
    envmap_physical_pars_fragment: Yc,
    envmap_vertex: Oc,
    fog_vertex: Bc,
    fog_pars_vertex: zc,
    fog_fragment: Hc,
    fog_pars_fragment: Vc,
    gradientmap_pars_fragment: Gc,
    lightmap_pars_fragment: kc,
    lights_lambert_fragment: Wc,
    lights_lambert_pars_fragment: Xc,
    lights_pars_begin: qc,
    lights_toon_fragment: $c,
    lights_toon_pars_fragment: Kc,
    lights_phong_fragment: Zc,
    lights_phong_pars_fragment: jc,
    lights_physical_fragment: Jc,
    lights_physical_pars_fragment: Qc,
    lights_fragment_begin: th,
    lights_fragment_maps: eh,
    lights_fragment_end: nh,
    logdepthbuf_fragment: ih,
    logdepthbuf_pars_fragment: rh,
    logdepthbuf_pars_vertex: sh,
    logdepthbuf_vertex: ah,
    map_fragment: oh,
    map_pars_fragment: lh,
    map_particle_fragment: ch,
    map_particle_pars_fragment: hh,
    metalnessmap_fragment: uh,
    metalnessmap_pars_fragment: dh,
    morphinstance_vertex: fh,
    morphcolor_vertex: ph,
    morphnormal_vertex: mh,
    morphtarget_pars_vertex: _h,
    morphtarget_vertex: gh,
    normal_fragment_begin: vh,
    normal_fragment_maps: xh,
    normal_pars_fragment: Mh,
    normal_pars_vertex: Sh,
    normal_vertex: Eh,
    normalmap_pars_fragment: yh,
    clearcoat_normal_fragment_begin: Th,
    clearcoat_normal_fragment_maps: bh,
    clearcoat_pars_fragment: Ah,
    iridescence_pars_fragment: Rh,
    opaque_fragment: wh,
    packing: Ch,
    premultiplied_alpha_fragment: Ph,
    project_vertex: Lh,
    dithering_fragment: Ih,
    dithering_pars_fragment: Dh,
    roughnessmap_fragment: Uh,
    roughnessmap_pars_fragment: Nh,
    shadowmap_pars_fragment: Fh,
    shadowmap_pars_vertex: Oh,
    shadowmap_vertex: Bh,
    shadowmask_pars_fragment: zh,
    skinbase_vertex: Hh,
    skinning_pars_vertex: Vh,
    skinning_vertex: Gh,
    skinnormal_vertex: kh,
    specularmap_fragment: Wh,
    specularmap_pars_fragment: Xh,
    tonemapping_fragment: qh,
    tonemapping_pars_fragment: Yh,
    transmission_fragment: $h,
    transmission_pars_fragment: Kh,
    uv_pars_fragment: Zh,
    uv_pars_vertex: jh,
    uv_vertex: Jh,
    worldpos_vertex: Qh,
    background_vert: tu,
    background_frag: eu,
    backgroundCube_vert: nu,
    backgroundCube_frag: iu,
    cube_vert: ru,
    cube_frag: su,
    depth_vert: au,
    depth_frag: ou,
    distanceRGBA_vert: lu,
    distanceRGBA_frag: cu,
    equirect_vert: hu,
    equirect_frag: uu,
    linedashed_vert: du,
    linedashed_frag: fu,
    meshbasic_vert: pu,
    meshbasic_frag: mu,
    meshlambert_vert: _u,
    meshlambert_frag: gu,
    meshmatcap_vert: vu,
    meshmatcap_frag: xu,
    meshnormal_vert: Mu,
    meshnormal_frag: Su,
    meshphong_vert: Eu,
    meshphong_frag: yu,
    meshphysical_vert: Tu,
    meshphysical_frag: bu,
    meshtoon_vert: Au,
    meshtoon_frag: Ru,
    points_vert: wu,
    points_frag: Cu,
    shadow_vert: Pu,
    shadow_frag: Lu,
    sprite_vert: Iu,
    sprite_frag: Du,
  },
  nt = {
    common: {
      diffuse: { value: new qt(16777215) },
      opacity: { value: 1 },
      map: { value: null },
      mapTransform: { value: new Pt() },
      alphaMap: { value: null },
      alphaMapTransform: { value: new Pt() },
      alphaTest: { value: 0 },
    },
    specularmap: {
      specularMap: { value: null },
      specularMapTransform: { value: new Pt() },
    },
    envmap: {
      envMap: { value: null },
      envMapRotation: { value: new Pt() },
      flipEnvMap: { value: -1 },
      reflectivity: { value: 1 },
      ior: { value: 1.5 },
      refractionRatio: { value: 0.98 },
    },
    aomap: {
      aoMap: { value: null },
      aoMapIntensity: { value: 1 },
      aoMapTransform: { value: new Pt() },
    },
    lightmap: {
      lightMap: { value: null },
      lightMapIntensity: { value: 1 },
      lightMapTransform: { value: new Pt() },
    },
    bumpmap: {
      bumpMap: { value: null },
      bumpMapTransform: { value: new Pt() },
      bumpScale: { value: 1 },
    },
    normalmap: {
      normalMap: { value: null },
      normalMapTransform: { value: new Pt() },
      normalScale: { value: new Yt(1, 1) },
    },
    displacementmap: {
      displacementMap: { value: null },
      displacementMapTransform: { value: new Pt() },
      displacementScale: { value: 1 },
      displacementBias: { value: 0 },
    },
    emissivemap: {
      emissiveMap: { value: null },
      emissiveMapTransform: { value: new Pt() },
    },
    metalnessmap: {
      metalnessMap: { value: null },
      metalnessMapTransform: { value: new Pt() },
    },
    roughnessmap: {
      roughnessMap: { value: null },
      roughnessMapTransform: { value: new Pt() },
    },
    gradientmap: { gradientMap: { value: null } },
    fog: {
      fogDensity: { value: 25e-5 },
      fogNear: { value: 1 },
      fogFar: { value: 2e3 },
      fogColor: { value: new qt(16777215) },
    },
    lights: {
      ambientLightColor: { value: [] },
      lightProbe: { value: [] },
      directionalLights: {
        value: [],
        properties: { direction: {}, color: {} },
      },
      directionalLightShadows: {
        value: [],
        properties: {
          shadowIntensity: 1,
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {},
        },
      },
      directionalShadowMap: { value: [] },
      directionalShadowMatrix: { value: [] },
      spotLights: {
        value: [],
        properties: {
          color: {},
          position: {},
          direction: {},
          distance: {},
          coneCos: {},
          penumbraCos: {},
          decay: {},
        },
      },
      spotLightShadows: {
        value: [],
        properties: {
          shadowIntensity: 1,
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {},
        },
      },
      spotLightMap: { value: [] },
      spotShadowMap: { value: [] },
      spotLightMatrix: { value: [] },
      pointLights: {
        value: [],
        properties: { color: {}, position: {}, decay: {}, distance: {} },
      },
      pointLightShadows: {
        value: [],
        properties: {
          shadowIntensity: 1,
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {},
          shadowCameraNear: {},
          shadowCameraFar: {},
        },
      },
      pointShadowMap: { value: [] },
      pointShadowMatrix: { value: [] },
      hemisphereLights: {
        value: [],
        properties: { direction: {}, skyColor: {}, groundColor: {} },
      },
      rectAreaLights: {
        value: [],
        properties: { color: {}, position: {}, width: {}, height: {} },
      },
      ltc_1: { value: null },
      ltc_2: { value: null },
    },
    points: {
      diffuse: { value: new qt(16777215) },
      opacity: { value: 1 },
      size: { value: 1 },
      scale: { value: 1 },
      map: { value: null },
      alphaMap: { value: null },
      alphaMapTransform: { value: new Pt() },
      alphaTest: { value: 0 },
      uvTransform: { value: new Pt() },
    },
    sprite: {
      diffuse: { value: new qt(16777215) },
      opacity: { value: 1 },
      center: { value: new Yt(0.5, 0.5) },
      rotation: { value: 0 },
      map: { value: null },
      mapTransform: { value: new Pt() },
      alphaMap: { value: null },
      alphaMapTransform: { value: new Pt() },
      alphaTest: { value: 0 },
    },
  },
  Ne = {
    basic: {
      uniforms: ue([
        nt.common,
        nt.specularmap,
        nt.envmap,
        nt.aomap,
        nt.lightmap,
        nt.fog,
      ]),
      vertexShader: It.meshbasic_vert,
      fragmentShader: It.meshbasic_frag,
    },
    lambert: {
      uniforms: ue([
        nt.common,
        nt.specularmap,
        nt.envmap,
        nt.aomap,
        nt.lightmap,
        nt.emissivemap,
        nt.bumpmap,
        nt.normalmap,
        nt.displacementmap,
        nt.fog,
        nt.lights,
        { emissive: { value: new qt(0) } },
      ]),
      vertexShader: It.meshlambert_vert,
      fragmentShader: It.meshlambert_frag,
    },
    phong: {
      uniforms: ue([
        nt.common,
        nt.specularmap,
        nt.envmap,
        nt.aomap,
        nt.lightmap,
        nt.emissivemap,
        nt.bumpmap,
        nt.normalmap,
        nt.displacementmap,
        nt.fog,
        nt.lights,
        {
          emissive: { value: new qt(0) },
          specular: { value: new qt(1118481) },
          shininess: { value: 30 },
        },
      ]),
      vertexShader: It.meshphong_vert,
      fragmentShader: It.meshphong_frag,
    },
    standard: {
      uniforms: ue([
        nt.common,
        nt.envmap,
        nt.aomap,
        nt.lightmap,
        nt.emissivemap,
        nt.bumpmap,
        nt.normalmap,
        nt.displacementmap,
        nt.roughnessmap,
        nt.metalnessmap,
        nt.fog,
        nt.lights,
        {
          emissive: { value: new qt(0) },
          roughness: { value: 1 },
          metalness: { value: 0 },
          envMapIntensity: { value: 1 },
        },
      ]),
      vertexShader: It.meshphysical_vert,
      fragmentShader: It.meshphysical_frag,
    },
    toon: {
      uniforms: ue([
        nt.common,
        nt.aomap,
        nt.lightmap,
        nt.emissivemap,
        nt.bumpmap,
        nt.normalmap,
        nt.displacementmap,
        nt.gradientmap,
        nt.fog,
        nt.lights,
        { emissive: { value: new qt(0) } },
      ]),
      vertexShader: It.meshtoon_vert,
      fragmentShader: It.meshtoon_frag,
    },
    matcap: {
      uniforms: ue([
        nt.common,
        nt.bumpmap,
        nt.normalmap,
        nt.displacementmap,
        nt.fog,
        { matcap: { value: null } },
      ]),
      vertexShader: It.meshmatcap_vert,
      fragmentShader: It.meshmatcap_frag,
    },
    points: {
      uniforms: ue([nt.points, nt.fog]),
      vertexShader: It.points_vert,
      fragmentShader: It.points_frag,
    },
    dashed: {
      uniforms: ue([
        nt.common,
        nt.fog,
        {
          scale: { value: 1 },
          dashSize: { value: 1 },
          totalSize: { value: 2 },
        },
      ]),
      vertexShader: It.linedashed_vert,
      fragmentShader: It.linedashed_frag,
    },
    depth: {
      uniforms: ue([nt.common, nt.displacementmap]),
      vertexShader: It.depth_vert,
      fragmentShader: It.depth_frag,
    },
    normal: {
      uniforms: ue([
        nt.common,
        nt.bumpmap,
        nt.normalmap,
        nt.displacementmap,
        { opacity: { value: 1 } },
      ]),
      vertexShader: It.meshnormal_vert,
      fragmentShader: It.meshnormal_frag,
    },
    sprite: {
      uniforms: ue([nt.sprite, nt.fog]),
      vertexShader: It.sprite_vert,
      fragmentShader: It.sprite_frag,
    },
    background: {
      uniforms: {
        uvTransform: { value: new Pt() },
        t2D: { value: null },
        backgroundIntensity: { value: 1 },
      },
      vertexShader: It.background_vert,
      fragmentShader: It.background_frag,
    },
    backgroundCube: {
      uniforms: {
        envMap: { value: null },
        flipEnvMap: { value: -1 },
        backgroundBlurriness: { value: 0 },
        backgroundIntensity: { value: 1 },
        backgroundRotation: { value: new Pt() },
      },
      vertexShader: It.backgroundCube_vert,
      fragmentShader: It.backgroundCube_frag,
    },
    cube: {
      uniforms: {
        tCube: { value: null },
        tFlip: { value: -1 },
        opacity: { value: 1 },
      },
      vertexShader: It.cube_vert,
      fragmentShader: It.cube_frag,
    },
    equirect: {
      uniforms: { tEquirect: { value: null } },
      vertexShader: It.equirect_vert,
      fragmentShader: It.equirect_frag,
    },
    distanceRGBA: {
      uniforms: ue([
        nt.common,
        nt.displacementmap,
        {
          referencePosition: { value: new B() },
          nearDistance: { value: 1 },
          farDistance: { value: 1e3 },
        },
      ]),
      vertexShader: It.distanceRGBA_vert,
      fragmentShader: It.distanceRGBA_frag,
    },
    shadow: {
      uniforms: ue([
        nt.lights,
        nt.fog,
        { color: { value: new qt(0) }, opacity: { value: 1 } },
      ]),
      vertexShader: It.shadow_vert,
      fragmentShader: It.shadow_frag,
    },
  };
Ne.physical = {
  uniforms: ue([
    Ne.standard.uniforms,
    {
      clearcoat: { value: 0 },
      clearcoatMap: { value: null },
      clearcoatMapTransform: { value: new Pt() },
      clearcoatNormalMap: { value: null },
      clearcoatNormalMapTransform: { value: new Pt() },
      clearcoatNormalScale: { value: new Yt(1, 1) },
      clearcoatRoughness: { value: 0 },
      clearcoatRoughnessMap: { value: null },
      clearcoatRoughnessMapTransform: { value: new Pt() },
      dispersion: { value: 0 },
      iridescence: { value: 0 },
      iridescenceMap: { value: null },
      iridescenceMapTransform: { value: new Pt() },
      iridescenceIOR: { value: 1.3 },
      iridescenceThicknessMinimum: { value: 100 },
      iridescenceThicknessMaximum: { value: 400 },
      iridescenceThicknessMap: { value: null },
      iridescenceThicknessMapTransform: { value: new Pt() },
      sheen: { value: 0 },
      sheenColor: { value: new qt(0) },
      sheenColorMap: { value: null },
      sheenColorMapTransform: { value: new Pt() },
      sheenRoughness: { value: 1 },
      sheenRoughnessMap: { value: null },
      sheenRoughnessMapTransform: { value: new Pt() },
      transmission: { value: 0 },
      transmissionMap: { value: null },
      transmissionMapTransform: { value: new Pt() },
      transmissionSamplerSize: { value: new Yt() },
      transmissionSamplerMap: { value: null },
      thickness: { value: 0 },
      thicknessMap: { value: null },
      thicknessMapTransform: { value: new Pt() },
      attenuationDistance: { value: 0 },
      attenuationColor: { value: new qt(0) },
      specularColor: { value: new qt(1, 1, 1) },
      specularColorMap: { value: null },
      specularColorMapTransform: { value: new Pt() },
      specularIntensity: { value: 1 },
      specularIntensityMap: { value: null },
      specularIntensityMapTransform: { value: new Pt() },
      anisotropyVector: { value: new Yt() },
      anisotropyMap: { value: null },
      anisotropyMapTransform: { value: new Pt() },
    },
  ]),
  vertexShader: It.meshphysical_vert,
  fragmentShader: It.meshphysical_frag,
};
const Hi = { r: 0, b: 0, g: 0 },
  vn = new Je(),
  Uu = new re();
function Nu(i, t, e, n, r, s, a) {
  const o = new qt(0);
  let l = s === !0 ? 0 : 1,
    c,
    u,
    d = null,
    f = 0,
    m = null;
  function v(b) {
    let T = b.isScene === !0 ? b.background : null;
    return (
      T && T.isTexture && (T = (b.backgroundBlurriness > 0 ? e : t).get(T)), T
    );
  }
  function M(b) {
    let T = !1;
    const E = v(b);
    E === null ? h(o, l) : E && E.isColor && (h(E, 1), (T = !0));
    const O = i.xr.getEnvironmentBlendMode();
    O === "additive"
      ? n.buffers.color.setClear(0, 0, 0, 1, a)
      : O === "alpha-blend" && n.buffers.color.setClear(0, 0, 0, 0, a),
      (i.autoClear || T) &&
        (n.buffers.depth.setTest(!0),
        n.buffers.depth.setMask(!0),
        n.buffers.color.setMask(!0),
        i.clear(i.autoClearColor, i.autoClearDepth, i.autoClearStencil));
  }
  function p(b, T) {
    const E = v(T);
    E && (E.isCubeTexture || E.mapping === Qi)
      ? (u === void 0 &&
          ((u = new Oe(
            new vi(1, 1, 1),
            new dn({
              name: "BackgroundCubeMaterial",
              uniforms: ti(Ne.backgroundCube.uniforms),
              vertexShader: Ne.backgroundCube.vertexShader,
              fragmentShader: Ne.backgroundCube.fragmentShader,
              side: me,
              depthTest: !1,
              depthWrite: !1,
              fog: !1,
            })
          )),
          u.geometry.deleteAttribute("normal"),
          u.geometry.deleteAttribute("uv"),
          (u.onBeforeRender = function (O, C, A) {
            this.matrixWorld.copyPosition(A.matrixWorld);
          }),
          Object.defineProperty(u.material, "envMap", {
            get: function () {
              return this.uniforms.envMap.value;
            },
          }),
          r.update(u)),
        vn.copy(T.backgroundRotation),
        (vn.x *= -1),
        (vn.y *= -1),
        (vn.z *= -1),
        E.isCubeTexture &&
          E.isRenderTargetTexture === !1 &&
          ((vn.y *= -1), (vn.z *= -1)),
        (u.material.uniforms.envMap.value = E),
        (u.material.uniforms.flipEnvMap.value =
          E.isCubeTexture && E.isRenderTargetTexture === !1 ? -1 : 1),
        (u.material.uniforms.backgroundBlurriness.value =
          T.backgroundBlurriness),
        (u.material.uniforms.backgroundIntensity.value = T.backgroundIntensity),
        u.material.uniforms.backgroundRotation.value.setFromMatrix4(
          Uu.makeRotationFromEuler(vn)
        ),
        (u.material.toneMapped = zt.getTransfer(E.colorSpace) !== Xt),
        (d !== E || f !== E.version || m !== i.toneMapping) &&
          ((u.material.needsUpdate = !0),
          (d = E),
          (f = E.version),
          (m = i.toneMapping)),
        u.layers.enableAll(),
        b.unshift(u, u.geometry, u.material, 0, 0, null))
      : E &&
        E.isTexture &&
        (c === void 0 &&
          ((c = new Oe(
            new xi(2, 2),
            new dn({
              name: "BackgroundMaterial",
              uniforms: ti(Ne.background.uniforms),
              vertexShader: Ne.background.vertexShader,
              fragmentShader: Ne.background.fragmentShader,
              side: un,
              depthTest: !1,
              depthWrite: !1,
              fog: !1,
            })
          )),
          c.geometry.deleteAttribute("normal"),
          Object.defineProperty(c.material, "map", {
            get: function () {
              return this.uniforms.t2D.value;
            },
          }),
          r.update(c)),
        (c.material.uniforms.t2D.value = E),
        (c.material.uniforms.backgroundIntensity.value = T.backgroundIntensity),
        (c.material.toneMapped = zt.getTransfer(E.colorSpace) !== Xt),
        E.matrixAutoUpdate === !0 && E.updateMatrix(),
        c.material.uniforms.uvTransform.value.copy(E.matrix),
        (d !== E || f !== E.version || m !== i.toneMapping) &&
          ((c.material.needsUpdate = !0),
          (d = E),
          (f = E.version),
          (m = i.toneMapping)),
        c.layers.enableAll(),
        b.unshift(c, c.geometry, c.material, 0, 0, null));
  }
  function h(b, T) {
    b.getRGB(Hi, fo(i)), n.buffers.color.setClear(Hi.r, Hi.g, Hi.b, T, a);
  }
  return {
    getClearColor: function () {
      return o;
    },
    setClearColor: function (b, T = 1) {
      o.set(b), (l = T), h(o, l);
    },
    getClearAlpha: function () {
      return l;
    },
    setClearAlpha: function (b) {
      (l = b), h(o, l);
    },
    render: M,
    addToRenderList: p,
  };
}
function Fu(i, t) {
  const e = i.getParameter(i.MAX_VERTEX_ATTRIBS),
    n = {},
    r = f(null);
  let s = r,
    a = !1;
  function o(x, R, G, H, $) {
    let K = !1;
    const X = d(H, G, R);
    s !== X && ((s = X), c(s.object)),
      (K = m(x, H, G, $)),
      K && v(x, H, G, $),
      $ !== null && t.update($, i.ELEMENT_ARRAY_BUFFER),
      (K || a) &&
        ((a = !1),
        E(x, R, G, H),
        $ !== null && i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, t.get($).buffer));
  }
  function l() {
    return i.createVertexArray();
  }
  function c(x) {
    return i.bindVertexArray(x);
  }
  function u(x) {
    return i.deleteVertexArray(x);
  }
  function d(x, R, G) {
    const H = G.wireframe === !0;
    let $ = n[x.id];
    $ === void 0 && (($ = {}), (n[x.id] = $));
    let K = $[R.id];
    K === void 0 && ((K = {}), ($[R.id] = K));
    let X = K[H];
    return X === void 0 && ((X = f(l())), (K[H] = X)), X;
  }
  function f(x) {
    const R = [],
      G = [],
      H = [];
    for (let $ = 0; $ < e; $++) (R[$] = 0), (G[$] = 0), (H[$] = 0);
    return {
      geometry: null,
      program: null,
      wireframe: !1,
      newAttributes: R,
      enabledAttributes: G,
      attributeDivisors: H,
      object: x,
      attributes: {},
      index: null,
    };
  }
  function m(x, R, G, H) {
    const $ = s.attributes,
      K = R.attributes;
    let X = 0;
    const Z = G.getAttributes();
    for (const z in Z)
      if (Z[z].location >= 0) {
        const ct = $[z];
        let _t = K[z];
        if (
          (_t === void 0 &&
            (z === "instanceMatrix" &&
              x.instanceMatrix &&
              (_t = x.instanceMatrix),
            z === "instanceColor" && x.instanceColor && (_t = x.instanceColor)),
          ct === void 0 || ct.attribute !== _t || (_t && ct.data !== _t.data))
        )
          return !0;
        X++;
      }
    return s.attributesNum !== X || s.index !== H;
  }
  function v(x, R, G, H) {
    const $ = {},
      K = R.attributes;
    let X = 0;
    const Z = G.getAttributes();
    for (const z in Z)
      if (Z[z].location >= 0) {
        let ct = K[z];
        ct === void 0 &&
          (z === "instanceMatrix" &&
            x.instanceMatrix &&
            (ct = x.instanceMatrix),
          z === "instanceColor" && x.instanceColor && (ct = x.instanceColor));
        const _t = {};
        (_t.attribute = ct),
          ct && ct.data && (_t.data = ct.data),
          ($[z] = _t),
          X++;
      }
    (s.attributes = $), (s.attributesNum = X), (s.index = H);
  }
  function M() {
    const x = s.newAttributes;
    for (let R = 0, G = x.length; R < G; R++) x[R] = 0;
  }
  function p(x) {
    h(x, 0);
  }
  function h(x, R) {
    const G = s.newAttributes,
      H = s.enabledAttributes,
      $ = s.attributeDivisors;
    (G[x] = 1),
      H[x] === 0 && (i.enableVertexAttribArray(x), (H[x] = 1)),
      $[x] !== R && (i.vertexAttribDivisor(x, R), ($[x] = R));
  }
  function b() {
    const x = s.newAttributes,
      R = s.enabledAttributes;
    for (let G = 0, H = R.length; G < H; G++)
      R[G] !== x[G] && (i.disableVertexAttribArray(G), (R[G] = 0));
  }
  function T(x, R, G, H, $, K, X) {
    X === !0
      ? i.vertexAttribIPointer(x, R, G, $, K)
      : i.vertexAttribPointer(x, R, G, H, $, K);
  }
  function E(x, R, G, H) {
    M();
    const $ = H.attributes,
      K = G.getAttributes(),
      X = R.defaultAttributeValues;
    for (const Z in K) {
      const z = K[Z];
      if (z.location >= 0) {
        let et = $[Z];
        if (
          (et === void 0 &&
            (Z === "instanceMatrix" &&
              x.instanceMatrix &&
              (et = x.instanceMatrix),
            Z === "instanceColor" && x.instanceColor && (et = x.instanceColor)),
          et !== void 0)
        ) {
          const ct = et.normalized,
            _t = et.itemSize,
            Rt = t.get(et);
          if (Rt === void 0) continue;
          const Vt = Rt.buffer,
            W = Rt.type,
            tt = Rt.bytesPerElement,
            gt = W === i.INT || W === i.UNSIGNED_INT || et.gpuType === Ts;
          if (et.isInterleavedBufferAttribute) {
            const rt = et.data,
              yt = rt.stride,
              At = et.offset;
            if (rt.isInstancedInterleavedBuffer) {
              for (let Dt = 0; Dt < z.locationSize; Dt++)
                h(z.location + Dt, rt.meshPerAttribute);
              x.isInstancedMesh !== !0 &&
                H._maxInstanceCount === void 0 &&
                (H._maxInstanceCount = rt.meshPerAttribute * rt.count);
            } else
              for (let Dt = 0; Dt < z.locationSize; Dt++) p(z.location + Dt);
            i.bindBuffer(i.ARRAY_BUFFER, Vt);
            for (let Dt = 0; Dt < z.locationSize; Dt++)
              T(
                z.location + Dt,
                _t / z.locationSize,
                W,
                ct,
                yt * tt,
                (At + (_t / z.locationSize) * Dt) * tt,
                gt
              );
          } else {
            if (et.isInstancedBufferAttribute) {
              for (let rt = 0; rt < z.locationSize; rt++)
                h(z.location + rt, et.meshPerAttribute);
              x.isInstancedMesh !== !0 &&
                H._maxInstanceCount === void 0 &&
                (H._maxInstanceCount = et.meshPerAttribute * et.count);
            } else
              for (let rt = 0; rt < z.locationSize; rt++) p(z.location + rt);
            i.bindBuffer(i.ARRAY_BUFFER, Vt);
            for (let rt = 0; rt < z.locationSize; rt++)
              T(
                z.location + rt,
                _t / z.locationSize,
                W,
                ct,
                _t * tt,
                (_t / z.locationSize) * rt * tt,
                gt
              );
          }
        } else if (X !== void 0) {
          const ct = X[Z];
          if (ct !== void 0)
            switch (ct.length) {
              case 2:
                i.vertexAttrib2fv(z.location, ct);
                break;
              case 3:
                i.vertexAttrib3fv(z.location, ct);
                break;
              case 4:
                i.vertexAttrib4fv(z.location, ct);
                break;
              default:
                i.vertexAttrib1fv(z.location, ct);
            }
        }
      }
    }
    b();
  }
  function O() {
    D();
    for (const x in n) {
      const R = n[x];
      for (const G in R) {
        const H = R[G];
        for (const $ in H) u(H[$].object), delete H[$];
        delete R[G];
      }
      delete n[x];
    }
  }
  function C(x) {
    if (n[x.id] === void 0) return;
    const R = n[x.id];
    for (const G in R) {
      const H = R[G];
      for (const $ in H) u(H[$].object), delete H[$];
      delete R[G];
    }
    delete n[x.id];
  }
  function A(x) {
    for (const R in n) {
      const G = n[R];
      if (G[x.id] === void 0) continue;
      const H = G[x.id];
      for (const $ in H) u(H[$].object), delete H[$];
      delete G[x.id];
    }
  }
  function D() {
    S(), (a = !0), s !== r && ((s = r), c(s.object));
  }
  function S() {
    (r.geometry = null), (r.program = null), (r.wireframe = !1);
  }
  return {
    setup: o,
    reset: D,
    resetDefaultState: S,
    dispose: O,
    releaseStatesOfGeometry: C,
    releaseStatesOfProgram: A,
    initAttributes: M,
    enableAttribute: p,
    disableUnusedAttributes: b,
  };
}
function Ou(i, t, e) {
  let n;
  function r(c) {
    n = c;
  }
  function s(c, u) {
    i.drawArrays(n, c, u), e.update(u, n, 1);
  }
  function a(c, u, d) {
    d !== 0 && (i.drawArraysInstanced(n, c, u, d), e.update(u, n, d));
  }
  function o(c, u, d) {
    if (d === 0) return;
    t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n, c, 0, u, 0, d);
    let m = 0;
    for (let v = 0; v < d; v++) m += u[v];
    e.update(m, n, 1);
  }
  function l(c, u, d, f) {
    if (d === 0) return;
    const m = t.get("WEBGL_multi_draw");
    if (m === null) for (let v = 0; v < c.length; v++) a(c[v], u[v], f[v]);
    else {
      m.multiDrawArraysInstancedWEBGL(n, c, 0, u, 0, f, 0, d);
      let v = 0;
      for (let M = 0; M < d; M++) v += u[M] * f[M];
      e.update(v, n, 1);
    }
  }
  (this.setMode = r),
    (this.render = s),
    (this.renderInstances = a),
    (this.renderMultiDraw = o),
    (this.renderMultiDrawInstances = l);
}
function Bu(i, t, e, n) {
  let r;
  function s() {
    if (r !== void 0) return r;
    if (t.has("EXT_texture_filter_anisotropic") === !0) {
      const A = t.get("EXT_texture_filter_anisotropic");
      r = i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    } else r = 0;
    return r;
  }
  function a(A) {
    return !(
      A !== Ie &&
      n.convert(A) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT)
    );
  }
  function o(A) {
    const D =
      A === pi &&
      (t.has("EXT_color_buffer_half_float") || t.has("EXT_color_buffer_float"));
    return !(
      A !== je &&
      n.convert(A) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE) &&
      A !== $e &&
      !D
    );
  }
  function l(A) {
    if (A === "highp") {
      if (
        i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.HIGH_FLOAT).precision >
          0 &&
        i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.HIGH_FLOAT).precision >
          0
      )
        return "highp";
      A = "mediump";
    }
    return A === "mediump" &&
      i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.MEDIUM_FLOAT).precision >
        0 &&
      i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.MEDIUM_FLOAT).precision >
        0
      ? "mediump"
      : "lowp";
  }
  let c = e.precision !== void 0 ? e.precision : "highp";
  const u = l(c);
  u !== c &&
    (console.warn(
      "THREE.WebGLRenderer:",
      c,
      "not supported, using",
      u,
      "instead."
    ),
    (c = u));
  const d = e.logarithmicDepthBuffer === !0,
    f = e.reverseDepthBuffer === !0 && t.has("EXT_clip_control"),
    m = i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),
    v = i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
    M = i.getParameter(i.MAX_TEXTURE_SIZE),
    p = i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),
    h = i.getParameter(i.MAX_VERTEX_ATTRIBS),
    b = i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),
    T = i.getParameter(i.MAX_VARYING_VECTORS),
    E = i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),
    O = v > 0,
    C = i.getParameter(i.MAX_SAMPLES);
  return {
    isWebGL2: !0,
    getMaxAnisotropy: s,
    getMaxPrecision: l,
    textureFormatReadable: a,
    textureTypeReadable: o,
    precision: c,
    logarithmicDepthBuffer: d,
    reverseDepthBuffer: f,
    maxTextures: m,
    maxVertexTextures: v,
    maxTextureSize: M,
    maxCubemapSize: p,
    maxAttributes: h,
    maxVertexUniforms: b,
    maxVaryings: T,
    maxFragmentUniforms: E,
    vertexTextures: O,
    maxSamples: C,
  };
}
function zu(i) {
  const t = this;
  let e = null,
    n = 0,
    r = !1,
    s = !1;
  const a = new Mn(),
    o = new Pt(),
    l = { value: null, needsUpdate: !1 };
  (this.uniform = l),
    (this.numPlanes = 0),
    (this.numIntersection = 0),
    (this.init = function (d, f) {
      const m = d.length !== 0 || f || n !== 0 || r;
      return (r = f), (n = d.length), m;
    }),
    (this.beginShadows = function () {
      (s = !0), u(null);
    }),
    (this.endShadows = function () {
      s = !1;
    }),
    (this.setGlobalState = function (d, f) {
      e = u(d, f, 0);
    }),
    (this.setState = function (d, f, m) {
      const v = d.clippingPlanes,
        M = d.clipIntersection,
        p = d.clipShadows,
        h = i.get(d);
      if (!r || v === null || v.length === 0 || (s && !p)) s ? u(null) : c();
      else {
        const b = s ? 0 : n,
          T = b * 4;
        let E = h.clippingState || null;
        (l.value = E), (E = u(v, f, T, m));
        for (let O = 0; O !== T; ++O) E[O] = e[O];
        (h.clippingState = E),
          (this.numIntersection = M ? this.numPlanes : 0),
          (this.numPlanes += b);
      }
    });
  function c() {
    l.value !== e && ((l.value = e), (l.needsUpdate = n > 0)),
      (t.numPlanes = n),
      (t.numIntersection = 0);
  }
  function u(d, f, m, v) {
    const M = d !== null ? d.length : 0;
    let p = null;
    if (M !== 0) {
      if (((p = l.value), v !== !0 || p === null)) {
        const h = m + M * 4,
          b = f.matrixWorldInverse;
        o.getNormalMatrix(b),
          (p === null || p.length < h) && (p = new Float32Array(h));
        for (let T = 0, E = m; T !== M; ++T, E += 4)
          a.copy(d[T]).applyMatrix4(b, o),
            a.normal.toArray(p, E),
            (p[E + 3] = a.constant);
      }
      (l.value = p), (l.needsUpdate = !0);
    }
    return (t.numPlanes = M), (t.numIntersection = 0), p;
  }
}
function Hu(i) {
  let t = new WeakMap();
  function e(a, o) {
    return o === Xr ? (a.mapping = Zn) : o === qr && (a.mapping = jn), a;
  }
  function n(a) {
    if (a && a.isTexture) {
      const o = a.mapping;
      if (o === Xr || o === qr)
        if (t.has(a)) {
          const l = t.get(a).texture;
          return e(l, a.mapping);
        } else {
          const l = a.image;
          if (l && l.height > 0) {
            const c = new jl(l.height);
            return (
              c.fromEquirectangularTexture(i, a),
              t.set(a, c),
              a.addEventListener("dispose", r),
              e(c.texture, a.mapping)
            );
          } else return null;
        }
    }
    return a;
  }
  function r(a) {
    const o = a.target;
    o.removeEventListener("dispose", r);
    const l = t.get(o);
    l !== void 0 && (t.delete(o), l.dispose());
  }
  function s() {
    t = new WeakMap();
  }
  return { get: n, dispose: s };
}
class Vu extends po {
  constructor(t = -1, e = 1, n = 1, r = -1, s = 0.1, a = 2e3) {
    super(),
      (this.isOrthographicCamera = !0),
      (this.type = "OrthographicCamera"),
      (this.zoom = 1),
      (this.view = null),
      (this.left = t),
      (this.right = e),
      (this.top = n),
      (this.bottom = r),
      (this.near = s),
      (this.far = a),
      this.updateProjectionMatrix();
  }
  copy(t, e) {
    return (
      super.copy(t, e),
      (this.left = t.left),
      (this.right = t.right),
      (this.top = t.top),
      (this.bottom = t.bottom),
      (this.near = t.near),
      (this.far = t.far),
      (this.zoom = t.zoom),
      (this.view = t.view === null ? null : Object.assign({}, t.view)),
      this
    );
  }
  setViewOffset(t, e, n, r, s, a) {
    this.view === null &&
      (this.view = {
        enabled: !0,
        fullWidth: 1,
        fullHeight: 1,
        offsetX: 0,
        offsetY: 0,
        width: 1,
        height: 1,
      }),
      (this.view.enabled = !0),
      (this.view.fullWidth = t),
      (this.view.fullHeight = e),
      (this.view.offsetX = n),
      (this.view.offsetY = r),
      (this.view.width = s),
      (this.view.height = a),
      this.updateProjectionMatrix();
  }
  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1),
      this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const t = (this.right - this.left) / (2 * this.zoom),
      e = (this.top - this.bottom) / (2 * this.zoom),
      n = (this.right + this.left) / 2,
      r = (this.top + this.bottom) / 2;
    let s = n - t,
      a = n + t,
      o = r + e,
      l = r - e;
    if (this.view !== null && this.view.enabled) {
      const c = (this.right - this.left) / this.view.fullWidth / this.zoom,
        u = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
      (s += c * this.view.offsetX),
        (a = s + c * this.view.width),
        (o -= u * this.view.offsetY),
        (l = o - u * this.view.height);
    }
    this.projectionMatrix.makeOrthographic(
      s,
      a,
      o,
      l,
      this.near,
      this.far,
      this.coordinateSystem
    ),
      this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return (
      (e.object.zoom = this.zoom),
      (e.object.left = this.left),
      (e.object.right = this.right),
      (e.object.top = this.top),
      (e.object.bottom = this.bottom),
      (e.object.near = this.near),
      (e.object.far = this.far),
      this.view !== null && (e.object.view = Object.assign({}, this.view)),
      e
    );
  }
}
const Xn = 4,
  va = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582],
  yn = 20,
  wr = new Vu(),
  xa = new qt();
let Cr = null,
  Pr = 0,
  Lr = 0,
  Ir = !1;
const Sn = (1 + Math.sqrt(5)) / 2,
  Wn = 1 / Sn,
  Ma = [
    new B(-Sn, Wn, 0),
    new B(Sn, Wn, 0),
    new B(-Wn, 0, Sn),
    new B(Wn, 0, Sn),
    new B(0, Sn, -Wn),
    new B(0, Sn, Wn),
    new B(-1, 1, -1),
    new B(1, 1, -1),
    new B(-1, 1, 1),
    new B(1, 1, 1),
  ];
class Sa {
  constructor(t) {
    (this._renderer = t),
      (this._pingPongRenderTarget = null),
      (this._lodMax = 0),
      (this._cubeSize = 0),
      (this._lodPlanes = []),
      (this._sizeLods = []),
      (this._sigmas = []),
      (this._blurMaterial = null),
      (this._cubemapMaterial = null),
      (this._equirectMaterial = null),
      this._compileMaterial(this._blurMaterial);
  }
  fromScene(t, e = 0, n = 0.1, r = 100) {
    (Cr = this._renderer.getRenderTarget()),
      (Pr = this._renderer.getActiveCubeFace()),
      (Lr = this._renderer.getActiveMipmapLevel()),
      (Ir = this._renderer.xr.enabled),
      (this._renderer.xr.enabled = !1),
      this._setSize(256);
    const s = this._allocateTargets();
    return (
      (s.depthBuffer = !0),
      this._sceneToCubeUV(t, n, r, s),
      e > 0 && this._blur(s, 0, 0, e),
      this._applyPMREM(s),
      this._cleanup(s),
      s
    );
  }
  fromEquirectangular(t, e = null) {
    return this._fromTexture(t, e);
  }
  fromCubemap(t, e = null) {
    return this._fromTexture(t, e);
  }
  compileCubemapShader() {
    this._cubemapMaterial === null &&
      ((this._cubemapMaterial = Ta()),
      this._compileMaterial(this._cubemapMaterial));
  }
  compileEquirectangularShader() {
    this._equirectMaterial === null &&
      ((this._equirectMaterial = ya()),
      this._compileMaterial(this._equirectMaterial));
  }
  dispose() {
    this._dispose(),
      this._cubemapMaterial !== null && this._cubemapMaterial.dispose(),
      this._equirectMaterial !== null && this._equirectMaterial.dispose();
  }
  _setSize(t) {
    (this._lodMax = Math.floor(Math.log2(t))),
      (this._cubeSize = Math.pow(2, this._lodMax));
  }
  _dispose() {
    this._blurMaterial !== null && this._blurMaterial.dispose(),
      this._pingPongRenderTarget !== null &&
        this._pingPongRenderTarget.dispose();
    for (let t = 0; t < this._lodPlanes.length; t++)
      this._lodPlanes[t].dispose();
  }
  _cleanup(t) {
    this._renderer.setRenderTarget(Cr, Pr, Lr),
      (this._renderer.xr.enabled = Ir),
      (t.scissorTest = !1),
      Vi(t, 0, 0, t.width, t.height);
  }
  _fromTexture(t, e) {
    t.mapping === Zn || t.mapping === jn
      ? this._setSize(
          t.image.length === 0 ? 16 : t.image[0].width || t.image[0].image.width
        )
      : this._setSize(t.image.width / 4),
      (Cr = this._renderer.getRenderTarget()),
      (Pr = this._renderer.getActiveCubeFace()),
      (Lr = this._renderer.getActiveMipmapLevel()),
      (Ir = this._renderer.xr.enabled),
      (this._renderer.xr.enabled = !1);
    const n = e || this._allocateTargets();
    return (
      this._textureToCubeUV(t, n), this._applyPMREM(n), this._cleanup(n), n
    );
  }
  _allocateTargets() {
    const t = 3 * Math.max(this._cubeSize, 112),
      e = 4 * this._cubeSize,
      n = {
        magFilter: Fe,
        minFilter: Fe,
        generateMipmaps: !1,
        type: pi,
        format: Ie,
        colorSpace: ei,
        depthBuffer: !1,
      },
      r = Ea(t, e, n);
    if (
      this._pingPongRenderTarget === null ||
      this._pingPongRenderTarget.width !== t ||
      this._pingPongRenderTarget.height !== e
    ) {
      this._pingPongRenderTarget !== null && this._dispose(),
        (this._pingPongRenderTarget = Ea(t, e, n));
      const { _lodMax: s } = this;
      ({
        sizeLods: this._sizeLods,
        lodPlanes: this._lodPlanes,
        sigmas: this._sigmas,
      } = Gu(s)),
        (this._blurMaterial = ku(s, t, e));
    }
    return r;
  }
  _compileMaterial(t) {
    const e = new Oe(this._lodPlanes[0], t);
    this._renderer.compile(e, wr);
  }
  _sceneToCubeUV(t, e, n, r) {
    const o = new be(90, 1, e, n),
      l = [1, -1, 1, 1, 1, 1],
      c = [1, 1, 1, -1, -1, -1],
      u = this._renderer,
      d = u.autoClear,
      f = u.toneMapping;
    u.getClearColor(xa), (u.toneMapping = hn), (u.autoClear = !1);
    const m = new Ls({
        name: "PMREM.Background",
        side: me,
        depthWrite: !1,
        depthTest: !1,
      }),
      v = new Oe(new vi(), m);
    let M = !1;
    const p = t.background;
    p
      ? p.isColor && (m.color.copy(p), (t.background = null), (M = !0))
      : (m.color.copy(xa), (M = !0));
    for (let h = 0; h < 6; h++) {
      const b = h % 3;
      b === 0
        ? (o.up.set(0, l[h], 0), o.lookAt(c[h], 0, 0))
        : b === 1
        ? (o.up.set(0, 0, l[h]), o.lookAt(0, c[h], 0))
        : (o.up.set(0, l[h], 0), o.lookAt(0, 0, c[h]));
      const T = this._cubeSize;
      Vi(r, b * T, h > 2 ? T : 0, T, T),
        u.setRenderTarget(r),
        M && u.render(v, o),
        u.render(t, o);
    }
    v.geometry.dispose(),
      v.material.dispose(),
      (u.toneMapping = f),
      (u.autoClear = d),
      (t.background = p);
  }
  _textureToCubeUV(t, e) {
    const n = this._renderer,
      r = t.mapping === Zn || t.mapping === jn;
    r
      ? (this._cubemapMaterial === null && (this._cubemapMaterial = Ta()),
        (this._cubemapMaterial.uniforms.flipEnvMap.value =
          t.isRenderTargetTexture === !1 ? -1 : 1))
      : this._equirectMaterial === null && (this._equirectMaterial = ya());
    const s = r ? this._cubemapMaterial : this._equirectMaterial,
      a = new Oe(this._lodPlanes[0], s),
      o = s.uniforms;
    o.envMap.value = t;
    const l = this._cubeSize;
    Vi(e, 0, 0, 3 * l, 2 * l), n.setRenderTarget(e), n.render(a, wr);
  }
  _applyPMREM(t) {
    const e = this._renderer,
      n = e.autoClear;
    e.autoClear = !1;
    const r = this._lodPlanes.length;
    for (let s = 1; s < r; s++) {
      const a = Math.sqrt(
          this._sigmas[s] * this._sigmas[s] -
            this._sigmas[s - 1] * this._sigmas[s - 1]
        ),
        o = Ma[(r - s - 1) % Ma.length];
      this._blur(t, s - 1, s, a, o);
    }
    e.autoClear = n;
  }
  _blur(t, e, n, r, s) {
    const a = this._pingPongRenderTarget;
    this._halfBlur(t, a, e, n, r, "latitudinal", s),
      this._halfBlur(a, t, n, n, r, "longitudinal", s);
  }
  _halfBlur(t, e, n, r, s, a, o) {
    const l = this._renderer,
      c = this._blurMaterial;
    a !== "latitudinal" &&
      a !== "longitudinal" &&
      console.error(
        "blur direction must be either latitudinal or longitudinal!"
      );
    const u = 3,
      d = new Oe(this._lodPlanes[r], c),
      f = c.uniforms,
      m = this._sizeLods[n] - 1,
      v = isFinite(s) ? Math.PI / (2 * m) : (2 * Math.PI) / (2 * yn - 1),
      M = s / v,
      p = isFinite(s) ? 1 + Math.floor(u * M) : yn;
    p > yn &&
      console.warn(
        `sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${yn}`
      );
    const h = [];
    let b = 0;
    for (let A = 0; A < yn; ++A) {
      const D = A / M,
        S = Math.exp((-D * D) / 2);
      h.push(S), A === 0 ? (b += S) : A < p && (b += 2 * S);
    }
    for (let A = 0; A < h.length; A++) h[A] = h[A] / b;
    (f.envMap.value = t.texture),
      (f.samples.value = p),
      (f.weights.value = h),
      (f.latitudinal.value = a === "latitudinal"),
      o && (f.poleAxis.value = o);
    const { _lodMax: T } = this;
    (f.dTheta.value = v), (f.mipInt.value = T - n);
    const E = this._sizeLods[r],
      O = 3 * E * (r > T - Xn ? r - T + Xn : 0),
      C = 4 * (this._cubeSize - E);
    Vi(e, O, C, 3 * E, 2 * E), l.setRenderTarget(e), l.render(d, wr);
  }
}
function Gu(i) {
  const t = [],
    e = [],
    n = [];
  let r = i;
  const s = i - Xn + 1 + va.length;
  for (let a = 0; a < s; a++) {
    const o = Math.pow(2, r);
    e.push(o);
    let l = 1 / o;
    a > i - Xn ? (l = va[a - i + Xn - 1]) : a === 0 && (l = 0), n.push(l);
    const c = 1 / (o - 2),
      u = -c,
      d = 1 + c,
      f = [u, u, d, u, d, d, u, u, d, d, u, d],
      m = 6,
      v = 6,
      M = 3,
      p = 2,
      h = 1,
      b = new Float32Array(M * v * m),
      T = new Float32Array(p * v * m),
      E = new Float32Array(h * v * m);
    for (let C = 0; C < m; C++) {
      const A = ((C % 3) * 2) / 3 - 1,
        D = C > 2 ? 0 : -1,
        S = [
          A,
          D,
          0,
          A + 2 / 3,
          D,
          0,
          A + 2 / 3,
          D + 1,
          0,
          A,
          D,
          0,
          A + 2 / 3,
          D + 1,
          0,
          A,
          D + 1,
          0,
        ];
      b.set(S, M * v * C), T.set(f, p * v * C);
      const x = [C, C, C, C, C, C];
      E.set(x, h * v * C);
    }
    const O = new Cn();
    O.setAttribute("position", new Be(b, M)),
      O.setAttribute("uv", new Be(T, p)),
      O.setAttribute("faceIndex", new Be(E, h)),
      t.push(O),
      r > Xn && r--;
  }
  return { lodPlanes: t, sizeLods: e, sigmas: n };
}
function Ea(i, t, e) {
  const n = new wn(i, t, e);
  return (
    (n.texture.mapping = Qi),
    (n.texture.name = "PMREM.cubeUv"),
    (n.scissorTest = !0),
    n
  );
}
function Vi(i, t, e, n, r) {
  i.viewport.set(t, e, n, r), i.scissor.set(t, e, n, r);
}
function ku(i, t, e) {
  const n = new Float32Array(yn),
    r = new B(0, 1, 0);
  return new dn({
    name: "SphericalGaussianBlur",
    defines: {
      n: yn,
      CUBEUV_TEXEL_WIDTH: 1 / t,
      CUBEUV_TEXEL_HEIGHT: 1 / e,
      CUBEUV_MAX_MIP: `${i}.0`,
    },
    uniforms: {
      envMap: { value: null },
      samples: { value: 1 },
      weights: { value: n },
      latitudinal: { value: !1 },
      dTheta: { value: 0 },
      mipInt: { value: 0 },
      poleAxis: { value: r },
    },
    vertexShader: Is(),
    fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,
    blending: cn,
    depthTest: !1,
    depthWrite: !1,
  });
}
function ya() {
  return new dn({
    name: "EquirectangularToCubeUV",
    uniforms: { envMap: { value: null } },
    vertexShader: Is(),
    fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,
    blending: cn,
    depthTest: !1,
    depthWrite: !1,
  });
}
function Ta() {
  return new dn({
    name: "CubemapToCubeUV",
    uniforms: { envMap: { value: null }, flipEnvMap: { value: -1 } },
    vertexShader: Is(),
    fragmentShader: `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,
    blending: cn,
    depthTest: !1,
    depthWrite: !1,
  });
}
function Is() {
  return `

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`;
}
function Wu(i) {
  let t = new WeakMap(),
    e = null;
  function n(o) {
    if (o && o.isTexture) {
      const l = o.mapping,
        c = l === Xr || l === qr,
        u = l === Zn || l === jn;
      if (c || u) {
        let d = t.get(o);
        const f = d !== void 0 ? d.texture.pmremVersion : 0;
        if (o.isRenderTargetTexture && o.pmremVersion !== f)
          return (
            e === null && (e = new Sa(i)),
            (d = c ? e.fromEquirectangular(o, d) : e.fromCubemap(o, d)),
            (d.texture.pmremVersion = o.pmremVersion),
            t.set(o, d),
            d.texture
          );
        if (d !== void 0) return d.texture;
        {
          const m = o.image;
          return (c && m && m.height > 0) || (u && m && r(m))
            ? (e === null && (e = new Sa(i)),
              (d = c ? e.fromEquirectangular(o) : e.fromCubemap(o)),
              (d.texture.pmremVersion = o.pmremVersion),
              t.set(o, d),
              o.addEventListener("dispose", s),
              d.texture)
            : null;
        }
      }
    }
    return o;
  }
  function r(o) {
    let l = 0;
    const c = 6;
    for (let u = 0; u < c; u++) o[u] !== void 0 && l++;
    return l === c;
  }
  function s(o) {
    const l = o.target;
    l.removeEventListener("dispose", s);
    const c = t.get(l);
    c !== void 0 && (t.delete(l), c.dispose());
  }
  function a() {
    (t = new WeakMap()), e !== null && (e.dispose(), (e = null));
  }
  return { get: n, dispose: a };
}
function Xu(i) {
  const t = {};
  function e(n) {
    if (t[n] !== void 0) return t[n];
    let r;
    switch (n) {
      case "WEBGL_depth_texture":
        r =
          i.getExtension("WEBGL_depth_texture") ||
          i.getExtension("MOZ_WEBGL_depth_texture") ||
          i.getExtension("WEBKIT_WEBGL_depth_texture");
        break;
      case "EXT_texture_filter_anisotropic":
        r =
          i.getExtension("EXT_texture_filter_anisotropic") ||
          i.getExtension("MOZ_EXT_texture_filter_anisotropic") ||
          i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
        break;
      case "WEBGL_compressed_texture_s3tc":
        r =
          i.getExtension("WEBGL_compressed_texture_s3tc") ||
          i.getExtension("MOZ_WEBGL_compressed_texture_s3tc") ||
          i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
        break;
      case "WEBGL_compressed_texture_pvrtc":
        r =
          i.getExtension("WEBGL_compressed_texture_pvrtc") ||
          i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
        break;
      default:
        r = i.getExtension(n);
    }
    return (t[n] = r), r;
  }
  return {
    has: function (n) {
      return e(n) !== null;
    },
    init: function () {
      e("EXT_color_buffer_float"),
        e("WEBGL_clip_cull_distance"),
        e("OES_texture_float_linear"),
        e("EXT_color_buffer_half_float"),
        e("WEBGL_multisampled_render_to_texture"),
        e("WEBGL_render_shared_exponent");
    },
    get: function (n) {
      const r = e(n);
      return (
        r === null &&
          ui("THREE.WebGLRenderer: " + n + " extension not supported."),
        r
      );
    },
  };
}
function qu(i, t, e, n) {
  const r = {},
    s = new WeakMap();
  function a(d) {
    const f = d.target;
    f.index !== null && t.remove(f.index);
    for (const v in f.attributes) t.remove(f.attributes[v]);
    for (const v in f.morphAttributes) {
      const M = f.morphAttributes[v];
      for (let p = 0, h = M.length; p < h; p++) t.remove(M[p]);
    }
    f.removeEventListener("dispose", a), delete r[f.id];
    const m = s.get(f);
    m && (t.remove(m), s.delete(f)),
      n.releaseStatesOfGeometry(f),
      f.isInstancedBufferGeometry === !0 && delete f._maxInstanceCount,
      e.memory.geometries--;
  }
  function o(d, f) {
    return (
      r[f.id] === !0 ||
        (f.addEventListener("dispose", a),
        (r[f.id] = !0),
        e.memory.geometries++),
      f
    );
  }
  function l(d) {
    const f = d.attributes;
    for (const v in f) t.update(f[v], i.ARRAY_BUFFER);
    const m = d.morphAttributes;
    for (const v in m) {
      const M = m[v];
      for (let p = 0, h = M.length; p < h; p++) t.update(M[p], i.ARRAY_BUFFER);
    }
  }
  function c(d) {
    const f = [],
      m = d.index,
      v = d.attributes.position;
    let M = 0;
    if (m !== null) {
      const b = m.array;
      M = m.version;
      for (let T = 0, E = b.length; T < E; T += 3) {
        const O = b[T + 0],
          C = b[T + 1],
          A = b[T + 2];
        f.push(O, C, C, A, A, O);
      }
    } else if (v !== void 0) {
      const b = v.array;
      M = v.version;
      for (let T = 0, E = b.length / 3 - 1; T < E; T += 3) {
        const O = T + 0,
          C = T + 1,
          A = T + 2;
        f.push(O, C, C, A, A, O);
      }
    } else return;
    const p = new (so(f) ? uo : ho)(f, 1);
    p.version = M;
    const h = s.get(d);
    h && t.remove(h), s.set(d, p);
  }
  function u(d) {
    const f = s.get(d);
    if (f) {
      const m = d.index;
      m !== null && f.version < m.version && c(d);
    } else c(d);
    return s.get(d);
  }
  return { get: o, update: l, getWireframeAttribute: u };
}
function Yu(i, t, e) {
  let n;
  function r(f) {
    n = f;
  }
  let s, a;
  function o(f) {
    (s = f.type), (a = f.bytesPerElement);
  }
  function l(f, m) {
    i.drawElements(n, m, s, f * a), e.update(m, n, 1);
  }
  function c(f, m, v) {
    v !== 0 && (i.drawElementsInstanced(n, m, s, f * a, v), e.update(m, n, v));
  }
  function u(f, m, v) {
    if (v === 0) return;
    t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n, m, 0, s, f, 0, v);
    let p = 0;
    for (let h = 0; h < v; h++) p += m[h];
    e.update(p, n, 1);
  }
  function d(f, m, v, M) {
    if (v === 0) return;
    const p = t.get("WEBGL_multi_draw");
    if (p === null) for (let h = 0; h < f.length; h++) c(f[h] / a, m[h], M[h]);
    else {
      p.multiDrawElementsInstancedWEBGL(n, m, 0, s, f, 0, M, 0, v);
      let h = 0;
      for (let b = 0; b < v; b++) h += m[b] * M[b];
      e.update(h, n, 1);
    }
  }
  (this.setMode = r),
    (this.setIndex = o),
    (this.render = l),
    (this.renderInstances = c),
    (this.renderMultiDraw = u),
    (this.renderMultiDrawInstances = d);
}
function $u(i) {
  const t = { geometries: 0, textures: 0 },
    e = { frame: 0, calls: 0, triangles: 0, points: 0, lines: 0 };
  function n(s, a, o) {
    switch ((e.calls++, a)) {
      case i.TRIANGLES:
        e.triangles += o * (s / 3);
        break;
      case i.LINES:
        e.lines += o * (s / 2);
        break;
      case i.LINE_STRIP:
        e.lines += o * (s - 1);
        break;
      case i.LINE_LOOP:
        e.lines += o * s;
        break;
      case i.POINTS:
        e.points += o * s;
        break;
      default:
        console.error("THREE.WebGLInfo: Unknown draw mode:", a);
        break;
    }
  }
  function r() {
    (e.calls = 0), (e.triangles = 0), (e.points = 0), (e.lines = 0);
  }
  return {
    memory: t,
    render: e,
    programs: null,
    autoReset: !0,
    reset: r,
    update: n,
  };
}
function Ku(i, t, e) {
  const n = new WeakMap(),
    r = new ne();
  function s(a, o, l) {
    const c = a.morphTargetInfluences,
      u =
        o.morphAttributes.position ||
        o.morphAttributes.normal ||
        o.morphAttributes.color,
      d = u !== void 0 ? u.length : 0;
    let f = n.get(o);
    if (f === void 0 || f.count !== d) {
      let x = function () {
        D.dispose(), n.delete(o), o.removeEventListener("dispose", x);
      };
      var m = x;
      f !== void 0 && f.texture.dispose();
      const v = o.morphAttributes.position !== void 0,
        M = o.morphAttributes.normal !== void 0,
        p = o.morphAttributes.color !== void 0,
        h = o.morphAttributes.position || [],
        b = o.morphAttributes.normal || [],
        T = o.morphAttributes.color || [];
      let E = 0;
      v === !0 && (E = 1), M === !0 && (E = 2), p === !0 && (E = 3);
      let O = o.attributes.position.count * E,
        C = 1;
      O > t.maxTextureSize &&
        ((C = Math.ceil(O / t.maxTextureSize)), (O = t.maxTextureSize));
      const A = new Float32Array(O * C * 4 * d),
        D = new oo(A, O, C, d);
      (D.type = $e), (D.needsUpdate = !0);
      const S = E * 4;
      for (let R = 0; R < d; R++) {
        const G = h[R],
          H = b[R],
          $ = T[R],
          K = O * C * 4 * R;
        for (let X = 0; X < G.count; X++) {
          const Z = X * S;
          v === !0 &&
            (r.fromBufferAttribute(G, X),
            (A[K + Z + 0] = r.x),
            (A[K + Z + 1] = r.y),
            (A[K + Z + 2] = r.z),
            (A[K + Z + 3] = 0)),
            M === !0 &&
              (r.fromBufferAttribute(H, X),
              (A[K + Z + 4] = r.x),
              (A[K + Z + 5] = r.y),
              (A[K + Z + 6] = r.z),
              (A[K + Z + 7] = 0)),
            p === !0 &&
              (r.fromBufferAttribute($, X),
              (A[K + Z + 8] = r.x),
              (A[K + Z + 9] = r.y),
              (A[K + Z + 10] = r.z),
              (A[K + Z + 11] = $.itemSize === 4 ? r.w : 1));
        }
      }
      (f = { count: d, texture: D, size: new Yt(O, C) }),
        n.set(o, f),
        o.addEventListener("dispose", x);
    }
    if (a.isInstancedMesh === !0 && a.morphTexture !== null)
      l.getUniforms().setValue(i, "morphTexture", a.morphTexture, e);
    else {
      let v = 0;
      for (let p = 0; p < c.length; p++) v += c[p];
      const M = o.morphTargetsRelative ? 1 : 1 - v;
      l.getUniforms().setValue(i, "morphTargetBaseInfluence", M),
        l.getUniforms().setValue(i, "morphTargetInfluences", c);
    }
    l.getUniforms().setValue(i, "morphTargetsTexture", f.texture, e),
      l.getUniforms().setValue(i, "morphTargetsTextureSize", f.size);
  }
  return { update: s };
}
function Zu(i, t, e, n) {
  let r = new WeakMap();
  function s(l) {
    const c = n.render.frame,
      u = l.geometry,
      d = t.get(l, u);
    if (
      (r.get(d) !== c && (t.update(d), r.set(d, c)),
      l.isInstancedMesh &&
        (l.hasEventListener("dispose", o) === !1 &&
          l.addEventListener("dispose", o),
        r.get(l) !== c &&
          (e.update(l.instanceMatrix, i.ARRAY_BUFFER),
          l.instanceColor !== null && e.update(l.instanceColor, i.ARRAY_BUFFER),
          r.set(l, c))),
      l.isSkinnedMesh)
    ) {
      const f = l.skeleton;
      r.get(f) !== c && (f.update(), r.set(f, c));
    }
    return d;
  }
  function a() {
    r = new WeakMap();
  }
  function o(l) {
    const c = l.target;
    c.removeEventListener("dispose", o),
      e.remove(c.instanceMatrix),
      c.instanceColor !== null && e.remove(c.instanceColor);
  }
  return { update: s, dispose: a };
}
class vo extends _e {
  constructor(t, e, n, r, s, a, o, l, c, u = Yn) {
    if (u !== Yn && u !== Qn)
      throw new Error(
        "DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat"
      );
    n === void 0 && u === Yn && (n = Rn),
      n === void 0 && u === Qn && (n = Jn),
      super(null, r, s, a, o, l, u, n, c),
      (this.isDepthTexture = !0),
      (this.image = { width: t, height: e }),
      (this.magFilter = o !== void 0 ? o : De),
      (this.minFilter = l !== void 0 ? l : De),
      (this.flipY = !1),
      (this.generateMipmaps = !1),
      (this.compareFunction = null);
  }
  copy(t) {
    return super.copy(t), (this.compareFunction = t.compareFunction), this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return (
      this.compareFunction !== null &&
        (e.compareFunction = this.compareFunction),
      e
    );
  }
}
const xo = new _e(),
  ba = new vo(1, 1),
  Mo = new oo(),
  So = new Ul(),
  Eo = new mo(),
  Aa = [],
  Ra = [],
  wa = new Float32Array(16),
  Ca = new Float32Array(9),
  Pa = new Float32Array(4);
function ii(i, t, e) {
  const n = i[0];
  if (n <= 0 || n > 0) return i;
  const r = t * e;
  let s = Aa[r];
  if ((s === void 0 && ((s = new Float32Array(r)), (Aa[r] = s)), t !== 0)) {
    n.toArray(s, 0);
    for (let a = 1, o = 0; a !== t; ++a) (o += e), i[a].toArray(s, o);
  }
  return s;
}
function se(i, t) {
  if (i.length !== t.length) return !1;
  for (let e = 0, n = i.length; e < n; e++) if (i[e] !== t[e]) return !1;
  return !0;
}
function ae(i, t) {
  for (let e = 0, n = t.length; e < n; e++) i[e] = t[e];
}
function nr(i, t) {
  let e = Ra[t];
  e === void 0 && ((e = new Int32Array(t)), (Ra[t] = e));
  for (let n = 0; n !== t; ++n) e[n] = i.allocateTextureUnit();
  return e;
}
function ju(i, t) {
  const e = this.cache;
  e[0] !== t && (i.uniform1f(this.addr, t), (e[0] = t));
}
function Ju(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) &&
      (i.uniform2f(this.addr, t.x, t.y), (e[0] = t.x), (e[1] = t.y));
  else {
    if (se(e, t)) return;
    i.uniform2fv(this.addr, t), ae(e, t);
  }
}
function Qu(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) &&
      (i.uniform3f(this.addr, t.x, t.y, t.z),
      (e[0] = t.x),
      (e[1] = t.y),
      (e[2] = t.z));
  else if (t.r !== void 0)
    (e[0] !== t.r || e[1] !== t.g || e[2] !== t.b) &&
      (i.uniform3f(this.addr, t.r, t.g, t.b),
      (e[0] = t.r),
      (e[1] = t.g),
      (e[2] = t.b));
  else {
    if (se(e, t)) return;
    i.uniform3fv(this.addr, t), ae(e, t);
  }
}
function td(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) &&
      (i.uniform4f(this.addr, t.x, t.y, t.z, t.w),
      (e[0] = t.x),
      (e[1] = t.y),
      (e[2] = t.z),
      (e[3] = t.w));
  else {
    if (se(e, t)) return;
    i.uniform4fv(this.addr, t), ae(e, t);
  }
}
function ed(i, t) {
  const e = this.cache,
    n = t.elements;
  if (n === void 0) {
    if (se(e, t)) return;
    i.uniformMatrix2fv(this.addr, !1, t), ae(e, t);
  } else {
    if (se(e, n)) return;
    Pa.set(n), i.uniformMatrix2fv(this.addr, !1, Pa), ae(e, n);
  }
}
function nd(i, t) {
  const e = this.cache,
    n = t.elements;
  if (n === void 0) {
    if (se(e, t)) return;
    i.uniformMatrix3fv(this.addr, !1, t), ae(e, t);
  } else {
    if (se(e, n)) return;
    Ca.set(n), i.uniformMatrix3fv(this.addr, !1, Ca), ae(e, n);
  }
}
function id(i, t) {
  const e = this.cache,
    n = t.elements;
  if (n === void 0) {
    if (se(e, t)) return;
    i.uniformMatrix4fv(this.addr, !1, t), ae(e, t);
  } else {
    if (se(e, n)) return;
    wa.set(n), i.uniformMatrix4fv(this.addr, !1, wa), ae(e, n);
  }
}
function rd(i, t) {
  const e = this.cache;
  e[0] !== t && (i.uniform1i(this.addr, t), (e[0] = t));
}
function sd(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) &&
      (i.uniform2i(this.addr, t.x, t.y), (e[0] = t.x), (e[1] = t.y));
  else {
    if (se(e, t)) return;
    i.uniform2iv(this.addr, t), ae(e, t);
  }
}
function ad(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) &&
      (i.uniform3i(this.addr, t.x, t.y, t.z),
      (e[0] = t.x),
      (e[1] = t.y),
      (e[2] = t.z));
  else {
    if (se(e, t)) return;
    i.uniform3iv(this.addr, t), ae(e, t);
  }
}
function od(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) &&
      (i.uniform4i(this.addr, t.x, t.y, t.z, t.w),
      (e[0] = t.x),
      (e[1] = t.y),
      (e[2] = t.z),
      (e[3] = t.w));
  else {
    if (se(e, t)) return;
    i.uniform4iv(this.addr, t), ae(e, t);
  }
}
function ld(i, t) {
  const e = this.cache;
  e[0] !== t && (i.uniform1ui(this.addr, t), (e[0] = t));
}
function cd(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) &&
      (i.uniform2ui(this.addr, t.x, t.y), (e[0] = t.x), (e[1] = t.y));
  else {
    if (se(e, t)) return;
    i.uniform2uiv(this.addr, t), ae(e, t);
  }
}
function hd(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) &&
      (i.uniform3ui(this.addr, t.x, t.y, t.z),
      (e[0] = t.x),
      (e[1] = t.y),
      (e[2] = t.z));
  else {
    if (se(e, t)) return;
    i.uniform3uiv(this.addr, t), ae(e, t);
  }
}
function ud(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) &&
      (i.uniform4ui(this.addr, t.x, t.y, t.z, t.w),
      (e[0] = t.x),
      (e[1] = t.y),
      (e[2] = t.z),
      (e[3] = t.w));
  else {
    if (se(e, t)) return;
    i.uniform4uiv(this.addr, t), ae(e, t);
  }
}
function dd(i, t, e) {
  const n = this.cache,
    r = e.allocateTextureUnit();
  n[0] !== r && (i.uniform1i(this.addr, r), (n[0] = r));
  let s;
  this.type === i.SAMPLER_2D_SHADOW
    ? ((ba.compareFunction = ro), (s = ba))
    : (s = xo),
    e.setTexture2D(t || s, r);
}
function fd(i, t, e) {
  const n = this.cache,
    r = e.allocateTextureUnit();
  n[0] !== r && (i.uniform1i(this.addr, r), (n[0] = r)),
    e.setTexture3D(t || So, r);
}
function pd(i, t, e) {
  const n = this.cache,
    r = e.allocateTextureUnit();
  n[0] !== r && (i.uniform1i(this.addr, r), (n[0] = r)),
    e.setTextureCube(t || Eo, r);
}
function md(i, t, e) {
  const n = this.cache,
    r = e.allocateTextureUnit();
  n[0] !== r && (i.uniform1i(this.addr, r), (n[0] = r)),
    e.setTexture2DArray(t || Mo, r);
}
function _d(i) {
  switch (i) {
    case 5126:
      return ju;
    case 35664:
      return Ju;
    case 35665:
      return Qu;
    case 35666:
      return td;
    case 35674:
      return ed;
    case 35675:
      return nd;
    case 35676:
      return id;
    case 5124:
    case 35670:
      return rd;
    case 35667:
    case 35671:
      return sd;
    case 35668:
    case 35672:
      return ad;
    case 35669:
    case 35673:
      return od;
    case 5125:
      return ld;
    case 36294:
      return cd;
    case 36295:
      return hd;
    case 36296:
      return ud;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
      return dd;
    case 35679:
    case 36299:
    case 36307:
      return fd;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
      return pd;
    case 36289:
    case 36303:
    case 36311:
    case 36292:
      return md;
  }
}
function gd(i, t) {
  i.uniform1fv(this.addr, t);
}
function vd(i, t) {
  const e = ii(t, this.size, 2);
  i.uniform2fv(this.addr, e);
}
function xd(i, t) {
  const e = ii(t, this.size, 3);
  i.uniform3fv(this.addr, e);
}
function Md(i, t) {
  const e = ii(t, this.size, 4);
  i.uniform4fv(this.addr, e);
}
function Sd(i, t) {
  const e = ii(t, this.size, 4);
  i.uniformMatrix2fv(this.addr, !1, e);
}
function Ed(i, t) {
  const e = ii(t, this.size, 9);
  i.uniformMatrix3fv(this.addr, !1, e);
}
function yd(i, t) {
  const e = ii(t, this.size, 16);
  i.uniformMatrix4fv(this.addr, !1, e);
}
function Td(i, t) {
  i.uniform1iv(this.addr, t);
}
function bd(i, t) {
  i.uniform2iv(this.addr, t);
}
function Ad(i, t) {
  i.uniform3iv(this.addr, t);
}
function Rd(i, t) {
  i.uniform4iv(this.addr, t);
}
function wd(i, t) {
  i.uniform1uiv(this.addr, t);
}
function Cd(i, t) {
  i.uniform2uiv(this.addr, t);
}
function Pd(i, t) {
  i.uniform3uiv(this.addr, t);
}
function Ld(i, t) {
  i.uniform4uiv(this.addr, t);
}
function Id(i, t, e) {
  const n = this.cache,
    r = t.length,
    s = nr(e, r);
  se(n, s) || (i.uniform1iv(this.addr, s), ae(n, s));
  for (let a = 0; a !== r; ++a) e.setTexture2D(t[a] || xo, s[a]);
}
function Dd(i, t, e) {
  const n = this.cache,
    r = t.length,
    s = nr(e, r);
  se(n, s) || (i.uniform1iv(this.addr, s), ae(n, s));
  for (let a = 0; a !== r; ++a) e.setTexture3D(t[a] || So, s[a]);
}
function Ud(i, t, e) {
  const n = this.cache,
    r = t.length,
    s = nr(e, r);
  se(n, s) || (i.uniform1iv(this.addr, s), ae(n, s));
  for (let a = 0; a !== r; ++a) e.setTextureCube(t[a] || Eo, s[a]);
}
function Nd(i, t, e) {
  const n = this.cache,
    r = t.length,
    s = nr(e, r);
  se(n, s) || (i.uniform1iv(this.addr, s), ae(n, s));
  for (let a = 0; a !== r; ++a) e.setTexture2DArray(t[a] || Mo, s[a]);
}
function Fd(i) {
  switch (i) {
    case 5126:
      return gd;
    case 35664:
      return vd;
    case 35665:
      return xd;
    case 35666:
      return Md;
    case 35674:
      return Sd;
    case 35675:
      return Ed;
    case 35676:
      return yd;
    case 5124:
    case 35670:
      return Td;
    case 35667:
    case 35671:
      return bd;
    case 35668:
    case 35672:
      return Ad;
    case 35669:
    case 35673:
      return Rd;
    case 5125:
      return wd;
    case 36294:
      return Cd;
    case 36295:
      return Pd;
    case 36296:
      return Ld;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
      return Id;
    case 35679:
    case 36299:
    case 36307:
      return Dd;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
      return Ud;
    case 36289:
    case 36303:
    case 36311:
    case 36292:
      return Nd;
  }
}
class Od {
  constructor(t, e, n) {
    (this.id = t),
      (this.addr = n),
      (this.cache = []),
      (this.type = e.type),
      (this.setValue = _d(e.type));
  }
}
class Bd {
  constructor(t, e, n) {
    (this.id = t),
      (this.addr = n),
      (this.cache = []),
      (this.type = e.type),
      (this.size = e.size),
      (this.setValue = Fd(e.type));
  }
}
class zd {
  constructor(t) {
    (this.id = t), (this.seq = []), (this.map = {});
  }
  setValue(t, e, n) {
    const r = this.seq;
    for (let s = 0, a = r.length; s !== a; ++s) {
      const o = r[s];
      o.setValue(t, e[o.id], n);
    }
  }
}
const Dr = /(\w+)(\])?(\[|\.)?/g;
function La(i, t) {
  i.seq.push(t), (i.map[t.id] = t);
}
function Hd(i, t, e) {
  const n = i.name,
    r = n.length;
  for (Dr.lastIndex = 0; ; ) {
    const s = Dr.exec(n),
      a = Dr.lastIndex;
    let o = s[1];
    const l = s[2] === "]",
      c = s[3];
    if ((l && (o = o | 0), c === void 0 || (c === "[" && a + 2 === r))) {
      La(e, c === void 0 ? new Od(o, i, t) : new Bd(o, i, t));
      break;
    } else {
      let d = e.map[o];
      d === void 0 && ((d = new zd(o)), La(e, d)), (e = d);
    }
  }
}
class Ki {
  constructor(t, e) {
    (this.seq = []), (this.map = {});
    const n = t.getProgramParameter(e, t.ACTIVE_UNIFORMS);
    for (let r = 0; r < n; ++r) {
      const s = t.getActiveUniform(e, r),
        a = t.getUniformLocation(e, s.name);
      Hd(s, a, this);
    }
  }
  setValue(t, e, n, r) {
    const s = this.map[e];
    s !== void 0 && s.setValue(t, n, r);
  }
  setOptional(t, e, n) {
    const r = e[n];
    r !== void 0 && this.setValue(t, n, r);
  }
  static upload(t, e, n, r) {
    for (let s = 0, a = e.length; s !== a; ++s) {
      const o = e[s],
        l = n[o.id];
      l.needsUpdate !== !1 && o.setValue(t, l.value, r);
    }
  }
  static seqWithValue(t, e) {
    const n = [];
    for (let r = 0, s = t.length; r !== s; ++r) {
      const a = t[r];
      a.id in e && n.push(a);
    }
    return n;
  }
}
function Ia(i, t, e) {
  const n = i.createShader(t);
  return i.shaderSource(n, e), i.compileShader(n), n;
}
const Vd = 37297;
let Gd = 0;
function kd(i, t) {
  const e = i.split(`
`),
    n = [],
    r = Math.max(t - 6, 0),
    s = Math.min(t + 6, e.length);
  for (let a = r; a < s; a++) {
    const o = a + 1;
    n.push(`${o === t ? ">" : " "} ${o}: ${e[a]}`);
  }
  return n.join(`
`);
}
const Da = new Pt();
function Wd(i) {
  zt._getMatrix(Da, zt.workingColorSpace, i);
  const t = `mat3( ${Da.elements.map((e) => e.toFixed(4))} )`;
  switch (zt.getTransfer(i)) {
    case tr:
      return [t, "LinearTransferOETF"];
    case Xt:
      return [t, "sRGBTransferOETF"];
    default:
      return (
        console.warn("THREE.WebGLProgram: Unsupported color space: ", i),
        [t, "LinearTransferOETF"]
      );
  }
}
function Ua(i, t, e) {
  const n = i.getShaderParameter(t, i.COMPILE_STATUS),
    r = i.getShaderInfoLog(t).trim();
  if (n && r === "") return "";
  const s = /ERROR: 0:(\d+)/.exec(r);
  if (s) {
    const a = parseInt(s[1]);
    return (
      e.toUpperCase() +
      `

` +
      r +
      `

` +
      kd(i.getShaderSource(t), a)
    );
  } else return r;
}
function Xd(i, t) {
  const e = Wd(t);
  return [
    `vec4 ${i}( vec4 value ) {`,
    `	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,
    "}",
  ].join(`
`);
}
function qd(i, t) {
  let e;
  switch (t) {
    case al:
      e = "Linear";
      break;
    case ol:
      e = "Reinhard";
      break;
    case ll:
      e = "Cineon";
      break;
    case cl:
      e = "ACESFilmic";
      break;
    case ul:
      e = "AgX";
      break;
    case dl:
      e = "Neutral";
      break;
    case hl:
      e = "Custom";
      break;
    default:
      console.warn("THREE.WebGLProgram: Unsupported toneMapping:", t),
        (e = "Linear");
  }
  return (
    "vec3 " + i + "( vec3 color ) { return " + e + "ToneMapping( color ); }"
  );
}
const Gi = new B();
function Yd() {
  zt.getLuminanceCoefficients(Gi);
  const i = Gi.x.toFixed(4),
    t = Gi.y.toFixed(4),
    e = Gi.z.toFixed(4);
  return [
    "float luminance( const in vec3 rgb ) {",
    `	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,
    "	return dot( weights, rgb );",
    "}",
  ].join(`
`);
}
function $d(i) {
  return [
    i.extensionClipCullDistance
      ? "#extension GL_ANGLE_clip_cull_distance : require"
      : "",
    i.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : "",
  ].filter(di).join(`
`);
}
function Kd(i) {
  const t = [];
  for (const e in i) {
    const n = i[e];
    n !== !1 && t.push("#define " + e + " " + n);
  }
  return t.join(`
`);
}
function Zd(i, t) {
  const e = {},
    n = i.getProgramParameter(t, i.ACTIVE_ATTRIBUTES);
  for (let r = 0; r < n; r++) {
    const s = i.getActiveAttrib(t, r),
      a = s.name;
    let o = 1;
    s.type === i.FLOAT_MAT2 && (o = 2),
      s.type === i.FLOAT_MAT3 && (o = 3),
      s.type === i.FLOAT_MAT4 && (o = 4),
      (e[a] = {
        type: s.type,
        location: i.getAttribLocation(t, a),
        locationSize: o,
      });
  }
  return e;
}
function di(i) {
  return i !== "";
}
function Na(i, t) {
  const e =
    t.numSpotLightShadows + t.numSpotLightMaps - t.numSpotLightShadowsWithMaps;
  return i
    .replace(/NUM_DIR_LIGHTS/g, t.numDirLights)
    .replace(/NUM_SPOT_LIGHTS/g, t.numSpotLights)
    .replace(/NUM_SPOT_LIGHT_MAPS/g, t.numSpotLightMaps)
    .replace(/NUM_SPOT_LIGHT_COORDS/g, e)
    .replace(/NUM_RECT_AREA_LIGHTS/g, t.numRectAreaLights)
    .replace(/NUM_POINT_LIGHTS/g, t.numPointLights)
    .replace(/NUM_HEMI_LIGHTS/g, t.numHemiLights)
    .replace(/NUM_DIR_LIGHT_SHADOWS/g, t.numDirLightShadows)
    .replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, t.numSpotLightShadowsWithMaps)
    .replace(/NUM_SPOT_LIGHT_SHADOWS/g, t.numSpotLightShadows)
    .replace(/NUM_POINT_LIGHT_SHADOWS/g, t.numPointLightShadows);
}
function Fa(i, t) {
  return i
    .replace(/NUM_CLIPPING_PLANES/g, t.numClippingPlanes)
    .replace(
      /UNION_CLIPPING_PLANES/g,
      t.numClippingPlanes - t.numClipIntersection
    );
}
const jd = /^[ \t]*#include +<([\w\d./]+)>/gm;
function Es(i) {
  return i.replace(jd, Qd);
}
const Jd = new Map();
function Qd(i, t) {
  let e = It[t];
  if (e === void 0) {
    const n = Jd.get(t);
    if (n !== void 0)
      (e = It[n]),
        console.warn(
          'THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',
          t,
          n
        );
    else throw new Error("Can not resolve #include <" + t + ">");
  }
  return Es(e);
}
const tf =
  /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function Oa(i) {
  return i.replace(tf, ef);
}
function ef(i, t, e, n) {
  let r = "";
  for (let s = parseInt(t); s < parseInt(e); s++)
    r += n
      .replace(/\[\s*i\s*\]/g, "[ " + s + " ]")
      .replace(/UNROLLED_LOOP_INDEX/g, s);
  return r;
}
function Ba(i) {
  let t = `precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;
  return (
    i.precision === "highp"
      ? (t += `
#define HIGH_PRECISION`)
      : i.precision === "mediump"
      ? (t += `
#define MEDIUM_PRECISION`)
      : i.precision === "lowp" &&
        (t += `
#define LOW_PRECISION`),
    t
  );
}
function nf(i) {
  let t = "SHADOWMAP_TYPE_BASIC";
  return (
    i.shadowMapType === Xa
      ? (t = "SHADOWMAP_TYPE_PCF")
      : i.shadowMapType === zo
      ? (t = "SHADOWMAP_TYPE_PCF_SOFT")
      : i.shadowMapType === qe && (t = "SHADOWMAP_TYPE_VSM"),
    t
  );
}
function rf(i) {
  let t = "ENVMAP_TYPE_CUBE";
  if (i.envMap)
    switch (i.envMapMode) {
      case Zn:
      case jn:
        t = "ENVMAP_TYPE_CUBE";
        break;
      case Qi:
        t = "ENVMAP_TYPE_CUBE_UV";
        break;
    }
  return t;
}
function sf(i) {
  let t = "ENVMAP_MODE_REFLECTION";
  if (i.envMap)
    switch (i.envMapMode) {
      case jn:
        t = "ENVMAP_MODE_REFRACTION";
        break;
    }
  return t;
}
function af(i) {
  let t = "ENVMAP_BLENDING_NONE";
  if (i.envMap)
    switch (i.combine) {
      case qa:
        t = "ENVMAP_BLENDING_MULTIPLY";
        break;
      case rl:
        t = "ENVMAP_BLENDING_MIX";
        break;
      case sl:
        t = "ENVMAP_BLENDING_ADD";
        break;
    }
  return t;
}
function of(i) {
  const t = i.envMapCubeUVHeight;
  if (t === null) return null;
  const e = Math.log2(t) - 2,
    n = 1 / t;
  return {
    texelWidth: 1 / (3 * Math.max(Math.pow(2, e), 7 * 16)),
    texelHeight: n,
    maxMip: e,
  };
}
function lf(i, t, e, n) {
  const r = i.getContext(),
    s = e.defines;
  let a = e.vertexShader,
    o = e.fragmentShader;
  const l = nf(e),
    c = rf(e),
    u = sf(e),
    d = af(e),
    f = of(e),
    m = $d(e),
    v = Kd(s),
    M = r.createProgram();
  let p,
    h,
    b = e.glslVersion
      ? "#version " +
        e.glslVersion +
        `
`
      : "";
  e.isRawShaderMaterial
    ? ((p = [
        "#define SHADER_TYPE " + e.shaderType,
        "#define SHADER_NAME " + e.shaderName,
        v,
      ].filter(di).join(`
`)),
      p.length > 0 &&
        (p += `
`),
      (h = [
        "#define SHADER_TYPE " + e.shaderType,
        "#define SHADER_NAME " + e.shaderName,
        v,
      ].filter(di).join(`
`)),
      h.length > 0 &&
        (h += `
`))
    : ((p = [
        Ba(e),
        "#define SHADER_TYPE " + e.shaderType,
        "#define SHADER_NAME " + e.shaderName,
        v,
        e.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
        e.batching ? "#define USE_BATCHING" : "",
        e.batchingColor ? "#define USE_BATCHING_COLOR" : "",
        e.instancing ? "#define USE_INSTANCING" : "",
        e.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
        e.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
        e.useFog && e.fog ? "#define USE_FOG" : "",
        e.useFog && e.fogExp2 ? "#define FOG_EXP2" : "",
        e.map ? "#define USE_MAP" : "",
        e.envMap ? "#define USE_ENVMAP" : "",
        e.envMap ? "#define " + u : "",
        e.lightMap ? "#define USE_LIGHTMAP" : "",
        e.aoMap ? "#define USE_AOMAP" : "",
        e.bumpMap ? "#define USE_BUMPMAP" : "",
        e.normalMap ? "#define USE_NORMALMAP" : "",
        e.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
        e.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
        e.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
        e.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
        e.anisotropy ? "#define USE_ANISOTROPY" : "",
        e.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
        e.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
        e.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
        e.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
        e.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
        e.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
        e.specularMap ? "#define USE_SPECULARMAP" : "",
        e.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
        e.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
        e.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
        e.metalnessMap ? "#define USE_METALNESSMAP" : "",
        e.alphaMap ? "#define USE_ALPHAMAP" : "",
        e.alphaHash ? "#define USE_ALPHAHASH" : "",
        e.transmission ? "#define USE_TRANSMISSION" : "",
        e.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
        e.thicknessMap ? "#define USE_THICKNESSMAP" : "",
        e.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
        e.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
        e.mapUv ? "#define MAP_UV " + e.mapUv : "",
        e.alphaMapUv ? "#define ALPHAMAP_UV " + e.alphaMapUv : "",
        e.lightMapUv ? "#define LIGHTMAP_UV " + e.lightMapUv : "",
        e.aoMapUv ? "#define AOMAP_UV " + e.aoMapUv : "",
        e.emissiveMapUv ? "#define EMISSIVEMAP_UV " + e.emissiveMapUv : "",
        e.bumpMapUv ? "#define BUMPMAP_UV " + e.bumpMapUv : "",
        e.normalMapUv ? "#define NORMALMAP_UV " + e.normalMapUv : "",
        e.displacementMapUv
          ? "#define DISPLACEMENTMAP_UV " + e.displacementMapUv
          : "",
        e.metalnessMapUv ? "#define METALNESSMAP_UV " + e.metalnessMapUv : "",
        e.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + e.roughnessMapUv : "",
        e.anisotropyMapUv
          ? "#define ANISOTROPYMAP_UV " + e.anisotropyMapUv
          : "",
        e.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + e.clearcoatMapUv : "",
        e.clearcoatNormalMapUv
          ? "#define CLEARCOAT_NORMALMAP_UV " + e.clearcoatNormalMapUv
          : "",
        e.clearcoatRoughnessMapUv
          ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + e.clearcoatRoughnessMapUv
          : "",
        e.iridescenceMapUv
          ? "#define IRIDESCENCEMAP_UV " + e.iridescenceMapUv
          : "",
        e.iridescenceThicknessMapUv
          ? "#define IRIDESCENCE_THICKNESSMAP_UV " + e.iridescenceThicknessMapUv
          : "",
        e.sheenColorMapUv
          ? "#define SHEEN_COLORMAP_UV " + e.sheenColorMapUv
          : "",
        e.sheenRoughnessMapUv
          ? "#define SHEEN_ROUGHNESSMAP_UV " + e.sheenRoughnessMapUv
          : "",
        e.specularMapUv ? "#define SPECULARMAP_UV " + e.specularMapUv : "",
        e.specularColorMapUv
          ? "#define SPECULAR_COLORMAP_UV " + e.specularColorMapUv
          : "",
        e.specularIntensityMapUv
          ? "#define SPECULAR_INTENSITYMAP_UV " + e.specularIntensityMapUv
          : "",
        e.transmissionMapUv
          ? "#define TRANSMISSIONMAP_UV " + e.transmissionMapUv
          : "",
        e.thicknessMapUv ? "#define THICKNESSMAP_UV " + e.thicknessMapUv : "",
        e.vertexTangents && e.flatShading === !1 ? "#define USE_TANGENT" : "",
        e.vertexColors ? "#define USE_COLOR" : "",
        e.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
        e.vertexUv1s ? "#define USE_UV1" : "",
        e.vertexUv2s ? "#define USE_UV2" : "",
        e.vertexUv3s ? "#define USE_UV3" : "",
        e.pointsUvs ? "#define USE_POINTS_UV" : "",
        e.flatShading ? "#define FLAT_SHADED" : "",
        e.skinning ? "#define USE_SKINNING" : "",
        e.morphTargets ? "#define USE_MORPHTARGETS" : "",
        e.morphNormals && e.flatShading === !1
          ? "#define USE_MORPHNORMALS"
          : "",
        e.morphColors ? "#define USE_MORPHCOLORS" : "",
        e.morphTargetsCount > 0
          ? "#define MORPHTARGETS_TEXTURE_STRIDE " + e.morphTextureStride
          : "",
        e.morphTargetsCount > 0
          ? "#define MORPHTARGETS_COUNT " + e.morphTargetsCount
          : "",
        e.doubleSided ? "#define DOUBLE_SIDED" : "",
        e.flipSided ? "#define FLIP_SIDED" : "",
        e.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
        e.shadowMapEnabled ? "#define " + l : "",
        e.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
        e.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
        e.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
        e.reverseDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "",
        "uniform mat4 modelMatrix;",
        "uniform mat4 modelViewMatrix;",
        "uniform mat4 projectionMatrix;",
        "uniform mat4 viewMatrix;",
        "uniform mat3 normalMatrix;",
        "uniform vec3 cameraPosition;",
        "uniform bool isOrthographic;",
        "#ifdef USE_INSTANCING",
        "	attribute mat4 instanceMatrix;",
        "#endif",
        "#ifdef USE_INSTANCING_COLOR",
        "	attribute vec3 instanceColor;",
        "#endif",
        "#ifdef USE_INSTANCING_MORPH",
        "	uniform sampler2D morphTexture;",
        "#endif",
        "attribute vec3 position;",
        "attribute vec3 normal;",
        "attribute vec2 uv;",
        "#ifdef USE_UV1",
        "	attribute vec2 uv1;",
        "#endif",
        "#ifdef USE_UV2",
        "	attribute vec2 uv2;",
        "#endif",
        "#ifdef USE_UV3",
        "	attribute vec2 uv3;",
        "#endif",
        "#ifdef USE_TANGENT",
        "	attribute vec4 tangent;",
        "#endif",
        "#if defined( USE_COLOR_ALPHA )",
        "	attribute vec4 color;",
        "#elif defined( USE_COLOR )",
        "	attribute vec3 color;",
        "#endif",
        "#ifdef USE_SKINNING",
        "	attribute vec4 skinIndex;",
        "	attribute vec4 skinWeight;",
        "#endif",
        `
`,
      ].filter(di).join(`
`)),
      (h = [
        Ba(e),
        "#define SHADER_TYPE " + e.shaderType,
        "#define SHADER_NAME " + e.shaderName,
        v,
        e.useFog && e.fog ? "#define USE_FOG" : "",
        e.useFog && e.fogExp2 ? "#define FOG_EXP2" : "",
        e.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
        e.map ? "#define USE_MAP" : "",
        e.matcap ? "#define USE_MATCAP" : "",
        e.envMap ? "#define USE_ENVMAP" : "",
        e.envMap ? "#define " + c : "",
        e.envMap ? "#define " + u : "",
        e.envMap ? "#define " + d : "",
        f ? "#define CUBEUV_TEXEL_WIDTH " + f.texelWidth : "",
        f ? "#define CUBEUV_TEXEL_HEIGHT " + f.texelHeight : "",
        f ? "#define CUBEUV_MAX_MIP " + f.maxMip + ".0" : "",
        e.lightMap ? "#define USE_LIGHTMAP" : "",
        e.aoMap ? "#define USE_AOMAP" : "",
        e.bumpMap ? "#define USE_BUMPMAP" : "",
        e.normalMap ? "#define USE_NORMALMAP" : "",
        e.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
        e.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
        e.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
        e.anisotropy ? "#define USE_ANISOTROPY" : "",
        e.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
        e.clearcoat ? "#define USE_CLEARCOAT" : "",
        e.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
        e.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
        e.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
        e.dispersion ? "#define USE_DISPERSION" : "",
        e.iridescence ? "#define USE_IRIDESCENCE" : "",
        e.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
        e.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
        e.specularMap ? "#define USE_SPECULARMAP" : "",
        e.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
        e.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
        e.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
        e.metalnessMap ? "#define USE_METALNESSMAP" : "",
        e.alphaMap ? "#define USE_ALPHAMAP" : "",
        e.alphaTest ? "#define USE_ALPHATEST" : "",
        e.alphaHash ? "#define USE_ALPHAHASH" : "",
        e.sheen ? "#define USE_SHEEN" : "",
        e.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
        e.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
        e.transmission ? "#define USE_TRANSMISSION" : "",
        e.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
        e.thicknessMap ? "#define USE_THICKNESSMAP" : "",
        e.vertexTangents && e.flatShading === !1 ? "#define USE_TANGENT" : "",
        e.vertexColors || e.instancingColor || e.batchingColor
          ? "#define USE_COLOR"
          : "",
        e.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
        e.vertexUv1s ? "#define USE_UV1" : "",
        e.vertexUv2s ? "#define USE_UV2" : "",
        e.vertexUv3s ? "#define USE_UV3" : "",
        e.pointsUvs ? "#define USE_POINTS_UV" : "",
        e.gradientMap ? "#define USE_GRADIENTMAP" : "",
        e.flatShading ? "#define FLAT_SHADED" : "",
        e.doubleSided ? "#define DOUBLE_SIDED" : "",
        e.flipSided ? "#define FLIP_SIDED" : "",
        e.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
        e.shadowMapEnabled ? "#define " + l : "",
        e.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
        e.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
        e.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
        e.decodeVideoTextureEmissive
          ? "#define DECODE_VIDEO_TEXTURE_EMISSIVE"
          : "",
        e.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
        e.reverseDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "",
        "uniform mat4 viewMatrix;",
        "uniform vec3 cameraPosition;",
        "uniform bool isOrthographic;",
        e.toneMapping !== hn ? "#define TONE_MAPPING" : "",
        e.toneMapping !== hn ? It.tonemapping_pars_fragment : "",
        e.toneMapping !== hn ? qd("toneMapping", e.toneMapping) : "",
        e.dithering ? "#define DITHERING" : "",
        e.opaque ? "#define OPAQUE" : "",
        It.colorspace_pars_fragment,
        Xd("linearToOutputTexel", e.outputColorSpace),
        Yd(),
        e.useDepthPacking ? "#define DEPTH_PACKING " + e.depthPacking : "",
        `
`,
      ].filter(di).join(`
`))),
    (a = Es(a)),
    (a = Na(a, e)),
    (a = Fa(a, e)),
    (o = Es(o)),
    (o = Na(o, e)),
    (o = Fa(o, e)),
    (a = Oa(a)),
    (o = Oa(o)),
    e.isRawShaderMaterial !== !0 &&
      ((b = `#version 300 es
`),
      (p =
        [
          m,
          "#define attribute in",
          "#define varying out",
          "#define texture2D texture",
        ].join(`
`) +
        `
` +
        p),
      (h =
        [
          "#define varying in",
          e.glslVersion === js
            ? ""
            : "layout(location = 0) out highp vec4 pc_fragColor;",
          e.glslVersion === js ? "" : "#define gl_FragColor pc_fragColor",
          "#define gl_FragDepthEXT gl_FragDepth",
          "#define texture2D texture",
          "#define textureCube texture",
          "#define texture2DProj textureProj",
          "#define texture2DLodEXT textureLod",
          "#define texture2DProjLodEXT textureProjLod",
          "#define textureCubeLodEXT textureLod",
          "#define texture2DGradEXT textureGrad",
          "#define texture2DProjGradEXT textureProjGrad",
          "#define textureCubeGradEXT textureGrad",
        ].join(`
`) +
        `
` +
        h));
  const T = b + p + a,
    E = b + h + o,
    O = Ia(r, r.VERTEX_SHADER, T),
    C = Ia(r, r.FRAGMENT_SHADER, E);
  r.attachShader(M, O),
    r.attachShader(M, C),
    e.index0AttributeName !== void 0
      ? r.bindAttribLocation(M, 0, e.index0AttributeName)
      : e.morphTargets === !0 && r.bindAttribLocation(M, 0, "position"),
    r.linkProgram(M);
  function A(R) {
    if (i.debug.checkShaderErrors) {
      const G = r.getProgramInfoLog(M).trim(),
        H = r.getShaderInfoLog(O).trim(),
        $ = r.getShaderInfoLog(C).trim();
      let K = !0,
        X = !0;
      if (r.getProgramParameter(M, r.LINK_STATUS) === !1)
        if (((K = !1), typeof i.debug.onShaderError == "function"))
          i.debug.onShaderError(r, M, O, C);
        else {
          const Z = Ua(r, O, "vertex"),
            z = Ua(r, C, "fragment");
          console.error(
            "THREE.WebGLProgram: Shader Error " +
              r.getError() +
              " - VALIDATE_STATUS " +
              r.getProgramParameter(M, r.VALIDATE_STATUS) +
              `

Material Name: ` +
              R.name +
              `
Material Type: ` +
              R.type +
              `

Program Info Log: ` +
              G +
              `
` +
              Z +
              `
` +
              z
          );
        }
      else
        G !== ""
          ? console.warn("THREE.WebGLProgram: Program Info Log:", G)
          : (H === "" || $ === "") && (X = !1);
      X &&
        (R.diagnostics = {
          runnable: K,
          programLog: G,
          vertexShader: { log: H, prefix: p },
          fragmentShader: { log: $, prefix: h },
        });
    }
    r.deleteShader(O), r.deleteShader(C), (D = new Ki(r, M)), (S = Zd(r, M));
  }
  let D;
  this.getUniforms = function () {
    return D === void 0 && A(this), D;
  };
  let S;
  this.getAttributes = function () {
    return S === void 0 && A(this), S;
  };
  let x = e.rendererExtensionParallelShaderCompile === !1;
  return (
    (this.isReady = function () {
      return x === !1 && (x = r.getProgramParameter(M, Vd)), x;
    }),
    (this.destroy = function () {
      n.releaseStatesOfProgram(this),
        r.deleteProgram(M),
        (this.program = void 0);
    }),
    (this.type = e.shaderType),
    (this.name = e.shaderName),
    (this.id = Gd++),
    (this.cacheKey = t),
    (this.usedTimes = 1),
    (this.program = M),
    (this.vertexShader = O),
    (this.fragmentShader = C),
    this
  );
}
let cf = 0;
class hf {
  constructor() {
    (this.shaderCache = new Map()), (this.materialCache = new Map());
  }
  update(t) {
    const e = t.vertexShader,
      n = t.fragmentShader,
      r = this._getShaderStage(e),
      s = this._getShaderStage(n),
      a = this._getShaderCacheForMaterial(t);
    return (
      a.has(r) === !1 && (a.add(r), r.usedTimes++),
      a.has(s) === !1 && (a.add(s), s.usedTimes++),
      this
    );
  }
  remove(t) {
    const e = this.materialCache.get(t);
    for (const n of e)
      n.usedTimes--, n.usedTimes === 0 && this.shaderCache.delete(n.code);
    return this.materialCache.delete(t), this;
  }
  getVertexShaderID(t) {
    return this._getShaderStage(t.vertexShader).id;
  }
  getFragmentShaderID(t) {
    return this._getShaderStage(t.fragmentShader).id;
  }
  dispose() {
    this.shaderCache.clear(), this.materialCache.clear();
  }
  _getShaderCacheForMaterial(t) {
    const e = this.materialCache;
    let n = e.get(t);
    return n === void 0 && ((n = new Set()), e.set(t, n)), n;
  }
  _getShaderStage(t) {
    const e = this.shaderCache;
    let n = e.get(t);
    return n === void 0 && ((n = new uf(t)), e.set(t, n)), n;
  }
}
class uf {
  constructor(t) {
    (this.id = cf++), (this.code = t), (this.usedTimes = 0);
  }
}
function df(i, t, e, n, r, s, a) {
  const o = new lo(),
    l = new hf(),
    c = new Set(),
    u = [],
    d = r.logarithmicDepthBuffer,
    f = r.vertexTextures;
  let m = r.precision;
  const v = {
    MeshDepthMaterial: "depth",
    MeshDistanceMaterial: "distanceRGBA",
    MeshNormalMaterial: "normal",
    MeshBasicMaterial: "basic",
    MeshLambertMaterial: "lambert",
    MeshPhongMaterial: "phong",
    MeshToonMaterial: "toon",
    MeshStandardMaterial: "physical",
    MeshPhysicalMaterial: "physical",
    MeshMatcapMaterial: "matcap",
    LineBasicMaterial: "basic",
    LineDashedMaterial: "dashed",
    PointsMaterial: "points",
    ShadowMaterial: "shadow",
    SpriteMaterial: "sprite",
  };
  function M(S) {
    return c.add(S), S === 0 ? "uv" : `uv${S}`;
  }
  function p(S, x, R, G, H) {
    const $ = G.fog,
      K = H.geometry,
      X = S.isMeshStandardMaterial ? G.environment : null,
      Z = (S.isMeshStandardMaterial ? e : t).get(S.envMap || X),
      z = Z && Z.mapping === Qi ? Z.image.height : null,
      et = v[S.type];
    S.precision !== null &&
      ((m = r.getMaxPrecision(S.precision)),
      m !== S.precision &&
        console.warn(
          "THREE.WebGLProgram.getParameters:",
          S.precision,
          "not supported, using",
          m,
          "instead."
        ));
    const ct =
        K.morphAttributes.position ||
        K.morphAttributes.normal ||
        K.morphAttributes.color,
      _t = ct !== void 0 ? ct.length : 0;
    let Rt = 0;
    K.morphAttributes.position !== void 0 && (Rt = 1),
      K.morphAttributes.normal !== void 0 && (Rt = 2),
      K.morphAttributes.color !== void 0 && (Rt = 3);
    let Vt, W, tt, gt;
    if (et) {
      const Wt = Ne[et];
      (Vt = Wt.vertexShader), (W = Wt.fragmentShader);
    } else
      (Vt = S.vertexShader),
        (W = S.fragmentShader),
        l.update(S),
        (tt = l.getVertexShaderID(S)),
        (gt = l.getFragmentShaderID(S));
    const rt = i.getRenderTarget(),
      yt = i.state.buffers.depth.getReversed(),
      At = H.isInstancedMesh === !0,
      Dt = H.isBatchedMesh === !0,
      Qt = !!S.map,
      Ot = !!S.matcap,
      ee = !!Z,
      I = !!S.aoMap,
      Se = !!S.lightMap,
      Ut = !!S.bumpMap,
      Nt = !!S.normalMap,
      St = !!S.displacementMap,
      Zt = !!S.emissiveMap,
      Mt = !!S.metalnessMap,
      y = !!S.roughnessMap,
      _ = S.anisotropy > 0,
      U = S.clearcoat > 0,
      q = S.dispersion > 0,
      j = S.iridescence > 0,
      k = S.sheen > 0,
      vt = S.transmission > 0,
      st = _ && !!S.anisotropyMap,
      ht = U && !!S.clearcoatMap,
      Bt = U && !!S.clearcoatNormalMap,
      J = U && !!S.clearcoatRoughnessMap,
      ut = j && !!S.iridescenceMap,
      Et = j && !!S.iridescenceThicknessMap,
      Tt = k && !!S.sheenColorMap,
      dt = k && !!S.sheenRoughnessMap,
      Ft = !!S.specularMap,
      Lt = !!S.specularColorMap,
      $t = !!S.specularIntensityMap,
      w = vt && !!S.transmissionMap,
      it = vt && !!S.thicknessMap,
      V = !!S.gradientMap,
      Y = !!S.alphaMap,
      lt = S.alphaTest > 0,
      at = !!S.alphaHash,
      wt = !!S.extensions;
    let te = hn;
    S.toneMapped &&
      (rt === null || rt.isXRRenderTarget === !0) &&
      (te = i.toneMapping);
    const le = {
      shaderID: et,
      shaderType: S.type,
      shaderName: S.name,
      vertexShader: Vt,
      fragmentShader: W,
      defines: S.defines,
      customVertexShaderID: tt,
      customFragmentShaderID: gt,
      isRawShaderMaterial: S.isRawShaderMaterial === !0,
      glslVersion: S.glslVersion,
      precision: m,
      batching: Dt,
      batchingColor: Dt && H._colorsTexture !== null,
      instancing: At,
      instancingColor: At && H.instanceColor !== null,
      instancingMorph: At && H.morphTexture !== null,
      supportsVertexTextures: f,
      outputColorSpace:
        rt === null
          ? i.outputColorSpace
          : rt.isXRRenderTarget === !0
          ? rt.texture.colorSpace
          : ei,
      alphaToCoverage: !!S.alphaToCoverage,
      map: Qt,
      matcap: Ot,
      envMap: ee,
      envMapMode: ee && Z.mapping,
      envMapCubeUVHeight: z,
      aoMap: I,
      lightMap: Se,
      bumpMap: Ut,
      normalMap: Nt,
      displacementMap: f && St,
      emissiveMap: Zt,
      normalMapObjectSpace: Nt && S.normalMapType === gl,
      normalMapTangentSpace: Nt && S.normalMapType === _l,
      metalnessMap: Mt,
      roughnessMap: y,
      anisotropy: _,
      anisotropyMap: st,
      clearcoat: U,
      clearcoatMap: ht,
      clearcoatNormalMap: Bt,
      clearcoatRoughnessMap: J,
      dispersion: q,
      iridescence: j,
      iridescenceMap: ut,
      iridescenceThicknessMap: Et,
      sheen: k,
      sheenColorMap: Tt,
      sheenRoughnessMap: dt,
      specularMap: Ft,
      specularColorMap: Lt,
      specularIntensityMap: $t,
      transmission: vt,
      transmissionMap: w,
      thicknessMap: it,
      gradientMap: V,
      opaque:
        S.transparent === !1 && S.blending === qn && S.alphaToCoverage === !1,
      alphaMap: Y,
      alphaTest: lt,
      alphaHash: at,
      combine: S.combine,
      mapUv: Qt && M(S.map.channel),
      aoMapUv: I && M(S.aoMap.channel),
      lightMapUv: Se && M(S.lightMap.channel),
      bumpMapUv: Ut && M(S.bumpMap.channel),
      normalMapUv: Nt && M(S.normalMap.channel),
      displacementMapUv: St && M(S.displacementMap.channel),
      emissiveMapUv: Zt && M(S.emissiveMap.channel),
      metalnessMapUv: Mt && M(S.metalnessMap.channel),
      roughnessMapUv: y && M(S.roughnessMap.channel),
      anisotropyMapUv: st && M(S.anisotropyMap.channel),
      clearcoatMapUv: ht && M(S.clearcoatMap.channel),
      clearcoatNormalMapUv: Bt && M(S.clearcoatNormalMap.channel),
      clearcoatRoughnessMapUv: J && M(S.clearcoatRoughnessMap.channel),
      iridescenceMapUv: ut && M(S.iridescenceMap.channel),
      iridescenceThicknessMapUv: Et && M(S.iridescenceThicknessMap.channel),
      sheenColorMapUv: Tt && M(S.sheenColorMap.channel),
      sheenRoughnessMapUv: dt && M(S.sheenRoughnessMap.channel),
      specularMapUv: Ft && M(S.specularMap.channel),
      specularColorMapUv: Lt && M(S.specularColorMap.channel),
      specularIntensityMapUv: $t && M(S.specularIntensityMap.channel),
      transmissionMapUv: w && M(S.transmissionMap.channel),
      thicknessMapUv: it && M(S.thicknessMap.channel),
      alphaMapUv: Y && M(S.alphaMap.channel),
      vertexTangents: !!K.attributes.tangent && (Nt || _),
      vertexColors: S.vertexColors,
      vertexAlphas:
        S.vertexColors === !0 &&
        !!K.attributes.color &&
        K.attributes.color.itemSize === 4,
      pointsUvs: H.isPoints === !0 && !!K.attributes.uv && (Qt || Y),
      fog: !!$,
      useFog: S.fog === !0,
      fogExp2: !!$ && $.isFogExp2,
      flatShading: S.flatShading === !0,
      sizeAttenuation: S.sizeAttenuation === !0,
      logarithmicDepthBuffer: d,
      reverseDepthBuffer: yt,
      skinning: H.isSkinnedMesh === !0,
      morphTargets: K.morphAttributes.position !== void 0,
      morphNormals: K.morphAttributes.normal !== void 0,
      morphColors: K.morphAttributes.color !== void 0,
      morphTargetsCount: _t,
      morphTextureStride: Rt,
      numDirLights: x.directional.length,
      numPointLights: x.point.length,
      numSpotLights: x.spot.length,
      numSpotLightMaps: x.spotLightMap.length,
      numRectAreaLights: x.rectArea.length,
      numHemiLights: x.hemi.length,
      numDirLightShadows: x.directionalShadowMap.length,
      numPointLightShadows: x.pointShadowMap.length,
      numSpotLightShadows: x.spotShadowMap.length,
      numSpotLightShadowsWithMaps: x.numSpotLightShadowsWithMaps,
      numLightProbes: x.numLightProbes,
      numClippingPlanes: a.numPlanes,
      numClipIntersection: a.numIntersection,
      dithering: S.dithering,
      shadowMapEnabled: i.shadowMap.enabled && R.length > 0,
      shadowMapType: i.shadowMap.type,
      toneMapping: te,
      decodeVideoTexture:
        Qt &&
        S.map.isVideoTexture === !0 &&
        zt.getTransfer(S.map.colorSpace) === Xt,
      decodeVideoTextureEmissive:
        Zt &&
        S.emissiveMap.isVideoTexture === !0 &&
        zt.getTransfer(S.emissiveMap.colorSpace) === Xt,
      premultipliedAlpha: S.premultipliedAlpha,
      doubleSided: S.side === Ye,
      flipSided: S.side === me,
      useDepthPacking: S.depthPacking >= 0,
      depthPacking: S.depthPacking || 0,
      index0AttributeName: S.index0AttributeName,
      extensionClipCullDistance:
        wt &&
        S.extensions.clipCullDistance === !0 &&
        n.has("WEBGL_clip_cull_distance"),
      extensionMultiDraw:
        ((wt && S.extensions.multiDraw === !0) || Dt) &&
        n.has("WEBGL_multi_draw"),
      rendererExtensionParallelShaderCompile: n.has(
        "KHR_parallel_shader_compile"
      ),
      customProgramCacheKey: S.customProgramCacheKey(),
    };
    return (
      (le.vertexUv1s = c.has(1)),
      (le.vertexUv2s = c.has(2)),
      (le.vertexUv3s = c.has(3)),
      c.clear(),
      le
    );
  }
  function h(S) {
    const x = [];
    if (
      (S.shaderID
        ? x.push(S.shaderID)
        : (x.push(S.customVertexShaderID), x.push(S.customFragmentShaderID)),
      S.defines !== void 0)
    )
      for (const R in S.defines) x.push(R), x.push(S.defines[R]);
    return (
      S.isRawShaderMaterial === !1 &&
        (b(x, S), T(x, S), x.push(i.outputColorSpace)),
      x.push(S.customProgramCacheKey),
      x.join()
    );
  }
  function b(S, x) {
    S.push(x.precision),
      S.push(x.outputColorSpace),
      S.push(x.envMapMode),
      S.push(x.envMapCubeUVHeight),
      S.push(x.mapUv),
      S.push(x.alphaMapUv),
      S.push(x.lightMapUv),
      S.push(x.aoMapUv),
      S.push(x.bumpMapUv),
      S.push(x.normalMapUv),
      S.push(x.displacementMapUv),
      S.push(x.emissiveMapUv),
      S.push(x.metalnessMapUv),
      S.push(x.roughnessMapUv),
      S.push(x.anisotropyMapUv),
      S.push(x.clearcoatMapUv),
      S.push(x.clearcoatNormalMapUv),
      S.push(x.clearcoatRoughnessMapUv),
      S.push(x.iridescenceMapUv),
      S.push(x.iridescenceThicknessMapUv),
      S.push(x.sheenColorMapUv),
      S.push(x.sheenRoughnessMapUv),
      S.push(x.specularMapUv),
      S.push(x.specularColorMapUv),
      S.push(x.specularIntensityMapUv),
      S.push(x.transmissionMapUv),
      S.push(x.thicknessMapUv),
      S.push(x.combine),
      S.push(x.fogExp2),
      S.push(x.sizeAttenuation),
      S.push(x.morphTargetsCount),
      S.push(x.morphAttributeCount),
      S.push(x.numDirLights),
      S.push(x.numPointLights),
      S.push(x.numSpotLights),
      S.push(x.numSpotLightMaps),
      S.push(x.numHemiLights),
      S.push(x.numRectAreaLights),
      S.push(x.numDirLightShadows),
      S.push(x.numPointLightShadows),
      S.push(x.numSpotLightShadows),
      S.push(x.numSpotLightShadowsWithMaps),
      S.push(x.numLightProbes),
      S.push(x.shadowMapType),
      S.push(x.toneMapping),
      S.push(x.numClippingPlanes),
      S.push(x.numClipIntersection),
      S.push(x.depthPacking);
  }
  function T(S, x) {
    o.disableAll(),
      x.supportsVertexTextures && o.enable(0),
      x.instancing && o.enable(1),
      x.instancingColor && o.enable(2),
      x.instancingMorph && o.enable(3),
      x.matcap && o.enable(4),
      x.envMap && o.enable(5),
      x.normalMapObjectSpace && o.enable(6),
      x.normalMapTangentSpace && o.enable(7),
      x.clearcoat && o.enable(8),
      x.iridescence && o.enable(9),
      x.alphaTest && o.enable(10),
      x.vertexColors && o.enable(11),
      x.vertexAlphas && o.enable(12),
      x.vertexUv1s && o.enable(13),
      x.vertexUv2s && o.enable(14),
      x.vertexUv3s && o.enable(15),
      x.vertexTangents && o.enable(16),
      x.anisotropy && o.enable(17),
      x.alphaHash && o.enable(18),
      x.batching && o.enable(19),
      x.dispersion && o.enable(20),
      x.batchingColor && o.enable(21),
      S.push(o.mask),
      o.disableAll(),
      x.fog && o.enable(0),
      x.useFog && o.enable(1),
      x.flatShading && o.enable(2),
      x.logarithmicDepthBuffer && o.enable(3),
      x.reverseDepthBuffer && o.enable(4),
      x.skinning && o.enable(5),
      x.morphTargets && o.enable(6),
      x.morphNormals && o.enable(7),
      x.morphColors && o.enable(8),
      x.premultipliedAlpha && o.enable(9),
      x.shadowMapEnabled && o.enable(10),
      x.doubleSided && o.enable(11),
      x.flipSided && o.enable(12),
      x.useDepthPacking && o.enable(13),
      x.dithering && o.enable(14),
      x.transmission && o.enable(15),
      x.sheen && o.enable(16),
      x.opaque && o.enable(17),
      x.pointsUvs && o.enable(18),
      x.decodeVideoTexture && o.enable(19),
      x.decodeVideoTextureEmissive && o.enable(20),
      x.alphaToCoverage && o.enable(21),
      S.push(o.mask);
  }
  function E(S) {
    const x = v[S.type];
    let R;
    if (x) {
      const G = Ne[x];
      R = Yl.clone(G.uniforms);
    } else R = S.uniforms;
    return R;
  }
  function O(S, x) {
    let R;
    for (let G = 0, H = u.length; G < H; G++) {
      const $ = u[G];
      if ($.cacheKey === x) {
        (R = $), ++R.usedTimes;
        break;
      }
    }
    return R === void 0 && ((R = new lf(i, x, S, s)), u.push(R)), R;
  }
  function C(S) {
    if (--S.usedTimes === 0) {
      const x = u.indexOf(S);
      (u[x] = u[u.length - 1]), u.pop(), S.destroy();
    }
  }
  function A(S) {
    l.remove(S);
  }
  function D() {
    l.dispose();
  }
  return {
    getParameters: p,
    getProgramCacheKey: h,
    getUniforms: E,
    acquireProgram: O,
    releaseProgram: C,
    releaseShaderCache: A,
    programs: u,
    dispose: D,
  };
}
function ff() {
  let i = new WeakMap();
  function t(a) {
    return i.has(a);
  }
  function e(a) {
    let o = i.get(a);
    return o === void 0 && ((o = {}), i.set(a, o)), o;
  }
  function n(a) {
    i.delete(a);
  }
  function r(a, o, l) {
    i.get(a)[o] = l;
  }
  function s() {
    i = new WeakMap();
  }
  return { has: t, get: e, remove: n, update: r, dispose: s };
}
function pf(i, t) {
  return i.groupOrder !== t.groupOrder
    ? i.groupOrder - t.groupOrder
    : i.renderOrder !== t.renderOrder
    ? i.renderOrder - t.renderOrder
    : i.material.id !== t.material.id
    ? i.material.id - t.material.id
    : i.z !== t.z
    ? i.z - t.z
    : i.id - t.id;
}
function za(i, t) {
  return i.groupOrder !== t.groupOrder
    ? i.groupOrder - t.groupOrder
    : i.renderOrder !== t.renderOrder
    ? i.renderOrder - t.renderOrder
    : i.z !== t.z
    ? t.z - i.z
    : i.id - t.id;
}
function Ha() {
  const i = [];
  let t = 0;
  const e = [],
    n = [],
    r = [];
  function s() {
    (t = 0), (e.length = 0), (n.length = 0), (r.length = 0);
  }
  function a(d, f, m, v, M, p) {
    let h = i[t];
    return (
      h === void 0
        ? ((h = {
            id: d.id,
            object: d,
            geometry: f,
            material: m,
            groupOrder: v,
            renderOrder: d.renderOrder,
            z: M,
            group: p,
          }),
          (i[t] = h))
        : ((h.id = d.id),
          (h.object = d),
          (h.geometry = f),
          (h.material = m),
          (h.groupOrder = v),
          (h.renderOrder = d.renderOrder),
          (h.z = M),
          (h.group = p)),
      t++,
      h
    );
  }
  function o(d, f, m, v, M, p) {
    const h = a(d, f, m, v, M, p);
    m.transmission > 0
      ? n.push(h)
      : m.transparent === !0
      ? r.push(h)
      : e.push(h);
  }
  function l(d, f, m, v, M, p) {
    const h = a(d, f, m, v, M, p);
    m.transmission > 0
      ? n.unshift(h)
      : m.transparent === !0
      ? r.unshift(h)
      : e.unshift(h);
  }
  function c(d, f) {
    e.length > 1 && e.sort(d || pf),
      n.length > 1 && n.sort(f || za),
      r.length > 1 && r.sort(f || za);
  }
  function u() {
    for (let d = t, f = i.length; d < f; d++) {
      const m = i[d];
      if (m.id === null) break;
      (m.id = null),
        (m.object = null),
        (m.geometry = null),
        (m.material = null),
        (m.group = null);
    }
  }
  return {
    opaque: e,
    transmissive: n,
    transparent: r,
    init: s,
    push: o,
    unshift: l,
    finish: u,
    sort: c,
  };
}
function mf() {
  let i = new WeakMap();
  function t(n, r) {
    const s = i.get(n);
    let a;
    return (
      s === void 0
        ? ((a = new Ha()), i.set(n, [a]))
        : r >= s.length
        ? ((a = new Ha()), s.push(a))
        : (a = s[r]),
      a
    );
  }
  function e() {
    i = new WeakMap();
  }
  return { get: t, dispose: e };
}
function _f() {
  const i = {};
  return {
    get: function (t) {
      if (i[t.id] !== void 0) return i[t.id];
      let e;
      switch (t.type) {
        case "DirectionalLight":
          e = { direction: new B(), color: new qt() };
          break;
        case "SpotLight":
          e = {
            position: new B(),
            direction: new B(),
            color: new qt(),
            distance: 0,
            coneCos: 0,
            penumbraCos: 0,
            decay: 0,
          };
          break;
        case "PointLight":
          e = { position: new B(), color: new qt(), distance: 0, decay: 0 };
          break;
        case "HemisphereLight":
          e = { direction: new B(), skyColor: new qt(), groundColor: new qt() };
          break;
        case "RectAreaLight":
          e = {
            color: new qt(),
            position: new B(),
            halfWidth: new B(),
            halfHeight: new B(),
          };
          break;
      }
      return (i[t.id] = e), e;
    },
  };
}
function gf() {
  const i = {};
  return {
    get: function (t) {
      if (i[t.id] !== void 0) return i[t.id];
      let e;
      switch (t.type) {
        case "DirectionalLight":
          e = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Yt(),
          };
          break;
        case "SpotLight":
          e = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Yt(),
          };
          break;
        case "PointLight":
          e = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Yt(),
            shadowCameraNear: 1,
            shadowCameraFar: 1e3,
          };
          break;
      }
      return (i[t.id] = e), e;
    },
  };
}
let vf = 0;
function xf(i, t) {
  return (
    (t.castShadow ? 2 : 0) -
    (i.castShadow ? 2 : 0) +
    (t.map ? 1 : 0) -
    (i.map ? 1 : 0)
  );
}
function Mf(i) {
  const t = new _f(),
    e = gf(),
    n = {
      version: 0,
      hash: {
        directionalLength: -1,
        pointLength: -1,
        spotLength: -1,
        rectAreaLength: -1,
        hemiLength: -1,
        numDirectionalShadows: -1,
        numPointShadows: -1,
        numSpotShadows: -1,
        numSpotMaps: -1,
        numLightProbes: -1,
      },
      ambient: [0, 0, 0],
      probe: [],
      directional: [],
      directionalShadow: [],
      directionalShadowMap: [],
      directionalShadowMatrix: [],
      spot: [],
      spotLightMap: [],
      spotShadow: [],
      spotShadowMap: [],
      spotLightMatrix: [],
      rectArea: [],
      rectAreaLTC1: null,
      rectAreaLTC2: null,
      point: [],
      pointShadow: [],
      pointShadowMap: [],
      pointShadowMatrix: [],
      hemi: [],
      numSpotLightShadowsWithMaps: 0,
      numLightProbes: 0,
    };
  for (let c = 0; c < 9; c++) n.probe.push(new B());
  const r = new B(),
    s = new re(),
    a = new re();
  function o(c) {
    let u = 0,
      d = 0,
      f = 0;
    for (let S = 0; S < 9; S++) n.probe[S].set(0, 0, 0);
    let m = 0,
      v = 0,
      M = 0,
      p = 0,
      h = 0,
      b = 0,
      T = 0,
      E = 0,
      O = 0,
      C = 0,
      A = 0;
    c.sort(xf);
    for (let S = 0, x = c.length; S < x; S++) {
      const R = c[S],
        G = R.color,
        H = R.intensity,
        $ = R.distance,
        K = R.shadow && R.shadow.map ? R.shadow.map.texture : null;
      if (R.isAmbientLight) (u += G.r * H), (d += G.g * H), (f += G.b * H);
      else if (R.isLightProbe) {
        for (let X = 0; X < 9; X++)
          n.probe[X].addScaledVector(R.sh.coefficients[X], H);
        A++;
      } else if (R.isDirectionalLight) {
        const X = t.get(R);
        if ((X.color.copy(R.color).multiplyScalar(R.intensity), R.castShadow)) {
          const Z = R.shadow,
            z = e.get(R);
          (z.shadowIntensity = Z.intensity),
            (z.shadowBias = Z.bias),
            (z.shadowNormalBias = Z.normalBias),
            (z.shadowRadius = Z.radius),
            (z.shadowMapSize = Z.mapSize),
            (n.directionalShadow[m] = z),
            (n.directionalShadowMap[m] = K),
            (n.directionalShadowMatrix[m] = R.shadow.matrix),
            b++;
        }
        (n.directional[m] = X), m++;
      } else if (R.isSpotLight) {
        const X = t.get(R);
        X.position.setFromMatrixPosition(R.matrixWorld),
          X.color.copy(G).multiplyScalar(H),
          (X.distance = $),
          (X.coneCos = Math.cos(R.angle)),
          (X.penumbraCos = Math.cos(R.angle * (1 - R.penumbra))),
          (X.decay = R.decay),
          (n.spot[M] = X);
        const Z = R.shadow;
        if (
          (R.map &&
            ((n.spotLightMap[O] = R.map),
            O++,
            Z.updateMatrices(R),
            R.castShadow && C++),
          (n.spotLightMatrix[M] = Z.matrix),
          R.castShadow)
        ) {
          const z = e.get(R);
          (z.shadowIntensity = Z.intensity),
            (z.shadowBias = Z.bias),
            (z.shadowNormalBias = Z.normalBias),
            (z.shadowRadius = Z.radius),
            (z.shadowMapSize = Z.mapSize),
            (n.spotShadow[M] = z),
            (n.spotShadowMap[M] = K),
            E++;
        }
        M++;
      } else if (R.isRectAreaLight) {
        const X = t.get(R);
        X.color.copy(G).multiplyScalar(H),
          X.halfWidth.set(R.width * 0.5, 0, 0),
          X.halfHeight.set(0, R.height * 0.5, 0),
          (n.rectArea[p] = X),
          p++;
      } else if (R.isPointLight) {
        const X = t.get(R);
        if (
          (X.color.copy(R.color).multiplyScalar(R.intensity),
          (X.distance = R.distance),
          (X.decay = R.decay),
          R.castShadow)
        ) {
          const Z = R.shadow,
            z = e.get(R);
          (z.shadowIntensity = Z.intensity),
            (z.shadowBias = Z.bias),
            (z.shadowNormalBias = Z.normalBias),
            (z.shadowRadius = Z.radius),
            (z.shadowMapSize = Z.mapSize),
            (z.shadowCameraNear = Z.camera.near),
            (z.shadowCameraFar = Z.camera.far),
            (n.pointShadow[v] = z),
            (n.pointShadowMap[v] = K),
            (n.pointShadowMatrix[v] = R.shadow.matrix),
            T++;
        }
        (n.point[v] = X), v++;
      } else if (R.isHemisphereLight) {
        const X = t.get(R);
        X.skyColor.copy(R.color).multiplyScalar(H),
          X.groundColor.copy(R.groundColor).multiplyScalar(H),
          (n.hemi[h] = X),
          h++;
      }
    }
    p > 0 &&
      (i.has("OES_texture_float_linear") === !0
        ? ((n.rectAreaLTC1 = nt.LTC_FLOAT_1), (n.rectAreaLTC2 = nt.LTC_FLOAT_2))
        : ((n.rectAreaLTC1 = nt.LTC_HALF_1), (n.rectAreaLTC2 = nt.LTC_HALF_2))),
      (n.ambient[0] = u),
      (n.ambient[1] = d),
      (n.ambient[2] = f);
    const D = n.hash;
    (D.directionalLength !== m ||
      D.pointLength !== v ||
      D.spotLength !== M ||
      D.rectAreaLength !== p ||
      D.hemiLength !== h ||
      D.numDirectionalShadows !== b ||
      D.numPointShadows !== T ||
      D.numSpotShadows !== E ||
      D.numSpotMaps !== O ||
      D.numLightProbes !== A) &&
      ((n.directional.length = m),
      (n.spot.length = M),
      (n.rectArea.length = p),
      (n.point.length = v),
      (n.hemi.length = h),
      (n.directionalShadow.length = b),
      (n.directionalShadowMap.length = b),
      (n.pointShadow.length = T),
      (n.pointShadowMap.length = T),
      (n.spotShadow.length = E),
      (n.spotShadowMap.length = E),
      (n.directionalShadowMatrix.length = b),
      (n.pointShadowMatrix.length = T),
      (n.spotLightMatrix.length = E + O - C),
      (n.spotLightMap.length = O),
      (n.numSpotLightShadowsWithMaps = C),
      (n.numLightProbes = A),
      (D.directionalLength = m),
      (D.pointLength = v),
      (D.spotLength = M),
      (D.rectAreaLength = p),
      (D.hemiLength = h),
      (D.numDirectionalShadows = b),
      (D.numPointShadows = T),
      (D.numSpotShadows = E),
      (D.numSpotMaps = O),
      (D.numLightProbes = A),
      (n.version = vf++));
  }
  function l(c, u) {
    let d = 0,
      f = 0,
      m = 0,
      v = 0,
      M = 0;
    const p = u.matrixWorldInverse;
    for (let h = 0, b = c.length; h < b; h++) {
      const T = c[h];
      if (T.isDirectionalLight) {
        const E = n.directional[d];
        E.direction.setFromMatrixPosition(T.matrixWorld),
          r.setFromMatrixPosition(T.target.matrixWorld),
          E.direction.sub(r),
          E.direction.transformDirection(p),
          d++;
      } else if (T.isSpotLight) {
        const E = n.spot[m];
        E.position.setFromMatrixPosition(T.matrixWorld),
          E.position.applyMatrix4(p),
          E.direction.setFromMatrixPosition(T.matrixWorld),
          r.setFromMatrixPosition(T.target.matrixWorld),
          E.direction.sub(r),
          E.direction.transformDirection(p),
          m++;
      } else if (T.isRectAreaLight) {
        const E = n.rectArea[v];
        E.position.setFromMatrixPosition(T.matrixWorld),
          E.position.applyMatrix4(p),
          a.identity(),
          s.copy(T.matrixWorld),
          s.premultiply(p),
          a.extractRotation(s),
          E.halfWidth.set(T.width * 0.5, 0, 0),
          E.halfHeight.set(0, T.height * 0.5, 0),
          E.halfWidth.applyMatrix4(a),
          E.halfHeight.applyMatrix4(a),
          v++;
      } else if (T.isPointLight) {
        const E = n.point[f];
        E.position.setFromMatrixPosition(T.matrixWorld),
          E.position.applyMatrix4(p),
          f++;
      } else if (T.isHemisphereLight) {
        const E = n.hemi[M];
        E.direction.setFromMatrixPosition(T.matrixWorld),
          E.direction.transformDirection(p),
          M++;
      }
    }
  }
  return { setup: o, setupView: l, state: n };
}
function Va(i) {
  const t = new Mf(i),
    e = [],
    n = [];
  function r(u) {
    (c.camera = u), (e.length = 0), (n.length = 0);
  }
  function s(u) {
    e.push(u);
  }
  function a(u) {
    n.push(u);
  }
  function o() {
    t.setup(e);
  }
  function l(u) {
    t.setupView(e, u);
  }
  const c = {
    lightsArray: e,
    shadowsArray: n,
    camera: null,
    lights: t,
    transmissionRenderTarget: {},
  };
  return {
    init: r,
    state: c,
    setupLights: o,
    setupLightsView: l,
    pushLight: s,
    pushShadow: a,
  };
}
function Sf(i) {
  let t = new WeakMap();
  function e(r, s = 0) {
    const a = t.get(r);
    let o;
    return (
      a === void 0
        ? ((o = new Va(i)), t.set(r, [o]))
        : s >= a.length
        ? ((o = new Va(i)), a.push(o))
        : (o = a[s]),
      o
    );
  }
  function n() {
    t = new WeakMap();
  }
  return { get: e, dispose: n };
}
class Ef extends er {
  static get type() {
    return "MeshDepthMaterial";
  }
  constructor(t) {
    super(),
      (this.isMeshDepthMaterial = !0),
      (this.depthPacking = pl),
      (this.map = null),
      (this.alphaMap = null),
      (this.displacementMap = null),
      (this.displacementScale = 1),
      (this.displacementBias = 0),
      (this.wireframe = !1),
      (this.wireframeLinewidth = 1),
      this.setValues(t);
  }
  copy(t) {
    return (
      super.copy(t),
      (this.depthPacking = t.depthPacking),
      (this.map = t.map),
      (this.alphaMap = t.alphaMap),
      (this.displacementMap = t.displacementMap),
      (this.displacementScale = t.displacementScale),
      (this.displacementBias = t.displacementBias),
      (this.wireframe = t.wireframe),
      (this.wireframeLinewidth = t.wireframeLinewidth),
      this
    );
  }
}
class yf extends er {
  static get type() {
    return "MeshDistanceMaterial";
  }
  constructor(t) {
    super(),
      (this.isMeshDistanceMaterial = !0),
      (this.map = null),
      (this.alphaMap = null),
      (this.displacementMap = null),
      (this.displacementScale = 1),
      (this.displacementBias = 0),
      this.setValues(t);
  }
  copy(t) {
    return (
      super.copy(t),
      (this.map = t.map),
      (this.alphaMap = t.alphaMap),
      (this.displacementMap = t.displacementMap),
      (this.displacementScale = t.displacementScale),
      (this.displacementBias = t.displacementBias),
      this
    );
  }
}
const Tf = `void main() {
	gl_Position = vec4( position, 1.0 );
}`,
  bf = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;
function Af(i, t, e) {
  let n = new _o();
  const r = new Yt(),
    s = new Yt(),
    a = new ne(),
    o = new Ef({ depthPacking: ml }),
    l = new yf(),
    c = {},
    u = e.maxTextureSize,
    d = { [un]: me, [me]: un, [Ye]: Ye },
    f = new dn({
      defines: { VSM_SAMPLES: 8 },
      uniforms: {
        shadow_pass: { value: null },
        resolution: { value: new Yt() },
        radius: { value: 4 },
      },
      vertexShader: Tf,
      fragmentShader: bf,
    }),
    m = f.clone();
  m.defines.HORIZONTAL_PASS = 1;
  const v = new Cn();
  v.setAttribute(
    "position",
    new Be(new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]), 3)
  );
  const M = new Oe(v, f),
    p = this;
  (this.enabled = !1),
    (this.autoUpdate = !0),
    (this.needsUpdate = !1),
    (this.type = Xa);
  let h = this.type;
  this.render = function (C, A, D) {
    if (
      p.enabled === !1 ||
      (p.autoUpdate === !1 && p.needsUpdate === !1) ||
      C.length === 0
    )
      return;
    const S = i.getRenderTarget(),
      x = i.getActiveCubeFace(),
      R = i.getActiveMipmapLevel(),
      G = i.state;
    G.setBlending(cn),
      G.buffers.color.setClear(1, 1, 1, 1),
      G.buffers.depth.setTest(!0),
      G.setScissorTest(!1);
    const H = h !== qe && this.type === qe,
      $ = h === qe && this.type !== qe;
    for (let K = 0, X = C.length; K < X; K++) {
      const Z = C[K],
        z = Z.shadow;
      if (z === void 0) {
        console.warn("THREE.WebGLShadowMap:", Z, "has no shadow.");
        continue;
      }
      if (z.autoUpdate === !1 && z.needsUpdate === !1) continue;
      r.copy(z.mapSize);
      const et = z.getFrameExtents();
      if (
        (r.multiply(et),
        s.copy(z.mapSize),
        (r.x > u || r.y > u) &&
          (r.x > u &&
            ((s.x = Math.floor(u / et.x)),
            (r.x = s.x * et.x),
            (z.mapSize.x = s.x)),
          r.y > u &&
            ((s.y = Math.floor(u / et.y)),
            (r.y = s.y * et.y),
            (z.mapSize.y = s.y))),
        z.map === null || H === !0 || $ === !0)
      ) {
        const _t = this.type !== qe ? { minFilter: De, magFilter: De } : {};
        z.map !== null && z.map.dispose(),
          (z.map = new wn(r.x, r.y, _t)),
          (z.map.texture.name = Z.name + ".shadowMap"),
          z.camera.updateProjectionMatrix();
      }
      i.setRenderTarget(z.map), i.clear();
      const ct = z.getViewportCount();
      for (let _t = 0; _t < ct; _t++) {
        const Rt = z.getViewport(_t);
        a.set(s.x * Rt.x, s.y * Rt.y, s.x * Rt.z, s.y * Rt.w),
          G.viewport(a),
          z.updateMatrices(Z, _t),
          (n = z.getFrustum()),
          E(A, D, z.camera, Z, this.type);
      }
      z.isPointLightShadow !== !0 && this.type === qe && b(z, D),
        (z.needsUpdate = !1);
    }
    (h = this.type), (p.needsUpdate = !1), i.setRenderTarget(S, x, R);
  };
  function b(C, A) {
    const D = t.update(M);
    f.defines.VSM_SAMPLES !== C.blurSamples &&
      ((f.defines.VSM_SAMPLES = C.blurSamples),
      (m.defines.VSM_SAMPLES = C.blurSamples),
      (f.needsUpdate = !0),
      (m.needsUpdate = !0)),
      C.mapPass === null && (C.mapPass = new wn(r.x, r.y)),
      (f.uniforms.shadow_pass.value = C.map.texture),
      (f.uniforms.resolution.value = C.mapSize),
      (f.uniforms.radius.value = C.radius),
      i.setRenderTarget(C.mapPass),
      i.clear(),
      i.renderBufferDirect(A, null, D, f, M, null),
      (m.uniforms.shadow_pass.value = C.mapPass.texture),
      (m.uniforms.resolution.value = C.mapSize),
      (m.uniforms.radius.value = C.radius),
      i.setRenderTarget(C.map),
      i.clear(),
      i.renderBufferDirect(A, null, D, m, M, null);
  }
  function T(C, A, D, S) {
    let x = null;
    const R =
      D.isPointLight === !0 ? C.customDistanceMaterial : C.customDepthMaterial;
    if (R !== void 0) x = R;
    else if (
      ((x = D.isPointLight === !0 ? l : o),
      (i.localClippingEnabled &&
        A.clipShadows === !0 &&
        Array.isArray(A.clippingPlanes) &&
        A.clippingPlanes.length !== 0) ||
        (A.displacementMap && A.displacementScale !== 0) ||
        (A.alphaMap && A.alphaTest > 0) ||
        (A.map && A.alphaTest > 0))
    ) {
      const G = x.uuid,
        H = A.uuid;
      let $ = c[G];
      $ === void 0 && (($ = {}), (c[G] = $));
      let K = $[H];
      K === void 0 &&
        ((K = x.clone()), ($[H] = K), A.addEventListener("dispose", O)),
        (x = K);
    }
    if (
      ((x.visible = A.visible),
      (x.wireframe = A.wireframe),
      S === qe
        ? (x.side = A.shadowSide !== null ? A.shadowSide : A.side)
        : (x.side = A.shadowSide !== null ? A.shadowSide : d[A.side]),
      (x.alphaMap = A.alphaMap),
      (x.alphaTest = A.alphaTest),
      (x.map = A.map),
      (x.clipShadows = A.clipShadows),
      (x.clippingPlanes = A.clippingPlanes),
      (x.clipIntersection = A.clipIntersection),
      (x.displacementMap = A.displacementMap),
      (x.displacementScale = A.displacementScale),
      (x.displacementBias = A.displacementBias),
      (x.wireframeLinewidth = A.wireframeLinewidth),
      (x.linewidth = A.linewidth),
      D.isPointLight === !0 && x.isMeshDistanceMaterial === !0)
    ) {
      const G = i.properties.get(x);
      G.light = D;
    }
    return x;
  }
  function E(C, A, D, S, x) {
    if (C.visible === !1) return;
    if (
      C.layers.test(A.layers) &&
      (C.isMesh || C.isLine || C.isPoints) &&
      (C.castShadow || (C.receiveShadow && x === qe)) &&
      (!C.frustumCulled || n.intersectsObject(C))
    ) {
      C.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse, C.matrixWorld);
      const H = t.update(C),
        $ = C.material;
      if (Array.isArray($)) {
        const K = H.groups;
        for (let X = 0, Z = K.length; X < Z; X++) {
          const z = K[X],
            et = $[z.materialIndex];
          if (et && et.visible) {
            const ct = T(C, et, S, x);
            C.onBeforeShadow(i, C, A, D, H, ct, z),
              i.renderBufferDirect(D, null, H, ct, C, z),
              C.onAfterShadow(i, C, A, D, H, ct, z);
          }
        }
      } else if ($.visible) {
        const K = T(C, $, S, x);
        C.onBeforeShadow(i, C, A, D, H, K, null),
          i.renderBufferDirect(D, null, H, K, C, null),
          C.onAfterShadow(i, C, A, D, H, K, null);
      }
    }
    const G = C.children;
    for (let H = 0, $ = G.length; H < $; H++) E(G[H], A, D, S, x);
  }
  function O(C) {
    C.target.removeEventListener("dispose", O);
    for (const D in c) {
      const S = c[D],
        x = C.target.uuid;
      x in S && (S[x].dispose(), delete S[x]);
    }
  }
}
const Rf = {
  [Br]: zr,
  [Hr]: kr,
  [Vr]: Wr,
  [Kn]: Gr,
  [zr]: Br,
  [kr]: Hr,
  [Wr]: Vr,
  [Gr]: Kn,
};
function wf(i, t) {
  function e() {
    let w = !1;
    const it = new ne();
    let V = null;
    const Y = new ne(0, 0, 0, 0);
    return {
      setMask: function (lt) {
        V !== lt && !w && (i.colorMask(lt, lt, lt, lt), (V = lt));
      },
      setLocked: function (lt) {
        w = lt;
      },
      setClear: function (lt, at, wt, te, le) {
        le === !0 && ((lt *= te), (at *= te), (wt *= te)),
          it.set(lt, at, wt, te),
          Y.equals(it) === !1 && (i.clearColor(lt, at, wt, te), Y.copy(it));
      },
      reset: function () {
        (w = !1), (V = null), Y.set(-1, 0, 0, 0);
      },
    };
  }
  function n() {
    let w = !1,
      it = !1,
      V = null,
      Y = null,
      lt = null;
    return {
      setReversed: function (at) {
        if (it !== at) {
          const wt = t.get("EXT_clip_control");
          it
            ? wt.clipControlEXT(wt.LOWER_LEFT_EXT, wt.ZERO_TO_ONE_EXT)
            : wt.clipControlEXT(wt.LOWER_LEFT_EXT, wt.NEGATIVE_ONE_TO_ONE_EXT);
          const te = lt;
          (lt = null), this.setClear(te);
        }
        it = at;
      },
      getReversed: function () {
        return it;
      },
      setTest: function (at) {
        at ? rt(i.DEPTH_TEST) : yt(i.DEPTH_TEST);
      },
      setMask: function (at) {
        V !== at && !w && (i.depthMask(at), (V = at));
      },
      setFunc: function (at) {
        if ((it && (at = Rf[at]), Y !== at)) {
          switch (at) {
            case Br:
              i.depthFunc(i.NEVER);
              break;
            case zr:
              i.depthFunc(i.ALWAYS);
              break;
            case Hr:
              i.depthFunc(i.LESS);
              break;
            case Kn:
              i.depthFunc(i.LEQUAL);
              break;
            case Vr:
              i.depthFunc(i.EQUAL);
              break;
            case Gr:
              i.depthFunc(i.GEQUAL);
              break;
            case kr:
              i.depthFunc(i.GREATER);
              break;
            case Wr:
              i.depthFunc(i.NOTEQUAL);
              break;
            default:
              i.depthFunc(i.LEQUAL);
          }
          Y = at;
        }
      },
      setLocked: function (at) {
        w = at;
      },
      setClear: function (at) {
        lt !== at && (it && (at = 1 - at), i.clearDepth(at), (lt = at));
      },
      reset: function () {
        (w = !1), (V = null), (Y = null), (lt = null), (it = !1);
      },
    };
  }
  function r() {
    let w = !1,
      it = null,
      V = null,
      Y = null,
      lt = null,
      at = null,
      wt = null,
      te = null,
      le = null;
    return {
      setTest: function (Wt) {
        w || (Wt ? rt(i.STENCIL_TEST) : yt(i.STENCIL_TEST));
      },
      setMask: function (Wt) {
        it !== Wt && !w && (i.stencilMask(Wt), (it = Wt));
      },
      setFunc: function (Wt, Ae, ze) {
        (V !== Wt || Y !== Ae || lt !== ze) &&
          (i.stencilFunc(Wt, Ae, ze), (V = Wt), (Y = Ae), (lt = ze));
      },
      setOp: function (Wt, Ae, ze) {
        (at !== Wt || wt !== Ae || te !== ze) &&
          (i.stencilOp(Wt, Ae, ze), (at = Wt), (wt = Ae), (te = ze));
      },
      setLocked: function (Wt) {
        w = Wt;
      },
      setClear: function (Wt) {
        le !== Wt && (i.clearStencil(Wt), (le = Wt));
      },
      reset: function () {
        (w = !1),
          (it = null),
          (V = null),
          (Y = null),
          (lt = null),
          (at = null),
          (wt = null),
          (te = null),
          (le = null);
      },
    };
  }
  const s = new e(),
    a = new n(),
    o = new r(),
    l = new WeakMap(),
    c = new WeakMap();
  let u = {},
    d = {},
    f = new WeakMap(),
    m = [],
    v = null,
    M = !1,
    p = null,
    h = null,
    b = null,
    T = null,
    E = null,
    O = null,
    C = null,
    A = new qt(0, 0, 0),
    D = 0,
    S = !1,
    x = null,
    R = null,
    G = null,
    H = null,
    $ = null;
  const K = i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  let X = !1,
    Z = 0;
  const z = i.getParameter(i.VERSION);
  z.indexOf("WebGL") !== -1
    ? ((Z = parseFloat(/^WebGL (\d)/.exec(z)[1])), (X = Z >= 1))
    : z.indexOf("OpenGL ES") !== -1 &&
      ((Z = parseFloat(/^OpenGL ES (\d)/.exec(z)[1])), (X = Z >= 2));
  let et = null,
    ct = {};
  const _t = i.getParameter(i.SCISSOR_BOX),
    Rt = i.getParameter(i.VIEWPORT),
    Vt = new ne().fromArray(_t),
    W = new ne().fromArray(Rt);
  function tt(w, it, V, Y) {
    const lt = new Uint8Array(4),
      at = i.createTexture();
    i.bindTexture(w, at),
      i.texParameteri(w, i.TEXTURE_MIN_FILTER, i.NEAREST),
      i.texParameteri(w, i.TEXTURE_MAG_FILTER, i.NEAREST);
    for (let wt = 0; wt < V; wt++)
      w === i.TEXTURE_3D || w === i.TEXTURE_2D_ARRAY
        ? i.texImage3D(it, 0, i.RGBA, 1, 1, Y, 0, i.RGBA, i.UNSIGNED_BYTE, lt)
        : i.texImage2D(
            it + wt,
            0,
            i.RGBA,
            1,
            1,
            0,
            i.RGBA,
            i.UNSIGNED_BYTE,
            lt
          );
    return at;
  }
  const gt = {};
  (gt[i.TEXTURE_2D] = tt(i.TEXTURE_2D, i.TEXTURE_2D, 1)),
    (gt[i.TEXTURE_CUBE_MAP] = tt(
      i.TEXTURE_CUBE_MAP,
      i.TEXTURE_CUBE_MAP_POSITIVE_X,
      6
    )),
    (gt[i.TEXTURE_2D_ARRAY] = tt(i.TEXTURE_2D_ARRAY, i.TEXTURE_2D_ARRAY, 1, 1)),
    (gt[i.TEXTURE_3D] = tt(i.TEXTURE_3D, i.TEXTURE_3D, 1, 1)),
    s.setClear(0, 0, 0, 1),
    a.setClear(1),
    o.setClear(0),
    rt(i.DEPTH_TEST),
    a.setFunc(Kn),
    Ut(!1),
    Nt(Xs),
    rt(i.CULL_FACE),
    I(cn);
  function rt(w) {
    u[w] !== !0 && (i.enable(w), (u[w] = !0));
  }
  function yt(w) {
    u[w] !== !1 && (i.disable(w), (u[w] = !1));
  }
  function At(w, it) {
    return d[w] !== it
      ? (i.bindFramebuffer(w, it),
        (d[w] = it),
        w === i.DRAW_FRAMEBUFFER && (d[i.FRAMEBUFFER] = it),
        w === i.FRAMEBUFFER && (d[i.DRAW_FRAMEBUFFER] = it),
        !0)
      : !1;
  }
  function Dt(w, it) {
    let V = m,
      Y = !1;
    if (w) {
      (V = f.get(it)), V === void 0 && ((V = []), f.set(it, V));
      const lt = w.textures;
      if (V.length !== lt.length || V[0] !== i.COLOR_ATTACHMENT0) {
        for (let at = 0, wt = lt.length; at < wt; at++)
          V[at] = i.COLOR_ATTACHMENT0 + at;
        (V.length = lt.length), (Y = !0);
      }
    } else V[0] !== i.BACK && ((V[0] = i.BACK), (Y = !0));
    Y && i.drawBuffers(V);
  }
  function Qt(w) {
    return v !== w ? (i.useProgram(w), (v = w), !0) : !1;
  }
  const Ot = {
    [En]: i.FUNC_ADD,
    [Vo]: i.FUNC_SUBTRACT,
    [Go]: i.FUNC_REVERSE_SUBTRACT,
  };
  (Ot[ko] = i.MIN), (Ot[Wo] = i.MAX);
  const ee = {
    [Xo]: i.ZERO,
    [qo]: i.ONE,
    [Yo]: i.SRC_COLOR,
    [Fr]: i.SRC_ALPHA,
    [Qo]: i.SRC_ALPHA_SATURATE,
    [jo]: i.DST_COLOR,
    [Ko]: i.DST_ALPHA,
    [$o]: i.ONE_MINUS_SRC_COLOR,
    [Or]: i.ONE_MINUS_SRC_ALPHA,
    [Jo]: i.ONE_MINUS_DST_COLOR,
    [Zo]: i.ONE_MINUS_DST_ALPHA,
    [tl]: i.CONSTANT_COLOR,
    [el]: i.ONE_MINUS_CONSTANT_COLOR,
    [nl]: i.CONSTANT_ALPHA,
    [il]: i.ONE_MINUS_CONSTANT_ALPHA,
  };
  function I(w, it, V, Y, lt, at, wt, te, le, Wt) {
    if (w === cn) {
      M === !0 && (yt(i.BLEND), (M = !1));
      return;
    }
    if ((M === !1 && (rt(i.BLEND), (M = !0)), w !== Ho)) {
      if (w !== p || Wt !== S) {
        if (
          ((h !== En || E !== En) &&
            (i.blendEquation(i.FUNC_ADD), (h = En), (E = En)),
          Wt)
        )
          switch (w) {
            case qn:
              i.blendFuncSeparate(
                i.ONE,
                i.ONE_MINUS_SRC_ALPHA,
                i.ONE,
                i.ONE_MINUS_SRC_ALPHA
              );
              break;
            case qs:
              i.blendFunc(i.ONE, i.ONE);
              break;
            case Ys:
              i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE);
              break;
            case $s:
              i.blendFuncSeparate(i.ZERO, i.SRC_COLOR, i.ZERO, i.SRC_ALPHA);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", w);
              break;
          }
        else
          switch (w) {
            case qn:
              i.blendFuncSeparate(
                i.SRC_ALPHA,
                i.ONE_MINUS_SRC_ALPHA,
                i.ONE,
                i.ONE_MINUS_SRC_ALPHA
              );
              break;
            case qs:
              i.blendFunc(i.SRC_ALPHA, i.ONE);
              break;
            case Ys:
              i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE);
              break;
            case $s:
              i.blendFunc(i.ZERO, i.SRC_COLOR);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", w);
              break;
          }
        (b = null),
          (T = null),
          (O = null),
          (C = null),
          A.set(0, 0, 0),
          (D = 0),
          (p = w),
          (S = Wt);
      }
      return;
    }
    (lt = lt || it),
      (at = at || V),
      (wt = wt || Y),
      (it !== h || lt !== E) &&
        (i.blendEquationSeparate(Ot[it], Ot[lt]), (h = it), (E = lt)),
      (V !== b || Y !== T || at !== O || wt !== C) &&
        (i.blendFuncSeparate(ee[V], ee[Y], ee[at], ee[wt]),
        (b = V),
        (T = Y),
        (O = at),
        (C = wt)),
      (te.equals(A) === !1 || le !== D) &&
        (i.blendColor(te.r, te.g, te.b, le), A.copy(te), (D = le)),
      (p = w),
      (S = !1);
  }
  function Se(w, it) {
    w.side === Ye ? yt(i.CULL_FACE) : rt(i.CULL_FACE);
    let V = w.side === me;
    it && (V = !V),
      Ut(V),
      w.blending === qn && w.transparent === !1
        ? I(cn)
        : I(
            w.blending,
            w.blendEquation,
            w.blendSrc,
            w.blendDst,
            w.blendEquationAlpha,
            w.blendSrcAlpha,
            w.blendDstAlpha,
            w.blendColor,
            w.blendAlpha,
            w.premultipliedAlpha
          ),
      a.setFunc(w.depthFunc),
      a.setTest(w.depthTest),
      a.setMask(w.depthWrite),
      s.setMask(w.colorWrite);
    const Y = w.stencilWrite;
    o.setTest(Y),
      Y &&
        (o.setMask(w.stencilWriteMask),
        o.setFunc(w.stencilFunc, w.stencilRef, w.stencilFuncMask),
        o.setOp(w.stencilFail, w.stencilZFail, w.stencilZPass)),
      Zt(w.polygonOffset, w.polygonOffsetFactor, w.polygonOffsetUnits),
      w.alphaToCoverage === !0
        ? rt(i.SAMPLE_ALPHA_TO_COVERAGE)
        : yt(i.SAMPLE_ALPHA_TO_COVERAGE);
  }
  function Ut(w) {
    x !== w && (w ? i.frontFace(i.CW) : i.frontFace(i.CCW), (x = w));
  }
  function Nt(w) {
    w !== Oo
      ? (rt(i.CULL_FACE),
        w !== R &&
          (w === Xs
            ? i.cullFace(i.BACK)
            : w === Bo
            ? i.cullFace(i.FRONT)
            : i.cullFace(i.FRONT_AND_BACK)))
      : yt(i.CULL_FACE),
      (R = w);
  }
  function St(w) {
    w !== G && (X && i.lineWidth(w), (G = w));
  }
  function Zt(w, it, V) {
    w
      ? (rt(i.POLYGON_OFFSET_FILL),
        (H !== it || $ !== V) && (i.polygonOffset(it, V), (H = it), ($ = V)))
      : yt(i.POLYGON_OFFSET_FILL);
  }
  function Mt(w) {
    w ? rt(i.SCISSOR_TEST) : yt(i.SCISSOR_TEST);
  }
  function y(w) {
    w === void 0 && (w = i.TEXTURE0 + K - 1),
      et !== w && (i.activeTexture(w), (et = w));
  }
  function _(w, it, V) {
    V === void 0 && (et === null ? (V = i.TEXTURE0 + K - 1) : (V = et));
    let Y = ct[V];
    Y === void 0 && ((Y = { type: void 0, texture: void 0 }), (ct[V] = Y)),
      (Y.type !== w || Y.texture !== it) &&
        (et !== V && (i.activeTexture(V), (et = V)),
        i.bindTexture(w, it || gt[w]),
        (Y.type = w),
        (Y.texture = it));
  }
  function U() {
    const w = ct[et];
    w !== void 0 &&
      w.type !== void 0 &&
      (i.bindTexture(w.type, null), (w.type = void 0), (w.texture = void 0));
  }
  function q() {
    try {
      i.compressedTexImage2D.apply(i, arguments);
    } catch (w) {
      console.error("THREE.WebGLState:", w);
    }
  }
  function j() {
    try {
      i.compressedTexImage3D.apply(i, arguments);
    } catch (w) {
      console.error("THREE.WebGLState:", w);
    }
  }
  function k() {
    try {
      i.texSubImage2D.apply(i, arguments);
    } catch (w) {
      console.error("THREE.WebGLState:", w);
    }
  }
  function vt() {
    try {
      i.texSubImage3D.apply(i, arguments);
    } catch (w) {
      console.error("THREE.WebGLState:", w);
    }
  }
  function st() {
    try {
      i.compressedTexSubImage2D.apply(i, arguments);
    } catch (w) {
      console.error("THREE.WebGLState:", w);
    }
  }
  function ht() {
    try {
      i.compressedTexSubImage3D.apply(i, arguments);
    } catch (w) {
      console.error("THREE.WebGLState:", w);
    }
  }
  function Bt() {
    try {
      i.texStorage2D.apply(i, arguments);
    } catch (w) {
      console.error("THREE.WebGLState:", w);
    }
  }
  function J() {
    try {
      i.texStorage3D.apply(i, arguments);
    } catch (w) {
      console.error("THREE.WebGLState:", w);
    }
  }
  function ut() {
    try {
      i.texImage2D.apply(i, arguments);
    } catch (w) {
      console.error("THREE.WebGLState:", w);
    }
  }
  function Et() {
    try {
      i.texImage3D.apply(i, arguments);
    } catch (w) {
      console.error("THREE.WebGLState:", w);
    }
  }
  function Tt(w) {
    Vt.equals(w) === !1 && (i.scissor(w.x, w.y, w.z, w.w), Vt.copy(w));
  }
  function dt(w) {
    W.equals(w) === !1 && (i.viewport(w.x, w.y, w.z, w.w), W.copy(w));
  }
  function Ft(w, it) {
    let V = c.get(it);
    V === void 0 && ((V = new WeakMap()), c.set(it, V));
    let Y = V.get(w);
    Y === void 0 && ((Y = i.getUniformBlockIndex(it, w.name)), V.set(w, Y));
  }
  function Lt(w, it) {
    const Y = c.get(it).get(w);
    l.get(it) !== Y &&
      (i.uniformBlockBinding(it, Y, w.__bindingPointIndex), l.set(it, Y));
  }
  function $t() {
    i.disable(i.BLEND),
      i.disable(i.CULL_FACE),
      i.disable(i.DEPTH_TEST),
      i.disable(i.POLYGON_OFFSET_FILL),
      i.disable(i.SCISSOR_TEST),
      i.disable(i.STENCIL_TEST),
      i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),
      i.blendEquation(i.FUNC_ADD),
      i.blendFunc(i.ONE, i.ZERO),
      i.blendFuncSeparate(i.ONE, i.ZERO, i.ONE, i.ZERO),
      i.blendColor(0, 0, 0, 0),
      i.colorMask(!0, !0, !0, !0),
      i.clearColor(0, 0, 0, 0),
      i.depthMask(!0),
      i.depthFunc(i.LESS),
      a.setReversed(!1),
      i.clearDepth(1),
      i.stencilMask(4294967295),
      i.stencilFunc(i.ALWAYS, 0, 4294967295),
      i.stencilOp(i.KEEP, i.KEEP, i.KEEP),
      i.clearStencil(0),
      i.cullFace(i.BACK),
      i.frontFace(i.CCW),
      i.polygonOffset(0, 0),
      i.activeTexture(i.TEXTURE0),
      i.bindFramebuffer(i.FRAMEBUFFER, null),
      i.bindFramebuffer(i.DRAW_FRAMEBUFFER, null),
      i.bindFramebuffer(i.READ_FRAMEBUFFER, null),
      i.useProgram(null),
      i.lineWidth(1),
      i.scissor(0, 0, i.canvas.width, i.canvas.height),
      i.viewport(0, 0, i.canvas.width, i.canvas.height),
      (u = {}),
      (et = null),
      (ct = {}),
      (d = {}),
      (f = new WeakMap()),
      (m = []),
      (v = null),
      (M = !1),
      (p = null),
      (h = null),
      (b = null),
      (T = null),
      (E = null),
      (O = null),
      (C = null),
      (A = new qt(0, 0, 0)),
      (D = 0),
      (S = !1),
      (x = null),
      (R = null),
      (G = null),
      (H = null),
      ($ = null),
      Vt.set(0, 0, i.canvas.width, i.canvas.height),
      W.set(0, 0, i.canvas.width, i.canvas.height),
      s.reset(),
      a.reset(),
      o.reset();
  }
  return {
    buffers: { color: s, depth: a, stencil: o },
    enable: rt,
    disable: yt,
    bindFramebuffer: At,
    drawBuffers: Dt,
    useProgram: Qt,
    setBlending: I,
    setMaterial: Se,
    setFlipSided: Ut,
    setCullFace: Nt,
    setLineWidth: St,
    setPolygonOffset: Zt,
    setScissorTest: Mt,
    activeTexture: y,
    bindTexture: _,
    unbindTexture: U,
    compressedTexImage2D: q,
    compressedTexImage3D: j,
    texImage2D: ut,
    texImage3D: Et,
    updateUBOMapping: Ft,
    uniformBlockBinding: Lt,
    texStorage2D: Bt,
    texStorage3D: J,
    texSubImage2D: k,
    texSubImage3D: vt,
    compressedTexSubImage2D: st,
    compressedTexSubImage3D: ht,
    scissor: Tt,
    viewport: dt,
    reset: $t,
  };
}
function Ga(i, t, e, n) {
  const r = Cf(n);
  switch (e) {
    case ja:
      return i * t;
    case Qa:
      return i * t;
    case to:
      return i * t * 2;
    case eo:
      return ((i * t) / r.components) * r.byteLength;
    case Rs:
      return ((i * t) / r.components) * r.byteLength;
    case no:
      return ((i * t * 2) / r.components) * r.byteLength;
    case ws:
      return ((i * t * 2) / r.components) * r.byteLength;
    case Ja:
      return ((i * t * 3) / r.components) * r.byteLength;
    case Ie:
      return ((i * t * 4) / r.components) * r.byteLength;
    case Cs:
      return ((i * t * 4) / r.components) * r.byteLength;
    case Wi:
    case Xi:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 8;
    case qi:
    case Yi:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    case Zr:
    case Jr:
      return (Math.max(i, 16) * Math.max(t, 8)) / 4;
    case Kr:
    case jr:
      return (Math.max(i, 8) * Math.max(t, 8)) / 2;
    case Qr:
    case ts:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 8;
    case es:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    case ns:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    case is:
      return Math.floor((i + 4) / 5) * Math.floor((t + 3) / 4) * 16;
    case rs:
      return Math.floor((i + 4) / 5) * Math.floor((t + 4) / 5) * 16;
    case ss:
      return Math.floor((i + 5) / 6) * Math.floor((t + 4) / 5) * 16;
    case as:
      return Math.floor((i + 5) / 6) * Math.floor((t + 5) / 6) * 16;
    case os:
      return Math.floor((i + 7) / 8) * Math.floor((t + 4) / 5) * 16;
    case ls:
      return Math.floor((i + 7) / 8) * Math.floor((t + 5) / 6) * 16;
    case cs:
      return Math.floor((i + 7) / 8) * Math.floor((t + 7) / 8) * 16;
    case hs:
      return Math.floor((i + 9) / 10) * Math.floor((t + 4) / 5) * 16;
    case us:
      return Math.floor((i + 9) / 10) * Math.floor((t + 5) / 6) * 16;
    case ds:
      return Math.floor((i + 9) / 10) * Math.floor((t + 7) / 8) * 16;
    case fs:
      return Math.floor((i + 9) / 10) * Math.floor((t + 9) / 10) * 16;
    case ps:
      return Math.floor((i + 11) / 12) * Math.floor((t + 9) / 10) * 16;
    case ms:
      return Math.floor((i + 11) / 12) * Math.floor((t + 11) / 12) * 16;
    case $i:
    case _s:
    case gs:
      return Math.ceil(i / 4) * Math.ceil(t / 4) * 16;
    case io:
    case vs:
      return Math.ceil(i / 4) * Math.ceil(t / 4) * 8;
    case xs:
    case Ms:
      return Math.ceil(i / 4) * Math.ceil(t / 4) * 16;
  }
  throw new Error(`Unable to determine texture byte length for ${e} format.`);
}
function Cf(i) {
  switch (i) {
    case je:
    case $a:
      return { byteLength: 1, components: 1 };
    case fi:
    case Ka:
    case pi:
      return { byteLength: 2, components: 1 };
    case bs:
    case As:
      return { byteLength: 2, components: 4 };
    case Rn:
    case Ts:
    case $e:
      return { byteLength: 4, components: 1 };
    case Za:
      return { byteLength: 4, components: 3 };
  }
  throw new Error(`Unknown texture type ${i}.`);
}
function Pf(i, t, e, n, r, s, a) {
  const o = t.has("WEBGL_multisampled_render_to_texture")
      ? t.get("WEBGL_multisampled_render_to_texture")
      : null,
    l =
      typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent),
    c = new Yt(),
    u = new WeakMap();
  let d;
  const f = new WeakMap();
  let m = !1;
  try {
    m =
      typeof OffscreenCanvas < "u" &&
      new OffscreenCanvas(1, 1).getContext("2d") !== null;
  } catch {}
  function v(y, _) {
    return m ? new OffscreenCanvas(y, _) : ji("canvas");
  }
  function M(y, _, U) {
    let q = 1;
    const j = Mt(y);
    if (
      ((j.width > U || j.height > U) && (q = U / Math.max(j.width, j.height)),
      q < 1)
    )
      if (
        (typeof HTMLImageElement < "u" && y instanceof HTMLImageElement) ||
        (typeof HTMLCanvasElement < "u" && y instanceof HTMLCanvasElement) ||
        (typeof ImageBitmap < "u" && y instanceof ImageBitmap) ||
        (typeof VideoFrame < "u" && y instanceof VideoFrame)
      ) {
        const k = Math.floor(q * j.width),
          vt = Math.floor(q * j.height);
        d === void 0 && (d = v(k, vt));
        const st = _ ? v(k, vt) : d;
        return (
          (st.width = k),
          (st.height = vt),
          st.getContext("2d").drawImage(y, 0, 0, k, vt),
          console.warn(
            "THREE.WebGLRenderer: Texture has been resized from (" +
              j.width +
              "x" +
              j.height +
              ") to (" +
              k +
              "x" +
              vt +
              ")."
          ),
          st
        );
      } else
        return (
          "data" in y &&
            console.warn(
              "THREE.WebGLRenderer: Image in DataTexture is too big (" +
                j.width +
                "x" +
                j.height +
                ")."
            ),
          y
        );
    return y;
  }
  function p(y) {
    return y.generateMipmaps;
  }
  function h(y) {
    i.generateMipmap(y);
  }
  function b(y) {
    return y.isWebGLCubeRenderTarget
      ? i.TEXTURE_CUBE_MAP
      : y.isWebGL3DRenderTarget
      ? i.TEXTURE_3D
      : y.isWebGLArrayRenderTarget || y.isCompressedArrayTexture
      ? i.TEXTURE_2D_ARRAY
      : i.TEXTURE_2D;
  }
  function T(y, _, U, q, j = !1) {
    if (y !== null) {
      if (i[y] !== void 0) return i[y];
      console.warn(
        "THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '" +
          y +
          "'"
      );
    }
    let k = _;
    if (
      (_ === i.RED &&
        (U === i.FLOAT && (k = i.R32F),
        U === i.HALF_FLOAT && (k = i.R16F),
        U === i.UNSIGNED_BYTE && (k = i.R8)),
      _ === i.RED_INTEGER &&
        (U === i.UNSIGNED_BYTE && (k = i.R8UI),
        U === i.UNSIGNED_SHORT && (k = i.R16UI),
        U === i.UNSIGNED_INT && (k = i.R32UI),
        U === i.BYTE && (k = i.R8I),
        U === i.SHORT && (k = i.R16I),
        U === i.INT && (k = i.R32I)),
      _ === i.RG &&
        (U === i.FLOAT && (k = i.RG32F),
        U === i.HALF_FLOAT && (k = i.RG16F),
        U === i.UNSIGNED_BYTE && (k = i.RG8)),
      _ === i.RG_INTEGER &&
        (U === i.UNSIGNED_BYTE && (k = i.RG8UI),
        U === i.UNSIGNED_SHORT && (k = i.RG16UI),
        U === i.UNSIGNED_INT && (k = i.RG32UI),
        U === i.BYTE && (k = i.RG8I),
        U === i.SHORT && (k = i.RG16I),
        U === i.INT && (k = i.RG32I)),
      _ === i.RGB_INTEGER &&
        (U === i.UNSIGNED_BYTE && (k = i.RGB8UI),
        U === i.UNSIGNED_SHORT && (k = i.RGB16UI),
        U === i.UNSIGNED_INT && (k = i.RGB32UI),
        U === i.BYTE && (k = i.RGB8I),
        U === i.SHORT && (k = i.RGB16I),
        U === i.INT && (k = i.RGB32I)),
      _ === i.RGBA_INTEGER &&
        (U === i.UNSIGNED_BYTE && (k = i.RGBA8UI),
        U === i.UNSIGNED_SHORT && (k = i.RGBA16UI),
        U === i.UNSIGNED_INT && (k = i.RGBA32UI),
        U === i.BYTE && (k = i.RGBA8I),
        U === i.SHORT && (k = i.RGBA16I),
        U === i.INT && (k = i.RGBA32I)),
      _ === i.RGB && U === i.UNSIGNED_INT_5_9_9_9_REV && (k = i.RGB9_E5),
      _ === i.RGBA)
    ) {
      const vt = j ? tr : zt.getTransfer(q);
      U === i.FLOAT && (k = i.RGBA32F),
        U === i.HALF_FLOAT && (k = i.RGBA16F),
        U === i.UNSIGNED_BYTE && (k = vt === Xt ? i.SRGB8_ALPHA8 : i.RGBA8),
        U === i.UNSIGNED_SHORT_4_4_4_4 && (k = i.RGBA4),
        U === i.UNSIGNED_SHORT_5_5_5_1 && (k = i.RGB5_A1);
    }
    return (
      (k === i.R16F ||
        k === i.R32F ||
        k === i.RG16F ||
        k === i.RG32F ||
        k === i.RGBA16F ||
        k === i.RGBA32F) &&
        t.get("EXT_color_buffer_float"),
      k
    );
  }
  function E(y, _) {
    let U;
    return (
      y
        ? _ === null || _ === Rn || _ === Jn
          ? (U = i.DEPTH24_STENCIL8)
          : _ === $e
          ? (U = i.DEPTH32F_STENCIL8)
          : _ === fi &&
            ((U = i.DEPTH24_STENCIL8),
            console.warn(
              "DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment."
            ))
        : _ === null || _ === Rn || _ === Jn
        ? (U = i.DEPTH_COMPONENT24)
        : _ === $e
        ? (U = i.DEPTH_COMPONENT32F)
        : _ === fi && (U = i.DEPTH_COMPONENT16),
      U
    );
  }
  function O(y, _) {
    return p(y) === !0 ||
      (y.isFramebufferTexture && y.minFilter !== De && y.minFilter !== Fe)
      ? Math.log2(Math.max(_.width, _.height)) + 1
      : y.mipmaps !== void 0 && y.mipmaps.length > 0
      ? y.mipmaps.length
      : y.isCompressedTexture && Array.isArray(y.image)
      ? _.mipmaps.length
      : 1;
  }
  function C(y) {
    const _ = y.target;
    _.removeEventListener("dispose", C), D(_), _.isVideoTexture && u.delete(_);
  }
  function A(y) {
    const _ = y.target;
    _.removeEventListener("dispose", A), x(_);
  }
  function D(y) {
    const _ = n.get(y);
    if (_.__webglInit === void 0) return;
    const U = y.source,
      q = f.get(U);
    if (q) {
      const j = q[_.__cacheKey];
      j.usedTimes--,
        j.usedTimes === 0 && S(y),
        Object.keys(q).length === 0 && f.delete(U);
    }
    n.remove(y);
  }
  function S(y) {
    const _ = n.get(y);
    i.deleteTexture(_.__webglTexture);
    const U = y.source,
      q = f.get(U);
    delete q[_.__cacheKey], a.memory.textures--;
  }
  function x(y) {
    const _ = n.get(y);
    if (
      (y.depthTexture && (y.depthTexture.dispose(), n.remove(y.depthTexture)),
      y.isWebGLCubeRenderTarget)
    )
      for (let q = 0; q < 6; q++) {
        if (Array.isArray(_.__webglFramebuffer[q]))
          for (let j = 0; j < _.__webglFramebuffer[q].length; j++)
            i.deleteFramebuffer(_.__webglFramebuffer[q][j]);
        else i.deleteFramebuffer(_.__webglFramebuffer[q]);
        _.__webglDepthbuffer && i.deleteRenderbuffer(_.__webglDepthbuffer[q]);
      }
    else {
      if (Array.isArray(_.__webglFramebuffer))
        for (let q = 0; q < _.__webglFramebuffer.length; q++)
          i.deleteFramebuffer(_.__webglFramebuffer[q]);
      else i.deleteFramebuffer(_.__webglFramebuffer);
      if (
        (_.__webglDepthbuffer && i.deleteRenderbuffer(_.__webglDepthbuffer),
        _.__webglMultisampledFramebuffer &&
          i.deleteFramebuffer(_.__webglMultisampledFramebuffer),
        _.__webglColorRenderbuffer)
      )
        for (let q = 0; q < _.__webglColorRenderbuffer.length; q++)
          _.__webglColorRenderbuffer[q] &&
            i.deleteRenderbuffer(_.__webglColorRenderbuffer[q]);
      _.__webglDepthRenderbuffer &&
        i.deleteRenderbuffer(_.__webglDepthRenderbuffer);
    }
    const U = y.textures;
    for (let q = 0, j = U.length; q < j; q++) {
      const k = n.get(U[q]);
      k.__webglTexture &&
        (i.deleteTexture(k.__webglTexture), a.memory.textures--),
        n.remove(U[q]);
    }
    n.remove(y);
  }
  let R = 0;
  function G() {
    R = 0;
  }
  function H() {
    const y = R;
    return (
      y >= r.maxTextures &&
        console.warn(
          "THREE.WebGLTextures: Trying to use " +
            y +
            " texture units while this GPU supports only " +
            r.maxTextures
        ),
      (R += 1),
      y
    );
  }
  function $(y) {
    const _ = [];
    return (
      _.push(y.wrapS),
      _.push(y.wrapT),
      _.push(y.wrapR || 0),
      _.push(y.magFilter),
      _.push(y.minFilter),
      _.push(y.anisotropy),
      _.push(y.internalFormat),
      _.push(y.format),
      _.push(y.type),
      _.push(y.generateMipmaps),
      _.push(y.premultiplyAlpha),
      _.push(y.flipY),
      _.push(y.unpackAlignment),
      _.push(y.colorSpace),
      _.join()
    );
  }
  function K(y, _) {
    const U = n.get(y);
    if (
      (y.isVideoTexture && St(y),
      y.isRenderTargetTexture === !1 &&
        y.version > 0 &&
        U.__version !== y.version)
    ) {
      const q = y.image;
      if (q === null)
        console.warn(
          "THREE.WebGLRenderer: Texture marked for update but no image data found."
        );
      else if (q.complete === !1)
        console.warn(
          "THREE.WebGLRenderer: Texture marked for update but image is incomplete"
        );
      else {
        W(U, y, _);
        return;
      }
    }
    e.bindTexture(i.TEXTURE_2D, U.__webglTexture, i.TEXTURE0 + _);
  }
  function X(y, _) {
    const U = n.get(y);
    if (y.version > 0 && U.__version !== y.version) {
      W(U, y, _);
      return;
    }
    e.bindTexture(i.TEXTURE_2D_ARRAY, U.__webglTexture, i.TEXTURE0 + _);
  }
  function Z(y, _) {
    const U = n.get(y);
    if (y.version > 0 && U.__version !== y.version) {
      W(U, y, _);
      return;
    }
    e.bindTexture(i.TEXTURE_3D, U.__webglTexture, i.TEXTURE0 + _);
  }
  function z(y, _) {
    const U = n.get(y);
    if (y.version > 0 && U.__version !== y.version) {
      tt(U, y, _);
      return;
    }
    e.bindTexture(i.TEXTURE_CUBE_MAP, U.__webglTexture, i.TEXTURE0 + _);
  }
  const et = { [Yr]: i.REPEAT, [Tn]: i.CLAMP_TO_EDGE, [$r]: i.MIRRORED_REPEAT },
    ct = {
      [De]: i.NEAREST,
      [fl]: i.NEAREST_MIPMAP_NEAREST,
      [Ei]: i.NEAREST_MIPMAP_LINEAR,
      [Fe]: i.LINEAR,
      [sr]: i.LINEAR_MIPMAP_NEAREST,
      [bn]: i.LINEAR_MIPMAP_LINEAR,
    },
    _t = {
      [vl]: i.NEVER,
      [Tl]: i.ALWAYS,
      [xl]: i.LESS,
      [ro]: i.LEQUAL,
      [Ml]: i.EQUAL,
      [yl]: i.GEQUAL,
      [Sl]: i.GREATER,
      [El]: i.NOTEQUAL,
    };
  function Rt(y, _) {
    if (
      (_.type === $e &&
        t.has("OES_texture_float_linear") === !1 &&
        (_.magFilter === Fe ||
          _.magFilter === sr ||
          _.magFilter === Ei ||
          _.magFilter === bn ||
          _.minFilter === Fe ||
          _.minFilter === sr ||
          _.minFilter === Ei ||
          _.minFilter === bn) &&
        console.warn(
          "THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."
        ),
      i.texParameteri(y, i.TEXTURE_WRAP_S, et[_.wrapS]),
      i.texParameteri(y, i.TEXTURE_WRAP_T, et[_.wrapT]),
      (y === i.TEXTURE_3D || y === i.TEXTURE_2D_ARRAY) &&
        i.texParameteri(y, i.TEXTURE_WRAP_R, et[_.wrapR]),
      i.texParameteri(y, i.TEXTURE_MAG_FILTER, ct[_.magFilter]),
      i.texParameteri(y, i.TEXTURE_MIN_FILTER, ct[_.minFilter]),
      _.compareFunction &&
        (i.texParameteri(y, i.TEXTURE_COMPARE_MODE, i.COMPARE_REF_TO_TEXTURE),
        i.texParameteri(y, i.TEXTURE_COMPARE_FUNC, _t[_.compareFunction])),
      t.has("EXT_texture_filter_anisotropic") === !0)
    ) {
      if (
        _.magFilter === De ||
        (_.minFilter !== Ei && _.minFilter !== bn) ||
        (_.type === $e && t.has("OES_texture_float_linear") === !1)
      )
        return;
      if (_.anisotropy > 1 || n.get(_).__currentAnisotropy) {
        const U = t.get("EXT_texture_filter_anisotropic");
        i.texParameterf(
          y,
          U.TEXTURE_MAX_ANISOTROPY_EXT,
          Math.min(_.anisotropy, r.getMaxAnisotropy())
        ),
          (n.get(_).__currentAnisotropy = _.anisotropy);
      }
    }
  }
  function Vt(y, _) {
    let U = !1;
    y.__webglInit === void 0 &&
      ((y.__webglInit = !0), _.addEventListener("dispose", C));
    const q = _.source;
    let j = f.get(q);
    j === void 0 && ((j = {}), f.set(q, j));
    const k = $(_);
    if (k !== y.__cacheKey) {
      j[k] === void 0 &&
        ((j[k] = { texture: i.createTexture(), usedTimes: 0 }),
        a.memory.textures++,
        (U = !0)),
        j[k].usedTimes++;
      const vt = j[y.__cacheKey];
      vt !== void 0 &&
        (j[y.__cacheKey].usedTimes--, vt.usedTimes === 0 && S(_)),
        (y.__cacheKey = k),
        (y.__webglTexture = j[k].texture);
    }
    return U;
  }
  function W(y, _, U) {
    let q = i.TEXTURE_2D;
    (_.isDataArrayTexture || _.isCompressedArrayTexture) &&
      (q = i.TEXTURE_2D_ARRAY),
      _.isData3DTexture && (q = i.TEXTURE_3D);
    const j = Vt(y, _),
      k = _.source;
    e.bindTexture(q, y.__webglTexture, i.TEXTURE0 + U);
    const vt = n.get(k);
    if (k.version !== vt.__version || j === !0) {
      e.activeTexture(i.TEXTURE0 + U);
      const st = zt.getPrimaries(zt.workingColorSpace),
        ht = _.colorSpace === ln ? null : zt.getPrimaries(_.colorSpace),
        Bt =
          _.colorSpace === ln || st === ht ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
      i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, _.flipY),
        i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, _.premultiplyAlpha),
        i.pixelStorei(i.UNPACK_ALIGNMENT, _.unpackAlignment),
        i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, Bt);
      let J = M(_.image, !1, r.maxTextureSize);
      J = Zt(_, J);
      const ut = s.convert(_.format, _.colorSpace),
        Et = s.convert(_.type);
      let Tt = T(_.internalFormat, ut, Et, _.colorSpace, _.isVideoTexture);
      Rt(q, _);
      let dt;
      const Ft = _.mipmaps,
        Lt = _.isVideoTexture !== !0,
        $t = vt.__version === void 0 || j === !0,
        w = k.dataReady,
        it = O(_, J);
      if (_.isDepthTexture)
        (Tt = E(_.format === Qn, _.type)),
          $t &&
            (Lt
              ? e.texStorage2D(i.TEXTURE_2D, 1, Tt, J.width, J.height)
              : e.texImage2D(
                  i.TEXTURE_2D,
                  0,
                  Tt,
                  J.width,
                  J.height,
                  0,
                  ut,
                  Et,
                  null
                ));
      else if (_.isDataTexture)
        if (Ft.length > 0) {
          Lt &&
            $t &&
            e.texStorage2D(i.TEXTURE_2D, it, Tt, Ft[0].width, Ft[0].height);
          for (let V = 0, Y = Ft.length; V < Y; V++)
            (dt = Ft[V]),
              Lt
                ? w &&
                  e.texSubImage2D(
                    i.TEXTURE_2D,
                    V,
                    0,
                    0,
                    dt.width,
                    dt.height,
                    ut,
                    Et,
                    dt.data
                  )
                : e.texImage2D(
                    i.TEXTURE_2D,
                    V,
                    Tt,
                    dt.width,
                    dt.height,
                    0,
                    ut,
                    Et,
                    dt.data
                  );
          _.generateMipmaps = !1;
        } else
          Lt
            ? ($t && e.texStorage2D(i.TEXTURE_2D, it, Tt, J.width, J.height),
              w &&
                e.texSubImage2D(
                  i.TEXTURE_2D,
                  0,
                  0,
                  0,
                  J.width,
                  J.height,
                  ut,
                  Et,
                  J.data
                ))
            : e.texImage2D(
                i.TEXTURE_2D,
                0,
                Tt,
                J.width,
                J.height,
                0,
                ut,
                Et,
                J.data
              );
      else if (_.isCompressedTexture)
        if (_.isCompressedArrayTexture) {
          Lt &&
            $t &&
            e.texStorage3D(
              i.TEXTURE_2D_ARRAY,
              it,
              Tt,
              Ft[0].width,
              Ft[0].height,
              J.depth
            );
          for (let V = 0, Y = Ft.length; V < Y; V++)
            if (((dt = Ft[V]), _.format !== Ie))
              if (ut !== null)
                if (Lt) {
                  if (w)
                    if (_.layerUpdates.size > 0) {
                      const lt = Ga(dt.width, dt.height, _.format, _.type);
                      for (const at of _.layerUpdates) {
                        const wt = dt.data.subarray(
                          (at * lt) / dt.data.BYTES_PER_ELEMENT,
                          ((at + 1) * lt) / dt.data.BYTES_PER_ELEMENT
                        );
                        e.compressedTexSubImage3D(
                          i.TEXTURE_2D_ARRAY,
                          V,
                          0,
                          0,
                          at,
                          dt.width,
                          dt.height,
                          1,
                          ut,
                          wt
                        );
                      }
                      _.clearLayerUpdates();
                    } else
                      e.compressedTexSubImage3D(
                        i.TEXTURE_2D_ARRAY,
                        V,
                        0,
                        0,
                        0,
                        dt.width,
                        dt.height,
                        J.depth,
                        ut,
                        dt.data
                      );
                } else
                  e.compressedTexImage3D(
                    i.TEXTURE_2D_ARRAY,
                    V,
                    Tt,
                    dt.width,
                    dt.height,
                    J.depth,
                    0,
                    dt.data,
                    0,
                    0
                  );
              else
                console.warn(
                  "THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"
                );
            else
              Lt
                ? w &&
                  e.texSubImage3D(
                    i.TEXTURE_2D_ARRAY,
                    V,
                    0,
                    0,
                    0,
                    dt.width,
                    dt.height,
                    J.depth,
                    ut,
                    Et,
                    dt.data
                  )
                : e.texImage3D(
                    i.TEXTURE_2D_ARRAY,
                    V,
                    Tt,
                    dt.width,
                    dt.height,
                    J.depth,
                    0,
                    ut,
                    Et,
                    dt.data
                  );
        } else {
          Lt &&
            $t &&
            e.texStorage2D(i.TEXTURE_2D, it, Tt, Ft[0].width, Ft[0].height);
          for (let V = 0, Y = Ft.length; V < Y; V++)
            (dt = Ft[V]),
              _.format !== Ie
                ? ut !== null
                  ? Lt
                    ? w &&
                      e.compressedTexSubImage2D(
                        i.TEXTURE_2D,
                        V,
                        0,
                        0,
                        dt.width,
                        dt.height,
                        ut,
                        dt.data
                      )
                    : e.compressedTexImage2D(
                        i.TEXTURE_2D,
                        V,
                        Tt,
                        dt.width,
                        dt.height,
                        0,
                        dt.data
                      )
                  : console.warn(
                      "THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"
                    )
                : Lt
                ? w &&
                  e.texSubImage2D(
                    i.TEXTURE_2D,
                    V,
                    0,
                    0,
                    dt.width,
                    dt.height,
                    ut,
                    Et,
                    dt.data
                  )
                : e.texImage2D(
                    i.TEXTURE_2D,
                    V,
                    Tt,
                    dt.width,
                    dt.height,
                    0,
                    ut,
                    Et,
                    dt.data
                  );
        }
      else if (_.isDataArrayTexture)
        if (Lt) {
          if (
            ($t &&
              e.texStorage3D(
                i.TEXTURE_2D_ARRAY,
                it,
                Tt,
                J.width,
                J.height,
                J.depth
              ),
            w)
          )
            if (_.layerUpdates.size > 0) {
              const V = Ga(J.width, J.height, _.format, _.type);
              for (const Y of _.layerUpdates) {
                const lt = J.data.subarray(
                  (Y * V) / J.data.BYTES_PER_ELEMENT,
                  ((Y + 1) * V) / J.data.BYTES_PER_ELEMENT
                );
                e.texSubImage3D(
                  i.TEXTURE_2D_ARRAY,
                  0,
                  0,
                  0,
                  Y,
                  J.width,
                  J.height,
                  1,
                  ut,
                  Et,
                  lt
                );
              }
              _.clearLayerUpdates();
            } else
              e.texSubImage3D(
                i.TEXTURE_2D_ARRAY,
                0,
                0,
                0,
                0,
                J.width,
                J.height,
                J.depth,
                ut,
                Et,
                J.data
              );
        } else
          e.texImage3D(
            i.TEXTURE_2D_ARRAY,
            0,
            Tt,
            J.width,
            J.height,
            J.depth,
            0,
            ut,
            Et,
            J.data
          );
      else if (_.isData3DTexture)
        Lt
          ? ($t &&
              e.texStorage3D(i.TEXTURE_3D, it, Tt, J.width, J.height, J.depth),
            w &&
              e.texSubImage3D(
                i.TEXTURE_3D,
                0,
                0,
                0,
                0,
                J.width,
                J.height,
                J.depth,
                ut,
                Et,
                J.data
              ))
          : e.texImage3D(
              i.TEXTURE_3D,
              0,
              Tt,
              J.width,
              J.height,
              J.depth,
              0,
              ut,
              Et,
              J.data
            );
      else if (_.isFramebufferTexture) {
        if ($t)
          if (Lt) e.texStorage2D(i.TEXTURE_2D, it, Tt, J.width, J.height);
          else {
            let V = J.width,
              Y = J.height;
            for (let lt = 0; lt < it; lt++)
              e.texImage2D(i.TEXTURE_2D, lt, Tt, V, Y, 0, ut, Et, null),
                (V >>= 1),
                (Y >>= 1);
          }
      } else if (Ft.length > 0) {
        if (Lt && $t) {
          const V = Mt(Ft[0]);
          e.texStorage2D(i.TEXTURE_2D, it, Tt, V.width, V.height);
        }
        for (let V = 0, Y = Ft.length; V < Y; V++)
          (dt = Ft[V]),
            Lt
              ? w && e.texSubImage2D(i.TEXTURE_2D, V, 0, 0, ut, Et, dt)
              : e.texImage2D(i.TEXTURE_2D, V, Tt, ut, Et, dt);
        _.generateMipmaps = !1;
      } else if (Lt) {
        if ($t) {
          const V = Mt(J);
          e.texStorage2D(i.TEXTURE_2D, it, Tt, V.width, V.height);
        }
        w && e.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, ut, Et, J);
      } else e.texImage2D(i.TEXTURE_2D, 0, Tt, ut, Et, J);
      p(_) && h(q), (vt.__version = k.version), _.onUpdate && _.onUpdate(_);
    }
    y.__version = _.version;
  }
  function tt(y, _, U) {
    if (_.image.length !== 6) return;
    const q = Vt(y, _),
      j = _.source;
    e.bindTexture(i.TEXTURE_CUBE_MAP, y.__webglTexture, i.TEXTURE0 + U);
    const k = n.get(j);
    if (j.version !== k.__version || q === !0) {
      e.activeTexture(i.TEXTURE0 + U);
      const vt = zt.getPrimaries(zt.workingColorSpace),
        st = _.colorSpace === ln ? null : zt.getPrimaries(_.colorSpace),
        ht =
          _.colorSpace === ln || vt === st ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
      i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, _.flipY),
        i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, _.premultiplyAlpha),
        i.pixelStorei(i.UNPACK_ALIGNMENT, _.unpackAlignment),
        i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, ht);
      const Bt = _.isCompressedTexture || _.image[0].isCompressedTexture,
        J = _.image[0] && _.image[0].isDataTexture,
        ut = [];
      for (let Y = 0; Y < 6; Y++)
        !Bt && !J
          ? (ut[Y] = M(_.image[Y], !0, r.maxCubemapSize))
          : (ut[Y] = J ? _.image[Y].image : _.image[Y]),
          (ut[Y] = Zt(_, ut[Y]));
      const Et = ut[0],
        Tt = s.convert(_.format, _.colorSpace),
        dt = s.convert(_.type),
        Ft = T(_.internalFormat, Tt, dt, _.colorSpace),
        Lt = _.isVideoTexture !== !0,
        $t = k.__version === void 0 || q === !0,
        w = j.dataReady;
      let it = O(_, Et);
      Rt(i.TEXTURE_CUBE_MAP, _);
      let V;
      if (Bt) {
        Lt &&
          $t &&
          e.texStorage2D(i.TEXTURE_CUBE_MAP, it, Ft, Et.width, Et.height);
        for (let Y = 0; Y < 6; Y++) {
          V = ut[Y].mipmaps;
          for (let lt = 0; lt < V.length; lt++) {
            const at = V[lt];
            _.format !== Ie
              ? Tt !== null
                ? Lt
                  ? w &&
                    e.compressedTexSubImage2D(
                      i.TEXTURE_CUBE_MAP_POSITIVE_X + Y,
                      lt,
                      0,
                      0,
                      at.width,
                      at.height,
                      Tt,
                      at.data
                    )
                  : e.compressedTexImage2D(
                      i.TEXTURE_CUBE_MAP_POSITIVE_X + Y,
                      lt,
                      Ft,
                      at.width,
                      at.height,
                      0,
                      at.data
                    )
                : console.warn(
                    "THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"
                  )
              : Lt
              ? w &&
                e.texSubImage2D(
                  i.TEXTURE_CUBE_MAP_POSITIVE_X + Y,
                  lt,
                  0,
                  0,
                  at.width,
                  at.height,
                  Tt,
                  dt,
                  at.data
                )
              : e.texImage2D(
                  i.TEXTURE_CUBE_MAP_POSITIVE_X + Y,
                  lt,
                  Ft,
                  at.width,
                  at.height,
                  0,
                  Tt,
                  dt,
                  at.data
                );
          }
        }
      } else {
        if (((V = _.mipmaps), Lt && $t)) {
          V.length > 0 && it++;
          const Y = Mt(ut[0]);
          e.texStorage2D(i.TEXTURE_CUBE_MAP, it, Ft, Y.width, Y.height);
        }
        for (let Y = 0; Y < 6; Y++)
          if (J) {
            Lt
              ? w &&
                e.texSubImage2D(
                  i.TEXTURE_CUBE_MAP_POSITIVE_X + Y,
                  0,
                  0,
                  0,
                  ut[Y].width,
                  ut[Y].height,
                  Tt,
                  dt,
                  ut[Y].data
                )
              : e.texImage2D(
                  i.TEXTURE_CUBE_MAP_POSITIVE_X + Y,
                  0,
                  Ft,
                  ut[Y].width,
                  ut[Y].height,
                  0,
                  Tt,
                  dt,
                  ut[Y].data
                );
            for (let lt = 0; lt < V.length; lt++) {
              const wt = V[lt].image[Y].image;
              Lt
                ? w &&
                  e.texSubImage2D(
                    i.TEXTURE_CUBE_MAP_POSITIVE_X + Y,
                    lt + 1,
                    0,
                    0,
                    wt.width,
                    wt.height,
                    Tt,
                    dt,
                    wt.data
                  )
                : e.texImage2D(
                    i.TEXTURE_CUBE_MAP_POSITIVE_X + Y,
                    lt + 1,
                    Ft,
                    wt.width,
                    wt.height,
                    0,
                    Tt,
                    dt,
                    wt.data
                  );
            }
          } else {
            Lt
              ? w &&
                e.texSubImage2D(
                  i.TEXTURE_CUBE_MAP_POSITIVE_X + Y,
                  0,
                  0,
                  0,
                  Tt,
                  dt,
                  ut[Y]
                )
              : e.texImage2D(
                  i.TEXTURE_CUBE_MAP_POSITIVE_X + Y,
                  0,
                  Ft,
                  Tt,
                  dt,
                  ut[Y]
                );
            for (let lt = 0; lt < V.length; lt++) {
              const at = V[lt];
              Lt
                ? w &&
                  e.texSubImage2D(
                    i.TEXTURE_CUBE_MAP_POSITIVE_X + Y,
                    lt + 1,
                    0,
                    0,
                    Tt,
                    dt,
                    at.image[Y]
                  )
                : e.texImage2D(
                    i.TEXTURE_CUBE_MAP_POSITIVE_X + Y,
                    lt + 1,
                    Ft,
                    Tt,
                    dt,
                    at.image[Y]
                  );
            }
          }
      }
      p(_) && h(i.TEXTURE_CUBE_MAP),
        (k.__version = j.version),
        _.onUpdate && _.onUpdate(_);
    }
    y.__version = _.version;
  }
  function gt(y, _, U, q, j, k) {
    const vt = s.convert(U.format, U.colorSpace),
      st = s.convert(U.type),
      ht = T(U.internalFormat, vt, st, U.colorSpace),
      Bt = n.get(_),
      J = n.get(U);
    if (((J.__renderTarget = _), !Bt.__hasExternalTextures)) {
      const ut = Math.max(1, _.width >> k),
        Et = Math.max(1, _.height >> k);
      j === i.TEXTURE_3D || j === i.TEXTURE_2D_ARRAY
        ? e.texImage3D(j, k, ht, ut, Et, _.depth, 0, vt, st, null)
        : e.texImage2D(j, k, ht, ut, Et, 0, vt, st, null);
    }
    e.bindFramebuffer(i.FRAMEBUFFER, y),
      Nt(_)
        ? o.framebufferTexture2DMultisampleEXT(
            i.FRAMEBUFFER,
            q,
            j,
            J.__webglTexture,
            0,
            Ut(_)
          )
        : (j === i.TEXTURE_2D ||
            (j >= i.TEXTURE_CUBE_MAP_POSITIVE_X &&
              j <= i.TEXTURE_CUBE_MAP_NEGATIVE_Z)) &&
          i.framebufferTexture2D(i.FRAMEBUFFER, q, j, J.__webglTexture, k),
      e.bindFramebuffer(i.FRAMEBUFFER, null);
  }
  function rt(y, _, U) {
    if ((i.bindRenderbuffer(i.RENDERBUFFER, y), _.depthBuffer)) {
      const q = _.depthTexture,
        j = q && q.isDepthTexture ? q.type : null,
        k = E(_.stencilBuffer, j),
        vt = _.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT,
        st = Ut(_);
      Nt(_)
        ? o.renderbufferStorageMultisampleEXT(
            i.RENDERBUFFER,
            st,
            k,
            _.width,
            _.height
          )
        : U
        ? i.renderbufferStorageMultisample(
            i.RENDERBUFFER,
            st,
            k,
            _.width,
            _.height
          )
        : i.renderbufferStorage(i.RENDERBUFFER, k, _.width, _.height),
        i.framebufferRenderbuffer(i.FRAMEBUFFER, vt, i.RENDERBUFFER, y);
    } else {
      const q = _.textures;
      for (let j = 0; j < q.length; j++) {
        const k = q[j],
          vt = s.convert(k.format, k.colorSpace),
          st = s.convert(k.type),
          ht = T(k.internalFormat, vt, st, k.colorSpace),
          Bt = Ut(_);
        U && Nt(_) === !1
          ? i.renderbufferStorageMultisample(
              i.RENDERBUFFER,
              Bt,
              ht,
              _.width,
              _.height
            )
          : Nt(_)
          ? o.renderbufferStorageMultisampleEXT(
              i.RENDERBUFFER,
              Bt,
              ht,
              _.width,
              _.height
            )
          : i.renderbufferStorage(i.RENDERBUFFER, ht, _.width, _.height);
      }
    }
    i.bindRenderbuffer(i.RENDERBUFFER, null);
  }
  function yt(y, _) {
    if (_ && _.isWebGLCubeRenderTarget)
      throw new Error(
        "Depth Texture with cube render targets is not supported"
      );
    if (
      (e.bindFramebuffer(i.FRAMEBUFFER, y),
      !(_.depthTexture && _.depthTexture.isDepthTexture))
    )
      throw new Error(
        "renderTarget.depthTexture must be an instance of THREE.DepthTexture"
      );
    const q = n.get(_.depthTexture);
    (q.__renderTarget = _),
      (!q.__webglTexture ||
        _.depthTexture.image.width !== _.width ||
        _.depthTexture.image.height !== _.height) &&
        ((_.depthTexture.image.width = _.width),
        (_.depthTexture.image.height = _.height),
        (_.depthTexture.needsUpdate = !0)),
      K(_.depthTexture, 0);
    const j = q.__webglTexture,
      k = Ut(_);
    if (_.depthTexture.format === Yn)
      Nt(_)
        ? o.framebufferTexture2DMultisampleEXT(
            i.FRAMEBUFFER,
            i.DEPTH_ATTACHMENT,
            i.TEXTURE_2D,
            j,
            0,
            k
          )
        : i.framebufferTexture2D(
            i.FRAMEBUFFER,
            i.DEPTH_ATTACHMENT,
            i.TEXTURE_2D,
            j,
            0
          );
    else if (_.depthTexture.format === Qn)
      Nt(_)
        ? o.framebufferTexture2DMultisampleEXT(
            i.FRAMEBUFFER,
            i.DEPTH_STENCIL_ATTACHMENT,
            i.TEXTURE_2D,
            j,
            0,
            k
          )
        : i.framebufferTexture2D(
            i.FRAMEBUFFER,
            i.DEPTH_STENCIL_ATTACHMENT,
            i.TEXTURE_2D,
            j,
            0
          );
    else throw new Error("Unknown depthTexture format");
  }
  function At(y) {
    const _ = n.get(y),
      U = y.isWebGLCubeRenderTarget === !0;
    if (_.__boundDepthTexture !== y.depthTexture) {
      const q = y.depthTexture;
      if ((_.__depthDisposeCallback && _.__depthDisposeCallback(), q)) {
        const j = () => {
          delete _.__boundDepthTexture,
            delete _.__depthDisposeCallback,
            q.removeEventListener("dispose", j);
        };
        q.addEventListener("dispose", j), (_.__depthDisposeCallback = j);
      }
      _.__boundDepthTexture = q;
    }
    if (y.depthTexture && !_.__autoAllocateDepthBuffer) {
      if (U)
        throw new Error(
          "target.depthTexture not supported in Cube render targets"
        );
      yt(_.__webglFramebuffer, y);
    } else if (U) {
      _.__webglDepthbuffer = [];
      for (let q = 0; q < 6; q++)
        if (
          (e.bindFramebuffer(i.FRAMEBUFFER, _.__webglFramebuffer[q]),
          _.__webglDepthbuffer[q] === void 0)
        )
          (_.__webglDepthbuffer[q] = i.createRenderbuffer()),
            rt(_.__webglDepthbuffer[q], y, !1);
        else {
          const j = y.stencilBuffer
              ? i.DEPTH_STENCIL_ATTACHMENT
              : i.DEPTH_ATTACHMENT,
            k = _.__webglDepthbuffer[q];
          i.bindRenderbuffer(i.RENDERBUFFER, k),
            i.framebufferRenderbuffer(i.FRAMEBUFFER, j, i.RENDERBUFFER, k);
        }
    } else if (
      (e.bindFramebuffer(i.FRAMEBUFFER, _.__webglFramebuffer),
      _.__webglDepthbuffer === void 0)
    )
      (_.__webglDepthbuffer = i.createRenderbuffer()),
        rt(_.__webglDepthbuffer, y, !1);
    else {
      const q = y.stencilBuffer
          ? i.DEPTH_STENCIL_ATTACHMENT
          : i.DEPTH_ATTACHMENT,
        j = _.__webglDepthbuffer;
      i.bindRenderbuffer(i.RENDERBUFFER, j),
        i.framebufferRenderbuffer(i.FRAMEBUFFER, q, i.RENDERBUFFER, j);
    }
    e.bindFramebuffer(i.FRAMEBUFFER, null);
  }
  function Dt(y, _, U) {
    const q = n.get(y);
    _ !== void 0 &&
      gt(
        q.__webglFramebuffer,
        y,
        y.texture,
        i.COLOR_ATTACHMENT0,
        i.TEXTURE_2D,
        0
      ),
      U !== void 0 && At(y);
  }
  function Qt(y) {
    const _ = y.texture,
      U = n.get(y),
      q = n.get(_);
    y.addEventListener("dispose", A);
    const j = y.textures,
      k = y.isWebGLCubeRenderTarget === !0,
      vt = j.length > 1;
    if (
      (vt ||
        (q.__webglTexture === void 0 && (q.__webglTexture = i.createTexture()),
        (q.__version = _.version),
        a.memory.textures++),
      k)
    ) {
      U.__webglFramebuffer = [];
      for (let st = 0; st < 6; st++)
        if (_.mipmaps && _.mipmaps.length > 0) {
          U.__webglFramebuffer[st] = [];
          for (let ht = 0; ht < _.mipmaps.length; ht++)
            U.__webglFramebuffer[st][ht] = i.createFramebuffer();
        } else U.__webglFramebuffer[st] = i.createFramebuffer();
    } else {
      if (_.mipmaps && _.mipmaps.length > 0) {
        U.__webglFramebuffer = [];
        for (let st = 0; st < _.mipmaps.length; st++)
          U.__webglFramebuffer[st] = i.createFramebuffer();
      } else U.__webglFramebuffer = i.createFramebuffer();
      if (vt)
        for (let st = 0, ht = j.length; st < ht; st++) {
          const Bt = n.get(j[st]);
          Bt.__webglTexture === void 0 &&
            ((Bt.__webglTexture = i.createTexture()), a.memory.textures++);
        }
      if (y.samples > 0 && Nt(y) === !1) {
        (U.__webglMultisampledFramebuffer = i.createFramebuffer()),
          (U.__webglColorRenderbuffer = []),
          e.bindFramebuffer(i.FRAMEBUFFER, U.__webglMultisampledFramebuffer);
        for (let st = 0; st < j.length; st++) {
          const ht = j[st];
          (U.__webglColorRenderbuffer[st] = i.createRenderbuffer()),
            i.bindRenderbuffer(i.RENDERBUFFER, U.__webglColorRenderbuffer[st]);
          const Bt = s.convert(ht.format, ht.colorSpace),
            J = s.convert(ht.type),
            ut = T(
              ht.internalFormat,
              Bt,
              J,
              ht.colorSpace,
              y.isXRRenderTarget === !0
            ),
            Et = Ut(y);
          i.renderbufferStorageMultisample(
            i.RENDERBUFFER,
            Et,
            ut,
            y.width,
            y.height
          ),
            i.framebufferRenderbuffer(
              i.FRAMEBUFFER,
              i.COLOR_ATTACHMENT0 + st,
              i.RENDERBUFFER,
              U.__webglColorRenderbuffer[st]
            );
        }
        i.bindRenderbuffer(i.RENDERBUFFER, null),
          y.depthBuffer &&
            ((U.__webglDepthRenderbuffer = i.createRenderbuffer()),
            rt(U.__webglDepthRenderbuffer, y, !0)),
          e.bindFramebuffer(i.FRAMEBUFFER, null);
      }
    }
    if (k) {
      e.bindTexture(i.TEXTURE_CUBE_MAP, q.__webglTexture),
        Rt(i.TEXTURE_CUBE_MAP, _);
      for (let st = 0; st < 6; st++)
        if (_.mipmaps && _.mipmaps.length > 0)
          for (let ht = 0; ht < _.mipmaps.length; ht++)
            gt(
              U.__webglFramebuffer[st][ht],
              y,
              _,
              i.COLOR_ATTACHMENT0,
              i.TEXTURE_CUBE_MAP_POSITIVE_X + st,
              ht
            );
        else
          gt(
            U.__webglFramebuffer[st],
            y,
            _,
            i.COLOR_ATTACHMENT0,
            i.TEXTURE_CUBE_MAP_POSITIVE_X + st,
            0
          );
      p(_) && h(i.TEXTURE_CUBE_MAP), e.unbindTexture();
    } else if (vt) {
      for (let st = 0, ht = j.length; st < ht; st++) {
        const Bt = j[st],
          J = n.get(Bt);
        e.bindTexture(i.TEXTURE_2D, J.__webglTexture),
          Rt(i.TEXTURE_2D, Bt),
          gt(
            U.__webglFramebuffer,
            y,
            Bt,
            i.COLOR_ATTACHMENT0 + st,
            i.TEXTURE_2D,
            0
          ),
          p(Bt) && h(i.TEXTURE_2D);
      }
      e.unbindTexture();
    } else {
      let st = i.TEXTURE_2D;
      if (
        ((y.isWebGL3DRenderTarget || y.isWebGLArrayRenderTarget) &&
          (st = y.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY),
        e.bindTexture(st, q.__webglTexture),
        Rt(st, _),
        _.mipmaps && _.mipmaps.length > 0)
      )
        for (let ht = 0; ht < _.mipmaps.length; ht++)
          gt(U.__webglFramebuffer[ht], y, _, i.COLOR_ATTACHMENT0, st, ht);
      else gt(U.__webglFramebuffer, y, _, i.COLOR_ATTACHMENT0, st, 0);
      p(_) && h(st), e.unbindTexture();
    }
    y.depthBuffer && At(y);
  }
  function Ot(y) {
    const _ = y.textures;
    for (let U = 0, q = _.length; U < q; U++) {
      const j = _[U];
      if (p(j)) {
        const k = b(y),
          vt = n.get(j).__webglTexture;
        e.bindTexture(k, vt), h(k), e.unbindTexture();
      }
    }
  }
  const ee = [],
    I = [];
  function Se(y) {
    if (y.samples > 0) {
      if (Nt(y) === !1) {
        const _ = y.textures,
          U = y.width,
          q = y.height;
        let j = i.COLOR_BUFFER_BIT;
        const k = y.stencilBuffer
            ? i.DEPTH_STENCIL_ATTACHMENT
            : i.DEPTH_ATTACHMENT,
          vt = n.get(y),
          st = _.length > 1;
        if (st)
          for (let ht = 0; ht < _.length; ht++)
            e.bindFramebuffer(i.FRAMEBUFFER, vt.__webglMultisampledFramebuffer),
              i.framebufferRenderbuffer(
                i.FRAMEBUFFER,
                i.COLOR_ATTACHMENT0 + ht,
                i.RENDERBUFFER,
                null
              ),
              e.bindFramebuffer(i.FRAMEBUFFER, vt.__webglFramebuffer),
              i.framebufferTexture2D(
                i.DRAW_FRAMEBUFFER,
                i.COLOR_ATTACHMENT0 + ht,
                i.TEXTURE_2D,
                null,
                0
              );
        e.bindFramebuffer(
          i.READ_FRAMEBUFFER,
          vt.__webglMultisampledFramebuffer
        ),
          e.bindFramebuffer(i.DRAW_FRAMEBUFFER, vt.__webglFramebuffer);
        for (let ht = 0; ht < _.length; ht++) {
          if (
            (y.resolveDepthBuffer &&
              (y.depthBuffer && (j |= i.DEPTH_BUFFER_BIT),
              y.stencilBuffer &&
                y.resolveStencilBuffer &&
                (j |= i.STENCIL_BUFFER_BIT)),
            st)
          ) {
            i.framebufferRenderbuffer(
              i.READ_FRAMEBUFFER,
              i.COLOR_ATTACHMENT0,
              i.RENDERBUFFER,
              vt.__webglColorRenderbuffer[ht]
            );
            const Bt = n.get(_[ht]).__webglTexture;
            i.framebufferTexture2D(
              i.DRAW_FRAMEBUFFER,
              i.COLOR_ATTACHMENT0,
              i.TEXTURE_2D,
              Bt,
              0
            );
          }
          i.blitFramebuffer(0, 0, U, q, 0, 0, U, q, j, i.NEAREST),
            l === !0 &&
              ((ee.length = 0),
              (I.length = 0),
              ee.push(i.COLOR_ATTACHMENT0 + ht),
              y.depthBuffer &&
                y.resolveDepthBuffer === !1 &&
                (ee.push(k),
                I.push(k),
                i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, I)),
              i.invalidateFramebuffer(i.READ_FRAMEBUFFER, ee));
        }
        if (
          (e.bindFramebuffer(i.READ_FRAMEBUFFER, null),
          e.bindFramebuffer(i.DRAW_FRAMEBUFFER, null),
          st)
        )
          for (let ht = 0; ht < _.length; ht++) {
            e.bindFramebuffer(i.FRAMEBUFFER, vt.__webglMultisampledFramebuffer),
              i.framebufferRenderbuffer(
                i.FRAMEBUFFER,
                i.COLOR_ATTACHMENT0 + ht,
                i.RENDERBUFFER,
                vt.__webglColorRenderbuffer[ht]
              );
            const Bt = n.get(_[ht]).__webglTexture;
            e.bindFramebuffer(i.FRAMEBUFFER, vt.__webglFramebuffer),
              i.framebufferTexture2D(
                i.DRAW_FRAMEBUFFER,
                i.COLOR_ATTACHMENT0 + ht,
                i.TEXTURE_2D,
                Bt,
                0
              );
          }
        e.bindFramebuffer(
          i.DRAW_FRAMEBUFFER,
          vt.__webglMultisampledFramebuffer
        );
      } else if (y.depthBuffer && y.resolveDepthBuffer === !1 && l) {
        const _ = y.stencilBuffer
          ? i.DEPTH_STENCIL_ATTACHMENT
          : i.DEPTH_ATTACHMENT;
        i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, [_]);
      }
    }
  }
  function Ut(y) {
    return Math.min(r.maxSamples, y.samples);
  }
  function Nt(y) {
    const _ = n.get(y);
    return (
      y.samples > 0 &&
      t.has("WEBGL_multisampled_render_to_texture") === !0 &&
      _.__useRenderToTexture !== !1
    );
  }
  function St(y) {
    const _ = a.render.frame;
    u.get(y) !== _ && (u.set(y, _), y.update());
  }
  function Zt(y, _) {
    const U = y.colorSpace,
      q = y.format,
      j = y.type;
    return (
      y.isCompressedTexture === !0 ||
        y.isVideoTexture === !0 ||
        (U !== ei &&
          U !== ln &&
          (zt.getTransfer(U) === Xt
            ? (q !== Ie || j !== je) &&
              console.warn(
                "THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."
              )
            : console.error(
                "THREE.WebGLTextures: Unsupported texture color space:",
                U
              ))),
      _
    );
  }
  function Mt(y) {
    return (
      typeof HTMLImageElement < "u" && y instanceof HTMLImageElement
        ? ((c.width = y.naturalWidth || y.width),
          (c.height = y.naturalHeight || y.height))
        : typeof VideoFrame < "u" && y instanceof VideoFrame
        ? ((c.width = y.displayWidth), (c.height = y.displayHeight))
        : ((c.width = y.width), (c.height = y.height)),
      c
    );
  }
  (this.allocateTextureUnit = H),
    (this.resetTextureUnits = G),
    (this.setTexture2D = K),
    (this.setTexture2DArray = X),
    (this.setTexture3D = Z),
    (this.setTextureCube = z),
    (this.rebindTextures = Dt),
    (this.setupRenderTarget = Qt),
    (this.updateRenderTargetMipmap = Ot),
    (this.updateMultisampleRenderTarget = Se),
    (this.setupDepthRenderbuffer = At),
    (this.setupFrameBufferTexture = gt),
    (this.useMultisampledRTT = Nt);
}
function Lf(i, t) {
  function e(n, r = ln) {
    let s;
    const a = zt.getTransfer(r);
    if (n === je) return i.UNSIGNED_BYTE;
    if (n === bs) return i.UNSIGNED_SHORT_4_4_4_4;
    if (n === As) return i.UNSIGNED_SHORT_5_5_5_1;
    if (n === Za) return i.UNSIGNED_INT_5_9_9_9_REV;
    if (n === $a) return i.BYTE;
    if (n === Ka) return i.SHORT;
    if (n === fi) return i.UNSIGNED_SHORT;
    if (n === Ts) return i.INT;
    if (n === Rn) return i.UNSIGNED_INT;
    if (n === $e) return i.FLOAT;
    if (n === pi) return i.HALF_FLOAT;
    if (n === ja) return i.ALPHA;
    if (n === Ja) return i.RGB;
    if (n === Ie) return i.RGBA;
    if (n === Qa) return i.LUMINANCE;
    if (n === to) return i.LUMINANCE_ALPHA;
    if (n === Yn) return i.DEPTH_COMPONENT;
    if (n === Qn) return i.DEPTH_STENCIL;
    if (n === eo) return i.RED;
    if (n === Rs) return i.RED_INTEGER;
    if (n === no) return i.RG;
    if (n === ws) return i.RG_INTEGER;
    if (n === Cs) return i.RGBA_INTEGER;
    if (n === Wi || n === Xi || n === qi || n === Yi)
      if (a === Xt)
        if (((s = t.get("WEBGL_compressed_texture_s3tc_srgb")), s !== null)) {
          if (n === Wi) return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;
          if (n === Xi) return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
          if (n === qi) return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
          if (n === Yi) return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
        } else return null;
      else if (((s = t.get("WEBGL_compressed_texture_s3tc")), s !== null)) {
        if (n === Wi) return s.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (n === Xi) return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (n === qi) return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (n === Yi) return s.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      } else return null;
    if (n === Kr || n === Zr || n === jr || n === Jr)
      if (((s = t.get("WEBGL_compressed_texture_pvrtc")), s !== null)) {
        if (n === Kr) return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (n === Zr) return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (n === jr) return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (n === Jr) return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      } else return null;
    if (n === Qr || n === ts || n === es)
      if (((s = t.get("WEBGL_compressed_texture_etc")), s !== null)) {
        if (n === Qr || n === ts)
          return a === Xt ? s.COMPRESSED_SRGB8_ETC2 : s.COMPRESSED_RGB8_ETC2;
        if (n === es)
          return a === Xt
            ? s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC
            : s.COMPRESSED_RGBA8_ETC2_EAC;
      } else return null;
    if (
      n === ns ||
      n === is ||
      n === rs ||
      n === ss ||
      n === as ||
      n === os ||
      n === ls ||
      n === cs ||
      n === hs ||
      n === us ||
      n === ds ||
      n === fs ||
      n === ps ||
      n === ms
    )
      if (((s = t.get("WEBGL_compressed_texture_astc")), s !== null)) {
        if (n === ns)
          return a === Xt
            ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR
            : s.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (n === is)
          return a === Xt
            ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR
            : s.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (n === rs)
          return a === Xt
            ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR
            : s.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (n === ss)
          return a === Xt
            ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR
            : s.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (n === as)
          return a === Xt
            ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR
            : s.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (n === os)
          return a === Xt
            ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR
            : s.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (n === ls)
          return a === Xt
            ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR
            : s.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (n === cs)
          return a === Xt
            ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR
            : s.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (n === hs)
          return a === Xt
            ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR
            : s.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (n === us)
          return a === Xt
            ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR
            : s.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (n === ds)
          return a === Xt
            ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR
            : s.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (n === fs)
          return a === Xt
            ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR
            : s.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (n === ps)
          return a === Xt
            ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR
            : s.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (n === ms)
          return a === Xt
            ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR
            : s.COMPRESSED_RGBA_ASTC_12x12_KHR;
      } else return null;
    if (n === $i || n === _s || n === gs)
      if (((s = t.get("EXT_texture_compression_bptc")), s !== null)) {
        if (n === $i)
          return a === Xt
            ? s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT
            : s.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (n === _s) return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (n === gs) return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      } else return null;
    if (n === io || n === vs || n === xs || n === Ms)
      if (((s = t.get("EXT_texture_compression_rgtc")), s !== null)) {
        if (n === $i) return s.COMPRESSED_RED_RGTC1_EXT;
        if (n === vs) return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (n === xs) return s.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (n === Ms) return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      } else return null;
    return n === Jn ? i.UNSIGNED_INT_24_8 : i[n] !== void 0 ? i[n] : null;
  }
  return { convert: e };
}
class If extends be {
  constructor(t = []) {
    super(), (this.isArrayCamera = !0), (this.cameras = t);
  }
}
class ki extends Me {
  constructor() {
    super(), (this.isGroup = !0), (this.type = "Group");
  }
}
const Df = { type: "move" };
class Ur {
  constructor() {
    (this._targetRay = null), (this._grip = null), (this._hand = null);
  }
  getHandSpace() {
    return (
      this._hand === null &&
        ((this._hand = new ki()),
        (this._hand.matrixAutoUpdate = !1),
        (this._hand.visible = !1),
        (this._hand.joints = {}),
        (this._hand.inputState = { pinching: !1 })),
      this._hand
    );
  }
  getTargetRaySpace() {
    return (
      this._targetRay === null &&
        ((this._targetRay = new ki()),
        (this._targetRay.matrixAutoUpdate = !1),
        (this._targetRay.visible = !1),
        (this._targetRay.hasLinearVelocity = !1),
        (this._targetRay.linearVelocity = new B()),
        (this._targetRay.hasAngularVelocity = !1),
        (this._targetRay.angularVelocity = new B())),
      this._targetRay
    );
  }
  getGripSpace() {
    return (
      this._grip === null &&
        ((this._grip = new ki()),
        (this._grip.matrixAutoUpdate = !1),
        (this._grip.visible = !1),
        (this._grip.hasLinearVelocity = !1),
        (this._grip.linearVelocity = new B()),
        (this._grip.hasAngularVelocity = !1),
        (this._grip.angularVelocity = new B())),
      this._grip
    );
  }
  dispatchEvent(t) {
    return (
      this._targetRay !== null && this._targetRay.dispatchEvent(t),
      this._grip !== null && this._grip.dispatchEvent(t),
      this._hand !== null && this._hand.dispatchEvent(t),
      this
    );
  }
  connect(t) {
    if (t && t.hand) {
      const e = this._hand;
      if (e) for (const n of t.hand.values()) this._getHandJoint(e, n);
    }
    return this.dispatchEvent({ type: "connected", data: t }), this;
  }
  disconnect(t) {
    return (
      this.dispatchEvent({ type: "disconnected", data: t }),
      this._targetRay !== null && (this._targetRay.visible = !1),
      this._grip !== null && (this._grip.visible = !1),
      this._hand !== null && (this._hand.visible = !1),
      this
    );
  }
  update(t, e, n) {
    let r = null,
      s = null,
      a = null;
    const o = this._targetRay,
      l = this._grip,
      c = this._hand;
    if (t && e.session.visibilityState !== "visible-blurred") {
      if (c && t.hand) {
        a = !0;
        for (const M of t.hand.values()) {
          const p = e.getJointPose(M, n),
            h = this._getHandJoint(c, M);
          p !== null &&
            (h.matrix.fromArray(p.transform.matrix),
            h.matrix.decompose(h.position, h.rotation, h.scale),
            (h.matrixWorldNeedsUpdate = !0),
            (h.jointRadius = p.radius)),
            (h.visible = p !== null);
        }
        const u = c.joints["index-finger-tip"],
          d = c.joints["thumb-tip"],
          f = u.position.distanceTo(d.position),
          m = 0.02,
          v = 0.005;
        c.inputState.pinching && f > m + v
          ? ((c.inputState.pinching = !1),
            this.dispatchEvent({
              type: "pinchend",
              handedness: t.handedness,
              target: this,
            }))
          : !c.inputState.pinching &&
            f <= m - v &&
            ((c.inputState.pinching = !0),
            this.dispatchEvent({
              type: "pinchstart",
              handedness: t.handedness,
              target: this,
            }));
      } else
        l !== null &&
          t.gripSpace &&
          ((s = e.getPose(t.gripSpace, n)),
          s !== null &&
            (l.matrix.fromArray(s.transform.matrix),
            l.matrix.decompose(l.position, l.rotation, l.scale),
            (l.matrixWorldNeedsUpdate = !0),
            s.linearVelocity
              ? ((l.hasLinearVelocity = !0),
                l.linearVelocity.copy(s.linearVelocity))
              : (l.hasLinearVelocity = !1),
            s.angularVelocity
              ? ((l.hasAngularVelocity = !0),
                l.angularVelocity.copy(s.angularVelocity))
              : (l.hasAngularVelocity = !1)));
      o !== null &&
        ((r = e.getPose(t.targetRaySpace, n)),
        r === null && s !== null && (r = s),
        r !== null &&
          (o.matrix.fromArray(r.transform.matrix),
          o.matrix.decompose(o.position, o.rotation, o.scale),
          (o.matrixWorldNeedsUpdate = !0),
          r.linearVelocity
            ? ((o.hasLinearVelocity = !0),
              o.linearVelocity.copy(r.linearVelocity))
            : (o.hasLinearVelocity = !1),
          r.angularVelocity
            ? ((o.hasAngularVelocity = !0),
              o.angularVelocity.copy(r.angularVelocity))
            : (o.hasAngularVelocity = !1),
          this.dispatchEvent(Df)));
    }
    return (
      o !== null && (o.visible = r !== null),
      l !== null && (l.visible = s !== null),
      c !== null && (c.visible = a !== null),
      this
    );
  }
  _getHandJoint(t, e) {
    if (t.joints[e.jointName] === void 0) {
      const n = new ki();
      (n.matrixAutoUpdate = !1),
        (n.visible = !1),
        (t.joints[e.jointName] = n),
        t.add(n);
    }
    return t.joints[e.jointName];
  }
}
const Uf = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`,
  Nf = `
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;
class Ff {
  constructor() {
    (this.texture = null),
      (this.mesh = null),
      (this.depthNear = 0),
      (this.depthFar = 0);
  }
  init(t, e, n) {
    if (this.texture === null) {
      const r = new _e(),
        s = t.properties.get(r);
      (s.__webglTexture = e.texture),
        (e.depthNear != n.depthNear || e.depthFar != n.depthFar) &&
          ((this.depthNear = e.depthNear), (this.depthFar = e.depthFar)),
        (this.texture = r);
    }
  }
  getMesh(t) {
    if (this.texture !== null && this.mesh === null) {
      const e = t.cameras[0].viewport,
        n = new dn({
          vertexShader: Uf,
          fragmentShader: Nf,
          uniforms: {
            depthColor: { value: this.texture },
            depthWidth: { value: e.z },
            depthHeight: { value: e.w },
          },
        });
      this.mesh = new Oe(new xi(20, 20), n);
    }
    return this.mesh;
  }
  reset() {
    (this.texture = null), (this.mesh = null);
  }
  getDepthTexture() {
    return this.texture;
  }
}
class Of extends ni {
  constructor(t, e) {
    super();
    const n = this;
    let r = null,
      s = 1,
      a = null,
      o = "local-floor",
      l = 1,
      c = null,
      u = null,
      d = null,
      f = null,
      m = null,
      v = null;
    const M = new Ff(),
      p = e.getContextAttributes();
    let h = null,
      b = null;
    const T = [],
      E = [],
      O = new Yt();
    let C = null;
    const A = new be();
    A.viewport = new ne();
    const D = new be();
    D.viewport = new ne();
    const S = [A, D],
      x = new If();
    let R = null,
      G = null;
    (this.cameraAutoUpdate = !0),
      (this.enabled = !1),
      (this.isPresenting = !1),
      (this.getController = function (W) {
        let tt = T[W];
        return (
          tt === void 0 && ((tt = new Ur()), (T[W] = tt)),
          tt.getTargetRaySpace()
        );
      }),
      (this.getControllerGrip = function (W) {
        let tt = T[W];
        return (
          tt === void 0 && ((tt = new Ur()), (T[W] = tt)), tt.getGripSpace()
        );
      }),
      (this.getHand = function (W) {
        let tt = T[W];
        return (
          tt === void 0 && ((tt = new Ur()), (T[W] = tt)), tt.getHandSpace()
        );
      });
    function H(W) {
      const tt = E.indexOf(W.inputSource);
      if (tt === -1) return;
      const gt = T[tt];
      gt !== void 0 &&
        (gt.update(W.inputSource, W.frame, c || a),
        gt.dispatchEvent({ type: W.type, data: W.inputSource }));
    }
    function $() {
      r.removeEventListener("select", H),
        r.removeEventListener("selectstart", H),
        r.removeEventListener("selectend", H),
        r.removeEventListener("squeeze", H),
        r.removeEventListener("squeezestart", H),
        r.removeEventListener("squeezeend", H),
        r.removeEventListener("end", $),
        r.removeEventListener("inputsourceschange", K);
      for (let W = 0; W < T.length; W++) {
        const tt = E[W];
        tt !== null && ((E[W] = null), T[W].disconnect(tt));
      }
      (R = null),
        (G = null),
        M.reset(),
        t.setRenderTarget(h),
        (m = null),
        (f = null),
        (d = null),
        (r = null),
        (b = null),
        Vt.stop(),
        (n.isPresenting = !1),
        t.setPixelRatio(C),
        t.setSize(O.width, O.height, !1),
        n.dispatchEvent({ type: "sessionend" });
    }
    (this.setFramebufferScaleFactor = function (W) {
      (s = W),
        n.isPresenting === !0 &&
          console.warn(
            "THREE.WebXRManager: Cannot change framebuffer scale while presenting."
          );
    }),
      (this.setReferenceSpaceType = function (W) {
        (o = W),
          n.isPresenting === !0 &&
            console.warn(
              "THREE.WebXRManager: Cannot change reference space type while presenting."
            );
      }),
      (this.getReferenceSpace = function () {
        return c || a;
      }),
      (this.setReferenceSpace = function (W) {
        c = W;
      }),
      (this.getBaseLayer = function () {
        return f !== null ? f : m;
      }),
      (this.getBinding = function () {
        return d;
      }),
      (this.getFrame = function () {
        return v;
      }),
      (this.getSession = function () {
        return r;
      }),
      (this.setSession = async function (W) {
        if (((r = W), r !== null)) {
          if (
            ((h = t.getRenderTarget()),
            r.addEventListener("select", H),
            r.addEventListener("selectstart", H),
            r.addEventListener("selectend", H),
            r.addEventListener("squeeze", H),
            r.addEventListener("squeezestart", H),
            r.addEventListener("squeezeend", H),
            r.addEventListener("end", $),
            r.addEventListener("inputsourceschange", K),
            p.xrCompatible !== !0 && (await e.makeXRCompatible()),
            (C = t.getPixelRatio()),
            t.getSize(O),
            r.renderState.layers === void 0)
          ) {
            const tt = {
              antialias: p.antialias,
              alpha: !0,
              depth: p.depth,
              stencil: p.stencil,
              framebufferScaleFactor: s,
            };
            (m = new XRWebGLLayer(r, e, tt)),
              r.updateRenderState({ baseLayer: m }),
              t.setPixelRatio(1),
              t.setSize(m.framebufferWidth, m.framebufferHeight, !1),
              (b = new wn(m.framebufferWidth, m.framebufferHeight, {
                format: Ie,
                type: je,
                colorSpace: t.outputColorSpace,
                stencilBuffer: p.stencil,
              }));
          } else {
            let tt = null,
              gt = null,
              rt = null;
            p.depth &&
              ((rt = p.stencil ? e.DEPTH24_STENCIL8 : e.DEPTH_COMPONENT24),
              (tt = p.stencil ? Qn : Yn),
              (gt = p.stencil ? Jn : Rn));
            const yt = {
              colorFormat: e.RGBA8,
              depthFormat: rt,
              scaleFactor: s,
            };
            (d = new XRWebGLBinding(r, e)),
              (f = d.createProjectionLayer(yt)),
              r.updateRenderState({ layers: [f] }),
              t.setPixelRatio(1),
              t.setSize(f.textureWidth, f.textureHeight, !1),
              (b = new wn(f.textureWidth, f.textureHeight, {
                format: Ie,
                type: je,
                depthTexture: new vo(
                  f.textureWidth,
                  f.textureHeight,
                  gt,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  tt
                ),
                stencilBuffer: p.stencil,
                colorSpace: t.outputColorSpace,
                samples: p.antialias ? 4 : 0,
                resolveDepthBuffer: f.ignoreDepthValues === !1,
              }));
          }
          (b.isXRRenderTarget = !0),
            this.setFoveation(l),
            (c = null),
            (a = await r.requestReferenceSpace(o)),
            Vt.setContext(r),
            Vt.start(),
            (n.isPresenting = !0),
            n.dispatchEvent({ type: "sessionstart" });
        }
      }),
      (this.getEnvironmentBlendMode = function () {
        if (r !== null) return r.environmentBlendMode;
      }),
      (this.getDepthTexture = function () {
        return M.getDepthTexture();
      });
    function K(W) {
      for (let tt = 0; tt < W.removed.length; tt++) {
        const gt = W.removed[tt],
          rt = E.indexOf(gt);
        rt >= 0 && ((E[rt] = null), T[rt].disconnect(gt));
      }
      for (let tt = 0; tt < W.added.length; tt++) {
        const gt = W.added[tt];
        let rt = E.indexOf(gt);
        if (rt === -1) {
          for (let At = 0; At < T.length; At++)
            if (At >= E.length) {
              E.push(gt), (rt = At);
              break;
            } else if (E[At] === null) {
              (E[At] = gt), (rt = At);
              break;
            }
          if (rt === -1) break;
        }
        const yt = T[rt];
        yt && yt.connect(gt);
      }
    }
    const X = new B(),
      Z = new B();
    function z(W, tt, gt) {
      X.setFromMatrixPosition(tt.matrixWorld),
        Z.setFromMatrixPosition(gt.matrixWorld);
      const rt = X.distanceTo(Z),
        yt = tt.projectionMatrix.elements,
        At = gt.projectionMatrix.elements,
        Dt = yt[14] / (yt[10] - 1),
        Qt = yt[14] / (yt[10] + 1),
        Ot = (yt[9] + 1) / yt[5],
        ee = (yt[9] - 1) / yt[5],
        I = (yt[8] - 1) / yt[0],
        Se = (At[8] + 1) / At[0],
        Ut = Dt * I,
        Nt = Dt * Se,
        St = rt / (-I + Se),
        Zt = St * -I;
      if (
        (tt.matrixWorld.decompose(W.position, W.quaternion, W.scale),
        W.translateX(Zt),
        W.translateZ(St),
        W.matrixWorld.compose(W.position, W.quaternion, W.scale),
        W.matrixWorldInverse.copy(W.matrixWorld).invert(),
        yt[10] === -1)
      )
        W.projectionMatrix.copy(tt.projectionMatrix),
          W.projectionMatrixInverse.copy(tt.projectionMatrixInverse);
      else {
        const Mt = Dt + St,
          y = Qt + St,
          _ = Ut - Zt,
          U = Nt + (rt - Zt),
          q = ((Ot * Qt) / y) * Mt,
          j = ((ee * Qt) / y) * Mt;
        W.projectionMatrix.makePerspective(_, U, q, j, Mt, y),
          W.projectionMatrixInverse.copy(W.projectionMatrix).invert();
      }
    }
    function et(W, tt) {
      tt === null
        ? W.matrixWorld.copy(W.matrix)
        : W.matrixWorld.multiplyMatrices(tt.matrixWorld, W.matrix),
        W.matrixWorldInverse.copy(W.matrixWorld).invert();
    }
    this.updateCamera = function (W) {
      if (r === null) return;
      let tt = W.near,
        gt = W.far;
      M.texture !== null &&
        (M.depthNear > 0 && (tt = M.depthNear),
        M.depthFar > 0 && (gt = M.depthFar)),
        (x.near = D.near = A.near = tt),
        (x.far = D.far = A.far = gt),
        (R !== x.near || G !== x.far) &&
          (r.updateRenderState({ depthNear: x.near, depthFar: x.far }),
          (R = x.near),
          (G = x.far)),
        (A.layers.mask = W.layers.mask | 2),
        (D.layers.mask = W.layers.mask | 4),
        (x.layers.mask = A.layers.mask | D.layers.mask);
      const rt = W.parent,
        yt = x.cameras;
      et(x, rt);
      for (let At = 0; At < yt.length; At++) et(yt[At], rt);
      yt.length === 2
        ? z(x, A, D)
        : x.projectionMatrix.copy(A.projectionMatrix),
        ct(W, x, rt);
    };
    function ct(W, tt, gt) {
      gt === null
        ? W.matrix.copy(tt.matrixWorld)
        : (W.matrix.copy(gt.matrixWorld),
          W.matrix.invert(),
          W.matrix.multiply(tt.matrixWorld)),
        W.matrix.decompose(W.position, W.quaternion, W.scale),
        W.updateMatrixWorld(!0),
        W.projectionMatrix.copy(tt.projectionMatrix),
        W.projectionMatrixInverse.copy(tt.projectionMatrixInverse),
        W.isPerspectiveCamera &&
          ((W.fov = Ss * 2 * Math.atan(1 / W.projectionMatrix.elements[5])),
          (W.zoom = 1));
    }
    (this.getCamera = function () {
      return x;
    }),
      (this.getFoveation = function () {
        if (!(f === null && m === null)) return l;
      }),
      (this.setFoveation = function (W) {
        (l = W),
          f !== null && (f.fixedFoveation = W),
          m !== null && m.fixedFoveation !== void 0 && (m.fixedFoveation = W);
      }),
      (this.hasDepthSensing = function () {
        return M.texture !== null;
      }),
      (this.getDepthSensingMesh = function () {
        return M.getMesh(x);
      });
    let _t = null;
    function Rt(W, tt) {
      if (((u = tt.getViewerPose(c || a)), (v = tt), u !== null)) {
        const gt = u.views;
        m !== null &&
          (t.setRenderTargetFramebuffer(b, m.framebuffer),
          t.setRenderTarget(b));
        let rt = !1;
        gt.length !== x.cameras.length && ((x.cameras.length = 0), (rt = !0));
        for (let At = 0; At < gt.length; At++) {
          const Dt = gt[At];
          let Qt = null;
          if (m !== null) Qt = m.getViewport(Dt);
          else {
            const ee = d.getViewSubImage(f, Dt);
            (Qt = ee.viewport),
              At === 0 &&
                (t.setRenderTargetTextures(
                  b,
                  ee.colorTexture,
                  f.ignoreDepthValues ? void 0 : ee.depthStencilTexture
                ),
                t.setRenderTarget(b));
          }
          let Ot = S[At];
          Ot === void 0 &&
            ((Ot = new be()),
            Ot.layers.enable(At),
            (Ot.viewport = new ne()),
            (S[At] = Ot)),
            Ot.matrix.fromArray(Dt.transform.matrix),
            Ot.matrix.decompose(Ot.position, Ot.quaternion, Ot.scale),
            Ot.projectionMatrix.fromArray(Dt.projectionMatrix),
            Ot.projectionMatrixInverse.copy(Ot.projectionMatrix).invert(),
            Ot.viewport.set(Qt.x, Qt.y, Qt.width, Qt.height),
            At === 0 &&
              (x.matrix.copy(Ot.matrix),
              x.matrix.decompose(x.position, x.quaternion, x.scale)),
            rt === !0 && x.cameras.push(Ot);
        }
        const yt = r.enabledFeatures;
        if (yt && yt.includes("depth-sensing")) {
          const At = d.getDepthInformation(gt[0]);
          At && At.isValid && At.texture && M.init(t, At, r.renderState);
        }
      }
      for (let gt = 0; gt < T.length; gt++) {
        const rt = E[gt],
          yt = T[gt];
        rt !== null && yt !== void 0 && yt.update(rt, tt, c || a);
      }
      _t && _t(W, tt),
        tt.detectedPlanes &&
          n.dispatchEvent({ type: "planesdetected", data: tt }),
        (v = null);
    }
    const Vt = new go();
    Vt.setAnimationLoop(Rt),
      (this.setAnimationLoop = function (W) {
        _t = W;
      }),
      (this.dispose = function () {});
  }
}
const xn = new Je(),
  Bf = new re();
function zf(i, t) {
  function e(p, h) {
    p.matrixAutoUpdate === !0 && p.updateMatrix(), h.value.copy(p.matrix);
  }
  function n(p, h) {
    h.color.getRGB(p.fogColor.value, fo(i)),
      h.isFog
        ? ((p.fogNear.value = h.near), (p.fogFar.value = h.far))
        : h.isFogExp2 && (p.fogDensity.value = h.density);
  }
  function r(p, h, b, T, E) {
    h.isMeshBasicMaterial || h.isMeshLambertMaterial
      ? s(p, h)
      : h.isMeshToonMaterial
      ? (s(p, h), d(p, h))
      : h.isMeshPhongMaterial
      ? (s(p, h), u(p, h))
      : h.isMeshStandardMaterial
      ? (s(p, h), f(p, h), h.isMeshPhysicalMaterial && m(p, h, E))
      : h.isMeshMatcapMaterial
      ? (s(p, h), v(p, h))
      : h.isMeshDepthMaterial
      ? s(p, h)
      : h.isMeshDistanceMaterial
      ? (s(p, h), M(p, h))
      : h.isMeshNormalMaterial
      ? s(p, h)
      : h.isLineBasicMaterial
      ? (a(p, h), h.isLineDashedMaterial && o(p, h))
      : h.isPointsMaterial
      ? l(p, h, b, T)
      : h.isSpriteMaterial
      ? c(p, h)
      : h.isShadowMaterial
      ? (p.color.value.copy(h.color), (p.opacity.value = h.opacity))
      : h.isShaderMaterial && (h.uniformsNeedUpdate = !1);
  }
  function s(p, h) {
    (p.opacity.value = h.opacity),
      h.color && p.diffuse.value.copy(h.color),
      h.emissive &&
        p.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),
      h.map && ((p.map.value = h.map), e(h.map, p.mapTransform)),
      h.alphaMap &&
        ((p.alphaMap.value = h.alphaMap), e(h.alphaMap, p.alphaMapTransform)),
      h.bumpMap &&
        ((p.bumpMap.value = h.bumpMap),
        e(h.bumpMap, p.bumpMapTransform),
        (p.bumpScale.value = h.bumpScale),
        h.side === me && (p.bumpScale.value *= -1)),
      h.normalMap &&
        ((p.normalMap.value = h.normalMap),
        e(h.normalMap, p.normalMapTransform),
        p.normalScale.value.copy(h.normalScale),
        h.side === me && p.normalScale.value.negate()),
      h.displacementMap &&
        ((p.displacementMap.value = h.displacementMap),
        e(h.displacementMap, p.displacementMapTransform),
        (p.displacementScale.value = h.displacementScale),
        (p.displacementBias.value = h.displacementBias)),
      h.emissiveMap &&
        ((p.emissiveMap.value = h.emissiveMap),
        e(h.emissiveMap, p.emissiveMapTransform)),
      h.specularMap &&
        ((p.specularMap.value = h.specularMap),
        e(h.specularMap, p.specularMapTransform)),
      h.alphaTest > 0 && (p.alphaTest.value = h.alphaTest);
    const b = t.get(h),
      T = b.envMap,
      E = b.envMapRotation;
    T &&
      ((p.envMap.value = T),
      xn.copy(E),
      (xn.x *= -1),
      (xn.y *= -1),
      (xn.z *= -1),
      T.isCubeTexture &&
        T.isRenderTargetTexture === !1 &&
        ((xn.y *= -1), (xn.z *= -1)),
      p.envMapRotation.value.setFromMatrix4(Bf.makeRotationFromEuler(xn)),
      (p.flipEnvMap.value =
        T.isCubeTexture && T.isRenderTargetTexture === !1 ? -1 : 1),
      (p.reflectivity.value = h.reflectivity),
      (p.ior.value = h.ior),
      (p.refractionRatio.value = h.refractionRatio)),
      h.lightMap &&
        ((p.lightMap.value = h.lightMap),
        (p.lightMapIntensity.value = h.lightMapIntensity),
        e(h.lightMap, p.lightMapTransform)),
      h.aoMap &&
        ((p.aoMap.value = h.aoMap),
        (p.aoMapIntensity.value = h.aoMapIntensity),
        e(h.aoMap, p.aoMapTransform));
  }
  function a(p, h) {
    p.diffuse.value.copy(h.color),
      (p.opacity.value = h.opacity),
      h.map && ((p.map.value = h.map), e(h.map, p.mapTransform));
  }
  function o(p, h) {
    (p.dashSize.value = h.dashSize),
      (p.totalSize.value = h.dashSize + h.gapSize),
      (p.scale.value = h.scale);
  }
  function l(p, h, b, T) {
    p.diffuse.value.copy(h.color),
      (p.opacity.value = h.opacity),
      (p.size.value = h.size * b),
      (p.scale.value = T * 0.5),
      h.map && ((p.map.value = h.map), e(h.map, p.uvTransform)),
      h.alphaMap &&
        ((p.alphaMap.value = h.alphaMap), e(h.alphaMap, p.alphaMapTransform)),
      h.alphaTest > 0 && (p.alphaTest.value = h.alphaTest);
  }
  function c(p, h) {
    p.diffuse.value.copy(h.color),
      (p.opacity.value = h.opacity),
      (p.rotation.value = h.rotation),
      h.map && ((p.map.value = h.map), e(h.map, p.mapTransform)),
      h.alphaMap &&
        ((p.alphaMap.value = h.alphaMap), e(h.alphaMap, p.alphaMapTransform)),
      h.alphaTest > 0 && (p.alphaTest.value = h.alphaTest);
  }
  function u(p, h) {
    p.specular.value.copy(h.specular),
      (p.shininess.value = Math.max(h.shininess, 1e-4));
  }
  function d(p, h) {
    h.gradientMap && (p.gradientMap.value = h.gradientMap);
  }
  function f(p, h) {
    (p.metalness.value = h.metalness),
      h.metalnessMap &&
        ((p.metalnessMap.value = h.metalnessMap),
        e(h.metalnessMap, p.metalnessMapTransform)),
      (p.roughness.value = h.roughness),
      h.roughnessMap &&
        ((p.roughnessMap.value = h.roughnessMap),
        e(h.roughnessMap, p.roughnessMapTransform)),
      h.envMap && (p.envMapIntensity.value = h.envMapIntensity);
  }
  function m(p, h, b) {
    (p.ior.value = h.ior),
      h.sheen > 0 &&
        (p.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),
        (p.sheenRoughness.value = h.sheenRoughness),
        h.sheenColorMap &&
          ((p.sheenColorMap.value = h.sheenColorMap),
          e(h.sheenColorMap, p.sheenColorMapTransform)),
        h.sheenRoughnessMap &&
          ((p.sheenRoughnessMap.value = h.sheenRoughnessMap),
          e(h.sheenRoughnessMap, p.sheenRoughnessMapTransform))),
      h.clearcoat > 0 &&
        ((p.clearcoat.value = h.clearcoat),
        (p.clearcoatRoughness.value = h.clearcoatRoughness),
        h.clearcoatMap &&
          ((p.clearcoatMap.value = h.clearcoatMap),
          e(h.clearcoatMap, p.clearcoatMapTransform)),
        h.clearcoatRoughnessMap &&
          ((p.clearcoatRoughnessMap.value = h.clearcoatRoughnessMap),
          e(h.clearcoatRoughnessMap, p.clearcoatRoughnessMapTransform)),
        h.clearcoatNormalMap &&
          ((p.clearcoatNormalMap.value = h.clearcoatNormalMap),
          e(h.clearcoatNormalMap, p.clearcoatNormalMapTransform),
          p.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),
          h.side === me && p.clearcoatNormalScale.value.negate())),
      h.dispersion > 0 && (p.dispersion.value = h.dispersion),
      h.iridescence > 0 &&
        ((p.iridescence.value = h.iridescence),
        (p.iridescenceIOR.value = h.iridescenceIOR),
        (p.iridescenceThicknessMinimum.value = h.iridescenceThicknessRange[0]),
        (p.iridescenceThicknessMaximum.value = h.iridescenceThicknessRange[1]),
        h.iridescenceMap &&
          ((p.iridescenceMap.value = h.iridescenceMap),
          e(h.iridescenceMap, p.iridescenceMapTransform)),
        h.iridescenceThicknessMap &&
          ((p.iridescenceThicknessMap.value = h.iridescenceThicknessMap),
          e(h.iridescenceThicknessMap, p.iridescenceThicknessMapTransform))),
      h.transmission > 0 &&
        ((p.transmission.value = h.transmission),
        (p.transmissionSamplerMap.value = b.texture),
        p.transmissionSamplerSize.value.set(b.width, b.height),
        h.transmissionMap &&
          ((p.transmissionMap.value = h.transmissionMap),
          e(h.transmissionMap, p.transmissionMapTransform)),
        (p.thickness.value = h.thickness),
        h.thicknessMap &&
          ((p.thicknessMap.value = h.thicknessMap),
          e(h.thicknessMap, p.thicknessMapTransform)),
        (p.attenuationDistance.value = h.attenuationDistance),
        p.attenuationColor.value.copy(h.attenuationColor)),
      h.anisotropy > 0 &&
        (p.anisotropyVector.value.set(
          h.anisotropy * Math.cos(h.anisotropyRotation),
          h.anisotropy * Math.sin(h.anisotropyRotation)
        ),
        h.anisotropyMap &&
          ((p.anisotropyMap.value = h.anisotropyMap),
          e(h.anisotropyMap, p.anisotropyMapTransform))),
      (p.specularIntensity.value = h.specularIntensity),
      p.specularColor.value.copy(h.specularColor),
      h.specularColorMap &&
        ((p.specularColorMap.value = h.specularColorMap),
        e(h.specularColorMap, p.specularColorMapTransform)),
      h.specularIntensityMap &&
        ((p.specularIntensityMap.value = h.specularIntensityMap),
        e(h.specularIntensityMap, p.specularIntensityMapTransform));
  }
  function v(p, h) {
    h.matcap && (p.matcap.value = h.matcap);
  }
  function M(p, h) {
    const b = t.get(h).light;
    p.referencePosition.value.setFromMatrixPosition(b.matrixWorld),
      (p.nearDistance.value = b.shadow.camera.near),
      (p.farDistance.value = b.shadow.camera.far);
  }
  return { refreshFogUniforms: n, refreshMaterialUniforms: r };
}
function Hf(i, t, e, n) {
  let r = {},
    s = {},
    a = [];
  const o = i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);
  function l(b, T) {
    const E = T.program;
    n.uniformBlockBinding(b, E);
  }
  function c(b, T) {
    let E = r[b.id];
    E === void 0 &&
      (v(b), (E = u(b)), (r[b.id] = E), b.addEventListener("dispose", p));
    const O = T.program;
    n.updateUBOMapping(b, O);
    const C = t.render.frame;
    s[b.id] !== C && (f(b), (s[b.id] = C));
  }
  function u(b) {
    const T = d();
    b.__bindingPointIndex = T;
    const E = i.createBuffer(),
      O = b.__size,
      C = b.usage;
    return (
      i.bindBuffer(i.UNIFORM_BUFFER, E),
      i.bufferData(i.UNIFORM_BUFFER, O, C),
      i.bindBuffer(i.UNIFORM_BUFFER, null),
      i.bindBufferBase(i.UNIFORM_BUFFER, T, E),
      E
    );
  }
  function d() {
    for (let b = 0; b < o; b++) if (a.indexOf(b) === -1) return a.push(b), b;
    return (
      console.error(
        "THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."
      ),
      0
    );
  }
  function f(b) {
    const T = r[b.id],
      E = b.uniforms,
      O = b.__cache;
    i.bindBuffer(i.UNIFORM_BUFFER, T);
    for (let C = 0, A = E.length; C < A; C++) {
      const D = Array.isArray(E[C]) ? E[C] : [E[C]];
      for (let S = 0, x = D.length; S < x; S++) {
        const R = D[S];
        if (m(R, C, S, O) === !0) {
          const G = R.__offset,
            H = Array.isArray(R.value) ? R.value : [R.value];
          let $ = 0;
          for (let K = 0; K < H.length; K++) {
            const X = H[K],
              Z = M(X);
            typeof X == "number" || typeof X == "boolean"
              ? ((R.__data[0] = X),
                i.bufferSubData(i.UNIFORM_BUFFER, G + $, R.__data))
              : X.isMatrix3
              ? ((R.__data[0] = X.elements[0]),
                (R.__data[1] = X.elements[1]),
                (R.__data[2] = X.elements[2]),
                (R.__data[3] = 0),
                (R.__data[4] = X.elements[3]),
                (R.__data[5] = X.elements[4]),
                (R.__data[6] = X.elements[5]),
                (R.__data[7] = 0),
                (R.__data[8] = X.elements[6]),
                (R.__data[9] = X.elements[7]),
                (R.__data[10] = X.elements[8]),
                (R.__data[11] = 0))
              : (X.toArray(R.__data, $),
                ($ += Z.storage / Float32Array.BYTES_PER_ELEMENT));
          }
          i.bufferSubData(i.UNIFORM_BUFFER, G, R.__data);
        }
      }
    }
    i.bindBuffer(i.UNIFORM_BUFFER, null);
  }
  function m(b, T, E, O) {
    const C = b.value,
      A = T + "_" + E;
    if (O[A] === void 0)
      return (
        typeof C == "number" || typeof C == "boolean"
          ? (O[A] = C)
          : (O[A] = C.clone()),
        !0
      );
    {
      const D = O[A];
      if (typeof C == "number" || typeof C == "boolean") {
        if (D !== C) return (O[A] = C), !0;
      } else if (D.equals(C) === !1) return D.copy(C), !0;
    }
    return !1;
  }
  function v(b) {
    const T = b.uniforms;
    let E = 0;
    const O = 16;
    for (let A = 0, D = T.length; A < D; A++) {
      const S = Array.isArray(T[A]) ? T[A] : [T[A]];
      for (let x = 0, R = S.length; x < R; x++) {
        const G = S[x],
          H = Array.isArray(G.value) ? G.value : [G.value];
        for (let $ = 0, K = H.length; $ < K; $++) {
          const X = H[$],
            Z = M(X),
            z = E % O,
            et = z % Z.boundary,
            ct = z + et;
          (E += et),
            ct !== 0 && O - ct < Z.storage && (E += O - ct),
            (G.__data = new Float32Array(
              Z.storage / Float32Array.BYTES_PER_ELEMENT
            )),
            (G.__offset = E),
            (E += Z.storage);
        }
      }
    }
    const C = E % O;
    return C > 0 && (E += O - C), (b.__size = E), (b.__cache = {}), this;
  }
  function M(b) {
    const T = { boundary: 0, storage: 0 };
    return (
      typeof b == "number" || typeof b == "boolean"
        ? ((T.boundary = 4), (T.storage = 4))
        : b.isVector2
        ? ((T.boundary = 8), (T.storage = 8))
        : b.isVector3 || b.isColor
        ? ((T.boundary = 16), (T.storage = 12))
        : b.isVector4
        ? ((T.boundary = 16), (T.storage = 16))
        : b.isMatrix3
        ? ((T.boundary = 48), (T.storage = 48))
        : b.isMatrix4
        ? ((T.boundary = 64), (T.storage = 64))
        : b.isTexture
        ? console.warn(
            "THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."
          )
        : console.warn(
            "THREE.WebGLRenderer: Unsupported uniform value type.",
            b
          ),
      T
    );
  }
  function p(b) {
    const T = b.target;
    T.removeEventListener("dispose", p);
    const E = a.indexOf(T.__bindingPointIndex);
    a.splice(E, 1), i.deleteBuffer(r[T.id]), delete r[T.id], delete s[T.id];
  }
  function h() {
    for (const b in r) i.deleteBuffer(r[b]);
    (a = []), (r = {}), (s = {});
  }
  return { bind: l, update: c, dispose: h };
}
class Vf {
  constructor(t = {}) {
    const {
      canvas: e = Al(),
      context: n = null,
      depth: r = !0,
      stencil: s = !1,
      alpha: a = !1,
      antialias: o = !1,
      premultipliedAlpha: l = !0,
      preserveDrawingBuffer: c = !1,
      powerPreference: u = "default",
      failIfMajorPerformanceCaveat: d = !1,
      reverseDepthBuffer: f = !1,
    } = t;
    this.isWebGLRenderer = !0;
    let m;
    if (n !== null) {
      if (
        typeof WebGLRenderingContext < "u" &&
        n instanceof WebGLRenderingContext
      )
        throw new Error(
          "THREE.WebGLRenderer: WebGL 1 is not supported since r163."
        );
      m = n.getContextAttributes().alpha;
    } else m = a;
    const v = new Uint32Array(4),
      M = new Int32Array(4);
    let p = null,
      h = null;
    const b = [],
      T = [];
    (this.domElement = e),
      (this.debug = { checkShaderErrors: !0, onShaderError: null }),
      (this.autoClear = !0),
      (this.autoClearColor = !0),
      (this.autoClearDepth = !0),
      (this.autoClearStencil = !0),
      (this.sortObjects = !0),
      (this.clippingPlanes = []),
      (this.localClippingEnabled = !1),
      (this._outputColorSpace = Te),
      (this.toneMapping = hn),
      (this.toneMappingExposure = 1);
    const E = this;
    let O = !1,
      C = 0,
      A = 0,
      D = null,
      S = -1,
      x = null;
    const R = new ne(),
      G = new ne();
    let H = null;
    const $ = new qt(0);
    let K = 0,
      X = e.width,
      Z = e.height,
      z = 1,
      et = null,
      ct = null;
    const _t = new ne(0, 0, X, Z),
      Rt = new ne(0, 0, X, Z);
    let Vt = !1;
    const W = new _o();
    let tt = !1,
      gt = !1;
    const rt = new re(),
      yt = new re(),
      At = new B(),
      Dt = new ne(),
      Qt = {
        background: null,
        fog: null,
        environment: null,
        overrideMaterial: null,
        isScene: !0,
      };
    let Ot = !1;
    function ee() {
      return D === null ? z : 1;
    }
    let I = n;
    function Se(g, P) {
      return e.getContext(g, P);
    }
    try {
      const g = {
        alpha: !0,
        depth: r,
        stencil: s,
        antialias: o,
        premultipliedAlpha: l,
        preserveDrawingBuffer: c,
        powerPreference: u,
        failIfMajorPerformanceCaveat: d,
      };
      if (
        ("setAttribute" in e &&
          e.setAttribute("data-engine", `three.js r${ys}`),
        e.addEventListener("webglcontextlost", Y, !1),
        e.addEventListener("webglcontextrestored", lt, !1),
        e.addEventListener("webglcontextcreationerror", at, !1),
        I === null)
      ) {
        const P = "webgl2";
        if (((I = Se(P, g)), I === null))
          throw Se(P)
            ? new Error(
                "Error creating WebGL context with your selected attributes."
              )
            : new Error("Error creating WebGL context.");
      }
    } catch (g) {
      throw (console.error("THREE.WebGLRenderer: " + g.message), g);
    }
    let Ut,
      Nt,
      St,
      Zt,
      Mt,
      y,
      _,
      U,
      q,
      j,
      k,
      vt,
      st,
      ht,
      Bt,
      J,
      ut,
      Et,
      Tt,
      dt,
      Ft,
      Lt,
      $t,
      w;
    function it() {
      (Ut = new Xu(I)),
        Ut.init(),
        (Lt = new Lf(I, Ut)),
        (Nt = new Bu(I, Ut, t, Lt)),
        (St = new wf(I, Ut)),
        Nt.reverseDepthBuffer && f && St.buffers.depth.setReversed(!0),
        (Zt = new $u(I)),
        (Mt = new ff()),
        (y = new Pf(I, Ut, St, Mt, Nt, Lt, Zt)),
        (_ = new Hu(E)),
        (U = new Wu(E)),
        (q = new tc(I)),
        ($t = new Fu(I, q)),
        (j = new qu(I, q, Zt, $t)),
        (k = new Zu(I, j, q, Zt)),
        (Tt = new Ku(I, Nt, y)),
        (J = new zu(Mt)),
        (vt = new df(E, _, U, Ut, Nt, $t, J)),
        (st = new zf(E, Mt)),
        (ht = new mf()),
        (Bt = new Sf(Ut)),
        (Et = new Nu(E, _, U, St, k, m, l)),
        (ut = new Af(E, k, Nt)),
        (w = new Hf(I, Zt, Nt, St)),
        (dt = new Ou(I, Ut, Zt)),
        (Ft = new Yu(I, Ut, Zt)),
        (Zt.programs = vt.programs),
        (E.capabilities = Nt),
        (E.extensions = Ut),
        (E.properties = Mt),
        (E.renderLists = ht),
        (E.shadowMap = ut),
        (E.state = St),
        (E.info = Zt);
    }
    it();
    const V = new Of(E, I);
    (this.xr = V),
      (this.getContext = function () {
        return I;
      }),
      (this.getContextAttributes = function () {
        return I.getContextAttributes();
      }),
      (this.forceContextLoss = function () {
        const g = Ut.get("WEBGL_lose_context");
        g && g.loseContext();
      }),
      (this.forceContextRestore = function () {
        const g = Ut.get("WEBGL_lose_context");
        g && g.restoreContext();
      }),
      (this.getPixelRatio = function () {
        return z;
      }),
      (this.setPixelRatio = function (g) {
        g !== void 0 && ((z = g), this.setSize(X, Z, !1));
      }),
      (this.getSize = function (g) {
        return g.set(X, Z);
      }),
      (this.setSize = function (g, P, N = !0) {
        if (V.isPresenting) {
          console.warn(
            "THREE.WebGLRenderer: Can't change size while VR device is presenting."
          );
          return;
        }
        (X = g),
          (Z = P),
          (e.width = Math.floor(g * z)),
          (e.height = Math.floor(P * z)),
          N === !0 && ((e.style.width = g + "px"), (e.style.height = P + "px")),
          this.setViewport(0, 0, g, P);
      }),
      (this.getDrawingBufferSize = function (g) {
        return g.set(X * z, Z * z).floor();
      }),
      (this.setDrawingBufferSize = function (g, P, N) {
        (X = g),
          (Z = P),
          (z = N),
          (e.width = Math.floor(g * N)),
          (e.height = Math.floor(P * N)),
          this.setViewport(0, 0, g, P);
      }),
      (this.getCurrentViewport = function (g) {
        return g.copy(R);
      }),
      (this.getViewport = function (g) {
        return g.copy(_t);
      }),
      (this.setViewport = function (g, P, N, F) {
        g.isVector4 ? _t.set(g.x, g.y, g.z, g.w) : _t.set(g, P, N, F),
          St.viewport(R.copy(_t).multiplyScalar(z).round());
      }),
      (this.getScissor = function (g) {
        return g.copy(Rt);
      }),
      (this.setScissor = function (g, P, N, F) {
        g.isVector4 ? Rt.set(g.x, g.y, g.z, g.w) : Rt.set(g, P, N, F),
          St.scissor(G.copy(Rt).multiplyScalar(z).round());
      }),
      (this.getScissorTest = function () {
        return Vt;
      }),
      (this.setScissorTest = function (g) {
        St.setScissorTest((Vt = g));
      }),
      (this.setOpaqueSort = function (g) {
        et = g;
      }),
      (this.setTransparentSort = function (g) {
        ct = g;
      }),
      (this.getClearColor = function (g) {
        return g.copy(Et.getClearColor());
      }),
      (this.setClearColor = function () {
        Et.setClearColor.apply(Et, arguments);
      }),
      (this.getClearAlpha = function () {
        return Et.getClearAlpha();
      }),
      (this.setClearAlpha = function () {
        Et.setClearAlpha.apply(Et, arguments);
      }),
      (this.clear = function (g = !0, P = !0, N = !0) {
        let F = 0;
        if (g) {
          let L = !1;
          if (D !== null) {
            const Q = D.texture.format;
            L = Q === Cs || Q === ws || Q === Rs;
          }
          if (L) {
            const Q = D.texture.type,
              ot =
                Q === je ||
                Q === Rn ||
                Q === fi ||
                Q === Jn ||
                Q === bs ||
                Q === As,
              ft = Et.getClearColor(),
              pt = Et.getClearAlpha(),
              bt = ft.r,
              Ct = ft.g,
              mt = ft.b;
            ot
              ? ((v[0] = bt),
                (v[1] = Ct),
                (v[2] = mt),
                (v[3] = pt),
                I.clearBufferuiv(I.COLOR, 0, v))
              : ((M[0] = bt),
                (M[1] = Ct),
                (M[2] = mt),
                (M[3] = pt),
                I.clearBufferiv(I.COLOR, 0, M));
          } else F |= I.COLOR_BUFFER_BIT;
        }
        P && (F |= I.DEPTH_BUFFER_BIT),
          N &&
            ((F |= I.STENCIL_BUFFER_BIT),
            this.state.buffers.stencil.setMask(4294967295)),
          I.clear(F);
      }),
      (this.clearColor = function () {
        this.clear(!0, !1, !1);
      }),
      (this.clearDepth = function () {
        this.clear(!1, !0, !1);
      }),
      (this.clearStencil = function () {
        this.clear(!1, !1, !0);
      }),
      (this.dispose = function () {
        e.removeEventListener("webglcontextlost", Y, !1),
          e.removeEventListener("webglcontextrestored", lt, !1),
          e.removeEventListener("webglcontextcreationerror", at, !1),
          ht.dispose(),
          Bt.dispose(),
          Mt.dispose(),
          _.dispose(),
          U.dispose(),
          k.dispose(),
          $t.dispose(),
          w.dispose(),
          vt.dispose(),
          V.dispose(),
          V.removeEventListener("sessionstart", Ds),
          V.removeEventListener("sessionend", Us),
          fn.stop();
      });
    function Y(g) {
      g.preventDefault(),
        console.log("THREE.WebGLRenderer: Context Lost."),
        (O = !0);
    }
    function lt() {
      console.log("THREE.WebGLRenderer: Context Restored."), (O = !1);
      const g = Zt.autoReset,
        P = ut.enabled,
        N = ut.autoUpdate,
        F = ut.needsUpdate,
        L = ut.type;
      it(),
        (Zt.autoReset = g),
        (ut.enabled = P),
        (ut.autoUpdate = N),
        (ut.needsUpdate = F),
        (ut.type = L);
    }
    function at(g) {
      console.error(
        "THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",
        g.statusMessage
      );
    }
    function wt(g) {
      const P = g.target;
      P.removeEventListener("dispose", wt), te(P);
    }
    function te(g) {
      le(g), Mt.remove(g);
    }
    function le(g) {
      const P = Mt.get(g).programs;
      P !== void 0 &&
        (P.forEach(function (N) {
          vt.releaseProgram(N);
        }),
        g.isShaderMaterial && vt.releaseShaderCache(g));
    }
    this.renderBufferDirect = function (g, P, N, F, L, Q) {
      P === null && (P = Qt);
      const ot = L.isMesh && L.matrixWorld.determinant() < 0,
        ft = bo(g, P, N, F, L);
      St.setMaterial(F, ot);
      let pt = N.index,
        bt = 1;
      if (F.wireframe === !0) {
        if (((pt = j.getWireframeAttribute(N)), pt === void 0)) return;
        bt = 2;
      }
      const Ct = N.drawRange,
        mt = N.attributes.position;
      let Ht = Ct.start * bt,
        Kt = (Ct.start + Ct.count) * bt;
      Q !== null &&
        ((Ht = Math.max(Ht, Q.start * bt)),
        (Kt = Math.min(Kt, (Q.start + Q.count) * bt))),
        pt !== null
          ? ((Ht = Math.max(Ht, 0)), (Kt = Math.min(Kt, pt.count)))
          : mt != null &&
            ((Ht = Math.max(Ht, 0)), (Kt = Math.min(Kt, mt.count)));
      const jt = Kt - Ht;
      if (jt < 0 || jt === 1 / 0) return;
      $t.setup(L, F, ft, N, pt);
      let de,
        Gt = dt;
      if (
        (pt !== null && ((de = q.get(pt)), (Gt = Ft), Gt.setIndex(de)),
        L.isMesh)
      )
        F.wireframe === !0
          ? (St.setLineWidth(F.wireframeLinewidth * ee()), Gt.setMode(I.LINES))
          : Gt.setMode(I.TRIANGLES);
      else if (L.isLine) {
        let xt = F.linewidth;
        xt === void 0 && (xt = 1),
          St.setLineWidth(xt * ee()),
          L.isLineSegments
            ? Gt.setMode(I.LINES)
            : L.isLineLoop
            ? Gt.setMode(I.LINE_LOOP)
            : Gt.setMode(I.LINE_STRIP);
      } else
        L.isPoints
          ? Gt.setMode(I.POINTS)
          : L.isSprite && Gt.setMode(I.TRIANGLES);
      if (L.isBatchedMesh)
        if (L._multiDrawInstances !== null)
          Gt.renderMultiDrawInstances(
            L._multiDrawStarts,
            L._multiDrawCounts,
            L._multiDrawCount,
            L._multiDrawInstances
          );
        else if (Ut.get("WEBGL_multi_draw"))
          Gt.renderMultiDraw(
            L._multiDrawStarts,
            L._multiDrawCounts,
            L._multiDrawCount
          );
        else {
          const xt = L._multiDrawStarts,
            He = L._multiDrawCounts,
            kt = L._multiDrawCount,
            Re = pt ? q.get(pt).bytesPerElement : 1,
            Pn = Mt.get(F).currentProgram.getUniforms();
          for (let ge = 0; ge < kt; ge++)
            Pn.setValue(I, "_gl_DrawID", ge), Gt.render(xt[ge] / Re, He[ge]);
        }
      else if (L.isInstancedMesh) Gt.renderInstances(Ht, jt, L.count);
      else if (N.isInstancedBufferGeometry) {
        const xt = N._maxInstanceCount !== void 0 ? N._maxInstanceCount : 1 / 0,
          He = Math.min(N.instanceCount, xt);
        Gt.renderInstances(Ht, jt, He);
      } else Gt.render(Ht, jt);
    };
    function Wt(g, P, N) {
      g.transparent === !0 && g.side === Ye && g.forceSinglePass === !1
        ? ((g.side = me),
          (g.needsUpdate = !0),
          Si(g, P, N),
          (g.side = un),
          (g.needsUpdate = !0),
          Si(g, P, N),
          (g.side = Ye))
        : Si(g, P, N);
    }
    (this.compile = function (g, P, N = null) {
      N === null && (N = g),
        (h = Bt.get(N)),
        h.init(P),
        T.push(h),
        N.traverseVisible(function (L) {
          L.isLight &&
            L.layers.test(P.layers) &&
            (h.pushLight(L), L.castShadow && h.pushShadow(L));
        }),
        g !== N &&
          g.traverseVisible(function (L) {
            L.isLight &&
              L.layers.test(P.layers) &&
              (h.pushLight(L), L.castShadow && h.pushShadow(L));
          }),
        h.setupLights();
      const F = new Set();
      return (
        g.traverse(function (L) {
          if (!(L.isMesh || L.isPoints || L.isLine || L.isSprite)) return;
          const Q = L.material;
          if (Q)
            if (Array.isArray(Q))
              for (let ot = 0; ot < Q.length; ot++) {
                const ft = Q[ot];
                Wt(ft, N, L), F.add(ft);
              }
            else Wt(Q, N, L), F.add(Q);
        }),
        T.pop(),
        (h = null),
        F
      );
    }),
      (this.compileAsync = function (g, P, N = null) {
        const F = this.compile(g, P, N);
        return new Promise((L) => {
          function Q() {
            if (
              (F.forEach(function (ot) {
                Mt.get(ot).currentProgram.isReady() && F.delete(ot);
              }),
              F.size === 0)
            ) {
              L(g);
              return;
            }
            setTimeout(Q, 10);
          }
          Ut.get("KHR_parallel_shader_compile") !== null
            ? Q()
            : setTimeout(Q, 10);
        });
      });
    let Ae = null;
    function ze(g) {
      Ae && Ae(g);
    }
    function Ds() {
      fn.stop();
    }
    function Us() {
      fn.start();
    }
    const fn = new go();
    fn.setAnimationLoop(ze),
      typeof self < "u" && fn.setContext(self),
      (this.setAnimationLoop = function (g) {
        (Ae = g), V.setAnimationLoop(g), g === null ? fn.stop() : fn.start();
      }),
      V.addEventListener("sessionstart", Ds),
      V.addEventListener("sessionend", Us),
      (this.render = function (g, P) {
        if (P !== void 0 && P.isCamera !== !0) {
          console.error(
            "THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera."
          );
          return;
        }
        if (O === !0) return;
        if (
          (g.matrixWorldAutoUpdate === !0 && g.updateMatrixWorld(),
          P.parent === null &&
            P.matrixWorldAutoUpdate === !0 &&
            P.updateMatrixWorld(),
          V.enabled === !0 &&
            V.isPresenting === !0 &&
            (V.cameraAutoUpdate === !0 && V.updateCamera(P),
            (P = V.getCamera())),
          g.isScene === !0 && g.onBeforeRender(E, g, P, D),
          (h = Bt.get(g, T.length)),
          h.init(P),
          T.push(h),
          yt.multiplyMatrices(P.projectionMatrix, P.matrixWorldInverse),
          W.setFromProjectionMatrix(yt),
          (gt = this.localClippingEnabled),
          (tt = J.init(this.clippingPlanes, gt)),
          (p = ht.get(g, b.length)),
          p.init(),
          b.push(p),
          V.enabled === !0 && V.isPresenting === !0)
        ) {
          const Q = E.xr.getDepthSensingMesh();
          Q !== null && rr(Q, P, -1 / 0, E.sortObjects);
        }
        rr(g, P, 0, E.sortObjects),
          p.finish(),
          E.sortObjects === !0 && p.sort(et, ct),
          (Ot =
            V.enabled === !1 ||
            V.isPresenting === !1 ||
            V.hasDepthSensing() === !1),
          Ot && Et.addToRenderList(p, g),
          this.info.render.frame++,
          tt === !0 && J.beginShadows();
        const N = h.state.shadowsArray;
        ut.render(N, g, P),
          tt === !0 && J.endShadows(),
          this.info.autoReset === !0 && this.info.reset();
        const F = p.opaque,
          L = p.transmissive;
        if ((h.setupLights(), P.isArrayCamera)) {
          const Q = P.cameras;
          if (L.length > 0)
            for (let ot = 0, ft = Q.length; ot < ft; ot++) {
              const pt = Q[ot];
              Fs(F, L, g, pt);
            }
          Ot && Et.render(g);
          for (let ot = 0, ft = Q.length; ot < ft; ot++) {
            const pt = Q[ot];
            Ns(p, g, pt, pt.viewport);
          }
        } else L.length > 0 && Fs(F, L, g, P), Ot && Et.render(g), Ns(p, g, P);
        D !== null &&
          (y.updateMultisampleRenderTarget(D), y.updateRenderTargetMipmap(D)),
          g.isScene === !0 && g.onAfterRender(E, g, P),
          $t.resetDefaultState(),
          (S = -1),
          (x = null),
          T.pop(),
          T.length > 0
            ? ((h = T[T.length - 1]),
              tt === !0 && J.setGlobalState(E.clippingPlanes, h.state.camera))
            : (h = null),
          b.pop(),
          b.length > 0 ? (p = b[b.length - 1]) : (p = null);
      });
    function rr(g, P, N, F) {
      if (g.visible === !1) return;
      if (g.layers.test(P.layers)) {
        if (g.isGroup) N = g.renderOrder;
        else if (g.isLOD) g.autoUpdate === !0 && g.update(P);
        else if (g.isLight) h.pushLight(g), g.castShadow && h.pushShadow(g);
        else if (g.isSprite) {
          if (!g.frustumCulled || W.intersectsSprite(g)) {
            F && Dt.setFromMatrixPosition(g.matrixWorld).applyMatrix4(yt);
            const ot = k.update(g),
              ft = g.material;
            ft.visible && p.push(g, ot, ft, N, Dt.z, null);
          }
        } else if (
          (g.isMesh || g.isLine || g.isPoints) &&
          (!g.frustumCulled || W.intersectsObject(g))
        ) {
          const ot = k.update(g),
            ft = g.material;
          if (
            (F &&
              (g.boundingSphere !== void 0
                ? (g.boundingSphere === null && g.computeBoundingSphere(),
                  Dt.copy(g.boundingSphere.center))
                : (ot.boundingSphere === null && ot.computeBoundingSphere(),
                  Dt.copy(ot.boundingSphere.center)),
              Dt.applyMatrix4(g.matrixWorld).applyMatrix4(yt)),
            Array.isArray(ft))
          ) {
            const pt = ot.groups;
            for (let bt = 0, Ct = pt.length; bt < Ct; bt++) {
              const mt = pt[bt],
                Ht = ft[mt.materialIndex];
              Ht && Ht.visible && p.push(g, ot, Ht, N, Dt.z, mt);
            }
          } else ft.visible && p.push(g, ot, ft, N, Dt.z, null);
        }
      }
      const Q = g.children;
      for (let ot = 0, ft = Q.length; ot < ft; ot++) rr(Q[ot], P, N, F);
    }
    function Ns(g, P, N, F) {
      const L = g.opaque,
        Q = g.transmissive,
        ot = g.transparent;
      h.setupLightsView(N),
        tt === !0 && J.setGlobalState(E.clippingPlanes, N),
        F && St.viewport(R.copy(F)),
        L.length > 0 && Mi(L, P, N),
        Q.length > 0 && Mi(Q, P, N),
        ot.length > 0 && Mi(ot, P, N),
        St.buffers.depth.setTest(!0),
        St.buffers.depth.setMask(!0),
        St.buffers.color.setMask(!0),
        St.setPolygonOffset(!1);
    }
    function Fs(g, P, N, F) {
      if ((N.isScene === !0 ? N.overrideMaterial : null) !== null) return;
      h.state.transmissionRenderTarget[F.id] === void 0 &&
        (h.state.transmissionRenderTarget[F.id] = new wn(1, 1, {
          generateMipmaps: !0,
          type:
            Ut.has("EXT_color_buffer_half_float") ||
            Ut.has("EXT_color_buffer_float")
              ? pi
              : je,
          minFilter: bn,
          samples: 4,
          stencilBuffer: s,
          resolveDepthBuffer: !1,
          resolveStencilBuffer: !1,
          colorSpace: zt.workingColorSpace,
        }));
      const Q = h.state.transmissionRenderTarget[F.id],
        ot = F.viewport || R;
      Q.setSize(ot.z, ot.w);
      const ft = E.getRenderTarget();
      E.setRenderTarget(Q),
        E.getClearColor($),
        (K = E.getClearAlpha()),
        K < 1 && E.setClearColor(16777215, 0.5),
        E.clear(),
        Ot && Et.render(N);
      const pt = E.toneMapping;
      E.toneMapping = hn;
      const bt = F.viewport;
      if (
        (F.viewport !== void 0 && (F.viewport = void 0),
        h.setupLightsView(F),
        tt === !0 && J.setGlobalState(E.clippingPlanes, F),
        Mi(g, N, F),
        y.updateMultisampleRenderTarget(Q),
        y.updateRenderTargetMipmap(Q),
        Ut.has("WEBGL_multisampled_render_to_texture") === !1)
      ) {
        let Ct = !1;
        for (let mt = 0, Ht = P.length; mt < Ht; mt++) {
          const Kt = P[mt],
            jt = Kt.object,
            de = Kt.geometry,
            Gt = Kt.material,
            xt = Kt.group;
          if (Gt.side === Ye && jt.layers.test(F.layers)) {
            const He = Gt.side;
            (Gt.side = me),
              (Gt.needsUpdate = !0),
              Os(jt, N, F, de, Gt, xt),
              (Gt.side = He),
              (Gt.needsUpdate = !0),
              (Ct = !0);
          }
        }
        Ct === !0 &&
          (y.updateMultisampleRenderTarget(Q), y.updateRenderTargetMipmap(Q));
      }
      E.setRenderTarget(ft),
        E.setClearColor($, K),
        bt !== void 0 && (F.viewport = bt),
        (E.toneMapping = pt);
    }
    function Mi(g, P, N) {
      const F = P.isScene === !0 ? P.overrideMaterial : null;
      for (let L = 0, Q = g.length; L < Q; L++) {
        const ot = g[L],
          ft = ot.object,
          pt = ot.geometry,
          bt = F === null ? ot.material : F,
          Ct = ot.group;
        ft.layers.test(N.layers) && Os(ft, P, N, pt, bt, Ct);
      }
    }
    function Os(g, P, N, F, L, Q) {
      g.onBeforeRender(E, P, N, F, L, Q),
        g.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse, g.matrixWorld),
        g.normalMatrix.getNormalMatrix(g.modelViewMatrix),
        L.onBeforeRender(E, P, N, F, g, Q),
        L.transparent === !0 && L.side === Ye && L.forceSinglePass === !1
          ? ((L.side = me),
            (L.needsUpdate = !0),
            E.renderBufferDirect(N, P, F, L, g, Q),
            (L.side = un),
            (L.needsUpdate = !0),
            E.renderBufferDirect(N, P, F, L, g, Q),
            (L.side = Ye))
          : E.renderBufferDirect(N, P, F, L, g, Q),
        g.onAfterRender(E, P, N, F, L, Q);
    }
    function Si(g, P, N) {
      P.isScene !== !0 && (P = Qt);
      const F = Mt.get(g),
        L = h.state.lights,
        Q = h.state.shadowsArray,
        ot = L.state.version,
        ft = vt.getParameters(g, L.state, Q, P, N),
        pt = vt.getProgramCacheKey(ft);
      let bt = F.programs;
      (F.environment = g.isMeshStandardMaterial ? P.environment : null),
        (F.fog = P.fog),
        (F.envMap = (g.isMeshStandardMaterial ? U : _).get(
          g.envMap || F.environment
        )),
        (F.envMapRotation =
          F.environment !== null && g.envMap === null
            ? P.environmentRotation
            : g.envMapRotation),
        bt === void 0 &&
          (g.addEventListener("dispose", wt),
          (bt = new Map()),
          (F.programs = bt));
      let Ct = bt.get(pt);
      if (Ct !== void 0) {
        if (F.currentProgram === Ct && F.lightsStateVersion === ot)
          return zs(g, ft), Ct;
      } else
        (ft.uniforms = vt.getUniforms(g)),
          g.onBeforeCompile(ft, E),
          (Ct = vt.acquireProgram(ft, pt)),
          bt.set(pt, Ct),
          (F.uniforms = ft.uniforms);
      const mt = F.uniforms;
      return (
        ((!g.isShaderMaterial && !g.isRawShaderMaterial) ||
          g.clipping === !0) &&
          (mt.clippingPlanes = J.uniform),
        zs(g, ft),
        (F.needsLights = Ro(g)),
        (F.lightsStateVersion = ot),
        F.needsLights &&
          ((mt.ambientLightColor.value = L.state.ambient),
          (mt.lightProbe.value = L.state.probe),
          (mt.directionalLights.value = L.state.directional),
          (mt.directionalLightShadows.value = L.state.directionalShadow),
          (mt.spotLights.value = L.state.spot),
          (mt.spotLightShadows.value = L.state.spotShadow),
          (mt.rectAreaLights.value = L.state.rectArea),
          (mt.ltc_1.value = L.state.rectAreaLTC1),
          (mt.ltc_2.value = L.state.rectAreaLTC2),
          (mt.pointLights.value = L.state.point),
          (mt.pointLightShadows.value = L.state.pointShadow),
          (mt.hemisphereLights.value = L.state.hemi),
          (mt.directionalShadowMap.value = L.state.directionalShadowMap),
          (mt.directionalShadowMatrix.value = L.state.directionalShadowMatrix),
          (mt.spotShadowMap.value = L.state.spotShadowMap),
          (mt.spotLightMatrix.value = L.state.spotLightMatrix),
          (mt.spotLightMap.value = L.state.spotLightMap),
          (mt.pointShadowMap.value = L.state.pointShadowMap),
          (mt.pointShadowMatrix.value = L.state.pointShadowMatrix)),
        (F.currentProgram = Ct),
        (F.uniformsList = null),
        Ct
      );
    }
    function Bs(g) {
      if (g.uniformsList === null) {
        const P = g.currentProgram.getUniforms();
        g.uniformsList = Ki.seqWithValue(P.seq, g.uniforms);
      }
      return g.uniformsList;
    }
    function zs(g, P) {
      const N = Mt.get(g);
      (N.outputColorSpace = P.outputColorSpace),
        (N.batching = P.batching),
        (N.batchingColor = P.batchingColor),
        (N.instancing = P.instancing),
        (N.instancingColor = P.instancingColor),
        (N.instancingMorph = P.instancingMorph),
        (N.skinning = P.skinning),
        (N.morphTargets = P.morphTargets),
        (N.morphNormals = P.morphNormals),
        (N.morphColors = P.morphColors),
        (N.morphTargetsCount = P.morphTargetsCount),
        (N.numClippingPlanes = P.numClippingPlanes),
        (N.numIntersection = P.numClipIntersection),
        (N.vertexAlphas = P.vertexAlphas),
        (N.vertexTangents = P.vertexTangents),
        (N.toneMapping = P.toneMapping);
    }
    function bo(g, P, N, F, L) {
      P.isScene !== !0 && (P = Qt), y.resetTextureUnits();
      const Q = P.fog,
        ot = F.isMeshStandardMaterial ? P.environment : null,
        ft =
          D === null
            ? E.outputColorSpace
            : D.isXRRenderTarget === !0
            ? D.texture.colorSpace
            : ei,
        pt = (F.isMeshStandardMaterial ? U : _).get(F.envMap || ot),
        bt =
          F.vertexColors === !0 &&
          !!N.attributes.color &&
          N.attributes.color.itemSize === 4,
        Ct = !!N.attributes.tangent && (!!F.normalMap || F.anisotropy > 0),
        mt = !!N.morphAttributes.position,
        Ht = !!N.morphAttributes.normal,
        Kt = !!N.morphAttributes.color;
      let jt = hn;
      F.toneMapped &&
        (D === null || D.isXRRenderTarget === !0) &&
        (jt = E.toneMapping);
      const de =
          N.morphAttributes.position ||
          N.morphAttributes.normal ||
          N.morphAttributes.color,
        Gt = de !== void 0 ? de.length : 0,
        xt = Mt.get(F),
        He = h.state.lights;
      if (tt === !0 && (gt === !0 || g !== x)) {
        const Ee = g === x && F.id === S;
        J.setState(F, g, Ee);
      }
      let kt = !1;
      F.version === xt.__version
        ? ((xt.needsLights && xt.lightsStateVersion !== He.state.version) ||
            xt.outputColorSpace !== ft ||
            (L.isBatchedMesh && xt.batching === !1) ||
            (!L.isBatchedMesh && xt.batching === !0) ||
            (L.isBatchedMesh &&
              xt.batchingColor === !0 &&
              L.colorTexture === null) ||
            (L.isBatchedMesh &&
              xt.batchingColor === !1 &&
              L.colorTexture !== null) ||
            (L.isInstancedMesh && xt.instancing === !1) ||
            (!L.isInstancedMesh && xt.instancing === !0) ||
            (L.isSkinnedMesh && xt.skinning === !1) ||
            (!L.isSkinnedMesh && xt.skinning === !0) ||
            (L.isInstancedMesh &&
              xt.instancingColor === !0 &&
              L.instanceColor === null) ||
            (L.isInstancedMesh &&
              xt.instancingColor === !1 &&
              L.instanceColor !== null) ||
            (L.isInstancedMesh &&
              xt.instancingMorph === !0 &&
              L.morphTexture === null) ||
            (L.isInstancedMesh &&
              xt.instancingMorph === !1 &&
              L.morphTexture !== null) ||
            xt.envMap !== pt ||
            (F.fog === !0 && xt.fog !== Q) ||
            (xt.numClippingPlanes !== void 0 &&
              (xt.numClippingPlanes !== J.numPlanes ||
                xt.numIntersection !== J.numIntersection)) ||
            xt.vertexAlphas !== bt ||
            xt.vertexTangents !== Ct ||
            xt.morphTargets !== mt ||
            xt.morphNormals !== Ht ||
            xt.morphColors !== Kt ||
            xt.toneMapping !== jt ||
            xt.morphTargetsCount !== Gt) &&
          (kt = !0)
        : ((kt = !0), (xt.__version = F.version));
      let Re = xt.currentProgram;
      kt === !0 && (Re = Si(F, P, L));
      let Pn = !1,
        ge = !1,
        ri = !1;
      const Jt = Re.getUniforms(),
        Ue = xt.uniforms;
      if (
        (St.useProgram(Re.program) && ((Pn = !0), (ge = !0), (ri = !0)),
        F.id !== S && ((S = F.id), (ge = !0)),
        Pn || x !== g)
      ) {
        St.buffers.depth.getReversed()
          ? (rt.copy(g.projectionMatrix),
            wl(rt),
            Cl(rt),
            Jt.setValue(I, "projectionMatrix", rt))
          : Jt.setValue(I, "projectionMatrix", g.projectionMatrix),
          Jt.setValue(I, "viewMatrix", g.matrixWorldInverse);
        const Qe = Jt.map.cameraPosition;
        Qe !== void 0 &&
          Qe.setValue(I, At.setFromMatrixPosition(g.matrixWorld)),
          Nt.logarithmicDepthBuffer &&
            Jt.setValue(
              I,
              "logDepthBufFC",
              2 / (Math.log(g.far + 1) / Math.LN2)
            ),
          (F.isMeshPhongMaterial ||
            F.isMeshToonMaterial ||
            F.isMeshLambertMaterial ||
            F.isMeshBasicMaterial ||
            F.isMeshStandardMaterial ||
            F.isShaderMaterial) &&
            Jt.setValue(I, "isOrthographic", g.isOrthographicCamera === !0),
          x !== g && ((x = g), (ge = !0), (ri = !0));
      }
      if (L.isSkinnedMesh) {
        Jt.setOptional(I, L, "bindMatrix"),
          Jt.setOptional(I, L, "bindMatrixInverse");
        const Ee = L.skeleton;
        Ee &&
          (Ee.boneTexture === null && Ee.computeBoneTexture(),
          Jt.setValue(I, "boneTexture", Ee.boneTexture, y));
      }
      L.isBatchedMesh &&
        (Jt.setOptional(I, L, "batchingTexture"),
        Jt.setValue(I, "batchingTexture", L._matricesTexture, y),
        Jt.setOptional(I, L, "batchingIdTexture"),
        Jt.setValue(I, "batchingIdTexture", L._indirectTexture, y),
        Jt.setOptional(I, L, "batchingColorTexture"),
        L._colorsTexture !== null &&
          Jt.setValue(I, "batchingColorTexture", L._colorsTexture, y));
      const si = N.morphAttributes;
      if (
        ((si.position !== void 0 ||
          si.normal !== void 0 ||
          si.color !== void 0) &&
          Tt.update(L, N, Re),
        (ge || xt.receiveShadow !== L.receiveShadow) &&
          ((xt.receiveShadow = L.receiveShadow),
          Jt.setValue(I, "receiveShadow", L.receiveShadow)),
        F.isMeshGouraudMaterial &&
          F.envMap !== null &&
          ((Ue.envMap.value = pt),
          (Ue.flipEnvMap.value =
            pt.isCubeTexture && pt.isRenderTargetTexture === !1 ? -1 : 1)),
        F.isMeshStandardMaterial &&
          F.envMap === null &&
          P.environment !== null &&
          (Ue.envMapIntensity.value = P.environmentIntensity),
        ge &&
          (Jt.setValue(I, "toneMappingExposure", E.toneMappingExposure),
          xt.needsLights && Ao(Ue, ri),
          Q && F.fog === !0 && st.refreshFogUniforms(Ue, Q),
          st.refreshMaterialUniforms(
            Ue,
            F,
            z,
            Z,
            h.state.transmissionRenderTarget[g.id]
          ),
          Ki.upload(I, Bs(xt), Ue, y)),
        F.isShaderMaterial &&
          F.uniformsNeedUpdate === !0 &&
          (Ki.upload(I, Bs(xt), Ue, y), (F.uniformsNeedUpdate = !1)),
        F.isSpriteMaterial && Jt.setValue(I, "center", L.center),
        Jt.setValue(I, "modelViewMatrix", L.modelViewMatrix),
        Jt.setValue(I, "normalMatrix", L.normalMatrix),
        Jt.setValue(I, "modelMatrix", L.matrixWorld),
        F.isShaderMaterial || F.isRawShaderMaterial)
      ) {
        const Ee = F.uniformsGroups;
        for (let Qe = 0, tn = Ee.length; Qe < tn; Qe++) {
          const Hs = Ee[Qe];
          w.update(Hs, Re), w.bind(Hs, Re);
        }
      }
      return Re;
    }
    function Ao(g, P) {
      (g.ambientLightColor.needsUpdate = P),
        (g.lightProbe.needsUpdate = P),
        (g.directionalLights.needsUpdate = P),
        (g.directionalLightShadows.needsUpdate = P),
        (g.pointLights.needsUpdate = P),
        (g.pointLightShadows.needsUpdate = P),
        (g.spotLights.needsUpdate = P),
        (g.spotLightShadows.needsUpdate = P),
        (g.rectAreaLights.needsUpdate = P),
        (g.hemisphereLights.needsUpdate = P);
    }
    function Ro(g) {
      return (
        g.isMeshLambertMaterial ||
        g.isMeshToonMaterial ||
        g.isMeshPhongMaterial ||
        g.isMeshStandardMaterial ||
        g.isShadowMaterial ||
        (g.isShaderMaterial && g.lights === !0)
      );
    }
    (this.getActiveCubeFace = function () {
      return C;
    }),
      (this.getActiveMipmapLevel = function () {
        return A;
      }),
      (this.getRenderTarget = function () {
        return D;
      }),
      (this.setRenderTargetTextures = function (g, P, N) {
        (Mt.get(g.texture).__webglTexture = P),
          (Mt.get(g.depthTexture).__webglTexture = N);
        const F = Mt.get(g);
        (F.__hasExternalTextures = !0),
          (F.__autoAllocateDepthBuffer = N === void 0),
          F.__autoAllocateDepthBuffer ||
            (Ut.has("WEBGL_multisampled_render_to_texture") === !0 &&
              (console.warn(
                "THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"
              ),
              (F.__useRenderToTexture = !1)));
      }),
      (this.setRenderTargetFramebuffer = function (g, P) {
        const N = Mt.get(g);
        (N.__webglFramebuffer = P), (N.__useDefaultFramebuffer = P === void 0);
      }),
      (this.setRenderTarget = function (g, P = 0, N = 0) {
        (D = g), (C = P), (A = N);
        let F = !0,
          L = null,
          Q = !1,
          ot = !1;
        if (g) {
          const pt = Mt.get(g);
          if (pt.__useDefaultFramebuffer !== void 0)
            St.bindFramebuffer(I.FRAMEBUFFER, null), (F = !1);
          else if (pt.__webglFramebuffer === void 0) y.setupRenderTarget(g);
          else if (pt.__hasExternalTextures)
            y.rebindTextures(
              g,
              Mt.get(g.texture).__webglTexture,
              Mt.get(g.depthTexture).__webglTexture
            );
          else if (g.depthBuffer) {
            const mt = g.depthTexture;
            if (pt.__boundDepthTexture !== mt) {
              if (
                mt !== null &&
                Mt.has(mt) &&
                (g.width !== mt.image.width || g.height !== mt.image.height)
              )
                throw new Error(
                  "WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size."
                );
              y.setupDepthRenderbuffer(g);
            }
          }
          const bt = g.texture;
          (bt.isData3DTexture ||
            bt.isDataArrayTexture ||
            bt.isCompressedArrayTexture) &&
            (ot = !0);
          const Ct = Mt.get(g).__webglFramebuffer;
          g.isWebGLCubeRenderTarget
            ? (Array.isArray(Ct[P]) ? (L = Ct[P][N]) : (L = Ct[P]), (Q = !0))
            : g.samples > 0 && y.useMultisampledRTT(g) === !1
            ? (L = Mt.get(g).__webglMultisampledFramebuffer)
            : Array.isArray(Ct)
            ? (L = Ct[N])
            : (L = Ct),
            R.copy(g.viewport),
            G.copy(g.scissor),
            (H = g.scissorTest);
        } else
          R.copy(_t).multiplyScalar(z).floor(),
            G.copy(Rt).multiplyScalar(z).floor(),
            (H = Vt);
        if (
          (St.bindFramebuffer(I.FRAMEBUFFER, L) && F && St.drawBuffers(g, L),
          St.viewport(R),
          St.scissor(G),
          St.setScissorTest(H),
          Q)
        ) {
          const pt = Mt.get(g.texture);
          I.framebufferTexture2D(
            I.FRAMEBUFFER,
            I.COLOR_ATTACHMENT0,
            I.TEXTURE_CUBE_MAP_POSITIVE_X + P,
            pt.__webglTexture,
            N
          );
        } else if (ot) {
          const pt = Mt.get(g.texture),
            bt = P || 0;
          I.framebufferTextureLayer(
            I.FRAMEBUFFER,
            I.COLOR_ATTACHMENT0,
            pt.__webglTexture,
            N || 0,
            bt
          );
        }
        S = -1;
      }),
      (this.readRenderTargetPixels = function (g, P, N, F, L, Q, ot) {
        if (!(g && g.isWebGLRenderTarget)) {
          console.error(
            "THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget."
          );
          return;
        }
        let ft = Mt.get(g).__webglFramebuffer;
        if ((g.isWebGLCubeRenderTarget && ot !== void 0 && (ft = ft[ot]), ft)) {
          St.bindFramebuffer(I.FRAMEBUFFER, ft);
          try {
            const pt = g.texture,
              bt = pt.format,
              Ct = pt.type;
            if (!Nt.textureFormatReadable(bt)) {
              console.error(
                "THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format."
              );
              return;
            }
            if (!Nt.textureTypeReadable(Ct)) {
              console.error(
                "THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type."
              );
              return;
            }
            P >= 0 &&
              P <= g.width - F &&
              N >= 0 &&
              N <= g.height - L &&
              I.readPixels(P, N, F, L, Lt.convert(bt), Lt.convert(Ct), Q);
          } finally {
            const pt = D !== null ? Mt.get(D).__webglFramebuffer : null;
            St.bindFramebuffer(I.FRAMEBUFFER, pt);
          }
        }
      }),
      (this.readRenderTargetPixelsAsync = async function (
        g,
        P,
        N,
        F,
        L,
        Q,
        ot
      ) {
        if (!(g && g.isWebGLRenderTarget))
          throw new Error(
            "THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget."
          );
        let ft = Mt.get(g).__webglFramebuffer;
        if ((g.isWebGLCubeRenderTarget && ot !== void 0 && (ft = ft[ot]), ft)) {
          const pt = g.texture,
            bt = pt.format,
            Ct = pt.type;
          if (!Nt.textureFormatReadable(bt))
            throw new Error(
              "THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format."
            );
          if (!Nt.textureTypeReadable(Ct))
            throw new Error(
              "THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type."
            );
          if (P >= 0 && P <= g.width - F && N >= 0 && N <= g.height - L) {
            St.bindFramebuffer(I.FRAMEBUFFER, ft);
            const mt = I.createBuffer();
            I.bindBuffer(I.PIXEL_PACK_BUFFER, mt),
              I.bufferData(I.PIXEL_PACK_BUFFER, Q.byteLength, I.STREAM_READ),
              I.readPixels(P, N, F, L, Lt.convert(bt), Lt.convert(Ct), 0);
            const Ht = D !== null ? Mt.get(D).__webglFramebuffer : null;
            St.bindFramebuffer(I.FRAMEBUFFER, Ht);
            const Kt = I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE, 0);
            return (
              I.flush(),
              await Rl(I, Kt, 4),
              I.bindBuffer(I.PIXEL_PACK_BUFFER, mt),
              I.getBufferSubData(I.PIXEL_PACK_BUFFER, 0, Q),
              I.deleteBuffer(mt),
              I.deleteSync(Kt),
              Q
            );
          } else
            throw new Error(
              "THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range."
            );
        }
      }),
      (this.copyFramebufferToTexture = function (g, P = null, N = 0) {
        g.isTexture !== !0 &&
          (ui(
            "WebGLRenderer: copyFramebufferToTexture function signature has changed."
          ),
          (P = arguments[0] || null),
          (g = arguments[1]));
        const F = Math.pow(2, -N),
          L = Math.floor(g.image.width * F),
          Q = Math.floor(g.image.height * F),
          ot = P !== null ? P.x : 0,
          ft = P !== null ? P.y : 0;
        y.setTexture2D(g, 0),
          I.copyTexSubImage2D(I.TEXTURE_2D, N, 0, 0, ot, ft, L, Q),
          St.unbindTexture();
      }),
      (this.copyTextureToTexture = function (g, P, N = null, F = null, L = 0) {
        g.isTexture !== !0 &&
          (ui(
            "WebGLRenderer: copyTextureToTexture function signature has changed."
          ),
          (F = arguments[0] || null),
          (g = arguments[1]),
          (P = arguments[2]),
          (L = arguments[3] || 0),
          (N = null));
        let Q, ot, ft, pt, bt, Ct, mt, Ht, Kt;
        const jt = g.isCompressedTexture ? g.mipmaps[L] : g.image;
        N !== null
          ? ((Q = N.max.x - N.min.x),
            (ot = N.max.y - N.min.y),
            (ft = N.isBox3 ? N.max.z - N.min.z : 1),
            (pt = N.min.x),
            (bt = N.min.y),
            (Ct = N.isBox3 ? N.min.z : 0))
          : ((Q = jt.width),
            (ot = jt.height),
            (ft = jt.depth || 1),
            (pt = 0),
            (bt = 0),
            (Ct = 0)),
          F !== null
            ? ((mt = F.x), (Ht = F.y), (Kt = F.z))
            : ((mt = 0), (Ht = 0), (Kt = 0));
        const de = Lt.convert(P.format),
          Gt = Lt.convert(P.type);
        let xt;
        P.isData3DTexture
          ? (y.setTexture3D(P, 0), (xt = I.TEXTURE_3D))
          : P.isDataArrayTexture || P.isCompressedArrayTexture
          ? (y.setTexture2DArray(P, 0), (xt = I.TEXTURE_2D_ARRAY))
          : (y.setTexture2D(P, 0), (xt = I.TEXTURE_2D)),
          I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL, P.flipY),
          I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL, P.premultiplyAlpha),
          I.pixelStorei(I.UNPACK_ALIGNMENT, P.unpackAlignment);
        const He = I.getParameter(I.UNPACK_ROW_LENGTH),
          kt = I.getParameter(I.UNPACK_IMAGE_HEIGHT),
          Re = I.getParameter(I.UNPACK_SKIP_PIXELS),
          Pn = I.getParameter(I.UNPACK_SKIP_ROWS),
          ge = I.getParameter(I.UNPACK_SKIP_IMAGES);
        I.pixelStorei(I.UNPACK_ROW_LENGTH, jt.width),
          I.pixelStorei(I.UNPACK_IMAGE_HEIGHT, jt.height),
          I.pixelStorei(I.UNPACK_SKIP_PIXELS, pt),
          I.pixelStorei(I.UNPACK_SKIP_ROWS, bt),
          I.pixelStorei(I.UNPACK_SKIP_IMAGES, Ct);
        const ri = g.isDataArrayTexture || g.isData3DTexture,
          Jt = P.isDataArrayTexture || P.isData3DTexture;
        if (g.isRenderTargetTexture || g.isDepthTexture) {
          const Ue = Mt.get(g),
            si = Mt.get(P),
            Ee = Mt.get(Ue.__renderTarget),
            Qe = Mt.get(si.__renderTarget);
          St.bindFramebuffer(I.READ_FRAMEBUFFER, Ee.__webglFramebuffer),
            St.bindFramebuffer(I.DRAW_FRAMEBUFFER, Qe.__webglFramebuffer);
          for (let tn = 0; tn < ft; tn++)
            ri &&
              I.framebufferTextureLayer(
                I.READ_FRAMEBUFFER,
                I.COLOR_ATTACHMENT0,
                Mt.get(g).__webglTexture,
                L,
                Ct + tn
              ),
              g.isDepthTexture
                ? (Jt &&
                    I.framebufferTextureLayer(
                      I.DRAW_FRAMEBUFFER,
                      I.COLOR_ATTACHMENT0,
                      Mt.get(P).__webglTexture,
                      L,
                      Kt + tn
                    ),
                  I.blitFramebuffer(
                    pt,
                    bt,
                    Q,
                    ot,
                    mt,
                    Ht,
                    Q,
                    ot,
                    I.DEPTH_BUFFER_BIT,
                    I.NEAREST
                  ))
                : Jt
                ? I.copyTexSubImage3D(xt, L, mt, Ht, Kt + tn, pt, bt, Q, ot)
                : I.copyTexSubImage2D(xt, L, mt, Ht, Kt + tn, pt, bt, Q, ot);
          St.bindFramebuffer(I.READ_FRAMEBUFFER, null),
            St.bindFramebuffer(I.DRAW_FRAMEBUFFER, null);
        } else
          Jt
            ? g.isDataTexture || g.isData3DTexture
              ? I.texSubImage3D(xt, L, mt, Ht, Kt, Q, ot, ft, de, Gt, jt.data)
              : P.isCompressedArrayTexture
              ? I.compressedTexSubImage3D(
                  xt,
                  L,
                  mt,
                  Ht,
                  Kt,
                  Q,
                  ot,
                  ft,
                  de,
                  jt.data
                )
              : I.texSubImage3D(xt, L, mt, Ht, Kt, Q, ot, ft, de, Gt, jt)
            : g.isDataTexture
            ? I.texSubImage2D(I.TEXTURE_2D, L, mt, Ht, Q, ot, de, Gt, jt.data)
            : g.isCompressedTexture
            ? I.compressedTexSubImage2D(
                I.TEXTURE_2D,
                L,
                mt,
                Ht,
                jt.width,
                jt.height,
                de,
                jt.data
              )
            : I.texSubImage2D(I.TEXTURE_2D, L, mt, Ht, Q, ot, de, Gt, jt);
        I.pixelStorei(I.UNPACK_ROW_LENGTH, He),
          I.pixelStorei(I.UNPACK_IMAGE_HEIGHT, kt),
          I.pixelStorei(I.UNPACK_SKIP_PIXELS, Re),
          I.pixelStorei(I.UNPACK_SKIP_ROWS, Pn),
          I.pixelStorei(I.UNPACK_SKIP_IMAGES, ge),
          L === 0 && P.generateMipmaps && I.generateMipmap(xt),
          St.unbindTexture();
      }),
      (this.copyTextureToTexture3D = function (
        g,
        P,
        N = null,
        F = null,
        L = 0
      ) {
        return (
          g.isTexture !== !0 &&
            (ui(
              "WebGLRenderer: copyTextureToTexture3D function signature has changed."
            ),
            (N = arguments[0] || null),
            (F = arguments[1] || null),
            (g = arguments[2]),
            (P = arguments[3]),
            (L = arguments[4] || 0)),
          ui(
            'WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'
          ),
          this.copyTextureToTexture(g, P, N, F, L)
        );
      }),
      (this.initRenderTarget = function (g) {
        Mt.get(g).__webglFramebuffer === void 0 && y.setupRenderTarget(g);
      }),
      (this.initTexture = function (g) {
        g.isCubeTexture
          ? y.setTextureCube(g, 0)
          : g.isData3DTexture
          ? y.setTexture3D(g, 0)
          : g.isDataArrayTexture || g.isCompressedArrayTexture
          ? y.setTexture2DArray(g, 0)
          : y.setTexture2D(g, 0),
          St.unbindTexture();
      }),
      (this.resetState = function () {
        (C = 0), (A = 0), (D = null), St.reset(), $t.reset();
      }),
      typeof __THREE_DEVTOOLS__ < "u" &&
        __THREE_DEVTOOLS__.dispatchEvent(
          new CustomEvent("observe", { detail: this })
        );
  }
  get coordinateSystem() {
    return Ke;
  }
  get outputColorSpace() {
    return this._outputColorSpace;
  }
  set outputColorSpace(t) {
    this._outputColorSpace = t;
    const e = this.getContext();
    (e.drawingBufferColorspace = zt._getDrawingBufferColorSpace(t)),
      (e.unpackColorSpace = zt._getUnpackColorSpace());
  }
}
class Gf extends Me {
  constructor() {
    super(),
      (this.isScene = !0),
      (this.type = "Scene"),
      (this.background = null),
      (this.environment = null),
      (this.fog = null),
      (this.backgroundBlurriness = 0),
      (this.backgroundIntensity = 1),
      (this.backgroundRotation = new Je()),
      (this.environmentIntensity = 1),
      (this.environmentRotation = new Je()),
      (this.overrideMaterial = null),
      typeof __THREE_DEVTOOLS__ < "u" &&
        __THREE_DEVTOOLS__.dispatchEvent(
          new CustomEvent("observe", { detail: this })
        );
  }
  copy(t, e) {
    return (
      super.copy(t, e),
      t.background !== null && (this.background = t.background.clone()),
      t.environment !== null && (this.environment = t.environment.clone()),
      t.fog !== null && (this.fog = t.fog.clone()),
      (this.backgroundBlurriness = t.backgroundBlurriness),
      (this.backgroundIntensity = t.backgroundIntensity),
      this.backgroundRotation.copy(t.backgroundRotation),
      (this.environmentIntensity = t.environmentIntensity),
      this.environmentRotation.copy(t.environmentRotation),
      t.overrideMaterial !== null &&
        (this.overrideMaterial = t.overrideMaterial.clone()),
      (this.matrixAutoUpdate = t.matrixAutoUpdate),
      this
    );
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return (
      this.fog !== null && (e.object.fog = this.fog.toJSON()),
      this.backgroundBlurriness > 0 &&
        (e.object.backgroundBlurriness = this.backgroundBlurriness),
      this.backgroundIntensity !== 1 &&
        (e.object.backgroundIntensity = this.backgroundIntensity),
      (e.object.backgroundRotation = this.backgroundRotation.toArray()),
      this.environmentIntensity !== 1 &&
        (e.object.environmentIntensity = this.environmentIntensity),
      (e.object.environmentRotation = this.environmentRotation.toArray()),
      e
    );
  }
}
typeof __THREE_DEVTOOLS__ < "u" &&
  __THREE_DEVTOOLS__.dispatchEvent(
    new CustomEvent("register", { detail: { revision: ys } })
  );
typeof window < "u" &&
  (window.__THREE__
    ? console.warn("WARNING: Multiple instances of Three.js being imported.")
    : (window.__THREE__ = ys));
new Fo();
const yo = new Gf(),
  Ji = new be(75, window.innerWidth / window.innerHeight, 0.1, 1e3);
Ji.position.z = 5;
const ir = new Vf({ canvas: document.querySelector("#canvas"), antialias: !0 });
ir.setPixelRatio(Math.min(window.devicePixelRatio, 2));
ir.setSize(window.innerWidth, window.innerHeight);
const kf = new xi(2, 3),
  Wf = new Ls({ color: 65280 }),
  Xf = new Oe(kf, Wf);
yo.add(Xf);
function To() {
  requestAnimationFrame(To), ir.render(yo, Ji);
}
To();
window.addEventListener("resize", () => {
  (Ji.aspect = window.innerWidth / window.innerHeight),
    Ji.updateProjectionMatrix(),
    ir.setSize(window.innerWidth, window.innerHeight);
});
