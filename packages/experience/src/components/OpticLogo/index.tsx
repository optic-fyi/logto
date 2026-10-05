import classNames from 'classnames';
import { useEffect, useId, useState } from 'react';

import styles from './index.module.scss';
import { aperturePath, wordmarkPaths } from './paths';

/** The whole sequence replays every 8s and rests on the finished lockup, same as the source. */
const replayIntervalMs = 8000;

type Props = {
  readonly className?: string;
};

/**
 * The animated OPTIC lockup. The eye opens, looks around, blinks and looks at you, then the name
 * comes out of the mark and shoulders it aside. Ported from `optic.fyi_animation/index.html`.
 *
 * Crescent and wordmark follow `currentColor`, so they invert with the theme. Reduced motion
 * parks the logo on its static lockup instead of playing the sequence.
 */
const OpticLogo = ({ className }: Props) => {
  // `useId` yields ids such as `:r1:`, which are awkward inside `url(#...)`.
  const id = useId().replace(/:/g, '');
  const [round, setRound] = useState(0);

  useEffect(() => {
    // `matchMedia` is missing in some environments (jsdom); there, just keep the replay loop.
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return;
    }

    // A fresh key remounts the svg, which restarts every animation from its first beat.
    const timer = setInterval(() => {
      setRound((current) => current + 1);
    }, replayIntervalMs);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <svg
      key={round}
      role="img"
      aria-label="Optic"
      className={classNames(styles.logo, className)}
      viewBox="0 0 543.18 266.78"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* The lid is subtracted from the eyeball; sliding it in cuts the crescent. */}
        <mask
          id={`${id}-lid`}
          maskUnits="userSpaceOnUse"
          x="-600"
          y="-600"
          width="2400"
          height="1800"
        >
          <rect x="-600" y="-600" width="2400" height="1800" fill="#fff" />
          <g className={styles.gap}>
            <circle className={styles.lid} cx="168.035" cy="67.774" r="75.08" fill="#000" />
          </g>
        </mask>
        {/* Hides the name where the mark is over it. Travels with the mark. */}
        <mask
          id={`${id}-behind`}
          maskUnits="userSpaceOnUse"
          x="-600"
          y="-600"
          width="2400"
          height="1800"
        >
          <rect x="-600" y="-600" width="2400" height="1800" fill="#fff" />
          <g className={styles.shift}>
            <circle cx="118" cy="117.809" r="100" fill="#000" />
          </g>
        </mask>
        {/* The eye aperture. Only what falls inside it is visible. */}
        <mask
          id={`${id}-lids`}
          maskUnits="userSpaceOnUse"
          x="-600"
          y="-600"
          width="2400"
          height="1800"
        >
          <g className={styles.apOpen}>
            <g className={styles.apBlink}>
              <path d={aperturePath} transform="rotate(45 98.201 137.608)" fill="#fff" />
            </g>
          </g>
        </mask>
      </defs>
      <g mask={`url(#${id}-behind)`}>
        <g className={styles.word}>
          {wordmarkPaths.map((path) => (
            <g key={path} className={styles.letter}>
              <path d={path} />
            </g>
          ))}
        </g>
      </g>
      <g className={styles.shift}>
        <g mask={`url(#${id}-lids)`}>
          <g className={styles.eye}>
            <circle
              className={styles.ball}
              cx="118"
              cy="117.809"
              r="100"
              mask={`url(#${id}-lid)`}
            />
            <g className={styles.gaze}>
              <circle className={styles.pupil} cx="171.553" cy="64.256" r="36.96" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default OpticLogo;
