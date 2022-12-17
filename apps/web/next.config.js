module.exports = {
  reactStrictMode: true,
  experimental: {
    transpilePackages: ['ui']
  }
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://localhost:3001/:path*'
  //     }
  //   ];
  // }
};
