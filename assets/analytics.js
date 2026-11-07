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
  try {
    consent = localStorage.getItem(storageKey);
  } catch {
    consent = null;
  }

  function enableAnalytics() {
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
    for (const name of ['_ga', '_ga_' + id.slice(2)]) {
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
  banner.setAttribute('aria-label', 'Cookies de análise');
  banner.hidden = true;
  banner.innerHTML = '<p>Podemos usar cookies do Google Analytics para entender como o site é usado?</p>'
    + '<div><button type="button" data-consent="rejected">Recusar</button>'
    + '<button type="button" data-consent="accepted">Aceitar análise</button></div>';
  document.body.append(banner);

  function showPreferences(visible) {
    banner.hidden = !visible;
    settings.setAttribute('aria-expanded', String(visible));
  }

  settings.addEventListener('click', () => {
    showPreferences(banner.hidden);
    if (!banner.hidden) banner.querySelector('button').focus();
  });

  banner.addEventListener('click', event => {
    const button = event.target.closest('button[data-consent]');
    if (!button) return;

    setConsent(button.dataset.consent);
    showPreferences(false);
    if (settings.getBoundingClientRect().top < innerHeight) settings.focus({ preventScroll: true });
  });

  showPreferences(consent !== 'accepted' && consent !== 'rejected');
})();
