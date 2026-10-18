import type { ReactElement } from 'react';

import ReauthPromptProvider from '../ReauthPromptProvider';
import ToastProvider from '../ToastProvider';

import AppMeta from './AppMeta';
import useColorTheme from './use-color-theme';

type Props = {
  readonly children: ReactElement;
};

const AppBoundary = ({ children }: Props) => {
  useColorTheme();

  return (
    <>
      <AppMeta />
      <ToastProvider>
        <ReauthPromptProvider>{children}</ReauthPromptProvider>
      </ToastProvider>
    </>
  );
};

export default AppBoundary;
