(function() {
  'use strict';

  var SUPABASE_URL = 'https://hlpudkddsvhfngluqmkq.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhscHVka2Rkc3ZoZm5nbHVxbWtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMzMwNjYsImV4cCI6MjA4NjYwOTA2Nn0.dUQgXSDygDhUYsdzb-y1qpHXhzRBjF54vxoTt21E5Mo';
  var API = SUPABASE_URL + '/rest/v1';

  function showToast(msg, ok) {
    var el = document.getElementById('nebula-toast');
    if (el) el.remove();
    el = document.createElement('div');
    el.id = 'nebula-toast';
    el.textContent = msg;
    el.style.cssText = 'position:fixed;bottom:24px;right:24px;padding:16px 28px;border-radius:12px;font-size:15px;font-weight:700;z-index:99999;color:#fff;font-family:system-ui;box-shadow:0 4px 24px rgba(0,0,0,.3);transition:opacity .5s;' + (ok ? 'background:#10b981;' : 'background:#ef4444;');
    document.body.appendChild(el);
    setTimeout(function() { el.style.opacity = '0'; }, 3000);
    setTimeout(function() { el.remove(); }, 3500);
  }

  function readSupabaseError(response) {
    return response.text().then(function(text) {
      var message = 'HTTP ' + response.status;
      if (!text) throw new Error(message);

      var detail = text;
      try {
        var body = JSON.parse(text);
        detail = body.message || body.error || body.details || body.hint || text;
      } catch (_) {}

      throw new Error(message + ' - ' + detail);
    });
  }

  function q(selectors) {
    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (el && el.textContent.trim()) return el.textContent.trim();
    }
    return '';
  }

  function detectRemote(loc, desc) {
    var text = (loc + ' ' + desc).toLowerCase();
    if (/\bremote\b/.test(text) && /\bhybrid\b/.test(text)) return 'hybrid';
    if (/\bfully\s+remote\b/.test(text) || /\bremoto\b/.test(text)) return 'remote';
    if (/\bremote\b/.test(text)) return 'remote';
    if (/\bhybrid\b/.test(text) || /\bh.brido\b/.test(text)) return 'hybrid';
    if (/\bon.?site\b/.test(text) || /\bpresencial\b/.test(text)) return 'onsite';
    return 'unknown';
  }

  function cleanUrl() {
    var m = window.location.href.match(/linkedin\.com\/jobs\/view\/(\d+)/);
    return m ? 'https://www.linkedin.com/jobs/view/' + m[1] + '/' : window.location.href.split('?')[0];
  }

  if (!/linkedin\.com\/jobs/.test(window.location.href)) {
    showToast('Abra uma vaga do LinkedIn primeiro!', false);
    return;
  }

  // Strategy 1: Parse document.title (most reliable)
  // LinkedIn titles: "Job Title - Company | LinkedIn" or "Company hiring Job Title in Location | LinkedIn"
  var title = '', company = '', location = '';
  var pageTitle = document.title.replace(/\s*\|\s*LinkedIn\s*$/, '').trim();

  // Pattern: "Company hiring: Job Title in Location"
  var hiringMatch = pageTitle.match(/^(.+?)\s+(?:is\s+)?hiring:?\s+(.+?)(?:\s+in\s+(.+))?$/i);
  if (hiringMatch) {
    company = hiringMatch[1].trim();
    title = hiringMatch[2].trim();
    location = (hiringMatch[3] || '').trim();
  }
  // Pattern: "Job Title - Company - Location"
  if (!title) {
    var dashParts = pageTitle.split(/\s*[-–—]\s*/);
    if (dashParts.length >= 2) {
      title = dashParts[0].trim();
      company = dashParts[1].trim();
      if (dashParts.length >= 3) location = dashParts[2].trim();
    }
  }
  // Pattern: "(number) Job Title - Company" (when there's a notification count)
  if (!title || /^\(\d+\)/.test(title)) {
    var cleaned = pageTitle.replace(/^\(\d+\)\s*/, '');
    var dp = cleaned.split(/\s*[-–—]\s*/);
    if (dp.length >= 2) {
      title = dp[0].trim();
      company = dp[1].trim();
    }
  }

  // Strategy 2: meta tags
  if (!title) {
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      var og = ogTitle.content.replace(/\s*\|\s*LinkedIn\s*$/, '').trim();
      var ogParts = og.split(/\s*[-–—]\s*/);
      if (ogParts.length >= 2) { title = ogParts[0].trim(); company = ogParts[1].trim(); }
      else title = og;
    }
  }

  // Strategy 3: DOM selectors as fallback
  if (!title) title = q([
    'h1.t-24', '.job-details-jobs-unified-top-card__job-title h1',
    '.job-details-jobs-unified-top-card__job-title', '.jobs-unified-top-card__job-title',
    '.top-card-layout__title', 'h1[class*="job"]', 'h1[class*="title"]', 'h1'
  ]);
  if (!company) company = q([
    '.job-details-jobs-unified-top-card__company-name a',
    '.job-details-jobs-unified-top-card__company-name',
    '.jobs-unified-top-card__company-name a', '.jobs-unified-top-card__company-name',
    '.topcard__org-name-link', 'a[class*="company"]',
    '.job-details-jobs-unified-top-card__primary-description-container a'
  ]);
  if (!location) location = q([
    '.job-details-jobs-unified-top-card__bullet', '.jobs-unified-top-card__bullet',
    '.top-card-layout__bullet', 'span[class*="location"]', 'span[class*="bullet"]'
  ]);

  // Description
  var descEl = document.querySelector('#job-details') ||
               document.querySelector('.jobs-description__content') ||
               document.querySelector('.jobs-box__html-content') ||
               document.querySelector('.description__text');
  var description = descEl ? descEl.innerText.trim() : '';

  // Fallback: manual prompt
  if (!title || !company) {
    var debug = 'Page title: ' + document.title;
    console.log('NEBULA DEBUG:', debug);
    var msg = prompt('Nao consegui extrair automaticamente.\n' + debug + '\n\nDigite: Titulo | Empresa');
    if (msg) {
      var parts = msg.split('|').map(function(s){ return s.trim(); });
      title = parts[0] || title;
      company = parts[1] || company;
    }
    if (!title || !company) { showToast('Titulo e empresa obrigatorios', false); return; }
  }

  var remote = detectRemote(location, description);
  var url = cleanUrl();

  var payload = {
    title: title.substring(0, 500),
    company: company.substring(0, 300),
    location: location.substring(0, 300) || null,
    remote: remote,
    description: description || null,
    url: url,
    source: 'linkedin',
    status: 'new',
    tier: 1,
    metadata: { added_via: 'bookmarklet', linkedin_url: url }
  };

  showToast('Salvando vaga...', true);

  fetch(API + '/job_listings?select=id&title=eq.' + encodeURIComponent(payload.title) + '&company=eq.' + encodeURIComponent(payload.company) + '&deleted_at=is.null', {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
  })
  .then(function(r) {
    if (!r.ok) return readSupabaseError(r);
    return r.json();
  })
  .then(function(existing) {
    if (existing && existing.length > 0) {
      showToast('Vaga ja existe no tracker!', false);
      return Promise.reject('duplicate');
    }
    return fetch(API + '/job_listings', {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });
  })
  .then(function(r) {
    if (!r) return;
    if (!r.ok) return readSupabaseError(r);
    return r.json();
  })
  .then(function(data) {
    if (!data) return;
    showToast('Vaga salva! ' + title + ' @ ' + company, true);
  })
  .catch(function(e) {
    if (e === 'duplicate') return;
    showToast('Erro: ' + e.message, false);
    console.error('Nebula bookmarklet error:', e);
  });

})();
