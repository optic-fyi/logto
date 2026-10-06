import classNames from 'classnames';

import styles from './index.module.scss';

type Props = {
  readonly className?: string;
};

/** The site's `.spinner` (`app/app.css`): a border-strong ring with an amber arc. */
const LoadingIcon = ({ className }: Props) => (
  <span className={classNames(styles.loadingIcon, className)} aria-hidden="true" />
);

export default LoadingIcon;
