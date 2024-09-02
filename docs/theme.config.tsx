import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: (
    <div className="flex items-center gap-2">
      <img className="h-4" src="/axolotl-logo.png" />
      <span>v.0.x.x</span>
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
    component: (
      <div className="p-4 text-center">
        <a href="https://aexol.com">Aexol</a>
      </div>
    ),
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
