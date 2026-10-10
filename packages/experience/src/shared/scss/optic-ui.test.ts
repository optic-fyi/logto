/** @jest-environment node */
import { execFileSync } from 'node:child_process';
import path from 'node:path';

/** Utility classes that kit components use; each must exist in the compiled CSS. */
const kitClasses = [
  'bg-primary',
  'text-primary-foreground',
  'border-border-strong',
  'bg-card',
  'text-mint-deep',
  'bg-destructive',
  'shadow-block',
  'shadow-ledge',
  'rounded-2xl',
  // From tw-animate-css, which the entry stylesheet reaches through the kit's own dependencies.
  'animate-in',
  'fade-in-0',
];

/**
 * Compiles `optic-ui.css` with Vite and the Tailwind plugin in a child process (both are ESM-only,
 * which jest's CommonJS runtime cannot load), scanning a fixture that uses `kitClasses`.
 */
const compileOpticUiCss = (): string =>
  execFileSync(
    process.execPath,
    [path.join(process.cwd(), 'src/shared/scss/compile-optic-ui.mjs'), ...kitClasses],
    {
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    }
  );

describe('optic-ui.css', () => {
  // eslint-disable-next-line @silverhand/fp/no-let -- assigned once in beforeAll and shared by the tests
  let css = '';

  beforeAll(() => {
    // eslint-disable-next-line @silverhand/fp/no-mutation -- see `css` above
    css = compileOpticUiCss();
  }, 120_000);

  // If this fails: a kit class compiles to nothing, so that kit component renders unstyled. One
  // cause is `--color-*: initial` running after the kit's tokens, which erases the kit's colors;
  // another is a stylesheet import (animate, tokens) that no longer resolves.
  it.each(kitClasses)('should generate the kit utility .%s', (className) => {
    expect(css).toContain(`.${className}`);
  });

  // If this fails: Tailwind's global reset leaked in and restyles every button, input, heading and
  // link in the apps' existing CSS-module styles.
  it('should not include Tailwind preflight', () => {
    expect(css).not.toContain('-webkit-text-size-adjust');
    expect(css).not.toContain('-webkit-appearance: button');
    expect(css).not.toContain('tab-size: 4');
  });

  // If this fails: Tailwind's palette is back and defines --color-neutral-50/100 on :root, which
  // collide with the same names Logto defines on body.
  it("should not define Tailwind's default color palette", () => {
    expect(css).not.toContain('--color-red-500');
    expect(css).not.toContain('--color-neutral-50:');
  });

  // If this fails: the kit palette no longer reaches the page, so kit components lose their colors.
  it("should define the kit's palette variables", () => {
    expect(css).toMatch(/--primary:\s*#dfaa56/i);
  });

  // If this fails: the Nunito font files are no longer bundled, so text falls back to system fonts.
  it('should bundle the Nunito variable font', () => {
    expect(css).toContain('font-family: Nunito Variable');
  });
});
