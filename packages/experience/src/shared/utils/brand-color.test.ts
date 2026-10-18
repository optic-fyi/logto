import { Theme } from '@logto/schemas';

import { getBrandCssVariables } from './brand-color';

/** Logto's seeded primary colour and its derived dark colour (`generateDarkColor('#6139F6')`). */
const stockLight = '#6139F6';
const stockDark = '#8768F8';

/** One channel of a `#rrggbb` colour, undoing sRGB gamma (WCAG 2.x). */
const linearChannel = (hex: string, index: number): number => {
  const value = Number.parseInt(hex.slice(index, index + 2), 16) / 255;
  return value <= 0.039_28 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

const relativeLuminance = (hex: string): number =>
  0.2126 * linearChannel(hex, 1) + 0.7152 * linearChannel(hex, 3) + 0.0722 * linearChannel(hex, 5);

/** WCAG contrast ratio between two `#rrggbb` colours. An independent copy of the formula, so the
 * test does not trust the implementation it checks. */
const contrastRatio = (first: string, second: string): number => {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);

  return (
    (Math.max(firstLuminance, secondLuminance) + 0.05) /
    (Math.min(firstLuminance, secondLuminance) + 0.05)
  );
};

const toHexByte = (value: number): string => value.toString(16).padStart(2, '0');

/** Every `#rrggbb` whose channels are multiples of 15 (and 255): 18^3 = 5,832 colours. */
const gridChannels = Array.from({ length: 18 }, (_, index) => Math.min(255, index * 15));
const colourGrid: readonly string[] = gridChannels.flatMap((red) =>
  gridChannels.flatMap((green) =>
    gridChannels.map((blue) => `#${toHexByte(red)}${toHexByte(green)}${toHexByte(blue)}`)
  )
);

describe('getBrandCssVariables', () => {
  // If this fails: a tenant that never customised branding loses the Optic palette to Logto purple.
  it.each([
    [Theme.Light, stockLight, stockDark],
    [Theme.Dark, stockLight, stockDark],
    [Theme.Light, stockLight.toLowerCase(), stockDark],
    [Theme.Dark, stockLight, undefined],
  ])(
    'leaves the Optic palette alone on stock colours (%s)',
    (theme, primaryColor, darkPrimaryColor) => {
      expect(getBrandCssVariables({ primaryColor, darkPrimaryColor, theme })).toBeUndefined();
    }
  );

  // If this fails: missing or malformed colours crash or paint garbage instead of falling back.
  it.each([undefined, '', 'red', '#12', '#12345', '#GGGGGG', 'rgb(0, 0, 255)'])(
    'falls back to Optic for an unusable colour %p',
    (primaryColor) => {
      expect(
        getBrandCssVariables({ primaryColor, darkPrimaryColor: undefined, theme: Theme.Light })
      ).toBeUndefined();
    }
  );

  // If this fails: the primary button no longer matches the tenant's colour exactly, which is what
  // the integration test `overrides.test.ts` asserts on `button[name="submit"]`.
  it('sets --primary to the tenant colour exactly in light mode', () => {
    expect(
      getBrandCssVariables({ primaryColor: '#00f', darkPrimaryColor: '#f0f', theme: Theme.Light })
    ).toMatchObject({ '--primary': '#0000ff', '--color-brand-default': '#0000ff' });
  });

  // If this fails: dark mode shows the light colour (or the wrong one).
  it('uses the dark colour in dark mode', () => {
    expect(
      getBrandCssVariables({ primaryColor: '#00f', darkPrimaryColor: '#f0f', theme: Theme.Dark })
    ).toMatchObject({ '--primary': '#ff00ff' });
  });

  // If this fails: a tenant with only a light colour gets Optic honey in dark mode, mixing palettes.
  it('derives a dark colour from the light one when no dark colour is set', () => {
    // GenerateDarkColor('#0000ff') lightens HSL lightness by 10 points.
    expect(
      getBrandCssVariables({
        primaryColor: '#0000ff',
        darkPrimaryColor: undefined,
        theme: Theme.Dark,
      })
    ).toMatchObject({ '--primary': '#3333ff' });
  });

  // If this fails: a tenant that customised only the dark colour is ignored in dark mode.
  it('honours a custom dark colour even when the light colour is stock', () => {
    expect(
      getBrandCssVariables({
        primaryColor: stockLight,
        darkPrimaryColor: '#ff0000',
        theme: Theme.Dark,
      })
    ).toMatchObject({ '--primary': '#ff0000' });
  });

  // If this fails: button text becomes unreadable on light or dark brand colours.
  it.each([
    ['#ffff00', '#000000'],
    ['#ffffff', '#000000'],
    ['#000080', '#ffffff'],
    ['#000000', '#ffffff'],
  ])('picks readable ink for %s', (primaryColor, ink) => {
    expect(
      getBrandCssVariables({ primaryColor, darkPrimaryColor: undefined, theme: Theme.Light })
    ).toMatchObject({ '--primary-foreground': ink });
  });

  // If this fails: the button's ledge/border is the same as (or lighter than) its fill.
  it('makes --primary-deep darker than --primary', () => {
    expect(
      getBrandCssVariables({
        primaryColor: '#c8c8c8',
        darkPrimaryColor: undefined,
        theme: Theme.Light,
      })
    ).toMatchObject({ '--primary-deep': '#a0a0a0' });
  });

  // If this fails: dark brand colours (navy, slate, near-black) get an invisible ledge, because a
  // plain 20% darken barely moves them (fill-to-ledge contrast 1.02-1.26 vs the kit's 1.38+).
  it.each(['#111111', '#1e293b', '#0f172a', '#1e3a8a', '#14532d', '#450a0a', '#312e81', '#334155'])(
    'keeps the ledge visibly distinct from a dark fill %s',
    (primaryColor) => {
      const variables = getBrandCssVariables({
        primaryColor,
        darkPrimaryColor: undefined,
        theme: Theme.Light,
      });

      expect(
        contrastRatio(variables?.['--primary'] ?? '', variables?.['--primary-deep'] ?? '')
      ).toBeGreaterThanOrEqual(1.38);
    }
  );

  // If this fails: some hue/lightness region has a ledge that blends into the button. Sweeps the
  // RGB cube (and both extremes) rather than trusting a hand-picked list.
  it('never lets the ledge fall below the contrast floor, anywhere in the colour space', () => {
    // A broad grid for regions nobody thought to list. The two colours that first exposed the
    // rounding bug are pinned separately below, since they are not on this grid.
    const failures = colourGrid.flatMap((primaryColor) => {
      const variables = getBrandCssVariables({
        primaryColor,
        darkPrimaryColor: undefined,
        theme: Theme.Light,
      });
      const ratio = contrastRatio(
        variables?.['--primary'] ?? '',
        variables?.['--primary-deep'] ?? ''
      );

      return ratio < 1.38 ? [`${primaryColor} -> ${ratio.toFixed(3)}`] : [];
    });

    expect(failures).toEqual([]);
  });

  // If this fails: the contrast floor is tested before hex rounding again. Both colours computed
  // to exactly 1.38 in floating point but landed at 1.379 once rounded to integer channels.
  it.each(['#602000', '#c02060'])('keeps %s above the floor after hex rounding', (primaryColor) => {
    const variables = getBrandCssVariables({
      primaryColor,
      darkPrimaryColor: undefined,
      theme: Theme.Light,
    });

    expect(
      contrastRatio(variables?.['--primary'] ?? '', variables?.['--primary-deep'] ?? '')
    ).toBeGreaterThanOrEqual(1.38);
  });

  // If this fails: a near-black brand colour gets a stark white ledge instead of a dark-grey one.
  // Both clear the contrast floor, so only the exact value tells them apart; pure black cannot be
  // darkened at all, which is why these fills are tinted lighter rather than shaded.
  it.each([
    ['#000000', '#262626'],
    ['#0a0a0a', '#2f2f2f'],
  ])('gives near-black %s a dark-grey ledge (%s), not white', (primaryColor, ledge) => {
    expect(
      getBrandCssVariables({ primaryColor, darkPrimaryColor: undefined, theme: Theme.Light })
    ).toMatchObject({ '--primary-deep': ledge });
  });

  // If this fails: the floor starts changing colours that already looked right, so branded
  // buttons shift for tenants nobody asked to change.
  it.each([
    ['#2563eb', '#1e4fbc'],
    ['#e11d48', '#b4173a'],
    ['#16a34a', '#12823b'],
  ])('leaves mid-tone %s on the plain 20%% shade', (primaryColor, ledge) => {
    expect(
      getBrandCssVariables({ primaryColor, darkPrimaryColor: undefined, theme: Theme.Light })
    ).toMatchObject({ '--primary-deep': ledge });
  });

  // If this fails: an extreme brand colour overflows a channel or produces an invalid hex.
  it.each(['#000000', '#ffffff'])(
    'emits valid 6-digit hex for every variable on %s',
    (primaryColor) => {
      const variables = getBrandCssVariables({
        primaryColor,
        darkPrimaryColor: undefined,
        theme: Theme.Light,
      });

      expect(variables).toBeDefined();

      for (const [name, value] of Object.entries(variables ?? {})) {
        expect({ name, valid: /^#[\da-f]{6}$/.test(value) }).toEqual({ name, valid: true });
      }
    }
  );
});
