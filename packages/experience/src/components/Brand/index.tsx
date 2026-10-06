import classNames from 'classnames';
import { useId } from 'react';

import styles from './index.module.scss';

type Props = {
  readonly className?: string;
};

/**
 * The Optic brand lockup: the eye mark and the `Optic.fyi` name, markup copied from the optic.fyi
 * site header (`optic-main/index.html`) and the parent dashboard's `Brand`.
 *
 * The mark blinks every 8 seconds and the eye comes round to look at the cursor on hover. Both
 * come from the vendored `brand.css`, which targets the global `.brand` / `.brand__mark` / `.bm-*`
 * class names, so those names are kept as plain strings next to the scoped ones.
 *
 * Shown as the header logo whenever the tenant or application has not configured its own.
 */
const Brand = ({ className }: Props) => {
  // The lid mask is referenced by id; several marks on one page must not share it.
  const maskId = `bm-lid-${useId().replace(/:/g, '')}`;

  return (
    <span className={classNames('brand', styles.brand, className)} role="img" aria-label="Optic">
      <svg className="brand__mark" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="-300" y="-300" width="800" height="800">
            <rect x="-300" y="-300" width="800" height="800" fill="#fff" />
            <g className="bm-gap">
              <circle cx="150.035" cy="49.965" r="75.08" fill="#000" />
            </g>
          </mask>
        </defs>
        <g className="bm-eye">
          <circle cx="100" cy="100" r="100" fill="currentColor" mask={`url(#${maskId})`} />
          <g className="bm-gaze">
            <circle className="brand__pupil" cx="153.553" cy="46.447" r="36.96" />
          </g>
        </g>
      </svg>
      <span className={styles.name}>
        Optic<span className={styles.dot}>.fyi</span>
      </span>
    </span>
  );
};

export default Brand;
