import { generateDarkColor } from '@logto/core-kit';
import { Theme } from '@logto/schemas';

/**
 * Logto seeds every tenant with this primary colour (`defaultPrimaryColor` in
 * `@logto/schemas`, whose seed also derives the dark colour from it). A tenant that still has it
 * has not customised its branding, so it gets the Optic palette instead.
 *
 * Kept as a literal because `@logto/schemas` exports it from a server-only seeds entry.
 */
const logtoSeedPrimaryColor = '#6139F6';

/** The CSS custom properties that make the Optic UI kit's "primary" role follow a brand colour. */
export type BrandCssVariables = Readonly<Record<`--${string}`, string>>;

type RgbChannels = readonly [red: number, green: number, blue: number];

const hexPattern = /^#(?:[\da-f]{3}|[\da-f]{6})$/i;

/**
 * Parses `#rgb` / `#rrggbb` into 0-255 channels.
 *
 * @precondition `hex` matches `hexPattern`.
 */
const parseHex = (hex: string): RgbChannels => {
  const digits = hex.slice(1);
  const full = digits.length === 3 ? [...digits].map((digit) => digit + digit).join('') : digits;

  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ];
};

const toHex = ([red, green, blue]: RgbChannels): string =>
  `#${[red, green, blue]
    .map((channel) => Math.round(channel).toString(16).padStart(2, '0'))
    .join('')}`;

/** Undoes sRGB gamma for one 0-255 channel (WCAG 2.x), returning 0-1. */
const linearChannel = (channel: number): number => {
  const value = channel / 255;
  return value <= 0.039_28 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

/** WCAG relative luminance, 0 (black) to 1 (white). */
const luminance = ([red, green, blue]: RgbChannels): number =>
  0.2126 * linearChannel(red) + 0.7152 * linearChannel(green) + 0.0722 * linearChannel(blue);

/** WCAG contrast ratio between two colours, 1 (identical) to 21 (black on white). */
const contrast = (first: RgbChannels, second: RgbChannels): number => {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);

  return (
    (Math.max(firstLuminance, secondLuminance) + 0.05) /
    (Math.min(firstLuminance, secondLuminance) + 0.05)
  );
};

const black: RgbChannels = [0, 0, 0];
const white: RgbChannels = [255, 255, 255];

/** Black or white, whichever reads better on `background`. */
const readableInk = (background: RgbChannels): string =>
  contrast(background, black) >= contrast(background, white) ? '#000000' : '#ffffff';

/** Scales each channel towards black; `amount` 0 keeps the colour, 1 gives black. */
const shade = ([red, green, blue]: RgbChannels, amount: number): RgbChannels => [
  red * (1 - amount),
  green * (1 - amount),
  blue * (1 - amount),
];

/**
 * Whether `hex` is a colour we can derive a palette from, and not Logto's stock purple.
 * An unparseable value is treated as "not customised" so a bad config falls back to Optic.
 */
const isCustomColor = (hex: string | undefined, stock: string): hex is string =>
  hex !== undefined && hexPattern.test(hex) && toHex(parseHex(hex)) !== toHex(parseHex(stock));

/**
 * Maps a tenant's brand colour onto the Optic UI kit's variables, or returns `undefined` when the
 * tenant has not customised it (so the kit's own `theme.css` palette applies untouched).
 *
 * Why the kit's variables: the primary button paints `var(--primary)` and its ledge
 * `var(--primary-deep)` (see `shared/components/Button/index.module.scss`), so `--primary` must
 * equal the tenant colour exactly. `--color-brand-*` follow it for links and focus rings.
 *
 * @precondition none; any string is accepted for either colour.
 * @postcondition when defined, `--primary` is the tenant's colour for `theme` (the dark colour
 * falls back to `generateDarkColor(primaryColor)` as Logto does, when none is set), and
 * `--primary-foreground` is black or white, whichever has the higher contrast on it.
 */
export const getBrandCssVariables = ({
  primaryColor,
  darkPrimaryColor,
  theme,
}: {
  readonly primaryColor: string | undefined;
  readonly darkPrimaryColor: string | undefined;
  readonly theme: Theme;
}): BrandCssVariables | undefined => {
  const stockDark = generateDarkColor(logtoSeedPrimaryColor);
  const isDark = theme === Theme.Dark;

  const chosen = isDark
    ? (darkPrimaryColor ??
      (isCustomColor(primaryColor, logtoSeedPrimaryColor)
        ? generateDarkColor(primaryColor)
        : undefined))
    : primaryColor;

  if (!isCustomColor(chosen, isDark ? stockDark : logtoSeedPrimaryColor)) {
    return undefined;
  }

  const channels = parseHex(chosen);
  const brand = toHex(channels);

  return {
    '--primary': brand,
    '--primary-deep': toHex(shade(channels, 0.2)),
    '--primary-foreground': readableInk(channels),
    '--color-brand-default': brand,
    '--color-brand-hover': toHex(shade(channels, 0.1)),
    '--color-brand-pressed': toHex(shade(channels, 0.2)),
  };
};
