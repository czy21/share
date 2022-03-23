import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import {terser} from 'rollup-plugin-terser';
import external from 'rollup-plugin-peer-deps-external';

const packageJson = require('./package.json');

export default [
    {
        input: 'src/component/index.ts',
        external: [...Object.keys(packageJson.peerDependencies || {})],
        output: [
            {
                file: packageJson.main,
                format: 'cjs',
                sourcemap: true
            },
            {
                file: packageJson.module,
                format: 'esm',
                sourcemap: true
            }
        ],
        plugins: [
            external(),
            resolve(),
            commonjs(),
            typescript({tsconfig: './tsconfig.json'}),
            terser()
        ],
    }
]