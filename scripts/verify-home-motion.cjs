// Offline rendering/scroll regression check. This is NOT a public PageSpeed test.
// Usage: node scripts/verify-home-motion.cjs BASELINE_SCRIPT OUTPUT_DIRECTORY
// Requires puppeteer-core; optionally set PUPPETEER_MODULE and CHROME_PATH.
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require(process.env.PUPPETEER_MODULE || 'puppeteer-core');
const root = path.resolve(__dirname, '..');
const baseline = path.resolve(process.argv[2]);
const output = path.resolve(process.argv[3]);
fs.mkdirSync(output, { recursive: true });
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' };
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function snapshot(page) {
  return page.evaluate(() => {
    function selector(el) {
      if (!el || el === document.documentElement) return 'html';
      if (el.id) return '#' + el.id;
      const siblings = [...el.parentElement.children].filter(e => e.tagName === el.tagName);
      return selector(el.parentElement) + '>' + el.tagName.toLowerCase() + ':nth-of-type(' + (siblings.indexOf(el) + 1) + ')';
    }
    const triggers = ScrollTrigger.getAll().map(t => ({
      key: selector(t.trigger), id: t.vars.id, start: t.start, end: t.end, pin: !!t.pin,
      options: Object.fromEntries(['start', 'end', 'scrub', 'pinSpacing', 'anticipatePin', 'invalidateOnRefresh', 'toggleActions']
        .map(k => [k, typeof t.vars[k] === 'function' ? '[function]' : t.vars[k]])),
      duration: t.animation?.duration(),
    })).sort((a, b) => (a.key + JSON.stringify(a.options)).localeCompare(b.key + JSON.stringify(b.options)));
    return { height: document.documentElement.scrollHeight, width: document.documentElement.scrollWidth,
      triggers, pins: triggers.filter(t => t.pin).length };
  });
}

async function run(script, label, width, height) {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true, pipe: true, args: ['--no-sandbox'],
    userDataDir: path.join(output, 'chrome-' + label + '-' + Date.now()),
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    await page.setRequestInterception(true);
    page.on('request', req => {
      const url = new URL(req.url());
      if (!/^https?:/.test(url.protocol)) return req.continue();
      let file;
      if (url.hostname === 'daianedesigner.com.br') {
        file = path.join(root, decodeURIComponent(url.pathname === '/' ? 'index.html' : url.pathname));
        if (url.pathname === '/script.js') file = script;
        if (label.startsWith('after') && url.pathname === '/' && process.env.AFTER_INDEX) file = process.env.AFTER_INDEX;
        if (label.startsWith('after') && url.pathname === '/style.css' && process.env.AFTER_STYLE) file = process.env.AFTER_STYLE;
      } else if (url.href === 'https://unpkg.com/lenis@1.1.18/dist/lenis.css') {
        // Exact pinned stylesheet; it is inlined by the production build.
        return req.respond({ status: 200, contentType: 'text/css', body:
          'html.lenis,html.lenis body{height:auto}.lenis.lenis-smooth{scroll-behavior:auto!important}.lenis.lenis-smooth [data-lenis-prevent]{overscroll-behavior:contain}.lenis.lenis-stopped{overflow:hidden}.lenis.lenis-smooth iframe{pointer-events:none}' });
      }
      if (!file || !fs.existsSync(file)) return req.respond({ status: 404, body: '' });
      return req.respond({ status: 200, contentType: mime[path.extname(file)] || 'application/octet-stream',
        headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(file) });
    });
    await page.goto('https://daianedesigner.com.br/', { waitUntil: 'load' });
    await wait(3000);
    const initial = await snapshot(page);
    await page.screenshot({ path: path.join(output, label + '-hero.png') });
    const anchors = [];
    if (process.env.CHECK_ANCHORS) {
      for (const id of ['sobre-daiane', 'contato', 'servicos-detalhados', 'portfolio']) {
        await page.evaluate(id => document.querySelector('.principal a[href="#' + id + '"]').click(), id);
        await wait(3000);
        anchors.push(await page.evaluate(id => {
          const el = document.getElementById(id);
          const title = el.querySelector('h2');
          return { id, hash: location.hash, y: Math.round(scrollY), top: Math.round(el.getBoundingClientRect().top),
            titleOpacity: title && getComputedStyle(title).opacity };
        }, id));
      }
    }
    // Traverse naturally, allowing entrance effects to prepare before becoming visible.
    for (let y = 0; y < initial.height; y += 600) {
      await page.evaluate(y => window.lenis ? lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y), y);
      await wait(70);
    }
    await wait(1500);
    await page.evaluate(() => window.lenis ? lenis.scrollTo(0, { immediate: true, force: true }) : scrollTo(0, 0));
    await wait(2500);
    const complete = await snapshot(page);
    const states = [];
    for (const [selector, fraction] of [['.servicosCarrossel', .4], ['.projetosDestaque', .5], ['.dobra13', .5]]) {
      const position = await page.evaluate(({ selector, fraction }) => {
        const el = document.querySelector(selector);
        const t = ScrollTrigger.getAll().find(t => t.trigger === el && t.pin);
        const y = t ? t.start + (t.end - t.start) * fraction : el.getBoundingClientRect().top + scrollY;
        if (window.lenis) lenis.scrollTo(y, { immediate: true, force: true }); else scrollTo(0, y);
        return y;
      }, { selector, fraction });
      await wait(2500);
      const state = await page.evaluate(selector => [...document.querySelector(selector).querySelectorAll('.cardsCarrossel,.projetoImagem,.projetoConteudo,h2')]
        .map(el => ({ text: el.textContent.trim(), transform: getComputedStyle(el).transform, opacity: getComputedStyle(el).opacity,
          visibility: getComputedStyle(el).visibility })), selector);
      states.push({ selector, position, state });
      await page.screenshot({ path: path.join(output, label + '-' + selector.slice(1) + '.png') });
    }
    const result = { label, initial, complete, states, anchors, errors };
    fs.writeFileSync(path.join(output, label + '.json'), JSON.stringify(result, null, 2));
    return result;
  } finally { await browser.close(); }
}

(async () => {
  const width = Number(process.env.VIEWPORT_WIDTH || 1350);
  const height = Number(process.env.VIEWPORT_HEIGHT || 940);
  const before = await run(baseline, 'before-' + width, width, height);
  const after = await run(process.env.AFTER_SCRIPT || path.join(root, 'script.js'), 'after-' + width, width, height);
  const diffs = [];
  if (JSON.stringify(before.anchors) !== JSON.stringify(after.anchors)) diffs.push({ kind: 'anchors', before: before.anchors, after: after.anchors });
  if (before.complete.height !== after.complete.height) diffs.push({ kind: 'height', before: before.complete.height, after: after.complete.height });
  if (before.complete.width !== after.complete.width) diffs.push({ kind: 'width', before: before.complete.width, after: after.complete.width });
  if (before.complete.triggers.length !== after.complete.triggers.length) diffs.push({ kind: 'trigger-count', before: before.complete.triggers.length, after: after.complete.triggers.length });
  before.complete.triggers.forEach((a, i) => {
    const b = after.complete.triggers[i];
    if (!b || a.key !== b.key || a.pin !== b.pin || JSON.stringify(a.options) !== JSON.stringify(b.options) || a.duration !== b.duration || Math.abs(a.start - b.start) > 1 || Math.abs(a.end - b.end) > 1)
      diffs.push({ kind: 'trigger', before: a, after: b });
  });
  before.states.forEach((a, i) => {
    const b = after.states[i];
    if (JSON.stringify(a) !== JSON.stringify(b)) diffs.push({ kind: 'scroll-state', before: a, after: b });
  });
  const summary = { errors: [...before.errors, ...after.errors], diffs, before: { triggers: before.complete.triggers.length, pins: before.complete.pins }, after: { triggers: after.complete.triggers.length, pins: after.complete.pins } };
  fs.writeFileSync(path.join(output, 'comparison.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary));
  if (summary.errors.length || diffs.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
