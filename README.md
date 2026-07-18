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

Photography is hotlinked from Shutterstock **preview URLs**, rendered
black-and-white via a CSS `grayscale` filter to hold the MONO palette.
Two important notes:

1. **These previews are watermarked comps, not licensed assets.** Before
   using this site in production, license each image through a Shutterstock
   account, download the clean files into `assets/img/`, and point the
   `src` attributes in `index.html` at the local files. The Shutterstock
   page for every image is linked below.
2. **Offline fallback:** every photo has an `onerror` handler that swaps in
   the original generative "strand study" SVG art (`assets/art/`), so the
   site still looks intentional with no network.

| Slot | Shutterstock image |
| --- | --- |
| Hero | [239404387](https://www.shutterstock.com/image-photo/woman-studio-beauty-portrait-black-white-239404387) |
| Studio | [1161847672](https://www.shutterstock.com/image-photo/modern-bright-beauty-salon-baber-shop-1161847672) |
| Team, Ava | [2755974775](https://www.shutterstock.com/image-photo/confident-beauty-salon-owner-standing-crossed-2755974775) |
| Team, Marcus | [1973495021](https://www.shutterstock.com/image-photo/portrait-male-hairdresser-salon-1973495021) |
| Team, Yuki | [1955521306](https://www.shutterstock.com/image-photo/portrait-professional-hairdresser-beauty-salon-young-1955521306) |
| Team, Priya | [2690331941](https://www.shutterstock.com/image-photo/professional-hairdresser-does-hairstyle-beautiful-young-2690331941) |
| Gallery 1 | [1816800308](https://www.shutterstock.com/image-photo/fashion-studio-portrait-lovely-asian-woman-1816800308) |
| Gallery 2 | [670133266](https://www.shutterstock.com/image-photo/back-view-beautiful-woman-creative-elegant-670133266) |
| Gallery 3 | [1337381666](https://www.shutterstock.com/image-photo/fashion-studio-portrait-lovely-asian-woman-1337381666) |
| Gallery 4 | [2586363569](https://www.shutterstock.com/image-photo/hair-movement-beauty-portrait-photography-featuring-2586363569) |
| Gallery 5 | [527788945](https://www.shutterstock.com/image-photo/beautiful-braid-hairstyle-527788945) |

## Booking form

The form is front-end only (this is a static demo): it validates input and
shows a confirmation state, but does not send data anywhere. Wire the
`submit` handler in `js/main.js` to your backend, or to a service such as
Formspree, to make it live.
