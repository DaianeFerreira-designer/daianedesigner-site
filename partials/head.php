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

  <!-- css -->
  <link rel="stylesheet" href="/style.css">

  <!-- intl-tel-input CSS -->
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.7/build/css/intlTelInput.css" />

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