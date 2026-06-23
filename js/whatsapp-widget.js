/**
 * BHAR India — WhatsApp Chat Widget
 * Drop this script on any page: <script src="js/whatsapp-widget.js"></script>
 * Customize WIDGET_CONFIG below if needed.
 */

(function () {
  const WIDGET_CONFIG = {
    phone: "918390500190",                      // WhatsApp number (country code + number, no + or spaces)
    prefilledMessage: "",                        // Optional: pre-fill a message in WhatsApp
    agentName: "BHAR Support",
    agentTitle: "Blue Horizon Automation Research",
    agentStatus: "Typically replies within minutes",
    welcomeMessage: "👋 Hello! Welcome to <strong>BHAR India</strong>.<br><br>If you're looking for <strong>RPA solutions, web applications, Website Development</strong> or <strong>business consulting</strong> or <strong>ERP Implementation</strong> — we'd love to help!<br><br>Tap the button below to chat with us directly on WhatsApp.",
    buttonLabel: "Chat on WhatsApp",
    popupDelay: 2500,   // ms before popup auto-opens on first visit
  };

  // ── Inject Styles ──────────────────────────────────────────────────────────
  const css = `
    #bhar-wa-widget * { box-sizing: border-box; font-family: 'Segoe UI', system-ui, sans-serif; }

    /* Floating button */
    #bhar-wa-fab {
      position: fixed;
      bottom: 96px;
      right: 28px;
      z-index: 9999;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #25D366;
      box-shadow: 0 4px 20px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.2);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s ease;
      outline: none;
    }
    #bhar-wa-fab:hover {
      transform: scale(1.12);
      box-shadow: 0 6px 28px rgba(37,211,102,0.55), 0 4px 12px rgba(0,0,0,0.22);
    }
    #bhar-wa-fab:active { transform: scale(0.95); }
    #bhar-wa-fab svg { width: 32px; height: 32px; }

    /* Pulse ring */
    #bhar-wa-fab::before {
      content: '';
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      border: 2.5px solid rgba(37,211,102,0.55);
      animation: bhar-pulse 2s ease-out infinite;
    }
    @keyframes bhar-pulse {
      0%   { transform: scale(1);   opacity: 1; }
      70%  { transform: scale(1.3); opacity: 0; }
      100% { transform: scale(1.3); opacity: 0; }
    }

    /* Notification dot */
    #bhar-wa-dot {
      position: absolute;
      top: 2px; right: 2px;
      width: 14px; height: 14px;
      background: #FF3B30;
      border: 2px solid #fff;
      border-radius: 50%;
      animation: bhar-bounce 1.4s ease infinite;
    }
    @keyframes bhar-bounce {
      0%,100% { transform: translateY(0); }
      50%      { transform: translateY(-3px); }
    }
    #bhar-wa-dot.hidden { display: none; }

    /* Chat popup */
    #bhar-wa-popup {
      position: fixed;
      bottom: 170px;
      right: 28px;
      z-index: 9998;
      width: 270px;
      border-radius: 16px;
      background: #fff;
      box-shadow: 0 12px 48px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1);
      overflow: hidden;
      transform: translateY(20px) scale(0.92);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.32s cubic-bezier(.34,1.4,.64,1), opacity 0.26s ease;
    }
    #bhar-wa-popup.open {
      transform: translateY(0) scale(1);
      opacity: 1;
      pointer-events: auto;
    }

    /* Header */
    #bhar-wa-header {
      background: linear-gradient(135deg, #1E3570 0%, #162B5E 100%);
      padding: 12px 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
    }
    #bhar-wa-avatar {
      width: 38px; height: 38px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      border: 2px solid rgba(255,255,255,0.4);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }
    #bhar-wa-agent-info { flex: 1; }
    #bhar-wa-agent-name {
      color: #fff;
      font-weight: 700;
      font-size: 15px;
      line-height: 1.2;
      letter-spacing: 0.01em;
    }
    #bhar-wa-agent-title {
      color: rgba(255,255,255,0.75);
      font-size: 11.5px;
      margin-top: 1px;
    }
    #bhar-wa-online {
      display: flex; align-items: center; gap: 5px;
      color: rgba(255,255,255,0.85);
      font-size: 11px;
      margin-top: 4px;
    }
    #bhar-wa-online::before {
      content: '';
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #4ADE80;
      box-shadow: 0 0 0 2px rgba(74,222,128,0.3);
      flex-shrink: 0;
    }
    #bhar-wa-close {
      position: absolute;
      top: 10px; right: 12px;
      background: rgba(255,255,255,0.15);
      border: none; cursor: pointer;
      width: 26px; height: 26px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: #fff;
      font-size: 16px;
      line-height: 1;
      transition: background 0.2s;
    }
    #bhar-wa-close:hover { background: rgba(255,255,255,0.28); }

    /* Body */
    #bhar-wa-body {
      background: #ECE5DD;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8b8a2' fill-opacity='0.18'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      padding: 14px 13px 8px;
      min-height: 100px;
    }
    #bhar-wa-bubble {
      background: #fff;
      border-radius: 0 10px 10px 10px;
      padding: 10px 12px;
      font-size: 12.5px;
      line-height: 1.6;
      color: #2d2d2d;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
      position: relative;
      animation: bhar-fadeup 0.4s ease 0.1s both;
      max-width: 90%;
    }
    #bhar-wa-bubble::before {
      content: '';
      position: absolute;
      top: 0; left: -9px;
      border-width: 0 10px 10px 0;
      border-style: solid;
      border-color: transparent #fff transparent transparent;
    }
    #bhar-wa-time {
      text-align: right;
      font-size: 11px;
      color: #999;
      margin-top: 5px;
    }
    @keyframes bhar-fadeup {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Footer / CTA */
    #bhar-wa-footer {
      background: #fff;
      padding: 10px 13px 13px;
    }
    #bhar-wa-cta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      background: #25D366;
      color: #fff;
      font-weight: 700;
      font-size: 13.5px;
      letter-spacing: 0.02em;
      border: none;
      border-radius: 50px;
      padding: 11px 18px;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s, transform 0.18s, box-shadow 0.2s;
      box-shadow: 0 4px 14px rgba(37,211,102,0.38);
    }
    #bhar-wa-cta:hover {
      background: #1ebe5b;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(37,211,102,0.5);
    }
    #bhar-wa-cta:active { transform: translateY(0); }
    #bhar-wa-cta svg { width: 20px; height: 20px; flex-shrink: 0; }
    #bhar-wa-disclaimer {
      text-align: center;
      font-size: 11px;
      color: #aaa;
      margin-top: 8px;
    }

    @media (max-width: 420px) {
      #bhar-wa-popup { width: calc(100vw - 24px); right: 12px; }
      #bhar-wa-fab   { bottom: 86px; right: 18px; }
      #bhar-wa-popup { bottom: 158px; right: 12px; }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── WhatsApp SVG icon ──────────────────────────────────────────────────────
  const waSVG = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#fff" d="M16 2C8.268 2 2 8.268 2 16c0 2.44.648 4.73 1.78 6.71L2 30l7.51-1.74A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"/>
    <path fill="#25D366" d="M16 4.5c-6.351 0-11.5 5.149-11.5 11.5 0 2.14.587 4.14 1.61 6.85l.19.51-1.12 4.1 4.21-1.1.49.28A11.44 11.44 0 0016 27.5c6.351 0 11.5-5.149 11.5-11.5S22.351 4.5 16 4.5z"/>
    <path fill="#fff" d="M21.84 19.45c-.28-.14-1.66-.82-1.92-.91-.26-.1-.44-.14-.63.14-.19.28-.72.91-.88 1.1-.16.19-.33.21-.61.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.38-1.63-1.54-1.91-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.17.19-.28.28-.47.09-.19.05-.36-.02-.5-.07-.14-.63-1.52-.86-2.08-.23-.55-.46-.47-.63-.48-.16-.01-.35-.01-.54-.01s-.49.07-.75.36c-.26.28-1 .98-1 2.38 0 1.4 1.02 2.75 1.16 2.94.14.19 2 3.06 4.86 4.29.68.29 1.21.47 1.62.6.68.22 1.3.19 1.79.12.55-.08 1.66-.68 1.9-1.33.23-.65.23-1.21.16-1.33-.07-.12-.26-.19-.54-.33z"/>
  </svg>`;

  // ── Build HTML ─────────────────────────────────────────────────────────────
  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');

  const waURL = `https://wa.me/${WIDGET_CONFIG.phone}` +
    (WIDGET_CONFIG.prefilledMessage ? `?text=${encodeURIComponent(WIDGET_CONFIG.prefilledMessage)}` : '');

  const wrapper = document.createElement('div');
  wrapper.id = 'bhar-wa-widget';
  wrapper.innerHTML = `
    <!-- Popup -->
    <div id="bhar-wa-popup" role="dialog" aria-label="Chat with BHAR India on WhatsApp" aria-modal="true">
      <div id="bhar-wa-header">
        <div id="bhar-wa-avatar">🤖</div>
        <div id="bhar-wa-agent-info">
          <div id="bhar-wa-agent-name">${WIDGET_CONFIG.agentName}</div>
          <div id="bhar-wa-agent-title">${WIDGET_CONFIG.agentTitle}</div>
          <div id="bhar-wa-online">${WIDGET_CONFIG.agentStatus}</div>
        </div>
        <button id="bhar-wa-close" aria-label="Close chat">✕</button>
      </div>
      <div id="bhar-wa-body">
        <div id="bhar-wa-bubble">
          ${WIDGET_CONFIG.welcomeMessage}
          <div id="bhar-wa-time">${timeStr}</div>
        </div>
      </div>
      <div id="bhar-wa-footer">
        <a id="bhar-wa-cta" href="${waURL}" target="_blank" rel="noopener noreferrer" aria-label="Open WhatsApp chat">
          ${waSVG}
          ${WIDGET_CONFIG.buttonLabel}
        </a>
        <div id="bhar-wa-disclaimer">You'll be redirected to WhatsApp</div>
      </div>
    </div>

    <!-- FAB -->
    <button id="bhar-wa-fab" aria-label="Chat with us on WhatsApp" title="Chat on WhatsApp">
      ${waSVG}
      <span id="bhar-wa-dot" aria-hidden="true"></span>
    </button>
  `;

  document.body.appendChild(wrapper);

  // ── Logic ──────────────────────────────────────────────────────────────────
  const fab     = document.getElementById('bhar-wa-fab');
  const popup   = document.getElementById('bhar-wa-popup');
  const closeBtn= document.getElementById('bhar-wa-close');
  const dot     = document.getElementById('bhar-wa-dot');

  let isOpen = false;

  function openPopup() {
    isOpen = true;
    popup.classList.add('open');
    dot.classList.add('hidden');
    fab.setAttribute('aria-expanded', 'true');
  }

  function closePopup() {
    isOpen = false;
    popup.classList.remove('open');
    fab.setAttribute('aria-expanded', 'false');
  }

  fab.addEventListener('click', () => isOpen ? closePopup() : openPopup());
  closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closePopup(); });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (isOpen && !wrapper.contains(e.target)) closePopup();
  });

  // Keyboard: ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closePopup();
  });

  // Auto-open once on first visit after delay
  const hasSeenPopup = sessionStorage.getItem('bhar_wa_seen');
  if (!hasSeenPopup) {
    setTimeout(() => {
      openPopup();
      sessionStorage.setItem('bhar_wa_seen', '1');
    }, WIDGET_CONFIG.popupDelay);
  }

  // Track WhatsApp CTA click (optional analytics hook)
  document.getElementById('bhar-wa-cta').addEventListener('click', () => {
    // Example: gtag('event', 'whatsapp_click', { event_category: 'engagement' });
    console.log('[BHAR Widget] WhatsApp CTA clicked');
  });

})();
