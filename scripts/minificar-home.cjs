const fs = require("node:fs");
const { transformSync } = require("esbuild");

function minificar(codigo, loader) {
  return transformSync(codigo, {
    loader,
    minifyWhitespace: true,
    minifySyntax: true,
    legalComments: "inline",
  }).code.trimEnd();
}

const html = fs.readFileSync("index.html", "utf8");
const htmlMinificado = html.replace(/<style>([\s\S]*?)<\/style>/, (_, css) =>
  "<style>" + minificar(css, "css") + "</style>"
);

fs.writeFileSync("index.html", htmlMinificado);
for (const [arquivo, loader] of [["style.css", "css"], ["script.js", "js"]]) {
  const codigo = fs.readFileSync(arquivo, "utf8");
  fs.writeFileSync(arquivo, minificar(codigo, loader) + "\n");
}
