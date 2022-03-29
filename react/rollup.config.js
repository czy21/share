import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import copy from "rollup-plugin-copy";

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
const getFormat = (t) => {
    return {
        external: [/node_modules/],
        input: "src/index.ts",
        output: {
            dir: t.outDir,
            format: t.format,
            preserveModules: true,
            preserveModulesRoot: "src",
            exports: "named"
        },
        cache: true,
        plugins: [
            external(),
            resolve({}),
            commonjs({}),
            typescript({
                tsconfig: 'tsconfig.json',
                compilerOptions: {
                    "declaration": true,
                    "outDir": t.outDir
                },
                exclude: [
                    "node_modules",
                    ...builds.map(t => t.outDir)
                ]
            }),
            copy({targets: [{src: "src/**/*.less", dest: t.outDir}], flatten: false})
        ]
    }
}
export default builds.map(t => getFormat(t))
