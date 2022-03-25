import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss'

let builds = [
    {
        "format": "cjs",
        "outDir": "lib"
    },
    {
        "format": "esm",
        "outDir": "es"
    }
]
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
            commonjs({}),
            typescript({
                tsconfig: './tsconfig.json',
                compilerOptions: {
                    "declaration": true,
                    "outDir": outDir
                },
                exclude: [
                    "node_modules",
                    ...builds.map(t => t.outDir)
                ]
            }),
            postcss({
                inject: ((cssVariableName, id) => ""),
                plugins: []
            })
        ]
    }
}
export default builds.map(t => getByFormat(t.format, t.outDir))