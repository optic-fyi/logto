import type { ReactElement } from 'react';

import ConfirmModalProvider from '../ConfirmModalProvider';
import IframeModalProvider from '../IframeModalProvider';
import ToastProvider from '../ToastProvider';

import AppMeta from './AppMeta';

type Props = {
  readonly children: ReactElement;
};

const AppBoundary = ({ children }: Props) => {
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
