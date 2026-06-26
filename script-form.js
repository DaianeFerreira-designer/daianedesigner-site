/* ========= CONFIG (ajuste os endpoints se precisar) ========= */
const DEFAULT_DRAFT_ENDPOINT = "salvar-rascunho.php";
const DEFAULT_FINAL_ENDPOINT = "enviar-orcamento.php"; // envio final (e-mail + banco)

/* ========= HELPERS ========= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function setHidden(el, isHidden) {
  if (!el) return;
  el.classList.toggle("stepHidden", isHidden);
  el.setAttribute("aria-hidden", isHidden ? "true" : "false");
}

function setDisabledWithin(container, disabled) {
  if (!container) return;
  const controls = $$("input, select, textarea", container);
  controls.forEach((c) => (c.disabled = disabled));
}

function setBtnLoading(btn, isLoading) {
  if (!btn) return;
  const label = btn.querySelector(".btn-label");
  const spinner = btn.querySelector(".btn-spinner");

  btn.disabled = isLoading;
  if (label) label.hidden = isLoading;
  if (spinner) spinner.hidden = !isLoading;
}

function getCheckedValue(name) {
  const el = document.querySelector(`input[name="${CSS.escape(name)}"]:checked`);
  return el ? el.value : "";
}

function getCheckedList(name) {
  return $$(`input[name="${CSS.escape(name)}"]:checked`).map((el) => el.value);
}

/* ========= STEPS / PROGRESS UI ========= */
function updateProgressUI(step) {
  // step: 1..3
  const progressBar = document.getElementById("progressBar");
  const pf1 = document.getElementById("pf1");
  const pf2 = document.getElementById("pf2");
  const pf3 = document.getElementById("pf3");

  const items = $$(".progressoWrap .pItem");
  items.forEach((it) => it.removeAttribute("aria-current"));
  if (items[step - 1]) items[step - 1].setAttribute("aria-current", "step");

  // fills (segmentado)
  if (pf1) pf1.style.width = step >= 1 ? "100%" : "0%";
  if (pf2) pf2.style.width = step >= 2 ? "100%" : "0%";
  if (pf3) pf3.style.width = step >= 3 ? "100%" : "0%";

  // aria-valuenow (numérico)
  if (progressBar) {
    const now = step === 1 ? 33 : step === 2 ? 66 : 100;
    progressBar.setAttribute("aria-valuenow", String(now));
  }

  // sidebar cards (se existirem)
  const stepCard1 = document.getElementById("stepCard1");
  const stepCard2 = document.getElementById("stepCard2");
  const stepCard3 = document.getElementById("stepCard3");
  [stepCard1, stepCard2, stepCard3].forEach((c) => c && c.classList.remove("stepActive"));
  if (step === 1 && stepCard1) stepCard1.classList.add("stepActive");
  if (step === 2 && stepCard2) stepCard2.classList.add("stepActive");
  if (step === 3 && stepCard3) stepCard3.classList.add("stepActive");
}

function showStep(step) {
  const s1 = document.getElementById("formsStep1");
  const s2 = document.getElementById("formsStep2");
  const s3 = document.getElementById("formsStep3");

  // Esconde todos
  setHidden(s1, true);
  setHidden(s2, true);
  setHidden(s3, true);

  // Desabilita inputs dos steps ocultos (pra não validar antes da hora)
  setDisabledWithin(s1, true);
  setDisabledWithin(s2, true);
  setDisabledWithin(s3, true);

  // Mostra o step atual
  const current = step === 1 ? s1 : step === 2 ? s2 : s3;
  setHidden(current, false);

  // Habilitação:
  // - step 1: só step1
  // - step 2: step1 + step2 (pra mandar rascunho completo)
  // - step 3: tudo (pra submit final incluir todos os campos)
  if (step === 1) setDisabledWithin(s1, false);
  if (step === 2) {
    setDisabledWithin(s1, false);
    setDisabledWithin(s2, false);
  }
  if (step === 3) {
    setDisabledWithin(s1, false);
    setDisabledWithin(s2, false);
    setDisabledWithin(s3, false);
  }

  updateProgressUI(step);

  // Re-sincroniza condicionais (porque habilita/desabilita inputs)
  syncSiteLink();
  syncOutroProjeto();
}

/* ========= CONDICIONAIS ========= */
function syncSiteLink() {
  const radioSim = document.getElementById("site_sim");
  const group = document.getElementById("siteLinkGroup");
  const input = document.getElementById("siteLink");
  const err = document.getElementById("siteLinkErr");

  if (!radioSim || !group || !input) return;

  const show = !!radioSim.checked;

  setHidden(group, !show);
  input.required = show;
  input.disabled = !show;

  if (!show) {
    input.value = "";
    if (err) err.textContent = "";
  }
}

function syncOutroProjeto() {
  const chk = document.getElementById("pj_outro");
  const group = document.getElementById("outroProjetoGroup");
  const txt = document.getElementById("outroProjetoTxt");
  const err = document.getElementById("outroProjetoErr");

  if (!chk || !group || !txt) return;

  const show = !!chk.checked;

  setHidden(group, !show);
  txt.required = show;
  txt.disabled = !show;

  if (!show) {
    txt.value = "";
    if (err) err.textContent = "";
  }
}

/* ========= VALIDAÇÕES ESPECÍFICAS ========= */
function validateTipoProjeto() {
  const checks = $$('input[name="tipo_projeto[]"]');
  const tipoErr = document.getElementById("tipoErr");
  if (!checks.length) return true;

  const ok = checks.some((c) => c.checked);

  // Integra com reportValidity()
  checks[0].setCustomValidity(ok ? "" : "Selecione pelo menos um tipo de projeto.");
  if (tipoErr) tipoErr.textContent = ok ? "" : "Selecione pelo menos um tipo de projeto.";

  return ok;
}

/* ========= REVIEW (STEP 3) ========= */
function fillReview() {
  const nome = document.getElementById("nome")?.value?.trim() || "—";
  const whatsapp = document.getElementById("phone")?.value?.trim() || "—";
  const email = document.getElementById("email")?.value?.trim() || "—";
  const empresa = document.getElementById("empresaOpcional")?.value?.trim() || "—";

  const presenca = getCheckedValue("presenca_site") || "—";
  const siteLink = document.getElementById("siteLink")?.value?.trim() || "";

  const tipos = getCheckedList("tipo_projeto[]");
  const outroTxt = document.getElementById("outroProjetoTxt")?.value?.trim() || "";
  const outroChecked = document.getElementById("pj_outro")?.checked;

  const insta = document.getElementById("insta")?.value?.trim() || "—";
  const orc = getCheckedValue("investimento_estimado") || "—";
  const prazo = getCheckedValue("prazo_inicio") || "—";
  const obs = document.getElementById("observacao")?.value?.trim() || "—";

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set("rv_nome", nome);
  set("rv_whatsapp", whatsapp);
  set("rv_email", email);
  set("rv_empresa", empresa);

  set("rv_presenca_site", presenca);

  const rowSite = document.getElementById("rv_siteLinkRow");
  if (rowSite) {
    const show = presenca.startsWith("Sim") && !!siteLink;
    rowSite.hidden = !show;
    set("rv_site_link", show ? siteLink : "—");
  }

  set("rv_tipo_projeto", tipos.length ? tipos.join(", ") : "—");

  const rowOutro = document.getElementById("rv_outroProjetoRow");
  if (rowOutro) {
    const show = !!outroChecked && !!outroTxt;
    rowOutro.hidden = !show;
    set("rv_outro_projeto", show ? outroTxt : "—");
  }

  set("rv_insta", insta);
  set("rv_orcamento", orc);
  set("rv_prazo", prazo);
  set("rv_obs", obs);
}

/* ========= SUBMISSÕES (RASCUNHO / FINAL) ========= */
async function postForm(form, endpoint) {
  const fd = new FormData(form);
  const res = await fetch(endpoint, { method: "POST", body: fd });

  // tenta JSON; se não for, cai pra texto
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return { ok: res.ok, ...(await res.json()) };

  const text = await res.text();
  return { ok: res.ok, text };
}

function showSuccessAndHideForm() {
  const form = document.getElementById("formsOrcamento");
  const success = document.getElementById("formSuccess");

  if (form) form.hidden = true;
  if (success) {
    success.classList.remove("stepHidden");
    success.setAttribute("aria-hidden", "false");
  }

  // opcional: marca progress como 100%
  updateProgressUI(3);
}

/* ========= INIT ========= */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formsOrcamento");

  const btnNext1 = document.getElementById("btnNextStep1");
  const btnBack2 = document.getElementById("btnBackStep2");
  const btnNext2 = document.getElementById("btnNextStep2");
  const btnBack3 = document.getElementById("btnBackStep3");

  const radioSim = document.getElementById("site_sim");
  const radioNao = document.getElementById("site_nao");
  const chkOutro = document.getElementById("pj_outro");
  const tipoChecks = $$('input[name="tipo_projeto[]"]');

  const stage = document.getElementById("stage");
  const draftId = document.getElementById("draft_id");

  // endpoints por data-attribute, se você quiser setar no HTML:
  // <form ... data-endpoint-draft="..." data-endpoint-final="...">
  const draftEndpoint = form?.dataset?.endpointDraft || DEFAULT_DRAFT_ENDPOINT;
  const finalEndpoint = form?.dataset?.endpointFinal || DEFAULT_FINAL_ENDPOINT;

  // Estado inicial
  showStep(1);

  // Condicionais
  radioSim?.addEventListener("change", syncSiteLink);
  radioNao?.addEventListener("change", syncSiteLink);
  chkOutro?.addEventListener("change", syncOutroProjeto);

  // Checkbox group (1+ obrigatório)
  tipoChecks.forEach((c) => c.addEventListener("change", validateTipoProjeto));
  validateTipoProjeto();

 // Navegação Step 1 -> salvar rascunho + Step 2
btnNext1?.addEventListener("click", async () => {
  const ok = form.reportValidity();
  if (!ok) return;

  if (stage) stage.value = "draft";
  setBtnLoading(btnNext1, true);

  const globalErr1 = document.getElementById("globalErr1");
  if (globalErr1) {
    globalErr1.hidden = true;
    globalErr1.textContent = "";
  }

  try {
    const data = await postForm(form, draftEndpoint);

    if (!data.ok) {
      if (globalErr1) {
        globalErr1.hidden = false;
        globalErr1.textContent = "Não consegui salvar o rascunho. Tente novamente.";
      }
      return;
    }

    // Se backend devolver draft_id em JSON: { ok:true, draft_id:123 }
    if (data.draft_id && draftId) draftId.value = String(data.draft_id);

    showStep(2);
  } finally {
    setBtnLoading(btnNext1, false);
  }
});

  // Voltar Step 2 -> Step 1
  btnBack2?.addEventListener("click", () => showStep(1));

  // Step 2 -> salvar rascunho + Step 3
  btnNext2?.addEventListener("click", async () => {
    // valida step2 + regra do tipo projeto
    const okTipo = validateTipoProjeto();
    const ok = form.reportValidity();
    if (!ok || !okTipo) return;

    if (stage) stage.value = "draft";
    setBtnLoading(btnNext2, true);

    try {
      const data = await postForm(form, draftEndpoint);

      if (!data.ok) {
        const globalErr = document.getElementById("globalErr");
        if (globalErr) {
          globalErr.hidden = false;
          globalErr.textContent = "Não consegui salvar o rascunho. Tente novamente.";
        }
        return;
      }

      // Se backend devolver draft_id em JSON: { ok:true, draft_id:123 }
      if (data.draft_id && draftId) draftId.value = String(data.draft_id);

      fillReview();
      showStep(3);
    } finally {
      setBtnLoading(btnNext2, false);
    }
  });

  // Voltar Step 3 -> Step 2
  btnBack3?.addEventListener("click", () => showStep(2));

  // Submit FINAL (envia e substitui pelo bloco de sucesso)
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // garante que tudo que importa esteja habilitado pro FormData
    setDisabledWithin(document.getElementById("formsStep1"), false);
    setDisabledWithin(document.getElementById("formsStep2"), false);
    syncSiteLink();
    syncOutroProjeto();

    const okTipo = validateTipoProjeto();
    const ok = form.reportValidity();
    if (!ok || !okTipo) return;

    if (stage) stage.value = "final";

    const btnFinal = document.getElementById("btnFinalSubmit");
    setBtnLoading(btnFinal, true);

    try {
      const data = await postForm(form, finalEndpoint);

      if (!data.ok) {
        const globalErr3 = document.getElementById("globalErr3");
        if (globalErr3) {
          globalErr3.hidden = false;
          globalErr3.textContent = "Não consegui enviar sua solicitação. Tente novamente.";
        }
        return;
      }

      // sucesso: some o form e mostra mensagem no mesmo lugar
      showSuccessAndHideForm();
    } finally {
      setBtnLoading(btnFinal, false);
    }
  });
});

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