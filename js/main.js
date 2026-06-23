/**
 * BHAR India – Main JavaScript v2.0
 * Fixed: dropdown hover/click, navbar, mobile menu, animations
 * File: js/main.js
 */
document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     NAVBAR – Scroll shadow
  ========================================================= */
  const navbar = document.getElementById('navbar');
  function handleNavScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* =========================================================
     DROPDOWN MENUS
     Approach: CSS handles hover (with invisible bridge gap).
     JS adds click-based toggle for keyboard/touch users, and
     closes all dropdowns when clicking outside.
  ========================================================= */
  const dropdownItems = document.querySelectorAll('.has-dropdown');

  dropdownItems.forEach(item => {
    const trigger = item.querySelector(':scope > a');

    // Click toggle (for touch devices & keyboard)
    trigger.addEventListener('click', (e) => {
      // Only prevent default if it's the parent page link
      // and there's a dropdown to show
      const menu = item.querySelector('.dropdown-menu');
      if (!menu) return;

      // On mobile (<1024px), toggle dropdown inline
      if (window.innerWidth < 1024) return; // let mobile nav handle it

      // Desktop: toggle open class
      const isOpen = item.classList.contains('open');
      // Close all other dropdowns first
      dropdownItems.forEach(d => d !== item && d.classList.remove('open'));
      item.classList.toggle('open', !isOpen);
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown')) {
      dropdownItems.forEach(d => d.classList.remove('open'));
    }
  });

  // Close dropdown on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownItems.forEach(d => d.classList.remove('open'));
      closeMobileMenu();
    }
  });

  /* =========================================================
     HAMBURGER + MOBILE NAV
  ========================================================= */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileSubmenuButtons = [];
  const mobileProducts = [
    { hash: 'sap-report', icon: '📊', label: 'SAP Report Generation' },
    { hash: 'gst-calculation', icon: '🧮', label: 'GST Calculation' },
    { hash: 'crm', icon: '💼', label: 'CRM & Lead Management' },
    { hash: 'clinic', icon: '🏥', label: 'Clinic Management' },
    { hash: 'pos-captain', icon: '🧾', label: 'POS + Captain' },
    { hash: 'retail-pos', icon: '🛒', label: 'POS System' },
    { hash: 'sap', icon: '⚙️', label: 'Smart SAP Automation' },
    { hash: 'invoice', icon: '📄', label: 'Invoice Processing' },
    { hash: 'sales-erp', icon: '🔁', label: 'Sales to ERP' },
    { hash: 'assets', icon: '📦', label: 'Asset Management' },
    { hash: 'property', icon: '🏢', label: 'Property Dealer System' },
    { hash: 'ekyc', icon: '🛡️', label: 'E-KYC Automation' }
  ];

  function setMobileSubmenu(button, open) {
    const submenuId = button.getAttribute('aria-controls');
    const submenu = submenuId ? document.getElementById(submenuId) : null;
    if (!submenu) return;
    button.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
    submenu.classList.toggle('open', open);
  }

  function closeMobileSubmenus(exceptButton = null) {
    mobileSubmenuButtons.forEach(button => {
      if (button !== exceptButton) setMobileSubmenu(button, false);
    });
  }

  function initMobileSubmenus() {
    if (!mobileNav) return;

    const labels = Array.from(mobileNav.querySelectorAll(':scope > .mobile-section-label'));
    labels.forEach((label, index) => {
      const submenuItems = [];
      let sibling = label.nextElementSibling;

      while (sibling && !sibling.classList.contains('mobile-divider')) {
        submenuItems.push(sibling);
        sibling = sibling.nextElementSibling;
      }

      if (!submenuItems.length) return;

      const labelText = label.textContent.trim();
      const submenuId = `mobile-submenu-${index + 1}`;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mobile-menu-parent';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', submenuId);
      button.innerHTML = `<span>${labelText}</span><span class="mobile-parent-chevron" aria-hidden="true">&#x2304;</span>`;

      const submenu = document.createElement('div');
      submenu.className = 'mobile-submenu';
      submenu.id = submenuId;

      if (labelText.toLowerCase() === 'products') {
        const existingProductLink = submenuItems.find(item =>
          item.matches?.('a[href*="products.html"]')
        );
        const productPageHref = existingProductLink
          ? existingProductLink.getAttribute('href').split('#')[0]
          : (window.location.pathname.includes('/pages/') ? 'products.html' : 'pages/products.html');

        submenuItems.forEach(item => item.remove());
        mobileProducts.forEach(product => {
          const link = document.createElement('a');
          link.href = `${productPageHref}#${product.hash}`;
          link.innerHTML = `<span aria-hidden="true">${product.icon}</span> ${product.label}`;
          submenu.appendChild(link);
        });
      } else {
        submenuItems.forEach(item => submenu.appendChild(item));
      }

      label.replaceWith(button);
      button.insertAdjacentElement('afterend', submenu);
      mobileSubmenuButtons.push(button);

      button.addEventListener('click', () => {
        const shouldOpen = button.getAttribute('aria-expanded') !== 'true';
        closeMobileSubmenus(button);
        setMobileSubmenu(button, shouldOpen);
      });
    });
  }

  initMobileSubmenus();

  function openMobileMenu() {
    if (!mobileNav || !hamburger) return;
    mobileNav.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileNav || !hamburger) return;
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    closeMobileSubmenus();
  }

  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileNav.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
    });
  }

  // Close mobile nav when a link is clicked
  document.querySelectorAll('#mobileNav a').forEach(a => {
    a.addEventListener('click', closeMobileMenu);
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileNav?.classList.contains('open') &&
        !mobileNav.contains(e.target) &&
        !hamburger?.contains(e.target)) {
      closeMobileMenu();
    }
  });

  /* =========================================================
     SMOOTH SCROLL for anchor links
  ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 10;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* =========================================================
     SCROLL REVEAL
  ========================================================= */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length > 0) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
  }

  /* =========================================================
     BACK TO TOP
  ========================================================= */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* =========================================================
     ANIMATED COUNTERS  [data-counter]
  ========================================================= */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target || el.textContent, 10);
    const suffix = el.dataset.suffix || '';
    if (isNaN(target)) return;
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const val = Math.floor(target * (1 - Math.pow(1 - p, 3)));
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = '1';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(el => counterObs.observe(el));

  /* =========================================================
     PROJECT MODAL
  ========================================================= */
  const projects = {
    1: {
      title: 'RPA Invoice Automation – Finance Sector',
      tags: ['RPA','UiPath','Finance','GST'],
      duration: '3 months', status: 'Completed',
      description: 'Automated end-to-end invoice processing for a mid-size enterprise. Captures invoices from multiple channels, extracts key data using OCR, validates against GST rules, and posts to ERP — reducing manual effort by 85%.',
      features: ['OCR-based invoice extraction', 'GST compliance validation', 'Multi-format support (PDF, email, scan)', 'ERP integration (SAP / Tally)', 'Exception handling & SLA alerts'],
      outcome: '85% reduction in manual processing time, 99.2% data accuracy, ROI achieved in 4 months.',
      tech: ['UiPath', 'Python', 'SQL Server', 'REST API', 'SAP Integration'],
    },
    2: {
      title: 'Sales CRM – Real Estate Company',
      tags: ['Web App','CRM','Real Estate'],
      duration: '4 months', status: 'Completed',
      description: 'Full-featured Sales CRM with lead management, property tracking, follow-up reminders, and analytics dashboards. Mobile-responsive with role-based access control.',
      features: ['Lead capture & pipeline management', 'Property inventory tracking', 'Auto follow-up reminders', 'Performance dashboards', 'Role-based access control'],
      outcome: '40% improvement in lead conversion rate. 60% faster reporting.',
      tech: ['React.js', 'Node.js', 'MongoDB', 'Chart.js', 'AWS'],
    },
    3: {
      title: 'Asset Management Platform – IIT Bombay',
      tags: ['Web App','Asset Tracking','Education'],
      duration: '5 months', status: 'Completed',
      description: 'Comprehensive asset lifecycle management platform for IIT Bombay — handling procurement, allocation, maintenance scheduling, depreciation tracking, and disposal across all departments.',
      features: ['Asset tagging (QR / barcode)', 'Full lifecycle tracking', 'Maintenance scheduling', 'Depreciation reports (SLM/WDV)', 'Multi-department access control'],
      outcome: 'Tracking 10,000+ assets across 30+ departments with complete audit trail.',
      tech: ['Vue.js', 'Laravel', 'MySQL', 'QR Code API', 'PDF Reports'],
    },
    4: {
      title: 'Insurance Claims Automation',
      tags: ['RPA','Insurance','Automation'],
      duration: '6 months', status: 'In Progress',
      description: 'Automating insurance claims pipeline from FNOL through assessment, approval, and settlement. Handles document verification, rule-based approvals, and integrates with legacy insurance systems.',
      features: ['FNOL processing automation', 'KYC / document verification', 'Rule-based claims routing', 'Legacy system integration', 'SLA tracking & escalation'],
      outcome: 'Target: 70% reduction in claims processing time.',
      tech: ['UiPath', 'Python OCR', 'REST APIs', 'SQL', 'Power BI'],
    },
    5: {
      title: 'BrikWisz – Construction Management SaaS',
      tags: ['SaaS','Construction','Web App'],
      duration: 'Ongoing', status: 'Live',
      description: 'Purpose-built SaaS platform for construction and real estate. Manages project timelines, material procurement, contractor billing, daily progress reports, and client communication.',
      features: ['Project & milestone management', 'Material procurement tracking', 'Contractor billing module', 'Daily progress reports with photos', 'Client-facing portal'],
      outcome: 'Live product serving multiple construction companies across India.',
      tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'AWS S3'],
    },
    6: {
      title: 'Business Process Automation – GTCFI',
      tags: ['Automation','Consulting','GTCFI'],
      duration: '2 months', status: 'Completed',
      description: 'End-to-end process audit and automation for GTCFI\'s internal HR, payroll, and reporting workflows. Eliminated manual spreadsheet handling and created automated weekly reports.',
      features: ['HR process automation', 'Payroll data processing bots', 'Automated weekly reports', 'Data validation workflows', 'Process documentation'],
      outcome: '30 hours/week saved on manual data entry and reporting.',
      tech: ['Python', 'Selenium', 'Excel Automation', 'Power Automate'],
    },
  };

  const modalOverlay = document.getElementById('projectModal');
  const modalClose   = document.getElementById('modalClose');

  document.querySelectorAll('[data-project]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const id   = trigger.getAttribute('data-project');
      const data = projects[id];
      if (!data || !modalOverlay) return;

      document.getElementById('modal-title').textContent    = data.title;
      document.getElementById('modal-duration').textContent = '⏱ ' + data.duration;
      document.getElementById('modal-status').textContent   = '● ' + data.status;
      document.getElementById('modal-desc').textContent     = data.description;
      document.getElementById('modal-outcome').textContent  = data.outcome;
      document.getElementById('modal-tags').innerHTML       = data.tags.map(t => `<span class="badge">${t}</span>`).join('');
      document.getElementById('modal-features').innerHTML   = data.features.map(f =>
        `<li style="display:flex;gap:10px;padding:7px 0;border-bottom:1px solid var(--border);font-size:14.5px;color:var(--text-sec);">
          <span style="color:var(--accent);flex-shrink:0;">→</span>${f}
        </li>`
      ).join('');
      document.getElementById('modal-tech').innerHTML = data.tech.map(t =>
        `<span class="badge-copper" style="padding:5px 13px;border-radius:7px;font-size:13px;font-weight:600;background:rgba(196,98,45,0.10);border:1px solid rgba(196,98,45,0.20);color:var(--accent);">${t}</span>`
      ).join('');

      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalClose?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

  /* =========================================================
     HOMEPAGE AUTOMATION SHOWCASE MODAL
     This runs only on pages where #automationGalleryModal exists.
  ========================================================= */
  const automationGalleryModal = document.getElementById('automationGalleryModal');
  if (automationGalleryModal) {
    const automationGalleryClose = document.getElementById('automationGalleryClose');
    const automationGalleryTitle = document.getElementById('automationGalleryTitle');
    const automationGallerySubtitle = document.getElementById('automationGallerySubtitle');
    const automationGalleryDesc = document.getElementById('automationGalleryDesc');
    const automationGalleryPoints = document.getElementById('automationGalleryPoints');
    const automationGalleryImageWrap = document.getElementById('automationGalleryImageWrap');

    function closeAutomationGalleryModal() {
      automationGalleryModal.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.automation-gallery-card').forEach(card => {
      card.addEventListener('click', () => {
        const title = card.dataset.galleryTitle || 'Automation Detail';
        const subtitle = card.dataset.gallerySubtitle || 'Automation Showcase';
        const desc = card.dataset.galleryDesc || '';
        const image = card.dataset.galleryImage || '';
        const points = (card.dataset.galleryPoints || '')
          .split('|')
          .map(item => item.trim())
          .filter(Boolean);

        if (automationGalleryTitle) automationGalleryTitle.textContent = title;
        if (automationGallerySubtitle) automationGallerySubtitle.textContent = subtitle;
        if (automationGalleryDesc) automationGalleryDesc.textContent = desc;
        if (automationGalleryPoints) {
          automationGalleryPoints.innerHTML = points.map(point => `<li>${point}</li>`).join('');
        }
        if (automationGalleryImageWrap) {
          automationGalleryImageWrap.innerHTML = image
            ? `<img src="${image}" alt="${title}">`
            : '<span>Image Preview</span>';
        }

        automationGalleryModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    automationGalleryClose?.addEventListener('click', closeAutomationGalleryModal);
    automationGalleryModal.addEventListener('click', e => {
      if (e.target === automationGalleryModal) closeAutomationGalleryModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && automationGalleryModal.classList.contains('open')) {
        closeAutomationGalleryModal();
      }
    });
  }

  /* =========================================================
     PRODUCT TABS
  ========================================================= */
  document.querySelectorAll('.product-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const container = btn.closest('section') || document;
      container.querySelectorAll('.product-tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.product-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('panel-' + btn.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });

  /* =========================================================
     BLOG FILTER TAGS
  ========================================================= */
  document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      const cat = tag.dataset.filter;
      document.querySelectorAll('.blog-card[data-category]').forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
      });
    });
  });

  // Blog search
  const blogSearch = document.getElementById('blogSearch');
  if (blogSearch) {
    blogSearch.addEventListener('input', () => {
      const q = blogSearch.value.toLowerCase();
      document.querySelectorAll('.blog-card').forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  /* =========================================================
     ACTIVE NAV LINK (multi-page routing)
  ========================================================= */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0].split('/').pop();
    if (href && href === page) a.classList.add('active');
  });

});
