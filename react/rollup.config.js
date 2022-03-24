import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import styles from 'rollup-plugin-styles'

const getByFormat = (format, outDir) => {
    return {
        external: [/node_modules/],
        input: "src/index.ts",
        output: {
            dir: outDir,
            format: format,
            preserveModules: true,
            preserveModulesRoot: "src",
            exports: "named"
        },
        plugins: [
            external(),
            resolve({}),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json',
                compilerOptions: {
                    "declaration": true,
                    "outDir": outDir
                }
            }),
            styles({
                mode: "extract",
                less: {
                    javascriptEnabled: true
                }
            })
        ]
    }
}

export default [
    getByFormat("cjs", "lib"),
    getByFormat("esm", "es")
]