# MONO Hair — Salon Website

A monochrome, editorial one-page website for **MONO Hair**, a fictional hair
studio on Ossington Avenue, Toronto. Built with plain HTML, CSS and vanilla
JavaScript — no frameworks, no build step, no dependencies.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## What's inside

| Path | Purpose |
| --- | --- |
| `index.html` | The whole site — semantic, accessible markup |
| `css/style.css` | Design system + all styling (custom properties, fluid type) |
| `js/main.js` | Interactions (no libraries) |
| `assets/art/*.svg` | Generative "hair flow" line art used as imagery |

## Features

- **Editorial monochrome design** — ink `#111` on warm paper `#f4f2ee`,
  Fraunces display serif + Archivo grotesque (Google Fonts, with system
  fallbacks), fluid `clamp()` type scale, film-grain overlay.
- **Sections** — hero with rotating badge, outlined-text marquee, studio
  manifesto with animated stat counters, tabbed price list, dark "ritual"
  band, team grid, draggable horizontal gallery with progress bar,
  testimonial slider, CTA band, hours/contact + booking request form,
  oversized footer wordmark.
- **Interactions** — preloader (once per session), hide-on-scroll header,
  full-screen mobile menu, scroll reveals via `IntersectionObserver`,
  magnetic buttons, custom cursor (fine pointers only), drag-to-scroll
  gallery, accessible tabs (arrow keys), client-side form validation with
  honeypot and success state.
- **Accessibility & performance** — skip link, landmarks, ARIA on
  tabs/slider/menu, keyboard operable throughout, `prefers-reduced-motion`
  disables all animation, lazy-loaded images, zero JS/CSS dependencies,
  `HairSalon` JSON-LD for local SEO.

## About the imagery

Because the name is *MONO*, the art direction leans fully into monochrome:
all imagery is generative black-and-white "strand study" line art (SVG),
so the site is completely self-contained and loads instantly. Every image
slot is a plain `<img>` — to use real photography, drop your photos into
`assets/` and swap the `src` attributes in `index.html`.

## Booking form

The form is front-end only (this is a static demo): it validates input and
shows a confirmation state, but does not send data anywhere. Wire the
`submit` handler in `js/main.js` to your backend, or to a service such as
Formspree, to make it live.
