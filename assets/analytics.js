(() => {
  const id = 'G-1G0ST76WVM';
  const hosts = ['daianedesigner.com.br', 'www.daianedesigner.com.br'];
  if (location.protocol !== 'https:' || !hosts.includes(location.hostname)) return;
  if (window.daianeAnalyticsInitialized) return;
  window.daianeAnalyticsInitialized = true;

  const storageKey = 'daiane-analytics-consent';
  const disableKey = 'ga-disable-' + id;
  let consent;
  let tagLoaded = false;
  const clarityId = 'zgcofz2ds1';
  let clarityLoaded = false;
  let clarityStopped = false;
  try {
    consent = localStorage.getItem(storageKey);
  } catch {
    consent = null;
  }

  function enableClarity() {
    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    if (clarityStopped) {
      window.clarity('start', { projectId: clarityId });
      clarityStopped = false;
    }
    window.clarity('consentv2', { analytics_Storage: 'granted', ad_Storage: 'denied' });
    if (clarityLoaded) return;
    clarityLoaded = true;
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.clarity.ms/tag/' + clarityId;
    document.head.append(tag);
  }

  function enableAnalytics() {
    enableClarity();
    window[disableKey] = false;
    if (tagLoaded) return;

    tagLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', id, { allow_google_signals: false, allow_ad_personalization_signals: false });

    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(tag);
  }

  function setConsent(value) {
    consent = value;
    try {
      localStorage.setItem(storageKey, value);
    } catch {
      // Mantém a escolha para a página atual quando o armazenamento está bloqueado.
    }

    if (value === 'accepted') {
      enableAnalytics();
      return;
    }

    window[disableKey] = true;
    if (tagLoaded) window.gtag('consent', 'update', { analytics_storage: 'denied' });
    if (clarityLoaded) {
      window.clarity('consentv2', { analytics_Storage: 'denied', ad_Storage: 'denied' });
      window.clarity('stop');
      clarityStopped = true;
    }
    for (const name of ['_ga', '_ga_' + id.slice(2), '_clck', '_clsk']) {
      document.cookie = name + '=; Max-Age=0; Path=/; Secure';
      document.cookie = name + '=; Max-Age=0; Path=/; Domain=daianedesigner.com.br; Secure';
    }
  }

  function track(event, parameters) {
    if (consent === 'accepted' && tagLoaded) window.gtag('event', event, parameters);
  }

  window.registrarLeadDaiane = tipo => {
    if (tipo === 'orcamento' || tipo === 'analise_gratuita') {
      track('generate_lead', { tipo_formulario: tipo });
    }
  };

  document.addEventListener('click', event => {
    // Sem consentimento, nao consultar o DOM nem preparar eventos descartados.
    if (consent !== 'accepted' || !tagLoaded) return;
    const control = event.target instanceof Element
      ? event.target.closest('a, button, summary, [role="button"], [data-preview-project], [data-preview-close]')
      : null;
    if (!control || control.closest('#analytics-cookies, .analytics-preferencias')
      || control.matches(':disabled, [aria-disabled="true"]')) return;

    const section = control.closest('section[id], header, footer, nav, form, [id]');
    const position = control.dataset.posicaoOrcamento
      || (control.classList.contains('whatsappFloat') ? 'flutuante' : '')
      || section?.id || section?.tagName.toLowerCase() || 'pagina';
    // Identificadores da interface: não coletar campos, mensagens ou URLs com parâmetros.
    const controlId = control.id || control.dataset.previewProject || control.dataset.previewDevice
      || Array.from(control.classList).find(name => !['active', 'is-active', 'ativo'].includes(name))
      || control.tagName.toLowerCase();
    const parameters = {
      posicao_botao: position.slice(0, 100),
      identificador_elemento: controlId.slice(0, 100)
    };
    let name = 'clique_interface';
    let url;
    if (control.matches('a[href]')) {
      try { url = new URL(control.getAttribute('href'), location.href); } catch { /* Link sem URL válida. */ }
    }

    if (control.dataset.posicaoOrcamento || (url && hosts.includes(url.hostname)
      && /^\/orcamento(?:\.php)?\/?$/.test(url.pathname))) {
      name = 'clique_orcamento';
      if (control.dataset.servicoOrcamento) parameters.servico = control.dataset.servicoOrcamento;
    } else if (url && ['wa.me', 'api.whatsapp.com', 'web.whatsapp.com'].includes(url.hostname)) {
      name = 'clique_whatsapp';
    } else if (url?.protocol === 'mailto:') {
      name = 'clique_email';
    } else if (url?.protocol === 'tel:') {
      name = 'clique_telefone';
    } else if (url && /(^|\.)(instagram\.com|linkedin\.com|behance\.net|github\.com)$/.test(url.hostname)) {
      name = 'clique_rede_social';
      parameters.rede_social = url.hostname.replace(/^www\./, '').split('.')[0];
    } else if (control.hasAttribute('data-preview-project')) {
      name = 'abrir_portfolio';
      parameters.projeto = control.dataset.previewProject;
    } else if (url) {
      name = 'clique_navegacao';
      // Destinos internos estáticos, sem query strings nem dados de contato.
      parameters.destino = hosts.includes(url.hostname) ? (url.pathname + url.hash).slice(0, 100) : url.hostname;
    }
    track(name, parameters);
  }, { capture: true });

  if (consent === 'accepted') enableAnalytics();

  const preferences = document.querySelector('footer .linksLegaisFooter');
  if (!preferences) return;

  const settings = document.createElement('button');
  settings.type = 'button';
  settings.className = 'analytics-preferencias';
  settings.textContent = 'Preferências de cookies';
  settings.setAttribute('aria-controls', 'analytics-cookies');
  settings.setAttribute('aria-expanded', 'false');
  preferences.append(settings);

  const banner = document.createElement('aside');
  banner.id = 'analytics-cookies';
  banner.setAttribute('aria-label', 'Preferências de cookies');
  banner.hidden = true;
  banner.dataset.view = 'summary';
  banner.innerHTML = '<div class="cookies-resumo">'
    + '<span class="cookies-descricao">Este site usa cookies de medição com sua autorização. '
    + '<a href="/politica-de-cookies" target="_blank" rel="noopener noreferrer">Saiba mais</a>.</span>'
    + '<div class="cookies-acoes"><button type="button" data-consent="accepted">Aceitar</button>'
    + '<button type="button" data-consent="rejected">Recusar</button>'
    + '<button type="button" data-open-preferences>Preferências</button></div></div>'
    + '<div class="cookies-detalhes" hidden>'
    + '<button type="button" class="cookies-fechar" data-close-preferences aria-label="Fechar preferências de cookies">'
    + '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>'
    + '<p>Preferências de cookies</p>'
    + '<span class="cookies-descricao">Escolha se deseja permitir a medição. Você pode mudar sua escolha a qualquer momento pelo rodapé.</span>'
    + '<div class="cookies-categoria"><div class="cookies-categoria-topo"><strong>Necessários</strong>'
    + '<span class="cookies-status">Sempre ativos</span></div>'
    + '<span class="cookies-descricao">Mantêm os formulários protegidos e guardam sua escolha sobre cookies.</span></div>'
    + '<div class="cookies-categoria"><label class="cookies-opcao" for="cookies-analise"><strong>Medição</strong>'
    + '<input type="checkbox" id="cookies-analise" aria-describedby="cookies-medicao-descricao"></label>'
    + '<span class="cookies-descricao" id="cookies-medicao-descricao">O Google Analytics mede visitas, cliques e pedidos enviados. O Microsoft Clarity ajuda a entender a navegação com mapas de calor e gravações de sessão, com os dados dos formulários mascarados.</span></div>'
    + '<span class="cookies-descricao cookies-nota">Veja os detalhes na <a href="/politica-de-cookies" target="_blank" rel="noopener noreferrer">Política de Cookies</a> e na '
    + '<a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>.</span>'
    + '<div class="cookies-acoes"><button type="button" data-consent="rejected">Recusar tudo</button>'
    + '<button type="button" data-save-preferences>Salvar escolhas</button></div></div>';
  document.body.append(banner);

  function updateSaveLabel() {
    banner.querySelector('[data-save-preferences]').textContent = 'Salvar escolhas';
  }
  banner.querySelector('#cookies-analise').addEventListener('change', updateSaveLabel);

  function showPreferences(visible, detailed = true) {
    if (visible) banner.querySelector('#cookies-analise').checked = consent === 'accepted'
      || !['rejected', 'dismissed'].includes(consent);
    if (visible) updateSaveLabel();
    banner.hidden = !visible;
    banner.dataset.view = detailed ? 'details' : 'summary';
    banner.querySelector('.cookies-resumo').hidden = detailed;
    banner.querySelector('.cookies-detalhes').hidden = !detailed;
    settings.setAttribute('aria-expanded', String(visible));
  }

  settings.addEventListener('click', () => {
    showPreferences(banner.hidden);
    if (!banner.hidden) banner.querySelector('[data-close-preferences]').focus();
  });

  function closePreferences() {
    // Fechar não autoriza medição nem altera uma escolha já guardada.
    if (!['accepted', 'rejected', 'dismissed'].includes(consent)) setConsent('dismissed');
    showPreferences(false);
    if (settings.getBoundingClientRect().top < innerHeight) settings.focus({ preventScroll: true });
  }

  banner.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closePreferences();
    }
  });

  banner.addEventListener('click', event => {
    const button = event.target.closest('button[data-consent], button[data-save-preferences], button[data-close-preferences], button[data-open-preferences]');
    if (!button) return;
    if (button.hasAttribute('data-open-preferences')) {
      showPreferences(true);
      banner.querySelector('[data-close-preferences]').focus();
      return;
    }
    if (button.hasAttribute('data-close-preferences')) {
      closePreferences();
      return;
    }

    const choice = button.hasAttribute('data-save-preferences')
      ? (banner.querySelector('#cookies-analise').checked ? 'accepted' : 'rejected')
      : button.dataset.consent;
    setConsent(choice);
    showPreferences(false);
    if (settings.getBoundingClientRect().top < innerHeight) settings.focus({ preventScroll: true });
  });

  showPreferences(!['accepted', 'rejected', 'dismissed'].includes(consent), false);
})();
