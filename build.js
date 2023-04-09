const esbuild = require("esbuild");
const purgecssPlugin = require("esbuild-plugin-purgecss");

esbuild
    .build({
	    plugins: [purgecssPlugin()],
        entryPoints: ['index.js'],
        bundle: true,
        minify: true,
        outfile: 'dist/bundle.js',
	    metafile: true
    })
    .catch((e) => console.error(e.message));