import { Theme } from '@logto/schemas';

import { getBrandCssVariables } from './brand-color';

/** Logto's seeded primary colour and its derived dark colour (`generateDarkColor('#6139F6')`). */
const stockLight = '#6139F6';
const stockDark = '#8768F8';

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
