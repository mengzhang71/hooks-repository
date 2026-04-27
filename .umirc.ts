export default {
  publicPath: '/hooks-repository/',
  base: '/hooks-repository/',
  webpack5: {},
  chainWebpack(memo) {
    memo.resolve.alias.set('encodeHooks', require('path').resolve(__dirname, './packages/hooks/src/index.ts'));
    memo.resolve.alias.set('encode-hooks', require('path').resolve(__dirname, './packages/hooks/src/index.ts'));
  },
};
