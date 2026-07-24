<!doctype html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title><?= $title ?? 'Site' ?></title>
  <meta name="description" content="<?= $description ?? '' ?>">

  <!-- Open Graph -->
  <meta property="og:title" content="<?= $title ?? '' ?>">
  <meta property="og:description" content="<?= $description ?? '' ?>">
  <meta property="og:image" content="<?= $image ?? '' ?>">

  <?php
  $robots = $robots ?? 'index, follow';
  ?>
  <meta name="robots" content="<?= htmlspecialchars($robots, ENT_QUOTES, 'UTF-8') ?>">

  <!-- Preload das fontes usadas na primeira tela -->
  <link
    rel="preload"
    href="/assets/fonts/RobotoSerif-Regular.woff2"
    as="font"
    type="font/woff2"
    crossorigin>

  <link
    rel="preload"
    href="/assets/fonts/RobotoSerif-Bold.woff2"
    as="font"
    type="font/woff2"
    crossorigin>

  <link
    rel="preload"
    href="/assets/fonts/Satisfy-Regular.woff2"
    as="font"
    type="font/woff2"
    crossorigin>

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --gradient-primary: linear-gradient(96deg,
          #ef6500 2.72%,
          #f0ac79 34.85%,
          #f0ac79 66.58%,
          #ef6500 98.77%);

      --gradient-light: linear-gradient(91deg,
          #f8b88a 1.11%,
          #fbfaff 48.64%,
          #f8b88a 97.09%);

      --color-dark: #000;
      --color-text: #fffefd;
      --color-accent: #ef6500;
    }

    @font-face {
      font-family: "Roboto Serif";
      src: url("/assets/fonts/RobotoSerif-Regular.woff2") format("woff2");
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: "Roboto Serif";
      src: url("/assets/fonts/RobotoSerif-Bold.woff2") format("woff2");
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: "Satisfy";
      src: url("/assets/fonts/Satisfy-Regular.woff2") format("woff2");
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }

    html,
    body {
      overflow-x: hidden;
    }

    body {
      font-family: "Roboto Serif", serif;
      background-color: var(--color-dark);
      color: var(--color-text);
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    /* Header inicial */

    header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 900;

      display: flex;
      align-items: center;
      justify-content: space-between;

      width: 100%;
      padding: 24px 4vw;
    }

    .logo {
      width: 44.93px;
      height: auto;
    }

    .icone {
      width: 40px;
      height: auto;
    }

    .headerMobile {
      display: none !important;
    }

    .headerDesktop .principal {
      display: flex;
      align-items: center;
      gap: 12px;

      padding: 5px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.25);
    }

    .headerDesktop .principal ul {
      display: flex;
      align-items: center;
      gap: 4px;

      margin: 0;
      padding: 0;
      list-style: none;
    }

    .headerDesktop .principal a {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 8px;

      min-height: 42px;
      padding: 8px 14px;
      border-radius: 7px;

      color: rgba(255, 255, 255, 0.4);
      font-size: 14px;
      line-height: 150%;
    }

    .headerDesktop .principal a img {
      width: 16px;
      height: 16px;
      object-fit: contain;
      margin-bottom: 3px;
    }

    .headerDesktop .principal li.ativo a,
    .headerDesktop .principal a.ativo {
      color: #000;
      background: #ef6500;
      font-weight: 700;
    }

    /* Hero */

    .transicao {
      position: relative;
      overflow: hidden;
      width: 100%;
      height: 100vh;
    }

    .hero {
      position: absolute;
      inset: 0;
      z-index: 2;

      display: flex;
      flex-direction: column;
      justify-content: center;

      width: 100%;
      min-height: 100%;
      padding: 104px 4vw;

      background-image: url("/assets/imagens/bghero-webdesign.webp");
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }

    .conteudo {
      display: flex;
      width: 850px;
      flex-direction: column;
      align-items: flex-start;
      gap: 40px;
    }

    .texto {
      display: flex;
      width: 840px;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .webDesigner {
      display: flex;
      width: 300px;
      align-items: center;
      gap: 8px;
    }

    .webDesigner p {
      color: rgba(255, 255, 255, 0.4);
      font-size: 14px;
      font-weight: 400;
      line-height: 150%;
      letter-spacing: 4px;
    }

    .webDesigner img {
      margin-bottom: 2px;
    }

    .hero h1 {
      position: relative;
      width: 840px;

      color: var(--color-text);
      font-size: 80px;
      font-weight: 700;
      line-height: 110%;
      letter-spacing: -1px;
    }

    .hero h1 span {
      display: block;
    }

    .hero h1::after {
      content: "•••";
      position: absolute;
      top: 40px;
      right: 290px;

      color: #ef6500;
      font-size: 2.9rem;
      line-height: 1;
      letter-spacing: 8px;
    }

    .paragrafo {
      width: 780px;
      color: rgba(255, 255, 255, 0.4);
      font-size: 16px;
      font-weight: 400;
      line-height: 150%;
      letter-spacing: 1px;
    }

    .botoes {
      display: flex;
      width: 600px;
      align-items: flex-start;
      gap: 24px;
    }

    .cta {
      position: relative;
      overflow: hidden;

      display: inline-flex;
      align-items: center;
      gap: 18px;

      height: 56px;
      padding: 0 28px;
      border-radius: 100px;

      color: var(--color-text);
      font-size: 16px;
      font-weight: 700;
      line-height: 150%;
      letter-spacing: 2.56px;
    }

    .cta .circle-bg {
      position: absolute;
      top: 50%;
      left: 0;
      z-index: 0;

      width: 90px;
      height: 56px;
      border-radius: 50%;

      background: var(--color-accent);
      transform: translateY(-50%);
    }

    .cta .cta-icon,
    .cta .text {
      position: relative;
      z-index: 2;
    }

    .cta .cta-icon {
      width: 18px;
      height: 18px;
    }

    .portfolioButton {
      display: flex;
      justify-content: space-between;
      align-items: center;

      width: 212.468px;
      height: 56px;
      padding: 12px 48px;
      border-radius: 10px;

      color: rgba(255, 255, 255, 0.25);
      font-family: "Satisfy", cursive;
      font-size: 18px;
      line-height: 150%;

      box-shadow: 0 0 8px rgba(255, 255, 255, 0.25) inset;
      backdrop-filter: blur(3px);
    }

    /* =========================================
   PRELOADER — ESTADO INICIAL
========================================= */

    #preloader {
      position: fixed;
      inset: 0;
      z-index: 99999;

      display: flex;
      align-items: center;
      justify-content: center;

      width: 100%;
      height: 100%;

      background: #000;
    }

    .preloader-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      background: #000;
    }

    .preloader-logo {
      position: absolute;
      top: 50%;
      left: 50%;

      width: 80px;
      height: 82px;

      transform: translate(-50%, -50%);
    }

    .preloader-logo svg {
      position: absolute;
      inset: 0;

      display: block;
      width: 100%;
      height: 100%;
    }

    .preloader-logo-empty path {
      fill: rgba(255, 254, 253, 0.15);
    }

    .preloader-logo-fill {
      clip-path: inset(100% 0 0 0);
    }

    .preloader-percent {
      position: absolute;
      top: calc(50% + 56px);
      left: 50%;
      z-index: 2;

      color: rgba(255, 255, 255, 0.9);

      font-family: "Roboto Serif", serif;
      font-size: 16px;
      font-weight: 400;
      line-height: 150%;
      letter-spacing: 2px;
      font-variant-numeric: tabular-nums;

      transform: translateX(-50%);
      will-change: opacity, transform;
    }


    /* =========================================
   TRANSIÇÃO HERO → SERVIÇOS
========================================= */

    .bolinhas {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 5;

      width: 120px;
      height: 120px;

      border-radius: 50%;
      background: var(--gradient-primary);

      opacity: 0;
      pointer-events: none;

      transform: translate(-50%, -50%) scale(0);
      transform-origin: center;
      will-change: transform, opacity;
    }


    /* Estado inicial da seção de serviços */

    .cardSolucoes {
      position: absolute;
      inset: 0;
      z-index: 1;

      display: flex;
      flex-direction: column;
      justify-content: center;

      width: 100%;
      height: 100%;
      padding: 56px 4vw;
      gap: 24px;

      overflow: hidden;
      background: var(--color-dark);

      opacity: 0;
      pointer-events: none;
    }

    .cardSolucoes.ativoMouse {
      pointer-events: auto;
    }

    .hero.semMouse {
      pointer-events: none;
    }

    .headServicos {
      display: flex;
      flex-direction: column;
      align-items: center;

      gap: 16px;
      text-align: center;
    }

    .headServicos h2 {
      font-size: 104px;
      font-weight: 400;
      line-height: 110%;
      text-align: center;
    }

    .trackServicos {
      position: relative;
      z-index: 2;

      display: flex;
      flex-wrap: nowrap;

      width: max-content;
      gap: 32px;

      transform: translate3d(0, 0, 0);
      will-change: transform;
    }

    /* Notebook */

    @media (min-width: 1025px) and (max-width: 1200px) {
      .hero h1 {
        font-size: 64px;
      }
    }

    /* Tablet horizontal */

    @media (min-width: 881px) and (max-width: 1024px) {
      .hero h1 {
        font-size: 56px;
      }
    }

    /* Tablet */

    @media (min-width: 768px) and (max-width: 880px) {
      .hero h1 {
        width: 100%;
        font-size: 48px;
      }

      .conteudo,
      .texto {
        width: 100%;
      }
    }

    /* Mobile */

    @media (max-width: 767px) {
      .headerDesktop {
        display: none !important;
      }

      .headerMobile {
        position: fixed;
        inset: 0 0 auto 0;
        z-index: 9999;

        display: flex !important;
        justify-content: space-between;
        align-items: center;

        width: 100%;
        height: 72px;
        padding: 16px;
        background: transparent;
      }

      .menu-drop-down {
        position: fixed;
        top: -0.5rem;
        left: 50%;
        width: 100%;
        max-width: 430px;
        transform: translate3d(-50%, -21rem, 0);
      }

      .nav-link {
        opacity: 0;
      }

      .logoMobile {
        width: 40px;
        height: auto;
      }

      .iconeMobile {
        width: 38px;
        height: auto;
      }

      .hero {
        width: 100%;
        height: 100%;
        padding: 80px 16px;

        align-items: flex-start;
        justify-content: center;

        background-image: url("/assets/imagens/mobile_BG_hero.webp");
        background-position: center;
        background-size: cover;
      }

      .conteudo {
        width: 100%;
        gap: 32px;
      }

      .texto {
        width: 100%;
      }

      .hero h1 {
        position: relative;
        width: 100%;
        font-size: 32px;
        line-height: 130%;
      }

      .hero h1::after {
        top: 13px;
        right: 140px;
        font-size: 28px;
      }

      .paragrafo {
        width: 100%;
        font-size: 16px;
      }

      .botoes {
        display: flex;
        flex-direction: column;

        width: 100%;
        gap: 24px;
        margin-top: 16px;
      }

      .portfolioButton {
        justify-content: center;
        width: 310.92px;
        height: 64px;
        padding: 24px 48px;
        gap: 16px;
      }

      .cardSolucoes {
        padding: 72px 16px 40px;
        gap: 16px;
        justify-content: center;
      }

      .headServicos h2 {
        font-size: 56px;
        font-weight: 700;
      }
    }

    @media (min-width: 376px) and (max-width: 429px) {
      .hero h1::after {
        right: 110px;
      }
    }

    @media (min-width: 366px) and (max-width: 375px) {
      .hero h1::after {
        right: 100px;
      }
    }

    @media (max-width: 365px) {
      .hero h1::after {
        right: 80px;
      }
    }
  </style>

  <link
    rel="preload"
    href="/style.css?v=5"
    as="style"
    onload="this.onload=null;this.rel='stylesheet'">

  <noscript>
    <link rel="stylesheet" href="/style.css?v=6">
  </noscript>

  <!-- CSS do campo de telefone sem bloquear a renderização -->
  <link
    rel="preload"
    href="https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.7/build/css/intlTelInput.css"
    as="style"
    onload="this.onload=null;this.rel='stylesheet'">

  <noscript>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.7/build/css/intlTelInput.css">
  </noscript>

  <!-- Favicon -->
  <link rel="icon" href="/assets/imagens/favicon.svg" type="image/svg+xml">

  <!-- Preload -->

  <link
    rel="preload"
    as="image"
    href="/assets/imagens/mobile_BG_hero.webp"
    media="(max-width: 767px)"
    fetchpriority="high">

  <link
    rel="preload"
    as="image"
    href="/assets/imagens/bghero-webdesign.webp"
    media="(min-width: 768px)"
    fetchpriority="high">


</head>

<body>