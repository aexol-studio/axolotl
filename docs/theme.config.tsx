import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="flex">
      <img style={{ borderRadius: '0.25rem' }} width="32" src="/axolotlicon.png" />
      <span>Axolotl v.0.6.2</span>
    </div>
  ),
  project: {
    link: 'https://github.com/aexol-studio/axolotl',
  },
  chat: {
    link: 'https://discord.gg/CgJYkntsbS',
  },
  docsRepositoryBase: 'https://github.com/aexol-studio/axolotl/tree/main/docs',
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
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Axolotl GraphQL Framework',
    };
  },
};

export default config;
