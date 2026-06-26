
<?php
$title = "Formulário de Orçamento | Web Designer";
$description = "Formulário para solicitar orçamento";
$robots = "noindex, nofollow";
?>

<!-- Head Daiane Ferreira -->
<?php include 'partials/head.php'; ?>

    <div id="preloader" aria-hidden="true">
      <div class="preloader-bg"></div>

      <div class="preloader-logo">
        <svg
          class="preloader-logo-empty"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 40 41"
          fill="none"
        >
          <!--  paths aqui -->
          <path
            d="M2 2C2.52501 2 3.04218 2.21118 3.41602 2.58919L3.41536 2.58984C3.78841 2.96291 4 3.47227 4 4C4 4.5285 3.7883 5.04269 3.41081 5.41602L3.41016 5.41537C3.03656 5.78892 2.52426 6 2 6C1.4715 6 0.957313 5.7883 0.583984 5.41081L0.584635 5.41016C0.21108 5.03656 8.5234e-09 4.52426 0 4C0 3.47499 0.211185 2.95782 0.589193 2.58398L0.589844 2.58464C0.963443 2.21108 1.47574 2 2 2Z"
            fill="#FFFEFD"
          />
          <path
            d="M10 2C10.5285 2 11.0427 2.2117 11.416 2.58919L11.4154 2.58984C11.7884 2.96291 12 3.47227 12 4C12 4.5285 11.7883 5.04269 11.4108 5.41602L11.4102 5.41536C11.0368 5.78867 10.526 6 10 6C9.47499 6 8.95782 5.78882 8.58398 5.41081L8.58464 5.41016C8.21108 5.03656 8 4.52426 8 4C8 3.47499 8.21119 2.95782 8.58919 2.58398L8.58984 2.58464C8.96291 2.21159 9.47227 2 10 2Z"
            fill="white"
          />
          <path
            d="M18 2C18.525 2 19.0422 2.21118 19.416 2.58919L19.4154 2.58984C19.7884 2.96291 20 3.47227 20 4C20 4.5285 19.7883 5.04269 19.4108 5.41602L19.4102 5.41536C19.0366 5.78892 18.5243 6 18 6C17.4715 6 16.9573 5.7883 16.584 5.41081L16.5846 5.41016C16.2111 5.03656 16 4.52426 16 4C16 3.47499 16.2112 2.95782 16.5892 2.58398L16.5898 2.58464C16.9634 2.21108 17.4757 2 18 2Z"
            fill="#FFFEFD"
          />
          <path
            d="M8.8096 33.2832C8.304 33.2832 7.8296 33.0864 7.4744 32.7296L0.5528 25.808C0.1968 25.4528 0 24.9784 0 24.4736C0 23.9688 0.1968 23.4936 0.5536 23.1384L7.4752 16.2168C7.8304 15.8608 8.3048 15.664 8.8096 15.664C9.8504 15.664 10.6976 16.5112 10.6976 17.552C10.6976 18.0576 10.5008 18.532 10.144 18.8872L4.5576 24.4736L10.1448 30.0608C10.5016 30.416 10.6976 30.8904 10.6976 31.3952C10.6976 32.436 9.8504 33.2832 8.8096 33.2832Z"
            fill="#FFFEFD"
          />
          <path
            d="M28.9472 33.9128C27.9064 33.9128 27.0592 33.0656 27.0592 32.0248C27.0592 31.5192 27.256 31.0448 27.6128 30.6896L33.1992 25.1032L27.612 19.516C27.256 19.16 27.0592 18.6856 27.0592 18.1816C27.0592 17.1408 27.9064 16.2936 28.9472 16.2936C29.4528 16.2936 29.9272 16.4904 30.2824 16.8472L37.204 23.7688C37.5608 24.1248 37.7568 24.5992 37.7568 25.1032C37.7568 25.6072 37.56 26.0832 37.2032 26.4384L30.2816 33.36C29.9264 33.7168 29.452 33.9128 28.9472 33.9128Z"
            fill="#FFFEFD"
          />
          <path
            d="M13.2152 38.9472C12.1744 38.9472 11.3272 38.1 11.3272 37.0592C11.3272 36.8088 11.376 36.564 11.472 36.332L22.7992 11.16C23.0952 10.4552 23.7792 10 24.5416 10C25.5824 10 26.4296 10.8472 26.4296 11.888C26.4296 12.1384 26.3808 12.3832 26.2848 12.6152L14.9568 37.788C14.6608 38.4928 13.9768 38.948 13.2144 38.948L13.2152 38.9472Z"
            fill="#FFFEFD"
          />
        </svg>

        <svg
          class="preloader-logo-fill"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 40 41"
          fill="none"
        >
          <!-- mesmos paths aqui -->
          <path
            d="M2 2C2.52501 2 3.04218 2.21118 3.41602 2.58919L3.41536 2.58984C3.78841 2.96291 4 3.47227 4 4C4 4.5285 3.7883 5.04269 3.41081 5.41602L3.41016 5.41537C3.03656 5.78892 2.52426 6 2 6C1.4715 6 0.957313 5.7883 0.583984 5.41081L0.584635 5.41016C0.21108 5.03656 8.5234e-09 4.52426 0 4C0 3.47499 0.211185 2.95782 0.589193 2.58398L0.589844 2.58464C0.963443 2.21108 1.47574 2 2 2Z"
            fill="#FFFEFD"
          />
          <path
            d="M10 2C10.5285 2 11.0427 2.2117 11.416 2.58919L11.4154 2.58984C11.7884 2.96291 12 3.47227 12 4C12 4.5285 11.7883 5.04269 11.4108 5.41602L11.4102 5.41536C11.0368 5.78867 10.526 6 10 6C9.47499 6 8.95782 5.78882 8.58398 5.41081L8.58464 5.41016C8.21108 5.03656 8 4.52426 8 4C8 3.47499 8.21119 2.95782 8.58919 2.58398L8.58984 2.58464C8.96291 2.21159 9.47227 2 10 2Z"
            fill="white"
          />
          <path
            d="M18 2C18.525 2 19.0422 2.21118 19.416 2.58919L19.4154 2.58984C19.7884 2.96291 20 3.47227 20 4C20 4.5285 19.7883 5.04269 19.4108 5.41602L19.4102 5.41536C19.0366 5.78892 18.5243 6 18 6C17.4715 6 16.9573 5.7883 16.584 5.41081L16.5846 5.41016C16.2111 5.03656 16 4.52426 16 4C16 3.47499 16.2112 2.95782 16.5892 2.58398L16.5898 2.58464C16.9634 2.21108 17.4757 2 18 2Z"
            fill="#FFFEFD"
          />
          <path
            d="M8.8096 33.2832C8.304 33.2832 7.8296 33.0864 7.4744 32.7296L0.5528 25.808C0.1968 25.4528 0 24.9784 0 24.4736C0 23.9688 0.1968 23.4936 0.5536 23.1384L7.4752 16.2168C7.8304 15.8608 8.3048 15.664 8.8096 15.664C9.8504 15.664 10.6976 16.5112 10.6976 17.552C10.6976 18.0576 10.5008 18.532 10.144 18.8872L4.5576 24.4736L10.1448 30.0608C10.5016 30.416 10.6976 30.8904 10.6976 31.3952C10.6976 32.436 9.8504 33.2832 8.8096 33.2832Z"
            fill="#FFFEFD"
          />
          <path
            d="M28.9472 33.9128C27.9064 33.9128 27.0592 33.0656 27.0592 32.0248C27.0592 31.5192 27.256 31.0448 27.6128 30.6896L33.1992 25.1032L27.612 19.516C27.256 19.16 27.0592 18.6856 27.0592 18.1816C27.0592 17.1408 27.9064 16.2936 28.9472 16.2936C29.4528 16.2936 29.9272 16.4904 30.2824 16.8472L37.204 23.7688C37.5608 24.1248 37.7568 24.5992 37.7568 25.1032C37.7568 25.6072 37.56 26.0832 37.2032 26.4384L30.2816 33.36C29.9264 33.7168 29.452 33.9128 28.9472 33.9128Z"
            fill="#FFFEFD"
          />
          <path
            d="M13.2152 38.9472C12.1744 38.9472 11.3272 38.1 11.3272 37.0592C11.3272 36.8088 11.376 36.564 11.472 36.332L22.7992 11.16C23.0952 10.4552 23.7792 10 24.5416 10C25.5824 10 26.4296 10.8472 26.4296 11.888C26.4296 12.1384 26.3808 12.3832 26.2848 12.6152L14.9568 37.788C14.6608 38.4928 13.9768 38.948 13.2144 38.948L13.2152 38.9472Z"
            fill="#FFFEFD"
          />
        </svg>
      </div>

      <div class="preloader-percent">0%</div>
    </div>

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
              src="assets/imagens/icon-daiane-ferreira-logo-web-design-sites.svg"
              alt="Icone Daiane Ferreira"
            />
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
          id="progressBar"
        >
          <!-- ETAPA 1 -->
          <div
            class="pItem"
            role="group"
            aria-label="Etapa 1"
            aria-current="step"
          >
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
            action=""
            method="post"
            novalidate=""
            autocomplete="off"
          >
            <!-- Cross-Site Request Forgery -->
            <input type="hidden" name="csrf_token" value="" />

            <input type="hidden" name="stage" id="stage" value="draft" />
            <input type="hidden" name="draft_id" id="draft_id" value="" />

            <!-- Honeypot ( bot) -->
            <div class="hp-trap" aria-hidden="true">
              <input
                type="text"
                name="statusweb"
                tabindex="-1"
                autocomplete="off"
                aria-label="leave empty"
              />
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
                  aria-describedby="nomeErr"
                />
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
                    aria-describedby="phoneErr"
                  />
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
                  aria-describedby="emailErr"
                />
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
                  aria-describedby="empresaErr"
                />
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
                    aria-describedby="privErr"
                  />
                  <span class="checkUI" aria-hidden="true"></span>

                  <span class="fieldLabel aceiteText">
                    Aceito a
                    <a
                      href="politica-de-privacidade.html"
                      target="_blank"
                      rel="noopener"
                    >
                      Política de Privacidade
                    </a>
                    para contato sobre este orçamento.
                  </span>
                </label>
                <span class="fieldError" id="privErr" role="alert"></span>
              </div>

              <!-- Global erro sep 01 -->
              <div
                class="global-error"
                id="globalErr1"
                role="alert"
                aria-live="polite"
                hidden
              ></div>

              <!-- button proximo -->
              <div class="form-nav">
                <button type="button" class="btn-primary" id="btnNextStep1">
                  Continuar
                </button>
              </div>

  
            </div>

            <!-- STEP 2: Detalhes do projeto -->
            <div
              class="formsStep stepHidden"
              id="formsStep2"
              aria-hidden="true"
            >
              <!-- site -->
              <div class="fieldGroup">
                <p class="fieldLabel" id="siteLabel">Você já tem um site?</p>

                <div
                  class="optionsGrid"
                  role="radiogroup"
                  aria-labelledby="siteLabel"
                  aria-required="true"
                >
                  <label class="optionCard optionCheck" for="site_sim">
                    <input
                      type="radio"
                      id="site_sim"
                      name="presenca_site"
                      value="Sim, já tenho um site"
                      required
                    />
                    <span class="optIndicator" aria-hidden="true"></span>
                    <span class="optText">Sim, já tenho um site</span>
                  </label>

                  <label class="optionCard optionCheck" for="site_nao">
                    <input
                      type="radio"
                      id="site_nao"
                      name="presenca_site"
                      value="Não, ainda não tenho um site"
                    />
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
                aria-hidden="true"
              >
                <label class="fieldLabel" for="siteLink">Link do site:</label>
                <input
                  type="url"
                  id="siteLink"
                  name="site_link"
                  class="field-input"
                  placeholder="https://seusite.com.br"
                  autocomplete="url"
                  inputmode="url"
                  aria-describedby="siteLinkErr"
                />
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
                  aria-required="true"
                >
                  <label
                    class="optionCard optionCheck"
                    for="pj_siteinstitucional"
                  >
                    <input
                      type="checkbox"
                      id="pj_siteinstitucional"
                      name="tipo_projeto[]"
                      value="Site institucional"
                    />
                    <span class="optIndicator" aria-hidden="true"></span>
                    <span class="optText"> Site institucional </span>
                  </label>

                  <label class="optionCard optionCheck" for="pj_lp">
                    <input
                      type="checkbox"
                      id="pj_lp"
                      name="tipo_projeto[]"
                      value="Landing page"
                    />
                    <span class="optIndicator" aria-hidden="true"></span>
                    <span class="optText"> Landing page </span>
                  </label>

                  <label class="optionCard optionCheck" for="pj_lojavirtual">
                    <input
                      type="checkbox"
                      id="pj_lojavirtual"
                      name="tipo_projeto[]"
                      value="Loja virtual"
                    />
                    <span class="optIndicator" aria-hidden="true"></span>
                    <span class="optText"> Loja virtual </span>
                  </label>

                  <label class="optionCard optionCheck" for="pj_captura">
                    <input
                      type="checkbox"
                      id="pj_captura"
                      name="tipo_projeto[]"
                      value="Página de captura"
                    />
                    <span class="optIndicator" aria-hidden="true"></span>
                    <span class="optText"> Página de captura </span>
                  </label>

                  <label class="optionCard optionCheck" for="pj_membros">
                    <input
                      type="checkbox"
                      id="pj_membros"
                      name="tipo_projeto[]"
                      value="Área de membros"
                    />
                    <span class="optIndicator" aria-hidden="true"></span>
                    <span class="optText"> Área de membros </span>
                  </label>

                  <label class="optionCard optionCheck" for="pj_seo">
                    <input
                      type="checkbox"
                      id="pj_seo"
                      name="tipo_projeto[]"
                      value="Seo & Performance"
                    />
                    <span class="optIndicator" aria-hidden="true"></span>
                    <span class="optText"> Seo & Performance </span>
                  </label>

                  <label class="optionCard optionCheck" for="pj_outro">
                    <input
                      type="checkbox"
                      id="pj_outro"
                      name="tipo_projeto[]"
                      value="Outro"
                    />
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
                aria-hidden="true"
              >
                <label class="fieldLabel" for="outroProjetoTxt"
                  >Qual outro projeto?</label
                >

                <textarea
                  id="outroProjetoTxt"
                  name="outro_projeto"
                  class="field-input textareaLabel"
                  rows="5"
                  placeholder="Digite qual tipo de projeto você precisa"
                  aria-describedby="outroProjetoErr"
                ></textarea>

                <span
                  class="fieldError"
                  id="outroProjetoErr"
                  role="alert"
                ></span>
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
                  aria-required="true"
                >
                  <label class="optionCard optionCheck" for="orcamento_faixa01">
                    <input
                      type="radio"
                      id="orcamento_faixa01"
                      name="investimento_estimado"
                      value="R$ 1.000 a R$ 2.000"
                      required
                    />
                    <span class="optIndicator" aria-hidden="true"></span>
                    <span class="optText">R$ 1.000 a R$ 2.000</span>
                  </label>

                  <label class="optionCard optionCheck" for="orcamento_faixa02">
                    <input
                      type="radio"
                      id="orcamento_faixa02"
                      name="investimento_estimado"
                      value="R$ 2.500 a R$ 5.000"
                    />
                    <span class="optIndicator" aria-hidden="true"></span>
                    <span class="optText">R$ 2.500 a R$ 5.000</span>
                  </label>

                  <label class="optionCard optionCheck" for="orcamento_faixa03">
                    <input
                      type="radio"
                      id="orcamento_faixa03"
                      name="investimento_estimado"
                      value="R$ 5.500 a R$ 15.000"
                    />
                    <span class="optIndicator" aria-hidden="true"></span>
                    <span class="optText">R$ 5.500 a R$ 15.000</span>
                  </label>

                  <label class="optionCard optionCheck" for="orcamento_faixa04">
                    <input
                      type="radio"
                      id="orcamento_faixa04"
                      name="investimento_estimado"
                      value="Ainda não tenho um valor"
                    />
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
                  aria-labelledby="prazoLabel"
                >
                  <label class="optionCard optionCheck" for="prazo_tempo01">
                    <input
                      type="radio"
                      id="prazo_tempo01"
                      name="prazo_inicio"
                      required
                      value="Até 7 dias"
                    />
                    <span class="optIndicator" aria-hidden="true"></span>
                    <span class="optText">Até 7 dias</span>
                  </label>
                  <label class="optionCard optionCheck" for="prazo_tempo02">
                    <input
                      type="radio"
                      id="prazo_tempo02"
                      name="prazo_inicio"
                      value="Até 15 dias"
                    />
                    <span class="optIndicator" aria-hidden="true"></span>
                    <span class="optText">Até 15 dias</span>
                  </label>
                  <label class="optionCard optionCheck" for="prazo_tempo03">
                    <input
                      type="radio"
                      id="prazo_tempo03"
                      name="prazo_inicio"
                      value="Até 30 dias"
                    />
                    <span class="optIndicator" aria-hidden="true"></span>
                    <span class="optText">Até 30 dias</span>
                  </label>
                  <label class="optionCard optionCheck" for="prazo_tempo04">
                    <input
                      type="radio"
                      id="prazo_tempo04"
                      name="prazo_inicio"
                      value="Até 60 dias"
                    />
                    <span class="optIndicator" aria-hidden="true"></span>
                    <span class="optText">Até 60 dias</span>
                  </label>

                  <label class="optionCard optionCheck" for="prazo_tempo05">
                    <input
                      type="radio"
                      id="prazo_tempo05"
                      name="prazo_inicio"
                      value="Sem pressa / flexível"
                    />
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
                  aria-describedby="instaErr"
                />
                <span class="fieldError" id="instaErr" role="alert"></span>
              </div>

              <!-- Observações (opcional) -->
              <div class="fieldGroup" id="observacaoProjeto">
                <label class="fieldLabel" for="observacao"
                  >Detalhes adicionais</label
                >

                <textarea
                  id="observacao"
                  name="observacao"
                  class="field-input textareaLabel"
                  rows="3"
                  placeholder="Ex.: prioridade, referência ou informação importante"
                  aria-describedby="obsErr"
                ></textarea>

                <span class="fieldError" id="obsErr" role="alert"></span>
              </div>

              <!-- Global error -->
              <div
                class="global-error"
                id="globalErr"
                role="alert"
                aria-live="polite"
                hidden=""
              ></div>

              <!-- Botões de navegação -->
              <div class="form-nav navSplit">
                <button type="button" class="btn-secondary" id="btnBackStep2">
                  Voltar
                </button>
                <button
                  type="button"
                  class="btn-primary btn-submit"
                  id="btnNextStep2"
                >
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
              aria-hidden="true"
            >
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
                hidden
              ></div>

              <!-- Navigation -->
              <div class="form-nav navSplit">
                <button type="button" class="btn-secondary" id="btnBackStep3">
                  Voltar
                </button>

                <!-- AGORA SIM: envio final -->
                <button
                  type="submit"
                  class="btn-primary btn-submit"
                  id="btnFinalSubmit"
                >
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
            aria-hidden="true"
          >
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
  <p>© 2026 Daiane Ferreira</p>
     | <p>Todos os Direitos Reservados</p>
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
    <script src="/script.js"></script>
    <script src="/main.js" defer></script>
  </body>
</html>