import { render } from '@testing-library/react';

import { appLogo } from '@/__mocks__/logto';

import BrandingHeader from '.';

describe('BrandingHeader UI Component', () => {
  const appHeadline = 'description.sign_in_to_your_account';

  test('render logo with context', () => {
    const { queryByText, container, queryByRole } = render(
      <BrandingHeader logo={appLogo} headline={appHeadline} />
    );
    expect(queryByText(appHeadline)).not.toBeNull();
    expect(container.querySelector('img')).not.toBeNull();
    // A tenant-configured logo replaces the default brand mark.
    expect(queryByRole('img', { name: 'Optic' })).toBeNull();
  });

  test('fall back to the OPTIC logo when the tenant has no logo', () => {
    const { queryByText, container, queryByRole } = render(
      <BrandingHeader headline={appHeadline} />
    );
    expect(queryByText(appHeadline)).not.toBeNull();
    expect(queryByRole('img', { name: 'Optic' })).not.toBeNull();
    expect(container.querySelector('img')).toBeNull();
  });

  test('keep the third-party logo instead of the OPTIC logo', () => {
    const { container, queryByRole } = render(
      <BrandingHeader thirdPartyLogo={appLogo} headline={appHeadline} />
    );
    expect(container.querySelector('img[alt="third party logo"]')).not.toBeNull();
    expect(queryByRole('img', { name: 'Optic' })).toBeNull();
  });
});
