import classNames from 'classnames';
import type { InputHTMLAttributes, Ref } from 'react';
import { forwardRef } from 'react';

import styles from './index.module.scss';

export type Props = {
  readonly size?: 'small' | 'default';
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>;

/**
 * The site's `.consent input` checkbox: the native control in the amber accent color, so it
 * looks the same as on the parent dashboard's sign-up form.
 */
const Checkbox = (
  { disabled, size = 'default', className, ...rest }: Props,
  ref: Ref<HTMLInputElement>
) => {
  return (
    <div className={styles.checkbox}>
      <input
        type="checkbox"
        disabled={disabled}
        className={classNames(styles.input, size === 'small' && styles.small, className)}
        {...rest}
        ref={ref}
        readOnly
      />
    </div>
  );
};

export default forwardRef<HTMLInputElement, Props>(Checkbox);
