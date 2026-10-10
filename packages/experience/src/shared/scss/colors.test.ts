import { readFileSync } from 'node:fs';
import path from 'node:path';

// Jest runs from the package root (`rootDir`), so this resolves independently of module format.
const scss = readFileSync(path.join(process.cwd(), 'src/shared/scss/_colors.scss'), 'utf8');

type Tokens = Record<string, string>;
type Mode = 'light' | 'dark';

const stripComments = (source: string) =>
  source.replaceAll(/\/\*[\S\s]*?\*\//g, '').replaceAll(/\/\/.*$/gm, '');

/** Returns the custom properties declared in `@mixin <name> { ... }`, without comments. */
const readMixin = (name: Mode | 'static'): Tokens => {
  const start = scss.indexOf(`@mixin ${name} {`);
  const end = scss.indexOf('\n}', start);

  if (start === -1 || end === -1) {
    throw new Error(`_colors.scss: missing @mixin ${name}`);
  }

  return Object.fromEntries(
    [...stripComments(scss.slice(start, end)).matchAll(/--([\w-]+):\s*([^;]+);/g)].map(
      ([, key, value]) => [key, value?.trim()]
    )
  ) as Tokens;
};

/** Follows `var(--other)` chains until a literal is reached. */
const resolveToken = (tokens: Tokens, name: string, trail: string[] = []): string => {
  const value = tokens[name];

  if (value === undefined) {
    throw new Error(`--${name} is not defined (reached via ${trail.join(' -> ') || 'root'})`);
  }

  const reference = /^var\(--([\w-]+)\)$/.exec(value)?.[1];

  if (!reference) {
    return value;
  }

  if (trail.includes(name)) {
    throw new Error(`--${name} is part of a reference cycle: ${[...trail, name].join(' -> ')}`);
  }

  return resolveToken(tokens, reference, [...trail, name]);
};

const toLinear = (channel: number) => {
  const normalized = channel / 255;
  return normalized <= 0.039_28 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
};

/** WCAG 2.x relative luminance of a `#RRGGBB` colour. */
const luminance = (color: string) => {
  const [red = 0, green = 0, blue = 0] = [1, 3, 5].map((offset) =>
    toLinear(Number.parseInt(color.slice(offset, offset + 2), 16))
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

/** WCAG contrast ratio (1..21) between two `#RRGGBB` colours. */
const contrast = (first: string, second: string) => {
  const [lighter = 0, darker = 0] = [luminance(first), luminance(second)]
    .slice()
    .sort((left, right) => right - left);
  return (lighter + 0.05) / (darker + 0.05);
};

const resolveHex = (tokens: Tokens, name: string) => {
  const value = resolveToken(tokens, name);

  if (!/^#[\da-f]{6}$/i.test(value)) {
    throw new Error(`--${name} must resolve to #RRGGBB to be contrast-checked, got ${value}`);
  }

  return value;
};

/** Tokens that carry text, links and icons. */
const textTokens = [
  'color-type-primary',
  'color-type-secondary',
  'color-type-link',
  'color-brand-default',
  'color-danger-default',
];

/** Surfaces those tokens are drawn on. */
const surfaceTokens = [
  'color-bg-body',
  'color-bg-float',
  'color-bg-layer-1',
  'color-bg-layer-2',
  'color-bg-body-base',
];

const modes: Mode[] = ['light', 'dark'];

/** Every [text token, surface token] combination that must be readable. */
const textSurfacePairs: Array<[string, string]> = textTokens.flatMap((text) =>
  surfaceTokens.map((surface): [string, string] => [text, surface])
);

const tokenNames = (mode: Mode) => Object.keys(readMixin(mode));

describe('Optic color tokens', () => {
  describe.each(modes)('%s theme', (mode) => {
    const tokens = readMixin(mode);

    // If this fails: a text/link/danger colour became unreadable on a surface it is drawn on.
    it.each(textSurfacePairs)('should keep %s at WCAG AA (4.5:1) on %s', (text, surface) => {
      expect(
        contrast(resolveHex(tokens, text), resolveHex(tokens, surface))
      ).toBeGreaterThanOrEqual(4.5);
    });

    // If this fails: a token points at a name that does not exist, so the property silently drops.
    it('should resolve every var() reference to a defined token', () => {
      for (const name of Object.keys(tokens)) {
        expect(() => resolveToken(tokens, name)).not.toThrow();
      }
    });

    // If this fails: a gradient or blur crept back in, breaking the matte design language.
    it('should not use gradients or blur', () => {
      const declarations = Object.values(tokens).join('\n');

      expect(declarations).not.toMatch(/gradient|blur\(/);
    });
  });

  // If this fails: dark mode renders a property with no value because only light defines the token.
  it('should define every light-theme token in the dark theme too', () => {
    const darkKeys = new Set(tokenNames('dark'));

    expect(tokenNames('light').filter((key) => !darkKeys.has(key))).toEqual([]);
  });
});
