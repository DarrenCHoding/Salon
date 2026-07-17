/* ==========================================================================
   MONO Hair — interactions
   ========================================================================== */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Loader ---------- */
  const loader = $("#loader");
  document.body.classList.add("is-loading");

  const finishLoading = () => {
    loader.classList.add("is-done");
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
  };

  if (reducedMotion || sessionStorage.getItem("mono-visited")) {
    loader.remove();
    document.body.classList.remove("is-loading");
    // Wait a tick so hero transitions still play on first paint
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.body.classList.add("is-ready");
    }));
  } else {
    sessionStorage.setItem("mono-visited", "1");
    window.addEventListener("load", () => setTimeout(finishLoading, 900));
    // Safety net in case `load` stalls (e.g. slow font fetch)
    setTimeout(() => {
      if (document.body.classList.contains("is-loading")) finishLoading();
    }, 3500);
  }

  /* ---------- Header: shrink + hide on scroll down ---------- */
  const header = $("#header");
  let lastY = window.scrollY;

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    if (y > 480 && y > lastY + 4 && !document.body.classList.contains("menu-open")) {
      header.classList.add("is-hidden");
    } else if (y < lastY - 4 || y <= 480) {
      header.classList.remove("is-hidden");
    }
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = $("#burger");
  const menu = $("#mobile-menu");

  const setMenu = (open) => {
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
  };

  burger.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  $$(".menu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) {
      setMenu(false);
      burger.focus();
    }
  });

  /* ---------- Scroll reveals ---------- */
  const revealables = $$("[data-reveal], [data-reveal-lines]");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Stat counters ---------- */
  const counters = $$("[data-count]");
  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const t0 = performance.now();
    const dur = 1400;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window && !reducedMotion) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach((el) => { el.textContent = el.dataset.count; });
  }

  /* ---------- Services tabs ---------- */
  const tablist = $(".tabs__list");
  if (tablist) {
    const tabs = $$(".tabs__tab", tablist);
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));

    const activate = (idx, focus = false) => {
      tabs.forEach((tab, i) => {
        const on = i === idx;
        tab.classList.toggle("is-active", on);
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[i].classList.toggle("is-active", on);
        panels[i].hidden = !on;
      });
      if (focus) tabs[idx].focus();
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => activate(i));
      tab.addEventListener("keydown", (e) => {
        let next = null;
        if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = tabs.length - 1;
        if (next !== null) { e.preventDefault(); activate(next, true); }
      });
    });
  }

  /* ---------- Work strip: drag to scroll + progress ---------- */
  const strip = $("#work-strip");
  const progressBar = $("#work-progress-bar");
  if (strip) {
    let isDown = false, startX = 0, startScroll = 0, moved = false;

    strip.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return; // touch scrolls natively
      isDown = true; moved = false;
      startX = e.clientX;
      startScroll = strip.scrollLeft;
    });
    window.addEventListener("pointermove", (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4 && !moved) {
        moved = true;
        strip.classList.add("is-dragging");
      }
      if (moved) strip.scrollLeft = startScroll - dx;
    });
    window.addEventListener("pointerup", () => {
      isDown = false;
      strip.classList.remove("is-dragging");
    });
    strip.addEventListener("dragstart", (e) => e.preventDefault());

    const updateProgress = () => {
      const max = strip.scrollWidth - strip.clientWidth;
      const p = max > 0 ? strip.scrollLeft / max : 0;
      const track = strip.clientWidth / strip.scrollWidth; // visible share
      progressBar.style.width = `${Math.max(track * 100, 8)}%`;
      progressBar.style.left = `${p * (100 - Math.max(track * 100, 8))}%`;
    };
    strip.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  /* ---------- Voices slider ---------- */
  const slider = $("#voices-slider");
  if (slider) {
    const slides = $$(".voices__slide", slider);
    const dotsWrap = $("#voices-dots");
    let current = 0;
    let timer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Testimonial ${i + 1} of ${slides.length}`);
      dot.addEventListener("click", () => { go(i); restart(); });
      dotsWrap.appendChild(dot);
    });
    const dots = $$("button", dotsWrap);

    const go = (idx) => {
      current = (idx + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle("is-active", i === current));
      dots.forEach((d, i) => {
        d.classList.toggle("is-active", i === current);
        d.setAttribute("aria-selected", String(i === current));
      });
    };

    const restart = () => {
      if (reducedMotion) return;
      clearInterval(timer);
      timer = setInterval(() => go(current + 1), 6000);
    };

    $("#voices-prev").addEventListener("click", () => { go(current - 1); restart(); });
    $("#voices-next").addEventListener("click", () => { go(current + 1); restart(); });

    slider.addEventListener("pointerenter", () => clearInterval(timer));
    slider.addEventListener("pointerleave", restart);
    slider.addEventListener("focusin", () => clearInterval(timer));
    slider.addEventListener("focusout", restart);

    go(0);
    restart();
  }

  /* ---------- Booking form ---------- */
  const form = $("#booking-form");
  const success = $("#form-success");
  if (form) {
    const fields = ["f-name", "f-email", "f-service", "f-date"].map((id) => document.getElementById(id));

    const validateField = (input) => {
      const wrap = input.closest(".form__field");
      let ok = input.checkValidity();
      if (input.type === "email" && input.value) {
        ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
      }
      wrap.classList.toggle("has-error", !ok);
      return ok;
    };

    fields.forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.closest(".form__field").classList.contains("has-error")) validateField(input);
      });
    });

    // sensible min date: today
    const dateInput = $("#f-date");
    dateInput.min = new Date().toISOString().split("T")[0];

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (form.elements.company.value) return; // honeypot: silently drop bots

      const allValid = fields.map(validateField).every(Boolean);
      if (!allValid) {
        $(".form__field.has-error input, .form__field.has-error select", form)?.focus();
        return;
      }

      // Demo site: no backend — show confirmation state.
      form.hidden = true;
      success.hidden = false;
      success.querySelector("h3").focus?.();
      success.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    });

    $("#form-reset").addEventListener("click", () => {
      form.reset();
      form.hidden = false;
      success.hidden = true;
      $("#f-name").focus();
    });
  }

  /* ---------- Footer year + back to top ---------- */
  $("#year").textContent = new Date().getFullYear();
  $("#to-top").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });

  /* ---------- Custom cursor (fine pointers only) ---------- */
  const cursor = $("#cursor");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (cursor && finePointer && !reducedMotion) {
    document.body.classList.add("has-cursor");
    let cx = -100, cy = -100, tx = -100, ty = -100;

    window.addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      cursor.classList.add("is-on");
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", () => cursor.classList.remove("is-on"));

    const loop = () => {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    const hoverTargets = "a, button, .tabs__tab, .work__strip";
    document.addEventListener("pointerover", (e) => {
      cursor.classList.toggle("is-hover", Boolean(e.target.closest(hoverTargets)));
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reducedMotion) {
    $$("[data-magnetic]").forEach((el) => {
      const strength = 0.28;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.transform = "";
        setTimeout(() => { el.style.transition = ""; }, 500);
      });
    });
  }

  /* ---------- Hero art: gentle parallax ---------- */
  const heroArt = $(".hero__art img");
  if (heroArt && !reducedMotion) {
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroArt.style.translate = `0 ${y * 0.08}px`;
      }
    }, { passive: true });
  }
})();
