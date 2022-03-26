import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import postcss_less from 'postcss-less'
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
        plugins: [
            external(),
            postcss({
                extract: true,
                autoModules: true,
                modules: {
                    generateScopedName: function (name, filename, css) {
                        const component_name = path.basename(path.resolve(filename, ".."))
                        return `ctm-${component_name}-${name}`;
                    }
                },
                stringifier:(args => {
                    console.log(args)
                }),
                use: {
                    sass: null,
                    stylus: null,
                    less: {
                        javascriptEnabled: true,
                        lessOptions: (loaderContext) => {
                            console.log(loaderContext)
                        }
                    }
                }
            }),
            resolve({browser:true}),
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
        ]
    }
}
export default builds.map(t => getFormat(t))