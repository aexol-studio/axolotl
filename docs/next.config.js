/** @type {import('next').NextConfig} */
const NextConfig = {
  images: {
    unoptimized: true,
  },
  output: 'export',
};
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  ...NextConfig,
});

module.exports = withNextra();
