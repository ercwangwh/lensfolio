// const withPlugins = require('next-compose-plugins');
// const withTM = require('next-transpile-modules')(['@tailwindcss/typography']);

module.exports = {
  reactStrictMode: true,
  // env: { apiKey: process.env.NEXT_PUBLIC_TINYMCE_API_KEY },
  experimental: {
    transpilePackages: ['ui']
  }
};
