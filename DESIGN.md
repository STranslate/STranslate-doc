---
name: STranslate
description: A quiet Chinese reading surface with a decisive purple selection and authentic software proof.
colors:
  bg: '#fff'
  surface: '#f6f7fa'
  surface-2: '#eef0f5'
  text: '#232530'
  muted: '#626674'
  subtle: '#707584'
  line: '#e7e8ee'
  brand: '#7950a4'
  brand-hover: '#633989'
  brand-soft: '#f0eaf8'
  brand-text: '#6e4097'
  stage: '#f1eef7'
  selection: '#e5d6f4'
  dark-bg: '#17181e'
  dark-surface: '#1e2028'
  dark-surface-2: '#272a34'
  dark-text: '#ececf3'
  dark-muted: '#a6a9b9'
  dark-subtle: '#9398aa'
  dark-line: '#30323f'
  dark-brand: '#b78bdc'
  dark-brand-hover: '#caa3e9'
  dark-brand-soft: '#30253f'
  dark-brand-text: '#c49be5'
  dark-stage: '#24212f'
  dark-selection: '#62457e'
  dark-primary-ink: '#22172c'
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif"
    fontSize: '72px'
    fontWeight: 750
    lineHeight: 1.25
    letterSpacing: '-0.04em'
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif"
    fontSize: '32px'
    fontWeight: 680
    lineHeight: 1.45
    letterSpacing: '-0.025em'
  title:
    fontSize: '22px'
    fontWeight: 650
    lineHeight: 1.35
    letterSpacing: '-0.025em'
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif"
    fontSize: '15px'
    lineHeight: 1.7
  prose:
    fontSize: '14px'
    lineHeight: 1.95
  label:
    fontSize: '14px'
    fontWeight: 550
    lineHeight: 1.7
  sample-headline:
    fontFamily: "Georgia, 'Times New Roman', serif"
    fontSize: '34px'
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: '-0.035em'
  code:
    fontFamily: "Consolas, 'Cascadia Code', monospace"
    fontSize: '0.88em'
rounded:
  badge: '4px'
  compact-action: '6px'
  control: '8px'
  action: '9px'
  card: '14px'
  stage: '18px'
spacing:
  tight: '8px'
  action-gap: '12px'
  medium: '20px'
  card-inset: '24px'
  section-gap: '30px'
  reading-gap: '50px'
components:
  button-primary:
    backgroundColor: '{colors.brand}'
    textColor: '{colors.bg}'
    rounded: '{rounded.action}'
    padding: '12px 22px'
  button-primary-hover:
    backgroundColor: '{colors.brand-hover}'
  button-primary-dark:
    backgroundColor: '{colors.dark-brand}'
    textColor: '{colors.dark-primary-ink}'
  button-secondary:
    backgroundColor: '{colors.bg}'
    textColor: '{colors.text}'
    rounded: '{rounded.action}'
    padding: '12px 22px'
  icon-button:
    textColor: '{colors.muted}'
    rounded: '{rounded.control}'
    height: '38px'
    width: '38px'
  search-field:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.text}'
    rounded: '{rounded.control}'
    padding: '12px 14px'
  nav-current:
    backgroundColor: '{colors.brand-soft}'
    textColor: '{colors.brand-text}'
    rounded: '{rounded.compact-action}'
    padding: '7px 12px'
  badge-official:
    backgroundColor: '{colors.brand-soft}'
    textColor: '{colors.brand-text}'
    rounded: '{rounded.badge}'
    padding: '2px 7px'
  plugin-card:
    backgroundColor: '{colors.bg}'
    rounded: '{rounded.card}'
    padding: '24px'
---

# Design System: STranslate

## Overview

**Creative North Star: "选中 → 读懂"**

A quiet reading surface makes understanding feel immediate. Cold white and graphite support the original purple logo; purple identifies selection, the main action and the current location. Native Chinese sans keeps the interface familiar, while genuine software screenshots supply the product's visual proof.

The same restrained materials support an expansive home scene, a denser documentation reader and a practical plugin catalogue. This records the accepted implementation, not a new direction. The pinned contract is the first body child in `src/layouts/Base.astro` (seed `e311debb`, user direction overrides the roll).

**Key Characteristics:**

- Calm reading rhythm and conventional, visible controls.
- Purple selection and authentic software media.
- Flat surfaces with soft depth reserved for floating software and overlays.
- Complete light and dark themes, native Chinese type and responsive layouts.

Source of truth: `src/styles/global.css`, `src/layouts/{Base,Docs}.astro`, `src/components/{Header,Search,DocNavigation}.astro`, `src/components/PluginMarket.vue` and `src/pages/{index,plugins}.astro`. `PRODUCT.md` owns product commitments; `.impeccable/surface-brief.md` owns surface strategy. When these visual sources change, regenerate this file and `.impeccable/design.json` together. The frontmatter owns primitives; the sidecar owns previews and extensions. Its synthesized tonal ramps are preview aids, not additional CSS tokens.

## Colors

The palette combines cool paper and graphite with a muted violet accent; dark mode lightens the violet while preserving the same semantic roles. Frontmatter keys match CSS custom properties; `dark-` keys record the overrides under `:root[data-theme='dark']`.

### Primary

- **Selection Violet — brand / dark-brand:** primary actions, emphasized hero text, active rules and focus outlines.
- **Deeper / Brighter Violet — brand-hover / dark-brand-hover:** actionable hover feedback.
- **Violet Ink — brand-text / dark-brand-text:** readable links and selected labels.
- **Violet Wash — brand-soft / dark-brand-soft:** selected navigation, official badges and supporting action areas.
- **Selected Text — selection / dark-selection:** text selection and the sample article's marked phrase. Dark sample selection uses the main text color.
- **Reading Stage — stage / dark-stage:** the quiet backing behind the home reading scene.

### Neutral

- **Paper / Graphite — bg / dark-bg:** page, header, cards and dialog surfaces.
- **Quiet Surface — surface / dark-surface:** fields, toolbar, OCR section and secondary hover states.
- **Inset Surface — surface-2 / dark-surface-2:** code, tags and loading placeholders.
- **Reading Ink — text / dark-text:** primary content.
- **Supporting Ink — muted / dark-muted:** secondary copy and placeholders; placeholders retain full opacity.
- **Quiet Ink — subtle / dark-subtle:** lower emphasis details and arrows.
- **Hairline — line / dark-line:** one-pixel separators and container borders.
- **Dark Action Ink — dark-primary-ink:** primary button text in dark mode. Light primary buttons use white.

**The Semantic Theme Rule.** Switch every shared role through the CSS theme overrides; do not apply a light-only neutral to new interface text or surfaces.

## Typography

**Display and Body Font:** the native system stack in frontmatter, including Microsoft YaHei and PingFang SC. No downloaded font is required.
**Code Font:** Consolas, Cascadia Code, monospace.
**Sample Article Font:** Georgia with Times New Roman fallback, confined to the English demonstration article heading.

The interface uses clear Chinese sans with modest negative heading tracking. The English sample heading supplies a localized editorial cue; its paragraphs still use the system sans.

- **Display:** the home heading uses the display role; it steps through (64px), (54px), (40px) and (34px) at the implemented width thresholds.
- **Headline:** documentation titles use the headline role, reducing to (27px) at tablet widths. Marketplace titles use (43px, 680), then (35px) and (30px).
- **Title:** document section titles use the title role; document subheadings use (17px, 600). Home section titles range from (30–40px).
- **Body:** the shared body role supports the interface. Documentation uses the prose role; at tablet widths it becomes (13px), returning to (14px, 1.9) on phones.
- **Label:** desktop main navigation uses the label role. Supporting metadata generally uses (10–13px), distinct from reading copy.

**The Local Serif Rule.** Keep Georgia inside the English sample heading; Chinese interface headings and documentation remain native sans.

## Layout

The shared content width is capped at (1200px), with (40px) desktop side gutters. The header is capped at (1360px), stands (76px) tall and stays sticky. Gutters shrink to (24px) at (850px) and (18px) at (640px); the phone header is (62px) tall.

The home introduction is centered above a wide stage. Within it, a semantic article and an in-flow figure use a CSS grid of (1.35fr / 1fr), a (20px) gap and content-driven height. The genuine translation crop is capped at (405px), with its caption in normal flow. At (640px), article and figure stack, and the figure becomes (90%) wide with a (320px) cap. Do not turn the figure into an absolutely positioned overlay that clips its caption. Lower home sections shift from paired columns to a single column on phones.

Documentation uses task navigation, reading content and an outline in a grid of (200px / minmax(0, 1fr) / 170px) with (50px) gaps. At (1150px), the outline hides and the sidebar becomes (185px). At (850px), the sidebar is (165px) with (28px) gaps. At (640px), the article occupies one column; a sticky (46px) document bar opens the sidebar or page outline.

The plugin catalogue uses three equal columns with (20px) gaps, two columns at (850px), and one at (640px) with (14px) gaps. Search, category filters and results status precede the grid. Tabs may scroll horizontally; long plugin names and descriptions wrap. Use the extracted spacing steps without imposing a synthetic uniform scale on existing layouts.

## Elevation & Depth

Borders and tonal surfaces provide most structure. Cards stay flat; their hover state changes the border. The real translation window receives the theme-dependent floating shadow. Modal dialogs use a deeper shadow and dim backdrop; mobile document drawers and outlines use the floating shadow. Exact shadow and backdrop values live in the sidecar.

**The Earned Depth Rule.** Reserve cast shadows for genuinely floating software and overlays, rather than every content block.

Motion is limited to short button state transitions (0.18s, ease), smooth anchor scrolling and the loading skeleton's opacity pulse (1.6s, ease-in-out). There is no entrance choreography. Reduced-motion mode disables animation and transitions, restores immediate scrolling and fixes skeleton opacity at (0.7).

## Shapes

Use gently curved actions, framed cards and larger stages. The action, card and stage radii are normative in frontmatter. Fields and icon controls use the control radius; small badges use the badge radius. Neutral borders are generally (1px); current desktop navigation and selected filter tabs use a (2px) purple underline. The reading browser clips its frame, while the actual software crop keeps its native aspect ratio. Phone stages reduce their corners to (13px).

## Components

### Buttons

Direct and familiar. Primary actions use brand fill with white text in light mode and dark action ink in dark mode. Secondary actions use the page surface, primary text and a neutral border. Standard buttons have a (48px) minimum height, (15px, 600) type and the padding in frontmatter. Small variants use (8px 14px), (38px) minimum height and (13px) type. Primary hover changes fill; secondary hover changes surface and border. Focus uses a (3px) brand outline offset by (4px). Disabled buttons use (0.6) opacity and a wait cursor.

### Inputs / Fields

Search fields are quiet inset surfaces with a one-pixel border. The document search field uses the frontmatter padding and (16px) input type; marketplace search uses (11px 14px), action corners and (13px) type, rising to (14px) on phones. Focus-within changes the border to brand. Keep explicit accessible names, visible placeholders and the brand caret. The document search dialog supports Ctrl/Cmd K, result arrow keys and Escape, and restores focus to its opener.

### Navigation

Desktop main navigation uses muted labels and a brand underline for the current page. Document navigation uses compact rounded rows, a violet wash for the current page and a neutral surface on hover. On phones, the main menu expands below the header; document navigation becomes a drawer beneath its sticky toolbar. Preserve `aria-current`, expanded state and visible keyboard focus.

### Badges and Filters

Official plugin badges use violet wash and violet ink; community badges use inset surface and muted ink. Category filters are underline tabs with `aria-pressed`, not filled pills. Category labels and versions remain small supporting metadata.

### Cards / Containers

Plugin cards use the card radius, one-pixel neutral border and frontmatter inset. Hover mixes brand into the border without lifting the card. A column layout pins category/version and actions beneath the description. Source and download actions remain explicit; plugin failures show a retry notice while successful cards remain available.

### Reading Scene and Media

Live semantic sample text and a static selected phrase explain the interaction; the scene is explicitly labeled as a demonstration. The adjacent software window is the authentic `public/media/hero-translation.webp` crop, not recreated UI. OCR uses `public/media/ocr-preview.webp`. Retain intrinsic dimensions, meaningful alternative text and captions. Document recordings use controlled MP4 with `preload="none"`, `playsinline` and WebP posters; originals remain archived in `assets/recordings/` and are excluded from deployment. Media provenance lives in `.impeccable/media-manifest.md`.

## Do's and Don'ts

### Do:

- **Do** preserve the original STranslate purple logo and use semantic theme roles.
- **Do** keep Chinese reading copy native sans, selectable and comfortably spaced.
- **Do** keep genuine media, explicit demonstration labels and complete in-flow captions.
- **Do** preserve keyboard focus, conventional navigation and reduced-motion behavior.
- **Do** update both design artifacts from the actual CSS and components after visual changes.

### Don't:

- **Don't** spread the sample article's Georgia heading style into the Chinese interface.
- **Don't** fabricate software UI, provider logos, testimonials or performance claims.
- **Don't** add autoplay, entrance choreography or decorative card shadows.
- **Don't** reintroduce Giscus, download mirrors, old-address aliases or a legacy-entry directory; downloads and feedback use GitHub and documentation uses the new task navigation.
