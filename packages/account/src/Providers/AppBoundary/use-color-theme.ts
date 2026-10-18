import PageContext from '@/Providers/PageContextProvider/PageContext';
import { getBrandCssVariables } from '@experience/shared/utils/brand-color';
import { useContext, useEffect } from 'react';

/**
 * Applies the tenant's brand colour on top of the Optic palette. Does nothing while the tenant is
 * on Logto's stock colours, so Optic's `theme.css` stays in charge by default.
 *
 * Mirrors `experience/src/Providers/AppBoundary/use-color-theme.ts`; the two differ only in which
 * `PageContext` they read, and the colour logic lives in the shared `getBrandCssVariables`.
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
