import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import styles from 'rollup-plugin-styles'

const packageJson = require('./package.json');

export default [
    {
        input: 'src/index.ts',
        external: [...Object.keys(packageJson.peerDependencies || {})],
        output: [
            {
                file: packageJson.main,
                format: 'cjs'
            },
            {
                file: packageJson.module,
                format: 'esm'
            }
        ],
        plugins: [
            external(),
            resolve(),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json'
            }),
            styles({
                less: {
                    javascriptEnabled: true
                }
            })
        ]
    }
]