(function (d) {
    "function" === typeof define && define.amd && define.amd.jQuery ? define(["jquery", "museutils"], d) : d(jQuery)
})(function (d) {
    d.fn.museOverlay = function (b) {
        var c = d.extend({
            autoOpen: !0,
            offsetLeft: 0,
            offsetTop: 0,
            $overlaySlice: d(),
            $slides: d(),
            $overlayWedge: d(),
            duration: 300,
            overlayExtraWidth: 0,
            overlayExtraHeight: 0,
            $elasticContent: d()
        }, b);
        return this.each(function () {
            var a = d(this).data("museOverlay");
            if (a && a[b] !== void 0) return a[b].apply(this, Array.prototype.slice.call(arguments, 1));
            var a = c.slideshow.options.isResponsive,
                g = d("body"),
                j = d("<div/>").appendTo(g).css({
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 100001
                }).hide(),
                f = d("<div/>").append(c.$overlaySlice).appendTo(j).css({
                    position: "absolute",
                    top: 0,
                    left: 0
                }),
                h = d(this).css({
                    position: "absolute",
                    left: 0,
                    top: 0,
                    outline: "none"
                }).attr({
                    role: "dialog",
                    tabindex: "0"
                }).appendTo(j);
            a && h.css({
                width: c.slideshow.$element.width() + "px"
            });
            var i = j.siblings("div"),
                l = d(window),
                k, m, n = null,
                a = j.find("a, button, [tabindex], input, textarea, [contenteditable]"),
                p = a[0],
                q = a[a.length - 1],
                o = c.$elasticContent,
                r = o.length ? parseInt(o.css("padding-left")) + parseInt(o.css("padding-right")) + parseInt(o.css("border-left-width")) + parseInt(o.css("border-right-width")) : 0,
                t = o.length ? parseInt(o.css("padding-top")) + parseInt(o.css("padding-bottom")) + parseInt(o.css("border-top-width")) + parseInt(o.css("border-bottom-width")) : 0,
                v = c.$overlaySlice.outerWidth(),
                w = c.$overlaySlice.outerHeight(),
                s = {
                    isOpen: !1,
                    reuseAcrossBPs: function () {
                        c.reuseAcrossBPs = !0
                    },
                    handleClose: function () {
                        s.close()
                    },
                    open: function () {
                        if (!s.isOpen) {
                            if (!c.reuseAcrossBPs &&
                                c.slideshow.$bp) {
                                if (!c.slideshow.$bp.hasClass("active")) return;
                                c.slideshow.breakpoint.swapPlaceholderNodesRecursively(j);
                                c.slideshow.breakpoint.activateIDs(j)
                            }
                            Muse.Utils.showWidgetsWhenReady(j);
                            k = l.width();
                            m = l.height();
                            s.positionContent(k, m);
                            j.show();
                            f.bind("click", s.handleClose);
                            f.css({
                                opacity: 0
                            }).stop(!0);
                            h.css({
                                opacity: 0
                            }).stop(!0);
                            i.attr("aria-hidden", "true");
                            f.bind("click", s.handleClose).animate({
                                opacity: 0.99
                            }, {
                                queue: !1,
                                duration: c.duration,
                                complete: function () {
                                    f.css({
                                        opacity: ""
                                    });
                                    h.animate({
                                        opacity: 1
                                    }, {
                                        queue: !1,
                                        duration: c.duration,
                                        complete: function () {
                                            h.css({
                                                opacity: ""
                                            });
                                            s.applyPageDimensions();
                                            window.setTimeout(function () {
                                                h[0].focus()
                                            }, void 0)
                                        }
                                    })
                                }
                            });
                            d(document).bind("keydown", s.onKeyDown);
                            s.doLayout(k, m);
                            s.isOpen = !0;
                            l.bind("resize", s.onWindowResize);
                            d("body").bind("muse_bp_deactivate", s.onBreakpointChange);
                            s.onWindowResize(null, !0)
                        }
                    },
                    close: function (a) {
                        f.unbind("click", s.handleClose);
                        l.unbind("resize", s.onWindowResize);
                        d("body").unbind("muse_bp_deactivate", s.onBreakpointChange);
                        d(document).unbind("keydown",
                            s.onKeyDown);
                        if (c.onClose) c.onClose();
                        f.css({
                            opacity: 0.99
                        }).stop(!0);
                        h.css({
                            opacity: 0.99
                        }).stop(!0);
                        h.animate({
                            opacity: 0
                        }, {
                            queue: !1,
                            duration: a ? 0 : c.duration,
                            complete: function () {
                                f.animate({
                                    opacity: 0
                                }, {
                                    queue: !1,
                                    duration: a ? 0 : c.duration,
                                    complete: function () {
                                        j.hide();
                                        h.css({
                                            opacity: ""
                                        });
                                        f.css({
                                            opacity: ""
                                        });
                                        i.removeAttr("aria-hidden")
                                    }
                                })
                            }
                        });
                        s.isOpen = !1
                    },
                    next: function () {
                        if (c.onNext) c.onNext()
                    },
                    previous: function () {
                        if (c.onPrevious) c.onPrevious()
                    },
                    focusTrap: function (a) {
                        a.keyCode === 9 && (a.shiftKey ? a.target === p &&
                            q.focus() : a.target === q && p.focus())
                    },
                    onBreakpointChange: function () {
                        s.close(!0)
                    },
                    onKeyDown: function (a) {
                        switch (a.which || a.keyCode) {
                            case 37:
                            case 38:
                                h.is(":focus") && s.previous();
                                break;
                            case 39:
                            case 41:
                                h.is(":focus") && s.next();
                                break;
                            case 27:
                                s.close()
                        }
                        s.focusTrap(a)
                    },
                    onWindowResize: function (a, b) {
                        var c = l.width(),
                            d = l.height();
                        (b || k != c || m != d) && n == null && (n = setTimeout(function () {
                            k = l.width();
                            m = l.height();
                            s.doLayout(k, m);
                            s.positionContent(k, m);
                            n = null
                        }, 10))
                    },
                    doLayout: function (a, b) {
                        j.css({
                            width: 0,
                            height: 0
                        });
                        c.$overlayWedge.css({
                            width: 0,
                            height: 0
                        });
                        var d = a - r,
                            f = b - t;
                        o.length && o.hasClass("fullwidth") && (o.width(d), c.resizeSlidesFn && c.resizeSlidesFn(d, f));
                        s.applyPageDimensions()
                    },
                    applyPageDimensions: function () {
                        function a() {
                            var b = document.createElement("div");
                            b.style.overflow = "scroll";
                            b.style.visibility = "hidden";
                            b.style.position = "absolute";
                            b.style.width = "100px";
                            b.style.height = "100px";
                            document.body.appendChild(b);
                            var c = b.offsetWidth - b.clientWidth;
                            document.body.removeChild(b);
                            return {
                                width: c
                            }
                        }
                        var b = d(document),
                            f = b.width(),
                            b = b.height(),
                            g = document.documentElement ||
                                document.body;
                        g.clientWidth != g.offsetWidth && (f = g.scrollWidth - 1);
                        g.clientHeight != g.offsetHeight && b < g.scrollHeight && (b = g.scrollHeight - 1);
                        j.css({
                            width: f,
                            height: b
                        });
                        c.$overlayWedge.css({
                            width: f - v,
                            height: b - w
                        });
                        h.css("width", c.slideshow.$element.width() + "px");
                        if (h[0].childNodes[0]) f = c.slideshow.slides.$element.outerWidth(), b = c.slideshow.slides.$element.outerHeight(), c.slideshow.options && c.slideshow.options.transitionStyle && c.slideshow.options.transitionStyle !== "vertical" && b && b > d(window).height() ? (b = a(),
                            h[0].childNodes[0].style.maxHeight = "100vh", h[0].childNodes[0].style.overflowY = "auto", h[0].childNodes[0].style.width = f + b.width + "px") : h[0].childNodes[0].style.width = f + "px"
                    },
                    positionContent: function (a, b) {
                        var d = -c.$slides.outerWidth() / 2,
                            f = -c.$slides.outerHeight() / 2,
                            d = Math.max(0, a / 2 + d);
                        h.css({
                            top: Math.max(0, b / 2 + f),
                            left: d
                        });
                        o.length && o.hasClass("fullwidth") && o.css("left", -d);
                        f = a - r;
                        d = b - t;
                        o.length && (o.width(f), o.hasClass("fullscreen") && o.height(d), c.resizeSlidesFn && c.resizeSlidesFn(f, d))
                    }
                };
            h.data("museOverlay",
                s);
            c.autoShow && s.open()
        })
    }
});;
(function () {
    if (!("undefined" == typeof Muse || "undefined" == typeof Muse.assets)) {
        var a = function (a, b) {
            for (var c = 0, d = a.length; c < d; c++)
                if (a[c] == b) return c;
            return -1
        }(Muse.assets.required, "jquery.museoverlay.js");
        if (-1 != a) {
            Muse.assets.required.splice(a, 1);
            for (var a = document.getElementsByTagName("meta"), b = 0, c = a.length; b < c; b++) {
                var d = a[b];
                if ("generator" == d.getAttribute("name")) {
                    "2017.0.2.363" != d.getAttribute("content") && Muse.assets.outOfDate.push("jquery.museoverlay.js");
                    break
                }
            }
        }
    }
})();

