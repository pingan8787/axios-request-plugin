import { terser } from "rollup-plugin-terser";
import serve from 'rollup-plugin-serve';
import commonjs from '@rollup/plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/axios-request-plugin.umd.js',
    format: 'umd',
    name: 'axiosRequestPlugin',
    globals: {
      "axios": "axios",
      "qs": "qs"
    }
  },
  external: [ 'axios', 'qs' ],
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  },
  plugins: [
    commonjs(),
    resolve(),
    serve({
      open: true,
      port: 8000,
      openPage: '/dist/index.html',
      contentBase: ''
    }),
    // terser({ compress: { drop_console: true } }),
  ]
}