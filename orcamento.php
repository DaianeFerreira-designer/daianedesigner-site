<?php

session_start();

if (empty($_SESSION['csrf_token'])) {
  $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

$title = "Formulário de Orçamento | Web Designer";
$description = "Formulário para solicitar orçamento";
$url = "https://daianedesigner.com.br/orcamento";
$robots = "noindex, nofollow";
$isBudgetPage = true;
$orcamentoRequestId = bin2hex(random_bytes(16));

?>

<!-- Head Daiane Ferreira -->
<?php include 'partials/head.php'; ?>

<div class="custom-scrollbar">
  <div class="custom-scroll-thumb"></div>
</div>

<!-- Header Daiane Ferreira -->
<?php include 'partials/header.php'; ?>

<!--                  Todo conteúdo do Site                         -->

<div class="wrapperForms" aria-label="Informações do formulário">
  <!--                  Barra lateral                         -->
  <aside class="barraLateral">
    <div class="containerInfo">
      <!--                  Passos                        -->
      <div class="frameSteps" role="list">
        <div class="stepCard stepActive" id="stepCard1" role="listitem">
          <div class="stepBadge">01</div>
          <p>Contato</p>
        </div>
        <div class="stepCard" id="stepCard2" role="listitem">
          <div class="stepBadge">02</div>
          <p>Projeto</p>
        </div>
        <div class="stepCard" id="stepCard3" role="listitem">
          <div class="stepBadge">03</div>
          <p>Confirme seus dados</p>
        </div>
      </div>

      <!-- Logo -->
      <div class="forms-logo" aria-label="Icone Daiane Ferreira">
        <img
          src="/assets/icon-daiane-ferreira-logo-web-design-sites.svg"
          alt="Icone Daiane Ferreira"
          width="42" height="41" />
        <!-- Título -->
        <h1 class="tituloOrcamento">
          Preencha o formulário ao lado para
          <span>solicitar seu orçamento!</span>
        </h1>
      </div>
    </div>
  </aside>

  <main class="container-principal" id="containerPrincipal">
    <!--                  Conteúdo do formulário                         -->

    <div
      class="progressoWrap"
      role="progressbar"
      aria-label="Progresso do formulário"
      aria-valuenow="0"
      aria-valuemin="0"
      aria-valuemax="100"
      id="progressBar">
      <!-- ETAPA 1 -->
      <div
        class="pItem"
        role="group"
        aria-label="Etapa 1"
        aria-current="step">
        <div class="prog-seg" aria-hidden="true">
          <div class="prog-fill" id="pf1"></div>
        </div>
      </div>
      <div class="pSeta" aria-hidden="true">›</div>

      <!-- ETAPA 2 -->
      <div class="pItem" role="group" aria-label="Etapa 2">
        <div class="prog-seg" aria-hidden="true">
          <div class="prog-fill" id="pf2"></div>
        </div>
      </div>
      <div class="pSeta" aria-hidden="true">›</div>
      <!-- ETAPA 3 -->

      <div class="pItem" role="group" aria-label="Etapa 3">
        <div class="prog-seg" aria-hidden="true">
          <div class="prog-fill" id="pf3"></div>
        </div>
      </div>
    </div>

    <div class="formsConteudo">
      <form
        id="formsOrcamento"
        method="post"
        novalidate=""
        autocomplete="off">
        <!-- Cross-Site Request Forgery -->
        <input
          type="hidden"
          name="csrf_token"
          value="<?= htmlspecialchars($_SESSION['csrf_token'], ENT_QUOTES, 'UTF-8') ?>">

        <input type="hidden" name="request_id" value="<?= $orcamentoRequestId ?>">
        <input type="hidden" name="stage" id="stage" value="draft" />
        <input type="hidden" name="draft_id" id="draft_id" value="" />

        <!-- Honeypot ( bot) -->
        <div class="hp-trap" aria-hidden="true">
          <input
            type="text"
            name="statusweb"
            tabindex="-1"
            autocomplete="off"
            aria-label="leave empty" />
        </div>

        <!-- STEP 1: Informação para contato -->
        <div class="formsStep" id="formsStep1">
          <!-- Nome -->
          <div class="fieldGroup">
            <label class="fieldLabel" for="nome"> Nome: </label>
            <input
              type="text"
              id="nome"
              name="nome"
              class="field-input"
              placeholder="Digite seu nome aqui..."
              maxlength="100"
              autocomplete="name"
              spellcheck="false"
              required
              aria-required="true"
              aria-describedby="nomeErr" />
            <span class="fieldError" id="nomeErr" role="alert"></span>
          </div>

          <!-- WhatsApp -->
          <div class="fieldGroup">
            <label class="fieldLabel" for="phone"> Telefone: </label>
            <div class="phone-wrap">
              <input
                type="tel"
                id="phone"
                name="whatsapp"
                class="field-input"
                placeholder="Digite seu número de WhatsApp"
                autocomplete="tel"
                required
                aria-required="true"
                aria-describedby="phoneErr" />
            </div>
            <span class="fieldError" id="phoneErr" role="alert"></span>
          </div>

          <!-- Email -->
          <div class="fieldGroup">
            <label class="fieldLabel" for="email"> E-mail: </label>
            <input
              type="email"
              id="email"
              name="email"
              class="field-input"
              placeholder="Digite seu e-mail"
              autocomplete="email"
              required
              aria-required="true"
              aria-describedby="emailErr" />
            <span class="fieldError" id="emailErr" role="alert"></span>
          </div>

          <!-- Empresa -->
          <div class="fieldGroup">
            <label class="fieldLabel" for="empresaOpcional">
              Empresa:
            </label>
            <input
              type="text"
              id="empresaOpcional"
              name="empresaOpcional"
              class="field-input"
              placeholder="Nome da empresa / marca (se tiver)"
              maxlength="500"
              aria-describedby="empresaErr" />
            <span class="fieldError" id="empresaErr" role="alert"></span>
          </div>

          <!-- Aceite Política de Privacidade (obrigatório) -->
          <div class="fieldGroup divAceite">
            <label class="aceiteLabel" for="aceitePrivacidade">
              <input
                type="checkbox"
                id="aceitePrivacidade"
                name="aceitePrivacidade"
                value="1"
                required
                aria-required="true"
                aria-describedby="privErr" />
              <span class="checkUI" aria-hidden="true"></span>

              <span class="fieldLabel aceiteText">
                Aceito a
                <a
                  href="/politica-de-privacidade"
                  target="_blank"
                  rel="noopener">
                  Política de Privacidade
                </a>
                para contato sobre este orçamento.
              </span>
            </label>
            <span class="fieldError" id="privErr" role="alert"></span>
          </div>

          <!-- Newsletter (opcional) -->
          <div class="fieldGroup divAceite divNewsletter">
            <label class="aceiteLabel" for="newsletterOptIn">
              <input
                type="checkbox"
                id="newsletterOptIn"
                name="newsletterOptIn"
                value="1" />
              <span class="checkUI" aria-hidden="true"></span>

              <span class="fieldLabel aceiteText">
                Gostaria de receber novidades, ofertas e conteúdos exclusivos por e-mail (Newsletter).
              </span>
            </label>
          </div>

          <!-- Global erro sep 01 -->

          <div
            class="global-error"
            id="globalErr1"
            role="alert"
            aria-live="polite"
            hidden></div>

          <!-- button proximo -->
          <div class="form-nav">
            <button type="button" class="btn-primary" id="btnNextStep1">
              <span class="btn-label">Continuar</span>
              <span class="btn-spinner" hidden>
                <span class="spinner"></span>
              </span>
            </button>
          </div>


        </div>

        <!-- STEP 2: Detalhes do projeto -->
        <div
          class="formsStep stepHidden"
          id="formsStep2"
          aria-hidden="true">
          <!-- site -->
          <div class="fieldGroup">
            <p class="fieldLabel" id="siteLabel">Você já tem um site?</p>

            <div
              class="optionsGrid"
              role="radiogroup"
              aria-labelledby="siteLabel"
              aria-required="true">
              <label class="optionCard optionCheck" for="site_sim">
                <input
                  type="radio"
                  id="site_sim"
                  name="presenca_site"
                  value="Sim, já tenho um site"
                  required />
                <span class="optIndicator" aria-hidden="true"></span>
                <span class="optText">Sim, já tenho um site</span>
              </label>

              <label class="optionCard optionCheck" for="site_nao">
                <input
                  type="radio"
                  id="site_nao"
                  name="presenca_site"
                  value="Não, ainda não tenho um site" />
                <span class="optIndicator" aria-hidden="true"></span>
                <span class="optText">Não, ainda não tenho um site</span>
              </label>
            </div>
            <span class="fieldError" id="siteErr" role="alert"></span>
          </div>

          <!-- Campo condicional: Link do site (aparece só se "Sim") -->
          <div
            class="fieldGroup stepHidden"
            id="siteLinkGroup"
            aria-hidden="true">
            <label class="fieldLabel" for="siteLink">Link do site:</label>
            <input
              type="url"
              id="siteLink"
              name="site_link"
              class="field-input"
              placeholder="https://seusite.com.br"
              autocomplete="url"
              inputmode="url"
              aria-describedby="siteLinkErr" />
            <span class="fieldError" id="siteLinkErr" role="alert"></span>
          </div>

          <!-- tipo de projeto -->
          <div class="fieldGroup">
            <p class="fieldLabel" id="projetoLabel">
              Qual o tipo de projeto?
              <span class="labelHint">Selecione um ou mais</span>
            </p>
            <div
              class="optionsGrid"
              role="group"
              aria-labelledby="projetoLabel"
              aria-required="true">
              <label
                class="optionCard optionCheck"
                for="pj_siteinstitucional">
                <input
                  type="checkbox"
                  id="pj_siteinstitucional"
                  name="tipo_projeto[]"
                  value="Site institucional" />
                <span class="optIndicator" aria-hidden="true"></span>
                <span class="optText"> Site institucional </span>
              </label>

              <label class="optionCard optionCheck" for="pj_lp">
                <input
                  type="checkbox"
                  id="pj_lp"
                  name="tipo_projeto[]"
                  value="Landing page" />
                <span class="optIndicator" aria-hidden="true"></span>
                <span class="optText"> Landing page </span>
              </label>

              <label class="optionCard optionCheck" for="pj_lojavirtual">
                <input
                  type="checkbox"
                  id="pj_lojavirtual"
                  name="tipo_projeto[]"
                  value="Loja virtual" />
                <span class="optIndicator" aria-hidden="true"></span>
                <span class="optText"> Loja virtual </span>
              </label>

              <label class="optionCard optionCheck" for="pj_captura">
                <input
                  type="checkbox"
                  id="pj_captura"
                  name="tipo_projeto[]"
                  value="Página de captura" />
                <span class="optIndicator" aria-hidden="true"></span>
                <span class="optText"> Página de captura </span>
              </label>

              <label class="optionCard optionCheck" for="pj_membros">
                <input
                  type="checkbox"
                  id="pj_membros"
                  name="tipo_projeto[]"
                  value="Área de membros" />
                <span class="optIndicator" aria-hidden="true"></span>
                <span class="optText"> Área de membros </span>
              </label>

              <label class="optionCard optionCheck" for="pj_link_bio">
                <input
                  type="checkbox"
                  id="pj_link_bio"
                  name="tipo_projeto[]"
                  value="Link na Bio" />
                <span class="optIndicator" aria-hidden="true"></span>
                <span class="optText"> Link na Bio </span>
              </label>

              <label class="optionCard optionCheck" for="pj_automacao">
                <input
                  type="checkbox"
                  id="pj_automacao"
                  name="tipo_projeto[]"
                  value="Automação" />
                <span class="optIndicator" aria-hidden="true"></span>
                <span class="optText"> Automação </span>
              </label>

              <label class="optionCard optionCheck" for="pj_seo">
                <input
                  type="checkbox"
                  id="pj_seo"
                  name="tipo_projeto[]"
                  value="Seo & Performance" />
                <span class="optIndicator" aria-hidden="true"></span>
                <span class="optText"> Seo & Performance </span>
              </label>

              <label class="optionCard optionCheck" for="pj_outro">
                <input
                  type="checkbox"
                  id="pj_outro"
                  name="tipo_projeto[]"
                  value="Outro" />
                <span class="optIndicator" aria-hidden="true"></span>
                <span class="optText">Outro</span>
              </label>
            </div>
            <span class="fieldError" id="tipoErr" role="alert"></span>
          </div>

          <!-- Campo condicional: tipo de projeto aparece só se marcar "Outro" -->
          <div
            class="fieldGroup stepHidden"
            id="outroProjetoGroup"
            aria-hidden="true">
            <label class="fieldLabel" for="outroProjetoTxt">Qual outro projeto?</label>

            <textarea
              id="outroProjetoTxt"
              name="outro_projeto"
              class="field-input textareaLabel"
              rows="5"
              placeholder="Digite qual tipo de projeto você precisa"
              aria-describedby="outroProjetoErr"></textarea>

            <span
              class="fieldError"
              id="outroProjetoErr"
              role="alert"></span>
          </div>

          <!-- Q9 — Orçamento -->
          <div class="fieldGroup">
            <p class="fieldLabel" id="orcamentoLabel">
              Qual é a faixa de orçamento prevista?
            </p>

            <div
              class="optionsGrid"
              role="radiogroup"
              aria-labelledby="orcamentoLabel"
              aria-required="true">
              <label class="optionCard optionCheck" for="orcamento_faixa01">
                <input
                  type="radio"
                  id="orcamento_faixa01"
                  name="investimento_estimado"
                  value="R$ 1.000 a R$ 2.000"
                  required />
                <span class="optIndicator" aria-hidden="true"></span>
                <span class="optText">R$ 1.000 a R$ 2.000</span>
              </label>

              <label class="optionCard optionCheck" for="orcamento_faixa02">
                <input
                  type="radio"
                  id="orcamento_faixa02"
                  name="investimento_estimado"
                  value="R$ 2.500 a R$ 5.000" />
                <span class="optIndicator" aria-hidden="true"></span>
                <span class="optText">R$ 2.500 a R$ 5.000</span>
              </label>

              <label class="optionCard optionCheck" for="orcamento_faixa03">
                <input
                  type="radio"
                  id="orcamento_faixa03"
                  name="investimento_estimado"
                  value="R$ 5.500 a R$ 15.000" />
                <span class="optIndicator" aria-hidden="true"></span>
                <span class="optText">R$ 5.500 a R$ 15.000</span>
              </label>

              <label class="optionCard optionCheck" for="orcamento_faixa04">
                <input
                  type="radio"
                  id="orcamento_faixa04"
                  name="investimento_estimado"
                  value="Ainda não tenho um valor" />
                <span class="optIndicator" aria-hidden="true"></span>
                <span class="optText">Ainda não tenho um valor</span>
              </label>
            </div>

            <span class="fieldError" id="valorErr" role="alert"></span>
          </div>

          <!--  Prazo -->
          <div class="fieldGroup">
            <p class="fieldLabel" id="prazoLabel">Prazo desejado:</p>
            <div
              class="optionsGrid"
              role="radiogroup"
              aria-labelledby="prazoLabel">
              <label class="optionCard optionCheck" for="prazo_tempo01">
                <input
                  type="radio"
                  id="prazo_tempo01"
                  name="prazo_inicio"
                  required
                  value="Até 7 dias" />
                <span class="optIndicator" aria-hidden="true"></span>
                <span class="optText">Até 7 dias</span>
              </label>
              <label class="optionCard optionCheck" for="prazo_tempo02">
                <input
                  type="radio"
                  id="prazo_tempo02"
                  name="prazo_inicio"
                  value="Até 15 dias" />
                <span class="optIndicator" aria-hidden="true"></span>
                <span class="optText">Até 15 dias</span>
              </label>
              <label class="optionCard optionCheck" for="prazo_tempo03">
                <input
                  type="radio"
                  id="prazo_tempo03"
                  name="prazo_inicio"
                  value="Até 30 dias" />
                <span class="optIndicator" aria-hidden="true"></span>
                <span class="optText">Até 30 dias</span>
              </label>
              <label class="optionCard optionCheck" for="prazo_tempo04">
                <input
                  type="radio"
                  id="prazo_tempo04"
                  name="prazo_inicio"
                  value="Até 60 dias" />
                <span class="optIndicator" aria-hidden="true"></span>
                <span class="optText">Até 60 dias</span>
              </label>

              <label class="optionCard optionCheck" for="prazo_tempo05">
                <input
                  type="radio"
                  id="prazo_tempo05"
                  name="prazo_inicio"
                  value="Sem pressa / flexível" />
                <span class="optIndicator" aria-hidden="true"></span>
                <span class="optText">Sem pressa / flexível</span>
              </label>
            </div>
            <span class="fieldError" id="prazoErr" role="alert"></span>
          </div>

          <!-- Instagram -->
          <div class="fieldGroup">
            <label class="fieldLabel" for="insta">
              Qual seu Instagram?
            </label>
            <input
              type="text"
              id="insta"
              name="insta"
              class="field-input"
              placeholder="Digite seu @seuperfil (ou https://instagram.com/seuperfil)..."
              maxlength="100"
              required
              aria-required="true"
              aria-describedby="instaErr" />
            <span class="fieldError" id="instaErr" role="alert"></span>
          </div>

          <!-- Observações (opcional) -->
          <div class="fieldGroup" id="observacaoProjeto">
            <label class="fieldLabel" for="observacao">Detalhes adicionais</label>

            <textarea
              id="observacao"
              name="observacao"
              class="field-input textareaLabel"
              rows="3"
              placeholder="Ex.: prioridade, referência ou informação importante"
              aria-describedby="obsErr"></textarea>

            <span class="fieldError" id="obsErr" role="alert"></span>
          </div>

          <!-- Global error -->
          <div
            class="global-error"
            id="globalErr"
            role="alert"
            aria-live="polite"
            hidden=""></div>

          <!-- Botões de navegação -->
          <div class="form-nav navSplit">
            <button type="button" class="btn-secondary" id="btnBackStep2">
              Voltar
            </button>
            <button
              type="button"
              class="btn-primary btn-submit"
              id="btnNextStep2">
              <span class="btn-label">Enviar</span>
              <span class="btn-spinner" aria-hidden="true" hidden>
                <span class="spinner"></span>
              </span>
            </button>
          </div>
        </div>

        <!-- STEP 3: Revisão e envio -->
        <div
          class="formsStep stepHidden"
          id="formsStep3"
          aria-hidden="true">
          <p class="stepTitle">
            Confirmar informações
          </p>

          <div class="reviewBox" aria-live="polite">
            <div class="reviewRow">
              <div class="reviewLabel">Nome</div>
              <div class="reviewValue" id="rv_nome">—</div>
            </div>

            <div class="reviewRow">
              <div class="reviewLabel">WhatsApp</div>
              <div class="reviewValue" id="rv_whatsapp">—</div>
            </div>

            <div class="reviewRow">
              <div class="reviewLabel">E-mail</div>
              <div class="reviewValue" id="rv_email">—</div>
            </div>

            <div class="reviewRow">
              <div class="reviewLabel">Empresa</div>
              <div class="reviewValue" id="rv_empresa">—</div>
            </div>

            <div class="reviewRow">
              <div class="reviewLabel">Newsletter</div>
              <div class="reviewValue" id="rv_newsletter">—</div>
            </div>

            <hr class="reviewSep" aria-hidden="true" />

            <div class="reviewRow">
              <div class="reviewLabel">Já tem site?</div>
              <div class="reviewValue" id="rv_presenca_site">—</div>
            </div>

            <div class="reviewRow" id="rv_siteLinkRow" hidden>
              <div class="reviewLabel">Link do site</div>
              <div class="reviewValue" id="rv_site_link">—</div>
            </div>

            <div class="reviewRow">
              <div class="reviewLabel">Tipo de projeto</div>
              <div class="reviewValue" id="rv_tipo_projeto">—</div>
            </div>

            <div class="reviewRow" id="rv_outroProjetoRow" hidden>
              <div class="reviewLabel">Outro projeto</div>
              <div class="reviewValue" id="rv_outro_projeto">—</div>
            </div>

            <div class="reviewRow">
              <div class="reviewLabel">Instagram</div>
              <div class="reviewValue" id="rv_insta">—</div>
            </div>

            <div class="reviewRow">
              <div class="reviewLabel">Orçamento</div>
              <div class="reviewValue" id="rv_orcamento">—</div>
            </div>

            <div class="reviewRow">
              <div class="reviewLabel">Prazo</div>
              <div class="reviewValue" id="rv_prazo">—</div>
            </div>

            <div class="reviewRow">
              <div class="reviewLabel">Detalhes adicionais</div>
              <div class="reviewValue" id="rv_obs">—</div>
            </div>
          </div>

          <div
            class="global-error"
            id="globalErr3"
            role="alert"
            aria-live="polite"
            hidden></div>

          <!-- Navigation -->
          <div class="form-nav navSplit">
            <button type="button" class="btn-secondary" id="btnBackStep3">
              Voltar
            </button>

            <!-- AGORA SIM: envio final -->
            <button
              type="submit"
              class="btn-primary btn-submit"
              id="btnFinalSubmit">
              <span class="btn-label">Confirmar</span>
              <span class="btn-spinner" aria-hidden="true" hidden>
                <span class="spinner"></span>
              </span>
            </button>
          </div>
        </div>
      </form>

      <!-- Sucesso (fica no mesmo lugar do form) -->
      <div
        class="formSuccess stepHidden"
        id="formSuccess"
        role="status"
        aria-live="polite"
        aria-hidden="true">
        <h2 class="successTitle">Solicitação enviada.</h2>
        <p class="successText">
          Vou entrar em contato em breve para alinharmos os próximos passos.
        </p>
      </div>
    </div>
  </main>
</div>

<!-- Rodapé Daiane Ferreira -->
<footer class="rodapeForms">
  <p>© <span id="anoAtual"><?= date('Y') ?></span> Daiane Ferreira</p>
  <p> | Todos os Direitos Reservados</p>
  <nav class="linksLegaisFooter" aria-label="Políticas e termos">
    <a href="/termos-de-uso" target="_blank" rel="noopener noreferrer">Termos de uso</a>
    <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer">Política de privacidade</a>
    <a href="/politica-de-cookies" target="_blank" rel="noopener noreferrer">Política de cookies</a>
  </nav>
</footer>


<!-- jQuery -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>

<!-- GSAP -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/ScrollSmoother.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/SplitText.min.js"></script>

<!-- JS -->
<script src="https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.7/build/js/intlTelInput.min.js"></script>
<script src="/script.js?v=20261112-9"></script>
<script src="/assets/analytics.js?v=20261107-6" defer></script>
<script src="/main.js?v=11" defer></script>
</body>

</html>
