import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: <span>🦎 Axolotl v.0.6.2</span>,
  project: {
    link: 'https://github.com/aexol-studio/axolotl',
  },
  chat: {
    link: 'https://discord.gg/CgJYkntsbS',
  },
  docsRepositoryBase: 'https://github.com/aexol-studio/axolotl',
  footer: {
    component: <a href="https://aexol.com">Aexol</a>,
  },
  sidebar: {
    autoCollapse: true,
  },
  primaryHue: {
    dark: 160,
    light: 40,
  },
  primarySaturation: {
    dark: 80,
    light: 10,
  },
};

export default config;
