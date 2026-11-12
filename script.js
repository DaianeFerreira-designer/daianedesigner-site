gsap.registerPlugin(ScrollTrigger, SplitText);

const preparosPorCicloDeFontes = new WeakMap();
let refreshNoQuadroAgendado = false;
let ordenarNoProximoRefresh = false;

function atualizarMedidasScroll() {
  ScrollTrigger.refresh();
}

function agendarRefreshNoQuadro(ordenar = false) {
  ordenarNoProximoRefresh ||= ordenar;
  if (refreshNoQuadroAgendado) return;

  refreshNoQuadroAgendado = true;
  requestAnimationFrame(() => {
    const ordenarGatilhos = ordenarNoProximoRefresh;
    refreshNoQuadroAgendado = false;
    ordenarNoProximoRefresh = false;
    if (ordenarGatilhos) ScrollTrigger.sort();
    atualizarMedidasScroll();
  });
}

function agendarRefreshAposFontes(preparar) {
  const fontesProntas = document.fonts?.ready;
  if (!fontesProntas) {
    if (preparar) {
      preparar();
      atualizarMedidasScroll();
    }
    return;
  }

  let preparos = preparosPorCicloDeFontes.get(fontesProntas);
  if (!preparos) {
    preparos = [];
    preparosPorCicloDeFontes.set(fontesProntas, preparos);
    fontesProntas.then(() => {
      preparosPorCicloDeFontes.delete(fontesProntas);
      try {
        preparos.forEach(acao => acao());
      } finally {
        agendarRefreshNoQuadro();
      }
    });
  }
  if (preparar) preparos.push(preparar);
}

document.addEventListener("DOMContentLoaded", () => {
  iniciarScrollbarPersonalizada();
  iniciarHeaderScroll();
  iniciarMenuMobile();

  iniciarFluidDesktop();
  iniciarLenis();

  iniciarAnimacaoDobra02();
  iniciarAnimacaoDobra03();
  iniciarTextosDobraExtra();
  iniciarBuscaDigitada();
  iniciarDivisoresAnimados();
  iniciarSlidersDobra04();
  iniciarTextosDobra04();
  iniciarCarrosselServicos();
  iniciarTextosDobra06();
  iniciarIndicadoresScroll();
  iniciarValorPercebido();
  iniciarOportunidadesPerdidas();
  iniciarCarrosselVendas();
  iniciarVendasBeneficios();
  iniciarProtocoloCriacao();
  iniciarContatoScroll();
  iniciarAnimacoesSobre();
  iniciarTransicaoPercepcao();
  iniciarAnimacaoPilares();
  iniciarSobreposicaoNewsletter();
  iniciarTextosNewsletter();
  animarRedesFooter();
  animarTextosFooter();
  animarTextoFooter2();
  iniciarWhatsappFlutuante();
  iniciarMenuAncoras();

});

function iniciarMenuAncoras() {
  const links = [...document.querySelectorAll(".principal a, .menu-links .nav-link")];
  const ancoras = [
    ...links.filter(link => link.getAttribute("href").startsWith("#")),
    ...document.querySelectorAll('.portfolioButton[href^="#"]'),
  ];
  const secoes = [...new Set(ancoras.map(link => document.querySelector(link.getAttribute("href"))))].filter(Boolean);
  const hero = document.querySelector("main .hero");
  let atualizacaoPendente = false;
  let destinoAnterior;

  links.forEach(link => {
    const imagem = link.querySelector("img");
    if (imagem && !imagem.dataset.normalSrc) imagem.dataset.normalSrc = imagem.getAttribute("src");
  });

  function alturaCabecalho() {
    const seletor = window.innerWidth < 768 ? ".headerMobile" : ".headerDesktop";
    return document.querySelector(seletor)?.offsetHeight ?? 0;
  }

  function pinDaSecao(secao, gatilhos) {
    return gatilhos.find(item => item.trigger === secao && item.vars.pin);
  }

  function posicaoSecao(secao) {
    const pin = pinDaSecao(secao, ScrollTrigger.getAll());
    if (pin) return pin.start;
    return secao.getBoundingClientRect().top + window.scrollY - alturaCabecalho() - 16;
  }

  function atualizarAtivo() {
    atualizacaoPendente = false;
    const scroll = window.scrollY;
    const linha = alturaCabecalho() + 18;
    const gatilhos = ScrollTrigger.getAll();
    let destinoAtual = null;

    if (hero) {
      if (hero.getBoundingClientRect().bottom > linha) destinoAtual = "/";
    } else {
      destinoAtual = window.location.pathname.replace(/\/$/, "") || "/";
    }

    for (const secao of secoes) {
      const pin = pinDaSecao(secao, gatilhos);
      if (pin) {
        if (scroll >= pin.start - 1 && scroll < pin.end) destinoAtual = "#" + secao.id;
      } else {
        const limites = secao.getBoundingClientRect();
        if (limites.top <= linha && limites.bottom > linha) destinoAtual = "#" + secao.id;
      }
    }

    if (destinoAtual === destinoAnterior) return;
    destinoAnterior = destinoAtual;
    links.forEach(link => {
      const ativo = link.getAttribute("href") === destinoAtual;
      link.classList.toggle("ativo", ativo);
      link.closest("li")?.classList.toggle("ativo", ativo);
      if (ativo) link.setAttribute("aria-current", destinoAtual === "/" ? "page" : "location");
      else link.removeAttribute("aria-current");
      const imagem = link.querySelector("img");
      if (imagem) imagem.src = ativo ? imagem.dataset.activeSrc || imagem.dataset.normalSrc : imagem.dataset.normalSrc;
    });
  }

  ancoras.forEach(link => {
    link.addEventListener("click", evento => {
      if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
      const secao = document.querySelector(link.getAttribute("href"));
      if (!secao) return;

      evento.preventDefault();
      const posicao = Math.max(0, posicaoSecao(secao));
      const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (window.lenis) window.lenis.scrollTo(posicao, { duration: reduzir ? 0 : 1.4, immediate: reduzir });
      else window.scrollTo({ top: posicao, behavior: reduzir ? "instant" : "smooth" });
      history.pushState(null, "", link.getAttribute("href"));
    });
  });

  window.addEventListener("scroll", () => {
    if (atualizacaoPendente) return;
    atualizacaoPendente = true;
    requestAnimationFrame(atualizarAtivo);
  }, { passive: true });
  ScrollTrigger.addEventListener("refresh", atualizarAtivo);
  atualizarAtivo();
}

function iniciarHeaderScroll() {
  const headers = document.querySelectorAll(".headerDesktop, .headerMobile");

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

function iniciarMenuMobile() {
  const headerMobile =
    document.querySelector(".headerMobile");

  if (!headerMobile) {
    return;
  }

  const menu =
    headerMobile.querySelector(".menuMobile");

  const painel =
    headerMobile.querySelector(
      ".menuMobilePainel"
    );

  const botao =
    headerMobile.querySelector(".menu-btn");

  const links =
    headerMobile.querySelectorAll(".nav-link");

  const linkOrcamento =
    headerMobile.querySelector(
      ".orcamentoHeaderMobile"
    );

  const linkLoja =
    headerMobile.querySelector(
      ".lojaHeaderMobile"
    );

  if (
    !menu ||
    !painel ||
    !botao ||
    !links.length
  ) {
    return;
  }

  let menuAberto = false;

  /* =====================================================
     NORMALIZA CAMINHOS
  ===================================================== */

  function normalizarCaminho(caminho) {
    if (!caminho) {
      return "/";
    }

    const url = new URL(
      caminho,
      window.location.origin
    );

    const caminhoNormalizado =
      url.pathname.replace(/\/+$/, "");

    return caminhoNormalizado || "/";
  }

  /* =====================================================
     ÍCONES NORMAIS E ATIVOS
  ===================================================== */

  function atualizarIcone(link, ativo) {
    const imagem = link.querySelector("img");

    if (!imagem) {
      return;
    }

    const srcNormal =
      imagem.dataset.normalSrc;

    const srcAtivo =
      imagem.dataset.activeSrc;

    if (ativo && srcAtivo) {
      imagem.src = srcAtivo;
      return;
    }

    if (srcNormal) {
      imagem.src = srcNormal;
    }
  }

  /* =====================================================
     DEFINE A PÁGINA ATIVA
  ===================================================== */

  function definirPaginaAtiva() {
    const paginaAtual = normalizarCaminho(
      window.location.pathname
    );

    links.forEach((link) => {
      const caminhoLink = normalizarCaminho(
        link.getAttribute("href")
      );

      const ativo =
        caminhoLink === paginaAtual && !link.getAttribute("href").startsWith("#");

      link.classList.toggle("ativo", ativo);

      atualizarIcone(link, ativo);

      if (ativo) {
        link.setAttribute(
          "aria-current",
          "page"
        );
      } else {
        link.removeAttribute(
          "aria-current"
        );
      }
    });

    if (linkOrcamento) {
      const caminhoOrcamento =
        normalizarCaminho(
          linkOrcamento.getAttribute("href")
        );

      const orcamentoAtivo =
        caminhoOrcamento === paginaAtual;

      linkOrcamento.classList.toggle(
        "ativo",
        orcamentoAtivo
      );

      if (orcamentoAtivo) {
        linkOrcamento.setAttribute(
          "aria-current",
          "page"
        );
      } else {
        linkOrcamento.removeAttribute(
          "aria-current"
        );
      }
    }
  }

  /* =====================================================
     ABRIR MENU
  ===================================================== */

  function abrirMenu() {
    menuAberto = true;

    headerMobile.classList.add(
      "menuAberto"
    );

    document.body.classList.add(
      "menuMobileAberto"
    );

    botao.setAttribute(
      "aria-expanded",
      "true"
    );

    botao.setAttribute(
      "aria-label",
      "Fechar menu"
    );

    painel.inert = false;
  }

  /* =====================================================
     FECHAR MENU
  ===================================================== */

  function fecharMenu() {
    menuAberto = false;

    headerMobile.classList.remove(
      "menuAberto"
    );

    document.body.classList.remove(
      "menuMobileAberto"
    );

    botao.setAttribute(
      "aria-expanded",
      "false"
    );

    botao.setAttribute(
      "aria-label",
      "Abrir menu"
    );

    painel.inert = true;
  }

  /* =====================================================
     CLIQUE NO BOTÃO
  ===================================================== */

  botao.addEventListener("click", (evento) => {
    evento.stopPropagation();

    if (menuAberto) {
      fecharMenu();
    } else {
      abrirMenu();
    }
  });

  /* =====================================================
     FECHA AO CLICAR EM UM LINK
  ===================================================== */

  links.forEach((link) => {
    link.addEventListener(
      "click",
      fecharMenu
    );
  });

  linkOrcamento?.addEventListener(
    "click",
    fecharMenu
  );

  linkLoja?.addEventListener(
    "click",
    fecharMenu
  );

  /* =====================================================
     FECHA AO CLICAR FORA
  ===================================================== */

  document.addEventListener(
    "click",
    (evento) => {
      if (
        menuAberto &&
        !menu.contains(evento.target)
      ) {
        fecharMenu();
      }
    }
  );

  /* =====================================================
     FECHA COM ESC
  ===================================================== */

  document.addEventListener(
    "keydown",
    (evento) => {
      if (
        evento.key === "Escape" &&
        menuAberto
      ) {
        fecharMenu();

        botao.focus();
      }
    }
  );

  /* =====================================================
     SCROLL
  ===================================================== */

  function atualizarScrollHeader() {
    headerMobile.classList.toggle(
      "scrolled",
      window.scrollY > 100
    );
  }

  window.addEventListener(
    "scroll",
    atualizarScrollHeader,
    {
      passive: true
    }
  );

  /* =====================================================
     VOLTA AO DESKTOP
  ===================================================== */

  window.addEventListener("resize", () => {
    if (
      window.innerWidth >= 768 &&
      menuAberto
    ) {
      fecharMenu();
    }
  });

  /* =====================================================
     ESTADO INICIAL OBRIGATORIAMENTE FECHADO
  ===================================================== */

  definirPaginaAtiva();
  atualizarScrollHeader();
  fecharMenu();
}

function iniciarFluidDesktop() {
  if (window.innerWidth <= 1024) return;

  function iniciarFluid(canvas) {
    const larguraInicial = canvas.clientWidth;
    const alturaInicial = canvas.clientHeight;
    canvas.width = larguraInicial;
    canvas.height = alturaInicial;

    var config = {
      TEXTURE_DOWNSAMPLE: 1,
      DENSITY_DISSIPATION: 0.98,
      VELOCITY_DISSIPATION: 0.99,
      PRESSURE_DISSIPATION: 0.8,
      PRESSURE_ITERATIONS: 25,
      CURL: 30,
      SPLAT_RADIUS: 0.005,
    };

    var pointers = [];
    var splatStack = [];

    var _getWebGLContext = getWebGLContext(canvas);

    var gl = _getWebGLContext.gl;
    var ext = _getWebGLContext.ext;
    if (!gl || !ext) return;
    const framebuffers = [];
    var support_linear_float = _getWebGLContext.support_linear_float;

    function getWebGLContext(canvas) {
      var params = {
        alpha: false,
        depth: false,
        stencil: false,
        antialias: false,
      };

      var gl = canvas.getContext("webgl2", params);

      var isWebGL2 = !!gl;

      if (!isWebGL2) {
        gl =
          canvas.getContext("webgl", params) ||
          canvas.getContext("experimental-webgl", params);
      }

      if (!gl) {
        console.warn("WebGL não disponível neste navegador.");

        return {
          gl: null,
          ext: null,
          support_linear_float: null,
        };
      }

      var halfFloat = gl.getExtension("OES_texture_half_float");

      var support_linear_float = gl.getExtension(
        "OES_texture_half_float_linear",
      );

      if (isWebGL2) {
        gl.getExtension("EXT_color_buffer_float");

        support_linear_float = gl.getExtension("OES_texture_float_linear");
      }

      gl.clearColor(0.0, 0.0, 0.0, 1.0);

      var internalFormat = isWebGL2 ? gl.RGBA16F : gl.RGBA;

      var internalFormatRG = isWebGL2 ? gl.RG16F : gl.RGBA;

      var formatRG = isWebGL2 ? gl.RG : gl.RGBA;

      var texType;

      if (isWebGL2) {
        texType = gl.HALF_FLOAT;
      } else {
        if (!halfFloat) {
          console.warn("OES_texture_half_float não disponível.");

          return {
            gl: null,
            ext: null,
            support_linear_float: null,
          };
        }

        texType = halfFloat.HALF_FLOAT_OES;
      }

      return {
        gl: gl,

        ext: {
          internalFormat: internalFormat,
          internalFormatRG: internalFormatRG,
          formatRG: formatRG,
          texType: texType,
        },

        support_linear_float: support_linear_float,
      };
    }

    if (!gl) {
      return;
    }

    function pointerPrototype() {
      this.id = -1;

      this.x = 0;
      this.y = 0;

      this.dx = 0;
      this.dy = 0;

      this.down = false;
      this.moved = false;

      this.color = [30, 0, 300];
    }

    pointers.push(new pointerPrototype());

    var GLProgram = (function () {
      function GLProgram(vertexShader, fragmentShader) {
        if (!(this instanceof GLProgram)) {
          throw new TypeError("Cannot call a class as a function");
        }

        this.uniforms = {};

        this.program = gl.createProgram();

        gl.attachShader(this.program, vertexShader);

        gl.attachShader(this.program, fragmentShader);

        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
          throw gl.getProgramInfoLog(this.program);
        }

        var uniformCount = gl.getProgramParameter(
          this.program,
          gl.ACTIVE_UNIFORMS,
        );

        for (var i = 0; i < uniformCount; i++) {
          var uniformName = gl.getActiveUniform(this.program, i).name;

          this.uniforms[uniformName] = gl.getUniformLocation(
            this.program,
            uniformName,
          );
        }
      }

      GLProgram.prototype.bind = function bind() {
        gl.useProgram(this.program);
      };

      return GLProgram;
    })();

    function compileShader(type, source) {
      var shader = gl.createShader(type);

      gl.shaderSource(shader, source);

      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw gl.getShaderInfoLog(shader);
      }

      return shader;
    }

    var baseVertexShader = compileShader(
      gl.VERTEX_SHADER,

      `
        precision highp float;
        precision mediump sampler2D;

        attribute vec2 aPosition;

        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;

        uniform vec2 texelSize;

        void main () {

          vUv =
            aPosition * 0.5 + 0.5;

          vL =
            vUv -
            vec2(
              texelSize.x,
              0.0
            );

          vR =
            vUv +
            vec2(
              texelSize.x,
              0.0
            );

          vT =
            vUv +
            vec2(
              0.0,
              texelSize.y
            );

          vB =
            vUv -
            vec2(
              0.0,
              texelSize.y
            );

          gl_Position =
            vec4(
              aPosition,
              0.0,
              1.0
            );
        }
        `,
    );

    var clearShader = compileShader(
      gl.FRAGMENT_SHADER,

      `
        precision highp float;
        precision mediump sampler2D;

        varying vec2 vUv;

        uniform sampler2D uTexture;
        uniform float value;

        void main () {

          gl_FragColor =
            value *
            texture2D(
              uTexture,
              vUv
            );
        }
        `,
    );

    var displayShader = compileShader(
      gl.FRAGMENT_SHADER,

      `
        precision highp float;
        precision mediump sampler2D;

        varying vec2 vUv;

        uniform sampler2D uTexture;

        void main () {

          gl_FragColor =
            texture2D(
              uTexture,
              vUv
            );
        }
        `,
    );

    var splatShader = compileShader(
      gl.FRAGMENT_SHADER,

      `
        precision highp float;
        precision mediump sampler2D;

        varying vec2 vUv;

        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;

        void main () {

          vec2 p =
            vUv -
            point.xy;

          p.x *=
            aspectRatio;

          vec3 splat =
            exp(
              -dot(p, p) /
              radius
            ) *
            color;

          vec3 base =
            texture2D(
              uTarget,
              vUv
            ).xyz;

          gl_FragColor =
            vec4(
              base + splat,
              1.0
            );
        }
        `,
    );

    var advectionManualFilteringShader = compileShader(
      gl.FRAGMENT_SHADER,

      `
        precision highp float;
        precision mediump sampler2D;

        varying vec2 vUv;

        uniform sampler2D uVelocity;
        uniform sampler2D uSource;

        uniform vec2 texelSize;
        uniform float dt;
        uniform float dissipation;

        vec4 bilerp(
          in sampler2D sam,
          in vec2 p
        ) {

          vec4 st;

          st.xy =
            floor(
              p - 0.5
            ) + 0.5;

          st.zw =
            st.xy + 1.0;

          vec4 uv =
            st *
            texelSize.xyxy;

          vec4 a =
            texture2D(
              sam,
              uv.xy
            );

          vec4 b =
            texture2D(
              sam,
              uv.zy
            );

          vec4 c =
            texture2D(
              sam,
              uv.xw
            );

          vec4 d =
            texture2D(
              sam,
              uv.zw
            );

          vec2 f =
            p -
            st.xy;

          return mix(
            mix(
              a,
              b,
              f.x
            ),
            mix(
              c,
              d,
              f.x
            ),
            f.y
          );
        }

        void main () {

          vec2 coord =
            gl_FragCoord.xy -
            dt *
            texture2D(
              uVelocity,
              vUv
            ).xy;

          gl_FragColor =
            dissipation *
            bilerp(
              uSource,
              coord
            );

          gl_FragColor.a =
            1.0;
        }
        `,
    );

    var advectionShader = compileShader(
      gl.FRAGMENT_SHADER,

      `
        precision highp float;
        precision mediump sampler2D;

        varying vec2 vUv;

        uniform sampler2D uVelocity;
        uniform sampler2D uSource;

        uniform vec2 texelSize;
        uniform float dt;
        uniform float dissipation;

        void main () {

          vec2 coord =
            vUv -
            dt *
            texture2D(
              uVelocity,
              vUv
            ).xy *
            texelSize;

          gl_FragColor =
            dissipation *
            texture2D(
              uSource,
              coord
            );
        }
        `,
    );

    var divergenceShader = compileShader(
      gl.FRAGMENT_SHADER,

      `
        precision highp float;
        precision mediump sampler2D;

        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;

        uniform sampler2D uVelocity;

        vec2 sampleVelocity(
          in vec2 uv
        ) {

          vec2 multiplier =
            vec2(
              1.0,
              1.0
            );

          if (
            uv.x < 0.0
          ) {

            uv.x = 0.0;
            multiplier.x = -1.0;
          }

          if (
            uv.x > 1.0
          ) {

            uv.x = 1.0;
            multiplier.x = -1.0;
          }

          if (
            uv.y < 0.0
          ) {

            uv.y = 0.0;
            multiplier.y = -1.0;
          }

          if (
            uv.y > 1.0
          ) {

            uv.y = 1.0;
            multiplier.y = -1.0;
          }

          return multiplier *
            texture2D(
              uVelocity,
              uv
            ).xy;
        }

        void main () {

          float L =
            sampleVelocity(
              vL
            ).x;

          float R =
            sampleVelocity(
              vR
            ).x;

          float T =
            sampleVelocity(
              vT
            ).y;

          float B =
            sampleVelocity(
              vB
            ).y;

          float div =
            0.5 *
            (
              R -
              L +
              T -
              B
            );

          gl_FragColor =
            vec4(
              div,
              0.0,
              0.0,
              1.0
            );
        }
        `,
    );

    var curlShader = compileShader(
      gl.FRAGMENT_SHADER,

      `
        precision highp float;
        precision mediump sampler2D;

        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;

        uniform sampler2D uVelocity;

        void main () {

          float L =
            texture2D(
              uVelocity,
              vL
            ).y;

          float R =
            texture2D(
              uVelocity,
              vR
            ).y;

          float T =
            texture2D(
              uVelocity,
              vT
            ).x;

          float B =
            texture2D(
              uVelocity,
              vB
            ).x;

          float vorticity =
            R -
            L -
            T +
            B;

          gl_FragColor =
            vec4(
              vorticity,
              0.0,
              0.0,
              1.0
            );
        }
        `,
    );

    var vorticityShader = compileShader(
      gl.FRAGMENT_SHADER,

      `
        precision highp float;
        precision mediump sampler2D;

        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;

        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;

        uniform float curl;
        uniform float dt;

        void main () {

          float L =
            texture2D(
              uCurl,
              vL
            ).y;

          float R =
            texture2D(
              uCurl,
              vR
            ).y;

          float T =
            texture2D(
              uCurl,
              vT
            ).x;

          float B =
            texture2D(
              uCurl,
              vB
            ).x;

          float C =
            texture2D(
              uCurl,
              vUv
            ).x;

          vec2 force =
            vec2(
              abs(T) -
              abs(B),

              abs(R) -
              abs(L)
            );

          force *=
            1.0 /
            length(
              force +
              0.00001
            ) *
            curl *
            C;

          vec2 vel =
            texture2D(
              uVelocity,
              vUv
            ).xy;

          gl_FragColor =
            vec4(
              vel +
              force * dt,
              0.0,
              1.0
            );
        }
        `,
    );

    var pressureShader = compileShader(
      gl.FRAGMENT_SHADER,

      `
        precision highp float;
        precision mediump sampler2D;

        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;

        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;

        vec2 boundary(
          in vec2 uv
        ) {

          uv =
            min(
              max(
                uv,
                0.0
              ),
              1.0
            );

          return uv;
        }

        void main () {

          float L =
            texture2D(
              uPressure,
              boundary(vL)
            ).x;

          float R =
            texture2D(
              uPressure,
              boundary(vR)
            ).x;

          float T =
            texture2D(
              uPressure,
              boundary(vT)
            ).x;

          float B =
            texture2D(
              uPressure,
              boundary(vB)
            ).x;

          float divergence =
            texture2D(
              uDivergence,
              vUv
            ).x;

          float pressure =
            (
              L +
              R +
              B +
              T -
              divergence
            ) *
            0.25;

          gl_FragColor =
            vec4(
              pressure,
              0.0,
              0.0,
              1.0
            );
        }
        `,
    );

    var gradientSubtractShader = compileShader(
      gl.FRAGMENT_SHADER,

      `
        precision highp float;
        precision mediump sampler2D;

        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;

        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;

        vec2 boundary(
          in vec2 uv
        ) {

          uv =
            min(
              max(
                uv,
                0.0
              ),
              1.0
            );

          return uv;
        }

        void main () {

          float L =
            texture2D(
              uPressure,
              boundary(vL)
            ).x;

          float R =
            texture2D(
              uPressure,
              boundary(vR)
            ).x;

          float T =
            texture2D(
              uPressure,
              boundary(vT)
            ).x;

          float B =
            texture2D(
              uPressure,
              boundary(vB)
            ).x;

          vec2 velocity =
            texture2D(
              uVelocity,
              vUv
            ).xy;

          velocity.xy -=
            vec2(
              R - L,
              T - B
            );

          gl_FragColor =
            vec4(
              velocity,
              0.0,
              1.0
            );
        }
        `,
    );

    var textureWidth;
    var textureHeight;

    var density;
    var velocity;
    var divergence;
    var curl;
    var pressure;

    initFramebuffers();

    var clearProgram = new GLProgram(baseVertexShader, clearShader);

    var displayProgram = new GLProgram(baseVertexShader, displayShader);

    var splatProgram = new GLProgram(baseVertexShader, splatShader);

    var advectionProgram = new GLProgram(
      baseVertexShader,

      support_linear_float ? advectionShader : advectionManualFilteringShader,
    );

    var divergenceProgram = new GLProgram(baseVertexShader, divergenceShader);

    var curlProgram = new GLProgram(baseVertexShader, curlShader);

    var vorticityProgram = new GLProgram(baseVertexShader, vorticityShader);

    var pressureProgram = new GLProgram(baseVertexShader, pressureShader);

    var gradienSubtractProgram = new GLProgram(
      baseVertexShader,
      gradientSubtractShader,
    );

    function initFramebuffers() {
      framebuffers.forEach(([texture, framebuffer]) => {
        gl.deleteFramebuffer(framebuffer);
        gl.deleteTexture(texture);
      });
      framebuffers.length = 0;
      textureWidth = gl.drawingBufferWidth >> config.TEXTURE_DOWNSAMPLE;

      textureHeight = gl.drawingBufferHeight >> config.TEXTURE_DOWNSAMPLE;

      var iFormat = ext.internalFormat;

      var iFormatRG = ext.internalFormatRG;

      var formatRG = ext.formatRG;

      var texType = ext.texType;

      density = createDoubleFBO(
        0,
        textureWidth,
        textureHeight,
        iFormat,
        gl.RGBA,
        texType,

        support_linear_float ? gl.LINEAR : gl.NEAREST,
      );

      velocity = createDoubleFBO(
        2,
        textureWidth,
        textureHeight,
        iFormatRG,
        formatRG,
        texType,

        support_linear_float ? gl.LINEAR : gl.NEAREST,
      );

      divergence = createFBO(
        4,
        textureWidth,
        textureHeight,
        iFormatRG,
        formatRG,
        texType,
        gl.NEAREST,
      );

      curl = createFBO(
        5,
        textureWidth,
        textureHeight,
        iFormatRG,
        formatRG,
        texType,
        gl.NEAREST,
      );

      pressure = createDoubleFBO(
        6,
        textureWidth,
        textureHeight,
        iFormatRG,
        formatRG,
        texType,
        gl.NEAREST,
      );
    }

    function createFBO(texId, w, h, internalFormat, format, type, param) {
      gl.activeTexture(gl.TEXTURE0 + texId);

      var texture = gl.createTexture();

      gl.bindTexture(gl.TEXTURE_2D, texture);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        w,
        h,
        0,
        format,
        type,
        null,
      );

      var fbo = gl.createFramebuffer();

      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0,
      );

      gl.viewport(0, 0, w, h);

      gl.clear(gl.COLOR_BUFFER_BIT);

      const framebuffer = [texture, fbo, texId];
      framebuffers.push(framebuffer);
      return framebuffer;
    }

    function createDoubleFBO(texId, w, h, internalFormat, format, type, param) {
      var fbo1 = createFBO(texId, w, h, internalFormat, format, type, param);

      var fbo2 = createFBO(
        texId + 1,
        w,
        h,
        internalFormat,
        format,
        type,
        param,
      );

      return {
        get first() {
          return fbo1;
        },

        get second() {
          return fbo2;
        },

        swap: function swap() {
          var temp = fbo1;

          fbo1 = fbo2;

          fbo2 = temp;
        },
      };
    }

    var blit = (function () {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());

      gl.bufferData(
        gl.ARRAY_BUFFER,

        new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),

        gl.STATIC_DRAW,
      );

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());

      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,

        new Uint16Array([0, 1, 2, 0, 2, 3]),

        gl.STATIC_DRAW,
      );

      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(0);

      return function (destination) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, destination);

        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    })();

    var lastTime = Date.now();

    update();

    function update() {
      var dt = Math.min(
        (Date.now() - lastTime) / 1000,

        0.016,
      );

      lastTime = Date.now();

      gl.viewport(0, 0, textureWidth, textureHeight);

      if (splatStack.length > 0) {
        for (var m = 0; m < splatStack.pop(); m++) {
          var color = [
            Math.random() * 10,
            Math.random() * 10,
            Math.random() * 10,
          ];

          var x = canvas.width * Math.random();

          var y = canvas.height * Math.random();

          var dx = 1000 * (Math.random() - 0.5);

          var dy = 1000 * (Math.random() - 0.5);

          splat(x, y, dx, dy, color);
        }
      }

      advectionProgram.bind();

      gl.uniform2f(
        advectionProgram.uniforms.texelSize,

        1.0 / textureWidth,

        1.0 / textureHeight,
      );

      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.first[2]);

      gl.uniform1i(advectionProgram.uniforms.uSource, velocity.first[2]);

      gl.uniform1f(advectionProgram.uniforms.dt, dt);

      gl.uniform1f(
        advectionProgram.uniforms.dissipation,

        config.VELOCITY_DISSIPATION,
      );

      blit(velocity.second[1]);

      velocity.swap();

      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.first[2]);

      gl.uniform1i(advectionProgram.uniforms.uSource, density.first[2]);

      gl.uniform1f(
        advectionProgram.uniforms.dissipation,

        config.DENSITY_DISSIPATION,
      );

      blit(density.second[1]);

      density.swap();

      for (var i = 0, len = pointers.length; i < len; i++) {
        var pointer = pointers[i];

        if (pointer.moved) {
          splat(pointer.x, pointer.y, pointer.dx, pointer.dy, pointer.color);

          pointer.moved = false;
        }
      }

      curlProgram.bind();

      gl.uniform2f(
        curlProgram.uniforms.texelSize,

        1.0 / textureWidth,

        1.0 / textureHeight,
      );

      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.first[2]);

      blit(curl[1]);

      vorticityProgram.bind();

      gl.uniform2f(
        vorticityProgram.uniforms.texelSize,

        1.0 / textureWidth,

        1.0 / textureHeight,
      );

      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.first[2]);

      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl[2]);

      gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);

      gl.uniform1f(vorticityProgram.uniforms.dt, dt);

      blit(velocity.second[1]);

      velocity.swap();

      divergenceProgram.bind();

      gl.uniform2f(
        divergenceProgram.uniforms.texelSize,

        1.0 / textureWidth,

        1.0 / textureHeight,
      );

      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.first[2]);

      blit(divergence[1]);

      clearProgram.bind();

      var pressureTexId = pressure.first[2];

      gl.activeTexture(gl.TEXTURE0 + pressureTexId);

      gl.bindTexture(gl.TEXTURE_2D, pressure.first[0]);

      gl.uniform1i(clearProgram.uniforms.uTexture, pressureTexId);

      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE_DISSIPATION);

      blit(pressure.second[1]);

      pressure.swap();

      pressureProgram.bind();

      gl.uniform2f(
        pressureProgram.uniforms.texelSize,

        1.0 / textureWidth,

        1.0 / textureHeight,
      );

      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence[2]);

      pressureTexId = pressure.first[2];

      gl.activeTexture(gl.TEXTURE0 + pressureTexId);

      for (var p = 0; p < config.PRESSURE_ITERATIONS; p++) {
        gl.bindTexture(gl.TEXTURE_2D, pressure.first[0]);

        gl.uniform1i(pressureProgram.uniforms.uPressure, pressureTexId);

        blit(pressure.second[1]);

        pressure.swap();
      }

      gradienSubtractProgram.bind();

      gl.uniform2f(
        gradienSubtractProgram.uniforms.texelSize,

        1.0 / textureWidth,

        1.0 / textureHeight,
      );

      gl.uniform1i(
        gradienSubtractProgram.uniforms.uPressure,

        pressure.first[2],
      );

      gl.uniform1i(
        gradienSubtractProgram.uniforms.uVelocity,

        velocity.first[2],
      );

      blit(velocity.second[1]);

      velocity.swap();

      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

      displayProgram.bind();

      gl.uniform1i(
        displayProgram.uniforms.uTexture,

        density.first[2],
      );

      blit(null);

      requestAnimationFrame(update);
    }

    function splat(x, y, dx, dy, color) {
      splatProgram.bind();

      gl.uniform1i(
        splatProgram.uniforms.uTarget,

        velocity.first[2],
      );

      gl.uniform1f(
        splatProgram.uniforms.aspectRatio,

        canvas.width / canvas.height,
      );

      gl.uniform2f(
        splatProgram.uniforms.point,

        x / canvas.width,

        1.0 - y / canvas.height,
      );

      gl.uniform3f(
        splatProgram.uniforms.color,

        dx,
        -dy,
        1.0,
      );

      gl.uniform1f(
        splatProgram.uniforms.radius,

        config.SPLAT_RADIUS,
      );

      blit(velocity.second[1]);

      velocity.swap();

      gl.uniform1i(
        splatProgram.uniforms.uTarget,

        density.first[2],
      );

      gl.uniform3f(
        splatProgram.uniforms.color,

        color[0] * 0.3,

        color[1] * 0.3,

        color[2] * 0.3,
      );

      blit(density.second[1]);

      density.swap();
    }

    function redimensionarCanvas(largura, altura) {
      if (largura < 2 || altura < 2 || (canvas.width === largura && canvas.height === altura)) return;
      canvas.width = largura;
      canvas.height = altura;
      initFramebuffers();
    }

    if ("ResizeObserver" in window) {
      new ResizeObserver(([entrada]) => {
        const { width, height } = entrada.contentRect;
        redimensionarCanvas(Math.round(width), Math.round(height));
      }).observe(canvas);
    } else {
      window.addEventListener("resize", () => redimensionarCanvas(canvas.clientWidth, canvas.clientHeight));
    }

    var count = 0;

    var colorArr = [
      Math.random() + 0.2,
      Math.random() + 0.2,
      Math.random() + 0.2,
    ];

    canvas.addEventListener(
      "mousemove",

      function (e) {
        count++;

        if (count > 25) {
          colorArr = [
            Math.random() + 0.2,
            Math.random() + 0.2,
            Math.random() + 0.2,
          ];

          count = 0;
        }

        pointers[0].down = true;

        pointers[0].color = colorArr;

        pointers[0].moved = pointers[0].down;

        pointers[0].dx = (e.offsetX - pointers[0].x) * 10.0;

        pointers[0].dy = (e.offsetY - pointers[0].y) * 10.0;

        pointers[0].x = e.offsetX;

        pointers[0].y = e.offsetY;
      },
    );

    canvas.addEventListener(
      "touchmove",

      function (e) {
        e.preventDefault();

        var touches = e.targetTouches;

        count++;

        if (count > 25) {
          colorArr = [
            Math.random() + 0.2,
            Math.random() + 0.2,
            Math.random() + 0.2,
          ];

          count = 0;
        }

        var rect = canvas.getBoundingClientRect();

        for (var i = 0, len = touches.length; i < len; i++) {
          if (i >= pointers.length) {
            pointers.push(new pointerPrototype());
          }

          var touchX = touches[i].clientX - rect.left;

          var touchY = touches[i].clientY - rect.top;

          var pointer = pointers[i];

          var previousX = pointer.x;

          var previousY = pointer.y;

          pointer.id = touches[i].identifier;

          pointer.down = true;

          pointer.color = colorArr;

          pointer.moved = true;

          pointer.dx = (touchX - previousX) * 10.0;

          pointer.dy = (touchY - previousY) * 10.0;

          pointer.x = touchX;

          pointer.y = touchY;
        }
      },

      {
        passive: false,
      },
    );
  }

  document.querySelectorAll(".canvas-fluid").forEach(function (canvas) {
    if (canvas.dataset.fluidInit === "true") {
      return;
    }

    function iniciarAoMoverMouse(evento) {
      if (evento.pointerType !== "mouse" || window.innerWidth <= 1024) return;
      canvas.removeEventListener("pointermove", iniciarAoMoverMouse);
      canvas.dataset.fluidInit = "true";
      iniciarFluid(canvas);
    }

    canvas.addEventListener("pointermove", iniciarAoMoverMouse, { passive: true });
  });
}

function iniciarLenis() {
  if (window.innerWidth <= 1024) return;

  if (typeof Lenis === "undefined") {
    console.warn("Lenis não foi carregado.");

    return;
  }

  const lenis = new Lenis({
    duration: 2.5,

    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),

    orientation: "vertical",

    gestureOrientation: "vertical",

    smoothWheel: true,

    wheelMultiplier: 1,

    touchMultiplier: 2,

    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);

    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  window.lenis = lenis;
}

function iniciarAnimacaoDobra02() {
  const secao = document.querySelector("#dobra2");

  if (!secao) {
    console.warn("#dobra2 não encontrada.");

    return;
  }

  const titulo = secao.querySelector("h2");

  const icone = secao.querySelector(".search-bar");

  const cards = Array.from(secao.querySelectorAll(".siteImpactoCard"));

  if (!titulo || !icone || cards.length !== 3) {
    console.warn("H2, barra de busca ou os 3 cards da dobra 02 não foram encontrados.");

    return;
  }

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP ou ScrollTrigger não carregado.");

    return;
  }

  if (secao.dataset.impactoInit === "true") {
    return;
  }

  secao.dataset.impactoInit = "true";

  if (window.lenis && !window.__impactoLenisST) {
    window.lenis.on("scroll", ScrollTrigger.update);

    window.__impactoLenisST = true;
  }

  gsap.set(titulo, {
    y: () => window.innerHeight * 0.3268,

    autoAlpha: 0,

    force3D: true,
  });

  gsap.set(icone, {
    y: () => window.innerHeight * 0.3268,

    autoAlpha: 0,

    force3D: true,
  });

  gsap.set(cards, {
    y: () => window.innerHeight * 0.72,

    autoAlpha: 0,

    force3D: true,
  });

  // Título e barra sobem juntos assim que o topo da seção chega a 80% da tela.
  gsap.to([titulo, icone], {
    y: 0,
    autoAlpha: 1,
    ease: "none",
    scrollTrigger: {
      trigger: secao,
      start: "top 80%",
      end: "top 20%",
      scrub: 0.35,
      invalidateOnRefresh: true,
    },
  });

  const timeline = gsap.timeline({
    defaults: {
      ease: "none",
    },

    scrollTrigger: {
      trigger: secao,

      start: "top top",

      end: () => "+=" + window.innerHeight * 2,

      pin: true,

      pinSpacing: true,

      scrub: 0.35,

      anticipatePin: 1,

      invalidateOnRefresh: true,

    },
  });

  // Cards entram sem espera inicial, em sequência com leve sobreposição.
  timeline.to(cards, {
    y: 0,
    autoAlpha: 1,
    duration: 0.75,
    stagger: 0.35,
    ease: "power2.out",
  }, 0);

  timeline.to({}, { duration: 0.25 });

  agendarRefreshNoQuadro();
  window.addEventListener("load", atualizarMedidasScroll, { once: true });
}

function iniciarDivisoresAnimados() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP ou ScrollTrigger não carregado.");

    return;
  }

  const divisores = gsap.utils.toArray(".divisorAnimado");

  if (!divisores.length) {
    return;
  }

  divisores.forEach((divisor) => {
    const faixas = gsap.utils.toArray(
      divisor.querySelectorAll(".divisorAnimadoFaixas span"),
    );

    if (!faixas.length) {
      return;
    }

    gsap.set(faixas, {
      scaleY: 0,

      autoAlpha: 1,

      transformOrigin: "center center",
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: divisor,

        start: "top 99.5%",

        end: () => "+=" + window.innerHeight * 0.58,

        scrub: 1,

        invalidateOnRefresh: true,
      },
    });

    timeline.to(
      faixas,
      {
        scaleY: 1,

        duration: 0.38,

        stagger: {
          each: 0.045,

          from: "edges",
        },

        ease: "power2.out",
      },
      0,
    );

    timeline.to(
      faixas,
      {
        scaleY: 0,

        duration: 0.62,

        stagger: {
          each: 0.055,

          from: "edges",
        },

        ease: "power2.inOut",
      },
      0.32,
    );
  });

  agendarRefreshNoQuadro();
}

function iniciarSlidersDobra04() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP ou ScrollTrigger não carregado.");

    return;
  }

  const secao = document.querySelector(".dobra04");

  if (!secao) {
    return;
  }

  const paineis = gsap.utils.toArray(
    secao.querySelectorAll(":scope > .slider"),
  );

  if (!paineis.length) {
    return;
  }

  const dobra05 = document.querySelector(".dobra05");

  if (secao.dataset.slidersAtivos === "true") {
    return;
  }

  secao.dataset.slidersAtivos = "true";

  const PAUSA_VIEWPORT = 0.38;

  const ESCALA_FINAL = 0.7;

  const OPACIDADE_RECUO = 0.5;

  const BORDA_INICIAL = "rgba(239, 101, 0, 0)";

  const BORDA_FINAL = "rgba(239, 101, 0, 0.72)";

  function aplicarPausaEntrePaineis() {
    const distanciaPausa = Math.max(220, window.innerHeight * PAUSA_VIEWPORT);

    paineis.forEach((painel, index) => {
      const temProximo = index < paineis.length - 1;

      const temSaidaFinal = index === paineis.length - 1 && !!dobra05;

      painel.style.marginBottom =
        temProximo || temSaidaFinal ? `${distanciaPausa}px` : "0px";
    });
  }

  aplicarPausaEntrePaineis();

  ScrollTrigger.addEventListener("refreshInit", aplicarPausaEntrePaineis);

  paineis.forEach((painel, index) => {
    gsap.set(painel, {
      position: "relative",

      zIndex: index + 1,

      scale: 1,

      opacity: 1,

      borderColor: BORDA_INICIAL,

      boxShadow: "0 0 0 0 rgba(239, 101, 0, 0)",

      transformOrigin: "50% 50%",

      force3D: true,
    });
  });

  if (dobra05) {
    gsap.set(dobra05, {
      position: "relative",

      zIndex: paineis.length + 2,
    });
  }

  paineis.forEach((painel, index) => {
    const proximo = paineis[index + 1] || dobra05;

    if (!proximo) {
      return;
    }

    ScrollTrigger.create({
      trigger: painel,

      start: "top top",

      endTrigger: proximo,

      end: "top top",

      pin: true,

      pinSpacing: false,

      anticipatePin: 1,

      invalidateOnRefresh: true,
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: proximo,

        start: "top bottom",

        end: "top top",

        scrub: 1,

        invalidateOnRefresh: true,
      },
    });

    timeline.fromTo(
      painel,

      {
        scale: 1,

        opacity: 1,

        borderColor: BORDA_INICIAL,

        boxShadow: "0 0 0 0 rgba(239, 101, 0, 0)",
      },

      {
        scale: ESCALA_FINAL,

        opacity: OPACIDADE_RECUO,

        borderColor: BORDA_FINAL,

        boxShadow: `
              0 0 0 2px rgba(255, 108, 3, 0.48),
              0 0 32px rgba(239, 101, 0, 0.10)
            `,

        duration: 0.9,

        ease: "none",
      },
    );

    timeline.to(painel, {
      opacity: 0,

      duration: 0.1,

      ease: "none",
    });
  });

  agendarRefreshNoQuadro(true);
}

function iniciarCarrosselServicos() {
  const secao = document.querySelector(".servicosCarrossel");

  if (!secao) return;

  const gallery = secao.querySelector(".gallery");

  const cabecalho = secao.querySelector(".servicos-carrossel-titulo");

  const cards = gsap.utils.toArray(secao.querySelectorAll(".cardsCarrossel"));

  const botaoAnterior = secao.querySelector(".prev");

  const botaoProximo = secao.querySelector(".next");

  const proxy = secao.querySelector(".drag-proxy");

  const fragmentosSaida = gsap.utils.toArray(
    secao.querySelectorAll(".servicosExitFragments span"),
  );

  if (
    !gallery ||
    !cabecalho ||
    cards.length < 2 ||
    fragmentosSaida.length !== 6
  ) {
    return;
  }

  const spacing = 0.1;

  const ultimoIndice = cards.length - 1;

  const tempoPrimeiroCard = 0.5;

  const pausaUltimoCard = 0.35;
  const inicioSaida = ultimoIndice + pausaUltimoCard;

  gsap.set(cards, {
    xPercent: 400,

    opacity: 0,

    scale: 0,
  });

  gsap.set(fragmentosSaida, {
    scaleY: 1,

    autoAlpha: 1,
  });

  gsap.set([cabecalho, gallery], {
    autoAlpha: 1,

    yPercent: 0,

    filter: "blur(0px)",
  });

  const animateFunc = (element) => {
    const tl = gsap.timeline();

    tl.fromTo(
      element,

      {
        scale: 0,

        opacity: 0,
      },

      {
        scale: 1,

        opacity: 1,

        zIndex: 100,

        duration: 0.5,

        yoyo: true,

        repeat: 1,

        ease: "power1.in",

        immediateRender: false,
      },
    );

    tl.fromTo(
      element,

      {
        xPercent: 400,
      },

      {
        xPercent: -400,

        duration: 1,

        ease: "none",

        immediateRender: false,
      },

      0,
    );

    return tl;
  };

  const rawSequence = gsap.timeline({
    paused: true,
  });

  cards.forEach((card, indice) => {
    rawSequence.add(
      animateFunc(card),

      indice * spacing,
    );
  });

  const estado = {
    posicao: 0,
  };

  function renderizar() {
    const posicao = gsap.utils.clamp(0, ultimoIndice, estado.posicao);

    const tempo = tempoPrimeiroCard + posicao * spacing;

    rawSequence.time(tempo, false);

    atualizarBotoes(posicao);
  }

  function atualizarBotoes(posicao) {
    if (botaoAnterior) {
      botaoAnterior.disabled = posicao <= 0.01;
    }

    if (botaoProximo) {
      botaoProximo.disabled = posicao >= ultimoIndice - 0.01;
    }
  }

  renderizar();

  const animacaoScroll = gsap.timeline({
    paused: true,
  });

  animacaoScroll.to(
    estado,
    {
      posicao: ultimoIndice,

      duration: ultimoIndice,

      ease: "none",

      onUpdate() {
        renderizar();
      },
    },
    0,
  );

  animacaoScroll.to(
    {},
    {
      duration: pausaUltimoCard,
    },
  );

  animacaoScroll.to(
    [cabecalho, gallery],
    {
      yPercent: -3,

      autoAlpha: 0,

      filter: "blur(6px)",

      duration: 0.18,

      ease: "power2.in",
    },
    inicioSaida,
  );

  animacaoScroll.to(
    fragmentosSaida,
    {
      scaleY: 0,

      duration: 0.38,

      stagger: {
        each: 0.035,

        from: "edges",
      },

      ease: "power2.inOut",
    },
    inicioSaida,
  );

  animacaoScroll.to(
    secao,
    {
      autoAlpha: 0,

      duration: 0.08,

      ease: "none",
    },
    inicioSaida + 0.55,
  );

  const trigger = ScrollTrigger.create({
    trigger: secao,

    start: "top top",

    end: () => "+=" + window.innerHeight * animacaoScroll.duration(),

    animation: animacaoScroll,

    pin: true,

    scrub: 1.5,

    anticipatePin: 1,

    invalidateOnRefresh: true,
  });

  function irParaCard(indice) {
    const indiceDestino = gsap.utils.clamp(0, ultimoIndice, indice);

    const scrollDestino = trigger.start + indiceDestino * window.innerHeight;

    if (window.lenis && typeof window.lenis.scrollTo === "function") {
      window.lenis.scrollTo(scrollDestino, {
        duration: 1,
      });
    } else {
      window.scrollTo({
        top: scrollDestino,

        behavior: "smooth",
      });
    }
  }

  botaoProximo?.addEventListener("click", () => {
    irParaCard(Math.round(estado.posicao) + 1);
  });

  botaoAnterior?.addEventListener("click", () => {
    irParaCard(Math.round(estado.posicao) - 1);
  });

  if (typeof Draggable !== "undefined" && proxy) {
    let posicaoInicial = 0;

    let posicaoArraste = 0;

    Draggable.create(proxy, {
      type: "x",

      trigger: gallery,

      onPress() {
        posicaoInicial = estado.posicao;

        posicaoArraste = posicaoInicial;
      },

      onDrag() {
        posicaoArraste = gsap.utils.clamp(
          0,

          ultimoIndice,

          posicaoInicial + (this.startX - this.x) / 180,
        );

        estado.posicao = posicaoArraste;

        renderizar();
      },

      onDragEnd() {
        irParaCard(Math.round(posicaoArraste));
      },
    });
  }

  agendarRefreshNoQuadro();
  requestAnimationFrame(renderizar);
}

function iniciarValorPercebido() {
  if (document.documentElement.dataset.valorPercebidoInit === "true") {
    return;
  }

  document.documentElement.dataset.valorPercebidoInit = "true";

  const configuracoes = [
    {
      secao: document.querySelector("#beneficios-presenca"),

      entradaTexto: [
        ":scope > h2",
      ],

      cards: ".classpresenca-beneficios article",

      saida: false,
    },

    {
      secao: document.querySelector(".dobra07"),

      entradaTexto: [".valorTitulo", ".textValor > span", ".textValor > p"],

      cards: ".visual-card",

      saida: true,
    },
  ];

  const reduzirMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function ativarCard(cards, indiceAtivo) {
    cards.forEach((card, indice) => {
      card.classList.toggle("ativo", indice === indiceAtivo);
    });
  }

  configuracoes.forEach((config) => {
    const secao = config.secao;

    if (!secao) {
      return;
    }

    const entradaTexto = gsap.utils.toArray(
      config.entradaTexto.flatMap((seletor) =>
        Array.from(secao.querySelectorAll(seletor)),
      ),
    );

    const cards = gsap.utils.toArray(secao.querySelectorAll(config.cards));

    if (!cards.length) {
      return;
    }

    const fragmentosSaida = config.saida
      ? gsap.utils.toArray(secao.querySelectorAll(".valorExitFragments span"))
      : [];

    const conteudoSaida = config.saida
      ? [
          secao.querySelector(".valorTitulo"),

          secao.querySelector(".textValor"),

          secao.querySelector(".visual-cards"),
        ].filter(Boolean)
      : [];

    ativarCard(cards, -1);

    gsap.set(cards, {
      x: 0,

      y: -54,

      autoAlpha: 0,
    });

    if (secao.id === "beneficios-presenca") {
      gsap.set(entradaTexto, { y: 0, autoAlpha: 1, filter: "none" });
    } else {
      gsap.set(entradaTexto, { y: -38, autoAlpha: 0, filter: "blur(10px)" });
    }

    if (fragmentosSaida.length) {
      gsap.set(fragmentosSaida, {
        scaleY: 1,

        autoAlpha: 1,
      });
    }

    if (reduzirMovimento) {
      gsap.set([...entradaTexto, ...cards], {
        y: 0,

        autoAlpha: 1,

        filter: "blur(0px)",
      });

      ativarCard(cards, 0);

      return;
    }

    if (secao.id === "beneficios-presenca") {
      gsap.fromTo(secao.querySelector(".classpresenca-beneficios"),
        { y: 48, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: secao,
            start: "top 80%",
            end: "top top",
            scrub: .5,
            invalidateOnRefresh: true,
          },
        },
      );
    }

    const entradaAntecipada = gsap.timeline({
      scrollTrigger: {
        trigger: secao,

        start: "top 80%",

        end: "top top",

        scrub: 1,

        invalidateOnRefresh: true,
      },
    });

    if (secao.id === "beneficios-presenca") {
      // Copy motion / splittext-complete.js: modelo lines3d.
      // Dispara quando o título fica visível, com duração própria e sem scrub.
      const linhasTitulo = secao.querySelectorAll(".beneficiosTituloLinha");
      gsap.set(linhasTitulo, {
          yPercent: 112,
          rotationX: -100,
          transformOrigin: "50% 50% -80px",
          autoAlpha: 0,
      });
      gsap.to(linhasTitulo, {
          yPercent: 0,
          rotationX: 0,
          autoAlpha: 1,
          duration: 1.05,
          stagger: .22,
          ease: "power3.out",
          scrollTrigger: {
            trigger: secao.querySelector("h2"),
            start: "top 88%",
            toggleActions: "play none none reset",
            invalidateOnRefresh: true,
          },
        },
      );
      // Mantém a divisória ligada ao scroll de entrada, independentemente do texto.
      entradaAntecipada.to({}, { duration: 1 });
      entradaAntecipada.eventCallback("onUpdate", () => {
        secao.style.setProperty("--entrada-presenca", entradaAntecipada.progress().toFixed(4));
      });
    } else {
      entradaAntecipada.to(entradaTexto, {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: .65,
        stagger: .08,
        ease: "power3.out",
      });
    }

    const inicioCards = 0.38;

    const intervaloCards = 0.92;

    const inicios = cards.map(
      (_, indice) => inicioCards + indice * intervaloCards,
    );

    const inicioNeutro = inicios[inicios.length - 1] + 0.78;

    const inicioSaida = inicioNeutro + 0.4;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: secao,

        start: "top top",

        end: config.saida ? "+=305%" : "+=255%",

        pin: true,

        scrub: 1,

        anticipatePin: 1,

        invalidateOnRefresh: true,
      },
    });

    cards.forEach((card, indice) => {
      timeline.to(
        card,
        {
          x: 0,

          y: 0,

          autoAlpha: 1,

          duration: 0.48,

          ease: "power3.out",
        },

        inicios[indice],
      );
    });

    timeline.to(
      {},
      {
        duration: 0.4,
      },

      inicioNeutro,
    );

    if (config.saida && fragmentosSaida.length === 6) {
      timeline.to(
        conteudoSaida,
        {
          yPercent: -3,

          autoAlpha: 0,

          filter: "blur(6px)",

          duration: 0.18,

          ease: "power2.in",
        },

        inicioSaida,
      );

      timeline.to(
        fragmentosSaida,
        {
          scaleY: 0,

          duration: 0.38,

          stagger: {
            each: 0.035,

            from: "edges",
          },

          ease: "power2.inOut",
        },

        inicioSaida,
      );

      timeline.to(
        secao,
        {
          autoAlpha: 0,

          duration: 0.08,

          ease: "none",
        },

        inicioSaida + 0.56,
      );
    } else {
      timeline.to(
        {},
        {
          duration: 0.35,
        },

        inicioSaida,
      );
    }

    timeline.eventCallback("onUpdate", () => {
      const tempo = timeline.time();

      let indiceAtivo = -1;

      inicios.forEach((inicio, indice) => {
        const proximoInicio = inicios[indice + 1] ?? inicioNeutro;

        if (tempo >= inicio && tempo < proximoInicio) {
          indiceAtivo = indice;
        }
      });

      ativarCard(cards, indiceAtivo);
      if (secao.id === "beneficios-presenca") {
        secao.style.setProperty("--movimento-presenca", timeline.progress().toFixed(4));
      }
    });
  });

  window.addEventListener("load", atualizarMedidasScroll, { once: true });
}

function iniciarProjetosDestaque() {
  const secao = document.querySelector(".projetosDestaque");

  if (!secao) {
    return;
  }

  const projetoImagens = gsap.utils.toArray(
    secao.querySelectorAll(".projetoImagemSlide"),
  );

  const projetoConteudos = gsap.utils.toArray(
    secao.querySelectorAll(".projetoConteudoSlide"),
  );

  const projetoIndicadores = gsap.utils.toArray(
    secao.querySelectorAll(".projetoIndicador"),
  );

  const projetoLinhas = projetoIndicadores.map((indicador) =>
    indicador.querySelector(".projetoIndicadorLinha"),
  );

  const TOTAL_PROJETOS = projetoImagens.length;

  if (!TOTAL_PROJETOS) {
    return;
  }

  let projetoAtual = 0;

  /* =========================================================
     ESTADO INICIAL DAS IMAGENS
  ========================================================= */

  gsap.set(projetoImagens, {
    autoAlpha: 0,
    scale: 1.015,
  });

  gsap.set(projetoImagens[0], {
    autoAlpha: 1,
    scale: 1,
  });

  /* =========================================================
     ESTADO INICIAL DOS CONTEÚDOS

     Todos começam sem interação.
     Somente o primeiro começa liberado.
  ========================================================= */

  gsap.set(projetoConteudos, {
    autoAlpha: 0,
    x: 22,
    pointerEvents: "none",
  });

  gsap.set(projetoConteudos[0], {
    autoAlpha: 1,
    x: 0,
    pointerEvents: "auto",
  });

  projetoConteudos.forEach((conteudo, index) => {
    conteudo.classList.toggle("is-active", index === 0);
  });

  /* =========================================================
     ESTADO INICIAL DOS INDICADORES
  ========================================================= */

  projetoLinhas.forEach((linha, index) => {
    gsap.set(linha, {
      "--barra-progresso": index === 0 ? 1 : 0,
    });
  });

  projetoIndicadores.forEach((indicador, index) => {
    indicador.classList.toggle("is-active", index === 0);
  });

  /* =========================================================
     TROCA DE PROJETO
  ========================================================= */

  function ativarProjeto(novoIndex) {
    if (novoIndex === projetoAtual) {
      return;
    }

    const imagemAnterior = projetoImagens[projetoAtual];
    const imagemNova = projetoImagens[novoIndex];

    const conteudoAnterior = projetoConteudos[projetoAtual];
    const conteudoNovo = projetoConteudos[novoIndex];

    const linhaAnterior = projetoLinhas[projetoAtual];
    const linhaNova = projetoLinhas[novoIndex];

    gsap.killTweensOf([
      imagemAnterior,
      imagemNova,
      conteudoAnterior,
      conteudoNovo,
      linhaAnterior,
      linhaNova,
    ]);

    /*
      Bloqueia imediatamente o projeto anterior
      e libera imediatamente o projeto novo.
    */

    gsap.set(conteudoAnterior, {
      pointerEvents: "none",
    });

    gsap.set(conteudoNovo, {
      pointerEvents: "auto",
    });

    projetoConteudos.forEach((conteudo, index) => {
      conteudo.classList.toggle("is-active", index === novoIndex);
    });

    /* ANIMAÇÃO DA IMAGEM ANTERIOR */

    gsap.to(imagemAnterior, {
      autoAlpha: 0,
      scale: 0.985,
      duration: 0.42,
      ease: "power2.out",
      overwrite: true,
    });

    /* ANIMAÇÃO DA IMAGEM NOVA */

    gsap.fromTo(
      imagemNova,
      {
        autoAlpha: 0,
        scale: 1.015,
      },
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.65,
        ease: "power2.out",
        overwrite: true,
      },
    );

    /* ANIMAÇÃO DO CONTEÚDO ANTERIOR */

    gsap.to(conteudoAnterior, {
      autoAlpha: 0,
      x: -22,
      pointerEvents: "none",
      duration: 0.3,
      ease: "power2.out",
      overwrite: true,
    });

    /* ANIMAÇÃO DO CONTEÚDO NOVO */

    gsap.fromTo(
      conteudoNovo,
      {
        autoAlpha: 0,
        x: 22,
        pointerEvents: "auto",
      },
      {
        autoAlpha: 1,
        x: 0,
        pointerEvents: "auto",
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
      },
    );

    /* LINHA DO INDICADOR ANTERIOR */

    if (linhaAnterior) {
      gsap.to(linhaAnterior, {
        "--barra-progresso": 0,
        duration: 0.5,
        ease: "power2.inOut",
        overwrite: true,
      });
    }

    /* LINHA DO INDICADOR NOVO */

    if (linhaNova) {
      gsap.fromTo(
        linhaNova,
        {
          "--barra-progresso": 0,
        },
        {
          "--barra-progresso": 1,
          duration: 0.75,
          ease: "power3.inOut",
          overwrite: true,
        },
      );
    }

    /* ATUALIZA INDICADORES */

    projetoIndicadores.forEach((indicador, index) => {
      indicador.classList.toggle("is-active", index === novoIndex);
    });

    projetoAtual = novoIndex;
  }

  /* =========================================================
     SCROLLTRIGGER ORIGINAL
  ========================================================= */

  ScrollTrigger.create({
    trigger: secao,

    start: "top top",

    end: () => `+=${window.innerHeight * TOTAL_PROJETOS}`,

    pin: true,

    scrub: 1,

    anticipatePin: 1,

    invalidateOnRefresh: true,

    onUpdate(self) {
      const novoIndex = Math.min(
        TOTAL_PROJETOS - 1,
        Math.floor(self.progress * TOTAL_PROJETOS),
      );

      ativarProjeto(novoIndex);
    },
  });

  // A primeira medição global já está agendada junto com as outras dobras.
  agendarRefreshNoQuadro();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarProjetosDestaque);
} else {
  iniciarProjetosDestaque();
}

function iniciarFaq() {
  const faq = document.querySelector(".contato .faq");
  if (!faq || faq.dataset.faqInit === "true") return;
  faq.dataset.faqInit = "true";
  const itens = [...faq.querySelectorAll(".faqItem")];
  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function atualizar(item, aberto) {
    item.classList.toggle("ativo", aberto);
    item.querySelector(".faqPergunta").setAttribute("aria-expanded", String(aberto));
    const resposta = item.querySelector(".faqResposta");
    resposta.setAttribute("aria-hidden", String(!aberto));
    resposta.inert = !aberto;
  }
  function recalcularScroll() {
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  }
  itens.forEach(item => {
    const pergunta = item.querySelector(".faqPergunta");
    pergunta.addEventListener("click", () => {
      const abrir = !item.classList.contains("ativo");
      itens.forEach(outro => atualizar(outro, outro === item && abrir));
      if (reduzir) requestAnimationFrame(recalcularScroll);
    });
  });
  // Recalcula as dobras seguintes depois que a resposta termina de abrir/fechar.
  faq.addEventListener("transitionend", evento => {
    if (evento.target.classList.contains("faqResposta") && evento.propertyName === "grid-template-rows") recalcularScroll();
  });
}
iniciarFaq();

function iniciarTransicaoPercepcao() {
  const secao = document.querySelector(".percepcao");

  if (!secao) return;


  const conteudo = gsap.utils.toArray(
    secao.querySelectorAll(
      ".percepcaoTopo, .percepcaoBottom"
    )
  );


  const fragmentosSaida = gsap.utils.toArray(
    secao.querySelectorAll(
      ".percepcaoExitFragments span"
    )
  );


  if (fragmentosSaida.length !== 6) {
    return;
  }


  /* =====================================================
     ESTADO INICIAL

     A seção continua PRETA.
     Os fragmentos brancos não aparecem ainda.
  ===================================================== */

  gsap.set(fragmentosSaida, {
    scaleY: 0,
    autoAlpha: 1,
  });


  gsap.set(conteudo, {
    yPercent: 0,
    autoAlpha: 1,
    filter: "blur(0px)",
  });


  // Copy motion: caracteres em perspectiva e modelo blurWords, sem alterar a saída.
  const mediaEntrada = gsap.matchMedia();
  mediaEntrada.add("(prefers-reduced-motion: no-preference)", () => {
    const titulo = SplitText.create(secao.querySelector("h2"), {
      type: "words,chars", autoSplit: true,
      onSplit(divisao) {
        return gsap.from(divisao.chars, {
          x: 26, rotationY: -75, transformPerspective: 600,
          transformOrigin: "0% 50%", filter: "blur(6px)", autoAlpha: 0,
          duration: .85, stagger: { amount: .85 }, ease: "power3.out",
          scrollTrigger: { trigger: secao, start: "top 75%", toggleActions: "play none none reset" },
        });
      },
    });
    const apoios = [...secao.querySelectorAll(".percepcaoBottom > p > span:not(.percepcaoConvite), .percepcaoConvite > strong, .percepcaoConvite > span")].map((elemento, indice) => SplitText.create(elemento, {
      type: "words", autoSplit: true,
      aria: "none",
      onSplit(divisao) {
        return gsap.from(divisao.words, {
          filter: "blur(12px)", autoAlpha: 0, x: 16, scale: .94,
          duration: .8, stagger: { amount: .65 }, delay: .25 + indice * .16,
          ease: "power2.out",
          scrollTrigger: { trigger: secao, start: "top 65%", toggleActions: "play none none reset" },
        });
      },
    }));
    gsap.from(secao.querySelector(".sitePercepcao"), {
      scaleX: .65, autoAlpha: 0, transformOrigin: "left center", duration: .8, ease: "power3.out",
      scrollTrigger: { trigger: secao, start: "top 78%", toggleActions: "play none none reset" },
    });
    gsap.from(secao.querySelector(".percepcaoTraco"), {
      strokeDasharray: 500, strokeDashoffset: 500, duration: 1.8, ease: "power2.inOut",
      scrollTrigger: { trigger: secao, start: "top 75%", toggleActions: "play none none reset" },
    });
    return () => [titulo, ...apoios].forEach(divisao => divisao.revert());
  });

  const animacaoScroll = gsap.timeline({
    paused: true,
  });


  /* =====================================================
     SEGURA A DOBRA
  ===================================================== */

  animacaoScroll.to(
    {},
    {
      duration: 0.6,
    }
  );


  /* =====================================================
     CONTEÚDO SAI
  ===================================================== */

  animacaoScroll.to(
    conteudo,
    {
      yPercent: -3,

      autoAlpha: 0,

      filter: "blur(6px)",

      duration: 0.18,

      ease: "power2.in",
    }
  );


  /* =====================================================
     FRAGMENTOS

     ACONTECE UMA ÚNICA VEZ.

     0 → 1

     NÃO TEM OUTRO TWEEN VOLTANDO PARA 0.
  ===================================================== */

  animacaoScroll.to(
    fragmentosSaida,
    {
      scaleY: 1,

      duration: 0.38,

      stagger: {
        each: 0.035,
        from: "edges",
      },

      ease: "power2.inOut",
    },

    "<"
  );


  /* =====================================================
     TERMINOU OS FRAGMENTOS

     SOME A DOBRA 12 INTEIRA.

     Como a dobra13 já está atrás,
     ela aparece imediatamente.
  ===================================================== */

  animacaoScroll.to(
    secao,
    {
      autoAlpha: 0,

      duration: 0.08,

      ease: "none",
    },

    ">"
  );


  /* =====================================================
     SCROLLTRIGGER
  ===================================================== */

  ScrollTrigger.create({
    trigger: secao,

    start: "top top",

    end: () =>
      "+=" +
      window.innerHeight *
        animacaoScroll.duration(),

    animation: animacaoScroll,

    pin: true,

    scrub: 1.5,

    anticipatePin: 1,

    invalidateOnRefresh: true,
  });
}

// Animação dos textos Seção 13

function iniciarAnimacaoPilares() {
  const dobra13 = document.querySelector(".dobra13");

  if (!dobra13) return;


  const pilares = gsap.timeline({
    scrollTrigger: {
      id: "pilares",

      trigger: dobra13,

      start: "top top",

      end: "+=2000",

      scrub: 2,

      pin: true,

      /*
        IMPORTANTE:

        mantém o espaço necessário enquanto
        Estratégia / Presença / Resultado acontecem.

        A newsletter NÃO consegue subir durante
        essa animação.
      */
      pinSpacing: true,

      /*
        SÓ dispara depois que TODO o timeline
        dos pilares chegou ao final.
      */
      onLeave: () => {
        dobra13.classList.add(
          "dobra13AguardandoNewsletter"
        );
      },

      /*
        Voltando o scroll para dentro dos pilares,
        devolve o controle ao pin original.
      */
      onEnterBack: () => {
        dobra13.classList.remove(
          "dobra13AguardandoNewsletter"
        );
      },
    },
  });


  const textosDobra13 =
    document.querySelectorAll(
      ".dobra13 h2"
    );


  textosDobra13.forEach((pilar) => {
    const split1 = new SplitText(pilar, {
      type: "chars",
    });


    pilares.from(split1.chars, {
      opacity: 0,

      stagger: {
        each: 0.5,
        from: "random",
      },
    });


    pilares.to(
      split1.chars,
      {
        opacity: 0,

        stagger: {
          each: 0.5,
          from: "random",
        },
      },

      "=+2",
    );
  });
}

/* =========================================================
   POPUP SEGURO DOS PROJETOS
========================================================= */

function iniciarPreviewPortfolio() {
  const modal = document.getElementById(
    "portfolioPreviewModal",
  );

  if (!modal) {
    console.warn(
      "O HTML do popup portfolioPreviewModal não foi encontrado.",
    );

    return;
  }

  if (modal.dataset.previewAtivo === "true") {
    return;
  }

  modal.dataset.previewAtivo = "true";

  const dialog = modal.querySelector(
    ".portfolioPreviewDialog",
  );

  const previewWindow = modal.querySelector(
    ".portfolioPreviewWindow",
  );

  const frame = document.getElementById(
    "portfolioPreviewFrame",
  );

  const title = document.getElementById(
    "portfolioPreviewTitle",
  );

  const loading = modal.querySelector(
    ".portfolioPreviewLoading",
  );

  const loadingText = modal.querySelector(
    ".portfolioPreviewLoadingText",
  );

  const deviceButtons = Array.from(
    modal.querySelectorAll("[data-preview-device]"),
  );

  if (
    !dialog ||
    !previewWindow ||
    !frame ||
    !title ||
    !loading
  ) {
    console.warn(
      "A estrutura interna do popup está incompleta.",
    );

    return;
  }

  /*
    Somente estes projetos podem ser solicitados.
  */

  const projetosPermitidos = new Set([
    "mentoria",
    "lumio",
    "nutricao-executiva",
    "trafego-turbo",
  ]);

  let botaoQueAbriu = null;
  let temporizadorFechamento = null;
  let temporizadorCarregamento = null;


  /* =====================================================
     RESOLUÇÕES
  ===================================================== */

  function selecionarDispositivo(dispositivo) {
    const dispositivoSeguro = [
      "desktop",
      "tablet",
      "phone",
    ].includes(dispositivo)
      ? dispositivo
      : "desktop";

    previewWindow.classList.remove(
      "is-desktop",
      "is-tablet",
      "is-phone",
    );

    previewWindow.classList.add(
      `is-${dispositivoSeguro}`,
    );

    deviceButtons.forEach((button) => {
      const ativo =
        button.dataset.previewDevice ===
        dispositivoSeguro;

      button.classList.toggle(
        "is-active",
        ativo,
      );

      button.setAttribute(
        "aria-pressed",
        String(ativo),
      );
    });
  }


  /* =====================================================
     SCROLL DA PÁGINA PRINCIPAL
  ===================================================== */

  function bloquearPagina() {
    document.documentElement.classList.add(
      "portfolio-preview-open",
    );

    document.body.classList.add(
      "portfolio-preview-open",
    );

    if (window.lenis) {
      window.lenis.stop();
    }
  }

  function liberarPagina() {
    document.documentElement.classList.remove(
      "portfolio-preview-open",
    );

    document.body.classList.remove(
      "portfolio-preview-open",
    );

    if (window.lenis) {
      window.lenis.start();
    }
  }


  /* =====================================================
     ABRIR
  ===================================================== */

  function abrirPreview(botao) {
    const projeto =
      botao.dataset.previewProject;

    if (!projetosPermitidos.has(projeto)) {
      console.warn(
        `Projeto não autorizado: ${projeto}`,
      );

      return;
    }

    clearTimeout(temporizadorFechamento);
    clearTimeout(temporizadorCarregamento);

    botaoQueAbriu = botao;

    const tituloProjeto =
      botao.dataset.previewTitle || "Projeto";

    title.textContent = tituloProjeto;

    frame.title =
      `Preview do projeto ${tituloProjeto}`;

    if (loadingText) {
      loadingText.textContent =
        "Carregando projeto...";
    }

    loading.classList.remove("is-hidden");

    /*
      O preview sempre começa em Desktop,
      exatamente com 1280px.
    */

    selecionarDispositivo("desktop");

    modal.hidden = false;

    modal.setAttribute(
      "aria-hidden",
      "false",
    );

    bloquearPagina();

    requestAnimationFrame(() => {
      modal.classList.add("is-open");

      dialog.focus({
        preventScroll: true,
      });

      /*
        O iframe chama o PHP.
        O PHP valida a chave e redireciona o mesmo iframe
        para o site original, sem modificar o HTML.
      */

      frame.src =
        `./preview-content.php?project=${encodeURIComponent(
          projeto,
        )}`;

      temporizadorCarregamento =
        window.setTimeout(() => {
          if (
            !modal.hidden &&
            loadingText
          ) {
            loadingText.textContent =
              "O projeto está demorando para carregar.";
          }
        }, 12000);
    });
  }


  /* =====================================================
     FECHAR
  ===================================================== */

  function fecharPreview() {
    if (modal.hidden) {
      return;
    }

    modal.classList.remove("is-open");

    modal.setAttribute(
      "aria-hidden",
      "true",
    );

    clearTimeout(temporizadorCarregamento);

    liberarPagina();

    temporizadorFechamento =
      window.setTimeout(() => {
        modal.hidden = true;

        frame.src = "about:blank";

        loading.classList.remove("is-hidden");

        if (loadingText) {
          loadingText.textContent =
            "Carregando projeto...";
        }

        selecionarDispositivo("desktop");

        if (botaoQueAbriu) {
          botaoQueAbriu.focus({
            preventScroll: true,
          });
        }

        botaoQueAbriu = null;
      }, 300);
  }


  /* =====================================================
     CLIQUE NOS BOTÕES VER PROJETO
  ===================================================== */

  document.addEventListener(
    "click",
    (event) => {
      const botao = event.target.closest(
        ".projetoBotao[data-preview-project]",
      );

      if (!botao) {
        return;
      }

      /*
        Impede o target="_blank" de abrir outra aba.
        O projeto será aberto dentro do popup.
      */

      event.preventDefault();

      abrirPreview(botao);
    },
  );


  /* =====================================================
     FECHAR PELO X OU PELO FUNDO
  ===================================================== */

  modal.addEventListener(
    "click",
    (event) => {
      const fechar = event.target.closest(
        "[data-preview-close]",
      );

      if (!fechar) {
        return;
      }

      fecharPreview();
    },
  );


  /* =====================================================
     DESKTOP, TABLET E CELULAR
  ===================================================== */

  deviceButtons.forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        selecionarDispositivo(
          button.dataset.previewDevice,
        );
      },
    );
  });


  /* =====================================================
     CARREGAMENTO DO IFRAME
  ===================================================== */

  frame.addEventListener("load", () => {
    if (
      frame.getAttribute("src") ===
      "about:blank"
    ) {
      return;
    }

    clearTimeout(
      temporizadorCarregamento,
    );

    loading.classList.add("is-hidden");
  });


  /* =====================================================
     ESC E FOCO
  ===================================================== */

  modal.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") {
        event.preventDefault();

        fecharPreview();

        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const elementosFocaveis =
        Array.from(
          modal.querySelectorAll(
            [
              "button:not([disabled])",
              "iframe",
              '[tabindex]:not([tabindex="-1"])',
            ].join(","),
          ),
        ).filter(
          (elemento) =>
            elemento.getClientRects().length > 0,
        );

      if (!elementosFocaveis.length) {
        return;
      }

      const primeiroElemento =
        elementosFocaveis[0];

      const ultimoElemento =
        elementosFocaveis[
          elementosFocaveis.length - 1
        ];

      if (
        event.shiftKey &&
        document.activeElement ===
          primeiroElemento
      ) {
        event.preventDefault();

        ultimoElemento.focus();

        return;
      }

      if (
        !event.shiftKey &&
        document.activeElement ===
          ultimoElemento
      ) {
        event.preventDefault();

        primeiroElemento.focus();
      }
    },
  );
}


/* =========================================================
   INICIALIZAÇÃO ÚNICA
========================================================= */

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    iniciarPreviewPortfolio,
  );
} else {
  iniciarPreviewPortfolio();
}


/* =========================================================
   DOBRA 13 → NEWSLETTER

   A NEWSLETTER SOBE SOMENTE DEPOIS
   QUE OS PILARES TERMINARAM.
========================================================= */

function iniciarSobreposicaoNewsletter() {
  const dobra13 =
    document.querySelector(".dobra13");

  const newsletter =
    document.querySelector(".newsletter");


  if (!dobra13 || !newsletter) return;


  const triggerPilares =
    ScrollTrigger.getById("pilares");


  if (!triggerPilares) return;


  /*
    ESTE SCROLLTRIGGER NÃO PINA NADA.

    O objetivo dele é somente detectar
    o percurso da newsletter:

    bottom da tela
          ↓
    até o topo da tela.
  */

  ScrollTrigger.create({
    id: "newsletterSobrePilares",

    trigger: newsletter,

    start: "top bottom",

    end: "top top",

    /*
      Quando a newsletter começa a entrar,
      só permite a sobreposição se o
      ScrollTrigger dos pilares já terminou.
    */
    onEnter: () => {
      if (
        triggerPilares.progress >= 0.999
      ) {
        dobra13.classList.add(
          "dobra13AguardandoNewsletter"
        );
      }
    },


    /*
      Newsletter chegou completamente
      ao topo.

      A dobra13 já foi coberta e
      não precisa continuar fixa.
    */
    onLeave: () => {
      dobra13.classList.remove(
        "dobra13AguardandoNewsletter"
      );
    },


    /*
      Voltando o scroll:
      newsletter começa a descobrir
      novamente a dobra13.
    */
    onEnterBack: () => {
      if (
        triggerPilares.progress >= 0.999
      ) {
        dobra13.classList.add(
          "dobra13AguardandoNewsletter"
        );
      }
    },


    /*
      Voltou completamente para
      a animação dos pilares.
    */
    onLeaveBack: () => {
      dobra13.classList.remove(
        "dobra13AguardandoNewsletter"
      );
    },


    invalidateOnRefresh: true,
  });


  agendarRefreshNoQuadro(true);
}


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
  const charsDaiane = splitFooter.chars.filter((char) => !char.closest("span"));

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
      type: "words,chars",
      wordsClass: "footerCalloutWord",
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

document.addEventListener("DOMContentLoaded", () => {
  const anoAtual = new Date().getFullYear();
  document.getElementById("anoAtual").textContent = `${anoAtual}`;
});

/* =========================================================
   BOTÃO FLUTUANTE DO WHATSAPP
========================================================= */

function iniciarWhatsappFlutuante() {
  const whatsappFloat =
    document.querySelector(".whatsappFloat");

  /*
    A Dobra 02 existente no seu HTML possui
    id="dobra2" e class="dobra02".
  */

  const dobra02 =
    document.querySelector("#dobra2");

  if (!whatsappFloat) {
    return;
  }

  /*
    Caso a Dobra 02 não seja encontrada, o botão
    continua funcionando e aparece após 300px.
  */

  if (
    !dobra02 ||
    typeof ScrollTrigger === "undefined"
  ) {
    function atualizarWhatsappNoScroll() {
      whatsappFloat.classList.toggle(
        "ativo",
        window.scrollY >= 300
      );
    }

    window.addEventListener(
      "scroll",
      atualizarWhatsappNoScroll,
      {
        passive: true
      }
    );

    atualizarWhatsappNoScroll();

    return;
  }

  /*
    Exibe quando a Dobra 02 começa a entrar.
    Esconde novamente ao voltar para a Hero.
  */

  ScrollTrigger.create({
    id: "whatsapp-flutuante",

    trigger: dobra02,

    start: "top 70%",

    onEnter: () => {
      whatsappFloat.classList.add("ativo");
    },

    onEnterBack: () => {
      whatsappFloat.classList.add("ativo");
    },

    onLeaveBack: () => {
      whatsappFloat.classList.remove("ativo");
    },

    invalidateOnRefresh: true
  });
}


(() => {
  if (!document.querySelector("main .hero")) return;

  let larguraAnterior = window.innerWidth;

  let timeout;

  window.addEventListener("resize", () => {
    clearTimeout(timeout);

    timeout = setTimeout(
      () => {
        const larguraAtual = window.innerWidth;

        const diferenca = Math.abs(larguraAtual - larguraAnterior);

        if (diferenca >= 100) {
          window.scrollTo(0, 0);

          window.location.reload();

          return;
        }

        larguraAnterior = larguraAtual;
      },

      300,
    );
  });
})();

function iniciarBuscaDigitada() {
  const alvo = document.querySelector("#dobra2 .search-typed");
  if (!alvo || alvo.dataset.typerInit === "true") return;
  const frase = alvo.dataset.typer;
  const saida = alvo.querySelector(".search-text");
  if (!saida || !frase) return;
  alvo.dataset.typerInit = "true";
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    saida.textContent = frase;
    return;
  }
  const letras = typeof Intl !== "undefined" && Intl.Segmenter
    ? [...new Intl.Segmenter("pt-BR", { granularity: "grapheme" }).segment(frase)].map(s => s.segment)
    : [...frase];
  let i = 0, apagando = false, visivel = true;
  const passo = () => {
    if (!visivel) {
      setTimeout(passo, 400);
      return;
    }
    saida.textContent = letras.slice(0, i).join("");
    let espera = apagando ? 38 : 68 + Math.random() * 55;
    if (!apagando && i === letras.length) {
      apagando = true;
      espera = 2100;
    } else if (apagando && i === 0) {
      apagando = false;
      espera = 620;
    } else {
      i += apagando ? -1 : 1;
    }
    setTimeout(passo, espera);
  };
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(entradas => entradas.forEach(entrada => {
      visivel = entrada.isIntersecting;
    }), { rootMargin: "120px" }).observe(alvo);
  }
  passo();
}

function iniciarAnimacaoDobra03() {
  const secao = document.querySelector("#dobra3");
  if (!secao || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (secao.dataset.presencaInit === "true") return;
  secao.dataset.presencaInit = "true";

  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
    const elementos = secao.querySelectorAll(
      ".presencaAberturaTitulo, .presencaPergunta, .presencaMensagem, " +
      ".presencaDescricao, .presencaLegenda, .presencaDigitalPilares li",
    );
    const textos = secao.querySelector(".presencaDigital .presencaDigitalTextos");
    const entradas = Array.from(elementos, elemento => [
      elemento,
      textos?.contains(elemento)
        ? { y: 30, trigger: textos, start: "top bottom+=48px" }
        : { y: 30 },
    ]);
    animarEntradasDirecionais(entradas);
  });
}

function iniciarTextosDobra04() {
  const secao = document.querySelector(".dobra04");
  if (!secao || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || typeof SplitText === "undefined") return;
  if (secao.dataset.textosInit === "true" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  secao.dataset.textosInit = "true";
  const preparar = () => {
    secao.querySelectorAll(".slider").forEach(painel => {
      painel.querySelectorAll(":scope > span, :scope > h2, .textoIcon p").forEach(elemento => {
        const titulo = elemento.tagName === "H2";
        SplitText.create(elemento, {
          type: titulo ? "chars,words,lines" : "lines,words",
          mask: "lines",
          autoSplit: true,
          aria: titulo ? "auto" : "none",
          onSplit(divisao) {
            return gsap.from(titulo ? divisao.chars : divisao.words, {
              yPercent: 110,
              autoAlpha: 0,
              duration: .7,
              stagger: titulo ? .035 : .045,
              ease: "power2.out",
              scrollTrigger: {
                trigger: painel,
                start: "top 85%",
                end: "top 15%",
                scrub: .35,
                invalidateOnRefresh: true,
              },
            });
          },
        });
      });
    });
  };
  agendarRefreshAposFontes(preparar);
}

function iniciarTextosDobraExtra() {
  const secao = document.querySelector("#dobra-extra");
  if (!secao || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (secao.dataset.textosInit === "true") return;
  secao.dataset.textosInit = "true";

  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
    animarEntradasDirecionais([
      [secao.querySelector(".presencaDigitalTextos > div"), { y: 30 }],
      [secao.querySelector(".presencaDigitalTextos > p"), { y: 30 }],
    ]);
  });
}

function iniciarTextosDobra06() {
  const secao = document.querySelector(".dobra06");
  if (!secao || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (secao.dataset.textosInit === "true" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  secao.dataset.textosInit = "true";
  const preparar = () => {
    // Modelo heroTimeline de Copy motion: blocos legíveis em uma sequência única.
    const timeline = gsap.timeline({ paused: true, defaults: { duration: .75, ease: "power3.out" } });
    timeline
      .fromTo(secao.querySelector(".presencaValor > span"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0)
      .fromTo(secao.querySelector("h2"), { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, .12)
      .fromTo(secao.querySelector(".textValor"), { y: 34, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, .35)
      .fromTo(secao.querySelector(".linhavalor02"), { scaleX: .35, transformOrigin: "left center" }, { scaleX: 1 }, .35)
      .fromTo(secao.querySelector(".presencaImagem"), { x: 60, autoAlpha: 0, scale: .94 }, { x: 0, autoAlpha: 1, scale: 1 }, .25)
      .to({}, { duration: .25 });
    ScrollTrigger.create({
      id: "dobra06",
      trigger: secao,
      start: "top top",
      end: "+=120%",
      animation: timeline,
      pin: true,
      pinSpacing: true,
      scrub: .5,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });
    agendarRefreshNoQuadro(true);
  };
  preparar();
}

function iniciarIndicadoresScroll() {
  if (typeof ScrollTrigger === "undefined") return;
  const indicadores = [...document.querySelectorAll(".continueRolando")].map(elemento => ({
    elemento,
    secao: elemento.closest(".slider, section"),
    trigger: null,
  }));
  if (!indicadores.length) return;
  let quadro = 0;
  function atualizar() {
    quadro = 0;
    indicadores.forEach(item => {
      if (!item.trigger) return;
      const progresso = item.trigger.progress;
      let limite = item.secao.classList.contains("dobra07") ? .82 : .97;
      if (item.secao.classList.contains("servicosCarrossel")) limite = .85;
      if (item.secao.classList.contains("percepcao")) limite = .44;
      if (item.secao.classList.contains("slider")) {
        // O painel seguinte começa a cobrir o atual antes de o pin terminar.
        const distancia = item.trigger.end - item.trigger.start;
        limite = Math.max(.1, 1 - window.innerHeight / distancia);
      }
      let visivel = !!item.trigger.isActive && progresso < limite;
      if (visivel) {
        // Também evita sobreposição enquanto os cards estão em movimento.
        const area = item.elemento.getBoundingClientRect();
        const conteudos = item.secao.querySelectorAll(".siteImpactoCard, .textoIcon, .ctaDobra04, .servicos-carrossel-titulo, .cardsCarrossel, .actions, .presencaValor, .presencaImagem, .classpresenca-beneficios, .valorTitulo, .textValor, .visual-card, .percepcaoTopo, .percepcaoBottom, .projetosDestaqueTitulo, .projetosDestaqueCorpo");
        visivel = ![...conteudos].some(conteudo => {
          if (Number(getComputedStyle(conteudo).opacity) < .05) return false;
          const caixa = conteudo.getBoundingClientRect();
          return caixa.right > area.left - 8 && caixa.left < area.right + 8 && caixa.bottom > area.top - 8 && caixa.top < area.bottom + 8;
        });
      }
      item.elemento.classList.toggle("ativo", visivel);
      item.elemento.style.setProperty("--progresso-scroll", Math.min(1, progresso / limite).toFixed(4));
    });
  }
  function agendar() {
    if (!quadro) quadro = requestAnimationFrame(atualizar);
  }
  function encontrarTriggers() {
    const triggers = ScrollTrigger.getAll();
    indicadores.forEach(item => {
      item.trigger = triggers.find(trigger => trigger.trigger === item.secao && trigger.vars.pin);
    });
    atualizar();
  }
  if (typeof gsap !== "undefined") gsap.ticker.add(atualizar);
  else window.addEventListener("scroll", agendar, { passive: true });
  ScrollTrigger.addEventListener("refresh", encontrarTriggers);
  window.addEventListener("load", encontrarTriggers, { once: true });
  requestAnimationFrame(encontrarTriggers);
}


function animarEntradasDirecionais(entradas) {
  entradas.forEach(([elemento, { delay = 0, trigger = elemento, start, ...movimento }]) => {
    gsap.fromTo(elemento, {
      ...movimento,
      autoAlpha: 0,
      filter: "blur(10px)"
    }, {
      x: 0,
      y: 0,
      autoAlpha: 1,
      filter: "blur(0px)",
      delay,
      duration: .8,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger,
        start: start ?? (() => "top " + Math.min(window.innerHeight, window.innerHeight * .5 + 320) + "px"),
        toggleActions: "play none none reverse"
      }
    });
  });
}

function iniciarOportunidadesPerdidas() {
  const secao = document.querySelector("#oportunidades-perdidas");
  if (!secao || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  const arte = secao.querySelector(".oportunidadesArte");
  const icones = [...secao.querySelectorAll(".oportunidadesIcone")];
  const etapas = [...secao.querySelectorAll(".oportunidadesEtapa")];
  const fio = secao.querySelector(".oportunidadesLinha");
  const media = gsap.matchMedia();
  const medir = () => {
    const base = window.matchMedia("(max-width: 767px)").matches ? 470 : 840;
    arte.style.setProperty("--escala-oportunidades", (arte.clientWidth / base).toFixed(6));
  };
  medir();
  const linkServicos = secao.querySelector(".oportunidadesBotao");
  linkServicos.addEventListener("click", evento => {
    if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
    const destino = document.querySelector(linkServicos.getAttribute("href"));
    if (!destino) return;
    evento.preventDefault();
    const pinServicos = ScrollTrigger.getAll().find(item => item.trigger === destino && item.vars.pin);
    const posicao = pinServicos ? pinServicos.start : destino.getBoundingClientRect().top + window.scrollY;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (window.lenis) window.lenis.scrollTo(posicao, { duration: reduzir ? 0 : 1.4, immediate: reduzir });
    else window.scrollTo({ top: posicao, behavior: reduzir ? "instant" : "smooth" });
    history.replaceState(null, "", linkServicos.getAttribute("href"));
  });

  const observador = new ResizeObserver(medir);
  observador.observe(arte);

  media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
    gsap.fromTo(secao.querySelector(".bg-abertura"),
      { clipPath: "circle(0% at 50% 50%)" },
      {
        clipPath: "circle(100% at 50% 50%)",
        ease: "none",
        scrollTrigger: {
          trigger: secao,
          start: "top 75%",
          end: "bottom bottom",
          scrub: 2,
          invalidateOnRefresh: true,
        },
      },
    );
  });

  media.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
    gsap.fromTo(secao.querySelector(".bg-abertura"),
      { clipPath: "circle(0% at 50% 50%)" },
      {
        clipPath: "circle(100% at 50% 50%)",
        duration: .35,
        ease: "power2.out",
        scrollTrigger: {
          trigger: secao,
          start: "top bottom",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      },
    );
  });

  media.add("(prefers-reduced-motion: no-preference)", () => {
    const texto = secao.querySelector(".oportunidadesTexto");
    animarEntradasDirecionais([
      [texto.querySelector(".oportunidadesLegenda"), { y: 30 }],
      [texto.querySelector("h2"), { y: 30 }],
      [texto.querySelector(".oportunidadesDescricao"), { y: 30 }],
      [linkServicos, { y: 30, delay: .2 }],
    ]);
  });

  // Mateusweb / jornada(): camadas compactadas, expansão de 26% e legendas sequenciais.
  media.add({ desktop: "(min-width: 1100px)", compacto: "(max-width: 1099px)", celular: "(max-width: 767px)", calmo: "(prefers-reduced-motion: reduce)" }, contexto => {
    medir();
    if (contexto.conditions.calmo) return;
    const celular = contexto.conditions.celular;
    const vao = celular ? 180 : 252.945;
    const abre = vao * .26;
    const base = celular ? 470 : 840;
    const deslocamentoLegenda = () => abre * arte.clientWidth / base;
    const timeline = gsap.timeline({ defaults: { ease: "none" } });
    timeline
      .fromTo(icones[0], { y: vao }, { y: -abre, duration: 1 }, 0)
      .fromTo(icones[2], { y: -vao }, { y: abre, duration: 1 }, 0)
      .fromTo(etapas[0], { y: 0 }, { y: () => -deslocamentoLegenda(), duration: 1 }, 0)
      .fromTo(etapas[2], { y: 0 }, { y: deslocamentoLegenda, duration: 1 }, 0)
      .fromTo(fio, { opacity: 0 }, { opacity: 1, duration: .5 }, .35);
    etapas.forEach((etapa, indice) => {
      timeline.fromTo(etapa, { opacity: .12 }, { opacity: 1, duration: .3 }, .25 + (indice + 1) * .28);
    });
    ScrollTrigger.create({
      trigger: contexto.conditions.desktop ? secao : arte,
      start: contexto.conditions.desktop ? () => "top top+=" + parseFloat(getComputedStyle(secao).marginTop) : "top 82%",
      end: contexto.conditions.desktop ? "+=85%" : "center 42%",
      pin: !!contexto.conditions.desktop,
      scrub: .6,
      animation: timeline,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: medir,
    });
  });
  agendarRefreshAposFontes();
}


function iniciarProtocoloCriacao() {
  const secao = document.querySelector("#protocolo-criacao");
  if (!secao || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  const etapas = [...secao.querySelectorAll(".protocoloEtapa")];
  const trilho = secao.querySelector(".protocoloLinhaTempo");
  const janela = secao.querySelector(".protocoloJanela");
  const progresso = secao.querySelector(".protocoloProgresso");
  const contagem = secao.querySelector(".protocoloContagem b");
  const media = gsap.matchMedia();
  function marcarFase(indice) {
    etapas.forEach((etapa, i) => {
      etapa.classList.toggle("ativo", i === indice);
      etapa.classList.toggle("concluida", i < indice);
      if (i === indice) etapa.setAttribute("aria-current", "step");
      else etapa.removeAttribute("aria-current");
    });
    contagem.textContent = String(indice + 1).padStart(2, "0");
  }
  marcarFase(0);
  media.add({ compacto: "(max-width: 900px)", desktop: "(min-width: 901px)", calmo: "(prefers-reduced-motion: reduce)" }, contexto => {
    const compacto = contexto.conditions.compacto;
    if (contexto.conditions.calmo) {
      gsap.set(progresso, { scaleX: 1 });
      etapas.forEach(etapa => etapa.classList.add("concluida"));
      return;
    }
    const cabecalho = secao.querySelectorAll(".protocoloLegenda, h2, .protocoloDescricao");
    gsap.fromTo(cabecalho, { y: 32, autoAlpha: 0 }, {
      y: 0, autoAlpha: 1, duration: .95, stagger: .12, ease: "power3.out",
      scrollTrigger: { trigger: secao.querySelector(".protocoloCabecalho"), start: "top 88%", toggleActions: "play none none reset" },
    });
    const partesPrimeira = etapas[0].querySelectorAll(".protocoloMarca, .protocoloDetalhes");
    gsap.fromTo(partesPrimeira, { y: 24, autoAlpha: 0 }, {
      y: 0, autoAlpha: 1, duration: .7, stagger: .1, ease: "power3.out",
      scrollTrigger: { trigger: janela, start: "top 90%", toggleActions: "play none none reset" },
    });
    gsap.set(etapas.slice(1), { autoAlpha: 0 });
    gsap.set(progresso, { scaleX: 0, transformOrigin: "left center" });
    const larguraFase = () => etapas[0].getBoundingClientRect().width;
    const centralizar = () => (janela.clientWidth - larguraFase()) / 2;
    const intervalo = compacto ? 1.05 : .72;
    const timeline = gsap.timeline({ defaults: { ease: "none" } });
    if (compacto) timeline.set(trilho, { x: centralizar }, 0);
    etapas.slice(1).forEach((etapa, i) => {
      const indice = i + 1;
      const inicio = indice * intervalo;
      if (compacto) {
        timeline.fromTo(trilho,
          { x: () => centralizar() - larguraFase() * (indice - 1) },
          { x: () => centralizar() - larguraFase() * indice, duration: .38, ease: "power2.inOut", immediateRender: false }, inicio - .38,
        );
      }
      timeline
        .to(progresso, { scaleX: indice / (etapas.length - 1), duration: .56 }, inicio - .4)
        .set(etapa, { autoAlpha: 1 }, inicio - (compacto ? .52 : .12))
        .fromTo(etapa.querySelector(".protocoloMarca"),
          { y: 16, scale: .82, autoAlpha: 0 },
          { y: 0, scale: 1, autoAlpha: 1, duration: .42, ease: "back.out(1.5)" }, inicio - (compacto ? .52 : .12),
        )
        .fromTo(etapa.querySelector(".protocoloDetalhes"),
          { y: compacto ? 28 : (indice % 2 ? 28 : -28), autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: .48, ease: "power3.out" }, inicio - (compacto ? .42 : 0),
        );
    });
    timeline.to({}, { duration: .4 });
    timeline.eventCallback("onUpdate", () => {
      const indice = Math.min(etapas.length - 1, Math.floor((timeline.time() + .04) / intervalo));
      marcarFase(indice);
      secao.style.setProperty("--progresso-protocolo", timeline.progress().toFixed(4));
    });
    ScrollTrigger.create({
      id: "protocolo-criacao",
      trigger: secao,
      start: () => secao.offsetHeight > window.innerHeight ? "bottom bottom" : "top top",
      end: () => "+=" + Math.max(window.innerHeight * (compacto ? 3.2 : 2.8), 1900),
      pin: true,
      scrub: .65,
      animation: timeline,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });
  });
  agendarRefreshAposFontes();
}


function iniciarContatoScroll() {
  const secao = document.querySelector(".contato");
  if (!secao || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  const coluna = secao.querySelector(".contatoDireito");
  const perguntas = secao.querySelector(".faq");
  const media = gsap.matchMedia();
  media.add("(min-width: 1024px)", () => {
    // Prende só a coluna; o FAQ continua rolando normalmente ao lado.
    ScrollTrigger.create({
      id: "contato-coluna",
      trigger: coluna,
      start: "top 112px",
      endTrigger: perguntas,
      end: () => "bottom " + (112 + coluna.offsetHeight) + "px",
      pin: coluna,
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });
  });
  agendarRefreshAposFontes();
}

// Sobre mim: entradas próprias para cada bloco; a foto e a composição ficam intactas.
function iniciarAnimacoesSobre() {
  const secao = document.querySelector("#sobre-daiane");
  if (!secao) return;
  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
    const titulo = SplitText.create(secao.querySelector("h2"), {
      type: "words,chars", autoSplit: true,
      onSplit(divisao) {
        return gsap.from(divisao.chars, {
          x: -65, autoAlpha: 0, duration: .7, stagger: .035, ease: "power3.out",
          scrollTrigger: { trigger: secao.querySelector("h2"), start: "top 88%", toggleActions: "play none none reset" },
        });
      },
    });
    gsap.from(secao.querySelectorAll(".sobreParte h3, .sobreParte > p > span"), {
      y: 30, filter: "blur(7px)", autoAlpha: 0, duration: .9, stagger: .16, ease: "power3.out",
      scrollTrigger: { trigger: secao.querySelector(".sobreParte"), start: "top 85%", toggleActions: "play none none reset" },
    });
    gsap.from(secao.querySelector(".textSeta"), {
      clipPath: "inset(0 100% 0 0)", duration: 1.2, ease: "power3.inOut",
      scrollTrigger: { trigger: secao.querySelector(".textSeta"), start: "top 87%", toggleActions: "play none none reset" },
    });
    gsap.from(secao.querySelector(".citacao"), {
      x: 48, autoAlpha: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: secao.querySelector(".citacao"), start: "top 87%", toggleActions: "play none none reset" },
    });
    gsap.from(secao.querySelector(".lineSobre"), {
      scaleX: 0, transformOrigin: "left center", duration: 1, ease: "power3.inOut",
      scrollTrigger: { trigger: secao.querySelector(".lineSobre"), start: "top 89%", toggleActions: "play none none reset" },
    });
    const historia = [...secao.querySelectorAll(".maisSobre > span")].map(elemento => SplitText.create(elemento, {
      type: "words", autoSplit: true,
      aria: "none",
      onSplit(divisao) {
        return gsap.from(divisao.words, {
          x: 18, autoAlpha: 0, filter: "blur(8px)", duration: .75, stagger: { amount: .65 }, ease: "power2.out",
          scrollTrigger: { trigger: elemento, start: "top 90%", toggleActions: "play none none reset" },
        });
      },
    }));
    gsap.from(secao.querySelector(".sobreBottom"), {
      clipPath: "inset(0 100% 0 0 round 32px)", duration: 1.1, ease: "power3.inOut",
      scrollTrigger: { trigger: secao.querySelector(".sobreBottom"), start: "top 91%", toggleActions: "play none none reset" },
    });
    return () => [titulo, ...historia].forEach(divisao => divisao.revert());
  });
}

function iniciarTextosNewsletter() {
  const secao = document.querySelector(".newsletter");
  if (!secao) return;
  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(secao.querySelectorAll(".analisenewsletter > span, .analisenewsletter h2, .analisenewsletter > p"), {
      y: 35, autoAlpha: 0, filter: "blur(8px)", duration: .9, stagger: .16, ease: "power3.out",
      scrollTrigger: { trigger: secao.querySelector(".borderBG"), start: "top 82%", toggleActions: "play none none reset" },
    });
    gsap.from(secao.querySelectorAll(".campoAnalise"), {
      y: 24, autoAlpha: 0, duration: .7, stagger: .12, ease: "power3.out",
      scrollTrigger: { trigger: secao.querySelector(".camposAnalise"), start: "top 92%", toggleActions: "play none none reset" },
    });
  });
}

function animarRedesFooter() {
  const grupo = document.querySelector("footer .iconesFooter");
  if (!grupo) return;
  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
    const entradas = [...grupo.querySelectorAll(".redeSocialEntrada")];
    gsap.from(entradas, {
      x: indice => indice < 2 ? -85 : 85,
      y: 48,
      rotation: indice => indice < 2 ? -28 : 28,
      rotationY: indice => indice < 2 ? -100 : 100,
      transformPerspective: 700,
      scale: .35,
      autoAlpha: 0,
      duration: 1.15,
      stagger: { each: .12, from: "center" },
      ease: "back.out(1.6)",
      scrollTrigger: { trigger: grupo, start: "top 88%", toggleActions: "play none none reset" },
    });
    gsap.from(grupo.querySelector(":scope > img"), {
      scale: .75, autoAlpha: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: grupo, start: "top 88%", toggleActions: "play none none reset" },
    });
  });
}

function iniciarCarrosselVendas() {
  const carrossel = document.querySelector(".vendasCarrossel");
  if (!carrossel) return;

  const cards = [...carrossel.querySelectorAll(".vendasCarrosselCard")];
  const controles = carrossel.querySelector(".vendasCarrosselControles");
  const status = carrossel.querySelector(".vendasCarrosselStatus");
  let ativo = 2;

  function atualizar() {
    cards.forEach((card, indice) => {
      let posicao = (indice - ativo + cards.length) % cards.length;
      if (posicao > cards.length / 2) posicao -= cards.length;

      card.dataset.posicao = String(posicao);
      card.style.setProperty("--card-x", posicao * 86 + "%");
      card.style.setProperty("--card-y", posicao === 0 ? "-32px" : posicao % 2 ? "12px" : "-6px");
      card.style.setProperty("--card-rotacao", posicao === 0 ? "0deg" : posicao % 2 ? "2.5deg" : "-2.5deg");
      card.style.zIndex = String(cards.length - Math.abs(posicao));
      card.setAttribute("aria-hidden", String(posicao < -2 || posicao > 1));
      if (posicao === 0) card.setAttribute("aria-current", "true");
      else card.removeAttribute("aria-current");
    });
    status.textContent = (ativo + 1) + " de " + cards.length + " · " + cards[ativo].querySelector("h4").textContent;
  }

  function navegar(direcao) {
    ativo = (ativo + direcao + cards.length) % cards.length;
    atualizar();
  }

  controles.querySelectorAll("button").forEach(botao => {
    botao.addEventListener("click", () => navegar(Number(botao.dataset.direcao)));
  });
  carrossel.addEventListener("keydown", evento => {
    if (evento.key !== "ArrowLeft" && evento.key !== "ArrowRight") return;
    evento.preventDefault();
    navegar(evento.key === "ArrowLeft" ? -1 : 1);
  });

  atualizar();
  carrossel.classList.add("vendasCarrosselAtivo");
  controles.hidden = false;
}

function iniciarVendasBeneficios() {
  const abertura = document.querySelector("#mais-vendas");
  if (!abertura) return;
  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
    // Entrada direcional da abertura de vendas, com retorno ao rolar para cima.
    const entradas = [
      [abertura.querySelector(".vendasLegenda"), { y: -30 }],
      [abertura.querySelector("#vendas-titulo"), { x: -30 }],
      [abertura.querySelector(".vendasAbertura"), { y: 30 }],
      [abertura.querySelector(".vendasApoio > p"), { x: -30 }],
      [abertura.querySelector(".vendasVirada"), { x: 30 }],
      ...Array.from(abertura.querySelectorAll(".vendasDestaque"), (card, indice) =>
        [card, { y: 30, delay: (indice + 1) * .2 }])
    ];

    animarEntradasDirecionais(entradas);
    const estrategia = document.querySelector(".vendasFechamento");
    if (estrategia) {
      const elementos = estrategia.querySelectorAll(
        ".vendasEstrategia .vendasLegenda, .vendasEstrategia h2, " +
        ".vendasEstrategiaDescricao, .vendasEstrategiaTags li, " +
        ".vendasEstrategiaMensagem, .vendasEstrategiaDivisor",
      );
      animarEntradasDirecionais(Array.from(elementos, elemento => [elemento, { y: 30 }]));
    }
    const proposito = document.querySelector(".vendasProposito");
    if (proposito) {
      const elementos = proposito.querySelectorAll(
        ".vendasPropositoTitulo > span, .vendasPropositoIntroducao > p, " +
        ".vendasPropositoPontos > li, .vendasPropositoRota h3, .vendasPropositoRota p, " +
        ".vendasPropositoRota > img, .vendasCarrosselLista",
      );
      animarEntradasDirecionais(Array.from(elementos, elemento => [elemento, { y: 30 }]));
    }
    gsap.from(document.querySelector(".vendasFechamento .vendasConvite"), { clipPath: "inset(0 0 0 100% round 24px)", duration: 1.1, ease: "power3.inOut", scrollTrigger: { trigger: ".vendasConvite", start: "top 78%", toggleActions: "play none none reset" } });

  });
}

function iniciarScrollbarPersonalizada() {
  const barra = document.querySelector(".custom-scrollbar");
  const indicador = barra?.querySelector(".custom-scroll-thumb");
  if (!indicador) return;

  const raiz = document.documentElement;
  const safari = /Safari/i.test(navigator.userAgent) &&
    !/(Chrome|Chromium|CriOS|Edg|OPR|Android)/i.test(navigator.userAgent) &&
    /Apple/i.test(navigator.vendor);
  raiz.classList.toggle("safari-only", safari);
  if (safari) return;

  const desktop = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)");
  let quadro = 0;
  let arraste = null;

  function alcance() {
    return Math.max(0, raiz.scrollHeight - raiz.clientHeight);
  }

  function atualizar() {
    quadro = 0;
    const maximo = alcance();
    const ativa = desktop.matches && maximo > 0;
    barra.hidden = !ativa;
    raiz.classList.toggle("scrollbar-personalizada", ativa);
    if (!ativa) return;

    const proporcao = Math.max(0, Math.min(1, window.scrollY / maximo));
    const trilho = barra.clientHeight - indicador.offsetHeight;
    indicador.style.transform = "translateY(" + (trilho * proporcao) + "px)";
    indicador.setAttribute("aria-valuenow", String(Math.round(proporcao * 100)));
  }

  function agendar() {
    if (!quadro) quadro = window.requestAnimationFrame(atualizar);
  }

  function rolar(posicao) {
    const top = Math.max(0, Math.min(alcance(), posicao));
    if (window.lenis) window.lenis.scrollTo(top, { immediate: true, force: true });
    else window.scrollTo({ top, behavior: "instant" });
    agendar();
  }

  indicador.addEventListener("pointerdown", evento => {
    if (evento.button !== 0) return;
    const trilho = barra.clientHeight - indicador.offsetHeight;
    if (trilho <= 0) return;
    indicador.focus({ preventScroll: true });
    indicador.setPointerCapture(evento.pointerId);
    arraste = { id: evento.pointerId, y: evento.clientY, scroll: window.scrollY, trilho };
    evento.preventDefault();
  });

  indicador.addEventListener("pointermove", evento => {
    if (!arraste || arraste.id !== evento.pointerId) return;
    const deslocamento = (evento.clientY - arraste.y) / arraste.trilho;
    rolar(arraste.scroll + deslocamento * alcance());
  });

  indicador.addEventListener("lostpointercapture", () => { arraste = null; });

  indicador.addEventListener("keydown", evento => {
    const destinos = {
      ArrowUp: window.scrollY - 48,
      ArrowDown: window.scrollY + 48,
      PageUp: window.scrollY - window.innerHeight,
      PageDown: window.scrollY + window.innerHeight,
      Home: 0,
      End: alcance(),
    };
    if (!Object.hasOwn(destinos, evento.key)) return;
    evento.preventDefault();
    rolar(destinos[evento.key]);
  });

  window.addEventListener("scroll", agendar, { passive: true });
  window.addEventListener("resize", agendar, { passive: true });
  desktop.addEventListener("change", agendar);
  ScrollTrigger.addEventListener("refresh", agendar);
  new ResizeObserver(agendar).observe(document.body);
  atualizar();
}
