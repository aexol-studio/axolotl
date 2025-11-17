import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';
import packageJson from '../package.json';

const config: DocsThemeConfig = {
  logo: (
    <div className="flex items-center gap-2">
      <img className="h-4" src="/axolotl-logo.png" />
      <span className="font-semibold">v.{packageJson.version}</span>
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
      <div className="p-4 text-center border-t border-gray-200 dark:border-gray-800">
        <a
          href="https://aexol.com"
          className="text-gray-600 dark:text-gray-400 hover:text-dev-purple-500 dark:hover:text-dev-purple-400 transition-colors font-medium"
        >
          Aexol
        </a>
      </div>
    ),
  },
  sidebar: {
    autoCollapse: true,
    defaultMenuCollapseLevel: 1,
  },
  primaryHue: {
    dark: 270, // Purple hue for dark mode
    light: 220, // Blue hue for light mode
  },
  primarySaturation: {
    dark: 70,
    light: 80,
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Axolotl GraphQL Framework',
    };
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Axolotl - Type-safe GraphQL framework for modern developers" />
      <meta name="og:title" content="Axolotl GraphQL Framework" />
    </>
  ),
  banner: {
    dismissible: true,
    key: 'modern-2026-update',
  },
};

export default config;
