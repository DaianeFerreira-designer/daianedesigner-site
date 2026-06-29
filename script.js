gsap.registerPlugin(ScrollTrigger, SplitText);

//  (PHP inclui header/footer), então só inicializa:
document.addEventListener("DOMContentLoaded", () => {
  iniciarHeaderScroll();
  ativarMenuAtual();
 iniciarMenuMobile();
  animarTextosFooter();
  animarTextoFooter2();

  // Smooth Scroll
  let targetScroll = 0;
  let currentScroll = 0;
  let isScrolling = false;

  function smoothScroll() {
    const difference = targetScroll - currentScroll;
    const distance = difference / 15;

    currentScroll += distance;

    window.scrollTo(0, currentScroll);

    if (Math.abs(difference) > 1) {
      requestAnimationFrame(smoothScroll);
    } else {
      isScrolling = false;
    }
  }

  window.addEventListener(
    "wheel",
    function (event) {
      targetScroll += event.deltaY;

      targetScroll = Math.max(
        0,
        Math.min(targetScroll, document.body.scrollHeight - window.innerHeight),
      );

      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(smoothScroll);
      }

      event.preventDefault();
    },
    { passive: false },
  );

  // Atualiza TODOS os ScrollTriggers após toda a inicialização
  ScrollTrigger.refresh();
});

/* -----------------------------------------------------------------
   Ativar menu atual
----------------------------------------------------------------- */
function ativarMenuAtual() {
  const paginaAtual = window.location.pathname.replace(/\/$/, "") || "/";

  document.querySelectorAll(".principal a").forEach((link) => {
    const href = link.getAttribute("href").replace(/\/$/, "") || "/";

    if (href === paginaAtual) {
      link.closest("li")?.classList.add("ativo");
    }
  });
}
/* -----------------------------------------------------------------
   Header com blur no scroll
----------------------------------------------------------------- */

function iniciarHeaderScroll() {
  window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (!header) return;

    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}


/* -----------------------------------------------------------------
   Custom Scrollbar
----------------------------------------------------------------- */

const customScrollbar = document.querySelector(".custom-scrollbar");
const customScrollThumb = document.querySelector(".custom-scroll-thumb");

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

/* -----------------------------------------------------------------
   Transição Hero → Cards + título + scroll horizontal
----------------------------------------------------------------- */

const wrap = document.querySelector(".cardSolucoes");
const track = document.querySelector(".trackServicos");
const tituloServicos = document.querySelector(".cardSolucoes .headServicos h2");

if (wrap && track) {
  const scrollCards = () => {
    return track.scrollWidth - wrap.clientWidth + 120;
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
      end: () => `+=${scrollCards() + 1800}`,
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

  tlTransicao.to(track, {
    x: () => -scrollCards(),
    ease: "none",
    duration: 4,
  });
}

/* -----------------------------------------------------------------
   textoAnimado em MAIN
----------------------------------------------------------------- */

document.querySelectorAll("main .textoAnimado").forEach((texto) => {
  const split = new SplitText(texto, {
    type: "chars",
    charsClass: "charAnimada",
    deepSlice: true,
  });

  gsap.from(texto.querySelectorAll(".charAnimada"), {
    filter: "blur(20px)",
    opacity: 0,
    duration: 0.3,
    stagger: {
      each: 0.02,
      from: "random",
    },
    scrollTrigger: {
      trigger: texto,
      start: "top 85%",
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
  });
});

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
    abas.forEach((item) => {
      if (item !== aba) {
        item.classList.remove("active2");
      }
    });

    aba.classList.toggle("active2");
  });
});

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

const textoProtocolo = document.querySelector(".textoAnimado2");

if (textoProtocolo) {
  const split2 = new SplitText(textoProtocolo, {
    type: "chars",
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

  gsap.from(splitFooter.chars, {
    filter: "blur(20px)",
    opacity: 0,
    duration: 0.3,
    stagger: {
      each: 0.02,
      from: "random",
    },
    scrollTrigger: {
      trigger: textoFooter,
      start: "top 85%",
      toggleActions: "play reverse play reverse",
    },
  });
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

function iniciarMenuMobile() {
  const headerMobile = document.querySelector(".headerMobile");
  const menu = document.querySelector(".menu-drop-down");
  const btn = document.querySelector(".menu-btn");
  const links = document.querySelectorAll(".menu-links .nav-link");
  const topLine = document.querySelector(".menu-line.top");
  const midLine = document.querySelector(".menu-line.mid");
  const bottomLine = document.querySelector(".menu-line.bottom");

  if (!headerMobile || !menu || !btn) return;

  const paginaAtual = window.location.pathname.replace(/\/$/, "") || "/";

  links.forEach((link) => {
    const href = link.getAttribute("href").replace(/\/$/, "") || "/";

    if (href === paginaAtual) {
      link.classList.add("ativo");
    }
  });

  gsap.set(menu, {
    y: "-24rem",
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
    .to(menu, {
      y: 0,
      duration: 0.55,
    })
    .to(
      links,
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.05,
      },
      "-=0.25",
    )
    .to(
      topLine,
      {
        y: 8,
        rotate: 45,
        duration: 0.25,
      },
      0,
    )
    .to(
      midLine,
      {
        opacity: 0,
        duration: 0.2,
      },
      0,
    )
    .to(
      bottomLine,
      {
        y: -8,
        rotate: -45,
        duration: 0.25,
      },
      0,
    );

  btn.addEventListener("click", () => {
    aberto = !aberto;

    headerMobile.classList.toggle("menuAberto", aberto);
    btn.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");

    if (aberto) {
      tlMenu.play();
    } else {
      tlMenu.reverse();
    }
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
