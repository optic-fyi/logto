# @logto/experience

The register and sign-in experience for end-users.

## OPTIC theme

This fork renders the sign-in experience in the OPTIC design system, the one behind optic.fyi and the parent dashboard (`design/` and `optic-main/` in the OPTIC monorepo). It follows the rules in `design/README.md`: one source of truth, the marketing site's values are canonical, and each concept is defined once.

- **Tokens are vendored, not rewritten.** `src/shared/styles/optic/tokens.css` and `brand.css` are verbatim copies of `design/src/tokens.css` and `design/src/brand.css`. To update the look, re-copy them. Logto's own `--color-*` variables in `src/shared/scss/_colors.scss` are only a mapping onto those tokens (no literal colors), and `html[data-theme]`, which Logto already sets, flips light and dark.
- **White page, gold highlights.** `src/shared/styles/optic/app-theme.css` overrides a handful of tokens on top of the vendored ones: a white page and card in light mode, and the solid button in gold in both modes. It mirrors section 1 of the dashboard's `apps/parent-dashboard/src/styles/dashboard.css`, so signing in and using the dashboard read as one product. Keep the two in step.
- **The primitives match the site.** Each component's SCSS restates the geometry of the matching primitive in `design/src/components.css` using only tokens: the pill button (padding 13px 24px, lifts 2px on hover), the input (1px hairline, `--radius-sm`, amber focus ring), the link (ink with an amber underline), the card (`.auth-card` in `optic-main/app/app.css`), toasts, dialogs and the checkbox.
- **Type** is Inter Variable, bundled in `src/shared/assets/fonts/` (SIL OFL licence alongside). The system stack stays as the fallback for scripts Inter does not cover, since Logto is localized.
- **Motion** is the site's: page content fades up out of a blur, one beat after the previous element (`fade-up-children` in `src/shared/scss/_underscore.scss`); dialogs rise in as `.modal--anim` does; buttons lift on hover. `prefers-reduced-motion` parks everything.
- **Brand mark.** `src/components/Brand` renders the site header's eye mark and `Optic.fyi` name. The mark blinks every 8 seconds and the eye comes round to look at the cursor on hover, both from the vendored `brand.css`. It is the header logo whenever the tenant or application has not set one; a configured logo still wins.
- **The brand color is fixed.** The primary color configured in the Console sign-in experience is no longer applied to this app: gold is paired with ink at a fixed contrast, and an arbitrary color would break it. Logos, favicon and custom CSS from the sign-in experience still work.
- **Favicon**: `src/shared/assets/favicon.png`, `apple-touch-icon.png` and `src/favicon.ico` are the OPTIC mark. A favicon configured in the sign-in experience still takes precedence.

### Previewing without a Logto core

`pnpm dev` serves the app on `:5001`, but it needs a parent window to post the sign-in experience config (the Console does this for its live preview, see `isTrustedPreviewMessage`). Embed `http://localhost:5001/sign-in?preview=true` in an iframe and `postMessage({ sender: 'ac_preview', config }, '*')` with a `PreviewConfig` (`mockSignInExperienceSettings` in `src/__mocks__/logto.tsx` is a good start). Preview mode disables pointer events by design, so hover and press states need that override in a test frame.
