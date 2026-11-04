# Sanchita Bashu — Actress portfolio

A cinematic, animation-led single-page portfolio for actress and creator **Sanchita Bashu** (@bashu_sanchita). Built with React 19, Vite, TypeScript, GSAP (ScrollTrigger), Lenis smooth scroll and a Three.js WebGL hero.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production bundle in /dist
npm run preview    # serve the production bundle
```

## What's in the experience

| Section | Motion |
| --- | --- |
| Preloader | Name letters rise through masks, counter 000→100, gold progress rule, curtain lifts into the hero |
| Hero | WebGL portrait with pointer-driven liquid displacement, RGB split and film grain; character-staggered name reveal; Devanagari name in the eyebrow; scroll parallax |
| Marquee | Infinite ticker that speeds up and reverses with scroll velocity |
| About | Sticky portrait with parallax and un-mask reveal; word-masked headline and copy; count-up stats (5.1M, 2.7M, 69, #1) with drawing rules |
| Journey | Vertical timeline from Bhagalpur 2019 to Season 2 in 2026; gold rule draws with scroll, milestones pop in; ends on her own quote |
| Work | Pinned horizontal scroll of credits (TKMP S2, TKMP S1, Inna Sona, First Day First Show); images drift in depth; progress rule; stacked list on mobile |
| Gallery | Three columns scrolling at different speeds; masked reveals; lightbox with keyboard (← → Esc) and crossfade |
| Showreel | Frame grows from letterbox inset to full width on scroll; outlined title drifts behind; muted autoplay, click for sound |
| Press & milestones | Published headlines from Variety, Zee News, Tellychakkar and the Jagran Film Festival, each linked; sticky milestones list |
| Contact | Headline reveal, magnetic Instagram pill, Archi Films link, marquee of disciplines |
| Global | Custom cursor with labelled states, film grain overlay, Lenis smooth scroll, `prefers-reduced-motion` respected everywhere |

## Content and sources

Everything editable lives in **`src/data/content.ts`**. The facts there come from public sources:

- Instagram bio (@bashu_sanchita): verified, 5.1M followers, Mumbai, founder of @archi_films24
- Wikipedia — *Thukra Ke Mera Pyaar*: Shanvika Chauhan, dir. Shraddha Pasi Jairath, Bombay Show Studios; S1 19 eps from 22 Nov 2024 on Disney+ Hotstar; S2 50 eps from 19 Jun 2026 on JioHotstar; "most-watched show of the year" citing Variety (16 Dec 2024)
- Zee News (Jan 2025, Jun 2026): ~140 auditions for Shanvika; dream roles Geet, Gangubai, Sadma; the quote used in the Journey section
- Biography aggregators (wikibio.in, thecityceleb.com): born 24 March 2004, Bhagalpur, Bihar; TikTok from 2019; YouTube channel 21 Jun 2019; Silver Play Button May 2022; *First Day First Show* (2022, Telugu, as Laya); *Inna Sona* (2024)
- joinmedigitalmedia.in: YouTube 2.7M

**Verify before launch** (single-source or inferred): *Inna Sona* credits, the Archi Films founding year (bio says founder; "24" in the handle suggests 2024), the "1M+ YouTube Creator Award" milestone (implied by the 2.7M subscriber count), and the exact spelling she wants on the site ("Bashu" per her Instagram handle; press mostly writes "Basu").

**Still needed from the client:** email address (`profile.email` — the Instagram bio truncates it), the showreel file, and original-resolution photography (see below).

## Photography

The images in `public/images/` are her own photographs, pulled at Instagram's 1080px web size from the public @bashu_sanchita grid (12 most recent posts, November 2026) and resized/cropped for the web (`hero`, `about`, `work-*`, `gallery-*`, `showreel-poster`, `og`). Three of them (`work-tkmp-s2`, `work-tkmp-s1`, `work-inna-sona`, `gallery-08/09`) come from 540–720px reel covers and the Season 2 poster, so they are soft on retina screens.

Before launch, ask her for the original files and drop them in with the same names (2400px long edge, JPEG q80 or AVIF/WebP). Keep the `ratio` field in `gallery` accurate (width ÷ height) so the layout never shifts while images load. The hero image is sampled by WebGL — a sharp, well-lit portrait with a clean background looks best under the displacement effect.

The showreel still uses a sample video; replace `showreel.src` with her reel (direct MP4/WebM URL or a file in `public/video`). For a YouTube/Vimeo embed, replace the `<video>` in `src/components/Showreel.tsx` with an iframe.

## Design tokens

Colours, fonts and easing curves are CSS variables at the top of `src/styles/global.css` (`--bg`, `--ink`, `--accent`, `--font-display`, `--font-sans`). Fonts: Cormorant Garamond (display), Manrope (UI) and Tiro Devanagari Hindi (Hindi name), linked in `index.html`.

## Structure

```
src/
  components/   Preloader, Cursor, Nav, Hero (+HeroCanvas shader), Marquee, About, Journey,
                Filmography, Gallery (+Lightbox), Showreel, Press, Contact, SplitText, RevealImage
  data/         content.ts — all copy, links and media
  hooks/        useLenis.ts — smooth scroll wired to GSAP's ticker
  lib/          gsap.ts — plugin registration, reduced-motion / touch helpers
  styles/       global.css (tokens, primitives), components.css (sections)
public/images/  her photographs (web copies; swap for originals)
```

## Deploy (Render)

The site is a static build, hosted on Render as a **Static Site** from the GitHub repo `sat4spd/sanchita-bashu-portfolio` (branch `main`).

- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Auto-deploy: every push to `main`

To redeploy, push to `main`. To change the domain, add a custom domain in the Render dashboard and point a CNAME at the `.onrender.com` host. Before launch: add the real email, confirm the verify-list above, and replace the Instagram web copies with original photography.

Screenshots for sharing live in `docs/screenshots/`; an email draft for the client is in `docs/share-email.md`.
