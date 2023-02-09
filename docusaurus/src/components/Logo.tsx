import { useColorMode } from '@docusaurus/theme-common';
import React from 'react';

export default function Logo() {
  const isDarkTheme = useColorMode().colorMode === 'dark';
  return (
    <img
      src={`/images/navbar${isDarkTheme ? '-dark' : ''}-logo.svg`}
      alt="React Native Paper Logo"
    />
  );
}
