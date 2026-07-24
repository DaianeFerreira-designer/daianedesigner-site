gsap.registerPlugin(ScrollTrigger, SplitText);

const ehSafari =
  /Safari/i.test(navigator.userAgent) &&
  !/(Chrome|Chromium|CriOS|Edg|OPR|Android)/i.test(navigator.userAgent) &&
  /Apple/i.test(navigator.vendor);

document.documentElement.classList.toggle("safari-only", ehSafari);

iniciarScrollSuave();

//  (PHP inclui header/footer), então só inicializa:
document.addEventListener("DOMContentLoaded", () => {
  iniciarHeaderScroll();
  ativarMenuAtual();
  iniciarMenuMobile();
  animarTextosFooter();
  animarTextoFooter2();
  iniciarMotionPrincipal();

  // Atualiza TODOS os ScrollTriggers após toda a inicialização
  ScrollTrigger.refresh();

  // Imagens e fontes alteram a altura das dobras depois do DOMContentLoaded.
  // Recalcula os gatilhos quando o layout estiver realmente estabilizado.
  window.addEventListener("load", () => ScrollTrigger.refresh(), {
    once: true,
  });

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  if (ehSafari) {
    const imagensProntas = Array.from(document.images).map((imagem) => {
      if (imagem.complete) {
        return imagem.decode?.().catch(() => undefined) ?? Promise.resolve();
      }

      return new Promise((resolve) => {
        imagem.addEventListener("load", resolve, { once: true });
        imagem.addEventListener("error", resolve, { once: true });
      }).then(() => imagem.decode?.().catch(() => undefined));
    });

    Promise.all(imagensProntas).then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    });
  }
});

function iniciarScrollSuave() {
  if (
    typeof Lenis === "undefined" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const lenis = new Lenis({
    duration: 1.25,
    easing: (tempo) => Math.min(1, 1.001 - Math.pow(2, -10 * tempo)),
    smoothWheel: true,
    wheelMultiplier: 0.78,
    touchMultiplier: 1,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((tempo) => lenis.raf(tempo * 1000));
  gsap.ticker.lagSmoothing(0);

  window.lenis = lenis;
}

/* -----------------------------------------------------------------
   Ativar menu atual
----------------------------------------------------------------- */
function ativarMenuAtual() {
  const paginaAtual = window.location.pathname.replace(/\/$/, "") || "/";

  document
    .querySelectorAll(".principal a, .menu-links .nav-link")
    .forEach((link) => {
      const href = link.getAttribute("href").replace(/\/$/, "") || "/";

      if (href === paginaAtual) {
        link.closest("li")?.classList.add("ativo");
        link.classList.add("ativo");

        const img = link.querySelector("img");
        const activeSrc = img?.dataset.activeSrc;

        if (img && activeSrc) {
          img.src = activeSrc;
        }
      }
    });
}

/* -----------------------------------------------------------------
   Header com blur no scroll
----------------------------------------------------------------- */

function iniciarHeaderScroll() {
  const headers = document.querySelectorAll("header");

  if (!headers.length) return;

  window.addEventListener("scroll", () => {
    headers.forEach((header) => {
      if (window.scrollY > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  });
}
/* -----------------------------------------------------------------
   Custom Scrollbar
----------------------------------------------------------------- */

const customScrollbar = document.querySelector(".custom-scrollbar");
const customScrollThumb = document.querySelector(".custom-scroll-thumb");

if (!ehSafari && customScrollbar && customScrollThumb) {
function updateThumbPosition() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const thumbHeight = customScrollThumb.offsetHeight;
  const trackHeight = customScrollbar.offsetHeight - thumbHeight;
  const scrollPercentage = scrollTop / docHeight;
  const thumbPosition = trackHeight * scrollPercentage;
  customScrollThumb.style.top = `${thumbPosition}px`;
}

window.addEventListener("scroll", updateThumbPosition);

let isDragging = false;
let startY;
let startScrollY;

function startDrag(e) {
  isDragging = true;
  startY = e.clientY || e.touches[0].clientY;
  startScrollY = window.scrollY;
  document.body.style.userSelect = "none";
}

function onDrag(e) {
  if (!isDragging) return;
  const clientY = e.clientY || e.touches[0].clientY;
  const dy = clientY - startY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const thumbHeight = customScrollThumb.offsetHeight;
  const trackHeight = customScrollbar.offsetHeight - thumbHeight;
  const scrollPercentage = dy / trackHeight;
  window.scrollTo(0, startScrollY + scrollPercentage * docHeight);
}

function endDrag() {
  if (isDragging) {
    isDragging = false;
    document.body.style.userSelect = "";
  }
}

customScrollThumb.addEventListener("mousedown", startDrag);
document.addEventListener("mousemove", onDrag);
document.addEventListener("mouseup", endDrag);

customScrollThumb.addEventListener("touchstart", startDrag);
document.addEventListener("touchmove", onDrag);
document.addEventListener("touchend", endDrag);

updateThumbPosition();
}

/* -----------------------------------------------------------------
   Transição Hero → Cards + título + scroll horizontal
----------------------------------------------------------------- */

const wrap = document.querySelector(".cardSolucoes");
const track = document.querySelector(".trackServicos");
const tituloServicos = document.querySelector(
  ".cardSolucoes .headServicos h2",
);

if (wrap && track) {
  const cardsServicos = track.querySelectorAll(".cards");
  let entradaCardsSafariExecutada = false;
  let tlEntradaCardsSafari;

  if (ehSafari) {
    gsap.set(cardsServicos, {
      y: 70,
      scale: 0.92,
      rotation: (indice) => (indice % 2 ? 2.5 : -2.5),
      autoAlpha: 0,
      force3D: true,
    });

    tlEntradaCardsSafari = gsap.timeline({ paused: true }).to(cardsServicos, {
      y: 0,
      scale: 1,
      rotation: 0,
      autoAlpha: 1,
      duration: 0.52,
      stagger: 0.08,
      ease: "power3.out",
      force3D: true,
    });
  }

  const scrollCards = () => {
    const distancia = track.scrollWidth - wrap.clientWidth;
    return Math.max(0, distancia);
  };

  const distanciaExtra = () => {
    return window.innerWidth <= 767 ? 40 : 1800;
  };

  let charsTituloServicos = [];

  if (tituloServicos) {
    const splitTituloServicos = new SplitText(tituloServicos, {
      types: "chars",
      charsClass: "charServico",
    });

    charsTituloServicos = splitTituloServicos.chars;

    gsap.set(charsTituloServicos, {
      opacity: 0,
      filter: "blur(20px)",
    });
  }

  gsap.set(".cardSolucoes", {
    opacity: 0,
  });

  gsap.set(track, {
    x: 0,
  });

  const tlTransicao = gsap.timeline({
    scrollTrigger: {
      trigger: ".transicao",
      start: "top top",
      end: () => `+=${scrollCards() + distanciaExtra()}`,
      scrub: 2,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  tlTransicao
    .to(".bolinhas", {
      scale: 35,
      opacity: 1,
      ease: "none",
      duration: 1,
    })

    .to(
      ".hero",
      {
        opacity: 0,
        ease: "none",
        duration: 0.4,

        onStart: () => {
          document.querySelector(".hero")?.classList.add("semMouse");
          document.querySelector(".cardSolucoes")?.classList.add("ativoMouse");
        },

        onReverseComplete: () => {
          document.querySelector(".hero")?.classList.remove("semMouse");
          document
            .querySelector(".cardSolucoes")
            ?.classList.remove("ativoMouse");
        },
      },
      "-=0.3",
    )

    .to(
      ".cardSolucoes",
      {
        opacity: 1,
        ease: "none",
        duration: 0.3,
        onComplete: () => {
          if (
            ehSafari &&
            tlEntradaCardsSafari &&
            !entradaCardsSafariExecutada
          ) {
            entradaCardsSafariExecutada = true;
            tlEntradaCardsSafari.play(0);
          }
        },
      },
      "-=0.3",
    )

    .to(
      ".bolinhas",
      {
        opacity: 0,
        ease: "none",
        duration: 0.2,
      },
      "-=0.1",
    );

  if (charsTituloServicos.length) {
    tlTransicao.to(
      charsTituloServicos,
      {
        opacity: 1,
        filter: "blur(0px)",
        ease: "none",
        duration: 0.5,

        stagger: {
          each: 0.02,
          from: "random",
        },
      },
      "-=0.1",
    );
  }

 /* Scroll horizontal exatamente como no código do Thor */
if (!ehSafari) {
  tlTransicao.from(
    cardsServicos,
    {
      y: 70,
      scale: 0.92,
      rotation: (indice) => (indice % 2 ? 2.5 : -2.5),
      filter: "saturate(0.2)",
      autoAlpha: 0,
      duration: 0.75,
      stagger: 0.1,
      ease: "power3.out",
      clearProps: "filter",
    },
    "-=0.1",
  );
}

tlTransicao.to(track, {
  x: () => -(track.scrollWidth - wrap.clientWidth + 150),
  ease: "none",
  duration: 4,
});

}

/* -----------------------------------------------------------------
   textoAnimado em MAIN
----------------------------------------------------------------- */

document.querySelectorAll("main .textoAnimadoLegado").forEach((texto) => {
  // Usa a seção como gatilho para começar assim que ela entra na tela
  const secao = texto.closest("section") || texto;

  const split = new SplitText(texto, {
    type: "words,chars",
    wordsClass: "wordAnimada",
    charsClass: "charAnimada",
    deepSlice: true,
    aria: "none",
  });

  gsap.from(split.chars, {
    filter: "blur(20px)",
    opacity: 0,

    // Animação mais rápida
    duration: 0.2,

    stagger: {
      // Intervalo menor entre os caracteres
      each: 0.001,
      from: "random",
    },

    scrollTrigger: {
      // Começa quando a seção entra na tela
      trigger: secao,
      start: "top 95%",
      toggleActions: "play reverse play reverse",
    },
  });
});

/* -----------------------------------------------------------------
   Abas Portfólio
   ----------------------------------------------------------------- */

$(document).ready(function () {
  // Barra Ativo
  $(".action").click(function (e) {
    e.preventDefault();

    $(".slide").removeClass("active");
    var slide = $(this).closest(".slide");
    slide.addClass("active");
    animarProjetoAberto(slide.get(0));
  });
});

function animarProjetoAberto(slide) {
  if (!slide) return;

  const conteudo = slide.querySelector(".slide-content");
  const itens = slide.querySelectorAll(
    ".imgTexto h2, .imgTexto img, .tech h3, .tech li, .ctaProjeto",
  );

  gsap.fromTo(
    conteudo,
    { y: 34, scale: 0.985, autoAlpha: 0 },
    {
      y: 0,
      scale: 1,
      autoAlpha: 1,
      duration: 0.55,
      ease: "power3.out",
      overwrite: true,
    },
  );

  gsap.fromTo(
    itens,
    { y: 28, filter: "blur(8px)", autoAlpha: 0 },
    {
      y: 0,
      filter: "blur(0px)",
      autoAlpha: 1,
      duration: 0.48,
      stagger: 0.07,
      delay: 0.12,
      ease: "power3.out",
      overwrite: true,
    },
  );
}

function checkWidth() {
  if ($(window).width() > 480) {
    $(".slide-content").css("width", "");

    const slideWidth = $(".slide.active").width();

    $(".slide.active .slide-content").css({
      width: slideWidth + "px",
    });
  }
}

$(window).resize(function () {
  // onresize
  checkWidth();

  // finish resize
  clearTimeout(window.resizedFinished);
  window.resizedFinished = setTimeout(checkWidth, 500);
});

/* -----------------------------------------------------------------
   Accordion Protocolo
   ----------------------------------------------------------------- */

const abas = document.querySelectorAll(".abas");

abas.forEach((aba) => {
  const frame = aba.querySelector(".frame");

  frame.addEventListener("click", () => {
    const vaiAbrir = !aba.classList.contains("active2");

    abas.forEach((item) => {
      if (item !== aba) {
        item.classList.remove("active2");
      }
    });

    aba.classList.toggle("active2");

    if (vaiAbrir) {
      animarAberturaAba(aba);
    }
  });
});

function animarAberturaAba(aba) {
  const frameItens = aba.querySelectorAll(".frame h3, .frame p, .frame img");
  const conteudoItens = aba.querySelectorAll(
    ".conteudoProtocolo h2, .conteudoProtocolo p",
  );

  gsap.fromTo(
    frameItens,
    { y: 14, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.38,
      stagger: 0.06,
      ease: "power3.out",
      overwrite: true,
    },
  );

  gsap.fromTo(
    conteudoItens,
    { y: 28, filter: "blur(10px)", autoAlpha: 0 },
    {
      y: 0,
      filter: "blur(0px)",
      autoAlpha: 1,
      duration: 0.55,
      stagger: 0.1,
      delay: 0.14,
      ease: "power3.out",
      overwrite: true,
    },
  );
}

/* -----------------------------------------------------------------
   SVG Portfolio
----------------------------------------------------------------- */

function animarSVGDesenho(selector, trigger) {
  const paths = document.querySelectorAll(`${selector} path`);

  paths.forEach((path) => {
    const length = path.getTotalLength();

    gsap.set(path, {
      fill: "none",
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: trigger,
        start: "top 90%",
        end: "top 30%",
        scrub: 2,
      },
    });
  });
}

animarSVGDesenho(".iconePortfolio_obsoleto", ".dobra03");

/* -----------------------------------------------------------------
   Hover Vantagens
----------------------------------------------------------------- */
document.querySelectorAll(".item").forEach((item) => {
  const img = item.querySelector("img");

  item.addEventListener("mouseenter", () => {
    img.src = "assets/imagens/check-mark2.svg";
  });

  item.addEventListener("mouseleave", () => {
    img.src = "assets/imagens/7-Check.svg";
  });
});

/* -----------------------------------------------------------------
   texto animado 2 (PROTOCOL0 - .textoTransicao)
----------------------------------------------------------------- */

const textoProtocolo = document.querySelector(".textoAnimadoProtocoloLegado");

if (textoProtocolo) {
  const split2 = new SplitText(textoProtocolo, {
    type: "chars",
    aria: "none",
  });

  ScrollTrigger.create({
    trigger: ".textoTransicao",
    start: "top 90%",
    end: "bottom 20%",
    onEnter: () => {
      gsap.fromTo(
        split2.chars,
        {
          yPercent: 100,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.3,
          stagger: 0.02,
          ease: "power2.out",
        },
      );
    },
    onEnterBack: () => {
      gsap.fromTo(
        split2.chars,
        {
          yPercent: 100,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.3,
          stagger: 0.02,
          ease: "power2.out",
        },
      );
    },
  });
}

/* -----------------------------------------------------------------
   Footer — texto animado 1 (h2 .textoAnimado)
----------------------------------------------------------------- */

function animarTextosFooter() {
  const textoFooter = document.querySelector("footer .textoAnimado");

  if (!textoFooter) return;

  const splitFooter = new SplitText(textoFooter, {
    types: "lines, words, chars",
    charsClass: "charFooter",
    deepSlice: true,
  });

  const charsDesigner = Array.from(
    textoFooter.querySelectorAll("span .charFooter"),
  );
  const charsDaiane = splitFooter.chars.filter(
    (char) => !char.closest("span"),
  );

  const animacaoGrupoFooter = {
    filter: "blur(20px)",
    autoAlpha: 0,
    duration: 0.38,
    stagger: {
      each: 0.025,
      from: "random",
    },
    ease: "power2.out",
  };

  const timelineTextoFooter = gsap.timeline({
    scrollTrigger: {
      trigger: textoFooter,
      start: "top 85%",
      toggleActions: "play reverse play reverse",
    },
  });

  timelineTextoFooter
    .from(charsDaiane, animacaoGrupoFooter, 0)
    .from(charsDesigner, { ...animacaoGrupoFooter }, 0);
}

/* -----------------------------------------------------------------
   Footer — texto animado 2 (p .textoAnimado2)
----------------------------------------------------------------- */

function animarTextoFooter2() {
  const texto = document.querySelector("footer .textoAnimado2");
  if (!texto) return;

  requestAnimationFrame(() => {
    const split = new SplitText(texto, {
      type: "chars",
      charsClass: "footerCalloutChar",
      aria: "none",
      deepSlice: false,
    });

    ScrollTrigger.create({
      trigger: texto,
      start: "top 95%",
      end: "bottom 20%",
      onEnter: animar,
      onEnterBack: animar,
    });

    function animar() {
      gsap.fromTo(
        split.chars,
        {
          x: () => gsap.utils.random(-70, 70),
          y: () => gsap.utils.random(-45, 45),
          color: "#f8b88a",
          autoAlpha: 0,
        },
        {
          x: 0,
          y: 0,
          color: "inherit",
          autoAlpha: 1,
          duration: 0.58,
          stagger: { amount: 0.65, from: "random" },
          ease: "power3.out",
        },
      );
    }
  });
}

/* -----------------------------------------------------------------
   Preloader
----------------------------------------------------------------- */

(function () {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  const preloaderBg = preloader.querySelector(".preloader-bg");
  const preloaderLogo = preloader.querySelector(".preloader-logo");
  const preloaderFill = preloader.querySelector(".preloader-logo-fill");
  const preloaderPercent = preloader.querySelector(".preloader-percent");

  const progressObj = { val: 0 };

  gsap.to(progressObj, {
    val: 100,
    duration: 2,
    ease: "power2.out",
    onUpdate: () => {
      const v = Math.round(progressObj.val);

      preloaderPercent.textContent = v + "%";
      preloaderFill.style.clipPath = `inset(${100 - v}% 0 0 0)`;
    },
    onComplete: finishPreloader,
  });

  function finishPreloader() {
    const tl = gsap.timeline({
      onComplete: () => {
        preloader.style.display = "none";
      },
    });

    tl.to(preloaderPercent, {
      opacity: 0,
      y: 10,
      duration: 0.3,
      ease: "power2.out",
    });

    tl.to(
      preloaderBg,
      {
        y: "-100%",
        duration: 1,
        ease: "power3.inOut",
      },
      0.2,
    );

    tl.to(
      preloaderLogo,
      {
        scale: 0.6,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      0.4,
    );

    tl.to(
      preloader,
      {
        opacity: 0,
        duration: 0.3,
      },
      "-=0.2",
    );
  }
})();

/* -----------------------------------------------------------------
   Animações do conteúdo principal, adaptadas do projeto Copy motion.
   O footer mantém as animações próprias.
----------------------------------------------------------------- */

function iniciarMotionPrincipal() {
  const main = document.querySelector("main");
  if (!main || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  function animarTexto(
    elemento,
    tipo,
    animacao,
    trigger,
    inicio = "top 86%",
  ) {
    if (!elemento || elemento.closest("footer")) return;

    const split = new SplitText(elemento, {
      type: tipo,
      wordsClass: "motion-word",
      charsClass: "motion-char",
      linesClass: "motion-line",
      deepSlice: true,
      aria: "auto",
    });

    const alvos =
      tipo === "lines"
        ? split.lines
        : tipo === "words"
          ? split.words
          : split.chars;

    gsap.from(alvos, {
      ...animacao,
      scrollTrigger: {
        trigger: trigger || elemento,
        start: inicio,
        toggleActions: "play none none reverse",
      },
    });
  }

  const heroTimeline = gsap.timeline({
    defaults: { ease: "power3.out" },
    delay: document.querySelector("#preloader") ? 2.15 : 0.1,
  });

  heroTimeline
    .from(".hero .webDesigner", {
      y: 24,
      autoAlpha: 0,
      duration: 0.55,
    })
    .from(".hero h1", { y: 70, autoAlpha: 0, duration: 0.85 }, "-=0.25")
    .from(
      ".hero .paragrafo",
      {
        filter: "blur(14px)",
        y: 32,
        autoAlpha: 0,
        duration: 0.7,
      },
      "-=0.4",
    )
    .from(
      ".hero .botoes > *",
      {
        y: 28,
        scale: 0.96,
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.1,
      },
      "-=0.3",
    );

  const efeitosTitulo = [
    {
      yPercent: 120,
      rotation: 8,
      autoAlpha: 0,
      duration: 0.62,
      stagger: 0.018,
      ease: "back.out(1.7)",
    },
    {
      scale: 0.25,
      color: "#ef6500",
      autoAlpha: 0,
      duration: 0.52,
      stagger: { each: 0.018, from: "center" },
      ease: "back.out(1.8)",
    },
    {
      x: "random(-70, 70)",
      y: "random(-45, 45)",
      color: "#f8b88a",
      autoAlpha: 0,
      duration: 0.58,
      stagger: { amount: 0.65, from: "random" },
      ease: "power3.out",
    },
  ];

  main
    .querySelectorAll(
      ".dobra03 .portfolioTexto, .dobra05 > h2, .dobra06 .textoTransicao > h2",
    )
    .forEach((titulo, indice) => {
      const usarEfeitoProtocolo =
        titulo.matches(".portfolioTexto") ||
        Boolean(titulo.closest(".dobra06"));
      const portfolioMobile =
        titulo.matches(".portfolioTexto") &&
        window.matchMedia("(max-width: 767px)").matches;

      animarTexto(
        titulo,
        "words,chars",
        usarEfeitoProtocolo
          ? titulo.matches(".portfolioTexto")
            ? {
                ...efeitosTitulo[2],
                duration: portfolioMobile ? 0.24 : 0.46,
                stagger: {
                  amount: portfolioMobile ? 0.12 : 0.38,
                  from: "random",
                },
              }
            : efeitosTitulo[2]
          : efeitosTitulo[indice % efeitosTitulo.length],
        titulo.matches(".portfolioTexto")
          ? titulo.closest("section")?.querySelector(".iconePortfolio_obsoleto")
          : titulo.closest("section"),
        portfolioMobile
          ? "center 56%"
          : titulo.matches(".portfolioTexto")
            ? "center 56%"
            : "top 86%",
      );
    });

  main
    .querySelectorAll(".dobra03 .faixaDestaque")
    .forEach((texto) => {
      animarTexto(
        texto,
        "words",
        {
          y: 38,
          filter: "blur(12px)",
          color: "#ef6500",
          autoAlpha: 0,
          duration: 0.42,
          stagger: 0.035,
          ease: "power3.out",
        },
        texto.closest("section")?.querySelector(".iconePortfolio_obsoleto"),
        "center 56%",
      );

      gsap.from(texto, {
        scale: 0.62,
        rotation: -8,
        autoAlpha: 0,
        duration: 0.5,
        ease: "back.out(1.8)",
        scrollTrigger: {
          trigger: texto
            .closest("section")
            ?.querySelector(".iconePortfolio_obsoleto"),
          start: "center 56%",
          toggleActions: "play none none reverse",
        },
      });
    });

  const textoMetodologia = main.querySelector(
    ".dobra06 .textoTransicao > p",
  );

  if (textoMetodologia) {
    const metodologiaSplit = new SplitText(textoMetodologia, {
      type: "lines",
      linesClass: "motion-line metodologia-line",
      deepSlice: true,
      aria: "auto",
    });

    gsap.set(textoMetodologia, { perspective: 900 });

    gsap.fromTo(
      metodologiaSplit.lines,
      {
        x: (indice) => (indice % 2 === 0 ? -130 : 130),
        rotationY: (indice) => (indice % 2 === 0 ? -22 : 22),
        scale: 0.88,
        color: "#ef6500",
        textShadow: "0 0 28px rgba(239, 101, 0, 0.85)",
        filter: "blur(16px)",
        autoAlpha: 0,
      },
      {
        x: 0,
        rotationY: 0,
        scale: 1,
        color: "currentColor",
        textShadow: "0 0 0 rgba(239, 101, 0, 0)",
        filter: "blur(0px)",
        autoAlpha: 1,
        duration: 0.72,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: {
          trigger: textoMetodologia,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }

  animarGrupoDeCards(".dobra04", ".slide", {
    y: 85,
    rotationX: -12,
    color: "#ef6500",
  });

  ScrollTrigger.create({
    trigger: ".dobra04",
    start: "top 80%",
    once: true,
    onEnter: () => {
      const projetoInicial = main.querySelector(".dobra04 .slide.active");
      if (projetoInicial) animarProjetoAberto(projetoInicial);
    },
  });
  animarGrupoDeCards(".dobra06", ".abas", {
    x: (indice) => (indice % 2 ? 55 : -55),
    color: "#f8b88a",
  });

  const caixaBeneficios = main.querySelector(".dobra05 .vr-box");
  const iconesBeneficios = main.querySelectorAll(".dobra05 .item img");
  const textosBeneficios = main.querySelectorAll(".dobra05 .item p");
  const timelineBeneficios = gsap.timeline({
    scrollTrigger: {
      trigger: caixaBeneficios,
      start: "top 90%",
      toggleActions: "play none none reverse",
    },
  });

  timelineBeneficios
    .from(caixaBeneficios, {
      y: 45,
      scale: 0.97,
      autoAlpha: 0,
      duration: 0.4,
      ease: "power3.out",
    })
    .from(
      iconesBeneficios,
      {
        scale: 0,
        rotation: -25,
        autoAlpha: 0,
        duration: 0.32,
        stagger: 0.045,
        ease: "back.out(1.9)",
      },
      "-=0.24",
    )
    .from(
      textosBeneficios,
      {
        y: 32,
        filter: "blur(10px)",
        autoAlpha: 0,
        duration: 0.36,
        stagger: 0.045,
        ease: "power3.out",
      },
      "-=0.24",
    );

  ScrollTrigger.create({
    trigger: ".dobra06 .abasProtocolo",
    start: "top 80%",
    once: true,
    onEnter: () => {
      const abaInicial = main.querySelector(".dobra06 .abas.active2");
      if (abaInicial) animarAberturaAba(abaInicial);
    },
  });

  function animarGrupoDeCards(secaoSelector, cardSelector, entrada) {
    const secao = main.querySelector(secaoSelector);
    if (!secao) return;

    const cards = gsap.utils.toArray(secao.querySelectorAll(cardSelector));
    if (!cards.length) return;

    gsap.from(cards, {
      ...entrada,
      autoAlpha: 0,
      filter: "saturate(0.2)",
      duration: 0.72,
      stagger: 0.1,
      ease: "power3.out",
      clearProps: "filter,color",
      scrollTrigger: {
        trigger: secao,
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
    });
  }
}

/* -----------------------------------------------------------------
   Menu mobile
----------------------------------------------------------------- */

function iniciarMenuMobile() {
  const headerMobile = document.querySelector(".headerMobile");
  const menu = document.querySelector(".menu-drop-down");
  const btn = document.querySelector(".menu-btn");
  const links = document.querySelectorAll(".menu-links .nav-link");
  const menuLinks = document.querySelector(".menu-links");
  const topLine = document.querySelector(".menu-line.top");
  const midLine = document.querySelector(".menu-line.mid");
  const bottomLine = document.querySelector(".menu-line.bottom");

  if (!headerMobile || !menu || !btn || !menuLinks) return;

  const paginaAtual = window.location.pathname.replace(/\/$/, "") || "/";

  links.forEach((link) => {
    const href = link.getAttribute("href").replace(/\/$/, "") || "/";

    if (href === paginaAtual) {
      link.classList.add("ativo");
    }
  });

  const fecharY = -menuLinks.offsetHeight;

  gsap.set(menu, {
    y: fecharY,
    xPercent: -50,
  });

  gsap.set(links, {
    opacity: 0,
    y: 40,
  });

  let aberto = false;

  const tlMenu = gsap.timeline({
    paused: true,
    defaults: {
      ease: "power3.out",
    },
  });

  tlMenu
    .to(menu, { y: -8, duration: 0.55 }, 0)
    .to(links, { opacity: 1, y: 0, duration: 0.35, stagger: 0.05 }, 0.18)
    .to(topLine, { y: 8, rotate: 45, duration: 0.25 }, 0)
    .to(midLine, { opacity: 0, duration: 0.2 }, 0)
    .to(bottomLine, { y: -8, rotate: -45, duration: 0.25 }, 0);

  btn.addEventListener("click", () => {
    aberto = !aberto;

    headerMobile.classList.toggle("menuAberto", aberto);
    btn.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");

    aberto ? tlMenu.play() : tlMenu.reverse();
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      aberto = false;
      headerMobile.classList.remove("menuAberto");
      btn.setAttribute("aria-label", "Abrir menu");
      tlMenu.reverse();
    });
  });
}

/* -----------------------------------------------------------------
   Botão flutuante WhatsApp
----------------------------------------------------------------- */

const whatsappFloat = document.querySelector(".whatsappFloat");
const secao02 = document.querySelector(".cardSolucoes");

if (whatsappFloat && secao02) {
  ScrollTrigger.create({
    trigger: secao02,
    start: "top 70%",
    onEnter: () => whatsappFloat.classList.add("ativo"),
    onLeaveBack: () => whatsappFloat.classList.remove("ativo"),
  });
}

/* -----------------------------------------------------------------
   Reload ao trocar resolução/monitor
----------------------------------------------------------------- */

(() => {
  let larguraInicial = window.innerWidth;
  let timeout;

  window.addEventListener("resize", () => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      const diferenca = Math.abs(window.innerWidth - larguraInicial);

      if (diferenca >= 100) {
        window.scrollTo(0, 0);
        window.location.reload();
      }
    }, 300);
  });
})();
