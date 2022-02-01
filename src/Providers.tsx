import React from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import '@/config';
import theme from '@/theme';

import { AVAILABLE_LANGUAGES } from './constants/i18n';

export const Providers = ({ children }) => {
  const { i18n } = useTranslation();

  return (
    <ChakraProvider
      theme={{
        ...theme,
        direction:
          AVAILABLE_LANGUAGES.find(({ key }) => key === i18n.language)?.dir ??
          'ltr',
      }}
    >
      {children}
    </ChakraProvider>
  );
};
