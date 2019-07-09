import html from 'rollup-plugin-bundle-html';
import sass from 'rollup-plugin-sass';
import { terser } from 'rollup-plugin-terser';
import fs from 'fs';
import wi from 'web-resource-inliner';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import cssImport from 'postcss-import';
import cssnano from 'cssnano';
import crypto from 'crypto';

export default {
    input: 'index.js',
    output: {
        format: 'iife',
        file: 'dist/bundle.js'
    },
    plugins: [
        sass({
            output: true,
            processor: css => postcss([
                cssImport(),
                autoprefixer(),
                cssnano({
                    preset: ['default', { discardComments: { removeAll: true } }]
                })
            ]).process(css, { from: undefined }).then(result => result.css)
        }),
        terser(),
        html({
            template: 'template.html',
            dest: 'dist',
            filename: 'index.html'
        }),
        {
            writeBundle() {
                wi.html({ fileContent: fs.readFileSync('./dist/index.html', 'utf-8'), relativeTo: './dist' }, function (err, content) {
                    if (err) {
                        console.error(err);
                    } else {
                        fs.writeFileSync('index.html', content);
                        fs.writeFileSync('app.appcache', 'CACHE MANIFEST\n# ' + crypto.createHash('md5').update(content).digest('base64'));
                    }
                });
            }
        }
    ]
};