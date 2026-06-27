'use strict';

/* ═══════════════════════════════════════════════
            Formulário em várias etapas
   ════════════════════════════════════════════ */

/* ── DOM refs ──────────────────────────────── */
const form       = document.getElementById('formsOrcamento');
const step1      = document.getElementById('formsStep1');
const step2      = document.getElementById('formsStep2');
const stepCard1  = document.getElementById('stepCard1');
const stepCard2  = document.getElementById('stepCard2');
const stepCard3  = document.getElementById('stepCard3');
const pf1        = document.getElementById('pf1');
const pf2        = document.getElementById('pf2');
const pf3        = document.getElementById('pf3');
const progressEl = document.getElementById('progressBar');
const step3 = document.getElementById('formsStep3');
const rightPanel = document.getElementById('containerPrincipal');
const formSuccess = document.getElementById('formSuccess');


/* ── State ─────────────────────────────────── */
let currentStep = 1;
let itiInstance = null;
const filled    = new Set();

/* ── cálculo do progresso ───────────── */
const S1_KEYS = ['nome', 'phone', 'email'];
const S2_KEYS = ['presenca_site','tipo_projeto','investimento_estimado',
                 'prazo_inicio'];

/* ════════════════════════════════════════════
   BOOT
   ═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initPhoneInput();
  initTextFields();
  initChoiceFields();
  initNavigation();
  preSelecionarProjetoPorURL();
});

/* ════════════════════════════════════════════
   Telefone com DDI
   ═══════════════════════════════════════════ */
function initPhoneInput() {
  const phoneEl = document.getElementById('phone');
  if (!phoneEl || typeof window.intlTelInput === 'undefined') return;

  itiInstance = window.intlTelInput(phoneEl, {
    initialCountry:       'br',
    preferredCountries:   ['br', 'pt', 'us', 'ar'],
    separateDialCode:     true,
    
    nationalMode:         false,
    formatOnDisplay:      true,
    showSelectedDialCode: true,
    utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.7/build/js/utils.js',
  });

  /* Preenchimento do progresso */
  phoneEl.addEventListener('input', () => {
    const num = itiInstance.getNumber();
    if (num && num.replace(/\D/g, '').length >= 7) {
      filled.add('phone');
    } else {
      filled.delete('phone');
    }
    updateProgress();
  });

  /* Detecção automática do país */
  phoneEl.addEventListener('countrychange', () => {
    filled.delete('phone');
    updateProgress();
  });
}

/* ════════════════════════════════════════════
   Progresso
   ═══════════════════════════════════════════ */
function initTextFields() {
  const map = [
    { id: 'nome',           key: 'nome',      min: 3  },
    { id: 'phone',  key: 'phone',     min: 10 },
    { id: 'email', key: 'email', min: 3  },
   
   
  ];

  map.forEach(({ id, key, min }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      el.value.trim().length >= min
        ? filled.add(key)
        : filled.delete(key);
      updateProgress();
    });
  });
}

function initChoiceFields() {
  /* Single-choice radio groups */
  S2_KEYS.filter(k => k !== 'tipo_projeto').forEach(name => {
    document.querySelectorAll(`input[name="${name}"]`).forEach(inp => {
      inp.addEventListener('change', () => {
        filled.add(name);
        updateProgress();
      });
    });
  });

  /* Multi-choice checkboxes */
  document.querySelectorAll('input[name="tipo_projeto[]"]').forEach(inp => {
    inp.addEventListener('change', () => {
      const any = document.querySelector('input[name="tipo_projeto[]"]:checked');
      any ? filled.add('tipo_projeto') : filled.delete('tipo_projeto');
      updateProgress();
    });
  });

  // ─────────────────────────────────────────────
  // Campos condicionais: Site Link e Outro Projeto
  // ─────────────────────────────────────────────
  const siteLinkGroup = document.getElementById('siteLinkGroup');
  const siteLink      = document.getElementById('siteLink');
  const siteLinkErr   = document.getElementById('siteLinkErr');

  const outroGroup = document.getElementById('outroProjetoGroup');
  const outroTxt   = document.getElementById('outroProjetoTxt');
  const outroErr   = document.getElementById('outroProjetoErr');

  const refreshConditionals = () => {
    // Site: se marcou "Sim, já tenho um site"
    const presenca = document.querySelector('input[name="presenca_site"]:checked');
    const showSiteLink = presenca?.value === 'Sim, já tenho um site';

    toggleGroup(siteLinkGroup, showSiteLink);
    if (siteLink) siteLink.required = !!showSiteLink;

    if (!showSiteLink && siteLink) {
      siteLink.value = '';
      clearErr(siteLink, siteLinkErr);
    }

    // Projeto: se marcou "Outro"
    const outroChecked = !!document.querySelector('input[name="tipo_projeto[]"][value="Outro"]:checked');
    toggleGroup(outroGroup, outroChecked);
    if (outroTxt) outroTxt.required = !!outroChecked;

    if (!outroChecked && outroTxt) {
      outroTxt.value = '';
      clearErr(outroTxt, outroErr);
    }
  };

  document.querySelectorAll('input[name="presenca_site"]').forEach(inp =>
    inp.addEventListener('change', refreshConditionals)
  );

  document.querySelectorAll('input[name="tipo_projeto[]"]').forEach(inp =>
    inp.addEventListener('change', refreshConditionals)
  );

  // estado inicial
  refreshConditionals();

}

function updateProgress() {
  const s1Done = S1_KEYS.filter(k => filled.has(k)).length;
  const s2Done = S2_KEYS.filter(k => filled.has(k)).length;

  /* Segment 1: step 1 progress 0→100% */
  pf1.style.width = ((s1Done / S1_KEYS.length) * 100) + '%';

  /* Segment 2: step 2 progress 0→100% */
  pf2.style.width = ((s2Done / S2_KEYS.length) * 100) + '%';

  /* Segment 3: set only on submit success */

  const total = Math.round(
    ((s1Done + s2Done) / (S1_KEYS.length + S2_KEYS.length)) * 100
  );
  progressEl.setAttribute('aria-valuenow', total);
}

/* ════════════════════════════════════════════
   Navegação entre etapas
   ═══════════════════════════════════════════ */
function initNavigation() {
  document.getElementById('btnNextStep1')?.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!validateStep1()) return;

    const enviado = await enviarEtapa('rascunho', 'btnNextStep1', 'globalErr1');

    if (enviado) {
      transitionTo(2);
    }
  });

  document.getElementById('btnBackStep2')?.addEventListener('click', () => {
    transitionTo(1, true);
  });

  document.getElementById('btnNextStep2')?.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!validateStep2()) return;

    const enviado = await enviarEtapa('projeto_enviado', 'btnNextStep2', 'globalErr');

    if (enviado) {
      fillReviewStep3();
      transitionTo(3);
    }
  });

  document.getElementById('btnBackStep3')?.addEventListener('click', () => {
    transitionTo(2, true);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const enviado = await enviarEtapa('confirmado', 'btnFinalSubmit', 'globalErr3');

    if (enviado) {
      showInlineSuccess();
    }
  });
}


function transitionTo(stepNum, reverse = false) {
  currentStep = stepNum;

  // esconde tudo
  step1.classList.add('stepHidden');
  step2.classList.add('stepHidden');
  step3?.classList.add('stepHidden');

  step1.setAttribute('aria-hidden', 'true');
  step2.setAttribute('aria-hidden', 'true');
  step3?.setAttribute('aria-hidden', 'true');

  // mostra só o step alvo
  if (stepNum === 1) {
    step1.classList.remove('stepHidden');
    step1.setAttribute('aria-hidden', 'false');

    step1.classList.add('slide-back');
    step1.addEventListener('animationend', () => step1.classList.remove('slide-back'), { once: true });
    scrollPanelTop();
  }

  if (stepNum === 2) {
    step2.classList.remove('stepHidden');
    step2.setAttribute('aria-hidden', 'false');

    step2.style.animation = 'none';
    requestAnimationFrame(() => { step2.style.animation = ''; });
    scrollPanelTop();
  }

  if (stepNum === 3) {
  step3?.classList.remove('stepHidden');
  step3?.setAttribute('aria-hidden', 'false');

  // barra 100% no step 3 (visual)
  pf3.style.width = '100%';
  progressEl.setAttribute('aria-valuenow', '100');

  scrollPanelTop();
}
  updateStepCards(stepNum);
}

function scrollPanelTop() {
  if (rightPanel) rightPanel.scrollTo({ top: 0, behavior: 'smooth' });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepCards(active) {
  [[stepCard1, 1], [stepCard2, 2], [stepCard3, 3]].forEach(([card, n]) => {
    if (!card) return;
    card.classList.toggle('stepActive', n === active);
    card.classList.toggle('step-card--done',   n < active);
  });
}

 /* site  */
function toggleGroup(groupEl, show) {
  if (!groupEl) return;
  groupEl.classList.toggle('stepHidden', !show);
  groupEl.setAttribute('aria-hidden', show ? 'false' : 'true');
}

function normalizeUrlLoose(raw) {
  let v = (raw || '').trim();

  // tira espaços no meio (gente cola "site . com" às vezes)
  v = v.replace(/\s+/g, '');

  if (!v) return '';

  // se veio tipo "//meusite.com"
  if (v.startsWith('//')) v = 'https:' + v;

 // se não tem esquema, adiciona só pra validação/normalização
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(v)) {
    v = 'https://' + v;
  }

  return v;
}

function isValidUrlLoose(raw) {
  const v = normalizeUrlLoose(raw);
  if (!v) return false;

  try {
    const u = new URL(v);

    const host = u.hostname;

    // precisa ter domínio tipo "algo.com" (com pelo menos um ponto)
    if (!host || !host.includes('.')) return false;

    // evita "a..com" e coisas bizarras
    if (host.startsWith('.') || host.endsWith('.') || host.includes('..')) return false;

    return true;
  } catch {
    return false;
  }
}

function fillReviewStep3() {
  const nome    = document.getElementById('nome')?.value.trim() || '—';
  const email   = document.getElementById('email')?.value.trim() || '—';
  const empresa = document.getElementById('empresaOpcional')?.value.trim() || '—';
  const insta   = document.getElementById('insta')?.value.trim() || '—';
  const obs     = document.getElementById('observacao')?.value.trim() || '—';

  const presenca = document.querySelector('input[name="presenca_site"]:checked')?.value || '—';
  const orcamento = document.querySelector('input[name="investimento_estimado"]:checked')?.value || '—';
  const prazo = document.querySelector('input[name="prazo_inicio"]:checked')?.value || '—';

  // whatsapp
  let whatsapp = '—';
  const phoneEl = document.getElementById('phone');
  if (itiInstance && phoneEl) whatsapp = itiInstance.getNumber() || phoneEl.value.trim() || '—';
  else whatsapp = phoneEl?.value.trim() || '—';

  // tipo_projeto (checkbox)
  const tipos = Array.from(document.querySelectorAll('input[name="tipo_projeto[]"]:checked'))
    .map(i => i.value);
  const tipoTxt = tipos.length ? tipos.join(', ') : '—';

  const outroTxt = document.getElementById('outroProjetoTxt')?.value.trim() || '—';
  const siteLink = document.getElementById('siteLink')?.value.trim() || '—';

  // joga no review
  document.getElementById('rv_nome').textContent = nome;
  document.getElementById('rv_whatsapp').textContent = whatsapp;
  document.getElementById('rv_email').textContent = email;
  document.getElementById('rv_empresa').textContent = empresa;

  document.getElementById('rv_presenca_site').textContent = presenca;
  document.getElementById('rv_tipo_projeto').textContent = tipoTxt;
  document.getElementById('rv_insta').textContent = insta;
  document.getElementById('rv_orcamento').textContent = orcamento;
  document.getElementById('rv_prazo').textContent = prazo;
  document.getElementById('rv_obs').textContent = obs;

  // condicionais no review
  const siteRow = document.getElementById('rv_siteLinkRow');
  const outroRow = document.getElementById('rv_outroProjetoRow');

  const showSite = presenca === 'Sim, já tenho um site';
  siteRow.hidden = !showSite;
  if (showSite) document.getElementById('rv_site_link').textContent = siteLink;

  const showOutro = tipos.includes('Outro');
  outroRow.hidden = !showOutro;
  if (showOutro) document.getElementById('rv_outro_projeto').textContent = outroTxt;
}

async function enviarEtapa(stageValue, btnId, errorId) {
  const btn = document.getElementById(btnId);
  const globalEl = document.getElementById(errorId);

  const label = btn?.querySelector('.btn-label');
  const spinner = btn?.querySelector('.btn-spinner');

  if (btn) btn.disabled = true;
  if (label) label.hidden = true;
  if (spinner) spinner.hidden = false;
  if (globalEl) globalEl.hidden = true;

  const fd = new FormData(form);

  fd.set('stage', stageValue);

  if (itiInstance) {
    fd.set('whatsapp', itiInstance.getNumber());
  }

  try {
    const res = await fetch('/api/enviar-orcamento.php', {
      method: 'POST',
      body: fd,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const data = await res.json();

    if (!data.success) {
      showGlobalError(globalEl, data.message || 'Erro ao enviar. Tente novamente.');
      return false;
    }

    if (data.draft_id) {
      document.getElementById('draft_id').value = data.draft_id;
    }

    return true;

  } catch (error) {
    showGlobalError(globalEl, 'Erro de conexão. Tente novamente.');
    return false;

  } finally {
    if (btn) btn.disabled = false;
    if (label) label.hidden = false;
    if (spinner) spinner.hidden = true;
  }
}

/* ════════════════════════════════════════════
   Validação das etapas
   ═══════════════════════════════════════════ */
    /* Etapa 01 */
function validateStep1() {
  let ok = true;

  /* Nome */
  const nome    = document.getElementById('nome');
  const nomeErr = document.getElementById('nomeErr');
  const nomeVal = nome.value.trim();

  if (nomeVal.length < 3) {
    setErr(nome, nomeErr, 'Informe seu nome completo !');
    ok = false;
  } else if (!/[a-zA-ZÀ-ÿ]/.test(nomeVal)) {
    setErr(nome, nomeErr, 'Nome inválido. Use apenas letras.');
    ok = false;
  } else {
    clearErr(nome, nomeErr);
  }

  /* WhatsApp */
  const phoneEl  = document.getElementById('phone');
  const phoneErr = document.getElementById('phoneErr');

  if (itiInstance) {
    if (!itiInstance.isValidNumber()) {
      setErr(phoneEl, phoneErr, 'Informe um número de WhatsApp válido com DDD e país.');
      ok = false;
    } else {
      clearErr(phoneEl, phoneErr);
    }
  } else {
    const digits = phoneEl.value.replace(/\D/g, '');
    if (digits.length < 8) {
      setErr(phoneEl, phoneErr, 'Informe um número de WhatsApp válido.');
      ok = false;
    } else {
      clearErr(phoneEl, phoneErr);
    }
  }

  /* E-mail */
  const email    = document.getElementById('email');
  const emailErr = document.getElementById('emailErr');

  if (email.value.trim().length < 10) {
    setErr(email, emailErr, 'Informe um e-mail válido');
    ok = false;
  } else {
    clearErr(email, emailErr);
  }

  /* Aceite/privacidade */
  const aceitePrivacidade    = document.querySelector('input[name="aceitePrivacidade"]:checked');
  const privErr = document.getElementById('privErr');
  if (!aceitePrivacidade) {
    showErr(privErr, 'Confirme o aceite da Política de Privacidade para continuar.');
    ok = false;
  } else {
    hideErr(privErr);
  }

  if (!ok) focusFirstError(step1);
  return ok;
}

  /* Etapa 02 */
function validateStep2() {
  let ok = true;

  /* Site */
  const presenca_site    = document.querySelector('input[name="presenca_site"]:checked');
  const showSiteLink = presenca_site?.value === 'Sim, já tenho um site';
  const siteErr = document.getElementById('siteErr');
  if (!presenca_site) {
    showErr(siteErr, 'Selecione uma opção.');
    ok = false;
  } else {
    hideErr(siteErr);
  }

  /* Link do site (condicional: só se marcou "Sim") */
  const siteLink    = document.getElementById('siteLink');
  const siteLinkErr = document.getElementById('siteLinkErr');

 if (showSiteLink) {
  const v = (siteLink?.value || '').trim();

  if (!siteLink) {
    ok = false; // segurança
  } else if (!v) {
    setErr(siteLink, siteLinkErr, 'Informe o link do seu site.');
    ok = false;
  } else if (!isValidUrlLoose(v)) {
    setErr(siteLink, siteLinkErr, 'Informe um link válido (site.com.br).');
    ok = false;
  } else {
    clearErr(siteLink, siteLinkErr);
  }
} else if (siteLink) {
  clearErr(siteLink, siteLinkErr);
}

  /* Qual tipo de projeto */
  const tipo    = document.querySelector('input[name="tipo_projeto[]"]:checked');
  const tipoErr = document.getElementById('tipoErr');
  if (!tipo) {
    showErr(tipoErr, 'Selecione pelo menos uma opção.');
    ok = false;
  } else {
    hideErr(tipoErr);
  }

// Outro projeto (condicional)
  const outroChecked = !!document.querySelector('input[name="tipo_projeto[]"][value="Outro"]:checked');
  const outroTxt = document.getElementById('outroProjetoTxt');
  const outroErr = document.getElementById('outroProjetoErr');

  if (outroChecked) {
    const v = (outroTxt?.value || '').trim();
    if (v.length < 5) {
      setErr(outroTxt, outroErr, 'Descreva qual outro projeto você precisa.');
      ok = false;
    } else {
      clearErr(outroTxt, outroErr);
    }
  } else if (outroTxt) {
    clearErr(outroTxt, outroErr);
  }

  /* Faixa de orçamento */
  const investimento_estimado    = document.querySelector('input[name="investimento_estimado"]:checked');
  const valorErr = document.getElementById('valorErr');
  if (!investimento_estimado) {
    showErr(valorErr, 'Selecione uma opção.');
    ok = false;
  } else {
    hideErr(valorErr);
  }

  /* Prazo desejado */
  const prazo_inicio    = document.querySelector('input[name="prazo_inicio"]:checked');
  const prazoErr = document.getElementById('prazoErr');
  if (!prazo_inicio) {
    showErr(prazoErr, 'Selecione uma opção.');
    ok = false;
  } else {
    hideErr(prazoErr);
  }

  if (!ok) focusFirstError(step2);
  return ok;
}

/* Erros */
function setErr(input, errEl, msg) {
  input.classList.add('field-input--error');
  showErr(errEl, msg);
}

function clearErr(input, errEl) {
  input.classList.remove('field-input--error');
  hideErr(errEl);
}

function showErr(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.classList.add('visible');
}

function hideErr(el) {
  if (!el) return;
  el.textContent = '';
  el.classList.remove('visible');
}

function focusFirstError(container) {
  const firstErrInput = container.querySelector('.field-input--error, input.iti__tel-input.field-input--error');
  if (firstErrInput) {
    firstErrInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstErrInput.focus();
    return;
  }
  const firstErrMsg = container.querySelector('.field-error.visible');
  if (firstErrMsg) firstErrMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


function showGlobalError(el, msg) {
  el.textContent = msg;
  el.hidden      = false;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


function showInlineSuccess() {
  // Completa a barra de progresso
  pf3.style.width = '100%';
  progressEl.setAttribute('aria-valuenow', '100');
  updateStepCards(3);

  // esconde as etapas
  step1?.classList.add('stepHidden');
  step2?.classList.add('stepHidden');
  step3?.classList.add('stepHidden');

  step1?.setAttribute('aria-hidden', 'true');
  step2?.setAttribute('aria-hidden', 'true');
  step3?.setAttribute('aria-hidden', 'true');

  // esconde o form inteiro
  form?.classList.add('stepHidden');
  form?.setAttribute('aria-hidden', 'true');

  // mostra o sucesso
  formSuccess?.classList.remove('stepHidden');
  formSuccess?.setAttribute('aria-hidden', 'false');

  scrollPanelTop();
}

function preSelecionarProjetoPorURL() {
  const projeto = new URLSearchParams(window.location.search).get('projeto');

  if (!projeto) return;

  const mapa = {
    'site-institucional': 'pj_siteinstitucional',
    'landing-page': 'pj_lp',
    'loja-virtual': 'pj_lojavirtual',
    'pagina-captura': 'pj_captura',
    'area-membros': 'pj_membros',
    'seo-performance': 'pj_seo'
  };

  const id = mapa[projeto];

  if (!id) return;

  const checkbox = document.getElementById(id);

  if (checkbox) {
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
  }
}