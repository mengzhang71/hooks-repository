import { resolve } from 'path';

export default {
  publicPath: '/hooks-repository/',
  base: '/hooks-repository/',
  exportStatic: {},
  resolve: {
    includes: ['docs', 'packages/hooks/src'],
  },
  chainWebpack(memo) {
    memo.resolve.alias.set('encodeHooks', resolve(__dirname, './packages/hooks/src/index.ts'));
    memo.resolve.alias.set('encode-hooks', resolve(__dirname, './packages/hooks/src/index.ts'));
  },
};
