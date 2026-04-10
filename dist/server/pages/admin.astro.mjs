import { f as createComponent, r as renderTemplate, j as renderHead } from '../chunks/astro/server_CpMk5A2M.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const prerender = false;
const $$Admin = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Derby Strong \u2014 Admin Editor</title>', `</head> <body> <!-- Top bar --> <div class="admin-topbar"> <h1>Derby Strong</h1> <span class="badge">Admin</span> <div class="admin-topbar-actions"> <span class="admin-status" id="admin-status"></span> <button class="admin-save-btn" id="admin-save" type="button">Save Changes</button> </div> </div> <div class="admin-container" id="admin-root"> <div class="admin-loading" id="admin-loading">Loading configuration...</div> </div> <script>
  (function () {
    'use strict';

    var root      = document.getElementById('admin-root');
    var loading   = document.getElementById('admin-loading');
    var saveBtn   = document.getElementById('admin-save');
    var statusEl  = document.getElementById('admin-status');
    var config    = null;

    // \u2500\u2500 Load config \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    async function loadConfig() {
      try {
        var res = await fetch('/api/config');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        config = await res.json();
        renderEditor();
      } catch (err) {
        loading.textContent = 'Failed to load config: ' + err.message;
      }
    }

    // \u2500\u2500 Save config \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    async function saveConfig() {
      readFormIntoConfig();
      saveBtn.disabled = true;
      statusEl.textContent = 'Saving...';
      statusEl.dataset.type = '';
      try {
        var res = await fetch('/api/config', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        statusEl.textContent = 'Saved!';
        statusEl.dataset.type = 'success';
      } catch (err) {
        statusEl.textContent = 'Save failed: ' + err.message;
        statusEl.dataset.type = 'error';
      } finally {
        saveBtn.disabled = false;
        setTimeout(function () { statusEl.textContent = ''; }, 3000);
      }
    }
    saveBtn.addEventListener('click', saveConfig);

    // \u2500\u2500 Read form values back into config \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function readFormIntoConfig() {
      // Contact
      ['louisville', 'lexington', 'nky'].forEach(function (key) {
        var label   = document.querySelector('[data-contact="' + key + '"] [data-field="label"]');
        var display = document.querySelector('[data-contact="' + key + '"] [data-field="display"]');
        var href    = document.querySelector('[data-contact="' + key + '"] [data-field="href"]');
        if (label)   config.contact[key].label   = label.value;
        if (display) config.contact[key].display = display.value;
        if (href)    config.contact[key].href    = href.value;
      });

      // Services
      config.services.forEach(function (svc, si) {
        var svcEl = document.querySelector('[data-svc-idx="' + si + '"]');
        if (!svcEl) return;

        svc.label       = val(svcEl, 'label');
        svc.subtitle    = val(svcEl, 'subtitle');
        svc.description = val(svcEl, 'description');

        // Qualifier
        svc.qualifier.question = val(svcEl, 'qualifier-question');
        var pillCards = svcEl.querySelectorAll('.admin-pills-list > .admin-pill-card');
        svc.qualifier.pills = Array.from(pillCards).map(function (card) {
          var label = card.querySelector('[data-pill-label]').value.trim();
          if (!label) return null;
          // Preserve existing pill fields not in the form (cardIcon, cardDesc, cardTag)
          var existingPill = (svc.qualifier.pills[Array.from(pillCards).indexOf(card)]) || {};
          if (typeof existingPill === 'string') existingPill = {};
          var pill = { label: label };
          if (existingPill.cardIcon) pill.cardIcon = existingPill.cardIcon;
          if (existingPill.cardDesc) pill.cardDesc = existingPill.cardDesc;
          if (existingPill.cardTag) pill.cardTag = existingPill.cardTag;
          var action = card.querySelector('[data-pill-action]').value;
          if (action === 'redirect') {
            pill.action = 'redirect';
            var redirect = card.querySelector('[data-pill-redirect]').value;
            if (redirect) pill.redirect = redirect;
          } else if (action === 'info') {
            pill.action = 'info';
            var infoKey = card.querySelector('[data-pill-info-key]').value.trim();
            if (infoKey) pill.infoKey = infoKey;
          } else if (action === 'explain') {
            pill.action = 'explain';
          }
          // Custom tiers
          var customCheck = card.querySelector('[data-pill-custom-tiers]');
          if (customCheck && customCheck.checked) {
            var tierCards = card.querySelectorAll('.admin-tier-card');
            if (tierCards.length > 0) {
              pill.tiers = Array.from(tierCards).map(function (tierEl) {
                return readTierFromEl(tierEl);
              });
            }
          }
          return pill;
        }).filter(Boolean);

        // Default tiers (direct children, not inside pill cards)
        var defaultTierEls = svcEl.querySelectorAll(':scope > .admin-service-body > .admin-tier-grid > .admin-tier-card');
        if (defaultTierEls.length > 0) {
          svc.tiers = Array.from(defaultTierEls).map(function (tierEl, ti) {
            var existing = svc.tiers[ti] || {};
            return readTierFromEl(tierEl, existing);
          });
        }
      });

      function readTierFromEl(tierEl, existing) {
        var tier = Object.assign({}, existing || {});
        tier.label      = tierEl.dataset.tier || tier.label || '';
        tier.headline   = tval(tierEl, 'headline');
        tier.price      = tval(tierEl, 'price');
        tier.priceRange = tval(tierEl, 'priceRange') || undefined;
        tier.financing  = tval(tierEl, 'financing') || undefined;
        tier.cta        = tval(tierEl, 'cta');
        tier.popular    = tierEl.querySelector('[data-field="popular"]')?.checked || false;
        if (!tier.popular) delete tier.popular;
        var imgPathEl = tierEl.querySelector('[data-field="image"]');
        if (imgPathEl && imgPathEl.value) tier.image = imgPathEl.value;
        else if (imgPathEl) delete tier.image;
        var featInputs = tierEl.querySelectorAll('.admin-feat-input');
        tier.features = Array.from(featInputs).map(function (inp) { return inp.value.trim(); }).filter(Boolean);
        return tier;
      }

      function val(el, field) {
        var inp = el.querySelector('[data-field="' + field + '"]');
        return inp ? inp.value.trim() : '';
      }
      function tval(el, field) {
        var inp = el.querySelector('[data-field="' + field + '"]');
        return inp ? inp.value.trim() : '';
      }
    }

    // \u2500\u2500 Render the editor \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function renderEditor() {
      var html = '';

      // Tabs
      html += '<div class="admin-tabs">' +
        '<button class="admin-tab" data-tab="leads">Leads</button>' +
        '<button class="admin-tab" data-tab="analytics">Analytics</button>' +
        '<button class="admin-tab" data-tab="services" data-active="true">Services &amp; Pricing</button>' +
        '<button class="admin-tab" data-tab="settings">Settings</button>' +
        '<button class="admin-tab" data-tab="contact">Contact Numbers</button>' +
        '<button class="admin-tab" data-tab="chat">AI Chat</button>' +
      '</div>';

      // \u2500\u2500 Contact panel \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      html += '<div class="admin-tab-panel" data-tab="contact">';
      html += '<div class="admin-contact-grid">';
      Object.keys(config.contact).forEach(function (key) {
        var c = config.contact[key];
        html +=
          '<div class="admin-contact-card" data-contact="' + esc(key) + '">' +
            '<h3>' + esc(c.label) + '</h3>' +
            field('Label', 'label', c.label) +
            field('Display Number', 'display', c.display) +
            field('Phone Link (tel:...)', 'href', c.href) +
          '</div>';
      });
      html += '</div></div>';

      // \u2500\u2500 Leads panel \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      html += '<div class="admin-tab-panel" data-tab="leads">' +
        '<div class="admin-leads-toolbar">' +
          '<select id="leads-status-filter">' +
            '<option value="">All Statuses</option>' +
            '<option value="new">New</option>' +
            '<option value="contacted">Contacted</option>' +
            '<option value="scheduled">Scheduled</option>' +
            '<option value="completed">Completed</option>' +
            '<option value="cancelled">Cancelled</option>' +
          '</select>' +
          '<input type="text" id="leads-search" placeholder="Search by name or phone..." style="width:220px;" />' +
          '<button class="admin-export-btn" id="leads-export" type="button">Export CSV</button>' +
          '<span class="leads-count" id="leads-count"></span>' +
        '</div>' +
        '<div id="leads-table-wrap"></div>' +
      '</div>';

      // \u2500\u2500 Analytics panel \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      html += '<div class="admin-tab-panel" data-tab="analytics">' +
        '<div id="analytics-content"><div class="admin-loading">Loading analytics...</div></div>' +
      '</div>';

      // \u2500\u2500 Settings panel (trust signals + availability + SMS) \u2500\u2500\u2500\u2500
      html += '<div class="admin-tab-panel" data-tab="settings">';
      html += renderPriceFlowPanel();
      html += renderSettingsPanel();
      html += renderSmsTemplatePanel();
      html += '</div>';

      // \u2500\u2500 Chat panel \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      html += '<div class="admin-tab-panel" data-tab="chat">';
      html += '<div class="admin-chat-config">' +
        '<h2 style="font-size:18px;font-weight:700;margin-bottom:16px;">AI Chat Assistant Settings</h2>' +
        '<div class="admin-chat-info">' +
          '<p style="font-size:14px;color:#64748b;margin-bottom:16px;">' +
            'Customize the AI assistant\\'s behavior. The system prompt tells the AI how to diagnose problems, when to route to pricing, and when to connect to a specialist. ' +
            'Leave blank to use the built-in default prompt.' +
          '</p>' +
        '</div>' +
        '<div class="admin-field">' +
          '<label for="admin-chat-prompt" style="font-size:13px;font-weight:600;color:#64748b;margin-bottom:6px;display:block;">System Prompt</label>' +
          '<textarea class="admin-chat-prompt" id="admin-chat-prompt" rows="20" placeholder="Leave blank to use default prompt..."></textarea>' +
        '</div>' +
        '<div style="display:flex;gap:10px;align-items:center;margin-top:12px;">' +
          '<button class="admin-save-btn" id="admin-chat-save" type="button">Save Chat Settings</button>' +
          '<button class="admin-chat-reset-btn" id="admin-chat-reset" type="button">Reset to Default</button>' +
          '<span class="admin-status" id="admin-chat-status"></span>' +
        '</div>' +
        '<details style="margin-top:20px;border:1px solid var(--border);border-radius:var(--radius);padding:16px;">' +
          '<summary style="cursor:pointer;font-weight:600;font-size:14px;color:var(--primary);">View Default Prompt</summary>' +
          '<pre class="admin-chat-default-preview" id="admin-chat-default"></pre>' +
        '</details>' +
      '</div></div>';

      // \u2500\u2500 Services panel \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      html += '<div class="admin-tab-panel" data-tab="services" data-active="true">';

      config.services.forEach(function (svc, si) {
        html +=
          '<div class="admin-service" data-svc-idx="' + si + '" data-open="false">' +
            '<div class="admin-service-header">' +
              '<h3>' + esc(svc.label) + '</h3>' +
              '<span class="svc-id">' + esc(svc.id) + '</span>' +
              '<svg class="admin-chevron" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>' +
            '</div>' +
            '<div class="admin-service-body">' +
              '<div class="admin-section-title">Service Info</div>' +
              field('Label', 'label', svc.label) +
              field('Subtitle', 'subtitle', svc.subtitle) +
              field('Description', 'description', svc.description) +

              '<div class="admin-section-title" style="margin-top:20px">Qualifier Question</div>' +
              field('Question', 'qualifier-question', svc.qualifier.question) +
              '<div class="admin-field"><span class="admin-field-label" role="heading" aria-level="4">Answer Options</span>' +
                '<div class="admin-pills-list" data-svc-pills="' + si + '">' +
                svc.qualifier.pills.map(function (p, pi) {
                  return renderPillCard(si, pi, p, svc);
                }).join('') +
                '</div>' +
                '<button class="admin-feat-add" data-add-pill="' + si + '" type="button">+ Add option</button>' +
              '</div>' +

              '<div class="admin-section-title" style="margin-top:20px">Default Packages <span style="font-weight:400;text-transform:none;letter-spacing:0;font-size:12px;color:#94a3b8">(used when an option has no custom tiers)</span></div>' +
              '<div class="admin-tier-grid">' +
              svc.tiers.map(function (tier, ti) {
                return renderTierCard(si, ti, tier);
              }).join('') +
              '</div>' +
            '</div>' +
          '</div>';
      });

      html += '</div>';

      root.innerHTML = html;
      loading.style.display = 'none';
      wireEvents();
      wireChatConfig();
      wireSettings();
      loadLeads();

      // Lead filter events
      var statusFilter = document.getElementById('leads-status-filter');
      var searchInput = document.getElementById('leads-search');
      var exportBtn = document.getElementById('leads-export');
      if (statusFilter) statusFilter.addEventListener('change', renderLeadsTable);
      if (searchInput) searchInput.addEventListener('input', renderLeadsTable);
      if (exportBtn) exportBtn.addEventListener('click', exportCSV);
    }

    function normPill(p) { return typeof p === 'string' ? { label: p } : p; }

    function renderPillCard(si, pi, rawPill, svc) {
      var pill = normPill(rawPill);
      var action = pill.action || 'default';
      var hasTiers = pill.tiers && pill.tiers.length > 0;
      var badgeLabel = action === 'default' ? (hasTiers ? 'Custom Tiers' : 'Default Tiers') : (action === 'redirect' ? 'Redirect' : (action === 'explain' ? 'Explain Panel' : 'Info Screen'));
      var badgeAction = hasTiers ? 'custom' : action;

      var serviceOptions = config.services.map(function (s) {
        var selected = (pill.redirect === s.id) ? ' selected' : '';
        return '<option value="' + escAttr(s.id) + '"' + selected + '>' + esc(s.label) + '</option>';
      }).join('');

      var tiersHtml = '';
      if (hasTiers) {
        tiersHtml = '<div class="admin-tier-grid" style="margin-top:12px">' +
          pill.tiers.map(function (tier, ti) {
            return renderTierCard(si + '-p' + pi, ti, tier);
          }).join('') +
          '</div>';
      }

      return (
        '<div class="admin-pill-card" data-pill-idx="' + pi + '" data-open="false" data-has-tiers="' + hasTiers + '">' +
          '<div class="admin-pill-header">' +
            '<svg class="admin-pill-expand" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>' +
            '<input class="admin-pill-label-input" data-pill-label value="' + escAttr(pill.label) + '" />' +
            '<span class="admin-pill-action-badge" data-action="' + badgeAction + '">' + badgeLabel + '</span>' +
            '<button class="admin-pill-remove" type="button">&times;</button>' +
          '</div>' +
          '<div class="admin-pill-body">' +
            '<div class="admin-pill-config">' +
              '<div class="admin-pill-action-row">' +
                '<label style="font-size:12px;font-weight:600;color:#64748b;">Behavior: ' +
                '<select class="admin-pill-action-select" data-pill-action>' +
                  '<option value="default"' + (action === 'default' ? ' selected' : '') + '>Show pricing (default tiers)</option>' +
                  '<option value="redirect"' + (action === 'redirect' ? ' selected' : '') + '>Redirect to another service</option>' +
                  '<option value="info"' + (action === 'info' ? ' selected' : '') + '>Show info screen first</option>' +
                  '<option value="explain"' + (action === 'explain' ? ' selected' : '') + '>Show explain panel (Help Me Choose)</option>' +
                '</select></label>' +
              '</div>' +
              '<div class="admin-pill-redirect-row" data-pill-redirect-row style="display:' + (action === 'redirect' ? 'flex' : 'none') + ';align-items:center;gap:10px;">' +
                '<label style="font-size:12px;font-weight:600;color:#64748b;">Redirect to: ' +
                '<select class="admin-pill-redirect-input" data-pill-redirect>' +
                  '<option value="">Select service...</option>' +
                  serviceOptions +
                '</select></label>' +
              '</div>' +
              '<div class="admin-pill-info-row" data-pill-info-row style="display:' + (action === 'info' ? 'flex' : 'none') + ';align-items:center;gap:10px;">' +
                '<label style="font-size:12px;font-weight:600;color:#64748b;">Info Key: ' +
                '<input class="admin-input admin-input-sm" data-pill-info-key value="' + escAttr(pill.infoKey || '') + '" placeholder="e.g. opener_remote" /></label>' +
              '</div>' +
              '<div class="admin-pill-tiers-section">' +
                '<label class="admin-pill-tiers-toggle">' +
                  '<input type="checkbox" data-pill-custom-tiers' + (hasTiers ? ' checked' : '') + ' />' +
                  '<span>Use custom pricing for this option</span>' +
                '</label>' +
                '<div data-pill-tiers-container style="display:' + (hasTiers ? 'block' : 'none') + '">' +
                  tiersHtml +
                  (!hasTiers ? '' : '') +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }

    function renderTierCard(si, ti, tier) {
      var imgPreview = tier.image
        ? '<img src="' + escAttr(tier.image) + '" alt="' + escAttr(tier.headline) + '" loading="lazy" decoding="async" width="200" height="120">' +
          '<button class="admin-img-remove" data-clear-img="' + si + '-' + ti + '" type="button">&times;</button>'
        : '<div class="upload-hint"><strong>Click to upload</strong> or drag &amp; drop</div>';

      return (
        '<div class="admin-tier-card" data-tier="' + escAttr(tier.label) + '" data-tier-idx="' + ti + '">' +
          '<span class="admin-tier-label">' + esc(tier.label) + '</span>' +

          '<div class="admin-img-area" data-upload="' + si + '-' + ti + '">' +
            imgPreview +
          '</div>' +
          '<input type="hidden" data-field="image" value="' + escAttr(tier.image || '') + '" />' +

          field('Headline', 'headline', tier.headline) +

          '<div class="admin-row">' +
            '<div class="admin-field"><label><span>Price</span>' +
              '<input class="admin-input admin-input-sm" data-field="price" value="' + escAttr(tier.price) + '" /></label>' +
            '</div>' +
            '<div class="admin-field"><label><span>Price Range</span>' +
              '<input class="admin-input admin-input-sm" data-field="priceRange" value="' + escAttr(tier.priceRange || '') + '" placeholder="\u2013 $499" /></label>' +
            '</div>' +
          '</div>' +

          '<div class="admin-field"><label><span>Financing</span>' +
            '<input class="admin-input" data-field="financing" value="' + escAttr(tier.financing || '') + '" placeholder="As low as $35/mo" /></label>' +
          '</div>' +

          field('CTA Text', 'cta', tier.cta) +

          '<div class="admin-popular-check">' +
            '<label><input type="checkbox" data-field="popular"' + (tier.popular ? ' checked' : '') + ' />' +
            ' Mark as "Most Popular"</label>' +
          '</div>' +

          '<div class="admin-field"><span class="admin-field-label" role="heading" aria-level="4">Included Features</span>' +
            '<ul class="admin-features-list" data-features="' + si + '-' + ti + '">' +
            tier.features.map(function (f, fi) {
              return '<li>' +
                '<input class="admin-feat-input" value="' + escAttr(f) + '" />' +
                '<button class="admin-feat-remove" data-feat-remove="' + fi + '" type="button">&times;</button>' +
              '</li>';
            }).join('') +
            '</ul>' +
            '<button class="admin-feat-add" data-add-feat="' + si + '-' + ti + '" type="button">+ Add feature</button>' +
          '</div>' +
        '</div>'
      );
    }

    // \u2500\u2500 Helpers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function field(label, dataField, value) {
      return '<div class="admin-field">' +
        '<label><span>' + esc(label) + '</span>' +
        '<input class="admin-input" data-field="' + escAttr(dataField) + '" value="' + escAttr(value || '') + '" /></label>' +
      '</div>';
    }

    function esc(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
    function escAttr(str) { return esc(str); }

    // \u2500\u2500 Wire up interactive events \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function wireEvents() {
      // Tabs
      root.querySelectorAll('.admin-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          var tabName = tab.dataset.tab;
          root.querySelectorAll('.admin-tab').forEach(function (t) { t.dataset.active = 'false'; });
          root.querySelectorAll('.admin-tab-panel').forEach(function (p) { p.dataset.active = 'false'; });
          tab.dataset.active = 'true';
          root.querySelector('.admin-tab-panel[data-tab="' + tabName + '"]').dataset.active = 'true';
        });
      });

      // Accordion toggle
      root.querySelectorAll('.admin-service-header').forEach(function (header) {
        header.addEventListener('click', function () {
          var svc = header.closest('.admin-service');
          svc.dataset.open = svc.dataset.open === 'true' ? 'false' : 'true';
        });
      });

      // Image upload areas
      root.querySelectorAll('.admin-img-area').forEach(function (area) {
        var key = area.dataset.upload; // "si-ti"
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        area.appendChild(fileInput);

        area.addEventListener('click', function (e) {
          if (e.target.closest('.admin-img-remove')) return;
          fileInput.click();
        });

        fileInput.addEventListener('change', function () {
          if (fileInput.files.length > 0) uploadImage(fileInput.files[0], area, key);
          fileInput.value = '';
        });

        area.addEventListener('dragover', function (e) {
          e.preventDefault();
          area.dataset.dragging = 'true';
        });
        area.addEventListener('dragleave', function () {
          area.dataset.dragging = 'false';
        });
        area.addEventListener('drop', function (e) {
          e.preventDefault();
          area.dataset.dragging = 'false';
          if (e.dataTransfer.files.length > 0) {
            uploadImage(e.dataTransfer.files[0], area, key);
          }
        });
      });

      // Clear image buttons
      root.querySelectorAll('[data-clear-img]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var key = btn.dataset.clearImg;
          var area = root.querySelector('.admin-img-area[data-upload="' + key + '"]');
          var hiddenInput = area.closest('.admin-tier-card').querySelector('[data-field="image"]');
          hiddenInput.value = '';
          area.innerHTML = '<div class="upload-hint"><strong>Click to upload</strong> or drag & drop</div>';
          // Re-add file input
          var fi = document.createElement('input');
          fi.type = 'file'; fi.accept = 'image/*'; fi.style.display = 'none';
          area.appendChild(fi);
        });
      });

      // Add feature buttons
      root.querySelectorAll('[data-add-feat]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var key = btn.dataset.addFeat;
          var list = root.querySelector('[data-features="' + key + '"]');
          var li = document.createElement('li');
          li.innerHTML = '<input class="admin-feat-input" value="" placeholder="New feature..." />' +
            '<button class="admin-feat-remove" type="button">&times;</button>';
          list.appendChild(li);
          li.querySelector('input').focus();
          li.querySelector('.admin-feat-remove').addEventListener('click', function () { li.remove(); });
        });
      });

      // Remove feature buttons
      root.querySelectorAll('.admin-feat-remove').forEach(function (btn) {
        btn.addEventListener('click', function () { btn.closest('li').remove(); });
      });

      // Pill card expand/collapse
      root.querySelectorAll('.admin-pill-header').forEach(function (header) {
        header.addEventListener('click', function (e) {
          if (e.target.closest('.admin-pill-label-input') || e.target.closest('.admin-pill-remove')) return;
          var card = header.closest('.admin-pill-card');
          card.dataset.open = card.dataset.open === 'true' ? 'false' : 'true';
        });
      });

      // Pill action select change
      root.querySelectorAll('[data-pill-action]').forEach(function (sel) {
        sel.addEventListener('change', function () {
          var card = sel.closest('.admin-pill-card');
          var redirectRow = card.querySelector('[data-pill-redirect-row]');
          var infoRow = card.querySelector('[data-pill-info-row]');
          redirectRow.style.display = sel.value === 'redirect' ? 'flex' : 'none';
          infoRow.style.display = sel.value === 'info' ? 'flex' : 'none';
          // Update badge
          var badge = card.querySelector('.admin-pill-action-badge');
          var hasTiers = card.querySelector('[data-pill-custom-tiers]').checked;
          if (hasTiers) {
            badge.dataset.action = 'custom';
            badge.textContent = 'Custom Tiers';
          } else {
            badge.dataset.action = sel.value;
            badge.textContent = sel.value === 'redirect' ? 'Redirect' : (sel.value === 'info' ? 'Info Screen' : 'Default Tiers');
          }
        });
      });

      // Custom tiers toggle
      root.querySelectorAll('[data-pill-custom-tiers]').forEach(function (cb) {
        cb.addEventListener('change', function () {
          var card = cb.closest('.admin-pill-card');
          var container = card.querySelector('[data-pill-tiers-container]');
          var badge = card.querySelector('.admin-pill-action-badge');
          card.dataset.hasTiers = cb.checked ? 'true' : 'false';
          if (cb.checked) {
            container.style.display = 'block';
            badge.dataset.action = 'custom';
            badge.textContent = 'Custom Tiers';
            // If no tier cards exist, create default 3
            if (!container.querySelector('.admin-tier-card')) {
              var si = card.closest('[data-svc-idx]').dataset.svcIdx;
              var pi = card.dataset.pillIdx;
              var prefix = si + '-p' + pi;
              var defaultTiers = [
                { label: 'Good', headline: '', price: '', priceRange: '', features: [], cta: 'Book Good' },
                { label: 'Better', headline: '', price: '', priceRange: '', features: [], cta: 'Book Better', popular: true },
                { label: 'Best', headline: '', price: '', priceRange: '', features: [], cta: 'Book Best' }
              ];
              container.innerHTML = '<div class="admin-tier-grid" style="margin-top:12px">' +
                defaultTiers.map(function (t, ti) { return renderTierCard(prefix, ti, t); }).join('') +
              '</div>';
              wireImageUploads(container);
              wireFeatButtons(container);
            }
          } else {
            container.style.display = 'none';
            var action = card.querySelector('[data-pill-action]').value;
            badge.dataset.action = action;
            badge.textContent = action === 'redirect' ? 'Redirect' : (action === 'info' ? 'Info Screen' : 'Default Tiers');
          }
        });
      });

      // Add pill buttons
      root.querySelectorAll('[data-add-pill]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var si = btn.dataset.addPill;
          var svc = config.services[si];
          var list = root.querySelector('[data-svc-pills="' + si + '"]');
          var pi = list.children.length;
          var newPill = { label: '' };
          var tempDiv = document.createElement('div');
          tempDiv.innerHTML = renderPillCard(si, pi, newPill, svc);
          var card = tempDiv.firstElementChild;
          list.appendChild(card);
          card.dataset.open = 'true';
          card.querySelector('.admin-pill-label-input').focus();
          // Wire events for the new card
          card.querySelector('.admin-pill-header').addEventListener('click', function (e) {
            if (e.target.closest('.admin-pill-label-input') || e.target.closest('.admin-pill-remove')) return;
            card.dataset.open = card.dataset.open === 'true' ? 'false' : 'true';
          });
          card.querySelector('.admin-pill-remove').addEventListener('click', function () { card.remove(); });
          card.querySelector('[data-pill-action]').addEventListener('change', function () {
            var sel = card.querySelector('[data-pill-action]');
            card.querySelector('[data-pill-redirect-row]').style.display = sel.value === 'redirect' ? 'flex' : 'none';
            card.querySelector('[data-pill-info-row]').style.display = sel.value === 'info' ? 'flex' : 'none';
          });
          var cb = card.querySelector('[data-pill-custom-tiers]');
          cb.addEventListener('change', function () {
            var container = card.querySelector('[data-pill-tiers-container]');
            card.dataset.hasTiers = cb.checked ? 'true' : 'false';
            if (cb.checked) {
              container.style.display = 'block';
              if (!container.querySelector('.admin-tier-card')) {
                var prefix = si + '-p' + pi;
                var defaultTiers = [
                  { label: 'Good', headline: '', price: '', priceRange: '', features: [], cta: 'Book Good' },
                  { label: 'Better', headline: '', price: '', priceRange: '', features: [], cta: 'Book Better', popular: true },
                  { label: 'Best', headline: '', price: '', priceRange: '', features: [], cta: 'Book Best' }
                ];
                container.innerHTML = '<div class="admin-tier-grid" style="margin-top:12px">' +
                  defaultTiers.map(function (t, ti) { return renderTierCard(prefix, ti, t); }).join('') +
                '</div>';
                wireImageUploads(container);
                wireFeatButtons(container);
              }
            } else {
              container.style.display = 'none';
            }
          });
        });
      });

      // Remove pill buttons
      root.querySelectorAll('.admin-pill-remove').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          btn.closest('.admin-pill-card').remove();
        });
      });
    }

    // \u2500\u2500 Wire helpers for dynamically added content \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function wireImageUploads(container) {
      container.querySelectorAll('.admin-img-area').forEach(function (area) {
        var key = area.dataset.upload;
        var fileInput = document.createElement('input');
        fileInput.type = 'file'; fileInput.accept = 'image/*'; fileInput.style.display = 'none';
        area.appendChild(fileInput);
        area.addEventListener('click', function (e) {
          if (e.target.closest('.admin-img-remove')) return;
          fileInput.click();
        });
        fileInput.addEventListener('change', function () {
          if (fileInput.files.length > 0) uploadImage(fileInput.files[0], area, key);
          fileInput.value = '';
        });
        area.addEventListener('dragover', function (e) { e.preventDefault(); area.dataset.dragging = 'true'; });
        area.addEventListener('dragleave', function () { area.dataset.dragging = 'false'; });
        area.addEventListener('drop', function (e) {
          e.preventDefault(); area.dataset.dragging = 'false';
          if (e.dataTransfer.files.length > 0) uploadImage(e.dataTransfer.files[0], area, key);
        });
      });
    }

    function wireFeatButtons(container) {
      container.querySelectorAll('[data-add-feat]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var key = btn.dataset.addFeat;
          var list = container.querySelector('[data-features="' + key + '"]');
          if (!list) list = root.querySelector('[data-features="' + key + '"]');
          var li = document.createElement('li');
          li.innerHTML = '<input class="admin-feat-input" value="" placeholder="New feature..." />' +
            '<button class="admin-feat-remove" type="button">&times;</button>';
          list.appendChild(li);
          li.querySelector('input').focus();
          li.querySelector('.admin-feat-remove').addEventListener('click', function () { li.remove(); });
        });
      });
      container.querySelectorAll('.admin-feat-remove').forEach(function (btn) {
        btn.addEventListener('click', function () { btn.closest('li').remove(); });
      });
    }

    // \u2500\u2500 Image upload \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    async function uploadImage(file, area, key) {
      area.innerHTML = '<div class="upload-hint">Uploading...</div>';

      var formData = new FormData();
      formData.append('file', file);

      try {
        var res = await fetch('/api/upload', { method: 'POST', body: formData });
        var data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');

        var imgPath = data.path;
        var tierCard = area.closest('.admin-tier-card');
        tierCard.querySelector('[data-field="image"]').value = imgPath;

        area.innerHTML =
          '<img src="' + escAttr(imgPath) + '" alt="Uploaded image" loading="lazy" decoding="async" width="200" height="120" />' +
          '<button class="admin-img-remove" data-clear-img="' + key + '" type="button">&times;</button>';

        // Re-wire clear button
        area.querySelector('.admin-img-remove').addEventListener('click', function (e) {
          e.stopPropagation();
          tierCard.querySelector('[data-field="image"]').value = '';
          area.innerHTML = '<div class="upload-hint"><strong>Click to upload</strong> or drag & drop</div>';
        });

        // Re-add hidden file input
        var fi = document.createElement('input');
        fi.type = 'file'; fi.accept = 'image/*'; fi.style.display = 'none';
        area.appendChild(fi);
        fi.addEventListener('change', function () {
          if (fi.files.length > 0) uploadImage(fi.files[0], area, key);
          fi.value = '';
        });

      } catch (err) {
        area.innerHTML = '<div class="upload-hint" style="color:#ef4444">Upload failed: ' + esc(err.message) + '</div>';
        // Re-add file input
        var fi2 = document.createElement('input');
        fi2.type = 'file'; fi2.accept = 'image/*'; fi2.style.display = 'none';
        area.appendChild(fi2);
      }
    }

    // \u2500\u2500 Chat config \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    var chatPromptEl = null;
    var chatStatusEl = null;

    function wireChatConfig() {
      chatPromptEl = document.getElementById('admin-chat-prompt');
      chatStatusEl = document.getElementById('admin-chat-status');
      var chatSaveBtn = document.getElementById('admin-chat-save');
      var chatResetBtn = document.getElementById('admin-chat-reset');
      var chatDefaultEl = document.getElementById('admin-chat-default');

      if (!chatPromptEl) return;

      // Show default prompt preview
      if (chatDefaultEl) {
        fetch('/api/chat-config').then(function (r) { return r.json(); }).then(function () {
          // We'll fetch the default from the server prompt
          chatDefaultEl.textContent = '(The default prompt includes detailed garage door diagnostic knowledge, 70% confidence routing rules, and conversation guidelines. Save a blank prompt to use the default.)';
        });
      }

      // Load existing custom prompt
      fetch('/api/chat-config')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.systemPrompt) chatPromptEl.value = data.systemPrompt;
        })
        .catch(function () { /* no config yet */ });

      chatSaveBtn.addEventListener('click', function () {
        var prompt = chatPromptEl.value.trim();
        chatStatusEl.textContent = 'Saving...';
        chatStatusEl.dataset.type = '';
        fetch('/api/chat-config', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ systemPrompt: prompt }),
        })
          .then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            chatStatusEl.textContent = 'Saved!';
            chatStatusEl.dataset.type = 'success';
          })
          .catch(function (err) {
            chatStatusEl.textContent = 'Save failed: ' + err.message;
            chatStatusEl.dataset.type = 'error';
          })
          .finally(function () {
            setTimeout(function () { chatStatusEl.textContent = ''; }, 3000);
          });
      });

      chatResetBtn.addEventListener('click', function () {
        chatPromptEl.value = '';
        chatStatusEl.textContent = 'Prompt cleared. Click Save to apply.';
        chatStatusEl.dataset.type = '';
        setTimeout(function () { chatStatusEl.textContent = ''; }, 3000);
      });
    }

    // \u2500\u2500 Settings panel rendering \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function renderPriceFlowPanel() {
      var pf = config.priceFlow === 'info-first' ? 'info-first' : 'price-first';
      return (
        '<div class="admin-settings-card">' +
          '<h3>Quote Flow (Test)</h3>' +
          '<p style="font-size:13px;color:#64748b;margin-bottom:12px;">Choose whether the widget captures the visitor\\u2019s contact info before or after they see pricing. Affects both the "I know my issue" and opener-guide paths.</p>' +
          '<div class="admin-toggle-row" style="align-items:flex-start;gap:10px;">' +
            '<input type="radio" name="price-flow" id="pf-price-first" value="price-first"' + (pf === 'price-first' ? ' checked' : '') + ' />' +
            '<label for="pf-price-first" style="line-height:1.4;">' +
              '<strong>Price first</strong> \\u2014 show tiered pricing immediately, collect contact info only when they click Book. <em style="color:#64748b;">(Default, least friction)</em>' +
            '</label>' +
          '</div>' +
          '<div class="admin-toggle-row" style="align-items:flex-start;gap:10px;margin-top:8px;">' +
            '<input type="radio" name="price-flow" id="pf-info-first" value="info-first"' + (pf === 'info-first' ? ' checked' : '') + ' />' +
            '<label for="pf-info-first" style="line-height:1.4;">' +
              '<strong>Info first</strong> \\u2014 require name, phone & ZIP <em>before</em> showing pricing. <em style="color:#64748b;">(Higher lead capture, more friction)</em>' +
            '</label>' +
          '</div>' +
        '</div>'
      );
    }

    function renderSettingsPanel() {
      var ts = config.trustSignals || { enabled: false, rating: '4.9', reviewCount: '127', jobCount: '2,500+', badges: ['Licensed & Insured', 'Same-Day Service'] };
      var av = config.availability || { enabled: false, message: 'Technician available today' };

      var badgesHtml = (ts.badges || []).map(function (b, i) {
        return '<div class="admin-badge-chip">' +
          '<input data-badge-idx="' + i + '" value="' + escAttr(b) + '" />' +
          '<button data-remove-badge="' + i + '" type="button">&times;</button>' +
        '</div>';
      }).join('');

      return (
        '<div class="admin-settings-card">' +
          '<h3>Trust Signals</h3>' +
          '<p style="font-size:13px;color:#64748b;margin-bottom:12px;">Displayed below the pricing header to build confidence.</p>' +
          '<div class="admin-toggle-row">' +
            '<input type="checkbox" id="trust-enabled"' + (ts.enabled ? ' checked' : '') + ' />' +
            '<label for="trust-enabled">Show trust signals on pricing screen</label>' +
          '</div>' +
          '<div class="admin-row">' +
            '<div class="admin-field"><label for="trust-rating">Google Rating</label><input class="admin-input admin-input-sm" id="trust-rating" value="' + escAttr(ts.rating || '') + '" /></div>' +
            '<div class="admin-field"><label for="trust-reviews">Review Count</label><input class="admin-input admin-input-sm" id="trust-reviews" value="' + escAttr(ts.reviewCount || '') + '" /></div>' +
            '<div class="admin-field"><label for="trust-jobs">Jobs Completed</label><input class="admin-input admin-input-sm" id="trust-jobs" value="' + escAttr(ts.jobCount || '') + '" /></div>' +
          '</div>' +
          '<div class="admin-field"><span class="admin-field-label" role="heading" aria-level="4">Trust Badges</span>' +
            '<div class="admin-badges-list" id="trust-badges">' + badgesHtml + '</div>' +
            '<button class="admin-feat-add" id="trust-add-badge" type="button" style="margin-top:8px;">+ Add badge</button>' +
          '</div>' +
        '</div>' +
        '<div class="admin-settings-card">' +
          '<h3>Availability Message</h3>' +
          '<p style="font-size:13px;color:#64748b;margin-bottom:12px;">Shown on the widget home screen to create urgency.</p>' +
          '<div class="admin-toggle-row">' +
            '<input type="checkbox" id="avail-enabled"' + (av.enabled ? ' checked' : '') + ' />' +
            '<label for="avail-enabled">Show availability badge</label>' +
          '</div>' +
          '<div class="admin-field"><label for="avail-message">Message</label><input class="admin-input" id="avail-message" value="' + escAttr(av.message || '') + '" style="max-width:400px;" /></div>' +
        '</div>'
      );
    }

    function renderSmsTemplatePanel() {
      var tpl = config.smsTemplate || 'Hi {name}! Thanks for requesting a {tier} {service} appointment (estimated {price}) with Derby Strong Garage Doors. A specialist will contact you shortly to confirm your visit. Questions? Call us at 502-619-5198.';
      return (
        '<div class="admin-settings-card">' +
          '<h3>SMS Confirmation Template</h3>' +
          '<p style="font-size:13px;color:#64748b;margin-bottom:12px;">Customize the text message sent to customers after booking. Use placeholders: <code>{name}</code>, <code>{service}</code>, <code>{tier}</code>, <code>{price}</code>, <code>{phone}</code></p>' +
          '<textarea class="admin-chat-prompt" id="sms-template" rows="4" style="min-height:100px;">' + esc(tpl) + '</textarea>' +
          '<p style="font-size:12px;color:#94a3b8;margin-top:6px;">Requires Twilio configuration (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER in .env)</p>' +
        '</div>'
      );
    }

    // \u2500\u2500 Read settings into config on save \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    var origReadFormIntoConfig = readFormIntoConfig;
    readFormIntoConfig = function () {
      origReadFormIntoConfig();

      // Price flow toggle
      var pfChecked = document.querySelector('input[name="price-flow"]:checked');
      if (pfChecked) {
        config.priceFlow = pfChecked.value === 'info-first' ? 'info-first' : 'price-first';
      }

      // Trust signals
      var trustEnabled = document.getElementById('trust-enabled');
      var trustRating = document.getElementById('trust-rating');
      var trustReviews = document.getElementById('trust-reviews');
      var trustJobs = document.getElementById('trust-jobs');
      if (trustEnabled) {
        var badges = [];
        document.querySelectorAll('#trust-badges [data-badge-idx]').forEach(function (inp) {
          var v = inp.value.trim();
          if (v) badges.push(v);
        });
        config.trustSignals = {
          enabled: trustEnabled.checked,
          rating: trustRating ? trustRating.value.trim() : '',
          reviewCount: trustReviews ? trustReviews.value.trim() : '',
          jobCount: trustJobs ? trustJobs.value.trim() : '',
          badges: badges
        };
      }

      // Availability
      var availEnabled = document.getElementById('avail-enabled');
      var availMessage = document.getElementById('avail-message');
      if (availEnabled) {
        config.availability = {
          enabled: availEnabled.checked,
          message: availMessage ? availMessage.value.trim() : ''
        };
      }

      // SMS template
      var smsEl = document.getElementById('sms-template');
      if (smsEl) {
        config.smsTemplate = smsEl.value.trim();
      }
    };

    // \u2500\u2500 Wire settings events \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function wireSettings() {
      var addBadge = document.getElementById('trust-add-badge');
      if (addBadge) {
        addBadge.addEventListener('click', function () {
          var list = document.getElementById('trust-badges');
          var idx = list.children.length;
          var chip = document.createElement('div');
          chip.className = 'admin-badge-chip';
          chip.innerHTML = '<input data-badge-idx="' + idx + '" value="" placeholder="New badge..." />' +
            '<button data-remove-badge="' + idx + '" type="button">&times;</button>';
          list.appendChild(chip);
          chip.querySelector('input').focus();
          chip.querySelector('button').addEventListener('click', function () { chip.remove(); });
        });
      }
      document.querySelectorAll('[data-remove-badge]').forEach(function (btn) {
        btn.addEventListener('click', function () { btn.closest('.admin-badge-chip').remove(); });
      });
    }

    // \u2500\u2500 Leads management \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    var allBookings = [];

    function loadLeads() {
      fetch('/api/bookings')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          allBookings = data;
          renderLeadsTable();
          renderAnalytics();
        })
        .catch(function () {
          document.getElementById('leads-table-wrap').innerHTML = '<p class="admin-leads-empty">Failed to load leads.</p>';
        });
    }

    function getFilteredBookings() {
      var statusFilter = document.getElementById('leads-status-filter');
      var searchInput = document.getElementById('leads-search');
      var status = statusFilter ? statusFilter.value : '';
      var search = searchInput ? searchInput.value.toLowerCase().trim() : '';
      return allBookings.filter(function (b) {
        if (status && b.status !== status) return false;
        if (search && b.name.toLowerCase().indexOf(search) === -1 && b.phone.indexOf(search) === -1) return false;
        return true;
      });
    }

    function renderLeadsTable() {
      var wrap = document.getElementById('leads-table-wrap');
      var filtered = getFilteredBookings();
      var countEl = document.getElementById('leads-count');
      if (countEl) countEl.textContent = filtered.length + ' lead' + (filtered.length !== 1 ? 's' : '');

      if (filtered.length === 0) {
        wrap.innerHTML = '<div class="admin-leads-empty">No leads found.</div>';
        return;
      }

      var html = '<table class="admin-leads-table"><thead><tr>' +
        '<th>Date</th><th>Name</th><th>Phone</th><th>Service</th><th>Tier</th><th>Price</th><th>Source</th><th>Status</th>' +
      '</tr></thead><tbody>';

      filtered.forEach(function (b) {
        var dateStr = new Date(b.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
        html += '<tr class="admin-leads-row" data-lead-id="' + escAttr(b.id) + '">' +
          '<td>' + esc(dateStr) + '</td>' +
          '<td><strong>' + esc(b.name || '\u2014') + '</strong></td>' +
          '<td>' + esc(formatPhone(b.phone)) + '</td>' +
          '<td>' + esc(b.service) + '</td>' +
          '<td>' + esc(b.tier) + '</td>' +
          '<td>' + esc(b.price) + '</td>' +
          '<td>' + esc(b.source) + '</td>' +
          '<td><span class="status-badge" data-status="' + escAttr(b.status) + '">' + esc(b.status) + '</span></td>' +
        '</tr>';
        html += '<tr class="admin-leads-detail" data-detail-for="' + escAttr(b.id) + '">' +
          '<td colspan="8">' +
            '<div class="admin-leads-detail-inner">' +
              '<div class="detail-section">' +
                '<h4>Contact Info</h4>' +
                '<p style="font-size:14px;margin-bottom:4px;"><strong>Phone:</strong> ' + esc(formatPhone(b.phone)) + '</p>' +
                (b.email ? '<p style="font-size:14px;margin-bottom:4px;"><strong>Email:</strong> ' + esc(b.email) + '</p>' : '') +
                (b.zip ? '<p style="font-size:14px;margin-bottom:4px;"><strong>ZIP:</strong> ' + esc(b.zip) + '</p>' : '') +
                '<p style="font-size:14px;margin-bottom:4px;"><strong>Service ID:</strong> <code>' + esc(b.serviceId) + '</code></p>' +
                '<p style="font-size:13px;color:#94a3b8;margin-top:8px;">Submitted ' + esc(new Date(b.timestamp).toLocaleString()) + '</p>' +
              '</div>' +
              '<div class="detail-section">' +
                '<h4>Status &amp; Notes</h4>' +
                '<div style="margin-bottom:8px;">' +
                  '<label style="font-size:12px;font-weight:600;color:#64748b;">Status<br/>' +
                  '<select class="admin-status-select" data-status-for="' + escAttr(b.id) + '">' +
                    statusOption('new', b.status) +
                    statusOption('contacted', b.status) +
                    statusOption('scheduled', b.status) +
                    statusOption('completed', b.status) +
                    statusOption('cancelled', b.status) +
                  '</select></label>' +
                '</div>' +
                '<div>' +
                  '<label style="font-size:12px;font-weight:600;color:#64748b;">Internal Notes' +
                  '<textarea class="admin-notes-textarea" data-notes-for="' + escAttr(b.id) + '">' + esc(b.notes || '') + '</textarea></label>' +
                  '<button class="admin-notes-save" data-save-lead="' + escAttr(b.id) + '" type="button">Save</button>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</td>' +
        '</tr>';
      });

      html += '</tbody></table>';
      wrap.innerHTML = html;
      wireLeadEvents();
    }

    function statusOption(val, current) {
      return '<option value="' + val + '"' + (val === current ? ' selected' : '') + '>' + val.charAt(0).toUpperCase() + val.slice(1) + '</option>';
    }

    function formatPhone(p) {
      if (!p || p.length < 10) return p || '';
      var d = p.replace(/\\D/g, '');
      if (d.length === 10) return '(' + d.slice(0,3) + ') ' + d.slice(3,6) + '-' + d.slice(6);
      if (d.length === 11 && d[0] === '1') return '(' + d.slice(1,4) + ') ' + d.slice(4,7) + '-' + d.slice(7);
      return p;
    }

    function wireLeadEvents() {
      // Row expand/collapse
      document.querySelectorAll('.admin-leads-row').forEach(function (row) {
        row.addEventListener('click', function () {
          var id = row.dataset.leadId;
          var detail = document.querySelector('[data-detail-for="' + id + '"]');
          var isVisible = detail.dataset.visible === 'true';
          // Close all others
          document.querySelectorAll('.admin-leads-detail').forEach(function (d) { d.dataset.visible = 'false'; });
          document.querySelectorAll('.admin-leads-row').forEach(function (r) { r.dataset.expanded = 'false'; });
          if (!isVisible) {
            detail.dataset.visible = 'true';
            row.dataset.expanded = 'true';
          }
        });
      });

      // Status change
      document.querySelectorAll('.admin-status-select').forEach(function (sel) {
        sel.addEventListener('change', function () {
          var id = sel.dataset.statusFor;
          updateLead(id, { status: sel.value });
          // Update badge in row
          var row = document.querySelector('[data-lead-id="' + id + '"]');
          if (row) {
            var badge = row.querySelector('.status-badge');
            badge.dataset.status = sel.value;
            badge.textContent = sel.value;
          }
          // Update local data
          var booking = allBookings.find(function (b) { return b.id === id; });
          if (booking) booking.status = sel.value;
        });
      });

      // Save notes
      document.querySelectorAll('[data-save-lead]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = btn.dataset.saveLead;
          var textarea = document.querySelector('[data-notes-for="' + id + '"]');
          var statusSel = document.querySelector('[data-status-for="' + id + '"]');
          var updates = { notes: textarea.value };
          if (statusSel) updates.status = statusSel.value;
          updateLead(id, updates);
          btn.textContent = 'Saved!';
          setTimeout(function () { btn.textContent = 'Save'; }, 1500);
          // Update local
          var booking = allBookings.find(function (b) { return b.id === id; });
          if (booking) {
            booking.notes = textarea.value;
            if (statusSel) booking.status = statusSel.value;
          }
        });
      });
    }

    function updateLead(id, updates) {
      fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ id: id }, updates))
      }).catch(function (err) { console.error('Failed to update lead:', err); });
    }

    // \u2500\u2500 Export CSV \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function exportCSV() {
      var filtered = getFilteredBookings();
      if (filtered.length === 0) return;
      var headers = ['Date','Name','Phone','ZIP','Email','Service','Service ID','Tier','Price','Source','Status','Notes'];
      var rows = filtered.map(function (b) {
        return [
          b.timestamp, b.name, b.phone, b.zip, b.email,
          b.service, b.serviceId, b.tier, b.price, b.source, b.status, b.notes
        ].map(function (v) { return '"' + String(v || '').replace(/"/g, '""') + '"'; }).join(',');
      });
      var csv = headers.join(',') + '\\n' + rows.join('\\n');
      var blob = new Blob([csv], { type: 'text/csv' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'derby-leads-' + new Date().toISOString().slice(0,10) + '.csv';
      a.click();
      URL.revokeObjectURL(url);
    }

    // \u2500\u2500 Analytics \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function renderAnalytics() {
      var el = document.getElementById('analytics-content');
      if (!el) return;
      if (allBookings.length === 0) {
        el.innerHTML = '<div class="admin-leads-empty">No leads yet. Analytics will appear once bookings start coming in.</div>';
        return;
      }

      var now = new Date();
      var weekAgo = new Date(now.getTime() - 7 * 86400000);
      var monthAgo = new Date(now.getTime() - 30 * 86400000);

      var thisWeek = allBookings.filter(function (b) { return new Date(b.timestamp) >= weekAgo; });
      var thisMonth = allBookings.filter(function (b) { return new Date(b.timestamp) >= monthAgo; });

      // By service
      var byService = {};
      allBookings.forEach(function (b) {
        byService[b.service] = (byService[b.service] || 0) + 1;
      });

      // By tier
      var byTier = {};
      allBookings.forEach(function (b) {
        if (b.tier) byTier[b.tier] = (byTier[b.tier] || 0) + 1;
      });

      // By source
      var bySource = {};
      allBookings.forEach(function (b) {
        bySource[b.source || 'quote'] = (bySource[b.source || 'quote'] || 0) + 1;
      });

      // By status
      var byStatus = {};
      allBookings.forEach(function (b) {
        byStatus[b.status || 'new'] = (byStatus[b.status || 'new'] || 0) + 1;
      });

      var html = '';

      // Summary cards
      html += '<div class="analytics-grid">' +
        analyticsCard(allBookings.length, 'Total Leads') +
        analyticsCard(thisWeek.length, 'This Week') +
        analyticsCard(thisMonth.length, 'Last 30 Days') +
        analyticsCard(byStatus['new'] || 0, 'New / Uncontacted') +
      '</div>';

      // By service
      html += '<div class="analytics-section"><h3>Leads by Service</h3>';
      html += renderBarChart(byService, ['blue', 'green', 'amber', 'purple', 'teal', 'red']);
      html += '</div>';

      // By tier
      html += '<div class="analytics-section"><h3>Leads by Tier</h3>';
      html += renderBarChart(byTier, ['green', 'amber', 'purple']);
      html += '</div>';

      // By source
      html += '<div class="analytics-section"><h3>Leads by Source</h3>';
      html += renderBarChart(bySource, ['blue', 'teal']);
      html += '</div>';

      // By status
      html += '<div class="analytics-section"><h3>Leads by Status</h3>';
      html += renderBarChart(byStatus, ['blue', 'amber', 'purple', 'green', 'red']);
      html += '</div>';

      el.innerHTML = html;
    }

    function analyticsCard(value, label) {
      return '<div class="analytics-card"><div class="metric">' + value + '</div><div class="metric-label">' + esc(label) + '</div></div>';
    }

    function renderBarChart(data, colors) {
      var entries = Object.entries(data).sort(function (a, b) { return b[1] - a[1]; });
      if (entries.length === 0) return '<p style="color:#94a3b8;font-size:13px;">No data</p>';
      var max = entries[0][1];
      var html = '';
      entries.forEach(function (entry, i) {
        var pct = max > 0 ? Math.round((entry[1] / max) * 100) : 0;
        var color = colors[i % colors.length];
        html += '<div class="analytics-bar-row">' +
          '<span class="analytics-bar-label">' + esc(entry[0]) + '</span>' +
          '<div class="analytics-bar-track"><div class="analytics-bar-fill" data-color="' + color + '" style="width:' + pct + '%"></div></div>' +
          '<span class="analytics-bar-count">' + entry[1] + '</span>' +
        '</div>';
      });
      return html;
    }

    // \u2500\u2500 Keyboard shortcut: Ctrl+S to save \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveConfig();
      }
    });

    // \u2500\u2500 Init \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    loadConfig();
    // Chat config is wired after renderEditor via wireEvents
  })();
  <\/script> </body> </html>`], ['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Derby Strong \u2014 Admin Editor</title>', `</head> <body> <!-- Top bar --> <div class="admin-topbar"> <h1>Derby Strong</h1> <span class="badge">Admin</span> <div class="admin-topbar-actions"> <span class="admin-status" id="admin-status"></span> <button class="admin-save-btn" id="admin-save" type="button">Save Changes</button> </div> </div> <div class="admin-container" id="admin-root"> <div class="admin-loading" id="admin-loading">Loading configuration...</div> </div> <script>
  (function () {
    'use strict';

    var root      = document.getElementById('admin-root');
    var loading   = document.getElementById('admin-loading');
    var saveBtn   = document.getElementById('admin-save');
    var statusEl  = document.getElementById('admin-status');
    var config    = null;

    // \u2500\u2500 Load config \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    async function loadConfig() {
      try {
        var res = await fetch('/api/config');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        config = await res.json();
        renderEditor();
      } catch (err) {
        loading.textContent = 'Failed to load config: ' + err.message;
      }
    }

    // \u2500\u2500 Save config \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    async function saveConfig() {
      readFormIntoConfig();
      saveBtn.disabled = true;
      statusEl.textContent = 'Saving...';
      statusEl.dataset.type = '';
      try {
        var res = await fetch('/api/config', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        statusEl.textContent = 'Saved!';
        statusEl.dataset.type = 'success';
      } catch (err) {
        statusEl.textContent = 'Save failed: ' + err.message;
        statusEl.dataset.type = 'error';
      } finally {
        saveBtn.disabled = false;
        setTimeout(function () { statusEl.textContent = ''; }, 3000);
      }
    }
    saveBtn.addEventListener('click', saveConfig);

    // \u2500\u2500 Read form values back into config \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function readFormIntoConfig() {
      // Contact
      ['louisville', 'lexington', 'nky'].forEach(function (key) {
        var label   = document.querySelector('[data-contact="' + key + '"] [data-field="label"]');
        var display = document.querySelector('[data-contact="' + key + '"] [data-field="display"]');
        var href    = document.querySelector('[data-contact="' + key + '"] [data-field="href"]');
        if (label)   config.contact[key].label   = label.value;
        if (display) config.contact[key].display = display.value;
        if (href)    config.contact[key].href    = href.value;
      });

      // Services
      config.services.forEach(function (svc, si) {
        var svcEl = document.querySelector('[data-svc-idx="' + si + '"]');
        if (!svcEl) return;

        svc.label       = val(svcEl, 'label');
        svc.subtitle    = val(svcEl, 'subtitle');
        svc.description = val(svcEl, 'description');

        // Qualifier
        svc.qualifier.question = val(svcEl, 'qualifier-question');
        var pillCards = svcEl.querySelectorAll('.admin-pills-list > .admin-pill-card');
        svc.qualifier.pills = Array.from(pillCards).map(function (card) {
          var label = card.querySelector('[data-pill-label]').value.trim();
          if (!label) return null;
          // Preserve existing pill fields not in the form (cardIcon, cardDesc, cardTag)
          var existingPill = (svc.qualifier.pills[Array.from(pillCards).indexOf(card)]) || {};
          if (typeof existingPill === 'string') existingPill = {};
          var pill = { label: label };
          if (existingPill.cardIcon) pill.cardIcon = existingPill.cardIcon;
          if (existingPill.cardDesc) pill.cardDesc = existingPill.cardDesc;
          if (existingPill.cardTag) pill.cardTag = existingPill.cardTag;
          var action = card.querySelector('[data-pill-action]').value;
          if (action === 'redirect') {
            pill.action = 'redirect';
            var redirect = card.querySelector('[data-pill-redirect]').value;
            if (redirect) pill.redirect = redirect;
          } else if (action === 'info') {
            pill.action = 'info';
            var infoKey = card.querySelector('[data-pill-info-key]').value.trim();
            if (infoKey) pill.infoKey = infoKey;
          } else if (action === 'explain') {
            pill.action = 'explain';
          }
          // Custom tiers
          var customCheck = card.querySelector('[data-pill-custom-tiers]');
          if (customCheck && customCheck.checked) {
            var tierCards = card.querySelectorAll('.admin-tier-card');
            if (tierCards.length > 0) {
              pill.tiers = Array.from(tierCards).map(function (tierEl) {
                return readTierFromEl(tierEl);
              });
            }
          }
          return pill;
        }).filter(Boolean);

        // Default tiers (direct children, not inside pill cards)
        var defaultTierEls = svcEl.querySelectorAll(':scope > .admin-service-body > .admin-tier-grid > .admin-tier-card');
        if (defaultTierEls.length > 0) {
          svc.tiers = Array.from(defaultTierEls).map(function (tierEl, ti) {
            var existing = svc.tiers[ti] || {};
            return readTierFromEl(tierEl, existing);
          });
        }
      });

      function readTierFromEl(tierEl, existing) {
        var tier = Object.assign({}, existing || {});
        tier.label      = tierEl.dataset.tier || tier.label || '';
        tier.headline   = tval(tierEl, 'headline');
        tier.price      = tval(tierEl, 'price');
        tier.priceRange = tval(tierEl, 'priceRange') || undefined;
        tier.financing  = tval(tierEl, 'financing') || undefined;
        tier.cta        = tval(tierEl, 'cta');
        tier.popular    = tierEl.querySelector('[data-field="popular"]')?.checked || false;
        if (!tier.popular) delete tier.popular;
        var imgPathEl = tierEl.querySelector('[data-field="image"]');
        if (imgPathEl && imgPathEl.value) tier.image = imgPathEl.value;
        else if (imgPathEl) delete tier.image;
        var featInputs = tierEl.querySelectorAll('.admin-feat-input');
        tier.features = Array.from(featInputs).map(function (inp) { return inp.value.trim(); }).filter(Boolean);
        return tier;
      }

      function val(el, field) {
        var inp = el.querySelector('[data-field="' + field + '"]');
        return inp ? inp.value.trim() : '';
      }
      function tval(el, field) {
        var inp = el.querySelector('[data-field="' + field + '"]');
        return inp ? inp.value.trim() : '';
      }
    }

    // \u2500\u2500 Render the editor \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function renderEditor() {
      var html = '';

      // Tabs
      html += '<div class="admin-tabs">' +
        '<button class="admin-tab" data-tab="leads">Leads</button>' +
        '<button class="admin-tab" data-tab="analytics">Analytics</button>' +
        '<button class="admin-tab" data-tab="services" data-active="true">Services &amp; Pricing</button>' +
        '<button class="admin-tab" data-tab="settings">Settings</button>' +
        '<button class="admin-tab" data-tab="contact">Contact Numbers</button>' +
        '<button class="admin-tab" data-tab="chat">AI Chat</button>' +
      '</div>';

      // \u2500\u2500 Contact panel \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      html += '<div class="admin-tab-panel" data-tab="contact">';
      html += '<div class="admin-contact-grid">';
      Object.keys(config.contact).forEach(function (key) {
        var c = config.contact[key];
        html +=
          '<div class="admin-contact-card" data-contact="' + esc(key) + '">' +
            '<h3>' + esc(c.label) + '</h3>' +
            field('Label', 'label', c.label) +
            field('Display Number', 'display', c.display) +
            field('Phone Link (tel:...)', 'href', c.href) +
          '</div>';
      });
      html += '</div></div>';

      // \u2500\u2500 Leads panel \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      html += '<div class="admin-tab-panel" data-tab="leads">' +
        '<div class="admin-leads-toolbar">' +
          '<select id="leads-status-filter">' +
            '<option value="">All Statuses</option>' +
            '<option value="new">New</option>' +
            '<option value="contacted">Contacted</option>' +
            '<option value="scheduled">Scheduled</option>' +
            '<option value="completed">Completed</option>' +
            '<option value="cancelled">Cancelled</option>' +
          '</select>' +
          '<input type="text" id="leads-search" placeholder="Search by name or phone..." style="width:220px;" />' +
          '<button class="admin-export-btn" id="leads-export" type="button">Export CSV</button>' +
          '<span class="leads-count" id="leads-count"></span>' +
        '</div>' +
        '<div id="leads-table-wrap"></div>' +
      '</div>';

      // \u2500\u2500 Analytics panel \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      html += '<div class="admin-tab-panel" data-tab="analytics">' +
        '<div id="analytics-content"><div class="admin-loading">Loading analytics...</div></div>' +
      '</div>';

      // \u2500\u2500 Settings panel (trust signals + availability + SMS) \u2500\u2500\u2500\u2500
      html += '<div class="admin-tab-panel" data-tab="settings">';
      html += renderPriceFlowPanel();
      html += renderSettingsPanel();
      html += renderSmsTemplatePanel();
      html += '</div>';

      // \u2500\u2500 Chat panel \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      html += '<div class="admin-tab-panel" data-tab="chat">';
      html += '<div class="admin-chat-config">' +
        '<h2 style="font-size:18px;font-weight:700;margin-bottom:16px;">AI Chat Assistant Settings</h2>' +
        '<div class="admin-chat-info">' +
          '<p style="font-size:14px;color:#64748b;margin-bottom:16px;">' +
            'Customize the AI assistant\\\\'s behavior. The system prompt tells the AI how to diagnose problems, when to route to pricing, and when to connect to a specialist. ' +
            'Leave blank to use the built-in default prompt.' +
          '</p>' +
        '</div>' +
        '<div class="admin-field">' +
          '<label for="admin-chat-prompt" style="font-size:13px;font-weight:600;color:#64748b;margin-bottom:6px;display:block;">System Prompt</label>' +
          '<textarea class="admin-chat-prompt" id="admin-chat-prompt" rows="20" placeholder="Leave blank to use default prompt..."></textarea>' +
        '</div>' +
        '<div style="display:flex;gap:10px;align-items:center;margin-top:12px;">' +
          '<button class="admin-save-btn" id="admin-chat-save" type="button">Save Chat Settings</button>' +
          '<button class="admin-chat-reset-btn" id="admin-chat-reset" type="button">Reset to Default</button>' +
          '<span class="admin-status" id="admin-chat-status"></span>' +
        '</div>' +
        '<details style="margin-top:20px;border:1px solid var(--border);border-radius:var(--radius);padding:16px;">' +
          '<summary style="cursor:pointer;font-weight:600;font-size:14px;color:var(--primary);">View Default Prompt</summary>' +
          '<pre class="admin-chat-default-preview" id="admin-chat-default"></pre>' +
        '</details>' +
      '</div></div>';

      // \u2500\u2500 Services panel \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      html += '<div class="admin-tab-panel" data-tab="services" data-active="true">';

      config.services.forEach(function (svc, si) {
        html +=
          '<div class="admin-service" data-svc-idx="' + si + '" data-open="false">' +
            '<div class="admin-service-header">' +
              '<h3>' + esc(svc.label) + '</h3>' +
              '<span class="svc-id">' + esc(svc.id) + '</span>' +
              '<svg class="admin-chevron" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>' +
            '</div>' +
            '<div class="admin-service-body">' +
              '<div class="admin-section-title">Service Info</div>' +
              field('Label', 'label', svc.label) +
              field('Subtitle', 'subtitle', svc.subtitle) +
              field('Description', 'description', svc.description) +

              '<div class="admin-section-title" style="margin-top:20px">Qualifier Question</div>' +
              field('Question', 'qualifier-question', svc.qualifier.question) +
              '<div class="admin-field"><span class="admin-field-label" role="heading" aria-level="4">Answer Options</span>' +
                '<div class="admin-pills-list" data-svc-pills="' + si + '">' +
                svc.qualifier.pills.map(function (p, pi) {
                  return renderPillCard(si, pi, p, svc);
                }).join('') +
                '</div>' +
                '<button class="admin-feat-add" data-add-pill="' + si + '" type="button">+ Add option</button>' +
              '</div>' +

              '<div class="admin-section-title" style="margin-top:20px">Default Packages <span style="font-weight:400;text-transform:none;letter-spacing:0;font-size:12px;color:#94a3b8">(used when an option has no custom tiers)</span></div>' +
              '<div class="admin-tier-grid">' +
              svc.tiers.map(function (tier, ti) {
                return renderTierCard(si, ti, tier);
              }).join('') +
              '</div>' +
            '</div>' +
          '</div>';
      });

      html += '</div>';

      root.innerHTML = html;
      loading.style.display = 'none';
      wireEvents();
      wireChatConfig();
      wireSettings();
      loadLeads();

      // Lead filter events
      var statusFilter = document.getElementById('leads-status-filter');
      var searchInput = document.getElementById('leads-search');
      var exportBtn = document.getElementById('leads-export');
      if (statusFilter) statusFilter.addEventListener('change', renderLeadsTable);
      if (searchInput) searchInput.addEventListener('input', renderLeadsTable);
      if (exportBtn) exportBtn.addEventListener('click', exportCSV);
    }

    function normPill(p) { return typeof p === 'string' ? { label: p } : p; }

    function renderPillCard(si, pi, rawPill, svc) {
      var pill = normPill(rawPill);
      var action = pill.action || 'default';
      var hasTiers = pill.tiers && pill.tiers.length > 0;
      var badgeLabel = action === 'default' ? (hasTiers ? 'Custom Tiers' : 'Default Tiers') : (action === 'redirect' ? 'Redirect' : (action === 'explain' ? 'Explain Panel' : 'Info Screen'));
      var badgeAction = hasTiers ? 'custom' : action;

      var serviceOptions = config.services.map(function (s) {
        var selected = (pill.redirect === s.id) ? ' selected' : '';
        return '<option value="' + escAttr(s.id) + '"' + selected + '>' + esc(s.label) + '</option>';
      }).join('');

      var tiersHtml = '';
      if (hasTiers) {
        tiersHtml = '<div class="admin-tier-grid" style="margin-top:12px">' +
          pill.tiers.map(function (tier, ti) {
            return renderTierCard(si + '-p' + pi, ti, tier);
          }).join('') +
          '</div>';
      }

      return (
        '<div class="admin-pill-card" data-pill-idx="' + pi + '" data-open="false" data-has-tiers="' + hasTiers + '">' +
          '<div class="admin-pill-header">' +
            '<svg class="admin-pill-expand" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>' +
            '<input class="admin-pill-label-input" data-pill-label value="' + escAttr(pill.label) + '" />' +
            '<span class="admin-pill-action-badge" data-action="' + badgeAction + '">' + badgeLabel + '</span>' +
            '<button class="admin-pill-remove" type="button">&times;</button>' +
          '</div>' +
          '<div class="admin-pill-body">' +
            '<div class="admin-pill-config">' +
              '<div class="admin-pill-action-row">' +
                '<label style="font-size:12px;font-weight:600;color:#64748b;">Behavior: ' +
                '<select class="admin-pill-action-select" data-pill-action>' +
                  '<option value="default"' + (action === 'default' ? ' selected' : '') + '>Show pricing (default tiers)</option>' +
                  '<option value="redirect"' + (action === 'redirect' ? ' selected' : '') + '>Redirect to another service</option>' +
                  '<option value="info"' + (action === 'info' ? ' selected' : '') + '>Show info screen first</option>' +
                  '<option value="explain"' + (action === 'explain' ? ' selected' : '') + '>Show explain panel (Help Me Choose)</option>' +
                '</select></label>' +
              '</div>' +
              '<div class="admin-pill-redirect-row" data-pill-redirect-row style="display:' + (action === 'redirect' ? 'flex' : 'none') + ';align-items:center;gap:10px;">' +
                '<label style="font-size:12px;font-weight:600;color:#64748b;">Redirect to: ' +
                '<select class="admin-pill-redirect-input" data-pill-redirect>' +
                  '<option value="">Select service...</option>' +
                  serviceOptions +
                '</select></label>' +
              '</div>' +
              '<div class="admin-pill-info-row" data-pill-info-row style="display:' + (action === 'info' ? 'flex' : 'none') + ';align-items:center;gap:10px;">' +
                '<label style="font-size:12px;font-weight:600;color:#64748b;">Info Key: ' +
                '<input class="admin-input admin-input-sm" data-pill-info-key value="' + escAttr(pill.infoKey || '') + '" placeholder="e.g. opener_remote" /></label>' +
              '</div>' +
              '<div class="admin-pill-tiers-section">' +
                '<label class="admin-pill-tiers-toggle">' +
                  '<input type="checkbox" data-pill-custom-tiers' + (hasTiers ? ' checked' : '') + ' />' +
                  '<span>Use custom pricing for this option</span>' +
                '</label>' +
                '<div data-pill-tiers-container style="display:' + (hasTiers ? 'block' : 'none') + '">' +
                  tiersHtml +
                  (!hasTiers ? '' : '') +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }

    function renderTierCard(si, ti, tier) {
      var imgPreview = tier.image
        ? '<img src="' + escAttr(tier.image) + '" alt="' + escAttr(tier.headline) + '" loading="lazy" decoding="async" width="200" height="120">' +
          '<button class="admin-img-remove" data-clear-img="' + si + '-' + ti + '" type="button">&times;</button>'
        : '<div class="upload-hint"><strong>Click to upload</strong> or drag &amp; drop</div>';

      return (
        '<div class="admin-tier-card" data-tier="' + escAttr(tier.label) + '" data-tier-idx="' + ti + '">' +
          '<span class="admin-tier-label">' + esc(tier.label) + '</span>' +

          '<div class="admin-img-area" data-upload="' + si + '-' + ti + '">' +
            imgPreview +
          '</div>' +
          '<input type="hidden" data-field="image" value="' + escAttr(tier.image || '') + '" />' +

          field('Headline', 'headline', tier.headline) +

          '<div class="admin-row">' +
            '<div class="admin-field"><label><span>Price</span>' +
              '<input class="admin-input admin-input-sm" data-field="price" value="' + escAttr(tier.price) + '" /></label>' +
            '</div>' +
            '<div class="admin-field"><label><span>Price Range</span>' +
              '<input class="admin-input admin-input-sm" data-field="priceRange" value="' + escAttr(tier.priceRange || '') + '" placeholder="\u2013 $499" /></label>' +
            '</div>' +
          '</div>' +

          '<div class="admin-field"><label><span>Financing</span>' +
            '<input class="admin-input" data-field="financing" value="' + escAttr(tier.financing || '') + '" placeholder="As low as $35/mo" /></label>' +
          '</div>' +

          field('CTA Text', 'cta', tier.cta) +

          '<div class="admin-popular-check">' +
            '<label><input type="checkbox" data-field="popular"' + (tier.popular ? ' checked' : '') + ' />' +
            ' Mark as "Most Popular"</label>' +
          '</div>' +

          '<div class="admin-field"><span class="admin-field-label" role="heading" aria-level="4">Included Features</span>' +
            '<ul class="admin-features-list" data-features="' + si + '-' + ti + '">' +
            tier.features.map(function (f, fi) {
              return '<li>' +
                '<input class="admin-feat-input" value="' + escAttr(f) + '" />' +
                '<button class="admin-feat-remove" data-feat-remove="' + fi + '" type="button">&times;</button>' +
              '</li>';
            }).join('') +
            '</ul>' +
            '<button class="admin-feat-add" data-add-feat="' + si + '-' + ti + '" type="button">+ Add feature</button>' +
          '</div>' +
        '</div>'
      );
    }

    // \u2500\u2500 Helpers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function field(label, dataField, value) {
      return '<div class="admin-field">' +
        '<label><span>' + esc(label) + '</span>' +
        '<input class="admin-input" data-field="' + escAttr(dataField) + '" value="' + escAttr(value || '') + '" /></label>' +
      '</div>';
    }

    function esc(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
    function escAttr(str) { return esc(str); }

    // \u2500\u2500 Wire up interactive events \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function wireEvents() {
      // Tabs
      root.querySelectorAll('.admin-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          var tabName = tab.dataset.tab;
          root.querySelectorAll('.admin-tab').forEach(function (t) { t.dataset.active = 'false'; });
          root.querySelectorAll('.admin-tab-panel').forEach(function (p) { p.dataset.active = 'false'; });
          tab.dataset.active = 'true';
          root.querySelector('.admin-tab-panel[data-tab="' + tabName + '"]').dataset.active = 'true';
        });
      });

      // Accordion toggle
      root.querySelectorAll('.admin-service-header').forEach(function (header) {
        header.addEventListener('click', function () {
          var svc = header.closest('.admin-service');
          svc.dataset.open = svc.dataset.open === 'true' ? 'false' : 'true';
        });
      });

      // Image upload areas
      root.querySelectorAll('.admin-img-area').forEach(function (area) {
        var key = area.dataset.upload; // "si-ti"
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        area.appendChild(fileInput);

        area.addEventListener('click', function (e) {
          if (e.target.closest('.admin-img-remove')) return;
          fileInput.click();
        });

        fileInput.addEventListener('change', function () {
          if (fileInput.files.length > 0) uploadImage(fileInput.files[0], area, key);
          fileInput.value = '';
        });

        area.addEventListener('dragover', function (e) {
          e.preventDefault();
          area.dataset.dragging = 'true';
        });
        area.addEventListener('dragleave', function () {
          area.dataset.dragging = 'false';
        });
        area.addEventListener('drop', function (e) {
          e.preventDefault();
          area.dataset.dragging = 'false';
          if (e.dataTransfer.files.length > 0) {
            uploadImage(e.dataTransfer.files[0], area, key);
          }
        });
      });

      // Clear image buttons
      root.querySelectorAll('[data-clear-img]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var key = btn.dataset.clearImg;
          var area = root.querySelector('.admin-img-area[data-upload="' + key + '"]');
          var hiddenInput = area.closest('.admin-tier-card').querySelector('[data-field="image"]');
          hiddenInput.value = '';
          area.innerHTML = '<div class="upload-hint"><strong>Click to upload</strong> or drag & drop</div>';
          // Re-add file input
          var fi = document.createElement('input');
          fi.type = 'file'; fi.accept = 'image/*'; fi.style.display = 'none';
          area.appendChild(fi);
        });
      });

      // Add feature buttons
      root.querySelectorAll('[data-add-feat]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var key = btn.dataset.addFeat;
          var list = root.querySelector('[data-features="' + key + '"]');
          var li = document.createElement('li');
          li.innerHTML = '<input class="admin-feat-input" value="" placeholder="New feature..." />' +
            '<button class="admin-feat-remove" type="button">&times;</button>';
          list.appendChild(li);
          li.querySelector('input').focus();
          li.querySelector('.admin-feat-remove').addEventListener('click', function () { li.remove(); });
        });
      });

      // Remove feature buttons
      root.querySelectorAll('.admin-feat-remove').forEach(function (btn) {
        btn.addEventListener('click', function () { btn.closest('li').remove(); });
      });

      // Pill card expand/collapse
      root.querySelectorAll('.admin-pill-header').forEach(function (header) {
        header.addEventListener('click', function (e) {
          if (e.target.closest('.admin-pill-label-input') || e.target.closest('.admin-pill-remove')) return;
          var card = header.closest('.admin-pill-card');
          card.dataset.open = card.dataset.open === 'true' ? 'false' : 'true';
        });
      });

      // Pill action select change
      root.querySelectorAll('[data-pill-action]').forEach(function (sel) {
        sel.addEventListener('change', function () {
          var card = sel.closest('.admin-pill-card');
          var redirectRow = card.querySelector('[data-pill-redirect-row]');
          var infoRow = card.querySelector('[data-pill-info-row]');
          redirectRow.style.display = sel.value === 'redirect' ? 'flex' : 'none';
          infoRow.style.display = sel.value === 'info' ? 'flex' : 'none';
          // Update badge
          var badge = card.querySelector('.admin-pill-action-badge');
          var hasTiers = card.querySelector('[data-pill-custom-tiers]').checked;
          if (hasTiers) {
            badge.dataset.action = 'custom';
            badge.textContent = 'Custom Tiers';
          } else {
            badge.dataset.action = sel.value;
            badge.textContent = sel.value === 'redirect' ? 'Redirect' : (sel.value === 'info' ? 'Info Screen' : 'Default Tiers');
          }
        });
      });

      // Custom tiers toggle
      root.querySelectorAll('[data-pill-custom-tiers]').forEach(function (cb) {
        cb.addEventListener('change', function () {
          var card = cb.closest('.admin-pill-card');
          var container = card.querySelector('[data-pill-tiers-container]');
          var badge = card.querySelector('.admin-pill-action-badge');
          card.dataset.hasTiers = cb.checked ? 'true' : 'false';
          if (cb.checked) {
            container.style.display = 'block';
            badge.dataset.action = 'custom';
            badge.textContent = 'Custom Tiers';
            // If no tier cards exist, create default 3
            if (!container.querySelector('.admin-tier-card')) {
              var si = card.closest('[data-svc-idx]').dataset.svcIdx;
              var pi = card.dataset.pillIdx;
              var prefix = si + '-p' + pi;
              var defaultTiers = [
                { label: 'Good', headline: '', price: '', priceRange: '', features: [], cta: 'Book Good' },
                { label: 'Better', headline: '', price: '', priceRange: '', features: [], cta: 'Book Better', popular: true },
                { label: 'Best', headline: '', price: '', priceRange: '', features: [], cta: 'Book Best' }
              ];
              container.innerHTML = '<div class="admin-tier-grid" style="margin-top:12px">' +
                defaultTiers.map(function (t, ti) { return renderTierCard(prefix, ti, t); }).join('') +
              '</div>';
              wireImageUploads(container);
              wireFeatButtons(container);
            }
          } else {
            container.style.display = 'none';
            var action = card.querySelector('[data-pill-action]').value;
            badge.dataset.action = action;
            badge.textContent = action === 'redirect' ? 'Redirect' : (action === 'info' ? 'Info Screen' : 'Default Tiers');
          }
        });
      });

      // Add pill buttons
      root.querySelectorAll('[data-add-pill]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var si = btn.dataset.addPill;
          var svc = config.services[si];
          var list = root.querySelector('[data-svc-pills="' + si + '"]');
          var pi = list.children.length;
          var newPill = { label: '' };
          var tempDiv = document.createElement('div');
          tempDiv.innerHTML = renderPillCard(si, pi, newPill, svc);
          var card = tempDiv.firstElementChild;
          list.appendChild(card);
          card.dataset.open = 'true';
          card.querySelector('.admin-pill-label-input').focus();
          // Wire events for the new card
          card.querySelector('.admin-pill-header').addEventListener('click', function (e) {
            if (e.target.closest('.admin-pill-label-input') || e.target.closest('.admin-pill-remove')) return;
            card.dataset.open = card.dataset.open === 'true' ? 'false' : 'true';
          });
          card.querySelector('.admin-pill-remove').addEventListener('click', function () { card.remove(); });
          card.querySelector('[data-pill-action]').addEventListener('change', function () {
            var sel = card.querySelector('[data-pill-action]');
            card.querySelector('[data-pill-redirect-row]').style.display = sel.value === 'redirect' ? 'flex' : 'none';
            card.querySelector('[data-pill-info-row]').style.display = sel.value === 'info' ? 'flex' : 'none';
          });
          var cb = card.querySelector('[data-pill-custom-tiers]');
          cb.addEventListener('change', function () {
            var container = card.querySelector('[data-pill-tiers-container]');
            card.dataset.hasTiers = cb.checked ? 'true' : 'false';
            if (cb.checked) {
              container.style.display = 'block';
              if (!container.querySelector('.admin-tier-card')) {
                var prefix = si + '-p' + pi;
                var defaultTiers = [
                  { label: 'Good', headline: '', price: '', priceRange: '', features: [], cta: 'Book Good' },
                  { label: 'Better', headline: '', price: '', priceRange: '', features: [], cta: 'Book Better', popular: true },
                  { label: 'Best', headline: '', price: '', priceRange: '', features: [], cta: 'Book Best' }
                ];
                container.innerHTML = '<div class="admin-tier-grid" style="margin-top:12px">' +
                  defaultTiers.map(function (t, ti) { return renderTierCard(prefix, ti, t); }).join('') +
                '</div>';
                wireImageUploads(container);
                wireFeatButtons(container);
              }
            } else {
              container.style.display = 'none';
            }
          });
        });
      });

      // Remove pill buttons
      root.querySelectorAll('.admin-pill-remove').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          btn.closest('.admin-pill-card').remove();
        });
      });
    }

    // \u2500\u2500 Wire helpers for dynamically added content \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function wireImageUploads(container) {
      container.querySelectorAll('.admin-img-area').forEach(function (area) {
        var key = area.dataset.upload;
        var fileInput = document.createElement('input');
        fileInput.type = 'file'; fileInput.accept = 'image/*'; fileInput.style.display = 'none';
        area.appendChild(fileInput);
        area.addEventListener('click', function (e) {
          if (e.target.closest('.admin-img-remove')) return;
          fileInput.click();
        });
        fileInput.addEventListener('change', function () {
          if (fileInput.files.length > 0) uploadImage(fileInput.files[0], area, key);
          fileInput.value = '';
        });
        area.addEventListener('dragover', function (e) { e.preventDefault(); area.dataset.dragging = 'true'; });
        area.addEventListener('dragleave', function () { area.dataset.dragging = 'false'; });
        area.addEventListener('drop', function (e) {
          e.preventDefault(); area.dataset.dragging = 'false';
          if (e.dataTransfer.files.length > 0) uploadImage(e.dataTransfer.files[0], area, key);
        });
      });
    }

    function wireFeatButtons(container) {
      container.querySelectorAll('[data-add-feat]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var key = btn.dataset.addFeat;
          var list = container.querySelector('[data-features="' + key + '"]');
          if (!list) list = root.querySelector('[data-features="' + key + '"]');
          var li = document.createElement('li');
          li.innerHTML = '<input class="admin-feat-input" value="" placeholder="New feature..." />' +
            '<button class="admin-feat-remove" type="button">&times;</button>';
          list.appendChild(li);
          li.querySelector('input').focus();
          li.querySelector('.admin-feat-remove').addEventListener('click', function () { li.remove(); });
        });
      });
      container.querySelectorAll('.admin-feat-remove').forEach(function (btn) {
        btn.addEventListener('click', function () { btn.closest('li').remove(); });
      });
    }

    // \u2500\u2500 Image upload \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    async function uploadImage(file, area, key) {
      area.innerHTML = '<div class="upload-hint">Uploading...</div>';

      var formData = new FormData();
      formData.append('file', file);

      try {
        var res = await fetch('/api/upload', { method: 'POST', body: formData });
        var data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');

        var imgPath = data.path;
        var tierCard = area.closest('.admin-tier-card');
        tierCard.querySelector('[data-field="image"]').value = imgPath;

        area.innerHTML =
          '<img src="' + escAttr(imgPath) + '" alt="Uploaded image" loading="lazy" decoding="async" width="200" height="120" />' +
          '<button class="admin-img-remove" data-clear-img="' + key + '" type="button">&times;</button>';

        // Re-wire clear button
        area.querySelector('.admin-img-remove').addEventListener('click', function (e) {
          e.stopPropagation();
          tierCard.querySelector('[data-field="image"]').value = '';
          area.innerHTML = '<div class="upload-hint"><strong>Click to upload</strong> or drag & drop</div>';
        });

        // Re-add hidden file input
        var fi = document.createElement('input');
        fi.type = 'file'; fi.accept = 'image/*'; fi.style.display = 'none';
        area.appendChild(fi);
        fi.addEventListener('change', function () {
          if (fi.files.length > 0) uploadImage(fi.files[0], area, key);
          fi.value = '';
        });

      } catch (err) {
        area.innerHTML = '<div class="upload-hint" style="color:#ef4444">Upload failed: ' + esc(err.message) + '</div>';
        // Re-add file input
        var fi2 = document.createElement('input');
        fi2.type = 'file'; fi2.accept = 'image/*'; fi2.style.display = 'none';
        area.appendChild(fi2);
      }
    }

    // \u2500\u2500 Chat config \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    var chatPromptEl = null;
    var chatStatusEl = null;

    function wireChatConfig() {
      chatPromptEl = document.getElementById('admin-chat-prompt');
      chatStatusEl = document.getElementById('admin-chat-status');
      var chatSaveBtn = document.getElementById('admin-chat-save');
      var chatResetBtn = document.getElementById('admin-chat-reset');
      var chatDefaultEl = document.getElementById('admin-chat-default');

      if (!chatPromptEl) return;

      // Show default prompt preview
      if (chatDefaultEl) {
        fetch('/api/chat-config').then(function (r) { return r.json(); }).then(function () {
          // We'll fetch the default from the server prompt
          chatDefaultEl.textContent = '(The default prompt includes detailed garage door diagnostic knowledge, 70% confidence routing rules, and conversation guidelines. Save a blank prompt to use the default.)';
        });
      }

      // Load existing custom prompt
      fetch('/api/chat-config')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.systemPrompt) chatPromptEl.value = data.systemPrompt;
        })
        .catch(function () { /* no config yet */ });

      chatSaveBtn.addEventListener('click', function () {
        var prompt = chatPromptEl.value.trim();
        chatStatusEl.textContent = 'Saving...';
        chatStatusEl.dataset.type = '';
        fetch('/api/chat-config', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ systemPrompt: prompt }),
        })
          .then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            chatStatusEl.textContent = 'Saved!';
            chatStatusEl.dataset.type = 'success';
          })
          .catch(function (err) {
            chatStatusEl.textContent = 'Save failed: ' + err.message;
            chatStatusEl.dataset.type = 'error';
          })
          .finally(function () {
            setTimeout(function () { chatStatusEl.textContent = ''; }, 3000);
          });
      });

      chatResetBtn.addEventListener('click', function () {
        chatPromptEl.value = '';
        chatStatusEl.textContent = 'Prompt cleared. Click Save to apply.';
        chatStatusEl.dataset.type = '';
        setTimeout(function () { chatStatusEl.textContent = ''; }, 3000);
      });
    }

    // \u2500\u2500 Settings panel rendering \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function renderPriceFlowPanel() {
      var pf = config.priceFlow === 'info-first' ? 'info-first' : 'price-first';
      return (
        '<div class="admin-settings-card">' +
          '<h3>Quote Flow (Test)</h3>' +
          '<p style="font-size:13px;color:#64748b;margin-bottom:12px;">Choose whether the widget captures the visitor\\\\u2019s contact info before or after they see pricing. Affects both the "I know my issue" and opener-guide paths.</p>' +
          '<div class="admin-toggle-row" style="align-items:flex-start;gap:10px;">' +
            '<input type="radio" name="price-flow" id="pf-price-first" value="price-first"' + (pf === 'price-first' ? ' checked' : '') + ' />' +
            '<label for="pf-price-first" style="line-height:1.4;">' +
              '<strong>Price first</strong> \\\\u2014 show tiered pricing immediately, collect contact info only when they click Book. <em style="color:#64748b;">(Default, least friction)</em>' +
            '</label>' +
          '</div>' +
          '<div class="admin-toggle-row" style="align-items:flex-start;gap:10px;margin-top:8px;">' +
            '<input type="radio" name="price-flow" id="pf-info-first" value="info-first"' + (pf === 'info-first' ? ' checked' : '') + ' />' +
            '<label for="pf-info-first" style="line-height:1.4;">' +
              '<strong>Info first</strong> \\\\u2014 require name, phone & ZIP <em>before</em> showing pricing. <em style="color:#64748b;">(Higher lead capture, more friction)</em>' +
            '</label>' +
          '</div>' +
        '</div>'
      );
    }

    function renderSettingsPanel() {
      var ts = config.trustSignals || { enabled: false, rating: '4.9', reviewCount: '127', jobCount: '2,500+', badges: ['Licensed & Insured', 'Same-Day Service'] };
      var av = config.availability || { enabled: false, message: 'Technician available today' };

      var badgesHtml = (ts.badges || []).map(function (b, i) {
        return '<div class="admin-badge-chip">' +
          '<input data-badge-idx="' + i + '" value="' + escAttr(b) + '" />' +
          '<button data-remove-badge="' + i + '" type="button">&times;</button>' +
        '</div>';
      }).join('');

      return (
        '<div class="admin-settings-card">' +
          '<h3>Trust Signals</h3>' +
          '<p style="font-size:13px;color:#64748b;margin-bottom:12px;">Displayed below the pricing header to build confidence.</p>' +
          '<div class="admin-toggle-row">' +
            '<input type="checkbox" id="trust-enabled"' + (ts.enabled ? ' checked' : '') + ' />' +
            '<label for="trust-enabled">Show trust signals on pricing screen</label>' +
          '</div>' +
          '<div class="admin-row">' +
            '<div class="admin-field"><label for="trust-rating">Google Rating</label><input class="admin-input admin-input-sm" id="trust-rating" value="' + escAttr(ts.rating || '') + '" /></div>' +
            '<div class="admin-field"><label for="trust-reviews">Review Count</label><input class="admin-input admin-input-sm" id="trust-reviews" value="' + escAttr(ts.reviewCount || '') + '" /></div>' +
            '<div class="admin-field"><label for="trust-jobs">Jobs Completed</label><input class="admin-input admin-input-sm" id="trust-jobs" value="' + escAttr(ts.jobCount || '') + '" /></div>' +
          '</div>' +
          '<div class="admin-field"><span class="admin-field-label" role="heading" aria-level="4">Trust Badges</span>' +
            '<div class="admin-badges-list" id="trust-badges">' + badgesHtml + '</div>' +
            '<button class="admin-feat-add" id="trust-add-badge" type="button" style="margin-top:8px;">+ Add badge</button>' +
          '</div>' +
        '</div>' +
        '<div class="admin-settings-card">' +
          '<h3>Availability Message</h3>' +
          '<p style="font-size:13px;color:#64748b;margin-bottom:12px;">Shown on the widget home screen to create urgency.</p>' +
          '<div class="admin-toggle-row">' +
            '<input type="checkbox" id="avail-enabled"' + (av.enabled ? ' checked' : '') + ' />' +
            '<label for="avail-enabled">Show availability badge</label>' +
          '</div>' +
          '<div class="admin-field"><label for="avail-message">Message</label><input class="admin-input" id="avail-message" value="' + escAttr(av.message || '') + '" style="max-width:400px;" /></div>' +
        '</div>'
      );
    }

    function renderSmsTemplatePanel() {
      var tpl = config.smsTemplate || 'Hi {name}! Thanks for requesting a {tier} {service} appointment (estimated {price}) with Derby Strong Garage Doors. A specialist will contact you shortly to confirm your visit. Questions? Call us at 502-619-5198.';
      return (
        '<div class="admin-settings-card">' +
          '<h3>SMS Confirmation Template</h3>' +
          '<p style="font-size:13px;color:#64748b;margin-bottom:12px;">Customize the text message sent to customers after booking. Use placeholders: <code>{name}</code>, <code>{service}</code>, <code>{tier}</code>, <code>{price}</code>, <code>{phone}</code></p>' +
          '<textarea class="admin-chat-prompt" id="sms-template" rows="4" style="min-height:100px;">' + esc(tpl) + '</textarea>' +
          '<p style="font-size:12px;color:#94a3b8;margin-top:6px;">Requires Twilio configuration (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER in .env)</p>' +
        '</div>'
      );
    }

    // \u2500\u2500 Read settings into config on save \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    var origReadFormIntoConfig = readFormIntoConfig;
    readFormIntoConfig = function () {
      origReadFormIntoConfig();

      // Price flow toggle
      var pfChecked = document.querySelector('input[name="price-flow"]:checked');
      if (pfChecked) {
        config.priceFlow = pfChecked.value === 'info-first' ? 'info-first' : 'price-first';
      }

      // Trust signals
      var trustEnabled = document.getElementById('trust-enabled');
      var trustRating = document.getElementById('trust-rating');
      var trustReviews = document.getElementById('trust-reviews');
      var trustJobs = document.getElementById('trust-jobs');
      if (trustEnabled) {
        var badges = [];
        document.querySelectorAll('#trust-badges [data-badge-idx]').forEach(function (inp) {
          var v = inp.value.trim();
          if (v) badges.push(v);
        });
        config.trustSignals = {
          enabled: trustEnabled.checked,
          rating: trustRating ? trustRating.value.trim() : '',
          reviewCount: trustReviews ? trustReviews.value.trim() : '',
          jobCount: trustJobs ? trustJobs.value.trim() : '',
          badges: badges
        };
      }

      // Availability
      var availEnabled = document.getElementById('avail-enabled');
      var availMessage = document.getElementById('avail-message');
      if (availEnabled) {
        config.availability = {
          enabled: availEnabled.checked,
          message: availMessage ? availMessage.value.trim() : ''
        };
      }

      // SMS template
      var smsEl = document.getElementById('sms-template');
      if (smsEl) {
        config.smsTemplate = smsEl.value.trim();
      }
    };

    // \u2500\u2500 Wire settings events \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function wireSettings() {
      var addBadge = document.getElementById('trust-add-badge');
      if (addBadge) {
        addBadge.addEventListener('click', function () {
          var list = document.getElementById('trust-badges');
          var idx = list.children.length;
          var chip = document.createElement('div');
          chip.className = 'admin-badge-chip';
          chip.innerHTML = '<input data-badge-idx="' + idx + '" value="" placeholder="New badge..." />' +
            '<button data-remove-badge="' + idx + '" type="button">&times;</button>';
          list.appendChild(chip);
          chip.querySelector('input').focus();
          chip.querySelector('button').addEventListener('click', function () { chip.remove(); });
        });
      }
      document.querySelectorAll('[data-remove-badge]').forEach(function (btn) {
        btn.addEventListener('click', function () { btn.closest('.admin-badge-chip').remove(); });
      });
    }

    // \u2500\u2500 Leads management \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    var allBookings = [];

    function loadLeads() {
      fetch('/api/bookings')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          allBookings = data;
          renderLeadsTable();
          renderAnalytics();
        })
        .catch(function () {
          document.getElementById('leads-table-wrap').innerHTML = '<p class="admin-leads-empty">Failed to load leads.</p>';
        });
    }

    function getFilteredBookings() {
      var statusFilter = document.getElementById('leads-status-filter');
      var searchInput = document.getElementById('leads-search');
      var status = statusFilter ? statusFilter.value : '';
      var search = searchInput ? searchInput.value.toLowerCase().trim() : '';
      return allBookings.filter(function (b) {
        if (status && b.status !== status) return false;
        if (search && b.name.toLowerCase().indexOf(search) === -1 && b.phone.indexOf(search) === -1) return false;
        return true;
      });
    }

    function renderLeadsTable() {
      var wrap = document.getElementById('leads-table-wrap');
      var filtered = getFilteredBookings();
      var countEl = document.getElementById('leads-count');
      if (countEl) countEl.textContent = filtered.length + ' lead' + (filtered.length !== 1 ? 's' : '');

      if (filtered.length === 0) {
        wrap.innerHTML = '<div class="admin-leads-empty">No leads found.</div>';
        return;
      }

      var html = '<table class="admin-leads-table"><thead><tr>' +
        '<th>Date</th><th>Name</th><th>Phone</th><th>Service</th><th>Tier</th><th>Price</th><th>Source</th><th>Status</th>' +
      '</tr></thead><tbody>';

      filtered.forEach(function (b) {
        var dateStr = new Date(b.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
        html += '<tr class="admin-leads-row" data-lead-id="' + escAttr(b.id) + '">' +
          '<td>' + esc(dateStr) + '</td>' +
          '<td><strong>' + esc(b.name || '\u2014') + '</strong></td>' +
          '<td>' + esc(formatPhone(b.phone)) + '</td>' +
          '<td>' + esc(b.service) + '</td>' +
          '<td>' + esc(b.tier) + '</td>' +
          '<td>' + esc(b.price) + '</td>' +
          '<td>' + esc(b.source) + '</td>' +
          '<td><span class="status-badge" data-status="' + escAttr(b.status) + '">' + esc(b.status) + '</span></td>' +
        '</tr>';
        html += '<tr class="admin-leads-detail" data-detail-for="' + escAttr(b.id) + '">' +
          '<td colspan="8">' +
            '<div class="admin-leads-detail-inner">' +
              '<div class="detail-section">' +
                '<h4>Contact Info</h4>' +
                '<p style="font-size:14px;margin-bottom:4px;"><strong>Phone:</strong> ' + esc(formatPhone(b.phone)) + '</p>' +
                (b.email ? '<p style="font-size:14px;margin-bottom:4px;"><strong>Email:</strong> ' + esc(b.email) + '</p>' : '') +
                (b.zip ? '<p style="font-size:14px;margin-bottom:4px;"><strong>ZIP:</strong> ' + esc(b.zip) + '</p>' : '') +
                '<p style="font-size:14px;margin-bottom:4px;"><strong>Service ID:</strong> <code>' + esc(b.serviceId) + '</code></p>' +
                '<p style="font-size:13px;color:#94a3b8;margin-top:8px;">Submitted ' + esc(new Date(b.timestamp).toLocaleString()) + '</p>' +
              '</div>' +
              '<div class="detail-section">' +
                '<h4>Status &amp; Notes</h4>' +
                '<div style="margin-bottom:8px;">' +
                  '<label style="font-size:12px;font-weight:600;color:#64748b;">Status<br/>' +
                  '<select class="admin-status-select" data-status-for="' + escAttr(b.id) + '">' +
                    statusOption('new', b.status) +
                    statusOption('contacted', b.status) +
                    statusOption('scheduled', b.status) +
                    statusOption('completed', b.status) +
                    statusOption('cancelled', b.status) +
                  '</select></label>' +
                '</div>' +
                '<div>' +
                  '<label style="font-size:12px;font-weight:600;color:#64748b;">Internal Notes' +
                  '<textarea class="admin-notes-textarea" data-notes-for="' + escAttr(b.id) + '">' + esc(b.notes || '') + '</textarea></label>' +
                  '<button class="admin-notes-save" data-save-lead="' + escAttr(b.id) + '" type="button">Save</button>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</td>' +
        '</tr>';
      });

      html += '</tbody></table>';
      wrap.innerHTML = html;
      wireLeadEvents();
    }

    function statusOption(val, current) {
      return '<option value="' + val + '"' + (val === current ? ' selected' : '') + '>' + val.charAt(0).toUpperCase() + val.slice(1) + '</option>';
    }

    function formatPhone(p) {
      if (!p || p.length < 10) return p || '';
      var d = p.replace(/\\\\D/g, '');
      if (d.length === 10) return '(' + d.slice(0,3) + ') ' + d.slice(3,6) + '-' + d.slice(6);
      if (d.length === 11 && d[0] === '1') return '(' + d.slice(1,4) + ') ' + d.slice(4,7) + '-' + d.slice(7);
      return p;
    }

    function wireLeadEvents() {
      // Row expand/collapse
      document.querySelectorAll('.admin-leads-row').forEach(function (row) {
        row.addEventListener('click', function () {
          var id = row.dataset.leadId;
          var detail = document.querySelector('[data-detail-for="' + id + '"]');
          var isVisible = detail.dataset.visible === 'true';
          // Close all others
          document.querySelectorAll('.admin-leads-detail').forEach(function (d) { d.dataset.visible = 'false'; });
          document.querySelectorAll('.admin-leads-row').forEach(function (r) { r.dataset.expanded = 'false'; });
          if (!isVisible) {
            detail.dataset.visible = 'true';
            row.dataset.expanded = 'true';
          }
        });
      });

      // Status change
      document.querySelectorAll('.admin-status-select').forEach(function (sel) {
        sel.addEventListener('change', function () {
          var id = sel.dataset.statusFor;
          updateLead(id, { status: sel.value });
          // Update badge in row
          var row = document.querySelector('[data-lead-id="' + id + '"]');
          if (row) {
            var badge = row.querySelector('.status-badge');
            badge.dataset.status = sel.value;
            badge.textContent = sel.value;
          }
          // Update local data
          var booking = allBookings.find(function (b) { return b.id === id; });
          if (booking) booking.status = sel.value;
        });
      });

      // Save notes
      document.querySelectorAll('[data-save-lead]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = btn.dataset.saveLead;
          var textarea = document.querySelector('[data-notes-for="' + id + '"]');
          var statusSel = document.querySelector('[data-status-for="' + id + '"]');
          var updates = { notes: textarea.value };
          if (statusSel) updates.status = statusSel.value;
          updateLead(id, updates);
          btn.textContent = 'Saved!';
          setTimeout(function () { btn.textContent = 'Save'; }, 1500);
          // Update local
          var booking = allBookings.find(function (b) { return b.id === id; });
          if (booking) {
            booking.notes = textarea.value;
            if (statusSel) booking.status = statusSel.value;
          }
        });
      });
    }

    function updateLead(id, updates) {
      fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ id: id }, updates))
      }).catch(function (err) { console.error('Failed to update lead:', err); });
    }

    // \u2500\u2500 Export CSV \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function exportCSV() {
      var filtered = getFilteredBookings();
      if (filtered.length === 0) return;
      var headers = ['Date','Name','Phone','ZIP','Email','Service','Service ID','Tier','Price','Source','Status','Notes'];
      var rows = filtered.map(function (b) {
        return [
          b.timestamp, b.name, b.phone, b.zip, b.email,
          b.service, b.serviceId, b.tier, b.price, b.source, b.status, b.notes
        ].map(function (v) { return '"' + String(v || '').replace(/"/g, '""') + '"'; }).join(',');
      });
      var csv = headers.join(',') + '\\\\n' + rows.join('\\\\n');
      var blob = new Blob([csv], { type: 'text/csv' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'derby-leads-' + new Date().toISOString().slice(0,10) + '.csv';
      a.click();
      URL.revokeObjectURL(url);
    }

    // \u2500\u2500 Analytics \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function renderAnalytics() {
      var el = document.getElementById('analytics-content');
      if (!el) return;
      if (allBookings.length === 0) {
        el.innerHTML = '<div class="admin-leads-empty">No leads yet. Analytics will appear once bookings start coming in.</div>';
        return;
      }

      var now = new Date();
      var weekAgo = new Date(now.getTime() - 7 * 86400000);
      var monthAgo = new Date(now.getTime() - 30 * 86400000);

      var thisWeek = allBookings.filter(function (b) { return new Date(b.timestamp) >= weekAgo; });
      var thisMonth = allBookings.filter(function (b) { return new Date(b.timestamp) >= monthAgo; });

      // By service
      var byService = {};
      allBookings.forEach(function (b) {
        byService[b.service] = (byService[b.service] || 0) + 1;
      });

      // By tier
      var byTier = {};
      allBookings.forEach(function (b) {
        if (b.tier) byTier[b.tier] = (byTier[b.tier] || 0) + 1;
      });

      // By source
      var bySource = {};
      allBookings.forEach(function (b) {
        bySource[b.source || 'quote'] = (bySource[b.source || 'quote'] || 0) + 1;
      });

      // By status
      var byStatus = {};
      allBookings.forEach(function (b) {
        byStatus[b.status || 'new'] = (byStatus[b.status || 'new'] || 0) + 1;
      });

      var html = '';

      // Summary cards
      html += '<div class="analytics-grid">' +
        analyticsCard(allBookings.length, 'Total Leads') +
        analyticsCard(thisWeek.length, 'This Week') +
        analyticsCard(thisMonth.length, 'Last 30 Days') +
        analyticsCard(byStatus['new'] || 0, 'New / Uncontacted') +
      '</div>';

      // By service
      html += '<div class="analytics-section"><h3>Leads by Service</h3>';
      html += renderBarChart(byService, ['blue', 'green', 'amber', 'purple', 'teal', 'red']);
      html += '</div>';

      // By tier
      html += '<div class="analytics-section"><h3>Leads by Tier</h3>';
      html += renderBarChart(byTier, ['green', 'amber', 'purple']);
      html += '</div>';

      // By source
      html += '<div class="analytics-section"><h3>Leads by Source</h3>';
      html += renderBarChart(bySource, ['blue', 'teal']);
      html += '</div>';

      // By status
      html += '<div class="analytics-section"><h3>Leads by Status</h3>';
      html += renderBarChart(byStatus, ['blue', 'amber', 'purple', 'green', 'red']);
      html += '</div>';

      el.innerHTML = html;
    }

    function analyticsCard(value, label) {
      return '<div class="analytics-card"><div class="metric">' + value + '</div><div class="metric-label">' + esc(label) + '</div></div>';
    }

    function renderBarChart(data, colors) {
      var entries = Object.entries(data).sort(function (a, b) { return b[1] - a[1]; });
      if (entries.length === 0) return '<p style="color:#94a3b8;font-size:13px;">No data</p>';
      var max = entries[0][1];
      var html = '';
      entries.forEach(function (entry, i) {
        var pct = max > 0 ? Math.round((entry[1] / max) * 100) : 0;
        var color = colors[i % colors.length];
        html += '<div class="analytics-bar-row">' +
          '<span class="analytics-bar-label">' + esc(entry[0]) + '</span>' +
          '<div class="analytics-bar-track"><div class="analytics-bar-fill" data-color="' + color + '" style="width:' + pct + '%"></div></div>' +
          '<span class="analytics-bar-count">' + entry[1] + '</span>' +
        '</div>';
      });
      return html;
    }

    // \u2500\u2500 Keyboard shortcut: Ctrl+S to save \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveConfig();
      }
    });

    // \u2500\u2500 Init \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    loadConfig();
    // Chat config is wired after renderEditor via wireEvents
  })();
  <\/script> </body> </html>`])), renderHead());
}, "/Users/guymei-tal/Desktop/derby-widget/src/pages/admin.astro", void 0);

const $$file = "/Users/guymei-tal/Desktop/derby-widget/src/pages/admin.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Admin,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
