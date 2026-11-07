<!doctype html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title><?= $title ?? 'Site' ?></title>
  <meta name="description" content="<?= $description ?? '' ?>">

  <?php if (!empty($url)): ?>
    <link
      rel="canonical"
      href="<?= htmlspecialchars($url, ENT_QUOTES, 'UTF-8') ?>">
  <?php endif; ?>

  <?php
  $socialTitle = $title ?? 'Daiane Ferreira — Web Designer';
  $socialDescription = $description ?? '';
  $socialUrl = $url ?? 'https://daianedesigner.com.br/';
  $socialImage = $image ?? 'https://daianedesigner.com.br/assets/criacao-de-sites-profissionais-daiane-ferreira-desktop.webp';
  $socialImageAlt = 'Criação de sites profissionais por Daiane Ferreira';
  ?>

  <!-- Open Graph -->
  <meta property="og:locale" content="pt_BR">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Daiane Ferreira — Web Designer">
  <meta property="og:title" content="<?= htmlspecialchars($socialTitle, ENT_QUOTES, 'UTF-8') ?>">
  <meta property="og:description" content="<?= htmlspecialchars($socialDescription, ENT_QUOTES, 'UTF-8') ?>">
  <meta property="og:url" content="<?= htmlspecialchars($socialUrl, ENT_QUOTES, 'UTF-8') ?>">
  <meta property="og:image" content="<?= htmlspecialchars($socialImage, ENT_QUOTES, 'UTF-8') ?>">
  <meta property="og:image:width" content="1920">
  <meta property="og:image:height" content="1001">
  <meta property="og:image:type" content="image/webp">
  <meta property="og:image:alt" content="<?= htmlspecialchars($socialImageAlt, ENT_QUOTES, 'UTF-8') ?>">

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="<?= htmlspecialchars($socialTitle, ENT_QUOTES, 'UTF-8') ?>">
  <meta name="twitter:description" content="<?= htmlspecialchars($socialDescription, ENT_QUOTES, 'UTF-8') ?>">
  <meta name="twitter:image" content="<?= htmlspecialchars($socialImage, ENT_QUOTES, 'UTF-8') ?>">
  <meta name="twitter:image:alt" content="<?= htmlspecialchars($socialImageAlt, ENT_QUOTES, 'UTF-8') ?>">

  <?php if (!empty($structuredData)): ?>
    <script type="application/ld+json"><?= json_encode(
      $structuredData,
      JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP
    ) ?></script>
  <?php endif; ?>

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

  <!-- CSS principal -->
  <link rel="stylesheet" href="/style.css?v=20261107-2">

  <?php if (!empty($isBudgetPage)): ?>
    <link rel="stylesheet" href="/orcamento.css?v=2">
  <?php endif; ?>

  <!-- CSS do campo de telefone sem bloquear a renderização -->
  <link rel="preload" href="https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.7/build/css/intlTelInput.css" as="style" onload="this.onload=null;this.rel='stylesheet'">

  <noscript>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.7/build/css/intlTelInput.css">
  </noscript>

  <!-- Favicon -->
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">



</head>

<body>
