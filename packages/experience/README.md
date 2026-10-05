# @logto/experience

The register and sign-in experience for end-users.

## OPTIC theme

This fork renders the sign-in experience in the OPTIC design language ("soft brutalism on grid paper"), the same one as the OPTIC parent and kid dashboards (`@optic-fyi/ui` in the OPTIC monorepo).

- **Palette**: `src/shared/scss/_colors.scss`. The raw `--optic-*` tokens mirror `packages/ui/src/styles/theme.css`, and Logto's semantic `--color-*` variables point at them, so every existing component picks the palette up. Light and dark follow the existing `data-theme` switch. Honey is the brand color; sky is focus, mint is success, coral is destructive.
- **Brand color is fixed.** The primary color configured in the Console sign-in experience is no longer applied to this app (honey is paired with deep ink, and an arbitrary color would break that contrast). Logos, favicon and custom CSS from the sign-in experience still work.
- **Two values are not in the OPTIC palette**: `--optic-link` and `--optic-danger-text` are deeper shades of honey and coral, because the pastel originals are below 4.5:1 on cream and cannot carry text.
- **Type**: Nunito Variable (`@fontsource-variable/nunito`), headings and controls extrabold, body medium. The system stack stays as the fallback for scripts Nunito does not cover.
- **Surfaces**: 2px borders in the hue's deep shade, hard offset shadows (`--optic-shadow-block`, `-lg`), no blur or soft shadows, pages on 28px grid paper (`_.grid-paper` in `_underscore.scss`).
- **Motion** matches the OPTIC site and dashboards, and honors `prefers-reduced-motion`:
  - Buttons are keys: 4px ledge, lift 2px on hover, press flush (`shared/components/Button`).
  - Page content fades up out of a blur, staggered (`_.fade-up-children`, keyframes in `normalized.scss`). Global keyframes are referenced through `--optic-keyframes-*` custom properties because CSS modules rename keyframes and PostCSS cannot parse `:global()` inside `animation`.
  - Dialogs and dropdowns fade and zoom/slide in over 100ms; toasts rise in.
  - `components/OpticLogo` is the animated OPTIC lockup from the OPTIC logo animation (eye opens, looks around, blinks, looks at you, the name comes out). It is the default header logo when no logo is configured for the tenant or application.
- **Favicon**: `src/shared/assets/favicon.png`, `apple-touch-icon.png` and `src/favicon.ico` are the OPTIC mark. A favicon configured in the sign-in experience still takes precedence.

### Previewing without a Logto core

`pnpm dev` serves the app on `:5001`, but it needs a parent window to post the sign-in experience config (the Console does this for its live preview, see `isTrustedPreviewMessage`). Embed `http://localhost:5001/sign-in?preview=true` in an iframe and `postMessage({ sender: 'ac_preview', config }, '*')` with a `PreviewConfig` (`mockSignInExperienceSettings` in `src/__mocks__/logto.tsx` is a good start). Preview mode disables pointer events by design, so hover and press states need that override in a test frame.
