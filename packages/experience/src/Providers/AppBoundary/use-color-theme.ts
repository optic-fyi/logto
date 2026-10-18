import { useContext, useEffect } from 'react';

import PageContext from '@/Providers/PageContextProvider/PageContext';
import { getBrandCssVariables } from '@/shared/utils/brand-color';

/**
 * Applies the tenant's brand colour on top of the Optic palette. Does nothing while the tenant is
 * on Logto's stock colours, so Optic's `theme.css` stays in charge by default.
 *
 * Writes to `document.body`, where the `--primary` / `--color-brand-*` overrides win over the
 * kit's `:root` / `.dark` values, and removes them on change so switching theme never leaves the
 * previous mode's colours behind.
 */
const useColorTheme = () => {
  const { theme, experienceSettings } = useContext(PageContext);
  const primaryColor = experienceSettings?.color.primaryColor;
  const darkPrimaryColor = experienceSettings?.color.darkPrimaryColor;

  useEffect(() => {
    const variables = getBrandCssVariables({ primaryColor, darkPrimaryColor, theme });

    if (!variables) {
      return;
    }

    const names = Object.keys(variables);

    for (const [name, value] of Object.entries(variables)) {
      document.body.style.setProperty(name, value);
    }

    return () => {
      for (const name of names) {
        document.body.style.removeProperty(name);
      }
    };
  }, [darkPrimaryColor, primaryColor, theme]);
};

export default useColorTheme;
