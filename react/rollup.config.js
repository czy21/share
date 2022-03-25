import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import babel from 'rollup-plugin-babel';
import postcss_modules from 'postcss-modules'
import path from "path";

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
const getFormat = (format, outDir) => {
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
            postcss({
                extract: true,
                autoModules: true,
                modules: {
                    generateScopedName: function (name, filename, css) {
                        let path = require("path");
                        const lib_name = path.basename(path.resolve(filename, ".."))
                        return `ctm-${lib_name}-${name}`;
                    }
                },
                use: {
                    sass: null,
                    stylus: null,
                    less: {
                        javascriptEnabled: true
                    }
                },
            }),
            babel({exclude: 'node_modules/**'}),
            resolve({extensions: [".css"]}),
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
        ]
    }
}
export default builds.map(t => getFormat(t.format, t.outDir))