---
"@logto/experience": minor
---

restyle the sign-in experience in the OPTIC design language

The sign-in experience now uses the OPTIC theme ("soft brutalism on grid paper") shared with the OPTIC parent and kid dashboards: honey/cream palette in light and dark, Nunito, 2px borders with hard offset shadows, and grid-paper pages. Motion follows the OPTIC kit (ledged buttons that lift on hover and press flush, staggered fade-up entrances, dialog and toast animations) and respects `prefers-reduced-motion`.

When no logo is configured, the header shows the animated OPTIC lockup, and the favicon defaults to the OPTIC mark. A logo or favicon configured in the sign-in experience still takes precedence.

The primary color configured in the Console sign-in experience is no longer applied to the sign-in experience: the brand color is fixed to the OPTIC honey.
