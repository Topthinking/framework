export default {
  esbuild: {
    jsxFactory: "jsx",
    jsxFragment: "Fragment",
    target: "es2020",
    format: "esm",
    jsxInject: `import { jsx } from '../src'`,
  },
  server: {
    port: 3000,
  },
};
