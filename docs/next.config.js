/** @type {import('next').NextConfig} */
const NextConfig = {
  images: {
    unoptimized: true,
  },
  output: 'export',
};
const withNextra = require('nextra').default({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

module.exports = withNextra(NextConfig);
