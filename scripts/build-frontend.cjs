const { mkdirSync, readFileSync, writeFileSync } = require('node:fs');
const { transformSync } = require('esbuild');

mkdirSync('dist', { recursive: true });

for (const [file, loader] of [['style.css', 'css'], ['script.js', 'js']]) {
  const source = readFileSync(file, 'utf8');
  const result = transformSync(source, {
    loader,
    sourcefile: file,
    minifyWhitespace: true,
    // Keep CSS transformations unchanged; minify JS syntax and local names too.
    minifySyntax: loader === 'js',
    minifyIdentifiers: loader === 'js',
    keepNames: loader === 'js',
  });
  writeFileSync(`dist/${file}`, result.code);
}

// Embed the pinned Lenis stylesheet at its original position in the cascade.
const html = readFileSync('index.html', 'utf8');
const lenisLink = /<link\s+rel="stylesheet"\s+href="https:\/\/unpkg\.com\/lenis@1\.1\.18\/dist\/lenis\.css"\s*\/>/;
if (!lenisLink.test(html)) {
  throw new Error('Expected Lenis stylesheet link was not found in index.html.');
}
const lenisCss = readFileSync('node_modules/lenis/dist/lenis.css', 'utf8');
writeFileSync('dist/index.html', html.replace(lenisLink, () => `<style>${lenisCss}</style>`));
