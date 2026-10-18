import type { ReactElement } from 'react';

import ConfirmModalProvider from '../ConfirmModalProvider';
import IframeModalProvider from '../IframeModalProvider';
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
      <IframeModalProvider>
        <ConfirmModalProvider>
          <ToastProvider>{children}</ToastProvider>
        </ConfirmModalProvider>
      </IframeModalProvider>
    </>
  );
};

export default AppBoundary;
