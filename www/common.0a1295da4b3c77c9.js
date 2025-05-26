"use strict";
(self.webpackChunkpazzioli_front = self.webpackChunkpazzioli_front || []).push([
  [8592],
  {
    1320: (D, p, d) => {
      d.d(p, { c: () => l });
      var u = d(1308),
        g = d(7864),
        h = d(1898);
      const l = (r, o) => {
        let t, e;
        const s = (c, f, w) => {
            if (typeof document > "u") return;
            const E = document.elementFromPoint(c, f);
            E && o(E) ? E !== t && (a(), i(E, w)) : a();
          },
          i = (c, f) => {
            (t = c), e || (e = t);
            const w = t;
            (0, u.c)(() => w.classList.add("ion-activated")), f();
          },
          a = (c = !1) => {
            if (!t) return;
            const f = t;
            (0, u.c)(() => f.classList.remove("ion-activated")),
              c && e !== t && t.click(),
              (t = void 0);
          };
        return (0, h.createGesture)({
          el: r,
          gestureName: "buttonActiveDrag",
          threshold: 0,
          onStart: (c) => s(c.currentX, c.currentY, g.a),
          onMove: (c) => s(c.currentX, c.currentY, g.b),
          onEnd: () => {
            a(!0), (0, g.h)(), (e = void 0);
          },
        });
      };
    },
    2225: (D, p, d) => {
      d.d(p, { g: () => u });
      const u = (o, t, e, s, i) =>
          h(o[1], t[1], e[1], s[1], i).map((a) => g(o[0], t[0], e[0], s[0], a)),
        g = (o, t, e, s, i) =>
          i * (3 * t * Math.pow(i - 1, 2) + i * (-3 * e * i + 3 * e + s * i)) -
          o * Math.pow(i - 1, 3),
        h = (o, t, e, s, i) =>
          r(
            (s -= i) - 3 * (e -= i) + 3 * (t -= i) - (o -= i),
            3 * e - 6 * t + 3 * o,
            3 * t - 3 * o,
            o
          ).filter((c) => c >= 0 && c <= 1),
        r = (o, t, e, s) => {
          if (0 === o)
            return ((o, t, e) => {
              const s = t * t - 4 * o * e;
              return s < 0
                ? []
                : [
                    (-t + Math.sqrt(s)) / (2 * o),
                    (-t - Math.sqrt(s)) / (2 * o),
                  ];
            })(t, e, s);
          const i = (3 * (e /= o) - (t /= o) * t) / 3,
            a = (2 * t * t * t - 9 * t * e + 27 * (s /= o)) / 27;
          if (0 === i) return [Math.pow(-a, 1 / 3)];
          if (0 === a) return [Math.sqrt(-i), -Math.sqrt(-i)];
          const c = Math.pow(a / 2, 2) + Math.pow(i / 3, 3);
          if (0 === c) return [Math.pow(a / 2, 0.5) - t / 3];
          if (c > 0)
            return [
              Math.pow(-a / 2 + Math.sqrt(c), 1 / 3) -
                Math.pow(a / 2 + Math.sqrt(c), 1 / 3) -
                t / 3,
            ];
          const f = Math.sqrt(Math.pow(-i / 3, 3)),
            w = Math.acos(-a / (2 * Math.sqrt(Math.pow(-i / 3, 3)))),
            E = 2 * Math.pow(f, 1 / 3);
          return [
            E * Math.cos(w / 3) - t / 3,
            E * Math.cos((w + 2 * Math.PI) / 3) - t / 3,
            E * Math.cos((w + 4 * Math.PI) / 3) - t / 3,
          ];
        };
    },
    5062: (D, p, d) => {
      d.d(p, { i: () => u });
      const u = (g) =>
        g && "" !== g.dir
          ? "rtl" === g.dir.toLowerCase()
          : "rtl" === document?.dir.toLowerCase();
    },
    6602: (D, p, d) => {
      d.r(p), d.d(p, { startFocusVisible: () => l });
      const u = "ion-focused",
        h = [
          "Tab",
          "ArrowDown",
          "Space",
          "Escape",
          " ",
          "Shift",
          "Enter",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "Home",
          "End",
        ],
        l = (r) => {
          let o = [],
            t = !0;
          const e = r ? r.shadowRoot : document,
            s = r || document.body,
            i = (y) => {
              o.forEach((v) => v.classList.remove(u)),
                y.forEach((v) => v.classList.add(u)),
                (o = y);
            },
            a = () => {
              (t = !1), i([]);
            },
            c = (y) => {
              (t = h.includes(y.key)), t || i([]);
            },
            f = (y) => {
              if (t && void 0 !== y.composedPath) {
                const v = y
                  .composedPath()
                  .filter(
                    (m) =>
                      !!m.classList && m.classList.contains("ion-focusable")
                  );
                i(v);
              }
            },
            w = () => {
              e.activeElement === s && i([]);
            };
          return (
            e.addEventListener("keydown", c),
            e.addEventListener("focusin", f),
            e.addEventListener("focusout", w),
            e.addEventListener("touchstart", a),
            e.addEventListener("mousedown", a),
            {
              destroy: () => {
                e.removeEventListener("keydown", c),
                  e.removeEventListener("focusin", f),
                  e.removeEventListener("focusout", w),
                  e.removeEventListener("touchstart", a),
                  e.removeEventListener("mousedown", a);
              },
              setFocus: i,
            }
          );
        };
    },
    7626: (D, p, d) => {
      d.d(p, { C: () => r, a: () => h, d: () => l });
      var u = d(5861),
        g = d(5730);
      const h = (function () {
          var o = (0, u.Z)(function* (t, e, s, i, a, c) {
            var f;
            if (t) return t.attachViewToDom(e, s, a, i);
            if (!(c || "string" == typeof s || s instanceof HTMLElement))
              throw new Error("framework delegate is missing");
            const w =
              "string" == typeof s
                ? null === (f = e.ownerDocument) || void 0 === f
                  ? void 0
                  : f.createElement(s)
                : s;
            return (
              i && i.forEach((E) => w.classList.add(E)),
              a && Object.assign(w, a),
              e.appendChild(w),
              yield new Promise((E) => (0, g.c)(w, E)),
              w
            );
          });
          return function (e, s, i, a, c, f) {
            return o.apply(this, arguments);
          };
        })(),
        l = (o, t) => {
          if (t) {
            if (o) return o.removeViewFromDom(t.parentElement, t);
            t.remove();
          }
          return Promise.resolve();
        },
        r = () => {
          let o, t;
          return {
            attachViewToDom: (function () {
              var i = (0, u.Z)(function* (a, c, f = {}, w = []) {
                var E, y;
                if (((o = a), c)) {
                  const m =
                    "string" == typeof c
                      ? null === (E = o.ownerDocument) || void 0 === E
                        ? void 0
                        : E.createElement(c)
                      : c;
                  w.forEach((n) => m.classList.add(n)),
                    Object.assign(m, f),
                    o.appendChild(m),
                    yield new Promise((n) => (0, g.c)(m, n));
                } else if (
                  o.children.length > 0 &&
                  !o.children[0].classList.contains("ion-delegate-host")
                ) {
                  const n =
                    null === (y = o.ownerDocument) || void 0 === y
                      ? void 0
                      : y.createElement("div");
                  n.classList.add("ion-delegate-host"),
                    w.forEach((_) => n.classList.add(_)),
                    n.append(...o.children),
                    o.appendChild(n);
                }
                const v = document.querySelector("ion-app") || document.body;
                return (
                  (t = document.createComment("ionic teleport")),
                  o.parentNode.insertBefore(t, o),
                  v.appendChild(o),
                  o
                );
              });
              return function (c, f) {
                return i.apply(this, arguments);
              };
            })(),
            removeViewFromDom: () => (
              o && t && (t.parentNode.insertBefore(o, t), t.remove()),
              Promise.resolve()
            ),
          };
        };
    },
    7864: (D, p, d) => {
      d.d(p, { a: () => l, b: () => r, c: () => h, d: () => t, h: () => o });
      const u = {
          getEngine() {
            var e;
            const s = window;
            return (
              s.TapticEngine ||
              ((null === (e = s.Capacitor) || void 0 === e
                ? void 0
                : e.isPluginAvailable("Haptics")) &&
                s.Capacitor.Plugins.Haptics)
            );
          },
          available() {
            var e;
            const s = window;
            return (
              !!this.getEngine() &&
              ("web" !==
                (null === (e = s.Capacitor) || void 0 === e
                  ? void 0
                  : e.getPlatform()) ||
                (typeof navigator < "u" && void 0 !== navigator.vibrate))
            );
          },
          isCordova: () => !!window.TapticEngine,
          isCapacitor: () => !!window.Capacitor,
          impact(e) {
            const s = this.getEngine();
            if (!s) return;
            const i = this.isCapacitor() ? e.style.toUpperCase() : e.style;
            s.impact({ style: i });
          },
          notification(e) {
            const s = this.getEngine();
            if (!s) return;
            const i = this.isCapacitor() ? e.style.toUpperCase() : e.style;
            s.notification({ style: i });
          },
          selection() {
            this.impact({ style: "light" });
          },
          selectionStart() {
            const e = this.getEngine();
            !e ||
              (this.isCapacitor()
                ? e.selectionStart()
                : e.gestureSelectionStart());
          },
          selectionChanged() {
            const e = this.getEngine();
            !e ||
              (this.isCapacitor()
                ? e.selectionChanged()
                : e.gestureSelectionChanged());
          },
          selectionEnd() {
            const e = this.getEngine();
            !e ||
              (this.isCapacitor() ? e.selectionEnd() : e.gestureSelectionEnd());
          },
        },
        g = () => u.available(),
        h = () => {
          g() && u.selection();
        },
        l = () => {
          g() && u.selectionStart();
        },
        r = () => {
          g() && u.selectionChanged();
        },
        o = () => {
          g() && u.selectionEnd();
        },
        t = (e) => {
          g() && u.impact(e);
        };
    },
    109: (D, p, d) => {
      d.d(p, {
        a: () => u,
        b: () => c,
        c: () => t,
        d: () => f,
        e: () => C,
        f: () => o,
        g: () => w,
        h: () => h,
        i: () => g,
        j: () => n,
        k: () => _,
        l: () => e,
        m: () => i,
        n: () => E,
        o: () => s,
        p: () => r,
        q: () => l,
        r: () => m,
        s: () => M,
        t: () => a,
        u: () => y,
        v: () => v,
      });
      const u =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='square' stroke-miterlimit='10' stroke-width='48' d='M244 400L100 256l144-144M120 256h292' class='ionicon-fill-none'/></svg>",
        g =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M112 268l144 144 144-144M256 392V100' class='ionicon-fill-none'/></svg>",
        h =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M368 64L144 256l224 192V64z'/></svg>",
        l =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M64 144l192 224 192-224H64z'/></svg>",
        r =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M448 368L256 144 64 368h384z'/></svg>",
        o =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' d='M416 128L192 384l-96-96' class='ionicon-fill-none ionicon-stroke-width'/></svg>",
        t =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M328 112L184 256l144 144' class='ionicon-fill-none'/></svg>",
        e =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M112 184l144 144 144-144' class='ionicon-fill-none'/></svg>",
        s =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M184 112l144 144-144 144' class='ionicon-fill-none'/></svg>",
        i =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M184 112l144 144-144 144' class='ionicon-fill-none'/></svg>",
        a =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z'/></svg>",
        c =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm75.31 260.69a16 16 0 11-22.62 22.62L256 278.63l-52.69 52.68a16 16 0 01-22.62-22.62L233.37 256l-52.68-52.69a16 16 0 0122.62-22.62L256 233.37l52.69-52.68a16 16 0 0122.62 22.62L278.63 256z'/></svg>",
        f =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M400 145.49L366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49z'/></svg>",
        w =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><circle cx='256' cy='256' r='192' stroke-linecap='round' stroke-linejoin='round' class='ionicon-fill-none ionicon-stroke-width'/></svg>",
        E =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><circle cx='256' cy='256' r='48'/><circle cx='416' cy='256' r='48'/><circle cx='96' cy='256' r='48'/></svg>",
        y =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-miterlimit='10' d='M80 160h352M80 256h352M80 352h352' class='ionicon-fill-none ionicon-stroke-width'/></svg>",
        v =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M64 384h384v-42.67H64zm0-106.67h384v-42.66H64zM64 128v42.67h384V128z'/></svg>",
        m =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' d='M400 256H112' class='ionicon-fill-none ionicon-stroke-width'/></svg>",
        n =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' d='M96 256h320M96 176h320M96 336h320' class='ionicon-fill-none ionicon-stroke-width'/></svg>",
        _ =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='square' stroke-linejoin='round' stroke-width='44' d='M118 304h276M118 208h276' class='ionicon-fill-none'/></svg>",
        M =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z' stroke-miterlimit='10' class='ionicon-fill-none ionicon-stroke-width'/><path stroke-linecap='round' stroke-miterlimit='10' d='M338.29 338.29L448 448' class='ionicon-fill-none ionicon-stroke-width'/></svg>",
        C =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M464 428L339.92 303.9a160.48 160.48 0 0030.72-94.58C370.64 120.37 298.27 48 209.32 48S48 120.37 48 209.32s72.37 161.32 161.32 161.32a160.48 160.48 0 0094.58-30.72L428 464zM209.32 319.69a110.38 110.38 0 11110.37-110.37 110.5 110.5 0 01-110.37 110.37z'/></svg>";
    },
    8416: (D, p, d) => {
      d.d(p, {
        I: () => r,
        a: () => i,
        b: () => o,
        c: () => f,
        d: () => E,
        f: () => a,
        g: () => s,
        i: () => e,
        p: () => w,
        r: () => y,
        s: () => c,
      });
      var u = d(5861),
        g = d(5730),
        h = d(4147);
      const r = "ion-content",
        o = ".ion-content-scroll-host",
        t = `${r}, ${o}`,
        e = (v) => "ION-CONTENT" === v.tagName,
        s = (function () {
          var v = (0, u.Z)(function* (m) {
            return e(m)
              ? (yield new Promise((n) => (0, g.c)(m, n)), m.getScrollElement())
              : m;
          });
          return function (n) {
            return v.apply(this, arguments);
          };
        })(),
        i = (v) => v.querySelector(o) || v.querySelector(t),
        a = (v) => v.closest(t),
        c = (v, m) =>
          e(v)
            ? v.scrollToTop(m)
            : Promise.resolve(
                v.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: m > 0 ? "smooth" : "auto",
                })
              ),
        f = (v, m, n, _) =>
          e(v)
            ? v.scrollByPoint(m, n, _)
            : Promise.resolve(
                v.scrollBy({
                  top: n,
                  left: m,
                  behavior: _ > 0 ? "smooth" : "auto",
                })
              ),
        w = (v) => (0, h.a)(v, r),
        E = (v) => {
          if (e(v)) {
            const n = v.scrollY;
            return (v.scrollY = !1), n;
          }
          return v.style.setProperty("overflow", "hidden"), !0;
        },
        y = (v, m) => {
          e(v) ? (v.scrollY = m) : v.style.removeProperty("overflow");
        };
    },
    5234: (D, p, d) => {
      d.r(p),
        d.d(p, {
          KEYBOARD_DID_CLOSE: () => g,
          KEYBOARD_DID_OPEN: () => u,
          copyVisualViewport: () => m,
          keyboardDidClose: () => w,
          keyboardDidOpen: () => c,
          keyboardDidResize: () => f,
          resetKeyboardAssist: () => t,
          setKeyboardClose: () => a,
          setKeyboardOpen: () => i,
          startKeyboardAssist: () => e,
          trackViewportChanges: () => v,
        });
      const u = "ionKeyboardDidShow",
        g = "ionKeyboardDidHide";
      let l = {},
        r = {},
        o = !1;
      const t = () => {
          (l = {}), (r = {}), (o = !1);
        },
        e = (n) => {
          s(n),
            n.visualViewport &&
              ((r = m(n.visualViewport)),
              (n.visualViewport.onresize = () => {
                v(n), c() || f(n) ? i(n) : w(n) && a(n);
              }));
        },
        s = (n) => {
          n.addEventListener("keyboardDidShow", (_) => i(n, _)),
            n.addEventListener("keyboardDidHide", () => a(n));
        },
        i = (n, _) => {
          E(n, _), (o = !0);
        },
        a = (n) => {
          y(n), (o = !1);
        },
        c = () =>
          !o && l.width === r.width && (l.height - r.height) * r.scale > 150,
        f = (n) => o && !w(n),
        w = (n) => o && r.height === n.innerHeight,
        E = (n, _) => {
          const C = new CustomEvent(u, {
            detail: {
              keyboardHeight: _ ? _.keyboardHeight : n.innerHeight - r.height,
            },
          });
          n.dispatchEvent(C);
        },
        y = (n) => {
          const _ = new CustomEvent(g);
          n.dispatchEvent(_);
        },
        v = (n) => {
          (l = Object.assign({}, r)), (r = m(n.visualViewport));
        },
        m = (n) => ({
          width: Math.round(n.width),
          height: Math.round(n.height),
          offsetTop: n.offsetTop,
          offsetLeft: n.offsetLeft,
          pageTop: n.pageTop,
          pageLeft: n.pageLeft,
          scale: n.scale,
        });
    },
    9852: (D, p, d) => {
      d.d(p, { c: () => g });
      var u = d(3457);
      const g = (h) => {
        let l, r, o;
        const t = () => {
          (l = () => {
            (o = !0), h && h(!0);
          }),
            (r = () => {
              (o = !1), h && h(!1);
            }),
            null == u.w || u.w.addEventListener("keyboardWillShow", l),
            null == u.w || u.w.addEventListener("keyboardWillHide", r);
        };
        return (
          t(),
          {
            init: t,
            destroy: () => {
              null == u.w || u.w.removeEventListener("keyboardWillShow", l),
                null == u.w || u.w.removeEventListener("keyboardWillHide", r),
                (l = r = void 0);
            },
            isKeyboardVisible: () => o,
          }
        );
      };
    },
    7741: (D, p, d) => {
      d.d(p, { S: () => g });
      const g = {
        bubbles: {
          dur: 1e3,
          circles: 9,
          fn: (h, l, r) => {
            const o = (h * l) / r - h + "ms",
              t = (2 * Math.PI * l) / r;
            return {
              r: 5,
              style: {
                top: 9 * Math.sin(t) + "px",
                left: 9 * Math.cos(t) + "px",
                "animation-delay": o,
              },
            };
          },
        },
        circles: {
          dur: 1e3,
          circles: 8,
          fn: (h, l, r) => {
            const o = l / r,
              t = h * o - h + "ms",
              e = 2 * Math.PI * o;
            return {
              r: 5,
              style: {
                top: 9 * Math.sin(e) + "px",
                left: 9 * Math.cos(e) + "px",
                "animation-delay": t,
              },
            };
          },
        },
        circular: {
          dur: 1400,
          elmDuration: !0,
          circles: 1,
          fn: () => ({
            r: 20,
            cx: 48,
            cy: 48,
            fill: "none",
            viewBox: "24 24 48 48",
            transform: "translate(0,0)",
            style: {},
          }),
        },
        crescent: { dur: 750, circles: 1, fn: () => ({ r: 26, style: {} }) },
        dots: {
          dur: 750,
          circles: 3,
          fn: (h, l) => ({
            r: 6,
            style: {
              left: 9 - 9 * l + "px",
              "animation-delay": -110 * l + "ms",
            },
          }),
        },
        lines: {
          dur: 1e3,
          lines: 8,
          fn: (h, l, r) => ({
            y1: 14,
            y2: 26,
            style: {
              transform: `rotate(${
                (360 / r) * l + (l < r / 2 ? 180 : -180)
              }deg)`,
              "animation-delay": (h * l) / r - h + "ms",
            },
          }),
        },
        "lines-small": {
          dur: 1e3,
          lines: 8,
          fn: (h, l, r) => ({
            y1: 12,
            y2: 20,
            style: {
              transform: `rotate(${
                (360 / r) * l + (l < r / 2 ? 180 : -180)
              }deg)`,
              "animation-delay": (h * l) / r - h + "ms",
            },
          }),
        },
        "lines-sharp": {
          dur: 1e3,
          lines: 12,
          fn: (h, l, r) => ({
            y1: 17,
            y2: 29,
            style: {
              transform: `rotate(${30 * l + (l < 6 ? 180 : -180)}deg)`,
              "animation-delay": (h * l) / r - h + "ms",
            },
          }),
        },
        "lines-sharp-small": {
          dur: 1e3,
          lines: 12,
          fn: (h, l, r) => ({
            y1: 12,
            y2: 20,
            style: {
              transform: `rotate(${30 * l + (l < 6 ? 180 : -180)}deg)`,
              "animation-delay": (h * l) / r - h + "ms",
            },
          }),
        },
      };
    },
    6659: (D, p, d) => {
      d.r(p), d.d(p, { createSwipeBackGesture: () => r });
      var u = d(5730),
        g = d(5062),
        h = d(1898);
      d(4349);
      const r = (o, t, e, s, i) => {
        const a = o.ownerDocument.defaultView;
        let c = (0, g.i)(o);
        const w = (n) => (c ? -n.deltaX : n.deltaX);
        return (0, h.createGesture)({
          el: o,
          gestureName: "goback-swipe",
          gesturePriority: 40,
          threshold: 10,
          canStart: (n) => (
            (c = (0, g.i)(o)),
            ((n) => {
              const { startX: M } = n;
              return c ? M >= a.innerWidth - 50 : M <= 50;
            })(n) && t()
          ),
          onStart: e,
          onMove: (n) => {
            const M = w(n) / a.innerWidth;
            s(M);
          },
          onEnd: (n) => {
            const _ = w(n),
              M = a.innerWidth,
              C = _ / M,
              k = ((n) => (c ? -n.velocityX : n.velocityX))(n),
              x = k >= 0 && (k > 0.2 || _ > M / 2),
              S = (x ? 1 - C : C) * M;
            let O = 0;
            if (S > 5) {
              const B = S / Math.abs(k);
              O = Math.min(B, 540);
            }
            i(x, C <= 0 ? 0.01 : (0, u.l)(0, C, 0.9999), O);
          },
        });
      };
    },
    1005: (D, p, d) => {
      d.d(p, { $: () => o });
      var u = d(2462),
        g = d(5529),
        h = d(6498);
      class l {
        constructor(e, s, i, a, c) {
          (this.datos = {
            sistema: "DASHBOARD",
            tipoConsulta: "POS",
            canalPos: String,
            canalUsuario: String,
            metodo: "CONSULTAR",
            consulta: String,
            condicion: String,
            datoCondicion: String,
          }),
            (this.datos.canalPos = e),
            (this.datos.canalUsuario = c),
            (this.datos.consulta = s),
            (this.datos.condicion = i),
            (this.datos.datoCondicion = a);
        }
      }
      var r = d(4650);
      let o = (() => {
        class t {
          constructor() {
            (this.socketEscucha = "DASHBOARD"),
              (this.escuchando = !1),
              (this.componentMethodCallSource = new g.xQ()),
              (this.componentMethodCalled$ =
                this.componentMethodCallSource.asObservable()),
              console.log("\u{1f7e1} SocketService inicializado");
          }
          callComponentMethod() {
            this.componentMethodCallSource.next({ algo: "por aqui paso algo" });
          }
          conectar(s) {
            (this.socket = (0, u.io)("http://localhost:3000", {
              transports: ["websocket"],
              auth: { token: s },
            })),
              this.socket.on("connect", () => {
                console.log(
                  "\u2705 Conectado al servidor con ID:",
                  this.socket.id
                );
              }),
              this.socket.on("connect_error", (i) => {
                console.error("\u274c Error de conexi\xf3n:", i);
              }),
              this.socket.on("disconnect", () => {
                console.warn("\u26a0\ufe0f Desconectado del servidor");
              }),
              void 0 !== this.socket &&
                (this.socketConexion = new h.y((i) => {
                  this.socket.on(this.socketEscucha, (a) => {
                    console.log(
                      "Conectado al servidor con ID:",
                      this.socket.id
                    ),
                      i.next(a),
                      console.log(a);
                  });
                }));
          }
          enviarInfo(s) {
            console.log("entro aqui 1"), this.socket.emit("aws", s);
          }
          obtenerInfo(s) {
            return new h.y((i) => {
              this.escuchando ||
                this.socket.on(s, (a) => {
                  i.next(a), console.log(a), (this.escuchando = !0);
                });
            });
          }
          consultarTercero(s, i, a, c) {
            let f = new l(s, "TERCEROS", i, a, c);
            this.enviarInfo(f.datos);
          }
          consultarProducto(s, i, a, c) {
            let f = new l(s, "PRODUCTOS", i, a, c);
            this.enviarInfo(f.datos);
          }
          crearPedido(s, i, a) {
            this.enviarInfo({
              sistema: "DASHBOARD",
              tipoConsulta: "POS",
              canalPos: s,
              canalUsuario: i,
              metodo: "CREAR",
              consulta: "PEDIDO",
              crear: a,
            });
          }
        }
        return (
          (t.ɵfac = function (s) {
            return new (s || t)();
          }),
          (t.ɵprov = r.Yz7({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
    },
  },
]);
