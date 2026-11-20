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

const postcss = require('postcss');
const mobile = '(max-width: 767px)';
const homeCSS = /<link rel="stylesheet" href="(\/style\.css\?v=[^"]+)" \/>/;
const styleURL = html.match(homeCSS)?.[1];
const heroEnd = html.indexOf('</section>', html.indexOf('<section class="hero">'));
if (!styleURL || heroEnd < 0) throw new Error('Home stylesheet or hero section missing.');

// Keep the cascade and responsive rules from the source of truth. Including extra
// rules is safe: the full sheet takes over before the scroll scripts measure layout.
const firstScreen = html.slice(html.indexOf('<body>'), heroEnd);
const names = new Set(['preloader-ativo', 'scrolled', 'ativo']);
for (const attribute of firstScreen.matchAll(/(?:class|id)="([^"]+)"/g)) {
  for (const name of attribute[1].split(/\s+/)) names.add(name);
}
const critical = postcss.parse(readFileSync('dist/style.css', 'utf8'));
critical.walkAtRules('media', rule => {
  if (rule.params.split(',').every(query => {
    const minimum = query.match(/\(min-width:\s*(\d+)px\)/);
    return minimum && Number(minimum[1]) >= 768 && !/\bnot\b/.test(query);
  })) rule.remove();
});
critical.walkRules(rule => {
  if (rule.parent.type === 'atrule' && rule.parent.name.endsWith('keyframes')) return;
  const applies = rule.selectors.some(selector => {
    const tokens = [...selector.matchAll(/[.#]([\w-]+)/g)];
    return !tokens.length || tokens.some(([, name]) => names.has(name));
  });
  if (!applies) rule.remove();
});
critical.walkAtRules(rule => { if (rule.nodes?.length === 0) rule.remove(); });
const headStyles = '<style media="' + mobile + '">' + critical.toString() + '</style>' +
  '<link rel="stylesheet" media="(min-width: 768px)" href="' + styleURL + '">';
const bodyStyles = '<link rel="stylesheet" media="' + mobile + '" href="' + styleURL + '">';
const compiled = html.replace(homeCSS, () => headStyles)
  .replace('<!-- DIVISOR ANIMADO HERO', bodyStyles + '\n      <!-- DIVISOR ANIMADO HERO')
  .replace(lenisLink, () => `<style>${lenisCss}</style>`);
writeFileSync('dist/index.html', compiled);
